import type pg from 'pg';
import {
  describeDeclaredMember,
  describeUnattested,
  readDeclaredRoleMembers,
  readRoleDeclarations,
  readUnattestedDeclarations,
  roleDeclarationsExist,
} from '../role-declarations.js';
import { roleRetractionsExist } from '../role-retractions.js';
import type { RunContext } from '../run.js';
import type { Achado } from './verify-questions.js';

/**
 * As perguntas sobre a **declaração** — §7.5.4 e §7.5.5 de `db/universo-e-declaracao.md`. Elas saíram
 * de `verify-questions.ts` no gate da declaração, quando passaram de uma para três e aquele arquivo
 * bateu no teto de 400 linhas de `00-nucleo.md` §8.
 *
 * O corte não é de tamanho, é de sujeito: as outras perguntas do `verify` olham o **banco** — papel,
 * alcance, dono, estrutura — e estas olham a **tabela que diz quem é legítimo**. Ela virou o coração
 * do controle no sétimo gate, e o oitavo mediu o que isso custa: quem escreve nela decide o que todas
 * as outras perguntas desculpam.
 *
 * **Quem decide se a pergunta veta continua sendo `verify.ts`**, na tabela única da §13.6.
 */

/**
 * §7.5.4, primeira metade: **a pergunta que não pôde ser feita reprova.**
 *
 * Seis perguntas do `verify` leem `platform.role_declarations` — quem alcança o cliente, o papel de
 * banco, o dono dos schemas, as declarações a mais, e as duas deste arquivo. Num banco em que a
 * `0011` ainda não foi aplicada, elas não têm como responder, e o desfecho honesto é `3` com o motivo
 * na saída: passar em silêncio seria a regressão do `PAP-23` uma camada abaixo, onde o comando fica
 * verde por não ter perguntado.
 */
export async function checkRoleDeclarationsPresent(
  ctx: RunContext,
  client: pg.Client,
): Promise<Achado> {
  if (!(await roleDeclarationsExist(client))) {
    const detalhe =
      'platform.role_declarations não existe neste banco, e é ela que diz quem alcança um cliente ' +
      'legitimamente: as perguntas sobre papel, alcance e dono de schema não foram feitas. Ela nasce ' +
      'em platform/0011__role_declarations.sql, e uma rodada de migrate a aplica ' +
      '(db/universo-e-declaracao.md §7.5.4)';
    ctx.report(`pergunta não feita: ${detalhe}`);
    await ctx.events.record({ kind: 'role_declarations_missing', detail: detalhe });
    return true;
  }

  /**
   * **Sem a retratação, também não há resposta** (`PAP-30`). As perguntas que excluem por
   * declaração excluem só a vigente, e sem `platform.role_retractions` não há como saber qual é:
   * responder como se todas valessem desculparia exatamente o que o operador retratou.
   */
  if (!(await roleRetractionsExist(client))) {
    const detalhe =
      'platform.role_retractions não existe neste banco, e é ela que diz que declaração deixou de ' +
      'valer: as perguntas sobre papel, alcance e dono de schema não foram feitas. Ela nasce em ' +
      'platform/0014__role_retractions.sql, e uma rodada de migrate a aplica ' +
      '(db/universo-e-declaracao.md §7.5.4)';
    ctx.report(`pergunta não feita: ${detalhe}`);
    await ctx.events.record({ kind: 'role_retractions_missing', detail: detalhe });
    return true;
  }

  /**
   * **Tabela vazia é a mesma pergunta não feita, e é o `PAP-27`.**
   *
   * É o estado de todo banco provisionado antes da `0011`, e o de uma rodada de `migrate` que morra
   * entre a stream `platform` e a declaração. Medido em 2026-09-12: o `verify` saía `3` com **treze**
   * linhas acusando dono e alcance, e três delas mandavam devolver a posse de `platform` — que já é
   * do executor. Quem seguisse a instrução impressa emitiria um comando que não muda nada e
   * continuaria com `3`. A saída certa — rodar `migrate`, que declara — estava no documento e não
   * estava na mensagem.
   *
   * Então o arranjo não declarado responde com **uma** linha, e as quatro perguntas que leem a tabela
   * não correm: elas não têm contra o que responder, e onze acusações sobre um estado esperado são o
   * ruído que ensina a ignorar a saída inteira.
   */
  if ((await readRoleDeclarations(client)).length > 0) return false;

  const detalhe =
    'platform.role_declarations existe e está vazia: o arranjo ainda não foi declarado, então as ' +
    'perguntas sobre papel, alcance e dono de schema não foram feitas. É o estado de um banco ' +
    'provisionado antes da 0011, e a saída é uma rodada de migrate — não a devolução de posse que a ' +
    'afirmação de dono pediria (db/universo-e-declaracao.md §7.5.4)';
  ctx.report(`pergunta não feita: ${detalhe}`);
  await ctx.events.record({ kind: 'role_declarations_empty', detail: detalhe });
  return true;
}

/**
 * §7.5.5, o `PAP-24`: **papel declarado não tem membro.**
 *
 * A §7.5.1 exclui por nome e enumera só o membro **direto** de `app_t_<slug>`. Trocada a exclusão
 * para nome, ser membro de um nome excluído virou invisibilidade: medido em 2026-09-12, dois comandos
 * do operador (`CREATE ROLE ops_leitura LOGIN` e `GRANT forja_credencial TO ops_leitura`) entregavam
 * os dois clientes com `verify` em `0` e **nenhuma** linha citando o beneficiário.
 *
 * O conjunto esperado é vazio, então a pergunta é uma afirmação e não uma lista de exceções.
 */
export async function checkDeclaredRoleMembers(
  ctx: RunContext,
  client: pg.Client,
): Promise<Achado> {
  const rows = await readDeclaredRoleMembers(client);
  for (const row of rows) {
    ctx.report(`membro de papel declarado: ${describeDeclaredMember(row)}`);
    await ctx.events.record({
      kind: 'declared_role_member',
      detail: describeDeclaredMember(row),
    });
  }
  return rows.length > 0;
}

/**
 * §7.5.4, o `PAP-25`: **toda declaração tem o `app_role_declared` do ato ao lado.**
 *
 * A §7.5.4 afirmava que ampliar a exclusão é ato datado com autor. Medido em 2026-09-12, o executor
 * escreve na tabela por `INSERT` cru — sem linha impressa, sem evento — e a declaração plantada
 * desculpa o alcance do beneficiário em toda rodada seguinte. A divergência entre a tabela e a trilha
 * de fatos **é** esse `INSERT`.
 */
export async function checkDeclarationsAttested(
  ctx: RunContext,
  client: pg.Client,
): Promise<Achado> {
  const rows = await readUnattestedDeclarations(client);
  for (const row of rows) {
    ctx.report(`declaração sem ato: ${describeUnattested(row)}`);
    await ctx.events.record({
      kind: 'role_declaration_unattested',
      detail: describeUnattested(row),
    });
  }
  return rows.length > 0;
}

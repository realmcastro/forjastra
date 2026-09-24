import type pg from 'pg';
import { APP_CREDENTIAL_ROLE_KEY } from './config.js';
import { refused } from './errors.js';
import type { TenantRoleNames } from './tenant-role.js';

/**
 * A recusa de borda de `db/papel-do-cliente.md` §7.7: o ato do operador (§7.2) é **precondição** do
 * ato do executor (§7.3), e o que outro ato humano deixou pronto se confere antes da primeira
 * escrita — nunca no meio da fila, onde a mensagem do servidor nomeia o objeto que falta e não o ato
 * que alguém esqueceu de rodar.
 *
 * Duas das quatro precondições da §7.7 já são conferidas sem banco: a chave do ambiente, em
 * `config.ts`, e o prefixo reservado sobre os dois nomes que o executor conhece, em `config.ts` e em
 * `executor.ts`. As duas que precisam do catálogo moram aqui, e vão **na mesma consulta**: conferir
 * o grupo e deixar a credencial reproduz o mesmo defeito com outro nome, pelo mesmo custo.
 *
 * **A pergunta pela credencial é o `PAP-07`, e ela confere o ambiente contra o catálogo, não contra
 * si mesmo.** Até a §7.7, a única trava sobre `FORJA_MIGRATOR_APP_CREDENTIAL_ROLE` era o prefixo:
 * um `.env` copiado de outra máquina, nomeando o papel pessoal de quem desenvolve, fazia o `migrate`
 * conceder **todos** os papéis de cliente àquele papel, um por schema visitado, sem erro — e o
 * `verify`, que lê a mesma variável, respondia `conforme`. Verificação que confere o ato contra a
 * mesma entrada que produziu o ato não verifica nada. O fato independente disponível é o catálogo.
 *
 * **Ela não exige que haja *uma* só credencial**, e a ausência é decidida (§7.7): trocar a credencial
 * é criar a nova, conceder, migrar a configuração e só então retirar a velha, e durante essa janela
 * existem duas. Recusar a pluralidade travaria `migrate` no meio de uma rotação.
 */

/**
 * Uma consulta, nenhum privilégio especial: `pg_roles` e `pg_auth_members` são legíveis por qualquer
 * papel, e `to_regrole` devolve nulo em vez de erro para nome que não existe — medido em 2026-09-11,
 * PostgreSQL 16.15, inclusive para nome sintaticamente esquisito (`a b`, `x""y`, `"aspa`), que
 * também volta nulo em vez de derrubar a consulta.
 *
 * `credencial_administra` existe separada de `credencial_no_grupo` porque as duas respostas pedem
 * mãos humanas diferentes: quem entra no grupo **com** `ADMIN OPTION` é o executor (§7.2, quarta
 * linha), então essa coluna verdadeira diz que a chave aponta para o papel errado, e não que o ato
 * do operador esteja pela metade.
 */
const OPERATOR_ACT_SQL = `
SELECT to_regrole($1) IS NOT NULL AS grupo_existe,
       to_regrole($2) IS NOT NULL AS credencial_existe,
       EXISTS (SELECT 1 FROM pg_roles r
                WHERE r.oid = to_regrole($2) AND r.rolcanlogin) AS credencial_conecta,
       EXISTS (SELECT 1 FROM pg_auth_members m
                WHERE m.roleid = to_regrole($1) AND m.member = to_regrole($2)
                  AND NOT m.admin_option) AS credencial_no_grupo,
       EXISTS (SELECT 1 FROM pg_auth_members m
                WHERE m.roleid = to_regrole($1) AND m.member = to_regrole($2)
                  AND m.admin_option) AS credencial_administra
`;

interface OperatorActRow {
  readonly grupo_existe: boolean;
  readonly credencial_existe: boolean;
  readonly credencial_conecta: boolean;
  readonly credencial_no_grupo: boolean;
  readonly credencial_administra: boolean;
}

/**
 * Roda depois da conexão e **antes da primeira escrita**, nos quatro comandos que criam ou conferem
 * papel de cliente. `status` não a chama, porque não pergunta nada sobre papel.
 *
 * Saída `2`, e não `3`, porque `3` é divergência em algo versionado que um comando único corrige
 * (`PROVISION-E-VERIFY.md` §12). Aqui falta um ato do operador, que nenhuma migration executa — a
 * mesma classe de "configuração ausente" do piso de versão e do `lock_timeout`.
 */
export async function assertOperatorActDone(
  client: pg.Client,
  names: TenantRoleNames,
): Promise<void> {
  const resposta = await client.query<OperatorActRow>(OPERATOR_ACT_SQL, [
    names.group,
    names.credential,
  ]);
  const linha = resposta.rows[0];
  if (linha === undefined) {
    throw refused(
      'o servidor não respondeu à pergunta pelo ato do operador (db/papel-do-cliente.md §7.7), e ' +
        'nada foi aplicado.',
    );
  }

  const faltando = describeMissingPreconditions(linha, names);
  if (faltando.length === 0) return;

  throw refused(
    'o ato do operador de db/papel-do-cliente.md §7.2 não está completo neste banco:\n' +
      faltando.map((falta) => `- ${falta}`).join('\n') +
      '\nNada foi aplicado. O executor não roda a §7.2 por você, mesmo onde o servidor permitiria: ' +
      'ela é uma unidade — grupo, credencial, concessão e os dois REVOKE —, e fazer só a parte que ' +
      'falta some com o sintoma sem fazer o trabalho, com a operação achando que o ato rodou.',
  );
}

function describeMissingPreconditions(
  linha: OperatorActRow,
  names: TenantRoleNames,
): readonly string[] {
  const faltando: string[] = [];

  if (!linha.grupo_existe) {
    faltando.push(
      `o grupo "${names.group}" não existe neste cluster: é a primeira linha da §7.2, e sem ele o ` +
        'papel de cliente não tem a que pertencer',
    );
  }

  if (!linha.credencial_existe) {
    faltando.push(
      `${APP_CREDENTIAL_ROLE_KEY} nomeia "${names.credential}", e não há papel com esse nome neste ` +
        'cluster: ou a chave está errada, ou a segunda linha da §7.2 não foi rodada',
    );
    return faltando;
  }

  if (!linha.credencial_conecta) {
    faltando.push(
      `o papel "${names.credential}", nomeado em ${APP_CREDENTIAL_ROLE_KEY}, existe e não tem ` +
        'LOGIN: a credencial da aplicação conecta (§7.2, segunda linha), então este nome é de outro ' +
        'papel',
    );
  }

  /**
   * Sem o grupo não há como distinguir "credencial fora dele" de "grupo inexistente", e as duas
   * frases mandariam investigar coisas diferentes. Uma pergunta sem resposta possível não vira
   * diagnóstico.
   */
  if (linha.grupo_existe && !linha.credencial_no_grupo) {
    faltando.push(
      linha.credencial_administra
        ? `o papel "${names.credential}" administra "${names.group}" (ADMIN OPTION), e quem ` +
          'administra o grupo é o executor (§7.2, quarta linha), nunca a credencial da aplicação: ' +
          `${APP_CREDENTIAL_ROLE_KEY} está apontando para o papel errado`
        : `o papel "${names.credential}" não é membro de "${names.group}": é a terceira linha da ` +
          `§7.2, e é ela que faz dele a credencial da aplicação. Enquanto ela faltar, conceder-lhe ` +
          'o papel de cada cliente seria dar alcance a um papel que ninguém declarou como aplicação',
    );
  }

  return faltando;
}

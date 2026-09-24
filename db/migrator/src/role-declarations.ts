import type pg from 'pg';
import { diverged, refused } from './errors.js';
import { requireAppCredential } from './config.js';
import { assertNoneRetracted, DECLARATION_IN_FORCE_SQL } from './role-retractions.js';
import type { RunContext } from './run.js';
import { uuidV7 } from './uuid-v7.js';

/**
 * `platform.role_declarations`: `db/universo-e-declaracao.md` §7.5.4.
 *
 * **A regra que este arquivo existe para sustentar, em uma frase: propriedade do catálogo só pode
 * acusar, nunca desculpar.**
 *
 * A camada de papel reabriu oito vezes com a mesma anatomia: a pergunta invertida da §7.5.1 enumera
 * quem alcança o schema de um cliente e depois exclui os legítimos por uma propriedade que o próprio
 * beneficiário carrega — `NOT admin_option` (`PAP-14`), membership no grupo com `LOGIN` ou com
 * `admin_option` (`PAP-20`), dependência de extensão (`PAP-21`), posse do schema (`PAP-22`), o nome
 * vindo do ambiente (`PAP-19`). Cada uma dessas propriedades é emitida por quem ataca, com um
 * comando: `GRANT … WITH ADMIN OPTION`, `CREATE ROLE … LOGIN`, `ALTER EXTENSION … ADD`,
 * `ALTER SCHEMA … OWNER TO`, uma linha no `.env`. Por isso cada conserto abria o buraco seguinte uma
 * casa ao lado, e não por descuido de quem corrigiu.
 *
 * A exclusão passa a ser **identidade que nós escrevemos**, conferida por **nome literal**. Quem não
 * está aqui alcança indevidamente, carregue o que carregar. Propriedade do catálogo continua no
 * desenho, só que do lado que **acrescenta** linha — a credencial declarada que saiu do grupo volta a
 * ser acusada (§7.5.1), o dono não-declarado é acusado (§7.5.4) —, nunca do lado que tira.
 *
 * **Quem escreve:** `provision` e `migrate`, uma vez por rodada, depois da recusa de borda da §7.7 e
 * antes de tocar em papel de cliente. **`verify` nunca escreve**, e é isso que mantém a pergunta
 * honesta: quem só verifica não amplia o conjunto que a verificação desculpa.
 */

/** Os dois papéis que o ato do operador da §7.2 cria, e os únicos que a §7.5.1 exclui. */
export type RoleKind = 'executor' | 'app_credential';

/**
 * A condição de permanência do `executor` declarado: **ele é dono de `platform`** (§7.5.4).
 *
 * O gate da declaração (`docs/auditorias/2026-09-12-gate-da-declaracao-camada-de-papel.md`,
 * `PAP-25`) mediu que `role_kind = 'executor'` desculpava **sem condição nenhuma**, enquanto
 * `app_credential` exigia permanência no grupo. O efeito medido: uma linha plantada por `INSERT` cru
 * dava a um papel de fora a posse de `t_acme` e a leitura dos dois clientes com `verify` em `0`; e
 * derrubar o papel e recriar o mesmo nome **rearmava** o ataque, porque a linha não sai da tabela.
 *
 * **Por que `platform`, e não "é dono de algum schema nosso".** A segunda seria a exclusão por
 * propriedade que o beneficiário emite, de novo: `ALTER SCHEMA t_acme OWNER TO <ele>` é um comando do
 * atacante. Transferir a posse de `platform` também é um comando — só que ele **desarma o executor
 * legítimo na mesma passada**: o antigo deixa de ser dono, perde a exclusão, e todo alcance dele
 * passa a ser acusado pela §7.5.1 e pela afirmação de dono. Não existe estado em que a troca seja
 * silenciosa, que é o que se pede de uma condição de permanência.
 *
 * Fragmento sem parâmetro, correlacionado a `d.role_name`: é usado na §7.5.1 (`tenant-reach.ts`) e na
 * afirmação de dono (`schema-universe.ts`), e uma definição só é o ponto — duas produziriam dois
 * conceitos de "executor que ainda vale" para desencontrar.
 */
export const EXECUTOR_STILL_LEGITIMATE_SQL = `
  EXISTS (SELECT 1 FROM pg_namespace pn
           WHERE pn.nspname = 'platform'
             AND pg_get_userbyid(pn.nspowner) = d.role_name)
`;

/**
 * **Todo fato de declaração começa nomeando o papel entre aspas**, e é por essa marca que a §7.5.4
 * confere que a linha da tabela tem o ato ao lado (`UNATTESTED_SQL`).
 *
 * A marca é construída aqui, num lugar só, porque as duas pontas precisam mudar juntas: separadas, a
 * primeira edição de mensagem faria a conferência acusar todo banco saudável — medido em
 * 2026-09-12, quando a primeira versão desta conferência perdeu a aspa de fecho e acusou os dois
 * papéis de um arranjo recém-provisionado.
 */
export function declarationFactDetail(roleName: string, rest: string): string {
  return `"${roleName}" ${rest}`;
}

/**
 * Os dois fatos que atestam uma linha da tabela: o ato que a **escreveu** e o ato que a **assumiu**.
 *
 * O segundo existe porque a tabela é append-only: sem ele, uma linha plantada por `INSERT` cru
 * deixaria o `verify` em `3` para sempre, sem ação humana capaz de devolvê-lo a `0` — e controle sem
 * saída é controle que se aprende a desligar. Assumir é o mesmo ato de declarar, rodado de propósito
 * com aquele nome, e ele grava que a linha **já existia sem ato**.
 */
const ATTESTING_KINDS = ['app_role_declared', 'role_declaration_adopted'];

export interface RoleDeclaration {
  readonly role_name: string;
  readonly role_kind: RoleKind;
  readonly declared_by: string;
}

export interface RoleToDeclare {
  readonly name: string;
  readonly kind: RoleKind;
}

const TABLE_EXISTS_SQL = `
select 1
  from pg_class c join pg_namespace n on n.oid = c.relnamespace
 where n.nspname = 'platform' and c.relname = 'role_declarations' and c.relkind = 'r'
`;

/**
 * `on conflict (role_name) do nothing` faz da segunda rodada um no-op, e o `returning` distingue
 * **declarou agora** de **já estava declarado** — é essa diferença que vira o evento
 * `app_role_declared`. Sem ela, ampliar o conjunto de exclusões seria indistinguível de rodar
 * `migrate` num banco saudável.
 *
 * `declared_by` sai de `current_user` no servidor, e não de `dbRole` do processo: quem ampliou o
 * conjunto é quem **emitiu** a linha, e essa resposta é do banco.
 */
const DECLARE_SQL = `
insert into platform.role_declarations (declaration_id, role_name, role_kind, declared_by)
values ($1, $2, $3, current_user)
on conflict (role_name) do nothing
returning role_name
`;

const READ_SQL = `
select role_name, role_kind, declared_by
  from platform.role_declarations
 order by role_name collate "C"
`;

/**
 * §7.5.5, a pergunta que o `PAP-24` abriu: **papel declarado não tem membro.**
 *
 * A §7.5.1 pergunta quem é membro de `app_t_<slug>` e para no primeiro nível. Enquanto a exclusão era
 * propriedade do catálogo, isso era inócuo — um membro a mais não carregava a propriedade certa e
 * caía na pergunta. Ao trocar a exclusão para **nome**, ser membro de um nome excluído virou
 * invisibilidade. Medido em 2026-09-12, PostgreSQL 16.15, arranjo saudável recém-provisionado, dois
 * comandos na conexão que o operador já tem aberta:
 *
 * ```
 * CREATE ROLE ops_leitura LOGIN;
 * GRANT forja_credencial TO ops_leitura;
 * ```
 *
 * `ops_leitura` faz `SET ROLE forja_credencial; SET ROLE app_t_acme;` e lê os dois clientes, com
 * `verify` em `0`, `migrate` em `0` e **zero linha** citando o nome dele.
 *
 * **O conjunto esperado é vazio**, e é por isso que esta é uma afirmação e não uma enumeração de
 * exceções: nenhum papel deste arranjo nasce com membro. O executor e a credencial são pontas de
 * conexão, não grupos — quem agrupa é `forja_app`, e ele não é declarado nem tem privilégio próprio
 * (§7.1).
 *
 * **Por que ela basta, sem fecho transitivo.** Toda cadeia `intruso → R1 → … → app_t_<slug>` termina
 * em um elo declarado ou não declarado. Se o membro direto de `app_t_<slug>` não é declarado, a
 * §7.5.1 o acusa. Se é, o elo anterior é membro de um papel **declarado** — e esta pergunta o acusa,
 * a menos que ele também seja declarado, caso em que a recursão anda mais um degrau até o intruso.
 * Um intruso que esteja ele próprio declarado é a ampliação do `PAP-25`, que tem pergunta própria.
 * Fecho transitivo nomearia melhor o beneficiário final e custaria uma consulta recursiva; a
 * afirmação de conjunto vazio acusa o mesmo estado e cabe numa leitura.
 *
 * **Declaração não desculpa membro, nem quando o membro também está declarado.** Excluir aqui pelo
 * mesmo conjunto que a §7.5.1 exclui deixaria a linha plantada por `INSERT` cru comprar silêncio nas
 * duas perguntas de uma vez.
 */
const DECLARED_MEMBERS_SQL = `
select d.role_name as papel,
       d.role_kind as especie,
       m.member::regrole::text as membro,
       m.grantor::regrole::text as concedente,
       concat_ws(' e ',
                 case when m.admin_option then 'ADMIN OPTION' end,
                 case when m.inherit_option then 'herança' end) as detalhe
  from platform.role_declarations d
  join pg_auth_members m on m.roleid = to_regrole(d.role_name)::oid
 where to_regrole(d.role_name) is not null
 order by 1, 3, 4
`;

/** Uma linha por membro de papel declarado. Banco íntegro devolve **nenhuma**. */
export interface DeclaredMemberRow {
  readonly papel: string;
  readonly especie: string;
  readonly membro: string;
  /**
   * Quem emitiu a concessão. A chave de `pg_auth_members` é `(roleid, member, grantor)`, então a
   * mesma membership por duas mãos são duas linhas — e o `REVOKE` que a retira é da mão que a emitiu,
   * que é a mesma lição do `PAP-13`.
   */
  readonly concedente: string;
  /** O que a concessão carrega. Descreve; não decide nada — a afirmação é de conjunto vazio. */
  readonly detalhe: string;
}

export async function readDeclaredRoleMembers(
  client: pg.Client,
): Promise<readonly DeclaredMemberRow[]> {
  const result = await client.query<DeclaredMemberRow>(DECLARED_MEMBERS_SQL);
  return result.rows;
}

export function describeDeclaredMember(row: DeclaredMemberRow): string {
  const carga = row.detalhe === '' ? '' : `, com ${row.detalhe}`;
  const alcance =
    row.especie === 'executor'
      ? 'e um executor declarado é dono de platform e de todo schema de cliente'
      : 'e uma credencial declarada assume o papel de banco de todo cliente';
  return (
    `"${row.membro}" é membro de "${row.papel}", que é papel declarado${carga}, por concessão de ` +
    `"${row.concedente}" — ${alcance}. Nenhum papel deste arranjo tem membro: retirar isso é ` +
    'REVOKE, na conexão de quem concedeu (db/universo-e-declaracao.md §7.5.5)'
  );
}

/**
 * A recusa da §7.5.5 no `migrate`, no mesmo molde da §7.5.1: **a convergência não toca nisto**, e
 * parar depois de conceder deixaria privilégio novo num schema que o membro já alcança.
 */
export function declaredMemberError(rows: readonly DeclaredMemberRow[]): Error {
  const linhas = rows
    .map((row) => `"${row.membro}" é membro de "${row.papel}", que é papel declarado`)
    .join('; ');
  return diverged(
    `há membro de papel declarado neste cluster: ${linhas}. Conceder o papel do cliente agora seria ` +
      'entregá-lo ao membro junto, e retirar isso é REVOKE, que este ato não tem ' +
      '(db/universo-e-declaracao.md §7.5.5).',
  );
}

/**
 * §7.5.4, o `PAP-25`: **toda declaração tem o ato ao lado, ou é acusada.**
 *
 * O que a §7.5.4 vendia — "ampliar a exclusão é ato datado com autor" — valia para quem passa por
 * `declareArrangement`. Medido em 2026-09-12: o executor escreve na tabela por `INSERT` cru, sem
 * linha impressa e sem `app_role_declared`, e a declaração plantada desculpa o alcance do beneficiário
 * em toda rodada seguinte. A afirmação inverte isso: a divergência entre a tabela e a trilha de fatos
 * **é** o `INSERT` fora do ato.
 *
 * **O limite, declarado porque ele não é pequeno:** quem escreve a linha crua também consegue gravar
 * o evento (`platform.executor_events` aceita `INSERT` do executor, por desenho — é a tabela de fatos
 * dele). Esta pergunta pega o plantio **descuidado**, não o forjado. O que ela fecha de verdade é a
 * distância entre o que o texto afirmava e o que o banco conferia: antes, nada cobrava a linha datada;
 * agora, ela é cobrada, e forjá-la exige um segundo ato deliberado, que também fica gravado.
 *
 * Linha retratada não é cobrada: ela já não desculpa nada, e a retratação é a segunda saída da linha
 * plantada, a do operador (`PAP-30`).
 */
const UNATTESTED_SQL = `
select d.role_name, d.role_kind, d.declared_by,
       to_char(d.declared_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as declared_at
  from platform.role_declarations d
 where ${DECLARATION_IN_FORCE_SQL}
   and not exists (
         select 1 from platform.executor_events e
          where e.kind_code = any($1::text[])
            and strpos(e.detail, '"' || d.role_name || '" ') = 1)
 order by d.role_name collate "C"
`;

/** Uma declaração sem o `app_role_declared` que o ato emite. Banco íntegro devolve **nenhuma**. */
export interface UnattestedDeclarationRow {
  readonly role_name: string;
  readonly role_kind: string;
  readonly declared_by: string;
  readonly declared_at: string;
}

export async function readUnattestedDeclarations(
  client: pg.Client,
): Promise<readonly UnattestedDeclarationRow[]> {
  const result = await client.query<UnattestedDeclarationRow>(UNATTESTED_SQL, [ATTESTING_KINDS]);
  return result.rows;
}

export function describeUnattested(row: UnattestedDeclarationRow): string {
  return (
    `"${row.role_name}" consta como ${row.role_kind} em platform.role_declarations e não tem o ` +
    'fato que provision e migrate gravam ao declarar: a linha foi escrita fora do ato. Ela diz ter ' +
    `sido declarada por "${row.declared_by}" em ${row.declared_at}. A tabela é append-only, então a ` +
    'linha não sai: ou uma rodada assume o nome de propósito — conectando com ele, se for executor, ' +
    'ou apontando o ambiente para ele, se for credencial —, o que grava a adoção datada, ou o ' +
    'operador a retrata, ou ela continua acusada, e o que a mantém inerte é a condição de ' +
    'permanência (§7.5.4)'
  );
}

export async function roleDeclarationsExist(client: pg.Client): Promise<boolean> {
  const result = await client.query(TABLE_EXISTS_SQL);
  return result.rowCount === 1;
}

export async function readRoleDeclarations(
  client: pg.Client,
): Promise<readonly RoleDeclaration[]> {
  const result = await client.query<RoleDeclaration>(READ_SQL);
  return result.rows;
}

/**
 * Declara os papéis do arranjo, e devolve **só os que a rodada acrescentou**.
 *
 * Uma transação para as duas linhas: ou o arranjo inteiro fica declarado, ou nada fica. Metade
 * declarada faria a §7.5.1 acusar a outra metade como terceiro, que é diagnóstico falso sobre o
 * papel errado.
 */
export async function declareRoles(
  client: pg.Client,
  roles: readonly RoleToDeclare[],
): Promise<readonly string[]> {
  const declared: string[] = [];
  await client.query('begin');
  try {
    for (const role of roles) {
      const result = await client.query<{ role_name: string }>(DECLARE_SQL, [
        uuidV7(),
        role.name,
        role.kind,
      ]);
      const inserted = result.rows[0]?.role_name;
      if (inserted !== undefined) declared.push(inserted);
    }
    await client.query('commit');
  } catch (cause) {
    await client.query('rollback').catch(() => undefined);
    throw cause;
  }
  return declared;
}

/**
 * A declaração do arranjo: `db/universo-e-declaracao.md` §7.5.4.
 *
 * Roda uma vez por rodada de `provision` e de `migrate`, depois de a stream `platform` ser aplicada
 * (é ela que cria a tabela) e antes de tocar em papel de cliente (é ela que a §7.5.1 lê para
 * excluir). **`verify` não a chama**: quem só verifica não amplia o conjunto que a verificação
 * desculpa.
 *
 * **Declarar é fato, e fato que cresce é evento.** Ampliar o conjunto de exclusões vira linha datada
 * com autor e um `app_role_declared`; rodada que não amplia nada não escreve nem imprime.
 */
export async function declareArrangement(ctx: RunContext): Promise<void> {
  const client = ctx.session.client;

  if (!(await roleDeclarationsExist(client))) {
    throw refused(
      'platform.role_declarations não existe neste banco, e é ela que diz quem alcança um cliente ' +
        'legitimamente (db/universo-e-declaracao.md §7.5.4). Ela nasce em ' +
        'platform/0011__role_declarations.sql: o conjunto de migrations desta rodada não a tem, ' +
        'então nada de papel foi tocado.',
    );
  }

  const arranjo: readonly RoleToDeclare[] = [
    { name: ctx.session.dbRole, kind: 'executor' },
    { name: requireAppCredential(ctx.config), kind: 'app_credential' },
  ];
  const nomes = arranjo.map((role) => role.name);
  await assertNoneRetracted(client, nomes);
  const declarados = await declareRoles(client, arranjo);

  for (const nome of declarados) {
    const detalhe = declarationFactDetail(
      nome,
      'passou a constar em platform.role_declarations, declarado por ' +
        `"${ctx.session.dbRole}": a pergunta invertida da §7.5.1 deixa de contar o alcance dele ` +
        'como alcance de terceiro',
    );
    ctx.report(`papel declarado: ${detalhe}`);
    await ctx.events.record({ kind: 'app_role_declared', detail: detalhe });
  }

  await adoptUnattested(ctx, nomes);
}

/**
 * A saída da linha plantada, e ela é o par da acusação da §7.5.4: **uma rodada assume, de propósito,
 * a linha que alguém escreveu fora do ato.**
 *
 * Só os nomes **desta** rodada, e é o ponto: assumir `role_kind = 'executor'` exige conectar com
 * aquele papel; assumir uma credencial exige apontar o ambiente para ela. Nos dois casos é um ato
 * deliberado, com autor, e o fato gravado diz que a linha **já existia sem ato** — quem ler a trilha
 * depois vê a diferença entre "foi declarado" e "foi assumido".
 *
 * Sem isto a acusação não teria saída: a tabela é append-only, e um `INSERT` cru deixaria o `verify`
 * em `3` para sempre. Ela também cobre a falha honesta — o evento é escrito por uma segunda conexão
 * (§19.2), e a rodada em que essa escrita falha deixa a linha sem fato até a rodada seguinte.
 */
async function adoptUnattested(ctx: RunContext, nomes: readonly string[]): Promise<void> {
  const pendentes = (await readUnattestedDeclarations(ctx.session.client)).filter((linha) =>
    nomes.includes(linha.role_name),
  );

  for (const linha of pendentes) {
    const detalhe = declarationFactDetail(
      linha.role_name,
      `já constava em platform.role_declarations como ${linha.role_kind}, sem o fato do ato — a ` +
        `linha diz ter sido escrita por "${linha.declared_by}" em ${linha.declared_at} —, e esta ` +
        `rodada a assumiu, com "${ctx.session.dbRole}" na conexão`,
    );
    ctx.report(`declaração assumida: ${detalhe}`);
    await ctx.events.record({ kind: 'role_declaration_adopted', detail: detalhe });
  }
}

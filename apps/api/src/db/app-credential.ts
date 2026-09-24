import type { RootDb } from './tenant-db.js';
import { credentialQuery, type CredentialRow } from './credential-query.js';
import {
  refusalsAgainst,
  verdictOf,
  type CredentialAnswers,
  type CredentialRefusal,
} from './credential-refusals.js';
import {
  emitStartupFact,
  stdoutStartupFactSink,
  type StartupFactSink,
} from '../observability/startup-facts.js';

/**
 * O servidor pergunta ao catálogo, na subida, sobre a própria credencial (`F-003`).
 *
 * **Por que existe.** Até aqui `apps/api` subia confiando no que `FORJA_DATABASE_URL` aponta. Os
 * dois desfechos de apontar errado foram medidos em 2026-09-11, PostgreSQL 16.15
 * (`docs/auditorias/2026-09-11-gate-final-camada-de-papel.md:58-59`): apontar para o executor
 * falha fechado na primeira transação de cliente, com `42501 permission denied to set role`, e
 * apontar para superusuário **funciona**, contido dentro da transação. O primeiro é fechado por
 * uma propriedade do servidor Postgres, não por código nosso, e o segundo não é fechado por
 * ninguém. O executor já confere o parâmetro dele contra o catálogo antes da primeira escrita
 * (`db/migrator/src/preconditions.ts`, `db/papel-do-cliente.md` §7.7); este é o gêmeo dele do lado
 * do servidor, e o que ele compra a mais são a quarta, a quinta e a sexta perguntas.
 *
 * **A quarta pergunta é o `PAP-13` visto daqui.** Em 16 a herança é propriedade de cada concessão
 * (`pg_auth_members.inherit_option`), não do papel, e a chave daquela tabela é
 * `(roleid, member, grantor)`: a mesma concessão emitida por duas mãos são duas linhas, e o efeito
 * é a união delas. Um `GRANT app_t_<slug> TO <credencial> WITH INHERIT TRUE` emitido pelo operador
 * põe a credencial **nua** dentro do schema daquele cliente, sem assumir papel nenhum — e o lado
 * do servidor, que é de onde a consulta sai, não tinha como enxergar isso. Medido aqui em
 * 2026-09-11 com o mesmo arranjo: a credencial correta responde `{}` nesta pergunta, e a mesma
 * credencial depois do `GRANT … WITH INHERIT TRUE` do operador responde `{app_t_probe}`.
 *
 * **Não existe chave de ambiente que desligue esta conferência.** Nem o nome do grupo vem do
 * ambiente: ele é fixado em código, como no executor. Parâmetro que escolhe contra o que a
 * pergunta é feita é a mesma coisa que chave de escape, só que menos visível — aponta-se o grupo
 * para um papel que se controla e a pergunta passa a responder sim sobre nada.
 *
 * **Da quinta à sétima pergunta, o assunto é alcance**, e elas fecham uma matriz. As quatro
 * primeiras perguntam **quem a credencial é**; estas perguntam **o que ela alcança**, cruzando dois
 * sujeitos com dois mecanismos:
 *
 * |  | mecanismo: concessão de **papel** | mecanismo: privilégio de **objeto** (e atributo) |
 * |---|---|---|
 * | sujeito: **a credencial** | `inheritance` | `reach` |
 * | sujeito: **papel que ela assume** | `assumed` | `assumedReach` |
 *
 * As três primeiras células entraram em 2026-09-12 com o gate 3 (`SUB-01`, `SUB-02`); a quarta
 * entrou na reauditoria do mesmo dia (`SUB-05`), e ela é a razão pela qual `SUB-02` foi **reaberto**:
 * o achado tinha sido fechado pelo mecanismo que ele nomeia, e o desfecho que ele descreve —
 * `acme` lendo a venda de `globex` **dentro do handle que a borda entrega à rota**, com o fato de
 * subida dizendo `verified` — continuava de pé pela célula que faltava. Medido em 2026-09-12,
 * PostgreSQL 16.15, nas três variantes: `GRANT USAGE ON SCHEMA t_<b> TO app_t_<a>`, que é o **erro
 * de digitação** da §7.3 e é aceito para o executor não-superusuário; o mesmo contra `platform`; e
 * `ALTER ROLE app_t_<a> SUPERUSER`.
 *
 * **A conferência continua não excluindo ninguém por propriedade que o excluído carrega.** Não há
 * lista de isenção, nome de ambiente como sujeito, nem sinalizador que quem concede a si mesmo
 * apague. Quando algo é excluído, é por identidade que nós escrevemos: a própria credencial nas
 * perguntas de papel assumido (a quarta e a quinta já respondem por ela), e o **schema do próprio
 * papel** em `assumedReach`, que é a mesma junção `'app_' || nspname` com que o executor verifica o
 * arranjo (`db/papel-do-cliente.md` §7.1) — não uma isenção que o papel carrega.
 *
 * O universo das duas perguntas de alcance é `t\_%` mais `platform` (`SUB-06`): os dois conjuntos
 * que o sistema protege, nomeados por nós.
 *
 * **A oitava pergunta, `delegation`, fica fora da matriz, e é o quinto mecanismo** (`SUB-09`). A
 * matriz pergunta o que um **papel** alcança; esta pergunta o que um **objeto** empresta. Regra de
 * reescrita, view, view materializada e chave estrangeira rodam com o privilégio do dono, e o dono
 * dos schemas de cliente é o executor, que alcança todos: um objeto dele no schema de `acme`,
 * apontando para `globex`, põe `acme` dentro de `globex` com `has_schema_privilege` do papel
 * assumido respondendo `f`. A pergunta é por **dependência que sai do próprio schema**, de objeto
 * de schema protegido para objeto de qualquer outro, mais toda rotina `SECURITY DEFINER` em schema
 * protegido, cujo corpo o catálogo não enxerga. As duas respondem vazio no arranjo legítimo por
 * construção, porque o crivo de migration recusa as duas coisas. O detalhe está em
 * `credential-query.ts`.
 *
 * **O que fica fora, e é decidido:**
 *
 * - **Mudança depois da subida.** Concessão herdável criada às três da manhã passa despercebida até
 *   o próximo reinício. Quem responde o estado vivo é o `verify` (`db/verificacao-do-papel.md`
 *   §7.5.1), do outro lado da parede.
 * - **Concessão entre papéis de cliente só com `SET`, sem `INHERIT`.** Medido em 2026-09-12: com
 *   `GRANT app_t_<b> TO app_t_<a> WITH INHERIT FALSE, SET TRUE`, a transação que assume `app_t_<a>`
 *   leva `42501 permission denied for schema` no schema de `b` — só alcança quem assumir o segundo
 *   papel na mesma transação, e `tenant-role.ts` assume **um**, formado a partir do contexto da
 *   borda. A linha aparece na pergunta invertida do `verify`, que é onde ela custa menos.
 * - **Rotina `SECURITY DEFINER` fora dos schemas protegidos, chamada pelo nome.** Chamada por
 *   objeto do schema do cliente (view, gatilho, padrão de coluna), ela é dependência que sai do
 *   schema e a oitava pergunta a acusa. Chamada direto, exige texto de consulta que nenhuma rota
 *   escreve e `USAGE` no schema dela, que o arranjo não dá ao papel de cliente. Não há schema fora
 *   de `t_*` e `platform` nem objeto em `public`, e quem acusa os dois é o `verify`
 *   (`db/universo-e-declaracao.md` §7.5.3).
 * - **Credencial que nenhum servidor nosso usa.** O sujeito daqui é sempre a credencial deste
 *   processo, e é justamente o que dá o alcance certo na janela de rotação — a reincidência
 *   `PAP-19` (`docs/auditorias/2026-09-12-reauditoria-camada-de-papel.md:105`), que o `verify` erra
 *   porque o sujeito dele é um nome de ambiente. A carteira inteira do cluster é a pergunta
 *   invertida do `verify`.
 */

/**
 * A tabela de decisão e o veredito moram em `credential-refusals.ts` desde 2026-09-12, e saem
 * reexportados daqui: quem consome a conferência consome um módulo só, e a divisão é interna.
 */
export {
  refusalsAgainst,
  verdictOf,
  type CredentialAnswers,
  type CredentialQuestion,
  type CredentialRefusal,
} from './credential-refusals.js';

/**
 * §7.2, primeira linha. **O nome é fixado pela spec, não por ambiente** — é a mesma constante que
 * o executor carrega em `db/migrator/src/tenant-role.ts:26`, repetida aqui porque `apps/api` e
 * `db/migrator` não compartilham pacote. Divergir os dois nomes quebra o arranjo inteiro, então a
 * prova de que eles são iguais é o arranjo de `db/papel-do-cliente.md` §7.2 rodando nos dois.
 */
export const APP_GROUP_ROLE = 'forja_app';

export class AppCredentialError extends Error {
  readonly refusals: readonly CredentialRefusal[];

  constructor(refusals: readonly CredentialRefusal[]) {
    super(
      // A oitava pergunta recusa o banco com a credencial certa, então o título não acusa a credencial.
      'a conferência recusou a credencial de banco deste processo, ou o banco a que ela aponta:\n' +
        refusals.map((refusal) => `- [${refusal.question}] ${refusal.reason}`).join('\n') +
        '\nO servidor não abriu a porta. Nenhuma requisição foi atendida.',
    );
    this.name = 'AppCredentialError';
    this.refusals = refusals;
  }
}

const UNKNOWN_ROLE = '(desconhecido)';

/**
 * O que o `pg` põe em `code` quando a pergunta nem chega ao servidor é `ECONNREFUSED`, `ENOTFOUND`
 * e afins; quando chega e é recusada, é `SQLSTATE`. Os dois bastam para diagnosticar, e **a
 * mensagem não entra**: a de conexão carrega host e porta, a de autenticação carrega o papel, e a
 * do servidor pode carregar valor de linha.
 */
function describeQueryFailure(error: unknown): string {
  const code = typeof error === 'object' && error !== null && 'code' in error
    ? (error as { code?: unknown }).code
    : undefined;
  const marca = typeof code === 'string' && code !== '' ? code : (error instanceof Error ? error.name : typeof error);
  return (
    `não foi possível perguntar ao catálogo sobre a própria credencial (${marca}). A pergunta é ` +
    'precondição de atender, então falhar nela é recusa, nunca passe livre. Se o código acima for ' +
    '42703, o servidor é anterior ao 16 e não tem pg_auth_members.inherit_option, que é o piso de ' +
    'db/convencoes.md §9'
  );
}

export interface AppCredentialCheckOptions {
  readonly groupRole?: string;
  readonly factSink?: StartupFactSink;
}

/**
 * Roda **antes de a porta abrir**, uma vez por processo. Registra o fato de subida nos dois
 * desfechos e lança `AppCredentialError` quando qualquer pergunta falha.
 *
 * Nenhuma consulta nova aparece no caminho de requisição: quem chama isto é `main.ts`, e o handle
 * usado é a raiz — a mesma que a borda nunca entrega a rota nenhuma.
 */
export async function assertAppCredential(
  root: RootDb,
  options: AppCredentialCheckOptions = {},
): Promise<CredentialAnswers> {
  const groupRole = options.groupRole ?? APP_GROUP_ROLE;
  const sink = options.factSink ?? stdoutStartupFactSink;

  const leitura = await readCredential(root, groupRole);
  if (!leitura.ok) {
    const refusals = [leitura.refusal];
    emitStartupFact(sink, {
      kind: 'startup_credential_refused',
      currentRole: UNKNOWN_ROLE,
      sessionRole: UNKNOWN_ROLE,
      groupRole,
      verdict: verdictOf(refusals, false),
    });
    throw new AppCredentialError(refusals);
  }

  const answers = normalize(leitura.row);
  const refusals = refusalsAgainst(answers, groupRole);
  emitStartupFact(sink, {
    kind: refusals.length === 0 ? 'startup_credential_verified' : 'startup_credential_refused',
    currentRole: answers.currentRole,
    sessionRole: answers.sessionRole,
    groupRole,
    verdict: verdictOf(refusals, true),
  });

  if (refusals.length > 0) throw new AppCredentialError(refusals);
  return answers;
}

type Leitura = { readonly ok: true; readonly row: CredentialRow } | { readonly ok: false; readonly refusal: CredentialRefusal };

/** Falhar ao perguntar é recusa, nunca passe livre: as duas formas de não obter resposta caem aqui. */
async function readCredential(root: RootDb, groupRole: string): Promise<Leitura> {
  try {
    const { rows } = await credentialQuery(groupRole).execute(root);
    const row = rows[0];
    if (row === undefined) {
      return {
        ok: false,
        refusal: {
          question: 'query',
          reason:
            'o servidor não devolveu linha para a pergunta sobre a própria credencial. Resposta ' +
            'vazia é recusa: pergunta não respondida não é pergunta respondida com sim',
        },
      };
    }
    return { ok: true, row };
  } catch (error: unknown) {
    return { ok: false, refusal: { question: 'query', reason: describeQueryFailure(error) } };
  }
}

function normalize(row: CredentialRow): CredentialAnswers {
  return {
    currentRole: row.current_role_name,
    sessionRole: row.session_role_name,
    roleExists: row.role_exists,
    roleCanLogin: row.role_can_login,
    roleIsSuperuser: row.role_is_superuser,
    groupExists: row.group_exists,
    inGroup: row.in_group,
    administersGroup: row.administers_group,
    inheritableGrants: [...row.inheritable_grants],
    nakedSchemaReach: [...row.naked_schema_reach],
    assumedInheritableGrants: [...row.assumed_inheritable_grants],
    assumedSchemaReach: [...row.assumed_schema_reach],
    assumedRoleAttributes: [...row.assumed_role_attributes],
    delegatedDependencies: [...row.delegated_dependencies],
    definerRoutines: [...row.definer_routines],
  };
}

import pg from 'pg';
import {
  Kysely,
  PostgresDialect,
  type PostgresPool,
  type PostgresPoolClient,
} from 'kysely';
import type { DatabaseConfig } from '../config.js';
import type { RootDb } from './tenant-db.js';

/**
 * O pool da aplicação.
 *
 * A credencial usada aqui **não é** a do executor de migration (`db/papeis-e-credencial.md`
 * §1): o executor cria os schemas, logo é dono deles, e dono lê tudo que há dentro de todos.
 * Usar a mesma credencial faz o isolamento por schema deixar de existir sem uma única linha
 * de código errada.
 *
 * **O arranjo fechou em 2026-09-11** (`db/papel-do-cliente.md` §7,
 * [[decision-papel-de-aplicacao-assumido-por-transacao]]): uma credencial `LOGIN NOINHERIT`
 * e N papéis sem `LOGIN`, um por cliente. A credencial **não alcança schema nenhum sozinha**
 * — quem alcança é o papel, assumido por transação em `tenant-role.ts`. Medido em 2026-09-11,
 * PostgreSQL 16.15: esta conexão, sem assumir papel, lê qualquer schema de cliente com
 * `42501 permission denied for schema`. Isso é o desenho falhando fechado.
 *
 * Os três tempos abaixo são de **sessão** e valem igual para todo cliente, então podem viver
 * na conexão. Nenhum outro estado de sessão é permitido aqui: alvo de schema é por consulta
 * (`tenant-db.ts`) e papel é por transação (`tenant-role.ts`), os dois porque a conexão é
 * compartilhada e volta ao pool.
 */
export function createPool(config: DatabaseConfig): pg.Pool {
  return new pg.Pool({
    connectionString: config.connectionString,
    max: config.poolMax,
    application_name: 'forja-api',
    statement_timeout: config.statementTimeoutMs,
    idle_in_transaction_session_timeout: config.idleInTransactionTimeoutMs,
    connectionTimeoutMillis: config.connectionTimeoutMs,
  });
}

/**
 * `queryMode` existe em `pg` 8.23.0 (`node_modules/pg/lib/query.js:19` e `:36`) e **não** está
 * em `@types/pg` 8.23.1 — conferido em 2026-09-11, lendo as duas árvores. Daí este tipo local:
 * a opção é real, o pacote de tipos é que está atrás.
 */
type ConfiguracaoComModo = pg.QueryConfig & { readonly queryMode: 'extended' };

const ENVOLVIDOS = new WeakMap<pg.PoolClient, PostgresPoolClient>();

/**
 * Força **protocolo estendido** em toda consulta que sai por esta conexão, e é isso que
 * contém o resíduo do arranjo de papel (`PAP-04`).
 *
 * O que contém a troca de papel dentro da transação não é "a equipe parametriza": é o
 * servidor recusar mais de um comando por mensagem. Medido em 2026-09-11, PostgreSQL 16.15,
 * `pg` 8.23.0, com o texto hostil `select 1; set role app_t_globex; select …`:
 *
 * - `query(texto)` e `query(texto, [])` — **aceitos**, três resultados, e a sessão sai da
 *   transação como o outro cliente; depois do `COMMIT` a leitura seguinte, fora de transação,
 *   devolve a linha do outro cliente sem erro nenhum;
 * - com um parâmetro ligado — `42601 cannot insert multiple commands into a prepared statement`;
 * - com zero parâmetro e `queryMode: 'extended'` — **o mesmo `42601`**.
 *
 * O Kysely chama `client.query(texto, parâmetros)`, e um `order by` montado por template não
 * tem valor a ligar: sem isto, ele viajaria em protocolo simples. A propriedade passa a ser do
 * mecanismo, não da lembrança de quem escreve a consulta
 * ([[convention-o-que-o-banco-impoe-vence-o-que-alguem-lembra]]).
 */
function envolverCliente(client: pg.PoolClient): PostgresPoolClient {
  const jaEnvolvido = ENVOLVIDOS.get(client);
  if (jaEnvolvido !== undefined) return jaEnvolvido;

  const envolvido = {
    get processID(): number | undefined {
      return (client as { processID?: number }).processID;
    },
    query(texto: unknown, parametros?: ReadonlyArray<unknown>): unknown {
      if (typeof texto !== 'string') {
        // A outra sobrecarga do Kysely é a de cursor, e cursor só existe quando o dialeto é
        // construído com um. O nosso não é. Chegar aqui é defeito de composição.
        throw new TypeError('consulta por cursor não é suportada neste pool');
      }
      const configuracao: ConfiguracaoComModo = {
        text: texto,
        values: parametros === undefined ? [] : [...parametros],
        queryMode: 'extended',
      };
      return client.query(configuracao);
    },
    release(): void {
      client.release();
    },
    // Duas diferenças estruturais impedem a conversão direta, e nenhuma delas é risco: o
    // `command` do `pg` é `string` e o do Kysely é uma união fechada, e a sobrecarga de cursor
    // acima lança em vez de existir.
  } as unknown as PostgresPoolClient;

  ENVOLVIDOS.set(client, envolvido);
  return envolvido;
}

export function extendedProtocolPool(pool: pg.Pool): PostgresPool {
  const envolvido: PostgresPool = {
    options: pool.options,
    connect: async (): Promise<PostgresPoolClient> => envolverCliente(await pool.connect()),
    end: async (): Promise<void> => {
      await pool.end();
    },
  };

  // `Client` é membro não documentado do `pg`, e o Kysely o usa para a conexão de controle que
  // cancela consulta. Repassado quando existe, para não retirar a capacidade em silêncio; ele
  // não assume papel, então não alcança schema de cliente.
  const construtor = (pool as { Client?: PostgresPool['Client'] }).Client;
  if (construtor !== undefined) envolvido.Client = construtor;

  return envolvido;
}

/**
 * A raiz. Ela **não** é entregue a rota nenhuma: quem a recebe é a borda, que produz o handle
 * de cliente por transação (`tenant-role.ts`). A marca de tipo em `RootDb` existe para o
 * compilador separar handle solto de handle preso (`SEC-12`).
 */
export function createRootDb(pool: pg.Pool): RootDb {
  return new Kysely({
    dialect: new PostgresDialect({ pool: extendedProtocolPool(pool) }),
  }) as RootDb;
}

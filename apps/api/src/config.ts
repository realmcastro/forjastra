/**
 * Configuração, lida do ambiente, uma vez, na subida.
 *
 * A credencial de banco **não tem valor padrão** e o processo recusa iniciar sem ela — a
 * mesma postura do `lock_timeout` do executor (`db/papeis-e-credencial.md` §2). Segredo nunca
 * entra no repositório, nem em exemplo: `.env.example` traz a chave e nenhum valor.
 */

export class ConfigError extends Error {}

export interface HttpConfig {
  readonly host: string;
  readonly port: number;
  readonly bodyLimitBytes: number;
}

export interface DatabaseConfig {
  readonly connectionString: string;
  readonly poolMax: number;
  readonly statementTimeoutMs: number;
  readonly idleInTransactionTimeoutMs: number;
  readonly connectionTimeoutMs: number;
}

export interface AppConfig {
  readonly http: HttpConfig;
  readonly database: DatabaseConfig;
  readonly logLevel: string;
}

type Env = Readonly<Record<string, string | undefined>>;

function required(env: Env, key: string): string {
  const value = env[key];
  if (value === undefined || value.trim() === '') {
    throw new ConfigError(`variável de ambiente obrigatória ausente: ${key}`);
  }
  return value;
}

function integer(env: Env, key: string, fallback: number): number {
  const raw = env[key];
  if (raw === undefined || raw.trim() === '') return fallback;
  if (!/^\d+$/.test(raw.trim())) {
    throw new ConfigError(`variável de ambiente ${key} precisa ser inteiro não negativo`);
  }
  return Number.parseInt(raw, 10);
}

/**
 * Tempo de banco **recusa `0`**, e a razão não é nossa: o Postgres lê `0` como *sem limite* em
 * `statement_timeout` e em `idle_in_transaction_session_timeout`, e o `pg` lê
 * `connectionTimeoutMillis: 0` do mesmo jeito. Medido em 2026-09-12, PostgreSQL 16.15, com
 * `pg_catalog.pg_auth_members` travada em `ACCESS EXCLUSIVE`: com `FORJA_PG_STATEMENT_TIMEOUT_MS=0`
 * o processo ficou **12 s pendurado, a porta HTTP fechada em todas as sondagens, nenhum fato de
 * subida emitido e nenhum código de saída** — só terminou porque eu o matei. Com o padrão de
 * 5 000 ms o mesmo estado recusa em ~5 s, com `57014`, e o processo sai `78`.
 *
 * O desfecho continua fechado nos dois casos (nada é atendido), e é por isso que a recusa vive
 * aqui e não vale `CRÍTICO`: o que `0` compra é **invisibilidade**. Supervisor que reinicia por
 * término de processo espera para sempre, supervisor que decide por porta aberta nunca decide, e a
 * janela de indisponibilidade vira o silêncio que a conferência de subida existe para eliminar
 * (`SUB-04`, `docs/auditorias/2026-09-12-conferencia-da-credencial-na-subida.md:174`).
 *
 * Quem precisa de mais tempo escreve mais tempo. Não existe valor que diga "espere para sempre".
 */
function databaseTimeoutMs(env: Env, key: string, fallback: number): number {
  const value = integer(env, key, fallback);
  if (value === 0) {
    throw new ConfigError(
      `variável de ambiente ${key} não aceita 0: o Postgres lê 0 como "sem limite", e o processo ` +
        'que espera para sempre não abre a porta, não emite fato e não termina. Escreva o tempo em ' +
        'milissegundos que você aceita esperar',
    );
  }
  return value;
}

/**
 * Os padrões abaixo são **escolhidos, não medidos**, e estão aqui para o processo subir sem
 * um arquivo de ambiente de dez linhas. O primeiro número medido substitui cada um deles; o
 * orçamento que os julga está em `.claude/rules/performance.md` §3.
 *
 * `host` nasce em `127.0.0.1` por falha fechada: expor na rede é ato explícito de quem opera.
 */
export function loadConfig(env: Env = process.env): AppConfig {
  return {
    http: {
      host: env['FORJA_HTTP_HOST'] ?? '127.0.0.1',
      port: integer(env, 'FORJA_HTTP_PORT', 3000),
      bodyLimitBytes: integer(env, 'FORJA_HTTP_BODY_LIMIT_BYTES', 256 * 1024),
    },
    database: {
      connectionString: required(env, 'FORJA_DATABASE_URL'),
      poolMax: integer(env, 'FORJA_PG_POOL_MAX', 10),
      statementTimeoutMs: databaseTimeoutMs(env, 'FORJA_PG_STATEMENT_TIMEOUT_MS', 5_000),
      idleInTransactionTimeoutMs: databaseTimeoutMs(
        env,
        'FORJA_PG_IDLE_IN_TRANSACTION_TIMEOUT_MS',
        10_000,
      ),
      connectionTimeoutMs: databaseTimeoutMs(env, 'FORJA_PG_CONNECTION_TIMEOUT_MS', 5_000),
    },
    logLevel: env['FORJA_LOG_LEVEL'] ?? 'info',
  };
}

import { fileURLToPath } from 'node:url';
import { refused } from './errors.js';
import { TENANT_ROLE_PREFIX } from './tenant-role.js';

/**
 * Configuração do executor, lida do ambiente, uma vez, na subida.
 *
 * **Nenhum valor tem padrão implícito**, e é regra, não zelo: `APLICACAO-E-ALVO.md` §6 manda o
 * executor recusar iniciar sem `lock_timeout` configurado, e `db/papeis-e-credencial.md` §2 manda o
 * mesmo para a credencial. O primeiro número de lock sai de medida sobre volume real, e um padrão
 * em código viraria o número que ninguém mediu (`CONTRATO.md` §15, resposta 3).
 *
 * Os nomes das chaves são declarados aqui e em `.env.example`, como `db/papeis-e-credencial.md` §2
 * pede. A convenção fixa que elas existem e que não têm padrão; as palavras são nossas.
 */

export interface MigratorConfig {
  /** Carrega o **papel do executor**, nunca o da aplicação (`db/papeis-e-credencial.md` §1). */
  readonly connectionString: string;
  readonly lockTimeoutMs: number;
  readonly idleInTransactionTimeoutMs: number;
  readonly connectionTimeoutMs: number;
  readonly migrationsDir: string;
  readonly platformReferenceFile: string;
  /**
   * O **nome** da credencial da aplicação, nunca a senha dela (`db/papel-do-cliente.md` §7.1). É
   * ele que o passo 7 do `provision` concede o papel do cliente, e é ele que a §7.5 confere.
   *
   * Opcional aqui e obrigatório em `provision`, `migrate` e `verify`, por `requireAppCredential`:
   * `status` não o exige porque não escreve nada, e exigi-lo na carga faria o comando que só relata
   * recusar por falta de uma chave que ele não usa.
   */
  readonly appCredentialRole: string | undefined;
}

type Env = Readonly<Record<string, string | undefined>>;

/** `db/` a partir de `db/migrator/dist/src/config.js`. */
const REPO_DB_DIR = fileURLToPath(new URL('../../../', import.meta.url));

function required(env: Env, key: string): string {
  const value = env[key];
  if (value === undefined || value.trim() === '') {
    throw refused(`variável de ambiente obrigatória ausente: ${key}`);
  }
  return value.trim();
}

function requiredInteger(env: Env, key: string): number {
  const raw = required(env, key);
  if (!/^\d+$/.test(raw)) {
    throw refused(`variável de ambiente ${key} precisa ser inteiro não negativo, em milissegundos`);
  }
  return Number.parseInt(raw, 10);
}

function optionalInteger(env: Env, key: string, fallback: number): number {
  const raw = env[key];
  if (raw === undefined || raw.trim() === '') return fallback;
  if (!/^\d+$/.test(raw.trim())) {
    throw refused(`variável de ambiente ${key} precisa ser inteiro não negativo, em milissegundos`);
  }
  return Number.parseInt(raw.trim(), 10);
}

/**
 * `connectionTimeoutMs` tem padrão porque não é parâmetro de sessão do banco: ele só limita a
 * espera de quem disca. Os três que o contrato nomeia continuam sem padrão nenhum.
 */
const DEFAULT_CONNECTION_TIMEOUT_MS = 10_000;

export function loadConfig(env: Env = process.env): MigratorConfig {
  return {
    connectionString: required(env, 'FORJA_MIGRATOR_DATABASE_URL'),
    lockTimeoutMs: requiredInteger(env, 'FORJA_MIGRATOR_LOCK_TIMEOUT_MS'),
    idleInTransactionTimeoutMs: requiredInteger(
      env,
      'FORJA_MIGRATOR_IDLE_IN_TRANSACTION_TIMEOUT_MS',
    ),
    connectionTimeoutMs: optionalInteger(
      env,
      'FORJA_MIGRATOR_CONNECTION_TIMEOUT_MS',
      DEFAULT_CONNECTION_TIMEOUT_MS,
    ),
    migrationsDir: env['FORJA_MIGRATOR_MIGRATIONS_DIR']?.trim() || `${REPO_DB_DIR}migrations`,
    platformReferenceFile:
      env['FORJA_MIGRATOR_PLATFORM_REFERENCE']?.trim() ||
      `${REPO_DB_DIR}referencia-estrutural-platform.txt`,
    appCredentialRole: env[APP_CREDENTIAL_ROLE_KEY]?.trim() || undefined,
  };
}

export const APP_CREDENTIAL_ROLE_KEY = 'FORJA_MIGRATOR_APP_CREDENTIAL_ROLE';

/**
 * A exigência de `db/papel-do-cliente.md` §7.1, cobrada na subida dos comandos que criam ou
 * conferem papel: ausência recusa com saída `2` **nomeando a chave**, que é a mesma postura do
 * `lock_timeout`. Cobrar isso lá na frente, no passo 7, deixaria um cliente registrado e sem papel
 * por causa de uma variável de ambiente.
 *
 * O prefixo `app_` é reservado ao papel do cliente (§7.1): uma credencial com esse nome colidiria
 * com o papel de algum schema, e a junção por `'app_' || nspname` da §7.5 passaria a comparar o
 * papel do cliente com a própria credencial.
 */
export function requireAppCredential(config: MigratorConfig): string {
  const role = config.appCredentialRole;
  if (role === undefined) {
    throw refused(
      `variável de ambiente obrigatória ausente: ${APP_CREDENTIAL_ROLE_KEY}. Ela carrega o nome da ` +
        'credencial da aplicação, nunca a senha dela (db/papel-do-cliente.md §7.1).',
    );
  }
  if (role.startsWith(TENANT_ROLE_PREFIX)) {
    throw refused(
      `${APP_CREDENTIAL_ROLE_KEY} nomeia "${role}", e o prefixo "${TENANT_ROLE_PREFIX}" é ` +
        'reservado ao papel de banco de cada cliente (db/papel-do-cliente.md §7.1).',
    );
  }
  return role;
}

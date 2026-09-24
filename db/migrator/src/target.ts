import type pg from 'pg';
import { applyFailed, refused } from './errors.js';

/**
 * O alvo: forma do nome (§10.2) e como ele entra na sessão (§10.3.1 e §10.3.2).
 *
 * Validação de forma **não** é validação de alvo. A citação impede injeção de comando; ela não tem
 * opinião sobre qual identificador é o certo. Quem cuida disso é a procedência da §10.1, em
 * `commands/`, e por isso as duas existem.
 */

export const TENANT_SCHEMA_PREFIX = 't_';
export const PLATFORM_SCHEMA = 'platform';

/**
 * De 2 a **40** caracteres, e o `{1,39}` é o teto do humano decidido em 2026-09-11: a primeira classe
 * conta uma vez e a repetição conta até 39. Era `{1,40}`, que admitia 41 e punha o cliente de nome
 * comprido fora da fronteira de schema do carregador (`EXE-03`). O mesmo teto está no banco, por
 * `CHECK` (`0007__tenant_slug_length.sql`); o padrão da §11.3 deixou de escrever comprimento nenhum,
 * para não haver um terceiro número com que divergir.
 */
const SLUG = /^[a-z][a-z0-9_]{1,39}$/;
const RESERVED_SLUGS: readonly string[] = ['platform', 'public', 'information_schema'];
const RESERVED_SLUG_PREFIXES: readonly string[] = ['pg_', 'verify_'];

export function isValidTenantSlug(slug: string): boolean {
  if (!SLUG.test(slug)) return false;
  if (RESERVED_SLUGS.includes(slug)) return false;
  return !RESERVED_SLUG_PREFIXES.some((prefix) => slug.startsWith(prefix));
}

export function tenantSchemaNameFromSlug(slug: string): string {
  if (!isValidTenantSlug(slug)) {
    throw refused(
      `slug "${slug}" fora da forma aceita: ${SLUG.source}, sem os reservados platform, public, ` +
        'information_schema, e sem os prefixos pg_ e verify_ (APLICACAO-E-ALVO.md §10.2)',
    );
  }
  return TENANT_SCHEMA_PREFIX + slug;
}

export function isValidTenantSchemaName(schemaName: string): boolean {
  if (!schemaName.startsWith(TENANT_SCHEMA_PREFIX)) return false;
  return isValidTenantSlug(schemaName.slice(TENANT_SCHEMA_PREFIX.length));
}

/**
 * Regime transacional (§10.3.1): o ajuste é **local à transação**, então o `search_path` não vaza
 * para a conexão seguinte. O nome chega como parâmetro e `quote_ident` faz a citação; o texto SQL é
 * constante nos dois comandos.
 */
export async function setTargetLocal(client: pg.Client, schema: string): Promise<void> {
  await client.query("select set_config('forja.target_schema', $1, true)", [schema]);
  await client.query(
    "select set_config('search_path', quote_ident(current_setting('forja.target_schema')), true)",
  );
}

/**
 * Regime não-transacional (§10.3.2): o alvo vive em **escopo de sessão**, porque em autocommit a
 * transação é o próprio comando e `set_config(..., true)` morre com ele — medido, e o
 * `CREATE INDEX CONCURRENTLY` seguinte foi parar em `public`. Quem pode ter estado de sessão é a
 * conexão dedicada, que é fechada ao fim e nunca devolvida a pool.
 */
export async function setTargetSession(client: pg.Client, schema: string): Promise<void> {
  await client.query("select set_config('forja.target_schema', $1, false)", [schema]);
  await client.query(
    "select set_config('search_path', quote_ident(current_setting('forja.target_schema')), false)",
  );
}

/**
 * A conferência do passo 3 da §10.3.1, e a do passo 3 da §10.3.2 — que ali roda antes de **cada**
 * comando do corpo, não uma vez.
 *
 * É recusa, não registro: `current_schema()` diferente do alvo, ou mais de um schema no caminho,
 * para antes de o comando ser emitido. O `search_path` tem exatamente um schema, sem `public`, de
 * modo que um `CREATE TABLE` sem qualificação no corpo não tem outro lugar onde pousar.
 */
export async function assertTarget(client: pg.Client, schema: string): Promise<void> {
  const seen = await client.query<{ schema: string | null; depth: number | null }>(
    'select current_schema() as schema, array_length(current_schemas(false), 1) as depth',
  );
  const row = seen.rows[0];
  if (row === undefined) {
    throw applyFailed('o servidor não respondeu current_schema()');
  }
  if (row.schema !== schema) {
    throw applyFailed(
      `alvo perdido: esperava current_schema() = "${schema}" e encontrou "${row.schema ?? 'nulo'}"`,
    );
  }
  if (row.depth !== 1) {
    throw applyFailed(
      `search_path com ${row.depth ?? 0} schemas, e o alvo exige exatamente um ("${schema}")`,
    );
  }
}

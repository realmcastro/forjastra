import type pg from 'pg';

/**
 * `platform.tenants`: o registro de clientes de onde sai a procedência do nome de schema
 * (`APLICACAO-E-ALVO.md` §10.1).
 *
 * O executor lê para iterar e insere no `provision`. Ele **não** atualiza nem remove, em nenhum
 * comando, em nenhum caminho — e `db/papeis-e-credencial.md` §5 manda revogar os dois privilégios
 * do papel, para que isso não dependa de o código lembrar.
 */

export interface TenantRow {
  readonly tenant_id: string;
  readonly slug: string;
  readonly schema_name: string;
}

const READ_SQL = `
select tenant_id, slug, schema_name
  from platform.tenants
 order by schema_name collate "C"
`;

const INSERT_SQL = 'insert into platform.tenants (tenant_id, slug) values ($1, $2)';

const TENANT_SCHEMAS_IN_CATALOG_SQL = `
select nspname
  from pg_namespace
 where nspname like 't\\_%'
 order by nspname collate "C"
`;

const RELATION_EXISTS_SQL = `
select 1
  from pg_class c join pg_namespace n on n.oid = c.relnamespace
 where n.nspname = $1 and c.relname = $2 and c.relkind = 'r'
`;

export async function readTenants(client: pg.Client): Promise<readonly TenantRow[]> {
  const result = await client.query<TenantRow>(READ_SQL);
  return result.rows;
}

export async function insertTenant(
  client: pg.Client,
  tenantId: string,
  slug: string,
): Promise<void> {
  await client.query(INSERT_SQL, [tenantId, slug]);
}

/**
 * A enumeração do `verify` é pelo **catálogo**, e o registro entra como confronto (§13.2). Enumerar
 * pelo registro cegaria o comando exatamente onde ele é vendido como resposta ao drift: um schema
 * `t_*` que ninguém registrou seria invisível a tudo.
 */
export async function listTenantSchemasInCatalog(client: pg.Client): Promise<readonly string[]> {
  const result = await client.query<{ nspname: string }>(TENANT_SCHEMAS_IN_CATALOG_SQL);
  return result.rows.map((row) => row.nspname);
}

export async function tenantRegistryExists(client: pg.Client): Promise<boolean> {
  const result = await client.query(RELATION_EXISTS_SQL, ['platform', 'tenants']);
  return result.rowCount === 1;
}

/** `23505`: violação de unicidade. É a trava estrutural do `UNIQUE (slug)` (§13.1, passo 2). */
export const UNIQUE_VIOLATION = '23505';

export function isUniqueViolation(cause: unknown): boolean {
  return (
    typeof cause === 'object' &&
    cause !== null &&
    'code' in cause &&
    (cause as { code?: unknown }).code === UNIQUE_VIOLATION
  );
}

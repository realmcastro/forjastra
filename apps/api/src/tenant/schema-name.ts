import { ApiError } from '../errors.js';

/**
 * Forma do nome de schema de cliente. Espelha `db/migrator/APLICACAO-E-ALVO.md` §10.2, que
 * é a autoridade: a mesma regra existe como `CHECK` em `platform.tenants`.
 *
 * Isto é validação de **forma**, e forma não é alvo. Quem garante que o schema é o certo é
 * a procedência do nome (a identidade autenticada → o registro de clientes), nunca esta
 * função. Ela existe como segunda camada: se um dia o nome vier de lugar errado, um nome
 * malformado para aqui antes de virar consulta.
 */

const SLUG = /^[a-z][a-z0-9_]{1,40}$/;
const SCHEMA_PREFIX = 't_';

const RESERVED_SLUGS: readonly string[] = ['platform', 'public', 'information_schema'];
const RESERVED_SLUG_PREFIXES: readonly string[] = ['pg_', 'verify_'];

export function isValidTenantSlug(slug: string): boolean {
  if (!SLUG.test(slug)) return false;
  if (RESERVED_SLUGS.includes(slug)) return false;
  return !RESERVED_SLUG_PREFIXES.some((prefix) => slug.startsWith(prefix));
}

export function tenantSchemaNameFromSlug(slug: string): string {
  if (!isValidTenantSlug(slug)) {
    throw new ApiError('internal_error', {
      internalDetail: 'slug de cliente fora da forma aceita',
    });
  }
  return SCHEMA_PREFIX + slug;
}

export function isValidTenantSchemaName(schemaName: string): boolean {
  if (!schemaName.startsWith(SCHEMA_PREFIX)) return false;
  return isValidTenantSlug(schemaName.slice(SCHEMA_PREFIX.length));
}

/**
 * Falha fechado: nome fora da forma vira `internal_error`, nunca uma consulta. O detalhe
 * não vai para o chamador — o nome do schema é a carteira de clientes
 * (`db/papeis-e-credencial.md` §4).
 */
export function assertTenantSchemaName(schemaName: string): void {
  if (!isValidTenantSchemaName(schemaName)) {
    throw new ApiError('internal_error', {
      internalDetail: 'nome de schema de cliente fora da forma aceita',
    });
  }
}

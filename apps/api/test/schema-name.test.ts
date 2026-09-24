import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  assertTenantSchemaName,
  isValidTenantSchemaName,
  isValidTenantSlug,
  tenantSchemaNameFromSlug,
} from '../src/tenant/schema-name.js';
import { ApiError } from '../src/errors.js';

test('aceita slug na forma de APLICACAO-E-ALVO.md §10.2', () => {
  for (const slug of ['acme', 'acme_2', 'a1', 'a'.repeat(41)]) {
    assert.ok(isValidTenantSlug(slug), slug);
  }
});

test('recusa forma inválida, reservado e prefixo reservado', () => {
  const recusados = [
    '',
    'a',
    'Acme',
    '1acme',
    'acme-2',
    'acme ',
    'a'.repeat(42),
    'platform',
    'public',
    'information_schema',
    'pg_toast',
    'verify_1757',
    't_x"; drop table probe; --',
  ];
  for (const slug of recusados) assert.equal(isValidTenantSlug(slug), false, slug);
});

test('nome de schema é o slug prefixado, e só ele passa', () => {
  assert.equal(tenantSchemaNameFromSlug('acme'), 't_acme');
  assert.ok(isValidTenantSchemaName('t_acme'));
  assert.equal(isValidTenantSchemaName('acme'), false);
  assert.equal(isValidTenantSchemaName('platform'), false);
  assert.equal(isValidTenantSchemaName('public'), false);
});

test('nome fora da forma falha fechado, e o detalhe não vai para o chamador', () => {
  assert.throws(
    () => assertTenantSchemaName('public'),
    (error: unknown) => {
      assert.ok(error instanceof ApiError);
      assert.equal(error.code, 'internal_error');
      return true;
    },
  );
});

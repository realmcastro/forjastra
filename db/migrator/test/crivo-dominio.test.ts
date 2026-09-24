import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contentScreen } from '../src/refusals.js';
import { parseHeader } from '../src/header.js';
import { ExecutorError, EXIT_REFUSED } from '../src/errors.js';
import { tenantMigration } from './support/tree.js';
import { realTenantFiles } from './support/cliente.js';

/**
 * A forma `CREATE DOMAIN` da lista de permissão (`RECUSAS.md` §11.2, 2026-09-23, T-0022), e a stream
 * `tenant` do repositório inteira passando pelo crivo, que é o caso 14 de `CONTRATO.md` §14 estendido
 * à segunda stream.
 */

function passa(texto: string, version = 'tenant/0001__x'): readonly string[] {
  return contentScreen.screen({ version, text: texto, header: parseHeader(texto, version).header });
}

function recusa(texto: string, esperado: RegExp): void {
  assert.throws(
    () => passa(texto),
    (erro: unknown) =>
      erro instanceof ExecutorError && erro.exitCode === EXIT_REFUSED && esperado.test(erro.message),
    `${esperado} não recusou: ${texto}`,
  );
}

test('todo arquivo de db/migrations/tenant passa pelo crivo', () => {
  const arquivos = realTenantFiles();
  assert.ok(arquivos.length > 0);
  for (const { name, text } of arquivos) {
    const comandos = passa(text, `tenant/${name.slice(0, -'.sql'.length)}`);
    assert.ok(comandos.length > 0, name);
  }
});

test('CREATE DOMAIN com uma restrição nomeada passa', () => {
  const comandos = passa(
    tenantMigration(`
CREATE DOMAIN money_amount AS numeric
    CONSTRAINT money_amount_envelope_check
    CHECK (min_scale(VALUE) <= 2 AND abs(VALUE) < 1e12);
`),
  );
  assert.equal(comandos.length, 1);
});

test('CREATE DOMAIN fora da forma estreita é recusado', () => {
  const nenhumaForma = /nenhuma forma da lista de permissão/;
  const casos: readonly (readonly [string, RegExp])[] = [
    // Modificador no tipo base: é o arredondamento silencioso que o domínio existe para evitar.
    ['CREATE DOMAIN d AS numeric(14,2) CONSTRAINT d_check CHECK (VALUE >= 0);', nenhumaForma],
    // Restrição sem nome.
    ['CREATE DOMAIN d AS numeric CHECK (VALUE >= 0);', nenhumaForma],
    // O que vem depois do CHECK morre na cauda, sem estar escrito em lugar nenhum.
    ['CREATE DOMAIN d AS numeric CONSTRAINT d_check CHECK (VALUE >= 0) NOT NULL;', /declara onde termina/],
    ['CREATE DOMAIN d AS numeric CONSTRAINT d_check CHECK (VALUE >= 0) DEFAULT 0;', /declara onde termina/],
    [
      'CREATE DOMAIN d AS numeric CONSTRAINT d_check CHECK (VALUE >= 0) CONSTRAINT e_check CHECK (VALUE < 9);',
      /declara onde termina/,
    ],
    ['CREATE DOMAIN d AS numeric CONSTRAINT d_check CHECK (VALUE IN (SELECT 1));', /SELECT/],
    ['CREATE DOMAIN t_outro.d AS numeric CONSTRAINT d_check CHECK (VALUE >= 0);', /qualificador de schema/],
    ['CREATE DOMAIN IF NOT EXISTS d AS numeric CONSTRAINT d_check CHECK (VALUE >= 0);', nenhumaForma],
  ];
  for (const [corpo, esperado] of casos) recusa(tenantMigration(corpo), esperado);
});

test('CREATE DOMAIN em migration não-transacional é recusado: a retomada dele é a transação', () => {
  recusa(
    tenantMigration('CREATE DOMAIN d AS numeric CONSTRAINT d_check CHECK (VALUE >= 0);', { transacional: false }),
    /transacional: nao/,
  );
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { checksumOf, discover } from '../src/discovery.js';
import { ExecutorError, EXIT_REFUSED } from '../src/errors.js';
import { buildMigrationsDir, REAL_PLATFORM_DIR, tenantMigration } from './support/tree.js';

/** `CONTRATO.md` §2 (descoberta, numeração e ordem) e §3 (checksum). */

function recusa(construir: () => unknown, esperado: RegExp): void {
  assert.throws(
    construir,
    (erro: unknown) =>
      erro instanceof ExecutorError && erro.exitCode === EXIT_REFUSED && esperado.test(erro.message),
  );
}

test('descobre a stream do repositório em ordem, com checksum dos bytes', () => {
  const encontrado = discover(buildMigrationsDir());

  // A lista não é fixada aqui: a stream cresce, e um teste que a repete vira manutenção sem valor.
  // O que é contrato é a ordem por número, a partir do 0000 (§2.2), e o checksum dos bytes (§3).
  assert.ok(encontrado.platform.length >= 5);
  assert.equal(encontrado.platform[0]!.version, 'platform/0000__ledger');
  assert.deepEqual(
    encontrado.platform.map((migration) => migration.number),
    encontrado.platform.map((_, indice) => indice),
  );

  const zero = encontrado.platform[0]!;
  const bytes = readFileSync(join(REAL_PLATFORM_DIR, '0000__ledger.sql'), 'utf-8');
  assert.equal(zero.checksum, checksumOf(bytes));
  assert.match(zero.checksum, /^[0-9a-f]{64}$/);
});

test('buraco na numeração recusa a rodada, e a conta parte do primeiro número legal', () => {
  recusa(
    () =>
      discover(
        buildMigrationsDir({
          tenant: [
            { name: '0001__a.sql', text: tenantMigration('CREATE TABLE IF NOT EXISTS a ();') },
            { name: '0003__c.sql', text: tenantMigration('CREATE TABLE IF NOT EXISTS c ();') },
          ],
        }),
      ),
    /buraco na numeração, esperava 0002/,
  );

  // Ausência do primeiro número legal também é buraco: partir do primeiro arquivo encontrado
  // deixaria passar um `tenant/0001` recém-apagado.
  recusa(
    () =>
      discover(
        buildMigrationsDir({
          tenant: [{ name: '0002__b.sql', text: tenantMigration('CREATE TABLE IF NOT EXISTS b ();') }],
        }),
      ),
    /esperava 0001 e encontrou 0002/,
  );
});

test('arquivo com CR é recusado, porque o checksum não normaliza (§3)', () => {
  recusa(
    () =>
      discover(
        buildMigrationsDir({
          tenant: [
            { name: '0001__a.sql', text: tenantMigration('CREATE TABLE IF NOT EXISTS a ();\r\n') },
          ],
        }),
      ),
    /contém CR/,
  );
});

test('cabeçalho que contradiz o diretório é recusado (§11.4)', () => {
  recusa(
    () =>
      discover(
        buildMigrationsDir({
          tenant: [
            {
              name: '0001__a.sql',
              text: '-- alvo: platform\n-- transacional: sim\n-- reversivel: nao; cria tabela\n\nSELECT 1;\n',
            },
          ],
        }),
      ),
    /cabeçalho declara alvo "platform" e o diretório diz "tenant"/,
  );
});

/** Caso 17 da §14. */
test('qualquer arquivo em modules/ recusa a rodada inteira, nomeando os arquivos (§11.6)', () => {
  recusa(
    () =>
      discover(
        buildMigrationsDir({
          modules: {
            est: [
              {
                name: '0001__estoque.sql',
                text:
                  '-- alvo: tenant\n-- modulo: EST\n-- transacional: sim\n' +
                  '-- reversivel: nao; cria tabela\n\nCREATE TABLE IF NOT EXISTS itens ();\n',
              },
            ],
          },
        }),
      ),
    /modules\/est\/0001__estoque\.sql/,
  );
});

test('nome de arquivo fora da forma NNNN__nome.sql é recusado', () => {
  recusa(
    () => discover(buildMigrationsDir({ tenant: [{ name: '1__a.sql', text: tenantMigration('SELECT 1;') }] })),
    /nome fora da forma NNNN__nome\.sql/,
  );
});

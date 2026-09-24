import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { runExecutor } from './support/executor.js';
import { createDatabase, skipWithoutPostgres, withClient, type DisposableDatabase } from './support/postgres.js';
import { buildMigrationsDir, tenantMigration } from './support/tree.js';

/** `status` (`PROVISION-E-VERIFY.md` §12): lista o aplicado e o pendente, e **não escreve nada**. */

const PEDIDOS = tenantMigration('CREATE TABLE IF NOT EXISTS orders (order_id uuid NOT NULL);');
const DESCONTO = tenantMigration('ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount integer;');

describe('status', { skip: skipWithoutPostgres }, () => {
  let db: DisposableDatabase;

  before(async () => {
    db = await createDatabase();
  });
  after(async () => {
    await db.drop();
  });

  test('em banco vazio relata a ausência do controle, sem criar nada', async () => {
    const resultado = await runExecutor(
      { kind: 'status' },
      { url: db.url, migrationsDir: buildMigrationsDir({ tenant: [{ name: '0001__orders.sql', text: PEDIDOS }] }) },
    );
    assert.equal(resultado.exitCode, 0, resultado.error);
    assert.match(resultado.output, /platform\.tenants não existe/);

    await withClient(db.url, async (client) => {
      const schemas = await client.query("select 1 from pg_namespace where nspname = 'platform'");
      assert.equal(schemas.rowCount, 0, 'status não pode criar o schema de controle');
    });
  });

  test('depois de aplicar, lista o pendente por schema sem escrever no livro-razão', async () => {
    const soTabela = buildMigrationsDir({ tenant: [{ name: '0001__orders.sql', text: PEDIDOS }] });
    const feito = await runExecutor({ kind: 'provision', slug: 'acme' }, { url: db.url, migrationsDir: soTabela });
    assert.equal(feito.exitCode, 0, feito.error);

    const comPendente = buildMigrationsDir({
      tenant: [
        { name: '0001__orders.sql', text: PEDIDOS },
        { name: '0002__discount.sql', text: DESCONTO },
      ],
    });
    const antes = await contaLedger(db.url);
    const resultado = await runExecutor({ kind: 'status' }, { url: db.url, migrationsDir: comPendente });

    assert.equal(resultado.exitCode, 0, resultado.error);
    assert.match(resultado.output, /t_acme: 1 de 2 aplicadas, 1 pendentes/);
    assert.match(resultado.output, /pendente: tenant\/0002__discount/);
    assert.equal(await contaLedger(db.url), antes);
  });
});

async function contaLedger(url: string): Promise<number> {
  return withClient(url, async (client) => {
    const resultado = await client.query<{ total: string }>(
      'select count(*)::text as total from platform.schema_migrations',
    );
    return Number.parseInt(resultado.rows[0]?.total ?? '0', 10);
  });
}

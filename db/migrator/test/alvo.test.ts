import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { runExecutor } from './support/executor.js';
import { createDatabase, skipWithoutPostgres, withClient, type DisposableDatabase } from './support/postgres.js';
import { approveAllScreen } from './support/screen.js';
import { buildMigrationsDir, tenantMigration } from './support/tree.js';

/**
 * Caso 8 de `CONTRATO.md` §14: corpo que cria objeto fora do schema alvo, nos dois regimes
 * (`APLICACAO-E-ALVO.md` §10.4).
 *
 * **Estes são os únicos testes que passam um crivo permissivo** (`support/screen.ts`). Um arquivo
 * que cria objeto fora do alvo é, por construção, um arquivo que o crivo real recusa na §11.3 — e
 * um teste que só exercitasse a primeira camada não provaria nada sobre a segunda. A spec é
 * explícita sobre serem camadas: aquela é recusa de forma, esta é detecção de efeito.
 */

const PEDIDOS = tenantMigration(`
CREATE TABLE IF NOT EXISTS orders (
    order_id uuid NOT NULL,
    total numeric(14,2) NOT NULL,
    CONSTRAINT orders_pkey PRIMARY KEY (order_id)
);
`);

describe('verificação de namespace', { skip: skipWithoutPostgres }, () => {
  let db: DisposableDatabase;
  const base = { tenant: [{ name: '0001__orders.sql', text: PEDIDOS }] };

  before(async () => {
    db = await createDatabase();
    const feito = await runExecutor(
      { kind: 'provision', slug: 'acme' },
      { url: db.url, migrationsDir: buildMigrationsDir(base) },
    );
    assert.equal(feito.exitCode, 0, feito.error);
  });
  after(async () => {
    await db.drop();
  });

  test('transacional: aborta antes do commit, e o objeto nunca existiu', async () => {
    const migrationsDir = buildMigrationsDir({
      tenant: [
        ...base.tenant,
        {
          name: '0002__fora.sql',
          text: tenantMigration('CREATE TABLE IF NOT EXISTS public.fora (x integer);'),
        },
      ],
    });

    const resultado = await runExecutor(
      { kind: 'migrate' },
      { url: db.url, migrationsDir, contentScreen: approveAllScreen },
    );

    assert.equal(resultado.exitCode, 1, resultado.error);
    assert.match(resultado.error ?? '', /fora do namespace alvo "t_acme"/);
    assert.match(resultado.error ?? '', /public\.fora/);
    assert.equal(await existe(db.url, 'public', 'fora'), false);
    assert.equal(await eventos(db.url, 'object_outside_target'), 1);
  });

  test('não-transacional: a rodada para na verificação seguinte, e o objeto continua lá', async () => {
    await withClient(db.url, async (client) => {
      await client.query('create table public.alvo (x integer)');
    });

    const migrationsDir = buildMigrationsDir({
      tenant: [
        ...base.tenant,
        {
          name: '0002__indices.sql',
          text: tenantMigration(
            'CREATE INDEX CONCURRENTLY IF NOT EXISTS ix_orders_total ON orders (total);\n' +
              'CREATE INDEX CONCURRENTLY IF NOT EXISTS ix_fora ON public.alvo (x);',
            { transacional: false, criaIndice: 'ix_orders_total, ix_fora' },
          ),
        },
      ],
    });

    const resultado = await runExecutor(
      { kind: 'migrate' },
      { url: db.url, migrationsDir, contentScreen: approveAllScreen },
    );

    assert.equal(resultado.exitCode, 1, resultado.error);
    assert.match(resultado.error ?? '', /public\.ix_fora/);
    // Não há transação para desfazer: o objeto fica, e removê-lo é decisão humana (§10.4).
    assert.equal(await existe(db.url, 'public', 'ix_fora'), true);
    assert.equal(await existe(db.url, 't_acme', 'ix_orders_total'), true);

    await withClient(db.url, async (client) => {
      const linha = await client.query(
        `select 1 from platform.schema_migrations
          where schema_name = 't_acme' and version = 'tenant/0002__indices' and applied_at is null`,
      );
      assert.equal(linha.rowCount, 1, 'a linha do livro-razão tem que ficar em voo');
    });
  });
});

async function existe(url: string, schema: string, nome: string): Promise<boolean> {
  return withClient(url, async (client) => {
    const resultado = await client.query(
      `select 1 from pg_class c join pg_namespace n on n.oid = c.relnamespace
        where n.nspname = $1 and c.relname = $2`,
      [schema, nome],
    );
    return resultado.rowCount === 1;
  });
}

async function eventos(url: string, kind: string): Promise<number> {
  return withClient(url, async (client) => {
    const resultado = await client.query<{ total: string }>(
      'select count(*)::text as total from platform.executor_events where kind_code = $1',
      [kind],
    );
    return Number.parseInt(resultado.rows[0]?.total ?? '0', 10);
  });
}

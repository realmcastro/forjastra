import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { runExecutor } from './support/executor.js';
import { createDatabase, skipWithoutPostgres, withClient, type DisposableDatabase } from './support/postgres.js';
import { buildMigrationsDir, tenantMigration } from './support/tree.js';

/**
 * Casos 1 a 5 e 11 de `CONTRATO.md` §14, contra Postgres real e descartável.
 */

const PEDIDOS = tenantMigration(`
CREATE TABLE IF NOT EXISTS orders (
    order_id    uuid        NOT NULL,
    total       numeric(14,2) NOT NULL,
    created_at  timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT orders_pkey PRIMARY KEY (order_id)
);
`);

const PEDIDOS_DESCONTO = tenantMigration(`
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount numeric(14,2);
`);

const PEDIDOS_RESTRICAO = tenantMigration(`
ALTER TABLE orders ADD CONSTRAINT orders_total_check CHECK (total >= 0);
`);

describe('migrate', { skip: skipWithoutPostgres }, () => {
  let db: DisposableDatabase;

  before(async () => {
    db = await createDatabase();
  });
  after(async () => {
    await db.drop();
  });

  /** Caso 1: banco vazio, `migrate` + `provision`. */
  test('banco vazio: migrate levanta o platform e provision levanta um cliente completo', async () => {
    const migrationsDir = buildMigrationsDir({ tenant: [{ name: '0001__orders.sql', text: PEDIDOS }] });

    const migrado = await runExecutor({ kind: 'migrate' }, { url: db.url, migrationsDir });
    assert.equal(migrado.exitCode, 0, migrado.error);

    const provisionado = await runExecutor(
      { kind: 'provision', slug: 'acme' },
      { url: db.url, migrationsDir },
    );
    assert.equal(provisionado.exitCode, 0, provisionado.error);

    await withClient(db.url, async (client) => {
      const tabelas = await client.query<{ relname: string }>(
        `select c.relname from pg_class c join pg_namespace n on n.oid = c.relnamespace
          where n.nspname = 't_acme' and c.relkind = 'r' order by 1`,
      );
      assert.deepEqual(tabelas.rows.map((linha) => linha.relname), ['orders']);

      const registro = await client.query<{ slug: string; schema_name: string }>(
        'select slug, schema_name from platform.tenants',
      );
      assert.deepEqual(registro.rows, [{ slug: 'acme', schema_name: 't_acme' }]);

      const ledger = await client.query<{ schema_name: string; version: string }>(
        `select schema_name, version from platform.schema_migrations
          where schema_name = 't_acme'`,
      );
      assert.deepEqual(ledger.rows, [{ schema_name: 't_acme', version: 'tenant/0001__orders' }]);
    });
  });

  /** Caso 3: `migrate` rodado duas vezes seguidas. */
  test('segunda rodada não escreve linha nova e não muda a estrutura', async () => {
    const migrationsDir = buildMigrationsDir({ tenant: [{ name: '0001__orders.sql', text: PEDIDOS }] });
    const antes = await retrato(db.url);

    const segunda = await runExecutor({ kind: 'migrate' }, { url: db.url, migrationsDir });
    assert.equal(segunda.exitCode, 0, segunda.error);

    assert.deepEqual(await retrato(db.url), antes);
    assert.equal(segunda.output.includes('aplicando'), false, segunda.output);
  });

  /** Caso 2: schema com dado representativo. */
  test('migration nova aplica sobre schema com dado, sem perder linha', async () => {
    await withClient(db.url, async (client) => {
      await client.query(
        `insert into t_acme.orders (order_id, total)
         values ('018f0000-0000-7000-8000-000000000001', 10.00),
                ('018f0000-0000-7000-8000-000000000002', 20.50)`,
      );
    });

    const migrationsDir = buildMigrationsDir({
      tenant: [
        { name: '0001__orders.sql', text: PEDIDOS },
        { name: '0002__orders_discount.sql', text: PEDIDOS_DESCONTO },
      ],
    });
    const aplicado = await runExecutor({ kind: 'migrate' }, { url: db.url, migrationsDir });
    assert.equal(aplicado.exitCode, 0, aplicado.error);

    await withClient(db.url, async (client) => {
      const linhas = await client.query('select order_id, total, discount from t_acme.orders');
      assert.equal(linhas.rowCount, 2);
      assert.equal(linhas.rows.every((linha) => (linha as { discount: unknown }).discount === null), true);
    });
  });

  /** Caso 4: falha no schema k de N, e a rodada seguinte converge. */
  test('falha no schema k de N deixa os k-1 aplicados, e a retomada não duplica', async () => {
    // A árvore é cumulativa: t_acme já tem a 0002 no livro-razão, e uma árvore sem ela seria
    // divergência de §3 — que é o próprio executor cobrando o que este teste não está testando.
    const semRestricao = buildMigrationsDir({
      tenant: [
        { name: '0001__orders.sql', text: PEDIDOS },
        { name: '0002__orders_discount.sql', text: PEDIDOS_DESCONTO },
      ],
    });
    for (const slug of ['beta', 'gama']) {
      const feito = await runExecutor({ kind: 'provision', slug }, { url: db.url, migrationsDir: semRestricao });
      assert.equal(feito.exitCode, 0, feito.error);
    }

    // A restrição já existe em t_beta: a migration 0002 vai falhar ali, e só ali.
    await withClient(db.url, async (client) => {
      await client.query('alter table t_beta.orders add constraint orders_total_check check (total >= 0)');
    });

    const comRestricao = buildMigrationsDir({
      tenant: [
        { name: '0001__orders.sql', text: PEDIDOS },
        { name: '0002__orders_discount.sql', text: PEDIDOS_DESCONTO },
        { name: '0003__orders_total_check.sql', text: PEDIDOS_RESTRICAO },
      ],
    });
    const falhou = await runExecutor({ kind: 'migrate' }, { url: db.url, migrationsDir: comRestricao });
    assert.equal(falhou.exitCode, 1, `esperava falha de aplicação, veio ${falhou.exitCode}`);
    assert.match(falhou.error ?? '', /t_beta/);

    // t_acme (anterior na ordem) ficou aplicado; t_gama (posterior) não foi tocado.
    assert.deepEqual(await versoesAplicadas(db.url, 't_acme'), [
      'tenant/0001__orders',
      'tenant/0002__orders_discount',
      'tenant/0003__orders_total_check',
    ]);
    assert.deepEqual(await versoesAplicadas(db.url, 't_gama'), [
      'tenant/0001__orders',
      'tenant/0002__orders_discount',
    ]);
    assert.deepEqual(await versoesAplicadas(db.url, 't_beta'), [
      'tenant/0001__orders',
      'tenant/0002__orders_discount',
    ]);

    // A falha virou fato (§19), e a tentativa não deixou a restrição pela metade em t_beta.
    assert.equal(await contaEventos(db.url, 'migration_failed'), 1);

    await withClient(db.url, async (client) => {
      await client.query('alter table t_beta.orders drop constraint orders_total_check');
    });

    const retomada = await runExecutor({ kind: 'migrate' }, { url: db.url, migrationsDir: comRestricao });
    assert.equal(retomada.exitCode, 0, retomada.error);
    for (const schema of ['t_acme', 't_beta', 't_gama']) {
      assert.deepEqual(await versoesAplicadas(db.url, schema), [
        'tenant/0001__orders',
        'tenant/0002__orders_discount',
        'tenant/0003__orders_total_check',
      ]);
    }
  });

  /** Caso 5: um byte alterado em migration já aplicada. */
  test('checksum divergente para tudo, com saída 3 e os dois checksums na mensagem', async () => {
    const migrationsDir = buildMigrationsDir({
      tenant: [
        { name: '0001__orders.sql', text: PEDIDOS },
        { name: '0002__orders_discount.sql', text: PEDIDOS_DESCONTO },
        { name: '0003__orders_total_check.sql', text: PEDIDOS_RESTRICAO },
      ],
    });
    const alvo = join(migrationsDir, 'tenant', '0001__orders.sql');
    writeFileSync(alvo, `${readFileSync(alvo, 'utf-8')}-- um byte a mais\n`, 'utf-8');

    const antes = await retrato(db.url);
    const resultado = await runExecutor({ kind: 'migrate' }, { url: db.url, migrationsDir });

    assert.equal(resultado.exitCode, 3, resultado.error);
    assert.match(resultado.error ?? '', /t_acme|t_beta|t_gama/);
    assert.match(resultado.error ?? '', /tenant\/0001__orders/);
    assert.match(resultado.error ?? '', /registrado: [0-9a-f]{64}/);
    assert.match(resultado.error ?? '', /calculado:  [0-9a-f]{64}/);
    assert.deepEqual(await retrato(db.url), antes);
    assert.equal(await contaEventos(db.url, 'checksum_mismatch'), 1);
  });
});

/** Caso 11: `platform.schema_migrations` pré-existente, nas duas formas. */
describe('bootstrap do livro-razão', { skip: skipWithoutPostgres }, () => {
  test('view com o nome do livro-razão: saída 3, nomeando o relkind', async () => {
    const db = await createDatabase();
    try {
      await withClient(db.url, async (client) => {
        await client.query('create schema platform');
        await client.query(
          'create view platform.schema_migrations as select 1 as schema_name',
        );
      });
      const resultado = await runExecutor(
        { kind: 'migrate' },
        { url: db.url, migrationsDir: buildMigrationsDir() },
      );
      assert.equal(resultado.exitCode, 3, resultado.error);
      assert.match(resultado.error ?? '', /relkind "v"/);
    } finally {
      await db.drop();
    }
  });

  test('tabela de mesmas colunas e sem restrição: saída 3, nomeando o que falta', async () => {
    const db = await createDatabase();
    try {
      await withClient(db.url, async (client) => {
        await client.query('create schema platform');
        await client.query(`create table platform.schema_migrations (
            schema_name text not null, version text not null, checksum text not null,
            module text null, started_at timestamptz not null, applied_at timestamptz null,
            duration_ms integer null)`);
      });
      const resultado = await runExecutor(
        { kind: 'migrate' },
        { url: db.url, migrationsDir: buildMigrationsDir() },
      );
      assert.equal(resultado.exitCode, 3, resultado.error);
      assert.match(resultado.error ?? '', /schema_migrations_pkey/);
    } finally {
      await db.drop();
    }
  });
});

async function retrato(url: string): Promise<readonly string[]> {
  return withClient(url, async (client) => {
    const estrutura = await client.query<{ linha: string }>(
      `select n.nspname || '.' || c.relname || ':' || c.relkind::text as linha
         from pg_class c join pg_namespace n on n.oid = c.relnamespace
        where n.nspname = 'platform' or n.nspname like 't\\_%'
        order by 1`,
    );
    const ledger = await client.query<{ linha: string }>(
      `select schema_name || ' ' || version || ' ' || checksum as linha
         from platform.schema_migrations order by 1`,
    );
    return [...estrutura.rows, ...ledger.rows].map((linha) => linha.linha);
  });
}

async function versoesAplicadas(url: string, schema: string): Promise<readonly string[]> {
  return withClient(url, async (client) => {
    const resultado = await client.query<{ version: string }>(
      `select version from platform.schema_migrations
        where schema_name = $1 and applied_at is not null order by version collate "C"`,
      [schema],
    );
    return resultado.rows.map((linha) => linha.version);
  });
}

async function contaEventos(url: string, kind: string): Promise<number> {
  return withClient(url, async (client) => {
    const resultado = await client.query<{ total: string }>(
      'select count(*)::text as total from platform.executor_events where kind_code = $1',
      [kind],
    );
    return Number.parseInt(resultado.rows[0]?.total ?? '0', 10);
  });
}

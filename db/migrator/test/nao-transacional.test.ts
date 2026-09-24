import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { runExecutor } from './support/executor.js';
import { createDatabase, skipWithoutPostgres, withClient, type DisposableDatabase } from './support/postgres.js';
import { buildMigrationsDir, tenantMigration } from './support/tree.js';

/** Casos 6 e 7 de `CONTRATO.md` §14: o regime não-transacional (§8 e §10.3.2). */

const PEDIDOS = tenantMigration(`
CREATE TABLE IF NOT EXISTS orders (
    order_id uuid NOT NULL,
    total numeric(14,2) NOT NULL,
    CONSTRAINT orders_pkey PRIMARY KEY (order_id)
);
`);

const INDICE = tenantMigration(
  'CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS ix_orders_total ON orders (total);',
  { transacional: false, criaIndice: 'ix_orders_total' },
);

const ARVORE = {
  tenant: [
    { name: '0001__orders.sql', text: PEDIDOS },
    { name: '0002__ix_orders_total.sql', text: INDICE },
  ],
};

describe('migration não-transacional', { skip: skipWithoutPostgres }, () => {
  let db: DisposableDatabase;
  const migrationsDir = buildMigrationsDir(ARVORE);

  before(async () => {
    db = await createDatabase();
  });
  after(async () => {
    await db.drop();
  });

  /**
   * Caso 7: o índice existe **em cada schema alvo**, com `relnamespace` conferido, e não existe em
   * `public`. É o `MIG-01` virando teste: em autocommit o alvo não sobrevive ao statement, e o
   * auditor mediu um `CREATE INDEX CONCURRENTLY` nascendo em `public`.
   */
  test('o índice nasce no schema alvo de cada cliente, e não em public', async () => {
    for (const slug of ['acme', 'beta']) {
      const feito = await runExecutor({ kind: 'provision', slug }, { url: db.url, migrationsDir });
      assert.equal(feito.exitCode, 0, feito.error);
    }

    for (const schema of ['t_acme', 't_beta']) {
      assert.deepEqual(await indice(db.url, schema, 'ix_orders_total'), { valido: true });
    }
    assert.equal(await indice(db.url, 'public', 'ix_orders_total'), undefined);

    // A conclusão da linha em voo é a única atualização que o executor emite no livro-razão (§8).
    await withClient(db.url, async (client) => {
      const linha = await client.query<{ applied_at: Date | null; duration_ms: number | null }>(
        `select applied_at, duration_ms from platform.schema_migrations
          where schema_name = 't_acme' and version = 'tenant/0002__ix_orders_total'`,
      );
      assert.notEqual(linha.rows[0]?.applied_at, null);
      assert.notEqual(linha.rows[0]?.duration_ms, null);
    });
  });

  /**
   * Caso 6: interrompida no meio do `CREATE INDEX CONCURRENTLY`.
   *
   * A interrupção é **real**, não simulada: um índice único sobre dado duplicado falha e deixa
   * exatamente o que a rodada morta deixaria — `indisvalid = false` no catálogo e a linha do
   * livro-razão em voo. Forjar esse estado à mão não era possível, e a impossibilidade é a trava da
   * `0003`: o livro-razão não aceita `DELETE` nem reescrita de `applied_at` (§18.1).
   */
  test('retomada derruba o índice inválido, recria, e o índice final é válido', async () => {
    const proprio = await createDatabase();
    try {
      const soTabela = buildMigrationsDir({ tenant: [ARVORE.tenant[0]!] });
      const provisionado = await runExecutor(
        { kind: 'provision', slug: 'gama' },
        { url: proprio.url, migrationsDir: soTabela },
      );
      assert.equal(provisionado.exitCode, 0, provisionado.error);

      await withClient(proprio.url, async (client) => {
        await client.query(
          `insert into t_gama.orders (order_id, total) values
              ('018f0000-0000-7000-8000-000000000001', 10.00),
              ('018f0000-0000-7000-8000-000000000002', 10.00)`,
        );
      });

      const morreu = await runExecutor(
        { kind: 'migrate' },
        { url: proprio.url, migrationsDir },
      );
      assert.equal(morreu.exitCode, 1, morreu.error);
      assert.deepEqual(await indice(proprio.url, 't_gama', 'ix_orders_total'), { valido: false });
      assert.equal(await emVoo(proprio.url, 't_gama', 'tenant/0002__ix_orders_total'), true);

      await withClient(proprio.url, async (client) => {
        await client.query(
          "delete from t_gama.orders where order_id = '018f0000-0000-7000-8000-000000000002'",
        );
      });

      const retomada = await runExecutor({ kind: 'migrate' }, { url: proprio.url, migrationsDir });
      assert.equal(retomada.exitCode, 0, retomada.error);
      assert.deepEqual(await indice(proprio.url, 't_gama', 'ix_orders_total'), { valido: true });
      assert.equal(await emVoo(proprio.url, 't_gama', 'tenant/0002__ix_orders_total'), false);
    } finally {
      await proprio.drop();
    }
  });
});

async function emVoo(url: string, schema: string, version: string): Promise<boolean> {
  return withClient(url, async (client) => {
    const resultado = await client.query<{ applied_at: Date | null }>(
      `select applied_at from platform.schema_migrations
        where schema_name = $1 and version = $2`,
      [schema, version],
    );
    assert.equal(resultado.rowCount, 1, `linha do livro-razão ausente para ${schema}/${version}`);
    return resultado.rows[0]?.applied_at === null;
  });
}

async function indice(
  url: string,
  schema: string,
  nome: string,
): Promise<{ valido: boolean } | undefined> {
  return withClient(url, async (client) => {
    const resultado = await client.query<{ indisvalid: boolean }>(
      `select i.indisvalid
         from pg_class c
         join pg_namespace n on n.oid = c.relnamespace
         join pg_index i on i.indexrelid = c.oid
        where n.nspname = $1 and c.relname = $2 and c.relkind = 'i'`,
      [schema, nome],
    );
    const linha = resultado.rows[0];
    return linha === undefined ? undefined : { valido: linha.indisvalid };
  });
}

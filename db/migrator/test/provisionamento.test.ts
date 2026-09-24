import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { runExecutor } from './support/executor.js';
import { createDatabase, skipWithoutPostgres, withClient, type DisposableDatabase } from './support/postgres.js';
import { buildMigrationsDir, tenantMigration } from './support/tree.js';
import { isValidTenantSlug } from '../src/target.js';

/** Casos 9, 10 e 27 de `CONTRATO.md` §14, e a procedência do nome de `APLICACAO-E-ALVO.md` §10.1. */

const PEDIDOS = tenantMigration(`
CREATE TABLE IF NOT EXISTS orders (
    order_id uuid NOT NULL,
    CONSTRAINT orders_pkey PRIMARY KEY (order_id)
);
`);

describe('provision e a procedência do nome', { skip: skipWithoutPostgres }, () => {
  let db: DisposableDatabase;
  const migrationsDir = buildMigrationsDir({ tenant: [{ name: '0001__orders.sql', text: PEDIDOS }] });

  before(async () => {
    db = await createDatabase();
    const preparado = await runExecutor({ kind: 'provision', slug: 'acme' }, { url: db.url, migrationsDir });
    assert.equal(preparado.exitCode, 0, preparado.error);
  });
  after(async () => {
    await db.drop();
  });

  /** Caso 9, primeira metade: slug já registrado. */
  test('slug já registrado é recusado com saída 2, sem linha nova no registro', async () => {
    const resultado = await runExecutor({ kind: 'provision', slug: 'acme' }, { url: db.url, migrationsDir });
    assert.equal(resultado.exitCode, 2, resultado.error);
    assert.match(resultado.error ?? '', /cliente já registrado/);
    assert.match(resultado.error ?? '', /migrate --schema t_acme/);
    assert.equal(await contaClientes(db.url), 1);
  });

  /** Caso 9, segunda metade: schema já existe. É o `MIG-02`, medido entrando no schema de outro. */
  test('schema pré-existente é recusado com saída 2, sem registrar e sem aplicar', async () => {
    await withClient(db.url, async (client) => {
      await client.query('create schema t_invasor');
      await client.query('create table t_invasor.dado_do_cliente (x integer)');
    });

    const resultado = await runExecutor({ kind: 'provision', slug: 'invasor' }, { url: db.url, migrationsDir });
    assert.equal(resultado.exitCode, 2, resultado.error);
    assert.match(resultado.error ?? '', /já existe no catálogo/);
    assert.equal(await contaClientes(db.url), 1);

    await withClient(db.url, async (client) => {
      const tabelas = await client.query(
        `select 1 from pg_class c join pg_namespace n on n.oid = c.relnamespace
          where n.nspname = 't_invasor' and c.relname = 'orders'`,
      );
      assert.equal(tabelas.rowCount, 0, 'o núcleo não pode ter sido aplicado dentro do schema alheio');
    });
  });

  test('slug fora da forma, e slug reservado, são recusados na borda', async () => {
    for (const slug of ['Acme', 'acme-2', 'verify_x', 'pg_x', 'platform', 'public']) {
      const resultado = await runExecutor({ kind: 'provision', slug }, { url: db.url, migrationsDir });
      assert.equal(resultado.exitCode, 2, `${slug}: ${resultado.error}`);
      assert.match(resultado.error ?? '', /fora da forma aceita/);
    }
    assert.equal(await contaClientes(db.url), 1);
  });

  /**
   * Caso 27, as duas pernas de banco: a borda (§10.2) e o `CHECK` da `0007`. O teto era 41 — a classe
   * inicial conta uma vez e a repetição contava até 40 —, e o cliente de nome comprido saía da
   * fronteira de schema do carregador sem sintoma nenhum (`EXE-03`). A terceira perna, a do
   * carregador, está em `crivo.test.ts`.
   */
  test('slug de 41 caracteres é recusado na borda e pelo CHECK do registro', async () => {
    const acimaDoTeto = 'a'.repeat(41);
    const noTeto = 'b'.repeat(40);

    assert.equal(isValidTenantSlug(acimaDoTeto), false);
    assert.equal(isValidTenantSlug(noTeto), true);

    const resultado = await runExecutor(
      { kind: 'provision', slug: acimaDoTeto },
      { url: db.url, migrationsDir },
    );
    assert.equal(resultado.exitCode, 2, resultado.error);
    assert.match(resultado.error ?? '', /fora da forma aceita/);
    assert.equal(await contaClientes(db.url), 1);

    // O registro é append-only (0002), então a sonda do CHECK vive dentro de uma transação revertida:
    // a linha do slug no teto não pode ficar para trás e virar cliente registrado sem schema.
    const INSERIR = 'insert into platform.tenants (tenant_id, slug) values (gen_random_uuid(), $1)';
    await withClient(db.url, async (client) => {
      await client.query('begin');
      try {
        await assert.rejects(
          client.query(INSERIR, [acimaDoTeto]),
          /tenants_slug_length_check/,
          'o CHECK da 0007 é a fronteira do banco, e um INSERT direto tem que bater nele',
        );
        await client.query('rollback');

        await client.query('begin');
        const noLimite = await client.query(INSERIR, [noTeto]);
        assert.equal(noLimite.rowCount, 1, 'o teto é 40, e 40 tem que entrar');
      } finally {
        await client.query('rollback');
      }
    });
    assert.equal(await contaClientes(db.url), 1);
  });

  /** Caso 10: `migrate --schema` com nome fora do registro, inclusive `public`. */
  test('migrate --schema fora do registro é recusado, e nada é aplicado', async () => {
    for (const schema of ['public', 't_nao_registrado', 'platform']) {
      const resultado = await runExecutor(
        { kind: 'migrate', schema },
        { url: db.url, migrationsDir },
      );
      assert.equal(resultado.exitCode, 2, `${schema}: ${resultado.error}`);
      assert.match(resultado.error ?? '', /não está em platform\.tenants/);
    }

    await withClient(db.url, async (client) => {
      const foraDoLugar = await client.query(
        `select 1 from pg_class c join pg_namespace n on n.oid = c.relnamespace
          where n.nspname in ('public', 'platform') and c.relname = 'orders'`,
      );
      assert.equal(foraDoLugar.rowCount, 0, 'a stream tenant não pode ter ido para public nem platform');
    });
  });

  /** §10.1: `migrate` nunca cria schema, e schema registrado que sumiu é drift. */
  test('schema registrado que não existe no catálogo para a rodada', async () => {
    await withClient(db.url, async (client) => {
      await client.query('drop schema t_acme cascade');
    });
    const resultado = await runExecutor({ kind: 'migrate' }, { url: db.url, migrationsDir });
    assert.equal(resultado.exitCode, 3, resultado.error);
    assert.match(resultado.error ?? '', /migrate não cria schema/);

    await withClient(db.url, async (client) => {
      const eventos = await client.query(
        "select 1 from platform.executor_events where kind_code = 'registered_schema_missing'",
      );
      assert.equal(eventos.rowCount, 1);
    });
  });
});

async function contaClientes(url: string): Promise<number> {
  return withClient(url, async (client) => {
    const resultado = await client.query<{ total: string }>(
      'select count(*)::text as total from platform.tenants',
    );
    return Number.parseInt(resultado.rows[0]?.total ?? '0', 10);
  });
}

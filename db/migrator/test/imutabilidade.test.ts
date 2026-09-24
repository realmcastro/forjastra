import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { runExecutor } from './support/executor.js';
import { createDatabase, skipWithoutPostgres, withClient, type DisposableDatabase } from './support/postgres.js';
import { buildMigrationsDir, tenantMigration } from './support/tree.js';

/**
 * Casos 15, 16 e 22 de `CONTRATO.md` §14: o que o `platform` recusa alterar
 * (`IMUTABILIDADE-E-FATOS.md` §18).
 *
 * O que está sendo testado é o banco, com a credencial do executor. As travas não entregam
 * impossibilidade para quem tem a credencial e decide — o dono desliga o gatilho (§18.2) —, e é por
 * isso que o `verify` passou a enxergar gatilho desligado (§13.3).
 */

const PEDIDOS = tenantMigration('CREATE TABLE IF NOT EXISTS orders (order_id uuid NOT NULL);');

describe('travas do schema de controle', { skip: skipWithoutPostgres }, () => {
  let db: DisposableDatabase;

  before(async () => {
    db = await createDatabase();
    const feito = await runExecutor(
      { kind: 'provision', slug: 'acme' },
      { url: db.url, migrationsDir: buildMigrationsDir({ tenant: [{ name: '0001__orders.sql', text: PEDIDOS }] }) },
    );
    assert.equal(feito.exitCode, 0, feito.error);
  });
  after(async () => {
    await db.drop();
  });

  /** Caso 15: o par `DELETE`+`UPDATE` era o que fazia um cliente resolver para o schema de outro. */
  test('platform.tenants recusa UPDATE, DELETE e TRUNCATE, e nenhuma linha muda', async () => {
    await recusados(db.url, [
      "update platform.tenants set slug = 'outro' where slug = 'acme'",
      "delete from platform.tenants where slug = 'acme'",
      'truncate platform.tenants',
    ]);

    await withClient(db.url, async (client) => {
      const linhas = await client.query<{ slug: string }>('select slug from platform.tenants');
      assert.deepEqual(linhas.rows, [{ slug: 'acme' }]);
    });
  });

  /** Caso 16: a única atualização legítima é a conclusão de uma migration em voo. */
  test('o livro-razão recusa reescrita e remoção, e aceita só a conclusão', async () => {
    await recusados(db.url, [
      "update platform.schema_migrations set checksum = repeat('0', 64) where schema_name = 't_acme'",
      "update platform.schema_migrations set version = 'outra' where schema_name = 't_acme'",
      "update platform.schema_migrations set started_at = now() where schema_name = 't_acme'",
      "delete from platform.schema_migrations where schema_name = 't_acme'",
    ]);

    await withClient(db.url, async (client) => {
      await client.query(
        `insert into platform.schema_migrations
             (schema_name, version, checksum, module, started_at, applied_at, duration_ms)
         values ('t_acme', 'tenant/9999__prova', repeat('a', 64), null, now(), null, null)`,
      );
      // A conclusão passa: applied_at de nulo para preenchido, com as demais colunas intactas.
      await client.query(
        `update platform.schema_migrations set applied_at = now(), duration_ms = 1
          where schema_name = 't_acme' and version = 'tenant/9999__prova'`,
      );
      // E não passa duas vezes: depois de concluída, a linha não é mais atualizável.
      await assert.rejects(
        client.query(
          `update platform.schema_migrations set applied_at = now(), duration_ms = 2
            where schema_name = 't_acme' and version = 'tenant/9999__prova'`,
        ),
      );
    });
  });

  /** Caso 22: o domínio de tipos de evento, cuja mutação desarmava a captura inteira. */
  test('platform.executor_event_kinds recusa mutação, e o seed continua idempotente', async () => {
    await recusados(db.url, [
      "delete from platform.executor_event_kinds where code = 'checksum_mismatch'",
      "update platform.executor_event_kinds set code = 'x' where code = 'checksum_mismatch'",
      "update platform.executor_event_kinds set description = 'x' where code = 'checksum_mismatch'",
      'truncate platform.executor_event_kinds cascade',
    ]);

    await withClient(db.url, async (client) => {
      const antes = await contaTipos(client);
      await client.query(
        `insert into platform.executor_event_kinds (code, description)
         values ('checksum_mismatch', 'texto novo') on conflict do nothing`,
      );
      assert.equal(await contaTipos(client), antes);
      const descricao = await client.query<{ description: string }>(
        "select description from platform.executor_event_kinds where code = 'checksum_mismatch'",
      );
      assert.notEqual(descricao.rows[0]?.description, 'texto novo');
    });
  });
});

async function recusados(url: string, comandos: readonly string[]): Promise<void> {
  for (const comando of comandos) {
    await withClient(url, async (client) => {
      await assert.rejects(client.query(comando), (erro: unknown) => {
        assert.match((erro as Error).message, /não aceita|aceita uma atualização só/);
        return true;
      }, comando);
    });
  }
}

async function contaTipos(client: { query: (sql: string) => Promise<{ rows: unknown[] }> }): Promise<number> {
  const resultado = await client.query('select count(*)::text as total from platform.executor_event_kinds');
  return Number.parseInt((resultado.rows[0] as { total: string }).total, 10);
}

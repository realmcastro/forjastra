import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { runExecutor } from './support/executor.js';
import { createDatabase, skipWithoutPostgres, withClient, type DisposableDatabase } from './support/postgres.js';
import { buildMigrationsDir, tenantMigration } from './support/tree.js';

/**
 * Caso 23 de `CONTRATO.md` §14: a recusa do carregador vira fato (`IMUTABILIDADE-E-FATOS.md` §19.4).
 *
 * É a única detecção deste sistema com outra pessoa do outro lado, e a que não tinha casa: o git
 * guarda o arquivo **se ele for commitado**, e o episódio que interessa é o outro — o arquivo
 * recusado e corrigido antes de entrar, num ambiente compartilhado.
 */

const PEDIDOS = tenantMigration('CREATE TABLE IF NOT EXISTS orders (order_id uuid NOT NULL);');

const RECUSADA = {
  tenant: [
    { name: '0001__orders.sql', text: PEDIDOS },
    {
      name: '0002__invasao.sql',
      text: tenantMigration('ALTER TABLE T_OUTRO.orders ADD COLUMN IF NOT EXISTS x integer;'),
    },
  ],
};

describe('load_refused', { skip: skipWithoutPostgres }, () => {
  let db: DisposableDatabase;

  before(async () => {
    db = await createDatabase();
    const feito = await runExecutor(
      { kind: 'provision', slug: 'acme' },
      { url: db.url, migrationsDir: buildMigrationsDir({ tenant: [RECUSADA.tenant[0]!] }) },
    );
    assert.equal(feito.exitCode, 0, feito.error);
  });
  after(async () => {
    await db.drop();
  });

  test('com banco de pé: saída 2, nada aplicado, e uma linha nomeando o arquivo', async () => {
    const resultado = await runExecutor(
      { kind: 'migrate' },
      { url: db.url, migrationsDir: buildMigrationsDir(RECUSADA) },
    );

    assert.equal(resultado.exitCode, 2, resultado.error);
    assert.match(resultado.error ?? '', /qualificador de schema "t_outro"/);

    await withClient(db.url, async (client) => {
      const linhas = await client.query<{ version: string; schema_name: string | null; detail: string }>(
        `select version, schema_name, detail from platform.executor_events
          where kind_code = 'load_refused'`,
      );
      assert.equal(linhas.rowCount, 1);
      assert.equal(linhas.rows[0]?.version, 'tenant/0002__invasao');
      assert.equal(linhas.rows[0]?.schema_name, null, 'nenhum schema foi tocado');
      assert.match(linhas.rows[0]?.detail ?? '', /t_outro/);

      // Nada foi aplicado: o livro-razão do cliente continua onde estava.
      const aplicadas = await client.query(
        "select 1 from platform.schema_migrations where schema_name = 't_acme'",
      );
      assert.equal(aplicadas.rowCount, 1);
    });
  });

  test('com o banco fora do ar: a mesma saída 2, e a falha de escrita é reportada', async () => {
    const semBanco = 'postgres://forja:invalido@127.0.0.1:1/forja_inexistente';
    const resultado = await runExecutor(
      { kind: 'migrate' },
      { url: semBanco, migrationsDir: buildMigrationsDir(RECUSADA) },
    );

    assert.equal(resultado.exitCode, 2, resultado.error);
    assert.match(resultado.output, /não consegui registrar o evento "load_refused"/);
    assert.match(resultado.output, /desfecho da rodada não muda/);
  });
});

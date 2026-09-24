import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { runExecutor } from './support/executor.js';
import { createDatabase, skipWithoutPostgres, withClient, type DisposableDatabase } from './support/postgres.js';
import { buildMigrationsDir, tenantMigration } from './support/tree.js';

/** Casos 18, 21, 24 e 28 de `CONTRATO.md` §14: `verify` (`PROVISION-E-VERIFY.md` §13.2 a §13.4). */

const PEDIDOS = tenantMigration(`
CREATE TABLE IF NOT EXISTS orders (
    order_id uuid NOT NULL,
    total numeric(14,2) NOT NULL,
    CONSTRAINT orders_pkey PRIMARY KEY (order_id)
);
`);

/** A view existe para o caso 28: é o objeto mais barato que existe para atravessar schema. */
const RESUMO = tenantMigration(`
CREATE OR REPLACE VIEW resumo WITH (security_invoker = true) AS
    SELECT order_id, total FROM orders;
`);

describe('verify', { skip: skipWithoutPostgres }, () => {
  let db: DisposableDatabase;
  const migrationsDir = buildMigrationsDir({
    tenant: [
      { name: '0001__orders.sql', text: PEDIDOS },
      { name: '0002__resumo.sql', text: RESUMO },
    ],
  });
  const opcoes = (): { url: string; migrationsDir: string } => ({ url: db.url, migrationsDir });

  before(async () => {
    db = await createDatabase();
    for (const slug of ['acme', 'beta']) {
      const feito = await runExecutor({ kind: 'provision', slug }, opcoes());
      assert.equal(feito.exitCode, 0, feito.error);
    }
  });
  after(async () => {
    await db.drop();
  });

  /**
   * O caso base, e é ele que prova a impressão da §13.3 contra o arquivo declarado: o `platform`
   * real, aplicado do zero por este executor, tem que bater linha a linha com
   * `db/referencia-estrutural-platform.txt`, que foi gerado fora daqui.
   */
  test('banco íntegro: nenhuma diferença, e o descartável não fica para trás', async () => {
    const resultado = await runExecutor({ kind: 'verify' }, opcoes());
    assert.equal(resultado.exitCode, 0, `${resultado.error}\n${resultado.output}`);
    assert.match(resultado.output, /nenhuma diferença/);
    assert.deepEqual(await descartaveis(db.url), []);
  });

  /** Caso 24: o `REVOKE` de `db/papeis-e-credencial.md` §5 não aplicado vira registro, não veto. */
  test('privilégio inesperado no papel do executor: linha nomeada, evento, e saída inalterada', async () => {
    const resultado = await runExecutor({ kind: 'verify' }, opcoes());
    assert.equal(resultado.exitCode, 0, resultado.error);
    assert.match(resultado.output, /privilégio inesperado/);
    assert.ok((await eventos(db.url, 'privilege_unexpected')) >= 1);
  });

  /** Caso 18: coluna acrescentada à mão no `platform`. */
  test('coluna acrescentada à mão no platform: saída 3, diferença nomeada e structure_mismatch', async () => {
    await withClient(db.url, async (client) => {
      await client.query('alter table platform.tenants add column apelido text');
    });

    const resultado = await runExecutor({ kind: 'verify' }, opcoes());
    assert.equal(resultado.exitCode, 3, resultado.error);
    assert.match(resultado.output, /platform difere da referência declarada/);
    assert.match(resultado.output, /tenants\.apelido/);
    assert.equal(await eventos(db.url, 'structure_mismatch'), 1);

    await withClient(db.url, async (client) => {
      await client.query('alter table platform.tenants drop column apelido');
    });
    assert.equal((await runExecutor({ kind: 'verify' }, opcoes())).exitCode, 0);
  });

  /**
   * Caso 21, e é o `SEC-02`: `pg_get_triggerdef` não carrega o estado de habilitação, então sem
   * `tgenabled` na impressão o primeiro dos três atos da §18.2 saía idêntico à referência.
   */
  test('gatilho desligado aparece como uma linha divergente, e religar devolve a impressão', async () => {
    await withClient(db.url, async (client) => {
      await client.query('alter table platform.tenants disable trigger tenants_reject_mutation');
    });

    const resultado = await runExecutor({ kind: 'verify' }, opcoes());
    assert.equal(resultado.exitCode, 3, resultado.error);
    assert.match(resultado.output, /habilitacao:D/);
    assert.match(resultado.output, /habilitacao:O/);

    await withClient(db.url, async (client) => {
      await client.query('alter table platform.tenants enable trigger tenants_reject_mutation');
    });
    const religado = await runExecutor({ kind: 'verify' }, opcoes());
    assert.equal(religado.exitCode, 0, religado.error);
  });

  /**
   * Caso 28, e é o `EXE-04`: a linha `visao` levava nome e `reloptions`, nunca a definição. As colunas
   * casavam porque o formato é o mesmo, e `SELECT` na view devolvia as linhas do outro cliente — o
   * único controle automatizado contra drift aprovava exatamente a diferença que mais importa.
   */
  test('view reapontada para a orders de outro cliente é uma linha visao divergente', async () => {
    const antes = await eventos(db.url, 'structure_mismatch');
    await withClient(db.url, async (client) => {
      await client.query(
        'create or replace view t_acme.resumo with (security_invoker = true) as ' +
          'select order_id, total from t_beta.orders',
      );
    });

    const resultado = await runExecutor({ kind: 'verify' }, opcoes());
    assert.equal(resultado.exitCode, 3, resultado.error);
    assert.match(resultado.output, /t_acme difere da referência/);
    assert.match(resultado.output, /visao\s+resumo/);
    assert.equal(await eventos(db.url, 'structure_mismatch'), antes + 1);

    await withClient(db.url, async (client) => {
      await client.query(
        'create or replace view t_acme.resumo with (security_invoker = true) as ' +
          'select order_id, total from t_acme.orders',
      );
    });
    const devolvido = await runExecutor({ kind: 'verify' }, opcoes());
    assert.equal(devolvido.exitCode, 0, devolvido.error);
  });

  /** §13.2: a enumeração é pelo catálogo, e o registro entra como confronto, nas duas direções. */
  test('schema t_* fora do registro é drift, e o verify o nomeia', async () => {
    await withClient(db.url, async (client) => {
      await client.query('create schema t_fantasma');
    });

    const resultado = await runExecutor({ kind: 'verify' }, opcoes());
    assert.equal(resultado.exitCode, 3, resultado.error);
    assert.match(resultado.output, /t_fantasma.*não está em platform\.tenants/);
    assert.equal(await eventos(db.url, 'schema_without_registry'), 1);

    await withClient(db.url, async (client) => {
      await client.query('drop schema t_fantasma');
    });
  });
});

async function descartaveis(url: string): Promise<readonly string[]> {
  return withClient(url, async (client) => {
    const resultado = await client.query<{ nspname: string }>(
      "select nspname from pg_namespace where nspname like 't\\_verify\\_%' order by 1",
    );
    return resultado.rows.map((linha) => linha.nspname);
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

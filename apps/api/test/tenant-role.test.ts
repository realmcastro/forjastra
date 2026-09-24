import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  Kysely,
  PostgresAdapter,
  PostgresIntrospector,
  PostgresQueryCompiler,
  type CompiledQuery,
  type DatabaseConnection,
  type Driver,
  type QueryResult,
} from 'kysely';

import { tenantRoleName, tenantTransactionRunner } from '../src/db/tenant-role.js';
import type { RootDb, TenantDatabase } from '../src/db/tenant-db.js';
import { ApiError } from '../src/errors.js';

interface Emitido {
  readonly sql: string;
  readonly parameters: readonly unknown[];
}

/**
 * Raiz que **grava** tudo o que sairia pela conexão, `begin` e `commit` inclusive. É por isso
 * que ela não é o `DummyDriver`: a ordem entre abrir a transação e assumir o papel é metade da
 * propriedade sendo testada — papel assumido fora de transação vaza no pool.
 */
function raizQueGrava(): { raiz: RootDb; emitido: Emitido[] } {
  const emitido: Emitido[] = [];

  const conexao: DatabaseConnection = {
    executeQuery<R>(consulta: CompiledQuery): Promise<QueryResult<R>> {
      emitido.push({ sql: consulta.sql, parameters: consulta.parameters });
      return Promise.resolve({ rows: [] });
    },
    async *streamQuery<R>(): AsyncIterableIterator<QueryResult<R>> {
      yield { rows: [] };
    },
  };

  const gravar = (sql: string): Promise<void> => {
    emitido.push({ sql, parameters: [] });
    return Promise.resolve();
  };

  const driver: Driver = {
    init: () => Promise.resolve(),
    acquireConnection: () => Promise.resolve(conexao),
    beginTransaction: () => gravar('begin'),
    commitTransaction: () => gravar('commit'),
    rollbackTransaction: () => gravar('rollback'),
    releaseConnection: () => Promise.resolve(),
    destroy: () => Promise.resolve(),
  };

  const raiz = new Kysely<TenantDatabase>({
    dialect: {
      createAdapter: () => new PostgresAdapter(),
      createDriver: () => driver,
      createIntrospector: (db) => new PostgresIntrospector(db),
      createQueryCompiler: () => new PostgresQueryCompiler(),
    },
  }) as RootDb;

  return { raiz, emitido };
}

/** O modelo de venda não existe, então a consulta de prova declara a tabela dela. */
interface ExemploDb {
  orders: { id: string; total_cents: number };
}

test('o papel do cliente é `app_` + o nome do schema', () => {
  assert.equal(tenantRoleName('t_acme'), 'app_t_acme');
  assert.equal(tenantRoleName('t_globex'), 'app_t_globex');
});

test('schema fora da forma não vira nome de papel, e para antes de qualquer conexão', () => {
  for (const nome of ['public', 'platform', 't_x"; drop role app_t_acme; --', '', 'acme']) {
    assert.throws(
      () => tenantRoleName(nome),
      (erro: unknown) => erro instanceof ApiError && erro.code === 'internal_error',
      nome,
    );
  }
});

test('a forma do schema é conferida ao montar o executor, não na primeira consulta', () => {
  const { raiz, emitido } = raizQueGrava();
  assert.throws(() => tenantTransactionRunner(raiz, 'public'));
  assert.deepEqual(emitido, []);
});

test('o papel é assumido dentro da transação, logo depois do begin, com o nome ligado como parâmetro', async () => {
  const { raiz, emitido } = raizQueGrava();
  const transacao = tenantTransactionRunner(raiz, 't_acme');

  await transacao(async (db) => {
    await (db as unknown as Kysely<ExemploDb>).selectFrom('orders').select('id').execute();
  });

  assert.deepEqual(
    emitido.map((e) => e.sql),
    [
      'begin',
      "select set_config('role', $1, true)",
      'select "id" from "t_acme"."orders"',
      'commit',
    ],
  );
  // O nome do papel viaja como parâmetro ligado, nunca interpolado no texto.
  assert.deepEqual(emitido[1]?.parameters, ['app_t_acme']);
});

test('dois clientes na mesma raiz assumem papéis diferentes e leem schemas diferentes', async () => {
  const { raiz, emitido } = raizQueGrava();

  for (const schema of ['t_acme', 't_globex']) {
    await tenantTransactionRunner(raiz, schema)(async (db) => {
      await (db as unknown as Kysely<ExemploDb>).selectFrom('orders').select('id').execute();
    });
  }

  assert.deepEqual(
    emitido.filter((e) => e.sql.startsWith('select set_config')).map((e) => e.parameters),
    [['app_t_acme'], ['app_t_globex']],
  );
  assert.deepEqual(
    emitido.filter((e) => e.sql.startsWith('select "id"')).map((e) => e.sql),
    ['select "id" from "t_acme"."orders"', 'select "id" from "t_globex"."orders"'],
  );
});

test('trabalho que lança desfaz a transação, e o papel é largado pelo rollback', async () => {
  const { raiz, emitido } = raizQueGrava();

  await assert.rejects(
    tenantTransactionRunner(raiz, 't_acme')(() => Promise.reject(new Error('falhou no meio'))),
    /falhou no meio/,
  );

  assert.deepEqual(
    emitido.map((e) => e.sql),
    ['begin', "select set_config('role', $1, true)", 'rollback'],
  );
});

/**
 * `SEC-12` como teste de compilação: se a marca sumir de `RootDb`/`TenantDb`, o erro esperado
 * deixa de acontecer e **o build quebra**. É a única forma de uma trava de tipo ter regressão.
 */
test('a raiz não passa por handle de cliente, e o compilador é quem recusa', () => {
  const { raiz } = raizQueGrava();
  function consulta(_db: import('../src/db/tenant-db.js').TenantDb): void {}

  // @ts-expect-error a raiz é a credencial nua: sem transação e sem papel assumido.
  consulta(raiz);

  assert.ok(true);
});

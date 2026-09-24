import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  DummyDriver,
  Kysely,
  PostgresAdapter,
  PostgresIntrospector,
  PostgresQueryCompiler,
  sql,
} from 'kysely';
import { tenantDb } from '../src/db/tenant-db.js';
import { ApiError } from '../src/errors.js';

/** Só para compilar SQL: o modelo de venda não existe e `TenantDatabase` está vazia. */
interface ExemploDb {
  orders: { id: string; total_cents: number };
}

function compilador(): Kysely<ExemploDb> {
  return new Kysely<ExemploDb>({
    dialect: {
      createAdapter: () => new PostgresAdapter(),
      createDriver: () => new DummyDriver(),
      createIntrospector: (db) => new PostgresIntrospector(db),
      createQueryCompiler: () => new PostgresQueryCompiler(),
    },
  });
}

test('a consulta sai qualificada pelo schema do cliente, sem search_path', () => {
  const { sql: texto } = tenantDb(compilador(), 't_acme')
    .selectFrom('orders')
    .select('id')
    .compile();
  assert.equal(texto, 'select "id" from "t_acme"."orders"');
});

test('dois clientes na mesma raiz produzem consultas em schemas diferentes', () => {
  const raiz = compilador();
  const a = tenantDb(raiz, 't_acme').selectFrom('orders').select('id').compile().sql;
  const b = tenantDb(raiz, 't_beta').selectFrom('orders').select('id').compile().sql;
  assert.equal(a, 'select "id" from "t_acme"."orders"');
  assert.equal(b, 'select "id" from "t_beta"."orders"');
});

test('nome de schema malformado nunca chega a virar consulta', () => {
  for (const nome of ['public', 'platform', 't_x"; drop table orders; --', '']) {
    assert.throws(
      () => tenantDb(compilador(), nome),
      (error: unknown) => error instanceof ApiError && error.code === 'internal_error',
      nome,
    );
  }
});

/**
 * Prova do buraco declarado em `tenant-db.ts`: `withSchema` alcança o que o construtor monta,
 * e **não** alcança fragmento cru. O teste existe para que a proibição de SQL cru no caminho
 * de requisição tenha evidência, e para falhar no dia em que alguém achar que dá.
 */
test('fragmento sql cru NÃO é qualificado pelo escopo do cliente', () => {
  const { sql: texto } = tenantDb(compilador(), 't_acme')
    .selectFrom('orders')
    .select(sql<number>`(select count(*) from orders)`.as('n'))
    .compile();
  assert.ok(texto.includes('from "t_acme"."orders"'));
  assert.ok(texto.includes('(select count(*) from orders)'));
  assert.equal(texto.includes('from "t_acme"."orders")'), false);
});

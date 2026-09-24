import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import pg from 'pg';
import { sql } from 'kysely';

import { createPool, createRootDb } from '../src/db/pool.js';
import { tenantRoleName, tenantTransactionRunner } from '../src/db/tenant-role.js';
import type { RootDb } from '../src/db/tenant-db.js';

/**
 * A prova da camada de papel contra um Postgres de verdade.
 *
 * **Pulado quando `FORJA_TEST_DATABASE_URL` não existe**, e isso é deliberado: o resto da suíte
 * não precisa de banco. A variável aponta para um banco **descartável** com poder de criar
 * papel (o executor do teste cria a credencial e os papéis que mede). Nada aqui toca schema que
 * não tenha criado: os nomes levam sufixo sorteado e a limpeza derruba só esses.
 *
 * O que se mede é o **artefato que vai para produção** — `createPool`, `createRootDb` e
 * `tenantTransactionRunner` —, nunca uma réplica do que eles fazem. Réplica prova a réplica.
 */

const ADMIN_URL = process.env['FORJA_TEST_DATABASE_URL'];
const PULAR = ADMIN_URL === undefined || ADMIN_URL.trim() === '';

const SUFIXO = randomBytes(4).toString('hex');
const SCHEMA_A = `t_probe_${SUFIXO}_a`;
const SCHEMA_B = `t_probe_${SUFIXO}_b`;
const GRUPO = `forja_app_probe_${SUFIXO}`;
const CREDENCIAL = `forja_cred_probe_${SUFIXO}`;
const SENHA = randomBytes(18).toString('hex');

let admin: pg.Client;
let pool: pg.Pool;
let raiz: RootDb;

function urlDaCredencial(base: string): string {
  const url = new URL(base);
  url.username = CREDENCIAL;
  url.password = SENHA;
  return url.toString();
}

async function provisionar(): Promise<void> {
  const id = (nome: string): string => pg.escapeIdentifier(nome);
  const lit = (valor: string): string => pg.escapeLiteral(valor);

  await admin.query(`CREATE ROLE ${id(GRUPO)} NOLOGIN`);
  await admin.query(`CREATE ROLE ${id(CREDENCIAL)} LOGIN NOINHERIT PASSWORD ${lit(SENHA)}`);
  await admin.query(`GRANT ${id(GRUPO)} TO ${id(CREDENCIAL)}`);

  for (const schema of [SCHEMA_A, SCHEMA_B]) {
    const papel = tenantRoleName(schema);
    await admin.query(`CREATE SCHEMA ${id(schema)}`);
    await admin.query(`CREATE TABLE ${id(schema)}.orders (id int primary key, total_cents int)`);
    await admin.query(
      `INSERT INTO ${id(schema)}.orders (id, total_cents) VALUES (1, ${schema === SCHEMA_A ? 111 : 999})`,
    );
    await admin.query(`CREATE ROLE ${id(papel)} NOLOGIN NOINHERIT`);
    await admin.query(`GRANT ${id(GRUPO)} TO ${id(papel)}`);
    await admin.query(`GRANT ${id(papel)} TO ${id(CREDENCIAL)}`);
    await admin.query(`GRANT USAGE ON SCHEMA ${id(schema)} TO ${id(papel)}`);
    await admin.query(`GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA ${id(schema)} TO ${id(papel)}`);
  }
}

async function limpar(): Promise<void> {
  const id = (nome: string): string => pg.escapeIdentifier(nome);
  for (const schema of [SCHEMA_A, SCHEMA_B]) {
    await admin.query(`DROP SCHEMA IF EXISTS ${id(schema)} CASCADE`);
    await admin.query(`DROP ROLE IF EXISTS ${id(tenantRoleName(schema))}`);
  }
  await admin.query(`DROP ROLE IF EXISTS ${id(CREDENCIAL)}`);
  await admin.query(`DROP ROLE IF EXISTS ${id(GRUPO)}`);
}

before(async () => {
  if (PULAR || ADMIN_URL === undefined) return;
  admin = new pg.Client({ connectionString: ADMIN_URL });
  await admin.connect();
  await provisionar();

  // `max: 1` é o ponto do teste: as duas requisições caem na **mesma conexão física**, que é
  // onde estado de sessão vaza de um cliente para o outro.
  pool = createPool({
    connectionString: urlDaCredencial(ADMIN_URL),
    poolMax: 1,
    statementTimeoutMs: 5_000,
    idleInTransactionTimeoutMs: 10_000,
    connectionTimeoutMs: 5_000,
  });
  raiz = createRootDb(pool);
});

after(async () => {
  if (PULAR) return;
  await raiz.destroy();
  await limpar();
  await admin.end();
});

interface LinhaDeSessao {
  readonly usuario: string;
  readonly pid: number;
}

const sessao = sql<LinhaDeSessao>`select current_user as usuario, pg_backend_pid() as pid`;
const total = (schema: string): ReturnType<typeof sql<{ total_cents: number }>> =>
  sql<{ total_cents: number }>`select total_cents from ${sql.id(schema)}.orders where id = 1`;

test('a credencial nua não alcança schema de cliente nenhum', { skip: PULAR }, async () => {
  await assert.rejects(
    () => total(SCHEMA_A).execute(raiz),
    (erro: unknown) => (erro as { code?: string }).code === '42501',
    'a credencial fora de transação deveria levar permission denied',
  );
});

test(
  'dois clientes na mesma conexão física: cada um lê o seu, e o papel não atravessa',
  { skip: PULAR },
  async () => {
    const requisicao = async (schema: string): Promise<{ pid: number; usuario: string; lido: number }> =>
      tenantTransactionRunner(raiz, schema)(async (db) => {
        const { rows } = await sessao.execute(db);
        const lido = await total(schema).execute(db);
        return {
          pid: Number(rows[0]?.pid),
          usuario: String(rows[0]?.usuario),
          lido: Number(lido.rows[0]?.total_cents),
        };
      });

    const a = await requisicao(SCHEMA_A);
    const depoisDeA = await sessao.execute(raiz);
    const b = await requisicao(SCHEMA_B);
    const depoisDeB = await sessao.execute(raiz);

    // Mesma conexão física nas quatro idas ao banco. Sem isto, o teste não prova nada.
    assert.equal(a.pid, b.pid);
    assert.equal(Number(depoisDeA.rows[0]?.pid), a.pid);
    assert.equal(Number(depoisDeB.rows[0]?.pid), a.pid);

    assert.equal(a.usuario, tenantRoleName(SCHEMA_A));
    assert.equal(b.usuario, tenantRoleName(SCHEMA_B));
    assert.equal(a.lido, 111);
    assert.equal(b.lido, 999);

    // O papel é largado no `COMMIT`, sem `RESET`: a conexão volta ao pool como a credencial.
    assert.equal(depoisDeA.rows[0]?.usuario, CREDENCIAL);
    assert.equal(depoisDeB.rows[0]?.usuario, CREDENCIAL);
  },
);

test('com o papel assumido, o schema do outro cliente é inalcançável', { skip: PULAR }, async () => {
  await assert.rejects(
    () => tenantTransactionRunner(raiz, SCHEMA_A)(async (db) => total(SCHEMA_B).execute(db)),
    (erro: unknown) => (erro as { code?: string }).code === '42501',
    'ler o schema do outro cliente deveria levar permission denied',
  );
});

/**
 * `PAP-04` pelas **duas formas**, e a comparação é o conteúdo do teste: o mesmo texto hostil, a
 * mesma credencial, o mesmo banco. Pelo pool que a aplicação usa, o servidor recusa; por um pool
 * de `pg` sem o modo estendido, ele executa e a sessão troca de papel.
 */
test('texto com mais de um comando é recusado pelo pool da aplicação', { skip: PULAR }, async () => {
  const hostil = `select 1; set role ${tenantRoleName(SCHEMA_B)}; select 1`;

  await assert.rejects(
    () => tenantTransactionRunner(raiz, SCHEMA_A)(async (db) => sql.raw(hostil).execute(db)),
    (erro: unknown) => (erro as { code?: string }).code === '42601',
    'multi-statement deveria ser recusado pelo servidor',
  );

  assert.equal((await sessao.execute(raiz)).rows[0]?.usuario, CREDENCIAL);
});

test('sem o modo estendido, o mesmo texto passa — é este o canal que o pool fecha', { skip: PULAR }, async () => {
  if (ADMIN_URL === undefined) return;
  const nu = new pg.Pool({ connectionString: urlDaCredencial(ADMIN_URL), max: 1 });
  try {
    const cliente = await nu.connect();
    try {
      await cliente.query('begin');
      await cliente.query({ text: "select set_config('role', $1, true)", values: [tenantRoleName(SCHEMA_A)] });
      // Zero parâmetro: o `pg` escolhe protocolo simples e o servidor aceita a lista de comandos.
      const resultado = await cliente.query(`select 1; set role ${tenantRoleName(SCHEMA_B)}; select 1`, []);
      assert.ok(Array.isArray(resultado), 'o texto hostil produziu mais de um resultado');
      const { rows } = await cliente.query('select current_user as usuario');
      assert.equal(rows[0]?.usuario, tenantRoleName(SCHEMA_B), 'a sessão trocou de papel no meio da transação');
      await cliente.query('rollback');
    } finally {
      cliente.release();
    }
  } finally {
    await nu.end();
  }
});

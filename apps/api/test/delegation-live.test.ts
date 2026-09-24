import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import pg from 'pg';

import { createPool, createRootDb } from '../src/db/pool.js';
import { tenantRoleName } from '../src/db/tenant-role.js';
import { AppCredentialError, assertAppCredential } from '../src/db/app-credential.js';
import { CONTROL_SCHEMA, credentialQuery } from '../src/db/credential-query.js';
import type { RootDb } from '../src/db/tenant-db.js';
import type { StartupFact, StartupFactSink } from '../src/observability/startup-facts.js';

/**
 * O `SUB-09` contra um Postgres de verdade: objeto que roda com o privilégio do **dono** e põe um
 * cliente dentro do outro enquanto todas as perguntas de alcance respondem `ok`.
 *
 * **Banco próprio, criado e derrubado aqui.** A pergunta de delegação olha o banco inteiro, não a
 * credencial: um estado hostil montado por este arquivo derrubaria a subida de qualquer outro
 * arquivo que rodasse ao mesmo tempo no mesmo banco, e o `node --test` roda arquivos em paralelo. O
 * banco novo também deixa o schema de controle (`platform`) ser criado sem disputar o nome com o
 * caso 13 de `app-credential-live.test.ts`.
 *
 * **O dono é o executor, como em produção.** Ele cria os schemas de cliente, então todo objeto dele
 * ali dentro roda com um privilégio que alcança os dois clientes — é o excluído legítimo fazendo o
 * pior que o próprio privilégio permite. O caso 9 faz o mesmo com o outro excluído, o papel do
 * cliente dono do próprio schema.
 *
 * Todo caso hostil prova as duas metades, nesta ordem: o estado **vaza de verdade** pela transação
 * do cliente, e só então a subida o recusa. Depois desfaz e confere que a subida volta a passar.
 *
 * A variável aponta para o operador do cluster, superusuário, pela mesma razão dos outros arquivos
 * vivos: ele cria banco, papel e desfaz o que o executor não consegue desfazer.
 *
 * **Dez casos sobre um arranjo, e é por isso que o arquivo passa de 400 linhas.** Dividir custaria
 * um segundo banco montado por inteiro, e cada caso já desfaz o que monta.
 */

const ADMIN_URL = process.env['FORJA_TEST_DATABASE_URL'];
const PULAR = ADMIN_URL === undefined || ADMIN_URL.trim() === '';

const SUFIXO = randomBytes(4).toString('hex');
const BANCO = `forja_dlg_${SUFIXO}`;
const GRUPO = `forja_app_dlg_${SUFIXO}`;
const CREDENCIAL = `forja_cred_dlg_${SUFIXO}`;
const EXECUTOR = `forja_exec_dlg_${SUFIXO}`;
const SCHEMA_A = `t_dlga_${SUFIXO}`;
const SCHEMA_B = `t_dlgb_${SUFIXO}`;
const PAPEL_A = tenantRoleName(SCHEMA_A);
const PAPEL_B = tenantRoleName(SCHEMA_B);
/** Schema fora dos dois conjuntos protegidos: o salto do caso 7. */
const FORA = `ext_dlg_${SUFIXO}`;
const SENHA = randomBytes(18).toString('hex');

const id = (nome: string): string => pg.escapeIdentifier(nome);
const lit = (valor: string): string => pg.escapeLiteral(valor);

let servidor: pg.Client;
let operador: pg.Client;
let executor: pg.Client;
const aFechar: RootDb[] = [];

function urlDe(base: string, papel: string | undefined, banco: string): string {
  const url = new URL(base);
  if (papel !== undefined) {
    url.username = papel;
    url.password = SENHA;
  }
  url.pathname = `/${banco}`;
  return url.toString();
}

function raizDaCredencial(): RootDb {
  const raiz = createRootDb(
    createPool({
      connectionString: urlDe(ADMIN_URL ?? '', CREDENCIAL, BANCO),
      poolMax: 1,
      statementTimeoutMs: 5_000,
      idleInTransactionTimeoutMs: 10_000,
      connectionTimeoutMs: 5_000,
    }),
  );
  aFechar.push(raiz);
  return raiz;
}

function coletor(): { sink: StartupFactSink; fatos: StartupFact[] } {
  const fatos: StartupFact[] = [];
  return { fatos, sink: { name: 'teste', record: (fato) => void fatos.push(fato) } };
}

/**
 * A transação do cliente pelo caminho que a borda usa: a credencial conecta e assume o papel do
 * cliente com `SET LOCAL ROLE`. Desfaz sempre, a menos que o caso peça o contrário, para que o
 * efeito medido seja o do estado hostil e não resíduo de um caso anterior.
 */
async function comoCliente<T>(
  papel: string,
  corpo: (cliente: pg.Client) => Promise<T>,
  { confirmar = false }: { confirmar?: boolean } = {},
): Promise<T> {
  const cliente = new pg.Client({ connectionString: urlDe(ADMIN_URL ?? '', CREDENCIAL, BANCO) });
  await cliente.connect();
  try {
    await cliente.query('BEGIN');
    await cliente.query(`SET LOCAL ROLE ${id(papel)}`);
    const resultado = await corpo(cliente);
    await cliente.query(confirmar ? 'COMMIT' : 'ROLLBACK');
    return resultado;
  } catch (erro) {
    await cliente.query('ROLLBACK').catch(() => undefined);
    throw erro;
  } finally {
    await cliente.end();
  }
}

async function subidaRecusa(padroes: readonly RegExp[]): Promise<void> {
  const { sink, fatos } = coletor();
  await assert.rejects(
    () => assertAppCredential(raizDaCredencial(), { groupRole: GRUPO, factSink: sink }),
    (erro: unknown) => {
      assert.equal(erro instanceof AppCredentialError, true);
      const recusas = (erro as AppCredentialError).refusals;
      assert.deepEqual(
        [...new Set(recusas.map((r) => r.question))],
        ['delegation'],
        'as outras sete respondem ok: é por isso que o estado passava',
      );
      for (const padrao of padroes) assert.match((erro as AppCredentialError).message, padrao);
      return true;
    },
  );
  assert.equal(fatos[0]?.kind, 'startup_credential_refused');
  assert.equal(fatos[0]?.verdict.delegation, 'refused');
  assert.equal(fatos[0]?.verdict.assumedReach, 'ok');
}

async function subidaPassa(): Promise<void> {
  const respostas = await assertAppCredential(raizDaCredencial(), {
    groupRole: GRUPO,
    factSink: coletor().sink,
  });
  assert.deepEqual(respostas.delegatedDependencies, []);
  assert.deepEqual(respostas.definerRoutines, []);
}

function escapar(texto: string): string {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function provisionar(): Promise<void> {
  await servidor.query(`CREATE DATABASE ${id(BANCO)}`);
  operador = new pg.Client({ connectionString: urlDe(ADMIN_URL ?? '', undefined, BANCO) });
  await operador.connect();

  // §7.2, o ato do operador, mais o CREATE no banco que o executor usa para criar os schemas.
  await operador.query(`CREATE ROLE ${id(GRUPO)} NOLOGIN`);
  await operador.query(`CREATE ROLE ${id(CREDENCIAL)} LOGIN NOINHERIT PASSWORD ${lit(SENHA)}`);
  await operador.query(`GRANT ${id(GRUPO)} TO ${id(CREDENCIAL)}`);
  await operador.query(`CREATE ROLE ${id(EXECUTOR)} LOGIN NOINHERIT CREATEROLE PASSWORD ${lit(SENHA)}`);
  await operador.query(`GRANT ${id(GRUPO)} TO ${id(EXECUTOR)} WITH ADMIN OPTION`);
  await operador.query('REVOKE USAGE, CREATE ON SCHEMA public FROM PUBLIC');
  await operador.query(`REVOKE TEMPORARY ON DATABASE ${id(BANCO)} FROM PUBLIC`);
  await operador.query(`GRANT CREATE ON DATABASE ${id(BANCO)} TO ${id(EXECUTOR)}`);

  executor = new pg.Client({ connectionString: urlDe(ADMIN_URL ?? '', EXECUTOR, BANCO) });
  await executor.connect();

  /**
   * Estrutura de cliente com dependência **dentro** do próprio schema: chave primária, chave
   * estrangeira, view `security_invoker`, gatilho com rotina `SECURITY INVOKER`. É o que o caso 1
   * exige que a subida deixe passar, e é o que a mutação "acusar também o mesmo schema" derruba.
   */
  for (const [schema, total] of [
    [SCHEMA_A, 111],
    [SCHEMA_B, 222],
  ] as const) {
    await executor.query(`CREATE SCHEMA ${id(schema)}`);
    await executor.query(`CREATE TABLE ${id(schema)}.orders (id int PRIMARY KEY, total_cents int NOT NULL)`);
    await executor.query(
      `CREATE TABLE ${id(schema)}.order_items (order_id int NOT NULL REFERENCES ${id(schema)}.orders (id), ` +
        'quantity int NOT NULL)',
    );
    await executor.query(
      `CREATE VIEW ${id(schema)}.order_totals WITH (security_invoker = true) AS ` +
        `SELECT o.id, o.total_cents FROM ${id(schema)}.orders o`,
    );
    await executor.query(
      `CREATE FUNCTION ${id(schema)}.refuse_update() RETURNS trigger LANGUAGE plpgsql ` +
        "AS $corpo$ BEGIN RAISE EXCEPTION 'fato não se atualiza'; END $corpo$",
    );
    await executor.query(
      `CREATE TRIGGER order_items_immutable BEFORE UPDATE ON ${id(schema)}.order_items ` +
        `FOR EACH ROW EXECUTE FUNCTION ${id(schema)}.refuse_update()`,
    );
    await executor.query(`INSERT INTO ${id(schema)}.orders VALUES (1, ${total})`);
  }

  // §7.3, o passo do executor.
  for (const [papel, schema] of [
    [PAPEL_A, SCHEMA_A],
    [PAPEL_B, SCHEMA_B],
  ] as const) {
    await executor.query(`CREATE ROLE ${id(papel)} NOLOGIN NOINHERIT`);
    await executor.query(`GRANT ${id(GRUPO)} TO ${id(papel)}`);
    await executor.query(`GRANT ${id(papel)} TO ${id(CREDENCIAL)} WITH INHERIT FALSE, SET TRUE`);
    await executor.query(`GRANT USAGE ON SCHEMA ${id(schema)} TO ${id(papel)}`);
    await executor.query(`GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA ${id(schema)} TO ${id(papel)}`);
    await executor.query(
      `ALTER DEFAULT PRIVILEGES FOR ROLE CURRENT_USER IN SCHEMA ${id(schema)} ` +
        `GRANT SELECT, INSERT, UPDATE ON TABLES TO ${id(papel)}`,
    );
  }
}

async function limpar(): Promise<void> {
  if (executor !== undefined) await executor.end().catch(() => undefined);
  if (operador !== undefined) await operador.end().catch(() => undefined);
  await servidor.query(`DROP DATABASE IF EXISTS ${id(BANCO)} WITH (FORCE)`);
  for (const papel of [PAPEL_A, PAPEL_B, CREDENCIAL, EXECUTOR, GRUPO]) {
    await servidor.query(`DROP ROLE IF EXISTS ${id(papel)}`);
  }
}

before(async () => {
  if (PULAR || ADMIN_URL === undefined) return;
  servidor = new pg.Client({ connectionString: ADMIN_URL });
  await servidor.connect();
  const { rows } = await servidor.query<{ papel: string; super: boolean }>(
    'select current_user::text as papel, rolsuper as "super" from pg_catalog.pg_roles where rolname = current_user',
  );
  assert.equal(
    rows[0]?.super,
    true,
    `FORJA_TEST_DATABASE_URL é servida por "${rows[0]?.papel ?? '?'}", que não é superusuário. Este ` +
      'arquivo cria um banco próprio e desfaz como operador o que o executor não consegue desfazer',
  );
  await provisionar();
});

after(async () => {
  if (PULAR) return;
  for (const raiz of aFechar) await raiz.destroy();
  await limpar();
  await servidor.end();
});

test('delegação, caso 1: estrutura dentro do próprio schema não é acusada', { skip: PULAR }, async () => {
  const { sink, fatos } = coletor();
  const respostas = await assertAppCredential(raizDaCredencial(), { groupRole: GRUPO, factSink: sink });
  assert.deepEqual(
    respostas.delegatedDependencies,
    [],
    'chave, chave estrangeira, view e gatilho no mesmo schema são a estrutura do cliente',
  );
  assert.deepEqual(respostas.definerRoutines, [], 'rotina SECURITY INVOKER não é delegação');
  assert.equal(fatos[0]?.kind, 'startup_credential_verified');
  assert.equal(fatos[0]?.verdict.delegation, 'ok');

  const lido = await comoCliente(PAPEL_A, async (c) => {
    const r = await c.query<{ n: number }>(`SELECT count(*)::int AS n FROM ${id(SCHEMA_A)}.order_totals`);
    return r.rows[0]?.n;
  });
  assert.equal(lido, 1, 'a view security_invoker do próprio schema serve o cliente');
});

/**
 * A forma do `SUB-09` em que o `verify` também não mudava uma linha: a venda de A conclui **e**
 * grava no schema de B, pela transação de A, sem privilégio nenhum de A sobre B.
 */
test('delegação, caso 2: regra de reescrita que escreve no outro cliente derruba a subida', { skip: PULAR }, async () => {
  await executor.query(
    `CREATE RULE espelho AS ON INSERT TO ${id(SCHEMA_A)}.orders DO ALSO ` +
      `INSERT INTO ${id(SCHEMA_B)}.orders VALUES (NEW.id + 1000, NEW.total_cents)`,
  );
  try {
    await comoCliente(PAPEL_A, (c) => c.query(`INSERT INTO ${id(SCHEMA_A)}.orders VALUES (7, 777)`), {
      confirmar: true,
    });
    const gravado = await operador.query<{ total: number }>(
      `SELECT total_cents AS total FROM ${id(SCHEMA_B)}.orders WHERE id = 1007`,
    );
    assert.equal(gravado.rows[0]?.total, 777, 'o estado vaza: a venda de A gravou no schema de B');

    await subidaRecusa([
      new RegExp(`rule espelho on table ${escapar(SCHEMA_A)}\\.orders \\(${escapar(SCHEMA_A)} -> ${escapar(SCHEMA_B)}\\)`),
    ]);
  } finally {
    await executor.query(`DROP RULE IF EXISTS espelho ON ${id(SCHEMA_A)}.orders`);
    await operador.query(`DELETE FROM ${id(SCHEMA_A)}.orders WHERE id = 7`);
    await operador.query(`DELETE FROM ${id(SCHEMA_B)}.orders WHERE id = 1007`);
  }
  await subidaPassa();
});

test('delegação, caso 3: view materializada sobre o outro cliente derruba a subida', { skip: PULAR }, async () => {
  await executor.query(
    `CREATE MATERIALIZED VIEW ${id(SCHEMA_A)}.apoio AS SELECT id, total_cents FROM ${id(SCHEMA_B)}.orders`,
  );
  try {
    const lido = await comoCliente(PAPEL_A, async (c) => {
      const r = await c.query<{ total: number }>(`SELECT total_cents AS total FROM ${id(SCHEMA_A)}.apoio`);
      return r.rows[0]?.total;
    });
    assert.equal(lido, 222, 'o estado vaza: A lê a venda de B pela view materializada');

    await subidaRecusa([
      new RegExp(`materialized view ${escapar(SCHEMA_A)}\\.apoio \\(${escapar(SCHEMA_A)} -> ${escapar(SCHEMA_B)}\\)`),
    ]);
  } finally {
    await executor.query(`DROP MATERIALIZED VIEW IF EXISTS ${id(SCHEMA_A)}.apoio`);
  }
  await subidaPassa();
});

test('delegação, caso 4: view sem security_invoker sobre o outro cliente derruba a subida', { skip: PULAR }, async () => {
  await executor.query(`CREATE VIEW ${id(SCHEMA_A)}.v_apoio AS SELECT id, total_cents FROM ${id(SCHEMA_B)}.orders`);
  try {
    const lido = await comoCliente(PAPEL_A, async (c) => {
      const r = await c.query<{ total: number }>(`SELECT total_cents AS total FROM ${id(SCHEMA_A)}.v_apoio`);
      return r.rows[0]?.total;
    });
    assert.equal(lido, 222, 'o estado vaza: a view roda como o dono');

    await subidaRecusa([
      new RegExp(`view ${escapar(SCHEMA_A)}\\.v_apoio \\(${escapar(SCHEMA_A)} -> ${escapar(SCHEMA_B)}\\)`),
    ]);
  } finally {
    await executor.query(`DROP VIEW IF EXISTS ${id(SCHEMA_A)}.v_apoio`);
  }
  await subidaPassa();
});

/**
 * Corpo `plpgsql` não deixa dependência em `pg_depend` sobre o que lê, e o caso prova isso junto:
 * a lista de dependências sai vazia e a recusa vem só pela rotina.
 */
test('delegação, caso 5: rotina SECURITY DEFINER no schema do cliente derruba a subida', { skip: PULAR }, async () => {
  await executor.query(
    `CREATE FUNCTION ${id(SCHEMA_A)}.relatorio() RETURNS int LANGUAGE plpgsql SECURITY DEFINER ` +
      `AS $corpo$ BEGIN RETURN (SELECT total_cents FROM ${id(SCHEMA_B)}.orders WHERE id = 1); END $corpo$`,
  );
  try {
    const lido = await comoCliente(PAPEL_A, async (c) => {
      const r = await c.query<{ total: number }>(`SELECT ${id(SCHEMA_A)}.relatorio() AS total`);
      return r.rows[0]?.total;
    });
    assert.equal(lido, 222, 'o estado vaza: a rotina roda como o dono');

    await assert.rejects(
      () => assertAppCredential(raizDaCredencial(), { groupRole: GRUPO, factSink: coletor().sink }),
      (erro: unknown) => {
        const recusas = (erro as AppCredentialError).refusals;
        assert.equal(recusas.length, 1, 'plpgsql não deixa dependência: só a pergunta da rotina acusa');
        assert.equal(recusas[0]?.question, 'delegation');
        assert.match(
          recusas[0]?.reason ?? '',
          new RegExp(`function ${escapar(SCHEMA_A)}\\.relatorio\\(\\) \\(${escapar(SCHEMA_A)}, dono ${escapar(EXECUTOR)}\\)`),
        );
        return true;
      },
    );
  } finally {
    await executor.query(`DROP FUNCTION IF EXISTS ${id(SCHEMA_A)}.relatorio()`);
  }
  await subidaPassa();
});

/**
 * Forma que o auditor não listou e o critério pega: a ação da chave estrangeira roda como o dono da
 * tabela que referencia. O `UPDATE` de A na própria venda reescreve a linha de B.
 */
test('delegação, caso 6: chave estrangeira entre clientes derruba a subida', { skip: PULAR }, async () => {
  await executor.query(
    `CREATE TABLE ${id(SCHEMA_B)}.espelho (order_id int REFERENCES ${id(SCHEMA_A)}.orders (id) ON UPDATE CASCADE)`,
  );
  await executor.query(`INSERT INTO ${id(SCHEMA_B)}.espelho VALUES (1)`);
  try {
    await comoCliente(PAPEL_A, (c) => c.query(`UPDATE ${id(SCHEMA_A)}.orders SET id = 2 WHERE id = 1`), {
      confirmar: true,
    });
    const reescrito = await operador.query<{ order_id: number }>(`SELECT order_id FROM ${id(SCHEMA_B)}.espelho`);
    assert.equal(reescrito.rows[0]?.order_id, 2, 'o estado vaza: o UPDATE de A reescreveu a linha de B');

    await subidaRecusa([
      new RegExp(`constraint espelho_order_id_fkey on table ${escapar(SCHEMA_B)}\\.espelho \\(${escapar(SCHEMA_B)} -> ${escapar(SCHEMA_A)}\\)`),
    ]);
  } finally {
    await executor.query(`DROP TABLE IF EXISTS ${id(SCHEMA_B)}.espelho`);
    await operador.query(`UPDATE ${id(SCHEMA_A)}.orders SET id = 1 WHERE id = 2`);
  }
  await subidaPassa();
});

/**
 * O salto por schema de fora: nenhuma das duas pontas atravessa entre schemas protegidos, e o
 * papel de A não tem `USAGE` no schema do meio. Com o destino da pergunta restrito a `t_*` e
 * `platform`, este caso passava.
 */
test('delegação, caso 7: salto por schema fora do universo derruba a subida', { skip: PULAR }, async () => {
  await executor.query(`CREATE SCHEMA ${id(FORA)}`);
  await executor.query(`CREATE VIEW ${id(FORA)}.ponte AS SELECT id, total_cents FROM ${id(SCHEMA_B)}.orders`);
  await executor.query(`CREATE VIEW ${id(SCHEMA_A)}.v_salto AS SELECT id, total_cents FROM ${id(FORA)}.ponte`);
  try {
    const lido = await comoCliente(PAPEL_A, async (c) => {
      const r = await c.query<{ total: number }>(`SELECT total_cents AS total FROM ${id(SCHEMA_A)}.v_salto`);
      return r.rows[0]?.total;
    });
    assert.equal(lido, 222, 'o estado vaza pelo salto');
    const alcance = await operador.query<{ tem: boolean }>(
      'SELECT pg_catalog.has_schema_privilege($1::regrole, $2::regnamespace, $3) AS tem',
      [PAPEL_A, FORA, 'USAGE'],
    );
    assert.equal(alcance.rows[0]?.tem, false, 'o papel de A não alcança o schema do meio');

    await subidaRecusa([
      new RegExp(`view ${escapar(SCHEMA_A)}\\.v_salto \\(${escapar(SCHEMA_A)} -> ${escapar(FORA)}\\)`),
    ]);
  } finally {
    await executor.query(`DROP VIEW IF EXISTS ${id(SCHEMA_A)}.v_salto`);
    await executor.query(`DROP SCHEMA IF EXISTS ${id(FORA)} CASCADE`);
  }
  await subidaPassa();
});

test('delegação, caso 8: objeto no schema do cliente sobre o schema de controle derruba a subida', { skip: PULAR }, async () => {
  await executor.query(`CREATE SCHEMA ${id(CONTROL_SCHEMA)}`);
  await executor.query(`CREATE TABLE ${id(CONTROL_SCHEMA)}.tenants (slug text PRIMARY KEY)`);
  await executor.query(`INSERT INTO ${id(CONTROL_SCHEMA)}.tenants VALUES ('dlga'), ('dlgb')`);
  await executor.query(`CREATE VIEW ${id(SCHEMA_A)}.carteira AS SELECT slug FROM ${id(CONTROL_SCHEMA)}.tenants`);
  try {
    const lido = await comoCliente(PAPEL_A, async (c) => {
      const r = await c.query<{ n: number }>(`SELECT count(*)::int AS n FROM ${id(SCHEMA_A)}.carteira`);
      return r.rows[0]?.n;
    });
    assert.equal(lido, 2, 'o estado vaza: A lê a carteira de clientes');

    await subidaRecusa([
      new RegExp(`view ${escapar(SCHEMA_A)}\\.carteira \\(${escapar(SCHEMA_A)} -> ${CONTROL_SCHEMA}\\)`),
    ]);
  } finally {
    await executor.query(`DROP VIEW IF EXISTS ${id(SCHEMA_A)}.carteira`);
    await executor.query(`DROP SCHEMA IF EXISTS ${id(CONTROL_SCHEMA)} CASCADE`);
  }
  await subidaPassa();
});

/**
 * O outro excluído legítimo em estado hostil: o papel do cliente **dono do próprio schema**. A
 * exclusão do mesmo schema não lhe dá nada sobre o outro cliente (ele não consegue nem criar o
 * objeto que atravessa), e a rotina `SECURITY DEFINER` dele não é desculpada por ser dele. Que o
 * papel seja dono do próprio schema é acusado pelo `verify` (`db/verificacao-do-papel.md`), não por
 * esta pergunta.
 */
test('delegação, caso 9: papel do cliente dono do próprio schema, no pior que o privilégio permite', { skip: PULAR }, async () => {
  await operador.query(`ALTER SCHEMA ${id(SCHEMA_A)} OWNER TO ${id(PAPEL_A)}`);
  try {
    await assert.rejects(
      () =>
        comoCliente(PAPEL_A, (c) =>
          c.query(`CREATE VIEW ${id(SCHEMA_A)}.v_tentativa AS SELECT id FROM ${id(SCHEMA_B)}.orders`),
        ),
      (erro: unknown) => {
        assert.equal((erro as { code?: string }).code, '42501', 'o dono do próprio schema não alcança o outro');
        return true;
      },
    );

    await comoCliente(
      PAPEL_A,
      (c) =>
        c.query(
          `CREATE VIEW ${id(SCHEMA_A)}.v_propria AS SELECT id, total_cents FROM ${id(SCHEMA_A)}.orders`,
        ),
      { confirmar: true },
    );
    const respostas = await assertAppCredential(raizDaCredencial(), { groupRole: GRUPO, factSink: coletor().sink });
    assert.deepEqual(respostas.delegatedDependencies, [], 'view no próprio schema, sobre o próprio schema');

    await comoCliente(
      PAPEL_A,
      (c) =>
        c.query(
          `CREATE FUNCTION ${id(SCHEMA_A)}.minha() RETURNS int LANGUAGE sql SECURITY DEFINER ` +
            `AS $corpo$ SELECT 1 $corpo$`,
        ),
      { confirmar: true },
    );
    await assert.rejects(
      () => assertAppCredential(raizDaCredencial(), { groupRole: GRUPO, factSink: coletor().sink }),
      (erro: unknown) => {
        assert.match(
          (erro as AppCredentialError).message,
          new RegExp(`function ${escapar(SCHEMA_A)}\\.minha\\(\\) \\(${escapar(SCHEMA_A)}, dono ${escapar(PAPEL_A)}\\)`),
        );
        return true;
      },
    );
  } finally {
    await operador.query(`DROP FUNCTION IF EXISTS ${id(SCHEMA_A)}.minha()`);
    await operador.query(`DROP VIEW IF EXISTS ${id(SCHEMA_A)}.v_propria`);
    await operador.query(`ALTER SCHEMA ${id(SCHEMA_A)} OWNER TO ${id(EXECUTOR)}`);
    // A troca de dono funde a entrada do papel na do dono e a leva junto na volta: sem reconceder,
    // o papel do cliente sai deste caso sem `USAGE` no próprio schema.
    await executor.query(`GRANT USAGE ON SCHEMA ${id(SCHEMA_A)} TO ${id(PAPEL_A)}`);
  }
  const lido = await comoCliente(PAPEL_A, async (c) => {
    const r = await c.query<{ total: number }>(`SELECT total_cents AS total FROM ${id(SCHEMA_A)}.orders WHERE id = 1`);
    return r.rows[0]?.total;
  });
  assert.equal(lido, 111, 'o arranjo volta inteiro: o cliente lê o próprio schema');
  await subidaPassa();
});

/**
 * Objeto do schema do cliente que chama o que mora fora dele sem ser view nem regra: gatilho,
 * padrão de coluna, coluna de domínio, política e operador. Cada um é uma linha de `pg_depend` que
 * sai do schema, e cada um vem de um catálogo diferente — é o caso que prova que cada ramo de
 * `objetos` pesa. O gatilho prova a metade do vazamento: ele chama rotina `SECURITY DEFINER` de
 * fora e a venda de A grava no schema de B. Os outros quatro entram pelo reconhecimento, porque o
 * vazamento de cada um é o mesmo mecanismo (a rotina de fora roda como o dono).
 *
 * Os nomes são conferidos na resposta inteira do catálogo, não na mensagem, que nomeia cinco.
 */
test('delegação, caso 10: gatilho, padrão, domínio, política e operador que saem do schema derrubam a subida', { skip: PULAR }, async () => {
  await executor.query(`CREATE SCHEMA ${id(FORA)}`);
  await executor.query(
    `CREATE FUNCTION ${id(FORA)}.espelho() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER ` +
      `AS $corpo$ BEGIN INSERT INTO ${id(SCHEMA_B)}.orders VALUES (NEW.id + 5000, NEW.total_cents); RETURN NEW; END $corpo$`,
  );
  await executor.query(`CREATE FUNCTION ${id(FORA)}.um() RETURNS int LANGUAGE sql AS $corpo$ SELECT 1 $corpo$`);
  await executor.query(
    `CREATE FUNCTION ${id(FORA)}.igual(a int, b int) RETURNS boolean LANGUAGE sql AS $corpo$ SELECT a = b $corpo$`,
  );
  await executor.query(`CREATE DOMAIN ${id(FORA)}.positivo AS int CHECK (VALUE > 0)`);
  await executor.query(
    `CREATE OPERATOR ${id(FORA)}.=== (FUNCTION = ${id(FORA)}.igual, LEFTARG = int, RIGHTARG = int)`,
  );
  await executor.query(
    `CREATE TRIGGER espelho AFTER INSERT ON ${id(SCHEMA_A)}.orders FOR EACH ROW EXECUTE FUNCTION ${id(FORA)}.espelho()`,
  );
  await executor.query(`ALTER TABLE ${id(SCHEMA_A)}.orders ADD COLUMN marca int DEFAULT ${id(FORA)}.um()`);
  await executor.query(`ALTER TABLE ${id(SCHEMA_A)}.orders ADD COLUMN quantidade ${id(FORA)}.positivo`);
  await executor.query(`CREATE POLICY so_um ON ${id(SCHEMA_A)}.orders USING (${id(FORA)}.um() = 1)`);
  await executor.query(
    `CREATE VIEW ${id(SCHEMA_A)}.v_operador WITH (security_invoker = true) AS ` +
      `SELECT id FROM ${id(SCHEMA_A)}.orders WHERE id OPERATOR(${id(FORA)}.===) 1`,
  );
  try {
    await comoCliente(
      PAPEL_A,
      (c) => c.query(`INSERT INTO ${id(SCHEMA_A)}.orders (id, total_cents) VALUES (9, 999)`),
      { confirmar: true },
    );
    const gravado = await operador.query<{ total: number }>(
      `SELECT total_cents AS total FROM ${id(SCHEMA_B)}.orders WHERE id = 5009`,
    );
    assert.equal(gravado.rows[0]?.total, 999, 'o estado vaza: o gatilho de A gravou no schema de B');

    await subidaRecusa([]);
    const linha = (await credentialQuery(GRUPO).execute(raizDaCredencial())).rows[0];
    const lista = linha?.delegated_dependencies ?? [];
    const esperado = (objeto: string): void => {
      const texto = `${objeto} (${SCHEMA_A} -> ${FORA})`;
      assert.equal(lista.includes(texto), true, `faltou "${texto}" em ${JSON.stringify(lista)}`);
    };
    esperado(`trigger espelho on table ${SCHEMA_A}.orders`);
    esperado(`default value for column marca of table ${SCHEMA_A}.orders`);
    esperado(`table ${SCHEMA_A}.orders`);
    esperado(`policy so_um on table ${SCHEMA_A}.orders`);
    esperado(`rule _RETURN on view ${SCHEMA_A}.v_operador`);
  } finally {
    await executor.query(`DROP VIEW IF EXISTS ${id(SCHEMA_A)}.v_operador`);
    await executor.query(`DROP POLICY IF EXISTS so_um ON ${id(SCHEMA_A)}.orders`);
    await executor.query(`DROP TRIGGER IF EXISTS espelho ON ${id(SCHEMA_A)}.orders`);
    await executor.query(`ALTER TABLE ${id(SCHEMA_A)}.orders DROP COLUMN IF EXISTS marca`);
    await executor.query(`ALTER TABLE ${id(SCHEMA_A)}.orders DROP COLUMN IF EXISTS quantidade`);
    await executor.query(`DROP SCHEMA IF EXISTS ${id(FORA)} CASCADE`);
    await operador.query(`DELETE FROM ${id(SCHEMA_A)}.orders WHERE id = 9`);
    await operador.query(`DELETE FROM ${id(SCHEMA_B)}.orders WHERE id = 5009`);
  }
  await subidaPassa();
});

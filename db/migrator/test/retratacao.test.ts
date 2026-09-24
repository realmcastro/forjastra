import { test, describe, before, after, type TestContext } from 'node:test';
import assert from 'node:assert/strict';
import { runExecutor, type RunResult } from './support/executor.js';
import {
  APP_CREDENTIAL_ROLE,
  APP_GROUP_ROLE,
  citado,
  codigo,
  comoPapel,
  createDatabase,
  eventos,
  motivoDeNaoConectar,
  scalar,
  skipWithoutPostgres,
  withClient,
  type DisposableDatabase,
} from './support/postgres.js';
import { buildMigrationsDir, tenantMigration } from './support/tree.js';

/**
 * Caso 62 de `CONTRATO.md` §14: **retirar uma declaração é linha nova, e ela só estreita** (`PAP-30`,
 * `docs/auditorias/2026-09-23-nono-gate-camada-de-papel.md`).
 *
 * O ciclo inteiro da §7.7 roda aqui, com a credencial nova criada pelo operador: declarada pela
 * rodada que aponta o ambiente para ela, aposentada pela mão humana, retratada. Em cada degrau a linha
 * do `verify` diz o que falta **naquele** estado, e depois da retratação ela some. O estado hostil é o
 * do excluído legítimo: o executor, que tem `ADMIN OPTION` no grupo e em todo papel de cliente, põe a
 * credencial retratada de volta e lhe devolve um cliente, e a retratação tem que ter tirado dela a
 * desculpa que ela tinha antes.
 */

const EXECUTOR_ROLE = 'forja_executor';
const APOSENTADA = 'forja_credencial_aposentada';
const PLANTADO = 'forja_plantado_retratacao';
const PAPEIS_DA_SONDA = [APOSENTADA];
const UM = 't_retrata_um';
const DOIS = 't_retrata_dois';

const PEDIDOS = tenantMigration(`
CREATE TABLE IF NOT EXISTS orders (
    order_id uuid NOT NULL,
    total numeric(14,2) NOT NULL,
    CONSTRAINT orders_pkey PRIMARY KEY (order_id)
);
`);

describe('a retratação de uma declaração', { skip: skipWithoutPostgres }, () => {
  let db: DisposableDatabase;
  let executorUrl: string;
  let semLogin: string | undefined;

  const migrationsDir = buildMigrationsDir({ tenant: [{ name: '0001__orders.sql', text: PEDIDOS }] });
  const rodar = (kind: 'verify' | 'migrate', credencial = APP_CREDENTIAL_ROLE): Promise<RunResult> =>
    runExecutor({ kind }, { url: executorUrl, migrationsDir, appCredentialRole: credencial });
  const comoOperador = (sql: string): Promise<unknown> => withClient(db.url, (client) => client.query(sql));
  const comoExecutor = (sql: string): Promise<unknown> =>
    withClient(comoPapel(db.url, EXECUTOR_ROLE), (client) => client.query(sql));
  const retratar = (papel: string, motivo: string): Promise<unknown> =>
    withClient(db.url, (client) =>
      client.query('INSERT INTO platform.role_retractions (role_name, reason) VALUES ($1, $2)', [papel, motivo]),
    );

  before(async () => {
    db = await createDatabase();
    executorUrl = comoPapel(db.url, EXECUTOR_ROLE);
    await withClient(db.url, async (client) => {
      const existe = await client.query('select 1 from pg_roles where rolname = $1', [EXECUTOR_ROLE]);
      if (existe.rowCount === 0) {
        await client.query(await citado(client, 'CREATE ROLE %I LOGIN CREATEROLE', EXECUTOR_ROLE));
      }
      await client.query(
        await citado(client, `GRANT ${APP_GROUP_ROLE} TO %I WITH ADMIN OPTION`, EXECUTOR_ROLE),
      );
      await client.query(await citado(client, `GRANT CREATE ON DATABASE %I TO ${EXECUTOR_ROLE}`, db.name));
      await client.query('REVOKE USAGE, CREATE ON SCHEMA public FROM PUBLIC');
      for (const papel of PAPEIS_DA_SONDA) {
        await client.query(await citado(client, 'DROP ROLE IF EXISTS %I', papel));
      }
      // A credencial da rotação nasce pela mão do operador (§7.2), no grupo.
      await client.query(await citado(client, 'CREATE ROLE %I LOGIN NOINHERIT', APOSENTADA));
      await client.query(await citado(client, `GRANT ${APP_GROUP_ROLE} TO %I`, APOSENTADA));
    });

    semLogin = await motivoDeNaoConectar(executorUrl, comoPapel(db.url, APP_CREDENTIAL_ROLE));
    if (semLogin !== undefined) return;

    for (const slug of ['retrata_um', 'retrata_dois']) {
      const feito = await runExecutor({ kind: 'provision', slug }, { url: executorUrl, migrationsDir });
      assert.equal(feito.exitCode, 0, feito.error);
    }
  });

  after(async () => {
    await db.drop();
    await withClient(db.url.replace(/\/[^/]*$/, '/postgres'), async (client) => {
      for (const papel of PAPEIS_DA_SONDA) {
        await client.query(await citado(client, 'DROP ROLE IF EXISTS %I', papel));
      }
    });
  });

  test('a rotação termina em retratação, a linha segue o estado, e a retratada não desculpa mais', async (t: TestContext) => {
    if (semLogin !== undefined) return t.skip(semLogin);

    // A rodada que aponta o ambiente para a credencial nova a declara e lhe concede os clientes.
    const declarou = await rodar('migrate', APOSENTADA);
    assert.equal(declarou.exitCode, 0, declarou.error);

    const ativa = await rodar('verify');
    assert.equal(ativa.exitCode, 0, ativa.output);
    assert.match(
      ativa.output,
      new RegExp(`registra e não reprova: credencial de aplicação a mais: "${APOSENTADA}" .*retratar a declaração é mão humana`),
    );

    // Fim da rotação pela mão humana: fora do grupo, e os papéis de cliente revogados por quem os deu.
    await comoOperador(`REVOKE ${APP_GROUP_ROLE} FROM ${APOSENTADA}`);
    for (const schema of [UM, DOIS]) {
      await comoOperador(`REVOKE app_${schema} FROM ${APOSENTADA} GRANTED BY ${EXECUTOR_ROLE}`);
    }
    const inerte = await rodar('verify');
    assert.equal(inerte.exitCode, 0, inerte.output);
    assert.match(inerte.output, new RegExp(`"${APOSENTADA}" .*já está inerte: fora do grupo e sem papel de cliente\\. Falta só a retratação`));
    assert.doesNotMatch(inerte.output, /tirá-la do grupo/, 'a instrução não manda fazer o que já foi feito');

    await retratar(APOSENTADA, 'fim da rotação de 2026-09-23');
    const retratada = await rodar('verify');
    assert.equal(retratada.exitCode, 0, retratada.output);
    assert.doesNotMatch(retratada.output, new RegExp(APOSENTADA), 'a retratada não é mais nomeada');

    const linha = await withClient(db.url, async (client) => {
      const r = await client.query<{ versao: string; quem: string }>(
        'select substr(retraction_id::text, 15, 1) as versao, retracted_by as quem ' +
          'from platform.role_retractions where role_name = $1',
        [APOSENTADA],
      );
      return r.rows[0];
    });
    assert.equal(linha?.versao, '7', 'a chave é uuid ordenado no tempo (D-04)');
    assert.equal(linha?.quem, 'postgres', 'quem retratou é quem emitiu a linha');

    // O excluído legítimo no pior que o privilégio dele permite: o executor devolve a credencial ao
    // grupo e lhe dá um cliente. Antes da retratação este estado era desculpado; agora é acusado.
    await comoExecutor(`GRANT ${APP_GROUP_ROLE} TO ${APOSENTADA}`);
    await comoExecutor(`GRANT app_${UM} TO ${APOSENTADA} WITH INHERIT FALSE, SET TRUE`);
    const devolvida = await rodar('verify');
    assert.equal(devolvida.exitCode, 3, devolvida.output);
    assert.match(devolvida.output, new RegExp(`alcance ao schema "${UM}": ${APOSENTADA} é membro do papel do cliente`));

    // E a rodada que tenta declará-la de novo para antes de tocar em papel.
    const redeclara = await rodar('migrate', APOSENTADA);
    assert.equal(redeclara.exitCode, 2, redeclara.error);
    assert.match(redeclara.error ?? '', new RegExp(`"${APOSENTADA}" teve a declaração retratada por "postgres"`));

    await comoExecutor(`REVOKE app_${UM} FROM ${APOSENTADA}`);
    await comoExecutor(`REVOKE ${APP_GROUP_ROLE} FROM ${APOSENTADA}`);
    const limpo = await rodar('verify');
    assert.equal(limpo.exitCode, 0, limpo.output);
  });

  /**
   * A retratação é a segunda saída da linha plantada (`PAP-25`): a primeira é a adoção, que exige
   * conectar com o nome; esta é do operador, e deixa a linha inerte sem desculpar nada.
   */
  test('declaração plantada e retratada deixa de ser acusada, e a tabela é append-only e terminal', async (t: TestContext) => {
    if (semLogin !== undefined) return t.skip(semLogin);

    await comoExecutor(
      'INSERT INTO platform.role_declarations (declaration_id, role_name, role_kind, declared_by) ' +
        `VALUES (gen_random_uuid(), '${PLANTADO}', 'executor', '${EXECUTOR_ROLE}')`,
    );
    const plantada = await rodar('verify');
    assert.equal(plantada.exitCode, 3, plantada.output);
    assert.match(plantada.output, new RegExp(`declaração sem ato: "${PLANTADO}"`));

    await retratar(PLANTADO, 'linha plantada por INSERT cru');
    const retratada = await rodar('verify');
    assert.equal(retratada.exitCode, 0, retratada.output);
    assert.doesNotMatch(retratada.output, new RegExp(PLANTADO));

    const recusa = async (sql: string): Promise<string | undefined> => {
      try {
        await comoOperador(sql);
        return undefined;
      } catch (erro) {
        return codigo(erro);
      }
    };
    assert.equal(await recusa(`UPDATE platform.role_retractions SET reason = 'outra' WHERE role_name = '${PLANTADO}'`), 'P0001');
    assert.equal(await recusa(`DELETE FROM platform.role_retractions WHERE role_name = '${PLANTADO}'`), 'P0001');
    assert.equal(
      await recusa(`INSERT INTO platform.role_retractions (role_name, reason) VALUES ('${PLANTADO}', 'de novo')`),
      '23505',
      'uma retratação por nome',
    );
    assert.equal(
      await recusa("INSERT INTO platform.role_retractions (role_name, reason) VALUES ('nunca_declarado', 'erro')"),
      '23503',
      'não se retrata o que não foi declarado',
    );
    assert.equal(
      await scalar<string>(db.url, 'select count(*)::text from platform.role_retractions'),
      '2',
      'as duas retratações deste arquivo, e nenhuma das recusadas',
    );
  });

  /**
   * Retratar o executor que está conectado é o pior que a tabela permite a quem escreve nela, e é
   * por isso que ela não precisa de trava: o resultado é o `verify` acusar a posse de todo schema
   * nosso, e a rodada seguinte recusar. Estreitar é tudo o que a retratação sabe fazer.
   */
  test('retratar o executor em uso só faz acusar mais, e a rodada seguinte recusa', async (t: TestContext) => {
    if (semLogin !== undefined) return t.skip(semLogin);

    await retratar(EXECUTOR_ROLE, 'retratação do próprio executor, para medir o pior caso');
    const acusou = await rodar('verify');
    assert.equal(acusou.exitCode, 3, acusou.output);
    for (const schema of ['platform', UM, DOIS]) {
      assert.match(acusou.output, new RegExp(`dono inesperado: o schema "${schema}" pertence a "${EXECUTOR_ROLE}"`));
    }
    const recusou = await rodar('migrate');
    assert.equal(recusou.exitCode, 2, recusou.error);
    assert.match(recusou.error ?? '', new RegExp(`"${EXECUTOR_ROLE}" teve a declaração retratada`));
  });

  /** Sem a tabela de retratação não há como saber que declaração vale: a pergunta não feita reprova. */
  test('sem platform.role_retractions, verify reprova dizendo que não perguntou, e migrate recusa', async (t: TestContext) => {
    if (semLogin !== undefined) return t.skip(semLogin);

    const antes = await eventos(db.url, 'role_retractions_missing');
    await comoOperador('DROP TABLE platform.role_retractions');
    const reprovou = await rodar('verify');
    assert.equal(reprovou.exitCode, 3, reprovou.error);
    assert.match(reprovou.output, /pergunta não feita: platform\.role_retractions não existe/);
    assert.equal(await eventos(db.url, 'role_retractions_missing'), antes + 1);

    const recusou = await rodar('migrate');
    assert.equal(recusou.exitCode, 2, recusou.error);
    assert.match(recusou.error ?? '', /platform\.role_retractions não existe/);
  });
});

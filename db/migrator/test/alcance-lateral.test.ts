import { test, describe, before, after, type TestContext } from 'node:test';
import assert from 'node:assert/strict';
import { runExecutor, type RunResult } from './support/executor.js';
import {
  APP_CREDENTIAL_ROLE,
  APP_GROUP_ROLE,
  citado,
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
 * Casos 60 e 61 de `CONTRATO.md` §14: os dois mecanismos de alcance que a terceira auditoria da
 * credencial na subida mediu passando pelos dois lados da parede
 * (`docs/auditorias/2026-09-23-conferencia-da-credencial-na-subida-terceira.md`, `SUB-09` e `SUB-12`).
 *
 * **O sujeito hostil é o excluído legítimo**, pela régua de
 * [[convention-exclusao-se-prova-com-o-excluido-hostil]]: no caso 60, o executor, que é dono das
 * tabelas de cliente e por isso cria objeto que roda com o privilégio dele; no caso 61, a credencial
 * e o executor declarados recebendo papel predefinido, que a declaração não pode desculpar. Cada
 * estado hostil é desfeito no fim do passo e a saída volta a `0`, que é a prova de zero falso positivo.
 */

const EXECUTOR_ROLE = 'forja_executor';
/** O papel `LOGIN` que o operador põe no grupo com leitura total, que é o cenário literal do `SUB-12`. */
const LEITOR = 'forja_leitor_lateral';
/** Um degrau entre a credencial e o papel predefinido: a subida pela cadeia tem que alcançá-lo. */
const PONTE = 'forja_ponte_lateral';
const PAPEIS_DA_SONDA = [LEITOR, PONTE];
const UM = 't_lateral_um';
const DOIS = 't_lateral_dois';

const PEDIDOS = tenantMigration(`
CREATE TABLE IF NOT EXISTS orders (
    order_id uuid NOT NULL,
    total numeric(14,2) NOT NULL,
    CONSTRAINT orders_pkey PRIMARY KEY (order_id)
);
`);

describe('alcance que não passa por ACL de schema nem por membro de papel de cliente', { skip: skipWithoutPostgres }, () => {
  let db: DisposableDatabase;
  let executorUrl: string;
  let semLogin: string | undefined;

  const migrationsDir = buildMigrationsDir({ tenant: [{ name: '0001__orders.sql', text: PEDIDOS }] });
  const verify = (): Promise<RunResult> => runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
  const comoOperador = (sql: string): Promise<unknown> => withClient(db.url, (client) => client.query(sql));
  const comoExecutor = (sql: string): Promise<unknown> =>
    withClient(comoPapel(db.url, EXECUTOR_ROLE), (client) => client.query(sql));

  const verifyLimpo = async (): Promise<void> => {
    const limpo = await verify();
    assert.equal(limpo.exitCode, 0, `${limpo.error}\n${limpo.output}`);
    assert.doesNotMatch(limpo.output, /alcance ao schema|delegação por dono de objeto/);
  };

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
      await client.query(await citado(client, 'CREATE ROLE %I LOGIN', LEITOR));
      await client.query(await citado(client, 'CREATE ROLE %I NOLOGIN', PONTE));
    });

    semLogin = await motivoDeNaoConectar(executorUrl, comoPapel(db.url, APP_CREDENTIAL_ROLE));
    if (semLogin !== undefined) return;

    for (const slug of ['lateral_um', 'lateral_dois']) {
      const feito = await runExecutor({ kind: 'provision', slug }, { url: executorUrl, migrationsDir });
      assert.equal(feito.exitCode, 0, feito.error);
    }
    await comoOperador(`insert into ${UM}.orders values (gen_random_uuid(), 111)`);
    await comoOperador(`insert into ${DOIS}.orders values (gen_random_uuid(), 222)`);
  });

  after(async () => {
    await db.drop();
    await withClient(db.url.replace(/\/[^/]*$/, '/postgres'), async (client) => {
      await client.query(`REVOKE pg_read_all_data FROM ${APP_CREDENTIAL_ROLE}`).catch(() => undefined);
      for (const papel of PAPEIS_DA_SONDA) {
        await client.query(await citado(client, 'DROP ROLE IF EXISTS %I', papel));
      }
    });
  });

  /**
   * Caso 60, o `SUB-09` do lado do `verify`. O executor cria à mão, no schema de um cliente, objeto
   * que roda com o privilégio dele. As duas formas que o `verify` não imprimia (regra de reescrita
   * e view materializada) e a regra do mesmo schema, que separa a linha de impressão da pergunta
   * por dependência: a primeira é drift, a segunda é drift **que atravessa**.
   */
  test('regra e view materializada entram na impressão, e a dependência entre schemas é nomeada', async (t: TestContext) => {
    if (semLogin !== undefined) return t.skip(semLogin);
    await verifyLimpo();

    // A regra do SUB-09: a venda do cliente um conclui, e grava no cliente dois.
    await comoExecutor(
      `CREATE RULE espelho AS ON INSERT TO ${UM}.orders ` +
        `DO ALSO INSERT INTO ${DOIS}.orders VALUES (gen_random_uuid(), new.total)`,
    );
    const antes = await scalar<string>(db.url, `select count(*)::text from ${DOIS}.orders`);
    await withClient(comoPapel(db.url, APP_CREDENTIAL_ROLE), async (client) => {
      await client.query(`set role app_${UM}`);
      await client.query(`insert into ${UM}.orders values (gen_random_uuid(), 7)`);
    });
    const depois = await scalar<string>(db.url, `select count(*)::text from ${DOIS}.orders`);
    assert.equal(Number(depois), Number(antes) + 1, 'a regra gravou no outro cliente');

    const eventosAntes = await eventos(db.url, 'object_owner_delegation');
    const comRegra = await verify();
    assert.equal(comRegra.exitCode, 3, comRegra.output);
    assert.match(comRegra.output, new RegExp(`${UM} difere da referência:[\\s\\S]*sobra: +regra +orders\\.espelho habilitacao:O md5:`));
    assert.match(
      comRegra.output,
      new RegExp(`delegação por dono de objeto: .*espelho.*, no schema "${UM}", depende de .*${DOIS}\\.orders.*, no schema "${DOIS}"`),
    );
    assert.ok((await eventos(db.url, 'object_owner_delegation')) > eventosAntes);
    await comoExecutor(`DROP RULE espelho ON ${UM}.orders`);
    await verifyLimpo();

    // Regra no próprio schema: drift na impressão, e nenhuma dependência atravessando.
    await comoExecutor(`CREATE RULE eco AS ON INSERT TO ${UM}.orders DO ALSO NOTHING`);
    const soImpressao = await verify();
    assert.equal(soImpressao.exitCode, 3, soImpressao.output);
    assert.match(soImpressao.output, /sobra: +regra +orders\.eco /);
    assert.doesNotMatch(soImpressao.output, /delegação por dono de objeto/);
    await comoExecutor(`DROP RULE eco ON ${UM}.orders`);

    // A view materializada: o privilégio padrão do executor a entrega ao papel do cliente um, e ela
    // devolve a venda do cliente dois.
    await comoExecutor(`CREATE MATERIALIZED VIEW ${UM}.apoio AS SELECT total FROM ${DOIS}.orders`);
    await withClient(comoPapel(db.url, APP_CREDENTIAL_ROLE), async (client) => {
      await client.query(`set role app_${UM}`);
      const leu = await client.query<{ total: string }>(`select total::text from ${UM}.apoio where total = 222`);
      assert.equal(leu.rowCount, 1, 'a view materializada entrega a venda do outro cliente');
    });
    const comMaterializada = await verify();
    assert.equal(comMaterializada.exitCode, 3, comMaterializada.output);
    assert.match(comMaterializada.output, /sobra: +materializada apoio - md5:/);
    assert.match(comMaterializada.output, new RegExp(`delegação por dono de objeto: .*apoio.*, no schema "${UM}", depende de .*${DOIS}\\.orders`));
    await comoExecutor(`DROP MATERIALIZED VIEW ${UM}.apoio`);

    // A mesma forma no próprio schema: só a impressão.
    await comoExecutor(`CREATE MATERIALIZED VIEW ${UM}.propria AS SELECT total FROM ${UM}.orders`);
    const materializadaPropria = await verify();
    assert.equal(materializadaPropria.exitCode, 3, materializadaPropria.output);
    assert.match(materializadaPropria.output, /sobra: +materializada propria - md5:/);
    assert.doesNotMatch(materializadaPropria.output, /delegação por dono de objeto/);
    await comoExecutor(`DROP MATERIALIZED VIEW ${UM}.propria`);

    // O salto por um schema de fora, medido pelo backend: o destino é qualquer outro schema.
    await comoOperador(`CREATE SCHEMA ext AUTHORIZATION ${EXECUTOR_ROLE}`);
    await comoExecutor(`CREATE VIEW ext.ponte AS SELECT total FROM ${DOIS}.orders`);
    await comoExecutor(`CREATE VIEW ${UM}.salto AS SELECT total FROM ext.ponte`);
    const salto = await verify();
    assert.equal(salto.exitCode, 3, salto.output);
    assert.match(salto.output, new RegExp(`delegação por dono de objeto: .*salto.*, no schema "${UM}", depende de .*ext\\.ponte.*, no schema "ext"`));
    await comoExecutor(`DROP VIEW ${UM}.salto`);
    await comoOperador('DROP SCHEMA ext CASCADE');

    // A view com security_invoker não é desculpada: a opção é do dono, que a desliga quando quiser.
    await comoExecutor(
      `CREATE VIEW ${UM}.invocadora WITH (security_invoker = true) AS SELECT total FROM ${DOIS}.orders`,
    );
    const invocadora = await verify();
    assert.equal(invocadora.exitCode, 3, invocadora.output);
    assert.match(invocadora.output, new RegExp(`delegação por dono de objeto: .*invocadora.*, no schema "${UM}"`));
    await comoExecutor(`DROP VIEW ${UM}.invocadora`);

    // Rotina SECURITY DEFINER se acusa por existência: o corpo em plpgsql não deixa dependência.
    await comoExecutor(
      `CREATE FUNCTION ${UM}.relatorio() RETURNS bigint LANGUAGE plpgsql SECURITY DEFINER ` +
        `AS 'BEGIN RETURN (SELECT count(*) FROM ${DOIS}.orders); END'`,
    );
    const definidora = await verify();
    assert.equal(definidora.exitCode, 3, definidora.output);
    assert.match(definidora.output, new RegExp(`delegação por dono de objeto: .*relatorio\\(\\).*, no schema "${UM}", é SECURITY DEFINER`));
    await comoExecutor(`DROP FUNCTION ${UM}.relatorio()`);

    // E platform é schema protegido: objeto dele apontando para um cliente também atravessa.
    await comoExecutor(`CREATE VIEW platform.painel AS SELECT total FROM ${UM}.orders`);
    const noPlatform = await verify();
    assert.equal(noPlatform.exitCode, 3, noPlatform.output);
    assert.match(noPlatform.output, new RegExp(`delegação por dono de objeto: .*painel.*, no schema "platform", depende de .*${UM}\\.orders`));
    await comoExecutor('DROP VIEW platform.painel');

    await verifyLimpo();
  });

  /**
   * Caso 61, o `SUB-12`. Papel predefinido é concessão de superusuário, então quem emite aqui é o
   * operador, e o sujeito que recebe é quem a declaração exclui, ou quem está no grupo. Três
   * estados: o papel `LOGIN` no grupo com leitura total (o cenário literal da auditoria), a
   * credencial declarada alcançando a leitura por um degrau, e o executor declarado com escrita total.
   */
  test('papel predefinido de alcance é acusado para membro do grupo, declarado inclusive', async (t: TestContext) => {
    if (semLogin !== undefined) return t.skip(semLogin);
    await verifyLimpo();
    const eventosAntes = await eventos(db.url, 'tenant_schema_foreign_grant');

    await comoOperador(`GRANT ${APP_GROUP_ROLE} TO ${LEITOR}`);
    await comoOperador(`GRANT pg_read_all_data TO ${LEITOR}`);
    await withClient(comoPapel(db.url, LEITOR), async (client) => {
      for (const schema of [UM, DOIS]) {
        const leu = await client.query(`select count(*) from ${schema}.orders`);
        assert.equal(leu.rowCount, 1, `${LEITOR} lê ${schema} sem ACL nenhum`);
      }
    });
    const leitor = await verify();
    assert.equal(leitor.exitCode, 3, leitor.output);
    for (const schema of [UM, DOIS]) {
      assert.match(leitor.output, new RegExp(`alcance ao schema "${schema}": ${LEITOR} alcança pg_read_all_data`));
    }
    assert.ok((await eventos(db.url, 'tenant_schema_foreign_grant')) >= eventosAntes + 2);
    await comoOperador(`REVOKE pg_read_all_data FROM ${LEITOR}`);
    await verifyLimpo();

    // A credencial declarada, por um degrau: nenhuma pergunta de membro de papel declarado a vê,
    // porque ela é quem é membro, e não quem tem membro.
    await comoOperador(`GRANT pg_read_all_data TO ${PONTE}`);
    await comoOperador(`GRANT ${PONTE} TO ${APP_CREDENTIAL_ROLE}`);
    await withClient(comoPapel(db.url, APP_CREDENTIAL_ROLE), async (client) => {
      await client.query(`set role ${PONTE}`);
      const leu = await client.query(`select total from ${DOIS}.orders where total = 222`);
      assert.equal(leu.rowCount, 1, 'a credencial lê o cliente dois sem assumir o papel dele');
    });
    const credencial = await verify();
    assert.equal(credencial.exitCode, 3, credencial.output);
    assert.match(credencial.output, new RegExp(`alcance ao schema "${DOIS}": ${APP_CREDENTIAL_ROLE} alcança pg_read_all_data`));
    const migrate = await runExecutor({ kind: 'migrate' }, { url: executorUrl, migrationsDir });
    assert.equal(migrate.exitCode, 3, migrate.error);
    assert.match(migrate.error ?? '', new RegExp(`${APP_CREDENTIAL_ROLE} alcança pg_read_all_data`));
    await comoOperador(`REVOKE ${PONTE} FROM ${APP_CREDENTIAL_ROLE}`);
    await comoOperador(`REVOKE pg_read_all_data FROM ${PONTE}`);
    await verifyLimpo();

    await comoOperador(`GRANT pg_write_all_data TO ${EXECUTOR_ROLE}`);
    const executor = await verify();
    assert.equal(executor.exitCode, 3, executor.output);
    assert.match(executor.output, new RegExp(`alcance ao schema "${UM}": ${EXECUTOR_ROLE} alcança pg_write_all_data`));
    await comoOperador(`REVOKE pg_write_all_data FROM ${EXECUTOR_ROLE}`);

    await comoOperador(`REVOKE ${APP_GROUP_ROLE} FROM ${LEITOR}`);
    await verifyLimpo();
  });
});

import { test, describe, before, after, type TestContext } from 'node:test';
import assert from 'node:assert/strict';
import { runExecutor } from './support/executor.js';
import {
  APP_CREDENTIAL_ROLE,
  APP_GROUP_ROLE,
  citado,
  comoPapel,
  createDatabase,
  eventos,
  motivoDeNaoConectar,
  skipWithoutPostgres,
  withClient,
  type DisposableDatabase,
} from './support/postgres.js';
import { buildMigrationsDir, tenantMigration } from './support/tree.js';

/**
 * Casos 45 a 48 de `CONTRATO.md` §14: o sétimo gate
 * (`docs/auditorias/2026-09-12-reauditoria-camada-de-papel.md`, `PAP-19` a `PAP-23`).
 *
 * **A régua deste arquivo, e ela é a lição do gate: exclusão se prova pelo que ela deixa passar, com
 * o excluído em estado hostil.** Três das quatro rodadas anteriores testaram a exclusão colocando o
 * excluído em estado **legítimo** e verificando que nada acusava — que é precisamente o desfecho que
 * o defeito produz. Aqui, cada predicado que sobreviveu ao desenho tem um caso em que o beneficiário
 * excluído faz a pior coisa que o privilégio dele permite, e o controle **tem** que acusar.
 *
 * Os três predicados que sobreviveram ao desenho, com o pior que o excluído consegue fazer em cada
 * um: o **nome declarado** com a credencial ainda no grupo, contra uma concessão herdável e contra a
 * saída do grupo (caso 45); a **posse**, que não exclui ninguém e é afirmada, contra um dono de fora
 * que apaga a própria entrada de ACL (caso 46); e o **objeto de extensão cujo dono é superusuário**,
 * contra a isca pendurada numa extensão que o próprio atacante instalou (caso 47).
 *
 * **O executor aqui não é superusuário**, e é ele quem emite os comandos de ataque sempre que o
 * cenário medido diz que ele consegue. Sem `trust`, o arquivo é **pulado com motivo** — e
 * `piso-de-medicao.test.ts` é quem impede que esse pulo passe por suíte verde.
 */

const EXECUTOR_ROLE = 'forja_executor';
/** `LOGIN`, `NOINHERIT`, membro do grupo: tudo o que o arranjo pede, e sem declaração. */
const CREDENCIAL_SOSIA = 'forja_credencial_sosia_t0009';
/** `NOLOGIN` com `ADMIN OPTION` no grupo: a ponte do `PAP-20`. `LEITOR` é quem lê por ela. */
const PONTE = 'forja_ponte_t0009';
const LEITOR = 'forja_leitor_t0009';
/** `LOGIN` fora de tudo: quem recebe a posse do schema no `PAP-22`. */
const DONO = 'forja_dono_t0009';

const PAPEIS_DA_SONDA = [CREDENCIAL_SOSIA, PONTE, LEITOR, DONO];

const PEDIDOS = tenantMigration(`
CREATE TABLE IF NOT EXISTS orders (
    order_id uuid NOT NULL,
    total numeric(14,2) NOT NULL,
    CONSTRAINT orders_pkey PRIMARY KEY (order_id)
);
`);

describe('a exclusão provada pelo que ela deixa passar', { skip: skipWithoutPostgres }, () => {
  let db: DisposableDatabase;
  let executorUrl: string;
  let credencialUrl: string;
  let semLogin: string | undefined;

  const migrationsDir = buildMigrationsDir({ tenant: [{ name: '0001__orders.sql', text: PEDIDOS }] });
  before(async () => {
    db = await createDatabase();
    executorUrl = comoPapel(db.url, EXECUTOR_ROLE);
    credencialUrl = comoPapel(db.url, APP_CREDENTIAL_ROLE);

    // §7.2, o ato do operador, e é ele — não o executor — quem conecta aqui.
    await withClient(db.url, async (client) => {
      const existe = await client.query('select 1 from pg_roles where rolname = $1', [EXECUTOR_ROLE]);
      if (existe.rowCount === 0) {
        await client.query(await citado(client, 'CREATE ROLE %I LOGIN CREATEROLE', EXECUTOR_ROLE));
      }
      await client.query(
        await citado(client, `GRANT ${APP_GROUP_ROLE} TO %I WITH ADMIN OPTION`, EXECUTOR_ROLE),
      );
      await client.query(
        await citado(client, `GRANT CREATE ON DATABASE %I TO ${EXECUTOR_ROLE}`, db.name),
      );
      await client.query('REVOKE USAGE, CREATE ON SCHEMA public FROM PUBLIC');
      for (const papel of PAPEIS_DA_SONDA) {
        await client.query(await citado(client, 'DROP ROLE IF EXISTS %I', papel));
      }
      await client.query(await citado(client, 'CREATE ROLE %I LOGIN NOINHERIT', CREDENCIAL_SOSIA));
      await client.query(await citado(client, `GRANT ${APP_GROUP_ROLE} TO %I`, CREDENCIAL_SOSIA));
    });

    semLogin = await motivoDeNaoConectar(executorUrl, credencialUrl);
    if (semLogin !== undefined) return;

    for (const slug of ['hostil_um', 'hostil_dois']) {
      const feito = await runExecutor({ kind: 'provision', slug }, { url: executorUrl, migrationsDir });
      assert.equal(feito.exitCode, 0, feito.error);
    }
    await withClient(db.url, async (client) => {
      for (const schema of ['t_hostil_um', 't_hostil_dois']) {
        await client.query(`insert into ${schema}.orders values (gen_random_uuid(), 10)`);
      }
    });
  });

  after(async () => {
    await db.drop();
    await withClient(db.url.replace(/\/[^/]*$/, '/postgres'), async (client) => {
      for (const papel of PAPEIS_DA_SONDA) {
        await client.query(await citado(client, 'DROP ROLE IF EXISTS %I', papel));
      }
    });
  });

  /**
   * Caso 45, o `PAP-19` e o `PAP-20` no mesmo lugar, porque é a mesma exclusão.
   *
   * **Estado hostil um, o sósia.** Um papel com **todas** as propriedades que a rodada anterior usava
   * para desculpar — `LOGIN`, `NOINHERIT`, membro de `forja_app`, sem `admin_option` — recebe a
   * concessão na forma perigosa, `WITH INHERIT TRUE`, emitida pelo operador. Medido em 2026-09-12:
   * ele lia os dois clientes nua, `verify` saía `0`, e a única linha impressa dizia que aquele
   * alcance **não** contava como alcance de terceiro.
   *
   * **Estado hostil dois, a ponte.** Seis comandos do executor **não-superusuário** montam um papel
   * `NOLOGIN` com `ADMIN OPTION` sobre o grupo e um leitor `LOGIN` membro dele. A ponte carregava os
   * dois sinalizadores que a exclusão anterior lia, um em cada braço — `admin_option` a tirava da
   * §7.5.1, a falta de `LOGIN` a tirava da enumeração de credenciais —, e o leitor ficava com os dois
   * clientes na mão sem `verify` imprimir uma linha.
   */
  test('quem carrega as propriedades do arranjo e não está declarado é acusado', async (t: TestContext) => {
    if (semLogin !== undefined) return t.skip(semLogin);

    await withClient(db.url, async (client) => {
      for (const schema of ['t_hostil_um', 't_hostil_dois']) {
        await client.query(`GRANT app_${schema} TO ${CREDENCIAL_SOSIA} WITH INHERIT TRUE`);
      }
    });

    await withClient(comoPapel(db.url, CREDENCIAL_SOSIA), async (client) => {
      for (const schema of ['t_hostil_um', 't_hostil_dois']) {
        const leu = await client.query(`select count(*) from ${schema}.orders`);
        assert.equal(leu.rowCount, 1, `o sósia lê ${schema} sem assumir papel nenhum`);
      }
    });

    const antes = await eventos(db.url, 'tenant_schema_foreign_grant');
    const acusou = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(acusou.exitCode, 3, `${acusou.error}\n${acusou.output}`);
    for (const schema of ['t_hostil_um', 't_hostil_dois']) {
      assert.match(
        acusou.output,
        new RegExp(`alcance ao schema "${schema}": ${CREDENCIAL_SOSIA} é membro do papel do cliente, com herança`),
      );
    }
    assert.equal(await eventos(db.url, 'tenant_schema_foreign_grant'), antes + 2);
    assert.match(
      acusou.output,
      /registra e não reprova: ato do operador pendente/,
      'a saída diz de que lado cada linha está, sem que ninguém precise abrir o código (§13.6)',
    );

    // E a convergência para **antes de conceder**: o executor não adota alcance que ninguém declarou.
    const recusou = await runExecutor(
      { kind: 'migrate', schema: 't_hostil_um' },
      { url: executorUrl, migrationsDir },
    );
    assert.equal(recusou.exitCode, 3, recusou.error);
    assert.match(recusou.error ?? '', /não está declarado em platform.role_declarations/);

    await withClient(db.url, async (client) => {
      for (const schema of ['t_hostil_um', 't_hostil_dois']) {
        await client.query(`REVOKE app_${schema} FROM ${CREDENCIAL_SOSIA}`);
      }
    });
    const semSosia = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(semSosia.exitCode, 0, `${semSosia.error}\n${semSosia.output}`);

    // A ponte, inteira pela conexão do executor, que não é superusuário.
    await withClient(executorUrl, async (client) => {
      await client.query(await citado(client, 'CREATE ROLE %I NOLOGIN', PONTE));
      await client.query(await citado(client, `GRANT ${APP_GROUP_ROLE} TO %I WITH ADMIN OPTION`, PONTE));
      await client.query(`GRANT app_t_hostil_um TO ${PONTE}`);
      await client.query(`GRANT app_t_hostil_dois TO ${PONTE}`);
      await client.query(await citado(client, 'CREATE ROLE %I LOGIN', LEITOR));
      await client.query(await citado(client, `GRANT ${PONTE} TO %I`, LEITOR));
    });

    await withClient(comoPapel(db.url, LEITOR), async (client) => {
      for (const schema of ['t_hostil_um', 't_hostil_dois']) {
        const leu = await client.query(`select count(*) from ${schema}.orders`);
        assert.equal(leu.rowCount, 1, `o leitor lê ${schema} pela ponte, sem estar em arranjo nenhum`);
      }
    });

    const acusouPonte = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(acusouPonte.exitCode, 3, `${acusouPonte.error}\n${acusouPonte.output}`);
    for (const schema of ['t_hostil_um', 't_hostil_dois']) {
      assert.match(
        acusouPonte.output,
        new RegExp(`alcance ao schema "${schema}": ${PONTE} é membro do papel do cliente`),
        'a ponte carrega admin_option no grupo, e isso deixou de desculpar qualquer coisa',
      );
    }

    await withClient(executorUrl, async (client) => {
      await client.query(`REVOKE ${PONTE} FROM ${LEITOR}`);
      await client.query(`REVOKE app_t_hostil_um FROM ${PONTE}`);
      await client.query(`REVOKE app_t_hostil_dois FROM ${PONTE}`);
      await client.query(`REVOKE ${APP_GROUP_ROLE} FROM ${PONTE}`);
    });
    const limpo = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(limpo.exitCode, 0, `${limpo.error}\n${limpo.output}`);
  });

  /**
   * Caso 46, o `PAP-22`, e o estado hostil aqui é o que prova que a §7.5.4 **não** depende do ACL.
   *
   * Duas linhas do executor entregam o schema a um papel de fora. Depois delas, o ataque faz a pior
   * coisa disponível para se esconder: **apaga a própria entrada de ACL** do schema. Um dono sem
   * entrada de ACL continua podendo se reconceder o que quiser e continua podendo
   * `DROP SCHEMA … CASCADE` — então a pergunta que olha só `nspacl` volta a não ver nada, e é por
   * isso que a afirmação de dono é pergunta própria e não filtro da pergunta invertida.
   */
  test('dono de fora, com a própria entrada de ACL apagada, continua sendo acusado', async (t: TestContext) => {
    if (semLogin !== undefined) return t.skip(semLogin);

    await withClient(executorUrl, async (client) => {
      await client.query(await citado(client, 'CREATE ROLE %I LOGIN', DONO));
      await client.query(await citado(client, 'GRANT %I TO ' + EXECUTOR_ROLE, DONO));
      await client.query(`ALTER SCHEMA t_hostil_um OWNER TO ${DONO}`);
      await client.query(`GRANT SELECT ON ALL TABLES IN SCHEMA t_hostil_um TO ${DONO}`);
    });

    await withClient(comoPapel(db.url, DONO), async (client) => {
      const leu = await client.query('select count(*) from t_hostil_um.orders');
      assert.equal(leu.rowCount, 1, 'o dono lê o cliente sem estar em arranjo nenhum');
    });

    const antes = await eventos(db.url, 'tenant_schema_owner_unexpected');
    const acusou = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(acusou.exitCode, 3, `${acusou.error}\n${acusou.output}`);
    assert.match(
      acusou.output,
      new RegExp(`dono inesperado: o schema "t_hostil_um" pertence a "${DONO}"`),
    );
    assert.equal(await eventos(db.url, 'tenant_schema_owner_unexpected'), antes + 1);

    // O esconderijo: sem entrada de ACL, a via `acl` da §7.5.1 não tem o que enumerar.
    await withClient(comoPapel(db.url, DONO), async (client) => {
      await client.query(`REVOKE ALL ON SCHEMA t_hostil_um FROM ${DONO}`);
    });
    const escondido = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(escondido.exitCode, 3, `${escondido.error}\n${escondido.output}`);
    assert.doesNotMatch(
      escondido.output,
      new RegExp(`alcance ao schema "t_hostil_um": ${DONO} tem`),
      'é este o estado que a pergunta invertida sozinha não enxerga',
    );
    assert.match(
      escondido.output,
      new RegExp(`dono inesperado: o schema "t_hostil_um" pertence a "${DONO}"`),
      'a afirmação de dono não depende do ACL, e é por isso que ela é pergunta própria',
    );

    // E o dono se reconcede o que quiser, que é a prova de que apagar o ACL não tira o alcance.
    await withClient(comoPapel(db.url, DONO), async (client) => {
      await client.query(`GRANT USAGE ON SCHEMA t_hostil_um TO ${DONO}`);
      const leu = await client.query('select count(*) from t_hostil_um.orders');
      assert.equal(leu.rowCount, 1, 'o dono volta a ler quando quiser: a posse é o alcance');
    });

    await withClient(executorUrl, async (client) => {
      await client.query(`ALTER SCHEMA t_hostil_um OWNER TO ${EXECUTOR_ROLE}`);
      // A posse volta sem a entrada de ACL que o ataque apagou, e sem ela nem o dono alcança o
      // próprio schema: devolver a posse é metade do conserto, e a outra metade é esta linha.
      await client.query(`GRANT ALL ON SCHEMA t_hostil_um TO ${EXECUTOR_ROLE}`);
      await client.query(`REVOKE ALL ON SCHEMA t_hostil_um FROM ${DONO}`);
      await client.query(`REVOKE SELECT ON ALL TABLES IN SCHEMA t_hostil_um FROM ${DONO}`);
      await client.query(`REVOKE ${DONO} FROM ${EXECUTOR_ROLE}`);
    });
    const limpo = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(limpo.exitCode, 0, `${limpo.error}\n${limpo.output}`);
  });

  /**
   * Caso 47, o `PAP-21`. A exclusão que sobrou em `public` é "objeto de extensão **cujo dono é
   * superusuário**", e o estado hostil é o ator do achado fazendo o que ele consegue: instalar uma
   * extensão **confiável** como não-superusuário — que o PostgreSQL permite desde a 13, ao contrário
   * do que a ausência declarada afirmava — e pendurar a isca nela.
   *
   * Medido em 2026-09-12: `ALTER EXTENSION pgcrypto ADD VIEW public.v_isca` devolvia o `verify` de
   * `3` para `0`. As duas metades da correção estão aqui: a isca continua acusada **dentro** da
   * extensão, e a extensão sozinha, instalada pelo mesmo papel, não produz linha nenhuma — porque o
   * que desculpa é o dono do objeto, e as rotinas de `pgcrypto` nascem do superusuário de origem
   * mesmo quando quem instala não é.
   */
  test('isca pendurada em extensão instalada pelo atacante continua acusada', async (t: TestContext) => {
    if (semLogin !== undefined) return t.skip(semLogin);

    const disponivel = await withClient(db.url, async (client) => {
      const linha = await client.query(
        "select 1 from pg_available_extensions where name = 'pgcrypto'",
      );
      return linha.rowCount === 1;
    });
    if (!disponivel) return t.skip('pgcrypto não está disponível neste servidor');

    await withClient(db.url, async (client) => {
      await client.query(`GRANT USAGE, CREATE ON SCHEMA public TO ${EXECUTOR_ROLE}`);
    });

    await withClient(executorUrl, async (client) => {
      await client.query('CREATE EXTENSION pgcrypto SCHEMA public');
    });
    const dono = await withClient(db.url, async (client) => {
      const linha = await client.query<{ dono: string }>(
        "select pg_get_userbyid(extowner) as dono from pg_extension where extname = 'pgcrypto'",
      );
      return linha.rows[0]?.dono;
    });
    assert.equal(
      dono,
      EXECUTOR_ROLE,
      'extensão confiável é criável por não-superusuário: era esta a premissa errada do PAP-21',
    );

    const soExtensao = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(
      soExtensao.exitCode,
      0,
      `extensão sozinha não pode virar ruído: ${soExtensao.error}\n${soExtensao.output}`,
    );

    await withClient(executorUrl, async (client) => {
      await client.query(
        'CREATE VIEW public.v_isca AS ' +
          'SELECT order_id, total FROM t_hostil_um.orders UNION ALL ' +
          'SELECT order_id, total FROM t_hostil_dois.orders',
      );
    });
    const antes = await eventos(db.url, 'public_object_present');
    const nua = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(nua.exitCode, 3, nua.error);
    assert.match(nua.output, /fora do universo declarado: "public\.v_isca"/);

    // O estado hostil: a isca entra na extensão, que é o que devolvia o comando a `0`.
    await withClient(executorUrl, async (client) => {
      await client.query('ALTER EXTENSION pgcrypto ADD VIEW public.v_isca');
    });
    const escondida = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(escondida.exitCode, 3, `${escondida.error}\n${escondida.output}`);
    assert.match(
      escondida.output,
      /fora do universo declarado: "public\.v_isca".*referencia schema nosso/,
      'pendurar na extensão muda a dependência, não a posse nem a referência',
    );
    assert.equal(await eventos(db.url, 'public_object_present'), antes + 2);

    await withClient(executorUrl, async (client) => {
      await client.query('ALTER EXTENSION pgcrypto DROP VIEW public.v_isca');
      await client.query('DROP VIEW public.v_isca');
      await client.query('DROP EXTENSION pgcrypto');
    });
    await withClient(db.url, async (client) => {
      await client.query(`REVOKE USAGE, CREATE ON SCHEMA public FROM ${EXECUTOR_ROLE}`);
    });
    const limpo = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(limpo.exitCode, 0, `${limpo.error}\n${limpo.output}`);
  });

  /**
   * Caso 48. A pergunta que **não pôde ser feita** reprova.
   *
   * Sem `platform.role_declarations` não existe resposta para "quem alcança legitimamente", e o
   * desfecho honesto é `3` dizendo isso. É o `PAP-23` uma camada abaixo: lá a suíte ficava verde por
   * não ter rodado a camada, aqui o comando ficaria verde por não ter perguntado.
   */
  test('sem o registro de papéis, verify reprova dizendo que não perguntou', async (t: TestContext) => {
    if (semLogin !== undefined) return t.skip(semLogin);

    const antes = await eventos(db.url, 'role_declarations_missing');
    // `CASCADE` desde a `0014`: a retratação tem chave estrangeira para a declaração, e o que cai
    // junto é só essa restrição — a tabela de retratação continua de pé.
    await withClient(db.url, (client) =>
      client.query('DROP TABLE platform.role_declarations CASCADE'),
    );

    const reprovou = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(reprovou.exitCode, 3, reprovou.error);
    assert.match(reprovou.output, /pergunta não feita: platform\.role_declarations não existe/);
    assert.doesNotMatch(
      reprovou.output,
      /registra e não reprova: pergunta não feita/,
      'esta pergunta veta: a marca de "sem veto" não pode aparecer nela',
    );
    assert.equal(await eventos(db.url, 'role_declarations_missing'), antes + 1);

    // E `migrate` recusa antes de tocar em papel nenhum, com saída `2`: falta estrutura, não há o
    // que convergir.
    const recusou = await runExecutor({ kind: 'migrate' }, { url: executorUrl, migrationsDir });
    assert.equal(recusou.exitCode, 2, recusou.error);
    assert.match(recusou.error ?? '', /platform\.role_declarations não existe/);
  });
});

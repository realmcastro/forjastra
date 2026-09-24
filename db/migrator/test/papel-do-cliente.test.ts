import { test, describe, before, after, type TestContext } from 'node:test';
import assert from 'node:assert/strict';
import { runExecutor } from './support/executor.js';
import {
  APP_CREDENTIAL_ROLE,
  APP_GROUP_ROLE,
  citado,
  codigo,
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
 * Casos 32 a 39 de `CONTRATO.md` §14: o papel de banco do cliente
 * (`db/papel-do-cliente.md` §7), do ato que o cria à convergência que o retoma.
 *
 * **O executor aqui não é superusuário.** É o único arquivo da suíte em que ele não é, e é por isso
 * que ele existe separado: o ato da §7.3 depende de `CREATEROLE` e do `WITH ADMIN OPTION` que a §7.2
 * dá ao executor sobre o grupo, e superusuário atravessa os dois sem provar nada. Medido em
 * 2026-09-11: sem `ADMIN OPTION`, o `GRANT forja_app TO app_t_<slug>` leva
 * `permission denied to grant role` e a transação inteira cai.
 *
 * Nenhum papel deste arquivo tem senha, e o servidor de teste é descartável e de autenticação
 * `trust`: senha em teste é segredo no repositório (`00-nucleo.md` §8). Sem `trust`, o teste é
 * **pulado com motivo** — nunca dado como passado.
 */

const EXECUTOR_ROLE = 'forja_executor';

const PEDIDOS = tenantMigration(`
CREATE TABLE IF NOT EXISTS orders (
    order_id uuid NOT NULL,
    total numeric(14,2) NOT NULL,
    CONSTRAINT orders_pkey PRIMARY KEY (order_id)
);
`);

/** A migration que chega **depois** do `provision`: é ela que o privilégio padrão precisa cobrir. */
const PAGAMENTOS = tenantMigration(`
CREATE TABLE IF NOT EXISTS payments (
    payment_id uuid NOT NULL,
    amount numeric(14,2) NOT NULL,
    CONSTRAINT payments_pkey PRIMARY KEY (payment_id)
);
`);

describe('o papel de banco do cliente', { skip: skipWithoutPostgres }, () => {
  let db: DisposableDatabase;
  let executorUrl: string;
  let credencialUrl: string;
  let semLogin: string | undefined;

  const soPedidos = buildMigrationsDir({ tenant: [{ name: '0001__orders.sql', text: PEDIDOS }] });
  const comPagamentos = buildMigrationsDir({
    tenant: [
      { name: '0001__orders.sql', text: PEDIDOS },
      { name: '0002__payments.sql', text: PAGAMENTOS },
    ],
  });

  before(async () => {
    db = await createDatabase();
    executorUrl = comoPapel(db.url, EXECUTOR_ROLE);
    credencialUrl = comoPapel(db.url, APP_CREDENTIAL_ROLE);

    // §7.2, o ato do operador. `createDatabase` já garantiu o grupo e a credencial no cluster.
    await withClient(db.url, async (client) => {
      const existe = await client.query('select 1 from pg_roles where rolname = $1', [EXECUTOR_ROLE]);
      if (existe.rowCount === 0) {
        await client.query(await citado(client, 'CREATE ROLE %I LOGIN CREATEROLE', EXECUTOR_ROLE));
      }
      await client.query(
        await citado(client, `GRANT ${APP_GROUP_ROLE} TO %I WITH ADMIN OPTION`, EXECUTOR_ROLE),
      );
      await client.query(await citado(client, 'GRANT CREATE ON DATABASE %I TO ' + EXECUTOR_ROLE, db.name));
      await client.query('REVOKE USAGE, CREATE ON SCHEMA public FROM PUBLIC');
    });

    semLogin = await motivoDeNaoConectar(executorUrl, credencialUrl);
    if (semLogin !== undefined) return;

    for (const slug of ['acme', 'beta']) {
      const feito = await runExecutor({ kind: 'provision', slug }, { url: executorUrl, migrationsDir: soPedidos });
      assert.equal(feito.exitCode, 0, feito.error);
    }
  });

  after(async () => {
    await db.drop();
  });

  /**
   * Caso 32. O papel nasce sem `LOGIN`, no grupo, assumível pela credencial; a transação que o
   * assume lê o próprio schema e leva `permission denied` no schema de outro cliente e em
   * `platform`. **Fora de transação, sem assumir, a credencial também leva `permission denied`** —
   * é o `NOINHERIT` da §7.2, e é ele que faz o alcance existir só dentro da transação que o pediu.
   */
  test('o papel nasce sem LOGIN e alcança só o próprio schema', async (t: TestContext) => {
    if (semLogin !== undefined) return t.skip(semLogin);

    await withClient(db.url, async (client) => {
      const papel = await client.query<{
        rolcanlogin: boolean;
        rolinherit: boolean;
        rolsuper: boolean;
        rolcreaterole: boolean;
      }>(
        'select rolcanlogin, rolinherit, rolsuper, rolcreaterole from pg_roles where rolname = $1',
        ['app_t_acme'],
      );
      assert.deepEqual(papel.rows[0], {
        rolcanlogin: false,
        rolinherit: false,
        rolsuper: false,
        rolcreaterole: false,
      });

      const grupo = await client.query(
        `select 1 from pg_auth_members m
          where m.member = to_regrole('app_t_acme') and m.roleid = to_regrole($1)
            and not m.admin_option`,
        [APP_GROUP_ROLE],
      );
      assert.equal(grupo.rowCount, 1, 'o papel do cliente é membro do grupo, sem ADMIN OPTION');

      const assume = await client.query(
        `select 1 from pg_auth_members m
          where m.roleid = to_regrole('app_t_acme') and m.member = to_regrole($1)`,
        [APP_CREDENTIAL_ROLE],
      );
      assert.equal(assume.rowCount, 1, 'a credencial pode assumir o papel do cliente');
    });

    await withClient(credencialUrl, async (client) => {
      // Assumindo o papel: o próprio schema abre.
      await client.query('begin');
      await client.query('set local role app_t_acme');
      const proprio = await client.query('select count(*) from t_acme.orders');
      assert.equal(proprio.rowCount, 1);
      await client.query('rollback');

      for (const alheio of ['select 1 from t_beta.orders', 'select 1 from platform.tenants']) {
        await client.query('begin');
        await client.query('set local role app_t_acme');
        await assert.rejects(
          client.query(alheio),
          (erro: unknown) => codigo(erro) === '42501',
          `${alheio} tem que levar permission denied dentro do papel do cliente`,
        );
        await client.query('rollback');
      }

      // Sem assumir: NOINHERIT, e a credencial não carrega alcance nenhum por conta própria.
      await assert.rejects(
        client.query('select 1 from t_acme.orders'),
        (erro: unknown) => codigo(erro) === '42501',
        'a credencial sem assumir o papel não lê o schema de cliente nenhum',
      );
    });
  });

  /**
   * Caso 33. `provision` cujo passo 7 morre, e a convergência que o retoma **sem nada pendente** —
   * que é a única forma de o cliente não ficar quebrado para sempre com o comando dizendo "nada
   * pendente" (§7.4).
   */
  test('provision para no passo 7, e migrate --schema converge sem aplicar migration', async (t: TestContext) => {
    if (semLogin !== undefined) return t.skip(semLogin);

    // A mão de fora: o papel existe antes do provision, e provision não adota papel que não criou.
    await withClient(db.url, async (client) => {
      await client.query('create role app_t_gama nologin noinherit');
    });

    const parou = await runExecutor(
      { kind: 'provision', slug: 'gama' },
      { url: executorUrl, migrationsDir: soPedidos },
    );
    assert.equal(parou.exitCode, 3, parou.error);
    assert.match(parou.error ?? '', /app_t_gama/);
    assert.match(parou.error ?? '', /migrate --schema t_gama/);

    // O estado que a falha deixa é o mesmo de uma falha no passo 6: registrado, criado, aplicado.
    await withClient(db.url, async (client) => {
      const registro = await client.query('select 1 from platform.tenants where slug = $1', ['gama']);
      assert.equal(registro.rowCount, 1, 'o cliente fica registrado');
      const tabela = await client.query(
        `select 1 from pg_class c join pg_namespace n on n.oid = c.relnamespace
          where n.nspname = 't_gama' and c.relname = 'orders'`,
      );
      assert.equal(tabela.rowCount, 1, 'as migrations do passo 6 ficam aplicadas');
    });

    // verify acusa, e a saída é 3 — ao contrário da §13.4, que registra e não reprova.
    const acusou = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir: soPedidos });
    assert.equal(acusou.exitCode, 3, acusou.error);
    assert.match(acusou.output, /app_t_gama/);
    assert.equal(await eventos(db.url, 'tenant_role_divergent'), 2, 'um do provision, um do verify');

    // A mão humana desfaz o que ela fez, e a retomada é um comando só, sem nada pendente.
    await withClient(db.url, async (client) => {
      await client.query('drop role app_t_gama');
    });
    const semPendente = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir: soPedidos });
    assert.equal(semPendente.exitCode, 3, 'papel ausente também reprova');
    assert.ok((await eventos(db.url, 'tenant_role_missing')) >= 1);

    const convergiu = await runExecutor(
      { kind: 'migrate', schema: 't_gama' },
      { url: executorUrl, migrationsDir: soPedidos },
    );
    assert.equal(convergiu.exitCode, 0, convergiu.error);
    assert.match(convergiu.output, /criando o papel de banco "app_t_gama"/);
    assert.doesNotMatch(convergiu.output, /aplicando/, 'não havia migration pendente nenhuma');

    const limpo = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir: soPedidos });
    assert.equal(limpo.exitCode, 0, `${limpo.error}\n${limpo.output}`);
  });

  /**
   * Caso 34, as duas metades. A primeira é o que `ALTER DEFAULT PRIVILEGES` compra: a tabela criada
   * por uma migration **posterior** ao `provision` nasce legível, sem ato nenhum a mais — e a prova
   * de que foi ele, e não a convergência, é que a rodada não completou privilégio nenhum.
   *
   * A segunda metade reproduz o schema provisionado **sem** aquela linha desfazendo-a no catálogo:
   * o estado resultante é o mesmo, e é o defeito que só apareceria no release seguinte, no caixa,
   * como `permission denied for table` numa tabela que acabou de ser criada.
   */
  test('a tabela criada por migration posterior nasce legível, e a falta do privilégio padrão reprova', async (t: TestContext) => {
    if (semLogin !== undefined) return t.skip(semLogin);

    const aplicou = await runExecutor({ kind: 'migrate' }, { url: executorUrl, migrationsDir: comPagamentos });
    assert.equal(aplicou.exitCode, 0, aplicou.error);
    assert.match(aplicou.output, /t_acme: aplicando tenant\/0002__payments/);
    assert.doesNotMatch(
      aplicou.output,
      /completando o papel/,
      'se a convergência completou algo, quem deu alcance à tabela nova não foi o privilégio padrão',
    );

    await withClient(db.url, async (client) => {
      const alcance = await client.query<{ le: boolean }>(
        "select has_table_privilege('app_t_acme', 't_acme.payments', 'SELECT') as le",
      );
      assert.equal(alcance.rows[0]?.le, true, 'a tabela nova nasce legível para o papel do cliente');
    });

    // O schema sem a linha da §7.3: sem privilégio padrão e sem alcance à tabela que veio depois.
    await withClient(executorUrl, async (client) => {
      await client.query(
        'alter default privileges for role current_user in schema t_beta ' +
          'revoke select, insert, update on tables from app_t_beta',
      );
      await client.query('revoke select on t_beta.payments from app_t_beta');
    });

    await withClient(db.url, async (client) => {
      const ausente = await client.query(
        `select 1 from pg_default_acl d join pg_namespace n on n.oid = d.defaclnamespace
          where n.nspname = 't_beta' and d.defaclobjtype = 'r'`,
      );
      assert.equal(ausente.rowCount, 0, 'o privilégio padrão saiu do catálogo');
    });

    await withClient(credencialUrl, async (client) => {
      await client.query('begin');
      await client.query('set local role app_t_beta');
      await assert.rejects(
        client.query('select 1 from t_beta.payments'),
        (erro: unknown) => codigo(erro) === '42501',
        'é este o permission denied que o caixa veria no release seguinte',
      );
      await client.query('rollback');
    });

    const antesIncompleto = await eventos(db.url, 'tenant_role_incomplete');
    const antesPadrao = await eventos(db.url, 'tenant_role_default_acl_absent');
    const antesDivergente = await eventos(db.url, 'tenant_role_divergent');
    const reprovou = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir: comPagamentos });
    assert.equal(reprovou.exitCode, 3, reprovou.error);
    assert.match(reprovou.output, /app_t_beta/);
    assert.match(reprovou.output, /privilégio padrão/);
    // Quem reprova é o SELECT que falta, que independe de quem pergunta; o privilégio padrão sai
    // junto, como sinal próprio, sem tocar na saída. E o código é o que manda convergir, não o que
    // manda investigar (`PAP-10`).
    assert.match(reprovou.output, /SELECT em tabela ou view do schema/);
    assert.match(reprovou.output, /migrate --schema t_beta/);
    assert.equal(await eventos(db.url, 'tenant_role_incomplete'), antesIncompleto + 1);
    assert.equal(await eventos(db.url, 'tenant_role_default_acl_absent'), antesPadrao + 1);
    assert.equal(
      await eventos(db.url, 'tenant_role_divergent'),
      antesDivergente,
      'estado que migrate conserta não sai com o código que manda investigar',
    );

    // A convergência conserta **só o que falta**, e sem criar papel nenhum.
    const consertou = await runExecutor(
      { kind: 'migrate', schema: 't_beta' },
      { url: executorUrl, migrationsDir: comPagamentos },
    );
    assert.equal(consertou.exitCode, 0, consertou.error);
    assert.match(consertou.output, /completando o papel de banco/);

    const limpo = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir: comPagamentos });
    assert.equal(limpo.exitCode, 0, `${limpo.error}\n${limpo.output}`);
  });

  /**
   * Caso 36, o `PAP-01`, **com a concessão emitida pelo próprio executor**. Todo o arranjo da §6.2
   * depende de a credencial **não herdar** o papel do cliente: é isso, e só isso, que o separa da
   * prova C — um papel de aplicação para todos, com o vazamento concluindo a venda com sucesso.
   *
   * A herança é propriedade da **concessão** (`pg_auth_members.inherit_option`), não do papel, e é
   * por isso que o estado passava por `conforme`: `atributo_indevido` lê `rolinherit`, e a credencial
   * continua `NOINHERIT` o tempo todo. Os dois sentidos estão aqui — com a concessão herdável a
   * credencial nua lê o cliente, e depois da convergência a mesma leitura leva `permission denied`.
   *
   * **O ator é o executor, e agora o comentário diz isso.** Até o sexto gate ele afirmava reproduzir
   * "o que um operador escreve ao consertar na mão" e emitia a linha pela conexão do executor: a
   * reprodução foi feita pela conexão que estava à mão, e não pelo ator do cenário — que é
   * justamente quem decide o desfecho. O ator operador tem caso próprio, o `PAP-13`, em
   * `alcance-e-concedente.test.ts`, e lá o desfecho é recusa, não convergência.
   */
  test('credencial que herda o papel por concessão do executor: a convergência corta isso', async (t: TestContext) => {
    if (semLogin !== undefined) return t.skip(semLogin);

    await withClient(executorUrl, async (client) => {
      await client.query(`GRANT app_t_acme TO ${APP_CREDENTIAL_ROLE} WITH INHERIT TRUE`);
    });
    assert.deepEqual(
      await concedentesQueHerdam('app_t_acme'),
      [EXECUTOR_ROLE],
      'a herança é de um concedente só, e é o executor: é isso que torna o caso convergível',
    );

    await withClient(credencialUrl, async (client) => {
      const vazou = await client.query('select count(*) from t_acme.orders');
      assert.equal(vazou.rowCount, 1, 'com a concessão herdável, a credencial nua lê o cliente');
    });

    const antes = await eventos(db.url, 'tenant_role_incomplete');
    const acusou = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir: comPagamentos });
    assert.equal(acusou.exitCode, 3, acusou.error);
    assert.match(acusou.output, /app_t_acme: falta a opção da concessão/);
    assert.match(acusou.output, /migrate --schema t_acme/);
    assert.equal(await eventos(db.url, 'tenant_role_incomplete'), antes + 1);

    // Reemitir a linha da §7.3 corrige a concessão no lugar, sem `REVOKE`: é por isso que este caso
    // converge em vez de parar a rodada, mesmo sendo excesso de privilégio.
    const convergiu = await runExecutor(
      { kind: 'migrate', schema: 't_acme' },
      { url: executorUrl, migrationsDir: comPagamentos },
    );
    assert.equal(convergiu.exitCode, 0, convergiu.error);
    assert.equal(await herda('app_t_acme'), false);

    await withClient(credencialUrl, async (client) => {
      await assert.rejects(
        client.query('select 1 from t_acme.orders'),
        (erro: unknown) => codigo(erro) === '42501',
        'depois da convergência a credencial nua não alcança mais o schema do cliente',
      );

      // `SET TRUE` não foi junto: assumir o papel dentro da transação continua funcionando.
      await client.query('begin');
      await client.query('set local role app_t_acme');
      assert.equal((await client.query('select count(*) from t_acme.orders')).rowCount, 1);
      await client.query('rollback');
    });

    const limpo = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir: comPagamentos });
    assert.equal(limpo.exitCode, 0, `${limpo.error}\n${limpo.output}`);
  });

  /**
   * Caso 37, o `PAP-06`. O privilégio padrão ausente **sozinho** não reprova: a coluna responde sobre
   * `current_user`, não sobre o banco, e ligá-la à saída `3` faria o `verify` de um operador acusar a
   * frota inteira de adulteração. Ele continua sendo parte a convergir no `migrate`.
   */
  test('privilégio padrão ausente sozinho: linha nomeada, evento, e saída inalterada', async (t: TestContext) => {
    if (semLogin !== undefined) return t.skip(semLogin);

    await withClient(executorUrl, async (client) => {
      await client.query(
        'alter default privileges for role current_user in schema t_acme ' +
          'revoke select, insert, update on tables from app_t_acme',
      );
    });

    const antes = await eventos(db.url, 'tenant_role_default_acl_absent');
    const registrou = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir: comPagamentos });
    assert.equal(registrou.exitCode, 0, `${registrou.error}\n${registrou.output}`);
    assert.match(registrou.output, /app_t_acme: falta o privilégio padrão/);
    assert.equal(await eventos(db.url, 'tenant_role_default_acl_absent'), antes + 1);

    const convergiu = await runExecutor(
      { kind: 'migrate', schema: 't_acme' },
      { url: executorUrl, migrationsDir: comPagamentos },
    );
    assert.equal(convergiu.exitCode, 0, convergiu.error);
    assert.match(convergiu.output, /completando o papel de banco/);

    const limpo = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir: comPagamentos });
    assert.equal(limpo.exitCode, 0, `${limpo.error}\n${limpo.output}`);
    assert.doesNotMatch(limpo.output, /privilégio padrão/);
  });

  /**
   * Caso 38, o `PAP-02` e a §7.5.1. Quatro estados medidos no quinto gate que a pergunta da §7.5
   * respondia como `conforme`, e os quatro dão leitura do dado de um cliente a quem não deveria
   * tê-la. **Zero linha no banco íntegro** é metade do teste; a outra é cada adulteração aparecendo,
   * e só ela.
   */
  test('quem alcança o schema do cliente: PUBLIC, papel de outro cliente, papel de fora e membro', async (t: TestContext) => {
    if (semLogin !== undefined) return t.skip(semLogin);

    const integro = await alcancesDoVerify();
    assert.equal(integro.exitCode, 0, `${integro.erro}`);
    assert.deepEqual(integro.linhas, [], 'banco íntegro não devolve alcance nenhum');

    const intruso = 'forja_intruso_t0009';
    await withClient(executorUrl, async (client) => {
      await client.query(`CREATE ROLE ${intruso} LOGIN`);
    });

    try {
      const estados = [
        {
          nome: 'PUBLIC com USAGE no schema',
          adultera: 'GRANT USAGE ON SCHEMA t_acme TO PUBLIC',
          desfaz: 'REVOKE USAGE ON SCHEMA t_acme FROM PUBLIC',
          linha: 'alcance ao schema "t_acme": PUBLIC tem USAGE no schema',
        },
        {
          nome: 'o papel de um cliente alcançando o schema do outro',
          adultera: 'GRANT USAGE ON SCHEMA t_beta TO app_t_acme',
          desfaz: 'REVOKE USAGE ON SCHEMA t_beta FROM app_t_acme',
          linha: 'alcance ao schema "t_beta": app_t_acme tem USAGE no schema',
        },
        {
          nome: 'papel LOGIN fora do prefixo com USAGE no schema',
          adultera: `GRANT USAGE ON SCHEMA t_acme TO ${intruso}`,
          desfaz: `REVOKE USAGE ON SCHEMA t_acme FROM ${intruso}`,
          linha: `alcance ao schema "t_acme": ${intruso} tem USAGE no schema`,
        },
        {
          nome: 'papel feito membro do papel do cliente',
          adultera: `GRANT app_t_acme TO ${intruso}`,
          desfaz: `REVOKE app_t_acme FROM ${intruso}`,
          // A linha nomeia o que a concessão carrega, e `GRANT` sem opção nasce herdável quando o
          // beneficiário não é `NOINHERIT` — que é o caso deste intruso, e é como ele lê o cliente
          // sem assumir papel nenhum. O detalhe descreve; quem decide a acusação é a ausência do
          // nome em platform.role_declarations (§7.5.1).
          linha: `alcance ao schema "t_acme": ${intruso} é membro do papel do cliente, com herança`,
        },
      ];

      for (const estado of estados) {
        const antes = await eventos(db.url, 'tenant_schema_foreign_grant');
        await withClient(executorUrl, async (client) => {
          await client.query(estado.adultera);
        });

        const acusou = await alcancesDoVerify();
        assert.equal(acusou.exitCode, 3, `${estado.nome}: ${acusou.erro}`);
        assert.deepEqual(acusou.linhas, [estado.linha], estado.nome);
        assert.equal(await eventos(db.url, 'tenant_schema_foreign_grant'), antes + 1, estado.nome);

        await withClient(executorUrl, async (client) => {
          await client.query(estado.desfaz);
        });
        const limpo = await alcancesDoVerify();
        assert.equal(limpo.exitCode, 0, `${estado.nome}, desfeito: ${limpo.erro}`);
        assert.deepEqual(limpo.linhas, [], `${estado.nome}: desfazer tem que zerar a pergunta`);
      }

      /**
       * A convergência para pelo mesmo motivo, e **antes de conceder**: retirar alcance de terceiro
       * é `REVOKE`, que o ato da §7.3 não tem, e adotá-lo em silêncio seria herdar alcance que
       * ninguém declarou.
       */
      await withClient(executorUrl, async (client) => {
        await client.query('GRANT USAGE ON SCHEMA t_acme TO PUBLIC');
      });
      const parou = await runExecutor(
        { kind: 'migrate', schema: 't_acme' },
        { url: executorUrl, migrationsDir: comPagamentos },
      );
      assert.equal(parou.exitCode, 3, parou.error);
      assert.match(parou.error ?? '', /alcança o schema "t_acme"/);
      await withClient(executorUrl, async (client) => {
        await client.query('REVOKE USAGE ON SCHEMA t_acme FROM PUBLIC');
      });
    } finally {
      await withClient(executorUrl, async (client) => {
        await client.query(`DROP ROLE IF EXISTS ${intruso}`);
      });
    }
  });

  /**
   * Caso 39, a §7.5.2. Os dois `REVOKE` do ato do operador não são aplicados por nada versionado,
   * então eles **registram e não reprovam**: o mesmo corte da §13.4. O `before` deste arquivo revoga
   * o schema `public` e não revoga o `TEMPORARY`, que é o estado em que o banco nasce.
   */
  test('o que o ato do operador deixou de fazer: linha nomeada, evento, e saída inalterada', async (t: TestContext) => {
    if (semLogin !== undefined) return t.skip(semLogin);

    const antes = await eventos(db.url, 'public_grant_present');
    const comTemp = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir: comPagamentos });
    assert.equal(comTemp.exitCode, 0, `${comTemp.error}\n${comTemp.output}`);
    assert.match(comTemp.output, /PUBLIC ainda tem TEMPORARY neste banco/);
    assert.doesNotMatch(comTemp.output, /PUBLIC ainda alcança o schema public/);
    assert.equal(await eventos(db.url, 'public_grant_present'), antes + 1);

    // O ato do operador completo: a pergunta para de achar as duas.
    await withClient(db.url, async (client) => {
      await client.query(await citado(client, 'REVOKE TEMPORARY ON DATABASE %I FROM PUBLIC', db.name));
    });
    const completo = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir: comPagamentos });
    assert.equal(completo.exitCode, 0, `${completo.error}\n${completo.output}`);
    assert.doesNotMatch(completo.output, /ato do operador pendente/);

    // E o `USAGE` devolvido ao `public` reaparece como linha, ainda sem mudar a saída.
    await withClient(db.url, async (client) => {
      await client.query('GRANT USAGE ON SCHEMA public TO PUBLIC');
    });
    const devolta = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir: comPagamentos });
    assert.equal(devolta.exitCode, 0, `${devolta.error}\n${devolta.output}`);
    assert.match(devolta.output, /PUBLIC ainda alcança o schema public/);
    await withClient(db.url, async (client) => {
      await client.query('REVOKE USAGE ON SCHEMA public FROM PUBLIC');
    });
  });

  /**
   * A opção da concessão da §7.3, lida no catálogo: é ela, e não `rolinherit`, que manda em 16.
   *
   * **Conta linhas, não lê a primeira.** A chave de `pg_auth_members` é `(roleid, member, grantor)`,
   * então esta consulta pode devolver mais de uma linha — e a versão anterior lia
   * `rows[0]?.inherit_option`, que responde pela linha que vier primeiro. Medido no sexto gate: com
   * dois concedentes, uma asserção assim aprova o estado que a outra linha nega. Quem quiser saber
   * **de quem** é a herança usa `concedentesQueHerdam`.
   */
  async function herda(papel: string): Promise<boolean> {
    return (await concedentesQueHerdam(papel)).length > 0;
  }

  /** Os concedentes de uma concessão herdável do papel à credencial, em ordem. */
  async function concedentesQueHerdam(papel: string): Promise<readonly string[]> {
    return withClient(db.url, async (client) => {
      const linhas = await client.query<{ concedente: string }>(
        `select m.grantor::regrole::text as concedente from pg_auth_members m
          where m.roleid = to_regrole($1) and m.member = to_regrole($2) and m.inherit_option
          order by 1`,
        [papel, APP_CREDENTIAL_ROLE],
      );
      return linhas.rows.map((linha) => linha.concedente);
    });
  }

  async function alcancesDoVerify(): Promise<{
    exitCode: number;
    linhas: readonly string[];
    erro: string | undefined;
  }> {
    const resultado = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir: comPagamentos });
    return {
      exitCode: resultado.exitCode,
      linhas: resultado.output.split('\n').filter((linha) => linha.startsWith('alcance ao schema')),
      erro: resultado.error,
    };
  }

  /** §7.1: a chave do ambiente é obrigatória nos três comandos que criam ou conferem papel. */
  test('sem o nome da credencial no ambiente, provision, migrate e verify recusam com saída 2', async () => {
    for (const comando of [
      { kind: 'migrate' } as const,
      { kind: 'verify' } as const,
      { kind: 'provision', slug: 'delta' } as const,
    ]) {
      const resultado = await runExecutor(comando, {
        url: db.url,
        migrationsDir: soPedidos,
        appCredentialRole: null,
      });
      assert.equal(resultado.exitCode, 2, `${comando.kind}: ${resultado.error}`);
      assert.match(resultado.error ?? '', /FORJA_MIGRATOR_APP_CREDENTIAL_ROLE/);
    }

    // `status` não a exige, porque não escreve nada.
    const relato = await runExecutor(
      { kind: 'status' },
      { url: db.url, migrationsDir: soPedidos, appCredentialRole: null },
    );
    assert.equal(relato.exitCode, 0, relato.error);
  });

  /** §7.1: o prefixo `app_` é reservado, e a credencial não pode usá-lo. */
  test('credencial com o prefixo reservado é recusada antes de qualquer conexão', async () => {
    const resultado = await runExecutor(
      { kind: 'migrate' },
      { url: db.url, migrationsDir: soPedidos, appCredentialRole: 'app_qualquer' },
    );
    assert.equal(resultado.exitCode, 2, resultado.error);
    assert.match(resultado.error ?? '', /prefixo "app_" é/);
  });
});

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
 * Casos 55 a 58 de `CONTRATO.md` §14, e o `PAP-26`: **um caso por motivo de `divergente`.**
 *
 * O gate da declaração mediu isto por mutação no `dist`, sem recompilar: trocar `atributo_indevido`
 * por `false` deixava a suíte inteira em `95 pass · 0 fail`, saída `0`; silenciar de uma vez
 * `atributo_indevido`, `create_indevido`, `usage_em_platform` e `heranca_de_outra_credencial` dava o
 * mesmo resultado. Os cinco predicados que o sétimo gate escreveu tinham prova; os quatro que ele
 * **herdou**, não — e esta camada reabriu oito vezes, com sete das oito correções reescrevendo uma
 * consulta desta mesma família.
 *
 * **A régua é a do caso 45, e o sujeito hostil é o que a §7.5 desculpa em regime normal**: o papel do
 * cliente, que só é legítimo enquanto tiver exatamente o alcance que o ato lhe deu. Em cada caso ele
 * faz a pior coisa que aquele privilégio a mais permite, e o teste mede o dano **antes** de cobrar a
 * acusação — a linha sozinha provaria a mensagem, não a propriedade. No caso 57 quem exerce o dano é
 * a credencial declarada, que é o excluído legítimo da §7.5.1: é ela quem assume o papel e lê a
 * carteira de todos os clientes.
 */

const EXECUTOR_ROLE = 'forja_executor';
/** A segunda credencial declarada do caso 57. Nasce pela mão do **operador** (§7.2). */
const CREDENCIAL_DOIS = 'forja_credencial_dois_t0009';

const PAPEIS_DA_SONDA = [CREDENCIAL_DOIS];

const PEDIDOS = tenantMigration(`
CREATE TABLE IF NOT EXISTS orders (
    order_id uuid NOT NULL,
    total numeric(14,2) NOT NULL,
    CONSTRAINT orders_pkey PRIMARY KEY (order_id)
);
`);

describe('os motivos de divergência do papel do cliente', { skip: skipWithoutPostgres }, () => {
  let db: DisposableDatabase;
  let executorUrl: string;
  let credencialUrl: string;
  let semLogin: string | undefined;

  const migrationsDir = buildMigrationsDir({ tenant: [{ name: '0001__orders.sql', text: PEDIDOS }] });
  before(async () => {
    db = await createDatabase();
    executorUrl = comoPapel(db.url, EXECUTOR_ROLE);
    credencialUrl = comoPapel(db.url, APP_CREDENTIAL_ROLE);

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
      await client.query(await citado(client, 'CREATE ROLE %I LOGIN NOINHERIT', CREDENCIAL_DOIS));
      await client.query(await citado(client, `GRANT ${APP_GROUP_ROLE} TO %I`, CREDENCIAL_DOIS));
    });

    semLogin = await motivoDeNaoConectar(executorUrl, credencialUrl);
    if (semLogin !== undefined) return;

    for (const slug of ['motivo_um', 'motivo_dois']) {
      const feito = await runExecutor({ kind: 'provision', slug }, { url: executorUrl, migrationsDir });
      assert.equal(feito.exitCode, 0, feito.error);
    }
    await withClient(db.url, async (client) => {
      for (const schema of ['t_motivo_um', 't_motivo_dois']) {
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
   * Caso 55, `atributo_indevido`. O papel do cliente com `LOGIN` é uma **porta de entrada própria**:
   * num cluster de autenticação sem senha para papel sem senha — que é o deste teste e o de qualquer
   * máquina de desenvolvimento com `trust` —, alguém conecta **como o papel do cliente** e lê o
   * schema dele sem passar pela credencial, sem assumir papel nenhum e sem estar em grupo nenhum.
   */
  test('papel do cliente com LOGIN: conecta sozinho, e o verify acusa', async (t: TestContext) => {
    if (semLogin !== undefined) return t.skip(semLogin);

    await withClient(db.url, (client) => client.query('ALTER ROLE app_t_motivo_um LOGIN'));

    await withClient(comoPapel(db.url, 'app_t_motivo_um'), async (client) => {
      const leu = await client.query('select count(*) from t_motivo_um.orders');
      assert.equal(leu.rowCount, 1, 'com LOGIN, o papel do cliente é uma conexão por si');
    });

    const antes = await eventos(db.url, 'tenant_role_divergent');
    const acusou = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(acusou.exitCode, 3, `${acusou.error}\n${acusou.output}`);
    assert.match(
      acusou.output,
      /papel de banco: app_t_motivo_um: tem LOGIN ou outro atributo que o ato da §7\.3 não concede/,
    );
    assert.equal(await eventos(db.url, 'tenant_role_divergent'), antes + 1);

    // E `migrate` não adota: papel mexido à mão carrega privilégio que ninguém declarou.
    const recusou = await runExecutor(
      { kind: 'migrate', schema: 't_motivo_um' },
      { url: executorUrl, migrationsDir },
    );
    assert.equal(recusou.exitCode, 3, recusou.error);

    await withClient(db.url, (client) => client.query('ALTER ROLE app_t_motivo_um NOLOGIN'));
    const limpo = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(limpo.exitCode, 0, `${limpo.error}\n${limpo.output}`);
  });

  /**
   * Caso 56, `create_indevido`. Com `CREATE` no próprio schema, o papel do cliente **planta objeto**
   * ali: a aplicação passa a poder criar tabela que migration nenhuma conhece, e a comparação
   * estrutural do `verify` passa a divergir por um objeto que não veio do conjunto. Excesso de
   * privilégio não se conserta concedendo, então o caso cai no lado que para (§7.4).
   */
  test('papel do cliente com CREATE no próprio schema: planta objeto, e o verify acusa', async (t: TestContext) => {
    if (semLogin !== undefined) return t.skip(semLogin);

    await withClient(db.url, (client) =>
      client.query('GRANT CREATE ON SCHEMA t_motivo_um TO app_t_motivo_um'),
    );

    await withClient(credencialUrl, async (client) => {
      await client.query('begin');
      await client.query('set role app_t_motivo_um');
      await client.query('create table t_motivo_um.isca (id int)');
      await client.query('commit');
    });

    const antes = await eventos(db.url, 'tenant_role_divergent');
    const acusou = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(acusou.exitCode, 3, `${acusou.error}\n${acusou.output}`);
    assert.match(acusou.output, /papel de banco: app_t_motivo_um: tem CREATE no próprio schema/);
    assert.equal(await eventos(db.url, 'tenant_role_divergent'), antes + 1);

    await withClient(db.url, async (client) => {
      await client.query('drop table t_motivo_um.isca');
      await client.query('REVOKE CREATE ON SCHEMA t_motivo_um FROM app_t_motivo_um');
    });
    const limpo = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(limpo.exitCode, 0, `${limpo.error}\n${limpo.output}`);
  });

  /**
   * Caso 57, `usage_em_platform`, e é o estado que o gate mediu como o mais caro dos quatro: com
   * `USAGE` em `platform`, **a credencial declarada assume o papel de um cliente e lê a carteira de
   * todos os clientes** — `platform.tenants` é o registro da frota inteira.
   *
   * O sujeito hostil aqui é o excluído legítimo da §7.5.1, e de propósito: nenhuma pergunta de
   * alcance olha para ele, porque ele é declarado. Quem pega este estado é a §7.5, e era ela que
   * estava sem prova.
   */
  test('papel do cliente com USAGE em platform: a credencial lê a carteira, e o verify acusa', async (t: TestContext) => {
    if (semLogin !== undefined) return t.skip(semLogin);

    await withClient(db.url, async (client) => {
      await client.query('GRANT USAGE ON SCHEMA platform TO app_t_motivo_um');
      await client.query('GRANT SELECT ON platform.tenants TO app_t_motivo_um');
    });

    await withClient(credencialUrl, async (client) => {
      await client.query('begin');
      await client.query('set role app_t_motivo_um');
      const carteira = await client.query<{ slug: string }>(
        'select slug from platform.tenants order by slug',
      );
      await client.query('commit');
      assert.deepEqual(
        carteira.rows.map((linha) => linha.slug),
        ['motivo_dois', 'motivo_um'],
        'o papel de um cliente passou a enxergar a carteira inteira',
      );
    });

    const antes = await eventos(db.url, 'tenant_role_divergent');
    const acusou = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(acusou.exitCode, 3, `${acusou.error}\n${acusou.output}`);
    assert.match(acusou.output, /papel de banco: app_t_motivo_um: tem USAGE em platform/);
    assert.equal(await eventos(db.url, 'tenant_role_divergent'), antes + 1);

    await withClient(db.url, async (client) => {
      await client.query('REVOKE SELECT ON platform.tenants FROM app_t_motivo_um');
      await client.query('REVOKE USAGE ON SCHEMA platform FROM app_t_motivo_um');
    });
    const limpo = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(limpo.exitCode, 0, `${limpo.error}\n${limpo.output}`);
  });

  /**
   * Caso 58, `heranca_de_outra_credencial`. Uma **segunda credencial declarada** — a janela de rotação
   * da §7.7, que é estado legítimo — recebe do **próprio executor** a concessão herdável, e passa a
   * ler todo cliente **sem assumir papel nenhum**.
   *
   * Por que ele não converge, e é o `PAP-13` de novo: o ato só emite para **um** nome, o do ambiente.
   * Tratar isto como falta faria a rodada dizer "completando o papel de banco" e sair `0` com a
   * herança de pé. A saída documentada é rodar `migrate` com o ambiente apontando para ela, e é
   * exatamente o que este caso mede na volta.
   */
  test('herança de outra credencial declarada: recusa, e converge com o ambiente apontando para ela', async (t: TestContext) => {
    if (semLogin !== undefined) return t.skip(semLogin);

    const rotacao = await runExecutor(
      { kind: 'migrate' },
      { url: executorUrl, migrationsDir, appCredentialRole: CREDENCIAL_DOIS },
    );
    assert.equal(rotacao.exitCode, 0, `${rotacao.error}\n${rotacao.output}`);

    await withClient(executorUrl, (client) =>
      client.query(`GRANT app_t_motivo_um TO ${CREDENCIAL_DOIS} WITH INHERIT TRUE`),
    );
    await withClient(comoPapel(db.url, CREDENCIAL_DOIS), async (client) => {
      const leu = await client.query('select count(*) from t_motivo_um.orders');
      assert.equal(leu.rowCount, 1, 'com a concessão herdável, a credencial lê o cliente nua');
    });

    const antes = await eventos(db.url, 'tenant_role_divergent');
    const acusou = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(acusou.exitCode, 3, `${acusou.error}\n${acusou.output}`);
    assert.match(
      acusou.output,
      new RegExp(
        `papel de banco: app_t_motivo_um: é herdado por "${CREDENCIAL_DOIS}", que é credencial ` +
          'declarada e não é a que o ambiente nomeia',
      ),
    );
    assert.equal(await eventos(db.url, 'tenant_role_divergent'), antes + 1);

    // Rodar `migrate` com o ambiente nomeando a outra credencial corrige no lugar, sem `REVOKE`.
    const convergiu = await runExecutor(
      { kind: 'migrate', schema: 't_motivo_um' },
      { url: executorUrl, migrationsDir, appCredentialRole: CREDENCIAL_DOIS },
    );
    assert.equal(convergiu.exitCode, 0, `${convergiu.error}\n${convergiu.output}`);
    await withClient(comoPapel(db.url, CREDENCIAL_DOIS), async (client) => {
      await assert.rejects(
        () => client.query('select count(*) from t_motivo_um.orders'),
        /permission denied/,
        'a reemissão da linha da §7.3 muda inherit_option para f, e a leitura nua volta a ser negada',
      );
    });

    const limpo = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(limpo.exitCode, 0, `${limpo.error}\n${limpo.output}`);
  });
});

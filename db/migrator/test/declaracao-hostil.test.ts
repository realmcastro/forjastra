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
 * Casos 51 a 54 de `CONTRATO.md` §14: o gate da declaração
 * (`docs/auditorias/2026-09-12-gate-da-declaracao-camada-de-papel.md`, `PAP-24`, `PAP-25`, `PAP-27`).
 *
 * **A régua deste arquivo é a do gate anterior, levada um passo adiante.** Lá, o estado hostil era o
 * **excluído** fazendo a pior coisa que o privilégio dele permite — e o caso 45 o fez com o sósia e
 * com a ponte, que são papéis **não declarados**. O gate mediu o que faltava: o excluído do mecanismo
 * novo é o par `{executor declarado, credencial declarada}`, e nenhum dos dois era posto em estado
 * hostil em lugar nenhum. É exatamente ali que o `PAP-24` morava.
 *
 * Então aqui o sujeito hostil é sempre o **excluído legítimo**: a credencial declarada com um membro
 * pendurado nela (caso 51), a declaração escrita fora do ato dando posse de schema a um papel de fora (caso 52,
 * com a saída no caso 53), e o arranjo que ainda não foi declarado (caso 54).
 *
 * **O executor aqui não é superusuário**, e é ele quem emite o que o cenário medido diz que ele
 * emite. Sem `trust`, o arquivo é **pulado com motivo** — e `piso-de-medicao.test.ts` é quem impede
 * que esse pulo passe por suíte verde.
 */

const EXECUTOR_ROLE = 'forja_executor';
/** `LOGIN` fora de tudo: quem recebe a membership no papel declarado (`PAP-24`). */
const INTRUSO = 'forja_intruso_t0009';
/** O nome que o `INSERT` cru declara como executor (`PAP-25`). */
const PLANTADO = 'forja_plantado_t0009';
/** A credencial que o operador cria para provar a adoção de linha plantada. */
const CREDENCIAL_NOVA = 'forja_credencial_nova_t0009';

const PAPEIS_DA_SONDA = [INTRUSO, PLANTADO, CREDENCIAL_NOVA];

const PEDIDOS = tenantMigration(`
CREATE TABLE IF NOT EXISTS orders (
    order_id uuid NOT NULL,
    total numeric(14,2) NOT NULL,
    CONSTRAINT orders_pkey PRIMARY KEY (order_id)
);
`);

describe('a declaração provada com o excluído legítimo em estado hostil', { skip: skipWithoutPostgres }, () => {
  let db: DisposableDatabase;
  let executorUrl: string;
  let semLogin: string | undefined;

  const migrationsDir = buildMigrationsDir({ tenant: [{ name: '0001__orders.sql', text: PEDIDOS }] });
  before(async () => {
    db = await createDatabase();
    executorUrl = comoPapel(db.url, EXECUTOR_ROLE);

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
      /**
       * Os três nascem pela mão do **operador**, e não é detalhe: em 16, `CREATE ROLE` emitido por um
       * `CREATEROLE` não-superusuário concede o papel novo ao criador com `ADMIN OPTION`, o que é
       * membership em papel — e é justamente o que o caso 51 afirma que não existe no arranjo.
       */
      await client.query(await citado(client, 'CREATE ROLE %I LOGIN', INTRUSO));
      await client.query(await citado(client, 'CREATE ROLE %I LOGIN NOINHERIT', CREDENCIAL_NOVA));
      await client.query(await citado(client, `GRANT ${APP_GROUP_ROLE} TO %I`, CREDENCIAL_NOVA));
    });

    semLogin = await motivoDeNaoConectar(executorUrl, comoPapel(db.url, APP_CREDENTIAL_ROLE));
    if (semLogin !== undefined) return;

    for (const slug of ['declara_um', 'declara_dois']) {
      const feito = await runExecutor({ kind: 'provision', slug }, { url: executorUrl, migrationsDir });
      assert.equal(feito.exitCode, 0, feito.error);
    }
    await withClient(db.url, async (client) => {
      for (const schema of ['t_declara_um', 't_declara_dois']) {
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
   * Caso 51, o `PAP-24`. **O excluído legítimo em estado hostil é a credencial declarada com um
   * membro pendurado nela**, e o estado sai de dois comandos na conexão que o operador já tem aberta:
   *
   * ```
   * CREATE ROLE forja_intruso LOGIN;
   * GRANT forja_credencial TO forja_intruso;
   * ```
   *
   * Medido em 2026-09-12, PostgreSQL 16.15: o intruso faz `SET ROLE forja_credencial; SET ROLE
   * app_t_<slug>` e lê os dois clientes, e antes desta pergunta `verify` saía `0`, `migrate` saía `0`
   * e **nenhuma linha** citava o nome dele. A §7.5.1 responde "quem é membro de `app_t_<slug>`" com
   * `forja_credencial`, que está declarada e some; ninguém perguntava quem é membro dela.
   *
   * O mesmo vale para o executor, e aí é pior: quem o assume é dono de `platform` e de todo schema.
   * As duas metades estão aqui, e a contraprova também — desfeito o `GRANT`, a saída volta a `0`.
   */
  test('membro de papel declarado é acusado, na credencial e no executor', async (t: TestContext) => {
    if (semLogin !== undefined) return t.skip(semLogin);

    await withClient(db.url, (client) => client.query(`GRANT ${APP_CREDENTIAL_ROLE} TO ${INTRUSO}`));

    await withClient(comoPapel(db.url, INTRUSO), async (client) => {
      for (const schema of ['t_declara_um', 't_declara_dois']) {
        await client.query(`set role ${APP_CREDENTIAL_ROLE}`);
        await client.query(`set role app_${schema}`);
        const leu = await client.query(`select count(*) from ${schema}.orders`);
        assert.equal(leu.rowCount, 1, `o intruso lê ${schema} pela credencial declarada`);
        await client.query('reset role');
      }
    });

    const antes = await eventos(db.url, 'declared_role_member');
    const acusou = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(acusou.exitCode, 3, `${acusou.error}\n${acusou.output}`);
    assert.match(
      acusou.output,
      new RegExp(
        `membro de papel declarado: "${INTRUSO}" é membro de "${APP_CREDENTIAL_ROLE}", que é papel declarado`,
      ),
    );
    assert.doesNotMatch(
      acusou.output,
      /registra e não reprova: membro de papel declarado/,
      'esta pergunta veta: a marca de "sem veto" não pode aparecer nela',
    );
    assert.equal(await eventos(db.url, 'declared_role_member'), antes + 1);

    // E a convergência para **antes de conceder**: conceder agora entregaria o papel ao membro junto.
    const recusou = await runExecutor(
      { kind: 'migrate', schema: 't_declara_um' },
      { url: executorUrl, migrationsDir },
    );
    assert.equal(recusou.exitCode, 3, recusou.error);
    assert.match(recusou.error ?? '', /há membro de papel declarado neste cluster/);

    await withClient(db.url, (client) =>
      client.query(`REVOKE ${APP_CREDENTIAL_ROLE} FROM ${INTRUSO}`),
    );
    const semIntruso = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(semIntruso.exitCode, 0, `${semIntruso.error}\n${semIntruso.output}`);

    // A outra metade: o executor declarado, que é dono de platform e de todo schema de cliente.
    await withClient(db.url, (client) => client.query(`GRANT ${EXECUTOR_ROLE} TO ${INTRUSO}`));
    const acusouExecutor = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(acusouExecutor.exitCode, 3, `${acusouExecutor.error}\n${acusouExecutor.output}`);
    assert.match(
      acusouExecutor.output,
      new RegExp(`membro de papel declarado: "${INTRUSO}" é membro de "${EXECUTOR_ROLE}"`),
    );

    await withClient(db.url, (client) => client.query(`REVOKE ${EXECUTOR_ROLE} FROM ${INTRUSO}`));
    const limpo = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(limpo.exitCode, 0, `${limpo.error}\n${limpo.output}`);
  });

  /**
   * Caso 52, o `PAP-25`. **O excluído legítimo em estado hostil é a própria tabela de declaração**: o
   * executor escreve nela por `INSERT` cru, sem passar pelo ato, e o nome plantado passa a desculpar
   * o que ele alcançar.
   *
   * Três propriedades, medidas em 2026-09-12 e todas saindo `0` antes deste caso: a linha plantada
   * não deixa `app_role_declared`; `role_kind = 'executor'` desculpava **sem condição nenhuma**, o
   * que fazia `ALTER SCHEMA … OWNER TO <plantado>` passar pela afirmação de dono; e derrubar o papel
   * e recriar o mesmo nome **rearmava** o ataque, porque a linha não sai da tabela.
   *
   * A saída existe e é deliberada: uma rodada **assume** a linha, com o nome no ambiente ou na
   * conexão, e grava `role_declaration_adopted`. Sem ela, a acusação não teria como voltar a `0` — e
   * controle sem saída é controle que se aprende a desligar.
   */
  test('declaração escrita fora do ato é acusada, não desculpa posse, e o rearme não passa', async (t: TestContext) => {
    if (semLogin !== undefined) return t.skip(semLogin);

    const antes = await eventos(db.url, 'role_declaration_unattested');
    await withClient(executorUrl, async (client) => {
      await client.query(await citado(client, 'CREATE ROLE %I LOGIN', PLANTADO));
      await client.query(
        'INSERT INTO platform.role_declarations (declaration_id, role_name, role_kind, declared_by) ' +
          `VALUES (gen_random_uuid(), '${PLANTADO}', 'executor', current_user)`,
      );
      await client.query(await citado(client, 'GRANT %I TO ' + EXECUTOR_ROLE + ' WITH SET TRUE', PLANTADO));
      await client.query(`ALTER SCHEMA t_declara_um OWNER TO ${PLANTADO}`);
      await client.query(`GRANT SELECT ON ALL TABLES IN SCHEMA t_declara_um TO ${PLANTADO}`);
    });

    await withClient(comoPapel(db.url, PLANTADO), async (client) => {
      const leu = await client.query('select count(*) from t_declara_um.orders');
      assert.equal(leu.rowCount, 1, 'o plantado lê o cliente por ser dono do schema');
    });

    const acusou = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(acusou.exitCode, 3, `${acusou.error}\n${acusou.output}`);
    assert.match(
      acusou.output,
      new RegExp(`declaração sem ato: "${PLANTADO}" consta como executor`),
      'a divergência entre a tabela e a trilha de fatos é o INSERT fora do ato',
    );
    assert.match(
      acusou.output,
      new RegExp(`dono inesperado: o schema "t_declara_um" pertence a "${PLANTADO}"`),
      'declarar não basta: o executor só desculpa enquanto for dono de platform (§7.5.4)',
    );
    assert.equal(await eventos(db.url, 'role_declaration_unattested'), antes + 1);

    // O rearme: o papel cai, a linha fica, e o mesmo nome volta pela mão do executor.
    await withClient(db.url, async (client) => {
      await client.query(`ALTER SCHEMA t_declara_um OWNER TO ${EXECUTOR_ROLE}`);
      await client.query(`REVOKE ALL ON SCHEMA t_declara_um FROM ${PLANTADO}`);
      await client.query(`REVOKE ALL ON ALL TABLES IN SCHEMA t_declara_um FROM ${PLANTADO}`);
      await client.query(await citado(client, 'DROP ROLE %I', PLANTADO));
    });
    await withClient(executorUrl, async (client) => {
      await client.query(await citado(client, 'CREATE ROLE %I LOGIN', PLANTADO));
      await client.query(await citado(client, 'GRANT %I TO ' + EXECUTOR_ROLE + ' WITH SET TRUE', PLANTADO));
      await client.query(`ALTER SCHEMA t_declara_um OWNER TO ${PLANTADO}`);
    });

    const rearmado = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(rearmado.exitCode, 3, `${rearmado.error}\n${rearmado.output}`);
    assert.match(
      rearmado.output,
      new RegExp(`dono inesperado: o schema "t_declara_um" pertence a "${PLANTADO}"`),
      'recriar o nome rearmava a exclusão; com a condição de permanência, não rearma mais',
    );

    await withClient(db.url, async (client) => {
      await client.query(`ALTER SCHEMA t_declara_um OWNER TO ${EXECUTOR_ROLE}`);
      await client.query(`GRANT ALL ON SCHEMA t_declara_um TO ${EXECUTOR_ROLE}`);
      await client.query(`REVOKE ALL ON SCHEMA t_declara_um FROM ${PLANTADO}`);
      /**
       * O papel sai, e a **linha plantada fica** — a tabela é append-only. O caso seguinte é quem
       * mostra a saída que existe para ela; aqui o que importa é não deixar o executor membro de um
       * papel declarado, que é o estado do caso 51 e faria o próximo `migrate` recusar por ele.
       */
      await client.query(await citado(client, 'REASSIGN OWNED BY %I TO ' + EXECUTOR_ROLE, PLANTADO));
      await client.query(await citado(client, 'DROP OWNED BY %I', PLANTADO));
      await client.query(await citado(client, 'DROP ROLE %I', PLANTADO));
    });
  });

  /**
   * Caso 53, a saída da linha plantada do caso 52: **assumi-la é um ato deliberado, e ele deixa fato.**
   *
   * A tabela é append-only por decisão, então a acusação acima não tem como ser retirada apagando a
   * linha. O que a retira é a rodada que **assume** o nome — aqui, o ambiente apontando para a
   * credencial nova —, e o fato gravado diz que a linha já existia sem ato, com quem a escreveu e
   * quando. É a mesma diferença que a §7.5.4 vende entre "declarado" e "encontrado".
   *
   * Ela cobre também a falha honesta: o evento é escrito por uma segunda conexão (§19.2), e a rodada
   * em que essa escrita falhar deixa a linha sem fato até a rodada seguinte.
   */
  test('a linha plantada com o nome do arranjo é assumida por um ato, e a acusação sai', async (t: TestContext) => {
    if (semLogin !== undefined) return t.skip(semLogin);

    await withClient(executorUrl, (client) =>
      client.query(
        'INSERT INTO platform.role_declarations (declaration_id, role_name, role_kind, declared_by) ' +
          `VALUES (gen_random_uuid(), '${CREDENCIAL_NOVA}', 'app_credential', 'mao_desconhecida')`,
      ),
    );

    const acusou = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(acusou.exitCode, 3, `${acusou.error}\n${acusou.output}`);
    assert.match(acusou.output, new RegExp(`declaração sem ato: "${CREDENCIAL_NOVA}"`));

    const antes = await eventos(db.url, 'role_declaration_adopted');
    const assumiu = await runExecutor(
      { kind: 'migrate' },
      { url: executorUrl, migrationsDir, appCredentialRole: CREDENCIAL_NOVA },
    );
    assert.equal(assumiu.exitCode, 0, `${assumiu.error}\n${assumiu.output}`);
    assert.match(
      assumiu.output,
      new RegExp(`declaração assumida: "${CREDENCIAL_NOVA}" já constava .* e esta rodada a assumiu`),
    );
    assert.equal(await eventos(db.url, 'role_declaration_adopted'), antes + 1);

    const depois = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.doesNotMatch(
      depois.output,
      new RegExp(`declaração sem ato: "${CREDENCIAL_NOVA}"`),
      'assumir é a saída: sem ela a tabela append-only deixaria o verify em 3 para sempre',
    );

    /**
     * O fim da rotação, como a §7.7 o descreve: a credencial que saiu volta a ser mão humana. Sem
     * isto ela continua assumindo o papel de cada cliente, e o caso seguinte — que esvazia a tabela —
     * a veria como alcance de terceiro, que é exatamente o que a §7.5.1 tem que dizer dela ali.
     */
    // Cada `REVOKE` sai da mão que concedeu: os papéis de cliente vieram do `migrate` acima, e o
    // grupo veio do ato do operador. É a mesma chave `(roleid, member, grantor)` do `PAP-13`.
    await withClient(executorUrl, async (client) => {
      for (const schema of ['t_declara_um', 't_declara_dois']) {
        await client.query(`REVOKE app_${schema} FROM ${CREDENCIAL_NOVA}`);
      }
    });
    await withClient(db.url, (client) =>
      client.query(`REVOKE ${APP_GROUP_ROLE} FROM ${CREDENCIAL_NOVA}`),
    );
  });

  /**
   * Caso 54, o `PAP-27`. A tabela existe e está **vazia** — o banco provisionado antes da `0011`, e a
   * rodada de `migrate` que morra entre a stream `platform` e a declaração.
   *
   * Medido em 2026-09-12: o `verify` saía `3` com treze linhas acusando dono e alcance, e três delas
   * mandavam `ALTER SCHEMA ... OWNER TO <executor>` sobre schemas cujo dono **já era** o executor.
   * Quem seguisse a instrução impressa emitiria um comando que não muda nada e continuaria com `3`.
   *
   * O desfecho continua sendo `3` — a pergunta não foi feita —, com **uma** linha, e ela nomeia a
   * saída que funciona.
   */
  test('tabela vazia é a pergunta não feita, com uma linha e a saída certa', async (t: TestContext) => {
    if (semLogin !== undefined) return t.skip(semLogin);

    const antes = await eventos(db.url, 'role_declarations_empty');
    await withClient(db.url, async (client) => {
      // O gatilho da 0011 recusa `DELETE` inclusive para superusuário: esvaziar é ato do teste, e o
      // gatilho volta antes da medição, senão a impressão estrutural divergiria (caso 21).
      await client.query(
        'ALTER TABLE platform.role_declarations DISABLE TRIGGER role_declarations_reject_mutation',
      );
      await client.query('DELETE FROM platform.role_declarations');
      await client.query(
        'ALTER TABLE platform.role_declarations ENABLE TRIGGER role_declarations_reject_mutation',
      );
    });

    const reprovou = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(reprovou.exitCode, 3, `${reprovou.error}\n${reprovou.output}`);
    assert.match(
      reprovou.output,
      /pergunta não feita: platform\.role_declarations existe e está vazia/,
    );
    assert.match(reprovou.output, /a saída é uma rodada de migrate/);
    assert.doesNotMatch(
      reprovou.output,
      /dono inesperado/,
      'onze acusações sobre um estado esperado são o ruído que ensina a ignorar a saída inteira',
    );
    assert.doesNotMatch(reprovou.output, /alcance ao schema/);
    assert.equal(await eventos(db.url, 'role_declarations_empty'), antes + 1);

    // E a saída impressa é a que funciona.
    const curou = await runExecutor({ kind: 'migrate' }, { url: executorUrl, migrationsDir });
    assert.equal(curou.exitCode, 0, `${curou.error}\n${curou.output}`);
    const limpo = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(limpo.exitCode, 0, `${limpo.error}\n${limpo.output}`);
  });
});

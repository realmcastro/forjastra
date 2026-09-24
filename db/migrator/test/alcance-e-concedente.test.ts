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
 * Casos 40 a 43 de `CONTRATO.md` §14: o sexto gate
 * (`docs/auditorias/2026-09-11-gate-final-camada-de-papel.md`, `PAP-13` a `PAP-16`), revistos no
 * sétimo (`docs/auditorias/2026-09-12-reauditoria-camada-de-papel.md`), quando a exclusão da §7.5.1
 * deixou de ser propriedade do catálogo e passou a ser declaração nossa. Os casos com o excluído em
 * **estado hostil** — a régua que a reauditoria fixou — moram em `exclusao-hostil.test.ts`.
 *
 * **Cada caso tem duas metades, e a segunda é a que faltava.** A primeira reproduz o achado, com o
 * **sujeito escrito no cenário dele** — o `PAP-13` é sobre o operador, então quem emite a concessão
 * aqui é o operador, e não a conexão que estava à mão. A segunda ataca o **conserto**, perguntando
 * quem mais cabe na condição nova: foi essa pergunta que faltou nas três reincidências, porque teste
 * montado a partir da lista do achado prova o achado e nunca a classe.
 *
 * **O executor aqui não é superusuário**, pela mesma razão de `papel-do-cliente.test.ts`: o ato da
 * §7.3 depende de `CREATEROLE` e do `WITH ADMIN OPTION` da §7.2, e superusuário atravessa os dois
 * sem provar nada. Nenhum papel tem senha; sem `trust`, o arquivo é **pulado com motivo**.
 */

const EXECUTOR_ROLE = 'forja_executor';
/** `LOGIN` e **fora** de `forja_app`: é o beneficiário que o `PAP-14` escondia. */
const FORA_DO_ARRANJO = 'forja_ops_leitura_t0009';
/** `LOGIN` e **dentro** de `forja_app`: é a credencial nova da rotação da §7.7. */
const CREDENCIAL_NOVA = 'forja_credencial_nova_t0009';

const PEDIDOS = tenantMigration(`
CREATE TABLE IF NOT EXISTS orders (
    order_id uuid NOT NULL,
    total numeric(14,2) NOT NULL,
    CONSTRAINT orders_pkey PRIMARY KEY (order_id)
);
`);

describe('quem alcança o cliente, e quem concedeu', { skip: skipWithoutPostgres }, () => {
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
      for (const papel of [FORA_DO_ARRANJO, CREDENCIAL_NOVA]) {
        await client.query(await citado(client, 'DROP ROLE IF EXISTS %I', papel));
      }
      // O papel de fora nasce **sem** `NOINHERIT`, que é o padrão do `CREATE ROLE` e o caso do
      // achado: é herdando que ele lê o cliente sem assumir papel nenhum. A credencial nova nasce
      // como a §7.2 manda, `NOINHERIT`, porque ela é credencial de aplicação de verdade.
      await client.query(await citado(client, 'CREATE ROLE %I LOGIN', FORA_DO_ARRANJO));
      await client.query(await citado(client, 'CREATE ROLE %I LOGIN NOINHERIT', CREDENCIAL_NOVA));
      await client.query(
        await citado(client, `GRANT ${APP_GROUP_ROLE} TO %I`, CREDENCIAL_NOVA),
      );
    });

    semLogin = await motivoDeNaoConectar(executorUrl, credencialUrl);
    if (semLogin !== undefined) return;

    for (const slug of ['sexto', 'setimo']) {
      const feito = await runExecutor({ kind: 'provision', slug }, { url: executorUrl, migrationsDir });
      assert.equal(feito.exitCode, 0, feito.error);
    }
  });

  after(async () => {
    await db.drop();
    await withClient(db.url.replace(/\/[^/]*$/, '/postgres'), async (client) => {
      for (const papel of [FORA_DO_ARRANJO, CREDENCIAL_NOVA]) {
        await client.query(await citado(client, 'DROP ROLE IF EXISTS %I', papel));
      }
    });
  });

  /**
   * Caso 40, o `PAP-13`. A credencial é criada pelo **operador** (§7.2), que é quem tem superusuário,
   * e é ele quem encontra o `permission denied for schema` da prova E ao subir a primeira rota. O que
   * ele escreve, na conexão que já tem aberta, é `GRANT app_t_<slug> TO <credencial> WITH INHERIT
   * TRUE` — e a chave de `pg_auth_members` é `(roleid, member, grantor)`, então isso **não** altera a
   * linha do executor: passam a existir duas, e o efeito é a união.
   *
   * Até o sexto gate, `verify` acusava `3` mandando convergir, `migrate --schema` imprimia
   * "completando o papel de banco" e **saía `0`**, e `verify` voltava a `3`. O laço não terminava, e
   * as duas mensagens afirmavam uma correção que não aconteceu.
   */
  test('concessão herdável emitida pelo operador: migrate e verify recusam nomeando o concedente', async (t: TestContext) => {
    if (semLogin !== undefined) return t.skip(semLogin);

    await withClient(db.url, async (client) => {
      await client.query(`GRANT app_t_sexto TO ${APP_CREDENTIAL_ROLE} WITH INHERIT TRUE`);
    });
    assert.deepEqual(
      await linhasDaConcessao('app_t_sexto'),
      [
        { concedente: EXECUTOR_ROLE, herda: false },
        { concedente: 'postgres', herda: true },
      ],
      'duas linhas, uma por concedente, e é a segunda que vaza: reemitir grava a primeira',
    );

    await withClient(credencialUrl, async (client) => {
      const vazou = await client.query('select count(*) from t_sexto.orders');
      assert.equal(vazou.rowCount, 1, 'a credencial nua lê o cliente pela concessão do operador');
    });

    const antesEvento = await eventos(db.url, 'tenant_role_foreign_grantor');
    const acusou = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(acusou.exitCode, 3, acusou.error);
    assert.match(acusou.output, /concessão de "postgres"/);
    assert.match(acusou.output, /REVOKE app_t_sexto FROM forja_credencial;/);
    assert.doesNotMatch(
      acusou.output,
      /app_t_sexto.*Converge com migrate/,
      'a linha não pode mandar convergir: convergir aqui é o defeito',
    );
    assert.equal(await eventos(db.url, 'tenant_role_foreign_grantor'), antesEvento + 1);

    const recusou = await runExecutor(
      { kind: 'migrate', schema: 't_sexto' },
      { url: executorUrl, migrationsDir },
    );
    assert.equal(recusou.exitCode, 3, `migrate não pode mais sair 0 aqui: ${recusou.error}`);
    assert.match(recusou.error ?? '', /concessão de "postgres"/);
    assert.doesNotMatch(recusou.output, /completando o papel de banco/);
    assert.equal(
      await herda('app_t_sexto'),
      true,
      'a recusa é antes de qualquer escrita: o estado continua o mesmo',
    );

    /**
     * A correção óbvia piora o estado, e é medida aqui: o `REVOKE` do executor apaga **só a linha
     * dele** — a legítima — e deixa a herdável do operador de pé. Depois dela a credencial nua
     * continua lendo o cliente e passa a não conseguir mais assumir o papel.
     */
    await withClient(executorUrl, async (client) => {
      await client.query(`REVOKE app_t_sexto FROM ${APP_CREDENTIAL_ROLE}`);
    });
    assert.deepEqual(await concedentes('app_t_sexto'), ['postgres']);
    await withClient(credencialUrl, async (client) => {
      const aindaLe = await client.query('select count(*) from t_sexto.orders');
      assert.equal(aindaLe.rowCount, 1, 'revogar pelo executor não tira o alcance indevido');
    });

    // E o executor também não consegue revogar em nome do concedente: não há caminho daqui.
    await withClient(executorUrl, async (client) => {
      await assert.rejects(
        client.query(`REVOKE app_t_sexto FROM ${APP_CREDENTIAL_ROLE} GRANTED BY postgres`),
        (erro: unknown) => codigo(erro) === '42501',
        'REVOKE ... GRANTED BY de outro concedente é negado ao executor',
      );
    });

    // O comando que a mensagem manda rodar, na conexão de quem concedeu.
    await withClient(db.url, async (client) => {
      await client.query(`REVOKE app_t_sexto FROM ${APP_CREDENTIAL_ROLE}`);
    });
    const convergiu = await runExecutor(
      { kind: 'migrate', schema: 't_sexto' },
      { url: executorUrl, migrationsDir },
    );
    assert.equal(convergiu.exitCode, 0, convergiu.error);
    assert.match(convergiu.output, /completando o papel de banco/);
    assert.equal(await herda('app_t_sexto'), false);

    await withClient(credencialUrl, async (client) => {
      await assert.rejects(
        client.query('select 1 from t_sexto.orders'),
        (erro: unknown) => codigo(erro) === '42501',
        'desfeito o estado, a credencial nua volta a não alcançar o schema',
      );
    });

    /**
     * **O caso que ataca o conserto**, e não o achado: quem mais cabe na condição nova? A condição é
     * "concedente que não é esta conexão", então o risco é ela engolir o caso convergível junto. Com
     * as **duas** linhas herdáveis — a do executor e a do operador — a rodada recusa; retirada a do
     * operador, a do executor continua herdável e **converge**, que é o `PAP-01`. A recusa é sobre o
     * concedente, nunca sobre a herança.
     */
    await withClient(executorUrl, async (client) => {
      await client.query(`GRANT app_t_sexto TO ${APP_CREDENTIAL_ROLE} WITH INHERIT TRUE`);
    });
    await withClient(db.url, async (client) => {
      await client.query(`GRANT app_t_sexto TO ${APP_CREDENTIAL_ROLE} WITH INHERIT TRUE`);
    });
    const duas = await runExecutor(
      { kind: 'migrate', schema: 't_sexto' },
      { url: executorUrl, migrationsDir },
    );
    assert.equal(duas.exitCode, 3, duas.error);

    await withClient(db.url, async (client) => {
      await client.query(`REVOKE app_t_sexto FROM ${APP_CREDENTIAL_ROLE}`);
    });
    assert.deepEqual(await concedentes('app_t_sexto'), [EXECUTOR_ROLE]);
    const so = await runExecutor(
      { kind: 'migrate', schema: 't_sexto' },
      { url: executorUrl, migrationsDir },
    );
    assert.equal(so.exitCode, 0, `a herança do próprio executor continua convergindo: ${so.error}`);
    assert.equal(await herda('app_t_sexto'), false);

    const limpo = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(limpo.exitCode, 0, `${limpo.error}\n${limpo.output}`);
  });

  /**
   * Caso 41, o `PAP-14`. `GRANT app_t_<slug> TO <alguém>` já era enxergado; a **mesma linha com
   * `WITH ADMIN OPTION`** não era, porque o filtro da §7.5.1 excluía `admin_option` — um sinalizador
   * que o **beneficiário** carrega. Uma palavra separava o controle que funciona do controle que não
   * vê nada, e é a palavra que alguém digita quando quer delegar a concessão adiante.
   */
  test('membership WITH ADMIN OPTION aparece na pergunta invertida, e é nomeada como tal', async (t: TestContext) => {
    if (semLogin !== undefined) return t.skip(semLogin);

    await withClient(executorUrl, async (client) => {
      await client.query(`GRANT app_t_sexto TO ${FORA_DO_ARRANJO} WITH ADMIN OPTION`);
    });

    await withClient(comoPapel(db.url, FORA_DO_ARRANJO), async (client) => {
      const leu = await client.query('select count(*) from t_sexto.orders');
      assert.equal(leu.rowCount, 1, 'a concessão nasce herdável: o papel lê sem assumir nada');
    });

    const antes = await eventos(db.url, 'tenant_schema_foreign_grant');
    const acusou = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(acusou.exitCode, 3, acusou.error);
    assert.match(
      acusou.output,
      new RegExp(`alcance ao schema "t_sexto": ${FORA_DO_ARRANJO} é membro do papel do cliente, com ADMIN OPTION`),
    );
    assert.equal(await eventos(db.url, 'tenant_schema_foreign_grant'), antes + 1);

    await withClient(executorUrl, async (client) => {
      await client.query(`REVOKE app_t_sexto FROM ${FORA_DO_ARRANJO}`);
    });
    const limpo = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(limpo.exitCode, 0, `${limpo.error}\n${limpo.output}`);
  });

  /**
   * **O caso que ataca o conserto do `PAP-14`, reescrito no sétimo gate.** Até ele, a exclusão era o
   * arranjo **inferido do catálogo**: membro de `forja_app` com `admin_option` ou com `LOGIN`. O
   * `PAP-20` mediu o que isso deixa passar, e a correção trocou a inferência pela **declaração**
   * (§7.5.4). Então a pergunta mudou junto: não é mais "quem cabe na condição", é "quem está
   * escrito".
   *
   * Três estados aqui, e o do meio é o que a rodada anterior aprovava:
   *
   * - o **papel de outro cliente**, que nunca foi declarado, continua acusado (quarto estado do
   *   `PAP-02`);
   * - um papel `LOGIN` que alguém **põe no grupo** e a quem o executor concede o papel do cliente na
   *   forma **legítima** — `WITH INHERIT FALSE, SET TRUE`. Estar no grupo com `LOGIN` deixou de
   *   desculpar: sem linha em `platform.role_declarations`, ele é acusado. É a diferença entre
   *   "parece com o arranjo" e "é o arranjo";
   * - a credencial **declarada**, que é excluída e **nomeada** por `app_credential_plural`. Exclusão
   *   em silêncio seria trocar um veto falso por uma ausência invisível.
   */
  test('estar no grupo com LOGIN não desculpa: o que desculpa é a declaração', async (t: TestContext) => {
    if (semLogin !== undefined) return t.skip(semLogin);

    await withClient(executorUrl, async (client) => {
      await client.query('GRANT app_t_sexto TO app_t_setimo');
    });
    const acusou = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(acusou.exitCode, 3, acusou.error);
    assert.match(acusou.output, /alcance ao schema "t_sexto": app_t_setimo é membro do papel do cliente/);
    await withClient(executorUrl, async (client) => {
      await client.query('REVOKE app_t_sexto FROM app_t_setimo');
    });

    // O papel `LOGIN` dentro do grupo, na forma legítima da §7.3, e **sem declaração**: acusado.
    await withClient(executorUrl, async (client) => {
      await client.query(`GRANT app_t_sexto TO ${CREDENCIAL_NOVA} WITH INHERIT FALSE, SET TRUE`);
    });
    const semDeclaracao = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(semDeclaracao.exitCode, 3, semDeclaracao.error);
    assert.match(
      semDeclaracao.output,
      new RegExp(`alcance ao schema "t_sexto": ${CREDENCIAL_NOVA} é membro do papel do cliente`),
      'o grupo e o LOGIN não excluem mais ninguém: a exclusão é por nome declarado',
    );

    /**
     * A declaração nasce do ato, não da inspeção: quem a escreve é uma rodada de `migrate` com o
     * ambiente apontando para a credencial nova, que é como a §7.7 manda a rotação acontecer. Depois
     * dela, a mesma concessão passa a ser excluída — e nomeada.
     */
    const declarou = await runExecutor(
      { kind: 'migrate' },
      { url: executorUrl, migrationsDir, appCredentialRole: CREDENCIAL_NOVA },
    );
    assert.equal(declarou.exitCode, 0, declarou.error);
    assert.match(declarou.output, new RegExp(`papel declarado: "${CREDENCIAL_NOVA}"`));

    const antes = await eventos(db.url, 'app_credential_plural');
    const tolerou = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(tolerou.exitCode, 0, `${tolerou.error}\n${tolerou.output}`);
    assert.doesNotMatch(tolerou.output, /alcance ao schema "t_sexto"/);
    assert.match(
      tolerou.output,
      new RegExp(`credencial de aplicação a mais: "${CREDENCIAL_NOVA}"`),
      'excluir sem nomear seria trocar veto falso por ausência invisível',
    );
    assert.equal(await eventos(db.url, 'app_credential_plural'), antes + 1);

    // A rodada de `migrate` concedeu nos dois schemas, porque ela visita todos: os dois voltam.
    await withClient(executorUrl, async (client) => {
      for (const schema of ['sexto', 'setimo']) {
        await client.query(`REVOKE app_t_${schema} FROM ${CREDENCIAL_NOVA}`);
      }
    });
  });

  /**
   * Caso 42, o `PAP-15`. Todas as outras perguntas olham `platform` e `t_*`, então objeto num
   * terceiro schema é ponto cego por construção. Medido no sexto gate: uma view em `public` unindo
   * dois clientes devolve os dois **para a credencial nua**, porque a view roda com o privilégio de
   * quem a criou e o papel do cliente sai do caminho.
   */
  test('public vazio e universo de schemas: a view que entrega dois clientes é nomeada, e reprova', async (t: TestContext) => {
    if (semLogin !== undefined) return t.skip(semLogin);

    await withClient(db.url, async (client) => {
      await client.query('GRANT USAGE ON SCHEMA public TO PUBLIC');
      await client.query(
        'CREATE VIEW public.v_pedidos AS ' +
          'SELECT order_id, total FROM t_sexto.orders UNION ALL ' +
          'SELECT order_id, total FROM t_setimo.orders',
      );
      await client.query(`GRANT SELECT ON public.v_pedidos TO ${APP_CREDENTIAL_ROLE}`);
    });

    await withClient(credencialUrl, async (client) => {
      const leu = await client.query('select count(*) from public.v_pedidos');
      assert.equal(leu.rowCount, 1, 'a credencial nua lê os dois clientes pela view de apoio');
    });

    const antes = await eventos(db.url, 'public_object_present');
    const acusou = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(acusou.exitCode, 3, acusou.error);
    assert.match(acusou.output, /fora do universo declarado: "public\.v_pedidos" existe no schema public/);
    assert.equal(await eventos(db.url, 'public_object_present'), antes + 1);

    /**
     * **O caso que ataca o conserto**: a lista do achado tinha uma view, e conserto montado a partir
     * da lista do achado prova o achado. A pergunta é o que mais alcança dois clientes morando em
     * `public` — e a resposta imediata é uma **função `SECURITY DEFINER`**, que nem sequer é relação.
     * Ela tem que ser nomeada pela mesma pergunta, e um schema inteiro fora de `platform`/`t_*`
     * também.
     */
    await withClient(db.url, async (client) => {
      await client.query(
        'CREATE FUNCTION public.f_pedidos() RETURNS bigint LANGUAGE sql SECURITY DEFINER AS ' +
          "$$ SELECT count(*) FROM t_sexto.orders $$",
      );
      await client.query('CREATE SCHEMA relatorios');
    });

    const antesSchema = await eventos(db.url, 'schema_outside_universe');
    const tresLinhas = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(tresLinhas.exitCode, 3, tresLinhas.error);
    assert.match(tresLinhas.output, /"public\.f_pedidos" existe no schema public — rotina/);
    assert.match(tresLinhas.output, /o schema "relatorios" existe e não é platform nem t_\*/);
    assert.equal(await eventos(db.url, 'schema_outside_universe'), antesSchema + 1);

    await withClient(db.url, async (client) => {
      await client.query('DROP SCHEMA relatorios');
      await client.query('DROP FUNCTION public.f_pedidos()');
      await client.query('DROP VIEW public.v_pedidos');
      await client.query('REVOKE USAGE ON SCHEMA public FROM PUBLIC');
    });
    const limpo = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(limpo.exitCode, 0, `${limpo.error}\n${limpo.output}`);
  });

  /**
   * Caso 43, o `PAP-16`. A §7.7 escreveu, com todas as letras, que recusar a pluralidade de
   * credenciais "travaria `migrate` no meio de uma rotação, que é exatamente a hora em que travar
   * custa mais caro" — e a §7.5.1, escrita na mesma rodada em outro arquivo, travava `migrate` em
   * **todo** cliente no instante em que a configuração migrava para a credencial nova, nomeando a
   * anterior como quem "alcança indevidamente". A §7.7 manda, e é ela que está aqui.
   *
   * **O que continua verdade, e é ausência declarada:** `provision` de cliente novo durante a janela
   * concede o papel **só** à credencial que o ambiente nomeia, então o cliente nasce inalcançável
   * pela aplicação que ainda roda com a outra. Falha fechado — indisponibilidade, não vazamento —, e
   * a saída é `migrate --schema` depois que a configuração terminar de migrar (§7.7).
   */
  test('a janela de rotação da §7.7 não trava migrate nem verify, nos dois sentidos', async (t: TestContext) => {
    if (semLogin !== undefined) return t.skip(semLogin);

    /**
     * A rotação, como a §7.7 passou a mandar depois do sétimo gate: quem concede é o **ato**, numa
     * rodada com o ambiente apontando para a credencial nova. É essa rodada que a declara, e é a
     * declaração que a exclui da §7.5.1 — concessão emitida na mão continua sendo acusada, e o caso
     * acima mede isso.
     */
    const rotacionou = await runExecutor(
      { kind: 'migrate' },
      { url: executorUrl, migrationsDir, appCredentialRole: CREDENCIAL_NOVA },
    );
    assert.equal(rotacionou.exitCode, 0, rotacionou.error);

    // O ambiente já migrou para a nova, e a antiga ainda está no grupo: é o instante do `Q9`.
    const comNova = await runExecutor(
      { kind: 'verify' },
      { url: executorUrl, migrationsDir, appCredentialRole: CREDENCIAL_NOVA },
    );
    assert.equal(comNova.exitCode, 0, `${comNova.error}\n${comNova.output}`);
    assert.doesNotMatch(comNova.output, /alcance ao schema/);
    assert.match(comNova.output, new RegExp(`credencial de aplicação a mais: "${APP_CREDENTIAL_ROLE}"`));

    // Apontando de volta para a antiga, o desfecho é o mesmo e quem é nomeada é a outra: a exclusão
    // é o conjunto declarado, e não o nome que o ambiente carrega.
    const comVelha = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(comVelha.exitCode, 0, `${comVelha.error}\n${comVelha.output}`);
    assert.doesNotMatch(comVelha.output, /alcance ao schema/);
    assert.match(comVelha.output, new RegExp(`credencial de aplicação a mais: "${CREDENCIAL_NOVA}"`));

    /**
     * **Declaração não é salvo-conduto eterno**, e é aqui que se prova: terminada a rotação, a mão
     * humana tira a credencial velha do grupo (§7.7) e, enquanto os `GRANT` dela ficarem de pé, ela
     * continua podendo **assumir** o papel de todo cliente. A §7.5.1 volta a acusá-la, porque a
     * exclusão vale enquanto a condição que a produziu valer. Propriedade do catálogo entra do lado
     * que acrescenta linha, nunca do que tira.
     */
    await withClient(db.url, async (client) => {
      await client.query(`REVOKE ${APP_GROUP_ROLE} FROM ${CREDENCIAL_NOVA}`);
    });
    const forado = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(forado.exitCode, 3, forado.error);
    assert.match(forado.output, new RegExp(`alcance ao schema "t_sexto": ${CREDENCIAL_NOVA}`));

    await withClient(executorUrl, async (client) => {
      for (const schema of ['sexto', 'setimo']) {
        await client.query(`REVOKE app_t_${schema} FROM ${CREDENCIAL_NOVA}`);
      }
    });
    const limpo = await runExecutor({ kind: 'verify' }, { url: executorUrl, migrationsDir });
    assert.equal(limpo.exitCode, 0, `${limpo.error}\n${limpo.output}`);
  });

  /** Uma linha por concedente da concessão do papel à credencial — a chave inteira, em ordem. */
  async function linhasDaConcessao(
    papel: string,
  ): Promise<readonly { concedente: string; herda: boolean }[]> {
    return withClient(db.url, async (client) => {
      const linhas = await client.query<{ concedente: string; herda: boolean }>(
        `select m.grantor::regrole::text as concedente, m.inherit_option as herda
           from pg_auth_members m
          where m.roleid = to_regrole($1) and m.member = to_regrole($2)
          order by 1`,
        [papel, APP_CREDENTIAL_ROLE],
      );
      return linhas.rows.map((linha) => ({ concedente: linha.concedente, herda: linha.herda }));
    });
  }

  /** Os concedentes de uma concessão **herdável** do papel à credencial, em ordem. */
  async function concedentes(papel: string): Promise<readonly string[]> {
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

  async function herda(papel: string): Promise<boolean> {
    return (await concedentes(papel)).length > 0;
  }
});

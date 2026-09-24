import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import pg from 'pg';
import { sql } from 'kysely';

import { createPool, createRootDb } from '../src/db/pool.js';
import { tenantRoleName } from '../src/db/tenant-role.js';
import { AppCredentialError, assertAppCredential } from '../src/db/app-credential.js';
import { CONTROL_SCHEMA, credentialQuery } from '../src/db/credential-query.js';
import type { RootDb } from '../src/db/tenant-db.js';
import type { StartupFact, StartupFactSink } from '../src/observability/startup-facts.js';

/**
 * Os casos do `F-003` contra um Postgres de verdade, mais os estados que o gate 3 e a reauditoria
 * dele mediram subindo como `verified` (`SUB-01`, `SUB-02`, `SUB-05`, `SUB-06`), as colunas que
 * sustentavam recusa sem nenhum caso vivo (`SUB-08`, `SUB-11`) e o papel predefinido (`SUB-12`). A
 * delegação por dono de objeto (`SUB-09`) mora em `delegation-live.test.ts`, com banco próprio.
 *
 * **Dezesseis casos, um arranjo só, e é por isso que o arquivo passa de 400 linhas.** Separá-los em dois
 * exigiria montar o arranjo de duas mãos duas vezes, em processos diferentes — e montagem duplicada
 * foi exatamente a origem do defeito da rodada passada (`XX000 no possible grantors`). O arquivo
 * cresce por caso, não por cerimônia: cada teste monta um estado, exige a recusa e desfaz.
 *
 * **Pulado quando `FORJA_TEST_DATABASE_URL` não existe**, pela mesma razão de
 * `tenant-role-live.test.ts`: o resto da suíte não precisa de banco. A variável aponta para um
 * banco **descartável** com poder de criar papel. Nada aqui toca papel nem schema que não tenha
 * criado: os nomes levam sufixo sorteado e a limpeza derruba só esses.
 *
 * **O concedente importa, e por isso o arranjo tem duas mãos.** A concessão legítima da §7.3 sai
 * pelo **executor**, e a herdável do caso 4 sai pelo **operador** — que é o ator que o cenário do
 * `PAP-13` nomeia. Reproduzir pela conexão que estava à mão foi o que deixou aquele achado passar
 * (`docs/auditorias/2026-09-11-gate-final-camada-de-papel.md:118-126`).
 *
 * **Todo caso hostil daqui monta o estado e exige que a subida recuse**, nunca o contrário: exclusão
 * se prova pelo que ela deixa passar. Os três estados novos (`caso 6`, `caso 7`, `caso 8`) foram
 * medidos antes da correção, e nos três o servidor subia com `startup_credential_verified` enquanto
 * um cliente lia a venda de outro.
 *
 * **A variável aponta para o papel que faz a §7.2, que é o operador do cluster.** O caso 3 precisa
 * de um superusuário de verdade e, sem ele, **falha em vez de pular** — pulo silencioso em modo de
 * gate é o `SUB-03` por outro caminho.
 */

const ADMIN_URL = process.env['FORJA_TEST_DATABASE_URL'];
const PULAR = ADMIN_URL === undefined || ADMIN_URL.trim() === '';

const SUFIXO = randomBytes(4).toString('hex');
const GRUPO = `forja_app_probe_${SUFIXO}`;
const CREDENCIAL = `forja_cred_probe_${SUFIXO}`;
const EXECUTOR = `forja_exec_probe_${SUFIXO}`;
/** A segunda mão do `PAP-13`: quem concede sem ser o executor (ver `provisionar`). */
const SEGUNDA_MAO = `forja_mao_probe_${SUFIXO}`;
const SCHEMA = `t_probe_${SUFIXO}`;
const PAPEL_DO_CLIENTE = tenantRoleName(SCHEMA);
/** Segundo cliente: `SUB-01` precisa de um schema para sujar sem estragar o do caso 1, e `SUB-02` é
 *  uma relação entre **dois** papéis de cliente. */
const SCHEMA_B = `t_probeb_${SUFIXO}`;
const PAPEL_DO_CLIENTE_B = tenantRoleName(SCHEMA_B);
const SENHA = randomBytes(18).toString('hex');

let admin: pg.Client;
let operador = '';
let operadorESuperusuario = false;
const aFechar: RootDb[] = [];

function urlDe(base: string, papel: string, senha: string): string {
  const url = new URL(base);
  url.username = papel;
  url.password = senha;
  return url.toString();
}

/** Uma raiz por papel medido, todas fechadas no fim. `max: 1` mantém a medida numa conexão só. */
function raizComo(url: string): RootDb {
  const raiz = createRootDb(
    createPool({
      connectionString: url,
      poolMax: 1,
      statementTimeoutMs: 5_000,
      idleInTransactionTimeoutMs: 10_000,
      connectionTimeoutMs: 5_000,
    }),
  );
  aFechar.push(raiz);
  return raiz;
}

/** Desfaz a transação de um caso de propósito, depois de medir o efeito dentro dela. */
class DesfazerTransacao extends Error {}

function coletor(): { sink: StartupFactSink; fatos: StartupFact[] } {
  const fatos: StartupFact[] = [];
  return { fatos, sink: { name: 'teste', record: (fato) => void fatos.push(fato) } };
}

async function provisionar(): Promise<void> {
  const id = (nome: string): string => pg.escapeIdentifier(nome);
  const lit = (valor: string): string => pg.escapeLiteral(valor);

  // §7.2, o ato do operador.
  await admin.query(`CREATE ROLE ${id(GRUPO)} NOLOGIN`);
  await admin.query(`CREATE ROLE ${id(CREDENCIAL)} LOGIN NOINHERIT PASSWORD ${lit(SENHA)}`);
  await admin.query(`GRANT ${id(GRUPO)} TO ${id(CREDENCIAL)}`);
  await admin.query(`CREATE ROLE ${id(EXECUTOR)} LOGIN NOINHERIT CREATEROLE PASSWORD ${lit(SENHA)}`);
  await admin.query(`GRANT ${id(GRUPO)} TO ${id(EXECUTOR)} WITH ADMIN OPTION`);
  await admin.query(`CREATE ROLE ${id(SEGUNDA_MAO)} LOGIN NOINHERIT PASSWORD ${lit(SENHA)}`);
  await admin.query(`CREATE SCHEMA ${id(SCHEMA)}`);
  await admin.query(`CREATE SCHEMA ${id(SCHEMA_B)}`);
  // Uma venda em cada: o `SUB-05` não se prova por recusa só, e sim mostrando que, sem ela, um
  // cliente lê a linha do outro pelo caminho normal de requisição.
  await admin.query(`CREATE TABLE ${id(SCHEMA)}.orders(id int primary key, total_cents int not null)`);
  await admin.query(`CREATE TABLE ${id(SCHEMA_B)}.orders(id int primary key, total_cents int not null)`);
  await admin.query(`INSERT INTO ${id(SCHEMA)}.orders VALUES (1, 111)`);
  await admin.query(`INSERT INTO ${id(SCHEMA_B)}.orders VALUES (1, 222)`);

  // §7.3, o passo do executor — emitido **pelo executor**, que é quem o emite em produção.
  const exec = new pg.Client({ connectionString: urlDe(ADMIN_URL ?? '', EXECUTOR, SENHA) });
  await exec.connect();
  try {
    for (const papel of [PAPEL_DO_CLIENTE, PAPEL_DO_CLIENTE_B]) {
      await exec.query(`CREATE ROLE ${id(papel)} NOLOGIN NOINHERIT`);
      await exec.query(`GRANT ${id(GRUPO)} TO ${id(papel)}`);
      await exec.query(`GRANT ${id(papel)} TO ${id(CREDENCIAL)} WITH INHERIT FALSE, SET TRUE`);
    }

    /**
     * **A segunda mão só existe se ela puder conceder**, e até 2026-09-12 o arranjo dependia de o
     * banco de teste ser servido por superusuário para isso. Em 16 o criador de um papel recebe
     * `admin_option` sobre ele e **não** recebe `set_option` (medido): o operador criou o executor,
     * o executor criou o papel do cliente, e um operador `CREATEROLE` não-superusuário leva
     * `XX000 no possible grantors` ao tentar a concessão herdável do caso 4 — era a falha do `R4`
     * do gate 3.
     *
     * A segunda mão passa a ser um papel próprio, e não o operador, por uma razão medida:
     * `GRANT … TO <operador> WITH ADMIN OPTION` emitido pelo executor leva
     * `0LP01 ADMIN option cannot be granted back to your own grantor` quando o operador é quem
     * criou o executor. O cenário do `PAP-13` é sobre **duas mãos com poder de conceder**, não
     * sobre superusuário, e um papel `LOGIN` com `ADMIN OPTION` sobre o papel do cliente é
     * exatamente a segunda mão que o cenário descreve — em produção ela é quem faz manutenção de
     * papel sem ser o executor de migration.
     */
    await exec.query(`GRANT ${id(PAPEL_DO_CLIENTE)} TO ${id(SEGUNDA_MAO)} WITH ADMIN OPTION`);
  } finally {
    await exec.end();
  }

  /**
   * As duas linhas de privilégio de schema da §7.3, e elas passaram a existir aqui em 2026-09-12.
   * Até então o arranjo parava na concessão de papel, e papel de cliente que não alcança nem o
   * próprio schema não exercita a exclusão do `SUB-05`: a sétima pergunta responderia `[]` por não
   * haver privilégio nenhum, não por a exclusão funcionar.
   *
   * **Emitidas pelo operador, e aqui o concedente não importa** — ao contrário da concessão de
   * papel, onde ele é a chave de `pg_auth_members` e o cenário do `PAP-13` depende dele.
   * `has_schema_privilege` responde sobre `nspacl`, que não guarda concedente algum. Em produção
   * quem emite é o executor, porque lá o schema é dele; aqui o schema é do operador.
   */
  for (const [papel, schema] of [
    [PAPEL_DO_CLIENTE, SCHEMA],
    [PAPEL_DO_CLIENTE_B, SCHEMA_B],
  ] as const) {
    await admin.query(`GRANT USAGE ON SCHEMA ${id(schema)} TO ${id(papel)}`);
    await admin.query(
      `GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA ${id(schema)} TO ${id(papel)}`,
    );
  }
}

async function limpar(): Promise<void> {
  const id = (nome: string): string => pg.escapeIdentifier(nome);
  await admin.query(`DROP SCHEMA IF EXISTS ${id(SCHEMA)} CASCADE`);
  await admin.query(`DROP SCHEMA IF EXISTS ${id(SCHEMA_B)} CASCADE`);
  for (const papel of [
    PAPEL_DO_CLIENTE,
    PAPEL_DO_CLIENTE_B,
    CREDENCIAL,
    SEGUNDA_MAO,
    EXECUTOR,
    GRUPO,
  ]) {
    await admin.query(`DROP ROLE IF EXISTS ${id(papel)}`);
  }
}

before(async () => {
  if (PULAR || ADMIN_URL === undefined) return;
  admin = new pg.Client({ connectionString: ADMIN_URL });
  await admin.connect();
  const { rows } = await admin.query<{ papel: string; super: boolean }>(
    'select current_user::text as papel, rolsuper as "super" from pg_catalog.pg_roles where rolname = current_user',
  );
  operador = rows[0]?.papel ?? '';
  operadorESuperusuario = rows[0]?.super ?? false;
  await provisionar();
});

after(async () => {
  if (PULAR) return;
  for (const raiz of aFechar) await raiz.destroy();
  await limpar();
  await admin.end();
});

/** Caso 1: a credencial correta sobe, e a conferência não deixa estado de sessão para trás. */
test('caso 1: credencial da aplicação passa nas oito perguntas', { skip: PULAR }, async () => {
  const raiz = raizComo(urlDe(ADMIN_URL ?? '', CREDENCIAL, SENHA));
  const { sink, fatos } = coletor();

  const respostas = await assertAppCredential(raiz, { groupRole: GRUPO, factSink: sink });

  assert.equal(respostas.currentRole, CREDENCIAL);
  assert.equal(respostas.sessionRole, CREDENCIAL);
  assert.deepEqual(respostas.inheritableGrants, []);
  assert.deepEqual(respostas.nakedSchemaReach, [], 'a credencial não alcança schema nenhum nua');
  assert.deepEqual(respostas.assumedInheritableGrants, [], 'nenhum papel assumido herda outro');
  assert.deepEqual(
    respostas.assumedSchemaReach,
    [],
    'cada papel alcança o schema dele e nenhum outro — é aqui que a exclusão por \'app_\' || nspname se prova pelo que ela deixa passar',
  );
  assert.deepEqual(respostas.assumedRoleAttributes, [], 'nenhum papel assumido tem atributo de travessia');
  assert.deepEqual(
    respostas.delegatedDependencies,
    [],
    'a dependência de cada objeto no próprio schema (chave, tipo de linha) não é acusada',
  );
  assert.deepEqual(respostas.definerRoutines, []);
  assert.equal(fatos.length, 1);
  assert.equal(fatos[0]?.kind, 'startup_credential_verified');
  assert.deepEqual(fatos[0]?.verdict, {
    role: 'ok',
    login: 'ok',
    group: 'ok',
    inheritance: 'ok',
    reach: 'ok',
    assumed: 'ok',
    assumedReach: 'ok',
    delegation: 'ok',
  });

  const depois = await sql<{ usuario: string }>`select current_user as usuario`.execute(raiz);
  assert.equal(depois.rows[0]?.usuario, CREDENCIAL, 'a pergunta não troca o papel da conexão');
});

/** Caso 2: hoje sobe e falha na primeira transação de cliente, com `42501`. Depois, não sobe. */
test('caso 2: apontar para o executor recusa a subida', { skip: PULAR }, async () => {
  const raiz = raizComo(urlDe(ADMIN_URL ?? '', EXECUTOR, SENHA));
  const { sink, fatos } = coletor();

  await assert.rejects(
    () => assertAppCredential(raiz, { groupRole: GRUPO, factSink: sink }),
    (erro: unknown) => {
      assert.equal(erro instanceof AppCredentialError, true);
      const recusas = (erro as AppCredentialError).refusals;
      assert.equal(recusas.some((r) => r.question === 'group'), true);
      assert.match((erro as AppCredentialError).message, /ADMIN OPTION/);
      return true;
    },
  );
  assert.equal(fatos[0]?.kind, 'startup_credential_refused');
  assert.equal(fatos[0]?.verdict.group, 'refused');
});

/**
 * Caso 3: hoje sobe, funciona e fica contido dentro da transação (`Q11`). É a mudança de
 * comportamento que o item compra, e ela quebra de propósito quem aponta para `postgres`.
 *
 * **Falha, não pula, quando o banco de teste não é servido por superusuário.** Até 2026-09-12 este
 * caso se pulava sozinho, e pulo silencioso em modo de gate é o `SUB-03` por outro caminho: a linha
 * que se lê primeiro diz `0 fail` e a propriedade não foi exercida. O superusuário de verdade é o
 * que este caso acrescenta ao que já está provado sem banco, então sem ele não há caso.
 */
test('caso 3: apontar para superusuário recusa a subida', { skip: PULAR }, async () => {
  assert.equal(
    operadorESuperusuario,
    true,
    `FORJA_TEST_DATABASE_URL é servida por "${operador}", que não é superusuário. Ela aponta para ` +
      'quem faz a §7.2, que é o operador do cluster; sem superusuário este caso não tem como montar ' +
      'o estado que ele prova',
  );
  const raiz = raizComo(ADMIN_URL ?? '');
  await assert.rejects(
    () => assertAppCredential(raiz, { groupRole: GRUPO, factSink: coletor().sink }),
    (erro: unknown) => {
      assert.match((erro as AppCredentialError).message, /superusuário/);
      assert.match((erro as AppCredentialError).message, /não é membro/);
      return true;
    },
  );
});

/**
 * Caso 4, o `PAP-13` visto daqui: a credencial correta, mais uma concessão herdável emitida pela
 * **segunda mão** — quem administra papel sem ser o executor. Antes da conferência, o servidor
 * subia, servia, e nada do lado dele acusava.
 *
 * O `REVOKE … GRANTED BY` no fim prova a outra metade: a linha da segunda mão sai e a do executor
 * fica, que é o que faz a subida voltar a passar.
 */
test('caso 4: concessão herdável de outra mão derruba a subida', { skip: PULAR }, async () => {
  const id = (nome: string): string => pg.escapeIdentifier(nome);
  const raiz = raizComo(urlDe(ADMIN_URL ?? '', CREDENCIAL, SENHA));
  const mao = new pg.Client({ connectionString: urlDe(ADMIN_URL ?? '', SEGUNDA_MAO, SENHA) });
  await mao.connect();

  try {
    await mao.query(`GRANT ${id(PAPEL_DO_CLIENTE)} TO ${id(CREDENCIAL)} WITH INHERIT TRUE`);
    const linhas = await admin.query<{ n: string }>(
      'select count(*)::text as n from pg_catalog.pg_auth_members where roleid = $1::regrole and member = $2::regrole',
      [PAPEL_DO_CLIENTE, CREDENCIAL],
    );
    assert.equal(linhas.rows[0]?.n, '2', 'a chave é (roleid, member, grantor): duas mãos, duas linhas');

    await assert.rejects(
      () => assertAppCredential(raiz, { groupRole: GRUPO, factSink: coletor().sink }),
      (erro: unknown) => {
        const mensagem = (erro as AppCredentialError).message;
        assert.equal(
          (erro as AppCredentialError).refusals.some((r) => r.question === 'inheritance'),
          true,
        );
        assert.match(mensagem, new RegExp(`${PAPEL_DO_CLIENTE} \\(concedido por ${SEGUNDA_MAO}\\)`));
        return true;
      },
    );
    await mao.query(
      `REVOKE ${id(PAPEL_DO_CLIENTE)} FROM ${id(CREDENCIAL)} GRANTED BY ${id(SEGUNDA_MAO)}`,
    );
  } finally {
    await mao.end();
  }

  const respostas = await assertAppCredential(raiz, { groupRole: GRUPO, factSink: coletor().sink });
  assert.deepEqual(respostas.inheritableGrants, [], 'a concessão legítima do executor continua de pé');
});

/**
 * Caso 6, o `SUB-01`: o reflexo diante de `permission denied for schema`. Medido em 2026-09-12,
 * antes da quinta pergunta existir: o servidor subia com as quatro respondendo `ok`,
 * `inheritableGrants` saía `[]`, e a credencial **nua** lia a tabela do cliente.
 */
test('caso 6: USAGE concedido direto à credencial derruba a subida', { skip: PULAR }, async () => {
  const id = (nome: string): string => pg.escapeIdentifier(nome);
  const raiz = raizComo(urlDe(ADMIN_URL ?? '', CREDENCIAL, SENHA));

  await admin.query(`GRANT USAGE ON SCHEMA ${id(SCHEMA_B)} TO ${id(CREDENCIAL)}`);
  try {
    await assert.rejects(
      () => assertAppCredential(raiz, { groupRole: GRUPO, factSink: coletor().sink }),
      (erro: unknown) => {
        const recusas = (erro as AppCredentialError).refusals;
        assert.equal(recusas.some((r) => r.question === 'reach'), true);
        assert.match((erro as AppCredentialError).message, new RegExp(`${SCHEMA_B} \\(USAGE\\)`));
        return true;
      },
    );
  } finally {
    await admin.query(`REVOKE ALL ON SCHEMA ${id(SCHEMA_B)} FROM ${id(CREDENCIAL)}`);
  }

  const respostas = await assertAppCredential(raiz, { groupRole: GRUPO, factSink: coletor().sink });
  assert.deepEqual(respostas.nakedSchemaReach, [], 'revogado o privilégio, a subida volta a passar');
});

/**
 * Caso 7, a variante do `SUB-01` que **não nomeia beneficiário nenhum**. É a que escapa de qualquer
 * pergunta cujo sujeito seja um papel: `PUBLIC` não é papel, é todo mundo.
 */
test('caso 7: USAGE concedido a PUBLIC derruba a subida igual', { skip: PULAR }, async () => {
  const id = (nome: string): string => pg.escapeIdentifier(nome);
  const raiz = raizComo(urlDe(ADMIN_URL ?? '', CREDENCIAL, SENHA));

  await admin.query(`GRANT USAGE ON SCHEMA ${id(SCHEMA_B)} TO PUBLIC`);
  try {
    await assert.rejects(
      () => assertAppCredential(raiz, { groupRole: GRUPO, factSink: coletor().sink }),
      (erro: unknown) => {
        assert.match((erro as AppCredentialError).message, new RegExp(`${SCHEMA_B} \\(USAGE\\)`));
        assert.match((erro as AppCredentialError).message, /PUBLIC/);
        return true;
      },
    );
  } finally {
    await admin.query(`REVOKE ALL ON SCHEMA ${id(SCHEMA_B)} FROM PUBLIC`);
  }
});

/**
 * Caso 8, o `SUB-02`, e o pior dos três: o alcance está **dentro do handle que a borda entrega à
 * rota**. Medido em 2026-09-12: com esta única linha, `BEGIN; SET LOCAL ROLE app_t_<a>;
 * SELECT … FROM t_<b>.orders` devolve a venda do outro cliente, sem erro nenhum e sem tocar em
 * código nosso, enquanto a subida responde `inheritableGrants: []` e emite `verified`.
 *
 * Emitido **pelo executor**, que não é superusuário — é assim que o auditor o montou, e é quem
 * emite concessão entre papéis de cliente em produção.
 */
test('caso 8: papel de cliente herdando outro derruba a subida', { skip: PULAR }, async () => {
  const id = (nome: string): string => pg.escapeIdentifier(nome);
  const raiz = raizComo(urlDe(ADMIN_URL ?? '', CREDENCIAL, SENHA));
  const exec = new pg.Client({ connectionString: urlDe(ADMIN_URL ?? '', EXECUTOR, SENHA) });
  await exec.connect();

  try {
    await exec.query(
      `GRANT ${id(PAPEL_DO_CLIENTE_B)} TO ${id(PAPEL_DO_CLIENTE)} WITH INHERIT TRUE`,
    );
    await assert.rejects(
      () => assertAppCredential(raiz, { groupRole: GRUPO, factSink: coletor().sink }),
      (erro: unknown) => {
        const recusas = (erro as AppCredentialError).refusals;
        assert.equal(recusas.some((r) => r.question === 'assumed'), true);
        assert.match(
          (erro as AppCredentialError).message,
          new RegExp(`${PAPEL_DO_CLIENTE} herda ${PAPEL_DO_CLIENTE_B} \\(concedido por ${EXECUTOR}\\)`),
        );
        return true;
      },
    );
    await exec.query(`REVOKE ${id(PAPEL_DO_CLIENTE_B)} FROM ${id(PAPEL_DO_CLIENTE)}`);
  } finally {
    await exec.end();
  }

  const respostas = await assertAppCredential(raiz, { groupRole: GRUPO, factSink: coletor().sink });
  assert.deepEqual(respostas.assumedInheritableGrants, [], 'revogada a herança, a subida passa');
});

/**
 * Caso 9, o `SUB-05` e a razão pela qual o `SUB-02` foi reaberto: o achado antigo foi fechado pelo
 * **mecanismo** que ele nomeia (concessão de papel) e o **desfecho** que ele descreve continuou de
 * pé por outro. O estado é o **erro de digitação** da §7.3 — duas linhas seguidas carregam o mesmo
 * slug, e trocar um deles é uma tecla.
 *
 * Este caso prova as duas metades, nesta ordem: primeiro que o estado **vaza de verdade** pelo
 * caminho normal de requisição (`BEGIN; SET LOCAL ROLE app_<a>; SELECT … FROM <b>.orders` devolve a
 * venda de `b`), e só então que a subida passou a recusá-lo. Recusa sem o vazamento à vista prova
 * que a cláusula dispara, não que ela guarda alguma coisa.
 *
 * Em produção quem emite a linha é o **executor não-superusuário** — medido pelo auditor e por mim
 * em 2026-09-12 —, e aqui é o operador, porque aqui o schema é dele. Para `has_schema_privilege` o
 * concedente não existe.
 */
test('caso 9: papel de cliente com USAGE no schema alheio derruba a subida', { skip: PULAR }, async () => {
  const id = (nome: string): string => pg.escapeIdentifier(nome);
  const raiz = raizComo(urlDe(ADMIN_URL ?? '', CREDENCIAL, SENHA));

  await admin.query(`GRANT USAGE ON SCHEMA ${id(SCHEMA_B)} TO ${id(PAPEL_DO_CLIENTE)}`);
  await admin.query(`GRANT SELECT ON ${id(SCHEMA_B)}.orders TO ${id(PAPEL_DO_CLIENTE)}`);
  try {
    const lido = await raiz.transaction().execute(async (trx) => {
      await sql`select set_config('role', ${PAPEL_DO_CLIENTE}, true)`.execute(trx);
      const leitura = await sql<{ total_cents: number }>`select total_cents from ${sql.table(
        `${SCHEMA_B}.orders`,
      )} where id = 1`.execute(trx);
      return leitura.rows[0]?.total_cents;
    });
    assert.equal(lido, 222, 'o estado vaza mesmo: o cliente A lê a venda do cliente B');

    await assert.rejects(
      () => assertAppCredential(raiz, { groupRole: GRUPO, factSink: coletor().sink }),
      (erro: unknown) => {
        const recusas = (erro as AppCredentialError).refusals;
        assert.equal(recusas.some((r) => r.question === 'assumedReach'), true);
        assert.match(
          (erro as AppCredentialError).message,
          new RegExp(`${PAPEL_DO_CLIENTE} -> ${SCHEMA_B} \\(USAGE\\)`),
        );
        return true;
      },
    );
  } finally {
    await admin.query(`REVOKE ALL ON ${id(SCHEMA_B)}.orders FROM ${id(PAPEL_DO_CLIENTE)}`);
    await admin.query(`REVOKE ALL ON SCHEMA ${id(SCHEMA_B)} FROM ${id(PAPEL_DO_CLIENTE)}`);
  }

  const respostas = await assertAppCredential(raiz, { groupRole: GRUPO, factSink: coletor().sink });
  assert.deepEqual(
    respostas.assumedSchemaReach,
    [],
    'revogado o privilégio, a subida volta a passar — e o alcance de cada papel no schema dele não é acusado',
  );
});

/**
 * Caso 10, a variante (c) do `SUB-05`: atributo, não privilégio. `ALTER ROLE … SUPERUSER` não
 * aparece em `nspacl` nem em `pg_auth_members`, e a terceira pergunta lê `rolsuper` **só** de
 * `current_user`.
 *
 * Medido em 2026-09-12: papel superusuário responde `t` em `has_schema_privilege` para todo schema,
 * então a recusa de alcance também dispara — e é por isso que a do atributo vem primeiro. Quem lê a
 * mensagem de cima para baixo precisa do `ALTER ROLE`, não de um `REVOKE` que não muda nada.
 */
test('caso 10: papel de cliente com atributo de superusuário derruba a subida', { skip: PULAR }, async () => {
  const id = (nome: string): string => pg.escapeIdentifier(nome);
  assert.equal(
    operadorESuperusuario,
    true,
    `FORJA_TEST_DATABASE_URL é servida por "${operador}", que não é superusuário. Só superusuário ` +
      'emite ALTER ROLE … SUPERUSER, então sem ele este caso não tem como montar o estado que prova',
  );
  const raiz = raizComo(urlDe(ADMIN_URL ?? '', CREDENCIAL, SENHA));

  await admin.query(`ALTER ROLE ${id(PAPEL_DO_CLIENTE)} SUPERUSER`);
  try {
    await assert.rejects(
      () => assertAppCredential(raiz, { groupRole: GRUPO, factSink: coletor().sink }),
      (erro: unknown) => {
        const recusas = (erro as AppCredentialError).refusals;
        const ondeAtributo = recusas.findIndex((r) => r.reason.includes('SUPERUSER)'));
        const ondePrivilegio = recusas.findIndex((r) => r.reason.includes('REVOKE ALL ON SCHEMA'));

        assert.equal(recusas[ondeAtributo]?.question, 'assumedReach');
        assert.match(
          recusas[ondeAtributo]?.reason ?? '',
          new RegExp(`${PAPEL_DO_CLIENTE} \\(SUPERUSER\\)`),
        );
        assert.match(recusas[ondeAtributo]?.reason ?? '', /NOSUPERUSER/);
        assert.equal(
          ondeAtributo < ondePrivilegio,
          true,
          'o ato do atributo vem antes do de privilégio: superusuário alcança todo schema, e o REVOKE não muda nada',
        );
        return true;
      },
    );
  } finally {
    await admin.query(`ALTER ROLE ${id(PAPEL_DO_CLIENTE)} NOSUPERUSER`);
  }

  const respostas = await assertAppCredential(raiz, { groupRole: GRUPO, factSink: coletor().sink });
  assert.deepEqual(respostas.assumedRoleAttributes, []);
});

/**
 * Caso 11, o `SUB-08` na coluna `session_user` **e** na coluna `rolcanlogin`: uma conexão que chega
 * com papel já assumido. As duas colunas sustentam recusa e nenhum teste as exercia — mutá-las no
 * `dist` deixava o gate em `72 · 72 pass`, medido em 2026-09-12.
 *
 * `options=-c role=<papel>` na URL é o ataque direto: se as outras perguntas respondessem sobre o
 * papel assumido em vez do que autenticou, a conferência estaria olhando para o lugar errado. O
 * estado prova as duas de uma vez, porque papel de cliente é `NOLOGIN` por construção.
 */
test('caso 11: conexão que chega com papel já assumido recusa por role e por login', { skip: PULAR }, async () => {
  const url = new URL(urlDe(ADMIN_URL ?? '', CREDENCIAL, SENHA));
  url.searchParams.set('options', `-c role=${PAPEL_DO_CLIENTE}`);
  const raiz = raizComo(url.toString());
  const { sink, fatos } = coletor();

  await assert.rejects(
    () => assertAppCredential(raiz, { groupRole: GRUPO, factSink: sink }),
    (erro: unknown) => {
      const recusas = (erro as AppCredentialError).refusals;
      const doPapel = recusas.find((r) => r.question === 'role');
      assert.notEqual(doPapel, undefined, 'session_user difere de current_user e isso é recusa');
      assert.match(doPapel?.reason ?? '', new RegExp(`entrou como "${CREDENCIAL}"`));
      assert.match(doPapel?.reason ?? '', new RegExp(`está como "${PAPEL_DO_CLIENTE}"`));

      const doLogin = recusas.find((r) => r.question === 'login');
      assert.notEqual(doLogin, undefined, 'papel de cliente é NOLOGIN, e a conexão está como ele');
      assert.match(doLogin?.reason ?? '', /não tem LOGIN/);
      return true;
    },
  );
  assert.equal(fatos[0]?.verdict.role, 'refused');
  assert.equal(fatos[0]?.verdict.login, 'refused');
});

/**
 * Caso 12, o `SUB-08` na coluna do privilégio `CREATE`: ele é perguntado porque `CREATE` **sem**
 * `USAGE` ainda deixa criar objeto no schema alheio, e nenhum teste exercia isso — tirar `('CREATE')`
 * do universo deixava o gate em `72 · 72 pass`, medido em 2026-09-12.
 *
 * O estado é real e está medido aqui dentro: a credencial nua cria tabela em `SCHEMA_B`. Ela **não**
 * consegue derrubá-la, porque `DROP` resolve o nome e resolver nome exige `USAGE` — por isso a
 * limpeza é do operador.
 */
test('caso 12: CREATE sem USAGE derruba a subida, e o estado cria objeto no schema alheio', { skip: PULAR }, async () => {
  const id = (nome: string): string => pg.escapeIdentifier(nome);
  const raiz = raizComo(urlDe(ADMIN_URL ?? '', CREDENCIAL, SENHA));
  const nua = new pg.Client({ connectionString: urlDe(ADMIN_URL ?? '', CREDENCIAL, SENHA) });
  await nua.connect();

  await admin.query(`GRANT CREATE ON SCHEMA ${id(SCHEMA_B)} TO ${id(CREDENCIAL)}`);
  try {
    await nua.query(`CREATE TABLE ${id(SCHEMA_B)}.isca_do_caso_12(x int)`);

    await assert.rejects(
      () => assertAppCredential(raiz, { groupRole: GRUPO, factSink: coletor().sink }),
      (erro: unknown) => {
        const recusas = (erro as AppCredentialError).refusals;
        assert.equal(recusas.some((r) => r.question === 'reach'), true);
        assert.match((erro as AppCredentialError).message, new RegExp(`${SCHEMA_B} \\(CREATE\\)`));
        return true;
      },
    );
  } finally {
    await nua.end();
    await admin.query(`DROP TABLE IF EXISTS ${id(SCHEMA_B)}.isca_do_caso_12`);
    await admin.query(`REVOKE ALL ON SCHEMA ${id(SCHEMA_B)} FROM ${id(CREDENCIAL)}`);
  }

  const respostas = await assertAppCredential(raiz, { groupRole: GRUPO, factSink: coletor().sink });
  assert.deepEqual(respostas.nakedSchemaReach, []);
});

/**
 * Caso 13, o `SUB-06`: o universo das perguntas de alcance parava em `t\_%`, e é em `platform` que
 * moram o registro de clientes e o livro-razão. `db/papeis-e-credencial.md` §1 escreve por extenso
 * que *nenhum papel de aplicação recebe `USAGE` em `platform`* — era o único invariante de alcance
 * que o repositório tinha, e o único que esta camada não perguntava.
 *
 * Medido em 2026-09-12, antes da correção: a subida respondia os seis `ok` e a credencial **nua**
 * lia `platform.tenants` inteiro.
 *
 * **O schema de controle é o único objeto deste arquivo com nome fixo**, então ele é o único que
 * pode já existir no banco de teste. Por isso: cria só se faltar, e derruba só o que criou, com
 * `RESTRICT` — um `CASCADE` aqui levaria junto um `platform` de verdade, que é a carteira de
 * clientes de alguém.
 */
test('caso 13: alcance no schema de controle derruba a subida', { skip: PULAR }, async () => {
  const id = (nome: string): string => pg.escapeIdentifier(nome);
  const raiz = raizComo(urlDe(ADMIN_URL ?? '', CREDENCIAL, SENHA));

  /**
   * Quem serve a variável precisa poder **conceder** no schema de controle, e isso é ou ser dono
   * dele, ou poder criá-lo. Sem isso o caso falha com `permission denied for schema` cru, que não
   * diz a ninguém o que faltou — a mesma razão pela qual o caso 3 exige superusuário por assert, e
   * não por pulo.
   */
  const controle = await admin.query<{ existe: boolean; posso: boolean }>(
    `select (n.oid is not null) as existe,
            coalesce(pg_catalog.pg_has_role(current_user, n.nspowner, 'USAGE'),
                     pg_catalog.has_database_privilege(current_user, current_database(), 'CREATE'))
              as posso
       from (select 1) as sempre
       left join pg_catalog.pg_namespace n on n.nspname = $1`,
    [CONTROL_SCHEMA],
  );
  assert.equal(
    controle.rows[0]?.posso,
    true,
    `FORJA_TEST_DATABASE_URL é servida por "${operador}", que não é dono de "${CONTROL_SCHEMA}" e ` +
      'não pode criá-lo. Este caso monta alcance no schema de controle, e conceder ali exige uma ' +
      'das duas coisas',
  );

  const criadoAqui = controle.rows[0]?.existe !== true;
  if (criadoAqui) await admin.query(`CREATE SCHEMA ${id(CONTROL_SCHEMA)}`);

  await admin.query(`GRANT USAGE ON SCHEMA ${id(CONTROL_SCHEMA)} TO ${id(CREDENCIAL)}`);
  try {
    await assert.rejects(
      () => assertAppCredential(raiz, { groupRole: GRUPO, factSink: coletor().sink }),
      (erro: unknown) => {
        const recusas = (erro as AppCredentialError).refusals;
        assert.equal(recusas.some((r) => r.question === 'reach'), true);
        assert.match(
          (erro as AppCredentialError).message,
          new RegExp(`${CONTROL_SCHEMA} \\(USAGE\\)`),
        );
        return true;
      },
    );
  } finally {
    await admin.query(`REVOKE ALL ON SCHEMA ${id(CONTROL_SCHEMA)} FROM ${id(CREDENCIAL)}`);
    if (criadoAqui) await admin.query(`DROP SCHEMA ${id(CONTROL_SCHEMA)} RESTRICT`);
  }

  const respostas = await assertAppCredential(raiz, { groupRole: GRUPO, factSink: coletor().sink });
  assert.deepEqual(respostas.nakedSchemaReach, []);
});

/**
 * Caso 14, a terceira via de alcance, e a que não é concessão nem atributo: **dono**.
 * `ALTER SCHEMA t_<b> OWNER TO app_t_<a>` é uma linha que o executor emite sem ser superusuário —
 * ele é dono dos schemas de cliente em produção —, e dono alcança o schema dele sem entrada em ACL
 * nenhuma.
 *
 * Medido em 2026-09-12, PostgreSQL 16.15, num schema **sem ACL explícito**: depois do
 * `ALTER SCHEMA … OWNER TO`, `has_schema_privilege` passa de `f` para `t` e `nspacl` continua
 * **nulo** — `aclexplode` devolve zero linhas. É por isso que a pergunta é `has_schema_privilege` e
 * não uma varredura de `nspacl`, que seria linear em vez de quadrática e cega exatamente nesse
 * estado. (Num schema que já recebeu a §7.3 o `nspacl` não é nulo, e o servidor reescreve a entrada
 * do dono na troca — medido aqui, três entradas. O buraco da varredura é o schema nunca concedido.)
 */
test('caso 14: papel de cliente dono do schema alheio derruba a subida', { skip: PULAR }, async () => {
  const id = (nome: string): string => pg.escapeIdentifier(nome);
  const raiz = raizComo(urlDe(ADMIN_URL ?? '', CREDENCIAL, SENHA));

  /**
   * `ALTER SCHEMA … OWNER TO x` exige poder assumir `x` **e** ser dono do schema. Conferido antes,
   * pela mesma razão dos casos 3, 10 e 13: sem isso o caso falha com `must be able to SET ROLE`
   * cru, que não diz a ninguém o que faltou.
   */
  const dono = await admin.query<{ nome: string; posso: boolean }>(
    `select r.rolname as nome,
            pg_catalog.pg_has_role(current_user, n.nspowner, 'USAGE')
              and pg_catalog.pg_has_role(current_user, $2::regrole::oid, 'SET') as posso
       from pg_catalog.pg_namespace n
       join pg_catalog.pg_roles r on r.oid = n.nspowner
      where n.nspname = $1`,
    [SCHEMA_B, PAPEL_DO_CLIENTE],
  );
  const donoOriginal = dono.rows[0]?.nome ?? '';
  assert.notEqual(donoOriginal, '', 'sem saber o dono original não dá para devolver o schema');
  assert.equal(
    dono.rows[0]?.posso,
    true,
    `FORJA_TEST_DATABASE_URL é servida por "${operador}", que não é dono de "${SCHEMA_B}" ou não ` +
      `consegue assumir "${PAPEL_DO_CLIENTE}". ALTER SCHEMA … OWNER TO exige as duas coisas, e este ` +
      'caso monta a transferência de posse',
  );

  await admin.query(`ALTER SCHEMA ${id(SCHEMA_B)} OWNER TO ${id(PAPEL_DO_CLIENTE)}`);
  try {
    await assert.rejects(
      () => assertAppCredential(raiz, { groupRole: GRUPO, factSink: coletor().sink }),
      (erro: unknown) => {
        const recusas = (erro as AppCredentialError).refusals;
        assert.equal(recusas.some((r) => r.question === 'assumedReach'), true);
        assert.match(
          (erro as AppCredentialError).message,
          new RegExp(`${PAPEL_DO_CLIENTE} -> ${SCHEMA_B} \\(USAGE\\)`),
        );
        return true;
      },
    );
  } finally {
    await admin.query(`ALTER SCHEMA ${id(SCHEMA_B)} OWNER TO ${id(donoOriginal)}`);
  }

  const respostas = await assertAppCredential(raiz, { groupRole: GRUPO, factSink: coletor().sink });
  assert.deepEqual(respostas.assumedSchemaReach, [], 'devolvido o schema ao dono, a subida passa');
});

/**
 * Caso 15, o `SUB-11`: o `CREATE` da sétima pergunta, na coluna do papel assumido. O caso 12 mata a
 * mutação que tira `('CREATE')` da quinta pergunta, que tem sujeito na credencial; nesta coluna a
 * mesma mutação sobrevivia com `83/83` (medido pelo auditor em 2026-09-23).
 *
 * O estado é real e está medido aqui dentro: com `CREATE` sem `USAGE`, a transação de A cria tabela
 * no schema de B. O `USAGE` fica de fora de propósito, porque é ele que as outras colunas já pegam.
 */
test('caso 15: papel de cliente com CREATE no schema alheio derruba a subida', { skip: PULAR }, async () => {
  const id = (nome: string): string => pg.escapeIdentifier(nome);
  const raiz = raizComo(urlDe(ADMIN_URL ?? '', CREDENCIAL, SENHA));

  await admin.query(`GRANT CREATE ON SCHEMA ${id(SCHEMA_B)} TO ${id(PAPEL_DO_CLIENTE)}`);
  try {
    await raiz.transaction().execute(async (trx) => {
      await sql`select set_config('role', ${PAPEL_DO_CLIENTE}, true)`.execute(trx);
      await sql`create table ${sql.table(`${SCHEMA_B}.isca_do_caso_15`)} (x int)`.execute(trx);
      const dono = await sql<{ dono: string }>`select tableowner as dono from pg_catalog.pg_tables
         where schemaname = ${SCHEMA_B} and tablename = 'isca_do_caso_15'`.execute(trx);
      assert.equal(dono.rows[0]?.dono, PAPEL_DO_CLIENTE, 'o estado vaza: A cria objeto no schema de B');
      // A isca não sobrevive ao caso: a transação desfaz, e não há o que o operador limpar.
      throw new DesfazerTransacao();
    }).catch((erro: unknown) => {
      if (!(erro instanceof DesfazerTransacao)) throw erro;
    });

    await assert.rejects(
      () => assertAppCredential(raiz, { groupRole: GRUPO, factSink: coletor().sink }),
      (erro: unknown) => {
        const recusas = (erro as AppCredentialError).refusals;
        assert.equal(recusas.some((r) => r.question === 'assumedReach'), true);
        const mensagem = (erro as AppCredentialError).message;
        assert.match(mensagem, new RegExp(`${PAPEL_DO_CLIENTE} -> ${SCHEMA_B} \\(CREATE\\)`));
        assert.equal(
          mensagem.includes(`${PAPEL_DO_CLIENTE} -> ${SCHEMA_B} (USAGE)`),
          false,
          'só o CREATE foi concedido: é ele que esta coluna tem de ver sozinha',
        );
        return true;
      },
    );
  } finally {
    await admin.query(`REVOKE ALL ON SCHEMA ${id(SCHEMA_B)} FROM ${id(PAPEL_DO_CLIENTE)}`);
  }

  const respostas = await assertAppCredential(raiz, { groupRole: GRUPO, factSink: coletor().sink });
  assert.deepEqual(respostas.assumedSchemaReach, []);
});

/**
 * Caso 16, o `SUB-12` do lado de cá: papel predefinido de leitura total, concedido ao papel
 * assumido e à credencial. A via "papel `LOGIN` qualquer no grupo com `pg_read_all_data`" é do
 * `verify`; esta camada responde pelos papéis que **este processo** assume, e o auditor mediu em
 * 2026-09-23 que ela já acusava. Faltava o caso que o prova.
 *
 * Só superusuário concede papel predefinido (o executor leva recusa, medido pelo auditor), então o
 * caso exige o operador superusuário, como os casos 3 e 10.
 */
test('caso 16: papel predefinido de leitura total derruba a subida, no papel assumido e na credencial', { skip: PULAR }, async () => {
  const id = (nome: string): string => pg.escapeIdentifier(nome);
  const PREDEFINIDO = 'pg_read_all_data';
  assert.equal(
    operadorESuperusuario,
    true,
    `FORJA_TEST_DATABASE_URL é servida por "${operador}", que não é superusuário. Só superusuário ` +
      `concede ${PREDEFINIDO}, então sem ele este caso não tem como montar o estado que prova`,
  );
  const raiz = raizComo(urlDe(ADMIN_URL ?? '', CREDENCIAL, SENHA));

  await admin.query(`GRANT ${PREDEFINIDO} TO ${id(PAPEL_DO_CLIENTE)} WITH INHERIT TRUE`);
  try {
    const lido = await raiz.transaction().execute(async (trx) => {
      await sql`select set_config('role', ${PAPEL_DO_CLIENTE}, true)`.execute(trx);
      const leitura = await sql<{ total_cents: number }>`select total_cents from ${sql.table(
        `${SCHEMA_B}.orders`,
      )} where id = 1`.execute(trx);
      return leitura.rows[0]?.total_cents;
    });
    assert.equal(lido, 222, 'o estado vaza: com leitura total, A lê a venda de B');

    await assert.rejects(
      () => assertAppCredential(raiz, { groupRole: GRUPO, factSink: coletor().sink }),
      (erro: unknown) => {
        const recusas = (erro as AppCredentialError).refusals;
        assert.equal(recusas.some((r) => r.question === 'assumed'), true);
        assert.equal(recusas.some((r) => r.question === 'assumedReach'), true);
        return true;
      },
    );
    // A mensagem nomeia cinco e resume o resto, e o papel predefinido alcança todo schema do banco
    // de teste: o nome é conferido na resposta inteira do catálogo, não no recorte da mensagem.
    const linha = (await credentialQuery(GRUPO).execute(raiz)).rows[0];
    assert.equal(
      linha?.assumed_inheritable_grants.some((g) => g.startsWith(`${PAPEL_DO_CLIENTE} herda ${PREDEFINIDO} `)),
      true,
    );
    assert.equal(linha?.assumed_schema_reach.includes(`${PREDEFINIDO} -> ${SCHEMA_B} (USAGE)`), true);
  } finally {
    await admin.query(`REVOKE ${PREDEFINIDO} FROM ${id(PAPEL_DO_CLIENTE)}`);
  }

  await admin.query(`GRANT ${PREDEFINIDO} TO ${id(CREDENCIAL)}`);
  try {
    await assert.rejects(
      () => assertAppCredential(raiz, { groupRole: GRUPO, factSink: coletor().sink }),
      (erro: unknown) => {
        const recusas = (erro as AppCredentialError).refusals;
        assert.equal(recusas.some((r) => r.question === 'assumedReach'), true);
        return true;
      },
    );
    const linha = (await credentialQuery(GRUPO).execute(raiz)).rows[0];
    assert.equal(linha?.assumed_schema_reach.includes(`${PREDEFINIDO} -> ${SCHEMA_B} (USAGE)`), true);
  } finally {
    await admin.query(`REVOKE ${PREDEFINIDO} FROM ${id(CREDENCIAL)}`);
  }

  const respostas = await assertAppCredential(raiz, { groupRole: GRUPO, factSink: coletor().sink });
  assert.deepEqual(respostas.assumedSchemaReach, []);
  assert.deepEqual(respostas.assumedInheritableGrants, []);
});

/**
 * Caso 5: banco de pé sem o ato do operador. O grupo entra por um nome que não existe neste
 * cluster, em vez de derrubar o grupo do arranjo — do ponto de vista da pergunta o estado é o
 * mesmo (`to_regrole` devolve nulo), e derrubar exigiria desmontar as concessões dos outros casos.
 */
test('caso 5: grupo inexistente manda rodar a §7.2 inteira', { skip: PULAR }, async () => {
  const raiz = raizComo(urlDe(ADMIN_URL ?? '', CREDENCIAL, SENHA));
  await assert.rejects(
    () => assertAppCredential(raiz, { groupRole: `${GRUPO}_ausente`, factSink: coletor().sink }),
    (erro: unknown) => {
      assert.match((erro as AppCredentialError).message, /não existe neste cluster/);
      assert.match((erro as AppCredentialError).message, /inteira/);
      return true;
    },
  );
});

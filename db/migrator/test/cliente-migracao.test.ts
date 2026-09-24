import { test, describe, before, after, type TestContext } from 'node:test';
import assert from 'node:assert/strict';
import { runExecutor } from './support/executor.js';
import {
  APP_CREDENTIAL_ROLE,
  comoPapel,
  createDatabase,
  motivoDeNaoConectar,
  skipWithoutPostgres,
  withClient,
  type DisposableDatabase,
} from './support/postgres.js';
import { buildMigrationsDir, tenantMigration } from './support/tree.js';
import {
  criarUnidade,
  falha,
  mudarOperacao,
  novoTerminal,
  publicarConfiguracao,
  realTenantFiles,
  renomear,
} from './support/cliente.js';
import { structurePrint } from '../src/structure-print.js';

/**
 * A stream `tenant` do repositório (T-0022, `F-021`) sob os três testes de `migrations.md` §3 e o
 * aceite 6 de `F-021`: schema vazio, schema com dado, rodada duas vezes, e o papel de um cliente
 * lendo o estabelecimento do outro.
 */

const TABELAS = [
  'act_support_sources',
  'establishment_configurations',
  'establishment_name_changes',
  'establishment_operation_changes',
  'establishments',
  'roles',
  'sales_enabled_terminal_facts',
  'terminals',
];

/** Uma coluna que existe em cada tabela, para o UPDATE de sonda. As de fato têm todas `received_at`. */
const COLUNA_DE_SONDA: Readonly<Record<string, string>> = {
  roles: 'description',
  act_support_sources: 'description',
  terminals: 'first_fact_sequence',
};

async function tabelasDe(url: string, schema: string): Promise<readonly string[]> {
  return withClient(url, async (c) => {
    const r = await c.query<{ relname: string }>(
      `select c.relname from pg_class c join pg_namespace n on n.oid = c.relnamespace
        where n.nspname = $1 and c.relkind = 'r' order by c.relname`,
      [schema],
    );
    return r.rows.map((linha) => linha.relname);
  });
}

async function versoesAplicadas(url: string, schema: string): Promise<readonly string[]> {
  return withClient(url, async (c) => {
    const r = await c.query<{ version: string }>(
      `select version from platform.schema_migrations
        where schema_name = $1 and version like 'tenant/%' and applied_at is not null
        order by version`,
      [schema],
    );
    return r.rows.map((linha) => linha.version);
  });
}

describe('stream tenant: schema vazio, rodada dupla, isolamento e verify', { skip: skipWithoutPostgres }, () => {
  let db: DisposableDatabase;
  const arquivos = realTenantFiles();
  const migrationsDir = buildMigrationsDir({ tenant: arquivos });
  const opcoes = (): { url: string; migrationsDir: string } => ({ url: db.url, migrationsDir });

  before(async () => {
    db = await createDatabase();
    for (const slug of ['norte', 'sul']) {
      const feito = await runExecutor({ kind: 'provision', slug }, opcoes());
      assert.equal(feito.exitCode, 0, `${slug}: ${feito.error}`);
    }
  });
  after(async () => {
    await db.drop();
  });

  /** `migrations.md` §3, teste 1: cliente novo, provisionado do zero. */
  test('schema vazio: o provision aplica a stream inteira e cria as oito tabelas', async () => {
    assert.deepEqual(await tabelasDe(db.url, 't_norte'), TABELAS);
    const esperadas = arquivos.map((f) => `tenant/${f.name.slice(0, -'.sql'.length)}`);
    assert.deepEqual(await versoesAplicadas(db.url, 't_norte'), esperadas);

    await withClient(db.url, async (c) => {
      const papeis = await c.query('select code from t_norte.roles order by code');
      assert.deepEqual(
        papeis.rows.map((l: { code: string }) => l.code),
        ['cashier', 'fiscal_officer', 'manager', 'owner', 'provider_support'],
      );
      const fontes = await c.query('select count(*)::int as n from t_norte.act_support_sources');
      assert.equal(fontes.rows[0].n, 3);
    });
  });

  /** `migrations.md` §3, teste 3, e `CONTRATO.md` §14 caso 3. */
  test('rodada duas vezes: nenhuma linha nova no livro-razão e impressão idêntica', async () => {
    const antes = await withClient(db.url, (c) => structurePrint(c, 't_norte'));
    const ledgerAntes = await versoesAplicadas(db.url, 't_norte');

    for (let rodada = 0; rodada < 2; rodada += 1) {
      const r = await runExecutor({ kind: 'migrate' }, opcoes());
      assert.equal(r.exitCode, 0, r.error);
    }

    assert.deepEqual(await versoesAplicadas(db.url, 't_norte'), ledgerAntes);
    const depois = await withClient(db.url, (c) => structurePrint(c, 't_norte'));
    assert.deepEqual(depois, antes);
  });

  test('verify: os dois clientes batem com o descartável, domínios incluídos', async () => {
    const r = await runExecutor({ kind: 'verify' }, opcoes());
    assert.equal(r.exitCode, 0, `${r.error}\n${r.output}`);

    const impressao = await withClient(db.url, (c) => structurePrint(c, 't_norte'));
    for (const esperado of [
      'dominio     money_amount numeric NULL -',
      'dominio     unit_price numeric NULL -',
      'dominio     quantity_value numeric NULL -',
    ]) {
      assert.ok(impressao.includes(esperado), `falta na impressão: ${esperado}`);
    }
    assert.ok(
      impressao.some((l) => l.startsWith('dominio     money_amount.money_amount_envelope_check CHECK')),
      'a restrição do domínio entra na impressão',
    );
  });

  /**
   * A linha nova da impressão prova o que ela existe para provar: envelope afrouxado à mão num
   * cliente é diferença. Antes de 2026-09-23 a restrição de domínio não entrava em linha nenhuma.
   */
  test('verify: envelope de domínio afrouxado num cliente é diferença, saída 3', async () => {
    await withClient(db.url, async (c) => {
      await c.query('alter domain t_sul.money_amount drop constraint money_amount_envelope_check');
    });
    try {
      const r = await runExecutor({ kind: 'verify' }, opcoes());
      assert.equal(r.exitCode, 3, `${r.error}\n${r.output}`);
      assert.match(`${r.error}\n${r.output}`, /money_amount_envelope_check/);
    } finally {
      await withClient(db.url, async (c) => {
        await c.query(
          `alter domain t_sul.money_amount add constraint money_amount_envelope_check
             check (min_scale(VALUE) <= 2 and abs(VALUE) < 1e12)`,
        );
      });
    }
    const r = await runExecutor({ kind: 'verify' }, opcoes());
    assert.equal(r.exitCode, 0, `${r.error}\n${r.output}`);
  });

  test('domínios: casa a mais é recusada, zero à direita não conta, NaN e infinito não entram', async () => {
    await withClient(db.url, async (c) => {
      const aceitos: readonly (readonly [string, string])[] = [
        ['17.9', 'money_amount'], ['17.900', 'money_amount'], ['-5.25', 'money_amount'],
        ['999999999999.99', 'money_amount'], ['17.925', 'unit_price'], ['1.5', 'quantity_value'],
        ['0.001', 'quantity_value'],
      ];
      for (const [valor, dominio] of aceitos) {
        await c.query(`select $1::numeric::t_norte.${dominio}`, [valor]);
      }
      const recusados: readonly (readonly [string, string])[] = [
        ['17.925', 'money_amount'], ['1000000000000', 'money_amount'], ['NaN', 'money_amount'],
        ['Infinity', 'money_amount'], ['1.2345', 'unit_price'], ['NaN', 'unit_price'],
        ['1.2345', 'quantity_value'], ['100000000000', 'quantity_value'], ['-Infinity', 'quantity_value'],
      ];
      for (const [valor, dominio] of recusados) {
        const erro = await falha(c.query(`select $1::numeric::t_norte.${dominio}`, [valor]));
        assert.equal(erro.code, '23514', `${valor} em ${dominio}: ${erro.message}`);
      }
    });
  });

  /**
   * `F-021`, aceite 6 e aceite 3: o papel do cliente Y lendo o estabelecimento do cliente X recebe
   * `42501`, e é essa a razão de o vínculo com o cliente ser imutável por construção.
   */
  test('isolamento: o papel de sul não lê nem escreve o estabelecimento de norte', async (t: TestContext) => {
    const credencial = comoPapel(db.url, APP_CREDENTIAL_ROLE);
    const motivo = await motivoDeNaoConectar(credencial);
    if (motivo !== undefined) return t.skip(motivo);

    await withClient(db.url, async (c) => {
      await criarUnidade(c, 't_norte', 'Loja do Centro', '2026-09-01T12:00:00Z');
    });

    await withClient(credencial, async (c) => {
      await c.query('begin');
      await c.query('set local role app_t_norte');
      const proprio = await c.query('select count(*)::int as n from t_norte.establishments');
      assert.equal(proprio.rows[0].n, 1);
      await c.query('rollback');

      for (const alheio of [
        'select establishment_id from t_norte.establishments',
        'select establishment_id from t_norte.sales_enabled_terminal_facts',
        `insert into t_norte.terminals (terminal_id) values (gen_random_uuid())`,
      ]) {
        await c.query('begin');
        await c.query('set local role app_t_sul');
        const erro = await falha(c.query(alheio));
        assert.equal(erro.code, '42501', `${alheio}: ${erro.message}`);
        await c.query('rollback');
      }
    });
  });

  /** A trava append-only com o papel da aplicação, que tem UPDATE no schema inteiro e DELETE em nada. */
  test('append-only pelo papel do cliente: UPDATE recusado pelo gatilho, DELETE sem privilégio', async (t: TestContext) => {
    const credencial = comoPapel(db.url, APP_CREDENTIAL_ROLE);
    const motivo = await motivoDeNaoConectar(credencial);
    if (motivo !== undefined) return t.skip(motivo);

    await withClient(credencial, async (c) => {
      for (const tabela of TABELAS) {
        await c.query('begin');
        await c.query('set local role app_t_norte');
        const coluna = COLUNA_DE_SONDA[tabela] ?? 'received_at';
        const update = await falha(c.query(`update t_norte.${tabela} set ${coluna} = ${coluna}`));
        assert.equal(update.code, 'P0001', `${tabela}: ${update.message}`);
        assert.match(update.message, new RegExp(`a tabela ${tabela} não aceita UPDATE`));
        await c.query('rollback');

        await c.query('begin');
        await c.query('set local role app_t_norte');
        const apagar = await falha(c.query(`delete from t_norte.${tabela}`));
        assert.equal(apagar.code, '42501', `${tabela}: ${apagar.message}`);
        await c.query('rollback');
      }
    });
  });

  /** O dono do schema passa pelo privilégio, e o gatilho continua recusando DELETE e TRUNCATE. */
  test('append-only pelo dono: DELETE e TRUNCATE recusados em toda tabela', async () => {
    await withClient(db.url, async (c) => {
      for (const tabela of TABELAS) {
        for (const comando of [`delete from t_norte.${tabela}`, `truncate t_norte.${tabela} cascade`]) {
          const erro = await falha(c.query(comando));
          assert.equal(erro.code, 'P0001', `${comando}: ${erro.message}`);
        }
      }
    });
  });

  /**
   * O `replace` no tipo da coluna: sem ele, `format_type` qualifica o domínio com o schema do
   * cliente, e a primeira coluna de valor faria todo cliente divergir do descartável. Uma migration
   * de teste com coluna de domínio, aplicada aos dois clientes, e o `verify` tem que sair `0`.
   */
  test('coluna de domínio: a impressão é neutra ao schema, e o verify segue em 0', async () => {
    const comPreco = buildMigrationsDir({
      tenant: [
        ...arquivos,
        {
          name: '0008__priced_probe.sql',
          text: tenantMigration(`
CREATE TABLE IF NOT EXISTS priced_probe (
    probe_id uuid NOT NULL,
    price unit_price NOT NULL,
    CONSTRAINT priced_probe_pkey PRIMARY KEY (probe_id)
);
`),
        },
      ],
    });
    const migrado = await runExecutor({ kind: 'migrate' }, { url: db.url, migrationsDir: comPreco });
    assert.equal(migrado.exitCode, 0, migrado.error);

    const impressao = await withClient(db.url, (c) => structurePrint(c, 't_norte'));
    assert.ok(impressao.includes('coluna      priced_probe.price unit_price NOT NULL -'), impressao.join('\n'));

    const r = await runExecutor({ kind: 'verify' }, { url: db.url, migrationsDir: comPreco });
    assert.equal(r.exitCode, 0, `${r.error}\n${r.output}`);
  });
});

/**
 * `migrations.md` §3, teste 2: schema com dado representativo. O cliente nasce com a stream até a
 * `0005`, recebe estabelecimento, nome, encerramento, reabertura e configuração, e só então as duas
 * últimas migrations chegam. A `0007` acrescenta chave estrangeira a tabelas que já têm linha, que é
 * exatamente o caso que o teste existe para exercer.
 */
describe('stream tenant: schema com dado', { skip: skipWithoutPostgres }, () => {
  let db: DisposableDatabase;

  before(async () => {
    db = await createDatabase();
  });
  after(async () => {
    await db.drop();
  });

  test('as migrations seguintes aplicam sem perder linha, e o verify segue em 0', async () => {
    const parcial = buildMigrationsDir({ tenant: realTenantFiles('0005') });
    const provisionado = await runExecutor({ kind: 'provision', slug: 'leste' }, { url: db.url, migrationsDir: parcial });
    assert.equal(provisionado.exitCode, 0, provisionado.error);

    await withClient(db.url, async (c) => {
      const a = await criarUnidade(c, 't_leste', 'Matriz', '2026-09-01T12:00:00Z');
      await criarUnidade(c, 't_leste', 'Filial', '2026-09-02T12:00:00Z');
      await renomear(c, 't_leste', a, 'Matriz Centro', '2026-09-03T12:00:00Z');
      const fechou = await mudarOperacao(c, 't_leste', a, 1, 'closure', '2026-09-04T12:00:00Z');
      await mudarOperacao(c, 't_leste', a, 2, 'reopening', '2026-09-05T12:00:00Z', fechou);
      await publicarConfiguracao(c, 't_leste', a, 1, 'America/Sao_Paulo', 'BRL', '2026-09-01T13:00:00Z');
    });

    const contar = async (): Promise<Record<string, number>> =>
      withClient(db.url, async (c) => {
        const r = await c.query<{ tabela: string; n: number }>(
          `select 'establishments' as tabela, count(*)::int as n from t_leste.establishments
           union all select 'names', count(*)::int from t_leste.establishment_name_changes
           union all select 'changes', count(*)::int from t_leste.establishment_operation_changes
           union all select 'configurations', count(*)::int from t_leste.establishment_configurations`,
        );
        return Object.fromEntries(r.rows.map((l) => [l.tabela, l.n]));
      });
    const antes = await contar();
    assert.deepEqual(antes, { establishments: 2, names: 1, changes: 2, configurations: 1 });

    const completo = buildMigrationsDir({ tenant: realTenantFiles() });
    const migrado = await runExecutor({ kind: 'migrate' }, { url: db.url, migrationsDir: completo });
    assert.equal(migrado.exitCode, 0, migrado.error);

    assert.deepEqual(await contar(), antes);
    assert.deepEqual(await tabelasDe(db.url, 't_leste'), TABELAS);

    // A unidade que já existia recebe terminal pelo modelo novo.
    await withClient(db.url, async (c) => {
      const r = await c.query<{ establishment_id: string; occurred_at: Date }>(
        `select establishment_id, occurred_at from t_leste.establishments where name = 'Matriz'`,
      );
      const linha = r.rows[0]!;
      await novoTerminal(c, 't_leste', { id: linha.establishment_id, criadaEm: linha.occurred_at.toISOString() }, '2026-09-06T12:00:00Z');
    });

    const verificado = await runExecutor({ kind: 'verify' }, { url: db.url, migrationsDir: completo });
    assert.equal(verificado.exitCode, 0, `${verificado.error}\n${verificado.output}`);
  });
});

describe('stream tenant: retomada', { skip: skipWithoutPostgres }, () => {
  let db: DisposableDatabase;

  before(async () => {
    db = await createDatabase();
  });
  after(async () => {
    await db.drop();
  });

  /**
   * A guarda de existência dos domínios é a transação (tenant/0001, e `CONTRATO.md` §17.2, forma 3):
   * uma primeira tentativa que morre depois do `CREATE DOMAIN` não deixa domínio para trás, e a
   * retomada aplica limpa. O arquivo da tentativa carrega um comando a mais que falha; o da retomada é
   * o do repositório.
   */
  test('retomada da 0001: a tentativa que falhou não deixa domínio, e a seguinte converge', async () => {
    const [dominios] = realTenantFiles('0001');
    const quebrado = buildMigrationsDir({
      tenant: [{ name: dominios!.name, text: `${dominios!.text}\nCREATE TABLE IF NOT EXISTS sonda (a tipo_que_nao_existe);\n` }],
    });
    const falhou = await runExecutor({ kind: 'provision', slug: 'retomada' }, { url: db.url, migrationsDir: quebrado });
    assert.notEqual(falhou.exitCode, 0, 'a primeira tentativa tinha que falhar no passo 6');

    const restantes = await withClient(db.url, async (c) => {
      const r = await c.query(
        `select count(*)::int as n from pg_type t join pg_namespace n on n.oid = t.typnamespace
          where n.nspname = 't_retomada' and t.typtype = 'd'`,
      );
      return r.rows[0].n as number;
    });
    assert.equal(restantes, 0, 'o ROLLBACK leva os domínios junto');

    const retomado = await runExecutor(
      { kind: 'migrate', schema: 't_retomada' },
      { url: db.url, migrationsDir: buildMigrationsDir({ tenant: realTenantFiles() }) },
    );
    assert.equal(retomado.exitCode, 0, retomado.error);
    assert.deepEqual(await tabelasDe(db.url, 't_retomada'), TABELAS);
  });
});

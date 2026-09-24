import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import type pg from 'pg';
import { runExecutor } from './support/executor.js';
import { createDatabase, skipWithoutPostgres, withClient, type DisposableDatabase } from './support/postgres.js';
import { buildMigrationsDir } from './support/tree.js';
import {
  criarUnidade,
  falha,
  gravarFato,
  mudarOperacao,
  novoTerminal,
  realTenantFiles,
  renomear,
  type Fato,
} from './support/cliente.js';

/**
 * Os aceites de `F-021` que o banco garante, um caso concreto cada (T-0022). O que é conferência do
 * backend (precondições de habilitar e de encerrar, recusa como fato) não está aqui, e as migrations
 * dizem por quê.
 */

const S = 't_oeste';

async function operavamEm(c: pg.Client, instante: string): Promise<readonly string[]> {
  const r = await c.query<{ name: string }>(
    `select e.name from ${S}.establishments e
      where e.occurred_at <= $1
        and coalesce((select m.change_kind from ${S}.establishment_operation_changes m
                       where m.establishment_id = e.establishment_id and m.occurred_at <= $1
                       order by m.change_sequence desc limit 1), 'reopening') <> 'closure'
      order by e.name`,
    [instante],
  );
  return r.rows.map((l) => l.name);
}

/** "Por qual unidade T vendia em T1": o último fato até T1, se ele for habilitação ou renovação. */
async function vendiaPor(c: pg.Client, terminal: string, instante: string): Promise<string | null> {
  const r = await c.query<{ establishment_id: string | null; fact_kind: string }>(
    `select establishment_id, fact_kind from ${S}.sales_enabled_terminal_facts
      where terminal_id = $1 and occurred_at <= $2
      order by terminal_sequence desc limit 1`,
    [terminal, instante],
  );
  const ultimo = r.rows[0];
  if (ultimo === undefined) return null;
  return ultimo.fact_kind === 'enablement' || ultimo.fact_kind === 'renewal' ? ultimo.establishment_id : null;
}

/** "Quantos terminais estão habilitados a vender e desde quando", por unidade (RN-PRV-013). */
async function habilitadosAgora(
  c: pg.Client,
  unidade: string,
): Promise<readonly { terminal_id: string; desde: string }[]> {
  const r = await c.query<{ terminal_id: string; desde: Date }>(
    `select u.terminal_id, h.occurred_at as desde
       from (select distinct on (terminal_id) terminal_id, fact_kind, enablement_fact_id, establishment_id
               from ${S}.sales_enabled_terminal_facts
              order by terminal_id, terminal_sequence desc) u
       join ${S}.sales_enabled_terminal_facts h on h.fact_id = u.enablement_fact_id
      where u.fact_kind in ('enablement', 'renewal') and u.establishment_id = $1
      order by u.terminal_id`,
    [unidade],
  );
  return r.rows.map((l) => ({ terminal_id: l.terminal_id, desde: l.desde.toISOString() }));
}

describe('estabelecimento, terminal e habilitação a vender (F-021)', { skip: skipWithoutPostgres }, () => {
  let db: DisposableDatabase;
  const migrationsDir = buildMigrationsDir({ tenant: realTenantFiles() });
  const comBanco = <T>(corpo: (c: pg.Client) => Promise<T>): Promise<T> => withClient(db.url, corpo);

  before(async () => {
    db = await createDatabase();
    const feito = await runExecutor({ kind: 'provision', slug: 'oeste' }, { url: db.url, migrationsDir });
    assert.equal(feito.exitCode, 0, feito.error);
  });
  after(async () => {
    await db.drop();
  });

  /** Aceite 1: nenhum caminho para terminal ou habilitação sem estabelecimento nomeado. */
  test('aceite 1: terminal sozinho não chega ao COMMIT, e habilitação sem unidade é recusada', async () => {
    await comBanco(async (c) => {
      const sozinho = await falha(c.query(`insert into ${S}.terminals (terminal_id) values ($1)`, [randomUUID()]));
      assert.equal(sozinho.code, '23503', sozinho.message);
      assert.match(sozinho.message, /terminals_first_fact_fkey/);

      const terminal = randomUUID();
      await c.query('begin');
      await c.query(`insert into ${S}.terminals (terminal_id) values ($1)`, [terminal]);
      const semUnidade = await falha(gravarFato(c, S, terminal, { kind: 'enablement', at: '2026-09-10T12:00:00Z', unidade: null }));
      assert.equal(semUnidade.code, '23514', semUnidade.message);
      await c.query('rollback');

      await c.query('begin');
      await c.query(`insert into ${S}.terminals (terminal_id) values ($1)`, [terminal]);
      const unidadeInexistente = await falha(
        gravarFato(c, S, terminal, { kind: 'enablement', at: '2026-09-10T12:00:00Z', unidade: randomUUID() }),
      );
      assert.equal(unidadeInexistente.code, '23503', unidadeInexistente.message);
      await c.query('rollback');

      // O teste negativo, que é o que prova: nada no modelo se chama ou funciona como unidade padrão.
      const nomes = await c.query<{ nome: string }>(
        `select c.relname as nome from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = $1
         union all select a.attname from pg_attribute a join pg_class c on c.oid = a.attrelid
           join pg_namespace n on n.oid = c.relnamespace where n.nspname = $1 and a.attnum > 0
         union all select con.conname from pg_constraint con join pg_namespace n on n.oid = con.connamespace
          where n.nspname = $1`,
        [S],
      );
      const suspeitos = nomes.rows
        .map((l) => l.nome)
        .filter((nome) => /default|implicit|padrao|unica|single|main_|primary_establishment/.test(nome));
      assert.deepEqual(suspeitos, []);

      const padroes = await c.query<{ coluna: string }>(
        `select c.relname || '.' || a.attname as coluna
           from pg_attrdef d join pg_attribute a on a.attrelid = d.adrelid and a.attnum = d.adnum
           join pg_class c on c.oid = d.adrelid join pg_namespace n on n.oid = c.relnamespace
          where n.nspname = $1`,
        [S],
      );
      assert.deepEqual(padroes.rows.map((l) => l.coluna), ['terminals.first_fact_sequence']);
    });
  });

  /** Aceite 2: duas unidades no mesmo schema; habilitado por A não está habilitado por B. */
  test('aceite 2: a habilitação vigente nunca nomeia duas unidades', async () => {
    await comBanco(async (c) => {
      const a = await criarUnidade(c, S, 'Unidade A2', '2026-09-01T10:00:00Z');
      const b = await criarUnidade(c, S, 'Unidade B2', '2026-09-01T11:00:00Z');
      const t = await novoTerminal(c, S, a, '2026-09-02T10:00:00Z');

      const porB = await falha(gravarFato(c, S, t.terminal, { kind: 'enablement', at: '2026-09-02T11:00:00Z', anterior: t, unidade: b.id }));
      assert.equal(porB.code, '23514', porB.message);
      assert.match(porB.message, /transition_check/);

      const mesmoNumero = await falha(
        gravarFato(c, S, t.terminal, { kind: 'enablement', at: '2026-09-02T11:00:00Z', seq: 1, unidade: b.id }),
      );
      assert.equal(mesmoNumero.code, '23505', mesmoNumero.message);

      const renovaPorB = await falha(gravarFato(c, S, t.terminal, { kind: 'renewal', at: '2026-09-02T12:00:00Z', anterior: t, unidade: b.id }));
      assert.equal(renovaPorB.code, '23503', renovaPorB.message);
      assert.match(renovaPorB.message, /period_fkey/);

      const outroPeriodo = await falha(
        gravarFato(c, S, t.terminal, { kind: 'renewal', at: '2026-09-02T12:00:00Z', anterior: t, enablement: randomUUID() }),
      );
      assert.equal(outroPeriodo.code, '23514', outroPeriodo.message);

      assert.equal(await vendiaPor(c, t.terminal, '2026-09-03T00:00:00Z'), a.id);
      assert.equal((await habilitadosAgora(c, a.id)).length, 1);
      assert.equal((await habilitadosAgora(c, b.id)).length, 0);
    });
  });

  /**
   * Aceite 4: ciclo de vida derivado. Não há estado materializado a comparar com o reconstruído: o
   * estado exibido É a derivação, e por isso a divergência de RN-NUC-051 não tem onde nascer.
   */
  test('aceite 4: quais unidades operavam, e quantos terminais estão habilitados desde quando', async () => {
    await comBanco(async (c) => {
      const a = await criarUnidade(c, S, 'Unidade A4', '2026-08-01T10:00:00Z');
      await criarUnidade(c, S, 'Unidade B4', '2026-08-05T10:00:00Z');
      const noDia = (await operavamEm(c, '2026-09-11T12:00:00Z')).filter((n) => n.endsWith('4'));
      assert.deepEqual(noDia, ['Unidade A4', 'Unidade B4']);

      const t = await novoTerminal(c, S, a, '2026-08-10T09:00:00Z');
      const r1 = await gravarFato(c, S, t.terminal, { kind: 'renewal', at: '2026-08-11T09:00:00Z', anterior: t });
      await gravarFato(c, S, t.terminal, { kind: 'renewal', at: '2026-08-12T09:00:00Z', anterior: r1 });
      assert.deepEqual(await habilitadosAgora(c, a.id), [{ terminal_id: t.terminal, desde: '2026-08-10T09:00:00.000Z' }]);
    });
  });

  /** Aceite 5: renomear em T2 e perguntar o nome em T1 < T2 devolve o antigo. */
  test('aceite 5: o nome é datado, e o antigo continua respondendo pelo passado', async () => {
    await comBanco(async (c) => {
      const a = await criarUnidade(c, S, 'Loja Velha', '2026-09-01T10:00:00Z');
      await renomear(c, S, a, 'Loja Nova', '2026-09-10T10:00:00Z');
      const nomeEm = async (instante: string): Promise<string> => {
        const r = await c.query<{ nome: string }>(
          `select coalesce((select n.name from ${S}.establishment_name_changes n
                             where n.establishment_id = e.establishment_id and n.occurred_at <= $2
                             order by n.occurred_at desc limit 1), e.name) as nome
             from ${S}.establishments e where e.establishment_id = $1`,
          [a.id, instante],
        );
        return r.rows[0]!.nome;
      };
      assert.equal(await nomeEm('2026-09-05T00:00:00Z'), 'Loja Velha');
      assert.equal(await nomeEm('2026-09-11T00:00:00Z'), 'Loja Nova');

      const antesDeNascer = await falha(renomear(c, S, a, 'Loja Antes', '2026-08-01T10:00:00Z'));
      assert.equal(antesDeNascer.code, '23514', antesDeNascer.message);
      const mesmoInstante = await falha(renomear(c, S, a, 'Loja Dupla', '2026-09-10T10:00:00Z'));
      assert.equal(mesmoInstante.code, '23505', mesmoInstante.message);
      const semNome = await falha(renomear(c, S, a, '  ', '2026-09-12T10:00:00Z'));
      assert.equal(semNome.code, '23514', semNome.message);
    });
  });

  /** Aceite 8: encerrar A com três terminais, e reabrir. */
  test('aceite 8: encerrar revoga os três no mesmo ato, reabrir não devolve nenhum', async () => {
    await comBanco(async (c) => {
      const a = await criarUnidade(c, S, 'Unidade A8', '2026-09-01T10:00:00Z');
      const b = await criarUnidade(c, S, 'Unidade B8', '2026-09-01T10:00:00Z');
      const terminais: Fato[] = [];
      for (const hora of ['09', '10', '11']) terminais.push(await novoTerminal(c, S, a, `2026-09-02T${hora}:00:00Z`));
      const fechamentoDeB = await mudarOperacao(c, S, b, 1, 'closure', '2026-09-20T10:00:00Z');

      const fechou = await mudarOperacao(c, S, a, 1, 'closure', '2026-09-20T12:00:00Z');
      const revogados: Fato[] = [];
      for (const t of terminais) {
        revogados.push(
          await gravarFato(c, S, t.terminal, { kind: 'closure_revocation', at: fechou.at, anterior: t, encerramento: fechou }),
        );
      }
      assert.equal((await habilitadosAgora(c, a.id)).length, 0);
      assert.ok((await operavamEm(c, '2026-09-11T12:00:00Z')).includes('Unidade A8'));
      assert.ok(!(await operavamEm(c, '2026-09-21T12:00:00Z')).includes('Unidade A8'));

      const t4 = await novoTerminal(c, S, a, '2026-09-03T09:00:00Z');
      const instanteOutro = await falha(
        gravarFato(c, S, t4.terminal, { kind: 'closure_revocation', at: '2026-09-20T12:30:00Z', anterior: t4, encerramento: fechou }),
      );
      assert.equal(instanteOutro.code, '23503', 'revogação fora do instante do encerramento');
      const encerramentoDeOutra = await falha(
        gravarFato(c, S, t4.terminal, { kind: 'closure_revocation', at: fechamentoDeB.at, anterior: t4, encerramento: fechamentoDeB }),
      );
      assert.equal(encerramentoDeOutra.code, '23503', 'revogação apontando para o encerramento de B');
      const semEncerramento = await falha(
        gravarFato(c, S, t4.terminal, { kind: 'closure_revocation', at: fechou.at, anterior: t4 }),
      );
      assert.equal(semEncerramento.code, '23514', semEncerramento.message);

      const reabriu = await mudarOperacao(c, S, a, 2, 'reopening', '2026-09-22T12:00:00Z', fechou);
      const comoReabertura = await falha(
        gravarFato(c, S, t4.terminal, {
          kind: 'closure_revocation', at: reabriu.at, anterior: t4, encerramento: reabriu, especieDoEncerramento: 'reopening',
        }),
      );
      assert.equal(comoReabertura.code, '23514', 'a espécie da referência é constante: closure');

      const renovaDepois = await falha(gravarFato(c, S, revogados[0]!.terminal, { kind: 'renewal', at: '2026-09-23T09:00:00Z', anterior: revogados[0]! }));
      assert.equal(renovaDepois.code, '23514', renovaDepois.message);
      assert.equal((await habilitadosAgora(c, a.id)).map((l) => l.terminal_id).includes(revogados[0]!.terminal), false);

      const encerraDeNovo = await falha(mudarOperacao(c, S, a, 3, 'reopening', '2026-09-23T12:00:00Z', reabriu));
      assert.equal(encerraDeNovo.code, '23514', 'a terceira mudança é encerramento, pela paridade');
      const saltaNumero = await falha(mudarOperacao(c, S, a, 4, 'reopening', '2026-09-23T12:00:00Z', reabriu));
      assert.equal(saltaNumero.code, '23514', saltaNumero.message);
      const antesDaAnterior = await falha(mudarOperacao(c, S, a, 3, 'closure', '2026-09-21T12:00:00Z', reabriu));
      assert.equal(antesDaAnterior.code, '23514', antesDaAnterior.message);

      // Habilitar de novo, depois de reabrir, é habilitação nova: o intervalo encerrado fica na história.
      const nova = await gravarFato(c, S, revogados[1]!.terminal, { kind: 'enablement', at: '2026-09-22T13:00:00Z', anterior: revogados[1]!, unidade: a.id });
      assert.notEqual(nova.enablement, terminais[1]!.enablement);
      assert.equal(await vendiaPor(c, nova.terminal, '2026-09-21T00:00:00Z'), null);
      assert.equal(await vendiaPor(c, nova.terminal, '2026-09-22T14:00:00Z'), a.id);
    });
  });

  /** Aceite 9: T habilitado por A, descomissionado em A e habilitado por B. */
  test('aceite 9: mover terminal é descomissionar e habilitar, e nenhum instante tem duas unidades', async () => {
    await comBanco(async (c) => {
      const a = await criarUnidade(c, S, 'Unidade A9', '2026-09-01T10:00:00Z');
      const b = await criarUnidade(c, S, 'Unidade B9', '2026-09-01T10:00:00Z');
      const pedinte = await novoTerminal(c, S, b, '2026-09-01T12:00:00Z');
      const t = await novoTerminal(c, S, a, '2026-09-02T10:00:00Z');
      const saiu = await gravarFato(c, S, t.terminal, { kind: 'decommission', at: '2026-09-10T10:00:00Z', anterior: t });

      const sobreposta = await falha(
        gravarFato(c, S, t.terminal, { kind: 'enablement', at: '2026-09-09T10:00:00Z', anterior: saiu, unidade: b.id }),
      );
      assert.equal(sobreposta.code, '23514', 'habilitação nova antes do fim da anterior');

      const emB = await gravarFato(c, S, t.terminal, {
        kind: 'enablement', at: '2026-09-10T11:00:00Z', anterior: saiu, unidade: b.id, pedidoDe: pedinte.terminal,
      });
      assert.equal(await vendiaPor(c, t.terminal, '2026-09-05T00:00:00Z'), a.id);
      assert.equal(await vendiaPor(c, t.terminal, '2026-09-10T10:30:00Z'), null);
      assert.equal(await vendiaPor(c, t.terminal, '2026-09-11T00:00:00Z'), b.id);

      const pedido = await c.query(`select requested_from_terminal_id from ${S}.sales_enabled_terminal_facts where fact_id = $1`, [emB.id]);
      assert.equal(pedido.rows[0].requested_from_terminal_id, pedinte.terminal);
      const pedidoNaRenovacao = await falha(
        gravarFato(c, S, t.terminal, { kind: 'renewal', at: '2026-09-11T10:00:00Z', anterior: emB, pedidoDe: pedinte.terminal }),
      );
      assert.equal(pedidoNaRenovacao.code, '23514', pedidoNaRenovacao.message);

      // Os períodos de T, lidos de volta, não se sobrepõem.
      const periodos = await c.query<{ establishment_id: string; inicio: Date; fim: Date | null }>(
        `select h.establishment_id, h.occurred_at as inicio,
                (select min(f.occurred_at) from ${S}.sales_enabled_terminal_facts f
                  where f.enablement_fact_id = h.fact_id
                    and f.fact_kind in ('decommission', 'closure_revocation')) as fim
           from ${S}.sales_enabled_terminal_facts h
          where h.terminal_id = $1 and h.fact_kind = 'enablement' order by h.terminal_sequence`,
        [t.terminal],
      );
      assert.equal(periodos.rows.length, 2);
      assert.ok(periodos.rows[0]!.fim !== null && periodos.rows[0]!.fim <= periodos.rows[1]!.inicio);
    });
  });

  /** Caminho infeliz: comprometido nunca é renovado nem reabilitado, e o fato não se apaga. */
  test('comprometido: nada vem depois, nem renovação nem habilitação', async () => {
    await comBanco(async (c) => {
      const a = await criarUnidade(c, S, 'Unidade AC', '2026-09-01T10:00:00Z');
      const t = await novoTerminal(c, S, a, '2026-09-02T10:00:00Z');
      const r = await gravarFato(c, S, t.terminal, { kind: 'renewal', at: '2026-09-03T10:00:00Z', anterior: t });
      const furto = await gravarFato(c, S, t.terminal, { kind: 'compromise', at: '2026-09-04T10:00:00Z', anterior: r });
      assert.equal((await habilitadosAgora(c, a.id)).length, 0);

      for (const kind of ['renewal', 'enablement', 'decommission', 'compromise'] as const) {
        const depois = await falha(
          gravarFato(c, S, t.terminal, {
            kind, at: '2026-09-05T10:00:00Z', anterior: furto, unidade: a.id,
            ...(kind === 'enablement' ? {} : { enablement: t.enablement }),
          }),
        );
        assert.equal(depois.code, '23514', `${kind} depois de compromise: ${depois.message}`);
      }

      // Descomissionado e depois furtado também: o furto encerra a sequência.
      const t2 = await novoTerminal(c, S, a, '2026-09-02T11:00:00Z');
      const fora = await gravarFato(c, S, t2.terminal, { kind: 'decommission', at: '2026-09-03T11:00:00Z', anterior: t2 });
      const furto2 = await gravarFato(c, S, t2.terminal, { kind: 'compromise', at: '2026-09-04T11:00:00Z', anterior: fora });
      const reabilita = await falha(gravarFato(c, S, t2.terminal, { kind: 'enablement', at: '2026-09-05T11:00:00Z', anterior: furto2, unidade: a.id }));
      assert.equal(reabilita.code, '23514', reabilita.message);

      // Recuperado, entra como terminal novo.
      const recuperado = await novoTerminal(c, S, a, '2026-09-06T11:00:00Z');
      assert.notEqual(recuperado.terminal, t2.terminal);
    });
  });
});

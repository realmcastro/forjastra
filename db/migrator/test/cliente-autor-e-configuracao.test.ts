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
  novoTerminal,
  publicarConfiguracao,
  realTenantFiles,
} from './support/cliente.js';

/**
 * A forma do autor (RN-NUC-029, `db/convencoes.md` §11) e a configuração publicada com fuso e moeda
 * (RN-NUC-057, RN-NUC-058), no que o banco garante (T-0022, `F-021`).
 */

const S = 't_centro';

describe('autor e configuração publicada', { skip: skipWithoutPostgres }, () => {
  let db: DisposableDatabase;
  const migrationsDir = buildMigrationsDir({ tenant: realTenantFiles() });
  const comBanco = <T>(corpo: (c: pg.Client) => Promise<T>): Promise<T> => withClient(db.url, corpo);

  before(async () => {
    db = await createDatabase();
    const feito = await runExecutor({ kind: 'provision', slug: 'centro' }, { url: db.url, migrationsDir });
    assert.equal(feito.exitCode, 0, feito.error);
  });
  after(async () => {
    await db.drop();
  });

  test('forma do autor: fonte sem referência, papel na terceira fonte e autor fora de lugar são recusados', async () => {
    await comBanco(async (c) => {
      const base = `insert into ${S}.establishments
         (establishment_id, name, occurred_at, received_at, author_operator_id, author_role_code,
          support_source_code, support_assignment_id, support_concession_id)
         values (gen_random_uuid(), 'Sonda', now(), now(), gen_random_uuid(), $1, $2, $3, $4)`;
      const casos: readonly (readonly [string | null, string, string | null, string | null])[] = [
        ['owner', 'assignment', null, null],
        ['owner', 'concession', null, null],
        ['owner', 'assignment', randomUUID(), randomUUID()],
        [null, 'assignment', randomUUID(), null],
        ['owner', 'retained_identification_and_terminal_enablement', null, null],
      ];
      for (const [papel, fonte, atribuicao, concessao] of casos) {
        const erro = await falha(c.query(base, [papel, fonte, atribuicao, concessao]));
        assert.equal(erro.code, '23514', `${papel} ${fonte}: ${erro.message}`);
      }
      const fonteInexistente = await falha(c.query(base, ['owner', 'nenhuma', null, null]));
      assert.equal(fonteInexistente.code, '23503', fonteInexistente.message);
      const papelInexistente = await falha(c.query(base, ['gerente', 'assignment', randomUUID(), null]));
      assert.equal(papelInexistente.code, '23503', papelInexistente.message);

      const a = await criarUnidade(c, S, 'Unidade AF', '2026-09-01T10:00:00Z');
      const t = await novoTerminal(c, S, a, '2026-09-02T10:00:00Z');
      const renovacaoComAutor = await falha(gravarFato(c, S, t.terminal, { kind: 'renewal', at: '2026-09-03T10:00:00Z', anterior: t, comAutor: true }));
      assert.equal(renovacaoComAutor.code, '23514', renovacaoComAutor.message);
      const descomissionarSemAutor = await falha(gravarFato(c, S, t.terminal, { kind: 'decommission', at: '2026-09-03T10:00:00Z', anterior: t, semAutor: true }));
      assert.equal(descomissionarSemAutor.code, '23514', descomissionarSemAutor.message);
      const semValidade = await falha(gravarFato(c, S, t.terminal, { kind: 'renewal', at: '2026-09-03T10:00:00Z', anterior: t, validade: null }));
      assert.equal(semValidade.code, '23514', semValidade.message);
      const validadeZero = await falha(gravarFato(c, S, t.terminal, { kind: 'renewal', at: '2026-09-03T10:00:00Z', anterior: t, validade: 0 }));
      assert.equal(validadeZero.code, '23514', validadeZero.message);
    });
  });

  test('configuração: fuso por região, moeda ISO, vigência não retroativa, e a versão posterior prevalece', async () => {
    await comBanco(async (c) => {
      const a = await criarUnidade(c, S, 'Unidade CF', '2026-09-01T10:00:00Z');
      for (const fuso of ['UTC', 'Etc/GMT+3', '-03:00', 'GMT', 'america/sao_paulo', 'Mars/Olympus']) {
        const erro = await falha(publicarConfiguracao(c, S, a, 1, fuso, 'BRL', '2026-09-01T11:00:00Z'));
        assert.ok(erro.code === '23514' || erro.code === '22023', `${fuso}: ${erro.code} ${erro.message}`);
      }
      for (const moeda of ['brl', 'BR', 'REAL']) {
        const erro = await falha(publicarConfiguracao(c, S, a, 1, 'America/Sao_Paulo', moeda, '2026-09-01T11:00:00Z'));
        assert.equal(erro.code, '23514', `${moeda}: ${erro.message}`);
      }
      const retroativa = await falha(
        publicarConfiguracao(c, S, a, 1, 'America/Sao_Paulo', 'BRL', '2026-09-05T11:00:00Z', '2026-09-04T00:00:00Z'),
      );
      assert.equal(retroativa.code, '23514', retroativa.message);

      await publicarConfiguracao(c, S, a, 1, 'America/Sao_Paulo', 'BRL', '2026-09-01T11:00:00Z');
      await publicarConfiguracao(c, S, a, 2, 'America/Manaus', 'BRL', '2026-09-02T11:00:00Z', '2026-10-01T00:00:00Z');
      await publicarConfiguracao(c, S, a, 3, 'America/Argentina/Buenos_Aires', 'ARS', '2026-09-03T11:00:00Z');
      const repetida = await falha(publicarConfiguracao(c, S, a, 3, 'America/Sao_Paulo', 'BRL', '2026-09-04T11:00:00Z'));
      assert.equal(repetida.code, '23505', repetida.message);

      const vigente = async (instante: string): Promise<number | undefined> => {
        const r = await c.query<{ v: number }>(
          `select configuration_version as v from ${S}.establishment_configurations
            where establishment_id = $1 and effective_from <= $2
            order by configuration_version desc limit 1`,
          [a.id, instante],
        );
        return r.rows[0]?.v;
      };
      assert.equal(await vigente('2026-09-01T10:30:00Z'), undefined, 'sem versão publicada, nenhum dia é derivável');
      assert.equal(await vigente('2026-09-02T12:00:00Z'), 1);
      assert.equal(await vigente('2026-09-10T00:00:00Z'), 3);
      assert.equal(await vigente('2026-10-05T00:00:00Z'), 3, 'a publicação posterior prevalece sobre a agendada');
    });
  });
});

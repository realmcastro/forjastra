import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { MINIMUM_SERVER_VERSION_NUM } from '../src/session.js';
import { disposableSchemaName } from '../src/commands/verify.js';
import { runExecutor } from './support/executor.js';
import { createDatabase, skipWithoutPostgres, withClient, type DisposableDatabase } from './support/postgres.js';
import { buildMigrationsDir } from './support/tree.js';

/**
 * As duas provas das correções de 2026-09-11: o piso de versão na entrada (`APLICACAO-E-ALVO.md` §6)
 * e o nome minúsculo do descartável (`PROVISION-E-VERIFY.md` §13.2, passo 1).
 */

/**
 * O nome do descartável é o **único** identificador que o sistema gera sem passar pela borda da
 * §10.2, e é ele que compra a neutralidade da impressão da §13.3 por construção. Com `T` e `Z`
 * maiúsculos o catálogo o cita, e sete linhas divergem em todo cliente comparado — medido.
 */
test('o nome do schema descartável é minúsculo puro', () => {
  for (let i = 0; i < 50; i += 1) {
    const nome = disposableSchemaName();
    assert.equal(nome, nome.toLowerCase(), nome);
    assert.match(nome, /^t_verify_\d{8}t\d{6}z_[0-9a-f]{16}$/);
  }
  assert.equal(
    disposableSchemaName(new Date('2026-09-11T20:16:43.123Z')).slice(0, 26),
    't_verify_20260911t201643z_',
  );
});

/**
 * O piso não é conferido contra um servidor de mentira: `FORJA_MIGRATOR_TEST_OLD_URL` aponta para um
 * servidor descartável **abaixo do piso**. Ausente, o teste é **pulado com motivo** — nunca dado
 * como passado.
 *
 * Desde 2026-09-11 o alvo natural dele é o **15**, e não mais só o 14: é o 15 que a medição da
 * `db/papel-do-cliente.md` §7.6 separa do 16, porque é nele que o `CREATEROLE` do executor alcança a
 * credencial da aplicação. O teste não escreve versão nenhuma: ele pergunta ao servidor qual é a
 * dele e cobra que a mensagem a nomeie.
 */
const OLD_URL = process.env['FORJA_MIGRATOR_TEST_OLD_URL'];

test(
  'servidor abaixo do piso recusa a rodada na entrada, com saída 2',
  { skip: OLD_URL === undefined ? 'sem FORJA_MIGRATOR_TEST_OLD_URL: não há servidor antigo para medir' : false },
  async () => {
    const antigo = await createDatabase(OLD_URL);
    try {
      const dele = await withClient(antigo.url, async (client) => {
        const resposta = await client.query<{ num: string; texto: string }>(
          "select current_setting('server_version_num') as num, " +
            "current_setting('server_version') as texto",
        );
        return resposta.rows[0]!;
      });
      assert.ok(
        Number.parseInt(dele.num, 10) < MINIMUM_SERVER_VERSION_NUM,
        `FORJA_MIGRATOR_TEST_OLD_URL aponta para ${dele.texto}, que não está abaixo do piso`,
      );

      const resultado = await runExecutor(
        { kind: 'migrate' },
        { url: antigo.url, migrationsDir: buildMigrationsDir() },
      );

      assert.equal(resultado.exitCode, 2, resultado.error);
      assert.match(resultado.error ?? '', /abaixo do piso 160000/);
      assert.match(resultado.error ?? '', /db\/convencoes\.md §9/);
      assert.ok(
        (resultado.error ?? '').includes(dele.texto),
        `a mensagem tem que nomear a versão encontrada (${dele.texto}): ${resultado.error}`,
      );

      // Nada foi tocado: a conferência acontece antes do bootstrap do livro-razão.
      await withClient(antigo.url, async (client) => {
        const controle = await client.query("select 1 from pg_namespace where nspname = 'platform'");
        assert.equal(controle.rowCount, 0, 'o schema de controle não pode nascer abaixo do piso');
      });
    } finally {
      await antigo.drop();
    }
  },
);

describe('servidor no piso ou acima', { skip: skipWithoutPostgres }, () => {
  let db: DisposableDatabase;

  before(async () => {
    db = await createDatabase();
  });
  after(async () => {
    await db.drop();
  });

  test('a conferência deixa passar, e o valor do piso é o da convenção', async () => {
    assert.equal(MINIMUM_SERVER_VERSION_NUM, 160_000);
    const resultado = await runExecutor(
      { kind: 'migrate' },
      { url: db.url, migrationsDir: buildMigrationsDir() },
    );
    assert.equal(resultado.exitCode, 0, resultado.error);
  });
});

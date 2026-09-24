import { test } from 'node:test';
import assert from 'node:assert/strict';

import { ConfigError, loadConfig } from '../src/config.js';

/**
 * O `0` nos tempos de banco (`SUB-04`,
 * `docs/auditorias/2026-09-12-conferencia-da-credencial-na-subida.md:174`).
 *
 * O estado hostil aqui é um valor, não um papel, e a prova é a mesma: cada chave excluída entra com
 * o valor excluído e a carga tem que **falhar**. Enumerar os valores saudáveis provaria o contrário
 * do que interessa.
 *
 * Medido em 2026-09-12, PostgreSQL 16.15, com `pg_catalog.pg_auth_members` travada em
 * `ACCESS EXCLUSIVE`: com `FORJA_PG_STATEMENT_TIMEOUT_MS=0` o processo ficou 12 s pendurado, a porta
 * fechada em todas as sondagens, nenhum fato emitido e nenhum código de saída. Com o padrão, o mesmo
 * estado recusa com `57014` e sai `78`.
 */

const URL_DE_TESTE = 'postgresql://forja_credencial@127.0.0.1:5432/forja';

const TEMPOS_DE_BANCO = [
  'FORJA_PG_STATEMENT_TIMEOUT_MS',
  'FORJA_PG_IDLE_IN_TRANSACTION_TIMEOUT_MS',
  'FORJA_PG_CONNECTION_TIMEOUT_MS',
] as const;

function ambiente(mudanca: Readonly<Record<string, string>> = {}): Record<string, string> {
  return { FORJA_DATABASE_URL: URL_DE_TESTE, ...mudanca };
}

for (const chave of TEMPOS_DE_BANCO) {
  test(`${chave}=0 é recusado, porque 0 é "sem limite" e sem limite é silêncio`, () => {
    assert.throws(
      () => loadConfig(ambiente({ [chave]: '0' })),
      (erro: unknown) => {
        assert.equal(erro instanceof ConfigError, true);
        assert.match((erro as ConfigError).message, new RegExp(chave));
        assert.match((erro as ConfigError).message, /sem limite/);
        return true;
      },
    );
  });
}

test('tempo de banco positivo passa, e a ausência cai no padrão escolhido', () => {
  const config = loadConfig(ambiente({ FORJA_PG_STATEMENT_TIMEOUT_MS: '1' }));
  assert.equal(config.database.statementTimeoutMs, 1);
  assert.equal(config.database.idleInTransactionTimeoutMs, 10_000);
  assert.equal(config.database.connectionTimeoutMs, 5_000);
});

/**
 * A recusa é dos **tempos**, não do algarismo. Porta `0` é a porta efêmera do sistema operacional,
 * que é como um teste sobe o servidor sem escolher número — recusá-la seria confundir o valor com
 * o significado dele em cada chave.
 */
test('porta 0 continua valendo: o que se recusa é tempo sem limite, não o dígito', () => {
  assert.equal(loadConfig(ambiente({ FORJA_HTTP_PORT: '0' })).http.port, 0);
});

test('valor não inteiro continua recusado, com a mensagem de sempre', () => {
  assert.throws(
    () => loadConfig(ambiente({ FORJA_PG_STATEMENT_TIMEOUT_MS: '5s' })),
    (erro: unknown) => {
      assert.equal(erro instanceof ConfigError, true);
      assert.match((erro as ConfigError).message, /inteiro não negativo/);
      return true;
    },
  );
});

test('credencial de banco não tem padrão: sem ela o processo não carrega configuração', () => {
  assert.throws(() => loadConfig({}), ConfigError);
});

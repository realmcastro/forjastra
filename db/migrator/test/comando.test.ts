import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCommand } from '../src/cli.js';
import { EXIT_REFUSED, ExecutorError } from '../src/errors.js';
import { loadConfig } from '../src/config.js';

/** `PROVISION-E-VERIFY.md` §12, e a recusa de configuração ausente de `db/papeis-e-credencial.md` §2. */

test('os quatro comandos, e só eles', () => {
  assert.deepEqual(parseCommand(['migrate']), { kind: 'migrate' });
  assert.deepEqual(parseCommand(['migrate', '--schema', 't_acme']), {
    kind: 'migrate',
    schema: 't_acme',
  });
  assert.deepEqual(parseCommand(['status']), { kind: 'status' });
  assert.deepEqual(parseCommand(['provision', 'acme']), { kind: 'provision', slug: 'acme' });
  assert.deepEqual(parseCommand(['verify']), { kind: 'verify' });

  for (const argv of [[], ['apply'], ['migrate', '--force'], ['provision'], ['verify', 'x']]) {
    assert.throws(
      () => parseCommand(argv),
      (erro: unknown) => erro instanceof ExecutorError && erro.exitCode === EXIT_REFUSED,
      argv.join(' '),
    );
  }
});

test('sem credencial e sem lock_timeout o executor recusa iniciar, nomeando a chave', () => {
  assert.throws(() => loadConfig({}), /FORJA_MIGRATOR_DATABASE_URL/);
  assert.throws(
    () => loadConfig({ FORJA_MIGRATOR_DATABASE_URL: 'postgres://exemplo/banco' }),
    /FORJA_MIGRATOR_LOCK_TIMEOUT_MS/,
  );
  assert.throws(
    () =>
      loadConfig({
        FORJA_MIGRATOR_DATABASE_URL: 'postgres://exemplo/banco',
        FORJA_MIGRATOR_LOCK_TIMEOUT_MS: '5000',
      }),
    /FORJA_MIGRATOR_IDLE_IN_TRANSACTION_TIMEOUT_MS/,
  );
});

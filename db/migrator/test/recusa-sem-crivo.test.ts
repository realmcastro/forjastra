import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EXIT_REFUSED } from '../src/errors.js';
import { resolveContentScreen } from '../src/content-screen.js';
import { load } from '../src/loader.js';
import { ExecutorError } from '../src/errors.js';
import { buildMigrationsDir } from './support/tree.js';

/**
 * **O crivo da §11 é obrigatório, e sem ele nada é aplicado.**
 *
 * A trava continua de pé depois de o crivo existir, e é de propósito: sem crivo, um
 * `DROP SCHEMA t_vitima CASCADE` em arquivo de migration atravessa o executor inteiro — foi o
 * `MIG-03`, medido pelo gate. Quem um dia passar a montar o executor por outro caminho encontra a
 * recusa em vez de uma aplicação silenciosa.
 */

test('resolveContentScreen devolve o crivo da §11', () => {
  assert.notEqual(resolveContentScreen(), undefined);
});

test('carregar sem crivo recusa a rodada, com saída 2, antes de qualquer conexão', () => {
  assert.throws(
    () => load(buildMigrationsDir(), undefined),
    (erro: unknown) =>
      erro instanceof ExecutorError &&
      erro.exitCode === EXIT_REFUSED &&
      /crivo de conteúdo da §11 não está implementado/.test(erro.message),
  );
});

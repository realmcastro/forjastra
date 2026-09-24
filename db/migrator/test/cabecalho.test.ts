import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parseHeader } from '../src/header.js';
import { ExecutorError, EXIT_REFUSED } from '../src/errors.js';
import { REAL_PLATFORM_DIR } from './support/tree.js';

/** `CONTRATO.md` §4: cabeçalho e diretivas. */

const OBRIGATORIAS =
  '-- alvo: tenant\n-- transacional: sim\n-- reversivel: nao; cria tabela nova\n\nSELECT 1;\n';

test('as quatro migrations do repositório passam pelo cabeçalho (§4)', () => {
  for (const file of readdirSync(REAL_PLATFORM_DIR)) {
    const text = readFileSync(join(REAL_PLATFORM_DIR, file), 'utf-8');
    const { header } = parseHeader(text, `platform/${file}`);
    assert.equal(header.alvo, 'platform');
    assert.equal(header.transacional, true);
    assert.equal(header.modulo, undefined);
  }
});

/**
 * O caso que fez a regra existir: `0004` tem, quinze linhas abaixo do cabeçalho, uma linha de prosa
 * com a forma de diretiva (`-- nenhuma: paravam a rodada ...`). Lê-la como diretiva desconhecida
 * reprovaria um arquivo já aplicado, que não se edita (`migrations.md` §1).
 */
test('prosa com dois-pontos abaixo do cabeçalho não é diretiva', () => {
  const texto =
    '-- alvo: platform\n' +
    '-- transacional: sim\n' +
    '-- reversivel: nao; cria tabela nova, e a inversa apagaria o registro\n' +
    '--             do que já foi aplicado\n' +
    '--\n' +
    '-- AUSÊNCIA DECLARADA\n' +
    '-- nenhuma: paravam a rodada e morriam na saída do processo\n' +
    '\nCREATE TABLE IF NOT EXISTS platform.x ();\n';
  const { header } = parseHeader(texto, 'platform/0009__x');
  assert.equal(header.alvo, 'platform');
  assert.match(header.reversivelJustificativa, /do que já foi aplicado$/);
});

test('recusa cabeçalho sem diretiva obrigatória, com desconhecida, e repetida', () => {
  const casos: readonly (readonly [string, RegExp])[] = [
    ['-- alvo: tenant\n-- transacional: sim\n\nSELECT 1;\n', /diretiva obrigatória "reversivel"/],
    [`-- alvo: tenant\n-- chave: valor\n${OBRIGATORIAS}`, /diretiva desconhecida/],
    [`-- alvo: tenant\n${OBRIGATORIAS}`, /diretiva repetida/],
  ];
  for (const [texto, esperado] of casos) {
    assert.throws(
      () => parseHeader(texto, 'tenant/0001__x'),
      (erro: unknown) => erro instanceof ExecutorError && erro.exitCode === EXIT_REFUSED && esperado.test(erro.message),
      texto,
    );
  }
});

test('reversivel sem justificativa depois do valor é recusado', () => {
  assert.throws(
    () => parseHeader('-- alvo: tenant\n-- transacional: sim\n-- reversivel: nao\n\nSELECT 1;\n', 'tenant/0001__x'),
    /reversivel precisa ser/,
  );
});

test('modulo aceita só o código de três letras maiúsculas', () => {
  const comModulo = (valor: string): string =>
    `-- alvo: tenant\n-- modulo: ${valor}\n-- transacional: sim\n-- reversivel: nao; cria tabela\n\nSELECT 1;\n`;
  assert.equal(parseHeader(comModulo('EST'), 'x').header.modulo, 'EST');
  for (const invalido of ['est', 'ESTOQUE', 'ES', 'E1S']) {
    assert.throws(() => parseHeader(comModulo(invalido), 'x'), /modulo precisa ser/, invalido);
  }
});

test('cria-indice só existe em migration não-transacional, e com nome de identificador', () => {
  const naoTransacional =
    '-- alvo: tenant\n-- transacional: nao\n-- reversivel: nao; cria índice\n-- cria-indice: ix_a, ix_b\n\nSELECT 1;\n';
  assert.deepEqual([...parseHeader(naoTransacional, 'x').header.criaIndice], ['ix_a', 'ix_b']);

  const transacional =
    '-- alvo: tenant\n-- transacional: sim\n-- reversivel: nao; cria índice\n-- cria-indice: ix_a\n\nSELECT 1;\n';
  assert.throws(() => parseHeader(transacional, 'x'), /cria-indice só existe/);
});

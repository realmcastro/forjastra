import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * O executor da suíte medido pelo que ele recusa, na parte em que ele confere **arquivo** e não
 * placar: o arquivo vivo esvaziado e o arquivo novo que fala com o banco sem estar na lista. As duas
 * passavam pelo gate até 2026-09-23 e já eram recusadas do outro lado da parede
 * (`db/migrator/test/executor-da-suite.test.ts`), e duas políticas diferentes são piores que uma dura.
 *
 * **A medição roda contra uma árvore de mentira**, nunca contra o `dist/test` de verdade: medir o
 * executor sobre o alvo real, de dentro da suíte que ele roda, seria recursão. Cada caso monta um
 * `dist/test` descartável e aponta o `cwd` do filho para ele.
 */

const EXECUTOR_DA_SUITE = fileURLToPath(new URL('../../scripts/run-tests.mjs', import.meta.url));
const ARQUIVOS_VIVOS: readonly string[] = JSON.parse(
  readFileSync(fileURLToPath(new URL('../../scripts/live-files.json', import.meta.url)), 'utf8'),
) as string[];

/**
 * A chave do banco é a marca pela qual o executor reconhece arquivo que fala com o Postgres. Montada
 * em pedaços porque, escrita inteira, ela ficaria no corpo compilado deste arquivo, e o executor o
 * classificaria como arquivo de banco fora da lista.
 */
const CHAVE_DO_BANCO = ['FORJA', 'TEST', 'DATABASE', 'URL'].join('_');
const LE_A_CHAVE = `const url = process.env['${CHAVE_DO_BANCO}'];\n`;

/** Nunca é discada: os arquivos da árvore de mentira não abrem conexão. */
const BANCO_DE_MENTIRA = 'postgres://ninguem@127.0.0.1:1/nao_disca';

interface ArquivoFalso {
  readonly nome: string;
  readonly corpo: string;
}

const PASSA: ArquivoFalso = {
  nome: 'passa.test.js',
  corpo: "import { test } from 'node:test';\ntest('passa', () => {});\n",
};

/** Um arquivo que lê a chave do banco, com um caso que passa. `nome` pode sair do glob de propósito. */
function vivo(nome: string): ArquivoFalso {
  return {
    nome,
    corpo: "import { test } from 'node:test';\n" + LE_A_CHAVE + "test('vivo', () => { void url; });\n",
  };
}

const TODOS_OS_VIVOS: readonly ArquivoFalso[] = ARQUIVOS_VIVOS.map(vivo);

function arvoreFalsa(arquivos: readonly ArquivoFalso[]): string {
  const raiz = mkdtempSync(join(tmpdir(), 'forja-api-executor-da-suite-'));
  const pasta = join(raiz, 'dist', 'test');
  mkdirSync(pasta, { recursive: true });
  for (const arquivo of arquivos) writeFileSync(join(pasta, arquivo.nome), arquivo.corpo);
  return raiz;
}

interface Desfecho {
  readonly code: number;
  readonly saida: string;
}

function rodarGate(raiz: string): Desfecho {
  const ambiente = { ...process.env, [CHAVE_DO_BANCO]: BANCO_DE_MENTIRA };
  // Herdando `NODE_TEST_CONTEXT`, o `node --test` do filho recusa rodar por recursão e não escreve
  // relator nenhum, e o que volta é resumo ausente em vez de placar.
  delete ambiente['NODE_TEST_CONTEXT'];
  const filho = spawnSync(process.execPath, [EXECUTOR_DA_SUITE], {
    cwd: raiz,
    env: ambiente,
    encoding: 'utf8',
  });
  return { code: filho.status ?? -1, saida: `${filho.stdout}${filho.stderr}` };
}

function comArvore(arquivos: readonly ArquivoFalso[], medir: (raiz: string) => void): void {
  const raiz = arvoreFalsa(arquivos);
  try {
    medir(raiz);
  } finally {
    rmSync(raiz, { recursive: true, force: true });
  }
}

describe('o executor da suíte, por arquivo', () => {
  test('a lista de arquivos vivos não está vazia', () => {
    assert.ok(ARQUIVOS_VIVOS.length > 0);
  });

  /**
   * O teste que o `node --test` inventa para arquivo sem caso nenhum sai `✔ <caminho do arquivo>`,
   * passando, e contava como execução do arquivo vivo. Medido em 2026-09-23, Node 22.23.1.
   */
  test('arquivo vivo esvaziado reprova, nomeado', () => {
    const [primeiro, ...resto] = TODOS_OS_VIVOS;
    assert.ok(primeiro !== undefined);
    const esvaziado: ArquivoFalso = { nome: primeiro.nome, corpo: LE_A_CHAVE };
    comArvore([PASSA, esvaziado, ...resto], (raiz) => {
      const gate = rodarGate(raiz);
      assert.equal(gate.code, 1, gate.saida);
      assert.ok(gate.saida.includes(`não executado: ${primeiro.nome}`), gate.saida);
      assert.equal(gate.saida.match(/não executado:/g)?.length, 1, 'só o que faltou é nomeado');
    });
  });

  test('arquivo vivo ausente da árvore reprova, nomeado', () => {
    const [primeiro, ...resto] = TODOS_OS_VIVOS;
    assert.ok(primeiro !== undefined);
    comArvore([PASSA, ...resto], (raiz) => {
      const gate = rodarGate(raiz);
      assert.equal(gate.code, 1, gate.saida);
      assert.ok(gate.saida.includes(`não executado: ${primeiro.nome}`), gate.saida);
    });
  });

  test('arquivo novo que fala com o banco fora da lista reprova, nomeado', () => {
    comArvore([...TODOS_OS_VIVOS, PASSA, vivo('novo-live.test.js')], (raiz) => {
      const gate = rodarGate(raiz);
      assert.equal(gate.code, 1, gate.saida);
      assert.match(gate.saida, /não declarado: novo-live\.test\.js/);
      assert.doesNotMatch(gate.saida, /não executado/, 'os declarados rodaram todos');
    });
  });

  test('arquivo que fala com o banco fora do glob reprova, nomeado', () => {
    comArvore([...TODOS_OS_VIVOS, PASSA, vivo('renomeado.spec.js')], (raiz) => {
      const gate = rodarGate(raiz);
      assert.equal(gate.code, 1, gate.saida);
      assert.match(gate.saida, /fora do alvo .*: renomeado\.spec\.js fala com o banco e não roda/);
    });
  });

  /** A contraprova: lista inteira presente e passando, o gate sai `0` e diz quantos exerceu. */
  test('com todo arquivo vivo exercido, o gate passa e conta os arquivos', () => {
    comArvore([...TODOS_OS_VIVOS, PASSA], (raiz) => {
      const gate = rodarGate(raiz);
      assert.equal(gate.code, 0, gate.saida);
      assert.match(gate.saida, new RegExp(`${ARQUIVOS_VIVOS.length} arquivos vivos exercidos`));
    });
  });
});

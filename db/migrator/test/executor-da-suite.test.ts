import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Caso 59 de `CONTRATO.md` §14: **o executor da suíte, medido pelo que ele recusa.**
 *
 * `piso-de-medicao.test.ts` cobra a **condição** que produz um verde honesto — existe servidor, e
 * ele aceita papel sem senha. Este arquivo cobra o **número** e o **alvo**: servidor faltando é
 * recusa antes de rodar, total zero é recusa depois, pulo em modo de gate é recusa, e o modo parcial
 * diz em voz alta o que não exercitou.
 *
 * A classe é a quarta encarnação da mesma coisa (`SUB-03`, `PAP-17`, `PAP-23`, `SUB-07`): a linha que
 * se lê primeiro dizendo que passou o que ninguém exerceu. Ela reaparece porque o gatilho não é
 * exótico — mexer em `rootDir`, `outDir`, `include` ou na convenção de nome não se parece com
 * segurança, e é exatamente o que apaga o alvo.
 *
 * **A medição roda contra uma árvore de mentira, nunca contra `dist/test` de verdade.** O executor
 * da suíte roda a suíte; medi-lo de dentro dela, sobre o alvo real, seria recursão infinita — este
 * arquivo é um dos que o modo parcial roda. Então cada caso monta um `dist/test` descartável com os
 * arquivos que aquele caso precisa, e o `cwd` do filho aponta para ele.
 */

const EXECUTOR_DA_SUITE = fileURLToPath(new URL('../../scripts/run-tests.mjs', import.meta.url));
const ARQUIVOS_VIVOS: readonly string[] = JSON.parse(
  readFileSync(fileURLToPath(new URL('../../scripts/arquivos-vivos.json', import.meta.url)), 'utf8'),
) as string[];

/**
 * A marca que o executor da suíte usa para saber que um arquivo fala com um Postgres de verdade.
 *
 * Ela é **montada em pedaços**, e isso não é estilo: escrita inteira, ela apareceria no corpo deste
 * arquivo compilado, e o executor o classificaria como arquivo de banco — o teste que mede o modo
 * parcial deixaria de rodar no modo parcial, calado.
 */
const IMPORTA_POSTGRES = `import './support/${'postgres'}.js';\n`;

interface ArquivoFalso {
  readonly nome: string;
  readonly corpo: string;
}

const PASSA: ArquivoFalso = {
  nome: 'passa.test.js',
  corpo: "import { test } from 'node:test';\ntest('passa', () => {});\n",
};

const PULA: ArquivoFalso = {
  nome: 'pula.test.js',
  corpo: "import { test } from 'node:test';\ntest('pula', { skip: 'sem o servidor ao lado' }, () => {});\n",
};

const COM_BANCO: ArquivoFalso = {
  nome: 'com-banco.test.js',
  corpo:
    IMPORTA_POSTGRES +
    "import { test } from 'node:test';\n" +
    // A sentinela é uma palavra que não aparece em mensagem nenhuma do executor da suíte: a primeira
    // versão usava "rodou", e ela casava com "Confira se o build rodou" da recusa por alvo vazio.
    "test('só roda fora do modo parcial', () => { throw new Error('ISCA_DE_BANCO_EXECUTADA'); });\n",
};

/** Um arquivo que fala com o banco, com um caso que passa. `nome` pode sair do glob de propósito. */
function vivo(nome: string): ArquivoFalso {
  return {
    nome,
    corpo: IMPORTA_POSTGRES + "import { test } from 'node:test';\ntest('vivo', () => {});\n",
  };
}

/** A lista inteira de `scripts/arquivos-vivos.json`, cada um passando: o gate sem defeito nenhum. */
const TODOS_OS_VIVOS: readonly ArquivoFalso[] = ARQUIVOS_VIVOS.map(vivo);

/**
 * Os quatro jeitos de marcar `todo` que o nono gate mediu passando pelo gate, cada um com um corpo
 * que **falha**: é a falha descartada que faz o `todo` ser pulo com outro nome.
 */
const TODOS: readonly ArquivoFalso[] = [
  "test('opção', { todo: true }, () => { throw new Error('x'); });\n",
  "test('no corpo', (t) => { t.todo('depois'); throw new Error('x'); });\n",
  "describe('bloco', { todo: true }, () => { test('dentro', () => { throw new Error('x'); }); });\n",
  "test.todo('método', () => { throw new Error('x'); });\n",
].map((caso, indice) => ({
  nome: `todo-${indice}.test.js`,
  corpo: "import { test, describe } from 'node:test';\n" + caso,
}));

/**
 * Uma árvore com `dist/test` e nada mais. O apoio de Postgres é um arquivo vazio: o que o executor
 * procura é a **marca de importação**, e um apoio de mentira mantém o filho carregável sem subir
 * banco nenhum.
 */
function arvoreFalsa(arquivos: readonly ArquivoFalso[]): string {
  const raiz = mkdtempSync(join(tmpdir(), 'forja-executor-da-suite-'));
  const pasta = join(raiz, 'dist', 'test');
  mkdirSync(join(pasta, 'support'), { recursive: true });
  writeFileSync(join(pasta, 'support', 'postgres.js'), 'export const nada = true;\n');
  for (const arquivo of arquivos) writeFileSync(join(pasta, arquivo.nome), arquivo.corpo);
  return raiz;
}

interface Desfecho {
  readonly code: number;
  readonly saida: string;
}

function rodarGate(
  raiz: string,
  servidores: { admin?: string; antigo?: string },
  argumentos: readonly string[] = [],
): Desfecho {
  const ambiente = { ...process.env };
  delete ambiente['FORJA_MIGRATOR_TEST_ADMIN_URL'];
  delete ambiente['FORJA_MIGRATOR_TEST_OLD_URL'];
  /**
   * O filho é um **gate próprio**, não uma rodada aninhada desta. Herdando `NODE_TEST_CONTEXT`,
   * `node --test` lá dentro recusa rodar ("run() is being called recursively") e não escreve relator
   * nenhum — medido em 2026-09-12, e o que chega aqui é um resumo ausente, não um placar.
   */
  delete ambiente['NODE_TEST_CONTEXT'];
  if (servidores.admin !== undefined) ambiente['FORJA_MIGRATOR_TEST_ADMIN_URL'] = servidores.admin;
  if (servidores.antigo !== undefined) ambiente['FORJA_MIGRATOR_TEST_OLD_URL'] = servidores.antigo;

  const filho = spawnSync(process.execPath, [EXECUTOR_DA_SUITE, ...argumentos], {
    cwd: raiz,
    env: ambiente,
    encoding: 'utf8',
  });
  return { code: filho.status ?? -1, saida: `${filho.stdout}${filho.stderr}` };
}

/** Os dois nomes nunca são discados: o executor da suíte só confere que eles **existem**. */
const ADMIN_DE_MENTIRA = 'postgres://ninguem@127.0.0.1:1/nao_disca';
const ANTIGO_DE_MENTIRA = 'postgres://ninguem@127.0.0.1:2/nao_disca';

describe('o executor da suíte', () => {
  test('servidor faltando é recusa antes de rodar, e o que falta é nomeado', () => {
    const raiz = arvoreFalsa([PASSA]);
    try {
      const semAntigo = rodarGate(raiz, { admin: ADMIN_DE_MENTIRA });
      assert.equal(semAntigo.code, 1, semAntigo.saida);
      assert.match(semAntigo.saida, /FORJA_MIGRATOR_TEST_OLD_URL/);
      assert.doesNotMatch(
        semAntigo.saida,
        /FORJA_MIGRATOR_TEST_ADMIN_URL/,
        'o servidor que está lá não entra na lista do que falta',
      );
      assert.doesNotMatch(
        semAntigo.saida,
        /# tests/,
        'recusa por servidor faltando acontece antes de rodar teste nenhum',
      );

      const semNenhum = rodarGate(raiz, {});
      assert.equal(semNenhum.code, 1, semNenhum.saida);
      assert.match(semNenhum.saida, /FORJA_MIGRATOR_TEST_ADMIN_URL/);
      assert.match(semNenhum.saida, /FORJA_MIGRATOR_TEST_OLD_URL/);
      assert.match(semNenhum.saida, /test:no-db/, 'a recusa nomeia a saída que existe');
    } finally {
      rmSync(raiz, { recursive: true, force: true });
    }
  });

  /**
   * O defeito gêmeo, e é o que reaparece: o alvo deixa de casar arquivo nenhum, `node --test` sai
   * `0`, o resumo sai `0 fail`, e sem esta conferência o gate concorda com os dois.
   */
  test('total zero reprova, com o placar à vista, nos dois modos', () => {
    const vazia = arvoreFalsa([]);
    try {
      const gate = rodarGate(vazia, { admin: ADMIN_DE_MENTIRA, antigo: ANTIGO_DE_MENTIRA });
      assert.equal(gate.code, 1, gate.saida);
      assert.match(gate.saida, /suíte reprovada: 0 testes · 0 passando/);
      assert.match(gate.saida, /nenhum teste foi executado/);
      assert.match(gate.saida, /rootDir, outDir, include/, 'a mensagem nomeia o gatilho da classe');

      const parcial = rodarGate(vazia, {}, ['--no-database']);
      assert.equal(parcial.code, 1, parcial.saida);
      assert.match(parcial.saida, /nenhum teste foi executado/);
    } finally {
      rmSync(vazia, { recursive: true, force: true });
    }
  });

  /**
   * Só arquivo que fala com banco: no modo parcial a lista de alvos fica **vazia**, e lista vazia
   * não vira "descubra sozinho". Medido em 2026-09-12: `node --test` sem argumento posicional varre
   * o projeto inteiro e passa a rodar os `.ts` da árvore de fonte.
   */
  test('modo parcial sem alvo derivado reprova em vez de varrer o projeto', () => {
    const raiz = arvoreFalsa([COM_BANCO]);
    try {
      const parcial = rodarGate(raiz, {}, ['--no-database']);
      assert.equal(parcial.code, 1, parcial.saida);
      assert.match(parcial.saida, /nenhum teste foi executado/);
      assert.doesNotMatch(
        parcial.saida,
        /ISCA_DE_BANCO_EXECUTADA/,
        'o arquivo que fala com banco não foi executado',
      );
    } finally {
      rmSync(raiz, { recursive: true, force: true });
    }
  });

  test('pulo em modo de gate reprova, e o placar diz quantos', () => {
    const raiz = arvoreFalsa([PASSA, PULA]);
    try {
      const gate = rodarGate(raiz, { admin: ADMIN_DE_MENTIRA, antigo: ANTIGO_DE_MENTIRA });
      assert.equal(gate.code, 1, gate.saida);
      assert.match(gate.saida, /gate reprovado: 2 testes/);
      assert.match(gate.saida, /1 pulados/);
      assert.match(gate.saida, /nenhum teste pode pular/);
    } finally {
      rmSync(raiz, { recursive: true, force: true });
    }
  });

  /**
   * O `PAP-29`: `todo` com corpo falhando saía `0` e somava menos que o total no placar. Cada uma das
   * quatro formas, sozinha ao lado de um caso que passa, reprova nos dois modos.
   */
  test('todo reprova, nas quatro formas, no gate e no modo parcial', () => {
    for (const todo of TODOS) {
      const raiz = arvoreFalsa([...TODOS_OS_VIVOS, PASSA, todo]);
      try {
        const gate = rodarGate(raiz, { admin: ADMIN_DE_MENTIRA, antigo: ANTIGO_DE_MENTIRA });
        assert.equal(gate.code, 1, `${todo.corpo}\n${gate.saida}`);
        assert.match(gate.saida, /suíte reprovada: .* [1-9]\d* todo/, todo.corpo);
        assert.match(gate.saida, /pulo com outro nome/);

        const parcial = rodarGate(raiz, {}, ['--no-database']);
        assert.equal(parcial.code, 1, `${todo.corpo}\n${parcial.saida}`);
        assert.match(parcial.saida, /pulo com outro nome/);
      } finally {
        rmSync(raiz, { recursive: true, force: true });
      }
    }
  });

  /**
   * O `PAP-29` pelo outro lado, e é o `SUB-10` medido em `apps/api`: o placar fecha sobre o que
   * rodou, e um arquivo vivo que sumiu do alvo não deixa rastro nele.
   */
  test('arquivo vivo da lista que não rodou reprova, nomeado', () => {
    const [primeiro, ...resto] = TODOS_OS_VIVOS;
    assert.ok(primeiro !== undefined, 'a lista de arquivos vivos não pode estar vazia');
    const vazio: ArquivoFalso = { nome: primeiro.nome, corpo: IMPORTA_POSTGRES };
    for (const arvore of [[PASSA, ...resto], [PASSA, vazio, ...resto]]) {
      const raiz = arvoreFalsa(arvore);
      try {
        const gate = rodarGate(raiz, { admin: ADMIN_DE_MENTIRA, antigo: ANTIGO_DE_MENTIRA });
        assert.equal(gate.code, 1, gate.saida);
        assert.ok(gate.saida.includes(`não executado: ${primeiro.nome}`), gate.saida);
        assert.equal(gate.saida.match(/não executado:/g)?.length, 1, 'só o que faltou é nomeado');
      } finally {
        rmSync(raiz, { recursive: true, force: true });
      }
    }
  });

  test('arquivo que fala com o banco fora do glob, ou fora da lista, reprova nomeado', () => {
    const raiz = arvoreFalsa([...TODOS_OS_VIVOS, vivo('renomeado.spec.js'), vivo('novo.test.js')]);
    try {
      const gate = rodarGate(raiz, { admin: ADMIN_DE_MENTIRA, antigo: ANTIGO_DE_MENTIRA });
      assert.equal(gate.code, 1, gate.saida);
      assert.match(gate.saida, /fora do alvo .*: renomeado\.spec\.js fala com o banco e não roda/);
      assert.match(gate.saida, /não declarado: novo\.test\.js/);
      assert.doesNotMatch(gate.saida, /não executado/, 'os declarados rodaram todos');
    } finally {
      rmSync(raiz, { recursive: true, force: true });
    }
  });

  /** A contraprova: com a lista inteira presente e passando, o gate sai `0` e diz quantos exerceu. */
  test('com todo arquivo vivo exercido, o gate passa e conta os arquivos', () => {
    const raiz = arvoreFalsa([...TODOS_OS_VIVOS, PASSA]);
    try {
      const gate = rodarGate(raiz, { admin: ADMIN_DE_MENTIRA, antigo: ANTIGO_DE_MENTIRA });
      assert.equal(gate.code, 0, gate.saida);
      assert.match(gate.saida, new RegExp(`${ARQUIVOS_VIVOS.length} arquivos vivos exercidos`));
    } finally {
      rmSync(raiz, { recursive: true, force: true });
    }
  });

  /**
   * O modo parcial é bandeira de linha de comando, nunca variável de ambiente: chave que afrouxa
   * conferência acaba configurada na integração contínua no primeiro dia difícil e some do histórico
   * de quem rodou. E ele sai `0` **dizendo** que não é o gate.
   */
  test('o modo parcial roda só o que não fala com banco, e diz que não é o gate', () => {
    const raiz = arvoreFalsa([PASSA, COM_BANCO]);
    try {
      const parcial = rodarGate(raiz, {}, ['--no-database']);
      assert.equal(parcial.code, 0, parcial.saida);
      assert.match(parcial.saida, /modo parcial \(--no-database\): 1 testes · 1 passando/);
      assert.match(parcial.saida, /Isto NÃO é o gate/);
      assert.doesNotMatch(
        parcial.saida,
        /ISCA_DE_BANCO_EXECUTADA/,
        'o arquivo que fala com banco ficou de fora',
      );

      const gate = rodarGate(raiz, { admin: ADMIN_DE_MENTIRA, antigo: ANTIGO_DE_MENTIRA });
      assert.equal(gate.code, 1, gate.saida);
      assert.match(
        gate.saida,
        /ISCA_DE_BANCO_EXECUTADA/,
        'sem a bandeira, o mesmo alvo inclui o arquivo de banco: o modo parcial é escolha de quem roda',
      );
    } finally {
      rmSync(raiz, { recursive: true, force: true });
    }
  });
});

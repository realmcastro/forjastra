#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * O executor da suíte. Ele existe para que **esta** suíte e a de `apps/api` tenham a mesma política,
 * e não duas — duas políticas diferentes são piores que uma dura, porque quem lê um verde não sabe
 * qual das duas produziu aquele verde.
 *
 * O gate continua exigindo Postgres, que é a correção do `PAP-23`. O que muda é a forma:
 *
 * 1. **O modo parcial é bandeira de linha de comando (`--no-database`), nunca variável de ambiente.**
 *    Chave de ambiente que afrouxa conferência é chave de escape com outro nome: ela acaba
 *    configurada na integração contínua no primeiro dia difícil e some do histórico de quem rodou.
 *    A bandeira aparece no comando, e o modo diz em voz alta o que não exercitou.
 * 2. **Total zero reprova, nos dois modos** (`SUB-07`). Medido do outro lado da parede em 2026-09-12:
 *    com o alvo apontando para um glob sem correspondência, `node --test` sai `0`, o resumo sai
 *    `0 fail`, e o gate concordava com os dois. É a quarta encarnação da mesma classe (`SUB-03`,
 *    `PAP-17`, `PAP-23`), e o gatilho não é exótico — é mexer em `rootDir`, `outDir`, `include` ou na
 *    convenção de nome, que ninguém associa a segurança.
 * 3. **Com os dois servidores servidos, nenhum teste pode pular.** O pulo que sobrava aqui era o do
 *    piso de versão, que precisa de um servidor **abaixo** do piso ao lado. Ele é legítimo e por isso
 *    envelhecia bem: era o número que se aprende a não olhar. Servido o servidor antigo, ele roda; e
 *    aí a regra é a mesma da outra suíte, sem piso de pulados para alguém ajustar quando incomodar.
 *
 * 4. **Passar é `pass === total`, e não "nada falhou"** (`PAP-29`). Medido em 2026-09-23: um caso cujo
 *    corpo lança, marcado `todo` de quatro jeitos, saía `0` com o placar somando menos que o total,
 *    e ninguém olhava a diferença. `todo` é pulo que roda e descarta a falha. Conferir a igualdade, e
 *    não cada categoria, pega também a categoria que o `node --test` venha a inventar.
 * 5. **Os arquivos que falam com o banco são nomeados, e cada um precisa ter rodado** (`PAP-29`, e o
 *    `SUB-10` do outro lado da parede). O total zero pega o alvo que não casa nada; não pega o alvo
 *    que casa **quase** tudo. Medido lá: com os arquivos vivos fora do glob (um refactor de nome ou
 *    de `rootDir`), a suíte saía `0` sem teste nenhum tocar o banco, inclusive com a mutação de um
 *    predicado de isolamento aplicada. A lista mora em `arquivos-vivos.json`, e ela não envelhece
 *    calada pelas duas pontas: arquivo que fala com o banco e não está nela reprova, e arquivo nela
 *    que não executou teste nenhum reprova.
 *
 * `piso-de-medicao.test.ts` continua existindo e continua sendo o controle do **conteúdo** do gate: o
 * servidor precisa aceitar papel sem senha, senão a camada de papel inteira pula. Este arquivo cobra
 * o **número**; aquele cobra a condição que produz o número.
 */

const MODO_PARCIAL = process.argv.includes('--no-database');
const ALVO = 'dist/test/**/*.test.js';
const PASTA_DE_TESTES = 'dist/test';
/** O que o modo parcial **não** roda: todo arquivo que fala com um Postgres de verdade. */
const MARCA_DE_BANCO = 'support/postgres.js';
/** O apoio não é teste: ele importa a marca e não roda caso nenhum. */
const PASTA_DE_APOIO = 'support';
const ARQUIVOS_VIVOS = JSON.parse(
  readFileSync(fileURLToPath(new URL('./arquivos-vivos.json', import.meta.url)), 'utf8'),
);
const RELATOR_POR_ARQUIVO = fileURLToPath(new URL('./relator-por-arquivo.mjs', import.meta.url));

const SERVIDORES = [
  {
    chave: 'FORJA_MIGRATOR_TEST_ADMIN_URL',
    o_que: 'um postgres:16 descartável com POSTGRES_HOST_AUTH_METHOD=trust',
    por_que:
      'sem ele a camada de papel inteira é pulada, e a suíte sai 0 sem ter provado nada sobre ' +
      'isolamento entre clientes (PAP-23)',
  },
  {
    chave: 'FORJA_MIGRATOR_TEST_OLD_URL',
    o_que: 'um postgres:15 descartável, também com trust',
    por_que:
      'é contra ele que se mede a recusa de iniciar abaixo do piso de versão (APLICACAO-E-ALVO.md ' +
      '§6); sem ele esse teste pula, e pulo em modo de gate é "0 fail" sobre o que ninguém exerceu',
  },
];

const ausentes = SERVIDORES.filter(({ chave }) => (process.env[chave] ?? '').trim() === '');

if (!MODO_PARCIAL && ausentes.length > 0) {
  process.stderr.write(
    'o gate exige os dois servidores de teste, e falta:\n\n' +
      ausentes.map(({ chave, o_que, por_que }) => `  - ${chave}: ${o_que}\n    ${por_que}\n`).join('') +
      '\nou rode "npm run test:no-db", que é o modo parcial e diz o que não exercitou.\n',
  );
  process.exit(1);
}

function reprovarPorAlvoVazio(placar = '0 testes · 0 passando') {
  process.stderr.write(
    `\nsuíte reprovada: ${placar}.\n` +
      'nenhum teste foi executado, e "0 falhando" sobre zero teste é a linha que se lê primeiro\n' +
      'dizendo que passou o que ninguém exerceu. Confira se o build rodou, e se tsconfig\n' +
      '(rootDir, outDir, include) e a convenção de nome ainda produzem arquivos em\n' +
      `"${MODO_PARCIAL ? PASTA_DE_TESTES : ALVO}".\n`,
  );
  process.exit(1);
}

/**
 * No modo parcial o alvo é derivado, e não uma lista escrita à mão: arquivo que importa o apoio de
 * Postgres fala com um banco de verdade e fica de fora. Lista escrita à mão envelhece calada — o
 * arquivo novo que precisa de banco entraria nela por esquecimento e o modo parcial passaria a
 * falhar por motivo que não é dele.
 */
function alvosSemBanco() {
  return readdirSync(PASTA_DE_TESTES)
    .filter((nome) => nome.endsWith('.test.js'))
    .map((nome) => join(PASTA_DE_TESTES, nome))
    .filter((caminho) => !readFileSync(caminho, 'utf8').includes(MARCA_DE_BANCO));
}

const alvos = MODO_PARCIAL ? alvosSemBanco() : [ALVO];

/**
 * Lista de alvos vazia **não** vira "descubra sozinho". Medido em 2026-09-12: `node --test` sem
 * argumento posicional varre o projeto inteiro e passa a rodar os `.ts` da árvore de fonte — o modo
 * parcial saiu `26 testes · 23 falhando` sobre arquivos que ninguém pediu. É a mesma família do total
 * zero, e falha aqui pelo mesmo motivo: o alvo é a conjunção de build e convenção de nome, e quando
 * ele não casa nada o desfecho honesto é parar.
 */
if (alvos.length === 0) {
  reprovarPorAlvoVazio();
}

const pasta = mkdtempSync(join(tmpdir(), 'forja-migrator-testes-'));
const resumoTap = join(pasta, 'resumo.tap');
const resumoPorArquivo = join(pasta, 'por-arquivo.jsonl');

// Dois relatores: o legível vai para o terminal, o de máquina vai para o arquivo que este script lê.
const filho = spawnSync(
  process.execPath,
  [
    '--test',
    '--test-concurrency=1',
    '--test-reporter=spec',
    '--test-reporter-destination=stdout',
    '--test-reporter=tap',
    `--test-reporter-destination=${resumoTap}`,
    `--test-reporter=${RELATOR_POR_ARQUIVO}`,
    `--test-reporter-destination=${resumoPorArquivo}`,
    ...alvos,
  ],
  { stdio: 'inherit' },
);

/**
 * Falha fechado também quando o arquivo **não existe**. A leitura ficava num `try/finally` sem
 * `catch`, e aí um resumo que nunca foi escrito saía como `ENOENT` com pilha de `node:fs` — código de
 * saída certo, mensagem inútil. Medido em 2026-09-12, e o gatilho é real: com `NODE_TEST_CONTEXT` no
 * ambiente, `node --test` se recusa a rodar recursivamente, não escreve relator nenhum, e quem
 * chamou o gate de dentro de um teste lê uma pilha em vez do motivo.
 */
let tap = '';
let porArquivo = '';
try {
  tap = readFileSync(resumoTap, 'utf8');
  porArquivo = readFileSync(resumoPorArquivo, 'utf8');
} catch (cause) {
  process.stderr.write(
    `não consegui ler o resumo da suíte em "${resumoTap}": ${cause.message}\n` +
      'O relator TAP não chegou a escrever, então não há placar para conferir. Tratando como\n' +
      'falha: resumo ausente não é resumo com zero.\n',
  );
  process.exit(1);
} finally {
  rmSync(pasta, { recursive: true, force: true });
}

/** Falha fechado: resumo que não pôde ser lido não é resumo com zero. */
function contador(nome) {
  const achado = new RegExp(`^# ${nome} (\\d+)$`, 'm').exec(tap);
  if (achado === null) {
    process.stderr.write(`não consegui ler "# ${nome}" do resumo da suíte. Tratando como falha.\n`);
    process.exit(1);
  }
  return Number.parseInt(achado[1], 10);
}

const total = contador('tests');
const passaram = contador('pass');
const falharam = contador('fail');
const cancelados = contador('cancelled');
const pulados = contador('skipped');
const pendentes = contador('todo');

const placar =
  `${total} testes · ${passaram} passando · ${falharam} falhando · ${cancelados} cancelados · ` +
  `${pulados} pulados · ${pendentes} todo`;

if (total === 0) {
  reprovarPorAlvoVazio(placar);
}

if (falharam > 0 || cancelados > 0 || filho.status !== 0) {
  process.stderr.write(`\nsuíte reprovada: ${placar}\n`);
  process.exit(filho.status === 0 ? 1 : (filho.status ?? 1));
}

/**
 * `todo` reprova nos dois modos: nenhum caso desta suíte tem motivo para existir com a falha
 * descartada, e no modo parcial ele é tão invisível quanto no gate.
 */
if (pendentes > 0) {
  process.stderr.write(
    `\nsuíte reprovada: ${placar}.\n` +
      'Teste marcado todo roda e tem a falha descartada: é pulo com outro nome, e o caminho mais\n' +
      'curto para um caso de isolamento vermelho voltar a verde com uma palavra (PAP-29). O relator\n' +
      '"spec" acima nomeia cada um.\n',
  );
  process.exit(1);
}

if (MODO_PARCIAL) {
  if (passaram + pulados !== total) {
    process.stderr.write(
      `\nsuíte reprovada: ${placar}.\n` +
        'o placar não fecha: passando e pulados não somam o total, e o que falta é uma categoria\n' +
        'que este executor não conhece.\n',
    );
    process.exit(1);
  }
  process.stdout.write(
    `\nmodo parcial (--no-database): ${placar}.\n` +
      `${alvos.length} arquivo(s) rodaram, e todos os que falam com o banco ficaram de fora — entre\n` +
      'eles a camada de papel inteira. Isto NÃO é o gate: um verde aqui não prova isolamento entre\n' +
      'clientes nem comportamento nenhum do Postgres.\n',
  );
  process.exit(0);
}

if (pulados > 0) {
  process.stderr.write(
    `\ngate reprovado: ${placar}.\n` +
      'Com os dois servidores servidos, nenhum teste pode pular. Pulo em modo de gate é a linha\n' +
      '"0 fail" dizendo que passou sobre uma propriedade que ninguém exerceu. O relator "spec"\n' +
      'acima nomeia cada um, com o motivo que ele mesmo imprime.\n',
  );
  process.exit(1);
}

if (passaram !== total) {
  process.stderr.write(
    `\ngate reprovado: ${placar}.\n` +
      'No gate, passar é passando igual ao total. O que falta para fechar a conta é uma categoria\n' +
      'que este executor não conhece, e ela não passa por não ter sido prevista.\n',
  );
  process.exit(1);
}

/**
 * Os três jeitos de um arquivo que fala com o banco não ter sido exercido, e o gate recusa os três.
 * A classificação é pela mesma marca do modo parcial, lida em toda a árvore de `dist/test` — e não
 * só no que o glob casa, porque é fora dele que o arquivo some.
 */
function arquivosQueFalamComBanco(pastaRaiz) {
  const achados = [];
  const visitar = (pastaAtual) => {
    for (const entrada of readdirSync(pastaAtual, { withFileTypes: true })) {
      const caminho = join(pastaAtual, entrada.name);
      const nome = relative(pastaRaiz, caminho).split('\\').join('/');
      if (entrada.isDirectory()) {
        if (nome !== PASTA_DE_APOIO) visitar(caminho);
        continue;
      }
      if (!nome.endsWith('.js')) continue;
      if (readFileSync(caminho, 'utf8').includes(MARCA_DE_BANCO)) achados.push(nome);
    }
  };
  visitar(pastaRaiz);
  return achados;
}

const executadosPorArquivo = new Map();
for (const linha of porArquivo.split('\n')) {
  if (linha.trim() === '') continue;
  const { arquivo } = JSON.parse(linha);
  if (typeof arquivo !== 'string') continue;
  const nome = relative(resolve(PASTA_DE_TESTES), arquivo).split('\\').join('/');
  executadosPorArquivo.set(nome, (executadosPorArquivo.get(nome) ?? 0) + 1);
}

const vivosNaArvore = arquivosQueFalamComBanco(PASTA_DE_TESTES);
const foraDoAlvo = vivosNaArvore.filter((nome) => !nome.endsWith('.test.js'));
const naoDeclarados = vivosNaArvore.filter(
  (nome) => nome.endsWith('.test.js') && !ARQUIVOS_VIVOS.includes(nome),
);
const naoExecutados = ARQUIVOS_VIVOS.filter((nome) => (executadosPorArquivo.get(nome) ?? 0) === 0);

if (ARQUIVOS_VIVOS.length === 0 || foraDoAlvo.length + naoDeclarados.length + naoExecutados.length > 0) {
  const linhas = [
    ...(ARQUIVOS_VIVOS.length === 0 ? ['  - scripts/arquivos-vivos.json está vazio'] : []),
    ...foraDoAlvo.map((nome) => `  - fora do alvo "${ALVO}": ${nome} fala com o banco e não roda`),
    ...naoDeclarados.map(
      (nome) => `  - não declarado: ${nome} fala com o banco e não está em scripts/arquivos-vivos.json`,
    ),
    ...naoExecutados.map((nome) => `  - não executado: ${nome} está na lista e não rodou teste nenhum`),
  ];
  process.stderr.write(
    `\ngate reprovado: ${placar}.\n` +
      'Nem todo arquivo que fala com o banco foi exercido, e o placar sozinho não mostra isso: a\n' +
      'suíte fecha a conta sobre o que rodou, não sobre o que deveria ter rodado (PAP-29).\n' +
      `${linhas.join('\n')}\n`,
  );
  process.exit(1);
}

process.stdout.write(`\ngate: ${placar} · ${ARQUIVOS_VIVOS.length} arquivos vivos exercidos.\n`);

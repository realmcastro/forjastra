#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * O executor da suíte, e ele existe por um defeito medido, não por gosto de ferramenta (`SUB-03`,
 * `docs/auditorias/2026-09-12-conferencia-da-credencial-na-subida.md:150`).
 *
 * **O defeito.** Sem `FORJA_TEST_DATABASE_URL` a suíte saía `48 pass · 0 fail · 10 skipped`, código
 * `0`. O auditor mutou um predicado da consulta ao catálogo no `dist` — a pergunta sobre herança
 * deixa de ver herança nenhuma, que é o `PAP-13` reaberto — e a suíte **continuou saindo `0`**. Os
 * testes sem banco exercem a tabela de decisão; a pergunta ao catálogo não é executada por nenhum
 * deles. Uma integração contínua sem banco fica verde tendo provado o que não é a propriedade.
 *
 * **A escolha, entre as duas que o gate ofereceu:** o gate **exige** o banco, e exige que **nada**
 * seja pulado. A alternativa — cobrar o número de pulados contra um piso — deixaria o modo sem banco
 * continuar saindo `0`, que é exatamente o silêncio verde do achado. Piso de pulados também envelhece:
 * ele passa a ser o número que alguém ajusta quando incomoda.
 *
 * **O modo parcial continua existindo**, porque iterar em lógica pura sem subir banco é trabalho
 * legítimo. Ele é uma **bandeira na linha de comando**, nunca uma variável de ambiente: chave de
 * ambiente que afrouxa conferência é chave de escape com outro nome, e some do histórico de quem
 * rodou. Ele diz, em voz alta, o que não foi exercido, e não se confunde com o gate.
 */

const MODO_PARCIAL = process.argv.includes('--no-database');
const ALVO = 'dist/test/**/*.test.js';
const CHAVE_DO_BANCO = 'FORJA_TEST_DATABASE_URL';

/**
 * **Os arquivos que exercem o banco, por nome** (`SUB-10`, reincidente do `SUB-07`). Medido pelo
 * auditor em 2026-09-23: com os dois arquivos vivos fora do glob a suíte saía `64 · 64 passando`,
 * saída `0`, e com a mutação do `SUB-03` aplicada também — a consulta ao catálogo não era executada
 * por teste nenhum e o gate concordava. Contar testes não vê isso, porque o total cai junto.
 *
 * Nome, e não número: um piso de testes envelhece, e um nome de arquivo muda quando alguém o muda
 * de propósito, no mesmo diff em que esta lista precisa mudar. A lista mora em `live-files.json`,
 * relativa a `dist/test`, para que o teste do próprio executor (`test/test-runner.test.ts`) a leia
 * sem rodar este script.
 *
 * **A marca de quem fala com o banco é a chave dele.** Um teste desta suíte só alcança Postgres
 * lendo `FORJA_TEST_DATABASE_URL`, e o nome sobrevive à compilação. Do lado de `db/migrator` a
 * marca é a importação do apoio de Postgres, que aqui não existe; a conferência é a mesma.
 */
const ARQUIVOS_VIVOS = JSON.parse(
  readFileSync(fileURLToPath(new URL('./live-files.json', import.meta.url)), 'utf8'),
);
const PASTA_DE_TESTES = 'dist/test';

const RELATOR_DO_GATE = fileURLToPath(new URL('./gate-reporter.mjs', import.meta.url));

const bancoServido = (process.env[CHAVE_DO_BANCO] ?? '').trim() !== '';

if (!MODO_PARCIAL && !bancoServido) {
  process.stderr.write(
    `o gate exige ${CHAVE_DO_BANCO}, e ela não está no ambiente.\n` +
      'Sem banco, a consulta ao catálogo sobre a própria credencial não é executada por teste\n' +
      'nenhum, e a suíte sai 0 tendo provado só a tabela de decisão (SUB-03).\n\n' +
      `  - aponte ${CHAVE_DO_BANCO} para um Postgres 16 descartável servido pelo operador\n` +
      '    (o papel que faz db/papel-do-cliente.md §7.2, superusuário), ou\n' +
      '  - rode "npm run test:no-db", que é o modo parcial e diz o que não exercitou.\n',
  );
  process.exit(1);
}

const pasta = mkdtempSync(join(tmpdir(), 'forja-api-testes-'));
const resumoTap = join(pasta, 'resumo.tap');
const porTeste = join(pasta, 'por-teste.jsonl');

// Três relatores: o legível vai para o terminal; o resumo e a lista por teste vão para os arquivos
// que este script lê.
const filho = spawnSync(
  process.execPath,
  [
    '--test',
    '--test-reporter=spec',
    '--test-reporter-destination=stdout',
    '--test-reporter=tap',
    `--test-reporter-destination=${resumoTap}`,
    `--test-reporter=${RELATOR_DO_GATE}`,
    `--test-reporter-destination=${porTeste}`,
    ALVO,
  ],
  { stdio: 'inherit' },
);

let tap = '';
let linhasPorTeste = '';
try {
  tap = readFileSync(resumoTap, 'utf8');
  linhasPorTeste = readFileSync(porTeste, 'utf8');
} catch {
  // O `contador` abaixo acusa o resumo que não chegou; a lista por teste vazia acusa o resto.
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

/** Quantos testes cada arquivo **executou** de fato, pelo nome relativo a `dist/test`. */
function executadosPorArquivo() {
  const contagem = new Map();
  for (const linha of linhasPorTeste.split('\n')) {
    if (linha.trim() === '') continue;
    const { file } = JSON.parse(linha);
    if (typeof file !== 'string') continue;
    const nome = relative(resolve(PASTA_DE_TESTES), file).split('\\').join('/');
    contagem.set(nome, (contagem.get(nome) ?? 0) + 1);
  }
  return contagem;
}

/**
 * Todo `.js` da árvore de `dist/test` que carrega a marca do banco, e não só o que o glob casa,
 * porque é fora dele que o arquivo some. Um apoio que leia a chave em nome de outros arquivos também
 * cai aqui como fora do alvo, de propósito: ele esconderia a marca de quem o importa, e a marca
 * precisa mudar junto com ele.
 */
function arquivosQueFalamComBanco(pastaRaiz) {
  const achados = [];
  const visitar = (pastaAtual) => {
    for (const entrada of readdirSync(pastaAtual, { withFileTypes: true })) {
      const caminho = join(pastaAtual, entrada.name);
      if (entrada.isDirectory()) {
        visitar(caminho);
        continue;
      }
      if (!entrada.name.endsWith('.js')) continue;
      if (readFileSync(caminho, 'utf8').includes(CHAVE_DO_BANCO)) {
        achados.push(relative(pastaRaiz, caminho).split('\\').join('/'));
      }
    }
  };
  visitar(pastaRaiz);
  return achados;
}

/**
 * **Total zero reprova, nos dois modos** (`SUB-07`). Medido em 2026-09-12: com o alvo apontando
 * para um glob sem correspondência, `node --test` sai `0`, o resumo sai `0 fail`, e este script
 * concordava com os dois — `gate: 0 testes · 0 passando`, saída `0`.
 *
 * É a quarta encarnação da mesma classe (`SUB-03`, `PAP-17`, `PAP-23`) e a primeira dentro do gate
 * escrito para matá-la. O gatilho não é exótico: o alvo é a conjunção de `rootDir`, `outDir`,
 * `include` e da convenção `*.test.ts`, e mexer em qualquer uma das quatro é refactor de
 * configuração que ninguém associa a segurança.
 *
 * **Zero, e não um piso.** Piso envelhece — vira o número que alguém ajusta quando incomoda — e é a
 * mesma recusa que já foi feita ao piso de pulados. O que este script sabe afirmar sem envelhecer é
 * que uma suíte que não executou nada não provou nada. Quantos testes deveriam existir é pergunta de
 * quem escreve teste, não deste arquivo.
 */
if (total === 0) {
  process.stderr.write(
    `\nsuíte reprovada: ${placar}.\n` +
      `nenhum teste foi executado. O alvo "${ALVO}" não casou arquivo nenhum, e "0 falhando" sobre\n` +
      'zero teste é a linha que se lê primeiro dizendo que passou o que ninguém exerceu. Confira\n' +
      'se o build rodou, e se tsconfig (rootDir, outDir, include) e a convenção de nome ainda\n' +
      'produzem arquivos nesse caminho.\n',
  );
  process.exit(1);
}

if (falharam > 0 || cancelados > 0 || filho.status !== 0) {
  process.stderr.write(`\nsuíte reprovada: ${placar}\n`);
  process.exit(filho.status === 0 ? 1 : (filho.status ?? 1));
}

const executados = executadosPorArquivo();
const naoExecutados = ARQUIVOS_VIVOS.filter((nome) => (executados.get(nome) ?? 0) === 0);

if (MODO_PARCIAL) {
  process.stdout.write(
    `\nmodo parcial (--no-database): ${placar}.\n` +
      `${pulados} teste(s) não rodaram, e entre eles está a pergunta ao catálogo sobre a própria\n` +
      `credencial. Arquivos que exercem o banco e não executaram nada: ${naoExecutados.join(', ') || '—'}.\n` +
      'Isto NÃO é o gate: um verde aqui não prova o isolamento entre clientes.\n',
  );
  process.exit(0);
}

if (pulados > 0) {
  process.stderr.write(
    `\ngate reprovado: ${placar}.\n` +
      'Com banco servido, nenhum teste pode pular. Pulo em modo de gate é a linha "0 fail" dizendo\n' +
      'que passou sobre uma propriedade que ninguém exerceu. O relator "spec" acima nomeia cada um.\n',
  );
  process.exit(1);
}

/**
 * **`todo` reprova, e a condição geral é `passaram === total`** (`SUB-10`). Medido pelo auditor em
 * 2026-09-23: um caso vivo marcado `todo` com a asserção falhando saía `0`, com o placar somando 83
 * de 84 sem acusar a diferença. `todo` é pulo que roda e descarta a falha. As duas condições acima
 * dizem o motivo em voz alta; esta pega a categoria que o `node --test` venha a inventar depois.
 */
if (pendentes > 0 || passaram !== total) {
  process.stderr.write(
    `\ngate reprovado: ${placar}.\n` +
      'Em modo de gate todo teste contado tem de ter passado. "todo" roda o teste e descarta a\n' +
      'falha dele, e a diferença entre passando e total é teste que ninguém viu passar.\n',
  );
  process.exit(1);
}

/**
 * Os três jeitos de um arquivo que fala com o banco não ter sido exercido, e o gate recusa os três,
 * na mesma forma de `db/migrator/scripts/run-tests.mjs`. Medido em 2026-09-23 contra a versão
 * anterior, que só conferia a lista: um arquivo novo lendo a chave do banco e fora da lista saía
 * `0`, e o arquivo vivo esvaziado também.
 */
const vivosNaArvore = arquivosQueFalamComBanco(PASTA_DE_TESTES);
const foraDoAlvo = vivosNaArvore.filter((nome) => !nome.endsWith('.test.js'));
const naoDeclarados = vivosNaArvore.filter(
  (nome) => nome.endsWith('.test.js') && !ARQUIVOS_VIVOS.includes(nome),
);

if (ARQUIVOS_VIVOS.length === 0 || foraDoAlvo.length + naoDeclarados.length + naoExecutados.length > 0) {
  const linhas = [
    ...(ARQUIVOS_VIVOS.length === 0 ? ['  - scripts/live-files.json está vazio'] : []),
    ...foraDoAlvo.map((nome) => `  - fora do alvo "${ALVO}": ${nome} fala com o banco e não roda`),
    ...naoDeclarados.map(
      (nome) => `  - não declarado: ${nome} fala com o banco e não está em scripts/live-files.json`,
    ),
    ...naoExecutados.map((nome) => `  - não executado: ${nome} está na lista e não rodou teste nenhum`),
  ];
  process.stderr.write(
    `\ngate reprovado: ${placar}.\n` +
      'Nem todo arquivo que fala com o banco foi exercido, e o placar sozinho não mostra isso: a\n' +
      'suíte fecha a conta sobre o que rodou, não sobre o que deveria ter rodado (SUB-10).\n' +
      `${linhas.join('\n')}\n`,
  );
  process.exit(1);
}

process.stdout.write(`\ngate: ${placar} · ${ARQUIVOS_VIVOS.length} arquivos vivos exercidos.\n`);

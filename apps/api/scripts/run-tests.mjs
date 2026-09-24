#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
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
 * de propósito, no mesmo diff em que esta lista precisa mudar. Em modo de gate, arquivo desta lista
 * que não produziu nenhum teste executado reprova, seja por ter saído do glob, por ter sido
 * renomeado ou por ter pulado tudo.
 */
const ARQUIVOS_VIVOS = [
  'dist/test/app-credential-live.test.js',
  'dist/test/delegation-live.test.js',
  'dist/test/tenant-role-live.test.js',
];

const RAIZ_DO_PACOTE = fileURLToPath(new URL('..', import.meta.url));
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

/** Quantos testes cada arquivo vivo **executou** de fato: nem pulado, nem `todo`. */
function executadosPorArquivoVivo() {
  const contagem = new Map(ARQUIVOS_VIVOS.map((arquivo) => [join(RAIZ_DO_PACOTE, arquivo), 0]));
  for (const linha of linhasPorTeste.split('\n')) {
    if (linha.trim() === '') continue;
    const teste = JSON.parse(linha);
    if (teste.outcome !== 'pass' || teste.skip || teste.todo) continue;
    if (contagem.has(teste.file)) contagem.set(teste.file, contagem.get(teste.file) + 1);
  }
  return ARQUIVOS_VIVOS.map((arquivo) => ({
    arquivo,
    executados: contagem.get(join(RAIZ_DO_PACOTE, arquivo)),
  }));
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

const vivos = executadosPorArquivoVivo();
const vivosSemExecucao = vivos.filter((vivo) => vivo.executados === 0).map((vivo) => vivo.arquivo);

if (MODO_PARCIAL) {
  process.stdout.write(
    `\nmodo parcial (--no-database): ${placar}.\n` +
      `${pulados} teste(s) não rodaram, e entre eles está a pergunta ao catálogo sobre a própria\n` +
      `credencial. Arquivos que exercem o banco e não executaram nada: ${vivosSemExecucao.join(', ') || '—'}.\n` +
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

if (vivosSemExecucao.length > 0) {
  process.stderr.write(
    `\ngate reprovado: ${placar}.\n` +
      `Arquivo que exerce o banco sem nenhum teste executado: ${vivosSemExecucao.join(', ')}.\n` +
      `Ou ele saiu do alvo "${ALVO}" (nome, rootDir, outDir, include), ou foi renomeado sem que a\n` +
      'lista ARQUIVOS_VIVOS deste script mudasse junto. Sem ele, a consulta ao catálogo não é\n' +
      'executada e o total cai sem acusar nada.\n',
  );
  process.exit(1);
}

process.stdout.write(`\ngate: ${placar} · arquivos vivos: ${vivos.map((v) => `${v.arquivo} (${v.executados})`).join(', ')}.\n`);

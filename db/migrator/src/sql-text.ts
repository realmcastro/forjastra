import { refused } from './errors.js';

/**
 * Leitura do texto de uma migration: `RECUSAS.md` §11.1, passos 1, 2, 4 e 5.
 *
 * Isto **não é um analisador sintático de SQL** e não tenta ser (§11.7 item 2). É o mínimo para que
 * comentário não seja lido como comando, literal não seja lido como código, e o `;` que separa
 * comandos não seja confundido com o `;` que está dentro de um corpo de função.
 */

/**
 * Passo 1: remove `--` até o fim da linha e `/* *\/` aninhado. Passo 2: preserva literais, de aspas
 * simples e de **cifrão com rótulo**.
 *
 * O comentário vira um espaço, nunca nada: apagá-lo colaria os tokens dos dois lados e faria um
 * comando se classificar de outro jeito, que é a lacuna que a §11.7 item 2 declara.
 */
export function stripComments(text: string, version: string): string {
  let out = '';
  let index = 0;

  while (index < text.length) {
    const two = text.slice(index, index + 2);

    if (two === '--') {
      const end = text.indexOf('\n', index);
      index = end === -1 ? text.length : end;
      out += ' ';
      continue;
    }

    if (two === '/*') {
      index = skipBlockComment(text, index, version);
      out += ' ';
      continue;
    }

    if (text[index] === "'") {
      const end = endOfSingleQuoted(text, index, version);
      out += text.slice(index, end);
      index = end;
      continue;
    }

    const tag = dollarTagAt(text, index);
    if (tag !== undefined) {
      const end = endOfDollarQuoted(text, index, tag, version);
      out += text.slice(index, end);
      index = end;
      continue;
    }

    out += text[index];
    index += 1;
  }

  return out;
}

/** Passo 5: separa os comandos pelo `;` **fora de literal**. */
export function splitCommands(stripped: string, version: string): readonly string[] {
  const commands: string[] = [];
  let start = 0;
  let index = 0;

  while (index < stripped.length) {
    if (stripped[index] === "'") {
      index = endOfSingleQuoted(stripped, index, version);
      continue;
    }
    const tag = dollarTagAt(stripped, index);
    if (tag !== undefined) {
      index = endOfDollarQuoted(stripped, index, tag, version);
      continue;
    }
    if (stripped[index] === ';') {
      commands.push(stripped.slice(start, index));
      index += 1;
      start = index;
      continue;
    }
    index += 1;
  }

  commands.push(stripped.slice(start));
  return commands.map((command) => command.trim()).filter((command) => command !== '');
}

/**
 * Passo 4: a cópia em **minúscula**, com espaço colapsado, sobre a qual correm as verificações das
 * §11.2, §11.3 e §11.5.
 *
 * O Postgres dobra identificador não citado para minúscula, então `T_GLOBEX.orders` e
 * `t_globex.orders` endereçam o mesmo objeto e só a cópia normalizada vê os dois como o mesmo texto.
 * A cópia serve à comparação e a nada mais: a mensagem de recusa cita o texto original, que é o que
 * o autor procura no arquivo.
 */
export function normalize(command: string): string {
  return command.toLowerCase().replace(/\s+/g, ' ').trim();
}

function skipBlockComment(text: string, start: number, version: string): number {
  let depth = 1;
  let index = start + 2;
  while (index < text.length && depth > 0) {
    const two = text.slice(index, index + 2);
    if (two === '/*') {
      depth += 1;
      index += 2;
    } else if (two === '*/') {
      depth -= 1;
      index += 2;
    } else {
      index += 1;
    }
  }
  if (depth > 0) throw refused(`${version}: comentário de bloco aberto e não fechado`, { version });
  return index;
}

function endOfSingleQuoted(text: string, start: number, version: string): number {
  const end = closeOfSingleQuoted(text, start);
  if (end === undefined) {
    throw refused(`${version}: literal de aspas simples aberto e não fechado`, { version });
  }
  return end;
}

/** `undefined` quando o literal não fecha. */
function closeOfSingleQuoted(text: string, start: number): number | undefined {
  let index = start + 1;
  while (index < text.length) {
    if (text[index] === "'") {
      // `''` é a aspa escapada, e não o fim do literal.
      if (text[index + 1] === "'") {
        index += 2;
        continue;
      }
      return index + 1;
    }
    index += 1;
  }
  return undefined;
}

/**
 * `$fn$`, e também `$$`, que a §11.5 recusa depois — reconhecê-lo aqui evita varredura ambígua.
 *
 * **O rótulo vale em qualquer caixa** (§11.1 item 2): `$BODY$` é rótulo legal, e é o que toda
 * ferramenta de banco gera por padrão. O fecho é o **mesmo texto** do abre, comparado sem dobrar
 * caixa, porque para o Postgres `$BODY$` e `$body$` são rótulos diferentes. Enquanto o reconhecedor
 * exigia rótulo minúsculo, `$BODY$` deixava de ser literal, o corpo era partido no `;` interno e a
 * recusa mandava o autor procurar o defeito na §11.2 (`EXE-08`).
 */
const DOLLAR_TAG = /^\$([A-Za-z_][A-Za-z0-9_]*)?\$/;

function dollarTagAt(text: string, index: number): string | undefined {
  if (text[index] !== '$') return undefined;
  const matched = DOLLAR_TAG.exec(text.slice(index, index + 64));
  return matched?.[0];
}

function endOfDollarQuoted(text: string, start: number, tag: string, version: string): number {
  const close = text.indexOf(tag, start + tag.length);
  if (close === -1) {
    throw refused(`${version}: literal de cifrão "${tag}" aberto e não fechado`, { version });
  }
  return close + tag.length;
}

/**
 * Índice logo depois do literal que começa em `index`, ou `undefined` quando não começa literal ali.
 *
 * Literal aberto devolve o fim do texto: quem varre daqui trata isso como fim, e o comando acaba
 * recusado por não fechar a forma — que é o lado seguro (§11.1).
 */
function afterLiteral(text: string, index: number): number | undefined {
  if (text[index] === "'") return closeOfSingleQuoted(text, index) ?? text.length;

  const tag = dollarTagAt(text, index);
  if (tag === undefined) return undefined;
  const close = text.indexOf(tag, index + tag.length);
  return close === -1 ? text.length : close + tag.length;
}

/**
 * O literal que contém `position`, ou `undefined` quando a posição está em texto de comando.
 *
 * Ele existe para a **mensagem**, nunca para o desfecho: a §11.5 alcança literal de propósito, e
 * isentá-lo só seria seguro enquanto valessem ao mesmo tempo quatro elos que não avisam um ao outro.
 * O que muda é o que o autor lê — sem esta distinção, a recusa manda procurar um comando que o
 * arquivo dele não tem.
 */
export function literalAround(text: string, position: number): string | undefined {
  let index = 0;

  while (index < text.length) {
    const end = afterLiteral(text, index);
    if (end === undefined) {
      index += 1;
      continue;
    }
    // O delimitador que **abre** o literal não está dentro dele: é assim que a recusa do cifrão sem
    // rótulo continua lendo como o que é, em vez de se anunciar como ocorrência em literal.
    if (position > index && position < end) return text.slice(index, end);
    index = end;
  }

  return undefined;
}

/**
 * O `)` que fecha o `(` de `open`, pulando literal — a cauda fechada da §11.2 item 2 depende dele:
 * é ele que diz onde termina o interior que a forma declara não analisar, e é depois dele que a
 * forma cobra o fim do comando.
 *
 * `undefined` quando o parêntese não fecha. O chamador recusa, em vez de adivinhar.
 */
export function closingParen(text: string, open: number): number | undefined {
  let depth = 0;
  let index = open;

  while (index < text.length) {
    const skipped = afterLiteral(text, index);
    if (skipped !== undefined) {
      index = skipped;
      continue;
    }
    const char = text[index];
    if (char === '(') {
      depth += 1;
    } else if (char === ')') {
      depth -= 1;
      if (depth === 0) return index;
    }
    index += 1;
  }

  return undefined;
}

/**
 * Vírgula fora de parêntese e fora de literal. É por ela que a forma de `ALTER TABLE` recusa a
 * segunda ação (§11.2): `ADD COLUMN … , DROP COLUMN total` dizia "acrescenta coluna" e apagava uma
 * (`EXE-02`). Vírgula dentro de parêntese continua sendo lista de coluna, de tupla ou de argumento.
 */
export function hasTopLevelComma(text: string): boolean {
  let depth = 0;
  let index = 0;

  while (index < text.length) {
    const skipped = afterLiteral(text, index);
    if (skipped !== undefined) {
      index = skipped;
      continue;
    }
    const char = text[index];
    if (char === '(') depth += 1;
    else if (char === ')') depth -= 1;
    else if (char === ',' && depth === 0) return true;
    index += 1;
  }

  return false;
}

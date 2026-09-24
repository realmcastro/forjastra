import { refused } from './errors.js';

/**
 * Cabeçalho da migration: `CONTRATO.md` §4.
 *
 * O diretório é organização, **o cabeçalho é normativo** (§2.1). Quem confere o acordo entre os
 * dois é `discovery.ts`, com o caminho na mão; aqui só a forma.
 *
 * O que **não** está aqui, e é `RECUSAS.md` §11.4, porque depende do corpo: regime contra os
 * comandos que o corpo contém, e `cria-indice` contra os índices que ele cria. Isso é do crivo de
 * conteúdo (`content-screen.ts`), que é a §11 e está bloqueada.
 */

export type Alvo = 'platform' | 'tenant';

export interface MigrationHeader {
  readonly alvo: Alvo;
  /** Código de módulo (`CONTRATO.md` §1), em maiúsculas. Ausente fora da stream de módulo. */
  readonly modulo: string | undefined;
  readonly transacional: boolean;
  readonly reversivel: boolean;
  readonly reversivelJustificativa: string;
  /** Nomes declarados em `cria-indice`. Vazio quando a diretiva não existe. */
  readonly criaIndice: readonly string[];
}

const DIRECTIVE_KEYS = ['alvo', 'modulo', 'transacional', 'reversivel', 'cria-indice'] as const;
type DirectiveKey = (typeof DIRECTIVE_KEYS)[number];

/**
 * Diretiva é `--` com **no máximo um** espaço antes da chave; continuação é `--` com dois ou mais.
 * É essa distância que separa a diretiva da prosa indentada que a justifica, e o cabeçalho termina
 * na primeira linha que não é nem uma nem outra.
 *
 * Sem isso, `platform/0004__executor_events.sql` seria recusado: a prosa dele tem uma linha
 * `-- nenhuma: paravam a rodada ...`, que é a forma de uma diretiva desconhecida quinze linhas
 * abaixo do cabeçalho.
 */
const DIRECTIVE_LINE = /^--[ \t]?([a-z][a-z0-9-]*):[ \t]*(.*)$/;
const CONTINUATION_LINE = /^--[ \t]{2,}(\S.*)$/;
const MODULE_CODE = /^[A-Z]{3}$/;
const INDEX_NAME = /^[a-z_][a-z0-9_$]*$/;

export interface ParsedHeader {
  readonly header: MigrationHeader;
  /** Quantas linhas o cabeçalho ocupou. Só para mensagem de erro apontar o lugar certo. */
  readonly lineCount: number;
}

export function parseHeader(text: string, version: string): ParsedHeader {
  const lines = text.split('\n');
  const values = new Map<DirectiveKey, string>();
  let lastKey: DirectiveKey | undefined;
  let lineCount = 0;

  for (const line of lines) {
    const directive = DIRECTIVE_LINE.exec(line);
    if (directive) {
      const key = directive[1]!;
      if (!isDirectiveKey(key)) {
        throw refused(`${version}: diretiva desconhecida no cabeçalho: "${key}" (CONTRATO.md §4)`);
      }
      if (values.has(key)) {
        throw refused(`${version}: diretiva repetida no cabeçalho: "${key}"`);
      }
      values.set(key, directive[2]!.trim());
      lastKey = key;
      lineCount += 1;
      continue;
    }

    const continuation = CONTINUATION_LINE.exec(line);
    if (continuation && lastKey !== undefined) {
      values.set(lastKey, `${values.get(lastKey)!} ${continuation[1]!.trim()}`);
      lineCount += 1;
      continue;
    }

    break;
  }

  return { header: build(values, version), lineCount };
}

function isDirectiveKey(key: string): key is DirectiveKey {
  return (DIRECTIVE_KEYS as readonly string[]).includes(key);
}

function build(values: Map<DirectiveKey, string>, version: string): MigrationHeader {
  const alvoRaw = requireDirective(values, 'alvo', version);
  if (alvoRaw !== 'platform' && alvoRaw !== 'tenant') {
    throw refused(`${version}: alvo precisa ser "platform" ou "tenant", e veio "${alvoRaw}"`);
  }

  const transacionalRaw = requireDirective(values, 'transacional', version);
  if (transacionalRaw !== 'sim' && transacionalRaw !== 'nao') {
    throw refused(
      `${version}: transacional precisa ser "sim" ou "nao", e veio "${transacionalRaw}"`,
    );
  }
  const transacional = transacionalRaw === 'sim';

  const reversivelRaw = requireDirective(values, 'reversivel', version);
  const reversivel = /^(sim|nao)[ \t]*;[ \t]*\S/.exec(reversivelRaw);
  if (!reversivel) {
    throw refused(
      `${version}: reversivel precisa ser "sim" ou "nao" seguido de ponto e vírgula e da justificativa (CONTRATO.md §4)`,
    );
  }

  const modulo = values.get('modulo');
  if (modulo !== undefined && !MODULE_CODE.test(modulo)) {
    throw refused(
      `${version}: modulo precisa ser o código de três letras maiúsculas do glossário, e veio "${modulo}"`,
    );
  }

  const criaIndice = parseIndexList(values.get('cria-indice'), version);
  if (transacional && criaIndice.length > 0) {
    throw refused(`${version}: cria-indice só existe em migration marcada "transacional: nao"`);
  }

  return {
    alvo: alvoRaw,
    modulo,
    transacional,
    reversivel: reversivelRaw.startsWith('sim'),
    reversivelJustificativa: reversivelRaw.slice(reversivelRaw.indexOf(';') + 1).trim(),
    criaIndice,
  };
}

function requireDirective(
  values: Map<DirectiveKey, string>,
  key: DirectiveKey,
  version: string,
): string {
  const value = values.get(key);
  if (value === undefined || value === '') {
    throw refused(`${version}: cabeçalho sem a diretiva obrigatória "${key}" (CONTRATO.md §4)`);
  }
  return value;
}

function parseIndexList(raw: string | undefined, version: string): readonly string[] {
  if (raw === undefined) return [];
  const names = raw
    .split(/[\s,]+/)
    .map((name) => name.trim())
    .filter((name) => name !== '');
  if (names.length === 0) {
    throw refused(`${version}: cria-indice declarada sem nome de índice`);
  }
  for (const name of names) {
    if (!INDEX_NAME.test(name)) {
      throw refused(`${version}: cria-indice com nome fora da forma de identificador: "${name}"`);
    }
  }
  return names;
}

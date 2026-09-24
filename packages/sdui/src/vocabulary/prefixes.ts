/**
 * Registro de prefixos — espelho executável de `docs/design/vocabulario-e-eixos.md` §1.5.
 *
 * Um prefixo, uma espécie de coisa, um arquivo dono. Prefixo que não tem linha aqui não
 * existe. A coluna `crossesNetwork` é o que decide o **custo de errar**: prefixo que
 * atravessa a rede é contrato com terminal em versão antiga e não se renomeia (§1.4);
 * prefixo que vive só dentro do cliente é build, e renomear custa um `sed`.
 *
 * O documento continua sendo a autoridade sobre **significado**. Este arquivo é a
 * autoridade sobre **compilação**: id fora daqui não compila.
 */

/**
 * Espécies que este sistema distingue na prosa. Duas espécies que a prosa distingue não
 * dividem prefixo (§1.5, cláusula 1), e é `checkVocabulary` quem cobra isso.
 */
export const ID_SPECIES = [
  'papel de bloco',
  'zona de layout',
  'espaço de desenho',
  'modo de interação',
  'degrau da escala de espaçamento',
  'token de estilo',
  'medida e faixa de densidade',
  'estado visível',
  'domínio de rede',
] as const;

export type IdSpecies = (typeof ID_SPECIES)[number];

/**
 * `by-entry` existe por uma razão só, e ela não é comodidade: sob `block.` convivem os
 * papéis que o manifesto emite (§3.2, contrato) e as duas entradas de piso que o servidor
 * **nunca** emite (§3.4, build). São a mesma espécie — papel de bloco —, então dividir o
 * prefixo seria inventar espécie; o que muda é quem emite, e isso cada entrada declara.
 */
export type NetworkExposure = 'yes' | 'no' | 'by-entry';

export type PrefixEntry = {
  readonly prefix: string;
  readonly species: IdSpecies;
  readonly definedIn: string;
  readonly crossesNetwork: NetworkExposure;
};

export const PREFIX_REGISTRY: readonly PrefixEntry[] = [
  {
    prefix: 'block.',
    species: 'papel de bloco',
    definedIn: 'docs/design/vocabulario-e-eixos.md §3',
    crossesNetwork: 'by-entry',
  },
  {
    prefix: 'zone.',
    species: 'zona de layout',
    definedIn: 'docs/design/grade-e-espacos.md §6',
    crossesNetwork: 'yes',
  },
  {
    prefix: 'space.',
    species: 'espaço de desenho',
    definedIn: 'docs/design/grade-e-espacos.md §4',
    crossesNetwork: 'no',
  },
  {
    prefix: 'input.',
    species: 'modo de interação',
    definedIn: 'docs/design/vocabulario-e-eixos.md §2.1',
    crossesNetwork: 'no',
  },
  {
    prefix: 'spacing.',
    species: 'degrau da escala de espaçamento',
    definedIn: 'docs/design/tokens-forma-e-texto.md §7',
    crossesNetwork: 'no',
  },
  {
    prefix: 'density.',
    species: 'medida e faixa de densidade',
    definedIn: 'docs/design/grade-e-espacos.md §5',
    crossesNetwork: 'no',
  },
  {
    prefix: 'state.',
    species: 'estado visível',
    definedIn: 'docs/design/estados-e-interacao.md §3',
    crossesNetwork: 'yes',
  },
  {
    prefix: 'net.',
    species: 'domínio de rede',
    definedIn: 'docs/design/estados-e-interacao.md §5',
    crossesNetwork: 'yes',
  },
] as const;

/** O prefixo de um id é tudo até o primeiro ponto, inclusive. Sem ponto, não há prefixo. */
export function prefixOf(id: string): string | null {
  const dot = id.indexOf('.');
  if (dot <= 0) return null;
  return id.slice(0, dot + 1);
}

export function prefixEntry(prefix: string): PrefixEntry | null {
  return PREFIX_REGISTRY.find((entry) => entry.prefix === prefix) ?? null;
}

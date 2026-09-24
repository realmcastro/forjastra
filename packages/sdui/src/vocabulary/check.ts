/**
 * Cobrança do registro: as leis de nomeação de `vocabulario-e-eixos.md` §1 e §5, escritas
 * como verificação executável.
 *
 * **Não lança e não roda na importação, de propósito.** Registro malformado é defeito de
 * construção, e um defeito de construção que derruba o processo derruba o caixa — o
 * terminal que não sobe é pior que o terminal com um id a menos. Quem cobra é o teste, que
 * roda antes de o build existir; o produto lê o registro já verificado.
 */

import { BLOCK_KIND_REGISTRY, type BlockKindEntry } from './block-kinds.js';
import { PREFIX_REGISTRY, prefixOf, type IdSpecies, type PrefixEntry } from './prefixes.js';
import { PUBLISHED_KINDS, type PublishedKind } from './published.js';
import { CRITICAL_ACTION_ZONE, ZONE_IDS } from './zones.js';

export type VocabularyProblemCode =
  | 'id-malformed'
  | 'id-duplicated'
  | 'id-carries-forbidden-word'
  | 'prefix-not-registered'
  | 'prefix-claimed-by-two-species'
  | 'published-kind-missing'
  | 'zone-unknown'
  | 'critical-zone-admits-non-command';

export type VocabularyProblem = {
  readonly code: VocabularyProblemCode;
  readonly id: string;
  readonly detail: string;
};

/** Id declarado fora deste pacote, para a cobrança de "um prefixo, uma espécie". */
export type ForeignId = {
  readonly id: string;
  readonly species: IdSpecies;
};

export type VocabularyInput = {
  readonly kinds: readonly BlockKindEntry[];
  readonly prefixes: readonly PrefixEntry[];
  readonly published: readonly PublishedKind[];
  readonly foreignIds: readonly ForeignId[];
};

/** `<prefixo>.<papel-em-kebab>`: dois segmentos, minúsculo, sem dígito (§1.1). */
const ID_FORM = /^[a-z]+\.[a-z]+(?:-[a-z]+)*$/;

/**
 * Palavra que o id não pode conter (§1.3). São as mecanicamente detectáveis: nome de eixo,
 * de densidade, de estado, de domínio de rede — e termo de vertical, que `00-nucleo.md` §8
 * proíbe no núcleo. A lista não esgota a lei; ela pega o erro que passa despercebido.
 */
const FORBIDDEN_WORDS: readonly string[] = [
  'space',
  'spacing',
  'density',
  'compact',
  'standard',
  'distance',
  'input',
  'touch',
  'keyboard',
  'scanner',
  'state',
  'net',
  'zone',
  'restaurant',
  'table',
  'pump',
  'fuel',
  'kitchen',
  'delivery',
  'fleet',
];

const KNOWN_ZONES: readonly string[] = ZONE_IDS;

export function checkVocabulary(input: VocabularyInput = defaultInput()): readonly VocabularyProblem[] {
  const problems: VocabularyProblem[] = [];
  const seen = new Set<string>();
  const speciesByPrefix = new Map<string, IdSpecies>();

  const inventory: readonly ForeignId[] = [
    ...input.kinds.map((entry) => ({ id: entry.kind, species: 'papel de bloco' as IdSpecies })),
    ...input.foreignIds,
  ];

  for (const { id, species } of inventory) {
    if (!ID_FORM.test(id)) {
      problems.push({ code: 'id-malformed', id, detail: 'esperado <prefixo>.<papel-em-kebab>, dois segmentos, sem dígito' });
      continue;
    }
    if (seen.has(id)) {
      problems.push({ code: 'id-duplicated', id, detail: 'o mesmo id aparece duas vezes no inventário' });
      continue;
    }
    seen.add(id);

    const suffix = id.slice(id.indexOf('.') + 1);
    for (const word of suffix.split('-')) {
      if (FORBIDDEN_WORDS.includes(word)) {
        problems.push({ code: 'id-carries-forbidden-word', id, detail: `"${word}" é eixo, estado ou termo de ramo, e não entra em id` });
      }
    }

    const prefix = prefixOf(id);
    if (prefix === null) continue;

    const declared = input.prefixes.find((entry) => entry.prefix === prefix);
    if (declared === undefined) {
      problems.push({ code: 'prefix-not-registered', id, detail: `o prefixo "${prefix}" não tem linha no registro` });
      continue;
    }

    const claimed = speciesByPrefix.get(prefix);
    if (claimed !== undefined && claimed !== species) {
      problems.push({
        code: 'prefix-claimed-by-two-species',
        id,
        detail: `"${prefix}" já nomeia "${claimed}" e aqui nomeia "${species}"`,
      });
      continue;
    }
    speciesByPrefix.set(prefix, species);

    if (declared.species !== species) {
      problems.push({
        code: 'prefix-claimed-by-two-species',
        id,
        detail: `o registro diz que "${prefix}" nomeia "${declared.species}", e este id é "${species}"`,
      });
    }
  }

  for (const entry of input.kinds) {
    for (const zone of entry.zones) {
      if (!KNOWN_ZONES.includes(zone)) {
        problems.push({ code: 'zone-unknown', id: entry.kind, detail: `zona "${zone}" não existe` });
      }
    }
    const ocupaZonaCritica = entry.zones.includes(CRITICAL_ACTION_ZONE);
    if (ocupaZonaCritica && entry.emission === 'manifest' && entry.kind !== 'block.command') {
      problems.push({
        code: 'critical-zone-admits-non-command',
        id: entry.kind,
        detail: 'só block.command ocupa a zona de ação crítica (§3.3, lei 10)',
      });
    }
  }

  for (const published of input.published) {
    if (!input.kinds.some((entry) => entry.kind === published.kind)) {
      problems.push({
        code: 'published-kind-missing',
        id: published.kind,
        detail: `publicado em ${published.publishedOn} e ausente do registro — id publicado não se apaga, se aposenta`,
      });
    }
  }

  return problems;
}

function defaultInput(): VocabularyInput {
  return {
    kinds: Object.values(BLOCK_KIND_REGISTRY),
    prefixes: PREFIX_REGISTRY,
    published: PUBLISHED_KINDS,
    foreignIds: ZONE_IDS.map((id) => ({ id, species: 'zona de layout' as IdSpecies })),
  };
}

/**
 * `@forja/sdui` — vocabulário fechado de blocos e análise do manifesto, do lado do cliente.
 *
 * O que este pacote **é**: o universo fechado de ids (`SPR-45`), o analisador tolerante do
 * manifesto e o despacho tipado com piso garantido (`SPR-44`). Lógica pura, sem render.
 *
 * O que ele **não é**: catálogo de componentes, tela, tema, resolução de variante. Isso é
 * `apps/web` e Fase 3, e não nasce aqui (`vocabulario-e-eixos.md` §3.5).
 */

export {
  BLOCK_KINDS,
  BLOCK_KIND_REGISTRY,
  crossesNetwork,
  isBlockKind,
  zoneAdmits,
  type BlockKind,
  type BlockKindEntry,
  type Emission,
  type KindStatus,
} from './vocabulary/block-kinds.js';
export {
  CRITICAL_ACTION_ZONE,
  FIXED_SLOT_ZONES,
  ZONE_IDS,
  hasFixedSlotCount,
  zoneOrder,
  type ZoneId,
} from './vocabulary/zones.js';
export {
  ID_SPECIES,
  PREFIX_REGISTRY,
  prefixEntry,
  prefixOf,
  type IdSpecies,
  type NetworkExposure,
  type PrefixEntry,
} from './vocabulary/prefixes.js';
export { PUBLISHED_KINDS, type PublishedKind } from './vocabulary/published.js';
export {
  checkVocabulary,
  type ForeignId,
  type VocabularyInput,
  type VocabularyProblem,
  type VocabularyProblemCode,
} from './vocabulary/check.js';

export { MAX_NODES, MAX_NODE_DEPTH, parseManifest, type ParseOutcome, type UnusableReason } from './manifest/parse.js';
export { dispatchNode, dispatchSlot, offersAction, type BlockRenderers } from './manifest/dispatch.js';
export {
  EMBEDDED_FLOOR,
  resolveScreen,
  type CachedManifest,
  type CacheWrite,
  type Degradation,
  type NetworkResult,
  type Screen,
  type ScreenOrigin,
} from './manifest/screen.js';
export { WIRE } from './manifest/wire.js';
export type {
  BlockProps,
  Discard,
  DiscardReason,
  ManifestNode,
  ManifestPropValue,
  ManifestScalar,
  NodeOf,
  Placed,
  PropsByKind,
  Slotted,
} from './manifest/types.js';

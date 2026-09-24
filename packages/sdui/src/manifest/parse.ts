/**
 * O analisador do manifesto. **Não lança em nenhum caminho**, e isso é garantido pelo tipo de
 * retorno, não por convenção: `ParseOutcome` já enumera a falha.
 *
 * Três leis governam este arquivo (`vocabulario-e-eixos.md` §5, leis 11 a 14):
 *
 * ```
 * entrada não confiável
 * → parse (nunca lança)
 * → guarda por nó (nó inválido é descartado, irmãos sobrevivem)
 * → slot de contagem fixa não colapsa (vira piso)
 * → nenhum nó válido? a tela cai no piso embutido
 * ```
 *
 * O que este arquivo **não** faz: não interpreta string vinda da rede, não completa campo
 * ausente por inferência, não aproxima id desconhecido de id parecido, e não resolve fonte
 * nem variante.
 */

import { BLOCK_KIND_REGISTRY, isBlockKind, zoneAdmits } from '../vocabulary/block-kinds.js';
import { ZONE_IDS, hasFixedSlotCount, zoneOrder, type ZoneId } from '../vocabulary/zones.js';
import { isArrayOfUnknown, isBlockProps, isNonEmptyString, isOrdinal, isPlainObject } from './guards.js';
import type { Discard, DiscardReason, ManifestNode, Placed, Slotted } from './types.js';
import { WIRE } from './wire.js';

/** Profundidade além da qual a subárvore é descartada. Manifesto real não chega perto. */
export const MAX_NODE_DEPTH = 32;

/** Teto de nós analisados por manifesto. Entrada hostil não compra trabalho ilimitado. */
export const MAX_NODES = 2000;

export type UnusableReason =
  | 'not-json'
  | 'not-an-object'
  | 'nodes-missing'
  | 'no-valid-node';

export type ParseOutcome =
  | {
      readonly status: 'usable';
      readonly nodes: readonly Placed[];
      readonly discards: readonly Discard[];
    }
  | {
      readonly status: 'unusable';
      readonly reason: UnusableReason;
      readonly discards: readonly Discard[];
    };

type Budget = {
  remaining: number;
  readonly discards: Discard[];
};

/**
 * Analisa um manifesto. Aceita o texto cru da rede ou um valor já desserializado (é o caso do
 * cache local). `unknown` é a única entrada honesta: o que veio da rede não tem tipo até uma
 * guarda dizer que tem.
 */
export function parseManifest(input: unknown): ParseOutcome {
  const budget: Budget = { remaining: MAX_NODES, discards: [] };

  const root = typeof input === 'string' ? parseJson(input) : { ok: true as const, value: input };
  if (!root.ok) return { status: 'unusable', reason: 'not-json', discards: budget.discards };

  if (!isPlainObject(root.value)) {
    return { status: 'unusable', reason: 'not-an-object', discards: budget.discards };
  }

  const rawNodes = root.value[WIRE.nodes];
  if (!isArrayOfUnknown(rawNodes)) {
    return { status: 'unusable', reason: 'nodes-missing', discards: budget.discards };
  }

  const placed: Placed[] = [];
  for (const [index, raw] of rawNodes.entries()) {
    const path = `${WIRE.nodes}[${index}]`;
    const zone = readZone(raw);
    if (zone === null) {
      budget.discards.push(discard('zone-missing-or-unknown', path, raw, null));
      continue;
    }
    const slotted = parseNode(raw, { path, zone, depth: 0, budget, ancestors: new Set<object>() });
    if (slotted === null) continue;
    placed.push({ ...slotted, zone });
  }

  const ordered = sortByContract(placed);
  const hasBlock = ordered.some((entry) => entry.resolution === 'block');
  if (!hasBlock) {
    return { status: 'unusable', reason: 'no-valid-node', discards: budget.discards };
  }
  return { status: 'usable', nodes: ordered, discards: budget.discards };
}

type NodeContext = {
  readonly path: string;
  readonly zone: ZoneId;
  readonly depth: number;
  readonly budget: Budget;
  readonly ancestors: ReadonlySet<object>;
};

/**
 * Devolve o slot ocupado, ou `null` quando o nó simplesmente some.
 *
 * A assimetria é a lei 14: em `zone.flow` o nó inválido desaparece; em zona de contagem fixa
 * ele vira piso, porque colapsar o slot moveria tudo que vem depois — e posição é contrato.
 */
function parseNode(raw: unknown, context: NodeContext): Slotted | null {
  const { budget, path, zone } = context;

  if (budget.remaining <= 0) return give('node-budget-exceeded', raw, context);
  budget.remaining -= 1;

  if (context.depth > MAX_NODE_DEPTH) return give('depth-exceeded', raw, context);
  if (!isPlainObject(raw)) return give('node-not-an-object', raw, context);
  if (context.ancestors.has(raw)) return give('cycle', raw, context);

  const rawKind = raw[WIRE.kind];
  if (rawKind === undefined) return give('kind-missing', raw, context);
  if (!isBlockKind(rawKind)) return give('kind-unknown', raw, context);

  const entry = BLOCK_KIND_REGISTRY[rawKind];
  if (entry.emission !== 'manifest') return give('kind-not-emitted-by-server', raw, context);
  if (!zoneAdmits(zone, rawKind)) return give('zone-forbids-kind', raw, context);

  const ordinal = raw[WIRE.ordinal];
  if (!isOrdinal(ordinal)) return give('ordinal-invalid', raw, context);

  const rawSource = raw[WIRE.source];
  if (rawSource !== undefined && !isNonEmptyString(rawSource)) return give('source-invalid', raw, context);

  const rawProps = raw[WIRE.props];
  if (rawProps !== undefined && !isBlockProps(rawProps)) return give('props-invalid', raw, context);

  const rawChildren = raw[WIRE.children];
  if (rawChildren !== undefined && !isArrayOfUnknown(rawChildren)) {
    return give('children-invalid', raw, context);
  }

  const ancestors = new Set(context.ancestors);
  ancestors.add(raw);

  const children: Slotted[] = [];
  if (rawChildren !== undefined) {
    for (const [index, child] of rawChildren.entries()) {
      const slotted = parseNode(child, {
        path: `${path}.${WIRE.children}[${index}]`,
        zone,
        depth: context.depth + 1,
        budget,
        ancestors,
      });
      if (slotted !== null) children.push(slotted);
    }
  }

  // Único ponto de conversão do pacote, e ele é aqui de propósito: `rawKind` já passou pela
  // guarda do vocabulário e `rawProps` pela sua, mas o compilador não casa uma união
  // discriminada com um `kind` que ainda é a união inteira. Da fronteira para dentro, tudo
  // é tipado por papel — inclusive o despacho.
  const node = {
    kind: rawKind,
    ordinal,
    source: isNonEmptyString(rawSource) ? rawSource : null,
    props: isBlockProps(rawProps) ? rawProps : {},
    children,
  } as ManifestNode;

  return { resolution: 'block', node };
}

/** Registra o descarte e decide entre sumir (fluxo) e virar piso (slot de contagem fixa). */
function give(reason: DiscardReason, raw: unknown, context: NodeContext): Slotted | null {
  context.budget.discards.push(discard(reason, context.path, raw, context.zone));
  if (!hasFixedSlotCount(context.zone)) return null;
  return {
    resolution: 'floor',
    node: {
      kind: 'block.fallback',
      ordinal: readOrdinal(raw),
      source: null,
      props: {},
      children: [],
    },
    reason,
  };
}

function discard(reason: DiscardReason, path: string, raw: unknown, zone: ZoneId | null): Discard {
  const kind = isPlainObject(raw) && typeof raw[WIRE.kind] === 'string' ? (raw[WIRE.kind] as string) : null;
  return { reason, path, kind, zone };
}

function readZone(raw: unknown): ZoneId | null {
  if (!isPlainObject(raw)) return null;
  const zone = raw[WIRE.zone];
  return ZONE_IDS.find((known) => known === zone) ?? null;
}

/** Ordinal do nó descartado, quando ele ainda é legível. Sem ele, o piso vai para o fim. */
function readOrdinal(raw: unknown): number {
  if (!isPlainObject(raw)) return Number.MAX_SAFE_INTEGER;
  const ordinal = raw[WIRE.ordinal];
  return isOrdinal(ordinal) ? ordinal : Number.MAX_SAFE_INTEGER;
}

/**
 * Zona e ordinal são contrato, então a ordem da tela não depende da ordem do array. Empate é
 * resolvido pela ordem de chegada (ordenação estável): nada se descarta por empatar.
 */
function sortByContract(nodes: readonly Placed[]): readonly Placed[] {
  return [...nodes].sort((left, right) => {
    const byZone = zoneOrder(left.zone) - zoneOrder(right.zone);
    if (byZone !== 0) return byZone;
    return left.node.ordinal - right.node.ordinal;
  });
}

function parseJson(text: string): { ok: true; value: unknown } | { ok: false } {
  try {
    return { ok: true, value: JSON.parse(text) as unknown };
  } catch {
    // A única razão de existir um `catch` neste pacote: `JSON.parse` lança, e o contrato
    // desta camada é não deixar isso atravessar.
    return { ok: false };
  }
}

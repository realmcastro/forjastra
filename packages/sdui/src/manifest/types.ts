/**
 * A árvore **já validada**. Nada aqui é `unknown`, e nada aqui veio da rede sem passar por
 * uma guarda nomeada: o tipo é a fronteira entre o que chegou e o que se pode renderizar.
 */

import type { BlockKind } from '../vocabulary/block-kinds.js';
import type { ZoneId } from '../vocabulary/zones.js';

/** Valor de prop é **dado**, nunca código (`tolerancia-de-versao.md` §4.1). */
export type ManifestScalar = string | number | boolean | null;

export type ManifestPropValue = ManifestScalar | readonly ManifestScalar[];

export type BlockProps = Readonly<Record<string, ManifestPropValue>>;

/**
 * Props por papel. Hoje toda linha é o canal estrutural, porque **prop tipada por bloco é
 * Fase 3** (`vocabulario-e-eixos.md` §3.5). A tabela existe assim mesmo por dois motivos: o
 * despacho já é tipado por papel, e estreitar uma linha depois é uma edição local, não uma
 * troca de mecanismo.
 *
 * Papel que entra em `BLOCK_KINDS` e não entra aqui **não compila**.
 */
export interface PropsByKind {
  readonly 'block.region': BlockProps;
  readonly 'block.record-collection': BlockProps;
  readonly 'block.record-summary': BlockProps;
  readonly 'block.entry': BlockProps;
  readonly 'block.option-set': BlockProps;
  readonly 'block.command': BlockProps;
  readonly 'block.fallback': BlockProps;
  readonly 'block.connection-status': BlockProps;
}

export type NodeOf<K extends BlockKind> = {
  readonly kind: K;
  readonly ordinal: number;
  /** Opaca: o analisador carrega e não resolve. Resolver fonte é Fase 3. */
  readonly source: string | null;
  readonly props: PropsByKind[K];
  readonly children: readonly Slotted[];
};

/** União discriminada por `kind` — é ela que faz o despacho do §4.2 ser checado pelo compilador. */
export type ManifestNode = { [K in BlockKind]: NodeOf<K> }[BlockKind];

export type DiscardReason =
  | 'node-not-an-object'
  | 'kind-missing'
  | 'kind-unknown'
  | 'kind-not-emitted-by-server'
  | 'zone-missing-or-unknown'
  | 'zone-forbids-kind'
  | 'ordinal-invalid'
  | 'source-invalid'
  | 'props-invalid'
  | 'children-invalid'
  | 'depth-exceeded'
  | 'node-budget-exceeded'
  | 'cycle';

/**
 * O que ocupa um slot depois da análise. São **dois** casos e não há terceiro: ou o bloco
 * entendido, ou o piso. Id desconhecido não chega ao despacho — ele morre aqui, e é por isso
 * que a função de despacho devolve `T`, nunca `T | undefined`.
 */
export type Slotted =
  | { readonly resolution: 'block'; readonly node: ManifestNode }
  | {
      readonly resolution: 'floor';
      readonly node: NodeOf<'block.fallback'>;
      /** Diagnóstico interno. Não vira estado visível ao operador (§4.1). */
      readonly reason: DiscardReason;
    };

/** Slot da raiz: carrega a zona, que é contrato (`PN-06`). */
export type Placed = Slotted & { readonly zone: ZoneId };

export type Discard = {
  readonly reason: DiscardReason;
  /** Caminho do nó descartado, na forma `nodes[0].children[2]`. */
  readonly path: string;
  readonly kind: string | null;
  readonly zone: string | null;
};

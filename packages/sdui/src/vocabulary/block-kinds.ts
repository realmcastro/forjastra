/**
 * Vocabulário fechado de papéis de bloco — espelho executável de
 * `docs/design/vocabulario-e-eixos.md` §3.2 e §3.4.
 *
 * O id nomeia **função na interface**, nunca entidade, aparência, eixo, ramo, cliente
 * (tenant), estado nem permissão (§1.2, §1.3). Id publicado é imutável (§1.4): função nova é
 * id novo, e o velho vira inerte até uma decisão registrada retirá-lo.
 *
 * Acrescentar papel aqui é **mudar código do cliente, de propósito**
 * (`tolerancia-de-versao.md` §4.2). Se acrescentar bloco fosse mudar só dado, o vocabulário
 * não seria fechado.
 */

import type { ZoneId } from './zones.js';

export const BLOCK_KINDS = [
  'block.region',
  'block.record-collection',
  'block.record-summary',
  'block.entry',
  'block.option-set',
  'block.command',
  'block.fallback',
  'block.connection-status',
] as const;

export type BlockKind = (typeof BLOCK_KINDS)[number];

/**
 * Quem emite o id. `manifest` atravessa a rede e é contrato com terminal em versão antiga;
 * `client-only` vive no build e o servidor **nunca** o emite — nó de manifesto que traga um
 * desses é inválido, porque degradação é decisão do cliente (§3.4).
 */
export type Emission = 'manifest' | 'client-only';

/**
 * `retired` continua **entendido** pelo cliente e deixa de ser **emitido** pelo servidor. As
 * duas populações são diferentes, e é por isso que retirar é decisão registrada que declara
 * quem ainda emite e quem ainda entende (§1.4). Id retirado não volta e não se reaproveita.
 */
export type KindStatus = 'active' | 'retired';

export type BlockKindEntry = {
  readonly kind: BlockKind;
  /** O trabalho que se faz ali, em uma frase. */
  readonly role: string;
  readonly emission: Emission;
  readonly status: KindStatus;
  /** Zonas que admitem o papel (§3.3). Fora delas, o nó é inválido. */
  readonly zones: readonly ZoneId[];
};

export const BLOCK_KIND_REGISTRY: Readonly<Record<BlockKind, BlockKindEntry>> = {
  'block.region': {
    kind: 'block.region',
    role: 'agrupa nós filhos e é a unidade que carrega estado',
    emission: 'manifest',
    status: 'active',
    zones: ['zone.flow'],
  },
  'block.record-collection': {
    kind: 'block.record-collection',
    role: 'apresenta repetição ordenada, um item por registro da fonte',
    emission: 'manifest',
    status: 'active',
    zones: ['zone.flow'],
  },
  'block.record-summary': {
    kind: 'block.record-summary',
    role: 'apresenta os campos nomeados de um registro, com contagem de slots fixa',
    emission: 'manifest',
    status: 'active',
    zones: ['zone.flow'],
  },
  'block.entry': {
    kind: 'block.entry',
    role: 'coleta um valor do operador e pode ser destino de leitura da região',
    emission: 'manifest',
    status: 'active',
    zones: ['zone.flow'],
  },
  'block.option-set': {
    kind: 'block.option-set',
    role: 'escolhe uma opção de um conjunto fechado recebido do servidor',
    emission: 'manifest',
    status: 'active',
    zones: ['zone.flow'],
  },
  'block.command': {
    kind: 'block.command',
    role: 'invoca uma operação, e é o único papel que ocupa a zona de ação crítica',
    emission: 'manifest',
    status: 'active',
    zones: ['zone.flow', 'zone.anchor-top', 'zone.anchor-bottom'],
  },
  'block.fallback': {
    kind: 'block.fallback',
    role: 'ocupa um slot não colapsável cujo nó foi descartado, sem oferecer a ação',
    emission: 'client-only',
    status: 'active',
    zones: ['zone.flow', 'zone.anchor-top', 'zone.anchor-bottom'],
  },
  'block.connection-status': {
    kind: 'block.connection-status',
    role: 'superfície permanente de domínio de rede e de pendência',
    emission: 'client-only',
    status: 'active',
    zones: ['zone.anchor-top'],
  },
};

export function isBlockKind(value: unknown): value is BlockKind {
  return typeof value === 'string' && Object.hasOwn(BLOCK_KIND_REGISTRY, value);
}

/** Responde a nota que `SPR-45` pede: este id é contrato de rede, ou é build? */
export function crossesNetwork(kind: BlockKind): boolean {
  return BLOCK_KIND_REGISTRY[kind].emission === 'manifest';
}

export function zoneAdmits(zone: ZoneId, kind: BlockKind): boolean {
  return BLOCK_KIND_REGISTRY[kind].zones.includes(zone);
}

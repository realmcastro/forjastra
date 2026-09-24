/**
 * Zonas de layout — `docs/design/grade-e-espacos.md` §6.2 e `vocabulario-e-eixos.md` §3.3.
 *
 * Zona e ordinal vêm do manifesto e são **contrato** (`PN-06`): posição de ação frequente
 * não se move sem decisão registrada. Por isso zona desconhecida invalida o nó em vez de
 * virar um palpite de posição.
 */

export const ZONE_IDS = ['zone.flow', 'zone.anchor-top', 'zone.anchor-bottom'] as const;

export type ZoneId = (typeof ZONE_IDS)[number];

/**
 * Zonas de **contagem de slots fixa**: o slot não colapsa, porque colapsar moveria tudo que
 * vem depois dele (`tolerancia-de-versao.md` §4.3, item 2). Nó descartado aqui vira piso,
 * não ausência.
 */
export const FIXED_SLOT_ZONES: readonly ZoneId[] = ['zone.anchor-top', 'zone.anchor-bottom'];

/**
 * A zona de ação crítica. Admite **só** `block.command` (§3.3), e é onde id desconhecido é o
 * único caso sem saída boa: o terminal não sabe o que a ação faz, então não a oferece
 * (`tolerancia-de-versao.md` §4.3, item 4).
 */
export const CRITICAL_ACTION_ZONE: ZoneId = 'zone.anchor-bottom';

/** Ordem de apresentação das zonas. Dentro da zona, ordena o ordinal do manifesto. */
const ZONE_ORDER: Readonly<Record<ZoneId, number>> = {
  'zone.anchor-top': 0,
  'zone.flow': 1,
  'zone.anchor-bottom': 2,
};

export function zoneOrder(zone: ZoneId): number {
  return ZONE_ORDER[zone];
}

export function hasFixedSlotCount(zone: ZoneId): boolean {
  return FIXED_SLOT_ZONES.includes(zone);
}

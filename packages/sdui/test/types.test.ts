import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { BlockKind } from '../src/vocabulary/block-kinds.js';
import { dispatchSlot, type BlockRenderers } from '../src/manifest/dispatch.js';
import type { ManifestNode, NodeOf, Slotted } from '../src/manifest/types.js';

/**
 * As garantias deste arquivo são de **compilação**, não de execução: cada `@ts-expect-error`
 * falha o `tsc` no dia em que o erro que ele espera deixar de acontecer. É onde moram os dois
 * critérios de aceite do `SPR-45` e do `SPR-44` que nenhum `assert` alcança — id fora do
 * vocabulário não compila, e piso opcional não existe.
 */

// @ts-expect-error — id fora do vocabulário fechado não compila, nem parecendo com um que existe
const FORA_DO_VOCABULARIO: BlockKind = 'block.sale-total';
void FORA_DO_VOCABULARIO;

// @ts-expect-error — erro de digitação também não passa: não há aproximação por semelhança
const QUASE: BlockKind = 'block.comand';
void QUASE;

const COMPLETO: BlockRenderers<string> = {
  'block.region': (node) => node.kind,
  'block.record-collection': (node) => node.kind,
  'block.record-summary': (node) => node.kind,
  'block.entry': (node) => node.kind,
  'block.option-set': (node) => node.kind,
  'block.command': (node) => node.kind,
  'block.fallback': (node) => node.kind,
  'block.connection-status': (node) => node.kind,
};

// @ts-expect-error — piso opcional não existe: tabela sem `block.fallback` não compila
const SEM_PISO: BlockRenderers<string> = {
  'block.region': (node) => node.kind,
  'block.record-collection': (node) => node.kind,
  'block.record-summary': (node) => node.kind,
  'block.entry': (node) => node.kind,
  'block.option-set': (node) => node.kind,
  'block.command': (node) => node.kind,
  'block.connection-status': (node) => node.kind,
};
void SEM_PISO;

// @ts-expect-error — papel novo no vocabulário quebra quem despacha: tabela incompleta não compila
const SEM_UM_PAPEL: BlockRenderers<string> = {
  'block.region': (node) => node.kind,
  'block.record-collection': (node) => node.kind,
  'block.record-summary': (node) => node.kind,
  'block.entry': (node) => node.kind,
  'block.command': (node) => node.kind,
  'block.fallback': (node) => node.kind,
  'block.connection-status': (node) => node.kind,
};
void SEM_UM_PAPEL;

const TROCADO: BlockRenderers<string> = {
  ...COMPLETO,
  // @ts-expect-error — o nó chega tipado pelo papel: renderizador de outro papel não encaixa
  'block.command': (node: NodeOf<'block.entry'>) => node.kind,
};
void TROCADO;

const PROP_EXECUTAVEL: ManifestNode = {
  kind: 'block.entry',
  ordinal: 0,
  source: null,
  // @ts-expect-error — props são dado: função não é valor de prop, e string da rede não é código
  props: { onPress: () => undefined },
  children: [],
};
void PROP_EXECUTAVEL;

/** O retorno é `T`, nunca `T | undefined`: não existe slot sem resolução. */
function semUndefined(slot: Slotted): string {
  return dispatchSlot(slot, COMPLETO);
}

test('o despacho completo resolve todo slot, e o tipo já dizia isso', () => {
  const piso: Slotted = {
    resolution: 'floor',
    node: { kind: 'block.fallback', ordinal: 0, source: null, props: {}, children: [] },
    reason: 'kind-unknown',
  };
  assert.equal(semUndefined(piso), 'block.fallback');
});

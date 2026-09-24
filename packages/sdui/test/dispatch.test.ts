import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseManifest } from '../src/manifest/parse.js';
import { dispatchSlot, offersAction, type BlockRenderers } from '../src/manifest/dispatch.js';
import type { Placed, Slotted } from '../src/manifest/types.js';
import * as fixture from './fixtures.js';

/**
 * Renderizador de mentira que devolve o que seria oferecido ao operador. O que interessa é a
 * tabela ser **total**: tirar qualquer linha daqui não compila, e é isso que o `SPR-44` pede.
 */
const RENDERIZADORES: BlockRenderers<{ papel: string; ofereceAcao: boolean }> = {
  'block.region': (node) => ({ papel: node.kind, ofereceAcao: false }),
  'block.record-collection': (node) => ({ papel: node.kind, ofereceAcao: false }),
  'block.record-summary': (node) => ({ papel: node.kind, ofereceAcao: false }),
  'block.entry': (node) => ({ papel: node.kind, ofereceAcao: false }),
  'block.option-set': (node) => ({ papel: node.kind, ofereceAcao: false }),
  'block.command': (node) => ({ papel: node.kind, ofereceAcao: true }),
  'block.fallback': (node) => ({ papel: node.kind, ofereceAcao: false }),
  'block.connection-status': (node) => ({ papel: node.kind, ofereceAcao: false }),
};

function despacharTudo(nodes: readonly Placed[]): readonly { papel: string; ofereceAcao: boolean }[] {
  return nodes.map((entry) => dispatchSlot(entry, RENDERIZADORES));
}

test('cada papel vai para o seu renderizador, com o nó daquele papel', () => {
  const outcome = parseManifest(fixture.MANIFESTO_VALIDO);
  assert.equal(outcome.status, 'usable');
  if (outcome.status !== 'usable') return;

  assert.deepEqual(despacharTudo(outcome.nodes), [
    { papel: 'block.region', ofereceAcao: false },
    { papel: 'block.command', ofereceAcao: true },
  ]);
});

test('9. id desconhecido na zona de ação crítica: o slot vira piso e nenhuma ação é oferecida', () => {
  const outcome = parseManifest(fixture.ID_DESCONHECIDO_EM_ZONA_CRITICA);
  assert.equal(outcome.status, 'usable');
  if (outcome.status !== 'usable') return;

  const critico = outcome.nodes.find((entry) => entry.zone === 'zone.anchor-bottom');
  assert.ok(critico !== undefined);
  assert.equal(critico.resolution, 'floor');
  assert.equal(critico.node.kind, 'block.fallback');

  // O slot não colapsou: a zona continua ocupada, e a posição do que vem antes não mudou.
  assert.equal(outcome.nodes.length, 2);
  // E a ação não acontece ali: nada na tela inteira oferece ação.
  assert.deepEqual(
    outcome.nodes.map(offersAction),
    [false, false],
  );
  assert.deepEqual(
    despacharTudo(outcome.nodes).map((saida) => saida.ofereceAcao),
    [false, false],
  );
  assert.equal(critico.reason, 'kind-unknown');
});

test('o piso é despachado pelo renderizador de piso, e ele é obrigatório no tipo', () => {
  const piso: Slotted = {
    resolution: 'floor',
    node: { kind: 'block.fallback', ordinal: 3, source: null, props: {}, children: [] },
    reason: 'kind-unknown',
  };
  assert.deepEqual(dispatchSlot(piso, RENDERIZADORES), {
    papel: 'block.fallback',
    ofereceAcao: false,
  });
  assert.equal(offersAction(piso), false);
});

test('o despacho devolve sempre um valor: não existe caminho sem resolução', () => {
  const outcome = parseManifest(fixture.PAPEL_PROIBIDO_NA_ZONA_CRITICA);
  assert.equal(outcome.status, 'usable');
  if (outcome.status !== 'usable') return;

  for (const entry of outcome.nodes) {
    const saida = dispatchSlot(entry, RENDERIZADORES);
    assert.equal(typeof saida.papel, 'string');
  }
});

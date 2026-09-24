import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MAX_NODES, parseManifest } from '../src/manifest/parse.js';
import { WIRE } from '../src/manifest/wire.js';
import type { Discard, Placed } from '../src/manifest/types.js';
import * as fixture from './fixtures.js';

function kindsOf(nodes: readonly Placed[]): readonly string[] {
  return nodes.map((entry) => entry.node.kind);
}

function reasons(discards: readonly Discard[]): readonly string[] {
  return discards.map((entry) => entry.reason);
}

test('1. manifesto válido: a árvore sai inteira, na ordem de contrato', () => {
  const outcome = parseManifest(fixture.MANIFESTO_VALIDO);
  assert.equal(outcome.status, 'usable');
  if (outcome.status !== 'usable') return;

  assert.deepEqual(kindsOf(outcome.nodes), ['block.region', 'block.command']);
  assert.deepEqual(reasons(outcome.discards), []);

  const [regiao] = outcome.nodes;
  assert.ok(regiao !== undefined);
  assert.equal(regiao.node.children.length, 2);
  const [primeiro, segundo] = regiao.node.children;
  assert.equal(primeiro?.resolution, 'block');
  assert.equal(primeiro?.node.kind, 'block.entry');
  assert.equal(segundo?.node.source, 'sale.items');
});

test('2. JSON malformado: o analisador não lança, a resposta é inaproveitável', () => {
  const outcome = parseManifest(fixture.JSON_MALFORMADO);
  assert.equal(outcome.status, 'unusable');
  if (outcome.status !== 'unusable') return;
  assert.equal(outcome.reason, 'not-json');
});

test('3. campo truncado no meio do nó: mesmo desfecho, e nenhuma exceção', () => {
  const outcome = parseManifest(fixture.CAMPO_TRUNCADO);
  assert.equal(outcome.status, 'unusable');
  if (outcome.status !== 'unusable') return;
  assert.equal(outcome.reason, 'not-json');
});

test('4. tipo desconhecido entre tipos válidos: os dois somem, o do meio renderiza', () => {
  const outcome = parseManifest(fixture.TIPO_DESCONHECIDO_ENTRE_VALIDOS);
  assert.equal(outcome.status, 'usable');
  if (outcome.status !== 'usable') return;

  assert.deepEqual(kindsOf(outcome.nodes), ['block.record-summary']);
  assert.deepEqual(reasons(outcome.discards), ['kind-unknown', 'kind-unknown']);
  assert.deepEqual(
    outcome.discards.map((entry) => entry.kind),
    ['block.timeline', 'block.heat-map'],
  );
});

test('5. versão futura: campo que hoje não existe é ignorado, o nó sobrevive', () => {
  const outcome = parseManifest(fixture.VERSAO_FUTURA);
  assert.equal(outcome.status, 'usable');
  if (outcome.status !== 'usable') return;

  assert.deepEqual(kindsOf(outcome.nodes), ['block.entry']);
  assert.deepEqual(reasons(outcome.discards), []);

  const [entrada] = outcome.nodes;
  assert.deepEqual(entrada?.node.props, { label: 'codigo', autoFocus: true });
  // O campo desconhecido não é promovido a nada: ele não entra na árvore validada.
  assert.equal(Object.hasOwn(entrada?.node ?? {}, 'criticality'), false);
});

test('6. papel conhecido com props erradas: o nó é descartado, o irmão continua', () => {
  const outcome = parseManifest(fixture.PROPS_ERRADAS);
  assert.equal(outcome.status, 'usable');
  if (outcome.status !== 'usable') return;

  assert.deepEqual(kindsOf(outcome.nodes), ['block.entry']);
  assert.deepEqual(reasons(outcome.discards), ['props-invalid']);
});

test('7. chave envenenada em props: nó descartado e protótipo intocado', () => {
  const outcome = parseManifest(fixture.PROPS_ENVENENADAS);
  assert.equal(outcome.status, 'unusable');
  if (outcome.status !== 'unusable') return;

  assert.equal(outcome.reason, 'no-valid-node');
  assert.deepEqual(reasons(outcome.discards), ['props-invalid']);
  assert.equal((Object.prototype as unknown as Record<string, unknown>)['pwned'], undefined);
  assert.equal(({} as Record<string, unknown>)['pwned'], undefined);
});

test('8. nó válido entre dois inválidos: os dois são descartados e o do meio renderiza', () => {
  const outcome = parseManifest(fixture.VALIDO_ENTRE_DOIS_INVALIDOS);
  assert.equal(outcome.status, 'usable');
  if (outcome.status !== 'usable') return;

  assert.deepEqual(kindsOf(outcome.nodes), ['block.entry']);
  assert.deepEqual(reasons(outcome.discards), ['ordinal-invalid', 'zone-missing-or-unknown']);
});

test('10. papel conhecido na zona que não o admite: vira piso, porque o slot não colapsa', () => {
  const outcome = parseManifest(fixture.PAPEL_PROIBIDO_NA_ZONA_CRITICA);
  assert.equal(outcome.status, 'usable');
  if (outcome.status !== 'usable') return;

  const critico = outcome.nodes.find((entry) => entry.zone === 'zone.anchor-bottom');
  assert.equal(critico?.resolution, 'floor');
  assert.equal(critico?.node.kind, 'block.fallback');
  assert.deepEqual(reasons(outcome.discards), ['zone-forbids-kind']);
});

test('11. manifesto vazio: nenhum nó válido, e isso é inaproveitável', () => {
  const outcome = parseManifest(fixture.MANIFESTO_VAZIO);
  assert.equal(outcome.status, 'unusable');
  if (outcome.status !== 'unusable') return;
  assert.equal(outcome.reason, 'no-valid-node');
});

test('12. profundidade absurda: a subárvore funda some, o ancestral sobrevive', () => {
  const outcome = parseManifest(fixture.profundidadeAbsurda(400));
  assert.equal(outcome.status, 'usable');
  if (outcome.status !== 'usable') return;

  assert.deepEqual(kindsOf(outcome.nodes), ['block.region']);
  assert.deepEqual(reasons(outcome.discards), ['depth-exceeded']);
});

test('13. referência circular: o ciclo é cortado e nomeado, sem recursão infinita', () => {
  const outcome = parseManifest(fixture.referenciaCircular());
  assert.equal(outcome.status, 'usable');
  if (outcome.status !== 'usable') return;

  assert.deepEqual(kindsOf(outcome.nodes), ['block.region']);
  assert.deepEqual(reasons(outcome.discards), ['cycle']);
});

test('14. orçamento de nós: o excedente some e a tela continua de pé', () => {
  const outcome = parseManifest(fixture.irmaosDemais(MAX_NODES + 50));
  assert.equal(outcome.status, 'usable');
  if (outcome.status !== 'usable') return;

  assert.equal(outcome.nodes.length, MAX_NODES);
  assert.equal(outcome.discards.length, 50);
  assert.deepEqual(new Set(reasons(outcome.discards)), new Set(['node-budget-exceeded']));
});

test('15. string que parece código é dado: chega literal e nada é interpretado', () => {
  const outcome = parseManifest(fixture.STRING_QUE_PARECE_CODIGO);
  assert.equal(outcome.status, 'usable');
  if (outcome.status !== 'usable') return;

  const [entrada] = outcome.nodes;
  assert.equal(entrada?.node.source, "javascript:alert('x')");
  assert.equal(entrada?.node.props['label'], '${total * 2}');
  assert.equal((globalThis as unknown as Record<string, unknown>)['pwned'], undefined);
});

test('16. papel de piso emitido pelo servidor é recusado: degradação é decisão do cliente', () => {
  const outcome = parseManifest(fixture.PISO_EMITIDO_PELO_SERVIDOR);
  assert.equal(outcome.status, 'usable');
  if (outcome.status !== 'usable') return;

  assert.deepEqual(kindsOf(outcome.nodes), ['block.entry']);
  assert.deepEqual(reasons(outcome.discards), ['kind-not-emitted-by-server']);
});

test('o analisador nunca lança, seja qual for a entrada', () => {
  const hostis: readonly unknown[] = [
    undefined,
    null,
    42,
    '',
    '[]',
    '"texto"',
    'null',
    '{}',
    '{"nodes":{}}',
    '{"nodes":null}',
    [],
    new Date(),
    new Map(),
    () => 'função',
    Object.create(null),
    { nodes: [Symbol('x')] },
    fixture.JSON_MALFORMADO,
    fixture.CAMPO_TRUNCADO,
    fixture.referenciaCircular(),
  ];
  for (const entrada of hostis) {
    assert.doesNotThrow(() => parseManifest(entrada), String(typeof entrada));
    const outcome = parseManifest(entrada);
    assert.ok(outcome.status === 'usable' || outcome.status === 'unusable');
  }
});

test('os nomes de campo do nó saem de um lugar só (V-02 em aberto)', () => {
  assert.deepEqual(WIRE, {
    nodes: 'nodes',
    kind: 'kind',
    zone: 'zone',
    ordinal: 'ordinal',
    source: 'source',
    props: 'props',
    children: 'children',
  });
});

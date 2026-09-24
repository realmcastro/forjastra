import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EMBEDDED_FLOOR, resolveScreen } from '../src/manifest/screen.js';
import * as fixture from './fixtures.js';

const CACHE_BOM = { body: fixture.MANIFESTO_VALIDO, capturedAt: '2026-09-12T08:30:00Z' };

test('rede aproveitável: a tela vem da rede e só então o cache é escrito', () => {
  const degradacao = resolveScreen({
    network: { status: 'received', body: fixture.MANIFESTO_VALIDO },
    cache: null,
  });

  assert.equal(degradacao.screen.origin, 'network');
  assert.equal(degradacao.screen.stale, false);
  assert.equal(degradacao.cacheWrite.action, 'store');
  assert.equal(degradacao.networkRefusedBecause, null);
});

test('resposta inaproveitável não é cacheada, e a tela desce para o cache', () => {
  const degradacao = resolveScreen({
    network: { status: 'received', body: fixture.JSON_MALFORMADO },
    cache: CACHE_BOM,
  });

  assert.equal(degradacao.cacheWrite.action, 'none');
  if (degradacao.cacheWrite.action === 'none') {
    assert.equal(degradacao.cacheWrite.reason, 'unusable-response');
  }
  assert.equal(degradacao.screen.origin, 'cache');
  assert.equal(degradacao.screen.stale, true);
  assert.equal(degradacao.screen.capturedAt, '2026-09-12T08:30:00Z');
  assert.equal(degradacao.networkRefusedBecause, 'not-json');
});

test('17. resposta que nunca chega: cache serve, com o instante declarado', () => {
  const degradacao = resolveScreen({ network: fixture.RESPOSTA_QUE_NUNCA_CHEGA, cache: CACHE_BOM });

  assert.equal(degradacao.screen.origin, 'cache');
  assert.equal(degradacao.screen.stale, true);
  assert.equal(degradacao.screen.capturedAt, CACHE_BOM.capturedAt);
  assert.equal(degradacao.networkRefusedBecause, 'unreachable');
  assert.equal(degradacao.cacheWrite.action, 'none');
  if (degradacao.cacheWrite.action === 'none') {
    assert.equal(degradacao.cacheWrite.reason, 'no-response');
  }
});

test('sem rede e sem cache: piso embutido, e o terminal não fica mudo', () => {
  const degradacao = resolveScreen({ network: fixture.RESPOSTA_QUE_NUNCA_CHEGA, cache: null });

  assert.equal(degradacao.screen.origin, 'floor');
  assert.deepEqual(degradacao.screen.nodes, EMBEDDED_FLOOR);
  assert.equal(degradacao.screen.nodes.length, 1);
  const [unico] = degradacao.screen.nodes;
  assert.equal(unico?.node.kind, 'block.connection-status');
  assert.equal(unico?.zone, 'zone.anchor-top');
  assert.equal(degradacao.screen.stale, false);
  assert.equal(degradacao.screen.capturedAt, null);
});

test('cache também inaproveitável: cai para o piso, sem pular etapa', () => {
  const degradacao = resolveScreen({
    network: { status: 'received', body: fixture.CAMPO_TRUNCADO },
    cache: { body: fixture.MANIFESTO_VAZIO, capturedAt: '2026-09-11T22:00:00Z' },
  });

  assert.equal(degradacao.screen.origin, 'floor');
  assert.equal(degradacao.cacheWrite.action, 'none');
  assert.equal(degradacao.networkRefusedBecause, 'not-json');
});

test('a tela nunca fica vazia, em nenhuma combinação de rede e cache', () => {
  const respostas: readonly unknown[] = [
    fixture.MANIFESTO_VALIDO,
    fixture.JSON_MALFORMADO,
    fixture.CAMPO_TRUNCADO,
    fixture.MANIFESTO_VAZIO,
    fixture.PROPS_ENVENENADAS,
    fixture.referenciaCircular(),
    null,
    undefined,
    7,
  ];
  const caches: readonly ({ body: unknown; capturedAt: string } | null)[] = [
    null,
    CACHE_BOM,
    { body: fixture.JSON_MALFORMADO, capturedAt: '2026-09-10T10:00:00Z' },
  ];

  for (const body of respostas) {
    for (const cache of caches) {
      const degradacao = resolveScreen({ network: { status: 'received', body }, cache });
      assert.ok(degradacao.screen.nodes.length > 0, `${String(body)} / ${String(cache?.capturedAt)}`);
    }
  }
});

test('cache guarda o corpo como chegou, não a árvore analisada', () => {
  const degradacao = resolveScreen({
    network: { status: 'received', body: fixture.VERSAO_FUTURA },
    cache: null,
  });

  assert.equal(degradacao.cacheWrite.action, 'store');
  if (degradacao.cacheWrite.action !== 'store') return;
  // O campo de versão futura continua lá: quem reinterpreta o manifesto velho é o cliente novo.
  assert.equal(degradacao.cacheWrite.body, fixture.VERSAO_FUTURA);
});

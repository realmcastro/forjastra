import { test } from 'node:test';
import assert from 'node:assert/strict';
import { uuidV7 } from '../src/id/uuid-v7.js';

test('carrega versão 7 e variante RFC 9562', () => {
  for (let i = 0; i < 200; i += 1) {
    const id = uuidV7();
    assert.match(id, /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  }
});

test('é estritamente crescente na ordem lexicográfica, inclusive dentro do mesmo milissegundo', () => {
  const ids: string[] = [];
  for (let i = 0; i < 20_000; i += 1) ids.push(uuidV7());
  for (let i = 1; i < ids.length; i += 1) {
    assert.ok(ids[i]! > ids[i - 1]!, `ordem quebrou em ${i}: ${ids[i - 1]!} → ${ids[i]!}`);
  }
});

test('relógio andando para trás não produz identificador fora de ordem', () => {
  const base = Date.now() + 60_000;
  const primeiro = uuidV7(base);
  const depoisDoRetrocesso = uuidV7(base - 5_000);
  assert.ok(depoisDoRetrocesso > primeiro);
});

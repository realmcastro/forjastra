import { test } from 'node:test';
import assert from 'node:assert/strict';
import { format, parse, type Money } from '../src/index.js';
import { must, refused, text } from './helpers.js';

// F-030, aceite 1 · forma canônica de T-0018 E.2 item 1, que o reenvio idempotente de RN-OFF-013 compara byte a byte.
test('F-030 aceite 1: ida e volta byte a byte, na escala declarada', () => {
  assert.equal(text(must(parse('money_amount', '17.90', 2))), '17.90');
  assert.equal(text(must(parse('quantity_value', '0.750', 3))), '0.750');
  assert.equal(text(must(parse('quantity_value', '2', 0))), '2');
  assert.equal(text(must(parse('unit_price', '6.299', 3))), '6.299');
  assert.equal(text(must(parse('money_amount', '0.00', 2))), '0.00');
});

test('F-030 aceite 1: grafia fora da forma canônica é recusada com motivo, nunca normalizada', () => {
  const cases: ReadonlyArray<readonly [string, string]> = [
    ['17.9', 'scale-mismatch'],
    ['17.900', 'scale-mismatch'],
    ['017.90', 'leading-zero'],
    ['+17.90', 'plus-sign'],
    ['1.79e1', 'exponent'],
    ['-0.00', 'negative'],
    ['17,90', 'malformed'],
    [' 17.90', 'whitespace'],
    ['', 'empty'],
  ];
  for (const [input, code] of cases) {
    const outcome = parse('money_amount', input, 2);
    assert.equal(outcome.ok, false, `"${input}" deveria ser recusado`);
    if (!outcome.ok) assert.equal(outcome.error.code, code, `motivo de "${input}"`);
  }
});

test('F-030 aceite 1: a escala nunca se infere da string', () => {
  refused(parse('quantity_value', '2.0', 0), 'scale-mismatch');
  refused(parse('quantity_value', '2', 3), 'scale-mismatch');
  refused(parse('money_amount', '17', 2), 'scale-mismatch');
  refused(parse('money_amount', '.90', 2), 'malformed');
  refused(parse('money_amount', '17.', 2), 'malformed');
  refused(parse('money_amount', '17.90.1', 2), 'malformed');
});

// F-030, aceite 2 · envelope de memory/plataforma/decision-dinheiro-e-quantidade.md.
test('F-030 aceite 2: teto de valor, casa a mais recusada e nunca arredondada', () => {
  assert.equal(text(must(parse('money_amount', '999999999999.99', 2))), '999999999999.99');
  refused(parse('money_amount', '1000000000000.00', 2), 'out-of-range');
  refused(parse('money_amount', '17.925', 2), 'scale-mismatch');
  refused(parse('quantity_value', '0.7505', 3), 'scale-mismatch');
});

test('F-030 aceite 2: teto de quantidade (< 10^11) e de preço unitário (< 10^12, adotado do valor)', () => {
  assert.equal(text(must(parse('quantity_value', '99999999999.999', 3))), '99999999999.999');
  refused(parse('quantity_value', '100000000000.000', 3), 'out-of-range');
  assert.equal(text(must(parse('unit_price', '999999999999.999', 3))), '999999999999.999');
  refused(parse('unit_price', '1000000000000.000', 3), 'out-of-range');
  refused(parse('money_amount', `${'9'.repeat(5000)}.00`, 2), 'out-of-range');
});

test('F-030 aceite 2: escala fora do domínio é recusada', () => {
  refused(parse('money_amount', '17.9', 1 as never), 'invalid-scale');
  refused(parse('quantity_value', '0.7505', 4 as never), 'invalid-scale');
  refused(parse('unit_price', '1.0', 1.5 as never), 'invalid-scale');
});

// F-030, caminho infeliz: negativo. Decisão deste módulo: todo valor é não negativo, e o negativo é
// recusado na leitura, porque fato de valor é positivo e devolução é linha nova (dados.md §4).
test('F-030 infeliz: entrada negativa é recusada em todo domínio', () => {
  refused(parse('money_amount', '-17.90', 2), 'negative');
  refused(parse('quantity_value', '-1', 0), 'negative');
  refused(parse('unit_price', '-6.299', 3), 'negative');
});

test('F-030 aceite 6: chamador sem tipo não passa number nem valor forjado', () => {
  const untypedParse = parse as unknown as (domain: unknown, text: unknown, scale: unknown) => unknown;
  assert.deepEqual(untypedParse('money_amount', 17.9, 2), { ok: false, error: { code: 'not-a-string' } });
  assert.deepEqual(untypedParse('toString', '1', 0), { ok: false, error: { code: 'invalid-scale' } });

  const forged = { domain: 'money_amount', units: -1n, scale: 2 } as unknown as Money;
  refused(format(forged), 'invalid-value');
  const floatUnits = { domain: 'money_amount', units: 1790, scale: 2 } as unknown as Money;
  refused(format(floatUnits), 'invalid-value');
});

test('valor é imutável', () => {
  const value = must(parse('money_amount', '17.90', 2));
  assert.equal(Object.isFrozen(value), true);
});

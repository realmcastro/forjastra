import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ROUNDING_MODES,
  add,
  exactToMoney,
  multiply,
  roundToMoney,
  type ExactAmount,
  type Money,
  type RoundingMode,
} from '../src/index.js';
import { money, must, price, quantity, refused, text } from './helpers.js';

function line(qty: string, qtyScale: 0 | 1 | 2 | 3, unit: string, unitScale: 0 | 1 | 2 | 3): ExactAmount {
  return must(multiply(quantity(qty, qtyScale), price(unit, unitScale)));
}

function rounded(amount: ExactAmount, mode: RoundingMode): string {
  return text(must(roundToMoney(amount, mode)));
}

// RN-NUC-067, tabela do enunciado (docs/produto/nucleo-venda-congelamento.md:71): os quatro modos.
test('RN-NUC-067: 0,350 × 29,90 = 10,465 nos quatro modos', () => {
  const amount = line('0.350', 3, '29.90', 2);
  assert.equal(amount.units, 1046500n);
  assert.equal(amount.scale, 5);
  assert.deepEqual(
    ROUNDING_MODES.map((mode) => [mode, rounded(amount, mode)]),
    [
      ['half_up', '10.47'],
      ['half_even', '10.46'],
      ['down', '10.46'],
      ['up', '10.47'],
    ],
  );
});

test('RN-NUC-067: 23,456 × 6,299 = 147,749344 nos quatro modos', () => {
  const amount = line('23.456', 3, '6.299', 3);
  assert.equal(amount.units, 147749344n);
  assert.equal(amount.scale, 6);
  assert.deepEqual(
    ROUNDING_MODES.map((mode) => [mode, rounded(amount, mode)]),
    [
      ['half_up', '147.75'],
      ['half_even', '147.75'],
      ['down', '147.74'],
      ['up', '147.75'],
    ],
  );
});

// Em ponto flutuante o empate de 10,465 desaparece: o produto sai 10,464999…, e as duas regras de
// metade passam a dar o mesmo centavo. Em 0,020 × 27,25 = 0,545 o float fica acima da metade, e a
// metade para o par sobe para o ímpar. A conta daqui vê o empate nos dois.
test('RN-NUC-067: half_even no empate exato, onde ponto flutuante erra', () => {
  const floatProduct = 0.35 * 29.9;
  assert.notEqual(floatProduct, 10.465, 'o float perdeu o empate');
  assert.equal(Math.round(floatProduct * 100) / 100, 10.46, 'metade para cima em float cai para 10,46');

  const tie = line('0.350', 3, '29.90', 2);
  assert.equal(rounded(tie, 'half_up'), '10.47');
  assert.equal(rounded(tie, 'half_even'), '10.46');

  assert.ok(0.02 * 27.25 * 100 > 54.5, 'o float fica acima da metade');
  const evenBelow = line('0.020', 3, '27.25', 2);
  assert.equal(rounded(evenBelow, 'half_even'), '0.54');
  assert.equal(rounded(evenBelow, 'half_up'), '0.55');

  assert.equal(evenBelow.units % 1000n, 500n, '0,545 é empate exato');

  // Empate com o vizinho de baixo ímpar: metade para o par sobe (0,015 → 0,02).
  const oddBelow = line('0.001', 3, '15.00', 2);
  assert.equal(rounded(oddBelow, 'half_even'), '0.02');
  assert.equal(rounded(oddBelow, 'down'), '0.01');
});

// F-030, aceite 3 (docs/arquitetura/dinheiro-e-quantidade-2026-09-23.md:214-218).
test('F-030 aceite 3: polpa, combustível e roupa', () => {
  const polpa = line('0.750', 3, '23.90', 2);
  assert.equal(polpa.units, 1792500n);
  assert.equal(rounded(polpa, 'half_up'), '17.93');
  assert.equal(rounded(polpa, 'half_even'), '17.92');

  const combustivel = line('37.512', 3, '6.299', 3);
  assert.equal(combustivel.units, 236288088n);
  assert.equal(rounded(combustivel, 'half_up'), '236.29');
  assert.equal(rounded(combustivel, 'half_even'), '236.29');

  const roupa = line('2', 0, '89.90', 2);
  for (const mode of ROUNDING_MODES) assert.equal(rounded(roupa, mode), '179.80');
});

// RN-NUC-067, precondição: linha de valor exato não depende de modo publicado.
test('RN-NUC-067: valor exato vira dinheiro sem modo; o que precisa arredondar é recusado', () => {
  assert.equal(text(must(exactToMoney(line('2', 0, '5.00', 2)))), '10.00');
  assert.equal(text(must(exactToMoney(line('2', 0, '89.90', 2)))), '179.80');
  assert.equal(text(must(exactToMoney(line('0.500', 3, '3.00', 2)))), '1.50');
  assert.equal(text(must(exactToMoney(line('3', 0, '7', 0)))), '21.00');
  refused(exactToMoney(line('0.750', 3, '23.90', 2)), 'requires-rounding');
});

test('F-030 aceite 3: arredondar sem modo, chamado sem tipo, devolve erro e nunca um padrão', () => {
  const polpa = line('0.750', 3, '23.90', 2);
  const untyped = roundToMoney as unknown as (amount: unknown, mode?: unknown) => unknown;
  assert.deepEqual(untyped(polpa), { ok: false, error: { code: 'rounding-mode-missing' } });
  assert.deepEqual(untyped(polpa, null), { ok: false, error: { code: 'rounding-mode-missing' } });
  assert.deepEqual(untyped(polpa, 'HALF_UP'), { ok: false, error: { code: 'rounding-mode-unknown' } });
  assert.deepEqual(untyped(polpa, 'bankers'), { ok: false, error: { code: 'rounding-mode-unknown' } });
  assert.deepEqual(untyped(17.925, 'half_up'), { ok: false, error: { code: 'invalid-value' } });
});

// F-030, aceite 4 (docs/arquitetura/dinheiro-e-quantidade-2026-09-23.md §7): as duas sequências
// se escrevem com operações públicas, e o módulo não escolhe entre elas.
test('F-030 aceite 4: arredondar por linha e somar ≠ somar e arredondar', () => {
  const polpa = (): ExactAmount => line('0.750', 3, '23.90', 2);

  const perLine = [polpa(), polpa(), polpa()]
    .map((amount) => must(roundToMoney(amount, 'half_up')))
    .reduce((total: Money, next) => must(add(total, next)));
  assert.equal(text(perLine), '53.79');

  const exactTotal = [polpa(), polpa()].reduce((total, next) => must(add(total, next)), polpa());
  assert.equal(exactTotal.units, 5377500n);
  assert.equal(rounded(exactTotal, 'half_up'), '53.78');
});

test('soma exige mesma grandeza e mesma escala, e respeita o teto', () => {
  assert.equal(text(must(add(money('17.90'), money('0.10')))), '18.00');
  assert.equal(text(must(add(quantity('0.750', 3), quantity('0.250', 3)))), '1.000');
  refused(add(quantity('0.750', 3), quantity('1', 0)), 'scale-mismatch');
  refused(add(line('0.750', 3, '23.90', 2), line('2', 0, '89.90', 2)), 'scale-mismatch');
  refused(add(money('999999999999.99'), money('0.01')), 'out-of-range');
  refused(add(money('1.00'), quantity('1.00', 2) as unknown as Money), 'invalid-value');
});

// F-030, caminho infeliz: o produto é exato em BigInt, e o envelope recusa na conversão.
test('F-030 infeliz: produto além do envelope de valor é recusado, nunca truncado', () => {
  const huge = line('99999999999.999', 3, '999999999999.999', 3);
  assert.equal(huge.units, 99999999999999n * 999999999999999n);
  refused(roundToMoney(huge, 'down'), 'out-of-range');
  refused(exactToMoney(line('10000', 0, '100000000.00', 2)), 'out-of-range');
  assert.equal(text(must(exactToMoney(line('9999', 0, '100000000.00', 2)))), '999900000000.00');
});

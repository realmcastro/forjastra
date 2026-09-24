import { test } from 'node:test';
import assert from 'node:assert/strict';
import { allocateByLargestRemainder, type Money } from '../src/index.js';
import { money, must, refused, text } from './helpers.js';

function allocate(amount: string, lines: readonly string[]): readonly string[] {
  return must(allocateByLargestRemainder(money(amount), lines.map(money))).map(text);
}

// RN-NUC-064, aceite 1 (docs/produto/nucleo-venda-congelamento.md:16): empate vai à primeira lançada.
test('RN-NUC-064 aceite 1: 10,00 sobre três linhas de 10,00 dá 3,34 · 3,33 · 3,33', () => {
  assert.deepEqual(allocate('10.00', ['10.00', '10.00', '10.00']), ['3.34', '3.33', '3.33']);
});

// RN-NUC-064, aceite 2: restos de 0,5 · 0,7 · 0,8 centavo, a terceira e a segunda recebem.
test('RN-NUC-064 aceite 2: 0,99 sobre 5,00 · 3,00 · 2,00 dá 0,49 · 0,30 · 0,20', () => {
  assert.deepEqual(allocate('0.99', ['5.00', '3.00', '2.00']), ['0.49', '0.30', '0.20']);
});

// RN-NUC-064, aceite 3: reenvio da mesma conclusão dá as mesmas parcelas.
test('RN-NUC-064 aceite 3: a mesma entrada duas vezes dá o mesmo resultado', () => {
  const lines = ['7.00', '5.00', '3.00', '0.00', '5.00'];
  assert.deepEqual(allocate('10.00', lines), allocate('10.00', lines));
  assert.deepEqual(allocate('10.00', ['7.00', '5.00', '3.00']), ['4.67', '3.33', '2.00']);
});

test('RN-NUC-064: linha de valor zero recebe zero', () => {
  assert.deepEqual(allocate('0.01', ['1.00', '0.00', '1.00']), ['0.01', '0.00', '0.00']);
  assert.deepEqual(allocate('0.01', ['1.00', '1.00', '1.00']), ['0.01', '0.00', '0.00']);
  assert.deepEqual(allocate('2.00', ['0.00', '1.00', '1.00']), ['0.00', '1.00', '1.00']);
});

test('RN-NUC-064 infeliz b: valor maior que a soma das linhas é recusado, inclusive soma zero', () => {
  refused(allocateByLargestRemainder(money('10.01'), [money('5.00'), money('5.00')]), 'allocation-exceeds-base');
  refused(allocateByLargestRemainder(money('0.01'), [money('0.00'), money('0.00')]), 'allocation-exceeds-base');
  refused(allocateByLargestRemainder(money('0.01'), []), 'allocation-exceeds-base');
  assert.deepEqual(allocate('0.00', ['0.00', '0.00']), ['0.00', '0.00']);
  assert.deepEqual(allocate('0.00', []), []);
  assert.deepEqual(allocate('10.00', ['10.00']), ['10.00']);
});

test('RN-NUC-064: linha forjada é recusada', () => {
  const forged = { domain: 'money_amount', units: -100n, scale: 2 } as unknown as Money;
  refused(allocateByLargestRemainder(money('1.00'), [money('2.00'), forged]), 'invalid-value');
});

// Gerador determinístico, para a falha ser reproduzível pela semente.
function generator(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state;
  };
}

function randomUnits(next: () => number, maxDigits: number): bigint {
  const digits = 1 + (next() % maxDigits);
  let value = 0n;
  for (let i = 0; i < digits; i += 1) value = value * 10n + BigInt(next() % 10);
  return value;
}

function fromUnits(units: bigint): Money {
  return money(`${units / 100n}.${(units % 100n).toString().padStart(2, '0')}`);
}

// F-030, aceite 5: propriedade de RN-NUC-064 sobre entradas geradas
// (docs/arquitetura/dinheiro-e-quantidade-2026-09-23.md:275-277).
test('RN-NUC-064 propriedade: soma das parcelas é o valor, e cada parcela está a menos de uma unidade da proporção', () => {
  const next = generator(20260923);
  for (let round = 0; round < 2000; round += 1) {
    const count = 1 + (next() % 12);
    const lines = Array.from({ length: count }, () => (next() % 5 === 0 ? 0n : randomUnits(next, 9)));
    const base = lines.reduce((total, value) => total + value, 0n);
    const amount = base === 0n ? 0n : randomUnits(next, 11) % (base + 1n);

    const parcels = must(allocateByLargestRemainder(fromUnits(amount), lines.map(fromUnits)));
    const context = `semente 20260923, rodada ${round}: ${amount} sobre [${lines.join(', ')}]`;

    assert.equal(parcels.length, lines.length, context);
    assert.equal(parcels.reduce((total, parcel) => total + parcel.units, 0n), amount, context);
    parcels.forEach((parcel, index) => {
      const lineUnits = lines[index] ?? 0n;
      const floor = base === 0n ? 0n : (amount * lineUnits) / base;
      assert.ok(parcel.units === floor || parcel.units === floor + 1n, context);
      assert.ok(parcel.units <= lineUnits, context);
      if (lineUnits === 0n) assert.equal(parcel.units, 0n, context);
    });

    // Quem recebeu a unidade a mais tem resto maior, ou igual e lançamento anterior, que quem não recebeu.
    if (base === 0n) continue;
    const ranked = lines.map((lineUnits, order) => ({
      order,
      remainder: (amount * lineUnits) % base,
      bumped: (parcels[order]?.units ?? 0n) > (amount * lineUnits) / base,
    }));
    for (const winner of ranked.filter((entry) => entry.bumped)) {
      for (const loser of ranked.filter((entry) => !entry.bumped)) {
        const ahead =
          winner.remainder > loser.remainder ||
          (winner.remainder === loser.remainder && winner.order < loser.order);
        assert.ok(ahead, `${context}: linha ${winner.order} passou à frente da ${loser.order}`);
      }
    }
  }
});

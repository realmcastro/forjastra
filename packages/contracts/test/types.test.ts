import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  add,
  format,
  multiply,
  parse,
  roundToMoney,
  type ExactAmount,
  type Money,
  type Quantity,
} from '../src/index.js';
import { money, must, price, quantity } from './helpers.js';

/**
 * Garantias de compilação: cada `@ts-expect-error` falha o `tsc` no dia em que o erro que ele
 * espera deixar de acontecer. É onde mora a metade de tipo dos aceites 3 e 6 do `F-030`.
 */

const polpa: ExactAmount = must(multiply(quantity('0.750', 3), price('23.90', 2)));

// @ts-expect-error — F-030 aceite 3 / RN-NUC-067: arredondar sem modo não compila
void roundToMoney(polpa);

// @ts-expect-error — modo fora da lista fechada de RN-NUC-067 não compila
void roundToMoney(polpa, 'half_down');

// @ts-expect-error — RN-NUC-067: valor que já é dinheiro não é arredondado de novo
void roundToMoney(money('17.93'), 'half_up');

// @ts-expect-error — F-030 aceite 6: number não é valor
void add(17.9, 0.1);

// @ts-expect-error — F-030 aceite 6: valor não se monta com literal, só por parse ou por operação
const forged: Money = { domain: 'money_amount', units: 1790n, scale: 2 };
void forged;

// @ts-expect-error — soma entre grandezas diferentes não compila
void add(money('1.00'), quantity('1.00', 2));

// @ts-expect-error — preço no lugar da quantidade não compila
void multiply(price('23.90', 2), quantity('0.750', 3));

// @ts-expect-error — dinheiro só na escala 2 (RN-NUC-058)
void parse('money_amount', '17.900', 3);

// @ts-expect-error — quantidade não passa de 3 casas no envelope
void parse('quantity_value', '0.7505', 4);

// @ts-expect-error — o produto exato não tem forma de rede: não se formata
void format(polpa);

const onlyQuantity: Quantity = quantity('1', 0);
void onlyQuantity;

test('garantias de tipo compilam (o assert aqui é só para o node --test ter o que contar)', () => {
  assert.ok(true);
});

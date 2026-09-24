import assert from 'node:assert/strict';
import {
  format,
  parse,
  type ErrorCode,
  type Fixed,
  type Money,
  type Outcome,
  type Quantity,
  type QuantityScale,
  type UnitPrice,
  type UnitPriceScale,
  type WireDomain,
} from '../src/index.js';

export function must<T>(outcome: Outcome<T>): T {
  if (!outcome.ok) assert.fail(`esperava sucesso, veio ${outcome.error.code}`);
  return outcome.value;
}

export function refused<T>(outcome: Outcome<T>, code: ErrorCode): void {
  assert.equal(outcome.ok, false, 'esperava recusa, veio sucesso');
  if (!outcome.ok) assert.equal(outcome.error.code, code);
}

export function money(text: string): Money {
  return must(parse('money_amount', text, 2));
}

export function price(text: string, scale: UnitPriceScale): UnitPrice {
  return must(parse('unit_price', text, scale));
}

export function quantity(text: string, scale: QuantityScale): Quantity {
  return must(parse('quantity_value', text, scale));
}

export function text<D extends WireDomain>(value: Fixed<D>): string {
  return must(format(value));
}

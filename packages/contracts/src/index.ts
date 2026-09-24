/**
 * `@forja/contracts` — o que é contrato de rede e roda igual no servidor e no terminal.
 *
 * Hoje: o ponto fixo de dinheiro, preço unitário e quantidade (`F-030`,
 * `memory/plataforma/decision-dinheiro-e-quantidade.md`). O código fora de `test/` compila sem os
 * tipos de Node e sem DOM (`tsconfig.src.json`), então não alcança `node:*`, `process`, `Buffer`
 * nem `console`.
 */

export {
  MONEY_SCALE,
  type Domain,
  type ErrorCode,
  type ExactAmount,
  type Fixed,
  type FixedPointError,
  type Money,
  type MoneyScale,
  type Outcome,
  type Quantity,
  type QuantityScale,
  type ScaleOf,
  type UnitPrice,
  type UnitPriceScale,
  type WireDomain,
} from './fixed-point/value.js';
export { format, parse } from './fixed-point/canonical.js';
export {
  ROUNDING_MODES,
  add,
  exactToMoney,
  multiply,
  roundToMoney,
  type RoundingMode,
} from './fixed-point/arithmetic.js';
export { allocateByLargestRemainder } from './fixed-point/allocate.js';

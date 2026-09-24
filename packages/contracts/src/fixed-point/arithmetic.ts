import {
  MONEY_SCALE,
  build,
  failure,
  isFixed,
  pow10,
  type Domain,
  type ExactAmount,
  type Fixed,
  type Money,
  type Outcome,
  type Quantity,
  type UnitPrice,
} from './value.js';

/**
 * Lista fechada de `RN-NUC-067` (`docs/produto/nucleo-venda-congelamento.md:71`). O nome é o que a
 * versão publicada congela no fato (`RN-NUC-013`): nome existente não muda de comportamento, e modo
 * novo entra como nome novo. Nenhum é padrão.
 */
export const ROUNDING_MODES = ['half_up', 'half_even', 'down', 'up'] as const;
export type RoundingMode = (typeof ROUNDING_MODES)[number];

function isRoundingMode(candidate: unknown): candidate is RoundingMode {
  return typeof candidate === 'string' && (ROUNDING_MODES as readonly string[]).includes(candidate);
}

/** Soma de dois valores da mesma grandeza e da mesma escala. Passar do teto é recusa. */
// `NoInfer` prende a grandeza no operando da esquerda: sem ele, dinheiro + quantidade compila.
export function add<D extends Domain>(
  left: Fixed<D>,
  right: Fixed<NoInfer<D>>,
): Outcome<Fixed<D>> {
  const domain = (left as { domain?: unknown } | null)?.domain as D;
  if (!isFixed(left, domain) || !isFixed(right, domain)) return failure('invalid-value');
  if (left.scale !== right.scale) return failure('scale-mismatch');
  return build(domain, left.units + right.units, left.scale);
}

/**
 * Quantidade × preço unitário, exato: as escalas se somam (3 com 3 dá 6) e nada é arredondado
 * aqui (`RN-NUC-067`, "produto exato, **um** arredondamento").
 */
export function multiply(quantity: Quantity, unitPrice: UnitPrice): Outcome<ExactAmount> {
  if (!isFixed(quantity, 'quantity_value') || !isFixed(unitPrice, 'unit_price')) {
    return failure('invalid-value');
  }
  return build('exact_amount', quantity.units * unitPrice.units, quantity.scale + unitPrice.scale);
}

/**
 * O único arredondamento do módulo (`RN-NUC-067`). O modo é obrigatório no tipo e conferido de novo
 * na execução: chamador sem tipo que o omite recebe erro, nunca um modo escolhido por ele.
 * Recebe só `ExactAmount`, então valor que já é dinheiro não tem como ser arredondado de novo.
 */
export function roundToMoney(amount: ExactAmount, mode: RoundingMode): Outcome<Money> {
  if (!isFixed(amount, 'exact_amount')) return failure('invalid-value');
  if (mode === undefined || mode === null) return failure('rounding-mode-missing');
  if (!isRoundingMode(mode)) return failure('rounding-mode-unknown');

  if (amount.scale <= MONEY_SCALE) {
    return build('money_amount', amount.units * pow10(MONEY_SCALE - amount.scale), MONEY_SCALE);
  }
  const divisor = pow10(amount.scale - MONEY_SCALE);
  const quotient = amount.units / divisor;
  const remainder = amount.units % divisor;
  return build('money_amount', quotient + roundingStep(mode, quotient, remainder, divisor), MONEY_SCALE);
}

// Valor nunca é negativo aqui (`value.ts`), então "afastar do zero" é somar um e "cair" é não somar.
function roundingStep(mode: RoundingMode, quotient: bigint, remainder: bigint, divisor: bigint): bigint {
  if (remainder === 0n) return 0n;
  const twice = remainder * 2n;
  switch (mode) {
    case 'half_up':
      return twice >= divisor ? 1n : 0n;
    case 'half_even':
      if (twice !== divisor) return twice > divisor ? 1n : 0n;
      return quotient % 2n === 0n ? 0n : 1n;
    case 'down':
      return 0n;
    case 'up':
      return 1n;
  }
}

/**
 * Converte sem arredondar, e recusa com `requires-rounding` se sobrar casa. É o caminho da linha
 * de valor exato (2 un × R$ 5,00), que pela precondição de `RN-NUC-067` não depende de modo
 * publicado: quem compõe tenta este primeiro e só exige o modo quando ele recusa.
 */
export function exactToMoney(amount: ExactAmount): Outcome<Money> {
  if (!isFixed(amount, 'exact_amount')) return failure('invalid-value');
  if (amount.scale <= MONEY_SCALE) {
    return build('money_amount', amount.units * pow10(MONEY_SCALE - amount.scale), MONEY_SCALE);
  }
  const divisor = pow10(amount.scale - MONEY_SCALE);
  if (amount.units % divisor !== 0n) return failure('requires-rounding');
  return build('money_amount', amount.units / divisor, MONEY_SCALE);
}

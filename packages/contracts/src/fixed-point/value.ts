/**
 * Valor em ponto fixo: inteiro escalado em `BigInt` mais a escala, nunca `number`.
 *
 * Os três domínios de rede seguem `memory/plataforma/decision-dinheiro-e-quantidade.md`. O quarto,
 * `exact_amount`, é o produto exato de quantidade por preço antes do arredondamento: não tem forma
 * de rede e só sai daqui como dinheiro por `roundToMoney` ou `exactToMoney` (`RN-NUC-067`).
 *
 * Todo valor é não negativo. Fato de valor é positivo, e devolução é linha nova com valor positivo
 * (`.claude/rules/dados.md` §4); subtração não existe neste módulo.
 */

declare const brand: unique symbol;

export type WireDomain = 'money_amount' | 'unit_price' | 'quantity_value';
export type Domain = WireDomain | 'exact_amount';

export interface Fixed<D extends Domain> {
  readonly domain: D;
  /** Valor multiplicado por 10^scale. */
  readonly units: bigint;
  readonly scale: number;
  readonly [brand]: D;
}

export type Money = Fixed<'money_amount'>;
export type UnitPrice = Fixed<'unit_price'>;
export type Quantity = Fixed<'quantity_value'>;
export type ExactAmount = Fixed<'exact_amount'>;

/** Moeda de expoente 2 (`RN-NUC-058`); outro expoente é troca de envelope, não parâmetro. */
export const MONEY_SCALE = 2;

export type MoneyScale = typeof MONEY_SCALE;
export type UnitPriceScale = 0 | 1 | 2 | 3;
export type QuantityScale = 0 | 1 | 2 | 3;

export type ScaleOf<D extends WireDomain> = D extends 'money_amount'
  ? MoneyScale
  : D extends 'unit_price'
    ? UnitPriceScale
    : QuantityScale;

export type ErrorCode =
  | 'not-a-string'
  | 'empty'
  | 'whitespace'
  | 'plus-sign'
  | 'negative'
  | 'exponent'
  | 'malformed'
  | 'leading-zero'
  | 'scale-mismatch'
  | 'out-of-range'
  | 'invalid-scale'
  | 'invalid-value'
  | 'rounding-mode-missing'
  | 'rounding-mode-unknown'
  | 'requires-rounding'
  | 'allocation-exceeds-base';

export interface FixedPointError {
  readonly code: ErrorCode;
}

export type Outcome<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: FixedPointError };

interface Envelope {
  readonly scales: readonly number[];
  /** Teto exclusivo da parte inteira; `null` onde o domínio não tem teto próprio. */
  readonly integerLimit: bigint | null;
}

/**
 * `unit_price` não tem teto na decisão; adota o de `money_amount`, como a ilustração de
 * `docs/arquitetura/dinheiro-e-quantidade-2026-09-23.md:380-381`. `exact_amount` não tem teto: o
 * envelope de dinheiro é conferido quando ele vira dinheiro.
 */
const ENVELOPES: { readonly [D in Domain]: Envelope } = {
  money_amount: { scales: [MONEY_SCALE], integerLimit: 10n ** 12n },
  unit_price: { scales: [0, 1, 2, 3], integerLimit: 10n ** 12n },
  quantity_value: { scales: [0, 1, 2, 3], integerLimit: 10n ** 11n },
  exact_amount: { scales: [0, 1, 2, 3, 4, 5, 6], integerLimit: null },
};

export function pow10(exponent: number): bigint {
  return 10n ** BigInt(exponent);
}

export function success<T>(value: T): Outcome<T> {
  return { ok: true, value };
}

export function failure<T>(code: ErrorCode): Outcome<T> {
  return { ok: false, error: { code } };
}

// `hasOwn` porque o domínio de um chamador sem tipo pode ser `'toString'` ou `'__proto__'`.
function envelopeOf(domain: unknown): Envelope | undefined {
  return typeof domain === 'string' && Object.hasOwn(ENVELOPES, domain)
    ? ENVELOPES[domain as Domain]
    : undefined;
}

function scaleAllowed(domain: Domain, scale: unknown): scale is number {
  return typeof scale === 'number' && (envelopeOf(domain)?.scales.includes(scale) ?? false);
}

function withinEnvelope(domain: Domain, units: bigint, scale: number): boolean {
  const limit = ENVELOPES[domain].integerLimit;
  return units >= 0n && (limit === null || units < limit * pow10(scale));
}

/** Único ponto que cria valor. Fora do envelope, recusa; nunca trunca nem satura. */
export function build<D extends Domain>(domain: D, units: bigint, scale: number): Outcome<Fixed<D>> {
  if (!scaleAllowed(domain, scale)) return failure('invalid-scale');
  if (!withinEnvelope(domain, units, scale)) return failure(units < 0n ? 'negative' : 'out-of-range');
  return success(Object.freeze({ domain, units, scale }) as Fixed<D>);
}

/**
 * Chamador sem tipo (JavaScript, ou `as` por cima do compilador) pode entregar qualquer coisa. O
 * envelope é conferido de novo em cada entrada pública, porque valor forjado com unidade negativa
 * ou fora do teto quebraria as garantias de soma e de repartição sem nenhum sintoma.
 */
export function isFixed<D extends Domain>(candidate: unknown, domain: D): candidate is Fixed<D> {
  if (typeof candidate !== 'object' || candidate === null) return false;
  const shape = candidate as { domain?: unknown; units?: unknown; scale?: unknown };
  return (
    shape.domain === domain &&
    typeof shape.units === 'bigint' &&
    scaleAllowed(domain, shape.scale) &&
    withinEnvelope(domain, shape.units, shape.scale)
  );
}

export function allowedScale<D extends WireDomain>(domain: D, scale: unknown): scale is ScaleOf<D> {
  return scaleAllowed(domain, scale);
}

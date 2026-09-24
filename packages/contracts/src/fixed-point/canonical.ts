import {
  allowedScale,
  build,
  failure,
  isFixed,
  success,
  type Fixed,
  type Outcome,
  type ScaleOf,
  type WireDomain,
} from './value.js';

/**
 * Forma canônica de rede (`tarefas/T-0018-dinheiro-e-quantidade.md`, E.2, item 1): escala exata,
 * ponto como separador, sem expoente, sem sinal, sem zero à esquerda. A escala é declarada por
 * quem chama e nunca inferida da string. Entrada fora da forma é recusada, nunca normalizada: o
 * reenvio idempotente compara byte a byte, e normalizar faria duas grafias passarem pela mesma.
 */
const DIGITS_WITH_OPTIONAL_FRACTION = /^([0-9]+)(?:\.([0-9]+))?$/;
const WHITESPACE = /\s/;
const EXPONENT = /[eE]/;
/**
 * O maior teto de rede é 10^12, então parte inteira com mais de 12 dígitos já está fora de todos.
 * Recusar pelo comprimento antes do `BigInt` impede que uma string enorme custe a conversão; o teto
 * exato de cada domínio continua em `build`.
 */
const WIDEST_INTEGER_DIGITS = 12;

export function parse<D extends WireDomain>(
  domain: D,
  text: string,
  scale: ScaleOf<D>,
): Outcome<Fixed<D>> {
  if (!allowedScale(domain, scale)) return failure('invalid-scale');
  if (typeof text !== 'string') return failure('not-a-string');
  if (text === '') return failure('empty');
  if (WHITESPACE.test(text)) return failure('whitespace');
  if (text.startsWith('+')) return failure('plus-sign');
  if (text.startsWith('-')) return failure('negative');
  if (EXPONENT.test(text)) return failure('exponent');

  const match = DIGITS_WITH_OPTIONAL_FRACTION.exec(text);
  if (match === null) return failure('malformed');
  const integer = match[1] ?? '';
  const fraction = match[2] ?? '';

  if (integer.length > 1 && integer.startsWith('0')) return failure('leading-zero');
  if (fraction.length !== scale) return failure('scale-mismatch');
  if (integer.length > WIDEST_INTEGER_DIGITS) return failure('out-of-range');

  return build(domain, BigInt(integer + fraction), scale);
}

export function format<D extends WireDomain>(value: Fixed<D>): Outcome<string> {
  const domain = (value as { domain?: unknown } | null)?.domain;
  if (domain !== 'money_amount' && domain !== 'unit_price' && domain !== 'quantity_value') {
    return failure('invalid-value');
  }
  if (!isFixed(value, domain)) return failure('invalid-value');

  const { units, scale } = value;
  if (scale === 0) return success(units.toString());
  const digits = units.toString().padStart(scale + 1, '0');
  return success(`${digits.slice(0, -scale)}.${digits.slice(-scale)}`);
}

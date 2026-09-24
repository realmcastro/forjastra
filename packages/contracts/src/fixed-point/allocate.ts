import { MONEY_SCALE, build, failure, isFixed, success, type Money, type Outcome } from './value.js';

/**
 * Repartição de `RN-NUC-064` (`docs/produto/nucleo-venda-congelamento.md:16`): cada linha recebe a
 * parte inteira de V × Li / S, e as unidades que faltam vão às linhas de maior resto. Empate vai à
 * linha lançada primeiro, e a ordem de lançamento é a ordem de `lines`, que quem chama entrega.
 *
 * A soma das parcelas é sempre `amount`. Uma linha nunca recebe mais que o próprio valor, e linha
 * de valor zero recebe zero: ela tem resto zero, e há sempre ao menos tantos restos positivos
 * quanto unidades a distribuir.
 *
 * `amount` maior que a soma das linhas é recusado (`RN-NUC-064`, infeliz b), inclusive com soma
 * zero. `amount` zero sobre soma zero não divide nada e devolve zeros.
 */
export function allocateByLargestRemainder(
  amount: Money,
  lines: readonly Money[],
): Outcome<readonly Money[]> {
  if (!isFixed(amount, 'money_amount') || !Array.isArray(lines)) return failure('invalid-value');
  if (!lines.every((line) => isFixed(line, 'money_amount'))) return failure('invalid-value');

  const base = lines.reduce((total, line) => total + line.units, 0n);
  if (amount.units > base) return failure('allocation-exceeds-base');

  const shares = lines.map((line, order) => {
    const scaled = amount.units * line.units;
    return {
      order,
      units: base === 0n ? 0n : scaled / base,
      remainder: base === 0n ? 0n : scaled % base,
    };
  });

  let missing = amount.units - shares.reduce((total, share) => total + share.units, 0n);
  const byRemainder = [...shares].sort((a, b) =>
    a.remainder === b.remainder ? a.order - b.order : a.remainder > b.remainder ? -1 : 1,
  );
  for (const share of byRemainder) {
    if (missing === 0n) break;
    share.units += 1n;
    missing -= 1n;
  }

  const parcels: Money[] = [];
  for (const share of shares) {
    const parcel = build('money_amount', share.units, MONEY_SCALE);
    if (!parcel.ok) return parcel;
    parcels.push(parcel.value);
  }
  return success(parcels);
}

import { randomBytes } from 'node:crypto';

/**
 * `uuid` de 128 bits ordenado no tempo, no layout v7 (`D-04`).
 *
 * `PROVISION-E-VERIFY.md` §13.1 escolheu isto para `platform.tenants.tenant_id`, que é
 * `uuid NOT NULL` sem `DEFAULT`: a chave nasce na borda e o gerador nativo do Postgres produz
 * valor aleatório, que é a saída recusada. A mesma regra vale para
 * `platform.executor_events.event_id` (§19).
 *
 * O gerador de `apps/api/src/id/uuid-v7.ts` é este mesmo, e a duplicação é consciente: o executor é
 * um pacote separado, não há pacote compartilhado no repositório, e criar um decidiria monorepo por
 * acidente. Se os dois divergirem, o que manda é `D-04`.
 */

const MAX_SEQUENCE = 0x0fff;

let lastMillis = 0;
let sequence = 0;

/** Monotônico dentro do processo, inclusive se o relógio andar para trás. */
export function uuidV7(now: number = Date.now()): string {
  let millis: number;
  if (now > lastMillis) {
    lastMillis = now;
    sequence = 0;
    millis = now;
  } else {
    sequence += 1;
    if (sequence > MAX_SEQUENCE) {
      lastMillis += 1;
      sequence = 0;
    }
    millis = lastMillis;
  }

  const bytes = randomBytes(16);
  bytes.writeUIntBE(millis, 0, 6);
  // 4 bits de versão (7) + 12 bits de sequência, para ordenar dentro do mesmo milissegundo.
  bytes[6] = 0x70 | ((sequence >> 8) & 0x0f);
  bytes[7] = sequence & 0xff;
  // 2 bits de variante RFC 9562.
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;

  const hex = bytes.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

import { randomBytes } from 'node:crypto';

/**
 * `uuid` de 128 bits ordenado no tempo, no layout v7 (`D-04`).
 *
 * Existe aqui porque `D-04` escolheu o **tipo** da chave e deixou a geração como código:
 * um gerador só, em um arquivo só, é o que torna a troca de regra de geração um deploy em
 * vez de uma caçada. Usado hoje pelo identificador de requisição e pelo identificador de
 * fato de borda.
 *
 * **Não é** a identidade de idempotência da operação: essa nasce no terminal, offline,
 * antes de existir servidor (`RN-OFF-013`). O servidor nunca a cunha.
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

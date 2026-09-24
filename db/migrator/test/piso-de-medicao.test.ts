import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  ADMIN_URL,
  APP_CREDENTIAL_ROLE,
  comoPapel,
  createDatabase,
  motivoDeNaoConectar,
} from './support/postgres.js';

/**
 * Caso 50 de `CONTRATO.md` §14, e o `PAP-23`: **a suíte não fica verde quando ela não mediu nada.**
 *
 * O que a reauditoria mediu em 2026-09-12: contra um `postgres:16` sem
 * `POSTGRES_HOST_AUTH_METHOD=trust` — o padrão de qualquer container —, a suíte saía
 * `# pass 75 · # fail 0 · # cancelled 0 · # skipped 13`, **com saída `0`**, e os 12 pulados eram a
 * camada de papel inteira. Uma integração contínua que rode `npm test` ali fica verde tendo provado
 * **nada** sobre isolamento entre clientes, e uma reincidência de vazamento passa sem acusar.
 *
 * A correção do `PAP-17` tinha trocado "quebra ruidosamente" por "aprova em silêncio" — a mesma troca
 * dos três achados regressivos daquele gate. O motivo impresso em cada pulo continua certo e
 * continua honesto; o que faltava era **alguém cobrar o número**.
 *
 * **Este arquivo é quem cobra**, e ele falha em vez de pular, de propósito. Duas condições, e as duas
 * são exatamente as que produzem os 12 pulos:
 *
 * 1. existe um Postgres contra o qual rodar (`FORJA_MIGRATOR_TEST_ADMIN_URL`);
 * 2. esse Postgres aceita papel **sem senha**, porque senha em arquivo de teste seria segredo no
 *    repositório (`00-nucleo.md` §8) e o ator dos cenários de papel é um executor não-superusuário.
 *
 * **Não existe mais piso de pulos.** Ele era `1` — o teste do servidor antigo, que precisa de um 15 ao
 * lado —, e servido esse servidor o número certo passou a ser zero: com os dois servidores, `npm test`
 * reprova com qualquer pulo (`scripts/run-tests.mjs`, caso 59). Piso de pulados é o tipo de número que
 * alguém sobe quando incomoda, e aí ninguém mais olha para ele.
 *
 * **Não há variável para desligar isto.** Uma escape hatch acabaria configurada na integração
 * contínua no primeiro dia difícil, e aí a suíte volta a ficar verde sem medir. Quem quiser rodar só
 * a parte que não depende de banco usa `npm run test:no-db`, que é **bandeira de linha de comando**,
 * aparece no comando de quem rodou, e imprime que não é o gate.
 */
describe('o piso de medição da suíte', () => {
  test('existe um Postgres contra o qual medir', () => {
    assert.notEqual(
      ADMIN_URL,
      undefined,
      'FORJA_MIGRATOR_TEST_ADMIN_URL ausente: sem servidor, a camada de papel inteira é pulada e a ' +
        'suíte sairia 0 sem ter provado nada sobre isolamento entre clientes (PAP-23). Suba um ' +
        'postgres:16 descartável com POSTGRES_HOST_AUTH_METHOD=trust e aponte a variável para ele.',
    );
  });

  test('esse Postgres aceita papel sem senha, que é o que a camada de papel exige', async () => {
    assert.notEqual(ADMIN_URL, undefined);
    const db = await createDatabase();
    try {
      const motivo = await motivoDeNaoConectar(comoPapel(db.url, APP_CREDENTIAL_ROLE));
      assert.equal(
        motivo,
        undefined,
        'o servidor de teste exige senha, então a camada de papel inteira seria pulada e a suíte ' +
          'sairia sem medir isolamento (PAP-23) — medido em 2026-09-12 contra um 16 com ' +
          'scram-sha-256: 24 pulados de 109. Rode o servidor com POSTGRES_HOST_AUTH_METHOD=trust.',
      );
    } finally {
      await db.drop();
    }
  });
});

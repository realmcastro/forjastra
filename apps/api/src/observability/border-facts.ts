import { uuidV7 } from '../id/uuid-v7.js';
import type { ApiErrorCode } from '../errors.js';

/**
 * Fato de borda — invariante 10 aplicado ao que a fundação vê.
 *
 * O invariante manda capturar o que acontece na operação e **declarar as duas listas**: o
 * que se registra e o que deliberadamente não se registra. Seguem as duas.
 *
 * ## O que a borda registra
 *
 * | Fato | Responde a pergunta que não tem backfill |
 * |---|---|
 * | `request_rejected_no_identity` | um terminal ficou fora por identidade, ou ninguém tentou? |
 * | `request_rejected_scope_unresolved` | identidade provada e cliente não resolvido é **defeito de cadastro**, e sem o fato ele chega como "o sistema não abre" |
 * | `request_rejected_invalid_input` | que campo o terminal erra, em que rota — é o que separa versão velha de terminal de defeito nosso |
 * | `request_failed_internal` | quantas requisições morreram por defeito nosso, e em que rota |
 *
 * ## O que a borda **não** registra, e por quê
 *
 * - **Corpo, query e cabeçalho da requisição.** Carregam dado pessoal, podem carregar cartão
 *   e credencial. Limites 1 e 2 do invariante 10, e `seguranca.md` §3. Do campo reprovado
 *   guarda-se o **caminho**, nunca o valor.
 * - **A identificação apresentada** na tentativa de autenticação. Mesma razão pela qual o
 *   fato de recusa por identidade não a carrega ([[rule-recusa-por-identidade-tem-motivo-proprio]]).
 * - **Endereço de rede do chamador.** É dado pessoal e o invariante manda minimizar; o valor
 *   de diagnóstico existe, mas é de detecção de abuso, que não é o assunto do invariante 10.
 *   Falha fechado: não registra. Reabrir isso é decisão de `seguranca` + humano.
 * - **Requisição bem-sucedida.** Um fato por requisição atendida transforma a trilha em medida
 *   de recarga de tela ([[gotcha-artefato-corrente-colide-com-trilha-por-ocorrencia]]). O que
 *   acontece de negócio vira fato de negócio, no módulo, com regra dona. O acesso corrente
 *   fica no log de acesso, que **não é** trilha e não é retido como tal.
 * - **Rota desconhecida (404).** Não é fato de operação: é varredura ou terminal em versão
 *   velha, e os dois se diagnosticam pelo log de acesso.
 *
 * ## Onde isso é retido
 *
 * Em lugar nenhum, ainda: a residência da trilha é `D-06`, **ABERTA**
 * ([[decision-d-06-sao-tres-residencias-nao-uma]]). O destino padrão abaixo é a saída padrão
 * do processo, e **não é trilha** — não é retido, não é consultável e não prova nada.
 */

export type BorderFactKind =
  | 'request_rejected_no_identity'
  | 'request_rejected_scope_unresolved'
  | 'request_rejected_invalid_input'
  | 'request_failed_internal';

export interface BorderFact {
  readonly factId: string;
  readonly kind: BorderFactKind;
  /** Instante em que o fato aconteceu. Nasce no servidor, então não há o par de `D-04`. */
  readonly occurredAt: string;
  readonly requestId: string;
  readonly method: string;
  /** Padrão da rota (`/orders/:id`), nunca a URL crua — query string carrega dado. */
  readonly routePattern: string;
  readonly errorCode: ApiErrorCode;
  /** Caminho do campo reprovado. Nunca o valor. */
  readonly field?: string;
  /** Só quando já resolvido. Ausente é o caso normal dos dois primeiros fatos. */
  readonly tenantId?: string;
  /** `SQLSTATE` ou classe do erro. Nunca a mensagem do banco. */
  readonly internalDetail?: string;
}

export interface BorderFactSink {
  readonly name: string;
  record(fact: BorderFact): void;
}

export interface NewBorderFact {
  readonly kind: BorderFactKind;
  readonly requestId: string;
  readonly method: string;
  readonly routePattern: string;
  readonly errorCode: ApiErrorCode;
  readonly field?: string | undefined;
  readonly tenantId?: string | undefined;
  readonly internalDetail?: string | undefined;
}

let droppedFacts = 0;

/** Quantos fatos o destino não aceitou desde que o processo subiu. */
export function droppedBorderFactCount(): number {
  return droppedFacts;
}

/**
 * **Nunca lança e nunca bloqueia.** Terceiro limite do invariante 10: falha ao registrar não
 * derruba a operação. Aqui a falha vira contador, porque o destino que falhou é o mesmo que
 * receberia o fato sobre a falha.
 */
export function emitBorderFact(sink: BorderFactSink, fact: NewBorderFact): void {
  try {
    sink.record({
      factId: uuidV7(),
      occurredAt: new Date().toISOString(),
      kind: fact.kind,
      requestId: fact.requestId,
      method: fact.method,
      routePattern: fact.routePattern,
      errorCode: fact.errorCode,
      ...(fact.field === undefined ? {} : { field: fact.field }),
      ...(fact.tenantId === undefined ? {} : { tenantId: fact.tenantId }),
      ...(fact.internalDetail === undefined ? {} : { internalDetail: fact.internalDetail }),
    });
  } catch {
    droppedFacts += 1;
  }
}

/** Destino padrão: uma linha JSON na saída padrão. Não é trilha (ver o topo do arquivo). */
export const stdoutFactSink: BorderFactSink = {
  name: 'stdout',
  record(fact: BorderFact): void {
    process.stdout.write(`${JSON.stringify({ borderFact: fact })}\n`);
  },
};

/** Descarta em silêncio. Existe para teste, e para quem precisar desligar com intenção. */
export const nullFactSink: BorderFactSink = {
  name: 'null',
  record(): void {},
};

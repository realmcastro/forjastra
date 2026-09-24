/**
 * Forma única e estável de erro da API (`backend.md` §3).
 *
 * O contrato com o chamador é o `code`. A `message` é texto de diagnóstico para humano e
 * pode mudar sem aviso — cliente que ramifica por `message` está errado por construção.
 *
 * Nada aqui carrega stack, SQL, nome de schema, nome de restrição, valor recebido nem
 * identificador de outro cliente. O que o servidor sabe e não diz fica no fato de borda
 * (`observability/border-facts.ts`), correlacionado pelo `requestId`.
 */

/**
 * Lista fechada. Ela **não é** o domínio `operation_refused` de
 * `docs/produto/fatos-de-operacao-dominios-fechados.md` §1.1: aquele enumera por que uma
 * operação de negócio foi recusada, e é de `produto`. Este enumera por que uma requisição
 * não passou da borda. Misturar os dois é o encaixe de
 * [[gotcha-motivo-enumerado-que-engole-dois-diagnosticos]].
 */
export const API_ERROR_CODES = [
  /** Entrada reprovada pelo schema da borda. Único código que carrega `field`. */
  'invalid_request',
  /** Nenhuma identidade provada chegou. Não diz se faltou credencial ou se ela não serve. */
  'identity_not_established',
  /** Identidade provada, nenhum cliente resolvido para ela. */
  'scope_not_resolved',
  /** O papel não alcança a **operação**. Nunca dito sobre objeto de outro escopo. */
  'operation_not_permitted',
  /**
   * Não existe no escopo resolvido. `RN-NUC-038` (b): "não existe aqui" e "existe em outro
   * escopo" são a **mesma** resposta, inclusive entre estabelecimentos do mesmo cliente.
   * Também é a resposta a rota desconhecida, para não enumerar superfície.
   */
  'not_found',
  /** Capacidade não contratada ou módulo desligado (`backend.md` §2). Nunca 500, nunca vazio. */
  'capability_unavailable',
  /**
   * Duas operações distintas chegaram com a mesma identidade de idempotência
   * (`RN-OFF-013`, infeliz). É defeito crítico de construção, não caso de negócio: o reenvio
   * legítimo da **mesma** operação devolve o mesmo resultado e nunca chega aqui.
   */
  'identity_collision',
  'payload_too_large',
  'unsupported_media_type',
  /** A consulta passou do teto de tempo. Distinto de "serviço fora" porque a decisão de retentar do terminal é outra. */
  'timed_out',
  'service_unavailable',
  'internal_error',
] as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[number];

const STATUS_BY_CODE: Readonly<Record<ApiErrorCode, number>> = {
  invalid_request: 400,
  identity_not_established: 401,
  scope_not_resolved: 403,
  operation_not_permitted: 403,
  not_found: 404,
  capability_unavailable: 409,
  identity_collision: 409,
  payload_too_large: 413,
  unsupported_media_type: 415,
  timed_out: 504,
  service_unavailable: 503,
  internal_error: 500,
};

const MESSAGE_BY_CODE: Readonly<Record<ApiErrorCode, string>> = {
  invalid_request: 'Requisição inválida.',
  identity_not_established: 'Identidade não estabelecida.',
  scope_not_resolved: 'Nenhum cliente resolvido para esta identidade.',
  operation_not_permitted: 'Operação não permitida.',
  not_found: 'Não encontrado.',
  capability_unavailable: 'Capacidade indisponível.',
  identity_collision: 'Identidade de operação já usada por outra operação.',
  payload_too_large: 'Conteúdo acima do limite aceito.',
  unsupported_media_type: 'Tipo de conteúdo não aceito.',
  timed_out: 'A operação passou do tempo limite.',
  service_unavailable: 'Serviço indisponível no momento.',
  internal_error: 'Erro interno.',
};

export interface ApiErrorOptions {
  /** Caminho do campo reprovado. O **caminho**, nunca o valor. */
  readonly field?: string | undefined;
  /** Só para o fato de borda e para o log do servidor. Nunca serializado. */
  readonly internalDetail?: string | undefined;
  readonly cause?: unknown;
}

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;
  readonly field: string | undefined;
  readonly internalDetail: string | undefined;

  constructor(code: ApiErrorCode, options: ApiErrorOptions = {}) {
    super(MESSAGE_BY_CODE[code], options.cause === undefined ? undefined : { cause: options.cause });
    this.name = 'ApiError';
    this.code = code;
    this.status = STATUS_BY_CODE[code];
    this.field = options.field;
    this.internalDetail = options.internalDetail;
  }
}

export function isApiError(value: unknown): value is ApiError {
  return value instanceof ApiError;
}

export interface ErrorBody {
  readonly error: {
    readonly code: ApiErrorCode;
    readonly message: string;
    readonly field?: string;
    /** Devolvido para o operador poder citar o caso sem que o servidor conte nada. */
    readonly requestId: string;
  };
}

export function toErrorBody(error: ApiError, requestId: string): ErrorBody {
  return {
    error: {
      code: error.code,
      message: MESSAGE_BY_CODE[error.code],
      ...(error.field === undefined ? {} : { field: error.field }),
      requestId,
    },
  };
}

import { ApiError, type ApiErrorCode } from '../errors.js';

/**
 * Traduz erro do Postgres para a forma única de erro, sem vazar nada.
 *
 * A mensagem do Postgres **carrega valor de linha** — `duplicate key value violates unique
 * constraint "..." DETAIL: Key (document)=(...) already exists` entrega documento de pessoa
 * e nome de restrição. Nada dela atravessa: só o `SQLSTATE` sobrevive, e só para o fato de
 * borda e para o log do servidor.
 */

interface PostgresErrorShape {
  readonly code: string;
}

function sqlstateOf(error: unknown): string | null {
  if (typeof error !== 'object' || error === null) return null;
  const code = (error as Partial<PostgresErrorShape>).code;
  return typeof code === 'string' && /^[0-9A-Z]{5}$/.test(code) ? code : null;
}

const CODE_BY_SQLSTATE: Readonly<Record<string, ApiErrorCode>> = {
  // 23505 unique_violation. Sendo a chave primária a identidade de idempotência (`D-04`),
  // a colisão que `RN-OFF-013` manda detectar chega por aqui. A rota que move dinheiro
  // **tem** que tentar o reenvio idêntico antes: ver `identity_collision` em `errors.ts`.
  '23505': 'identity_collision',
  '23502': 'invalid_request', // not_null_violation
  '23503': 'invalid_request', // foreign_key_violation
  '23514': 'invalid_request', // check_violation
  '22001': 'invalid_request', // string_data_right_truncation
  '57014': 'timed_out', // query_canceled (statement_timeout)
  '53300': 'service_unavailable', // too_many_connections
  '08000': 'service_unavailable',
  '08003': 'service_unavailable',
  '08006': 'service_unavailable',
  '08001': 'service_unavailable',
  '08004': 'service_unavailable',
  // Os três abaixo são defeito nosso e nunca caso de negócio: 42501 é a fronteira de
  // privilégio de `db/papeis-e-credencial.md` disparando, 3F000/3D000 é drift de schema
  // (`migrations.md` §9). Vão como erro interno para fora e gritam para dentro.
  '42501': 'internal_error',
  '3F000': 'internal_error',
  '3D000': 'internal_error',
};

/** `SQLSTATE` que indicam defeito de construção ou de operação, não entrada do chamador. */
const ALARMING_SQLSTATES: ReadonlySet<string> = new Set(['42501', '3F000', '3D000', '42P01', '42703']);

export function isAlarmingSqlstate(sqlstate: string): boolean {
  return ALARMING_SQLSTATES.has(sqlstate);
}

/** Devolve `null` quando o erro não é do Postgres — quem chama decide o que fazer. */
export function apiErrorFromPostgres(error: unknown): ApiError | null {
  const sqlstate = sqlstateOf(error);
  if (sqlstate === null) return null;
  const code = CODE_BY_SQLSTATE[sqlstate] ?? 'internal_error';
  return new ApiError(code, {
    internalDetail: `sqlstate=${sqlstate}`,
    cause: error,
  });
}

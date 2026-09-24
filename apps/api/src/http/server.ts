import Fastify, { type FastifyRequest } from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import './augmentations.js';

import { ApiError, isApiError, toErrorBody, type ApiErrorCode } from '../errors.js';
import { uuidV7 } from '../id/uuid-v7.js';
import { apiErrorFromPostgres, isAlarmingSqlstate } from '../db/pg-error.js';
import type { RootDb } from '../db/tenant-db.js';
import { tenantTransactionRunner } from '../db/tenant-role.js';
import { identityUndecided, type IdentityProvider } from '../identity/principal.js';
import { tenantDirectoryUndecided, type TenantDirectory, type TenantContext } from '../tenant/context.js';
import {
  emitBorderFact,
  stdoutFactSink,
  type BorderFactKind,
  type BorderFactSink,
} from '../observability/border-facts.js';
import type { HttpConfig } from '../config.js';

export type ForjaServer = ReturnType<typeof buildServer>;

export interface ServerDeps {
  readonly http: HttpConfig;
  readonly rootDb: RootDb;
  readonly logLevel?: string;
  /** Enquanto `D-03` estiver aberta, o padrão recusa tudo, e isso é a política, não a falta dela. */
  readonly identityProvider?: IdentityProvider;
  readonly tenantDirectory?: TenantDirectory;
  readonly factSink?: BorderFactSink;
}

const FACT_KIND_BY_ERROR_CODE: Readonly<Partial<Record<ApiErrorCode, BorderFactKind>>> = {
  identity_not_established: 'request_rejected_no_identity',
  scope_not_resolved: 'request_rejected_scope_unresolved',
  invalid_request: 'request_rejected_invalid_input',
  internal_error: 'request_failed_internal',
  service_unavailable: 'request_failed_internal',
  timed_out: 'request_failed_internal',
};

/** Caminho do campo, nunca o valor. `/items/0/quantity` vira `items.0.quantity`. */
function fieldPathOf(instancePath: string, missingProperty: unknown): string | undefined {
  const base = instancePath.replace(/^\//, '').replaceAll('/', '.');
  if (typeof missingProperty === 'string' && missingProperty !== '') {
    return base === '' ? missingProperty : `${base}.${missingProperty}`;
  }
  return base === '' ? undefined : base;
}

function routePatternOf(request: FastifyRequest): string {
  return request.routeOptions.url ?? '(rota desconhecida)';
}

/**
 * Traduz qualquer coisa que chegue ao manipulador de erro para a forma única.
 *
 * O ramo final é o que importa: erro que não reconhecemos vira `internal_error` opaco. Nunca
 * `error.message`, porque a mensagem pode ter vindo do Postgres com valor de linha dentro.
 */
function normalizeError(error: unknown): ApiError {
  if (isApiError(error)) return error;

  const fromPostgres = apiErrorFromPostgres(error);
  if (fromPostgres !== null) return fromPostgres;

  if (typeof error === 'object' && error !== null && 'code' in error) {
    const fastifyCode = (error as { code?: unknown }).code;
    switch (fastifyCode) {
      case 'FST_ERR_CTP_BODY_TOO_LARGE':
        return new ApiError('payload_too_large', { cause: error });
      case 'FST_ERR_CTP_INVALID_MEDIA_TYPE':
        return new ApiError('unsupported_media_type', { cause: error });
      case 'FST_ERR_CTP_EMPTY_JSON_BODY':
      case 'FST_ERR_CTP_INVALID_JSON_BODY':
      case 'FST_ERR_CTP_INVALID_CONTENT_LENGTH':
        return new ApiError('invalid_request', { cause: error });
      default:
        break;
    }
  }

  return new ApiError('internal_error', {
    internalDetail: error instanceof Error ? error.name : typeof error,
    cause: error,
  });
}

export function buildServer(deps: ServerDeps) {
  const identityProvider = deps.identityProvider ?? identityUndecided;
  const tenantDirectory = deps.tenantDirectory ?? tenantDirectoryUndecided;
  const factSink = deps.factSink ?? stdoutFactSink;

  const app = Fastify({
    // O identificador é sempre nosso. Aceitá-lo por cabeçalho deixaria o chamador escolher a
    // chave de correlação do nosso log, que é o suficiente para embaralhar diagnóstico.
    requestIdHeader: false,
    genReqId: () => uuidV7(),
    bodyLimit: deps.http.bodyLimitBytes,
    logger: {
      level: deps.logLevel ?? 'info',
      serializers: {
        // Sem URL crua (query string carrega dado), sem cabeçalho, sem corpo.
        req(request: FastifyRequest) {
          return {
            id: request.id,
            method: request.method,
            route: request.routeOptions.url ?? '(rota desconhecida)',
          };
        },
      },
    },
    ajv: {
      customOptions: {
        // `"5"` não vira `5`. Coerção silenciosa é como quantidade e dinheiro chegam errados.
        coerceTypes: false,
        // Valor que ninguém enviou não nasce aqui.
        useDefaults: false,
        // Campo a mais é recusado pelo schema, nunca removido em silêncio: apagar esconde
        // terminal em versão incompatível.
        removeAdditional: false,
        allErrors: false,
      },
    },
    schemaErrorFormatter(errors) {
      const first = errors[0];
      const field =
        first === undefined
          ? undefined
          : fieldPathOf(first.instancePath, (first.params as { missingProperty?: unknown }).missingProperty);
      return new ApiError('invalid_request', { field, internalDetail: first?.keyword });
    },
  }).withTypeProvider<TypeBoxTypeProvider>();

  app.addHook('onRequest', async (request, reply) => {
    void reply.header('x-request-id', request.id);
  });

  /**
   * A borda: identidade uma vez, cliente uma vez, contexto injetado (`backend.md` §1).
   *
   * O cliente sai da identidade autenticada e do registro da plataforma. Nada de `body`,
   * `query`, cabeçalho ou path entra nesta decisão — e não entra por **assinatura**: o
   * diretório recebe o `Principal` e mais nada.
   */
  app.addHook('onRequest', async (request) => {
    if (request.routeOptions.config.anonymous === true) return;

    const principal = await identityProvider.authenticate({
      method: request.method,
      headers: request.headers,
    });
    if (principal === null) throw new ApiError('identity_not_established');
    request.principal = principal;

    const identification = await tenantDirectory.resolve(principal);
    if (identification === null) throw new ApiError('scope_not_resolved');

    request.tenant = {
      tenantId: identification.tenantId,
      schemaName: identification.schemaName,
      // O nome do papel e a forma do schema são conferidos aqui, na borda, antes de existir
      // consulta. Nenhuma conexão é tomada do pool neste ponto: a transação nasce quando a
      // rota pedir, e só então.
      transaction: tenantTransactionRunner(deps.rootDb, identification.schemaName),
    };
  });

  // Rota desconhecida responde como objeto inexistente. Mesma resposta, nenhuma enumeração.
  app.setNotFoundHandler((request, reply) => {
    const error = new ApiError('not_found');
    void reply.status(error.status).send(toErrorBody(error, request.id));
  });

  app.setErrorHandler((error, request, reply) => {
    const apiError = normalizeError(error);

    // Rota que não casou não é tentativa de operação: é varredura ou terminal em versão
    // velha. Sem esta guarda, qualquer um sem credencial enche a série de fatos de fora,
    // porque a recusa por identidade acontece antes de o 404 existir.
    const rotaCasou = request.routeOptions.url !== undefined;
    const factKind = rotaCasou ? FACT_KIND_BY_ERROR_CODE[apiError.code] : undefined;
    if (factKind !== undefined) {
      emitBorderFact(factSink, {
        kind: factKind,
        requestId: request.id,
        method: request.method,
        routePattern: routePatternOf(request),
        errorCode: apiError.code,
        field: apiError.field,
        tenantId: request.tenant?.tenantId,
        internalDetail: apiError.internalDetail,
      });
    }

    const sqlstate = apiError.internalDetail?.startsWith('sqlstate=') === true
      ? apiError.internalDetail.slice('sqlstate='.length)
      : undefined;

    if (apiError.status >= 500) {
      // Do erro do banco vai só o `SQLSTATE`; de erro nosso vai a pilha, que é o que conserta
      // defeito. Mensagem do Postgres não entra em log nenhum (`pg-error.ts`).
      request.log.error(
        {
          code: apiError.code,
          detail: apiError.internalDetail,
          alarming: sqlstate !== undefined && isAlarmingSqlstate(sqlstate),
          stack: sqlstate === undefined && error instanceof Error ? error.stack : undefined,
        },
        'requisição falhou',
      );
    } else {
      request.log.warn({ code: apiError.code, field: apiError.field }, 'requisição recusada');
    }

    void reply.status(apiError.status).send(toErrorBody(apiError, request.id));
  });

  /**
   * Única rota desta fundação, e ela é anônima. Diz que o processo responde, e nada mais:
   * sem versão, sem estado de banco, sem contagem. Ainda assim é superfície pública, então
   * passa pelo gate 3 antes de ser exposta fora de `127.0.0.1`.
   */
  app.get('/health', { config: { anonymous: true } }, async () => ({ status: 'ok' }));

  return app;
}

/**
 * Para rota que sabe que não é anônima. Falha fechado: contexto ausente aqui é defeito de
 * composição, não caso de negócio, e vira erro interno em vez de consulta sem escopo.
 */
export function tenantOf(request: FastifyRequest): TenantContext {
  const tenant = request.tenant;
  if (tenant === undefined) {
    throw new ApiError('internal_error', { internalDetail: 'rota sem contexto de cliente' });
  }
  return tenant;
}

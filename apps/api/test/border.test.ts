import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Type } from '@sinclair/typebox';
import { DummyDriver, Kysely, PostgresAdapter, PostgresIntrospector, PostgresQueryCompiler } from 'kysely';

import { buildServer, tenantOf } from '../src/http/server.js';
import type { RootDb, TenantDatabase } from '../src/db/tenant-db.js';
import type { IdentityProvider, Principal } from '../src/identity/principal.js';
import type { TenantDirectory } from '../src/tenant/context.js';
import type { BorderFact, BorderFactSink } from '../src/observability/border-facts.js';

/**
 * Duplo de raiz. A conversão é o que a marca de `RootDb` obriga, e é para isto que ela serve:
 * fora de `createRootDb`, ninguém produz uma raiz sem dizer que está produzindo uma.
 */
function raiz(): RootDb {
  return new Kysely<TenantDatabase>({
    dialect: {
      createAdapter: () => new PostgresAdapter(),
      createDriver: () => new DummyDriver(),
      createIntrospector: (db) => new PostgresIntrospector(db),
      createQueryCompiler: () => new PostgresQueryCompiler(),
    },
  }) as RootDb;
}

/** `D-03` está aberta, então o duplo é do teste e nada além dele o registra. */
const PRINCIPAL_DE_TESTE = { subject: 'duplo-de-teste' } as unknown as Principal;

const identidadeProvada: IdentityProvider = {
  name: 'duplo',
  authenticate: () => Promise.resolve(PRINCIPAL_DE_TESTE),
};

const diretorioDeAcme: TenantDirectory = {
  name: 'duplo',
  resolve: () => Promise.resolve({ tenantId: '0199c0de-0000-7000-8000-000000000001', schemaName: 't_acme' }),
};

const diretorioVazio: TenantDirectory = {
  name: 'duplo',
  resolve: () => Promise.resolve(null),
};

function coletor(): BorderFactSink & { fatos: BorderFact[] } {
  const fatos: BorderFact[] = [];
  return { name: 'coletor', fatos, record: (fato) => void fatos.push(fato) };
}

function servidor(opcoes: Partial<Parameters<typeof buildServer>[0]> = {}) {
  return buildServer({
    http: { host: '127.0.0.1', port: 0, bodyLimitBytes: 4096 },
    rootDb: raiz(),
    logLevel: 'silent',
    ...opcoes,
  });
}

test('/health responde sem identidade, e não conta nada além de estar de pé', async () => {
  const app = servidor();
  const resposta = await app.inject({ method: 'GET', url: '/health' });
  assert.equal(resposta.statusCode, 200);
  assert.deepEqual(resposta.json(), { status: 'ok' });
  await app.close();
});

test('toda rota nasce exigindo identidade: sem D-03 fechada, é recusa', async () => {
  const fatos = coletor();
  const app = servidor({ factSink: fatos });
  app.get('/protegida', async () => ({ ok: true }));

  const resposta = await app.inject({ method: 'GET', url: '/protegida' });
  assert.equal(resposta.statusCode, 401);
  assert.equal(resposta.json().error.code, 'identity_not_established');
  assert.equal(fatos.fatos.length, 1);
  assert.equal(fatos.fatos[0]!.kind, 'request_rejected_no_identity');
  assert.equal(fatos.fatos[0]!.routePattern, '/protegida');
  await app.close();
});

test('identidade provada sem cliente resolvido é recusa própria, não 500 nem dado vazio', async () => {
  const fatos = coletor();
  const app = servidor({
    identityProvider: identidadeProvada,
    tenantDirectory: diretorioVazio,
    factSink: fatos,
  });
  app.get('/protegida', async () => ({ ok: true }));

  const resposta = await app.inject({ method: 'GET', url: '/protegida' });
  assert.equal(resposta.statusCode, 403);
  assert.equal(resposta.json().error.code, 'scope_not_resolved');
  assert.equal(fatos.fatos[0]!.kind, 'request_rejected_scope_unresolved');
  await app.close();
});

test('o contexto chega injetado, e o que ele entrega é a transação do cliente', async () => {
  const app = servidor({ identityProvider: identidadeProvada, tenantDirectory: diretorioDeAcme });
  app.get('/protegida', async (request) => {
    const tenant = tenantOf(request);
    // Não existe handle pronto para consultar no contexto: o alcance ao schema vem do papel,
    // e papel só se assume dentro de transação (`db/tenant-role.ts`).
    const dentroDaTransacao = await tenant.transaction(async (db) => typeof db);
    return { schemaName: tenant.schemaName, tenantId: tenant.tenantId, dentroDaTransacao };
  });

  const resposta = await app.inject({ method: 'GET', url: '/protegida' });
  assert.equal(resposta.statusCode, 200);
  assert.equal(resposta.json().schemaName, 't_acme');
  assert.equal(resposta.json().dentroDaTransacao, 'object');
  await app.close();
});

test('o cliente NÃO sai do que o chamador manda: cabeçalho, query e path são ignorados', async () => {
  const app = servidor({ identityProvider: identidadeProvada, tenantDirectory: diretorioDeAcme });
  app.get('/protegida/:tenant', async (request) => ({ schemaName: tenantOf(request).schemaName }));

  const resposta = await app.inject({
    method: 'GET',
    url: '/protegida/t_vitima?tenant=t_vitima',
    headers: { 'x-tenant': 't_vitima', 'x-forja-tenant': 't_vitima' },
  });
  assert.equal(resposta.json().schemaName, 't_acme');
  await app.close();
});

test('entrada reprovada devolve o caminho do campo e nunca o valor recebido', async () => {
  const fatos = coletor();
  const app = servidor({
    identityProvider: identidadeProvada,
    tenantDirectory: diretorioDeAcme,
    factSink: fatos,
  });
  app.post(
    '/protegida',
    {
      schema: {
        body: Type.Object(
          { quantity: Type.Integer({ minimum: 1 }) },
          { additionalProperties: false },
        ),
      },
    },
    async () => ({ ok: true }),
  );

  const resposta = await app.inject({
    method: 'POST',
    url: '/protegida',
    payload: { quantity: 'segredo-do-cliente' },
  });
  assert.equal(resposta.statusCode, 400);
  assert.equal(resposta.json().error.code, 'invalid_request');
  assert.equal(resposta.json().error.field, 'quantity');
  assert.equal(resposta.body.includes('segredo-do-cliente'), false);
  assert.equal(fatos.fatos[0]!.kind, 'request_rejected_invalid_input');
  assert.equal(fatos.fatos[0]!.field, 'quantity');
  await app.close();
});

test('campo obrigatório ausente é nomeado; campo a mais é recusado, não removido em silêncio', async () => {
  const app = servidor({ identityProvider: identidadeProvada, tenantDirectory: diretorioDeAcme });
  app.post(
    '/protegida',
    {
      schema: {
        body: Type.Object({ quantity: Type.Integer() }, { additionalProperties: false }),
      },
    },
    async () => ({ ok: true }),
  );

  const ausente = await app.inject({ method: 'POST', url: '/protegida', payload: {} });
  assert.equal(ausente.json().error.field, 'quantity');

  const aMais = await app.inject({
    method: 'POST',
    url: '/protegida',
    payload: { quantity: 1, extra: true },
  });
  assert.equal(aMais.statusCode, 400);
  await app.close();
});

test('não há coerção de tipo: "1" não vira 1', async () => {
  const app = servidor({ identityProvider: identidadeProvada, tenantDirectory: diretorioDeAcme });
  app.post(
    '/protegida',
    { schema: { body: Type.Object({ quantity: Type.Integer() }, { additionalProperties: false }) } },
    async () => ({ ok: true }),
  );

  const resposta = await app.inject({ method: 'POST', url: '/protegida', payload: { quantity: '1' } });
  assert.equal(resposta.statusCode, 400);
  await app.close();
});

test('erro inesperado vira erro interno opaco: nada de pilha, mensagem ou nome interno', async () => {
  const fatos = coletor();
  const app = servidor({
    identityProvider: identidadeProvada,
    tenantDirectory: diretorioDeAcme,
    factSink: fatos,
  });
  app.get('/protegida', async () => {
    throw new Error('senha do banco no texto do erro, em t_acme.orders');
  });

  const resposta = await app.inject({ method: 'GET', url: '/protegida' });
  assert.equal(resposta.statusCode, 500);
  assert.equal(resposta.json().error.code, 'internal_error');
  assert.equal(resposta.body.includes('senha do banco'), false);
  assert.equal(resposta.body.includes('t_acme'), false);
  assert.equal(resposta.body.includes('stack'), false);
  assert.equal(fatos.fatos[0]!.kind, 'request_failed_internal');
  await app.close();
});

test('erro do Postgres não vaza SQL, restrição nem valor de linha', async () => {
  const app = servidor({ identityProvider: identidadeProvada, tenantDirectory: diretorioDeAcme });
  app.get('/protegida', async () => {
    throw Object.assign(new Error('duplicate key value violates unique constraint "orders_pkey"'), {
      code: '23505',
      detail: 'Key (id)=(0199c0de-0000-7000-8000-000000000009) already exists.',
      schema: 't_acme',
      table: 'orders',
      constraint: 'orders_pkey',
    });
  });

  const resposta = await app.inject({ method: 'GET', url: '/protegida' });
  assert.equal(resposta.statusCode, 409);
  assert.equal(resposta.json().error.code, 'identity_collision');
  for (const vazamento of ['orders_pkey', 't_acme', 'duplicate key', '0199c0de']) {
    assert.equal(resposta.body.includes(vazamento), false, vazamento);
  }
  await app.close();
});

test('privilégio negado no banco vira erro interno opaco, nunca 403 de negócio', async () => {
  const app = servidor({ identityProvider: identidadeProvada, tenantDirectory: diretorioDeAcme });
  app.get('/protegida', async () => {
    throw Object.assign(new Error('permission denied for schema platform'), { code: '42501' });
  });

  const resposta = await app.inject({ method: 'GET', url: '/protegida' });
  assert.equal(resposta.statusCode, 500);
  assert.equal(resposta.json().error.code, 'internal_error');
  assert.equal(resposta.body.includes('platform'), false);
  await app.close();
});

test('rota desconhecida responde como objeto inexistente, sem enumerar superfície', async () => {
  const app = servidor({ identityProvider: identidadeProvada, tenantDirectory: diretorioDeAcme });
  const resposta = await app.inject({ method: 'GET', url: '/nao-existe' });
  assert.equal(resposta.statusCode, 404);
  assert.equal(resposta.json().error.code, 'not_found');
  await app.close();
});

test('o identificador da requisição é nosso, e o cabeçalho do chamador não o escolhe', async () => {
  const app = servidor();
  const resposta = await app.inject({
    method: 'GET',
    url: '/health',
    headers: { 'request-id': 'escolhido-pelo-chamador', 'x-request-id': 'escolhido-pelo-chamador' },
  });
  const devolvido = resposta.headers['x-request-id'];
  assert.notEqual(devolvido, 'escolhido-pelo-chamador');
  assert.match(String(devolvido), /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  await app.close();
});

test('todo corpo de erro tem a mesma forma, com o identificador para o operador citar', async () => {
  const app = servidor();
  const resposta = await app.inject({ method: 'GET', url: '/nao-existe' });
  const corpo = resposta.json() as { error: Record<string, unknown> };
  assert.deepEqual(Object.keys(corpo), ['error']);
  assert.deepEqual(Object.keys(corpo.error).sort(), ['code', 'message', 'requestId']);
  assert.equal(corpo.error['requestId'], resposta.headers['x-request-id']);
  await app.close();
});

test('corpo acima do teto é recusado pela forma única, não pelo erro cru do framework', async () => {
  const app = servidor({ identityProvider: identidadeProvada, tenantDirectory: diretorioDeAcme });
  app.post('/protegida', async () => ({ ok: true }));

  const resposta = await app.inject({
    method: 'POST',
    url: '/protegida',
    headers: { 'content-type': 'application/json' },
    payload: JSON.stringify({ a: 'x'.repeat(8192) }),
  });
  assert.equal(resposta.statusCode, 413);
  assert.equal(resposta.json().error.code, 'payload_too_large');
  await app.close();
});

test('varredura de rota inexistente não enche a série de fatos de borda', async () => {
  const fatos = coletor();
  const app = servidor({ factSink: fatos });
  app.get('/protegida', async () => ({ ok: true }));

  // Sem identidade, a recusa acontece antes de o 404 existir — e é justamente por isso que
  // quem varre o servidor não pode produzir fato.
  for (const url of ['/admin', '/.env', '/wp-login.php']) {
    const resposta = await app.inject({ method: 'GET', url });
    assert.equal(resposta.statusCode, 401);
  }
  assert.equal(fatos.fatos.length, 0);

  // Rota que existe continua produzindo o fato.
  await app.inject({ method: 'GET', url: '/protegida' });
  assert.equal(fatos.fatos.length, 1);
  await app.close();
});

import 'fastify';
import type { Principal } from '../identity/principal.js';
import type { TenantContext } from '../tenant/context.js';

declare module 'fastify' {
  interface FastifyRequest {
    /**
     * O cliente resolvido para esta requisição. Ausente em rota anônima, e **só** nela.
     *
     * É opcional de propósito: com `strict` ligado, a rota que esquecer de tratar a ausência
     * não compila. `tenantOf()` existe para a rota que sabe que não é anônima.
     */
    tenant?: TenantContext;
    /** Opaco (`D-03`). A fundação nunca lê dentro. */
    principal?: Principal;
  }

  interface FastifyContextConfig {
    /**
     * Dispensa identidade e cliente **nesta** rota. Ausente é o padrão, e o padrão é exigir
     * os dois: rota nova nasce fechada sem ninguém precisar lembrar.
     */
    anonymous?: boolean;
  }
}

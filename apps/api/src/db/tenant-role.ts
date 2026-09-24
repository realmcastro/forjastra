import { sql } from 'kysely';
import { assertTenantSchemaName } from '../tenant/schema-name.js';
import { tenantDb, type RootDb, type TenantDb } from './tenant-db.js';

/**
 * O papel de banco do cliente, assumido por transação.
 *
 * **Por que esta camada existe** ([[decision-papel-de-aplicacao-assumido-por-transacao]]): uma
 * migration pode criar função que, disparada pelo caixa a cada venda, escreve no schema de
 * **outro cliente**. Nenhum crivo de texto fecha isso, porque dentro do corpo de função a
 * linguagem deixa de ser SQL. Com papel de aplicação único, o vazamento acontece **e a venda
 * conclui com sucesso**; com papel por cliente, a venda falha e nada é gravado dos dois lados.
 * A camada não impede o defeito: troca escrita silenciosa no schema alheio por falha
 * barulhenta no caixa, que é a melhor falha disponível.
 */

/**
 * Exportado desde 2026-09-12 porque a pergunta de subida precisa da **mesma** junção
 * (`credential-query.ts`, `app-credential.ts`). Três cópias de um prefixo que tem de concordar é
 * o jeito de elas divergirem: a que muda deixa a outra perguntando sobre um nome que ninguém
 * forma.
 */
export const TENANT_ROLE_PREFIX = 'app_';

/**
 * `app_` + o nome do schema, e isso é contrato com o banco, não estilo: a verificação do
 * executor é uma junção por `'app_' || nspname`, sem tabela de-para
 * (`db/papel-do-cliente.md` §7.1).
 *
 * A forma do nome é conferida aqui, **antes** de qualquer conexão: nome fora da forma vira
 * `internal_error` e não vira comando.
 */
export function tenantRoleName(schemaName: string): string {
  assertTenantSchemaName(schemaName);
  return TENANT_ROLE_PREFIX + schemaName;
}

export type TenantWork<T> = (db: TenantDb) => Promise<T>;

/** Abre a transação, assume o papel, entrega o handle preso, e o larga no fim. */
export type TenantTransactionRunner = <T>(work: TenantWork<T>) => Promise<T>;

/**
 * **`SET LOCAL`, nunca `SET`, e por isso toda leitura de cliente abre transação.**
 *
 * Medido em 2026-09-11, PostgreSQL 16.15: `SET ROLE` sem `LOCAL` **atravessa o `COMMIT`** e a
 * conexão volta ao pool como o cliente anterior — mesmo pool de `max: 1`, a requisição seguinte
 * lê o schema do outro sem erro nenhum. É o segundo estado de sessão a vazar assim; o primeiro
 * foi o `search_path` ([[gotcha-set-role-de-sessao-vaza-no-pool]]). A diferença é que ali o
 * vazamento era de **alvo** e qualificar por consulta resolvia; aqui é de **privilégio**, que é
 * propriedade da sessão e não se qualifica. Só existe a forma local, e a forma local obriga
 * transação.
 *
 * `set_config('role', $1, true)` é a forma parametrizável, e o `true` **é** o `LOCAL`. Com
 * `false` tem exatamente o mesmo defeito. O nome do papel vai como **parâmetro ligado**, não
 * interpolado — o único fragmento cru do caminho de requisição, e ele não carrega identificador
 * algum vindo de fora.
 *
 * O papel é largado pelo `COMMIT` **e** pelo `ROLLBACK`, sem `RESET`: medido, a conexão volta
 * a ser a credencial nos dois desfechos.
 */
export function tenantTransactionRunner(root: RootDb, schemaName: string): TenantTransactionRunner {
  const roleName = tenantRoleName(schemaName);

  return async <T>(work: TenantWork<T>): Promise<T> =>
    root.transaction().execute(async (trx) => {
      await sql`select set_config('role', ${roleName}, true)`.execute(trx);

      // `withSchema` sobre uma transação devolve uma transação (Kysely `Transaction.withSchema`),
      // o que a assinatura genérica de `tenantDb` não carrega. A conversão repõe o que já é
      // verdade em execução, e é o único ponto do sistema que produz um `TenantDb`.
      return work(tenantDb(trx, schemaName) as TenantDb);
    });
}

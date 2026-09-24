import type { Kysely, Transaction } from 'kysely';
import { assertTenantSchemaName } from '../tenant/schema-name.js';

/**
 * As tabelas do schema de cliente, como o Kysely as enxerga.
 *
 * **Vazia de propósito, e com dono declarado.** O modelo de venda ainda não existe, e
 * `D-01` nomeou o preço do Kysely: "quem gera esses tipos lê o banco, e tipo velho faz o
 * compilador garantir uma forma que o banco não tem mais". Enquanto esta interface estiver
 * vazia, **nenhuma consulta compila** — o que é a propriedade certa para uma fundação sem
 * modelo. Quem a preencher (geração a partir do schema aplicado) assume esse dono.
 */
export interface TenantDatabase {}

declare const rootDbBrand: unique symbol;
declare const tenantDbBrand: unique symbol;

/**
 * A raiz: a credencial **nua**, sem papel assumido e fora de transação.
 *
 * Ela não alcança schema de cliente nenhum — medido, `42501` (`pool.ts`). A marca existe para
 * o compilador recusar que ela apareça onde se espera handle de cliente.
 */
export type RootDb = Kysely<TenantDatabase> & { readonly [rootDbBrand]: true };

/**
 * O handle de cliente, e as três propriedades dele são **inseparáveis**: está dentro de uma
 * transação, com o papel `app_t_<slug>` assumido, e qualificado pelo schema daquele cliente.
 *
 * **A marca é o que impede as três se separarem** (`SEC-12`). Antes, `RootDb` e `TenantDb`
 * eram aliases do mesmo tipo, então o compilador não distinguia handle preso de handle solto;
 * com o papel entrando em cena a distinção passou a valer também para privilégio, que é onde
 * o erro não tem sintoma. Só `tenantTransactionRunner()` (`tenant-role.ts`) produz este
 * tipo, porque só ele faz as três coisas. É o mesmo padrão da marca de `Principal`.
 */
export type TenantDb = Transaction<TenantDatabase> & { readonly [tenantDbBrand]: true };

/**
 * Prende o handle ao schema do cliente, por **qualificação de identificador** em cada
 * consulta (`"t_acme"."orders"`), com o Kysely dobrando aspas no identificador.
 *
 * Esta é **uma das duas camadas**, e sozinha ela não isola nada desde 2026-09-11. Ela resolve
 * **alvo**; quem resolve **privilégio** é o papel assumido na transação (`tenant-role.ts`).
 * As duas existem porque falham por motivos diferentes: qualificação não alcança fragmento
 * cru, e papel não impede consulta apontada para o schema errado dentro do que o papel pode.
 *
 * **Por que não `search_path`, que é o caminho do executor de migration.** Lá quem conecta é
 * o executor, iterando um registro, com uma conexão por vez e um alvo por vez
 * (`db/migrator/APLICACAO-E-ALVO.md` §10.5). Aqui quem conecta atende N clientes sobre um
 * pool: `SET search_path` é estado de **sessão**, e a conexão volta para o pool carregando o
 * alvo do cliente anterior.
 *
 * **O buraco que sobra, e ele é real:** `withSchema` qualifica o que o construtor de consulta
 * monta. Fragmento `sql` cru com nome de tabela escrito à mão **não** é alcançado por ele, e
 * cai no `search_path` da conexão. SQL cru no caminho de requisição é, por isso, proibido sem
 * decisão registrada (`backend.md`). O que o papel acrescenta: o fragmento cru que aponte para
 * outro cliente agora leva `permission denied` em vez de ler.
 */
export function tenantDb<DB>(handle: Kysely<DB>, schemaName: string): Kysely<DB> {
  assertTenantSchemaName(schemaName);
  return handle.withSchema(schemaName);
}

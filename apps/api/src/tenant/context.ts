import type { Principal } from '../identity/principal.js';
import type { TenantTransactionRunner } from '../db/tenant-role.js';

/**
 * O contexto de cliente, resolvido **uma vez** na borda e injetado (`backend.md` §1).
 *
 * Não existe forma de alcançar o banco sem passar por aqui: a raiz do Kysely fica na
 * composição do servidor e não é exportada para rota nenhuma. É isso, e não disciplina de quem
 * escreve consulta, que impede a "função de dados com tenant opcional".
 *
 * **O que ele entrega mudou em 2026-09-11, e a mudança é de desenho, não de forma.** Era um
 * handle pronto para consultar; passou a ser a **abertura de transação**, porque o alcance ao
 * schema agora vem do papel `app_t_<slug>`, e papel só se assume localmente, dentro de uma
 * transação ([[decision-papel-de-aplicacao-assumido-por-transacao]]). Handle pronto para
 * consultar fora de transação seria a credencial nua, que não alcança schema nenhum: pedir um
 * seria pedir `42501`.
 */
export interface TenantContext {
  /** Chave do cliente em `platform.tenants`. */
  readonly tenantId: string;
  /** `t_<slug>`. Já validado quando o contexto existe. */
  readonly schemaName: string;
  /**
   * Abre a transação deste cliente, com o papel assumido e o schema qualificado.
   *
   * Toda leitura e toda escrita do caminho de requisição passam por aqui, inclusive a leitura
   * de uma linha só. É o custo aceito do arranjo, e ele é declarado: não existe consulta de
   * cliente fora de transação.
   */
  readonly transaction: TenantTransactionRunner;
}

/** O que o diretório devolve: identificação, sem nada de banco. */
export interface TenantIdentification {
  readonly tenantId: string;
  readonly schemaName: string;
}

/**
 * O **terceiro eixo de `D-03`**: como o cliente é resolvido na borda.
 *
 * Duas travas que valem qualquer que seja a resposta, e nenhuma delas depende de `D-03`:
 *
 * 1. a entrada é o `Principal`, e **só** ele. Não recebe `request`, não recebe cabeçalho,
 *    não recebe path. Cliente que o chamador informa está fora por assinatura, não por
 *    revisão de código (`RN-PRV-004` b, e `backend.md` §1);
 * 2. devolver `null` é o caminho normal, e o desfecho dele é recusa. Não há default.
 */
export interface TenantDirectory {
  readonly name: string;
  resolve(principal: Principal): Promise<TenantIdentification | null>;
}

/**
 * O diretório padrão: **não resolve ninguém**.
 *
 * A implementação real esbarra numa pergunta que ainda não tem resposta e que não é minha:
 * `db/papeis-e-credencial.md` §1 proíbe papel de aplicação com `USAGE` em `platform`, e o
 * registro de clientes mora lá. Então o caminho de leitura precisa existir de outra forma
 * (conexão própria com papel próprio, ou o mapa chegando resolvido de fora), e essa escolha
 * é de `arquiteto-dados` + `seguranca`, com `D-03` do lado.
 */
export const tenantDirectoryUndecided: TenantDirectory = {
  name: 'tenant-directory-undecided-d03',
  resolve(): Promise<TenantIdentification | null> {
    return Promise.resolve(null);
  },
};

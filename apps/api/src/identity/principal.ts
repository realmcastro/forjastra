/**
 * A fronteira de `D-03`, e ela está **ABERTA** (`CLAUDE.md` §8).
 *
 * `D-03` são três eixos ([[decision-d-03-sao-tres-eixos-nao-uma-decisao]]): onde mora o
 * sujeito, o que ele apresenta como prova, e como o cliente chega na borda. Nenhum dos três
 * é decidido aqui, e o desenho abaixo existe para tornar impossível decidi-los por acidente.
 *
 * `Principal` é **opaco de propósito**. A fundação nunca lê nada dentro dele: quem produz é
 * o `IdentityProvider`, quem consome é o `TenantDirectory`, e os dois nascem juntos quando
 * `D-03` fechar. Se este arquivo declarasse `{ userId, role, tenantId }`, teria escolhido o
 * primeiro eixo por escrito, e ninguém depois saberia que a escolha foi minha e não do humano.
 */

declare const principalBrand: unique symbol;

export interface Principal {
  readonly [principalBrand]: true;
}

/** O que o provedor pode olhar. Nada disto é registrado em fato nem em log. */
export interface IdentityAttempt {
  readonly method: string;
  readonly headers: Readonly<Record<string, string | string[] | undefined>>;
}

export interface IdentityProvider {
  readonly name: string;
  /**
   * Devolve o sujeito provado, ou `null` quando não há prova. **Nunca lança**: ausência de
   * prova é desfecho normal da borda, não exceção.
   */
  authenticate(attempt: IdentityAttempt): Promise<Principal | null>;
}

/**
 * O provedor padrão, e o único que existe enquanto `D-03` estiver aberta: **recusa tudo**.
 *
 * Não é falta de implementação disfarçada de política. É a política correta: sem decisão
 * sobre o que prova identidade, toda requisição autenticada é recusada, e o servidor sobe
 * dizendo isso em vez de servir com uma prova inventada.
 */
export const identityUndecided: IdentityProvider = {
  name: 'identity-undecided-d03',
  authenticate(): Promise<Principal | null> {
    return Promise.resolve(null);
  },
};

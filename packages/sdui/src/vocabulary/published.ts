/**
 * Livro dos ids publicados — append-only.
 *
 * Publicar é o ato que congela um id: a partir do dia em que um servidor emite aquele id,
 * existe manifesto cacheado em terminal que o carrega, e deixar de entendê-lo transforma o
 * cache em tela degradada justamente quando a rede está fora
 * (`vocabulario-e-eixos.md` §1.4).
 *
 * Por isso **este livro não é tipado contra o vocabulário**: se a linha fosse `BlockKind`, a
 * mesma edição que apaga o id do registro apagaria a evidência de que ele existiu, e nada
 * acusaria. A linha é `string` de propósito, e `checkVocabulary` cobra o reencontro. Id que
 * some do registro é **erro**, não limpeza.
 *
 * Hoje o livro está **vazio**, e isso é fato, não descuido: nenhum servidor emite manifesto
 * ainda (`apps/api` não tem rota de negócio) e nenhum terminal foi entregue. É essa janela
 * que torna renomear barato agora e impossível depois.
 */

export type PublishedKind = {
  /** O id, literal, como o manifesto o carregou. */
  readonly kind: string;
  /** Primeiro dia em que um servidor o emitiu, `AAAA-MM-DD`. */
  readonly publishedOn: string;
};

export const PUBLISHED_KINDS: readonly PublishedKind[] = [];

# SPR-19 — Selecionar variação do produto

**Tipo:** História · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-11-27
**Agrupador:** SPR-15
**Rótulos:** bloqueada

---

## Objetivo

Permitir que o garçom selecione, no lançamento, a variação do item de catálogo — como tamanho — para registrar exatamente qual versão foi pedida. Sem registrar a variação escolhida, o lançamento não distingue "X 300 ml" de "X 500 ml" — dois preços, uma linha. Variação serve para diferença simples com preço próprio (300 ml / 500 ml); diferença estrutural relevante é item de catálogo distinto, não variação.

## Escopo

O enunciado já se limita à fronteira aprovada — nenhuma entidade de variação nasce aqui antes da resposta a `G-04`, e cada combinação estrutural permanece item de catálogo próprio até `GRD` ligar.

## Critério de aceite

1. Um item de catálogo pode possuir múltiplas variações, cada uma com preço próprio.
2. A variação selecionada faz parte do lançamento.
3. Duas variações diferentes do mesmo item de catálogo geram lançamentos distintos.
4. Diferença estrutural relevante — não simples como tamanho — é cadastrada como item de catálogo distinto, nunca como variação.

## Depende de

A resposta do humano a `G-04` (`docs/produto/backlog-lacunas-g01-g09.md` §5): eixo único com preço próprio é do núcleo, ou é o degrau de baixo do módulo `GRD`?

## Bloqueio conhecido

`G-04` (rótulo `bloqueada`): escopo em disputa. Comentário de bloqueio já publicado nesta issue (2026-08-26); não decidido nesta passada.

## Referências

`docs/produto/backlog-lacunas-g01-g09.md` §5 · `docs/produto/fronteira-do-nucleo.md:71` · `docs/produto/catalogo-de-modulos.md:253`

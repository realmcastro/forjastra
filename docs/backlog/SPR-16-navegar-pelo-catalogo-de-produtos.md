# SPR-16 — Navegar pelo catálogo de produtos

**Tipo:** História · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-11-27
**Agrupador:** SPR-15
**Rótulos:** bloqueada

---

## Objetivo

Permitir que o garçom navegue pelo catálogo agrupado — categoria e subcategoria, sem limite fixo de profundidade — até localizar o item de catálogo, sem depender de saber o código. Sem nenhum agrupamento, o operador só localiza o item digitando o código, e num catálogo com centenas de itens isso é o gargalo do caixa no pico.

## Escopo

Navegação sobre a hierarquia de categoria/subcategoria (modelada em `SPR-31`) até a categoria folha que contém o item, no catálogo apresentado ao garçom.

## Critério de aceite

1. Catálogo com hierarquia de 3 ou mais níveis → o operador chega ao item de catálogo navegando só por categoria/subcategoria, sem digitar código, em qualquer profundidade.
2. Categoria que só tem subcategorias, sem item próprio → aparece como nó intermediário de navegação, nunca como destino final (mesmo critério de `SPR-31`, "folha").

## Depende de

A resposta do humano a `G-03` (`docs/produto/backlog-lacunas-g01-g09.md` §3): existe agrupamento de item de catálogo no núcleo, ou agrupar é capacidade de `PUB`? Se a resposta for núcleo, depende também de `SPR-31` (modela a hierarquia como entidade) e de `SPR-39`/`SPR-40` (nenhuma tabela nasce antes delas). Não é executável antes disso.

## Bloqueio conhecido

`G-03` (rótulo `bloqueada`): escopo em disputa. Comentário de bloqueio já publicado nesta issue (2026-08-26); não decidido nesta passada.

## Fora de escopo

Desempenho da consulta de catálogo (gate de `SPR-31`, depois da modelagem). Forma visual da navegação (tela, componente) — território de `ui`.

## Gate obrigatório

Desempenho — consulta de catálogo em caminho quente (mesmo gate de `SPR-31`).

## Referências

`docs/produto/backlog-lacunas-g01-g09.md` §3 · `docs/produto/fronteira-do-nucleo.md:169` · `docs/produto/catalogo-de-modulos.md:98` · `SPR-31`

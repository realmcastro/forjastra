# SPR-20 — Adicionar adicionais ao produto

**Tipo:** História · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-11-27
**Agrupador:** SPR-15
**Rótulos:** bloqueada

---

## Objetivo

Permitir que o garçom selecione adicionais permitidos para um item de catálogo, para personalizar o lançamento e incorporar o acréscimo de valor correspondente. Sem adicional associado ao item de catálogo, cada combinação (ex.: "com bacon") vira cadastro próprio, e o catálogo cresce por multiplicação manual em vez de composição.

## Escopo

Depende também de a tabela fechada de `RN-NUC-013` (`docs/produto/nucleo-publicacao-e-texto.md:29`) ser alterada para admitir o artefato de adicional — hoje compor valor a partir de adicional contradiz a regra como está escrita.

## Critério de aceite

1. Cada adicional está associado aos itens de catálogo/variações que permitem seu uso.
2. Apenas adicionais compatíveis são apresentados.
3. Um adicional pode ter valor igual a zero.
4. O valor do adicional é incorporado ao valor do item, sob a política de composição que `G-05` decidir.
5. A repetição do mesmo adicional no mesmo item segue conjunto ou multiconjunto — decisão de `G-05`, ainda em aberto.

## Depende de

A resposta do humano a `G-05` (`docs/produto/backlog-lacunas-g01-g09.md` §4): classificação (núcleo / módulo novo / módulo existente) e conjunto × multiconjunto.

## Bloqueio conhecido

`G-05` (rótulo `bloqueada`): escopo em disputa. Comentário de bloqueio já publicado nesta issue (2026-08-26); não decidido nesta passada.

## Referências

`docs/produto/backlog-lacunas-g01-g09.md` §4 · `docs/produto/glossario.md:289` · `docs/produto/nucleo-publicacao-e-texto.md:29`

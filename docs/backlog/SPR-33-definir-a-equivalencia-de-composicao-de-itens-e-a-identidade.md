# SPR-33 — Definir a equivalência de composição de itens, e a identidade que a sustenta

**Tipo:** História · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-09-28
**Agrupador:** SPR-34
**Rótulos:** bloqueada

---

## Edição de 2026-09-23 — o que mudou, por quê, contra o quê

- **A chave mudou de forma, e a prova são duas regras novas.** Com `RN-NUC-069`, variação não é dado da
  linha: a combinação é o próprio item. Com `RN-NUC-070`, "complemento" é componente de módulo na linha, e
  o adicional é multiconjunto. A chave deixa de ser "item + variação + complementos" e passa a ser "item +
  multiconjunto de componentes". As duas regras estão em `docs/produto/nucleo-publicacao-e-texto.md` §3
  (T-0014, passo A.2b).
- **O aceite 1 foi reescrito**, para provar a diferença entre quantidades do mesmo adicional, que é o que
  o multiconjunto introduz. O aceite 3 trocou "registrando no histórico qual foi retirado" pelas regras
  que já exigem isso (`RN-NUC-053`, `RN-NUC-054`), sem mudar o que pede.
- **`Depende de` passou a dizer o que `SPR-32` entrega**, porque o nome antigo ("item de catálogo e
  variação") não é mais o que ele modela.
- **O bloqueio por `SPR-23` continua**, e o rótulo `bloqueada` fica por ele. `G-04` e `G-05` deixaram de
  bloquear.

## Objetivo

Modelar a **equivalência de apresentação** entre lançamentos de venda com a mesma composição, para agregar
a exibição em tela sem apagar a trilha.

## Escopo

* **Chave de equivalência:** item de catálogo + multiconjunto de componentes da linha (cada um com módulo
  dono, o que o módulo compôs e quantidade), sem observação de texto livre.
* **Agregação:** múltiplos lançamentos com a mesma chave aparecem como "2× X-Burger" na tela.
* **Trilha preservada:** cada lançamento original mantém id, autor e instante próprios no histórico.

No MVP 1 sem `ADI` (aviso na entrada de `ADI`, `catalogo-de-modulos.md`), nenhuma linha tem componente, e
a chave degenera em "mesmo item". O modelo não pode depender disso.

## Critério de aceite

1. Três lançamentos do mesmo item: dois com o adicional A em quantidade 2, um com A em quantidade 1. Os
   dois primeiros aparecem agregados como "2×"; o terceiro fica à parte. Um lançamento sem componente e
   outro com A × 1 também não se agregam.
2. Clicar em "expandir" ou em "remover um" mostra os lançamentos originais com ids, autores e instantes
   distintos.
3. Remover um dos lançamentos ("retirar um") remove exatamente aquele, e a retirada é fato
   (`RN-NUC-053`, `RN-NUC-054`).
4. Observação de texto livre (`order_item_note`) nunca participa da chave: texto é opaco e não determina
   identidade (`RN-NUC-016`).

## Depende de

- `SPR-39` (chave primária, timestamps; em execução em T-0009).
- `SPR-32`: o item de catálogo atômico e a camada de componentes da linha.
- **Bloqueio:** `SPR-23` (agregação de apresentação) deve ser reescrita antes desta modelagem estar
  pronta. Comentário publicado em 2026-08-26.

## Fora de escopo

Regra de apresentação em interface (quando e como expandir): é de `ui`, não de modelo. Regra fiscal de
cancelamento de item: é de `produto`, não de modelo. O cadastro de adicionais: é `ADI`.

## Gate obrigatório

Segurança (isolamento de tenant) e desempenho (agregação não materializa extra).

## Referências

`.claude/rules/dados.md` · `docs/produto/modulos/mesa-comanda.md` (RN-MSA-004) · `docs/produto/glossario.md`
§1.3 e §6 · `docs/produto/nucleo-publicacao-e-texto.md` §3 (`RN-NUC-069`, `RN-NUC-070`)

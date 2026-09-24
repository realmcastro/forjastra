# SPR-18 — Escolha obrigatória pendente impede o lançamento do item de catálogo

**Tipo:** História · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-11-27
**Agrupador:** SPR-15

---

## Objetivo

Item de catálogo cujo lançamento tem **escolha obrigatória pendente** não é lançável sem a escolha, e a recusa **nomeia qual escolha falta**. Item sem escolha obrigatória é lançado em **um** toque, sem etapa intermediária.

A necessidade é não perder variação, complemento ou observação por esquecimento — hoje o operador anota no papel e o erro só aparece na entrega ou na conferência; essa necessidade não está em discussão. O mecanismo recusado — "todo item passa por uma etapa de configuração antes de ser adicionado" — condiciona certo os campos (item sem variação e sem adicional mostra só o que se aplica), mas impõe a **etapa** a 100% dos lançamentos, mesmo mostrando zero campo. Isso custa um toque no único caminho que não aceita regressão, o caixa com fila, e quebra o fluxo completável por leitor de código de barras sem tocar a tela (`.claude/rules/ui.md` §3, orçamento de 150 ms de `.claude/rules/performance.md` §3). A regra condicional acima resolve isso: ela reprova o mecanismo recusado no critério de aceite 1, abaixo.

## Escopo

**Quais** itens têm escolha obrigatória é **dado publicado**, nunca decisão do terminal — o terminal aplica artefato retido, não decide (`RN-NUC-013`, `docs/produto/nucleo-publicacao-e-texto.md:29`).

## Critério de aceite

Os dois sentidos são obrigatórios:

1. Lançar por leitor de código de barras 20 itens **sem** escolha obrigatória → nenhuma etapa intermediária em nenhum dos 20, e nenhum toque na tela.
2. Tentar lançar item **com** escolha obrigatória pendente → recusado, e a mensagem nomeia **a escolha que falta** e a ação possível (`PN-17`).

## Depende de

**Que** escolhas obrigatórias existem depende de classificar variação por eixos (`G-04`) e adicional/complemento (`G-05`) — perguntas abertas ao humano. A regra condicional do Objetivo **não** depende delas: vale para qualquer escolha obrigatória publicada, e foi escrita para não mudar quando o conjunto de escolhas for decidido.

## Fora de escopo

A **etapa** — tela, passo, componente, ordem visual — é território de `ui`; este card entrega a regra, não a etapa. Três critérios do enunciado original mudaram de dono, e não somem: campo de observação no lançamento e confirmar a inclusão do item no consumo → `SPR-22` (que absorve `SPR-21`); valor atualizado apresentado → `SPR-28` (valor do item) e `SPR-29` (acumulado do consumo). Apresentar variações (`G-04`) e apresentar adicionais permitidos (`G-05`) ficam atrás das respectivas lacunas.

## Referências

`docs/produto/nucleo-publicacao-e-texto.md:29` · `.claude/rules/ui.md` §3 · `.claude/rules/00-nucleo.md` §12 · `docs/produto/glossario.md:55`

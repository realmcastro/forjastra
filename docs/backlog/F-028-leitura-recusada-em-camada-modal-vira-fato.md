# F-028 — Leitura recusada durante camada modal passa a produzir fato

**Tipo:** Comportamento fechado · **Estado:** **absorvido em `F-007` em 2026-09-23**, sem execução
própria · **Dono:** `produto` · **Território:** `docs/produto/**` · **Cobre o achado** `2.21` de
`docs/produto/captura-varredura-sem-rn-2026-09-23.md` · **Agrupador:** F-001 · **Rótulo:** captura

> **Absorvido em [`F-007`](F-007-codigo-lido-e-nao-resolvido-tem-motivo-proprio.md) em 2026-09-23.**
> Quem pegar este trabalho pega `F-007`: o escopo, os dois aceites (lá, 6 e 7) e as listas estão na
> seção "Absorção de `F-028` — 2026-09-23" de lá. A justificativa nas quatro partes está em
> `docs/produto/backlog-recortes.md` (entrada `F-028`), e a autorização em
> `tarefas/T-0017-varrer-escopo-sem-rn.md`, seção "thread — 2026-09-23 (conferência por conjunto e
> respostas)". O texto abaixo é o original, preservado, e não recebe mais edição.

> **Recorte recomendado: absorver em `F-007`**, se `T-0016` ainda aceitar escopo quando este item for
> lido. Os dois alteram a mesma lista de motivos de `RN-NUC-043`, no mesmo fluxo de leitura de `PER`, e
> duas edições concorrentes daquela lista são o que este estado de "não executável" existe para evitar.

## Objetivo

O leitor dispara durante uma camada modal. A regra é certa e está escrita: a leitura é **recusada,
contada e sinalizada dentro da camada**, nunca enfileirada e nunca descartada em silêncio
(`docs/design/foco-teclado-e-leitor.md:68-71`; lei 12 em `docs/design/estados-e-interacao.md:349`). A
contagem existe para o operador saber o que reler. Nenhuma spec diz que ela vira fato, e `F-007` trata
de outra coisa: leitura válida que não resolve item (`F-007:8-15`).

**Perde-se:** quantos itens quase ficaram fora da venda porque uma camada abriu no meio de uma rajada de
leitura. É a medida de que a camada modal está no lugar errado do fluxo.

## Escopo

- Motivo próprio na lista de `RN-NUC-043` para leitura recusada por estado da interface, distinto de
  leitura não resolvida (`F-007`).
- A contagem por camada: quantas leituras aquela camada recusou, e qual camada era.

## Fora de escopo

- Mudar o desfecho: a leitura continua recusada e sinalizada.
- O sinal audível (`S-01`, `estados-e-interacao.md:360`).

## Critério de aceite

1. Com a confirmação de sangria aberta, três leituras: as três são recusadas e sinalizadas na camada, e
   existe fato com o motivo próprio, a camada e a contagem 3.
2. O motivo não se confunde com o de `F-007`: leitura válida sem item e leitura recusada por camada
   aparecem separadas na mesma janela.

## Registra / Não registra

**Registra:** o motivo, a camada, a contagem, o instante, o terminal.
**Não registra:** o código lido. A decisão que o fato informa é se a camada está no lugar errado do
fluxo, e ela não depende de qual item foi lido; o código como diagnóstico de catálogo é de `F-007`. Se a
escrita da regra achar decisão que precisa do código, o item nomeia a decisão antes de acrescentá-lo.

## Depende de

`T-0016` fechar (`F-007`, em execução desde 2026-09-23), e o corpo de `RN-NUC-043` e de
`fatos-de-operacao-dominios-fechados.md` §1.1, em edição no mesmo dia.

## Gate obrigatório

`performance`: o registro acontece no meio de uma rajada de leitura, no caminho crítico.

## Referências

`docs/produto/captura-varredura-sem-rn-2026-09-23.md` §2.21 · `docs/design/foco-teclado-e-leitor.md:68-71` ·
`docs/design/estados-e-interacao.md:349` · `F-007` · `RN-NUC-043`

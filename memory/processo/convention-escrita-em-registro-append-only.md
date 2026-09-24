---
name: convention-escrita-em-registro-append-only
description: o git preserva o texto anterior sozinho, mas não preserva o destino de cada critério que sai numa substituição — essa quarta parte continua sendo trabalho de quem edita, e sem ela a preservação vira arquivo morto
type: convention
escopo: processo
camada: processo
data: 2026-08-26
atualizado: 2026-09-11 (o registro saiu do board externo para `docs/backlog/`; metade da convenção passou a ser feita pelo git)
relaciona: [[decision-backlog-e-o-registro-publico-da-tarefa]], [[gotcha-o-titulo-nao-e-o-card]]
tarefa: T-0006
---

Nasceu em 2026-08-26 sobre comentário de issue, que não se edita. Desde 2026-09-11 o backlog é
arquivo versionado, e **o git assumiu metade dela**. A metade que ele não assume é a que sempre
importou.

**O que o git faz sozinho:** guardar o texto anterior verbatim, com data e autor. A antiga obrigação
de colar o texto antigo antes de substituir morreu, desde que a mudança entre em **commit próprio** e
o assunto diga o que mudou. Substituição de item enterrada num commit de vinte arquivos perde isso, e
aí a convenção volta a valer por inteiro.

**O que o git não faz, e continua sendo seu:** dizer **para onde foi cada critério que saiu**.
Substituição destrutiva declara, no próprio item: **por quê**, **contra o quê** (`path:linha` da
regra ou da spec), e o **destino de cada critério que sai** — para que item, ou por que morre. O
`git log` mostra que o critério existia e sumiu; ele não mostra que foi parar em outro item, nem que
foi descartado de propósito. Sem essa parte, a preservação vira arquivo morto: o critério fica
registrado e ninguém sabe onde ele foi parar.

**Por quê:** apagar texto de um item é mais fácil que apagar comentário de board, e não deixa rastro
nenhum fora do git — que ninguém lê procurando por isso. A trava passou a depender inteiramente da
disciplina, que é o preço geral de ter saído da ferramenta ([[decision-backlog-e-o-registro-publico-da-tarefa]]).

**Como aplicar:** mudou escopo de um item? Commit próprio, assunto que nomeia a mudança, e as três
partes acima no corpo do item. Corrigiu depois de publicar? Novo commit, nunca amend em história já
empurrada, pela mesma razão de `migrations.md` §1.

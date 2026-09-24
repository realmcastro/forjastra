---
name: gotcha-fronteira-cruzada-por-digitacao-de-cadastro
description: se eixo único for do núcleo e eixo múltiplo for de módulo, quem cruza a fronteira é o comerciante digitando um valor no cadastro — a travessia não tem gatilho de código, não passa por revisão nem por gate, e só aparece quando quebra em produção
type: gotcha
escopo: plataforma
camada: produto
data: 2026-09-11
relaciona: [[business-rule-variacao-exige-conjunto-fechado-quantidade-nao]], [[gotcha-capacidade-sem-dono-entra-pelo-titulo-do-card]]
---

**Sintoma:** um item de catálogo que funcionava para de funcionar depois de um cadastro comum, sem
deploy, sem migration e sem ninguém ter mexido em código.

**O caso concreto que revelou isto.** Numa das saídas propostas para `G-04`, eixo **único** de
variação seria construção do núcleo e eixo **múltiplo** seria do módulo `GRD`. A loja de polpa que
vende só potes de 1 kg tem estrutura de núcleo. Ao lançar o pote de 500 g no verão, o mesmo item
passa a ter dois valores no mesmo eixo, depois um segundo eixo, e **migra para estrutura de módulo**.
Em produção, em N schemas, disparado por uma digitação de cadastro.

**Por quê é grave:** toda fronteira do sistema é atravessada por código, que passa por revisão e por
gate. Esta seria atravessada por **dado**, que não passa por nenhum dos dois. O agent que desenha não
vê a travessia acontecer, porque ela não existe no momento em que ele desenha.

Isso também dissolve a "fronteira difusa entre um eixo e dois eixos" registrada em
`docs/produto/backlog-lacunas-g01-g09.md:134`: ela é difusa porque **não existe diferença de
construção** entre N=1 e N=2. A diferença estava sendo inventada pela fronteira, não observada no
negócio.

**Como aplicar:** ao propor que uma fronteira (núcleo/módulo, tabela/tabela, capacidade/capacidade)
seja decidida por **cardinalidade de um dado**, pare. Pergunte quem cruza a fronteira e com que ato.
Se a resposta for "o usuário, cadastrando", a fronteira está no lugar errado. Fronteira legítima é
atravessada por decisão, não por digitação.

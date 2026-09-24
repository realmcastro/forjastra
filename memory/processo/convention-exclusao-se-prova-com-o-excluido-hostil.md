---
name: convention-exclusao-se-prova-com-o-excluido-hostil
description: a prova de uma exclusão é o que ela deixa passar com o excluído legítimo fazendo o pior que o privilégio dele permite, e o controle só é provado por mutação no artefato compilado matando um caso; suíte verde não prova nada
type: convention
escopo: processo
camada: seguranca
data: 2026-09-12
relaciona: [[convention-propriedade-acusa-nunca-desculpa]]
tarefa: T-0009
---

O teste hostil que prova uma exclusão não põe um intruso no sistema. Ele põe **o excluído legítimo**
(o executor, a credencial, o dono) fazendo o pior que o próprio privilégio permite, e confere que o
controle acusa. Depois desfaz o estado e confere que o controle volta a `0` (zero falso positivo).

Corolário medido cinco vezes em 2026-09-12 (`PAP-17`, `PAP-23`, `SUB-03`, `SUB-07`, `PAP-26`) e de
novo em 2026-09-23 (`PAP-29`, `todo` do `node --test` passando pelo gate): **suíte verde não é
prova.**

**Por quê:** as suítes passavam sem exercitar a propriedade que diziam proteger, e o autor não
enxerga isso ao reler o próprio teste.

**Como aplicar:** para cada predicado de controle, silencie-o no `dist` (numa cópia), rode a suíte sem
recompilar e veja um caso nomeado morrer. Mutante vivo é predicado sem prova. Gate de suíte reprova
com total zero, com teste pulado e com `todo`.

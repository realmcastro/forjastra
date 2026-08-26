---
name: gotcha-modelo-agendado-antes-da-regra-que-o-define
description: sintoma é um calendário saudável — card de modelagem agendado semanas antes do card de regra que define a entidade; aconteceu com SPR-31/32/33 contra SPR-16/19/20/23, e duas das entidades nem tinham fronteira decidida
type: gotcha
escopo: plataforma
camada: produto
data: 2026-08-26
relaciona: [[state-board-spr-2026-08-26]], [[convention-prazo-e-ideal-mais-trinta-por-cento]], [[gotcha-capacidade-sem-dono-entra-pelo-titulo-do-card]]
tarefa: SPR-53
---

**Sintoma:** o calendário parece saudável. Cada card tem dono, prazo e ordem dentro da trilha da
pessoa, e a soma fecha. O defeito não aparece na visão de board — aparece quando alguém cruza a data
do card de **modelo** com a data do card de **regra** que define a entidade modelada.

Em 2026-08-26 o thread principal montou a Fase 1 com `SPR-31` (09-09), `SPR-32` (17-09) e `SPR-33`
(23-09) modelando categoria de catálogo, variação/complemento e equivalência de item — e jogou
`SPR-16`, `SPR-19`, `SPR-20` e `SPR-23`, que são as **regras dessas mesmas entidades**, para
novembro. Duas das três entidades não tinham nem fronteira decidida
([[gotcha-capacidade-sem-dono-entra-pelo-titulo-do-card]]).

**Por quê:** encadear prazo por pessoa é intuitivo e produz um calendário bonito, porque a
dependência que ele respeita é a de **disponibilidade** (a pessoa está livre?), não a de
**conhecimento** (a regra existe?). As duas não coincidem, e a segunda é a que manda: o invariante 7
do `CLAUDE.md` diz contrato antes de código, e `processo.md` §2 exige regra numerada com critério de
aceite antes de implementação. Modelo é a camada onde violar isso custa expand/contract em N schemas
de cliente — o mais caro do projeto.

**Como aplicar:** ao montar calendário de Fase 1, para cada card de modelo pergunte **duas** coisas,
não uma: (a) a pessoa está livre nessa data? (b) a `RN` que define esta entidade já existe, e o card
que a escreve fecha **antes**? Se a resposta de (b) for não, o card não é agendável — é bloqueado.
E na dúvida sobre a existência da regra, procure o termo no `glossario.md`: entidade que não está lá
não tem regra, por definição.

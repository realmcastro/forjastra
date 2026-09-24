---
name: decision-retratacao-de-declaracao-terminal
description: retirar uma declaração de papel é linha nova em platform.role_retractions, escrita pelo operador, append-only e terminal (o nome não volta); pergunta que exclui lê só a declaração vigente, e pergunta que acusa lê todas
type: decision
escopo: plataforma
camada: dados
data: 2026-09-23
relaciona: [[convention-propriedade-acusa-nunca-desculpa]]
tarefa: T-0009
---

`PAP-30` fechado pela migration `platform/0014__role_retractions.sql`. O procedimento está em
`db/universo-e-declaracao.md` §7.5.4, "Retirar uma declaração". `provision` e `migrate` saem `2` quando o
arranjo nomeia papel retratado.

**Por quê:** a tabela de declaração é append-only para todos, superusuário inclusive, e desligar o
gatilho à mão para apagar uma linha errada seria o furo que ela existe para impedir. Retratação só
**estreita**. O pior que o executor faz com ela é retratar a si mesmo, e aí todo schema passa a ser
acusado. Terminal porque reabrir o nome seria ampliar a exclusão com uma linha escrita à mão.

**Como aplicar:** nome retratado por engano volta só como papel de nome novo. Credencial inerte
(retratada ou aposentada) recebe como instrução só a retratação, nunca "revogar".

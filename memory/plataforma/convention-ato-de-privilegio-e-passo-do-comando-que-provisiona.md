---
name: convention-ato-de-privilegio-e-passo-do-comando-que-provisiona
description: ato de privilégio em script à parte é ato que alguém esquece de rodar — sendo passo do mesmo comando que cria o schema, ele não se pula, e só assim a camada de papéis vira verificável por catálogo em vez de existir só no texto
type: convention
escopo: plataforma
camada: seguranca
data: 2026-09-11
relaciona: [[decision-papel-de-aplicacao-assumido-por-transacao]], [[convention-o-que-o-banco-impoe-vence-o-que-alguem-lembra]]
tarefa: T-0009
---

Criar papel, conceder e revogar privilégio são **passos do comando que provisiona o cliente**, não um
script separado nem um procedimento de runbook.

**Por quê:** duas auditorias seguidas apontaram que "o ato que cria o papel não é artefato" era
exatamente o que tornava a camada de papéis **inverificável** — tudo que se afirmava sobre privilégio
estava verificado por uma pessoa, uma vez, e por ninguém de forma repetível. Artefato separado é
artefato que alguém esquece de rodar no cliente número sete.

Sendo passo do mesmo comando que cria o schema, quem provisiona cliente provisiona o papel dele, no
mesmo ato, ou o comando falha.

**O corte que sobra, e ele é por segredo:** o que **carrega senha** (a credencial da aplicação e o
grupo) continua sendo ato do operador, fora do repositório. O que **não** carrega — o papel por
cliente, os `GRANT`, o privilégio padrão — é do executor. Ele recebe só o **nome** da credencial, por
ambiente.

**Como aplicar:** o comando é um commit só, e isso foi medido — `CREATE ROLE` e
`ALTER DEFAULT PRIVILEGES` são transacionais, e o `ROLLBACK` não deixa papel para trás, então não
existe estado meio-criado. A **verificação** roda ao fim de **todo** schema visitado, tendo aplicado
migration ou não: um cliente que morreu antes do passo de papel já tem tudo o mais aplicado, e
verificar "só quando aplicou algo" o deixaria quebrado com o comando dizendo "nada pendente".

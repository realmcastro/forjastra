---
name: convention-bloqueio-nomeia-o-default-silencioso
description: bloqueio que só diz "falta decidir" não move ninguém — o que move é nomear o default silencioso: se ninguém responder até AAAA-MM-DD, o sistema decide assim, e o custo é este
type: convention
escopo: processo
camada: processo
data: 2026-08-26
relaciona: [[decision-jira-e-o-registro-publico-da-tarefa]], [[state-pendencias-abertas-2026-08-23]]
tarefa: T-0006
---

Todo `BLOQUEIO` — no relatório, no comentário da issue, na pauta — declara quatro coisas: a **pergunta**
em uma frase, **quem** responde, **quando** o bloqueio morde (data absoluta, tirada do prazo do card),
e o **default silencioso**: o que passa a valer se ninguém responder, e o que isso custa.

**Por quê:** a ausência de decisão não deixa o sistema parado — ela decide. Quem pega o card na data
escreve alguma coisa no campo obrigatório, e essa coisa vira a regra. O bloqueio sem default aparenta
travar o trabalho e na prática só esconde quem vai decidir: o implementador, sozinho, sob prazo. Escrito
o default, a escolha volta a ser do dono da resposta, inclusive a escolha de não responder.

Foi assim que a pauta de 2026-08-26 mudou de ordem contra o próprio brief: ela abriria pelo fuso
(2026-09-08), e o arredondamento morde em 2026-09-02 — a data trocou o primeiro item, e a data só existia
porque cada bloqueio a carregava.

**Como aplicar:** o comentário de bloqueio nomeia a `G`/`LACUNA`, a pergunta, o que a desbloqueia e o
default. No board, ele vem acompanhado do rótulo `bloqueada` — bloqueio é visível ou não existe
(`.claude/rules/jira.md` §5), e o rótulo sem comentário não diz o que falta.

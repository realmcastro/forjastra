---
name: convention-enumerar-quem-alcanca-vence-conferir-o-esperado
description: controle que confere "o sujeito esperado está bem formado" não enxerga `PUBLIC`, sujeito alheio nem acesso herdado por grupo — a pergunta que fecha é a invertida, que enumera quem alcança o recurso e recusa o que não está previsto
type: convention
escopo: plataforma
camada: seguranca
data: 2026-09-11
relaciona: [[gotcha-palavra-proibida-nao-fecha-classe-ancora-fecha]], [[convention-o-que-o-banco-impoe-vence-o-que-alguem-lembra]], [[gotcha-heranca-e-propriedade-da-concessao-nao-do-papel]]
tarefa: T-0009
---

Duas perguntas parecem a mesma e não são:

- **"O sujeito esperado tem o acesso esperado?"** — só enxerga o sujeito previsto. Tudo que alcança o
  recurso por outro caminho passa: `PUBLIC`, sujeito de outro cliente, acesso herdado por grupo. Um
  schema liberado para todo mundo é aprovado como **conforme**.
- **"Quem alcança este recurso?"** — enumera o que existe e recusa o que não está previsto. É a que
  fecha.

**A primeira é a que se escreve naturalmente**, porque ela nasce da spec: a spec diz o que deve
existir, e o controle confere que existe. O que ela nunca pergunta é o que **mais** existe.

**É o mesmo formato do crivo de migration**, uma camada acima, e por isso vale como regra e não como
caso: uma lista do que é **proibido** falhou quatro rodadas seguidas, e o que fechou foi declarar o
**permitido** e recusar o resto ([[gotcha-palavra-proibida-nao-fecha-classe-ancora-fecha]]). Aqui,
conferir o esperado falhou pelo mesmo motivo, e enumerar o alcance fechou pelo mesmo motivo.

**O corte que acompanha, e ele não é óbvio:** controle cuja resposta **depende de quem pergunta**
(qualquer coisa ancorada em `current_user`) **registra, não reprova** — senão a auditoria feita por
outro sujeito reprova a frota inteira, e registro que sempre acusa ninguém lê. O veto fica com o que é
**propriedade do recurso**, igual para qualquer observador.

**Como aplicar:** ao escrever verificação de acesso, escreva a pergunta invertida. Se ela devolver
linhas demais no estado íntegro, o problema é o filtro do previsto, não a pergunta. E declare o que
ela **não** vê: um sujeito cunhado e ainda sem alcance nenhum não aparece — ele aparece no instante em
que alguém lhe der acesso, que é quando ele passa a importar.

---
name: state-execucao-solo-2026-09-11
description: desde 2026-09-11 a Forja é executada só pelo humano com os agents; o calendário do board SPR foi feito em 2026-08-26 para três pessoas em paralelo e por isso está vencido, não atrasado, e a ordem passa a ser por dependência real e nunca por disponibilidade de pessoa
type: state
escopo: processo
camada: processo
data: 2026-09-11
relaciona: [[state-board-spr-2026-08-26]], [[gotcha-modelo-agendado-antes-da-regra-que-o-define]], [[decision-d-02-arranjo-d]]
---

Os colegas saíram do projeto. A partir de 2026-09-11 a Forja tem **um executor**, o humano, apoiado
pelos agents. Nada espera pessoa.

## O que isso invalida

- **O calendário do board.** As datas de `duedate` foram postas em 2026-08-26 assumindo três trilhas em
  paralelo (o humano na Fase 1, dois colegas na Epic `SPR-35`). Seis cards venceram até 2026-09-11
  (`SPR-39`, `SPR-45`, `SPR-40`, `SPR-36`, `SPR-42`, `SPR-43`). Eles **não estão atrasados**: o
  pressuposto do prazo deixou de existir. Tratar a data como dívida produz pressa contra um número que
  já não significa nada.
- **A trilha paralela como desenho.** Fase 1 e Epic `SPR-35` corriam juntas porque tinham donos
  diferentes. Com um executor, correr junto é só trocar de contexto, e a ordem volta a ser a que
  `processo.md` §4 sempre pediu: dependência.
- **A espera por resposta de terceiro.** Toda pergunta de `PERGUNTAS: para humano` tem exatamente um
  destinatário, e ele está na sessão. A resposta é a mesma conversa, não um ciclo.

## O que isso não muda

Os gates, os territórios de escrita e a definição de pronto continuam inteiros. Eles nunca existiram
para coordenar pessoas: existem para impedir que trabalho conforme à regra e impossível de executar
passe na revisão. Um executor só **aumenta** o valor disso, porque não há segunda pessoa lendo por cima.

## O alvo declarado pelo humano, e é por ele que o escopo se julga

**MVP sólido, escalável em informação, e compatível com muitos dispositivos.** A frase dele: mesmo sem
múltiplos clientes, aceitar múltiplos dispositivos e ser rico em informação já é o diferencial. Duas
consequências operacionais, e nenhuma é retórica:

- **Riqueza de informação é requisito de modelo, não de tela.** Ela se decide na Fase 1, no que o fato
  guarda quando é gravado. O que não foi capturado na venda não tem backfill, e
  [[gotcha-zero-venda-nao-se-distingue-de-terminal-morto]] é o caso já catalogado disso.
- **Multi-dispositivo é a razão de `D-02` ter fechado em D** ([[decision-d-02-arranjo-d]]), e é
  requisito de MVP, não de fase futura.

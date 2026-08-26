---
name: decision-produto-e-o-dono-do-backlog-no-jira
description: desde 2026-08-26 o agent produto é o dono do conteúdo de backlog no Jira e o único agent com o conector declarado; ATENÇÃO — a declaração no frontmatter NÃO surtiu efeito na sessão em que foi escrita, verifique antes de despachar
type: decision
escopo: processo
camada: processo
data: 2026-08-26
relaciona: [[decision-jira-e-o-registro-publico-da-tarefa]], [[reference-jira-projeto-spr]]
supera: [[decision-jira-e-o-registro-publico-da-tarefa]]
---

O agent **`produto`** é o **único** agent com o Jira nas ferramentas, e é o **dono do conteúdo de
backlog** lá: cria issue, edita título, descrição, escopo e critério de aceite, comenta, vincula,
recorta e funde. Decidido pelo humano em 2026-08-26.

**Por quê:** a regra anterior era "só o thread principal fala com o Jira", e ela estava apertada
demais — proibia **ver** o board para evitar **escrever** nele, e as duas coisas não são a mesma. O
motivo real sempre foi escrita concorrente (oito agents no mesmo fio), nunca acesso.

E a escolha de **quem** ganha o acesso não é arbitrária: a issue é um pedido de negócio antes de ser
um item de board. Quem recorta escopo e escreve critério de aceite é quem entende a regra. Com o
thread principal no meio, existia um intermediário entre a spec e o board — e intermediário
transcreve, resume e erra. Aconteceu na mesma sessão: o thread renomeou três cards pelo resumo sem
ler o corpo, e errou os três.

**O que NÃO mudou:** espelhamento de artefato de processo (plano, relatório, fechamento), transição
de status e atribuição de pessoa continuam sendo do thread principal. Os dois escrevem na mesma
issue sem colidir, porque escrevem coisas diferentes. Os outros seis agents continuam sem Jira.

**Como aplicar — as três travas, que são regra e não recomendação:**
1. **Escopo não muda sem prova citada na issue:** `path:linha` da spec, a regra em `.claude/rules/**`,
   ou resposta registrada do humano. "Faz mais sentido assim" é preferência, e preferência não move
   card que outra pessoa escreveu.
2. **Tarefa não se exclui porque alguém quer — inclusive o humano.** Exige as quatro partes de
   `00-nucleo.md` §12. A justificativa vai antes para `docs/produto/backlog-recortes.md`, porque na
   issue ela morreria junto com a exclusão. `produto` recomenda; **o humano autoriza**.
3. **Edição segue a régua da exclusão:** o que mudou, por que, contra o quê. Mudança de escopo
   preserva o texto anterior em comentário, que é append-only.

**Card mal escrito não é card desnecessário.** A pergunta é se a necessidade existe, não se o texto
está bom.

## Verificado em 2026-08-26, e o mecanismo NÃO subiu

As ferramentas do Jira foram declaradas no `tools:` de `.claude/agents/produto.md`. Um teste de fumaça
despachado **na mesma sessão** voltou com o `produto` reportando só `Read`, `Write`, `Edit`, `Grep`,
`Glob` — nenhuma do Jira, e **nem `ToolSearch`**, que também tinha sido acrescentada.

O `ToolSearch` faltando é o sintoma que importa: se o arquivo tivesse sido relido, ela estaria lá.
Logo a hipótese mais provável é que **o registro de agents é carregado uma vez, no início da sessão**,
e edição de frontmatter só vale para a sessão seguinte. A hipótese alternativa — o build recusar nome
de MCP em frontmatter — não explica a `ToolSearch` desaparecer.

**Não confirmado.** Antes de despachar `produto` contando com o Jira, **teste**: mande ele ler uma
issue conhecida e devolver o título. Se voltar o título, o mecanismo subiu. Se voltar a lista de cinco
ferramentas, ainda não.

**Caminho enquanto não subir:** `produto` recebe um **espelho do board em arquivo** (gerado pelo thread
principal) e devolve as mudanças como **instrução exata** — chave da issue, campo, e o texto novo
literal. O thread principal aplica **verbatim**, como digitador, sem reescrever nem resumir. A decisão
de conteúdo continua sendo do `produto`, que é o ponto da regra; só a digitação volta para o thread.

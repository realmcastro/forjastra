---
name: decision-produto-e-o-dono-do-backlog
description: o agent produto é o dono do conteúdo de backlog e o único que escreve em `docs/backlog/**`; desde 2026-09-11 isso não depende mais de conector externo, só de Write/Edit
type: decision
escopo: processo
camada: processo
data: 2026-09-11
relaciona: [[decision-backlog-e-o-registro-publico-da-tarefa]], [[reference-jira-projeto-spr]]
supera: [[decision-backlog-e-o-registro-publico-da-tarefa]]
---

O agent **`produto`** é o **dono do conteúdo de backlog** e o único agent que escreve em
`docs/backlog/**`: cria o item, edita título, objetivo, escopo e critério de aceite, aponta item
relacionado, recorta e funde, e mantém a linha do `docs/backlog/INDEX.md`. Decidido pelo humano em
2026-08-26, quando o backlog vivia no Jira; o endereço mudou em 2026-09-11, o papel não.

**Por quê:** o item é um pedido de negócio antes de ser uma linha de índice. Quem recorta escopo e
escreve critério de aceite é quem entende a regra. Com o thread principal no meio existia um
intermediário entre a spec e o backlog — e intermediário transcreve, resume e erra. Aconteceu na
sessão da decisão original: o thread renomeou três cards pelo resumo sem ler o corpo, e errou os
três. Os outros seis agents continuam de fora pelo motivo de sempre, que nunca foi acesso: oito
agents escrevendo o mesmo texto produz fio ilegível e concorrente.

**O que NÃO é dele:** a ficha em `tarefas/` — plano, relatório, fechamento, estado e
`tarefas/INDEX.md`. Isso é do thread principal, com o `orquestrador` decidindo o conteúdo do
fechamento.

**Como aplicar — as três travas, que são regra e não recomendação:**
1. **Escopo não muda sem prova citada no próprio item:** `path:linha` da spec, a regra em
   `.claude/rules/**`, ou resposta registrada do humano. "Faz mais sentido assim" é preferência, e
   preferência não move card que outra pessoa escreveu.
2. **Item não se exclui porque alguém quer — inclusive o humano.** Exige as quatro partes de
   `00-nucleo.md` §12, e a justificativa vai antes para `docs/produto/backlog-recortes.md`, porque no
   item ela morreria junto com a exclusão. `produto` recomenda; **o humano autoriza**. A trava vale
   mais agora, não menos: apagar arquivo é mais fácil que apagar card, e fora do git não deixa rastro.
3. **Edição segue a régua da exclusão:** o que mudou, por que, contra o quê. O texto anterior se
   preserva pelo git, desde que a mudança de escopo entre em commit próprio.

**Card mal escrito não é card desnecessário.** A pergunta é se a necessidade existe, não se o texto
está bom.

## O que ficou do mecanismo antigo, e por que não morde mais

Quando o backlog era o Jira, o papel dependia de o conector estar nas ferramentas do agent, e ele
**não subiu** na sessão em que foi declarado: um teste de fumaça despachado logo depois voltou com o
`produto` reportando só `Read`, `Write`, `Edit`, `Grep`, `Glob` — nenhuma ferramenta do Jira, e nem a
`ToolSearch`, que tinha sido acrescentada na mesma edição. A `ToolSearch` faltando é o sintoma que
importa: se o frontmatter tivesse sido relido, ela estaria lá. Hipótese mais provável, **não
confirmada**: o registro de agents carrega uma vez, no início da sessão, e edição de `tools:` só vale
da sessão seguinte em diante.

Isso deixou de bloquear em 2026-09-11: escrever em `docs/backlog/**` pede `Write` e `Edit`, que o
`produto` sempre teve. As ferramentas do Atlassian saíram do frontmatter dele na mesma passada. O que
continua útil é a armadilha: **mudança de `tools:` em agent pode não valer na sessão corrente** — se
um agent reportar ferramenta que você acabou de acrescentar como ausente, é esse o motivo, e o teste
é pedir a ele que use a ferramenta e diga o que voltou.

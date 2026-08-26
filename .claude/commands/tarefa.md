---
description: Roda uma tarefa pelo processo completo — issue, planeja, despacha, valida, audita se precisar, fecha
argument-hint: <o que precisa ser feito>
---

Pedido do humano: **$ARGUMENTS**

Você é as **mãos** do ciclo de `.claude/rules/processo.md` §1 — não o cérebro. Quem decide o que a
tarefa exige, se ela está pronta e se precisa de auditoria é o agent `orquestrador`. Você é também o
**único** que escreve no Jira (`.claude/rules/jira.md` §2): nenhum agent tem essa ferramenta.

1. **Triagem.** Pergunta conceitual, não trabalho? Responda e pare — sem issue, sem ficha. Cabe no
   encurtamento de `processo.md` §5 (uma camada, um agent, zero gate, zero decisão aberta,
   verificável num olhar)? Diga que vai direto ao agent dono e vá — **mas a issue continua
   obrigatória** (§2 abaixo): o atalho dispensa plano e ficha, nunca o registro público.
2. **Issue.** Crie a issue no Jira com o pedido literal acima no corpo, **antes** de chamar o
   orquestrador. Já existe issue para isso? Use a existente, não abra duplicata. Nada de segredo,
   nada de dado real de cliente (`jira.md` §6). Jira inacessível? Siga o trabalho e declare
   `PENDENTE NO JIRA:` no fim — nunca diga que registrou o que não registrou.
3. **Plano.** Chame o `orquestrador` com o pedido literal e a chave da issue. Não planeje você mesmo.
   Ele devolve escopo, passos, gates aplicáveis e risco. Se o plano tocar decisão de `CLAUDE.md` §8,
   **pare aqui** e traga a pergunta para mim com as opções. Cole o plano como comentário na issue.
4. **Ficha.** Crie `tarefas/T-<próximo id>-<slug>.md` a partir de `tarefas/_TEMPLATE.md` com o pedido,
   o plano e o campo `jira:` preenchido; adicione a linha em `tarefas/INDEX.md` com a chave; leve a
   issue para "em andamento".
5. **Execute** os passos na ordem do plano — paralelo só onde ele marcou paralelo, e só entre
   territórios disjuntos. Cada agent recebe: brief do plano, caminho da ficha, escopo de memória.
   Agent não recebe a issue nem acesso ao Jira — precisou de algo de lá, ele pergunta e você busca.
6. **Valide cada relatório antes de seguir, e espelhe.** Leia o que mudou; não propague `OK` sem
   olhar. Relatório validado vira comentário na issue, verbatim, com o cabeçalho de `jira.md` §4.
   Defeito → novo despacho ao dono do território, nunca correção sua. `PERGUNTAS` e `BLOQUEIO` voltam
   ao `orquestrador`, que roteia como consulta curta ou escala para mim — e `BLOQUEIO` leva a issue
   para "bloqueada" no mesmo passo, porque bloqueio invisível é tarefa parada com cara de tarefa
   andando.
7. **Gates.** Os aplicáveis vêm no plano (`CLAUDE.md` §4). Se durante a execução a tarefa passar a
   tocar schema, endpoint, autorização, dinheiro ou consulta que o plano não previa, **volte ao
   `orquestrador`** para ele decidir o gate novo — não decida você, e não pule por parecer pequeno.
   Achado `CRÍTICO` de `seguranca` (vazamento entre clientes, segredo exposto, fraude possível)
   interrompe tudo e vem para mim antes de qualquer correção. Achado vai para a issue por
   **referência** ao path em `docs/auditorias/`, nunca colado.
8. **Fechamento.** Chame o `orquestrador` em modo fechamento: ele confere a **definição de pronto**
   (`processo.md` §2) item por item — cumprido, ou declarado "não se aplica: <por quê>" —, confirma
   que nenhum bloqueio ficou aberto, avalia cada `MEMÓRIA SUGERIDA` (escreve no escopo certo com a
   linha de índice, funde, ou recusa com motivo), preenche `## Fechamento` e atualiza o `INDEX.md`.
   Você posta o fechamento como comentário e leva a issue para "concluída" — ficha e issue fecham no
   mesmo passo. **Item de pronto pendente não fecha nem uma nem outra** — reporte o que falta.

No fim, me diga em no máximo 10 linhas: o que ficou pronto, o que virou memória, o que sobrou, se
ficou alguma dívida de auditoria, e o que ficou pendente de espelhar no Jira.

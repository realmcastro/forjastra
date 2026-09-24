---
description: Roda uma tarefa pelo processo completo — item de backlog, planeja, despacha, valida, audita se precisar, fecha
argument-hint: <o que precisa ser feito>
---

Pedido do humano: **$ARGUMENTS**

Você é as **mãos** do ciclo de `.claude/rules/processo.md` §1 — não o cérebro. Quem decide o que a
tarefa exige, se ela está pronta e se precisa de auditoria é o agent `orquestrador`. Você é também o
dono da **ficha** e dos índices (`.claude/rules/backlog.md` §7): tudo mora no repositório, e o
relatório de cada agent entra na ficha **uma vez**, sem cópia em lugar nenhum.

1. **Triagem.** Pergunta conceitual, não trabalho? Responda e pare — sem item, sem ficha. Cabe no
   encurtamento de `processo.md` §5 (uma camada, um agent, zero gate, zero decisão aberta,
   verificável num olhar)? Diga que vai direto ao agent dono e vá — **mas o item continua
   obrigatório** (§2 abaixo): o atalho dispensa plano e ficha, nunca o registro.
2. **Item.** Crie `docs/backlog/F-<próximo nnn>-<slug>.md` com o pedido literal acima no corpo,
   **antes** de chamar o orquestrador, e a linha em `docs/backlog/INDEX.md` na mesma passada. Já
   existe item para isso? Use o existente, não duplique. Recorte, fusão ou reescrita do item são do
   `produto` (`backlog.md` §7) — você registra o pedido, não o reformula. Nada de segredo, nada de
   dado real de cliente (`backlog.md` §9).
3. **Plano.** Chame o `orquestrador` com o pedido literal e o identificador do item. Não planeje
   você mesmo. Ele devolve escopo, passos, gates aplicáveis e risco. Se o plano tocar decisão de
   `CLAUDE.md` §8, **pare aqui** e traga a pergunta para mim com as opções.
4. **Ficha.** Crie `tarefas/T-<próximo id>-<slug>.md` a partir de `tarefas/_TEMPLATE.md` com o pedido,
   o plano e o campo `backlog:` preenchido; adicione a linha em `tarefas/INDEX.md` com o
   identificador, e aponte a linha do item para a ficha.
5. **Execute** os passos na ordem do plano — paralelo só onde ele marcou paralelo, e só entre
   territórios disjuntos. Cada agent recebe: brief do plano, caminho da ficha, escopo de memória.
   Agent não lê `docs/backlog/` — precisou de algo de lá, ele pergunta e você busca.
6. **Valide cada relatório antes de seguir.** Leia o que mudou; não propague `OK` sem olhar.
   Relatório validado entra na ficha **verbatim**, na seção do agent — resumir ali é a única perda
   possível agora, e não há mais ferramenta para culpar. Defeito → novo despacho ao dono do
   território, nunca correção sua. `PERGUNTAS` e `BLOQUEIO` voltam ao `orquestrador`, que roteia como
   consulta curta ou escala para mim — e `BLOQUEIO` põe a ficha em `bloqueada` e nomeia a pergunta
   que trava, com a data, na linha do `docs/backlog/INDEX.md`, no mesmo passo: bloqueio invisível é
   tarefa parada com cara de tarefa andando.
7. **Gates.** Os aplicáveis vêm no plano (`CLAUDE.md` §4). Se durante a execução a tarefa passar a
   tocar schema, endpoint, autorização, dinheiro ou consulta que o plano não previa, **volte ao
   `orquestrador`** para ele decidir o gate novo — não decida você, e não pule por parecer pequeno.
   Achado `CRÍTICO` de `seguranca` (vazamento entre clientes, segredo exposto, fraude possível)
   interrompe tudo e vem para mim antes de qualquer correção. Achado entra na ficha por
   **referência** ao path em `docs/auditorias/`, nunca colado.
8. **Fechamento.** Chame o `orquestrador` em modo fechamento: ele confere a **definição de pronto**
   (`processo.md` §2) item por item — cumprido, ou declarado "não se aplica: <por quê>" —, confirma
   que nenhum bloqueio ficou aberto, avalia cada `MEMÓRIA SUGERIDA` (escreve no escopo certo com a
   linha de índice, funde, ou recusa com motivo), preenche `## Fechamento` no formato de
   `backlog.md` §10 e atualiza `tarefas/INDEX.md`. Você atualiza a linha do item em
   `docs/backlog/INDEX.md` — ficha e item fecham no mesmo passo. **Item de pronto pendente não fecha
   nem a ficha nem o item** — reporte o que falta.

No fim, me diga em no máximo 10 linhas: o que ficou pronto, o que virou memória, o que sobrou, se
ficou alguma dívida de auditoria, e o que ficou em aberto esperando decisão minha.

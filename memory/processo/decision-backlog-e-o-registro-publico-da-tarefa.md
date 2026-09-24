---
name: decision-backlog-e-o-registro-publico-da-tarefa
description: desde 2026-09-11 o registro do trabalho é `docs/backlog/` (item antes do plano) mais a ficha `T-000n` com campo `backlog:`; espelhamento acabou junto com o Jira — plano, relatório e fechamento moram na ficha uma vez só
type: decision
escopo: processo
camada: processo
data: 2026-09-11
relaciona: [[convention-claude-md-e-so-panorama]], [[state-execucao-solo-2026-09-11]], [[reference-jira-projeto-spr]]
---

O registro do trabalho mora no repositório, em dois lugares e sem cópia entre eles: **`docs/backlog/`**
guarda um arquivo por item do que ainda não começou; **`tarefas/`** guarda a ficha do que está ou
esteve em execução. Item existe **antes** do Plano de Despacho, inclusive no atalho de `processo.md`
§5 — o atalho dispensa plano e ficha, nunca o item.

A ficha mantém `T-000n` e ganhou o campo `backlog:`, com `F-<nnn>` para item novo ou `SPR-<n>` para
um dos 56 migrados. Recusada, de novo, a alternativa de usar o identificador do item como nome da
ficha: renomearia as fichas fechadas e amarraria o `git log` a uma numeração que já mudou uma vez.

**Por quê:** de 2026-08-26 a 2026-09-11 o registro público foi o Jira, com espelhamento verbatim de
plano, relatórios e fechamento em comentário append-only. A escolha estava certa para três pessoas: o
board era o único lugar onde quem não abria o repositório via o trabalho andar. Com a execução solo
([[state-execucao-solo-2026-09-11]]), o board virou um segundo lugar onde a verdade mora, com o custo
de sincronizar e o risco de as duas cópias divergirem em silêncio. Notificação, quadro visual e
acesso de quem não tem o repositório eram os três ganhos reais, e nenhum tinha usuário.

O que o espelhamento protegia — cópia editada em silêncio produzindo duas verdades — deixou de ser um
risco pela raiz: não há mais cópia. A ficha é append-only por construção (cada agent acrescenta a sua
seção e nunca toca na de outro) e o histórico de verdade é o git.

**Como aplicar:** o protocolo inteiro está em `.claude/rules/backlog.md` — não o reproduza aqui. O
que esta memória guarda e a regra não repete: **tudo no repositório não é menos disciplina, é mais.**
Sem ferramenta que cobre item faltando ou status parado, a cobrança é inteiramente do processo, e
trabalho sem item e sem ficha some para a próxima sessão, que não tem a memória desta. Continua
valendo que agent especialista não escreve no registro de backlog — o motivo nunca foi a ferramenta,
foi escrita concorrente no mesmo texto.

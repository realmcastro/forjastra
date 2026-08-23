---
name: convention-criterio-de-operacao-sensivel
description: operação sensível é a que é irreversível ou não conferível depois, não a que "move dinheiro" — por isso reimpressão de via entra, e por isso o registro é precondição do ato e não subproduto
type: convention
escopo: plataforma
camada: seguranca
data: 2026-08-23
relaciona: [[business-rule-ato-ordinario-versus-operacao-sensivel]]
tarefa: T-0003
---

O critério de "operação sensível" é **irreversível ou não conferível depois**. Reimpressão fiscal não
move um centavo e é exatamente o que não se confere depois — entra. `docs/produto/glossario.md`
passou a cobri-la, e o par que cedeu foi o **glossário**, não `RN-NUC-032`: quando a definição e a
regra discordaram, a regra estava certa e a definição estava estreita.

**Por quê:** "move dinheiro" é o critério mais fácil de escrever e deixa fora as duas classes que mais
doem — entregar de novo o que comprova um fato, e alterar fato já concluído. Cada operação que escapa
da lista escapa também da autorização de papel **e** do registro de auditoria, que é o par exigido
por `.claude/rules/seguranca.md` §2 e por `RN-NUC-029`.

**Como aplicar:** ao classificar operação nova, pergunte "dá para desfazer? dá para conferir depois
que aconteceu?". Duas respostas negativas: sensível. E o registro é **precondição** do ato, não
subproduto dele — sem registro, o ato não acontece.

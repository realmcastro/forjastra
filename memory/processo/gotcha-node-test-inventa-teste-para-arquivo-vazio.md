---
name: gotcha-node-test-inventa-teste-para-arquivo-vazio
description: no node --test 22, arquivo de teste sem nenhum caso sai como um teste que passa com o nome do caminho e entra no # pass; gate que confere arquivo vivo por nome precisa excluir esse teste, senão um arquivo esvaziado conta como exercido
type: gotcha
escopo: processo
camada: processo
data: 2026-09-23
relaciona: [[convention-exclusao-se-prova-com-o-excluido-hostil]]
tarefa: T-0009
---

Medido em `db/migrator` em 2026-09-23. Sintoma: esvaziar um arquivo que exerce o banco não derruba
um gate que confere "cada arquivo vivo executou ao menos um teste", porque o `node --test` cria um
teste sintético que passa.

**Como aplicar:** o relator por arquivo descarta o teste cujo nome é o caminho do próprio arquivo. O gate
de `apps/api` (`scripts/gate-reporter.mjs`) ainda não faz isso em 2026-09-23. Condições que não
envelhecem: `pass === total`, `todo` reprova, lista nomeada de arquivos vivos, e arquivo que usa o banco
fora da lista ou fora do glob reprova.

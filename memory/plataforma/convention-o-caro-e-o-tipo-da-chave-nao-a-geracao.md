---
name: convention-o-caro-e-o-tipo-da-chave-nao-a-geracao
description: ao escolher identificador, decida o tipo da coluna com cuidado e a regra de geração com leveza — trocar v4 por v7 ou ULID é código e um deploy, trocar `uuid` por `bigint` é expand/contract em N schemas de cliente
type: convention
escopo: plataforma
camada: dados
data: 2026-09-11
relaciona: [[decision-d-04-chave-timestamps-exclusao]], [[decision-migrations-forward-only]]
tarefa: T-0009
---

Duas decisões moram dentro de "que identificador usar", e elas têm custos de reversão que diferem em
ordens de grandeza:

- **O tipo da coluna** (`uuid` · `bigint` · `text` · composto) é DDL. Mudar depois é o ciclo
  expand/contract de `migrations.md` §4, multiplicado por N schemas, em quatro etapas e releases
  separados, com backfill.
- **A regra de geração** (v4 · v7 · ULID · qualquer esquema de 128 bits) é código. Mudar depois é um
  deploy, e linhas velhas continuam válidas porque o tipo não mudou.

**Por quê:** a discussão natural puxa para a geração, que é onde estão os números bonitos e os
artigos. Ela é a metade barata. A escolha que merece a análise é a que não se desfaz.

**Como aplicar:** ao comparar candidatos a identificador, ordene por custo de reversão antes de
ordenar por desempenho. Empate técnico entre um tipo que preserva opções e um que não preserva se
resolve pelo que preserva, mesmo quando o outro mede melhor. Foi assim que `D-04` fechou.

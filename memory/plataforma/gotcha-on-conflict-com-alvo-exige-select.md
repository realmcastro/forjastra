---
name: gotcha-on-conflict-com-alvo-exige-select
description: papel só com INSERT leva permission denied em ON CONFLICT (col) DO NOTHING mesmo com chave nova; sem alvo funciona mas engole qualquer UNIQUE; o seguro é INSERT simples com 23505 reconhecido pelo nome da PK
type: gotcha
escopo: plataforma
camada: dados
data: 2026-09-23
relaciona: [[decision-d-06-ii-trilha-no-platform-com-projecao-no-cliente]], [[gotcha-23505-sem-read-back-acusa-reenvio-legitimo]]
tarefa: T-0019
---

Medido em PostgreSQL 16.15: com alvo de conflito, o servidor precisa ler a coluna do alvo, então exige
`SELECT` mesmo que a linha não exista. Sem alvo, basta `INSERT`, mas qualquer violação de restrição
única vira "nada aconteceu".

**Como aplicar:** gravador só com `INSERT` (trilha, fato) usa `INSERT` simples. `23505` com o nome da
restrição da chave primária é "já gravado". Qualquer outra restrição sobe como erro. O `23505` não
carrega o valor da chave.

---
name: gotcha-typmod-numeric-arredonda-em-silencio
description: `numeric(p,s)` arredonda a casa excedente (metade para longe do zero) antes de qualquer CHECK; `17.925` vira `17.93` e o banco decide o centavo no lugar da regra de arredondamento
type: gotcha
escopo: plataforma
camada: dados
data: 2026-09-23
relaciona: [[decision-dinheiro-e-quantidade]]
tarefa: T-0018
---

Medido em PostgreSQL 16.15: inserir `17.925` numa coluna `numeric(14,2)` grava `17.93`, sem erro, e um
`CHECK` na coluna já vê o valor arredondado. O sintoma é centavo divergente entre o que o servidor
calculou com a regra do cliente e o que o banco guardou.

**Por quê:** o typmod é aplicado na coerção de entrada, antes das constraints.

**Como aplicar:** envelope de escala por domínio com `CHECK (min_scale(VALUE) <= n)` sobre `numeric`
sem modificador. Casa a mais vira recusa, e o arredondamento fica com o código, com modo explícito.

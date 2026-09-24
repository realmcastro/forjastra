---
name: gotcha-envelope-de-escala-usa-min-scale
description: CHECK de envelope de casas decimais usa `min_scale()`, não `scale()`: com `scale()`, `17.900` é recusado num envelope de 2 casas porque o zero à direita conta
type: gotcha
escopo: plataforma
camada: dados
data: 2026-09-23
relaciona: [[decision-dinheiro-e-quantidade]]
tarefa: T-0018
---

`scale('17.900'::numeric)` é 3, então `CHECK (scale(VALUE) <= 2)` recusa um valor que tem duas casas
significativas. `min_scale()` (PostgreSQL 13+) devolve 1 para `17.900` e mede o que importa.

**Como aplicar:** todo domínio de envelope usa `min_scale(VALUE) <= n`.

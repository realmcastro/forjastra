---
name: gotcha-check-com-nulo-e-transicao-livre
description: CHECK aceita linha em que a expressão dá NULL; restrição de transição ou de período sobre coluna anulável passa livre quando o anterior é nulo, e precisa de coalesce e IS NOT DISTINCT FROM
type: gotcha
escopo: plataforma
camada: dados
data: 2026-09-23
tarefa: T-0022
---

Achado ao escrever a máquina de estados da habilitação (`tenant/0006`). `CHECK (a = b)` com `b` nulo é
satisfeito. Toda regra de transição escrita como CHECK trata o nulo de propósito.

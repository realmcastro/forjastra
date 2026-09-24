---
name: gotcha-float-apaga-o-empate-do-arredondamento
description: em ponto flutuante 0,35 × 29,90 = 10,464999…, o empate some e half_up dá 10,46 em vez de 10,47; 0,020 × 27,25 fica acima da metade e half_even erra para 0,55; valor de dinheiro nunca passa por number
type: gotcha
escopo: plataforma
camada: backend
data: 2026-09-23
relaciona: [[decision-dinheiro-e-quantidade]]
tarefa: T-0021
---

Medido na implementação de `packages/contracts` (`T-0021`). O sintoma é centavo divergente em um dos
modos de `RN-NUC-067`, e o modo que erra muda conforme o caso. Não existe um modo "seguro" em float.

**Como aplicar:** composição de valor só pelo módulo de ponto fixo com `BigInt`. Linha exata passa por
`exactToMoney` e só exige modo publicado quando vier `requires-rounding`.

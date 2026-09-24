---
name: gotcha-resposta-constante-nao-e-hash-igual
description: pagar o custo do verificador no caminho de alça inexistente não iguala o tempo entre recusas; gravar o fato de recusa antes da resposta custou ~4 ms p50 medidos, e o pool sob carga só espera no caminho que existe; o que iguala é piso fixo de tempo e fato fora do caminho da resposta
type: gotcha
escopo: plataforma
camada: seguranca
data: 2026-09-23
relaciona: [[decision-d-03-opcao-c-sujeito-local-ao-cliente]]
tarefa: T-0015
---

`IDN-03` do gate de `D-03`, medido em PostgreSQL 16.15 com `pg` 8.23.0. O p10 do caminho com fato ficou
acima do p90 do caminho sem fato. Em produção, com rede entre aplicação e banco, a diferença cresce.

**Como aplicar:** resposta de recusa com piso fixo de tempo, o fato gravado fora do caminho da resposta,
e o mesmo limitador e o mesmo pool para as duas classes de recusa.

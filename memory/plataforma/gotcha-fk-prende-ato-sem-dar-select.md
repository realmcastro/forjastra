---
name: gotcha-fk-prende-ato-sem-dar-select
description: chave estrangeira composta NOT NULL prende a linha do ato à intenção sem dar SELECT ao ator, porque a checagem de FK roda como dono da tabela e a violação sai sem o valor da chave (medido em 16.15)
type: gotcha
escopo: plataforma
camada: dados
data: 2026-09-23
relaciona: [[decision-d-06-ii-trilha-no-platform-com-projecao-no-cliente]]
tarefa: T-0019
---

Medido na reauditoria de `T-0019` (R8a–R8c), que fecha `TRL-09`: a linha do ato sem intenção é recusada, e
com intenção de outro cliente também, e o ator grava sem ter `SELECT` na tabela da intenção.

**Como aplicar:** para amarrar um ato à sua autorização registrada sem ampliar leitura, use FK composta
`NOT NULL` (inclua o cliente na chave), e não verificação no código.

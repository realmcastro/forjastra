---
name: gotcha-numeric-em-json-e-array-vira-float-no-driver
description: pelo driver `pg`, `numeric[]`/`array_agg(numeric)` chegam ao Node como float (OID 1231 com parseFloat), e valor em JSON montado no SQL ou guardado em jsonb perde centavo no JSON.parse
type: gotcha
escopo: plataforma
camada: backend
data: 2026-09-23
relaciona: [[decision-dinheiro-e-quantidade]]
tarefa: T-0018
---

Medido com `pg` 8.23.0 / `pg-types` 2.2.0: `numeric` escalar (OID 1700) e `bigint` (OID 20) chegam como
`string`, mas `numeric[]` (OID 1231) passa por `parseFloat` (`textParsers.js:189`). E `to_json`/`json_agg`
de valor montado dentro do SQL volta pelo `JSON.parse` do driver: `90071992547409.93` virou `.94`. O mesmo
vale para valor gravado como número dentro de `jsonb`.

**Como aplicar:** no caminho de requisição, valor nunca é agregado em array nem montado em JSON no SQL;
em `jsonb` ele vai como string. Não registrar `setTypeParser` global para 1700 ou 1231: ele vale para o
processo inteiro e age escondido.

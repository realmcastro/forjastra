---
name: gotcha-pg-identify-object-schema-nulo-em-regra-gatilho-default
description: pg_identify_object devolve schema nulo para regra de reescrita, gatilho e default de coluna; pergunta que decide "o objeto mora em que schema" resolve pelo catálogo da tabela dona, senão o objeto escapa do filtro por schema
type: gotcha
escopo: plataforma
camada: dados
data: 2026-09-23
tarefa: T-0009
---

Achado ao escrever a pergunta de delegação por dono de objeto (`SUB-09`, `db/delegacao-por-dono.md`
§7.5.6). Regra, gatilho e default não têm namespace próprio: pertencem à tabela. Um filtro
`WHERE schema = ...` sobre `pg_identify_object` deixa os três de fora sem erro.

**Como aplicar:** para esses três, o schema é o da relação dona (`pg_rewrite.ev_class`,
`pg_trigger.tgrelid`, `pg_attrdef.adrelid` → `pg_class.relnamespace`).

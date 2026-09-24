---
name: gotcha-format-type-qualifica-dominio-fora-do-search-path
description: format_type qualifica o domínio com o schema (sai t_probe.money_amount), então a impressão estrutural de cada cliente diverge da referência na primeira coluna de domínio; e a restrição de domínio (conrelid 0) não aparece em impressão por tabela, então envelope afrouxado à mão passaria sem aviso
type: gotcha
escopo: plataforma
camada: dados
data: 2026-09-23
tarefa: T-0022
---

Corrigido em `db/migrator/src/structure-print.ts` (`T-0022`): o nome do domínio sai sem schema, e as
restrições de domínio ganham linha própria. Medido: o `verify` sai `3` com o envelope afrouxado à mão.

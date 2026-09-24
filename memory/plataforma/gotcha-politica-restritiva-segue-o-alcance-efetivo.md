---
name: gotcha-politica-restritiva-segue-o-alcance-efetivo
description: política RLS TO grupo vale para quem tem os privilégios do grupo; o fail-open vem de membro sem herança ou fora do grupo com privilégio próprio, e se confere pelo alcance efetivo (has_table_privilege / has_any_column_privilege), nunca pela ACL que nomeia o papel
type: gotcha
escopo: plataforma
camada: seguranca
data: 2026-09-23
relaciona: [[decision-d-06-ii-trilha-no-platform-com-projecao-no-cliente]]
tarefa: T-0019
---

Medido em PostgreSQL 16.15 (F.1 M14 e reauditoria R4a–R7 de `T-0019`): `SELECT` concedido direto a membro
**com** herança continua restrito pela política; membro **sem** herança com privilégio direto lê tudo.
Quatro derivas passavam por uma pergunta de `verify` escrita sobre a ACL (`TRL-07`).

**Como aplicar:** privilégio só ao grupo; o `verify` afirma a bijeção papel↔grupo com herança, RLS em toda
relação que o papel alcança efetivamente, e o número exato de políticas na tabela.

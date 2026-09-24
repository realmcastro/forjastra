---
name: gotcha-default-privileges-entrega-insert-na-projecao
description: tabela de projeção criada no schema do cliente nasce com INSERT, SELECT e UPDATE para o papel do cliente por ALTER DEFAULT PRIVILEGES (medido em 16.15); sem REVOKE na mesma transação, o caminho de requisição do cliente planta a própria versão
type: gotcha
escopo: plataforma
camada: seguranca
data: 2026-09-23
relaciona: [[decision-d-05-autoridade-no-platform-projecao-no-cliente]], [[decision-d-06-ii-trilha-no-platform-com-projecao-no-cliente]]
tarefa: T-0020
---

Medido no caso G4 de `docs/arquitetura/d-05-catalogo-fiscal-2026-09-23.md`. Vale para toda tabela que o
cliente só deve ler: a projeção do catálogo fiscal e a projeção da trilha de `D-06`(ii).

**Como aplicar:** a migration que cria a tabela revoga na mesma transação. O `verify` afirma a ausência
de `INSERT`/`UPDATE` no papel do cliente com `pg_has_role(..., 'SET')`, porque `has_table_privilege`
não vê o alcançável por `SET ROLE` sob `NOINHERIT`.

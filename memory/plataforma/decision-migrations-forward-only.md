---
name: decision-migrations-forward-only
description: Migration é forward-only e nunca destrutiva: arquivo aplicado jamais é editado, nada é dropado/renomeado/truncado por um agent, e remover algo é o passo 4 de um ciclo expand→duplicar→preencher→contrair, em release separado e com aprovação do humano.
type: decision
escopo: plataforma
camada: dados
data: 2026-08-22
relaciona: [[decision-tenancy-schema-por-cliente]]
---

O ciclo de vida do banco é forward-only, com ledger em `platform.schema_migrations` (schema,
version, checksum, applied_at, module). Regra normativa completa: `.claude/rules/migrations.md`.

**Por quê:** o mesmo arquivo roda em N schemas de N clientes. Editar migration já aplicada produz
dois bancos com a mesma versão e conteúdo diferente — divergência que só aparece quebrando em
produção, num cliente só. E DDL destrutivo num PDV em operação não é "downtime": é caixa parado com
fila na frente. Por isso o checksum é erro fatal, a aplicação é por `(schema, version)` e retomável,
e coluna morta fica (custo ~zero) em vez de ser removida por conveniência.

**Como aplicar:** toda migration é idempotente e testada nos três casos — schema vazio, schema com
dado, rodada duas vezes. `lock_timeout` sempre. Índice em tabela quente com `CREATE INDEX
CONCURRENTLY`, sozinho numa migration não-transacional. Backfill é job em lotes, fora da migration
de DDL. Nenhuma migration é condicional a cliente: o que varia entre clientes é módulo ativo e dado,
nunca DDL ad hoc.

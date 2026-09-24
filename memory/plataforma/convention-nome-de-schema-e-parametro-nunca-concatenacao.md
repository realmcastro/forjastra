---
name: convention-nome-de-schema-e-parametro-nunca-concatenacao
description: o executor de migration é o único lugar do sistema que interpola identificador de schema, e ele o faz com o nome chegando por bind parameter mais citação pelo próprio Postgres (`format('%I')` / `quote_ident`), nunca por concatenação — provado em 2026-09-11 contra slug hostil, em banco real
type: convention
escopo: plataforma
camada: dados
data: 2026-09-11
relaciona: [[decision-tenancy-schema-por-cliente]], [[decision-d-04-chave-timestamps-exclusao]]
tarefa: T-0009
---

`CREATE SCHEMA` e `SET search_path` não aceitam parâmetro no lugar do identificador, então o executor
de migration é a **única** exceção do sistema à proibição de montar SQL com nome vindo de fora
(`00-nucleo.md` §8). A exceção é mecanizada, não confiada:

- **nenhum identificador é composto por código do cliente.** O nome atravessa como bind parameter
  para o **servidor**, e **quem cita é o Postgres**, nunca aspas escritas à mão;
- quando o nome entra como **valor** (`search_path`), a citação é `quote_ident`;
- quando o nome precisa estar **dentro** do comando, `CREATE SCHEMA` **não aceita bind parameter** —
  isso foi medido, é erro de sintaxe. A forma é pedir ao servidor o **texto do comando**
  (`SELECT format('CREATE SCHEMA %I', $1)`) e enviar verbatim o que ele devolveu. O cliente continua
  não compondo identificador: ele transporta texto que o próprio Postgres citou;
- o slug é validado contra a forma aceita antes de chegar aqui, e a validação é a segunda linha de
  defesa, não a primeira.

> **Corrigido em 2026-09-11.** A primeira redação dizia apenas "o nome chega por bind parameter", o
> que é **mais forte do que o Postgres permite** para `CREATE SCHEMA`. Uma convenção que descreve um
> mecanismo impossível não protege: ela é descoberta como falsa por quem implementa, no pior momento,
> e o caminho mais curto naquele instante é a concatenação. Achado pela auditoria (`MIG-16`).

**A prova, e ela foi rodada:** em 2026-09-11, contra Postgres 16.15, com o slug hostil
`t_x"; drop table probe_result; --`. O resultado foi um schema criado com esse nome **literal**,
nenhum comando extra executado, e a tabela alvo do `drop` intacta com as cinco linhas que tinha.

**Como aplicar:** qualquer código novo que precise nomear schema dinamicamente usa este mecanismo e
cita este registro. Código que constrói o nome com `+` ou template string é achado, mesmo que o slug
"venha de lugar confiável" — em multi-tenant, a diferença entre schema errado e schema hostil é a
mesma linha.

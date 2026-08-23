---
name: decision-tenancy-schema-por-cliente
description: Multi-tenant por um schema Postgres por cliente (`t_<slug>`) mais um schema `platform` de controle; nenhuma consulta cruza schema, migration roda N vezes de forma idempotente e retomável.
type: decision
escopo: plataforma
camada: dados
data: 2026-08-22
relaciona: [[decision-migrations-forward-only]], [[decision-forja-e-pdv-modular]]
---

Postgres. Um **schema por cliente** (`t_<slug>`), mais o schema **`platform`** com o registro de
clientes, módulos ativos e versões de migration aplicadas por schema.

Alternativas recusadas: schema único com `tenant_id` + RLS (mais simples de operar, mas um `WHERE`
esquecido ou um bug de RLS vaza dado entre clientes, e não há como demonstrar isolamento a um
cliente que pergunta); um banco por cliente (isolamento máximo, custo e complexidade de operação
altos para carteira de clientes pequenos/médios).

**Por quê:** o pior defeito possível neste sistema é um cliente ver dado de outro. Schema separado
dá isolamento demonstrável sem multiplicar bancos, e mantém migration como um processo só, rodado N
vezes. O preço aceito é: nenhum `JOIN` entre clientes, então relatório consolidado exige agregação
explícita no `platform`.

**O que o schema NÃO isola (acrescentado em 2026-08-23, gate de `seguranca` da T-0003):** o schema
isola **cliente**, não **estabelecimento**. Um cliente com duas pessoas jurídicas tem as duas no mesmo
schema, e a auditoria de autorização apontou aí o único ponto frouxo — `RN-NUC-018` já o nomeia como
"o vazamento que nenhuma das defesas de isolamento por cliente pega". Entre estabelecimentos do mesmo
cliente não existe defesa **estrutural**: só verificação explícita de escopo. Dois caminhos concretos
já achados: referência humana de venda, que é única só **dentro** do estabelecimento (`AUT-01`), e
regra dona que concede a travessia afirmativamente (`AUT-08`). Chave de cache, de fila, de log e de
exportação carrega **cliente e estabelecimento**; chave sem o segundo é vazamento dentro de um cliente.

**Como aplicar:** o schema é resolvido pela identidade autenticada, na borda, uma vez — nunca de
body, query, header livre ou path. Toda migration declara alvo (`platform` **ou** cliente, nunca os
dois) e referencia o schema explicitamente (`search_path` não é segurança). Nenhuma tabela de
cliente no `platform` e vice-versa. Consolidado nunca é `JOIN` entre schemas de cliente.

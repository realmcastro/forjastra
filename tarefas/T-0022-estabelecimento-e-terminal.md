---
id: T-0022
backlog: F-021
titulo: Modelar estabelecimento e terminal habilitado no schema de cliente
status: aberta
escopo: cliente=- vertical=- modulo=- camada=dados
aberta_em: 2026-09-23
---

## Pedido

"depois disso começe realmente, chega de papear!" (humano, 2026-09-23).

## Plano

## PLANO: T-H (T-0021), estabelecimento e terminal no schema de cliente
BACKLOG: F-021
PRÉ-REQUISITOS: `T-0009` fechada (gate de volta); A.2a (fuso, moeda, 042, 043); T-E decidida; T-B decidida (terminal habilitado e eixo E3); T-F decidida ou declarada independente.
PASSOS:
1. `arquiteto-dados`
   - **Brief:** primeiras migrations de cliente (`establishment`, `terminal`, `sales_enabled_terminal`), mais a coluna de fuso e moeda onde A.2a decidir. Se ela for do `platform`, é migration separada.
   - Registrar as convenções de T-E em `db/convencoes.md`.
   - Checklist de `migrations.md` §10; as ausências declaradas no topo; os três testes (vazio, com dado, duas vezes).
   - **Entrega:** `db/migrations/tenant/*`, com o resultado dos testes.
2. `seguranca`: gate 2 (isolamento, IDOR por `uuid`). **Entrega:** `docs/auditorias/`.
GATES: 2.

Nota do thread (2026-09-23): o pré-requisito "`T-0009` fechada" foi relaxado. O `PAP-28` segue aberto e
suspenso por bloqueio da ferramenta, e ele trata da declaração da credencial, não das tabelas de cliente.
As outras pré-condições estão cumpridas: `T-0014` A.2a (fuso, moeda, `RN-NUC-057`…`061`), `T-0018`
(dinheiro), `T-0015` (`D-03` C, `IDN-01`), `T-0019` (a trilha não é dependência hoje).

## Fechamento

—

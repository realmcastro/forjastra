# SPR-38 — Construir o executor de migration: forward-only, idempotente, N schemas, retomável

**Tipo:** História · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-09-30
**Agrupador:** SPR-34

---

## Objetivo

Construir o executor de migration: aplica SQL versionado em N schemas de cliente, retomável, com livro-razão por `(schema, versão)`.

## Escopo

* Fila de migrations por schema, na ordem
* **Transacional dentro de um schema** — aplica inteira ou nada
* **Retomável:** falha em schema 7 de 20 deixa os 6 primeiros aplicados
* **Tempo limite de trava sempre definido:** melhor falhar e retomar que travar o caixa
* Suporte a migration **não-transacional** (ex: Índice concorrente)
* **Nenhuma migration é condicional a cliente** — todos convergem para mesma estrutura
* Provisionar cliente novo = rodar tudo do zero + módulos contratados

## Critério de aceite

1. Aplica migrations do núcleo em N schemas do zero sem erro.
2. Falha no meio da fila (ex: schema 4 de 10) deixa os anteriores aplicados.
3. Rodar de novo complete a fila sem duplicar efeito.
4. Migration com `lock_timeout` definido aplica sem bloquear caixa.
5. Migration não-transacional (declarada) roda fora de transação; falha deixa índice inválido que retomada pode derrubar e recriar.

## Depende de

SPR-36 (schema de controle) — o livro-razão mora lá.

## Proibido

Migration condicional a cliente (`if cliente = X`). Remoção de tabela/coluna, renome, mudança de tipo com perda — viem pelo ciclo de quatro etapas (`migrations.md` §4).

## Fora de escopo

ORM ou query builder — o executor é SQL puro. Decisão de ORM é SPR-52 (aberta agora).

## Gate obrigatório

Segurança (isolamento de tenant).

## Referências

`.claude/rules/migrations.md` inteira, especial §1, §2, §3, §5, §10

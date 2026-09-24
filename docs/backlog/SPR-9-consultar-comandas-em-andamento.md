# SPR-9 — Consultar comandas em andamento

**Tipo:** História · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-11-13
**Agrupador:** SPR-5

---

## Objetivo

Permitir que quem opera visualize as comandas em andamento, escopadas ao cliente e ao estabelecimento resolvidos pela identidade autenticada — nunca por identificador informado no pedido (`RN-NUC-038`, `docs/produto/nucleo-venda.md:294`).

## Escopo

* Listagem identifica o alvo (mesa, ficha/cartão ou nome de exibição) e o número da comanda.
* A partir da listagem, é possível acessar uma comanda para adicionar ou alterar itens.
* Comandas canceladas ou encerradas não aparecem como disponíveis para novos lançamentos.

## Fora de escopo

Criação de comanda (`SPR-6`, `SPR-7`, `SPR-8`). Encerramento (`SPR-13`).

## Critério de aceite

Consultar um alvo que não existe no escopo do operador e consultar um que existe em **outro** escopo devolvem a mesma resposta — nenhuma das duas revela existência do outro (proteção contra enumeração por escopo).

## Depende de

Se "em andamento" inclui comanda de ontem que ninguém fechou depende de `LACUNA-NUC-038` — o ciclo de vida do pedido (aberto, retirado, abandonado) ainda não tem decisão do humano (`memory/plataforma/state-pendencias-abertas-2026-08-23.md` §3.1). Não decidido aqui.

## Gate obrigatório

Performance — tela de lista: paginação obrigatória, total agregado na mesma consulta (nunca uma consulta por comanda), índice no filtro de estado/turno, medido no maior cliente (`.claude/rules/performance.md` §2–§3).

## Referências

`docs/produto/nucleo-venda.md:294` · `memory/plataforma/state-pendencias-abertas-2026-08-23.md` §3.1

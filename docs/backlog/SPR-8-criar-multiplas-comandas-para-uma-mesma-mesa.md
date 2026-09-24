# SPR-8 — Criar múltiplas comandas para uma mesma mesa

**Tipo:** História · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-11-13
**Agrupador:** SPR-5

---

## Objetivo

Permitir múltiplas comandas simultâneas numa mesma mesa, por escolha explícita de quem opera, cada uma com itens e valores independentes.

## Escopo

* Ao encontrar alvo já com consumo aberto, o sistema apresenta o existente e exige escolha explícita entre lançar nele ou abrir um segundo (`RN-MSA-002`, caminho infeliz, `docs/produto/modulos/mesa-comanda.md:107`).
* As comandas resultantes ficam distinguíveis por quem opera (exemplo: Mesa 10 → Comanda 1 e Comanda 2), com identificação incremental dentro da mesa.
* Itens e valores de cada comanda são independentes entre si.

## Fora de escopo

Iniciar a primeira comanda de uma mesa (`SPR-6`). Transferir comanda entre mesas (`SPR-10`).

## Critério de aceite

Existir uma comanda aberta numa mesa não impede abrir uma segunda, desde que a escolha seja explícita e registrada; as duas nunca compartilham item ou valor.

## Depende de

A identificação incremental por mesa depende de `G-06` — mesma pendência de `SPR-6`, pergunta ao humano, vence 2026-11-13 (`docs/produto/backlog-lacunas-g01-g09.md` §8). Não decidida aqui.

## Referências

`docs/produto/modulos/mesa-comanda.md:107` · `docs/produto/backlog-lacunas-g01-g09.md` §8

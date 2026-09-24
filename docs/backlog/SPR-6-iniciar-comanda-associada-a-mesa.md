# SPR-6 — Iniciar comanda associada a mesa

**Tipo:** História · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-11-13
**Agrupador:** SPR-5

---

## Objetivo

Permitir iniciar uma comanda associada a uma mesa, com identificador técnico próprio e independente do número da mesa — a mesa é o identificador **operacional**, nunca o identificador único (módulo `MSA`, `docs/produto/modulos/mesa-comanda.md`).

## Escopo

* Iniciar comanda informando uma mesa.
* A comanda recebe identificador técnico próprio, distinto do número da mesa.
* A comanda recebe identificação incremental dentro do contexto da mesa (exemplo: Mesa 10 → Comanda 1, Comanda 2, Comanda 3).

## Fora de escopo

Alterar a mesa de uma comanda já aberta (`SPR-10`). Múltiplas comandas simultâneas na mesma mesa (`SPR-8`).

## Critério de aceite

Uma comanda nasce com identificador técnico próprio; o número da mesa não serve como chave da comanda; duas comandas na mesma mesa recebem números incrementais distintos, nunca repetidos.

## Depende de

`SPR-39` (chave, timestamps, exclusão lógica) e as tabelas do módulo `MSA` (`SPR-14`) — nenhuma comanda nasce antes das duas. A numeração incremental por mesa depende, além disso, de `G-06` — pergunta ao humano, vence 2026-11-13 (`docs/produto/backlog-lacunas-g01-g09.md` §8): sem escopo e mecanismo de alocação declarados, a numeração atribuída no terminal, sem rede, colide entre dois garçons. Não decidido nesta passada.

## Referências

`docs/produto/modulos/mesa-comanda.md` · `docs/produto/backlog-lacunas-g01-g09.md` §8

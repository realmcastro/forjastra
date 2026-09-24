# SPR-11 — Permitir atuação de múltiplos garçons na mesma comanda

**Tipo:** História · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-11-13
**Agrupador:** SPR-5

---

## Objetivo

Permitir que mais de um garçom acesse e opere a mesma comanda simultaneamente, sem bloqueio mútuo, com alterações de um visíveis aos demais.

## Escopo

* Todos os garçons autorizados acessam a mesma comanda e visualizam o estado atual.
* Lançamento de item é operação **aditiva**: dois garçons adicionando itens diferentes, mesmo sem rede, convergem sem perda quando a conexão volta — a ordem entre eles não importa.
* Operação **não aditiva** tentada enquanto o dispositivo não tem o consumo em estado confirmado — transferir, juntar, retirar item, encerrar — é recusada, apresentando o último estado conhecido e o instante dele; quem opera decide (`RN-MSA-011`, `docs/produto/modulos/mesa-comanda.md:224`). Nunca resolução por relógio do terminal, nunca "última escrita ganha".

## Fora de escopo

Autorização de papel para cada operação individual (cobertas nas issues das próprias operações — `SPR-10`, `SPR-12`, `SPR-13`).

## Critério de aceite

Dois garçons adicionam itens diferentes ao mesmo consumo, offline, em terminais distintos; ao sincronizar, os dois itens aparecem, nenhum se perde. Um terceiro garçom tenta transferir o consumo com o dispositivo desatualizado; a operação é recusada, mostrando o estado e o instante correntes.

## Depende de

Nada trava a construção; a regra que cobre o caso concorrente já está aprovada (`RN-MSA-011`).

## Referências

`docs/produto/modulos/mesa-comanda.md:224`

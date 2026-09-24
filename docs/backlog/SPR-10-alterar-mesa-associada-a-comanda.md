# SPR-10 — Alterar mesa associada à comanda

**Tipo:** História · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-11-13
**Agrupador:** SPR-5

---

## Objetivo

Permitir alterar a mesa associada a uma comanda sem alterar a identidade técnica da comanda nem seus itens e valores — a transferência **move** o consumo, nunca copia nem recria com autor ou instante novos (`RN-MSA-005`, `docs/produto/modulos/mesa-comanda.md:141`).

## Escopo

* A comanda passa a ser identificada pela nova mesa; a mesa anterior deixa de identificá-la.
* Itens, valores e identidade técnica da comanda permanecem inalterados pela transferência.
* Nenhum item é reenviado à produção pela transferência.

## Fora de escopo

Criar a comanda pela primeira vez (`SPR-6`). Múltiplas comandas na mesma mesa (`SPR-8`).

## Critério de aceite

Duas transferências concorrentes do mesmo consumo: uma vence, a outra é recusada apresentando o estado atual — nunca "a última escrita ganha", nunca item duplicado ou perdido (`RN-OFF-009`, `docs/produto/operacao-offline-e-sincronizacao.md:102`).

## Depende de

Nada trava a construção; os itens acima já estão aprovados em `RN-MSA-005`.

## Referências

`docs/produto/modulos/mesa-comanda.md:141` · `docs/produto/operacao-offline-e-sincronizacao.md:102`

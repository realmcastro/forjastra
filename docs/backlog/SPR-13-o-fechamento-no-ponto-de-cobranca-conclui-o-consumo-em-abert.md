# SPR-13 — O fechamento no ponto de cobrança conclui o consumo em aberto

**Tipo:** História · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-11-13
**Agrupador:** SPR-5

---

## Objetivo

Encerrar um consumo em aberto é operação **de** `MSA`, por decisão humana, com papel autorizado, motivo, e escolha explícita entre **cobrança** e **cancelamento**. Nenhum outro módulo encerra consumo. O que acontece no ponto de cobrança é o **núcleo** concluindo a venda a partir do que `MSA` entregou — não um módulo externo agindo sobre o consumo. (Corrigido em revisão anterior: o enunciado original pedia que `MSA` apenas _reconhecesse_ um encerramento vindo de fora e deixava o encerramento financeiro fora de escopo — isso invertia a fronteira. A necessidade original, "consumo encerrado não aceita mais nada", permanece e é o aceite 5 abaixo.)

## Escopo

* `RN-MSA-010` (`docs/produto/modulos/mesa-comanda.md:210`) — consumo é encerrado por decisão humana, **nunca pelo relógio**. Nada o fecha, cancela, arquiva ou descarta automaticamente por tempo, virada de dia, fim de expediente ou rotina de limpeza.
* `RN-MSA-008` (`:181`) — um consumo produz **no máximo uma** cobrança concluída; repetir o fechamento devolve o **mesmo** resultado.
* `RN-COZ-005` (`docs/produto/modulos/cozinha.md:141`) — a etapa de produção **não fecha consumo** e não é condição de nenhuma operação de dinheiro.
* `RN-COZ-010` (`:215`) — nada em `COZ` altera item, quantidade, preço, total, tributo ou estado de venda.

## Fora de escopo

Qualquer reflexo documental do cancelamento (nota, comprovante) — pendência separada, `LACUNA-MSA-2` (`docs/produto/modulos/mesa-comanda.md:341`), sem fonte que a decida, nada aqui a presume.

## Critério de aceite

1. Encerrar consumo por cobrança → uma venda, um pagamento, um documento. Enviar o fechamento do mesmo consumo três vezes, uma delas com a resposta derrubada no meio, devolve o **mesmo** resultado (`RN-MSA-008`, aceite).
2. Consumo aberto há três dias → **continua aberto**, contável e visível como pendência ao responsável; nada o encerra automaticamente (`RN-MSA-010`, aceite).
3. Consumo que não pode ser cobrado (o cliente-final foi embora sem pagar) → encerrado como **cancelamento com motivo**, nunca como venda paga fantasma nem descarte silencioso, e o valor não cobrado fica **declarado** (`RN-MSA-010`, infeliz).
4. Com `COZ` desligado, ou com o ponto de produção inalcançável, os itens 1 a 3 se comportam igual (`RN-MSA-012`).
5. Consumo encerrado — por cobrança ou por cancelamento — **recusa lançamento novo**, e a recusa nomeia o estado ("este consumo já foi encerrado"), nunca falha genérica.
6. Consumo encerrado **não emite trabalho novo** para o ponto de produção: é o consumo encerrado deixando de originar lançamento, e trabalho nasce de lançamento (`RN-COZ-001`, `docs/produto/modulos/cozinha.md:88`).

**Caminho infeliz:** dois terminais fecham o mesmo consumo ao mesmo tempo, com repartições diferentes → uma vence, a outra é **recusada** apresentando o estado atual a quem opera; em nenhuma das duas fica venda parcial concluída (`RN-MSA-008`, infeliz). Exclusividade **com o link caído** é requisito duro declarado em `RN-MSA-011`.

## Referências

`docs/produto/modulos/mesa-comanda.md:210` · `:181` · `:241` · `:224` · `:341` · `docs/produto/modulos/cozinha.md:141` · `:215` · `:88`

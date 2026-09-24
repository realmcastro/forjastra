---
name: gotcha-prazo-offline-em-calendario-nao-se-cumpre
description: terminal sem hora confiável só conta tempo ligado; prazo offline prometido em calendário é falso (ligado 4 h/dia, 72 h viram 18 dias); prazo cujo vencimento para venda conta só funcionamento persistido, e prazo que só recusa operação sensível conta pelo maior entre funcionamento e calendário
type: gotcha
escopo: plataforma
camada: produto
data: 2026-09-23
tarefa: T-0014
---

`SEG-T14-01`, da consulta de `seguranca` em `T-0014`. Aplicado em `RN-OFF-035` (habilitação: só
funcionamento, 72 h, teto 168 h) e `RN-OFF-034` (autoridade retida: maior dos dois, teto 12 h), em
`docs/produto/fila-local-valores-de-partida.md`.

**Por quê:** pelo relógio de parede, atrasar o relógio estende o prazo. Por funcionamento, a queda de energia
não para o caixa (`PN-01`), mas o calendário fica sem limite contra quem mantém o aparelho offline.

**Como aplicar:** o contador de funcionamento avança e é persistido antes de cada ato, senão reinícios
seguidos o zeram; contador ilegível conta como vencido. Ao cliente, declare horas ligadas, nunca data.

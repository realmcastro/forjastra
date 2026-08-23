---
name: gotcha-grao-do-congelado-e-irrecuperavel
description: congelar a tributação por venda em vez de por item × tributo × base × regime × redutor torna segregação e decomposição irrecuperáveis para todo o histórico — e recompor é proibido, então o erro não tem conserto depois
type: gotcha
escopo: modulo:fis
camada: dados
data: 2026-08-22
tarefa: T-0001
---

**Sintoma (e ele só aparece meses depois):** pedem a segregação de um tributo, ou a decomposição da
base de um documento antigo, e o dado congelado não tem grão para responder. Recompor a partir da
regra atual é **proibido** (`RN-FIS-005`) — a regra de então pode não existir mais. O histórico fica
irrecuperável, para todos os clientes ao mesmo tempo.

**Grão correto:** `item × tributo × base × regime × redutor`. Congelar "o imposto da venda" é o atalho
natural e é o erro.

**O que o congelado precisa incluir, além do resultado:** os **insumos** do cálculo e a **política de
arredondamento com a ordem** em que ela foi aplicada. Sem a ordem, dois cálculos legítimos divergem em
centavos e não há como dizer qual foi o aplicado.

**Como aplicar:** este é um dos pontos em que a Fase 1 não tem segunda chance. Antes de modelar,
`produto` + humano + contador fecham o grão do congelado e o arredondamento — e a decisão do
catálogo de regra fiscal ([[decision-d-05-catalogo-de-regra-fiscal-sem-casa]] em `plataforma/`) é
pré-requisito, porque ela decide **onde** a regra de então mora.

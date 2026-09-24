---
name: gotcha-gatilho-de-comando-nao-protege-particao
description: gatilho FOR EACH STATEMENT no pai particionado não dispara em DELETE/UPDATE/TRUNCATE direto na partição; gatilho de linha no pai é clonado e cobre DELETE/UPDATE, não TRUNCATE; DETACH + DROP apaga a faixa sem gatilho nenhum (medido em 16.15)
type: gotcha
escopo: plataforma
camada: dados
data: 2026-09-23
relaciona: [[decision-d-06-ii-trilha-no-platform-com-projecao-no-cliente]]
tarefa: T-0019
---

O sintoma é uma tabela append-only particionada que perde linhas sem que o gatilho de imutabilidade
acuse nada, porque o comando foi direto à partição.

**Como aplicar:** append-only particionado leva gatilho de **linha** no pai, gatilho de `TRUNCATE` em
cada partição, e a impressão estrutural enumera as partições. Tirar partição da impressão para acomodar
rotação deixa a partição apagada invisível (`TRL-03`).

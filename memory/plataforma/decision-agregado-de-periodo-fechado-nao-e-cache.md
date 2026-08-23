---
name: decision-agregado-de-periodo-fechado-nao-e-cache
description: agregado de período fechado derivado de fato imutável é derivação reconstruível, não cache — não tem invalidação, e por isso escapa da proibição de cache; agregado de período aberto é cache e cai nela
type: decision
escopo: plataforma
camada: performance
data: 2026-08-23
relaciona: [[decision-tenancy-schema-por-cliente]], [[gotcha-fuso-do-estabelecimento-versus-fuso-do-cliente]]
tarefa: T-0003
---

Veio da consulta de `performance` sobre a semente de relatórios (T-0003 passo 7). **A consulta não
escreveu arquivo** — este registro e a ficha são o único lugar onde a substância existe.

**A distinção que sustenta a arquitetura de relatório:** agregado de **período fechado** derivado de
fato imutável (`RN-REL-007`) **não é cache** — não tem invalidação, é derivação reconstruível — e por
isso escapa da proibição de cache de `.claude/rules/performance.md`. Agregado de período **aberto** é
cache, e cai na proibição inteira, invalidação e chave por tenant incluídas. **Se `RN-REL-007` mudar,
a distinção cai.**

**Três correções de premissa, da mesma consulta:**
1. **Nenhuma** das perguntas de relatório precisa de pré-agregação no schema de controle. Nenhuma soma
   clientes, e "consolidado do cliente" é soma de estabelecimentos **dentro** de um schema. Alojar
   agregado no `platform` seria **vazamento por agregado** — gate de `seguranca`, não ganho de custo.
2. **Paginação limita a saída, nunca a entrada.** Relatório ordenado globalmente varre a janela inteira
   antes de existir a primeira página. O teto que decide custo é o de **janela**, e falta um campo que
   não existe hoje: teto de **linhas de saída totais antes da paginação**.
3. **Transferir o dono não transfere o custo.** Cortar o painel ao vivo do módulo de relatório e mandá-lo
   para a superfície de operação foi a decisão certa pelo motivo errado: "concorreria com o caixa" não
   separa nada (outras perguntas concorrem pela mesma tabela). A linha que separa é **"a resposta é
   derivável só de período fechado?"**. Sem orçamento próprio e contador incremental, o painel reaparece
   como agregação por cima da tabela do caixa.

**Pior caso medido em forma, não em número:** `RN-REL-010` é `O(vendas × itens por venda)` na janela mais
longa, vezes `O(estabelecimentos)`, com fan-out `O(schemas)`. Meça no **pior** cliente, nunca na média.

**Como aplicar:** ao desenhar qualquer relatório, declare o período (fechado ou aberto) **antes** de
falar de armazenamento; e as medidas de `LACUNA-REL-001` são insumo da **Fase 1**, não da Fase 2 — elas
decidem se o eixo de agregação é **venda ou item**.

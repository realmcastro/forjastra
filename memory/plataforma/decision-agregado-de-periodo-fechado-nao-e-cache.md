---
name: decision-agregado-de-periodo-fechado-nao-e-cache
description: agregado de período fechado derivado de fato imutável é derivação reconstruível, não cache — não tem invalidação, e por isso escapa da proibição de cache; agregado de período aberto é cache e cai nela
type: decision
escopo: plataforma
camada: performance
data: 2026-08-23
relaciona: [[decision-tenancy-schema-por-cliente]], [[gotcha-fuso-do-estabelecimento-versus-fuso-do-cliente]], [[decision-d-06-sao-tres-residencias-nao-uma]], [[gotcha-agregado-e-seguro-por-concentracao-nao-por-n]]
tarefa: T-0003
---

> **Corrigido em 2026-08-23 (T-0004).** A premissa da correção 1 — *"nenhuma pergunta soma clientes"* —
> **deixou de ser verdade** para um leitor novo: nós. A distinção central e as correções 2 e 3 seguem
> válidas. O que mudou está marcado abaixo, e a correção 1 foi reescrita em vez de apagada.

Veio da consulta de `performance` sobre a semente de relatórios (T-0003 passo 7). **A consulta não
escreveu arquivo** — este registro e a ficha são o único lugar onde a substância existe.

**A distinção que sustenta a arquitetura de relatório:** agregado de **período fechado** derivado de
fato imutável (`RN-REL-007`) **não é cache** — não tem invalidação, é derivação reconstruível — e por
isso escapa da proibição de cache de `.claude/rules/performance.md`. Agregado de período **aberto** é
cache, e cai na proibição inteira, invalidação e chave por tenant incluídas. **Se `RN-REL-007` mudar,
a distinção cai.**

**Três correções de premissa, da mesma consulta:**
1. **REESCRITA EM 2026-08-23.** Nenhuma pergunta **de relatório do cliente** soma clientes, e "consolidado
   do cliente" é soma de estabelecimentos **dentro** de um schema — isso continua verdade. O que caiu é a
   generalização: **existe** agora um leitor cujas perguntas somam clientes (a nossa operação, escopo
   `provedor`), então "nenhuma pergunta soma clientes" não sustenta mais nada. **O que sobrevive, e é a
   parte que importa:** alojar no `platform` agregado **decomponível por cliente** é **vazamento por
   agregado** — tira dado do cliente do schema que o isola, e isolamento deixa de ser propriedade da
   construção. Reconfirmado por auditoria em 2026-08-23. Onde a pergunta que soma clientes pode repousar é
   `D-06`, **aberta** ([[decision-d-06-sao-tres-residencias-nao-uma]]).
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

**Acrescentado em 2026-08-23 — "pico" não é período aberto, e a distinção se estende ao agregado que soma
clientes.** "Que horas é o pico" de hora, dia ou mês **encerrado** é derivação de período fechado, logo não
é cache; só "quantas operações estão acontecendo **agora**" é aberto. O acompanhamento mensal e semestral
que o humano pediu é integralmente **fechado**. E existe versão de "agora" que dispensa cache: contada na
**nossa borda**, em unidade nossa, agregada sobre todos os clientes — `O(1)` em schemas, sem fan-out. Duas
ressalvas, as duas medidas em consequência: a versão que **exige** cache é exatamente a que reprova a
fronteira de observação de operação (unidade de negócio em período aberto é o que força o fan-out), e a
saída sem cache passa **condicionada à concentração**, não ao número de clientes
([[gotcha-agregado-e-seguro-por-concentracao-nao-por-n]]). Consequência para `D-06`: o agregado que soma
clientes só é admissível em **período fechado**.

**Como aplicar:** ao desenhar qualquer relatório, declare o período (fechado ou aberto) **antes** de
falar de armazenamento; e as medidas de `LACUNA-REL-001` são insumo da **Fase 1**, não da Fase 2 — elas
decidem se o eixo de agregação é **venda ou item**.

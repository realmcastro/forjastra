---
name: state-pendencias-abertas-2026-08-23
description: o que está aberto depois de T-0001/T-0002/T-0003 — cinco decisões do humano, as lacunas que travam trabalho, e os resíduos com dono; remover cada item ao ser resolvido, e o registro inteiro quando esvaziar
type: state
escopo: plataforma
camada: processo
data: 2026-08-23
tarefa: T-0003
---

Substitui o `state` da sessão congelada de 2026-08-22. A **narrativa** de como o trabalho andou está
nas fichas `tarefas/T-0001`, `T-0002`, `T-0003` (relatórios verbatim) e nos `## Fechamento` delas — não
se repete aqui. Este registro é só a **fila do que falta**, e cada linha sai dele ao ser resolvida.

## 1. Decisões do humano — nada avança por cima delas

| # | Pergunta, na forma em que se responde | Efeito de ficar aberta |
|---|---|---|
| **D-01/D-02** | arranjo **B** (código-base único, cascas por alvo) ou **D** (web única + acompanhante nativo no Windows)? servidor em Go, com o risco nomeado? | nenhum código de produto |
| **D-03** | **o humano que opera em mais de um cliente é caso de borda ou caso de venda?** borda → opção **C**; caso de venda → **B**, assumindo por escrito que o isolamento passa a ser garantido por **verificação** em vez de por **construção** | ver [[decision-d-03-sao-tres-eixos-nao-uma-decisao]] |
| **D-04** | convenção de PK, timestamps, soft delete | Fase 1 não abre |
| **D-05** | onde mora o catálogo de regra fiscal — e **ela ainda não está na tabela do `CLAUDE.md` §8** | `FIS` não é modelável; ver [[decision-d-05-catalogo-de-regra-fiscal-sem-casa]] |
| fuso | fuso do **estabelecimento** (`RN-FIS-008`) ou do **cliente** (`.claude/rules/dados.md` §3)? mexer nisso toca `.claude/rules/**`, que é dele | ver [[gotcha-fuso-do-estabelecimento-versus-fuso-do-cliente]] |
| turno | respondido "não sei ainda / depende do cliente" — metade de `LACUNA-NUC-007` segue aberta por isso | fechamento de dia resolvido, turno não |
| MVP | confirmar ou alterar o corte proposto em `docs/produto/roadmap-de-modulos.md`, com o custo da emissão própria à vista | roadmap é proposta, não plano |

## 2. Lacunas que destravam trabalho, por alavanca

- **`LACUNA-NUC-037` — maior alavanca da lista.** `REL` não tem **uma única célula** em nenhuma das três
  matrizes: seis relatórios especificados, todos negados a todos, porque prosa não concede
  ([[decision-celula-e-autoridade-unica-sobre-autorizacao]]). **Destrava com uma linha de tabela.**
- **`LACUNA-OFF-017`** — prazo da habilitação a vender, com a tensão escrita em
  [[business-rule-habilitacao-a-vender-do-terminal-tem-prazo]].
- **`LACUNA-EMI-015`** — divergência inversa: a lacuna diz que conceder/usar a capacidade de assinar
  "falham fechado", e as células dão `R` a `fiscal_officer`. Toca D-03; pode virar `BLOQUEIO`.
- **o ato ordinário tem nove linhas ou dez**, e **alguma linha de módulo é ato ordinário?** Valor de
  célula, logo do humano. Hoje nenhuma linha de módulo carrega `terminal+ident`.
- **`LACUNA-REL-001`** — as medidas que **decidem desenho** (linhas de item/dia no maior cliente, itens
  por venda, estabelecimentos por cliente, nº de schemas, cardinalidade de motivo) são insumo da **Fase
  1**, não da Fase 2: elas decidem se o eixo de agregação é **venda ou item**.

## 3. Resíduos com dono

- **RESOLVIDO 2026-08-23** — a reauditoria de `AUT-14` voltou **sem achado bloqueante**; `AUT-15` e
  `AUT-16` foram corrigidos e a `T-0003` está **fechada**. Fica aberto **`AUT-17`** [MÉDIO]: nenhuma célula
  de **módulo** carrega `terminal+ident`, então cliente com módulo ligado tem, às 21h01, o núcleo vendendo
  por `terminal+ident` e o módulo **recusando** a mesma operação por `retida`. Falha **fechado**, logo não
  bloqueou a ficha — mas bloqueia duas afirmações: que o contrato de offline está completo para cliente com
  módulo ligado, e a **entrega de `MSA` ao primeiro cliente**. Dono: humano (`RN-MSA-004`, `011`,
  `RN-COZ-004`).
- humano/thread — **o PDF `Forja-Relatorio-2026-08-22.pdf` na raiz não contém a auditoria de segurança**
  e não diz que o gate estava aberto quando foi gerado. As fontes viviam no scratchpad e **morreram com a
  sessão**: regerar é refazer. Não entregar aos sócios documento que sugere gate cumprido.
- **RESOLVIDO 2026-08-23** — as respostas de `backend` e `ui` sobre o **canal de pedido nomeado**
  (`RN-NUC-036`) estão coladas no aditamento do `## Fechamento` da `T-0003`. Sobrou um item de `ui`, com
  dono: falta **papel de bloco para entrada de comando por teclado** — id novo, nunca variante, slot da
  zona crítica com ordinal fixo.
- `ui` — `docs/design/vocabulario-e-eixos.md:377` aponta para o `state` de sessão que foi **removido** em
  2026-08-23; a pendência que a linha descreve já não existe, mas a referência ficou pendurada.
- `produto` — `docs/produto/verticais/restaurante.md` e `modulos/fiscal.md` estão perto do teto de 400:
  o próximo acréscimo exige partir por eixo.
- `seguranca` — as **20 células de ato fiscal irreversível** não foram auditadas uma a uma (confissão de
  escopo do próprio auditor, §5 do relatório), e o gate de `PCF`/`ATI` está declarado e **não cumprido**.
- `produto` — `RN-ATI-017` (agregação) e `RN-ATI-015` (derivado de conversa) seguem sem lista enumerada.

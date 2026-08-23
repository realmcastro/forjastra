---
name: decision-arquitetura-de-agents
description: O agent `orquestrador` planeja o despacho e o thread principal executa, porque subagent não dispara subagent; cada agent tem território de escrita por path, e 5 gates são obrigatórios (produto antes de código, dados+segurança em schema, segurança em endpoint, performance em consulta).
type: decision
escopo: plataforma
camada: processo
data: 2026-08-22
relaciona: [[decision-memoria-em-grafo]], [[convention-claude-md-e-so-panorama]]
---

Oito agents em `.claude/agents/`: `orquestrador`, `produto`, `arquiteto-dados`, `backend`, `ui`,
`coder`, `seguranca`, `performance`. Exploração ampla usa o agent nativo `Explore` — não criamos um.

**Restrição real que moldou o desenho:** no Claude Code, um subagent **não despacha** outro
subagent. Então o orquestrador não pode ser o executor do fluxo. A divisão é: o agent `orquestrador`
é o **cérebro** (devolve Plano de Despacho), o thread principal são as **mãos** (cria a ficha,
dispara, valida), os especialistas fazem o trabalho.

**Por quê os territórios:** cada agent escreve só em paths seus (`db/**`, `apps/api/**`,
`docs/produto/**`, …). É isso que permite rodar dois agents em paralelo sem colisão de arquivo — sem
território, todo paralelismo vira conflito de escrita. Auditores (`seguranca`, `performance`) são
read-only e escrevem só relatório.

**Como aplicar:** agents se comunicam por dois artefatos em disco — a ficha em `tarefas/T-*.md` e o
Relatório de Handoff (`.claude/rules/handoff.md`). Pergunta entre agents vira **consulta** curta e
read-only roteada pelo orquestrador, nunca dedução do código alheio. Bloqueio não se ignora: resolve
ou escala ao humano. Regra de despacho e gates: `CLAUDE.md` §4.

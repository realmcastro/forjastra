---
name: convention-claude-md-e-so-panorama
description: CLAUDE.md é panorama e roteamento, com teto duro de 400 linhas / 20k chars; regra detalhada vai para `.claude/rules/` e é lida sob demanda pelo agent que precisa dela — arquivo sempre-carregado custa contexto em toda mensagem.
type: convention
escopo: processo
camada: processo
data: 2026-08-22
relaciona: [[reference-projeto-belasvue]], [[decision-arquitetura-de-agents]]
---

`CLAUDE.md` contém: identidade do produto, estado da fase, regra de orquestração, mapa de agents,
onde as coisas moram, invariantes (poucos) e decisões em aberto. **Nada mais.** Teto: 400 linhas /
20k caracteres.

**Por quê:** no projeto anterior o `CLAUDE.md` chegou a 1336 linhas (~61k chars, depois de duas
rodadas de compactação a partir de 80k) e entrava inteiro no contexto **a cada mensagem** —
inclusive as 47 regras numeradas que só importavam para uma tarefa de cada vez. Era um ótimo criador
de contexto inicial e um péssimo custo recorrente. `.claude/rules/` **não** é auto-carregado pelo
Claude Code, e isso aqui é vantagem: cada agent lê explicitamente só o arquivo do papel dele.

**Como aplicar:** regra nova nasce em `.claude/rules/<papel>.md`, não no `CLAUDE.md`. No `CLAUDE.md`
só entra o que muda **roteamento** (agent novo, gate novo, decisão fechada, fase nova). Exemplo
longo, diagrama e racional extenso vão para `docs/arquitetura/`. Encostou no teto? Move para
`rules/`, não negocia o teto.

---
name: state-fase-0-arquitetura-ia
description: Fase 0 (2026-08-22) entregou só a arquitetura de trabalho com IA — CLAUDE.md, 8 agents, 13 regras, grafo de memória, fichas e o comando /tarefa. Não existe código de produto, e as decisões D-01..D-04 (stack, frontend, auth, PK) estão abertas de propósito.
type: state
escopo: plataforma
camada: processo
data: 2026-08-22
relaciona: [[decision-arquitetura-de-agents]], [[decision-memoria-em-grafo]]
---

**Pronto:** `CLAUDE.md` (panorama + roteamento, teto de 400 linhas); `.claude/agents/` com 8 agents;
`.claude/rules/` com núcleo, processo, handoff, memória, migrations, git e uma regra por papel; grafo
de memória semeado; `tarefas/` com template e protocolo de ficha; `.claude/commands/` com `/tarefa` (comando
único: fechamento e auditoria são julgamento do `orquestrador` dentro do ciclo, não comandos que o
humano precisa lembrar de digitar); `docs/{produto,auditorias,arquitetura}/`.

O **processo** (ciclo de 8 etapas, definição de pronto, cadência de validação em checkpoint, ciclo
de fases 0→4+, quando encurtar, auditoria periódica) está em `.claude/rules/processo.md`.

**Aberto de propósito** (`CLAUDE.md` §8): D-01 stack de backend/ORM, D-02 framework de frontend,
D-03 estratégia de auth/identidade, D-04 convenção de PK/timestamps/soft delete. Nenhum agent pode
presumir essas quatro — o caminho é `BLOQUEIO`.

**Fechado:** Postgres com schema por cliente ([[decision-tenancy-schema-por-cliente]]).

**Acrescentado em 2026-08-23 (T-0001/T-0002/T-0003):** o corpo de spec de produto em
`docs/produto/**` (glossário, catálogo de módulos, fiscal, offline, núcleo de venda, papéis, matriz
operação × papel, superfície, roadmap), o sistema de design em `docs/design/**` — território novo de
`ui`, declarado no `CLAUDE.md` §4 —, os dossiês de decisão em `docs/arquitetura/**` e o primeiro gate
de `seguranca` cumprido em `docs/auditorias/**`. Continua **zero** linha de código de produto e zero
DDL.

**Próximo (Fase 1):** modelo de dados do núcleo de venda, feito para não migrar depois. O primeiro
passo da ordem sugerida (`produto` define entidades e regras do núcleo) **está feito** — segue:
`arquiteto-dados` modela e responde as 5 perguntas → `seguranca` audita isolamento → D-04 fechada no
caminho, com registro `decision`. Só depois backend, e só depois UI. **Dois bloqueios de entrada:**
D-04, e a decisão proposta como `D-05` ([[decision-d-05-catalogo-de-regra-fiscal-sem-casa]]), sem a
qual o módulo de tributação não é modelável. Ver [[state-pendencias-abertas-2026-08-23]].

**Ausente de propósito:** `apps/`, `packages/`, `db/`, `src/`, package manager, CI. Nenhum deles
nasce antes da fase que o cria.

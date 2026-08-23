# Forja

PDV de nova geração: núcleo de ponto de venda + módulos ativados por cliente, com composição de tela
por SDUI. Multi-cliente com um schema Postgres por cliente.

**Comece por `CLAUDE.md`** — ele é o panorama e o roteador. Depois:

| Onde | O quê |
|---|---|
| `.claude/agents/` | os 8 agents (orquestrador, produto, dados, backend, ui, coder, segurança, performance) |
| `.claude/rules/` | a regra de cada papel + núcleo, handoff, memória, migrations, git |
| `memory/` | conhecimento de trabalho, em grafo por escopo |
| `tarefas/` | fichas de tarefa (o bastão entre agents) |
| `docs/` | produto (regra de negócio), auditorias, arquitetura |

Fase atual: **0** — só a arquitetura de trabalho. Não há código de produto, e quatro decisões estão
abertas de propósito (`CLAUDE.md` §8).

---
name: reference-projeto-belasvue
description: Projeto anterior (Belas Artes Web TV, Vue 3 + SDUI, ~/work/futura/belasvue) é a referência de onde vieram o esquema de memória e o modelo de SDUI; copiar o esquema de memória e a orquestração, não copiar o tamanho do CLAUDE.md nem a stack.
type: reference
escopo: plataforma
camada: processo
data: 2026-08-22
relaciona: [[decision-memoria-em-grafo]], [[convention-claude-md-e-so-panorama]]
---

Caminho local: `~/work/futura/belasvue` (repo separado, não é dependência da Forja).

**O que vale consultar lá:**
- `memory/` — o esquema de 3 níveis que originou o nosso grafo (281 registros, pasta plana).
- `CLAUDE.md` §18 — invariantes de SDUI (vocabulário fechado, snapshot pré-render, degradação
  rede→cache→piso, expansor de lista) que reaproveitamos na Forja.
- `CLAUDE.md` §15 — sistema de slots/variantes por eixo de interação × espaço; a ideia transfere,
  os componentes não.
- `CLAUDE.md` §14 — orquestração por agents, primeira versão da ideia.

**O que NÃO copiar:** o tamanho do `CLAUDE.md` (1336 linhas / ~61k chars, entrando no contexto a
cada mensagem — ver [[convention-claude-md-e-so-panorama]]); as 47 regras numeradas de NUNCA/SEMPRE,
que aqui viraram regra por papel em `.claude/rules/`; a stack (Vue 3 para Smart TV, com restrições
de Tizen 4/webOS 3 que não existem em PDV).

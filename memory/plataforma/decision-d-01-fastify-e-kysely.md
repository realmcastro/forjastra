---
name: decision-d-01-fastify-e-kysely
description: a metade aberta de D-01 fechou em 2026-09-11 — Fastify como framework HTTP e Kysely como camada de dados; Kysely fecha porque não tem motor de migration próprio para desligar, então o conflito com R-14 (executor nosso) não existe em vez de ser administrado
type: decision
escopo: plataforma
camada: backend
data: 2026-09-11
relaciona: [[decision-stack-node-typescript-estrito]], [[decision-migrations-forward-only]], [[decision-d-02-arranjo-d]]
tarefa: T-0011
---

`D-01` fecha inteira. A linguagem já tinha fechado em 2026-08-26
([[decision-stack-node-typescript-estrito]]); faltavam framework HTTP e camada de dados.

## Fastify

Dois motivos, e os dois são cláusula de regra existente, não preferência:

1. **Validação de schema na borda** é o que `backend.md` §3 exige — entrada da rede é `unknown` até
   ser validada, uma vez, com erro legível. No Fastify isso é o mecanismo do framework, não
   disciplina de cada rota.
2. **Hook por requisição** é onde `backend.md` §1 manda o tenant ser resolvido: **uma vez**, na borda,
   a partir da identidade autenticada. Sem ponto de ciclo de vida tipado, "tenant é contexto, nunca
   parâmetro" vira coisa que cada rota precisa lembrar de fazer.

**Recusados:** **Hono** — mais leve e roda em mais runtimes, vantagem real só se o servidor sair de
Node, o que não está no horizonte; ecossistema menor e validação menos integrada. **Express** — sem
validação de schema nativa e sem hook tipado, logo as duas exigências acima viram disciplina manual,
que é a forma de elas falharem no dia cheio.

## Kysely

**O argumento que decide é uma ausência:** Kysely **não tem motor de migration próprio**. A decisão
da linguagem nomeou como risco número um que "o caminho natural aqui é ORM com motor próprio, que
R-14 obriga a desligar, e o risco é ele entrar por inércia". Com Kysely não há motor para desligar,
nem convenção a manter desligada, nem alguém em 2027 reativando-a sem saber por quê. O conflito
**deixa de existir**, em vez de passar a ser administrado.

Somam: gera SQL previsível, os tipos vêm do schema (que é o que justifica TypeScript estrito), e
assenta sobre `pg`, a dependência já aprovada do executor de migration. Nenhuma peça nova entra.

**Recusados:** **`pg` puro** — controle máximo, mas cada linha lida cruza a fronteira como `any`, e a
linguagem foi escolhida justamente para o compilador pegar o caso esquecido (`R-10`/`R-11`).
**Drizzle** — boa ergonomia, e tem motor de migration próprio: seria o risco nomeado, aceito de
propósito.

## O preço assumido

- **Kysely conhece o schema por tipos gerados**, e quem gera esses tipos lê o banco. Isso cria um
  passo entre migration e código que precisa ter dono declarado, senão os tipos envelhecem em
  silêncio e o compilador passa a garantir uma forma que não existe mais.
- **Fastify tem ecossistema de plugin**, e plugin é dependência que entra sem revisão de arquitetura
  se ninguém segurar. Vale a regra de sempre: dependência nova com necessidade demonstrada.
- Nada disto alcança o **acompanhante nativo** de `D-02` ([[decision-d-02-arranjo-d]]), que não é
  servidor HTTP e não herda estas escolhas.

## Como aplicar

`CLAUDE.md` §8, linha `D-01`, passa a **FECHADA**. `backend.md` deixa de emitir `BLOQUEIO` por stack
e passa a poder escrever implementação. Segue valendo tudo o mais da regra: tenant resolvido na borda
a partir da identidade autenticada e nunca de entrada do chamador, erro em forma única e estável, e
idempotência obrigatória em tudo que move dinheiro ou estoque.

---
name: convention-escrita-em-registro-append-only
description: em registro append-only (comentário de issue) a ordem de publicação é conteúdo — não cite fato que ainda não existe — e toda substituição de texto destrutivo é precedida do comentário de preservação com quatro partes, a quarta sendo o destino de cada critério que sai
type: convention
escopo: processo
camada: processo
data: 2026-08-26
relaciona: [[decision-jira-e-o-registro-publico-da-tarefa]], [[gotcha-o-titulo-nao-e-o-card]]
tarefa: T-0006
---

Duas cláusulas, as duas aprendidas aplicando o Bloco A em 2026-08-26.

**1. A ordem de publicação é parte do conteúdo.** O comentário de `SPR-26` afirmava que a retratação de
`SPR-27` existia; postar na ordem inversa publicaria referência a algo inexistente — e comentário não se
edita. Antes de postar, verifique se cada fato que o texto **afirma como existente** já existe. Onde a
ordem importa, ela é o passo, não a preferência.

**2. Substituição destrutiva é precedida do comentário de preservação, e ele tem quatro partes**, nesta
ordem: o texto anterior verbatim (o que mudou), **por quê**, **contra o quê** (`path:linha` da regra ou
da spec), e o **destino de cada critério que sai** — para que card, ou por que morre. Sem a quarta, a
preservação vira arquivo morto: o critério fica registrado e ninguém sabe onde ele foi parar.

**Por quê:** título e descrição de card **não** são append-only — sobrescrever apaga critério de aceite
válido sem deixar rastro, e a edição sai com o nome do humano. O comentário é o único lugar onde o
estado anterior sobrevive, e ele só serve se disser para onde cada coisa foi.

**Como aplicar:** vale para issue, e vale para qualquer registro público que não se edita. Corrigiu
depois de publicar? Novo comentário com a data, nunca edição do antigo — a cópia corrigida em silêncio
produz duas versões da mesma verdade (`.claude/rules/jira.md` §4, mesma razão de `migrations.md` §1).

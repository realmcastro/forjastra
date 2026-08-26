---
name: decision-commit-e-ato-do-humano-nao-do-processo
description: existe um agent `commiter` com o padrão de branch/commit/PR, mas ele só roda quando o humano pede com essas palavras — nunca em plano, nunca no fechamento de tarefa
type: decision
escopo: processo
camada: processo
data: 2026-08-26
relaciona: [[decision-jira-e-o-registro-publico-da-tarefa]], [[convention-escrita-em-registro-append-only]]
tarefa: T-0006
---

O padrão de branch, commit e PR virou regra executável (`.claude/rules/git.md` §3–§5) e ganhou dono:
o agent `commiter`. Ele é a **única exceção nominal** à proibição de git que muda estado
(`00-nucleo.md` §8). Em troca, ele é o agent mais travado da base: só entra em cena quando o humano
pede commit, branch ou PR **com essas palavras**.

Três travas, e as três são regra, não recomendação: o `orquestrador` não o inclui em Plano de
Despacho; a definição de pronto (`processo.md` §2) não menciona commit e continua sem mencionar; e o
thread principal não o chama por conta própria ao ver trabalho terminado.

**Por quê:** commit é o único ato desta base que sai da máquina e vira história pública — o resto
fica na working tree, revisável e descartável. Automatizá-lo tira do humano a última janela em que
ele olha o conjunto antes de virar permanente, e ninguém revisa com a mesma atenção o que já foi
commitado. O trade-off aceito é o oposto do que o processo faz em todo o resto: aqui a fricção é o
recurso, não o defeito. O custo de esperar o pedido é uma frase; o custo de commitar cedo é
reescrever história ou conviver com ela.

**Como aplicar:** despache `commiter` só a partir de pedido do humano, com brief listando **os paths
que entram** — `git add -A` é proibido, e arquivo fora da lista fica de fora e é reportado. Ele
entrega o PR aberto e para: mesclar é do humano, e o PR não carrega `Closes`/`Fixes`, porque quem
fecha issue é o `orquestrador` depois da definição de pronto. Plano que traga um passo de `commiter`
está errado — recuse o passo, não o execute.

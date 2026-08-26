---
name: decision-jira-e-o-registro-publico-da-tarefa
description: toda tarefa nasce como issue no Jira antes do plano; a ficha mantém a numeração T-000n e o Jira recebe cópia verbatim de plano, relatórios e fechamento
type: decision
escopo: processo
camada: processo
data: 2026-08-26
relaciona: [[convention-claude-md-e-so-panorama]]
---

O Jira entrou como registro público do trabalho em 2026-08-26, com três escolhas do humano, cada uma
contra uma alternativa que parecia mais limpa:

**A ficha mantém `T-000n`; a chave do Jira vai no campo `jira:`.** Recusada a alternativa de usar a
chave do Jira como id da ficha (`tarefas/FRJ-42-slug.md`), que daria um identificador só — mas
renomearia as cinco fichas já fechadas e amarraria o nome do arquivo a um sistema externo.

**Espelhamento completo, não resumo.** Todo artefato de handoff — plano, cada relatório, fechamento —
vai para a issue verbatim, um comentário por artefato. Recusadas as duas opções mais baratas: "Jira
só como entrada" (board não mostra progresso) e "resumo por marco" (quem lê o Jira passa a ler uma
versão editada, e ninguém sabe qual leu quem).

**Issue antes do plano, sempre — inclusive no atalho de `processo.md` §5.** O atalho dispensa plano e
ficha; não dispensa issue.

**Por quê:** o custo real dessas três não é o que elas cobram, é o que elas evitam. Duas numerações
convivendo é um incômodo de citação; ficha renomeada por chave externa é um `git log` ilegível. Issue
gigante é um incômodo de leitura; board que só recebe trabalho depois de pronto não é board. E o
espelhamento verbatim tem uma propriedade que o resumo não tem: é **append-only** — comentário
publicado nunca é editado, correção é comentário novo datado, exatamente como migration é
forward-only. Cópia editada em silêncio produz duas verdades e nenhum aviso.

**Como aplicar:** o protocolo inteiro está em `.claude/rules/jira.md` — não o reproduza aqui. O que
esta memória guarda e a regra não diz: **agent especialista não tem o Jira nas ferramentas dele, e
isso é de propósito.** Oito agents comentando na mesma issue produzem um fio concorrente e ilegível,
o mesmo defeito que território de escrita existe para evitar. O `orquestrador` decide o conteúdo
(status, comentário, quando fecha); o thread principal é o único que escreve. Agent que precisa de
algo do Jira pede em `PERGUNTAS: para humano`.

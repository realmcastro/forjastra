# SPR-56 — Reescrever os cards do board contra o esqueleto de duas formas (pós-T-0007)

**Tipo:** História · **Estado ao migrar:** Concluído · **Prazo que constava:** —

---

## Objetivo

Pedido literal do humano, em 2026-08-26: depois de ver o resultado de T-0007/SPR-55, achou os cards  
"muito ruins ainda" e trouxe um exemplo concreto de card (prova de Expo na superfície sem custódia)  
como padrão-alvo. Em resposta, `.claude/rules/produto.md` foi reescrito radicalmente: nova seção "O  
esqueleto de um card — duas formas" — cards de regra de negócio mantêm Objetivo/Escopo/Critério de  
aceite; cards de prova/Spike/validação técnica ganham a forma nova (Contexto com diagrama de fluxo e  
pergunta em destaque → O que testar, cenário por cenário nomeado com desfecho exato → Entrega com  
rubrica fixa de registro → Critério de conclusão, que aceita falha documentada). Congruência também  
ficou mais exigente: dependência ausente exige lista completa do que o mock precisa cobrir, não "usar  
mock" genérico.

Objetivo desta issue: reler as 52 issues do board contra o padrão novo e reescrever onde a forma ou a  
profundidade não atingem o exemplo trazido pelo humano.

## Escopo

* Todas as 52 issues do board `SPR` (`SPR-1`..`SPR-33`, `SPR-35`..`SPR-52`), a mesma base de T-0007.
* Identificar por issue qual das duas formas se aplica (regra de negócio vs. prova/Spike/validação) e  
  reescrever na forma certa quando a atual não bate.
* Cards de prova/Spike (`SPR-42`, `SPR-43`, e outros que a leitura revelar) recebem o tratamento mais  
  profundo: diagrama de fluxo quando há mecanismo em etapas, cenários nomeados um a um com desfecho  
  exato, mocks enumerados por completo, rubrica de registro, critério de conclusão que aceita falha  
  documentada.
* Cards de regra de negócio recebem a checagem reforçada de Congruência (mock/substituto enumerado,  
  não genérico) onde se aplicar.

## Fora de escopo

* Decidir prioridade, prazo, dono ou status de qualquer card.
* Criar `RN` nova, decidir qualquer `G-01`..`G-09`, ou qualquer fronteira núcleo/módulo em aberto.
* Fundir ou excluir card.
* Responder as três perguntas que T-0007 deixou para o humano (Epic `SPR-35` em paralelo à Fase 1;  
  papel que cancela comanda em `SPR-12`; leitura do aceite de `SPR-48`).

## Critério de aceite

Card de prova/Spike lido de ponta a ponta se parece, em forma e profundidade, com o exemplo que o  
humano trouxe: mecanismo desenhado, cenário por cenário com desfecho exato, mock especificado por  
completo, critério de conclusão honesto sobre falha. Card de regra de negócio responde as quatro  
perguntas com a mesma concretude já alcançada em T-0007, mais a Congruência reforçada.

## Referências

.claude/rules/produto.md · .claude/rules/jira.md §9 · tarefas/T-0007-reescrever-backlog-quatro-perguntas.md

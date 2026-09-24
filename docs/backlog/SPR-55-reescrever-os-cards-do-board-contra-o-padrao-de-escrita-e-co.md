# SPR-55 — Reescrever os cards do board contra o padrão de escrita e congruência

**Tipo:** História · **Estado ao migrar:** Concluído · **Prazo que constava:** —

---

## Objetivo

Pedido literal do humano, em 2026-08-26: "ainda to achando todas as tarefas BEM mal explicadas, elas  
tao muito IA, nao explicam direito o que tem que fazer, onde tem que fazer, porque tem que fazer, o  
que deve ter pronto antes de fazer". Confirmado como avaliação do board inteiro, não de cards  
pontuais. Objetivo: reescrever os cards do `SPR` para que cada um responda, sem ambiguidade, o quê,  
onde (fronteira núcleo/módulo, quando aplicável), por quê e o que precisa já existir antes de alguém  
começar.

## Escopo

* Revisão de padrão geral nos cards do board `SPR` (não é conferência card a card contra a spec —  
  isso já rodou em T-0006/SPR-54).
* Aplicar o padrão de escrita de `.claude/rules/produto.md`: enunciado testável na primeira frase,  
  motivo, critério de aceite concreto (não adjetivo), caminho infeliz, e os tiques de estilo a evitar.
* Aplicar a congruência de `produto.md` ("quem pega este card amanhã consegue começar?"): declarar o  
  que o aceite exige que já precisa existir, e o que substitui o que ainda não existe (entrada  
  simulada, exemplo fixo, duplo de teste) ou declarar que o card não é executável ainda e por quê.

## Fora de escopo

* Decidir prioridade, prazo, dono ou status de qualquer card.
* Criar `RN` nova, decidir qualquer `G-01`..`G-09`, ou qualquer fronteira núcleo/módulo em aberto.
* Fundir ou excluir card.

## Critério de aceite

Quem pegar qualquer card do board consegue começar a trabalhar sem precisar perguntar o que fazer,  
onde, por quê, ou o que precisa existir antes — e o texto não lê como escrito por quem não faria o  
trabalho.

## Referências

.claude/rules/produto.md

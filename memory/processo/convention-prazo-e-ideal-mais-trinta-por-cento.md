---
name: convention-prazo-e-ideal-mais-trinta-por-cento
description: data limite de issue no Jira é a estimativa ideal mais 30%, contada em dias úteis — folga embutida no prazo, não negociada depois; e a estimativa vai declarada como estimativa
type: convention
escopo: processo
camada: processo
data: 2026-08-26
relaciona: [[reference-jira-projeto-spr]], [[decision-jira-e-o-registro-publico-da-tarefa]]
---

Toda `duedate` no Jira é calculada como **`ceil(ideal × 1,3)` em dias úteis**, encadeada dentro da
trilha de cada pessoa. Fixado pelo humano em 2026-08-26.

**Por quê:** o humano pediu folga embutida — "queremos trabalhar com folga". A leitura literal do
pedido ("30% do tempo ideal") daria prazo **menor** que o ideal, o que é o oposto de folga; a leitura
coerente com o motivo é ideal **mais** 30%. Folga que mora no prazo é folga que existe; folga que
depende de renegociar prazo no meio não é folga, é atraso com outro nome.

**Como aplicar:**
- A estimativa ideal é **estimativa** e vai rotulada como tal — nunca apresentada como medida
  (`00-nucleo.md` §4).
- Encadeie por pessoa, não por issue: duas issues da mesma pessoa não rodam em paralelo.
- Issue **sem dono** recebe data como **alvo**, não como compromisso, e isso é dito no comentário.
- História de funcionalidade que depende de fundação inacabada recebe a data do **bloco da Epic**, e
  a data individual só é refinada quando a Epic começa. Precisão fabricada em data distante é pior
  que data de bloco declarada.

# Memória — Clientes

Um subdiretório por cliente (`<slug>`, o mesmo do schema `t_<slug>`). Leia **só** o do cliente da
sua tarefa — a memória de um cliente não existe para quem trabalha em outro.

| Cliente | Vertical | Índice | Estado |
|---|---|---|---|
| _(nenhum ainda)_ | — | — | — |

Estrutura de cada um:

```
clientes/<slug>/INDEX.md                     particularidades cross-module
clientes/<slug>/modulos/<modulo>/INDEX.md    o que ESTE cliente muda NESTE módulo
```

Registro de cliente que **contradiz** a regra geral do módulo declara `supera: [[slug-da-geral]]`, e
a regra geral **não** é alterada. Duas verdades convivendo com precedência declarada é o desenho;
regra geral reescrita para caber num cliente é o defeito.

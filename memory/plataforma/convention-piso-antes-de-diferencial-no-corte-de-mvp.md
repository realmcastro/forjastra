---
name: convention-piso-antes-de-diferencial-no-corte-de-mvp
description: MVP não recebe diferencial enquanto houver piso descoberto — capacidade obrigatória por dependência é piso por definição, e capacidade que substitui mecanismo velho já em uso é candidata a piso
type: convention
escopo: plataforma
camada: produto
data: 2026-08-22
relaciona: [[convention-necessidade-antes-de-mecanismo]]
tarefa: T-0001
---

No catálogo de capacidades (`docs/produto/catalogo-de-capacidades.md`), dois campos decidem corte de
escopo antes de qualquer conversa sobre valor:

- `opt-in: obrigatória por dependência` → é **piso**, por definição. Não é escolha do comerciante.
- `arcaico: sim → PN-nn` → é **candidata a piso**: a necessidade **já é atendida hoje** pelo mecanismo
  velho, e entregar menos que o velho é o defeito que `.claude/rules/00-nucleo.md` §12 nomeia.

**Regra:** MVP não recebe diferencial enquanto houver piso descoberto. Exceção só item por item, com o
humano.

**Por quê:** foi assim que apareceu o piso que ninguém tinha visto — o módulo de periféricos com
**zero** regras, sendo dependência prática do caso base da emissão fiscal, que está no MVP 1. Antes da
correção, **por escrito o PDV offline não imprimia e não abria gaveta**. Diferencial atrasado não perde
valor; piso ausente perde a venda no primeiro dia.

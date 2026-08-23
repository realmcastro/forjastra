---
name: decision-legibilidade-do-foco-e-propriedade-do-par
description: o indicador de foco é um par de contornos contíguos e a legibilidade é propriedade do par, não de cada membro — cada superfície tem um membro que carrega, e desenhar um membro só reprova em silêncio
type: decision
escopo: plataforma
camada: ui
data: 2026-08-23
relaciona: [[convention-prefixo-de-token-uma-especie]]
tarefa: T-0002
---

Medido (WCAG, luminância relativa; valores e método em `docs/design/tokens-cor.md` §5.2):

| par | membro escuro | membro claro |
|---|---|---|
| foco sobre `disabled-surface` (`#E3E3E3`) | **13,56** — carrega | **1,28** — não carrega |
| foco sobre `danger` | **2,89** — reprova o piso de 3 | **6,02** — carrega |

Nenhuma cor reprova contra o branco **e** contra o escuro ao mesmo tempo. Logo o par **sempre** tem um
membro que carrega, e a legibilidade do foco é propriedade **do par**.

**Por quê / o que foi recusado:** a saída fácil para o 2,89 era afrouxar o piso ou trocar a cor de
estado. As duas foram recusadas — o piso nunca cede para caber uma cor, nem a de marca. O par de
contornos contíguos resolve as duas direções com uma decisão só, e é verificável por medida.

**A consequência que morde:** os dois membros são **inseparáveis**. Desenhar um só faz o sistema
**reprovar em silêncio**, em uma das duas direções, e nada acusa — a tela parece certa em todo lugar
menos naquele estado. O indicador de foco nunca é removido e não é o acento: fluxo completável sem
tocar a tela depende dele.

---
name: convention-prefixo-de-token-uma-especie
description: um prefixo de id nomeia uma espécie só, com um arquivo dono, e o sufixo nunca é o discriminador — spacing. é a escala de espaçamento, space. é o espaço de desenho; e id que atravessa a rede nunca se renomeia
type: convention
escopo: plataforma
camada: ui
data: 2026-08-23
relaciona: [[decision-legibilidade-do-foco-e-propriedade-do-par]]
tarefa: T-0002
---

**Um prefixo, uma espécie, um arquivo dono.** O **sufixo nunca é o discriminador**: `spacing.200` é a
escala de espaçamento, `space.operator-station` é um espaço de desenho. Prefixo novo entra por linha no
registro de prefixos de `docs/design/vocabulario-e-eixos.md` §1.5, na mesma mudança que cria o
primeiro id dele.

**Por quê:** `space.` nomeava as duas espécies ao mesmo tempo. A ambiguidade não quebra nada
imediatamente — ela quebra na hora de renomear, de auditar, e de responder "isto atravessa a rede?".
Resolver custou uma passada; conviver custaria uma para sempre.

**A coluna que o registro ganhou, e que é o motivo de consultá-lo:** *atravessa a rede?*
- **Atravessa** (`block.`, `zone.`, o fato de `state.`/`net.`): **não se renomeia, nunca** — manifesto
  antigo saído do cache do terminal precisa continuar legível pelo cliente novo.
- **Vive no cliente** (token de estilo, `spacing.`, `space.`, `input.`, `density.`): é build, e
  renomear é barato **enquanto nada foi entregue**.

**Como aplicar:** antes de criar id, leia o registro §1.5 e escolha o prefixo pela espécie, não pela
frase que soa bem. Antes de renomear, leia a quarta coluna.

**Substitui** a sugestão `gotcha-prefixo-space-tem-dois-significados`: o sintoma deixou de existir em
2026-08-23 e o registro passaria a descrever um defeito que não está no repositório.

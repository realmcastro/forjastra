# Fichas de tarefa

Uma linha por ficha. A ficha é o bastão que passa entre agents — formato e protocolo em
`.claude/rules/handoff.md`.

| Id | Título | Escopo | Status |
|---|---|---|---|
| [T-0001](T-0001-catalogo-de-modulos-e-roadmap.md) | Catálogo de módulos, fiscal por vigência e roadmap de construção | vertical=restaurante camada=produto | **fechada** 2026-08-23 |
| [T-0002](T-0002-sistema-de-design-nucleo.md) | Sistema de design do núcleo (tokens, grade, estado, vocabulário) | camada=ui | **fechada** 2026-08-23 |
| [T-0003](T-0003-nucleo-de-venda-papeis-e-superficie.md) | Núcleo de venda, papéis e superfície por papel | camada=produto+seguranca | **fechada** 2026-08-23 — gate 3 cumprido, `AUT-01`..`AUT-16` fechados; `AUT-17` (células de módulo) fica aberto para o humano, sem bloquear |

Ficha fechada **permanece**: é o histórico de por quê as coisas são como são. Nome do arquivo:
`T-<id>-<slug>.md`, id sequencial de 4 dígitos, nunca reaproveitado.

O que sobrou das três, com dono, está no `## Fechamento` de cada uma e consolidado em
`memory/plataforma/state-pendencias-abertas-2026-08-23.md`.

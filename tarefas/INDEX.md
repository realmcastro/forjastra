# Fichas de tarefa

Uma linha por ficha. A ficha é o bastão que passa entre agents — formato e protocolo em
`.claude/rules/handoff.md`. **Toda ficha aberta a partir de 2026-08-26 tem issue no Jira**
(`.claude/rules/jira.md`); as cinco primeiras nasceram antes disso e ficam com `—`, sem issue
retroativa.

| Id | Jira | Título | Escopo | Status |
|---|---|---|---|---|
| [T-0001](T-0001-catalogo-de-modulos-e-roadmap.md) | — | Catálogo de módulos, fiscal por vigência e roadmap de construção | vertical=restaurante camada=produto | **fechada** 2026-08-23 |
| [T-0002](T-0002-sistema-de-design-nucleo.md) | — | Sistema de design do núcleo (tokens, grade, estado, vocabulário) | camada=ui | **fechada** 2026-08-23 |
| [T-0003](T-0003-nucleo-de-venda-papeis-e-superficie.md) | — | Núcleo de venda, papéis e superfície por papel | camada=produto+seguranca | **fechada** 2026-08-23 — gate 3 cumprido, `AUT-01`..`AUT-16` fechados; `AUT-17` (células de módulo) fica aberto para o humano, sem bloquear |
| [T-0004](T-0004-gestao-de-estabelecimentos-e-operacao-do-provedor.md) | — | Gestão de estabelecimentos e operação do provedor | camada=produto+dados+seguranca+performance | **fechada** 2026-08-23 — gates 3 e 4 cumpridos, `PRV-01` (CRÍTICO) corrigido e reauditado; `PRV-07`/`08`/`09` e `PRV-16` ficam abertos com dono, sem bloquear. O escopo `provedor` **não opera nada** por três travas, e esse é o desfecho correto |
| [T-0005](T-0005-opcao-b-emissao-fiscal-por-perfil.md) | — | Opção B confirmada (EMI fora do MVP por perfil, FIS dentro) — roadmap e reservas de modelo | modulo=fiscal camada=produto | **fechada** 2026-08-24 — resolve só o eixo emissão própria (A-vs-B) por perfil/tenant; `D-05` continua sendo o bloqueio real de modelagem de `FIS`, sem mudança. `roadmap-de-modulos.md` ultrapassou o teto de linhas sem justificativa, resíduo com dono `produto` |
| [T-0006](T-0006-aplicar-revisao-do-backlog-no-board.md) | SPR-54 | Aplicar no board a revisão do backlog contra a spec aprovada | camada=produto+processo | **bloqueada** 2026-08-26 — os quatro passos executáveis rodaram: Bloco A aplicado integralmente (6 títulos, 7 descrições, cada uma precedida do comentário de preservação), 17 comentários novos, duas retratações publicadas (`SPR-1`, `SPR-27`) e rótulo `bloqueada` em 11 cards. **Não fecha:** quatro entradas esperam decisão do humano (aceite de `SPR-46`, títulos de `SPR-32` e `SPR-27`, Bloco B substantivo), e nenhuma é despachável a agent. A pauta virou §0 de `state-pendencias-abertas-2026-08-23` — dez lacunas com data, a primeira mordendo em 2026-09-02. Resíduo mais sério: `SPR-14` agendado depois de `SPR-41` deixa o gate 2 descoberto pelo calendário |

Ficha fechada **permanece**: é o histórico de por quê as coisas são como são. Nome do arquivo:
`T-<id>-<slug>.md`, id sequencial de 4 dígitos, nunca reaproveitado.

O que sobrou de cada ficha, com dono, está no `## Fechamento` dela e consolidado em
`memory/plataforma/state-pendencias-abertas-2026-08-23.md` — que é também a **pauta única do humano**:
§0 traz as dez lacunas do board **com data de vencimento** (a primeira em 2026-09-02) e as quatro
perguntas de recorte; depois vêm os quatro blocos sem data, ordenados por alavanca.

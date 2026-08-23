---
name: gotcha-fuso-do-estabelecimento-versus-fuso-do-cliente
description: regra aprovada contra regra aprovada — RN-FIS-008 resolve vigência no fuso do estabelecimento e .claude/rules/dados.md §3 diz que o fuso é do cliente; um cliente com estabelecimentos em fusos diferentes torna as duas incompatíveis, e a Fase 1 modela em cima disso
type: gotcha
escopo: plataforma
camada: dados
data: 2026-08-23
tarefa: T-0001
---

**Sintoma:** vai modelar (ou consultar) qualquer coisa que dependa de "a que dia isto pertence" —
vigência de regra fiscal, fechamento de caixa, "vendas de hoje", corte de turno — e encontra duas
regras aprovadas que discordam sobre **de quem** é o fuso:

- `RN-FIS-008` resolve vigência no fuso do **estabelecimento**;
- `.claude/rules/dados.md` §3 diz que o fuso do cliente é dado do cliente, aplicado na borda.

Enquanto um cliente tem um estabelecimento só, as duas coincidem e o conflito não aparece. Com dois
estabelecimentos em fusos diferentes, elas produzem dias diferentes para o mesmo fato.

**Por quê importa mais do que parece:** `estabelecimento` é entidade de primeira classe neste produto
(é a pessoa jurídica que emite documento), e o fuso decide **a que dia o fato pertence** — logo decide
apuração, fechamento e relatório. Corrigir isso depois de existir dado é conversão de coluna em N
schemas, não um `ALTER`.

**Como aplicar:** o conflito é **decisão do humano**, porque resolvê-lo mexe em `.claude/rules/dados.md`,
que é território dele. Até fechar: quem modelar tempo declara explicitamente qual das duas está
assumindo, e não escolhe "para destravar". Corolário operacional já observado: **não existe "fora do
horário" global** em multi-tenant multi-fuso — o horário morto de um cliente é o pico de outro, e
qualquer escalonamento de job em N schemas é palpite enquanto isto estiver aberto.

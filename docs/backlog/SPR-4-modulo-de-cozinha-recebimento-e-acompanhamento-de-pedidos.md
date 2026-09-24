# SPR-4 — Módulo de Cozinha: recebimento e acompanhamento de pedidos

**Tipo:** Spike · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-11-30

---

## Objetivo

Registrar que o módulo `COZ` (recebimento e acompanhamento de pedido na cozinha) já está especificado — 12 `RN` em `docs/produto/modulos/cozinha.md` — e nomear o resíduo real: `LACUNA-COZ-1`, `LACUNA-COZ-2`, e a pergunta ainda aberta ao humano sobre o hardware do ponto de produção.

## Escopo

* `docs/produto/modulos/cozinha.md` cobre 12 `RN`, incluindo o comportamento com o ponto de produção indisponível (`RN-COZ-008`, `:184`) e o que `COZ` nunca faz — mover dinheiro, alterar pedido, decidir disponibilidade (`RN-COZ-010`, `:215`).
* `COZ` usa o espaço de **display fixo de leitura à distância** — não "telão de cozinha": o mesmo espaço serve painel de senha em farmácia e quadro de expedição em depósito. O módulo usa o espaço, não o batiza.
* Resíduo real: `LACUNA-COZ-1` e `LACUNA-COZ-2` (`docs/produto/modulos/cozinha.md` §7).

## Fora de escopo

Criação do pedido, cardápio, gerenciamento de entrega.

## Critério de aceite

Quem abre esta issue encontra `COZ` já especificado por path e `RN`, e sabe que redescobrir a regra é redundante — o que falta é `LACUNA-COZ-1`/`LACUNA-COZ-2` e a escolha de hardware do ponto de produção (tela, impressora, ou os dois).

## Depende de

**Pergunta para o humano, ainda sem resposta:** tela, impressora, ou os dois no ponto de produção. A resposta muda a dependência: a via impressa é `production_ticket` e exige o módulo `PER` (`docs/produto/glossario.md:377`). O núcleo (`SPR-34`) precede qualquer tabela; `COZ` roda na superfície sem custódia (não assina, não imprime documento fiscal) e não espera a Epic `SPR-35`.

## Referências

`docs/produto/modulos/cozinha.md` · `docs/produto/modulos/cozinha.md` §7 · `docs/produto/glossario.md:377`

## Resultados esperados

Ao final do Spike, deverão estar criados e organizados no Jira:Épicos, representando os principais domínios ou capacidades identificados.Histórias de Usuário, vinculadas aos respectivos Épicos.Critérios de aceite, quando aplicável.Tarefas técnicas, quando necessárias.Dependências e integrações com os módulos de pedidos ONLINE, PRESENCIAL e Delivery.Impedimentos e pontos em aberto.

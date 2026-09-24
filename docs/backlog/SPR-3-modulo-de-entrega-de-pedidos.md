# SPR-3 — Módulo de Entrega de Pedidos

**Tipo:** Spike · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-11-30

---

## Objetivo

Registrar que a necessidade descrita nesta issue — receber e concluir pedido destinado à entrega — corresponde a **dois** módulos na spec aprovada, não um: `CMP` (pedido que não se encerra no ato — fila, senha, retirada — dono do estado de cumprimento) e `ENT` (entrega em endereço, que **exige** `CMP`). Tratar como módulo único ("Delivery") produziria spec que não bate com o catálogo já aprovado.

## Escopo

* `docs/produto/catalogo-de-modulos.md` separa `CMP` e `ENT` com a dependência declarada entre eles.
* O estado de cumprimento do pedido é dono de `CMP` (`docs/produto/modulos/mesa-comanda.md:321`).
* `CMP` e `ENT` têm **zero** `RN` cada um, e os dois estão fora do MVP 1 (`docs/produto/roadmap-de-modulos.md:184`).

## Fora de escopo

Criação do pedido (`SPR-1`, `SPR-2`), cardápio, carrinho, processamento na cozinha (`SPR-4`).

## Critério de aceite

Quem abre esta issue encontra a fronteira `CMP`/`ENT` já registrada e sabe que nenhum dos dois tem `RN` ainda — a spec real fica para depois do MVP 1.

## Depende de

**Pergunta para o humano, ainda sem resposta:** recortar esta issue em duas (uma por módulo, `CMP` e `ENT`) ou mantê-la única com os dois entregáveis nomeados. Não decidida nesta passada.

## Referências

`docs/produto/catalogo-de-modulos.md` · `docs/produto/modulos/mesa-comanda.md:321` · `docs/produto/roadmap-de-modulos.md:184`

## Resultados esperados

Ao final do Spike, deverão estar criados e organizados no Jira:Épicos, representando os principais domínios ou capacidades identificados.Histórias de Usuário, vinculadas aos respectivos Épicos.Critérios de aceite, quando aplicável.Tarefas técnicas, quando necessárias.Dependências entre o módulo de Delivery e os módulos de realização de pedidos.Impedimentos e pontos em aberto.

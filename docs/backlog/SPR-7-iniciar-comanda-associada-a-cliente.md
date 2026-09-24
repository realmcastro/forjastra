# SPR-7 — Iniciar comanda associada a cliente

**Tipo:** História · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-11-13
**Agrupador:** SPR-5

---

## Objetivo

Permitir iniciar uma comanda com o nome de exibição do cliente-final como alvo, para estabelecimentos que não usam mesa como identificador de atendimento — um dos três tipos de alvo declarados em `RN-MSA-013` (`docs/produto/modulos/mesa-comanda.md:255`).

## Escopo

* Iniciar comanda informando nome de exibição, ficha/cartão, ou mesa — os três tipos de alvo de `RN-MSA-013`; quais existem é configuração do cliente, editável sem chamado e sem deploy.
* Nome de exibição é identificador **operacional** apenas — nunca constrói histórico por pessoa nem cruza consumos pelo mesmo nome (`RN-MSA-014`, `:270`; comportamento opcional, ligado por `CLF`).
* Não exige cadastro prévio do cliente-final.
* O alvo tem identificador técnico próprio no modelo de dados da comanda.

## Fora de escopo

Cadastro de cliente-final. Vínculo de histórico por pessoa (é `CLF`, módulo à parte).

## Critério de aceite

Uma comanda nasce sempre com um alvo — mesa, ficha/cartão ou nome de exibição — nunca sem nenhum. O nome de exibição, sozinho, não permite reconstruir o histórico de um cliente-final entre comandas diferentes quando `CLF` está desligado.

## Depende de

Nada trava a construção. Pendência à parte, não desta issue: o prazo de retenção do nome de exibição depois do encerramento é decisão do humano (`docs/produto/modulos/mesa-comanda.md:344`) — sem ela, a retenção nasce por omissão, que é o modo como dado de pessoa acumula sem ninguém decidir.

## Referências

`docs/produto/modulos/mesa-comanda.md:255` · `:270` · `:344`

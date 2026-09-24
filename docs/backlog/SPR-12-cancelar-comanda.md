# SPR-12 — Cancelar comanda

**Tipo:** História · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-11-13
**Agrupador:** SPR-5

---

## Objetivo

Permitir cancelar uma comanda que não possa mais ser utilizada, interrompendo seu atendimento sem apagar nem editar o registro original.

## Escopo

* Cancelar é linha nova referenciando a comanda original — nunca apaga, nunca edita. A comanda cancelada continua existindo e consultável.
* Comanda cancelada não recebe novos itens nem é enviada para a cozinha.
* O cancelamento **não consulta** o estado de preparo do item na cozinha para decidir se aceita ou recusa — `MSA` não consulta `COZ` para aceitar, alterar ou encerrar consumo (`RN-MSA-012`, `docs/produto/modulos/mesa-comanda.md:243`); a etapa de preparo em `COZ` "não libera nem impede nada" (`RN-COZ-005`, `docs/produto/modulos/cozinha.md:143`). Trabalho já iniciado na produção segue a regra própria da cozinha (`RN-COZ-007`), sem consulta de volta.
* Com `COZ` desligado, ou com o ponto de produção inalcançável, o cancelamento se comporta igual — nenhuma etapa cita produção.

## Fora de escopo

Encerramento por cobrança (`SPR-13`). Reversão de um cancelamento — não existe: cancelamento é definitivo, uma nova comanda é aberta se o atendimento continuar.

## Critério de aceite

A operação exige autorização de papel, verificada no backend — falha fechado, ausência de regra é negado, nunca liberado — e gera registro de auditoria com quem, quando, o quê e o motivo.

## Depende de

**Pergunta para o humano, ainda sem resposta:** qual papel autoriza o cancelamento — garçom, só gerente, ou garçom até um limite. Não é nenhuma das dez lacunas com data (`docs/produto/backlog-lacunas-g01-g09.md`); é achado desta revisão. Não decidida aqui.

## Referências

`docs/produto/modulos/mesa-comanda.md:243` · `docs/produto/modulos/cozinha.md:143`

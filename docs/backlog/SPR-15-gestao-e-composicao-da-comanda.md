# SPR-15 — Gestão e Composição da Comanda

**Tipo:** Epic · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-11-27

---

## O quê

Permitir que o garçom encontre item de catálogo, configure suas características e os adicione à comanda, mantendo quantidades, adicionais, observações e valores.

## Onde

Composição de pedido é do **núcleo** — item, quantidade, preço aplicado e observação livre no item são do núcleo em qualquer ramo (`docs/produto/fronteira-do-nucleo.md:81` e `:87`). O que `MSA` acrescenta é duração, vínculo e movimentação do consumo antes da cobrança (`docs/produto/modulos/mesa-comanda.md:19`) — não a composição.

## Por quê

Sem localizar item de catálogo e compor a comanda com adicional, observação e quantidade, o garçom não tem como registrar o pedido do jeito que o cliente-final pediu — é o trabalho central do atendimento de mesa.

## O que precisa estar pronto antes

`SPR-39` e `SPR-40` fecham antes de qualquer tabela. Card filho cita `RN-NUC-nnn` para a composição e `RN-MSA-nnn` para o que é do módulo — nenhum reenuncia a regra. Quatro filhos dependem de entidade que a spec aprovada ainda não tem, e são pergunta ao humano, não decidida por eliminação: `SPR-16` (`G-03`, agrupamento de catálogo), `SPR-19` (`G-04`, variação), `SPR-20` (`G-05`, adicional/complemento), `SPR-26` (`G-07`, disponibilidade). Os demais filhos seguem.

## Vocabulário

Onde os filhos dizem "produto" para a entidade vendável, o termo correto é **item de catálogo** (`catalog_item`) — `docs/produto/glossario.md:63` proíbe `product` como nome de entidade.

# SPR-27 — Validar disponibilidade antes do envio

**Tipo:** História · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-11-27
**Agrupador:** SPR-15

---

## Edição de 2026-09-23 — o que mudou, por quê, contra o quê

- **As dependências 1 e 2 foram respondidas por `RN-NUC-071`** (`docs/produto/nucleo-publicacao-e-texto.md`
  §3, T-0014, passo A.2b). A 1 (`G-07`): a marca é **fora de venda**, publicada com vigência no catálogo.
  A 2, que o item chamava de "decisão de produto ainda não tomada": linha lançada antes de a marca vigorar
  vale pela versão com que foi lançada, e sem contato o terminal aplica o que retém, com a divergência
  nomeada na volta (`RN-NUC-071`, b e c; `RN-NUC-015`).
- **A dependência 3 (ingrediente) saiu de `Depende de` e foi para `Fora de escopo`**: ingrediente é
  `FTC`/`EST` (`fronteira-do-nucleo.md` §2.2), os dois fora do MVP 1. Sem eles, o item que faltou por
  ingrediente é marcado fora de venda à mão.
- **O critério de aceite foi escrito.** Antes dizia que não havia critério testável antes das duas
  decisões.
- **O escopo não mudou**: lançamento, no núcleo, e não o envio a `COZ`.

## Objetivo

Quando um item **já lançado** no pedido fica fora de venda antes da conclusão ou do envio à produção, o
operador fica sabendo na hora, com o cliente-final ali, e decide se retira a linha. O produto não decide
por ele e não trava o envio.

## Escopo

Lançamento, no núcleo. `RN-COZ-010` (`docs/produto/modulos/cozinha.md:215`) diz que "acabou o item" não é
decisão de `COZ`; `RN-COZ-008` (`:184`) diz que com o ponto de produção indisponível o lançamento continua
aceito; `RN-MSA-012` (`docs/produto/modulos/mesa-comanda.md:241`) diz que `MSA` não consulta preparo.

- Linha lançada antes de a marca vigorar: continua no pedido, com o preço e a versão com que foi lançada;
  não é retirada, nem repreciada, nem impede a conclusão (`RN-NUC-071`, b).
- O terminal que passa a reter a versão com a marca sinaliza essa linha. Retirar é ato do operador, e a
  retirada é fato (`RN-NUC-054`).
- Sem contato, o terminal lança e conclui pela versão retida; na volta, a venda fica intacta e a
  divergência aparece nomeada (`RN-NUC-015`, b).

## Fora de escopo

- Item que faltou por ingrediente: `FTC` com `EST`, fora do MVP 1.
- Saldo em estoque: `EST`.
- O envio a `COZ` e o que a produção faz com item fora de venda: `COZ`.
- Mostrar o item marcado no catálogo antes do lançamento: `SPR-26`.

## Critério de aceite

1. Linha do item lançada às 10h20; a versão com a marca, vigente às 10h30, chega ao terminal: a linha é
   sinalizada, continua no pedido, e o envio e a conclusão às 10h40 não são bloqueados. A venda sai sem
   pendência, porque a linha foi lançada sob versão vigente.
2. O operador retira a linha sinalizada: a retirada é fato (`RN-NUC-054`), e o pedido segue com o resto.
3. Novo lançamento do mesmo item depois de a marca chegar: recusado (`RN-NUC-071`, a).
4. Terminal em D2 desde as 10h lança o item às 10h45, com a marca vigente no servidor desde as 10h30: o
   lançamento é aceito pela versão retida; ao reconectar, nenhuma linha é removida e a divergência aparece
   com o item e o valor.

## Registra / Não registra

**Registra:** a retirada da linha sinalizada (`RN-NUC-054`) e a divergência da volta, como pendência
nomeada (`RN-NUC-015`).

**Não registra:** a sinalização nem a indisponibilidade na linha lançada. As duas derivam da versão que a
linha congelou e da versão que chegou depois, e gravá-las na linha seria editar lançamento, que
`RN-NUC-053` proíbe.

## Depende de

- `SPR-32`: a marca fora de venda na versão do catálogo.
- A publicação do catálogo ao terminal (`RN-NUC-014`, `RN-NUC-015`), sem item no backlog
  (`docs/produto/pendencias-fase-1-e-2-2026-09-23.md` §7).
- A tela de venda e o consumo em aberto de `MSA`, na Fase 3 e depois.

**Não é executável antes da Fase 3.** O substituto da publicação real, se ela ainda não existir, é o
catálogo de amostra de `SPR-26` mais um pedido em construção com uma linha lançada antes da marca, e os
quatro aceites acima são os casos que ele cobre.

## Gate obrigatório

`performance` (sinalizar a linha ao chegar versão nova não pode custar o caminho do caixa).

## Referências

`docs/produto/nucleo-publicacao-e-texto.md` §3 (`RN-NUC-071`) · `docs/produto/modulos/cozinha.md:215` ·
`:184` · `docs/produto/modulos/mesa-comanda.md:241` · `docs/produto/fatos-de-operacao-ciclo-de-vida-do-pedido.md`
(`RN-NUC-053`, `RN-NUC-054`) · `.claude/rules/backend.md` §3 · `.claude/rules/ui.md` §4 · `SPR-26`

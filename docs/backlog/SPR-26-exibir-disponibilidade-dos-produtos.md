# SPR-26 — Exibir disponibilidade dos produtos

**Tipo:** História · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-11-27
**Agrupador:** SPR-15
**Rótulos:** —

---

## Edição de 2026-09-23 — o que mudou, por quê, contra o quê

- **O bloqueio saiu.** `G-07` fechou em `RN-NUC-071` (`docs/produto/nucleo-publicacao-e-texto.md` §3,
  T-0014, passo A.2b): tirar item de venda é publicar o catálogo com o item marcado **fora de venda**, com
  vigência. A marca é do núcleo, então o item deixa de depender de `EST`, que está fora do MVP 1. O rótulo
  `bloqueada` foi retirado.
- **O critério de aceite, que dizia "não há critério testável antes de `G-07`", foi escrito**, a partir do
  aceite de `RN-NUC-071`.
- **Entraram `Registra / Não registra`, `Fora de escopo` e `Gate obrigatório`**, que o item não tinha.
- **O objetivo não mudou.** Só "disponibilidade" passou a ter nome: fora de venda é decisão do negócio;
  saldo é outra coisa, de `EST`.

## Objetivo

Mostrar ao operador, no catálogo que ele usa para lançar, que um item está fora de venda, antes de ele o
oferecer ao cliente-final, e não depois de o lançamento ser recusado. No consumo em aberto de `MSA`, quem
vê é o atendente.

## Escopo

- O item marcado fora de venda na versão vigente do catálogo aparece identificado como fora de venda, com
  o instante em que a marca passou a valer. Ele **não some**: sumir confunde "tirado de venda" com "não
  cadastrado" (`RN-NUC-071`, recusados).
- Lançar o item marcado é recusado com a mensagem de fora de venda (`RN-NUC-071`, a).
- Quando a versão seguinte, já retida, devolve o item à venda, ele volta a ser lançável sem novo contato.

## Fora de escopo

- Saldo em estoque e "acabou porque o saldo zerou": `EST`, fora do MVP 1.
- Item que faltou por ingrediente: `FTC` com `EST`, fora do MVP 1.
- Item já lançado que fica fora de venda antes do envio: `SPR-27`.
- Quem publica a marca e com que célula: `RN-NUC-014` e a linha 18 da matriz, não este item.

## Critério de aceite

1. "Pão de queijo" publicado fora de venda a partir das 10h30: às 10h31 o operador vê o item marcado, com
   o instante, e tentar lançá-lo é recusado com a mensagem de fora de venda.
2. Publicada junto a versão de volta, vigente às 6h do dia seguinte: às 6h01 o terminal que reteve as
   duas mostra o item à venda e o lança, sem novo contato.
3. Ler o código de um item fora de venda dá a mesma recusa do aceite 1, e nunca "item não cadastrado"
   (`RN-NUC-071`, aceite 5).
4. Terminal em D2 desde antes da publicação: mostra o item como à venda, porque é o que a versão retida
   diz, e não afirma o contrário (`RN-NUC-015`).

## Registra / Não registra

**Registra:** cada lançamento recusado pela marca, como fato de recusa (`RN-NUC-043`), com o motivo de
`RN-NUC-071`.

**Não registra:** que o operador viu o item marcado. É exibição, e se exibição vira fato é pergunta da
família de `docs/produto/fatos-de-operacao.md`, não deste item.

## Depende de

- `SPR-32`: a marca fora de venda na versão do catálogo.
- A publicação do catálogo ao terminal (`RN-NUC-014`, `RN-NUC-015`), que ainda não tem item no backlog
  (`docs/produto/pendencias-fase-1-e-2-2026-09-23.md` §7).
- A tela de venda, que é Fase 3: `apps/web` segue proibido até lá (`CLAUDE.md` §2).

**Não é executável antes da Fase 3.** Quando for, e se a publicação real ainda não existir, o substituto é
um catálogo de amostra retido no terminal com cinco casos, e o item implementa exatamente estes:
(a) item à venda; (b) item fora de venda com vigência já iniciada; (c) item fora de venda com vigência
futura, que deve aparecer à venda até o instante dela; (d) duas versões retidas, a segunda devolvendo um
item à venda; (e) versão retida mais antiga que a vigente, como terminal em D2.

## Gate obrigatório

`performance`: é o catálogo do caminho quente do caixa.

## Referências

`docs/produto/nucleo-publicacao-e-texto.md` §3 (`RN-NUC-071`) e §1 (`RN-NUC-014`, `RN-NUC-015`) ·
`docs/produto/backlog-lacunas-g01-g09.md` §9 · `docs/produto/catalogo-de-modulos.md` (entrada `EST`) ·
`SPR-27`

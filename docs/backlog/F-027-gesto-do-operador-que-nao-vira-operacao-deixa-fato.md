# F-027 — O gesto do operador que não chega a operação passa a deixar fato

**Tipo:** Comportamento fechado · **Estado:** a fazer · **Dono:** `produto` · **Território:**
`docs/produto/**` · **Cobre o achado** `2.20` de `docs/produto/captura-varredura-sem-rn-2026-09-23.md`
· **Agrupador:** F-001 · **Rótulo:** captura

## Objetivo

Três gestos do operador terminam sem operação e sem rastro. Os três existem no posto, na padaria e na
loja de roupa, então são do núcleo:

| Gesto | Regra que o decide | Desfecho hoje |
|---|---|---|
| levantar ação irreversível e cancelar na confirmação (cancelar venda, sangria, desconto, reimpressão) | `docs/design/estados-e-interacao.md:182-205` | nada acontece, nada fica |
| tecla de atalho memorizada sem destino na tela | `:270-277` | uma resposta genérica, nada fica |
| acionar controle indisponível | `:241-242` | o motivo aparece, nada fica |

A confirmação existe porque o operador opera de músculo e **vai errar** (`docs/design/tokens-cor.md:224`).
Quantas vezes ela segurou um erro é a única medida de que a barreira funciona, e ela some. O atalho velho
pressionado depois de uma mudança de composição é o sinal de memória motora quebrada que `PN-06` existe
para evitar; também some. É a categoria "montado e abandonado" de `.claude/rules/produto.md`.

## Escopo

- Fato de confirmação abandonada: qual ação, em que momento do fluxo, instante.
- Fato de atalho sem destino, sem dizer se o recurso existe (a indistinguibilidade de
  `estados-e-interacao.md:275-276` é a defesa, e o fato não pode desfazê-la).
- Fato de acionamento de indisponível, com o motivo que foi mostrado.
- A regra dona, no núcleo.

## Fora de escopo

- Mudar a confirmação, o atalho ou o controle indisponível.
- Automação que propõe e o operador recusa: `pending_proposal` já registra (`modulos/atendimento-ia.md:372`).
- Ler a série: relatório é `REL`.

## Critério de aceite

1. Operador abre a confirmação de cancelar venda e escolhe cancelar: a venda segue intacta, e existe fato
   de confirmação abandonada nomeando a ação.
2. Depois de uma mudança de composição, dez toques da tecla que era de uma ação agora ausente produzem
   série visível, sem nenhum fato distinguir "não existe nesta tela" de "negado".
3. Acionar a impressora ausente devolve o motivo, e existe fato com o motivo.
4. Nenhum dos três atrasa o caminho crítico, e falha ao registrar não muda nada na tela.

## Registra / Não registra

**Registra:** o gesto, a ação ou a tecla, o instante, o terminal.

**Não registra, e por quê:**

- Se o recurso por trás do atalho existe: registrar isso reabre a divulgação que o caso A de
  `estados-e-interacao.md` §4 fecha.
- **Aberto, e o item decide:** se o fato carrega o operador. A pergunta "a barreira funciona?" não precisa
  de pessoa (`CLAUDE.md` §7.10, limite 1); a pergunta "alguém ensaia cancelamento?" precisa. O item
  escolhe com a decisão que o fato informa escrita ao lado.

## Depende de

Conferência de `nucleo-venda.md` e `nucleo-caixa-e-turno.md`, em edição em 2026-09-23: se alguma `RN`
já trata desistência de ação sensível, este item se reduz ao que ela não cobre.

## Gate obrigatório

`performance` (captura na superfície do caixa) e `seguranca` (o fato de atalho não pode virar canal de
enumeração).

## Referências

`docs/produto/captura-varredura-sem-rn-2026-09-23.md` §2.20 · `docs/design/estados-e-interacao.md:182-205`,
`:241-242`, `:270-277` · `docs/design/tokens-cor.md:224` · `docs/produto/postura-nova-geracao.md` (`PN-06`) ·
`docs/produto/fatos-de-operacao-ciclo-de-vida-do-pedido.md` (`RN-NUC-054`, precedente de retirada que vira fato)

# SPR-22 — Lançar item de catálogo no consumo em aberto, com observação

**Tipo:** História · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-11-27
**Agrupador:** SPR-15

---

## Objetivo

Lançar um item de catálogo em um consumo em aberto exige que o item **e** o preço aplicável já estejam no artefato publicado que o terminal retém. O lançamento grava a quantidade na **unidade declarada** do item, **qual versão** de catálogo e de preço aplicou, e o **autor e o instante** do lançamento. O lançamento pode carregar uma **observação do item de pedido** (`order_item_note`), coletada no mesmo ato.

Este card absorve `SPR-21` (observação no item) — ver comentário de fusão em `SPR-21`.

## Escopo

* `RN-NUC-002` (`docs/produto/nucleo-venda.md:113`) — lançar item **aplica** artefato publicado; item sem preço publicado **não é lançado**; a linha grava as versões aplicadas. O motivo é "aplicar, não decidir": preço digitado no terminal é o terminal decidindo dinheiro.
* `RN-MSA-004` (`docs/produto/modulos/mesa-comanda.md:125`) — cada lançamento carrega **autor e instante**. Sem isso o lançamento errado não se atribui a ninguém, e é aí que o dinheiro escapa no ramo.
* `RN-NUC-016` (`docs/produto/nucleo-publicacao-e-texto.md:160`) — a observação carrega **origem declarada** (quem escreveu, por qual canal, em que instante), atribuída **na borda que a recebeu**; é preservada **literal e opaca**; é exibida **atribuída à origem** e distinguível de mensagem do produto; e **nunca** é chave de decisão, nunca concede autoridade, nunca amplia escopo, nunca muda limite, nunca aplica valor e nunca altera prioridade. Observação vinda de fora — cliente-final, canal, plataforma — é **entrada não confiável** e carrega origem declarada (`docs/produto/glossario.md:81`).

## Critério de aceite

1. Lançar item cujo preço está no artefato publicado retido, **com o link caído** → aceito; a linha guarda a versão de catálogo e a versão de preço aplicadas, mais autor e instante.
2. Lançar item **sem** preço no artefato publicado retido → recusado **falhando fechado**, e a falta é declarada como **falta de publicação**, não como erro de rede; a venda **continua** com o que existe (`RN-NUC-013`, infeliz (a) — `docs/produto/nucleo-publicacao-e-texto.md:89`).
3. Lançar com observação ("sem cebola") → a observação é gravada com origem declarada, é apresentada atribuída à origem, e **nenhuma** decisão do produto (preço, roteamento, prioridade, autorização) muda por causa do texto.
4. Conferir que o texto da observação não é interpretado como código, marcação ou instrução em nenhum caminho.
5. O lançamento aparece no consumo **imediatamente**, sem esperar confirmação do servidor — inclusive com o link caído. O que ainda não sincronizou é visível como pendência no próprio terminal, com a contagem, sem interpretação técnica (`RN-MSA-011`, `docs/produto/modulos/mesa-comanda.md:224`).

## Depende de

Nenhuma issue ou decisão externa precede esta — as regras que a governam (`RN-NUC-002`, `RN-MSA-004`, `RN-NUC-016`) já estão aprovadas.

## Fora de escopo

Variação e adicionais na linha ficam atrás de `G-04` e `G-05`. Atualizar o valor do consumo é `SPR-29`, que compõe o acumulado.

## Gate obrigatório

Desempenho (lançamento é caminho crítico do caixa, orçamento de "adicionar item na venda" em `.claude/rules/performance.md` §3) e segurança (observação é entrada não confiável — `.claude/rules/seguranca.md` §4).

## Referências

`docs/produto/nucleo-venda.md:113` · `docs/produto/modulos/mesa-comanda.md:125` · `:224` · `docs/produto/nucleo-publicacao-e-texto.md:160` · `:89` · `docs/produto/glossario.md:81` · `SPR-21`

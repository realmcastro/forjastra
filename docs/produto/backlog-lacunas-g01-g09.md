# Pauta — as nove lacunas de regra do backlog `SPR`, para responder numa sentada

> **O que é.** As nove lacunas `G-01`..`G-09` que a revisão do board achou (`revisao-backlog-spr-2026-08-26.md`
> §2), mais `LACUNA-GLO-001`, na forma em que se respondem. Cada item traz a pergunta, os cards que ela
> trava, a data em que o bloqueio morde, as saídas com o custo de cada uma, e o default que o board toma
> se ninguém responder.
>
> **Nenhuma está decidida aqui, e quatro não podem ser** — `G-03`, `G-04`, `G-05` e `G-07` são fronteira
> núcleo × módulo, e `fronteira-do-nucleo.md:169` manda que fronteira que não se resolve pelos quatro
> passos venha como pergunta, nunca por eliminação.
>
> **Estado em 2026-09-23.** O humano delegou as decisões pelo critério de escalabilidade (`F-018`,
> T-0014), e a pergunta foi respondida pela regra, não por eliminação: oito das dez fecharam, cada uma com
> `RN`, recusado e motivo, e `G-09` só na parte que é regra nossa. A coluna "Estado" da tabela diz onde. O texto de cada seção fica como estava,
> porque é o registro da pergunta; a linha "Fechada" no topo dela aponta a resposta.
>
> **As datas são prazo de entrega do card, não data de início.** Quem pegar o card encontra a lacuna antes
> disso. Fonte: `duedate` do board, lido em 2026-08-26.
>
> **Ordem contra o brief desta passada, e o board é a razão.** A pauta foi encomendada abrindo pelo fuso,
> em 2026-09-08. `SPR-40` vence em **2026-09-02**, seis dias antes, e é o `G-09`. O fuso é o segundo item.

| # | Lacuna | Morde em | Cards | Dono da resposta | Estado em 2026-09-23 |
|---|---|---|---|---|---|
| 1 | `G-09` — arredondamento | **2026-09-02** | 3 | humano, com o contador | fechada no que é nosso: `RN-NUC-064` (rateio), `RN-NUC-067` (modo publicado); aviso para o que a norma exige (`nucleo-venda.md` §6) |
| 2 | `LACUNA-GLO-001` — fuso | **2026-09-08** | 4 | humano | fechada: `RN-NUC-057` |
| 3 | `G-03` — agrupamento de catálogo | 2026-09-16 | 2 | humano + `produto` | fechada: `RN-NUC-068` |
| 4 | `G-05` — adicional | 2026-09-22 | 6 | humano + `produto` | fechada: módulo `ADI`, `RN-NUC-070`; aviso de MVP na entrada de `ADI` |
| 5 | `G-04` — variação | 2026-09-22 | 5 | humano + `produto` | fechada: `RN-NUC-069`; aviso de `GRD` (§5) |
| 6 | `G-01` — as três reservas da Opção B | 2026-10-07 | 2 | humano | fechada: `RN-NUC-065` |
| 7 | `G-02` — turno | 2026-10-07 | 1 | humano | fechada: `RN-NUC-062` |
| 8 | `G-06` — contador de comanda por mesa | 2026-11-13 | 3 | humano + `produto` | aberta |
| 9 | `G-07` — disponibilidade | 2026-11-27 | 2 | humano + `produto` | fechada: `RN-NUC-071` |
| 10 | `G-08` — busca de catálogo | 2026-11-27 | 1 | `produto`, depois os auditores | aberta, com a passada A.2c de T-0014 |

Empate em 09-22 e em 10-07 desempatado por quantos cards a resposta solta. `SPR-33` conta em `G-04` e
`G-05` porque a revisão põe as três lacunas de fronteira travando os três cards de modelagem
(`revisao-backlog-spr-2026-08-26.md:112`).

---

## 1. `G-09` — arredondamento · 2026-09-02 · 3 cards

**Pergunta.** Quando um valor não divide igualmente entre itens, para onde vai o centavo sobrante — e em
que ordem precisão e arredondamento se aplicam na composição do valor?

**Trava.** `SPR-40` (09-02) · `SPR-28` e `SPR-29` (11-27).

**Saídas.**
- Responder antes de 09-02. Custo: uma conversa, e ela não é só sua — `roadmap-de-modulos.md:333` põe o
  contador junto.
- Tirar o rateio de `SPR-40` e deixar o Spike só com tipo, unidade e escala. Custo: o congelado nasce sem
  a metade que o cancelamento usa, e `SPR-28`/`SPR-29` encontram o buraco em 11-27, já na Fase 2.
- Deixar quem preencher "Resultados Esperados" resolver o caso à mão. Custo: a política nasce dentro de um
  card de modelo, sem contador, e vira o caso de teste que prova que o código está certo.

**Sem resposta:** a terceira. O campo é obrigatório no Spike e tem prazo — alguém escreve algo lá em
2026-09-02, e o card pede exatamente um caso de rateio com resto (conferência §4.4).

Referências: `docs/produto/nucleo-publicacao-e-texto.md:46` (`LACUNA-NUC-004`) · `docs/produto/roadmap-de-modulos.md:333`

## 2. `LACUNA-GLO-001` — fuso · 2026-09-08 · 4 cards

**Pergunta.** Quando um cliente tem estabelecimentos em fusos diferentes, qual fuso decide vigência,
"hoje", turno e fechamento — o do estabelecimento ou o do cliente?

**Trava.** `SPR-36` (09-08) · `SPR-46` (09-24) · `SPR-37` (10-07) · `SPR-34` (10-23).

**Saídas.**
- Fuso do cliente. Custo: um cliente com dois estabelecimentos em fusos diferentes passa a ter um "hoje"
  só, e o fechamento de caixa de um deles cai no dia errado. Custo de aplicação hoje é zero: os quatro
  cards já assumem isso.
- Fuso do estabelecimento. Custo: os quatro cards mudam antes de 09-08 — `SPR-36` tira o fuso da linha de
  registro do cliente, e `SPR-46` troca o aceite de "dois clientes de fusos diferentes" por dois
  estabelecimentos.
- Adiar e escrever `SPR-36` sem a coluna. Custo: nenhuma leitura por hora, dia, turno ou mês é publicável
  até o dono da hora existir.

**Sem resposta:** fuso do cliente, decidido pelo corpo de `SPR-36` em 09-08, e três cards o herdam. A
palavra "fuso" não aparece no título de `SPR-36` — foi por isso que a revisão o marcou `MANTER` e a
conferência o mudou para `BLOQUEAR` (§2.1). Depois de escrita, a coluna só sai por expand/contract em N
schemas.

Referências: `docs/produto/glossario.md:395` · `docs/produto/nucleo-publicacao-e-texto.md:49`

## 3. `G-03` — agrupamento de catálogo · 2026-09-16 · 2 cards

**Fechada em 2026-09-23 → `RN-NUC-068`** (`nucleo-publicacao-e-texto.md` §3): a terceira saída, com o
grupo operacional como núcleo de uso opcional (`catalog_group`) e a seção de canal em `PUB`
(`channel_section`). O risco nomeado abaixo, confundir os dois termos, está tratado em `glossario.md` §5.

**Pergunta.** Existe agrupamento de item de catálogo no núcleo, ou agrupar é capacidade de `PUB`?

**Trava.** `SPR-31` (09-16, com rótulo `bloqueada`) · `SPR-16` (11-27).

**Saídas.**
- Núcleo. Custo: linha nova na fronteira §2.2, e o teste dos três negócios precisa passar para os três. O
  argumento a favor é concreto: sem nenhum agrupamento, o operador de padaria só acha item por código.
- `PUB`. Custo: `PUB` está fora do MVP 1 (`roadmap-de-modulos.md:184`) e tem 0 `RN` — `SPR-16` deixa de ser
  construível no MVP e `SPR-31` deixa de ser modelável.
- Os dois, com nomes distintos: agrupamento operacional no núcleo, agrupamento de canal em `PUB`. Custo:
  dois termos vizinhos no glossário, separados para sempre, e alguém vai confundi-los.

**Sem resposta:** `SPR-31` modela a hierarquia como entidade de núcleo. Hoje o que segura o card é o
rótulo `bloqueada`, não o calendário — e rótulo sai.

Referências: `docs/produto/catalogo-de-modulos.md` (entrada `PUB`) · `docs/produto/fronteira-do-nucleo.md:169`

## 4. `G-05` — adicional · 2026-09-22 · 6 cards

**Fechada em 2026-09-23 → `RN-NUC-070`** (`nucleo-publicacao-e-texto.md` §3): a segunda saída, módulo
novo `ADI` (código em `glossario.md` §4.3), e **multiconjunto**. O custo apontado abaixo ("o MVP 1 ganha um
módulo que o roadmap não previu") não se paga sem o humano: pôr `ADI` no MVP 1 é escopo comercial, e a
entrada de `ADI` em `catalogo-de-modulos.md` tem o aviso. A contradição com `RN-NUC-013` saiu pela linha de
artefato de módulo que aquela tabela ganhou.

**Pergunta.** "Adicional" pertence ao núcleo, a um módulo novo ou a um módulo existente — e ele é conjunto
(cada adicional zero ou uma vez) ou multiconjunto (cada um com quantidade própria)?

**Trava.** `SPR-32` e `SPR-33` (09-22 e 09-28, ambos `bloqueada`) · `SPR-18`, `SPR-20`, `SPR-22`, `SPR-29`
(11-27).

**Saídas.**
- Núcleo. Custo: o teste dos três negócios não passa hoje — posto e loja de roupa não precisam —, então a
  fronteira mudaria contra o próprio critério dela.
- Módulo novo. Custo: o código nasce em `glossario.md:289` antes da spec, e o MVP 1 ganha um módulo que o
  roadmap não previu.
- Capacidade de um módulo existente. Custo: essa saída começa sem candidato — a revisão já descartou `PRM`,
  `ECG` e `FTC`, então escolhê-la exige nomear qual.

A segunda pergunta tem custo próprio: conjunto torna "bacon duplo" impossível (conferência §4.6);
multiconjunto faz o valor composto virar soma de produtos, e cai em cima de `G-09`.

**Sem resposta:** `SPR-18` e `SPR-20` chegam em 11-27 tratando adicional como coisa do núcleo que compõe
valor, e compor valor a partir de artefato fora da lista fechada contradiz `RN-NUC-013` (revisão §3, linha
3). Os dois cards de modelagem estão bloqueados; esses quatro não estão.

Referências: `docs/produto/glossario.md:289` (§4.3) · `revisao-backlog-spr-2026-08-26.md:120`

## 5. `G-04` — variação · 2026-09-22 · 5 cards

**Fechada em 2026-09-23 → `RN-NUC-069`** (`nucleo-publicacao-e-texto.md` §3): a segunda saída, com o
núcleo vendendo só item atômico. `GRD` fica fora do MVP 1 por decisão do thread de 2026-09-23, o que dá à
terceira saída o papel de comportamento enquanto isso. O aviso, igual ao da entrada de `GRD`:

> **Indisponível — variação de um item por eixo (tamanho, sabor, cor).** Não funciona: vender o mesmo
> item em combinações de eixo, como bebida em 300 ml e 500 ml, sem cadastrar cada combinação. Falta:
> `GRD` no MVP. Responde: humano (escopo comercial; `GRD` fora do MVP 1 por decisão de 2026-09-23).
> Enquanto isso: cada combinação é item de catálogo próprio, cadastrado individualmente
> (`catalogo-de-modulos.md:270`, `GRD` desligado). Desde: 2026-09-23.

**Pergunta.** Eixo único com preço próprio — tamanho 300 ml e 500 ml — é do núcleo, ou é o degrau de baixo
de `GRD`?

**Trava.** `SPR-32` e `SPR-33` (09-22 e 09-28, ambos `bloqueada`) · `SPR-18`, `SPR-19`, `SPR-22` (11-27).

**Saídas.**
- Núcleo. Custo: mexe no núcleo com todos os clientes em produção, e deixa uma fronteira difusa entre "um
  eixo" e "dois eixos" ao lado de `GRD`.
- Degrau de baixo de `GRD`. Custo: `GRD` está fora do MVP 1 e a receita `RES` não o liga
  (`receitas-por-vertical.md:46`) — ou a receita muda, ou o restaurante não tem tamanho de bebida no MVP.
- Nenhum dos dois: cada combinação é item de catálogo próprio, que é o comportamento desligado de `GRD` já
  escrito. Custo: o cadastro multiplica à mão, que é o trabalho que `GRD` existe para eliminar.

**Sem resposta:** a terceira, por omissão. `SPR-19` já manda diferença estrutural para item próprio
(conferência §2.7) e chega em 11-27 sem entidade de variação em lugar nenhum.

Referências: `docs/produto/fronteira-do-nucleo.md` §2.2 (linha de `GRD`) · `docs/produto/catalogo-de-modulos.md` (entrada `GRD`) ·
`docs/produto/receitas-por-vertical.md:46`

## 6. `G-01` — as três reservas da Opção B · 2026-10-07 · 2 cards

**Pergunta.** A Fase 1 modela as três reservas que a Opção B declarou como condição — numeração por
estabelecimento e série, congelamento e o grão dele, âncora da obrigação documental no fato?

**Trava.** `SPR-37` (10-07) · `SPR-34` (10-23).

**Saídas.**
- Sim, dentro de `SPR-37` e do escopo da Epic. Custo: `SPR-37` cresce perto do prazo, e o grão do
  congelamento é decisão de `produto` ainda não tomada.
- Sim, em card próprio antes de 10-07. Custo: um card novo, e ele depende do mesmo grão.
- Não. Custo: ligar `EMI` depois vira migração de dado fiscal em N clientes
  (`roadmap-de-modulos.md:255`) — e a Opção B foi escolhida em T-0005 sob a condição de que isso não
  acontecesse.

**Sem resposta:** a terceira, sem ninguém ter dito "não". `SPR-37` para em venda, pagamento, caixa e
operador, e a Fase 1 fecha sem as reservas.

Referências: `docs/produto/roadmap-de-modulos.md:258`

## 7. `G-02` — turno · 2026-10-07 · 1 card

**Pergunta.** O que é turno: quem abre, o que o fechamento encerra, e o que acontece com turno aberto na
virada do dia?

**Trava.** `SPR-37` (10-07), que tem turno no título.

**Saídas.**
- Definir agora. Custo: a resposta registrada é "não sei ainda", e definir sem operação real é inventar
  quem abre e o que se perde na virada.
- Tirar turno de `SPR-37` e modelar o resto. Custo: quando turno existir, ele entra por expand em tabela de
  fato já povoada — caro, e é o ciclo previsto.
- Modelar turno como está. Custo: o modelo é a camada onde não se desfaz, e abrir e fechar turno segue
  recusado pelo default.

**Sem resposta:** a terceira. O turno está no escopo do card, e o card tem prazo.

Referências: `docs/produto/nucleo-venda.md:370` (`LACUNA-NUC-007`)

## 8. `G-06` — contador de comanda por mesa · 2026-11-13 · 3 cards

**Pergunta.** "Comanda 1, 2, 3 dentro da Mesa 10" é referência humana legítima — e, se for, qual é o escopo
dela e quem aloca o número?

**Trava.** `SPR-6`, `SPR-8`, `SPR-9` (11-13). As três aparições são de aceite, não de título — a de `SPR-8`
e a de `SPR-9` só apareceram na conferência (§2.2, §2.3).

**Saídas.**
- Sim, com regra própria: escopo declarado e mecanismo de alocação. Custo: um segundo espaço de nomes para
  manter, e ele precisa sobreviver ao offline como a numeração de venda sobrevive.
- Não: a comanda se localiza pelo alvo mais a referência única do estabelecimento. Custo: o garçom deixa de
  dizer "comanda 2 da mesa 10" e passa a dizer um número maior — mudança de hábito de operação, e os três
  cards presumem que ela não acontece.
- Sim, mas só como rótulo de exibição, sem valor de identificador. Custo: dois números para a mesma coisa
  na tela, e alguém vai usar o rótulo para localizar.

**Sem resposta:** os três cards chegam em 11-13 com o contador no critério de aceite e sem regra atrás, e o
número vira coluna.

Referências: `docs/produto/nucleo-venda.md:296` (`RN-NUC-038`)

## 9. `G-07` — disponibilidade · 2026-11-27 · 2 cards

**Fechada em 2026-09-23 → `RN-NUC-071`** (`nucleo-publicacao-e-texto.md` §3): a primeira saída, com a
marca **fora de venda** como conteúdo da versão de catálogo publicada, com vigência. O custo apontado
abaixo ("um estado a mais para manter em todo terminal offline") não se paga: a marca viaja na versão
que já viaja, e não é estado vivo nem membro novo de `RN-NUC-013`. Saldo continua em `EST`. A terceira
saída, ausência, foi recusada porque confunde item tirado de venda com item não cadastrado.

**Pergunta.** Existe marca de disponibilidade no caminho de venda do núcleo, ou indisponível é sempre
ausência do artefato publicado, com disponibilidade real morando em `EST`?

**Trava.** `SPR-26` e `SPR-27` (11-27).

**Saídas.**
- Marca no núcleo. Custo: linha nova na fronteira, e o núcleo passa a exibir item que não pode ser vendido
  — um estado a mais para manter em todo terminal offline.
- Só `EST`. Custo: `EST` está fora do MVP 1 e, desligado, "a venda não consulta disponibilidade"
  (`catalogo-de-modulos.md`, entrada `EST`) — `SPR-26` e `SPR-27` deixam de ser construíveis no MVP 1.
- Ausência com motivo: o item some do artefato publicado e o operador vê por que sumiu. Custo: a publicação
  passa a carregar o motivo, o que é acréscimo a `RN-NUC-013`.

**Sem resposta:** a primeira, e ela já está afirmada com autoridade dentro de `SPR-27`, num comentário de
2026-08-26 que ninguém retratou (conferência §4.5). Quem chegar depois lê a fronteira que encontrar
primeiro.

Referências: `docs/produto/catalogo-de-modulos.md` (entrada `EST`) · `docs/produto/roadmap-de-modulos.md:184`

## 10. `G-08` — busca de catálogo · 2026-11-27 · 1 card

**Pergunta.** Buscar item por texto é operação classificada do núcleo — e, com o link caído, ela lê o quê?

**Trava.** `SPR-17` (11-27).

**Saídas.**
- Leitura local sobre o artefato publicado retido. Custo: exige dizer o que é buscável (código, nome, o que
  mais?), e mecanismo de catálogo quente passa pelo gate de desempenho antes de virar aceite.
- Operação de servidor. Custo: a busca some quando o link cai, no único caminho que não aceita regressão.
- Deixar sem classificar. Custo: operação não classificada é recusada por default (`RN-OFF-008`), então
  `SPR-17` entregaria uma busca que a própria regra recusa.

**Sem resposta:** quem pegar `SPR-17` escolhe a fonte, e a mais fácil de escrever é o servidor.

Nota de honestidade: `RN-OFF-008` continua citado pelo que outros arquivos aprovados dizem dele, e não foi
conferido na fonte — nesta passada nem nas duas anteriores (conferência §6).

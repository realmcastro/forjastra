# Superfície por papel — a superfície de cada papel, momento por momento

> **Irmão de `superficie-por-papel.md`, com o mesmo peso normativo.** Partido no eixo **contrato de
> derivação × a superfície papel por papel**. Lá estão o cabeçalho normativo, `RN-NUC-034` a
> `RN-NUC-036`, o mapa dos momentos (**M1** a **M10**), o que `backend` obtém daqui, o inventário das
> decisões sem informação que as sustente e as lacunas dos dois. Aqui, a superfície dos cinco papéis de
> `RN-NUC-019`.
>
> **Vale aqui tudo o que o cabeçalho do irmão declara**, e quatro coisas em particular: a **matriz
> vence** e nenhuma célula foi alterada; nenhuma das **43 células `?`** virou permissão; **origem de
> informação** é (i) objeto da própria operação — **(i.a)** criado ou portado pelo próprio ator, **(i.b)**
> **leitura derivada** de objeto de outra pessoa, limitada aos campos que a `RN` dona enumera —, (ii)
> artefato publicado retido, (iii) linha de leitura da matriz (`RN-NUC-035`, estreitada em 2026-08-23 por
> `AUT-05`) — e toda linha abaixo carrega a marca; e **nada aqui é tela** (sem nome de tela, layout,
> navegação, menu, bloco, componente, gráfico ou ícone).
>
> **Onde a marca era (i) e o objeto é de outra pessoa, ela passou a ser (i.b), com o campo enumerado na
> `RN` dona** — são dois casos, e os dois estão nas §2.2 e §2.3: fechar a sessão de outro operador
> (`RN-NUC-030`, seis campos) e transferir fila (`RN-OFF-016`, o inventário, nunca o conteúdo). Nenhuma
> das duas perdeu suporte de informação; o que saiu foi o que a decisão não exigia. **Marca `(i)` sem
> letra, nas tabelas abaixo, é `(i.a)`** — objeto do próprio ator; onde é (i.b), está escrito.
>
> **Linha `n`** = linha da matriz do núcleo (`matriz-operacao-papel.md` §4). **Irmão da matriz** =
> `matriz-operacao-papel-modulos.md`. Valores de célula: `P` permitido · `R` com registro ·
> `A:<papel>` com autorização de outro · `N` negado por decisão · `?` negado porque ninguém decidiu.

---

## 1. `cashier` — o balcão

Papel-piso (`RN-NUC-017` b): existe para alguém operar a venda **sem** alcançar o que está acima.
Superfície fina por decisão, não por esquecimento — e é o papel que sobrevive melhor sem contato, porque
quase toda informação dele é de origem (i) ou (ii).

### 1.1 M1 — abrir a sessão

| Inicia | Decisão | Informação que a decisão exige | Origem |
|---|---|---|---|
| Abrir sessão para si — linha 10 (`R`) | assumir este posto com este fundo | qual posto; o fundo que ele contou; se já existe sessão aberta naquele posto, e **desde quando** (`RN-NUC-009`, infeliz a) | (i) + (iii) 27 |

**Não inicia:** abrir sessão em nome de outro operador — linha 11, `N` **por decisão** para ele.
**Sem contato:** integral em D1/D2/D3 (`RN-NUC-009`). Em **D2** o terminal não sabe se há sessão aberta em
outro terminal do mesmo posto: a recusa é de classe 2 e apresenta **o que ele conhece e desde quando** —
nunca "erro".

### 1.2 M2 — vender

| Inicia | Decisão | Informação que a decisão exige | Origem |
|---|---|---|---|
| Abrir/alterar/descartar pedido — 1 (`P`) | montar este pedido neste terminal | o pedido em construção; que ele é **local** ao terminal (`RN-NUC-001`) | (i) |
| Lançar item — 2 (`P`) | este item, esta quantidade, esta unidade | item e preço no artefato retido, com vigência que cobre o instante; **por que** um item não pode ser lançado (`RN-NUC-002`, infeliz) | (ii) |
| Compor o valor — 6 (`R`) | desconto ou acréscimo **dentro** do limite | o limite publicado do próprio papel; o valor devido resultante | (ii) + (i) |
| Concluir a venda — 3 (`P`) | fechar este fato | o valor devido; o meio de pagamento; a referência humana da venda | (i) |
| Pagamento em espécie — 4 (`P`) | receber e dar troco | valor recebido, troco, sessão aberta | (i) |
| Pagamento que exige terceiro — 5 (`P`) | tentar, e saber o desfecho | **o resultado da autorização, presente** (`RN-NUC-005`) — nunca "provavelmente" | (i) |
| Abrir gaveta como consequência — 15 (`P`) | — não é decisão, é efeito | nada além da venda (`RN-NUC-012` a) | (i) |
| Apresentar de novo a via — 17 (`R`) | reentregar **esta** via | a venda ou documento **desta** venda, e quantas vezes já foi apresentada (`RN-NUC-032`) | (iii) 17 |
| Ver estado e pendências — 27 (`P`) | o que posso prometer agora | offline ou não, **há quanto tempo**, quantas pendências (`RN-OFF-018`) | (iii) 27 |

**Não inicia, e é o que define o piso:** cancelar, devolver, estornar (9 — só com `A:manager`) · desconto
acima do limite (7 — só com `A:manager`) · sangria e suprimento (14, `N`) · gaveta fora de venda (16,
`N`) · qualquer publicação (18–25, `N`) · a superfície da fila (28, `N` **por decisão** — `RN-OFF-011` o
exclui nominalmente) · consultar ou exportar documento em lote (irmão da matriz §7, `N` por decisão).

### 1.3 M3 — pedir exceção (ele pede; não autoriza)

Inicia o **pedido** das linhas 7 e 9, e o consumo da exceção pré-autorizada de teto (32, `R`). A decisão
dele não é conceder: é **escolher o caminho**. Informação exigida: qual autoridade falta e como obtê-la
(`RN-NUC-022`), e o caminho que **não** exige o papel quando ninguém está presente (`RN-OFF-007`,
infeliz). Origem (i) + (ii). Autorizar excesso de outro é a linha 8, `N`.

### 1.4 M4 — fechar a própria sessão

Inicia a linha 12 (`R`). Decisão: declarar o **contado**. Informação: o contado que ele informa; o
**esperado** composto do que o terminal retém, e a **diferença** (`RN-NUC-010`); e o que o terminal **não
consegue afirmar**, nomeado como pendência — nunca estimado, nunca omitido. Origem (i).

### 1.5 Sem contato — o que ele ainda pode prometer

| Pode prometer | Não pode, e o caminho é **reconectar** |
|---|---|
| item ao preço publicado retido · venda concluída em espécie · troco e gaveta · a via do que o terminal retém (`RN-OFF-022`) · a contagem de pendências | pagamento que exige terceiro (5) · desconto acima do limite (7) · cancelamento, devolução, estorno (9) |

**O que ele nunca faz:** resolver conflito técnico. Reconciliação que exige julgamento sai do balcão para
a lista de trabalho (`RN-OFF-018`), e ele é informado **só** quando isso muda o que pode prometer.

**A promessa que hoje não tem resposta:** venda concluída com a faixa esgotada — existe venda e **não**
existe documento (`RN-OFF-006`, infeliz a). O produto não inventa (`RN-NUC-032`, infeliz), e **o que se
entrega ao cliente-final nesse estado é `LACUNA-OFF-009`**, do humano com o contador. É a informação mais
crítica desta seção, e é a que falta.

---

## 2. `manager` — a exceção, o dinheiro fora da venda, e a retaguarda

Por contenção (`RN-NUC-028`) ele alcança **tudo** de §1 sem atribuição de `cashier`, e o registro nomeia
a **atribuição mais estreita**. Escopo **estabelecimento** — alcançar o estabelecimento vizinho é
vazamento **dentro** de um cliente (`RN-NUC-018`).

### 2.1 M3 — autorizar a exceção

| Inicia | Decisão | Informação que a decisão exige | Origem |
|---|---|---|---|
| Autorizar excesso pedido por outro — 8 (`R`) | conceder **este** excesso, agora | qual venda, qual item, quanto se pede, o limite do papel de quem pede, quem pede (`RN-NUC-022`) | (i) + (ii) |
| Autorizar cancelamento, devolução, estorno — 9 (`R`) | desfazer por fato novo | a venda original; o estado da obrigação documental (`RN-NUC-008`) | (i) |
| Desconto acima do **próprio** limite — 7 (`A:owner`+`R`) | pedir acima de si | o próprio limite; que acima dele o autorizador é `owner` | (ii) |
| Destravar o teto offline — 33 (`R`) | destravar, e é decisão **online** | contagem de pendências e o teto (`RN-OFF-014`); que a alternativa é a exceção pré-autorizada (`RN-OFF-025`) | (iii) 27, 28 |

**Falta informação aqui, e é o item mais concreto do inventário:** para decidir se concede **de novo**,
ele precisa saber quantas exceções o mesmo operador já pediu — e isso é leitura de trilha, célula `?`
(`LACUNA-NUC-017`), mais recorte por pessoa, que `RN-REL-008` deixa para o humano.

### 2.2 M4 — dinheiro fora da venda, e a sessão de outro

Inicia: sangria e suprimento (14, `R`) · gaveta fora de venda (16, `R`) · fechar a sessão de **outro**
operador (13, `R`). Decisão e informação: **quanto** sai ou entra e **por quê** — o motivo é obrigatório e
é texto com origem declarada (`RN-NUC-011`, `RN-NUC-016`), origem (i.a); e, ao fechar sessão alheia, os
**seis campos** que `RN-NUC-030` enumera — de quem era a sessão, o posto, o instante de abertura, o
esperado, o contado informado e a diferença —, origem **(i.b)**, com registro, para **aquela** sessão e
nada além dela. **Não inicia:** abrir sessão em nome de outro (11, **`?`** — `LACUNA-NUC-016`, a única
indecisão no caminho crítico do caixa); a superfície não a oferece e **diz o estado** do posto, e o pedido
nomeado devolve *sem suporte de decisão* (`RN-NUC-036`).

**A decisão sem suporte:** fechar sessão com diferença é exatamente onde se pergunta *o que aconteceu
nesta sessão* — gaveta aberta fora de venda, sangrias, exceções autorizadas. Tudo isso está **escrito** na
trilha (`RN-NUC-029`) e **ninguém pode lê-la**: irmão da matriz §7, linha 1, célula `?`. **E o sétimo campo
não entra pela porta da operação:** a leitura derivada de `RN-NUC-030` alcança os seis campos do
fechamento, nunca a trilha do que aconteceu dentro da sessão (`RN-NUC-035` i.b) — era por aqui que o dado
da célula `?` passava renomeado até 2026-08-23 (`AUT-05`).

### 2.3 M5 — retaguarda (a superfície melhor sustentada de todo o conjunto)

| Inicia | Decisão | Informação que a decisão exige | Origem |
|---|---|---|---|
| Ver a fila e a lista de trabalho — 28 (`P`) | o que resolver primeiro | quantos itens, desde quando, de que terminal, **qual o prazo mais próximo** e o efeito de perder cada prazo (`RN-OFF-011`); fila vazia é estado visível, não ausência | (iii) 28 |
| Resolver item da lista de trabalho — 29 (`R`) | resolver **este** item | a origem (terminal, operador, instante do fato), o estado, o efeito declarado e a **presença** do motivo literal; o **conteúdo** do motivo só para quem porta `queue_owner`, com registro, naquele item (`RN-OFF-012`, enumeração de 2026-08-23) | (iii) 28 + **(i.b)** |
| Transferir fila; reinstalar ou descomissionar terminal — 30 (`R`) | mover ou aposentar terminal com fila | o **inventário** do que vai transferido, enumerado em `RN-OFF-016` — quantos itens, de que tipo, de que terminal, desde quando, o prazo mais próximo, o desfecho por item —; que a contagem nunca vai a zero sem desfecho por item | **(i.b)** — nunca o **conteúdo** do item |
| Encerrar faixa pré-alocada não usada — 31 (`R`) | encerrar o não usado | a faixa e o que sobrou (`RN-OFF-006`, infeliz c) | (i) |
| Registrar furto, perda ou destruição de terminal — 34 (`R`) | declarar o evento | último contato, intervalo até o evento, e o que é **perda não quantificável** (`RN-OFF-016`) | (i) |

**O buraco dentro da própria superfície dele:** a lista de trabalho pode conter **texto de terceiro**, que
`RN-OFF-027` (c) proíbe tratar como isento de dado de pessoa — e quem pode ler dado de pessoa fora da
venda é célula `?` (`LACUNA-NUC-018`). Ele é o dono da lista e **pode não estar autorizado a ler parte do
conteúdo dela**. Não liberei: o item aparece, o conteúdo de terceiro fica sem decisão declarada. **E em
2026-08-23 a regra passou a dizer o mesmo que esta linha já dizia** (`AUT-05`): o desconforto registrado
aqui estava certo e `RN-NUC-035` o contradizia, porque a origem (i) entregava o conteúdo por dentro da
operação. A regra foi estreitada; esta linha não mudou. **E em 2026-08-23, por `AUT-12`, o buraco foi fechado onde
ele era real:** o estreitamento de (i.b) tinha sido **inócuo** aqui, porque `RN-OFF-012` já enumerava
"motivo preservado literalmente" e enumeração de campo de texto livre não é enumeração de campo. Agora
`RN-NUC-035` (i.b) exige as três declarações e `RN-OFF-012` as dá: o conteúdo do motivo é do portador de
`queue_owner`, com registro, item a item, e para quem tem só a célula da linha 29 o que existe é a
**presença** do motivo. `LACUNA-NUC-018` (quem lê dado de pessoa fora da venda) **continua aberta** e não
foi contornada: o que se decidiu é o **mais estreito** que resolve o item, não a leitura ampla.

### 2.4 M6 — fechar o dia do estabelecimento

Inicia a linha 35 (`R`). Decisão: fechar, ou não fechar. Informação exigida — e ela é o próprio critério
de `RN-NUC-031`: **qual item bloqueia**, dos seis da lista fechada, e o **caminho mais curto de cada um**;
mais as pendências informativas, declaradas item por item, nunca omitidas. Origem (i) + (iii) 28.

### 2.5 Sem contato

Opera **sem depender de autoridade retida** — ato ordinário, coluna `terminal+ident` (`RN-OFF-032`,
`RN-NUC-027` cláusula 3): 1, 2, 3, 4, 6, 10, 12, 15, 27. **Vencida a validade, nenhuma destas nove
recusa** — corrigido em 2026-08-23 (`AUT-14`), quando 12 e 27 ainda estavam listadas como dependentes de
autoridade retida.
Opera com autoridade retida **válida**: 13, 14, 16, 17, 28, 30, 31, 32, 35 — a 35 só com a lista
de bloqueio vazia, e em **D2** recusa sempre, porque a lista não é computável de um terminal isolado.
Recusa até reconectar: 7, 8, 9, 21, 29, 33. **Vencida a validade, tudo o que é sensível recusa**, e a
superfície diz "até reconectar", nunca "reautentique" (`RN-NUC-036`).

**A assimetria que a superfície tem de mostrar:** ele **vê** a fila sem contato (28, retida) e **não
resolve** item nenhum (29, recusa). Sem essa distinção explícita, o dono da fila olha o prazo de horas
correndo e não entende por que a ação não responde.

---

## 3. `owner` — publicar e atribuir

Escopo **cliente**. Contenção lhe dá o balcão inteiro (§1 e §2) sem atribuição nenhuma; o registro
continua nomeando a atribuição mais estreita.

### 3.1 M7 — publicar (18, 19, 23) e atribuir (20, 21, 22)

| Inicia | Decisão | Informação que a decisão exige | Origem |
|---|---|---|---|
| Publicar **catálogo e preço** — 18 (`R`) | mudar o que o negócio vende e por quanto | a versão vigente e a **vigência** do que ele substitui (`RN-NUC-013`); que o terminal sem contato aplica a versão que retém (`RN-NUC-015`) | (ii) |
| Publicar **limite por papel** — 36 (`R`), a **marca "exige autorização de terceiro"** — 37 (`R`), e a **exceção pré-autorizada** — 39 (`R`) | mexer na **trava** que contém a autoridade | o que a trava hoje impede: que a marca é a precondição pela qual o terminal recusa sozinho (`RN-NUC-005`), que o limite governa o que é **aplicação** e não decisão (`RN-NUC-006`), e que a exceção é o que permite operar acima do teto (`RN-OFF-014`, `RN-OFF-025`) | (ii) |
| Publicar **moeda, fuso e precisão** do estabelecimento — 38 (`R`) | mexer na trava da **aritmética e da fronteira do dia** | o que muda com ela: quanto o cliente-final paga em cada venda, sem aparecer em preço publicado, e a que **dia** o fato pertence — logo o número que fecha o dia (`RN-NUC-031`). **Não delegável** desde 2026-08-23 (`AUT-13`, `RN-NUC-040` b) | (ii) |
| Publicar **o que cada papel autoriza** — 19 (`R`) | mexer no limite ou no alcance de um papel | o que o papel autoriza hoje; que **ampliar** alcança o terminal sem contato na próxima publicação recebida, enquanto **revogar atribuição** depende da reconexão (`RN-NUC-023`) — dois prazos, nunca prometidos como um | (ii) |
| Criar, alterar e revogar **atribuição** — 20 (`R`) | quem porta o quê, e onde | **quem porta o quê hoje** — e é a informação que falta (§3.4) | (iii) **inexistente** |
| Conceder e revogar **delegação** — 21 (`R`) | recortar temporariamente | o que ele mesmo porta; que a unidade é a **linha** e que **cinco linhas não são delegáveis** — 19, 36, 37, 38, 39 (`RN-NUC-040`); que não é re-delegável, que o prazo tem teto próprio e que a delegação **morre em cascata** com a atribuição de origem (`RN-NUC-021`) | (ii) |
| Declarar `queue_owner` e `establishment_responsible` — 22 (`R`) | endereçar a fila e a escalada | que sem `queue_owner` a **habilitação não conclui** (`RN-NUC-020`); e que numa operação de uma pessoa os dois recaem sobre ela, **declarado** e não silencioso | (i) |
| Criar estabelecimento — 23 (`R`) | abrir unidade | — | (i) |

**Não inicia hoje:** habilitar e desabilitar módulo (24, **`?`**, `LACUNA-NUC-023`) · conceder e revogar
`provider_support` (25, **`?`**, `LACUNA-NUC-009`) · nada que seja do `fiscal_officer` (irmão da matriz
§5: `N`, porque a contenção não o alcança) · ampliar o próprio limite (`RN-NUC-023`) — e acima do limite
dele **não há papel acima**: linha 7, `N` **sem caminho** (`LACUNA-NUC-015`).

### 3.2 M6 — fechar o dia

Igual a §2.4 (linha 35, `R`), com escopo cliente: ele alcança o fechamento de **cada** estabelecimento do
próprio cliente, um a um. Consolidado entre estabelecimentos é `REL`, que é módulo — e a superfície do
núcleo não depende dele (`RN-REL-003`, `RN-REL-006`).

### 3.3 Sem contato — ele vende, e nada além disso; a superfície tem de dizer as duas coisas antes

**Reescrita em 2026-08-23** (`AUT-14`). Esta seção dizia "ele não opera" e "toda célula offline do `owner`
é recusa", o que virou falso quando `RN-OFF-032` entrou: **o ato ordinário não depende de autoridade de
pessoa.** O que vale hoje, e são duas metades:

1. **Ele vende.** Quem está sozinho no balcão portando **apenas** `owner`, com o link caído, pratica as
   **nove** linhas de `terminal+ident` (`RN-NUC-027`, cláusula 3): monta pedido, lança item, conclui,
   recebe em espécie, compõe valor até o limite do **papel-piso**, abre e fecha a própria sessão, abre a
   gaveta pelo caminho da venda, vê o estado da conexão. Cada fato registra `owner` como autor.
2. **E nada além disso.** Todo o resto do offline dele é recusa: tudo o que **só** ele faz é online por
   construção, e **contenção não gera autoridade retida** (`RN-NUC-028` d) — sangria, gaveta fora de
   venda, desconto acima do limite do piso, fechar sessão de outro, retaguarda de fila.

A metade 2 não se conserta dando autoridade retida ao `owner` — conserta com **atribuição** de `cashier`
ou `manager` para a mesma pessoa (`RN-NUC-020`), e `RN-NUC-028`, infeliz, é explícito sobre **quando**:
"declarado na habilitação, não descoberto no pico". Requisito de superfície, portanto: **a habilitação
declara as duas metades ao `owner`**, como estado visível — o que ele continua fazendo sem rede e o que
não —, nunca uma recusa que aparece pela primeira vez às 20h14, com fila na frente (`PN-17`). O prazo da
habilitação a vender do terminal (`RN-OFF-032`i, `LACUNA-OFF-017`) entra na mesma declaração, e o aviso
de vencimento **precede** o vencimento.

### 3.4 O que ele precisa ver e a matriz não dá

Revogar uma atribuição exige saber **quais existem**. "Ler a lista de atribuições e delegações vigentes"
**não é linha de nenhuma das duas matrizes** — logo é negada a todos por default (`RN-NUC-026`). Não é uma
das 43 células `?`: é **ausência de operação**, que é pior, porque nem lacuna tinha. Abri
`LACUNA-NUC-029`.

---

## 4. `fiscal_officer` — ortogonal, e a superfície mais pobre em informação

**Não é subconjunto de ninguém e não contém ninguém** (`RN-NUC-028`): `owner` não herda nada dele, e ele
não alcança venda, caixa, catálogo, preço nem papel (linhas 1–25: `N`). Escopo estabelecimento.

### 4.1 M8 — custodiar a capacidade de assinar

| Inicia | Decisão | Informação que a decisão exige | Origem |
|---|---|---|---|
| Conceder, renovar, ampliar e revogar a capacidade de assinar — irmão da matriz §5 (`R`) | dar, ou tirar, o poder de assinar em nome do estabelecimento | **quais capacidades estão vivas, em que terminal, desde quando, com que alcance, até quando** | (iii) **inexistente** |
| Assinar **fora** do fluxo de venda — irmão §5 (`R`) | assinar este ato | o ato a assinar | (i) |
| Declarar comprometimento de ponto de emissão — irmão §5 (`R`) | declarar comprometido | terminal, instante, o que estava retido (`RN-EMI-038`) | (i) |
| Registrar furto, perda ou destruição de terminal — 34 (`R`) | o mesmo evento, pelo lado do terminal | último contato, e o que é perda não quantificável (`RN-OFF-016`) | (i) |

### 4.2 Sem contato

Autoridade retida **parcial** (`papeis-atribuicao-e-delegacao.md` §6): assinar fora do fluxo, declarar
comprometimento e registrar furto operam com validade viva; **conceder e revogar recusam sempre**, porque
revogação precisa de efeito imediato (`RN-EMI-037`). A superfície tem de dizer isso no caso que importa:
terminal furtado durante a queda de link → ele **declara** o comprometimento agora e a **revogação** espera
a reconexão. Duas ações, dois prazos, nunca apresentadas como uma.

### 4.3 A superfície de informação dele é vazia — e é o achado desta seção

Três das quatro coisas que ele precisaria ver não estão disponíveis: o **inventário de capacidades vivas**
não é operação em lugar nenhum (`LACUNA-NUC-030`); a **trilha do ato de assinatura** é `?` (`RN-EMI-035`,
`LACUNA-NUC-017`); a **superfície da fila de pendências fiscais** é `?` (`LACUNA-NUC-028`) — e o prazo do
pendente fiscal é de **horas** (`RN-EMI-028`). Ele tem atos e não tem informação. Não liberei nenhuma das
três.

---

## 5. `provider_support` — a concessão, e a trilha que ninguém pode ler

Uma linha em 76: **operar sob concessão** (26, `R`). Todo o resto é `N`, inclusive as quatro linhas de
leitura (irmão da matriz §7, nota ⁷), pelo default fechado de `RN-NUC-024` (a). **Não opera sem contato**,
nunca.

A superfície dele **não** é derivada da matriz: é derivada da **concessão** — só o cliente, só os
estabelecimentos e só as operações que ela nomeia, com prazo, e o não nomeado é negado. Nunca dado de
pagamento, em nenhuma combinação (`RN-NUC-024` e). Pobreza aqui é a garantia, não a falta: uma superfície
rica para este papel seria o defeito.

**A contradição, e o que ela virou em 2026-08-23.** `RN-NUC-024` (d) **promete ao cliente** que cada ato
praticado sob a concessão é legível **por ele, na superfície dele**. Nenhuma linha das duas matrizes dá a
leitura dessa trilha a papel nenhum: não é `?`, é **ausente**, logo negada a todos (`RN-NUC-026`) —
`LACUNA-NUC-031`. A correção de `AUT-10` não inventou a célula: ela **amarrou a concessão ao leitor** —
`RN-NUC-024` (d) passou a exigir que cada ato registre **qual concessão** o autorizou (`RN-NUC-029`) e que
a leitura dessa trilha seja operação própria do `owner`, e declarou que **sem ela não há concessão**. Logo
a promessa e a autorização deixaram de se contradizer pelo lado certo: enquanto a operação de leitura não
existir com célula, `provider_support` permanece **não instanciável** — o que é o desfecho correto, não um
acidente.

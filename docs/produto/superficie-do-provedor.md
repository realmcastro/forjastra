# Superfície do provedor — o que existe do nosso lado, o que não existe, e o que libera cada coisa

> **O que este arquivo é.** A **superfície de trabalho** dos três papéis de escopo `provedor`: que
> informação ela mostra, de onde cada informação vem, em que forma ela é admissível, e — item por item —
> **o que falta para ela existir**. É a resposta ao pedido de 2026-08-23 ("quais telas vão existir, quais
> estatísticas, quais dados, quais acompanhamentos mensais, semestrais") na única forma que sobrevive às
> decisões abertas: **superfície é derivação, não desenho**.
>
> **O que este arquivo não é.** Não é tela, bloco, componente, gráfico, layout, navegação, menu, ícone
> nem rota — e **não pode ser**: `D-01` e `D-02` estão ABERTAS, a composição da tela nasce do manifesto
> (Fase 3) e escrever a lista de tela agora é escrever o artefato que a Fase 3 descarta
> (`superficie-por-papel.md`, cabeçalho). Nenhuma célula é valorada aqui — a matriz do escopo é
> `matriz-celulas-a-valorar.md` §1, e o valor é do humano. Nenhum número entra: número é lacuna com dono.
>
> **Nada aqui opera hoje, e é desfecho, não pendência.** Três travas independentes, todas falhando
> fechado: `RN-PRV-004` (d) com `D-03` aberta · `RN-PRV-006` (b) com `LACUNA-NUC-031` ausente ·
> `RN-PRV-015` sem matriz valorada. Por isso **cada item desta superfície nomeia a trava que o libera**
> (§5). Descrever o que existirá *quando* a trava cair é o oposto de especificar um console inerte: é o
> que permite valorar a matriz sabendo o que cada célula acende.
>
> **Numeração.** `RN-PRV-018` a `020`; as `LACUNA-PRV-011` a `013` nascem aqui (§6). A sequência
> `LACUNA-PRV-` é **uma só** entre os três conjuntos (`operacao-do-provedor-alcance.md` §4,
> `fatos-de-operacao.md` §7 e este) — numerar por arquivo seria a colisão nascendo sem má-fé.
>
> **Formato:** `Enunciado` · `Motivo` · `Aceite` · `Infeliz`. Escopo de **toda** regra: `provedor`.

---

## 1. O contrato de derivação, aplicado ao nosso escopo

### RN-PRV-018 — A superfície nossa é derivada da matriz do escopo `provedor` e adota o contrato de `RN-NUC-034` a `036`, com três adaptações declaradas

**Enunciado** (a) A superfície de um papel nosso é **derivada** das células da matriz do escopo
`provedor`: superfície que oferece operação sem célula é defeito, e a composição por papel é
**experiência e banda, nunca a autorização** (`RN-NUC-034`) — a verificação acontece na operação, sempre.
(b) Toda informação que ela mostra tem **origem declarada**, nas mesmas espécies de `RN-NUC-035`, com
**duas adaptações**: a origem **(ii)** — artefato publicado que o terminal retém — **não se aplica** ao
nosso lado, porque nenhum papel nosso opera terminal de cliente nem porta autoridade retida (explícito
para `provider_support` em `RN-NUC-024`; para os dois papéis novos, por **default fechado** — nenhuma
regra a concede, e `RN-PRV-015` nega o não concedido); e a origem **(iii)** aponta para a célula da
**nossa** matriz, não para as de cliente.
Informação de origem (iii) sem célula **não entra**, e a ausência é lacuna nomeada, nunca licença.
(c) As **três negações** de `RN-NUC-036` valem inteiras — negado ao meu papel · recusado por falta de
contato · sem suporte de decisão —, e a nossa quarta situação não é uma quarta negação: leitura cujo
**cliente-alvo não foi resolvido** é a recusa de `RN-PRV-004` (b), e ela produz fato (`RN-PRV-011` f).
(d) **Nenhuma superfície nossa tem cliente-alvo implícito** (`RN-PRV-004` b): o alvo é visível a quem
opera, nomeado no registro do ato, e **um** por escopo de trabalho.
(e) A superfície nossa **não enumera** o que o papel não alcança, e não enumera **clientes** para
escolher: escolher cliente numa lista é resolver o alvo pelo que o pedido informa, que é exatamente o
que (d) proíbe.

**Motivo** escrever um contrato de derivação novo para o nosso escopo seria escrever a segunda versão de
uma regra que já existe, e duas versões divergem — a que a implementação lê é a que está mais perto da
tela. Adotar `RN-NUC-034` a `036` custa três frases de adaptação e faz toda correção futura naquele
conjunto alcançar o nosso lado sem passada própria. A cláusula (e) é a que não é herança: do lado do
cliente, "não enumerar" protege o catálogo de operações; do nosso, protege a **carteira** — uma lista de
clientes para escolher é, ao mesmo tempo, o caminho de errar o alvo e o inventário comercial exposto a
quem só precisava consertar um ambiente.

**Aceite** três, conferíveis por leitura. **(1)** para cada item da §2 há a marca de origem, e toda (iii)
cita a linha candidata da matriz — hoje **nenhuma** cita valor, porque nenhuma célula existe, e é isso
que faz a superfície inteira estar declarada como inerte. **(2)** buscar nesta superfície qualquer
informação cuja origem seja (ii) → **zero**. **(3)** papel nosso pede uma operação que ninguém enumerou
→ recebe *sem suporte de decisão*, citando a ausência de célula na matriz do `provedor`
(`RN-PRV-015`), e a recusa não revela que cliente existe nem que operação existe.

**Infeliz** a superfície precisa de uma informação de origem (iii) cuja célula é ausente → ela **não a
exibe**, e a decisão fica **declarada como sem suporte**, com a lacuna nomeada. Hoje isso vale para
**todos** os itens da §2 — a superfície nossa é integralmente "sem suporte de decisão", e é o que as três
travas dizem. Presumir a célula "porque o console precisa funcionar" é o modo pelo qual `RN-PRV-015`
cairia sem sintoma (`operacao-do-provedor-autorizacao.md` §1, motivo).

---

## 2. A superfície invariante — a administração de metadado

### RN-PRV-019 — A superfície nossa que existe sob qualquer resposta é a administração de metadado, e cada item declara a forma admissível e a forma recusada

**Enunciado** existe um conjunto de itens que é legítimo sob **qualquer** resposta às decisões abertas,
porque nenhum deles lê fato de negócio do cliente: é a **administração de metadado do ambiente** que nós
operamos. Cada item da tabela declara, e sem os cinco campos ele não é item: o **objeto**, a **unidade**,
a **decisão nossa** que ele informa, a **origem** (`RN-PRV-018` b) e a **forma admissível com a forma
recusada ao lado**. Item novo entra por alteração desta regra. A forma recusada não é ornamento do texto:
é o que impede o item de virar, por refinamento, a leitura que ele não é (`RN-PRV-009`, motivo).

| # | Objeto | Unidade | Decisão **nossa** | Origem | Forma admissível → **forma recusada** |
|---|---|---|---|---|---|
| 1 | Módulos ativos de um cliente, e o histórico deles | contratação (nossa) | cobrar o que foi contratado; saber o que estava ligado quando algo aconteceu (`RN-PRV-007`, `RN-PRV-013`) | (iii) R2 | fato datado append-only + estado **derivado** dele → **campo de estado sobrescrito**, que destrói a prova de por que a fatura foi aquela |
| 2 | Usuários, papéis e atribuições de **um** cliente | pessoa e atribuição (do cliente) | consertar acesso quando o cliente relata; e qual edição repetimos tanto que é **capacidade faltando** na superfície dele (`provider_user_edit`) | (iii) R3 | identificador e atribuição vigente do **cliente-alvo resolvido**, um cliente por escopo de trabalho (`RN-PRV-004` c) → **dado de contato ou documento sem uso justificado** (minimização, `operacao-do-provedor-alcance.md` §2.2) e **qualquer listagem de pessoas que atravesse clientes** |
| 3 | Versão de migration aplicada, **por schema** | nossa (schema, versão) | é seguro avançar o release; qual cliente está atrás e desde quando (`RN-PRV-013`) | (iii) R1 | uma linha por **(schema, versão)** com desfecho e duração, **falha inclusa como linha** → **"estado atual" sem histórico**, que é o drift invisível de `.claude/rules/migrations.md` §9 |
| 4 | Estado **corrente** de sincronização de um terminal | nossa (pendência, contato) | responder ao cliente que relata "não está subindo", sem entrar no ambiente dele (`PN-15`) | (iii) R1 | **espelho** do que o operador dele vê no terminal agora → **série retida por estabelecimento**, que recupera a transição aberto/fechado e a ordenação dos dias |
| 5 | Terminais habilitados a vender, e o estado de cada um | nosso (parque, validade) | renovação que não acontece é **caixa que vai parar**; comprometimento exige revogar (`RN-PRV-013`) | (iii) R1 | inventário por cliente com validade vigente e estado (habilitado · vencido · comprometido) → **inferir operação a partir do parque**, que é volume de negócio com outro nome |
| 6 | **Uso de módulo na janela declarada** | binária (existe / não existe) | oferecer treino, retirar o módulo, parar de cobrar | (iii) R4 | **existência** de fato de operação daquele módulo na janela — binário —, cruzada com a recusa `module_inactive` para distinguir *não usa* de *nunca foi ligado* → **contagem, série, curva, ranking de adoção ou ordenação de clientes**, em qualquer resolução |
| 7 | O agregado sobre **todos** os clientes, em unidade nossa | nossa (requisição, erro, latência, saturação) | dimensionar e custear a **nossa** infraestrutura | (iii) R6 | grandeza medida na **nossa borda**, `O(1)` em schemas, **sem tocar schema de cliente** → **agregado que não passou pela condição de concentração** de `RN-PRV-017` (d), e **decomposição por cliente** em qualquer resolução |

**Enunciado, cláusula do item 6 — a forma é parte da regra, não da implementação** (fecha o achado
`PRV-16` da auditoria de fecho). "Módulo contratado e nunca usado" nasce como contagem se ninguém
escrever a forma, e contagem por módulo por cliente por mês **é** a curva de volume do módulo naquele
cliente. A forma admissível é **existência de fato de operação na janela, binária** — e ela responde as
três decisões nossas declaradas por inteiro, o que é a prova de que o grão fino não era necessário
(`F4`: o grão é o mais grosso que ainda sustenta a decisão). O **valor** da janela é `LACUNA-PRV-013`, e
sem ele o item não é operável: janela ausente é janela infinita, e janela infinita transforma o binário
em "algum dia foi usado", que não decide nada.

**Enunciado, cláusula do item 7 — a dependência é declarada, não pressuposta.** O agregado sobre todos
os clientes é a única forma de responder "quantas operações estão acontecendo" sem fan-out e sem cache
(auditoria de custo, 2026-08-23), **e** ele está sujeito à condição de **concentração** de `RN-PRV-017`
(d): com um cliente dominante, o pico do agregado é a curva dele. Como a **contribuição máxima** é
grandeza **sem valor** (`LACUNA-PRV-010`), o desfecho hoje é: **nenhum agregado nosso é apresentável**.
Isso é o que a regra diz, não um defeito de leitura dela.

**Motivo** este conjunto é substancial e não é consolo: é exatamente o canal que `PN-15` já legitima —
observação de operação, não leitura de dado de negócio —, e é o que responde as perguntas do humano que
têm resposta boa. A escolha de escrever **a forma recusada ao lado da admissível**, em vez de só a
admissível, tem uma razão medida em ocorrências: o risco desta família nunca foi má-fé, foi **grão**.
Cada refinamento parece razoável, e ao fim a "administração de metadado" responde quanto o cliente
vendeu. Uma tabela que diz só o que pode ser feito não freia refinamento nenhum; uma que nomeia a forma
recusada é conferível por busca no dia em que alguém escrever a consulta.

**Aceite** cinco, e os quatro últimos são concretos. **(1)** cada item tem os cinco campos, e item sem
forma recusada não entra. **(2)** pedir o item 6 como contagem por mês → **negado**, citando a cláusula
da forma, não a prosa. **(3)** pedir o item 4 como série dos últimos 30 dias por estabelecimento →
**negado**, e o item continua existindo como espelho. **(4)** com um cliente dominante sintético, pedir
o item 7 → **não apresentado**, e a recusa não nomeia o dominante (`RN-PRV-017` d, iii). **(5)** teste
negativo, conferível por busca: item desta tabela cuja unidade seja dinheiro, venda, item, pedido, meio
de pagamento, documento fiscal ou cliente-final → **zero**.

**Infeliz** o item é útil e a forma admissível não responde a decisão. Então **a decisão não é nossa, ou
o item não é de metadado**: o veículo passa a ser `RN-PRV-010` (leitura de dado de negócio, por
ocorrência, com motivo enumerado e trilha) ou o item é do **cliente** e o veículo é `REL`. Nunca se
alarga a forma para o item caber: alargar a forma é a única coisa desta superfície que não tem sintoma.

---

## 3. O que **não** entra, e o motivo de cada um

### RN-PRV-020 — Leitura de dado de negócio não sustenta observação corrente; o que falta para ela sustentar é declarado, e a janela publicada exige retenção

**Enunciado** (a) **Artefato de observação corrente** — série que se atualiza sem alguém pedir cada
leitura — **não** é sustentável por `RN-PRV-010`: aquele canal é leitura **por ocorrência**, com motivo
enumerado e trilha, e "nunca sustenta painel, série corrente nem leitura recorrente sem motivo"
(`RN-PRV-009` d). Portanto o faturamento e a curva de vendas que a decisão de 2026-08-23 concedeu ao
`provider_administrator` **têm canal** e **não têm artefato corrente**: hoje ele lê **por ocorrência**,
e cada leitura é fato (`RN-PRV-011`).
(b) Para o artefato corrente ser lícito faltam **quatro** coisas, e nenhuma é minha: **(b.1)** ato datado
de `RN-PRV-010` (d) ampliando a cláusula de contrato para admitir leitura **recorrente**, com custo
escrito — ampliar alcance é alterar contrato; **(b.2)** a **célula** da linha candidata R5 na matriz do
escopo; **(b.3)** retenção com valor, por `RN-NUC-049` — janela declarada exige retenção ≥ janela, e
`LACUNA-NUC-040`/`LACUNA-REL-001` estão abertas; **(b.4)** a **unidade da leitura** quando o alcance é
corrente (`LACUNA-PRV-011`).
(c) **A quarta é a que não é pendência de ninguém e ainda não estava escrita.** Por `RN-PRV-011`, toda
leitura nossa é fato de igual peso ao ato. Um artefato corrente produz **uma leitura por atualização**,
e só há dois desfechos: ou cada atualização é fato — e então a trilha que o `owner` lê fica ilegível por
volume, e a decisão que `provider_read` informa ("quanto acesso ao dado do cliente a nossa operação
realmente exige") passa a medir recarga de tela em vez de acesso — ou o artefato é **isento** da trilha,
e a isenção é a revogação silenciosa de `RN-PRV-006`. Não existe terceira saída sem alguém decidir a
unidade. A **propriedade** que a unidade tem de satisfazer é escrevível e está escrita: a contagem
continua significando *quanto acesso a nossa operação exige*, e o cliente continua distinguindo **uma
ocasião** de leitura nossa de outra. Qual unidade satisfaz as duas é `LACUNA-PRV-011`; o mecanismo é de
`backend`.
(d) **Acompanhamento por período — mensal, semestral e qualquer janela declarada — é especificável hoje
e não publicável** até a retenção da classe lida existir com valor (`RN-NUC-049`). Vale para o nosso lado
tanto quanto para o do cliente, e pela mesma razão: série truncada por retenção chega ao leitor com a
cara de "vendeu menos", e **nada** obriga a declarar o truncamento se a janela nasceu antes da retenção.
(e) **Pico por estabelecimento não tem forma nossa admissível**, e a resposta honesta é dizê-lo: o pico
**é** a forma, e forma sobrevive a normalização, a razão e a índice. Existem **três** destinos legítimos
e não existe quarto: pico **agregado sobre todos os clientes** (item 7 da §2, sujeito à concentração) ·
pico **por estabelecimento entregue ao cliente**, e o veículo é `REL`, que é dele · pico por
estabelecimento **lido por nós**, que é dado de negócio, canal de `RN-PRV-010`, por ocorrência e com
trilha. **Nenhum dos três é artefato corrente nosso por estabelecimento**, e o que não existe é ele ser
observação de operação quando é por estabelecimento.
(f) **Métrica de infraestrutura por estabelecimento é proxy de atividade por construção** — zero
requisição às 15h é "fechado às 15h". Grão fino por estabelecimento é **transitório**: existe para o
incidente, cujo veículo é a concessão (`RN-NUC-024`), e **não é retido como série**.

**Motivo** as duas metades desta regra são a mesma defesa vista de dois lados. A cláusula (a) evita o
desfecho em que a decisão do humano é cumprida **pela metade errada**: o alcance foi concedido, então
alguém constrói o artefato mais útil, e o artefato mais útil é o corrente — que é justamente o que a
cláusula do contrato não cobre e o que a trilha não suporta. A cláusula (d) evita o oposto: publicar a
janela primeiro e descobrir a retenção depois, quando o dado do início da janela já não existe e o
número exibido é uma queda que nunca houve. As duas falham do mesmo jeito se ninguém escrever: **por
utilidade**, sem que nenhuma regra seja violada no caminho.

**Aceite** seis, todos conferíveis. **(1)** pedir artefato de observação corrente de faturamento a
partir de linha marcada `RN-PRV-010` → **negado**, citando `RN-PRV-009` (d). **(2)** pedir a **mesma**
informação por ocorrência, com motivo enumerado → o caminho existe, e produz fato de leitura
(`RN-PRV-011`) — o que muda entre (1) e (2) é a forma, não a autorização. **(3)** publicar leitura com
janela de seis meses hoje → **negado** por `RN-NUC-049`, e a especificação dela permanece escrita e
válida. **(4)** pedir pico por estabelecimento como observação de operação → **negado**, com os três
destinos nomeados na recusa. **(5)** buscar artefato nosso de observação corrente cuja unidade seja de
negócio → **zero**. **(6)** buscar, na trilha, leitura nossa cuja unidade seja "atualização de artefato"
→ **zero** enquanto `LACUNA-PRV-011` estiver aberta.

**Infeliz** o artefato corrente é **o que o humano pediu com mais ênfase** ("informação bruta na frente
dele"), e recusá-lo pela forma parece recusar a decisão dele. **Necessidade preservada, e ela não se
recusa:** ver o negócio do cliente para suportar, faturar, diagnosticar e sugerir melhoria — decidida
em 2026-08-23, e nada aqui a revoga. **Mecanismo recusado:** o artefato corrente **antes** das quatro
coisas de (b), porque ele consome a cláusula que não o cobre e apaga a trilha que o cliente recebeu como
promessa. **Mecanismo nosso, hoje:** leitura por ocorrência, com motivo enumerado, registrada, com o
cliente-alvo resolvido e visível — a mesma informação, o mesmo alcance, ocasião por ocasião. **Por que é
melhor, e como se prova:** ele entrega a informação **sem** consumir nenhuma das quatro decisões que
ainda são do humano, e prova-se pedindo a mesma pergunta pelos dois caminhos e verificando que a resposta
é a mesma — o que difere é que um deixa rastro por ocasião e o outro precisa de um ato datado para
existir. **E o caminho de sair da inércia está escrito, não é "depois":** são as quatro de (b), três
delas já na pauta do humano.

---

## 4. Os três papéis, um a um

Cada bloco diz: o alcance (`RN-PRV-004`), a superfície que decorre dele, e **o que dela existe hoje**.

**`provider_operator` (o "suporte" do humano) — muta amplo, lê estreito.** Superfície: os itens 1 a 5 da
§2 em **leitura**, e os atos que a matriz enumerar — editar usuário do cliente, ativar e desativar
módulo, provisionar. Todo ato exibe o **efeito de cobrança antes de ser praticado** quando ele altera o
que o cliente paga (`RN-PRV-007`), e nenhum se consuma sem a confirmação que `LACUNA-PRV-003` ainda não
nomeou. Não alcança faturamento, venda nem dado de pagamento — logo os itens 6 e 7 lhe são **candidatos
de leitura**, não decorrência do papel: o binário de uso de módulo informa decisão comercial nossa, e o
eixo dele é mutação, não leitura ampla. **Hoje:** nada. As três travas.

**`provider_administrator` — lê amplo, não muta no ambiente do cliente.** Superfície: os itens 1 a 7 da
§2 em leitura, mais a leitura de dado de negócio **por ocorrência** (`RN-PRV-010`), mais conceder e
revogar concessão de `provider_support` (`RN-PRV-005`), mais — quando a regra de confirmação existir — o
lado que confirma o ato que altera cobrança. **Não** tem artefato de observação corrente do negócio do
cliente (`RN-PRV-020`). **Não** lê a trilha do próprio alcance: quem audita não porta o alcance auditado
(`RN-PRV-005` b), e o leitor da nossa trilha não existe em papel nenhum — é a pergunta aberta `PRV-09`.
**Hoje:** nada, pelas mesmas três travas.

**`provider_support` — o papel do provedor dentro do cliente.** Superfície: **nenhuma neste arquivo**.
Ele opera por concessão declarada, com escopo mínimo, prazo, motivo e trilha (`RN-NUC-024`), e é
**recusa em toda linha** das matrizes de cliente exceto a 26 — que é a própria operação de operar sob
concessão. A coluna dele nas três matrizes existe para a **não-instanciabilidade ser conferível**
(`RN-PRV-003`), e não-instanciável é o desfecho correto enquanto `LACUNA-NUC-031` estiver aberta.
**Hoje:** nada, e por uma trava só — a célula.

---

## 5. O que cada trava libera — a resposta a "quais telas vão existir"

A tabela é o entregável desta seção: ela diz, para cada coisa que falta, **quem responde** e **o que
aparece na superfície quando ela cair**. Nada aqui é prazo nem prioridade.

| O que falta | Quem responde | O que passa a existir na superfície |
|---|---|---|
| `D-03` (`RN-PRV-004` d) | humano | qualquer ato ou leitura nossa **acontecer**: hoje o ato que nomeia cliente não acontece |
| célula de `LACUNA-NUC-031` (`RN-PRV-006` b) | humano | os três papéis passam a ser **atribuíveis** a uma pessoa; e o `owner` passa a **ler** os nossos atos e leituras no ambiente dele |
| a matriz do escopo valorada (`RN-PRV-015`) | humano | cada item da §2 e cada ato da §4, um por célula — é a valoração que acende a superfície item por item |
| as três frases de `matriz-operacao-papel*.md` (`RN-NUC-026`/`039`, quarta fonte de `RN-NUC-029`) | humano | o **registro** do ato nosso passa a ter valor possível; sem elas, registro impossível impede o ato (`RN-PRV-016`) |
| `LACUNA-PRV-003` — quem confirma mudança de módulo | humano | ativar e desativar módulo passa a se **consumar** (`RN-PRV-007`) |
| `LACUNA-PRV-013` — janela do binário de uso | humano | o item 6 da §2 passa a ser **operável**; sem valor, ele responde "algum dia foi usado" |
| `LACUNA-NUC-040` + `LACUNA-REL-001` (`RN-NUC-049`) | humano, com `arquiteto-dados` e `performance` | acompanhamento com **janela declarada** — mensal, semestral — passa a ser **publicável** |
| `LACUNA-PRV-010` — contribuição máxima e `N` mínimo | humano, com `arquiteto-dados` | o item 7 da §2 passa a ser **apresentável** |
| `RN-PRV-010` (d) ato datado + `LACUNA-PRV-011` | humano, com `seguranca` | **artefato de observação corrente** do negócio do cliente passa a ser possível — e só com as quatro de `RN-PRV-020` (b) |
| `LACUNA-PRV-007` — responsabilidade por número nosso errado | humano | **sugestão** nossa deixa de ser provisória (`RN-PRV-021`) |
| a resposta do advogado (`RN-PRV-008`, inerte) | humano, com advogado | interação nossa com **cliente-final** do cliente passa a existir |
| `PRV-09` — leitor da nossa própria trilha | humano | auditar o **nosso** alcance passa a ter dono; hoje nenhum dos três papéis serve (`RN-PRV-005` b) |

**Leitura da tabela, e é o ponto dela:** onze das doze linhas são **frase, célula ou número** — nenhuma
é construção. O console não está esperando engenharia; está esperando valoração. É por isso que a matriz
de `matriz-celulas-a-valorar.md` e as linhas de `REL` foram entregues na **mesma** passada.

---

## 6. Lacunas nascidas aqui

Abertas em 2026-08-23. Nenhuma bloqueia as três regras: as três foram escritas para sobreviver às duas
respostas. A sequência `LACUNA-PRV-` é única entre os três conjuntos (cabeçalho).

- **`LACUNA-PRV-011`** — **qual é a unidade de uma leitura nossa quando o alcance é corrente** e não por
  ocorrência (`RN-PRV-020` c). A propriedade exigida está escrita — a contagem continua significando
  quanto acesso a nossa operação exige, e o cliente continua distinguindo uma ocasião de outra —; qual
  unidade a satisfaz, não. **Dono:** humano, com `seguranca`; o mecanismo é de `backend`. Sem ela, o
  artefato corrente não existe, e é o desfecho, não a pendência.
- **`LACUNA-PRV-012`** — **"plano" é objeto próprio ou é o conjunto de módulos ativos?** O pedido do
  humano nomeia plano ao lado de módulos, e hoje a base de cobrança declarada é a **lista de módulos
  ativos** (`RN-PRV-007`). Se plano existe como objeto — pacote, faixa de preço, compromisso de prazo —,
  ele é um segundo registro comercial e o item 1 da §2 ganha uma coluna que hoje não tem dono. É decisão
  **comercial**, não de produto. **Dono:** humano.
- **`LACUNA-PRV-013`** — **a janela do binário de uso de módulo** (`RN-PRV-019`, item 6). É número.
  **Dono:** humano — é a tolerância comercial de "não está usando", e ela difere para treino, para
  retirada e para cobrança; se as três diferirem, são três janelas e não uma, e isso também é dele.

---

## 7. O que este arquivo deliberadamente não faz

- **Não desenha nada.** Nenhum nome de tela, bloco, gráfico, ordem, agrupamento, densidade ou espaço.
  Qual **espaço** o nosso console habita é pergunta para `ui`: os espaços declarados em `docs/design/`
  são de operação de cliente, e o nosso não é nenhum deles.
- **Não valora célula, não escreve número, não decide `D-01` a `D-06`**, e não afirma base legal.
- **Não altera nenhuma negativa vigente.** As quatro de `operacao-do-provedor-alcance.md` §2.1 seguem de
  pé, e este arquivo é o primeiro lugar em que a **forma** delas aparece como superfície.
- **Não enumera os fatos** que sustentam cada item — eles estão em `fatos-de-operacao-provedor.md` e em
  `fatos-de-operacao.md`, e o grão é do `arquiteto-dados`.

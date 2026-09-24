# Superfície por papel — o contrato de derivação, os momentos, e o que falta decidir

> **O que este arquivo é.** As regras que governam a **superfície de trabalho** de um papel: como ela é
> derivada das duas matrizes, de onde vem cada informação que ela mostra, e como ela se comporta sem
> contato. Mais o mapa dos **momentos de trabalho**, o que `backend` precisa daqui para compor
> manifesto, e o inventário das decisões que **não têm informação que as sustente**.
>
> **Dois arquivos, um conjunto normativo.** Partido no eixo **contrato de derivação × a superfície papel
> por papel**. Aqui: `RN-NUC-034` a `RN-NUC-036`, os momentos, a entrada para o manifesto, o inventário e
> as lacunas dos dois. Em **`superficie-por-papel-momentos.md`**: a superfície de cada um dos cinco
> papéis, momento por momento, com o que ele inicia, o que ele precisa ver e o que muda offline.
> Numeração contínua e imutável entre os dois; toda regra é heading `### RN-NUC-nnn`, pelo contrato de
> busca de `nucleo-venda.md`.
>
> **A matriz vence.** A superfície é **derivada** de `matriz-operacao-papel.md` e
> `matriz-operacao-papel-modulos.md`, célula por célula. Onde eu quis dar a um papel algo que a célula
> nega, a célula fica e a divergência vai para §5. Nenhuma célula foi alterada por este trabalho, e
> nenhuma das **43 células `?`** foi lida como permissão. **A precedência passou a ser escrita em
> 2026-08-23** (`RN-NUC-039`, em `matriz-operacao-papel-contrato.md`): onde a célula e o texto de qualquer
> `RN` discordarem sobre quem pode praticar uma operação, **vence a célula**.
>
> **Isto é entrada para a geração de manifesto, e não é tela.** §4 diz exatamente o que `backend` obtém
> daqui. **Não** há nos dois arquivos nome de tela, layout, navegação, menu, bloco, componente, gráfico
> nem ícone — e não pode haver: a lista de tela nasce do manifesto (Fase 3), composto de módulos ativos
> + configuração do cliente + papel, e escrevê-la agora seria escrever o artefato que a Fase 3 descarta.
>
> **Duas consequências da matriz que a superfície tem de refletir, ou a spec promete o que a autoridade
> nega.** (1) **O `owner` sozinho pratica o ato ordinário sem contato e nada além dele** — as nove linhas
> com `terminal+ident` na coluna `Offline` (`RN-NUC-027`, cláusula 3) não dependem de autoridade de
> pessoa; o resto é recusa, porque contenção não gera autoridade retida (`RN-NUC-028` d); irmão §3.3.
> **Corrigido em 2026-08-23** (`AUT-14`): esta linha dizia "o `owner` sozinho não opera sem contato", que
> era verdade antes de `RN-OFF-032`. (2) **`fiscal_officer` é
> ortogonal** — nem o `owner` o contém (`RN-NUC-028`), logo a superfície dele **não é subconjunto de
> ninguém**; irmão §4.
>
> **Numeração.** As matrizes consumiram até `RN-NUC-033`; este conjunto consome **`034` a `036`** e abre
> **`LACUNA-NUC-029` a `033`** (§6). Depois dele nasceram `037` (`nucleo-caixa-e-turno.md`) e `039`/`040`
> (`matriz-operacao-papel-contrato.md`), e `038` em `nucleo-venda.md`. Nada foi renumerado.
>
> **Fronteira de D-03, ABERTA.** Declarar *o que um papel inicia* e *que informação a decisão dele exige*
> é daqui. **Como** se prova identidade, forma de sessão, reautenticação e SSO não são, e nenhuma linha
> depende de saber. **Nenhum número:** prazo, validade e antecedência são lacuna com dono.

---

## 1. Contrato de derivação — três regras, e sem elas o resto é opinião

### RN-NUC-034 — Superfície é derivada da matriz, e filtrar o manifesto por papel nunca é autorizar

**Enunciado** a superfície de um papel é **derivada** das células que a matriz lhe dá: superfície que
oferece operação negada ao papel é defeito de produto, e superfície que **omite** operação permitida é
defeito igual. E a cláusula que importa mais: o manifesto composto por papel é **experiência e banda**,
nunca a autorização. As duas coexistem sempre — manifesto composto por papel **e** verificação no
backend em toda operação (`PN-11`, `RN-NUC-022`). Tratar "o manifesto não trouxe" como autorização
reconstrói o botão escondido de `PN-11` em escala de arquitetura, e o pedido forjado passa.
**Motivo** é o único ponto em que RBAC e SDUI se encostam, e é onde a economia parece grátis: se o bloco
não veio, ninguém pediria a operação. Só que o manifesto viaja pela rede até um cliente que pode estar
adulterado, atrasado ou instrumentado, e o custo de errar é a operação sensível praticada sem papel —
exatamente o que `RN-NUC-029` existe para tornar auditável e `RN-OFF-007` para impedir.
**Aceite** com o manifesto de um `cashier` em mãos, pedir diretamente a operação da linha 9 (cancelar
venda concluída) → **negada no backend**, com o caminho de `RN-NUC-022`, e a tentativa na trilha; e
nenhuma superfície de `cashier` oferece a linha 9 sem esse caminho ao lado. Remover o bloco do manifesto
não altera nenhuma das duas coisas.
**Infeliz** o manifesto **enumera** o que o papel não alcança, para "mostrar o que existe" → colide com
`RN-NUC-022`, aceite (a negação não revela recurso de outro escopo) e com `RN-EMI-039`. A superfície
nomeia a autoridade que falta para a operação **que o operador pediu**; nunca apresenta o catálogo do que
ele não alcança.
**Offline** o manifesto é **snapshot** resolvido antes do render, e sem contato o terminal aplica o que
retém. Nenhum papel novo, nenhuma operação nova e nenhum estabelecimento novo aparecem na superfície sem
contato (`RN-NUC-018`, offline).

### RN-NUC-035 — Informação na superfície tem três origens, e só três; sem uma delas ela não entra

**Enunciado** toda informação que a superfície mostra vem de **uma** de três origens, declarada.
**(i)** o **objeto da própria operação** que o papel está praticando — e a origem tem **duas formas, e só
duas**, nenhuma delas exigindo linha de leitura (cláusula estreitada em 2026-08-23, `AUT-05`):
**(i.a) objeto que o próprio ator criou ou porta** — o pedido que ele monta, a sessão que **ele** abriu, a
diferença que o fechamento **dele** produz, o que ele mesmo publicou; **(i.b) leitura derivada** — quando
o objeto da operação autorizada é de **outra pessoa** (o registro de trabalho de outro operador, um item
produzido por outro terminal), a superfície mostra **apenas os campos que a decisão daquela operação
exige, enumerados na `RN` dona da operação**, com registro (`RN-NUC-029`). Leitura derivada alcança **um**
objeto, o da operação em curso: nunca lista, nunca filtro, nunca ordenação, nunca exportação, e nunca o
**conteúdo** de um item quando o que a decisão exige é o **inventário** dele. Sem enumeração na `RN` dona
não existe leitura derivada, e a decisão fica sem suporte.
**Campo de texto livre de terceiro não é campo enumerável por si** (cláusula acrescentada em 2026-08-23,
`AUT-12`). Enumerar na `RN` dona um campo cujo conteúdo é **texto de terceiro** (`RN-OFF-027`) **não**
abre leitura derivada sobre o conteúdo dele: o texto é opaco, pode conter dado de pessoa que a operação
não pediu (`RN-EMI-017`) e não é auditável campo a campo — enumerá-lo é enumerar um saco, não um campo.
Ele só é alcançado quando a `RN` dona declara **três** coisas: que a decisão exige o **literal**, e não
uma classificação derivada dele; **quem** o alcança, nomeando o papel ou a atribuição **mais estreita**
que resolve; e que ele não vai para contagem, lista, relatório nem exportação. Sem as três, o que entra
na superfície é a **presença declarada** do campo ("há motivo literal preservado"), nunca o conteúdo — e
a presença basta para decisão de inventário, que é o que a operação de fila decide. Estreitar
**informação** dentro de uma operação autorizada **não** conflita com a célula: `RN-NUC-039` decide
**quem pratica**, e o piso de minimização pode ser mais estreito que a célula, nunca mais largo.
**(ii)** o **artefato publicado** que o terminal retém (`RN-NUC-013`), que é **aplicado**, não consultado
como operação.
**(iii)** uma **operação de leitura** com célula própria na matriz — hoje as linhas 17, 27 e 28 do núcleo
e as quatro linhas de `matriz-operacao-papel-modulos.md` §7. Informação de origem (iii) sem célula `P` ou
`R` para aquele papel **não entra na superfície**, e a ausência é **lacuna nomeada**, nunca licença.
**Motivo** é o que separa derivação de invenção. "O gerente obviamente precisa ver isso" é a frase pela
qual as **12 células `?` de leitura** entrariam liberadas sem ninguém decidir — e o eixo de leitura é
justamente onde a matriz declarou que ninguém decidiu. A separação também explica por que a superfície do
balcão é rica com quase nenhuma linha de leitura: quase tudo que o `cashier` precisa ver é (i) ou (ii), e
é por isso que ele opera sem contato. **E o estreitamento de (i) é o achado mais consequente da auditoria
de 2026-08-23:** escrita como "objeto da própria operação" sem qualificar de **quem** é o objeto, a origem
(i) era um canal de leitura **sem célula** que cobria exatamente o dado das 12 células `?` — fechar a
sessão de outro operador (linha 13, `R`) entrega o registro de trabalho de outra pessoa, e transferir fila
(linha 30, `R`) entregaria o **conteúdo** da fila, que por `RN-OFF-023` inclui o que comprova recebimento
de pagamento e pode incluir identificação do comprador e texto de terceiro. As 12 células **não eram**
falha-fechado: o mesmo dado passava renomeado, por operações permitidas. E a spec já sabia — o irmão §2.3
registrou o desconforto no texto de terceiro e resolveu **não liberando**, enquanto a regra que governa a
origem liberava. Regra que contradiz o arquivo derivado dela é o caminho mais barato de a autorização
vazar: ninguém precisa violar nada. **E o estreitamento foi inócuo em um ponto, fechado em 2026-08-23
(`AUT-12`):** `RN-OFF-012` já enumerava "motivo preservado literalmente" **antes** dele, e por
`RN-OFF-027` esse texto pode conter identificação do comprador — então o portão passava a favor do texto
de terceiro na linha 29. A lição é geral, não do caso: o estreitamento foi eficaz onde a `RN` dona foi
enumerada **na mesma passada** (linhas 13 e 30) e inócuo onde a enumeração **preexistia** e continha
campo opaco. Por isso a cláusula do texto livre é geral e vale para `RN` que ainda não existe: cada `RN`
que enumerar um campo de texto vai cair nela.
**Aceite** três, e os dois últimos são concretos. **(1)** para cada informação de cada momento do arquivo
irmão há a marca (i.a), (i.b), (ii) ou (iii); toda (i.b) cita a `RN` dona **e** o campo; toda (iii) cita a
linha e o valor da célula; nenhuma (iii) aponta para célula `?` ou `N`; auditar por essas marcas devolve
zero exceções não declaradas. **(2)** `manager` fecha a sessão de `cashier` A: vê os **seis** campos que
`RN-NUC-030` enumera e nada mais — pedir o sétimo, a trilha do que aconteceu dentro da sessão, é negado
pela célula `?` da linha 1 do eixo de leitura (`LACUNA-NUC-017`). **(3)** `manager` transfere a fila de um
terminal: vê **quantos** itens, de que tipo, de que terminal, desde quando, o prazo mais próximo e o
desfecho por item (`RN-OFF-016`); **não** vê o conteúdo de item nenhum — nem o que comprova recebimento de
pagamento, nem identificação de comprador, nem texto de terceiro (`RN-OFF-023`, itens 3, 4 e 6).
**(4)** o portador de `queue_owner` resolve um item da lista de trabalho: vê efeito declarado, estado,
terminal, operador, instante e que **existe** motivo literal preservado, e alcança o **conteúdo** do
motivo, com registro, para **aquele** item (`RN-OFF-012`); um `manager` que tem a célula da linha 29 e
**não** porta a atribuição de fila vê a **presença** do motivo, nunca o conteúdo (`RN-OFF-027`, infeliz).
**Infeliz** a decisão do momento exige informação de origem (iii) cuja célula é `?`, **ou** um campo que a
`RN` dona não enumera → a superfície **não a exibe**, e a decisão fica **declarada como sem suporte**, com
a lacuna nomeada (§5). O produto não resolve indecisão exibindo o dado e esperando que ninguém reclame.
**E não é o que acontece com as duas operações que `AUT-05` alcançou:** as duas continuam com suporte,
porque a `RN` dona de cada uma enumerou o que a decisão exige — `RN-NUC-030` para a sessão alheia,
`RN-OFF-016` para a fila. O que saiu de cena foi o conteúdo que **nenhuma das duas decisões exigia**:
transferir fila é decidir sobre um **inventário**, não ler o que a fila carrega.

### RN-NUC-036 — Quem porta autoridade retida vê o que ela ainda cobre; e a superfície distingue três negações

**Enunciado** sem contato, quem porta autoridade retida (`RN-OFF-024`) vê **o que ela ainda cobre** e que
ela **expira** — e a superfície distingue **três** negações, porque os caminhos são diferentes e
`RN-NUC-022` obriga a dar o caminho: **negado ao meu papel** (caminho: o papel que autoriza); **recusado
por falta de contato** (caminho: reconectar); **sem suporte de decisão** (caminho: nenhum hoje, e é dito
como tal). Nenhuma superfície sem contato oferece "reautenticar": pela **regra dona**, reautenticar sem
contato **não existe** (`RN-OFF-024`b, `RN-OFF-033`) — corrigido no texto dela em 2026-08-23.
**As três negações são respostas, não catálogo — e chegam por duas formas, só duas** (cláusula
acrescentada em 2026-08-23, `AUT-06`): **(1) ofertada com o caminho** — só a célula `A:<papel>` é
apresentada **antes** de qualquer pedido, com o caminho ao lado (`RN-NUC-022`); é o único caso em que o
produto exibe operação que o operador não pratica sozinho, e ele exibe porque a operação **é** dele: falta
o autorizador, não o papel. **(2) resposta a um pedido nomeado pelo operador** — as três negações são
ditas quando o operador **pede** a operação, e o requisito que faltava é este: **existe sempre um caminho
pelo qual o operador pede uma operação que a superfície dele não oferece**, e esse caminho **não enumera** —
ele é **nomeado pelo operador**, nunca escolhido de uma lista do que ele não alcança (`RN-NUC-034`,
infeliz). Fora dessas duas formas, **omissão é o desfecho**: célula `N` sem caminho e célula `?` não têm nó
no manifesto (§4, item 5) e não viram controle apagado — ausência por autorização é ausência, nunca estado
visual. E a cláusula que evita o falso dilema: **estado do objeto não é autoridade.** "Este posto está sem
sessão aberta" é origem (i) (`RN-NUC-035`) e é dito **sempre** — não depende de o produto oferecer a
operação que o papel não alcança.
**A propriedade que sustenta o canal de pedido nomeado, e as três cláusulas que decorrem dela**
(acrescentadas em 2026-08-23, com as respostas de `backend` e de `ui`). A propriedade não é esconder
identificador de operação — o vocabulário é fechado e embarcado no cliente, então esconder não é opção
nem defesa. É esta: **a resposta é função de (a operação nomeada, o papel do requerente, o escopo que ele
já alcança) e de nada mais** — nunca da existência, do estado ou da contratação do outro lado. Daí:
**(a) módulo não contratado cai na mesma resposta de "negado ao meu papel"** — mesma forma, mesmo texto,
mesma ausência de detalhe. Se as duas diferirem, o canal vira **listagem comercial**: alguém descobre o
que cada cliente contratou perguntando, que é a armadilha já fechada do outro lado (controle apagado
revela que o recurso existe, `.claude/rules/ui.md`). Isso não contradiz "módulo desligado é ausência de
capacidade, não negação" (`RN-NUC-019`, §3): a distinção segue valendo na **composição da superfície**,
onde ela não é resposta a ninguém; aqui se governa a **resposta a um pedido**, e ali a indistinguibilidade
é a defesa.
**(b) "negado ao seu papel" é dizível sobre a operação, nunca sobre objeto de outro escopo.** Pedido
nomeado que aponta um **objeto** — uma venda, uma sessão, um terminal — fora do escopo resolvido do
requerente recebe a resposta de `RN-NUC-038`: "não existe aqui" e "existe em outro escopo" são a **mesma**
resposta, e isso vale **inclusive entre estabelecimentos do mesmo cliente**, que é o eixo em que o
isolamento é frouxo por construção (`RN-NUC-018`, motivo; `RN-OFF-026`, aceite). A negação por papel fala
da **operação**; a existência do objeto do outro lado nunca muda a resposta.
**(c) "recusado por falta de contato" só é dizível se o terminal responder localmente — e a regra declara
de que isso depende.** Sem contato não há servidor, então nenhuma das três negações é composta por
chamada: para distinguir "o meu papel não alcança" de "o que falta é rede", o terminal precisa reter
**duas** coisas que já existem — **o que cada papel autoriza**, como artefato publicado e versionado
(`RN-NUC-013`, `RN-OFF-020`, origem (ii)/(iii)), e a **autoridade retida** de quem está identificado
(`RN-OFF-024`). Sem as duas retidas, as três negações colapsam numa só sem contato, e o operador é
mandado procurar rede quando o problema era papel — exatamente o `PN-17` que esta regra existe para
evitar. **Fronteira, dita pelo `ui` e registrada aqui:** a indistinguibilidade que o cliente garante é
defesa **do cliente contra si mesmo** e não vincula o servidor — tecla que não vira pedido recebe resposta
genérica do próprio terminal; pedido nomeado que chega ao servidor recebe a negação que o servidor mandou.
**Motivo** as três negações são idênticas para o operador e não têm nada em comum: uma se resolve
chamando alguém, uma se resolve esperando a rede, e uma não se resolve. Colapsá-las é o "erro que fala
com o suporte" de `PN-17`, no pico, com fila na frente — e é o que faz o operador procurar o contorno (a
senha do gerente) para um problema que era só de rede. **E a cláusula das duas formas existe porque três
exigências deste mesmo conjunto colidiam num ponto** (`AUT-06`): `RN-NUC-036` obriga a **dizer** a terceira
negação, a §4 item 5 diz que célula `?` **nunca é oferecida**, e `.claude/rules/ui.md` proíbe desenhar
controle apagado. Sem um canal de **pedido**, a única forma de receber a terceira negação era **forjar** um
pedido — e quem não forja vê ausência sem explicação e toma o contorno que a spec teme: abrir a sessão sob
a própria identidade, ou pedir a credencial do outro (`PN-11`). O canal fecha isso sem revelar nada, porque
quem nomeia é o operador: o produto responde sobre **a operação que ele pediu**, jamais sobre o catálogo do
que ele não alcança (`RN-NUC-022`, aceite; `RN-EMI-039`).
**Aceite** com o link cortado e a validade viva, a superfície do `manager` apresenta sangria (linha 14)
como **disponível** e cancelamento (linha 9) como **até reconectar**; vencida a validade, sangria passa a
**até reconectar** e nada é oferecido para renová-la ali; a superfície do `cashier` apresenta desconto
acima do limite (linha 7) como **até reconectar**, e não como "chame o gerente" — porque com o gerente
presente ele ainda não acontece (`RN-OFF-007`).
**Aceite das duas formas, com o caso que `AUT-06` levantou.** 6h da manhã, `manager` no estabelecimento, o
`cashier` ainda não chegou. A superfície **não oferece** a linha 11 (célula `?`) e não há nó nem controle
apagado; ela **diz o estado**: o posto está sem sessão aberta, e abrir sessão **para si** é possível (linha
10, `R`). O `manager` **nomeia** o pedido "abrir a sessão de A" pelo caminho de pedido → recebe a terceira
negação, *sem suporte de decisão, caminho: nenhum hoje*, com a lacuna nomeada (`LACUNA-NUC-016`), e **nada
mais** — nenhuma lista, nenhuma menção a outra operação, nenhum recurso de outro escopo. Os outros dois
caminhos, no mesmo aceite: `cashier` vê cancelamento (linha 9) **ofertado com o caminho** (`A:manager`), e
`manager` sem contato que pede cancelamento recebe *recusado por falta de contato, caminho: reconectar*.
**Aceite das três cláusulas de 2026-08-23**, todos no mesmo terminal e sem contato. **(a)** o `manager`
nomeia uma operação de um módulo que o cliente **não** contratou → resposta idêntica, palavra por palavra,
à de uma operação que a célula nega ao papel dele; comparar as duas respostas não distingue os dois casos.
**(b)** ele nomeia "cancelar a venda 4471", que existe no estabelecimento **vizinho do mesmo cliente** →
mesma resposta que "cancelar a venda 9999", que não existe em lugar nenhum (`RN-NUC-038`). **(c)** ele
pede sangria com a validade vencida → *recusado por falta de contato*; quem porta apenas `cashier` pede a
mesma sangria → *negado ao meu papel*, com o caminho. As duas respostas são **diferentes**, decididas no
terminal, sem nenhuma chamada — e é isso que prova que as duas coisas retidas de (c) estão lá.
**Infeliz** (a) com quanta **antecedência** o portador é avisado de que a validade vai vencer é
`LACUNA-NUC-033`, do humano — é número, e não o escrevo. Até fechar, a superfície declara o **estado**
(cobre / não cobre), nunca um prazo que ninguém fixou. **FECHADA em 2026-09-23** → `RN-OFF-034`
(`fila-local-valores-de-partida.md`): o aviso vem quando resta um quarto da validade configurada. (b) o caminho de pedido nomeado vira **lista**, por
conveniência de construção → é defeito, e é exatamente o defeito que reconstrói o catálogo do que o papel
não alcança (`RN-NUC-034`, infeliz). **Como** o operador nomeia (digitação, leitura de código, atalho de
teclado) é de `ui`; **como** a negação é composta e transportada é de `backend` — nenhuma das duas é
decidida aqui, e nenhuma pode ser resolvida enumerando.

---

## 2. Os momentos de trabalho — e os dois que faltavam

Momento é **onde o papel está quando decide**, não item de menu. Nenhum momento é tela: um momento pode
compor-se de vários blocos, e um bloco pode servir a mais de um momento.

| # | Momento | Quem vive nele | Linhas do núcleo |
|---|---|---|---|
| M1 | **Abrir a sessão** — assumir o posto | `cashier`, `manager` | 10, 11 |
| M2 | **Vender** | `cashier`, `manager` (por contenção) | 1–6, 15, 17, 27 |
| M3 | **Resolver exceção no balcão** | `cashier` pede · `manager` autoriza | 7, 8, 9, 32, 33 |
| M4 | **Fechar a sessão** | `cashier` (a própria) · `manager` (a de outro) | 12, 13, 14, 16 |
| M5 | **Retaguarda** — fila e lista de trabalho | `manager`, como `queue_owner` | 28, 29, 30, 31, 34 |
| M6 | **Fechar o dia do estabelecimento** | `manager`, `owner` | 35 |
| M7 | **Administrar** — publicar e atribuir | `owner` | 18–25, 36–39 |
| M8 | **Custodiar a capacidade de assinar** | `fiscal_officer` | 34 + irmão da matriz §5 |
| M9 | **Auditar** — ler a trilha | ninguém, hoje | irmão da matriz §7 |
| M10 | **Operar sob concessão** | `provider_support` | 26 |

**Duas correções à lista de momentos sugerida, e as duas vêm da matriz.**

1. **"Abrir o dia" não existe como operação.** A matriz tem **fechar** o dia do estabelecimento (linha
   35, `RN-NUC-031`) e **não** tem abrir; o que existe no começo do expediente é **abrir sessão de
   caixa** (linha 10), que é do posto, não do estabelecimento. Turno segue sem regra
   (`LACUNA-NUC-007`). Escrever um momento "abrir o dia" criaria superfície para operação inexistente —
   o risco principal desta ficha. A assimetria é `LACUNA-NUC-032`.
2. **M8 e M10 não estavam na lista, e não caem em nenhum outro momento.** M8 não é "administrar":
   `fiscal_officer` não publica catálogo, preço, limite nem papel (linhas 18 e 19: `N`), e `owner` não
   alcança o que ele faz. M10 não é momento de papel de cliente nenhum.

**M9 existe como momento e está vazio.** Quatro linhas de leitura, 20 células, **12 `?`**. O momento está
declarado justamente porque o vazio é o achado: seis operações obrigam a **escrever** registro
(`RN-NUC-029`) e nenhuma célula decide quem **lê**.

---

## 3. Módulo não cria momento; ele acrescenta operação a um momento existente

Papel de módulo (`attendant`, `production_operator`) **não** é papel de núcleo e não tem superfície aqui
(`RN-NUC-019`). O que um papel de núcleo alcança em operação de módulo é declarado pela spec do módulo ou
pela **configuração do cliente** (`RN-NUC-033`), e a operação concedida entra no momento a que ela
pertence — o `cashier` que recebe "retirar item" a recebe em M2, **com registro**, nunca sem.

**Toda superfície destes dois arquivos é completa com todos os módulos desligados.** Módulo desligado é
ausência de capacidade, não negação (`RN-NUC-019`), e `REL` desligado não apaga nem atrasa fila nenhuma
(`RN-REL-003`). Superfície de núcleo que precise de módulo para fazer sentido é defeito de fronteira.

---

## 4. O que `backend` precisa daqui para compor o manifesto

Isto é **entrada**, não desenho. Seis coisas, e nenhuma é tela:

1. **A unidade de composição é (papel × momento × escopo)**, não menu. E há uma pergunta a resolver antes
   do primeiro manifesto: uma pessoa pode portar **mais de uma atribuição** no mesmo estabelecimento
   (`RN-NUC-020`), então o manifesto se compõe da **união** das atribuições dela, enquanto o **registro**
   do ato nomeia a **mais estreita** (`RN-NUC-028`). União para compor, estreita para registrar — as
   duas, e não a mesma.
2. **Composição não autoriza** (`RN-NUC-034`). Todo bloco que oferece operação carrega a `RN` e a **linha
   da matriz**; a verificação acontece na operação, sempre. E o manifesto **não enumera** o que o papel
   não alcança.
3. **A chave do snapshot inclui cliente, estabelecimento e papel/atribuições** — `RN-NUC-018` faz do
   estabelecimento dimensão de autorização, e chave sem ele é vazamento **dentro** de um cliente. Este
   arquivo declara o requisito; a forma da chave é de `backend`.
4. **Três negações, não uma** (`RN-NUC-036`): negado ao papel · recusado por falta de contato · sem
   suporte de decisão. Cada uma com o caminho que lhe corresponde, e o caminho é conteúdo do backend, não
   texto do cliente. **E duas formas de chegada, não uma:** só `A:<papel>` é **ofertada**; as demais são
   **resposta a pedido nomeado pelo operador**, e o canal desse pedido **não enumera**. **Requisito de
   forma da resposta, de 2026-08-23:** ela é função de (operação nomeada, papel do requerente, escopo que
   ele já alcança) **e de nada mais** — módulo não contratado cai na **mesma** resposta de negado ao
   papel, objeto de outro escopo cai na de `RN-NUC-038`, e "recusado por falta de contato" é decidido **no
   terminal**, a partir do que ele retém (`RN-NUC-013`, `RN-OFF-024`), nunca por chamada.
5. **Célula `?` nunca é oferecida — e "não oferecida" não é "não respondível".** As 43 negam por default
   até serem decididas; a superfície não as antecipa e não desenha controle apagado para elas; M9 permanece
   vazio enquanto `LACUNA-NUC-017` estiver aberta. O que existe é o pedido nomeado do item 4: pedida, a
   operação de célula `?` recebe *sem suporte de decisão* com a lacuna nomeada. As três exigências
   coexistem sem contorno, e é o desfecho de `AUT-06`.
6. **Leitura derivada é limite de composição, não licença** (`RN-NUC-035` i.b): bloco que exibe campo do
   objeto de outra pessoa exibe **só** o que a `RN` dona enumera, com registro, para **um** objeto — e
   nenhum bloco de operação é caminho para lista, filtro ou exportação daquele objeto.

O que `backend` **não** obtém daqui: nome de bloco, ordem, agrupamento, densidade, e qualquer decisão de
`ui` — de propósito.

---

## 5. Onde a decisão não tem informação que a sustente

Inventário fechado. Nenhuma destas linhas foi resolvida exibindo o dado.

| Decisão | Quem | Informação que falta | Estado na matriz |
|---|---|---|---|
| fechar sessão com diferença: o que aconteceu nesta sessão | `manager` | trilha da sessão (gaveta fora de venda, sangria, exceção autorizada) | `?` — `LACUNA-NUC-017` |
| conceder a mesma exceção **de novo** | `manager`, `owner` | recorrência por operador | `?` + `RN-REL-008` (humano) |
| revogar atribuição de quem não deveria mais portar | `owner` | lista de atribuições e delegações vigentes | **ausente** — `LACUNA-NUC-029` |
| revogar capacidade de assinar | `fiscal_officer` | inventário de capacidades vivas por terminal | **ausente** — `LACUNA-NUC-030` |
| conferir o que o provedor fez no meu ambiente | `owner` | trilha dos atos sob concessão, que `RN-NUC-024` (d) **promete** | **ausente** — `LACUNA-NUC-031` |
| resolver item da lista, ou transferir fila, quando o item carrega texto de terceiro, identificação de comprador ou o que comprova pagamento | `manager` | o próprio **conteúdo** do item — o inventário dele é (i.b) e existe | `?` — `LACUNA-NUC-018` |
| o que entrego ao cliente-final quando não há documento | `cashier` | o desfecho declarado | `LACUNA-OFF-009` (humano + contador) |
| agir antes de a autoridade retida vencer | `manager`, `fiscal_officer` | antecedência do aviso | `LACUNA-NUC-033`, FECHADA em 2026-09-23 → `RN-OFF-034` |

**Contagem de leitura, medida nas duas matrizes** (atualizada em 2026-08-23, quando a partição da linha 18
levou o núcleo de 35 para 39 linhas): de **76** operações, **7** são leitura (núcleo 17, 27 e 28, mais as 4
do irmão §7); dessas 7, **4 estão inteiramente indecisas** para os papéis gerenciais — 12 das 20 células. A
matriz é quase toda **ato**, e a **informação** é onde a indecisão se concentrou. É a leitura do mesmo
número que a contagem das matrizes não dava: as células indecisas não estão espalhadas, estão no que
sustenta decisão. **E até 2026-08-23 essa contagem era otimista pelo lado errado:** as 12 células não eram
falha-fechado, porque a origem (i) de `RN-NUC-035` alcançava o mesmo dado por dentro de operações
permitidas (`AUT-05`). Fechado o canal, o número passou a significar o que ele dizia.

---

## 6. Lacunas nascidas aqui

Abertas em 2026-08-22. Nenhuma bloqueia regra: todas negam por default (`RN-NUC-026`).
`LACUNA-NUC-015`/`016` estão em `matriz-operacao-papel.md` §9; `017` a `028` no irmão dela §9.

- **`LACUNA-NUC-029`** — **quem lê a lista de atribuições e delegações vigentes**, e em que escopo. Sem
  ela, `owner` inicia a linha 20 sem poder ver o que vai alterar. Não é célula `?`: é operação **ausente**
  das duas matrizes, logo negada a todos. **Dono:** humano, com `seguranca` — a mesma superfície é o mapa
  de quem pode o quê, e isso tem custo dos dois lados.
- **`LACUNA-NUC-030`** — **quem vê o inventário de capacidades de assinar vivas** (terminal, alcance,
  desde quando, até quando). `RN-EMI-036`/`037` dão o ato de revogar e nenhuma regra dá a visão do que
  existe para revogar. **Dono:** humano, com o contador; ligada a `LACUNA-NUC-028`.
- **`LACUNA-NUC-031`** — **quem lê a trilha dos atos praticados sob concessão de `provider_support`.**
  `RN-NUC-024` (d) promete legibilidade **ao cliente** e nenhuma célula a concede a papel nenhum. É
  promessa contra default fechado, e é o item de maior consequência dos cinco. **Dono:** humano; entrada
  direta de `seguranca`.
- **`LACUNA-NUC-032`** — **existe operação de "abrir o dia do estabelecimento"?** A matriz tem fechar
  (linha 35) e não tem abrir. Se existir, entra na matriz com o papel que a autoriza; se não existir, o
  fechamento é o único marco de dia, e isso precisa ser dito em vez de subentendido. Vai junto de
  `LACUNA-NUC-007` (turno). **Dono:** humano.
- **`LACUNA-NUC-033` — FECHADA em 2026-09-23** → `RN-OFF-034`. **Com quanta antecedência o portador de autoridade retida é avisado de que ela
  vai vencer** (`RN-NUC-036`, infeliz). É número. **Dono:** humano; irmã de `LACUNA-NUC-014`.

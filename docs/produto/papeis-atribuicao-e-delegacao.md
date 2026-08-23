# Papéis e autorização — como a autoridade chega a uma pessoa, se limita e expira

> **Irmão de `papeis-e-permissoes.md`, com o mesmo peso normativo.** Partido por teto de tamanho, no
> eixo **quais papéis existem × como a autoridade chega a uma pessoa**. Lá estão o cabeçalho
> normativo, o critério de existência, o escopo, os papéis, a reconciliação, a fronteira de D-03 e as
> **lacunas dos dois** (`RN-NUC-017` a `RN-NUC-019`). Aqui, `RN-NUC-020` a `RN-NUC-025`. Numeração
> contínua e imutável entre os dois (`glossario.md` §4.2).
>
> Vale aqui tudo o que o cabeçalho de `papeis-e-permissoes.md` declara: escopo núcleo, **requisito** e
> nunca mecanismo de identidade (**D-03** ABERTA), nenhum número inventado, nada de tabela, coluna,
> endpoint, componente ou stack, e **isto não é a matriz** operação × papel (passo 3 da T-0003).
>
> **§1 é a entrada que governa o resto deste arquivo** e vem do núcleo, não de mim: o **limite** de um
> papel é artefato publicado; o **vínculo** entre uma pessoa e um papel é autoridade. Confundir os dois
> é o defeito que fazia `RN-OFF-007` contradizer `RN-OFF-014`.

---

## 1. As duas coisas que se chamam "papel", e não são a mesma

Toda regra abaixo depende desta separação, que é entrada de `RN-NUC-013` e `RN-OFF-024`:

| | **O que o papel X autoriza** | **Esta pessoa está no papel X** |
|---|---|---|
| O que é | **artefato publicado** — membro do conjunto fechado de `RN-NUC-013` | **autoridade** — `RN-OFF-024` diz explicitamente que **não** é artefato publicado |
| Como muda | publicação: ato online de papel autorizado, **versionada, com vigência** (`RN-NUC-014`) | atribuição, delegação ou revogação: ato online, com trilha, **sem versão e sem vigência** |
| Chega ao terminal | como versão retida, aplicável sem contato (`RN-OFF-020`) | como **autoridade retida com validade** (`RN-OFF-024`) |
| Sem contato | o terminal **aplica** a versão que retém; nada é decidido ali (`RN-NUC-015`) | **expira**; vencida, operação sensível é recusada, e nada renova sem contato |
| No fato concluído | a versão aplicada é **congelada** na venda (`RN-NUC-013`) | o **autor** e a atribuição que autorizaram são registrados; não há versão a congelar |
| Se conflita na volta | divergência de publicação: fato intacto, pendência nomeada (`RN-NUC-015`) | ato praticado **dentro** da validade fica de pé, registrado e escalado, nunca desfeito (`PN-08`) |

**Por que a confusão custava caro.** Tratar "esta pessoa é gerente" como dado publicado dava a ela
autoridade **sem prazo**: o gerente que autentica às 18h, deixa de ser gerente às 19h, e o link cai às
20h continuaria autorizando em nome dele até alguém reconectar. Era isso que fazia `RN-OFF-007`
("offline nunca autoriza") contradizer o caminho infeliz de `RN-OFF-014`. E o inverso também é
defeito: tratar o **limite** como autoridade faria o desconto dentro do limite parar de funcionar sem
contato, e desconto corriqueiro pararia o caixa contra `PN-01`.

**Consequência para o modelo de papéis, e ela é a regra prática:** o cliente ajusta o **limite** de um
papel por publicação, e isso vale sem contato assim que o terminal recebe a versão. O cliente ajusta
**quem porta** o papel por atribuição, e isso **não** viaja como versão: chega como autoridade com
validade, e é revalidado na reconexão. Nenhuma das duas coisas nasce no terminal.

### 1.1 A terceira coisa que o terminal retém — e ela não é papel

Aberta em 2026-08-23, correção pós-gate. A tabela acima é sobre as duas coisas que se **chamam** papel.
Existe uma terceira coisa retida no terminal que não é nenhuma das duas, e a pergunta "terceira categoria
ou atributo de uma das duas?" tem resposta: **terceira categoria**, e a razão é testável, não estética.
É o **meio de identificação retido** — o que permite ao terminal reconhecer, sem contato, que quem está na
frente dele é operador daquele estabelecimento, para que o fato tenha autor. A regra é `RN-OFF-033` e não
se repete aqui.

| | **Meio de identificação retido** (`RN-OFF-033`) |
|---|---|
| O que é | **nem artefato publicado, nem autoridade** — identifica **quem é**, e não decide **o que pode** |
| Como muda | **reconciliação**, com contato; nunca nasce, muda ou se amplia no terminal |
| Sem contato | **identifica e não autoriza**; não destrava nenhuma operação sensível (`RN-OFF-007`) |
| No fato concluído | o autor identificado é registrado; não há versão a congelar nem validade a conferir |
| No terminal furtado | **comprometido**, não perdido (`C-09`, `RN-EMI-038`) |

**Por que ela não cabe em nenhuma das duas, e é isto que prova a terceira categoria:** como **artefato
publicado** ela nunca expiraria, e um operador desligado continuaria identificável para sempre naquele
terminal; como **autoridade retida** ela pararia o **ato ordinário** ao vencer, que é o defeito que
`RN-OFF-032` existe para fechar. Pendurada em qualquer das duas, a resposta é errada — em direções
opostas. O **mecanismo** de prova é o eixo E2 de **D-03**, ABERTA, e nada aqui o presume
(`LACUNA-OFF-015`).

---

## 2. Atribuição — quem porta qual papel, onde e até quando

### RN-NUC-020 — Atribuição é o vínculo operador × papel × escopo, com restrições próprias, e não é artefato publicado

**Enunciado** um operador porta um papel por **atribuição**, que declara: o papel, o **escopo** (um
cliente, ou um conjunto explícito de estabelecimentos), e opcionalmente as restrições de **terminal**
e de **janela de tempo**. Um operador pode ter mais de uma atribuição, inclusive de papéis diferentes;
cada ato registra **qual** atribuição o autorizou. Atribuição **não é artefato publicado** (§1): não
tem versão, não tem vigência, não é aplicada offline como dado — chega ao terminal como autoridade
retida, com validade (`RN-OFF-024`). Além disso, **cada estabelecimento declara duas atribuições
nomeadas**: `queue_owner`, o alvo único da fila de pendências e da lista de trabalho (`RN-OFF-011`,
`RN-OFF-012`), e `establishment_responsible`, o alvo da escalada quando a fila não é olhada. As duas
recaem sobre atribuições que já autorizam as operações correspondentes; **nenhuma das duas concede
autorização.**

**Motivo** separar papel de atribuição é o que permite o conjunto fechado de `RN-NUC-019` sobreviver à
variedade real: a mesma pessoa é caixa de manhã e gerente à noite; o gerente regional alcança quatro
lojas; o dono da padaria é os quatro papéis. Nenhuma dessas situações pede papel novo — todas pedem
atribuição. Nomear as duas atribuições da fila resolve a única coisa que faltava a `RN-OFF-011`: um
endereço. E a cláusula "não é artefato publicado" é o que impede a atribuição de virar dado com
vigência retido para sempre no terminal, que é exatamente o gerente demitido às 19h.

**Aceite** operador com `cashier` no estabelecimento A e `manager` no B: no A, desconto acima do
limite é negado; no B, é autorizado, e a trilha diz por qual atribuição. Revogar a atribuição do B e
reconectar o terminal: a próxima operação sensível é recusada **antes** de acontecer (`RN-OFF-024`c), e
nenhuma versão de artefato precisou ser republicada para isso. Estabelecimento sem `queue_owner`
declarado: a habilitação **não conclui**, e o estado é visível — nunca uma fila cujo alvo é ninguém.

**Infeliz** `queue_owner` e `establishment_responsible` recaem sobre a **mesma** pessoa (negócio de
uma pessoa só). Exigir duas pessoas distintas quebraria a padaria do teste dos três negócios, e não é
o que o produto faz: ele **declara** que a escalada aponta para quem já é o alvo, e que a redundância
não existe naquele estabelecimento. Visível, não silencioso — e nunca uma escalada que finge ter para
onde ir.

**Offline** atribuição **não** nasce, não muda e não se renova sem contato (`RN-OFF-024`d).

---

## 3. Delegação

### RN-NUC-021 — Delegação é subconjunto próprio, é autoridade derivada, e morre com a atribuição que a originou

**Enunciado** um operador pode conceder a outro, temporariamente, um **subconjunto nomeado** do que
ele mesmo já porta — nunca mais do que isso, nunca fora do próprio escopo, e sempre com autor, motivo e
prazo na trilha. Delegação **não cria papel**, não aparece na matriz do passo 3, e **não é
re-delegável**. Nenhum operador delega a si mesmo. Duas cláusulas de tempo, e as duas são novas de
2026-08-23 porque a antiga não tinha referente: **(a)** o prazo nunca passa do **teto próprio da
delegação** (`LACUNA-NUC-034`), nem da **janela de tempo** declarada na atribuição de origem quando ela
existe (`RN-NUC-020`); **(b)** delegação é autoridade **derivada** — ela vive **enquanto vive a
atribuição que a originou**, e revogar essa atribuição **revoga em cascata**, no mesmo ato, todas as
delegações concedidas por ela. A cascata não é efeito colateral: é parte do ato de revogar, e o registro
nomeia a atribuição revogada **e** cada delegação que caiu com ela.

**Motivo** é a válvula que evita papel novo a cada recorte legítimo (`papeis-e-permissoes.md` §4.3) sem
virar permissão por pessoa, que dissolveria o conjunto fechado. As restrições são cada uma um caminho de
fraude fechado: subconjunto próprio impede criar autoridade que o delegante não tinha; e a proibição de
cadeia impede que a origem da autoridade fique inauditável exatamente no momento em que alguém precisa
saber quem autorizou. **A cláusula de tempo antiga prometia o que não entregava** e a auditoria de
2026-08-23 mostrou por quê (`AUT-03`): "prazo não maior que o da própria atribuição" não tinha referente,
porque atribuição **não tem vigência** (§1) — o único prazo existente era o declarado no ato de delegar,
sem teto e sem vínculo com a origem. O desfecho era o gerente demitido às 19h **um salto adiante**: ele
delega às 18h com prazo de 90 dias, é desligado no dia 10, e a delegação sobrevive a ele por 80 dias, com
autoridade derivada de quem não a tem mais. Dar **vigência à atribuição** resolveria e custa caro: é
justamente o que a transformaria em dado com prazo retido no terminal, o defeito que §1 fecha. A cascata
resolve pelo lado certo — a atribuição continua sem vigência, e o que morre é o que **deriva** dela.

**Aceite** `manager` M delega a um `cashier` C a autorização de desconto acima do limite, por prazo
declarado dentro do teto: durante o prazo o desconto entra, com autor **e** delegante na trilha;
vencido, é negado; C **não** consegue repassar a delegação; e nenhuma delegação faz C alcançar operação
que M não alcança. **A cascata, com o caso concreto:** no dia 10, `owner` revoga a atribuição de M — no
mesmo ato a delegação de C cai, o registro nomeia as duas, e a próxima tentativa de C é negada dizendo
que a autoridade de origem não existe mais. Sem contato, o efeito chega **na reconexão**, como qualquer
revogação (`RN-OFF-024`c), e o que C fez **dentro** da validade fica registrado e escalado, nunca desfeito
(`PN-08`).

**Infeliz** (a) a mesma delegação nomeada é concedida a muita gente, sempre igual → é **evidência** de
papel faltando (`RN-NUC-017`), reportada como tal, e a decisão de criar o papel é do humano; o produto
não converte delegação repetida em papel por conta própria. (b) a atribuição do delegante é revogada e
**reconcedida** depois → a delegação **não** volta: reconceder atribuição não ressuscita delegação, e
quem quiser delegar de novo delega de novo, com autor, motivo e prazo novos. Ressuscitar seria autoridade
voltando sem ato de ninguém, que é a definição do que esta regra fecha. (c) o **teto** do prazo é número
e **não o escrevo**: `LACUNA-NUC-034`. Até ele existir, a delegação não pode ser tratada como longa por
conveniência — vale o mesmo padrão de `RN-OFF-024`, o mais curto que a operação suporta.

**Offline** delegação **não** nasce sem contato: é concessão de autoridade, e `RN-OFF-007` a proíbe.
Delegação concedida online é autoridade, não artefato (§1) — retida com a validade de `RN-OFF-024`.

---

## 4. Escalonamento

### RN-NUC-022 — Negado não é fim: o produto diz quem autoriza, e o ato de autorizar é do autorizador

**Enunciado** operação negada ao papel de quem pede é apresentada com **o caminho**: qual autoridade
falta e como obtê-la (`PN-17`). Quando ela é obtida, o ato de autorizar é registrado como ato **do
autorizador** — com quem, quando, sobre qual objeto e quanto —, nunca como ato do requerente e nunca
como propriedade nova do papel dele. A autorização é sempre verificada no backend (`PN-11`), e vale
para **aquela** operação, não para as seguintes.

**Motivo** sem esta regra, "negado" viraria parede, e a parede é o que faz o operador procurar o
contorno — a senha compartilhada, o login do gerente aberto no terminal. A exceção continua existindo;
o que muda é que ela tem autor. A cláusula "vale para aquela operação" fecha o caminho mais barato: a
autorização que abre uma janela e fica aberta pelo resto do turno.

**Aceite** `cashier` pede desconto acima do limite: negado, com o caminho declarado; um `manager`
autoriza; o desconto entra, e a trilha registra o ato como do `manager`, com o valor e a venda. A
venda seguinte pede autorização de novo. Nenhuma resposta de negação revela a existência de recurso de
outro estabelecimento ou de outro cliente (`RN-EMI-039`).

**Infeliz** ninguém com o papel está presente → a venda **continua** (`PN-01`), o produto diz qual
autoridade falta e oferece o caminho que não a exige (`RN-OFF-007`, infeliz); o que exige o papel não
acontece.

**Offline** escalonamento **não** ocorre sem contato: as duas únicas formas são decisão online ou
exceção pré-autorizada, finita e contada (`RN-OFF-025`) — e essa exceção é **artefato publicado**
(§1), não autoridade concedida no terminal. Senha digitada no terminal sem contato nunca é
autorização.

---

## 5. Meta-autoridade — o que nenhuma configuração alcança

### RN-NUC-023 — Alterar o que um papel autoriza é publicação; alterar quem o porta é ato de autoridade; e nenhum papel amplia a si mesmo

**Enunciado** três atos são **meta-autoridade**, todos de `owner`, todos online, todos com autor e
instante na trilha — e os dois primeiros são de naturezas diferentes, pela separação de §1: (a)
alterar **o que cada papel autoriza** é **publicação**, versionada e com vigência, porque é membro do
conjunto de `RN-NUC-013`; (b) criar, alterar e revogar **atribuição** (`RN-NUC-020`) e **delegação**
(`RN-NUC-021`) **não** é publicação — não tem versão nem vigência, e chega ao terminal como autoridade
com validade; (c) declarar as duas atribuições nomeadas do estabelecimento segue (b). Sobre isso, três
limites que **nenhuma configuração de cliente alcança**: **nenhum papel amplia a si mesmo nem o próprio
escopo** — ampliar é sempre ato de outro papel; **nenhum ajuste concede meta-autoridade a papel que não
a tem**, em particular a `cashier`; e o **conjunto de papéis** não é editável pelo cliente, que ajusta
limite, alcance operacional e atribuição.

**(d) Ponto de aplicação dos três limites** — entrou em 2026-08-23, é a cláusula (c) de `RN-NUC-040`
trazida para o texto desta regra, e sem ela os três limites acima não dizem **contra quem** se
avaliam. O piso se avalia contra **como a autoridade chegou**: autoridade de publicar recebida por
**delegação** (`RN-NUC-021`) nunca alcança papel que o delegatário porta — atribuição, contenção
(`RN-NUC-028`) e outra delegação inclusas —, e as **cinco** linhas que publicam a **trava** não são
delegáveis de forma alguma (`RN-NUC-040`b): 19, 36, 37 e 39, que travam a **autoridade**, e a 38, que
trava a **aritmética e a fronteira do dia** (entrou em 2026-08-23, `AUT-13`). Quem porta a meta-autoridade por
**atribuição** segue (a)–(c) como estão: não amplia o **próprio** papel, e publica o que os papéis
abaixo autorizam **inclusive quando também os porta** — é o negócio dele, e é o caso da operação de uma
pessoa só (`RN-NUC-019`, infeliz). Atribuir papel a **outra** pessoa não é ampliar a si mesmo, e segue
(b). **Motivo de (d) existir:** sem ponto de aplicação, o piso tinha um único caso escrito, o direto
("`manager` amplia o próprio limite"), e a autoexpansão passava por fora dele em dois passos — receber
por delegação uma linha de publicação e publicar sobre o papel que já se porta (`AUT-02`, 2026-08-23).

**Motivo** o caminho de escalonamento de privilégio mais curto deste sistema não é técnico, é de
produto: se "o que o papel autoriza" é configurável sem piso, o primeiro cliente que pedir "deixa o
caixa cancelar" apaga `PN-11` inteiro por configuração, e ninguém consegue apontar a regra violada. Ao
mesmo tempo, recusar **toda** ampliação seria recusar `PN-20` — o cliente mexendo no que é dele. O piso
é estreito de propósito: ele proíbe a autoexpansão e a meta-autoridade, não a generosidade do dono com
o alcance operacional dos papéis dele. E a distinção (a)/(b) importa na prática: ampliar um limite
alcança o terminal offline na próxima publicação recebida, enquanto revogar uma atribuição depende da
reconexão e da validade — dois prazos diferentes, que não podem ser prometidos como se fossem um.

**Aceite** `owner` amplia o limite de desconto do `cashier` → aceito, publicado, com vigência e autor,
e o terminal passa a aplicar a versão nova assim que a recebe, congelando-a nos fatos (`RN-NUC-013`).
`owner` revoga a atribuição de um `manager` → nenhuma versão nova de artefato é gerada, as delegações
concedidas por aquela atribuição caem **no mesmo ato** (`RN-NUC-021`b), e o efeito no terminal é o de
`RN-OFF-024`c. `owner` tenta conceder a `cashier` a capacidade de alterar o que um
papel autoriza, ou de atribuir papel → **negado**, com o motivo. `manager` tenta ampliar o próprio
limite, ou o próprio escopo para um segundo estabelecimento → negado, e a tentativa fica na trilha.
Para **(d)**, dois casos que se conferem um contra o outro: `owner` delega a X a linha 20 e X, que porta
`cashier`, usa essa autoridade para publicar o limite do `cashier` → **negado**, e a mensagem nomeia
qual dos dois o barrou (linha não delegável, ou ponto de aplicação do piso); o dono da padaria, que
porta `owner` **e** `cashier`, publica o limite de desconto do `cashier` → **autorizado**, com autor,
versão e vigência (`RN-NUC-013`), porque a autoridade dele não veio de delegação.

**Infeliz** o cliente insiste em algo que o piso proíbe. Não se resolve por configuração e não se
resolve em silêncio: é conflito entre a regra geral e a vontade de um cliente, registrado como tal, com
o custo declarado. **Que outras operações pertencem ao piso além destas três** é `LACUNA-NUC-013`, com
entrada da auditoria do passo 4 — que é quem tem o cenário concreto de escalonamento.

---

## 6. Autoridade retida — o mesmo papel, com prazo

Papel retido no terminal **não é um papel a mais**: é um papel existente, com o que ele autoriza,
retido para operar sem contato, com validade declarada e revogação valendo na reconexão. A regra é
`RN-OFF-024` e não se repete aqui. O que este arquivo acrescenta é a leitura **por papel**:

| Papel | Autoridade retida | Por quê |
|---|---|---|
| `cashier` | **existe, com validade — mas o ato ordinário não depende dela** | corrigido em 2026-08-23: dizer "obrigatória, senão não há venda sem contato" fechava o ciclo que parava o caixa (§6.1). O que sustenta `RN-NUC-001`, `RN-NUC-004` e `RN-NUC-009` sem contato é `RN-OFF-032` — habilitação do terminal mais operador identificado. A validade cobre o **alcance sensível** do papel, se houver, e vencê-la não para o balcão |
| `manager` | **sim, com validade** | é ela que faz `RN-NUC-011` (sangria, suprimento) e `RN-NUC-012`b (gaveta fora de venda) operarem sem contato |
| `owner` | **não** | tudo que só ele faz é online por construção (`RN-NUC-014`, `RN-NUC-023`) — não há o que reter. E **não reter não é não vender**: o ato ordinário não depende de autoridade de pessoa (`RN-OFF-032`, coluna `terminal+ident`), então quem porta apenas `owner` opera o balcão sem contato e nada além dele |
| `fiscal_officer` | **parcial** | assinatura fora do fluxo de venda aceita papel retido válido; ato **sobre** a capacidade é sempre online, porque revogação precisa ter efeito imediato (`RN-EMI-037`) |
| `provider_support` | **nunca** | §7: ato invisível ao cliente até a reconexão destruiria a cláusula que faz o papel ser aceitável |

### 6.1 A divergência de "reautenticar", e o ciclo que ela escondia — resolvido em 2026-08-23

A divergência era esta: `RN-OFF-024` dizia em (b) que, vencida a validade, a operação sensível é
"recusada **até reautenticar**", e em (d) que "nenhuma renovação acontece offline". As duas só coexistem
se reautenticar sem contato for impossível. **Foi a leitura adotada, e agora ela está no texto da regra
dona:** (b) diz "recusada até **reconectar**", e reautenticar sem contato não existe nem é oferecido
(`RN-OFF-033`). O texto anterior prometia ao operador uma próxima ação inexistente, contra `PN-17`, e
abria a leitura permissiva em que um PIN local renovava autoridade revogada — o gerente demitido às 19h
registrando sangria às 20h05 (`AUT-04` da auditoria de 2026-08-23).

**Fechar isso expôs um ciclo maior, e ele era o defeito de verdade.** A autoridade retida do `cashier`
era **obrigatória**, tinha **prazo**, o prazo **não renovava sem contato**, e vencido ele a precondição de
`RN-NUC-009` **falhava** — logo existia uma duração de queda de link a partir da qual o caixa parava de
vender, contra `PN-01`; e o número que governava isso era o mesmo que governa a velocidade da revogação
(`LACUNA-OFF-011`), duas exigências opostas amarradas num só valor. A saída não é escolher qual das duas
perder: é **separar identificar de autorizar** (`RN-OFF-032`, `RN-OFF-033`, §1.1). Com ela, este arquivo
continua valendo inteiro, e a linha do `cashier` na tabela acima deixou de ser falsa.

---

## 7. O papel do provedor — o nosso papel dentro do cliente

### RN-NUC-024 — O papel do provedor nasce declarado: escopo mínimo, prazo, motivo registrado, trilha visível ao cliente, e nunca dado de pagamento

**Enunciado** existe um papel **nosso** dentro do ambiente do cliente, e ele existe apenas como
**concessão declarada**, com as cinco cláusulas, todas obrigatórias: (a) **escopo mínimo** — só o
cliente, só os estabelecimentos e só as operações que a concessão nomeia, e o não nomeado é negado; (b)
**prazo**, depois do qual ela morre sozinha, sem ninguém agir; (c) **motivo registrado** no momento da
concessão, em texto, não em código de categoria; (d) **trilha visível ao cliente** — cada ato praticado
sob a concessão é legível por ele, na superfície dele, não em canal nosso, e **cada ato registra qual
concessão o autorizou**, no lugar que `RN-NUC-029` reserva à atribuição, porque este papel porta
concessão e não atribuição; **a leitura dessa trilha é operação própria, do `owner`**, e enquanto ela
não tiver célula declarada na matriz **a concessão não existe**: papel cujo preço não é pagável não é
concedível (`LACUNA-NUC-031`); (e) **nunca dado de pagamento**, em nenhum escopo, nenhuma concessão,
nenhuma exceção — **e, pela mesma qualidade, nunca a capacidade de assinar (`RN-EMI-033`), nunca ato
sobre ela (`RN-EMI-036`, `RN-EMI-037`), e nunca o valor de qualquer segredo de emissão (`RN-EMI-007`)**.
Mais três negativas: `provider_support` **nunca** é autoridade retida (§6), **nunca** alcança mais de um
cliente com uma concessão, e **nunca** alcança a operação que só existe somando clientes (`RN-EMI-040`).

**Motivo** a necessidade é real e já está declarada: `PN-15` diz que o suporte observa o estado sem
pedir print, e incidente de fila, de publicação e de ponto de emissão exige alguém que consiga olhar. O
mecanismo velho é a **credencial compartilhada** — usar o login do dono, ou um usuário administrativo
que "a gente usa quando precisa". Ele é ruim por duas razões verificáveis: a trilha passa a mentir,
dizendo que o dono fez o que nós fizemos; e o acesso não tem prazo, então ele nunca acaba. O nosso é
melhor em três coisas mensuráveis: a autoria é **nossa e nomeada**, o acesso **expira sozinho** sem
depender de alguém lembrar de revogar, e o cliente **vê** — o que transforma a promessa em algo que ele
pode conferir, e não em confiança pedida. É por isso que a visibilidade não é cortesia: ela é o preço
de o papel existir.

**Por que (e) cresceu em 2026-08-23 (`AUT-09`).** A cláusula (a) diz que vale **o que a concessão nomeia**,
e a única negativa absoluta era dado de pagamento — logo a **capacidade de assinar** era nomeável, e um
incidente do tipo "o estabelecimento 9 parou de assinar" bastava para pôr no escopo nomeado o ato de maior
consequência do módulo, com a responsabilidade legal e tributária do cliente. `RN-EMI-007` protege o
**valor** do segredo, não o **uso** dele. A negativa absoluta existe justamente para aquilo em que "a
concessão nomeia" não é guarda suficiente; assinar tem essa qualidade e faltava na lista. Que a matriz
hoje feche o caminho por célula não basta: a célula está em arquivo derivado, e a regra **dona**
continuava autorizando.

**Por que (d) ganhou duas frases (`AUT-10`).** O registro de `RN-NUC-029` nomeia a **atribuição** que
autorizou, e este papel porta **concessão** — então, mesmo existindo o registro, ele não dizia **qual
concessão** autorizou o ato, que é exatamente o que o cliente precisa para conferir o escopo de (a). E a
leitura dessa trilha não era operação de nenhuma matriz, logo negada a todos: a única resposta possível ao
`owner` que perguntasse "o que vocês fizeram no meu ambiente?" seria um canal **nosso** — o mecanismo que
(d) foi escrita para recusar, e com ele a trilha volta a mentir. Amarrar a **concessibilidade** à
existência do leitor é o que impede o papel de nascer sem o preço pago. Hoje ele não é instanciável, e
esse é o desfecho correto: o risco não é o estado atual, é o momento da primeira concessão, sob incidente,
com pressa.

**Aceite** **antes** de qualquer concessão existir, existe a operação de leitura da trilha de atos sob
concessão, com célula para `owner`; sem ela não há concessão, e essa é a primeira coisa a conferir.
Depois: conceder acesso, agir, e conferir os cinco — nenhuma operação fora do escopo nomeado é possível;
passado o prazo, tudo é negado sem ninguém revogar; o motivo está legível; **o cliente** consegue listar
cada ato nosso com quem, quando, o quê **e sob qual concessão**, sem nos pedir; e nenhuma concessão, em
nenhuma combinação, devolve dado de pagamento, capacidade de assinar, ato sobre ela ou valor de segredo
de emissão — **nem quando a concessão os nomeia**, porque nomear o que é absolutamente negado não amplia
nada. Em paralelo: uma concessão no cliente A não autoriza nada no cliente B, e nenhum caminho a partir
dela alcança contagem que soma clientes (`RN-EMI-040`). Com o terminal sem contato, `provider_support`
não opera.

**Infeliz** (a) o incidente é urgente e a concessão não existe, ou já venceu. **O produto não se
autoconcede o papel** — mesma postura de `RN-EMI-036`, infeliz: falha fechado, o pedido de acesso é
nomeado e visível, e o que dependia dele não acontece. Conceder por conta própria "porque era urgente"
destrói a única coisa que faz este papel ser aceitável, e uma vez destruída ela não volta. (b) o
incidente exige precisamente o que (e) nega — assinar pelo cliente para desafogar a contingência → **não
acontece, em nenhuma hipótese.** O que o cliente perde está declarado: nós diagnosticamos e dizemos o que
fazer, e **o ato é do `fiscal_officer` dele** (`RN-EMI-036`), inclusive quando isso custa tempo dentro de
um prazo de horas (`RN-EMI-028`). Preferir o inverso é trocar a responsabilidade legal de lugar em
silêncio, no pior momento para se explicar. **Se a concessão exige consentimento do cliente por ato, ou
só visibilidade**, é `LACUNA-NUC-009` — e esta regra vale nas duas respostas, porque as cláusulas não
dependem de qual delas é.

---

## 8. Automação e canal externo não têm papel

### RN-NUC-025 — Nenhuma automação e nenhum canal externo porta papel; a confirmação é autorizada pelo papel do efeito

**Enunciado** não existe papel, atribuição ou concessão para automação, integração ou canal externo. O
que uma proposta pendente (`pending_proposal`) precisa para virar fato é o papel que autoriza **o
efeito** — o mesmo que seria exigido se um humano tivesse pedido a operação diretamente. Não existe
"papel de confirmar proposta": confirmar desconto acima do limite exige o papel de `RN-NUC-007`;
confirmar cancelamento exige o de `RN-NUC-008`. Sessão externa (`external_session`) nunca escala para
papel de operador.

**Motivo** é `RN-ATI-002` levado ao modelo de papéis, e o candidato existia mesmo: "papel autorizado a
confirmar proposta" apareceu em `RN-ATI-001` e parecia pedir uma coluna própria na matriz. Ela seria
exatamente a "automação com papel próprio" que `RN-ATI-002` chama de senha de gerente que todo mundo
sabe — autorização sem pessoa responsável. Reconhecer que a autorização é a **do efeito** também
elimina uma classe inteira de defeito: a proposta que contorna o limite por vir de outro caminho.

**Aceite** operador com papel apenas de lançamento confirma, pela automação, uma proposta que altera
valor além do limite dele → **negado no backend**, com a tentativa na trilha; o mesmo pedido feito por
`manager` é autorizado, e o registro é do `manager`. Nenhuma superfície oferece um papel de automação,
e nenhuma concessão de `provider_support` confirma proposta em nome de ninguém.

**Infeliz** a proposta é legítima e o escopo caiu entre a leitura e a confirmação → vale `RN-ATI-016`:
a proposta é invalidada e o caminho é propor de novo dentro do escopo atual.

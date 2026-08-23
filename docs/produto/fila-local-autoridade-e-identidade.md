# O que o terminal retém para operar sem contato — autoridade, identidade e habilitação

> **Irmão de `fila-local-conteudo-e-repouso.md`, com o mesmo peso normativo.** O arquivo original chegou
> a 395 linhas e a correção de `AUT-14` (2026-08-23) acrescenta regra, não encurta. O corte é no eixo pelo
> qual os dois lados são lidos: lá, **o conteúdo** da fila — confidencialidade em repouso, o que sai
> depois de confirmado, o que nunca entra, texto de terceiro (`RN-OFF-021` a `RN-OFF-023`, `RN-OFF-027`);
> aqui, **o que o terminal retém para poder operar** — autoridade retida, transferência, identidade e a
> habilitação a vender (`RN-OFF-024` a `RN-OFF-026`, `RN-OFF-032`, `RN-OFF-033`).
>
> **Nada foi alterado de conteúdo pela mudança de arquivo**, e a §3 do arquivo original ficou **vaga de
> propósito** — o número não foi reaproveitado lá, para não invalidar citação já feita (o mesmo
> precedente de `nucleo-venda.md` e da partição da matriz). O que mudou nesta data está sempre marcado
> com a data e o achado.
>
> **Piso, não teto**, como os irmãos: módulo pode ser mais restritivo, nunca mais permissivo.
> **`OFF` não é módulo ativável** — é contrato transversal, e vale para o núcleo e para todo módulo.
>
> **Nenhum número.** Toda duração, tamanho e margem é `LACUNA-OFF-nnn` com dono nomeado: aqui nascem
> `011`, `015`, `016` e `017`. Numeração de regra é contínua e imutável entre os irmãos
> (`glossario.md` §4.2); `C-10` mora aqui, `C-09` continua no irmão.
>
> **Fronteira de D-03, ABERTA.** Declarar *o que o terminal retém* e *o que cada coisa retida sustenta* é
> daqui. **Como** se prova identidade, onde ela mora, sessão, token e SSO **não são** — e nenhuma regra
> deste arquivo depende de saber.

## 1. Por que este arquivo existe

O terminal de PDV é o lugar de **menor controle** do sistema (irmão, §1): está no balcão, é fisicamente
acessível a quem passa, e é a peça que mais se perde, se troca e se reinstala. Ele precisa reter **três**
coisas de naturezas distintas para operar sem contato, e a única forma de errar barato é não confundi-las:

| O que ele retém | O que governa | Regra |
|---|---|---|
| **artefato publicado** — preço, limite, configuração | versão e **vigência** | `RN-OFF-020` |
| **autoridade retida** — quem está autenticado e o que ele autoriza | **validade** | `RN-OFF-024` |
| **meio de identificação** — quem é o operador que está na frente dele | **reconciliação** | `RN-OFF-033` |

Mais um fato, que não é nenhuma das três e sem o qual nada acima serve: o terminal estar **habilitado a
vender** por aquele estabelecimento (`RN-OFF-032`i), com **prazo próprio** (`LACUNA-OFF-017`).

## 2. Autoridade retida

### RN-OFF-024 — Papel retido no terminal é autoridade, não dado publicado: tem validade declarada, e revogação vale na reconexão

**Enunciado** o papel de quem autenticou, e o que ele autoriza, retidos no terminal para operar sem
contato, são **autoridade retida** — **não** "dado publicado" no sentido de `RN-OFF-020`. Consequências,
as quatro: **(a)** validade declarada; **(b)** vencida a validade, operação **sensível** offline é
**recusada até reconectar** — reautenticar sem contato **não existe** e o produto não o oferece
(`RN-OFF-033`); **(c)** revogação ou mudança de papel tem efeito **na reconexão**, antes de qualquer nova
operação sensível; **(d)** nenhuma renovação acontece offline. Esta regra governa **só operação
sensível**: o **ato ordinário** de venda não se sustenta em autoridade retida e não para quando ela
vence (`RN-OFF-032`, e a coluna `terminal+ident` da matriz — `RN-NUC-027`, cláusula 3).
**Motivo** corrige contradição interna. `RN-OFF-007` diz que offline **nunca** autoriza, e o aceite dele
classificava "papel de quem autenticou" como dado publicado — enquanto o caminho infeliz de `RN-OFF-014`
deixava "decisão de papel autorizado" destravar continuar vendendo acima do teto. Papel retido sem prazo
honra para sempre: gerente autentica às 18h, deixa de ser gerente às 19h, o link cai às 20h, e o terminal
segue autorizando em nome dele até alguém reconectar. O **limite** do papel — a tabela de quanto cada
papel pode — continua sendo artefato publicado e versionado (`RN-OFF-020`); **quem** está autenticado e o
que ele autoriza **agora** não é artefato: é decisão.
**Aceite** com o terminal sem contato além da validade, operação sensível é recusada com "esta operação
exige **reconectar**" — desconto acima do limite (`RN-OFF-007`), exceção de teto (`RN-OFF-025`),
transferência de fila (`RN-OFF-026`), encerramento de faixa (`RN-OFF-006`, infeliz (c)), ato de assinatura
fora do fluxo de venda (`RN-EMI-036`); **no mesmo terminal e no mesmo minuto, o ato ordinário de venda
continua** (`RN-OFF-032`); ao reconectar, o terminal verifica papel e revogação **antes** de aceitar a
próxima operação sensível; e o que foi feito com papel depois revogado, **dentro** da validade, é fato
registrado e escalado, nunca desfeito em silêncio (`PN-08`).
**Infeliz** a validade vence no pico e ninguém com o papel está presente → a venda continua (`PN-01`) e o
produto diz **qual** autoridade falta, oferecendo o caminho que não a exige (`RN-OFF-007`, infeliz); o que
exige o papel não acontece. A **duração** é configuração do cliente (`RN-OFF-028`) e **não escrevo o
número**: `LACUNA-OFF-011`. Enquanto ela não tiver valor medido, a validade **não** pode ser tratada como
longa por conveniência — o padrão declarado é o mais curto que a operação suporta, e com `RN-OFF-032` no
lugar o custo de encurtá-la deixou de ser o balcão: é só o alcance sensível.

### RN-OFF-025 — Destravar o teto de operação offline é decisão online; a exceção offline, se existir, é pré-autorizada, finita, contada e com trilha própria

**Enunciado** passar do teto de `RN-OFF-014` **não** é decisão de papel tomada no terminal sem contato.
Duas formas, e só duas: **(a) online**, com o papel verificado no servidor; **(b) exceção nomeada**,
publicada **antes** como artefato com vigência (`RN-OFF-020`), com limite próprio, consumo **contado** e
**trilha própria por uso**. Nunca autorização concedida offline (`RN-OFF-007`, `RN-OFF-024`).
**Motivo** o caminho infeliz de `RN-OFF-014` dizia "decisão explícita de papel autorizado que assume o
risco" — exatamente o que `RN-OFF-007` proíbe: autoridade concedida offline, com dinheiro em movimento e
conferência depois. A necessidade, porém, é real e não se recusa: caixa no pico, sem link, teto atingido,
e "pare de vender" não é resposta aceitável (`PN-01`). O mecanismo ruim é "o gerente digita a senha dele e
o terminal libera à vontade" — sem limite, sem contagem, e válido enquanto o terminal quiser. O mecanismo
novo é melhor em três coisas verificáveis: é **finito** (tem quantidade), é **contado** (aparece na
trilha, com quem e quando), e **não nasce offline** (foi publicado antes, como preço e limite já são).
**Aceite** com o teto atingido em **D1**, o terminal só passa dele consumindo exceção pré-autorizada, e
cada uso aparece na trilha com operador, instante e quantidade restante; esgotada a exceção, venda nova é
recusada (`RN-OFF-014`) e nada da fila é descartado (`RN-OFF-015`); nenhuma autenticação local concede
exceção nova.
**Infeliz** o humano decide que **não** existe exceção offline → `RN-OFF-014` vale seco: atingido o teto,
venda nova é recusada até reconectar, e isso é declarado ao cliente na habilitação, nunca descoberto no
pico. Se existe, o tamanho dela e quem a publica saem com o teto: `LACUNA-OFF-004`.

### RN-OFF-026 — Transferência de fila é escopada ao mesmo cliente e ao mesmo estabelecimento, e nunca por identificador que o pedido informa

**Enunciado** a transferência de `RN-OFF-016` (reinstalação, troca, descomissionamento) só ocorre entre
terminais do **mesmo estabelecimento do mesmo cliente**. Origem e destino são resolvidos a partir de quem
está autenticado e do registro da plataforma — **nunca** de identificador de terminal, de fila ou de
estabelecimento vindo de quem pede.
**Motivo** é o acesso indireto desta camada: "reinstalei, me devolve a fila do terminal 2", com o
identificador no pedido, é o caminho mais curto para receber venda, pagamento e identificação de
comprador de outro estabelecimento — ou de outro cliente. E o pedido é **legítimo na aparência**, feito
por alguém autenticado, no meio de um incidente, com pressa: é o cenário em que a validação costuma ser
afrouxada "porque o terminal quebrou".
**Aceite** pedido cujo destino não pertence ao mesmo estabelecimento e cliente da origem é recusado e
escalado como **incidente**, não como erro de campo, com resposta que não revela o que existe do outro
lado; a transferência exige papel válido (`RN-OFF-024`), autor, instante e o que foi transferido em trilha
(`RN-OFF-016`); item transferido conserva a identidade cunhada na origem (`RN-OFF-013`) e o instante do
fato (`RN-OFF-019`).
**Infeliz** o estabelecimento correto não pode ser resolvido → **não há transferência**: a fila continua
onde está, contável, e o caso é escalado ao dono da fila (`RN-OFF-011`). Nunca transferência "para não
perder", nunca destino escolhido por default.

## 3. A separação que destrava `PN-01` — e a terceira coisa que o terminal retém

Aberta em 2026-08-23, correção pós-gate (`docs/auditorias/2026-08-23-autorizacao-papeis-e-superficie.md`,
`AUT-04`, e o achado central do dossiê de **D-03**). As duas regras abaixo existem porque três regras
aprovadas fechavam um ciclo: a autoridade retida do papel-piso era **obrigatória**, tinha **prazo**, o
prazo **não renovava sem contato**, e vencido ele a precondição de abrir sessão de caixa **falhava** —
logo existia um comprimento de queda de link a partir do qual o caixa parava de vender, contra `PN-01`.

### RN-OFF-032 — Identificar o autor e autorizar o ato são coisas distintas; o ato ordinário de venda depende só da primeira

**Enunciado** o **ato ordinário** de venda **não** se sustenta em autoridade retida. Ele se sustenta em
duas coisas, e nenhuma delas é autoridade de pessoa: **(i)** o terminal estar **habilitado a vender por
aquele estabelecimento** — fato estabelecido **com contato**, no cadastramento do terminal, retido nele e
com **prazo próprio** (cláusula do prazo, abaixo); **(ii)** o operador estar **identificado** no terminal
(`RN-OFF-033`), para que o fato tenha autor. Nenhuma das duas expira com a validade de `RN-OFF-024`, e
nenhuma das duas autoriza nada **além** do ato ordinário. Operação sensível continua exigindo autoridade
retida dentro da validade. Módulo classifica as operações dele pelo mesmo critério, e o default é
**sensível** (`RN-OFF-008`).

**O conjunto é fechado, e quem o fecha é a coluna.** Ato ordinário é o que o **papel-piso**
(`RN-NUC-019`) já alcança pelo próprio papel, sem autorização de outro e sem mover dinheiro fora de
venda — e as operações que satisfazem esse critério são **exatamente** as linhas cuja coluna `Offline`
carrega `terminal+ident` na matriz do núcleo (`RN-NUC-027`, cláusula 3): hoje **nove**, as linhas 1, 2,
3, 4, 6, 10, 12, 15 e 27 — abrir e alterar pedido, lançar item, concluir a venda, receber pagamento em
espécie, compor valor até o limite, abrir e fechar a **própria** sessão de caixa, abrir a gaveta como
consequência da venda em espécie, e ver o estado da conexão. Esta regra **aponta** para a coluna e não
compete com ela: por `RN-NUC-039` a célula vence a prosa, **inclusive esta**. Operação que passe a ser
ordinária entra por **alteração da célula**, pelo dono da matriz, nunca por leitura desta lista.
**Corrigido em 2026-08-23** (`AUT-14`): até então esta regra enumerava as operações em prosa enquanto as
células diziam `retida`, e o efeito era esta regra **inerte exatamente nas operações que ela existe para
liberar**.

**O teto sem autoridade retida é o do papel-piso.** Onde o ato ordinário compõe valor (linha 6,
`RN-NUC-006`), o limite aplicado sem contato **e sem autoridade retida válida** é o do **papel-piso**,
publicado (`RN-OFF-020`) — nunca o de um papel que só a autoridade retida provaria. Acima dele a
operação deixa de ser ordinária: é a linha 7, recusa até reconectar (`RN-OFF-007`). Sem esta cláusula a
célula da linha 6 é inimplementável, porque identificar quem está na frente do terminal **não** diz que
papel a pessoa porta.

**(i) tem prazo declarado, e ele não é opcional** (acrescentado em 2026-08-23, junto de `AUT-14`). A
habilitação a vender é estabelecida **com contato**, **vence** por tempo sem contato e é renovada por
contato, com **aviso antecipado** ao operador antes de vencer. O motivo é o mesmo, palavra por palavra,
que deu prazo à capacidade de assinar (`RN-EMI-033`, `RN-EMI-037`): terminal sem rede **não recebe
revogação**, então sem prazo a revogação é promessa que a física do offline não cumpre. Sem esta
cláusula, um terminal furtado e mantido offline seguiria abrindo sessão, concluindo venda em espécie e
entregando via em nome do emitente **indefinidamente** — o oposto de `C-09`, que trata o terminal furtado
como **comprometido** e faz o terminal perder a habilitação. A grandeza é **tempo sem contato**, mais a
**antecedência do aviso**; o valor é `LACUNA-OFF-017` e **não o escrevo**.

**Motivo** a necessidade preservada é a da revogação rápida: é por ela que a autoridade retida tem
validade curta, e é o gerente demitido às 19h que a justifica. O mecanismo recusado é fazer o **ato
ordinário** depender dessa mesma autoridade — e ele é ruim de um jeito verificável, não estético: amarra
num único número dois prazos que o negócio quer opostos (curto para a revogação ser rápida, longo para o
balcão não parar), e o desfecho é que existe uma duração de queda de link a partir da qual o caixa **para
de vender**. O mecanismo novo separa identificação de autorização: o ato ordinário se apoia na habilitação
do **terminal**, que não é autoridade de pessoa e não tem razão para expirar em minutos. Ele é melhor
porque desamarra os dois prazos — encurtar a validade passa a custar **só** o alcance sensível — e a prova
é o aceite abaixo: no mesmo minuto, no mesmo terminal, a venda entra e a sangria é recusada.

**Aceite** link caído desde 20h; a validade da autoridade retida vence às 21h00. **Às 21h01, com um
cliente-final no balcão:** o operador lança item, conclui a venda em espécie, a gaveta abre pelo caminho
(a) de `RN-NUC-012` e o troco sai — nada disso é recusado, e o fato registra como autor o operador
identificado, com o instante. No **mesmo** minuto e no **mesmo** terminal, sangria (`RN-NUC-011`), gaveta
fora de venda (`RN-NUC-012`b) e desconto acima do limite (`RN-NUC-007`) são recusados com "esta operação
exige **reconectar**" (`RN-OFF-024`b). Às 21h40 a rede volta: nada da venda é reescrito (`PN-07`), e a
autoridade é reverificada antes da próxima operação sensível.

**Aceite do negócio de uma pessoa só, e ele é o caso que prova a correção de `AUT-14`.** O operador porta
**apenas** `owner` — nenhuma atribuição de `cashier` nem de `manager`, logo **nenhuma** autoridade retida
(`RN-NUC-027`, cláusula 4) — e o link está caído. Ele pratica as **nove** linhas do ato ordinário: abre o
pedido, lança item, conclui em espécie, dá troco, abre e fecha a própria sessão, vê o estado da conexão.
Cada fato registra o `owner` como autor. No mesmo minuto, sangria e gaveta fora de venda são recusadas
com "exige reconectar", e o desconto que ele aplica sem contato vai até o limite do **papel-piso** — não
até o dele, que só a autoridade retida provaria. Verificação da conformidade: buscar `terminal+ident` na
coluna `Offline` devolve as mesmas nove linhas que este aceite exercita, nem uma mais.

**Aceite do prazo de (i):** com a habilitação a vencer, o terminal avisa com a antecedência declarada e
continua vendendo; vencida, ele **para** de praticar as nove, dizendo que o que restabelece é **contato**
— e o aviso precede o vencimento sempre, de modo que o desfecho nunca aparece pela primeira vez no pico
(`PN-17`). Terminal registrado como furto tem a habilitação **revogada na hora** no servidor, sem esperar prazo
(`C-09`) — e, se ele estiver **offline**, para de praticar as nove quando o prazo vencer, porque revogação
não alcança dispositivo sem contato. A janela entre o furto e o vencimento é **inerente e limitada pelo
prazo**, é declarada ao cliente com as duas datas (`RN-EMI-038`c) e **nunca** apresentada como zero
(corrigido em 2026-08-23, `AUT-16`).

**Infeliz** (a) o terminal **não** está habilitado a vender por aquele estabelecimento (nunca cadastrado,
ou descadastrado) → não há ato ordinário ali: o terminal não vende, e isso é estado **declarado na
habilitação**, nunca descoberto no pico — mesma postura de `RN-OFF-025`, infeliz. (a1) a habilitação
**venceu** por tempo sem contato → mesmo desfecho de (a), com o aviso já dado e datado. É o **único**
caso em que esta regra para o balcão, e é a tensão que `LACUNA-OFF-017` entrega ao humano: curto demais
para de vender quem opera dias com link ruim (contra `PN-01`), longo demais deixa o dispositivo furtado
vendendo em nome do emitente (contra `C-09`). (b) o operador não é identificável naquele terminal
(contratado durante a queda, nunca esteve no conjunto retido) → ele não opera; o produto diz que a
identificação exige contato e o caminho é outro operador identificado, também declarado na habilitação.
(c) o operador foi **desligado** e o terminal ainda não soube → ele é identificável, o ato ordinário
acontece e fica **registrado com autor**; o produto não finge o contrário. A contenção aqui é a presença
física e a conferência de `RN-NUC-010`, e a janela é a de reconciliação de `RN-OFF-033` — é **ela** que
precisa ser curta, não a validade da autoridade. Este é o preço explícito desta regra, declarado, e ele é
menor que o de parar o balcão.

**Offline** **integral** em D1, D2 e D3; classe 1. É a regra que faz o ato ordinário poder ser integral.

**Fronteira de D-03, declarada.** Esta regra exige que **(i)** exista sem contato — e (i) é requisito já
aprovado, independente de D-03: o terminal é dispositivo **vinculado a um estabelecimento**
(`glossario.md`). Ela **não** escolhe entre as opções de D-03, não decide onde a identidade mora e não
presume mecanismo de prova. Opção de D-03 que não consiga entregar (i) retido no terminal **não satisfaz
esta regra**, e escolhê-la é reabrir o conflito com `PN-01` — decisão do humano, com o custo à vista.

### RN-OFF-033 — O meio de identificação retido é uma terceira categoria: identifica, não autoriza, e reconcilia

**Enunciado** o **meio de identificação retido** no terminal é uma **terceira categoria** de coisa
retida, ao lado de **artefato publicado** (`RN-OFF-020`) e **autoridade retida** (`RN-OFF-024`), e não é
nenhuma das duas: é o que permite ao terminal, **sem contato**, reconhecer que quem está na frente dele é
um operador **daquele estabelecimento**, para que o fato tenha autor (`RN-OFF-032`ii). Quatro cláusulas:
**(a)** ele **não autoriza nada** — reconhecer quem é não é decidir o que a pessoa pode, e nenhuma
operação sensível se destrava por ele (`RN-OFF-007`); **(b)** é recebido **com contato**, para o conjunto
de operadores daquele estabelecimento, e **nunca** nasce, muda ou se amplia no terminal — e o conjunto
**não** é filtrado por quem porta autoridade retida: quem porta apenas `owner` está nele, ou o negócio de
uma pessoa só volta a não vender (`RN-OFF-032`, aceite); **(c)** é **confidencial em repouso** no mesmo
piso de `RN-OFF-021`, e não aparece em registro de erro, cópia de apoio nem exportação de diagnóstico;
**(d)** ele **reconcilia** — operador desligado deixa de ser identificável naquele terminal a partir do
momento em que o terminal recebe a reconciliação, e terminal furtado trata o conjunto retido como
**comprometido**, não como perdido (`RN-EMI-038`, `C-09`). O conjunto retido **nunca** inclui
`provider_support`, que não é autoridade retida e não opera sem contato (`RN-NUC-024`).

**Motivo** a necessidade vem de `RN-OFF-032`: sem meio de identificação retido, o autor do fato só existe
com rede — e aí ou a venda para (contra `PN-01`) ou o fato sobe sem autor (contra `PN-11` e contra a
conferência de `RN-NUC-010`). O mecanismo velho é o **usuário único do balcão**: ninguém identifica
ninguém, todo fato pertence ao "caixa 1". Ele é ruim de forma verificável — a conferência de sessão aponta
para um nome que não é de pessoa, e desvio deixa de ter autor. O nosso é melhor porque o autor existe
offline e é nominal, e é seguro porque a coisa retida **não autoriza**: é o único jeito de o dispositivo
mais exposto do sistema (irmão, §1) carregar identidade sem carregar poder. E declarar a **terceira**
categoria é o que impede o atalho — sem ela, quem construir isso a pendura numa das duas existentes, e as
duas dão a resposta errada: como artefato publicado ela nunca expiraria; como autoridade retida ela
pararia o balcão ao expirar, que é exatamente o defeito que `RN-OFF-032` fecha.

**Aceite** com o link cortado desde antes do expediente, dois operadores diferentes do estabelecimento se
identificam no mesmo terminal ao longo do dia e cada fato registra o autor correto; **nenhum** deles
destrava operação sensível por estar identificado; com a aplicação fechada e o dispositivo em mãos, o
conjunto retido não é legível nem alterável (`RN-OFF-021`) e não aparece em exportação de diagnóstico;
operador desligado deixa de ser identificável naquele terminal depois da reconciliação; o portador de
**apenas** `owner` está no conjunto e é identificado como qualquer outro; e o terminal furtado entra em
`C-09` com o conjunto tratado como comprometido.

**Infeliz** (a) o **mecanismo** de prova de identidade ainda não existe — é o eixo E2 de **D-03**,
ABERTA, e este requisito não o escolhe: `LACUNA-OFF-015`. Até fechar, nenhum caminho constrói o conjunto
retido, e o gate de `seguranca` precede a construção, na mesma ordem de `RN-OFF-021`, infeliz. (b) o
conjunto está **defasado** e um operador legítimo não é reconhecido → ele não opera naquele terminal, e
isso é declarado; nunca contornado por identificação genérica, por "operador padrão" ou por identificar
pelo terminal. (c) **com que frequência** o terminal reconcilia o conjunto, e **qual o tamanho máximo**
dele: `LACUNA-OFF-016` — grandeza declarada, valor em aberto. É ela que define a janela do infeliz (c) de
`RN-OFF-032`, e é por isso que ela é o número a apertar.

## 4. Cenário

Continua a sequência do irmão, onde está `C-09`.

### C-10 — Papel retido vence com o link caído

**ATOR** operador de caixa. **GATILHO** o gerente autenticou às 18h; deixou de ser gerente às 19h; o link
caiu às 20h; às 21h a validade do papel retido vence.
**ESTADO INICIAL** **D1** desde 20h, fila abaixo do teto, cliente-final pedindo desconto acima do limite
do operador.
**PASSOS** o operador tenta o desconto às 20h30 · tenta de novo às 21h30 · a rede volta às 21h40.
**O QUE O SISTEMA FAZ** às 20h30 recusa, porque desconto acima do limite é classe 4 e **nunca** foi
autorizável offline (`RN-OFF-007`) · às 21h30 recusa também toda operação sensível que dependia do papel
retido, agora vencido, dizendo que ela exige **reconectar** (`RN-OFF-024`b) — e, no mesmo minuto,
**continua concluindo venda em espécie**, porque o ato ordinário não depende daquele papel
(`RN-OFF-032`, coluna `terminal+ident`) · às 21h40, na reconexão, verifica papel e revogação **antes** da
próxima operação sensível e descobre que o papel não existe mais · o que foi feito com aquele papel
**dentro** da validade fica registrado e escalado, não desfeito (`PN-08`).
**O QUE O OPERADOR VÊ** que a operação exige **reconectar** — nunca "reautentique", que sem contato não
existe (`RN-OFF-033`) — e o caminho que não exige o papel; nenhum modal de erro de rede, nenhuma venda
travada.
**DESFECHO** nenhuma autoridade concedida offline; nenhuma venda perdida, **inclusive depois de a validade
vencer**; a janela de honra do papel revogado foi a validade declarada, e ela é conhecida.
**CAMINHO INFELIZ** o teto de `RN-OFF-014` é atingido no meio disso → destravar é decisão **online** ou
exceção pré-autorizada e contada (`RN-OFF-025`); nunca senha de gerente no terminal sem contato.
**EXERCITA** `RN-OFF-007`, `RN-OFF-014`, `RN-OFF-024`, `RN-OFF-025`, `RN-OFF-018`, `RN-OFF-032`,
`RN-OFF-033`.

## 5. Lacunas

`011` aberta em 2026-08-22; `015` e `016` em 2026-08-23; `017` em 2026-08-23, por `AUT-14`.
`LACUNA-OFF-001` a `010` estão em `operacao-offline-e-sincronizacao.md` §8; `012` e `014` no irmão;
`013` em `offline-grandezas-e-orcamento.md`.

- **`LACUNA-OFF-011`** — a **duração** da validade do papel retido no terminal (`RN-OFF-024`), em
  unidade de tempo de operação (minutos de operação sem contato? um turno?). **O compromisso mudou em
  2026-08-23:** com `RN-OFF-032`, encurtá-la **não** para mais o balcão — o que ela custa é só o alcance
  **sensível** (sangria, gaveta fora de venda, desconto acima do limite, assinatura fora do fluxo). As
  duas dores continuam opostas, mas agora são comparáveis: curto demais obriga a reconectar para a
  exceção; longo demais mantém autoridade de quem já não a tem. **Não escrevo o número.** **Dono:**
  humano, com `performance` para medir o custo no caminho crítico. Unidade declarada; valor não.
- **`LACUNA-OFF-015`** — o **mecanismo** de prova de identidade e, por consequência, **o que** o meio de
  identificação retido contém (`RN-OFF-033`). O requisito é de produto e está escrito; o mecanismo é o
  eixo E2 de **D-03**, ABERTA, e não o presumo. **Dono:** humano para o mecanismo (D-03), com gate de
  `seguranca` antes de qualquer construção que retenha o conjunto — mesma ordem de `LACUNA-OFF-012`.
- **`LACUNA-OFF-016`** — com que **frequência** o terminal reconcilia o conjunto de meios de identificação
  do estabelecimento, e qual o **tamanho máximo** dele (`RN-OFF-033`c/d). É a janela em que um operador
  desligado continua identificável naquele terminal — o número que substitui a validade da autoridade
  como coisa a apertar. **Dono:** humano para a janela, `performance` para o custo, com medida.
  Unidade declarada; valor não.
- **`LACUNA-OFF-017`** — **por quanto tempo sem contato a habilitação a vender do terminal continua
  valendo**, e **com quanta antecedência** o operador é avisado de que ela vai vencer (`RN-OFF-032`i). A
  grandeza é **tempo sem contato** (dias de operação? um ciclo de fechamento?) mais **tempo de
  antecedência**; valor em aberto. **A tensão, que é o que o humano decide:** curto demais para de vender
  quem opera dias com link ruim, e aí a regra escrita para não parar o caixa passa a pará-lo por decurso
  de prazo (contra `PN-01`); longo demais deixa um terminal furtado e mantido offline abrindo sessão,
  concluindo venda e entregando via em nome do emitente por todo o intervalo (contra `C-09` e o
  tratamento de comprometimento de `RN-EMI-038`). **Não é a mesma grandeza de `LACUNA-OFF-011`**, e nem
  da mesma ordem: lá o evento contido é revogação de **pessoa**, frequente e prevista; aqui é perda de
  **dispositivo**, rara e notada. **Dono:** humano, com `seguranca` (o alvo é o dispositivo em mãos
  erradas) e `performance` só para o custo do aviso. Unidade declarada; valor não.

**Perguntas para o humano, uma linha cada:** (1) quanto tempo vale o papel retido no terminal, sabendo que
agora isso custa só o alcance sensível e não o balcão (`RN-OFF-032`)? (2) existe exceção offline para
passar do teto — e, se existe, de que tamanho e publicada por quem? (3) qual a janela de reconciliação do
conjunto de meios de identificação (`LACUNA-OFF-016`), que é o prazo real de "o desligado para de
operar"? (4) por quanto tempo sem contato o terminal continua habilitado a vender, e com quanta
antecedência ele avisa (`LACUNA-OFF-017`)?

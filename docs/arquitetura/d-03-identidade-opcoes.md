# Dossiê de decisão — D-03: estratégia de auth e identidade (por cliente vs global)

> **Não é decisão.** É a decisão **montada** para o humano tomar. `CLAUDE.md` §8 continua com D-03
> **ABERTA** até ele dizer o contrário, e quem edita aquela tabela é o thread principal. Datado:
> **2026-08-23**.
>
> **Nenhuma fonte externa foi aberta e nenhum provedor, biblioteca, protocolo ou padrão de mercado é
> afirmado aqui.** D-01 (stack) está ABERTA, então este dossiê é **contrato e fluxo**, não mecanismo:
> onde o sujeito mora, como o tenant chega, o que quebra sem rede. Onde uma opção só faz sentido com
> uma stack específica, isso está declarado como acoplamento, não escondido como detalhe.
>
> **Nenhum número.** Prazo, validade, tamanho de cache e cardinalidade aparecem como grandeza com
> unidade, nunca com valor. Ordem de grandeza, quando aparece, vem rotulada `ESTIMATIVA` com a conta
> à vista. Prefixo `LACUNA-IDE-` é local deste dossiê e não pertence à numeração de `docs/produto/**`.

## A resposta direta

**D-03 não é uma decisão. São três, e elas são ortogonais.** Tratá-las como uma é o que mantém a
decisão aberta desde o dia 0: cada tentativa de responder "por cliente ou global?" colide com uma
pergunta que pertence a outro eixo, e a conversa recomeça.

| Eixo | A pergunta | Estado |
|---|---|---|
| **E1 — residência** | onde mora o **sujeito** (o operador) e o verificador da credencial dele | **é o que este dossiê monta** (§3) |
| **E2 — prova** | como se prova que a pessoa é ela (senha, PIN, crachá, biometria, provedor do cliente) | **em aberto, com uma eliminação já feita** (§2.2) |
| **E3 — chegada do tenant** | de onde o servidor tira o cliente (tenant) da requisição | **quase decidido pela regra que já existe** (§2.1) |

E há uma quarta coisa, que não é eixo e **era** o achado central deste dossiê: a validade da
autoridade retida do `cashier` era, na prática, o comprimento máximo de um turno offline. Foi uma
colisão entre regras aprovadas que D-03 **expôs** e que `produto` **fechou** em 2026-08-23, com
`RN-OFF-032` e `RN-OFF-033`. Ela **não bloqueia mais nenhuma opção**; o que restou dela para D-03 é
menor, é outro, e está em §5.

---

## 1. Os requisitos que decidem

Esta seção é o filtro. Ela vale mais que as opções: é contra ela que §3 é avaliada. Cada linha é
regra já aprovada, não desejo deste documento.

| # | Requisito | Origem | O que ele elimina |
|---|---|---|---|
| R-1 | tenant é resolvido **uma vez, na borda**, a partir da identidade autenticada — nunca de `body`, `query`, header livre ou path editável | `.claude/rules/backend.md:11` | tenant no path, no subdomínio, em header, em cookie editável |
| R-2 | nenhuma consulta cruza schema de cliente; **nenhuma tabela de cliente vive no `platform`, e vice-versa** | `.claude/rules/dados.md` §1 | diretório de usuários de clientes no `platform` **sem** enfrentar esta cláusula de frente |
| R-3 | papel tem **dois** níveis de escopo (cliente, estabelecimento), e a autorização é avaliada no escopo do **objeto**, nunca no declarado por quem pede | `docs/produto/papeis-e-permissoes.md:73` | identidade cujo escopo efetivo é "o cliente inteiro" para papel de estabelecimento |
| R-4 | **atribuição** (pessoa × papel × escopo) é **autoridade**, não artefato publicado: sem versão, sem vigência, revalidada na reconexão | `docs/produto/papeis-atribuicao-e-delegacao.md:48` | atribuição distribuída como dado publicado com vigência longa |
| R-5 | autoridade retida tem **validade declarada**; vencida, operação sensível recusa; **nenhuma renovação offline** | `docs/produto/fila-local-conteudo-e-repouso.md:111` | sessão local perpétua; "reautenticar" sem contato como caminho prometido |
| R-6 | a identidade da operação é **cunhada no terminal**, offline, antes de existir servidor | `docs/produto/operacao-offline-e-sincronizacao.md:185` | autoria atribuída na chegada ao servidor |
| R-7 | abrir sessão de caixa é **integral** nos três domínios de falha, e a venda em espécie também | `docs/produto/nucleo-caixa-e-turno.md:26` | qualquer opção que exija contato para o primeiro ato do dia |
| R-8 | `provider_support` é identidade **nossa** dentro do cliente, por **concessão declarada**, uma por cliente, **nunca** alcançando mais de um cliente, **nunca** autoridade retida | `docs/produto/papeis-atribuicao-e-delegacao.md:208` | uma credencial nossa que atravessa N clientes |
| R-9 | contagem que só existe somando clientes vive **fora** do escopo de qualquer cliente, e `provider_support` não a alcança | `docs/produto/fiscal-custodia-e-trilha.md:280` | escopo nosso que é a união dos clientes |
| R-10 | escopo do papel resolvido a partir de identificador que o pedido informa é **incidente**, não erro de campo | `docs/produto/fila-local-conteudo-e-repouso.md:158` | "me devolve a fila do terminal 2" com o id no pedido |
| R-11 | permissão é verificada **no backend** em toda operação sensível; interface burlada não é caminho | `docs/produto/postura-nova-geracao.md:199` | autorização derivada do manifesto SDUI |
| R-12 | filtrar o manifesto por papel **não é autorizar**; e o manifesto **não enumera** o que o papel não alcança | `docs/produto/superficie-por-papel.md:42` | identidade cuja única consequência é compor tela |
| R-13 | a venda não para quando a internet cai | `docs/produto/postura-nova-geracao.md:51` | prova de identidade que exige contato para o ato ordinário |
| R-14 | terminal é dispositivo **vinculado a um estabelecimento**; estabelecimento tem identidade jurídica própria | `docs/produto/glossario.md:30`, `:31` | terminal como periférico anônimo de um cliente |
| R-15 | terminal furtado é evento de **comprometimento**, não de perda | `docs/produto/fiscal-custodia-e-trilha.md:235` | segredo estacionado no terminal sem prazo |

**Duas coisas que R-2 e R-8 fazem juntas, e é o coração de D-03.** R-2 diz que o `platform` não
hospeda tabela de cliente. R-8 diz que existe uma identidade **nossa** que entra em N clientes. Então
o `platform` **tem** que hospedar identidade — a nossa — e **não pode** hospedar a do cliente sem
enfrentar R-2 explicitamente. Qualquer opção que trate "usuário" como uma coisa só está resolvendo
duas populações com um modelo, e é aí que o vazamento nasce.

---

## 2. Os dois eixos que já estão quase resolvidos

### 2.1 E3 — de onde o tenant chega: três portadores lícitos, e só três

R-1 é restritiva ao ponto de quase decidir. Se o tenant não pode vir de nada que o chamador controla,
sobram exatamente três portadores possíveis, e cada opção de §3 escolhe um:

1. **Credencial de dispositivo, emitida no cadastramento do terminal.** O terminal é cadastrado uma
   vez, **online**, para um estabelecimento de um cliente (R-14), e passa a apresentar uma credencial
   própria. O tenant vem do registro de cadastramento no `platform`, não do pedido. O login do humano
   acontece **dentro** de um tenant já resolvido.
2. **Sessão cunhada para um tenant.** A identidade autentica primeiro; o servidor consulta o conjunto
   de atribuições **que ele mesmo conhece** e cunha uma sessão válida para **um** cliente. A sessão
   não é permutável: alcançar outro cliente exige outra sessão. O chamador nunca nomeia o tenant — ele
   escolhe de uma lista que o servidor produziu.
3. **Alça opaca de encaminhamento.** O chamador apresenta uma alça (não um nome de cliente) que o
   servidor resolve em tenant. A alça não é um pedido de tenant: é chave de busca, e alça errada não
   autentica nada.

**Ilícitos, e a razão é a mesma para os quatro:** subdomínio/`Host`, segmento de path, campo de
`body`/`query`, cookie ou header editável. Todos são texto que o chamador escolhe. Nenhum deixa de
ser texto do chamador por convenção de infraestrutura.

**A diferença que importa entre (1)/(3) e (2):** em (1) e (3) **nenhuma requisição carrega tenant**,
então não existe verificação a esquecer. Em (2) toda requisição carrega um tenant **derivado da
sessão**, e o isolamento passa a depender de a sessão nunca ser reaproveitada entre clientes. Os dois
são lícitos sob R-1. Só o primeiro é lícito **por construção**.

### 2.2 E2 — como se prova: a única eliminação que os requisitos já fazem

R-7 e R-13 juntos eliminam, para o `cashier`, **todo mecanismo de prova que exija contato no momento
do ato**. Não é preferência: abrir sessão de caixa é integral em D1, D2 e D3
(`nucleo-caixa-e-turno.md:26`), e o aceite da regra narra o link cortado **desde antes do expediente**.
Um mecanismo que só verifica contra o servidor faz o primeiro cliente-final do dia não ser atendido.

Consequência prática, e ela é o insumo que faltava para as três opções: **o terminal tem que carregar
o meio de verificar a prova de identidade dos operadores do estabelecimento, recebido enquanto havia
contato.** Isso não é autoridade e não viola R-5: saber **quem** está na frente do terminal é
diferente de saber **o que** essa pessoa pode. A autoridade continua sendo retida, com validade, e
continua não renovando offline.

**E isso é uma terceira categoria de coisa retida, que passou a existir em 2026-08-23.** O projeto
tinha duas: **artefato publicado** (versionado, com vigência, congelado no fato) e **autoridade
retida** (com validade, revogada na reconexão) — `papeis-atribuicao-e-delegacao.md:23`. `RN-OFF-033`
(`fila-local-conteudo-e-repouso.md:266`) declara a terceira, o **meio de identificação retido**: não
autoriza nada · é recebido **com contato**, para os operadores daquele estabelecimento, e nunca nasce
no terminal · é confidencial em repouso no piso de `RN-OFF-021` · **reconcilia**, e terminal furtado
trata o conjunto como **comprometido**. `LACUNA-IDE-001` fechada — ver §7.2 para o que sobrou.

**O que E2 não decide, para não haver confusão:** senha, PIN, crachá, biometria ou provedor do
cliente é escolha de mecanismo, é do humano, e as três opções de §3 sobrevivem a todas. O que muda
com E2 é **quanto o terminal furtado entrega** (§4, pergunta 5).

---

## 3. E1 — as três opções de residência

Cada opção declara: como o tenant chega · onde a credencial vive · o que quebra offline · **o que ela
torna impossível depois** — este último é o campo que decide, e o que mais se esquece de escrever.

### 3.1 Opção **A** — Diretório por cliente, terminal como portador do tenant

O operador, o verificador da credencial dele, a atribuição e a delegação vivem **no schema do
cliente**. Não existe lista global de pessoas. O tenant chega pelo portador (1) de §2.1: o terminal
cadastrado. Para superfície sem terminal cadastrado (retaguarda em navegador), o tenant chega por uma
alça opaca — o que é a Opção C aplicada só àquela superfície, e é por isso que A e C não são
adversárias limpas (§3.4).

- **Tenant:** do registro de cadastramento do terminal no `platform`. Nenhuma requisição de operação
  carrega tenant.
- **Credencial:** verificador no schema do cliente; cópia do verificador no terminal, recebida
  online, para o conjunto de operadores **daquele estabelecimento** (§2.2).
- **Offline:** o melhor dos três. O terminal já tem tudo que precisa para identificar quem está na
  frente dele, sem hop nenhum. O buraco é o **primeiro login de um operador naquele terminal**: se
  ele nunca esteve no conjunto recebido, não há verificador. O conjunto é do estabelecimento, não do
  terminal, o que resolve o caso comum (operador novo de um caixa que reveza) e **não** resolve o
  operador contratado durante a queda.
- **O mesmo humano em dois clientes:** duas pessoas, do ponto de vista do sistema. Nada as liga.
  Vazamento entre as duas é **impossível por construção**, não por verificação: não existe objeto que
  as una, então não existe consulta a errar.
- **Torna impossível depois:** (i) entrada única para o humano que atende vários clientes — o contador
  de dois restaurantes tem dois acessos, e nunca uma lista "seus clientes"; (ii) desligar uma pessoa em
  todos os clientes num ato — é um ato por cliente; (iii) qualquer sinal de risco calculado sobre a
  mesma pessoa em clientes diferentes (a mesma credencial reprovando em dois clientes na mesma hora é
  invisível); (iv) auditoria **nossa** do nosso próprio acesso sem uma trilha de concessões do lado do
  `platform` (§5). Nenhuma das quatro é recuperável sem introduzir um vínculo entre schemas — isto é,
  sem migrar para C.

### 3.2 Opção **B** — Diretório central no `platform`, sessão cunhada por cliente

Uma população única de identidades no `platform` (a pessoa, o verificador, o estado do segundo
fator). A atribuição — pessoa × papel × escopo — continua no schema do cliente, porque ela é
autoridade sobre objetos do cliente (R-3, R-4). O tenant chega pelo portador (2): sessão cunhada para
um cliente, não permutável.

- **Tenant:** da sessão, que o servidor cunhou depois de consultar as atribuições que **ele** conhece.
  Toda requisição carrega um tenant derivado.
- **Credencial:** verificador no `platform`; cópia no terminal, como em A.
- **Offline:** igual a A **no ato**, porque a verificação offline é local nos dois casos. Pior **na
  origem**: o conjunto de verificadores que o terminal recebe passa a ser projeção de uma tabela que
  contém pessoas de todos os clientes, e essa projeção é uma consulta filtrada por tenant. É o único
  lugar do sistema em que "esqueci o filtro" vaza pessoa de outro cliente.
- **O mesmo humano em dois clientes:** nativamente, uma pessoa só. O que impede o vazamento é a
  cunhagem: a sessão vale para **um** cliente e não é reaproveitada. É uma proteção correta e é uma
  **política**, não uma estrutura — depende de nunca existir um caminho que leia tenant de outro lugar.
- **Ganho real, e não é pequeno:** revogar a pessoa é **um** ato com efeito em todos os clientes. É o
  único dos três em que o "demitido às 14h" é fechado num lugar só.
- **Torna impossível depois:** (i) afirmar isolamento **por construção** — o argumento de auditoria
  passa a ser "verificamos em todo lugar" em vez de "não há o que verificar", e essa troca é
  irreversível: uma vez que a tabela existe, ela é lida por caminhos novos que ninguém revisa;
  (ii) desligar um cliente sem tocar em dado compartilhado — as pessoas dele ficam na população
  comum, e "apagar" passa a ser exclusão de linhas em tabela viva, não descomissionamento de schema;
  (iii) a promessa de que o `platform` não hospeda dado de cliente (R-2) — e nome, contato e
  verificador de credencial de funcionário **são** dado de cliente.

### 3.3 Opção **C** — Verdade no cliente, índice de encaminhamento no `platform`

A verdade é a de A: sujeito, verificador, atribuição e delegação no schema do cliente. O `platform`
ganha **um** artefato novo, e só um: um índice que mapeia **alça opaca → cliente**, sem nome, sem
contato, sem verificador, sem papel. Portador (3) de §2.1.

- **Tenant:** o chamador apresenta a alça; o servidor a resolve. O chamador nunca nomeia cliente.
- **Credencial:** exatamente como em A. O índice **não** participa da prova — ele só encaminha.
- **Offline:** idêntico a A, porque o índice só serve para a primeira chegada de quem não tem terminal
  cadastrado. Terminal cadastrado não usa índice.
- **O mesmo humano em dois clientes:** **uma alça por (pessoa, cliente)**. Duas alças, dois acessos,
  nenhuma requisição carregando tenant. A tentação é alça única resolvendo em vários clientes — e ela
  reintroduz a escolha de tenant do portador (2), ou seja, o problema de B em miniatura. Se a alça
  única for desejada, isso é B com outro nome, e vale escolher B de frente.
- **O custo próprio, e ele é real:** o índice é uma tabela no `platform` cujas linhas correspondem a
  pessoas de clientes. Ela **não** contém dado de cliente, mas contém **a existência** de um vínculo —
  e responder "esta alça existe?" é um oráculo que revela se alguém é cliente nosso. Resposta
  constante é obrigatória, e isso é requisito, não zelo.
- **Torna impossível depois:** (i) revogação de uma pessoa em todos os clientes num ato — como em A;
  (ii) usar o índice para qualquer coisa além de encaminhar — no momento em que ele ganha um campo
  (nome, último acesso, contagem de falha), ele virou B sem que ninguém tenha decidido migrar. Este é
  o risco de erosão, e ele é gradual: cada campo novo parece inofensivo.

### 3.4 A variante recusada, e a recusa tem as quatro partes

**Recusada: diretório central no `platform` com cópia mantida no schema do cliente** ("C2").

1. **Necessidade preservada:** ler identidade de operador dentro do schema do cliente, sem hop e sem
   consulta cruzada, inclusive para compor trilha e relatório do próprio cliente.
2. **Mecanismo recusado, e por que é ruim:** duas verdades para o mesmo fato, sincronizadas por
   processo. Elas **divergem em silêncio** — é exatamente o defeito já nomeado para o catálogo de
   regra fiscal em D-05, e o sintoma é o pior possível: a trilha do cliente diz um autor, o diretório
   diz outro, e ninguém sabe qual estava valendo no instante do ato.
3. **Mecanismo novo:** uma verdade só, e o que o schema do cliente guarda para trilha é o **fato
   congelado** — quem, qual atribuição, qual instante — no padrão que o projeto já usa para artefato
   publicado congelado no fato (`papeis-atribuicao-e-delegacao.md:23`).
4. **Por que é melhor, e como se prova:** o fato congelado é imutável, então não há o que divergir;
   e a prova é direta — mude o nome ou o papel da pessoa no diretório e leia uma venda antiga: o autor
   e a autoridade registrados **não mudam**, e não existe segundo lugar a conferir. Com cópia
   sincronizada, o mesmo teste produz dois resultados dependendo de qual lado se lê.

---

## 4. As sete perguntas, opção por opção

| | **A — por cliente** | **B — central no `platform`** | **C — verdade no cliente + índice** |
|---|---|---|---|
| **1. Onde vive o usuário; quem é a verdade** | só no schema do cliente; ele é a verdade | sujeito no `platform` (verdade), atribuição no cliente (verdade da autoridade) — **duas verdades, de coisas diferentes**, e é isso que a torna aceitável | sujeito e autoridade no cliente (verdade); `platform` guarda **encaminhamento**, que não é verdade sobre ninguém |
| **2. Mesmo humano em dois clientes** | sim, como duas pessoas sem vínculo. **Impedimento: não há objeto que as una** | sim, como uma pessoa. **Impedimento: sessão cunhada para um cliente e não permutável** — proteção por política | sim, duas alças. **Impedimento: nenhuma requisição carrega tenant** — proteção por construção |
| **3. Primeiro login offline num terminal** | possível se o operador estava no conjunto de verificadores do **estabelecimento** recebido online; impossível para quem foi contratado durante a queda | igual a A no ato; a projeção do conjunto é filtrada por tenant, e é o ponto de vazamento único | igual a A |
| **4. Demitido 14h, reconecta 19h** | revogar em **cada** cliente. Janela = validade da autoridade retida, **sem número** (`LACUNA-OFF-011`) | revogar **uma vez**, efeito em todos. Mesma janela | igual a A |
| **5. Segredo e terminal furtado** | o terminal carrega verificadores dos operadores **daquele estabelecimento** — dano contido no estabelecimento | verificadores da mesma população global, **projetados**; se a projeção estiver errada, o dano cruza cliente | igual a A; o índice não vai para o terminal |
| **6. Migration no cliente 2 e no 200** | identidade é tabela de núcleo: a mesma migration roda N vezes, sem nada novo no 2 nem no 200 | tabelas de identidade no `platform`: **uma** migration, e ela cresce em linhas com todos os clientes — volta a tenancy por linha na tabela que guarda tudo | como A, mais **uma** migration de `platform` para o índice |
| **7. Provisionar e desligar cliente** | provisionar = rodar migrations + criar o primeiro `owner`, ato de escrita em **um** schema. Desligar = schema inerte, credenciais mortas com ele | provisionar = criar registro + primeira atribuição (mais barato). Desligar = **excluir linhas** de tabela viva, e "esqueci uma" é acesso sobrevivente | como A, mais inserir/retirar alça |

**Sobre o bootstrap, que vale para os três e ninguém escreve:** quem cria o **primeiro** `owner` de um
cliente novo? Nenhuma regra existente responde. Não é `owner` (ele não existe ainda) e não pode ser
`provider_support`, porque R-8 o proíbe de operação de negócio e `RN-NUC-023` põe atribuir papel no
piso de meta-autoridade que configuração não alcança. Sobra uma operação de plataforma **nossa**, e
ela não tem papel declarado em artefato nenhum — é a mesma lacuna já aberta em `LACUNA-NUC-011`.
`LACUNA-IDE-002`.

---

## 5. O que era o achado central, e o que sobrou dele para D-03

**Corrigido em 2026-08-23, e a correção é de outro agent.** Este dossiê afirmava que a validade da
autoridade retida do `cashier` era o comprimento máximo de um turno offline, porque `RN-OFF-024`
(`fila-local-conteudo-e-repouso.md:111`) recusa só **operação sensível** enquanto
`papeis-e-permissoes.md:114` e `RN-NUC-009` (`nucleo-caixa-e-turno.md:26`) tratavam a autoridade retida
do papel-piso como **precondição de vender**. A colisão era real. Ela **não é mais aberta**:
`RN-OFF-032` (`fila-local-conteudo-e-repouso.md:215`) separa **identificar o autor** de **autorizar o
ato** e apoia o ato ordinário em duas coisas que não são autoridade de pessoa — (i) o terminal
**habilitado a vender por aquele estabelecimento**, fato estabelecido com contato e retido, e (ii) o
operador **identificado** (`RN-OFF-033`). Encurtar a validade passou a custar só o alcance sensível.

**E a versão anterior desta seção errava numa frase, que fica corrigida aqui.** Ela dizia que na Opção
**B** "o único sustentáculo do ato ordinário é a autoridade da pessoa", ligando isso ao portador do
tenant. **Isso conflacionava dois eixos.** Portar o **tenant da requisição** é E3; **reter a
habilitação de vender** é um fato do terminal que R-14 exige em **qualquer** opção — e a própria §3.2
já supunha o terminal vinculado a um estabelecimento quando descreveu o cache de verificadores. Logo:

**`RN-OFF-032` é satisfeita nas três opções, e nada em D-03 fica bloqueado por ela.** Em B o terminal
continua cadastrado para um estabelecimento; o que muda é só de onde vem o tenant da requisição.

**O que sobrou para D-03, e é menor:** não é (i), é a **derivação de (ii)**. `RN-OFF-033`(b) e (d)
exigem que o conjunto de meios de identificação seja projetado para o terminal **por
estabelecimento** e **reconciliado**. Em A e C essa projeção nasce dentro de um schema só. Em B ela é
uma consulta filtrada por tenant sobre uma população global — o mesmo ponto único de vazamento que
§3.2 já nomeia, agora com uma consequência a mais: filtro errado não vaza só "quem existe", vaza o
**meio de identificar** pessoas de outro cliente para um dispositivo físico de terceiro. É diferença
de grau na mesma linha de §3.2, não critério novo, e **não** altera a recomendação.

**Os dois números que essa parte agora depende** são de `produto`/`performance`, não meus:
`LACUNA-OFF-015` (mecanismo de prova — é o meu eixo E2) e `LACUNA-OFF-016` (frequência de
reconciliação e tamanho do conjunto — substitui a minha `LACUNA-IDE-004`).

---

## 6. `provider_support` — o caso que mais separa as opções

R-8 e R-9 são o teste mais duro, e cada opção falha ou passa por um motivo diferente.

- **Em A e C:** não existe identidade nossa global tocando cliente. Cada concessão cria um sujeito
  **local**, no schema daquele cliente, com prazo, escopo e trilha visível ao cliente. Uma concessão
  não alcança dois clientes porque **não há como** — o sujeito é local. R-8 é cumprido por
  construção. O custo aparece do nosso lado: **auditar o nosso próprio time** exige uma trilha de
  concessões no `platform` (quem nós concedemos, a que cliente, por quanto tempo, com que motivo).
  Isso é fato **nosso**, não do cliente, então não fere R-2 — e é, na verdade, a resposta correta para
  `LACUNA-NUC-011`, que hoje não tem nenhuma.
- **Em B:** nossos engenheiros são identidades na mesma população dos operadores dos clientes, com
  atribuições em N clientes. A contenção existe (concessão por cliente, prazo, escopo), e ela é
  **política**. É exatamente a forma que o invariante de isolamento proíbe, mantida sob controle por
  disciplina em vez de por estrutura. Isso não elimina B, mas é o item pelo qual B tem que ser
  aceito **de olhos abertos**.
- **Nas três, um detalhe que não pode ser esquecido:** `provider_support` **nunca** é autoridade
  retida (`papeis-atribuicao-e-delegacao.md` §6). Logo, o conjunto de verificadores que o terminal
  recebe (§2.2) **não inclui** o nosso pessoal. Se incluir, o papel deixa de cumprir a cláusula que o
  torna aceitável — ato nosso invisível ao cliente até a reconexão. **Fechado em 2026-08-23:**
  `RN-OFF-033` diz isso com essas palavras (`LACUNA-IDE-003`).

---

## 7. O que nenhuma das três resolve

1. **Operador contratado durante a queda** não opera, em nenhuma opção. Isso é correto e deve ser
   declarado na habilitação, não descoberto no pico (a mesma postura de `RN-OFF-025`, infeliz).
2. **O meio de identificação retido agora tem regra** (`RN-OFF-033`), que fixa confidencialidade em
   repouso no piso de `RN-OFF-021` e manda o terminal furtado tratar o conjunto como comprometido. O
   resíduo é de redação e é de `produto`: o cenário `C-09` (`fila-local-conteudo-e-repouso.md:201`)
   ainda enumera fila, faixa e capacidade de assinar, e **não** menciona o conjunto retido — quem lê
   só o cenário não vê a nova exposição. Não muda avaliação de opção nenhuma; muda o que um construtor
   entende ao ler o caso concreto.
3. **Nenhum número.** Validade da autoridade retida (`LACUNA-OFF-011`), prazo de concessão de
   `provider_support` (`LACUNA-NUC-010`), reconciliação e tamanho do conjunto de identificação
   (`LACUNA-OFF-016`). Sem eles, toda afirmação de exposição é "limitada por um prazo que não existe".
4. **O formato do identificador do sujeito é D-04**, não D-03. `RN-OFF-013` já exige identidade
   cunhada no terminal para a operação; o identificador do **operador** tem a mesma pergunta e a mesma
   dona.

---

## 8. RECOMENDAÇÃO — e é recomendação, não decisão

**Recomendo a Opção C** — verdade no cliente, índice de encaminhamento mínimo no `platform`, terminal
como portador do tenant para toda superfície de operação.

**O critério que a sustenta, e é um só:** entre duas opções que cumprem os requisitos, escolher a que
transforma isolamento de **verificação** em isolamento de **construção**. A e C fazem isso; B não.
Entre A e C, C paga uma tabela de encaminhamento no `platform` — sem nome, sem verificador, sem papel
— e compra a única coisa que falta a A: um caminho lícito de primeira chegada para a superfície que
**não** tem terminal cadastrado (retaguarda em navegador, que o dossiê de D-01/D-02 já concluiu ser a
classe maior). A é a mesma decisão sem esse caminho, e ela vai precisar dele.

**O que eu recomendo recusar explicitamente, para não voltar por baixo:** alça única resolvendo em
vários clientes. Ela parece uma conveniência de C e é a adoção de B sem decisão registrada.

**Onde B ganharia, honestamente:** revogação de pessoa num ato só, com efeito em todos os clientes.
Se o negócio tiver como caso comum o humano que opera em muitos clientes — rede grande com
administração central, ou grupo com um quadro de pessoal compartilhado —, B deixa de ser o pior e
passa a ser o único que atende sem trabalho manual multiplicado por cliente.

### A pergunta que transforma a recomendação em decisão

**Uma, e é de negócio, não técnica:** *o humano que opera em mais de um cliente é caso de borda ou é
caso de venda?*

- **Borda** (contador ocasional, nossa equipe de suporte) → **C**, e o custo de "um acesso por
  cliente" é irrelevante porque acontece pouco.
- **Caso de venda** (vamos vender a rede com administração central, o grupo de N estabelecimentos sob
  quadros compartilhados, ou o escritório de contabilidade como canal) → **B**, assumindo por escrito
  que o isolamento passa a ser garantido por verificação, e que `provider_support` fica contido por
  política. E aí a auditoria de `seguranca` sobre a cunhagem de sessão deixa de ser opcional.

**As duas travas de `produto` que esta seção citava caíram em 2026-08-23** (`RN-OFF-032` e
`RN-OFF-033`), e a recomendação **não muda** por causa disso: ela nunca se apoiou nelas. A trava que
resta é a única que sempre foi de outro dono — o **gate 3**, a auditoria de autorização, que ainda não
executou. Escolher D-03 antes dela é aplicar arquitetura de identidade sem auditoria de identidade.

---

## LACUNAS

- **`LACUNA-IDE-001` — FECHADA em 2026-08-23** por `RN-OFF-032` + `RN-OFF-033`
  (`fila-local-conteudo-e-repouso.md:215`, `:266`). Resíduo, de redação e de `produto`: `C-09` não
  menciona o conjunto retido (§7.2).
- **`LACUNA-IDE-002`** — quem cria o **primeiro `owner`** de um cliente novo. Não é `owner`, não pode
  ser `provider_support`, e a operação de plataforma nossa não tem papel declarado. Junta-se a
  `LACUNA-NUC-011`. **Dono:** humano.
- **`LACUNA-IDE-003` — FECHADA em 2026-08-23:** `RN-OFF-033` diz, literalmente, que o conjunto retido
  **nunca** inclui `provider_support`.
- **`LACUNA-IDE-004` — SUBSTITUÍDA por `LACUNA-OFF-016`**, que é a mesma grandeza com dono declarado
  (frequência de reconciliação e tamanho do conjunto).
- **`LACUNA-IDE-005`** — segundo fator: existe? para quais papéis? e como ele se comporta no terminal
  sem contato (onde, por R-5, nada renova)? **Dono:** humano; é eixo E2 e não altera §3. É a metade
  de `LACUNA-OFF-015` que fala de mecanismo — a mesma pergunta, vista do outro lado.

## PERGUNTAS: para humano

1. **A pergunta de §8:** o humano que opera em mais de um cliente é caso de borda ou caso de venda?
2. Existe requisito de **provedor de identidade do próprio cliente** (rede grande que exige entrar com
   a conta corporativa dela)? Se sim, ele vale para `owner`/`fiscal_officer` **e** para `cashier`? A
   segunda metade colide com §2.2 e precisa de resposta antes de virar promessa comercial.
3. `LACUNA-IDE-002` — do nosso lado, quem provisiona cliente e cria o primeiro `owner`, e quem audita
   isso?

## PERGUNTAS: para produto

**As duas perguntas anteriores foram respondidas em 2026-08-23** por `RN-OFF-032` (o ato ordinário se
apoia na habilitação do terminal mais a identificação do operador, não em autoridade retida) e
`RN-OFF-033` (o meio de identificação retido é **terceira** categoria, não atributo das duas
existentes). Sobra **uma**, e é pequena:

1. `C-09` (`fila-local-conteudo-e-repouso.md:201`) não menciona o conjunto retido de identificação
   entre o que o terminal furtado compromete, embora `RN-OFF-033`(d) o determine. O cenário é a peça
   que um construtor lê; vale acrescentar a linha.

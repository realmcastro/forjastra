# Estados e interação — núcleo

Dono: agent `ui`. Escopo: **núcleo**, todo cliente, todo módulo, todo espaço.
Criado 2026-08-22 (T-0002, passo 4). Numeração de seção **global aos dois arquivos desta camada**
(mapa abaixo); lacunas prefixadas `S-` para não colidir com `L-` (tokens) nem `G-` (grade).

Entrada desta camada: `tokens.md` (leis do §10), `tokens-cor.md` (§5, os pares medidos),
`tokens-forma-e-texto.md` (§8 foco e camada, §9 duração), `grade-e-espacos.md` (§4 espaços, §5
densidade, §6 zonas e as quatro garantias de `PN-06`, §7 o caminho sem toque).

Contrato de produto consumido, sem reescrever nada dele: `operacao-offline-e-sincronizacao.md`
(`RN-OFF-001`…`RN-OFF-020`), `offline-grandezas-e-orcamento.md` (`RN-OFF-028`…`RN-OFF-030`),
`postura-nova-geracao.md` (`PN-01`, `PN-05`, `PN-06`, `PN-07`, `PN-13`, `PN-15`, `PN-16`, `PN-17`,
`PN-18`), `papeis-e-permissoes.md` (`RN-NUC-018`), `papeis-atribuicao-e-delegacao.md` (escalonamento),
`nucleo-publicacao-e-texto.md` (`RN-NUC-016`).

Este arquivo define **estado visível** e **comportamento de interação**. Ele **não** define mecanismo
(como o estado chega ao bloco, como a tecla é capturada, como o texto é resolvido) — isso é **D-02** e
está fora daqui. Ele não contém número novo: toda grandeza que pediria um valor é lacuna nomeada (§10).

**Partido em dois arquivos em 2026-08-22, no mesmo passo.** O arquivo único chegou a 413 linhas e o
teto é 400. O **eixo do corte é o sujeito**: o que a superfície **mostra** (estado) fica aqui; como o
operador **atravessa** a superfície (foco, teclado, leitor, espaço) vai para
[`foco-teclado-e-leitor.md`](foco-teclado-e-leitor.md). A numeração de seção é **global aos dois** e
**não foi renumerada** — citação a `estados-e-interacao.md §N` resolve por este mapa.

| § | Conteúdo | Arquivo |
|---|---|---|
| 1 | O que é estado nesta camada, e quem o decide | **este arquivo** |
| 2 | Canais de sinalização — inventário fechado | **este arquivo** |
| 3 | O vocabulário fechado de estado | **este arquivo** |
| 4 | Ausência por autorização — e por que ela não é estado | **este arquivo** |
| 5 | Rede: três domínios, três apresentações | **este arquivo** |
| 6 | Foco: ordem, movimento e recuperação | [`foco-teclado-e-leitor.md`](foco-teclado-e-leitor.md) |
| 7 | O leitor de código | [`foco-teclado-e-leitor.md`](foco-teclado-e-leitor.md) |
| 8 | Estado × espaço | [`foco-teclado-e-leitor.md`](foco-teclado-e-leitor.md) |
| 9 | Leis desta camada — valem para os **dois** arquivos | **este arquivo** |
| 10 | Lacunas | **este arquivo** |

## 1. O que é estado nesta camada, e quem o decide

Estado é **o que a superfície mostra quando não está mostrando o conteúdo normal**. Ele é sempre
**recebido**, nunca derivado: cálculo, permissão efetiva, disponibilidade e "o que pode ser prometido
ao cliente-final" vêm do backend (`PN-13`, `RN-OFF-018`). A UI **exibe e coleta**.

Três consequências que valem como fronteira:

1. **A UI não avalia permissão.** Ela não recebe conjunto de permissões para decidir o que desenhar;
   recebe o manifesto já composto para aquele papel (§4). Esconder por conta própria seria autorização
   no cliente — e autorização no cliente é decoração.
2. **A UI não classifica operação.** Qual desfecho cabe a cada operação em cada domínio de falha é
   `RN-OFF-002` e a tabela da §4 daquele arquivo. A UI mapeia **desfecho → apresentação** (§5), e nada
   mais.
3. **Estado normal não é estado.** Não existe id para "tudo certo": a ausência de estado é o conteúdo.
   O único estado permanente do sistema é a faixa de conexão e pendência (§5), porque `PN-15` exige que
   o terminal não fique mudo.

O vocabulário de estado é **fechado** (§3). Estado que não está aqui não existe; nó de manifesto que
pede estado desconhecido é descartado como qualquer nó inválido (`ui.md` §1), e a região cai no
conteúdo ou no piso — nunca em erro de tela.

## 2. Canais de sinalização — inventário fechado

Lei 4 de `tokens.md` §10: **estado nunca é sinalizado só por cor**. Isto não é zelo — `danger` e
`success` deste sistema estão em luminâncias próximas (`tokens-cor.md` §2) e, em escala de cinza, são
quase o mesmo valor. Todo estado desta camada declara **dois ou mais** canais desta lista.

| Canal | O que é | De onde vem | Limite |
|---|---|---|---|
| **posição** | zona fixa e ordinal de slot fixo | `grade-e-espacos.md` §6.2, §6.3 | estado **nunca** cria slot novo em `zone.anchor-bottom` |
| **forma** | `radius.full` = estado; `radius.100` = acionável | `tokens-forma-e-texto.md` §8 | **indisponível para controle**: o raio de um controle é do papel dele, não do estado |
| **glifo** | silhueta distinta, reconhecível sem cor e sem texto | `tokens.md` §10.4 | nenhum glifo serve dois estados; o inventário é **S-03** |
| **texto do produto** | o que houve **e** a próxima ação, em linguagem de operação | `PN-17`, `ui.md` §3 | vem do catálogo de mensagens; código sozinho é proibido |
| **texto atribuído** | texto de terceiro preservado literal, com origem e instante | `RN-NUC-016`, `RN-OFF-027` | opaco: nunca interpretado como marcação ou instrução, nunca a única informação |
| **degrau de valor** | perda do acento, tinta de fundo | `tokens-cor.md` §5 | lê em escala de cinza, mas sozinho não basta |
| **contagem** | número em algarismo tabular | `tokens-forma-e-texto.md` §6 | é **estado mantido**, não consulta por apresentação (`RN-OFF-030` c) |
| **instante** | o instante do fato ou do dado | `RN-OFF-005`, `RN-OFF-019` | **obrigatório** em `pending`, `stale` e `error` |

**Não são canais, e usá-los como tal é defeito:**

- **movimento** — animação nunca porta informação (`tokens-forma-e-texto.md` §9), e desligar movimento
  não pode remover informação;
- **`hover`** — `tokens.md` §10.6;
- **`stroke.300` e contorno duplo** — reservados ao indicador de foco e a nada mais
  (`tokens-forma-e-texto.md` §8.1). Nenhum estado pode adotá-los;
- **som** — não existe token de som neste sistema (**S-01**). Onde o texto abaixo pede sinal audível,
  ele pede uma lacuna, não um comportamento aprovado.

**Herança inseparável do passo 2b:** o indicador de foco é um **par** de contornos — claro contíguo ao
alvo (2), escuro por fora (`stroke.300`). Desenhar só o escuro faz o sistema reprovar 3:1 sobre
`danger` (2,89 medido) **sem nada acusar**. Nenhum estado deste arquivo altera, encolhe, esconde ou
substitui qualquer um dos dois membros — inclusive `unavailable` (§3.7) e a camada de confirmação
(§3.6).

## 3. O vocabulário fechado de estado

| Estado | id | O que aconteceu | Canais (≥2, sem cor sozinha) | O que o operador **ainda pode fazer** |
|---|---|---|---|---|
| vazio | `state.empty` | não há o que mostrar, e isso é normal | posição + texto (instrução da próxima ação) + glifo neutro | tudo; é o estado inicial do caminho crítico |
| degradado no conteúdo | `state.stale` | o conteúdo não veio da rede: veio de cache ou do piso embutido | posição + instante + glifo + degrau de valor | ler, e saber que é antigo; operar onde a regra permite |
| carregando | `state.loading` | aguardo síncrono, **só fora** do caminho crítico | posição + texto + glifo | sair da região, seguir no caminho crítico — nunca fica preso |
| pendente | `state.pending` | fato **concluído** aguardando convergência (`RN-OFF-004`) | contagem + instante + forma (`radius.full`) + `attention` | seguir vendendo; dizer quantas há (`PN-15`); nunca resolver conflito (`RN-OFF-018`) |
| recusa/erro | `state.error` | uma operação **tentada** não aconteceu | posição (na região que a iniciou) + texto (o que houve + próxima ação) + glifo + `danger` | o caminho alternativo que o texto nomeia; o resto da tela continua vivo |
| confirmando irreversível | `state.confirming-irreversible` | uma ação que move valor ou cria fato novo pede confirmação | camada transitória + texto de consequência + posição fixa dos dois desfechos + glifo | confirmar, cancelar — **e nada mais**, por teclado, sem toque |
| indisponível | `state.unavailable` | o recurso **existe** e está temporariamente fora de alcance | perda do acento + ausência de limite desenhado + texto do motivo + glifo | **focar e ler o motivo**; acionar devolve o motivo, nunca silêncio |
| sem permissão | **não existe** | — | — | §4 |

`state.stale` não estava no pedido e eu o acrescentei: `ui.md` §1 exige degradação **rede → cache →
piso**, e degradação sem face visível é indistinguível de dado vivo. A necessidade é de `PN-15` (o
terminal não fica mudo) aplicada ao conteúdo, não só à conexão: um operador que promete a partir de
dado de cache sem saber que é de cache promete errado.

### 3.1 `state.empty` — dois vazios, e confundi-los é defeito

**Vazio de dado** é normal e instrui: a lista de itens de uma venda começa vazia, e o que ela mostra é
a próxima ação, não um alerta. Nada de `danger`, nada de glifo de alerta, nenhuma cor funcional.

**Vazio por degradação** é `state.stale` com zero linhas — e ele **declara o instante** e a origem.
Um vazio que na verdade é "não consegui" apresentado como "não tem" é o defeito mais caro desta seção:
faz o operador afirmar ao cliente-final que algo não existe.

Vazio **preserva as dimensões da região**. Slot vazio não colapsa (`grade-e-espacos.md` §6.3.1) e a
zona de ação não se move por causa dele.

### 3.2 `state.loading` — o estado que quase não existe

Reconhecimento de entrada **aparece**, não carrega: item lançado, tecla e código lido têm
`duration.000` (`tokens-forma-e-texto.md` §9). Logo:

1. `state.loading` **não existe no caminho crítico**. Lançar item, compor valor e concluir venda são
   `integral` nos três domínios (§4 daquele arquivo, `RN-OFF-020`): o que falta é convergência, e
   convergência é `state.pending`, não espera.
2. `state.loading` **preserva as dimensões da região** e nunca muda de tamanho ao resolver.
3. `state.loading` **nunca cobre** `zone.anchor-bottom` nem bloqueia a região inteira da tela.
4. Aguardo que dura além do limiar declarado (**S-04**) resolve para `state.stale` ou `state.error` —
   nunca fica indefinido. Se o domínio de rede (§5) já explica a espera, a região mostra o **domínio**,
   não um indicador de atividade sem fim.
5. Drenar fila **não é** `state.loading`. A contagem de `state.pending` decresce; ela nunca é
   substituída por indicador de atividade (`RN-OFF-030` c).

### 3.3 `state.pending` — o estado que o PDV mais usa

Duas superfícies, e elas não se confundem: a **contagem do terminal** (§5, faixa permanente) e a
**marca por fato** na linha da venda, do pagamento ou do documento.

- Pendente **não é falha.** Nunca `danger`, nunca glifo de alerta, nunca texto de erro. `attention`
  existe exatamente para isso, e pintar pendência de vermelho ensina o operador a ignorar vermelho
  (`tokens-cor.md` §4) — o custo não é a pendência mal sinalizada, é o vermelho real deixar de parar
  alguém.
- Pendente **conta e data**: quantas, desde quando (`RN-OFF-018`).
- Pendente **não oferece resolução ao caixa.** Reconciliação que exige julgamento vai para a lista de
  trabalho do papel dono (`RN-OFF-011`, `RN-OFF-012`) — **nunca** modal no caixa. Não existe, nesta
  camada, estado de "conflito para o operador resolver": ele não tem id porque não tem superfície aqui.
- Aproximação do teto (`RN-OFF-014`) é `state.pending` com aviso no mesmo canal, **antes** da recusa.
  Ao atingir o teto, a venda nova é `state.error` com a próxima ação — e a fila permanece íntegra.
  O mesmo tratamento vale para recurso local no limite (`RN-OFF-015`).

### 3.4 `state.error` — toda recusa fala com o operador

Não existe, na tela do operador, "erro técnico". Todo estado visível de falha é uma **recusa nomeada**
com próxima ação (`PN-17`). O detalhe técnico vai para o registro interno e não aparece aqui.

- **Onde aparece:** na região que iniciou a operação. Nunca em camada modal, nunca cobrindo
  `zone.anchor-bottom`, nunca derrubando o resto da tela.
- **O que carrega:** o que aconteceu, a próxima ação e — quando a recusa é por estado não confirmado —
  o último estado conhecido **com o instante dele** (`RN-OFF-005`).
- **Texto de terceiro** (motivo preservado do servidor) entra como **texto atribuído**: literal, opaco,
  visualmente distinto da mensagem do produto (`RN-NUC-016`), nunca como a única informação e nunca
  interpretado como marcação.
- **Nunca revela** consulta, caminho, nome de schema, identificador interno ou de outro cliente. Uma
  referência curta de ocorrência é permitida **ao lado** da mensagem, nunca em lugar dela, e ela não
  codifica cliente, estabelecimento nem recurso.
- **Erro de rede não é `state.error`.** Perda de conexão é §5. `RN-OFF-018` exige que o fluxo de venda
  se complete nos três domínios **sem nenhum modal de erro de rede**.

### 3.5 Ordem de precedência entre estados numa mesma região

Um só estado é apresentado por região, e a ordem é: `error` → `confirming-irreversible` → `unavailable`
→ `stale` → `loading` → `empty`. `pending` **não** entra nesta disputa: ele coexiste com qualquer um,
porque descreve um fato já concluído, não a região.

### 3.6 `state.confirming-irreversible` — a única camada modal do caminho crítico

Ação que move valor ou cria fato novo (cancelar venda, cancelar item lançado, sangria, desconto,
reimpressão) exige confirmação explícita, e o fato novo **não é desfazer**: `PN-07` proíbe editar fato
concluído. Proposta de automação que move valor entra por aqui (`PN-16`): ela **propõe**, a confirmação
é do operador com papel autorizado.

Requisitos, e nenhum deles é opcional:

1. **Camada transitória** (`elevation.200` + `color.alpha.scrim`, `layer.modal`), a única sombra do
   sistema. A faixa de conexão e pendência fica **acima** dela (`layer.alert`) — `RN-OFF-018` não
   admite que a confirmação encubra o estado que ela pode contradizer.
2. **Completável sem tocar a tela** (`PN-05`), e **a tecla de confirmação nunca é o terminador de
   leitura** do leitor de código (`foco-teclado-e-leitor.md` §7, **S-05**). Um leitor que emite
   terminador confirmaria a ação destrutiva sozinho — é o modo mais barato de este sistema cancelar
   uma venda por acidente.
3. **O desfecho destrutivo nunca recebe o foco inicial.** O foco inicial é o desfecho conservador.
4. **Posição e ordem dos dois desfechos são fixas** e não se invertem por contexto (`PN-06`). Contagem
   de slots fixa; nenhum desfecho extra aparece condicionalmente.
5. **Nunca confirma nem descarta sozinha.** Não existe expiração, não existe descarte por toque fora
   que perca a intenção, e a ação não acontece sem o ato de confirmar.
6. O texto declara **a consequência**, não o nome da ação, e diz que é irreversível — lei 5 de
   `tokens.md` §10: minimalismo é ornamento, a pista de irreversibilidade não é.
7. Ao fechar, o **foco volta exatamente ao elemento que a abriu** (`foco-teclado-e-leitor.md` §6.3).

### 3.7 `state.unavailable` — o recurso existe, e o motivo é dele

Distinto de "sem permissão" (§4): aqui o recurso **existe**, o operador pode saber por quê, e o
impedimento é **transitório e cognoscível** — periférico ausente (`PN-18`), dependência de autoridade
externa fora (`net.authority-unavailable`), pré-condição de fluxo não satisfeita.

**Controle indisponível é focável. Decidido aqui, e fecha L-07 de `tokens.md` §11.** A razão não é
conforto:

- **O ordinal é contrato.** Ordem visual = ordem de leitura = ordem de foco = ordem de atalho
  (`grade-e-espacos.md` lei 11). Se um controle indisponível saísse da ordem de foco, o ordinal de tudo
  que vem depois mudaria conforme a disponibilidade — a terceira tabulação passaria a ser outra coisa,
  variando durante o turno. É exatamente a regressão que `PN-06` recusa, com o agravante de ser
  invisível num diff.
- **O operador tabulando precisa alcançar o controle morto para ler o motivo.** Pular é obrigar quem
  não usa toque a descobrir por eliminação por que o fluxo não avança.

Consequências que vão junto, e não se separam:

1. **A medição de `focus-ring` sobre `disabled-surface` era exigida por esta decisão, e está feita**
   (**S-02**, era L-04 de `tokens.md` §11; os valores moram em `tokens-cor.md` §5.2): **13,56** no membro
   escuro (`neutral.900` sobre `neutral.200`) e **1,28** no membro claro (`neutral.000` sobre
   `neutral.200`). Piso 3:1. O que os dois números provam **juntos** não é "passa": é que sobre
   superfície desabilitada **quem carrega é o membro escuro, e o claro não carrega ali de jeito nenhum**
   — 1,28 contra piso 3 é reprovação larga, não margem. Some ao 2,89 de `focus-ring` sobre `danger`
   (`tokens-cor.md` §3.2), onde quem carrega é o **claro**, e a leitura é uma só: **legibilidade do foco
   é propriedade do par, não de um membro** — cada superfície do sistema escolhe qual dos dois a
   sustenta, e nenhuma superfície reprova contra os dois. Daí os membros serem **inseparáveis** (lei 15
   da §9): desenhar só o claro reprova sobre `disabled-surface`, desenhar só o escuro reprova sobre
   `danger`, e **nas duas direções nada acusa** — o controle continua parecendo focado. Par sem valor
   medido não vai para produção (`tokens.md` §10.3); este tem valor nas duas pontas.
2. **Canais:** perda do acento (degrau de valor) + ausência de limite desenhado (`tokens-cor.md` §5.5)
   + texto do motivo + glifo. Nunca perda de legibilidade: o piso de 4,5:1 para texto indisponível é
   próprio deste sistema e mais estrito que WCAG.
3. **Acionar um controle indisponível devolve o motivo** — nunca fica em silêncio. Para quem opera de
   memória, silêncio é indistinguível de sucesso.
4. **Forma não é canal aqui:** o raio continua `radius.100`, porque o controle continua sendo controle.
5. **O par de foco é desenhado inteiro**, sem redução de espessura, como em qualquer outro alvo.

## 4. Ausência por autorização — e por que ela não é estado

Lei 9 de `tokens.md` §10, e o requisito que `seguranca` deixou nesta ficha: **ausência por autorização
é ausência, não estado visual.** Controle apagado revela que o recurso existe — e `RN-NUC-018` exige
que a negação não revele o que existe do outro lado, inclusive entre estabelecimentos do **mesmo**
cliente.

O aparente conflito com `PN-17` (todo erro diz a próxima ação) se dissolve num critério só:

> **A presença de um controle é decidida por "o operador pode *pedir*?", não por "o operador pode
> *concluir* sozinho?".**

Três casos, e a UI trata cada um de um jeito:

| Caso | Quem decide | O que a UI faz | `PN-17` |
|---|---|---|---|
| **A — fora do alcance do papel ou do escopo** (não pode nem pedir) | backend, ao compor o manifesto por papel (`.claude/rules/backend.md` §4) | **nada**: o nó não chega. Sem controle, sem slot rotulado, sem atalho registrado, sem mensagem | não se aplica: não houve tentativa nem erro |
| **B — pode pedir, não pode concluir sozinho** (desconto acima do limite, ato que exige escalonamento) | backend, na tentativa | controle **presente e normal** — nunca nasce apagado. A negação é **resposta à tentativa**, com a autoridade que falta e o caminho para obtê-la (`papeis-atribuicao-e-delegacao.md`, `RN-OFF-007` infeliz) | **cumprido por inteiro**: `state.error` com próxima ação nomeada |
| **C — existe e está indisponível agora** | backend | `state.unavailable` com motivo (§3.7) | cumprido: o motivo **é** a próxima ação |

O caso B é o que resolve a maior parte da tensão: quase tudo que um operador "não pode" ele **pode
pedir**, e pedir é capacidade do papel dele. Nada disso desenha controle apagado, e nada disso vira
estado permanente.

**Sobra um resíduo, e ele é declarado, não escondido.** Um atalho de teclado memorizado que aponte
para algo ausente no caso A. Regra:

- atalhos resolvem **só contra slots renderizados**; a UI não mantém tabela de atalho para nó que não
  recebeu;
- tecla que não resolve produz **uma** resposta, **idêntica** para "não existe nesta tela", "não existe
  neste terminal" e "existe e foi negado": a indistinguibilidade **é** a defesa;
- essa resposta tem próxima ação **genérica** (a quem recorrer), nunca específica do recurso.

**Custo declarado:** para o caso A, `PN-17` é cumprido no nível genérico, não no nível do recurso.
Qualquer próxima ação específica seria divulgação — e divulgar a existência de um recurso negado é
irreversível, enquanto uma mensagem genérica custa uma pergunta ao responsável. É o único ponto deste
arquivo em que um `PN` é atendido parcialmente de propósito.

**Duas proibições que fecham o caminho:** a UI não recebe conjunto de permissões para decidir o que
desenhar (§1, item 1), e a UI **nunca** transforma uma negação recebida em ausência, nem uma ausência
em `state.unavailable` — ela renderiza o que recebeu. Inferir um do outro reintroduz a divulgação pela
porta do cliente.

## 5. Rede: três domínios, três apresentações

`RN-OFF-001` proíbe usar "offline" sem dizer qual domínio. A faixa permanente é ancorada em
`zone.anchor-top`, em `layer.alert`, e nunca é encoberta (`RN-OFF-018`). Os três **não compartilham
glifo nem texto**, e nenhum apresenta a palavra genérica "offline" como única informação: confundir os
três faz o operador tratar "a autorização de terceiro está fora" como "a internet caiu", e as duas
ações são diferentes.

| id | Domínio | Identidade não-cromática | O que o texto nomeia | O que muda no fluxo |
|---|---|---|---|---|
| `net.reachable` | — | slot presente, sem glifo de alerta, contagem visível | "tudo enviado" e a contagem, mesmo em zero | nada |
| `net.external-unreachable` | **D1** — link caiu, LAN viva | glifo próprio + instante do último contato + contagem | que o **servidor e os serviços externos** estão fora, há quanto tempo, e que os equipamentos locais respondem | venda segue; pendências contam |
| `net.terminal-isolated` | **D2** — terminal isolado | glifo próprio + instante + contagem | que **este dispositivo** está sem contato com os outros e com o que é de rede | venda segue; o que exige outro dispositivo ou estado compartilhado é recusado (§3.4) |
| `net.authority-unavailable` | **D3** — rede boa, serviço externo fora | glifo próprio + instante | que **a autorização de terceiro** não está disponível — e **não** que a internet caiu | venda segue onde a regra permite; o que exige autoridade é recusado, e nunca vira pendência |

Regras da faixa:

1. **A faixa nunca usa `danger`.** Ela é `attention` enquanto degradada e neutra em `net.reachable`.
   `danger` é da recusa de uma operação tentada (§3.4). Faixa permanente vermelha treina o operador a
   ignorar vermelho.
2. **Domínio é identidade; desfecho é cor.** A cor vem do desfecho da operação em curso, nunca do
   domínio.
3. **"O que pode ser prometido" é um slot da faixa, preenchido pelo backend** (`RN-OFF-018`, `PN-13`).
   A UI não deriva isso do domínio.
4. **A contagem de pendências é estado mantido**, atualizado por evento; a apresentação **não** dispara
   consulta (`RN-OFF-030` c). Ela aparece dentro do caminho crítico — consulta por apresentação
   transformaria a informação mais útil do operador no que mais atrasa a tela dele.
5. **Zero é estado visível**, não ausência de faixa. O slot não colapsa.
6. **Transição de domínio não rouba foco, não abre camada, não cancela fluxo em curso** e não altera a
   ordem de foco (`foco-teclado-e-leitor.md` §6.2). Reconexão se anuncia pela contagem drenando —
   nunca por camada de sucesso.
7. **`state.stale` e a faixa são independentes**: conteúdo de cache continua marcado mesmo em
   `net.reachable`, até ser substituído por conteúdo de rede.

**Desfecho → apresentação** (`RN-OFF-002`; a classe é da §3 daquele arquivo, e a UI não a decide):

| Classe | Desfecho | Apresentação |
|---|---|---|
| 1 — aditivo | integral, ou degradado com fila | conteúdo normal + `state.pending` contado e datado. **Nunca** `state.error` |
| 2 — não-aditivo | recusa | `state.error` com o último estado conhecido **e o instante dele** |
| 3 — recurso escasso | integral até a faixa acabar; depois, pendência nomeada | conteúdo normal; ao faltar, `state.pending` nomeando o que faltou — a venda continua |
| 4 — autoridade | recusa, falha fechado | `state.error` nomeando a autoridade que falta e o caminho. **Nunca** `state.pending`: não existe "autorizado, confirma depois" |

## 9. Leis desta camada

1. Todo estado carrega **dois ou mais** canais do §2. Cor nunca é o único.
2. Movimento, `hover`, som e o contorno duplo do foco **não** são canais de estado.
3. O vocabulário de estado é fechado. Estado desconhecido é nó descartado, nunca erro de tela.
4. Nenhum estado cria, move, encolhe ou empurra slot de `zone.anchor-bottom`.
5. Nenhum estado altera a ordem de foco. Estado não interativo não entra nela.
6. Foco só se move por ato do operador ou por desaparecimento do elemento focado — e a recuperação
   nunca pousa em ação irreversível.
7. Falha de rede não é `state.error`, e não existe modal de erro de rede.
8. Ausência por autorização é ausência. Nenhum controle apagado, nenhum slot rotulado, nenhum atalho,
   nenhuma mensagem específica.
9. Presença de controle se decide por "pode pedir?", não por "pode concluir?".
10. Pendente conta, data e não pede decisão ao caixa. Conflito que exige julgamento não tem superfície
    aqui.
11. Confirmação de ação irreversível não é acionável pelo terminador de leitura, e o desfecho destrutivo
    não recebe foco inicial.
12. Leitura tem destino declarado; recusa de leitura é contada e sinalizada, nunca silenciosa nem
    diferida.
13. Conteúdo que não veio da rede declara o instante dele.
14. Contagem de pendências é estado mantido, nunca consulta por apresentação.
15. O par de foco é desenhado inteiro em qualquer estado, inclusive em controle indisponível.
16. Sem termo de vertical em nome de estado, de domínio de rede ou de canal.

## 10. Lacunas — o que esta camada não fecha

| # | O que falta | Dono | Impacto se não fechar |
|---|---|---|---|
| S-01 | **Sinal audível** de recusa de leitura e de mudança de pendência. Não existe token de som no sistema, e `foco-teclado-e-leitor.md` §7.5 depende de um sinal que não é visual para quem opera sem olhar | humano / `produto` | rajada de leitura recusada durante camada modal só é percebida ao olhar |
| S-02 | **FECHADA** — medido em 2026-08-22 e registrado em `tokens-cor.md` §5.2; confirmado por recálculo em 2026-08-23. `#1A1A1A` sobre `#E3E3E3` = **13,56** (membro escuro, carrega); `#FFFFFF` sobre `#E3E3E3` = **1,28** (membro claro, **não** carrega aqui). Era L-04 de `tokens.md` §11. O que isso fixa está em §3.7, item 1: a legibilidade do foco é propriedade **do par** | — | — |
| S-03 | **Inventário de glifos**: uma silhueta por estado e uma por domínio de rede, distinguíveis sem cor. Escolha de biblioteca de ícone está fora de escopo (dependência) | humano / `ui` | dois estados com o mesmo glifo derrubam a exigência de dois canais |
| S-04 | **Limiar de espera** a partir do qual `state.loading` resolve para `stale`/`error`. Grandeza nomeada, sem valor: é configuração por cliente (`RN-OFF-028`, `RN-OFF-029`) | humano + `performance` | espera indefinida no caixa, ou recusa cedo demais |
| S-05 | **Qual tecla confirma** ação irreversível, sendo distinta do terminador de leitura do equipamento. Depende do teclado e do leitor reais | humano | leitura confirma cancelamento de venda por acidente |
| S-06 | `state.confirming-irreversible` existe em **E3** (cliente-final não treinado confirmando algo que move valor)? `PN-16` exige confirmação de operador com papel autorizado | `produto` | ou o cliente-final confirma o que não pode, ou o fluxo dele trava |
| S-07 | **FECHADA** — a divergência já não existe: `tokens-cor.md` §4 diz, desde 2026-08-22, que **módulo desligado não é `disabled`: é ausência** (rota que não existe, nó que não chega), e restringe `disabled` a impedimento transitório e cognoscível, igual a §3.7 daqui. Conferido nas duas pontas em 2026-08-23; `vocabulario-e-eixos.md` §2.4 classifica módulo desligado como ausência de nó, sem contradizer nenhuma das duas. Esta linha é que estava obsoleta | — | — |

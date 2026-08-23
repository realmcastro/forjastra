# `PER` — Periféricos: falar com o equipamento do balcão sem virar refém dele

Spec do módulo `PER`. **Está partida em dois arquivos, por teto de tamanho, e o eixo é o motivo de
mudança:** **este** é a **lei do módulo** — as classes de capacidade, `PN-18` como regra operacional, a
continuidade por domínio, o contrato e as lacunas (`RN-PER-001` a `RN-PER-008`), e muda quando o
**módulo** muda; `modulos/perifericos-classes.md` é a regra de **cada classe** — a costura fiscal com
`EMI`, leitura de código, exibição ao cliente-final e quantidade medida (`RN-PER-009` a `RN-PER-019`) —
e muda quando uma classe muda. Numeração contínua e imutável entre os dois (`glossario.md` §4.2).

Os dois aprofundam a entrada de `catalogo-de-modulos.md` §3 (`PER`), que continua sendo o contrato
curto; nada aqui a contradiz. **Escopo: `modulo:PER`** — pelo teste dos três negócios, posto, padaria e
loja de roupa **operam** sem periférico algum (é `PN-18` que obriga isso), e o equipamento depende do
cliente, não do ramo (`fronteira-do-nucleo.md` §2.5).

**A lei central dos dois arquivos é `PN-18`** — *periférico não é refém da venda*. Toda regra é uma
aplicação dele a uma classe de capacidade, e a única coisa que esta spec faz de novo é responder o que
`PN-18` deixava implícito: **o que exatamente se perde** quando um periférico falha, e **quem fica com
a dívida** quando o que se perde é obrigação legal e não conveniência.

**Convenção das regras** (igual a `modulos/cozinha.md`): heading `### RN-PER-nnn — <enunciado>`;
dentro, **Enunciado**, **Motivo**, **Aceite** e **Infeliz**, mais **Offline** onde a continuidade muda o
desfecho.

**Regra de honestidade dos dois arquivos, e ela é dura:**

1. **Nenhum fato fiscal é afirmado aqui.** Toda exigência de documento, via, prazo, marcação e
   desfecho vem de `EMI` — `fiscal-emissao-contingencia.md` (`RN-EMI-017` a `RN-EMI-032`) e
   `fiscal-emissao-propria.md` (`RN-EMI-016`) — que carregam a fonte e o `F-nn`. Onde a spec parece
   falar de norma, ela está **citando `EMI`**; divergência entre os dois é defeito **da spec de `PER`**
   (mesmo princípio de `RN-OFF-017`).
2. **Nenhum fabricante, modelo, protocolo, porta, biblioteca ou caminho de saída** é nomeado — nem como
   exemplo. **D-01 e D-02 estão ABERTAS**, e `docs/arquitetura/d-01-d-02-stack-opcoes.md` registra
   biblioteca de fabricante como a restrição mais dura possível a D-02. Mecanismo é de `backend`/`ui`
   quando a decisão existir; aqui só existe **classe de capacidade**.
3. **Nenhum número inventado** — nenhum tempo de impressão, tamanho de fila, tolerância de pesagem ou
   prazo de retenção. Onde um número seria necessário existe `[[LACUNA-PER-<n>]]` **no lugar da frase**,
   com dono. **As lacunas dos dois arquivos moram na §4 deste.**

## 1. O que `PER` é, e o que ele nunca é

### RN-PER-001 — Periférico é classe de capacidade, nunca modelo de equipamento

**Enunciado** o produto raciocina, configura, autoriza, registra e degrada por **classe de capacidade**
(§1.1). Nenhuma regra, nome de conceito, configuração de cliente, mensagem ao operador ou comportamento
de degradação depende de fabricante, modelo, geração de equipamento ou forma de ligação.
**Motivo** `PN-18` recusa nominalmente "o modelo de equipamento que amarra o cliente e o driver que só
funciona em uma máquina", e `PN-03` recusa configuração que mora no terminal. Uma spec escrita sobre
modelo apodrece quando o cliente troca de equipamento; escrita sobre necessidade, não (`produto.md`,
*necessidade primeiro*). E a consequência prática é comercial: o cliente que já tem equipamento
comprado não precisa comprar o nosso.
**Aceite** buscar por marca, modelo ou forma de ligação em `docs/produto/**` retorna zero ocorrência; e
trocar o equipamento de uma classe num posto de trabalho não altera nenhuma regra, nenhum texto ao
operador e nenhum registro deste módulo — só a configuração daquele posto.
**Infeliz** uma classe só existe hoje em equipamento de um tipo → continua sendo declarada como classe,
e a limitação é **fato de implantação** registrado na habilitação do cliente, nunca regra de produto.

### 1.1 As classes de capacidade — conjunto fechado

Cada linha nomeia a **necessidade** (atemporal, sobrevive à troca de mecanismo) e o **destino** de quem
recebe. Classe nova entra por alteração de `RN-PER-002`, nunca por implantação.

| Classe | Necessidade que atende | Destino |
|---|---|---|
| **Impressão de documento exigido** | o cliente-final sair com o documento que a obrigação manda entregar, no ato | cliente-final |
| **Impressão de via de retenção e de detalhe** | o estabelecimento ficar com a via que a obrigação manda guardar e apresentar | estabelecimento / fisco |
| **Impressão de comprovante e entrega repetida** | provar a operação a quem pediu, e provar de novo depois, sem refazer o fato | cliente-final |
| **Impressão dirigida a destino interno** | o trabalho ou a identificação chegar a um ponto interno que não tem tela | dentro do estabelecimento |
| **Leitura de código** | identificar o que está na mão do operador na velocidade da mão dele | operador |
| **Acionamento de compartimento de valor** | o dinheiro e o troco ficarem guardados e sob conferência | operador |
| **Captura de quantidade medida** | cobrar o que foi efetivamente medido, sem transcrição humana | operador |
| **Exibição ao cliente-final** | quem paga acompanhar o que está sendo cobrado, sem perguntar | cliente-final |
| **Autenticação mecânica de valor recebido** | dar ao pagador prova do recebimento **no próprio instrumento** que ele apresentou | pagador |

### RN-PER-002 — O conjunto de classes é fechado, e classe sem operação de negócio que a use não é exposta

**Enunciado** as classes são exatamente as de §1.1. Classe cuja **operação de negócio** não existe em
nenhuma spec deste repositório é **nomeada e não exposta**: `PER` não a oferece, não a configura e não a
tenta. Hoje essa é a **autenticação mecânica de valor recebido** — a necessidade é legítima e está
nomeada, mas a operação que a usaria (receber documento de terceiro no balcão) não tem módulo, não tem
regra e toca norma de pagamento que ninguém confirmou: `[[LACUNA-PER-4]]`.
**Motivo** conjunto aberto de classe é o mesmo defeito de conjunto aberto de papel (`RN-NUC-019`) e de
artefato publicado (`RN-NUC-013`): sem lista fechada, "ligar um periférico" vira porta para o produto
fazer qualquer coisa com aparência de configuração legítima. E expor capacidade sem a regra do negócio
que a usa é convidar a inventar a regra na implantação — que é onde regra de dinheiro nasce errada.
**Aceite** a configuração de um posto de trabalho só oferece classes desta tabela; a autenticação de
valor não aparece em nenhuma superfície, e a necessidade continua registrada na §4 para quem for
decidir.
**Infeliz** um cliente exige uma classe que não está aqui → é `PERGUNTAS: para humano`, e a resposta
altera **esta** regra antes de qualquer implantação. Nunca contorno "só para esse cliente" (`PN-09`).

### RN-PER-003 — `PER` executa o que outro decidiu e devolve o que aconteceu; ele não decide conteúdo, valor, momento nem autoridade

**Enunciado** `PER` não compõe conteúdo, não calcula, não formata valor por conta própria, não escolhe
**quando** agir, não autoriza e não interpreta o que leu. Ele recebe um trabalho já decidido por quem é
dono da regra (núcleo, `EMI`, `COZ`, `ETQ`), executa, e devolve o desfecho.
**Motivo** `PN-13` (quem decide dinheiro é o backend) e o invariante de fronteira de módulo: periférico
que decide conteúdo passa a ser um segundo lugar onde a regra de negócio vive, e o pior lugar possível —
o mais perto do hardware e o mais longe da trilha. `RN-COZ-010` é o mesmo limite aplicado à produção.
**Aceite** nenhum caminho de `PER` altera item, quantidade, valor, tributo, estado de venda ou estado de
documento; e a decisão de **abrir a gaveta** continua sendo do núcleo (`RN-NUC-012`), não deste módulo —
`PER` só aciona o que o núcleo já autorizou.
**Infeliz** o conteúdo que chegou está incompleto para aquela classe → `PER` **não completa**: recusa o
trabalho declarando o que faltou, ao dono do trabalho, e o fato de origem não é alterado.

## 2. `PN-18` como regra operacional

### RN-PER-004 — Toda operação de periférico é uma tentativa com desfecho declarado, e "não tentada" é um desfecho

**Enunciado** cada operação de periférico termina em exatamente um de três desfechos, registrado com
instante, posto de trabalho, classe e o fato de origem: **cumprida**, **falhou com motivo em linguagem
de operação**, **não tentada com motivo**. Sucesso nunca é presumido por ausência de erro.
**Motivo** é aqui que `PN-18` vira testável. Sem os três desfechos separados, "imprimiu?" não tem
resposta — e `RN-EMI-026` depende dessa resposta para saber se existe pendência de impressão
obrigatória. Presumir sucesso é o defeito que aparece na fiscalização, não no dia.
**Aceite** com a classe indisponível, a operação registra **não tentada** com motivo; com o equipamento
respondendo e o resultado físico falhando (sem insumo, obstrução), registra **falhou** com motivo; e
nenhum caminho do produto exibe ou registra "cumprida" sem desfecho recebido.
**Infeliz** o desfecho não chega (o posto perde energia no meio) → o estado é **indeterminado**, tratado
como **não cumprida** para efeito de pendência e marcado como indeterminado para quem confere — nunca
resolvido como sucesso, nunca duplicado por suposição (`RN-PER-007`).

### RN-PER-005 — Nenhuma classe é pré-condição da conclusão da venda; o que se perde é nomeado, classe por classe

**Enunciado** nenhuma operação de periférico bloqueia concluir pedido, cobrar, concluir venda, abrir ou
fechar sessão de caixa. A falha de cada classe degrada conforme a tabela abaixo, e o que se perde é
**nomeado ao operador na hora** e **contável depois**.

| Classe que falhou | O que se perde, dito com nome | Degrada para |
|---|---|---|
| Documento exigido | a **entrega** do documento ao cliente-final; a obrigação continua e vira dívida nomeada | `RN-PER-009`; meio eletrônico **só** onde `RN-EMI-017` o admite — nunca em contingência |
| Via de retenção / detalhe | a via que o estabelecimento deve guardar e apresentar | `RN-PER-010`; pendência por via, nomeada ao responsável (`RN-EMI-026`) |
| Comprovante / entrega repetida | o papel na mão de quem pediu | reemissão registrada, ou outro meio (`PN-18`, `RN-PER-012`) |
| Destino interno | o trabalho ou a identificação não aparece no ponto | `RN-COZ-008` (tela, ou pendente de apresentação) · `ETQ` gera o conteúdo e não imprime |
| Leitura de código | velocidade do caixa | digitação do mesmo identificador (`RN-PER-015`) |
| Compartimento de valor | a guarda e o troco pelo caminho do produto | `RN-NUC-012` infeliz (a): a venda conclui; abertura por fora é divergência de conferência (`RN-NUC-010`) |
| Quantidade medida | a medição sem transcrição humana | quantidade informada por pessoa, marcada como informada (`RN-PER-019`) |
| Exibição ao cliente-final | o acompanhamento pelo pagador | o operador informa; a venda e o comprovante não mudam |

**Motivo** `PN-18` inteiro. E a metade que se esquece: degradar **sem nomear a perda** é o mesmo que
esconder a perda — `RN-OFF-002` já recusa "degradado" sem pendência nomeada.
**Aceite** com **todas** as classes indisponíveis ao mesmo tempo num posto, o operador abre venda,
lança item por digitação, cobra em espécie, conclui e fecha a sessão; ao fim existe uma lista nomeada
do que não foi cumprido, por classe, e nenhuma tela travou o caixa.
**Infeliz** a perda não cabe em nenhuma linha da tabela → é defeito **desta** regra (classe faltando ou
degradação não declarada), corrigido aqui; nunca desfecho novo improvisado na implantação.

### RN-PER-006 — Disponibilidade de classe é estado datado com origem declarada, nunca promessa

**Enunciado** `PER` expõe, por posto de trabalho e por classe, o **último estado conhecido** com o
instante e a **origem** dele (última tentativa, verificação, ou declaração de quem configurou).
Disponibilidade nunca é afirmada como garantia futura.
**Motivo** `PN-15` (terminal não fica mudo) e `PN-17` (erro fala com o operador): o operador precisa
saber, **antes** de prometer papel ao cliente-final, que aquele posto não está imprimindo. Mas a única
evidência dura é a tentativa — afirmar disponibilidade como promessa é a mentira que produz "o sistema
disse que imprimiu".
**Aceite** o operador consegue dizer, olhando o próprio posto, quais classes estão indisponíveis e
desde quando, sem ferramenta técnica e sem pedir print (`PN-15`); e nenhum texto do produto afirma que
a próxima tentativa vai funcionar.
**Infeliz** nunca houve tentativa nem verificação naquele posto → o estado é **desconhecido**, dito
assim, e a primeira tentativa é o que o resolve. Antecipar a falta de insumo **antes** da primeira
tentativa é capacidade candidata (`CAP-PER-001`), não piso — sem ela, a falta é descoberta na
tentativa, e `PN-18` já garante que isso não para a venda.

### RN-PER-007 — Trabalho não cumprido é retido e retomável; retomar entrega o mesmo conteúdo e nunca duplica

**Enunciado** trabalho que falhou ou não foi tentado é **retido** no posto com o conteúdo que já havia
sido decidido, contável, e retomável quando a classe voltar. Retomar entrega o **mesmo** conteúdo —
nunca remontado — e a mesma retomada executada duas vezes não produz duas entregas.
**Motivo** `PN-02` (reenviar não duplica) e `RN-EMI-030` (o documento que sobe depois é o de antes, no
que a norma amarra — nunca nova montagem). Remontar conteúdo depois é como um documento entregue passa
a divergir do que foi impresso, e `RN-EMI-030` chama isso de o pior desfecho possível. Duas vias
idênticas do mesmo documento fiscal, por outro lado, é papel a mais com aparência de segunda emissão.
**Aceite** com a classe indisponível, concluir 20 vendas, restabelecer a classe e retomar: as 20
entregas saem uma vez cada, com o conteúdo original; disparar a retomada duas vezes não dobra nada;
e o contador de retidos zera só pelo desfecho de cada um, nunca por decurso.
**Offline** classe 1, aditivo (`RN-OFF-004`) no registro da tentativa; a retenção é **local por
natureza** e não depende de servidor em nenhum domínio.
**Infeliz** o recurso local do posto se esgota, ou o posto é reinstalado com trabalho retido →
`RN-OFF-015` (recurso esgotado nunca descarta fato) e `RN-OFF-016` (terminal reinstalado não é caminho
de perda) valem inteiros: o **fato** de origem e a **pendência** sobrevivem, mesmo que a entrega não.
Por quanto tempo e até que acúmulo a retenção é confiável é `[[LACUNA-PER-1]]`.

### RN-PER-008 — Periférico vive no posto e na LAN; a continuidade é classificada por operação e por domínio

**Enunciado** a continuidade de cada operação de `PER` é declarada nos três domínios de
`RN-OFF-001` — e a unidade é a **operação**, nunca o módulo (`RN-OFF-003`).

| Operação | D1 (link caiu, LAN viva) | D2 (terminal isolado) | D3 (serviço externo fora) | Classe |
|---|---|---|---|---|
| Executar qualquer classe em equipamento do próprio posto | integral | integral | integral | 1 |
| Executar classe em destino alcançado pela LAN | integral | **degradado** (retém, `RN-PER-007`) | integral | 1 |
| Registrar o desfecho da tentativa | integral | integral | integral | 1 |
| Acionar compartimento de valor | `RN-NUC-012` (a) integral · (b) degradado | idem | idem | 1 no fato + 4 na autoridade |
| Ler código e **usar** a leitura | integral | integral | integral | 1 |
| Entrega repetida de documento ou comprovante já existente | integral | integral | integral | 1 |

**Motivo** periférico é o recurso **mais local** do produto, e é por isso que ele é o que menos deveria
depender de rede — mas o volume dele **cresce** quando a rede cai: em D3 a contingência exige imprimir
**mais** (`RN-EMI-026`). O pior momento da classe de impressão é exatamente o momento em que ela é mais
necessária, e isso é fato de produto, não azar.
**Aceite** cortar só o link (D1), só a LAN (D2) e só o serviço externo (D3) são três ensaios distintos
(`RN-OFF-001`), e em nenhum deles uma operação desta tabela recusa por falta de servidor.
**Infeliz** uma operação de `PER` não está nesta tabela → cai no default `RN-OFF-008` (classe 2,
recusa), o que **contradiz `PN-18`**; então operação nova de `PER` entra aqui na mesma passada em que é
especificada. A tabela §4 de `operacao-offline-e-sincronizacao.md` **não tem linha de `PER`**: as linhas
derivadas desta tabela são dívida declarada de lá, não regra nova daqui (`RN-OFF-017`, mesmo princípio).

## 3. Contrato do módulo

**Expõe** as classes disponíveis por posto de trabalho, com último estado conhecido, instante e origem
(`RN-PER-006`) · o desfecho de cada tentativa como evento, com classe, posto e fato de origem
(`RN-PER-004`) · o que está retido e não cumprido, contável por classe e por fato de origem
(`RN-PER-007`) · a leitura de código como evento de entrada dirigido a um contexto (`RN-PER-013`) · a
leitura de quantidade medida com unidade e instante (`RN-PER-018`) · o registro de cada entrega repetida
com autor (`RN-PER-012`).

**Exige do núcleo** posto de trabalho e estabelecimento · operador autenticado com papel verificado no
backend e trilha (`PN-11`) · o **conteúdo já decidido** por quem é dono dele — `PER` nunca o compõe
(`RN-PER-003`) · a autorização de abrir compartimento de valor, que é operação **do núcleo**
(`RN-NUC-012`) · continuidade offline (`RN-OFF-004`, `RN-OFF-015`, `RN-OFF-016`) · isolamento por
cliente.

**Exige do cliente (configuração)** quais classes existem em cada posto de trabalho, e o destino
alternativo de cada uma quando existir. Nada disso mora no terminal (`PN-03`).

**Ativação** isolado, só núcleo. Quem **usa** `PER` declara na própria entrada: `EMI` (impressão exigida
e vias de contingência), `COZ` (via de produção quando o ponto não tem tela — `cozinha.md` §6), `ETQ`
(exige `PER` para imprimir). Nenhum deles importa `PER`: pedem capacidade e recebem desfecho.

**Desligado** — e esta é a resposta que o roadmap precisa:

- **Para a venda, `PER` desligado e `PER` ligado com tudo falhando são o mesmo desfecho:** a venda
  fecha, o comprovante fica disponível por outro meio, e o que se perde é o da tabela de `RN-PER-005`.
  É `PN-18` exigindo do módulo ligado o mesmo que exige do módulo ausente.
- **Para a obrigação, não são o mesmo desfecho, e `EMI` degrada em vez de ter a ativação recusada.**
  `PER` **não** é dependência de ativação de `EMI`: na operação normal a entrega do impresso pode ser
  substituída por meio eletrônico quando o comprador se identifica (`RN-EMI-017`, F-64), então
  `EMI` sem `PER` é configuração **real e suportada**. Recusar a ativação faria de um módulo acoplado a
  equipamento a pré-condição da conformidade fiscal — exatamente "o modelo de equipamento que amarra o
  cliente" que `PN-18` recusa, e obrigaria a comprar impressora um cliente que entrega tudo por meio
  eletrônico.
- **A consequência fiscal existe e é declarada, não descoberta:** onde a UF admite contingência
  off-line, ela **exige** o impresso e **não** aceita substituição eletrônica (`RN-EMI-026`, F-64,
  F-70). Estabelecimento com `EMI` ligado e `PER` desligado (ou sem a classe de impressão) **cai um
  degrau na escala de `RN-EMI-016`** sempre que entrar em contingência: documento gerado, assinado, não
  entregue, com pendência aberta. Isso é **limitação declarada por escrito na habilitação**, com quem
  decidiu e quando — o mesmo mecanismo que `RN-EMI-025` e `RN-EMI-027` já usam para modalidade ausente e
  para assinatura inalcançável. Descobrir isso no pico é falha **nossa** de declaração, não do cliente.

**Sensível** o **conteúdo em trânsito** para uma classe de impressão é o dado que este módulo mais toca,
e ele herda o regime de quem o compôs, sem afrouxar: via de produção não leva dado de pessoa, endereço,
contato, valor cobrado nem dado de pagamento (`cozinha.md` §6); documento e comprovante minimizam
identificação, coletada só quando a entrega escolhida a exige (`RN-EMI-017`). A **exibição ao
cliente-final** é superfície pública dentro do estabelecimento e não leva dado de pessoa
(`RN-PER-016`). Dado de pagamento — número completo, verificador, trilha — **não existe neste fluxo**
(`ADQ`, `catalogo-de-modulos.md`). O trabalho **retido** contém o conteúdo já composto e por isso herda
a mesma classificação enquanto existir. Proteção e retenção são de `seguranca` e do humano.

## 4. Lacunas e pendências dos dois arquivos

- `[[LACUNA-PER-1]]` (`RN-PER-007`) — por quanto tempo, e até que acúmulo, o trabalho retido num posto
  de trabalho continua confiável e recuperável? Nenhum número é afirmado aqui. **Responde:** humano
  (política) + `backend`/`arquiteto-dados` na fase do contrato; conecta com `RN-OFF-014` (teto de
  operação offline) e `RN-OFF-015`.
- `[[LACUNA-PER-2]]` (`RN-PER-018`) — tolerância, arredondamento e casas de quantidade medida, e se
  existe exigência sobre o instrumento usado para medir o que se cobra. **Responde:** humano; conecta
  com `LACUNA-NUC-004` (arredondamento) e é pergunta de norma **não confirmada** — nenhuma analogia.
- `[[LACUNA-PER-3]]` (`RN-PER-009`, `RN-PER-010`) — **a mais importante desta spec.** Imprimir depois
  a via de retenção que faltou **cumpre** a obrigação, ou ela só se cumpre no ato? `RN-EMI-026` (F-70)
  diz que a segunda via fica à disposição do fisco **até a nota ser autorizada** — o que sugere que a
  via tem função durante uma janela, e não depois dela. Se a resposta for "só no ato", a pendência de
  impressão não é resolvível por retomada e passa a ser pendência **fiscal-contábil** (`RN-FIS-006`,
  `RN-EMI-031`), e a retomada de `RN-PER-007` deixa de ser o caminho para essa classe. **Responde:**
  humano com o contador. Até existir resposta, o produto **retém e permite cumprir depois**, e **não**
  afirma que cumprir depois sana a obrigação.
- `[[LACUNA-PER-4]]` (`RN-PER-002`) — autenticação mecânica de valor recebido: existe no produto a
  operação de receber documento de terceiro no balcão, e que regra a rege? A necessidade está nomeada e
  a classe fica **não exposta** até haver resposta. **Responde:** humano (é regra de pagamento).
- `[[LACUNA-PER-5]]` (`perifericos-classes.md` §3) — a superfície de exibição ao cliente-final é qual
  espaço de desenho? `docs/design/grade-e-espacos.md` §10 (G-03) declara que não é E3 nem E4.
  **Responde:** humano / `ui`. A spec declara conteúdo e proibições; não declara espaço.
- `[[LACUNA-PER-6]]` (`RN-PER-014`) — identificador lido, válido, ausente do catálogo retido sem contato:
  qual é a regra do núcleo? Hoje nenhuma `RN-NUC` cobre o caso. **Responde:** `produto`, na spec do
  núcleo (não nesta spec).

**Pendente com o humano, não com fonte:** **os postos de trabalho dos clientes-alvo têm qual conjunto
de classes?** Já perguntado em `verticais/restaurante.md` §4 para os pontos de produção (tela,
impressora ou os dois). A resposta decide se a classe de impressão é piso prático do primeiro cliente ou
capacidade opcional dele.

**Resolvido fora desta spec, e por isso não é lacuna:** o papel da reimpressão. `RN-NUC-032`
(`matriz-operacao-papel.md`, linha 17) já decidiu — `cashier`, com registro que conta as apresentações,
e consulta em lote/exportação como operação **separada** (`RN-EMI-039`). `RN-PER-012` executa essa
decisão e não cria papel (`RN-NUC-017`, `RN-NUC-019`). O que **sobra** é uma divergência de vocabulário
fora do meu território: a definição de "operação sensível" do `glossario.md` ("move dinheiro, altera
fato concluído ou abre gaveta") não alcança reimpressão, embora `.claude/rules/seguranca.md` §2 e
`RN-NUC-032` a tratem como sensível.

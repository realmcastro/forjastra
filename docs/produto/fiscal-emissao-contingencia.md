# `EMI` — o documento depois da venda: guarda, retorno, numeração e contingência

Um dos três arquivos de `EMI` (`RN-EMI-017` a `RN-EMI-032`). O que precisa estar em pé para emitir —
layout versionado, ambiente, multiplicação por UF, regra de ouro (`RN-EMI-008` a `RN-EMI-016`) — está em
`fiscal-emissao-propria.md`; custódia, **onde o ato de assinar acontece** e a trilha do ato
(`RN-EMI-004` a `RN-EMI-007`, `RN-EMI-033` a `RN-EMI-041`) estão em `fiscal-custodia-e-trilha.md`. A
fronteira do módulo e `RN-EMI-001` a `RN-EMI-003` estão em `modulos/fiscal.md` §3.

Aqui está **um** assunto: o que acontece entre "a venda foi concluída" e "o documento está autorizado" —
quando esse intervalo deixa de ser milissegundos e passa a ser uma tarde. Rejeição e retransmissão
**são fluxo normal**, não exceção; e **contingência não é nova tentativa de uma requisição**: é um estado
do ponto de emissão, com entrada e saída, que **queima numeração**, **imprime mais**, e produz uma fila
de pendências com **prazos diferentes entre si** — transmissão, inutilização, cancelamento e
substituição, cada um com marco próprio. Tratar isso como `retry` é o erro que aparece um mês depois, na
quebra de sequência que o contador encontra.

**Regra de honestidade.** Toda afirmação carrega **link inline** e o `F-nn` da tabela `## Fontes`. Fonte
única: `docs/arquitetura/fiscal/2026-08-22-dossie-emissao-propria.md`, coluna "Dossiê". O ID `F-nn` é
global e não se renumera; este arquivo tabula os que usa (F-49 a F-56, F-64, F-65 e F-67 a F-75) — F-35 a
F-48, F-57 a F-63 e F-66 estão em `fiscal-emissao-propria.md`, F-01 a F-34 nos dois arquivos de `FIS`.
Onde não há
fonte existe `[[LACUNA-EMI-<n>]]` **no lugar da frase**. Convenção: o **título é o enunciado**; o bloco
traz motivo, aceite e caminho infeliz. **Nenhum fato foi verificado por mim na fonte primária.**

**Caso base: Ceará.** Permitir contingência off-line é decisão **exclusiva da UF** (F-67). Tudo aqui é
capacidade condicionada à UF; o CE é caso base declarado, nunca universal.

## 1. Os estados, e o que fecha cada um

Mapa da máquina de estado, **em conceito** — não é tabela, tipo nem coluna (D-04 ABERTA). Um documento
está sempre em um destes, e só sai pelo que está na coluna do meio:

| Estado | Sai por | Observação |
|---|---|---|
| **exigido** | montagem | há fato tributado congelado (`RN-EMI-002`) e obrigação reconhecida |
| **montado** | assinatura | carrega a versão usada (`RN-EMI-008`); fica aqui quando não há capacidade de assinar no ponto de emissão (`RN-EMI-033`) |
| **aguardando assinatura externa** | assinatura do cliente | só no modo externo (`RN-EMI-006`); o caixa não espera (`RN-EMI-003`) |
| **assinado, não transmitido** | transmissão, ou entrada em contingência | número já consumido (`RN-EMI-022`) |
| **em contingência, pendente de transmissão** | transmissão dentro do prazo | documento **já entregue** ao cliente-final (`RN-EMI-026`) |
| **transmitido, sem retorno** | retorno, ou consulta ao autorizador | desfecho nunca se presume (`RN-EMI-020`) |
| **autorizado** | (final) · cancelamento dentro da janela | autorizado **fora de prazo** também é autorizado (F-50) |
| **rejeitado, corrigível** | correção e retransmissão (`RN-EMI-019`) | não foi gravado no autorizador (F-49) |
| **rejeitado, retransmissão suspensa** | ação de pessoa | conta na fila; não fica em laço (`RN-EMI-019`) |
| **denegado** | (final) · escalado | uso vedado; a causa é do emitente (F-49) |
| **pendente de inutilização** | inutilização homologada | número consumido e **nunca** autorizado (F-71) |
| **pendente de cancelamento** | cancelamento homologado | autorizado, e não deve acobertar a operação (F-71) |
| **pendente de substituição** | cancelamento por substituição | duplicidade: dois documentos, uma operação (F-75) |
| **inutilizado** / **cancelado** | (final) | desfecho declarado do número (`RN-EMI-022`) |
| **prazo perdido** | ação de pessoa, com o contador | nenhuma janela existe mais (`RN-EMI-031`) |

Nenhum destes estados é "erro". Nenhum bloqueia venda nova. E nenhum se fecha por decurso de prazo
(`RN-FIS-011`).

## 2. Guarda e entrega do documento

### RN-EMI-017 — Guardar o documento e entregá-lo é obrigação do emitente que o produto assume; o modo de entrega depende do estado do documento

**Motivo** o emitente deve manter o arquivo digital **sob sua guarda**, pelo prazo da legislação, ainda
que fora da empresa, e apresentá-lo quando solicitado; a entrega do impresso pode ser substituída por
meio eletrônico quando o comprador se identifica — **mas essa substituição não vale para documento
emitido em contingência**
([Ajuste SINIEF 19/16, cláusulas nona e décima](https://www.confaz.fazenda.gov.br/legislacao/ajustes/2016/AJ_019_16),
F-64). No documento entre empresas, emitente **e** destinatário guardam, o impresso **não** substitui o
arquivo, e o emitente **envia** o arquivo ao destinatário (F-65).
**Aceite** todo documento autorizado é recuperável e apresentável pelo cliente sem depender de nós
(`PN-10`) — **escopado ao estabelecimento e sem virar caminho de enumeração** (`RN-EMI-039`); a superfície
de entrega oferece o meio eletrônico onde ele é admitido e **exige** o impresso onde não é (contingência,
`RN-EMI-026`); dado de identificação do comprador é coletado só quando a entrega escolhida o exige.
**Infeliz** o prazo de guarda em anos não está fixado em nenhuma fonte aberta —
`[[LACUNA-EMI-007: quantos anos, e a partir de que marco, o documento autorizado precisa ser conservado?
— sem fonte em 2026-08-22]]`. Consequência declarada: **não existe expurgo** de documento fiscal no
produto até essa resposta existir, e nenhuma retenção é presumida por analogia.

## 3. Retorno do autorizador

### RN-EMI-018 — Autorizado, rejeitado e denegado são três estados com consequências diferentes, e nenhum deles é "erro"

**Motivo** a norma os separa: **rejeição** descarta (corrigível, **não gravado** no autorizador);
**autorização de uso** grava, com ou sem avisos; **denegação** grava e **veda o uso**, por irregularidade
fiscal do emitente — e a denegação foi **eliminada** de um dos documentos, onde irregularidade do
emitente passou a ser rejeição
([MOC 7.0 Visão Geral, 5.1.6](https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-visao-geral.pdf),
F-49; se nota técnica posterior a reintroduziu: `[[LACUNA-EMI-010]]`). Tratar os três como "falhou"
apaga a diferença entre "corrija e reenvie", "pronto" e "o emitente está irregular no fisco e nenhuma
correção nossa resolve".
**Aceite** os três produzem estados e mensagens distintos: rejeição diz o que corrigir; autorização
encerra; denegação **escala ao responsável**, informando que a causa é a situação fiscal do emitente e
que o produto não a resolve. Autorização **fora de prazo** é autorização, marcada como tal (F-50).
**Infeliz** o retorno não é reconhecido pela nossa versão → estado "retorno não reconhecido", com o
texto do autorizador preservado e escalado; nunca reinterpretado como sucesso, nunca como rejeição. Esse
texto preservado é **texto opaco** e pode conter identificação do comprador: nunca é interpretado nem
usado como chave de decisão, e herda a minimização de `RN-EMI-017` onde aparecer (`RN-OFF-027`).

### RN-EMI-019 — Rejeição é fluxo normal: o produto separa o que retransmite sozinho do que exige uma pessoa, e nada disso passa pelo caixa

**Motivo** rejeição é o desfecho previsto de dado ausente ou inconsistente, e o rejeitado **não é
gravado** (F-49) — retransmitir é o caminho, não a exceção. O caixa não tem informação nem tempo para
tratar isso no pico (`PN-01`, `PN-17`).
**Aceite** rejeição por indisponibilidade ou condição transitória é retransmitida sozinha, com
espaçamento e limite, sem intervenção; rejeição por dado que só uma pessoa resolve (cadastro tributário,
identidade do destinatário, situação do emitente) **para** de ser retentada e vira pendência nomeada
para quem pode resolver — uma vez, sem repetir aviso a cada tentativa.
**Infeliz** a mesma rejeição se repete indefinidamente → o produto **para** de retransmitir aquele
documento, declara "retransmissão suspensa" com o motivo do autorizador preservado, e o conta na fila
(`RN-EMI-028`). Nunca laço silencioso.

### RN-EMI-020 — Uma operação, um documento autorizado: retransmitir nunca duplica

**Motivo** `PN-02` e `RN-EMI-001`. O caso concreto está na norma: documento autorizado cuja resposta
**não chegou** e um segundo emitido para a mesma operação — para o qual existe cancelamento por
substituição, com janela própria (F-75, `RN-EMI-029`).
**Aceite** transmitir o mesmo documento três vezes, incluindo uma depois de derrubar o terminal
**depois** do envio, produz **uma** autorização; e o produto **consulta** o autorizador antes de concluir
que nada foi gravado, em vez de presumir pela ausência de resposta. A transmissão é individual, sem lote
(F-51): a fila drena um a um e cada item tem desfecho próprio.
**Infeliz** descobre-se depois que dois documentos cobriram a mesma operação → caminho de substituição
de `RN-EMI-029`, com prazo próprio; nunca apagamento, nunca "deixa os dois".

### RN-EMI-021 — Corrigir documento autorizado é fato novo e tem limite estreito; o que não cabe nele é pendência declarada, não edição

**Motivo** a correção eletrônica só existe se houver documento autorizado, é **vedada** justamente para
as variáveis que determinam o valor do imposto, para dado cadastral que mude remetente ou destinatário e
para as datas, e uma correção nova **substitui** a anterior, tendo de conter todas
([MOC 7.0 Visão Geral, 5.10](https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-visao-geral.pdf),
F-53). Somado às janelas curtas de cancelamento (F-52), sobra um espaço em que **nada** do que o operador
quer fazer é possível — e é aí que um PDV arcaico inventa gambiarra.
**Aceite** pedido fora do que a norma admite é **recusado com o motivo**, e o produto oferece o caminho
que existe (documento novo, quando cabe) ou declara que não há caminho e escala; correção aplicada
carrega todas as anteriores, por construção.
**Infeliz** o prazo de cancelamento passou e a correção é vedada para aquele campo → pendência de
natureza **fiscal-contábil** escalada ao responsável e ao contador do cliente, com o fato registrado
(`RN-FIS-006`). O produto não altera o documento e não finge que resolveu.

## 4. Numeração e série

### RN-EMI-022 — Número não se reusa, e queimar número é evento previsto com desfecho declarado

**Motivo** a numeração é **sequencial por estabelecimento e por série** (F-35) e a norma trata a quebra
de sequência como coisa a resolver: número não utilizado tem **inutilização pedida até o dia 10 do mês
seguinte**
([Ajuste SINIEF 19/16, cláusula décima sexta](https://www.confaz.fazenda.gov.br/legislacao/ajustes/2016/AJ_019_16),
F-55). O pedido tem forma própria — ano e faixa, justificativa, assinatura, protocolo — e é **rejeitado
se existir evento prévio autorizado para a faixa** (F-56). Contingência queima número por projeto
(F-71).
**Aceite** todo número consumido tem desfecho conhecido: autorizado, cancelado, inutilizado ou
**pendente com prazo** (`RN-EMI-028`); a lista de números sem desfecho é consultável por estabelecimento
e por série, com a data-limite de cada um; virar o dia 10 com número sem desfecho é alerta declarado, não
descoberta do contador.
**Infeliz** um número foi consumido e o produto não sabe se chegou ao autorizador → **consulta** antes
de escolher entre inutilizar e cancelar (`RN-EMI-029`); nunca inutiliza no escuro, porque inutilizar
número de documento autorizado é declarar falso.

### RN-EMI-023 — Série separa processo de emissão; é ela que permite dois modos de assinatura no mesmo emitente sem colisão de número

**Motivo** a faixa de série depende do processo de emissão, e **há faixa reservada** ao provedor que
assina em nome do emitente — a série existe exatamente para o mesmo emitente usar software próprio e um
ou mais provedores **sem colidir número**
([NT 2026.001 v1.02b, item 5](https://www.nfe.fazenda.gov.br/portal/exibirArquivo.aspx?conteudo=AlgHfV6gpAU%3D),
F-54). Subsérie é vedada (F-35), então série é o único eixo disponível.
**Aceite** estabelecimento que emite por nós e passa a emitir também por outro caminho (contador,
provedor) mantém sequências independentes, e nenhum número é reaproveitado entre elas; a série usada é
atributo do documento, nunca inferida no momento da transmissão.
**Infeliz** o cliente já emitia por outro sistema na série que pretendemos usar → conflito detectado
**na habilitação** (`RN-EMI-012`), com recusa e explicação; não no primeiro dia de operação.

## 5. Contingência

### RN-EMI-024 — Contingência é estado declarado do ponto de emissão, com entrada e saída registradas — não é nova tentativa de uma requisição

**Motivo** a norma a trata como **modo de emissão**: o documento sai com marcação própria, data/hora de
entrada e justificativa, e o impresso precisa dizer que foi emitido em contingência
([MOC 7.0 Anexo IV, itens 3 e 4](https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-anexo-iv-manual-contingencia-nfc-e.pdf),
F-69). Entrar é decisão do **contribuinte**, sem autorização prévia do fisco (F-67). E entrar **queima
número**: é vedado reutilizar em contingência número já transmitido em modo normal, e a orientação é
**avançar** um número ao entrar (F-71). Nada disso é expressável como "tentar de novo".
**Aceite** entrar e sair é evento datado, com motivo, **por ponto de emissão** e não por documento
(`RN-RES-010`); a fila de fechamento não para na transição; e um documento **nunca** muda de modo depois
de assinado.
**Infeliz** o autorizador volta no meio de um documento já assinado e impresso em contingência → ele
**continua** em contingência e é transmitido como tal (F-71 exige preservar a identidade original); o
documento seguinte já sai no modo normal.

### RN-EMI-025 — A modalidade de contingência disponível é dado por UF e por documento, publicado como regra com vigência; ausência de modalidade é estado explícito

**Motivo** permitir contingência off-line é **decisão exclusiva da UF**, que pode negá-la a todos ou a
certos contribuintes e admitir outras formas, e ela **não vale em nenhuma hipótese** para o documento de
operação entre empresas (F-67). As outras modalidades têm pré-condições que não são nossas: uma depende
de evento prévio no ambiente nacional, outra **só opera quando a SEFAZ de origem a ativa**, outra exige
formulário próprio (F-72). No caso base, o caminho em hardware fiscal foi extinto
([Decreto CE 36.417/2025](https://sefazlegis.sefaz.ce.gov.br/api/openFile?id=8ede79ea-72c0-44bd-aeee-9a7d0d5b9428),
`verticais/restaurante.md` §4) — resta a contingência **do próprio produto**.
**Aceite** o produto sabe dizer, por estabelecimento, quais modalidades existem e em que ordem serão
tentadas, **antes** do primeiro dia de operação (`RN-EMI-012`); mudança de regra de UF entra por
publicação com vigência, como regra tributária (`RN-FIS-001`), sem release.
**Infeliz** a UF não admite modalidade nenhuma para aquele contribuinte → a venda continua
(`RN-EMI-016`), o documento fica "assinado, não transmitido" e a limitação é declarada por escrito na
habilitação. `[[LACUNA-EMI-011: o Ceará mantém a contingência off-line admitida para este documento
depois de vedar o caminho em hardware fiscal em 2026-01-01, e com que prazo de transmissão? — sem fonte
em 2026-08-22]]`

### RN-EMI-026 — Em contingência o cliente-final leva um documento marcado, e o que a contingência exige a mais é decidido pelo cliente antes, nunca no pico

**Motivo** contingência **imprime mais, não menos**: além do impresso marcado, é obrigatório imprimir o
detalhe da venda **e** uma segunda via identificada como via do estabelecimento, que fica à disposição
do fisco **até a nota ser autorizada**; a alternativa é a guarda eletrônica, que exige **termo prévio**
assumindo responsabilidade integral pela guarda, e a UF pode dispensar a segunda via
([MOC 7.0 Anexo IV, item 4](https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-anexo-iv-manual-contingencia-nfc-e.pdf),
F-70). E a substituição do impresso por meio eletrônico, admitida na operação normal, **não vale** em
contingência (F-64). Ou seja: exatamente no pico com rede ruim, papel e tempo de impressora **aumentam**.
**Aceite** a escolha entre segunda via impressa e guarda eletrônica é configuração **do cliente**,
registrada com data e com quem decidiu, feita na habilitação; em contingência o cliente-final recebe o
impresso marcado, e o produto não oferece o caminho eletrônico como se fosse equivalente.
**Infeliz** falta papel em contingência → a venda conclui (`PN-18`, `RN-EMI-016`) e fica a **pendência de
impressão obrigatória** nomeada ao responsável, dizendo que a obrigação não foi cumprida. Nunca um "ok"
silencioso, nunca bloqueio do caixa.

### RN-EMI-027 — Sem assinatura disponível no ponto de emissão não existe contingência off-line; no modo de credencial externa isso é limite declarado na ativação

**Onde o ato de assinar acontece é atributo declarado, e desde 2026-08-22 tem regra própria:**
`RN-EMI-033` (capacidade limitada em escopo e prazo, revogável, contada por uso). Esta regra descreve o
**efeito** de a assinatura não estar alcançável; ela não é mais o lugar onde "no terminal" fica implícito.
**Motivo** a contingência off-line consiste em **gerar, assinar e imprimir sem autorização prévia**,
transmitindo depois
([MOC 7.0 Anexo IV, itens 2 e 4](https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-anexo-iv-manual-contingencia-nfc-e.pdf),
F-68). Assinar é **parte** da contingência, não passo posterior. Logo, no modo em que a credencial está
fora da Forja (`RN-EMI-003`, `RN-EMI-006`), a contingência off-line só existe se a assinatura estiver
alcançável naquele instante — e se ela depende de rede, cai junto com o autorizador. É a diferença entre
"o cliente-final sai com documento" e "o cliente-final sai com comprovante não fiscal e o
estabelecimento fica com dívida".
**Aceite** no modo padrão (custódia na Forja) a contingência off-line funciona com o autorizador
inacessível, desde que a UF a admita (`RN-EMI-025`); no modo externo, a habilitação **declara por
escrito** que o estabelecimento cai um degrau na escala de `RN-EMI-016` (documento montado, não
assinado, não entregue) quando a assinatura não estiver alcançável, e o produto mostra esse estado sem
travar o caixa.
**Infeliz** o cliente escolheu o modo externo sem ver esse efeito → é falha **nossa** de declaração, não
dele. Se a assinatura externa exige confirmação por dispositivo a cada uso (F-37), a contingência
off-line passa a depender de o dono do dispositivo estar presente — decisão de operação do cliente,
declarada, não suposição do produto.

### RN-EMI-028 — Cada documento pendente carrega o seu próprio prazo, com marco próprio; a fila é ordenada por prazo, não por ordem de criação

**Motivo** os prazos e os marcos são diferentes, e é isso que faz "uma tarde offline" virar trabalho:
transmitir o documento emitido em contingência vai **até o fim do primeiro dia útil seguinte à emissão**
(F-68); inutilizar número não usado vai **até o dia 10 do mês seguinte** (F-55); cancelar documento
autorizado tem janela de **30 minutos** da autorização, redutível por UF, e de **24 horas** no outro
modelo (F-52); o cancelamento por substituição tem **168 horas** (F-75); e a modalidade que depende de
evento prévio **bloqueia** o emitente se ficar pendente de conciliação por mais de 168 horas (F-74). Uma
fila ordenada por criação drena na ordem errada.
**Aceite** com o link caído por uma tarde e 120 vendas concluídas, ao voltar existe **uma** fila nomeada,
ordenada por prazo restante, mostrando por documento: o estado (§1), a data-limite, o marco de onde ela
conta e o que acontece se vencer. Nenhum item sem prazo; nenhum prazo sem link para a norma que o fixa;
e um item que falha não segura os outros (F-51).
**Infeliz** o prazo é desconhecido para aquele documento ou UF → o item aparece com prazo **"não
determinado"** e é escalado no topo da fila, nunca no fim e nunca sem prazo aparente.
`[[LACUNA-EMI-012: alguma UF pratica prazo de transmissão de contingência menor que o fim do primeiro
dia útil seguinte? — sem fonte em 2026-08-22]]`

### RN-EMI-029 — O desfecho de um pendente é binário e depende do que o autorizador diz, não do que o produto supõe

**Motivo** a norma é explícita e binária: a regularização da nota pendente é **inutilizar** se ela não
foi autorizada e **cancelar** se foi (F-71). São ações opostas e irreversíveis, e a informação que decide
entre elas está **no autorizador**, não em nós — o caso clássico é o documento autorizado cuja resposta
se perdeu. Para ele existe o cancelamento por substituição, em 168 horas, exigindo que o substituto seja
de contingência e tenha conteúdo idêntico (F-75). Inutilizar número de documento autorizado é declarar
falso; cancelar o que nunca existiu é pedido rejeitado.
**Aceite** antes de escolher, o produto **consulta** o autorizador sobre aquele documento e registra a
resposta; a ação escolhida cita a resposta que a justificou; e pedido de inutilização de faixa é
recusado localmente se houver na faixa qualquer documento com desfecho desconhecido — porque o próprio
autorizador rejeita a inutilização quando há evento prévio autorizado ali (F-56).
**Infeliz** o autorizador não responde à consulta → **nada é decidido**: o item permanece pendente, com
o prazo correndo e visível. Nenhuma ação irreversível por suposição, em nenhuma hipótese.

### RN-EMI-030 — Sair da contingência é drenar a fila preservando a identidade de cada documento; nunca remontar

**Motivo** a norma exige que a chave de acesso e o identificador originais sejam **mantidos** na
transmissão posterior, e que a nota em contingência rejeitada seja gerada de novo **com a mesma numeração
e série**, sanada a irregularidade (F-71). Somado a `RN-EMI-002` (o tributo é o congelado) e
`RN-EMI-008` (a versão é a da emissão), a consequência é dura: o documento que sobe amanhã é o documento
de ontem no que a norma amarra — não uma nova montagem "corrigida".
**Aceite** documento emitido em contingência às 15h e transmitido no dia seguinte sai com a **mesma**
numeração, série, chave, valores e versão de especificação; publicar regra tributária nova ou versão
nova de especificação no intervalo **não** altera nenhum dos dois.
**Infeliz** a correção exigida pela rejeição afetaria valor ou classificação → não é retransmissão, é
`RN-EMI-021`/`RN-FIS-006`: o produto **para**, declara e escala. O impresso já está com o cliente-final;
remontar valor diferente do que foi entregue é o pior desfecho possível aqui.

### RN-EMI-031 — Prazo vencido não fecha pendência: o que perdeu a janela vira pendência de outra natureza, nomeada e escalada

**Motivo** as janelas fecham de verdade: pedido de cancelamento fora de prazo é **rejeitado** naquele
documento (F-52), a correção eletrônica é vedada para o que determina valor (F-53), e a modalidade que
depende de evento prévio **bloqueia** o emitente após 168 horas de pendência (F-74). O que sobra não tem
caminho técnico — e é exatamente onde um PDV arcaico apaga o registro.
**Aceite** item que perde a janela muda para o estado "prazo perdido" **com a data e a janela que
venceu**, é escalado ao responsável e ao contador do cliente (`RN-FIS-006`) e continua contável para
sempre; nenhuma tela some com ele; nenhum contador de pendências volta a zero por decurso.
**Infeliz** não há caminho de correção conhecido para o caso → é `LACUNA-RES-007`, ainda aberta (passado
o prazo de cancelamento, com a correção vedada, qual é o caminho). O produto **declara que não sabe** em
vez de oferecer caminho inventado.

### RN-EMI-032 — Contingência é medida e mostrada; uso excessivo é risco do cliente que o produto expõe, não esconde

**Motivo** entrar em contingência não exige autorização prévia, mas o fisco **pode pedir esclarecimento e
restringir** quem contingencia em demasia sem justificativa (F-67); e no ramo a contingência é rotina de
pico, não exceção (`RN-RES-010`). Um cliente que contingencia todo dia às 20h não tem problema fiscal:
tem problema de rede — e o problema fiscal chega depois.
**Aceite** existe, por estabelecimento, a contagem de entradas em contingência, de documentos emitidos
nesse modo e de tempo acumulado, com a justificativa registrada em cada entrada; o número é visível ao
cliente **antes** de o fisco perguntar, e é o mesmo número que diz se aquilo é falha de infraestrutura
dele ou nossa. O que o cliente vê é **o dele**: qualquer consolidado que só exista somando clientes é
dado nosso e nenhuma superfície de cliente o alcança (`RN-EMI-040`).
**Infeliz** o padrão de uso indica risco de restrição pelo fisco → o produto **avisa** quem pode agir,
com o dado à vista; e **não** decide sair de contingência para "melhorar a estatística", porque a
alternativa seria parar de vender (`RN-EMI-016`).

## 6. O que este arquivo deliberadamente não faz

Não descreve campo, marcador técnico, código de retorno, endereço de serviço, formato de impresso nem
sequência de chamadas: o dossiê **não leu** a especificação integralmente (`LACUNA-EMI-009`), e isso é
território de `backend`/`arquiteto-dados` quando o contrato existir. Não escolhe entre as modalidades
adicionais de contingência (F-72): a escolha depende da UF (`RN-EMI-025`), do documento e de custo, e é
decisão a tomar com o humano — inclusive porque uma delas **não oferece inutilização de numeração** e o
cancelamento nela só alcança o que ela própria autorizou (F-73), o que muda o desfecho de `RN-EMI-029`:
`[[LACUNA-EMI-013: qual modalidade adicional de contingência se aplica a cada documento e a cada UF dos
clientes-alvo, e a que custo de habilitação? — sem fonte em 2026-08-22]]`

## Fontes

Fonte única: `docs/arquitetura/fiscal/2026-08-22-dossie-emissao-propria.md` — coluna **Dossiê**. Fato de
emissão que não esteja tabulado aqui ou em `fiscal-emissao-propria.md` **não existe** nas duas specs.
Nenhum foi verificado por mim na fonte primária; o dossiê expira a cada nota técnica e a cada ato de UF.

| ID | Afirmação | URL | Tipo | Dossiê | Acesso |
|---|---|---|---|---|---|
| F-49 | A validação termina em **rejeição** (descartado, corrigível, **não gravado**), **autorização de uso** (gravado, com ou sem avisos) ou **denegação** (gravado, uso vedado, por irregularidade fiscal); a denegação foi **eliminada** do documento de venda a consumidor final, onde irregularidade do emitente passou a ser rejeição. | https://www.nfe.fazenda.gov.br/portal/exibirArquivo.aspx?conteudo=T3QyeMfpios%3D | oficial (NT 2023.002 v1.01, item 6, + MOC 7.0 Visão Geral, item 5.1.6) | §4.3 | 2026-08-22 |
| F-50 | A resposta do autorizador traz **ambiente**, situação, motivo, UF, data/hora de recebimento em **UTC** e, quando autorizada ou denegada, número de protocolo; há situação própria para autorizado, **autorizado fora de prazo**, denegado, cancelado e inutilização homologada. | https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-visao-geral.pdf | oficial (MOC 7.0 Visão Geral, itens 4.3.5, 5.1.6, 5.3 e 5.4) | §4.4 | 2026-08-22 |
| F-51 | No documento de venda a consumidor final a requisição assíncrona foi **eliminada**: o lote só pode conter **um** documento, e lote com mais de um é rejeitado. | https://www.nfe.fazenda.gov.br/portal/exibirArquivo.aspx?conteudo=T3QyeMfpios%3D | oficial (NT 2023.002 v1.01, itens 2 e 3.1; produção desde 2023-09-04) | §4.2 | 2026-08-22 |
| F-52 | O cancelamento do documento de venda a consumidor final exige que não tenha havido saída da mercadoria e prazo **não superior a 30 minutos** da autorização, **redutível a critério da UF**; no documento entre empresas o prazo é de **24 horas**. Fora de prazo: neste último pode haver homologação, no primeiro o pedido é **rejeitado**. | https://www.confaz.fazenda.gov.br/legislacao/ajustes/2016/AJ_019_16 | oficial (Ajuste SINIEF 19/16, cláusula décima quinta; Ajuste SINIEF 7/05, cláusula décima segunda; MOC 7.0 Visão Geral, item 5.9.4) | §7.1, §7.3, §7.4 | 2026-08-22 |
| F-53 | A correção eletrônica **só existe** se houver documento autorizado, é **vedada** para as variáveis que determinam o valor do imposto, para dado cadastral que mude remetente ou destinatário e para as datas; e uma correção nova **substitui** a anterior, precisando conter todas as correções. | https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-visao-geral.pdf | oficial (MOC 7.0 Visão Geral, item 5.10) | §7.5 | 2026-08-22 |
| F-54 | A faixa de **série** depende do processo de emissão, com faixa própria para aplicativo do próprio contribuinte e faixa **reservada** ao provedor que assina em nome do emitente; a série existe justamente para o mesmo emitente usar software próprio e um ou mais provedores **sem colidir número**. | https://www.nfe.fazenda.gov.br/portal/exibirArquivo.aspx?conteudo=AlgHfV6gpAU%3D | oficial (NT 2026.001 v1.02b, item 5) | §6.2 | 2026-08-22 |
| F-55 | Número sequencial **não utilizado** deve ter a inutilização pedida **até o dia 10 do mês seguinte**, para não deixar quebra na sequência. | https://www.confaz.fazenda.gov.br/legislacao/ajustes/2016/AJ_019_16 | oficial (Ajuste SINIEF 19/16, cláusula décima sexta) | §6.3 | 2026-08-22 |
| F-56 | O pedido de inutilização informa ano e faixa, exige justificativa, é assinado digitalmente, devolve protocolo próprio na homologação, e é **rejeitado se existir evento prévio autorizado** para a faixa pedida. | https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-visao-geral.pdf | oficial (MOC 7.0 Visão Geral, itens 3.3.15 e 5.3) | §6.4 | 2026-08-22 |
| F-64 | O emitente deve manter o documento em **arquivo digital**, sob sua guarda e responsabilidade, pelo prazo da legislação, **ainda que fora da empresa**, e apresentá-lo quando solicitado; a entrega do impresso pode ser substituída por meio eletrônico quando o comprador se identifica — **mas essa substituição não vale para documento emitido em contingência**. | https://www.confaz.fazenda.gov.br/legislacao/ajustes/2016/AJ_019_16 | oficial (Ajuste SINIEF 19/16, cláusulas nona e décima) | §10.1 | 2026-08-22 |
| F-65 | No documento entre empresas, **emitente e destinatário** guardam o arquivo pelo prazo da legislação; o impresso **não** substitui o arquivo; e o emissor deve **enviar** o arquivo ao destinatário por meio que dê acesso, respeitando o sigilo fiscal. | https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-visao-geral.pdf | oficial (MOC 7.0 Visão Geral, itens 6 e 6.1) | §10.2 | 2026-08-22 |
| F-67 | Permitir contingência off-line é **decisão exclusiva da UF**, que pode negá-la a todos ou a certos contribuintes e admitir outras formas; ela **não vale para o documento de operação entre empresas em nenhuma hipótese**. Entrar em contingência é decisão do contribuinte, sem autorização prévia do fisco e sem termo em livro — mas o fisco **pode pedir esclarecimento e restringir** quem contingencia em demasia sem justificativa. | https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-anexo-iv-manual-contingencia-nfc-e.pdf | oficial (MOC 7.0 Anexo IV, item 2) | §5.2 | 2026-08-22 |
| F-68 | Na contingência off-line o contribuinte **gera, assina e imprime sem autorização prévia** e transmite depois, com prazo **até o final do primeiro dia útil subsequente à emissão**; o nível de serviço acordado pelos estados para autorização é **inferior a 30 segundos em 85% do tempo**. | https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-anexo-iv-manual-contingencia-nfc-e.pdf | oficial (MOC 7.0 Anexo IV, itens 2 e 4; o Decreto CE 36.417/2025, art. 83, II, remete ao mesmo anexo) | §5.1 | 2026-08-22 |
| F-69 | Em contingência off-line o documento exige marcador próprio de modo de emissão, **data/hora de entrada em contingência e justificativa**; o impresso precisa trazer "EMITIDA EM CONTINGÊNCIA"; e o código bidimensional passa a carregar data e hora de emissão, para que a consulta do consumidor informe a contingência **e o prazo máximo** para o documento constar na base do fisco. | https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-anexo-iv-manual-contingencia-nfc-e.pdf | oficial (MOC 7.0 Anexo IV, itens 3 e 4) | §5.3 | 2026-08-22 |
| F-70 | Em contingência off-line é **obrigatório imprimir o detalhe da venda e uma segunda via** identificada como via do estabelecimento, que fica à disposição do fisco **até a nota ser autorizada**; a alternativa é a **guarda eletrônica**, que exige **termo prévio** assumindo responsabilidade integral pela guarda. A UF **pode dispensar** a segunda via. | https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-anexo-iv-manual-contingencia-nfc-e.pdf | oficial (MOC 7.0 Anexo IV, item 4) | §5.4 | 2026-08-22 |
| F-71 | É **vedado reutilizar em contingência número já transmitido** em modo normal, e o manual recomenda **avançar um número** ao entrar em contingência; a chave de acesso e o identificador originais devem ser **mantidos** na transmissão posterior; a regularização da nota pendente é **binária — inutilizar se não foi autorizada, cancelar se foi**; e nota emitida em contingência que for rejeitada é gerada de novo **com a mesma numeração e série**, sanada a irregularidade. | https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-anexo-iv-manual-contingencia-nfc-e.pdf | oficial (MOC 7.0 Anexo IV, itens 3 e 5; Ajuste SINIEF 19/16, cláusula décima segunda) | §5.5 | 2026-08-22 |
| F-72 | As demais modalidades são: evento prévio ao ambiente nacional com leiaute mínimo; ambiente virtual de contingência que **só opera quando a SEFAZ de origem o ativa**; e impressão em formulário de segurança. | https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-anexo-iii-manual-contingencia-nf-e.pdf | oficial (MOC 7.0 Anexo III, itens 2.1.2 a 2.1.4; NT 2014.001 v1.41) | §5.6 | 2026-08-22 |
| F-73 | No ambiente virtual de contingência o serviço de **inutilização de numeração não é oferecido**, e o cancelamento **só alcança documentos autorizados por ele** — não há cancelamento cruzado com o ambiente normal. | https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-anexo-iii-manual-contingencia-nf-e.pdf | oficial (MOC 7.0 Anexo III, item 2.1.3.4) | §5.7 | 2026-08-22 |
| F-74 | Evento prévio pendente de conciliação por mais de **168 horas (7 dias)** bloqueia essa modalidade para aquele emitente, que deixa de conseguir novos eventos até regularizar; as vias impressas devem ser mantidas em arquivo pelo emitente e pelo destinatário pelo prazo da legislação. | https://www.nfe.fazenda.gov.br/portal/exibirArquivo.aspx?conteudo=9hgG%2B%2BcH8gA%3D | oficial (NT 2014.001 v1.41, publicada em 2026-08-04, itens 3.1a e 4.2) | §5.8 | 2026-08-22 |
| F-75 | Existe **cancelamento por substituição** para o caso de duplicidade — documento autorizado sem que a resposta chegasse e outro emitido em contingência para a mesma operação: cancela-se o que não acobertou a operação, em prazo **não superior a 168 horas**, referenciando o substituto; a validação exige que o substituto seja **de contingência** e tenha valor, imposto, destinatário e itens **idênticos**. | https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-visao-geral.pdf | oficial (MOC 7.0 Visão Geral, itens 3.5 e 5.9.3, citando a cláusula décima quinta-A do Ajuste SINIEF 19/16) | §7.2 | 2026-08-22 |

## Lacunas

- **`LACUNA-EMI-011`** (`RN-EMI-025`) — o Ceará mantém a contingência off-line admitida depois de vedar
  o caminho em hardware fiscal em 2026-01-01, e com que prazo? O dossiê **leu** o decreto que veda o
  hardware e remete ao manual de contingência, mas registra que **não confirmou** os atos estaduais
  posteriores (a página de notícias da SEFAZ CE estava indisponível). **Responde:** humano / SEFAZ CE.
  É a lacuna que decide se o **caso base tem contingência**.
- **`LACUNA-EMI-012`** (`RN-EMI-028`) — alguma UF pratica prazo de transmissão menor que o do manual? O
  texto oficial diz "atualmente", o que sinaliza que o prazo pode mudar. **Responde:** humano / SEFAZ da
  UF de cada cliente.
- **`LACUNA-EMI-013`** (§6) — qual modalidade adicional (F-72) se aplica a cada documento e a cada UF dos
  clientes-alvo, e qual o custo de habilitar cada uma? Sem isso, o produto especifica **uma**
  contingência (a off-line) e declara as outras como não habilitadas. **Responde:** humano, e nova
  pesquisa por UF.
- Herdadas e citadas aqui: `LACUNA-EMI-009` (a especificação não foi lida integralmente — nenhum campo é
  afirmado neste arquivo), `LACUNA-EMI-010` (a denegação foi reintroduzida?), `LACUNA-EMI-007` (prazo de
  guarda em anos), `LACUNA-EMI-014` a `016` (prazo, papel e escopo da capacidade de assinar — de que
  depende a contingência de `RN-EMI-027`, em `fiscal-custodia-e-trilha.md`), `LACUNA-RES-007` (caminho de
  correção depois de a janela fechar) e `LACUNA-FIS-001` (gravidade da falta dos campos de IBS/CBS).

## PERGUNTAS: para humano

1. **Segunda via impressa ou guarda eletrônica?** (`RN-EMI-026`, F-70.) A guarda eletrônica exige **termo
   prévio** do cliente assumindo responsabilidade integral pela guarda — decisão dele, com consequência
   jurídica, e que muda consumo de papel e tempo de impressora **no pico**. Qual é o padrão que
   oferecemos, e quem colhe esse termo?
2. **O caso base tem contingência?** (`LACUNA-EMI-011`.) Se o Ceará não admitir contingência off-line
   para esses contribuintes, o degrau 1 de `RN-EMI-016` não existe lá: o cliente-final sai com
   comprovante não fiscal sempre que o autorizador estiver fora. Isso muda a proposta de valor no
   primeiro cliente, não só a spec.
3. **Quem trata a fila de pendências, e onde?** (`RN-EMI-028`.) É trabalho de retaguarda diário, com
   prazos de horas: dono, gerente ou contador? A resposta define papel autorizado (D-03) e se existe
   superfície fora do caixa no MVP 1 — hoje nenhuma spec a prevê.
4. **Contingência é rotina esperada nesses clientes?** (`RN-EMI-032`, `RN-RES-010`.) Se a resposta for
   "todo dia", a prioridade de construção muda: a fila de pendências deixa de ser caminho de exceção e
   passa a ser tela de operação diária — e o passo 9 precisa saber isso antes de cortar.
5. **Guarda: quantos anos?** (`LACUNA-EMI-007`, `RN-EMI-017`.) Sem isso não há política de retenção, e o
   produto nasce guardando tudo para sempre — a escolha segura, e uma escolha com custo.
6. **`APU` está fora do MVP, mas a acessória de guarda e apresentação não é de `APU`** — é do emitente
   (F-64, F-65). Confirma que a Forja assume **guardar e apresentar** o documento emitido, ficando com o
   contador apenas apuração, escrituração e declaração?

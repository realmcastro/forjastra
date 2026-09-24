# Módulo `PCF` — Pedido pelo cliente-final

Spec profunda do módulo. A entrada curta é `catalogo-de-modulos.md` (`PCF`) — este arquivo aprofunda e
**não** a substitui. Código de `glossario.md` §4.3, imutável. Regras numeradas `RN-PCF-nnn`.

**A spec de `PCF` são dois arquivos.** Este, e o anexo `pedido-cliente-final-sessao.md`, de eixo
único — **a sessão externa**: quem fala pelo canal, sob que escopo, com que vida, com que limite, e por
que caminho lateral esse escopo viaja. Lá moram `RN-PCF-003`, `RN-PCF-014`–`018` e `LACUNA-PCF-4`–`5`;
a numeração é **uma só**, contínua entre os dois arquivos, e nada foi renumerado.

**O que este arquivo não faz:** não define tabela, coluna, rota, contrato técnico, tela, componente,
bloco ou stack — territórios de `arquiteto-dados`, `backend` e `ui`; **D-01..D-04 estão ABERTAS** e
nada aqui as presume. Não calcula dinheiro nem disponibilidade (§6), não decide prioridade de
construção (é do humano), e não afirma nada de fiscal: o que dependeria de norma está na §8 como
`LACUNA-PCF-n` ou remetido a `RN-RES-nnn`/`LACUNA-RES-nnn` de `verticais/restaurante.md`.

**`PCF` é cross-vertical.** Padaria com terminal de autoatendimento, loja que recebe pedido pelo site
e restaurante em que o cliente-final pede da própria mesa ligam o mesmo módulo: o módulo fala de
**canal**, **sessão externa** e **destino**, e "mesa"/"comanda" só aparecem como tipo de alvo que
`MSA` administra, nunca como pressuposto de regra.

## 1. Propósito e fronteira

**Propósito.** Dar ao cliente-final uma superfície para montar e enviar pedido por conta própria — no
dispositivo dele ou em terminal de autoatendimento — e fazer isso entrar no PDV como **pedido de
origem externa**, tratado pelo núcleo como qualquer pedido, com autor e canal declarados.

**O que o módulo é de verdade:** uma **superfície de coleta em rede não confiável**. O dispositivo do
cliente-final não é nosso, não é gerenciado, não é atualizado por nós, pode estar adulterado, e é
operado por alguém anônimo sem papel nenhum. O que vem dele é **intenção**; nada é fato. `PCF`
acrescenta ao núcleo três coisas e só: o canal, a sessão externa que dá contexto ao lançamento, e o
destino para onde o pedido vai.

**O que o módulo não é:** um segundo PDV. Nenhuma autoridade de operador existe no canal, que nunca é
caminho alternativo para operação sensível (`PN-11`); e a superfície de autoatendimento é **terminal
do estabelecimento** (`PN-03`) operado pelo cliente-final — o equipamento ser nosso não transfere
autoridade a quem está na frente dele.

**Fora da fronteira:** consumo em aberto, transferência, junção, divisão e fechamento (`MSA`); fila,
senha, estado de cumprimento e retirada (`CMP`); entrega em endereço (`ENT`); conteúdo publicável
(`PUB`); cobrança remota e confirmação de pagamento (`PGO`); cadastro e histórico de pessoa (`CLF`);
estado de produção e prazo (`COZ`); conversa em linguagem natural (`ATI`, que para atender
cliente-final exige `PCF`, mas de quem `PCF` não depende); pedido vindo de plataforma de terceiro
(`INT` — outro canal, outro interlocutor: é a plataforma, não a pessoa, e não herda estas regras).
Nada disso é importado: contrato ou evento (invariante 2). Com destino `MSA`, o consumo é o **mesmo**
de `mesa-comanda.md` e toda regra de lá vale igual — muda só o autor do lançamento.

## 2. O interlocutor e a sessão externa — no anexo

Está na §1 do anexo, com o que **D-03** precisa responder, listado e não escolhido. Daqui basta: o
contexto do lançamento é uma **sessão externa** anônima, escopada a um cliente (tenant), um
estabelecimento, um canal e um destino, sem papel nem promoção a papel; o escopo vem **dela**, nunca do
que o dispositivo envia (`RN-PCF-014`); ela nasce de um fato e **morre com o destino** (`RN-PCF-003`,
`RN-PCF-016`); em superfície compartilhada é da pessoa da vez; e o cliente (tenant) a revoga na hora.

## 3. Entidades conceituais

- **Canal** — a porta pela qual o pedido externo entra, com configuração própria: destino, modos
  admitidos, catálogo publicável exposto, horário, se aceita pagamento remoto. Um cliente (tenant)
  tem mais de um.
- **Superfície** — onde o cliente-final opera: dispositivo dele ou terminal de autoatendimento. É
  **configuração do canal**, não módulo novo (`catalogo-de-modulos.md`, `PCF`).
- **Sessão externa** — o contexto anônimo e escopado sob o qual ele vê e lança (§2). É o **autor** do
  lançamento externo, para efeito de `RN-MSA-004`.
- **Vínculo de sessão** — a ligação entre sessão e destino (consumo em aberto de `MSA`, ou pedido de
  `CMP`): nasce de um fato, tem vida limitada, não é transferível. A **referência de vínculo** que o
  cliente-final apresenta para criá-la é emitida **por destino**, não por alvo (`RN-PCF-003`).
- **Rascunho** — o pedido em construção dentro do canal. Não é pedido do núcleo, não gera trabalho,
  não reserva nada, morre sem consequência. **Submissão** é o ato de enviá-lo, e é o que produz
  lançamento ou pedido; **aceitação** é a decisão de o estabelecimento assumi-lo (`RN-PCF-008`).
- **Identificação opcional** — contato, nome ou documento fornecido porque a operação exige. Atributo,
  nunca credencial.
- **Observação do cliente-final** — texto livre escrito por ele. É **dado**, nunca instrução
  (`RN-PCF-013`).

## 4. Casos de uso

1. Abrir o canal, ver o catálogo publicável e montar rascunho sem se identificar.
2. Submeter para destino `MSA` (entra no consumo em aberto do alvo) ou para `CMP` (nasce pedido que alguém precisa aceitar).
3. Dois clientes-finais lançando no mesmo consumo, ao mesmo tempo, de dispositivos diferentes.
4. Perder a rede no meio da submissão e tentar de novo; ou tocar duas vezes.
5. Consultar o que ele mesmo lançou — e o acumulado, quando o cliente (tenant) permite.
6. Pedir a conferência, chamar o atendente, pedir para fechar; pagar pelo canal (`PGO`).
7. Informar endereço e contato para entrega (`ENT`), ou contato para aviso de pronto.
8. Tentar o que não é dele: retirar item, aplicar desconto, transferir, cancelar.
9. Operar terminal de autoatendimento logo depois de outra pessoa.
10. O canal ficar indisponível, sobrecarregado ou desligado no meio do serviço, com o estabelecimento vendendo normalmente.

## 5. Regras

Campos: **Enunciado** (testável) · **Motivo** · **Aceite** (caso concreto) · **Infeliz**. Numeração
imutável (`glossario.md` §4.2). Nenhuma regra é PROVISÓRIA: nenhuma depende de lacuna para existir.

**`RN-PCF-003` e `RN-PCF-014`–`018` estão no anexo** `pedido-cliente-final-sessao.md`, por eixo, não
por importância: são as regras da sessão externa. A sequência abaixo salta o `003` de propósito.

### RN-PCF-001 — O canal coleta e exibe; nada que vem dele é fato

**Enunciado:** item, quantidade, destino, modo e identificação chegam como **intenção** e são
resolvidos no servidor antes de qualquer efeito; preço, total, desconto, encargo, tributo e
disponibilidade nunca vêm do canal, e nenhum valor exibido é composto por ele.
**Motivo:** `PN-13`. O dispositivo é do cliente-final e pode estar adulterado — aceitar valor dele é
aceitar o preço que o comprador escolheu.
**Aceite:** submeter com preço, total e disponibilidade alterados no envio → os três são ignorados, o
servidor resolve pelo catálogo e pelo preço vigente, e o pedido nasce com o valor correto.
**Infeliz:** o item saiu do catálogo, ou o preço mudou entre exibir e submeter → a divergência é
apresentada ao cliente-final para nova decisão; nunca cobrada em silêncio pelo novo, nunca pelo antigo.

### RN-PCF-002 — Todo pedido externo nasce com canal, sessão, destino e modo declarados

**Enunciado:** submissão sem canal identificado, sessão válida, destino (`MSA` ou `CMP`) ou modo de
atendimento declarado é recusada na entrada; nenhum dos quatro é inferido depois.
**Motivo:** `RN-COZ-009` (canal que não informa destino gera trabalho que ninguém sabe de quem é) e
`RN-RES-009` (o documento depende do modo, que não se deduz do canal). O fechamento é o pior lugar
para descobrir que não há destino nem documento.
**Aceite:** submeter sem destino → recusado, com mensagem de operação e ação possível (`PN-17`), sem
efeito nenhum; com destino `MSA` → os itens entram no consumo, tendo canal e sessão como autor.
**Infeliz:** o canal admite mais de um modo e ele não escolheu → recusa pedindo a escolha; o canal não
escolhe por ele e o produto não usa "o mais comum" como padrão silencioso.

### RN-PCF-004 — Anônimo por padrão; identificação só onde a operação a exige

**Enunciado:** nenhum passo de `PCF` exige identificação para montar, submeter ou consumir; ela é
pedida apenas pela operação que não funciona sem ela, e o canal declara **qual** operação a exigiu.
**Motivo:** `fronteira-do-nucleo.md` §2.3 e a entrada `CLF` do catálogo: histórico de pessoa é `CLF`,
e coletar "porque um dia serve" é como o produto acumula dado que ninguém decidiu guardar.
**Aceite:** operar o canal inteiro em destino `MSA` sem informar nada → funciona; pedir entrega
(`ENT`) → o endereço é exigido, e o canal diz que é para a entrega.
**Infeliz:** o cliente (tenant) quer exigir identificação sempre → é configuração dele, e o que passa
a guardar entra no prazo declarado de `RN-PCF-012`. Se a obrigação documental exigir identificação em
alguma situação do canal: `[[LACUNA-PCF-2]]` — não afirmo que exige nem que não exige.

### RN-PCF-005 — O cliente-final vê o da própria sessão; ver mais é configuração, nunca padrão

**Enunciado:** por padrão o canal mostra o que **ele** lançou naquela sessão, com o valor informativo
correspondente; mostrar o consumo inteiro do alvo é configuração explícita do cliente (tenant), e em
nenhuma configuração o canal mostra outro consumo, outra venda, dado de operador, trilha, ou qualquer
coisa fora do escopo da sessão. A consulta é resolvida **a partir da sessão**, nunca de identificador
recebido do dispositivo (`RN-PCF-014`), e o que está fora do escopo responde **igual ao que não
existe** — sem confirmar nem negar a existência.
**Motivo:** `RN-MSA-003` outra vez. Quem abre sessão num alvo não é necessariamente do grupo que está
lá — pode ser quem passou, quem fotografou a referência, quem está no alvo ao lado. Expor o consumo
inteiro por padrão expõe o que estranhos pediram e, no fechamento, quanto vão pagar. E responder
"o consumo 45 não é seu" diferente de "não existe" já entrega a informação: enumerar identificadores
mapeia quem está em qual alvo, e presença é dado sensível (§7). É a exigência que `RN-ATI-010` faz na
conversa, aqui na consulta.
**Aceite:** duas sessões no mesmo consumo, configuração padrão → cada uma vê só os próprios
lançamentos; nenhuma consulta do canal devolve item da outra, nem o total do consumo. Pedir por
identificador o consumo do alvo vizinho, com a interface burlada → resposta **idêntica** à de
identificador inexistente, para o que existe e para o que não existe.
**Infeliz:** o cliente (tenant) liga a visão do consumo inteiro (grupo que confere junto) → vale para
todas as sessões do canal, todas veem o mesmo, e o acumulado continua informativo e vindo do backend
(`RN-MSA-001`, `PN-13`). Mesmo nessa configuração, a visão ampliada expõe **item e valor**, e nada
mais: nunca a identificação opcional de outra sessão, nunca a observação escrita por ela, nunca o
contato ou o endereço dela. "Sem camarão, sou alérgico" é dado de pessoa e de saúde, e a configuração
que faz o grupo conferir a conta junto não é autorização para desconhecidos lerem isso.

### RN-PCF-006 — Lançamento externo é aditivo, tem autor, é idempotente e convive com outras sessões

**Enunciado:** a submissão produz lançamento **aditivo**, com canal e sessão registrados como autor e
com o instante do fato; repetir a mesma submissão — toque duplo, reenvio, reinício do dispositivo,
resposta perdida — produz o **mesmo** resultado. "A mesma submissão" é identificada dentro do escopo de
**uma sessão e um destino**: o que identifica a repetição vale só ali, não é comparável entre sessões,
e a mesma chave apresentada por outra sessão é submissão **nova**, nunca repetição — em nenhuma
hipótese devolve o resultado de outra sessão. Duas ou mais sessões podem lançar no mesmo consumo ao
mesmo tempo: nada é sobrescrito, nada é fundido, nada é descartado por concorrência.
**Motivo:** `PN-02` e `RN-MSA-011`: lançamento é a única operação de consumo que converge sem
conflito, e é por isso que é a única que o canal externo faz. A rede do cliente-final é a pior do
sistema (reenvio é rotina) e quatro pessoas no mesmo alvo pedindo ao mesmo tempo é a operação normal.
Idempotência **sem escopo declarado** deixa de ser garantia e vira exposição: se o que identifica a
repetição for escolhido pelo dispositivo e comparado fora da sessão, uma sessão que colida com a de
outra recebe o resultado dela — os itens e o valor de um estranho — em vez de lançar o seu.
**Aceite:** submeter a mesma cesta três vezes, uma com a resposta derrubada no meio → um único
conjunto de lançamentos, cada item uma vez, com canal, sessão e instante na trilha. Três sessões
lançando simultaneamente no mesmo consumo → todos os itens aparecem, uma vez cada, com autor distinto
por sessão, e nenhum lançamento se perde. A sessão B apresenta a chave da sessão A → é submissão nova
de B, com os itens de B, e a resposta não traz nada de A (item, valor ou existência); a mesma chave
apresentada depois do encerramento do destino não recupera nada, porque a sessão já morreu
(`RN-PCF-016`).
**Infeliz:** duas sessões submetem o **mesmo** item ao mesmo tempo → são dois lançamentos, porque duas
pessoas pedirem a mesma coisa é rotina: o produto **não** deduplica por semelhança, só por repetição
da mesma submissão. Quem quer **mesmo** o item repetido faz submissão nova, distinguível da repetição
pelo produto. Alterar quantidade de item já lançado não existe aqui: é retirada autorizada
(`RN-MSA-004`) mais lançamento novo.

### RN-PCF-007 — O cliente-final nunca executa operação não aditiva nem operação sensível

**Enunciado:** a sessão externa executa **só o aditivo** — submeter lançamento e o texto que o
acompanha. Toda capacidade que não seja aditiva, ou que seja sensível, é **negada por padrão, esteja
ou não nomeada nesta spec**: retirar item, transferir, juntar, separar, encerrar ou cancelar consumo,
cancelar venda, aplicar desconto ou cortesia, alterar preço, quantidade lançada, endereço ou dado de
entrega, mudar etapa de produção, reordenar fila, alterar catálogo, disponibilidade ou configuração,
autorizar operação sensível. **Capacidade nova de qualquer módulo — inclusive de módulo que ainda não
existe — nasce negada ao canal até declaração explícita de que é aditiva**, e a declaração é por
capacidade, nunca por módulo inteiro. Pedido dele nesse sentido é **proposta** a quem tem papel,
verificada no backend, e sujeita ao limite por sessão de `RN-PCF-017`.
**Motivo:** `PN-11` e `RN-MSA-011`: as operações não aditivas são recusadas até para o operador sem
estado confirmado — dá-las a um anônimo em rede não confiável abre a porta de furto de `RN-MSA-004`
para fora do estabelecimento. E lista enumerativa envelhece: com `ENT` ligado, **alterar o endereço de
um pedido já aceito** não estava em nenhuma lista, não é operação "sensível" pelo vocabulário antigo, e
desvia a entrega — mercadoria e dinheiro para outro lugar, sem burlar nada. Regra por propriedade não
tem esse buraco; regra por lista tem um a cada módulo novo.
**Aceite:** chamar qualquer operação não aditiva direto pelo canal, com a interface burlada → negado
**no backend**, e a tentativa entra na trilha; pela via legítima, chega ao operador como proposta
pendente. Ligar um módulo que expõe capacidade gravável nova → nenhuma delas é alcançável pela sessão
externa antes de ser declarada aditiva, sem que ninguém precise editar esta regra; alterar endereço de
pedido já aceito → negado, e vira proposta a quem tem papel.
**Infeliz:** ele desiste de item já lançado → o canal registra proposta de retirada ao responsável;
enquanto ninguém autorizar, o item continua lançado, e se já virou trabalho o destino dele é regra de
`COZ` (`RN-COZ-007`). Capacidade legitimamente aditiva de módulo novo fica indisponível ao canal até
alguém declará-la → é o custo aceito da falha fechada, e o caminho é a declaração, não a exceção.

### RN-PCF-008 — Aceitação automática só por condição objetiva; recusa por juízo é humana

**Enunciado:** com destino `MSA` a submissão é aceita automaticamente, porque é aditiva e equivale ao
lançamento do atendente. Com destino `CMP` o padrão é **aceitação explícita de operador** antes de o
pedido virar trabalho ou compromisso. Recusa automática existe só por condição objetiva verificável no
servidor — fora do horário declarado, estabelecimento fechado, modo não habilitado, item inexistente
no canal, indisponibilidade vinda do catálogo ou de `EST`, destino inválido. Nenhuma automação aceita
nem recusa por juízo.
**Motivo:** `PN-16`. Em `MSA` ele está no estabelecimento e o erro é corrigível no ato; em `CMP` o
estabelecimento assume produzir para quem não está presente, e aceitar o que não se cumpre custa
insumo e uma pessoa esperando. Exigir confirmação item a item no salão, no pico, mataria o canal — a
diferença é deliberada.
**Aceite:** submeter para `CMP` fora do horário → recusado automaticamente com o motivo objetivo;
dentro do horário → fica **pendente de aceitação**, e ele vê que está pendente, não que foi aceito.
Submeter para `MSA` → aceito e visível no consumo, sem espera.
**Infeliz:** o cliente (tenant) configura aceitação automática em `CMP` → é direito dele (`PN-20`), com
a consequência declarada: pedido aceito sem ninguém olhar vira trabalho, e recusar depois é
cancelamento com o cliente-final já avisado. Ninguém aceita para "resolver depois".

### RN-PCF-009 — O canal não conclui venda, não fecha consumo e nada entra depois do fechamento

**Enunciado:** o dispositivo nunca conclui venda, nunca fecha consumo e nunca declara pagamento —
pagamento pelo canal é fato de `PGO` e do núcleo, e fechamento disparado por pagamento confirmado é
configuração do cliente (tenant), acionada pelo **fato**, não pela afirmação do dispositivo. E
submissão dirigida a consumo em fechamento, encerrado ou cobrado é recusada, com o estado apresentado.
**Motivo:** `RN-MSA-008` e `PN-13`. Fechamento é operação não aditiva: delegá-la a um dispositivo em
rede não confiável é cobrança dupla ou consumo encerrado sem dinheiro. E item que entra depois da
cobrança é item não cobrado — ou cobrado de quem já pagou e foi embora.
**Aceite:** afirmar "pago" pelo canal sem confirmação de `PGO` → nada acontece; com confirmação e
fechamento por pagamento ligado → o consumo fecha uma vez, e repetir devolve o mesmo resultado. O
operador inicia o fechamento e ele submete no mesmo instante → recusado, e o item **não** aparece na
cobrança.
**Infeliz:** pagamento remoto indefinido → o consumo **não** fecha e **não** é bloqueado: segue aberto
e cobrável no balcão, com a pendência visível a quem opera (`PN-15`). Submissão que saiu antes e
chegou depois do fechamento vale pela ordem do fato no servidor: recusada, apresentada a quem opera,
resolvida por decisão humana — nunca reabertura automática, nunca descarte em silêncio.

### RN-PCF-010 — O canal externo nunca degrada a operação interna

**Enunciado:** indisponibilidade, sobrecarga, abuso ou desligamento do canal não afetam lançar,
cobrar, concluir venda ou emitir documento no estabelecimento; e desligar o canal — um, todos, ou o
módulo — é ação do cliente (tenant), imediata, sem chamado e sem deploy.
**Motivo:** `PN-01`, `PN-03` e `PN-20`. O canal externo é a única superfície que um estranho pode
inundar de fora. Se a operação interna dependesse dele, um abuso na rua pararia o caixa — que é o
único caminho que não aceita regressão.
**Aceite:** desligar o canal no meio do serviço → nenhuma sessão externa continua válida, nenhum
pedido novo entra, e o fluxo interno (abrir, lançar, conferir, repartir, fechar) roda igual; os
pedidos externos já aceitos continuam sendo cumpridos.
**Infeliz:** o canal é inundado de submissões → o cliente (tenant) vê o que está acontecendo em
linguagem de operação (`PN-15`, `PN-17`) e pode limitar ou desligar; nenhum pedido interno é
descartado para dar lugar a externo, e a prioridade declarada é sempre a operação interna.

### RN-PCF-011 — Prazo, disponibilidade e estado exibidos são de quem os produz

**Enunciado:** o canal exibe prazo apenas quando é a promessa configurada pelo cliente (tenant), e
exibe disponibilidade e estado apenas como vêm do catálogo, de `EST`, de `COZ` ou de `CMP`; não
estima, não arredonda, não converte e não preenche lacuna com valor próprio.
**Motivo:** `RN-COZ-011` — tempo é medição, não promessa; `COZ` não entrega estimativa e o canal não
tem de onde tirar uma. Prazo inventado exibido a quem espera vira reclamação no balcão e depois
desconto que ninguém autorizou.
**Aceite:** canal com `COZ` ligado e sem promessa configurada → nenhum prazo é exibido; ele vê o
estado que existe (recebido, em produção, pronto) ou nada. Com promessa configurada → exibe a do
cliente (tenant), identificada como dele.
**Infeliz:** ele pergunta quando fica pronto e não há promessa nem estado → a resposta é que não
sabemos e o caminho é o atendente; nunca uma estimativa produzida pelo canal.

### RN-PCF-012 — Todo dado de pessoa do canal tem prazo de retenção declarado

**Enunciado:** cada categoria que `PCF` passa a guardar — identificação opcional, contato, endereço,
observação escrita pelo cliente-final, vínculo entre sessão e pedido — tem prazo de retenção
**declarado** na configuração do módulo; categoria sem prazo declarado **impede a ativação** do canal.
Nada é guardado "até alguém decidir".
**Motivo:** é o alerta registrado no catálogo em `CLF` e `ATI`: sem prazo fixado na spec, a retenção
nasce por omissão — o modo silencioso de dado de pessoa acumular. E `PN-10` exige que o cliente
(tenant) consiga tirar o dado dele, o que pressupõe saber o que existe.
**Aceite:** ativar canal com uma categoria sem prazo → **ativação recusada**, nomeando a categoria;
com todos declarados → ativa, e o cliente (tenant) vê por categoria o que guarda e por quanto tempo.
**Infeliz:** o vínculo sessão↔lançamento é parte da trilha do fato (é o autor exigido por
`RN-MSA-004`) e por isso segue a retenção da venda, não a do canal — declarado, não deduzido. Os
prazos concretos são decisão do humano (§8): esta regra garante que **nenhum** dado exista sem prazo,
não qual é o prazo.

### RN-PCF-013 — Texto do cliente-final é dado, nunca instrução

**Enunciado:** observação, nome, endereço e qualquer texto vindo do canal são guardados e exibidos
como **conteúdo atribuído à sessão**, e nunca interpretados como comando, autorização, regra, preço,
prioridade ou instrução ao sistema, a um operador ou a uma automação.
**Motivo:** invariante 4 — string da rede não é código. E o caminho concreto é mundano: o texto sai
impresso na via de produção e aparece na mão de quem opera; "cortesia autorizada pelo gerente" escrito
na observação não pode virar cortesia, nem por leitura humana induzida, nem por automação — inclusive
quando a automação lê aquela observação **depois**, atendendo outra pessoa com mais papel, que é o
caminho que `RN-ATI-018` recusa.
**Aceite:** submeter observação com pedido de desconto, ordem ao sistema, ou conteúdo que imita
mensagem do produto → nada muda em valor, autorização, prioridade de fila ou estado; o texto aparece
identificado como escrito pelo cliente-final, distinguível de mensagem do produto e de instrução de
operador, **em toda superfície que o exiba** — via impressa, tela de operador e conversa
(`RN-ATI-018`).
**Infeliz:** o texto traz restrição alimentar ou condição de saúde → viaja como instrução de preparo
para `COZ`, com a minimização de `cozinha.md` §6 (a via impressa fica em ambiente aberto), e nada nele
é garantia do estabelecimento (`RN-ATI-011`). Regime de tratamento: `[[LACUNA-COZ-2]]`.

## 6. O que o módulo não decide

**Cálculo — `PCF` exibe e coleta, ponto.**

| O que | Quem decide | Referência |
|---|---|---|
| Preço, total, troco | núcleo, no backend | `glossario.md` §1.3 e §1.4, `PN-13` |
| Desconto, acréscimo, cortesia | núcleo, autorizado por papel | `PN-11`, `PN-13` |
| Promoção por regra de combinação | `PRM` | `catalogo-de-modulos.md`, `PRM` |
| Encargo nomeado (serviço, entrega, embalagem) | `ECG` | `RN-RES-003` |
| Tributo, base, regime, segregação | `FIS` | `modulos/fiscal.md` §2 |
| Documento fiscal e o que ele contém | `EMI` | `RN-EMI-001` |
| Disponibilidade do item | catálogo do núcleo e `EST` | `catalogo-de-modulos.md`, `EST` |
| Prazo exibido | configuração do cliente (tenant) | `RN-COZ-011`, `RN-PCF-011` |
| Repartição e fechamento do consumo | `MSA` + núcleo | `RN-MSA-007`, `RN-MSA-008` |

**Automação.** `PCF` não tem automação que julgue: a única decisão automática é aceitar/recusar por
condição objetiva verificável no servidor (`RN-PCF-008`).

| Decisão | Quem | Por quê |
|---|---|---|
| Aceitar submissão em destino `MSA` | automático | aditiva, equivale ao lançamento do atendente |
| Aceitar pedido em destino `CMP` | operador (padrão) | compromete insumo e promessa a quem não está presente |
| Recusar por horário, modo, item inexistente, indisponibilidade | automático | condição objetiva, sem juízo |
| Recusar por juízo (suspeita, volume estranho) | operador | é decisão de negar atendimento a uma pessoa |
| Desconto, cortesia, ajuste de preço | operador com papel | `PN-11`, `PN-13`, `PN-16` |
| Cancelar item, pedido ou venda | operador com papel | `PN-07`, `RN-MSA-004` |
| Fechar consumo, concluir venda | núcleo, por fato de pagamento ou ação de operador | `RN-MSA-008`, `RN-PCF-009` |
| Prometer prazo | ninguém: só a promessa configurada | `RN-COZ-011` |

Onde a condição não é objetivamente verificável, o caminho é o operador — não existe "decide o que
parecer melhor". Conversa em linguagem natural, e o que acontece quando a automação **não sabe**, são
de `ATI`; `PCF` funciona inteiro sem ela.

## 7. Contrato do módulo

**Expõe:** o pedido de origem externa, marcado por canal, sessão e modo declarado · evento de
submissão, de aceitação e de recusa (com o motivo objetivo) · evento de abertura e encerramento de
sessão externa · a proposta que o cliente-final fez e que exige papel (retirada de item, chamada de
atendente, pedido de fechamento) · o estado do canal (disponível, limitado, desligado) para quem opera.

**Exige do núcleo:** pedido mutável e venda concluída imutável · **todo** cálculo de valor e a decisão
de disponibilidade (§6) · catálogo com item, código e preço vigente · idempotência (`PN-02`) ·
operador autenticado com papel verificado no backend e trilha, para tudo o que o cliente-final apenas
propõe · modo de atendimento como atributo declarado do pedido (`RN-RES-009`) · estabelecimento, fuso
e moeda do cliente (tenant) · isolamento por cliente (tenant) · a identidade de sessão externa, o
escopo resolvido na borda e a revogação imediata, do anexo — **requisito para D-03**.

**Exige de outros módulos e ativação: `PCF` não liga isolado.** Exige `PUB` (sem conteúdo publicável
não há o que exibir) e **um destino declarado** — `MSA` para consumo em aberto, `CMP` para
fila/retirada; sem destino a ativação é **recusada**, não degradada (`catalogo-de-modulos.md`, `PCF`;
`RN-RES-008`, caminho infeliz), e ligar com destino `MSA` e `MSA` desligado é recusa na ativação com o
motivo, nunca tela quebrada no serviço. Usa `PGO` no pagamento remoto, `CLF` quando o pedido é
identificado, `ENT` na entrega, `COZ`/`CMP` quando exibe estado. Nenhum é importado: contrato ou evento.

**Desligado:** todo pedido nasce de um operador; nenhuma superfície externa existe; nenhuma tela,
termo ou etapa cita canal, sessão externa ou autoatendimento (`PN-04`). Nada quebra: `PCF` não é
condição para vender (`fronteira-do-nucleo.md` §3.4) e pedido por telefone continua anotado pelo
operador, como hoje.

**Sensível:** identificação opcional e contato · endereço quando há `ENT` · a observação escrita por
ele, texto livre que pode conter qualquer coisa, inclusive condição de saúde (`RN-PCF-013`,
`[[LACUNA-COZ-2]]`) · o vínculo entre sessão externa e pedido, que liga uma pessoa anônima ao que ela
consumiu · o próprio fato de existir sessão em um alvo, que revela presença. Nenhum dado de pagamento
existe em `PCF`: meio e resultado são do núcleo e de `ADQ`/`PGO`. Toda categoria tem prazo declarado
(`RN-PCF-012`); proteção é de `seguranca`, e os prazos são do humano (§8).

**Registra** (acrescentado em 2026-09-12, `CLAUDE.md` §7.10): a **submissão**, marcada por canal,
sessão e modo declarado · a **aceitação** e a **recusa**, esta com o motivo objetivo · a abertura e o
encerramento da sessão externa, inclusive por revogação (`RN-PCF-016`) · cada proposta que exige
papel — retirada de item, chamada de atendente, pedido de fechamento — e o desfecho dela · o estado
do canal (disponível, limitado, desligado) para quem opera.

**Não registra**, e cada um com o motivo:

- **Quem é a pessoa do outro lado.** A sessão externa é anônima por construção e morre com o destino
  (`RN-PCF-016`); reconhecer a mesma pessoa entre sessões é de `CLF`, opt-in, e **não entra por
  dependência**.
- **O texto dele como campo de decisão.** A observação é preservada literal e opaca, com origem
  declarada (`RN-PCF-013`, `RN-OFF-027`): o que entra em fato e em contagem é presença, nunca
  conteúdo.
- **O que ele tocou na tela.** Mesma recusa, com as quatro partes, de `fatos-de-operacao.md` §6,
  item 4 — os marcos por operação respondem "onde trava" sem gravar sessão de ninguém.
- **Duas ausências que não são decisão.** O **rascunho** que ele monta e abandona sem submeter (§2,
  "morre sem consequência") e a **divergência entre o que o canal exibiu e o que foi submetido**
  (`RN-PCF-001`, infeliz) não produzem fato hoje. São os achados 2.4 e 2.5 de
  `captura-varredura-invariante-10-2026-09-11.md`, ausência **acidental**, com card e dono — e o
  primeiro é o único lugar do produto em que o cliente-final opera sozinho, então o que ele desiste
  de fazer não aparece em nenhum outro.

## 8. Lacunas e pendências

Perguntas abertas em 2026-08-22. Nenhuma bloqueia o comportamento das regras da §5. `LACUNA-PCF-4`
(limites por sessão) e `LACUNA-PCF-5` (referência não enumerável) estão na §4 do anexo — dono: humano.

- `[[LACUNA-PCF-1: o documento fiscal (ou o comprovante) pode ser entregue ao cliente-final pelo próprio canal digital, ou há exigência de entrega em outra forma no momento da operação? — sem fonte em 2026-08-22]]`
- `[[LACUNA-PCF-2: pedido por canal remoto exige identificação do destinatário no documento em alguma situação (e qual), ou a identificação segue opcional como na venda de balcão? — sem fonte em 2026-08-22]]`
- `[[LACUNA-PCF-3: pedido montado pelo cliente-final e retirado presencialmente tem indicador de presença próprio? É LACUNA-RES-002 visto do canal; não afirmo nada além dela — sem fonte em 2026-08-22]]`

**Pendente com o humano, não com fonte:**

1. **Os prazos de retenção por categoria** de `RN-PCF-012` (identificação opcional, contato, endereço,
   observação, vínculo sessão↔pedido). A regra garante que nenhuma categoria exista sem prazo; **qual**
   é o prazo é decisão dele — sem resposta, a ativação fica recusada por construção, o que é melhor
   que retenção por omissão.
2. **Aceitação em `CMP` é confirmada por operador por padrão** (`RN-PCF-008`). Se os clientes-alvo
   operam volume em que isso é inviável, o padrão muda com a consequência declarada — decisão dele.
3. **Existe superfície de autoatendimento nos clientes-alvo?** Muda o peso do item 4 da §1 do anexo
   (sessão em superfície compartilhada) e a necessidade de `PER` no canal.

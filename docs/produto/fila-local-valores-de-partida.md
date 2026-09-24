# Continuidade offline — os valores de partida, decididos em 2026-09-23

> **Irmão de `operacao-offline-e-sincronizacao.md`, `fila-local-conteudo-e-repouso.md`,
> `fila-local-autoridade-e-identidade.md` e `offline-grandezas-e-orcamento.md`, com o mesmo peso
> normativo.** Nasceu em 2026-09-23 (`T-0014`, passo A.2c, item `F-018`), quando o humano delegou as
> decisões pendentes pelo critério de escalabilidade
> ([[convention-decisao-delegada-com-aviso-no-modulo]]). Registro da decisão:
> [[decision-valores-de-partida-da-continuidade-offline]].
>
> **Eixo da partição.** `offline-grandezas-e-orcamento.md` nomeia cada grandeza com unidade e sem valor.
> Este arquivo guarda o **valor de partida** de cada uma que estava em lacuna de produto: o padrão
> declarado de `RN-OFF-028` (infeliz), mais o piso e o teto que a configuração do cliente não atravessa.
> Grandeza lá, valor aqui: quem revisa um número encontra todos no mesmo lugar, com o motivo ao lado.
>
> **O que os números são, e o que não são.** Nenhum foi medido. Cada um é configuração por cliente com
> vigência (`RN-OFF-028`), e o valor escrito é o que vale quando o cliente não configurou nada. Nenhum é
> orçamento de `performance`, e cada regra nomeia a série que o revisa. Rever é `decision` registrada,
> nunca ajuste de código.
>
> **Correção que isto impõe à regra vigente.** `RN-OFF-028` (aceite) e `RN-OFF-029` (aceite) dizem que
> nenhuma spec contém o número. A partir de 2026-09-23 os padrões abaixo estão escritos, por decisão
> delegada; o arquivo dono daquelas duas regras é `offline-grandezas-e-orcamento.md`, e a alteração no
> lugar está pedida em `T-0014` (A.2c). Até ela chegar, o conflito é este, declarado.
>
> `RN-OFF-034` a `RN-OFF-038`, `RN-OFF-040` e `RN-NUC-080`. Numeração contínua e imutável entre os irmãos
> (`glossario.md` §4.2); `RN-OFF-039` mora em `fila-local-conteudo-e-repouso.md`.

## 1. As relações que valem em qualquer configuração

Os tetos e pisos foram escolhidos para que estas relações nunca se invertam, qualquer que seja o valor
que um cliente publique.

| Relação | Por quê |
|---|---|
| aviso da autoridade retida < fim da validade dela | o aviso é fração da validade (`RN-OFF-034`) |
| validade da autoridade retida (teto 12 h) < prazo da habilitação (piso 24 h) | revogação de pessoa é frequente e prevista; perda de dispositivo é rara (`fila-local-autoridade-e-identidade.md` §5, `LACUNA-OFF-017`) |
| aviso da habilitação < vencimento dela | fração do prazo (`RN-OFF-035`) |
| janela do desligado identificável ≤ prazo da habilitação | depois do prazo o terminal não pratica ato ordinário nenhum (`RN-OFF-036`) |
| escalada da fila < prazo do item | fração do intervalo até o prazo (`RN-OFF-040`) |

## 2. As regras

### RN-OFF-034 — A autoridade retida vale 8 horas sem contato, contadas pelo maior entre funcionamento e calendário, e quem a porta é avisado quando resta um quarto

**Enunciado** a validade de `RN-OFF-024` é contada, desde o último contato em que o servidor conferiu a
autoridade, pelo **maior** de dois valores: as **horas de funcionamento sem contato**, acumuladas e
persistidas pelo mesmo contador de `RN-OFF-035`, e as **horas de calendário** pelo relógio do dispositivo.
O funcionamento é o piso: atrasar o relógio não estende a validade, e adiantá-lo só a encurta. O
calendário conta o tempo desligado: a validade corre com o terminal ligado ou não. Padrão **8 h**. O
cliente configura entre **0 h** (nenhuma operação sensível sem contato) e **12 h**; acima de 12 h a
publicação é recusada. Quem porta a autoridade é avisado quando resta **um quarto** da validade
configurada (padrão: aviso às 6 h sem contato), e o aviso diz o que deixa de ser possível e a que horas.
O contador avança e é persistido antes de cada operação sensível, com o requisito do acompanhante escrito
em `RN-OFF-035`. Fecha `LACUNA-OFF-011` (= `LACUNA-NUC-008`) e `LACUNA-NUC-033`.
**Corrigido em 2026-09-23** (`SEG-T14-01`, `T-0014`): o texto dizia "horas sem contato" sem unidade, e a
leitura natural era calendário. Calendário se estende atrasando o relógio, que é o que `RN-OFF-035`
aceite (2) proíbe; a unidade passou a ser tempo de funcionamento.
**Corrigido de novo em 2026-09-23** (`T-0014`, resposta do thread "maior dos dois"): contada só em
funcionamento, a autoridade atravessava a noite no terminal desligado e chegava à manhã com o que sobrou
dela. A contagem passou a ser o maior entre funcionamento e calendário. `RN-OFF-035` continua em
funcionamento puro.
**Motivo** o eixo é pessoas com papel sensível × terminais sem contato. Desde `RN-OFF-032` a validade não
para o balcão, então cada hora a mais custa uma coisa só: uma hora em que quem já perdeu o papel ainda faz
sangria ou abre a gaveta fora de venda num terminal sem rede. 8 h é um período de trabalho: o gerente
verificado na abertura cobre as sangrias do expediente se o link cair. 12 h impede que a autoridade
atravesse para o expediente seguinte, com o terminal ligado ou desligado à noite, porque o calendário
conta a noite. O calendário cabe aqui e não em `RN-OFF-035` porque este vencimento só recusa operação
sensível e nenhuma venda para por ele (`RN-OFF-032`): o argumento de `PN-01`, que tirou o calendário
daquela regra, não se aplica. Contra quem atrasa o relógio do dispositivo, o limite é o piso de
funcionamento, 12 h ligado no teto; o calendário protege o caso honesto, não esse. Zero é aceito porque é
mais restritivo e não tira venda de ninguém. O aviso é fração, e não minutos fixos, para cair antes do fim
em qualquer valor configurado. Recusado: validade ligada à sessão de caixa, porque quem porta a autoridade
sensível (`manager`) muitas vezes não tem sessão aberta. Recusado: funcionamento puro, pelo efeito da noite
desligada descrito na correção acima.
**Aceite** (1) gerente autenticado às 19h, link caído às 20h, terminal ligado o tempo todo, padrão: às 02h
o terminal avisa que a autoridade vence às 04h; às 04h01 a sangria é recusada com "esta operação exige
reconectar" (`RN-OFF-024` b) e a venda em espécie continua (`RN-OFF-032`). (2) Mesmo caso com o relógio
do dispositivo atrasado quatro horas às 23h: a sangria é recusada às 04h01 reais, igual, pelo
funcionamento. (3) Noite desligada: gerente verificado às 19h, link caído logo depois, terminal desligado
às 23h com 4 h de funcionamento e religado às 07h sem contato. A autoridade está vencida pelo calendário
(12 h desde 19h): a sangria das 07h05 é recusada com "esta operação exige reconectar", e a venda em
espécie continua. (4) Cliente que publica 14 h: recusado, com o teto dito. (5) Cliente com 0 h: sangria
sem contato recusada desde o primeiro minuto, venda intacta.
**Infeliz** o relógio do dispositivo é atrasado durante a queda → a validade vence pelo funcionamento,
nunca depois dele; adiantado → vence mais cedo, pelo calendário, e nenhuma venda para por isso. Nenhuma
renovação acontece sem contato (`RN-OFF-024` d). Contador ilegível → o mesmo desfecho de `RN-OFF-035`
infeliz, e aqui ele não custa venda nenhuma, só a operação sensível até o contato.
**Revisão** recusa `authority_absent` de operação sensível em `D1`/`D2` (`RN-NUC-043`) contra a
permanência sem contato (`fatos-de-operacao.md` §5): recusa concentrada logo depois do vencimento, em
quedas longas, é o sinal de validade curta demais naquele cliente.

### RN-OFF-035 — A habilitação a vender vale 72 horas de funcionamento sem contato, avisa com um terço de antecedência, e mudar o relógio não a estende

**Enunciado** o prazo de `RN-OFF-032` (i) é contado em **horas de funcionamento sem contato**: o tempo em
que o terminal esteve ligado desde o último contato bem-sucedido com o servidor, acumulado e persistido no
terminal. Contato só com a LAN (`D1`) não conta como contato; tempo desligado não conta como
funcionamento. Padrão **72 h**, configurável entre **24 h** e **168 h**. O aviso ao operador começa
quando resta **um terço** do prazo (padrão: a partir de 48 h de funcionamento sem contato) e se repete a
cada sessão de caixa aberta até o contato voltar. **Mudar o relógio do dispositivo não altera a contagem,
e reiniciar ou perder energia não encerra o prazo nem o zera.** Fecha `LACUNA-OFF-017`.
**Requisito do acompanhante** (`F-017`): o contador avança e é persistido **antes de cada ato ordinário**,
e gravação interrompida no meio preserva o valor anterior. Nenhum ato ordinário é praticado com mais tempo
de funcionamento do que o contador gravado registra. Sem isso, reinícios seguidos, cada um antes da
gravação, zeram o avanço, e o prazo deixa de existir para quem desliga o terminal de hora em hora.
**Corrigido em 2026-09-23** (`SEG-T14-01`, `T-0014`): o texto contava "horas sem contato" e prometia ao
cliente três dias, e no teto uma semana, de calendário. Sem hora confiável no terminal offline, só há duas
contagens possíveis: por relógio de parede, que se estende atrasando o relógio e fura o aceite (2); ou por
tempo de funcionamento, que resiste ao relógio e não tem limite de calendário. A regra passou à segunda, e
a promessa de calendário saiu.
**Motivo** o eixo é terminais × duração da queda × a chance de um deles estar em mãos erradas. Com 72 h, a
loja cujo link cai na sexta às 20h e volta na segunda de manhã (cerca de 60 h, com o terminal ligado o tempo
todo, que é o pior caso) vende o sábado inteiro. O terminal furtado e mantido offline vende em nome do
emitente por no máximo **72 h de funcionamento**; em calendário não há limite contra quem o mantém offline
e o liga pouco (ligado 4 h por dia, são 18 dias), e o controle real desse caso é a revogação no primeiro
contato. É essa a janela declarada ao cliente (`RN-EMI-038` c). O piso de 24 h existe porque abaixo dele
uma noite sem link para o caixa da manhã seguinte, e a regra escrita para não parar o caixa passaria a
pará-lo (`PN-01`). O teto de 168 h limita o pior caso em funcionamento: nenhuma configuração deixa um
terminal perdido praticar ato ordinário por mais de 168 h ligado sem contato. Um terço dá, no padrão, 24 h
de funcionamento para levar contato ao posto antes de ele parar. Contar funcionamento, e não calendário, é
também o que impede a queda de energia de parar o caixa: o tempo desligado não consome prazo. Recusado:
contar em dias de operação, porque o dia depende do fuso publicado e da hora do terminal, e a hora do
terminal é o que o dispositivo furtado controla. Recusado: tratar reinício como prazo vencido, porque
uma queda de energia com o link caído pararia o caixa (`PN-01`).
**Aceite** (1) sem contato desde sexta 20h, terminal ligado o tempo todo: sábado vende; domingo 20h começa
o aviso; segunda 20h o terminal para as nove linhas do ato ordinário (`RN-OFF-032`) dizendo que o que
restabelece é contato; às 20h05 o link volta e ele vende de novo, sem ato de papel nenhum (`RN-NUC-061`).
(2) com 20 h de funcionamento sem contato, o relógio do dispositivo é atrasado dois dias: o prazo vence
nas mesmas 72 h de funcionamento. (3) com 30 h de funcionamento sem contato, a energia cai por 10 h e
volta: o terminal vende ao religar, o contador está em 30 h e o aviso começa às 48 h de funcionamento.
(4) cinco reinícios seguidos, cada um depois de uma hora ligado com venda: o contador registra pelo menos
5 h. (5) terminal furtado, mantido offline e ligado 4 h por dia: para no 18º dia de calendário, e antes
disso só o contato o para. (6) cliente publica 12 h ou 10 dias: recusado, com o limite dito.
**Infeliz** o contador gravado está ilegível ou ausente (armazenamento corrompido ou editado) → o prazo
é tratado como vencido e o que restabelece é contato; nunca recomeça como se tivesse havido contato,
porque apagar o contador seria o jeito de zerar o prazo. Queda de energia não cai neste caso, pelo
requisito acima. A tentativa de ato ordinário depois do vencimento é recusa `no_contact` (`RN-NUC-043`).
**Revisão** os marcos de aviso e de vencimento (§3) contra a permanência sem contato: vencimentos em quedas
que terminaram poucas horas depois pedem prazo maior naquele cliente. Valor conferido por `seguranca` em
2026-09-23 (`T-0014`): o teto contém o ladrão comum, e contra quem controla o armazenamento do
acompanhante nenhum limite local vale, qualquer que seja o número.

### RN-OFF-036 — O conjunto de identificação se reconcilia a cada contato e em até 5 minutos depois de mudar, e não tem tamanho máximo de produto

**Enunciado** (a) todo contato do terminal com o servidor reconcilia o conjunto retido de `RN-OFF-033`,
sem esperar ciclo. (b) Com contato, mudança no conjunto (operador desligado, atribuição nova) chega ao
terminal em até **5 min**; padrão 5, teto 15, e o cliente não configura acima. (c) O conjunto é o dos
operadores com atribuição vigente naquele estabelecimento, **sem teto de quantidade**. A reconciliação
nunca atrasa nem bloqueia a venda: enquanto ela não chega, vale o conjunto retido. Fecha `LACUNA-OFF-016`
**sem medida**, e isso fica declarado.
**Motivo** com (a) e (b), a janela em que um desligado ainda é identificável passa a ser a duração da queda
mais 5 min, limitada pelo prazo de `RN-OFF-035`; a queda é a única parte dela que ninguém controla. O custo
de reconciliar cresce com terminais e com mudanças, não com o tempo parado. Teto de quantidade faria o
operador de número N+1 não vender por um motivo sem relação com risco; o tamanho cresce com operadores por
estabelecimento, que o negócio limita, e o custo por membro é o que `performance` mede. Recusado: frequência
fixa por relógio, que deixa o desligado identificável até o próximo ciclo mesmo com a rede no ar.
**Aceite** terminal em contato, operador desligado às 10h00: às 10h05 ele não é identificado ali, e a
tentativa é `identity_unrecognized` (`RN-NUC-056`). Terminal em `D1` desde 9h, desligamento às 10h, link de
volta às 13h: o operador é identificável até 13h, o que fez tem autor (`RN-OFF-032`, infeliz c), e no
contato das 13h deixa de ser. Estabelecimento com 800 operadores: nenhum recusado por tamanho.
**Infeliz** o conjunto não cabe no recurso local → vale `RN-OFF-015` e é achado de `performance`; nunca
corte silencioso de parte do conjunto.
**Revisão** o par recusa `identity_unrecognized` × idade do conjunto (`RN-NUC-056`).

### RN-OFF-037 — O teto de vendas pendentes é 1.000 por terminal, com aviso em 80 %, e a exceção existe mas nasce vazia

**Enunciado** o teto de `RN-OFF-014` é **1.000 vendas concluídas pendentes de sincronização, por
terminal**, configurável entre **100** e **5.000**. O aviso de aproximação vem em **80 %** do teto
configurado (800 no padrão), ao operador e a quem porta `queue_owner`. A exceção de `RN-OFF-025`
**existe** e nasce **vazia**: o `owner` pode publicá-la (`RN-NUC-014`) com tamanho de até **metade** do
teto e vigência declarada; sem publicação, vale `RN-OFF-025` infeliz, seco. Fecha `LACUNA-OFF-004`.
**Motivo** o tempo sem contato já tem limite (`RN-OFF-035`); o que este teto limita é a **quantidade** de
venda que um dispositivo carrega sem o servidor saber, no terminal de muito movimento. O eixo é esse valor
por terminal e o tempo de drenagem dele na volta, porque `RN-OFF-030` mede o caixa com a fila **no teto**.
1.000 é da ordem de um dia inteiro de um caixa movimentado (estimativa, não medida), então um dia de queda
não para caixa nenhum. Abaixo de 100 uma queda curta no pico para o caixa (`PN-01`). 5.000 limita o pior
caso da perda não quantificável de `RN-OFF-016` e o tamanho de fila sob o qual `RN-OFF-030` tem de valer.
A exceção nasce vazia porque o padrão é o conservador (`RN-OFF-028`); e exceção maior que metade do teto
é teto maior publicado por outro caminho.
**Aceite** padrão, `D1` no pico: na venda pendente 800 o operador é avisado e o `queue_owner` escalado; a
1.001 é recusada com `resource_exhausted` e mensagem de operação, e nada da fila sai. Com exceção de 300
publicada, da 1.001 à 1.300 cada uma passa com uso na trilha e o restante à vista; a 1.301 é recusada.
Exceção de 600 sobre teto de 1.000: publicação recusada.
**Infeliz** o teto é reduzido com vendas pendentes acima do novo valor → a fila existente não é tocada;
venda nova é recusada até a fila drenar abaixo dele.
**Revisão** vendas pendentes por terminal no pico (`offline-grandezas-e-orcamento.md` §2) e recusas
`resource_exhausted` por teto.

### RN-OFF-038 — O registro operacional de venda confirmada fica até o fechamento do dia dela, nunca mais de 48 horas, e não contém quem comprou

**Enunciado** o registro operacional de `RN-OFF-022` fica no terminal até o **fechamento do dia** do
estabelecimento a que a venda pertence (`RN-NUC-031`, dia no fuso de `RN-NUC-057`), e nunca mais de
**48 h** depois do instante da venda. O cliente pode encurtar até **zero** (nenhuma reapresentação sem
contato) e não pode alongar. Ele contém o que localiza a venda e o que a via **não fiscal** mostra:
referência humana, instante, itens com quantidade e valor, total, meios e valores recebidos, troco e
operador. **Nunca** contém identificação do comprador nem dado de pagamento além do que comprova o
recebimento (`RN-OFF-023`, itens 3 e 4). Documento fiscal segue `EMI` (`RN-OFF-017`). Fecha
`LACUNA-OFF-014`.
**Motivo** a necessidade é reapresentar e conferir a venda **recente** sem rede (`PN-18`), e recente é a
do dia que ainda não fechou; depois do fechamento, a conferência daquele dia já aconteceu. O eixo é o alvo
em repouso no dispositivo mais exposto (`RN-OFF-021`): preso ao dia, ele tem o tamanho de um dia de vendas
do posto, qualquer que seja a idade do cliente. As 48 h cobrem quem não fecha o dia formalmente sem deixar
o registro crescer. A identificação do comprador fica fora porque a via que a exige é a minoria, e a
exposição seria de todas.
**Aceite** venda às 14h, confirmada às 14h01: sem rede às 18h, a via é reapresentada (`RN-NUC-032`); depois
do fechamento do dia às 22h, sem rede, a reapresentação é recusada dizendo que exige contato, e com rede
acontece. Venda que exigiu identificação do comprador: sem rede, a via com identificação não é
reapresentada, e a mensagem diz o que falta (`RN-NUC-032`, offline).
**Infeliz** o dia é fechado por outro terminal enquanto este está em `D2` e não sabe → vale o teto de
48 h; o registro sai no primeiro dos dois.
**Revisão** reapresentações recusadas por estarem fora da janela. Valor conferido por `seguranca` em
2026-09-23 (`T-0014`): quem furta copia o registro no instante do furto, então o prazo não lhe dá dado
novo depois dele, e o conteúdo não tem comprador nem cartão.

### RN-OFF-040 — A fila escala ao responsável quando resta metade do tempo até o prazo e ninguém abriu o item

**Enunciado** item da fila de pendências **com prazo** (`RN-OFF-011`) que quem porta `queue_owner` **não
abriu** quando resta **metade** do intervalo entre a entrada do item e o prazo escala ao
`establishment_responsible`, uma vez por item. O cliente configura a fração entre **três quartos** e **um
quarto** do intervalo. Item sem prazo não escala por esta regra: a idade dele é o que a superfície mostra.
Fecha `LACUNA-NUC-014`, a parte de número de `LACUNA-OFF-007`.
**Motivo** os prazos da fila vão de horas (contingência fiscal, `RN-EMI-028`) a dias. Antecedência fixa
chega tarde no de horas ou vira ruído no de dias; fração acompanha o prazo de cada item e o número de
itens, e deixa ao responsável sempre a mesma parte do tempo. Metade é o ponto em que o dono teve tanto
tempo quanto o responsável ainda terá.
**Aceite** item com prazo de 24 h entra às 8h e ninguém o abre: às 20h o responsável recebe a escalada
com o item, o prazo e o efeito de perdê-lo. Item com prazo de 2 h aberto pelo dono aos 30 min: não escala.
Fração de um quinto: publicação recusada.
**Infeliz** a escalada não é vista → ela continua sendo fato, e o item continua na superfície com o prazo
correndo; nunca vira silêncio (`RN-OFF-011`, infeliz).
**Revisão** escaladas contra prazos perdidos, por estabelecimento.

### RN-NUC-080 — Delegação dura no máximo 30 dias, e mais do que isso é delegar de novo

**Enunciado** o teto próprio de `RN-NUC-021` (a) é **30 dias** (720 h) contados do instante da concessão.
O cliente pode publicar teto menor, nunca maior. Renovar é conceder de novo, com autor, motivo e prazo
novos; delegação vencida não se prorroga. Fecha `LACUNA-NUC-034`.
**Motivo** a necessidade que a delegação atende é cobrir ausência, e 30 dias cobrem uma ausência do tamanho
de um mês. O eixo é delegações ativas por cliente ao longo dos anos: sem teto, delegação esquecida acumula
autoridade derivada que ninguém revê. Com o teto, toda delegação em vigor foi reafirmada por alguém há no
máximo um mês, e a delegação repetida vira a evidência de papel faltando que `RN-NUC-021` infeliz (a) já
prevê. Recusado: teto maior com revisão periódica, que é o mesmo ato de reafirmar com um passo a mais.
**Aceite** `manager` delega a um `cashier` em 2026-10-01 às 10h com prazo de 45 dias → recusado, com o
teto dito; com 30 dias, vence em 2026-10-31 às 10h e o desconto seguinte é negado; nova delegação no mesmo
dia vale mais 30.
**Infeliz** o delegado está sem contato quando a delegação vence → vale o menor dos dois: o vencimento da
delegação ou a validade retida dela (`RN-NUC-021`, Offline; `RN-OFF-034`).

## 3. Registra / Não registra

**Registra**
- O valor em vigor de cada grandeza, com quem o publicou e desde quando (`RN-OFF-028`), e a **publicação
  recusada** por piso ou teto, com o valor tentado: é o que diz depois que um cliente quis mais do que o
  produto admite.
- Cada **aviso** de vencimento apresentado (autoridade retida, habilitação) e o **vencimento** da
  habilitação, como marcos de estado do terminal, com o instante do terminal **e o tempo de
  funcionamento sem contato acumulado naquele instante**. Eles respondem "por que o caixa parou às 20h de
  segunda" quando a contagem do terminal e a do servidor divergem, e sem eles essa divergência não tem
  prova: o servidor não sabe quanto tempo o terminal ficou ligado, só o terminal sabe.
- O contador **ilegível ou ausente** tratado como prazo vencido (`RN-OFF-035`, infeliz), com o instante do
  terminal. Sem ele, esse vencimento chega ao servidor igual ao vencimento por prazo, e ninguém sabe
  depois que o terminal perdeu a contagem.
- A **escalada** da fila, com o item, o prazo e a fração em vigor.
- A recusa por teto, por vencimento ou por janela, como `operation_refused` (`RN-NUC-043`).

**Não registra**
- O tempo restante de validade ou de prazo em amostras periódicas. É derivável dos marcos e do valor em
  vigor, e amostragem periódica de estado é o grão recusado para conectividade (`fatos-de-operacao.md` §3).
- Quem estava diante do terminal quando o aviso de habilitação apareceu. O aviso é do terminal, e
  registrar quem o viu é observar pessoa sem decisão nomeada (`RN-NUC-044`).
- O conteúdo do registro operacional que saiu por fim de janela: sair é o objetivo, e a venda está no
  servidor.

O nome dos marcos novos é do `glossario.md`. Eles cedem no nível de conectividade de `RN-NUC-046`.

## 4. Lacunas que este arquivo fecha

`LACUNA-OFF-004` → `RN-OFF-037` · `LACUNA-OFF-011` (= `LACUNA-NUC-008`) → `RN-OFF-034` ·
`LACUNA-OFF-014` → `RN-OFF-038` · `LACUNA-OFF-016` → `RN-OFF-036`, sem medida · `LACUNA-OFF-017` →
`RN-OFF-035` · `LACUNA-NUC-014` → `RN-OFF-040` · `LACUNA-NUC-033` → `RN-OFF-034` · `LACUNA-NUC-034` →
`RN-NUC-080`. Continuam abertas, e não são de produto: `LACUNA-OFF-005` (números da drenagem, de
`performance` com medida) e `LACUNA-OFF-013` (grandeza de plataforma).

## Referências

`docs/produto/offline-grandezas-e-orcamento.md` (`RN-OFF-028` a `RN-OFF-031`, §2) ·
`docs/produto/fila-local-autoridade-e-identidade.md` (`RN-OFF-024`, `RN-OFF-025`, `RN-OFF-032`,
`RN-OFF-033`, §5) · `docs/produto/fila-local-conteudo-e-repouso.md` (`RN-OFF-022`, `RN-OFF-023`, §5) ·
`docs/produto/operacao-offline-e-sincronizacao.md` (`RN-OFF-011`, `RN-OFF-014`, `RN-OFF-016`, §8) ·
`docs/produto/papeis-atribuicao-e-delegacao.md` (`RN-NUC-021`) · `docs/produto/papeis-e-permissoes.md` §6 ·
`docs/produto/superficie-por-papel.md` (`RN-NUC-036`) · `docs/produto/nucleo-estabelecimento.md`
(`RN-NUC-057`, `RN-NUC-061`) · `docs/produto/pendencias-fase-1-e-2-2026-09-23.md` §3 (A14)

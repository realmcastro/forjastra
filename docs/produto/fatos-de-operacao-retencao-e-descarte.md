# Fatos de operação — o fato depois do instante: quanto tempo ele permanece, e o que se declara quando ele não cabe

> **Quarto irmão de `fatos-de-operacao.md`, `fatos-de-operacao-provedor.md` e
> `fatos-de-operacao-dominios-fechados.md`, com o mesmo peso normativo.** Nasceu em 2026-08-23, no
> conserto do passo 6 da T-0004: o irmão principal fechou em **399** linhas, no teto de 400, e faltava
> uma regra que só existe entre duas lacunas (`CST-05`).
>
> **Eixo da partição, e ele é o mesmo defeito em duas escalas de tempo.** Os eixos anteriores são *quem
> pratica o fato* e *o domínio fechado de valor que ele carrega*. O deste arquivo é **o fato depois do
> instante**: por quanto tempo ele permanece onde nasceu, por quanto tempo permanece onde repousa, e o
> que o produto **declara** quando ele não cabe. `RN-NUC-046` (o recurso local do terminal, escala de
> horas) e `RN-NUC-049` (retenção × janela de leitura, escala de meses) falham do mesmo modo: **a perda
> chega ao leitor com a cara de ausência** — "não houve recusa" e "vendeu menos" são a mesma mentira por
> omissão, em duas escalas. Regra que trata uma sem a outra deixa o leitor sem saber qual das duas está
> lendo.
>
> **`RN-NUC-046` mudou de arquivo, não de número.** Ela nasceu em `fatos-de-operacao.md` §2 e veio para
> cá **verbatim**, mais a cláusula de `CST-02`; nada foi renumerado e nenhuma cláusula anterior foi
> alterada ou removida. Numeração contínua e imutável entre os quatro (`glossario.md` §4.2). **As lacunas
> e as perguntas dos cinco moram no irmão principal** (§7).
>
> **O que este arquivo não é.** Não é tabela, coluna, índice, política de expiração, rota nem tela.
> Nenhuma célula de autorização é valorada, e `D-01` a `D-06` não são presumidas. **Números:** até
> 2026-09-23 nenhum; nessa data, por decisão delegada do humano (`T-0014`, `F-018`), `RN-NUC-083` a
> `RN-NUC-085` escreveram o teto de diagnóstico no terminal e os relógios **discricionário** e de
> **prova**, com unidade, motivo e a série que os revisa. O relógio de **obrigação** continua sem número,
> com o aviso no topo de `RN-NUC-049`.
>
> **Formato das regras:** `Enunciado` · `Motivo` · `Aceite` · `Infeliz`.

---

## 1. Onde o fato nasce — o recurso local do terminal

### RN-NUC-046 — Fato de recusa e de conectividade nunca desloca fato de venda no recurso local; descarte é contado

**Enunciado** quando o armazenamento local do terminal aperta, a ordem de sacrifício é **declarada**:
o fato de **venda concluída, pagamento e movimento de caixa** é o último a ser afetado — antes dele,
o produto para de aceitar **fato de recusa** e **fato de conectividade**, e cada descarte é
**contado**, com o instante do primeiro e do último. Nenhum fato de venda é apagado, compactado com
perda ou sobrescrito (`RN-OFF-015`), e nenhuma recusa de venda nova acontece por causa de fato de
diagnóstico. **Cláusula acrescentada em 2026-08-23:** a **contagem de descarte é ela mesma um fato**, e
ela sincroniza com prioridade **acima** de todos os fatos que contabiliza — nunca junto, nunca depois.
Ela nunca é descartada pela mesma ordem de sacrifício que a produziu.

**Segunda cláusula, 2026-08-23 (`CST-02`) — a classe que o enunciado tinha deixado fora.** Os fatos de
**ciclo de vida do pedido** — `order_opened`, `order_item_removed`, `order_abandoned` e a **linha
retirada** que `order_item_added` preserva — cedem **junto com** recusa e conectividade, e o descarte
deles é contado pelo mesmo mecanismo, com a mesma prioridade de sincronização. Eles **não** estão no
nível do dinheiro. A razão de precisarem estar escritos é que a omissão tem um desfecho plausível e
único: eles nascem no fluxo da venda, então o implementador os protege **como** venda — e é esse desfecho
que enche o disco do terminal isolado e faz o caixa ceder primeiro, que é o defeito grotesco que o motivo
desta regra descreve. **`LACUNA-NUC-038` fechou em 2026-09-11** pela saída `B`: os quatro viraram regra
(`fatos-de-operacao-ciclo-de-vida-do-pedido.md`, `RN-NUC-052` a `RN-NUC-055`) e são agendáveis, e o
volume que esta cláusula antecipava é o que foi aprovado junto com eles.

**Motivo** esta spec acabou de criar fatos de **alto volume** que competem pelo mesmo recurso escasso
do fato que é dinheiro. Sem ordem declarada, o defeito é grotesco e plausível: um terminal isolado,
recusando em rajada, enche o disco de diagnóstico e **para de vender** — exatamente o que `PN-01`
recusa, causado pelo mecanismo que existe para diagnosticar. Contar o descarte é o que evita a segunda
armadilha: perda silenciosa de diagnóstico faz a série mentir por omissão, e quem lê conclui que o
problema parou quando o que parou foi o registro. **E a contagem só cumpre esse papel se sobreviver ao
próprio aperto** — foi o passo 4 da T-0004 que derivou isso, e é consequência, não zelo: contada no
terminal e descartada com o que ela conta, ela deixa o servidor sem distinguir "não houve recusa" de
"houve recusa e ela foi descartada". Sem a inversão de prioridade, o mecanismo que existe para tornar a
lacuna visível é o primeiro a desaparecer, e o defeito reaparece com aparência de silêncio.

**Aceite** com o recurso local no limite e uma rajada de recusas, o terminal **conclui venda em
espécie** normalmente, a fila de vendas permanece íntegra e contável (`RN-OFF-014`, `RN-OFF-015`), e a
leitura de recusas daquele terminal declara "houve descarte, N ocorrências, entre HH:MM e HH:MM" — não
apresenta a lacuna como ausência de recusa. **Segundo aceite, o da prioridade:** com o recurso no limite
e a fila drenando **parcialmente** (contato intermitente), o que chega primeiro ao servidor é a
**contagem de descarte**, antes de qualquer fato de diagnóstico pendente — e nenhuma leitura do servidor
mostra "zero recusa" para um terminal que descartou recusa.

**Terceiro aceite, o do ciclo de vida** com o recurso no limite, o terminal conclui venda e registra
pagamento; o que cede primeiro **inclui** `order_abandoned` e `order_item_removed`; e a leitura de
desistência daquele terminal declara "houve descarte" para essas classes também, nunca ausência de
desistência (`RN-REL-005`). Teste negativo: buscar classe de fato **não** nomeada em nenhum dos dois
níveis da ordem de sacrifício → **zero**.

**Infeliz** o teto local para fato de diagnóstico não está configurado → vale o padrão mais
conservador (descarta diagnóstico mais cedo), a ausência é visível, e o número é `LACUNA-NUC-039`,
nunca constante embutida (`RN-OFF-028`). O padrão foi decidido em 2026-09-23: `RN-NUC-083`.

### RN-NUC-083 — O fato de diagnóstico não sincronizado ocupa no máximo 10 % do armazenamento local da aplicação, fora da margem que protege a venda

**Enunciado** o teto de `RN-NUC-046` é uma **fração do armazenamento local disponível à aplicação no
terminal**: padrão **10 %**, configurável entre **2 %** e **25 %**, contado **fora** da margem de
`RN-OFF-015`. Atingido o teto, vale a ordem de sacrifício de `RN-NUC-046`, com o descarte contado. O teto
cobre os fatos que cedem primeiro (recusa, conectividade, ciclo de vida do pedido) e os marcos de estado
do terminal (reconciliação, versão recebida, aviso e vencimento de habilitação). Fecha `LACUNA-NUC-039`.
**Motivo** fração, e não bytes, porque o terminal-alvo é modesto e não é um só (`CST-08`): o mesmo número
em bytes é folga num dispositivo e sufoco noutro. O que enchia o disco era a retentativa, e desde
`RN-OFF-039` ela é ato de pessoa; o diagnóstico passa a crescer com os atos do operador e as transições do
link, na mesma ordem das vendas. 10 % guarda horas de rajada sem chegar perto do espaço da venda
(estimativa, não medida). Acima de 25 % o diagnóstico disputaria com a venda o espaço que `RN-OFF-015`
protege; abaixo de 2 % a primeira rajada já descarta.
**Aceite** terminal em `D2` com 10 % ocupados por diagnóstico: a recusa seguinte é descartada e contada, a
venda em espécie conclui, e a primeira coisa a subir no contato é a contagem (`RN-NUC-046`, segundo
aceite). Cliente que publica 40 %: recusado, com o teto dito.
**Infeliz** o armazenamento disponível diminui (outra aplicação ocupa o dispositivo) → a fração se recalcula
sobre o disponível; se o teto novo fica abaixo do já ocupado, nada é apagado por isso: só deixa de entrar
diagnóstico novo até a drenagem liberar espaço.
**Revisão** contagens de descarte por terminal (`RN-NUC-046`) contra o espaço medido de fato de diagnóstico
(`offline-grandezas-e-orcamento.md` §2).

---

## 2. Onde o fato repousa — retenção e janela de leitura

### RN-NUC-049 — Retenção de uma classe é ≥ a janela mais longa de leitura publicada sobre ela; janela truncada por retenção é declarada inexistente, nunca apresentada como valor

> **Indisponível — descarte de fato fiscal e financeiro por prazo.** Não funciona: descartar venda,
> pagamento, movimento de caixa ou documento ao fim de um prazo. Falta: o prazo legal de guarda de cada
> classe (`LACUNA-NUC-040`, relógio de obrigação; para o documento, `LACUNA-EMI-007`). Responde: humano,
> com o contador.
> Enquanto isso: nada dessas classes se descarta (append-only, `.claude/rules/dados.md` §4; `RN-NUC-049`
> d). Desde: 2026-09-23.

**Enunciado** (a) **retenção e janela de leitura são o mesmo número por dois lados**: retenção diz até
onde o fato existe, janela diz até onde a leitura pede. A retenção de uma classe é **≥ a janela mais
longa de qualquer leitura publicada sobre ela** — publicar leitura com janela maior que a retenção da
classe que a sustenta é publicar resposta que o produto não tem. (b) Fixar um dos dois **sem** o outro é
vedado: quem propõe retenção declara a janela mais longa que ela sustenta, e quem publica leitura declara
a retenção que ela exige. (c) **Truncamento é declarado como truncamento**: leitura cuja janela pedida
excede a retenção devolve o período que existe **e** declara o período que não existe como
**inexistente** — nunca como zero, nunca como queda, nunca como série contínua mais curta. (d) A regra
incide sobre a classe no **relógio discricionário**; nos relógios de **obrigação** e de **prova** a janela
é externa (prazo legal; cláusula de `RN-PRV-010`, `RN-PRV-006` d) e **nenhuma leitura nossa a encurta**.

**Motivo** o dano não cresce em volume, cresce em **irrecuperabilidade**: passada a janela, o fato não
existe e nenhuma decisão futura o recupera — é o mesmo argumento que faz esta família de arquivos existir,
uma escala de tempo adiante. E as duas consequências têm donos diferentes, que é justamente por que a
relação precisa de regra: o acompanhamento **semestral** que o humano pediu põe **piso** na retenção de
toda classe que ele lê, então escolher retenção sem saber a janela é escolher, sem perceber, que o
relatório semestral não existe. A segunda é a séria: retenção abaixo da janela devolve série **truncada**,
e nada obrigava a declarar o truncamento — `RN-REL-007` proíbe reescrever histórico e `RN-REL-005` proíbe
apresentar inexistência como zero, e **nenhuma das duas fala de dado descartado por retenção**, que chega
ao leitor com a mesma cara de "vendeu menos". É a forma de `RN-NUC-046` na escala de meses: a perda
chegando como ausência.

**Aceite** para cada leitura publicada, a janela máxima dela e a retenção da classe que a sustenta são
consultáveis lado a lado, e **não** existe par em que a janela exceda a retenção — o par que existir é
achado, conferível por busca e sem julgamento. Pedir uma leitura com janela além da retenção → a resposta
traz o período existente e **declara** o período inexistente como inexistente; nenhuma apresentação dela
mostra o trecho ausente como valor, como zero ou como queda. E: propor retenção nova sem declarar a janela
que ela sustenta → **não entra**.

**Infeliz** a janela que o negócio precisa custa retenção que ninguém quer pagar. Então a decisão é do
**humano**, com os dois números à vista e o custo escrito — nunca resolvida escolhendo a retenção e
descobrindo a janela depois, que é a ordem que produz a leitura mentirosa. Os números são
`LACUNA-NUC-040` (retenção por classe) e `LACUNA-REL-001` (teto de janela de leitura), e esta regra é o
que obriga as duas a fecharem **na mesma passada**; nenhuma das duas é escrita aqui, e nenhuma grandeza
desta regra tem valor. **Fecharam juntas em 2026-09-23** nos relógios discricionário (`RN-NUC-084`) e de
prova (`RN-NUC-085`), abaixo; no de obrigação vale o aviso do topo.

### RN-NUC-084 — Toda classe de fato tem relógio declarado; no discricionário o fato fino vive 13 meses locais, a leitura alcança 12 meses fechados, e a contagem mensal sobrevive

**Enunciado** (a) **Classe → relógio**, lista fechada:
- **obrigação**: venda, pagamento, desconto aplicado, cancelamento e devolução, abertura e fechamento de
  sessão, movimento e diferença de caixa, desfecho de documento fiscal, mudança de módulo ativo;
- **prova**: registro de auditoria de ato com célula `R` (`RN-NUC-029`), e os atos, leituras e concessões
  nossos (`RN-PRV-011`, `RN-PRV-012`, `RN-NUC-024`); o prazo é o de `RN-NUC-085`;
- **discricionário**: recusa (`operation_refused`), transição de conectividade, ciclo de vida do pedido
  (`RN-NUC-052` a `RN-NUC-055`), desfecho de periférico, reconciliação do conjunto de identificação, versão
  de artefato recebida, contagem de descarte (`RN-NUC-046`) e os marcos de `fila-local-valores-de-partida.md` §3.

Classe sem relógio declarado fica na **obrigação**, e não se descarta, até ser classificada aqui.
(b) No discricionário, o fato no grão fino é retido pelo **mês local em curso mais os 12 meses completos
anteriores**, no fuso do estabelecimento (`RN-NUC-057`), e descartado depois. O descarte é registrado: classe,
estabelecimento, mês e quantidade.
(c) O **teto de janela** de toda leitura publicada sobre classe discricionária no grão fino é **12 meses
fechados**. É a parte de janela de `LACUNA-REL-001` para essas classes; o recorte por página continua com
`performance`.
(d) Antes do descarte, cada classe discricionária deixa uma **contagem por estabelecimento, mês local,
operação, módulo dono e motivo enumerado** (onde a classe tem motivo), que não se descarta enquanto o
cliente existir. Leitura além de 12 meses lê essa contagem e declara o grão.
**Motivo** fecha `LACUNA-NUC-040` no discricionário junto com a janela de `LACUNA-REL-001`, como
`RN-NUC-049` exige. O piso vem do acompanhamento semestral pedido pelo humano: comparar um semestre com o
anterior pede 12 meses fechados, e o mês em curso está aberto; daí 13. O eixo é fatos por dia × janela ×
schemas, e o discricionário tem a classe de maior volume da fase (`CST-07`). Com retenção fixa, o volume
retido deixa de crescer com a idade do cliente, e a janela de migration e o tempo de restauração deixam de
crescer junto. O que a retenção curta perderia sem remédio, a série longa, fica na contagem mensal, que
cresce com meses × motivos e não com atos. Recusados: reter o fino para sempre (o volume cresce sem limite
na classe que o negócio não limita); reter 6 meses (mata a comparação semestral no dia em que ela é
pedida); reter só a contagem desde o início (é o agregado no lugar do fato que `RN-NUC-041` proíbe).
**Aceite** em 2027-12-15, o fato de recusa de 2026-12-10 existe e o de 2026-11-30 não. "Recusas por
motivo, últimos 12 meses fechados" responde de 2026-12 a 2027-11 no grão fino. Pedir 18 meses devolve
esses 12 no fino e os 6 anteriores pela contagem mensal, com o grão declarado, nunca como zero. Buscar
leitura publicada sobre classe discricionária com janela fina acima de 12 meses → zero.
**Infeliz** alguém precisa de janela fina maior para uma classe → é decisão do humano com os dois números à
vista (`RN-NUC-049`, infeliz), vale só para o que ainda está retido e nunca recupera o descartado. Descarte
por retenção nunca alcança classe de obrigação nem de prova, nem por configuração: este prazo é
`decision`, não configuração de cliente.

### RN-NUC-085 — O relógio de prova não expira enquanto o cliente existe, e a trilha de um ato nunca sai antes do fato que ela prova

> **Indisponível — descarte da trilha de prova depois que o cliente sai.** Não funciona: descartar trilha
> de ato e de leitura, nossa ou do cliente, depois de encerrado o contrato. Falta: quanto tempo a trilha
> sobrevive à saída e o que a cláusula promete (`LACUNA-PRV-006`). Responde: humano.
> Enquanto isso: nada da classe de prova se descarta (`RN-NUC-085`; `RN-PRV-006` d.2). Desde: 2026-09-23.

**Enunciado** a classe de prova (`RN-NUC-084` a) **não se descarta** enquanto o cliente (tenant) existir,
e a trilha de um ato nunca sai antes do fato de obrigação a que o ato se refere: a autorização de um
desconto vive pelo menos tanto quanto a venda em que ele entrou. É o **piso** que o produto sustenta, e a
cláusula de `RN-PRV-010` não pode prometer menos. O que sobrevive depois da saída é `LACUNA-PRV-006`.
**Motivo** fecha `LACUNA-NUC-040` no relógio de prova, pelo lado que é nosso. A trilha é a única prova de
quem fez o quê: do lado do cliente, quem autorizou; do nosso, que o acesso foi legítimo (`RN-PRV-006`
d.1). Como ela pode ser prova contra nós, custo não a encurta (`RN-PRV-006` d.2). O eixo é o volume de
ato sensível e de ato nosso, que é subconjunto do volume de venda, e a venda já é retida inteira no
relógio de obrigação; reter a prova tanto quanto a venda não cria custo de ordem nova. Recusado: janela
fixa em meses, que produz venda existente com a autorização dela descartada, a pior forma de truncamento,
porque o fato fica e quem o autorizou some.
**Aceite** venda de 2026-10-01 com desconto acima do limite autorizado por um `manager`: enquanto a venda
existir, a trilha da autorização existe e é legível pelo cliente. Nenhuma operação, configuração ou
expiração do nosso lado encurta a classe (`RN-PRV-006` d.2): buscar classe de prova com prazo de descarte
configurado → zero.
**Infeliz** o cliente encerra o contrato → nada da prova se descarta por esta regra, e vale o aviso acima
até `LACUNA-PRV-006` fechar.

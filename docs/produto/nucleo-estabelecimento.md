# Estabelecimento — a entidade do núcleo, e a forma do ciclo de vida dela

> **O que este arquivo é.** As regras numeradas da entidade **estabelecimento**: o que ela é, a
> que cliente (tenant) pertence, o que a distingue de cliente e de terminal, o que nasce com ela, e em
> que forma o ciclo de vida dela é registrado. Desde 2026-09-23 (T-0014, `F-018`), também de quem é o
> dia e a moeda, como ela encerra, por que não muda de cliente e quem habilita terminal a vender por ela.
>
> **Por que ela não existia até 2026-09-11.** `glossario.md:30` e `:40` declaram o estabelecimento
> **entidade de primeira classe**, `RN-NUC-018` constrói o escopo de autorização em cima dela e
> `RN-NUC-038` constrói a resolução de venda em cima dela — e nenhuma regra numerada dizia **o que ela
> é**. A única citação em matriz (`RN-NUC-019`, linha 23) cobre **quem pode criar**, não a coisa criada.
> `RN-PRV-013` fixou a forma append-only do ciclo de vida de cliente, módulo, schema e terminal, e
> **deliberadamente não lista estabelecimento**. Era a última entidade do núcleo sem regra dona, e a
> Fase 1 modela a partir daqui.
>
> **Numeração.** `RN-NUC-050` e `RN-NUC-051` (2026-09-11), `RN-NUC-057` a `RN-NUC-061` (2026-09-23),
> contínuas com o restante do núcleo (`glossario.md` §4.2); heading `### RN-NUC-nnn`, pelo contrato de
> busca de `nucleo-venda.md`. As lacunas abertas aqui — `LACUNA-NUC-041` a `043`, fechadas em 2026-09-23 —
> moram na §4 deste arquivo.
>
> **O que este arquivo não é.** Não é tabela, coluna, chave nem forma — isso é de `arquiteto-dados`. Não
> afirma nada de fiscal. Até 2026-09-11 não criava operação; em 2026-09-23 passou a criar duas —
> habilitar terminal (matriz, linha 40) e encerrar e reabrir estabelecimento (linha 41) —, com as
> células escritas na mesma passada.
>
> **A ausência que resta tem nome:** identidade fiscal (§3). Fuso e moeda, que também ficavam de fora,
> foram decididos em 2026-09-23 (`RN-NUC-057`, `RN-NUC-058`).

---

## 1. As regras

### RN-NUC-050 — O estabelecimento é a unidade de operação e de identidade jurídica, pertence a **um** cliente (tenant), e nenhum fato do núcleo existe fora de um

**Enunciado** o estabelecimento (`establishment`) pertence a **exatamente um** cliente (tenant), e esse
vínculo é **imutável**: estabelecimento não muda de cliente (`RN-NUC-060`) e não é compartilhado por
dois. Todo fato do núcleo — pedido, venda, pagamento, movimento de caixa, sessão de caixa, turno,
fechamento do dia, referência à obrigação documental — pertence a **um** estabelecimento, nomeado no
próprio fato, **inclusive quando o cliente tem um só**. E o estabelecimento **não** é unidade de
isolamento de dado: dois estabelecimentos de um mesmo cliente vivem no mesmo ambiente, e o que os
separa é **autorização e escopo de resolução** (`RN-NUC-018`, `RN-NUC-038`), nunca isolamento físico.

**Escopo** núcleo, pelo teste dos três negócios: o posto com duas bandeiras, a padaria com a fábrica e o
quiosque, a loja de roupa com duas lojas. Os três podem ter mais de uma unidade, e em nenhum dos três o
dinheiro e o documento de uma se misturam com os da outra (`fronteira-do-nucleo.md:55`, `:133`).

**O que o distingue, e são duas confusões diferentes**

- **Não é o cliente (tenant).** O cliente é a unidade de **contrato e de isolamento de dado**; o
  estabelecimento é a unidade de **identidade jurídica e de operação**. Um cliente tem uma ou mais
  unidades; uma unidade tem exatamente um cliente. A consequência já está escrita e é a razão de
  `RN-NUC-018` existir: gerente de uma unidade autorizando na outra é vazamento **dentro** de um mesmo
  cliente — não cruza schema, então nenhuma defesa de isolamento por cliente o pega.
- **Não é o terminal.** O terminal é dispositivo, é substituível e é **habilitado a vender por uma**
  unidade, com contato (`RN-OFF-032`, `glossario.md` §1.1). O estabelecimento sobrevive à troca de todos
  os terminais dele, e trocar terminal não muda nada do que ele é.

**O que nasce com ele** três coisas, e nada além: o vínculo com o cliente, o fato datado de criação com
autor e instante (`RN-NUC-051`), e o nome pelo qual o operador reconhece a unidade.

**O que não nasce, e é ato próprio depois** terminal habilitado a vender (`RN-OFF-032`, `RN-NUC-061`);
atribuição de papel de escopo estabelecimento (`RN-NUC-020`); configuração publicada usada na composição
do valor, com o fuso e a moeda (`RN-NUC-013`, `RN-NUC-014`, `RN-NUC-057`, `RN-NUC-058` — linha 38 da
matriz); faixa de referência humana pré-alocada (`RN-OFF-006`); ponto de emissão e regime (`EMI`,
`FIS`); sessão de caixa e turno. Daí o desfecho que parece defeito e não é: **estabelecimento
recém-criado não vende.** É a mesma ordem de `RN-NUC-014` (publicar antes de aplicar) e de `RN-OFF-032`
(habilitar com contato antes de operar sem), e o lugar onde ela se confere é a habilitação do primeiro
terminal (`RN-NUC-061`).

**Precondição** cliente provisionado (`RN-PRV-013`). Criar a **primeira** unidade não exige unidade
resolvida, e isso não é exceção a `RN-NUC-018`: o objeto da operação é a unidade que está nascendo, e o
escopo dela é o **cliente** — que é exatamente o escopo do `owner`, o único papel que a realiza
(matriz, linha 23).
**Produz** um escopo válido de autorização e de resolução. Não produz venda, terminal, papel,
configuração nem faixa.
**Offline** criar é **recusa** em D1, D2 e D3 (matriz, linha 23, inalterada). Terminal sem contato não
descobre unidade nova (`RN-NUC-018`, offline).

**Motivo** o erro caro aqui é o **estabelecimento implícito**. Cliente com uma loja só convida ao
atalho: a unidade não é nomeada no fato, e o produto a "descobre" na leitura porque só existe uma. O
atalho funciona por meses e quebra no dia em que ele abre a segunda — e nesse dia **todo fato passado
não tem a que unidade pertence**. Migration nenhuma conserta isso: o dado não foi perdido, ele nunca
existiu. É o mesmo argumento de grão de `RN-NUC-041`, aplicado ao eixo que mais dói,
porque é o eixo em que dinheiro e documento pertencem a **pessoas jurídicas diferentes**.

**Aceite**
1. Cliente com **uma** unidade: toda venda, sessão de caixa, movimento e fechamento do dia nomeiam o
   estabelecimento, e **não existe caminho** em que o dado seja ausente, nulo ou inferido da contagem.
   Teste negativo, que é o que prova: buscar no produto por unidade "padrão", "implícita" ou "única"
   não encontra nada.
2. Cliente com **duas**, A e B: operador com atribuição só em A não alcança nada de B (`RN-NUC-018`); a
   mesma referência humana `000123` existe nas duas sem colidir (`RN-NUC-003`, `RN-NUC-038`); o
   fechamento do dia de A não depende de B (`RN-NUC-031`).
3. Trocar **todos** os terminais de uma unidade não altera nenhuma resposta sobre ela.

**Infeliz** (a) o cliente tem uma loja só e o cadastro de unidade parece cerimônia. **Necessidade
preservada:** não pedir ao comerciante de uma loja que administre uma estrutura que ele não tem.
**Mecanismo recusado:** unidade implícita ou ausente do fato — pelo motivo acima, e o sintoma dela
aparece anos depois. **O que o produto faz:** a unidade existe no dado sempre, e **some da tela**: com
uma só, nenhuma superfície pede que o operador a escolha. A ausência de escolha é de **tela**, nunca de
dado. (b) o cliente tem várias e alguém precisa de leitura que some as unidades → hoje não existe
operação que localize fato de **outra** unidade (`LACUNA-NUC-036`), e leitura que some declara quais
unidades somou e de quem é o dia (`RN-NUC-042`, `RN-NUC-057`). Nada aqui autoriza leitura nova.

### RN-NUC-051 — Existência e encerramento da unidade são fato datado; o estado corrente é derivado, e nenhum atributo dela é campo sobrescrito

**Enunciado** o estabelecimento segue a **mesma forma** de `RN-PRV-013`: criar é **fato datado e
append-only**, com autor, papel e instante; "quais unidades este cliente opera" é **derivação** dos
fatos, nunca um campo de estado sobrescrito; e encerrar e reabrir (`RN-NUC-059`) nascem **fato**, nunca
exclusão de linha nem inversão de um campo corrente. Duas
cláusulas sobre atributo, e elas cobrem tudo o que a unidade carrega: **(a)** o que o terminal
**aplica** — a configuração usada na composição do valor — é **artefato publicado**, com versão e
vigência (`RN-NUC-013`, `RN-NUC-014`), logo já não é campo sobrescrito e já congela no fato; **(b)** o
que sobra é descritivo — o nome pelo qual o operador reconhece a unidade —, e a única obrigação de
produto sobre ele é que alterá-lo **não** mude o que um fato passado exibe (`PN-08`). Como se garante
(b) é forma, e é de `arquiteto-dados`.

**Motivo** a unidade responde por dinheiro e por documento de uma pessoa jurídica, e todas as perguntas
que importam sobre ela são **datadas**: de que unidade saiu esta venda, essa unidade operava naquele
dia, desde quando esta loja existe, quando ela parou. Estado sobrescrito destrói a prova
(`.claude/rules/dados.md` §4, e é o mesmo motivo de `RN-PRV-013`). O caso que decide é o encerramento:
uma unidade fechada **continua tendo** venda, documento e obrigação no passado — apagá-la, ou marcá-la
só com um campo corrente, faz o fechamento do ano anterior deixar de reconstruir, e ninguém descobre
isso antes de precisar dele.

**Aceite** criar A, criar B e encerrar A (`RN-NUC-059`) → "quais unidades o cliente operava
em `2026-09-11`" responde **A e B**; reconstruir o estado corrente a partir dos fatos dá o mesmo
resultado que o estado corrente exibido, e divergência é achado, não curiosidade (`RN-PRV-013`, aceite).
Toda venda de A continua consultável depois do encerramento, com a unidade nomeada.

**Infeliz** o cliente cadastrou uma unidade por engano, sem nenhum fato pendurado nela, e pede para
apagá-la. **Necessidade preservada:** não deixar na tela do operador uma unidade que não existe.
**Mecanismo recusado:** apagar a linha — ela levaria junto quem a criou e quando, que é a única resposta
possível para "de onde veio isso". **O que o produto faz:** a unidade sai da escolha do operador porque
está **encerrada**, não porque sumiu; o desfecho fica registrado no fato de encerramento (`RN-NUC-059`).

**Offline** criar é recusa (matriz, linha 23). O terminal sem contato não cria, não encerra e não
descobre unidade.

### RN-NUC-057 — O dia é do estabelecimento: "hoje", turno, fechamento e vigência por data se resolvem no fuso publicado da unidade do fato, e o núcleo não tem fuso do cliente

**Enunciado** todo "dia" do núcleo — "hoje", fechamento do dia (`RN-NUC-031`), turno (`RN-NUC-062`),
vigência expressa em data (`RN-FIS-008`) e qualquer leitura por dia, semana ou mês — é o dia local do
**estabelecimento a que o fato pertence**, no fuso que **vigia para ele no instante do fato**. O fuso é
membro da configuração publicada do estabelecimento (`RN-NUC-013`, linha 38 da matriz), com versão e
vigência, e é identificado pela **região** cujas regras de hora ele segue, nunca por deslocamento fixo em
relação a UTC. **Não existe fuso do cliente (tenant) no núcleo**, e fuso do servidor ou do terminal não
decide dia de nada. O fato continua carregando só instantes; o dia é derivação de leitura (`RN-NUC-042`,
[[convention-fato-nao-carrega-campo-de-calendario]]).

**Onde o dado mora** no estabelecimento, dentro do ambiente do cliente. O registro do cliente em
`platform` não carrega fuso que decida dia de fato do núcleo. Se o escopo `provedor` precisar de fuso
por cliente para operação nossa (cobrança, janela de manutenção), decide-se lá, e ele nunca é lido para
derivar dia de fato do núcleo.

**Escala** o eixo é **estabelecimentos por cliente**. No estabelecimento, o custo é um valor publicado
por unidade e zero por fato, e abrir a segunda unidade noutro fuso não muda nada do que existe. No
cliente, o custo é zero até esse dia, e nesse dia o fechamento de uma das duas cai no dia errado; sair é
expand/contract em N schemas, mais toda leitura já entregue ao contador com o dia errado.

**Motivo** fecha `LACUNA-GLO-001` pelo lado que duas regras aprovadas já escreviam: `RN-FIS-008` resolve
vigência à meia-noite de cada estabelecimento, e `RN-NUC-013` já publicava o fuso como configuração do
estabelecimento. O lado recusado — "hoje" no fuso do cliente, em `fronteira-do-nucleo.md` §2.1 e
`.claude/rules/dados.md` §3 até 2026-09-23 — só é verdadeiro para quem tem uma unidade, e quem descobre
é o cliente que cresce. Deslocamento fixo é recusado porque a região muda a própria regra de hora, e o
deslocamento gravado passa a errar o dia a partir dali sem que nada acuse.

**Aceite** (caso de prova de `F-018`) A em `America/Sao_Paulo`, B em `America/Manaus`; venda em B às
23h30 de 2026-10-13, hora de Manaus — instante `2026-10-14T03:30Z`, 00h30 de 2026-10-14 em São Paulo.
(1) No fechamento do dia de B, a venda é de **2026-10-13**. (2) Na leitura que soma A e B para
2026-10-13 ela está dentro, e A entra com o 2026-10-13 **de São Paulo**; a leitura declara que soma o dia
local de cada unidade. (3) Em nenhuma leitura ela aparece em 2026-10-14. (4) Às `2026-10-14T03:10Z`,
"vendas de hoje" mostra A em 2026-10-14 e B em 2026-10-13, cada dia nomeado — nunca um "hoje" único.
(5) Negativo: nenhum dia de fato do núcleo é derivado de fuso do cliente, do servidor ou do terminal.

**Infeliz** (a) unidade sem fuso publicado vigente → nenhum dia dela é derivável, e o produto não
presume nenhum; a unidade não vende, pelo desfecho de `RN-NUC-050` para o que nasce depois dela,
conferido em `RN-NUC-061`. (b) relógio do terminal divergente cruzando a meia-noite local → `RN-OFF-019`;
fuso não corrige relógio. (c) fuso republicado (a região mudou a regra, ou o cadastro estava errado) →
vale da vigência nova em diante; fato passado mantém o dia da versão que congelou, e o erro de cadastro
se corrige por publicação com vigência declarada, nunca por reescrita do passado (`PN-08`).

**Offline** o terminal aplica o fuso da configuração retida, como qualquer artefato publicado.
**Registra** a publicação do fuso, pela forma de `RN-NUC-014`. **Não registra** dia dentro do fato.

### RN-NUC-058 — A moeda é do estabelecimento; valor de fato se lê na moeda que vigia para a unidade no instante dele, e nenhuma leitura soma moedas diferentes

**Enunciado** a moeda é membro da mesma configuração publicada que o fuso (`RN-NUC-013`, linha 38), com
versão e vigência. Todo valor monetário de fato do núcleo é interpretável na moeda que vigia para o
estabelecimento **no instante do fato**, sem consultar o presente. Preço, limite e exceção publicados
valem numa moeda declarada e só se aplicam em estabelecimento dela. Leitura que soma unidades **nunca
soma moedas diferentes**: agrupa por moeda e declara. Não existe moeda do cliente (tenant) no núcleo, e
o núcleo não converte moeda. **Como** o valor guarda a moeda — congelada nele, ou pela versão da
configuração que o fato congelou — é forma, de `arquiteto-dados`; a representação é de `SPR-40`.

**Escala** mesmo eixo. No estabelecimento: um valor publicado por unidade, e o cliente de moeda única
não percebe nada. No cliente: zero até a primeira unidade noutra moeda, e aí expand/contract em N
schemas. E há um motivo que não depende de crescer: a moeda de um lugar pode mudar, e o fato passado
continua na moeda em que aconteceu — sem vigência, o passado muda de moeda junto com o presente.

**Motivo** fecha `LACUNA-NUC-041`: `RN-NUC-013` e a linha 38 publicavam a moeda como configuração do
estabelecimento, e o glossário e `fronteira-do-nucleo.md` §2.1 diziam "moeda do cliente"
([[gotcha-moeda-viajou-na-parentese-do-fuso]]). Vence `RN-NUC-013`, pelo argumento do fuso: o dinheiro
de cada unidade é de uma pessoa jurídica própria, e é da unidade o que muda o significado do número.

**Aceite** (1) cliente com uma unidade em real: um valor publicado, nenhuma superfície pede moeda. (2)
A e B em moedas diferentes: preço publicado em real não é lançado em B — o item não entra e a venda
continua (`RN-NUC-002`, infeliz), dizendo que falta preço naquela moeda; a leitura que soma A e B devolve
dois subtotais com a moeda nomeada e nenhum total único. (3) republicar a moeda de A com vigência futura
não altera a leitura de nenhuma venda anterior a ela.

**Infeliz** unidade sem moeda publicada vigente → não compõe valor (`RN-NUC-013`, infeliz (a)), logo não
vende; nunca "moeda padrão". **Offline** aplica a configuração retida, como o fuso.

### RN-NUC-059 — Encerrar e reabrir estabelecimento são fatos do `owner`, com contato; encerrar exige dia sem desfecho desconhecido e não apaga nem move nada

**Enunciado** encerrar o estabelecimento é operação do `owner`, com contato, com registro (matriz, linha
41), e produz **fato datado** (`RN-NUC-051`). Encerrada, a unidade não abre sessão, não conclui venda,
não abre turno e não habilita terminal; tudo o que aconteceu nela segue consultável, com a unidade
nomeada. **Reabrir** é a mesma operação no sentido inverso, também fato, e o intervalo encerrado fica na
história.
- **Precondição de encerrar:** a lista de bloqueio de `RN-NUC-031` vazia para a unidade, no que o
  servidor conhece.
- **Efeito, no mesmo ato:** a habilitação a vender de todo terminal da unidade é revogada no servidor
  (`RN-OFF-032`i); a faixa não usada é encerrada (`RN-OFF-006`, infeliz (c)); nenhuma atribuição é
  apagada, elas ficam sem operação a alcançar ali.
- **Reabrir não ressuscita** habilitação nem faixa: cada terminal é habilitado de novo (`RN-NUC-061`),
  pelo motivo de `RN-NUC-021`, infeliz (b) — autoridade não volta sem ato de alguém.
- **Pausa não é encerramento.** Reforma, temporada, dia sem expediente: não operar não exige ato.

**Escala** estabelecimentos por cliente, vezes o erro humano. Encerrar irreversível faz de cada engano
uma unidade duplicada para o mesmo lugar e a mesma pessoa jurídica, e "de que unidade saiu esta venda"
ganha duas respostas certas. Com reabrir, o engano custa dois fatos.

**Motivo** fecha `LACUNA-NUC-042`. **Necessidade:** tirar de operação a unidade que parou, sem perder o
que ela vendeu e sem terminal dela vendendo. **Recusado:** apagar ou inverter campo (já em
`RN-NUC-051`), e encerrar sem precondição, que fecha a unidade com dinheiro ou documento de desfecho
desconhecido dentro. **Nosso:** fato com a precondição que o fechamento do dia já usa. **Melhor** porque
"esta unidade pode parar?" e "este dia pode fechar?" passam a ter a mesma resposta, e porque os
terminais caem no ato, em vez de depender de alguém descomissionar um por um.

**Aceite** (1) A sem pendência: `owner` encerra; no mesmo ato os três terminais de A perdem a
habilitação e a faixa não usada é encerrada; "quais unidades operavam em 2026-09-11" ainda responde A.
(2) A com sessão aberta: recusado, nomeando a sessão, e a recusa é fato (`RN-NUC-043`). (3) `manager`
de A tenta encerrar: negado. (4) `owner` reabre A: nenhum terminal vende até ser habilitado de novo.

**Infeliz** (a) terminal de A offline no encerramento vende até o prazo da habilitação vencer → as vendas
**existem** e entram como fato de A; as de instante posterior ao encerramento viram ocorrência escalada
ao `establishment_responsible`, com a janela declarada, nunca descartadas
([[gotcha-revogacao-de-terminal-nao-alcanca-offline]]). (b) o dia não fecha → cada bloqueio nomeado com
o caminho, como `RN-NUC-031`; não existe encerrar "forçado".

**Offline** recusa em D1, D2 e D3. **Registra** encerrar e reabrir com autor, papel e instante; cada
habilitação revogada pelo encerramento, com a causa; a recusa, com o bloqueio. **Não registra** estado
"ativo" sobrescrito: é derivado (`RN-NUC-051`).

### RN-NUC-060 — Estabelecimento não muda de cliente: loja vendida é encerrada num cliente e criada no outro, e nada atravessa

**Enunciado** não existe operação que altere o vínculo de `RN-NUC-050`. Venda da loja, cisão ou
reorganização em que a unidade passa a outro cliente se fazem com duas operações que já existem:
**encerrar** no cliente de origem (`RN-NUC-059`) e **criar** no de destino (linha 23), como
estabelecimentos distintos. Nenhum fato, configuração, atribuição, fila, faixa ou habilitação atravessa;
a história da unidade fica com o cliente de origem. O aparelho é o que pode ir junto com a loja, e ele
não leva nada: habilitá-lo no outro cliente segue `RN-NUC-061`, aparelho com passado.

**Escala** o eixo é clientes: cada caminho entre ambientes isolados é travessia de schema, e a
rotatividade de loja pequena (vendida, arrendada, trocando de sócio) a tornaria rotina, não exceção.

**Motivo** fecha `LACUNA-NUC-043`. **Necessidade:** quem compra a loja opera no dia seguinte, e o passado
de um dono não se mistura com o do outro. **Recusado:** mover a unidade com os fatos — entrega ao
comprador as vendas, a identificação de comprador onde a entrega a exigiu (`RN-EMI-017`) e a trilha de
quem trabalhou para o vendedor, e seria a única operação do produto a furar o invariante 1 por desenho.
**Nosso:** encerrar e criar. **Melhor** porque o isolamento fica absoluto por construção — não há
caminho a auditar — e o que o comprador perde, o catálogo pronto, ele recupera publicando
(`RN-NUC-014`); o que o vendedor perderia com a mudança, não.

**Aceite** (1) nenhuma das duas matrizes tem operação que altere o cliente de um estabelecimento. (2)
loja vendida: A encerrada no cliente X, A' criada no Y; nenhuma leitura de Y alcança fato de A, e as
vendas de A seguem em X com a unidade nomeada. O terminal que vai junto é `RN-NUC-061`, aceite (7).

**Infeliz** o comprador pede o histórico do vendedor → é do vendedor, e entregá-lo é decisão dele, fora
do produto. **Gate, respondido em 2026-09-23** (T-0015): encerrar e criar não abrem caminho de servidor;
abriam um pelo aparelho (`IDN-01`, ALTO, `docs/auditorias/2026-09-23-d-03-decisao.md:192`). Mudaram a
última frase do enunciado, a do aceite e este parágrafo, que dava a confirmação por pendente.

### RN-NUC-061 — Habilitar terminal a vender é ato de `manager` ou `owner`, com contato; renovar é efeito do contato, e não é ato de ninguém

**Enunciado** habilitar um terminal a vender por um estabelecimento (`RN-OFF-032`i) é operação do
`manager` e do `owner` daquele estabelecimento, com contato, com registro e com **segundo fator** de quem
habilita, inclusive quando o pedido parte de terminal já habilitado (matriz, linha 40, nota ²⁰). A
habilitação é emitida para **um** estabelecimento, logo para um cliente, e **nunca é revinculada**: o
terminal tem no máximo uma vigente, e vender por outra unidade é descomissionar na atual (linha 30,
`RN-OFF-016`) e receber habilitação **nova** na outra. O estabelecimento e o cliente de um fato são os da
habilitação sob a qual ele nasceu, nunca os que o registro do terminal disser quando o fato sobe.
**Precondições**, e é aqui que "estabelecimento recém-criado não vende"
passa a ter onde ser conferido: unidade não encerrada (`RN-NUC-059`); `queue_owner` declarado
(`RN-NUC-020`, aceite); fuso e moeda publicados e vigentes (`RN-NUC-057`, `RN-NUC-058`). **Renovar** não
é operação de papel: acontece a cada contato **autenticado** do terminal cuja habilitação não foi
revogada nem declarada comprometida, e produz fato de renovação (`RN-PRV-013`) sem autor humano;
habilitação vencida pelo prazo se renova no contato seguinte pela mesma regra. Terminal declarado
**comprometido** (linha 34) nunca é renovado nem reabilitado: recuperado, entra como terminal novo. Como
o terminal prova que é ele é mecanismo, que `D-03` deixou fora (eixo E2).

**Aparelho com passado em outro cliente** só é habilitado depois de a fila de lá estar **drenada** para
a origem ou **declarada** nela (`RN-OFF-016`). Drenar não exige a habilitação antiga vigente: revogada,
ela ainda entrega à origem o que nasceu sob ela (`RN-NUC-059`, infeliz (a)), e só isso. O que o aparelho
retém de lá é **comprometido na origem**, com os efeitos de `RN-OFF-016`, infeliz, e o conjunto de
identificação dos operadores de lá também (`RN-OFF-033` d); nada disso é lido sob a habilitação nova.
A recusa no destino não nomeia a origem, e o fato na origem não nomeia o destino.

**Escala** terminais por unidade e unidades por cliente. Só `owner` habilitando faz o terminal quebrado
às 6h da unidade 9 esperar uma pessoa, e a unidade não vende — o preço que `papeis-e-permissoes.md` §4.1
recusou para a capacidade de assinar. Renovação por ato humano cresce com os terminais e falha por
esquecimento: "terminal que vai vencer é caixa que vai parar" (`fatos-de-operacao-provedor.md:334`).

**Motivo** a célula não existia, e sem linha a operação era negada a todos (`RN-NUC-026`): nenhum
terminal começava a vender. `cashier` fica fora porque habilitar cria o ponto que sustenta o ato
ordinário sem contato, e o papel-piso existe para não alcançar quem vende em nome da unidade. `manager`
entra porque habilita no escopo dele, para vender em nome da unidade dele, e cada habilitação e cada
venda têm autor visível ao cliente. `provider_support` fica fora pelo default de `RN-NUC-024`(a).
**Alterado em 2026-09-23** (T-0015, contra [[decision-d-03-opcao-c-sujeito-local-ao-cliente]]): entraram
não revinculação, cliente do fato, aparelho com passado, segundo fator, aceites (7) a (9) e infelizes (b)
a (d), sem retirar nada, porque o aparelho vendido com a loja levava a fila de X para Y (`IDN-01`,
`docs/auditorias/2026-09-23-d-03-decisao.md:192`) e o furtado habilitava outro que sobrevivia a ele (`:341`).

**Aceite** (1) `manager` de A habilita terminal por A: fato com autor, papel, terminal, unidade e
validade, e o terminal passa a praticar as nove linhas do ato ordinário. (2) o mesmo `manager` em B,
sem atribuição lá: negado. (3) `cashier`: negado. (4) unidade sem `queue_owner` ou sem fuso publicado:
recusado, nomeando o que falta, e a recusa é fato. (5) terminal habilitado por A, pedido por B: recusado
enquanto vigora A. (6) terminal sem contato além do prazo (`LACUNA-OFF-017`) se conecta: renova sem
ninguém agir; com furto registrado, não renova, e a tentativa é fato. (7) `IDN-01`: A, de X, encerrada
com T sem contato e três vendas retidas; o `manager` de A', de Y, pede habilitar T → recusado, dizendo só
que há fila de outro cliente a entregar; T se conecta, as três sobem para X como vendas de A, nenhuma em
Y, e o pedido seguinte é aceito com habilitação nova; X registra a saída de T e o comprometimento. (8)
nenhum fato é atribuído a unidade ou cliente diferente dos da habilitação sob a qual nasceu, mesmo com o
registro do terminal mudado. (9) `manager` em T1, prova certa, sem segundo fator, pede habilitar T9 →
recusado; com ele, aceito, e a habilitação de T9 registra de que terminal foi pedida.

**Infeliz** (a) o contato acontece e o terminal não prova quem é → não renova, e fica não habilitado até
ser habilitado de novo; nunca renovação "de boa-fé". (b) aparelho apagado ou reinstalado antes de drenar
→ a fila é perda de X, declarada pela linha 34 na forma de `RN-OFF-016`, infeliz, e para Y é aparelho
novo. (c) a drenagem falha e ninguém de X declara → não habilita em Y, e o caminho de Y é outro aparelho;
nunca "habilitar agora e entregar depois". (d) quem habilita perdeu o segundo fator → não habilita até
outro papel que o alcance restabelecê-lo, com contato; os terminais já habilitados seguem vendendo.
**Offline** habilitar é recusa em D1, D2 e D3; renovar só existe com contato. **Registra** habilitação,
com o terminal de onde foi pedida quando foi; renovação; recusa, com o motivo; na origem, a saída do
aparelho. **Não registra** o material de prova (segredo nunca); no destino, nada da origem, e na origem,
nada do destino (`RN-NUC-060`).

---

## 2. O que isto muda em quem já estava escrito

**Em 2026-09-11, nada de valor.** `RN-NUC-018`, `RN-NUC-038`, `RN-NUC-031` e `RN-OFF-032` já **usavam** a
entidade; passaram a ter onde apoiá-la, e a linha 23 da matriz passou a citar `RN-NUC-050`.

**Em 2026-09-23**, `RN-NUC-057` e `RN-NUC-058` contradizem texto aprovado, e o contradito foi alterado ou
pedido na mesma passada: `glossario.md` §1.1 (fuso e moeda "do cliente"), `fronteira-do-nucleo.md` §2.1
("Fuso e moeda do cliente"), `nucleo-venda.md` §6 (`LACUNA-NUC-001`). Fora deste despacho, e pedidos ao
dono: `.claude/rules/dados.md` §3 e `.claude/rules/ui.md` §3 ("fuso e moeda do cliente"),
`fatos-de-operacao.md` (`RN-NUC-042`, "do estabelecimento ou do cliente"), `nucleo-publicacao-e-texto.md`
(`RN-NUC-013`, que cita `LACUNA-NUC-001`) e `operacao-offline-e-sincronizacao.md` (`LACUNA-OFF-006`).

## 3. A ausência que resta

**Identidade fiscal.** O núcleo sabe que a unidade **tem** identidade jurídica própria
(`fronteira-do-nucleo.md:133`) e nada além. Do que ela se compõe — inscrição, regime, responsável — é do
cliente e de `FIS` (`fronteira-do-nucleo.md:247`, `catalogo-de-modulos.md:72`), e o catálogo de regra
fiscal ainda **não tem casa** (`D-05`). Nenhum campo fiscal é afirmado aqui; se a norma exige contador
ou responsável legal, é `LACUNA-NUC-012`, do humano.

Fuso e moeda estavam aqui até 2026-09-23, como ausências nomeadas; hoje são `RN-NUC-057` e `RN-NUC-058`.

## 4. Lacunas abertas aqui — as três fechadas em 2026-09-23

- **`LACUNA-NUC-041`** — **FECHADA em 2026-09-23** → `RN-NUC-058`
  ([[decision-fuso-e-moeda-sao-do-estabelecimento]]). Perguntava se a moeda é do cliente ou do
  estabelecimento, com duas regras aprovadas dizendo coisas diferentes. É do estabelecimento.
- **`LACUNA-NUC-042`** — **FECHADA em 2026-09-23** → `RN-NUC-059`
  ([[decision-estabelecimento-encerra-reabre-e-nunca-muda-de-cliente]]). Dizia que encerrar não era
  operação e pedia: quem encerra, o que acontece com sessão aberta, terminal, faixa e obrigação pendente,
  e se é reversível. `owner`; a lista de `RN-NUC-031` bloqueia; terminais e faixa caem no ato; reversível
  por reabrir, que não ressuscita habilitação.
- **`LACUNA-NUC-043`** — **FECHADA em 2026-09-23** → `RN-NUC-060` (mesmo registro). Perguntava se o
  estabelecimento muda de cliente. Não muda, e loja vendida é encerrar e criar. `seguranca` respondeu
  em 2026-09-23 que o aparelho abria travessia (`IDN-01`), fechada em `RN-NUC-061`.

## Referências

`docs/produto/glossario.md:30` · `:35` · `:40` · `docs/produto/papeis-e-permissoes.md:75` (`RN-NUC-018`) ·
`:116` (`RN-NUC-019`) · `docs/produto/nucleo-venda.md:137` (`RN-NUC-003`) · `:294` (`RN-NUC-038`) ·
`:382` (`LACUNA-NUC-036`) · `docs/produto/nucleo-publicacao-e-texto.md:27` (`RN-NUC-013`) · `:105`
(`RN-NUC-014`) · `docs/produto/matriz-operacao-papel.md` §4, linhas 23, 30, 34, 38, 40, 41, nota ²⁰ ·
`docs/produto/matriz-operacao-papel-contrato.md:36` (`RN-NUC-026`) · `docs/auditorias/2026-09-23-d-03-decisao.md:192` ·
`:341` · `docs/produto/fatos-de-operacao-provedor.md:166` (`RN-PRV-013`) · `:334` ·
`docs/produto/fila-local-autoridade-e-identidade.md:123` (`RN-OFF-032`) · `:230` (`RN-OFF-033`) ·
`docs/produto/fiscal-regimes-e-vigencia.md:142` (`RN-FIS-008`) · `docs/produto/fatos-de-operacao.md:102`
(`RN-NUC-042`) · `docs/produto/fronteira-do-nucleo.md:55` · `:57` · `:133` · `:247` ·
`.claude/rules/dados.md` §4 · `memory/processo/convention-decisao-delegada-com-aviso-no-modulo.md`

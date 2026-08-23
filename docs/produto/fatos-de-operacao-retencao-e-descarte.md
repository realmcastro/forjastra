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
> e as perguntas dos quatro moram no irmão principal** (§7).
>
> **O que este arquivo não é.** Não é tabela, coluna, índice, política de expiração, rota nem tela.
> **Nenhum número:** retenção, janela e teto entram como grandeza com unidade e **sem valor**. Nenhuma
> célula de autorização é valorada, e `D-01` a `D-06` não são presumidas.
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
desta regra descreve. Enquanto `LACUNA-NUC-038` estiver aberta os quatro não são agendáveis, e a decisão
dela chega ao humano **com esta consequência à vista**: aprovar os quatro é aprovar volume no recurso
mais escasso do terminal.

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
nunca constante embutida (`RN-OFF-028`).

---

## 2. Onde o fato repousa — retenção e janela de leitura

### RN-NUC-049 — Retenção de uma classe é ≥ a janela mais longa de leitura publicada sobre ela; janela truncada por retenção é declarada inexistente, nunca apresentada como valor

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
desta regra tem valor.

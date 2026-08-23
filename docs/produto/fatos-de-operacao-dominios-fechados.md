# Fatos de operação — os domínios fechados de valor que um fato carrega

> **Terceiro irmão de `fatos-de-operacao.md` e `fatos-de-operacao-provedor.md`, com o mesmo peso
> normativo.** Nasceu em 2026-08-23, no conserto do passo 4 da T-0004: o irmão principal estava em 381
> linhas, no teto de 400, e faltavam **duas** listas fechadas que só valem se nascerem com o campo.
>
> **Eixo da partição.** O primeiro eixo do conjunto é **quem pratica o fato** (operação do cliente ×
> papéis nossos). O segundo, deste arquivo, é **o fato × o domínio fechado de valor que ele carrega**:
> aqui moram o fato de recusa e as **três** listas fechadas — motivo de **recusa** (`RN-NUC-043`, cuja
> regra dona continua no irmão, §2), motivo de **cancelamento** (`RN-NUC-047`) e **modo de atendimento**
> (`RN-NUC-048`). O **quarto** irmão, da mesma data, é `fatos-de-operacao-retencao-e-descarte.md` (o fato
> depois do instante). **As lacunas e as perguntas dos quatro moram no irmão principal** (§7).
>
> **Por que estas três coisas ficam juntas, e não é arrumação.** Elas são a mesma decisão repetida: um
> campo cujo valor é de **lista fechada, com código estável**, e cuja enumeração só estreita algo se
> nascer **na mesma passada em que o campo nasce**. Enumeração aplicada depois, sobre texto livre, não
> estreita nada (`convention-campo-de-texto-livre-nao-e-campo-enumeravel`) — é irrecuperável pelo mesmo
> mecanismo que faz esta ficha existir. Errar aqui não custa migration: custa a pergunta que nunca mais
> tem resposta.
>
> **O que este arquivo não é.** Não é tabela, coluna, tipo, chave nem retenção. Não valora célula de
> autorização. **Nenhum número.** Nada foi renumerado ao ser movido para cá, e nenhum motivo da lista de
> recusa foi acrescentado, removido ou reescrito na mudança.
>
> **Formato das regras:** `Enunciado` · `Motivo` · `Aceite` · `Infeliz`.

---

## 1. O fato de recusa, e a lista fechada de motivos

Um fato — `operation_refused` — com motivo enumerado. Ator, instante e módulo dono como na §3 do irmão;
domínio de conexão presente quando ele é parte da causa. Grão candidato: **uma linha por tentativa**
(`RN-NUC-043`, infeliz). A regra dona é `RN-NUC-043`, em `fatos-de-operacao.md` §2.

### 1.1 Os motivos, e o que cada um diagnostica

| Motivo | Diagnostica | Regido por | Consome |
|---|---|---|---|
| `no_contact` | **infraestrutura**: link, LAN ou serviço externo, e o domínio diz qual | `RN-OFF-001` a `RN-OFF-005` | C · P |
| `external_authorization_denied` | **resposta negativa obtida** — adquirente negou, autorizador rejeitou ou denegou. **Não** é o mesmo que não obter resposta, e confundir os dois é o erro que faz trocar de operadora por causa de link | `RN-NUC-005`, `RN-EMI-024` | C · P |
| `authority_absent` | **configuração de papel**: célula que nega, autoridade retida vencida, concessão ausente | `RN-NUC-039`, `RN-OFF-007`, `RN-OFF-024`, `RN-NUC-024` | C · P |
| `published_artifact_missing` | **publicação**: item sem preço publicado, limite não publicado, versão de regra ausente | `RN-NUC-002`, `RN-NUC-013`, `RN-FIS-011` | C · P |
| `resource_exhausted` | **recurso escasso**: faixa esgotada, teto offline atingido, recurso local no limite | `RN-OFF-006`, `RN-OFF-014`, `RN-OFF-015` | C · P |
| `module_inactive` | **capacidade não contratada** — é o motivo que responde "o que este cliente tentou e não tinha" | `catalogo-de-modulos.md`, `RN-REL-005` | C · P |
| `business_precondition_unmet` | **precondição do negócio**: sessão de caixa fechada, pedido sem item, lista de bloqueio com item no fechamento do dia, **venda sem modo de atendimento declarado** | `RN-NUC-004`, `RN-NUC-031`, `RN-NUC-048` | C |
| `unclassified_operation` | **defeito nosso**: operação sem classificação ou sem célula, recusada pelo default | `RN-OFF-008`, `RN-NUC-039` | P |

**O canal do lado `P`, declarado em 2026-08-23 (`PRV-12`).** Esta tabela entra na lista de `RN-PRV-009`
(cláusula b), e o canal de **toda** linha dela é `RN-PRV-009`: recusa é **observação de operação**, nunca
fato de negócio do cliente. A decisão nossa que sustenta o `P` é do **fato**, não do valor — o motivo de
`RN-NUC-043` a nomeia: separar diagnóstico de **infraestrutura**, de **configuração de papel** e de
**defeito nosso**, que é o que faz "não deu" virar três correções diferentes. `operation_refused` é **um**
fato com domínio fechado; a coluna `Consome` por motivo diz apenas **em que valores** cada leitura recai.
A **forma** admissível de cada uma — retida por estabelecimento × agregada sobre clientes — é decisão de
**repouso** (`D-06`), encaminhada pelo passo 6, e não se escolhe aqui.

**A lista é fechada.** Motivo novo entra por alteração de `RN-NUC-043`, com a `RN` dona citada — nunca
como texto livre, e nunca acomodado em um motivo existente "porque é parecido". Ocorrência que não
cabe em nenhum é registrada como `unclassified_operation`, que é **trabalho visível**, não categoria
de repouso: é o mesmo mecanismo de `RN-OFF-008`, e é ele que impede a lista de virar mentira por
conveniência.

**O que a recusa nunca carrega:** o texto exibido ao operador (é mensagem de operação, e mensagem não
é campo de decisão), qualquer dado de pagamento, e qualquer texto de terceiro como campo enumerado
(`RN-OFF-027`, `RN-OFF-023`) — presença, não conteúdo.

---

## 2. O motivo da correção de venda concluída

### RN-NUC-047 — Cancelamento, devolução e estorno carregam motivo **enumerado**; sem lista fechada, "por que cancelamos tanto" não tem resposta nunca

**Enunciado** o fato novo que corrige venda concluída (`RN-NUC-008` — cancelamento, devolução, estorno)
carrega, além de autor, instante e referência ao original, um **motivo de código enumerado**, da lista
fechada de §2.1. O motivo é **campo de decisão** e nunca texto livre; texto livre pode acompanhar como
observação e **não** é campo de decisão nem de agregação (mesma separação de `RN-NUC-043`). Devolução
enumera o motivo **por item devolvido**, porque é por item que ela existe. Ocorrência que não cabe em
nenhum código é registrada como **não classificada**, que é defeito nosso visível, não categoria de
repouso. Esta regra **não** altera nenhum desfecho de `RN-NUC-008`: ela fixa a **forma** de um campo que
aquela regra já exige.

**Motivo** é o mecanismo de `RN-NUC-043` aplicado ao outro fato que ninguém enumerou, e o passo 4 da
T-0004 o nomeou como irrecuperável: a recusa ganhou lista fechada e o **cancelamento** não. Sem ela,
"por que cancelamos tanto neste cliente" só tem resposta lendo texto livre — que ninguém lê, e que não
agrega. E as causas que mais se parecem para quem opera são as mais diferentes para quem conserta:
cancelamento por **erro de quem operou** é treino ou superfície; por **preço publicado errado** é
defeito de publicação e não do operador; por **registro em duplicidade** é defeito de idempotência
**nosso**; por **desistência do cliente-final** não é defeito de ninguém e é o motivo legítimo mais
comum. Sem código, as quatro chegam como "cancelou", que é o mesmo que não chegar. Enumerar depois não
estreita nada: o campo nasce agora, com o fato.

**Aceite** ao fim de um mês, com o mesmo volume de cancelamentos, responder **sem ler um só texto
livre**: quantos foram erro de operação, quantos foram preço ou limite publicado errado, quantos foram
duplicidade e quantos foram desistência do cliente-final — e, para o terceiro, apontar em que terminal e
em que faixa do dia. Segundo aceite, o negativo: nenhum fato de correção existe sem código de motivo, e
tentar registrar a correção sem ele → recusado, com fato de recusa
(`business_precondition_unmet`). Terceiro: uma devolução de dois itens em que só um voltou por defeito
distingue os dois motivos, item a item.

**Infeliz** o motivo verdadeiro não está na lista — e vai acontecer, porque a operação real inventa
casos. Então o fato nasce **não classificado**, o que é trabalho nosso visível e contável, e o código
novo entra por alteração desta regra, com a `RN` dona citada. Nunca se acomoda caso novo num código
existente "porque é parecido": um `operator_error` inflado esconde exatamente o defeito de produto que a
lista existe para achar.

### 2.1 Os motivos da correção, e o que cada um diagnostica

| Motivo | Diagnostica | Regido por |
|---|---|---|
| `operator_error` | **operação**: lançou, cobrou ou concluiu errado. Contado por terminal e por faixa do dia, é treino ou superfície — nunca conclusão sobre a pessoa (`RN-REL-008` continua decidindo leitura por pessoa) | `RN-NUC-008` |
| `customer_withdrawal` | **nada do produto**: o cliente-final desistiu, trocou de ideia ou não levou. É o motivo legítimo mais comum, e existe para **não** inflar os outros | `RN-NUC-008` |
| `item_unavailable` | **catálogo ou disponibilidade**: o que foi vendido não pôde ser entregue | `RN-NUC-002`, `RN-NUC-013` |
| `item_rejected_by_customer` | **o que foi entregue**: recusado por defeito, item trocado ou qualidade. É de produto ou de produção, não de venda | `RN-NUC-008` |
| `published_artifact_incorrect` | **publicação**: preço, desconto, encargo ou limite aplicado estava errado. É o motivo que impede que erro de publicação apareça como erro de operador | `RN-NUC-013`, `RN-NUC-014` |
| `payment_unresolved` | **pagamento**: não se consumou, ou foi desfeito pelo lado do meio de pagamento. O desfecho é regra de `RN-NUC-005` e do módulo dono, nunca deste campo | `RN-NUC-005` |
| `duplicate_record` | **defeito nosso**: a mesma venda ficou registrada duas vezes. Contado, é o único desta lista que aponta para nós — idempotência ou superfície | `RN-NUC-003` |
| `external_requirement` | **exigência externa**: a correção decorre de obrigação documental ou de determinação de terceiro. A regra do desfecho é do módulo dono (`RN-EMI-021`, `RN-FIS-006`), **nunca** daqui, e nada aqui afirma norma | `RN-NUC-008` |
| `unclassified_correction` | **defeito de classificação nosso**, visível e contável | `RN-NUC-008` |

---

## 3. O modo de atendimento

### RN-NUC-048 — Modo de atendimento é domínio fechado do núcleo; ausência não é valor, e cada fato carrega o modo vigente no instante dele

**Enunciado** `service_mode` (`glossario.md` §1.3) é **domínio fechado do núcleo**, com código estável:
nunca texto livre, nunca termo de ramo (`mesa`, `balcão`, `bomba`, `delivery` **não** são valores) e
nunca inferido do canal de entrada (`channel`, de `PCF`). O domínio mínimo é o do glossário: atendido
**presencialmente no estabelecimento** × **entregue em endereço**. Quatro cláusulas: (a) **não existe
valor "não informado"** — a venda **não se conclui** sem modo declarado, e a recusa é fato com motivo
`business_precondition_unmet` (§1.1); (b) **cada fato carrega o modo vigente no instante daquele fato**,
e nenhum fato tem o modo reescrito depois — mudar o modo enquanto o pedido está em construção é alteração
local do pedido (`RN-NUC-001`), **não** fato novo, e a diferença entre abertura e conclusão se lê nos dois
fatos; (c) **valor novo entra por alteração desta regra**, com o teste dos três negócios escrito, e
**módulo não acrescenta valor** a este domínio por conta própria; (d) qualquer efeito do modo sobre
preço, encargo, tributo, produção ou entrega é regra do **módulo dono**, declarada lá — o núcleo não
presume nenhum.

**Motivo** o termo existe no glossário desde a primeira passada, é conteúdo de `order_opened`
(`fatos-de-operacao.md` §3) e **nenhuma regra numerada o regia** — é o resíduo de `LACUNA-GLO-002`, o
último dela, e o passo 4 da T-0004 nomeou a consequência: fato de núcleo cujo conteúdo é conceito sem
regra nasce com o valor indefinido, e o valor indefinido de um conceito de atendimento vira **texto
livre** ou **código de ramo**. As duas saídas são caras e diferentes: texto livre torna "quanto do meu
faturamento é entrega" irrespondível para sempre; código de ramo põe `mesa` num campo do **núcleo**, que
é o defeito que `glossario.md` §5 lista e que só sai com migration em N schemas. E o glossário já
proibia inferir do canal, sem dizer o que acontece quando o modo **falta** ou **muda** — que era
exatamente o que faltava.

**Aceite** concluir venda sem modo declarado → **negado**, com fato de recusa
`business_precondition_unmet`, e nenhuma venda existe. Pedido aberto como presencial e concluído como
entrega → `order_opened` diz presencial, `sale_concluded` diz entrega, e a leitura sabe as duas coisas
**sem** nenhum campo mutável; a pergunta "quantos atendimentos mudam de modo no meio" é respondível sem
coleta nova. Teste negativo, conferível por busca: nenhum valor de `service_mode` em spec, exemplo ou
leitura é `mesa`, `balcão`, `bomba`, `delivery` ou texto livre; e nenhuma regra deduz o modo do canal.

**Infeliz** o cliente quer um modo que o domínio não tem — consumo no local com serviço à mesa, retirada
no balcão de pedido feito de casa, entrega por terceiro. **Necessidade legítima:** o negócio dele atende
de formas que o par mínimo não separa. **O teste, e ele é o mesmo de sempre:** se o modo muda o que o
**núcleo** faz com a venda para um posto, uma padaria **e** uma loja de roupa, ele entra no domínio por
alteração desta regra; se muda só o que **um módulo** faz, o vocabulário é do módulo — `channel` (`PCF`),
`fulfillment_state` (`CMP`), mesa e comanda (`MSA`) — e o modo continua sendo um dos dois. Acomodar valor
de ramo no domínio do núcleo é barato hoje e é o defeito mais caro deste projeto amanhã.

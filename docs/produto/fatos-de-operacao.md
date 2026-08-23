# Fatos de operação — o que o sistema registra no instante em que acontece

> **O que este arquivo é.** A lista dos **fatos** que o produto tem de registrar no instante em que
> acontecem, porque fato não capturado no instante é **irrecuperável** — é a única parte do desenho
> que migration nenhuma conserta depois. Um agregado desagrega-se nunca: se o fato guarda só o total
> da venda, nenhuma tela futura responde "qual item não está compensando", porque o dado **nunca
> existiu**. Daí a ordem desta ficha: fato antes de modelo, modelo antes de tela.
>
> **Quatro arquivos, um conjunto normativo.** Primeiro eixo da partição: **quem pratica o fato** — aqui, o
> que a **operação do cliente** produz (caminho de venda, conectividade, tempo); em
> `fatos-de-operacao-provedor.md`, o que os **papéis nossos** praticam e o **ciclo de vida** do cliente,
> do módulo, do schema e do terminal. Segundo eixo, aberto em 2026-08-23 porque este arquivo chegou ao
> teto de 400 linhas: **o fato × o domínio fechado de valor que ele carrega** — em
> `fatos-de-operacao-dominios-fechados.md` moram o fato de recusa e as **três** listas fechadas (motivo
> de recusa, motivo de cancelamento, modo de atendimento). Terceiro eixo, aberto na mesma data pela mesma
> razão: **o fato depois do instante** — em `fatos-de-operacao-retencao-e-descarte.md` moram a ordem de
> sacrifício do recurso local (`RN-NUC-046`, movida verbatim) e a relação entre retenção e janela de
> leitura (`RN-NUC-049`). As **lacunas e as perguntas dos quatro moram aqui** (§7).
>
> **Numeração.** `RN-NUC-041` a `RN-NUC-045` aqui; `RN-NUC-046` e `RN-NUC-049` no irmão da retenção;
> `RN-NUC-047` e `RN-NUC-048` no irmão dos domínios
> fechados; `RN-PRV-011` a `RN-PRV-014` no irmão do provedor. Duas famílias
> porque são dois escopos, e a fronteira é o teste dos três negócios: registrar o caminho da venda no
> grão do acontecimento é do **núcleo** — posto, padaria e loja de roupa precisam **todos** dele para
> saber o que vende, o que se anula e onde a operação trava. Registrar o que **nós** fazemos e o
> estado do ambiente que **nós** operamos é `provedor`. **Nenhum código de módulo novo:** registrar
> fato não é módulo — o cliente não o desliga, e se pudesse desligá-lo o dado faltaria, e a falta é a
> coisa irrecuperável. Nada foi renumerado; `glossario.md` §4.3 não muda.
>
> **O que este arquivo não é.** Não é tabela, coluna, índice, tipo, chave, retenção em dias, rota,
> tela nem gráfico. O **grão** aqui é **candidato**: o veredito é do `arquiteto-dados` (passo 4 da
> T-0004), e é lá que mora `D-06`. Nenhuma célula de autorização é valorada aqui, e nenhuma decisão
> aberta (`D-01` a `D-05`) é presumida. **Nenhum número:** grandeza entra com unidade e sem valor,
> como em `offline-grandezas-e-orcamento.md`.
>
> **Formato das regras:** `Enunciado` · `Motivo` · `Aceite` · `Infeliz`. **`PROVISÓRIA`** no título de
> um fato = ele depende de lacuna com dono e **não é agendável para construção**; o que se agenda é
> resolver a lacuna.

---

## 1. As seis colunas, e por que nenhuma é opcional

Todo fato desta spec declara seis coisas. Falta uma, o fato não entra — e "não entra" é resposta, não
ausência de resposta.

| # | Campo | O que ele impede |
|---|---|---|
| 1 | **O fato**, nomeado em inglês pelo glossário | dois nomes para a mesma coisa, que é como o modelo nasce com duas tabelas para um conceito |
| 2 | **O instante**, e **de quem é a hora** | "hora do pico" sem sujeito de fuso, que é opinião com aparência de número (`RN-NUC-042`) |
| 3 | **O ator** — pessoa, papel, terminal, ou **nós** | fato órfão, que não sustenta trilha nem diagnóstico |
| 4 | **A decisão que ele informa**, e quem a toma | base inchada: dado coletado "porque um dia serve" (`RN-NUC-044`, disciplina de `RN-REL-001`) |
| 5 | **Quem consome** — o cliente, o provedor, ou os dois | fato coletado para nós sem o cliente saber, e fato do cliente que ninguém lê |
| 6 | **Grão candidato** | agregado nascendo no lugar do fato, que é o defeito irreversível (`RN-NUC-041`) |

O campo 4 **não admite lacuna** — é o mesmo corte de `RN-REL-001`, e vale aqui pela mesma razão:
"pode ser útil depois" é a frase que faz qualquer fato entrar. Os campos 2 e 6 admitem lacuna com dono
nomeado, porque a resposta deles é de outro agent ou do humano.

**Registrar não é ler.** O fato guarda o autor porque a trilha exige (`RN-NUC-029`); **ler por
pessoa** é outra operação, ela depende de decisão do humano (`RN-REL-008`) e de célula (`RN-NUC-039`),
e compor um panorama a partir de fatos alcançados um a um é vedado sem declaração (`RN-ATI-017`).
Nenhuma linha desta spec autoriza leitura. Confundir as duas coisas é o atalho pelo qual uma base
honesta vira vigilância.

---

## 2. A disciplina

### RN-NUC-041 — Fato nasce no grão do acontecimento; agregado é escolha de leitura, e só dois freios adiam o grão fino

**Enunciado** todo fato de operação é registrado no grão do **acontecimento individual** — um
lançamento, uma retirada, um pagamento, uma recusa, uma transição de conectividade —, e cada um
declara **qual operação** o produziu e **qual módulo é dono** dela. Nenhum agregado (contador por
hora, total por dia, média por turno) é registrado **no lugar** do fato: agregado é derivação de
leitura, reconstruível a partir dos fatos. Na dúvida entre gravar o detalhe e gravar o total, grava-se
o detalhe. **Adiar o grão fino exige um de dois freios, escrito:** (a) **custo medido** — não
estimado — que o `performance` mede e reporta; (b) **dado pessoal que a minimização proíbe**
(`RN-EMI-017`, `RN-OFF-027`, `RN-OFF-023`, `.claude/rules/seguranca.md` §3). "Não vamos precisar
disso" **não é freio**.

**Motivo** a assimetria é total e é o motivo de esta spec existir antes do modelo: de fato fino
extrai-se qualquer agregado, e de agregado não se extrai fato nenhum — o detalhe não foi perdido, ele
nunca existiu. É também o que sustenta a promessa de "maneiras diferentes de ver o negócio": maneira
nova de ver é consulta nova sobre o mesmo fato, não coleta nova. E declarar o módulo dono em cada
fato é o que torna respondível "qual módulo está sendo usado" **sem** inventar telemetria de módulo:
a resposta é leitura sobre fato que já existe.

**Aceite** três perguntas que ninguém previu, respondidas sem coletar nada novo: *qual item foi
lançado e retirado antes de concluir, por faixa do dia* · *qual meio de pagamento aparece em que
faixa do dia* · *qual módulo produziu operação neste estabelecimento no mês* — todas derivadas dos
fatos das §3 a §5. Teste negativo: nenhum fato desta spec é um contador, um total ou uma média.

**Infeliz** o grão fino é caro, e o custo foi **medido**. Então o que se adia é declarado: qual fato,
qual grão reduzido, qual pergunta deixa de ser respondível **e desde quando** — e a redução é fato
datado, não default silencioso. Reduzir grão sem medida é o oposto desta regra: é a decisão
irreversível tomada por conveniência.

### RN-NUC-042 — Todo fato declara de quem é a hora; "hora do dia" sem sujeito de fuso não é fato

**Enunciado** o instante de um fato é medido **no terminal**, no momento em que o fato acontece, e a
divergência de relógio é fato próprio (`RN-OFF-019`) — isto já é regra e não muda aqui. O que esta
regra acrescenta: nenhuma spec, leitura ou pergunta desta família usa "hora do dia", "pico", "dia" ou
"mês" **sem declarar de quem é o fuso** — do **estabelecimento** ou do **cliente (tenant)**. Enquanto
`LACUNA-GLO-001` estiver aberta, quem escrever regra que dependa disso **cita a lacuna** e declara
qual dos dois está assumindo; ninguém escolhe "para destravar".

**Motivo** o fuso decide a **que dia o fato pertence**, logo decide apuração, fechamento, turno e
"vendas de hoje" — e há duas regras aprovadas em conflito (vigência no fuso do estabelecimento ×
"hoje" no fuso do cliente). O defeito é invisível com um estabelecimento só e aparece com dois, o que
o torna o pior tipo: descoberto em produção, no cliente que cresceu. Resolvê-lo mexe em
`.claude/rules/dados.md`, que é território do **humano** — então esta regra não resolve, ela impede
que o conflito seja atravessado por acidente. "Que horas é o pico" é exatamente a pergunta que o faz
reaparecer.

**Aceite** buscar "hora", "pico", "dia" e "mês" nesta família e em toda leitura derivada dela →
**toda** ocorrência tem sujeito de fuso declarado ou cita `LACUNA-GLO-001`. Cliente com dois
estabelecimentos em fusos diferentes: o mesmo fato não aparece em dois dias diferentes em duas
leituras diferentes, porque cada leitura diz de quem é o dia que ela usou.

**Infeliz** a leitura precisa de "hoje" e a lacuna não fechou → a leitura declara o fuso que usou, na
própria resposta, e a resposta é comparável só com outra do mesmo fuso. Nunca se soma dia de fuso
diferente sem declarar, e nunca se apresenta o resultado como se o fuso não importasse.

### RN-NUC-043 — A recusa é fato, com motivo **enumerado**; recusa não registrada torna invisível o que nunca foi usado

**Enunciado** toda operação **recusada** produz fato, no instante da recusa, com: a operação
pretendida, o módulo dono, o ator, o instante (`RN-NUC-042`), o **domínio de conexão** quando ele é
parte da causa (`D1`/`D2`/`D3`, `RN-OFF-001`) e o **motivo, de lista fechada**
(`fatos-de-operacao-dominios-fechados.md` §1.1). O motivo é
**código enumerado**, nunca texto livre: o texto que o operador vê é mensagem de operação
(`RN-OFF-005`, `RN-NUC-036`) e **não** é campo de decisão. Motivo que não está na lista é registrado
como **não classificado**, e não classificado é **defeito nosso** visível, não categoria de repouso.

**Motivo** "qual módulo não está sendo usado" é **invisível** se só o sucesso é registrado: ausência
de uso não deixa rastro nenhum, e a única coisa que deixa rastro é a **tentativa recusada**. Mais: as
três recusas que mais se parecem para quem opera são coisas **diferentes** para quem conserta —
recusa por falta de contato é diagnóstico de **infraestrutura**; por autoridade é diagnóstico de
**configuração de papel**; por falta de classificação é **defeito de spec nosso** (`RN-OFF-008`). Sem
motivo enumerado, as três chegam como "não deu", que é o mesmo que não chegar. E o motivo só agrega
se for enumerado **na mesma passada** em que o campo nasce: enumeração aplicada depois, sobre texto
livre, não estreita nada (é o padrão de
`convention-campo-de-texto-livre-nao-e-campo-enumeravel`).

**Aceite** com o módulo `MSA` **desligado**, tentar fechar consumo → existe fato de recusa com motivo
`module_inactive`; ao fim do mês a pergunta "que capacidade foi tentada e não existia neste cliente" é
respondível **sem** nenhuma coleta nova. Em `D2`, transferir consumo → fato com motivo `no_contact` e
domínio `D2`. Papel sem célula para a operação → fato com motivo `authority_absent`, e a mensagem ao
operador **não** revela o que existe do outro lado (`RN-NUC-036`). Operação ausente da tabela de
classificação → fato com motivo `unclassified_operation`, que aparece como **trabalho nosso**.

**Infeliz** a mesma recusa repete em rajada (operador insistindo, terminal em `D2` tentando de novo) →
o fato é registrado **por tentativa**, e a compressão de rajada, se existir, é decisão de modelo do
passo 4 sobre **grão**, com o custo medido (`RN-NUC-041`, freio (a)) — nunca supressão silenciosa da
segunda tentativa em diante, que é justamente onde mora o sintoma de "o caixa 3 não consegue".

### RN-NUC-044 — Fato sem decisão nomeada e sem consumidor declarado não entra

**Enunciado** nenhum fato desta família existe sem os campos 4 e 5 da §1 preenchidos: a **decisão
concreta** que alguém toma com ele, e **quem** a toma — o **cliente** (por papel existente), o
**provedor** (por papel de `RN-PRV-003`), ou os dois, dito qual para cada. Os dois campos **não
admitem lacuna**. Fato proposto sem eles vai para os recusados (§6), com o motivo escrito.

**Cláusula acrescentada em 2026-08-23 (`PRV-12`) — o título se lê na disjunção.** O campo 4 é **por
consumidor**: cada consumidor declarado no campo 5 tem decisão própria nomeada **na mesma linha**, e
consumidor declarado **sem** decisão dele é o mesmo defeito que decisão sem consumidor. O título desta
regra, escrito na conjunção, deixava passar o caso mais barato de errar — `P` marcado com decisão só do
cliente, que é autorização aparente para leitura nossa que ninguém decidiu. O `P` declara também o
**canal** (`RN-PRV-009` ou `RN-PRV-010`), e `P` sem os dois é **retirado**.

**Motivo** é `RN-REL-001` aplicada uma camada abaixo, e aqui ela vale mais: relatório órfão custa uma
tela, **fato** órfão custa volume no caminho crítico do caixa, custa retenção, custa auditoria de
dado pessoal e custa a confiança de quem lê. Este arquivo nasceu da instrução de fazer uma base
**rica**; rica e inchada se distinguem por exatamente um critério, e é este. E exigir o **consumidor**
junto com a decisão é o que impede o caso mais fácil de errar: fato coletado para **nós** sem que o
cliente saiba que ele existe — que é a fronteira de `RN-PRV-009`, não uma escolha de modelagem.

**Aceite** para cada fato das §3 a §5, a frase "com este fato, o `<papel>` decide `<ação>`" existe e é
uma ação verificável. Dois exemplos que a regra **corta**, e estão na §6: composição do dinheiro
contado por espécie (nenhuma decisão nomeada) e localização do terminal (nenhuma decisão nomeada, e
dado de pessoa por proximidade).

**Aceite da cláusula** varrer as tabelas da cláusula (b) de `RN-PRV-009` por linha com `P` e sem decisão
nossa nomeada na mesma linha → **zero**; e por linha com `P` sem canal → **zero**.

**Infeliz** a decisão existe e nenhum papel a toma hoje → o fato **não entra** e a pergunta vira
`PERGUNTAS: para humano`. Nunca se cria papel para dar dono a um fato (`RN-NUC-017`), e nunca se
atribui a decisão ao papel mais alto "porque ele pode tudo".

### RN-NUC-045 — Duração é derivada de marcos nomeados; o que não é derivável é medida de operação, não fato de negócio

**Enunciado** nenhuma duração é registrada como campo próprio: registram-se os **marcos** (§5), e
toda duração é derivada deles. O que **não** é derivável de marco — latência percebida dentro do
terminal, como "leitura de código → item na tela" — **não é fato de negócio**: é **medida de
operação**, entra pelo veículo de `RN-PRV-009` (declarada item por item, com o papel nosso que a lê e
por que não é fato do cliente) e é **grandeza com unidade e sem valor**, no regime de `RN-OFF-029`.

**Motivo** duração gravada é dado que mente quando a definição muda: "tempo do atendimento" medido do
primeiro item num release e do pedido aberto no seguinte produz série incomparável, e ninguém
descobre. Marco é factual e a definição vive na leitura, que se corrige sem migration. E a separação
importa porque os dois têm **leitores diferentes**: a duração do atendimento informa decisão do
**cliente** (escala de gente, horário de funcionamento — `RN-REL-012`); a latência percebida informa
decisão **nossa** (é o único jeito de saber se o caminho crítico degradou no cliente real, contra os
orçamentos de `.claude/rules/performance.md` §3, que existem para ser comparados com medida e não com
opinião).

**Aceite** "quanto tempo do pedido aberto à venda concluída" é respondível sem nenhum campo de
duração, a partir dos marcos, com o fuso declarado (`RN-NUC-042`). E a latência percebida do caminho
crítico aparece como grandeza nomeada, **sem valor** nesta spec, com dono `performance`.

**Infeliz** a medida de operação começa a responder pergunta de negócio (contagem de operação por
hora, por estabelecimento, **é** a curva de vendas escrita em outra unidade) → ela deixou de ser
medida de operação e cai no veículo de leitura de `operacao-do-provedor-alcance.md` §2. O **critério**
da fronteira é `LACUNA-PRV-002`, e ele não é escrito aqui.

### RN-NUC-046 — mudou de arquivo em 2026-08-23, e ganhou uma cláusula

A ordem de sacrifício do recurso local do terminal mora em **`fatos-de-operacao-retencao-e-descarte.md`**
§1, quarto irmão, junto de `RN-NUC-049` (retenção × janela de leitura). Este arquivo fechou em **399**
linhas, e o eixo do irmão é real: **o fato depois do instante** — as duas regras falham do mesmo modo, a
perda chegando ao leitor com a cara de ausência, uma em escala de horas e a outra em escala de meses. Foi
movida **verbatim**, nada renumerado, e a cláusula nova é a de `CST-02`: os quatro fatos de **ciclo de
vida do pedido** cedem junto com recusa e conectividade, com o descarte contado.

---

## 3. Os fatos do caminho de venda

Instante: sempre o do terminal (`RN-OFF-019`); **de quem é a hora** para dia e faixa do dia:
`LACUNA-GLO-001`, e por isso a coluna diz o sujeito de fuso quando ele decide a leitura. Ator, em
todos: operador autenticado + papel que sustentou o ato + terminal + estabelecimento (+ sessão de
caixa quando aberta). "Consome": **C** = cliente, **P** = provedor.

| Fato | Instante | Decisão que informa (e de quem) | Consome | Grão candidato |
|---|---|---|---|---|
| `order_opened` — pedido aberto · **PROVISÓRIA** (`LACUNA-NUC-038`) | ao nascer o pedido no terminal | **C** (`manager`/`owner`): quantos atendimentos começam e não fecham, e em que faixa do dia — entra na decisão de escala de `RN-REL-012` | C | uma linha por pedido, com terminal, papel e modo de atendimento; **nunca** contador por faixa |
| `order_item_added` — item lançado | ao lançar a linha | **C** (`owner`): que item sai junto com que item, e o que sustenta o resultado (`RN-REL-010`) | C | uma linha por lançamento, com item, quantidade na unidade dele, preço aplicado e versões (`RN-NUC-002` já as grava); linha retirada depois **continua existindo** |
| `order_item_removed` — item retirado antes de concluir · **PROVISÓRIA** (`LACUNA-NUC-038`) | ao retirar | **C**: item que entra e sai em massa é erro de operação, indecisão do cliente-final ou falta — três ações diferentes. **P**: o **mesmo** item retirado em massa em N clientes é defeito de superfície **nosso**, não do negócio dele | C · P | uma linha por retirada, com o motivo **quando** ele é enumerável (recusa → irmão dos domínios fechados); nunca só um contador de anulações |
| `order_abandoned` — pedido morto sem virar venda · **PROVISÓRIA** (`LACUNA-NUC-038`) | ao morrer o pedido | **C**: desistência por faixa do dia e por terminal, e **em que passo** ela acontece | C | uma linha por pedido morto, **com as linhas que ele tinha** e o valor composto no instante da morte — é o "quase vendido", e é o que um contador destrói. Custo: `PERGUNTAS: para performance` |
| `sale_concluded` — venda concluída (`RN-NUC-003`) | conclusão | **C**: o que comprar/produzir (`RN-REL-009`), o que reposicionar ou retirar do catálogo (`RN-REL-010`). **P** (`provider_administrator`): conferir cobrança contestada e diagnosticar defeito relatado — **sob `RN-PRV-010`**, por ocorrência, com motivo enumerado (`RN-PRV-011` §2.1) | C · P | **por item de venda**, nunca só o total; com as versões de artefato congeladas e a referência humana |
| `payment_registered` — pagamento (`RN-NUC-004`, `RN-NUC-005`) | registro do pagamento | **C**: mix de meio por faixa do dia decide necessidade de troco e sangria, e sustenta negociação de taxa. **P** (`provider_administrator`): conferir cobrança contestada e diagnosticar defeito relatado, na informação bruta — **sob `RN-PRV-010`**, por ocorrência, com motivo enumerado (`RN-PRV-011` §2.1) | C · P | uma linha **por pagamento** (dividido = várias), com meio, valor e resultado; nunca total por meio por dia |
| `discount_applied` — desconto ou acréscimo aplicado (`RN-NUC-006`) | aplicação | **C** (`owner`): o limite publicado está no lugar certo (`RN-REL-011`) | C | uma linha por aplicação, com o limite vigente e a versão do artefato que o publicou |
| `sale_cancelled` · `return_registered` — correção por fato novo (`RN-NUC-008`) | registro da correção | **C**: recorrência é do caso ou do procedimento (mesma lógica de `RN-REL-013`) | C | fato novo referenciando o original, **por item** na devolução; jamais edição do fato anterior |
| `register_session_opened` · `register_session_closed` · `cash_movement` · `cash_difference` | cada ato | **C** (`manager`/`owner`): a diferença é do caso ou do procedimento (`RN-REL-013`) | C | uma linha por movimento; sessão com esperado e contado. A **composição por espécie** não entra — §6 |
| `fiscal_document_outcome` — desfecho do documento (autorizado, rejeitado, denegado, contingência) | retorno ou entrada em contingência | **C**: a pendência é do dia ou é estrutural (`RN-REL-014`). **P**: rejeição em massa por UF ou por tipo é **defeito nosso** ou mudança de layout — decide correção nossa, não conversa com o cliente | C · P | fato do módulo dono (`RN-EMI-028` e irmãs); entra nesta lista pelo **grão e pelo leitor**, e nada aqui o redefine |
| `peripheral_attempt_outcome` — desfecho da tentativa de periférico (`RN-PER-004`) | fim da tentativa | **C**: qual posto tem impressora que falha. **P**: classe que falha em N clientes decide compatibilidade e correção nossa | C · P | uma linha por tentativa, com classe, destino e desfecho |
| `terminal_connectivity_state_change` — entrada e saída de `D1`/`D2`/`D3` | transição | **C**: é o link, a LAN ou o serviço externo — decide trocar provedor de internet, não reclamar do PDV. **P**: quantos terminais operam sem contato, e por quanto tempo, decide onde o orçamento offline precisa ser medido de verdade | C · P | uma linha por transição, com o domínio de entrada; **nunca** amostragem periódica de estado |

**O canal do lado `P`, e as três linhas corrigidas em 2026-08-23 (`PRV-12`).** Esta tabela **é** a lista
de `RN-PRV-009` (cláusula b daquela regra), então cada `P` diz também o canal. `sale_concluded` e
`payment_registered` são **leitura de dado de negócio**: canal `RN-PRV-010`, por ocorrência e com motivo
enumerado — **nunca** observação corrente nem painel. As demais linhas com `P` são **observação de
operação**: canal `RN-PRV-009`. **Perderam o `P`:** `order_item_added` — o grão *por item de venda* de
`sale_concluded` já entrega o dado bruto que a decisão do humano de 2026-08-23 nomeou, e lançamento em
pedido **em construção** não é venda; e `order_abandoned` — pedido morto não é venda, a forma grossa
destrói justamente o que a decisão do **cliente** precisa, e nenhuma decisão nossa foi nomeada para ele.
Nada saiu do lado `C` nas duas, e a leitura do cliente é a mesma antes e depois.

**O que esta tabela responde e o pedido do humano não enumerava:** *volume de operações* e *módulo
mais usado* são leitura sobre `RN-NUC-041` (todo fato declara operação e módulo dono) — não são fatos
novos. *Módulo **não** usado* precisa de duas coisas juntas: a **recusa** (§4, irmão) e o **fato de ativação**
com data (irmão, §3) — "módulo ativo desde tal dia, zero fato de operação até hoje" é a única forma
honesta da resposta, porque ausência sozinha não distingue "não usa" de "nunca foi ligado".

---

## 4. O fato de recusa e os três domínios fechados — mudaram de arquivo

**Em 2026-08-23**, com este arquivo no teto de 400 linhas, o fato `operation_refused` e a lista fechada
de motivos dele saíram daqui para **`fatos-de-operacao-dominios-fechados.md`**, onde nasceram junto as
outras duas listas fechadas que faltavam: o **motivo do cancelamento** (`RN-NUC-047`) e o **modo de
atendimento** (`RN-NUC-048`). Nada foi renumerado, nenhum motivo foi acrescentado, removido ou
reescrito na mudança, e `RN-NUC-043` continua sendo a regra dona da recusa — aqui, na §2. Eixo do irmão:
**o domínio fechado de valor que um fato carrega**, que é a espécie de decisão que só vale se nascer com
o campo.

---

## 5. Os marcos que dão tempo, e as grandezas sem valor

Duração não é campo (`RN-NUC-045`). Os marcos, todos já na §3: `order_opened` → primeiro
`order_item_added` → último `order_item_added` → `sale_concluded` → `payment_registered` →
`peripheral_attempt_outcome` (a via na mão do cliente-final) → confirmação do servidor, quando ela
chega. Deles derivam, com o fuso declarado:

| Grandeza (unidade, **sem valor**) | Decisão que informa | Dono do número |
|---|---|---|
| Duração do atendimento: pedido aberto → venda concluída (tempo) | **C**: escala de gente por faixa e horário de funcionamento (`RN-REL-012`) | — (derivada, não configurada) |
| Intervalo entre lançamentos consecutivos (tempo) | **C**: onde o atendimento trava — catálogo, treinamento ou fila | — |
| Venda concluída → desfecho do documento (tempo) | **C**: pendência do dia × estrutural (`RN-REL-014`) | — |
| Venda concluída → confirmação do servidor (tempo) | **C** e **P**: quanto tempo o dinheiro fica só no terminal | — |
| Permanência em `D1`/`D2`/`D3` por terminal (tempo) | **C**: infraestrutura. **P**: onde medir o orçamento offline | — |
| Latência percebida do caminho crítico: leitura de código → item na tela (tempo) | **P**: o caminho crítico degradou no cliente real, contra os orçamentos de `.claude/rules/performance.md` §3 | `performance` — e é **medida de operação** (`RN-PRV-009`), não fato de negócio |

Nenhuma linha desta tabela tem número, e nenhuma vira constante do produto (`RN-OFF-028`). As três linhas
com `P` são **observação de operação**, canal `RN-PRV-009` (`RN-NUC-044`, cláusula de 2026-08-23), e a
última já o declarava.

---

## 6. O que **não** se registra — e cada recusa com as quatro partes

1. **Número completo de cartão, código de segurança e trilha.** Não persistem em lugar nenhum, para
   ninguém, inclusive para nós (`.claude/rules/seguranca.md` §3, `RN-NUC-024`,
   `operacao-do-provedor-alcance.md` §2.2). Não é escolha nossa e não tem exceção de utilidade.
2. **Conteúdo de texto de terceiro como campo de decisão.** O texto é preservado literal e opaco
   (`RN-OFF-027`); o que entra em fato, contagem ou leitura é **presença**, nunca conteúdo.
3. **Identificação do comprador que a entrega escolhida não exigiu** (`RN-EMI-017`).
4. **Gravação de tela ou de tecla do operador.** *Necessidade legítima:* saber **onde o operador
   trava** — ela é real e continua atendida. *Mecanismo recusado:* gravar a sessão dele, porque é
   vigilância de pessoa identificada, cai na minimização e em `RN-REL-008`, e produz um acervo que
   ninguém consegue auditar campo a campo. *Mecanismo nosso:* os marcos por operação (§5) mais o fato
   de recusa enumerado (§4, irmão). *Por que é melhor, e como se prova:* responde a mesma pergunta — "onde
   trava" — por **operação**, sem nomear pessoa na leitura, e é conferível item por item; prova-se
   pedindo as duas respostas para o mesmo incidente e verificando que a segunda basta.
5. **Composição do dinheiro contado por espécie no fechamento.** Nenhuma decisão nomeada hoje (`RN-NUC-044`).
   Se aparecer uma, entra — pela regra, não por simetria de modelo.
6. **Localização do terminal.** Nenhuma decisão nomeada, e é dado de pessoa por proximidade. Terminal
   é vinculado a estabelecimento (`sales_enabled_terminal`), e é isso que as decisões desta spec usam.

---

## 7. Lacunas e perguntas — dos três arquivos

Abertas em 2026-08-23. Nenhuma bloqueia as regras: cada uma foi escrita para sobreviver às duas
respostas.

- **`LACUNA-NUC-038`** — **a maior desta ficha.** Hoje, por regra aprovada, "iniciou a venda e não
  terminou" **não existe no servidor**: `RN-NUC-001` mantém o pedido em construção local e fora da
  fila, e `RN-NUC-003` (infeliz c) diz, com estas palavras, que o pedido morto **não sobe** — "nada
  sobe". O que o humano pediu ("iniciou a venda, colocou o produto, finalizou a venda", e o tempo até
  concluir) exige exatamente esses fatos, e eles são **irrecuperáveis**: não registrados no instante,
  não se reconstituem nunca. **O mecanismo que preserva as duas coisas** e que eu proponho sem
  decidir: o que sincroniza **não é o pedido** — é um fato aditivo próprio (classe 1, `RN-OFF-004`),
  append-only, que nunca carrega estado mutável nem torna o pedido compartilhado entre terminais.
  `RN-NUC-001` fica intacta; o que muda é o "nada sobe" de `RN-NUC-003`. Isso é **revogação de
  cláusula vigente**, e revogação exige **ato datado do humano**, no arquivo dono, com custo escrito —
  nunca efeito colateral de uma lista de fatos. **Dono:** humano. Enquanto estiver aberta, os quatro
  fatos marcados `PROVISÓRIA` na §3 não são agendáveis.
- **`LACUNA-NUC-039`** — teto de fato de diagnóstico retido no terminal, e o que se conta ao
  atingi-lo (`RN-NUC-046`). Grandeza, unidade tamanho/contagem, **sem valor**. **Dono:**
  `performance` mede, humano escolhe (regime de `RN-OFF-028`).
- **`LACUNA-NUC-040`** — **retenção por classe de fato**: quanto tempo cada classe desta spec vive.
  Fato fiscal e financeiro é append-only e tem prazo legal próprio (`EMI`); fato de recusa e de
  conectividade não têm prazo nenhum declarado. Número, e não é meu. **Dono:** proposta do
  `arquiteto-dados` no passo 4, decisão do humano; para o que sobrevive depois de o cliente sair, é
  `LACUNA-PRV-006`. **Desde 2026-08-23 (`CST-05`) ela não fecha sozinha:** `RN-NUC-049` obriga fechá-la na
  mesma passada que `LACUNA-REL-001` (teto de janela de leitura), porque são o mesmo número por dois
  lados.
- **De quem é a hora:** não abro lacuna nova — é `LACUNA-GLO-001`, e ela passa a ser **carga desta
  família inteira** (`RN-NUC-042`). **Dono:** humano; resolvê-la mexe em `.claude/rules/dados.md`.
- **`LACUNA-PRV-008`** — o cliente vê **os mesmos** fatos que nós vemos sobre ele, ou um
  **subconjunto**? `RN-PRV-006` garante que ele vê **os nossos atos e as nossas leituras**; nada diz
  se ele alcança as leituras **derivadas** que fazemos da operação dele, nem a nossa classificação de
  "defeito nosso" (§3, `unclassified_operation`). **Dono:** humano, e a resposta muda a superfície do
  passo 7.
- **`LACUNA-PRV-009`** — a tentativa **nossa** recusada (papel nosso pedindo o que o eixo dele não
  alcança, `RN-PRV-004`) é legível **pelo cliente**? Não é ato nem leitura no ambiente dele, mas é
  tentativa **sobre** ele. **Dono:** humano, com `seguranca`.

**PERGUNTAS que esta spec não pode responder sozinha:**

1. **para humano — qual decisão "pico de horário" informa, do nosso lado?** Pela disciplina de
   `RN-NUC-044`, sem decisão nomeada o fato não entra. Do lado do **cliente** a decisão existe e é
   `RN-REL-012`. Do **nosso** lado, a única que eu consigo nomear é **janela de manutenção e de
   migration por cliente** — e ela está travada em duas frentes: `LACUNA-GLO-001` (não existe "fora do
   horário" global em multi-tenant multi-fuso) e `LACUNA-PRV-002` (contagem de operação por hora, por
   estabelecimento, **é** a curva de vendas do cliente em outra unidade). Confirme a decisão, ou o
   fato de pico **não entra como fato nosso** e continua sendo leitura derivada do cliente.
2. **para `performance`** (passo 5, em paralelo) — custo em forma, por fato, dos quatro de maior
   volume: `order_item_added`, `order_item_removed`, `operation_refused` e
   `terminal_connectivity_state_change`; e se o orçamento do caminho crítico
   (`.claude/rules/performance.md` §3) sobrevive a **um fato por lançamento** no terminal modesto.
   Custo medido é o único freio legítimo ao grão fino além da minimização (`RN-NUC-041`).
3. **para `arquiteto-dados`** (passo 4) — veredito de grão por fato, e onde mora o agregado que soma
   clientes (`D-06`). Esta spec **propõe** grão; ela não fecha nenhum.
4. **para humano** — `RN-REL-008` (recorte por pessoa) continua aberta e agora tem mais fatos por
   trás: `order_abandoned`, `order_item_removed` e `operation_refused` carregam autor **porque a
   trilha exige**, e a leitura por pessoa é decisão dele, não consequência do registro.

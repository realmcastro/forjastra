# Módulo `REL` — a semente de perguntas, e o que foi recusado

Irmão de `modulos/relatorios.md`, **um conjunto normativo**, partido no eixo **o que governa qualquer
relatório × quais perguntas a semente tem, e o que foi recusado**. O cabeçalho normativo, a fronteira e
as oito regras gerais (`RN-REL-001` a `RN-REL-008`) estão lá e **valem aqui sem repetição**. Este
arquivo tem as seis perguntas (`RN-REL-009` a `RN-REL-014`), os papéis sem relatório, os **recusados** e
as **lacunas dos dois**. Numeração contínua e imutável entre os dois. Heading `### RN-REL-nnn`, mesmo
contrato de busca.

**Nada aqui é gráfico.** Cada item é uma **pergunta** com a decisão que ela informa. Forma, eixo, tipo
e cor são design, Fase 3, e um item que só se descrevesse como gráfico não estaria aqui.

---

## 1. A semente — seis perguntas

Deliberadamente pequena: seis perguntas com os oito campos de `RN-REL-001` preenchidos valem mais que
vinte com dois. Cada uma é uma `RN` porque cada uma tem critério de aceite próprio. Ordem não é
prioridade — prioridade é do humano.

**O campo `QUEM` das seis é candidato, não concessão** (`RN-NUC-039`, acrescentado em 2026-08-23).
Nenhuma das seis tem linha nas matrizes de operação × papel: ler relatório de `REL` é operação que
ainda não existe lá, logo é **negada a todos** (`RN-NUC-026`), e a pergunta está marcada como
`LACUNA-NUC-037` (`matriz-operacao-papel-modulos.md` §9). O papel citado em cada `QUEM` diz **de quem é
a decisão** — que é o campo (2) de `RN-REL-001` e a razão de o relatório existir —, e é a entrada para
quem for escrever a célula; ele não autoriza leitura por prosa, aqui nem no irmão.

### RN-REL-009 — Quanto comprar (ou produzir) de cada item para o próximo ciclo

**DECISÃO** definir a quantidade de compra ou de produção de cada item para o próximo ciclo de
reposição. **QUEM** `owner` (escopo cliente); alcançável por `manager` no recorte **do
estabelecimento dele** quando a compra é dele por delegação nomeada (`RN-NUC-021`), nunca por default.
**GRÃO** item × ciclo, ordenado por quantidade vendida, **paginado**, com recorte máximo declarado
(`LACUNA-REL-001`) — nunca "todos os itens". **JANELA** ciclos de reposição **fechados** anteriores,
comparáveis entre si; quantos, é escolha do cliente com teto (`LACUNA-REL-001`).
**FRESCURA** dias: a decisão é periódica e o último período fechado basta. Nunca exige o dia em curso.
**ESCOPO** estabelecimento, e cliente quando a compra é centralizada.
**FONTES** núcleo: venda concluída e itens dela, como fato imutável · `EST`: disponibilidade por item
e evento de movimento · `FTC`: composição e custo, para converter item preparado em insumo ·
`FRN`: compra e custo de entrada, para prazo e embalagem de compra. Sempre pelo que cada um **expõe**.
**DESLIGADO** sem `EST`, a série de saldo e de cobertura **não existe** — o relatório responde
"quanto saiu" e declara que "quanto ainda tem" não é medido neste cliente; nunca exibe saldo zero.
Sem `FTC`, item preparado conta como item vendido e o insumo dele não aparece — declarado, não zerado.
Sem `FRN`, não há custo de entrada nem prazo de fornecedor: a decisão de quantidade continua, a de
"quando pedir" não é informada.

**Motivo** é decisão que se repete a cada ciclo em cada um dos três negócios do teste — posto, padaria
e loja de roupa todos compram ou produzem por ciclo —, e o produto já guarda o fato que a informa
(venda concluída e itens), então não informá-la é desperdiçar dado que já existe. **Não afirmo** como
ela é tomada hoje em cada negócio: isso é observação de campo, não minha. **Aceite** com dois ciclos
fechados, o relatório lista os itens de maior saída
com a quantidade por ciclo, paginado; com `EST` ligado, acrescenta cobertura; com `EST` desligado, diz
que cobertura não existe neste cliente. **Infeliz** a janela contém período em que o item não estava
publicado (`RN-NUC-013`) → o período aparece como "item não publicado", não como venda zero.

### RN-REL-010 — Que itens sustentam o resultado, e quais eu reposiciono ou retiro do catálogo

**DECISÃO** manter, repreçar ou retirar item do catálogo publicado (`RN-NUC-014`).
**QUEM** `owner` — é ele quem publica catálogo, preço e limite.
**GRÃO** item × período, com eixo de agrupamento quando o catálogo o tiver, **paginado** e com recorte
máximo (`LACUNA-REL-001`). **JANELA** múltiplos ciclos fechados — mais longa que a de `RN-REL-009`,
porque a decisão é estrutural e sazonalidade curta a distorce. **FRESCURA** dias a semanas.
**ESCOPO** cliente (o catálogo publicado é escopo cliente), com recorte por estabelecimento.
**FONTES** núcleo: item vendido, com a **versão publicada congelada no fato** (`RN-NUC-013`), que é o
que torna a comparação histórica honesta · `EST`/`FTC`: custo, para margem · `PRM`: promoção aplicável,
para separar o que vendeu por preço do que vendeu por promoção.
**DESLIGADO** sem `EST`/`FTC`/`FRN` não existe custo, logo **não existe margem**: a série é declarada
inexistente e o relatório responde só por receita e quantidade. **Nunca** calcula margem com custo
zero — margem com custo ausente parece lucro total e é o pior número que este módulo poderia emitir.
Sem `PRM`, todo desconto é discricionário e o relatório diz isso, em vez de mostrar promoção zerada.

**Motivo** retirar item do catálogo é decisão barata de tomar e caríssima de errar: some do catálogo o
item de giro baixo e margem alta, ou o que sustenta a visita. **Aceite** o relatório distingue receita,
quantidade e — quando há custo — margem, por item, na janela; com custo indisponível, a coluna de
margem é **declarada inexistente**, não vazia. **Infeliz** o item mudou de preço no meio da janela →
cada período usa a versão vigente naquele instante, e a mudança é visível; nunca se recalcula o passado
com o preço de hoje (`RN-REL-007`).

### RN-REL-011 — O limite de desconto que eu publiquei está no lugar certo

**DECISÃO** alterar ou manter o limite de desconto e acréscimo publicado, e a quem se delega a
exceção. **QUEM** `owner` (publica o limite); o recorte do estabelecimento informa o `manager` que
autoriza, mas a decisão sobre o limite não é dele.
**GRÃO** estabelecimento × período × faixa de excedência, **paginado**; **sem recorte por pessoa**
(`RN-REL-008`). **JANELA** ciclos fechados. **FRESCURA** dias.
**ESCOPO** cliente, com recorte por estabelecimento.
**FONTES** núcleo: aplicação dentro do limite como aplicação (`RN-NUC-006`) e autorização acima do
limite como autoridade nova (`RN-NUC-007`), as duas como fatos distintos · `PRM`: promoção aplicável,
para separar desconto discricionário de promoção condicional.
**DESLIGADO** sem `PRM`, a série "desconto por promoção" **não existe** e todo desconto é
discricionário — declarado, nunca promoção igual a zero.

**Motivo** exceção que acontece toda hora não é exceção: é o limite no lugar errado, e cada
autorização custa uma interrupção do gerente e um atraso no caixa. Este relatório transforma um
incômodo diário em decisão de publicação. **Aceite** o relatório mostra, por estabelecimento e
período, quanto do valor saiu dentro do limite e quanto exigiu autorização, por faixa de excedência; a
frase "o limite atual é excedido de forma recorrente na faixa X" é derivável dele sem nomear ninguém.
**Infeliz** o limite foi republicado no meio da janela → a janela é partida por versão de limite
(`RN-NUC-013`), nunca somada sob o limite atual.

### RN-REL-012 — Quanta gente escalar em cada faixa do dia, e se muda o horário de funcionamento

**DECISÃO** dimensionar a escala por faixa de horário e por dia da semana; e decidir horário de
abertura e fechamento. **QUEM** `manager` para a escala (escopo estabelecimento); `owner` para o
horário (escopo cliente).
**GRÃO** faixa de hora × dia da semana × estabelecimento — **o único da semente com limite natural
fechado**: o dia tem faixas fixas e a semana tem sete dias, então não é paginação, é domínio finito.
**JANELA** semanas fechadas comparáveis. **FRESCURA** dias — é decisão de escala, não de agora.
**ESCOPO** estabelecimento.
**FONTES** núcleo: instante do fato da venda concluída, no **fuso do cliente** · `MSA`: consumo em
aberto de um lugar, para ocupação · `CMP`: estado de cumprimento e fila do estabelecimento, para pico
de retirada · `ENT`: estado da entrega, para pico de saída.
**DESLIGADO** sem `MSA`, ocupação de lugar **não existe** neste cliente (não é ocupação zero); sem
`CMP`/`ENT`, o pico de retirada e de entrega não existe, e o relatório responde só pelo ritmo de venda
concluída.
**DEPENDÊNCIA DURA** o corte do dia e da faixa depende do **fuso do cliente**, que é
`LACUNA-NUC-001`, **aberta**. Este relatório não é construível antes dela — e essa é a razão de a
dependência estar escrita aqui e não descoberta na implementação.

**Motivo** o erro custa nas duas direções e as duas são dinheiro: gente parada, ou fila que perde
venda. O produto sabe o instante de cada venda concluída, então o ritmo é derivável sem nenhum registro
novo — e derivá-lo errado (fuso, faixa) é pior que não derivar. **Aceite** com semanas fechadas, o relatório mostra o
ritmo de venda concluída por faixa e por dia da semana, no fuso do cliente; o mesmo relatório em dois
estabelecimentos do mesmo cliente não mistura os dois. **Infeliz** a janela contém dia de fechamento
excepcional ou período sem operação → o período aparece como "sem operação", nunca como faixa de
movimento zero, porque zero aqui seria lido como demanda inexistente.

### RN-REL-013 — A diferença de caixa é do caso ou do procedimento

**DECISÃO** mudar procedimento do posto de caixa — valor do fundo, frequência de sangria, forma de
conferência — ou tratar um caso individual pela trilha.
**QUEM** `manager` (responde pelo dinheiro do estabelecimento).
**GRÃO** sessão de caixa × posto de caixa, **paginado**; **sem recorte por operador**
(`RN-REL-008`, e é a aplicação mais delicada dela). **JANELA** sessões **fechadas** de um período.
**FRESCURA** horas a dias — e explicitamente **não** é o fechamento em si, que é operação e é imediato
(`RN-NUC-010`). **ESCOPO** estabelecimento.
**FONTES** núcleo, e só núcleo: abertura com fundo (`RN-NUC-009`), fechamento com a conferência que o
terminal conseguiu fazer **e a pendência nomeada** (`RN-NUC-010`), sangria e suprimento
(`RN-NUC-011`), abertura de gaveta fora de venda (`RN-NUC-012`b).
**DESLIGADO** a fonte é o núcleo, que nunca desliga — mas sessão fechada **offline** com conferência
pendente entra como **pendência**, com o motivo, e não como diferença igual a zero. Pendência lida como
zero é a versão deste módulo do erro de `RN-REL-005`, e ela não depende de módulo nenhum estar
desligado.

**Motivo** diferença isolada é acidente; diferença que repete no mesmo posto, no mesmo horário, é
procedimento — e a única forma de distinguir as duas é olhar várias sessões, o que o ato de fechamento
não faz por construção: ele olha **uma** (`RN-NUC-010`). **Aceite** com sessões fechadas no período, o relatório mostra a
diferença por sessão e por posto, separando as sessões com conferência pendente das conferidas; a
soma nunca mistura as duas. **Infeliz** a sessão foi fechada sem conferência possível → aparece como
"não conferida", com o motivo preservado, e fica fora de qualquer total de diferença.

### RN-REL-014 — A pendência fiscal é do dia ou é estrutural

**DECISÃO** acionar mudança estrutural — trocar o meio de comunicação, mudar o procedimento de
contingência, revisar cadastro tributário, envolver o contador — em vez de tratar item por item.
**QUEM** `fiscal_officer` (escopo estabelecimento) — é o papel que responde pelo uso do poder de
assinar em nome do estabelecimento.
**GRÃO** dia × ponto de emissão × **motivo preservado** do autorizador (`RN-EMI-018`, `RN-OFF-012`),
**paginado**. **JANELA** períodos fechados, alinhados ao ciclo que `EMI`/`APU` declara
(`LACUNA-REL-005`) — nenhuma data legal é afirmada aqui. **FRESCURA** dias, e **é isto que o separa da
fila**: a fila de `RN-EMI-028` é ordenada por prazo e o prazo é de **horas**; se a decisão exigir
horas, ela é fila, não relatório, e continua sendo da superfície dona (`RN-REL-003`).
**ESCOPO** estabelecimento — ponto de emissão pertence a um estabelecimento.
**FONTES** `EMI`: estado da obrigação por venda e desfecho de cada documento, com o motivo do
autorizador preservado · `FIS`: regime com vigência, para saber sob que regra o período correu.
Sempre pelo que cada um expõe; nunca o de dentro de `EMI`.
**DESLIGADO** sem `EMI`, o cliente **não emite documento fiscal por este produto**: a série não
existe, e o relatório diz isso — nunca "nenhuma pendência", que se lê como operação impecável quando
significa operação que não passa por aqui. Sem `FIS`, `EMI` não é ativável, e o relatório não existe.

**Motivo** a fila resolve o item e não responde à pergunta que evita a próxima fila. Recorrência de
rejeição pelo mesmo motivo, no mesmo ponto de emissão, é um problema de cadastro ou de infraestrutura,
e ele é invisível item a item. **Aceite** o relatório mostra, por dia e por ponto de emissão, quantos
documentos precisaram de contingência e quantos foram rejeitados, agrupados pelo motivo literal do
autorizador; a mesma informação nunca substitui a fila, e desligar `REL` não afeta a fila.
**Infeliz** o motivo não é reconhecido pela versão do produto → aparece como "motivo não reconhecido",
com o texto preservado, e é agrupado como tal; nunca é somado a um motivo conhecido parecido.

---

## 2. Papéis sem relatório, e é resposta, não omissão

| Papel | Relatório na semente | Por quê |
|---|---|---|
| `cashier` | **nenhum** | ele não toma nenhuma das decisões acima. O que ele precisa saber (o que já lançou, o estado da sessão, se o terminal está sem contato) é **superfície de operação**, com frescura de segundos — passo 5 da T-0003, não `REL`. Dar relatório ao papel-piso seria dar-lhe agregado do estabelecimento sem lhe dar decisão nenhuma. |
| `provider_support` | **nenhum dentro do cliente** | a concessão nomeia operações de diagnóstico, não leitura de agregado de gestão (`RN-NUC-024`), e ela **nunca** alcança contagem que soma clientes (`RN-EMI-040`). O que precisamos saber para operar a plataforma é dado **nosso**, fora do escopo de qualquer cliente, e não é este módulo. |

---

## 3. Recusados

Cada linha nomeia a **necessidade** — ela não se recusa — e recusa o **mecanismo** "isto é um
relatório". Todas continuam podendo entrar depois, com a decisão nomeada e o dono declarado.

| Pedido | Necessidade real | Por que não entra aqui | Para onde vai |
|---|---|---|---|
| **faturamento do dia / painel de vendas ao vivo** | saber que o dia está fora do normal **a tempo de agir hoje** | a necessidade é legítima e a decisão existe ("chamar gente", "mudar algo agora"), mas a frescura é de **minutos**: por `RN-REL-002` isto é superfície de operação, não relatório. Absorvê-lo aqui faria `REL` concorrer com o caixa e faria um cliente sem `REL` perder informação de operação | superfície de operação, passo 5 da T-0003 |
| **ranking de operadores / produtividade por pessoa** | distribuir trabalho e treinar quem precisa | a decisão é sobre pessoas e o dado é a trilha de auditoria; usá-la como indicador de conduta é decisão de vigilância de trabalhador, já sem aceite em `catalogo-de-capacidades.md` | `LACUNA-REL-002`, dono **humano** |
| **curva ABC** | saber onde está concentrada a venda | é **nome de técnica**, não pergunta: a decisão que ela informaria já está em `RN-REL-009` e `RN-REL-010`. Entrar como item próprio duplicaria o mesmo dado sob dois nomes, e catálogo duplicado apodrece | absorvido, sem item próprio |
| **comparativo com o mesmo período do ano anterior** | saber se o negócio melhorou | "melhorou" não é ação. O caso legítimo é **antes e depois de uma mudança declarada** (preço, horário, limite) — e isso exige que a mudança seja um fato nomeado (`RN-NUC-013`, `RN-NUC-014`) | candidato; a decisão precisa ser nomeada pelo humano (`LACUNA-REL-006`) |
| **comparação com o mercado / com negócios parecidos** | saber se o meu resultado é bom em termos absolutos | só existe somando clientes: é dado **nosso** e nenhuma superfície de cliente o alcança (`RN-EMI-040`, `RN-REL-006`). É vazamento por agregado, que sobrevive a schema correto | fora do escopo de cliente; se um dia existir, é decisão do humano e passa por `seguranca` |
| **resultado contábil / demonstrativo de resultado** | saber se o negócio dá lucro | exige fatos que o produto não guarda (despesa fixa, folha, aluguel, tributo apurado) e afirmar a forma seria inventar regra contábil por analogia | `PERGUNTAS: para humano`, com o contador; parte pode ser de `APU` |
| **previsão de venda / projeção de demanda** | comprar e escalar com antecedência | `REL` responde sobre o que **já aconteceu**; projeção precisa de critério de aceite sobre erro aceitável, e projeção errada apresentada com a mesma autoridade do fato é pior que nenhuma | **o aceite foi escrito em 2026-08-23** e ela virou `CAP-REL-001` em `catalogo-de-capacidades.md` §3 — **candidata**, não agendada, e agendá-la altera a fronteira de `modulos/relatorios.md` §1 na mesma passada. Continua **fora** da semente: item de semente é `RN-REL-nnn`, e capacidade candidata não vira `RN` antes de o humano agendá-la |
| **"explicar por que o dia foi diferente do normal"** | entender a causa, não só o número | já recusado em `catalogo-de-capacidades.md` por falta de aceite e de linha de base: correlação apresentada como causa é pior que nenhuma explicação. **Não reabro** | permanece recusado lá |

---

## 4. Lacunas dos dois arquivos

Abertas em 2026-08-22. Nenhuma bloqueia as regras: cada relatório foi escrito para sobreviver às duas
respostas.

- **`LACUNA-REL-001`** — **teto de janela** e **recorte máximo por página** de cada relatório da
  semente. Sem número, o grão de `RN-REL-009` a `014` não é operável, e limite ausente é limite
  infinito. **Dono:** `performance` (passo 7 da T-0003), com o humano para a parte de expectativa de
  uso. Não escrevo número.
- **`LACUNA-REL-002`** — recorte **por pessoa** (operador, autorizador, quem fechou a sessão) entra
  em algum relatório? É a mesma pergunta de vigilância de `catalogo-de-capacidades.md`. **Dono:**
  humano.
- **`LACUNA-REL-003`** — o corte de "dia" e de "faixa do dia" depende do **fuso do cliente**, que é
  `LACUNA-NUC-001` e está **aberta**. `RN-REL-012` depende dela por inteiro; `RN-REL-009` a `011` e
  `013` a `014` dependem dela para o limite do período. **Dono:** humano (já aberta em
  `nucleo-venda.md` §6).
- **`LACUNA-REL-004`** — **meio de pagamento** como eixo de relatório depende do domínio de meios de
  pagamento, que é `LACUNA-NUC-006` e está aberta. Nenhum relatório da semente usa esse eixo por isso;
  a decisão "com que meio negociar taxa" fica sem item até lá. **Dono:** humano.
- **`LACUNA-REL-005`** — a que **ciclo** a janela de `RN-REL-014` se alinha (o ciclo que `EMI`/`APU`
  declara). Não afirmo prazo, data nem periodicidade legal por analogia. **Dono:** humano, com o
  contador; relacionada a `LACUNA-EMI-012`.
- **`LACUNA-REL-006`** — o "antes e depois de uma mudança declarada" (§3) precisa que a mudança seja
  um fato nomeado e consultável (publicação de artefato, `RN-NUC-013`/`014`). Se o humano nomear a
  decisão, o relatório é escrevível; hoje ele não é. **Dono:** humano.
- **`LACUNA-REL-007`** — se `REL` precisa de termo próprio no `glossario.md` (o que é "relatório"
  aqui, e o identificador em inglês). Nada foi cunhado nesta passada: o glossário está no teto de
  tamanho e a passada é própria. **Dono:** `produto`.

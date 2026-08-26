# Conferência contra o board — 2026-08-26

> **O que este arquivo é.** A revisão `revisao-backlog-spr-2026-08-26.md` e as edições de
> `backlog-edicoes-a-aplicar.md` foram escritas **sem acesso ao Jira** — o autor declara isso nos dois
> arquivos (§6, último parágrafo; §4 de "Como aplicar"). Este documento confronta os dois contra o
> **corpo real** das issues, lido em 2026-08-26.
>
> **O que ele achou.** O corpo mudou o veredito em quatro cards, revelou uma decisão de fase tomada por
> default em quatro, e mostrou que **as seis substituições de descrição apagariam critério de aceite
> ainda válido**. Nada disso era visível no título.
>
> **Onde mora o quê.** Aqui ficam os **achados**. O **texto corretivo**, pronto para colar, está em
> `backlog-edicoes-correcoes-2026-08-26.md` — mesma divisão que já existe entre a revisão e as edições.
>
> **Nada aqui foi aplicado no board.** A única escrita no Jira desta passada foi criar `SPR-54`.

## 1. O conjunto é exatamente 53, e o Bloco A já foi aplicado pela metade

`project = SPR ORDER BY key ASC` devolve **53** issues, `SPR-1`..`SPR-53`, sem buraco de chave. A
revisão falava em 52 e dizia não ter verificado; verificado agora, o número é 53 porque `SPR-53` é a
própria revisão. Com `SPR-54` são 54.

**O achado que muda o plano de aplicação:** entre 12:37:02 e 12:43:19 de 2026-08-26 alguém já aplicou
parte do Bloco A. Republicar produz comentário duplicado, e comentário é append-only — duplicata não
se apaga.

### 1.1 Bloco A — entradas de comentário já aplicadas

`SPR-1` · `SPR-2` · `SPR-3` · `SPR-4` · `SPR-5` · `SPR-6` · `SPR-7` · `SPR-8` · `SPR-9` · `SPR-10` ·
`SPR-11` · `SPR-12` · `SPR-14` · `SPR-15` · `SPR-17` · `SPR-21` · `SPR-24`

**Não republicar nenhuma delas.**

### 1.2 Bloco A — a nota de vocabulário foi aplicada a 5 dos 13 cards da lista

Aplicada: `SPR-16`, `SPR-17`, `SPR-18`, `SPR-22`, `SPR-27`.

**Pendente:** `SPR-19`, `SPR-20`, `SPR-23`, `SPR-26`, `SPR-28`, `SPR-31`, `SPR-32`, `SPR-33` — e o
corpo dos oito usa "produto" como entidade, conferido um por um. A entrada vale para os oito.

### 1.3 Bloco A — títulos já aplicados, e a inconsistência que eles criaram

`SPR-17` já é **"Pesquisar item de catálogo"** e `SPR-18` já é **"Escolha obrigatória pendente impede o
lançamento do item de catálogo"**.

Em `SPR-18` isso produziu um defeito ao vivo: **o título afirma a regra condicional e a descrição ainda
afirma o mecanismo recusado** — "Todo produto deve passar por uma etapa de configuração antes de ser
adicionado". Quem abrir o card hoje lê duas regras opostas no mesmo lugar. A descrição de `SPR-18` é a
correção mais urgente do Bloco A.

`SPR-30` tem o mesmo defeito, e a revisão não o viu — §2.4.

### 1.4 Bloco B — três dos oito já estão aplicados e rotulados

`SPR-31`, `SPR-32` e `SPR-33` têm o rótulo `bloqueada` e o comentário de bloqueio, postados às 12:17–12:18.
O texto deles já carrega `G-03`, `G-04`, `G-05`, §3 linhas 2 e 3, e o §5.2 inteiro.

**Nenhuma outra issue do board tem rótulo.** `SPR-16`, `SPR-19`, `SPR-20`, `SPR-26`, `SPR-34`, `SPR-37`
e `SPR-40` estão listadas no Bloco B e continuam sem rótulo e sem comentário de bloqueio — o board as
mostra andando. Some-se `SPR-36`, pelo §2.1.

### 1.5 Duas entradas do Bloco A que ficaram redundantes

- **`SPR-28`** — o comentário de 12:17:26 já carrega `RN-NUC-006`, `RN-NUC-007`, `fronteira-do-nucleo.md:84`
  **e** o parágrafo de `G-09` com `LACUNA-NUC-004` e `roadmap-de-modulos.md:333`. A entrada inteira é
  redundante. O que falta em `SPR-28` é só a nota de vocabulário.
- **`SPR-33`** — o comentário de 12:18:19 já diz, quase palavra por palavra, que a observação não entra
  na chave porque `RN-NUC-016` a declara opaca e nunca chave de decisão, e que isso subiu de armadilha
  para contradição. A entrada de Bloco A de `SPR-33` é redundante.

---

## 2. Vereditos que mudam

### 2.1 `SPR-36` — de `MANTER` para **`BLOQUEAR`**. É o achado mais caro da conferência.

A revisão diz: *"Plataforma; nenhum pressuposto de regra."* O corpo diz outra coisa. Escopo, primeira
linha:

> **Registro de cliente:** identificação, slug que nomeia o schema, **fuso**. O fuso mora aqui porque
> turno, fechamento de caixa e "vendas de hoje" dependem dele, e são caríssimos de corrigir depois.

Isso **decide `LACUNA-GLO-001`**, que pergunta exatamente isto e está aberta com dono humano
(`glossario.md:395`, `roadmap-de-modulos.md:423`): quando um cliente tem estabelecimentos em fusos
diferentes, o fuso que decide vigência, "hoje", turno e fechamento é o do **estabelecimento** ou o do
**cliente**? O card responde "cliente", com justificativa escrita, no escopo, uma coluna na tabela de
registro de cliente.

Três coisas tornam isso pior que uma frase infeliz:

1. **É a fase em que não se desfaz.** Fuso na linha de cliente torna fuso por estabelecimento
   estruturalmente impossível sem expand/contract em N schemas — o custo mais alto do projeto.
2. **A data.** `SPR-36` vence em **2026-09-08**. Nenhuma issue do board pergunta o fuso ao humano:
   `G-01`..`G-09` vivem neste documento, não no Jira. O board chega em 09-08 com a resposta dada por
   omissão.
3. **O registro de memória já avisou.** `memory/plataforma/decision-tenancy-schema-por-cliente.md` diz
   que **o schema isola cliente, não estabelecimento**, e
   `memory/plataforma/gotcha-fuso-do-estabelecimento-versus-fuso-do-cliente.md` descreve o sintoma:
   some com um estabelecimento só e reaparece com dois.

**Veredito novo:** `BLOQUEAR` até `LACUNA-GLO-001` fechar, com rótulo `bloqueada`. O resto do card —
módulos ativos, livro-razão, `checksum`, retomada — não depende dela e não está em discussão.

**Por que a revisão não podia ver:** o título é *"Modelar o schema de controle: clientes, módulos ativos
e livro-razão de migration"*. A palavra "fuso" não aparece nele. É
[[gotcha-capacidade-sem-dono-entra-pelo-titulo-do-card]] pelo avesso — não uma capacidade sem dono
entrando pelo título, mas uma **decisão em aberto entrando pelo corpo, com o título limpo**.

### 2.2 `SPR-8` — de `MANTER` para `AJUSTAR`

Critério de aceite real: *"Cada comanda deve possuir uma **identificação incremental dentro da mesa**.
Exemplo: Mesa 10 → Comanda 1 e Comanda 2."*

É a mesma segunda referência humana sem regra que rendeu `AJUSTAR` e `G-06` a `SPR-6`. A revisão marcou
`SPR-8` como `MANTER` com uma citação a acrescentar, porque leu o título — "Criar múltiplas comandas
para uma mesma mesa" — e não o corpo. A declaração de `G-06` vale aqui igual, e a parte do aceite que
depende do contador por mesa fica atrás dela.

### 2.3 `SPR-9` — de `MANTER` para `AJUSTAR`

Critério de aceite real: *"Deve ser possível identificar **o número da comanda**."* Terceira aparição do
mesmo contador sem regra. `G-06` toca `SPR-6`, `SPR-8` e `SPR-9`, não só `SPR-6`.

Um achado lateral, e bom: `SPR-9` também tem *"Comandas canceladas ou encerradas não devem aparecer como
disponíveis para novos lançamentos"* — que é meia irmã do critério que a substituição de `SPR-13`
apagaria. A necessidade tem duas casas no board; nenhuma das duas pode perdê-la.

### 2.4 `SPR-30` — de `MANTER` para `AJUSTAR` (descrição)

A revisão diz: *"O mecanismo já foi trocado pelo humano e agora casa com `RN-NUC-008` e `RN-MSA-004`.
Nada a acrescentar."* **Só o título foi trocado.** A descrição continua literalmente:

> * O item poderá ser editado após o envio.
> * A edição poderá alterar suas informações permitidas.
> * Não é necessário apresentar histórico detalhado da alteração no MVP.

O comentário de 11:53:17 recusa os dois primeiros com as quatro partes, e recusa o terceiro mostrando
que no mecanismo append-only o histórico **é** o dado. Mas comentário não substitui descrição: o card
está no mesmo estado de `SPR-18` — título corrigido sobre corpo intacto. Quem pegar `SPR-30` em
2026-11-27 vai implementar a descrição.

E a pergunta que aquele comentário deixou em aberto — *"correção de item enviado exige autorização de
papel?"* — **já tem resposta na spec**, e ela está escrita na própria entrada de `SPR-25`: `RN-MSA-004`
mais a célula da matriz (`RN-NUC-039`, `matriz-operacao-papel-contrato.md:213`). A resposta precisa
chegar a `SPR-30`.

### 2.5 `SPR-1` — a entrada já publicada contém uma afirmação falsa

O comentário postado em `SPR-1` às 12:37:27 diz, como resíduo 2:

> **`service_mode` sem `RN`.** `roadmap-de-modulos.md:155` e `:171` o listam como piso do documento
> fiscal, e ele não tem regra numerada.

**Falso.** `glossario.md:396` registra que `LACUNA-GLO-002` foi **FECHADA em 2026-08-23** precisamente
porque o resíduo era `service_mode`, e ele passou a ser regido por **`RN-NUC-048`** — domínio fechado do
núcleo, ausência não é valor, cada fato carrega o modo vigente. A regra existe em
`fatos-de-operacao-dominios-fechados.md:124`.

A revisão copiou `roadmap-de-modulos.md:155` e `:171` sem conferir a substância, e **essas duas linhas do
roadmap é que estão velhas**. É o caso exato de
[[gotcha-endereco-de-relatorio-envelhece-na-propria-sessao]]: o endereço existe, o conteúdo dele mudou.

Duas consequências: `SPR-1` precisa de comentário de retratação (texto na §9 do arquivo de correções), e
`roadmap-de-modulos.md:155`/`:171` precisam de correção in loco em despacho próprio — não neste.

O resíduo **turno** continua correto e verificado: `LACUNA-NUC-007` aberta, humano respondeu "não sei
ainda", turno recusado por default (`roadmap-de-modulos.md:172`, `:387`, `:420`).

### 2.6 `SPR-46` — a caracterização inverte

A revisão diz: *"Sem isso o card fecha escolhendo o fuso por omissão, dentro de um utilitário."* O corpo
mostra que **a escolha já foi feita, e não por omissão**:

> **O fuso é do cliente, e vem de dado.** A interface nunca assume o fuso do dispositivo.

E o critério de aceite a fixa: *"Mesmo instante formatado para **dois clientes de fusos diferentes**,
com o resultado de cada um afirmado no teste."* Um teste que afirma o lado escolhido de uma pergunta
aberta é mais difícil de reverter que uma omissão — ele passa a ser o que prova que o código está certo.

O comentário a postar continua sendo o do Bloco A, mas o enunciado muda de "declarar a dependência" para
"o card já respondeu `LACUNA-GLO-001`". Texto novo na §7 do arquivo de correções.

### 2.7 `SPR-19` — a recusa mira uma versão do card mais forte que a escrita

`§3` linha 2 da revisão diz que `SPR-19` e `SPR-32` *"põem variação por eixos no núcleo"*. `SPR-32` põe.
`SPR-19` **declara o limite**, e declara justamente na direção da fronteira aprovada:

> * Variações serão utilizadas para diferenças simples, como tamanho.
> * Diferenças estruturais relevantes devem ser cadastradas como produtos distintos.

"Cada combinação estrutural é item próprio" é **o comportamento desligado de `GRD` já escrito** — uma
das três saídas que a própria revisão lista em §4 item 2. O card não pede a grade; pede eixo simples com
preço próprio.

A pergunta de fronteira **não some**: "um produto pode possuir múltiplas variações" e "a variação
selecionada deve fazer parte do item da comanda" ainda supõem entidade de variação em algum lugar. Mas
`G-04` estreita: não é "grade de eixos no núcleo × `GRD`", é **"eixo único com preço próprio é núcleo,
ou é o degrau de baixo de `GRD`?"**. Pergunta mais estreita se responde mais rápido, e esta vale a
correção porque o card foi escrito com mais cuidado do que a revisão lhe creditou.

### 2.8 `SPR-7` — sobe de "três correções" para contradição com regra aprovada

A entrada trata vocabulário, tipo de alvo faltando e citação de `RN-MSA-014`. O corpo tem um critério que
nenhuma das três alcança:

> * O cliente deve possuir um **identificador técnico próprio no modelo de dados da comanda**.

Identificador técnico próprio para a pessoa, dentro do modelo de `MSA`, **é** a entidade de pessoa que
`RN-MSA-014` (`modulos/mesa-comanda.md:270`) proíbe: `MSA` guarda o necessário para localizar o consumo
durante o serviço, não constrói histórico por pessoa e não cruza consumos por nome. Nome de exibição é
atributo; pessoa é `CLF`.

Isto pertence a `§3` da revisão, ao lado da linha 8 (`SPR-14`), não a uma lista de ajustes de texto. E é
o mesmo defeito nos dois cards — `SPR-7` o pede, `SPR-14` o modela.

### 2.9 Contagem corrigida

`SPR-8`, `SPR-9`, `SPR-30` e `SPR-36` saem de `MANTER`. As 52 revisadas ficam: **2 `FUNDIR`, 33
`AJUSTAR`, 17 `MANTER`**. `EXCLUIR` continua **zero**, e a conferência não produziu nenhum candidato —
todo corpo lido nomeia necessidade que se sustenta.

---

## 3. As seis substituições de descrição apagam critério de aceite ainda válido

As seis, não algumas. É o item de risco que este passo existia para pegar, e ele deu resultado em todos
os casos que podia dar.

| Card | Critério existente que a substituição apagaria | Gravidade |
|---|---|---|
| `SPR-13` | "comanda encerrada não recebe novos itens" e "não é enviada novamente à cozinha" — **a razão de existir do card**; mais uma inversão de escopo não declarada (o card punha o encerramento financeiro fora, a descrição nova o traz para dentro) | alta |
| `SPR-18` | três critérios que mudam de casa sem declaração (observação, confirmar inclusão, valor atualizado); e a recusa caracteriza mal o mecanismo — o card **já condiciona os campos**, e a recusa o acusa de não condicionar | média |
| `SPR-22` | "o item passa a fazer parte da comanda **imediatamente**" — que num produto que enfileira offline é o que impede lançamento em duplicidade por dúvida | alta |
| `SPR-23` | "itens com qualquer diferença permanecem separados": a descrição nova recusa o mecanismo (texto como chave) e **não repõe a necessidade** — a linha agregada esconde "sem cebola" e "com bacon" | alta |
| `SPR-25` | "não deve ser possível utilizar quantidade inválida", vindo de `SPR-24` pela fusão — o único critério de `SPR-24` que não é retirada nem lançamento aditivo | média |
| `SPR-29` | os quatro critérios de **acumulado vivo**. A descrição nova tem quatro aceites, todos sobre procedência, **nenhum** sobre o total refletir o que acabou de acontecer. A pior das seis | alta |

**Texto corretivo de cada uma:** `backlog-edicoes-correcoes-2026-08-26.md`, §1 a §6. Ele entra **junto**
com a entrada do Bloco A correspondente, nunca depois — o card não deve existir nem por um minuto com a
descrição incompleta.

---

## 4. Achados que só o corpo revela, e que não estão na revisão

### 4.1 O fuso do cliente está escrito em quatro cards, não em um

`SPR-36` (escopo e justificativa) · `SPR-37` (*"turno e fechamento de caixa dependem do fuso do cliente,
que vem do schema de controle"*) · `SPR-46` (escopo e aceite) · `SPR-34` (invariante 5 da Epic: *"o fuso
é dado do cliente, aplicado na borda"*).

Quatro cards, uma resposta, nenhuma decisão. E a ordem é a pior possível: `SPR-36` vence em **09-08**,
`SPR-46` em 09-24, `SPR-37` em 10-07 — a coluna nasce primeiro e os outros três a consomem. Quando a
pergunta chegar ao humano, ela já terá sido respondida três vezes por herança.

Isto é `G-02` e `G-09` na mesma forma: decisão do humano que o calendário atropela. A diferença é que
`G-02` e `G-09` a revisão viu, e esta não — porque só aparece no corpo.

### 4.2 Três das cinco Epics planejadas nunca foram criadas, e dois cards dependem delas

O comentário de Artur em `SPR-1` (2026-08-23) lista as Epics que sairiam do spike:

> 1. Gestão de Atendimento e Comandas · 2. Gestão e Composição da Comanda · **3. Personalização de
> Produtos** · **4. Disponibilidade Operacional de Produtos e Ingredientes** · **5. Status e
> Acompanhamento dos Itens**

As duas primeiras viraram `SPR-5` e `SPR-15`. **As três últimas não existem no board.** E duas issues
apontam para elas:

- `SPR-25`: *"Para itens já enviados, o comportamento deverá respeitar as regras de edição definidas no
  **Epic 3**"* — com nota dizendo que a dependência é proposital, para não duplicar a regra.
- `SPR-27`: *"A implementação da validação envolvendo ingredientes ficará relacionada ao **Epic 5**."*

Dependência declarada para issue inexistente é pior que dependência ausente: o autor **acreditou** que
delegou, e o board não acusa. A revisão leu a dependência de `SPR-25` como sendo para `SPR-30` — é
para o Epic 3.

Nada disso pede Epic nova agora. Pede que a substituição de `SPR-25` e o comentário de `SPR-27` nomeiem
o destino real de cada dependência, e que a pauta do humano registre que as três Epics restantes ou
foram absorvidas (personalização → `G-04`/`G-05`; disponibilidade → `G-07`; status → `COZ`) ou precisam
existir.

### 4.3 `SPR-14` está agendado depois do único gate de segurança do board

`SPR-41` — gate de isolamento de tenant do modelo da Fase 1 — vence em **2026-10-20**. `SPR-14` — tabelas
do módulo de atendimento — vence em **2026-10-23**, três dias depois, e cria tabelas novas em schema de
cliente.

O gate 2 do `CLAUDE.md` §4 é obrigatório para schema e migration, e não há segundo gate no board. Como
está, o modelo do módulo de atendimento entra sem auditoria de isolamento. Ou `SPR-14` vem antes de
`SPR-41`, ou existe um segundo gate depois dele. É decisão de sequência, do humano — mas o board hoje
não oferece nenhuma das duas.

### 4.4 `SPR-40` entrega ao modelador uma decisão que é de produto

"Resultados Esperados" de `SPR-40` pede *"um caso concreto de **rateio com resto** resolvido à mão e
conferido — valor que não divide igualmente entre itens, e onde o centavo sobrante vai parar."*

Onde o centavo sobrante vai parar **é** a política de arredondamento, que é `LACUNA-NUC-004`
(`nucleo-publicacao-e-texto.md:46`) e que `roadmap-de-modulos.md:333` põe como decisão de produto com o
humano e o contador, antes da Fase 1. O veredito `AJUSTAR` da revisão está certo; o motivo muda. Não é
que o card omita a parte de produto — é que ele a **atribui ao modelador**, num campo obrigatório que
alguém vai preencher em 2026-09-02.

### 4.5 `SPR-27` carrega um comentário que contradiz `G-07`, e ninguém o retratou

O comentário de 11:54:09 em `SPR-27` diz:

> **Disponibilidade é do núcleo** (todo ramo tem produto que acaba). A regra de _como_ ela é dada baixa
> — manual, por estoque, por horário — é que pode ser de módulo. […] Vale para `SPR-26`.

`G-07` diz o oposto: disponibilidade com dono é `EST` (`catalogo-de-modulos.md:93`), fora do MVP 1, e no
núcleo indisponível significa **ausência do artefato publicado** — não item visível marcado.

Comentário é append-only, então a entrada do Bloco A para `SPR-27` **precisa retratar explicitamente**,
como `SPR-28` e `SPR-32` fizeram nos comentários deles. Sem isso o card fica com duas fronteiras opostas
afirmadas com a mesma autoridade, e quem chegar depois escolhe a que leu primeiro. Texto na §8 do arquivo
de correções.

### 4.6 `SPR-20` tem um critério duplicado e um limite que o operador vai bater

Duas linhas dizendo a mesma coisa:

> * Cada adicional pode ser selecionado apenas uma vez por item.
> * Não deve ser possível selecionar o mesmo adicional duas vezes no mesmo item.

E o limite é substantivo, não redacional: "bacon duplo" fica impossível. O card não é lugar de resolver —
`G-05` ainda não tem escopo — mas a pauta do humano deve carregar a pergunta, porque ela muda o desenho:
adicional é **conjunto** (cada um zero ou uma vez) ou **multiconjunto** (cada um com quantidade própria)?
A resposta decide se o valor composto é uma soma de itens ou uma soma de produtos.

---

## 5. O que a conferência confirmou sem mudar

- **`G-02` (turno)** — verificado na fonte: `LACUNA-NUC-007` aberta, humano "não sei ainda", turno
  recusado por default (`roadmap-de-modulos.md:172`, `:387`, `:420`). `SPR-37` o inclui no modelo, e
  `nucleo-caixa-e-turno.md` não tem `RN` de abrir/fechar turno. O veredito fica, e ganha o segundo motivo
  de §4.1.
- **`G-03`, `G-04`, `G-05`** — os corpos de `SPR-16`, `SPR-19`, `SPR-20`, `SPR-31` e `SPR-32` confirmam
  as três, com o estreitamento de `G-04` em §2.7.
- **`G-06`** — confirmada, e mais larga: toca `SPR-6`, `SPR-8` e `SPR-9`.
- **`G-07`** — confirmada por `SPR-26` (*"produtos indisponíveis devem continuar visíveis"*, *"produto
  indisponível não pode ser adicionado"*) e por `SPR-27`, mais a retratação de §4.5.
- **`G-08`, `G-09`** — confirmadas nos corpos de `SPR-17` e `SPR-28`/`SPR-29`/`SPR-40`.
- **§3 linhas 1, 3, 4, 5, 6, 7, 8 da revisão** — cada uma conferida contra o corpo citado. Todas se
  sustentam.
- **`SPR-38`, `SPR-39`, `SPR-41`, `SPR-45`, `SPR-51`** — corpos lidos, `MANTER` confirmado. `SPR-51`
  merece o elogio da revisão: é o único card do board cujo desfecho declarado é número medido, e ele
  declara o que fazer se não der para medir.
- **Zero `EXCLUIR`.** Nenhum corpo lido produziu candidato.

## 6. O que eu não verifiquei nesta passada

- **Corpo integral de `SPR-35`, `SPR-42`, `SPR-43`, `SPR-44`, `SPR-47`, `SPR-48`, `SPR-49`, `SPR-50`,
  `SPR-52`.** São os nove cards de fundação do cliente e de decisão de stack, todos `MANTER` na revisão,
  todos fora do território de regra de negócio. Li título, tipo e prazo; não li descrição. Depois de
  `SPR-36`, essa lacuna não é confortável — `SPR-36` também era `MANTER` e também parecia fora de risco.
- **Comentários anteriores a 2026-08-26 11:44** em cards que não abri. Li os comentários de todos os
  cards que abri.
- **`RN-OFF-008` na fonte.** Continua citado pelo que outros arquivos aprovados dizem dele, como na
  revisão.

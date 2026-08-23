# Tokens de cor — núcleo (§1–§5)

Dono: agent `ui`. Escopo: **núcleo**, todo cliente, todo módulo, todo espaço.
Criado 2026-08-22 (passo 1), corrigido 2026-08-22 (passo 2b, com a medição do passo 2).

Entrada deste arquivo: `docs/design/tokens.md` (mapa de seções, leis do §10, lacunas do §11).
Forma, texto, espaço, camada e duração: `docs/design/tokens-forma-e-texto.md` (§6–§9).
A numeração de seção é **global aos três arquivos** e não foi renumerada na divisão — citação
antiga a `tokens.md §N` continua resolvendo pelo mapa da entrada.

Este arquivo define **nome e valor de token**. Ele não define mecanismo: como o token chega ao
componente (variável CSS, contexto, classe, arquivo de tema, build) é **D-02** e está fora daqui.
A notação `dominio.token` é só hierarquia legível — a forma final do identificador é mecanismo.

**O alvo funcional é o caixa.** A referência visual é o minimalismo suíço e o método é mobile-first
(partir da restrição mais apertada e subir), mas quem opera **não lê a tela**: opera de memória, com
fila na frente, teclado e leitor de código de barras na mão. Token que só faz sentido numa tela de
painel está errado.

## 1. Lei de token

1. **Duas camadas.** A camada **primitiva** é a única que contém valor literal de cor. A camada
   **semântica** nomeia papel e **referencia** a primitiva. Um segundo tema passa a ser troca de
   valor primitivo, não mudança estrutural — custa quase nada hoje e é irreversível depois.
2. **Nenhum token semântico é nomeado por cor.** `accent-blue` é defeito; `action` é correto. Cor é
   valor; papel é nome. Componente nunca referencia primitiva direto.
3. **Contraste é medido, nunca avaliado a olho.** Todo par de uso declara o mínimo exigido; o valor
   medido é preenchido por medição real (§5).
4. **Escassez.** A rampa tem só o degrau que tem papel declarado. Numeração com vão (`100`, `200`,
   `400`…) existe para inserir degrau depois **sem renomear** o que já está em uso.
5. **Sem termo de vertical** em nome de token. Nem de espaço, nem de módulo.

### Idioma do identificador

Prosa em pt-BR; **identificador em inglês**, como todo identificador de código no projeto e como o
glossário de produto já faz (`docs/produto/glossario.md`). Mapeamento dos nomes usados no pedido:

| Pedido | Token |
|---|---|
| `superficie` | `color.surface` |
| `superficie-elevada` | `color.surface-raised` |
| `texto-primario` | `color.text-primary` |
| `texto-secundario` | `color.text-secondary` |
| `borda` | `color.border` |
| `acao` | `color.action` |
| `acao-texto` | `color.action-on` (conteúdo **sobre** o preenchimento de ação) |

`color.action-text` existe e é **outra coisa**: o acento usado **como texto** sobre uma superfície.
Os dois nomes são próximos e o erro de troca é provável — daí o par `-on` / `-text` ser explícito.

## 2. Camada primitiva — a única com hex

Quatro âncoras vêm do humano e nenhuma foi movida: `#FFFFFF`, `#1A1A1A`, `#F2F2F2`, `#2E6BFF`.
Todo o resto é derivado delas ou de um papel funcional que elas não cobrem (§4).

### Neutro

| Token | Valor | Origem | Papel que justifica o degrau |
|---|---|---|---|
| `color.neutral.000` | `#FFFFFF` | âncora | superfície de painel, linha e campo; membro claro do foco |
| `color.neutral.100` | `#F2F2F2` | âncora | fundo de tela |
| `color.neutral.200` | `#E3E3E3` | derivado | hairline estrutural e divisor; superfície indisponível |
| `color.neutral.400` | `#8A8A8A` | derivado | limite de controle (piso 3:1 sobre as duas superfícies) |
| `color.neutral.600` | `#5C5C5C` | derivado | texto secundário (piso 4,5:1 sobre as **duas** superfícies) |
| `color.neutral.900` | `#1A1A1A` | âncora | texto primário; membro escuro do foco |

`color.neutral.600` existe porque o cinza clássico de 4,5:1 sobre branco **reprova** sobre `#F2F2F2`
e o texto secundário aparece nas duas superfícies — mesmo problema do acento (§3): dois fundos, um piso.

`color.neutral.200` serve **dois** papéis (divisor e superfície indisponível) de propósito, e a
medição do passo 2 fechou a consequência: qualquer par entre os dois é **1,00** (§5, indisponível).

### Acento (marca e ação)

| Token | Valor | Origem | Papel |
|---|---|---|---|
| `color.blue.050` | `#EAF0FF` | derivado | fundo de linha selecionada |
| `color.blue.500` | `#2E6BFF` | âncora | preenchimento da ação primária; marcador de seleção |
| `color.blue.700` | `#1E56E6` | derivado | acento **como texto**; preenchimento pressionado |

`color.blue.700` é o degrau que a medição obrigou (§3). Derivado por **redução de luminância
relativa preservando o matiz da âncora** (~223°); não é um azul novo, é a mesma cor mais escura.

### Estado funcional — perigo, sucesso, atenção

Justificados um a um em §4. Vermelho e verde estão em **degraus de luminância próximos**: escolhi
cada um pelo contraste com o **fundo**, não entre si. Em escala de cinza, e para quem não distingue
vermelho de verde, eles são quase o mesmo valor — é por isso que estado **nunca** é sinalizado só
por cor (§10.4, em `tokens.md`), não por zelo de acessibilidade.

| Token | Valor | Papel |
|---|---|---|
| `color.red.050` | `#FDECEA` | fundo de faixa de recusa/erro |
| `color.red.700` | `#C1201A` | preenchimento destrutivo **e** o mesmo vermelho como texto |
| `color.green.050` | `#E8F4EC` | fundo de faixa de conclusão |
| `color.green.700` | `#1B7A3D` | preenchimento de conclusão **e** o mesmo verde como texto |
| `color.amber.050` | `#FFF4E0` | fundo de faixa de pendência |
| `color.amber.500` | `#F5A623` | preenchimento de atenção — recebe conteúdo **escuro** |
| `color.amber.800` | `#8A4B00` | âmbar **como texto** sobre superfície clara |

Âmbar é o único papel com **dois** degraus de uso, porque é o único cuja assimetria é real: âmbar
escuro o bastante para receber texto branco deixa de parecer âmbar (lê como marrom) e perde a função
de sinalizar "pendente". Então o preenchimento é claro com conteúdo escuro e o texto é um âmbar
escuro separado. Vermelho e verde não precisam: um degrau serve de preenchimento e de texto.

### Alfa

`color.alpha.scrim` = `#1A1A1A` a 55% (véu atrás de camada transitória).
`color.alpha.shadow` = `#1A1A1A` a 20% (a única sombra do sistema, `tokens-forma-e-texto.md` §8).

## 3. A medição é entrada, e ela decidiu três coisas

### 3.1 Os seis pares do passo 1

Medido com a fórmula de luminância relativa WCAG, pelo thread principal, em 2026-08-22:

| Par | Razão | 4,5:1 | 3:1 |
|---|---|---|---|
| `#2E6BFF` sobre `#FFFFFF` | 4,50 | passa (4,5033 no cru: 0,07% acima do piso) | passa |
| `#2E6BFF` sobre `#F2F2F2` | 4,02 | **reprova** | passa |
| `#FFFFFF` sobre `#2E6BFF` | 4,50 | passa | passa |
| `#1A1A1A` sobre `#2E6BFF` | 3,86 | **reprova** | passa |
| `#1A1A1A` sobre `#FFFFFF` | 17,40 | passa | passa |
| `#1A1A1A` sobre `#F2F2F2` | 15,55 | passa | passa |

O que isso decidiu, e não foi preferência minha:

- **O acento não é usado como texto.** Ele reprova sobre o cinza e passa sobre o branco por um fio.
  Quem faz esse trabalho é `color.blue.700` (`color.action-text`). O piso não foi afrouxado.
- **O acento continua sendo o preenchimento da ação primária**, com conteúdo branco. O passo 2
  confirmou que `blue.500` sobre `neutral.000` é **4,5033** no valor cru: passa o piso de texto normal **de
  verdade**, não por arredondamento. A margem é de **0,07%** — terceira casa decimal, estreita, mas
  não inexistente: passar por 33 décimos de milésimo ainda é passar (§3.3).
- **O membro escuro do indicador de foco é acromático** (`color.neutral.900`), e não o acento: um
  anel azul desaparece exatamente no botão primário focado, que é o alvo mais frequente de um fluxo
  por teclado. Esse argumento se manteve na medição completa. O que caiu foi outro (§3.2).

### 3.2 O que o passo 2 reprovou, e a correção

`focus-ring` sobre `danger` = **2,89**. Piso 3:1. **Reprova.**

O erro do passo 1 não foi a cor: foi a **generalização**. Justifiquei o anel acromático com
"funciona nas três superfícies", e as três eram branco, cinza e o acento — o conjunto medido na
época. Preenchimento de estado funcional não estava nele. E o conjunto de fundos **não é fechado**:
módulo futuro traz preenchimento novo. Uma regra que exige remedir o anel contra todo preenchimento
que ainda vai nascer é uma regra que será quebrada em silêncio.

Não afrouxei o piso, e não escureci `danger`: escurecer o vermelho invalidaria de uma vez os cinco
pares que já dependem dele e ainda pediria medição nova. A correção é estrutural, e a lei §10.4 (`tokens.md`) já
abria a porta para ela — **o indicador de foco deixa de ser um anel de uma cor e passa a ser um par
de contornos contíguos**:

| Token | Referencia | Papel no indicador |
|---|---|---|
| `color.focus-ring` | `neutral.900` | membro **escuro**, contorno externo, `stroke.300` (3) |
| `color.focus-ring-contrast` | `neutral.000` | membro **claro**, contorno interno contíguo ao alvo, 2 |

Os dois membros contrastam **17,40 entre si** (mesmo par primitivo de `focus-ring`/`surface-raised`).
Daí a lei, que substitui a generalização que caiu:

> **O indicador de foco é discernível por si, não pelo fundo.** Para todo fundo que ele toca,
> **ao menos um** dos dois membros cumpre 3:1 — e a tabela de §5 nomeia qual membro carrega em cada
> fundo do sistema. Preenchimento novo entra no sistema declarando qual membro carrega; enquanto não
> declarar, o indicador continua legível — **nenhuma cor pode reprovar 3:1 contra os dois membros ao
> mesmo tempo**, porque a luminância necessária para reprovar contra o branco é incompatível com a
> necessária para reprovar contra `neutral.900`. Não é um conjunto de fundos verificado caso a caso:
> é uma propriedade do par, e é por isso que ela não vence.

Sobre `danger` quem carrega é o membro claro (**6,02**); sobre `attention`, o escuro (**8,59**);
sobre `action` e `success`, os dois. Vale, portanto, para os quatro preenchimentos — e vale para o
quinto que ainda não existe, que é o ponto.

**Geometria e footprint não mudaram**: continuam 5 px por lado fora da borda do alvo
(`stroke.300` + `focus.offset`), que é a aritmética que `grade-e-espacos.md` §2.3 e §7 consomem. O
que mudou é que a banda de 2 px que era **vaga transparente** agora é **pintada** com
`focus-ring-contrast`. Detalhe em `tokens-forma-e-texto.md` §8.

**A perna não-cromática** (§10.4 de `tokens.md`, que se aplica ao foco como a qualquer estado): `stroke.300` e a
geometria de **contorno duplo** são reservadas ao foco e a nada mais no sistema. O indicador é
reconhecível por espessura e duplicidade mesmo onde o contraste de um dos membros é fraco.

### 3.3 Piso unificado: conteúdo sobre preenchimento exige 4,5

O passo 1 exigiu **3** de `action-on`/`action` (justificando que o rótulo de ação primária é texto
grande por regra) e **4,5** dos outros três `-on`. É o mesmo padrão — conteúdo sobre preenchimento —
com dois critérios. Unifiquei em **4,5 para os quatro**, e os quatro passam: 4,50 · 6,02 · 5,39 ·
8,59. Nenhum veredito mudou; o que sai é a bifurcação.

O que **não** muda por causa disso: o rótulo de ação primária continua sendo texto grande por regra
(`type.size.300` + `type.weight.strong`). A razão agora é legibilidade de relance para quem opera de
memória, mais a margem de 0,07% do par — não um piso de contraste mais baixo. `grade-e-espacos.md`
§4 mantém o piso de 20 em todas as faixas, e nada aqui o afrouxa: reduzir aquele rótulo continua
proibido, e repintar `blue.500` continua exigindo medição nova.

### 3.4 As margens apertadas — para quem for mexer na paleta depois

Quatro pares passam com pouca folga. **Qualquer clareamento de `color.green.700` ou de
`color.neutral.400` derruba estes quatro primeiro**, e nesta ordem:

| Par | Medido | Piso | Folga |
|---|---|---|---|
| `border-strong` sobre `surface` | 3,08 | 3 | 2,7% |
| `focus-ring` sobre `success` | 3,23 | 3 | 7,7% |
| `success-text` sobre `success-surface` | 4,77 | 4,5 | 6,0% |
| `success-text` sobre `surface` | 4,81 | 4,5 | 6,9% |

Junto com o par de `action` (**0,07%**, o mais apertado do sistema por duas ordens de grandeza),
são os cinco pontos em que a paleta não tem folga. Mexer em
`blue.500`, `green.700` ou `neutral.400` **exige** remedir — não é revisão opcional.

## 4. Um acento, e o conjunto funcional mínimo

Um acento de marca/ação (`color.blue.500`) mais **três** papéis funcionais. Eles são **só de estado**:
nunca decorativos, nunca segundo acento de marca, nunca ênfase (ênfase é tamanho e peso, §10.7 de `tokens.md`).

Por que exatamente três, e não uma escolha estética: `RN-OFF-002`
(`docs/produto/operacao-offline-e-sincronizacao.md`) já fixa que o desfecho de qualquer operação é
**um de três, e só três** — opera integralmente, opera degradado com fila, ou recusa dizendo por
quê. O conjunto funcional é o espelho visual desses três desfechos. Um quarto matiz codificaria um
quarto desfecho que o produto **recusa**.

| Papel | Desfecho que ele espelha | Consequência de operação se ele não existir |
|---|---|---|
| `danger` | recusa, e ação irreversível | cancelar venda, cancelar item lançado e confirmar pagamento ficam com a mesma cor. O operador aciona por músculo, com fila na frente: ele vai errar, e o erro é fato fiscal novo (`sale_cancellation`), não um desfazer. |
| `success` | opera integralmente | o operador precisa saber, de relance, se a venda fechou **antes** de entregar mercadoria. Sem sinal próprio, "fechou" e "pode agir aqui" são a mesma cor. |
| `attention` | opera degradado com fila | contingência fiscal e operação offline são estados em que a venda **continua** com pendência nomeada (`RN-OFF-011`). Sem um terceiro papel, pendência se pinta de vermelho, o vermelho aparece em operação normal e o operador **aprende a ignorar vermelho** — o custo não é a pendência mal sinalizada, é o vermelho real deixar de parar alguém. |

`danger` cobre **recusa** e **ação destrutiva** no mesmo token, deliberadamente: para quem opera de
músculo os dois significam a mesma coisa — consequência. Dois vermelhos distintos seriam distinção
que só o desenhista percebe.

**Não existe token para "sem permissão".** Ausência por autorização é **ausência**: o recurso
negado não é desenhado em estado apagado, porque o estado apagado revela que o recurso existe.
`disabled` é para capacidade **temporariamente** indisponível e cognoscível (periférico ausente,
dependência de autoridade externa fora, pré-condição de fluxo não satisfeita), sempre acompanhada de
motivo em texto. **Módulo desligado não é `disabled`: é ausência** — rota que não existe e nó que não
chega no manifesto (`.claude/rules/backend.md` §2 e §4). Desenhado como controle apagado, ele revela
o que o cliente **não** contratou, que é a mesma divulgação recusada duas linhas acima. Classificação
corrigida em 2026-08-22 (S-07 de `estados-e-interacao.md` §10).

## 5. Camada semântica e pares de contraste

Exigido segue o piso WCAG AA: **4,5:1** texto normal; **3:1** texto grande, componente de UI e
objeto gráfico. Conteúdo sobre preenchimento exige 4,5 nos quatro casos (§3.3).

**Inventário desta seção:** 33 linhas de tabela de par, que expandem em **43 pares conteúdo×fundo**.
41 têm piso declarado; 2 são isentos e informativos (`border`/`surface-raised` e
`border`/`disabled-surface` — nenhum dos dois é único meio de identificar coisa alguma). Dos 41 com
piso, **os 41 têm valor e nenhum está pendente** desde 2026-08-22, quando `focus-ring` sobre
`disabled-surface` foi medido (§5.2).

São **47 células de valor** — mais que 43 porque os pares de foco sobre preenchimento têm um valor
por membro do par. Dessas, **37 vêm da medição do passo 2**, **1 da medição de fechamento de
2026-08-22** (`focus-ring` sobre `disabled-surface` = 13,56), **8 são derivadas por identidade de
primitiva** (marcadas `†`) e **1 é medida e idêntica ao mesmo tempo** (marcada `††`, §5.2).
Identidade de primitiva: o par semântico é outro, mas resolve para exatamente as mesmas duas cores de
um par já medido, então a razão é a mesma por construção — não é estimativa, e também não é medição
nova. `—` na coluna medida significa **este membro não carrega o contraste neste fundo**: não foi medido,
e não precisa ser, porque o outro membro do par cumpre o piso — a célula ao lado diz qual. **Não há
mais célula `PENDENTE`** nesta seção; §10.3 de `tokens.md` (par sem valor não vai para produção)
continua valendo para par que nasça depois.

*(O passo 1 dizia "28 pares". Estava errado nas três contagens possíveis: 26 linhas, 37 pares
medidos, 36 com piso. O número correto, com a correção do §3.2 dentro, é o inventário acima.)*

### 5.1 Superfície, conteúdo e limite

| Token | Referencia | | Token | Referencia |
|---|---|---|---|---|
| `color.surface` | `neutral.100` — fundo de tela | | `color.text-primary` | `neutral.900` |
| `color.surface-raised` | `neutral.000` — painel, linha, campo | | `color.text-secondary` | `neutral.600` |
| `color.border` | `neutral.200` — divisor, hairline | | `color.border-strong` | `neutral.400` — limite de controle |

| Par | Exigido | MEDIDO |
|---|---|---|
| `text-primary` sobre `surface-raised` / `surface` | 4,5 | 17,40 / 15,55 — passa |
| `text-secondary` sobre `surface-raised` / `surface` | 4,5 | 6,69 / 5,97 — passa |
| `border-strong` sobre `surface-raised` / `surface` | 3 | 3,45 / **3,08** — passa, folga de 2,7% no cinza |
| `border` sobre `surface-raised` | isento — não é único meio de identificar nada | 1,28 — informativo |

### 5.2 O par de foco, fundo por fundo

`color.focus-ring` → `neutral.900` (membro escuro) · `color.focus-ring-contrast` → `neutral.000`
(membro claro). Um par, não dois tokens independentes: **nunca** se desenha um sem o outro (§3.2).

| Fundo | Exigido | `focus-ring` | `focus-ring-contrast` | Quem carrega |
|---|---|---|---|---|
| `surface-raised` | 3 | 17,40 | — | escuro |
| `surface` | 3 | 15,55 | — | escuro |
| `action` | 3 | 3,86 | 4,50 † | os dois |
| `danger` | 3 | **2,89 — reprova** | 6,02 † | **claro** |
| `success` | 3 | 3,23 | 5,39 † | os dois |
| `attention` | 3 | 8,59 | — | escuro |
| `selected-surface` | 3 | 15,25 † | — | escuro |
| `danger-surface` / `success-surface` / `attention-surface` | 3 | 15,22 † / 15,40 † / 15,97 † | — | escuro |
| `disabled-surface` | 3 | **13,56** | 1,28 †† — reprova, e não carrega aqui | **escuro** |

O **2,89 fica escrito**, com o veredito de reprovação, porque é ele que justifica o par existir: o
membro escuro sozinho não serve sobre vermelho, e esconder isso convidaria alguém a simplificar o
indicador de volta para um anel só.

`disabled-surface` era o último par sem valor, e ele fechou em 2026-08-22 nas duas pontas. O passo 4
decidiu que **controle indisponível é focável** (`estados-e-interacao.md` §3.7), e a razão não é
conforto: **o ordinal é contrato** — tirar o controle morto da ordem de foco faria o ordinal de tudo
depois dele variar com a disponibilidade, durante o turno. Decidido isso, a medição deixou de ser
condicional e foi feita: **13,56** no membro escuro (passa o piso de 3 com folga larga) e **1,28** no
claro.

**Aqui quem carrega é o membro escuro** — inversão exata do que acontece sobre `danger`, onde carrega
o claro. É a propriedade do par do §3.2 operando: o fundo indisponível é claro, então o membro escuro
sustenta; sobre o vermelho escuro é o contrário. Nada no desenho do indicador muda por causa desta
medição, e é por isso que ela não gerou correção.

**A célula de 1,28 é `††`: valor medido que não é evidência nova.** `focus-ring-contrast` sobre
`disabled-surface` é o **mesmo par primitivo** (`neutral.000` sobre `neutral.200`) de `border` sobre
`surface-raised`, já registrado em §5.1 com o mesmo 1,28. Duas linhas, uma evidência — quem remedir a
paleta conta uma vez, e mexer em `neutral.200` move as duas células juntas. Ela está escrita, e não
`—`, porque este é o único fundo do sistema em que o membro que **não** carrega reprova sobre
superfície clara: sem o número, alguém supõe que o membro claro ajuda ali.

### 5.3 Ação

| Token | Referencia | | Token | Referencia |
|---|---|---|---|---|
| `color.action` | `blue.500` — preenchimento primário | | `color.action-on` | `neutral.000` — conteúdo sobre `action` |
| `color.action-pressed` | `blue.700` — pressionado | | `color.action-text` | `blue.700` — acento como texto/ícone |
| `color.selected-surface` | `blue.050` — linha selecionada | | `color.selected-marker` | `blue.500` — marcador da linha |

Não existe token de *hover*: o terminal é toque e teclado, *hover* nunca porta informação essencial e,
onde houver ponteiro, ele reusa o valor de `action-pressed`. Seleção é `selected-surface` **mais**
`selected-marker` (barra de `stroke.200` na borda de início da linha): a linha focada por teclado é a
informação mais crítica de um fluxo sem toque, e cor sozinha não a carrega.

| Par | Exigido | MEDIDO |
|---|---|---|
| `action-on` sobre `action` | 4,5 | **4,50** — passa (4,5033 no cru; folga de 0,07%) |
| `action-on` sobre `action-pressed` | 4,5 | 5,95 — passa |
| `action-text` sobre `surface-raised` / `surface` | 4,5 | 5,95 / 5,32 — passa |
| `action-text` sobre `selected-surface` | 4,5 | 5,22 — passa |
| `text-primary` sobre `selected-surface` | 4,5 | 15,25 — passa |
| `selected-marker` sobre `surface-raised` / `surface` | 3 | 4,50 / 4,02 — passa |

### 5.4 Estado funcional

| Token | Referencia | | Token | Referencia |
|---|---|---|---|---|
| `color.danger` | `color.red.700` | | `color.danger-on` | `color.neutral.000` |
| `color.danger-text` | `color.red.700` | | `color.danger-surface` | `color.red.050` |
| `color.success` | `color.green.700` | | `color.success-on` | `color.neutral.000` |
| `color.success-text` | `color.green.700` | | `color.success-surface` | `color.green.050` |
| `color.attention` | `color.amber.500` | | `color.attention-on` | `color.neutral.900` |
| `color.attention-text` | `color.amber.800` | | `color.attention-surface` | `color.amber.050` |

`attention-on` é o **único** `-on` escuro do sistema. A assimetria é intencional (§2) e quem
implementa não pode presumir "conteúdo sobre preenchimento é branco".

| Par | Exigido | MEDIDO |
|---|---|---|
| `danger-on` sobre `danger` | 4,5 | 6,02 — passa |
| `danger-text` sobre `surface-raised` / `surface` | 4,5 | 6,02 / 5,38 — passa |
| `danger-text` sobre `danger-surface` | 4,5 | 5,26 — passa |
| `text-primary` sobre `danger-surface` | 4,5 | 15,22 — passa |
| `success-on` sobre `success` | 4,5 | 5,39 — passa |
| `success-text` sobre `surface-raised` / `surface` | 4,5 | 5,39 / **4,81** — passa, folga de 6,9% |
| `success-text` sobre `success-surface` | 4,5 | **4,77** — passa, folga de 6,0% |
| `text-primary` sobre `success-surface` | 4,5 | 15,40 — passa |
| `attention-on` sobre `attention` | 4,5 | 8,59 — passa |
| `attention-text` sobre `surface-raised` / `surface` | 4,5 | 6,80 / 6,08 — passa |
| `attention-text` sobre `attention-surface` | 4,5 | 6,24 — passa |
| `text-primary` sobre `attention-surface` | 4,5 | 15,97 — passa |

As quatro tintas de fundo (`blue.050`, `red.050`, `green.050`, `amber.050`) recebem `text-primary` com
15,22 a 15,97 — folga larga. Se alguma precisar mudar, a correção é **escurecer a tinta**, nunca
clarear o texto.

### 5.5 Indisponível

`color.disabled-surface` → `color.neutral.200`; `color.disabled-text` → `color.neutral.600`.
Controle indisponível **não tem limite desenhado**: perde o acento e vira preenchimento neutro
achatado. Não existe `disabled-border`.

| Par | Exigido | MEDIDO |
|---|---|---|
| `disabled-text` sobre `disabled-surface` | **4,5** (piso próprio, mais estrito que WCAG) | 5,21 — passa |
| `border` sobre `disabled-surface` | isento — o token não existe | 1,00 † — informativo |

WCAG isenta controle desabilitado de contraste. Nós não: um botão que o operador não consegue ler é
chamada de suporte com fila na frente. Indisponibilidade se sinaliza pela perda de acento e pelo
motivo em texto, nunca pela perda de legibilidade.

E a medição fechou o argumento de `disabled-border`: `border` e `disabled-surface` referenciam a
**mesma** primitiva (`neutral.200`), então a razão é **1,00** — um limite desenhado ali seria
literalmente invisível. A ausência do token deixou de ser preferência de desenho e passou a ser
consequência medida.

# Vocabulário de bloco e eixos — núcleo (§1–§3, §5, §6)

Dono: agent `ui`. Escopo: **núcleo**, todo cliente (tenant), todo módulo, todo espaço.
Criado 2026-08-22 (T-0002, passo 5). Lacunas prefixadas `V-`, para não colidir com `L-` (tokens),
`G-` (grade) nem `S-` (estados).

Entrada consumida, sem reescrever nada dela: `tokens.md` (§10 leis, §11 lacunas), `tokens-cor.md`,
`tokens-forma-e-texto.md` (§8 foco e camada), `grade-e-espacos.md` (§4 os quatro espaços, §5
densidade e a fronteira variante↔bloco, §6 zonas e as garantias de `PN-06`, lei 11),
`estados-e-interacao.md` (§3 o vocabulário fechado de estado, §4 autorização, §5 rede, §9 leis),
`foco-teclado-e-leitor.md` (§6 ordem de foco, §7 leitor).
Contrato de produto: `postura-nova-geracao.md` (`PN-05`, `PN-06`, `PN-09`, `PN-13`, `PN-15`,
`PN-17`, `PN-18`), `operacao-offline-e-sincronizacao.md` (`RN-OFF-018`), `glossario.md` (léxico do
núcleo e §5 formas proibidas), `docs/arquitetura/d-01-d-02-stack-opcoes.md` (§3.4, catálogo
embarcado e tolerância de versão nos quatro arranjos).

Este arquivo define **nome, eixo e papel**. Ele **não** define mecanismo: como a prop é tipada e
como o tema chega ficam fora daqui.

Ele **não** contém componente, prop, variante enumerada nem número novo: toda grandeza que pediria
valor está em outro arquivo desta camada ou é lacuna nomeada (§6).

**Espelho executável desde 2026-09-12 (T-0012):** `packages/sdui/src/vocabulary/` carrega a mesma
lista como tipo fechado, e `packages/sdui/src/manifest/` implementa o §4. Este arquivo continua
sendo a autoridade sobre **significado**; o pacote é a autoridade sobre **compilação**, e
`checkVocabulary` cobra as leis do §1 e do §5 em teste.

**Partido em dois arquivos em 2026-08-22, no mesmo passo.** O arquivo único fechou em **425** linhas
contra teto de 400. O **eixo do corte é o sujeito**: o que o manifesto **diz** fica aqui — nome,
eixo e papel, que são contrato compartilhado com `backend`; o que o cliente **faz quando não
entende** o que recebeu vai para [`tolerancia-de-versao.md`](tolerancia-de-versao.md), que é
resiliência do lado do cliente. A numeração de seção é **global aos dois** e **não foi renumerada**;
as leis (§5) e as lacunas (§6) ficam aqui e valem para os **dois** arquivos.

| § | Conteúdo | Arquivo |
|---|---|---|
| 1 | A lei de nomeação | **este arquivo** |
| 2 | Os eixos — variante, slot, e o que não é eixo | **este arquivo** |
| 3 | Semente de papéis de bloco | **este arquivo** |
| 4 | Tolerância de versão | [`tolerancia-de-versao.md`](tolerancia-de-versao.md) |
| 5 | Leis desta camada — valem para os **dois** | **este arquivo** |
| 6 | Lacunas | **este arquivo** |

**O que este arquivo é, em uma frase:** o mínimo que `backend` precisa para compor manifesto sem
inventar vocabulário, e o mínimo que o cliente precisa para não morrer com manifesto que não
entende. Catálogo de componentes é **Fase 3** e não nasce aqui (§3.5).

---

## 1. A lei de nomeação

### 1.1 A forma do id

- `block.<papel>` — **exatamente dois segmentos**, separados por um ponto. Prefixo fixo `block.`,
  papel em `kebab-case`.
- **Identificador em inglês**, prosa em pt-BR: token é identificador de código e a lei de idioma do
  projeto manda inglês (mesma decisão do passo 1, mesmo procedimento do `glossario.md`, que fixa o
  termo em pt-BR e o nome em inglês).
- **Dois segmentos, e o terceiro é proibido.** Um terceiro segmento só teria uso para codificar
  degrau, tamanho, densidade ou espaço — e nada disso está no id (§2). `block.command.large` é
  variante escrita no id: defeito, não abreviação.
- Nome inteiro, nunca abreviado (`glossario.md` §5). Nunca no plural, nunca numerado
  (`block.list-2` é sinal de que faltou um papel, não de que sobrou um).

### 1.2 O nome nomeia a função na interface — nunca a entidade, nunca a aparência

Um papel de bloco responde **"que trabalho o operador faz aqui?"**. Não responde "que entidade
aparece aqui" nem "com que forma".

- **Entidade no nome** vaza domínio para o catálogo do núcleo. `block.sale-item-list` parece
  inofensivo e é a porta pela qual, três módulos depois, entra o nome de ramo — e nome de vertical
  no catálogo do núcleo é defeito declarado (`ui.md` Nunca). Entidade é do `source`, não do `kind`.
- **Aparência no nome** (`card`, `panel`, `modal`, `drawer`, `grid`) morre no primeiro redesenho, e
  id não pode morrer (§1.4). Aparência também não é ortogonal a espaço: o que é "cartão" em um
  espaço é linha em outro.
- **É daqui que vem o tamanho da semente.** Funções de interface são poucas e estáveis; entidades e
  telas são muitas e crescem com cada módulo. Nomear por função é o que faz um catálogo pequeno
  servir a operação inteira; nomear por entidade produz um bloco por tela e o catálogo apodrece
  exatamente como `ui.md` §2 descreve.
- Mesmo espírito da regra 1 de `catalogo-de-capacidades.md` §1: **mecanismo não entra no nome**.

### 1.3 O que o id não pode conter — lista fechada

1. **Termo de vertical ou de ramo** (`CLAUDE.md` §7.3). O módulo **usa** o bloco; não o batiza.
2. **Nome de entidade de negócio** — nem do núcleo, nem de módulo.
3. **Nome de aparência, de forma, de cor ou de posição.**
4. **Nome de espaço, de densidade, de alvo ou de tamanho** — são eixos (§2), e eixo no id é o `if`
   estrutural de `ui.md` §2 escrito no vocabulário.
5. **Nome de framework, de biblioteca ou de primitiva de plataforma** (id publicado sobrevive à
   troca de qualquer uma delas — **D-02** fechou em 2026-09-11 e isso não muda a regra).
6. **Identificação de cliente (tenant) ou de estabelecimento** — `PN-09`: diferença de cliente é
   módulo, configuração ou dado, nunca vocabulário próprio.
7. **Estado** (`state.*`) e **domínio de rede** (`net.*`) — são recebidos, não são papéis (§2.4).
8. **Papel de operador ou permissão** — ausência por autorização é ausência
   (`estados-e-interacao.md` §4).
9. **Número de tela, de versão ou de ordem.** Ordinal é composição (`PN-06`), não identidade.

### 1.4 Id é imutável, e o argumento não é etiqueta

`CLAUDE.md` §7.4 e `docs/arquitetura/d-01-d-02-stack-opcoes.md` §4 já dizem que id publicado é para
sempre. O motivo operacional, que é o que se esquece:

- O catálogo é **embarcado no cliente** (`tolerancia-de-versao.md` §4.5), então em qualquer instante existem terminais em
  versões diferentes do vocabulário.
- E o manifesto é **cacheado** (`ui.md` §1). Logo o fluxo não é só "servidor novo → cliente velho":
  é também **manifesto velho → cliente novo**, saído do cache local do próprio terminal, possivelmente
  depois de uma atualização. Um id que o cliente novo deixou de entender transforma o cache — que
  existe para sustentar `RN-OFF-018` — em tela degradada justamente quando a rede está fora.

Portanto:

- **Renomear não existe.** Papel novo é **id novo**; o antigo continua entendido pelo cliente
  enquanto qualquer manifesto cacheado puder carregá-lo, e para de ser **emitido** pelo servidor
  antes disso. É o expand/contract de `migrations.md` aplicado ao vocabulário: o passo que remove é
  separado, posterior e do humano.
- **Reaproveitar id é pior que renomear:** o mesmo id com significado novo faz o cliente velho
  renderizar a coisa errada com convicção, e nada acusa. Id retirado não volta.
- Retirar um id é decisão registrada, e ela declara **quem ainda emite** e **quem ainda entende** —
  as duas perguntas, porque as duas populações são diferentes.

### 1.5 Registro de prefixos, e a regra de formação

Um prefixo, uma espécie de coisa, um arquivo dono. Este registro é a **lista completa**: prefixo que
não tem linha aqui não existe. A quarta coluna existe porque ela é o que decide o **custo de errar**:
prefixo que atravessa a rede é contrato com terminal em versão antiga e cai na proibição de renomear
(§1.4); prefixo que vive só dentro do cliente é build, e renomear custa um `sed`.

| Prefixo | Espécie que ele nomeia | Onde é definido | Atravessa a rede? |
|---|---|---|---|
| `color.` · `type.` · `radius.` · `stroke.` · `focus.` · `elevation.` · `layer.` · `duration.` | token de estilo | `tokens-cor.md`, `tokens-forma-e-texto.md` | não — vive no cliente |
| `spacing.` | **degrau da escala de espaçamento** | `tokens-forma-e-texto.md` §7 | não — vive no cliente |
| `space.` | **espaço de desenho** (os quatro) | `grade-e-espacos.md` §4 | não — é contexto do cliente (§2.1, **V-06**) |
| `grid.` · `target.` · `measure.` · `density.` | medida e faixa de densidade | `grade-e-espacos.md` §3, §5 | não — densidade é resolvida no cliente |
| `zone.` | zona de layout | `grade-e-espacos.md` §6 | **sim** — zona e ordinal vêm do manifesto e são contrato (`PN-06`) |
| `state.` · `net.` | estado visível e domínio de rede | `estados-e-interacao.md` §3, §5 | **sim** para o fato (o servidor o decide); o nome do campo é **V-02** |
| `block.` | **papel de bloco** | este arquivo, §3 | **sim** para os papéis emitidos (§3.2); **não** para as duas entradas de piso (§3.4), que só o cliente usa |
| `input.` | **modo de interação** | este arquivo, §2.1 | não — é o hardware que o terminal tem |

**Regra de formação** — quatro cláusulas, e é ela que impede o **próximo** prefixo duplicado de entrar
sem ninguém notar:

1. **O prefixo é a palavra da prosa.** A espécie que a prosa deste sistema chama de "espaço" usa
   `space.`; a que ela chama de "espaçamento" usa `spacing.`. Duas espécies que a prosa distingue não
   podem dividir prefixo — e duas que ela não distingue são uma espécie só, ou falta um nome.
2. **O sufixo nunca é o discriminador.** Se para saber de que espécie um id é você precisa olhar o
   **formato** do sufixo (número vs `kebab-case`), o prefixo está errado. Formato de sufixo não sobrevive
   ao primeiro degrau nomeado nem ao primeiro espaço numerado.
3. **Prefixo novo entra por linha nesta tabela, na mesma mudança em que o primeiro id dele aparece** —
   com espécie, arquivo dono e a resposta da quarta coluna. Id cujo prefixo não está aqui é achado de
   revisão, e a revisão tem um lugar só para olhar.
4. **Espécie nova não se acomoda em prefixo existente** "porque é parecida". Acomodar é como a colisão
   nasce: ela não nasce de má-fé, nasce de duas coisas parecidas e de ninguém ter uma tabela para
   consultar.

**V-01, resolvida em 2026-08-23 (T-0002):** `space.` nomeava **duas** espécies — os degraus da escala de
espaçamento e os quatro espaços de desenho. A escala virou `spacing.` (`tokens-forma-e-texto.md` §7, com
o rename já aplicado nas citações de `grade-e-espacos.md`), e `space.` ficou com os espaços. Renomear a
escala, e não os espaços, tem três razões: `space.` é a palavra que a prosa e a lei de UI usam para o
espaço de desenho (cláusula 1); nome de espaço é **funcional** e a lista dos quatro é lei
(`grade-e-espacos.md` §4) — mexer nela é convidar o nome de ramo de volta; e token de estilo não
atravessa a rede (quarta coluna), então este é o momento mais barato que vai existir.

---

## 2. Os eixos

### 2.1 Dois eixos ortogonais, e uma densidade que é saída

`ui.md` §2 fixa **espaço** e **modo de interação** como eixos ortogonais, resolvidos por
variante/slot e **nunca** por `if` estrutural dentro de componente compartilhado.

- **Eixo 1 — espaço.** Valores: os quatro de `grade-e-espacos.md` §4 (`space.operator-station`,
  `space.operator-handheld`, `space.customer-personal`, `space.distant-display`). Conjunto fechado;
  espaço novo é decisão registrada (as lacunas `G-01`…`G-03` são candidatas conhecidas).
- **Eixo 2 — modo de interação.** Valores: `input.keyboard`, `input.scanner`, `input.touch`.
  Conjunto vazio significa **exibição sem interação**, que é o caso de `space.distant-display`.
  **Periférico não é modo de interação:** o leitor é modo porque produz **teclas** — o que muda
  ordem de foco, destino de leitura e terminador (`foco-teclado-e-leitor.md` §7). Balança, gaveta e
  captura de pagamento entregam **dado** ou **autoridade**, e entram como `source` e como
  `state.unavailable` quando faltam (`PN-18`), nunca como eixo.
- **Densidade não é eixo.** `grade-e-espacos.md` §5: ela é **derivada** de espaço × interação ×
  criticidade, é **declarada** e o bloco a **recebe**. Bloco não detecta espaço, não mede janela,
  não pergunta que dispositivo é.

Quem sabe o quê — e é isto que `backend` precisa para compor manifesto:

| Entrada | Quem a conhece | Por onde entra |
|---|---|---|
| qual bloco (`kind`) | servidor: módulos ativos + configuração + papel | manifesto |
| zona e ordinal | servidor | manifesto — e é **contrato** (`PN-06`) |
| dado (`source`) | servidor | manifesto |
| estado a apresentar | servidor decide o fato; o cliente só apresenta | resposta/estado recebido |
| **criticidade do slot** | **servidor** — é fato de produto (`PN-06`), não de tela | manifesto |
| espaço | contexto declarado do cliente (**V-06**), nunca largura de janela | cliente |
| modos de interação disponíveis | cliente: o hardware que ele tem | cliente |
| densidade | ninguém sozinho: derivada dos três acima | resolvida no cliente, recebida pelo bloco |
| variante | ninguém envia | resolvida no cliente, a partir da densidade e do espaço |

Duas consequências que fecham porta:

1. **O manifesto escolhe o bloco; o contexto resolve a variante.** O servidor nunca envia densidade,
   tamanho, alvo ou variante — ele não conhece o hardware do terminal. Precisa de conjunto ou de
   **ordem** de slots diferente? Envia **outro bloco** (§2.2).
2. **Das três entradas da densidade, exatamente uma vem do servidor: a criticidade.** O nome do
   campo no nó é contrato de `backend` (**V-02**); o requisito é daqui, e sem ele o cliente não
   consegue distinguir `density.eyes-free` de `density.standard` no mesmo espaço.

### 2.2 Variante e slot — a fronteira é o conjunto e a ordem dos slots

- **Slot** é posição nomeada e **ordinal** dentro de um bloco, que recebe nó filho ou conteúdo. A
  contagem de slots é fixa por contrato e **slot vazio não colapsa** (`grade-e-espacos.md` §6.3.1):
  colapsar move tudo que vem depois, e posição é contrato.
- **Variante** é o mesmo conjunto de slots, na mesma ordem, com **degraus** diferentes — alvo,
  espaçamento, tamanho de texto. Só isso.
- **A fronteira, verbatim de `grade-e-espacos.md` lei 8:** mudou o conjunto ou a **ordem** dos slots?
  É **outro bloco**, e quem escolhe é o manifesto. Um `if` estrutural interno muda posição em
  silêncio, e mudança silenciosa de posição é a regressão que `PN-06` recusa.
- **Variante nunca cruza o piso do espaço.** Piso de texto é do espaço e a densidade só o eleva
  (`grade-e-espacos.md` lei 5); o rótulo de ação primária não encolhe em nenhuma variante, porque o
  contraste medido depende dele (`tokens-cor.md` §3.3).
- **Variante não é ponto de extensão.** Não existe variante "por cliente", "por módulo" nem "por
  papel" (§2.4).

### 2.3 O que **todo** bloco do catálogo declara

Obrigação declarada aqui; **valor** por bloco é Fase 3 (§3.5). Cinco campos, e falta de qualquer um
impede a entrada no catálogo:

1. **Papel** — um dos ids do §3. Bloco sem papel do vocabulário não existe.
2. **Faixa de densidade contígua** que serve (`grade-e-espacos.md` §5.1). Faixa com buraco é
   proibida: buraco significa que há dois blocos disfarçados de um.
3. **Espaços** que serve. Bloco que serve `space.distant-display` **redeclara** densidade, porque
   aquele espaço não se deriva dos outros por escala (`grade-e-espacos.md` §4).
4. **Modos de interação** suportados (§2.1). Conjunto vazio = exibição sem interação.
5. **Estados aplicáveis**, do vocabulário fechado de `estados-e-interacao.md` §3, **mais** a
   renderização de piso do papel (`tolerancia-de-versao.md` §4.3).

Três obrigações de estado que caem por construção, e que reconciliam `ui.md` Nunca ("componente sem
estado de erro e de vazio") com `estados-e-interacao.md` §1.3 ("estado normal não é estado"):

- Bloco **com `source`** declara obrigatoriamente `state.empty`, `state.stale` e `state.error`.
  `stale` é obrigatório porque degradação sem face visível é indistinguível de dado vivo, e é a
  degradação que sustenta `RN-OFF-018`.
- Bloco **sem `source`** declara obrigatoriamente `state.error` — e **não** declara `state.empty`:
  um campo de coleta vazio é o repouso normal dele, não um estado.
- Bloco com **dependência declarada** que pode faltar (periférico, autoridade externa,
  pré-condição) declara `state.unavailable`, e ele é **focável**
  (`estados-e-interacao.md` §3.7).

Bloco pedido **fora** da faixa declarada segue `grade-e-espacos.md` §5.1: o nó é descartado como
qualquer nó inválido, **exceto** na zona de ação crítica, onde o descarte é proibido e cai no piso.

### 2.4 O que **não** é eixo — e o que é, em vez disso

| Não é eixo | Por que | O que é, então |
|---|---|---|
| **Permissão / papel de operador** | `estados-e-interacao.md` §4: fora do alcance do papel, o nó **não chega**; o que se pode pedir tem controle **normal** e a negação é resposta à tentativa. Variante "restrita" desenharia controle apagado, e apagado revela que o recurso existe | **composição** do manifesto no servidor, por papel |
| **Módulo ativo/desligado** | `backend.md` §2 e §4: rota que não existe, nó que não vem. Não é `state.unavailable`, não é controle apagado — módulo desligado desenhado como apagado revela o que o cliente (tenant) **não** contratou | **ausência de nó** |
| **Cliente (tenant) / estabelecimento** | `PN-09`: diferença entre clientes é módulo, configuração ou dado. Nunca código, id, variante nem ramo condicional | **composição, configuração e dado** — quais nós, em que ordem, com que fonte e que texto |
| **Vertical / ramo** | `CLAUDE.md` §7.3 | **módulo**, que usa os mesmos blocos |
| **Estado** | é recebido e é vocabulário próprio (`state.*`); todo bloco declara **quais** suporta (§2.3) | **conjunto declarado**, não variante |
| **Tema (claro/escuro)** | camada dupla de token: é troca de valor primitivo (`L-02`) | **valor de token** |
| **Espaço declarado no id** | eixo é resolvido por variante/slot, e id não carrega eixo (§1.3.4) | **declaração** do campo 3 de §2.3 |
| **Ordinal / posição** | `PN-06`: posição é contrato e só muda por decisão registrada | **composição** |

O caso de permissão merece a frase inteira, porque é o que mais se erra: a presença de um controle
se decide por **"o operador pode *pedir*?"**, não por "pode *concluir* sozinho?"
(`estados-e-interacao.md` §4). Uma variante "sem permissão" seria autorização no cliente — e
autorização no cliente é decoração.

---

## 3. Semente de papéis de bloco

### 3.1 Critério de admissão — e por que a semente é pequena

Entra na semente **só** o papel que satisfaz os três: (a) `backend` precisa dele para compor o
manifesto de um fluxo que **já tem regra escrita** em `docs/produto/**`; (b) inventá-lo ad hoc
depois apodrece o vocabulário, porque id é imutável (§1.4); (c) ele é **função de interface**, não
entidade nem tela (§1.2).

Não entra: nada que seja componente, prop, variante, glifo ou tela. Semente que passa de uma dúzia
virou catálogo de componentes disfarçado.

### 3.2 Os seis papéis que o manifesto emite

| id | Papel — o trabalho que se faz ali | Não faz | Estados aplicáveis |
|---|---|---|---|
| `block.region` | agrupa nós filhos e é a **unidade que carrega estado**: a precedência de `estados-e-interacao.md` §3.5 é resolvida por região | não apresenta dado próprio, não invoca operação, não é alvo focável por si | `empty` · `stale` · `loading` · `error` · `unavailable` |
| `block.record-collection` | apresenta **repetição ordenada**, um item por registro da fonte | não soma, não calcula, não pagina por conta própria além do transbordo declarado (`grade-e-espacos.md` §5.2) | `empty` · `stale` · `loading` · `error` · `unavailable`; `pending` coexiste, por linha |
| `block.record-summary` | apresenta os campos nomeados de **um** registro, com contagem de slots fixa | não calcula nenhum dos campos: valor devido, troco e total vêm do backend (`ui.md` §4) | `empty` · `stale` · `loading` · `error` · `unavailable`; `pending` coexiste |
| `block.entry` | coleta **um** valor do operador (código, quantidade, valor, texto) e pode ser **destino de leitura** da região (`foco-teclado-e-leitor.md` §7) | não valida regra de negócio, não decide disponibilidade, não interpreta o que foi lido como comando | `error` · `unavailable` |
| `block.option-set` | escolhe **uma** opção de um conjunto **fechado recebido do servidor** | não descobre opção, não ordena por conta própria (ordinal é contrato), não esconde opção por permissão | `empty` · `stale` · `error` · `unavailable` |
| `block.command` | invoca **uma** operação, e é o único papel que pode levantar a confirmação de ação irreversível | não decide se pode: a negação é resposta à tentativa (`estados-e-interacao.md` §4, caso B) | `error` · `confirming-irreversible` · `unavailable` (focável) |

Notas que não são detalhe:

- **`block.entry` não tem `state.empty`** e **`block.command` não tem `state.loading`**: no caminho
  crítico o reconhecimento **aparece** (`duration.000`) e o que falta é convergência, que é
  `state.pending` (`estados-e-interacao.md` §3.2).
- **Zero opções recebidas em `block.option-set` é `state.empty` com instrução da próxima ação**, não
  `unavailable`: opção que existe e está fora de alcance é `unavailable` e diz o motivo; conjunto sem
  nenhuma opção é vazio, e apresentá-lo como "não consegui" faria o operador afirmar ao
  cliente-final algo que não sabe (`estados-e-interacao.md` §3.1).
- **`state.pending` não é declarado por papel**: ele coexiste com qualquer estado porque descreve
  fato concluído, não a região (`estados-e-interacao.md` §3.5).

**`block.line-collection` virou `block.record-collection` em 2026-09-12 (T-0012).** "Linha" é
aparência, e o §1.2 usa esse mesmo par como argumento: o que é cartão em um espaço é linha em
outro. O papel é repetição de **registros**, que é o que `record-summary` já nomeia no singular. O
rename é legal porque o livro de ids publicados está **vazio**
(`packages/sdui/src/vocabulary/published.ts`): nenhum servidor emitiu o id, nenhum terminal o
entende. Depois da primeira emissão, o §1.4 fecha essa porta.

### 3.3 Zona × papel — quem pode ocupar o quê

Derivado de `grade-e-espacos.md` §6.2, `foco-teclado-e-leitor.md` §6.2 e da lei 4 de
`estados-e-interacao.md` §9:

| Zona | Admite | Nunca |
|---|---|---|
| `zone.flow` | qualquer papel do §3.2 | — |
| `zone.anchor-top` | `block.connection-status` (piso, §3.4) e `block.command` **em slot reservado e permanente**, para ação originada de estado | ação do caminho crítico; nó inserido no fluxo por causa de estado |
| `zone.anchor-bottom` | **só** `block.command` — ações do caminho crítico | qualquer outro papel; qualquer slot criado, movido ou empurrado por estado (lei 4); refluxo, quebra de linha, colapso de slot vazio |

### 3.4 As duas entradas de piso — existem no catálogo e o servidor **nunca** as emite

| id | Papel | Por que não é emitida |
|---|---|---|
| `block.fallback` | ocupa um slot **não colapsável** cujo nó foi descartado (id desconhecido, nó inválido, bloco fora da faixa de densidade), apresentando `state.unavailable` com motivo e próxima ação genérica | é decisão **do cliente**, tomada no parse. Se o servidor pudesse emiti-la, o servidor estaria desenhando degradação — e ele não sabe qual id este terminal entende |
| `block.connection-status` | superfície **permanente** de domínio de rede e de pendência (`estados-e-interacao.md` §5): ancorada em `zone.anchor-top`, em `layer.alert`, nunca encoberta, zero visível e slot que não colapsa | tem de existir **inclusive quando não há manifesto nenhum** — `PN-15` proíbe o terminal ficar mudo. Manifesto não a cria, não a move, não a suprime e não altera sua ordem |

`block.fallback` **não** é estado de erro de tela e não fala de tecnologia ao operador: o motivo é
operacional ("não disponível neste terminal") e a próxima ação é genérica — a quem recorrer —,
exatamente como o resíduo de atalho de `estados-e-interacao.md` §4.

### 3.5 O que fica para a Fase 3 — explícito, para ninguém antecipar

Nada abaixo é decidido aqui, e tentar decidir agora é criar estrutura de fase futura
(`processo.md` §4):

- **prop tipada, evento e nome de slot por bloco**; conjunto e ordem de slots de cada entrada;
- **variantes enumeradas** por bloco, e os degraus de cada uma;
- **valor** dos cinco campos de §2.3 por entrada de catálogo (faixa de densidade, espaços, modos,
  estados, piso do papel);
- **inventário de glifos** — uma silhueta por estado e por domínio de rede (`S-03`);
- **chaves do catálogo de mensagens** (nada de texto solto — `ui.md` §3);
- **foco inicial e destino de leitura**, que são declarados **por tela**, não por bloco
  (`foco-teclado-e-leitor.md` §6.3).

---

## 5. Leis desta camada

1. `block.<papel>`, dois segmentos, inglês, `kebab-case`. Nada mais.
2. O nome é **função de interface**: nunca entidade, aparência, ramo, cliente (tenant), framework,
   estado, permissão, eixo ou número.
3. Id publicado é **imutável**: não se renomeia, não se reaproveita, e retirar é decisão registrada
   que declara quem emite e quem entende.
4. Um prefixo, uma espécie de coisa (§1.5).
5. Eixos ortogonais são **dois**: espaço e modo de interação. Densidade é **saída** e o bloco a
   recebe.
6. **O manifesto escolhe o bloco; o contexto resolve a variante.** O servidor não envia densidade,
   tamanho nem variante; envia criticidade, zona e ordinal.
7. Variante muda **degrau**. Mudou o conjunto ou a ordem dos slots, é outro bloco.
8. Permissão, módulo ativo, cliente (tenant) e ramo **não são eixos**: são composição, ausência de
   nó, configuração/dado e módulo.
9. Todo bloco do catálogo declara os cinco campos de §2.3. Bloco com `source` declara `empty`,
   `stale` e `error`; bloco sem `source` declara `error` e **não** declara `empty`.
10. Só `block.command` ocupa `zone.anchor-bottom`. Nenhum estado cria, move ou empurra slot ali.
11. Parse nunca lança. Nó inválido é descartado, irmãos sobrevivem, tela nunca fica vazia.
12. Despacho **tipado**, fallback garantido. Mapa `kind → Component` genérico é proibido.
13. Slot de contagem fixa nunca colapsa: mostra `block.fallback`.
14. Na zona de ação crítica, bloco conhecido fora da faixa cai no piso do papel — nunca é
    descartado. Id desconhecido ali é ação que não acontece, e por isso capacidade crítica não
    estreia em id novo.
15. Resposta inaproveitável não é cacheada. Conteúdo fora da rede declara o instante.
16. Servidor não supõe cliente atualizado; cliente não supõe manifesto atualizado. Os dois falham
    fechados.
17. Sem termo de vertical em id de bloco, nome de eixo, nome de papel ou nome de slot.

---

## 6. Lacunas — o que este arquivo não fecha

| # | O que falta | Dono | Impacto se não fechar |
|---|---|---|---|
| V-01 | **FECHADA** em 2026-08-23 → §1.5. A escala de espaçamento virou `spacing.`; `space.` ficou com os quatro espaços de desenho, e a **regra de formação** de quatro cláusulas passou a governar prefixo novo. Fora do meu território e ainda com a grafia antiga: `memory/plataforma/state-sessao-2026-08-22-tres-fichas-abertas.md:307` (dono: `orquestrador`) | — | — |
| V-02 | **Nome dos campos do nó** do manifesto — inclusive o que carrega **criticidade** (§2.1), sem o qual a densidade não se resolve. É contrato de manifesto | `backend` | cliente sem como distinguir `eyes-free` de `standard`; nome inventado em dois lugares |
| V-03 | O cliente **anuncia** ao servidor a versão de vocabulário que entende? O cliente tem de funcionar sem anunciar (falha fechado), mas sem isso o servidor só pode ser conservador | `backend` (+ `seguranca`, se virar identificação de terminal) | ou o servidor é conservador para sempre, ou publica id que alguém não entende |
| V-04 | **Política de estreia de id em caminho crítico** (`tolerancia-de-versao.md` §4.3, item 4): como se garante que os terminais entendem antes de o servidor emitir | `backend` + humano | ação crítica ausente num terminal e presente no vizinho, sem nada acusar |
| V-05 | **O piso embutido vende?** Se sim, ele é uma composição fixa de papéis desta semente, e essa composição é contrato (`PN-06`). Terminal novo, sem cache e sem rede, é o caso concreto | `produto` + humano | ou o piso é uma tela que só informa, ou é um fluxo de venda — e isso muda o que o cliente embarca |
| V-06 | **De onde vem o espaço**: configuração do próprio cliente ou registro do terminal no servidor (§2.1). Certo em qualquer caso: nunca de largura de janela (`grade-e-espacos.md` lei 13) | `backend` + humano | terminal trocado passa a operar no espaço errado, com alvo e piso de texto errados |
| V-07 | **Se algum papel do §3.2 não cobre um trabalho real**, o acréscimo é decisão registrada, com o teste de §3.1 aplicado. A semente é insumo da Fase 3, não veredito sobre ela | `ui` + humano | ou o papel entra ad hoc no primeiro componente, ou a tela nasce com `if` estrutural |

# Matriz operação × papel — o contrato da célula

> **Irmão de `matriz-operacao-papel.md` e de `matriz-operacao-papel-modulos.md`, com o mesmo peso
> normativo.** O conjunto passou a ter **três** arquivos em 2026-08-23, partido em dois eixos: **núcleo ×
> módulo e vertical** (o eixo dos invariantes 2 e 3, que separou os dois primeiros) e **o contrato da
> célula × as células** (o eixo deste arquivo). Aqui: como se lê uma célula (`RN-NUC-026`), a decisão de
> autorização sem contato (`RN-NUC-027`), a contenção entre papéis (`RN-NUC-028`), o que "com registro"
> significa (`RN-NUC-029`), **quem vence quando a célula e a prosa discordam** (`RN-NUC-039`) e **o que
> se delega e o que não** (`RN-NUC-040`). Nas tabelas: a matriz do núcleo (`matriz-operacao-papel.md` §4)
> e a de módulo e vertical, mais o eixo de leitura e a contagem consolidada
> (`matriz-operacao-papel-modulos.md`).
>
> **Por que partiu.** `matriz-operacao-papel.md` chegou a 400 linhas e as correções da auditoria de
> 2026-08-23 (`AUT-02`, `AUT-08`) acrescentam regra, não encurtam. O corte é no eixo pelo qual os dois
> lados são lidos: quem vai **decidir uma célula** lê este arquivo uma vez; quem vai **consultar uma
> operação** lê a tabela. **Nenhuma célula foi alterada pela partição**, e as seções §1, §2 e §3 saíram do
> arquivo base com os números **vagos de propósito** — não foram reaproveitados lá, para não invalidar
> citação já feita (o mesmo precedente de `nucleo-venda.md`).
>
> **Numeração contínua e imutável** entre os três (`glossario.md` §4.2); toda regra é heading
> `### RN-NUC-nnn`, pelo contrato de busca de `nucleo-venda.md`. Este arquivo consome **`039` e `040`**;
> `LACUNA-NUC-035` nasce em `matriz-operacao-papel.md` §9.
>
> **O que não é.** Não é o modelo de papéis. Não é a lei de convergência: o **desfecho do fato** offline é
> de `operacao-offline-e-sincronizacao.md` §4 — aqui se decide **autorização**. Não é superfície, tela,
> tabela, endpoint nem stack.
>
> **Fronteira de D-03, ABERTA.** Declarar *quem pode o quê* e *o que acontece sem contato* é daqui.
> **Como** se prova identidade, sessão, token e SSO **não são**. **Nenhum número:** validade, teto, limite
> e prazo são lacuna com dono.

---

## 1. Como se lê uma célula

### RN-NUC-026 — O valor da célula é um de quatro, o default é negado, e negado por ausência de decisão é marcado como tal
**Enunciado** cada célula de operação × papel tem exatamente **um** de quatro valores: **permitido**;
**negado**; **permitido com autorização de outro papel** (nomeado); **permitido com registro de
auditoria** (`RN-NUC-029`). Os dois últimos combinam. **Negado é o default**: operação ausente da
matriz é negada a todos, e ausência de regra nunca é liberação (`RN-NUC-022`, `RN-OFF-008`). E a
cláusula que dá honestidade à matriz: célula negada **porque ninguém decidiu** leva sinal próprio
(`?`), com lacuna nomeada e dono — nunca é apresentada como decisão tomada.

| Sinal | Valor | Significado |
|---|---|---|
| `P` | permitido | o papel realiza a operação por si |
| `N` | negado | negado **por decisão**, com a regra que a sustenta em `Regida por` |
| `N·cfg` | negado | negado por default, e a configuração do cliente pode conceder (`RN-NUC-033`); concedida, herda o registro que a `RN` do módulo exige. **É negado**, não um quinto valor |
| `A:<papel>` | permitido com autorização de outro papel | o ato de autorizar é do autorizador, que é **outro sujeito**, e é registrado (`RN-NUC-022`); quem porta o papel autorizador pratica o ato pela célula do próprio papel (`RN-NUC-066`) |
| `R` | permitido com registro de auditoria | quem, quando, o quê — precondição do ato (`RN-NUC-029`) |
| `?` | negado | **negado porque ninguém decidiu.** Lacuna nomeada; falha fechado até ser decidida |

**Motivo** duas coisas se escondem atrás da mesma palavra. Negado **por decisão** é produto: alguém
pesou e fechou. Negado **por ausência** é dívida: ninguém pesou, e o sistema se comporta bem por
acidente. Sem o `?`, uma matriz cheia de `N` parece pronta, e o construtor implementa a dívida como se
fosse regra — é assim que comportamento entra inventado com aparência de conformidade.
**Aceite** contar as células `?` produz um número, e cada uma aponta para uma `LACUNA-NUC-<n>` com
dono; nenhuma célula fica vazia nem diz "depende"; e operação ausente das duas tabelas é negada aos
cinco papéis, sem exceção.
**Infeliz** a operação em disputa não existe como `RN` numerada → a linha **não entra**. Matriz não é
lugar de criar operação para ter onde pendurar papel; a ausência é lacuna do dono da operação.

### RN-NUC-027 — A decisão de autorização offline tem quatro valores, e "enfileirada" é proibida em toda a matriz
**Enunciado** para cada operação, a decisão de autorização com o terminal sem contato é exatamente um
de quatro, e nada além: **`recusa`**; **`retida`** — concedida por autoridade retida válida
(`RN-OFF-024`, `papeis-atribuicao-e-delegacao.md` §6); **`terminal+ident`** — concedida pela
**habilitação do terminal a vender** por aquele estabelecimento mais a **identificação** do operador
(`RN-OFF-032`, `RN-OFF-033`), que não é autoridade de pessoa e **não expira com a validade dela**; e
**`enfileirada`**, que é **proibida**: nenhuma célula a usa, porque autoridade **nunca** enfileira
(`RN-OFF-007`) e autoridade nova **não nasce no terminal** (`RN-NUC-007`, `RN-NUC-014`). Ela permanece
no vocabulário para que a proibição seja **verificável por busca**, não presumida. A coluna **não
concede** a quem a célula do papel nega: ela declara **como** a autorização se sustenta sem contato
para quem já a tem. Quatro cláusulas de leitura:
1. **Fato e autorização são coisas diferentes.** O fato pode enfileirar — sangria (`RN-NUC-011`) e
   venda (`RN-NUC-003`) enfileiram. A **decisão que os autorizou**, não.
2. **`retida` só vale onde o papel tem autoridade retida** (`papeis-atribuicao-e-delegacao.md` §6):
   `cashier` obrigatória, `manager` com validade, `fiscal_officer` parcial, `owner` **não tem**,
   `provider_support` **nunca**. Logo nenhuma célula `retida` alcança `owner` ou `provider_support`, e
   a coluna, quando diz `retida`, carrega o valor dos outros três. Isso os exclui de `retida` — **não**
   do quarto valor.
3. **`terminal+ident` é o valor do ato ordinário, e a coluna é a definição dele.** Ele vale para os
   quatro papéis de cliente, porque não depende de autoridade de pessoa: quem porta **apenas** `owner`
   pratica ato ordinário sem contato, sem atribuição nenhuma. `provider_support` está fora — não opera
   sem contato em hipótese alguma (`RN-NUC-024`, `RN-OFF-033`), e toda célula offline dele é `recusa`.
   Buscar `terminal+ident` na coluna devolve **exatamente** o conjunto de linhas que `RN-OFF-032`
   chama de ato ordinário: o conjunto é **fechado pela coluna**, e a prosa da regra dona aponta para
   ela, nunca o contrário (`RN-NUC-039`).
4. **Contenção não gera autoridade retida** (`RN-NUC-028`). É por isso que o dono do negócio de uma
   pessoa só precisa da atribuição de `cashier` ou `manager` para praticar **operação sensível** sem
   contato: como `owner` ele autoriza, mas não retém. O **ato ordinário** ele pratica sem atribuição
   nenhuma, pela cláusula 3.

**Motivo** quem lê "operação sensível degradada com pendência" conclui naturalmente que o pedido de
autorização também espera na fila: é o mais simples de escrever, e o fato ao lado realmente espera.
Nomear o valor e proibi-lo custa uma linha; descobrir autorização enfileirada em produção custa a
fraude que `RN-OFF-007` existe para impedir — autorizar sem autorizador e conferir quando o dinheiro
já saiu. **O quarto valor entrou em 2026-08-23, por `AUT-14`, e ele não é ornamento de vocabulário:**
`RN-OFF-032` declarou que o ato ordinário não se sustenta em autoridade retida, mas as linhas dele
continuaram com `retida` na coluna — e, por `RN-NUC-039`, a célula vence a prosa **inclusive contra a
regra dona**. O desfecho era `RN-OFF-032` **inerte exatamente nas operações que ela existe para
liberar**: o implementador que segue a célula volta a parar o balcão ao vencer a validade, contra
`PN-01`. Regra que só vale se alguém preferir a prosa à célula não vale: por isso a correção é na
coluna, e por isso ela é verificável por busca, do mesmo jeito que foi a busca pela célula que
encontrou o defeito.
**Aceite** buscar `enfileirada` nas duas tabelas devolve **zero** ocorrências em coluna de célula;
toda célula de `provider_support` é `recusa` offline; nenhuma célula `retida` pertence a papel sem
autoridade retida declarada; e o conjunto de linhas com `terminal+ident` é **exatamente** o que
`RN-OFF-032` enumera — divergência entre os dois é defeito, e quem tem razão é a coluna
(`RN-NUC-039`).
**Infeliz** uma operação parece exigir autorização enfileirada para não parar o caixa. Necessidade
preservada: liberar exceção na hora, sem contato. Mecanismo recusado: o pedido esperando na fila — ele
autoriza depois do dinheiro. Mecanismo nosso: **exceção nomeada, publicada antes, finita e contada**
(`RN-OFF-025`), que é artefato e não decisão local, mais o caminho que não exige o papel (`RN-OFF-007`,
infeliz). Melhor em três coisas verificáveis: é finita, é contada, e não nasce offline.

---

## 2. Contenção — o que o modelo de papéis usou e nunca declarou

### RN-NUC-028 — A contenção entre papéis é declarada, não inferida; não cruza escopo, não alcança papel de módulo e não gera autoridade retida
**Enunciado** a contenção do núcleo é esta e só esta: **`cashier` ⊆ `manager` ⊆ `owner`** para
operações do núcleo; **`fiscal_officer` é ortogonal** — não contém nenhum e não é contido por nenhum,
inclusive não pelo `owner`; **`provider_support` está fora da rede** — nada o contém, ele não contém
nada, e alcança só o que a concessão nomeia (`RN-NUC-024`). Quatro limites: **(a)** não cruza escopo
(`RN-NUC-018`) — `owner` contém `manager` em cada estabelecimento **do próprio cliente**, e `manager`
de A não contém `cashier` de B; **(b)** não alcança papel de módulo (`RN-NUC-019`), e quem declara é a
spec do módulo ou a configuração do cliente (`RN-NUC-033`); **(c)** não inverte e não alcança
meta-autoridade que o papel contido não tem (`RN-NUC-023`); **(d)** não gera autoridade retida
(`RN-NUC-027`, cláusula 4). E **quando é atribuição que sustenta o ato**, o registro nomeia a
**atribuição mais estreita** que o autoriza — nas outras duas fontes de `RN-NUC-029` não há atribuição a
nomear, e o registro diz a fonte que houve.
**Motivo** o modelo de papéis já **usa** contenção em dois lugares e nunca a declarou: `RN-NUC-017`
diz literalmente que "tudo que ele faz um gerente também faz", e fala de operação exclusiva "entre os
papéis que **não o contêm**". Sem a declaração, metade da matriz é ilegível e cada leitor preenche o
buraco de um jeito — duas implementações incompatíveis a partir da mesma spec. A cláusula da atribuição
mais estreita existe porque trilha que diz `owner` em toda venda apaga a informação que ela existe para
dar: quem estava no balcão.
**Aceite** `manager` de A lança item, conclui venda e abre sessão sem atribuição de `cashier` →
autorizado, e a trilha nomeia `manager`; o mesmo `manager` tenta as quatro operações do aceite de
`RN-NUC-018` em B → negado; `owner` publica preço → autorizado; `fiscal_officer` publica preço →
negado; `owner` concede capacidade de assinar → **negado** (é de `fiscal_officer`, e a contenção não o
alcança); operador com `cashier` e `manager` no mesmo estabelecimento conclui venda → o registro nomeia
`cashier`.
**Infeliz** o dono do negócio de uma pessoa só está no balcão e o link cai. Como `owner` ele autoriza
tudo o que o `cashier` faz, mas **não retém autoridade** — então **operação sensível** ele não pratica
sem contato. **O balcão não para:** o ato ordinário (`RN-OFF-032`, coluna `terminal+ident`) não depende
de autoridade de pessoa, e ele vende, recebe, abre e fecha a própria sessão portando **apenas**
`owner`. O que a contenção não lhe dá continua sendo sangria, gaveta fora de venda, desconto acima do
limite e o resto do sensível: para isso o produto não dá autoridade retida ao `owner` — resolve com a
atribuição de `cashier` ou `manager` para a mesma pessoa (`RN-NUC-020`), que é o que `RN-NUC-019`,
infeliz, já mandava fazer. Isso é declarado na habilitação, não descoberto no pico. **Corrigido em
2026-08-23** (`AUT-14`): até então esta cláusula dizia "sem contato, não opera", que virou falso quando
`RN-OFF-032` entrou.

---

## 3. O que "com registro" significa

### RN-NUC-029 — Registro de auditoria é precondição do ato, não subproduto dele
**Enunciado** célula `R` significa que o ato **não acontece** sem registro. O registro tem: quem — o
operador **e em que o ato se sustentou**, que é exatamente **uma de três** fontes e nunca "nenhuma":
**(1) atribuição**, para papel de cliente que alcança a operação pelo próprio papel; **(2) concessão**,
para `provider_support`, que porta concessão e não atribuição (`RN-NUC-024` d); **(3) identificação
retida mais habilitação do terminal a vender** (`RN-OFF-033`, `RN-OFF-032`i), que é o que sustenta o
**ato ordinário** sem contato — a coluna `terminal+ident` (`RN-NUC-027`, cláusula 3), onde não há
atribuição nenhuma a nomear. Quando a fonte é (3) **e** a operação aplica limite publicado (linha 6,
`RN-NUC-006`), o registro diz também **qual teto** foi aplicado — o do **papel-piso** (`RN-OFF-032`,
cláusula do teto) —, para que a trilha distinga esse ato do mesmo desconto autorizado por atribuição de
`manager`, cujo teto publicado é maior. Mais: quando (instante do fato — `RN-OFF-019`), o quê (operação,
objeto e estabelecimento) e o **motivo** onde a `RN` da operação o exige. Nasce **no terminal, junto com
o fato**, offline inclusive, é append-only
(`PN-07`) e viaja com o fato — nunca como item separado que pode se perder. Ato de autorização de outro
papel gera registro **do autorizador** (`RN-NUC-022`), além do registro do requerente. **Quem pode
ler** o registro é outra operação, e não está decidida (`LACUNA-NUC-017`, arquivo irmão) — com a única
exceção declarada da **leitura derivada** de `RN-NUC-035`, que alcança campo nomeado do objeto de uma
operação autorizada e nunca a trilha como lista.
**Motivo** as seis operações que `.claude/rules/seguranca.md` §2 nomeia — cancelar venda, abrir gaveta,
desconto acima do limite, sangria, reimpressão fiscal, fechar caixa — têm a trilha como **única**
defesa: nenhuma é reversível e todas movem dinheiro ou documento. Registro tratado como subproduto se
perde no caminho mais barato, o offline: grava o fato, perde a trilha, e a perda só aparece quando
alguém procura o autor de um desvio. A cláusula da **concessão** entrou em 2026-08-23 (`AUT-10`): sem
ela, o ato de `provider_support` cabia no registro sem dizer **qual** concessão o autorizou — que é
exatamente o que o cliente precisa para conferir que o ato ficou dentro do escopo nomeado. **A terceira
fonte entrou no mesmo dia, por `AUT-15`, e por defeito simétrico:** com duas fontes só, o ato ordinário
sem contato — que se pratica **sem atribuição nenhuma** (`RN-NUC-027`, cláusula 3) — não tinha valor
possível para o campo, e os dois desfechos eram defeito. **Falha fechado:** registro impossível impede o
ato, e as linhas 6, 10 e 12 voltavam a ser recusadas ao vencer a validade — inclusive abrir sessão de
caixa, que é o defeito contra `PN-01` que `AUT-14` acabara de remover. **Falha aberto na trilha:** o campo
recebia a única atribuição que o operador porta, e o desconto ao teto do **papel-piso** aparecia
autorizado pela atribuição de `manager` — piso e teto de gerente indistinguíveis, e a cláusula do teto
inverificável a partir da trilha. O campo não pergunta "quem autorizou", pergunta **em que o ato se
sustentou**: é isso que torna as três respostas dizíveis sem que nenhuma minta.
**Aceite** com o link cortado, praticar as seis operações sensíveis com autoridade retida válida: seis
fatos **e** seis registros no terminal; ao drenar, cada ato aparece uma vez, com autor, atribuição e
instante do fato; nenhum ato sem registro, nenhum registro sem ato. Impedir a gravação do registro
impede o ato, e a recusa diz isso. **Para `provider_support`:** cada ato praticado sob concessão aparece
com a concessão nomeada, e ato cuja concessão não é identificável é ato **sem registro** — logo não
acontece. **Para o ato ordinário sem contato (`AUT-15`):** link caído desde 20h, validade da autoridade
retida vencida às 21h00, e às 21h01 **abrir a própria sessão de caixa acontece** (linha 10) — o registro
existe e diz que o ato se sustentou em **identificação retida mais habilitação do terminal**, nunca em
atribuição e nunca em "nenhuma". No mesmo minuto, o desconto até o teto do **papel-piso** (linha 6)
registra a fonte (3) **e** o teto aplicado, e é **distinguível na trilha** do mesmo desconto praticado por
quem porta atribuição de `manager`, que registra a fonte (1) e o teto daquele papel. Trilha em que os dois
casos aparecem iguais é defeito, e trilha em que o primeiro impede o ato é o defeito oposto.
**Infeliz** o recurso local está no limite e o registro não pode ser gravado (`RN-OFF-015`) → o ato é
**recusado antes de acontecer**, nunca praticado sem trilha — o mesmo desfecho de `RN-NUC-011`, infeliz
(a): o produto não oferece registrar "sem autor".

---

## 4. Quem vence quando a célula e a prosa discordam

### RN-NUC-039 — A célula é a autoridade única sobre autorização, e prevalece sobre papel nomeado em prosa em qualquer `RN`
**Enunciado** sobre **autorização**, a célula das duas matrizes é a autoridade única. Onde a célula e o
texto de qualquer outra `RN` discordarem sobre **quem pode praticar** uma operação, **vence a célula** —
inclusive quando a `RN` discordante é a **dona** da operação e nomeia um papel em prosa. Papel nomeado em
prosa é **indicação de candidato**, nunca concessão: ele só vale depois de existir como célula. Três
consequências: **(a)** operação sem linha nas duas matrizes é negada a todos (`RN-NUC-026`), e nenhuma
prosa a concede; **(b)** a célula é o **teto** — concessão de `provider_support` (`RN-NUC-024`) só
**estreita** dentro dela, e configuração do cliente (`RN-NUC-033`) só concede onde a célula é `N·cfg`;
**(c)** quem escreve `RN` que nomeia papel **cita a linha e o valor da célula**, ou marca a lacuna — a
prosa não é lugar de decidir autorização.
**Motivo** é o achado `AUT-08` de 2026-08-23, e ele desmonta a garantia central das duas matrizes:
`RN-EMI-039` **concedia afirmativamente** a consolidação entre estabelecimentos do mesmo cliente
apontando para `RN-EMI-036` — a regra de `fiscal_officer`, papel de escopo **estabelecimento** —
enquanto a célula da operação correspondente nega por omissão (`?`, `LACUNA-NUC-019`). Um implementador
que parta do módulo fiscal constrói a consolidação e **nunca lê a célula**, e o desfecho é o vazamento
entre pessoas jurídicas de um mesmo cliente que `RN-NUC-018`, motivo, diz que nenhuma defesa de
isolamento por cliente pega. Sem precedência declarada, "negado por omissão" só é falha-fechado *desde
que ninguém tenha concedido em outro arquivo* — e isso é promessa que não se verifica por busca. Com a
precedência, verifica-se: a busca é pela célula, e é finita.
**Aceite** `fiscal_officer` do estabelecimento 9 executa a "consolidação declarada" de `RN-EMI-039` (que
até 2026-08-23 a autorizava em prosa) → **negado**, com a recusa citando a célula (`?`,
`LACUNA-NUC-019`) e não a prosa, e com a resposta que não revela existência (`RN-EMI-039`, aceite). O
texto de `RN-EMI-039` foi corrigido na mesma data e passou a **marcar a lacuna**; o aceite continua
valendo, porque ele testa a **recusa**, não a redação. Segundo aceite, de conformidade:
varrer as `RN` do repositório por papel nomeado em prosa devolve uma lista finita, e cada item dela
aponta para uma célula existente **ou** é lacuna nomeada — nenhum item é implementável pela prosa.
**Infeliz** a prosa da `RN` dona é a decisão **certa** e a célula está errada ou ausente → a correção é
**criar ou mudar a célula**, no arquivo dono da matriz, por quem possui a lacuna; nunca implementar pela
prosa "porque a intenção era clara". Enquanto a célula não muda, a capacidade **não existe**, e isso é
dívida declarada — não desfecho aprovado.
**Offline** não altera nada: precedência é sobre autorização, e a coluna `Offline` é parte da célula
(`RN-NUC-027`).

---

## 5. O que se delega, e o que não se delega

### RN-NUC-040 — A unidade de delegação é a linha; cinco linhas não são delegáveis; e o piso do "não amplia a si mesmo" tem ponto de aplicação declarado
**Enunciado** três cláusulas.
**(a) A unidade de delegação é a linha da matriz.** O "subconjunto nomeado" de `RN-NUC-021` se nomeia
por **linha** — a única unidade enumerável do modelo (`RN-NUC-026`) —, nunca por descrição livre;
delegar uma linha delega aquela operação inteira, com o valor da célula do delegante, e nada além dela.
**(b) Cinco linhas não são delegáveis**, e a lista é **fechada** (entrada por alteração desta regra):
**19** publicar o que cada papel autoriza · **36** publicar limite de desconto e de acréscimo por papel ·
**37** publicar meio de pagamento habilitado e a marca "exige autorização de terceiro" · **38** publicar
moeda, fuso e precisão do estabelecimento · **39** publicar exceção nomeada pré-autorizada
(`RN-OFF-025`). O que as cinco têm em comum é o objeto: elas publicam a **trava**, não o que o negócio
vende. E a trava tem **duas famílias**: a da **autoridade** (19, 36, 37, 39 — quem pode o quê, e até
quanto) e a da **aritmética e da fronteira do dia** (38 — em que moeda, com que precisão e
arredondamento o valor é composto, e a que dia o fato pertence). **A 38 entrou na lista em 2026-08-23,
por `AUT-13`:** ela estava rotulada delegável junto com catálogo e preço, e reprovava o critério que
esta própria regra escreve. Precisão e arredondamento decidem **quanto** o cliente-final paga em cada
venda, sem aparecer em nenhum preço publicado; fuso decide **a que dia** a venda pertence, e com isso o
número que fecha o dia (`RN-NUC-031`) e o que o contador recebe. Quem as move não muda o que o negócio
vende: muda a conta.
**(c) Ponto de aplicação do piso** de `RN-NUC-023` ("nenhum papel amplia a si mesmo"): autoridade de
publicar recebida **por delegação** nunca alcança papel que o delegatário porta — atribuição, contenção
(`RN-NUC-028`) e outra delegação inclusas. Quem porta a meta-autoridade **por atribuição** segue
`RN-NUC-023` como está: o `owner` não amplia o **próprio** papel, e publica o que os papéis abaixo
autorizam **inclusive quando ele também os porta** — é o negócio dele, e é o caso da operação de uma
pessoa só (`RN-NUC-019`, infeliz). Atribuir papel a **outra** pessoa não é ampliar a si mesmo, e segue a
linha 20.
**Motivo** é o achado `AUT-02` de 2026-08-23. A linha 18 publicava, num **único ato delegável**, catálogo
e preço — que `papeis-e-permissoes.md` §4.3 chama de delegação legítima, "o funcionário de escritório que
mantém catálogo e preço" — junto com a **marca** que faz `RN-NUC-005` recusar sozinho e o **limite por
papel**. Delegar o trabalho de retaguarda entregava a trava. **Necessidade legítima preservada:** o dono
não pode ser o único a manter parâmetro operacional, e delegar retaguarda é o que `PN-20` e a §4.3 pedem.
**Mecanismo recusado:** delegar o **pacote** — quem o recebe publica "cartão não exige autorização de
terceiro" e a venda passa a concluir como paga sem resultado de captura, offline inclusive, com a
divergência aparecendo só na conciliação com o adquirente; ou publica limite de `cashier` sem teto e
aplica desconto ilimitado como **aplicação** (`RN-NUC-006`), sem nunca acionar `RN-NUC-007`.
**Mecanismo nosso:** a linha partida (§4 do arquivo base) mais esta regra — o pacote de retaguarda
(**catálogo e preço**) segue delegável; a trava fica com quem responde pelo negócio.
**Por que é melhor, e como se prova:** ele fecha os dois caminhos **sem** custar o trabalho diário — o
aceite abaixo exige que o delegatário conclua a retaguarda inteira de ponta a ponta sem tocar em 36, 37,
38 ou 39; e o piso, que antes tinha um único aceite escrito (o caso direto, "`manager` amplia o próprio
limite"), passa a ter ponto de aplicação verificável sob delegação.
**Aceite** três casos concretos. **(1)** `owner` delega a X a linha 18: X publica catálogo e preço pelo
expediente inteiro, com item novo, mudança de preço e vigência futura; X tenta publicar a marca de
exigência (37), o limite por papel (36) ou a precisão do estabelecimento (38) → **negado**, com o motivo
"linha não delegável", e a tentativa na trilha. O teste que prova que a retaguarda não foi quebrada é o
primeiro: nenhuma das três negações aparece no caminho de publicar catálogo e preço. **(2)** `owner`
delega a X a linha 20 e X, que porta `cashier`, tenta usar essa autoridade para publicar o limite do
`cashier` → negado por (b) **e** por (c), e a mensagem nomeia qual das duas o barrou. **(3)** o dono da
padaria, que porta `owner` e `cashier`, publica o limite de desconto do `cashier` → **autorizado**, com
autor, versão e vigência (`RN-NUC-013`) — a cláusula (c) não o alcança, porque a autoridade dele não veio
de delegação.
**Infeliz** o cliente precisa que alguém que não é o `owner` mantenha a tabela de alçadas. Não se resolve
por delegação e não se resolve em silêncio: ou é **atribuição** de um papel que já porta a linha 19/36
(`RN-NUC-020`), ou é conflito entre a regra geral e a vontade de um cliente, registrado como tal com o
custo declarado (`RN-NUC-023`, infeliz). Desde 2026-08-23, **`RN-NUC-023` carrega esta cláusula no
próprio texto**, como cláusula **(d)** dela, com os dois casos de aceite — esta regra e a regra dona do
papel dizem a mesma coisa, e a divergência de `matriz-operacao-papel.md` §7 está fechada nos dois lados.
**Offline** delegação não nasce, não muda e não se renova sem contato (`RN-NUC-021`, offline;
`RN-OFF-007`), e as **cinco** linhas não delegáveis são **recusa** offline por regra própria
(`RN-NUC-014`).

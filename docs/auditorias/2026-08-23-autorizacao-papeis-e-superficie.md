# Auditoria — autorização, papéis, delegação, matriz e superfície por papel

**Data:** 2026-08-23 · **Escopo:** T-0003, passo 4 (gate 3) · **Agent:** `seguranca` · **Read-only.**

> **Segunda rodada em arquivo irmão:** `2026-08-23-autorizacao-papeis-e-superficie-2-reverificacao.md`
> confere as correções e traz `AUT-12` a `AUT-14`. Divisão por **rodada**, porque este está no teto.

**Objeto auditado — spec, não código.** Em `docs/produto/`: `papeis-e-permissoes.md`,
`papeis-atribuicao-e-delegacao.md`, as duas matrizes, os dois de superfície,
`operacao-offline-e-sincronizacao.md`, `fila-local-conteudo-e-repouso.md` (`RN-OFF-021` a `027`), os
três do núcleo, e `fiscal-custodia-e-trilha.md` (`RN-EMI-007`, `033`, `035` a `040`) onde a matriz de
módulos aponta.

**Não existe código de produto.** "Um implementador faria X" significa que X satisfaz integralmente a
regra dona e nenhuma outra o proíbe. Prefixo `AUT-nn`; não uso `C-nn`, que colide com `C-01`..`C-10`.

**Nenhum achado CRÍTICO.** Nenhum caminho de spec alcança dado de **outro cliente** (§1); nenhum
segredo no repositório (varredura em `docs/**` e `memory/**` em 2026-08-23, zero); a fraude de `AUT-02`
opera sobre artefato que o cliente publica sobre si mesmo. Inflar custaria a leitura dos seis `ALTO`.

---

## 1. Prioridade um — existe caminho em que um cliente vê dado de outro?

**Resposta: não encontrei nenhum, na spec auditada.** As cinco perguntas, uma a uma:

1. **Consulta que alcança schema de outro cliente.** Não há. `RN-EMI-040` põe o consolidado
   cross-cliente **fora** do escopo de qualquer cliente e proíbe que consulta feita no escopo de um
   atravesse; `RN-NUC-024` nega a `provider_support` alcançá-lo e proíbe uma concessão cobrir mais de
   um cliente.
2. **Tenant vindo de algo que o chamador controla.** Coberto, e é o ponto mais forte do conjunto:
   `RN-NUC-018` avalia autorização contra o escopo do **objeto**, "nunca contra o escopo declarado por
   quem pede"; `RN-OFF-026` e `RN-EMI-039` repetem a cláusula para fila e para documento, nomeando
   "identidade autenticada + registro da plataforma" como única fonte.
3. **Operação que aceita tenant ausente e cai em default.** Não há. `RN-NUC-018`, infeliz: sem
   estabelecimento resolvido **não há autorização**, e a recusa é incidente, não erro de campo.
4. **Id de recurso validado contra o tenant (IDOR).** **Aqui está o furo, e ele é de escopo
   intra-cliente, não cross-cliente:** a frase que `RN-EMI-039` escreveu para documento e `RN-OFF-026`
   para fila **não existe** para o objeto mais usado do núcleo — a venda localizada por **referência
   humana**, que `RN-NUC-003` declara única **só no escopo do estabelecimento**. `AUT-01`. E
   `AUT-08` é o caso em que uma regra dona **concede afirmativamente** a travessia entre
   estabelecimentos do mesmo cliente.
5. **Canal lateral — cache, fila, log, temporário, exportação, relatório consolidado.**
   - *Snapshot de manifesto:* `superficie-por-papel.md` §4.3 exige `cliente` **e** `estabelecimento` na
     chave, nomeando "chave sem ele é vazamento dentro de um cliente". Correto. Falta a **concessão**
     para `provider_support` (§3, N5).
   - *Fila local:* `RN-OFF-023` item 7 proíbe dado ou identificador de outro estabelecimento ou
     cliente, e o aceite estende a proibição a registro de erro, cópia de apoio e exportação de
     diagnóstico. Coberto.
   - *Exportação/relatório:* `RN-EMI-039` escopa; `RN-EMI-040` fecha o cross-cliente por agregado,
     nomeando que "quantas habilitações cabem nesta UF" responde "quantos concorrentes já estão aqui".
   - *Log:* nenhuma regra do escopo auditado trata log de autorização. Não é achado (não há código
     nem contrato de log); é `§5`.

**A leitura que importa:** o isolamento **entre clientes** está bem sustentado. O frouxo é o
isolamento **entre estabelecimentos do mesmo cliente** — que `RN-NUC-018` já identifica como
"vazamento que nenhuma das defesas de isolamento por cliente pega", e que `AUT-01` e `AUT-08`
alcançam.

---

## 2. Achados

### AUT-01 — Venda localizada por referência humana não tem regra de resolução escopada, e a referência é única só por estabelecimento — [ALTO]
**ONDE:** `docs/produto/nucleo-venda.md:141` (`RN-NUC-003`), `:263` (`RN-NUC-008`, precondição);
`docs/produto/matriz-operacao-papel.md:296` (`RN-NUC-032`) e `:173` (linha 17). Contraste:
`docs/produto/fiscal-custodia-e-trilha.md:263` (`RN-EMI-039`) e
`docs/produto/fila-local-conteudo-e-repouso.md:158` (`RN-OFF-026`).
**CENÁRIO:** `cashier` autenticado no estabelecimento A digita `000123` para reapresentar a via
(linha 17, `R`). A mesma referência existe no estabelecimento B do mesmo cliente — outra pessoa
jurídica. A busca por referência humana não tem regra que a escope, então dois desfechos, ambos
ruins: **(a)** resolve a venda de B e a entrega — itens, valor e, onde a entrega exigiu,
identificação do comprador (`RN-EMI-017`); **(b)** resolve B, a autorização nega pelo escopo do
objeto (`RN-NUC-018`), e o operador de A **não consegue reapresentar a via da própria venda**. O
mesmo vale para `RN-NUC-008` (cancelar/devolver), cuja precondição é literalmente "localizável pela
referência humana".
**POR QUE É REAL:** a cláusula de resolução escopada foi escrita **duas vezes**, para documento
(`RN-EMI-039`) e para fila (`RN-OFF-026`) — logo o conjunto sabe que ela é necessária — e não existe
para venda e pagamento. E a colisão não é exceção: `RN-NUC-003` declara unicidade **por
estabelecimento** de propósito, e `LACUNA-NUC-003` deixa grão e reinício em aberto.
**CORREÇÃO SUGERIDA:** venda e pagamento são resolvidos **dentro** do escopo resolvido da identidade
autenticada — nunca resolvidos primeiro e checados depois — dono: `produto`.

### AUT-02 — A linha 18 publica, num único ato delegável, a marca "exige autorização de terceiro" e o limite por papel — [ALTO]
**ONDE:** `docs/produto/matriz-operacao-papel.md:174` (linha 18);
`docs/produto/nucleo-publicacao-e-texto.md:44-48` (`RN-NUC-013`, artefatos);
`docs/produto/papeis-atribuicao-e-delegacao.md:88` (`RN-NUC-021`); `:148` (`RN-NUC-023`, o piso);
`docs/produto/papeis-e-permissoes.md:230` (§4.3, que **endossa** delegar catálogo e preço).
**CENÁRIO (metade forte, não mitigada por nenhuma cláusula):** `owner` delega a X a linha 18 — o caso
que §4.3 chama de legítimo ("o funcionário de escritório que mantém catálogo e preço"). A linha 18
carrega, na mesma célula, **"meio de pagamento"**, e `RN-NUC-013` define esse artefato como "meios
habilitados **e quais exigem autorização de terceiro**". X publica a versão em que cartão **não**
exige autorização de terceiro. `RN-NUC-005` deixa de recusar: sua precondição é exatamente a marca
publicada — "é isso que permite ao terminal recusar sozinho, sem perguntar a ninguém". A partir daí a
venda **conclui como paga** sem resultado de autorização, inclusive offline (`RN-NUC-013` é classe 1,
integral em D1/D2/D3). Fraude de insider: "pagar" venda de valor alto com cartão que nunca é
capturado; a divergência só aparece na conciliação com o adquirente. Nenhuma cláusula do piso de
`RN-NUC-023` toca isso — mudar a marca não amplia a autoridade de papel nenhum.
**CENÁRIO (metade fraca, mitigada mas com ponto de aplicação indefinido):** a mesma linha 18 carrega
**"limite"**, e `RN-NUC-013` o define como "limite de desconto e de acréscimo **por papel**". X, que
também porta `cashier`, publica limite de `cashier` sem teto e passa a aplicar desconto ilimitado como
`RN-NUC-006` ("aplicação, não decisão"), offline incluído, sem nunca acionar `RN-NUC-007`. O piso de
`RN-NUC-023` ("nenhum papel amplia a si mesmo") **fecha** isso — mas só se o "a si mesmo" for avaliado
contra **todo papel que o ator porta, delegação inclusa**, e o único aceite escrito é o caso direto
("`manager` tenta ampliar o próprio limite"). O ponto de aplicação do piso sob delegação não está
declarado.
**POR QUE É REAL:** `RN-NUC-021` autoriza "subconjunto nomeado" e não declara a granularidade do
nome; a única unidade enumerável do modelo é a célula (`RN-NUC-026`), então a unidade natural de
delegação é a **linha** — e a linha 18 é um pacote de artefatos de consequências incomparáveis.
**CORREÇÃO SUGERIDA:** partir a linha 18; a marca "exige autorização de terceiro" deixa de ser
artefato publicável pelo cliente e passa ao módulo dono do meio (`ADQ`/`PGO`/`PRZ`); e declarar que o
piso de `RN-NUC-023` é avaliado contra todo papel que o ator porta, delegação inclusa — dono:
`produto`. Entrada direta de `LACUNA-NUC-013` (§4).

### AUT-03 — Delegação não morre com a atribuição do delegante, e "prazo não maior que o do delegante" não tem referente — [ALTO]
**ONDE:** `docs/produto/papeis-atribuicao-e-delegacao.md:88-91` (`RN-NUC-021`), `:26` (§1: atribuição
"sem versão e sem vigência"), `:151` (`RN-NUC-023` b).
**CENÁRIO:** `manager` M delega a `cashier` C a linha 8 ("autorizar o excesso pedido por outro"), com
prazo declarado de 90 dias — permitido, e é literalmente o aceite de `RN-NUC-021`. No dia 10 M é
demitido e `owner` revoga a atribuição de M. Nada na spec faz a delegação morrer com a atribuição de
origem: C continua autorizando excesso por 80 dias, com autoridade derivada de quem não a tem mais. É
o "gerente demitido às 19h" que `RN-OFF-024` foi escrita para fechar, reinstalado **um salto adiante**
— e `RN-OFF-024` não o pega, porque ela governa retenção e validade no terminal, não a sobrevivência
da delegação à sua fonte.
**POR QUE É REAL:** o limite que `RN-NUC-021` promete ("prazo não maior que o da própria atribuição")
não tem referente: §1 do mesmo arquivo declara que atribuição **não tem vigência**. O único prazo
existente é o declarado no ato de delegar, sem teto. O motivo da regra afirma uma proteção
("prazo limitado impede a delegação que ninguém revoga") que o enunciado não entrega.
**CORREÇÃO SUGERIDA:** revogar atribuição revoga em cascata as delegações concedidas por ela, e a
delegação passa a ter teto próprio (número é do humano) — dono: `produto`.

### AUT-04 — "Recusada até reautenticar" continua nos arquivos donos; com D-03 aberta, a leitura permissiva renova autoridade sem contato — [ALTO] · *divergência já declarada, não corrigida*
**ONDE:** `docs/produto/fila-local-conteudo-e-repouso.md:115-117` (`RN-OFF-024` b e d);
`docs/produto/nucleo-caixa-e-turno.md:42` (`RN-NUC-009`, infeliz b) e `:90` (`RN-NUC-011`, infeliz a),
que **repetem "reautenticar"**. Declarada como divergência em
`papeis-atribuicao-e-delegacao.md:196` e `matriz-operacao-papel.md:337` (§7), e não corrigida em nenhum
arquivo dono.
**CENÁRIO:** `manager` demitido às 19h, atribuição revogada; validade da autoridade retida vence às
20h; terminal em D1. **D-03 está ABERTA**, então nada na spec proíbe que "reautenticar" seja
implementado como conferência local de PIN. O ex-gerente reautentica às 20h05, ganha janela nova e
registra sangria (linha 14, `retida`): o dinheiro sai da gaveta com autoridade revogada, e
`RN-NUC-011`, infeliz (c), só **escala** o fato na reconexão — nunca o desfaz (`PN-07`).
**POR QUE É REAL:** três arquivos donos prometem, em texto normativo, um caminho ("reautenticar") que
a leitura adotada pela matriz declara impossível. Enquanto os donos não mudam, o implementador tem
uma frase explícita autorizando o que a matriz supôs proibido — e a decisão que resolveria a
ambiguidade é justamente a que está em aberto.
**CORREÇÃO SUGERIDA:** trocar (b) por "recusada até **reconectar**" em `RN-OFF-024` e retirar
"reautenticar" de `RN-NUC-009` infeliz (b) e `RN-NUC-011` infeliz (a) — dono: `produto`. Se
reautenticação sem contato **for** possível, é `BLOQUEIO` de **D-03**, não escolha de implementação.

### AUT-05 — A origem (i) de `RN-NUC-035` é canal de leitura sem célula, e cobre exatamente o dado das 12 células `?` — [ALTO]
**ONDE:** `docs/produto/superficie-por-papel.md:68-74` (`RN-NUC-035`);
`docs/produto/superficie-por-papel-momentos.md:110` (linha 13), `:123` (linha 30), `:125` (linha 34);
`docs/produto/matriz-operacao-papel-modulos.md:150-155` (as 4 linhas de leitura, 12 `?`).
**CENÁRIO:** `manager` fecha a sessão de `cashier` A (linha 13, `R`). A informação exigida — "de quem
era a sessão, o esperado, o contado informado e a diferença" — está marcada **origem (i)**, "objeto da
própria operação", que por `RN-NUC-035` **não exige linha de leitura**. Só que o objeto é o registro
de trabalho de outra pessoa. Generaliza pior na linha 30 (transferir fila): origem (i) entrega "o que
exatamente vai transferido", isto é, o conteúdo da fila — que por `RN-OFF-023` item 3 inclui o que
comprova recebimento de pagamento e pode incluir identificação do comprador (item 4) e texto de
terceiro (`RN-OFF-027`, que proíbe tratá-lo como isento de dado de pessoa). É precisamente o dado
cuja leitura `LACUNA-NUC-018` diz que **ninguém** decidiu autorizar.
**POR QUE É REAL:** é a resposta à pergunta da frente 1. As 12 células `?` de leitura **não são
falha-fechado**: o mesmo dado é alcançável renomeado como "objeto da própria operação", por operações
cujas células são `P`/`R`. `superficie-por-papel-momentos.md:130` já registra o desconforto no caso do
texto de terceiro ("ele é o dono da lista e pode não estar autorizado a ler parte do conteúdo dela")
e resolve **não liberando** — mas a regra que governa a origem (i) libera.
**CORREÇÃO SUGERIDA:** origem (i) vale só para o objeto que o próprio ator criou ou porta; registro de
trabalho de outro operador e conteúdo de item de fila são origem (iii) e exigem célula — dono:
`produto`.

### AUT-06 — As três negações de `RN-NUC-036` não têm canal num manifesto que omite nó — [MÉDIO]
**ONDE:** `docs/produto/superficie-por-papel.md:87-106` (`RN-NUC-036`), `:176` (§4 item 5: "célula `?`
nunca é oferecida"), `:58` (`RN-NUC-034`, infeliz: o manifesto não enumera o que o papel não alcança);
`.claude/rules/ui.md` ("ausência por autorização é ausência, não estado visual").
**CENÁRIO:** 6h da manhã, `manager` no posto, `cashier` ainda não chegou; ele precisa da linha 11
(`?`). §4 item 5 diz que `?` nunca é oferecida → não há nó no manifesto. `ui.md` proíbe desenhar
controle apagado → não há o que acionar. E `RN-NUC-036` exige que a terceira negação ("sem suporte de
decisão — caminho: nenhum hoje") seja **dita**. Não existe canal para dizê-la: o único jeito de
receber a terceira negação é forjar um pedido. O gerente vê ausência sem explicação e toma o contorno
que a própria spec teme — abre a sessão sob a identidade dele, ou pede a credencial de A (`PN-11`).
O mesmo vale para célula `N` simples: `RN-NUC-022` promete "negado não é fim, o produto diz quem
autoriza", mas sob um manifesto que omite nó essa promessa só se realiza nas células `A:<papel>`.
**POR QUE É REAL:** são três cláusulas do **mesmo conjunto** de arquivos exigindo coisas
incompatíveis, e o ponto onde elas se encontram é a composição do manifesto, que é Fase 3 — quem a
construir vai escolher uma e a escolha vira comportamento sem regra.
**CORREÇÃO SUGERIDA:** declarar quais negações são **ofertáveis** (o caminho `A:` e a resposta "sem
suporte" a um pedido explícito) e que a omissão é o desfecho de `N`, reconciliando `RN-NUC-034`
infeliz, `RN-NUC-036` e §4 item 5 — dono: `produto`, com consulta a `ui`.

### AUT-07 — "Abrir sessão em nome de outro" não é operação distinta na regra dona; a célula `?` da linha 11 não tem onde ser verificada — [ALTO]
**ONDE:** `docs/produto/matriz-operacao-papel.md:167` (linha 11, `?`), `:397` (`LACUNA-NUC-016`);
`docs/produto/nucleo-caixa-e-turno.md:26-45` (`RN-NUC-009`). Contraste: `RN-NUC-030`
(`matriz-operacao-papel.md:223`), que **criou** operação distinta para fechar sessão alheia.
**CENÁRIO:** `RN-NUC-009` diz que abrir sessão "registra **quem** assume" e em nenhum ponto declara
que *quem assume* é a identidade autenticada. Uma implementação com `quem assume` como campo de
entrada satisfaz `RN-NUC-009` integralmente e **nunca chega** à célula da linha 11. Então: `manager`
abre a sessão em nome de A antes de A chegar — exatamente a necessidade que `LACUNA-NUC-016` nomeia
—, vende, registra sangria (linha 14) e sai. O fundo e a diferença ficam atribuídos a A, que nunca
assumiu o posto, e a conferência de `RN-NUC-010`/`RN-NUC-030`, cuja razão de existir é a
responsabilidade pelo fundo (`RN-NUC-004`, motivo), aponta para a pessoa errada.
**POR QUE É REAL:** a distinção entre linha 10 e linha 11 existe **só na matriz**. A regra dona não a
tem, e o par simétrico (fechar a sessão de outro) foi promovido a operação própria justamente para
que houvesse onde verificar. Aqui não há. Não é CRÍTICO porque a linha 10 é `R` e o registro de
`RN-NUC-029` nomeia "operador **e** a atribuição que autorizou" — se ele gravar o autenticado, a
fraude é auditável; nada declara que os dois campos são distintos.
**CORREÇÃO SUGERIDA:** `RN-NUC-009` declara "quem assume = identidade autenticada", e abrir em nome de
outro é operação distinta, como `RN-NUC-030` fez para o fechamento — dono: `produto`. Responde a
metade de **papel** de `LACUNA-NUC-016` sem decidir o número.

### AUT-08 — `RN-EMI-039` concede a consolidação entre estabelecimentos a um papel de escopo estabelecimento; a matriz nega a mesma operação por omissão — [MÉDIO]
**ONDE:** `docs/produto/fiscal-custodia-e-trilha.md:266` ("Consolidar entre estabelecimentos **do
mesmo cliente** é ato declarado, com papel nomeado (`RN-EMI-036`)");
`docs/produto/matriz-operacao-papel-modulos.md:154` (célula `?`, `LACUNA-NUC-019`) e `:209`
(`LACUNA-NUC-019`: "**não é `fiscal_officer` por construção**"); `RN-NUC-018` (escopo de
`fiscal_officer` é **estabelecimento**).
**CENÁRIO:** `fiscal_officer` do estabelecimento 9 executa a "consolidação declarada" que
`RN-EMI-039` autoriza e recebe documentos dos estabelecimentos 1 a 8 do mesmo cliente — valor, itens
e, onde a entrega exigiu, identificação do comprador. Vazamento **dentro** de um cliente, entre
pessoas jurídicas distintas: exatamente o que `RN-NUC-018`, motivo, diz que nenhuma defesa de
isolamento por cliente pega.
**POR QUE É REAL:** `RN-EMI-039` é a regra **dona** da operação e concede afirmativamente, apontando
para `RN-EMI-036` — que é a regra de `fiscal_officer`. A negação está numa célula `?` de arquivo
**derivado**, e **nenhuma regra declara precedência** entre "papel nomeado em prosa na `RN` dona" e
"célula da matriz". Um implementador que parta do módulo fiscal constrói a consolidação e nunca lê a
célula. É a versão intra-cliente do risco que a frente 1 levanta: a ausência de célula só é
falha-fechado se a matriz for autoridade única sobre autorização — e isso não está escrito.
**CORREÇÃO SUGERIDA:** `RN-EMI-039` deixa de apontar `RN-EMI-036` e passa a apontar
`LACUNA-NUC-019`; e — sistêmico — a matriz declara que **a célula é a autoridade única sobre
autorização**, prevalecendo sobre papel nomeado em prosa em qualquer `RN` — dono: `produto`.

### AUT-09 — A lista absoluta de `RN-NUC-024` nomeia dado de pagamento e não nomeia a capacidade de assinar — [MÉDIO]
**ONDE:** `docs/produto/papeis-atribuicao-e-delegacao.md:210-218` (`RN-NUC-024`, as cinco cláusulas e
as três negativas); `docs/produto/fiscal-custodia-e-trilha.md:127` (`RN-EMI-033`), `:196`
(`RN-EMI-036`), `:82` (`RN-EMI-007`).
**CENÁRIO:** incidente "o estabelecimento 9 parou de assinar". O cliente concede
`provider_support` nomeando "diagnosticar o ponto de emissão". A cláusula (a) diz que vale **o que a
concessão nomeia** — e a capacidade de assinar (`RN-EMI-033`) é nomeável, porque a única negativa
absoluta da regra é **dado de pagamento** (e). Com ela no escopo nomeado, nosso operador assina em
nome do emitente: o ato de maior consequência do módulo (`RN-EMI-036`, motivo), com a
responsabilidade legal e tributária do cliente (`RN-EMI-038`, motivo), sem que nenhum valor de
segredo seja exposto — `RN-EMI-007` protege o **valor**, não o **uso**.
**POR QUE É REAL:** hoje a matriz de módulos fecha por `N` nas linhas de `EMI`, então o caminho está
bloqueado — mas está bloqueado por célula, e `RN-NUC-024` (a) autoriza qualquer concessão a nomear
operação. A cláusula (e) existe exatamente porque "a concessão nomeia" **não** é guarda suficiente
para o que não pode nunca; a capacidade de assinar tem a mesma qualidade e não está na lista.
**CORREÇÃO SUGERIDA:** acrescentar às negativas absolutas de `RN-NUC-024`: capacidade de assinar
(`RN-EMI-033`), atos sobre ela (`RN-EMI-036`) e valor de qualquer segredo de emissão (`RN-EMI-007`) —
dono: `produto`.

### AUT-10 — O ato de `provider_support` não tem forma de registro nem leitor: a cláusula que sustenta o papel é a única sem operação — [MÉDIO]
**ONDE:** `docs/produto/papeis-atribuicao-e-delegacao.md:216` (`RN-NUC-024` d);
`docs/produto/matriz-operacao-papel.md:182` (linha 26, `R`), `:126` (`RN-NUC-029`: registro nomeia
"operador **e a atribuição** que autorizou"); `docs/produto/superficie-por-papel.md:219`
(`LACUNA-NUC-031`); `docs/produto/superficie-por-papel-momentos.md:242`.
**CENÁRIO:** concessão no cliente A, usada e vencida. O `owner` de A pergunta o que fizemos no
ambiente dele. **Duas metades faltam, não uma.** (1) A leitura dessa trilha não é operação de nenhuma
das duas matrizes — logo negada a todos por `RN-NUC-026` (`LACUNA-NUC-031`, já aberta). (2) O registro
que a célula `R` exige nomeia a **atribuição** que autorizou, e `provider_support` porta **concessão**,
não atribuição: mesmo existindo o registro, ele não diz **qual concessão** autorizou o ato — que é
precisamente o que o cliente precisaria para conferir que o ato ficou dentro do escopo nomeado por
(a). A única resposta possível vira canal **nosso**, que é o mecanismo que (d) foi escrita para
recusar (`RN-NUC-024`, motivo: "a trilha passa a mentir").
**POR QUE É REAL:** a própria regra declara que a visibilidade "não é cortesia: ela é o preço de o
papel existir". Papel cujo preço não é pagável não deveria ser instanciável — e hoje, por acidente
fechado, não é (§3, N4).
**CORREÇÃO SUGERIDA:** `RN-NUC-029` passa a aceitar **concessão** como fonte de autoridade no
registro, e a leitura da trilha de atos sob concessão nasce como operação com célula para `owner` —
dono: `produto`. É a resposta com cenário que `LACUNA-NUC-031` pedia.

### AUT-11 — `RN-OFF-011` ainda diz "papel" dono da fila; implementado como papel, o gate de habilitação de `RN-NUC-020` deixa de existir — [MÉDIO] · *divergência já declarada, não corrigida*
**ONDE:** `docs/produto/operacao-offline-e-sincronizacao.md:173` (`RN-OFF-011`: "existe **um papel**
dono da fila"); `docs/produto/papeis-e-permissoes.md:204-223` (§4.2, que o converte em atribuição);
`docs/produto/papeis-atribuicao-e-delegacao.md:56` e `:72` (`RN-NUC-020`: sem `queue_owner` declarado
"a habilitação **não conclui**").
**CENÁRIO:** implementado ao pé da letra da regra dona, `queue_owner` nasce **papel**. Consequências
encadeadas: fica fora do conjunto fechado de `RN-NUC-019`; não tem coluna em nenhuma das duas
matrizes, logo todas as suas células são negadas por `RN-NUC-026`; e — o ponto — o gate de
`RN-NUC-020` some, porque ele verifica uma **atribuição** declarada, não um papel atribuído a alguém.
Estabelecimento conclui a habilitação sem alvo de fila; pendência fiscal com prazo de **horas**
(`RN-EMI-028`) fica sem quem a olhe; e a escalada de `RN-OFF-011`, infeliz, não tem para onde apontar.
Segundo salto, sob pressão: conceder ao papel inventado as linhas 28–31 e 34 — resolver item da lista,
transferir fila, encerrar faixa — que são operações de dinheiro e de documento hoje exclusivas do
papel gerencial.
**POR QUE É REAL:** a regra dona não foi corrigida, e ela é normativa em pé de igualdade com o arquivo
que a reinterpreta. Não é negação de venda e não é escalonamento imediato — é a perda do único gate
declarado que faz a fila ter dono.
**CORREÇÃO SUGERIDA:** `RN-OFF-011` passa a dizer "atribuição" onde diz "papel" — dono: `produto`.

---

## 3. Notas — sem cenário próprio, ou divergência inerte

**N1 — Terceira divergência (quem concede delegação): inerte quanto a permissão.** `RN-NUC-023` (b)
dá delegação ao `owner`; o aceite de `RN-NUC-021` a dá ao delegante. Sob a leitura "owner", perde-se
capacidade e o "prazo não maior que o do delegante" perde referente; sob a leitura adotada pela matriz
("delegante", linha 21), nada de novo é alcançável, porque a delegação é subconjunto próprio do que o
delegante já porta e a contenção não inverte (`RN-NUC-028` c). **Não vira permissão indevida nem
negação de venda em nenhuma das duas.** A consequência real da delegação está em `AUT-03`, e ela
existe sob as duas leituras.

**N2 — Contenção: a declaração "não gera autoridade retida" se sustenta.** Verifiquei os quatro
caminhos pedidos. *Offline:* `RN-NUC-027` cláusula 3 e `RN-NUC-028` (d) o dizem, e a matriz é
consistente — toda célula offline de `owner` e de `provider_support` é recusa, nas 72 linhas.
*Delegação:* a delegação **é** autoridade retida (`RN-NUC-021`, offline), mas é subconjunto do que o
delegante porta, então não cria retenção nova para um papel que não a tem; o defeito ali é temporal,
não de contenção (`AUT-03`). *Artefato publicado:* a contenção não é publicada — vive na regra e é
"declarada, não inferida" —, o que é a escolha correta, porque a alternativa a tornaria editável por
configuração. *Meta-autoridade:* `RN-NUC-028` (c) fecha a inversão. **Uma lacuna de granularidade
ficou:** não está declarado se a autoridade retida é retida **por atribuição** ou **por pessoa**. Uma
pessoa que porta `owner` + `cashier` (o caso que `RN-NUC-019`, infeliz, manda criar) tem, num mesmo
terminal, uma atribuição retível e uma não-retível; se a implementação retiver "o que ela autoriza"
como união, a autoridade de `owner` chega ao terminal offline. **Hoje é inerte:** todas as operações
exclusivas de `owner` (linhas 18 a 25) são `recusa` offline por regra própria, independentemente do
papel. Deixa de ser inerte no dia em que qualquer operação exclusiva de `owner` receber `retida`.

**N3 — O manifesto não esconde o vocabulário de blocos, e a spec não distingue as duas coisas.** O
catálogo de componentes é **embarcado** no cliente: quem tem o binário enumera todos os `kind` que
existem, inclusive de módulos que o cliente dele não tem. Logo a garantia de `RN-NUC-034`, infeliz,
protege *o que este papel/estabelecimento alcança*, e **não** *o que existe no produto* — sem essa
distinção escrita, alguém tratará a omissão de nó como confidencialidade. Sem cenário de dano:
orientação para o contrato de manifesto na Fase 3.

**N4 — Hoje `provider_support` não é instanciável, e isso é o desfecho correto.** Linha 25 (conceder e
revogar) é `?` para `owner`, `N` para todos os demais, e a regra proíbe autoconcessão
(`RN-NUC-024`, infeliz); do nosso lado não há papel declarado (`LACUNA-NUC-011`). Falha fechado, como
deve. O risco não é o estado atual: é o momento da instanciação, sob incidente, quando a pressão
empurra para um caminho de autoconcessão. `AUT-09` e `AUT-10` são as duas coisas que precisam existir
**antes** dessa primeira concessão.

**N5 — Chave de snapshot de `provider_support` não inclui a concessão.** `superficie-por-papel.md`
§4.3 exige `cliente` + `estabelecimento` + `papel/atribuições`. Para `provider_support` a superfície é
derivada da **concessão**, não da matriz (`superficie-por-papel-momentos.md` §5) — e a concessão não
está na chave. Duas concessões no mesmo cliente com escopos diferentes colidem na mesma chave. Não é
vazamento entre clientes (o `cliente` está na chave) e não concede nada (`RN-NUC-034`); o efeito é a
concessão estreita receber o manifesto composto para a ampla, o que **enumera** o que ela não alcança.
Sem cenário de dano além da enumeração: nota, e entrada para `backend` na Fase 2.

**N6 — Ausência de operação é pior que célula `?`, e são três casos.** `LACUNA-NUC-029` (ler
atribuições vigentes), `LACUNA-NUC-030` (capacidades de assinar vivas) e `LACUNA-NUC-031` (trilha do
provedor) têm a mesma forma: **o ato existe e a visão do que ele altera não** — e revogar às cegas é
o modo mais comum de revogar a coisa errada, sendo a coisa errada aqui autoridade. Confirmo o
inventário do passo 5 com uma observação: `LACUNA-NUC-029` é a mais delicada, porque a superfície que
o `owner` precisa **é** o mapa de quem pode o quê no cliente — ela nasce precisando de célula própria
e de registro de leitura, nunca de "obviamente o dono vê".

---

## 4. Entrada para `LACUNA-NUC-013` — o piso que configuração de cliente não alcança

`RN-NUC-023` pediu à auditoria do passo 4 o cenário concreto de escalonamento. Com base em `AUT-02`,
`AUT-03` e `AUT-07`, proponho quatro itens para o piso, cada um com o cenário que o justifica. Decidir
é do humano; o cenário é meu.

| Item candidato ao piso | Cenário que o justifica |
|---|---|
| Publicar a marca **"exige autorização de terceiro"** de um meio de pagamento | `AUT-02`: remove a única precondição pela qual `RN-NUC-005` recusa sozinho, e a venda conclui como paga sem captura |
| Publicar **limite de desconto/acréscimo por papel** que o próprio ator porta (direto **ou por delegação**) | `AUT-02`: desconto sem teto como "aplicação", offline incluído, sem nunca acionar `RN-NUC-007` |
| Publicar a **exceção pré-autorizada** de teto offline (`RN-OFF-025`) | é o artefato que permite operar acima do teto; publicá-lo é conceder a si mesmo o que `RN-OFF-014` limita |
| Declarar **"quem assume"** diferente da identidade autenticada | `AUT-07`: atribui fundo e diferença a quem não estava no posto |

E um item de forma: **a célula é a autoridade única sobre autorização**, prevalecendo sobre papel
nomeado em prosa em qualquer `RN` (`AUT-08`). Sem isso, "negado por omissão" é falha-fechado *desde
que ninguém tenha concedido em outro arquivo* — promessa que não se verifica por busca.

---

## 5. O que eu não consegui verificar — não aprovo por ausência de evidência

1. **Nada foi executado.** Não há código, banco, rota ou manifesto. Nenhuma verificação dinâmica:
   sem `EXPLAIN`, sem requisição forjada, sem teste. Tudo acima é leitura de spec.
2. **D-03 ABERTA** — identidade, prova de identidade, sessão e reautenticação. `AUT-04` depende
   dela: a severidade que atribuí supõe que "reautenticar sem contato" possa ser implementado
   localmente, porque **nada** hoje o proíbe. Fechada D-03 no sentido "reautenticação exige
   servidor", `AUT-04` cai para MÉDIO (fica só o texto que promete caminho inexistente).
3. **D-04 ABERTA** — convenção de identificador. O grão da referência humana é `LACUNA-NUC-003`, e
   `AUT-01` fica **mais** grave se a referência for curta e reiniciar por dia, porque a colisão entre
   estabelecimentos passa a ser diária.
4. **Log e observabilidade de autorização não têm regra no escopo auditado.** Não afirmo que estão
   certos nem errados: não há artefato. Quando `backend` escrever o contrato de erro, o gate precisa
   verificar que a negação não revela escopo alheio (`RN-EMI-039`, `RN-OFF-026` já exigem, e a
   verificação é de Fase 2).
5. **Módulos citados e não lidos.** `RN-MSA-013`, `RN-COZ-012`, `RN-PCF-008`, `RN-ATI-002` foram
   lidos apenas pela célula da matriz, não nos arquivos donos. As 23 células `N·cfg` de módulo não
   foram auditadas contra a spec de cada módulo — `RN-NUC-033` declara o limite certo ("configuração
   não transforma papel-piso em gerencial: recebe **com registro**"), e eu não conferi se cada spec
   de módulo o respeita. É auditoria de fim de módulo, não desta.
6. **Não contei as 360 células uma a uma.** Confirmei a composição dos 43 `?` pelas duas tabelas de
   contagem (§8 de cada matriz) e auditei dirigidamente as 5 do núcleo, as 12 de leitura e as 2 do
   caminho crítico. As 20 de ato fiscal irreversível **não** foram auditadas uma a uma
   (`LACUNA-NUC-020` a `022`, `025`, `027`, todas do humano com o contador): não encontrei caminho
   que as leia como permissão, o que não é o mesmo que dizer que estão certas.

---

## 6. Reincidência

Primeira auditoria do repositório: nada a marcar como reincidente. `AUT-04` e `AUT-11` já estavam
**declaradas** pelo próprio `produto` nos passos 2 e 3 e continuam em pé nos arquivos donos — se
reaparecerem, são reincidentes por definição, e o sinal é de processo, não de texto.

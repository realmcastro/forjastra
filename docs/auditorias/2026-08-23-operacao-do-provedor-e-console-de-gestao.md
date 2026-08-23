# Auditoria — operação do provedor: alcance, observação e consentimento

**Data:** 2026-08-23 · **Escopo:** T-0004, passo 2 (gate 3, sobre o **modelo**) · **Agent:** `seguranca` ·
**Read-only.**

**Objeto auditado — spec, não código.** `docs/produto/operacao-do-provedor.md` e
`operacao-do-provedor-alcance.md` (`RN-PRV-001` a `010`), contra `papeis-e-permissoes.md`,
`papeis-atribuicao-e-delegacao.md` §7 (`RN-NUC-024`), as três matrizes,
`fiscal-custodia-e-trilha.md` (`RN-EMI-040`), `modulos/pedido-cliente-final.md` (`RN-PCF-012`,
`RN-PCF-013`), `postura-nova-geracao.md` (`PN-10`, `PN-15`), `superficie-por-papel.md`
(`LACUNA-NUC-031`) e as minhas duas auditorias de T-0003. Prefixo **`PRV-nn`**; não uso `AUT-` nem `C-`.

**Dois arquivos irmãos, uma auditoria.** O texto único fechou em **438** linhas, acima do teto de 400, e a
divisão é por **eixo**: aqui *o que se alcança e sob que autorização* — prioridade um, a fronteira de
`LACUNA-PRV-002`, o veredito sobre `provider_support`, e `PRV-01`, `PRV-02`, `PRV-06`, `PRV-10`. Em
**`2026-08-23-operacao-do-provedor-mutacao-e-trilha.md`**: *o ato nosso e o rastro dele* — `PRV-03`,
`PRV-04`, `PRV-05`, `PRV-07`, `PRV-08`, `PRV-09`, e o estado do gate `PCF`/`ATI`. **Numeração de achado
contínua e única entre os dois**, e as seções não se repetem.
**Terceiro irmão, do passo 6 (2026-08-23):** `2026-08-23-operacao-do-provedor-gate-de-fecho.md` — o gate de fecho do bloco, que reaudita o conserto destes achados, aplica `F1`–`F6` aos itens de `fatos-de-operacao*.md` e traz `PRV-11` a `PRV-16`. **Numeração contínua entre os três.**


**Não existe código.** "Um implementador faria X" significa que X satisfaz integralmente a regra dona e
nenhuma outra o proíbe. Endereços conferidos em disco nesta data, um a um.

**Contagem dos dois arquivos: um `CRÍTICO`, seis `ALTO`, três `MÉDIO`.** O `CRÍTICO` é único e é `PRV-01`. O `CRÍTICO` não é inflação e a
justificativa está escrita no próprio achado: o desenho retira, **por texto expresso e datado**, a única
cláusula do repositório que proíbe resolver o cliente-alvo por identificador que o pedido informa — e
retira exatamente do papel que **escreve** em N clientes.

---

## 1. Prioridade um, os cinco itens de `seguranca.md` §1 — e D-03

**1. Consulta que alcança schema de outro cliente.** Para os cinco papéis de cliente, a resposta da
T-0003 **continua verdadeira**: não achei caminho. Mas o desenho novo cria, pela primeira vez, um sujeito
que **por construção** alcança N schemas, e `RN-NUC-024` só proíbe "mais de um cliente" para
`provider_support` (`papeis-atribuicao-e-delegacao.md:298-299`); nada equivalente existe para
`provider_operator` nem para `provider_administrator`. A resposta correta hoje é: *não existe caminho para
papel de cliente; para papel nosso o caminho depende de D-03, e a spec não o fecha.*

**2. O tenant vem de identidade autenticada?** **Não, e é a mudança mais consequente desta ficha.** Para
papel de cliente, a identidade determina o cliente. Para os dois papéis novos, o cliente é **escolhido** —
um papel que serve N clientes não tem tenant na identidade, logo a requisição carrega **seletor**. É
exatamente o que `.claude/rules/backend.md` §1 proíbe ("nunca de `body`, `query`, header livre ou path
editável"), e é a primeira vez neste projeto que o proibido é **inevitável**.

Quanto isso pesa, dito em consequência e não em preferência: com **leitura**, seletor errado devolve dado
do cliente errado **a nós** — dano contido dentro da nossa fronteira e coberto pela cláusula de
`RN-PRV-010`. Com **mutação**, seletor errado **grava** no cliente errado: o dano é dele, e é irreversível
pelas próprias regras do desenho — fato append-only não se apaga, só se corrige com fato novo
(`RN-PRV-007`). Portanto D-03 deixa de ser só "onde a pessoa mora" e passa a incluir **quem emite o
seletor**: escolhido no pedido, o isolamento é **verificação**; emitido pelo servidor, uma vez, para **um**
cliente, herdado pela sessão inteira, o isolamento volta a ser **construção**. Não decido — é D-03 e é do
humano. Declaro que a opção **B** do dossiê passou a custar mais do que custava quando o agravante
registrado era só de leitura (`memory/plataforma/decision-d-03-sao-tres-eixos-nao-uma-decisao.md`).

**3. Operação de dados que aceita tenant ausente e cai em default.** Não há operação desenhada. Risco de
desenho, nomeado para o passo 7: console cujo "cliente atual" é **estado de sessão** (a aba aberta) tem
default de tenant por construção, e default de tenant em papel nosso é o pior default que este sistema
admite. Requisito: nenhuma superfície nossa tem cliente atual implícito.

**4. Id de recurso validado contra o tenant antes do uso.** **Não.** É `PRV-01`, e é o achado da ficha.

**5. Canais laterais.** Três com achado próprio: registro de módulo ativo em `platform` (`PRV-05`), nossa
cópia de dado pessoal de cliente-final (`PRV-08`), agregado cross-cliente (`PRV-10`). Um quarto sem achado
porque não há desenho ainda, e por isso vai como requisito: **exportação de diagnóstico**. Nenhuma regra a
menciona, e ela é o veículo clássico de sair do escopo levando o dado inteiro num arquivo.

---

## 2. `LACUNA-PRV-002` — a fronteira, em forma verificável

**O problema, dito sem eufemismo:** em grão suficientemente fino, telemetria é leitura de dado de negócio
com outro nome, e **agregar não anonimiza**. `PN-15` (`postura-nova-geracao.md:269-274`) autoriza um canal
estreito — estado de conexão e quantidade de pendências, sem dado sensível — e não dá fronteira de grão.
Não existe hoje nenhuma regra de grão no repositório (busca por `telemetria` em `docs/produto/**`: zero).

**Seis condições, todas necessárias.** Item que reprova em qualquer uma **não é observação de operação**:
é leitura de fato de negócio, e o veículo dela é `RN-PRV-010` (cláusula de contrato), não `RN-PRV-009`.

**F1 — UNIDADE.** O item é contado em unidade da **nossa** infraestrutura: requisição, erro, latência,
pendência de fila, tentativa de sincronização, versão, dispositivo, aplicação de migration. Nunca em
unidade do negócio dele: dinheiro, venda, item, produto, pedido, meio de pagamento, documento fiscal,
cliente-final. *Unidade de negócio não vira unidade de operação por ser contada em vez de somada.*
**Teste:** nomeie o denominador. Se o denominador é um ato de venda, a unidade é de negócio — e é aqui que
"**operações por hora, por estabelecimento**" reprova, porque "operação" é a nossa palavra para a venda
dele.

**F2 — ESPELHO, NÃO SÉRIE.** É o critério que `PN-15` já implicava: o canal legítimo mostra o que o
operador do cliente vê **no terminal dele, naquele instante** — estado, não histórico. A **série retida**
da mesma grandeza é objeto diferente, e `PN-15` não a cobre. **Teste:** o item é respondível olhando o
terminal do cliente agora? Sim, e não é retido → passa. Só é respondível com histórico → é série, e vai a
F3–F6.

**F3 — FORMA, NÃO VALOR.** É esta que segura a linha. Um item é dado de negócio se ele, **sozinho ou
combinado com os outros da lista**, revela **forma**: ordenação no tempo (hora de pico, dia mais forte,
subida e queda), ordenação entre estabelecimentos, ou ordenação entre clientes. Forma sobrevive a
normalização, a razão e a índice — não é preciso o valor para entregar a resposta de negócio.
**Teste, que é procedimento e não adjetivo:** tome as perguntas publicadas em
`modulos/relatorios-semente-de-perguntas.md` e tente responder cada uma **em forma** com a lista de
observação. Qualquer uma que fique respondível reprova o item que a habilitou. É o teste de `RN-EMI-040`,
motivo (`fiscal-custodia-e-trilha.md:302-305`), com o vetor invertido: lá o agregado vaza de cliente para
cliente; aqui vaza do cliente para nós.

**F4 — DECISÃO, E O GRÃO MAIS GROSSO QUE A SUSTENTA.** `RN-PRV-009` já exige declarar a decisão **nossa**
que o item informa. Acrescento o que a torna verificável: o grão é o **mais grosso** que ainda sustenta
aquela decisão. **Teste:** nomeie o grão imediatamente mais grosso e mostre que a decisão deixa de ser
tomável nele. Não mostrou → o grão fino é dado de negócio. **Corolário:** decisão nossa de capacidade e de
custo é sobre a **nossa** infraestrutura, e infraestrutura se dimensiona pelo agregado de todos os
clientes. Grão por estabelecimento quase nunca passa F4; quando passa, é por **incidente** — e o veículo do
incidente é a concessão (`RN-NUC-024`), com escopo, prazo e motivo, não a lista permanente.

**F5 — JANELA.** A janela mínima do canal de operação é a **maior** janela em que a série deixa de
recuperar (a) a hora de pico, (b) a ordenação dos dias da semana, (c) a transição aberto/fechado.
**Procedimento:** gerar a série na janela proposta e tentar recuperar as três; recuperou alguma, a janela é
fina demais. O **número** é do humano e do `arquiteto-dados` — eu entrego o teste que o produz, não o
número. Armadilha a registrar: **janela grossa não conserta unidade.** Contar venda em janela larga continua
contando venda.

**F6 — DESTINO E REPOUSO.** Item lido só em agregado sobre todos os clientes é **armazenado** em forma que
não se decompõe por cliente. "Nós só olhamos o total" é política; a propriedade é a forma **no repouso**.
Corolário obrigatório para `D-06`: agregado identificável por cliente alojado no `platform` tira dado do
cliente do schema que o isola, e o isolamento deixa de ser propriedade da **construção** para ser da
**verificação** — é o que o registro `memory/plataforma/decision-agregado-de-periodo-fechado-nao-e-cache.md`
chamou de **vazamento por agregado**. Essa parte do registro **continua válida**; o que caiu nele foi a
premissa "nenhuma pergunta soma clientes".

**Teste de admissão de item novo — a pergunta única, aplicável por quem não conhece a nossa
infraestrutura:** *se eu entregasse este item, no grão em que ele está, ao próprio cliente, ele o
reconheceria como informação do negócio dele?* Reconheceu → é dado de negócio, e o veículo é `RN-PRV-010`.
Não reconheceu **e** passa F1–F6 → é observação de operação. Isto satisfaz o aceite de `RN-PRV-009` ("um
leitor externo consegue dizer se ele é fato de negócio") com um procedimento em vez de um adjetivo.

### 2.1 Onde a fronteira **não** tem saída boa — e dizer isso é a resposta honesta

1. **Hora de pico por estabelecimento não tem saída.** Ela **é** a curva de venda do cliente; nenhuma
   unidade, janela ou agregação a conserta, porque o pico é a **forma**, e a forma é o que se queria. As
   três saídas legítimas, e não existe quarta: **(a)** pico agregado sobre **todos** os clientes — informa
   a nossa decisão de capacidade e passa F1–F6; **(b)** pico por estabelecimento entregue **ao cliente**
   como relatório dele — é dele, e `REL` já é o veículo; **(c)** pico por estabelecimento lido **por nós**
   = dado de negócio, canal de `RN-PRV-010`, com trilha. O pedido do humano ("que horas é o pico") é
   legítimo nas três; o que não existe é ele ser telemetria quando é por estabelecimento.
2. **Métrica de infraestrutura por estabelecimento é proxy de atividade, e não há como não ser.** Zero
   requisição às 15h é "fechado às 15h"; taxa de erro por estabelecimento ordena estabelecimentos por
   volume. Saída parcial e verificável, e ela é do passo 4, não da lista: grão fino por estabelecimento é
   **transitório** (existe para o incidente, não é retido como série), e o que se retém é grosso por F5.
   Não tenho critério que faça grão fino **retido** por estabelecimento passar F3.
3. **"Qual módulo não está sendo usado" tem saída boa**, e registro porque é pedido do humano: **binário
   usado / não usado na janela**, nunca volume, nunca curva. Responde as três decisões nossas (oferecer
   treino, retirar o módulo, parar de cobrar) e não reprova F3 em nenhuma leitura, porque binário não tem
   forma.

---

## 3. Achados — eixo do alcance (`PRV-03`, `04`, `05`, `07`, `08`, `09` estão no irmão)

### PRV-01 — `RN-PRV-003` exclui os papéis nossos de `RN-NUC-018`, e com ele da única cláusula que proíbe resolver o cliente-alvo por identificador que o pedido informa — agora com efeito de **escrita** em N clientes — [CRÍTICO]
**ONDE:** `docs/produto/operacao-do-provedor.md:105-107` (a exclusão) e `:127` (mutação "ampla e
declarada"); `docs/produto/papeis-e-permissoes.md:75-104` (`RN-NUC-018`), em especial `:78-80` ("avaliada
contra o escopo do **objeto** … nunca contra o escopo declarado por quem pede") e `:101` ("**Nunca** se
resolve o escopo a partir de identificador que o pedido informa").
**CENÁRIO:** `provider_operator` opera N clientes na mesma sessão, então o cliente-alvo chega por
**seletor** (§1.2). Ele está na tela do cliente A e submete "desativar módulo `FIS`" com o identificador de
B — aba antiga, erro de digitação, ou requisição alterada. Nenhuma regra manda validar o identificador
recebido contra o cliente que a autorização resolveu, porque a regra que mandaria foi declarada
inaplicável. A escrita cai em **B**: os terminais de B perdem capacidade fiscal em operação, e a fatura de
B muda (`RN-PRV-007`). Na direção da leitura: a tela de "informação bruta" rotulada A devolve o faturamento
de B; se esse número virar a "sugestão" de `LACUNA-PRV-004` entregue a A, **um cliente recebe dado de
outro**.
**POR QUE É REAL:** `RN-NUC-018` é regra sobre o **objeto**, e todo objeto de ato nosso pertence a **um**
cliente — o usuário de A, o registro de módulo de A, o cliente-final de A. A exclusão é justificada por uma
propriedade do **sujeito** ("o escopo deles não é cliente nem estabelecimento") que a regra nunca menciona.
E a frase que carrega a exclusão é factualmente falsa: `operacao-do-provedor.md:105-106` diz que "as três
matrizes têm por coluna os cinco papéis de cliente", mas a quinta coluna é `provider_support`
(`matriz-operacao-papel.md:54`), que `papeis-e-permissoes.md:129` classifica como "**nosso**". A mesma
frase também contradiz o irmão: `RN-PRV-003` afirma que nenhum papel de escopo `provedor` é coluna de
matriz de cliente, e `operacao-do-provedor-alcance.md:122-123` afirma que `provider_support` é `recusa` em
toda linha — as duas não podem ser verdade.
**CORREÇÃO SUGERIDA:** `RN-PRV-003` perde a exclusão de `RN-NUC-018`, e `RN-PRV-004` ganha cláusula: a
autorização de ato nosso é avaliada no escopo do **objeto**, o cliente-alvo **nunca** se resolve a partir de
identificador informado no pedido, e um ato ou sessão de papel nosso nomeia **exatamente um** cliente
(espelho de "nunca mais de um cliente" de `RN-NUC-024`) — dono: `produto`, com `backend` quando `D-03`
fechar.

### PRV-02 — O default fechado do escopo `provedor` não existe: `RN-NUC-026` e `RN-NUC-039` são escritas sobre "as duas matrizes" e "os cinco papéis", e `RN-PRV-003` aponta para elas como se alcançassem a matriz do passo 7 — [ALTO]
**ONDE:** `docs/produto/operacao-do-provedor.md:127` ("sem ela, cada operação é negada (`RN-NUC-039`)") e
`:239-240`; `docs/produto/matriz-operacao-papel-contrato.md:214-218` (`RN-NUC-039`: "a célula das **duas
matrizes** é a autoridade única"; "(a) operação sem linha **nas duas matrizes**") e `:39-42` + `:57-59`
(`RN-NUC-026`, aceite: "operação ausente das duas tabelas é negada **aos cinco papéis**, sem exceção").
**CENÁRIO:** o passo 7 entrega a matriz do `provedor` com as operações enumeradas. O console precisa de uma
que ninguém enumerou — "redefinir a credencial do `owner`", "reenviar convite", "exportar o dado do cliente
para diagnóstico". Qual regra a nega? `RN-NUC-026` fixa o default nos cinco papéis das duas matrizes, e
`provider_operator` não é um dos cinco; `RN-NUC-039` fixa a precedência célula×prosa nas mesmas duas. A
operação sem célula, no escopo novo, **não tem desfecho declarado** — e a primeira implementação decide, com
a tela na frente. O default fechado de `.claude/rules/seguranca.md` §2 é regra **nossa**, de processo, não
do produto: ela não sobrevive à leitura de quem lê só a spec.
**POR QUE É REAL:** é a forma de `AUT-14` deslocada de arquivo: uma regra nova depende de uma trava que
existe, está escrita, e cujo enunciado delimita um escopo que não a alcança.
**CORREÇÃO SUGERIDA:** `RN-NUC-026` e `RN-NUC-039` passam a nomear a matriz do `provedor` (default negado e
precedência da célula), **na mesma passada** em que a matriz nasce — dono: `produto`.

### PRV-06 — Dado pessoal de cliente-final é a única classe do desenho **sem canal de autorização nenhum**: a célula nega a todas as colunas, a cláusula declaradamente não a cobre, e `RN-PRV-008` a alcança em prosa — [ALTO]
**ONDE:** `docs/produto/operacao-do-provedor-alcance.md:49-64` (`RN-PRV-008`, cujo motivo nomeia "nome,
telefone, documento, o que a pessoa pediu"), `:163-165` (`RN-PRV-010`, infeliz: a cláusula **não** cobre
dado pessoal de terceiro) e `:167-176` (§2.2, o piso — que não inclui essa classe);
`docs/produto/matriz-operacao-papel-modulos.md:169` (a operação "Consultar dado de pessoa **fora** da venda
em curso": `N` para `provider_support`, `?` para os três gerenciais, `LACUNA-NUC-018`) e `:173-175` (nota
⁷).
**CENÁRIO:** o cliente-final de A reclama; `provider_operator` abre a interação e lê nome, telefone,
documento e o que a pessoa pediu. Isso **é** "consultar dado de pessoa fora da venda em curso" — a operação
que está `N` para a única coluna nossa e `?` (negada) para as três gerenciais. A prosa de `RN-PRV-008`
autoriza; `RN-NUC-039` existe para impedir que prosa autorize o que a célula nega, e não alcança o escopo
novo (`PRV-02`). Do lado do consentimento, `RN-PRV-010` diz por escrito que a cláusula não cobre isso. Logo
a leitura acontece **sem nenhum mecanismo autorizador** — não por má-fé: por três textos corretos que não
se encontram.
**A consequência técnica do limite que o passo 1 roteou ao humano, e ela é minha nomear:** que o
estabelecimento não possa consentir em nome dos clientes-finais dele significa, em autorização, que essa
classe fica **sem veículo** — concessão pode nomeá-la, cláusula não pode cobri-la, papel amplo a lê.
Falha fechado tem um único desfecho: enquanto não existir base, dado pessoal de cliente-final é classe do
**piso** de §2.2 (vedada a todo papel nosso, como dado de pagamento), **ou** `RN-PRV-008` se declara inerte
até a resposta. Não afirmo base legal e não cito norma: a consequência que nomeio é de autorização.
**CORREÇÃO SUGERIDA:** §2.2 ganha a classe, ou `RN-PRV-008` declara-se inerte com a lacuna citada — dono:
`produto`, com o humano.

### PRV-10 — O agregado cross-cliente não tem objeto de consentimento, e `RN-EMI-040` proíbe devolver **valor** de outro cliente, não **comparação** — [ALTO]
**ONDE:** `docs/produto/operacao-do-provedor-alcance.md:144-150` (`RN-PRV-010` b: "a cláusula e o alcance
técnico são **o mesmo objeto**") e `:124-126` (§2.1, itens 3 e 4);
`docs/produto/fiscal-custodia-e-trilha.md:297-301` (`RN-EMI-040`, enunciado: "nenhuma tela, exportação,
relatório, contagem ou **mensagem** endereçada a um cliente devolve **valor** que dependa de outro
cliente") e `:302-305` (motivo); `docs/produto/operacao-do-provedor-alcance.md:197-198`
(`LACUNA-PRV-004` — "sugerir melhoria" interno **ou vendável**, aberta).
**CENÁRIO:** o agregado existe (é `D-06`). O `provider_administrator` o usa para sugerir a A: "seu ticket
médio está abaixo do que se pratica no seu porte". Nenhum **valor** de B foi devolvido, então o enunciado de
`RN-EMI-040` não é violado pela letra — e A acabou de saber **como está em relação aos outros**, que é
exatamente o que §2.1 item 4 promete que ele nunca sabe. O vazamento está na **forma** (ordenação), e a
proibição está escrita em **valor**. Se `LACUNA-PRV-004` fechar como "vendável", a sugestão vira artefato de
produto e o caminho deixa de depender de uma frase dita por uma pessoa. Segundo furo, do consentimento: a
cláusula de `RN-PRV-010` é **por cliente**, e ninguém consente em ser linha de um agregado que existe para
informar decisão sobre outro — o agregado é o único alcance nosso **sem objeto de consentimento**, e
`RN-PRV-010` (b) diz que cláusula e alcance são o mesmo objeto.
**POR QUE É REAL:** o próprio `RN-EMI-040`, motivo, nomeia a classe — "vazamento entre clientes por
agregado, que sobrevive a schema correto". O que ele não cobre é a saída por comparação sem número.
**CORREÇÃO SUGERIDA:** cláusula declarando que nenhum artefato entregue a um cliente — tela, exportação,
relatório, mensagem, sugestão ou conversa — carrega **valor, ordenação ou comparação** derivada de outro
cliente; e o agregado declara não ter objeto de consentimento por cliente — dono: `produto`;
`LACUNA-PRV-004` é do humano.

---

## 4. O teste que o passo 2 devia responder: `provider_support` foi estendido? Alguma negativa caiu?

**Sustento a afirmação do passo 1, com uma correção de fundamento.** Nenhum enunciado vigente é revogado, e
o eixo de `RN-PRV-004` (ler e mutar independentes) é o que preserva o desenho em vez de negá-lo:
`provider_support` continua sendo concessão, continua sem mutação de rotina, e as três negativas de
`papeis-atribuicao-e-delegacao.md:298-299` (nunca autoridade retida, nunca mais de um cliente, nunca a
contagem cross-cliente) seguem de pé e sem competidor.

**A correção:** não é verdade que "nenhuma negativa vigente é sobre largura de leitura". As negativas
**absolutas** de `RN-NUC-024` (e) são, sim, sobre agir ou sobre classe vedada a todos. Mas há **quatro
negativas de largura de leitura vigentes**, e elas são **células**, que `RN-NUC-039` faz autoridade única:
`matriz-operacao-papel-modulos.md:168-171` põe `N` para `provider_support` em ler trilha de auditoria,
consultar dado de pessoa fora da venda, consultar e exportar documento fiscal, e ler medição por pessoa —
com a nota ⁷ (`:173-175`) fundamentando no default fechado de `RN-NUC-024` (a), que é sobre **o que a
concessão nomeia**, leitura inclusa. A conclusão do passo 1 não muda para `provider_support`; muda para os
**papéis novos**, porque duas dessas quatro linhas são precisamente o que `RN-PRV-008` e o §2 do irmão
concedem em prosa — e é daí que saem `PRV-06` e `PRV-02`. A afirmação, corrigida, é: *o desenho vigente foi
completado, não negado; nenhuma negativa caiu; e o que o desenho novo faz é conceder, em prosa e em escopo
sem precedência declarada, duas leituras que a célula nega a toda coluna existente.*

**Sobre `RN-PRV-004` como afirmação auditável:** ela se sustenta como enunciado e é o achado conceitual
correto da ficha. O que ela **não** tem hoje é mecanismo: "nenhum papel porta os dois amplos" só é
verificável quando existir a matriz do `provedor` (passo 7) e quando a soma de papéis na mesma pessoa for
avaliada por célula, não por prosa. Enquanto isso, o aceite de `RN-PRV-004` (`operacao-do-provedor.md:178-183`)
é conferível apenas por leitura, e o terceiro caso dele ("uma pessoa portando os dois papéis") depende de
`PRV-03`, porque é o registro que diria qual papel autorizou.

---

## 5. Nota — sem cenário próprio

**"Faturamento" nomeia duas grandezas nestes arquivos.** `RN-PRV-001` (`:53-55`) classifica "quanto o
cliente nos paga" como `provedor`, e §2 de `operacao-do-provedor-alcance.md` usa "faturamento" para a receita **dele**. `RN-PRV-003` define
a leitura estreita com a palavra ambígua ("nunca faturamento"), e é `RN-PRV-004`, aceite, que a desambigua
("faturamento, **curva de vendas** ou dado de pagamento"). Não é achado — o desfecho não muda —, mas o preço
de exibir o efeito de cobrança a quem "não vê faturamento" (`RN-PRV-007`, aceite) só é pagável porque as
duas grandezas são diferentes, e isso convém ficar escrito antes de alguém decidir por semelhança de
palavra.


---

## 6. O que **não** consegui verificar — não aprovo por ausência de evidência

1. **`D-03` ABERTA.** A resposta ao item 2 de §1 (como o cliente-alvo chega) **não é verificável** hoje:
   ela é a terceira dimensão de `D-03`. `PRV-01` é achado de spec e independe da resposta (a cláusula do
   objeto foi retirada em qualquer opção), mas o tamanho do dano depende dela.
2. **A matriz do `provedor` não existe** (passo 7). `PRV-02` e a parte mecânica de `RN-PRV-004` só se
   fecham conferindo célula a célula, e não há células. Isto **é** o gate de autorização que o passo 6 me
   devolve: reauditar o conserto é obrigatório (`gotcha-regra-nova-que-nao-corrige-a-celula-nasce-inerte`).
3. **A lista de fatos do passo 3 rodou em paralelo com esta auditoria e NÃO está auditada.**
   `docs/produto/fatos-de-operacao.md` e `fatos-de-operacao-provedor.md` existem em disco nesta data e
   **não** entraram no meu brief nem na minha leitura. A fronteira de §2 é um **teste**; eu não o apliquei a
   item nenhum, porque a lista não era minha. **Aplicar F1–F6 e o teste de admissão aos itens daqueles dois
   arquivos é o trabalho do passo 6, e sem isso a fronteira é texto.**
4. **`D-06` não existe.** F6 é a única condição da fronteira que depende de onde o dado repousa, e eu
   entrego a restrição, não a verificação.
5. **Não li nenhuma norma** e não afirmo base legal em nenhum ponto — inclusive em `PRV-06`, onde a
   consequência que nomeio é de autorização.
6. **Não rodei teste:** não há código. Verificação = leitura de arquivo e conferência de endereço em disco
   nesta data.

## 7. Reincidência

Nenhum achado de `AUT-01` a `AUT-17` reaparece **aberto** neste escopo: os que fecharam continuam
fechados no texto que eu conferi, e `AUT-17` (células de módulo sem `terminal+ident`) segue aberto e
**fora** deste escopo. O que reaparece são **três formas de defeito**, e a repetição é sinal de processo,
não de texto: prosa concedendo o que a célula nega (`AUT-08` → `PRV-02`, `PRV-06`); fonte de autoridade nova
sem valor no registro (`AUT-15` → `PRV-03`); e regra que muda desfecho de célula sem a célula
(`AUT-14` → `PRV-04`). As três foram corrigidas uma vez e voltaram no primeiro escopo novo — é o argumento
mais forte que tenho para que a matriz do passo 7 e a reauditoria do passo 6 saiam no mesmo bloco.

# Fatos de operação — o que **nós** praticamos, e o ciclo de vida do cliente

> **Irmão de `fatos-de-operacao.md`, com o mesmo peso normativo.** Primeiro eixo da partição: **quem
> pratica o fato**. Lá, o que a operação do cliente produz (caminho de venda, conectividade, tempo,
> `RN-NUC-041` a `046`). Aqui, o que os **papéis nossos** praticam e o **ciclo de vida** do cliente, do
> módulo, do schema e do terminal (`RN-PRV-011` a `014`, mais `RN-PRV-021`, de 2026-08-23; `RN-PRV-011`
> ganhou as cláusulas (h) a (j) em 2026-09-23). Em
> `fatos-de-operacao-dominios-fechados.md` — terceiro irmão, nascido em 2026-08-23 —, o fato de recusa e
> as três listas fechadas de valor (`RN-NUC-047`, `048`), inclusive a que este arquivo cita para a
> tentativa recusada. Em `fatos-de-operacao-retencao-e-descarte.md` — quarto irmão, da mesma data —, **o
> fato depois do instante**: recurso local (`RN-NUC-046`) e retenção × janela (`RN-NUC-049`). Em
> `fatos-de-operacao-ciclo-de-vida-do-pedido.md` — quinto irmão, de 2026-09-11 —, **o pedido × o fato
> sobre o pedido** (`RN-NUC-052` a `055`). **As lacunas
> e as perguntas dos cinco moram no primeiro irmão** (§7).
>
> **Por que este arquivo existe separado do conjunto `operacao-do-provedor*.md`.** Lá estão os
> **papéis** e o **alcance** deles (`RN-PRV-001` a `010`); aqui está **o que fica registrado** quando
> eles agem ou leem. `RN-PRV-006` já prometeu que todo ato e toda leitura nossos são legíveis pelo
> cliente; a promessa não diz **quais fatos existem** para que ela seja cumprível, e uma promessa sem
> os fatos que a sustentam é a trilha mentindo por omissão. Numeração contínua com aquele conjunto e
> imutável (`glossario.md` §4.2).
>
> **O que este arquivo não é.** Não é tabela, coluna, ledger, rota, console nem tela. Grão é
> **candidato**: veredito do `arquiteto-dados` (passo 4), onde também mora `D-06`. Nenhuma célula de
> autorização é valorada, e nenhum número — prazo, retenção, teto — é escrito.
>
> **Formato:** `Enunciado` · `Motivo` · `Aceite` · `Infeliz`. Escopo de **toda** regra: `provedor`.
> **`PROVISÓRIA`** = depende de lacuna com dono e não é agendável.

---

## 1. As regras

### RN-PRV-011 — Leitura nossa é fato de igual peso ao ato; ela nomeia o que foi alcançado e nunca copia o que foi lido

> **Indisponível — nome da pessoa nossa na trilha visível ao cliente.** Não funciona: o cliente ver o
> nome de quem, do nosso lado, agiu ou leu no ambiente dele. Falta: saber se o cliente tem direito ao
> nome (`state-pendencias` §4.3). Responde: humano, com o advogado.
> Enquanto isso: o cliente vê o papel e um pseudônimo próprio do ambiente dele (cláusula j). Desde:
> 2026-09-23.

> **Indisponível — leitura, do nosso lado, da trilha do nosso uso.** Não funciona: qualquer pessoa
> nossa ler os fatos da trilha, inclusive quem praticou o ato. Falta: o leitor nomeado (`PRV-09`,
> `state-pendencias` §4.4). Responde: humano.
> Enquanto isso: a linha `R7` não tem célula, e sem célula a leitura é negada aos três papéis
> (`RN-PRV-015`); toda tentativa é recusada e vira fato de tentativa recusada (cláusula f). Desde:
> 2026-09-23.

**Enunciado** toda leitura de dado de negócio de um cliente por um papel nosso produz fato **no
instante da leitura**, com: quem (pessoa e papel de `RN-PRV-003`), quando (`RN-NUC-042`), qual cliente
e qual estabelecimento, **qual classe de objeto** foi alcançada, **sob que autoridade** (papel
declarado, cláusula de `RN-PRV-010` ou concessão de `RN-NUC-024`) e o **motivo, de lista enumerada**
(§2.1). O fato **nomeia** o que foi alcançado e **nunca carrega cópia do conteúdo lido**. A
**tentativa recusada** — papel nosso pedindo o que o eixo dele não alcança (`RN-PRV-004`) — é fato
pelo mesmo mecanismo, com o motivo enumerado de `RN-NUC-043`
(`fatos-de-operacao-dominios-fechados.md` §1.1).

**Enunciado, cláusulas acrescentadas em 2026-08-23 — a contradição que o passo 4 achou.** A regra acima,
lida sozinha, obriga o papel que **só lê** a **escrever** no ambiente do cliente, o que contradiz
`RN-PRV-004` ("quem lê amplamente não muta"). A contradição se resolve assim, e não por exceção: (a) o
fato **não é ato do papel que leu** — ele é gravado **pela plataforma**, como precondição da leitura, e
**gravar a própria trilha não é mutação** para efeito do eixo de `RN-PRV-004`, que mede alcance sobre o
**dado do negócio do cliente** e nunca sobre o registro do próprio ato (`RN-PRV-004` e). É a mesma forma
de `RN-NUC-029`: o registro nasce **junto com** o ato, é precondição dele, e nenhum papel o pratica como
operação separada — ninguém diria que o `cashier` "muta" por deixar trilha. (b) **Nenhum papel nosso**
suprime, edita, adia ou desliga este fato, e nenhum ganha, por ter lido, qualquer alcance de escrita
sobre dado do cliente: o alcance de mutação continua sendo o que `RN-PRV-003` declara, item por item.
(c) **Se o fato não pode ser gravado, a leitura não acontece** — falha fechado, espelho de `RN-NUC-029`,
infeliz. (d) A **residência** do fato é `D-06` e esta regra **não a escolhe**: o que ela exige é o
resultado — o cliente lista as nossas leituras (`RN-PRV-006` c) e **nenhuma operação nossa as apaga,
encurta ou expira**, nos termos das quatro partes de `RN-PRV-006` (d), que é onde a propriedade exigida da
residência está escrita (redação corrigida em 2026-08-23, `PRV-14`: "nós não conseguimos apagá-las" era
promessa sem mecanismo). Residência que não sustente as duas coisas é residência recusada.

**Enunciado, cláusulas acrescentadas em 2026-08-23, segunda passada — a instância em que o mecanismo
das cláusulas acima não tem valor possível (`PRV-11`).** As cláusulas (a) a (d) fizeram do registro a
precondição da leitura, e `RN-PRV-016` fez do **cliente-alvo resolvido** campo obrigatório dele. Existe
exatamente uma instância em que esse campo não tem valor possível: a **recusa em que a própria resolução
do alvo é o que falhou**. Fecha assim, e sem abrir exceção de campo. (e) **Identificador pretendido** e
**cliente-alvo resolvido** são coisas diferentes, com nomes diferentes e campos diferentes: o primeiro é
o que o pedido carregou, é **não-autoritativo** (`RN-PRV-004` b), é registrado **como pretendido** em
todo lugar onde aparece, e **nenhum** artefato nosso o apresenta no lugar do segundo. (f) O fato de
**tentativa recusada** carrega o identificador pretendido e **não exige** cliente-alvo resolvido: quando
a resolução falhou, ou quando ela ainda não existe (`RN-PRV-004` d, com `D-03` aberta), o fato **é
gravável e é gravado**, com o identificador pretendido, o motivo enumerado de `RN-NUC-043` e o desfecho;
quando existe alvo resolvido **e** o pedido informou outro, o fato carrega **os dois**, e a divergência é
o motivo. A cláusula (c) — fato não gravável impede a leitura — **não alcança a recusa**: a leitura já
não aconteceu, e exigir dela o campo impossível trocaria recusa **registrada** por recusa **silenciosa**.
(g) **Residência nunca se escolhe pelo identificador pretendido.** O fato de tentativa recusada não
repousa no ambiente do cliente apontado por ele, e nenhuma leitura desse cliente o alcança por essa via;
**onde** ele repousa é `D-06`, e o que esta cláusula proíbe é a residência ser decidida pelo campo que
`RN-PRV-004` (b) acabou de declarar não-autoritativo.

**Consequência derivada — restrição a `D-06`, com o argumento corrigido em 2026-08-23 (`PRV-11`).** O
argumento publicado até esta data era que gravar `provider_read_refused` no ambiente do cliente
"exigiria a escrita que a recusa acabou de negar". Ele **não se sustenta**, e a correção é do passo 6:
quem grava não é o ator, é a **plataforma** (cláusula a), que escreve em todo schema por construção. A
conclusão continua de pé pelo argumento certo: existe ao menos uma classe de fato nosso — a tentativa
recusada em que a resolução do alvo é o que falhou — para a qual **nenhum ambiente de cliente é
escolhível**, porque o único identificador disponível é o pretendido, e ele não decide nada (cláusula
g). Logo **não existe regra única de residência** para os fatos do provedor: `D-06` decide **onde cada
um** mora, nunca "onde todos" moram. Isto é restrição que a residência tem de respeitar, e não escolha
de residência. O argumento velho fica escrito e recusado de propósito: conclusão certa com argumento
falso morre na próxima leitura, e com ela morre a restrição.

**Motivo** acesso não registrado no instante **não se reconstitui depois**: é tão irrecuperável quanto
a venda que ninguém gravou, e é pior, porque a coisa que falta é justamente a prova de que o acesso
foi legítimo. `RN-PRV-006` promete ao cliente a lista das nossas leituras; sem este fato a promessa é
inexequível e o cliente lista os atos sob concessão — que hoje são zero — sem ver o que de fato
acontece no ambiente dele. E a segunda metade é a que quase ninguém escreve: se a trilha copiasse o
conteúdo lido, ela se tornaria um **segundo acervo** do dado sensível do cliente, com outra retenção
e outro leitor — a auditoria virando o vazamento que ela existe para detectar.

**Aceite** o `owner` lista, sem nos pedir, cada leitura nossa com autor, instante, objeto e
autoridade; a lista **não** contém nenhum valor lido, e nenhuma linha dela permite reconstruir o que
foi visto. Um papel nosso pedindo o que o eixo dele não alcança → existe fato de tentativa recusada,
e a negação não revela o que existe do outro lado (`RN-NUC-036`).

**Aceite das cláusulas** (a) `provider_administrator` — que **não muta** no ambiente do cliente — lê o
faturamento de A: a leitura acontece **e** o fato dela existe, e nenhuma das duas coisas amplia o
alcance de mutação dele em nada; conferência: repetir a bateria de `RN-PRV-004`, aceite, depois de mil
leituras, e os quatro desfechos continuam os mesmos. (b) Procurar, em qualquer papel nosso, a operação
que apaga, edita ou suspende o próprio rastro → ela **não existe** em nenhuma matriz, e pedir por ela é
tentativa recusada. (c) Com a gravação do fato indisponível, pedir a leitura → **recusada**, nunca
praticada em silêncio, e a recusa fica registrada do nosso lado. (d) Escolhida a residência em `D-06`,
os aceites (b) e (c) e a lista de `RN-PRV-006` continuam passando — se algum falha, a residência é que
está errada, não o aceite.

**Aceite das cláusulas (e) a (g)** (i) `provider_operator` trabalhando em A submete leitura carregando o
identificador de **B** → recusa (`RN-PRV-004` b) **e** existe fato de tentativa recusada com o
identificador pretendido (B) marcado como pretendido, o alvo resolvido (A) e a divergência como motivo;
nada é gravado no ambiente de B, e a lista de B não ganha nenhuma linha por causa desta tentativa.
(ii) Hoje, com `D-03` aberta e nenhum alvo resolvível, praticar qualquer ato nosso → recusado
(`RN-PRV-004` d) **e o fato da tentativa existe**, sem cliente-alvo resolvido; busca por tentativa
recusada descartada por campo obrigatório ausente → **zero**. (iii) Busca inversa, que é a que prova a
distinção: fato nosso que apresenta identificador pretendido no campo de alvo resolvido → **zero**; e
artefato de cliente que lista tentativa nossa cuja única ligação com ele é o identificador pretendido →
**zero**.

**Infeliz das cláusulas (e) a (g)** o campo obrigatório não tem valor e alguém o preenche com "o que
existe" para manter a simetria do registro. **Não se preenche** — é o desfecho (b) de `PRV-11`, e ele
grava N fatos sobre um cliente a partir de um pedido que nunca teve autoridade sobre ele. E o desfecho
oposto é pior: tornar o fato **ingravável** para preservar a obrigatoriedade troca recusa registrada por
recusa silenciosa, e some exatamente o rastro de sondagem com identificador alheio. Esta é a única classe
desta família em que a ausência de um campo **não** impede o fato, e a razão é que não há ato a impedir:
o ato já foi recusado.

**Infeliz** a operação de leitura dessa trilha **não existe** hoje: é `LACUNA-NUC-031`, cujo escopo
cresceu para "atos **e leituras** nossas", e a célula é do passo 7 — regra que muda desfecho de célula
e não entrega a célula **nasce inerte** (`AUT-14`). E se o cliente alcança ou não as leituras
**derivadas** que fazemos da operação dele é `LACUNA-PRV-008`, não presumido aqui.

**Enunciado, cláusulas acrescentadas em 2026-09-23 (`T-0019`, `F-019`).** (h) **A residência de (d)
está decidida:** a autoridade do fato mora do nosso lado e sobrevive à saída do cliente, e o cliente lê
uma projeção derivada dela, no ambiente dele ([[decision-d-06-ii-trilha-no-platform-com-projecao-no-cliente]];
forma em `docs/arquitetura/d-06-trilha-residencia-2026-09-23.md` §5), e o aceite (d) continua sendo o
critério. (i) **Leitura automática nossa é leitura desta regra.** A que percorre N clientes para responder pergunta de gestão
(`RN-PRV-014`) produz **um fato por cliente alcançado e por classe de objeto**, a cada rodada, e nunca
um fato só para a rodada. A sustentação é o item declarado que a autoriza (`RN-PRV-009`, `RN-PRV-014`);
no lugar da pessoa, o fato declara a origem automática e o papel nosso que declarou a leitura, e nunca
nomeia quem estava de plantão. (j) **Quem, visto pelo cliente:** o fato que o cliente lê nomeia o papel
e um **pseudônimo próprio daquele cliente** para a pessoa nossa. O pseudônimo da mesma pessoa em outro
cliente é outro, e nada entregue a um cliente liga os dois. A pessoa se resolve do nosso lado, pela
autoridade; o nome dela não está em fato nenhum enquanto o aviso do topo estiver de pé.

**Motivo das cláusulas (h) a (j)** saber, no cliente, que o ambiente dele foi lido e quando é
irrecuperável se não for gravado no instante, e a leitura automática é a que mais lê: fora da regra,
ela seria o caminho de maior volume sem trilha. A ordem de grandeza sobe de 10⁵–10⁶ para 10⁶–10⁷ fatos
(ESTIMATIVA de `d-06-trilha-residencia-2026-09-23.md` §11, parâmetros ilustrativos), e o lado nosso
suporta isso por partição (decisão do thread, `tarefas/T-0019-d-06-ii-residencia-da-trilha.md`, seção
"thread — 2026-09-23 (respostas às perguntas do F.1)"). O pseudônimo por cliente é o que impede a
trilha de virar chave de correlação de pessoas entre clientes, e é a única parte irreversível: o que já
saiu numa exportação não volta (`d-06-trilha-residencia-2026-09-23.md` §9).

**Aceite das cláusulas (h) a (j)** (iv) rodada automática sobre os clientes A, B e C, lendo duas classes
→ seis fatos; o `owner` de A lista os dois dele, com a origem automática, e nenhum de B ou de C. (v) a
mesma pessoa nossa lê A e depois B → A e B veem pseudônimos diferentes, nenhum com o nome, e juntar as
exportações dos dois não liga as linhas à mesma pessoa. (vi) o cliente C encerra o contrato → a lista
dele sai com ele, e a autoridade continua respondendo "o que lemos em C", do nosso lado.

**Infeliz das cláusulas (h) a (j)** a gravação falha para B no meio da rodada → a leitura de B não
acontece (cláusula c), A e C seguem, e a falha é visível do nosso lado. Agrupar os fatos da rodada por
dia para economizar é o contador por dia que a tabela da §2 recusa.

### RN-PRV-012 — Ato nosso no ambiente do cliente é fato append-only, com motivo enumerado e efeito declarado

**Enunciado** todo ato de papel nosso no ambiente de um cliente — editar usuário dele, mudar módulo,
interagir com cliente-final dele, conceder ou revogar concessão — é **fato**, nunca edição de estado:
linha nova, append-only, com autor, papel, instante, objeto, **motivo de lista enumerada** (§2.1) e,
quando o ato tem efeito conhecido sobre o que o cliente paga, o **efeito declarado no momento do ato**
(`RN-PRV-007`). Correção é fato novo referenciando o anterior. O fato nomeia **quais campos** foram
alterados; ele não carrega valor de credencial nem dado de pagamento.

**Motivo** duas coisas se somam. A primeira é `.claude/rules/dados.md` §4: estado sobrescrito destrói
a prova de por que a fatura foi aquela. A segunda é a razão de o **motivo ser enumerado**: sem
enumeração, a pergunta "por que mexemos tanto neste cliente" só tem resposta por leitura de texto
livre, que ninguém faz — e a diferença entre *suporte consertando defeito nosso* e *suporte fazendo
manualmente o que o produto deveria fazer* é exatamente a informação de produto mais valiosa que este
arquivo pode produzir. Enumeração aplicada depois, sobre texto livre, não estreita nada
(`convention-campo-de-texto-livre-nao-e-campo-enumeravel`): ela vale se nascer com o campo.

**Aceite** ligar um módulo, desligar, religar → **três** fatos, nenhum apagando o anterior, e "quais
módulos estavam ativos no dia 12" é respondível (`RN-PRV-007`). Ao fim do mês, "quantos atos nossos
foram **defeito nosso** e quantos foram **configuração do cliente**" é respondível **sem** ler texto
livre nenhum. E o `owner` lista todos eles (`RN-PRV-006`).

**Infeliz** o ato não tem motivo na lista → é registrado como **não classificado**, que é trabalho
visível nosso, e a lista cresce por alteração desta regra, com a `RN` dona citada. Nunca se acomoda
motivo novo em motivo existente "porque é parecido". E **quem confirma** mudança de módulo que altera
cobrança continua sendo `LACUNA-PRV-003`: até fechar, a operação é negada a todos (`RN-NUC-039`).

### RN-PRV-013 — Ciclo de vida do cliente, do módulo, do schema e do terminal é fato; o "estado atual" é derivado dele, nunca a fonte

**Enunciado** provisionar cliente, ativar e desativar módulo, aplicar migration em um schema,
habilitar terminal a vender por um estabelecimento, renovar essa habilitação, declarar terminal
comprometido e encerrar o cliente são **fatos datados e append-only** (§3). Nenhum deles é lido de um
campo de estado sobrescrito: o estado corrente é **derivação** dos fatos, e onde ele for
materializado, é reconstruível a partir deles. **Falha também é fato:** migration que falhou no schema
7 de 20 produz fato, com a versão, o schema e o desfecho — não é ausência de fato.

**Motivo** é o que o humano chamou de "gestão do esquema de banco", e é a única forma de responder
três perguntas que só existem somando clientes: *qual cliente está atrás*, *desde quando*, e *o que
ele tinha ligado quando aquilo aconteceu*. Sem os fatos, essas respostas viram inspeção manual de
ambiente — que é o mecanismo velho, não escala em N clientes e não deixa rastro. E o **estado
derivado** é o que impede o defeito clássico do multi-tenant: um campo "módulos ativos" corrigido à
mão que passa a discordar do histórico de cobrança sem que nada acuse.

**Aceite** para um cliente qualquer, respondível sem inspecionar o ambiente dele: em que dia foi
provisionado, quais módulos estavam ativos em uma data passada, qual versão de migration cada schema
dele alcançou e quando, quantos terminais estão habilitados a vender e desde quando. Reconstruir o
estado corrente a partir dos fatos dá o mesmo resultado que o estado corrente exibido — divergência é
achado, não curiosidade.

**Infeliz** o ambiente foi ajustado à mão e o fato não existe → é **drift**, e drift é defeito
(`.claude/rules/migrations.md` §9): o ajuste vira fato no mesmo dia, com autor e motivo, ou os
ambientes divergem em silêncio. Desligar módulo **não apaga dado** (`.claude/rules/dados.md` §5) — o
fato de desligamento é o que explica por que a série do cliente para naquele dia (`RN-REL-005`).

### RN-PRV-014 — Pergunta nossa não cria fato novo no ambiente do cliente

**Enunciado** nenhuma pergunta de gestão nossa — módulo mais usado, módulo não usado, volume de
operação, pico, tempo de conclusão — justifica **coletar fato novo** no ambiente do cliente. Ela é
respondida por leitura sobre o grão que a operação dele **já** produz (`RN-NUC-041`, que faz cada fato
declarar operação e módulo dono) ou, quando não for possível, pelo veículo de `RN-PRV-009`: item
declarado, com o papel nosso que o lê, a decisão que informa e **por que não é fato de negócio do
cliente**. Item sem as quatro declarações não é coletado.

**Enunciado, cláusula acrescentada em 2026-08-23 (`PRV-16`) — a leitura declara a forma, e forma não
declarada não é lida.** Pergunta nossa respondida por **leitura derivada** sobre o grão que a operação do
cliente já produz declara, junto da decisão, a **forma admissível** e a **forma recusada** daquela
leitura. Sem as duas, a forma é escolhida por quem implementa, e a forma que qualquer um escreve é a mais
fina que o dado permite — que é como esta regra passa a autorizar exatamente o que ela existe para
impedir. **O caso que originou a cláusula, e ele é o precedente:** "módulo contratado e nunca usado" tem
forma admissível **binária** (existência de fato de operação na janela) e forma recusada **contagem,
série, curva ou ordenação**, em qualquer resolução — escrito em `RN-PRV-019` (item 6), com a janela em
`LACUNA-PRV-013`. Toda leitura derivada futura herda esta exigência, e leitura cuja forma admissível não
esteja escrita **não acontece**.

**Motivo** é a fronteira entre base rica e base nossa dentro da casa do cliente. O grão fino existe
para o **negócio dele**; usá-lo para responder pergunta nossa é leitura, e leitura tem alcance
declarado, cláusula e trilha (`RN-PRV-010`, `RN-PRV-011`). Já **coletar** algo novo só porque a
pergunta é nossa cria um canal que ninguém autorizou e que cresce por refinamento — e cada refinamento
parece razoável, que é exatamente o risco secundário registrado no plano da T-0004: contagem de
operação por hora, por estabelecimento, **é** a curva de vendas do cliente escrita em outra unidade.

**Aceite** para cada pergunta de gestão nossa, a fonte é nomeada como "fato `<nome>` da operação do
cliente" ou como "item declarado de `RN-PRV-009`" — e nenhuma é "coleta própria". Teste negativo:
nenhum fato deste arquivo nasce **só** porque nós queremos saber; os de §2 e §3 existem porque **nós**
praticamos o ato ou porque o ato é sobre o ambiente que nós operamos.

**Infeliz** a pergunta é boa, o grão do cliente não a responde e o item de `RN-PRV-009` não sustenta a
declaração "não é fato de negócio" → então é **leitura de dado de negócio**, e o veículo é
`operacao-do-provedor-alcance.md` §2, com cláusula e trilha. O **critério** da fronteira é
`LACUNA-PRV-002`, do passo 2, e não se escreve aqui.

### RN-PRV-021 — Sugestão nossa nomeia os fatos que a sustentam, e projeção nunca chega ao cliente com a autoridade do fato · **PROVISÓRIA** (`LACUNA-PRV-004`, `LACUNA-PRV-007`)

**Enunciado** (a) **Sustentação enumerável, e do mesmo cliente.** Sugestão nossa a um cliente só é
emitida se os fatos que a sustentam forem **enumeráveis um a um** e forem **todos daquele cliente**.
Sugestão cuja sustentação não é enumerável **não é emitida**; sugestão que precisaria de fato de outro
cliente **não é entregável** (`RN-PRV-017` c), e o veículo — artefato ou boca de pessoa — não altera isso.
(b) **Registro.** O fato `provider_advice_issued` carrega os fatos sustentadores e a **versão da
derivação** que os combinou; por `RN-PRV-011` (c), fato não gravável impede a leitura, e aqui impede a
**entrega**: sem o registro, a sugestão não acontece.
(c) **Correção da sustentação.** Quando um fato sustentador é **corrigido** — e correção é fato novo
(`RN-NUC-008`, `RN-REL-007`) —, a sugestão que dependia dele fica marcada como **sustentação alterada**,
visível ao cliente. Ela **não** é atualizada em silêncio, **não** é apagada e **não** é recalculada: as
três apagariam a única evidência de que a recomendação repousava num número que mudou.
(d) **Projeção.** Sugestão que contém **projeção** — qualquer valor sobre período que ainda não fechou —
cumpre quatro coisas, e sem as quatro ela é fato falso: **(d.1)** declara a **natureza** de projeção junto
do valor, e a declaração **sobrevive à extração** (exportação, cópia, impressão, leitura em voz alta) —
cada linha extraída carrega a natureza, nunca só o cabeçalho ou a apresentação; **(d.2)** carrega o **erro
medido** sobre períodos **fechados** que **não** participaram da derivação, na **unidade da decisão** que
ela informa, e a projeção **não é emitida antes de esse erro existir**; **(d.3)** **nunca** entra em
total, soma ou série junto com fato — total que mistura fato e projeção **é** projeção, e é rotulado como
tal; **(d.4)** a **precisão exibida não excede** a que o erro medido sustenta.
(e) **Responsabilidade.** De quem é a responsabilidade quando o cliente decide a partir de número nosso
errado é `LACUNA-PRV-007`, do humano — e não é presumida aqui. O que as cláusulas (a) a (d) produzem é a
condição sem a qual a pergunta **não é respondível**: com elas, existe em disco qual número sustentou
qual sugestão, em que versão, e se ele foi corrigido depois.

**Motivo** três defeitos diferentes têm a mesma causa e a mesma cura. **O primeiro:** sugestão sem
sustentação enumerável é opinião nossa com aparência de derivação — e do lado do cliente `RN-REL-007` já
proíbe o relatório de recalcular e de esconder a correção, enquanto do **nosso** lado não havia nada.
**O segundo:** exigir que os fatos sejam do **mesmo** cliente transforma `RN-PRV-017` (c) de promessa em
**propriedade** — uma sugestão comparativa deixa de ser gravável e, por (b), deixa de acontecer; o aceite
"artefato nosso cuja fonte inclua fato de outro cliente → zero" passa a ser conferível na **trilha**, e
não na intenção. **O terceiro é o mais caro e é o motivo de (d):** projeção errada apresentada com a mesma
autoridade do fato é pior que nenhuma projeção, porque o leitor não tem como saber qual dos dois está
olhando. E a distinção não pode viver na apresentação: um número projetado que é exportado, copiado numa
mensagem ou dito no telefone chega ao destino **sem** o que o distinguia. Por isso a natureza acompanha o
**valor**, não o artefato — e por isso (d.4) existe: exibir projeção com precisão de centavo quando o erro
medido é de ordem de grandeza é mentir pela precisão, sem afirmar nada falso.

**Aceite** cinco, todos conferíveis. **(1)** emitir sugestão cuja derivação usa fato de outro cliente →
**não gravável**, logo **não emitida**; e a busca por `provider_advice_issued` cuja lista de sustentação
contenha fato de outro cliente devolve **zero**. **(2)** corrigir uma venda que sustentava uma sugestão
entregue → a sugestão aparece como **sustentação alterada**, com o vínculo navegável para o fato original
e para a correção; nenhum valor da sugestão original é reescrito. **(3)** exportar um artefato que contém
projeção → cada linha projetada chega ao destino identificada como projeção, com o erro medido ao lado;
comparar a exportação com o artefato não perde nenhuma das duas informações. **(4)** pedir o total de um
período que mistura três meses fechados e o mês em curso projetado → o total é entregue **rotulado como
projeção**, ou não é entregue. **(5)** emitir projeção antes de existir erro medido sobre período fechado
fora da derivação → **negada**, e a negativa diz que falta a medida, não que falta autorização.

**Infeliz** o cliente pede a sugestão e a sustentação não é enumerável, ou o erro medido reprova. Então a
sugestão **não é entregue**, e o que se entrega é o que sustenta uma decisão sem projetar nada: os fatos
dele, no recorte da decisão, comparados **com ele mesmo** (`RN-PRV-017`, infeliz). **Necessidade
preservada:** o comerciante quer decidir compra, produção e escala com antecedência, e essa necessidade
não se recusa. **Mecanismo recusado:** entregar a projeção sem o erro medido, ou com o erro escondido na
apresentação — porque o custo do erro é dele e a autoridade do número é nossa. **Por que o nosso é
melhor, e como se prova:** a projeção que sobrevive ao critério é a que ele pode auditar contra o que
aconteceu; prova-se guardando a projeção **antes** do período que ela projeta — projeção não registrada
antes é inavaliável para sempre, e essa é a única parte disto que é irrecuperável.

---

## 2. Os fatos que os papéis nossos produzem

Ator, em todos: pessoa + papel de `RN-PRV-003` que autorizou o ato (`RN-NUC-029`). Instante: o do
servidor nosso — é aqui que a coluna 2 do irmão muda de sujeito, e a leitura que **compara** ato nosso
com fato do cliente cai em `LACUNA-GLO-001` como qualquer outra. "Consome": **C** = cliente,
**P** = provedor.

| Fato | Instante | Decisão que informa (e de quem) | Consome | Grão candidato |
|---|---|---|---|---|
| `provider_read` — leitura nossa de dado de negócio do cliente | ao alcançar o dado | **C** (`owner`): conferir que o alcance corresponde à cláusula (`RN-PRV-010`). **P**: quanto acesso ao dado do cliente a nossa operação realmente exige — e um alcance usado toda semana é sinal de que falta capacidade de diagnóstico que não precisa ler faturamento (`RN-PRV-004`, infeliz) | C · P | uma linha por leitura, com classe de objeto, autoridade e motivo enumerado; a automática, uma por cliente e por classe a cada rodada (`RN-PRV-011` i); **nunca** o conteúdo lido, nunca contador por dia |
| `provider_read_refused` — tentativa nossa recusada | na recusa | **P**: papel mal configurado, alcance mal desenhado, ou alguém pedindo o que não deve | P · **C**? → `LACUNA-PRV-009` | uma linha por tentativa, com o motivo enumerado de `RN-NUC-043` e o **identificador pretendido** marcado como tal; **sem** cliente-alvo resolvido quando a resolução é o que falhou, e **nunca** residente no ambiente do cliente apontado pelo identificador pretendido (`RN-PRV-011` e–g) |
| `provider_user_edit` — suporte editou usuário, papel ou atribuição do cliente | no ato | **C**: o que mudou no acesso da equipe dele, e por quem. **P**: qual edição repetimos tanto que ela é **capacidade faltando** na superfície do cliente | C · P | uma linha por ato, com objeto e **quais campos**; nunca valor de credencial |
| `provider_module_change` — módulo ativado ou desativado por papel nosso | no ato | **C**: por que a fatura dele mudou. **P**: base de cobrança, e módulo contratado que nunca produziu fato de operação | C · P | fato append-only com efeito de cobrança declarado no ato (`RN-PRV-007`); três atos = três linhas |
| `provider_customer_interaction` — papel nosso interagiu com cliente-final do cliente | no ato | **C** (`owner`): ele responde por conversa que não teve, então precisa ver que fomos nós (`RN-PRV-008` a). **P**: volume de interação nossa por cliente é diagnóstico de defeito de produto, não de atendimento | C · P | uma linha por interação, com objeto e o dado pessoal **mínimo** que ela exigiu, item por item (`RN-PRV-008` b); texto do cliente-final permanece opaco (`RN-OFF-027`) |
| `provider_concession_granted` · `provider_concession_revoked` — concessão de `provider_support` | no ato | **C**: quem entrou no ambiente dele, com que escopo e por quanto tempo. **P**: quantas vezes a exceção foi usada — exceção rotineira é papel faltando ou alcance errado | C · P | uma linha por concessão e uma por revogação, com escopo, prazo e motivo enumerado (`RN-NUC-024`) |
| `provider_advice_issued` — sugestão nossa entregue ao cliente · **PROVISÓRIA** (`LACUNA-PRV-004`, `LACUNA-PRV-007`) | na entrega | **C**: em que número a sugestão se apoiou. **P**: responsabilidade quando o número nosso está errado — o cliente tem `RN-REL-007`, e o **mecanismo** do nosso lado passou a ser `RN-PRV-021` em 2026-08-23; de quem é a responsabilidade continua sendo `LACUNA-PRV-007` | C · P | uma linha por sugestão, com os fatos que a sustentaram — **todos do mesmo cliente** (`RN-PRV-021` a) — e a versão da derivação; quando há projeção, a natureza e o **erro medido** (`RN-PRV-021` d); sem isso a sugestão **não é emitida**, e não apenas inauditável |

### 2.1 O motivo é enumerado, e a lista é fechada

Vale para `provider_read`, `provider_user_edit`, `provider_module_change`,
`provider_customer_interaction` e para a concessão. Motivo novo entra por alteração de `RN-PRV-011` ou
`RN-PRV-012`; ocorrência que não cabe é `unclassified`, que é **trabalho visível nosso**.

| Motivo | O que ele separa |
|---|---|
| `incident_reported` | o cliente relatou um problema — é o caso que a concessão de `RN-NUC-024` foi desenhada para atender |
| `defect_investigation` | **defeito nosso** suspeito, sem relato do cliente. É o motivo que, contado, diz onde o produto falha |
| `provisioning_or_change_request` | pedido do cliente para mudar ambiente, módulo ou usuário |
| `billing_verification` | conferência de cobrança — e é o único que toca faturamento, logo o único que o eixo de mutação **não** alcança (`RN-PRV-004`) |
| `advisory_preparation` | preparar sugestão de melhoria ao cliente. Depende de `LACUNA-PRV-004` (interno × vendável) |
| `legal_or_fiscal_obligation` | exigência externa. Nada aqui afirma base legal, e nada cita norma |
| `unclassified` | nenhum dos anteriores → defeito de classificação nosso, visível |

---

## 3. Os fatos do ciclo de vida — cliente, módulo, schema, terminal

| Fato | Instante | Decisão que informa (e de quem) | Consome | Grão candidato |
|---|---|---|---|---|
| `tenant_provisioned` — cliente provisionado do zero | ao concluir o provisionamento | **P**: quanto tempo leva pôr um cliente em pé, e onde o provisionamento falha; é também a origem de toda série do cliente ("medido desde quando") | P · C | uma linha por cliente, com o conjunto de migrations aplicado e os módulos contratados na origem |
| `module_state_change` — módulo ativado ou desativado | no ato | **C**: desde quando a série existe (`RN-REL-005`) e por que a fatura mudou. **P**: módulo ativo **sem nenhum** fato de operação = contratado e não usado — a pergunta do humano que só esta linha responde, e a **forma admissível é binária** (existência de fato de operação na janela), nunca contagem, série, curva nem ordenação de clientes (`RN-PRV-014`, cláusula da forma; `RN-PRV-019` item 6; janela em `LACUNA-PRV-013`) | C · P | o **mesmo** fato de `provider_module_change` quando o autor é nosso; autor do cliente quando `LACUNA-PRV-003` disser que é dele. Um fato, dois autores possíveis — nunca dois fatos |
| `migration_applied` — migration aplicada a **um** schema | fim da aplicação naquele schema | **P**: qual cliente está atrás, onde um release quebrou, se é seguro avançar | P | uma linha **por (schema, versão)**, com desfecho e duração; **falha é linha**, não ausência (`RN-PRV-013`) |
| `sales_enablement_granted` · `sales_enablement_renewed` — terminal habilitado a vender por um estabelecimento | no ato, com contato | **C**: quantos terminais podem vender em nome dele, e desde quando. **P**: parque instalado e renovação que não acontece (terminal que vai vencer é caixa que vai parar) | C · P | uma linha por concessão e por renovação, com o estabelecimento e a validade vigente (`business-rule-habilitacao-a-vender-do-terminal-tem-prazo`) |
| `terminal_compromised` — furto, perda ou destruição declarados | na declaração | **C** (`owner`/`manager`): revogar, e saber **qual janela** ficou aberta. **P**: frequência real de comprometimento, que é o que justifica o prazo escolhido | C · P | uma linha por declaração, com a revogação no servidor (`RN-OFF-016`, `RN-EMI-038`) e a **janela** até o vencimento offline — a revogação não alcança o terminal sem contato (`gotcha-revogacao-de-terminal-nao-alcanca-offline`) |
| `tenant_offboarded` — cliente encerrado · **PROVISÓRIA** (`LACUNA-PRV-006`) | no encerramento | **C**: ele leva o dado dele (`PN-10`). **P**: o que sobrevive da nossa observação, e por quanto tempo — número que não é meu | C · P | uma linha por encerramento, com o que foi entregue ao cliente e o que ficou; a retenção é lacuna |

---

## 4. O que os fatos nossos **nunca** carregam

1. **O conteúdo lido.** A trilha nomeia o que foi alcançado; copiar o conteúdo cria um segundo acervo
   do dado do cliente, com outro leitor e outra retenção (`RN-PRV-011`).
2. **Número completo de cartão, código de segurança e trilha** — nem para o `provider_administrator`
   (`operacao-do-provedor-alcance.md` §2.2). O piso não tem exceção de utilidade.
3. **Valor de segredo de emissão** e nada que reproduza a **capacidade de assinar** (`RN-EMI-007`,
   `RN-EMI-033`).
4. **Dado pessoal de cliente-final além do mínimo** que aquela interação exigiu, item por item
   (`RN-PRV-008` b, `RN-EMI-017`) — e a cláusula de contrato do cliente **não** consente em nome dele
   (`RN-PRV-008`, infeliz).
5. **Texto de terceiro como campo de decisão** (`RN-OFF-027`): presença, nunca conteúdo.
6. **Credencial, chave ou valor de campo sensível** em fato de edição: o fato diz **quais campos**
   mudaram, não o que passaram a valer.

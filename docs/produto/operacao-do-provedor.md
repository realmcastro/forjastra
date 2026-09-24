# Operação do provedor — o quinto escopo e os papéis nossos

> **O que este arquivo é.** O **endereço** de um território que a spec deportou quatro vezes sem lhe dar
> casa: `papeis-e-permissoes.md:189`, `modulos/relatorios-semente-de-perguntas.md:186`, `RN-REL-006` e
> `RN-EMI-040`. Aqui ficam o escopo, o vocabulário e os **papéis nossos**. `RN-EMI-040` já dizia que a
> contagem cross-cliente é "dado nosso, com **papel nosso**" — o papel estava prometido e não tinha
> arquivo. Este é o arquivo.
>
> **Três arquivos, um conjunto normativo.** Eram dois; o terceiro nasceu em 2026-08-23, quando o conserto
> da auditoria levou este arquivo a 414 linhas. Eixos: **quais papéis existem** × **o que eles alcançam e
> sob que autorização** × **a trava que o escopo não herda de ninguém**. Aqui: o escopo, a desambiguação
> do nome, os três papéis e os dois eixos de alcance (`RN-PRV-001` a `006`). Em
> `operacao-do-provedor-alcance.md`: o que o suporte muda, a interação com o cliente-final, a observação
> declarada, a **decisão de 2026-08-23** sobre o administrador geral, o consentimento por cláusula de
> contrato e o que nunca se entrega a um cliente (`RN-PRV-007` a `010`, `017`) — mais **as perguntas e as
> lacunas dos três**. Em `operacao-do-provedor-autorizacao.md`: o default fechado do escopo e o campo em
> que o ato nosso se sustenta (`RN-PRV-015`, `016`). Numeração contínua e imutável entre os três, sem
> hierarquia.
>
> **O que este arquivo não é.** Não é console, tela, painel nem rota (passo 7 da T-0004). Não é a lista
> de fatos a registrar nem o **grão** de cada um (passos 3 e 4). Não é tabela, coluna, retenção em dias,
> nem onde mora o agregado cross-cliente (`D-06`, passo 4). Nenhuma célula de autorização é valorada
> aqui.
>
> **Numeração.** Código `PRV`, escopo `provedor`, reservado em `glossario.md` §4.3 nesta mesma passada.
> Os três arquivos consomem `RN-PRV-001` a `010`, mais `RN-PRV-015` a `017`, acrescentadas em 2026-08-23
> pelo conserto da auditoria (`PRV-02`, `PRV-03`, `PRV-10`); `RN-PRV-011` a `014` são de
> `fatos-de-operacao-provedor.md`. Quem numerar depois começa em `018`. Nada foi renumerado, e a
> numeração é imutável.
>
> **Decisões abertas, nenhuma presumida:** `D-01`/`D-02` — **se o que opera o nosso lado é a mesma
> aplicação do PDV ou outra** não se decide aqui, e nenhuma regra depende da resposta. `D-03` — o irmão
> traz a pergunta, agravada, não a resposta. `D-04`, `D-05` — intocadas.
>
> **Formato:** `Enunciado` · `Motivo` · `Aceite` · `Infeliz`. Escopo de **toda** regra: `provedor`.
> Nenhum número (prazo, retenção, teto, preço) é escrito aqui: número é lacuna com dono.

---

## 1. O endereço

### RN-PRV-001 — Existe um quinto escopo, `provedor`, e ele é o nosso negócio — nunca a venda de ninguém

**Enunciado** além de núcleo, módulo, vertical e cliente existe o escopo **`provedor`**: o que **nós**
precisamos para operar, sustentar, faturar e melhorar a Forja para N clientes. Ele **contém** os papéis
nossos (§2), o que observamos para operar (`RN-PRV-009`), a contagem que só existe somando clientes
(`RN-EMI-040`, `RN-REL-006`) e a nossa própria trilha. Ele **nunca contém** regra de venda, capacidade
ativável por cliente, nem papel de cliente. Nenhuma regra `RN-PRV` aparece em superfície, manifesto,
exportação ou relatório de cliente; nenhuma configuração de cliente altera uma delas.

**Motivo** ele não é nenhum dos quatro, e cada tentativa de encaixá-lo produz um defeito diferente. Não
é **núcleo**: não vende, e o teste dos três negócios não se aplica — posto, padaria e loja de roupa não
precisam de nada disto para operar. Não é **módulo**: o cliente não o ativa, não é opt-in, e o campo 6
de `catalogo-de-capacidades.md` §1 só admite `nucleo|modulo|vertical`, então uma capacidade nossa não
tem nem como ser escrita lá. Não é vertical nem cliente. Sem endereço, o destino de tudo que é nosso foi
o mesmo quatro vezes — "fora do escopo de qualquer cliente" —, que diz onde **não** fica e não diz onde
fica; e o que não tem lugar aterrissa no lugar errado na hora do aperto, que é a Fase 1.

**Aceite** classificar item por item, e cada um cair em um escopo só: *quanto o cliente nos paga* →
`provedor`; *quais módulos ele tem ativos* → **plataforma** (`RN-PRV-002`); *quem pode dar desconto
acima do limite* → núcleo; *quantas habilitações cabem por UF* → `provedor` (`RN-EMI-013`,
`RN-EMI-040`). Teste negativo, que é o que prova a regra: buscar `RN-PRV` em qualquer arquivo de
superfície, relatório ou exportação de cliente → **zero** ocorrências.

**Infeliz** um item parece dos dois — o caso real é a **observação de operação**, que serve para nós
operarmos e descreve o negócio dele. Não se escolhe: o item é declarado com o motivo pelo qual não é
fato de negócio (`RN-PRV-009`), e o critério da fronteira é `LACUNA-PRV-002`, **aberta**. Item sem
declaração não é coletado — falha fechado.

### RN-PRV-002 — "Plataforma" nomeia o mecanismo; o nosso negócio se chama `provedor`

**Enunciado** **plataforma** fica reservada ao **mecanismo** que faz um produto servir N clientes e N
ramos: isolamento por cliente, registro de módulo ativo, manifesto, ciclo de migration, provisionamento
(`glossario.md` §2, `fronteira-do-nucleo.md` §1). O **nosso negócio** se chama **provedor** — o termo já
existe no glossário (`provider`: "quem fornece a Forja; não é cliente (tenant) e não tem escopo de
cliente") e já governa o único identificador nosso em uso (`provider_support`). A expressão **"operação
da plataforma" está retirada**: onde ela aparece, leia "operação do provedor". **Nada é renomeado** —
quem cede o nome é a expressão frouxa, não o mecanismo.

**Motivo** a palavra tinha **três** sentidos em colisão: o schema `platform` de controle
(`.claude/rules/dados.md` §1), o escopo `plataforma` da memória, e "operação da plataforma" como o nosso
negócio. Os dois primeiros são o **mesmo** sentido em duas altitudes; o terceiro é espécie diferente com
o mesmo nome. Este projeto já quase pagou esse defeito com a palavra "restaurante", e a lição registrada
é que nome errado **viaja para nome de componente e de coluna**. Aqui o trajeto é curto e datado: a Fase
1 começa depois desta ficha, e o schema `platform` vai guardar registro de cliente, módulo ativo e
versão de migration. Se o nosso negócio herdasse o nome, "onde mora o faturamento?" e "onde mora a
telemetria?" ganhariam resposta **por semelhança de palavra**, sem ninguém decidir — e essa decisão é
`D-06`, do passo 4, não de um nome.

**Aceite** o teste de leitura, três perguntas: *onde mora o registro de módulos ativos?* → plataforma.
*Onde mora quanto o cliente nos paga e o que observamos dele?* → provedor. *Onde mora o agregado que
soma clientes?* → **não se responde pelo nome**; é `D-06`, e quem responder por semelhança de palavra
errou por construção. Segundo aceite: nenhum arquivo novo usa "plataforma" como sujeito do nosso
negócio.

**Infeliz** um texto vigente ainda diz "operação da plataforma" — hoje `RN-EMI-040` (enunciado) e
`LACUNA-NUC-011`. O **referente** dos dois é exatamente este escopo, então nenhuma regra muda de
desfecho e nenhuma célula é afetada: a correção é de prosa, com dono (`produto`). Retirada de expressão
**não** é revogação de regra — o que exige ato datado é revogar negativa (`RN-PRV-010`), não trocar uma
palavra pelo seu referente.

---

## 2. Os papéis nossos, e os dois eixos de alcance

O humano nomeou dois: o **suporte** (que "faz a gestão") e o **administrador geral**. Somados a
`provider_support`, que já existe, são **três** posições nossas — e a descoberta que organiza a seção é
que elas não se ordenam em uma escala: **leitura** e **mutação** são eixos independentes, e o suporte é
o caso invertido do que se supõe (lê pouco, muda muito).

**Nenhum deles é papel de cliente, e `RN-NUC-018` alcança os três.** As três matrizes têm **cinco
colunas de papel**, e a quinta é `provider_support` — que é papel **nosso**
(`papeis-e-permissoes.md:129`, coluna "De quem") e **continua sendo coluna**: negado em toda linha
exceto a **26** ("operar sob concessão", `R`), e com a decisão offline sempre **recusa**
(`matriz-operacao-papel.md:51-52`, `:54`, `:81`). O que **não** é coluna
de matriz de cliente são os **dois papéis novos**, `provider_operator` e `provider_administrator`. A
matriz do escopo `provedor` é o passo 7, com **valor de célula em branco**; a tabela de `RN-PRV-003` é
**prova de existência**, na forma de `RN-NUC-019`, e não é a matriz.

**Correção datada — 2026-08-23, achado `PRV-01` [CRÍTICO].** Até esta data (a passada em que este
arquivo nasceu) este parágrafo dizia que as três matrizes têm "por coluna os cinco papéis **de
cliente**" e que `RN-NUC-018` **não alcança** os papéis nossos "porque o escopo deles não é cliente nem
estabelecimento". **As duas frases caem, e o custo está escrito abaixo.** A primeira é falsa em disco: a
quinta coluna é `provider_support`, papel nosso. A segunda invertia o lado de que a regra fala —
`RN-NUC-018` avalia a autorização no escopo do **objeto**, e todo objeto de ato nosso (o usuário do
cliente, o registro de módulo dele, a venda dele) pertence a **um** estabelecimento de **um** cliente;
que o **sujeito** não tenha nível de escopo próprio não põe o **objeto** fora do alcance dela. Com a
exclusão caía também a única cláusula do repositório que proíbe resolver escopo por identificador
informado no pedido (`papeis-e-permissoes.md:101`) — retirada exatamente do papel que **escreve** em N
clientes. **Custo da retirada da exclusão, escrito:** os papéis nossos não têm nível de escopo próprio,
então a autorização deles passa a depender de o **cliente-alvo** ser resolvido por caminho que não seja
o pedido — e esse caminho é `D-03`, terceiro eixo, **aberta**. Consequência aceita: até `D-03` fechar, o
ato nosso que nomeia cliente **não acontece** (`RN-PRV-004`, cláusula d). Papel inoperante é preço
menor que escrita no cliente errado, que é irreversível por construção neste desenho (fato append-only,
`RN-PRV-007`).

**Colisão de vocabulário, declarada em vez de resolvida em silêncio:** o humano chama de "suporte" o
papel que **muta**, e o identificador `provider_support` já está gasto no papel de **concessão**
(`RN-NUC-019`, `RN-NUC-024`) — que é coluna de matriz e é citado por meia dúzia de regras numeradas, logo
não se renomeia. Mapeamento, para a conversa não ficar ambígua: "**suporte**" = `provider_operator`;
"**papel do provedor no cliente**" = `provider_support`, que é o nome que a tabela de `RN-NUC-019` já
usa. É dívida de nome, e está declarada como tal.

### RN-PRV-003 — Os papéis do provedor são conjunto fechado e vivem fora do conjunto do núcleo; os dois novos não são coluna de matriz de cliente

**Enunciado** os papéis de escopo `provedor` são exatamente os três da tabela. Papel novo entra por
alteração desta regra, com a frase do teste de remoção escrita (`RN-NUC-017`). Nenhum integra o conjunto
fechado do núcleo (`RN-NUC-019`), nenhum aparece em nome, condição ou regra de núcleo, e a autorização
de todos é verificada no backend (`PN-11`). Quanto a coluna de matriz de cliente, a frase é precisa e
foi corrigida em 2026-08-23 (`PRV-01`): `provider_operator` e `provider_administrator` **não** são
coluna de nenhuma das três; `provider_support` **é** coluna e assim permanece — negado em toda linha
exceto a **26**, que é a própria operação de operar sob concessão, e com a decisão offline sempre recusa.
É essa coluna que faz a não-instanciabilidade dele ser desfecho conferível e não promessa. **A
exclusão de `RN-NUC-018`, que este enunciado carregava, foi retirada:** a autorização de todo ato nosso
é avaliada no escopo do **objeto** (§2, correção datada; `RN-PRV-004`, cláusulas do objeto).

| Papel | No código | O que faz | Alcance de **mutação** | Alcance de **leitura** |
|---|---|---|---|---|
| Suporte | `provider_operator` | Conserta e ajusta o ambiente do cliente: edita usuário dele, muda e acrescenta módulo, interage com o cliente-final dele. | **amplo e declarado** — e o conjunto é **fechado pela matriz** do escopo `provedor` (passo 7); sem ela, cada operação é negada (`RN-NUC-039`) | **estreito** — nunca faturamento, nunca venda, nunca dado de pagamento |
| Administrador geral | `provider_administrator` | Responde pelo alcance do provedor: concede e revoga concessão de `provider_support`, e lê o negócio do cliente. | **nenhuma** no ambiente do cliente | **amplo** — decidido em 2026-08-23, com o piso do irmão §2.2 |
| Papel do provedor no cliente | `provider_support` | **Já existe**: diagnosticar e agir por concessão declarada, escopo mínimo, prazo, motivo, trilha (`RN-NUC-024`). | só o que a concessão nomeia | só o que a concessão nomeia |

**Motivo** as duas frases de remoção, e as duas são concretas. Sem `provider_operator`, quem edita
usuário e muda módulo é o `provider_administrator` — e então quem porta o alcance de leitura mais largo
que existe passa a portar também o de mutação, o que é exatamente a concentração que o desenho paga caro
para evitar. Sem `provider_administrator`, ninguém concede nem revoga concessão, e quem operasse teria de
conceder a si mesmo, que é o que `RN-NUC-024` (infeliz) proíbe em texto expresso. Os dois passam pelo
limbo (a) do teste de `RN-NUC-017`.

**`provider_support` não é estendido para mutação, e isto é recomendação de produto, com o custo à
vista.** A necessidade — consertar o ambiente do cliente — é legítima e está atendida por
`provider_operator`. Estender a concessão a mutação de rotina em N clientes revogaria, de uma vez,
escopo mínimo, prazo, motivo por incidente e "nunca mais de um cliente": sobraria o nome, que é
literalmente o risco principal registrado no plano desta ficha. Com a separação, a concessão continua
sendo o **veículo de exceção** para o que o alcance declarado de `provider_operator` não nomeia — e a
não-instanciabilidade de hoje (`LACUNA-NUC-031`) segue sendo desfecho correto, não pendência.

Os nomes em inglês ficam reservados aqui e devem entrar em `glossario.md` §1.6; o arquivo está em 396 de
400 linhas, então nesta passada só o **código** `PRV` entrou no registro (§4.3), que é o que impede
colisão de numeração. `provider_operator` **não é** `operator` do glossário (o sujeito que opera o PDV);
o sufixo segue o precedente de `production_operator`, que também é papel.

**Aceite** a lista de papéis de escopo `provedor` tem três entradas, e nenhuma aparece como coluna em
`matriz-operacao-papel.md`, `matriz-operacao-papel-modulos.md` ou `superficie-por-papel.md` — busca por
`provider_operator` e `provider_administrator` nesses três arquivos devolve **zero**.

**Infeliz** somos duas pessoas e três papéis parecem cerimônia. **Necessidade preservada:** trabalhar sem
trocar de papel a cada ato. **Mecanismo recusado:** um papel só que faz tudo — é o "usuário único do
balcão" de `PN-11` na nossa casa, e é pior aqui, porque do nosso lado não há segunda pessoa para
conferir. **O que o produto faz:** a mesma pessoa recebe mais de um papel, e cada ato registra **qual**
deles o autorizou (`RN-NUC-029`). Nada lhe é negado, e o registro continua dizendo com que autoridade
cada coisa foi feita — o ganho aparece no dia em que somos dez.

### RN-PRV-004 — Leitura e mutação são eixos independentes; nenhum papel nosso porta os dois amplos

**Enunciado** o alcance de **ler** e o de **mutar** são declarados separadamente por papel, e um nunca
implica o outro. Nenhum papel de escopo `provedor` porta os dois **amplos** ao mesmo tempo: quem muta
amplamente lê estreito, quem lê amplamente não muta no ambiente do cliente. Ato do cliente que é
**operação sensível** dele — cancelar venda, publicar preço, sangria, abrir gaveta — não está em nenhum
alcance nosso e só existe por concessão nomeada (`RN-NUC-024`), com as negativas absolutas dela intactas.

**Enunciado, cláusulas do objeto — acrescentadas em 2026-08-23 (`PRV-01`), e valem para leitura tanto
quanto para mutação.** (a) A autorização de todo ato e de toda leitura de papel nosso é avaliada no
escopo do **objeto** (`RN-NUC-018`), e o objeto pertence sempre a um estabelecimento de um cliente. (b)
O **cliente-alvo nunca se resolve a partir de identificador que o pedido informa**: ele é resolvido
antes, fora do pedido, e o objeto é resolvido **dentro** dele — nunca localizado primeiro e conferido
depois (é `RN-NUC-038` aplicada ao sujeito nosso). Identificador que o pedido carregue pode, no máximo,
**confirmar** o alvo já resolvido; divergência entre o informado e o resolvido é **recusa**, nunca
correção silenciosa. E nenhuma superfície nossa tem cliente-alvo **implícito**: o alvo é visível a quem
opera e nomeado no registro do ato (`RN-PRV-016`). (c) Um ato — e um escopo de trabalho — de papel nosso
nomeia **exatamente um** cliente, espelho de "nunca mais de um cliente" de `RN-NUC-024`; alcançar o
segundo exige ato novo de resolução, registrado. (d) A **entrada do ato de resolução** é um objeto já
vinculado a um cliente por autoridade que não é a nossa, nunca o cliente em si, e a lista é fechada:
(d1) pedido aberto no ambiente do cliente por sujeito dele autenticado (chamado, pedido de mudança, e a
concessão de `RN-NUC-024` quando `LACUNA-NUC-009` lhe der célula); (d2) fato nosso que nomeia o cliente
pelo registro do `platform` (`RN-PRV-013`: migration que falhou no schema X, provisionamento incompleto);
(d3) o ato que cria o cliente (`RN-NUC-090`), cujo alvo é o cliente criado. A pessoa entrega a referência
opaca do objeto, que só resolve com o objeto aberto e na fila **atribuída a ela**; ela vê a fila, nunca a
carteira. Lista ou busca de clientes, identificador digitado e "último cliente" implícito são recusados,
porque nos três o erro de mão cai num cliente que existe. Um escopo vigente por pessoa nossa, em qualquer
número de sessões: resolver o segundo encerra o primeiro, e o escopo só vale junto da pessoa autenticada
que o resolveu (`IDN-05`). Fora disso, o ato nosso que nomeia cliente **não acontece**: falha fechado.
(e) O eixo de **mutação** mede alcance sobre o **dado do negócio do cliente**; gravar a trilha do próprio
ato ou da própria leitura (`RN-PRV-011`) **não** é mutação, e não conta para "quem lê amplamente não muta".

**Correção datada — 2026-09-23, (d).** Dizia: enquanto `D-03` aberta, o ato nosso que nomeia cliente não
acontece. `D-03` fechou pela opção C, que dá o portador e deixa a entrada para cá (`docs/arquitetura/`,
`d-03-identidade-decisao-2026-09-23.md` §7; proposta em `T-0014`, aceita em `T-0015`). **Risco, em
consulta de `seguranca`:** a fila é enumeração parcial da carteira (`operacao-do-provedor-autorizacao.md` §3).

**Motivo** é a segregação de função, e é o desenho do próprio humano: o suporte conserta e **não vê
faturamento**; o administrador geral vê e **não conserta**. Sem a regra, a combinação "vê tudo e muda
tudo" nasce por acumulação de papéis, sem que nenhum passo a tenha decidido. E é a regra que salva o
desenho vigente: as negativas de `RN-NUC-024` (e) são todas sobre **agir** ou sobre classe de dado
vedada a todos — nenhuma é sobre **largura de leitura**. Confundir os eixos faria um administrador geral
legítimo parecer exigir a revogação de meia dúzia de regras que ele não toca, e revogação desnecessária
é o caminho mais curto para revogação silenciosa.

**Aceite** quatro tentativas, quatro desfechos: `provider_operator` pedindo faturamento, curva de vendas
ou dado de pagamento de qualquer cliente → **negado**, e a negação não revela o que existe do outro lado
(`RN-NUC-036`). `provider_administrator` tentando editar usuário, mudar módulo, cancelar venda ou
publicar preço → **negado**. Uma pessoa portando os dois papéis → cada ato registra qual papel o
autorizou, e a soma dos dois **não** produz alcance que nenhum dos dois tem. Com concessão nomeada, a
operação sensível do cliente segue negada quando (e) a veda em absoluto.

**Aceite das cláusulas do objeto** `provider_operator` está trabalhando no cliente A e submete
"desativar o módulo `FIS`" carregando o identificador de **B** — aba antiga, dígito trocado ou
requisição alterada → **negado**; nada é gravado em A nem em B; existe fato de tentativa recusada
(`RN-PRV-011`); e a recusa não revela que B existe (`RN-NUC-036`). O mesmo na leitura: a tela rotulada A
nunca devolve valor de B, e nenhum artefato entregue a A carrega número, ordenação ou comparação
derivada de B (`RN-PRV-017`). Terceiro caso, o que prova (c): um escopo de trabalho aberto em A não
alcança B sem um ato novo de resolução, e esse ato aparece no registro. Quarto, o que prova (d): a
referência do pedido aberto de A, na fila da pessoa, resolve A; referência de objeto encerrado, fora da
fila dela, inventada ou de objeto de B → recusa, nada resolvido, sem revelar se o objeto existe. Com A
aberto, resolver B encerra A, e a aba de A que submete depois é recusada. Hoje, sem célula valorada
(`RN-PRV-015`) e sem a implementação da Fase 2, **todos** terminam em recusa, e é o que a regra diz.

**Infeliz** o suporte precisa do número para consertar — "o cliente diz que o total está errado". Então
o veículo é a **concessão** (`RN-NUC-024`), com motivo e prazo, não a ampliação do papel; e o que ele vê
por ela é o que ela nomeia. Ampliar o papel "porque acontece toda semana" é a evidência de que falta uma
capacidade de diagnóstico que não exige ler faturamento — e isso é achado para o passo 3, não exceção
aqui.

**Infeliz das cláusulas do objeto** o suporte atende vinte clientes num dia, e resolver o alvo a cada
ato é atrito. **Necessidade preservada:** trabalhar os vinte sem reautenticar vinte vezes — ela não se
nega. **Mecanismo recusado:** o cliente-alvo vir escolhido no corpo do pedido, um por requisição. Ele é
ruim por uma razão verificável, não estética: é ele que faz o dígito trocado **escrever** no cliente
errado, e a escrita é irreversível pelas regras deste desenho (fato append-only, correção só por fato
novo). **Mecanismo nosso:** o alvo é resolvido fora do pedido e o identificador do pedido não decide
nada — só confirma, e divergência recusa. **Por que é melhor, e como se prova:** o erro de digitação
perde efeito por construção, não por cuidado do operador; prova-se praticando o ato com o identificador
do cliente vizinho e obtendo recusa, com nada gravado nos dois. **Infeliz de (d):** o cliente só
telefona. Ele abre o pedido na própria superfície e lê a referência; sem pedido dele, fato nosso ou ato
de criação não há alvo, e o suporte não age, inclusive para o cliente sem acesso algum (`RN-NUC-090`).

### RN-PRV-005 — Quem opera não concede, e ninguém audita o próprio alcance

**Enunciado** (a) `provider_operator` nunca concede nem revoga concessão de `provider_support`; (b) o uso
de um alcance **não é auditado por quem o porta** — o leitor primário da nossa trilha é o **cliente**, na
superfície dele (`RN-NUC-024` d, estendida por `RN-PRV-006`), e do nosso lado quem a lê é o papel que
**não** porta o alcance auditado.

**Motivo** é `LACUNA-NUC-011` respondida **na parte de papel**, pelo precedente de `LACUNA-OFF-007`
(respondida em papel, aberta em número — `papeis-e-permissoes.md` §4.2); a parte de **pessoa e número**
continua do humano. A cláusula (b) existe porque auditor que audita a si mesmo não é auditoria, é
registro — e dar ao **cliente** o papel de leitor primário não é cortesia: é o único leitor que nós não
podemos desligar.

**Aceite** `provider_operator` tentando conceder concessão → negado. `provider_administrator` pedindo a
trilha do próprio uso → atendido como **leitura**, e a auditoria de fato tem outro leitor nomeado; a
distinção aparece no registro. E existe a operação de leitura da nossa trilha com célula para `owner` —
hoje **ausente** (`LACUNA-NUC-031`, `superficie-por-papel.md:328`).

**Infeliz** somos uma pessoa só, que porta tudo, e (a) e (b) não separam ninguém. Continuam valendo como
**registro**, e a separação passa a existir no dia da segunda pessoa sem redesenhar nada. Removê-las por
serem inertes hoje é trocar barato agora por caro depois.

### RN-PRV-006 — Todo ato e toda leitura nossos no ambiente do cliente são legíveis por ele, qualquer que seja o papel

**Enunciado** a promessa que `RN-NUC-024` (d) faz para atos sob concessão vale para **todos** os papéis
de escopo `provedor`: cada ato e cada leitura nossos no ambiente de um cliente ficam legíveis **por ele**,
na superfície dele, com quem, quando, o quê e **sob que autoridade** (papel declarado ou concessão). A
autorização contratual de `RN-PRV-010` autoriza o acesso; ela **não** o torna invisível.

**Enunciado, três cláusulas acrescentadas em 2026-08-23 (`PRV-04`, `PRV-05`).** (a) **Perímetro** — "no
ambiente do cliente" se lê como **todo ato nosso sobre aquele cliente**, inclusive o ato cujo objeto
vive no registro de controle e não no ambiente dele: ligar e desligar módulo, provisionar, encerrar,
mudar o que ele paga. O que define o perímetro é o **cliente afetado**, nunca o lugar onde o objeto
repousa — e **onde o fato repousa** é `D-06`, que esta cláusula não decide. (b) **Concedibilidade**,
pela mesma cláusula (d) de `RN-NUC-024`: papel de escopo `provedor` **não é atribuível** enquanto a
leitura desta trilha não tiver célula declarada — papel cujo preço não é pagável não é concedível. Hoje
a operação é `LACUNA-NUC-031`, estado **ausente** (`superficie-por-papel.md:328`), logo **nenhum dos
três** papéis é atribuível, e isso vale para os dois novos como já valia para `provider_support`. (c) A
legibilidade é obrigação de **resultado**: o cliente lista os atos e as leituras nossas qualquer que
seja a residência escolhida em `D-06`, e residência que não sustente essa lista é residência recusada —
não promessa reduzida.

**Enunciado, cláusula acrescentada em 2026-08-23 (`PRV-14`) — a metade da promessa que não tinha
mecanismo.** "O cliente lista" é verificável por aceite; "nós não conseguimos apagá-las"
(`RN-PRV-011` d) era afirmação sobre um sistema que **nós** operamos, e nada a sustentava: `RN-PRV-011`
(b) proíbe suprimir, editar, adiar e desligar **o fato**, e não proíbe **expirar a classe** por custo —
caminho que torna a promessa falsa sem violar regra nenhuma. Ela passa a valer como **propriedade exigida
da residência**, em quatro partes, todas conferíveis contra qualquer saída de `D-06`. (d.1) A trilha de
ato e de leitura nossos pertence ao relógio da **prova**: a janela dela é a que a cláusula de
`RN-PRV-010` prometeu ao cliente, **nenhuma decisão de custo a encurta**, e ela nunca é classificada como
discricionária — o número é do humano (`LACUNA-PRV-006`). (d.2) **Não existe operação nossa** que apague,
edite, suspenda ou **encurte a janela** desta classe: nem célula na matriz do escopo `provedor`
(`RN-PRV-015`), nem configuração, nem expiração que alguém do nosso lado possa ajustar. (d.3) Reduzir a
janela, se algum dia for decidido, é ato de `RN-PRV-010` (d) — datado, com custo escrito, aprovado pelo
humano — e é **visível ao cliente, na mesma superfície onde a lista vive, antes de valer**. (d.4) A janela
vigente é **declarada** junto da lista, e lista truncada por ela aparece como **truncada**, nunca como
"não houve acesso" (é a forma de `RN-REL-005`). **O enunciado se reduz ao que as quatro partes
sustentam:** nenhuma operação nossa apaga, encurta ou expira esta trilha. "Não conseguimos" é afirmação
de mecanismo, o mecanismo é de `arquiteto-dados` e de `backend`, e esta regra não o escolhe — ela declara
a propriedade que ele terá de ter.

**Motivo** é o que separa administrador geral legítimo de acesso silencioso, e é a única coisa que o
cliente pode conferir sozinho. Sem a extensão, o desenho novo produz um buraco preciso: o cliente
consegue listar os atos sob concessão — que hoje são zero — e **não** consegue listar os atos do papel
que de fato muta o ambiente dele todos os dias. A trilha passaria a mentir por omissão, que é o mesmo
defeito da credencial compartilhada com outra causa.

**Aceite** o `owner` lista, sem nos pedir, cada leitura e cada ato nossos no ambiente dele, com autor,
instante, objeto e autoridade — inclusive os de `provider_operator` e os de `provider_administrator`, não
só os de concessão. Ato nosso que não aparece nessa lista é defeito, não configuração.

**Aceite das três cláusulas** (a) ligar um módulo pago para A → A lista o ato, com autor, instante,
motivo e o efeito de cobrança declarado (`RN-PRV-007`), **mesmo que** o registro de módulo ativo não
viva no ambiente dele (`fronteira-do-nucleo.md:58`); a fatura de A nunca muda por ato que a lista dele
não mostra. (b) Atribuir `provider_operator` ou `provider_administrator` a uma pessoa nossa **hoje** →
**negado**, citando `LACUNA-NUC-031` — o mesmo desfecho, e pela mesma razão, que hoje torna
`provider_support` não instanciável. (c) Escolhida a residência em `D-06`, repetir o primeiro aceite:
se a lista do cliente deixa de conter alguma classe de ato nosso, a residência é recusada — não se
ajusta a promessa para caber nela.

**Aceite da cláusula (d)** para a residência escolhida em `D-06`, procurar caminho nosso — operação,
célula, configuração, política de expiração ou decisão de custo — que remova ou encurte esta classe **sem**
ato de `RN-PRV-010` (d) → **nenhum**; achar um é **residência recusada**, não ajuste de promessa. Segundo:
pedir a lista → ela vem com a janela vigente declarada, e período fora da janela aparece como **fora da
janela**, nunca como zero acesso. Terceiro, o que prova (d.1): buscar esta classe entre as de retenção
discricionária → **zero** ocorrências.

**Infeliz** a operação de leitura dessa trilha **não existe** hoje: é `LACUNA-NUC-031`, e o escopo dela
cresce aqui de "atos sob concessão" para "atos e leituras nossas". A célula é do **passo 7**, no mesmo
despacho — regra que muda desfecho de célula e não entrega a célula **nasce inerte**, e duas correções
corretas da mesma rodada já se anularam por isso (`AUT-14`). **A cláusula (b) é o que evita repetir
`AUT-14` aqui, e tem preço imediato:** os dois papéis novos nascem **não atribuíveis**, então nada do
console do passo 7 opera antes de a célula existir. Sem ela, o desenho novo ficaria pior que o vigente
exatamente no ponto em que o vigente estava certo — `provider_support` não é instanciável hoje porque
`RN-NUC-024` (d) amarra concedibilidade a leitor, e os papéis novos não amarravam nada.

---

## 2.1 As duas travas que o escopo novo não herda de ninguém

**Mudaram de arquivo em 2026-08-23, na mesma passada em que nasceram.** `RN-PRV-015` (default fechado do
escopo) e `RN-PRV-016` (em que o ato nosso se sustenta) moram em
**`operacao-do-provedor-autorizacao.md`**, terceiro irmão deste conjunto, porque este arquivo fechou em
414 linhas com elas dentro — acima do teto de 400. Eixo da partição, e ele é real: aqui **quais papéis
existem**; no irmão do alcance, **o que eles alcançam e sob que autorização**; no irmão da autorização,
**a trava que o escopo não herda de ninguém** — o default da célula e o campo em que o ato se sustenta.
Numeração contínua e imutável entre os três.

---

## 3. O que este arquivo deliberadamente não faz

- **Não valora célula.** A matriz do escopo `provedor` está em `matriz-celulas-a-valorar.md` §1 (desde
  2026-08-23), com valor em branco. Operação sem linha nela é negada a todo papel nosso — e a regra que
  declara isso é `RN-PRV-015`, no irmão da autorização, **não** `RN-NUC-039`, cujo enunciado é escrito
  sobre as duas matrizes de cliente (`PRV-02`).
- **Não lista os fatos** que o sistema registra no instante em que acontecem, nem o leitor de cada um —
  passo 3.
- **Não decide grão, retenção nem onde mora o agregado cross-cliente** — passo 4, incluindo `D-06`.
  Nomear o escopo `provedor` **não** responde onde o dado mora: era esse atalho que `RN-PRV-002` fecha.
- **Não desenha superfície**, e não diz se o que opera o nosso lado é a mesma aplicação do PDV
  (`D-01`/`D-02`). A **superfície derivada** — o que cada papel nosso vê, em que forma, e o que a libera —
  está em `superficie-do-provedor.md` (2026-08-23), e ela também não desenha nada.
- **As perguntas ao humano e as lacunas dos três arquivos** moram em `operacao-do-provedor-alcance.md`
  §3 e §4 — inclusive a que é de advogado, não de produto.

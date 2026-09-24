# Operação do provedor — alcance, mutação e consentimento

> **Irmão de `operacao-do-provedor.md` e de `operacao-do-provedor-autorizacao.md`, com o mesmo peso
> normativo.** Eixos: **quais papéis existem** × **o que eles alcançam e sob que autorização** × **a
> trava que o escopo não herda de ninguém**. Lá: o escopo `provedor`, a desambiguação do nome e os três
> papéis (`RN-PRV-001` a `006`). No irmão da autorização, nascido em 2026-08-23: o default fechado do
> escopo e o campo em que o ato nosso se sustenta (`RN-PRV-015`, `016`). Aqui: o que o suporte muda, a
> interação com o cliente-final, a observação declarada, a **decisão de 2026-08-23** sobre o
> administrador geral, o consentimento por cláusula de contrato e o que nunca se entrega a um cliente
> (`RN-PRV-007` a `010`, `017`). Numeração contínua e imutável entre os três, sem hierarquia. **As
> perguntas ao humano e as lacunas dos três moram aqui** (§3 e §4).
>
> **O que este arquivo não é.** Não é console, tela, painel nem rota (passo 7 da T-0004). Não é a lista
> de fatos a registrar nem o **grão** de cada um (passos 3 e 4). Nenhuma célula de autorização é valorada
> aqui, e nenhum número — prazo, retenção, teto, preço — é escrito: número é lacuna com dono.
>
> **Formato:** `Enunciado` · `Motivo` · `Aceite` · `Infeliz`. Escopo de **toda** regra: `provedor`.

---

## 1. O que o suporte muda — e as duas consequências que ninguém pediu

### RN-PRV-007 — Mudar módulo de um cliente é fato append-only que altera cobrança, e não se consuma sem confirmação declarada

**Enunciado** ativar e desativar módulo para um cliente é **fato**, nunca edição de estado: linha nova,
append-only, com autor, instante e motivo, e correção é fato novo referenciando o anterior
(`.claude/rules/dados.md` §4). Como a lista de módulos ativos é a **base de cobrança**, o ato declara,
**no momento em que é praticado**, que ele altera o que o cliente paga — e não se consuma sem
**confirmação** de quem a regra de confirmação nomear. Enquanto essa regra não existir, a operação não
tem célula e é **negada a todos** (`RN-NUC-039`).

**Motivo** duas coisas se cruzam aqui, e a segunda é a que morde. A primeira: desligar módulo não apaga
dado (`.claude/rules/dados.md` §5), então o histórico do que estava ligado **quando** é a única prova de
por que a fatura foi aquela — e estado sobrescrito destrói exatamente essa prova. A segunda: por
`RN-PRV-004`, quem muda módulo é justamente quem **não vê** faturamento. Isso é segregação de função e é
saudável, mas cobra um preço: sem a declaração no momento do ato, a segregação vira **cegueira** — o
suporte altera a fatura do cliente sem ter como saber que alterou. A declaração é o que transforma
cegueira em segregação.

**Aceite** ligar um módulo, desligar, religar → **três** fatos na trilha, com autor, instante e motivo, e
nenhum deles apaga o anterior; a pergunta "quais módulos estavam ativos no dia 12" é respondível. E: o
ato exibe o efeito de cobrança antes de ser praticado, e sem confirmação ele não acontece.

**Infeliz** **quem confirma não está decidido, e não presumo.** Três candidatos, e a diferença entre eles
é comercial, não técnica: (i) só o `provider_administrator` confirma; (ii) o suporte pratica e o cliente é
**notificado**; (iii) o **cliente** confirma, porque `PN-20` diz que ele mexe no que é dele e o registro
de módulo ativo não tem dono declarado em artefato nenhum — a pergunta já está aberta em
`papeis-e-permissoes.md` §6 ("habilitar módulo é ato de `owner`, nosso, ou dos dois?"). →
`LACUNA-PRV-003`, dono humano. Até fechar, falha fechado: a operação é negada, e essa é a resposta, não a
ausência dela.

### RN-PRV-008 — Interação nossa com o cliente-final é atribuída e mínima; o estabelecimento nunca desaparece do meio

**Enunciado** quando um papel nosso interage com o **cliente-final** de um cliente, três coisas são
obrigatórias: (a) a interação é **atribuída** — o cliente (tenant) vê que fomos nós, quem, quando e sobre
qual objeto (`RN-PRV-006`); (b) o dado pessoal alcançado é **o mínimo que aquela interação exige**, item
por item, e nada além (mesma postura de `RN-EMI-017` e da minimização de `.claude/rules/seguranca.md`
§3); (c) texto escrito pelo cliente-final continua **opaco** — preservado literal, nunca interpretado nem
usado como chave de decisão (`RN-OFF-027`).

**Motivo** é território novo e é a parte mais delicada do desenho, por uma razão que o pedido não diz:
para o cliente-final, quem fala é **o estabelecimento**. Ele não contratou a Forja, não sabe que
existimos, e não tem como distinguir. Daí (a): se o cliente (tenant) não vê que fomos nós, ele responde
por uma conversa que não teve. E daí (b), que é a contradição a resolver em vez de esconder: um papel
descrito como "não vê informação sensível" que **interage com cliente-final** toca dado pessoal de
terceiro **por definição** — nome, telefone, documento, o que a pessoa pediu. A fronteira é desenhável;
presumi-la, não.

**Aceite** o `owner` lista cada interação nossa com cliente-final dele, com autor e objeto. E, para cada
interação prevista, existe a lista do dado pessoal que ela exige — interação sem essa lista **não
acontece**, pelo mesmo mecanismo de `RN-PRV-009`.

**Infeliz** duas coisas ficam **fora** de produto e são nomeadas como tal. (1) Se o **cliente-final** tem
de saber que quem fala não é o estabelecimento, é pergunta de advogado, não minha → §4, último item. (2)
O **estabelecimento não pode consentir em nome dos clientes-finais dele** — eles não assinaram o nosso
contrato —, então a cláusula de `RN-PRV-010` **não** cobre dado pessoal de terceiro, e nada aqui afirma
base legal. **Consequência de processo, declarada:** o gate de `seguranca` sobre `PCF`/`ATI` está
**agendado e não cumprido** (`roadmap-de-modulos.md:373`); fazer um papel nosso tocar aquela superfície
faz o gate passar a bloquear mais coisa, e isso é custo desta decisão, não surpresa futura.

**Declaração de inércia — 2026-08-23, achado `PRV-06`. Escolhida, não silenciada.** Dado pessoal de
**cliente-final** é a única classe deste desenho **sem canal de autorização nenhum**: a célula nega
"consultar dado de pessoa fora da venda em curso" a toda coluna existente
(`matriz-operacao-papel-modulos.md:169` — `N` para `provider_support`, `?` para os três gerenciais), a
cláusula de contrato **não** a cobre por escrito (infeliz, item 2), e nenhuma concessão a nomeia hoje.
Falha fechado tem exatamente duas saídas, e **escolho a segunda: `RN-PRV-008` é inerte** — nenhuma
interação nossa com cliente-final acontece até o humano, com advogado, responder em que base o dado
pessoal dele é alcançado (§4, último item). **O que não faço:** pôr a classe no piso de §2.2. As duas
saídas produzem hoje o **mesmo** desfecho — nenhum acesso —, e diferem só no preço da resposta do
humano: o piso é negativa **absoluta**, e negativa vigente só cai por ato datado, com custo escrito e
célula corrigida no mesmo despacho (`RN-PRV-010` d); a inércia cai com a resposta e mais nada. Pôr no
piso seria decidir por nós uma questão que é dele e do advogado, **e** cobrar dele o rito de revogação
para desfazer o que nunca foi decidido. **Custo da inércia, escrito:** a capacidade que ele pediu —
falar com o cliente-final do cliente — não existe até a resposta, e o preço aparece no primeiro
incidente em que o cliente-final reclama e nós não podemos responder a ele. **O que continua valendo:**
as cláusulas (a), (b) e (c) permanecem escritas e são o que a interação terá de cumprir **quando**
existir — inércia não é revogação, e nada aqui foi apagado. **O que o produto oferece hoje, e não é
nada:** respondemos **ao cliente (tenant)**, e ele responde ao cliente-final dele — o mecanismo em que o
estabelecimento não desaparece do meio, que é o que o motivo desta regra já pedia. **Consequência para
`PRV-07`:** com a inércia, nenhuma mensagem nossa entra no canal de `PCF` hoje; a quarta classe de autor
que falta em `RN-PCF-013` continua faltando, é do dono daquele módulo, e o gate `PCF`/`ATI` a alcança
antes de a interação existir.

### RN-PRV-009 — O que um papel nosso observa sem concessão é declarado item por item; item sem declaração não é coletado

**Enunciado** toda coisa que observamos do ambiente do cliente **sem** concessão declarada é listada item
por item, e cada item declara: o que é, **qual papel nosso o lê**, a decisão nossa que ele informa, e
**por que ele não é fato de negócio do cliente**. Item sem as quatro declarações **não é coletado**. A
lista é o veículo: o que não está nela não é observado.

**Enunciado, cláusulas acrescentadas em 2026-08-23 (`PRV-12`) — onde a lista mora, e por que ela não é
um artefato novo.** Até esta data a lista **não existia em disco**, e o que a implementação lia no lugar
dela era a coluna `Consome` das tabelas de fato: `P` funcionando como autorização sem nenhuma das quatro
declarações. Fecha assim, sendo (a) o enunciado acima, intacto. (b) **A lista é a coluna.** O conjunto das linhas com `P` na coluna `Consome`
das tabelas que descrevem a operação do **cliente** — `fatos-de-operacao.md` §3 e §5,
`fatos-de-operacao-dominios-fechados.md` §1.1 — **é** a lista desta regra. Não se cria segundo artefato:
duas listas para o mesmo fato divergem, e a que a implementação lê é a que está perto do fato. (c) **Cada
`P` declara, na mesma linha, a decisão nossa e o canal** — `RN-PRV-009` (observação de operação) ou
`RN-PRV-010` (leitura de dado de negócio). `P` sem os dois é **retirado**, e retirar o `P` significa
exatamente "só o cliente consome", nunca "observamos sem declarar". (d) **Os dois canais não são
intercambiáveis:** `RN-PRV-009` admite observação **corrente**; `RN-PRV-010` é leitura **por ocorrência**,
com motivo enumerado (`RN-PRV-011` §2.1) e trilha, e **nunca** sustenta painel, série corrente nem
leitura recorrente sem motivo. Item marcado `RN-PRV-010` que apareça em artefato de observação corrente é
achado, não configuração. (e) As tabelas de `fatos-de-operacao-provedor.md` §2 e §3 **não entram** nesta
lista **como fatos**: o objeto delas é a nossa trilha e o ambiente que **nós** operamos, não observação do
negócio do cliente — o que não dispensa nenhuma delas de `RN-NUC-044`. Mas **leitura derivada** que um
fato nosso só responde cruzando os fatos da operação do cliente (o caso é "módulo ativo sem nenhum fato de
operação") **é** observação, entra por esta regra e por `RN-PRV-014`, e a **forma** admissível dela é do
dono daquela linha — hoje não está escrita, e é achado aberto (`PRV-16`), não licença.

**Motivo** é o que faz "o suporte não vê faturamento" ser **conferível** em vez de declarativo. `PN-15`
legitima o canal e proíbe dado sensível nele, mas não dá a fronteira de **grão** — e contagem de
operações por hora, por estabelecimento, **é** a curva de vendas do cliente escrita em outra unidade. O
risco não é má-fé, é grão: cada refinamento parece razoável, e ao fim a observação "de operação" responde
quanto o cliente vendeu sem que nada tenha sido decidido. Falha fechado é a única postura que sobrevive a
refinamento.

**Aceite** item novo sem uma das quatro declarações → não entra, e a ausência é visível como recusa.
Conferência inversa: para cada item da lista, um leitor externo consegue dizer se ele é fato de negócio;
se não consegue, o item volta.

**Aceite das cláusulas (b) a (e)** varrer as tabelas da cláusula (b) por linha com `P` e **sem** decisão
nossa nomeada na mesma linha → **zero**; e por linha com `P` **sem canal** declarado → **zero**. Segundo
aceite, o que fecha o cenário de `PRV-12`: pedir um painel corrente de venda por item a partir de linha
marcada `RN-PRV-010` → **negado pela cláusula (d)**, citando o canal e não a prosa. Terceiro: retirar o
`P` de uma linha não retira nada do lado `C` — a leitura do cliente sobre o fato dele é a mesma antes e
depois.

**Infeliz** o item é útil e a declaração "por que não é fato de negócio" não se sustenta. Então ele não é
observação de operação: é leitura de dado de negócio, e o veículo é o de §2. O **critério** da fronteira
é `LACUNA-PRV-002`, dono a auditoria do **passo 2** — escrevê-lo aqui transformaria o canal estreito no
amplo com vocabulário técnico, que é o risco secundário registrado no plano.

---

## 2. O administrador geral — decisão do humano, 2026-08-23

**Está decidido, e não é mais opção.** O `provider_administrator` lê o negócio do cliente: faturamento,
curva de vendas, recorte horário por meio de pagamento, e o dado bruto por trás. Somos o provedor; a
necessidade — suportar, faturar, diagnosticar, sugerir melhoria — é legítima e já validada por quem
opera. O que se escreve aqui não é a escolha; é **o preço, e o que ele revoga**.

**Correção de premissa, da mesma data.** O eixo **nunca foi cliente ↔ cliente**: o humano foi explícito
em não querer que um cliente veja dado de outro. O eixo é **nós ↔ cliente**. Portanto a resposta da
auditoria da T-0003 — *não existe caminho em que um cliente veja dado de outro* — **continua verdadeira**,
e quem precificar esta decisão por vazamento entre clientes precifica um custo que não existe.

### 2.1 O que esta decisão revoga, e o que ela não revoga

**Nenhum enunciado vigente é revogado.** As negativas abaixo seguem de pé, e a lista existe para que
qualquer diferença futura seja achado por busca (`RN-PRV-010` d):

1. `provider_support` **nunca** alcança mais de um cliente com uma concessão, **nunca** é autoridade
   retida e não opera com o terminal sem contato (`RN-NUC-024`).
2. `provider_support` é **recusa** em toda linha das matrizes de cliente, linhas 25 e 26 inclusas
   (`matriz-operacao-papel.md`); a não-instanciabilidade de hoje é desfecho **correto**.
3. Nenhuma superfície de cliente alcança contagem que soma clientes (`RN-EMI-040`, `RN-REL-006`).
4. Nenhum cliente vê como está **em relação aos outros** (`relatorios-semente-de-perguntas.md:201`) — e
   isto ganhou, nesta data, a frase do próprio humano, deixando de ser inferência.

**O que é revogado é uma premissa implícita, e é por isso que ela precisa de data:** até 2026-08-22, todo
artefato pressupunha que **leitura nossa de fato de negócio de cliente só acontece por concessão**. Essa
premissa **cai** em 2026-08-23. Ela não estava em nenhum enunciado — vivia no *motivo* de `RN-NUC-024` e
na narrativa da auditoria da T-0003 —, e premissa que cai sem registro é exatamente o modo de falha mais
caro deste projeto. Duas consequências com dono: `LACUNA-NUC-031` cresce de "quem lê a trilha dos atos
sob concessão" para "quem lê a trilha dos atos **e das leituras** nossas" (célula: passo 7); e o registro
de memória `agregado-de-periodo-fechado-nao-e-cache` tem a premissa "nenhuma pergunta soma clientes"
**vencida** — correção é do orquestrador, não minha.

**Correção do que o plano desta ficha previa:** `RN-NUC-024` e a **linha 26** da matriz **não** mudam de
desfecho. O administrador geral é papel de escopo `provedor`, não é coluna daquela matriz e não é
concessão — e é `RN-PRV-004` (leitura e mutação como eixos separados) que preserva o desenho inteiro em
vez de negá-lo.

### RN-PRV-010 — O alcance de leitura do provedor é o que a cláusula de contrato diz; mudá-lo é mudar contrato, e negativa vigente só cai por ato datado

**Enunciado** (a) o consentimento do cliente para a leitura de §2 é **cláusula de contrato**, não
autorização por acesso — o que fecha `LACUNA-NUC-009` **pelo lado do mecanismo**, deixando aberta a parte
de prazo (`LACUNA-NUC-010`). (b) A cláusula e o alcance técnico são **o mesmo objeto**: a spec declara o
alcance em termos transcritíveis para a cláusula, e **ampliar alcance é alterar contrato**, com o mesmo
rito. (c) A cláusula autoriza o acesso e **não** dispensa a trilha (`RN-PRV-006`). (d) Negativa vigente
(§2.1) só deixa de valer por ato **datado**, com custo escrito e aprovação do humano, no arquivo dono da
negativa, e com a célula corrigida no mesmo despacho.

**Motivo** se a cláusula diz uma coisa e o sistema alcança outra, não é divergência de documentação: é o
produto violando o contrato do cliente, e descobre-se no pior momento possível. Manter os dois como um
objeto é o que torna a promessa auditável dos dois lados. E (d) é a defesa contra a forma como este
território apodrece: o risco registrado no plano é que sete passos individualmente razoáveis substituam
`provider_support` por algo que alcança N clientes sem concessão, sem prazo e sem trilha, restando dele só
o nome — e nenhum passo faria isso de propósito.

**Aceite** ler a cláusula e o alcance declarado lado a lado, e não achar diferença — nem alcance que a
cláusula não cobre, nem cláusula que promete menos do que o sistema faz. E: qualquer diferença entre §2.1
e o arquivo dono de cada negativa é achado, conferível por busca, sem julgamento.

**Infeliz** a cláusula não cobre o que precisamos ler. Então **não se lê**, e o caminho é alterar o
contrato — nunca ler primeiro e ajustar depois. E o limite que a cláusula **não** alcança está nomeado em
`RN-PRV-008` (infeliz): o estabelecimento não pode consentir em nome dos clientes-finais dele.

### 2.2 O piso — o que é vedado até a nós, e não é escolha nossa

"Informação bruta" tem piso, e ele se escreve agora, senão vira pedido de implementação depois. **Nenhum**
papel nosso, em nenhum alcance, inclusive o `provider_administrator`: número completo de cartão, código
de segurança e trilha — que **não persistem em lugar nenhum** (`.claude/rules/seguranca.md` §3,
`RN-NUC-024` e); o **valor** de segredo de emissão (`RN-EMI-007`); a **capacidade de assinar** e todo ato
sobre ela (`RN-EMI-033`, `RN-EMI-036`, `RN-EMI-037`), que são eixo de **ato**, não de leitura. Documento
de pessoa, telefone e endereço ficam sob **minimização**: cada uso justificado, nenhum em log. O humano
já disse "não vai ver cartão" do suporte; vale igual para o administrador geral, e não porque nós
escolhemos.

### RN-PRV-017 — Nada que nós entregamos a um cliente carrega valor, ordenação ou comparação derivada de outro; e o agregado que soma clientes não tem objeto de consentimento

**Enunciado** (a) **nenhum artefato nosso endereçado a um cliente** — tela, exportação, relatório,
mensagem, aviso, sugestão ou conversa de uma pessoa nossa — carrega **valor, ordenação, posição, faixa
ou comparação** derivada de outro cliente, ainda que nenhum número do outro apareça. (b) O agregado que
soma clientes é o único alcance nosso **sem objeto de consentimento**: ninguém consente em ser linha de
um agregado que existe para informar decisão sobre outro, e a cláusula de `RN-PRV-010` é **por cliente**
— logo o agregado é lido **só por nós**, não é veículo para nada endereçado a um cliente, e `RN-PRV-010`
(b) não o cobre. (c) Sugestão nossa ao cliente se sustenta **só** em fato do próprio cliente; sugestão
que precisa de comparação **não é entregável**, e o veículo — artefato ou boca de pessoa — não altera
isso.

**Enunciado, cláusula acrescentada em 2026-08-23 (`PRV-13`) — o agregado lido por nós.** (d) O agregado
que soma clientes é legítimo **enquanto não for decomponível por concentração**, e a propriedade não é a
**contagem** de clientes somados: é a **distribuição**. Quando um cliente responde por parcela dominante
da grandeza, o pico, a subida e a queda do agregado **são** a curva de operação dele — e o artefato passa
a entregar dado de negócio daquele cliente a quem o eixo dele não alcança (`RN-PRV-004`), sem que nenhum
número dele apareça e sem que o artefato pareça per-cliente. Portanto: (i) existe grandeza declarada — a
**contribuição máxima de um cliente na grandeza agregada** (unidade: fração da grandeza; **sem valor**,
`LACUNA-PRV-010`) —, da mesma família do **`N` mínimo de clientes somados** derivado no passo 4 da
T-0004; (ii) as duas são avaliadas **antes** de o agregado ser apresentado, na **mesma janela e na mesma
resolução** que ele exibe, porque resolução fina é o que viola a condição primeiro; (iii) agregado que
não satisfaz a condição **não é apresentado** — falha fechado, sem aviso, e a recusa não revela qual
cliente a causou (`RN-NUC-036`).

**Motivo** `RN-EMI-040` proíbe devolver **valor** que dependa de outro cliente
(`fiscal-custodia-e-trilha.md:299-301`), e o vazamento desta família é de **forma**: "seu ticket médio
está abaixo do que se pratica no seu porte" não devolve valor nenhum de B e entrega exatamente o que
§2.1, item 4, promete que ele nunca sabe. Forma sobrevive a normalização, a razão e a índice — é o
mesmo motivo de `RN-EMI-040` ("vazamento entre clientes por agregado, que sobrevive a schema correto")
pelo lado que a letra dele não cobre. E esta regra **não decide nada novo**: o humano respondeu em
2026-08-23 que o cliente **não** vê como está em relação aos outros (§3, item 6). Ela escreve a decisão
dele no lugar onde a implementação a lê, porque uma decisão que só existe em resposta de conversa é
implementada pelo que estiver escrito.

**Motivo da cláusula (d)** é restrição de **produto**, não de infraestrutura: a forma do agregado é a
forma do maior, e "agregado" é justamente o rótulo que faz ninguém olhar. Passar em (a) e (b) — nenhum
número de outro cliente, nenhum objeto de consentimento — **não** implica passar aqui, porque aquelas
medem *o que o artefato contém* e esta mede *o que ele permite reconstruir*. É `RN-EMI-040` no terceiro
vetor: cliente→cliente, cliente→nós, e agora **agregado→dominante**. O vetor novo é o único sem sintoma,
porque o artefato continua parecendo agregado e nenhuma regra é violada no caminho.

**Aceite** quatro tentativas, quatro recusas: (1) tela para A com "seu ticket médio × a média do seu
porte" → negada; (2) mensagem ou sugestão dizendo "acima", "abaixo", "na média" ou "entre os melhores"
→ negada, e a recusa não revela que o agregado existe (`RN-NUC-036`); (3) exportação para A com coluna
de referência de mercado → negada; (4) o **mesmo conteúdo dito por uma pessoa nossa** numa conversa →
negado pela mesma cláusula. Teste negativo, conferível: buscar artefato nosso endereçado a cliente cuja
fonte inclua fato de outro cliente → **zero**.

**Aceite da cláusula (d)** três clientes, um com parcela dominante; o painel "operações acontecendo
agora", medido na nossa borda, em unidade nossa, agregado sobre **todos** → **não apresentado** a
`provider_operator` enquanto a contribuição máxima não satisfizer a condição, e a recusa não nomeia o
dominante. Teste negativo, conferível: artefato agregado nosso apresentado **sem** a contribuição máxima
avaliada na janela e na resolução que ele exibe → **zero**.

**Infeliz** a comparação é **útil** ao cliente e é a coisa mais vendável que temos. **Necessidade
legítima, preservada:** o comerciante quer saber se o que ele vê é normal. **Mecanismo recusado:**
comparar com os outros clientes da nossa base — ele entrega informação de terceiro sem consentimento
possível, e faz do nosso agregado um produto construído com o dado de quem nunca foi perguntado.
**Mecanismo nosso:** comparar o cliente **com ele mesmo** — outra faixa do dia, outro estabelecimento
dele, outro período. **Por que é melhor, e como se prova:** a resposta é reconstruível dos fatos dele
(`RN-NUC-041`), continua existindo quando ele sai (`PN-10`), e não depende de ninguém consentir; prova-se
pedindo as duas respostas para a mesma decisão nomeada e verificando que a segunda basta. **Se o humano
quiser vender comparativo de mercado**, é ato de `RN-PRV-010` (d) — datado, com custo escrito, com
`seguranca`, e com um objeto de consentimento que hoje **não existe** (`LACUNA-PRV-004`).

**Infeliz da cláusula (d)** o painel é útil para operar e a condição o reprova. **Necessidade
preservada:** saber que a plataforma está de pé e onde ela está sofrendo — ela não se nega. **Mecanismo
recusado:** o agregado em resolução fina sobre todos os clientes, porque com um dominante ele é a curva
dele com outro rótulo, e a recíproca "passou em `F1`, logo passou em `F3`" é falsa. **Mecanismo nosso:**
grandeza da **nossa** borda que não se decompõe — janela mais larga, ou unidade que é nossa e não do
negócio dele (fila, erro, saturação de recurso nosso) —, e o que só existe em resolução fina da operação
do cliente vai pelo eixo que alcança dado de negócio, com motivo enumerado e trilha (`RN-PRV-010`,
`RN-PRV-011`), nunca por painel corrente. **Por que é melhor, e como se prova:** a condição é medida
antes de exibir, então o defeito deixa de depender de alguém notar a concentração; prova-se com um
cliente dominante sintético — o painel some, e nada além dele some. Nunca "apresenta com aviso": aviso
não impede a leitura, e é a leitura que é o vazamento.

### 2.3 `D-03`, agravada — e é a pergunta que continua sendo do humano

> **Respondida em 2026-09-23.** `D-03` fechou pela opção C
> (`memory/plataforma/decision-d-03-opcao-c-sujeito-local-ao-cliente.md`): a pessoa nossa mora numa
> população própria, fora dos clientes, e alcança cada um só pelo escopo que o ato de resolução cria, cuja
> entrada é `RN-PRV-004` (d). O texto abaixo fica como o raciocínio que levou à pergunta.

Nosso humano operando em N clientes é caso de **borda** ou caso de **venda**? A decisão de §2 empurra
para **caso de venda**: com leitura ampla **e** mutação ampla (em papéis diferentes, mas nas mesmas
pessoas, hoje), existir dentro do ambiente de N clientes é **rotina**, não exceção — e `provider_support`
já era "o requisito que mais aperta `D-03`" quando era só exceção (`papeis-e-permissoes.md` §5). A
mutação **agrava**: não é só ler no cliente errado, é **escrever** no cliente errado. Vale repetir o
agravante já registrado, que é o único custo desta família que **é** cliente ↔ cliente: filtro de tenant
errado na projeção do conjunto de identificação não vaza "quem existe" — vaza o **meio de identificar**
pessoas de outro cliente para um dispositivo físico de terceiro.

---

## 3. As perguntas que o humano não fez

1. **O sujeito nosso é funcionário, sócio ou terceiro?** Revenda, contabilidade com carteira própria ou
   suporte terceirizado gerenciando N clientes é caso comercial inteiro e muda o modelo de identidade —
   e agora com **mutação** e acesso a cliente-final. `PN-14` já recusa credencial de banco para terceiro.
   → `LACUNA-PRV-001`.
2. **"Sugerir melhorias ao cliente" é interno ou vendável?** Se é serviço, é capacidade com aceite, dono
   e preço — e preço é dele. → `LACUNA-PRV-004`.
3. **O que observamos avisa, ou é consultado?** "Qual módulo não está sendo usado" só gera ação se alguém
   for **avisado** — e aviso empurrado cria a primeira coisa nossa que observa o cliente
   **continuamente**, degrau diferente de observar quando se olha. → `LACUNA-PRV-005`.
4. **Quando o cliente sai, ele leva o dado (`PN-10`). Nós ficamos com o quê, e por quanto tempo?** →
   `LACUNA-PRV-006`.
5. **Se sugerimos algo com base num número nosso e o número está errado, de quem é a responsabilidade?**
   O lado do cliente tem `RN-REL-007`; o nosso não tem nada. → `LACUNA-PRV-007`.
6. **Respondida em 2026-08-23, e sai da fila:** *o cliente pode ver como ele está em relação aos
   outros?* → **não**; comparativo de mercado é dado derivado de outros clientes. Reabrir é ato de
   `RN-PRV-010` (d), com `seguranca`.

## 4. Lacunas dos três arquivos

Abertas em 2026-08-23. Nenhuma bloqueia as dez regras: cada uma foi escrita para sobreviver às duas
respostas. **`LACUNA-PRV-008` e `LACUNA-PRV-009` existem e moram em `fatos-de-operacao.md` §7:** a
sequência `LACUNA-PRV-` é **uma só** entre os dois conjuntos, e é por isso que a próxima aberta aqui é a
`010` — numerar por arquivo seria a colisão nascendo sem má-fé. **`LACUNA-PRV-011` a `013` nasceram em
`superficie-do-provedor.md` §6**, na mesma data, e a sequência continua sendo uma só entre os **três**
conjuntos.

- **`LACUNA-PRV-001`** — o sujeito nosso é funcionário, sócio ou **terceiro**? **Dono:** humano; entrada
  direta de `D-03` e gêmea da pergunta aberta de `fronteira-do-nucleo.md` §6.
- **`LACUNA-PRV-002`** — o **critério** que separa observação de operação de leitura de fato de negócio
  (`RN-PRV-009`). Critério, não número. **Dono:** `seguranca` (passo 2), com o humano para a parte de
  promessa.
- **`LACUNA-PRV-003`** — **quem confirma** mudança de módulo que altera cobrança (`RN-PRV-007`): o
  administrador geral, o cliente notificado, ou o cliente confirmando. **Dono:** humano; é a mesma
  pergunta aberta de `papeis-e-permissoes.md` §6.
- **`LACUNA-PRV-004`** — "sugerir melhoria" é interno ou **vendável**? **Dono:** humano. **Cresceu em
  2026-08-23 (`PRV-10`):** se vendável, qual é o **objeto de consentimento** de quem é linha do agregado
  que soma clientes? Hoje não existe nenhum, e por isso `RN-PRV-017` fecha o caminho por default.
- **`LACUNA-PRV-005`** — o que observamos **avisa** ou é **consultado**? **Dono:** humano.
- **`LACUNA-PRV-006`** — o que sobrevive da nossa observação depois de o cliente sair (`PN-10`), e por
  quanto tempo. **Dono:** humano; o número não é meu.
- **`LACUNA-PRV-007`** — responsabilidade por decisão que o cliente toma a partir de número **nosso**
  errado. **Dono:** humano.
- **`LACUNA-PRV-010`** — aberta em 2026-08-23 (`PRV-13`): a **contribuição máxima** de um cliente numa
  grandeza agregada e o **`N` mínimo** de clientes somados — as duas condições sob as quais o agregado
  sobre todos os clientes é apresentável (`RN-PRV-017` d). Grandeza com unidade (fração · contagem),
  **sem valor**. **Dono:** humano, com `arquiteto-dados`; mesma família do `N` mínimo derivado no passo 4
  da T-0004, e as duas se decidem juntas ou nenhuma protege nada.
- **Fora de lacuna, porque é de advogado:** se o **cliente-final** tem de saber que quem fala não é o
  estabelecimento, e em que base o dado pessoal dele é alcançado por nós, já que ele não assinou o nosso
  contrato (`RN-PRV-008`, infeliz). **Dono:** humano, com advogado. Nada aqui afirma base legal, e nada
  aqui cita norma.

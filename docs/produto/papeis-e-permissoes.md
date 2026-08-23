# Papéis e autorização — quais papéis existem, e por quê

> **O que este arquivo é.** O **modelo de papéis** do núcleo: quais papéis existem, por que cada um
> existe, em que **escopo** ele vale, e o que só ele faz. É trabalho de **reconciliação**: papel
> apareceu em sete artefatos diferentes, cada um resolvendo um problema local, e ninguém havia
> reconciliado. §4 é o resultado — incluindo o que **não** sobreviveu.
>
> **Dois arquivos, um conjunto normativo.** Partido no eixo **quais papéis existem × como a autoridade
> chega a uma pessoa, se limita e expira**. Este arquivo tem o cabeçalho normativo, o critério, o
> escopo, os papéis, a reconciliação e as **lacunas dos dois** (`RN-NUC-017` a `RN-NUC-019`);
> `papeis-atribuicao-e-delegacao.md` tem atribuição, delegação, escalonamento, meta-autoridade,
> autoridade retida, a concessão do papel do provedor e a ausência de papel para automação
> (`RN-NUC-020` a `RN-NUC-025`). Numeração contínua e imutável entre os dois (`glossario.md` §4.2),
> sem hierarquia entre eles. Toda regra é heading `### RN-NUC-nnn`, pelo mesmo contrato de busca de
> `nucleo-venda.md`.
>
> **O que este arquivo não é.** **Não é a matriz operação × papel** — ela é o passo 3 da T-0003 e
> depende deste arquivo. Aqui cada papel declara de **um a três** exemplos de operação, e só como
> **prova de existência**. Não é superfície nem tela (passo 5). Não é tabela, coluna, endpoint,
> componente nem stack.
>
> **Numeração.** Papel com autorização verificada no backend é **núcleo** (`fronteira-do-nucleo.md`
> §2.6), então a sequência é `RN-NUC`, continuando os três arquivos do núcleo: **os dois arquivos de
> papel consomem `RN-NUC-017` a `RN-NUC-025`**, e quem numerar depois começa em `026`.
> `LACUNA-NUC-001` a `008` moram em `nucleo-venda.md` §6; `009` a `014` nascem aqui (§6), mais
> `LACUNA-NUC-034`, aberta em 2026-08-23 — `015` a `033` já estavam nos arquivos de matriz e superfície,
> e numeração **não se renumera**.
>
> **Fronteira de D-03, que continua ABERTA.** Estes arquivos declaram **requisito** de autorização.
> Não decidem onde a identidade mora, como se prova quem é a pessoa, forma de sessão, SSO, nem se o
> mesmo humano existe em mais de um cliente. Ver §5. **Nenhum número:** prazo, validade, teto e
> antecedência são `LACUNA-NUC-<n>` (§6).
>
> **Formato:** `Enunciado` · `Motivo` · `Aceite` · `Infeliz`, com `Offline` onde ele muda o desfecho —
> a forma de `operacao-offline-e-sincronizacao.md`, não a de seis campos de `nucleo-venda.md`.

---

## 1. O critério — por que ele vem antes dos papéis

### RN-NUC-017 — Papel só existe se removê-lo obrigar a conceder poder indevido ou a negar poder necessário

**Enunciado** um nome de papel só é **papel** se passar no **teste de remoção**: apagado o papel,
alguém real ou (a) passa a ter poder que não deveria ter, ou (b) perde poder de que precisa para
trabalhar. Passa por (a) o **papel privilegiado** — existe operação que **somente ele** realiza, entre
os papéis que não o contêm. Passa por (b) o **papel-piso** — não tem operação exclusiva nenhuma, e
existe justamente para que alguém opere **sem** alcançar o que os papéis acima alcançam. Não passa em
nenhum dos dois: é **apelido**, **atribuição** ou **delegação** — e entra como uma dessas três
(`papeis-atribuicao-e-delegacao.md`), nunca como papel. **Papel novo nasce de repetição observada**,
não de antecipação: a mesma delegação nomeada concedida a muita gente é a evidência que justifica
criar o papel.

**Motivo** o critério existe contra os dois defeitos opostos, e os dois já apareceram neste
repositório. O primeiro é **proliferação**: sete artefatos citaram "papel" para resolver sete
problemas locais, e sem critério cada citação viraria um papel — a matriz do passo 3 nasceria com
mais colunas do que operações, e ninguém a leria. O segundo é **colapso**: a leitura literal de
"papel só existe se tem operação exclusiva" apaga o operador de caixa, porque tudo que ele faz um
gerente também faz — e apagá-lo reinstala o "usuário único do balcão" que `PN-11` recusa. O teste de
remoção é o único que corta os dois lados, e é verificável papel por papel.

**Aceite** para cada nome de papel proposto, escrever a frase da remoção e ela ser concreta: "sem
`cashier`, quem fica no posto de caixa é `manager`, e passa a poder cancelar venda concluída" →
papel. "Sem `confirmador de proposta`, quem confirma é o papel que autoriza o efeito, e ninguém
ganha nem perde nada" → não é papel. Nome que não produz a frase não entra na matriz do passo 3.

**Infeliz** o teste é ambíguo porque a operação em disputa não existe como regra numerada. Então a
resposta não é escolher: é **não criar o papel** e declarar a pendência (`RN-OFF-008`, falha
fechado). Papel criado por antecipação sobrevive na configuração de todo cliente e ninguém tem
coragem de removê-lo depois.

---

## 2. Escopo — o eixo que mais custa errar

### RN-NUC-018 — Autorização é avaliada no escopo do **objeto** da operação; papel tem dois níveis, e terminal e tempo são restrições da atribuição

**Enunciado** existem **dois** níveis de escopo de papel, e só dois: **cliente (tenant)** e
**estabelecimento**. A autorização de um ato é avaliada contra o escopo do **objeto** — a venda, a
sessão, a fila, o ponto de emissão pertencem a **um** estabelecimento de **um** cliente —, nunca
contra o escopo declarado por quem pede. **Terminal** e **janela de tempo** não são níveis de escopo:
são **restrições da atribuição**, que estreitam um papel sem criar um novo. **Turno não é escopo de
autorização**: é eixo de conferência (`glossario.md` §1.5), e nenhum papel nasce escopado a turno.

**Motivo** `estabelecimento` é entidade de primeira classe, com identidade jurídica própria, e um
cliente tem uma ou mais (`glossario.md` §1.1). A consequência é direta e não é opcional: **gerente de
um estabelecimento autorizando no outro é vazamento dentro de um mesmo cliente** — não cruza schema,
então nenhuma das defesas de isolamento por cliente o pega, e o dinheiro e o documento fiscal são de
pessoas jurídicas diferentes. A segunda metade do enunciado é anti-proliferação: promover terminal e
turno a níveis de escopo multiplicaria a matriz do passo 3 por quatro, sem nenhuma operação que hoje
precise disso.

**Aceite** operador com `manager` no estabelecimento A tenta autorizar desconto acima do limite, ver
a fila de pendências, fechar sessão de caixa e conceder capacidade de assinar no estabelecimento B →
os quatro são **negados**, e a negação não revela o que existe do outro lado (`RN-EMI-039`,
`RN-OFF-026`). O mesmo operador com atribuição nos dois estabelecimentos alcança os dois, e cada ato
fica na trilha com o estabelecimento em que ocorreu.

**Infeliz** o objeto não resolve estabelecimento sozinho (fila transferida, terminal reinstalado,
consulta agregada de um cliente com N estabelecimentos) → falha **fechado**: sem estabelecimento
resolvido não há autorização, e o pedido é recusado como incidente, não como erro de campo
(`RN-OFF-026`). Nunca se resolve o escopo a partir de identificador que o pedido informa.

**Offline** o escopo é retido junto com a autoridade (`RN-OFF-024`) e não se amplia sem contato:
terminal sem rede não descobre estabelecimento novo nem papel novo.

**Nota sobre turno, e ela é dívida, não desfecho.** Abrir e fechar turno não é operação classificada
hoje (`LACUNA-NUC-007`, ainda aberta): não há operação para pendurar papel. Se o humano decidir que
turno é operação própria, distinta da sessão de caixa, ela entra na matriz com o papel que a
autoriza — e **continua não sendo** um nível de escopo. Nada aqui inventa a operação para ter onde
pendurar o papel.

---

## 3. Os papéis

### RN-NUC-019 — O conjunto de papéis do núcleo é fechado e nomeado; módulo traz papel próprio, e o núcleo não conhece papel de módulo

**Enunciado** os papéis do núcleo são exatamente os da tabela abaixo. Papel novo no núcleo entra por
alteração desta regra, com a frase do teste de remoção escrita (`RN-NUC-017`). Módulo **pode** trazer
papel próprio, declarado na spec dele; nenhum papel de módulo aparece em regra, nome ou condição de
núcleo, e desligar o módulo faz o papel dele parar de existir **sem** afetar papel de núcleo.

| Papel | No código | Propósito | Escopo | Prova de existência — o que **somente ele** faz | Autoridade retida | De quem |
|---|---|---|---|---|---|---|
| Operador de caixa | `cashier` | Atender e cobrar no posto de caixa. | estabelecimento | **nenhuma** — é o **papel-piso**: existe para que alguém opere a venda **sem** poder cancelar fato concluído, exceder limite, mover dinheiro fora de venda ou publicar (`PN-11`) | **existe, com validade — e o ato ordinário não depende dela**: quem sustenta a venda sem contato é `RN-OFF-032` (terminal habilitado + operador identificado), corrigido em 2026-08-23 | cliente |
| Gerente | `manager` | Autorizar a exceção e responder pelo dinheiro do estabelecimento. | estabelecimento | autorizar desconto/acréscimo acima do limite (`RN-NUC-007`) · autorizar cancelamento, devolução e estorno (`RN-NUC-008`) · registrar sangria e suprimento (`RN-NUC-011`) · abrir gaveta fora de venda (`RN-NUC-012`b) · resolver item da lista de trabalho (`RN-OFF-012`) | **sim, com validade** — é ela que faz `RN-NUC-011` e `012` operarem sem contato | cliente |
| Dono | `owner` | Decidir o que o negócio vende, por quanto, e quem pode o quê. | cliente (tenant) | publicar catálogo, preço, limite e configuração (`RN-NUC-014`) · definir **o que cada papel autoriza** e atribuir papel (`RN-NUC-023`) · criar estabelecimento | **não** — tudo que só ele faz é online por construção | cliente |
| Responsável fiscal | `fiscal_officer` | Responder pelo uso do poder de assinar em nome do estabelecimento. | estabelecimento | conceder, renovar, ampliar e revogar a capacidade de assinar (`RN-EMI-036`, `RN-EMI-037`) · assinar **fora** do fluxo de venda (`RN-EMI-036`) · registrar comprometimento de ponto de emissão (`RN-EMI-038`) | **parcial** — ato **sobre** a capacidade é sempre online; assinatura fora do fluxo de venda aceita papel retido válido | cliente |
| Papel do provedor | `provider_support` | Diagnosticar e agir no ambiente do cliente quando ele pede, ou quando um incidente o exige (`PN-15`). | concessão declarada, por cliente, mínima | nenhuma operação de negócio — só existe o que a concessão nomeia, **nunca** dado de pagamento (`RN-NUC-024`) | **nunca** | **nosso** |

**A tabela não é a matriz.** Cada célula de prova cita de uma a três operações, o mínimo para o teste
de remoção. A matriz completa — permitido, negado por default, permitido com autorização de outro
papel, permitido com registro — é o passo 3. O papel do provedor tem regra própria em
`papeis-atribuicao-e-delegacao.md` §7, porque tudo que o define é **como a autoridade dele é
conferida e expira**.

**Motivo** conjunto aberto de papéis é o mesmo defeito de conjunto aberto de artefato publicado
(`RN-NUC-013`): sem lista fechada, o papel vira porta para conceder qualquer coisa a qualquer um,
com aparência de configuração legítima. E a segunda metade — papel de módulo fora do núcleo — é o
invariante de plugabilidade: o núcleo que conhecesse `attendant` ou `production_operator` deixaria de
funcionar igual no posto e na loja de roupa.

**Aceite** a lista de papéis de um cliente sem módulo nenhum ligado tem exatamente os quatro papéis
de cliente da tabela; ligar `MSA` acrescenta `attendant` e desligá-lo o remove, sem alterar nenhuma
autorização dos quatro; nenhuma regra de núcleo cita `attendant` nem `production_operator`.

**Infeliz** o cliente é uma operação de uma pessoa só (padaria com o dono no balcão), e os quatro
papéis parecem cerimônia. **Necessidade preservada:** trabalhar sem trocar de papel a cada ato.
**Mecanismo recusado:** um papel único que faz tudo — é o "usuário único do balcão" de `PN-11`, e ele
apaga a trilha justamente no negócio onde não há segunda pessoa para conferir. **O que o produto
faz:** a mesma pessoa recebe atribuição em mais de um papel (`RN-NUC-020`), e cada ato registra
**qual** papel o autorizou — nada é negado a ela, e o registro continua dizendo o que foi feito com
que autoridade.

### 3.1 Papéis que nascem com módulo

Existem hoje, no `glossario.md`, e **sobrevivem ao critério como papéis-piso** — mas nenhum é do
núcleo:

| Papel | No código | Módulo | Frase da remoção |
|---|---|---|---|
| Atendente de salão | `attendant` | `MSA` | sem ele, quem lança consumo em comanda precisa de `cashier`, e passa a alcançar o posto de caixa e a gaveta |
| Operador de produção | `production_operator` | `COZ` | sem ele, quem registra avanço de etapa precisa de `cashier` ou `manager`, pelo mesmo motivo |

Que outro módulo traz papel próprio é decisão da spec de cada módulo, não deste arquivo.

---

## 4. O que foi recusado — o resultado da reconciliação

Quatorze candidatos entraram; **cinco** saíram como papel. O restante não é papel — e cada linha diz
**o que ele é**, porque a necessidade que o criou continua atendida.

| Candidato | Fonte | Veredito | Por quê |
|---|---|---|---|
| caixa | `.claude/rules/seguranca.md` §2 | **papel** `cashier` | papel-piso, por (b) do teste de remoção |
| gerente | idem | **papel** `manager` | cinco operações exclusivas |
| dono | idem | **papel** `owner` | meta-autoridade é exclusiva dele |
| papel nomeado para a capacidade de assinar | `RN-EMI-036` | **papel** `fiscal_officer` | ver §4.1 |
| papel da Forja dentro do cliente | decisão do humano, 2026-08-22 | **papel** `provider_support` | `RN-NUC-024` |
| **dono da fila de pendências** | `RN-OFF-011` | **atribuição** `queue_owner` | ver §4.2 — **é o achado deste passo** |
| papel gerencial | `RN-OFF-012`, `glossario.md` §1.8 | **classe**, não papel | significa "`manager` ou acima"; não é um conjunto de autorização próprio |
| administração do lado do cliente | `PN-20` | **é o `owner`** | ver §4.3 |
| responsável do estabelecimento | `RN-OFF-011`, infeliz | **atribuição** `establishment_responsible` | endereço de escalada; não acrescenta autorização |
| papel retido no terminal, com validade | `RN-OFF-024`, `RN-OFF-025` | **estado de autoridade** `retained_authority` | é um papel existente com prazo, não um papel a mais |
| papel autorizado a confirmar proposta da IA | `RN-ATI-001`, `RN-ATI-002` | **não é papel** | `RN-NUC-025` |
| operador | `glossario.md` §1.6 | **sujeito**, não papel | é a pessoa autenticada; o papel é o que ela **porta** |
| sessão externa | `glossario.md` §6 | **não é papel** | já declarado lá: "nunca escala para papel de operador" |
| operação nossa que soma clientes | `RN-EMI-040` | **não é papel dentro do cliente** | vive fora do escopo de qualquer cliente, e `provider_support` **não** a alcança |

### 4.1 Por que `fiscal_officer` é papel, e não `owner` nem `manager`

`RN-EMI-036` exige "papel nomeado" e nunca o nomeou (`LACUNA-EMI-015`). As duas alternativas de
absorção falham no teste de remoção, cada uma para um lado. Absorvido em **`owner`** (escopo
cliente), conceder capacidade de assinar a um terminal do estabelecimento 9 passa a depender de uma
pessoa só — e o prazo da contingência é de horas (`RN-EMI-028`), então centralizar custa venda.
Absorvido em **`manager`** (escopo estabelecimento, e há muitos), todo gerente de turno passa a poder
dar a um terminal o poder de assinar em nome da empresa — e terminal com capacidade viva que é
furtado é evento de comprometimento, não de perda (`RN-EMI-038`). Papel próprio, escopo
estabelecimento, é a única posição que não paga nenhum dos dois preços.

**Não afirmo quem pode portá-lo.** Se a norma exige que seja uma pessoa determinada — responsável
legal, contador, responsável técnico — é `LACUNA-NUC-012`, junto de `LACUNA-EMI-015`, e nada aqui
supõe a resposta.

### 4.2 O achado: `dono da fila` não sobrevive como papel

`RN-OFF-011` diz, literalmente, "existe **um papel** dono da fila (papel, nunca pessoa)". Aplicado o
teste de remoção, ele **não** é papel: não existe operação que somente ele realize. Ver a fila,
resolver item da lista de trabalho (`RN-OFF-012`), decidir sobre divergência de publicação
(`RN-NUC-015`) e sobre perda não quantificável (`RN-OFF-016`) são operações de escopo
estabelecimento, e `manager` já as autoriza — o que a fila precisa não é de **poder** novo, é de um
**endereço**: um alvo único, nomeado, para onde o produto escala por conta própria.

**Nada da necessidade de `RN-OFF-011` se perde**, e é isso que torna a recusa legítima: continua
havendo um alvo único por estabelecimento, continua não sendo o operador de caixa, continua havendo
superfície própria ordenada por prazo, e continua havendo escalada quando ninguém olha. O que muda é
a forma: **atribuição** (`RN-NUC-020`), não papel. Ganho verificável: um papel a mais teria de ser
concedido em **todo** estabelecimento, senão a fila fica órfã sem que nada apareça; a atribuição
ausente é **estado declarado** e exigido na habilitação, o que falha fechado e visível.

**Consequência, aplicada em 2026-08-23:** o enunciado de `RN-OFF-011` dizia "papel" e passou a dizer
**atribuição** — a auditoria mostrou por que a divergência não era inerte (`AUT-11`): implementado como
papel, `queue_owner` ficaria fora do conjunto fechado de `RN-NUC-019`, sem coluna em matriz nenhuma, e o
**gate** de `RN-NUC-020` desapareceria, porque ele verifica uma **atribuição** declarada. Estabelecimento
concluiria a habilitação sem alvo de fila, e pendência fiscal com prazo de horas (`RN-EMI-028`) ficaria
sem quem a olhasse. `LACUNA-OFF-007` fica **respondida na parte de papel** — `manager`, escopo estabelecimento, designado por `queue_owner`, com escalada para
`establishment_responsible` — e **aberta na parte de número** (`LACUNA-NUC-014`).

### 4.3 Por que a "administração do lado do cliente" não é um papel novo

`PN-20` diz que catálogo, preço, operador, papel e limite são editáveis pelo próprio cliente. Isso é
autoridade de **publicação** (`RN-NUC-014`) e já é exclusiva do `owner`. O caso real que empurra para
um papel novo é outro: **o funcionário de escritório que mantém catálogo e preço e não deveria poder
mexer em papel**. Ele não pede papel novo — pede **subconjunto**, e subconjunto é `RN-NUC-021`:
delegação nomeada, com prazo e trilha. Criar `tenant_admin` para isso seria a proliferação que
`RN-NUC-017` existe para impedir, e o sinal de que eu errei aparece se a mesma delegação for
concedida repetidamente a muita gente — aí o papel nasce **com evidência**, o que é decisão do
humano, não minha antecipação.

---

## 5. Fronteira de D-03 — o que estes arquivos deliberadamente não decidem

Requisito acumulado, para o dossiê do passo 8: papel tem **dois** níveis de escopo e a autorização é
avaliada no escopo do **objeto** (`RN-NUC-018`) · atribuição carrega escopo, terminal e janela de
tempo, e **não** é artefato publicado (`RN-NUC-020`) · autoridade é **retida com validade** e
revogação vale na reconexão (`RN-OFF-024`) · delegação é subconjunto com prazo, sem cadeia, e **morre
com a atribuição que a originou** (`RN-NUC-021`) · autorização é sempre verificada no backend (`PN-11`)
· a meta-autoridade tem piso que configuração não alcança (`RN-NUC-023`) · e **o papel do provedor é,
por construção, uma identidade nossa dentro do ambiente de N clientes, com uma concessão por cliente**
(`RN-NUC-024`) — é o requisito que mais aperta D-03.

**Dois requisitos acrescentados em 2026-08-23, e eles apertam D-03 mais que todos os de cima.**
(1) O **ato ordinário** de venda não se sustenta em autoridade de pessoa: ele exige que o terminal
retenha, **sem contato**, a habilitação de vender por aquele estabelecimento, mais a **identificação**
do operador (`RN-OFF-032`). Opção de D-03 que não entregue isso não satisfaz a regra, e escolhê-la
reabre o conflito com `PN-01`. (2) O **meio de identificação retido** é uma **terceira categoria** de
coisa retida — não é artefato publicado nem autoridade (`RN-OFF-033`,
`papeis-atribuicao-e-delegacao.md` §1.1); o **mecanismo** de prova continua não sendo decidido aqui.

**Não decidido, e não presumido em nenhuma linha:** onde a identidade mora (por cliente ou global);
como se prova quem é a pessoa (senha, PIN, crachá, biometria, cartão); forma de sessão, token ou
expiração técnica; SSO; e se o mesmo humano existe em mais de um cliente. **Decidido em 2026-08-23, e
já não é fronteira:** reautenticar **sem contato não existe** — a divergência de `RN-OFF-024`(b)×(d)
está fechada no texto da regra dona, e o produto nunca oferece "reautentique" sem rede
(`papeis-atribuicao-e-delegacao.md` §6.1).

---

## 6. Lacunas dos dois arquivos

Abertas em 2026-08-22. Nenhuma bloqueia as regras: cada uma foi escrita para sobreviver às duas
respostas. `LACUNA-NUC-001` a `008` estão em `nucleo-venda.md` §6.

- **`LACUNA-NUC-009`** — a concessão de `provider_support` exige **consentimento do cliente por
  concessão**, ou basta a trilha visível a ele (`RN-NUC-024`d)? As duas atendem "trilha visível";
  só a primeira dá ao cliente o poder de recusar. **Dono:** humano.
- **`LACUNA-NUC-010`** — **prazo máximo** de uma concessão de `provider_support`, e se ela é
  renovável e quantas vezes. É número, e não o escrevo. **Dono:** humano.
- **`LACUNA-NUC-011`** — **quem, do nosso lado**, concede e revoga `provider_support`, e quem audita
  o uso. Não é papel de cliente, e a operação de plataforma não tem papel declarado em nenhum
  artefato. **Dono:** humano; entrada direta de **D-03**. Relacionada à pergunta de
  `offline-grandezas-e-orcamento.md` sobre quem opera limites do nosso lado.
- **`LACUNA-NUC-012`** — `fiscal_officer` precisa ser uma pessoa determinada por norma (responsável
  legal, contador, responsável técnico), ou é escolha do cliente? Não afirmo por analogia.
  **Dono:** humano, com o contador; é a mesma pergunta de `LACUNA-EMI-015`.
- **`LACUNA-NUC-013`** — que operações, além das três de `RN-NUC-023`, pertencem ao **piso** que
  configuração de cliente não alcança. **Dono:** humano, com entrada da auditoria do passo 4.
- **`LACUNA-NUC-014`** — com quanta **antecedência** o produto escala ao
  `establishment_responsible` antes do prazo mais próximo da fila (`RN-OFF-011`, infeliz). É a parte
  numérica de `LACUNA-OFF-007`; a parte de papel está respondida em §4.2. **Dono:** humano.
- **`LACUNA-NUC-034`** — o **teto próprio** do prazo de uma delegação (`RN-NUC-021`a). Aberta em
  2026-08-23: a cláusula antiga ("prazo não maior que o da própria atribuição") não tinha referente,
  porque atribuição não tem vigência, e a cascata de `RN-NUC-021`b fecha a sobrevivência ao delegante mas
  **não** o tamanho do prazo. É número, e não o escrevo. **Dono:** humano.
- **Fora de lacuna, e é pergunta de fronteira:** **habilitar e desabilitar módulo** para um cliente é
  ato de `owner`, nosso, ou dos dois? O registro de módulo ativo é de plataforma e nenhum artefato diz
  quem o move — então nenhum papel acima o reivindica. **Dono:** humano.

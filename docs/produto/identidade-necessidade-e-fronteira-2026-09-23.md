# Identidade: necessidade e fronteira, para fechar `D-03` (2026-09-23)

> **O que este arquivo é.** O passo B.1 de `T-0015` (item `F-017`): o que o negócio precisa da
> identidade, lido contra as regras aprovadas, para que a escolha técnica de `D-03` seja medida contra
> necessidade escrita e não contra conveniência da fundação. Relê o dossiê
> `docs/arquitetura/d-03-identidade-opcoes.md` (2026-08-23), escrito com `D-01` e `D-02` abertas, contra
> as duas fechadas (`memory/plataforma/decision-d-01-fastify-e-kysely.md`,
> `memory/plataforma/decision-d-02-arranjo-d.md`).
>
> **O que ele não é.** Não escolhe entre A, B e C: isso é do thread, depois de `backend` medir (B.2) e
> `seguranca` auditar (B.3). Não escolhe mecanismo de prova (senha, PIN, crachá, biometria). Não numera
> `RN`: as propostas de regra da §2 e da §3 precisam entrar em `papeis-e-permissoes.md` e no irmão
> `papeis-atribuicao-e-delegacao.md`, que estão sendo editados por outra passada, e vão como pergunta
> ao thread. Não escreve número (prazo, validade, janela).
>
> **Decisão delegada.** O humano delegou `D-03` em 2026-09-23 com critério de escalabilidade
> (`memory/processo/convention-decisao-delegada-com-aviso-no-modulo.md`). Onde este arquivo propõe
> desfecho, ele diz o eixo que escala; onde a resposta depende de terceiro ou de decisão comercial, ele
> põe o aviso na forma de `F-018` e não decide.

## A resposta direta

1. **Rede com N estabelecimentos é um cliente (tenant)**, e a hipótese se confirma pela spec. O humano
   que opera em mais de um cliente, **do lado do cliente**, é borda: contador como `fiscal_officer`,
   franquia cujos franqueados contratam separado, revenda. **Do nosso lado** ele é rotina, mas é outra
   população, e o que ela exige não é diretório global de operadores de cliente (§1).
2. **O primeiro `owner` é criado por ato nosso, dentro do ato que provisiona o cliente**, só enquanto o
   cliente tem zero `owner`, sem que nenhum segredo dele passe por nós. Recuperar cliente que perdeu o
   único `owner` é outro ato, depende de resposta jurídica e comercial, e fica indisponível (§2).
3. **Segundo fator é exigido por classe de ato, conferido com contato**: todo papel nosso, a
   meta-autoridade e a publicação do `owner`, o ato sobre a capacidade de assinar, e a operação sensível
   praticada fora de terminal habilitado. Sem contato ele nunca é pedido e nada renova (§3).
4. **Provedor de identidade do próprio cliente** não tem necessidade registrada. Se existir, é escopo
   `cliente`, opt-in, só para ato com contato, nunca carrega o tenant e nunca substitui o meio retido no
   terminal (§4).
5. **No terminal, sem rede**, o operador prova só **quem é**, contra o conjunto retido do
   estabelecimento; o terminal prova que está habilitado. Isso sustenta as nove linhas do ato ordinário
   e nada além (§5).
6. **Vinte invariantes** que qualquer opção de `D-03` tem de manter estão na §6, cada um com a regra dona.

---

## 1. O humano em mais de um cliente: borda ou venda

### 1.1 A hipótese se confirma: a rede é um cliente só

Cliente (tenant) é "a empresa que contrata a Forja" e a unidade de isolamento de dado
(`glossario.md:28`); estabelecimento é a unidade de operação e de identidade jurídica, e um cliente tem
uma ou mais (`glossario.md:30`). `RN-NUC-050` fixa as duas coisas juntas
(`nucleo-estabelecimento.md:32-44`): a unidade pertence a exatamente um cliente, e o que separa duas
unidades do mesmo cliente é autorização e escopo de resolução, nunca isolamento físico. O escopo da
regra passa no teste dos três negócios pelo caso multi-unidade: o posto com duas bandeiras, a padaria
com fábrica e quiosque, a loja de roupa com duas lojas (`:42-44`).

O caso que o dossiê chamou de venda já está resolvido dentro de um cliente. "O gerente regional alcança
quatro lojas" é o exemplo de `RN-NUC-020` (`papeis-atribuicao-e-delegacao.md:86-87`), e a atribuição
aceita como escopo "um cliente, ou um conjunto explícito de estabelecimentos" (`:74-75`). Revogar a pessoa
na rede inteira é revogar as atribuições dela **num** cliente, que é um ato só. `RN-NUC-018` confirma
que o operador com atribuição em dois estabelecimentos alcança os dois, com cada ato registrado no
estabelecimento onde ocorreu (`papeis-e-permissoes.md:95-96`).

Logo, o dossiê §8 (`d-03-identidade-opcoes.md:351-352`) errou ao pôr "rede com administração central" e
"grupo de N estabelecimentos sob quadros compartilhados" em **caso de venda**: pela spec vigente os dois
são um cliente, e nenhum cruza tenant. A vantagem de B, revogação num ato em todos os clientes
(`:339-342`), só existe para quem tem papel em clientes **diferentes**.

### 1.2 Onde a hipótese deixa de valer, e o que a spec presume ali

Sobram três casos do lado do cliente, e nenhum tem regra que o torne rotina:

| Caso | O que a spec diz | Desfecho hoje |
|---|---|---|
| **Contador de vários clientes** | ele é parceiro do cliente, e o acesso dele é contrato publicado, escopado e revogável (`INT`, `catalogo-de-modulos.md:243-251`; `PN-14`, `postura-nova-geracao.md:246-251`), não operador de PDV. Só vira operador se a norma exigir que ele porte `fiscal_officer`, e isso é `LACUNA-NUC-012` (`papeis-e-permissoes.md:285-287`) | borda: um acesso por cliente |
| **Franquia em que cada franqueado contrata separado** | nenhuma regra fala dela. A franqueadora que queira operar sobre franqueados de contratos distintos está atravessando clientes, e `RN-EMI-039` recusa acesso amplo "porque é do mesmo grupo" (`fiscal-custodia-e-trilha.md:290-293`) | não suportado; a rede que quer administração central entra como **um** cliente |
| **Revenda, escritório com carteira própria** | é `LACUNA-PRV-001` (`operacao-do-provedor-alcance.md:350-351`), e a spec fiscal já presume o caso estreito enquanto não houver resposta (`fronteira-do-nucleo.md:264-268`) | caso estreito: operamos só para cliente nosso |

Um custo do desfecho da segunda linha precisa ficar à vista: a franquia que entra como um cliente dá ao
franqueado, no máximo, papel de escopo estabelecimento. Publicar catálogo, preço e configuração da
unidade é `owner`, de escopo cliente (`matriz-operacao-papel.md:73`, `:93`), então o franqueado não
decide o próprio preço sem a franqueadora. Isso é pergunta de produto para o humano (§9, P-1), e não
muda a resposta de `D-03`: nos dois desfechos, ninguém do lado do cliente precisa existir em dois tenants.

### 1.3 O nosso pessoal é rotina, e é outra população

O irmão do escopo `provedor` registrou que, com leitura ampla e mutação ampla em papéis nossos, existir
dentro do ambiente de N clientes é rotina (`operacao-do-provedor-alcance.md:309-318`). A leitura está
certa e não empurra para B, porque o sujeito é outro. Os papéis nossos são escopo `provedor`, fora do
conjunto do núcleo (`RN-PRV-003`, `operacao-do-provedor.md:144-161`), e o dossiê já separava as duas
populações: o `platform` tem de hospedar identidade, a **nossa**, e não pode hospedar a do cliente sem
enfrentar `dados.md` §1 (`d-03-identidade-opcoes.md:59-63`).

O que a rotina nossa exige está escrito, e nenhuma cláusula dela pede operador de cliente em população
global:

- **Um ato nomeia exatamente um cliente**; alcançar o segundo é ato novo de resolução, registrado
  (`RN-PRV-004` c, `operacao-do-provedor.md:210-212`).
- **O cliente-alvo nunca vem do pedido**; identificador no pedido só confirma, e divergência recusa
  (`RN-PRV-004` b, `:204-209`). Nenhuma superfície nossa enumera clientes para escolher
  (`memory/plataforma/gotcha-nenhuma-superficie-nossa-enumera-clientes-para-escolher.md`).
- **Trabalhar os vinte clientes do dia sem reautenticar vinte vezes** é necessidade preservada, com o
  mecanismo em aberto (`RN-PRV-004`, infeliz das cláusulas do objeto, `:249-258`). Em produto isso se lê
  assim: a pessoa nossa prova quem é uma vez, e cada cliente alcançado é uma resolução registrada.
- **Todo ato e toda leitura nossos ficam legíveis pelo cliente**, com autor e autoridade (`RN-PRV-006`,
  `:282-300`).

O dossiê §6 (`:285-296`) trata só `provider_support`. `provider_operator` e `provider_administrator`
(`operacao-do-provedor.md:157-161`) não aparecem nele, e o primeiro é o que muta em N clientes todo dia.
B.2 precisa medir as três opções para os três papéis, não para um.

### 1.4 Veredito, e o que cada opção atende

**Borda**, para a população de operadores de cliente, pela spec vigente. O eixo que escala com o
negócio é **N clientes × M estabelecimentos por cliente × pessoas por estabelecimento**; as pessoas
atravessam estabelecimento por atribuição, dentro de um tenant. Uma pessoa de cliente em N tenants não
aparece em nenhuma regra. Se o humano disser que franquia de contratos distintos ou carteira de contador
é mercado-alvo, a resposta muda e a pergunta volta ao thread com este arquivo como insumo.

| Necessidade, e onde está escrita | A | B | C |
|---|---|---|---|
| N1. Nenhuma consulta vê outro cliente (invariante 1; `decision-tenancy-schema-por-cliente`) | por construção | por verificação | por construção |
| N2. Primeira chegada sem terminal (retaguarda em navegador) sem tenant vindo do chamador (`backend.md` §1) | sem caminho próprio; precisa da peça de C (`d-03-identidade-opcoes.md:130-133`) | sessão cunhada para um cliente | alça opaca por (pessoa, cliente) |
| N3. Uma pessoa **de cliente** em N clientes, revogada num ato | não | sim | não |
| N4. Pessoa nossa em N clientes: uma prova, uma resolução registrada por cliente (`RN-PRV-004` b, c) | precisa de população nossa à parte | a nossa e a do cliente viram uma só (`:292-296`) | precisa de população nossa à parte |
| N5. Ato ordinário sem rede (`RN-OFF-032`) | sim | sim | sim |
| N6. Conjunto retido projetado por estabelecimento sem vazar cliente (`RN-OFF-033` b) | nasce num schema | filtro sobre população global (agravante de `decision-d-03-sao-tres-eixos-nao-uma-decisao`) | nasce num schema |
| N7. Encerrar cliente sem acesso sobrevivente (`RN-PRV-013`; dossiê `:235`) | schema inerte | exclusão de linhas em tabela viva | schema inerte, mais retirar a alça |

A necessidade que só B atende (N3) não tem dono do lado do cliente. N4 as três precisam atender; B a
atende fundindo a população nossa com a do cliente, que o dossiê já descreve como contenção por
política no lugar de estrutura (`:292-296`).

---

## 2. Quem cria o primeiro `owner` (`LACUNA-IDE-002`)

Nenhum papel de cliente pode: `owner` ainda não existe, e atribuir papel é meta-autoridade só dele
(`RN-NUC-023`, `papeis-atribuicao-e-delegacao.md:192-203`; linha 20 da matriz, `matriz-operacao-papel.md:75`).
`provider_support` também não, porque não pratica operação de negócio (`RN-NUC-024`, `:284-299`). O ato é
**nosso**, e a spec já tem quem muta o ambiente do cliente: `provider_operator` "edita usuário dele"
(`operacao-do-provedor.md:159`) e "provisionar" está entre os atos que a matriz do escopo `provedor` vai
enumerar (`superficie-do-provedor.md:213-215`). A parte de papel de `LACUNA-NUC-011` já foi respondida
por `RN-PRV-005` (`operacao-do-provedor.md:262-271`).

**Proposta, para o thread decidir e para `papeis-e-permissoes.md` registrar:**

```
provisionar cliente novo (fato datado, RN-PRV-013)
→ no mesmo ato: criar a atribuição de owner para a pessoa que o contrato nomeia
→ a pessoa recebe o convite e define ela mesma a prova (nós nunca a conhecemos)
→ primeiro owner confirmado: a partir daqui, atribuir papel é só dele (linha 20)
```

- **Enunciado proposto.** O primeiro `owner` de um cliente é atribuído por `provider_operator` **no mesmo
  ato que provisiona o cliente**, e só enquanto o cliente não tem nenhum `owner`. Depois disso, qualquer
  tentativa nossa de atribuir papel naquele cliente é recusada.
- **Por que no mesmo ato.** O alvo é o cliente que o próprio ato cria, então ele não é resolvido por
  identificador informado no pedido. É o mesmo raciocínio que dispensa unidade resolvida para criar a
  primeira unidade (`nucleo-estabelecimento.md:67-70`). Ato separado, depois, precisaria resolver o alvo
  fora do pedido para um cliente que já existe, e cai na trava de `RN-PRV-004` (d).
- **Nós não conhecemos a prova do `owner`.** O mecanismo que `RN-NUC-024` recusa é a credencial
  compartilhada, que faz a trilha dizer que o dono fez o que nós fizemos (`papeis-atribuicao-e-delegacao.md:303-305`).
  Se nós definimos a prova inicial dele, ela é compartilhada até ele trocá-la.
- **Aceite.** Provisionar o cliente K com a pessoa P nomeada: K nasce com exatamente uma atribuição de
  `owner`, para P, com autor nosso, instante e motivo no fato. P define a própria prova antes de praticar
  qualquer ato. O `owner` de K lista esse ato na superfície dele (`RN-PRV-006` a, que põe "provisionar" no
  perímetro, `operacao-do-provedor.md:289-293`). Uma segunda tentativa nossa de atribuir papel em K,
  inclusive outro `owner`, é recusada.
- **Infeliz.** P nunca aceita o convite: K fica provisionado sem `owner` utilizável, ninguém do cliente
  cria estabelecimento nem atribui papel (linhas 20 e 23 são só dele), e o estado é visível para nós
  como provisionamento incompleto, com o fato de falha (`RN-PRV-013`: "falha também é fato"). Nunca "a
  gente entra com um usuário provisório e passa para ele depois".

**Recuperação é outro ato, e ele fica indisponível.** O cliente que perdeu o único `owner` (credencial
perdida, sócio que saiu, falecimento) precisa voltar a mexer no que é dele (`PN-20`,
`postura-nova-geracao.md:340-345`). O mecanismo que se recusa é o suporte redefinir o dono por telefone:
é a tomada de conta mais barata do sistema, porque o `owner` publica preço e atribui papel. Quem pode
provar que é o novo responsável pelo cliente é pergunta jurídica e comercial.

> **Indisponível: recuperar o acesso de cliente sem `owner` utilizável.** Não funciona: atribuir
> `owner` num cliente que já existe. Falta: o que prova legitimidade contratual para substituir o
> responsável. Responde: humano, com advogado. Enquanto isso: recusa, pelo default fechado do escopo
> `provedor` (`RN-PRV-015`). Desde: 2026-09-23.

**Hoje nada disto é executável**, e quem pegar o provisionamento precisa saber antes: nenhum papel nosso é
atribuível enquanto a leitura da nossa trilha pelo `owner` não tiver célula (`RN-PRV-006` b,
`operacao-do-provedor.md:294-297`, `LACUNA-NUC-031`), e a linha "provisionar e atribuir o primeiro
`owner`" não existe na matriz do escopo `provedor` (`matriz-celulas-a-valorar.md` §1). O primeiro cliente
real depende das duas (§9, P-2).

---

## 3. Segundo fator, por papel (`LACUNA-IDE-005`)

O critério é o alcance de uma credencial roubada, lido por classe de ato. Dois fatos da spec o
decidem. Sem contato nada renova e reautenticar não existe (`RN-OFF-024` b, d,
`fila-local-autoridade-e-identidade.md:47-50`), então segundo fator só pode ser conferido **com contato**.
E o `owner` está no conjunto retido de todo terminal do estabelecimento (`RN-OFF-033` b, `:231-233`): se
a prova usada na retaguarda for a mesma que o terminal sabe conferir, terminal furtado vira caminho para
a meta-autoridade.

**Proposta, para o thread decidir e `seguranca` auditar em B.3:**

| Papel | Segundo fator exigido | Por quê |
|---|---|---|
| `provider_operator`, `provider_administrator` | sempre, em toda superfície | uma credencial alcança N clientes, em mutação ampla ou leitura ampla (`operacao-do-provedor.md:157-161`). É a credencial de maior alcance do sistema, e escala com N clientes |
| `provider_support` | sempre, ao operar sob concessão | mesma razão; e ele nunca opera sem contato (`RN-NUC-024`, `:298`) |
| `owner` | para meta-autoridade e publicação (linhas 18 a 23 e 36 a 39 da matriz) | tudo que só ele faz é online (`papeis-atribuicao-e-delegacao.md:258`), e o que ele publica chega a todos os terminais do cliente |
| `fiscal_officer` | para ato sobre a capacidade de assinar | é online por construção (`RN-EMI-037`) e carrega a responsabilidade legal do emitente |
| `manager` | para operação sensível praticada **fora** de terminal habilitado | no terminal a prova é conferida num dispositivo habilitado para aquele estabelecimento (`RN-OFF-032` i); na retaguarda, não há nada além da prova |
| `cashier`, `attendant`, `production_operator` | não exigido pelo núcleo | o ato deles é ordinário e acontece sem rede; exigir quebraria `RN-OFF-032` |

- **Piso, não teto.** O cliente pode exigir segundo fator de mais papéis; nunca de menos. Mesmo formato
  do piso de `RN-NUC-023`.
- **Sem contato.** Nunca é pedido. Autoridade retida obtida com segundo fator vale pela validade de
  sempre (`LACUNA-OFF-011`) e não se renova. O ato ordinário não passa a depender dele.
- **Infeliz.** A pessoa perde o segundo fator: restabelecê-lo é ato com contato, praticado por outro
  papel que a alcance; para o `owner` único, é o mesmo caso indisponível da §2. O produto nunca oferece
  "pular o segundo fator desta vez".
- **O que isto não decide.** Qual segundo fator. É mecanismo (`LACUNA-OFF-015`), e a escolha é de
  `backend` com `seguranca`.

## 4. Provedor de identidade do próprio cliente

**De quem seria a necessidade.** De um cliente com diretório corporativo próprio, que quer desligar a
pessoa num lugar só, o dele, e ela perder acesso ao PDV sem segundo ato. **Nenhuma regra, pedido ou
corpus registra essa necessidade**: os dois clientes de referência são lojas pequenas
(`dois-varejos-corpo-de-prova-2026-09-11.md`), e a spec só menciona SSO para dizer que não o decide
(`papeis-e-permissoes.md:262-264`).

**Escopo, pelo teste dos três negócios:** `cliente`, opt-in. A padaria não tem diretório corporativo; se
existir, é configuração de um cliente, nunca núcleo.

**O que ele nunca pode fazer, qualquer que seja a opção de `D-03`:**

- **Provar identidade sem contato.** O terminal offline não consulta provedor nenhum; o meio retido é
  recebido com contato e nunca nasce no terminal (`RN-OFF-033` b). O `cashier` continua identificado pelo
  conjunto retido, e a revogação feita no diretório do cliente chega ao terminal na reconciliação
  (`LACUNA-OFF-016`), não antes.
- **Dizer qual é o tenant.** O provedor do cliente X fala só por X, configurado em X. Asserção dele que
  nomeie outro cliente é texto de terceiro e cai na mesma recusa de `backend.md` §1.
- **Autorizar.** Ele prova quem é a pessoa; papel continua sendo atribuição do cliente
  (`RN-NUC-020`) e autorização continua no backend.

> **Indisponível: entrar com o provedor de identidade do próprio cliente.** Não funciona: prova de
> identidade delegada ao diretório de um cliente. Falta: um cliente que exija isso e a decisão comercial
> de oferecer. Responde: humano. Enquanto isso: a prova é a da Forja, para todo papel. Desde: 2026-09-23.

O que B.2 precisa medir sobre isso é uma coisa só: se a opção escolhida torna o acréscimo futuro uma
migração de residência do sujeito. Custo de reversão, na ordem de
`memory/plataforma/convention-o-caro-e-o-tipo-da-chave-nao-a-geracao.md`.

---

## 5. O que o operador prova no terminal, com e sem rede

```
terminal habilitado a vender pelo estabelecimento E
  (fato com contato, retido, vence sem contato: LACUNA-OFF-017)
→ operador apresenta a prova
→ conferida contra o conjunto retido de E (recebido com contato, reconciliado)
   ├ reconhecido → é o autor do fato; alcança as nove linhas terminal+ident
   │   └ operação sensível → autoridade retida válida (RN-OFF-024) ou contato
   └ não reconhecido → recusa identity_unrecognized, sem o meio apresentado
                       (RN-NUC-056); ele não opera naquele terminal
```

- **Sem rede, o operador prova quem é, e só isso.** A prova não autoriza nada (`RN-OFF-033` a,
  `fila-local-autoridade-e-identidade.md:229-230`); o ato ordinário se sustenta em terminal habilitado
  mais operador identificado (`RN-OFF-032`, `:125-129`), integral em D1, D2 e D3 (`:215`). O teto de
  desconto aplicado é o do papel-piso (`:147-152`).
- **Sem rede, o que ele não consegue provar**: papel novo, estabelecimento novo, nem que acabou de ser
  contratado. Quem nunca esteve no conjunto não opera, e isso é declarado na habilitação (`:207-208`).
- **Com rede**, a prova é conferida no servidor e a autorização é verificada no backend por ato
  (`RN-NUC-022`, `papeis-atribuicao-e-delegacao.md:163-167`). Segundo fator entra aqui e só aqui (§3).
- **O que o terminal retém para identificar não serve para provar em outro lugar.** Com terminal furtado,
  o conjunto é tratado como comprometido (`RN-OFF-033` d; `C-09`, `fila-local-conteudo-e-repouso.md:168-170`).
  O mecanismo de `D-03` decide o preço disso: se o material retido permite reconstruir a prova, todo
  operador daquele estabelecimento troca a dele depois de um furto. B.2 declara esse preço por opção.
- **No arranjo D**, "o terminal" é o navegador mais o acompanhante, e a custódia fica no acompanhante
  (`decision-d-02-arranjo-d.md`). Se a prova atravessa o canal local entre os dois é desenho de
  `backend` com `seguranca` (`F-017`, fora de escopo); o requisito de produto é o piso de repouso de
  `RN-OFF-021` e a ausência em diagnóstico (`RN-OFF-033` c).

**Os cinco casos do aceite de `F-017`, com o desfecho que o negócio exige:**

| Caso | Desfecho exigido |
|---|---|
| Sem rede desde a abertura, operador abre sessão e vende em espécie | acontece; autor é o operador reconhecido pelo conjunto retido de E; nenhuma autoridade retida é consultada (`nucleo-caixa-e-turno.md:33-35`) |
| Dono na retaguarda, sem acompanhante e sem terminal | o tenant não vem de path, `query`, `body` nem header livre; meta-autoridade só com segundo fator (§3) |
| `provider_support` com concessão em X tenta Y | recusa (`RN-NUC-024`, aceite, `papeis-atribuicao-e-delegacao.md:337-338`), sem revelar que Y existe (`RN-NUC-036`); B.2 diz se a recusa é por construção ou por verificação nomeada |
| Mesma pessoa com papel em dois clientes | dois acessos, revogados um a um, e isso é aceitável porque o caso é borda (§1.4). Se a pessoa for nossa, é uma prova e duas resoluções registradas (§1.3) |
| Terminal furtado e mantido offline | quem o tem só pratica as nove linhas, e só se conseguir se identificar como operador de E; operação sensível só dentro da validade de autoridade retida já presente; tudo para quando a habilitação vence (`fila-local-autoridade-e-identidade.md:194-198`); nada alcança outro estabelecimento nem outro cliente |

---

## 6. O que `D-03` não pode quebrar, qualquer que seja a opção

| # | Invariante | Regra dona |
|---|---|---|
| 1 | Tenant resolvido uma vez, na borda, pela identidade; nunca de texto do chamador | `.claude/rules/backend.md` §1; `decision-tenancy-schema-por-cliente` |
| 2 | Para papel nosso, o cliente-alvo é resolvido fora do pedido; o pedido só confirma, divergência recusa | `RN-PRV-004` b, `operacao-do-provedor.md:204-209` |
| 3 | Um ato nosso, um cliente; o segundo exige resolução nova, registrada | `RN-PRV-004` c, `:210-212` |
| 4 | Nenhuma superfície nossa enumera clientes; nenhuma tem alvo implícito | `RN-PRV-004` b; `gotcha-nenhuma-superficie-nossa-enumera-clientes-para-escolher` |
| 5 | Autorização no escopo do objeto; dois níveis; papel de estabelecimento nunca vale para o cliente inteiro | `RN-NUC-018`, `papeis-e-permissoes.md:75-101` |
| 6 | Ato ordinário sem contato no instante do ato: terminal habilitado mais operador identificado | `RN-OFF-032`, `fila-local-autoridade-e-identidade.md:123-132` |
| 7 | Meio de identificação retido: identifica e não autoriza; recebido com contato, por estabelecimento; inclui quem porta só `owner`; nunca inclui `provider_support`; reconcilia; comprometido no furto | `RN-OFF-033`, `:223-238` |
| 8 | Sem contato não há reautenticação nem renovação; revogação vale na reconexão, antes da próxima operação sensível | `RN-OFF-024`, `:43-52` |
| 9 | Habilitação do terminal tem prazo e é revogável no servidor; o terminal pertence a um estabelecimento | `RN-OFF-032` i, `:154-162`; `glossario.md:31-32` |
| 10 | Atribuição não é artefato publicado; delegação morre com a atribuição de origem | `RN-NUC-020`, `RN-NUC-021` |
| 11 | Meta-autoridade é do `owner`, com contato; nenhum papel amplia a si mesmo | `RN-NUC-023` |
| 12 | `provider_support` é concessão com escopo mínimo, prazo, motivo e trilha visível; nunca retido, nunca mais de um cliente, nunca dado de pagamento nem capacidade de assinar | `RN-NUC-024`, `papeis-atribuicao-e-delegacao.md:284-299` |
| 13 | Nenhum papel nosso é atribuível sem célula para a leitura da nossa trilha | `RN-PRV-006` b |
| 14 | Todo ato e toda leitura nossos são legíveis pelo cliente, com autor e autoridade | `RN-PRV-006`, `RN-PRV-016` |
| 15 | Todo ato registra em que se sustentou: atribuição, concessão, ou identificação retida mais habilitação | `business-rule-registro-de-ato-nomeia-em-que-o-ato-se-sustentou`; `RN-NUC-029` |
| 16 | Identidade não reconhecida no terminal é fato `identity_unrecognized`, sem o meio apresentado | `RN-NUC-056`, `fatos-de-operacao-dominios-fechados.md:78-92` |
| 17 | Material de prova nunca em fato, log, erro nem exportação | `.claude/rules/seguranca.md` §3; `RN-OFF-033` c |
| 18 | Filtrar manifesto por papel não é autorizar | `d-03-identidade-opcoes.md:53-54` (R-11, R-12) |
| 19 | Sessão externa e identidade de cliente-final nunca escalam para operador e têm espaço de autoridade próprio | `glossario.md:384`, `:386`; `modulos/pedido-cliente-final-sessao.md:40-43` |
| 20 | Contagem que soma clientes não é alcançável por superfície de cliente nem por `provider_support` | `RN-EMI-040`, `fiscal-custodia-e-trilha.md:295-301` |

E a restrição que decorre de 7 com 11: se a prova que o terminal confere offline for suficiente para a
retaguarda, o furto de um terminal entrega a meta-autoridade do `owner`. O segundo fator da §3 é o que
separa as duas.

## 7. Registra / Não registra

**Registra:**

- Identificação no terminal, reconhecida (vira autor do fato) e não reconhecida (`RN-NUC-056`), com a
  reconciliação do conjunto como marco (`identity_set_reconciled`).
- A atribuição do primeiro `owner`, dentro do fato de provisionamento, com autor nosso e a pessoa nomeada
  (§2), e o convite não aceito como provisionamento incompleto.
- Cada resolução de cliente-alvo por pessoa nossa (`RN-PRV-004` c).
- **Recusa de prova em superfície sem terminal** (retaguarda, superfície nossa), inclusive falha de
  segundo fator. Hoje nenhuma regra a registra, e o que se perde sem ela é a única evidência de
  tentativa de tomada de conta contra `owner` ou contra pessoa nossa. Duas perguntas ficam com dono: que
  campos o fato carrega sem revelar se a conta existe (`seguranca`, B.3), e **onde ele mora** quando a
  recusa acontece antes de o tenant ser resolvido. Ela não tem ambiente de cliente, como a tentativa
  recusada de papel nosso (`gotcha-fato-do-provedor-nao-tem-residencia-unica`); é `backend` com
  `arquiteto-dados`.

**Não registra, e por quê:**

- **O meio apresentado, inteiro ou em parte**, em nenhum fato. `RN-NUC-056` (a) proíbe até derivação
  dele, e `seguranca.md` §3 proíbe credencial em qualquer lugar.
- **Digitação abortada antes de a prova ser apresentada.** Nada chegou ao sistema, então não houve
  tentativa; e capturar o que foi digitado num campo de prova é capturar credencial parcial, que a
  cláusula acima proíbe. Isto responde a pergunta que `F-017` deixou aberta na parte do que nunca foi
  submetido; o que foi submetido e recusado está na primeira lista.

## 8. O que mudou no dossiê desde 2026-08-23

Para B.2, que escreve o arquivo novo sem editar o dossiê:

- `D-01` fechou (Fastify e Kysely) e `D-02` fechou (arranjo D). O dossiê dizia as duas abertas
  (`d-03-identidade-opcoes.md:7-10`).
- `RN-OFF-024`, `RN-OFF-026`, `RN-OFF-032` e `RN-OFF-033` mudaram de arquivo em 2026-08-23. As citações
  do dossiê a `fila-local-conteudo-e-repouso.md:111`, `:158`, `:215` e `:266` (por exemplo em `:48`,
  `:52`, `:110-111`, `:250-253`, `:365-366`) valem hoje `fila-local-autoridade-e-identidade.md:43`,
  `:95`, `:123` e `:223`.
- O resíduo de redação do dossiê (§7.2 e a pergunta a `produto`, `:309-314`, `:395-397`) está fechado:
  `C-09` já lista o conjunto retido e o trata como comprometido (`fila-local-conteudo-e-repouso.md:159-160`,
  `:168-170`).
- §6 cobre só `provider_support`; `provider_operator` e `provider_administrator` ficaram de fora (§1.3).
- §8 classifica rede e grupo como caso de venda; pela spec são um cliente (§1.1).
- `RN-NUC-056` (2026-09-11) registra a recusa por identidade no terminal, posterior ao dossiê.

## 9. Perguntas

- **P-1, para o humano.** Franquia em que cada franqueado contrata separado, e a franqueadora quer operar
  sobre todos: é mercado-alvo? Se não for, o default é o de §1.2 (a rede entra como um cliente, e o
  franqueado não publica o próprio preço). Se for, o humano em N clientes deixa de ser borda e a pergunta
  de `D-03` reabre com este arquivo como insumo.
- **P-2, para o thread.** Escrever como `RN` as propostas da §2 (primeiro `owner` no provisionamento) e da
  §3 (segundo fator por classe de ato), em `papeis-e-permissoes.md` e no irmão, e pedir ao dono da matriz
  do escopo `provedor` a linha "provisionar e atribuir o primeiro `owner`". Não editei esses arquivos.
  Achado da mesma leitura: **habilitar terminal a vender não é linha de nenhuma matriz** (busca por
  `habilit` em `matriz-*.md` devolve só módulo, emissão e meio de pagamento), então hoje é negado a todos
  pelo default (`RN-NUC-026`). É o ato que cria o portador de tenant do terminal (dossiê §2.1, portador
  1) e o fato (i) de `RN-OFF-032`, e `F-021` vai modelá-lo; falta dizer quem o pratica.
- **P-3, para `seguranca`, em B.3.** Confirmar se terminal habilitado conta como elemento suficiente para
  dispensar segundo fator do `manager` no terminal, e que campos a recusa de prova fora do terminal
  carrega sem revelar existência de conta.
- **P-4, para `backend`, em B.2.** Por opção: o preço de um terminal furtado sobre as provas do
  estabelecimento (§5), o custo de acrescentar provedor de identidade do cliente depois (§4), e a
  cobertura dos três papéis nossos (§1.3).

## Referências

Os `path:linha` estão no corpo, junto de cada afirmação. As fontes principais: o dossiê
`docs/arquitetura/d-03-identidade-opcoes.md`, o item `docs/backlog/F-017-fechar-d-03-identidade-e-prova.md`,
`papeis-e-permissoes.md` com o irmão de atribuição, os três arquivos de `operacao-do-provedor*`,
`fila-local-autoridade-e-identidade.md` e `memory/plataforma/decision-d-03-sao-tres-eixos-nao-uma-decisao.md`.

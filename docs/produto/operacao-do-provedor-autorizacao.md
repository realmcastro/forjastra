# Operação do provedor — as duas travas que o escopo novo não herda de ninguém

> **Terceiro irmão de `operacao-do-provedor.md` e `operacao-do-provedor-alcance.md`, com o mesmo peso
> normativo.** Nasceu em 2026-08-23, no conserto dos achados `PRV-02` e `PRV-03` da auditoria do passo 2
> da T-0004: as duas regras abaixo foram escritas dentro de `operacao-do-provedor.md`, que fechou em
> **414** linhas com elas — acima do teto de 400. Eixo da partição, e ele não é de conveniência: lá
> **quais papéis existem** (`RN-PRV-001` a `006`); no irmão do alcance, **o que eles alcançam e sob que
> autorização** (`RN-PRV-007` a `010`, `017`); **aqui, a trava** — o default da célula e o campo em que o
> ato nosso se sustenta (`RN-PRV-015`, `016`). Numeração contínua e imutável entre os três, sem
> hierarquia. **As perguntas e as lacunas dos três moram no irmão do alcance** (§3 e §4).
>
> **Por que uma trava precisa de arquivo, e não de uma frase em cada regra.** As duas existem pela mesma
> razão: **regra de escopo novo não herda a trava de outro escopo por citação.** `RN-NUC-026` e
> `RN-NUC-039` estão escritas sobre "as **duas** matrizes" e "os **cinco** papéis"; `RN-NUC-029` sobre
> "exatamente **uma de três**" fontes. Apontar para elas de um escopo que nenhuma delas nomeia importa a
> **citação**, não a trava. E escopo sem default fechado é escopo onde o não-dito é permitido, que é o
> inverso do que o resto deste projeto faz.
>
> **O que este arquivo não é.** Não é a matriz do escopo `provedor` (passo 7 da T-0004): nenhuma célula é
> valorada aqui, nenhuma operação é enumerada, e nenhum número entra. Não altera `RN-NUC-026`,
> `RN-NUC-029` nem `RN-NUC-039` — as frases que faltam nelas são de quem possui aquele conjunto, e estão
> nas `PERGUNTAS` da ficha T-0004.
>
> **Formato:** `Enunciado` · `Motivo` · `Aceite` · `Infeliz`. Escopo de **toda** regra: `provedor`.

---

## 1. A trava da célula

### RN-PRV-015 — No escopo `provedor`, operação sem célula é negada a todo papel nosso, e a célula é a autoridade única

**Enunciado** (a) operação **ausente** da matriz do escopo `provedor` é **negada aos três** papéis
nossos, e ausência de decisão nunca é liberação. (b) Sobre autorização de papel nosso, a **célula**
daquela matriz é a autoridade única: papel nomeado em prosa — em qualquer `RN-PRV`, inclusive nesta — é
**indicação de candidato**, nunca concessão, e só vale depois de existir como célula. (c) Célula negada
**porque ninguém decidiu** leva sinal próprio, com lacuna nomeada e dono, na forma de `RN-NUC-026`. (d)
Esta regra **não importa** `RN-NUC-026` nem `RN-NUC-039`: ela declara o default **do escopo `provedor`,
no próprio escopo**, e é ela que a implementação lê.

**Motivo** é `AUT-14` deslocado de arquivo, e o cenário é concreto. O passo 7 entrega a matriz com as
operações que alguém enumerou, e o console precisa de uma que ninguém enumerou: "redefinir a credencial
do `owner`", "reenviar convite", "**exportar o dado do cliente para diagnóstico**". Qual regra a nega?
`RN-NUC-026` fixa o default nos cinco papéis das duas matrizes, e nenhum papel novo é um dos cinco;
`RN-NUC-039` fixa a precedência célula × prosa nas mesmas duas. Sem esta regra, a primeira implementação
decide — com a tela na frente e o incidente aberto. O default fechado de `.claude/rules/seguranca.md` §2
é regra **nossa, de processo**: ela não sobrevive à leitura de quem lê só a spec, e a spec é o que vira
código.

**Aceite** as três operações do motivo, pedidas hoje → as três **negadas**, e a recusa cita a **ausência
de célula na matriz do `provedor`**, nunca a prosa desta regra nem a de `RN-PRV-003`. Enquanto a matriz
do passo 7 não existir, **toda** operação de papel nosso está nesse estado — e é isso que a regra diz,
não um defeito de leitura dela. Teste negativo, conferível por busca: nenhuma `RN-PRV` é implementável
pela prosa; cada uma que nomeia papel aponta para célula existente **ou** marca a lacuna.
**Nomeadamente:** exportação de diagnóstico é operação como qualquer outra — hoje nenhuma regra a
menciona, logo ela não existe, e o veículo de sair do escopo levando o dado inteiro num arquivo fica
fechado por default e não por vigilância.

**Infeliz** a matriz nasce no passo 7 e alguém precisa operar antes dela. Então **não opera**. Custo
declarado, e é caro de propósito: o console do passo 7 nasce **vazio** até a matriz ser valorada. Somado
à cláusula (b) de `RN-PRV-006` (papel não atribuível sem leitor de trilha) e à (d) de `RN-PRV-004`
(`D-03` aberta até 2026-09-23; desde então, a entrada do ato de resolução tem regra e ainda não tem
implementação), o escopo `provedor` hoje **não opera nada** — três travas independentes, todas falhando
fechado, todas com dono nomeado. É o desfecho, não a pendência.

---

## 2. A trava do registro

### RN-PRV-016 — Ato nosso registra em que se sustentou, e nunca se sustenta em autoridade do cliente

**Enunciado** todo ato e toda leitura de papel nosso registram, no campo de `RN-NUC-029` que diz **em que
o ato se sustentou**: o **papel de escopo `provedor`** que o autorizou, nomeado; o **cliente-alvo
resolvido** (`RN-PRV-004` b); e, quando a autoridade é a cláusula de contrato (`RN-PRV-010`) ou uma
concessão (`RN-NUC-024`), qual delas. **É vedado** sustentar ato nosso em **atribuição do cliente**, em
concessão que não seja a nossa, ou em sujeito sintético: nenhum ato nosso aparece na trilha do cliente
sustentado por autoridade **dele**. Enquanto o campo de `RN-NUC-029` não admitir essa fonte — hoje ele é
"exatamente **uma de três**", e nenhuma das três é papel nosso —, o registro é impossível, e **registro
impossível impede o ato** (`RN-NUC-029`, infeliz): falha fechado.

**Enunciado, cláusula acrescentada em 2026-08-23 (`PRV-11`) — de que sujeito esta trava fala.** A
obrigatoriedade acima é do **ato que acontece**. Ela **não** alcança o fato da **tentativa recusada**:
nele o registro carrega o **identificador pretendido**, marcado como pretendido, e o **cliente-alvo
resolvido** aparece **só quando existe** (`RN-PRV-011` e–g). Isso não é exceção à trava, é o alcance
dela: "registro impossível impede o ato" existe para impedir **ato**, e na recusa não há ato a impedir —
ele já foi negado. Exigir ali o campo impossível não fecha nada; troca recusa **registrada** por recusa
**silenciosa**, e é a terceira ocorrência da mesma forma (`AUT-15` → `PRV-03` → `PRV-11`), esta nascida
do conserto da anterior: **regra que cria campo obrigatório declara o que acontece no caso em que o
próprio mecanismo dela falha.**

**Motivo** hoje os dois desfechos possíveis são defeito, e o segundo é o pior. **Falha fechado:** sem
valor para o campo, o ato não acontece — e com ele não acontecem nem o fato de `RN-PRV-007` nem a trilha
de `RN-PRV-006`. **Falha aberto na trilha:** o construtor preenche o campo com o que existe — a
atribuição do usuário de A que está sendo editado — e a **nossa** mutação aparece na trilha de A
sustentada por uma atribuição **de A**; o cliente perde exatamente a única coisa que `RN-PRV-006` lhe
promete, que é distinguir o nosso ato do dele. É a forma de `AUT-15` uma rodada depois: fonte de
autoridade nova criada sem valor no registro. `AUT-15` fechou acrescentando a **terceira** fonte;
ninguém acrescentou a **quarta**. Esta regra fecha o lado que é de produto — proibir o valor errado e
declarar o desfecho — e **não** altera `RN-NUC-029`, que é do conjunto da matriz.

**Aceite** `provider_operator` edita o usuário do cliente A → o registro diz "papel `provider_operator`,
cliente A resolvido, autoridade: papel declarado" (ou a cláusula, ou a concessão nomeada), e **não** cita
atribuição nenhuma de A. Busca inversa, que é a que prova a regra: varrer a trilha de A por ato cujo
autor é pessoa nossa e cuja sustentação é atribuição de A → **zero**. E enquanto a quarta fonte não
existir em `RN-NUC-029`, praticar o ato → **negado por registro impossível**, com a recusa dizendo isso
e não "erro de campo". **Aceite da cláusula de 2026-08-23:** submeter ato nomeando cliente cujo
identificador **divergiu** do alvo resolvido → **negado**, **e** o fato da tentativa existe, com o
identificador pretendido marcado como tal; busca por tentativa recusada descartada por falta de
cliente-alvo resolvido → **zero**.

**Infeliz** o ato é urgente e o campo não tem valor possível → o ato **não acontece**, e o pedido de
correção da regra fica visível. Nunca se preenche o campo com "o que existe" para destravar: o produto
não oferece agir sem dizer com que autoridade, e é a mesma postura de `RN-NUC-011`, infeliz — não se
registra "sem autor".

---

## 3. O que estas duas travas deixam em aberto, e para quem

- **A frase que falta em `RN-NUC-026` e `RN-NUC-039`** (nomear a matriz do `provedor`: default negado e
  precedência da célula) e **a quarta fonte de `RN-NUC-029`** são do conjunto
  `matriz-operacao-papel*.md`. `RN-PRV-015` e `RN-PRV-016` foram escritas para **não depender** delas: o
  default do escopo vale por si, e a proibição do valor errado no registro vale por si. O que depende
  delas é os papéis nossos **operarem** — e é por isso que hoje eles não operam.
- **A matriz do escopo `provedor`** foi entregue em 2026-08-23 como **folha de valoração**, em
  `matriz-celulas-a-valorar.md` §1: 15 linhas candidatas (8 de leitura, 7 de ato; a `A7`, primeiro
  `owner`, entrou em 2026-09-23 com `RN-NUC-090`), por **espécie de objeto**, com **valor de célula em
  branco**. Valor de célula é do humano, e enquanto ele não existir o
  desfecho é o que `RN-PRV-015` diz — negado aos três. Valorada, ela **passa a ser** a matriz que esta
  regra cita.
- **`D-03`, terceiro eixo** (como o cliente-alvo é resolvido fora do pedido), fechada em 2026-09-23 pela
  opção C; a entrada do ato de resolução passou a ser a cláusula (d) de `RN-PRV-004`, com três origens.
  Ficam abertos, para `seguranca` (consulta pedida em `T-0015`) e para o humano:
  - **a fila é enumeração parcial da carteira.** Ela mostra à pessoa nossa os clientes com objeto aberto
    atribuído a ela, e o tamanho dela depende de quem atribui. Quem atribui objeto à fila não está
    decidido; sem atribuição, a fila é vazia e nada resolve, o que falha fechado;
  - **o limite de escopo de `IDN-05`** (um vigente por pessoa, conferido contra a pessoa autenticada) é
    desfecho que a regra fixa e requisito da implementação da Fase 2 (`backend`); hoje não há o que
    conferir, porque nenhum ato nosso acontece.

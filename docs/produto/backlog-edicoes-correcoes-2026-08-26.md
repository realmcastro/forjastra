# Correções às edições do backlog `SPR` — 2026-08-26

> **O que este arquivo é.** O texto que conserta `backlog-edicoes-a-aplicar.md` antes de ele ser aplicado.
> A conferência contra o board (`revisao-backlog-spr-conferencia-2026-08-26.md`) achou que **as seis
> substituições de descrição do Bloco A apagariam critério de aceite existente e ainda válido** — as seis,
> não algumas. Aqui está o acréscimo literal de cada uma.
>
> **Como usar.** Cada bloco em ` ``` ` entra na descrição nova; ele **não** substitui o que já está escrito
> nela, exceto onde a entrada diz "substituir". Aplique isto **junto** com a entrada correspondente do
> Bloco A, nunca depois — o card não deve existir nem por um minuto com a descrição incompleta.
>
> **Regra transversal para as seis.** Critério que sai por depender de `G-04` ou `G-05` **é declarado**,
> com a `G` nomeada. Critério que muda de casa **nomeia a issue de destino**. Critério que some sem nenhuma
> das duas é perda silenciosa — é o que a trava 3 de `.claude/rules/jira.md` existe para impedir.
>
> Issue de aplicação: `SPR-54`.

---

## 1. `SPR-13` — a substituição perde a razão de existir do card

O card não é sobre encerrar. É sobre **o que o consumo encerrado deixa de aceitar**:

> * Comandas encerradas não podem receber novos itens.
> * Comandas encerradas não podem ser enviadas novamente à cozinha.

A descrição nova fala de idempotência do fechamento, de consumo aberto que não se encerra sozinho, e de
cancelamento com motivo. Nenhum dos quatro aceites diz que consumo encerrado recusa lançamento — que é
literalmente o que o autor pediu.

E há uma inversão de escopo não declarada: o card diz *"O encerramento financeiro não faz parte do
SPR-1"*, e a descrição nova torna o card justamente sobre a escolha entre cobrança e cancelamento.
Corrigir a fronteira é certo; fazê-lo sem dizer que o escopo cresceu não é.

**Acrescentar ao `## Aceite`:**

```
5. Consumo encerrado — por cobrança ou por cancelamento — **recusa lançamento novo**, e a recusa
   nomeia o estado ("este consumo já foi encerrado"), nunca falha genérica. É o critério original
   deste card, e ele não muda com a correção de fronteira.
6. Consumo encerrado **não emite trabalho novo** para o ponto de produção. Isto não é `MSA`
   consultando preparo (`RN-MSA-012` continua valendo nos dois sentidos): é o consumo encerrado
   deixando de originar lançamento, e trabalho nasce de lançamento (`RN-COZ-001`,
   `docs/produto/modulos/cozinha.md:88`).
```

**Acrescentar depois de `## Enunciado`:**

```
## O que mudou de escopo, e por quê

O card pedia que `MSA` **reconhecesse** um encerramento vindo de fora, e punha o encerramento
financeiro fora de escopo. A fronteira aprovada inverte: encerrar é operação de `MSA`
(`RN-MSA-010`), e o que acontece no ponto de cobrança é o núcleo concluindo a venda. Então o escopo
**cresce** — passa a incluir o desfecho entre cobrança e cancelamento. A necessidade original
(consumo encerrado não aceita mais nada) fica, e é o aceite 5.
```

---

## 2. `SPR-18` — a recusa argumenta contra um card mais fraco que o escrito

O último critério do corpo é:

> * Produtos sem variações ou adicionais devem utilizar o mesmo fluxo, **apresentando apenas os campos
>   aplicáveis**.

O autor pensou no item sem escolha. A parte 2 da recusa (§5.1 da revisão) diz que o mecanismo *"cobra o
custo da exceção em 100% dos lançamentos, inclusive nos itens que não têm escolha nenhuma"* — verdade
quanto à **etapa**, que o card impõe a todos, e injusta quanto aos **campos**, que o card já condiciona.
`00-nucleo.md` §12 exige nomear o mecanismo recusado como ele é; recusar uma versão pior dele enfraquece
a recusa inteira.

Urgência extra: o título de `SPR-18` **já foi trocado no board** e afirma a regra condicional, enquanto a
descrição ainda afirma o mecanismo recusado. O card carrega duas regras opostas hoje.

**Substituir a seção `## Mecanismo recusado, e por que ele é ruim` por:**

```
## Mecanismo recusado, e por que ele é ruim

"**Todo** item passa por uma etapa de configuração antes de ser adicionado." O card já condiciona os
**campos** — item sem variação e sem adicional mostra só o que se aplica — e essa parte está certa. O
que se recusa é a **etapa**, que ele impõe aos 100%: mesmo mostrando zero campo, ela é um passo a mais
entre a leitura do código e o item na tela.

O custo aparece no único caminho que não aceita regressão, o caixa com fila, e quebra o fluxo
completável por **leitor de código de barras sem tocar a tela**, que é requisito de operação
(`.claude/rules/ui.md` §3). Uma etapa vazia continua sendo uma etapa: ela custa um toque, e o
orçamento de "adicionar item na venda" é 150 ms percebidos.
```

**Acrescentar ao fim:**

```
## Critério que muda de casa

Três critérios do enunciado original não somem — mudam de dono, e cada um tem destino:

- campo de observação no lançamento → `SPR-22`, que absorve `SPR-21`;
- confirmar a inclusão do item no consumo → `SPR-22`;
- valor atualizado apresentado → `SPR-28` (valor do item) e `SPR-29` (acumulado do consumo).

E dois ficam atrás de `G`: apresentar variações (`G-04`) e apresentar adicionais permitidos (`G-05`).
```

---

## 3. `SPR-22` — a substituição perde imediatez e perde o acumulado

Critérios apagados sem declaração:

> * O item deve passar a fazer parte da comanda **imediatamente** após sua inclusão.
> * O valor da comanda deve ser atualizado.

O primeiro é operacional e não trivial: num produto que enfileira offline, "imediatamente" é a diferença
entre o garçom ver o lançamento e o garçom lançar duas vezes achando que falhou. O segundo é de `SPR-29`,
mas precisa dizer isso.

**Acrescentar ao `## Aceite`:**

```
5. O lançamento aparece no consumo **imediatamente**, sem esperar confirmação do servidor — inclusive
   com o link caído. O que ainda não sincronizou é visível como pendência no próprio terminal, com a
   contagem, sem interpretação técnica (`RN-MSA-011`, `docs/produto/modulos/mesa-comanda.md:224`).
   Critério original deste card, e ele é o que impede o lançamento em duplicidade por dúvida.
```

**Acrescentar ao fim de `## Nota de fusão`:**

```
Dois critérios do enunciado original mudam de casa e não somem: **variação e adicionais na linha**
ficam atrás de `G-04` e `G-05`; **atualizar o valor do consumo** é `SPR-29`, que compõe o acumulado.
```

---

## 4. `SPR-23` — a substituição recusa o mecanismo e não repõe a necessidade

O card diz: *"Itens com **qualquer** diferença devem permanecer separados."* A descrição nova, no aceite
4, decide o contrário para observação:

> Dois lançamentos do mesmo item com observações diferentes → a diferença de texto **não** decide
> agregação nem separação, porque o texto não é chave de decisão.

`RN-NUC-016` está certa e a recusa do mecanismo está certa: texto livre não é chave de decisão. Mas o
resultado escrito é uma linha agregada **"2× X-Burger"** cobrindo um "sem cebola" e um "com bacon" — e o
atendente confere errado na frente do cliente-final, que é exatamente a dor que a §5.2 da revisão nomeia
como necessidade preservada.

Recusar o mecanismo sem repor a necessidade é o defeito que `00-nucleo.md` §12 chama de recusar
capacidade. A saída não exige decidir nada novo: **a observação não decide a chave, e continua visível na
linha agregada.** Agregar não é esconder.

**Substituir o aceite 4 por:**

```
4. Dois lançamentos do mesmo item com observações diferentes → o texto **não** decide agregação nem
   separação (`RN-NUC-016`), **e** as duas observações continuam legíveis na linha agregada,
   atribuídas a cada lançamento. Agregar quantidade nunca esconde instrução de atendimento: o
   critério original deste card — "qualquer diferença permanece distinguível" — fica, e o que muda é
   que a distinção é de **apresentação**, não de identidade de fato.
```

**Acrescentar ao `## Aceite`:**

```
6. A linha agregada mostra a composição na forma do exemplo original do card: dois lançamentos de
   "X-Burger + Bacon" leem como **"2× X-Burger + Bacon"**, e não como "2× X-Burger".
```

---

## 5. `SPR-25` — a fusão de `SPR-24` deixa cair a quantidade inválida

`SPR-24` tem um critério que a descrição nova de `SPR-25` não cobre em lugar nenhum:

> * Não deve ser possível utilizar quantidade inválida.

O comentário de fusão **já publicado** em `SPR-24` (2026-08-26 12:43:19) trata redução, aumento e trilha, e
não trata este. Ele é o único critério de `SPR-24` que não é retirada nem lançamento aditivo — e some se
ninguém o mover.

**Acrescentar ao `## Aceite` de `SPR-25`:**

```
7. Quantidade inválida é **recusada na borda**, nos dois sentidos: retirada maior que a quantidade
   lançada, e quantidade fora da escala declarada da unidade de medida do item (`RN-NUC-013`, a
   linha de unidade com casas declaradas). A recusa nomeia o limite. Critério original de `SPR-24`,
   e é o único dele que não é retirada nem lançamento aditivo.
```

**Correção de referência.** A nota do card manda para o **"Epic 3"**, não para `SPR-30` — e o Epic 3
("Personalização de Produtos") **nunca foi criado**. Ver §5.2 da conferência. A `## Notas de fronteira`
da descrição nova precisa dizer isso em vez de tratar a dependência como se ela sempre tivesse apontado
para `SPR-30`:

```
- A nota original deste card delegava "regras de edição de item já enviado" ao **Epic 3**
  ("Personalização de Produtos"), planejado em 2026-08-23 e **nunca criado no board**. A delegação
  era proposital e continua válida na intenção: o destino real é `SPR-30`, correção por lançamento
  novo. Nada se perdeu; o endereço estava vazio.
```

---

## 6. `SPR-29` — a substituição não tem nenhum aceite para a necessidade do card

A pior das seis. O card pede o acumulado **vivo**:

> * O total deve considerar todos os itens da comanda.
> * Alterações de quantidade devem atualizar o total.
> * Adição ou remoção de itens deve atualizar o total.
> * Alteração de adicionais deve atualizar o total.
> * Itens com adicionais de R$ 0,00 não devem gerar acréscimo.

Os quatro aceites da descrição nova tratam de **procedência** — quem compõe, de que artefato, o que não
aparece em consulta de vendas. Todos corretos e todos sobre outra pergunta. Nenhum diz que o acumulado
reflete o que acabou de acontecer no consumo, que é a única coisa que o garçom vai olhar.

**Acrescentar ao `## Aceite`:**

```
5. Lançar item, retirar item, e alterar quantidade → o acumulado exibido reflete cada um dos três
   **na volta da operação**, sem recarga manual e sem esperar sincronização. É o critério original
   deste card, e a correção de fronteira não o revoga: o núcleo compõe, `MSA` expõe, e expor inclui
   expor atualizado.
6. Consumo com 20 lançamentos → o acumulado é **uma** composição, não uma consulta por linha. Custo
   de tela quente é gate de desempenho (`.claude/rules/performance.md` §2), e o pico do consumo é
   quando ele é lido.
```

**Acrescentar à `## Pendência declarada, não decidida`:**

```
Um critério original fica atrás de `G-05`: "item com adicional de R$ 0,00 não gera acréscimo". Ele é
concreto e vale preservar como pergunta — adicional de valor zero existe (é o "sem cebola" que tem
dono no catálogo em vez de virar texto livre), e o que ele faz ao acumulado depende de adicional ter
escopo, que hoje não tem.
```

---

## 7. `SPR-46` — a entrada inteira do Bloco A é substituída

A entrada atual abre com *"Dependência a declarar"*. O corpo do card mostra que não é declarar: é
**retratar**. Substituir a entrada inteira por:

```
**O card já respondeu `LACUNA-GLO-001`, e a resposta está no critério de aceite.**

O escopo diz "**o fuso é do cliente**, e vem de dado", e o aceite fixa: "mesmo instante formatado para
dois **clientes** de fusos diferentes". Essa é uma das duas respostas possíveis de uma pergunta que
está aberta e é do humano (`docs/produto/glossario.md:395`): quando um cliente (tenant) tem
estabelecimentos em fusos diferentes, quem decide vigência, "hoje", turno e fechamento — o
estabelecimento ou o cliente? Os dois estão declarados hoje, em arquivos diferentes.

Escolha em critério de aceite é mais difícil de reverter que omissão: ela vira o teste que prova que o
código está certo, e ninguém revisa o que passa.

**O que este card pode afirmar sem a decisão:** o formatador **formata** e nunca decide qual fuso vale.
O fuso é artefato publicado — configuração do estabelecimento usada na composição, linha **não
delegável** da tabela de `RN-NUC-013` (`docs/produto/nucleo-publicacao-e-texto.md:49`) — e o fato
congela os valores vigentes com o fuso declarado.

**Aceite que substitui o atual:** o formatador recebe o fuso **declarado no fato ou no artefato
publicado**; a ausência dele é **erro, não default**; e nenhum caminho do formatador escolhe fuso, nem
pelo dispositivo, nem pelo servidor, nem por configuração global. Escrito assim, o card fecha com
`LACUNA-GLO-001` ainda aberta e não muda quando ela fechar.
```

---

## 8. `SPR-27` — a entrada precisa abrir retratando o comentário anterior

`SPR-27` carrega um comentário de 2026-08-26 11:54:09 que afirma *"disponibilidade é do núcleo (todo ramo
tem produto que acaba)"* — o oposto de `G-07`. Comentário é append-only, então a entrada nova precisa
retratar explicitamente, como os comentários de `SPR-28` e `SPR-32` fizeram. Sem isso o card fica com duas
fronteiras opostas afirmadas com a mesma autoridade, e quem chegar depois escolhe a que leu primeiro.

**Acrescentar ao início da entrada de `SPR-27`, antes de tudo:**

```
**Retratação do comentário de arquitetura anterior neste card.** Ele afirma "disponibilidade é do
núcleo (todo ramo tem produto que acaba)". A fronteira aprovada não sustenta isso: disponibilidade com
dono é `EST` (`docs/produto/catalogo-de-modulos.md:93`), fora do MVP 1
(`docs/produto/roadmap-de-modulos.md:184`), e com `EST` desligado "a venda não consulta
disponibilidade" (`:96`). No núcleo, indisponível é **ausência do artefato publicado**
(`RN-NUC-002`), não item visível e marcado. Se existe marca de disponibilidade no caminho de venda é
`G-07` — pergunta ao humano, não decidida aqui, e não decidida por aquele comentário.
```

---

## 9. `SPR-1` — retratação da afirmação falsa já publicada

O comentário postado em `SPR-1` às 12:37:27 diz que `service_mode` não tem regra numerada. **Tem.**
Comentário é append-only: retrata-se com comentário novo.

**Postar em `SPR-1`:**

```
**Correção do comentário anterior deste card — o resíduo 2 estava errado.**

Eu escrevi que `service_mode` é piso do documento fiscal e "não tem regra numerada". Falso.
`RN-NUC-048` existe e o governa (`docs/produto/fatos-de-operacao-dominios-fechados.md:124`): domínio
fechado do núcleo, ausência não é valor — a venda não conclui sem modo —, cada fato carrega o modo
vigente no instante dele, e valor novo só entra por alteração daquela regra, com o teste dos três
negócios. `docs/produto/glossario.md:396` registra que `LACUNA-GLO-002` foi **FECHADA em 2026-08-23**
exatamente por causa disso.

De onde veio o erro: `docs/produto/roadmap-de-modulos.md:155` e `:171` ainda listam `service_mode`
como sem regra. As duas linhas estão velhas, e eu as citei sem conferir a substância. O arquivo será
corrigido.

**O que sobra do resíduo, e continua verificado:** apenas **turno** (`LACUNA-NUC-007`) — aberta,
resposta do humano "não sei ainda", abrir e fechar turno recusado por default
(`docs/produto/roadmap-de-modulos.md:172`, `:387`, `:420`).
```

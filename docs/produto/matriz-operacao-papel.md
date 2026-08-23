# Matriz operação × papel — o núcleo

> **O que este arquivo é.** O cruzamento de **cada operação do núcleo** com os **cinco papéis** de
> `RN-NUC-019`, com quatro valores por célula e uma coluna obrigatória: **a decisão de autorização quando
> o terminal está sem contato**. É o que torna o modelo de papéis verificável operação por operação.
>
> **Três arquivos, um conjunto normativo**, partido em dois eixos. **Núcleo × módulo e vertical** (o eixo
> dos invariantes 2 e 3): aqui a matriz do núcleo e as regras que ela obrigou a escrever (`RN-NUC-030` a
> `RN-NUC-032`); em `matriz-operacao-papel-modulos.md`, `RN-NUC-033`, a matriz de `MSA`, `COZ`, `PCF`,
> `ATI`, `FIS`, `EMI` e da vertical, o eixo de leitura e a contagem consolidada. **Contrato da célula ×
> as células** (partição de 2026-08-23, quando este arquivo chegou a 400 linhas): em
> **`matriz-operacao-papel-contrato.md`** vive como se lê uma célula (`RN-NUC-026`), a decisão offline
> (`RN-NUC-027`), a contenção (`RN-NUC-028`), o registro (`RN-NUC-029`), a **precedência da célula sobre
> prosa** (`RN-NUC-039`) e **o que se delega** (`RN-NUC-040`). As seções §1, §2 e §3 saíram para lá e os
> números **não foram reaproveitados** aqui, para não invalidar citação já feita; §4 a §9 continuam onde
> estavam. Numeração contínua e imutável entre os três (`glossario.md` §4.2); toda regra é heading
> `### RN-NUC-nnn`, pelo contrato de busca de `nucleo-venda.md`.
>
> **Numeração.** O passo 2 consumiu até `RN-NUC-025`; este conjunto consome **`026` a `033`** mais
> **`039` e `040`** (no irmão de contrato), e nada foi renumerado. `LACUNA-NUC-001` a `008` estão em
> `nucleo-venda.md` §6, `009` a `014` em `papeis-e-permissoes.md` §6, `015`, `016` e `035` nascem aqui
> (§9), `017` a `028` em `matriz-operacao-papel-modulos.md`, `029` a `033` em `superficie-por-papel.md`,
> `034` em `papeis-e-permissoes.md`.
>
> **O que não é.** Não é o modelo de papéis, e não o reescreve. Não é a lei de convergência: o
> **desfecho do fato** offline é de `operacao-offline-e-sincronizacao.md` §4 e não se repete aqui —
> esta matriz decide **autorização**. Não é superfície, tela, relatório, tabela, coluna, endpoint,
> componente nem stack.
>
> **Fronteira de D-03, ABERTA.** Declarar *quem pode o quê* e *o que acontece sem contato* é daqui.
> **Como** se prova identidade, onde ela mora, sessão, token, reautenticação e SSO **não são**, e
> nenhuma célula depende de saber. **Nenhum número:** validade, teto, limite e prazo são lacuna com
> dono.

---

## 1-3. Movidas para `matriz-operacao-papel-contrato.md` em 2026-08-23

O vocabulário da célula (`RN-NUC-026`), a decisão de autorização offline (`RN-NUC-027`), a contenção
(`RN-NUC-028`) e o registro de auditoria (`RN-NUC-029`) vivem no irmão de contrato, junto das duas
regras que a auditoria de 2026-08-23 obrigou a escrever (`RN-NUC-039`, `RN-NUC-040`). **Nada foi
alterado no conteúdo pela mudança de arquivo**, e nenhuma célula desta matriz mudou de valor por causa
dela. Quem lê uma célula pela primeira vez lê aquele arquivo uma vez; quem consulta uma operação lê a
tabela abaixo.

## 4. A matriz do núcleo

`Offline` é a **decisão de autorização** (`RN-NUC-027`), em um de quatro valores. `retida` vale para
`cashier`, `manager` e `fiscal_officer` — os três que portam autoridade retida; `terminal+ident` vale
para os **quatro** papéis de cliente, porque não depende de autoridade de pessoa (nota ¹⁴); para
`provider_support` é **sempre recusa**, em toda linha. A coluna não concede a quem a célula do papel
nega. `?` é negado por ausência de decisão.

| # | Operação | Regida por | `cashier` | `manager` | `owner` | `fiscal_officer` | `provider_support` | Offline |
|---|---|---|---|---|---|---|---|---|
| 1 | Abrir, alterar e descartar pedido em construção | `RN-NUC-001` | P | P | P | N | N | terminal+ident ¹⁴ |
| 2 | Lançar item no pedido | `RN-NUC-002` | P | P | P | N | N | terminal+ident ¹⁴ |
| 3 | Concluir a venda | `RN-NUC-003` | P | P | P | N | N | terminal+ident ¹⁴ |
| 4 | Registrar pagamento em espécie | `RN-NUC-004` | P | P | P | N | N | terminal+ident ¹⁴ |
| 5 | Registrar pagamento que exige terceiro | `RN-NUC-005` | P | P | P | N | N | **recusa** |
| 6 | Aplicar desconto ou acréscimo **até** o limite do próprio papel | `RN-NUC-006` | R | R | R | N | N | terminal+ident ¹⁴ ¹⁵ |
| 7 | Aplicar desconto ou acréscimo **acima** do limite do próprio papel | `RN-NUC-007` | A:`manager`+R | A:`owner`+R | N ¹ | N | N | **recusa** |
| 8 | Autorizar o excesso pedido por outro operador | `RN-NUC-007`, `RN-NUC-022` | N | R | R | N | N | **recusa** |
| 9 | Cancelar venda concluída, devolver, estornar | `RN-NUC-008` | A:`manager`+R | R | R | N | N | **recusa** |
| 10 | Abrir sessão de caixa para si | `RN-NUC-009` | R | R | R | N | N | terminal+ident ¹⁴ |
| 11 | Abrir sessão de caixa **em nome de outro operador** | `RN-NUC-037` + `LACUNA-NUC-016` ¹¹ | N | **?** | **?** | N | N | recusa |
| 12 | Fechar a **própria** sessão de caixa | `RN-NUC-010`, `RN-NUC-030` | R | R | R | N | N | terminal+ident ¹⁴ |
| 13 | Fechar sessão de **outro** operador | `RN-NUC-030` | N | R | R | N | N | retida |
| 14 | Registrar sangria e suprimento | `RN-NUC-011` | N | R | R | N | N | retida |
| 15 | Abrir gaveta como consequência da venda em espécie | `RN-NUC-012` (a) | P | P | P | N | N | terminal+ident ¹⁴ |
| 16 | Abrir gaveta **fora** de venda | `RN-NUC-012` (b) | N | R | R | N | N | retida |
| 17 | Apresentar de novo, ou reimprimir, via de venda ou documento **existente** | `RN-NUC-032` | R | R | R | N | N | retida |
| 18 | Publicar **catálogo e preço** | `RN-NUC-013`, `RN-NUC-014` ¹² | N | N | R | N | N | **recusa** |
| 19 | Publicar **o que cada papel autoriza** | `RN-NUC-023` (a) ¹³ | N | N | R | N | N | **recusa** |
| 20 | Criar, alterar e revogar **atribuição** | `RN-NUC-020`, `RN-NUC-023` (b) | N | N | R | N | N | **recusa** |
| 21 | Conceder e revogar **delegação** de subconjunto próprio | `RN-NUC-021` ² | N | R | R | N | N | **recusa** |
| 22 | Declarar `queue_owner` e `establishment_responsible` | `RN-NUC-020`, `RN-NUC-023` (c) | N | N | R | N | N | **recusa** |
| 23 | Criar estabelecimento | `RN-NUC-019` | N | N | R | N | N | **recusa** |
| 24 | Habilitar e desabilitar **módulo** para o cliente | `catalogo-de-modulos.md` + `LACUNA-NUC-023` | N | N ³ | **?** | N | N ⁴ | recusa |
| 25 | Conceder e revogar `provider_support` | `RN-NUC-024`, `LACUNA-NUC-009`, `LACUNA-NUC-011` | N | N | **?** | N | N ⁵ | recusa |
| 26 | Operar sob concessão de `provider_support` | `RN-NUC-024` | N | N | N | N | R | **recusa** |
| 27 | Ver estado de conexão e contagem de pendências no terminal | `RN-OFF-018` | P | P | P | N | N | terminal+ident ¹⁴ |
| 28 | Ver a superfície da fila de pendências e da lista de trabalho | `RN-OFF-011`, `RN-OFF-012` | N ⁶ | P | P | **?** ⁷ | N | retida |
| 29 | Resolver item da lista de trabalho | `RN-OFF-012` | N | R | R | N | N | **recusa** |
| 30 | Transferir fila; reinstalar ou descomissionar terminal com fila | `RN-OFF-016`, `RN-OFF-026` | N | R | R | N | N ⁸ | retida |
| 31 | Encerrar faixa pré-alocada não usada | `RN-OFF-006`, infeliz (c) | N | R | R | N | N | retida |
| 32 | Consumir exceção pré-autorizada de teto offline | `RN-OFF-025` ⁹ | R | R | R | N | N | retida |
| 33 | Destravar o teto de operação offline (decisão online) | `RN-OFF-014`, `RN-OFF-025` (a) | N | R | R | N | N | **recusa** |
| 34 | Registrar furto, perda ou destruição de terminal | `RN-OFF-016`, `RN-EMI-038` | N | R | R | R | N | retida |
| 35 | Fechar o dia do estabelecimento | `RN-NUC-031` | N | R | R | N | N | retida ¹⁰ |
| 36 | Publicar **limite de desconto e de acréscimo por papel** | `RN-NUC-013`, `RN-NUC-023` (a) ¹³ | N | N | R | N | N | **recusa** |
| 37 | Publicar **meio de pagamento habilitado e a marca "exige autorização de terceiro"** | `RN-NUC-013`, `RN-NUC-005` + `LACUNA-NUC-035` ¹³ | N | N | R | N | N | **recusa** |
| 38 | Publicar **configuração do estabelecimento** usada na composição (moeda, fuso, precisão) | `RN-NUC-013`, `RN-NUC-014` ¹³ | N | N | R | N | N | **recusa** |
| 39 | Publicar **exceção nomeada pré-autorizada** de teto offline | `RN-OFF-025`, `RN-NUC-013` ¹³ | N | N | R | N | N | **recusa** |

¹ acima do limite publicado do `owner` **não há papel acima**, e `RN-NUC-023` proíbe que ele amplie o
próprio limite: negado sem caminho. É `LACUNA-NUC-015`, do humano.
² divergência tratada em §7: `RN-NUC-023` (b) põe delegação em `owner`, o aceite de `RN-NUC-021` a põe
no delegante. Esta matriz adota o delegante, com o motivo declarado.
³ negado **por decisão**: módulo ativo é registro de escopo cliente, e `manager` é de escopo
estabelecimento (`RN-NUC-018`).
⁴ negado pelo default fechado de `RN-NUC-024` (a): nenhuma concessão nomeia isso hoje. Se o ato for
nosso, é da operação de plataforma, que não tem papel declarado (`LACUNA-NUC-011`).
⁵ `provider_support` **nunca** se autoconcede (`RN-NUC-024`, infeliz).
⁶ negado **por decisão**, e é explícito: "o operador de caixa **não** é esse papel" (`RN-OFF-011`).
⁷ o prazo do pendente fiscal é de horas (`RN-EMI-028`) e nenhum artefato diz se o responsável fiscal
alcança essa superfície — `LACUNA-NUC-028`.
⁸ a fila contém o que comprova recebimento de pagamento (`RN-OFF-023`, item 3), e `RN-NUC-024` (e)
proíbe dado de pagamento em qualquer concessão.
⁹ a existência da exceção é `LACUNA-OFF-004`; sem ela publicada, a linha é negada por ausência de
artefato, não por papel.
¹⁰ a **autorização** é concedida por autoridade retida válida; a **operação** ainda recusa quando a
lista de bloqueio de `RN-NUC-031` não está vazia, e em **D2** recusa sempre, porque a lista não é
computável a partir de um terminal isolado.
¹¹ a operação passou a ter **regra dona própria** em 2026-08-23 — `RN-NUC-037`, com dois sujeitos
(assumida por / aberta por) — que é o **lugar onde esta célula é verificada**; o **valor** da célula
continua do humano (`LACUNA-NUC-016`). Antes disso a distinção entre as linhas 10 e 11 existia só nesta
matriz, e `RN-NUC-009` podia ser satisfeita integralmente sem nunca chegar aqui (`AUT-07`).
¹² **delegável** (`RN-NUC-040` a): é o pacote de retaguarda que `papeis-e-permissoes.md` §4.3 nomeia
como delegação legítima. Depois de `AUT-13` ela é a **única** linha de publicação delegável.
¹³ **não delegável** (`RN-NUC-040` b): publica a **trava**, não o que o negócio vende — a trava da
**autoridade** (19, 36, 37, 39) ou a da **aritmética e da fronteira do dia** (38: moeda, precisão,
arredondamento e fuso decidem quanto se paga em cada venda e a que dia o fato pertence). A linha 18
carregava as quatro primeiras num único ato delegável até 2026-08-23 (`AUT-02`), e foi partida em 18,
36, 37, 38 e 39 por isso — nenhum valor de célula mudou na partição, e as cinco herdaram as células e a
coluna offline da linha original. A **38** trocou de rótulo em 2026-08-23 (`AUT-13`): estava marcada
delegável e reprovava o critério da própria `RN-NUC-040` b. Rótulo de delegabilidade **não é** valor de
célula: as células da 38 continuam como estavam.
¹⁴ **`terminal+ident`** (`RN-NUC-027`, cláusula 3): a autorização sem contato se sustenta na
**habilitação do terminal a vender** mais a **identificação** do operador, nunca na autoridade retida
de pessoa (`RN-OFF-032`, `RN-OFF-033`). Estas **nove** linhas — 1, 2, 3, 4, 6, 10, 12, 15, 27 — são o
**conjunto fechado** do ato ordinário, e é esta coluna que o define: `RN-OFF-032` aponta para ela.
Consequências: vencida a validade da autoridade retida, **nenhuma** destas nove recusa; quem porta
**apenas** `owner` pratica todas as nove sem contato e sem atribuição nenhuma; e `provider_support`
continua em recusa, aqui como em toda linha. **Entraram em 2026-08-23, por `AUT-14`:** as nove diziam
`retida`, e como a célula vence a prosa (`RN-NUC-039`), `RN-OFF-032` estava inerte exatamente nas
operações que ela existe para liberar. Nenhuma célula de **papel** mudou de valor: o que mudou é o
vocabulário desta coluna e o valor que estas nove carregam nela.
¹⁵ o **teto** aplicado sem contato quando não há autoridade retida válida é o do **papel-piso**,
publicado (`RN-OFF-020`) — nunca o de um papel que só a autoridade retida provaria (`RN-OFF-032`,
cláusula do teto). Acima dele a operação é a linha 7, que é **recusa** offline.

**O que não é linha, de propósito.** `RN-NUC-016` (texto com origem declarada) é atributo de outras
operações, não operação — como a §4 do contrato de offline já declara. Delegação concedida não é linha
nem coluna (`RN-NUC-021`): é subconjunto de linha existente, com prazo — e a **unidade** desse
subconjunto é a **linha**, com quatro linhas fora do alcance dela (`RN-NUC-040`). `queue_owner` e
`establishment_responsible` são **atribuição**, não papel (`papeis-e-permissoes.md` §4.2) — aparecem
como **objeto** da linha 22, nunca como coluna. Autenticar e reautenticar são **D-03**.

---

## 5. As três regras que a matriz obrigou a escrever

### RN-NUC-030 — Fechar sessão de caixa alheia é operação distinta de fechar a própria, e as duas registram de quem era a sessão
**Enunciado** fechar a **própria** sessão de caixa é do operador que a abriu, com registro
(`RN-NUC-029`). Fechar sessão **de outro operador** é operação distinta, do papel gerencial (`manager`
ou acima), com registro que nomeia **quem fechou** e **de quem era a sessão**. Nenhuma das duas edita o
fechamento depois: diferença encontrada depois é fato novo (`RN-NUC-010`, `PN-07`).
**O que quem fecha a sessão alheia vê, enumerado** (acrescentado em 2026-08-23 por `AUT-05`): **de quem
era a sessão**, o **posto**, o **instante de abertura**, o **esperado** composto do que o terminal
retém, o **contado** que ele informa e a **diferença**. São seis campos e nada além — é **leitura
derivada** no sentido estrito de `RN-NUC-035`: alcança **uma** sessão, a da operação em curso, é
registrada (`RN-NUC-029`) e **não** é caminho para a trilha da sessão, para outra sessão, para lista nem
para filtro. O que aconteceu **dentro** da sessão (gaveta fora de venda, sangria, exceção autorizada)
**não** entra por aqui: é a linha 1 do eixo de leitura, célula `?`, `LACUNA-NUC-017` — e continua sendo
a decisão sem suporte que `superficie-por-papel.md` §5 declara.
**Motivo** `RN-NUC-010` declarou a precondição como "o próprio operador da sessão ou papel acima — o
**quem** é do passo 3", e é este. São **duas** operações porque o caso real é o operador que vai embora
sem fechar: exigir a presença dele deixa o dinheiro contado sem registro, e deixar qualquer um fechar a
sessão de qualquer um apaga a responsabilidade pelo fundo, que é a razão de a sessão existir
(`RN-NUC-004`, motivo).
**Aceite** operador A abre sessão e sai sem fechar; `manager` fecha informando o contado → o fechamento
existe como fato, com os dois nomes e a diferença, e A não é apagado do registro. `cashier` B tenta
fechar a sessão de A → negado, com o caminho (`RN-NUC-022`), e a tentativa fica na trilha. **Pelo lado
negativo, e é o aceite que `AUT-05` pedia:** na mesma operação, o `manager` não alcança um sétimo campo
— nem a trilha da sessão, nem a de outra sessão, nem a lista das sessões do posto —, e cada leitura dos
seis campos aparece na trilha com o ato de fechamento a que pertence.
**Infeliz** o operador da sessão está presente e **discorda** da contagem → não é negociação: a
contagem informada e a divergência viram fato, com os dois autores à vista (`RN-NUC-010`). O produto
não oferece "fechar sem contar" nem "fechar depois".
**Offline** as duas se separam aqui. Fechar a **própria** sessão é ato ordinário (linha 12,
`terminal+ident`): acontece sem contato mesmo sem autoridade retida válida, e quem porta apenas `owner`
a fecha. Fechar a sessão **de outro** é concedida por autoridade retida válida (linha 13, `retida`) —
vencida a validade, recusa até reconectar, e `owner` sem outra atribuição não a pratica sem contato
(`RN-NUC-027`, cláusulas 2 e 4). **Corrigido em 2026-08-23** (`AUT-14`): esta linha dizia "autoridade
retida nos dois casos", o que virou falso para a própria sessão.

### RN-NUC-031 — Fechar o dia do estabelecimento acontece sem contato quando o que falta é informativo, e recusa quando há dinheiro ou documento fiscal com desfecho desconhecido
**Enunciado** o fechamento do dia do estabelecimento **opera sem contato**, com registro, quando tudo o
que está pendente é **informativo**; e **recusa** quando existe pelo menos um item da lista de bloqueio
abaixo. O critério que separa os dois é **um**: bloqueia o que tem **desfecho desconhecido** em dinheiro
ou em documento fiscal; não bloqueia o que tem desfecho **conhecido e declarado**, ainda que
desfavorável.

**Bloqueia — lista declarada e fechada** (item novo entra por alteração desta regra):
1. **sessão de caixa aberta** em qualquer posto do estabelecimento (`RN-NUC-009`);
2. sessão fechada cujo **esperado está declarado parcial** (`RN-NUC-010`, infeliz (a)) — o dinheiro do
   dia não é afirmável;
3. **movimento de caixa** registrado com autoridade retida ainda **não revalidada** na reconexão
   (`RN-NUC-011`, offline);
4. **documento fiscal em estado não final**: pendente de transmissão, transmitido sem retorno, pendente
   de inutilização, pendente de cancelamento, ou ponto de emissão em contingência não drenada
   (`RN-EMI-018`, `RN-EMI-024`, `RN-EMI-028`, `RN-EMI-029`);
5. **venda concluída sem documento** por faixa esgotada, enquanto o desfecho não está declarado
   (`RN-OFF-006`, infeliz (a));
6. item na **lista de trabalho** cujo efeito em dinheiro ou em documento ainda **não** está declarado
   (`RN-OFF-012`).

**Não bloqueia** — é informativo, e entra no fechamento **declarado**, nunca omitido: divergência de
relógio registrada que não cruza a fronteira do dia (`RN-OFF-019`); divergência de publicação já
nomeada com efeito declarado (`RN-NUC-015`); fato aditivo pendente de confirmação cujo documento já
está em estado final (`RN-OFF-004`); diferença de caixa já registrada como fato (`RN-NUC-010`).

**Motivo** é a resposta do humano em 2026-08-22, e resolve a contradição que sobrou entre `PN-01` e o
default de `RN-OFF-008` sem abrir a porta que importa. Recusar sempre é o que existia: para uma padaria
sem pendência alguma, significa não fechar o dia porque o link caiu — trabalho perdido sem ganho de
segurança. Fechar sempre é pior: número de dia com dinheiro de desfecho desconhecido dentro é número
falso, e ele vai para o contador. A lista existe porque "depende do que está pendente" sem enumeração é
interpretado por gosto, e cada terminal interpreta diferente.
**Aceite** estabelecimento em **D1**, todas as sessões fechadas com esperado completo e nenhum documento
em estado não final → o fechamento acontece, com registro e com as pendências informativas declaradas
item por item. O mesmo estabelecimento com **uma** sessão aberta, ou com um documento transmitido sem
retorno → recusado, nomeando **qual** item bloqueia e o caminho mais curto de cada um. Em **D2**,
recusado sempre, dizendo que a lista não é computável a partir de um terminal isolado. Nos dois casos, a
venda do dia seguinte **não** é bloqueada pelo fechamento que não ocorreu (`PN-01`).
**Infeliz** o fechamento não ocorre e quem confere precisa dele. Não existe fechamento **parcial** do
dia: fechar com dinheiro de desfecho desconhecido produz número que ninguém pode usar, o que é pior que
não ter número. O produto nomeia cada bloqueio e o caminho de cada um, e mantém o dia **aberto e
visível** — nunca fechado por decurso de prazo, nunca pelo relógio (`RN-OFF-009`).
**Offline** decisão de autorização **concedida por autoridade retida válida**; classe **1 no fato** (o
fechamento é aditivo e imutável) e **2 na precondição** (a lista depende de estado confirmado pelos
outros postos), o que é exatamente o que faz **D2** recusar. Opera em **D1** e em **D3** quando a lista
está vazia; recusa em **D2** sempre.

**O que esta regra não fecha.** `LACUNA-NUC-007` tem **duas** metades: o fechamento do dia, que esta
regra classifica, e **abertura e fechamento de turno**, que continua sem regra — o humano respondeu "não
sei ainda" sobre turno ser ou não a sessão de caixa. Nada aqui inventa a operação de turno, e
`RN-NUC-018` continua valendo: turno **não** é escopo de autorização. A lacuna fica **reduzida**, não
fechada. **A linha do fechamento do dia entrou na §4 de `operacao-offline-e-sincronizacao.md` em
2026-08-23**, por transcrição desta regra: `degradado` em D1 e D3, **recusa** em D2, classe 1 no fato e 2
na precondição. Sobra a metade de **turno**, que não se fecha por transcrição porque não há regra dona.

### RN-NUC-032 — Apresentar de novo a via de venda ou documento existente é do papel-piso, com registro; consultar em lote e exportar não são a mesma operação
**Enunciado** apresentar de novo, ou reimprimir, a via de uma venda ou de um documento fiscal **que já
existe** é operação do `cashier`, **com registro de auditoria** que inclui quantas vezes já foi
apresentada. Ela **nunca** produz documento novo, nunca reemite, nunca recompõe valor (`PN-08`,
`RN-EMI-020`, `RN-NUC-015`). **Consultar em lote, exportar e enumerar são outra operação**, com outro
alcance (`RN-EMI-039`), e nada nesta regra as libera.
**Motivo** `.claude/rules/seguranca.md` §2 põe reimpressão fiscal entre as operações sensíveis, e está
certo: via reimpressa é o caminho barato para documento apresentado duas vezes. Mas a obrigação de
**guardar e entregar** o documento é do emitente e o produto a assumiu (`RN-EMI-017`); negá-la ao papel
que está no balcão apagaria a obrigação exatamente onde ela é cobrada, e empurraria o estabelecimento
para o mecanismo velho — o gerente com a senha compartilhada, chamado a cada via perdida. O que torna a
operação segura não é o papel: é o **registro**, e o fato de ela não poder criar nada.
**Aceite** `cashier` apresenta a via da mesma venda duas vezes → duas entradas na trilha, **um**
documento, valor idêntico ao original, nenhuma reemissão; a mesma superfície não lista documento de
outra venda, de outro estabelecimento nem de outro cliente (`RN-EMI-039`, `RN-OFF-026`); tentar exportar
a partir dela → negado.
**Infeliz** pedem a via de um documento que **não existe** — a venda saiu com a faixa esgotada
(`RN-OFF-006`, infeliz (a)). O produto **não inventa**: diz que a venda existe, que o documento não
existe, e o que pode ser prometido. O que se entrega ao cliente-final nesse estado é `LACUNA-OFF-009`,
do humano com o contador.
**Offline** concedida por autoridade retida válida, limitada ao que o terminal retém como registro
operacional (`RN-OFF-022`); o que não está retido não é reimpresso e não é inventado.

---

## 6. Autorização derivada — o que não ganha célula própria

`RN-NUC-025` já é lei: nenhuma automação e nenhum canal externo porta papel, e a confirmação é
autorizada **pelo papel do efeito**. Consequência: as operações abaixo não têm linha nem coluna — a
autorização delas é a da linha do **efeito**, sem nenhum acréscimo.

- Confirmar proposta de `ATI` (`RN-ATI-001`, `RN-ATI-002`, `RN-ATI-016`).
- Resolver proposta feita pelo cliente-final pelo canal (`RN-PCF-007`).
- Assinar **dentro** do fluxo de venda: decorre da capacidade já concedida (`RN-EMI-036`).
- Abrir a gaveta como consequência da venda em espécie (`RN-NUC-012` (a)) — na linha 15 por clareza, e
  com o valor da linha 4, de propósito.

Célula que **acrescente** autorização a qualquer uma dessas quatro é defeito, não configuração.

---

## 7. As divergências herdadas, e a leitura que esta matriz adotou

**`RN-OFF-024` (b) × (d) — resolvido na regra dona em 2026-08-23; esta matriz não muda.** (b) dizia
"recusada **até reautenticar**" e (d) "nenhuma renovação acontece offline". A leitura que esta matriz
adotou — reautenticar **sem contato é impossível**, logo (b) significa "recusada até **reconectar**" —
passou a ser o texto de `RN-OFF-024`b, e `RN-OFF-033` declara que o caminho não existe. Junto veio a
correção maior: o **ato ordinário** de venda não se sustenta em autoridade retida (`RN-OFF-032`), então
vencer a validade **não** para o balcão, só o alcance sensível. **Consequência:** toda célula `retida`
significa "vale enquanto a validade dura; vencida, a operação recusa **até reconectar**". O que mudou é
a **mensagem** ao operador, que nunca é "reautentique", e o número de `LACUNA-OFF-011`, que agora pode
ser curto sem custar venda.

**Correção de 2026-08-23, e ela desmente o parágrafo acima** (`AUT-14`). Este texto afirmava que
"nenhuma célula muda de valor, porque nenhuma célula desta matriz cobre ato ordinário sem autoridade".
Era falso, e do jeito mais caro: as nove linhas do ato ordinário carregavam `retida` na coluna
`Offline`, e `RN-NUC-039` — escrita na mesma rodada — manda a **célula vencer a prosa inclusive contra a
`RN` dona**. Pela letra do conjunto, `RN-OFF-032` não estava em vigor: quem seguisse a célula pararia o
balcão ao vencer a validade (contra `PN-01`), e quem seguisse a prosa faria o que `RN-NUC-039` proíbe.
A coluna ganhou o **quarto valor** (`terminal+ident`, `RN-NUC-027`) e as nove linhas passaram a
carregá-lo (nota ¹⁴). **Nenhuma célula de papel mudou de valor**; a divergência estava na coluna, e é
nela que foi fechada.

**`RN-OFF-011` — "existe um papel dono da fila".** Resolvido no passo 2 (`papeis-e-permissoes.md` §4.2):
não é papel, é **atribuição** — `queue_owner` acrescenta **endereço**, não poder. Esta matriz trata a
fila assim, e é verificável: a linha 28 dá a superfície ao `manager` e ao `owner` **pelo papel**, e a
linha 22 declara a atribuição como **objeto** de uma operação de `owner`. Em nenhum lugar `queue_owner`
é coluna. **Corrigido na regra dona em 2026-08-23** (`AUT-11`): `RN-OFF-011` passou a dizer "existe
**uma atribuição** dona da fila", com o aceite ligado ao gate de `RN-NUC-020` — o enunciado e o arquivo
derivado dizem a mesma coisa, e a divergência está fechada nos dois lados. Nada nesta matriz mudou por
causa disso.

**Terceira divergência, encontrada aqui: quem concede delegação.** `RN-NUC-023` (b) põe "criar, alterar
e revogar atribuição **e delegação**" entre os atos de `owner`; o **aceite** de `RN-NUC-021` diz
"`manager` delega a um `cashier` a autorização de desconto acima do limite". As duas não podem valer.
**Leitura adotada: delegação é do delegante**, e o que é exclusivo de `owner` é a **atribuição** e o que
cada papel autoriza. Por quê: as restrições de `RN-NUC-021` — subconjunto próprio, não re-delegável, e
**morrer em cascata com a atribuição de origem** (reescrita em 2026-08-23 por `AUT-03`) — só têm sentido
se o delegante for o concedente; com `owner` como único concedente, a cascata perde a origem que a
define, e a válvula que evita papel novo a cada recorte (`papeis-e-permissoes.md` §4.3) deixa de
funcionar, porque todo recorte passa por uma pessoa só. A linha 21 reflete essa leitura; corrigir
`RN-NUC-023` é de quem edita o arquivo dele.

**Quarta divergência, nascida da correção de `AUT-02`: o ponto de aplicação do piso.** `RN-NUC-023`
proíbe que um papel amplie a si mesmo e o único aceite escrito lá é o caso **direto** ("`manager` tenta
ampliar o próprio limite"). `RN-NUC-040` (c) declara o ponto de aplicação que faltava — autoridade de
publicar recebida **por delegação** não alcança papel que o delegatário porta, enquanto quem porta a
meta-autoridade por **atribuição** segue publicando o que os papéis abaixo autorizam, inclusive quando
ele também os porta (a padaria de uma pessoa). **Leitura adotada: a de `RN-NUC-040`.** **Fechada em
2026-08-23 nos dois lados:** `RN-NUC-023` carrega a leitura no próprio texto, como cláusula **(d)**, com
os dois casos de aceite. Nada nesta matriz mudou por causa disso.

---

## 8. Contagem — negado por decisão × negado por ausência de decisão

A contagem consolidada está em `matriz-operacao-papel-modulos.md` §8. Deste arquivo, **atualizado em
2026-08-23** pela partição da linha 18 em cinco (18, 36, 37, 38, 39 — `AUT-02`): **39 linhas × 5 papéis
= 195 células**, das quais **5 são `?`** — negadas porque ninguém decidiu. A partição **não** criou nem
resolveu indecisão: as quatro linhas novas herdaram as células da linha original, e o total de `?`
continua 5.

| Célula | Linha | Lacuna |
|---|---|---|
| `manager`, `owner` | 11 — abrir sessão em nome de outro operador | `LACUNA-NUC-016` |
| `owner` | 24 — habilitar e desabilitar módulo | `LACUNA-NUC-023` |
| `owner` | 25 — conceder e revogar `provider_support` | `LACUNA-NUC-009` |
| `fiscal_officer` | 28 — ver a superfície da fila | `LACUNA-NUC-028` |

**Do caminho crítico do caixa — linhas 1 a 17 — só duas células ficaram indecisas, e as duas são a mesma
operação** (linha 11); as outras três estão em atos de administração. Afirmável porque cada uma das 190
células restantes tem `RN` em `Regida por`, e nenhuma delas é `?`.

---

## 9. Lacunas nascidas aqui

`015` e `016` abertas em 2026-08-22, `035` em 2026-08-23. Nenhuma bloqueia as regras: cada uma sobrevive
às duas respostas, negando por default até ser decidida. `LACUNA-NUC-017` a `028` estão em
`matriz-operacao-papel-modulos.md` §9, `029` a `033` em `superficie-por-papel.md` §6, `034` em
`papeis-e-permissoes.md` §6.

- **`LACUNA-NUC-015`** — **quem amplia o limite de desconto do `owner`, se alguém.** `RN-NUC-023` proíbe
  que um papel amplie a si mesmo e não há papel acima do `owner`: hoje o excesso acima do limite dele é
  negado **sem caminho** (linha 7, nota ¹). As saídas são todas do humano: o teto do `owner` é o teto do
  sistema; um segundo portador de `owner` autoriza o outro; ou o `owner` não tem limite — e a terceira
  precisa de `seguranca` antes. **Dono:** humano.
- **`LACUNA-NUC-016`** — **quem abre sessão de caixa em nome de outro operador, e quem responde pelo
  fundo nesse caso.** A necessidade é conhecida — o gerente abre o posto antes de o operador chegar. A
  metade de **papel** ficou respondida em 2026-08-23: existe operação distinta, com dois sujeitos
  (`RN-NUC-037`), e `RN-NUC-009` declara que "quem assume" é a identidade autenticada — logo há onde
  verificar a célula. **Continua aberto o valor da célula** e quem responde pelo fundo. Até decidir, a
  linha 11 é negada a todos. **Dono:** humano.
- **`LACUNA-NUC-035`** — **a marca "exige autorização de terceiro" de um meio de pagamento é artefato
  publicável pelo cliente, ou é do módulo dono do meio** (`ADQ`/`PGO`/`PRZ`)? É a entrada de `AUT-02`
  que não se fecha nesta matriz: hoje a marca é membro do conjunto de `RN-NUC-013`, publicada pelo
  próprio cliente (linha 37), e é ela que permite ao terminal recusar sozinho (`RN-NUC-005`,
  precondição) — quem a publica **desliga** essa recusa. Até decidir, a linha 37 é do `owner`, **não
  delegável** (`RN-NUC-040` b), o que fecha a metade da fraude que vinha por delegação e deixa em pé a
  pergunta de fronteira. **Dono:** humano, com o adquirente; a alteração do conjunto é de quem edita
  `nucleo-publicacao-e-texto.md`.

---
id: T-0006
jira: SPR-54
titulo: Aplicar no board a revisão do backlog contra a spec aprovada
status: bloqueada
escopo: cliente=- vertical=- modulo=- camada=produto+processo
aberta_em: 2026-08-26
---

## Pedido

Preciso que o cara de produto, faça a revisão lá dos cards, do gira para poder, ver se está tudo ok,
se, enfim, se as metas estão ok, essa descrição está ok, vai fazer uma análise geral, uma descrição e
vai editar se precisa for.

## Plano

## PLANO — T-0006 Aplicar no board a revisão do backlog contra a spec aprovada

JIRA: `SPR-54` (criada no passo 1) · `SPR-53` (a revisão; recebe comentário e FECHA no passo 6)

> **Desvio declarado de `jira.md` §1:** a issue não precede o plano porque *qual issue* era exatamente
> a pergunta feita ao orquestrador. Nada foi despachado antes dela existir — a criação é o **primeiro
> ato** do passo 1, com título, tipo e corpo prescritos.

### As três decisões que precederam o plano

**1. Qual issue ancora — issue nova, e `SPR-53` não é reaproveitada nem editada.**
(a) `SPR-53` é `Spike`, e `jira.md` §8 define Spike como o trabalho cujo desfecho é evidência, não
código; o trabalho de hoje muda estado do board. (b) A cerca `## Fora de escopo` continua verdadeira
sobre o que `SPR-53` fez; editá-la reescreveria os termos sob os quais a evidência foi produzida, e
`jira.md` §9 diz que a seção existe para impedir a issue de crescer no meio da execução. (c) Duas
issues deixam os dois fatos legíveis: a revisão foi feita ali, sob aquela restrição; a aplicação
aqui, depois que a restrição caiu em 2026-08-26. `SPR-53` recebe **comentário** (append-only) e
`createIssueLink`, e **fecha no fim deste despacho**, não antes — a §6 dela declara o que não
verificou, e fechar antes é fechar `PARCIAL`. Tipo da nova: `História`, escolha por eliminação
declarada.

**2. A revisão se reaproveita na substância, e se confere no alvo.** Citação de `RN`, teste dos três
negócios, tabela de contradição §3, `G-01`..`G-09` e as duas refutações de quatro partes vêm de
`docs/produto/**`, que `produto` leu — reaproveitam. Que o board tenha exatamente aquelas issues, o
corpo dos 19 cards novos e se um card tem critério de aceite que a substituição destruiria vêm da
**transcrição do brief** — conferem. É o gotcha de `state-board-spr-2026-08-26.md`: três cards
renomeados pelo resumo antes de ler o corpo, três errados. Descrição não é append-only.

**3. Bloco B entra agora — só como bloqueio visível.** Postar o comentário não decide nenhuma `G`, e
`jira.md` §5 é direta: bloqueio é visível ou não existe. `SPR-40` é `Highest` e começa 2026-08-31.
Fica de fora a parte **substantiva** do Bloco B.

### Escopo

- Conferir as 53 issues do `SPR` contra o veredito de `revisao-backlog-spr-2026-08-26.md`, corpo por
  corpo, e emitir o **delta**.
- Aplicar o **Bloco A** de `backlog-edicoes-a-aplicar.md` **verbatim**, preservando a descrição
  anterior em comentário **antes** de cada substituição.
- Postar o **Bloco B** como **comentário de bloqueio**, com o rótulo `bloqueada`.
- Comentar e vincular `SPR-53`, e fechá-la.
- Entregar ao humano a **pauta consolidada** de `G-01`..`G-09`, ordenada por alavanca de calendário.

### Fora de escopo

- **Decidir qualquer `G-01`..`G-09`.** Quatro são fronteira núcleo × módulo, e
  `fronteira-do-nucleo.md:169` manda que venham como pergunta, nunca por eliminação.
- **A parte substantiva do Bloco B** — título, descrição e escopo que dependem de `G`.
- **Excluir card.** Zero `EXCLUIR` na revisão; as duas `FUNDIR` não excluem nada.
- Prioridade, prazo, dono e status — exceto o rótulo `bloqueada` e o fechamento das duas issues.
- Criar `RN` nova, abrir `LACUNA-<COD>-<nnn>`, reservar código de módulo em `glossario.md` §4.3.
- Qualquer modelagem, contrato ou componente. Editar o `## Fora de escopo` de `SPR-53`.

### Escopo de memória

`cliente=- vertical=- modulo=- camada=produto+processo`. Leitura: `memory/plataforma/INDEX.md` →
`state-board-spr-2026-08-26.md`, `reference-jira-projeto-spr.md`,
`gotcha-board-spr-e-nomeado-pela-vertical.md`, `gotcha-capacidade-sem-dono-entra-pelo-titulo-do-card.md`,
`gotcha-modelo-agendado-antes-da-regra-que-o-define.md`; `memory/processo/INDEX.md` →
`decision-produto-e-o-dono-do-backlog-no-jira.md`,
`gotcha-endereco-de-relatorio-envelhece-na-propria-sessao.md`. Nada além.

### Decisões abertas que tocam isso

`D-01` (parcial — `SPR-52`), `D-02` (`SPR-35`/`42`/`43`/`50`), `D-04` (`SPR-39`): todas `MANTER`,
nenhuma ação. `D-05` e `D-06` tangenciam `G-01`. **Nenhuma precisa ser fechada para o plano andar**,
porque o plano só torna a dependência visível.

### Passos

1. **`produto`** — criar a issue âncora e conferir o board contra a revisão — sequencial, tudo depende
   dele. Primeiro ato: testar o mecanismo do Jira; ausente, `BLOQUEIO` e nada mais. Entrega: seção de
   conferência em `docs/produto/`, com correção in loco onde o veredito mudou, mais a lista das
   entradas que precisam ser reescritas antes de aplicar. Read-only no Jira exceto a criação.
2. **2a. `produto`** — aplicar as entradas de **comentário** do Bloco A, verbatim, com o cabeçalho
   `[T-0006 · produto · 2026-08-26]`. Entrega: uma linha por card — `chave · campo · o que mudou`.
3. **2b. `produto`** — aplicar as entradas de **título** e **descrição** do Bloco A. **É o passo de
   risco.** Uma regra por card: poste primeiro o comentário preservando o texto atual verbatim, e só
   então substitua. Divergência não resolvida no passo 1: **não edite**, declare em `NÃO FEITO`.
4. **3. `produto`** — bloqueio visível e acerto de `SPR-53`. Só comentário. Entrega: lista
   `chave → G-nn`.
5. **4. thread principal** — rótulo `bloqueada` e espelhamento dos artefatos em `SPR-54`.
6. **5. `produto`** — pauta consolidada de `G-01`..`G-09` (`docs/produto/backlog-lacunas-g01-g09.md`),
   paralelo com 2a/2b, territórios disjuntos.
7. **6. `orquestrador`** — fechamento. `SPR-53` e `SPR-54` fecham no mesmo passo, cada uma com o
   comentário de fechamento da §10 antes da transição `41`.

### Gates

- **Gate 1** (regra de negócio antes de código) — cumprido por construção: o trabalho é de `produto` e
  cria zero `RN` nova por escopo declarado.
- **Gates 2, 3, 4** (schema · endpoint · consulta) — **não se aplicam**: nenhum DDL, nenhuma rota,
  nenhuma consulta. Declarado para o futuro: quando `SPR-16` virar trabalho, "sem limitação fixa de
  profundidade" em catálogo quente passa por `performance` antes de virar aceite.
- **Gate 5** (`BLOQUEIO` não se ignora) — **é o gate vivo aqui.** As nove `G` são material de bloqueio:
  visíveis no board (passos 3–4) e escaladas ao humano numa pauta (passo 5).
- **`jira.md` §6** — nada de `memory/**` nem `docs/auditorias/**` colado, nenhum dado real, nenhum
  segredo.
- **Auditoria periódica** (`processo.md` §6) — não se aplica: não é fim de fase nem módulo concluído.

### Risco principal

Substituir a descrição de um card sobre um corpo que ninguém leu, destruindo um critério de aceite
válido — e com o nome do humano na edição. É irreversível na prática e é a **repetição** de um gotcha
já registrado, que na primeira vez errou três cards de três. As três travas: o passo 1 inteiro, a
ordem 2a→2b, e a preservação do texto anterior em comentário antes de cada substituição.

**Contingência:** `produto` sem ferramentas do Jira devolve instrução exata (chave · campo · texto
literal) e o thread aplica verbatim, como digitador. A decisão de conteúdo continua sendo dele.

## produto — 2026-08-26 (passo 1)

## RELATÓRIO — produto — T-0006
STATUS: OK
FEITO:
  - Testei o mecanismo: `getJiraIssue` em `SPR-53` voltou com título, corpo e `customfield_10042`. O
    Jira subiu nesta sessão — a hipótese de `decision-produto-e-o-dono-do-backlog-no-jira.md`
    (registro de agents carregado uma vez por sessão) fica confirmada pela negativa: sessão nova,
    ferramentas presentes.
  - Criei **`SPR-54`** — "Aplicar no board a revisão do backlog contra a spec aprovada", tipo
    `História`, `A fazer`, sem dono, sem prioridade, sem prazo — na anatomia de `jira.md` §9, com
    `## Fora de escopo` explícito nos seis itens do plano.
  - Confirmei por JQL que o conjunto é exatamente `SPR-1`..`SPR-53`, sem buraco de chave (53, não 52).
  - Li o corpo real de 44 das 53 issues, com comentários, e o `customfield_10042` dos `Spike`.
    Confrontei cada uma contra o veredito e contra o texto do Bloco A/B.
  - Escrevi a conferência, dividida em achados e texto corretivo, e corrigi in loco os vereditos que
    mudaram.

OS CINCO ACHADOS QUE VALEM A PASSADA:
  1. **O Bloco A já foi aplicado pela metade** — 17 entradas de comentário, a nota de vocabulário em 5
     dos 13 cards, e os títulos de `SPR-17` e `SPR-18`, tudo entre 12:37:02 e 12:43:19 de hoje.
     Aplicar o arquivo como está produz duplicata append-only.
  2. **`SPR-36` vai de `MANTER` para `BLOQUEAR`.** O escopo põe o **fuso na linha do cliente**, com
     justificativa escrita — isso *decide* `LACUNA-GLO-001`, que é do humano. Vence em **2026-09-08**,
     e nenhuma issue do board faz a pergunta. A revisão o marcou `MANTER` porque a palavra "fuso" não
     está no título. O mesmo default está escrito em `SPR-34`, `SPR-37` e `SPR-46` — quatro cards, uma
     resposta, nenhuma decisão.
  3. **As seis substituições de descrição apagariam critério de aceite ainda válido** — as seis.
     `SPR-29` é a pior: quatro aceites novos, todos sobre procedência, nenhum sobre o acumulado
     refletir o que acabou de acontecer, que é a única coisa que o card pedia. `SPR-23` recusa o
     mecanismo (texto como chave) e não repõe a necessidade — a linha agregada passa a esconder "sem
     cebola" e "com bacon", que é a dor nomeada na própria §5.2.
  4. **A entrada já publicada em `SPR-1` contém afirmação falsa.** `service_mode` **tem** regra:
     `RN-NUC-048`, e `glossario.md:396` registra `LACUNA-GLO-002` como fechada em 2026-08-23 por causa
     dela. As linhas `roadmap-de-modulos.md:155` e `:171` é que estão velhas, e a revisão as copiou
     sem conferir a substância.
  5. **`SPR-30` vai de `MANTER` para `AJUSTAR`.** Só o título foi trocado; a descrição ainda diz "o
     item poderá ser editado após o envio". Mesmo estado de `SPR-18` — título corrigido sobre corpo
     intacto.

ARQUIVOS:
  - `docs/produto/revisao-backlog-spr-conferencia-2026-08-26.md` (novo, 362 linhas) — os achados
  - `docs/produto/backlog-edicoes-correcoes-2026-08-26.md` (novo, 319 linhas) — o texto corretivo das
    seis substituições, mais `SPR-46`, `SPR-27` e a retratação de `SPR-1`
  - `docs/produto/revisao-backlog-spr-2026-08-26.md` (editado, 241 linhas) — 11 correções in loco:
    vereditos de `SPR-8`/`SPR-9`/`SPR-30`/`SPR-36`, reformulação de `SPR-1`/`SPR-19`/`SPR-46`, linha
    nova em §3 para `SPR-7`, contagem, e o fecho de §6
  - `docs/produto/backlog-edicoes-a-aplicar.md` (editado) — aviso de parada no topo de "Como aplicar"

NÃO FEITO: —

DECISÕES:
  - **Parti a conferência em dois arquivos** em vez de justificar 592 linhas por `00-nucleo.md` §8. A
    divisão segue a que já existe entre `revisao-*.md` (achados) e `backlog-edicoes-*.md` (texto a
    aplicar). Trade-off: mais um arquivo para manter em sincronia; em troca, os dois cabem no teto e
    quem vai aplicar lê só o segundo.
  - **Não corrigi `roadmap-de-modulos.md:155`/`:171`**, apesar de estarem no meu território e
    comprovadamente velhos. É o arquivo dono de outra coisa, está modificado na working tree, e
    corrigi-lo de carona é o `00-nucleo.md` §7. Reportado como pendência.
  - **`SPR-36` recebeu `BLOQUEAR`, não `AJUSTAR`.** Ajustar sugere reescrita de texto; o defeito é que
    a coluna não pode nascer antes da decisão.

RISCOS:
  - **`SPR-14` (2026-10-23) está agendado depois de `SPR-41` (2026-10-20)**, o único gate de segurança
    do board, e cria tabelas em schema de cliente. Gate 2 do `CLAUDE.md` §4 fica descoberto.
  - **Três das cinco Epics planejadas nunca foram criadas**, e `SPR-25` e `SPR-27` declaram dependência
    para elas ("Epic 3", "Epic 5"). Dependência para issue inexistente não acusa no board.
  - **`SPR-27` carrega comentário afirmando "disponibilidade é do núcleo"**, que contradiz `G-07`.
    Append-only: só sai por retratação explícita.
  - Nove cards (`SPR-35`, `SPR-42`–`SPR-44`, `SPR-47`–`SPR-50`, `SPR-52`) seguem lidos só pelo título.
    Depois de `SPR-36`, isso incomoda.
  - `SPR-20` proíbe o mesmo adicional duas vezes no item — "bacon duplo" fica impossível. Muda o
    desenho de `G-05`: adicional é conjunto ou multiconjunto?

PERGUNTAS:
  - para humano: `LACUNA-GLO-001` (fuso: estabelecimento ou cliente?) precisa de resposta **antes de
    2026-09-08**, quando `SPR-36` vence. É a única das dez perguntas abertas com data de vencimento no
    board.
  - para humano: `SPR-14` antes de `SPR-41`, ou segundo gate de segurança depois dele?

VERIFICAÇÃO: `getJiraIssue` em `SPR-53`; sete consultas JQL cobrindo o conjunto, corpos, comentários,
rótulos e prazos; `RN-NUC-048` confirmado em `fatos-de-operacao-dominios-fechados.md:124` e
`glossario.md:396`; `LACUNA-NUC-007` e `LACUNA-GLO-001` confirmadas abertas na fonte. Contagem de
linhas dos dois arquivos novos conferida contra o teto de 400. **Não rodei** nenhuma escrita no Jira
além de `createJiraIssue` — sem comentário, sem edição, sem transição, sem rótulo.

MEMÓRIA SUGERIDA:
  - type=gotcha escopo=plataforma slug=decisao-em-aberto-entra-pelo-corpo-com-o-titulo-limpo — `SPR-36`
    decide `LACUNA-GLO-001` no escopo e o título não tem a palavra "fuso"; revisar por título produz
    `MANTER` no card mais caro do board. É o avesso de
    [[gotcha-capacidade-sem-dono-entra-pelo-titulo-do-card]].
  - type=gotcha escopo=processo slug=titulo-corrigido-sobre-corpo-intacto — `SPR-18` e `SPR-30` têm
    título afirmando a regra nova e descrição afirmando o mecanismo recusado; comentário de recusa não
    substitui descrição, e quem pega o card implementa o corpo.
  - type=convention escopo=produto slug=recusar-mecanismo-sem-repor-a-necessidade — `SPR-23`: a recusa
    de `RN-NUC-016` estava certa e o texto substituto deixou a linha agregada esconder a observação. As
    quatro partes de §12 exigem a terceira (o mecanismo que fica) atender a necessidade nomeada na
    primeira.
  - type=state escopo=plataforma slug=state-board-spr-2026-08-26 — **atualizar o existente**: são 54
    issues; Bloco A aplicado pela metade; `bloqueada` só em `SPR-31`/`32`/`33`; três Epics planejadas
    nunca criadas.
  - type=gotcha escopo=processo slug=endereco-de-relatorio-envelhece-na-propria-sessao — **fundir**:
    `roadmap-de-modulos.md:155`/`:171` são um caso novo do mesmo gotcha, e desta vez o endereço velho
    virou comentário publicado no Jira.

PRÓXIMO PASSO SUGERIDO: thread principal — criar a ficha `T-0006` com `jira: SPR-54`, espelhar este
relatório em `SPR-54`, e levar ao humano as duas perguntas acima antes de despachar o passo 2. O passo
2 (aplicação) não deve começar sem a resposta de `LACUNA-GLO-001`: quatro dos cards a aplicar dependem
dela.

## produto — 2026-08-26 (passo 3 — bloqueio visível)

## RELATÓRIO — produto — T-0006
STATUS: OK
FEITO:
  - Confirmei o estado do board por JQL **antes** de escrever: `bloqueada` existe **só** em `SPR-31`,
    `SPR-32` e `SPR-33`. Nenhuma outra issue do `SPR` tem rótulo. Não republiquei nada nas três.
  - Confirmei por leitura de comentários que os **oito** alvos não tinham comentário de bloqueio:
    `SPR-19`, `SPR-20`, `SPR-26`, `SPR-34`, `SPR-36`, `SPR-37` e `SPR-40` com **zero** comentários;
    `SPR-16` só com a nota de vocabulário de 12:37:02.
  - Postei os **oito** comentários de bloqueio, cada um nomeando a `G`, a pergunta em uma frase, o que
    desbloqueia e o **default silencioso**.
  - Postei as **duas retratações**: `SPR-1` (`service_mode` tem regra — `RN-NUC-048`) e `SPR-27`
    (a afirmação "disponibilidade é do núcleo" saiu sem base; `G-07` segue aberta e não foi decidida
    para nenhum dos dois lados).
  - Postei o acerto de `SPR-53`, sem editar o corpo e sem fechar.
  - Confirmei na fonte **todo** `path:linha` que postei, antes de postar.

LISTA PARA O THREAD PRINCIPAL APLICAR O RÓTULO `bloqueada`:
  - `SPR-40` → `G-09` — vence **2026-09-02**, o mais próximo do board
  - `SPR-36` → `LACUNA-GLO-001` — vence **2026-09-08**
  - `SPR-16` → `G-03`
  - `SPR-19` → `G-04`
  - `SPR-20` → `G-05`
  - `SPR-26` → `G-07`
  - `SPR-34` → `G-01`, `G-02`, `G-09`, `LACUNA-GLO-001`
  - `SPR-37` → `G-02`, `G-01`, `LACUNA-GLO-001`

Já rotuladas em 2026-08-26 12:17–12:18, **não mexer**: `SPR-31` (`G-03`), `SPR-32` (`G-04`, `G-05`),
`SPR-33` (`G-04`, `G-05`).

COMENTÁRIOS POSTADOS (11):
  - `SPR-40` · `G-09` trava "Resultados Esperados", que pede o caso de rateio com resto — a política de
    arredondamento é `LACUNA-NUC-004` e tem dono com o contador
  - `SPR-36` · o escopo decide `LACUNA-GLO-001` em dois lugares (objetivo e primeira linha do escopo), e
    a tabela de `RN-NUC-013` afirma o lado oposto
  - `SPR-16` · "categoria de catálogo" não existe na spec; `PUB` reivindica agrupamento como módulo
  - `SPR-19` · o card já declara o limite na direção de `GRD` desligado; o que resta é onde a entidade
    de variação mora
  - `SPR-20` · adicional sem escopo, sem dono e sem código reservado; mais conjunto × multiconjunto e a
    composição de valor fora da lista fechada
  - `SPR-26` · não há `RN` de disponibilidade no caminho de venda; decidir por `EST` torna o card não
    construível no MVP 1, e isso é resposta legítima
  - `SPR-34` · Epic incompleta nas três reservas da Opção B, e as quatro lacunas precedem qualquer coisa
    datada ou valorada; mais a nota de sequência `SPR-14` × `SPR-41`
  - `SPR-37` · turno sem regra, fuso herdado, e as três reservas fora do escopo declarado
  - `SPR-27` · **retratação**: "disponibilidade é do núcleo" saiu sem base; `G-07` continua aberta
  - `SPR-1` · **retratação**: `service_mode` tem `RN-NUC-048`; `roadmap-de-modulos.md:155`/`:171` é que
    estão velhas
  - `SPR-53` · a premissa do `## Fora de escopo` caiu com `jira.md` §2; a aplicação é `SPR-54`; a revisão
    foi escrita sem ler o corpo e isso mudou quatro vereditos

ARQUIVOS: `tarefas/T-0006-aplicar-revisao-do-backlog-no-board.md` (editado — só esta seção). Nenhum
arquivo de `docs/produto/**` tocado neste passo.

NÃO FEITO: —

DECISÕES:
  - **Postei a retratação de `SPR-27` antes do comentário de `SPR-26`**, porque o de `SPR-26` afirma que
    ela existe. Comentário publicado que descreve fato inexistente é o defeito que este passo veio
    corrigir.
  - **Usei `fronteira-do-nucleo.md:71`, não `:72`.** Conferido: `:71` é "item composto por eixos
    (cor/tamanho) → módulo"; `:72` é composição por insumo. As duas citações erradas continuam em
    `revisao-backlog-spr-2026-08-26.md:119` e `:133` — não corrigi, é outro passo.
  - **`SPR-37` e `SPR-34` levam mais de uma `G`.** O Bloco B só nomeia `G-02` em `SPR-37`; a pauta e o
    corpo do card mostram `G-01` e o fuso também. Rotular por uma só faria o rótulo sair cedo demais.
  - **Citei `catalogo-de-modulos.md:98`–`:100` para `PUB`**, não `:98` isolado: a palavra "agrupamento"
    está em `:100`.

RISCOS:
  - **`G-06` não tem nenhum card com comentário de bloqueio.** `SPR-6` declara a lacuna no comentário já
    publicado; `SPR-8` e `SPR-9` **não**, e foram os dois que a conferência mudou de `MANTER` para
    `AJUSTAR` (§2.2, §2.3) justamente por carregarem o contador no aceite. O texto deles é entrada de
    Bloco A ainda não escrita, então ficou fora deste passo por escopo — mas os três vencem em
    2026-11-13 com o contador no critério de aceite e sem regra atrás.
  - **`G-08` também não tem card rotulado.** O comentário já publicado em `SPR-17` declara a lacuna, e
    `SPR-17` é `AJUSTAR`, não `BLOQUEAR` — coerente com o Bloco B, mas quem olhar só o rótulo não vê.
  - O renderizador do Jira quebra ênfase quando negrito ou itálico envolve trecho em `código`. Três
    comentários saíram com o negrito da primeira linha fechando cedo. Conteúdo intacto, aparência não.
  - `SPR-53` continua com a descrição afirmando que `produto` não tem acesso ao Jira. Corrigido por
    comentário, não por edição — e por decisão declarada no plano.

PERGUNTAS:
  - para humano: os oito rótulos `bloqueada` saem agora? A lista está acima, pronta para aplicar.
  - para humano: `SPR-8` e `SPR-9` entram como `bloqueada` por `G-06`, ou ficam como `AJUSTAR` com a
    lacuna declarada em comentário, como `SPR-6`?

VERIFICAÇÃO: duas consultas JQL (rótulos/status/prazo dos 19 cards relevantes; comentários dos oito
alvos) e seis `getJiraIssue` (`SPR-36`, `SPR-40`, `SPR-37`, `SPR-34`, `SPR-19`, `SPR-20`, `SPR-26`,
`SPR-53`) — todo trecho que citei entre aspas foi lido no board hoje, não reaproveitado de resumo.
Todo `path:linha` postado foi aberto no arquivo: `fronteira-do-nucleo.md:71`/`:169`/`:64`–`:75`,
`glossario.md:120`/`:271`/`:274`/`:395`/`:396`, `catalogo-de-modulos.md:90`/`:93`/`:96`/`:98`–`:100`/
`:253`–`:259`, `roadmap-de-modulos.md:155`/`:171`/`:172`/`:184`/`:258`–`:266`/`:328`/`:333`–`:334`/
`:387`/`:420`, `nucleo-venda.md:113`/`:370`/`:381`, `nucleo-publicacao-e-texto.md:29`–`:50`/`:32`/
`:46`/`:49`/`:60`–`:64`/`:79`–`:80`/`:97`–`:98`, `operacao-offline-e-sincronizacao.md:95`/`:99`,
`cozinha.md:215`, `mesa-comanda.md:194`, `receitas-por-vertical.md:46`,
`fatos-de-operacao-dominios-fechados.md:124`. **Não apliquei rótulo** (é do thread principal), **não
transicionei status**, **não editei título, descrição nem escopo de nenhuma issue**.

MEMÓRIA SUGERIDA:
  - type=gotcha escopo=processo slug=comentario-que-afirma-fato-que-ainda-nao-existe — o comentário de
    `SPR-26` cita a retratação de `SPR-27`; postar na ordem inversa publicaria referência a algo
    inexistente, e comentário é append-only.
  - type=convention escopo=processo slug=bloqueio-nomeia-o-default-silencioso — comentário de bloqueio
    que só diz "falta decidir" não move ninguém. O que move é a frase "se ninguém responder até
    `AAAA-MM-DD`, o sistema decide assim, e o custo é este".
  - type=state escopo=plataforma slug=state-board-spr-2026-08-26 — **atualizar**: 11 comentários novos em
    2026-08-26 13:25–13:29; oito cards com bloqueio comentado e **aguardando rótulo**; `G-06` e `G-08`
    sem card rotulado.

PRÓXIMO PASSO SUGERIDO: thread principal — aplicar o rótulo `bloqueada` nas oito chaves da lista acima e
espelhar este relatório em `SPR-54`. Em paralelo, passo 5 (`produto`): a pauta de `G-01`..`G-09` já está
em `docs/produto/backlog-lacunas-g01-g09.md` e é o que vai ao humano.

## produto — 2026-08-26 (passo 2 — aplicação do Bloco A)

## RELATÓRIO — produto — T-0006
STATUS: OK

FEITO:
  - Li o corpo real dos 16 cards antes de escrever em qualquer um. Isso mudou o plano em três deles
    (abaixo), e nenhum foi editado com base na lista do arquivo de edições.
  - **2a** — postei 6 comentários: a nota de vocabulário em `SPR-23`, `SPR-26`, `SPR-28` e `SPR-33`;
    a correção de fronteira de `SPR-27`; e a entrada corrigida de `SPR-46`.
  - **2b** — apliquei 6 títulos e 7 descrições, cada um precedido do comentário de preservação com o
    texto anterior verbatim. Nenhuma substituição saiu sem o comentário antes.
  - Confirmei na fonte **todo** `path:linha` que postei, antes de postar. Dois estavam errados no
    material de origem e foram corrigidos (ver DECISÕES).

2a — COMENTÁRIO (`chave · campo · o que mudou`):
  - `SPR-23` · comentário · nota de vocabulário — corpo usa "produto"/"Produto;" como entidade
  - `SPR-26` · comentário · nota de vocabulário, marcada como não-bloqueio e independente de `G-07`
  - `SPR-28` · comentário · nota de vocabulário ("preço do produto/variação"), remetendo ao
    comentário de 12:17 para desconto/`G-09` em vez de repeti-lo
  - `SPR-33` · comentário · nota de vocabulário, com a cláusula de que a chave de equivalência **é**
    estrutura de dado; remete ao comentário de 12:18 para `RN-NUC-016` em vez de repeti-lo
  - `SPR-27` · comentário · correção de fronteira: `COZ` não bloqueia lançamento (`RN-COZ-010`,
    `RN-COZ-008`, `RN-MSA-012`); o card precisa declarar **quem** bloqueia; mais o endereço vazio do
    "Epic 5"
  - `SPR-46` · comentário · a entrada corrigida — o card já respondeu `LACUNA-GLO-001` no aceite; o
    que o formatador pode afirmar sem a decisão; e a declaração explícita de que **nada foi aplicado**

2b — TÍTULO E DESCRIÇÃO (`chave · campo · o que mudou`):
  - `SPR-13` · comentário+título+descrição · encerrar consumo é de `MSA`, não externo; escopo cresce e
    isso está declarado; aceites 5 e 6 preservam "encerrado não recebe item" e "não emite trabalho novo"
  - `SPR-18` · comentário+descrição · mecanismo condicional substitui a etapa universal; título já
    estava trocado desde 12:37 e o corpo o contradizia; três critérios ganham destino nomeado
  - `SPR-22` · comentário+título+descrição · absorve `SPR-21`; aceite 5 preserva "imediatamente";
    "valor da comanda" endereçado a `SPR-29`
  - `SPR-23` · comentário+título+descrição · agregação de apresentação substitui fusão de fato;
    aceites 4 e 6 repõem a necessidade — a observação continua legível na linha agregada, e
    "2× X-Burger + Bacon" é literal
  - `SPR-25` · comentário+título+descrição · absorve `SPR-24`; eixo passa a ser natureza do fato;
    aceite 7 traz "quantidade inválida" de `SPR-24`; "total atualizado" endereçado a `SPR-29`
  - `SPR-29` · comentário+título+descrição · o núcleo compõe, `MSA` expõe; aceites 5 e 6 repõem o
    acumulado vivo, que era o que o card inteiro pedia; adicional de R$ 0,00 declarado atrás de `G-05`
  - `SPR-30` · comentário+descrição · **fora das 6 descrições do Bloco A**, e o motivo está em DECISÕES

TODA ENTRADA DO BLOCO A TEM DESFECHO — as que não apliquei, e por quê:
  - `SPR-1`..`SPR-12`, `SPR-14`, `SPR-15`, `SPR-21`, `SPR-24` · comentário · **já aplicada** em
    2026-08-26 12:37–12:43
  - `SPR-17` · título e comentário · **já aplicada** em 2026-08-26 (título 12:37, comentário 12:37)
  - `SPR-18` · título · **já aplicada** em 2026-08-26 12:37
  - `SPR-16`, `SPR-22`, `SPR-27` · nota de vocabulário · **já aplicada** em 2026-08-26 12:37
  - `SPR-19`, `SPR-20` · nota de vocabulário · **já aplicada** em 2026-08-26 13:26, **dentro** do
    comentário de bloqueio do passo 3, que a carrega no fim com a mesma prova. A conferência §1.2 a
    listava como pendente porque foi escrita antes daquele passo.
  - `SPR-31` · nota de vocabulário · **não se aplica**: o corpo não usa o termo. Título é "hierarquia
    de categorias do catálogo" e a descrição é "estrutura de categorias/subcategorias sem limitação
    artificial de profundidade". A entrada dispensa o comentário nesse caso, e é ela que diz isso.
  - `SPR-32` · nota de vocabulário · **já aplicada** em 2026-08-26 12:18, no item 3 do comentário de
    bloqueio: "'Produto' é vocabulário proibido para a entidade (`glossario.md:63`). O termo é item de
    catálogo / `catalog_item`". Mesma correção, mesma prova.
  - `SPR-28`, `SPR-33` · comentário de conteúdo · **redundante**, confirmado no board (conferência
    §1.5). Só a nota de vocabulário faltava, e ela foi postada.
  - Bloco B inteiro · fora do escopo deste passo, e o passo 3 já o cobriu.

NÃO FEITO:
  - **Nenhuma substituição de aceite em `SPR-46`.** O card fixa "o fuso é do cliente" no escopo **e**
    no critério de aceite, o que responde `LACUNA-GLO-001`. Trocar o aceite decidiria a lacuna pelo
    outro lado, e ela é do humano. Ficou como recomendação em comentário. **Espera:**
    `LACUNA-GLO-001`, ou autorização explícita para aplicar o aceite neutro que o comentário propõe.
  - **Nenhum título novo em `SPR-32`.** Ele nomeia exatamente o que `G-04` e `G-05` decidem. **Espera:**
    `G-04` e `G-05`.
  - **Nada substantivo do Bloco B.** **Espera:** `G-01`, `G-03`, `G-04`, `G-05`, `G-07`, `G-09`.
  - **`SPR-27` continua com o título "Validar disponibilidade antes do envio"**, que afirma a fronteira
    que a correção de hoje desmonta. Não o troquei porque o título correto nomeia **quem** bloqueia, e
    quem bloqueia é `G-07`. **Espera:** `G-07`.

DECISÕES:
  - **Editei a descrição de `SPR-30`, que não é uma das seis do Bloco A.** O passo 1 mudou o veredito
    dele para `AJUSTAR` (descrição) e não escreveu o texto. Editei porque: (a) a divergência foi
    resolvida no passo 1, §2.4; (b) a recusa de quatro partes já está publicada no card desde 11:53,
    então o corpo novo não introduz recusa nova — torna corpo o que já era comentário; (c) o card
    estava no mesmo estado de `SPR-18`, título afirmando uma regra e corpo afirmando a oposta, e vence
    em 2026-11-27. Preservei os cinco critérios: três viram aceite, dois são o mecanismo recusado.
  - **Corrigi o endereço da célula da matriz em `SPR-25` e `SPR-30`.** O Bloco A manda citar
    `matriz-operacao-papel-contrato.md:213` para a linha "retirar item lançado". Aquele endereço é
    `RN-NUC-039` (a regra de que a célula manda), e está certo como regra. A **célula** mora em
    `matriz-operacao-papel-modulos.md:69` — conferido: `N·cfg` / `R` / `R` / `N` / `N` / recusa. Citei
    os dois, cada um pelo que ele é. Sem isso, quem seguisse o endereço não acharia a linha.
  - **`SPR-30` declara a fronteira com `SPR-25` em vez de repetir a nota do Bloco A.** A nota preparada
    diz "correção de item já concluído em venda continua sendo `SPR-30`" — e o corpo de `SPR-30` é
    sobre item enviado à produção em **consumo em aberto**, não sobre venda concluída. A nota foi
    escrita sem ler o corpo. Escrevi a fronteira pelo que os dois cards de fato pedem.
  - **Não republiquei a nota de vocabulário em `SPR-19`, `SPR-20` e `SPR-32`.** Os três já a carregam
    dentro do comentário de bloqueio, com a mesma prova. Comentário é append-only e duplicata não sai.
  - **Acrescentei "atualizar o acumulado → `SPR-29`" às notas de fronteira de `SPR-25`.** É a regra
    transversal do próprio arquivo de correções — critério que muda de casa nomeia o destino — e sem
    ela "o total deve ser atualizado após a remoção" sumia sem endereço.
  - **Apliquei o título de `SPR-29` verbatim, com as crases.** Ver RISCOS.

RISCOS:
  - **O título de `SPR-29` mostra crases literais no board:** "Compor o acumulado do consumo em aberto
    — o núcleo compõe, `MSA` expõe". Campo de título é texto puro e não renderiza marcação. É o texto
    aprovado, então não o alterei por conta própria; a limpeza é uma edição de um caractere e é decisão
    de quem manda no texto.
  - **`SPR-25` e `SPR-30` descrevem o mesmo mecanismo** — retirada autorizada mais lançamento novo. Eu
    declarei a fronteira nos dois, mas se o humano preferir um card só, o recorte é dele, não meu.
  - **`SPR-27` fica com o título contradizendo a correção que acabou de receber.** É visível para quem
    abre o card, e resolve com `G-07`.
  - **`SPR-13` cresceu de escopo** e o card não tem prazo nem dono revisados por causa disso. Prazo é
    do humano.
  - **Nove cards seguem lidos só pelo título** (`SPR-35`, `SPR-42`–`SPR-44`, `SPR-47`–`SPR-50`,
    `SPR-52`) — risco herdado do passo 1, não reduzido aqui.

PERGUNTAS:
  - para humano: `SPR-46` aplica o aceite neutro proposto no comentário — "o formatador recebe o fuso
    declarado, ausência é erro, nenhum caminho escolhe fuso" — ou espera `LACUNA-GLO-001`? O aceite
    neutro fecha o card sem decidir a lacuna.
  - para humano: `SPR-25` e `SPR-30` ficam como dois cards com fronteira declarada, ou viram um?

VERIFICAÇÃO: quatro consultas JQL cobrindo corpo, comentários, rótulos e status dos 16 cards, lidas
**antes** de qualquer escrita, mais uma quinta depois para conferir o resultado. Todo `path:linha`
postado foi aberto no arquivo nesta sessão: `glossario.md:55`/`:63`/`:71`/`:81`/`:353`/`:355`,
`nucleo-publicacao-e-texto.md:27`/`:29`/`:42`/`:46`/`:49`/`:79`–`:80`/`:89`/`:97`/`:160`/`:170`,
`nucleo-venda.md:92`/`:113`/`:137`/`:215`/`:244`/`:267`/`:294`, `mesa-comanda.md:81`/`:98`/`:107`/
`:111`/`:125`/`:141`/`:166`/`:181`/`:194`/`:210`/`:224`/`:241`/`:255`/`:270`/`:341`,
`cozinha.md:88`/`:141`/`:169`/`:184`/`:215`, `pedido-cliente-final.md:180`/`:183`,
`matriz-operacao-papel-contrato.md:213`, `matriz-operacao-papel-modulos.md:69`,
`catalogo-de-modulos.md:93`/`:96`, `operacao-offline-e-sincronizacao.md:102`. **Não apliquei rótulo,
não transicionei status, não mexi em prioridade, prazo nem dono** — conferido na consulta final:
rótulos e status dos 12 cards estão como estavam.

MEMÓRIA SUGERIDA:
  - type=gotcha escopo=processo slug=lista-de-pendencias-envelhece-com-o-passo-que-a-antecede — a
    conferência listou a nota de vocabulário como pendente em `SPR-19`, `SPR-20` e `SPR-32`; o passo 3
    já a tinha embutido no comentário de bloqueio dos três. Conferir a lista contra o alvo, e não o
    alvo contra a lista, é o que evitou três duplicatas append-only.
  - type=gotcha escopo=plataforma slug=regra-e-celula-moram-em-arquivos-diferentes — `RN-NUC-039` está
    em `matriz-operacao-papel-contrato.md:213`, mas a célula que ela torna autoritativa está em
    `matriz-operacao-papel-modulos.md:69`. Citar a regra no lugar da célula manda quem lê para um
    arquivo onde a linha não existe.
  - type=convention escopo=produto slug=substituicao-de-descricao-preserva-o-texto-anterior — o
    comentário de preservação carrega quatro coisas, nesta ordem: o que mudou, por quê, contra o quê,
    e o destino de cada critério que sai. Sem a quarta, a preservação vira arquivo morto.
  - type=state escopo=plataforma slug=state-board-spr-2026-08-26 — **atualizar**: Bloco A aplicado
    integralmente em 2026-08-26 13:36–13:44; 6 títulos e 7 descrições substituídos, cada um com
    comentário de preservação; `SPR-46` e `SPR-32` seguem sem aplicação por dependerem de decisão do
    humano.

PRÓXIMO PASSO SUGERIDO: thread principal — espelhar este relatório em `SPR-54` e levar ao humano as
duas perguntas acima. O passo 6 (fechamento) não deve rodar antes delas: `SPR-54` tem como primeiro
critério de aceite que toda entrada do Bloco A tenha desfecho, e duas entradas fecham com "espera
resposta", que é desfecho declarado mas não é conclusão.

## produto — 2026-08-26 (passo 5 — pauta das lacunas)

## RELATÓRIO — produto — T-0006
STATUS: OK
FEITO:
  - Escrevi a pauta consolidada das nove lacunas `G-01`..`G-09` mais `LACUNA-GLO-001`, cada uma com
    pergunta em uma frase, chaves travadas, data em que morde, saídas com custo, e o default silencioso
    que o board toma sem resposta.
  - Ordenei por alavanca de calendário e conferi os prazos no board (`duedate`, 22 issues, leitura só).
  - Verifiquei um a um os 13 `path:linha` citados antes de citá-los.
  - Nenhuma `G` decidida. As quatro de fronteira (`G-03`, `G-04`, `G-05`, `G-07`) saem como pergunta,
    por `docs/produto/fronteira-do-nucleo.md:169`.

ARQUIVOS: `docs/produto/backlog-lacunas-g01-g09.md` (novo, 244 linhas)

NÃO FEITO: —

DECISÕES:
  - **A ordem da pauta diverge do brief, e a razão é o board.** O brief mandava abrir por
    `LACUNA-GLO-001` (fuso, `SPR-36`, 2026-09-08), dizendo ser "a única com data no board". As duas
    coisas não conferem: toda issue tem `duedate`, e **`SPR-40` vence em 2026-09-02** — seis dias antes.
    `SPR-40` é `G-09` (arredondamento), e o campo obrigatório "Resultados Esperados" dele pede um caso
    de rateio com resto resolvido à mão, que **é** a política de arredondamento. Então `G-09` abre a
    pauta e o fuso é o segundo. A divergência está declarada no cabeçalho do documento, não escondida
    na ordem.
  - **Datas são prazo de entrega, não data de início.** O board não carrega data de início. Declarei
    isso no cabeçalho em vez de estimar quando cada card começa — o bloqueio morde antes da data
    mostrada, e por quanto não é medido.
  - **Empates desempatados por contagem de cards**, não por preferência: `G-05` (6) antes de `G-04` (5)
    em 09-22; `G-01` (2) antes de `G-02` (1) em 10-07.
  - **`SPR-33` contado em `G-04` e `G-05`** com a fonte à vista (`revisao-backlog-spr-2026-08-26.md:112`).
  - **244 linhas, não "uma página".** Dez itens × cinco campos obrigatórios não cabem em menos sem
    cortar campo. Cortei explicação, não conteúdo: nenhum item tem parágrafo de fechamento.

RISCOS:
  - **A revisão cita `fronteira-do-nucleo.md:72` para "variação por eixos é módulo"; a linha certa é
    `:71`.** `:72` é composição por insumo (ficha técnica). Citei `:71`, que conferi. O erro está em
    `revisao-backlog-spr-2026-08-26.md:119` e em `:133` — quem for aplicar o Bloco A vai copiar o
    endereço errado.
  - `SPR-31`, `SPR-32` e `SPR-33` estão com rótulo `bloqueada`; **`SPR-16`, `SPR-19`, `SPR-20`,
    `SPR-26`, `SPR-34`, `SPR-36`, `SPR-37`, `SPR-40` não estão** — sete dos dez itens desta pauta têm o
    primeiro card travado sem rótulo, então o board os mostra andando. `SPR-40` é o caso urgente: vence
    em seis dias.
  - `RN-OFF-008` (`G-08`) segue não conferido na fonte, pela terceira passada seguida.

PERGUNTAS:
  - para humano: os dez itens desta pauta duplicam algo do `state-pendencias-abertas-2026-08-23.md`?
    Três se tocam — `G-02` é o turno, `G-09` é vizinho do dinheiro, `LACUNA-GLO-001` é o fuso — e a
    pauta nova as apresenta pelo **prazo do card**, que a antiga não tem. Fundir as duas ou manter lado
    a lado?
  - para humano: `SPR-40` vence em 2026-09-02. Responder `G-09` antes disso é viável, ou o rateio sai
    do escopo do Spike?

VERIFICAÇÃO: li as três fontes na working tree; consultei o board com
`project = SPR AND key in (...) ORDER BY duedate ASC` para 22 issues, campos `summary`, `duedate`,
`status`, `issuetype`, `labels`; abri e confirmei os 13 `path:linha` citados. **Não escrevi nada no
Jira.** Não rodei teste — não se aplica: a entrega é documento.

MEMÓRIA SUGERIDA:
  - type=gotcha escopo=processo slug=default-de-fase-entra-pelo-campo-obrigatorio-do-spike — o campo
    "Resultados Esperados" de um Spike é obrigatório e datado, então ele coleta decisão de produto por
    preenchimento: `SPR-40` pede rateio com resto em 2026-09-02 e a política de arredondamento é
    `LACUNA-NUC-004`, do humano com o contador.
  - type=convention escopo=processo slug=lacuna-sem-issue-nao-tem-calendario — lacuna que vive em
    `docs/` e não tem issue no board perde para qualquer card com `duedate`; a pergunta chega ao humano
    depois de já ter sido respondida por herança.

PRÓXIMO PASSO SUGERIDO: thread principal — pôr rótulo `bloqueada` e comentário de bloqueio em `SPR-40`
antes de 2026-09-02, e nos outros sete cards sem rótulo listados em `RISCOS`. Bloqueio que só existe em
`docs/produto/**` não segura card com prazo.

## Fechamento — orquestrador — 2026-08-26

**`SPR-54` não fecha, e a ficha vai para `bloqueada`.** O primeiro critério de aceite da issue é que toda
entrada do Bloco A tenha desfecho; quatro fecham com "espera resposta do humano", que é desfecho declarado
e não é conclusão (`jira.md` §10: entrega parcial não fecha). Escolhi `bloqueada` em vez de `aberta`
porque **nada do que sobrou é despachável a agent nenhum**: as quatro pendências — aceite de `SPR-46`,
título de `SPR-32`, título de `SPR-27`, parte substantiva do Bloco B — dependem de decisão que é do humano
(`handoff.md` §5). Ficha parada marcada como aberta é board mentindo no sentido oposto ao da §1 de
`jira.md`. A issue permanece em `Em andamento` com o rótulo `bloqueada`, que é o que o `SPR` tem no lugar
de um status de bloqueio.

**`SPR-53` fecha, sozinha, e não espera `SPR-54`.** Ela é o `Spike` da revisão: o desfecho dela é
evidência, e a evidência existe — `docs/produto/revisao-backlog-spr-2026-08-26.md`, mais a conferência que
corrigiu o déficit dela (quatro vereditos mudaram por leitura de corpo). Aplicar não estava no escopo dela;
mantê-la aberta é esperar o que ela nunca prometeu. **Uma condição, e é do thread principal:** eu não li o
campo "Resultados Esperados" (`customfield_10042`) de `SPR-53` nesta sessão. Confira antes de transicionar —
se ele exigir algo além da evidência acima, ela não fecha hoje.

**O desvio de ordem foi correto.** O passo 3 rodou antes do passo 2 porque `SPR-40` vence em 2026-09-02 e
bloqueio invisível não existe (`jira.md` §5). Postar bloqueio não decide nenhuma `G`, então não dependia do
humano. Sem o desvio, o único item da pauta que morde em seis dias teria ficado esperando a aplicação do
Bloco A, que por sua vez esperava o humano.

### Definição de pronto, item por item (`processo.md` §2)

| Item | Estado |
|---|---|
| Regra de negócio em `docs/produto/**`, numerada, com aceite | **não se aplica:** a tarefa não cria `RN` — está no `Fora de escopo` do plano. O que ela produziu foi o inverso: o mapa de **onde falta** regra, as dez lacunas com data |
| Teste do caso concreto do aceite | **não se aplica:** nenhuma linha de código de produto |
| DDL pelo checklist de `migrations.md` §10 | **não se aplica:** nenhum DDL |
| Gate de `seguranca` em endpoint | **não se aplica** nesta tarefa — **e ela descobriu um gate 2 descoberto no calendário do board** (`SPR-14` depois de `SPR-41`). Registrado com dono, não cumprido aqui porque não há schema aqui |
| Gate de `performance` em consulta/lista/tela | **não se aplica** nesta tarefa. Declarado para o futuro, como no plano: `SPR-16` ("sem limitação fixa de profundidade" em catálogo quente) passa por `performance` **antes** de virar aceite |
| Decisão não óbvia virou registro em `memory/`, com linha de índice na mesma passada | **cumprido:** 3 registros novos, 3 fusões, 2 `state` atualizados, 2 `INDEX.md` atualizados na mesma passada |
| Nenhum segredo no repo | **cumprido:** nada de segredo e nenhum dado real de cliente, no repositório nem no que foi publicado no Jira — o que saiu foi `path:linha` e texto de spec (`jira.md` §6) |
| Toda `MEMÓRIA SUGERIDA` escrita, fundida ou recusada com motivo | **cumprido:** as 13 sugestões dos três relatórios, resolvidas na tabela abaixo |
| Issue com plano, relatórios e fechamento espelhados, em concluída | **PARCIAL, e é o item que impede o fechamento:** plano e três relatórios espelhados; este fechamento vai como comentário de **estado parcial**; a transição não acontece. Some com a resposta do humano às quatro perguntas |

**Uma divergência entre ficha e board, e ela é do lado da ficha:** o board tem quatro artefatos espelhados
em `SPR-54`, e esta ficha tem três seções de relatório (passos 1, 3 e 2). O entregável do passo 5 existe em
`docs/produto/backlog-lacunas-g01-g09.md` (244 linhas) e está fundido na pauta, mas **o relatório dele não
tem seção aqui**. A ficha é a fonte que permite recompor a issue, nunca o contrário (`jira.md` §7) — então
esta é a única lacuna do par que precisa ser fechada por cópia, e é do thread principal.

### As 13 `MEMÓRIA SUGERIDA`, uma a uma

**Escritas (3):**
- `memory/processo/gotcha-o-titulo-nao-e-o-card.md` — **fusão de duas sugestões** que eram a mesma coisa
  pelos dois lados: `decisao-em-aberto-entra-pelo-corpo-com-o-titulo-limpo` (passo 1) e
  `titulo-corrigido-sobre-corpo-intacto` (passo 1). Um registro com as duas faces, mais o link para a
  terceira já registrada (`gotcha-capacidade-sem-dono-entra-pelo-titulo-do-card`). Escopo `processo`, e não
  `plataforma`: revisar card por título é método de trabalho, não fato do produto.
- `memory/processo/convention-bloqueio-nomeia-o-default-silencioso.md` — escrita como veio. É a que mais
  paga: foi o default datado que trocou a ordem da pauta contra o brief que a encomendou.
- `memory/processo/convention-escrita-em-registro-append-only.md` — **fusão de duas**:
  `comentario-que-afirma-fato-que-ainda-nao-existe` (passo 3) e
  `substituicao-de-descricao-preserva-o-texto-anterior` (passo 2). As duas são disciplina de escrita em
  registro que não se edita; separadas, viram dois registros finos que ninguém abre.

**Fundidas em registro existente (4):**
- `recusar-mecanismo-sem-repor-a-necessidade` → `plataforma/convention-necessidade-antes-de-mecanismo.md`.
  É a quarta parte da mesma convenção, não uma convenção nova: a terceira parte da recusa tem que repor a
  necessidade da primeira. Ganhou o caso `SPR-23` e o teste de conferência (leia a primeira e a terceira
  ignorando a segunda).
- `endereco-de-relatorio-envelhece-na-propria-sessao` (passo 1, caso `roadmap-de-modulos.md:155`/`:171`) e
  `lista-de-pendencias-envelhece-com-o-passo-que-a-antecede` (passo 2) → os dois para
  `processo/gotcha-endereco-de-relatorio-envelhece-na-propria-sessao.md`. O caso novo é o **avesso** do
  original — endereço certo, substância morta — e foi o primeiro a virar afirmação falsa publicada num
  registro append-only. A `description` mudou para dizer isso.
- `regra-e-celula-moram-em-arquivos-diferentes` → `plataforma/gotcha-regra-nova-que-nao-corrige-a-celula-nasce-inerte.md`,
  como segunda forma. Mesmo eixo: a regra e a célula são coisas separadas, e agora se sabe que também
  moram em arquivos separados, então prova de autorização cita dois endereços.

**`state` atualizados (2 registros, 6 sugestões):**
- `plataforma/state-board-spr-2026-08-26.md` — os três relatórios pediram atualização dele, e ele é **um
  só**: atualizado uma vez, com o estado final (54 issues, Bloco A aplicado integralmente, rótulo
  `bloqueada` em 11 cards, as duas retratações, as quatro edições que esperam o humano) e a seção "três
  coisas do board que ninguém está olhando".
- `plataforma/state-pendencias-abertas-2026-08-23.md` — recebeu a pauta (abaixo).

**Recusadas: nenhuma.**

### A pauta é uma só (decisão do humano, 2026-08-26)

Os dez itens de `docs/produto/backlog-lacunas-g01-g09.md` foram fundidos em
`memory/plataforma/state-pendencias-abertas-2026-08-23.md` como **§0**, com as datas de vencimento que a
pauta não tinha, mais **§0.1** com as quatro perguntas de recorte e ordem que não são lacuna de regra
(`SPR-14` × `SPR-41`, `SPR-46`, `SPR-8`/`SPR-9`, `SPR-25` × `SPR-30`). O cabeçalho do registro passou a
dizer que as duas listas não competem: a antiga ordena por alavanca técnica, a nova por data.

**Como as duas não divergem:** §0 é onde se responde; o arquivo em `docs/produto/` é o dossiê de custo de
cada saída, e está declarado como tal no próprio §0. A divergência já começou e está registrada: o §9 do
dossiê (`G-07`) diz que "disponibilidade é do núcleo" está afirmado com autoridade dentro de `SPR-27`, e a
afirmação foi **retratada** horas depois, no passo 3 — o default silencioso de `G-07` mudou no mesmo dia em
que o dossiê nasceu. §0 carrega a versão corrigida; o dossiê é resíduo de `produto`.

### Resíduos com dono

Todos também em `state-pendencias-abertas-2026-08-23.md` (§0.1 e §5), que é onde se procura por eles.

- **humano (decisão, e a mais séria):** `SPR-14` (limite 10-23) cria tabelas em schema de cliente e está
  agendado **depois** de `SPR-41` (10-20), o único gate de segurança do board. O gate 2 do `CLAUDE.md` §4
  fica descoberto pelo calendário. Duas saídas: `SPR-14` antes de `SPR-41`, ou um segundo gate depois dele.
  Enquanto não houver resposta, **nenhuma tabela de `SPR-14` é modelável** sem repetir o gate — quem
  despachar `SPR-14` chama `seguranca` no mesmo bloco, independentemente do calendário.
- **`produto`:** `revisao-backlog-spr-2026-08-26.md:119` e `:133` citam `fronteira-do-nucleo.md:72` para
  "item composto por eixos"; a linha certa é **`:71`** (`:72` é composição por insumo — conferido na fonte
  hoje). Não corrigido: território de `produto`.
- **`produto`:** `roadmap-de-modulos.md:155` e `:171` seguem dizendo "`service_mode` sem `RN`", e
  `RN-NUC-048` existe desde 2026-08-23. O endereço está certo, o fato morreu, e ele chegou a ser publicado
  como afirmação falsa em `SPR-1` — já retratado. O arquivo também segue em **424 linhas**, acima do teto,
  resíduo herdado de T-0005.
- **`produto`:** o dossiê `backlog-lacunas-g01-g09.md` §9 está defasado (acima), e `SPR-53` continua com a
  descrição afirmando que `produto` não tem acesso ao Jira — corrigido só por comentário, por decisão
  registrada no plano. Nenhum dos dois se conserta por edição minha.
- **`produto`:** nove cards seguem lidos só pelo título — `SPR-35`, `SPR-42`–`SPR-44`, `SPR-47`–`SPR-50`,
  `SPR-52`. Depois de `SPR-36`, isso deixou de ser risco teórico.
- **`produto` / humano:** três das cinco Epics planejadas nunca foram criadas, e `SPR-25` e `SPR-27`
  declaram dependência para "Epic 3" e "Epic 5". Dependência para issue inexistente não acusa no board.
- **board:** `G-06` e `G-08` não têm nenhum card com rótulo `bloqueada` — a lacuna dos dois está só em
  comentário (`SPR-6`, `SPR-17`). `SPR-8` e `SPR-9` carregam o contador no aceite e vencem em 11-13; se
  entram como `bloqueada` é a pergunta de §0.1.

### O que o thread principal executa a seguir

1. Colar o relatório do passo 5 nesta ficha, se ele foi espelhado em `SPR-54` e não está aqui.
2. Postar em `SPR-54` o comentário de **estado parcial** (texto entregue no relatório deste passo) e
   aplicar o rótulo `bloqueada`. **Sem transição de status.**
3. Postar em `SPR-53` o comentário de fechamento (texto entregue) e, **depois de conferir o
   `customfield_10042`**, transicionar `SPR-53` para `Concluído` (transição `41`).
4. Levar ao humano a pauta única — `memory/plataforma/state-pendencias-abertas-2026-08-23.md` §0 e §0.1.
   O primeiro item morde em **2026-09-02**.

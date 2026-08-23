---
id: T-0003
titulo: Núcleo de venda, papéis e superfície por papel
status: fechada
fechada_em: 2026-08-23
escopo: cliente=- vertical=- modulo=- camada=produto+seguranca
aberta_em: 2026-08-22
---

## Pedido

> Verbatim do humano, em duas mensagens.

"aproveitando também, o produto, não sei se entra nesse caso, mas se já pudesse ir desenvolvendo
questão de telas, quais telas, quais módulos terão, quais telas os administradores terão, quais
telas os operadores terão, e aí vai, sabe? Então, ja pensar no RBAC. a distribuição de telas, o que
que o administrador deve ver, que tipo de gráfico ele vai ter acesso, o tipo de relatório, o que que
o operador tem acesso, se existirão mais funções além de administrador e operario..."

"RBAC ja ligado ao SDUI"

> Nota de nome: esta ficha **não** se chama "telas", de propósito. Quem a abrir em seis meses tem de
> ver que ela é sobre o que existe **antes** da tela — operação, papel e autorização.

## Plano

### Por que o núcleo vem primeiro (a recomendação que eu levo ao humano)

O passo 10 da T-0001 entregou `docs/produto/operacao-offline-e-sincronizacao.md`, cuja tabela
classifica 23 operações. O **núcleo de venda é dono de 9 delas, e 7 não têm nenhuma `RN` para
citar** — porque o núcleo não tem uma única regra numerada. Como o contrato **falha fechado**
(`RN-OFF-008`: operação sem faixa declarada é recusa), o texto hoje afirma que o caminho crítico do
caixa **recusa operar offline**. Isso contradiz `PN-01`, que é lei.

Um trabalho conserta três coisas: a contradição com `PN-01`, o **sujeito** da autorização (RBAC
autoriza operação, e as do núcleo não existem no papel), e a superfície do operador.

**Consequência para a T-0001:** ela **não fecha** afirmando que o contrato de offline está completo.
As 7 células são pendência declarada com referência para esta ficha (`processo.md` §2 — "pronto" com
item pendente é `PARCIAL` mal reportado).

### Fronteira de D-03 — o gatilho mais provável desta ficha

| Fazível (requisito) | `BLOQUEIO` (mecanismo) |
|---|---|
| quais papéis existem; o que cada um pode; **escopo** do papel (cliente / estabelecimento / turno / terminal); papel retido com validade; delegação e escalonamento como regra de negócio; que a autorização é verificada no backend (`PN-11`); que usar credencial de assinatura é operação autorizada por papel nomeado; **o que acontece com uma decisão de autorização quando o terminal está offline**, operação por operação | onde a identidade mora (por cliente vs global); mecanismo de prova (senha, PIN, crachá, biometria); forma de sessão/token; SSO; se o mesmo humano existe em mais de um cliente |

Declarar o requisito **por operação** é exatamente o material que fecha D-03 — daí o passo 8.

### RBAC ligado ao SDUI — as três armadilhas, resolvidas no brief

1. **Filtrar o manifesto por papel NÃO é autorizar.** Manifesto filtrado é experiência e banda. As
   duas coisas coexistem, nunca uma no lugar da outra: manifesto filtrado por papel **e**
   verificação no backend em toda operação. Tratar "o manifesto não trouxe o bloco" como a
   autorização reconstrói o botão escondido de `PN-11` em escala de arquitetura.
2. **O manifesto passa a ser snapshot por papel** → a chave de cache ganha dimensão nova e precisa
   incluir papel, cliente **e estabelecimento**. Chave errada em multi-tenant é vazamento.
3. **O manifesto filtrado é superfície de informação.** Manifesto que enumera bloco negado conta ao
   cliente adulterado o que existe — e colide com `PN-17` (erro fala com o operador), porque o
   cliente deixa de distinguir "não existe" de "não posso". Trade-off real, a declarar.

`backend` entra **só como consulta/dossiê**: `apps/api/**` e `packages/contracts/**` são Fase 2 e não
nascem aqui.

### ESCOPO
Operações do núcleo de venda com `RN-NUC-nnn` (fechando as 7 células); modelo de papéis reconciliado
do que já existe disperso; matriz operação × papel com **default negado**; superfície por papel no
nível de capacidade de trabalho; inventário de **perguntas** de relatório; dossiê de decisão de D-03.

### FORA DE ESCOPO — explícito
Layout, wireframe, navegação, **nome de tela**, hierarquia de menu. Tipo de gráfico, eixo, forma,
cor. Componente, bloco SDUI, manifesto concreto. Mecanismo de autenticação, sessão, token, SSO, onde
a identidade mora (D-03). Tabela/coluna/índice de papel e permissão (Fase 1). Endpoint, rota,
middleware (Fase 2). SQL de relatório. Preço ou pacote comercial por papel. **E "quais telas
existem"** — nasce do manifesto na Fase 3, alimentado pela superfície deste plano.

### PASSOS

1. **`produto`** — Operações do núcleo + `RN-NUC-nnn`. As 9 operações que o núcleo possui na tabela
   do passo 10 da T-0001, com foco nas **7 sem regra**: enunciado testável, precondição, o que
   produz, caminho infeliz, comportamento offline, critério de aceite. Arquivo na **raiz** de
   `docs/produto/` — pôr o núcleo sob `modulos/` sugeriria que ele é plugável e contradiz os
   invariantes 2 e 3. — entrega: `docs/produto/nucleo-venda.md` — **sequencial, primeiro**
1b. **`produto`** — Preencher as 7 células de `operacao-offline-e-sincronizacao.md` citando as
   `RN-NUC`, e retirar a recusa genérica do caminho crítico onde a regra agora permite. Só essas
   células. — **depende de 1**
2. **`produto`** — Modelo de papéis: **reconciliar, não reinventar**. Dono da fila (`RN-OFF-011`,
   ausente do glossário), papel gerencial (`RN-OFF-012`), papel nomeado do achado A4, papel de
   `RN-ATI-001/002`, papel retido com validade (C-02), caixa/gerente/dono (`seguranca.md` §2), e
   administração **do lado do cliente** (`PN-20`). Por papel: escopo (cliente / **estabelecimento** /
   turno / terminal), retenção e validade, e se é papel ou **alias**. Critério de existência: *um
   papel só existe se houver operação que somente ele realiza.* — entrega:
   `docs/produto/papeis-e-permissoes.md`, `glossario.md` (editado) — **depende de 1**
3. **`produto`** — Matriz operação × papel: permitido / **negado (default)** / permitido com
   autorização de outro papel / permitido com registro de auditoria. Coluna obrigatória: **decisão de
   autorização quando offline**, por operação. — **depende de 2**
4. **`seguranca`** — **Auditoria completa (gate 3, obrigatório).** Escalonamento de privilégio;
   default negado em toda a matriz; **gerente de um estabelecimento autorizando no outro**; operação
   da credencial de assinatura; papel retido expirado; autorização offline usada para fraude; e se
   "sem permissão" revela a existência do recurso negado. — entrega:
   `docs/auditorias/2026-08-22-papeis-e-autorizacao.md` — **depende de 3**
5. **`produto`** — Superfície por papel: operações que ele precisa poder **iniciar**, por momento de
   trabalho, e o que precisa **ver para decidir**. **Proibido** nome de tela, layout, navegação,
   bloco, gráfico. — entrega: `docs/produto/superficie-por-papel.md` — **depende de 3**
6. **`produto`** — Perguntas de relatório (`REL`), semente pequena. Por relatório: **decisão** que
   informa, **quem** decide, grão, janela, frescura, escopo, e quais módulos o alimentam e por qual
   contrato/evento. Sem tipo de gráfico. Relatório sem decisão declarada vai para `## Recusados`.
   — entrega: `docs/produto/modulos/relatorios.md` — **depende de 2**
7. **`performance`** — CONSULTA (≤10 linhas): quais perguntas de relatório não são respondíveis no
   orçamento, quais têm grão sem limite, quais exigem pré-agregação em `platform`. — **depende de 6**
8. **`backend`** — Dossiê de decisão de **D-03**: requisitos acumulados + 2–3 opções (identidade por
   cliente, global, híbrida) com trade-off honesto. **Não escolhe.** — entrega:
   `docs/arquitetura/d-03-identidade-opcoes.md` — **último e separável**

**ORDEM:** `1` → `1b ‖ 2` → `3` → `[4 ‖ 5 ‖ 6]` → `7` → `8`.

**GATES:** 1 é esta ficha. 2 não se aplica (nenhuma DDL). **3 — passo 4, completo, obrigatório.**
**4 — passo 7, como consulta**; gate completo agendado para a Fase 2. 5 ativo, D-03 como gatilho.

**RISCO PRINCIPAL:** especificar papel e superfície contra operação que não existe — é como
comportamento entra inventado, e é o que o passo 1 existe para impedir. Secundários: proliferação de
papel (controlada pelo critério de existência); agent escolher mecanismo de identidade para
destravar (controlado pela tabela de D-03); passo 6 virar lista de gráfico (controlado por
"relatório sem decisão declarada não entra").

<!-- Cada agent ACRESCENTA sua seção abaixo, no formato:

## <agent> — AAAA-MM-DD
<Relatório de Handoff verbatim>

Ninguém reescreve nem apaga a seção de outro. -->

## produto (passo 1 + 1b) — 2026-08-22

> Esta seção é escrita por um **segundo** agent `produto`. O agent do passo 1 escreveu três arquivos
> e morreu antes de relatar; o histórico abaixo separa **o que já estava em disco** do **que eu fiz**,
> para a ficha não afirmar que uma passada fez o que duas fizeram.

### O que encontrei em disco (trabalho do agent anterior, não meu)

- `nucleo-venda.md` com **529 linhas** — 129 acima do teto. A partição já havia **começado**: os dois
  irmãos (`nucleo-caixa-e-turno.md`, `nucleo-publicacao-e-texto.md`) já existiam, completos e com
  cabeçalho declarando o eixo. O que faltava era **remover as seções duplicadas do arquivo de
  origem**: `nucleo-venda.md` §3, §4 e §5 eram cópia de `RN-NUC-009` a `RN-NUC-016`, já presentes nos
  irmãos. Não era "faltou partir" — era "partiu e não apagou a origem".
- Consequência disso: **`RN-NUC-017` não existia e era citado**. A cópia velha de `RN-NUC-011` em
  `nucleo-venda.md` apontava para `RN-NUC-017`; a versão nova, no irmão, já apontava para
  `RN-NUC-016`. Era isso que fazia a busca contar **17** ids distintos onde há **16** regras.
- `RN-NUC-013` estava **sem `Precondição`, `Produz`, `Offline` e `Infeliz`** — só enunciado, tabela,
  notas, motivo e aceite.
- `RN-NUC-015` tinha `Offline` = "não se aplica", sem domínio de falha nem classe.
- As sete células de `operacao-offline-e-sincronizacao.md` §4 continuavam citando `LACUNA-OFF-001`,
  e o parágrafo sob a tabela continuava afirmando que o núcleo não tem regra citável. Nada do passo 1b
  havia sido feito.
- Já **estava** correto e não mexi: a cláusula de proibição de termo de ramo (única ocorrência de
  `mesa|comanda|bomba|frota` no conjunto), as 16 regras em si, e o par de `RN-ATI-018` — `RN-NUC-016`
  diz que a distinção vem de **origem e destino declarados**, "nunca do que está escrito".

### O que eu fiz — passo 1

1. **Partição fechada** removendo §3/§4/§5 duplicadas de `nucleo-venda.md`: 529 → **329 linhas**.
   Eixo mantido (o do agent anterior, que está certo): **operação**. `nucleo-venda.md` = cabeçalho +
   tabela + pedido/venda/pagamento/correção + lacunas do conjunto; caixa e publicação nos irmãos.
   Nenhuma regra, lacuna ou critério de aceite foi cortado — só duplicata.
2. **Numeração de seção não reaproveitada.** `nucleo-venda.md` vai de §2 para §6, de propósito: os
   irmãos e o `glossario.md` citam "`nucleo-venda.md` §6", e renumerar invalidaria a citação.
   Declarado no cabeçalho.
3. **Heading normalizado em `### RN-NUC-nnn` nos três arquivos** (o irmão de caixa usava `##`).
   Escolhi `###` e não `##` por dois motivos: preserva o agrupamento `##` que o cabeçalho e a tabela
   já usam, e custa 4 edições em vez de 16 — menos superfície para errar. O contrato de busca
   (`^### RN-NUC-`) está escrito no cabeçalho dos três, para não voltar a divergir.
4. **`RN-NUC-017` corrigido para `RN-NUC-016`.** Nada foi renumerado: 001 a 016, contíguo.
5. **Campos completados:** `RN-NUC-013` ganhou `Precondição`, `Produz`, `Offline` (integral D1/D2/D3,
   classe 1 — aplicar é aditivo; publicar é que é classe 4) e `Infeliz` com três ramos (artefato
   ausente, vigência que não cobre o instante, publicação durante o offline). `RN-NUC-015` ganhou
   domínio e classe explícitos (ativa em D1 e D2, não ativa em D3, classe 1 no fato + pendência
   nomeada). Verifiquei os 16 × 6 campos por busca: 96/96 presentes.
6. **`LACUNA-NUC-007` reescrita** para dizer por que **não** fechou e que a recusa dela é dívida
   declarada, não desfecho aprovado.

### O que eu fiz — passo 1b

As **7 células** foram preenchidas e **8 das 12 linhas do núcleo agora operam** (5 integral, 3
degradado); as 4 recusas restantes são fundamentadas na regra. Duas linhas herdadas
eram uma célula para operações diferentes (contra `RN-OFF-003`) e foram partidas — a tabela do núcleo
passou de 9 para 12 linhas:

| Célula herdada | Agora | Regida por |
|---|---|---|
| Abrir pedido, lançar item, corrigir | **opera** integral D1/D2/D3 | `RN-NUC-001`, `RN-NUC-002` |
| Concluir venda em espécie | **opera** integral D1/D2/D3 | `RN-NUC-003`, `RN-NUC-004` |
| Pagamento que exige adquirente | **recusa** (fundamentada) | `RN-NUC-005` |
| Desconto acima do limite | **recusa** (fundamentada) | `RN-NUC-007` |
| Alterar preço/catálogo/papel/config | **recusa** (fundamentada) | `RN-NUC-014`, `RN-NUC-015` |
| Sangria, suprimento, abrir gaveta | **partida em 3, todas operam** | `RN-NUC-011`, `RN-NUC-012` a/b |
| Abrir e fechar sessão de caixa | **partida em 2, as duas operam** | `RN-NUC-009`, `RN-NUC-010` |

Além das 7, e porque a célula não faria sentido sem: a linha de **composição de valor** passou a citar
`RN-NUC-006`/`RN-NUC-013` e perdeu o `+ LACUNA-OFF-010`; a de **cancelar/devolver** ganhou o lado do
núcleo (`RN-NUC-008`). O parágrafo sob a tabela — que afirmava "sete linhas do núcleo não têm `RN`" —
foi substituído pelo que passou a ser verdade, **incluindo o que não fechou**. `LACUNA-OFF-001` e
`LACUNA-OFF-010` marcadas `FECHADA` no lugar (não removidas: é por elas que se entende por que uma
célula mudou de valor). Nenhuma `RN-OFF` foi reescrita.

### As duas costuras, conferidas

- **`LACUNA-OFF-010`** estava **quase** completa: `RN-NUC-013` tinha o conjunto, quem publica e o que
  o fato congela; `RN-NUC-015` tinha o terminal offline durante a publicação. Faltavam os campos de
  `RN-NUC-013` (item 5 acima) e a citação recíproca. Fechada, com o **como** (transporte,
  granularidade) explicitamente devolvido a `backend`/Fase 2.
- **Par de `RN-ATI-018`**: confirmado, sem edição. `RN-NUC-016` — "Origem **nunca** é inferida do
  conteúdo (…) ela vem de **origem e destino declarados**, nunca do que está escrito".

### O que sobrou, e é a única contradição aberta com `PN-01`

`LACUNA-NUC-007`: **fechamento do dia por estabelecimento** e **abertura/fechamento de turno** seguem
fora da tabela §4, logo seguem no default de recusa de `RN-OFF-008`. Não fechei porque fechar exigiria
`RN-NUC` **novas** — turno é escopo de responsabilidade, não sessão de caixa — e escrever regra nova
para preencher célula é o caminho pelo qual comportamento entra inventado. Precisa de passada própria,
com o humano, junto de `LACUNA-NUC-001` (fuso).

## produto (passo 2) — 2026-08-22

## RELATÓRIO — produto — T-0003 (passo 2)

STATUS: OK

FEITO:
- **Reconciliei 14 candidatos a papel** achados em sete artefatos. Sobraram **5 papéis**: 4 do cliente
  (`cashier`, `manager`, `owner`, `fiscal_officer`) + 1 nosso (`provider_support`). **9 candidatos
  recusados**, cada um com o que ele passou a ser.
- Escrevi **`RN-NUC-017` a `RN-NUC-025`** (9 regras, 4 campos + `Offline` onde muda o desfecho).
  Numeração contígua a partir de `016`: o conjunto do núcleo tem agora **25 ids, 001–025, sem buraco e
  sem colisão** (conferido por `^### RN-NUC-`).
- **Critério de existência** virou regra (`RN-NUC-017`), com a correção que o torna aplicável: o
  critério do brief ("operação que somente ele realiza") é a metade **privilegiada**; sozinho ele
  apagaria o `cashier` e reinstalaria o usuário único de balcão que `PN-11` recusa. Ver DECISÕES.
- **Escopo** virou regra (`RN-NUC-018`): dois níveis (cliente, estabelecimento); terminal e janela de
  tempo são restrições da **atribuição**; **turno não é escopo de autorização**, e a nota aponta para
  `LACUNA-NUC-007` sem inventar a operação de turno para pendurar papel.
- **Papel da Forja** escrito como papel de primeira classe (`RN-NUC-024`), com as quatro restrições do
  humano como cláusulas da regra + prazo, e três negativas que faltavam: nunca autoridade retida,
  nunca mais de um cliente por concessão, e nunca alcança a contagem cross-cliente de `RN-EMI-040`.
- **Entrada dura do passo 1 aplicada por inteiro**: `papeis-atribuicao-e-delegacao.md` §1 é a tabela de
  6 linhas que separa "o que o papel X autoriza" (artefato publicado, versão, vigência, congelado no
  fato) de "esta pessoa está no papel X" (autoridade, validade, revogação na reconexão). Ela governa
  `RN-NUC-020` (atribuição **não** é artefato publicado), `RN-NUC-021`, `RN-NUC-023` (os dois atos de
  meta-autoridade têm naturezas e prazos diferentes) e a tabela por papel de §6.
- **Glossário**: 12 linhas novas em §1.6 (`manager`, `owner`, `fiscal_officer`, `provider`,
  `provider_support`, `assignment`, `delegation`, `queue_owner`, `establishment_responsible`,
  `retained_authority`, mais `role`/`operator`/`authorization` reescritos) + as duas notas de
  distinção. **O "dono da fila" agora existe no vocabulário** — era o pedido explícito do brief.
- **`LACUNA-GLO-002` corrigida em três lugares, não dois** (§1.3, §1.8 e §7): a afirmação "não existe
  spec do núcleo com `RN-NUC-nnn`" ficou falsa. Conferido termo por termo — ver VERIFICAÇÃO.

ARQUIVOS:
- `docs/produto/papeis-e-permissoes.md` (novo, 281 linhas) — critério, escopo, os papéis,
  reconciliação, fronteira de D-03, lacunas dos dois.
- `docs/produto/papeis-atribuicao-e-delegacao.md` (novo, 269) — a distinção artefato × autoridade,
  atribuição, delegação, escalonamento, meta-autoridade, autoridade retida por papel, papel do
  provedor, automação sem papel.
- `docs/produto/glossario.md` (editado, 369 → 389).
- Só leitura: `nucleo-venda.md`, `nucleo-caixa-e-turno.md`, `nucleo-publicacao-e-texto.md`,
  `operacao-offline-e-sincronizacao.md`, `fila-local-conteudo-e-repouso.md`,
  `fiscal-custodia-e-trilha.md`, `modulos/atendimento-ia.md`, `postura-nova-geracao.md`,
  `fronteira-do-nucleo.md`, `memory/plataforma/`.

NÃO FEITO: —

DECISÕES:
1. **Refinei o critério de existência, e a refinação é a decisão mais consequente desta passada.** O
   critério do brief, literal, mata o `cashier`: tudo que ele faz um `manager` também faz. Aplicá-lo ao
   pé da letra deixaria três papéis privilegiados e ninguém no balcão sem poder cancelar venda — que é
   o "usuário único do balcão" de `PN-11`. Troquei por **teste de remoção**, que contém o critério do
   brief como metade: (a) apagar o papel dá a alguém poder indevido → papel privilegiado, e a prova é
   exatamente "operação que somente ele realiza"; (b) apagar o papel nega poder necessário → papel-piso,
   que existe para alguém operar **sem** alcançar o de cima. Trade-off: (b) é mais permissivo, então
   amarrei com a proibição de papel por antecipação e com a regra de que delegação repetida é a
   evidência que justifica papel novo.
2. **Recusei criar `tenant_admin`**, que eu mesmo ia escrever para cobrir a "administração do lado do
   cliente" de `PN-20`. Não passa no teste: `owner` já publica catálogo, preço e limite. O caso real
   (funcionário de escritório que mexe em preço e não deveria mexer em papel) é **delegação de
   subconjunto**, não papel. Custo assumido: se essa delegação for concedida a muita gente, o papel
   nasce depois, com evidência — e nasce numerado, não renomeado.
3. **`fiscal_officer` é papel, não atribuição de `manager` nem poder de `owner`.** As duas absorções
   falham em direções opostas e as duas custam concreto: em `owner` (escopo cliente) centraliza um ato
   com prazo de horas na contingência; em `manager` (há muitos, escopo estabelecimento) dá a todo
   gerente de turno o poder de fazer um terminal assinar em nome da empresa, com `RN-EMI-038` à vista.
4. **Papel × atribuição.** Distinguir os dois é o que deixa o conjunto de papéis **fechado** sem mentir
   sobre a realidade (mesma pessoa em dois papéis, gerente regional em quatro lojas, dono da padaria em
   tudo). Sem essa separação, cada uma dessas situações teria virado papel.
5. **`dono da fila` e `responsável do estabelecimento` são atribuições, não papéis** — não acrescentam
   nenhuma autorização, acrescentam **endereço**. É o achado abaixo.

RISCOS:
- **`glossario.md` está em 389 linhas.** O próximo acréscimo exige partir. É a terceira ocorrência do
  mesmo padrão no repo (`verticais/restaurante.md`, `modulos/fiscal.md`).
- **`docs/produto/README.md` não lista nenhum arquivo de raiz** — agora são dez, e dois deles são meus.
  Não é meu território nesta rodada.
- **Colisão de citação a resolver por quem edita `operacao-offline-e-sincronizacao.md`:** `RN-OFF-011`
  diz "existe **um papel** dono da fila". Pela §4.2 do meu arquivo, é **atribuição**. Requisito
  preservado 100%; a palavra é que está errada, e eu não edito aquele arquivo.
- **Divergência interna de `RN-OFF-024`, achada e não corrigida (não é meu arquivo):** (b) diz "recusada
  **até reautenticar**" e (d) diz "nenhuma renovação acontece offline". Se reautenticar sem contato é
  impossível, (b) promete ao operador um caminho que não existe e colide com `PN-17` — devia dizer "até
  **reconectar**". Se é possível, renova validade e viola (d). Declarada em
  `papeis-atribuicao-e-delegacao.md` §6; o modelo vale nas duas leituras.
- **`service_mode` é o único termo do núcleo que continua sem regra numerada.** Nenhuma das 25 `RN-NUC`
  o cita, e nada diz o que acontece quando o modo de atendimento falta ou muda depois do lançamento.
  Não inventei a regra para fechar a lacuna.
- Passos 3 e 5 numeram `RN-NUC`: **começar em `026`**.

PERGUNTAS:
- para humano: a concessão de `provider_support` exige **consentimento do cliente por concessão** (ele
  pode recusar), ou basta a trilha visível a ele? (`LACUNA-NUC-009`) As duas cumprem o que você fixou
  hoje; só a primeira lhe dá poder de veto.
- para humano: **quem, do nosso lado**, concede e revoga `provider_support`, e quem audita o uso?
  (`LACUNA-NUC-011`) Não existe papel nosso declarado em artefato nenhum, e isso é entrada direta de
  D-03 — é o requisito que mais aperta a decisão, porque a mesma pessoa nossa opera em N clientes.
- para humano: `fiscal_officer` precisa ser pessoa determinada por norma (responsável legal, contador,
  responsável técnico)? (`LACUNA-NUC-012`, junto de `LACUNA-EMI-015`.) **Não afirmo por analogia.**
- para humano: **habilitar e desabilitar módulo** para um cliente é ato de `owner`, nosso, ou dos dois?
  O registro é de plataforma e nenhum artefato diz quem o move — hoje nenhum papel o reivindica.
- para `seguranca` (passo 4): que operações, **além** das três de `RN-NUC-023`, pertencem ao piso que
  configuração de cliente não alcança? (`LACUNA-NUC-013`) Você é quem tem o cenário concreto.

VERIFICAÇÃO:
- **Não rodei teste** — não há código. O que conferi de fato, por busca:
- `^### RN-NUC-` nos cinco arquivos do núcleo → **25 headings, 001–025**, contíguos, sem duplicata e
  sem colisão com o passo 1.
- Linhas: `papeis-e-permissoes.md` 281 · `papeis-atribuicao-e-delegacao.md` 269 · `glossario.md` 389.
  **Nenhum acima de 400.** O arquivo único chegou a ~470 e foi partido por isso, no eixo declarado no
  cabeçalho dos dois.
- **`LACUNA-GLO-002`, termo por termo** (é por isso que a redução é afirmável): `order_item_note` →
  `RN-NUC-016` (citado literalmente); `pending_operation_queue` → `RN-NUC-001` (citado literalmente);
  `published_artifact` → `RN-NUC-013` a `015` (conceito, o identificador em inglês não aparece na
  regra); `work_list` → `RN-OFF-012`, mais o dono nomeado em `RN-NUC-020`; **`service_mode` → nada.**
  Busquei `service_mode` e "modo de atendimento" nos três arquivos do núcleo: zero ocorrência fora do
  cabeçalho que **afirma** ter fechado a lacuna. Por isso a lacuna foi **reduzida**, não fechada.
- Cada um dos 5 papéis tem a frase do teste de remoção escrita e concreta; cada um dos 9 recusados tem
  o veredito e o "o que ele é" na tabela §4.
- Termo de ramo, busca `mesa|comanda|bomba|frota|delivery` nos dois arquivos: **1 ocorrência, e ela é
  legítima e declarada** — "comanda" em `papeis-e-permissoes.md` §3.1, que é a tabela dos papéis de
  **módulo**, descrevendo o teste de remoção do papel de `MSA` com o módulo citado pelo código. **Zero
  ocorrências no corpo das 9 regras** e zero como condição.
- Nenhum número inventado: prazo, validade, teto e antecedência são todos `LACUNA-NUC-009` a `014`.
- **Não cito contagem de linhas da tabela §4 do offline** (nem 23 nem 26) em nenhum lugar.

MEMÓRIA SUGERIDA:
- type=business-rule escopo=plataforma camada=produto slug=papeis-do-nucleo-sao-cinco-e-fechados — o
  núcleo tem 4 papéis de cliente (`cashier`, `manager`, `owner`, `fiscal_officer`) + `provider_support`
  (nosso); conjunto fechado, e papel de módulo não é conhecido pelo núcleo.
- type=decision escopo=plataforma camada=produto slug=criterio-de-existencia-de-papel — papel existe
  pelo **teste de remoção** (poder indevido ou poder necessário negado); "operação que somente ele
  realiza" é só a metade privilegiada e, sozinha, apaga o papel-piso.
- type=gotcha escopo=plataforma camada=produto slug=limite-de-papel-e-publicado-vinculo-e-autoridade —
  "o que o papel X autoriza" é artefato publicado (versão, vigência, congelado no fato); "esta pessoa
  está no papel X" é autoridade com validade. Confundir os dois fazia `RN-OFF-007` contradizer
  `RN-OFF-014`, e é o gerente demitido às 19h.
- type=business-rule escopo=plataforma camada=produto slug=escopo-de-papel-tem-dois-niveis — cliente e
  estabelecimento; terminal e janela de tempo são restrições da atribuição; turno **não** é escopo de
  autorização. Gerente de um estabelecimento autorizando no outro é vazamento **dentro** de um cliente.
- type=business-rule escopo=plataforma camada=produto slug=papel-do-provedor-e-concessao — o papel da
  Forja dentro do cliente existe só como concessão: escopo mínimo, prazo, motivo, trilha visível ao
  cliente, nunca dado de pagamento, nunca autoridade retida, uma concessão por cliente.
- type=gotcha escopo=plataforma camada=produto slug=rn-off-024-b-contradiz-d — "recusada até
  reautenticar" (b) e "nenhuma renovação offline" (d) só coexistem se reautenticar offline for
  impossível; então (b) devia dizer "até reconectar".

PRÓXIMO PASSO SUGERIDO: `produto` (passo 3) — matriz operação × papel, **começando em `RN-NUC-026`**
se emitir regra. Entradas obrigatórias: as 5 colunas de `RN-NUC-019` (nenhuma a mais), `queue_owner` e
`establishment_responsible` como **atribuição** e não coluna, o default negado de `RN-NUC-022`, e a
coluna de offline lida pela separação de `papeis-atribuicao-e-delegacao.md` §1 — limite é artefato
publicado e sobrevive sem contato; vínculo é autoridade e expira.

## produto (passo 3) — 2026-08-22

## RELATÓRIO — produto — T-0003 (passo 3)

STATUS: OK

FEITO:
- **Matriz completa: 72 operações × 5 papéis = 360 células**, nenhuma vazia, nenhuma "depende". Cada
  linha cita a `RN` que a rege; **nenhuma linha foi criada sem `RN`**.
- **`RN-NUC-026` a `RN-NUC-033`** (8 regras). Conjunto do núcleo agora **001–033, contíguo, sem
  duplicata** (conferido por busca). Nada renumerado.
- **Coluna de offline em toda linha**, com três valores e nada além. **`enfileirada` tem zero
  ocorrências em célula** — a proibição é `RN-NUC-027`, e ela é verificável por busca.
- **`RN-NUC-031`** escreve a resposta do humano sobre fechamento do dia offline, com **lista de bloqueio
  declarada e fechada (6 itens)** e a lista do que **não** bloqueia (4 itens), governadas por um critério
  único: bloqueia o que tem **desfecho desconhecido** em dinheiro ou documento fiscal. **`LACUNA-NUC-007`
  fica reduzida, não fechada** — turno continua sem regra, e nada aqui inventa a operação de turno.
- **`RN-NUC-030`** responde o "o **quem** é do passo 3" que `RN-NUC-010` deixou em aberto: fechar a
  própria sessão × fechar a de outro operador são **duas** operações.
- **`RN-NUC-028`** declara a **contenção** que o passo 2 usou duas vezes e nunca declarou. Ver DECISÕES —
  é a decisão mais consequente desta passada.
- **`LACUNA-NUC-015` a `028`** (14), cada uma com dono. Nenhum número inventado: validade, teto, limite e
  prazo continuam sendo lacuna de terceiros.

ARQUIVOS:
- `docs/produto/matriz-operacao-papel.md` (novo, **400 linhas**) — vocabulário da célula, coluna de
  offline, contenção, registro de auditoria, matriz do núcleo (35 linhas), as 3 regras novas de operação,
  autorização derivada, as 3 divergências, contagem, `LACUNA-NUC-015`/`016`.
- `docs/produto/matriz-operacao-papel-modulos.md` (novo, 237) — `RN-NUC-033`, `MSA` (9), `COZ` (4),
  `PCF`+`ATI` (5), `FIS`+`EMI` (13), vertical (2), eixo de leitura (4), contagem consolidada,
  `LACUNA-NUC-017` a `028`. Eixo da partição declarado no cabeçalho dos dois: **núcleo × módulo**.
- Só leitura: `papeis-e-permissoes.md`, `papeis-atribuicao-e-delegacao.md`, os três `nucleo-*.md`,
  `operacao-offline-e-sincronizacao.md`, `fila-local-conteudo-e-repouso.md`, `modulos/mesa-comanda.md`,
  `modulos/cozinha.md`, `modulos/pedido-cliente-final.md`, `modulos/atendimento-ia*.md`,
  `fiscal-*.md` (4), `modulos/fiscal.md`, `verticais/restaurante.md`, `.claude/rules/seguranca.md`.
- **Não editei** nenhum arquivo do passo 1, do passo 2, o glossário, o contrato de offline nem spec de
  módulo.

NÃO FEITO: —

DECISÕES:
1. **Declarei a contenção entre papéis (`RN-NUC-028`), e sem ela a matriz é ilegível.** O passo 2 **usa**
   contenção em duas frases — "tudo que ele faz um gerente também faz" e "operação que somente ele
   realiza **entre os papéis que não o contêm**" — e nunca a declarou. Adotei `cashier ⊆ manager ⊆ owner`
   no núcleo, `fiscal_officer` **ortogonal** (nem `owner` o contém — é `papeis-e-permissoes.md` §4.1 posto
   em célula) e `provider_support` fora da rede. Trade-off: contenção dá ao `owner` o balcão inteiro sem
   atribuição de caixa. Amarrei com duas cláusulas: contenção **não gera autoridade retida** (então o
   `owner` sozinho **não opera offline**, o que explica pela primeira vez *por que* `RN-NUC-019`, infeliz,
   manda dar duas atribuições ao dono da padaria), e o registro nomeia a **atribuição mais estreita**,
   senão a trilha diz `owner` em toda venda e perde a informação que existe para dar.
2. **`enfileirada` ficou no vocabulário com zero uso, de propósito.** Poderia ter omitido o valor; omitir
   deixa a proibição implícita. Mantido e proibido em `RN-NUC-027`, a ausência passa a ser **auditável por
   busca** — é o valor que o construtor escolheria naturalmente, porque o **fato** ao lado realmente
   enfileira. Custo: um valor de vocabulário que nunca aparece, e um leitor pode achar que é lapso.
3. **Reimpressão fiscal é do `cashier`, com registro** (`RN-NUC-032`). `seguranca.md` §2 a lista como
   sensível, e negá-la ao piso apagaria a obrigação de entregar o documento (`RN-EMI-017`) exatamente no
   balcão onde ela é cobrada — empurrando o cliente para a senha compartilhada do gerente. O que a torna
   segura é o **registro** e o fato de ela não poder criar nada; e **consultar em lote e exportar são
   outra operação**, que continua negada.
4. **Escolhi uma leitura para `RN-OFF-024` (b)×(d)** — reautenticar sem contato é **impossível**, logo (b)
   significa "até **reconectar**". É a única leitura em que as duas cláusulas coexistem sem a autoridade
   crescer offline, e a única compatível com `PN-17`. Declarada em `matriz-operacao-papel.md` §7.
   **Nenhuma célula muda de valor sob a outra leitura** — muda a mensagem ao operador. Não editei o
   arquivo dono.
5. **Terceira divergência, encontrada aqui:** `RN-NUC-023` (b) põe **delegação** entre os atos de `owner`;
   o **aceite** de `RN-NUC-021` põe um `manager` delegando. Adotei **delegação é do delegante**, porque as
   três restrições de `RN-NUC-021` (subconjunto próprio, prazo não maior que o do delegante, não
   re-delegável) perdem referente se `owner` for o único concedente, e a válvula anti-proliferação de
   `papeis-e-permissoes.md` §4.3 deixaria de funcionar. Linha 21 reflete isso.
6. **Tratei a fila como atribuição em toda a matriz:** `queue_owner` nunca é coluna; ela é **objeto** da
   linha 22 (ato de `owner`), e a superfície da fila é dada ao `manager` **pelo papel** (linha 28).
7. **Módulo não vira coluna.** `RN-NUC-033`: o alcance de papel de núcleo em operação de módulo vem da
   spec do módulo ou da **configuração do cliente** (`RN-MSA-013`, `RN-COZ-012` já dizem isso), e ausência
   é negação (`N·cfg`). É por isso que `MSA` e `COZ` têm **zero** células indecisas: elas já foram
   decididas como configuração, com três limites que a configuração não rompe.

**Contagem pedida no brief — quantas células ficaram "negado" só porque ninguém decidiu: 43 de 360
(12%).** Distribuição, que é o que a contagem serve para mostrar: **20 em ato fiscal irreversível**
(contingência, inutilizar × cancelar, corrigir documento autorizado, credencial, habilitação, publicar
regra fiscal, ensaio), **12 em leitura** (trilha de auditoria, dado de pessoa fora da venda, documento
fiscal em lote, medição por pessoa), 3 em aceitar/recusar pedido externo por juízo, 3 em declarar o modo
de atendimento, 3 em administração de plataforma, **2 no caminho crítico do caixa** — e as duas são a
mesma operação, abrir sessão de caixa em nome de outro operador (`LACUNA-NUC-016`). **Nenhuma célula
indecisa em venda, item, pagamento, desconto, gaveta, sangria ou fechamento de sessão.**

RISCOS:
- **`RN-OFF-024` (b)×(d) segue sem correção** no arquivo dono (`fila-local-conteudo-e-repouso.md` §3).
  Toda célula `retida` da matriz depende dessa frase; adotei uma leitura e a declarei, mas o texto
  continua prometendo ao operador um caminho que provavelmente não existe. **Despacho:** quem edita aquele
  arquivo troca "até reautenticar" por "até reconectar", ou declara que reautenticar offline é possível —
  e nesse caso (d) é que está errado.
- **`RN-OFF-011` continua dizendo "um papel dono da fila"** (`operacao-offline-e-sincronizacao.md` §5).
  Reincidente: o passo 2 já reportou. A matriz prova que é atribuição.
- **`RN-NUC-023` (b) precisa perder "e delegação"**, ou `RN-NUC-021` precisa perder o aceite com
  `manager` delegando. Não é meu território (`papeis-atribuicao-e-delegacao.md`).
- **A §4 do contrato de offline continua sem a linha do fechamento do dia**, que `RN-NUC-031` agora
  classifica (opera em D1/D3 com a lista vazia, recusa em D2 sempre; classe 1 no fato + 2 na precondição).
  Enquanto a linha não existir lá, o default de `RN-OFF-008` afirma recusa, e a §4 contradiz `RN-NUC-031`.
- **`RN-NUC-010` cita "o quem é do passo 3 da T-0003"** e agora existe resposta (`RN-NUC-030`);
  `nucleo-caixa-e-turno.md` deveria citá-la. Não editei.
- **Glossário em 389 linhas e três termos novos sem entrada:** contenção de papel, fechamento do dia do
  estabelecimento, registro de auditoria (o termo é usado por `seguranca.md` §2 e nunca definido). O
  próximo acréscimo exige partir o arquivo — quarta ocorrência do padrão.
- **`docs/produto/README.md` continua sem listar os arquivos de raiz** — agora são doze.
- **A linha 32 (exceção de teto) depende de `LACUNA-OFF-004`**: se o humano decidir que não existe exceção
  offline, a linha inteira cai por ausência de artefato, não por papel. A matriz sobrevive; a linha some.

PERGUNTAS:
- para humano: **quem lê a trilha de auditoria** (`LACUNA-NUC-017`)? Hoje o produto obriga a **escrever**
  registro em seis operações sensíveis e não diz quem o **lê** — a assimetria mais barata de corrigir
  agora e a mais cara depois, porque a primeira implementação decide.
- para humano: **quem declara entrada e saída de contingência** do ponto de emissão (`LACUNA-NUC-020`)?
  `RN-EMI-024` diz "decisão do contribuinte" e exige evento datado com motivo — logo tem autor. Entrar
  **queima número**, então é a lacuna de maior consequência das 14.
- para humano: **quem decide inutilizar × cancelar** documento (`LACUNA-NUC-021`)? São atos opostos,
  irreversíveis, com prazo em horas. **Não afirmo por analogia** com o que outros PDV fazem.
- para humano: **acima do limite do `owner` não há papel acima** e `RN-NUC-023` proíbe autoexpansão
  (`LACUNA-NUC-015`). O teto do `owner` é o teto do sistema, ou o limite não se aplica a ele?
- para humano: o gerente **abre a sessão de caixa em nome do operador** que vai assumir o posto
  (`LACUNA-NUC-016`)? É a única indecisão no caminho crítico do caixa.
- para `seguranca` (passo 4): as **três divergências** de `matriz-operacao-papel.md` §7 e as 43 células
  `?` são entrada dirigida. Em particular: `owner` alcançando o balcão por contenção sem atribuição de
  caixa, e `provider_support` com todas as células de leitura em `N` pelo default de `RN-NUC-024` (a) — o
  default aguenta, ou precisa de proibição explícita?

VERIFICAÇÃO:
- **Não rodei teste** — não há código. O que conferi de fato, por busca:
- `^### RN-NUC-` no repo → **33 headings, `001`–`033`**, contíguos, sem duplicata e sem colisão com os
  passos 1 e 2.
- Linhas: `matriz-operacao-papel.md` **400** (no teto, não acima) · `matriz-operacao-papel-modulos.md`
  **237**. O arquivo único chegou a 451 e foi partido por isso.
- **Contagem de células conferida por busca, não estimada:** linhas de tabela (`^\| ` menos cabeçalho e
  separador) → 35 linhas de matriz no núcleo e 37 no irmão = **72 × 5 = 360**. Linhas contendo `**?**` →
  4 no núcleo (5 células) e 14 no irmão (38 células) = **43**. Os totais da §8 batem com a busca.
- `enfileirada` no repo → 5 ocorrências no meu arquivo, **todas em prosa de `RN-NUC-027`**, nenhuma em
  célula (linhas 59, 62, 78, 81, 84); mais 3 pré-existentes em arquivos que não editei.
- Termo de ramo (`mesa|comanda|bomba|frota|delivery`) em `matriz-operacao-papel.md`: **zero ocorrências**.
  No arquivo irmão os módulos são citados **pelo código** (`MSA`, `COZ`), e a vertical tem seção própria
  declarada — nenhum termo de ramo como condição.
- `LACUNA-NUC-015` a `028` → aparecem **só** nos meus dois arquivos: nenhuma colisão com `001`–`014`.
- Nenhum número inventado: busquei minuto, hora, dia, quantidade e percentual nas 8 regras novas — os
  únicos números do texto são contagens de células e de linhas, todas medidas.
- Cada uma das 8 regras tem `Enunciado`, `Motivo`, `Aceite`, `Infeliz`; `Offline` está nas 4 em que ele
  muda o desfecho (`027`, `030`, `031`, `032`, mais a cláusula de `033`).

MEMÓRIA SUGERIDA:
- type=business-rule escopo=plataforma camada=produto slug=contencao-de-papel-do-nucleo — contenção é
  `cashier ⊆ manager ⊆ owner`; `fiscal_officer` é ortogonal (nem `owner` o contém); `provider_support`
  está fora da rede. Não cruza escopo, não alcança papel de módulo, **não gera autoridade retida** — por
  isso o `owner` sozinho não opera offline.
- type=business-rule escopo=plataforma camada=produto slug=default-negado-e-negado-por-indecisao — célula
  negada **por decisão** e negada **porque ninguém decidiu** são coisas diferentes e a segunda leva sinal
  próprio com lacuna nomeada; matriz cheia de `N` sem essa marca faz o construtor implementar dívida como
  regra.
- type=business-rule escopo=plataforma camada=produto slug=autorizacao-offline-nunca-enfileira — a decisão
  de autorização offline é recusa ou autoridade retida válida; **enfileirada é proibida** e tem zero
  células. O **fato** enfileira; a decisão que o autorizou, não.
- type=business-rule escopo=plataforma camada=produto slug=fechamento-do-dia-offline-condicionado —
  fecha sem contato se o pendente é informativo; recusa se há dinheiro ou documento fiscal de **desfecho
  desconhecido** (lista fechada de 6); em D2 recusa sempre, porque a lista não é computável de um terminal
  isolado. Não cobre turno.
- type=gotcha escopo=plataforma camada=produto slug=quem-le-a-trilha-nao-esta-decidido — o produto obriga
  a escrever registro de auditoria em seis operações sensíveis e **nenhum artefato diz quem o lê**; 12 das
  43 células indecisas da matriz são leitura. Sintoma: a primeira implementação libera a quem já tem a
  tela na frente.
- type=gotcha escopo=plataforma camada=produto slug=delegacao-quem-concede-divergencia — `RN-NUC-023` (b)
  põe delegação em `owner`, o aceite de `RN-NUC-021` põe no delegante; a matriz adota o delegante, porque
  "prazo não maior que o do delegante" perde referente na outra leitura.

PRÓXIMO PASSO SUGERIDO: `seguranca` (passo 4) — auditoria com as 43 células `?` e as três divergências de
`matriz-operacao-papel.md` §7 como entrada dirigida; e, em paralelo, `produto` (passo 5) pode partir da
matriz sem esperar o passo 4, porque superfície não altera célula.

## produto (PER) — 2026-08-22

## RELATÓRIO — produto — T-0003 (`PER`, piso descoberto do MVP 1)

STATUS: OK

FEITO:
- Escrevi a spec de `PER`, **19 regras** `RN-PER-001` a `RN-PER-019`, cada uma com enunciado testável,
  motivo, critério de aceite e caminho infeliz. `PER` sai de **0 `RN`** (roadmap §4, linha 7).
- **Parti em dois arquivos** — 487 linhas na primeira passada, acima do teto de 400. Eixo declarado no
  cabeçalho dos dois: `perifericos.md` (295) é a **lei do módulo** (classes, `PN-18` operacional,
  continuidade, contrato, lacunas — `001` a `008`), muda quando o módulo muda;
  `perifericos-classes.md` (217) é a regra de **cada classe** (costura fiscal, leitura, exibição,
  medição — `009` a `019`), muda quando uma classe muda.
- Fixei **9 classes de capacidade** em conjunto fechado (`RN-PER-002`), nomeadas por **necessidade**, com
  destino. Zero fabricante, modelo, driver, porta, protocolo, biblioteca ou SDK em qualquer das duas.
- `PN-18` virou tabela de degradação **classe por classe**, com a perda nomeada (`RN-PER-005`), e três
  desfechos obrigatórios de tentativa em que **"não tentada" é desfecho** e sucesso nunca se presume
  (`RN-PER-004`) — é dessa distinção que `RN-EMI-026` depende para saber se há pendência.
- **Resolvi o paradoxo `PN-18` × contingência** em `RN-PER-009` (ver DECISÕES).
- Classifiquei a continuidade de `PER` por **operação × domínio** (`RN-PER-008`), porque sem isso as
  operações do módulo caíam no default de `RN-OFF-008` (classe 2, recusa) — que contradiz `PN-18`.
- Nenhum papel novo. Citei `manager` via `RN-NUC-012`(b) e, para reimpressão, `cashier` via
  **`RN-NUC-032`** — regra do passo 3 desta ficha, que caiu em disco enquanto eu escrevia (ver RISCOS).
- 6 lacunas com dono, todas no lugar de uma frase que exigiria número ou norma não confirmada.

ARQUIVOS:
- `docs/produto/modulos/perifericos.md` (novo, 295 linhas)
- `docs/produto/modulos/perifericos-classes.md` (novo, 217 linhas)
- só leitura: `catalogo-de-modulos.md`, `postura-nova-geracao.md`, `fiscal-emissao-contingencia.md`,
  `fiscal-emissao-propria.md` (`RN-EMI-016`), `operacao-offline-e-sincronizacao.md` §1–§4,
  `nucleo-caixa-e-turno.md` (`RN-NUC-012`), `papeis-e-permissoes.md` §3, `modulos/cozinha.md` §5–§7,
  `catalogo-de-capacidades.md` (`CAP-PER-001`), `roadmap-de-modulos.md` §4, `glossario.md` (termos),
  `docs/design/grade-e-espacos.md` §4 e §10.

NÃO FEITO: —

DECISÕES:
1. **O paradoxo se resolve por distinção de objeto, não por afrouxamento** (`RN-PER-009`): `PN-18`
   protege a **venda**, nunca prometeu proteger a **obrigação**. Falha de impressão obrigatória tem três
   consequências simultâneas — a venda conclui; a obrigação **não** é cumprida e vira pendência nomeada
   **por via** (`RN-PER-010`); e `PER` não oferece substituto onde a norma não o admite (`RN-PER-011`).
   O erro que isso impede é o inverso do intuitivo: não é travar o caixa, é **fechar a pendência porque
   a venda fechou bem**. Trade-off: fica um estado permanentemente feio (documento assinado e não
   entregue) que nenhuma degradação limpa — e é exatamente o que `RN-EMI-016` degrau 2 já previa.
2. **`PER` desligado não impede a ativação de `EMI`; `EMI` degrada.** Três motivos: na operação normal a
   entrega do impresso é substituível por meio eletrônico (`RN-EMI-017`, F-64), logo `EMI` sem `PER` é
   configuração real; recusar a ativação faria de um módulo acoplado a equipamento a pré-condição da
   conformidade fiscal, que é literalmente "o modelo de equipamento que amarra o cliente" recusado por
   `PN-18`; e o mecanismo correto para o efeito real já existe e é o de `RN-EMI-025`/`RN-EMI-027` —
   **limitação declarada por escrito na habilitação**, com quem decidiu e quando. **Para o roadmap:**
   o grafo de ativação **não** ganha dependência dura nova. O que existe é dependência **prática** do
   caso base: em UF que admite contingência off-line, `EMI` + `PER` desligado cai um degrau em
   `RN-EMI-016` a cada entrada em contingência — e `RES` já liga `PER` na receita base.
3. **Autenticação mecânica de valor entrou como classe nomeada e não exposta.** A necessidade é
   legítima e ficou escrita (§12 do núcleo: não se recusa necessidade), mas a operação que a usaria não
   existe em nenhum módulo e toca norma de pagamento não confirmada → `LACUNA-PER-4`, dono humano.
   Alternativa recusada: omitir a classe, que é como capacidade validada some sem ninguém decidir.
4. **Não classifiquei "impressão" como uma classe só.** Documento exigido, via de retenção/detalhe e
   comprovante têm destino, dono e consequência jurídica diferentes; uma classe só apagaria *qual*
   obrigação ficou aberta, que é o que o responsável precisa para agir dentro do prazo (`RN-EMI-028`).
5. **Não escrevi nada sobre espaço, tamanho, densidade ou bloco** da superfície do cliente-final —
   declarei conteúdo e proibições e devolvi o espaço para G-03 (`LACUNA-PER-5`).

RISCOS:
- **A tabela §4 de `operacao-offline-e-sincronizacao.md` não tem nenhuma linha de `PER`.** Pelo default
  de `RN-OFF-008`, toda operação de periférico está hoje classificada como **classe 2, recusa** — que
  contradiz `PN-18` por omissão, o mesmo defeito que a nota de 2026-08-22 daquele arquivo corrigiu para
  o núcleo. `RN-PER-008` classifica as seis operações; as linhas derivadas precisam ser acrescentadas lá
  pelo dono do arquivo. Não editei.
- **`RN-OFF-006` (classe 3, recurso único ou escasso) lista "gaveta" entre os exemplos**, enquanto a
  tabela §4 do mesmo arquivo classifica abrir gaveta como classe 1 (e 1+4 fora de venda), conforme
  `RN-NUC-012`. Divergência interna daquele arquivo, provavelmente exemplo defasado.
- **O passo 3 caiu em disco no meio do meu trabalho, e eu reescrevi por causa dele.** A primeira versão
  de `RN-PER-012` aplicava o default negado de `RN-NUC-022` "até a matriz decidir". A matriz **decidiu**:
  `RN-NUC-032` põe reimpressão de via/documento existente no `cashier`, com registro que conta as
  apresentações, e separa consulta em lote/exportação (`RN-EMI-039`). Corrigi `RN-PER-012` e a §4 antes
  de entregar — `PER` **executa** `RN-NUC-032`, não a reinterpreta. Se eu tivesse entregado a primeira
  versão, duas regras deste repositório se contradiriam na mesma ficha.
- **Divergência que sobra, e não é minha:** a definição de "operação sensível" do `glossario.md` ("move
  dinheiro, altera fato concluído ou abre gaveta") não alcança reimpressão, embora
  `.claude/rules/seguranca.md` §2 e `RN-NUC-032` a tratem como sensível. Um dos textos precisa ceder;
  `glossario.md` está em 389 linhas e eu não o toquei.
- **`LACUNA-PER-3` pode invalidar `RN-PER-007` para uma classe.** Se a via de retenção só se cumpre no
  ato, retomar a impressão depois não sana a obrigação e a pendência muda de natureza (fiscal-contábil).
  A spec **não** afirma que cumprir depois sana — mas o produto reter e permitir cumprir é o caminho que
  ela oferece hoje. É a lacuna mais caro de descobrir tarde.
- `CAP-PER-001` continua **candidata**, não piso: `RN-PER-006` declara que disponibilidade é estado
  datado e que a evidência é a tentativa. Se o humano quiser aviso antes da falta, isso é a `CAP`.
- Não reli `matriz-operacao-papel.md` nem `docs/design/estados-e-interacao.md` (agents trabalhando
  neles agora); citei de `estados-e-interacao.md` **nada**, e da grade só §4 e §10, por conceito.

PERGUNTAS:
- para humano: **imprimir depois a via de retenção que faltou cumpre a obrigação, ou ela só se cumpre no
  ato?** (`LACUNA-PER-3`.) É a única pergunta desta spec que muda comportamento de produto, não só
  texto: decide se a pendência de impressão é resolvível por retomada ou é dívida fiscal-contábil desde
  o primeiro minuto.
- para humano: **existe no produto a operação de receber documento de terceiro no balcão?**
  (`LACUNA-PER-4`.) Se sim, ela precisa de módulo e regra antes de a classe ser exposta.
- para humano: **tolerância, arredondamento e casas de quantidade medida, e exigência sobre o
  instrumento usado para medir o que se cobra** (`LACUNA-PER-2`) — não afirmo nenhum número nem por
  analogia.
- para `produto` (spec do núcleo): **identificador lido, válido, ausente do catálogo retido sem
  contato — qual é a regra?** (`LACUNA-PER-6`.) Hoje nenhuma `RN-NUC` cobre, e é caso de caixa comum.

VERIFICAÇÃO: contei as linhas dos dois arquivos (295 e 217, os dois sob o teto de 400) e as regras por
busca `^### RN-PER-` (8 + 11 = 19, sem buraco na sequência). Conferi por busca que nenhum dos dois
contém fabricante, modelo, driver, porta, protocolo, biblioteca, SDK, tabela, coluna, endpoint, papel
novo ou número inventado. Conferi contra a fonte cada `RN-EMI-` e `RN-NUC-` citado — `016`, `017`,
`022`, `024` a `032` de `EMI`; `012`, `013`, `016`, `017`, `019`, `022` do núcleo; `RN-OFF-001` a `008`,
`015` a `017`, `020`; `RN-COZ-008`, `010`. **Não rodei nada além disso: não há teste automatizado nesta
camada.**

MEMÓRIA SUGERIDA:
- type=business-rule escopo=modulo:PER camada=produto slug=pn-18-protege-a-venda-nao-a-obrigacao —
  falha de periférico degrada a **venda** (que conclui sempre) e **não** degrada a obrigação legal:
  impressão obrigatória não cumprida é dívida nomeada por via, e nenhum caminho marca a obrigação como
  cumprida sem desfecho "cumprida" registrado.
- type=decision escopo=modulo:PER camada=produto slug=per-nao-e-dependencia-de-ativacao-de-emi — `EMI`
  degrada com `PER` desligado, com limitação declarada na habilitação; recusar a ativação faria de
  módulo acoplado a equipamento a pré-condição de conformidade fiscal, o que `PN-18` recusa.
- type=convention escopo=modulo:PER camada=produto slug=periferico-e-classe-de-capacidade — periférico
  se especifica por classe de capacidade nomeada por necessidade; fabricante, modelo, protocolo e
  caminho de saída não aparecem em `docs/produto/**` (é a restrição mais dura a D-02).
- type=gotcha escopo=plataforma camada=produto slug=tabela-de-offline-sem-linha-de-per — sem linha na
  §4 de `operacao-offline-e-sincronizacao.md`, `RN-OFF-008` classifica toda operação de periférico como
  recusa, contradizendo `PN-18` **por omissão** — o mesmo defeito já corrigido lá para o núcleo.
- type=business-rule escopo=modulo:PER camada=produto slug=tentativa-de-periferico-tem-tres-desfechos —
  cumprida, falhou com motivo, **não tentada** com motivo; sucesso nunca presumido por ausência de erro,
  e desfecho ausente conta como não cumprida marcada como indeterminada.

PRÓXIMO PASSO SUGERIDO: dono de `operacao-offline-e-sincronizacao.md` — acrescentar à §4 as seis linhas
derivadas de `RN-PER-008` (hoje toda operação de `PER` está recusada por default lá) e revisar o exemplo
"gaveta" de `RN-OFF-006`. Depois, `seguranca` no gate de `PER`: o cenário concreto que interessa é a
superfície de exibição ao cliente-final (`RN-PER-016`, `RN-PER-017`) como canal lateral dentro do
estabelecimento, e o conteúdo **retido** em trabalho não cumprido (`RN-PER-007`), que guarda dado
composto fora do fluxo normal.

## produto (passo 6) — 2026-08-22

## RELATÓRIO — produto — T-0003 (passo 6)

STATUS: OK

FEITO:
- **`RN-REL-001` a `RN-REL-014`** — 8 regras que governam qualquer relatório do módulo + **6 perguntas**
  na semente, cada uma com os **oito campos** do brief preenchidos, mais `Motivo`, `Aceite` e `Infeliz`.
  Numeração `001`–`014`, contígua, sem colisão (código `REL` estava reservado e sem uso normativo).
- **A disciplina do brief virou regra, não postura de relatório.** `RN-REL-001` faz dos oito campos o
  critério de existência, e declara que **decisão e quem decide não admitem lacuna** — os outros seis
  admitem `LACUNA-REL-n` com dono. É isso que impede a semente de crescer por item pela metade.
- **`RN-REL-005` é a regra central do passo**: módulo-fonte desligado → "esta série não existe neste
  cliente", **nunca** zero, e a ausência é declarada **onde o número apareceria**, não em nota de pé. Os
  dois aceites são concretos e opostos: `EMI` off → "este cliente não emite documento por este produto",
  jamais "nenhuma pendência"; `EST` off → nenhuma margem, jamais margem com custo zero (margem com custo
  ausente parece lucro total, e é o pior número que este módulo poderia emitir).
- **`RN-REL-003` cita e não absorve** `RN-OFF-011`, `RN-OFF-012`, `RN-EMI-028` e `RN-NUC-010`. A
  fronteira é a **frescura**: fila tem prazo de horas e efeito por item; `REL` olha recorrência com
  frescura de dias. A tabela de §1 do arquivo-mãe lista as oito coisas que **não** são `REL`.
- **`RN-REL-004`** fecha a armadilha marcada na T-0001 (é em `REL` que "módulo não importa módulo" cai
  mais fácil): fonte só existe se constar do campo **Expõe** do módulo no `catalogo-de-modulos.md`; o
  que não consta é **pedido de exposição nova** ao dono daquela spec, nunca leitura direta. Cada uma das
  6 perguntas nomeia as fontes nesse formato.
- **`RN-REL-006`** aplica `RN-EMI-040` e `RN-NUC-018`: escopo é estabelecimento ou cliente; consolidado
  que só existe somando clientes é dado **nosso**; e o caso silencioso — `manager` de A lendo o resultado
  de B por dentro de um total "do cliente" — é negado sem revelar o outro lado (`RN-OFF-026`).
- **`RN-REL-007`** (`PN-07`/`PN-13`): relatório agrega, não decide nem corrige; fato e correção são dois
  fatos visíveis e vinculados; republicar preço não muda número de período anterior.
- **`RN-REL-008`** mantém **pessoa fora do grão** de toda a semente, por continuidade com a recusa de
  vigilância de `catalogo-de-capacidades.md` — não reabri decisão que é do humano.
- **`## Recusados` com 8 linhas**, cada uma com a necessidade nomeada e preservada (§12), e **§2 com os
  papéis que ficaram sem relatório** — `cashier` e `provider_support`, com o porquê. Ausência declarada,
  não omissão.

ARQUIVOS:
- `docs/produto/modulos/relatorios.md` (novo, 252 linhas) — cabeçalho, fronteira, `RN-REL-001` a `008`,
  contrato do módulo.
- `docs/produto/modulos/relatorios-semente-de-perguntas.md` (novo, 228) — as 6 perguntas
  (`RN-REL-009` a `014`), papéis sem relatório, **recusados**, lacunas dos dois.
- Só leitura: `papeis-e-permissoes.md`, `papeis-atribuicao-e-delegacao.md`, `catalogo-de-modulos.md`,
  `catalogo-de-capacidades.md`, `glossario.md` §4.3, `nucleo-venda.md`, `nucleo-caixa-e-turno.md`,
  `nucleo-publicacao-e-texto.md`, `operacao-offline-e-sincronizacao.md`, `fiscal-emissao-contingencia.md`,
  `fiscal-custodia-e-trilha.md`, `postura-nova-geracao.md`, `roadmap-de-modulos.md`, `modulos/cozinha.md`.

NÃO FEITO: —

DECISÕES:
1. **Parti em dois arquivos.** O arquivo único fechou em **457 linhas** (medido), 57 acima do teto. Eixo:
   **o que governa qualquer relatório × quais perguntas a semente tem e o que foi recusado**. Declarado
   no cabeçalho dos dois, numeração contínua, sem hierarquia. As **lacunas dos dois** moram no irmão §4,
   como o par de papéis fez.
2. **Cada pergunta é uma `RN`, não um item de lista.** Porque cada uma tem critério de aceite próprio, e
   sem `RN` o passo de `performance` e o de dados não teriam o que citar. Custo: 6 `RN` que são
   "relatórios" e não "regras" no sentido estrito — assumido, porque o campo que o `performance` mais
   precisa (frescura) só é auditável se estiver numerado.
3. **Frescura em ordem de grandeza qualitativa** ("dias", "horas a dias", "dias a semanas"), como o
   brief permite. **Nenhum teto numérico** — `LACUNA-REL-001`, dono `performance`, é a entrada direta do
   passo 7. Também não escrevi periodicidade fiscal (`LACUNA-REL-005`).
4. **`RN-REL-012` declara dependência dura de `LACUNA-NUC-001` (fuso), que está aberta**, e diz que o
   relatório **não é construível** antes dela. Preferi declarar a dependência a cortar a pergunta: a
   decisão (escala por faixa do dia) é legítima, e é melhor ela existir bloqueada e visível do que
   reaparecer em três meses sem ninguém saber que o fuso a trava.
5. **Não usei meio de pagamento como eixo de nenhuma pergunta**, apesar de ser a pergunta óbvia
   ("negociar taxa com quem"): `LACUNA-NUC-006` (domínio de meios) está aberta, e o eixo nasceria
   inventado. `LACUNA-REL-004`.
6. **`RN-REL-013` tem grão sessão × posto, sem operador.** O recorte por pessoa é o que qualquer um
   pediria primeiro, e é exatamente o que `RN-REL-008` proíbe até o humano decidir. O caso individual
   continua atendido — pela **trilha**, autorizado por papel, com registro de quem consultou.
7. **`owner` decide 3 das 6; `manager` 2; `fiscal_officer` 1; `cashier` nenhuma.** "Nenhuma" é resposta:
   o papel-piso não toma decisão de gestão, e dar-lhe relatório seria entregar agregado do
   estabelecimento a quem não decide nada com ele.
8. **Não cunhei nenhum termo de glossário** (`LACUNA-REL-007`) — o arquivo está no teto e não é meu nesta
   rodada.

RISCOS:
- **`docs/produto/README.md` continua sem listar os arquivos de módulo desta rodada** — agora há dois
  novos em `modulos/`. Mesmo achado do passo 2, não é meu território.
- **`catalogo-de-modulos.md` (`REL`) descreve o módulo como "curva de item, comparativo, meta,
  desempenho"** — três desses quatro nomes são **mecanismo**, não pergunta, e "curva ABC" e "comparativo"
  estão nos meus recusados. A entrada curta e a spec divergem no vocabulário; a spec é que tem critério.
  Quem editar o catálogo deve trocar por decisões, não por técnicas. **Não editei.**
- **`meta` (do catálogo) não entrou em nenhuma pergunta.** Meta pressupõe que exista o fato "meta
  publicada" e ninguém o declarou — seria capacidade nova, não relatório. Não a inventei nem a recusei
  por escrito, porque recusar exigiria nomear a necessidade contra um artefato que não existe.
- **`RN-REL-011` depende de o limite de desconto ser artefato publicado versionado** para a janela ser
  partida por versão. `RN-NUC-013`/`014` sustentam isso hoje; se a publicação de limite deixar de ser
  versionada, o relatório passa a somar sob o limite errado, em silêncio.
- **Passos 3 e 5 rodam em paralelo comigo.** Se algum deles criar a coluna de "ler relatório" na matriz,
  ela precisa cobrir 6 operações de leitura, cada uma com o escopo do meu campo **ESCOPO** — e o default
  é negado. Se não criar, as 6 ficam sem linha na matriz, e isso é pendência de fechamento, não minha.
- **Nenhum relatório da semente foi validado com um comerciante real.** Os oito campos garantem
  coerência interna, não relevância. É o tipo de artefato que só o humano pode conferir.

PERGUNTAS:
- para humano: **recorte por pessoa entra ou não** (`LACUNA-REL-002`)? Hoje toda a semente é sem pessoa.
  Se entrar, entra com que decisão declarada — distribuir trabalho, apurar diferença de dinheiro, ou
  avaliar gente? As três têm consequências diferentes e só a segunda eu saberia escrever.
- para humano: **existe o fato "meta publicada"**? Sem ele, "desempenho contra meta" (que o
  `catalogo-de-modulos.md` promete em `REL`) não é relatório — é capacidade nova, com artefato novo.
- para humano: o **comparativo antes/depois de uma mudança declarada** (`LACUNA-REL-006`) é decisão que
  você quer informar? Se sim, ele é escrevível assim que a mudança for fato nomeado; se não, sai da lista
  de candidatos e para de voltar.
- para `performance` (passo 7): das 6, **quais têm grão que você não aceita sem teto**, e qual **frescura
  mínima** cada uma pode sustentar sem pré-agregação? `LACUNA-REL-001` está escrita para receber sua
  resposta sem eu reescrever nenhuma regra.
- para humano, com o contador: a **janela** de `RN-REL-014` alinha-se a que ciclo (`LACUNA-REL-005`)?
  Não afirmo periodicidade legal por analogia.

VERIFICAÇÃO:
- **Não rodei teste** — não há código. O que conferi, por busca:
- `^### RN-REL-` nos dois arquivos → **14 headings, `001`–`014`**, contíguos, sem duplicata.
- Linhas: `relatorios.md` **252** · `relatorios-semente-de-perguntas.md` **228**. Nenhum acima de 400.
  O arquivo único media **457** antes da partição — é a medida que justificou partir.
- Busca `mesa|comanda|bomba|frota|delivery|restaurante` nos dois arquivos: **zero ocorrências**. Nenhum
  termo de ramo, em regra nenhuma, nem como condição.
- Busca de dígitos no arquivo da semente: **todas** as ocorrências são identificador de regra, número de
  seção, id de tarefa ou a data `2026-08-22`. **Nenhum teto, prazo, volume ou tempo de resposta
  inventado.** Único número escrito em palavra é "dois ciclos fechados", e é o **cenário do aceite**.
- Cada uma das 6 perguntas tem os 8 campos presentes e nomeados em maiúscula (`DECISÃO`, `QUEM`, `GRÃO`,
  `JANELA`, `FRESCURA`, `ESCOPO`, `FONTES`, `DESLIGADO`) — conferido item por item; nenhuma tem grão sem
  limite declarado.
- Cada fonte citada consta do campo **Expõe** do módulo correspondente em `catalogo-de-modulos.md`
  (núcleo linha 51, `FIS`/`EMI` 69–70, `EST` 93, `PRM` 110, `CMP` 173–174, `MSA` 201, `FTC` 287,
  `FRN` 296). Nenhuma fonte inventada.
- Os 5 papéis usados são exatamente os de `papeis-e-permissoes.md` §3. **Nenhum papel novo**, nenhum
  alias, nenhuma atribuição promovida a decisor.
- Nenhuma regra fiscal afirmada: `RN-REL-014` remete a `RN-EMI-018`, `RN-EMI-028`, `RN-OFF-012` e
  `EMI`/`APU`, e a janela é `LACUNA-REL-005`.
- Zero menção a tipo de gráfico, eixo, forma, cor, componente, bloco, tabela, coluna, endpoint ou SQL.

**As duas respostas que o brief pediu explicitamente:**
- **Recusei 8**, todas por falta de decisão declarada ou por a decisão não ser deste módulo. Sete têm
  destino nomeado; uma (`"explicar por que o dia foi diferente"`) já estava recusada em
  `catalogo-de-capacidades.md` e eu **não a reabri**.
- **O mais provável de alguém pedir, e que eu tive de recusar: "o faturamento do dia" / painel de vendas
  ao vivo.** É o primeiro pedido de qualquer dono e a necessidade é real — saber que o dia está fora do
  normal **a tempo de agir hoje**. A recusa não é da necessidade: é do lugar. A frescura é de **minutos**,
  então por `RN-REL-002` ela é **superfície de operação** (passo 5), não `REL`. Absorvê-la aqui teria dois
  custos concretos: `REL` passaria a concorrer com o caixa em leitura do que está acontecendo agora, e um
  cliente **sem** `REL` perderia informação de **operação** — módulo desligável não pode carregar o que a
  operação precisa. É a linha do `## Recusados` que evita esta discussão voltar em três meses.

MEMÓRIA SUGERIDA:
- type=business-rule escopo=modulo:REL camada=produto slug=relatorio-existe-pela-decisao-que-informa —
  relatório só existe com 8 campos declarados; **decisão** e **quem decide** não admitem lacuna; a
  pergunta é produto, a forma do gráfico é design (Fase 3).
- type=gotcha escopo=plataforma camada=produto slug=ausencia-de-modulo-nao-e-zero — módulo-fonte
  desligado → "esta série não existe neste cliente", nunca zero/vazio/traço. Zero é fato; ausência de
  módulo não é. Sintoma: `EMI` off exibindo "nenhuma pendência", `EST` off exibindo margem cheia.
- type=business-rule escopo=modulo:REL camada=produto slug=frescura-separa-relatorio-de-painel — decisão
  que não tolera atraso de horas não é relatório, é superfície de operação; fila e lista de trabalho
  (`RN-OFF-011`, `RN-OFF-012`, `RN-EMI-028`) nunca são absorvidas por `REL`.
- type=business-rule escopo=modulo:REL camada=produto slug=rel-le-so-o-que-o-modulo-expoe — `REL` é o
  ponto onde "módulo não importa módulo" cai mais fácil; fonte só vale se constar do campo **Expõe** do
  módulo, e o que falta é pedido de exposição nova ao dono da spec.
- type=decision escopo=modulo:REL camada=produto slug=pessoa-fora-do-grao-de-relatorio — nenhum
  relatório tem grão, coluna ou ordenação por pessoa até o humano decidir; caso individual é trilha
  autorizada, não agregado. Mantém a recusa de vigilância de `catalogo-de-capacidades.md`.

PRÓXIMO PASSO SUGERIDO: `performance` (passo 7) — consulta ≤10 linhas sobre as 6 perguntas de
`relatorios-semente-de-perguntas.md` §1. Entradas: `LACUNA-REL-001` (teto de janela e de página) é o
campo a preencher; o campo **FRESCURA** de cada uma é o que separa "responde sobre período fechado" de
"exige leitura do que está acontecendo"; e `RN-REL-006` proíbe qualquer pré-agregação cross-cliente —
consolidado que soma clientes é do `platform`, com papel nosso.

## produto (passo 5) — 2026-08-22

## RELATÓRIO — produto — T-0003 (passo 5)

STATUS: OK

FEITO:
- **Superfície dos 5 papéis, por momento de trabalho**, derivada célula por célula das duas matrizes.
  Cada linha declara: o que o papel **inicia** (com a linha da matriz e o valor da célula), a **decisão**
  daquele momento, a **informação que a decisão exige** e a **origem** dela, e o que muda **sem contato**.
- **`RN-NUC-034` a `RN-NUC-036`** (3 regras). Conjunto do núcleo agora **001–036, contíguo, sem
  duplicata** (conferido por busca). Nada renumerado.
- **`RN-NUC-035` é a regra que impede este passo de inventar:** informação na superfície tem **três
  origens** e só três — (i) objeto da própria operação, (ii) artefato publicado retido, (iii) linha de
  leitura da matriz. Só (iii) exige célula, e nenhuma (iii) deste conjunto aponta para `?` ou `N`. É o
  que explica por que a superfície do balcão é rica com **3** linhas de leitura, e por que a do
  `fiscal_officer` é vazia.
- **`RN-NUC-034`** fecha a armadilha 1 do plano: manifesto composto por papel é experiência e banda,
  **nunca** a autorização; e o manifesto **não enumera** o que o papel não alcança (colidiria com o
  aceite de `RN-NUC-022` e com `RN-EMI-039`).
- **`RN-NUC-036`** — **três negações, não uma**: negado ao meu papel · recusado por falta de contato ·
  sem suporte de decisão. Caminhos diferentes, e `RN-NUC-022` obriga a dar o caminho. Nenhuma superfície
  offline oferece "reautenticar", pela leitura que a matriz §7 adotou.
- **As três declarações pedidas no brief estão explícitas e cada uma tem consequência de superfície:**
  entrada para manifesto (`superficie-por-papel.md` §4, cinco itens); `owner` sozinho não opera sem
  contato (irmão §3.3 — e o requisito derivado é que **a habilitação declare isso**, porque
  `RN-NUC-028`, infeliz, diz "declarado na habilitação, não descoberto no pico"); `fiscal_officer`
  ortogonal (irmão §4, e §4.3 é o achado).
- **Dois momentos que a lista sugerida não tinha** (M8 custodiar a capacidade de assinar, M10 operar sob
  concessão) e **um que a matriz nega**: "abrir o dia" **não existe** como operação — a matriz tem
  fechar (linha 35) e não tem abrir. Não o escrevi; abri `LACUNA-NUC-032`.
- **`LACUNA-NUC-029` a `033`** (5), cada uma com dono. **Nenhuma célula `?` foi liberada.**

ARQUIVOS:
- `docs/produto/superficie-por-papel.md` (novo, **228 linhas**) — contrato de derivação (`034`–`036`),
  os 10 momentos, módulo não cria momento, o que `backend` obtém daqui, o inventário de decisões sem
  suporte, as 5 lacunas.
- `docs/produto/superficie-por-papel-momentos.md` (novo, **245**) — a superfície dos 5 papéis, momento
  por momento. Eixo da partição declarado no cabeçalho dos dois: **contrato de derivação × superfície
  papel por papel** (o arquivo único chegou a 451).
- Só leitura: `matriz-operacao-papel.md`, `matriz-operacao-papel-modulos.md`, `papeis-e-permissoes.md`,
  `papeis-atribuicao-e-delegacao.md`, `nucleo-venda.md`, `nucleo-caixa-e-turno.md`,
  `nucleo-publicacao-e-texto.md`, `operacao-offline-e-sincronizacao.md`,
  `fila-local-conteudo-e-repouso.md`, `glossario.md`, `modulos/relatorios.md`, `postura-nova-geracao.md`.
- **Não editei** as matrizes, os arquivos de papel, o núcleo, o glossário, o contrato de offline,
  `modulos/**` nem `docs/design/**`.

NÃO FEITO: —

DECISÕES:
1. **A superfície é derivada, e a derivação precisou de uma regra para ser auditável** (`RN-NUC-035`).
   Sem as três origens, "o que ele precisa ver" é opinião, e a matriz nega quase toda leitura: seria
   impossível escrever a seção sem encostar nas 12 células `?`. Com elas, a pergunta vira verificável —
   e o resultado é que **a superfície do balcão não depende de quase nenhuma leitura autorizada**,
   porque quase tudo que o `cashier` vê é o objeto do próprio ato ou o artefato que o terminal retém.
   Trade-off: origem (i) é generosa por construção (o autor de um fato vê o fato que está criando), e é
   ela que faz a superfície existir sem liberar célula. Se `seguranca` achar que (i) é larga demais em
   algum ponto, o ponto é nomeável linha por linha.
2. **Não escrevi o momento "abrir o dia"**, que a lista sugerida pedia. A operação não existe na matriz
   e criá-la para ter onde pendurar superfície é o risco principal da ficha, invertido. Vira
   `LACUNA-NUC-032`, junto de `LACUNA-NUC-007` (turno).
3. **Marquei duas informações como "origem (iii) inexistente"** em vez de omitir a linha: a lista de
   atribuições vigentes (`owner`, linha 20) e o inventário de capacidades de assinar
   (`fiscal_officer`). Omitir daria a impressão de que o papel decide com o que tem; declarar torna o
   buraco contável. Custo: duas linhas de tabela que apontam para lacuna, e não para célula.
4. **`provider_support` ficou com uma seção curta, e a pobreza está declarada como garantia.** A
   superfície dele não é derivada da matriz — é derivada da **concessão** (`RN-NUC-024` a). Superfície
   rica para este papel seria o defeito, não a entrega.
5. **Contei a leitura e a contagem virou argumento:** de 72 operações, **7** são leitura; das 7, **4**
   estão inteiramente indecisas para os papéis gerenciais. É a mesma indecisão de 12% que as matrizes já
   contaram, lida por outro eixo — ela não está espalhada, está no que **sustenta decisão**.

RISCOS:
- **`RN-NUC-024` (d) promete e a matriz nega** (`LACUNA-NUC-031`): a regra diz que cada ato sob
  concessão do provedor é legível **pelo cliente, na superfície dele**, e nenhuma linha das duas
  matrizes concede essa leitura a papel nenhum — é **ausente**, logo negada por `RN-NUC-026`. Não é
  célula `?`, é promessa contra default fechado. É o risco mais sério que encontrei.
- **`owner` não pode ver o que vai alterar** (`LACUNA-NUC-029`): ele inicia "criar, alterar e revogar
  atribuição" (linha 20) e "ler a lista de atribuições vigentes" não é operação em lugar nenhum. Idem
  para `fiscal_officer` e o inventário de capacidades vivas (`LACUNA-NUC-030`).
- **O dono da lista de trabalho pode não poder ler o conteúdo dela:** `RN-OFF-027` (c) proíbe tratar
  texto de terceiro como isento de dado de pessoa, e a leitura de dado de pessoa fora da venda é `?`
  (`LACUNA-NUC-018`). Não liberei.
- **`glossario.md` continua em 389 linhas e três termos deste passo não têm entrada:** superfície,
  momento de trabalho, e as três origens de informação. O próximo acréscimo exige partir — quinta
  ocorrência do padrão. Não é meu arquivo nesta rodada.
- **`docs/produto/README.md` continua sem listar os arquivos de raiz** — agora são catorze, dois deles
  meus. Reincidente (passos 2 e 3 já reportaram).
- **A linha 32 da matriz depende de `LACUNA-OFF-004`**: se o humano decidir que não existe exceção
  offline, o `cashier` perde a única operação `R` que ele tem em M3 e a linha sai da superfície dele. A
  superfície sobrevive; a linha some.
- Quem numerar depois: **`RN-NUC-037`** e **`LACUNA-NUC-034`**.

PERGUNTAS:
- para humano: **existe operação de "abrir o dia do estabelecimento"** (`LACUNA-NUC-032`)? Se não
  existe, o fechamento é o único marco de dia e isso precisa ser dito — hoje é subentendido, e
  subentendido é o que o construtor inventa.
- para humano: **quem lê a trilha dos atos do provedor** (`LACUNA-NUC-031`)? `RN-NUC-024` (d) já
  prometeu ao cliente; falta a célula. Sem ela, a cláusula que faz o papel do provedor ser aceitável não
  é exequível.
- para humano: **quem lê a lista de atribuições e delegações vigentes** (`LACUNA-NUC-029`), e **quem vê
  o inventário de capacidades de assinar vivas** (`LACUNA-NUC-030`)? As duas são a mesma forma de
  buraco: o ato de revogar existe, a visão do que existe para revogar não.
- para humano: **com quanta antecedência** o portador de autoridade retida é avisado de que ela vai
  vencer (`LACUNA-NUC-033`)? É número, e a superfície hoje declara só o estado.
- para `seguranca`: a **origem (i)** de `RN-NUC-035` ("o autor de um ato vê o objeto do próprio ato")
  aguenta como está, ou existe caso em que ela é caminho de leitura ampla? O caso que me preocupa é
  fechar sessão de **outro** operador (linha 13): o esperado da sessão alheia é objeto da operação dele,
  logo (i) — e isso lhe dá a composição do que o outro vendeu.

VERIFICAÇÃO:
- **Não rodei teste** — não há código. O que conferi de fato, por busca:
- `^### RN-NUC-` no repo → **36 headings, `001`–`036`**, contíguos, sem duplicata e sem colisão com os
  passos 1, 2, 3 e com `PER`/`REL` (que usam outros prefixos).
- Linhas: `superficie-por-papel.md` **228** · `superficie-por-papel-momentos.md` **245**. **Nenhum acima
  de 400**; o arquivo único chegou a **451** e foi partido por isso, no eixo declarado no cabeçalho dos
  dois.
- `LACUNA-NUC-029` a `033` → aparecem **só** nos meus dois arquivos: zero colisão com `001`–`028`.
- Termo de ramo (`mesa|comanda|bomba|frota|delivery|restaurante|padaria|posto de gasolina|loja de
  roupa`) nos dois arquivos: **zero ocorrências**.
- Termo de tela (`tela|gráfico|botão|menu|layout|componente|bloco|ícone`): 12 ocorrências no arquivo de
  contrato, **todas** em cláusula que declara a ausência, no requisito genérico de manifesto, ou citando
  "botão escondido" de `PN-11`; **zero** no arquivo por papel. Nenhum nome de tela, de bloco ou de
  componente em nenhum dos dois.
- Cada linha de tabela dos dois arquivos que cita informação carrega a marca de origem **(i)**, **(ii)**
  ou **(iii)**; as **duas** (iii) que não têm célula estão marcadas `(iii) **inexistente**` e apontam
  para lacuna nova. Nenhuma (iii) aponta para célula `?` ou `N`.
- Célula citada conferida contra a matriz uma a uma para as 35 linhas do núcleo e para as linhas do
  irmão que usei (§5, §7). As três células `?` que eu **nomeio** (11, 24, 25) estão declaradas como
  "não inicia".
- Nenhum número inventado: prazo, validade, teto e antecedência continuam sendo lacuna de terceiros; os
  únicos números do texto são contagens (72, 7, 43, 12, 20, 5) e todas vêm das matrizes ou de busca.
- `RN-OFF-027` conferido antes de citar: (c) diz literalmente "tratado como isento de dado de pessoa" —
  a citação é exata, não analogia.

MEMÓRIA SUGERIDA:
- type=business-rule escopo=plataforma camada=sdui slug=manifesto-por-papel-nao-e-autorizacao — compor
  manifesto por papel é experiência e banda; a verificação acontece na operação, sempre. E o manifesto
  não **enumera** o que o papel não alcança, senão a negação revela o que existe.
- type=business-rule escopo=plataforma camada=produto slug=informacao-de-superficie-tem-tres-origens —
  (i) objeto da própria operação, (ii) artefato publicado retido, (iii) linha de leitura da matriz. Só
  (iii) exige célula; informação (iii) sem célula não entra e a ausência é lacuna. É o que impede
  "o gerente obviamente precisa ver isso" de liberar as 12 células indecisas de leitura.
- type=business-rule escopo=plataforma camada=produto slug=tres-negacoes-nao-uma — negado ao meu papel
  (caminho: outro papel) · recusado por falta de contato (caminho: reconectar) · sem suporte de decisão
  (caminho: nenhum). Colapsá-las é `PN-17` violado no pico, e é o que empurra para a senha compartilhada.
- type=gotcha escopo=plataforma camada=produto slug=matriz-e-quase-toda-ato-e-quase-nada-informacao — de
  72 operações, 7 são leitura, e 4 delas estão inteiramente indecisas. Sintoma: toda decisão que precisa
  de histórico (diferença de caixa, exceção repetida, revogar atribuição, revogar assinatura) fica sem
  suporte, embora o ato correspondente esteja autorizado.
- type=gotcha escopo=plataforma camada=produto slug=owner-sozinho-nao-opera-e-a-habilitacao-tem-de-dizer
  — contenção dá ao `owner` o balcão inteiro e **não** gera autoridade retida, então sozinho ele não
  vende sem contato. O conserto é atribuição de `cashier`/`manager` para a mesma pessoa, **declarada na
  habilitação** — nunca descoberta no pico.
- type=gotcha escopo=plataforma camada=produto slug=trilha-do-provedor-prometida-e-negada —
  `RN-NUC-024` (d) promete ao cliente ler cada ato praticado sob concessão; nenhuma célula concede essa
  leitura a papel nenhum, e operação ausente é negada a todos. Promessa contra default fechado.

PRÓXIMO PASSO SUGERIDO: nenhum passo novo. Duas costuras para o orquestrador, as duas fora do meu
território: (a) as 5 lacunas novas são **todas** do humano, e três delas (`029`, `030`, `031`) são a
mesma forma de buraco — ato autorizado, visão do que ele altera inexistente; vale levar as três juntas,
numa pergunta só. (b) `seguranca` (passo 4) ganha uma entrada dirigida que não estava no brief dele: a
**origem (i)** de `RN-NUC-035`, no caso da linha 13 (fechar sessão alheia).

## backend (passo 8) — 2026-08-23

## RELATÓRIO — backend — T-0003 (passo 8, dossiê de D-03)

STATUS: OK

FEITO:
- Escrevi `docs/arquitetura/d-03-identidade-opcoes.md` (387 linhas). **Não escolhi D-03.** A §8 é
  recomendação rotulada, com o critério único que a sustenta e a pergunta de negócio que a converte em
  decisão.
- **Parti D-03 em três eixos ortogonais** (E1 residência do sujeito · E2 mecanismo de prova · E3 de
  onde o tenant chega). É o entregável real: cada tentativa anterior de responder "por cliente ou
  global?" colidia com pergunta de outro eixo, e é por isso que a decisão mais antiga do projeto segue
  aberta.
- **E3 está quase decidido pela regra que já existe.** `backend.md:11` (tenant nunca de body/query/
  header/path) deixa **três** portadores lícitos e só três: credencial de dispositivo do terminal
  cadastrado · sessão cunhada para um cliente a partir do conjunto de atribuições que o servidor
  conhece · alça opaca de encaminhamento. Ilícitos, pela mesma razão: subdomínio/`Host`, path, body,
  cookie/header editável — todos são texto que o chamador escolhe, e convenção de infraestrutura não
  os deixa de ser.
- **Distinção que decide a licitude:** com portador 1 e 3, **nenhuma requisição carrega tenant** — não
  existe verificação a esquecer. Com portador 2, toda requisição carrega tenant derivado da sessão, e o
  isolamento passa a depender de a sessão nunca ser reaproveitada. Os dois cumprem `backend.md` §1; só
  o primeiro cumpre **por construção**.
- **Três opções nomeadas e comparadas** (A — diretório por cliente com o terminal portando o tenant ·
  B — diretório central no `platform` com sessão cunhada por cliente · C — verdade no cliente + índice
  de encaminhamento mínimo no `platform`), cada uma com tenant, credencial, comportamento offline e **o
  que torna impossível depois**. Tabela de 7 linhas × 3 colunas respondendo as sete perguntas do brief.
- **15 requisitos com `path:linha`** como filtro (§1), todos regra já aprovada.
- **Uma recusa fundamentada, com as quatro partes** (§3.4): diretório central **com cópia** no schema
  do cliente ("C2") — duas verdades que divergem em silêncio, o mesmo defeito já nomeado para D-05.
  Substituído por fato congelado, e a prova é operacional: mude nome/papel no diretório e leia uma
  venda antiga — o autor registrado não muda, e não há segundo lugar a conferir.

DECISÕES:
- **Extensão de território, excepcional e autorizada neste brief:** escrevi em `docs/arquitetura/`,
  fora de `apps/api/**` e `packages/contracts/**`. Motivo declarado no brief: meu território é Fase 2 e
  a regra de fase proíbe criá-lo agora. Precedente: `d-01-d-02-stack-opcoes.md`. **Não** toquei em
  `docs/produto/**` nem em `docs/auditorias/**`.
- Recomendei **C** e escrevi o critério antes da conclusão, para ele ser auditável separado dela:
  *entre duas opções que cumprem os requisitos, escolher a que troca isolamento por verificação por
  isolamento por construção.* A e C fazem; B não. Entre A e C, C paga uma tabela de encaminhamento sem
  nome/verificador/papel e compra a única coisa que falta a A — caminho lícito de primeira chegada para
  superfície **sem** terminal cadastrado, que o dossiê de D-01/D-02 já concluiu ser a classe maior.
- **Recomendei recusar explicitamente** a alça única resolvendo em vários clientes: parece conveniência
  de C e é a adoção de B sem decisão registrada.
- Declarei onde **B ganha**, sem maquiar: revogação de pessoa em um ato só, com efeito em todos os
  clientes. Se o humano multi-cliente for caso de venda e não de borda, B deixa de ser o pior.
- **Não decidi E2.** Senha, PIN, crachá, biometria e provedor do cliente seguem em aberto; as três
  opções de E1 sobrevivem a todas.

RISCOS:
- **O achado central, e ele é anterior a D-03 (§5 do dossiê):** a **validade da autoridade retida do
  `cashier` é hoje o comprimento máximo de um turno offline**, e duas regras aprovadas não coexistem.
  `RN-OFF-024` (`fila-local-conteudo-e-repouso.md:111`) recusa só **operação sensível** quando a
  validade vence, e venda em espécie **não** está na lista do aceite dela; já a tabela de
  `papeis-e-permissoes.md:114` e a §6 de `papeis-atribuicao-e-delegacao.md` dizem que a autoridade
  retida do `cashier` é **obrigatória** "porque sem ela não há venda sem contato (`RN-NUC-001`, `004`,
  `009`)", e `RN-NUC-009` põe "papel retido vale, dentro da validade" como **precondição**, com infeliz
  (b) recusando. Vencida a validade com o link caído: ou a venda ordinária continua sem autoridade
  válida (e a segunda afirmação é falsa), ou ela para (e `PN-01` é violado). E a validade não tem
  número (`LACUNA-OFF-011`) — o mesmo número que governa a exposição do gerente demitido às 14h.
- **É D-03 e não só produto:** a saída limpa depende de o terminal ser ou não portador de identidade.
  Com portador 1 (A/C), o ato ordinário se sustenta no **cadastramento do terminal** e o operador é
  *identificado* para atribuição, não *autorizado* — a validade pode ser curta como `RN-OFF-024` exige
  sem nunca parar o balcão. Com portador 2 (B), o único sustentáculo é a autoridade da pessoa, e o
  conflito fica de pé.
- **Terceira categoria de coisa retida, sem regra** (`LACUNA-IDE-001`): qualquer opção de D-03 põe no
  terminal um **meio de prova de identidade** dos operadores do estabelecimento, recebido online — é o
  que faz `RN-NUC-009` funcionar em D1/D2/D3. Ele não é artefato publicado nem autoridade retida
  (`papeis-atribuicao-e-delegacao.md:23`), então: não tem regra, não está na lista fechada de
  `RN-OFF-023` (`fila-local-conteudo-e-repouso.md:76`) e **não aparece no cenário do terminal furtado**
  `C-09` (`:201`), que enumera fila, faixa e capacidade de assinar e nada sobre identidade. Escolher
  D-03 sem fechar isso põe no dispositivo mais exposto do sistema uma coisa cuja proteção em repouso
  ninguém especificou.
- **Bootstrap sem dono** (`LACUNA-IDE-002`): quem cria o **primeiro `owner`** de um cliente novo? Não
  é `owner` (não existe ainda) e não pode ser `provider_support` (`RN-NUC-024` o proíbe de operação de
  negócio; `RN-NUC-023` põe atribuir papel no piso de meta-autoridade). Sobra operação de plataforma
  nossa, sem papel declarado em artefato nenhum — é `LACUNA-NUC-011` outra vez, e vale para as três
  opções.
- **`provider_support` separa as opções por estrutura, não por disciplina.** Em A/C a concessão cria
  sujeito **local** e "uma concessão em dois clientes" é impossível porque não há como. Em B nossos
  engenheiros ficam na mesma população dos operadores dos clientes, e `RN-NUC-024` é cumprido por
  **política**. B não está eliminado por isso, mas só deve ser aceito com essa frase por escrito.
- **Corolário que ninguém escreveu:** `provider_support` **nunca** é autoridade retida, logo o conjunto
  de verificadores enviado ao terminal **não pode** incluir o nosso pessoal — senão o ato nosso fica
  invisível ao cliente até a reconexão, e é essa cláusula que torna o papel aceitável
  (`LACUNA-IDE-003`).
- **Acoplamento D-01 × D-03, declarado:** a opção **B** depende de propriedades de cunhagem e
  revogação de sessão que só se verificam contra biblioteca concreta — e D-01 está ABERTA, então **não
  as afirmo**. Efeito prático: B é a única das três cuja avaliação final **não pode fechar antes de
  D-01**. A e C não têm esse acoplamento (o portador é registro de dispositivo e tabela de
  encaminhamento, não primitiva de sessão).
- **Acoplamento D-04 × D-03:** o formato do identificador do sujeito é **D-04**, não D-03. `RN-OFF-013`
  já exige identidade cunhada no terminal para a **operação**; o identificador do **operador** tem a
  mesma pergunta e a mesma dona.
- **Paralelo estrutural com D-05, e não é coincidência:** as duas decisões batem na mesma cláusula —
  "nenhuma tabela de cliente vive no `platform`" (`.claude/rules/dados.md` §1). D-05 é o catálogo de
  regra fiscal; D-03 é o diretório de pessoas. As duas têm a mesma terceira saída (artefato mínimo que
  não é verdade sobre o cliente). Vale decidir as duas com o mesmo critério, e não uma de cada vez.
- **Fora do escopo, mas morde este passo:** o **gate 3 (auditoria de autorização, passo 4) não
  executou** — `docs/auditorias/` tem só o `README.md`. Este dossiê produz entrada dirigida para ela
  (o oráculo de enumeração da alça de C; a cunhagem de sessão de B; o conjunto de verificadores no
  terminal), e o inverso também é verdade: `LACUNA-NUC-013` esperava cenário concreto de escalonamento
  vindo do passo 4. Nenhuma escolha de D-03 deveria ser aplicada antes desse gate.
- **Risco de erosão da opção C, gradual e por isso perigoso:** no momento em que o índice de
  encaminhamento ganha um campo (nome, último acesso, contagem de falha), ele virou B sem que ninguém
  tenha decidido migrar. Se C for escolhida, a lista de campos do índice é **fechada** por decisão
  registrada, não por bom senso.

VERIFICAÇÃO:
- **Não rodei teste nenhum** — não há código neste repositório e o entregável é documento.
- **Não medi nada.** Não há um único número de desempenho, latência, tamanho ou cardinalidade no
  dossiê; grandeza aparece com unidade e sem valor, e as que faltam estão em `LACUNA-IDE-004`,
  `LACUNA-OFF-011` e `LACUNA-NUC-010`.
- **Não abri nenhuma fonte externa** e não afirmo comportamento de provedor, biblioteca, protocolo ou
  "padrão de mercado" em nenhuma linha.
- **Conferi em disco** cada `path:linha` citado no dossiê, por `grep` do heading da regra: os 15
  requisitos de §1 e todas as citações do corpo. Uma citação estava errada e foi corrigida
  (`papeis-atribuicao-e-delegacao.md` §1: era `:36`, é `:23`).
- **Contei o arquivo:** 387 linhas, dentro do teto de 400. Não precisei partir.
- **Leituras:** `.claude/rules/00-nucleo.md`, `.claude/rules/backend.md`,
  `memory/plataforma/INDEX.md`, `memory/plataforma/state-sessao-2026-08-22-tres-fichas-abertas.md`,
  `papeis-e-permissoes.md`, `papeis-atribuicao-e-delegacao.md`, `fila-local-conteudo-e-repouso.md`
  (§2, §3, `C-09`), `operacao-offline-e-sincronizacao.md` (§3, §4, `RN-OFF-013`),
  `nucleo-caixa-e-turno.md` (`RN-NUC-009`), `matriz-operacao-papel.md` (§4 nota, §7),
  `fiscal-custodia-e-trilha.md` (grep dirigido), `glossario.md` §1.1, `postura-nova-geracao.md`
  (`PN-11`), `d-01-d-02-stack-opcoes.md` (estrutura e §"A resposta direta"). **Não varri `memory/`.**

NÃO FEITO: —

PERGUNTAS:
- para **humano**: o humano que opera em mais de um cliente é **caso de borda** (contador ocasional,
  nossa equipe) ou **caso de venda** (rede com administração central, grupo com quadro compartilhado,
  escritório de contabilidade como canal)? Borda → **C**. Caso de venda → **B**, assumindo por escrito
  que o isolamento passa a ser garantido por verificação. É a única pergunta que falta para D-03 fechar.
- para **humano**: existe requisito de **provedor de identidade do próprio cliente** (entrar com a
  conta corporativa dela)? Se sim, ele vale só para `owner`/`fiscal_officer`, ou também para
  `cashier`? A segunda metade colide com `RN-NUC-009` + `PN-01` e precisa de resposta **antes** de
  virar promessa comercial.
- para **humano**: `LACUNA-IDE-002` — do nosso lado, quem provisiona cliente novo, cria o primeiro
  `owner` e audita isso?
- para **produto**: o ato ordinário do caixa (abrir pedido, lançar item, concluir em espécie) depende
  da **autoridade retida do operador**, ou basta o **cadastramento do terminal** mais a identificação
  do operador para atribuição? As duas leituras existem hoje em regras aprovadas e dão respostas
  opostas para "a validade venceu no meio do turno com o link caído".
- para **produto**: o **meio de prova retido** entra como **terceira categoria** na tabela de
  `papeis-atribuicao-e-delegacao.md` §1, ou é atributo de uma das duas que já existem?

MEMÓRIA SUGERIDA:
- type=decision escopo=plataforma camada=backend slug=d-03-sao-tres-eixos-nao-uma-decisao — D-03 é
  residência do sujeito × mecanismo de prova × chegada do tenant; tratá-las como uma é o que a manteve
  aberta desde o dia 0, e cada eixo fecha por critério diferente.
- type=convention escopo=plataforma camada=backend slug=tres-portadores-liticos-de-tenant — só três
  portadores cumprem `backend.md` §1 (credencial de dispositivo cadastrado, sessão cunhada por
  cliente, alça opaca de encaminhamento); subdomínio, path, body e cookie são texto do chamador, e
  convenção de infraestrutura não muda isso. Com o 1º e o 3º, nenhuma requisição carrega tenant.
- type=gotcha escopo=plataforma camada=produto slug=validade-do-cashier-e-o-turno-offline — a validade
  da autoridade retida do `cashier` é, na prática, o comprimento máximo de um turno offline;
  `RN-OFF-024` (recusa só o sensível) e `papeis-e-permissoes.md` §3 + `RN-NUC-009` (retida é
  obrigatória para vender) dão respostas opostas, e o número não existe (`LACUNA-OFF-011`).
- type=gotcha escopo=plataforma camada=seguranca slug=meio-de-prova-retido-nao-tem-regra — existe uma
  **terceira** categoria de coisa retida no terminal, além de artefato publicado e autoridade retida:
  o meio de verificar a identidade do operador sem contato. Sem regra, fora da lista fechada de
  `RN-OFF-023`, e ausente do cenário do terminal furtado `C-09`.
- type=decision escopo=plataforma camada=backend slug=isolamento-por-construcao-vence-por-verificacao
  — critério de desempate de D-03: entre opções que cumprem os requisitos, escolher a que torna o
  vazamento impossível por construção em vez de prevenido por verificação. É o que separa A/C de B, e
  é o mesmo critério que serve a D-05.
- type=reference escopo=plataforma camada=backend slug=dossie-d-03-identidade —
  `docs/arquitetura/d-03-identidade-opcoes.md`: 3 opções, 15 requisitos com `path:linha`, 7 perguntas
  respondidas opção por opção, 5 `LACUNA-IDE`, recomendação rotulada e a pergunta única que a fecha.

PRÓXIMO PASSO SUGERIDO: **não é fechar a T-0003.** Na ordem: (1) `seguranca` — **gate 3, passo 4, que
não executou**, e o dossiê acrescenta três entradas dirigidas ao brief dele (oráculo de enumeração da
alça em C; cunhagem de sessão em B; conjunto de verificadores no terminal). (2) `produto` — as duas
perguntas de §5/§2.2 acima; a primeira é contradição entre regras aprovadas, não lacuna, e o
orquestrador deve tratá-la como defeito a despachar ao dono do arquivo. (3) **humano** — a pergunta
única de §8, que fecha D-03. Nenhuma opção deveria ser aplicada em `CLAUDE.md` §8 antes de (1) e (2).

## seguranca (passo 4) — 2026-08-23

## RELATÓRIO — seguranca — T-0003 (passo 4, gate 3)
STATUS: OK
FEITO:
- Auditei o modelo de autorização, papéis, contenção, delegação, matriz (360 células) e superfície por
  papel, como **auditoria de spec** — não há código de produto. 11 achados, todos com cenário
  concreto; 6 notas sem cenário ou de divergência inerte, declaradas como notas.
- Respondi explicitamente a prioridade um (§1 do relatório): **não encontrei caminho em que um cliente
  veja dado de outro**. O que está frouxo é o isolamento **entre estabelecimentos do mesmo cliente** —
  o vazamento que `RN-NUC-018` já nomeia como aquele que nenhuma defesa por cliente pega.
- Cobri as cinco frentes dirigidas e não parei nelas.
  1. **As 43 células `?` não são falha-fechado por si.** Duas brechas: `AUT-05` — a **origem (i)** de
     `RN-NUC-035` entrega, sem célula, exatamente o dado das 12 células `?` de leitura (registro de
     trabalho de outro operador na linha 13; conteúdo de fila na linha 30, que inclui o que comprova
     recebimento de pagamento e pode incluir dado de pessoa); `AUT-08` — uma `RN` **dona** concede
     afirmativamente o que a célula nega por omissão, e **nenhuma regra declara precedência** entre
     célula e papel nomeado em prosa. As **2 do caminho crítico** (linha 11) provadas em `AUT-07`: a
     regra dona (`RN-NUC-009`) não distingue "abrir para si" de "abrir em nome de outro", então a
     célula não tem onde ser verificada — `RN-NUC-030` criou a operação distinta para o fechamento e
     ninguém a criou para a abertura.
  2. **Contenção: a declaração se sustenta** nos quatro caminhos (offline, delegação, artefato
     publicado, meta-autoridade) — nota N2, com uma lacuna de granularidade hoje inerte (retenção por
     pessoa × por atribuição). O que **não** se sustenta é a derivação temporal: `AUT-03` — delegação
     não morre com a atribuição do delegante, e "prazo não maior que o do delegante" não tem referente,
     porque atribuição não tem vigência. É o "gerente demitido às 19h" um salto adiante.
  3. **As três divergências:** `AUT-04` (`RN-OFF-024` b×d) **não é inerte** — com **D-03** aberta,
     "reautenticar" pode ser PIN local, e o cenário é sangria com autoridade revogada; e "reautenticar"
     continua em **dois arquivos donos do núcleo**, não só no de offline. `AUT-11` (`RN-OFF-011`
     "papel") tem consequência concreta: implementado como papel, o gate de habilitação de `RN-NUC-020`
     desaparece e o estabelecimento nasce com fila órfã. A **terceira** (quem concede delegação) é
     **inerte** quanto a permissão — digo isso explicitamente na nota N1.
  4. **`provider_support`:** hoje **não é instanciável** (linha 25 `?`/`N`, sem autoconcessão, sem papel
     nosso — `LACUNA-NUC-011`), e isso é o desfecho correto. Dois defeitos a resolver **antes** da
     primeira concessão: `AUT-09` (a lista absoluta nomeia dado de pagamento e **não** nomeia a
     capacidade de assinar — nomeável por concessão, e é o ato de maior consequência do módulo) e
     `AUT-10` (a cláusula (d) não tem leitor **e** o registro de `RN-NUC-029` nomeia *atribuição*, que
     o papel não tem — então nem qual concessão autorizou o ato é dizível).
  5. **`RN-NUC-034`:** (a) **não encontrei** ponto em que a composição do manifesto seja a única
     barreira — as duas metades coexistem na spec e a verificação no backend está exigida em toda
     operação. (b) o vazamento não é por omissão de nó, contagem ou ordem: é o **inverso** — `AUT-06`,
     as três negações de `RN-NUC-036` não têm canal num manifesto que omite nó, então a terceira
     ("sem suporte de decisão") só se alcança forjando pedido, e o operador recebe ausência sem
     explicação, que é o que empurra ao contorno de `PN-11`. Cruzei com `RN-NUC-036`, com `§4` item 5 da
     superfície e com a cláusula "ausência por autorização é ausência" de `.claude/rules/ui.md` — as
     três exigem coisas incompatíveis no mesmo ponto.
- Entreguei a **entrada que `LACUNA-NUC-013` pediu** (§4 do relatório): quatro itens candidatos ao piso
  de `RN-NUC-023`, cada um com o cenário que o justifica, mais um item de forma (a célula como
  autoridade única sobre autorização).
- Atendi a entrada extra do passo 5 (origem (i) na linha 13): virou `AUT-05`, generalizada.

ARQUIVOS:
- `docs/auditorias/2026-08-23-autorizacao-papeis-e-superficie.md` (novo, **400 linhas** — no teto, não
  acima; não precisou dividir por eixo)
- `tarefas/T-0003-nucleo-de-venda-papeis-e-superficie.md` (editado — só esta seção)
- Todo o resto: **só leitura.** Não editei nenhum arquivo de `docs/produto/**`, inclusive as três
  divergências cujo conserto é uma palavra.

NÃO FEITO: —

DECISÕES:
- **Nenhum CRÍTICO.** Reservei o rótulo: nenhum caminho alcança outro cliente, nenhum segredo no repo,
  e a fraude de `AUT-02` opera sobre artefato que o cliente publica sobre si mesmo. `AUT-02` viraria
  CRÍTICO se a marca "exige autorização de terceiro" permanecer publicável pelo cliente **e** o piso
  não passar a seguir a delegação.
- Severidade de `AUT-04` é condicional a **D-03**: se a decisão fechar como "reautenticar exige
  servidor", cai para MÉDIO. Declarei a condição no relatório em vez de escolher o pior caso.
- Não abri achado sobre o eixo de leitura em si (as 12 células `?`): elas são **dívida declarada** pelo
  passo 3, e o achado é a **brecha** que as contorna (`AUT-05`), não a indecisão.
- Prefixei `AUT-nn` conforme o brief; não usei `C-nn`.

RISCOS:
- `docs/produto/matriz-operacao-papel.md` está com **exatamente 400 linhas**. Duas correções que eu
  peço (partir a linha 18 em `AUT-02`, declarar a precedência da célula em `AUT-08`) não cabem sem
  partir o arquivo. É do dono decidir, mas o orquestrador precisa saber antes de despachar.
- Fora de escopo, uma linha: `LACUNA-OFF-006` (fuso do estabelecimento × do cliente) toca a **validade
  da autoridade retida**. Validade calculada no fuso errado é autoridade viva além do prazo.
- Não há regra de log de autorização em nenhum artefato. Não é achado hoje (não há contrato); é item de
  gate para a Fase 2.
- **A seção `## backend (passo 8) — 2026-08-23` apareceu nesta ficha enquanto eu auditava.** Não a
  toquei e não a reverti (`.claude/rules/git.md`). Consequência para este relatório: eu **não li** o
  dossiê de **D-03**, então a condicional de severidade de `AUT-04` foi escrita sem ele. Se o dossiê já
  fixa que reautenticação exige servidor, o orquestrador pode baixar `AUT-04` para MÉDIO sem me
  redespachar.

PERGUNTAS:
  - para humano: a marca **"exige autorização de terceiro"** de um meio de pagamento é artefato que o
    cliente publica, ou do módulo que possui o meio (`ADQ`/`PGO`/`PRZ`)? É a decisão que fecha ou deixa
    aberta a metade forte de `AUT-02`.
  - para humano: revogar uma atribuição revoga em cascata as delegações que ela concedeu? (`AUT-03`;
    o **número** do teto de delegação é pergunta separada, também sua.)
  - para produto: "quem assume" de `RN-NUC-009` é, por regra, a identidade autenticada? (`AUT-07`;
    responde a metade de papel de `LACUNA-NUC-016` sem tocar no número.)
  - para produto: qual é a precedência entre uma célula da matriz e um papel nomeado em prosa na `RN`
    dona da operação? (`AUT-08` — sem isso, "negado por omissão" não é falha-fechado.)

VERIFICAÇÃO:
- **Não rodei teste, não há o que rodar** — sem código, sem banco, sem rota, sem manifesto. Nenhuma
  verificação dinâmica: sem `EXPLAIN`, sem requisição forjada.
- Confiri **por leitura** cada `path:linha` citado no relatório, e corrigi seis referências que estavam
  erradas antes de publicar.
- Varredura de segredo em `docs/**` e `memory/**` (`api_key|secret|senha|password|token|bearer|PRIVATE
  KEY` com atribuição): **zero ocorrências**.
- **Não** contei as 360 células uma a uma: confirmei a composição dos 43 `?` pelas duas tabelas §8 e
  auditei dirigidamente as 5 do núcleo, as 12 de leitura e as 2 do caminho crítico. As **20 de ato
  fiscal irreversível não foram auditadas uma a uma** — não encontrei caminho que as leia como
  permissão, o que não é o mesmo que dizer que estão certas. Está declarado no §5 do relatório, junto
  das outras cinco coisas que não verifiquei.

MEMÓRIA SUGERIDA:
  - type=gotcha escopo=plataforma camada=seguranca slug=celula-negada-por-omissao-nao-e-falha-fechado —
    "negado por omissão" só é falha-fechado se a célula for autoridade única sobre autorização e se
    nenhum canal alternativo (origem (i) de superfície, `RN` dona concedendo em prosa) entregar o mesmo
    dado com outro nome. Achados `AUT-05` e `AUT-08`.
  - type=gotcha escopo=plataforma camada=seguranca slug=autoridade-derivada-sobrevive-a-fonte —
    delegação e autoridade retida herdam poder de uma atribuição e **não** morrem com ela na spec
    atual; contenção não gera retenção, mas derivação temporal sem cascata reinstala o gerente demitido
    um salto adiante. Achados `AUT-03` e `AUT-04`.
  - type=business-rule escopo=plataforma camada=seguranca slug=piso-de-configuracao-de-cliente — quatro
    itens candidatos ao piso de `RN-NUC-023` com cenário: marca de exigência de terceiro, limite do
    próprio papel (inclusive por delegação), exceção pré-autorizada de teto offline, e "quem assume"
    diferente do autenticado. Entrada de `LACUNA-NUC-013`; a decisão é do humano.

PRÓXIMO PASSO SUGERIDO: `produto` — passada de correção dirigida, **sem reabrir escopo**: as três
divergências nos arquivos donos (`AUT-04`, `AUT-11` e a nota N1), a precedência da célula (`AUT-08`), a
resolução escopada de venda por referência humana (`AUT-01`), "quem assume" (`AUT-07`) e a origem (i)
(`AUT-05`). O que depende de decisão do humano (`AUT-02`, `AUT-03`, `AUT-09`, `AUT-10` e a `AUT-06`, que
quer consulta a `ui`) vai junto das 5 lacunas do passo 5, numa pergunta só — não como despacho.

## produto (correção pós-gate, bloco autoridade) — 2026-08-23

## RELATÓRIO — produto — T-0003 (correção pós-gate, bloco autoridade e validade)

STATUS: OK

FEITO:
- **Decidi a colisão que travava `PN-01`** (§5 do dossiê de D-03 + `AUT-04`), e a decisão é: **o ato
  ordinário de venda não se sustenta na autoridade retida da pessoa.** Ele se sustenta em (i) o terminal
  estar habilitado a vender por aquele estabelecimento — fato estabelecido com contato, retido — e (ii) o
  operador estar **identificado**, para o fato ter autor. Duas regras novas: **`RN-OFF-032`** (identificar
  ≠ autorizar; o que sustenta o ato ordinário) e **`RN-OFF-033`** (o meio de identificação retido é
  **terceira categoria**, identifica e não autoriza, e reconcilia). Ambas em
  `fila-local-conteudo-e-repouso.md` §3.1, com os quatro campos e o aceite do minuto seguinte ao
  vencimento.
- Emendei `RN-OFF-024`: (b) passou de "recusada até **reautenticar**" para "até **reconectar**", e o
  enunciado declara que a regra governa **só operação sensível**. A validade agora pode ser curta sem
  parar o balcão — o compromisso de `LACUNA-OFF-011` foi reescrito por isso.
- Emendei `RN-NUC-009`: precondição deixou de exigir papel retido dentro da validade (era o elo que
  fechava o ciclo), passou a exigir operador identificado + terminal habilitado, e declara **"quem assume
  é o operador identificado"**. Infeliz (b) reescrito, (c) novo.
- **`AUT-07`:** criei **`RN-NUC-037`** — abrir sessão em nome de outro é operação distinta, com dois
  sujeitos (assumida por / aberta por), pelo mesmo padrão que `RN-NUC-030` usou no fechamento. A célula da
  linha 11 passou a ter onde ser verificada.
- **`AUT-03`:** `RN-NUC-021` reescrita — delegação é autoridade **derivada** e **morre em cascata** com a
  atribuição que a originou; a cláusula sem referente ("prazo não maior que o da atribuição") foi
  substituída por teto próprio (`LACUNA-NUC-034`) + janela de tempo da atribuição quando existe. **Não dei
  vigência à atribuição** — ver DECISÕES.
- **`AUT-04`:** propaguei a leitura adotada para o texto dos arquivos donos, lendo cada ocorrência.
- **`AUT-09`:** `RN-NUC-024` (e) passou a negar em absoluto capacidade de assinar (`RN-EMI-033`), ato sobre
  ela (`RN-EMI-036`/`037`) e valor de segredo de emissão (`RN-EMI-007`).
- **`AUT-10`:** `RN-NUC-024` (d) passou a exigir que cada ato registre **qual concessão** o autorizou, e
  que a **leitura** dessa trilha seja operação própria do `owner` — **sem ela não há concessão**. Amarrei a
  concessibilidade à existência do leitor, que é o que mantém `provider_support` corretamente inerte.
- **`AUT-11`:** `RN-OFF-011` passou de "um papel" para "**uma atribuição**" (`queue_owner`), com aceite
  ligado ao gate de `RN-NUC-020`.
- Respondi as duas perguntas que `backend` roteou (ver PERGUNTAS respondidas, abaixo).

ARQUIVOS:
- `docs/produto/fila-local-conteudo-e-repouso.md` (editado) — §3.1 nova com `RN-OFF-032`/`033`;
  `RN-OFF-024` emendada; ressalva no item 1 de `RN-OFF-023`; `C-09` e `C-10` atualizados;
  `LACUNA-OFF-011` reescrita, `015` e `016` novas. **395 linhas.**
- `docs/produto/nucleo-caixa-e-turno.md` (editado) — `RN-NUC-009` e `RN-NUC-011` emendados, `RN-NUC-012`
  aceite; §2 nova com `RN-NUC-037`.
- `docs/produto/papeis-atribuicao-e-delegacao.md` (editado) — §1.1 nova (terceira categoria);
  `RN-NUC-021` reescrita; `RN-NUC-023` aceite; `RN-NUC-024` (d) e (e); §6 tabela do `cashier` e §6.1 nova.
- `docs/produto/papeis-e-permissoes.md` (editado) — tabela de `RN-NUC-019` (autoridade retida do
  `cashier`), §4.2, §5 (dois requisitos novos para D-03), §6 (`LACUNA-NUC-034`).
- `docs/produto/operacao-offline-e-sincronizacao.md` (editado) — `RN-OFF-007` nota de 2026-08-23;
  `RN-OFF-011` enunciado, aceite e infeliz.
- `docs/produto/matriz-operacao-papel.md` (editado) — **só** o parágrafo de `reautenticar` da §7,
  **10 linhas trocadas por 10**; nenhuma célula tocada; arquivo permanece no tamanho em que estava.
- `docs/produto/superficie-por-papel.md` (editado) — **só** as linhas 93–94, 2 por 2.
- `docs/auditorias/2026-08-23-autorizacao-papeis-e-superficie.md`,
  `docs/arquitetura/d-03-identidade-opcoes.md` (só leitura).

NÃO FEITO: —

DECISÕES:
1. **O ato ordinário não depende da autoridade da pessoa** (a alternativa era manter a dependência e
   aceitar validade longa). Trade-off: um operador **desligado** continua identificável naquele terminal
   até a reconciliação, e pode concluir venda — com autor registrado. Aceitei explicitamente, e está no
   infeliz (c) de `RN-OFF-032`: a exposição do ato ordinário é limitada (registra fato que **entra**, com
   autor, conferido por `RN-NUC-010`), enquanto a do ato sensível não é — por isso só o sensível tem prazo
   curto. O número a apertar deixou de ser `LACUNA-OFF-011` e passou a ser `LACUNA-OFF-016`.
2. **A decisão vale nas três opções de D-03**, e não escolhe nenhuma: ela repousa sobre requisito já
   aprovado e independente de D-03 — terminal é dispositivo **vinculado a um estabelecimento**
   (`glossario.md`, R-14 do dossiê). Declarei isso dentro de `RN-OFF-032` como fronteira: opção que não
   entregue (i) retido no terminal **não satisfaz a regra**. Ver RISCOS 1 — divirjo de uma frase do dossiê.
3. **Não dei vigência à atribuição** para consertar `AUT-03`. Custo da alternativa, que é o motivo: dar
   vigência à atribuição a transforma em dado com prazo retido no terminal, que é exatamente o que §1 de
   `papeis-atribuicao-e-delegacao.md` fecha (o gerente demitido às 19h). A cascata resolve pelo lado
   certo — a atribuição segue sem vigência, e morre o que **deriva** dela. Custo real que aceito e declaro:
   revogar atribuição passa a ser um ato com efeito em N delegações, o registro tem de nomear as duas
   coisas, e sem contato o efeito só chega na reconexão (como qualquer revogação, `RN-OFF-024`c).
4. **`AUT-10` resolvido de dentro do meu território.** `RN-NUC-029` mora em `matriz-operacao-papel.md`,
   que neste despacho é restrito. Em vez de furar, pus a cláusula em `RN-NUC-024`(d), que é a regra **dona**
   do papel: cada ato registra qual concessão autorizou, e a leitura é operação própria do `owner`. O texto
   de `RN-NUC-029` ainda diz só "atribuição" — edição do segundo despacho, listada abaixo.
5. **Criei regra nova em vez de emendar, em três casos**, e o motivo é o mesmo: emenda não bastava porque
   faltava **operação/categoria**, não redação. `RN-OFF-032` e `RN-OFF-033` porque `RN-OFF-024` não podia
   ao mesmo tempo governar a validade e declarar o que sobrevive a ela sem virar duas regras num heading;
   `RN-NUC-037` porque `AUT-07` é exatamente a falta de um **lugar** onde a célula seja verificada, e
   lugar não se cria por emenda. Nada renumerado: `RN-OFF-032`/`033` seguem `031`
   (`offline-grandezas-e-orcamento.md`), `RN-NUC-037` segue `036` (`superficie-por-papel.md`).

RISCOS:
1. **Divirjo de uma frase do dossiê de D-03** (§5, última linha): ele afirma que na Opção **B** "o único
   sustentáculo do ato ordinário é a autoridade da pessoa". Isso conflaciona duas coisas — ser **portador
   do tenant na requisição** (o que B não é) e reter a **habilitação de vender** (que R-14 exige em
   qualquer opção, e que o próprio §3.2 do dossiê já supõe ao dizer que em B o terminal também recebe
   cópia dos verificadores). Se eu estiver certo, `RN-OFF-032` é satisfeita nas três opções e nada em D-03
   fica bloqueado por ela. Não é meu domínio confirmar: `docs/arquitetura/**` não é meu território, e a
   frase precisa de revisão por quem escreveu o dossiê.
2. **`fila-local-conteudo-e-repouso.md` está em 395 linhas.** A próxima regra que entrar ali obriga a
   partir o arquivo. O eixo natural de corte já está visível: **conteúdo e repouso** (`021`–`023`, `027`)
   × **autoridade e identidade** (`024`–`026`, `032`, `033`), com nomes irmãos. Não parti agora porque não
   era o pedido e porque partir arquivo no mesmo despacho que muda a regra dele dobra o diff.
3. **`glossario.md` não é meu neste despacho e ficou devendo três termos** que eu introduzi e que vão
   virar identificador: *ato ordinário*, *meio de identificação retido*, *terminal habilitado a vender por
   um estabelecimento*. Glossário é autoridade única de vocabulário; sem essas entradas o segundo despacho
   ou a Fase 1 vão inventar nome.
4. **A terceira divergência (N1, quem concede delegação) continua em pé** entre `RN-NUC-023`(b) e o aceite
   de `RN-NUC-021`, e eu não a toquei — não estava no despacho. A cascata que escrevi é acionada por
   revogar **atribuição**, que é inequivocamente de `owner` nas duas leituras, então não criei conflito
   novo. Mas quem fechar N1 precisa reler `RN-NUC-021`b.
5. **`RN-OFF-033` cria uma coisa retida no terminal antes de `LACUNA-OFF-012` fechar.** Escrevi o infeliz
   (a) com a mesma ordem de `RN-OFF-021` — gate de `seguranca` **precede** a construção — mas isto é
   requisito de produto sobre um alvo em repouso, e merece o gate como achado próprio, não de carona.

VERIFICAÇÃO: não rodei nada — não há código, e o entregável é spec. O que **conferi em disco**, arquivo e
linha, antes de escrever:
- as três pontas do ciclo de `PN-01`: `papeis-atribuicao-e-delegacao.md:190` (autoridade retida do
  `cashier` "obrigatória"), `nucleo-caixa-e-turno.md:26,31,42` (`RN-NUC-009` precondição e infeliz b),
  `fila-local-conteudo-e-repouso.md:111-135` (`RN-OFF-024`, as quatro cláusulas). Confirmei que o ciclo
  fecha como o brief descreve, e que a validade não tem valor (`fila-local:246`, `LACUNA-OFF-011`).
- `papeis-e-permissoes.md:123` — a **quarta** ponta do mesmo ciclo, que o brief não citou e que dizia a
  mesma coisa falsa; corrigida junto, senão a contradição sobreviveria num arquivo irmão.
- todas as ocorrências de `reautentic` em `docs/produto/**`, uma a uma — **21 linhas**: as 18 que o brief
  listou, mais `matriz-operacao-papel.md:24`, `superficie-por-papel.md:35` e
  `fiscal-custodia-e-trilha.md:354`, que ele não citou. Reescrevi as que prometiam o caminho sem contato
  (`fila-local:116,126,230,233,248,250,260` — as três últimas eram o texto de `LACUNA-OFF-011` e as
  perguntas ao humano —, `nucleo-caixa-e-turno:42,91`, `operacao-offline:88`,
  `superficie-por-papel:93-94`, `matriz:340-341`). **Deixei intactas** as corretas:
  `matriz:24` e `:217` e `superficie-por-papel:35` (declaram que autenticar/reautenticar são D-03, o que
  continua verdade), `fiscal-custodia-e-trilha:354` (é sobre reautenticar **com** rede, custo de medida),
  e as de `papeis-atribuicao-e-delegacao` §6.1 e `papeis-e-permissoes:265`, que agora **narram** a
  divergência resolvida em vez de prometê-la.
- numeração antes de criar: maior `RN-NUC` = `036` (`superficie-por-papel.md:87`), maior `RN-OFF` = `031`
  (`offline-grandezas-e-orcamento.md:74`), maior `LACUNA-NUC` = `033`, maior `LACUNA-OFF` = `014`.
  Nada renumerado.
- `matriz-operacao-papel.md:397-400` (`LACUNA-NUC-016`, "até decidir, a linha 11 é negada a todos") —
  conferi que `RN-NUC-037` **não** contradiz: ela cria o lugar de verificar, e o valor da célula continua
  do humano.
- tamanho depois de cada edição, por leitura do fim do arquivo: `matriz-operacao-papel.md` **inalterado**
  (10 linhas trocadas por 10; `:400` continua sendo a última), `fila-local` 395, `papeis-atribuicao` 359.
  Nenhum arquivo passou de 400.

PERGUNTAS respondidas (as duas que `backend` roteou):
1. *O ato ordinário do caixa depende da autoridade retida do operador, ou basta o cadastramento do
   terminal mais identificação?* → **Basta o cadastramento do terminal mais a identificação.**
   `RN-OFF-032`. Escrito uma vez e citado nos dois lugares (`RN-NUC-009` precondição e `RN-OFF-024`
   enunciado).
2. *O meio de prova de identidade retido é terceira categoria ou atributo de uma das duas?* → **Terceira
   categoria**, `RN-OFF-033` e `papeis-atribuicao-e-delegacao.md` §1.1. A razão é testável: como artefato
   publicado ela nunca expiraria; como autoridade retida ela pararia o balcão ao expirar. E `C-09` passou
   a mencioná-la, com o terminal furtado perdendo a habilitação de vender.

PERGUNTAS:
  - para humano: `LACUNA-OFF-016` — qual a janela de reconciliação do conjunto de meios de identificação?
    Ela **substituiu** `LACUNA-OFF-011` como o número que governa "o desligado para de operar", e é a
    única grandeza nova que a decisão do item 1 introduziu. Unidade declarada, valor em aberto.
  - para humano: `LACUNA-NUC-034` — qual o teto do prazo de uma delegação? Sem ele, `RN-NUC-021`a fica
    com a forma certa e sem número, e a cascata é a única contenção real.
  - para humano: `RN-NUC-024` ficou com "sem leitor não há concessão". Isso **atrasa** a primeira
    concessão de `provider_support` até a operação de leitura existir com célula. É o desfecho que eu
    afirmo correto (`AUT-10`, N4 da auditoria), mas é escopo/prazo, e escopo é seu.

MEMÓRIA SUGERIDA:
  - type=business-rule escopo=plataforma camada=produto slug=ato-ordinario-nao-depende-de-autoridade-de-pessoa
    — o ato ordinário de venda se sustenta em terminal habilitado + operador identificado (`RN-OFF-032`),
    nunca em autoridade retida; vencer a validade tira o alcance sensível, não o balcão.
  - type=decision escopo=plataforma camada=produto slug=tres-categorias-de-coisa-retida-no-terminal
    — terminal retém três coisas de naturezas distintas: artefato publicado (versão/vigência), autoridade
    retida (validade) e meio de identificação (reconciliação); pendurar a terceira numa das duas dá
    resposta errada em direções opostas.
  - type=convention escopo=plataforma camada=produto slug=reautenticar-sem-contato-nao-existe
    — nenhuma superfície e nenhuma regra oferece "reautenticar" sem rede; o texto é sempre "reconectar".
  - type=business-rule escopo=plataforma camada=produto slug=delegacao-morre-com-a-atribuicao-de-origem
    — delegação é autoridade derivada: revogar a atribuição do delegante revoga em cascata, no mesmo ato.
  - type=gotcha escopo=plataforma camada=produto slug=regra-dona-versus-arquivo-derivado
    — corrigir a leitura só no arquivo derivado (matriz, superfície) deixa o texto da regra dona
    autorizando o que a leitura proíbe; foi o que fez `AUT-04` e `AUT-11` sobreviverem a dois passos.
    Sintoma: "a correção é de quem edita aquele arquivo" escrito num arquivo derivado.

PRÓXIMO PASSO SUGERIDO: `produto` — segundo despacho (superfície, matriz e limpeza). O que **este**
despacho deixou explicitamente para ele, e por quê:
  1. `RN-NUC-029` (`matriz-operacao-papel.md:126`) passar a dizer "a atribuição **ou a concessão** que
     autorizou" — a substância está em `RN-NUC-024`(d); falta o texto da regra do registro.
  2. Célula da **linha 11** citando `RN-NUC-037`, e a linha 22 / demais citações da matriz que apontam
     para as regras que mudaram. Não toquei em célula.
  3. O parágrafo de `RN-OFF-011` na §7 da matriz (`:350-355`) ainda diz "a correção é de quem edita aquele
     arquivo" — a correção foi feita. Não o editei porque a permissão deste despacho na matriz era só as
     citações de `reautenticar`.
  4. `AUT-01` (resolução escopada de venda por referência humana), `AUT-05` (origem (i)), `AUT-06` (com
     consulta a `ui`), `AUT-08` (precedência da célula) e `AUT-02` — nenhum deles tocado aqui.
  5. `glossario.md`: os três termos de RISCOS 3.

## produto (correção pós-gate, bloco superfície e matriz) — 2026-08-23

## RELATÓRIO — produto — T-0003 (correção pós-gate, bloco superfície e matriz)

STATUS: OK

FEITO:
- **`AUT-05`, e concordo com o achado.** Estreitei `RN-NUC-035`: a origem (i) passou a ter **duas formas
  nomeadas** — **(i.a)** objeto que o próprio ator **criou ou porta**, e **(i.b) leitura derivada**, que é
  o caso do objeto de outra pessoa e vale **só** para os campos que a **`RN` dona da operação enumera**,
  com registro, para **um** objeto, nunca lista/filtro/ordenação/exportação, e **nunca o conteúdo quando a
  decisão exige o inventário**. Sem enumeração na `RN` dona não existe leitura derivada.
- **Não deixei as duas operações sem suporte** — e é aqui que divirjo do desfecho que o brief temia. Em vez
  de mandar linha 13 e linha 30 para origem (iii) (célula `?`, logo sem tela), **enumerei o que cada
  decisão exige na `RN` dona**: `RN-NUC-030` ganhou os **seis campos** do fechamento de sessão alheia (de
  quem era, posto, instante de abertura, esperado, contado, diferença) e `RN-OFF-016` ganhou os **seis
  campos do inventário** da fila (quantos, de que tipo, de que terminal, desde quando, prazo mais próximo,
  desfecho por item). O que saiu de cena é **exatamente** o que a auditoria provou vazar e que **nenhuma
  das duas decisões exigia**: a trilha do que aconteceu dentro da sessão, e o **conteúdo** do item de fila.
  Ver DECISÕES 1.
- **`AUT-06`.** `RN-NUC-036` passou a declarar **duas formas de chegada, e só duas**: `A:<papel>` é a única
  negação **ofertada** antes de qualquer pedido; as três negações são, no resto, **resposta a pedido
  nomeado pelo operador**, por um canal que **não enumera** — quem nomeia é o operador. Omissão continua
  sendo o desfecho de `N` sem caminho e de `?`. Acrescentei a cláusula que dissolve o falso dilema:
  **estado do objeto não é autoridade** ("este posto está sem sessão aberta" é origem (i) e é dito sempre).
  Aceite escrito com o caso das 6h da manhã. §4 da superfície ganhou os itens 4 e 5 reescritos e o item 6.
- **`AUT-01`.** Criei **`RN-NUC-038`** em `nucleo-venda.md`: venda, pagamento e movimento de caixa são
  resolvidos **dentro** do escopo resolvido da identidade autenticada, identificador informado é entrada de
  busca e nunca endereço, e "não existe aqui" e "existe em outro escopo" têm a **mesma** resposta. Emendei
  a precondição de `RN-NUC-008` e o enunciado de `RN-NUC-003`. Abri **`LACUNA-NUC-036`** (existe operação
  de localizar venda de outro estabelecimento do mesmo cliente?), irmã de `LACUNA-NUC-019`.
- **`AUT-08` — a correção estrutural.** Criei **`RN-NUC-039`**: **a célula é a autoridade única sobre
  autorização** e prevalece sobre papel nomeado em prosa em qualquer `RN`, inclusive na dona da operação;
  papel em prosa é candidato, não concessão; a célula é o **teto** (concessão estreita, configuração só
  concede onde a célula é `N·cfg`). Com aceite de conformidade verificável por busca. Anotei o conflito em
  `LACUNA-NUC-019`: o caminho está fechado pela precedência, mas o **texto** de `RN-EMI-039` continua
  apontando `RN-EMI-036` — ver PERGUNTAS.
- **`AUT-02`.** Parti a linha 18 em **cinco** (18 catálogo e preço · 36 limite por papel · 37 meio de
  pagamento e a marca "exige autorização de terceiro" · 38 configuração · 39 exceção pré-autorizada),
  **sem mudar valor de célula nenhum**. Criei **`RN-NUC-040`**: a **unidade de delegação é a linha**;
  **quatro linhas não são delegáveis** (19, 36, 37, 39 — as que publicam a **trava** da autoridade); e o
  **ponto de aplicação** do piso de `RN-NUC-023` — autoridade de publicar recebida **por delegação** nunca
  alcança papel que o delegatário porta, enquanto quem porta a meta-autoridade por **atribuição** segue
  publicando o que os papéis abaixo autorizam, inclusive quando também os porta (a padaria de uma pessoa
  não foi quebrada). Abri **`LACUNA-NUC-035`** para a metade que não é minha: a marca é publicável pelo
  cliente ou é do módulo dono do meio?
- **Parti `matriz-operacao-papel.md`** (estava em exatamente 400 linhas) no eixo **contrato da célula × as
  células** — ver DECISÕES 3.
- **Costura do primeiro despacho:** `RN-NUC-029` passou a dizer "a atribuição **ou a concessão** que
  autorizou", com aceite próprio para `provider_support`; a célula da linha 11 passou a citar
  `RN-NUC-037`, com nota explicando que o **valor** continua do humano; o parágrafo de `RN-OFF-011` na §7
  passou a registrar que a regra dona **foi** corrigida; três termos entraram no `glossario.md`.
- **Limpeza:** "operação sensível" no glossário passou a cobrir reimpressão, e o critério ficou explícito
  (ver DECISÕES 4); as **seis linhas de `PER`** entraram na §4 do contrato de offline, transcritas de
  `RN-PER-008` — antes disso, por escrito, o PDV offline não imprimia e não abria gaveta; `RN-OFF-006`
  passou a distinguir **recurso escasso enumerável** (faixa pré-alocada) de **recurso único e local**, com
  a **gaveta** como o exemplo nomeado do segundo, com aceite próprio — que era a divergência interna entre
  o enunciado dela e a §4.

ARQUIVOS:
- `docs/produto/matriz-operacao-papel-contrato.md` (**novo**, 245 linhas) — §1 a §3 vindas do arquivo base
  **sem alteração de conteúdo** (exceto a emenda de `RN-NUC-029`), mais `RN-NUC-039` e `RN-NUC-040`.
- `docs/produto/matriz-operacao-papel.md` (editado, **349** linhas) — cabeçalho; §1–§3 removidas com os
  números deixados vagos; tabela §4 com 39 linhas e as notas ¹¹ ¹² ¹³; `RN-NUC-030` com os seis campos;
  §7 com a divergência de `RN-OFF-011` fechada e a **quarta** divergência (piso × ponto de aplicação); §8
  recontada (39 × 5 = 195, 5 `?`); §9 com `LACUNA-NUC-035`.
- `docs/produto/matriz-operacao-papel-modulos.md` (editado, 258) — cabeçalho dos três arquivos; §7 com a
  porta de trás de `AUT-05` fechada; §8 consolidada (76 / 380 / 43, 11%); `LACUNA-NUC-019` com o conflito
  de `AUT-08`.
- `docs/produto/superficie-por-papel.md` (editado, 301) — `RN-NUC-035` e `RN-NUC-036` reescritas nas
  partes citadas; §2 (M7); §4 itens 4, 5 e 6 novo; §5 recontado e com a nota de que a contagem antiga era
  otimista pelo lado errado.
- `docs/produto/superficie-por-papel-momentos.md` (editado, 270) — cabeçalho com (i.a)/(i.b); §2.2 e §2.3
  remarcadas; §3.1 com as linhas de publicação partidas e a delegação atualizada; §5 com `AUT-10`.
- `docs/produto/nucleo-venda.md` (editado, **383**) — `RN-NUC-038` nova; `RN-NUC-003` e `RN-NUC-008`
  emendados; `LACUNA-NUC-036` nova.
- `docs/produto/operacao-offline-e-sincronizacao.md` (editado, 351) — `RN-OFF-006` com as duas naturezas;
  seis linhas de `PER` na §4 com a nota de por que faltavam; `RN-OFF-016` com o inventário enumerado.
- `docs/produto/glossario.md` (editado, **395**) — `sales_enabled_terminal` em §1.1;
  `retained_identification_means`, `ordinary_act` e "operação sensível" reescrita em §1.6; a nota das
  "duas coisas" virou três.
- Só leitura: `docs/auditorias/2026-08-23-autorizacao-papeis-e-superficie.md`,
  `papeis-atribuicao-e-delegacao.md`, `papeis-e-permissoes.md`, `nucleo-publicacao-e-texto.md`,
  `fila-local-conteudo-e-repouso.md`, `fiscal-custodia-e-trilha.md`, `modulos/perifericos.md`,
  `modulos/perifericos-classes.md`.

NÃO FEITO: —

DECISÕES:
1. **`AUT-05`: aceitei a premissa e recusei o mecanismo proposto**, e as quatro partes estão na regra. A
   correção sugerida era mandar os dois casos para origem (iii); como a célula é `?`, o efeito seria
   **fechar a sessão de outro e transferir fila sem suporte de informação** — duas operações de retaguarda
   e uma delas no caminho do dinheiro. **Necessidade preservada:** quem fecha a sessão de quem foi embora
   precisa do esperado e da diferença, senão o fechamento é número cego e a responsabilidade pelo fundo
   (`RN-NUC-004`, motivo) deixa de existir. **Mecanismo recusado:** origem (i) como "o objeto da operação",
   sem qualificar de quem é o objeto — ele entrega o registro de trabalho de outra pessoa e, na linha 30, a
   fila inteira. **Mecanismo nosso:** leitura derivada com **enumeração de campo na `RN` dona**.
   **Por que é melhor e como se prova:** o alvo deixa de ser "o objeto" e passa a ser uma **lista finita e
   auditável** de campos, que se confere por busca (`RN` dona × campo exibido); e o caso da linha 30 mostra
   que a decisão nunca precisava do conteúdo — transferir é decidir sobre **inventário**. As 12 células `?`
   passaram a ser falha-fechado de verdade; antes não eram, e nós afirmávamos que eram.
2. **`AUT-06` resolvido pelo eixo "oferta × resposta", não afrouxando a omissão.** A alternativa era
   permitir nó desabilitado para célula `?`, que colide com `ui.md` e revela que o recurso existe. Custo
   que aceito e declaro: o produto passa a **exigir** um canal de pedido nomeado, e esse canal é um
   requisito novo para `backend` e `ui` na Fase 2/3 — sem ele, a terceira negação continua inalcançável.
   Ganho: a negação passa a ser resposta a algo que o operador nomeou, então ela nunca enumera.
3. **Corte da matriz no eixo "contrato da célula × as células"**, com o **arquivo base mantendo a tabela**
   e as §4 a §9. Alternativa recusada: levar a tabela para o arquivo novo — quebraria as citações de "§4",
   "§7", "§9" e "linha 17" que já existem em `modulos/perifericos.md`, `perifericos-classes.md`,
   `nucleo-caixa-e-turno.md` e nas duas superfícies. Custo real: `RN-NUC-026` a `029` mudaram de arquivo, e
   quem cita **path** para elas (nenhum arquivo hoje o faz — conferi) precisará do novo. §1, §2 e §3 do
   base ficaram **vagas de propósito**, pelo precedente de `nucleo-venda.md`.
4. **A ponta que cedeu no conflito de "operação sensível" foi o glossário**, não `RN-NUC-032` nem
   `.claude/rules/seguranca.md` §2. Motivo: o critério que une as seis operações não é "move dinheiro" — é
   **irreversível ou não conferível depois**, e é por isso que a defesa das seis é o registro. Reimpressão
   satisfaz o critério real e não o texto antigo; corrigir o texto é uma linha, e mudar `RN-NUC-032` para
   caber num critério estreito abriria a operação que a auditoria mais teme no balcão.
5. **Não parti a linha 37 em duas** (habilitar meio × publicar a marca). A correção completa de `AUT-02`
   tira a marca do cliente e a passa ao módulo dono do meio — e isso altera o conjunto **fechado** de
   `RN-NUC-013`, que não é meu arquivo. Fechei a metade que é minha (a marca deixou de ser alcançável por
   delegação) e deixei a metade de fronteira como `LACUNA-NUC-035`, com o desfecho de hoje declarado:
   `owner`, online, não delegável. Falha fechado; não presumi.
6. **Não classifiquei o fechamento do dia na §4 do contrato de offline**, embora `RN-NUC-031` aponte
   explicitamente para esse arquivo e eu tenha a permissão nele neste despacho. Fora do brief, e é
   classificação normativa de operação, não transcrição — as seis linhas de `PER` eu transcrevi porque
   `RN-PER-008` já as classificava. Fica em RISCOS.

RISCOS:
1. **`LACUNA-NUC-007` continua a única contradição aberta com `PN-01` no núcleo**, e ela está a uma linha
   de tabela de fechar pela metade do fechamento do dia: `RN-NUC-031` já classifica (classe 1 no fato, 2 na
   precondição; opera em D1 e D3 com a lista vazia, recusa em D2 sempre). Basta um despacho que autorize a
   linha. A metade de **turno** continua sem regra e não é isso.
2. **`glossario.md` está em 395 linhas e `nucleo-venda.md` em 383.** O próximo termo e a próxima regra
   obrigam a partir. Eixo natural do glossário: **léxico do núcleo (§1) × plataforma, ramo, módulo e
   numeração (§2 a §7)**; do núcleo de venda, o eixo já é operação e o corte seguinte é `RN-NUC-001`–`005`
   × `006`–`008`+`038`. Não parti agora: não era o pedido, e partir arquivo no mesmo despacho que muda a
   regra dele dobra o diff.
3. **`docs/produto/README.md:131` diz que `matriz-operacao-papel.md` "ainda não existe em disco"** e agora
   existem **três** arquivos da matriz. O arquivo não é meu neste despacho; a linha precisa ser corrigida
   por quem o edita, senão o mapa de `docs/produto/` mente sobre o conjunto mais citado do repositório.
4. **`RN-NUC-039` é a regra de maior alcance deste despacho e ela não se verifica sozinha.** Ela promete
   que "papel nomeado em prosa é candidato", e o aceite de conformidade é uma **varredura** — que eu não
   rodei (ver VERIFICAÇÃO). Enquanto ela não é varrida uma vez, existe a possibilidade de outros pares
   célula × prosa como o de `AUT-08` em módulos que eu não li.
5. **O canal de pedido nomeado de `RN-NUC-036` é requisito novo sobre território alheio.** Se `backend` ou
   `ui` concluírem que ele não é implementável sem enumerar, a regra volta para mim — e a alternativa que
   eu **não** aceito é nó desabilitado para célula `?`.
6. **A partição da linha 18 muda a base de contagem de todo relatório anterior** (72 → 76 operações, 360 →
   380 células). Atualizei as quatro ocorrências que encontrei nos meus arquivos; qualquer número de
   operação citado em memória ou em relatório de sessão anterior está defasado por construção.

VERIFICAÇÃO: não rodei nada — não há código, e o entregável é spec. O que **conferi em disco**, arquivo e
linha, antes e depois de escrever:
- os quatro achados que eu tratei, um a um, contra o texto citado: `superficie-por-papel.md:68-74`
  (origem (i)), `superficie-por-papel-momentos.md:110,123,130` (as três linhas que a auditoria nomeia, e o
  desconforto já registrado), `matriz-operacao-papel-modulos.md:150-155` (as 4 linhas de leitura, 12 `?`),
  `nucleo-venda.md:141,263` (`RN-NUC-003`, `RN-NUC-008`), `fiscal-custodia-e-trilha.md:263-267`
  (`RN-EMI-039`, a frase que concede), `nucleo-publicacao-e-texto.md:40-51` (a tabela dos nove artefatos,
  para partir a linha 18 pelo objeto certo), `fila-local-conteudo-e-repouso.md:78-109` (`RN-OFF-023`, os
  sete itens — é o que prova o conteúdo alcançável na linha 30).
- **numeração antes de criar:** maior `RN-NUC` = `037` (`nucleo-caixa-e-turno.md`), maior `LACUNA-NUC` =
  `034` (`papeis-e-permissoes.md`), maior `RN-PER` = `019`. Consumi `RN-NUC-038`, `039`, `040` e
  `LACUNA-NUC-035`, `036`. Nada renumerado, nenhuma célula alterada de valor.
- **contagem de célula, refeita à mão:** 39 linhas × 5 = 195 no núcleo; consolidado 76 linhas / 380
  células; `?` continua **5** no núcleo e **43** no total, porque as quatro linhas novas herdaram as
  células da linha 18. **Não** recontei as 43 uma a uma — herdei a contagem das duas tabelas de §8, como o
  passo anterior.
- **tamanho de cada arquivo depois de editar**, por contagem de linha: contrato 245, matriz 349, módulos
  258, superfície 301, momentos 270, núcleo de venda 383, offline 351, glossário 395. Nenhum acima de 400.
- **buscas de consistência:** `72 operações`/`35 linhas`/`175 células`/`360 células` → zero ocorrências
  restantes em `docs/produto/**`; citações de **path** para `matriz-operacao-papel.md` (excluídos os dois
  irmãos) → **23 ocorrências em 9 arquivos**, das quais 6 são da auditoria; li todas as de fora do meu
  território e nenhuma aponta para §1, §2 ou §3 — apontam para o arquivo em geral, para a linha 17, ou para
  §4, §6, §7 e §9, que ficaram onde estavam.
- **o que eu não conferi:** não reli as specs de módulo (`MSA`, `COZ`, `PCF`, `ATI`, `FIS`) procurando
  outros pares célula × prosa como o de `AUT-08`. `RN-NUC-039` é a regra que torna essa varredura possível;
  ela não foi feita. Ver RISCOS 4.

PERGUNTAS:
  - para humano: **`LACUNA-NUC-035`** — a marca "exige autorização de terceiro" de um meio de pagamento é
    artefato que o **cliente** publica sobre si mesmo, ou é do **módulo dono do meio** (`ADQ`/`PGO`/`PRZ`)?
    É a metade de `AUT-02` que eu não fecho: publicar a marca **desliga** a única precondição pela qual
    `RN-NUC-005` recusa sozinho. Hoje: `owner`, online, não delegável.
  - para humano: **`LACUNA-NUC-036`** — existe operação de localizar venda de outro estabelecimento do
    mesmo cliente? Hoje não existe, logo é negada a todos, e o caso real (comprou numa loja, voltou noutra)
    fica sem caminho. Se existir, é travessia entre pessoas jurídicas e passa por `seguranca` antes.
  - para o dono de `papeis-atribuicao-e-delegacao.md`: `RN-NUC-023` precisa carregar no **próprio texto** a
    cláusula (c) de `RN-NUC-040` (piso avaliado contra todo papel que o ator porta quando a autoridade veio
    de **delegação**). Hoje a leitura está declarada no arquivo derivado (§7 da matriz) — que é exatamente
    o padrão que fez `AUT-04` e `AUT-11` sobreviverem a dois passos.
  - para o dono de `nucleo-publicacao-e-texto.md`: `RN-NUC-013` continua listando "meios habilitados **e
    quais exigem autorização de terceiro**" como **um** artefato do cliente. Se `LACUNA-NUC-035` fechar do
    lado do módulo, é a tabela dele que muda; se fechar do lado do cliente, vale acrescentar ali a
    referência à linha 37 e à não-delegabilidade.
  - para o dono de `fiscal-custodia-e-trilha.md`: `RN-EMI-039` deixa de apontar `RN-EMI-036` e passa a
    apontar `LACUNA-NUC-019`. O caminho já está fechado por `RN-NUC-039` (vence a célula), mas o texto
    continua concedendo em prosa a quem `LACUNA-NUC-019` diz que **não é** o papel.
  - para `backend`: o canal de **pedido nomeado** de `RN-NUC-036` — o operador nomeia uma operação que a
    superfície dele não oferece e recebe uma das três negações com o caminho. Isso é implementável **sem**
    o servidor devolver, em qualquer forma, a lista do que ele não alcança?
  - para `ui`: mesma pergunta pelo lado do cliente — nomear a operação pretendida sem escolher de uma lista
    é compatível com "fluxo completável sem tocar a tela" (teclado e leitor como primeira classe)?

MEMÓRIA SUGERIDA:
  - type=business-rule escopo=plataforma camada=produto slug=celula-e-autoridade-unica-sobre-autorizacao
    — onde a célula da matriz e o texto de qualquer `RN` discordarem sobre quem pode praticar uma operação,
    vence a célula (`RN-NUC-039`); papel nomeado em prosa é candidato, nunca concessão.
  - type=business-rule escopo=plataforma camada=produto slug=leitura-derivada-tem-campo-enumerado
    — ver o objeto de outra pessoa dentro de uma operação autorizada alcança só os campos que a `RN` dona
    enumera, com registro, para um objeto — nunca lista, filtro nem o conteúdo quando a decisão exige o
    inventário (`RN-NUC-035` i.b).
  - type=gotcha escopo=plataforma camada=produto slug=celula-negada-que-vaza-pela-operacao-vizinha
    — sintoma: "isto é o objeto da própria operação, não precisa de célula". Foi assim que o dado das 12
    células `?` ficou alcançável por operações `P`/`R` (`AUT-05`); a matriz parecia falha-fechado e não era.
  - type=business-rule escopo=plataforma camada=produto slug=delegacao-nao-alcanca-a-trava-de-autoridade
    — a unidade de delegação é a linha da matriz, e quatro linhas não são delegáveis: as que publicam
    limite por papel, o que cada papel autoriza, a marca "exige autorização de terceiro" e a exceção
    pré-autorizada (`RN-NUC-040`).
  - type=business-rule escopo=plataforma camada=produto slug=venda-resolvida-dentro-do-escopo-autenticado
    — referência humana é única só por estabelecimento, então localizar venda/pagamento resolve **dentro**
    do escopo da identidade autenticada, e "não existe" e "é de outro escopo" têm a mesma resposta
    (`RN-NUC-038`).
  - type=convention escopo=plataforma camada=produto slug=negacao-e-resposta-nao-e-catalogo
    — só `A:<papel>` é negação ofertada; as outras duas são resposta a pedido **nomeado pelo operador**, e
    o canal do pedido nunca enumera o que o papel não alcança (`RN-NUC-036`).
  - type=state escopo=plataforma camada=produto slug=matriz-operacao-papel-tem-tres-arquivos
    — o conjunto da matriz passou a três arquivos em 2026-08-23: contrato da célula (`026`–`029`, `039`,
    `040`), núcleo (tabela, `030`–`032`) e módulos (`033`). Remover quando o mapa de `docs/produto/` for
    corrigido.

PRÓXIMO PASSO SUGERIDO: `seguranca` — reauditoria dirigida de **três** pontos, e só três: (1) a leitura
derivada de `RN-NUC-035` (i.b) fecha `AUT-05` sem abrir um canal novo, dado que ela agora depende da
enumeração em `RN-NUC-030` e `RN-OFF-016`? (2) o canal de pedido nomeado de `RN-NUC-036` é enumerável por
diferença — quem pede mil operações aprende o mapa do que não alcança? (3) `RN-NUC-039` posta como
autoridade única, existe outro par célula × prosa nas specs de módulo que eu não li (RISCOS 4)? Depois
disso, o humano nas cinco lacunas (`035`, `036`, mais `013`, `016`, `019`).

## produto (propagação pós-gate) — 2026-08-23

## RELATÓRIO — produto — T-0003 (propagação pós-gate)

STATUS: OK

FEITO:
- **Item 1 — `RN-NUC-023` carrega a cláusula (c) de `RN-NUC-040` no próprio texto**, como cláusula **(d)**
  dela, com motivo próprio (sem ponto de aplicação, o piso tinha um único caso escrito e a autoexpansão
  passava por fora dele em dois passos) e **dois casos de aceite que se conferem um contra o outro**
  (delegatário da linha 20 que porta `cashier` → negado, com a mensagem nomeando qual das duas travas o
  barrou; dono da padaria que porta `owner` e `cashier` → autorizado). Fechei nos **dois** lados: os
  textos de `matriz-operacao-papel.md` §7 (quarta divergência) e de `RN-NUC-040`, infeliz, que diziam "a
  correção é de quem edita o arquivo dele", passaram a registrar que a correção **foi feita**.
- **Item 3 — `RN-EMI-039` deixou de conceder em prosa.** O enunciado não nomeia mais papel: declara que
  quem pratica a consolidação **não está decidido** (`LACUNA-NUC-019`), logo a operação é negada a todos
  (`RN-NUC-026`). Ganhou parágrafo de correção datado, uma cláusula de aceite (o pedido é recusado
  **citando a célula**, nunca autorizado por esta prosa) e infeliz reescrito. Costurado nos dois arquivos
  derivados: `LACUNA-NUC-019` e o motivo/aceite de `RN-NUC-039` passaram ao passado, e o aceite de
  `RN-NUC-039` declara **por que continua válido** (testa a recusa, não a redação).
- **Item 4 — varredura de `RN-NUC-039` feita.** Dois achados de prosa que **concede** o que a matriz nega
  (os dois em `REL`), quatro sítios de prosa que nomeia papel **sem** citar a célula, e sete sítios já
  conformes. Detalhe em DECISÕES 1 e em VERIFICAÇÃO. Abri **`LACUNA-NUC-037`** (quem lê relatório de
  gestão) porque `REL` **não tem nenhuma linha** nas três matrizes — a prosa dele decidia autorização por
  ausência de célula, que é `AUT-08` outra vez, em outro módulo.
- **Item 2 — `RN-NUC-013` alinhada à partição da linha 18.** A tabela dos artefatos passou a declarar a
  correspondência **artefato → linha da matriz** (18, 19, 36, 37, 38, 39) e **quais são as quatro de
  trava, não delegáveis**; a linha do meio de pagamento carrega `LACUNA-NUC-035` e o "não delegável"; a
  coluna "Quem publica" foi rebaixada explicitamente a "o autor é do cliente e o ato é online — **quem**
  é a célula" (`RN-NUC-039`); e o aceite ganhou o caso pelo lado do artefato (nenhuma versão de limite,
  marca ou exceção nasce com autor que recebeu autoridade por delegação).
- **Item 5 — `README.md` corrigido e completado.** A linha "a matriz ainda não existe em disco" saiu;
  entraram **nove** arquivos que existiam e não estavam no mapa (as três matrizes, as duas superfícies, os
  dois de `PER`, os dois de `REL`), duas linhas na porta de entrada, a convenção de `RN-NUC-039`, e as
  faixas de numeração corrigidas (núcleo de venda `001`–`016` + `037`/`038`; offline `001`–`033`). Tirei
  o número "31 entradas" do catálogo de offline, que está defasado (ver RISCOS 3).
- **Item 6 — `LACUNA-NUC-007` fechada pela metade.** Transcrevi a classificação de `RN-NUC-031` para a §4
  do contrato de offline: **`degradado` em D1 e D3, recusa em D2, classe 1 no fato + 2 na precondição** —
  confere linha a linha com a nota ¹⁰ da matriz. Com isso "fechar o dia offline é recusado" deixou de ser
  verdade no repositório, e propaguei para os cinco lugares que o afirmavam. A metade de **turno**
  permanece aberta, com o motivo explícito de que a resposta é do humano.

ARQUIVOS (todos editados, nenhum novo):
- `docs/produto/papeis-atribuicao-e-delegacao.md` (377) — `RN-NUC-023` cláusula (d) + aceite.
- `docs/produto/fiscal-custodia-e-trilha.md` (395) — `RN-EMI-039` enunciado, correção datada, aceite, infeliz.
- `docs/produto/matriz-operacao-papel.md` (351) — §7 quarta divergência fechada; `RN-NUC-031`, "o que não fecha".
- `docs/produto/matriz-operacao-papel-contrato.md` (247) — `RN-NUC-039` motivo/aceite; `RN-NUC-040` infeliz.
- `docs/produto/matriz-operacao-papel-modulos.md` (270) — `LACUNA-NUC-019` fechada nos dois lados; **`LACUNA-NUC-037`** nova.
- `docs/produto/nucleo-publicacao-e-texto.md` (189) — `RN-NUC-013` tabela, mapa de linhas, aceite.
- `docs/produto/modulos/relatorios.md` (261) — cabeçalho §0; `RN-REL-001` campo (2); `RN-REL-006` aceite.
- `docs/produto/modulos/relatorios-semente-de-perguntas.md` (235) — nota normativa do campo `QUEM`.
- `docs/produto/modulos/perifericos-classes.md` (218) — gaveta fora de venda passou a citar a célula.
- `docs/produto/modulos/mesa-comanda.md` (347) — `RN-MSA-004` e `RN-MSA-013`, aceites citando a célula.
- `docs/produto/operacao-offline-e-sincronizacao.md` (354) — linha nova na §4, nota datada, `LACUNA-OFF-001`.
- `docs/produto/nucleo-venda.md` (384, +1) — `LACUNA-NUC-007` reescrita.
- `docs/produto/roadmap-de-modulos.md` (398, +2) — as quatro afirmações que minha edição tornou falsas.
- `docs/produto/README.md` (174).

NÃO FEITO: —

DECISÕES:
1. **A varredura do item 4 achou dois casos de concessão por prosa, e os dois estão em `REL` — não em
   `MSA`/`COZ`/`PCF`/`ATI`, que era a suspeita.** `RN-REL-006`, aceite, dizia "`owner` recebe os dois
   recortes e o total", e o campo `QUEM` das seis perguntas da semente nomeia papel para cada relatório —
   **e `REL` não tem uma única linha nas três matrizes**. Por `RN-NUC-039`(a) isso é negado a todos, então
   a prosa concedia o que a matriz nega por ausência. Corrigi a prosa (nunca a célula, que não existe) e
   marquei `LACUNA-NUC-037`. Escolhi **uma** nota normativa cobrindo as seis, em vez de emendar seis `RN`:
   a decisão é a mesma para todas e seis edições idênticas apodrecem em seis lugares diferentes.
2. **`LACUNA-NUC-037` propõe uma linha por escopo, não por relatório.** Está escrito na lacuna porque é a
   diferença entre uma matriz que cresce com o catálogo de relatórios e uma que não: relatório novo não
   deve exigir célula nova. Não decidi o valor (é do humano, com `seguranca` antes — agregado é o caminho
   de vazamento que schema correto não pega).
3. **Nos quatro sítios em que a prosa nomeava papel e o valor da célula coincidia** (`perifericos-classes`
   gaveta, `mesa-comanda` retirar item e configurar), corrigi para citar **linha e valor** em vez de trocar
   por "papel autorizado". Motivo: `RN-NUC-039`(c) pede a citação, e apagar o nome tornaria a prosa
   inverificável por busca — o aceite de conformidade de `RN-NUC-039` depende de a prosa apontar para algo.
4. **A metade de `LACUNA-NUC-007` que fechei é transcrição, não classificação nova.** A classificação
   inteira já estava em `RN-NUC-031` (Offline) e na nota ¹⁰ da matriz; conferi as duas contra a linha que
   escrevi. O único juízo que exerci foi de **vocabulário**: `RN-OFF-002` proíbe célula que diga "depende",
   então "opera quando a lista está vazia" virou `degradado` (opera e deixa pendência nomeada) com a
   condição declarada como **precondição da regra dona** na nota, não como célula. A alternativa —
   `recusa` nos três — reintroduziria a contradição com `PN-01` que o item existia para tirar.
5. **Não toquei em `glossario.md` nem parti nenhum arquivo.** Nenhum termo novo nasceu neste despacho:
   `LACUNA-NUC-037` reusa vocabulário existente, e as demais edições são propagação. `nucleo-venda.md`
   subiu **uma** linha (384) e `roadmap-de-modulos.md` duas (398), as duas por reescrita de item existente.

RISCOS:
1. **Divergência inversa em `fiscal-custodia-e-trilha.md`, achada pela varredura e não corrigida por mim.**
   `LACUNA-EMI-015` (`:368-371`) afirma que, enquanto ela estiver aberta, conceder/renovar/revogar a
   capacidade de assinar e assinar fora do fluxo de venda "falham fechado" — mas as células dessas duas
   operações (`matriz-operacao-papel-modulos.md` §5) dão **`R` para `fiscal_officer`**. Por `RN-NUC-039`
   vence a célula, logo a operação **é** autorizada e a prosa está errada na direção conservadora. Não
   corrigi porque (a) o arquivo está em 395 linhas e (b) a frase toca **D-03**, que é decisão do humano —
   pode ser que a intenção fosse a célula estar `?`. Uma linha para quem tiver o mandato.
2. **`roadmap-de-modulos.md` tem duas outras afirmações falsas que eu não causei e não corrigi:** `:166`
   "`PER` tem 0 regra numerada" (existem `RN-PER-001` a `019`) e `:171` "a matriz operação × papel está em
   elaboração em outra ficha" (existe, em três arquivos). O arquivo está em 398 linhas — corrigir as duas
   cabe, mas é outra passada, e a segunda é a mesma classe de defeito do item 5.
3. **`operacao-offline-e-sincronizacao.md:95` afirma "o catálogo tem 31 entradas"; contei 33 linhas na §4**
   (32 antes da minha). O número já estava defasado antes deste despacho (as seis linhas de `PER` entraram
   em 2026-08-23 e a §4 tinha 26 linhas antes disso, o que também não fecha com 31). Tirei o número do
   `README.md`; não o corrigi na regra porque não sei o que ele contava — pode ser contagem de outra época
   da tabela. Quem souber, corrige em uma palavra.
4. **`verticais/restaurante.md` está em 400 linhas exatas**, e `modulos/fiscal.md` e
   `modulos/pedido-cliente-final.md` em 399. A próxima frase que entrar em qualquer um dos três obriga a
   partir o arquivo. `glossario.md` (395) e `fila-local-conteudo-e-repouso.md` (395) seguem no mesmo estado
   que o despacho anterior declarou, com o eixo de corte já nomeado por ele.
5. **A varredura cobriu prosa que nomeia papel; ela não cobriu prosa que nomeia _capacidade_ sem papel.**
   Fica em pé a possibilidade de uma `RN` de módulo descrever uma operação que **não existe em nenhuma
   matriz** sem nomear papel algum — o que por `RN-NUC-039`(a) é negado a todos, mas passa despercebido
   porque não há nome de papel para a busca achar. O aceite de conformidade de `RN-NUC-039` é por papel
   nomeado; um aceite por **operação** exigiria comparar as duas matrizes com as `RN` de todos os módulos,
   e isso é uma passada própria.

VERIFICAÇÃO: não rodei nada — não há código, e o entregável é spec. O que **conferi em disco**:
- **Varredura do item 4 — quantos arquivos:** grep de nome de papel (`cashier`, `manager`, `owner`,
  `fiscal_officer`, `provider_support`, `gerente`, `dono`, `papel`) em **16 arquivos de spec de módulo,
  vertical e fiscal** lidos linha por linha: os **11** de `docs/produto/modulos/**` (`fiscal.md` deu zero
  ocorrência), **1** de `verticais/**`, e os **4** `fiscal-*.md` da raiz, que são a spec de `FIS`/`EMI` e
  são exatamente onde `AUT-08` nasceu. Foram **159 linhas** de ocorrência de `papel|gerente|dono` nos 12
  primeiros, mais **11** de nome de papel nos fiscais, todas lidas. Depois, uma passada de cobertura sobre
  **os 38 arquivos** de `docs/produto/**` procurando papel **entre acentos graves** (223 ocorrências, 16
  arquivos): fora dos arquivos de autoridade, só `fiscal-custodia` (1), `modulos/perifericos` (1),
  `perifericos-classes` (2), `relatorios-semente` (8) e `relatorios` (5) nomeiam papel — li as linhas dos
  três arquivos de núcleo com ocorrência única (`nucleo-venda:313`, `operacao-offline:186`,
  `fila-local:279`) e as três são conformes.
- **Pares célula × prosa encontrados: 13.** **Sete já conformes** (citam linha ou lacuna):
  `perifericos.md:291-294` (linha 17), `perifericos-classes.md:91-95` (linha 17),
  `fiscal-custodia:196,209,250` (`RN-EMI-036` + `LACUNA-EMI-015`), `operacao-offline:186` (`manager`, linha
  28, com a divergência já narrada na §7 da matriz), `nucleo-venda:313`, `fila-local:279`, e
  `cozinha.md:37,138` (`production_operator` é papel de módulo, não coluna — coberto por `RN-NUC-033`,
  `RN-COZ-012` e a nota ¹ da §3 da matriz de módulos). **Seis não conformes, todos corrigidos:**
  `relatorios.md:30-32`, `relatorios.md` `RN-REL-001` campo (2), `relatorios.md` `RN-REL-006` aceite,
  `relatorios-semente` §1 (8 nomeações em 6 `RN`), `perifericos-classes.md:97`, `mesa-comanda.md:132`
  e `:259`. **Dos seis, dois concedem** o que a matriz nega (os dois de `REL`); os outros quatro coincidem
  com o valor da célula e só faltava a citação. **Nenhuma célula foi alterada de valor.**
- **Item 6, conferido antes de transcrever:** `matriz-operacao-papel.md:88` (linha 35, `RN-NUC-031`),
  `:110-112` (nota ¹⁰) e `:207-210` (Offline da regra) contra `operacao-offline-e-sincronizacao.md:115`
  (o vocabulário das três células) e `:42-45` (`RN-OFF-002`, que proíbe "depende"). A linha que escrevi
  repete a nota ¹⁰ palavra por palavra no que é normativo.
- **Todas as ocorrências de `LACUNA-NUC-007` em `docs/produto/**`: 14 linhas em 6 arquivos**, lidas uma a
  uma. Reescrevi as 5 que afirmavam o fechamento do dia recusado (`nucleo-venda:362`, `matriz:212-217`,
  `operacao-offline:340` e a nota da §4, `roadmap:132,170,366,394`). **Deixei intactas** as corretas:
  `superficie-por-papel.md:193-197` (é sobre "abrir o dia", que continua não existindo) e `:299`,
  `papeis-e-permissoes.md:106-110` (é sobre turno), `operacao-offline:96`, `nucleo-venda:27`.
- **Numeração antes de criar:** maior `LACUNA-NUC` = `036`; consumi **`LACUNA-NUC-037`**. Nenhuma `RN`
  nova neste despacho — nenhuma fazia falta, tudo era propagação. Nada renumerado.
- **Tamanho de todo arquivo tocado, contado depois da última edição** (os 14 da lista de ARQUIVOS):
  máximo **398** (`roadmap-de-modulos.md`). **Nenhum acima de 400**, e nenhum arquivo partido.
- **Conferência do `README.md` contra o disco:** listei os 38 arquivos de `docs/produto/**` e cruzei um a
  um com o mapa. Faltavam **9**; todos entraram. As faixas de `RN` que o README declara foram conferidas
  por busca de heading `### RN-...` arquivo por arquivo, não por memória.

PERGUNTAS:
  - para humano: **`LACUNA-NUC-037`** — quem lê relatório de gestão? Ela é a única lacuna nova daqui, e
    hoje o desfecho é `REL` **inteiro** negado a todos: seis relatórios especificados, nenhum alcançável.
    Se a resposta for "o mesmo par de sempre" (escopo estabelecimento × escopo cliente), é **uma** linha
    de tabela e `REL` destrava; a pergunta existe porque agregado é o vazamento que schema não pega.
  - para humano: **turno** (`LACUNA-NUC-007`, metade que sobrou) — turno é escopo de responsabilidade
    próprio, ou é a sessão de caixa com outro nome? É a última contradição com `PN-01` no núcleo, e a
    única coisa que falta para fechá-la é essa frase. Não presumi: sua resposta anterior foi "não sei
    ainda / depende do cliente", e ela **permanece** registrada como aberta, sem defeito.
  - para o dono de `fiscal-custodia-e-trilha.md` (ou para o humano, se for D-03): `LACUNA-EMI-015` diz que
    conceder e usar a capacidade de assinar "falham fechado" enquanto ela está aberta, mas a célula dá `R`
    a `fiscal_officer`. Qual das duas está errada — a frase, ou a célula deveria ser `?` (RISCOS 1)?

MEMÓRIA SUGERIDA:
  - type=business-rule escopo=plataforma camada=produto slug=relatorio-nao-tem-celula-e-por-isso-nao-e-legivel
    — `REL` não tem linha em nenhuma das três matrizes: o campo "quem decide" de cada relatório é candidato,
    e ler relatório é negado a todos até `LACUNA-NUC-037` fechar; a lacuna propõe linha **por escopo**,
    não por relatório.
  - type=business-rule escopo=plataforma camada=produto slug=fechar-o-dia-offline-degradado-em-d1-e-d3
    — fechar o dia é `degradado` em D1 e D3, **recusa em D2** (a lista de bloqueio não é computável de um
    terminal isolado), classe 1 no fato e 2 na precondição; a recusa por lista não vazia é precondição da
    regra, não desfecho de domínio. Fecha metade de `LACUNA-NUC-007`; a metade de turno segue aberta.
  - type=convention escopo=plataforma camada=produto slug=prosa-que-nomeia-papel-cita-linha-e-valor
    — corrigir prosa que nomeia papel **não** é apagar o nome: é citar a linha e o valor da célula, porque
    o aceite de conformidade de `RN-NUC-039` é uma busca e precisa de algo para onde apontar. Só quem não
    tem célula troca o nome pela lacuna.
  - type=gotcha escopo=plataforma camada=produto slug=ausencia-de-celula-e-mais-perigosa-que-celula-negada
    — sintoma: uma spec de módulo diz "o `owner` recebe X" e ninguém encontra a célula que nega, porque a
    **operação inteira** nunca entrou na matriz. Foi assim em `REL` (`AUT-08` de novo, outro módulo): a
    célula negada aparece na varredura; a linha que não existe, não.
  - type=state escopo=plataforma camada=produto slug=mapa-de-docs-produto-tem-38-arquivos
    — o `README.md` de `docs/produto` voltou a listar tudo que existe em disco em 2026-08-23 (38 arquivos,
    9 acrescentados nessa passada) e a seção "Em elaboração" está vazia por checagem, não por esquecimento.
    Remover este registro quando a próxima ficha alterar o conjunto.

PRÓXIMO PASSO SUGERIDO: `humano` — as três perguntas acima, sendo `LACUNA-NUC-037` a que destrava um
módulo inteiro por uma linha de tabela. Depois disso, uma passada curta de `produto` para: as duas
afirmações falsas de `roadmap-de-modulos.md` (RISCOS 2), o número do catálogo de offline (RISCOS 3), e o
aceite de conformidade de `RN-NUC-039` **por operação** e não por papel nomeado (RISCOS 5) — que é a
varredura que ainda não existe.

## produto (fechamento de AUT-12 a AUT-14) — 2026-08-23

## RELATÓRIO — produto — T-0003 (fechamento de `AUT-12` a `AUT-14`)

STATUS: OK

FEITO:
- **`AUT-14`, item 1 — `RN-OFF-032` entrou em vigor, e a correção é na coluna.** Aceitei a proposta do
  auditor: `RN-NUC-027` passou de **três** para **quatro** valores de decisão offline, com o quarto sendo
  **`terminal+ident`** — concedida pela habilitação do terminal a vender mais a identificação do operador,
  nunca por autoridade de pessoa. As linhas do ato ordinário passaram a carregá-lo na coluna `Offline`, e
  **`RN-OFF-032` deixou de competir com a célula: ela aponta para a coluna.** O conjunto do ato ordinário
  virou **fechado pela coluna** — buscar `terminal+ident` devolve o conjunto, e mudar o conjunto é mudar
  célula, pelo dono da matriz. São **nove** linhas, não dez (ver DECISÕES 2).
- **Cláusula que a célula da linha 6 exigia:** sem contato e sem autoridade retida válida, o teto de
  desconto/acréscimo aplicado é o do **papel-piso**, publicado — nunca o de um papel que só a autoridade
  retida provaria. Sem ela a célula era inimplementável: identificar quem está no terminal não diz que
  papel a pessoa porta.
- **Item 2 — a habilitação a vender ganhou prazo.** `RN-OFF-032`(i) passou a ter prazo declarado, aviso
  antecipado e renovação por contato, com o argumento simétrico ao de `RN-EMI-033`/`037`: terminal sem
  rede não recebe revogação, então sem prazo a revogação é promessa que a física do offline não cumpre.
  Sem isso, terminal furtado e mantido offline vendia em nome do emitente indefinidamente, contra `C-09`.
  **`LACUNA-OFF-017`** nova: grandeza (tempo sem contato + antecedência do aviso) declarada, **valor em
  aberto**, com a tensão escrita na lacuna e em PERGUNTAS.
- **As afirmações que ficaram falsas: eram 11, em 5 arquivos** (o brief pedia três). Oito são da família
  "quem porta apenas `owner` não vende sem contato": `RN-NUC-027` cláusulas 2 e 3 e aceite, `RN-NUC-028`
  infeliz, o preâmbulo da §4 da matriz, o cabeçalho da matriz de módulos, o cabeçalho de
  `superficie-por-papel.md` e a §3.3 de `superficie-por-papel-momentos.md`. Três são da família "esta
  operação depende de autoridade retida": o `Offline` de `RN-NUC-030` (fechar a **própria** sessão), a §7
  da matriz ("nenhuma célula muda de valor, porque nenhuma cobre ato ordinário sem autoridade") e a §2.5
  dos momentos (linhas 12 e 27 listadas como dependentes de validade). Todas corrigidas com data e
  achado. **O caso do dono da padaria continua funcionando e ficou mais forte:** virou aceite próprio de
  `RN-OFF-032` — ele pratica as nove linhas portando **apenas** `owner`, e `RN-NUC-040`(c)/(d) não foi
  tocada, porque publicar limite é linha 36, recusa offline, e nada nela dependia da autoridade retida.
- **Parti `fila-local-conteudo-e-repouso.md`** (395 linhas) no eixo que o despacho anterior nomeou —
  **conteúdo e repouso × autoridade e identidade** —, com o irmão novo
  `fila-local-autoridade-e-identidade.md`. Ver DECISÕES 5.
- **Item 5, as duas decisões.** **Aceitei o corolário do `backend`:** "módulo não contratado" cai na
  **mesma** resposta de "negado ao meu papel", senão o canal vira listagem comercial. **Respondi ao
  `ui`:** "negado ao seu papel" é dizível sobre a **operação**, nunca sobre **objeto** de outro escopo —
  objeto fora do escopo resolvido cai em `RN-NUC-038`, e isso vale **inclusive entre estabelecimentos do
  mesmo cliente**. Escrevi a propriedade que o `backend` nomeou como enunciado: a resposta é função de
  (operação nomeada, papel do requerente, escopo que ele já alcança) **e de nada mais**. E o requisito que
  faltava: **"recusado por falta de contato" só é dizível porque o terminal decide localmente**, do que
  ele retém (`RN-NUC-013` + `RN-OFF-024`) — dependência agora declarada, com aceite de três casos.
- **`AUT-12` fechado por cláusula geral**, como o achado sugeriu: **campo de texto livre de terceiro não é
  campo enumerável por si**. Enumerá-lo não abre leitura derivada sobre o conteúdo; ele só é alcançado
  quando a `RN` dona declara as **três** coisas (a decisão exige o literal · quem o alcança, no mais
  estreito · não vai para contagem, lista, relatório nem exportação). Sem as três, o que entra é a
  **presença declarada** do campo. `RN-OFF-012` foi emendada e dá as três: o conteúdo do motivo é de quem
  porta `queue_owner`, item a item, com registro — que é o que `RN-OFF-027`, infeliz, já mandava.
- **`AUT-13` — reavaliei e concordo: a linha 38 não é retaguarda.** `RN-NUC-040`(b) passou de **quatro**
  para **cinco** linhas não delegáveis, e a trava ganhou **duas famílias**: autoridade (19, 36, 37, 39) e
  **aritmética e fronteira do dia** (38 — precisão e arredondamento decidem quanto se paga em cada venda
  sem aparecer em preço publicado; fuso decide a que dia o fato pertence, logo o número que fecha o dia).
  Propaguei para os quatro derivados. Delegável, das linhas de publicação, sobrou **a 18**.
- **Item 6.** `roadmap-de-modulos.md`: as duas afirmações falsas corrigidas (`PER` tem 19 `RN`; a matriz
  existe em disco em três arquivos), mais duas que encontrei na mesma tabela (`OFF` com "31 `RN`" quando
  são 33; a linha 4 dizendo "em elaboração") — **sem crescer o arquivo**, que ficou em 398. **O "31
  entradas" foi reconstituído:** ele conta o **catálogo de módulos** (31 cabeçalhos de módulo em
  `catalogo-de-modulos.md`), não as linhas da §4 — o número estava **certo** e o texto era ambíguo;
  escrevi o que ele conta. `LACUNA-EMI-015` corrigida **sem presumir D-03** (DECISÕES 4).

ARQUIVOS:
- `docs/produto/fila-local-autoridade-e-identidade.md` (**novo**, 331) — `RN-OFF-024` a `026`,
  `RN-OFF-032` (três cláusulas novas), `RN-OFF-033`, `C-10`, lacunas `011`/`015`/`016`/**`017`**.
- `docs/produto/fila-local-conteudo-e-repouso.md` (editado, **196**) — §3 vaga; ficaram `021`–`023`,
  `027`, `C-09`, `012`/`014`.
- `docs/produto/matriz-operacao-papel-contrato.md` (editado, 285) — `RN-NUC-027` (quarto valor, quatro
  cláusulas, motivo e aceite), `RN-NUC-028` infeliz, `RN-NUC-029` (referência de cláusula), `RN-NUC-040`
  (b) e aceite.
- `docs/produto/matriz-operacao-papel.md` (editado, 384) — preâmbulo da §4; **nove células da coluna
  `Offline`**; notas ¹², ¹³, **¹⁴** e **¹⁵**; `RN-NUC-030` offline; §7 com o parágrafo desmentido.
- `docs/produto/matriz-operacao-papel-modulos.md` (editado, 274) — cabeçalho.
- `docs/produto/superficie-por-papel.md` (editado, 365) — cabeçalho; `RN-NUC-035` (i.b) cláusula do texto
  livre, motivo e aceite (4); `RN-NUC-036` três cláusulas e aceite; §4 item 4.
- `docs/produto/superficie-por-papel-momentos.md` (editado, 289) — §2.3 linha 29 e nota; §2.5; §3.1 (38
  saiu da retaguarda, delegação com cinco linhas); §3.3 reescrita.
- `docs/produto/operacao-offline-e-sincronizacao.md` (editado, 358) — cabeçalho (três irmãos);
  `RN-OFF-008` motivo; `RN-OFF-012` enumeração; localização das lacunas.
- `docs/produto/nucleo-publicacao-e-texto.md` (editado, 192) — tabela e o mapa artefato → linha.
- `docs/produto/papeis-atribuicao-e-delegacao.md` (editado, 378) — `RN-NUC-023`(d) cinco linhas; §6 linha
  do `owner`.
- `docs/produto/fiscal-custodia-e-trilha.md` (editado, **400**) — `RN-EMI-036` infeliz, `LACUNA-EMI-015`,
  e o item 3 da lista de perguntas ao humano.
- `docs/produto/roadmap-de-modulos.md` (editado, 398), `docs/produto/glossario.md` (editado, 395 — só
  dentro de linha), `docs/produto/README.md` (editado, 177).

NÃO FEITO: —

DECISÕES:
1. **O nome do quarto valor é `terminal+ident`**, e a escolha é sobre verificabilidade, não estética. Era
   isso que fazia `RN-NUC-027` detectar defeito por busca, e é o que o achado pediu que fosse preservado.
   `ordinária` e `habilitada` colidem com prosa que já existe ("ato ordinário", "meios habilitados",
   "declarado na habilitação"), e busca com colisão devolve ruído — que é como esta classe de defeito
   sobrevive. `terminal+ident` tem **zero** colisão e nomeia as duas pernas.
2. **São nove linhas, não dez, e a diferença é declarada.** Apliquei o **critério** de `RN-OFF-032` (o que
   o papel-piso alcança pelo próprio papel, sem autorização de outro e sem mover dinheiro fora de venda)
   linha a linha, em vez da enumeração em prosa, que era menor que o critério: **1, 2, 3, 4, 6, 10, 12,
   15, 27**. Excluí três candidatas, com motivo: **5** (pagamento que exige terceiro) é `recusa` offline
   pela natureza da operação, não por autoridade; **17** (reimprimir via) é **operação sensível** pelo
   glossário e pela lista de `seguranca` §2; **32** (consumir exceção de teto) é a própria exceção, e
   `RN-OFF-024`, aceite, a lista entre as que recusam ao vencer a validade. Se a décima do auditor é uma
   dessas três, é **valor de célula** e é do humano — PERGUNTAS.
3. **Acrescentei coluna-vocabulário e valor de coluna; não mexi em célula de papel.** Nenhuma célula
   `P`/`N`/`N·cfg`/`A:`/`R`/`?` mudou em nenhuma das três matrizes, e a contagem da §8 (195 células, 5
   `?`) segue idêntica. O que mudou foi o vocabulário da coluna `Offline` e o valor que nove linhas
   carregam **nela** — e digo isso explicitamente na nota ¹⁴, porque a distinção é a que autoriza a
   edição. O rótulo de delegabilidade da linha 38 (`AUT-13`) também não é célula: está em nota e em regra.
4. **`LACUNA-EMI-015`: reduzi, não presumi D-03 — e o motivo é verificável.** A pergunta "qual papel
   concede/revoga a capacidade de assinar" **já estava respondida em disco**, duas vezes: é a **prova de
   existência** do `fiscal_officer` em `RN-NUC-019` e é a célula `R` da matriz de módulos §5. "Qual papel
   pode o quê" nunca foi D-03 — o cabeçalho das três matrizes diz isso literalmente; D-03 é **como** a
   identidade se prova. Então a frase "falham fechado" era prosa contra célula (`AUT-08` invertido) e a
   correção não escolhe nada de D-03. **O que deixei para o humano:** se a intenção era a operação ficar
   indecisa, o conserto é a **célula** (`?`), que é dele — está escrito na lacuna e em PERGUNTAS.
5. **O corte da fila local: o arquivo que ficou com o nome ficou com o conteúdo.** O nome
   `fila-local-conteudo-e-repouso.md` **é** o eixo do conteúdo, então mover conteúdo dele seria mentir no
   nome; e `C-09` (terminal furtado) ficou lá porque `operacao-offline-e-sincronizacao.md:324` cita o
   cenário **por arquivo**, e mover custaria uma citação sem ganho. `RN-OFF-027` (texto opaco) foi para o
   lado do **conteúdo**, como o eixo mandava. A §3 ficou **vaga**, pelo precedente da partição da matriz.
   Custo real: quem citar o arquivo velho procurando autoridade retida erra uma vez — mitigado pelos
   cabeçalhos dos dois e pelas quatro citações atualizadas.
6. **Na leitura derivada, o mais estreito venceu a célula — e isso não é conflito com `RN-NUC-039`.**
   Declarei a distinção no texto: `RN-NUC-039` decide **quem pratica**; minimização de **informação**
   dentro de uma operação autorizada pode ser mais estreita que a célula, nunca mais larga. Sem essa
   frase, a próxima varredura acharia "prosa que estreita o que a célula concede" e trataria como
   `AUT-08`. Consequência operacional aceita: `manager` que não porta `queue_owner` resolve o item vendo
   **presença** do motivo, não o conteúdo — que é exatamente o que `RN-OFF-027`, infeliz, já mandava.
7. **"Presença declarada" em vez de omissão**, para campo de texto livre sem as três declarações.
   Omitir a existência do campo torna a decisão de inventário cega ("há motivo, não sei qual" é diferente
   de "não há motivo"); e exibir o conteúdo é o vazamento. A presença é o meio-termo que preserva a
   decisão sem entregar texto de terceiro.

RISCOS:
1. **`fiscal-custodia-e-trilha.md` ficou em exatamente 400 linhas** — zero folga; a próxima frase obriga a
   partir. Eixo aparente (não conferido linha a linha): **custódia e ciclo da capacidade de assinar**
   (`RN-EMI-033`–`037`) × **trilha, comprometimento e consolidação** (`RN-EMI-038`–`040`) + lacunas.
   `roadmap-de-modulos.md` (398), `glossario.md` (395) e `matriz-operacao-papel.md` (384) seguem apertados;
   os três primeiros não crescem mais sem partir.
2. **A matriz de módulos não tem nenhuma célula `terminal+ident`**, e `RN-OFF-032` manda o módulo
   classificar pelo mesmo critério. Pela letra do conjunto, operação de módulo que **é** ato ordinário
   (lançar item em consumo aberto, por exemplo) continua com o valor que a coluna diz — e isso pode ser a
   mesma classe de defeito de `AUT-14`, um nível abaixo. Não toquei: valor de célula é do humano. Declarei
   no cabeçalho da matriz de módulos que a divergência, se houver, é achado. **É o candidato número um da
   próxima auditoria.**
3. **A cláusula do teto restringe algo que ninguém tinha escrito:** `manager` com validade vencida passa a
   aplicar desconto só até o limite do **papel-piso**, mesmo que o dele fosse maior. É conservador e é
   falha-fechado, mas é perda de alcance que o humano pode não esperar — e é decisão minha, não dele.
4. **O prazo da habilitação cria o único caso em que esta regra para o balcão** (`RN-OFF-032`, infeliz a1).
   Mitigado por aviso antecipado, mas o número de `LACUNA-OFF-017` decide se a mitigação basta. Enquanto
   ele não existe, o comportamento é indefinido em duração — não em forma.
5. **Não varri as specs de módulo procurando operação que deveria ser ato ordinário** (RISCOS 2 é a
   metade nomeada disso), nem recontei "23 grandezas sem valor" no roadmap — deixei declarado no próprio
   arquivo que a contagem não foi refeita.
6. **A linha 6 é `R`**, então o ato ordinário agora inclui uma operação com registro obrigatório sem
   contato. Isso já era exigido (`RN-NUC-029`: registro nasce no terminal, junto com o fato, offline
   inclusive), mas é a primeira vez que registro obrigatório vive numa linha que **não** depende de
   autoridade retida — vale um olhar de `seguranca`.

VERIFICAÇÃO: não rodei nada — não há código, e o entregável é spec. **Não tenho shell neste despacho**,
então cada tamanho abaixo foi obtido lendo a **última linha** do arquivo depois da última edição, não por
`wc -l`. O que conferi em disco:
- **as três pontas de `AUT-14`**, antes de escrever: `matriz-operacao-papel.md:54-63` (as linhas com
  `retida`), `matriz-operacao-papel-contrato.md:63-92` (`RN-NUC-027`, os três valores e a cláusula 2) e
  `:162-193` (`RN-NUC-039`, a precedência da célula). O achado se confirma na letra: `RN-OFF-032` era
  prosa perdendo para a coluna.
- **depois de editar, a coluna inteira:** as linhas que ainda dizem `retida` são **dez** — 13, 14, 16, 17,
  28, 30, 31, 32, 34, 35 —, e **todas** são sensíveis, nenhuma é do ato ordinário. `terminal+ident`
  aparece **13 vezes** no arquivo: 9 células + 4 sítios de prosa (preâmbulo, nota ¹⁴ ×2, `RN-NUC-030`).
- **a varredura das afirmações falsas**, por três buscas (`owner` sozinho / `toda célula offline` /
  `sempre recusa` / `opera sem contato` / `não opera sem`, mais `autoridade retida` e `padaria`): **11
  afirmações em 5 arquivos**, todas lidas em contexto antes de reescrever, mais um 12º sítio que **não**
  era falso e eu qualifiquei (a linha do `owner` na tabela de §6 de `papeis-atribuicao-e-delegacao.md`,
  que dizia só "não há o que reter"). Confirmei que `papeis-e-permissoes.md:125` e `:147-153` **já**
  estavam corretas do despacho anterior e não as toquei.
- **`RN-NUC-040`(c)/(d) antes de mexer em qualquer coisa do `owner`**: `matriz-operacao-papel-contrato.md`
  aceite (3) e `papeis-atribuicao-e-delegacao.md:205-216`. Nenhuma das duas depende de autoridade retida —
  publicar é linha 36/38, `recusa` offline —, então a correção do ato ordinário não as alcança.
- **o "31 entradas":** contei os cabeçalhos de módulo de `catalogo-de-modulos.md` por busca de `^### \``
  → **31**. O número conta o catálogo de módulos e estava certo; o que faltava era dizer o que ele conta.
  A §4 do contrato de offline tem outra contagem, e as duas nunca foram a mesma coisa.
- **citações do arquivo partido**, antes de partir: **5** sítios em 4 arquivos. Atualizei 4 (cabeçalho e
  §8 de `operacao-offline`, `README.md`) e conferi que os outros continuam verdadeiros —
  `operacao-offline:324` (aponta `C-09`, que **ficou**) e `offline-grandezas-e-orcamento.md:5` (fala do
  conteúdo da fila, que ficou). Nenhuma citação por `§` ao arquivo velho existia fora dele.
- **numeração antes de criar:** maior `RN-OFF` = `033`, maior `RN-NUC` = `040`, maior `LACUNA-OFF` =
  `016`, maior `LACUNA-EMI` = `016`. Consumi **`LACUNA-OFF-017`** e **nenhuma `RN` nova** — a correção
  central é de coluna e de cláusula, não de regra nova. Nada renumerado.
- **tamanho de todo arquivo tocado**, pela última linha: 400 (`fiscal-custodia`), 398 (`roadmap`), 395
  (`glossario`, inalterado em contagem), 384 (matriz), 378 (`papeis-atribuicao`), 365 (superfície), 358
  (offline), 331 (**novo**), 289 (momentos), 285 (contrato), 274 (módulos), 196 (fila-local), 192
  (publicação), 177 (`README`). **Nenhum acima de 400.**
- **o que não conferi:** as specs de módulo contra o critério de ato ordinário (RISCOS 2); a contagem de
  grandezas do roadmap; e não reli `docs/auditorias/**` além do que o brief transcreveu.

PERGUNTAS:
  - para humano: **`LACUNA-OFF-017`** — por quanto tempo sem contato o terminal continua habilitado a
    vender, e com quanta antecedência ele avisa? **A tensão, que é a decisão:** curto demais para de
    vender quem opera dias com link ruim, e a regra escrita para não parar o caixa passa a pará-lo por
    decurso de prazo (contra `PN-01`); longo demais deixa o terminal furtado e mantido offline abrindo
    sessão, concluindo venda e entregando via em nome do emitente por todo o intervalo (contra `C-09`).
    **Não é a mesma grandeza de `LACUNA-OFF-011`** e provavelmente não é da mesma ordem: lá o evento
    contido é revogação de **pessoa** (frequente, prevista); aqui é perda de **dispositivo** (rara,
    notada).
  - para humano: **o ato ordinário tem nove linhas ou dez?** Se o auditor contou dez, a décima é uma de
    **5** (pagamento que exige terceiro), **17** (reimprimir via) ou **32** (consumir exceção) — e as três
    são valor de célula, que é seu. Minha leitura, com motivo, está em DECISÕES 2.
  - para humano: **alguma linha de módulo é ato ordinário?** Hoje nenhuma carrega `terminal+ident`
    (RISCOS 2). Se lançar item em consumo aberto for ordinário, é célula, e é sua.
  - para humano: **`LACUNA-EMI-015`** — a célula que dá `R` a `fiscal_officer` para conceder/revogar a
    capacidade de assinar está certa, ou ela deveria ser `?`? Corrigi a prosa para concordar com a
    célula; se a intenção era o inverso, o conserto é a célula.
  - para humano: confirma a **cláusula do teto** (offline sem autoridade retida, o limite é o do
    papel-piso, RISCOS 3)? É restrição que eu escrevi para tornar a célula da linha 6 implementável.

MEMÓRIA SUGERIDA:
  - type=gotcha escopo=plataforma camada=produto slug=regra-nova-que-nao-corrige-a-celula-nasce-inerte
    — sintoma: uma `RN` nova declara que uma operação não depende de X, e a coluna da matriz continua
    dizendo X. Sob `RN-NUC-039` a célula vence **inclusive a regra dona**, então a regra nasce inerte
    exatamente nas operações que ela existe para liberar. Foi `AUT-14`: `RN-OFF-032` × coluna `Offline`.
    Corolário: quem escreve regra que muda desfecho de célula entrega **a célula** no mesmo despacho.
  - type=business-rule escopo=plataforma camada=produto slug=ato-ordinario-e-o-conjunto-fechado-pela-coluna
    — o ato ordinário é exatamente o conjunto de linhas com `terminal+ident` na coluna `Offline`
    (`RN-NUC-027` cláusula 3): hoje nove (1, 2, 3, 4, 6, 10, 12, 15, 27); quem porta apenas `owner` as
    pratica sem contato e sem atribuição; e sem autoridade retida válida o teto aplicado é o do papel-piso.
  - type=business-rule escopo=plataforma camada=produto slug=habilitacao-a-vender-do-terminal-tem-prazo
    — a habilitação a vender vence por tempo sem contato, com aviso antes (`RN-OFF-032`i,
    `LACUNA-OFF-017`), pelo mesmo argumento que deu prazo à capacidade de assinar: terminal sem rede não
    recebe revogação. É o único caso em que o ato ordinário para.
  - type=convention escopo=plataforma camada=produto slug=campo-de-texto-livre-nao-e-campo-enumeravel
    — enumerar um campo de texto de terceiro numa `RN` não abre leitura derivada sobre o conteúdo dele:
    exige declarar que a decisão pede o literal, quem o alcança (o mais estreito) e que ele não vai para
    contagem/lista/relatório/exportação. Sem as três, a superfície mostra **presença**, não conteúdo.
  - type=business-rule escopo=plataforma camada=produto slug=resposta-a-pedido-nomeado-e-funcao-de-tres-coisas
    — a resposta ao pedido nomeado é função de (operação nomeada, papel do requerente, escopo que ele já
    alcança) e de nada mais: módulo não contratado cai na mesma resposta de "negado ao meu papel", e
    objeto de outro escopo cai em `RN-NUC-038` — inclusive entre estabelecimentos do mesmo cliente.
  - type=business-rule escopo=plataforma camada=produto slug=trava-aritmetica-nao-e-retaguarda
    — a linha 38 (moeda, fuso, precisão, arredondamento) é trava, não retaguarda, e não é delegável: as
    linhas não delegáveis passaram a **cinco** (`RN-NUC-040` b, `AUT-13`). Precisão decide quanto se paga
    sem aparecer em preço publicado; fuso decide a que dia o fato pertence.
  - type=state escopo=plataforma camada=produto slug=fila-local-tem-dois-arquivos
    — a fila local passou a dois arquivos em 2026-08-23: conteúdo e repouso (`021`–`023`, `027`, `C-09`) ×
    autoridade e identidade (`024`–`026`, `032`, `033`, `C-10`). Remover quando o mapa mudar de novo.
  - type=reference escopo=plataforma camada=produto slug=trinta-e-uma-entradas-e-o-catalogo-de-modulos
    — o "31 entradas" de `RN-OFF-008` conta os 31 cabeçalhos de módulo de `catalogo-de-modulos.md`, não as
    linhas da §4 do contrato de offline. Os dois números nunca foram a mesma coisa.

PRÓXIMO PASSO SUGERIDO: `seguranca` — reauditoria dirigida de **quatro** pontos, e só quatro: (1) o quarto
valor põe `RN-OFF-032` em vigor sem abrir nada, dado que ele vale para os quatro papéis de cliente? (2) o
prazo da habilitação a vender fecha a janela de `C-09` que a nota do achado nomeou, ou ainda sobra
exposição entre o furto e o vencimento? (3) a cláusula do texto livre fecha `AUT-12` sem deixar o item de
fila sem quem o resolva? (4) **RISCOS 2** — existe operação de módulo que é ato ordinário pelo critério de
`RN-OFF-032` e continua com célula de autoridade retida? Depois disso, o humano nas cinco perguntas, sendo
`LACUNA-OFF-017` a única grandeza nova.

## produto (AUT-15 e AUT-16) — 2026-08-23

> Costurado pelo thread principal: este despacho foi instruído a **não** escrever em `tarefas/**`, porque
> o `orquestrador` estava escrevendo o `## Fechamento` no mesmo arquivo e duas escritas concorrentes se
> atropelam. Relatório reproduzido a partir do handoff do agent.

## RELATÓRIO — produto — T-0003 (`AUT-15` e `AUT-16`)

STATUS: OK

FEITO:
- **`AUT-15` — o campo do registro não pergunta mais "quem autorizou", pergunta em que o ato se
  sustentou.** `RN-NUC-029` passou de **duas** para **três** fontes, exatamente uma por ato e nunca
  "nenhuma": **(1) atribuição**; **(2) concessão** (`provider_support`, `RN-NUC-024`d); **(3)
  identificação retida mais habilitação do terminal a vender** (`RN-OFF-033`, `RN-OFF-032`i) — a coluna
  `terminal+ident`, onde não há atribuição a nomear. Foi reformulação do **campo**, não exceção: com
  "atribuição ou concessão" a única saída era mentir ou recusar, e é isso que os dois desfechos do achado
  descrevem.
- **Cláusula que torna a trilha verificável:** quando a fonte é (3) **e** a operação aplica limite
  publicado (linha 6, `RN-NUC-006`), o registro diz **qual teto** foi aplicado — o do papel-piso. Sem
  isso os dois casos do achado colapsam no mesmo registro.
- **`RN-NUC-006` alinhada** — era a mesma família de defeito que `RN-NUC-009` teve: a precondição de
  autoridade retida na validade saiu, entrou operador identificado + terminal habilitado, com o teto do
  papel-piso sem contato e o registro do teto.
- **`RN-NUC-028` alinhada** numa cláusula: "o registro nomeia a atribuição mais estreita" passou a valer
  **quando é atribuição que sustenta o ato** — antes contradizia a fonte (3) na mesma página.
- Conferidas as outras duas ocorrências da precondição: `RN-NUC-012`(b), gaveta **fora** de venda, é
  operação sensível e a precondição está **correta** — não tocada.
- **`AUT-16` — a exposição passou de "zero" a "limitada pelo prazo".** `C-09` agora diz que o servidor
  **revoga** a habilitação e que terminal offline **não recebe** revogação, logo quem o tiver em mãos
  pratica ato ordinário **até a habilitação vencer por tempo sem contato**: inerente, limitada,
  **nunca zero**. `RN-EMI-038`(c) passou a notificar **as duas janelas** — até quando a capacidade de
  assinar valia e até quando o terminal ainda vende.
- **Terceira ponta da mesma frase falsa**, que o achado não citou, corrigida: o aceite do prazo em
  `RN-OFF-032` dizia que o terminal furtado perde a habilitação "na hora, sem esperar prazo" — era a
  afirmação de janela zero dentro da própria regra que criou a janela.
- `glossario.md`, verbete "Terminal habilitado a vender": "furto **retira**" → "**revogam** no servidor;
  no terminal offline ela cai quando vence por tempo sem contato".

ARQUIVOS: `docs/produto/matriz-operacao-papel-contrato.md` (308) · `nucleo-venda.md` (392) ·
`fila-local-conteudo-e-repouso.md` (205) · `fiscal-custodia-e-trilha.md` (400 → 400) ·
`fila-local-autoridade-e-identidade.md` (335) · `glossario.md` (395 → 395) — todos editados.

DECISÕES:
1. **Não parti `fiscal-custodia-e-trilha.md`** (400, zero folga). O eixo de corte era bom, mas mover
   `RN-EMI-038`–`040` quebra `path:linha` em `docs/arquitetura/d-03-identidade-opcoes.md:57` (R-15 aponta
   para o que **é** `RN-EMI-038`) e em `d-01-d-02-stack-opcoes.md` — território que o agent não edita, logo
   criaria referência pendurada que ele não pode consertar. Reescreveu dentro da linha, saldo zero.
   **Custo declarado:** a próxima emenda em `EMI` §2 obriga a partição, e ela tem que vir com o despacho
   do dono de `docs/arquitetura/**` para reapontar R-15.
2. **Nenhum valor de célula alterado.** Acrescentar vocabulário ao **campo do registro** e corrigir
   precondição de `RN` não é valor de célula: a linha 6 segue `R`/`terminal+ident`, e o ato ordinário
   segue sendo as mesmas nove linhas, fechado pela coluna.
3. **A fonte (3) é uma, não duas.** Recusou separar "identificação retida" de "habilitação do terminal":
   as duas **sempre** aparecem juntas e nenhuma sustenta ato sozinha, então separá-las criaria valor de
   campo que nunca ocorre isolado — que é como campo enumerável apodrece.

RISCOS:
- **`LACUNA-OFF-017` ganhou dependente mais visível:** a notificação de `RN-EMI-038`(c) tem campo
  obrigatório sem grandeza resolvida. Antes a lacuna era do comportamento do terminal; agora é **do texto
  que sai para o cliente**.
- **`AUT-17` intocado** por determinação: nenhuma célula de módulo carrega `terminal+ident`. Consequência
  do trabalho deste despacho: a `RN-NUC-029` nova **já admite** a fonte (3) para operação de módulo, então
  quando o humano decidir as células nada muda no registro. O defeito segue sendo o valor da célula.
- Os dois dossiês de `docs/arquitetura/` e a reverificação citam **linhas** dos arquivos editados; parte
  desses `path:linha` foi deslocada. Fora do território do agent.

VERIFICAÇÃO: sem teste (não há código). Contagem de linhas antes e depois de cada edição — **nenhum
arquivo acima de 400**; `fiscal-custodia-e-trilha.md` bateu 401 na primeira passada e voltou a 400 por
compressão do enunciado. Buscas de conferência: `dentro da validade (RN-OFF-024)` (2 → 1, a restante é
`RN-NUC-012`b, correta) · `não pratica ato ordinário` / `perde a habilitação` (a frase de janela zero não
existe mais; a única ocorrência restante é um contrafactual verdadeiro) · `até quando a capacidade` (1, já
emendada) · `atribuição mais estreita` (3 restantes, relidas, falam de escolher entre atribuições e não
ficaram falsas).

MEMÓRIA SUGERIDA: `business-rule/registro-de-ato-nomeia-em-que-o-ato-se-sustentou` ·
`gotcha/revogacao-de-terminal-nao-alcanca-offline` ·
`convention/corrigir-dentro-da-linha-quando-o-arquivo-esta-no-teto`.

## Fechamento — orquestrador — 2026-08-23

> **CONDIÇÃO DE FECHAMENTO, e ela é a única coisa que falta:** esta ficha **fecha salvo achado
> bloqueante da reauditoria de `AUT-14`**, despachada a `seguranca` com quatro pontos dirigidos e **em
> vôo** quando este fechamento foi escrito. O conteúdo está completo e a definição de pronto está
> cumprida abaixo; o `status:` está em `aberta` de propósito. **Quem vira a chave é o thread principal**,
> depois de ler a reauditoria: sem achado bloqueante → `status: fechada` e a linha do `INDEX.md`; com
> achado bloqueante → novo despacho ao `produto`, e este fechamento é reaberto no ponto que o achado
> tocar. Não presuma o resultado dela: foi exatamente uma reauditoria pedida com a frase "caminho
> **aberto** pelo conserto" que produziu `AUT-14`, o achado mais importante do dia.

**Resultado em conteúdo:** entregou o que o pedido pediu — quem vê o quê, quantos papéis existem, que
relatório cada um alcança, e o RBAC **ligado ao SDUI** — e entregou na ordem que o humano escolheu:
núcleo primeiro, telas depois.

### Definição de pronto, item por item (`processo.md` §2)

1. **Regra de negócio em `docs/produto/**`, numerada, com critério de aceite — CUMPRIDO.**
   `RN-NUC-001`..`040` contíguas, mais `RN-PER`, `RN-REL`, `RN-OFF-032`/`033`, a matriz de 72 operações
   × 5 papéis (**nenhuma célula vazia**) e o contrato da célula em arquivo próprio. "o código cita esse
   número" **não se aplica: não existe código**.
2. **Teste do critério de aceite — não se aplica:** camada de spec. Cada regra carrega o aceite escrito,
   e vários deles são **verificáveis por busca hoje** — o melhor exemplo é o de `RN-NUC-027`: buscar
   `enfileirada` em coluna de célula devolve zero, e o conjunto de linhas `terminal+ident` tem de ser
   exatamente o que `RN-OFF-032` enumera. Aceite que se confere por `grep` é o mais próximo de teste que
   esta fase alcança.
3. **DDL / gate 2 — não se aplica:** nenhum arquivo em `db/`.
4. **Gate 3 (`seguranca`) — APLICA-SE E FOI CUMPRIDO.** Era o gate que travava a ficha e ficou aberto por
   uma sessão inteira. `docs/auditorias/2026-08-23-autorizacao-papeis-e-superficie.md` (11 achados
   `AUT-01`..`AUT-11`, 6 notas, **nenhum CRÍTICO**) + `...-2-reverificacao.md` (`AUT-12`..`AUT-14`). Os 14
   foram corrigidos por `produto` nos arquivos donos. **Prioridade um respondida:** não há caminho em que
   um cliente veja dado de outro. **Não se aplica** a parte de "endpoint": nenhuma rota existe — o gate
   incidiu sobre o modelo de autorização, que é o que esta ficha produziu.
5. **Gate 4 (`performance`) — CUMPRIDO NA FORMA PREVISTA PELO PLANO (consulta), gate completo agendado
   para a Fase 2.** Ressalva honesta: consulta é read-only e **não escreve na ficha**, então esta ficha
   **não tem seção `performance`** e o arquivo não existe em `docs/auditorias/`. Para a substância não se
   perder com a sessão, ela foi para memória —
   `plataforma/decision-agregado-de-periodo-fechado-nao-e-cache` — inclusive as três correções de premissa
   que ela trouxe.
6. **Decisão não óbvia virou registro em `memory/`, com linha de índice — CUMPRIDO**, abaixo.
7. **Nenhum segredo — CONFERIDO.** Nenhuma credencial, nenhum mecanismo de identidade escolhido (D-03
   segue ABERTA), nenhum dado de pessoa real em exemplo.
8. **Toda `MEMÓRIA SUGERIDA` avaliada — CUMPRIDO**, abaixo.

### Memória escrita a partir desta ficha

- `plataforma/gotcha-regra-nova-que-nao-corrige-a-celula-nasce-inerte` — **o registro mais importante do
  dia.** Duas correções corretas, da mesma rodada, em arquivos diferentes, se anularam, e nenhum dos
  dois agents tinha como ver. É a falha específica do trabalho paralelo por território, e o corolário é
  operacional: quem muda desfecho de célula entrega **a célula** no mesmo despacho, e reauditar o
  conserto é obrigatório.
- `plataforma/decision-celula-e-autoridade-unica-sobre-autorizacao` — `RN-NUC-039`, nascida de um caso
  fiscal e válida para todo par célula × prosa, com o custo aceito à vista (`REL` inteiro inalcançável
  até o humano criar a linha).
- `plataforma/business-rule-ato-ordinario-versus-operacao-sensivel` — o conserto de `PN-01`, e sobretudo
  **o ganho que justifica guardá-lo**: os dois prazos que o negócio quer opostos ficaram independentes,
  e encurtar a validade passou a custar só o alcance sensível, não o balcão.
- `plataforma/business-rule-habilitacao-a-vender-do-terminal-tem-prazo` — com o argumento simétrico ao da
  capacidade de assinar, e com a tensão de `LACUNA-OFF-017` escrita para o humano decidir.
- `plataforma/convention-criterio-de-operacao-sensivel` — o critério é "irreversível ou não conferível
  depois", e o registro diz **quem cedeu**: o glossário, não `RN-NUC-032`.
- `plataforma/convention-campo-de-texto-livre-nao-e-campo-enumeravel` — o padrão geral de `AUT-12`:
  estreitamento eficaz onde a `RN` dona foi enumerada na mesma passada, inócuo onde a enumeração
  preexistia e contém texto opaco.
- `plataforma/decision-contencao-de-papel-nao-gera-autoridade-retida` — e por que a padaria de uma pessoa
  não quebra.
- `plataforma/decision-d-03-sao-tres-eixos-nao-uma-decisao` + `reference-dossies-de-decisao-de-arquitetura`
  — a partição em três eixos explica por que a decisão mais antiga do projeto nunca fechava, e a pergunta
  única fica escrita para o humano.
- `plataforma/decision-agregado-de-periodo-fechado-nao-e-cache` — a consulta de `performance`, que não
  deixou arquivo.
- `processo/gotcha-endereco-de-relatorio-envelhece-na-propria-sessao` — três `path:linha` errados num dia,
  todos com substância correta, um deles apontando defeito que já não existia.

**Fundido, em vez de duplicado:** `tres-portadores-liticos-de-tenant` e
`isolamento-por-construcao-vence-por-verificacao` → dentro do registro de D-03, que é onde a escolha se
faz; `ato-ordinario-e-o-conjunto-fechado-pela-coluna` e `reautenticar-sem-contato-nao-existe` → dentro do
registro do ato ordinário; `prosa-que-nomeia-papel-cita-linha-e-valor`,
`ausencia-de-celula-e-mais-perigosa-que-celula-negada` e `leitura-derivada-tem-campo-enumerado` → dentro
dos dois registros que já os governam; `frescura-separa-relatorio-de-painel` → dentro do registro de
`performance`, com a linha correta de corte ("é derivável só de período fechado?"); **`venda-resolvida-dentro-do-escopo-autenticado`
(`AUT-01`) → fundido em `decision-tenancy-schema-por-cliente`**, que ganhou a cláusula "o schema isola
cliente, **não** estabelecimento", com os dois caminhos concretos. Essa é a fusão mais importante das
seis: quem lê tenancy na Fase 1 lê aquele registro **sempre**, e um registro novo sobre o mesmo assunto
teria virado a segunda opinião.

**Recusado, com motivo.**

- **Enunciado de regra que agora vive numerado em `docs/produto/**`** (~30 sugestões: papéis do núcleo,
  critério de existência de papel, escopo em dois níveis, contenção, três origens de superfície, três
  negações, `PER` como classe de capacidade, três desfechos da tentativa, `REL` e seus cinco itens,
  delegação em cascata, unidade de delegação, trava aritmética, piso de configuração): derivável da spec,
  que é autoridade, tem critério de aceite e é citável por número. Memória duplicando regra numerada
  cria a segunda fonte que envelhece calada.
- **`manifesto-por-papel-nao-e-autorizacao` — recusada por já ser regra sempre-lida.**
  `.claude/rules/seguranca.md` §2 obriga verificar papel no backend "nunca só escondendo botão", e
  `RN-NUC-034` está na spec. Regra vence memória na hierarquia (`00-nucleo.md` §1); repetir aqui não
  aumenta a chance de ser lida, diminui.
- **Divergência já corrigida** (`rn-off-024-b-contradiz-d`, `delegacao-quem-concede-divergencia`,
  `celula-negada-por-omissao-nao-e-falha-fechado`, `autoridade-derivada-sobrevive-a-fonte`,
  `celula-negada-que-vaza-pela-operacao-vizinha`, `validade-do-cashier-e-o-turno-offline`,
  `meio-de-prova-retido-nao-tem-regra`, `tabela-de-offline-sem-linha-de-per`,
  `fechar-o-dia-offline-degradado-em-d1-e-d3`): eram **defeitos**, e defeito corrigido não é
  conhecimento — é histórico, e o histórico é esta ficha. Escrever memória de contradição que não existe
  mais faz o próximo agent procurar um defeito ausente. O que ficou de durável dos dois mais fortes
  (`AUT-05` e o par `RN-OFF-032`) está nos registros escritos acima.
- **Organização de arquivo** (`matriz-operacao-papel-tem-tres-arquivos`, `fila-local-tem-dois-arquivos`):
  derivável da árvore, e ambas já estão desatualizáveis por qualquer partição futura.
- **Contagem** (`mapa-de-docs-produto-tem-38-arquivos`, `trinta-e-uma-entradas-e-o-catalogo-de-modulos`):
  recusadas por serem o tipo de registro que nasce mentindo — a primeira **já estava errada ao fechar**
  (contei **39** arquivos em `docs/produto/` em 2026-08-23), e a segunda se obtém por uma busca. O que
  valia nela era a distinção "este número conta o catálogo de módulos, não as linhas da §4 do contrato de
  offline", e essa distinção pertence ao arquivo que cita o número, onde `produto` já a escreveu.
- **`matriz-e-quase-toda-ato-e-quase-nada-informacao`, `default-negado-e-negado-por-indecisao`,
  `autorizacao-offline-nunca-enfileira`, `negacao-e-resposta-nao-e-catalogo`,
  `resposta-a-pedido-nomeado-e-funcao-de-tres-coisas`, `owner-sozinho-nao-opera-e-a-habilitacao-tem-de-dizer`,
  `trilha-do-provedor-prometida-e-negada`, `pn-18-protege-a-venda-nao-a-obrigacao`,
  `per-nao-e-dependencia-de-ativacao-de-emi`**: derivável do contrato da célula, da spec de superfície e
  da de `PER`, nos lugares exatos onde a pergunta é feita. Duas ficam **nomeadas aqui** por serem as mais
  contraintuitivas, para quem for implementar saber que existem: **`PN-18` protege a venda, nunca a
  obrigação** (impressão obrigatória que falha → a venda conclui **e** a obrigação vira pendência nomeada
  **por via**; o erro que isso impede é fechar a pendência porque a venda fechou bem) e **autorização
  offline nunca enfileira** (o fato espera; o pedido de autorização, não).
- **`quem-le-a-trilha-nao-esta-decidido`**: não é conhecimento, é pergunta em aberto — foi para
  `state-pendencias-abertas-2026-08-23`, que é de onde se tira pauta com o humano.

### O que fica aberto, com dono

| O que | Dono | Por que importa |
|---|---|---|
| **Reauditoria de `AUT-14`**, 4 pontos dirigidos | `seguranca` | **é a condição de fechamento desta ficha** |
| **`LACUNA-NUC-037`** — quem lê relatório de gestão | **humano** | **maior alavanca da lista**: `REL` não tem **uma única célula** em nenhuma das três matrizes, logo seis relatórios especificados estão negados a todos. **Destrava com uma linha de tabela** |
| **D-03** — o humano que opera em mais de um cliente é caso de **borda** ou de **venda**? | **humano** | borda → opção **C**; venda → **B**, assumindo **por escrito** que o isolamento passa a ser garantido por verificação em vez de por construção |
| **`LACUNA-OFF-017`** — prazo da habilitação a vender | **humano** | curto demais para de vender quem tem link ruim (contra `PN-01`); longo demais deixa o terminal furtado vendendo (contra `C-09`) |
| **`LACUNA-EMI-015`** — a célula dá `R` a `fiscal_officer` para conceder a capacidade de assinar; a lacuna diz "falha fechado" | **humano** | divergência **inversa**; toca D-03 e pode virar `BLOQUEIO` |
| **O ato ordinário tem nove linhas ou dez?** E **alguma linha de módulo é ato ordinário?** | **humano** | valor de célula é dele; hoje nenhuma linha de módulo carrega `terminal+ident` |
| **Turno** — metade de `LACUNA-NUC-007` | **humano** | respondeu "não sei ainda / depende do cliente"; o fechamento do **dia** ganhou regra, o turno não |
| **Fuso do estabelecimento × do cliente** | **humano** | resolver mexe em `.claude/rules/dados.md`, território dele |
| A **cláusula do teto** (offline sem autoridade retida, o limite é o do papel-piso) | **humano** | é restrição que o agent escreveu para tornar a célula implementável, e reduz alcance do `manager` |
| As **20 células de ato fiscal irreversível** não auditadas uma a uma, e os 6 itens não verificados da §5 do relatório | `seguranca` | confissão de escopo do próprio auditor — vale mais que um `OK`, e não fecha sozinha |
| Consultas a `backend` e `ui` sobre o **canal de pedido nomeado** (`RN-NUC-036`) | thread principal | **sem resposta registrada em ficha nenhuma**; consulta não escreve na ficha, então se voltou é colar, e se não voltou é redespachar |
| **O PDF na raiz não contém a auditoria** e não diz que o gate estava aberto quando foi gerado | humano / thread | as fontes viviam no scratchpad e **morreram com a sessão**; regerar é refazer. Não entregar aos sócios documento que sugere gate cumprido |
| `docs/produto/README.md` como mapa | `produto` | foi reescrito com as entradas de raiz; qualquer partição futura o desatualiza primeiro |

**Medido em disco em 2026-08-23, ao fechar** (por `wc -l` e `ls`, não por estimativa): 39 arquivos em
`docs/produto/` somando 11.683 linhas; 3 em `docs/auditorias/` (2 relatórios + `README`); os dois maiores
arquivos de spec estão **em** 400 linhas (`verticais/restaurante.md` e `fiscal-custodia-e-trilha.md`) e
nenhum passou — o próximo acréscimo em qualquer dos dois exige partir por eixo. Achados
`AUT-01`..`AUT-14`; prefixo `AUT-` escolhido porque `C-nn` já nomeia os **cenários** do contrato de
offline.

---

## Aditamento do thread principal — 2026-08-23 (a chave virada)

O `## Fechamento` acima foi escrito com a reauditoria de `AUT-14` **em vôo** e deixou a ficha condicionada.
A reauditoria voltou. **Veredito: nenhum achado bloqueante** — a ficha fecha.

**Os quatro pontos, como o auditor os devolveu:**
1. O quarto valor `terminal+ident` **põe `RN-OFF-032` em vigor sem abrir nada**: a coluna não concede a
   quem a célula do papel nega, `provider_support` segue `recusa` em toda linha, as nove linhas são só `P`
   ou `R`, nenhuma é `A:` e nenhuma move dinheiro fora de venda. O `owner`-only passar a vender é ganho de
   `PN-01` **sem** ganho de autoridade. Resíduo: **`AUT-15`** — corrigido no despacho acima.
2. O prazo da habilitação é a correção certa com o precedente certo; a exposição residual entre furto e
   vencimento é **inerente e agora limitada**, o que é o desfecho correto. O defeito era afirmá-la como
   zero. Resíduo: **`AUT-16`** — corrigido no despacho acima, em três pontas.
3. `AUT-12` **fecha** e não deixa o item de fila sem quem o resolva. A cláusula geral é mais forte que a
   correção que o próprio auditor sugerira, porque ataca a categoria ("enumerar um saco, não um campo") em
   vez de remendar uma regra.
4. **`AUT-17` é achado e NÃO bloqueia esta ficha.** Falha **fechado** (recusa de serviço, nunca autoridade
   concedida), valor de célula de módulo é decisão declarada do humano (`RN-NUC-026`), e as `RN` donas
   (`RN-MSA-004`, `011`, `RN-COZ-004`) estão fora do escopo desta ficha, que é núcleo.

**O que `AUT-17` bloqueia, e fica dito para não se perder:** (a) a afirmação de que o contrato de offline
está completo para cliente com **módulo ligado** — não está; (b) a entrega de `MSA` ao primeiro cliente,
porque as células de módulo precisam ser decididas **antes** de implementadas. Cenário: cliente com `MSA`
ligado, 21h01, o núcleo lança item e conclui em espécie por `terminal+ident` enquanto o módulo **recusa**
lançar item em consumo aberto por `retida` — a operação mais frequente da primeira vertical.

**Consultas que voltaram e não estavam registradas em ficha nenhuma** (o `orquestrador` apontou a falta):
- **`backend`** — o canal de pedido nomeado de `RN-NUC-036` é implementável como **rota separada**, sem
  alterar o manifesto. A propriedade que o salva **não é esconder ids** (o vocabulário é fechado e
  embarcado no cliente): é a resposta ser função de `(id, papel do requerente, escopo do objeto que ele já
  alcança)` **e de nada mais**. Daí o corolário aceito pelo `produto`: **"módulo não contratado" cai na
  mesma resposta de "negado ao meu papel"**, senão o canal vira listagem comercial. As três negações
  coexistem com a proibição de revelar existência porque a resposta **não fala de existência, fala de
  caminho** — e forma **e custo** precisam ser invariantes, senão tempo e volume viram o oráculo que o
  corpo não é. Requisito que caiu junto: "recusado por falta de contato" só é dizível se o terminal
  decidir **localmente** do que retém.
- **`ui`** — compatível com "ausência por autorização é ausência" e com "permissão não é eixo de
  variante": a cláusula governa **ausência de nó**, não resposta a pedido, e `A:<papel>` já tem estado
  (`state.unavailable`). O resíduo do passo 5 cede **parcialmente**, por fronteira: a indistinguibilidade
  era defesa **do cliente contra si mesmo** e nunca vinculou o backend — tecla que não vira pedido recebe
  resposta genérica; pedido nomeado que chega ao servidor recebe a negação que o servidor mandou. Falta um
  **papel de bloco para entrada de comando por teclado** — id novo, nunca variante, slot da zona crítica
  com ordinal fixo, porque o fluxo é completável sem tocar a tela. Dono: `ui`, despacho próprio.
- **`backend` (§5 do dossiê de D-03) estava errada e foi corrigida pelo autor:** conflacionava *portar o
  tenant na requisição* com *reter a habilitação de vender*. **`RN-OFF-032` é satisfeita nas três opções —
  nada em D-03 fica bloqueado por ela**, e a recomendação de C não muda. O que sobra é a derivação de
  (ii): projetar e reconciliar o conjunto por estabelecimento nasce dentro de um schema só em A/C e é
  consulta filtrada sobre população global em B. Agrava B numa direção concreta: filtro de tenant errado
  ali não vaza "quem existe", vaza o **meio de identificar** pessoas de outro cliente para um dispositivo
  físico de terceiro.

**Achados abertos ao fechar, todos MÉDIO e nenhum bloqueante:** `AUT-17` (células de módulo — humano).
Fechados nesta ficha: `AUT-01` a `AUT-16`.

**Referência pendurada criada pelo fechamento:** `docs/design/vocabulario-e-eixos.md:377` pede ao
`orquestrador` corrigir a grafia antiga de `space.` num arquivo de `state` que o fechamento **removeu**. O
problema apontado deixou de existir; a linha ficou apontando para o vazio. Dono: `ui`. É, ela mesma, um
caso do `gotcha` que este fechamento registrou em `memory/processo/`.


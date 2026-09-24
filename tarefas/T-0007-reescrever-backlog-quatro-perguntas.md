---
id: T-0007
jira: SPR-55
titulo: Reescrever os cards do board SPR contra as quatro perguntas de produto.md
status: fechada
escopo: cliente=- vertical=- modulo=- camada=produto+processo
aberta_em: 2026-08-26
fechada_em: 2026-08-26
---

## Pedido

Literal, 2026-08-26: "ainda to achando todas as tarefas BEM mal explicadas, elas tao muito IA, nao
explicam direito o que tem que fazer, onde tem que fazer, porque tem que fazer, o que deve ter pronto
antes de fazer." Confirmado pelo humano: avaliação do board `SPR` inteiro, não de cards pontuais.

Em resposta, `.claude/rules/produto.md` ganhou a seção "As quatro perguntas — checagem final,
sempre nesta ordem" (a pedido explícito do humano), operacionalizando o quê / onde / por quê / o que
precisa estar pronto antes como checklist obrigatório de pré-publicação.

## Plano

## PLANO — T-0007 Reescrever os cards do board SPR contra as quatro perguntas de `produto.md`

```
JIRA: SPR-55
ESCOPO: reler e, onde falhar, reescrever título/descrição das 52 issues SPR-1..SPR-52 contra
  "As quatro perguntas — checagem final" (.claude/rules/produto.md): o quê, onde, por quê,
  o que precisa estar pronto antes. Card que já responde as quatro fica marcado "já conforme" com
  as frases citadas, sem edição.
FORA DE ESCOPO: decidir prioridade/prazo/dono/status; criar RN nova; decidir qualquer G-01..G-09
  ou LACUNA-GLO-001; fundir ou excluir card (travas de produto, jira.md §2, e as duas já valem por
  T-0006). Reescrever SPR-53 (concluída — evidência já entregue), SPR-54 (ficha de processo do
  T-0006, não é card de backlog) e SPR-55 (esta própria issue). Resolver qualquer das quatro
  pendências humanas em aberto de T-0006 (aceite de SPR-46, título de SPR-32, título de SPR-27,
  Bloco B substantivo) — se o item 4 esbarrar nelas, a resposta é apontar o bloqueio já publicado,
  não decidi-lo.
ESCOPO DE MEMÓRIA: cliente=- vertical=- modulo=- camada=produto+processo
DECISÕES ABERTAS QUE TOCAM ISSO: D-01 (parcial, SPR-52), D-02 (SPR-35/42/43/44/45/47/48/49/50),
  D-04 (SPR-39), D-05/D-06 tangenciam SPR-36/37 — todas MANTER, nenhuma ação; o plano só as torna
  visíveis (mesma lógica de T-0006).

PASSOS:
  1. thread principal — criar a ficha T-0007, colar o plano, atualizar tarefas/INDEX.md e mover
     SPR-55 para "Em andamento" — entrega: ficha criada — sequencial.
  2. produto — Lote 1: Epic SPR-34 + SPR-14,31,32,33,36,37,38,39,40,41,51,52 (13 issues, maior
     densidade de `bloqueada`). Confirmar por JQL antes de tocar em qualquer card — não herdar a
     lista sem checar contra o board do dia. Para cada issue: ler o corpo inteiro (nunca só o
     título), rodar as quatro perguntas, e só editar se alguma falhar. Toda edição de
     título/descrição vem precedida de comentário de preservação verbatim. Entrega: uma linha por
     card — chave · veredito (JÁ CONFORME | REESCRITO | NÃO EXECUTÁVEL: motivo) · as quatro frases
     citadas literalmente do card resultante — sequencial.
  3. produto — Lote 2: Epic SPR-35 + SPR-42,43,44,45,46,47,48,49,50 (10 issues). Prioridade nos 9
     cards já marcados como "lidos só pelo título" (SPR-35,42-44,47-50). Mesma disciplina e
     formato — sequencial.
  4. produto — Lote 3: backlog anterior, parte A — SPR-1..13,15 (14 issues; SPR-14 já foi no
     Lote 1). Mesma disciplina e formato — sequencial.
  5. produto — Lote 4: backlog anterior, parte B — SPR-16..30 (15 issues; 31/32/33 já foram no
     Lote 1). Mesma disciplina e formato — sequencial.
  6. thread principal — amostragem independente de verificação. Puxar via JQL pelo menos 8 issues
     (mínimo ~15% do tocado) cobrindo os quatro lotes e toda chave citada em RISCOS de qualquer
     relatório de produto; conferir que as quatro frases citadas aparecem verbatim no card e
     respondem de fato cada pergunta (não prosa genérica). Divergência encontrada → novo despacho a
     produto citando a chave e o defeito — sequencial, depende dos quatro lotes.
  7. orquestrador — fechamento: avaliar cada MEMÓRIA SUGERIDA; se a amostragem achou card genérico
     que passou como "JÁ CONFORME", vira gotcha em memory/processo/; atualizar
     state-board-spr-2026-08-26.md; fechar a ficha e levar SPR-55 a Concluído só se a amostragem
     não achou divergência — caso contrário bloqueada com a lista do que falta reprocessar.

GATES: nenhum dos 5 gates do CLAUDE.md §4 se aplica (nenhuma RN nova, nenhum DDL, rota ou consulta).
  Gate 5 (BLOQUEIO não se ignora) vivo do passo 2 ao 7: pré-requisito ausente que não é nenhuma das
  G-01..G-09/LACUNA-GLO-001 já catalogadas é achado novo e vai como PERGUNTAS: para humano, nunca
  decidido por produto.

RISCO PRINCIPAL: a checagem de clareza vira reescrita cosmética que não resolve o sintoma — produto
  troca prosa vaga por prosa igualmente vaga mas mais longa, e o próprio autor da reescrita não
  percebe porque é o mesmo agente que julga e que escreve. Por isso o passo 6 exige verificação
  independente (thread principal, não produto) e por citação literal, não por atestado.
```

## produto — 2026-08-26 (Lote 1)

JQL rodada antes de tocar em qualquer card (`project = SPR AND key in (SPR-34, SPR-14, SPR-31,
SPR-32, SPR-33, SPR-36, SPR-37, SPR-38, SPR-39, SPR-40, SPR-41, SPR-51, SPR-52)`): as 13 issues do
brief batem com o board de hoje, nenhuma some, nenhuma nova.

## RELATÓRIO — produto — T-0007 (Lote 1)

STATUS: OK

FEITO:
- Lidas as 13 issues inteiras (corpo + comentários), não só o título.
- 4 comentários de preservação publicados (verbatim do texto anterior), seguidos de 4 edições de
  descrição: `SPR-14`, `SPR-31`, `SPR-32`, `SPR-33`.
- 9 issues confirmadas `JÁ CONFORME`, sem edição: `SPR-34`, `SPR-36`, `SPR-37`, `SPR-38`, `SPR-39`,
  `SPR-40`, `SPR-41`, `SPR-51`, `SPR-52`.
- Nenhum título alterado. `SPR-32` mantém o título errado que já está rotulado como pendência
  humana de T-0006 — não decidi.
- Nenhuma lacuna (`G-01..G-09`, `LACUNA-GLO-001`) decidida. Onde o item 4 esbarrou numa já
  catalogada, apontei o bloqueio existente (rótulo `bloqueada` + comentário) em vez de resolvê-lo.

Uma linha por card, veredito e as quatro frases citadas literalmente do card resultante:

**`SPR-34`** · JÁ CONFORME
- O quê: "Entregar o modelo de dados do núcleo de venda e a fundação do servidor de forma que a
  Fase 2 não precise refazê-los."
- Onde: "O núcleo fala venda, item, pedido, pagamento, operador, turno, cliente-final, catálogo."
- Por quê: "Fase não é prazo, é dependência: esta fecha quando o modelo passa no gate de segurança
  e a convenção de chave/timestamp/exclusão está fechada."
- Pré-requisito: já bloqueada por `G-01`, `G-02`, `G-09` e `LACUNA-GLO-001` (comentário de
  2026-08-26, rótulo `bloqueada`) — não reprocessado, apontado.

**`SPR-14`** · REESCRITO
- O quê: "Modelar comanda, mesa e nome de exibição do cliente-final como tabelas do módulo `MSA`
  (mesa-comanda), com identidade técnica independente do identificador operacional."
- Onde: "ela é de módulo, não de núcleo" (módulo `MSA`).
- Por quê: "Sem identidade técnica estável, a comanda perde rastreio quando o identificador
  operacional se repete."
- Pré-requisito: "Depende de: `SPR-39` (chave primária, timestamps, exclusão lógica) — nenhuma
  tabela nasce antes dela."

**`SPR-31`** · REESCRITO
- O quê: "Modelar categoria de catálogo como hierarquia — categoria e subcategoria, sem limite fixo
  de profundidade."
- Onde: "Catálogo — escopo em disputa. Bloqueado por `G-03` ... Não decidido nesta passada."
- Por quê: "Hoje, sem nenhum agrupamento, o operador de padaria só localiza item digitando o
  código. Num balcão com centenas de itens isso é o gargalo do caixa no pico."
- Pré-requisito: "Depende de: `SPR-39` e `SPR-40` — nenhuma tabela nasce antes das duas." mais o
  bloqueio de `G-03` já publicado, apontado e não decidido.

**`SPR-32`** · REESCRITO (descrição; título mantido — pendência humana de T-0006)
- O quê: "Modelar a composição do item vendável: hierarquia categoria → item de catálogo →
  variação → ingrediente, e a associação item de catálogo/variação → complemento (adicional)."
- Onde: "Em disputa — bloqueado por `G-04` (variação) e `G-05` (complemento/adicional) ... Não
  decidido nesta passada."
- Por quê: "Sem uma associação reutilizável, cada combinação de item e complemento vira cadastro
  duplicado ... e o catálogo cresce por multiplicação manual em vez de composição."
- Pré-requisito: "Depende de: `SPR-39` ... e `SPR-40` ... — nenhuma tabela nasce antes das duas."
  mais `G-04`/`G-05` já bloqueados, apontados e não decididos.

**`SPR-33`** · REESCRITO
- O quê: "Modelar a equivalência de apresentação entre lançamentos de item de venda com a mesma
  composição ... para agregar a exibição — '2× X-Burger' — sem fundir os fatos."
- Onde: "Núcleo — item de venda / lançamento (`order_item`)."
- Por quê: "Várias linhas iguais no pico deixam a comanda ilegível para o operador conferir.
  Fundir os lançamentos ... apaga autor e instante de cada um (`RN-MSA-004`)."
- Pré-requisito: "Depende de: `SPR-39` ..., `SPR-32` ..., e de `SPR-23` estar reescrita como
  agregação de apresentação antes desta modelagem — bloqueio já publicado ... Não decidido nesta
  passada."

**`SPR-36`** · JÁ CONFORME
- O quê: "O schema de controle — o único que não é de cliente. Ele guarda o registro de clientes,
  quais módulos cada um tem ativo, o fuso de cada um, e o livro-razão de migrations."
- Onde: schema de controle (`platform`).
- Por quê: "O fuso mora aqui porque turno, fechamento de caixa e 'vendas de hoje' dependem dele, e
  são caríssimos de corrigir depois."
- Pré-requisito: já bloqueada por `LACUNA-GLO-001` (comentário de 2026-08-26) — apontado, não
  decidido.

**`SPR-37`** · JÁ CONFORME
- O quê: "O modelo do núcleo de venda que todo cliente tem, de qualquer ramo: venda, pagamento,
  movimento de caixa, turno e operador."
- Onde: "Se um posto de combustível, uma padaria e uma loja de roupa não precisam todos dela, ela
  não é do núcleo."
- Por quê: mesmo teste dos três negócios acima, aplicado coluna a coluna.
- Pré-requisito: "Depende de: `SPR-39` (chave, timestamps, exclusão lógica) e `SPR-40` (dinheiro e
  quantidade)." — já bloqueada também por `G-02`, `G-01` e `LACUNA-GLO-001` (comentário de
  2026-08-26), apontado e não decidido.

**`SPR-38`** · JÁ CONFORME
- O quê: "O executor que aplica SQL versionado em N schemas de cliente, na mesma ordem, registrando
  no livro-razão. Ele é nosso — não é motor de ORM."
- Onde: executor de migration (infraestrutura do servidor).
- Por quê: "O que o executor precisa fazer não existe pronto: livro-razão por (schema, versão) e
  não por banco; retomada no schema 7 de 20; checksum que trava quando alguém edita migration já
  aplicada."
- Pré-requisito: "Bloqueio conhecido: Nenhum. O executor é escrito na linguagem já fechada e não
  depende da metade aberta de D-01 (ORM/query builder), porque não usa ORM."

**`SPR-39`** · JÁ CONFORME
- O quê: "Qual é a convenção de chave primária, de timestamps e de exclusão lógica que vale para
  todas as tabelas — do núcleo e dos módulos — em todos os schemas de cliente."
- Onde: toda tabela da Fase 1, núcleo e módulo.
- Por quê: "Toda tabela da Fase 1 nasce com essas colunas. Fechar depois é migration sobre tabela
  em uso, em N schemas, pelo ciclo de quatro etapas."
- Pré-requisito: nenhum — "esta é a primeira issue da Epic", nada a precede.

**`SPR-40`** · JÁ CONFORME
- O quê: "Uma escolha, para todo o sistema, registrada como decisão: dinheiro é inteiro em menor
  unidade (centavos) ou numeric(14,2)? E qual é a escala de quantidade?"
- Onde: tipo e unidade de dinheiro no banco, no contrato e na serialização.
- Por quê: "Ponto flutuante para dinheiro é proibido, e a proibição só se sustenta se houver uma
  convenção ... Quantidade é o caso que fecha portas sem avisar."
- Pré-requisito: já bloqueada só na parte de produto por `G-09` (comentário de 2026-08-26) —
  apontado, não decidido; a forma (tipo/escala) segue livre para `arquiteto-dados`.

**`SPR-41`** · JÁ CONFORME
- O quê: "Auditoria do modelo da Fase 1 antes de qualquer código de API tocá-lo. Encontra e prova;
  não corrige."
- Onde: modelo da Fase 1 (schema de controle + núcleo de venda).
- Por quê: implícito no papel de gate do `CLAUDE.md` §4 e nas cinco perguntas de isolamento listadas
  no corpo.
- Pré-requisito: "Depende de: As issues de modelo desta Epic (schema de controle e núcleo de
  venda)." · "Sem dono por enquanto: pega quem liberar depois das issues de modelo."

**`SPR-51`** · JÁ CONFORME
- O quê: "Provar, com número medido, que o risco número um da escolha de linguagem é pagável."
- Onde: drenagem de pendências offline (fora do laço principal do servidor).
- Por quê: "A escolha de linguagem do servidor resolve dois problemas grandes de graça ... Em
  troca, ela assume um risco."
- Pré-requisito: "Sem dono: é a mais avançada da Epic e pega quem liberar." Orientação de medição
  ("meça no fraco: hardware modesto") supre a ausência de um terminal-alvo formal (`state-pendencias
  §3.5`) sem exigir a decisão fechada.

**`SPR-52`** · JÁ CONFORME
- O quê: "A linguagem do servidor está fechada. Isto não está: qual camada de acesso a dados, e
  qual framework HTTP."
- Onde: camada de dados e framework HTTP do servidor.
- Por quê: "Porque a linguagem era a decisão irreversível e estas duas são reversíveis ... Fechar
  decisão reversível junto com irreversível é o jeito mais comum de tomar a reversível sem pensar."
- Pré-requisito: nenhum declarado; issue autocontida, fecha `D-01` sozinha.

ARQUIVOS: nenhum arquivo do repositório — todo trabalho foi na descrição e em comentários das
issues `SPR-14`, `SPR-31`, `SPR-32`, `SPR-33` (Jira). Leitura: `.claude/rules/produto.md`,
`memory/plataforma/state-pendencias-abertas-2026-08-23.md`,
`docs/produto/backlog-lacunas-g01-g09.md`.

NÃO FEITO: —

DECISÕES:
- Em `SPR-32`, corrigi "Produto" para "item de catálogo" na relação da descrição (vocabulário
  proibido, já apontado em comentário anterior, independente da disputa de fronteira) sem tocar no
  título nem decidir se variação/complemento são núcleo ou módulo — a correção de termo e a decisão
  de fronteira são coisas diferentes, e só a primeira estava madura para eu mexer.
- Em `SPR-33`, a reescrita da descrição não decide nada novo: leva ao corpo da issue a recusa de
  mecanismo (consolidação → agregação de apresentação) que já estava registrada em comentário desde
  2026-08-26 e nunca tinha chegado ao campo de descrição. Optei por isso em vez de deixar a
  descrição contradizendo o próprio histórico da issue, porque card cuja descrição pede o mecanismo
  recusado falha a pergunta "o quê" por definição.
- Em `SPR-51`, tratei a ausência de "terminal-alvo" formal (`state-pendencias §3.5`) como já
  resolvida dentro do próprio card pela orientação "meça no fraco, não na máquina de quem
  desenvolve" — não é a mesma coisa que fixar um hardware de referência, mas é suficiente para quem
  pega o card não precisar adivinhar a direção. Não tratei como achado novo.

RISCOS:
- `SPR-32` segue com título que afirma fronteira contrária à spec aprovada (pendência humana de
  T-0006, não desta tarefa). Quem ler só o título antes do corpo pode modelar errado.
- As dez lacunas do board (`state-pendencias-abertas-2026-08-23.md` §0) continuam sem data de
  resposta cumprida; `SPR-40` vence em 2026-09-02 e nenhum card deste lote resolve isso — só
  deixa a lacuna mais visível no corpo, além do comentário.

PERGUNTAS: nenhuma nova. Não encontrei pré-requisito ausente fora das lacunas já catalogadas
(G-01..G-09, LACUNA-GLO-001) ou das quatro pendências humanas de T-0006.

VERIFICAÇÃO: reli cada uma das 13 descrições resultantes direto do retorno da API do Jira (não do
que eu pretendia escrever) antes de fechar este relatório, conferindo que as quatro frases citadas
acima aparecem verbatim no card. Não rodei nenhum teste automatizado — não se aplica a este lote
(sem código, sem DDL).

MEMÓRIA SUGERIDA: nenhuma nova. O já registrado em
`memory/plataforma/gotcha-o-titulo-nao-e-o-card.md` e
`memory/plataforma/convention-bloqueio-nomeia-o-default-silencioso.md` cobre o padrão encontrado
(descrição desatualizada em relação a comentário publicado) — não abri registro extra para não
duplicar.

PRÓXIMO PASSO SUGERIDO: thread principal — passo 3 do plano (Lote 2: Epic `SPR-35` +
`SPR-42..SPR-50`).

## produto — 2026-08-26 (Lote 2)

JQL rodada antes de tocar em qualquer card (`project = SPR AND key in (SPR-35, SPR-42, SPR-43,
SPR-44, SPR-45, SPR-46, SPR-47, SPR-48, SPR-49, SPR-50)`): as 10 issues do brief batem com o board de
hoje, nenhuma some, nenhuma nova. Nenhuma das 10 tem rótulo `bloqueada`.

## RELATÓRIO — produto — T-0007 (Lote 2)

STATUS: OK

FEITO:
- Lidas as 10 issues inteiras (corpo + "Resultados Esperados" nos dois `Spike` + comentários), não
  só o título — prioridade dada às 9 marcadas em `state-board-spr-2026-08-26.md` como "lidas só pelo
  título" (`SPR-35`, `SPR-42`, `SPR-43`, `SPR-44`, `SPR-47`, `SPR-48`, `SPR-49`, `SPR-50`, mais
  `SPR-46` fora dessa lista mas dentro do lote).
- 1 comentário de preservação publicado (verbatim da descrição anterior) seguido de 1 edição de
  descrição: `SPR-47`.
- 9 issues confirmadas `JÁ CONFORME`, sem edição: `SPR-35`, `SPR-42`, `SPR-43`, `SPR-44`, `SPR-45`,
  `SPR-46`, `SPR-48`, `SPR-49`, `SPR-50`.
- Nenhum título alterado.
- Nenhuma lacuna (`G-01..G-09`, `LACUNA-GLO-001`) decidida. `SPR-46` esbarra numa das quatro
  pendências humanas de T-0006 (aceite neutro de fuso vs. esperar `LACUNA-GLO-001`) — apontado o
  comentário já publicado em 2026-08-26, não reprocessado.

Uma linha por card, veredito e as quatro frases citadas literalmente do card resultante:

**`SPR-35`** · JÁ CONFORME
- O quê: "Produzir a evidência medida que fecha a última decisão irreversível do cliente, e só então
  liberar código de produto de cliente."
- Onde: "A interface do terminal roda dentro do processo nativo (arranjo B) ou dentro de um
  navegador conversando com um processo nativo (arranjo D)?"
- Por quê: "Nenhum código de produto de cliente sai antes de B ou D estar escolhido. Escolher por
  omissão, começando a construir, cria fato consumado sobre a decisão mais irreversível do sistema."
- Pré-requisito: "Verificado em 2026-08-26 em fonte primária: Windows é plataforma _out-of-tree_ ...
  e deixa descoberto exatamente o alvo que decide: a estação fixa em Windows, offline." — o que
  falta é nomeado, e são as duas issues-filhas de validação (`SPR-42`, `SPR-43`) mais o fechamento
  (`SPR-50`).

**`SPR-42`** · JÁ CONFORME
- O quê: "Provar — com código rodando, não com leitura de documentação — que Expo serve a superfície
  sem custódia: toda a retaguarda, o dispositivo do cliente-final, e o display de leitura à
  distância."
- Onde: "toda a retaguarda, o dispositivo do cliente-final, e o display de leitura à distância";
  Resultados Esperados: "um projeto de prova em Expo, TypeScript estrito".
- Por quê: "Esta é a metade grande da superfície do produto. Se ela se confirma, a maior parte das
  telas tem um caminho só, e isso vale tanto no arranjo B quanto no D."
- Pré-requisito: "Fora de escopo — e isto é fronteira, não sugestão: Nada que envolva custódia ...
  Isso é a issue irmã desta Epic, e o corte entre as duas já está decidido por regra de produto —
  não se rediscute aqui." O Spike constrói o próprio projeto de prova e não espera vocabulário
  final (`SPR-45`) nem a decisão de arranjo (`D-02`) — é um dos dois Spikes que alimentam essa
  decisão, não o contrário.

**`SPR-43`** · JÁ CONFORME
- O quê: "Sua tarefa não é reconfirmar isso. É medir o que custa cada saída."
- Onde: "a estação fixa em Windows, operando offline, e o terminal móvel do operador."
- Por quê: "Este é o alvo que decide a arquitetura do cliente, e por isso é a issue mais dura da
  Epic."
- Pré-requisito: "O ponto de partida já verificado — não refaça este trabalho: Expo não cobre
  Windows desktop. Verificado em 2026-08-26 em fonte primária ..."

**`SPR-44`** · JÁ CONFORME
- O quê: "O mecanismo que transforma o manifesto que vem da rede em árvore de blocos renderizável —
  e que nunca derruba a tela ao fazer isso."
- Onde: "Ele é o coração de `packages/sdui`."
- Por quê: "O manifesto é entrada não confiável, como qualquer corpo que vem da rede."
- Pré-requisito: "Por que esta issue não espera a decisão de arranjo — Este mecanismo está no
  conjunto que é idêntico nos dois arranjos possíveis do cliente ... e adiar não compra informação
  nenhuma."

**`SPR-45`** · JÁ CONFORME
- O quê: "O vocabulário fechado que o manifesto carrega: os ids de bloco que existem, o que cada um
  faz, e o registro de prefixos que impede colisão."
- Onde: "Tipo que torna id fora do vocabulário um erro de compilação no servidor e no cliente."
- Por quê: "Custo de renome depende de quem atravessa a rede ... o que torna esta issue urgente
  agora e caríssima depois" (seção "A janela que fecha").
- Pré-requisito: nenhum declarado, e nenhum existe — primeira issue da trilha (Epic `SPR-35`, início
  2026-08-26, antes de qualquer outra do lote), e os três documentos que ela referencia
  (`docs/design/vocabulario-e-eixos.md`, `.claude/rules/ui.md`, `.claude/rules/migrations.md`) já
  existem, conferido nesta passada.

**`SPR-46`** · JÁ CONFORME
- O quê: "Catálogo de mensagens. Nenhuma string solta em componente. Todo texto da interface vem do
  catálogo, com chave." mais "Formatação por utilitário único."
- Onde: "Dinheiro, quantidade e data/hora são formatados em um lugar, com a moeda e o fuso do
  cliente."
- Por quê: "Duas formatações no produto significam dois arredondamentos, e um deles está errado."
- Pré-requisito: "Depende de: A decisão de tipo e unidade de dinheiro e quantidade (issue na Epic da
  Fase 1). O utilitário de formatação consome aquela decisão; se ele nascer antes, nasce com a
  conversão errada embutida." — mais a pendência humana de T-0006 já publicada em comentário de
  2026-08-26 (`LACUNA-GLO-001`: aceite neutro vs. fixar "o fuso é do cliente"). Apontada, **não**
  decidida nesta passada.

**`SPR-47`** · REESCRITO
- O quê: "Um bloco, N variantes. O mecanismo que decide qual variante renderizar, e que garante que
  essa decisão acontece no lugar certo."
- Onde: "Espaço e interação são conhecidos no terminal, não no servidor" — resolução local, no
  cliente.
- Por quê: "O manifesto escolhe o bloco; o contexto resolve a variante ... Se o servidor precisa
  saber a variante, o desenho está errado."
- Pré-requisito (seção "Depende de" acrescentada): "O vocabulário fechado de ids (`SPR-45`) e o
  despacho tipado por id com fallback garantido (`SPR-44`). O critério de aceite abaixo pede 'o
  mesmo bloco' renderizado em dois espaços — não existe bloco com contrato de renderização sem as
  duas anteriores resolvidas. Nenhuma decisão de arranjo (`D-02`) é pré-requisito: a resolução de
  variante é idêntica nos dois arranjos possíveis do cliente."
  Motivo da edição: o critério de aceite ("o mesmo bloco renderiza em dois espaços ... verificado")
  exige um bloco com contrato de renderização, e nenhuma das duas issues que produzem esse contrato
  estava nomeada como pré-requisito — falha literal do item 4 das quatro perguntas
  (`.claude/rules/produto.md`, seção "As quatro perguntas"). Comentário de preservação publicado
  antes da edição, com o texto anterior verbatim.

**`SPR-48`** · JÁ CONFORME
- O quê: "Fazer o caminho de venda inteiro ser completável sem tocar a tela."
- Onde: "Ordem de foco declarada e estável em cada bloco" e "Captura de entrada do leitor de
  código" — caminho de venda, no cliente.
- Por quê: "Não é acessibilidade opcional: é como o caixa realmente opera." mais "O operador não lê.
  Ele opera de memória e de músculo."
- Pré-requisito: "Fora de escopo: Cálculo de total e de pagamento (vem do backend) e a definição de
  quais ações existem no caminho de venda (é de produto)." Ver RISCOS abaixo sobre a leitura literal
  do critério de aceite.

**`SPR-49`** · JÁ CONFORME
- O quê: "Levar o sistema de design que já existe escrito para dentro do código, como tokens
  tipados."
- Onde: tokens de cor, forma, tipografia, espaçamento e elevação — sistema de design do cliente.
- Por quê: "Contraste é medido, nunca avaliado a olho. Par de cor sem valor medido não vai para
  produção."
- Pré-requisito: "Ele já nasceu agnóstico de framework, então esta issue atravessa qualquer arranjo
  do cliente." — não espera `D-02`; os cinco documentos de referência já existem, conferido nesta
  passada.

**`SPR-50`** · JÁ CONFORME
- O quê: "Uma decisão escrita, assinada pelo humano, dizendo qual arranjo o cliente adota" (Resultados
  Esperados).
- Onde: "A interface do terminal roda dentro do processo nativo, ou dentro de um navegador
  conversando com um processo nativo acompanhante?"
- Por quê: "O que a decisão libera ... Libera código de produto de cliente."
- Pré-requisito: "Depende de: As duas issues de validação desta Epic — a da superfície sem custódia
  e a da superfície com custódia. Esta issue não começa antes das duas fecharem, e não substitui
  nenhuma delas."

ARQUIVOS: nenhum arquivo do repositório — todo trabalho foi em comentário e descrição da issue
`SPR-47` (Jira). Leitura: `.claude/rules/produto.md`, `.claude/rules/processo.md` §4,
`memory/plataforma/state-board-spr-2026-08-26.md`,
`memory/plataforma/state-pendencias-abertas-2026-08-23.md`,
`memory/plataforma/gotcha-modelo-agendado-antes-da-regra-que-o-define.md`,
`docs/produto/backlog-lacunas-g01-g09.md`. Conferida a existência de todo documento citado como
referência nas 10 issues (`docs/design/*.md`, `docs/arquitetura/*.md`, `docs/produto/*.md`,
`docs/produto/modulos/*.md`, `.claude/rules/*.md`) — nenhuma referência morta encontrada.

NÃO FEITO: —

DECISÕES:
- Não force "Depende de: nenhum" explícito em `SPR-42`, `SPR-45` e `SPR-49`, mesmo sem seção
  dedicada, porque a ausência de pré-requisito é verificável por outro caminho já presente no card
  (fronteira "Fora de escopo" em `SPR-42`; ordem cronológica + docs já existentes em `SPR-45`;
  "atravessa qualquer arranjo" em `SPR-49`) — acrescentar o ritual nos três não reduziria ambiguidade
  real, e `produto.md` também pune restrição/adorno demais.
- Em `SPR-47`, tratei a lacuna como puramente de sequenciamento intra-Epic (produto pode corrigir
  direto, mesmo padrão de `SPR-14`/`31`/`32`/`33` no Lote 1), não como lacuna de regra de negócio —
  por isso editei em vez de levar a `PERGUNTAS`.
- Em `SPR-48`, não editei a frase "fechar pagamento — sem um único toque na tela, verificado ponta a
  ponta" apesar da tensão com o fato de não existir backend de pagamento (Fase 2 não começou, Fase 1
  só fecha em 2026-10-23, e este card vence em 2026-10-05). A própria seção "Fora de escopo" do card
  já isola o cálculo ("vem do backend"), sustentando a leitura de que o teste valida completabilidade
  de fluxo contra manifesto fixo, não integração real. Editar para forçar essa frase seria ritual sem
  reduzir ambiguidade genuína — registrei como RISCO, não como falha do item 4.

RISCOS:
- `SPR-48`: quem pegar o card sem ler "Fora de escopo" com atenção pode entender "fechar pagamento
  ponta a ponta" como exigindo um backend de venda/pagamento que não existe nesta data. Vale
  confirmar com quem pega o card antes de começar, mas não é lacuna nova — é ambiguidade de leitura.
- Achado novo, não catalogado em `G-01..G-09`/`LACUNA-GLO-001`: a Epic `SPR-35` inteira (código real
  em `packages/sdui`, tokens do sistema de design) tem cards com vencimento entre 2026-08-26 e
  2026-10-05, rodando em paralelo à Epic `SPR-34` (Fase 1, fecha só em 2026-10-23) e antes de
  qualquer trabalho de Fase 2 existir. `CLAUDE.md` §2 diz "Fase 1 é o modelo de dados... Só então
  backend, e só então UI"; `.claude/rules/processo.md:74` proíbe criar estrutura de fase futura
  (`packages/`) antes da fase que a cria. O board já registra as duas trilhas como paralelas, com
  donos diferentes (Matheus na Fase 1; Artur e João Marcelo na Epic 35) —
  `memory/plataforma/state-board-spr-2026-08-26.md:17-52` — o que sugere paralelismo intencional
  (o SDUI usa manifesto fixo/fixture, não depende do modelo de dados real). Não decidi isto: é
  exatamente a pergunta que seguiu para `PERGUNTAS` abaixo, porque não está catalogada em nenhuma
  das lacunas com data e a resposta muda se o calendário paralelo continua sendo intencional.

PERGUNTAS:
  - para humano: A Epic `SPR-35` (código de `packages/sdui` e tokens do sistema de design) roda em
    paralelo à Fase 1 (`SPR-34`, fecha 2026-10-23) e antes de qualquer Fase 2, contra a leitura
    literal de `CLAUDE.md` §2 ("Só então backend, e só então UI") e
    `.claude/rules/processo.md:74`. Isso é intencional — o SDUI valida contra manifesto fixo e não
    depende do modelo de dados real — ou o calendário paralelo (`state-board-spr-2026-08-26.md`)
    precisa de uma nota explícita autorizando a exceção?

VERIFICAÇÃO: reli a descrição resultante de `SPR-47` direto do retorno da API do Jira (não do que eu
pretendia escrever) antes de fechar este relatório. Conferi via `Glob` que todo `path` citado como
referência nas 10 issues existe no repositório — nenhum caminho morto. Não rodei teste automatizado
— não se aplica a este lote (sem código, sem DDL).

MEMÓRIA SUGERIDA:
  - type=gotcha escopo=plataforma camada=produto slug=fase-de-sdui-corre-em-paralelo-a-fase-de-dados
    — Epic de SDUI (`SPR-35`) tem código real (`packages/sdui`) agendado entre 2026-08-26 e
    2026-10-05, em paralelo à Fase 1 que só fecha em 2026-10-23 e antes de qualquer Fase 2 — mesma
    família de sintoma de [[gotcha-modelo-agendado-antes-da-regra-que-o-define]], mas na escala de
    fase do projeto (`CLAUDE.md` §2), não de `RN` de entidade. Avaliar fundir com o gotcha existente
    (generalizando a descrição) em vez de criar arquivo novo.

PRÓXIMO PASSO SUGERIDO: thread principal — passo 4 do plano (Lote 3: backlog anterior, parte A —
`SPR-1..13,15`).

## produto — 2026-08-26 (Lote 3)

JQL rodada antes de tocar em qualquer card (`project = SPR AND key in (SPR-1, SPR-2, SPR-3, SPR-4,
SPR-5, SPR-6, SPR-7, SPR-8, SPR-9, SPR-10, SPR-11, SPR-12, SPR-13, SPR-15)`): as 14 issues do brief
batem com o board de hoje, nenhuma some, nenhuma nova.

## RELATÓRIO — produto — T-0007 (Lote 3)

STATUS: OK

FEITO:
- Lidas as 14 issues inteiras (corpo + comentários), não só o título — backlog mais antigo do board
  (criado 2026-08-19), leitura com atenção redobrada por ser onde mais provavelmente há vocabulário
  de vertical vazado e card lido só pelo título.
- **Falha na primeira rodada de preservação, corrigida antes de qualquer edição de descrição:** os
  quatro primeiros comentários de preservação (`SPR-1`–`SPR-4`) perderam o texto citado — a conversão
  de markdown para ADF descartou o conteúdo de um blockquote com sub-título e lista aninhados,
  publicando o comentário com a citação vazia. Detectado ao reler o retorno da API antes de editar
  qualquer descrição (`VERIFICAÇÃO` abaixo). Corrigido publicando um segundo comentário em cada uma
  das quatro issues, com o texto anterior integral em bloco de código (```) — formato que sobrevive à
  conversão. As dez preservações seguintes (`SPR-5`–`SPR-12`, `SPR-15`) já foram feitas direto em
  bloco de código, sem essa falha. Toda descrição só foi editada depois de eu reler o comentário de
  preservação publicado e confirmar o texto completo nele.
- 13 issues **REESCRITO**: `SPR-1`, `SPR-2`, `SPR-3`, `SPR-4`, `SPR-5`, `SPR-6`, `SPR-7`, `SPR-8`,
  `SPR-9`, `SPR-10`, `SPR-11`, `SPR-12`, `SPR-15`.
- 1 issue **JÁ CONFORME**, sem edição: `SPR-13` (já reescrita integralmente em T-0006, é o exemplar
  do formato "Enunciado / Onde / Por quê / Aceite / Caminho infeliz / Pendência declarada /
  Referências" que as demais passaram a seguir nesta passada).
- Nenhum título alterado — todos já respondiam "o quê" com precisão suficiente; a falha estava
  sempre na descrição.
- Nenhuma lacuna (`G-01..G-09`, `LACUNA-GLO-001`) decidida. Onde o item 4 esbarrou numa já
  catalogada (`SPR-6`, `SPR-8`: `G-06`; `SPR-9`: `LACUNA-NUC-038`), apontei o bloqueio existente em
  vez de resolvê-lo.
- 1 achado novo, não catalogado, relatado como `PERGUNTAS: para humano` em vez de decidido: em
  `SPR-12`, qual papel autoriza o cancelamento de comanda (garçom, só gerente, ou garçom até um
  limite) — pergunta já levantada em comentário anterior nesta issue e nunca respondida, e não é
  nenhuma das dez lacunas com data.

Uma linha por card, veredito e as quatro frases citadas literalmente do card resultante:

**`SPR-1`** · REESCRITO
- O quê: "Confirmar, dentro desta issue, que o recorte núcleo × módulo do ponto de venda presencial
  já está decidido e registrado — e nomear o único resíduo que ainda falta fechar."
- Onde: "Núcleo de venda (item, pedido, pagamento, operador) contra os módulos que se ligam sobre
  ele no atendimento presencial: mesa/comanda (`MSA`) e cozinha (`COZ`)."
- Por quê: "A spec já existe e está aprovada... Pedir para 'levantar, analisar e documentar' do zero
  faz quem pegar o card redescobrir decisão já tomada e arrisca produzir uma segunda versão dela."
- Pré-requisito: "Nada falta em disco... O único resíduo real é turno (`LACUNA-NUC-007`)... é `G-02`
  desta revisão, vence em 2026-10-07, e é pergunta do humano, não decidida aqui."

**`SPR-2`** · REESCRITO
- O quê: "Confirmar que o módulo de pedido pelo cliente-final está especificado, e nomear a única
  lacuna real que falta fechar."
- Onde: "Módulo `PCF` (pedido cliente-final) e o módulo que ele exige, `PUB` (publicação de
  catálogo)."
- Por quê: "`PCF` já tem spec aprovada — 18 `RN`... Pedir para levantar de novo o que já está escrito
  redescobre regra aprovada e arrisca divergência."
- Pré-requisito: "O que falta de verdade é a spec de `PUB`... ele tem zero `RN` e está fora do MVP 1
  ... Escrever essa spec é trabalho de produto, não desta issue de levantamento."

**`SPR-3`** · REESCRITO
- O quê: "Reconhecer que a necessidade descrita — receber e concluir pedido destinado à entrega — tem
  duas casas na spec aprovada, não uma, e nomear as duas."
- Onde: "`CMP` — o pedido que não se encerra no ato (fila, senha, retirada)... e `ENT` — entrega em
  endereço, que exige `CMP`."
- Por quê: "A fronteira aprovada não é uma: é duas, com dependência declarada entre elas. Tratar como
  módulo único produz spec que não bate com o catálogo já aprovado."
- Pré-requisito: "`CMP` e `ENT` têm zero `RN` e os dois estão fora do MVP 1... Recortar esta issue em
  duas... ou mantê-la com os dois entregáveis nomeados é decisão do humano — não desta passada."

**`SPR-4`** · REESCRITO
- O quê: "Confirmar que o módulo de cozinha está especificado, e nomear o resíduo que ainda falta
  decidir."
- Onde: "Módulo `COZ`... e o espaço de tela que ele usa — display fixo de leitura à distância, não
  'telão de cozinha'... O módulo usa o espaço, não o batiza."
- Por quê: "`COZ` já tem spec aprovada — 12 `RN`... Levantar de novo é redescobrir regra já
  aprovada."
- Pré-requisito: "O que falta de verdade: `LACUNA-COZ-1` e `LACUNA-COZ-2`... e a pergunta ainda
  aberta ao humano — tela, impressora, ou os dois no ponto de produção."

**`SPR-5`** · REESCRITO
- O quê: "Permitir que o garçom inicie, consulte e gerencie comandas durante o atendimento
  presencial, possibilitando múltiplas comandas por mesa e atuação de diferentes garçons sobre uma
  mesma comanda." (frase original, mantida)
- Onde: "Módulo `MSA` (mesa-comanda)."
- Por quê: "Sem comanda, um grupo à mesa não tem como registrar consumo próprio nem separar a conta
  de outro grupo na mesma mesa."
- Pré-requisito: "`SPR-39`... e `SPR-40`... fecham antes de qualquer tabela desta Epic... Todo card
  filho cita `RN-MSA-nnn`; não reenuncia a regra."

**`SPR-6`** · REESCRITO
- O quê: "iniciar uma nova comanda associada a uma mesa, para registrar os pedidos realizados naquele
  local" (mantido) + identificador técnico próprio, mesa não é identificador único (mantido).
- Onde: mesa/comanda, módulo `MSA` (`SPR-14`).
- Por quê: "para registrar os pedidos realizados naquele local" (mantido).
- Pré-requisito: "`SPR-39`... e as tabelas do módulo `MSA` (`SPR-14`)... O último critério de aceite
  (numeração incremental por mesa) depende além disso de `G-06`... vence 2026-11-13... Não decidido
  nesta passada."

**`SPR-7`** · REESCRITO
- O quê: "iniciar uma comanda associada ao **nome de exibição do cliente-final**" (corrigido de
  "cliente" ambíguo) + três tipos de alvo (`RN-MSA-013`).
- Onde: `MSA`, alvo de consumo (mesa, ficha/cartão, nome de exibição).
- Por quê: "para realizar pedidos em estabelecimentos que não utilizam mesas como identificador do
  atendimento" (mantido).
- Pré-requisito: "Nada trava a construção. Pendência à parte: o prazo de retenção do nome de exibição
  depois do encerramento é decisão do humano... sem ela, a retenção nasce por omissão."

**`SPR-8`** · REESCRITO
- O quê: "criar múltiplas comandas dentro de uma mesma mesa" (mantido) + escolha explícita entre
  lançar no consumo existente ou abrir um segundo (`RN-MSA-002`).
- Onde: mesa/comanda, `MSA`.
- Por quê: "para atender grupos que desejam manter contas separadas" (mantido).
- Pré-requisito: "A identificação incremental por mesa depende de `G-06` — mesma pendência de
  `SPR-6`... Não decidida aqui."

**`SPR-9`** · REESCRITO
- O quê: "visualizar as comandas em andamento" (mantido) + escopo por tenant/estabelecimento a partir
  da identidade autenticada (`RN-NUC-038`).
- Onde: `MSA`, tela de lista.
- Por quê: "para localizar rapidamente o atendimento que preciso operar" (mantido).
- Pré-requisito: "Se 'em andamento' inclui comanda de ontem que ninguém fechou depende de
  `LACUNA-NUC-038`... ainda não tem decisão do humano... Não decidido aqui." + Gate obrigatório:
  performance (paginação, sem N+1, índice).

**`SPR-10`** · REESCRITO
- O quê: "alterar a mesa associada a uma comanda" (mantido) + "a transferência move o consumo: não
  copia, não recria com autor ou instante novos" (`RN-MSA-005`).
- Onde: mesa/comanda, `MSA`.
- Por quê: "para corrigir ou acompanhar mudanças realizadas durante o atendimento" (mantido).
- Pré-requisito: "Nada trava a construção; os itens acima já estão aprovados em `RN-MSA-005`."

**`SPR-11`** · REESCRITO
- O quê: "acessar uma comanda que esteja sendo atendida por outro garçom" (mantido) + classificação
  aditiva/não aditiva das operações, substituindo a observação "fora do escopo do MVP".
- Onde: mesa/comanda, `MSA`, operação concorrente.
- Por quê: "para permitir que diferentes funcionários atuem sobre o mesmo atendimento" (mantido).
- Pré-requisito: "Nada trava a construção; a regra que cobre o caso concorrente já está aprovada
  (`RN-MSA-011`)."

**`SPR-12`** · REESCRITO
- O quê: "Cancelar é linha nova referenciando a comanda original... O cancelamento **não consulta** o
  estado de preparo do item na cozinha" — substitui o critério que contradizia `RN-MSA-012`/
  `RN-COZ-005`.
- Onde: mesa/comanda `MSA`, operação sensível de cancelamento.
- Por quê: "para interromper seu atendimento" (mantido) + autorização de papel e auditoria (operação
  sensível).
- Pré-requisito: "Qual papel autoriza o cancelamento... não está decidido... é achado desta revisão,
  relatado como pergunta ao humano."

**`SPR-13`** · JÁ CONFORME
- O quê: "Encerrar um consumo em aberto é operação de `MSA`, por decisão humana, com papel
  autorizado, motivo, e escolha explícita entre cobrança e cancelamento."
- Onde: "operação de `MSA`... o que acontece no ponto de cobrança é o núcleo concluindo a venda."
- Por quê: "Nenhum outro módulo encerra consumo" + `RN-MSA-010` (decisão humana, nunca pelo relógio).
- Pré-requisito: "Pendência declarada, não presumida" — `LACUNA-MSA-2`, sem fonte, não presumida
  aqui.

**`SPR-15`** · REESCRITO
- O quê: "Permitir que o garçom encontre **item de catálogo**" (corrigido de "produtos", termo
  proibido pelo glossário).
- Onde: "Composição de pedido é do núcleo... O que `MSA` acrescenta é duração, vínculo e
  movimentação do consumo antes da cobrança — não a composição."
- Por quê: "Sem localizar item de catálogo e compor a comanda... o garçom não tem como registrar o
  pedido do jeito que o cliente-final pediu."
- Pré-requisito: "`SPR-39` e `SPR-40` fecham antes de qualquer tabela... Quatro filhos dependem de
  entidade que a spec aprovada ainda não tem... `SPR-16` (`G-03`)... `SPR-19` (`G-04`)... `SPR-20`
  (`G-05`)... `SPR-26` (`G-07`)."

ARQUIVOS: nenhum arquivo do repositório — todo trabalho foi em descrição e comentário das issues
`SPR-1` a `SPR-12` e `SPR-15` (Jira). Leitura: `.claude/rules/produto.md`,
`.claude/rules/jira.md`, `memory/plataforma/state-board-spr-2026-08-26.md`,
`memory/plataforma/state-pendencias-abertas-2026-08-23.md`,
`memory/processo/gotcha-o-titulo-nao-e-o-card.md`,
`memory/processo/convention-bloqueio-nomeia-o-default-silencioso.md`,
`memory/plataforma/gotcha-board-spr-e-nomeado-pela-vertical.md`,
`memory/processo/gotcha-endereco-de-relatorio-envelhece-na-propria-sessao.md`,
`docs/produto/backlog-lacunas-g01-g09.md`.

NÃO FEITO: —

DECISÕES:
- Tratei a falha de preservação em `SPR-1`–`SPR-4` como erro de formatação a corrigir imediatamente
  na mesma sessão, não como algo a relatar depois — a trava de `jira.md` §2 (preservar o texto
  anterior) é condição para a edição ser válida, então continuar editando com preservação vazia
  teria produzido quatro violações em série antes de alguém notar. Publiquei correção antes de
  seguir para `SPR-5`.
- Em `SPR-3`, não decidi se a issue vira duas (uma por módulo `CMP`/`ENT`) ou mantém-se una com dois
  entregáveis nomeados — isso é recorte, reservado ao humano (`jira.md` §2, mesma régua de
  `SPR-25`/`SPR-30` já registrada em `state-pendencias-abertas-2026-08-23.md` §0.1).
- Em `SPR-9`, tratei a pergunta não respondida do comentário de arquitetura ("'em andamento' inclui
  comanda de ontem?") como manifestação de `LACUNA-NUC-038` (já catalogada, ciclo de vida do pedido)
  em vez de achado novo — a mesma lacuna, em escala de módulo.
- Em `SPR-12`, tratei "quem pode cancelar" como achado novo e não como `G-0x`: nenhuma das dez
  lacunas com data cobre autorização de papel para operação de `MSA`, e a pergunta já estava
  registrada em comentário anterior sem nunca ter sido levada à pauta central. Relatei em
  `PERGUNTAS`, não decidi.
- Não toquei em nenhum título — nas 14 issues, o título já respondia "o quê" com suficiência; toda
  falha das quatro perguntas estava na descrição ou na ausência de "por quê"/"pré-requisito".

RISCOS:
- A falha de preservação em `SPR-1`–`SPR-4` (comentário publicado com citação vazia) ficou visível
  no histórico da issue antes de eu corrigir — quem ler o fio na ordem cronológica vê um comentário
  quebrado seguido da correção. É rastreável (o segundo comentário se declara como correção), mas
  não é limpo. Vale registrar como gotcha de ferramenta: blockquote markdown com sub-título e lista
  aninhados não sobrevive à conversão para ADF neste conector; bloco de código (```) sobrevive.
- `SPR-1` está em "Em andamento" (única do backlog anterior nesse estado) e a descrição mudou de
  "levantar tudo" para "confirmar recorte + resolver turno". Se havia trabalho em curso contra a
  descrição antiga, ele precisa ser conferido contra a nova — não vi indício de artefato associado
  além dos comentários já lidos.

PERGUNTAS:
  - para humano: em `SPR-12` (cancelar comanda), qual papel autoriza o cancelamento — garçom, só
    gerente, ou garçom até um limite? Não é nenhuma das dez lacunas com data
    (`docs/produto/backlog-lacunas-g01-g09.md`); é achado desta revisão.

VERIFICAÇÃO: reli a descrição resultante de cada uma das 13 issues editadas direto do retorno da API
do Jira (não do que eu pretendia escrever) antes de passar para a próxima, incluindo a conferência
extra que detectou e corrigiu a falha de preservação em `SPR-1`–`SPR-4`. Não rodei teste automatizado
— não se aplica a este lote (sem código, sem DDL).

MEMÓRIA SUGERIDA:
  - type=gotcha escopo=processo camada=processo slug=blockquote-aninhado-perde-conteudo-na-conversao-para-adf
    — comentário de Jira publicado via `addCommentToJiraIssue` com `contentFormat: markdown` perde o
    conteúdo de um blockquote (`>`) que contém sub-título (`##`) e lista aninhados — a conversão para
    ADF descarta o texto entre "abre blockquote" e o parágrafo seguinte fora dele, sem erro. Sintoma:
    o comentário publicado mostra a frase de abertura e a frase de fechamento, com o meio vazio.
    Mitigação: usar bloco de código (```texto```) para citar texto verbatim em comentário, nunca
    blockquote com estrutura interna. Sempre reler o comentário publicado (via `getJiraIssue` com
    `fields: ["comment"]`) antes de considerar a preservação cumprida.

PRÓXIMO PASSO SUGERIDO: thread principal — passo 5 do plano (Lote 4: backlog anterior, parte B —
`SPR-16..30`).

## produto — 2026-08-26 (Lote 4)

JQL rodada antes de tocar em qualquer card (`project = SPR AND key in (SPR-16, SPR-17, SPR-18,
SPR-19, SPR-20, SPR-21, SPR-22, SPR-23, SPR-24, SPR-25, SPR-26, SPR-27, SPR-28, SPR-29, SPR-30)`): as
15 issues do brief batem com o board de hoje, nenhuma some, nenhuma nova.

## RELATÓRIO — produto — T-0007 (Lote 4)

STATUS: OK

FEITO:
- Lidas as 15 issues inteiras (corpo + comentários), não só o título.
- 9 comentários de preservação publicados (verbatim do texto anterior, em bloco de código conforme
  o achado operacional do Lote 3), seguidos de 9 edições de descrição: `SPR-16`, `SPR-17`, `SPR-19`,
  `SPR-20`, `SPR-21`, `SPR-24`, `SPR-26`, `SPR-27`, `SPR-28`. Cada comentário foi relido no retorno
  da API antes da edição correspondente — nenhuma perda de conteúdo na conversão, ao contrário do
  incidente do Lote 3.
- 6 issues confirmadas `JÁ CONFORME`, sem edição: `SPR-18`, `SPR-22`, `SPR-23`, `SPR-25`, `SPR-29`,
  `SPR-30` — as seis já vinham de reescritas do T-0006 no formato Enunciado/Regras/Aceite/
  Referências, e todas respondem as quatro perguntas com frase citável, inclusive o pré-requisito
  (via seção própria ou remissão a `G-0x` já publicada).
- Nenhum título alterado. `SPR-27` mantém o título pendente de decisão humana (T-0006) — só a
  descrição foi tocada, como o brief autorizou.
- Nenhuma lacuna (`G-03`, `G-04`, `G-05`, `G-07`, `G-08`) decidida. Onde o item 4 esbarrou numa já
  catalogada, apontei o bloqueio existente (rótulo `bloqueada` quando presente, comentário sempre)
  em vez de resolvê-lo, e levei a disputa para o corpo da descrição em "Onde"/"Pré-requisito" — hoje
  ela só estava no comentário, e quem lesse só a descrição não a via.
- `SPR-25`/`SPR-30` tratados como o par declarado no brief: aplicadas as quatro perguntas a cada um
  como está, sem fundir. Os dois já são `JÁ CONFORME` — cada um nomeia a fronteira com o outro
  ("Fronteira com `SPR-25`" em `SPR-30`; "Notas de fronteira" em `SPR-25`).
- 2 cards fundidos em passagem anterior (`SPR-21`→`SPR-22`, `SPR-24`→`SPR-25`) tinham descrição
  obsoleta — descreviam trabalho autônomo que um leitor sem abrir comentários implementaria como
  segunda versão da regra já em vigor no card de destino. Reescritos como redirecionamento explícito,
  sem excluir a issue (mesma leitura do comentário de fusão já publicado, nenhuma trava de exclusão
  acionada porque a fusão já estava decidida antes desta passada).
- 1 achado de conteúdo, não de lacuna: `SPR-28` afirmava "descontos... fora do MVP", e um comentário
  de 2026-08-26 já havia contestado isso (desconto/acréscimo com limite por papel são núcleo,
  `RN-NUC-006`/`RN-NUC-007`, dentro do MVP 1) sem que a descrição fosse corrigida. Levei a correção
  ao corpo — não é decisão nova, é aplicar uma contestação já publicada e nunca incorporada.

Uma linha por card, veredito e as quatro frases citadas literalmente do card resultante:

**`SPR-16`** · REESCRITO
- O quê: "Permitir que o garçom navegue pelo catálogo agrupado — categoria e subcategoria, sem
  limite fixo de profundidade — até localizar o item de catálogo, sem depender de saber o código."
- Onde: "Catálogo — escopo em disputa. Bloqueado por `G-03`... Não decidido nesta passada."
- Por quê: "Sem nenhum agrupamento, o operador só localiza o item digitando o código. Num catálogo
  com centenas de itens, isso é o gargalo do caixa no pico."
- Pré-requisito: "Depende da resposta do humano a `G-03`... Se a resposta for núcleo, depende
  também de `SPR-31`... e de `SPR-39`/`SPR-40`... Não é executável antes disso."

**`SPR-17`** · REESCRITO
- O quê: "Permitir que o garçom pesquise item de catálogo por texto, encontrando o item sem
  precisar navegar pela hierarquia de categoria."
- Onde: "Núcleo — busca sobre o artefato publicado de catálogo (`RN-NUC-013`)."
- Por quê: "Achar o item sem saber o código é necessidade distinta de navegar por categoria
  (`SPR-16`): agiliza o lançamento quando o operador sabe o nome, mas não a posição na hierarquia."
- Pré-requisito: "Classificação de continuidade — busca textual não tem classe declarada... é
  `G-08`... Fonte da busca — offline, a única fonte possível é o artefato publicado retido...
  `G-08` não tem rótulo `bloqueada` — a lacuna está só em comentário."

**`SPR-18`** · JÁ CONFORME
- O quê: "A regra é condicional: um item de catálogo cujo lançamento tem escolha obrigatória
  pendente não é lançável sem a escolha, e a recusa nomeia qual escolha falta."
- Onde: "Fronteira deste card: A etapa — tela, passo, componente, ordem visual — é território de
  `ui`. Este card entrega a regra, não a etapa."
- Por quê: "Não perder variação, complemento ou observação por esquecimento. Hoje o operador anota
  no papel e o erro só aparece na entrega ou na conferência."
- Pré-requisito: "O que este card ainda não pode declarar: Que escolhas obrigatórias existem
  depende de classificar variação por eixos (`G-04`) e adicional/complemento (`G-05`)... A regra
  condicional acima não depende delas."

**`SPR-19`** · REESCRITO
- O quê: "Permitir que o garçom selecione, no lançamento, a variação do item de catálogo — como
  tamanho — para registrar exatamente qual versão foi pedida."
- Onde: "Em disputa — bloqueado por `G-04`: eixo único com preço próprio é do núcleo, ou é o degrau
  de baixo do módulo `GRD`? ... Não decidido nesta passada."
- Por quê: "Sem registrar a variação escolhida, o lançamento não distingue \"X 300 ml\" de
  \"X 500 ml\" — dois preços, uma linha."
- Pré-requisito: "Depende da resposta do humano a `G-04`... nenhuma entidade de variação nasce
  aqui antes da resposta, e cada combinação estrutural permanece item de catálogo próprio até
  `GRD` ligar."

**`SPR-20`** · REESCRITO
- O quê: "Permitir que o garçom selecione adicionais permitidos para um item de catálogo, para
  personalizar o lançamento e incorporar o acréscimo de valor correspondente."
- Onde: "Em disputa — bloqueado por `G-05`: \"adicional\" pertence ao núcleo, a um módulo novo ou a
  um módulo existente — e é conjunto ou multiconjunto? ... Não decidido nesta passada."
- Por quê: "Sem adicional associado ao item de catálogo, cada combinação (ex.: \"com bacon\") vira
  cadastro próprio, e o catálogo cresce por multiplicação manual em vez de composição."
- Pré-requisito: "Depende da resposta do humano a `G-05`... Depende também de a tabela fechada de
  `RN-NUC-013`... ser alterada para admitir o artefato — hoje compor valor a partir de adicional
  contradiz a regra como está escrita."

**`SPR-21`** · REESCRITO (redirecionamento — card fundido em passagem anterior)
- O quê: "A necessidade — observação livre no item de pedido — está atendida em `SPR-22`... que
  absorve este card."
- Onde: "A regra já existe e é do núcleo: `RN-NUC-016`..., termo `order_item_note`..."
- Por quê: implícito na regra citada — observação existe para registrar como a linha é atendida,
  sem virar decisão do sistema.
- Pré-requisito: "Este card não é excluído... Quem chegar aqui não implementa a partir desta
  issue: o trabalho de coleta da observação está em `SPR-22`."

**`SPR-22`** · JÁ CONFORME
- O quê: "Lançar um item de catálogo em um consumo em aberto exige que o item e o preço aplicável
  já estejam no artefato publicado que o terminal retém."
- Onde: "`RN-NUC-002`... lançar item aplica artefato publicado" mais "`RN-MSA-004`... cada
  lançamento carrega autor e instante" — núcleo e `MSA`.
- Por quê: "O motivo é \"aplicar, não decidir\": preço digitado no terminal é o terminal decidindo
  dinheiro."
- Pré-requisito: nenhuma `G-0x` em aberto toca este card; todas as regras citadas (`RN-NUC-002`,
  `RN-MSA-004`, `RN-NUC-016`) já estão aprovadas.

**`SPR-23`** · JÁ CONFORME
- O quê: "Consolidação é agregação de apresentação sobre fatos que permanecem separados."
- Onde: "`MSA`... `RN-MSA-004`..., `RN-COZ-001`..., `RN-NUC-016`..." — apresentação em `MSA` sobre
  fato do núcleo.
- Por quê: "A comanda tem que ser legível no pico. Vinte linhas iguais de refrigerante são
  ilegíveis, e ilegível é o que faz o atendente conferir errado na frente do cliente-final."
- Pré-requisito: "Fora deste card: A chave de equivalência como estrutura de dado é `SPR-33`, que
  permanece bloqueada por outro motivo" — declarado, não é pré-requisito desta issue.

**`SPR-24`** · REESCRITO (redirecionamento — card fundido em passagem anterior)
- O quê: "A necessidade — corrigir a quantidade de um item já lançado — está atendida em `SPR-25`...
  que absorve este card."
- Onde: "Reduzir quantidade é retirada parcial (`RN-MSA-004`); aumentar é lançamento aditivo novo
  (`RN-PCF-006`)."
- Por quê: implícito na regra citada — nenhum dos dois é edição simples, porque edição apaga a
  prova de autor e instante.
- Pré-requisito: "Este card não é excluído... a regra, com papel autorizado, motivo e trilha, está
  em `SPR-25`."

**`SPR-25`** · JÁ CONFORME
- O quê: "Retirar um item já lançado num consumo em aberto — inteiro, ou em parte da quantidade —
  é fato novo autorizado: exige papel autorizado, motivo e trilha, e não apaga o lançamento
  original."
- Onde: "`RN-MSA-004`..., `RN-NUC-001`..., `RN-MSA-012`..." — consumo aberto, `MSA`/núcleo.
- Por quê: implícito no eixo declarado — "enviado × não enviado" não é o eixo; a natureza do fato é.
- Pré-requisito: "Notas de fronteira: Este card absorve `SPR-24`... O destino real é `SPR-30`,
  correção por lançamento novo." Nada bloqueado por `G-0x`.

**`SPR-26`** · REESCRITO
- O quê: "Exibir, no catálogo apresentado ao garçom, que um item de catálogo está indisponível —
  evitando que ele seja oferecido ao cliente-final antes de o lançamento ser tentado."
- Onde: "Em disputa — bloqueado por `G-07`: existe marca de disponibilidade no caminho de venda do
  núcleo, ou indisponível é sempre ausência do artefato publicado...? ... Não decidido nesta
  passada."
- Por quê: "Quem opera precisa saber que um item acabou antes de prometê-lo ao cliente-final, não
  depois do lançamento recusado."
- Pré-requisito: "Depende da resposta do humano a `G-07`... Se a resposta for \"só `EST`\", este
  card não é construível no MVP 1, porque `EST` está fora dele."

**`SPR-27`** · REESCRITO (descrição; título mantido — pendência humana de T-0006)
- O quê: "O lançamento no núcleo recusa item cujo preço não está no artefato publicado
  (`RN-NUC-002`). Esta issue cobre o que acontece quando um item já lançado no consumo deixa de ter
  disponibilidade antes do envio à produção — e nomeia quem, de fato, bloqueia."
- Onde: "Lançamento, no núcleo — não o envio a `COZ`." (com `RN-COZ-010`, `RN-COZ-008`,
  `RN-MSA-012` citadas).
- Por quê: "O garçom precisa saber, antes do envio, que o item deixou de estar disponível — para
  corrigir o pedido com o cliente-final ali, não depois de a produção recusar."
- Pré-requisito: "Duas cláusulas em aberto: item visível e marcado — `G-07`... Concorrência e
  offline — ... decisão de produto ainda não tomada." Mais correção do endereço morto "Epic 5".

**`SPR-28`** · REESCRITO
- O quê: "Calcular o valor de um item lançado: preço do item de catálogo/variação somado aos
  adicionais selecionados, apurado pelo backend — o terminal exibe e coleta, nunca soma."
- Onde: "Núcleo — preço, valor de item e composição de valor existem em qualquer ramo."
- Por quê: "O garçom precisa ver o impacto de variação e adicional no valor do item antes de
  confirmar o lançamento."
- Pré-requisito: "Tipo do dinheiro — `SPR-40`... Este cálculo não nasce antes dela. Arredondamento
  — ... é `G-09`... decisão do humano com o contador, ainda em aberto."

**`SPR-29`** · JÁ CONFORME
- O quê: "O acumulado de um consumo em aberto é composto pelo núcleo e apenas exposto por `MSA`.
  `MSA` não soma, não rateia e não distribui centavo."
- Onde: "`RN-MSA-007`..., `RN-MSA-001`..., `RN-NUC-013`..." — núcleo compõe, `MSA` expõe.
- Por quê: "rateio feito no módulo, ou pior, na tela, é divergência garantida entre o que o
  cliente-final vê e o que é cobrado."
- Pré-requisito: "Pendência declarada, não decidida: A precisão e o arredondamento... são `G-09`...
  decisão de produto com o humano e o contador antes da Fase 1."

**`SPR-30`** · JÁ CONFORME
- O quê: "Corrigir um item já enviado à produção é retirada autorizada mais lançamento novo, nunca
  edição da linha original."
- Onde: "`RN-PCF-006`..., `RN-MSA-012`..., matriz `docs/produto/matriz-operacao-papel-modulos.md:69`"
  — `MSA`/núcleo, com célula de autorização já aprovada.
- Por quê: "O cliente-final muda de ideia depois de o item ter sido enviado à produção, e quem
  atende precisa registrar isso na hora, sem chamar gerente para cada caso."
- Pré-requisito: "O que este card ainda não pode declarar: quais atributos de um item de catálogo
  são corrigíveis depende de classificar variação por eixos (`G-04`) e adicional/complemento
  (`G-05`)... O mecanismo acima não depende delas."

ARQUIVOS: nenhum arquivo do repositório — todo trabalho foi em descrição e comentário das issues
`SPR-16` a `SPR-30` (Jira). Leitura: `.claude/rules/produto.md`,
`memory/plataforma/state-pendencias-abertas-2026-08-23.md`,
`docs/produto/backlog-lacunas-g01-g09.md`.

NÃO FEITO: —

DECISÕES:
- Tratei o par de cartas fundidas (`SPR-21`→`SPR-22`, `SPR-24`→`SPR-25`) como REESCRITO, não como
  "fora de escopo" — a fusão em si já estava decidida antes desta passada (comentário de T-0006), e
  reescrever a descrição obsoleta para um redirecionamento explícito não reabre a decisão de fundir;
  apenas impede que quem leia só a descrição implemente uma segunda versão da regra. Não fundi nem
  excluí nenhuma issue nesta passada.
- Em `SPR-16`, `SPR-19`, `SPR-20`, `SPR-26` (bloqueadas por `G-03`/`G-04`/`G-05`/`G-07`), levei a
  disputa de fronteira para o corpo da descrição em vez de deixá-la só no comentário — mesmo padrão
  do Lote 1 (`SPR-31`/`32`/`33`). A alternativa (deixar como estava, só com nota de vocabulário) já
  havia sido tentada em T-0006 e falha a pergunta "onde": quem lê só a descrição não vê que o domínio
  está em disputa.
- Em `SPR-17`, mantive o rótulo ausente (sem `bloqueada`) e apenas declarei no corpo que `G-08` não
  tem rótulo — coerente com `state-pendencias-abertas-2026-08-23.md` §0 ("G-06 e G-08 não têm card
  rotulado"), que já registra isso como lacuna do board, não desta issue.
- Em `SPR-22`, `SPR-23`, `SPR-25`, `SPR-29`, `SPR-30`, não acrescentei `SPR-39`/`SPR-40`/`SPR-14`
  como "Depende de" explícito, mesmo sendo pré-requisito real (nenhuma tabela do núcleo ou de `MSA`
  existe ainda). Segui o mesmo julgamento já registrado em `DECISÕES` do Lote 2: repetir a
  dependência de Fase 1 em cada card da mesma Epic é ritual, não redução de ambiguidade — ela já foi
  estabelecida nos primeiros cards da trilha (`SPR-5`, `SPR-6`, `SPR-14`) e nenhum destes cinco
  contradiz ou esconde uma dependência nova além dela.
- Em `SPR-28`, tratei a correção do escopo de MVP como aplicação de uma contestação já publicada em
  comentário (2026-08-26 12:17), não como decisão nova de `produto` — o comentário já havia
  identificado a contradição com `RN-NUC-006`/`RN-NUC-007` e o roadmap; a descrição nunca foi
  corrigida antes desta passada.

RISCOS:
- `SPR-27` segue com título "Validar disponibilidade antes do envio" enquanto a descrição agora
  afirma que quem bloqueia é o lançamento no núcleo, não o envio — o título não é falso, mas induz
  a procurar o mecanismo em `COZ`. É a mesma pendência humana já registrada em T-0006; não decidida
  aqui.
- `SPR-16`, `SPR-19`, `SPR-20`, `SPR-26` continuam sem entidade construível até `G-03`/`G-04`/
  `G-05`/`G-07` serem respondidas — as quatro perguntas passam a ser respondidas por completo,
  incluindo "não é executável ainda", mas a Epic segue sem trabalho real possível nesses quatro
  cards. Isso já era verdade antes desta passada; a reescrita só o tornou visível na descrição.
- Os textos de `SPR-16`/`SPR-19`/`SPR-20`/`SPR-26` ainda citam "produto" em nenhum lugar do corpo
  novo (usei "item de catálogo" em toda parte), mas os aceites preservados de `SPR-19`/`SPR-20`
  citam apenas conteúdo, sem repetir a forma antiga — conferido na leitura final.

PERGUNTAS: nenhuma nova. Não encontrei pré-requisito ausente fora das lacunas já catalogadas
(`G-03`, `G-04`, `G-05`, `G-07`, `G-08`) ou das pendências humanas de T-0006 já registradas.

VERIFICAÇÃO: reli a descrição resultante de cada uma das 9 issues editadas direto do retorno da API
do Jira (não do que eu pretendia escrever) antes de passar para a próxima, e conferi que cada
comentário de preservação, publicado em bloco de código, manteve o texto anterior íntegro no
retorno da própria chamada de criação do comentário — nenhuma perda, ao contrário do incidente do
Lote 3. Não rodei teste automatizado — não se aplica a este lote (sem código, sem DDL).

MEMÓRIA SUGERIDA: nenhuma nova. O padrão encontrado (descrição obsoleta em relação a comentário já
publicado; card fundido cuja descrição não virou redirecionamento) é a mesma família de
[[gotcha-o-titulo-nao-e-o-card]] e do gotcha de comentário-vs-descrição já suscitado no Lote 3 — não
abri registro extra.

PRÓXIMO PASSO SUGERIDO: thread principal — passo 6 do plano (amostragem independente de
verificação, cobrindo os quatro lotes).

## thread principal — verificação independente (passo 6) — 2026-08-26

Amostra de 11 issues (>15% das 52 tocadas, mínimo do plano era 8), cobrindo os quatro lotes e toda
chave citada em `RISCOS`/`PERGUNTAS` de qualquer relatório de `produto`: `SPR-14`, `SPR-32`, `SPR-40`
(Lote 1) · `SPR-47`, `SPR-48` (Lote 2) · `SPR-1`, `SPR-12`, `SPR-13` (Lote 3) · `SPR-16`, `SPR-27`,
`SPR-28` (Lote 4). Buscadas ao vivo via `searchJiraIssuesUsingJql`, não pelo texto que `produto`
citou nos relatórios — é a diferença entre confiar no atestado e confiar no card.

**Resultado: nenhuma divergência que exija reabrir lote.** Em todas as 11, as quatro frases citadas
pelo `produto` aparecem verbatim no card ao vivo, citam `path:linha`/`RN` concretos (não prosa
genérica), e onde havia lacuna aberta (`G-03`..`G-09`) ou pendência humana de T-0006, o card aponta
sem decidir.

**Achado menor, não bloqueante:** `SPR-47` e `SPR-48` (cards de origem `ui`, herdados de T-0002) não
têm seção "Por quê" rotulada — a motivação está no texto (ex. `SPR-48`: "é como o caixa realmente
opera"), mas não como frase isolada e citável como nos cards reescritos nesta rodada. Inconsistência
de formato entre gerações de card, não falha de substância. Não gera novo despacho.

**Risco de leitura mantido do relatório de Lote 2, sem resolução aqui:** o aceite de `SPR-48`
("fechar pagamento... verificado ponta a ponta, sem um único toque na tela") pode ler como exigindo
backend de pagamento que ainda não existe (Fase 2 não começou). O card já isola cálculo de
total/pagamento em "Fora de escopo", o que sustenta a leitura de que "fechar pagamento" aqui é o
fluxo de UI até a submissão, não o processamento — mas a ambiguidade é real e fica registrada, não
decidida por mim.

**Perguntas acumuladas dos quatro lotes, para o humano (nenhuma decidida por `produto` nem por
mim):**
1. A Epic `SPR-35` (SDUI/tokens) está agendada em paralelo à Fase 1 e antes de qualquer Fase 2 —
   isso aparenta contradizer `CLAUDE.md` §2. Paralelismo intencional (duas trilhas, donos diferentes)
   ou o calendário precisa de correção?
2. `SPR-12` (cancelar comanda): qual papel autoriza o cancelamento — garçom, só gerente, ou garçom
   até um limite? Não é nenhuma das dez lacunas com data já catalogadas.
3. `SPR-48`: a leitura de "fechar pagamento ponta a ponta" acima está certa (só fluxo de UI), ou o
   aceite precisa ser reescrito para deixar isso inequívoco?

**Nota de tamanho (00-nucleo.md §8):** esta ficha passou de 400 linhas. Justificativa: é o registro
verbatim de 4 relatórios de `produto` (52 issues, 4 lotes) mais esta verificação — partir por lote
quebraria a leitura sequencial que o passo 6 depende (comparar lote com lote), e a ficha não é
arquivo de regra consultado por outro agent fora desta tarefa.

VERIFICAÇÃO: 11 chamadas de leitura via `searchJiraIssuesUsingJql`/`getJiraIssue` direto na API,
comparadas frase a frase contra a citação de `produto` nos relatórios acima. Não rodei teste
automatizado — não se aplica a conteúdo de issue.

## Fechamento

**Definição de pronto (`processo.md` §2), item por item:**

- **Regra de negócio nova, numerada com critério de aceite:** não se aplica — esta tarefa não cria
  `RN`; é revisão de clareza de card contra as quatro perguntas de `produto.md`.
- **Comportamento novo/corrigido com teste do caso concreto:** não se aplica — nenhum código, nenhum
  comportamento de sistema mudou. O "aceite" desta tarefa é textual (card responde as quatro
  perguntas) e foi verificado por leitura, não por teste automatizado.
- **DDL pelo checklist de `migrations.md` + gate de `seguranca`:** não se aplica — nenhuma migration.
- **Endpoint pelo gate de `seguranca`:** não se aplica — nenhum endpoint.
- **Consulta/lista/relatório/tela pelo gate de `performance`:** não se aplica — nenhuma consulta.
- **Decisão não óbvia virou registro em memória, no escopo certo, com linha de índice:** cumprido —
  ver lista de memórias abaixo.
- **Nenhum segredo entrou no repo:** confirmado — todo trabalho foi descrição/comentário de issue já
  pública (Jira `SPR`), sem credencial, sem dado real de cliente.
- **Toda `MEMÓRIA SUGERIDA` foi escrita, fundida ou recusada com motivo:** cumprido — ver abaixo.
- **Issue do Jira com plano, relatórios e fechamento espelhados, status concluída:** **parcial —
  `PENDENTE NO JIRA`** (ver seção própria). As 52 issues de conteúdo (`SPR-1`..`SPR-52`) foram
  editadas diretamente pelo `produto`, o que já é registro público do resultado. O que não está
  confirmado é se o **Plano de Despacho** e os **5 artefatos de relatório** desta ficha (Lotes 1–4 +
  verificação independente do passo 6) foram espelhados como comentários **verbatim, um por
  artefato**, na própria `SPR-55` (`.claude/rules/jira.md` §4). A ficha não registra essa mirroragem
  em nenhum passo — thread principal confirma antes de transicionar, ou espelha agora, um comentário
  por artefato (Plano; Lote 1; Lote 2; Lote 3; Lote 4; verificação independente; este fechamento).

**Memória — avaliação de cada `MEMÓRIA SUGERIDA`:**

1. `type=gotcha escopo=processo slug=blockquote-aninhado-perde-conteudo-na-conversao-para-adf`
   (Lote 3, achado real e concreto) → **escrito**, em
   `memory/processo/gotcha-comentario-de-preservacao-perde-conteudo-na-conversao-adf.md` (nome
   ajustado para nomear a causa operacional — "comentário de preservação" — em vez de só o sintoma
   markdown, mesmo fato). Indexado em `memory/processo/INDEX.md`.
2. `type=gotcha escopo=plataforma camada=produto slug=fase-de-sdui-corre-em-paralelo-a-fase-de-dados`
   (Lote 2) → **não escrito como gotcha, fundido como pergunta em aberto** em
   `memory/plataforma/state-pendencias-abertas-2026-08-23.md` §0.2. Motivo da recusa do formato
   `gotcha`: `gotcha` (`.claude/rules/memoria.md` §5) documenta uma **armadilha confirmada** com
   sintoma e mitigação provados — o caso análogo já registrado
   ([[gotcha-modelo-agendado-antes-da-regra-que-o-define]]) é exatamente isso: `SPR-31`/`32`/`33`
   agendados antes das regras que definem as entidades, um defeito **confirmado** e corrigido. O
   achado da Epic `SPR-35` é diferente de natureza: o board já mostra as duas trilhas com donos
   diferentes, o que é evidência de paralelismo **intencional**, não de defeito — a própria pergunta
   do `produto` reconhece isso. Escrever como `gotcha` apresentaria como fato resolvido algo que
   segue sem resposta do humano. Não fundi com o gotcha existente pela mesma razão: são sintomas de
   escalas diferentes (RN de entidade vs. ordem de Fase do projeto) e fundir teria generalizado um
   registro que hoje é preciso e verificado. O tipo certo para "coisa que só o humano decide" já é o
   que este projeto usa — a pauta única (`state`) — e é lá que a pergunta entrou, junto com duas
   outras acumuladas nos relatórios (papel que cancela `SPR-12`; leitura do aceite `SPR-48`).
3. Nenhuma outra `MEMÓRIA SUGERIDA` nova nos relatórios de Lote 1 e Lote 4 (ambos declararam "nenhuma
   nova", cobertos por registros existentes) — conferido, correto: o padrão que eles descrevem
   (descrição desatualizada em relação a comentário publicado) já está coberto por
   [[gotcha-o-titulo-nao-e-o-card]] e [[convention-bloqueio-nomeia-o-default-silencioso]].

**Memórias atualizadas além das sugeridas** (decisão do orquestrador, não do relatório de `produto`):
`memory/plataforma/state-board-spr-2026-08-26.md` ganhou a seção "O que mudou em 2026-08-26, à noite
(T-0007 · `SPR-55`)" com a contagem por lote (27 REESCRITO / 25 JÁ CONFORME de 52) e o achado do
comentário de preservação; o item 3 de "Três coisas que ninguém está olhando" (nove cards lidos só
pelo título) foi marcado resolvido, porque T-0007 já os leu inteiros — deixá-lo como estava seria o
mesmo defeito de `gotcha-endereco-de-relatorio-envelhece-na-propria-sessao` (lista de pendências que
não se atualiza sozinha).

**`SPR-55` — Concluído, com ressalva declarada, não bloqueante:**

O critério de aceite da issue ("quem pegar qualquer card do board consegue começar... sem precisar
perguntar o que fazer, onde, por quê, ou o que precisa existir antes") foi verificado por amostragem
independente do thread principal em 11 de 52 issues (>15%, acima do mínimo de 8 do plano), cobrindo
os quatro lotes e toda chave citada em `RISCOS`/`PERGUNTAS` de qualquer relatório de `produto` — não
uma amostra aleatória, uma amostra dirigida pelo próprio risco declarado. Resultado: zero
divergência que exigisse reabrir lote; a única inconsistência achada (formato de "Por quê" em
`SPR-47`/`SPR-48`) é de forma, não de substância, e não impede que quem pegue o card comece.

A ressalva: 11/52 é verificação por amostra, não passada completa — as 41 issues não reamostradas têm
só o atestado de `produto`, que é o mesmo agente que julga e que escreve (risco principal nomeado no
próprio plano). Isso não é motivo para não fechar: é motivo para registrar que "zero divergência na
amostra" não é "zero divergência garantida", e para quem ler este fechamento depois saber que a
confiança é amostral, não censitária. As três perguntas que sobraram (`SPR-35`/Fase 1, `SPR-12`,
`SPR-48`) são do domínio do humano, não desta tarefa — o critério de aceite de `SPR-55` pedia que o
card *nomeasse* pré-requisito ausente, não que o resolvesse, e as três foram nomeadas.

**PENDENTE NO JIRA:** confirmar/espelhar em `SPR-55`, um comentário por artefato: o Plano de Despacho;
os relatórios de Lote 1, 2, 3 e 4; a verificação independente do passo 6; e este comentário de
fechamento — antes ou junto da transição para Concluído (`jira.md` §4 e §10).

**O que sobrou para depois** (nenhum item bloqueia o fechamento de T-0007; todos já moram em
`memory/plataforma/state-pendencias-abertas-2026-08-23.md`, pauta única do humano):
- §0.2 (novo): paralelismo `SPR-35`/Fase 1; papel que cancela comanda (`SPR-12`); leitura do aceite
  de `SPR-48`.
- Todas as pendências já catalogadas em §0/§0.1 antes de T-0007 continuam abertas e sem mudança —
  T-0007 não decidiu nenhuma (fora de escopo por desenho do plano).

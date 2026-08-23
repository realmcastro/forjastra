---
id: T-0001
titulo: Catálogo de módulos, fiscal por vigência e roadmap de construção
status: fechada
fechada_em: 2026-08-23
escopo: cliente=- vertical=restaurante modulo=- camada=produto
aberta_em: 2026-08-22
---

## Pedido

> Transcrição de voz do humano, verbatim.

Cara, nessa tarefa aqui, eu quero que seja abordado a questão de produto primeiro. Saber quais são
os módulos que teremos, quais módulos poderemos assistir, quais módulos serão, a princípio do
primeiro MVP, quais módulos verão subsequente, e eu quero, como eu falei, como tem na descrição, um
PDV da próxima geração, ou seja, não será aquele PDV arcaico a gente vai fazer literalmente uma
pesquisa, não uma pesquisa real, mas adicionar módulos e focar bastante também no tributário que vai
ser mudado agora também em questão do IVA e mais na frente uma nova mudança novamente que você vai
ter que se adequar, vai ter que adequar o cliente às regras antigas, como é que vai poder ser
distribuído esses módulos, como é que vai casar com uma futura migração, come heck vai ter que ter
dados, enfim, a gente vai ter que explicar o que cada módulo deve ter, os requisitos, o que é ideal
pra o módulo, o que vai ser os módulos principais de entrega a princípio. No caso, o primeiro, eu
não sei explicar se vai ser tenant, ou se vai ser um cliente específico o foco, vai ser a parte de
restaurante. Por mais que nossa aplicação seja um prevê geral, mas na ordem de prioridade de
construção, apenas construção, não funcionamento. Vai ser focado aos módulos que a gente vai usar no
restaurante. Atendimento com inteligência artificial, organização de pedidos, comunicação com a
cozinha, geração de nota fiscal ou geração de pedidos por parte dos clientes, enfim, você vai
literalmente agir como produto, com o que você é.

## Plano

## PLANO — T-0001 Catálogo de módulos, fiscal por vigência e roadmap de construção

**ESCOPO**
Definir, no território de `produto` (`docs/produto/**`), a camada de produto que a Fase 1 vai
consumir: vocabulário e fronteira do núcleo; postura "nova geração" como critério de recusa;
**catálogo completo de módulos** (propósito, escopo, unidade de ativação, expõe/exige, comportamento
desligado, dado sensível); **arquitetura do módulo fiscal com regimes coexistindo e versionados por
vigência**; spec da vertical restaurante e dos módulos de MVP puxados por ela (mesa/comanda, cozinha,
pedido pelo cliente-final, atendimento com IA); e **proposta de corte de MVP** com critério de
dependência, para o humano decidir.

**FORA DE ESCOPO**
Tabela, coluna, DDL, migration, endpoint, contrato de rota, componente, bloco SDUI. Escolha de
stack/ORM/framework/auth/PK (D-01..D-04). Preço, pacote comercial, prazo e a **decisão** final de
prioridade — proposta é de `produto`, corte é do humano. Regra fiscal com número (alíquota,
CST/CSOSN, código de classificação tributária, layout de documento, data de calendário legal
afirmada como fato). Spec profunda de módulo que não entra no MVP — esses ficam com uma linha no
catálogo. Criar `apps/`, `db/`, `packages/`, `src/`.

**ESCOPO DE MEMÓRIA**
`cliente=-` `vertical=restaurante` `modulo=-` (catálogo transversal) `camada=produto`

**DECISÕES ABERTAS QUE TOCAM ISSO**
- **D-03 (auth/identidade)** — toca de verdade: papel de operador, e principalmente "pedido pelo
  cliente-final" (o cliente-final é anônimo, identificado por sessão de mesa, ou por conta?) e
  "atendimento com IA" (quem é o interlocutor). **Não escalar antes de executar**: `produto` fica
  autorizado a declarar o *requisito de negócio* de identidade e a listar o que D-03 precisa
  responder — isso alimenta a decisão em vez de presumi-la. Escolher estratégia técnica é `BLOQUEIO`.
- **D-04 (PK/timestamps/soft delete)** — mesma postura: `produto` declara "documento fiscal e
  movimento de caixa não se editam nem se apagam; retificação é fato novo" como requisito, sem
  propor convenção de coluna.
- **D-01/D-02** — não tocam esta tarefa.
- **Escalar ao humano ANTES do passo 5**: existe cliente-piloto real e nomeado (que viraria
  `t_<slug>` e `docs/produto/clientes/<slug>.md`), ou o foco inicial é só a vertical restaurante? É
  a dúvida que o próprio humano levantou e ela decide se nasce arquivo de cliente. O passo 1 formula
  essa pergunta; os passos 2–4 rodam sem a resposta.

**PASSOS**

1. **`produto`** — Fundação de vocabulário e fronteira. Escrever `glossario.md` (um termo, um
   significado, nome em inglês para o código; separar o léxico do núcleo — venda, item, pedido,
   pagamento, operador, turno, cliente-final, catálogo — do léxico de ramo — mesa, comanda, praça,
   bomba, frota); `fronteira-do-nucleo.md` (o teste "posto + padaria + loja de roupa precisam
   **todos** disto?" aplicado item por item ao que hoje chamamos de núcleo, e a resposta explícita ao
   framing **vertical vs cliente**: o que se decide por vertical, o que se decide por cliente, o que
   nunca desce do núcleo); `postura-nova-geracao.md` (cada item no formato "recusamos X do PDV
   arcaico → portanto o produto faz Y", verificável; adjetivo sem consequência de produto não entra).
   Fixar aqui a **convenção de código curto de módulo** usada em `RN-<MODULO>-<nnn>`, para os passos
   seguintes não colidirem numeração.
   — entrega: `docs/produto/glossario.md`, `docs/produto/fronteira-do-nucleo.md`,
   `docs/produto/postura-nova-geracao.md` + `PERGUNTAS: para humano` sobre cliente-piloto nomeado —
   **sequencial, primeiro, ninguém roda antes**

2. **`produto`** — Catálogo de módulos. Escrever `docs/produto/catalogo-de-modulos.md`: **todos** os
   módulos previstos (inclusive os de verticais que ainda não atendemos), uma entrada curta cada, com:
   código curto, propósito em uma frase, **escopo** (núcleo / módulo / vertical / cliente)
   justificado pelo teste do passo 1, **unidade de ativação** (é ativável isolado? exige qual
   outro?), o que **expõe** e o que **exige**, **o que acontece com o cliente que tem o módulo
   desligado**, e **dado sensível que ele toca**. Entrada sem "comportamento desligado" não está
   pronta — é o teste de plugabilidade. Sem spec profunda: aqui é a linha do catálogo.
   — entrega: `docs/produto/catalogo-de-modulos.md` — **sequencial, depende de 1**

3. **`produto`** — Fiscal: arquitetura de regime, sem números. Dois arquivos:
   `docs/produto/modulos/fiscal.md` (spec do módulo: propósito, entidades conceituais, casos de uso,
   `RN-FIS-nnn` com critério de aceite, expõe/exige, comportamento desligado) e
   `docs/produto/fiscal-regimes-e-vigencia.md` (o requisito atemporal: **regimes coexistem**; toda
   regra fiscal tem vigência; o fato gerador **congela** a versão de regra que o produziu; fato
   passado nunca é recalculado por regra nova; retificação/cancelamento é **fato novo** referenciando
   o original; cliente muda de regime sem reescrever histórico; um mesmo cliente pode ter fatos de
   dois regimes na mesma janela; o que o módulo fiscal expõe para o núcleo e o que exige dele).
   **Proibido**: alíquota, CST/CSOSN, código de classificação tributária, layout, sigla de documento
   tratada como certa, e qualquer data de calendário legal afirmada como fato — tudo isso vira
   `PERGUNTAS: para humano` (quais documentos emitimos, provedor/middleware de emissão ou emissão
   própria, regimes tributários dos clientes-alvo, se há contador de referência, o que da transição
   IBS/CBS ele já considera fechado).
   — entrega: `docs/produto/modulos/fiscal.md`, `docs/produto/fiscal-regimes-e-vigencia.md` —
   **paralelo com 4** (arquivos disjuntos, sem dependência de conteúdo além do passo 2)

4. **`produto`** — Vertical restaurante. Escrever `docs/produto/verticais/restaurante.md`: o que o
   ramo exige **além** do núcleo, fluxo operacional típico (salão, balcão, retirada, entrega), jargão
   do ramo mapeado ao glossário, expectativa de hardware e de rede, e **quais módulos do catálogo
   esta vertical liga** — declarando o que é do ramo e o que já parecia ser mas é de cliente. Nenhum
   termo desta spec pode ter vazado para o núcleo no passo 1; divergência encontrada é `RISCOS`, não
   correção silenciosa do passo 1.
   — entrega: `docs/produto/verticais/restaurante.md` — **paralelo com 3**

5. **`arquiteto-dados`** — **CONSULTA** (read-only, ≤10 linhas, não escreve arquivo). "As exigências
   de `fiscal-regimes-e-vigencia.md` — regra com vigência, fato congelando a versão de regra,
   coexistência de regimes no mesmo cliente, migração de regime sem reescrever histórico — são
   realizáveis em Postgres com schema por cliente e migration forward-only? Qual delas é a mais cara
   de acomodar depois se não estiver no modelo da Fase 1?" Contexto mínimo: os dois arquivos do passo
   3. Ele pode responder `BLOQUEIO` por D-01/D-04 — resposta válida e informativa; **não** peça
   modelo, tabela ou DDL.
   — entrega: resposta colada na ficha pelo thread principal — **depende de 3; pode rodar em paralelo
   com 4 e 6**

6. **`produto`** — Módulos de MVP do salão. Spec de `modulos/mesa-comanda.md` e `modulos/cozinha.md`
   (comunicação com a cozinha / organização de pedidos): propósito, entidades, casos de uso,
   `RN-<COD>-nnn` com critério de aceite **e caminho infeliz**, expõe/exige, comportamento desligado,
   dado sensível. Ponto obrigatório em cozinha: o que acontece quando o display cai ou a rede local
   morre no meio do serviço.
   — entrega: `docs/produto/modulos/mesa-comanda.md`, `docs/produto/modulos/cozinha.md` —
   **sequencial, depende de 2 e 4**

7. **`produto`** — Módulos de MVP de canal externo. Spec de `modulos/pedido-cliente-final.md` (o
   cliente-final pede pelo próprio dispositivo) e `modulos/atendimento-ia.md`. Consome o vocabulário
   de mesa/comanda do passo 6 — por isso vem depois. Em ambos, declarar: quem é o interlocutor e como
   ele é identificado (**requisito**, não estratégia — D-03), o que a IA **pode decidir sozinha** e o
   que exige operador humano, o que acontece quando a IA não sabe, e que dado de pessoa e que
   conteúdo de conversa o módulo passa a guardar e por quanto tempo. Nenhum cálculo de preço,
   desconto, imposto ou disponibilidade vive nesses módulos — declare que vêm do núcleo.
   — entrega: `docs/produto/modulos/pedido-cliente-final.md`,
   `docs/produto/modulos/atendimento-ia.md` — **sequencial, depende de 6**

8. **`seguranca`** — **CONSULTA** (read-only, ≤10 linhas, não escreve arquivo, **não é auditoria**).
   "Que requisitos você exige ver **declarados na spec de produto** de um módulo que expõe canal ao
   cliente-final e de um módulo que trata conversa com IA, para que o gate de segurança seja
   aprovável quando o artefato técnico existir? O que está faltando nas duas specs do passo 7?"
   Contexto mínimo: os dois arquivos do passo 7.
   — entrega: resposta colada na ficha; lacuna apontada volta como despacho curto a `produto` —
   **depende de 7; paralelo com 9**

9. **`produto`** — Roadmap e proposta de corte. Escrever `docs/produto/roadmap-de-modulos.md`: MVP 1
   / subsequente / horizonte, com o **critério de dependência** explícito (fase não é prazo), a
   separação declarada entre **ordem de construção** (puxada por restaurante) e **ordem de
   funcionamento** (o produto é PDV geral desde o dia 0), e o custo/risco de cada módulo que ficou
   fora. Vem por último de propósito: o corte precisa do tamanho real do fiscal e do salão. `produto`
   **propõe e mostra o trade-off; não decide prioridade** — o passo termina com `PERGUNTAS: para
   humano` pedindo confirmação do corte. Atualizar `docs/produto/README.md` com os arquivos de raiz
   criados nesta tarefa.
   — entrega: `docs/produto/roadmap-de-modulos.md`, `docs/produto/README.md` (editado) —
   **sequencial, último; depende de 3, 4, 6, 7**

**GATES** (`CLAUDE.md` §4)
- **Gate 1 — regra de negócio antes do código: é esta tarefa.** Cumprido por construção; nada aqui
  vira código nesta ficha.
- **Gate 2 (schema: `arquiteto-dados` + `seguranca`) — não se aplica:** nenhuma DDL, nenhum arquivo
  em `db/`. Fica **agendado** para o modelo da Fase 1, e o passo 5 é consulta de viabilidade, não o
  gate.
- **Gate 3 (endpoint → `seguranca`) — não se aplica:** nenhuma rota. Fica **agendado** para os
  módulos dos passos 3 e 7, que são os que vão expor canal externo e dado de pessoa; o passo 8 é
  consulta de entrada, não o gate.
- **Gate 4 (`performance`) — não se aplica:** nenhuma consulta, lista ou tela. Fica agendado para a
  fase de contratos/UI. **Não dispare `performance` nesta ficha** — auditar prosa é gate cerimonial.
- **Gate 5 (`BLOQUEIO` não se ignora) — ativo, e é o mais provável de disparar** no passo 3 (regra
  fiscal concreta) e nos passos 1/7 (D-03).

**RISCO PRINCIPAL**
Alucinação de regra fiscal. O passo 3 é o único do plano onde o modelo tem incentivo forte para
preencher lacuna com plausível (alíquota, CST, prazo de transição, layout), e fiscal errado escrito
com confiança contamina o modelo de dados da Fase 1 e só aparece na primeira nota rejeitada.
Mitigação já embutida: brief proíbe número, exige `PERGUNTAS: para humano` no que faltar, e o
entregável é **arquitetura de vigência**, que é atemporal e sobrevive a qualquer mudança de regime.

Riscos secundários, para vigiar na validação (etapa 5, não pular): (a) termo de restaurante vazando
para `fronteira-do-nucleo.md` ou `catalogo-de-modulos.md` — grep por `mesa`, `comanda`, `cozinha`,
`garçom` nos arquivos dos passos 1 e 2; (b) `produto` decidindo prioridade no passo 9 em vez de
propor; (c) spec profunda de módulo fora do MVP no passo 2 (trabalho jogado fora); (d) arquivo
passando de 400 linhas nos passos 3, 6 e 7 — instruir a quebrar em vez de justificar.

<!-- Cada agent ACRESCENTA sua seção abaixo, no formato:

## <agent> — AAAA-MM-DD
<Relatório de Handoff verbatim>

Ninguém reescreve nem apaga a seção de outro. -->

## produto — 2026-08-22

## RELATÓRIO — produto — T-0001 (passo 1)
STATUS: OK
FEITO:
- Escrevi `glossario.md`: léxico do núcleo (escopo/identidade, catálogo/preço, pedido-venda-correção,
  pagamento, caixa/turno, pessoas/autorização, âncora fiscal), léxico de plataforma, léxico de ramo
  marcado por ramo (restaurante, combustível, varejo) e a seção "parece de ramo e não é".
- Fixei a convenção de código de módulo e a numeração `RN-<COD>-<nnn>`: regra de formação, registro
  único de códigos (`NUC`, `FIS`, `MSA`, `COZ`, `PCF`, `ATI`, `RES`, `PST`, `VAR`) e códigos
  bloqueados (`PDV`, `POS`, `NFE`, `NF`, `SAT`, `TEF`).
- Escrevi `fronteira-do-nucleo.md`: teste dos três negócios aplicado item por item em 7 blocos
  (~55 itens) com escopo e motivo em uma cláusula; o que nunca desce do núcleo; procedimento de
  classificação; seção vertical vs cliente com testes, assimetria de decisão e tabela de custo dos
  três erros; divisão fiscal núcleo/módulo/vertical/cliente sem regra concreta; reclassificação.
- Escrevi `postura-nova-geracao.md`: 20 itens `PN-nn` no formato recusamos → portanto o produto faz →
  como se prova, cada um com teste concreto; seção declarando os adjetivos cortados.
ARQUIVOS:
- `docs/produto/glossario.md` (novo, 261 linhas)
- `docs/produto/fronteira-do-nucleo.md` (novo, 245 linhas)
- `docs/produto/postura-nova-geracao.md` (novo, 203 linhas)
- `docs/produto/README.md` (só leitura — a atualização dele é do passo 9)
- `memory/plataforma/INDEX.md`, `memory/plataforma/decision-forja-e-pdv-modular.md` (só leitura)
NÃO FEITO: —
DECISÕES:
- **Pedido ≠ venda.** Fixei dois conceitos: `order` é a intenção **mutável** em construção; `sale` é
  o fato **imutável** concluído. Trade-off: duplica vocabulário de item (`order_item`/`sale_item`) e
  pode custar uma estrutura a mais no modelo; em troca, "fato concluído não se edita" (PN-07) passa a
  ser garantia estrutural em vez de disciplina. Deixei explícito que se são uma ou duas estruturas no
  banco é decisão de `arquiteto-dados`.
- **Vertical não contém código próprio** — é receita (módulos ligados + configuração padrão +
  vocabulário); cliente é só valor de configuração. Comportamento de ramo que não cabe em módulo é
  sinal de fronteira de módulo errada, não licença para código de ramo. Isso fecha a discussão
  vertical vs cliente com um critério único e torna a exceção de cliente uma dívida declarada.
- **Fiscal partido em âncora + módulo.** O núcleo guarda o fato gerador, a referência/estado da
  obrigação e a regra de que falha de emissão não impede a venda; toda a regra (vigência, regime,
  apuração, emissão, contingência) é do módulo `FIS`. `CLAUDE.md` §1 lista "fiscal" na enumeração do
  núcleo — leio isso como o conceito pertencer ao núcleo de venda, não a regra fiscal morar lá. Se a
  leitura for outra, é correção de uma linha em `fronteira-do-nucleo.md` §2.7 e §6.
- **Assimetria de escopo**: para *comportamento*, na dúvida escolha o escopo mais estreito
  (cliente/módulo); "o mais geral que ainda é verdade" vale para *conhecimento* (memória). Motivo:
  promover depois é barato, retirar comportamento já entregue não é.
- **Encargo genérico ficou fora do núcleo** (taxa de serviço/entrega/embalagem): acréscimo cobre o
  caso simples; encargo nomeado é módulo/vertical. Padaria e loja de roupa não cobram.
- `MSA` cobre mesa **e** comanda como um código só, e `COZ` foi nomeado "produção / cozinha" para não
  amarrar o módulo ao ramo. Se o passo 2 decidir separar, precisa de **código novo** — código é
  imutável, não se renumera.
- Registro de códigos mora no `glossario.md`, não no catálogo: um lugar só evita duas listas
  divergindo. O catálogo (passo 2) cita e estende a tabela lá.
RISCOS:
- A busca por termo de ramo (`mesa`, `comanda`, `cozinha`, `bomba`, `delivery`) **acha ocorrência de
  propósito** nos três arquivos: no `glossario.md` §3 (léxico de ramo, pedido no brief), na coluna
  "vertical"/"módulo" da tabela da fronteira, e como proibição explícita. Nenhuma está em seção de
  núcleo — validei com busca (ver VERIFICAÇÃO). Não tratar como violação.
- `PN-10` (cliente exporta o próprio dado) e `PN-20` (cliente edita catálogo, preço, operador e
  limites sozinho) são compromissos de produto com custo real de construção que **ninguém dimensionou
  ainda**. Se o humano não os quiser no MVP, eles continuam válidos como postura mas viram horizonte
  no roadmap — o passo 9 precisa tratar isso explicitamente, senão o roadmap nasce contradizendo a
  postura.
- `PN-11` e `PN-16` dependem de papel de operador autenticado, que depende de **D-03**. Declarei o
  requisito de negócio (papel verificado no backend, trilha de quem/quando/o quê), não a estratégia —
  não houve `BLOQUEIO`, mas D-03 herda esses dois itens como requisito de entrada.
- A âncora fiscal do núcleo (`taxable_event`, estado da obrigação) é a parte mais provável de o passo
  3 querer mexer. Divergência ali é `RISCOS` do passo 3, não edição silenciosa deste passo.
- Não existe ainda spec de módulo: os códigos reservados são uma promessa. Se o passo 2 concluir que
  "pedido pelo cliente-final" (`PCF`) e "atendimento com IA" (`ATI`) são um módulo só, sobra um código
  reservado sem uso — aceitável (código não se reaproveita), mas precisa ficar registrado como
  aposentado, não apagado.
PERGUNTAS:
  - para humano: **o foco inicial é um cliente-piloto real e nomeado, ou a vertical restaurante como
    classe?** Opções e consequências:
    **(A) Cliente-piloto nomeado** — nasce `docs/produto/clientes/<slug>.md` e, na Fase 1, um schema
    `t_<slug>`. Ganho: as decisões param de ser hipotéticas (regime tributário real, se cobra taxa de
    serviço, quantos estabelecimentos, que equipamento e que rede ele tem), e o corte do MVP passa a
    ser "o que faz *ele* operar". Risco: tudo que ele pede vira candidato a virar regra de vertical
    sem passar pelo teste — é exatamente o erro cuja fatura está em `fronteira-do-nucleo.md` §5.1.
    **(B) Vertical restaurante como classe** — nasce só `docs/produto/verticais/restaurante.md`.
    Ganho: nenhuma preferência de um dono de restaurante se disfarça de regra do ramo. Risco: sem
    cliente real, a regra fiscal e o corte do MVP continuam em hipótese, e "o ramo funciona assim"
    passa a ser *nossa* suposição — que é o outro modo de errar.
    **(C) Os dois, em ordem** — vertical como classe agora, piloto nomeado quando ele existir; o
    arquivo de cliente só nasce com nome real e é sempre configuração sobre a vertical, nunca o
    contrário.
    Pergunta fechada: **A, B ou C — e, se A ou C, qual é o nome do cliente?** Não criei nada em
    `docs/produto/clientes/` e não presumi resposta; os passos 2–4 rodam sem ela.
  - para humano: `PN-10` (exportação do próprio dado pelo cliente) e `PN-20` (cliente altera catálogo,
    preço, operador e limites sem chamado) são compromissos de **MVP** ou de **horizonte**? A resposta
    não muda a postura, muda o roadmap do passo 9.
VERIFICAÇÃO:
- Contei as linhas dos três arquivos (busca por início de linha): 261 / 245 / 203 — todos abaixo do
  teto de 400.
- Busquei `mesa|comanda|cozinha|garçom|bomba|delivery` (case-insensitive) em `docs/produto/`: 15
  ocorrências, todas em seção rotulada como ramo/vertical, em tabela de "parece de ramo e não é", no
  registro de códigos ou em cláusula de proibição. Nenhuma em seção de núcleo.
- Busquei o repo por arquivos existentes em `docs/`: só os três `README.md` — nenhum arquivo de
  produto foi sobrescrito.
- Não escrevi nada fora de `docs/produto/**`. Não rodei teste (não há código nesta fase) e não citei
  nenhum número não medido: nenhum orçamento de tempo, alíquota, prazo ou data legal entrou nos
  arquivos.
MEMÓRIA SUGERIDA:
  - type=convention escopo=plataforma slug=convention-codigo-de-modulo-e-numeracao-de-regra — código
    de módulo tem 3–4 letras derivadas do nome pt-BR, é imutável e nunca reaproveitado; o registro
    único vive em `docs/produto/glossario.md` §4, e `RN-<COD>-<nnn>` é sequencial por código
    (`NUC` = núcleo; regra de cliente entra na sequência do módulo que ela supera) · camada:produto
  - type=decision escopo=plataforma slug=decision-pedido-mutavel-venda-imutavel — pedido (`order`) é
    intenção mutável, venda (`sale`) é fato concluído imutável; correção é fato novo referenciando o
    original, e a forma no banco é de `arquiteto-dados` · camada:produto
  - type=decision escopo=plataforma slug=decision-vertical-e-receita-nao-codigo — vertical não tem
    código próprio (é módulos ligados + configuração padrão + vocabulário) e cliente é só valor de
    configuração; comportamento de ramo que não cabe em módulo denuncia fronteira de módulo errada;
    para comportamento, na dúvida escolha o escopo mais estreito · camada:produto
  - type=convention escopo=plataforma slug=convention-postura-nova-geracao-e-criterio-de-recusa — os
    itens `PN-nn` de `docs/produto/postura-nova-geracao.md` são critério de recusa de spec, citáveis
    por número; mudar um exige decisão registrada, não interpretação · camada:produto
PRÓXIMO PASSO SUGERIDO: `produto` (passo 2) — catálogo de módulos, estendendo o registro de códigos
do `glossario.md` §4.3 e classificando cada entrada pelo procedimento de `fronteira-do-nucleo.md` §4;
entrada sem "comportamento com o módulo desligado" não está pronta.

## produto (passo 2) — 2026-08-22

## RELATÓRIO — produto — T-0001 (passo 2)
STATUS: OK
FEITO:
- Escrevi `catalogo-de-modulos.md` com **31 entradas** (`NUC` + 30 módulos) + 3 receitas de vertical,
  organizadas por **camada de dependência**: camada 0 (núcleo), camada 1 (22 módulos que exigem só o
  núcleo), camada 2 (8 módulos que exigem outro módulo), verticais, e candidatos sem código.
- Toda entrada tem os 7 campos obrigatórios, inclusive **Desligado** e **Sensível**; cada `Escopo`
  cita a seção de `fronteira-do-nucleo.md` que sustenta a classificação (§2.x ou §4, resposta 2).
- Entrada de `FIS` marcada `fronteira sob decisão no passo 3a`, sem código novo para a partição, e
  reescrita para o peso da **emissão própria** (custódia de credencial de assinatura, fila de
  transmissão/contingência como parte do produto, vigência acompanhada por nós — `PN-08`).
- Declarei o escopo `cliente` como **categoria sem instância** (§1) e não criei nada em
  `docs/produto/clientes/`.
- Estendi o registro único de códigos em `glossario.md` §4.3 com **25 códigos** novos (`PER EST PUB
  PRM ECG CLF VOU ADQ PRZ PGO CMP ORC COM RSV REL INT GRD ETQ BMB FTC FRN FID ENT TRC CSG`), mais
  uma nota de três linhas dizendo que a lista de módulos vive no catálogo e o registro de códigos
  continua ali. Nenhuma outra seção do passo 1 foi tocada.
- Casos em que o teste dos três negócios **negou** um módulo que parecia existir, registrados na
  própria entrada: **não existe módulo de balança** (quantidade fracionária é núcleo, o periférico é
  `PER`); **retirada** não é módulo (é destino de `CMP`); **loja na internet** é `PUB`+`PCF`+`PGO`;
  **frota** é `PRZ`; **canal de autoatendimento** é configuração de `PCF`, não módulo novo.
ARQUIVOS:
- `docs/produto/catalogo-de-modulos.md` (novo, 399 linhas)
- `docs/produto/glossario.md` (editado — só a tabela de §4.3 e uma nota abaixo dela; 290 linhas)
- `docs/produto/fronteira-do-nucleo.md`, `docs/produto/postura-nova-geracao.md` (só leitura)
- `memory/plataforma/INDEX.md` (só leitura)
NÃO FEITO: —
DECISÕES:
- **Parti "ciclo de cumprimento" em três módulos.** `fronteira` §2.3 tem uma linha só (fila, preparo,
  entrega, retirada); virou `CMP` (fila/estado/retirada), `COZ` (preparo) e `ENT` (endereço). Motivo:
  loja de roupa entrega sem preparar e padaria prepara sem entregar — um módulo só obrigaria quem
  quer um a levar os três. Custo: três fronteiras para errar em vez de uma (ver RISCOS).
- **`COZ` ficou cross-vertical e sem termo de ramo na entrada.** O glossário o nomeia "Produção /
  cozinha"; na entrada só existe "produção", com o mapeamento do jargão remetido à receita da
  vertical. Alternativa recusada: um módulo por ramo (restaurante/padaria), que multiplicaria código.
- **`PGO` não depende de `PCF`.** `fronteira` §2.4 diz que pagamento antecipado "depende de existir
  canal externo"; leio a própria cobrança (link/código) como o canal, então `PGO` liga isolado. Se o
  humano quiser que cobrança remota só exista com canal de pedido, é uma linha de dependência.
- **`PCF` exige destino declarado** (`MSA` ou `CMP`) e a ativação sem destino é **recusada**, em vez
  de aceitar e degradar. Motivo: pedido externo sem destino é pedido que ninguém atende — falhar na
  ativação é mais barato que descobrir no serviço.
- **`ATI` sem `PCF` atende operador**, não cliente-final. Isso mantém `ATI` plugável sem transformá-lo
  em canal externo por acidente, e deixa `PN-16` como limite único dos dois modos.
- **Não criei código para a partição do fiscal** nem para os candidatos da §6 (assinatura, marketing,
  loja na internet). Código é imutável; reservar para módulo hipotético gera código aposentado.
- **Formato compacto por causa do teto de 400 linhas.** Empacotei propósito/Escopo/Ativação/Expõe/
  Exige em parágrafo corrido e mantive `Desligado` e `Sensível` destacados. Consequência: algumas
  linhas de fecho passam de 100 caracteres, fora da largura dos arquivos do passo 1. Preferi isso a
  cortar módulo. Se o catálogo crescer, a quebra natural é núcleo+cross-vertical em um arquivo e
  módulos ligados por vertical em outro (não fiz: o entregável era um arquivo só).
RISCOS:
- **O módulo com maior chance de fronteira errada é `CMP` (Cumprimento de pedido)** — e é o que peço
  ao passo 9 para olhar primeiro. Três razões, em ordem de gravidade: (1) ele nasceu de uma **partição
  minha** de uma linha única da fronteira, não de um item já classificado — é o único da camada 1 cujo
  recorte não tem lastro no passo 1; (2) o que ele expõe (estado do pedido + fila) pode já ser do
  **núcleo** (o pedido tem ciclo de vida de qualquer jeito) ou já ser produzido por `COZ`, e nos dois
  casos `CMP` viraria casca — mas se eu o dissolvesse no núcleo, apareceria fila e senha no PDV de
  quem entrega no ato, que é o erro caro de `fronteira` §5.1; (3) ele já é **dependência dura de dois
  outros** (`ENT` exige, `PCF` usa como destino), então errar aqui propaga. Teste que resolve: numa
  operação real que só entrega no ato, `CMP` desligado deixa alguma tela ou estado faltando? Se não,
  a fronteira está certa; se o núcleo já precisa do estado, `CMP` deve ser dissolvido antes de virar
  código.
- **`fronteira-do-nucleo.md` §6 ficou ambíguo** depois da decisão do humano: ele lista "quem emite por
  ele (provedor, integrador ou emissão própria)" como decisão **de cliente**, o que continua verdade
  (o contador do cliente pode emitir por fora), mas não distingue isso da **capacidade que nós
  construímos**, que é emissão própria. Não editei o arquivo do passo 1. Sugestão para o orquestrador:
  uma linha em §6 separando "quem emite pelo cliente" (dele) de "a Forja emite" (nossa capacidade).
- **`ECG` (encargo nomeado) é o segundo candidato a fronteira errada**, por baixo: pode ser só
  configuração de cliente sobre o acréscimo do núcleo. Deixei como módulo porque base de cálculo e
  isenção são comportamento, não valor; se o passo 4 ou 6 mostrar que taxa de serviço cabe em
  configuração, `ECG` deve morrer antes de existir (código aposentado, não reaproveitado).
- **`TRC` (troca)** pode ser capacidade da devolução do núcleo em vez de módulo; deixei módulo pela
  assimetria de `fronteira` §5.1 (escolher o escopo mais estreito).
- **`REL` lê o que outros módulos expõem** — é o ponto onde "módulo não importa módulo" é mais fácil
  de violar na implementação, e onde `performance` e `seguranca` vão ter mais a dizer (agregação
  multi-módulo, dado de pessoa agregado, desempenho individual de operador).
- `CLF` e `ATI` concentram dado sensível (dado de pessoa; conteúdo de conversa). O catálogo só declara
  o que tocam; retenção e minimização ficam para as specs dos passos 7/8 — se aquelas specs não
  fixarem prazo de retenção, isso vira dívida silenciosa.
- O arquivo está a **1 linha** do teto de 400. Qualquer módulo novo exige a quebra descrita em
  DECISÕES, não mais compressão.
PERGUNTAS:
  - para humano: emissão própria inclui a **apuração e as obrigações acessórias** do cliente, ou a
    Forja assume só tributação + emissão + transmissão do documento, deixando apuração/acessórias com
    o contador dele? A resposta muda o tamanho de `FIS` e é entrada direta do passo 3a.
  - para humano: guardar **credencial de assinatura do cliente** (consequência inevitável de emitir
    por ele) é aceito como requisito de produto, com o custo de custódia que vem junto — ou existe
    cenário em que o cliente mantém a credencial fora da Forja e nós só montamos o documento?
VERIFICAÇÃO:
- Contei linhas por busca de início de linha: `catalogo-de-modulos.md` = **399**, `glossario.md` =
  **290**. Ambos abaixo de 400.
- Busquei `mesa|comanda|cozinha|garçom|bomba|delivery|frota` no catálogo: 4 ocorrências, todas
  legítimas — `MSA` e `BMB` (entradas marcadas "ligado por vertical"), `PRZ` (citando "parece de ramo
  e não é") e a receita `PST`. **Zero** em entrada de núcleo ou de módulo cross-vertical; "cozinha"
  não aparece nenhuma vez.
- Busquei `alíquota|CST|CSOSN|NFe|SAT|IBS|CBS|IVA|Postgres|schema|framework`: zero ocorrência. As
  únicas ocorrências de "tabela/rota" estão na cláusula que declara o que o arquivo **não** faz.
- Conferi que todo código citado no catálogo existe na tabela de `glossario.md` §4.3 (os 9 do passo 1
  mais os 25 que acrescentei) e que nenhum colide com os bloqueados (`PDV POS NFE NF SAT TEF`).
- Não escrevi fora de `docs/produto/**`. Não editei nenhuma outra seção do passo 1 nem outra seção
  desta ficha. Não rodei teste: não há código nesta fase.
MEMÓRIA SUGERIDA:
  - type=decision escopo=plataforma slug=decision-emissao-fiscal-propria — a Forja monta, assina e
    transmite o documento fiscal (não é consumidor de provedor nem middleware de terceiro); daí
    decorrem custódia de credencial do cliente, fila de transmissão/contingência como parte do
    produto, e acompanhar vigência de regra como obrigação nossa · camada:produto
  - type=decision escopo=plataforma slug=decision-catalogo-de-modulos-em-camadas — o catálogo
    (`docs/produto/catalogo-de-modulos.md`) é a lista fechada de módulos, organizada por camada de
    dependência; "exige" é contrato/evento verificado **na ativação**, e entrada sem comportamento
    com o módulo desligado é inválida · camada:produto
  - type=convention escopo=plataforma slug=convention-escopo-cliente-sem-instancia — enquanto o foco
    for a vertical restaurante como classe, `cliente` é categoria sem instância: nada em
    `docs/produto/clientes/` até existir nome real, e diferença de cliente é valor de configuração
    sobre um módulo que ele já tem · camada:produto
  - type=gotcha escopo=modulo:cumprimento slug=gotcha-fronteira-de-cumprimento-de-pedido — `CMP`
    nasceu de partir "ciclo de cumprimento" em `CMP`/`COZ`/`ENT`; é a fronteira mais frágil do
    catálogo porque pode ser casca do núcleo ou de `COZ`, e já é dependência dura de `ENT` e `PCF` —
    validar com uma operação que só entrega no ato antes de virar código · camada:produto
PRÓXIMO PASSO SUGERIDO: passos 3a e 4 em paralelo (fiscal e vertical restaurante), com o brief do 3a
carregando as duas `PERGUNTAS` acima como entrada, não como pendência.

## produto (passo 4) — 2026-08-22

## RELATÓRIO — produto — T-0001 (passo 4)
STATUS: OK
FEITO:
- Escrevi `docs/produto/verticais/restaurante.md` (400 linhas, exatamente no teto) com as 6 seções do
  brief mais uma §7 de lacunas: exigências do ramo (9 itens, cada um com a frase de sujeito trocado),
  fluxo por modo de atendimento (salão, balcão, retirada, entrega), jargão mapeado, hardware/rede como
  requisito, módulos ligados em três camadas (receita base / conforme formato / "parecia do ramo"), e
  **11 regras `RN-RES-001` a `RN-RES-011`** com enunciado, motivo, aceite e caminho infeliz.
- **Redefini o recorte da vertical** com base na fonte: o regime específico alcança bar, restaurante,
  lanchonete, **padaria**, cafeteria, sorveteria e similares no que é **preparado e manipulado no
  próprio local**. O eixo do ramo é "preparar e servir no local", não "ter mesa" — e nada disso sobe
  ao núcleo, porque posto e loja de roupa continuam fora.
- Incorporei o achado de pesquisa como **requisito do ramo, não detalhe fiscal**: classificação do
  item no cadastro (`RN-RES-001`) + segregação linha por linha decidida no backend (`RN-RES-002`),
  porque sem segregação o valor total da operação cai no regime geral e a redução de 40% se perde.
  Encargo/gorjeta e valor não repassado por plataforma em linha própria (`RN-RES-003`).
- Separei, no encargo, o que é do ramo (**o tratamento**: linha própria segregada) do que é de cliente
  (**se cobra e quanto**), com o teste da troca de sujeito citado na própria linha.
- Tratei os dois regimes tributários como entrada (`RN-RES-011`), o Ceará como **caso base declarado**
  (contingência: MFE vedado desde 2026-01-01, sobra a NFC-e off-line) e a contingência como operação
  normal de pico, não exceção (`RN-RES-010`).
- Respondi, do lado do ramo, o teste que o passo 2 pediu para `CMP`: num restaurante **só de salão**,
  `MSA` + `COZ` cobrem o acompanhamento e `CMP` desligado não deixa nada faltando.
- Não criei nada em `docs/produto/clientes/`. Não editei nenhum arquivo dos passos 1 e 2.
ARQUIVOS:
- `docs/produto/verticais/restaurante.md` (novo, 400 linhas)
- `docs/produto/glossario.md`, `fronteira-do-nucleo.md`, `catalogo-de-modulos.md`,
  `postura-nova-geracao.md` (só leitura)
- `docs/arquitetura/fiscal/2026-08-22-dossie-iva-ibs-cbs-2.md` (§6, §7, LACUNAS — só leitura)
- `docs/arquitetura/fiscal/2026-08-22-dossie-emissao-propria.md` (§1, §5, §7, LACUNAS — só leitura)
- `memory/plataforma/INDEX.md`, `memory/verticais/INDEX.md` (só leitura)
NÃO FEITO: —
DECISÕES:
- **A vertical é "alimentação preparada no local", não "restaurante com mesa".** Vem da fonte, não de
  gosto. Consequência: a padaria — que é um dos três negócios do teste da fronteira — entra nesta
  vertical pelo que ela **prepara**, e continua fora dela no resto. Trade-off: o nome `RES` fica mais
  estreito que o escopo; não renomeei nada (código é imutável) e não toquei no registro de códigos.
- **O operador do caixa não altera classificação de regime** (`RN-RES-002`). Isso responde, do lado de
  produto, a pergunta 5 do dossiê IVA ("quanto o operador pode influenciar a segregação"): nada, no
  fluxo de venda; mudar classificação é cadastro com papel autorizado e trilha. Trade-off: item novo
  cadastrado no meio do serviço exige papel autorizado — atrito deliberado, porque o erro é financeiro
  e diferido, e quem tem 30 segundos de fila não deveria decidi-lo.
- **Item sem classificação é recusado no cadastro, nunca no caixa.** Bloquear a venda violaria
  `fronteira` §3.4 e `PN-01`; deixar passar silenciosamente é a perda de redução. Fica o meio: recusa
  barata no cadastro, e no caixa a linha vai marcada como regime não determinado, com trilha e efeito
  financeiro **declarado**.
- **Segregar exige classificação, não ficha técnica.** Se eu tivesse amarrado a segregação a `FTC`,
  todo cliente do ramo teria de cadastrar insumo antes de emitir. `FTC` fica opcional.
- **`MSA` desligado é o teste de plugabilidade da vertical** (`RN-RES-008`): o restaurante só de balcão
  é cliente legítimo do ramo. Isso mantém `MSA` como módulo e impede que "restaurante" signifique
  "tem mesa" no produto.
- **O modo de atendimento é declarado no pedido, não inferido do canal** (`RN-RES-009`, provisória),
  porque o documento aplicável depende dele. Preferi uma regra provisória e marcada a não ter regra.
- **`RN-RES-004` fixa o fato gerador no fechamento do consumo**, não no lançamento — e o motivo é
  operacional antes de fiscal: emitir por lançamento criaria N documentos imutáveis sobre intenção
  mutável, cada um com sua própria janela de cancelamento de 30 minutos.
- Usei **um percentual** de norma (redução de 40%) e um de base de cálculo (teto de 15% da gorjeta),
  ambos com link inline e com a ressalva "MUDA? provável" da própria fonte. Nenhuma **alíquota**,
  nenhum código de classificação, nenhuma data de calendário legal afirmada por mim.
RISCOS:
- **Divergência declarada com a receita `RES` do catálogo (§5):** o catálogo lista `CMP` em "Liga"; eu
  concluo que `CMP` só é necessário nos formatos que **não** se encerram no ato (retirada, entrega,
  balcão com espera), e que no salão puro `MSA` + `COZ` bastam. **Não editei o catálogo** — está
  registrado dentro da tabela §5.2 do meu arquivo como refino declarado. Se o orquestrador concordar, é
  uma linha na entrada `RES` do catálogo; se não, é uma linha no meu §5.2. Um dos dois tem de mudar.
- **Faltas no `glossario.md` §3.1 que eu não preenchi** (território de outra passada; estão marcadas
  `sem termo` na §3 do meu arquivo): (a) **ponto de produção** — o catálogo já usa "roteamento por ponto
  de produção" e o termo não existe no glossário; (b) **gorjeta**, distinta de taxa de serviço — é a
  palavra que a norma usa para a exclusão da base, e sem o termo a regra fica sem vocabulário;
  (c) **papel de quem opera a produção** (existe `attendant` para o salão, nada para a produção);
  (d) **valor não repassado por intermediação de plataforma**; (e) **modo de atendimento** — eu o uso
  como eixo estruturante da §2 e ele não é termo definido em nenhum lugar, apesar de determinar
  documento fiscal. (e) é o mais consequente: vira atributo do pedido na Fase 1.
- **`ECG` sobrevive ao meu passo, mas por pouco.** O passo 2 apontou `ECG` como candidato a fronteira
  errada; o achado fiscal o **salva**: taxa de serviço/gorjeta precisa de linha própria segregada com
  base de cálculo e regra de isenção, o que é comportamento, não valor. Se `LACUNA-RES-004` voltar
  dizendo que taxa compulsória não é "gorjeta" para a exclusão, esse argumento perde força e `ECG`
  volta a ser candidato a configuração.
- **Oito lacunas fiscais abertas** e duas regras dependem delas. A mais caro de errar é
  `LACUNA-RES-001` (se **uma** linha sem classificação contamina o documento inteiro ou só a linha):
  muda a severidade de `RN-RES-001` de "avisa" para "impede".
- **`LACUNA-RES-008` (NFS-e/ISS) é a que mais afeta o tamanho de `FIS`.** O humano decidiu que a
  emissão própria inclui documento de serviço; eu **não achei fonte** que diga em que situação o
  restaurante passa a ter essa obrigação. O que tenho é o contrário: fornecimento de alimentação em
  bar/restaurante é circulação de mercadoria por lei complementar. Construir NFS-e para esta vertical
  sem essa resposta é construir para um caso que talvez não exista aqui — e deixar de construir é
  arriscar o cliente que faz evento e buffê.
- O arquivo está **exatamente em 400 linhas**. Não cabe mais nada: qualquer acréscimo exige quebrar em
  dois (a divisão natural é §1–§3 "o ramo" e §4–§7 "requisitos e regras"), não comprimir mais — já
  cortei prosa duas vezes e a próxima passada come conteúdo.
- Não validei nenhuma afirmação fiscal contra fonte primária **por mim**: tudo vem dos dois dossiês de
  2026-08-22, que são datados e expiram por nota técnica e por ato conjunto. Qualquer regra minha que
  cite norma herda essa data de validade.
PERGUNTAS:
  - para humano: **em que situação um restaurante que atendemos gera obrigação de documento de
    serviço (NFS-e/ISS)?** Taxa de serviço cobrada na conta, evento/buffê fora do estabelecimento,
    contrato de refeição com pessoa jurídica — algum desses, na prática dos clientes-alvo, já exigiu
    documento de serviço do contador dele? Sem isso, `LACUNA-RES-008` fica aberta e eu não escrevo
    regra de NFS-e para esta vertical.
  - para humano: **os clientes-alvo cobram taxa de serviço compulsória na conta?** Se sim, precisamos
    fechar `LACUNA-RES-004` com o contador antes de `FIS`: da resposta depende existir ou não valor a
    excluir da base — e, por consequência, se `ECG` é módulo ou configuração.
  - para humano: os números de hardware e rede da §4 (terminais por estabelecimento, servidor local ou
    nuvem direta, tecnologia e redundância do link, energia ininterrupta, tipo de certificado A1/A3/
    nuvem, tela ou impressora na produção, dispositivo do atendente é dele ou do estabelecimento). Não
    inventei nenhum; sem eles, `performance` não tem orçamento e o comportamento offline fica genérico.
VERIFICAÇÃO:
- Contei as linhas por busca de início de linha: **400** — no teto, não acima.
- Busquei `Postgres|schema|migration|endpoint|rota |coluna|DDL|framework|SQL|componente|bloco SDUI`
  (case-insensitive): 2 ocorrências, ambas inócuas — "Coluna" referindo-se a uma coluna da tabela do
  próprio documento, e "rota" dentro de "Frota". Nenhuma decisão de D-01..D-04 tocada.
- Conferi que os 11 `RN-RES-nnn` são sequenciais de 001 a 011, sem buraco e sem repetição, e que as 8
  `LACUNA-RES-nnn` também. Toda `RN` tem os quatro campos; nenhuma entrou sem critério de aceite.
- Conferi que **toda** afirmação fiscal do arquivo tem link inline: os links apontam para
  `cgibs.gov.br` (Res. CGIBS 6/2026), `in.gov.br` (Decreto 12.955/2026), `confaz.fazenda.gov.br`
  (MOC 7.0 Anexo I e Anexo IV, Visão Geral, Ajuste SINIEF 19/16), `sefazlegis.sefaz.ce.gov.br`
  (Decreto CE 36.417/2025) e `planalto.gov.br` (LC 87/1996) — todos vindos dos blocos de fonte dos
  dossiês, com o path do dossiê citado no texto. **Não abri nenhuma URL** e não verifiquei nenhuma
  fonte primária: confiei nos dossiês de 2026-08-22, que declaram acesso naquela data.
- Conferi que todo código de módulo citado (`MSA COZ FIS PER CMP PCF PUB ENT INT ECG EST FTC RSV ATI
  PGO PRZ COM FID CLF`) já existe em `glossario.md` §4.3. **Nenhum código novo** foi criado ou pedido.
- Não escrevi fora de `docs/produto/verticais/restaurante.md` e desta seção da ficha. Não rodei teste:
  não há código nesta fase. Nenhum número operacional (tempo, banda, contagem de equipamento) foi
  afirmado — os únicos números do arquivo são percentuais de norma com link e o nível de serviço de
  30 s/85%, que é texto de fonte, não medição minha.
MEMÓRIA SUGERIDA:
  - type=business-rule escopo=vertical:restaurante slug=rule-segregacao-de-regime-e-do-ramo — no ramo
    de alimentação preparada no local, classificar o item (preparado no local × revendido ×
    industrializado × bebida alcoólica) e segregar linha por linha no documento é exigência do **ramo**,
    não detalhe fiscal: sem segregação o valor total da operação cai no regime geral e a redução de 40%
    se perde; a classificação é recusada no cadastro, nunca no caixa · camada:produto
  - type=decision escopo=vertical:restaurante slug=decision-vertical-e-preparo-no-local — o eixo da
    vertical `RES` é "preparar e servir no local" (a fonte do regime específico inclui padaria,
    cafeteria, sorveteria), não "ter mesa"; `MSA` desligado é cliente legítimo do ramo e é o teste de
    plugabilidade da vertical · camada:produto
  - type=business-rule escopo=vertical:restaurante slug=rule-fato-gerador-no-fechamento-do-consumo — no
    salão o fato gerador é o **fechamento** do consumo em aberto, não o lançamento; consumo em aberto
    atravessa fechamento de sessão de caixa e virada de dia sem ser fechado pelo sistema, e a venda
    pertence ao dia/turno da conclusão · camada:produto
  - type=business-rule escopo=vertical:restaurante slug=rule-encargo-tratamento-do-ramo-valor-do-cliente
    — o **tratamento** da taxa de serviço/gorjeta é do ramo (linha própria segregada, senão a base é o
    valor total); **se cobra e quanto** é de cliente. Vale igual para o valor não repassado por
    plataforma de intermediação · camada:produto
  - type=gotcha escopo=vertical:restaurante slug=gotcha-contingencia-e-rotina-de-pico — no ramo a
    contingência é operação normal do pico, não exceção: a autorização não é instantânea, a contingência
    off-line **imprime mais** (Detalhe da Venda + segunda via) e no Ceará não há mais alternativa em
    hardware fiscal desde 2026-01-01 — o caminho é o do próprio produto · camada:produto
  - type=reference escopo=vertical:restaurante slug=reference-lacunas-fiscais-do-ramo — as 8
    `LACUNA-RES-nnn` de `docs/produto/verticais/restaurante.md` §7 são as perguntas fiscais abertas do
    ramo em 2026-08-22; `RN-RES-009` é provisória por causa de duas delas, e `LACUNA-RES-008`
    (NFS-e/ISS) é a que mais muda o tamanho de `FIS` · camada:produto
PRÓXIMO PASSO SUGERIDO: passo 6 (`modulos/mesa-comanda.md` e `modulos/cozinha.md`), levando como
entrada dura: `RN-RES-004` a `RN-RES-007` (fato gerador no fechamento, consumo que atravessa a virada
de dia, divisão que fecha item por item, produção que não espera venda), a falta de termo para "ponto
de produção" e para o papel de quem opera a produção, e o refino de `CMP` da §5.2. Antes disso, se o
humano estiver disponível: rotear `LACUNA-RES-004` e `LACUNA-RES-008` para ele, porque as duas mudam
escopo de módulo (`ECG`) e tamanho de `FIS`.

## produto (passo 6) — 2026-08-22

## RELATÓRIO — produto — T-0001 (passo 6)
STATUS: OK
FEITO:
- Escrevi `docs/produto/modulos/mesa-comanda.md` (339 linhas): propósito e fronteira, 10 entidades
  conceituais, 12 casos de uso, **14 regras `RN-MSA-001` a `RN-MSA-014`** com enunciado/motivo/aceite/
  infeliz, contrato (expõe · exige do núcleo · exige do cliente · ativação · desligado · sensível),
  fronteira com `COZ`/`CMP`/`PCF`/`ECG`/`FIS` e 3 lacunas.
- Escrevi `docs/produto/modulos/cozinha.md` (344 linhas): mesma estrutura, **12 regras `RN-COZ-001` a
  `RN-COZ-012`**, mais uma **§5 dedicada à queda do ponto de produção no meio do serviço** e 2 lacunas.
- `COZ` ficou **agnóstico de ramo por dentro**: fala de *ponto de produção* e *trabalho a produzir*;
  "cozinha/chapa/bar/confeitaria" aparecem só como nomes que o cliente dá aos pontos dele, com o
  mapeamento do jargão remetido a `verticais/restaurante.md` §3. Nenhum enunciado, aceite ou caminho
  infeliz pressupõe alimentação — padaria e cafeteria ligam o mesmo módulo.
- Cobri o que o plano exigiu de `MSA`: transferência (`005`), junção/separação (`006`), divisão
  (`007`), travessia de sessão/turno/virada de dia com troca de responsável (`009`), encerramento de
  consumo esquecido (`010`) e operação com o link caído (`011`).
- Nenhum cálculo de dinheiro entrou: `RN-MSA-007` declara que `MSA` entrega a **repartição** e o núcleo
  calcula; `RN-COZ-010` declara que `COZ` não toca valor nem disponibilidade.
- Zero UI: nenhuma tela, layout, componente ou bloco. `PN-06` não precisou ser citado — não desenhei
  posição de nada.
ARQUIVOS:
- `docs/produto/modulos/mesa-comanda.md` (novo, 339 linhas)
- `docs/produto/modulos/cozinha.md` (novo, 344 linhas)
- `docs/produto/verticais/restaurante.md`, `glossario.md`, `catalogo-de-modulos.md`,
  `fronteira-do-nucleo.md`, `postura-nova-geracao.md`, `modulos/fiscal.md` (§3.1 e §4.1 — só leitura)
- `memory/plataforma/INDEX.md` (só leitura)
NÃO FEITO: —
DECISÕES:
- **`MSA` continua um módulo só, e agora com o critério escrito.** Mesa e comanda têm mecânica
  idêntica: consumo em aberto ligado a um **alvo**; o que muda é o tipo do alvo (lugar, ficha, nome), e
  isso é configuração (`RN-MSA-013`). Trade-off aceito: o bar que só usa ficha carrega o conceito de
  lugar desligado. Não pedi código novo.
- **`RN-MSA-003` — o alvo é endereço, não identidade.** É a regra que eu não tinha no brief e considero
  a mais barata de acertar agora: mesa 12 tem oito consumos por dia e a ficha 30 volta ao maço depois
  de paga. Modelar o alvo como identidade do consumo mistura consumo de clientes-finais diferentes — é
  cobrança de quem não consumiu, e sai só com migration.
- **Exclusividade de fechamento (`RN-MSA-008`) declarada como regra, e o modo de garanti-la offline
  entregue ao `backend`** (`RN-MSA-011`, caminho infeliz). Separei operações **aditivas** (lançamento,
  que converge sem conflito) das **não aditivas** (transferência, junção, retirada, fechamento, que
  são recusadas quando o dispositivo não tem estado confirmado). Alternativa recusada: resolver por
  "última escrita ganha" ou por relógio — em consumo em aberto isso é item perdido ou cobrança dupla.
- **Reapresentação de trabalho é best-effort marcada, não idempotência de fato** (`COZ` §5): se a via
  saiu e a confirmação se perdeu, o produto reapresenta e marca como reapresentação. Trade-off
  declarado no arquivo: via duplicada e marcada é barata; trabalho nunca apresentado é cliente-final
  esperando. Isso **não** afrouxa `PN-02`, que protege o fato (um trabalho, um item, uma venda).
- **Etapa não avança por tempo** (`RN-COZ-004`) e **fila não esconde trabalho** (`RN-COZ-006`). As duas
  fecham a porta para "melhorar a percepção" ocultando ou envelhecendo trabalho, que é o vício comum
  de tela de produção.
- **`RN-COZ-005` recusa, em vez de configurar, o bloqueio de cobrança até tudo estar entregue.** Um
  cliente pode pedir isso; contraria `PN-01`, então é recusa citando o número, não opção.
- **Não cunhei identificador em inglês** para "ponto de produção", "trabalho a produzir" e para o papel
  de quem produz. Cunhar fora do glossário furaria a autoridade única; usei os termos em pt-BR e
  declarei a falta no próprio arquivo (`cozinha.md` §1) e em RISCOS.
- **`COZ` transporta "instrução de preparo" sem criá-la.** Nenhuma spec define de quem é esse conceito
  (atributo do item de pedido no núcleo? capacidade de módulo?). Preferi declarar a lacuna a decidir
  fora do meu escopo — está em `cozinha.md` §7.
RISCOS:
- **Divergência de vocabulário no `glossario.md` §3.1, e ela é de fronteira, não de estilo:**
  `preparation_order`, `preparation_stage`, `production_display` e `production_ticket` estão
  registrados como termos de **ramo restaurante**, mas `COZ` é **cross-vertical** (assim classificado
  pelo catálogo). Ou esses quatro termos sobem para léxico de módulo, ou o catálogo está errado sobre
  `COZ`. **Não editei o glossário.** Faltam ainda **ponto de produção** e o **papel de quem produz** —
  os dois já apontados pelo passo 4 e ainda abertos; eu acrescento um terceiro: **trabalho a
  produzir**, a unidade central de `COZ`, que hoje não tem nome no glossário.
- **`ECG` (encargo nomeado) não ganhou nada de mim que o salve nem que o mate.** `MSA` só declara que
  encargo entra em linha própria (`RN-RES-003`) e que quem calcula não é ele. A decisão módulo ×
  configuração continua dependendo de `LACUNA-RES-004`.
- **`CMP` continua o recorte frágil**, e agora com uma fronteira nova para vigiar: `RN-COZ-009` faz o
  trabalho carregar a **referência de destino** (lugar, ficha, senha, entrega). Se `CMP` existir só
  para produzir senha e estado, `COZ` + núcleo já entregam quase tudo o que ele faria no salão — o que
  reforça o alerta do passo 2, não o resolve.
- **`RN-COZ-012` depende de D-03** (identidade). Declarei o requisito de negócio (papel verificado no
  backend; responsável identificado por sessão do ponto quando o dispositivo é compartilhado, com a
  granularidade declarada como dívida) sem escolher estratégia — não houve `BLOQUEIO`, mas D-03 herda
  este requisito, somado aos de `PN-11`/`PN-16` que o passo 1 já apontou.
- **Dado de saúde entrou no escopo do produto por uma porta lateral:** instrução de preparo com
  alergia/restrição alimentar (`cozinha.md` §6, `LACUNA-COZ-2`). É o dado mais sensível que `COZ` toca
  e ele viaja para uma **via impressa em ambiente aberto**. Declarei minimização (só o necessário ao
  preparo, sem histórico, sem cruzamento) e que a via não leva dado de pessoa, endereço, contato nem
  valor — mas retenção e tratamento precisam do gate de `seguranca` quando houver artefato técnico.
- **Retenção não decidida:** nome de exibição de ficha nominal (`RN-MSA-014`). Sem decisão do humano, a
  retenção nasce por omissão.
- Nenhuma auditoria de `performance` foi pedida e eu não a peço — mas registro o que ela vai olhar
  primeiro quando houver consulta: `RN-COZ-006` (fila que nunca esconde trabalho, com acúmulo de
  centenas de itens por ponto no pico) e a lista de consumos abertos por estabelecimento
  (`mesa-comanda.md` §5).
PERGUNTAS:
  - para humano: **por quanto tempo o nome de exibição de uma ficha nominal fica retido** depois do
    encerramento do consumo (`RN-MSA-014`)? Opções: só durante o serviço (descartado no
    encerramento) · retido junto com a venda, como o núcleo já retém identificação opcional do
    cliente-final · retido por período declarado. Não presumi nenhuma.
  - para humano: os pontos de produção dos clientes-alvo têm **tela, impressora ou os dois** (o passo 4
    já perguntou)? A resposta decide se `PER` é condição prática de `COZ` neste ramo e qual caminho de
    apresentação é o principal — e ela muda o que se perde na queda (`cozinha.md` §5).
  - para `produto` (outra passada, não este passo): de quem é o conceito **instrução de preparo** — é
    atributo do item de pedido no núcleo (os três negócios do teste pedem "sem cebola"? a padaria pede
    "fatiado"?) ou é capacidade de módulo? Hoje `COZ` transporta sem criar.
VERIFICAÇÃO:
- Contei as linhas por busca de início de linha: `mesa-comanda.md` = **339**, `cozinha.md` = **344**.
  Os dois abaixo do teto de 400, e cada entregável em seu arquivo.
- Conferi numeração: `RN-MSA-001`..`014` e `RN-COZ-001`..`012`, sequenciais, sem buraco e sem
  repetição. **Toda** regra tem os quatro campos (enunciado, motivo, aceite, infeliz) — nenhuma entrou
  sem critério de aceite. Nenhuma é PROVISÓRIA, porque nenhuma depende de lacuna para existir.
- Conferi as referências cruzadas entre os dois arquivos: `RN-MSA-012` cita `RN-COZ-005`/`RN-COZ-007`,
  `RN-MSA-004` cita `RN-COZ-007`, `RN-COZ-005` cita `RN-MSA-012`, `RN-COZ-007`/`RN-COZ-010` citam
  `RN-MSA-004`. Todas existem nos dois lados.
- Conferi que todo `RN-RES-nnn` e `PN-nn` citado existe: `RN-RES-003..008`, `RN-RES-010`,
  `LACUNA-RES-007`; `PN-01`, `PN-02`, `PN-03`, `PN-04`, `PN-07`, `PN-09`, `PN-11`, `PN-13`, `PN-15`,
  `PN-16`, `PN-17`, `PN-18`, `PN-20`. Todos os códigos de módulo citados (`MSA COZ CMP PCF ENT INT PER
  EST FTC RSV CLF COM ECG FIS EMI`) existem em `glossario.md` §4.3 ou em `modulos/fiscal.md` — **nenhum
  código novo** foi criado ou pedido.
- Busquei `Postgres|schema|migration|endpoint|framework|SQL|componente|coluna|DDL|stack|alíquota|CST|
  CSOSN|NFC-e|NFS-e|IBS|CBS|IVA` (case-insensitive) nos dois arquivos: as únicas ocorrências reais
  estão na cláusula de abertura que declara o que o arquivo **não** faz ("não define tabela, coluna,
  rota, contrato técnico, tela, componente ou bloco"). O resto foi falso positivo de substring
  ("transformar", "informada", "forma", "viva"). Nenhuma decisão D-01..D-04 tocada.
- Busquei `cozinha|chapa|garçom|mesa|comanda|prato|comida|alimenta` em `cozinha.md`: sobraram 4
  ocorrências, todas deliberadas — o título (nome que o humano usa), a cláusula que declara o jargão
  como nome de ponto dado pelo cliente, a linha que diz que nada ali pressupõe alimentação, e
  `LACUNA-COZ-2` (restrição alimentar). Reescrevi três motivos que usavam exemplo de comida para
  linguagem agnóstica.
- Busquei `conta` isolado (proibição de `glossario.md` §5): as ocorrências restantes são o termo
  definido "divisão de conta", "por conta própria" e a citação do jargão entre aspas. Corrigi duas.
- **Nenhuma afirmação fiscal minha:** não há link, número, percentual, sigla de documento nem data de
  calendário legal nos dois arquivos. Tudo o que toca obrigação está remetido a `RN-RES-004`,
  `RN-RES-003`, `RN-RES-006`, `LACUNA-RES-007` ou marcado como `LACUNA-MSA-n`/`LACUNA-COZ-n`.
- Não editei nada dos passos 1, 2, 3a e 4, nem outra seção desta ficha. Reli o final da ficha
  imediatamente antes de escrever esta seção (o passo 3a ainda não havia acrescentado a dele). Não
  rodei teste: não há código nesta fase.
- **Plugabilidade um sem o outro — testada regra por regra, não afirmada:** `MSA` sem `COZ` roda o
  ciclo inteiro (`RN-MSA-012`, aceite); `COZ` sem `MSA` roda com referência de destino de venda/senha
  (`RN-COZ-009`, aceite). Nenhuma regra de um lê o interior do outro. Resposta detalhada no relatório
  ao orquestrador.
MEMÓRIA SUGERIDA:
  - type=business-rule escopo=modulo:mesa-comanda slug=rule-alvo-de-consumo-e-endereco-nao-identidade —
    lugar e ficha são reutilizados muitas vezes por dia; a identidade do consumo em aberto é própria e
    independente do alvo, e nenhum lançamento ou histórico é atribuído ao alvo — confundir os dois
    mistura consumo de clientes-finais diferentes (`RN-MSA-003`) · camada:produto
  - type=decision escopo=modulo:mesa-comanda slug=decision-mesa-e-comanda-um-modulo-so — mesa e comanda
    são o mesmo módulo (`MSA`) porque a mecânica é consumo em aberto ligado a um **alvo**; o tipo do
    alvo (lugar, ficha, nome) é configuração, e separar depois exigiria código novo · camada:produto
  - type=business-rule escopo=modulo:mesa-comanda slug=rule-exclusividade-de-fechamento-do-consumo — um
    consumo produz no máximo uma cobrança concluída, e repetir o fechamento devolve o mesmo resultado;
    lançamento é aditivo e converge offline, mas transferência, junção, retirada e fechamento são
    recusados quando o dispositivo não tem estado confirmado — nunca "última escrita ganha"
    (`RN-MSA-008`, `RN-MSA-011`) · camada:produto
  - type=business-rule escopo=modulo:cozinha slug=rule-queda-de-ponto-de-producao-no-pico — queda de
    tela/impressão/rede local até um ponto não bloqueia lançamento nem fechamento: o trabalho existe e
    é reapresentado uma única vez ao voltar; o que **se perde** é avanço de etapa registrado em
    dispositivo que não retém, nunca o trabalho; conflito entre os dois lados é apresentado, não
    resolvido por relógio (`RN-COZ-008` e `cozinha.md` §5) · camada:produto
  - type=decision escopo=modulo:cozinha slug=decision-reapresentacao-marcada-em-vez-de-suprimida — se a
    apresentação saiu e a confirmação se perdeu, o produto reapresenta e marca como reapresentação; via
    duplicada e marcada é mais barata que trabalho nunca apresentado, e isso não afrouxa `PN-02`, que
    protege o fato · camada:produto
  - type=gotcha escopo=modulo:cozinha slug=gotcha-vocabulario-de-producao-preso-ao-ramo — os termos de
    produção (`preparation_order`, `preparation_stage`, `production_display`, `production_ticket`) estão
    em `glossario.md` §3.1 como **ramo restaurante**, mas `COZ` é cross-vertical; faltam ainda "ponto de
    produção", "trabalho a produzir" e o papel de quem produz. Ou os termos sobem para léxico de módulo,
    ou a classificação de `COZ` no catálogo está errada · camada:produto
  - type=business-rule escopo=modulo:cozinha slug=rule-producao-nao-e-condicao-de-nada — "pronto" é
    notificação: não libera cobrança, não fecha consumo, não conclui venda; e `COZ` não altera item,
    valor nem disponibilidade — "acabou" é proposta a quem tem papel, não efeito (`RN-COZ-005`,
    `RN-COZ-010`) · camada:produto
PRÓXIMO PASSO SUGERIDO: passo 7 (`modulos/pedido-cliente-final.md` e `modulos/atendimento-ia.md`),
levando como entrada dura: `RN-MSA-002` (todo consumo nasce com alvo e responsável — o `PCF` precisa
dizer quem é o autor do lançamento feito pelo cliente-final), `RN-MSA-004` (lançamento tem autor, e
retirar item é operação autorizada — vale igual para lançamento externo), `RN-COZ-009` (referência de
destino viaja com o trabalho, e canal que não a informa gera trabalho sem destino) e `RN-COZ-011`
(prazo é configuração do cliente, nunca estimativa nossa — é o que `PCF`/`ATI` vão querer exibir).

## produto (passo 3a) — 2026-08-22

## RELATÓRIO — produto — T-0001 (passo 3a)
STATUS: OK
FEITO:
- **Parti o fiscal em três módulos** e defendi a partição em `modulos/fiscal.md` §1: `FIS`
  **tributação**, `EMI` **emissão**, `APU` **apuração e obrigação acessória** (fora do MVP, sem data).
  Códigos `EMI` e `APU` reservados no `glossario.md` §4.3, com nota de que `FIS` passou a nomear a
  tributação; nada renomeado, nada aposentado.
- Escrevi `modulos/fiscal.md`: fronteira + tabela de "o que muda por motivo diferente" + o que foi
  recusado + o que o passo 9/Fase 1 herdam; spec de `FIS` (propósito, entidades conceituais, casos de
  uso, `RN-FIS-013` a `RN-FIS-020`, contrato expõe/exige/desligado/sensível); fronteira de `EMI`
  (`RN-EMI-001` a `RN-EMI-003` + contrato), remetendo o detalhe ao passo 3b; fronteira e **custo
  declarado** de `APU`; 20 fatos com URL (`F-14` a `F-34`); 10 lacunas; 5 perguntas ao humano.
- Escrevi `fiscal-regimes-e-vigencia.md`: `RN-FIS-001` a `RN-FIS-012` (regra é dado com vigência;
  escopo geográfico; regimes coexistem; o fato congela a regra; nenhum recálculo retroativo;
  retificação é fato novo; migração sem reescrever histórico; vigência no fuso do estabelecimento;
  regra nova entra por publicação de dado; ensaio é leitura; ausência de regra é estado explícito;
  contrato explícito com o núcleo), o caminho de 7 passos de como uma mudança de regime chega ao
  produto, fronteiras vigiadas (split payment, cashback, IS), 13 fatos com URL (`F-01` a `F-13`), 2
  lacunas, 4 perguntas.
- Reescrevi **só a entrada `FIS`** do `catalogo-de-modulos.md` como `FIS · EMI · APU`, mantendo os 7
  campos e o arquivo em 399 linhas (uma linha a menos que antes). As outras 30 entradas intactas.
- **A contradição normativa não foi resolvida por mim:** virou `LACUNA-FIS-001` com as duas URLs
  (F-19 rejeição × F-20 ausência de sanção) e `RN-EMI-001` está escrita para ser correta nos dois
  mundos — a venda existe e a pendência é nomeada em ambos; muda só a gravidade, que é informação,
  não fluxo.
ARQUIVOS:
- `docs/produto/modulos/fiscal.md` (novo, 397 linhas)
- `docs/produto/fiscal-regimes-e-vigencia.md` (novo, 321 linhas)
- `docs/produto/glossario.md` (editado — 2 linhas na tabela de §4.3 + 4 linhas de nota abaixo dela;
  297 linhas; nenhuma outra seção tocada)
- `docs/produto/catalogo-de-modulos.md` (editado — **só** a entrada `FIS`; 399 linhas)
- `docs/produto/fronteira-do-nucleo.md`, `postura-nova-geracao.md`,
  `docs/arquitetura/fiscal/2026-08-22-dossie-iva-ibs-cbs.md` e `…-2.md`,
  `memory/plataforma/INDEX.md` (só leitura)
NÃO FEITO: —
DECISÕES:
- **Três módulos, não um** (a resposta pedida no brief). O critério: *o que muda por motivo
  diferente, em cadência diferente, e pode ser substituído sem os outros*. `FIS` muda quando a norma
  material muda (base, alíquota, regime específico, anexo); `EMI` muda quando a especificação técnica
  do documento ou do autorizador muda; `APU` muda quando o período, a declaração ou o programa de
  conformidade mudam. **A linha decisiva é a substituibilidade:** `EMI` e `APU` podem sair das nossas
  mãos (contador, provedor, PAA) sem o produto parar; `FIS` não pode, porque o total do caixa e a
  segregação por regime são compostos quando o item entra na venda — antes de existir documento, e
  mesmo quando documento nenhum vai existir. Capacidade substituível e insubstituível não são o mesmo
  módulo. Bônus estrutural: com `FIS`/`EMI` separados, `RN-FIS-004` (o fato congela a regra) deixa de
  ser disciplina e passa a ser impossibilidade — `EMI` consome artefato que não produziu.
- **`FIS` fica como tributação** em vez de virar código novo: nenhuma `RN-FIS-nnn` havia sido emitida,
  o código é imutável e reaproveitar/renomear geraria código aposentado. Custo: o nome "Fiscal" na
  tabela do glossário ficou genérico — resolvi com nota, não editando a linha (fora do meu escopo).
- **Fatos e fontes na mesma tabela.** Cada fato do regime brasileiro é uma linha `F-nn` com a URL na
  própria linha, e a tabela é a seção `## Fontes`. Motivo: satisfaz "link inline por afirmação" **e**
  "tabela afirmação→URL→tipo→data" sem duplicar 30 URLs, o que era a diferença entre 517 e 397 linhas
  em `modulos/fiscal.md`. Efeito colateral desejado: fato fora da tabela é detectável por inspeção.
- **`RN-FIS-016` é a única PROVISÓRIA** (gorjeta acima de 15% / taxa de serviço compulsória), e está
  marcada no título com a lacuna. Escrevi o aceite só da parte já testável (condição registrada +
  segregação) e declarei "não agendar para construção — agendar para resolver `LACUNA-FIS-003`".
- **Fallback de segregação segue a norma, mas nunca é silencioso.** F-24 já define o efeito da falta
  de segregação (total vai para o regime geral); usei isso como caminho infeliz de `RN-FIS-015`,
  sempre registrado como fallback. Não escolhi o fallback "econômico" (aplicar a redução na dúvida).
- **Compressão de forma, não de conteúdo:** em `modulos/fiscal.md` o título da `RN` passou a ser o
  enunciado (convenção declarada em §2), com linha `**Enunciado**` só onde o título não basta. Foi o
  que caberia no teto de 400 sem cortar link. `fiscal-regimes-e-vigencia.md` manteve `**Enunciado**`
  em todas — inconsistência de forma entre os dois arquivos, assumida.
- **`§5` do módulo virou ponteiro** para `fiscal-regimes-e-vigencia.md` §5 (split payment, cashback,
  IS, regime do ramo). Motivo: teto de linhas; e o conteúdo é sobre mudança de regime futura, que é o
  assunto do outro arquivo. Os fatos e as lacunas continuam no arquivo do módulo.
RISCOS:
- **As receitas de vertical do catálogo (`RES`, `PST`, `VAR`) ligam `FIS` e agora precisam ligar
  `EMI` também.** Não editei — está fora do meu escopo (só a entrada `FIS`). É uma linha em cada uma
  das três, e enquanto não for feito o catálogo diz que um restaurante emite documento sem ter o
  módulo de emissão. **Despachar antes de fechar a ficha.**
- `docs/produto/verticais/restaurante.md` (passo 4, paralelo a mim) já afirma fato fiscal sobre tipo
  de certificado citando um "dossiê emissão própria §2.2" que eu não li. Não conflita com a minha
  fronteira (é exatamente o "onde se assina" de `RN-EMI-003`), mas os dois arquivos agora citam
  dossiês fiscais diferentes — o passo 3b deveria conferir se `LACUNA-FIS-009`/`010` já estão
  respondidas lá antes de reabri-las.
- **`fronteira-do-nucleo.md` §6 continua ambíguo** (risco já levantado no passo 2): ele trata "quem
  emite pelo cliente" como decisão de cliente sem distinguir da capacidade que nós construímos.
  Minha `RN-EMI-003` resolve isso *na spec do módulo*, mas o arquivo do passo 1 segue como está.
- **O catálogo está em 399 linhas e o `modulos/fiscal.md` em 397.** Nenhum dos dois aceita mais uma
  frase. A linha de `EMI` nas receitas de vertical (risco 1) provavelmente exige a quebra do catálogo
  que o passo 2 já desenhou. `modulos/fiscal.md`, se crescer, quebra em `modulos/emissao.md`.
- **`LACUNA-FIS-002` é a que mais assusta silenciosamente**: se o tributo for acrescido ao preço no
  fechamento (em vez de extraído dele), publicar uma alíquota passa a mudar o **total que o
  cliente-final paga**, e aí `RN-FIS-013` deixa de ser assunto de documento e entra no caminho
  crítico do caixa — com efeito em `performance` e em toda a tela de venda. Ninguém confirmou.
- **`APU` fora do MVP tem custo real**, não retórico: em 2026 a dispensa de recolhimento é
  condicionada a cumprir a obrigação acessória (F-10, F-30). Se um cliente-alvo não tiver contador,
  ele perde a dispensa por não ter onde cumprir. Declarei em `modulos/fiscal.md` §4 e perguntei.
- **Nenhum dos 33 fatos foi verificado por mim na fonte primária** — todos vêm dos dossiês de
  2026-08-22, que declaram não ter lido o texto integral da LC 214/2025 nem da EC 132/2023
  (`LACUNA-FIS-012`). Dois fatos centrais (F-19, F-20) são **notícia institucional**, não texto de
  ato, e estão marcados como tal na tabela. Antes de virar código, reconfirmar na fonte.
PERGUNTAS:
  - para humano: **`LACUNA-FIS-001`** — hoje, um documento sem os campos de IBS/CBS é **rejeitado**
    pelo autorizador ou apenas **não sancionado**? As duas afirmações são de notícia do CGIBS e se
    contradizem. A spec funciona nos dois mundos; a gravidade mostrada ao operador, não.
  - para humano: **`LACUNA-FIS-002`** — o valor cobrado do consumidor no PDV já contém IBS/CBS (e o
    tributo é extraído dele), ou o tributo é acrescido ao preço praticado no fechamento?
  - para humano: **`LACUNA-FIS-003`** — gorjeta acima de 15%: entra na base só o excedente ou a
    gorjeta inteira? E taxa de serviço compulsória conta como "gorjeta repassada integralmente ao
    empregado" para esse efeito? (Trava `RN-FIS-016`.)
  - para humano: **quem assume o risco de segregação errada em bar e restaurante** — o operador de
    caixa pode influenciar a classificação item a item, ou é só cadastro? Escrevi para "só cadastro".
  - para humano: **existe contador ou consultoria de referência?** F-30 mostra que "contador
    responsável indicado" é papel que a **norma** exige no sistema — então não é só um fornecedor
    nosso, é um requisito de produto. As outras 7 lacunas também só fecham com ele.
  - para humano: **split payment agora ou vigiado?** (`LACUNA-FIS-005`.) A etapa que atinge venda a
    consumidor final muda o que o estabelecimento **recebe** no cartão, e não tem data.
  - para humano: **documento de serviço** (`LACUNA-FIS-008`) — qual sistema, e o município do
    estabelecimento no Ceará. Bloqueia parte do passo 3b.
VERIFICAÇÃO:
- Contei as linhas por busca de início de linha: `modulos/fiscal.md` = **397**,
  `fiscal-regimes-e-vigencia.md` = **321**, `catalogo-de-modulos.md` = **399** (era 399),
  `glossario.md` = **297** (era 290). Todos abaixo de 400.
- Busquei `pfx|p12|.cer|.jks|senha|password|token|keystore|certificado` (case-insensitive) em
  `docs/produto/`: nos **meus** dois arquivos há **uma** ocorrência, e é a cláusula de proibição
  ("nada neste repositório descreve caminho, arquivo, formato ou senha de credencial"). Nenhum
  caminho, nome de arquivo, formato ou exemplo de credencial entrou.
- Busquei `Postgres|migration|endpoint|framework|ORM|typescript|React` em `modulos/fiscal.md`: zero
  ocorrência real (os matches foram substring de "norma", "informação", "conformidade", "plataforma").
  Nenhuma tabela, coluna, DDL, rota, componente ou stack foi especificada; D-01..D-04 citadas como
  ABERTAS onde relevante.
- Conferi que **toda** afirmação sobre o regime brasileiro está numa linha `F-nn` da tabela `##
  Fontes`, com URL na própria linha: 13 fatos (F-01, F-01b, F-02 a F-13) em
  `fiscal-regimes-e-vigencia.md` e 21 (F-14 a F-34) em `modulos/fiscal.md`. Fatos que o dossiê marcou
  como fonte única de notícia (F-19, F-20), por ausência (F-29) ou sem leitura do texto normativo
  (F-01, F-34) estão marcados assim na coluna "Tipo".
- Conferi que os títulos das seções e as referências internas (`§`, `RN-`, `LACUNA-`) apontam para
  seções existentes depois da renumeração do §5/§6 do arquivo de vigência.
- **Não verifiquei nenhuma URL na fonte** — não abri nenhuma página nem nenhum PDF. Todos os `F-nn`
  são transcrição dos blocos dos dois dossiês, com a data de acesso deles (2026-08-22). Nenhum
  número, data ou alíquota foi escrito sem estar num bloco `FONTE:` do dossiê.
- Não rodei teste: não há código nesta fase.
MEMÓRIA SUGERIDA:
  - type=decision escopo=modulo:fiscal slug=decision-fiscal-partido-em-tres-modulos — o fiscal é
    `FIS` (tributação), `EMI` (emissão) e `APU` (apuração/acessória), não um módulo: mudam por norma
    e cadência diferentes, e `EMI`/`APU` são substituíveis por terceiro enquanto `FIS` não é (o total
    do caixa e a segregação por regime existem antes de qualquer documento); `EMI` e `APU` são camada
    2 e `APU` está fora do MVP sem data · camada:produto
  - type=business-rule escopo=modulo:fiscal slug=rule-regra-fiscal-e-dado-com-vigencia — regra fiscal
    é dado com vigência, norma de origem e escopo geográfico (nacional/UF/município), publicável com
    vigência futura sem release; o fato gerador congela a versão de regra que o produziu e nada
    recalcula o passado; ausência de regra é pendência nomeada, nunca default silencioso · camada:produto
  - type=gotcha escopo=modulo:fiscal slug=gotcha-vigencia-fiscal-vira-no-fuso-do-estabelecimento — a
    virada de ano-calendário troca o regime tributário, então "qual regra vale" se resolve no fuso do
    **estabelecimento**, não do servidor nem do terminal; errar isso corrompe a virada de ano de
    todos os clientes de uma vez (sintoma: venda de 31/12 às 23h58 saindo com a regra do ano
    seguinte) · camada:produto
  - type=reference escopo=modulo:fiscal slug=reference-dossies-iva-ibs-cbs-2026-08-22 — todo fato do
    regime IBS/CBS usado nas specs vem dos dois dossiês datados em
    `docs/arquitetura/fiscal/2026-08-22-dossie-iva-ibs-cbs*.md`, citados como `F-01` a `F-34` nas
    tabelas `## Fontes`; os dossiês expiram e nenhum fato foi conferido na fonte primária ·
    camada:produto
  - type=gotcha escopo=modulo:fiscal slug=gotcha-sancao-versus-rejeicao-de-documento-sem-ibs-cbs —
    duas notícias oficiais do CGIBS se contradizem sobre documento sem os campos de IBS/CBS em 2026
    (não gera sanção × autorizador rejeita); para um PDV é a diferença entre "campo opcional" e "não
    vende", e a spec foi escrita correta nos dois mundos (`RN-EMI-001`) em vez de escolher uma
    leitura — não resolver isso por analogia · camada:produto
PRÓXIMO PASSO SUGERIDO: passo 3b (`EMI` em detalhe: contingência, layout versionado, numeração,
homologação, custódia de credencial), levando como entrada dura: `RN-EMI-002` (a emissão consome o
tributo congelado e **nunca** recalcula), `RN-EMI-001` (falha de emissão é pendência, não bloqueio, e
vale nos dois mundos de `LACUNA-FIS-001`), `RN-EMI-003` (duas capacidades de assinatura, documento
montado idêntico) e as lacunas `008`/`009`/`010`, que são dele. Antes disso, um despacho de uma linha
para acrescentar `EMI` às receitas `RES`/`PST`/`VAR` do catálogo (RISCOS 1).

## produto (passo 7) — 2026-08-22

## RELATÓRIO — produto — T-0001 (passo 7)
STATUS: OK
FEITO:
- Escrevi `docs/produto/modulos/pedido-cliente-final.md` (400 linhas): propósito/fronteira, §2 dedicada
  a **interlocutor e identidade como requisito** (5 requisitos + 5 perguntas que D-03 tem de responder),
  10 entidades, 10 casos de uso, **13 regras `RN-PCF-001` a `RN-PCF-013`** com enunciado/motivo/aceite/
  infeliz, §6 com duas tabelas (de onde vem cada cálculo · o que a automação decide × o que exige
  operador), contrato (expõe · exige do núcleo · exige de outros módulos e ativação · desligado ·
  sensível) e 3 lacunas + 3 pendências com o humano.
- Escrevi `docs/produto/modulos/atendimento-ia.md` (373 linhas): §2 é uma **tabela comparando os dois
  interlocutores** (operador × cliente-final) em identidade, alcance, natureza da entrada, estrago do
  erro e obrigatoriedade de escalada, seguida dos 4 requisitos de identidade e do que D-03 precisa
  responder; 8 entidades, 10 casos de uso, **13 regras `RN-ATI-001` a `RN-ATI-013`**, §6 com a tabela
  fechada de quem decide o quê, contrato e 2 lacunas + 4 pendências.
- Os cinco pontos obrigatórios do brief estão declarados nos **dois** arquivos: identidade como
  requisito (D-03, sem escolher estratégia); automação × humano item por item; o que acontece quando
  não se sabe; prazo de retenção **exigido por regra**; e a declaração de que nenhum cálculo mora
  nesses módulos, com a origem de cada um nomeada (núcleo, `PRM`, `ECG`, `FIS`, `EMI`, `EST`,
  configuração do cliente (tenant)).
- Entradas duras do passo 6 usadas como base, não reinterpretadas: `RN-MSA-002`/`RN-MSA-004` (autor do
  lançamento externo é a sessão), `RN-MSA-003` (alvo é endereço — virou `RN-PCF-003` e `RN-PCF-005`),
  `RN-MSA-008`/`RN-MSA-011` (aditivo × não aditivo — virou `RN-PCF-006`/`RN-PCF-007`/`RN-PCF-009`),
  `RN-COZ-009` (destino declarado) e `RN-COZ-011` (prazo é medição, nunca estimativa nossa).
- Não editei nada dos passos 1, 2, 3a, 4 e 6. Não criei código de módulo novo, não pedi código novo,
  não criei nada em `docs/produto/clientes/`.
ARQUIVOS:
- `docs/produto/modulos/pedido-cliente-final.md` (novo, 400 linhas)
- `docs/produto/modulos/atendimento-ia.md` (novo, 373 linhas)
- `docs/produto/modulos/mesa-comanda.md`, `modulos/cozinha.md`, `verticais/restaurante.md`,
  `catalogo-de-modulos.md`, `glossario.md`, `postura-nova-geracao.md`, `fronteira-do-nucleo.md`
  (headings), `modulos/fiscal.md` (só headings) — **só leitura**
- `memory/plataforma/INDEX.md` (só leitura)
NÃO FEITO: —
DECISÕES:
- **A credencial de sessão externa é do consumo, não do alvo** (`RN-PCF-003`). É a decisão mais
  consequente do passo e ela **cai direto de `RN-MSA-003`**: se o alvo é endereço, uma referência
  durável afixada nele identifica o endereço, e quem lê de fora entra no consumo de quem está lá agora.
  Trade-off aceito e declarado no arquivo: o padrão seguro impede que um anônimo entre num consumo já
  aberto sem ato de operador, o que é menos cômodo que o adesivo fixo na mesa. Deixei o modo fraco
  disponível como **configuração do cliente (tenant) com a consequência escrita nela** (`PN-20`) — e
  mesmo nele, *ver* continua limitado por `RN-PCF-005`: o risco aceito é lançamento indevido
  (corrigível por retirada autorizada), nunca exposição de dado.
- **Visão padrão = só a própria sessão** (`RN-PCF-005`). Recusei o padrão "quem abre a sessão vê o
  consumo inteiro" porque quem escaneia o alvo não é necessariamente do grupo. Custo: o grupo que quer
  conferir junto precisa que o cliente (tenant) ligue a visão ampliada. Preferi o custo de uma
  configuração ao de expor o que estranhos consumiram.
- **`PCF` só faz operação aditiva** (`RN-PCF-007`), e isso não é escolha estética: `RN-MSA-011` já
  recusa operação não aditiva para o **operador** sem estado confirmado. Dar transferência, junção,
  retirada ou fechamento a um anônimo em rede não confiável abriria a porta de furto de `RN-MSA-004`
  para fora do estabelecimento.
- **Aceitação assimétrica por destino** (`RN-PCF-008`): `MSA` aceita automático (é aditivo e equivale
  ao lançamento do atendente; exigir confirmação item a item mataria o canal no pico), `CMP` exige
  operador por padrão (compromete insumo e promessa a quem não está presente). Recusa automática só
  por condição objetiva verificável no servidor; recusa por **juízo** é humana, porque é decisão de
  negar atendimento a uma pessoa.
- **Fechamento por pagamento é acionado pelo fato, nunca pela afirmação do dispositivo**
  (`RN-PCF-009`), e a mesma regra absorveu "nada entra depois do fechamento" — são o mesmo limite.
- **Retenção virou regra com aceite testável sem depender do número:** categoria sem prazo declarado
  **impede a ativação** (`RN-PCF-012`, `RN-ATI-013`). Foi o jeito de honrar o alerta do passo 2 sobre
  `CLF`/`ATI` sem inventar prazo: o produto garante que nenhum dado exista sem prazo; **qual** é o
  prazo é `PERGUNTAS: para humano`. Sem isso, a spec nasceria com a dívida silenciosa que o passo 2
  previu.
- **`ATI` ficou um módulo só, com dois modos declarados na §2** (tabela de risco comparado), em vez de
  partir. Justificativa: o catálogo já separa a **ativação** (com/sem `PCF`), o limite (`PN-16`) é o
  mesmo, e código é imutável — partir agora custaria código novo para uma fronteira que a ativação já
  resolve. Ver RISCOS: se os dois modos precisarem de ciclos de vida diferentes, a discussão volta.
- **A IA não afirma valor nem existência: ela compõe referência resolvida** (`RN-ATI-004`,
  `RN-ATI-005`). É o mecanismo de produto que eu encontrei contra alucinação de catálogo/preço/
  disponibilidade sem escolher nada de técnica: item existe por identificador resolvido pelo servidor;
  referência que não resolve é descartada e a resposta degrada para "não sei"; valor aparece resolvido
  ou não aparece.
- **A IA não certifica saúde e não fala pelo estabelecimento** (`RN-ATI-011`). Única categoria em que
  o erro fere pessoa e não dinheiro, e a fonte de verdade (`FTC`) é **opcional** e pode estar
  incompleta. Mudar esse limite exige decisão registrada do humano, não configuração.
- **"Não sei" é desfecho contável** (`RN-ATI-006`, `RN-ATI-012`), e proposta não confirmada **expira**
  em vez de virar fato por decurso de prazo. É o que dá ao cliente (tenant) base medida para desligar
  a IA sem depender de nós (`PN-20`).
- **Não escolhi modelo, provedor, biblioteca nem arquitetura de instrução**, e declarei no topo de
  `atendimento-ia.md` que construir `ATI` sem essa decisão é `BLOQUEIO` na fase de construção. Não
  emiti `BLOQUEIO` agora porque o entregável era spec de requisito, e ela não depende da escolha.
- **Glossário:** usei "identidade de serviço" e "identidade persistente de cliente-final" em vez de
  "conta", que é palavra proibida (`glossario.md` §5), e declarei a falta de termo no próprio arquivo.
  Não cunhei identificador em inglês para nada — seria furar a autoridade única.
RISCOS:
- **`ATI` são dois produtos com risco muito diferente dentro de um código só.** Não parti (ver
  DECISÕES), mas o alerta fica: se o humano quiser entregar o modo operador e **não** o modo
  cliente-final, isso hoje é ativação (`PCF` presente ou não) e funciona; se algum dia os dois modos
  precisarem de regras que se contradigam, a sequência `RN-ATI-nnn` terá de ser dividida por escopo e
  o modo externo vira **código novo** (código é imutável, não se renumera). Enquanto isso, a §2 é o
  contrato que impede o modo externo de herdar por acidente o alcance do interno.
- **`RN-PCF-002` cita `RN-RES-009`, que é PROVISÓRIA.** Minha regra (modo declarado na entrada do
  canal, senão recusa) **não** é provisória: ela vale nos dois desfechos das lacunas fiscais; o que
  muda com `LACUNA-RES-002`/`003` é qual documento sai, não se o modo precisa ser declarado. Registro
  para o passo 9 não confundir dependência de motivo com dependência de comportamento.
- **Divergência de citação encontrada no passo 6, não corrigida por mim:** `modulos/mesa-comanda.md`
  linha 8 e `modulos/cozinha.md` remetem tributo/segregação a `modulos/fiscal.md` **§3.1**, que hoje é
  "Contrato de `EMI`" — a tributação é a **§2** (o passo 3a partiu o fiscal em `FIS`/`EMI`/`APU` depois
  do passo 6). Nos meus dois arquivos citei `modulos/fiscal.md` §2. Não editei arquivo de outro passo;
  é uma linha em cada, para o orquestrador despachar.
- **`ATI` reforça a lacuna de vocabulário que os passos 4 e 6 já apontaram** e acrescenta duas: não há
  termo no glossário para **proposta pendente** (o conceito central de `PN-16`, que agora é entidade de
  `ATI` e aparece em `PCF`), nem para **sessão externa**/**canal** (conceito central de `PCF`), nem
  para identidade persistente de cliente-final. Os três viram atributo ou entidade na Fase 1 — se
  nascerem sem termo, cada camada inventa o seu.
- **`CMP` de novo, e agora com peso:** `PCF` o tem como **destino declarado** e a ativação é recusada
  sem ele. Se o passo 9 concluir que `CMP` deve ser dissolvido no núcleo (risco levantado no passo 2),
  `RN-PCF-002` e `RN-PCF-008` precisam de revisão — não do enunciado, mas do nome do destino. É a
  terceira spec consecutiva a apontar `CMP`.
- **Concentração de dado de pessoa:** com `PCF` + `ATI` ligados, o produto passa a guardar contato,
  endereço, texto livre de anônimo e **conteúdo de conversa** — a maior superfície de dado de pessoa do
  catálogo depois de `CLF`. As regras exigem prazo declarado, mas o prazo não existe: **três** dos
  meus itens pendentes com o humano são isso, e sem resposta os dois módulos ficam **inativáveis por
  construção**. Isso é deliberado (é melhor que retenção por omissão), mas o humano precisa saber que
  é um item de bloqueio de ativação, não uma nota de rodapé.
- **`RN-ATI-010`** (não confirmar existência do que está fora do escopo) é a regra com maior chance de
  ser violada na implementação sem ninguém perceber, porque a violação é uma diferença de **redação**
  de mensagem de erro. É candidata natural a achado do gate de `seguranca`.
- **Não pedi auditoria e não a peço**, mas registro o que `performance` vai olhar quando houver
  consulta: a superfície externa é a única que um estranho pode inundar de fora (`RN-PCF-011` declara
  que a operação interna tem prioridade, e essa prioridade precisa ser real, não retórica), e o custo
  por conversa de `ATI` é o único do produto que cresce com texto, não com linhas.
- **`PCF` está exatamente em 400 linhas** e `ATI` em 373. `PCF` não cabe mais nada: acréscimo exige
  quebrar em dois (divisão natural: §1–§4 "o canal e o interlocutor" / §5–§8 "regras e contrato"), não
  comprimir mais — já cortei duas vezes e a próxima passada come conteúdo. Suprimi, para caber, uma
  seção de "fronteira com os outros módulos" que `mesa-comanda.md` e `cozinha.md` têm: o conteúdo dela
  está distribuído entre a §1 (fora da fronteira) e a §7 (contrato).
PERGUNTAS:
  - para humano: **por quanto tempo cada categoria fica retida?** São duas listas. `PCF`: identificação
    opcional, contato, endereço, observação escrita pelo cliente-final, vínculo sessão↔pedido. `ATI`:
    mensagem do interlocutor, resposta, proposta, vínculo com sessão/operador. Sem resposta, os dois
    módulos são **inativáveis por regra** (`RN-PCF-012`, `RN-ATI-013`) — o que é a consequência que eu
    escolhi de propósito em vez de deixar o prazo nascer por omissão.
  - para humano: **o conteúdo de conversa pode ser processado fora da nossa fronteira?** Se sim, o
    cliente (tenant) autoriza por declaração revogável e isso vira `decision` registrada; se não, o
    requisito de fronteira fechada entra **antes** de qualquer construção de `ATI`. E, na mesma
    resposta: conversa pode ou não ser usada para treinar/melhorar modelo? Escrevi "não, sem
    autorização explícita e revogável do cliente (tenant)" como requisito — se a resposta for outra, é
    uma linha em `RN-ATI-013`, mas não presumi.
  - para humano: **existe dever de informar o cliente-final de que ele fala com automação, ou de
    oferecer atendimento humano?** (`LACUNA-ATI-1`). Não achei fonte; escrevi a escalada obrigatória
    por razão de produto (`RN-ATI-007`), não por obrigação afirmada.
  - para humano: **o modo cliente-final de `ATI` entra antes ou depois do modo operador?** Não decido
    corte (é do passo 9 e seu). O que produto declara: o risco é assimétrico (§2 de `atendimento-ia.md`)
    e o modo externo exige `PCF` **e** destino de escalada declarado para ativar.
  - para `produto` (outra passada, não este passo): a **observação/instrução de preparo escrita pelo
    cliente-final** agrava a pendência que o passo 6 já levantou — de quem é o conceito "instrução de
    preparo"? Agora ela tem uma origem externa e anônima, o que muda a resposta.
VERIFICAÇÃO:
- Contei as linhas por busca de início de linha: `pedido-cliente-final.md` = **400** (no teto, não
  acima), `atendimento-ia.md` = **373**.
- Conferi numeração: `RN-PCF-001..013` e `RN-ATI-001..013`, sequenciais, sem buraco e sem repetição.
  Contei os campos obrigatórios por busca: **52 ocorrências** de `Enunciado|Motivo|Aceite|Infeliz` em
  cada arquivo = 13 × 4. **Nenhuma regra entrou sem critério de aceite.** Nenhuma é PROVISÓRIA, e
  declarei em cada arquivo por quê (nenhuma depende de lacuna para existir).
- Conferi que **todo** `RN` externo citado existe no arquivo de origem: `RN-MSA-001, 003, 004, 007,
  008, 011`; `RN-COZ-007, 009, 011`; `RN-RES-003, 008, 009`; `RN-EMI-001`. Conferi também os `PN`
  citados (`PN-01, 02, 03, 04, 07, 10, 11, 13, 15, 16, 17, 20`) e que todo código de módulo citado
  (`MSA COZ CMP PCF ATI PUB PGO CLF ENT EST ADQ PRM ECG FIS EMI INT PER FTC`) já existe em
  `glossario.md` §4.3 — **nenhum código novo** criado ou pedido.
- Busquei `Postgres|migration|endpoint|DDL|framework|SQL|SDUI|tabela|coluna` com limite de palavra: as
  únicas ocorrências estão na cláusula de abertura que declara o que o arquivo **não** faz. Busquei
  `tela|componente|layout|bloco`: além dessa mesma cláusula, sobram só usos negativos do tipo
  "nenhuma tela cita…" (`PN-04`), "não é uma tela escondida", "nenhuma tela fica sem saída" — nenhum
  desenho de tela, nenhum bloco, nenhum componente.
- Busquei `alíquota|CST|CSOSN|IBS|CBS|IVA` com limite de palavra: **zero**. **Nenhuma afirmação fiscal
  minha:** não há link, número, percentual, sigla de documento nem data de calendário legal nos dois
  arquivos; tudo o que toca obrigação está remetido a `RN-RES-003`/`RN-RES-009`, `RN-EMI-001`,
  `LACUNA-RES-002` ou marcado como `LACUNA-PCF-1..3`/`LACUNA-ATI-1..2`.
- Busquei "cliente" sem qualificador (`cliente ` seguido de minúscula, `cliente` seguido de pontuação,
  e `clientes`): **zero** ocorrência sem qualificador — só `cliente-final`, `cliente (tenant)`,
  `clientes-finais` e `clientes-alvo`. Busquei `conta`: só "por conta própria" (locução) e os dois
  casos que eu reescrevi para "identidade de serviço" / "identidade persistente de cliente-final".
- Conferi as referências internas de seção depois de compactar os arquivos (`§6`, `§8`) — corrigi
  quatro que tinham ficado apontando para a numeração da primeira versão.
- Não escrevi fora de `docs/produto/modulos/pedido-cliente-final.md`,
  `docs/produto/modulos/atendimento-ia.md` e desta seção da ficha. **Reli o final da ficha
  imediatamente antes de escrever** — o passo 3a já havia acrescentado a seção dele (linha 773) e nada
  dela foi tocado. Não rodei teste: não há código nesta fase.
- Não medi nada: nenhum número de tempo, volume, latência, custo ou contagem de equipamento entrou nos
  dois arquivos.
MEMÓRIA SUGERIDA:
  - type=business-rule escopo=modulo:pedido-cliente-final slug=rule-sessao-externa-vinculada-ao-consumo
    — a credencial que liga um cliente-final a um consumo em aberto é emitida **por consumo** e morre
    com ele; referência durável afixada ao alvo identifica endereço, não pessoa, e não vincula sessão a
    consumo já aberto por outro (`RN-PCF-003`, consequência de `RN-MSA-003`) · camada:produto
  - type=business-rule escopo=modulo:pedido-cliente-final slug=rule-canal-externo-so-faz-operacao-aditiva
    — o cliente-final lança (aditivo, idempotente, com a sessão como autor) e **nada mais**:
    transferência, junção, retirada, fechamento, desconto e cancelamento são recusados no backend e
    viram proposta a quem tem papel; e submissão em consumo em fechamento é recusada (`RN-PCF-007`,
    `RN-PCF-009`) · camada:produto
  - type=decision escopo=modulo:pedido-cliente-final slug=decision-visao-do-canal-e-da-propria-sessao
    — por padrão o cliente-final vê só o que ele lançou; ver o consumo inteiro é configuração do
    cliente (tenant) e nunca padrão, porque quem escaneia o alvo pode não ser do grupo — o risco aceito
    no modo aberto é lançamento indevido, nunca exposição (`RN-PCF-005`) · camada:produto
  - type=business-rule escopo=modulo:pedido-cliente-final slug=rule-canal-externo-nao-degrada-o-interno
    — indisponibilidade, abuso ou desligamento do canal externo não afeta lançar, cobrar, concluir nem
    emitir; desligar é ação imediata do cliente (tenant), e a prioridade declarada em disputa é sempre
    a operação interna (`RN-PCF-011`) · camada:produto
  - type=business-rule escopo=modulo:atendimento-ia slug=rule-ia-propoe-e-nao-tem-identidade
    — `ATI` só emite **proposta pendente**, confirmada por humano com papel verificado no backend; não
    existe identidade de serviço com papel, e a IA alcança no máximo o que o interlocutor já alcança
    (`RN-ATI-001`, `RN-ATI-002`, `PN-16`) · camada:produto
  - type=business-rule escopo=modulo:atendimento-ia slug=rule-ia-referencia-resolvida-e-nao-sei
    — a IA só cita objeto por identificador resolvido pelo servidor (referência não resolvida é
    descartada), nunca afirma valor, tributo, disponibilidade ou prazo, e **"não sei" é desfecho normal
    e contável** com escalada declarada — em vez de resposta plausível (`RN-ATI-004..007`) ·
    camada:produto
  - type=business-rule escopo=modulo:atendimento-ia slug=rule-ia-nao-certifica-saude-nem-fala-pelo-cliente
    — `ATI` nunca afirma que um item é seguro para alergia/restrição, nem assume troca, garantia, prazo
    ou obrigação fiscal em nome do estabelecimento: transmite a restrição como instrução de preparo e
    escala; a fonte de composição (`FTC`) é opcional e pode estar incompleta (`RN-ATI-011`) ·
    camada:produto
  - type=convention escopo=plataforma slug=convention-dado-de-pessoa-nasce-com-prazo-declarado
    — módulo que passa a guardar dado de pessoa ou conteúdo de conversa declara prazo de retenção **por
    categoria**, e categoria sem prazo **impede a ativação**; o prazo concreto é decisão do humano, mas
    a exigência de existir é do produto (`RN-PCF-012`, `RN-ATI-013`) · camada:produto
  - type=gotcha escopo=plataforma slug=gotcha-texto-de-terceiro-nao-e-instrucao
    — texto vindo de cliente-final (observação de pedido, mensagem de conversa) é dado atribuído à
    sessão: não concede autoridade, não aplica valor, não muda prioridade e não revela nada fora do
    escopo — e a resposta nunca confirma a **existência** do que está fora dele (`RN-PCF-013`,
    `RN-ATI-009`, `RN-ATI-010`, invariante 4) · camada:produto
  - type=reference escopo=plataforma slug=reference-requisitos-de-identidade-para-d-03
    — os requisitos de identidade que `PCF` §2 e `ATI` §2 levantam (sujeito sem pessoa escopado a
    tenant/estabelecimento/canal/destino; nascimento e morte da sessão pelo destino; nenhum
    escalonamento para papel; identidade de cliente-final separada da de operador; nenhuma identidade
    de serviço com papel) somam-se aos de `PN-11`/`PN-16` e `RN-COZ-012` como entrada de **D-03** ·
    camada:produto
A CAPACIDADE DE `ATI` QUE EU MAIS QUIS ESPECIFICAR E RECUSEI POR RISCO: **o atendimento externo
autônomo de ponta a ponta** — a IA recebendo o pedido de entrega ou de retirada (telefone, mensagem,
voz), confirmando endereço, aceitando o pedido, prometendo horário e cobrando, sem humano nenhum no
meio. É a capacidade que vende o produto numa demonstração e é a que eu não consigo sustentar num
caixa: ela obriga a automação a **assumir compromisso com um terceiro anônimo** — produzir, prometer
prazo, receber dinheiro — em cima de identidade fraca, entrada hostil e rede que cai. Cada falha
aterrissa como três prejuízos ao mesmo tempo: insumo gasto, pessoa esperando algo que não existe, e
uma disputa de dinheiro que ninguém autorizou. Foi por isso que `RN-PCF-008` deixou a aceitação em
`CMP` com o operador, que `RN-ATI-005` proibiu a IA de dizer prazo e valor, e que `RN-ATI-007` fez o
destino de escalada ser **condição de ativação** do modo externo. A segunda que recusei, e por motivo
diferente, é a IA respondendo sobre alergia e composição (`RN-ATI-011`): ali o erro não custa dinheiro,
custa uma pessoa — e a fonte de verdade (`FTC`) é opcional e pode estar incompleta.

PRÓXIMO PASSO SUGERIDO: passo 8 (consulta a `seguranca` sobre os dois arquivos), levando como foco
declarado: `RN-PCF-003`/`RN-PCF-005` (vínculo de sessão e escopo de leitura — é onde IDOR e canal
lateral aparecem neste módulo), `RN-PCF-007` (lista fechada do que o anônimo não faz, verificada no
backend), `RN-ATI-010` (não confirmar existência fora do escopo) e `RN-ATI-013` (o que sai da fronteira
de processamento). Em paralelo, dois despachos de uma linha: (a) corrigir a citação `fiscal.md` §3.1 →
§2 em `mesa-comanda.md`/`cozinha.md`; (b) uma passada de glossário para **proposta pendente**, **canal
/ sessão externa** e os termos de produção que os passos 4 e 6 já pediram.

## produto (passo 3b) — 2026-08-22

## RELATÓRIO — produto — T-0001 (passo 3b)
STATUS: OK
FEITO:
- Escrevi a spec de `EMI` em **dois arquivos**, com **29 regras `RN-EMI-004` a `RN-EMI-032`**, cada uma
  com enunciado (no título), motivo, critério de aceite e caminho infeliz. `RN-EMI-001` a `003` do passo
  3a ficaram intactas e nenhuma regra nova as contradiz.
- `fiscal-emissao-propria.md` (400 linhas) — **habilitar e manter**: custódia da credencial (`004`–`007`),
  layout versionado em três cadências (`008`–`010`), homologação/produção e provisionamento
  (`011`–`012`), multiplicação por cliente/UF/ambiente com o teto de responsável técnico (`013`),
  documento aplicável e documento de serviço (`014`–`015`, este **PROVISÓRIO**), regra de ouro (`016`)
  com a escala de degradação em 5 degraus e a lista do que é inegociável, e o acréscimo ao contrato.
- `fiscal-emissao-contingencia.md` (386 linhas) — **o documento depois da venda**: guarda e entrega
  (`017`), retorno do autorizador com autorizado × rejeitado × denegado (`018`–`021`), numeração e série
  (`022`–`023`), e **contingência como máquina de estado** (`024`–`032`), com a tabela conceitual de 15
  estados e o que fecha cada um.
- **A ambiguidade da regra de validação foi carregada, não resolvida:** `LACUNA-EMI-004` guarda o
  conflito entre as observações datadas de produção e a observação "implementação futura" na mesma
  versão da NT, e `RN-EMI-010` está escrita para ser correta nos dois mundos — o fluxo é o mesmo, muda a
  gravidade. Declarei explicitamente que **não é** `LACUNA-FIS-001`.
- **13 lacunas** `LACUNA-EMI-001` a `013`, cada uma aparecendo no corpo **no lugar da frase confiante**.
  Duas heranças do passo 3a foram tratadas por citação, não duplicadas: `LACUNA-FIS-010` (PAA) **fecha
  parcialmente** — o modelo existe, tem norma nomeada e a responsabilidade permanece do emitente; e
  `LACUNA-FIS-009` (layout/numeração/cancelamento/contingência por documento) é o objeto destes dois
  arquivos, com o que o dossiê não leu isolado em `LACUNA-EMI-009`.
- Conferi `verticais/restaurante.md` §4 antes de reabrir qualquer coisa: ele já afirma o fato de tipo de
  credencial (dossiê §2.2) e cita `RN-RES-010`. **Não redigi fato novo sobre isso** — reusei, citei e
  liguei `RN-EMI-006`/`RN-EMI-027` à pergunta de hardware que ele já fez ao humano.
- **Duas capacidades de assinatura tratadas em três lugares distintos:** declaração na ativação
  (`RN-EMI-006`), o que muda na contingência off-line (`RN-EMI-027`) e o degrau 3 da escala de
  `RN-EMI-016`. É onde o modo externo dói: sem assinatura alcançável **não existe** contingência
  off-line, porque a contingência consiste em gerar, **assinar** e imprimir sem autorização prévia.
ARQUIVOS:
- `docs/produto/fiscal-emissao-propria.md` (novo, 400 linhas)
- `docs/produto/fiscal-emissao-contingencia.md` (novo, 386 linhas)
- `docs/arquitetura/fiscal/2026-08-22-dossie-emissao-propria.md` (só leitura — §1 a §10, LACUNAS, O QUE
  ESTÁ SUJEITO A MUDAR, PERGUNTAS)
- `docs/produto/modulos/fiscal.md`, `fiscal-regimes-e-vigencia.md`, `verticais/restaurante.md` (§4 e §7),
  `postura-nova-geracao.md`, `glossario.md` §4.3, `memory/plataforma/INDEX.md` (só leitura)
NÃO FEITO: —
DECISÕES:
- **O eixo do corte entre os dois arquivos não foi "contingência × resto", e sim "habilitar e manter ×
  o documento depois da venda".** Motivo: com o corte do brief, o arquivo 1 fechava em **547 linhas** e
  o 2 em 260 — e o teto é 400 por arquivo, com 2 arquivos permitidos. Levar retorno do autorizador,
  numeração e guarda para o arquivo 2 equilibrou (400/386) **e** ficou mais coerente: rejeição,
  numeração queimada, prazo e contingência são o mesmo ciclo de vida de um documento. Custo assumido:
  o nome do arquivo (`…-contingencia.md`, fixado pelo brief) é mais estreito que o conteúdo, e isso
  está declarado no título e no cabeçalho dos dois.
- **Não adotei a formulação do brief sobre o teto por UF.** O brief afirma que o teto de códigos de
  responsável técnico "limita quantos clientes atendemos por UF". A fonte diz apenas que a
  **desenvolvedora** pode ter no máximo 5 códigos válidos por UF; **nenhuma fonte diz se um código
  atende um emitente, uma instalação ou a desenvolvedora inteira**. Escrevi `RN-EMI-013` com as duas
  leituras e o efeito de cada uma, e a pergunta virou `LACUNA-EMI-005`. Preencher com a leitura do
  brief seria exatamente o erro que o brief manda evitar — e é a diferença entre "limite comercial de 5
  clientes por UF" e "capacidade de rotação".
- **Não parti `EMI` por tipo de documento**, apesar de a fonte mostrar dois universos técnicos. Em vez
  de código novo, `RN-EMI-015` faz a **habilitação ser por tipo de documento** dentro do mesmo módulo:
  um cliente pode ter mercadoria habilitada e serviço não habilitado, e `EMI` desligado passa a valer
  por documento. Ver RISCOS 1 para o custo e a pergunta.
- **Fatos e fontes na mesma tabela, com link inline também no corpo.** Segui a convenção do passo 3a
  (`F-nn` global, contínuo — usei F-35 a F-75) **e** o brief (link inline por afirmação). Consequência:
  a URL aparece duas vezes por fato, no corpo e na tabela. Preferi a redundância a escolher qual das
  duas exigências cumprir. Cada arquivo tabula só os fatos que usa, e o cabeçalho diz onde estão os
  outros.
- **Credencial vencida não é caso de contingência** — foi a conclusão mais consequente do dia, e ela
  vem da fonte, não de mim: a contingência off-line exige assinar. Isso transforma o aviso de
  vencimento de "recurso de conveniência" em requisito de continuidade, e é o motivo de `RN-EMI-004`
  existir antes de tudo.
- **Não afirmei nenhum número de antecedência de aviso de vencimento** nem nenhum limite de tentativas
  de retransmissão. Os dois são configuração/decisão do humano, e inventá-los aqui seria número não
  medido virando regra.
- **Tipo de credencial (A1/A3/nuvem) tratado como categoria normativa, nunca como formato.** Nenhum
  caminho, arquivo, extensão, repositório ou senha entrou. Declarei a proibição no cabeçalho e
  `RN-EMI-007` proíbe o valor de qualquer um dos três segredos em qualquer superfície, incluindo
  memória do projeto.
RISCOS:
- **`EMI` é grande demais para caber num MVP inteiro, e a parte que não cabe é o documento de serviço.**
  Detalho no fim do relatório, em resposta à pergunta do brief. Em uma linha: mercadoria + contingência
  é um bloco coeso e obrigatório; serviço é outro autorizador, outra adesão (municipal, voluntária,
  sem prazo), outro cronograma e **outra regra de rejeição** — e a vertical restaurante ainda não sabe
  se o caso ocorre (`LACUNA-RES-008`).
- **A fila de pendências não tem superfície em nenhuma spec.** `RN-EMI-028` exige uma lista nomeada,
  ordenada por prazo, com marco e consequência por documento — trabalho de retaguarda diário, com
  prazos de **horas**. Nenhum arquivo de produto prevê onde isso vive, e nenhum papel foi atribuído
  (`PERGUNTAS` 3 do arquivo de contingência). Se o passo 9 cortar isso, `EMI` entrega documento e não
  entrega o que fazer quando ele não é autorizado — que é o caso mais comum no ramo.
- **`LACUNA-EMI-011` pode derrubar o degrau 1 da escala de degradação no caso base.** Se o Ceará não
  admitir contingência off-line, o cliente-final sai com comprovante não fiscal sempre que o
  autorizador estiver fora. O dossiê leu o decreto que veda o hardware fiscal e remete ao manual de
  contingência, mas **não confirmou** os atos estaduais posteriores. É a pergunta mais urgente das
  minhas 10, junto com a do instrumento de custódia.
- **Custódia sem instrumento jurídico é dívida que não é de código.** `LACUNA-EMI-001`: nenhuma fonte
  aberta diz o que o custodiante assume. A decisão de guardar já foi tomada; o instrumento precisa
  existir antes do primeiro cliente, e ele é do humano, não meu nem do `seguranca`.
- **Renumerei duas regras dentro desta mesma entrega** (guarda/entrega e regra de ouro trocaram de
  número quando mudei o eixo do corte), para que cada arquivo tenha faixa contígua: `004`–`016` no
  primeiro, `017`–`032` no segundo. Nenhuma delas havia sido citada fora destes dois arquivos, e
  conferi todas as referências cruzadas depois da troca (ver VERIFICAÇÃO). **Daqui para frente nenhum
  número se move.**
- **Duas cadências que ninguém está acompanhando hoje:** nota técnica e informe técnico de tabela de
  domínio mudam em ritmos diferentes, e há um terceiro canal de atos conjuntos. `RN-EMI-009` exige que
  versão nova entre por publicação com vigência — mas isso pressupõe **alguém observando as três
  listas**. Isso é papel operacional nosso, contínuo, e não está atribuído a ninguém no projeto.
- **O dossiê não leu a especificação integralmente** (`LACUNA-EMI-009`) e não abriu quatro notas
  técnicas relevantes, uma delas sobre identificador de empresa alfanumérico, que **altera tipo de
  campo em todos os leiautes**. Consequência declarada nos dois arquivos: nenhuma regra minha afirma
  qual campo existe. Antes de a Fase 1 de `EMI` começar, isso precisa de nova pesquisa.
- **`modulos/fiscal.md` está em 397 linhas e não cabe o ponteiro para estes dois arquivos.** A §3 dele
  diz "o detalhe de `EMI` … é do passo 3b" sem citar os paths, que ainda não existiam. É uma linha para
  o orquestrador despachar — e vale junto com o risco 1 do passo 3a (as receitas `RES`/`PST`/`VAR` do
  catálogo precisam ligar `EMI`).
- **Nenhuma URL foi aberta por mim.** Todos os 41 fatos (F-35 a F-75) são transcrição de blocos
  `FONTE:` do dossiê de 2026-08-22, que declara acesso naquela data e **expira a cada nota técnica**.
  Dois fatos herdam fragilidade declarada: F-37 (carta de serviços, não o documento normativo da ICP —
  marcado na tabela) e F-47 (ambiguidade no próprio texto da regra de validação).
PERGUNTAS:
  - para humano: **sob que instrumento guardamos a credencial de assinatura?** (`LACUNA-EMI-001`.) A
    decisão de guardar está tomada; o que não existe é o que assumimos se ela for usada indevidamente.
    É contrato, não código, e precisa existir antes do primeiro cliente.
  - para humano: **em que UF cada cliente-alvo opera, e quantos por UF?** (`LACUNA-EMI-005`.) Metade da
    regra de emissão é decisão de UF, e há teto de 5 códigos de responsável técnico por UF para a
    desenvolvedora. Se o código for por emitente, isso é um limite comercial que precisamos saber antes
    de vender.
  - para humano: **o Ceará mantém a contingência off-line admitida** depois de vedar o MFE em
    2026-01-01, e com que prazo? (`LACUNA-EMI-011`.) Decide se o caso base tem contingência.
  - para humano: **documento de serviço entra ou fica declarado fora?** (`RN-EMI-015`,
    `LACUNA-EMI-006`, `LACUNA-FIS-008`, `LACUNA-RES-008`.) É a decisão que mais muda o tamanho de
    `EMI`.
  - para humano: **quantos anos de guarda, e quem trata a fila de pendências?** (`LACUNA-EMI-007`;
    `RN-EMI-028`.) A primeira decide retenção (hoje: sem expurgo); a segunda decide se existe
    superfície de retaguarda no MVP 1 e qual papel a opera (entrada para D-03).
  - para humano: **segunda via impressa ou guarda eletrônica com termo prévio?** (`RN-EMI-026`.) Muda
    consumo de papel e tempo de impressora no pico, e o termo é responsabilidade do cliente.
VERIFICAÇÃO:
- Contei as linhas por busca de início de linha: `fiscal-emissao-propria.md` = **400**,
  `fiscal-emissao-contingencia.md` = **386**. Os dois no limite ou abaixo. Cortei prosa quatro vezes e
  reequilibrei o corte entre os arquivos uma vez; **nenhum link foi removido** em nenhuma passada.
- Conferi a numeração: `RN-EMI-004` a `RN-EMI-032`, sequencial, sem buraco e sem repetição, faixa
  contígua por arquivo (`004`–`016` / `017`–`032`). Busquei `RN-EMI-033+`, `RN-FIS-021+` e `PN-21+`:
  zero ocorrência. **Toda** regra tem motivo, aceite e infeliz; a única PROVISÓRIA é `RN-EMI-015`, com
  a lacuna no título e a instrução de **não agendar para construção**.
- Conferi os `F-nn`: 41 fatos definidos (F-35 a F-75), cada um em exatamente **uma** tabela; os citados
  fora do próprio arquivo (F-35, F-37 em contingência; F-68 em emissão) estão declarados como
  cross-file no cabeçalho dos dois. Nenhuma afirmação fiscal fora da tabela.
- Conferi as 13 lacunas: cada uma aparece **inline no corpo**, no lugar da frase, e na lista do arquivo
  onde mora (`001`–`010` em emissão, `011`–`013` em contingência), com quem responde.
- Conferi as referências cruzadas depois da renumeração: as 6 ocorrências de `RN-EMI-017` que
  significavam a regra de ouro foram trocadas para `RN-EMI-016`, e a de guarda em `modulos/fiscal.md`
  §3.1… **não existe** (o passo 3a não citou nenhuma regra minha). Verifiquei que `RN-EMI-012`, `016`,
  `019`, `020`, `022`, `023`, `026`, `027`, `028`, `029`, `030` citados de um arquivo existem no outro.
- Busquei `pfx|p12|.cer|.jks|keystore|senha|password|token` (case-insensitive) nos dois arquivos: **uma**
  ocorrência real, e é a cláusula de proibição do cabeçalho. Nenhum caminho, nome de arquivo, extensão,
  formato de armazenamento ou exemplo de credencial entrou.
- Busquei `Postgres|migration|endpoint|framework|ORM|SQL|componente|bloco SDUI|coluna|DDL|stack`: as
  únicas ocorrências reais são a cláusula que declara o que os arquivos **não** fazem e a frase "não é
  tabela, tipo nem coluna (D-04 ABERTA)" acima do mapa conceitual de estados. Nenhuma decisão
  D-01..D-04 tocada.
- Busquei `provavelmente|em geral|padrão de mercado|geralmente|normalmente|costuma`: só a própria
  cláusula do cabeçalho que **proíbe** "provavelmente" e "em geral". O resto é substring de
  "norma"/"normal"/"informe".
- **Não abri nenhuma URL** e não verifiquei nenhuma fonte primária. Não escrevi fora dos dois paths
  nomeados e desta seção da ficha. Reli o fim da ficha imediatamente antes de escrever (o passo 7 era a
  última seção) e não apaguei nada. Não rodei teste: não há código nesta fase.
MEMÓRIA SUGERIDA:
  - type=business-rule escopo=modulo:fiscal slug=rule-credencial-vencida-nao-tem-contingencia — a
    contingência off-line consiste em gerar, **assinar** e imprimir sem autorização prévia, então
    credencial vencida ou inalcançável **não** é caso de contingência: não existe documento nenhum,
    nem off-line. Daí o aviso de vencimento ser requisito de continuidade (validade de 1 ano no tipo
    mais comum, N clientes = N vigências independentes), e não conveniência · camada:produto
  - type=business-rule escopo=modulo:fiscal slug=rule-contingencia-e-maquina-de-estado-nao-retry —
    contingência é estado declarado do ponto de emissão, com entrada e saída datadas, que **queima
    numeração**, **imprime mais** (detalhe da venda + segunda via, salvo guarda eletrônica com termo
    prévio) e gera fila de pendências com **prazos distintos por documento** (transmissão até o fim do
    primeiro dia útil seguinte; inutilização até o dia 10 do mês seguinte; cancelamento em 30 min ou
    24 h; substituição em 168 h); o desfecho é binário — inutilizar se não autorizado, cancelar se
    autorizado — e depende de **consultar** o autorizador, nunca de supor · camada:produto
  - type=gotcha escopo=modulo:fiscal slug=gotcha-layout-fiscal-tem-tres-cadencias — a especificação do
    documento muda por **nota técnica** (a vigente foi de v1.01 a v1.51 em pouco mais de um ano), a
    tabela de domínio muda por **informe técnico** em cadência própria e mais rápida, e há um terceiro
    canal de **atos conjuntos**; cada versão traz duas datas por item (homologação e produção), a
    homologação varia por UF e existem itens "implementação futura" sem data. Layout versionado não é
    migração única: é assinatura permanente de manutenção, e alguém tem de observar as três listas ·
    camada:produto
  - type=business-rule escopo=modulo:fiscal slug=rule-emissao-multiplica-por-uf-e-ambiente — habilitar
    emissão é por cliente, estabelecimento, **UF e ambiente**: credenciamento prévio na SEFAZ nos dois
    ambientes, segredo de código de segurança do contribuinte por UF, e onde a UF exige, código de
    responsável técnico — com teto de 5 códigos válidos por UF para a **desenvolvedora** (se o código é
    por emitente, por instalação ou por desenvolvedora **não tem fonte**, e a leitura muda um limite
    comercial). Homologação é permanente, não etapa: a norma a exige sempre que o sistema muda depois
    de estar em operação, e testar em produção pode bloquear serviços · camada:produto
  - type=decision escopo=modulo:fiscal slug=decision-emi-habilitado-por-tipo-de-documento — `EMI` não
    foi partido por tipo de documento (mercadoria × serviço), apesar de serem dois universos técnicos:
    a **habilitação** é que passou a ser por tipo de documento e por UF, e `EMI` desligado vale por
    documento. Trade-off: mantém um módulo só (código é imutável) ao custo de uma ativação mais
    granular; se o documento de serviço entrar no escopo, é ele que carrega o custo, não a fronteira ·
    camada:produto
  - type=gotcha escopo=modulo:fiscal slug=gotcha-ambiguidade-da-regra-de-validacao-ibs-cbs — a mesma
    versão da nota técnica traz, na regra de validação do grupo de IBS/CBS, observações **datadas** de
    produção convivendo com uma observação de "**implementação futura para produção**", sem dizer qual
    prevalece; há relato secundário de suspensão por ato conjunto cujo texto não contém suspensão.
    Sintoma: divergência entre "o campo é obrigatório" e "a rejeição está ativa". É **distinta** de
    `gotcha-sancao-versus-rejeicao-de-documento-sem-ibs-cbs` (aquela é notícia × notícia; esta é o
    texto da própria regra) e nenhuma resolve a outra · camada:produto
PRÓXIMO PASSO SUGERIDO: passo 9 (roadmap e corte), levando como entrada dura a resposta abaixo sobre o
que de `EMI` não cabe no MVP 1. Antes dele, três despachos de uma linha: (a) ponteiro em
`modulos/fiscal.md` §3 para os dois arquivos novos (ele está em 397 linhas — provavelmente exige a
quebra que o passo 3a previu); (b) `EMI` nas receitas `RES`/`PST`/`VAR` do catálogo (risco 1 do passo
3a, ainda aberto); (c) rotear ao humano `LACUNA-EMI-001` e `LACUNA-EMI-011`, que são as duas que mudam
decisão, não spec.

## produto (passo 13) — 2026-08-22

## RELATÓRIO — produto — T-0001 (passo 13)
STATUS: OK
FEITO:
- Reescrevi o cabeçalho de `postura-nova-geracao.md`. Saiu "só vale como frase se virar critério de
  recusa" / "existe para rejeitar spec"; entrou **lei de recusa de mecanismo**: cada item nomeia a
  necessidade real, recusa só o mecanismo e entrega outro melhor numa dimensão nomeada. Entrou a
  relação com o irmão: `PN` **veta**, o catálogo de capacidades (`CAP-<COD_MODULO>-<nnn>`) **se
  agenda**; necessidade preservada e não agendada é promessa sem entregável, e capacidade que
  contradiz um `PN` é spec recusada.
- Acrescentei `NECESSIDADE LEGÍTIMA`, `RECUSADO` e `MELHOR EM` aos **20** itens. `Recusamos`,
  `Portanto o produto faz` e `Como se prova` ficaram **verbatim** nos 20 — não mudei uma palavra do
  que qualquer item decide.
- Acrescentei a §**Regra de formação** (8 cláusulas, vale do `PN-21` em diante): necessidade antes da
  recusa; classificação `mecanismo|capacidade` com dúvida caindo em `capacidade`; as três saídas
  obrigatórias de `RECUSADO: capacidade`; lista fechada de dimensões para `MELHOR EM` com "é mais
  moderno" reprovando o item; a exigência de comparar contra o **mecanismo recusado** nomeado, não
  contra um ideal; caso executável; proibição de afirmar o que terceiro faz; número imutável.
- Criei `postura-auditoria-pn.md` (tabela derivada `PN-nn → recusado → necessidade preservada →
  saída`) **porque o arquivo (a) fechou em 411 linhas com a tabela dentro**. Sem a tabela ele fica em
  386. Cortei a tabela, não a lei de recusa, e deixei um ponteiro de 3 linhas na §Auditoria.
- Numeração intacta: `PN-01` a `PN-20`, mesma ordem, mesmos títulos, nenhum número reusado ou criado.
ARQUIVOS:
- `docs/produto/postura-nova-geracao.md` (editado, 386 linhas)
- `docs/produto/postura-auditoria-pn.md` (novo, 40 linhas)
- `.claude/rules/00-nucleo.md` §12, `.claude/rules/produto.md`, `memory/plataforma/INDEX.md`,
  `tarefas/T-0001-…` (Pedido, Plano, passo 1), `docs/produto/catalogo-de-modulos.md` (só os títulos de
  seção, para os códigos de módulo) — só leitura
NÃO FEITO: —
DECISÕES:
- **Confirmei a auditoria do brief: 20/20 recusam mecanismo, nenhum recusa capacidade.** Mas em
  **cinco** itens a leitura de "recusa capacidade" era possível a partir do texto anterior, e neles
  escrevi a preservação **dentro do campo `RECUSADO`**, em negrito, em vez de deixá-la implícita:
  PN-05 (o toque não é recusado — teclado/leitor têm de ser caminho **completo**), PN-06 (evoluir a
  interface não é recusado — é permitido por decisão registrada), PN-13 (exibir total local na hora
  continua valendo; o terminal só não **decide** o valor), PN-16 (a automação faz o trabalho todo,
  menos o último passo do que move valor) e PN-17 (o detalhe técnico não é recusado, muda de lugar).
  Sem essa frase, um `PN-21` mal-formado se ancora nesses cinco como precedente de recusa de
  capacidade — que é exatamente o defeito que este passo previne.
- **`MELHOR EM` compara contra o mecanismo recusado, nomeado — nunca contra um ideal.** Virou a
  cláusula 5 da regra de formação. Motivo: sem a âncora, PN-16 fica "pior" (a confirmação é um toque
  extra em relação à automação autônoma) e PN-06 fica "pior" (redesenho mais lento) — e os dois são
  ganhos reais contra o mecanismo que de fato recusamos.
- **Declarei o custo dentro do campo em três itens** (PN-06 mais lento de aprovar redesenho crítico;
  PN-12 mudança estrutural leva mais releases; PN-16 um toque de confirmação por operação que move
  valor) e transformei isso em regra: trade-off escondido reprova o item. Trade-off declarado no campo
  é mais honesto do que um `MELHOR EM` que só soma.
- **Acrescentei "menos parada" à lista de dimensões** (usada em PN-01, PN-12, PN-18). "Menos tempo"
  não cobre venda que não acontece nem caixa fechado para manutenção — são coisas diferentes e a
  segunda é a que o comerciante sente.
- **`RECUSADO` de PN-04 e PN-09 diz "nos dois extremos"**: o formulário genérico **e** a versão por
  ramo/cliente. Os dois eram mecanismo para a mesma necessidade legítima; sem dizer isso, PN-04 lido
  sozinho parece recusar a especialização por ramo, que é justamente o que prometemos entregar.
- **Não escrevi nenhum `CAP-` no arquivo.** A saída (a) da regra de formação cita o formato, não
  instância — o catálogo é do passo 14 e inventar código aqui criaria referência quebrada e disputaria
  numeração com quem é dono dela.
- **A tabela de auditoria diz a data da conferência** ("2026-08-22: 20 itens, nenhum recusa
  capacidade"). Sem data ela envelhece mentindo, porque item novo entra por baixo dela.
RISCOS:
- **PN-13 × PN-01 têm uma tensão real que este passo não resolve e não deveria.** PN-13 diz que o
  servidor decide valor, desconto e tributo; PN-01 diz que a venda se conclui offline. Offline, quem
  calcula é o terminal, com regra publicada pelo servidor e reconciliação depois. Nenhum dos dois itens
  descreve essa costura, e ela é a decisão mais caradura do fluxo de venda: **o que exatamente é
  "decidido pelo servidor" quando o servidor não responde?** Escrevi a `NECESSIDADE LEGÍTIMA` de PN-13
  de forma compatível com as duas (valor correto pela regra vigente + total imediato) e **não** alterei
  o que o item decide. Isso é entrada obrigatória do passo de contratos (Fase 2) e provavelmente uma
  capacidade nomeada no passo 14 ("calcular com a regra vigente publicada localmente, e reconciliar").
  Se ninguém agendar isso, PN-01 e PN-13 vão ser citados um contra o outro em revisão.
- **PN-16 é o item mais frágil da coleção sob o critério novo**, e não porque recuse capacidade: porque
  o ganho dele depende de comparar contra o mecanismo certo. Contra trabalho manual, ganha em toque e
  tempo. Contra automação autônoma, **perde** em toque e ganha em erro irreversível e rastreabilidade.
  Deixei as duas comparações explícitas no campo. Se alguém citar PN-16 para recusar automação em
  algo que **não** move valor nem altera fato concluído, está usando o item fora do escopo dele.
- **A tabela derivada vai defasar.** É o custo de partir o arquivo, e não havia alternativa dentro do
  teto de 400. Mitiguei com a cláusula "divergiu do item, vale o item" nos dois arquivos e com o "como
  manter" na tabela — mas nada impede alguém de editar um `PN` e esquecer a tabela.
- **Quatro dos cinco itens que ganharam frase de preservação (PN-05, PN-06, PN-13, PN-16) são citados
  por spec de módulo já escrita.** Não reli essas specs (fora do território e vários arquivos no teto
  de 400). Não mudei o que os itens decidem, então a citação continua válida — mas se alguma spec
  tiver parafraseado o item como recusa de capacidade (ex.: "PN-05 recusa o toque", "PN-16 recusa
  automação"), a paráfrase agora contradiz o item, e o item vence. Vale uma varredura de `PN-05|PN-06|
  PN-13|PN-16|PN-17` em `docs/produto/**` por quem tem o território.
- `postura-auditoria-pn.md` é arquivo novo em `docs/produto/` e o `README.md` de lá não o lista. A
  atualização do README é do passo 9 (declarado no passo 1) — não toquei.
PERGUNTAS:
  - para humano: **quando um `PN` futuro cair na saída (b) — capacidade abandonada com `MOTIVO
    COMERCIAL` — onde a decisão mora?** Escrevi que é decisão sua e que nenhum agent a toma sozinho,
    mas não fixei o artefato: fica no próprio item, em `memory/plataforma/` como `decision`, ou nos
    dois? Hoje nenhum item usa essa saída, então a resposta não bloqueia nada — só evita improviso na
    primeira vez.
VERIFICAÇÃO:
- Contei as linhas por busca de início de linha: `postura-nova-geracao.md` = **386**,
  `postura-auditoria-pn.md` = **40**. Os dois abaixo de 400. A primeira versão fechou em **411** com a
  tabela dentro — foi por isso, e só por isso, que o segundo arquivo existe.
- Contei os campos: busca por `NECESSIDADE LEGÍTIMA|RECUSADO:|MELHOR EM:|Como se prova:|Portanto o
  produto faz:|**Recusamos**` = **123** ocorrências = 20 itens × 6 campos + 3 menções nas seções de
  formato e de formação. **Nenhum item ficou sem nenhum dos seis campos.**
- Conferi os títulos: `PN-01` a `PN-20`, sequenciais, sem buraco, sem repetição, mesma ordem e mesmo
  texto de título de antes. Busquei `PN-21` e `PN-0.b`: zero ocorrência fora da regra de formação (que
  cita `PN-21` como "vale a partir de" e `PN-07b` como proibição).
- Conferi que `Recusamos` / `Portanto o produto faz` / `Como se prova` dos 20 itens estão verbatim
  comparando com o conteúdo que eu havia lido antes de escrever — inclusive a repetição proposital em
  PN-07 e PN-16, onde o texto original já dizia parte do que o campo novo diz.
- Busquei `mercado|moderno|concorrent|todo PDV|padrão de mercado` (case-insensitive) nos dois
  arquivos: 4 ocorrências, **todas** em cláusula de proibição (adjetivos cortados, "nunca atribuído a
  fornecedor nomeado nem a 'todo o mercado'", "é mais moderno não é dimensão", "item que depende de
  saber o que o mercado oferece hoje é pergunta para o humano"). **Nenhuma** afirmação sobre produto de
  terceiro, nenhum nome de fornecedor, nenhum número de mercado ou de adoção.
- Não entrou tabela, coluna, DDL, endpoint, componente, stack, alíquota, sigla de documento fiscal nem
  data de calendário legal. Nenhuma D-01..D-04 tocada. Nenhum número não medido: os únicos números nos
  arquivos são contagens de linhas (medidas) e a data da conferência.
- Não escrevi fora dos dois paths e desta seção. Reli o fim da ficha imediatamente antes de escrever
  (a última seção era o passo 3b) e não apaguei nada. Não rodei teste: não há código nesta fase.
MEMÓRIA SUGERIDA:
  - type=convention escopo=plataforma slug=convention-postura-nova-geracao-e-criterio-de-recusa —
    **atualizar o registro sugerido no passo 1, não criar outro**: `postura-nova-geracao.md` é a lei de
    recusa de **mecanismo**, não de capacidade; todo `PN` declara `NECESSIDADE LEGÍTIMA`,
    `RECUSADO: mecanismo|capacidade` e `MELHOR EM` com dimensão nomeada; `RECUSADO: capacidade` obriga
    (a) preservada por `CAP-`, (b) abandonada com motivo comercial do humano, ou (c) `PN` reescrito
    mantendo o número · camada:produto
  - type=convention escopo=plataforma slug=convention-melhor-em-exige-dimensao-nomeada — "melhor" só
    conta em dimensão nomeada (menos toque, erro, tempo, treino, papel, hardware, parada; mais
    informação, rastreabilidade), **comparada contra o mecanismo recusado e nomeado**, nunca contra um
    ideal; ganho que custa outra dimensão declara o custo no mesmo campo; "é mais moderno / mais limpo
    / é o certo" reprova o item · camada:produto
  - type=gotcha escopo=plataforma slug=gotcha-pn-lido-como-recusa-de-capacidade — cinco itens
    (`PN-05`, `PN-06`, `PN-13`, `PN-16`, `PN-17`) são lidos como recusa de capacidade se só o
    `Recusamos` for lido: eles **não** recusam toque, evolução de interface, total imediato na tela,
    automação, nem o detalhe técnico do erro — recusam o mecanismo e preservam a capacidade por outro.
    Sintoma: spec ou paráfrase citando um deles para tirar funcionalidade. A frase de preservação está
    no campo `RECUSADO` de cada um, e o **item** vence a paráfrase · camada:produto
  - type=state escopo=plataforma slug=state-tensao-pn-01-versus-pn-13 — quem decide valor, desconto e
    tributo quando a venda fecha sem servidor (`PN-01` × `PN-13`) **não está escrito em lugar nenhum**;
    a costura provável é regra vigente publicada e aplicada localmente + reconciliação, e ela precisa
    virar capacidade nomeada e contrato antes da Fase 2. Remover quando estiver decidido · camada:produto
PRÓXIMO PASSO SUGERIDO: passo 14 (`produto`) — `catalogo-de-capacidades.md`, semeado pela lista abaixo.
Levar como restrição de entrada: `CAP` nasce nomeando **necessidade**, nunca mecanismo (a escolha de
mecanismo é de `arquiteto-dados`/`backend`/`ui`); toda `CAP` declara módulo dono, escopo pelo teste dos
três negócios, o que o comerciante perde sem ela, e se é opt-in de verdade.

**Semente para o passo 14 — necessidade preservada → capacidade nomeável → módulo dono provável**
(uma linha cada; é semente, não catálogo — o nome final e o escopo são do passo 14):

- `PN-01` — concluir a venda sem recurso remoto alcançável — `NUC`
- `PN-02` — repetir uma tentativa sem criar um segundo fato — `NUC`
- `PN-03` — o negócio ajustar o comportamento do posto de trabalho sem tocar no terminal — `NUC`
- `PN-04` — o negócio ter na tela as etapas e os campos do ramo dele — `NUC` (composição de tela)
- `PN-05` — completar a venda pelo dispositivo que a operação já usa, sem trocar de dispositivo — `NUC`
- `PN-07` — corrigir fato concluído por fato novo, com autor e motivo — `NUC`
- `PN-08` — regra com vigência, e o fato guardando a versão que o produziu — `NUC` + `FIS`
- `PN-10` — o comerciante levar o próprio histórico para fora, em formato utilizável — `REL`
- `PN-11` — liberar exceção de operação na hora, com autor identificado — `NUC`
- `PN-13` — valor formado pela regra vigente, com total imediato para o operador — `NUC` (**depende de
  resolver a tensão com `PN-01`; ver RISCOS**)
- `PN-14` — terceiro obter o dado no ritmo dele, com escopo e revogação — `INT`
- `PN-15` — operador e suporte saberem se a venda já está registrada — `NUC`
- `PN-16` — automação executar o trabalho e o humano confirmar o que move valor — `ATI`
- `PN-17` — quem está no atendimento saber a próxima ação quando algo falha — `NUC`
- `PN-18` — comprovante ao cliente-final independente do periférico, com reemissão registrada — `PER`
- `PN-19` — pôr um negócio novo em operação sem trabalho artesanal — plataforma, **não é módulo**
- `PN-20` — o negócio mudar preço, item, operador e limite no momento da decisão — `NUC`

`PN-06`, `PN-09` e `PN-12` não entraram: a necessidade preservada neles é sobre **como entregamos**
(posição de ação como contrato, um produto sem fork, evoluir sem parar o caixa). É disciplina de
entrega, não capacidade que o comerciante escolhe — e capacidade que ninguém pode desligar não é
opt-in. Se o passo 14 discordar, o candidato mais defensável dos três é `PN-12`.

## produto (passo 10) — 2026-08-22

## RELATÓRIO — produto — T-0001 (passo 10)
STATUS: OK
FEITO:
- Escrevi `docs/produto/operacao-offline-e-sincronizacao.md` (316 linhas): contrato transversal com
  **20 regras `RN-OFF-001` a `RN-OFF-020`**, tabela de classificação com **23 operações**, **8 cenários
  narrados** e **10 lacunas** com dono nomeado.
- Declarei no topo o que impede o arquivo de ser ignorado: é **piso** (módulo mais restritivo sempre,
  mais permissivo só com `supera:` e custo declarado); **`OFF` não é módulo ativável**; e o arquivo é
  dono de **duas coisas** — a lei de convergência (§3) e a tabela (§4).
- **Três domínios de falha** (§1) com tabela de vivo/morto e as três consequências que uma faixa única
  esconderia: `COZ` opera **integralmente** em D1 (não "degradado"); D2 é onde `RN-MSA-011` morde; D3 é
  o que se confunde com "internet caiu". `RN-OFF-001` obriga toda regra a declarar domínio;
  `RN-OFF-002` fecha o desfecho em três valores.
- **Unidade de classificação é a operação** (`RN-OFF-003`), com `MSA` como prova (lançar opera,
  transferir não, mesma regra). Na tabela, `MSA` aparece em três linhas com classes diferentes.
- **Lei de convergência em quatro classes**: aditivo (`RN-OFF-004`), não-aditivo/recusa
  (`RN-OFF-005`), recurso único ou escasso com **faixa pré-alocada** (`RN-OFF-006`), autoridade que
  **nunca enfileira** (`RN-OFF-007`). Mais o **default de recusa** para operação não classificada
  (`RN-OFF-008`) e a recusa explícita a "última escrita ganha" e a desempate por relógio
  (`RN-OFF-009`). Citei `RN-MSA-008`/`RN-MSA-011` como a instância que originou a lei; **não editei**
  `mesa-comanda.md`.
- **Fila de pendências** (§5), que era o risco nº 1 do passo 3b: ordem **por agregado, nunca global**
  (`RN-OFF-010`), dono de papel com superfície e escalada (`RN-OFF-011`), **item irremediável**
  (`RN-OFF-012`), identidade cunhada no terminal (`RN-OFF-013`), **teto** em vendas pendentes
  (`RN-OFF-014`), recurso local esgotado (`RN-OFF-015`), terminal reinstalado/descomissionado
  (`RN-OFF-016`) e relógio do terminal (`RN-OFF-019`).
- **Emissão fiscal não é fila** (`RN-OFF-017`): remete a `fiscal-emissao-contingencia.md`
  (`RN-EMI-017`–`032`), declara que onde os dois falam do mesmo objeto vale `EMI`, e que contradição é
  defeito **deste** arquivo. Não reinventei nada de contingência.
- **O operador nunca resolve conflito técnico** (`RN-OFF-018`): estado, contagem de pendências e o que
  pode prometer ao cliente-final; reconciliação por julgamento vai para lista de trabalho, nunca modal
  no caixa.
- **Costura `PN-13` × `PN-01` (acréscimo do passo 13):** `RN-OFF-020` — offline o terminal **aplica**
  artefato publicado e versionado, nunca **decide** valor; o fato registra a versão usada. Ver DECISÕES
  para como ela sobrevive a `PN-07`/`PN-08`/`RN-FIS-004`. Linha própria na tabela.
ARQUIVOS:
- `docs/produto/operacao-offline-e-sincronizacao.md` (novo, 316 linhas)
- `docs/produto/modulos/mesa-comanda.md`, `modulos/cozinha.md`, `modulos/fiscal.md`,
  `fiscal-regimes-e-vigencia.md`, `fiscal-emissao-propria.md`, `fiscal-emissao-contingencia.md`,
  `modulos/pedido-cliente-final.md`, `modulos/atendimento-ia.md`, `verticais/restaurante.md`,
  `catalogo-de-modulos.md`, `glossario.md`, `postura-nova-geracao.md`, `fronteira-do-nucleo.md`
  (só leitura)
- `memory/plataforma/INDEX.md` (só leitura)
NÃO FEITO: —
DECISÕES:
- **`RN-OFF-020` resolve a costura sem tocar em `PN-13` nem em `PN-01`**, separando **decidir** de
  **aplicar**: offline o terminal aplica artefato **publicado e versionado** (preço com vigência, lista
  de preço, limite do papel, encargo configurado, versão de regra tributária) e o fato **congela a
  versão usada**. O mecanismo não é meu: é o de `RN-FIS-009` (regra é dado publicável) + `RN-FIS-004`
  (o fato congela a versão), generalizado ao resto do valor. **Como sobrevive a `PN-07`/`PN-08`:** na
  sincronização o fato **não é recalculado nem editado**; se a versão usada era vigente no instante do
  fato, o fato prevalece e não há divergência; se **não** era (artefato velho, relógio divergente), o
  fato continua intacto e a divergência vira **pendência nomeada** com efeito financeiro declarado —
  correção é **fato novo** (`RN-FIS-006`). A armadilha "o servidor recalcula na volta" foi recusada
  explicitamente no texto da regra. O que falta é do núcleo: qual artefato ele publica
  (`LACUNA-OFF-010`).
- **Classifiquei 23 operações e paro aí, por regra.** `RN-OFF-008` fixa que operação sem faixa
  declarada é **classe 2 (recusa)**. Trade-off: o default recusa coisas que talvez devessem operar
  offline; em troca, o arquivo cabe no teto, a lacuna fica visível, e destravar custa uma linha de spec
  enquanto reconciliar dado divergente em N clientes não custa uma linha.
- **`EMI` fora da fila genérica**, com precedência declarada a favor de `EMI`. Alternativa recusada:
  descrever contingência aqui em vocabulário próprio — duplicaria regra legal com prazo em horas em
  dois arquivos que vão divergir.
- **`COZ` em D1 é `integral`, não `degradado`.** Foi a decisão que mais mudou a tabela: sem os três
  domínios, `COZ` entraria como degradado e o construtor construiria fila para um caso que não existe.
- **A tabela cita `— LACUNA-OFF-001` em sete células em vez de descrever comportamento do núcleo.**
  Foi instrução do brief e é o ponto do arquivo: cobrar, não duplicar. O comportamento não é
  desconhecido — é que `PN-01`/`PN-02`/`PN-11`/`PN-15` são postura, sem critério de aceite, e postura
  não é citável por construtor.
- **`RN-OFF-nnn` agrupadas por tema, não em ordem numérica** (declarado no topo). Preferi placement
  temático a renumerar, porque numeração é imutável (`glossario.md` §4.2).
RISCOS:
- **O núcleo não tem uma única `RN-NUC-nnn`** e é dono de 9 das 23 linhas da tabela — **7 delas sem
  nenhuma regra para citar** (as outras 2 se apoiam em `RN-FIS`/`RN-EMI` e em `RN-OFF-020`). É o achado
  mais consequente do passo: o contrato de continuidade offline do **núcleo** — abrir pedido, concluir
  venda em espécie, sessão de caixa, gaveta — existe hoje só como postura. Sem essa passada de spec,
  `RN-OFF-008` (default de recusa) passa a valer para o caminho crítico do caixa, que é o oposto do que
  o humano pediu. **Recomendo que seja a próxima tarefa de `produto`**, antes de qualquer contrato.
- **`RN-OFF-006` (faixa pré-alocada) pode ser fiscalmente inviável na forma como está.** Se faixa por
  terminal exigir **série por ponto de emissão** (`RN-EMI-023`: subsérie é vedada, a série separa
  processo de emissão), isso muda habilitação por UF, custo (`RN-EMI-013`) e o desfecho do não usado.
  `LACUNA-OFF-002` é a pergunta; o requisito de produto não muda, o mecanismo muda inteiro.
- **`RN-OFF-014` (teto) é a regra com maior chance de o humano discordar do próprio produto:** ela
  admite que em algum ponto o PDV **recusa vender** — o que lido isolado contradiz `PN-01`. Escrevi o
  motivo dentro da regra (fila é venda que já aconteceu; perdê-la é receita **e** obrigação), mas se o
  humano responder "nunca recusar", `RN-OFF-014` precisa ser reescrita, não afrouxada, e
  `RN-OFF-015` fica sozinha carregando o caso.
- **Não confirmei na ficha a afirmação do brief de que o `arquiteto-dados` marcou a faixa pré-alocada
  como o item mais caro de acomodar depois.** A ficha não tem seção do passo 5 (a consulta ao
  `arquiteto-dados`) em 2026-08-22. Escrevi `RN-OFF-006` pelo mérito do requisito, sem citar essa
  atribuição.
- **`RN-OFF-019` deixa um conflito aberto no caminho crítico:** `RN-FIS-008` (fuso do estabelecimento)
  × `glossario.md` §1.1 e `.claude/rules/dados.md` §3 (fuso do cliente). Enquanto ele existe, terminal
  offline com relógio divergente não tem resposta única para "qual regra vale". Não escolhi lado.
- **`RN-OFF-011` cria um papel que ninguém especificou.** "Dono da fila de pendências" não existe em
  nenhum módulo nem em `glossario.md` §1.6; é entrada de **D-03** e de uma futura passada de núcleo. Se
  o roadmap cortar a superfície de retaguarda, `RN-OFF-011` fica sem casa e o arquivo passa a exigir
  algo que o produto não entrega.
- Divergência de vocabulário que não corrigi (território de outra passada): `glossario.md` não tem
  termo para **ponto de emissão** (uso o de `EMI`), **fila de pendências**, **lista de trabalho** nem
  **artefato publicado** — os quatro são conceitos que este arquivo introduz e que a Fase 1 vai
  precisar nomear em inglês.
- O arquivo está em **316 linhas**, com folga real. Se a §4 crescer (e ela vai: a maioria dos 31
  módulos do catálogo ainda não tem nenhuma linha lá), a quebra natural é lei+tabela em um arquivo e
  cenários em outro — não comprimir cenário, que é o formato que o humano pediu.
PERGUNTAS:
  - para humano: **qual é o teto de operação offline, em vendas concluídas pendentes de
    sincronização** (`RN-OFF-014`, `LACUNA-OFF-004`)? A unidade está declarada (vendas pendentes, não
    bytes e não minutos); o valor é seu. E **quem** pode assumir o risco de passar do teto e continuar
    vendendo — existe esse papel na operação do cliente-alvo?
  - para humano: **qual papel opera a fila de pendências** (`RN-OFF-011`, `LACUNA-OFF-007`; a mesma
    pergunta que `RN-EMI-028` deixou aberta)? Se a resposta for "o dono, no fim do dia", o prazo de
    horas do fiscal não fecha e isso é decisão de produto, não de construção.
  - para humano: **de quem é o fuso que decide vigência** quando o estabelecimento está em fuso
    diferente do cliente (tenant)? (`LACUNA-OFF-006`.) É conflito entre `RN-FIS-008` e
    `glossario.md` §1.1 / `.claude/rules/dados.md` §3, e ele decide o que um terminal offline faz na
    virada de dia e de ano.
  - para humano: **é admissível pré-alocar faixa de numeração fiscal por terminal**, e isso exige série
    por ponto de emissão? (`LACUNA-OFF-002`.) Pergunta para o contador; muda mecanismo, não requisito.
VERIFICAÇÃO:
- Contei as linhas por busca de início de linha: **315** (a primeira versão saiu com 589 e foi
  reescrita compacta; nenhuma classe, linha de tabela, cenário ou lacuna foi cortada na compressão —
  só prosa).
- Conferi a numeração: `RN-OFF-001` a `RN-OFF-020`, **20 regras, sem buraco e sem repetição**. Todas
  têm os quatro campos (enunciado, motivo, aceite, infeliz); nenhuma entrou sem critério de aceite.
- Conferi que **os 8 cenários obrigatórios do brief existem** (C-01 a C-08, na ordem pedida) e que
  **todos** têm os 9 campos, inclusive `EXERCITA` com ao menos uma `RN` — nenhum cenário é decoração.
- Conferi que **toda `RN` externa citada existe**: `RN-MSA-004/005/006/008/011/012`,
  `RN-COZ-008/009/012`, `RN-PCF-006/008/010`, `RN-ATI-001/008`,
  `RN-FIS-004/005/006/008/009/011/013/018`, `RN-EMI-001/016/017/018/019/020/021/022/023/024/025/026/
  028/029/030/031`, `RN-RES-002` — verifiquei por busca dos títulos `### RN-` em `docs/produto/`.
  Nenhuma citação inventada.
- Busquei número proibido: não há tamanho de fila, duração, lote, tempo de espera nem quantidade de
  tentativas em nenhuma regra — os cinco lugares onde apareceriam remetem a `LACUNA-OFF-004` ou
  `LACUNA-OFF-005`. Os números que existem no arquivo estão **só** em `ESTADO INICIAL` de cenário
  (terminal 2, alvo 14, 63 pendências, 20h14), que o brief exige que sejam concretos. Reescrevi o
  `ESTADO INICIAL` de C-08 para que "3 tentativas" não pudesse ser lido como limiar.
- Busquei `mesa|comanda|garçom|bomba|Postgres|schema|endpoint|coluna|DDL|SQL|framework|JSON|protocolo`
  (case-insensitive): 7 ocorrências, todas inócuas — `cozinha.md` como **path** de spec citada,
  "tabela" referindo-se à tabela deste próprio documento, e "rota" dentro de "a rota mais fácil".
  Zero `mesa`, zero `comanda`. Nenhuma decisão de D-01..D-04 tocada: `RN-OFF-013` declara o requisito
  de identidade e remete o formato a `D-04` explicitamente.
- Não escrevi fora de `docs/produto/operacao-offline-e-sincronizacao.md` e desta seção da ficha. **Reli
  o final da ficha imediatamente antes de escrever** — o passo 13 havia acrescentado a seção dele
  (linha 1402) e nada foi apagado nem reescrito. Não editei nenhuma spec de módulo, o catálogo, o
  glossário nem a fronteira. Não rodei teste: não há código nesta fase.
MEMÓRIA SUGERIDA:
  - type=business-rule escopo=plataforma slug=rule-lei-de-convergencia-offline — continuidade offline
    se classifica **por operação** e em quatro classes: aditivo (enfileira e converge sem árbitro),
    não-aditivo (recusa, dizendo por quê), recurso único/escasso (faixa pré-alocada por terminal,
    porque recusar pararia o caixa) e autoridade (**nunca** enfileira, falha fechado); operação não
    classificada é tratada como recusa, e "última escrita ganha" e desempate por relógio são recusados.
    Generaliza `RN-MSA-008`/`RN-MSA-011` · camada:produto
  - type=convention escopo=plataforma slug=convention-tres-dominios-de-falha-de-rede — não existe
    "offline": existem **D1** (link caiu, LAN viva), **D2** (terminal isolado) e **D3** (rede boa,
    serviço externo fora), e a mesma operação tem desfecho diferente em cada um — `COZ` opera
    **integralmente** em D1, e `EMI`/adquirente falham em D3 com o terminal conectado; regra que não
    declara domínio é lida como valendo só para D1 · camada:produto
  - type=business-rule escopo=plataforma slug=rule-fila-de-pendencias-tem-dono-e-ordem-por-agregado — a
    fila de sincronização não é FIFO global: ordem é obrigatória **dentro** do agregado (venda →
    pagamento → emissão) e inexistente entre agregados, um travado nunca bloqueia os outros; ela tem
    **papel dono** com superfície própria (nunca o operador de caixa), item rejeitado em definitivo sai
    para lista de trabalho nomeada em vez de laço ou descarte, e existe teto de operação offline medido
    em **vendas concluídas pendentes** · camada:produto
  - type=business-rule escopo=plataforma slug=rule-terminal-aplica-artefato-nao-decide-valor — a
    costura `PN-13` × `PN-01`: offline o terminal **aplica** artefato publicado e versionado (preço com
    vigência, limite do papel, encargo, versão de regra tributária) e o fato **congela a versão usada**
    — nunca decide valor novo; na sincronização o fato **não é recalculado** (`PN-07`, `PN-08`,
    `RN-FIS-005`), e divergência de versão vira pendência nomeada com correção por **fato novo** ·
    camada:produto
  - type=gotcha escopo=plataforma slug=gotcha-identidade-de-idempotencia-nasce-no-terminal — a chave
    que impede duplicar venda é cunhada **no terminal**, offline, no instante do fato: se ela nascesse
    no servidor, nada concluído offline seria desduplicável e o produto duplicaria exatamente venda e
    pagamento (sintoma: cobrança dobrada depois de resposta perdida ou reinício). O **formato** é
    `D-04` e não foi decidido · camada:produto
  - type=state escopo=plataforma slug=state-nucleo-sem-regra-numerada — o núcleo de venda não tem
    nenhuma `RN-NUC-nnn`: 7 das 23 linhas da tabela de classificação offline não têm regra para citar,
    só postura (`PN-01`, `PN-02`, `PN-11`, `PN-15`), que não tem critério de aceite. Remover este
    registro quando a spec do núcleo existir · camada:produto
PRÓXIMO PASSO SUGERIDO: `produto` — **spec do núcleo de venda com `RN-NUC-nnn`**, fechando
`LACUNA-OFF-001` e `LACUNA-OFF-010` (que artefato o núcleo publica ao terminal). É a dependência de
`RN-OFF-008`: enquanto ela não existe, o default de recusa vale para o caminho crítico do caixa. Em
paralelo, rotear ao humano as quatro `PERGUNTAS` acima — `LACUNA-OFF-002`, `004`, `006` e `007` mudam
decisão, não spec.

## arquiteto-dados (passo 5) — 2026-08-22

> **CONSULTA read-only**, colada pelo thread principal (o agent não escreve na ficha em consulta).
> Objeto: viabilidade das exigências de `fiscal-regimes-e-vigencia.md` e `modulos/fiscal.md`.

**(1) As cinco exigências são realizáveis** em Postgres com schema por cliente e migration
forward-only — e são o caso *fácil* do forward-only: todas append-only ou temporais, nenhuma pede
DDL destrutivo depois. Vigência como intervalo com exclusão de sobreposição; coexistência de regimes
= mesma janela por estabelecimento, sem unicidade por cadastro; migração de regime = janela nova
(nada é tocado); retificação/cancelamento = linha nova com auto-referência. Nenhuma exige `UPDATE`
retroativo, logo nenhuma exige expand/contract.

**(2) A mais caro acomodar depois: o congelamento (`RN-FIS-004`) — e o seu GRÃO.** É a única das
cinco **não acomodável depois de jeito nenhum**: as outras quatro são tabela/coluna nova preenchível
por backfill; o congelamento é dado que ou foi escrito no instante do fato, ou não existe mais — e
`RN-FIS-005` proíbe recompor. Fato sem snapshot fica para sempre sem procedência. Vale igual para o
grão: se o congelado nascer por **venda** em vez de por (item × tributo × base × regime × redutor),
a segregação de `RN-FIS-015` e a decomposição de `RN-FIS-014` ficam irrecuperáveis para todo o
histórico.

**(3) Em `EMI`, a mais caro depois: a NUMERAÇÃO de documento.** Contingência, estado de
retransmissão e versão de layout são estado/metadado de documento já append-only — coluna nova
nullable, barata. Numeração é **invariante de unicidade e sequência** por estabelecimento/série:
acrescentá-la depois exige `UNIQUE` retroativo em N schemas sobre dados que já podem ter colisão — e
renumerar é impossível, porque o número já está com o autorizador e na mão do cliente-final. Pior:
com emissão offline a alocação é concorrente e possivelmente no terminal, então `sequence` do
Postgres não serve (não reinicia por série e deixa buraco) — é **mecanismo de alocação, não coluna**.

**Custos escondidos que a spec de produto não viu:**
- **O catálogo de regra fiscal não tem casa no modelo atual.** Uma alíquota de UF vale para todos os
  clientes daquela UF: em `platform` viola "nenhuma tabela de cliente vive no platform" e faria o
  fato do cliente referenciar outro schema (proibido); replicada em cada `t_<cliente>` faz "publicar
  dado" ser escrita em N schemas, com divergência silenciosa. **Decisão mais estruturante da Fase 1,
  ainda não tomada por ninguém** → escalada como candidata a `D-05`.
- **Arredondamento é parte da regra e tem de ser congelado** (política **e** ordem), senão o
  cancelamento erra por centavo.
- **`RN-FIS-010` (ensaio) exige congelar os insumos**, não só o resultado — base, quantidade,
  classificação, natureza da operação. Sem isso a regra nasce inútil.
- **Exclusão de não-sobreposição depende de extensão de banco**, que é objeto de *banco*, não de
  schema: é provisionamento, não migration por cliente.
- **Parâmetro tipado × documento semiestruturado** é trade-off direto de `RN-FIS-009`: o segundo
  compra "regra nova sem migration" e paga com a perda de restrição declarativa no banco.
- **Divergência de regra a corrigir:** `RN-FIS-008` resolve vigência no fuso do **estabelecimento**;
  `.claude/rules/dados.md` §3 diz que o fuso é dado do **cliente**. Cliente com dois estabelecimentos
  em fusos diferentes quebra a premissa da regra, não da spec.

**PERGUNTAS:** para humano — a casa do catálogo de regra fiscal (`D-05`). Para `produto` — o congelado
inclui os **insumos** e a política de arredondamento, ou só o resultado por tributo? A numeração é
alocada por estabelecimento **e** série, e pode ser alocada no terminal offline?

**VERIFICAÇÃO:** nada rodado — consulta read-only, nenhum DDL, `db/` confirmado ausente. `dados.md`
§6 e `migrations.md` §10 **não se aplicam**: nenhum modelo entregue. D-01 e D-04 não foram presumidas.

## produto (12b) — 2026-08-22

## RELATÓRIO — produto — T-0001 (consolidação 12b)

STATUS: OK

FEITO:
- Incorporei os **oito achados** da consulta de `seguranca` a `PCF` e `ATI`, como requisito de negócio
  (nunca estratégia): 4 regras novas em `PCF` (`014`–`018`, cinco números, `018` respondendo à pergunta
  do auditor sobre a referência), 5 em `ATI` (`014`–`019`), e sharpening com aceite novo em
  `RN-PCF-005`, `006`, `007`, `013` e `RN-ATI-010`.
- **Parti os dois arquivos por eixo**, com numeração contínua e nada renumerado: `PCF` → anexo **a
  sessão externa** (`RN-PCF-003` + `014`–`018`); `ATI` → anexo **a fronteira de confiança da conversa**
  (`RN-ATI-009` + `014`, `017`, `018`, `019`). Os quatro arquivos ficaram em 399 / 173 / 393 / 172
  linhas.
- Nenhum número inventado: quatro lacunas novas (`LACUNA-PCF-4`, `5`, `LACUNA-ATI-3`, `4`), todas com
  dono nomeado, e mantive a técnica de `RN-PCF-012`/`RN-ATI-013` — **falta de declaração impede a
  ativação** — agora aplicada a limite por sessão (`RN-PCF-017`) e a derivado de conversa
  (`RN-ATI-015`).

ARQUIVOS:
- `docs/produto/modulos/pedido-cliente-final.md` (editado — 399 linhas)
- `docs/produto/modulos/pedido-cliente-final-sessao.md` (novo — 173 linhas)
- `docs/produto/modulos/atendimento-ia.md` (editado — 393 linhas)
- `docs/produto/modulos/atendimento-ia-fronteira-de-confianca.md` (novo — 172 linhas)

DECISÕES:
- **Eixo do corte:** a superfície não confiável de cada módulo, um eixo por arquivo. Recusei o corte
  por "regras antigas / regras novas" (envelhece em uma semana) e o corte por gravidade (obriga a
  renumerar quando a gravidade muda de opinião).
- `RN-PCF-007` passou de **lista enumerativa** para **regra por propriedade + falha fechado**. A lista
  ficou como ilustração, não como definição — era ela que deixava passar "alterar endereço de pedido
  já aceito" com `ENT` ligado.
- `RN-PCF-003` mudou de arquivo, não de texto. Citação por número (é como as outras specs a citam)
  continua válida; citação por seção do arquivo principal, não — por isso as duas referências internas
  a "§2, item 4" foram reescritas.
- Escolhi **não** criar código de módulo novo para os anexos: código é reservado em `glossario.md`
  primeiro (§4.1), e glossário não é meu nesta rodada. Anexo continua a sequência do módulo dono.

RISCOS:
- **`RN-ATI-018` tem consequência fora dos meus dois arquivos** — detalhe nas `PERGUNTAS`. Não editei
  nada de 12a/12c.
- Nenhum índice aponta para os dois anexos: `catalogo-de-modulos.md` e `docs/produto/README.md` não
  são meus. Quem ler só o catálogo não descobre que `PCF` e `ATI` têm anexo.
- `RN-ATI-017` (agregação) é a regra mais fácil de ser lida como "a IA não pode ajudar o gerente".
  Sem `LACUNA-ATI-3` respondida, ela nega agregação legítima — é falha fechada de propósito, mas é
  atrito real com quem opera.
- `docs/produto/modulos/fiscal.md` está em 397 linhas (não toquei). Quem for acrescentar ali já não
  tem espaço.

PERGUNTAS:
- para humano: `LACUNA-PCF-4` (limites por sessão), `LACUNA-PCF-5` (grau de não enumerabilidade e uso
  da referência), `LACUNA-ATI-3` (que agregação sobre conduta pode ser declarada, e se conduta de
  operador tem regime próprio), `LACUNA-ATI-4` (quem aprova origem nova de contexto).
- para `produto` (12a/12c, via orquestrador): `RN-ATI-018` diz que **nenhum** texto do sistema que
  entra no contexto é instrução. Isso alcança campos que não são meus — nome, descrição e ficha técnica
  de item (`FTC`/catálogo), texto de configuração, mensagem de operador, conteúdo de `PUB` e texto de
  `INT`. `cozinha.md` §6 já trata a via impressa; falta o par: **texto de cadastro exibido a operador
  ou lido por automação carrega origem declarada**. Vale um despacho a quem é dono do catálogo e de
  `cozinha.md`.

VERIFICAÇÃO: nada executado — spec de produto, sem código nem teste. Conferido: contagem de linhas dos
quatro arquivos (399/173/393/172, todos ≤ 400); nenhum número renumerado (`RN-PCF-001`–`013` e
`RN-ATI-001`–`013` intactos, só `003` e `009` mudaram de arquivo); nenhuma referência interna a `§2`
ficou apontando para conteúdo movido; nenhum arquivo fora dos meus dois (e dos dois criados) alterado;
D-01..D-04 não presumidas — nenhuma regra nova escolhe auth, modelo, provedor, biblioteca ou
arquitetura de instrução; nenhum segredo. Não verifiquei se 12a/12c criaram referência a estes
arquivos em paralelo.

MEMÓRIA SUGERIDA:
- type=convention escopo=processo slug=spec-de-modulo-parte-por-eixo-nao-por-tamanho — spec que estoura
  400 linhas parte por **eixo declarado** (a superfície não confiável, o ciclo de vida), mantendo
  numeração contínua entre os arquivos; nunca por "parte 1/parte 2".
- type=business-rule escopo=plataforma slug=escopo-de-sessao-externa-em-canal-lateral — chave de
  idempotência, resultado reaproveitado, fila, registro, via impressa e exportação carregam
  tenant+sessão na própria identidade; o schema separado protege a consulta, não o canal lateral.
- type=business-rule escopo=plataforma slug=fora-de-escopo-responde-como-inexistente — recusa por
  escopo e recusa por inexistência são a **mesma** resposta, em consulta, em conversa e em mensagem de
  erro; diferenciar as duas é oráculo de presença.
- type=gotcha escopo=plataforma slug=injecao-indireta-por-campo-de-texto-legitimo — o texto que ataca a
  automação entra por campo previsto (observação do cliente-final) e é lido depois, atendendo outra
  pessoa com mais papel; proteger só o texto do interlocutor não fecha nada.
- type=business-rule escopo=modulo:ATI slug=escopo-reavaliado-na-confirmacao — proposta lida sob um
  escopo só é confirmável se o escopo ainda vale no instante da confirmação; prazo de expiração não
  cobre perda de escopo.

PRÓXIMO PASSO SUGERIDO: `seguranca` — reauditar os oito achados contra os quatro arquivos, com foco em
`RN-ATI-017` (é o que eu menos considero fechado) e em `RN-PCF-015` (a lista de canais laterais é
nomeada, mas é lista — o mesmo defeito que `RN-PCF-007` acabou de perder).

## produto (12c) — 2026-08-22

## RELATÓRIO — produto — T-0001 (consolidação 12c)

STATUS: OK

FEITO:
- **Parti o catálogo pelo eixo "motivo de mudança"**: entrada de módulo fica em
  `catalogo-de-modulos.md`; as receitas `RES`/`PST`/`VAR` saíram para `receitas-por-vertical.md`.
  Entrada muda quando o módulo muda; receita muda quando ligamos ou revisamos uma vertical.
- **`EMI` entrou nas três receitas** como base, com a cláusula de que `EMI` exige `FIS` e que ligar só
  `FIS` descreve o cliente que **não** emite pela Forja (configuração suportada, não padrão). `APU`
  fica fora das três, com o custo já declarado em `modulos/fiscal.md` §4. `modulos/fiscal.md` §3 agora
  aponta para os **três** arquivos de `EMI` que existem hoje.
- **`CMP`: mudei a receita, não a vertical** — saiu da base de `RES`, virou "conforme o formato". E
  resolvi a pergunta pendente: `CMP` **continua existindo** como dono do estado de cumprimento.
- **`COZ`: o glossário estava errado, não o catálogo.** Os quatro termos de produção deixaram de ser
  léxico de ramo restaurante e viraram **léxico de módulo** no novo `glossario.md` §6.
- **12 termos cunhados** (§1.1, §1.3, §1.8, §6) + `estabelecimento` promovido a entidade de primeira
  classe com `establishment_time_zone` e o conflito de fuso declarado como `LACUNA-GLO-001`.
- **"Instrução de preparo" tem dono: o núcleo** — é a *observação do item de pedido*
  (`order_item_note`), com linha nova em `fronteira-do-nucleo.md` §2.3; `COZ` e `MSA` transportam.
- **`fronteira-do-nucleo.md` §6 desambiguado**: "quem cumpre a obrigação de um cliente" (dele) × "que
  capacidade existe no produto" (nossa, `EMI`). Ser intermediário fiscal de terceiro → humano.
- Varredura de paráfrase de `PN`: **nenhuma paráfrase defeituosa** nos meus arquivos (detalhe em
  VERIFICAÇÃO); uma frase de `restaurante.md` §4 reescrita por precaução.

ARQUIVOS:
- `docs/produto/receitas-por-vertical.md` (novo, 100 linhas)
- `docs/produto/catalogo-de-modulos.md` (editado, 393 — era 399)
- `docs/produto/glossario.md` (editado, 369 — era 297)
- `docs/produto/fronteira-do-nucleo.md` (editado, 264 — era 245)
- `docs/produto/verticais/restaurante.md` (editado, **400** — era 400)
- `docs/produto/modulos/cozinha.md` (editado, 347), `modulos/mesa-comanda.md` (editado, 342),
  `modulos/fiscal.md` (editado, 399 — era 397)
- Só leitura: `postura-nova-geracao.md` (PN-05/06/13/16/17), `postura-auditoria-pn.md`,
  `operacao-offline-e-sincronizacao.md`, `fiscal-emissao-propria.md`,
  `fiscal-emissao-contingencia.md`, `fiscal-custodia-e-trilha.md`, `README.md`

DECISÕES:
- **`COZ` — o lado errado era o glossário.** Teste dos três negócios sobre "ponto de produção":
  padaria **sim**, loja de roupa **não**, posto **só se** servir alimentação → não é núcleo. Segundo
  teste, o que decide ramo × cross-vertical: existe ponto de produção **fora** da alimentação — ótica
  montando lente, farmácia manipulando, gráfica imprimindo, ajuste de roupa. Logo `COZ` é
  cross-vertical e o catálogo estava certo; o defeito era classificar o vocabulário dele como jargão
  de restaurante. Corrigi **um** lado: criei `glossario.md` §6 (léxico de módulo) e movi os quatro
  termos para lá, sem meio-termo. Consequência: **dois identificadores aposentados** —
  `preparation_order` e `preparation_stage` viraram `production_work` e `production_stage`, porque
  carregavam o ramo e o primeiro colidia com `order` (pedido) do núcleo. Aposentado, nunca
  reaproveitado; nenhum código ou `RN` os citava (só três arquivos meus).
- **`CMP` — mudei o catálogo (a receita), e `CMP` deve continuar existindo.** A vertical estava certa
  pelo teste, não por autoridade: no salão puro, `MSA` responde onde o consumo está e `COZ` em que
  etapa o trabalho está; não sobra pergunta para `CMP`, e base de receita é o que o ramo **não**
  dispensa. E ele sobrevive como módulo por três razões escritas em `receitas-por-vertical.md` §5:
  (1) não é casca de `COZ` — `RN-COZ-009` fixa que o trabalho **carrega** o destino como referência
  recebida e que `COZ` não interpreta destino nem fila de cliente-final, então alguém tem de ser dono
  do **estado de cumprimento** (`MSA` no salão, `CMP` na retirada/entrega); (2) não é do núcleo — lá,
  fila e senha apareceriam no PDV de quem entrega no ato, o erro caro de `fronteira` §5.1; (3) é
  dependência dura de `ENT` e destino declarado de `PCF`, e os dois pedem estado de cumprimento, não
  fila de produção. Dissolvê-lo obrigaria `ENT`/`PCF` a olhar dentro de `MSA` ou `COZ`.
- **Modo de atendimento é núcleo, no mínimo binário.** `service_mode` (presencial × entrega em
  endereço) é núcleo porque o documento fiscal exige saber qual dos dois é e os três negócios podem
  entregar; valor além do mínimo é módulo/vertical (retirada é `CMP`, salão × balcão é `MSA`/receita).
  Escolhi o mínimo em vez do domínio inteiro justamente para não promover retirada ao núcleo.
- **Observação do item é núcleo, não capacidade de `COZ`.** Regra núcleo §12 aplicada: a necessidade
  ("a instrução do cliente-final sobre *como* atender aquela linha chega a quem cumpre") é atendida
  hoje pelo papel na bancada; o mecanismo velho perde a instrução quando o papel se perde e não tem
  autor; o nosso a faz viajar com o item, com origem declarada. Deixá-la em `COZ` tiraria a capacidade
  de quem não tem produção ("embalar para presente"). Não numerei `RN-NUC-nnn`: a spec do núcleo não
  existe — `LACUNA-GLO-002`.
- **Criei `fulfillment_state` (estado de cumprimento) em `glossario.md` §6** — não foi pedido, mas era
  o termo que faltava para a fronteira `CMP` × `COZ` parar de ser argumento e virar vocabulário.
- **Não renumerei nada** e não criei código de módulo. `receitas-por-vertical.md` não tem código:
  vertical não é ativável.
- **Estabelecimento:** promovi a linha do glossário e acrescentei `establishment_time_zone`, mas **não**
  escolhi qual fuso manda — é conflito de regra entre dois arquivos e vai ao humano
  (`LACUNA-GLO-001`), que é a mesma pergunta 3 do fim de `operacao-offline-e-sincronizacao.md` e a
  divergência que `arquiteto-dados` levantou contra `.claude/rules/dados.md` §3.
- Respondi, no dono do conceito, a pergunta que 12b endereçou a 12a/12c: a **observação do item**
  carrega origem declarada e é entrada não confiável (`RN-ATI-018` citado na linha do glossário). Não
  toquei nos arquivos de 12b.

RISCOS:
- **`verticais/restaurante.md` está em 400 e `modulos/fiscal.md` em 399.** Para caber o que eu tinha de
  acrescentar em `restaurante.md`, comprimi **prosa** em dois lugares (a ressalva "não é afirmado" do
  cabeçalho e a nota da §3); nenhuma regra, lacuna ou link saiu. O próximo acréscimo nesses dois
  arquivos **exige partir**, e o eixo já está declarado por quem os escreveu: `restaurante.md` em
  "o ramo" (§1–§3) × "requisitos e regras" (§4–§7). Partir agora quebraria referências externas
  (`§2.5`, `§4`, `§5.2`) que estão em arquivos de 12a/12b — por isso não parti.
- **`catalogo-de-modulos.md` ficou em 393**, não muito melhor que antes: a divisão devolveu 27 linhas e
  as correções consumiram 21. O próximo eixo de corte, se precisar: camada 1 e camada 2 em arquivos
  separados (é motivo de mudança diferente: dependência).
- **`docs/produto/README.md` não lista nenhum arquivo de raiz** — nem os meus, nem os de 12a/12b. Quem
  entra pelo README não descobre `receitas-por-vertical.md`, `fronteira-do-nucleo.md`,
  `operacao-offline-e-sincronizacao.md` nem os anexos de `PCF`/`ATI`. O passo 9 (roadmap) tinha isso no
  brief; hoje é a maior lacuna de navegação de `docs/produto/`.
- **A spec do núcleo é a próxima dependência, e é bloqueante para o contrato de offline.**
  `operacao-offline-e-sincronizacao.md` tem 7 células citando `LACUNA-OFF-001` porque o núcleo não tem
  regra numerada, e ele é dono de 9 das 23 operações; com o default do contrato sendo **recusa**, o
  texto hoje diz que o caminho crítico do caixa recusa operar offline — o oposto do pedido. **Não tapei
  com prosa** e não escrevi a spec (é tarefa própria). Ela também fecha `LACUNA-GLO-002`
  (`service_mode`, `order_item_note`, `pending_operation_queue`, `work_list`, `published_artifact` são
  termos de núcleo sem `RN`).
- **`fiscal-custodia-e-trilha.md` apareceu durante a minha passada** (12a partindo os arquivos de
  `EMI`) e eu aponto para ele por nome em `modulos/fiscal.md` §3. Se 12a renomear, meu ponteiro fica
  errado — vale conferir no fechamento. Mesmo risco, menor, para
  `pedido-cliente-final-sessao.md`/`atendimento-ia-fronteira-de-confianca.md`, que eu **não** cito.
- **Memória a corrigir (não edito `memory/`):** `gotcha-fronteira-de-cumprimento-de-pedido` registra
  `CMP` como possível casca do núcleo ou de `COZ`. Isso está **respondido** — o registro precisa virar
  a conclusão, ou o grafo continua avisando de um risco que já foi resolvido.
- `ECG` segue sendo módulo, e agora com gorjeta (`tip`) e taxa de serviço (`service_charge`) declaradas
  como conceitos **distintos** no glossário. Se `LACUNA-RES-004` voltar dizendo que taxa compulsória
  não é gorjeta para a exclusão de base, muda a regra fiscal, **não** o vocabulário.

PERGUNTAS:
- para humano: a Forja atua como **intermediária fiscal de terceiro** — emitir, assinar ou transmitir
  em nome de quem **não** é cliente (tenant) dela (revenda, escritório de contabilidade com carteira,
  plataforma)? Escrevi as specs presumindo o caso estreito (só estabelecimento de cliente nosso) e
  declarei isso em `fronteira-do-nucleo.md` §6. É decisão comercial e de responsabilidade legal.
- para humano: `LACUNA-GLO-001` — quando um cliente (tenant) tem estabelecimentos em fusos diferentes,
  qual fuso decide vigência de regra, "hoje", turno e fechamento: o do **estabelecimento** ou o do
  **cliente**? Hoje os dois estão escritos, em arquivos diferentes, e a Fase 1 precisa da resposta
  antes de modelar.
- para `produto` (próxima tarefa, via orquestrador): a spec do núcleo precisa numerar `RN-NUC-nnn` para
  modo de atendimento, observação do item, fila de pendências, lista de trabalho e artefato publicado —
  os cinco termos que este passo cunhou sem regra.

VERIFICAÇÃO:
- Contei linhas por busca de início de linha em `docs/produto/`: 100 / 393 / 369 / 264 / 400 / 347 /
  342 / 399. Nenhum arquivo meu acima de 400; dois **em** 399–400, declarados em RISCOS.
- **Paráfrase de `PN`:** li o texto atual de `PN-05`, `PN-06`, `PN-16`, `PN-17` e a tabela de
  `postura-auditoria-pn.md`, e busquei `PN-\d\d` nos meus oito arquivos. `PN-05` e `PN-06` **não são
  citados** em nenhum deles. As citações de `PN-13`, `PN-16` e `PN-17` que existem são "servidor decide
  / interface exibe", "automação propõe" e "mensagem de operação com ação possível" — coerentes com o
  texto pós-passo-13. Busquei também `recusa|proíbe|veda` a ≤60 caracteres de um `PN-nn`: nos meus
  arquivos as duas ocorrências são "item recusado no cadastro (`PN-17`)" e "`PN-01`", nenhuma
  atribuindo recusa de capacidade a um `PN`. **Uma** frase reescrita por precaução, não por defeito:
  `restaurante.md` §4 dizia que a tela de produção é operável "sem teclado", o que podia ser lido
  contra `PN-05`; agora diz "sem depender de teclado nem de ponteiro", que é o requisito real.
- Conferi que nenhuma referência ficou apontando para conteúdo movido: `catalogo-de-modulos.md` §5 (o
  antigo endereço das receitas) era citado só por `verticais/restaurante.md`, corrigido; os quatro
  identificadores aposentados eram citados só por `glossario.md`, `cozinha.md` e `restaurante.md`, os
  três corrigidos. Busca por `preparation_order|preparation_stage` em `docs/`: só as duas linhas que
  **declaram** o aposentamento.
- Conferi que os `RN-EMI-nnn` que eu cito existem: `RN-EMI-004` em diante estão em
  `fiscal-custodia-e-trilha.md` (004–007, 033–041), `fiscal-emissao-propria.md` (008–016) e
  `fiscal-emissao-contingencia.md` (017–032); `RN-EMI-003` está em `modulos/fiscal.md`. Não li o corpo
  dessas regras — conferi só a existência e o arquivo.
- Nenhuma afirmação fiscal nova: não escrevi alíquota, prazo, sigla, layout nem data legal, e não
  acrescentei nem removi nenhum link de fonte. As duas linhas fiscais que toquei (`restaurante.md`
  §5.1 e o cabeçalho) mantêm os links intactos.
- Nenhuma tabela, coluna, DDL, rota, componente, bloco ou stack. D-01..D-04 não presumidas — `D-03` é
  citada como pendência na linha de `customer_identity`, sem escolher estratégia.
- Não rodei teste (não há código nesta fase). Não editei `memory/**`, nem arquivo de 12a/12b, nem
  `README.md`. Não escrevi fora de `docs/produto/**` e desta seção da ficha.

MEMÓRIA SUGERIDA:
- type=decision escopo=plataforma slug=decision-catalogo-de-modulos-e-receita-em-arquivos-separados —
  entrada de módulo (`catalogo-de-modulos.md`) e receita de vertical (`receitas-por-vertical.md`) são
  arquivos distintos porque mudam por **motivo** diferente; receita liga `FIS` **e** `EMI`, e `APU`
  fica fora de toda receita enquanto estiver fora do MVP · camada:produto
- type=decision escopo=modulo:cozinha slug=decision-producao-e-lexico-de-modulo-nao-de-ramo — `COZ` é
  cross-vertical (ponto de produção existe em ótica, farmácia, gráfica e padaria), então o vocabulário
  dele é **léxico de módulo** em `glossario.md` §6; `preparation_order`/`preparation_stage` foram
  aposentados em favor de `production_work`/`production_stage` · camada:produto
- type=business-rule escopo=modulo:cumprimento slug=rule-cmp-e-dono-do-estado-de-cumprimento — `CMP` é
  dono do estado de cumprimento (`fulfillment_state`) e **não** é base de receita nenhuma: liga por
  formato de operação; no salão puro `MSA`+`COZ` bastam. Não é casca de `COZ` (`RN-COZ-009` faz o
  destino viajar sem `COZ` interpretá-lo) nem do núcleo (fila/senha vazariam para quem entrega no ato)
  · camada:produto · **supera/atualiza** [[gotcha-fronteira-de-cumprimento-de-pedido]]
- type=business-rule escopo=plataforma slug=rule-observacao-do-item-de-pedido-e-do-nucleo — "instrução
  de preparo" não é conceito de módulo: é a observação do item de pedido (`order_item_note`), do
  núcleo, que nasce com o item, viaja com ele, existe sem `COZ`, é entrada **não confiável** quando vem
  de fora e é apenas **lida** por quem cumpre · camada:produto
- type=business-rule escopo=plataforma slug=rule-modo-de-atendimento-declarado-no-pedido — `service_mode`
  é do núcleo no mínimo binário (presencial × entrega em endereço), declarado no pedido e nunca
  inferido do canal, porque o documento fiscal depende dele; valor além do mínimo é módulo/vertical
  · camada:produto
- type=gotcha escopo=plataforma slug=gotcha-fuso-do-estabelecimento-versus-fuso-do-cliente — duas
  regras vigentes se contradizem: vigência fiscal resolve no fuso do **estabelecimento**, "hoje"/turno
  /fechamento no fuso do **cliente (tenant)**; cliente com estabelecimentos em fusos diferentes quebra
  uma das duas, e a escolha é do humano (`LACUNA-GLO-001`) · camada:produto
- type=decision escopo=plataforma slug=decision-forja-emite-so-para-cliente-proprio — a capacidade de
  emissão é nossa (`EMI`, emissão própria) e não se confunde com a decisão do cliente de cumprir a
  obrigação fora da Forja; atuar como intermediária fiscal de terceiro **não** está decidido e as
  specs presumem o caso estreito · camada:produto

PRÓXIMO PASSO SUGERIDO: `produto` — **spec do núcleo de venda** (`RN-NUC-nnn`), na ordem em que as
lacunas a pedem: continuidade offline e fila de pendências (9 das 23 operações do contrato de offline),
composição de valor, modo de atendimento, observação do item, e o fechamento de `LACUNA-GLO-001` com o
humano antes de qualquer regra que dependa de fuso.

## produto (12a) — 2026-08-22

## RELATÓRIO — produto — T-0001 (consolidação 12a)

STATUS: OK

FEITO:
- **C-01 (onde a assinatura acontece) escrito como regra**, na direção decidida pelo humano: `RN-EMI-033`
  (o **lugar** do ato de assinar é atributo declarado; no ponto de emissão existe **capacidade** com
  escopo, prazo, revogabilidade e contagem por uso — nunca credencial estacionada), `RN-EMI-037`
  (revogação alcança todo ponto de emissão alcançável; o que não é alcançado **expira**, e a janela de
  exposição é declarada), `RN-EMI-038` (**furto/perda/destruição de ponto de emissão é comprometimento**:
  revoga capacidade + **encerra a faixa** + notifica o cliente + item na lista de trabalho).
  `RN-EMI-007` ganhou aceite novo cobrindo **repouso no ponto de emissão**, que era o silêncio apontado.
- **C-02 (papel retido) escrito como regra**: `RN-OFF-024` (papel retido é **autoridade**, não dado
  publicado: validade declarada, recusa até reautenticar, revogação vale na reconexão, sem renovação
  offline) e `RN-OFF-025` (destravar o teto é decisão **online**, ou exceção **pré-autorizada, finita,
  contada, com trilha própria**). Corrigi as duas regras que se contradiziam, **no lugar**: `RN-OFF-007`
  (papel saiu da lista de "dado publicado") e `RN-OFF-014` (caminho infeliz não autoriza mais offline).
- **A1–A6 do auditor** viraram `RN-EMI-034` (validação contra o estabelecimento do documento **antes** de
  assinar; ativo nunca escolhido por id do chamador — A2), `RN-EMI-035` (trilha **append-only por ato de
  assinatura** — A3), `RN-EMI-036` (papel nomeado para atos **sobre a capacidade** e para assinatura
  **fora** do fluxo de venda; dentro do fluxo, não, senão o caixa para — A4), `RN-EMI-037` (A5),
  `RN-EMI-039` (exportação/apresentação **escopada**, sem enumeração — A6).
- **B1–B5** viraram `RN-OFF-021` (ilegível em repouso, com o gate "onde a fila reside fecha **antes** de
  ela conter dado de pessoa" — B1+B5), `RN-OFF-022` (**item confirmado sai do terminal**, corrigindo o
  defeito de `RN-OFF-015` lido ao pé da letra — B3), `RN-OFF-026` (transferência escopada a mesmo cliente
  e estabelecimento — B4). A **lista fechada dos sete** é `RN-OFF-023`, com a ressalva explícita de que a
  capacidade de `RN-EMI-033` **não é "estar na fila"**.
- **Vazamento entre clientes, os dois caminhos:** `RN-EMI-040` (consolidado que só existe somando
  clientes vive fora do escopo de qualquer cliente; nenhuma superfície de cliente o alcança — `RN-EMI-013`
  e `RN-EMI-032` ajustadas para apontar) e `RN-EMI-041` (segredo com **alcance** declarado; se o código de
  responsável técnico for por desenvolvedora, é segredo compartilhado entre N clientes — atrelado a
  `LACUNA-EMI-005`).
- **Auditor de performance:** `RN-OFF-028` (valor operacional é **configuração por cliente**, nunca
  constante — é requisito de produto e é agora), `RN-OFF-029` + tabela de **grandezas com unidade e sem
  valor** (6 grupos, 23 grandezas, cada uma com quem mede e quem decide), `RN-OFF-030` (o orçamento do
  caminho crítico vale **sob drenagem no teto**; drenagem interrompível na fronteira de agregado;
  contagem de pendências é estado mantido), `RN-OFF-031` (**a soma** entre terminais e clientes é
  grandeza de plataforma, com dono nosso — não configuração de cliente). E reescrevi o limite inexequível
  de `RN-OFF-016`: quantificada **até onde o servidor conhecia**, o resto declarado como **perda não
  quantificável**.
- **Texto de terceiro é opaco** (`RN-OFF-027`, a nota do auditor): preservado literal, nunca interpretado,
  nunca marcação, nunca chave de decisão, e herda a minimização de `RN-EMI-017` — com o par citado em
  `RN-EMI-018` e em `RN-OFF-012`.
- **Parti os três arquivos por eixo declarado**, numeração contínua, nada renumerado, nada comprimido: o
  eixo de `EMI` é **custódia/poder de assinar/trilha** (`RN-EMI-004` a `007` mudaram de arquivo, não de
  número, e levaram PAA, `LACUNA-EMI-001` a `003` e duas `PERGUNTAS`); o eixo de `OFF` é **conteúdo da
  fila** e **grandezas/orçamento**. Seis arquivos, todos ≤ 400: 327 / 394 / 329 / 383 / 261 / 143.
- **Nenhum número novo.** Cinco lacunas novas, todas com dono: `LACUNA-EMI-014` (prazo/escopo da
  capacidade de assinar), `LACUNA-EMI-015` (papel — **D-03**), `LACUNA-EMI-016` (o que a norma exige no
  ponto de emissão — a especificação não foi lida, `LACUNA-EMI-009`), `LACUNA-OFF-011` (validade do papel
  retido), `LACUNA-OFF-012` (mecanismo de confidencialidade em repouso), `LACUNA-OFF-013` (grandeza de
  plataforma), `LACUNA-OFF-014` (janela do registro operacional retido).

ARQUIVOS:
- `docs/produto/fiscal-emissao-propria.md` (editado — 327, era 401)
- `docs/produto/fiscal-emissao-contingencia.md` (editado — 394, era 387)
- `docs/produto/operacao-offline-e-sincronizacao.md` (editado — 329, era 316)
- `docs/produto/fiscal-custodia-e-trilha.md` (novo — 383)
- `docs/produto/fila-local-conteudo-e-repouso.md` (novo — 261)
- `docs/produto/offline-grandezas-e-orcamento.md` (novo — 143)
- Só leitura: `.claude/rules/00-nucleo.md` §12, `.claude/rules/produto.md`, `docs/produto/glossario.md`
  §4, `docs/produto/README.md`

DECISÕES:
- **Eixo do corte de `EMI`: "o que é do ativo e do poder de assinar" × "o que é do documento".** Recusei
  cortar por "regras antigas/novas" e por gravidade (as duas obrigam a renumerar depois). Consequência
  aceita: `RN-EMI-004` a `007` mudaram de arquivo. Verifiquei que **nenhum** arquivo fora dos meus os
  cita por caminho — só por número, que não mudou.
- **Assinar dentro do fluxo de venda não pede papel por documento** (`RN-EMI-036`). A4 lido ao pé da letra
  ("usar a credencial é operação autorizada por papel") pararia o caixa em cada venda. A autorização é da
  **capacidade**; o que sai do fluxo de venda (inutilização, cancelamento, retransmissão em massa) volta a
  exigir papel por ato. Trade-off declarado: dentro da validade da capacidade, o ato individual não tem
  autorizador humano — o que ele tem é **trilha** (`RN-EMI-035`) e prazo curto (`RN-EMI-033`).
- **`RN-OFF-022` não apaga: ele desloca.** B3 pedia "item confirmado sai do terminal", e a leitura fácil
  seria "o terminal esquece a venda". Isso removeria capacidade real (consultar/reimprimir a venda recente
  sem rede — `PN-18`). Regra núcleo §12 aplicada: necessidade preservada, mecanismo trocado — o que sai é
  o **conteúdo de fila**, o que fica é **registro operacional minimizado com janela declarada**
  (`LACUNA-OFF-014`). E `RN-OFF-015` continua absoluta para item **não confirmado**.
- **Não escrevi "a fila nunca contém dado de pessoa".** Contradiria `RN-EMI-017` (a entrega eletrônica
  exige identificar o comprador). Em vez disso: só o que a entrega escolhida exige (item 4 da lista) +
  o gate de `RN-OFF-021` (residência e confidencialidade decididas antes).
- **`RN-OFF-025` preserva a exceção em vez de proibi-la.** Recusar o destravamento seria recusar
  capacidade ("pare de vender no pico"); recusei o **mecanismo** (senha de gerente no terminal sem
  contato) e mantive a necessidade com exceção pré-publicada, finita e contada. Se o humano decidir que
  não existe exceção, `RN-OFF-014` vale seco — e isso está escrito no caminho infeliz.
- **Não afirmei nada de fiscal sem fonte.** Toda regra nova se apoia em F-35 a F-40, F-56, F-64, F-68,
  F-69, F-71, F-75 (já tabulados nos irmãos) ou é requisito de produto/segurança declarado como tal. O
  arquivo novo de `EMI` **não tabula fonte própria** — segue a convenção que `contingencia` já usava.
- **Vocabulário:** usei `ponto de emissão` (já em `RN-EMI-024`) para o fiscal e `terminal` para o núcleo.
  Cunhei em prosa "capacidade de assinar" e "registro operacional" sem promovê-los a termo de
  `glossario.md` — glossário não é meu nesta rodada (é de 12c).

RISCOS:
- **Colisão de identificador:** os achados críticos do auditor são `C-01`/`C-02`, e `C-01`…`C-08` já são
  **cenários** em `operacao-offline-e-sincronizacao.md` §7. Acrescentei `C-09` e `C-10` continuando a
  sequência de cenários. Quem ler "C-01" fora de contexto vai ao lugar errado — vale nomear achados com
  outro prefixo nas próximas auditorias.
- **`fiscal-emissao-contingencia.md` está em 394.** O próximo acréscimo ali **exige partir**; eixo já
  visível: "estados + retorno + numeração" (§1–§4) × "contingência" (§5). Não parti agora porque
  `RN-OFF-017` e `modulos/fiscal.md` §3 citam o arquivo por caminho.
- **`RN-EMI-041` deixa uma decisão de habilitação em aberto por falha fechada:** enquanto
  `LACUNA-EMI-005` não fechar, nenhuma UF que exija código de responsável técnico é habilitada **com
  contingência off-line**. Isso pode barrar cliente real, e é decisão comercial do humano.
- **`RN-OFF-031` cria obrigação de plataforma sem dono nomeado** (é `LACUNA-OFF-013`): hoje ninguém opera
  esse limite, e o efeito só aparece em incidente regional — quando não dá para negociar.
- **Referências cruzadas para fora do meu território que eu não pude escrever:** `catalogo-de-modulos.md`,
  `README.md` e `glossario.md` não citam os três arquivos novos (não são meus). Quem entra pelo catálogo
  não descobre `fila-local-conteudo-e-repouso.md` nem `offline-grandezas-e-orcamento.md`. 12c reportou o
  mesmo sintoma nos arquivos dele — é o mesmo defeito de navegação, agora maior.
- **`RN-OFF-028` toca `LACUNA-OFF-005`, cujo dono é `performance`:** a regra muda o que ele vai entregar
  (valor **publicável por cliente**, não constante). Ele precisa saber antes de medir.
- Não verifiquei se 12b/12c criaram referência aos meus arquivos em paralelo; `modulos/fiscal.md` já
  aponta para os **três** arquivos de `EMI` (12c leu o novo), o que confere.

PERGUNTAS:
- para humano: `LACUNA-EMI-014` — **prazo e escopo máximo da capacidade de assinar no ponto de emissão**.
  É o número que define a janela de exposição de um terminal furtado; sem ele, "revogável com efeito
  imediato" só vale para quem está com rede.
- para humano: `LACUNA-OFF-011` — **validade do papel retido no terminal**. Sem número, `RN-OFF-024` fixa
  direção (o mais curto que a operação suporta) e não fixa limite.
- para humano: **existe exceção offline para passar do teto** (`RN-OFF-025` (b))? Se sim, de que tamanho e
  publicada por quem? Se não, `RN-OFF-014` vale seco e isso entra na habilitação.
- para humano: `LACUNA-EMI-005` de novo, agora com consequência de segurança — se o código de responsável
  técnico for **por desenvolvedora** e a UF exigir o hash dele no documento, a contingência off-line
  colocaria segredo de N clientes num terminal de cliente (`RN-EMI-041`, infeliz).
- para humano/jurídico: `LACUNA-EMI-001`, segunda metade — de quem é a responsabilidade pelo que sair de
  um terminal **do cliente** durante a janela de `LACUNA-EMI-014`?
- para `seguranca`: `RN-EMI-034` e `RN-OFF-026` são os dois caminhos de acesso indireto que eu enxerguei
  (assinatura e transferência de fila). Existe um terceiro na drenagem — o servidor aceitando item cuja
  identidade foi cunhada em terminal de outro estabelecimento?

VERIFICAÇÃO: nada executado — spec de produto, sem código nem teste. **Medido:** contagem de linhas dos
seis arquivos (327 / 394 / 329 / 383 / 261 / 143, todos ≤ 400). **Conferido:** nenhuma `RN` renumerada
(`RN-EMI-004` a `007` só mudaram de arquivo; sequências novas seguem em `RN-EMI-033` e `RN-OFF-021`);
busca por citação de `RN-EMI-004`–`007` e pelos três caminhos de arquivo em `docs/**` — nenhuma
referência externa quebrada (só `modulos/fiscal.md` cita PAA, sem seção); nenhum número inventado (cada
ausência é `LACUNA` com dono); nenhum caminho, formato, keystore, senha ou nome de arquivo de credencial
em nenhum dos seis; nenhum fato fiscal novo afirmado sem `F-nn` já tabulado; D-01…D-04 não presumidas
(`RN-EMI-033` e `RN-OFF-021` declaram requisito e mandam o mecanismo para lacuna). **Não conferido:**
`memory/**` pode citar `fiscal-emissao-propria.md` §1 como casa de `RN-EMI-004`–`007` — não leio nem
escrevo memória.

MEMÓRIA SUGERIDA:
- type=business-rule escopo=plataforma slug=poder-de-assinar-e-capacidade-com-prazo-nao-credencial-parada
  — assinar no ponto de emissão é capacidade declarada, com escopo, prazo, revogação e trilha por uso;
  furto de terminal é comprometimento (revoga + encerra faixa + notifica), não contagem de venda perdida
  · camada:produto
- type=business-rule escopo=plataforma slug=papel-retido-offline-e-autoridade-com-validade — papel retido
  no terminal não é dado publicado: tem validade, é recusado até reautenticar quando vence, e revogação
  vale na reconexão; destravar teto offline é decisão online ou exceção pré-autorizada e contada ·
  camada:produto
- type=business-rule escopo=plataforma slug=item-confirmado-sai-do-terminal — retenção anti-perda vale
  para item **não confirmado**; confirmado sai da fila e fica só registro operacional minimizado com
  janela declarada, porque fila que nunca esvazia é alvo que cresce todo dia · camada:produto
- type=convention escopo=plataforma slug=valor-operacional-e-configuracao-por-cliente — teto, lote,
  espaçamento, tentativa, margem, validade e prazo são configuração por cliente com vigência, nunca
  constante: senão calibrar depois de medir exige deploy em N clientes · camada:produto
- type=gotcha escopo=plataforma slug=perda-offline-nao-e-quantificavel-pelo-servidor — "quantificar a
  perda pelo que o servidor sabia" é inexequível: fato nascido offline é invisível para ele por
  construção; declarar duas partes (até onde conhecia + perda não quantificável) · camada:produto
- type=business-rule escopo=plataforma slug=consolidado-entre-clientes-fora-do-escopo-de-cliente —
  contagem que só existe somando clientes (teto por UF, uso agregado) é dado da plataforma; nenhuma
  superfície de cliente a alcança, e segredo de alcance N clientes é declarado como tal · camada:seguranca

PRÓXIMO PASSO SUGERIDO: `seguranca` — reauditar C-01 e C-02 contra os seis arquivos, com foco em três
pontos que eu **não** considero fechados: (1) a janela de exposição residual de `RN-EMI-033`/`037`
enquanto `LACUNA-EMI-014` não tem número; (2) o caminho de `RN-EMI-041` (segredo de alcance N clientes
alcançando ponto de emissão); (3) a identidade cunhada em terminal alheio na drenagem, que `RN-OFF-026`
cobre para transferência e talvez não para envio normal.

## produto (passo 14) — 2026-08-22

## RELATÓRIO — produto — T-0001 (passo 14)
STATUS: PARCIAL
FEITO:
- Criei `docs/produto/catalogo-de-capacidades.md` (334 linhas) — a metade **ofensiva** de "nova geração":
  o que o dono do negócio escolhe ligar. Critério de separação mecânico no cabeçalho: **se o roadmap pode
  agendá-la, é capacidade; se ela só veta o que se agenda, é `PN`.** Ninguém precisa julgar "novo × melhorado".
- Escrevi o **método** (§2, 9 passos) — o entregável mais durável: 6 passos de observação da operação
  (trabalho manual, o palpite repetido, o papel que sobrevive, digitação dupla, recusa ao cliente-final, o
  que muda no pico), depois nomear a necessidade, depois a ordem dos filtros (do mais barato ao mais caro),
  depois `[[LACUNA]]` onde não há fonte.
- **10 capacidades completas** com os 14 campos: cross-vertical `CAP-PER-001`, `CAP-EST-001`, `CAP-PRZ-001`;
  `RES` `CAP-COZ-001`, `CAP-MSA-001`; `VAR` `CAP-ETQ-001`, `CAP-GRD-001`, `CAP-TRC-001`; `PST` `CAP-BMB-001`,
  `CAP-BMB-002`. Todas `status: candidata` — nenhuma nasce aceita.
- O exemplo do humano virou `CAP-ETQ-001`, titulado pela **necessidade** ("identificar e precificar o item
  pelo próprio item, sem preço afixado"). "QR" aparece **uma vez** no arquivo, no corpo, citado como o
  exemplo dele, com as alternativas ao lado e a escolha declarada pendente.
- §7 `Candidatas não desenvolvidas` (4), §8 `Horizonte` (9), §9 `Recusadas` (7).
- Acrescentei em `postura-nova-geracao.md` o parágrafo com o **nome do arquivo irmão** e o critério
  mecânico. O parágrafo de ligação genérico já existia (linhas 12–16, de passo anterior): eu não o
  dupliquei, completei. **Nenhum `PN-nn` foi tocado.** 386 → 392 linhas.
ARQUIVOS:
- `docs/produto/catalogo-de-capacidades.md` (novo, 334 linhas)
- `docs/produto/postura-nova-geracao.md` (editado — só o parágrafo de ligação, §cabeçalho)
- só leitura: `catalogo-de-modulos.md`, `glossario.md` §3.3/§4, `fronteira-do-nucleo.md` §1/§2.1/§5,
  `operacao-offline-e-sincronizacao.md` §1–§4, `verticais/restaurante.md` §1/§3/§4/§5,
  `receitas-por-vertical.md` §3/§4, `memory/plataforma/convention-necessidade-antes-de-mecanismo.md`
NÃO FEITO:
- **Cotas não preenchidas, e por escolha:** `RES` 2 de 8, `VAR` 3 de 8, `PST` 2 de 3. O teto de 400 linhas
  é real: a primeira versão com 13 entradas deu 519 linhas, e depois de duas passadas de compactação ainda
  dava 431. Em vez de partir o arquivo por vertical, apliquei o **passo 8 do próprio método** e reprovei as
  três entradas mais dependentes — `CAP-COZ-002` (entregar junto) e `CAP-RSV-001` (quando o lugar libera)
  foram para §8 com o motivo, e `CAP-COM-001` (parcial de quem é comissionado) para §7 por falta de
  `ACEITE`. As três estavam escritas por inteiro; o motivo da saída está registrado em cada uma.
- Não há entrada de escopo `nucleo`, e isso é **resultado**, não omissão: núcleo está sempre ligado, logo
  nada nele é opt-in — ou é piso (`RN-NUC-nnn`) ou é configuração. Está escrito como regra 4 da §1.
DECISÕES:
- **Renomeei o campo 5** de "por que ninguém já faz isso" para `OBSTÁCULO`, mantendo a pergunta original
  citada na tabela. Motivo: a redação original **obriga** a afirmar o que terceiro faz, e `produto.md`
  proíbe exatamente isso. O campo continua fazendo o trabalho — obstáculo concreto (norma, custo, hardware,
  comportamento de operador) — sem virar afirmação de mercado. Trade-off: perde o efeito retórico da
  pergunta, ganha auditabilidade.
- **`CAP-ETQ-001` fica `candidata` com pergunta bloqueante**, não recusada: a necessidade e o ganho são
  claros, mas exibição de preço ao consumidor tem regra própria que eu não confirmei. Preferi entrada
  completa com o bloqueio declarado a jogá-la em §7 — o raciocínio inteiro é reusável no dia em que a
  resposta chegar.
- **Escopo de `CAP-PRZ-001` é `modulo:PRZ`, não `vertical:PST`**, apesar de o cenário ser de posto: frota é
  conta a prazo cross-vertical (`glossario.md` §3.4). Classificar pelo cenário em que a ideia apareceu é
  exatamente o erro que `fronteira-do-nucleo.md` §5.1 cobra caro.
- **`CAP-MSA-001` e `CAP-COZ-001` declaram custo que o produto não gosta de admitir** — a conferência pelo
  cliente-final força correção de lançamento em tempo real, e a previsão obriga a medir e **mostrar** o
  próprio erro. Deixei os dois no campo 4 em vez de esconder no `OBSTÁCULO`.
RISCOS:
- `VAR` é o ponto mais fraco do arquivo e não tem como não ser: **não existe `docs/produto/verticais/varejo.md`**.
  As três entradas de `VAR` se apoiam em três fatos de `receitas-por-vertical.md` §4 e nada mais; marquei
  `[[LACUNA]]` onde precisei de comportamento de loja. Se o humano quiser `VAR` de verdade, o pré-requisito
  é a spec da vertical, não mais entradas aqui.
- Quatro capacidades dependem de **hardware ou protocolo de terceiro não confirmado** (`CAP-PER-001`,
  `CAP-BMB-002`, e parcialmente `CAP-ETQ-001`/`CAP-TRC-001`). Nenhuma presume o equipamento; todas declaram
  `PERGUNTAS: para humano`. Se o humano responder "não existe esse equipamento", elas viram §9, não §8.
- `CAP-TRC-001` e `CAP-ETQ-001` compartilham o mesmo pré-requisito (identificação persistida por unidade).
  Se ele for construído, as duas ficam mais baratas juntas do que separadas — mas quem decide sequência é
  o roadmap, e eu não a sugeri no arquivo.
- Fora de escopo, uma linha: `catalogo-de-modulos.md` §1 diz que módulo novo tem código reservado em
  `glossario.md` §4.3 primeiro. **Nenhum código novo foi preciso aqui** — as 10 entradas couberam em módulos
  existentes, o que é evidência a favor da fronteira de módulos do passo 2.
PERGUNTAS:
  - para humano: **exibição de preço ao consumidor no comércio** — existe obrigação de o preço estar
    afixado/visível na própria mercadoria? `CAP-ETQ-001` inteira depende disso, e não presumo regra de
    consumo por analogia.
  - para humano: **repasse de encargo de serviço e de gorjeta** a quem trabalha — qual regra vale? Sem ela
    a capacidade de `ECG` não tem `ACEITE` (§7).
  - para humano: **regra de prazo e condição de devolução** — o sistema pode localizar a venda de origem e
    ainda assim não poder decidir se a devolução cabe (`CAP-TRC-001`).
  - para humano: **tolerância de medição** em equipamento que mede saída de combustível — sem número/norma,
    `CAP-BMB-001` alarma no que é normal.
  - para humano: os **equipamentos** existem? (a) impressora que informa nível de consumível; (b)
    equipamento de abastecimento que aceita limite por valor. Hardware não confirmado não se presume.
  - para humano: quer `VAR` como vertical de verdade? Se sim, o próximo passo é `verticais/varejo.md`, não
    mais capacidades.
VERIFICAÇÃO:
- Contei as linhas dos dois arquivos (`rg` count): `catalogo-de-capacidades.md` 334, `postura-nova-geracao.md`
  392. Ambos abaixo de 400.
- Busquei mecanismo no arquivo (`QR|NFC|RFID|visão computacional|código de barras`): **1 ocorrência**, linha
  174, no corpo de `CAP-ETQ-001`, como o exemplo do humano. **Nenhum título** contém mecanismo.
- Conferi as 10 entradas contra os 20 `PN` lendo o arquivo inteiro de postura nesta sessão. As que morderam:
  `PN-01` (três entradas resolvidas por artefato publicado retido, `RN-OFF-020`), `PN-13` (duas), `PN-16`
  (duas recusas), `PN-07`/`PN-08`/`PN-20` (citados nas entradas). Nenhuma capacidade viola `PN`.
- Conferi as classes de conexão contra `operacao-offline-e-sincronizacao.md` §1–§4 (D1/D2/D3, classes 1–4,
  default `RN-OFF-008`, `RN-OFF-020`). Não rodei nada executável — não há o que executar nesta camada.
- **Não** verifiquei nenhuma afirmação de norma (preço, gorjeta, devolução, medição): todas estão marcadas
  como não confirmadas, e é por isso que existem as `PERGUNTAS`.
MEMÓRIA SUGERIDA:
  - type=convention escopo=plataforma slug=convention-capacidade-vs-postura — a fronteira é mecânica: o que
    o roadmap pode agendar é capacidade (`CAP-<COD>-<nnn>`, em `catalogo-de-capacidades.md`); o que só veta
    o que se agenda é postura (`PN-nn`). Fecha o debate "novo × melhorado" sem julgar item por item · camada:produto
  - type=convention escopo=plataforma slug=convention-mecanismo-nao-entra-no-nome — capacidade se nomeia
    pela necessidade; mecanismo no nome viaja para componente e coluna, como "restaurante" quase viajou.
    Mecanismo é a "vertical" da camada de produto · camada:produto
  - type=convention escopo=plataforma slug=convention-metodo-de-busca-de-capacidade — como se procura
    capacidade nova numa vertical: trabalho manual, palpite repetido, papel que sobrevive, digitação dupla,
    recusa ao cliente-final, o que muda no pico; e a ordem dos filtros, do mais barato ao mais caro
    (`catalogo-de-capacidades.md` §2) · camada:produto
  - type=decision escopo=plataforma slug=decision-nucleo-nao-produz-capacidade — escopo núcleo não gera
    entrada de capacidade: núcleo está sempre ligado, logo nada nele é opt-in — é piso (`RN-NUC`) ou
    configuração · camada:produto
  - type=gotcha escopo=plataforma slug=gotcha-capacidade-que-cria-mais-trabalho — toda capacidade declara o
    custo de operação que ela **cria**, ao lado do trabalho que elimina; sem o par, "capacidade" é tarefa
    nova com nome bonito (o exemplo do humano: preço não afixado elimina remarcação e mantém afixar por
    unidade) · camada:produto
PRÓXIMO PASSO SUGERIDO: humano — responder as seis `PERGUNTAS` (quatro são norma, duas são hardware). Duas
delas destravam entradas inteiras: exibição de preço libera `CAP-ETQ-001`, tolerância de medição libera
`CAP-BMB-001`. Depois disso, `produto` — `verticais/varejo.md`, se `VAR` for para valer; sem ela, `VAR`
continua sendo o trecho do arquivo com mais `[[LACUNA]]`.

## produto (passo 9) — 2026-08-22

## RELATÓRIO — produto — T-0001 (passo 9)
STATUS: OK
FEITO:
- Criei `docs/produto/roadmap-de-modulos.md` (396 linhas): os **dois eixos separados** (funcionamento =
  PDV geral desde o dia 0; construção = puxada por `RES`, que é **corpo de prova**, não produto), com as
  três consequências auditáveis da distinção; **fase = dependência** com os quatro tipos de dependência
  e dono de cada um; **MVP 1 / subsequente / horizonte** sem uma única data; **§7 = o que a Fase 1 não
  pode modelar**; §9 = o que ficou fora com o risco de cada corte; §10 = seis dívidas declaradas.
- **Piso × diferencial virou regra mecânica (§2.2, R1–R5)** e produziu o resultado que evita o erro
  clássico: **7 das 10 `CAP` são candidatas a piso do módulo dono, não diferencial**, porque
  `arcaico: sim → PN-nn` significa que a necessidade **já é atendida hoje** pelo mecanismo velho
  (núcleo §12). Medido: nenhuma das 10 tem `opt-in: obrigatória por dependência` — todas são
  `opt-in: sim`. **Nenhuma `CAP` é agendada no MVP 1**, e nenhuma é promovida: a §2.3 propõe
  reclassificação e manda o humano confirmar item por item.
- **`EMI` custeado explicitamente (§5)**, não escondido numa linha: bloco mínimo indivisível em 6 itens
  (incluindo **fila de pendências com prazo por documento** e **versão de especificação gravada**), os 4
  itens que não cabem (documento de serviço, modalidades adicionais de contingência, segunda UF,
  automação de rotação — o **aviso** de vencimento fica), e **Opção A × Opção B custeadas**, com a
  Opção B só honesta se **numeração, congelamento e âncora** entrarem no modelo da Fase 1 mesmo sem
  `EMI` construído. Proposta, não decisão.
- **`FIS` não é agendado como modelável:** §7.1 diz em voz alta que **`D-05` está aberta** e que sem ela
  `FIS` não entra no modelo da Fase 1, com as três saídas conhecidas e o defeito de cada uma. §7.2 e
  §7.3 registram os dois irrecuperáveis — **congelamento + grão** (`item × tributo × base × regime ×
  redutor`) e **numeração** (mecanismo de alocação, não coluna) — e §7.4 o conflito de fuso que bloqueia
  modelar tempo.
- **`RN` PROVISÓRIA não vai para código:** as três (`RN-EMI-015`, `RN-FIS-016`, `RN-RES-009`) estão
  tabuladas na §3 com a lacuna e o **dono da resposta**, agendadas para resolver a lacuna.
- Reescrevi `docs/produto/README.md` (13 → 138 linhas): **todos os 29 arquivos** de `docs/produto/` com
  uma linha de gancho cada, agrupados por conjunto normativo (os três de núcleo, os dois de autorização,
  os três de offline, os quatro de fiscal, os dois pares de anexo em `modulos/`), mais tabela "por onde
  entrar", as convenções (`RN`, `PROVISÓRIA`, `LACUNA`, teto de 400 e partição por eixo), o `clientes/`
  vazio com motivo, e os vizinhos fora do território.
ARQUIVOS:
- `docs/produto/roadmap-de-modulos.md` (novo — 396 linhas)
- `docs/produto/README.md` (editado — 138 linhas, era 13)
- Só leitura: `.claude/rules/00-nucleo.md` §12, `.claude/rules/produto.md`, `catalogo-de-modulos.md`
  (§1–§2, §4–§6 e todas as linhas "Exige"), `catalogo-de-capacidades.md` (§1–§3, §7–§9),
  `receitas-por-vertical.md`, `nucleo-venda.md` (§1 headings, §6), `nucleo-caixa-e-turno.md`,
  `nucleo-publicacao-e-texto.md`, `papeis-e-permissoes.md`, `papeis-atribuicao-e-delegacao.md`,
  `postura-auditoria-pn.md`, `modulos/fiscal.md` (headings), a ficha (Pedido, Plano, 3b, 5, 12a/b/c, 14)
NÃO FEITO: —
DECISÕES:
- **Achei o sinalizador mecânico de "piso disfarçado de diferencial": o campo `arcaico`.** O brief pedia
  para tratar como piso a capacidade que preserva table-stakes com mecanismo melhor, e isso exigiria
  julgar 10 entradas uma a uma. `arcaico: sim → PN-nn` já é exatamente essa declaração, feita pelo passo
  14. Trade-off: é proxy, não prova — por isso a §2.3 diz "classificação **proposta**" e manda o humano
  confirmar item por item, em vez de reclassificar por conta própria.
- **`PCF` e `ATI` ficam fora do MVP 1, contrariando o pedido literal do humano.** Não por opinião: `PCF`
  exige `PUB`, `ATI` exige `PUB` **e** `PCF`, e **`PUB` tem 0 `RN`**. Coloquei a justificativa nominal na
  §4.2 e o risco na §9, e a pergunta 1 do fim é explicitamente sobre isso.
- **Achado que virou o eixo da §4.1: `PER` tem 0 regra numerada e é dependência dura de `EMI`** (a
  contingência imprime detalhe e segunda via, `RN-EMI-026`). É piso do MVP 1 sem spec nenhuma — e é o que
  sustenta a R3 ("MVP 1 não recebe diferencial enquanto houver piso descoberto") com fato, não com
  postura.
- **Não respondi as duas perguntas que `arquiteto-dados` endereçou a `produto`** (o congelado inclui
  insumos e política de arredondamento? a numeração é por estabelecimento **e** série, alocável no
  terminal?). Roadmap não é lugar de `RN` nova. Registrei as duas como **pré-requisito de decisão antes
  da Fase 1, com dono** (§7.2, §7.3) e mandei para a próxima passada de `FIS`.
- **Números só medidos.** Contei linhas e headings hoje: 7.891 linhas em 28 arquivos, 191 `RN` em 9
  famílias, 221 itens numerados com `PN` e `CAP`, 3 `RN` PROVISÓRIAS. As **74+ lacunas** entraram
  rotuladas como contagem **herdada dos relatórios**, não medida por mim — era o único número do brief
  que eu não conferi.
- **Listei `matriz-operacao-papel.md` no README como "em elaboração", sem link**, em vez de omiti-la ou
  linká-la. Omitir reproduz o defeito de navegação que três agents apontaram; linkar cria link morto.
AS DUAS RESPOSTAS QUE O BRIEF PEDIU:
- **O que o humano vai querer cortar e não deveria: a fila de pendências com prazo por documento**
  (`RN-EMI-028`). É o candidato natural a corte porque parece retaguarda administrativa, não tem
  superfície em nenhuma spec e não tem papel atribuído — ou seja, cortá-la parece **grátis**. É o corte
  mais caro do conjunto: a contingência **gera** pendência com prazo de horas e desfecho binário
  (inutilizar se não autorizado, cancelar se autorizado), e sem a fila `EMI` emite documento e não
  resolve o caso **mais comum** do ramo. Vice-campeão pelo mesmo motivo: a spec de `PER` — "é só
  impressora" até a contingência precisar imprimir detalhe e segunda via.
- **O que ele vai querer manter e deveria cortar: `ATI`.** Ele o nomeou no pedido, é o item mais visível
  do produto e o mais fácil de demonstrar. Mas é camada 2 sobre camada 2 (exige `PUB`, que tem 0 `RN`, e
  exige `PCF` para atender cliente-final), depende de **D-03** para saber quem é o interlocutor, tem a
  superfície não confiável mais larga do catálogo (conteúdo de conversa), `LACUNA-ATI-3`/`4` abertas e
  gate de `seguranca` declarado e **não cumprido**. E o argumento decisivo é de dependência, não de
  gosto: o valor de `ATI` **não decai** por vir depois, enquanto o valor de `EMI` e do núcleo decai — um
  é escolha do comerciante, o outro é obrigação legal e caixa que não pode parar. Vice-campeão: a Opção A
  da §5.3 (emissão própria no MVP 1) — ele vai querer manter, e talvez devesse ir para a Opção B; mas
  essa **é** dele, porque envolve a que cliente se vende.

RISCOS:
- **`roadmap-de-modulos.md` nasceu em 396 linhas.** O próximo acréscimo exige partir, e o eixo já é
  visível: **critério** (§1–§3) × **o corte proposto** (§4–§10) — os dois mudam por motivo diferente (o
  critério muda quando a regra muda; o corte muda a cada resposta do humano).
- **A linha do README sobre `matriz-operacao-papel.md` depende de outro agent**: se ele nomear o arquivo
  de outro jeito ou puser em outro lugar, a linha fica errada. É uma linha, e é do meu território —
  vale conferir no fechamento.
- **A §2.3 pode ser lida como promoção de capacidade.** Escrevi "classificação proposta" duas vezes e a
  pergunta 4 existe para isso, mas se alguém citar a tabela sem o cabeçalho, sete `CAP` parecem
  aprovadas como piso. Nenhuma está.
- **O roadmap propõe recusar dois itens que o humano nomeou no pedido** (`PCF`, `ATI`). Se ele mantiver
  os dois, o MVP 1 passa a arrastar `PUB` inteiro (0 `RN`) + gate de `seguranca` + `D-03` — e aí o corte
  de `EMI` para a Opção B deixa de ser opção e vira consequência.
- Fora de escopo, uma linha: `verticais/restaurante.md` está em **400** e `modulos/fiscal.md` em **399**.
  Qualquer resposta do humano que exija acrescentar linha nesses dois **exige partir** antes.
- Não reli o corpo das 191 `RN`. Onde citei uma (`RN-EMI-026`, `RN-OFF-006`, `RN-FIS-004`/`005`/`010`/
  `014`/`015`, `RN-RES-008`, `RN-OFF-008`), a citação vem dos relatórios desta ficha ou do trecho que li,
  não de uma releitura da regra inteira.
PERGUNTAS:
  - para humano: **confirma o MVP 1 da §4** — plataforma, `NUC`, `OFF`, autorização, `FIS`, `EMI` (bloco
    mínimo), `PER`, `MSA`, `COZ`, `RES` — e **confirma `PCF`/`ATI` no subsequente**, apesar de nomeados
    no pedido?
  - para humano: **Opção A (emissão própria no MVP 1) ou Opção B (MVP 1 sem ela, com as três reservas de
    modelo)?** Decidem: existe cliente-alvo que precisa emitir dentro do PDV já; o instrumento de
    custódia pode existir antes do primeiro cliente; a UF do caso base admite contingência off-line
    (`LACUNA-EMI-011`).
  - para humano: **`D-05`** — o catálogo de regra fiscal mora em `platform`, replicado por schema, ou em
    artefato versionado que acompanha o release? Sem isso `FIS` **não entra** na Fase 1.
  - para humano: confirma a **reclassificação de piso** da §2.3 item por item, em especial
    `CAP-PER-001` e `CAP-MSA-001`?
  - para humano: **`LACUNA-NUC-007`** — o fechamento de dia offline vai para o release **recusado** (é o
    que o produto diz hoje), ou vira passada própria de `produto` antes da Fase 1?
  - para humano: **`LACUNA-GLO-001`** — fuso do estabelecimento ou do cliente? A Fase 1 não modela tempo
    sem isso.
VERIFICAÇÃO:
- **Medido hoje (contagem de linhas e de heading por busca):** `docs/produto/` = 7.891 linhas em 28
  arquivos antes desta passada; 191 headings `RN-<COD>-<nnn>` (NUC 25 · EMI 41 · OFF 31 · FIS 20 · ATI 19
  · PCF 18 · MSA 14 · COZ 12 · RES 11 — soma exata 191); 20 `PN` + 10 `CAP`; 3 ocorrências de
  `PROVISÓRIA` em título de regra; `roadmap-de-modulos.md` = **396** linhas, `README.md` = **138**.
- **Conferido:** o README lista **28 entradas** — os 29 arquivos em disco de `docs/produto/` menos o
  próprio README (20 na raiz, 7 em `modulos/`, 1 em `verticais/`), conferidos contra glob, 1:1. A única
  linha sem arquivo é **declarada como tal** e sem link (`matriz-operacao-papel.md`, em "Em elaboração").
  Nenhum link do README aponta para arquivo ausente.
- **Conferido:** todas as 10 `CAP` têm `opt-in: sim` (busca por `opt-in:` — 10 linhas de entrada, zero
  "obrigatória por dependência"), logo a R1 não promove ninguém; os 7 `arcaico: sim` foram lidos um por
  um na busca.
- **Conferido:** dependências de ativação de `PCF` (exige `PUB` + destino `MSA`/`CMP`) e de `ATI` (exige
  `PUB`; para cliente-final, `PCF`) lidas em `catalogo-de-modulos.md` §4, não deduzidas. `PUB` e `PER`
  sem `RN`: verificado por ausência de família `PUB`/`PER` nos 191 headings.
- **Não medido, e rotulado como herdado no próprio arquivo:** as "74+ lacunas com dono", as linhas de
  `docs/arquitetura/` e `docs/design/`.
- **Não escrevi nenhuma data, prazo ou estimativa de esforço** — busca por "semana|mês|sprint|dias|
  estimativa" no roadmap: nenhuma ocorrência de estimativa temporal; as únicas datas são `2026-08-22`
  (data da medição, absoluta).
- Nenhuma tabela, coluna, DDL, rota, componente, bloco ou stack; `D-01` a `D-04` não presumidas e `D-05`
  tratada como **aberta**. Nenhum segredo. Nenhum número fiscal novo: toda afirmação fiscal do roadmap é
  citação de `RN`/`LACUNA` já existente. Não editei `matriz-operacao-papel.md`, `docs/design/**`,
  `memory/**`, nem qualquer arquivo de 12a/12b/12c. Não rodei teste: não há código nesta fase.
MEMÓRIA SUGERIDA:
  - type=convention escopo=plataforma slug=convention-ordem-de-construcao-nao-e-ordem-de-funcionamento —
    o produto é PDV geral desde o dia 0 e nenhuma vertical é pré-requisito de outra; a vertical de
    construção é **corpo de prova**. Três consequências auditáveis: módulo puxado por ela nasce
    cross-vertical, ordem de construção não vira ordem de venda, e nada no núcleo pode depender de um
    módulo do MVP existir · camada:produto
  - type=convention escopo=plataforma slug=convention-piso-antes-de-diferencial-no-corte-de-mvp —
    `CAP` com `opt-in: obrigatória por dependência` é piso por definição, e `CAP` com `arcaico: sim →
    PN-nn` é **candidata a piso** (a necessidade já é atendida hoje pelo mecanismo velho); MVP não recebe
    diferencial enquanto houver piso descoberto, exceção só item por item com o humano · camada:produto
  - type=decision escopo=plataforma slug=decision-d-05-catalogo-de-regra-fiscal-sem-casa — regra fiscal
    de abrangência maior que o cliente (alíquota de UF) não tem casa: `platform` viola "nenhuma tabela de
    cliente no platform", replicar em N schemas diverge em silêncio, e a terceira saída é artefato
    versionado que acompanha o release (perde restrição declarativa). **`FIS` não entra na Fase 1 antes
    de fechar** · camada:dados
  - type=gotcha escopo=modulo:fiscal slug=gotcha-grao-do-congelado-e-irrecuperavel — congelar por
    **venda** em vez de por `item × tributo × base × regime × redutor` torna segregação e decomposição
    irrecuperáveis para todo o histórico, e recompor é proibido (`RN-FIS-005`); o congelado precisa
    incluir os **insumos** e a **política de arredondamento com a ordem** · camada:produto
  - type=gotcha escopo=modulo:fiscal slug=gotcha-numeracao-e-mecanismo-de-alocacao-nao-coluna —
    numeração de documento é invariante de unicidade e sequência por estabelecimento **e** série;
    acrescentá-la depois exige unicidade retroativa em N schemas e renumerar é impossível (o número já
    está com o autorizador e com o cliente-final). Faixa pré-alocada por terminal e sequência densa
    diária são incompatíveis · camada:produto
  - type=state escopo=plataforma slug=state-mvp-1-proposto-aguardando-corte-do-humano — o corte proposto
    (`docs/produto/roadmap-de-modulos.md`) aguarda seis respostas do humano; **remover este registro**
    quando o corte for confirmado ou alterado · camada:produto
PRÓXIMO PASSO SUGERIDO: **humano** — as seis perguntas, em que a 2 (Opção A × B) e a 3 (`D-05`) mudam a
Fase 1 inteira. Depois delas, na ordem de dependência: (a) `produto` — spec de `PER` e fechamento de
`service_mode`/turno, que é o piso descoberto do MVP 1; (b) `produto` + humano + contador — grão do
congelado e arredondamento, **antes** de `arquiteto-dados` abrir a Fase 1; (c) `seguranca` — gate
agendado sobre `PCF`/`ATI`, que hoje está declarado e não cumprido.

## Fechamento — orquestrador — 2026-08-23

**Resultado:** ficha **fechada**. Entregou o que o pedido pediu: quais módulos existem, o que entra no
MVP, o que vem depois, e o tributário tratado como dado com vigência em vez de constante no código.

### Definição de pronto, item por item (`processo.md` §2)

1. **Regra de negócio em `docs/produto/**`, numerada, com critério de aceite — CUMPRIDO.** Toda regra
   desta ficha nasceu numerada `RN-<COD>-<nnn>` com critério de aceite e caminho infeliz. "o código cita
   esse número" **não se aplica: não existe código** — nenhuma linha de produto, nenhuma DDL. A citação
   passa a ser exigida do primeiro agent que implementar.
2. **Teste do critério de aceite — não se aplica:** camada de spec, sem comportamento executável. O
   critério de aceite fica escrito na regra e vira teste na fase que a implementar.
3. **DDL / checklist de `migrations.md` §10 / gate 2 — não se aplica:** nenhum arquivo em `db/`, nenhum
   DDL. O plano já o declarou **agendado** para a Fase 1, e o passo 5 foi consulta de viabilidade ao
   `arquiteto-dados`, não o gate. **Agendamento mantido, com dois bloqueios de entrada nomeados:** D-04
   e a decisão proposta como `D-05`.
4. **Endpoint / gate 3 — não se aplica:** nenhuma rota. Fica **agendado, e declarado não cumprido**,
   para `PCF` e `ATI` (canal externo e dado de pessoa) — está na lista de resíduos abaixo, com dono.
5. **Gate 4 (`performance`) — não se aplica:** nada nesta ficha é consulta, lista, relatório ou tela.
6. **Decisão não óbvia virou registro em `memory/`, com linha de índice — CUMPRIDO.** Ver a seção de
   memória abaixo; toda linha de índice entrou na mesma passada.
7. **Nenhum segredo — CONFERIDO.** Nenhum certificado, chave, token, CNPJ real ou URL com credencial em
   `docs/`. A custódia de credencial é especificada como capacidade; nenhum material vive no repo.
8. **Toda `MEMÓRIA SUGERIDA` avaliada — CUMPRIDO.** Escrita, fundida ou recusada com motivo, abaixo.

### Memória escrita a partir desta ficha

- `plataforma/decision-emissao-fiscal-propria` — a decisão do humano com as **quatro obrigações
  permanentes** que ela compra, que é o que nenhum doc reúne num lugar só.
- `plataforma/decision-d-05-catalogo-de-regra-fiscal-sem-casa` — as três saídas e o defeito de cada
  uma; escrito **antes** de a decisão existir, porque é ele que faz o `arquiteto-dados` emitir
  `BLOQUEIO` em vez de escolher uma para destravar.
- `plataforma/gotcha-fuso-do-estabelecimento-versus-fuso-do-cliente` — regra aprovada contra regra
  aprovada, invisível com um estabelecimento e fatal com dois.
- `plataforma/convention-piso-antes-de-diferencial-no-corte-de-mvp` — o critério que descobriu o piso
  de `PER`.
- `modulos/fis/gotcha-grao-do-congelado-e-irrecuperavel` e
  `modulos/emi/gotcha-numeracao-fiscal-e-mecanismo-de-alocacao` — os dois pontos em que a Fase 1 não
  tem segunda chance. Criei os dois primeiros diretórios de módulo do grafo (`fis`, `emi`) com `INDEX.md`
  próprio, e a linha de cada um em `modulos/INDEX.md`.

**Fundido em registro existente, em vez de duplicado:**
- `convention-ordem-de-construcao-nao-e-ordem-de-funcionamento` → virou o corolário de
  `decision-forja-e-pdv-modular` (mesma tese, e um registro novo dividiria a resposta em dois).
- `convention-postura-nova-geracao-e-criterio-de-recusa` (sugerido duas vezes) → virou a cláusula "os
  `PN-nn` são critério citável por número" em `convention-necessidade-antes-de-mecanismo`.
- **Correção de deriva no mesmo registro:** ele citava `capacidades-de-nova-geracao.md` / `CN-nn`, que
  **não existem em disco**. O artefato é `docs/produto/catalogo-de-capacidades.md`, numeração
  `CAP-<COD_MODULO>-<nnn>`. Corrigido e datado.

**Recusado, com motivo.** Esta ficha sugeriu ~80 registros; a grande maioria é **enunciado de regra de
negócio que agora vive numerado, indexado e citável em `docs/produto/**`** — registrá-la em `memory/`
seria o derivável que `memoria.md` §8 proíbe, e criaria duas fontes para a mesma regra, com a segunda
envelhecendo em silêncio. Não recusei o conteúdo: recusei a **cópia**. Nominalmente, os grupos:

- **regra de módulo/vertical já numerada** (`rule-*` de `MSA`, `COZ`, `FIS`, `EMI`, `PCF`, `ATI`, `RES`
  — ~35 sugestões): derivável da spec, que é autoridade e tem critério de aceite. O que memória guarda
  desses módulos é só o que a spec **não** deriva — foi o caso dos dois `gotcha` de `FIS`/`EMI`.
- **decisões de organização de arquivo** (`decision-fiscal-partido-em-tres-modulos`,
  `decision-catalogo-de-modulos-e-receita-em-arquivos-separados`, `spec-de-modulo-parte-por-eixo-nao-por-tamanho`,
  `decision-estados-em-dois-arquivos`): derivável da árvore de `docs/` e do `README.md` dela. Estrutura
  de pasta é explicitamente o exemplo de derivável em `memoria.md` §8.
- **`convention-codigo-de-modulo-e-numeracao-de-regra`**: é o §4 do glossário, que é a autoridade única
  e já se declara imutável. Duplicar convenção de numeração é como numeração divergente nasce.
- **`state-tensao-pn-01-versus-pn-13`, `state-nucleo-sem-regra-numerada`,
  `state-mvp-1-proposto-aguardando-corte-do-humano`**: `state` de trabalho **concluído** sai
  (`memoria.md` §8). A tensão `PN-01`×`PN-13` foi resolvida na T-0003; o núcleo tem regra numerada
  (`RN-NUC-001`..`040`); o corte do MVP virou linha de `state-pendencias-abertas-2026-08-23`, com o
  dono, que é o humano.
- **`reference-lacunas-fiscais-do-ramo`, `reference-dossies-iva-ibs-cbs-2026-08-22`**: fundidos na
  entrada de `docs/arquitetura/fiscal/` de `reference-dossies-de-decisao-de-arquitetura` — um ponteiro,
  não três.
- **`gotcha-fronteira-de-cumprimento-de-pedido`**: **respondida dentro da própria ficha** (a consolidação
  12c concluiu que `CMP` sobrevive e a receita da vertical estava errada). Registro de dúvida já
  resolvida mente sobre o estado do repositório.
- **`gotcha-sancao-versus-rejeicao-de-documento-sem-ibs-cbs`, `gotcha-ambiguidade-da-regra-de-validacao-ibs-cbs`,
  `gotcha-layout-fiscal-tem-tres-cadencias`, `gotcha-contingencia-e-rotina-de-pico`**: são leitura de
  legislação e de nota técnica, com URL oficial, e o lugar disso é o dossiê — memória de modelo sobre
  fisco é exatamente o que `produto.md` proíbe afirmar. O ponteiro existe (acima).
- **`decision-pedido-mutavel-venda-imutavel`, `decision-vertical-e-receita-nao-codigo`,
  `convention-escopo-cliente-sem-instancia`, `decision-forja-emite-so-para-cliente-proprio`,
  `decision-nucleo-nao-produz-capacidade`, `convention-capacidade-vs-postura`,
  `convention-mecanismo-nao-entra-no-nome`, `convention-metodo-de-busca-de-capacidade`,
  `gotcha-capacidade-que-cria-mais-trabalho`, `gotcha-vocabulario-de-producao-preso-ao-ramo`,
  `decision-producao-e-lexico-de-modulo-nao-de-ramo`, `decision-mesa-e-comanda-um-modulo-so`,
  `decision-reapresentacao-marcada-em-vez-de-suprimida`, `decision-visao-do-canal-e-da-propria-sessao`,
  `decision-emi-habilitado-por-tipo-de-documento`, `gotcha-identidade-de-idempotencia-nasce-no-terminal`,
  e as seis linhas soltas da consolidação 12a**: cada uma é conclusão que a spec ou o glossário já
  carrega no lugar onde a pergunta é feita. Somadas, dobrariam o índice de plataforma — que é lido em
  **toda** tarefa — para responder perguntas que só aparecem dentro de um módulo.
- **`convention-dado-de-pessoa-nasce-com-prazo-declarado`, `gotcha-texto-de-terceiro-nao-e-instrucao`,
  `injecao-indireta-por-campo-de-texto-legitimo`, `escopo-de-sessao-externa-em-canal-lateral`,
  `fora-de-escopo-responde-como-inexistente`, `escopo-reavaliado-na-confirmacao`**: recusados **por
  ora, e não por mérito** — são de `PCF`/`ATI`, cujo gate de `seguranca` está agendado e **não
  cumprido**. Escrevê-los agora fixaria como conhecimento o que a auditoria ainda vai revisar. Voltam
  quando o gate rodar; ficam nomeados aqui para não se perderem.
- **`reference-requisitos-de-identidade-para-d-03`**: consumido — os requisitos entraram no dossiê de
  D-03, que é onde se lê a decisão.

### O que fica aberto, com dono

| O que | Dono | Nota |
|---|---|---|
| Confirmar ou alterar o **corte do MVP 1** | **humano** | proposta em `docs/produto/roadmap-de-modulos.md`; o roadmap responde duas coisas contra a intuição: **não** corte a fila de pendências, **corte** `ATI` |
| **`D-05`** — onde mora o catálogo de regra fiscal, **e pôr a linha na tabela do `CLAUDE.md` §8** | **humano** | trava `FIS`, que é camada 1 de tudo que documenta venda |
| **Fuso do estabelecimento × do cliente** | **humano** | resolver mexe em `.claude/rules/dados.md`, território dele |
| **Grão do congelado e política de arredondamento** | `produto` + humano + contador | **antes** de o `arquiteto-dados` abrir a Fase 1 |
| Gate de `seguranca` sobre **`PCF`/`ATI`** | `seguranca` | agendado e **não cumprido**; libera as 6 memórias retidas acima |
| `RN-ATI-017` (agregação) e `RN-ATI-015` (derivados de conversa) sem lista enumerada | `produto` | os próprios relatórios os deixaram abertos por honestidade |
| Três arquivos no teto ou a uma linha dele — `verticais/restaurante.md` (400), `fiscal-custodia-e-trilha.md` (400), `modulos/fiscal.md` (399) | `produto` | medido por `wc -l` em 2026-08-23; o próximo acréscimo em qualquer dos três exige partir por **eixo**, não por tamanho |
| Colisão de identificador: achados usam `AUT-nn` porque `C-nn` já são **cenários** de offline | — | **resolvida** nesta sessão, registrada aqui para não voltar |

**Medido em disco em 2026-08-23, ao fechar** (contagem por busca, não estimativa): 57 arquivos `.md` em
`docs/`, 39 deles em `docs/produto/`, **16.420** linhas somadas, **241** identificadores
`RN-<MOD>-<nnn>` distintos e **110** `LACUNA-<MOD>-<nnn>` distintos citados. Nenhum arquivo acima de
400 linhas. A contagem é de identificadores **citados**, não de definições.

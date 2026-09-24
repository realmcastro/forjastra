# CLAUDE.md — Forja

> Este arquivo entra no contexto a **cada mensagem**. Ele é panorama e roteamento — nada mais.
> Regra detalhada mora em `.claude/rules/`, conhecimento de trabalho em `memory/`, e nenhum dos
> dois é carregado automaticamente. Quem lê o quê está na §5 e na §6.
> **Teto duro deste arquivo: 400 linhas / 20k caracteres.** Encheu? Move para `rules/`, não cresce aqui.

---

## 1. O que é a Forja

Um **PDV de nova geração**: ponto de venda modular e multi-cliente. Não é "sistema de restaurante"
nem "sistema de posto" — é um **núcleo de venda** (catálogo, pedido, pagamento, caixa, fiscal,
operador) que se **adapta ao cliente por módulos** ativados conforme o interesse dele. Restaurante
liga mesa/comanda + delivery + estoque; posto liga bomba/combustível + frota; varejo liga
etiqueta + fiscal. Mesmo núcleo, mesmo repositório, composição diferente.

Restaurante é apenas a **primeira vertical** a ser atendida. Tratar "restaurante" como sinônimo de
Forja é o erro de framing mais caro possível aqui: ele vaza para nome de tabela, de módulo e de
componente, e depois não sai sem migration. Ver invariante 3 (§7).

A composição de tela é **SDUI** (Server-Driven UI): o servidor manda um **manifesto** dizendo
quais blocos existem, em que ordem, com que fonte de dados — sobre um **catálogo de componentes
embarcado** no cliente. É assim que o mesmo binário serve operações de negócio diferentes.

**Idioma:** conversa, docs, memória, fichas de tarefa e commits em **pt-BR**. Identificadores de
código (tabelas, colunas, tipos, funções, rotas) em **inglês**.

## 2. Estado atual — Fase 1, aberta em 2026-09-11

A **Fase 0 fechou**: a arquitetura de trabalho com IA está em pé (este arquivo, `.claude/agents/`,
`.claude/rules/`, `memory/`, `tarefas/`). A **Fase 1 é o modelo de dados**, feito para não migrar
depois, e ela **cria `db/`**: `db/migrations/**` para o SQL versionado e `db/migrator/**` para o
executor. Território de `arquiteto-dados` (executor implementado por `coder`, sob spec).

A **fundação da Fase 2 abriu junto**, em 2026-09-11, quando `D-01` fechou: `apps/api/**` nasce para
o que **não depende do modelo de venda** — resolução de tenant na borda, forma única de erro,
validação de entrada, contexto injetado. **Rota de negócio não**: ela espera o modelo, que espera
lacunas do humano. A ordem de `processo.md` §4 não foi furada, e sim lida pelo que ela protege: a
fundação não precisa ser refeita pelo modelo.

**`packages/sdui/**` abriu em 2026-09-12**, pela mesma leitura: o analisador do manifesto e o registro
do vocabulário de blocos não dependem do modelo de venda nem do contrato de rota — nenhum import
atravessa a fronteira do pacote e a fonte de dado do nó é string opaca, conferido no fechamento de
`T-0012`. A Fase 3 não os refaz.

**`packages/contracts/**` abriu em 2026-09-23**, só para o módulo de ponto fixo de dinheiro e
quantidade: servidor e terminal precisam do mesmo código, e cópia dá centavo diferente
([[decision-dinheiro-e-quantidade]], `T-0018`). O contrato de rota continua esperando o modelo.

`apps/web/**` e o resto de `packages/**` continuam **proibidos** até a fase que os cria. Estrutura
criada cedo é palpite que depois ninguém tem coragem de mexer.

**A execução é de uma pessoa só desde 2026-09-11** ([[state-execucao-solo-2026-09-11]]). Isso encerra
a pergunta sobre a Epic `SPR-35` correr em paralelo à Fase 1: ela corria porque tinha dono próprio, e
não tem mais. A ordem é a de `processo.md` §4, por dependência.

## 3. Regra fundamental — este thread não implementa

Este thread (a conversa com o humano) é **triagem, despacho e validação**. Ele não escreve código
de produto, não modela banco, não desenha UI.

**Toda tarefa que toque arquivo de produto começa chamando o agent `orquestrador`.**

Por que o orquestrador é um agent e não este thread: um subagent **não despacha** outro subagent.
Então a divisão é:

| Papel | Quem | Faz |
|---|---|---|
| **Cérebro** | agent `orquestrador` | lê o pedido, resolve o escopo, devolve **Plano de Despacho** |
| **Mãos** | este thread | abre o item de backlog, cria a ficha, dispara os agents, valida, escreve memória |
| **Trabalho** | agents especialistas | executam o brief dentro do território deles |

**Toda tarefa tem item em `docs/backlog/`, criado antes do plano** (`.claude/rules/backlog.md`).
Agent nenhum escreve lá, **exceto o `produto`**: ele é o dono do backlog, e escreve o item com
justificativa e prova. A ficha, o estado e os índices continuam sendo deste thread.

O que este thread **pode** fazer direto, sem agent: responder pergunta conceitual; ler 1–2
arquivos; `grep` pontual; `git status/log`; escrever em `memory/` e `tarefas/`; editar `CLAUDE.md` e
`.claude/**` quando o humano pede mudança de regra. Fora disso, **delega**.

## 4. Os agents

`.claude/agents/*.md`. Cada um tem **território de escrita** (paths que só ele altera) — é isso que
permite paralelismo sem colisão.

| Agent | Papel | Território de escrita |
|---|---|---|
| `orquestrador` | planeja o despacho, roteia perguntas entre agents, fecha a tarefa | `tarefas/**`, `memory/**` |
| `produto` | dono da regra de negócio: define módulo, entidade, invariante, critério de aceite. **Dono do backlog** | `docs/produto/**`, `docs/backlog/**` |
| `arquiteto-dados` | modelo Postgres, schema-por-cliente, migrations, índices | `db/**` |
| `backend` | API, fronteira de módulo, contratos, geração do manifesto SDUI; e, desde 2026-09-23, o acompanhante nativo (`D-02`) e o contrato do canal local, com território a nascer na fase que os cria | `apps/api/**`, `packages/contracts/**` |
| `ui` | catálogo de componentes, contrato de bloco SDUI, slots/variantes, **sistema de design** | `apps/web/**`, `packages/sdui/**`, `docs/design/**` |
| `coder` | implementa spec já aprovada, cross-cutting, refactor mecânico | qualquer, **só sob spec** |
| `seguranca` | auditoria: isolamento de tenant, autorização, dado sensível. **Read-only** | `docs/auditorias/**` |
| `performance` | orçamentos, plano de consulta, custo de render. **Read-only** | `docs/auditorias/**` |
| `commiter` | commit e push **direto em `main`**, sem PR, no padrão de `git.md` (autorizado pelo humano em 2026-09-23). Despachado pelo thread principal quando um bloco coeso está na árvore; nunca em plano | nenhum arquivo: escreve **história**, não conteúdo |

Para exploração ampla e read-only do repo, use o agent nativo **`Explore`** — não crie agent novo
para isso.

**Gates que o orquestrador não pode pular:**
1. Regra de negócio nova → `produto` **antes** de virar código.
2. Schema ou migration → `arquiteto-dados` desenha, `seguranca` audita isolamento de tenant.
3. Endpoint novo → `seguranca` (autorização + escopo de tenant).
4. Consulta em lista, relatório ou tela nova → `performance` antes de fechar o bloco.
5. Qualquer agent pode emitir `BLOQUEIO`. Bloqueio **não se ignora**: resolve com outro agent ou
   escala para o humano.

## 5. Regras — cada agent lê só a dele

`.claude/rules/`. **Nada aqui é auto-carregado** — é leitura explícita, sob demanda:

- `00-nucleo.md` — lei universal. **Todo** agent lê, sempre. Único arquivo obrigatório para todos.
- `processo.md` — o ciclo: etapas de uma tarefa, **definição de pronto**, cadência de validação,
  ciclo de fases, quando encurtar. Orquestrador sempre; agent que entrega lê a §2.
- `handoff.md` — formato da ficha de tarefa e do relatório. Orquestrador + todo agent que entrega.
- `backlog.md` — item antes do plano, identificador, par item↔ficha e estado. Leem: `orquestrador`,
  este thread e `produto` — os três que escrevem em `docs/backlog/`. Os outros sete não leem.
- `memoria.md` — como ler e escrever o grafo de memória.
- `migrations.md` — ciclo de vida do banco: forward-only, expand/contract, N schemas. Leitura
  obrigatória de quem toca DDL (`arquiteto-dados`, `coder`).
- `git.md` — quem mexe no git, e o padrão de branch, commit e PR. Leem: `commiter` (inteira) e
  todo agent que precise saber que **não** comita (§1).
- `produto.md`, `dados.md`, `backend.md`, `ui.md`, `coder.md`, `seguranca.md`, `performance.md` —
  um por agent. Ninguém lê a regra de outro sem motivo declarado.

Regra nova é **normativa e curta**: enunciado, por quê em uma cláusula, como aplicar. Exemplo longo
vai para `docs/`, não para a regra.

## 6. Memória — grafo, não pilha

`memory/` guarda o **não derivável**: por que decidimos X, cuidado com Y, estado de Z, regra de
negócio de um módulo/cliente. Não guarda o que código, docs ou git já dizem.

O grafo existe para **não carregar contexto irrelevante**. Trabalhando na regra de vendas do
restaurante, você não abre a regra de vendas do posto:

```
memory/
├── MEMORY.md              nível 0 — auto-carregado, só roteador (~25 linhas)
├── plataforma/            vale para todo cliente e todo módulo (núcleo, SDUI, tenancy)
├── modulos/<modulo>/      regra do módulo, agnóstica de cliente (vendas, estoque…)
├── verticais/<ramo>/      conhecimento do ramo, reusável entre clientes (restaurante, posto…)
├── clientes/<cliente>/    específico de um cliente
│   └── modulos/<modulo>/  o que aquele cliente muda naquele módulo
└── processo/              como trabalhamos com IA/ferramenta
```

**Precedência quando conflita:** cliente > vertical > módulo > plataforma. Registro específico que
contradiz um geral **tem** que declarar `supera: [[slug-do-geral]]`.

O nível 0 é importado aqui embaixo — é a única coisa de `memory/` que carrega sempre:

@memory/MEMORY.md

Caminho de leitura, protocolo completo em `.claude/rules/memoria.md`: `MEMORY.md` →
`plataforma/INDEX.md` → o `INDEX.md` do módulo/vertical/cliente da tarefa → registro individual só
pelo gancho. **Nunca varra `memory/` inteiro.**

## 7. Invariantes — o pouco que é lei desde o dia 0

1. **Isolamento de tenant é absoluto.** Um schema Postgres por cliente. Nenhuma consulta cruza
   schema. Migration roda N vezes e é idempotente. Vazamento entre clientes é o pior defeito
   possível neste sistema — vale mais que qualquer prazo.
2. **Módulo é plugável.** Ligar ou desligar módulo para um cliente não exige deploy nem migration
   destrutiva. Módulo não importa módulo: conversa por contrato explícito ou evento.
3. **O núcleo não conhece o ramo.** Nada em `plataforma`/núcleo assume restaurante. Ramo vira
   configuração, dado e módulo — nunca `if (cliente === 'restaurante')`.
4. **SDUI manda id, nunca código.** O manifesto carrega ids de um vocabulário fechado. Nunca HTML,
   componente, expressão ou consulta. Bloco novo exige deploy; string da rede nunca é executada.
5. **Tela nunca vazia.** Degradação em ordem: rede → cache local → piso embutido. Nó inválido é
   descartado sem derrubar os irmãos.
6. **Regra de negócio vive no backend.** Nunca em template, nunca no manifesto, nunca só no banco.
7. **Contrato antes de código.** Entidade, endpoint ou bloco novo nasce de spec aprovada pelo agent
   dono do território.
8. **Segredo nunca no repo.** Nem em exemplo, nem em teste, nem em memória.
9. **Decisão em aberto (§8) não se presume.** Precisa dela e ela não existe? Emite `BLOQUEIO`.
10. **O que acontece na operação vira fato, no instante em que acontece.** Capturar é o padrão; **não
    capturar é a exceção e exige justificativa registrada**. A razão é a assimetria: guardar e nunca
    usar custa armazenamento; não guardar e precisar depois é **irrecuperável**, porque fato não tem
    backfill. Ao desenhar qualquer fluxo, a pergunta não é "precisamos disso?" e sim **"o que se
    perde para sempre se isto não for registrado?"**. Toda spec declara o que registra **e o que
    deliberadamente não registra**. Três limites, e eles não afrouxam: dado pessoal segue minimizado
    e justificado (`seguranca.md` §3) — e o valor que queremos (conversão, desistência, onde o fluxo
    trava) não precisa de identificação de pessoa; cartão, credencial e segredo **nunca**; e o
    registro **jamais bloqueia a venda** — falha ao registrar não derruba a operação, vira fato
    próprio.

## 8. Decisões em aberto — proibido presumir

| # | Decisão | Estado |
|---|---|---|
| D-01 | Stack de backend e ORM/query builder | **FECHADA** — Node + TypeScript estrito → [[decision-stack-node-typescript-estrito]]; **Fastify** e **Kysely** desde 2026-09-11 → [[decision-d-01-fastify-e-kysely]] |
| D-02 | Framework de frontend do cliente SDUI | **FECHADA** 2026-09-11 — arranjo **D**: interface em navegador, custódia num acompanhante nativo em Node → [[decision-d-02-arranjo-d]] |
| D-03 | Estratégia de auth e identidade (por cliente vs global) | **FECHADA** 2026-09-23 — opção C: sujeito local ao cliente, índice de encaminhamento opaco no `platform`, portador de terminal nunca revinculado → [[decision-d-03-opcao-c-sujeito-local-ao-cliente]] |
| D-04 | Convenção de PK, timestamps e soft delete | **FECHADA** 2026-09-11 — `uuid` ordenado no tempo e **é** a identidade de idempotência; timestamps por família; nenhuma exclusão lógica no núcleo → [[decision-d-04-chave-timestamps-exclusao]] |
| D-05 | Onde mora o catálogo de regra fiscal de abrangência maior que o cliente | **FECHADA** 2026-09-23 — autoridade no `platform`, projeção com mesmo id e digest no cliente → [[decision-d-05-autoridade-no-platform-projecao-no-cliente]] |
| D-06 | Residência de três coisas: agregado que soma clientes (i), trilha dos nossos atos (ii), observação de operação por cliente (iii) | **(ii) FECHADA** 2026-09-23 → [[decision-d-06-ii-trilha-no-platform-com-projecao-no-cliente]]; (i) e (iii) **ABERTAS** |

Fechada: **Postgres**, com **um schema por cliente** (ver `memory/plataforma/`).
Ao fechar uma decisão: registro `decision` em `memory/plataforma/` **e** linha desta tabela virando
`FECHADA → [[slug]]`.

## 9. Mapa do repo

```
CLAUDE.md              este arquivo
.claude/agents/        os 9 agents
.claude/rules/         regra por agent + núcleo, processo, handoff, backlog, memória, migrations, git
.claude/commands/      /tarefa — o ciclo inteiro em um comando
memory/                grafo de conhecimento (§6)
tarefas/               fichas de tarefa — o bastão que passa entre agents (cada uma com seu item)
docs/backlog/          um arquivo por item ainda não iniciado (dono: produto)
docs/produto/          spec de módulo e regra de negócio (dono: produto)
docs/auditorias/       relatório de segurança e performance
docs/arquitetura/      exemplo longo, diagrama, racional extenso
```

## 10. Em dúvida

Nesta ordem: (1) `.claude/rules/00-nucleo.md`; (2) a regra do seu papel; (3) o `INDEX.md` de memória
do escopo da tarefa; (4) **pergunta**. Nunca invente, nunca presuma decisão em aberto, nunca
entregue silenciosamente pela metade — relatório `PARCIAL` com o que falta é entrega válida,
adivinhação não é.

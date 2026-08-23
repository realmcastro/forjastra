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

## 2. Estado atual — Fase 0

Não existe código de produto ainda. **De propósito.** A Fase 0 entrega só a arquitetura de
trabalho com IA (este arquivo, `.claude/agents/`, `.claude/rules/`, `memory/`, `tarefas/`).
Fase 1 é o **modelo de dados** — feito para não migrar depois. Só então backend, e só então UI.

Não invente estrutura de código (`apps/`, `packages/`, `src/`) antes da fase que a cria.

## 3. Regra fundamental — este thread não implementa

Este thread (a conversa com o humano) é **triagem, despacho e validação**. Ele não escreve código
de produto, não modela banco, não desenha UI.

**Toda tarefa que toque arquivo de produto começa chamando o agent `orquestrador`.**

Por que o orquestrador é um agent e não este thread: um subagent **não despacha** outro subagent.
Então a divisão é:

| Papel | Quem | Faz |
|---|---|---|
| **Cérebro** | agent `orquestrador` | lê o pedido, resolve o escopo, devolve **Plano de Despacho** |
| **Mãos** | este thread | cria a ficha, dispara os agents na ordem, valida, escreve memória |
| **Trabalho** | agents especialistas | executam o brief dentro do território deles |

O que este thread **pode** fazer direto, sem agent: responder pergunta conceitual; ler 1–2
arquivos; `grep` pontual; `git status/log`; escrever em `memory/` e `tarefas/`; editar `CLAUDE.md`
e `.claude/**` quando o humano pede mudança de regra. Fora disso, **delega**.

## 4. Os agents

`.claude/agents/*.md`. Cada um tem **território de escrita** (paths que só ele altera) — é isso que
permite paralelismo sem colisão.

| Agent | Papel | Território de escrita |
|---|---|---|
| `orquestrador` | planeja o despacho, roteia perguntas entre agents, fecha a tarefa | `tarefas/**`, `memory/**` |
| `produto` | dono da regra de negócio: define módulo, entidade, invariante, critério de aceite | `docs/produto/**` |
| `arquiteto-dados` | modelo Postgres, schema-por-cliente, migrations, índices | `db/**` |
| `backend` | API, fronteira de módulo, contratos, geração do manifesto SDUI | `apps/api/**`, `packages/contracts/**` |
| `ui` | catálogo de componentes, contrato de bloco SDUI, slots/variantes, **sistema de design** | `apps/web/**`, `packages/sdui/**`, `docs/design/**` |
| `coder` | implementa spec já aprovada, cross-cutting, refactor mecânico | qualquer, **só sob spec** |
| `seguranca` | auditoria: isolamento de tenant, autorização, dado sensível. **Read-only** | `docs/auditorias/**` |
| `performance` | orçamentos, plano de consulta, custo de render. **Read-only** | `docs/auditorias/**` |

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
- `memoria.md` — como ler e escrever o grafo de memória.
- `migrations.md` — ciclo de vida do banco: forward-only, expand/contract, N schemas. Leitura
  obrigatória de quem toca DDL (`arquiteto-dados`, `coder`).
- `git.md` — branch, commit, entrega.
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

## 8. Decisões em aberto — proibido presumir

| # | Decisão | Estado |
|---|---|---|
| D-01 | Stack de backend e ORM/query builder | **ABERTA** — a discutir com o humano |
| D-02 | Framework de frontend do cliente SDUI | **ABERTA** — regra de UI nasce agnóstica |
| D-03 | Estratégia de auth e identidade (por cliente vs global) | **ABERTA** |
| D-04 | Convenção de PK, timestamps e soft delete | **ABERTA** — proposta do `arquiteto-dados`, Fase 1 |

Fechada: **Postgres**, com **um schema por cliente** (ver `memory/plataforma/`).
Ao fechar uma decisão: registro `decision` em `memory/plataforma/` **e** linha desta tabela virando
`FECHADA → [[slug]]`.

## 9. Mapa do repo

```
CLAUDE.md              este arquivo
.claude/agents/        os 8 agents
.claude/rules/         regra por agent + núcleo, processo, handoff, memória, migrations, git
.claude/commands/      /tarefa — o ciclo inteiro em um comando
memory/                grafo de conhecimento (§6)
tarefas/               fichas de tarefa — o bastão que passa entre agents
docs/produto/          spec de módulo e regra de negócio (dono: produto)
docs/auditorias/       relatório de segurança e performance
docs/arquitetura/      exemplo longo, diagrama, racional extenso
```

## 10. Em dúvida

Nesta ordem: (1) `.claude/rules/00-nucleo.md`; (2) a regra do seu papel; (3) o `INDEX.md` de memória
do escopo da tarefa; (4) **pergunta**. Nunca invente, nunca presuma decisão em aberto, nunca
entregue silenciosamente pela metade — relatório `PARCIAL` com o que falta é entrega válida,
adivinhação não é.

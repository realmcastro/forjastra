---
name: decision-stack-node-typescript-estrito
description: linguagem de D-01 fechada em 2026-08-26 — Node no servidor e TypeScript estrito nos dois lados; fecha porque exaustividade do compilador cobre R-10/R-11 e o núcleo do cliente deixa de existir em duas linguagens; ORM/query builder e framework HTTP seguem abertos
type: decision
escopo: plataforma
camada: backend
data: 2026-08-26
relaciona: [[reference-dossies-de-decisao-de-arquitetura]], [[state-d-02-arranjo-b-ou-d]], [[decision-tenancy-schema-por-cliente]]
---

**Node** no servidor, **TypeScript estrito nos dois lados**. Decidido pelo humano em 2026-08-26, já
conversado com o sócio. Fecha a **metade "linguagem"** de D-01. Seguem **abertos**: ORM/query builder
e framework HTTP (recomendação minha para o segundo: **Fastify** — validação de schema na borda,
`backend.md` §3, e hook por requisição para resolver tenant uma vez, `backend.md` §1; **não fechado**).

**Por quê:** dois motivos, e o segundo é o caro.

1. **R-10 e R-11 param de depender de disciplina.** O produto é feito de enumeração fechada — quatro
   classes de convergência, três domínios de falha, estados do documento fiscal, os sete itens que a
   fila nunca contém, vocabulário de blocos SDUI — e `RN-OFF-008` manda o default ser falha fechado.
   União discriminada com `never` no braço impossível faz o compilador emitir erro quando alguém
   acrescenta um caso e esquece um lugar. Falha fechado passa a ser **garantido**, não lembrado.
2. **O núcleo do cliente deixa de existir em duas linguagens.** Fila, cunhagem de identidade offline,
   faixa pré-alocada, repouso confidencial, trilha do ato, máquina de drenagem (R-01…R-09) é o
   software mais difícil do sistema. Uma linguagem só torna `packages/contracts` e `packages/sdui`
   **um tipo** e põe as regras de convergência em **um** lugar. Divergência entre duas
   implementações da mesma regra aparece como venda duplicada ou fila que não drena.

**Recusado:** **.NET/C#** — unificava servidor e terminal Windows com decimal nativo, mas a escolha
feita unifica **mais** (servidor, terminal, móvel, dispositivo do cliente-final, retaguarda), e a
fronteira nativa de E1 se paga nos dois. **Rust** fica como teto teórico (um artefato para os três
alvos e o servidor), recusado por velocidade de equipe e contratação, não por mérito técnico.

**O preço assumido, e ele é nomeado:**
- **R-08 / `RN-OFF-031` é o risco número um.** Drenagem que não compete com o caixa — prioridade
  cedível, cancelamento na fronteira de agregado, sem perder progresso — não vem de graça num laço de
  eventos único: é `worker_threads` ou processo separado, com cancelamento desenhado à mão em cada
  fronteira. **Exige prova medida antes da Fase 2**, com a fila no teto e drenando.
- **SQL-primeiro é escolha contra a gravidade do ecossistema.** R-14 exige executor de migration
  nosso e ledger por `(schema, version)`. O caminho natural aqui é ORM com motor próprio, que R-14
  obriga a desligar. O risco é ele entrar por inércia.
- **Dinheiro sem tipo nativo** (`dados.md` §3): a proibição de ponto flutuante vira vigilância de
  revisão em cada conversão, inclusive na serialização do contrato.
- **Runtime a operar no servidor** — não há binário estático único; reprodutibilidade de instalação
  (`PN-19`) é trabalho declarado.

**Como aplicar:** contrato e fluxo podem ser projetados em TypeScript estrito desde já; implementação
acoplada a framework HTTP ou a ORM **continua sendo `BLOQUEIO`** (`backend.md`, `dados.md`), porque a
metade que falta de D-01 é justamente essa. DDL da Fase 1 permanece SQL puro e versionado, agnóstico.

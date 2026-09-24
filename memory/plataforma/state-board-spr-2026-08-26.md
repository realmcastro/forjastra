---
name: state-board-spr-2026-08-26
description: mapa do board SPR em 2026-08-26 — 54 issues, duas Epics novas (SPR-34 Fase 1/servidor, SPR-35 arranjo do cliente) com 17 filhas, 33 de backlog anterior já respondidas, Bloco A de edições aplicado integralmente e 11 cards com rótulo bloqueada esperando decisão do humano
type: state
escopo: plataforma
camada: processo
data: 2026-08-26
atualizado: 2026-08-27 (T-0008 — as 52 issues reescritas de novo contra o esqueleto de duas formas)
relaciona: [[reference-jira-projeto-spr]], [[decision-stack-node-typescript-estrito]], [[state-d-02-arranjo-b-ou-d]], [[gotcha-board-spr-e-nomeado-pela-vertical]], [[gotcha-o-titulo-nao-e-o-card]], [[state-pendencias-abertas-2026-08-23]], [[gotcha-comentario-de-preservacao-perde-conteudo-na-conversao-adf]], [[gotcha-julgar-o-proprio-texto-nao-pega-erro-de-escopo-ou-de-fato]]
tarefa: T-0006, T-0007, T-0008
---

> **Histórico desde 2026-09-11.** O board externo foi abandonado e os 56 itens estão em
> `docs/backlog/`, com corpo integral. Este registro continua descrevendo com precisão **como o
> backlog estava em 2026-08-26** e por que ele tem a forma que tem, e é por isso que ele fica. O que
> ele **não** descreve mais: os donos (a execução é de uma pessoa, [[state-execucao-solo-2026-09-11]]),
> as datas (calculadas para três pessoas em paralelo) e a mecânica de board (rótulo, comentário,
> status), que virou `.claude/rules/backlog.md`. Estado atual de qualquer item:
> `docs/backlog/INDEX.md` e a ficha em `tarefas/`.


Processo do Jira de ponta a ponta em `.claude/rules/jira.md` §8 a §12 (padrão de texto da issue,
como se marca entregue, mecânica da API, consultas JQL). Este registro é só o **mapa do momento** —
some quando as Epics fecharem.

## Epic `SPR-34` — Fase 1: modelo de dados e fundação do servidor · prazo 2026-10-23

Trilha do Matheus, **sequencial**. Prazo = `ceil(ideal × 1,3)` em dias úteis
([[convention-prazo-e-ideal-mais-trinta-por-cento]]).

| Issue | Prioridade | Início → Limite | Dono |
|---|---|---|---|
| `SPR-39` convenção de chave, timestamps e exclusão lógica | Highest | 08-26 → 08-28 | Matheus |
| `SPR-40` tipo, unidade e escala de dinheiro e quantidade | Highest | 08-31 → 09-02 | Matheus |
| `SPR-36` schema de controle | High | 09-03 → 09-08 | Matheus |
| `SPR-31` hierarquia de categorias do catálogo | High | 09-09 → 09-16 | Matheus |
| `SPR-32` produto, variação e complemento | High | 09-17 → 09-22 | Matheus |
| `SPR-33` equivalência de composição de itens | High | 09-23 → 09-28 | Matheus |
| `SPR-37` venda, pagamento, caixa, turno, operador | High | 09-29 → 10-07 | Matheus |
| `SPR-38` executor de migration | High | 10-08 → 10-15 | Matheus |
| `SPR-41` gate de segurança do modelo | Medium | 10-16 → 10-20 | **sem dono** |
| `SPR-52` camada de dados e framework HTTP | High | → 10-22 | **sem dono** |
| `SPR-51` prova medida da drenagem (`R-08`) | Medium | → 10-29 | **sem dono** |
| `SPR-14` tabelas do módulo de atendimento | Medium | 10-21 → 10-23 | **sem dono** |

`SPR-31`, `SPR-32`, `SPR-33` e `SPR-14` **vêm do backlog do Artur**. Não foram duplicadas: foram
reescopadas, repriorizadas e trazidas para cá. `SPR-37` foi **estreitada** para não colidir com elas.

## Epic `SPR-35` — fundação do cliente: fechar o arranjo · prazo 2026-10-05

| Issue | Prioridade | Início → Limite | Dono |
|---|---|---|---|
| `SPR-45` vocabulário fechado de ids de bloco | Highest | 08-26 → 08-31 | Artur |
| `SPR-42` validar Expo **sem** custódia | Highest | 09-01 → 09-09 | Artur |
| `SPR-44` analisador do manifesto + despacho tipado | High | 09-10 → 09-18 | Artur |
| `SPR-46` catálogo de mensagens + formatação única | Medium | 09-21 → 09-24 | Artur |
| `SPR-43` validar Expo **com** custódia | Highest | 08-26 → 09-09 | João Marcelo |
| `SPR-49` tokens do sistema de design em código | Medium | 09-10 → 09-17 | João Marcelo |
| `SPR-47` variantes por espaço e por interação | Medium | 09-18 → 09-25 | João Marcelo |
| `SPR-48` foco, teclado e leitor de código | Medium | 09-28 → 10-05 | João Marcelo |
| `SPR-50` decidir o arranjo | Highest | 09-10 → 09-14 | **sem dono** |

`SPR-45` vem primeiro na trilha do Artur porque a janela de renome de id fecha quando algo é
entregue. `SPR-46` consome a decisão de `SPR-40`.

## Backlog anterior — respondido, não apagado

Decisão do humano em 2026-08-26: **não excluir nada**; responder onde já existe resposta.

**Respondidos com resposta substantiva** (não só orientação): `SPR-6` (numeração incremental colide
offline — precisa de faixa pré-alocada), `SPR-9` (paginação, N+1 do total, índice), `SPR-11` (a
convergência não pode ficar "fora do MVP" — o default que sobra é o recusado), `SPR-12` (append-only,
autorização, auditoria; **mais uma correção minha**: o card já respondia a pergunta do preparo),
`SPR-21` (texto livre alimenta a chave de equivalência), `SPR-27` (autoridade é o backend; desfecho
offline), `SPR-28` (tipo do dinheiro não espera o MVP seguinte), `SPR-30` (**mecanismo trocado**:
correção por lançamento novo), `SPR-33` (armadilha da observação em texto livre na chave).

**Orientados** (fronteira núcleo/módulo, spec aprovada, ordem de fase): `SPR-1`, `SPR-2`, `SPR-3`,
`SPR-4`, `SPR-5`, `SPR-14`, `SPR-15`, `SPR-31`, `SPR-32`.

**Títulos corrigidos:** `SPR-6` e `SPR-25` tinham `" Descrição"` colado; `SPR-30` passou a nomear
correção por lançamento novo; `SPR-1` virou o recorte núcleo/módulo; `SPR-2`/`SPR-3`/`SPR-4` perderam
o parêntese redundante em inglês; `SPR-31`/`SPR-32`/`SPR-33` ficaram fiéis ao corpo.

**Gotcha meu, vale não repetir:** renomeei `SPR-31`/`32`/`33` pelo **resumo** antes de ler o corpo, e
errei os três. O corpo dos cards do Artur é bem escrito e tem critério de aceite — leia antes de
mexer no título.

**Prioridade e prazo em todas as 52 issues.** Histórias de funcionalidade: `Low`, com o prazo do
bloco da Epic (`SPR-5` → 2026-11-13, `SPR-15` → 2026-11-27, módulos → 2026-11-30).

## Fichas

Decidido em 2026-08-26: issue já; **ficha `T-000n` quando a tarefa entrar em execução por este
processo**. Criar 17 fichas vazias é cerimônia sem leitor. Existe **uma** ficha ligada a este board:
`T-0006` ↔ `SPR-54`, o trabalho de revisar e aplicar o backlog contra a spec.

## Duas ressalvas honestas sobre o calendário

1. **O cálculo conta dia útil, não desconta feriado.** 2026-10-12 (Nossa Senhora Aparecida) e os
   feriados de novembro caem dentro das janelas e **não** foram subtraídos. Ajustar isso empurra o fim
   da trilha do Matheus alguns dias.
2. **As estimativas ideais são minhas, não medidas nem validadas com quem vai executar.** Elas foram
   escritas para produzir o calendário que o humano pediu. A primeira issue que fechar dá o primeiro
   dado real de calibração — até lá, o calendário é hipótese com folga embutida.

## O que mudou em 2026-08-26, à tarde (T-0006 · `SPR-54`)

São **54** issues (`SPR-1`..`SPR-54`), sem buraco de chave. `SPR-54` é a ficha `T-0006` e é a única
issue do board com ficha correspondente.

- **Bloco A de edições aplicado integralmente**, entre 12:37 e 13:46: 6 títulos e 7 descrições
  substituídos, **cada substituição precedida do comentário de preservação** com o texto anterior
  verbatim; mais 6 comentários novos no passo 2 e 11 no passo 3. A sétima descrição é `SPR-30`, que não
  estava nas seis do bloco e entrou porque a conferência mudou o veredito dele.
- **Duas retratações publicadas**, e as duas corrigem afirmação falsa já no board: `SPR-1`
  (`service_mode` **tem** regra — `RN-NUC-048`) e `SPR-27` ("disponibilidade é do núcleo" saiu sem
  base; `G-07` segue aberta).
- **Rótulo `bloqueada` passou de 3 para 11.** Eram `SPR-31`/`32`/`33`; entraram `SPR-40` (`G-09`,
  vence 09-02), `SPR-36` (fuso, 09-08), `SPR-16` (`G-03`), `SPR-19` (`G-04`), `SPR-20` (`G-05`),
  `SPR-26` (`G-07`), `SPR-34` e `SPR-37` (mais de uma `G` cada). Cada um com comentário nomeando a
  pergunta e o default silencioso ([[convention-bloqueio-nomeia-o-default-silencioso]]).
- **`G-06` e `G-08` não têm nenhum card rotulado** — a lacuna está declarada em comentário (`SPR-6`,
  `SPR-17`), e quem olhar só o rótulo não a vê. `SPR-8` e `SPR-9` carregam o contador no aceite e
  vencem em 11-13.
- **Quatro edições ficaram por conta de decisão do humano:** o aceite de `SPR-46` (decidiria o fuso),
  o título de `SPR-32` (`G-04`/`G-05`), o título de `SPR-27` (`G-07`) e a parte substantiva do Bloco B.

### Três coisas do board que ninguém está olhando

1. **`SPR-14` (limite 10-23) está agendado depois de `SPR-41` (10-20)**, o único gate de segurança do
   board, e cria tabelas em schema de cliente. O gate 2 do `CLAUDE.md` §4 fica descoberto pelo
   calendário, não por decisão.
2. **Três das cinco Epics planejadas nunca foram criadas.** `SPR-25` e `SPR-27` declaram dependência
   para "Epic 3" e "Epic 5", que não existem — dependência para issue inexistente não acusa no board.
3. ~~Nove cards seguem lidos só pelo título~~ — **resolvido em T-0007** (Lote 2): as nove
   (`SPR-35`, `SPR-42`–`SPR-44`, `SPR-47`–`SPR-50`, `SPR-52`) foram lidas inteiras, corpo e
   comentários. Uma delas (`SPR-47`) tinha de fato a falha que o risco previa — faltava pré-requisito
   nomeado — e foi corrigida.

## O que mudou em 2026-08-26, à noite (T-0007 · `SPR-55`)

As 52 issues do backlog (`SPR-1`..`SPR-33`, `SPR-35`..`SPR-52`, excluindo `SPR-34`/`SPR-53`/`SPR-54`
do próprio recorte da tarefa) foram relidas inteiras contra "as quatro perguntas — checagem final" de
`.claude/rules/produto.md`, em 4 lotes, e verificadas por amostragem independente do thread principal
(11 issues, >15% do tocado, zero divergência que exigisse reabrir lote).

**Contagem por lote (veredito · card):**

| Lote | Cobertura | REESCRITO | JÁ CONFORME |
|---|---|---|---|
| 1 | Epic `SPR-34` + `SPR-14`,`31`–`33`,`36`–`41`,`51`,`52` (13) | 4 (`SPR-14`,`31`,`32`,`33`) | 9 |
| 2 | Epic `SPR-35` + `SPR-42`–`50` (10) | 1 (`SPR-47`) | 9 |
| 3 | backlog anterior, parte A — `SPR-1`–`13`,`15` (14) | 13 | 1 (`SPR-13`) |
| 4 | backlog anterior, parte B — `SPR-16`–`30` (15) | 9 | 6 |
| **Total** | **52** | **27** | **25** |

Nenhum título mudou (edição de título é pendência humana onde havia disputa — `SPR-32`, `SPR-27` — e
já estava fora de escopo desde T-0006). Toda edição foi precedida de comentário de preservação
verbatim, em bloco de código.

**Achado operacional, já registrado:** os quatro primeiros comentários de preservação do Lote 3
(`SPR-1`–`SPR-4`) saíram com a citação vazia — a conversão markdown→ADF descarta blockquote com
sub-título e lista aninhados, sem erro — corrigido publicando um segundo comentário em bloco de
código antes de seguir adiante ([[gotcha-comentario-de-preservacao-perde-conteudo-na-conversao-adf]]).
Os lotes seguintes já citaram sempre em bloco de código.

**Três perguntas novas foram para a pauta do humano**, não decididas por `produto` nem pelo thread
principal: paralelismo da Epic `SPR-35` com a Fase 1, papel que autoriza cancelar comanda (`SPR-12`),
e leitura do aceite de `SPR-48` — ver [[state-pendencias-abertas-2026-08-23]] §0.2.

`SPR-55` (ficha `T-0007`) fechou com a leitura completa das 52 issues confirmada e nenhuma divergência
bloqueante na amostragem — ver `## Fechamento` da ficha para o detalhe da definição de pronto.

## O que mudou em 2026-08-26/27 (T-0008 · `SPR-56`)

As mesmas 52 issues foram reescritas de novo, agora contra "o esqueleto de um card — duas formas"
(`.claude/rules/produto.md`), em 4 lotes: Lote 1 (Epic `SPR-34` + 12 issues) rodou com `model: haiku`,
a pedido do humano; Lotes 2 a 4 rodaram no modelo padrão. 27 issues foram efetivamente **reescritas**
para a anatomia nova (Objetivo/Escopo/Fora de escopo/Critério de aceite/Depende de/Gate/Referências
para REGRA; Contexto/O que testar/Entrega/Critério de conclusão para PROVA); as demais já estavam
conformes ou eram Epic/redirecionamento sem forma própria.

**Verificação independente encontrou 5 defeitos substantivos, todos corrigidos:**

- `SPR-52` (Lote 1) recomendava um framework fora de território de `produto` — removido.
- `SPR-39` (Lote 1) estava na forma errada (Prova em vez de Decisão) para a convenção `D-04` —
  reestruturado.
- `SPR-42` (Lote 2, **modelo padrão**) tratava `D-02` como fechada sem base na fonte citada —
  corrigido, `D-02` segue aberta.
- `SPR-40`/`SPR-41` (Lote 1) tinham typo virando palavra sem sentido, contagem errada e anglicismo —
  corrigidos.
- `SPR-41`: uma dupla negação no Critério de conclusão do gate de segurança (lida ao pé da letra,
  invertia o sentido do gate) — corrigida em despacho separado, fora do escopo da correção pontual
  original que só tratava typo/palavra sem sentido/número errado.

Achado de processo: a verificação por terceiro achou defeito mesmo em lote gerado pelo modelo padrão,
não só no lote mais barato — [[gotcha-julgar-o-proprio-texto-nao-pega-erro-de-escopo-ou-de-fato]].

**`SPR-56`** (ficha `T-0008`) fechou com o critério de forma atingido; o de profundidade, atingido com
a ressalva de que forma certa não garantiu conteúdo certo sem a verificação — ver `## Fechamento` da
ficha.

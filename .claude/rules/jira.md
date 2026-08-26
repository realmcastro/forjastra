# Regra — Jira como registro de trabalho

O Jira é o **registro público** do trabalho: o que foi pedido, em que estado está, quem responde por
ele. A ficha em `tarefas/` é o **registro de raciocínio**: plano, relatórios de agent, fechamento.
Os dois existem, e o Jira espelha o que acontece na ficha.

Leitura obrigatória para o `orquestrador`, para o thread principal e para o `produto` — os três que
escrevem no Jira (§2). Os outros sete agents não leem esta regra, porque não tocam no Jira.

## 1. Nenhuma tarefa começa sem issue

A issue existe **antes** do Plano de Despacho. Não há despacho de agent contra pedido que só existe
no chat: se o humano pede direto na conversa, o thread principal **cria a issue primeiro** e só
então chama o `orquestrador`.

Por quê: um board que só recebe o trabalho depois de pronto não é um board, é um arquivo morto —
e quem não está nesta sessão não tem como saber que a tarefa está em voo.

Vale inclusive para o encurtamento de `processo.md` §5. Tarefa pequena continua dispensando plano e
ficha; **não** dispensa issue. Criar issue custa uma chamada; descobrir na semana seguinte que
ninguém sabia do trabalho custa a tarefa inteira.

Exceção única: **conversa não é tarefa.** Pergunta conceitual respondida e encerrada na triagem
(`processo.md` §1, etapa 1) não gera issue nem ficha.

## 2. Quem fala com o Jira

Atualizado em 2026-08-26. Antes desta data a regra era "só o thread principal". Ela estava apertada
demais: proibia **ver** o board para evitar **escrever** nele, e as duas coisas não são a mesma.

| Papel | No Jira |
|---|---|
| `produto` | **dono do backlog.** Cria issue, edita título, descrição, escopo e critério de aceite, comenta, vincula, recorta e funde |
| thread principal | espelha os artefatos do processo, transiciona status, atribui pessoa |
| `orquestrador` | decide o **conteúdo** do que é espelhado (que status, que comentário, quando fecha) |
| os outros sete agents | **nada.** Entregam o relatório e pronto |

**Por que `produto` e não os outros:** a issue é um pedido de negócio antes de ser um item de board.
Quem recorta escopo e escreve critério de aceite é quem entende a **regra**. Fazer isso passar pelo
thread principal punha um intermediário entre a spec e o board — e intermediário transcreve, resume
e erra.

**Por que os outros sete continuam de fora:** nove agents escrevendo na mesma issue produz um fio
ilegível e concorrente, que é o defeito que o território de escrita existe para evitar. O motivo
sempre foi a **escrita concorrente**, nunca o acesso. Agent que precisa de algo do Jira pede em
`PERGUNTAS: para produto` ou `para humano`.

**A fronteira exata:** `produto` é dono do **conteúdo de backlog**. O thread principal é dono do
**registro do processo** — Plano de Despacho, Relatório de Handoff, fechamento e transição de status
(§4 e §5). Os dois escrevem na mesma issue e não colidem, porque escrevem coisas diferentes.

### As três travas de `produto` no Jira

Elas valem como regra, não como recomendação:

1. **Escopo não muda sem contexto e sem prova.** Prova é `path:linha` da spec, a regra em
   `.claude/rules/**`, ou resposta registrada do humano — citada na própria issue. "Faz mais sentido
   assim" é preferência, e preferência não move card que outra pessoa escreveu.
2. **Tarefa não se exclui porque alguém quer** — inclusive quando quem quer é o humano. Exclusão
   exige as quatro partes de `00-nucleo.md` §12. E como a justificativa morreria junto com a issue,
   ela vai antes para `docs/produto/backlog-recortes.md` citando a chave. `produto` recomenda com as
   quatro partes prontas; **o humano autoriza a exclusão**.
3. **Edição segue a régua da exclusão.** Diga na issue o que mudou, por que, e contra o quê. Mudança
   de escopo preserva o texto anterior em comentário. Comentário é append-only (§4).

**Card mal escrito não é card desnecessário.** A pergunta é se a necessidade existe, não se o texto
está bom.

## 3. O par issue ↔ ficha

A ficha mantém a numeração `T-000n` e ganha o campo `jira:` no frontmatter:

```yaml
---
id: T-0006
jira: SPR-42
titulo: <curto>
status: aberta | bloqueada | fechada
---
```

Um para um: uma issue, uma ficha. Issue que precisaria de duas fichas estava mal recortada —
quebre a issue, não a ficha. A issue carrega no corpo o link para o path da ficha no repositório.

`tarefas/INDEX.md` ganha a chave na linha: `T-0006 — SPR-42 — título — status`.

## 4. O que é espelhado

Todo artefato de `handoff.md` vira comentário na issue, **verbatim**, um comentário por artefato:

| Artefato | Vira | Quando |
|---|---|---|
| Pedido | corpo da issue | na criação |
| Plano de Despacho | comentário | assim que o `orquestrador` devolve |
| Relatório de Handoff | um comentário por relatório | ao validar o relatório (`processo.md` §1, etapa 5) |
| Achado de auditoria | comentário, com o path do relatório em `docs/auditorias/` | ao concluir o gate |
| Fechamento | comentário final + transição de status | no fechamento |

Cabeçalho fixo em todo comentário espelhado, para o fio ser legível por quem não abriu o repo:

```
[T-0006 · <agent> · AAAA-MM-DD]
<o artefato, verbatim>
```

**Comentário é append-only.** A ficha mudou depois que o comentário foi postado? Novo comentário
corrige, com a data. Nunca edite comentário já publicado — é a mesma razão de migration ser
forward-only (`migrations.md` §1): a cópia editada em silêncio produz duas versões da mesma verdade
e ninguém descobre qual leu quem.

**Espelhar não é resumir.** Se o relatório for longo demais para o comentário, ele é longo demais
para a ficha — o problema é o relatório (`00-nucleo.md` §5: denso, sem preâmbulo), não o Jira.

## 5. Status

O status da issue segue o estado da ficha, e a transição acontece **no mesmo passo** em que a ficha
muda — não em lote no fim do dia:

| Estado da ficha | Issue | Disparado por |
|---|---|---|
| issue criada, sem plano | a fazer | pedido registrado |
| `status: aberta` | em andamento | ficha criada a partir do plano |
| `status: bloqueada` | continua **em andamento**, com o rótulo `bloqueada` **e** o `BLOQUEIO` como comentário — o board `SPR` não tem status de bloqueio (§8) | qualquer agent emitiu `BLOQUEIO` |
| `status: fechada` | concluída | `orquestrador` fechou, definição de pronto conferida item por item |

**Bloqueio é visível ou não existe.** `BLOQUEIO` que fica só na ficha some: o board mostra a tarefa
andando enquanto ela está parada esperando decisão do humano.

Ficha não fecha antes da issue, nem a issue antes da ficha. Fecham no mesmo passo, e é o
`orquestrador` que autoriza — item de pronto pendente não fecha nenhum dos dois (`processo.md` §2).

## 6. O que nunca sai daqui

O Jira é mais exposto que o repositório: tem gente sem acesso ao código, integração, notificação por
e-mail e exportação.

- **Segredo, nunca** — vale a proibição de `00-nucleo.md` §8, sem atenuação.
- **Dado real de cliente** — nome, documento, telefone, endereço, valor de venda real. Descreva o
  caso, não cole o dado.
- **Path e trecho de código** podem ir. Conteúdo de `memory/` e de `docs/auditorias/` vai por
  **referência** (`path:linha`), nunca colado — auditoria descreve como atacar o sistema.

Na dúvida entre colar e referenciar: **referencie.** Quem tem acesso ao Jira nem sempre tem acesso
ao repo, e o inverso é recuperável — o contrário não.

## 7. Jira fora do ar não para o trabalho

Conector caído, sem rede, sessão sem MCP: o trabalho continua na ficha, e o thread principal
**declara no fim** o que ficou pendente de espelhar, na forma `PENDENTE NO JIRA: <artefatos>`.
Nunca invente que espelhou (`00-nucleo.md` §4). A ficha é a fonte que permite recompor a issue
depois; o contrário não é verdade.

## 8. O board concreto — `SPR`

Descoberto e verificado em 2026-08-26. Registro em
`memory/plataforma/reference-jira-projeto-spr.md`; aqui fica só o que a regra precisa.

- **Site:** `arturjuliao20.atlassian.net` · **`cloudId`:** `47c620c6-728b-44f0-9aad-91240111566b`
- **Projeto único:** `SPR` (team-managed). Toda issue da Forja nasce aqui.
- **Status, e são só três:** `A fazer` → `Em andamento` → `Concluído` (transição `41`).
- **Não existe status de bloqueio.** Logo `BLOQUEIO` se torna visível por **rótulo `bloqueada` +
  comentário**, com a issue permanecendo em `Em andamento`. Rótulo sai quando o bloqueio resolve, e a
  saída também é comentário — a ficha continua sendo a fonte (`§5`).
- **Tipo de issue por natureza do trabalho:** `Spike` para investigação e prova (o desfecho é
  evidência, não código); `História` para entrega de comportamento; `Bug`; `Epic` para agrupar.
  `Request` não se usa aqui.
- **O board já tinha 33 issues** (`SPR-1`…`SPR-33`) criadas em 2026-08-19 e 2026-08-23, **antes** deste
  processo e sem ficha correspondente. Elas **não** são fichas órfãs: são backlog anterior, escrito em
  vocabulário de vertical. Não as trate como par issue↔ficha (§3). **Editar e comentar nelas está
  autorizado** pelo humano em 2026-08-26 — o que não muda é que elas **não são fonte de regra de
  negócio**: a fonte é `docs/produto/**`, e issue que contradiz a spec é a issue que está velha.

## 9. Anatomia da issue — o padrão de texto

Toda issue da Forja tem estas seções, **nesta ordem**, em Markdown. Seção que não se aplica é
omitida; seção fora de ordem quebra a leitura de quem abre 20 issues no mesmo dia.

```markdown
## Objetivo              (ou "## Pergunta a fechar", quando é Spike)
<um parágrafo: o que é entregue, ou o que passa a estar decidido>

## Escopo
<bullets: o que entra>

## Fora de escopo
<o que explicitamente NÃO entra — e por que é de outra issue>

## Critério de aceite
<o caso concreto que prova que funciona>

## Depende de
<issue ou decisão que precede — só quando existe>

## Gate obrigatório
<segurança / desempenho, quando se aplica>

## Referências
<paths, separados por ` · `>
```

Regras do texto, e nenhuma é estilística:

- **`Fora de escopo` é obrigatória em tudo que não é trivial.** É a seção que impede a issue de crescer
  no meio da execução, e é a primeira que se esquece.
- **Critério de aceite é caso concreto, não adjetivo.** "Funciona bem" não é critério; "manifesto
  truncado descarta o nó e mantém os irmãos" é. Issue sem critério de aceite é desejo, não tarefa.
- **Vocabulário do núcleo** — venda, item, pedido, pagamento, operador, turno, cliente-final,
  catálogo. Termo de ramo só quando a issue **é** de módulo de vertical
  ([[gotcha-board-spr-e-nomeado-pela-vertical]]).
- **Referência por path, nunca conteúdo colado.** Vale a §6: `memory/**` e `docs/auditorias/**` vão
  **só** por `path:linha`.
- **Data sempre absoluta** (`AAAA-MM-DD`). Nunca "semana passada".
- **Nenhuma referência a IA** em título, corpo ou comentário.
- **Nada de segredo e nada de dado real de cliente.** Descreva o caso, não cole o dado.

### Spike tem uma seção a mais, e ela é campo, não texto

No tipo `Spike` o critério de aceite **não** vai no corpo: vai no campo obrigatório **"Resultados
Esperados"** (`customfield_10042`). Escreva nele o **desfecho verificável** — que evidência existe no
fim, e como se sabe que ela é suficiente. Spike cujo resultado esperado é "entender melhor" não é
Spike, é conversa.

## 10. Como uma issue é marcada como entregue

Três passos, **nesta ordem**, e nenhum se pula:

1. **Confira a definição de pronto item por item** (`processo.md` §2). Item que não se aplica é
   declarado como "não se aplica: <por quê>". Silêncio não conta como cumprido.
2. **Comente o fechamento** na issue, no formato abaixo. O comentário vem **antes** da transição.
3. **Transicione para `Concluído`** (transição `41`).

```
[T-<id> · fechamento · AAAA-MM-DD]

ENTREGUE: <o que passou a existir, verbo no passado>
ARQUIVOS: <paths>
VERIFICAÇÃO: <o que foi rodado de fato — ou "não rodei: <motivo>">
PRONTO: <item por item da definição de pronto, cada um cumprido ou "não se aplica: …">
FICHA: tarefas/T-<id>-<slug>.md
SOBROU: <o que ficou para depois, ou "—">
```

**Transição sem comentário de fechamento é proibida.** Status verde sem registro é board que mente —
quem não estava na sessão lê "concluído" e não tem como saber o que foi entregue nem o que foi
verificado. É o mesmo defeito que a §1 evita na entrada, agora na saída.

**Entrega parcial não fecha.** Se falta item, a issue continua em `Em andamento` e o que falta vira
comentário. `STATUS: PARCIAL` declarado é entrega válida; issue fechada por cansaço não é.

## 11. Mecânica da API — o que a próxima sessão não precisa redescobrir

| O que | Valor |
|---|---|
| `cloudId` | `47c620c6-728b-44f0-9aad-91240111566b` |
| `projectKey` | `SPR` |
| Epic pai | passe a chave da Epic em `parent` (ex. `SPR-34`) |
| Corpo da issue e comentário | `contentFormat: "markdown"` |
| Atribuir | `assignee_account_id` — tabela em [[reference-jira-projeto-spr]] |
| Concluir | `transitionJiraIssue` com id `41` |

**A armadilha que custa três tentativas:** o tipo `Spike` exige `customfield_10042` e o campo **só
aceita ADF**, não texto simples. Passe em `additional_fields`:

```json
{"customfield_10042": {"type":"doc","version":1,
  "content":[{"type":"paragraph","content":[{"type":"text","text":"…"}]}]}}
```

Texto puro devolve *"não é um conteúdo válido do formato de documento da Atlassian"*. `História` e
`Epic` não exigem o campo.

**A conta autenticada é a do humano.** Toda issue e todo comentário criados por aqui aparecem no nome
dele — não existe postar "em nome de" outra pessoa. Por isso o cabeçalho `[T-<id> · <agent> · data]`
da §4 não é enfeite: é a única coisa que diz quem produziu o artefato.

## 12. As consultas do fluxo

| Para saber | JQL |
|---|---|
| o que é meu e está em pé | `project = SPR AND assignee = currentUser() AND statusCategory != Done ORDER BY Rank` |
| o que está livre para pegar | `project = SPR AND assignee IS EMPTY AND statusCategory != Done ORDER BY Rank` |
| o que está bloqueado | `project = SPR AND labels = bloqueada ORDER BY updated DESC` |
| o que está em voo | `project = SPR AND status = "Em andamento" ORDER BY updated DESC` |

Issue **sem dono** é convite, não esquecimento: tarefa mais avançada nasce sem dono de propósito,
para quem liberar primeiro pegar (acordado em 2026-08-26).

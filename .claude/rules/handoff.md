# Handoff — como os agents se comunicam

Agents não conversam entre si em tempo real. Eles se comunicam por **dois artefatos**: a **ficha de
tarefa** (memória compartilhada da tarefa, em disco) e o **relatório** (o que volta ao orquestrador).
O orquestrador é o único roteador.

```
humano → thread principal → [orquestrador: PLANO] → thread principal cria a FICHA
       → agent A (lê ficha, escreve sua seção, devolve RELATÓRIO)
       → orquestrador lê relatório: rota PERGUNTAS, dispara próximo, ou fecha
       → ... → orquestrador: FECHAMENTO (escreve memória, encerra a ficha)
```

## 1. Plano de Despacho (só o `orquestrador` produz)

```
## PLANO — T-<id> <título>
ESCOPO: <o que entra>
FORA DE ESCOPO: <o que explicitamente não entra>
ESCOPO DE MEMÓRIA: cliente=<id|-> vertical=<ramo|-> modulo=<nome|-> camada=<dados|backend|ui|...>
DECISÕES ABERTAS QUE TOCAM ISSO: <D-xx | nenhuma>
PASSOS:
  1. <agent> — <brief de 1–3 linhas> — entrega: <artefato> — [sequencial|paralelo com N]
  2. ...
GATES: <quais dos 5 gates do CLAUDE.md §4 se aplicam e em que passo>
RISCO PRINCIPAL: <um>
```

Regras do plano: passo sem entregável nomeado não é passo. Paralelo só entre passos de territórios
**disjuntos**. Todo passo declara se depende do anterior.

## 2. Ficha de tarefa — `tarefas/T-<id>-<slug>.md`

O bastão. Criada pelo thread principal a partir do plano; cada agent **acrescenta** sua seção e
nunca toca na de outro.

```markdown
---
id: T-0001
titulo: <curto>
status: aberta | bloqueada | fechada
escopo: cliente=<id|-> vertical=<ramo|-> modulo=<nome|-> camada=<...>
aberta_em: AAAA-MM-DD
---

## Pedido
<o que o humano pediu, nas palavras dele>

## Plano
<colar o PLANO do orquestrador>

## <agent> — AAAA-MM-DD
<o relatório daquele agent, verbatim>

## Fechamento
<orquestrador: o que ficou, memórias escritas, o que sobrou para depois>
```

Índice em `tarefas/INDEX.md`: uma linha por ficha (`T-0001 — título — status`). Ficha fechada
permanece — é o histórico de por quê as coisas são como são.

## 3. Relatório de Handoff (todo agent, sempre)

```
## RELATÓRIO — <agent> — T-<id>
STATUS: OK | PARCIAL | BLOQUEIO
FEITO: <bullets curtos, verbo no passado>
ARQUIVOS: <path> (novo|editado|só leitura)
NÃO FEITO: <só se PARCIAL — o que falta e por quê>
DECISÕES: <escolha não óbvia que você tomou + o trade-off. Vazio é resposta válida.>
RISCOS: <o que pode morder depois, inclusive fora do escopo>
PERGUNTAS:
  - para <agent|humano>: <pergunta fechada, respondível em 2 linhas>
VERIFICAÇÃO: <o que você rodou/checou de fato — ou "não rodei: <motivo>">
MEMÓRIA SUGERIDA:
  - type=<decision|gotcha|state|convention|reference|business-rule> escopo=<...> slug=<kebab> — <1 linha>
PRÓXIMO PASSO SUGERIDO: <agent> — <brief>
```

Campo sem conteúdo vai com `—`, não desaparece. `BLOQUEIO` **obriga** ao menos uma `PERGUNTAS`.

## 4. Consulta — o canal barato entre agents

Quando um agent pergunta a outro, o orquestrador não dispara uma tarefa inteira: dispara uma
**consulta**, com este brief:

```
CONSULTA — T-<id> — de <agent-origem> para <você>
PERGUNTA: <a pergunta, literal>
CONTEXTO MÍNIMO: <paths e nada mais>
RESPONDA: só a pergunta, ≤10 linhas. Não escreva arquivo. Não amplie escopo.
```

Consulta é **read-only** e não escreve na ficha — a resposta volta pelo orquestrador, que a cola na
ficha se importar. Consulta que virou tarefa foi mal roteada.

## 5. Roteamento — quem responde o quê

| Pergunta é sobre | Vai para |
|---|---|
| "esta regra de negócio existe? qual é?" | `produto` |
| "onde este dado mora? posso indexar assim?" | `arquiteto-dados` |
| "qual o contrato desta rota / deste evento?" | `backend` |
| "que bloco SDUI cobre isso? qual o contrato?" | `ui` |
| "isso vaza tenant? isso autoriza direito?" | `seguranca` |
| "isso escala? qual o custo dessa consulta?" | `performance` |
| decisão em aberto, prioridade, prazo, escopo | **humano** |

## 6. Fechamento (só o `orquestrador`)

Antes de fechar: todo `BLOQUEIO` resolvido ou escalado; todo gate aplicável cumprido; toda
`MEMÓRIA SUGERIDA` avaliada — escrita como registro, recusada com motivo, ou fundida a um registro
existente. Aí sim `status: fechada` e a linha do `INDEX.md` atualizada.

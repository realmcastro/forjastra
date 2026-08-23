# Regra — Memória como grafo

`memory/` guarda o **não derivável**: por que decidimos X, cuidado com Y, estado de Z, qual é a
regra de negócio de um módulo neste cliente. Não guarda o que código, `docs/` ou git já dizem.

**Só o `orquestrador` escreve em `memory/`** (e o thread principal). Os outros agents **sugerem**
registros pelo campo `MEMÓRIA SUGERIDA` do relatório. Isso mantém o grafo coerente e evita 8 agents
criando 8 versões do mesmo fato.

## 1. Topologia

```
memory/
├── MEMORY.md                              nível 0 — auto-carregado, só roteador
├── plataforma/INDEX.md + <registros>      vale para todo cliente e todo módulo
├── modulos/INDEX.md
│   └── <modulo>/INDEX.md + <registros>    regra do módulo, agnóstica de cliente
├── verticais/INDEX.md
│   └── <ramo>/INDEX.md + <registros>      conhecimento do ramo (restaurante, posto, varejo)
├── clientes/INDEX.md
│   └── <cliente>/INDEX.md + <registros>
│       └── modulos/<modulo>/INDEX.md + <registros>   o que ESTE cliente muda NESTE módulo
└── processo/INDEX.md + <registros>        como trabalhamos com a ferramenta/IA
```

Escolha do lugar, na ordem — pare no primeiro "sim":

1. Vale para **qualquer** cliente e qualquer módulo? → `plataforma/`
2. É de **um módulo**, igual em todo cliente? → `modulos/<modulo>/`
3. É de **um ramo**, reusável entre clientes do mesmo ramo? → `verticais/<ramo>/`
4. É de **um cliente** dentro de um módulo? → `clientes/<cliente>/modulos/<modulo>/`
5. É de **um cliente**, cross-module? → `clientes/<cliente>/`
6. É sobre **como trabalhamos**? → `processo/`

Na dúvida entre geral e específico, escolha o **mais geral que ainda é verdade**. Registro
específico demais some; geral demais mente.

## 2. Caminho de leitura (é isto que economiza contexto)

Dado o `ESCOPO DE MEMÓRIA` da tarefa (`cliente`, `vertical`, `modulo`, `camada`):

1. `MEMORY.md` — já está no contexto.
2. `plataforma/INDEX.md` — sempre. É curto e é lei de fundo.
3. `modulos/<modulo>/INDEX.md` — se a tarefa tem módulo.
4. `verticais/<ramo>/INDEX.md` — se a tarefa tem vertical.
5. `clientes/<cliente>/INDEX.md` **e** `clientes/<cliente>/modulos/<modulo>/INDEX.md` — se tem cliente.
6. Registro individual: **só** quando o gancho do índice indica que ele responde a sua pergunta.

Proibido: `ls -R memory/`, `grep -r` na árvore inteira, abrir `INDEX.md` de módulo/cliente que não é
o da tarefa. Trabalhando em vendas do cliente A, a regra de vendas do cliente B **não existe** para
você — é justamente o ponto do grafo.

Filtro por camada: dentro de um `INDEX.md`, pule as linhas cuja `camada` não é a sua (o agent de UI
não abre registro `camada: dados`, salvo gancho explícito).

## 3. Precedência e conflito

`cliente > vertical > módulo > plataforma`. Registro específico que **contradiz** um mais geral
**tem** que declarar `supera: [[slug-do-geral]]`, e o geral ganha a nota
`⚠️ superado em <escopo> por [[slug]]` na linha do índice dele. Contradição sem `supera` é defeito
do grafo — reporte.

## 4. Formato do registro (nível 2)

Um arquivo por fato. Nome `kebab-case.md`, prefixado pelo tipo: `decision-`, `gotcha-`, `state-`,
`convention-`, `reference-`, `rule-`.

```markdown
---
name: <slug igual ao nome do arquivo, sem .md>
description: <uma linha — é por ela que se decide abrir ou não o arquivo>
type: decision | gotcha | state | convention | reference | business-rule
escopo: plataforma | modulo:<nome> | vertical:<ramo> | cliente:<id> | cliente:<id>/modulo:<nome> | processo
camada: dados | backend | ui | sdui | seguranca | performance | produto | processo
data: AAAA-MM-DD
relaciona: [[slug]], [[slug]]     # opcional
supera: [[slug]]                  # opcional — só se contradiz o registro mais geral
tarefa: T-0001                    # opcional — de onde nasceu
---

<o fato, direto. Para decision/gotcha/business-rule, siga com:>
**Por quê:** <razão — o trade-off real, não a justificativa bonita>
**Como aplicar:** <ação prática>
```

`description` é o campo mais importante do arquivo: ela é lida muitas vezes, o corpo poucas. Escreva
a conclusão nela, não o assunto. Ruim: "sobre numeração de pedido". Bom: "número de pedido é
sequencial por cliente e por dia, reinicia à meia-noite no fuso do cliente".

## 5. Os seis tipos

- **decision** — escolha arquitetural não óbvia + trade-off. Inclua o que foi recusado.
- **gotcha** — armadilha que custou tempo. Inclua o sintoma (é por ele que se busca) e como evitar.
- **state** — estado de um trabalho em andamento. Atualize ao avançar, **remova** ao concluir.
- **convention** — convenção fixada em conversa que ainda não é regra em `.claude/rules/`.
- **reference** — ponteiro externo (ticket, dashboard, doc de fisco/adquirente, URL).
- **business-rule** — regra de negócio de um módulo/cliente: o que o sistema deve fazer e sob que
  condição. Sempre com escopo explícito. É o tipo que mais justifica o grafo existir.

## 6. Linha de índice

No `INDEX.md` do escopo, uma linha por registro:

`- [<título curto>](<arquivo>.md) — <gancho: a conclusão em meia linha> · camada:<camada>`

O gancho decide se alguém abre o arquivo. Não repita o título nele.

## 7. Quando escrever (sempre que)

Resolveu problema de causa não óbvia (`gotcha`) · escolheu entre alternativas (`decision`) ·
o humano fixou regra de negócio (`business-rule`) · o humano deu orientação de como trabalhar
(`convention`) · pausou/concluiu um passo (`state`) · fechou uma decisão do `CLAUDE.md` §8
(`decision` em `plataforma/` + atualizar a tabela).

## 8. Disciplina

- **Não duplique.** Antes de criar, leia o `INDEX.md` do escopo e **atualize** o registro que já
  cobre o tópico.
- **Não registre o derivável** — estrutura de pasta, histórico de git, o que a regra já diz.
- **Não deixe data relativa.**
- **Corrija ou apague memória errada.** Registro obsoleto (passo concluído) sai.
- Mexeu no registro? Atualize a linha do índice na mesma passada. Índice defasado é pior que
  ausência de índice.
- `MEMORY.md` (nível 0) só muda quando nasce ou morre uma **área inteira** — não a cada registro.

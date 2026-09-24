# F-016 — Varrer, atrás de captura ausente, o escopo que nunca terá `RN`

**Tipo:** Prova · **Estado:** a fazer · **Agrupador:** F-001 · **Rótulo:** captura

> **Este item funde duas linhas do `SOBROU` de `T-0010`** (`tarefas/T-0010-invariante-10-captura.md`,
> seção `## Fechamento — 2026-09-12`): "varrer o escopo que nunca terá `RN`" e "releitura de
> `superficie-por-papel-momentos.md` com a lente de arquivo sem `RN`". As duas são o **mesmo** trabalho
> com a mesma lente — a segunda é um arquivo do conjunto que a primeira define — e mantê-las separadas
> produziria duas passadas com o mesmo método sobre corpus que se toca.

## Contexto

As três passadas da varredura do invariante 10 fecharam `docs/produto/**`. Nenhuma delas alcançou o
que **fecha comportamento fora de `docs/produto/**`** — e isso não é descuido de quem varreu, é a
âncora:

```
invariante 10 escrito (CLAUDE.md §7.10)
→ 1ª e 2ª passadas: âncora = "arquivo que carrega `RN`"        → 12 achados
→ 3ª passada: docs/produto/** inteiro, inclusive sem `RN`      → 2 achados (2.13, 2.14)
→ [buraco] o que governa comportamento e mora fora de docs/produto/** nunca entrou em âncora nenhuma
```

O achado `2.14` é a prova de que o buraco produz perda real: nó de manifesto descartado pelo terminal
não produz fato, e a regra que **manda descartar** mora em `.claude/rules/ui.md` §1, não em spec de
produto. Composição de tela por manifesto é `plataforma` (`fronteira-do-nucleo.md:59`), fora do
território de `produto`, **logo nunca terá `RN`** — e o mesmo vale para tudo que decide degradação,
recusa de borda, tolerância de versão e fallback.

A segunda trava veio da validação do fechamento de `T-0010`, e ela é sobre o método, não sobre o
corpus: **profundidade declarada tem que ser não-vazia para o arquivo.**
`docs/produto/superficie-por-papel-momentos.md` (289 linhas, 70 citações de `RN`, **zero** `### RN-` e
**zero** blocos `**Infeliz**`, medido em 2026-09-12) entrou na lista dos arquivos "lidos pelo critério
de todo bloco `**Infeliz**`" — critério que ali não seleciona nada. Ele conta como coberto e não foi
lido com lente nenhuma.

> **O que mais, fora de `docs/produto/**`, fecha um comportamento sem produzir fato — e ninguém
> perguntou?**

**O critério de cobertura que substitui a âncora de `RN`:** o corpus é **arquivo que fecha
comportamento e não carrega `### RN-`**, delimitado por **conjunto de diretórios declarado** e
conferido por diferença de conjunto (`comm`), nunca por marca interna do arquivo e nunca por contagem.
A âncora velha perguntava "o arquivo tem regra numerada?"; esta pergunta "o arquivo diz o que o sistema
faz num caminho?" — e a resposta não está escrita dentro dele, está na declaração de quem varre.

**O conjunto, medido em 2026-09-12: 31 arquivos.**

| Zona | Arquivos | Por que está aqui | Dono de achado |
|---|---|---|---|
| `.claude/rules/**` | 14 | Governa todo agent e fecha comportamento direto (`ui.md` §1 degradação e descarte, `backend.md` §4 e §5, `dados.md` §3.1, `seguranca.md` §3 minimização, `performance.md` orçamento). É a zona de maior risco: é onde `2.14` já morava. | humano / thread principal |
| `docs/design/**` | 8 | Decide o que o terminal faz quando algo **não** dá certo: `tolerancia-de-versao.md`, `vocabulario-e-eixos.md`, `estados-e-interacao.md`, `foco-teclado-e-leitor.md`. Mesma família do `2.14`. | `ui` |
| `docs/arquitetura/**` | 7 | Dossiê e folha de opções que precedem decisão (`d-01-d-02-stack-opcoes.md`, `d-03-identidade-opcoes.md`, os quatro fiscais). Enumeração de opção sem ramo infeliz é o padrão esperado aqui. | `produto` / humano, conforme o achado |
| `CLAUDE.md` | 1 | Carrega os dez invariantes, inclusive o 10. Auto-referência é o ponto: o invariante que manda capturar pode ter fechado captura em outro invariante. | humano |
| `docs/produto/superficie-por-papel-momentos.md` | 1 | Cobertura **nominal** medida em 2026-09-12. Mora em `docs/produto/**` e mesmo assim nunca foi lido com lente que selecionasse algo. | `produto` |

**O que precisa estar pronto antes: nada.** Os 31 arquivos, as três lentes da terceira passada, a lista
de busca dirigida e o método de conferência por conjunto estão todos em disco desde 2026-09-12. Este
item é executável no estado atual do repositório.

## O que testar

### 1. Fechar o conjunto antes de ler

Gerar a lista dos 31 arquivos por `git ls-files` nas quatro zonas, congelá-la no topo do relatório com
a data, e no fim conferir a lista de cobertura contra ela por `comm`.

**Desfecho exato:** a diferença entre conjunto e cobertura é **vazia**, e o que prova isso é a saída do
comando. Contagem não vale — ela já mentiu duas vezes em `T-0010` ("20 lidos" sobre 21 nomes, "39 com
`RN`" sobre 40). Arquivo que entrar no diretório depois da data congelada fica fora e é nomeado.

### 2. Lente A — recusa que arrasta a captura junto

Toda cláusula que recusa, proíbe ou restringe um mecanismo. Recusar o mecanismo é legítimo
(`00-nucleo.md` §12); recusar junto o **fato** que ele produzia é perda silenciosa. Casos nomeados para
começar, e não são a lista inteira: `dados.md` §3 (nenhuma coluna de exclusão lógica no núcleo — onde
mora o fato de "tirado de circulação"?) · `seguranca.md` §3 (minimização de dado pessoal — o que a
minimização leva junto?) · `performance.md` (orçamento e a recusa de cache — alguma medida deixa de
existir?) · `00-nucleo.md` §12 e §8.

**Desfecho exato, por recusa encontrada:** ou o fato sobrevive em outro endereço, e o relatório cita o
`path:linha` onde ele está, ou a recusa fechou a captura e vira achado numerado. Não existe terceira
saída, e "provavelmente está em algum lugar" é a primeira sem a citação.

### 3. Lente B — enumeração fechada sem o ramo infeliz

Lista de estado, motivo, desfecho, campo ou etapa que não tem entrada para "não deu certo". Casos
nomeados: `ui.md` §1 (degradação rede → cache local → piso embutido, três desfechos e nenhum produz
fato) · `handoff.md` §3 (campos do relatório) · `migrations.md` §10 (checklist de revisão) ·
`design/tolerancia-de-versao.md` · `design/estados-e-interacao.md`.

**Desfecho exato, por enumeração:** dizer se o ramo infeliz existe na lista e, existindo, se ele deixa
fato. Enumeração completa cujo ramo infeliz **não** deixa fato é achado igual à que não tem o ramo.

### 4. Lente C — prosa que repete a `RN` e, ao repetir, estreita

O arquivo não governa, mas é o que alguém lê primeiro. Alvo principal:
`superficie-por-papel-momentos.md`, com suas 70 citações de `RN` e nenhuma regra própria.

**Desfecho exato:** cada citação que **diverge** da redação da `RN` citada vira achado com as **duas
redações lado a lado**, cada uma com `path:linha`, e a frase que diz qual das duas estreita. Citação
fiel não entra no relatório; contá-las é o que produz volume sem informação.

### 5. Lente D — descarte silencioso (é a que `2.14` pede, e é nova)

Todo ponto em que o sistema **descarta, ignora, cai em fallback, degrada ou recusa por decisão
própria**. Os pontos nomeados hoje: nó de manifesto inválido descartado com os irmãos sobrevivendo
(`ui.md` §1) · id desconhecido caindo em bloco padrão (`ui.md` §1, `design/vocabulario-e-eixos.md`) ·
id desconhecido em zona de ação crítica, onde a ação simplesmente não acontece (`ui.md`) · resposta
inaproveitável que não é cacheada (`ui.md` §1) · manifesto montado a partir de módulo desligado, cujo
nó não existe (`backend.md` §4) · resposta perdida depois do commit (`backend.md` §5).

**Desfecho exato, por ponto:** uma de três — produz fato hoje (cita onde), já tem item (`F-004`,
`F-012`, e o item cobre aquele ponto **nominalmente**, não por parentesco), ou é achado novo. O
descarte que o operador **não vê** é o de maior prioridade: ele não gera chamado, e o sintoma chega
como "o caixa 3 não tem o botão".

### 6. A trava de profundidade, e ela é medida

Cada arquivo do conjunto declara a lente aplicada **e a contagem do que aquela lente selecionou nele**.

**Desfecho exato:** nenhuma linha de cobertura fica com seletor **zero**. Zero é cobertura nominal, e o
arquivo volta com outra lente, dizendo qual e por quê. É a regra que
`superficie-por-papel-momentos.md` violou sem ninguém notar, porque a linha de cobertura dele parecia
igual às outras 38.

### 7. Achado cujo dono não é `produto`

A maioria dos achados vai cair em `.claude/rules/**` e `docs/design/**`, e `produto` não escreve em
nenhum dos dois.

**Desfecho exato:** o achado vira item em `docs/backlog/` com o dono nomeado na primeira linha, e o
relatório **não** propõe a redação da correção. Descrever a correção no território alheio é o mesmo
defeito de contorno que a fronteira de módulo sofre.

## Entrega

- **Relatório** em `docs/produto/captura-varredura-sem-rn-<AAAA-MM-DD>.md`, quarto irmão dos três já
  escritos, com a numeração de achado **contínua a partir de `2.15`** — 2.1 a 2.14 estão usados e
  nenhum número se reaproveita.
- **Tabela de cobertura**, uma linha por arquivo: `arquivo · lente · o que a lente selecionou ·
  quantas ocorrências`. É ela que torna a trava 6 auditável por quem não rodou nada.
- **Lista de busca dirigida usada**, para o próximo reproduzir: os termos da terceira passada
  (`não registra`, `sem registro`, `não grava`, `não captura`, `não produz fato`, `descartado`,
  `não é necessário`, `sem trilha`, `sem autor`) mais os da lente D (`fallback`, `piso`, `degrada`,
  `ignora`, `recusa`, `descarta`, `não existe o nó`).
- **Um item em `docs/backlog/` por achado, agrupado por fluxo, nunca por mecanismo**
  ([[convention-achado-agrupa-por-fluxo-nunca-por-mecanismo]]), cada um com dono. Achado que não vira
  item é declarado no relatório **com o motivo** — achado que não vira item some, e foi por isso que
  `F-012` e `F-013` existem.
- **Cada achado classificado em ausência decidida × acidental**
  ([[convention-ausencia-decidida-versus-acidental]]).

A rubrica de registro por cenário de `.claude/rules/produto.md` (`Fonte primária (URL)`, `Limitação
encontrada`) **não se aplica**: não há tecnologia de terceiro em prova nem limitação externa a
confirmar. O registro é o do achado numerado dos três irmãos.

## Critério de conclusão

O aceite é a observação documentada, não achado encontrado:

1. A diferença de conjunto entre os 31 arquivos e a cobertura é vazia, **provada pelo comando**.
2. Nenhuma linha de cobertura tem seletor zero.
3. Toda zona aparece na tabela. **Zona sem nenhum achado é resultado válido** — e só é válido com a
   lente não-vazia do item 2 ao lado.
4. Todo achado tem dono e item, ou tem o motivo escrito de não ter virado item.
5. **Nenhuma `RN` nova.** Sem decisão do humano, achado vira card — é a regra que as três passadas
   anteriores seguiram, e ela não muda aqui.

O relatório registra o que **não** foi encontrado com a mesma clareza do que foi. Varredura que só
reporta achado vira propaganda de si mesma, e a próxima pessoa não sabe o que já foi olhado.

## Fora de escopo

- **`memory/**`** — não entra nesta passada. Registro de memória é datado e deriva de decisão que mora
  em outro lugar; e a leitura de `memory/` é por índice, nunca por varredura
  (`.claude/rules/memoria.md` §2). **Condição de volta, declarada:** se qualquer achado das quatro
  zonas apontar um registro de memória como **única** fonte de um comportamento fechado, isso abre
  passada própria, com o `orquestrador` como dono da escrita.
- **`apps/**` e `db/**`** — código. O descarte na borda do executor já tem item (`F-004`), e a
  auditoria de `apps/api/**` é de `seguranca`. Achado de código sai daqui como pergunta, não como item.
- **`.claude/agents/**`** — descreve papel de agent, não comportamento do produto. Mesma condição de
  volta do `memory/**`.
- **`docs/auditorias/**`, `docs/backlog/**` e `tarefas/**`** — registro histórico, não governam
  comportamento. Os quatro arquivos de revisão de backlog já foram lidos na terceira passada
  (`captura-varredura-terceira-passada-2026-09-12.md:47-51`).
- **Aplicar qualquer correção** nos arquivos varridos. `produto` não escreve em `.claude/rules/**`,
  `docs/design/**` nem `CLAUDE.md`. A exceção é o único arquivo da quinta zona, que é dele.
- **Os quatro arquivos acima do teto de 400 linhas** não são partidos aqui.

## Referências

`CLAUDE.md` §7.10 · `.claude/rules/ui.md` §1 · `.claude/rules/backend.md` §4 · §5 ·
`docs/produto/captura-varredura-invariante-10-2026-09-11.md` §2 ·
`docs/produto/captura-varredura-terceira-passada-2026-09-12.md` §1 · §2.14 ·
`docs/produto/fronteira-do-nucleo.md:59` · `docs/produto/roadmap-de-modulos.md:154` ·
`docs/produto/superficie-por-papel-momentos.md` ·
`tarefas/T-0010-invariante-10-captura.md` §Fechamento (`SOBROU`) ·
`memory/processo/convention-varredura-de-captura-infeliz-primeiro-e-ancora-rn-nao-basta.md` ·
`memory/processo/convention-achado-agrupa-por-fluxo-nunca-por-mecanismo.md` ·
`docs/backlog/F-004-recusa-de-borda-do-executor-vira-evento.md` ·
`docs/backlog/F-012-no-de-manifesto-descartado-vira-fato.md`

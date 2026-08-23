# Custo no terminal — caminho crítico e volume de fato — T-0004, passo 5

> **Irmão de `2026-08-23-custo-de-agregacao-do-provedor.md`, com o mesmo peso.** Eixo da partição: **onde
> o custo é pago**. Lá, o custo no **servidor**: período aberto, agregado, fan-out, retenção (`CST-03`,
> `04`, `05`, `06`). Aqui, o custo no **terminal**: o caminho crítico do caixa e o volume dos fatos que ele
> produz (`CST-01`, `02`, `07`, `08`). **O índice completo dos oito achados e o método do lado do banco
> moram no irmão**; numeração de achado contínua entre os dois. Partição declarada porque o texto único
> fechou em **420 linhas**, acima do teto de 400.
>
> **Não existe código, banco, terminal nem dado.** Por `.claude/rules/performance.md` §1, **nenhum número
> aqui foi medido**; estimativa vai rotulada `ESTIMATIVA`, com a conta à vista e as hipóteses nomeadas como
> hipóteses. Nenhuma decisão aberta presumida (`D-01` a `D-05`, e `D-06` do passo 4).

| ID | Título curto | Sev |
|---|---|---|
| `CST-01` | O único freio legítimo ao grão fino é custo **medido**, e ele não é exercitável: faltam duas grandezas e o hardware-alvo | ALTO |
| `CST-02` | A ordem de sacrifício de `RN-NUC-046` tem duas classes e deixa fora exatamente as quatro de maior volume do caminho crítico | ALTO |
| `CST-07` | `operation_refused` é o único fato desta família cuja cardinalidade **não** é limitada pelo negócio do cliente, e o valor que a governa não é declarado por ninguém | ALTO |
| `CST-08` | "Terminal-alvo modesto" não é especificado em lugar nenhum: nenhuma medida de caminho crítico é reprodutível nem comparável entre releases | MÉDIO |

---

## 1. O que precisaria rodar para medir, do lado do terminal — e por que nada rodou

**Não rodei nada**: não há aplicação, não há terminal-alvo definido (`CST-08`) e não há dado. O lado do
banco está no irmão, §1.

**Lado do terminal** — o que decide o §2 e é o único que não aceita regressão:
1. Percebido de `leitura de código → item na tela` no terminal-alvo, **com a fila no teto e drenando**
   (`RN-OFF-030`, `offline-grandezas-e-orcamento.md:54-72`) — não em repouso.
2. O **delta** desse percebido com e sem a gravação durável do fato no caminho. Esse delta é o número
   inteiro da decisão sincrônico × assíncrono; nada mais é.
3. O mesmo sob **rajada de recusa** (`RN-NUC-043`, infeliz) — o cenário que `RN-NUC-046` existe para
   sobreviver.

Os três estão bloqueados por algo mais barato que código: **qual é o terminal-alvo** (`CST-08`).

---

## 2. Caminho crítico do caixa — o único orçamento que não aceita regressão

O risco foi declarado pelo passo 3 e é `PERGUNTAS` dirigida a mim (`fatos-de-operacao.md:372-376`): um
fato por lançamento pode encostar no orçamento de **≤ 150 ms percebido** (`.claude/rules/performance.md`
§3). Três partes: o que o fato **é**, se precisa ser sincrônico, e o que medir.

### 2.1 O fato do lançamento não é telemetria acrescentada ao lançamento

`order_item_added` **é** o registro do lançamento (`RN-NUC-041`, `fatos-de-operacao.md:62-72`), não um
segundo trabalho sobre ele — e o pedido em construção já é local por regra vigente (`RN-NUC-001`), logo a
linha já é escrita no terminal hoje. O que `LACUNA-NUC-038` acrescentaria não é a escrita local: é a
**sincronização** dela. Isso deixa a pergunta na forma exata: **o custo em disputa é a durabilidade local
do fato dentro do caminho, não o envio.** O envio nunca precisou ser sincrônico — enfileirar e drenar já é
o contrato (`RN-OFF-004`, `RN-OFF-013`), com cessão ao caixa já declarada (`RN-OFF-030`).

### 2.2 Precisa ser sincrônico? Não — e a razão é estrutural, não de desempenho

`sale_concluded` tem grão **por item de venda** (`fatos-de-operacao.md:237`). Logo os itens que
sobrevivem até a venda **não dependem** de `order_item_added` para existir: perder um
`order_item_added` em voo não perde item vendido, não perde dinheiro e não perde obrigação fiscal —
perde **ciclo de vida** (o que entrou e saiu antes de concluir). Essa é a assimetria que autoriza o
assíncrono, e ela é da mesma família da ordem de sacrifício que `RN-NUC-046` já declarou para recusa e
conectividade.

**Seis garantias, todas necessárias, para o assíncrono não perder o fato** — nenhuma é nova, todas são
regra vigente aplicada a este fato:
1. **Identidade cunhada no terminal** antes do buffer (`RN-OFF-013`) — sem ela um flush repetido depois de
   queda duplica, e duplicata em fato de operação envenena toda contagem derivada.
2. **Auto-suficiência do fato de dinheiro**: `sale_concluded` não referencia `order_item_added` para compor
   a venda. Se algum dia referenciar, a garantia cai e o assíncrono deixa de ser admissível.
3. **Contagem de descarte durável** (`RN-NUC-046`): o contador de perdido sobrevive ao evento que causou a
   perda, senão a série mente por omissão exatamente no incidente.
4. **Sem lock e sem transação compartilhada** com o caminho de venda — cláusula (b) de `RN-OFF-030`
   aplicada a outro produtor. **5. Contrapressão nunca vira recusa de venda** (`RN-NUC-046`, `RN-OFF-015`):
   buffer cheio descarta diagnóstico, jamais para o caixa. **6. Janela de perda declarada e finita** —
   "assíncrono" sem janela nomeada é perda de tamanho desconhecido; a janela é grandeza, o valor é do
   humano (regime de `RN-OFF-028`/`029`).

Onde o assíncrono **não** vale: `sale_concluded`, `payment_registered`, `cash_movement` e o desfecho
fiscal — são dinheiro, a regra deles já existe (`RN-OFF-014`, `RN-OFF-015`, `.claude/rules/dados.md` §4),
e não proponho mexer em nenhum.

### CST-01 — O único freio legítimo ao grão fino é custo **medido**, e ele não é exercitável hoje — [ALTO]
ONDE: `docs/produto/fatos-de-operacao.md:62-72` (freio (a) de `RN-NUC-041`) e `:234`; tabela de grandezas
em `docs/produto/offline-grandezas-e-orcamento.md:101-125`; orçamento em `.claude/rules/performance.md`
§3 (linha 27).
MEDIDO: nada. `ESTIMATIVA`: nenhuma — a conta não existe porque **faltam os dois operandos**.
CAUSA: `RN-NUC-041` admite dois freios ao grão fino, e um é "custo **medido** — não estimado — que o
`performance` mede e reporta". Para exercitá-lo faltam duas grandezas que a tabela de `RN-OFF-029` **não
tem**, e é a tabela que existe para tê-las: **(i) custo do registro durável de um fato no caminho crítico**
(ms, sob drenagem no teto) e **(ii) fatos de operação por lançamento** (contagem — um lançamento produz
`order_item_added` e pode produzir também `operation_refused` quando o item não tem preço publicado, então
o multiplicador não é 1 e não é conhecido). Sem as duas, o freio (a) é inalcançável: ninguém pode reduzir
grão legitimamente, nem afirmar que o fino cabe. A consequência não é lentidão — é **o grão decidido por
default** no primeiro código, que é o modo de falha que `RN-NUC-041` existe para impedir.
`LACUNA-NUC-039` (teto de fato de diagnóstico no terminal) tem dono `performance` e também não tem linha
naquela tabela.
CRESCE COMO: `O(lançamentos)` por terminal por dia; o multiplicador por lançamento é `1 + P(recusa)`, e
`P(recusa)` não é medida.
CORREÇÃO SUGERIDA: acrescentar as três grandezas (custo do fato no caminho crítico, fatos por lançamento,
espaço por fato de diagnóstico retido) à tabela de `RN-OFF-029`, com unidade e sem valor — dono: `produto`
(a grandeza), `humano` (o valor), `performance` (a medida, quando houver terminal e código).

### CST-02 — A ordem de sacrifício enumera duas classes e deixa fora as quatro de maior volume do caminho crítico — [ALTO]
ONDE: `docs/produto/fatos-de-operacao.md:197-204` (`RN-NUC-046`, enunciado).
MEDIDO: nada. É achado de **completude de enunciado**, e ele se confere lendo a lista.
CAUSA: `RN-NUC-046` declara dois níveis — dinheiro cede por último; **recusa** e **conectividade** cedem
antes. Os quatro fatos de ciclo de vida do pedido (`order_opened`, `order_item_added` na parte da linha
retirada, `order_item_removed`, `order_abandoned`) **não estão em nenhum dos dois**, e são os de maior
volume dentro do caminho crítico e os que o humano pediu primeiro. Falta declarada = falta decidida na
construção: o implementador escolhe, e a escolha plausível é tratá-los como dinheiro, porque nascem no
fluxo da venda. Esse é o pior desfecho — diagnóstico protegido no nível da venda enche o disco do terminal
isolado e o caixa cede primeiro: o defeito grotesco e plausível que o próprio motivo de `RN-NUC-046`
descreve, na única classe que a regra esqueceu.
CRESCE COMO: `O(itens lançados)` = `O(vendas × itens/venda)` por terminal; a parte irrecuperável cresce
com `O(retiradas)`, cuja razão sobre lançamentos não é medida.
CORREÇÃO SUGERIDA: uma cláusula em `RN-NUC-046` colocando os quatro fatos de ciclo de vida do pedido no
nível que cede **junto com** recusa e conectividade, com o descarte contado — e a decisão de
`LACUNA-NUC-038` chegando ao humano **com esta consequência à vista** — dono: `produto`.

---

## 3. Os quatro fatos de maior volume — forma e o que quebra primeiro

Faixas de cardinalidade como pede `.claude/rules/dados.md` §3 (item 5): `10²`, `10⁶`, `10⁹` linhas na
tabela, por schema. Nenhuma faixa é previsão: são bandas para dizer **o que quebra primeiro em cada uma**.

| Fato | Cresce como | `10²` | `10⁶` | `10⁹` |
|---|---|---|---|---|
| `order_item_added` | `O(vendas × itens/venda)` — limitado pelo **negócio** do cliente | nada quebra | nada quebra com índice no instante | quebra **primeiro a leitura de `RN-REL-010`** (item × período, múltiplos ciclos fechados, `relatorios-semente-de-perguntas.md:56-78`): ela varre a janela inteira antes de existir a primeira página, e paginação limita **saída**, nunca **entrada** (correção 2 do registro de memória, `:25-27`). Depois dela, o backfill de qualquer coluna nova nesta tabela, em N schemas |
| `order_item_removed` | `O(retiradas)` ⊂ `O(lançamentos)`; a razão **não é medida** | nada | nada no banco; começa a pesar na **fila local** e na drenagem | quebra **primeiro a drenagem**, não a consulta: "tempo até fila zero no **pior terminal do maior cliente**" (`offline-grandezas-e-orcamento.md:112`) cresce com fato que não é venda, e o teto de `RN-OFF-014` é contado em **vendas concluídas pendentes** — ou seja, o teto que recusa venda nova **não mede** o que está enchendo o disco. A defesa existe (`RN-OFF-015` + `RN-NUC-046`), mas o teto e o enchimento passaram a ter unidades diferentes |
| `operation_refused` | `O(duração da falha × taxa de retentativa)` — **não** limitado pelo negócio | nada | a série de diagnóstico já é maior que a de venda em terminal com link ruim | quebra **primeiro o recurso local do terminal isolado** (cenário literal de `RN-NUC-046`), depois a **escrita** no servidor durante a volta em massa (`RN-OFF-031`), depois a leitura por motivo — que é a mais barata das três, porque o agrupamento é fechado em 8 |
| `terminal_connectivity_state_change` | `O(terminais × transições)` = `O(instabilidade do link)`, também **não** limitado pelo negócio | nada | nada | link oscilando produz transições sem teto declarado (o grão proíbe **amostragem periódica**, `fatos-de-operacao.md:244`, o que está certo, mas não limita transição real). Quebra primeiro o mesmo recurso local; e a leitura **nossa** ("quantos terminais sem contato, por quanto tempo") é derivada de série por terminal, `O(terminais × transições)` por janela, **vezes** fan-out `O(schemas)` |

**A armadilha desta tabela é de desenho, não de volume:** a ordem de sacrifício descarta **recusa e
conectividade primeiro** — que são o diagnóstico da condição que causou o descarte. A série mais provável
de faltar é a do incidente que ela existe para explicar. `RN-NUC-046` mitiga exigindo que o descarte seja
**contado**, e a mitigação só vale se o **contador** for mais durável que o descartado — garantia 3 da
§2.2, que não está escrita em regra nenhuma.

### CST-07 — `operation_refused` é o único fato cuja cardinalidade não é limitada pelo negócio, e o valor que a governa não é declarado por ninguém — [ALTO]
ONDE: `docs/produto/fatos-de-operacao.md:143-146` (`RN-NUC-043`, infeliz — a rajada está nomeada) e
`:254-258`; lista de valores operacionais em `docs/produto/offline-grandezas-e-orcamento.md:16-38`
(`RN-OFF-028`) e tabela de grandezas em `:101-125`.
MEDIDO: nada. **`ESTIMATIVA`, com a conta à vista e a hipótese declarada como hipótese:** um terminal em
`D2` que retenta uma operação recusada a cada `1 s` durante `8 h` produz `8 × 3600 = 28.800` fatos de
recusa naquele terminal, naquele dia — contra a ordem de grandeza de **vendas** do mesmo dia, que é o que
o disco foi dimensionado para guardar. **O `1 s` é hipótese minha, não medida e não configurada**; troque
por `10 s` e a conta cai para `2.880`. É exatamente por isso que o achado é sobre **quem escolhe esse
número**, não sobre o número.
CAUSA: a rajada é nomeada na regra, mas o valor que a governa — espaçamento entre **retentativas de
operação recusada** — não está na lista de `RN-OFF-028` (que enumera espaçamento e tentativas da
**drenagem**, `RN-OFF-012`, coisa diferente) nem tem linha na tabela de `RN-OFF-029`. Resultado: a
cardinalidade da tabela cujo modelo a Fase 1 vai desenhar (partição, índice, retenção) é função de um
valor que nenhuma regra declara como configurável, e portanto vai nascer constante embutida — que é
precisamente o que `RN-OFF-028` existe para impedir.
CRESCE COMO: `O(duração da indisponibilidade × 1/espaçamento × terminais)`. Independente de venda.
CORREÇÃO SUGERIDA: declarar o espaçamento de retentativa de operação recusada como valor operacional de
`RN-OFF-028`, com linha na tabela de `RN-OFF-029` — dono: `produto` (a grandeza), humano (o valor).

---

## 4. Um achado que é pré-requisito de todos os números acima

### CST-08 — "Terminal-alvo modesto" não é especificado em lugar nenhum — [MÉDIO]
ONDE: `.claude/rules/performance.md` §3 (última linha da tabela: "meça no fraco, não no seu");
`docs/produto/offline-grandezas-e-orcamento.md:66-67`; `docs/produto/fatos-de-operacao.md:375`.
MEDIDO: nada — e é este o ponto.
CAUSA: três artefatos mandam medir no terminal-alvo modesto e **nenhum diz qual é ele** (busca em `docs/`
e `memory/`: as três ocorrências acima e nada mais). Consequência: nenhuma medida de caminho crítico é
**reprodutível** nem **comparável entre releases**, e o orçamento de 150 ms significa coisas diferentes em
máquinas diferentes — o mesmo que não ter orçamento. É também o que bloqueia hoje o freio (a) de
`RN-NUC-041` (`CST-01`): não se mede o que não tem onde medir.
CRESCE COMO: não cresce; é constante e barato de resolver, e é pré-requisito de todo número do §1.
CORREÇÃO SUGERIDA: declarar o terminal-alvo como referência nomeada e versionada (o que ele é, não quanto
ele custa), com dono — dono: humano (é decisão comercial e de hardware), registrada como `decision`.

---

## 5. O que eu **não** consegui verificar — e não aprovo por ausência de evidência

1. **Nenhum número.** Sem terminal-alvo, aplicação e dado, não houve tempo real medido de nada. Todo
   `O(...)` aqui é forma derivada de spec.
2. **Não afirmo orçamento estourado.** `CST-01` diz que o **freio por custo medido não é exercitável**, o
   que é diferente e é o que o disco sustenta.
3. **Não avaliei grão nem retenção** — passo 4, do `arquiteto-dados`; onde precisei, virou `PERGUNTAS`.
4. **Não li** as specs de módulo (`MSA`, `COZ`, `PCF`, `PER`, `EMI`) além do que `fatos-de-operacao*.md`
   afirma delas; os fatos de módulo não estão enumerados (passo 3), então o volume que eles acrescentam ao
   terminal é **desconhecido e não estimado**.
5. **Não conferi na fonte** `RN-NUC-001`, `RN-NUC-003`, `RN-NUC-008`, `RN-NUC-013`, `PN-01`: citei-os pelo
   que `fatos-de-operacao*.md` e a auditoria do passo 2 afirmam deles.

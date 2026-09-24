# Fatos de operação — o ciclo de vida do pedido: o fato **sobre** o pedido, que não é o pedido

> **Quinto irmão de `fatos-de-operacao.md`, com o mesmo peso normativo.** Nasceu em 2026-09-11, da
> decisão do humano sobre `LACUNA-NUC-038`: **saída `B`**, o fato aditivo próprio
> (`captura-ciclo-de-vida-do-pedido-proposta.md` §4). Os quatro fatos de ciclo de vida saem de
> `PROVISÓRIA` e viram regra aqui — `RN-NUC-052` a `RN-NUC-055`.
>
> **Eixo da partição.** Os eixos anteriores são *quem pratica o fato*, *o domínio fechado de valor que
> ele carrega* e *o fato depois do instante*. O deste arquivo é a distinção que a decisão do humano
> fixou: **o pedido × o fato sobre o pedido**. São dois objetos de naturezas opostas — um é local,
> mutável e fora da fila (`RN-NUC-001`); o outro é aditivo, imutável e enfileirado. Confundi-los é o
> único jeito de errar caro aqui, e é o erro que a §1 existe para tornar impossível. O irmão principal
> fechou em 380 linhas, então o conteúdo novo não cabia lá mesmo que o eixo não existisse.
>
> **O que este arquivo não é.** Não é tabela, coluna, índice, tipo, chave nem retenção. O **grão** dos
> quatro fatos continua **candidato** na tabela do irmão principal (§3), e o veredito é do
> `arquiteto-dados`. **Nenhum número:** volume, teto e retenção entram como grandeza com unidade e sem
> valor. **As lacunas e as perguntas dos cinco moram no irmão principal** (§7).
>
> **Formato das regras:** `Enunciado` · `Escopo` · `Motivo` · `Aceite` · `Infeliz`.

---

## 1. O pedido não sobe; o fato sobre ele sobe

`RN-NUC-001` continua intacta, palavra por palavra: o pedido em construção pertence a **um** terminal,
é criado, alterado e descartado ali, e **nunca** entra na fila. Nada nas quatro regras abaixo o torna
compartilhado, versionado, reconciliável ou dependente de resposta de servidor.

O que atravessa a rede é outro objeto:

```
pedido nasce no terminal          → order_opened        fato aditivo, enfileira
item lançado                      → order_item_added    e sobrevive à retirada
item retirado antes de concluir   → order_item_removed  fato aditivo
pedido morre sem virar venda      → order_abandoned     fato aditivo, com as linhas que ele tinha
```

| | pedido em construção | fato sobre o pedido |
|---|---|---|
| Natureza | mutável | append-only |
| Classe de convergência | fora da fila (`RN-NUC-001`) | 1 (`RN-OFF-004`) |
| Alguém o lê para operar | o terminal que o construiu | ninguém |
| Volta ao terminal | — | nunca |
| Ordem importa | sim, no terminal | não: dois terminais produzindo o mesmo tipo no mesmo minuto não colidem |
| Espera confirmação | — | não consulta ninguém, não espera nada (`RN-OFF-018`) |

Os quatro nascem **no instante** em que a coisa acontece, no relógio do terminal (`RN-OFF-019`), com
autor identificado (`RN-OFF-033`, `RN-NUC-029`), terminal, estabelecimento e o modo de atendimento
vigente naquele instante (`RN-NUC-048`b). A decisão que cada um informa e quem a consome estão na
tabela de `fatos-de-operacao.md` §3, que é onde `RN-NUC-044` os cobra — nenhuma regra daqui redefine
consumidor.

**O operador não vê nada.** Nenhum modal, nenhuma confirmação, nenhuma etapa a mais no caminho
crítico. Registro que precisa de resposta para o caixa seguir é registro que derruba o caixa no dia em
que a rede cair (`CLAUDE.md` §7.10, terceiro limite), e nenhum dos quatro tem essa forma.

---

## 2. As quatro regras

### RN-NUC-052 — Pedido aberto é fato aditivo próprio; o pedido continua local, e o que sobe é a notícia de que ele existiu

**Enunciado** ao nascer um pedido em construção no terminal, o produto registra `order_opened` como
fato aditivo próprio — classe 1 (`RN-OFF-004`), append-only —, com o instante do terminal, o autor, o
terminal, o estabelecimento e o modo de atendimento vigente. O fato **não é o pedido**: não carrega
estado mutável, não volta ao terminal, não participa de convergência, ninguém o lê para operar, e ele
não torna o pedido compartilhado entre terminais. Nenhum passo do fluxo de venda espera por ele.

**Escopo** núcleo. Um posto, uma padaria e uma loja de roupa precisam **todos** saber quantos
atendimentos começaram, porque sem isso nenhum deles tem denominador para nada.

**Motivo** sem `order_opened` não existe **denominador**: nenhuma taxa de conversão, em nenhuma
janela, nem para trás nem para frente, porque fato não tem backfill. E a hipótese offline deixa de ser
falsificável — "a loja não vendeu às 15h" e "o terminal morreu no terceiro item às 15h" produzem a
mesma série, e nada escolhe entre as duas
(`memory/plataforma/gotcha-zero-venda-nao-se-distingue-de-terminal-morto.md`). Com o fato, terminal
morto não produz contagem e loja parada produz contagem de aberturas sem conclusões: as duas
explicações passam a ter séries diferentes.

**Aceite** em `D2`, abrir três pedidos e concluir um. Ao restabelecer o contato existem **três**
`order_opened` e **uma** `sale_concluded`; o operador não viu modal nem etapa a mais em nenhum dos
três; nenhum pedido apareceu em outro terminal nem na contagem de pendências (`RN-NUC-001`, aceite); e
a pergunta "quantos atendimentos começaram e não fecharam, por faixa do dia" é respondível com o fuso
declarado (`RN-NUC-042`), sem coleta nova. Teste negativo: nenhum `order_opened` é contador por faixa,
por hora ou por terminal (`RN-NUC-041`).

**Infeliz** o terminal não consegue registrar o fato (recurso local no limite) → a **venda não para**:
o fato cede junto com recusa e conectividade, o descarte é contado, e a contagem sincroniza acima do
que ela conta (`RN-NUC-046`, segunda cláusula). A leitura daquele terminal declara "houve descarte",
nunca "não houve atendimento" (`RN-REL-005`).

### RN-NUC-053 — A linha retirada continua existindo como fato; retirar não apaga o lançamento

**Enunciado** `order_item_added` é registrado no instante do lançamento e **não é apagado, editado nem
compensado** quando a linha sai do pedido. O pedido é mutável; o fato sobre o lançamento não é.
Retirar produz **fato novo** (`RN-NUC-054`), nunca a supressão do anterior — é a disciplina de
`RN-NUC-008` (correção é fato novo) aplicada um passo antes da conclusão.

**Escopo** núcleo. O par lançar↔retirar é a única evidência de erro de operação, de indecisão do
cliente-final e de falta de produto nos três negócios do teste de fronteira.

**Motivo** isto já estava escrito, e estava escrito no lugar que não obriga ninguém: a coluna de
**grão candidato** de `fatos-de-operacao.md` §3 diz "linha retirada depois continua existindo", e grão
candidato é proposta cujo veredito é do `arquiteto-dados`. Uma implementação que remova a linha do
pedido e o fato junto satisfaz todas as regras aprovadas hoje, e é o desfecho mais plausível, porque é
o que a estrutura mutável do pedido sugere. O que se perde nele é exatamente o que sustenta três das
seis perguntas da decisão: sem o lançamento retirado, a base guarda só a cesta sobrevivente, e "o que
entra e sai" nunca existiu.

**Aceite** lançar cinco itens, retirar dois, concluir a venda com três. A venda tem três itens; os
fatos daquele pedido são **cinco** `order_item_added` e **dois** `order_item_removed`; e a pergunta
"qual item foi lançado e retirado antes de concluir, por faixa do dia" (`RN-NUC-041`, aceite) é
respondível sem coleta nova. Teste negativo: nenhum caminho do produto apaga, reescreve ou marca como
inválido um `order_item_added` já registrado.

**Infeliz** a mesma linha é lançada e retirada em rajada — operador corrigindo quantidade digitada → o
fato é registrado **por ocorrência**. Compressão de rajada, se existir, é decisão de grão com custo
**medido** (`RN-NUC-041`, freio (a)), nunca supressão silenciosa da segunda ocorrência em diante, que
é onde mora o sintoma de "o caixa 3 lança tudo duas vezes".

### RN-NUC-054 — Item retirado antes de concluir é fato; o motivo vem do fato de recusa, e não se pergunta ao operador

**Enunciado** retirar linha de pedido em construção registra `order_item_removed` no instante da
retirada, com item, quantidade retirada, autor, terminal e o pedido a que a linha pertencia. Duas
cláusulas: **(a)** este fato **não tem lista de motivo própria** e **nunca** carrega texto livre como
campo de decisão; **(b)** quando a retirada decorre de operação **recusada**, o motivo é o da lista
fechada de recusa e quem o carrega é o fato de recusa (`RN-NUC-043`), que existe em paralelo e
referencia o mesmo pedido — a leitura correlaciona os dois pelo pedido e pelo instante, sem que
nenhum campo novo nasça.

**Escopo** núcleo.

**Motivo** a retirada é o fato mais barato de registrar e o mais fácil de estragar, e o jeito de
estragá-lo é pedir o motivo ao operador. Perguntar "por que você retirou?" no meio do atendimento é
etapa a mais no caminho crítico, que `RN-OFF-018` recusa, e o custo recai no balcão cheio — onde a
resposta honesta deixa de ser dada e o campo passa a mentir. Onde o motivo existe **sem** perguntar,
ele já é enumerado: a recusa. A consequência de (a) é que nenhum campo de texto livre nasce aqui, e
isso importa pela trava de `RN-NUC-043` — enumeração aplicada depois, sobre texto livre, não estreita
nada. A porta que fica aberta é a lista de recusa, que já é fechada.

**Aceite** lançar item, retirar, concluir a venda sem ele: existe **uma** linha por retirada, com item
e quantidade, e o operador **não respondeu a nenhuma pergunta** — a venda segue no mesmo número de
toques que teria sem o registro. Teste negativo, conferível por busca: `order_item_removed` não tem
campo de motivo, e nenhuma superfície do produto pergunta ao operador por que ele retirou.

**Infeliz** o pedido inteiro morre logo depois da retirada → os dois fatos existem e são independentes
(`RN-NUC-055`); `order_abandoned` não substitui as retiradas, não as recompõe e não as contém, e
nenhuma leitura deduz uma da outra.

### RN-NUC-055 — Pedido morto é fato, com as linhas que ele tinha; "pedido morto não é venda" continua valendo, e é por isso que ele precisa de fato próprio

**Enunciado** pedido em construção que morre sem virar venda registra `order_abandoned` no instante da
morte, com as **linhas que ele tinha** e o valor composto naquele instante, mais autor, terminal,
estabelecimento e modo vigente. O fato **não é venda**: não entra em apuração de faturamento, não gera
obrigação documental, não move caixa, não altera o esperado da sessão (`RN-NUC-010`) e não é corrigível
por `RN-NUC-008`. Ele é o registro de que um atendimento existiu e não fechou. O que conta como morte é
o **descarte do pedido no terminal** (`RN-NUC-001`, `RN-NUC-003` infeliz c) — e só isso.

**Escopo** núcleo. A cesta quase vendida é a mesma pergunta no posto, na padaria e na loja de roupa, e
nenhum dos três a responde por outro caminho.

**Motivo** é o "quase vendido", e é o que um contador destrói: contagem responde "quantos", nunca "o
que eles queriam". A cesta abandonada é o insumo mais direto de sugestão ao comerciante, o passo da
desistência é o único jeito de transformar "desiste muito" em lugar onde consertar, e o **mesmo** item
abandonado em massa em N clientes é defeito de superfície nosso, não do negócio deles. As três
dependem do conteúdo, e o conteúdo não se reconstrói depois de o pedido morrer no terminal.

**Aceite** abrir pedido, lançar quatro itens, descartar. Existe **um** `order_abandoned` com as quatro
linhas e o valor composto no instante da morte; **nenhuma** venda existe; o fechamento da sessão de
caixa e o fechamento do dia (`RN-NUC-031`) não mudam em nada; e a pergunta "o que o cliente-final
queria e não levou, por faixa do dia" é respondível sem coleta nova. Teste negativo: `order_abandoned`
não aparece em nenhuma leitura de faturamento, no esperado da sessão nem em qualquer soma de dinheiro.

**Infeliz** (a) o recurso local está no limite → o fato cede junto com recusa e conectividade, com
descarte contado (`RN-NUC-046`, segunda cláusula), e a leitura de desistência daquele terminal declara
"houve descarte", nunca ausência de desistência. (b) o pedido em construção **se perde** sem que
ninguém o descarte — terminal reinstalado, trocado, perdido → **não há fato**, e a ausência é a de
`RN-OFF-016`, declarada como perda e não quantificável. O servidor **nunca** fabrica `order_abandoned`
retroativo por dedução de que um pedido aberto não virou venda: fato nasce no instante ou não nasce, e
inventá-lo depois é pior que não tê-lo, porque ele chega indistinguível dos verdadeiros.

---

## 3. Registra / Não registra

### O que este fluxo passa a registrar

- O **nascimento** do pedido, com terminal, estabelecimento, autor, instante e modo de atendimento
  vigente (`RN-NUC-052`).
- Cada **lançamento** de linha — e ele sobrevive à retirada da linha (`RN-NUC-053`).
- Cada **retirada** de linha antes de concluir, com item e quantidade (`RN-NUC-054`).
- A **morte** do pedido, com as linhas que ele tinha e o valor composto no instante (`RN-NUC-055`).
- A **falha em registrar** qualquer um dos quatro, como descarte contado, sincronizado acima do que
  ele conta (`RN-NUC-046`).
- O **modo de atendimento** vigente no instante de cada um dos quatro, nunca reescrito depois
  (`RN-NUC-048`b) — é o que torna "quantos atendimentos mudam de modo no meio" respondível.

### O que este fluxo deliberadamente **não** registra

- **Quem é o cliente-final.** Nenhum dos quatro carrega pessoa do outro lado do balcão. As quatro
  decisões que justificam esta captura — conversão, cesta abandonada, passo da desistência, defeito
  nosso em N clientes — são respondíveis por pedido, terminal, faixa do dia e modo de atendimento, e
  nenhuma pergunta quem era a pessoa. "Quem desistiu hoje voltou depois?" é de `CLF`, opt-in, com
  prazo declarado, e **não entra por dependência**.
- **Por que o operador retirou a linha.** Obter o motivo exige perguntar a ele no meio do atendimento,
  e isso é etapa a mais no caminho crítico (`RN-NUC-054`, motivo). Onde o motivo existe sem perguntar,
  ele já é enumerado na lista fechada de recusa.
- **Duração até desistir**, como campo. É derivada dos marcos (`RN-NUC-045`), e marco é o que se
  registra.
- **Conteúdo do pedido morto além do que já viaja na linha.** A observação do item viaja com a linha
  desde sempre (`RN-NUC-016`); a morte não coleta nada novo.
- **O que o operador tocou na tela até desistir.** Gravação de tela e de tecla está recusada, com as
  quatro partes, em `fatos-de-operacao.md` §6, item 4. Os marcos mais o fato de recusa respondem "onde
  trava" **por operação**, sem nomear pessoa na leitura.
- **A morte que ninguém declarou.** Pedido perdido com o terminal não vira `order_abandoned` depois
  (`RN-NUC-055`, infeliz b). Ausência declarada é verdade; fato retroativo é invenção que contamina os
  verdadeiros.
- **Pedido de canal externo.** O rascunho que o cliente-final monta e abandona é outro sujeito, em
  outro dispositivo, sob a sessão externa de `PCF` (`RN-PCF-016`) — achado 2.4 de
  `captura-varredura-invariante-10-2026-09-11.md`, e a decisão de `LACUNA-NUC-038` não o cobre.

---

## 4. O que estas regras não decidem

- **Grão** de cada um dos quatro: candidato na tabela do irmão principal, veredito do
  `arquiteto-dados` (`D-06`).
- **Custo medido** de um fato por lançamento no terminal modesto: pergunta 2 de `fatos-de-operacao.md`
  §7, dono `performance`. Ela pode reduzir grão com o freio (a) de `RN-NUC-041`; não reabre a decisão.
- **Retenção** por classe: `LACUNA-NUC-040`, que não fecha sem `LACUNA-REL-001` (`RN-NUC-049`).
- **De quem é a hora** para "faixa do dia" e "dia": `LACUNA-GLO-001`, carga de toda a família
  (`RN-NUC-042`).
- **Leitura por pessoa** dos quatro fatos: continua sendo decisão do humano (`RN-REL-008`), não
  consequência do registro.

## 5. Referências

`CLAUDE.md` §7.10 · `captura-ciclo-de-vida-do-pedido-proposta.md` · `nucleo-venda.md:92` ·
`nucleo-venda.md:157` · `fatos-de-operacao.md` §2, §3, §6, §7 ·
`fatos-de-operacao-retencao-e-descarte.md:43` · `fatos-de-operacao-dominios-fechados.md` §1.1 ·
`operacao-offline-e-sincronizacao.md:65` ·
`memory/plataforma/gotcha-zero-venda-nao-se-distingue-de-terminal-morto.md`

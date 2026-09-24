# Ciclo de vida do pedido — a proposta que fecha `LACUNA-NUC-038`

> **DECIDIDO EM 2026-09-11 — saída `B`.** O humano escolheu o **fato aditivo próprio** (§4) e autorizou
> a **revogação** do "nada sobe" de `RN-NUC-003` infeliz (c). O que passou a existir, na mesma data:
> a revogação datada em `nucleo-venda.md:157`, e os quatro fatos saindo de `PROVISÓRIA` para regra em
> `fatos-de-operacao-ciclo-de-vida-do-pedido.md` (`RN-NUC-052` a `RN-NUC-055`), com as duas listas
> `Registra / Não registra`. `RN-NUC-001` não foi tocada. **A pergunta deste documento está fechada** —
> o que segue abaixo é o material que sustentou a escolha, preservado como estava, e não é normativo.
>
> O texto substituto da §7 foi aplicado com **um ajuste**: ele cita `RN-NUC-055` no lugar de
> `fatos-de-operacao.md` §3, e carrega a marca datada da revogação. Número de regra é citável por banco,
> API e teste; ponteiro de seção não é, e cláusula revogada sem marca datada some do arquivo dono
> (`glossario.md` §4.2, mesma disciplina).
>
> **O que é.** A decisão do humano sobre `LACUNA-NUC-038` (`fatos-de-operacao.md:328`), escrita com as
> duas saídas, o custo de cada uma e o custo de adiar. Nasceu em 2026-09-11, do invariante 10
> (`CLAUDE.md` §7.10): a lacuna estava parada havia semanas porque não existia regra que dissesse de
> que lado fica o ônus, e agora existe.
>
> **O que ela não faz.** Não revoga nada. A cláusula que hoje impede a captura está identificada na §7
> com `path:linha` e a forma exata da revogação; **revogar é ato datado do humano**, e ele decide em
> uma linha: `A`, `B` ou `adiar`. Não decide prioridade nem prazo. Não modela tabela, coluna ou
> retenção — grão continua candidato e o veredito é do `arquiteto-dados`.
>
> **Nenhum número.** Volume, retenção e teto entram como grandeza com unidade e sem valor.

---

## 1. A decisão, em uma linha

Três saídas, e a terceira é uma escolha também:

- **`A` — o piso.** O terminal **conta** pedidos mortos e sincroniza só a contagem, com o primeiro e o
  último instante. Salva o denominador. Custa uma exceção escrita a `RN-NUC-041`, e hoje não há freio
  para sustentá-la (§3).
- **`B` — a captura de fato aditivo.** Os quatro fatos de ciclo de vida existem, como fato próprio que
  **não** sincroniza o pedido. `RN-NUC-001` fica intacta; o que cai é a cláusula de `RN-NUC-003`
  (§7). É a saída que o invariante 10 produz por default.
- **`adiar`** — continuar como está, com os quatro fatos marcados `PROVISÓRIA` e não agendáveis. O
  custo disso não é zero e tem data: §6.

## 2. O que está em jogo

Por regra vigente, pedido em construção é local ao terminal (`RN-NUC-001`, `nucleo-venda.md:92`) e
pedido morto não sobe (`RN-NUC-003`, infeliz c, `nucleo-venda.md:157`). Os quatro fatos do ciclo de
vida estão escritos, com decisão nomeada e consumidor declarado, e marcados `PROVISÓRIA` justamente
por isso (`fatos-de-operacao.md:236`, `:237`, `:238`, `:239`):

```
order_opened          pedido aberto
order_item_added      item lançado (a linha retirada continua existindo)
order_item_removed    item retirado antes de concluir
order_abandoned       pedido morto sem virar venda
```

Sem eles, seis coisas não existem no servidor, e nenhuma tem backfill:

| O que não existe | Consequência para quem lê |
|---|---|
| O **denominador** | nenhuma taxa de conversão, para trás, em nenhuma janela |
| A **cesta quase vendida** | o que o cliente-final queria e não levou, que é o insumo mais direto de sugestão ao cliente |
| **Em que passo** a desistência acontece | "desiste muito" sem lugar onde consertar |
| O par **lançar↔retirar** | erro de operação, indecisão do cliente-final e falta de produto chegam iguais |
| Defeito **nosso** de superfície | o mesmo item retirado em massa em N clientes não tem como ser visto |
| A hipótese **offline** | "a loja não vendeu às 15h" e "o terminal morreu no terceiro item às 15h" produzem a mesma série, e nada escolhe entre as duas |

A última é a que sustenta o resto: enquanto ela valer, todo diagnóstico de "vendeu menos" tem duas
explicações e nenhum dado que decida, e o relatório que o afirmar precisa declarar isso na própria
resposta. O registro em `memory/plataforma/gotcha-zero-venda-nao-se-distingue-de-terminal-morto.md`
tem o caso inteiro.

## 3. Saída `A` — o piso

O terminal mantém um contador de pedidos mortos e sincroniza três coisas: quantos, o instante do
primeiro e o instante do último. Nada mais atravessa a rede.

**Entrega:** o denominador. Com ele, "quantos atendimentos começaram e não fecharam" passa a existir,
e a curva de vendas deixa de ter duas explicações — a hipótese offline vira falsificável, porque
terminal morto não produz contagem e loja parada produz contagem zero com o terminal vivo.

**Não entrega:** nada sobre **o que** aqueles pedidos eram. Contagem responde "quantos", nunca "o que
eles queriam". Caem junto a cesta abandonada, o passo da desistência, o par lançar↔retirar e o
defeito nosso visto em N clientes — os quatro primeiros itens da tabela da §2, inteiros.

**O que ela custa em regra, e não é óbvio.** `RN-NUC-041` (`fatos-de-operacao.md:70`) proíbe
registrar agregado **no lugar** do fato, e um contador por terminal é exatamente isso. Adiar o grão
fino exige um de dois freios escritos: custo **medido** pelo `performance`, ou dado pessoal que a
minimização proíbe. Hoje não há nem um nem outro — a medida não foi feita (é a pergunta 2 de
`fatos-de-operacao.md:370`) e não há dado pessoal envolvido (§8). Então `A` não é a saída barata: ela
é uma exceção a uma regra aprovada, e a exceção precisa ser escrita com o motivo, como qualquer
outra.

**Quando `A` é a resposta certa:** se a medida do `performance` vier e disser que um fato por
lançamento não cabe no orçamento do caminho crítico no terminal modesto. Aí `A` deixa de ser exceção
e passa a ser o freio (a) de `RN-NUC-041` funcionando como projetado.

## 4. Saída `B` — fato aditivo próprio

O que sincroniza não é o pedido: é um fato aditivo próprio, append-only, classe 1 (`RN-OFF-004`,
`operacao-offline-e-sincronizacao.md:65`), que nunca carrega estado mutável e nunca torna o pedido
compartilhado entre terminais.

```
pedido nasce no terminal          → order_opened        (fato aditivo, enfileira)
item lançado                      → order_item_added    (já existe hoje)
item retirado antes de concluir   → order_item_removed  (fato aditivo)
pedido morre sem virar venda      → order_abandoned     (fato aditivo, com as linhas que ele tinha)
```

O pedido continua local, mutável e fora da fila, como `RN-NUC-001` manda. O fato **sobre** o pedido é
outro objeto: ele não é lido por ninguém para operar, não volta ao terminal, não participa de
convergência e não tem versão a reconciliar. Dois terminais que produzam fatos do mesmo tipo no mesmo
minuto não colidem, porque nada neles depende da ordem.

**Entrega:** as seis linhas da tabela da §2.

**Não entrega de graça:** volume. Os quatro fatos nascem no fluxo da venda e competem pelo recurso
mais escasso do terminal, e isso já está escrito — `RN-NUC-046`, segunda cláusula
(`fatos-de-operacao-retencao-e-descarte.md:43`), põe os quatro no mesmo nível de sacrifício da recusa
e da conectividade, com o descarte contado. Aprovar `B` é aprovar esse volume, com essa ordem de
sacrifício já decidida.

## 5. As duas saídas lado a lado

| | `A` — piso | `B` — fato aditivo |
|---|---|---|
| Denominador (conversão) | sim | sim |
| Cesta abandonada | não | sim |
| Passo da desistência | não | sim |
| Par lançar↔retirar | não | sim |
| Defeito nosso em N clientes | não | sim |
| Hipótese offline falsificável | sim | sim |
| Revoga `RN-NUC-003` infeliz (c) | sim | sim |
| Exceção a `RN-NUC-041` | **sim**, e sem freio hoje | não |
| Volume no recurso local do terminal | mínimo | o de `RN-NUC-046`, 2ª cláusula |
| Identifica cliente-final | não | não (§8) |
| Bloqueia o caixa | não (§9) | não (§9) |

As duas revogam a mesma cláusula. A escolha entre elas não é "capturar ou não": é **quanto** do
acontecimento sobrevive.

## 6. O que custa adiar, e a data que muda o custo

O custo tem duas fases, e a fronteira entre elas é **o primeiro terminal vendendo de verdade**.

**Hoje, antes desse terminal, o custo é de modelo.** A Fase 1 abriu em 2026-09-11 e o modelo do
núcleo de venda está sendo desenhado agora. Enquanto a lacuna estiver aberta, os quatro fatos são
`PROVISÓRIA` e **não são agendáveis** (`fatos-de-operacao.md:339`), então o modelo nasce sem eles.
Acrescentá-los depois de o modelo fechar é o ciclo expand/contract em N schemas
(`.claude/rules/migrations.md` §4), quando hoje seriam tabela nova numa migration de núcleo que ainda
não foi escrita. O custo de adiar, medido em trabalho, sobe no dia em que a migration do núcleo de
venda for aplicada em qualquer schema.

**Depois desse terminal, o custo é de fato, e é irrecuperável.** Cada dia de operação sem os quatro
fatos é um dia cuja série não existirá nunca — não existe backfill, e a decisão não é retroativa.
Aprovar `B` numa data qualquer produz série que começa naquela data: comparação de um período contra
o mesmo período do ano anterior só passa a existir doze meses depois da aprovação, e comparação
contra o período **anterior** à aprovação nunca existe.

**O que isso implica para a ordem das coisas:** a decisão precisa estar fechada antes do primeiro
terminal em operação, não antes de alguma reunião. Enquanto não houver terminal vendendo, adiar custa
retrabalho; no dia seguinte ao primeiro, passa a custar o que não volta.

## 7. A cláusula a revogar

Uma só, e ela está aqui:

**`nucleo-venda.md:157`** — `RN-NUC-003`, caminho infeliz (c):

> (c) o operador desiste no meio → o pedido morre, e pedido morto não é venda: nada sobe.

A metade que fica de pé é "pedido morto não é venda" — ela é verdadeira e nada nesta proposta a
toca. A metade a revogar é **"nada sobe"**, e a revogação é a distinção entre o **pedido** e o **fato
sobre o pedido**: o pedido continua não subindo; o fato sobe.

Forma sugerida da cláusula substituta, para o humano avaliar como texto e não como intenção:

> (c) o operador desiste no meio → o pedido morre e **não vira venda**; o pedido em si não sobe
> (`RN-NUC-001`), e o **fato** de ele ter existido e morrido sobe como fato aditivo próprio
> (`fatos-de-operacao.md` §3), que não carrega estado mutável nem torna o pedido compartilhado.

**Nenhuma outra regra precisa mudar para `B` valer.** `RN-NUC-001` fica intacta (o pedido continua
local, mutável e fora da fila); `RN-NUC-046` já classificou os quatro fatos na ordem de sacrifício;
`RN-NUC-044` já exige decisão nomeada e consumidor declarado, e os quatro já os têm na tabela de
`fatos-de-operacao.md:236`. Para `A` valer, além desta revogação, é preciso escrever a exceção a
`RN-NUC-041` com o motivo (§3).

Revogar é ato do humano, no arquivo dono. Esta proposta não altera `nucleo-venda.md`.

## 8. Os três limites do invariante 10, aplicados a este caso

**Dado pessoal — o valor pedido não precisa identificar o cliente-final, e isso simplifica a
decisão.** Conversão, cesta abandonada, passo da desistência e defeito nosso em N clientes são todos
respondíveis por **pedido**, **terminal**, **faixa do dia** e **modo de atendimento** — nenhum deles
pergunta quem era a pessoa. A cesta abandonada é uma lista de itens, não uma lista de nomes. Onde o
pedido veio do canal externo, a sessão de `PCF` já é anônima por construção e morre com o destino
(`RN-PCF-016`), então não há identidade a carregar nem a descartar.

Há exatamente uma pergunta vizinha que **precisaria** de pessoa — "quem desistiu hoje voltou depois?"
— e ela é de `CLF`, módulo próprio, opt-in, com prazo declarado. Ela não está nesta decisão, e não
entra por dependência.

O autor do fato continua existindo, e por outro motivo: o **operador** é registrado porque a trilha
exige (`RN-NUC-029`), como em qualquer fato. Ler por pessoa continua sendo decisão separada do humano
(`RN-REL-008`), não consequência do registro.

**Cartão, credencial e segredo:** não se aplicam. Pedido em construção não carrega dado de pagamento
— meio e resultado nascem na conclusão (`RN-NUC-004`, `RN-NUC-005`), e pedido morto não tem nenhum
dos dois.

**Registro jamais bloqueia a venda:** §9.

## 9. Como a captura não bloqueia o caixa nem depende de rede

O terminal opera offline por projeto, então a captura tem de ser indiferente à rede. Ela é, por três
propriedades que já estão escritas em outras regras:

```
fato nasce no terminal, no instante (RN-OFF-019)
→ é aditivo, classe 1 (RN-OFF-004): não consulta ninguém, não espera confirmação
→ enfileira e converge em qualquer ordem
→ falha ao registrar não interrompe a operação: vira fato próprio
```

Nenhum passo do fluxo de venda espera resposta do servidor por causa destes fatos. O operador não vê
nada: não há modal, não há confirmação, não há etapa a mais (`RN-OFF-018`).

E o caso em que o recurso local aperta já tem desfecho declarado: os quatro cedem **antes** do fato
de venda, pagamento e movimento de caixa, e o descarte é contado, com a contagem sincronizando acima
do que ela conta (`RN-NUC-046`, `fatos-de-operacao-retencao-e-descarte.md:32`). O terminal isolado
enche de diagnóstico e continua vendendo; a leitura que ler aquele terminal declara "houve descarte",
nunca "não houve desistência".

## 10. O que esta proposta deliberadamente não registra

- **Conteúdo de texto livre** do pedido morto além do que `RN-NUC-016` já rege. A observação do item
  viaja com a linha; nada novo é coletado por causa do abandono.
- **Identificação do cliente-final**, por tudo o que está na §8.
- **Duração como campo.** O tempo até desistir é derivado dos marcos (`RN-NUC-045`), e continua
  sendo.
- **Gravação de tela ou de tecla** para saber "onde trava" — já recusado, com as quatro partes, em
  `fatos-de-operacao.md:311`. Os marcos mais o fato de recusa respondem a mesma pergunta por
  operação, sem nomear pessoa na leitura.

## 11. Fora de escopo

- O **grão** de cada um dos quatro fatos: candidato, e o veredito é do `arquiteto-dados`.
- A **retenção** por classe: `LACUNA-NUC-040`, que não fecha sozinha (`RN-NUC-049`).
- O **custo medido** de um fato por lançamento no terminal modesto: pergunta 2 de
  `fatos-de-operacao.md:370`, dono `performance`. Ela muda **qual** saída é certa, não se a decisão
  existe.
- O abandono no **canal externo** (`PCF`), que é outro sujeito, em outro lugar: está na varredura, em
  `captura-varredura-invariante-10-2026-09-11.md` §2.4.

## 12. Referências

`CLAUDE.md` §7.10 · `nucleo-venda.md:92` · `nucleo-venda.md:157` · `fatos-de-operacao.md:70` ·
`fatos-de-operacao.md:236` · `fatos-de-operacao.md:328` · `fatos-de-operacao.md:370` ·
`fatos-de-operacao-retencao-e-descarte.md:32` · `fatos-de-operacao-retencao-e-descarte.md:43` ·
`operacao-offline-e-sincronizacao.md:65` · `.claude/rules/migrations.md` §4 ·
`memory/plataforma/gotcha-zero-venda-nao-se-distingue-de-terminal-morto.md` ·
`memory/plataforma/decision-capturar-e-o-padrao-nao-capturar-exige-justificativa.md`

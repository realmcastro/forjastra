# F-005 — `MSA`: perda de corrida e segundo consumo no mesmo alvo passam a ter diagnóstico próprio

**Tipo:** Comportamento fechado · **Estado:** a fazer · **Dono:** `produto` · **Território:**
`docs/produto/**` · **Cobre os achados** `2.3` e `2.7` da varredura do invariante 10

## Objetivo

Dois desfechos do consumo em aberto acontecem hoje sem deixar diagnóstico utilizável, e os dois são do
mesmo fluxo — duas mãos agindo sobre o mesmo alvo no salão.

**O primeiro é a perda de corrida.** `RN-MSA-005` (`docs/produto/modulos/mesa-comanda.md:150`),
`RN-MSA-006` (`:164`), `RN-MSA-008` (`:190`) e o aceite de `RN-PCF-009`
(`docs/produto/modulos/pedido-cliente-final.md:243`) descrevem o mesmo desfecho: dois operadores, ou um
operador e o canal externo, agem sobre o mesmo consumo e **um perde**. A recusa produz fato por
`RN-NUC-043`, mas o único motivo disponível é `business_precondition_unmet`
(`docs/produto/fatos-de-operacao-dominios-fechados.md:45`), que já carrega sessão de caixa fechada,
pedido sem item e lista de bloqueio. Colisão entra ali dentro e some.

**O segundo é o segundo consumo no mesmo alvo.** No infeliz de `RN-MSA-002` (`:107`), o operador que
encontra o alvo já com consumo aberto escolhe entre lançar no existente e abrir um segundo consumo
declarado — e **qual das duas ele escolheu** não fica em lugar nenhum.

Os dois sobem juntos porque se resolvem na mesma passada, sobre o mesmo arquivo e o mesmo conjunto de
regras, e porque medem a mesma coisa: **quantas vezes a superfície leva duas pessoas ao mesmo alvo**.

## Escopo

- **Motivo novo na lista fechada de recusa** (`fatos-de-operacao-dominios-fechados.md` §1),
  diagnosticando **concorrência sobre o mesmo objeto**. Nome sugerido, e o card pode recusá-lo:
  `state_changed_concurrently`. O caminho é o que `RN-NUC-043` já prevê — motivo novo entra por
  alteração daquela regra, com a `RN` dona citada (`:57`).
- **A `RN` dona do motivo**, escrita nesta passada, nomeando `RN-MSA-005`, `RN-MSA-008` e `RN-OFF-005`
  como as regras que o produzem.
- **Cláusula no infeliz de `RN-MSA-002`** dizendo que a escolha do operador — lançar no existente ou
  abrir segundo consumo — produz fato, e qual das duas foi.
- **As duas listas de captura** na spec de `MSA`, atualizadas na mesma passada: a seção
  `Registra / Não registra` de `modulos/mesa-comanda.md` §5 hoje nomeia as duas ausências **como
  acidentais**, citando `2.3` e `2.7`. Fechado o item, elas deixam de ser acidentais e as linhas mudam.

## Fora de escopo

- **Mudar qualquer desfecho de operação.** A perda de corrida continua sendo recusa, e continua sendo o
  estado atual que volta ao operador, nunca "última escrita ganha" (`RN-MSA-011`). O segundo consumo
  continua sendo escolha do operador. Este item acrescenta diagnóstico, não muda quem ganha.
- **Onde o fato repousa, por quanto tempo e com que grão** — `D-06`, `LACUNA-NUC-040`,
  `arquiteto-dados` e `performance`.
- **`RN-PCF-009` não é reescrita aqui.** O aceite dela cita o mesmo desfecho e passa a citar o motivo
  novo; a regra é de `PCF` e o corpo dela não muda.
- **Exclusividade de fechamento** (`RN-MSA-011`, `mesa-comanda.md:237`) — a regra já existe. O que este
  item entrega é a medida do que ela custa, não uma regra nova sobre ela.

## Critério de aceite

1. Dois operadores tentam transferir o mesmo consumo para alvos diferentes, ao mesmo tempo. O segundo é
   recusado com o estado atual, **e** a recusa dele carrega o motivo de concorrência — não
   `business_precondition_unmet`.
2. Um operador fecha o consumo enquanto o canal externo submete um lançamento para ele. A submissão é
   recusada, e a recusa carrega o mesmo motivo, distinguível da recusa por consumo inexistente.
3. Buscar, sobre uma janela, as recusas por concorrência de um estabelecimento devolve um número por
   alvo e por faixa do dia. Hoje essa consulta devolve tudo misturado com bloqueio e caixa fechada, e é
   por isso que o item existe.
4. Operador encontra alvo com consumo aberto e **lança no existente**; outro encontra o mesmo estado e
   **abre segundo consumo**. Os dois desfechos são distinguíveis no registro, sem inferir por
   proximidade de instante entre dois consumos do mesmo alvo.
5. Motivo aplicado a operação que **não** é colisão (bloqueio de item, caixa fechada) continua saindo
   com o motivo antigo. Enumeração que engole dois diagnósticos é o defeito que este item conserta; ele
   não pode criar um terceiro.

## Registra / Não registra

**Registra:**

- **A recusa por concorrência**, com o motivo próprio, o alvo disputado e o instante. É o que permite
  contar colisão por alvo, por praça e por faixa do dia — a série que diz se a divisão do salão está
  errada ou se a superfície leva duas pessoas ao mesmo lugar.
- **Qual regra produziu a recusa** (`RN-MSA-005`, `RN-MSA-008` ou `RN-OFF-005`). Transferência
  concorrente e fechamento concorrente são o mesmo motivo e problemas operacionais diferentes.
- **A escolha do operador diante do alvo já ocupado** — lançar no existente ou abrir segundo consumo.

**Não registra, e por quê:**

- **O conteúdo do lançamento que perdeu a corrida.** A tentativa recusada não gera linha de consumo, e
  copiar os itens dela criaria um segundo acervo do que nunca foi vendido, com outro leitor e outra
  retenção. Alvo, motivo, autor e instante respondem a pergunta que o fato existe para responder.
- **Identificação do cliente-final sentado no alvo.** Colisão é sobre a superfície e sobre a divisão do
  salão; quem estava na mesa não entra na resposta. `RN-MSA-014` já proíbe `MSA` construir histórico por
  pessoa, e nada aqui a toca.
- **Duração da disputa** — quanto tempo separou as duas tentativas. É marco, não duração
  (`RN-NUC-045`): os dois instantes existem e a diferença é derivável; campo de tempo seria o mesmo dado
  guardado duas vezes.

## Depende de

**Nada em aberto — o item é executável hoje.** `RN-NUC-043` já descreve como motivo novo entra
(`fatos-de-operacao-dominios-fechados.md:57`), `RN-NUC-056` é o precedente completo do mesmo movimento
feito em 2026-09-11 para identidade, e as quatro regras que produzem o desfecho já existem e estão
citadas acima.

**Uma trava de ordem, e ela é dura:** motivo enumerado aplicado depois, sobre campo que nasceu sem
enumeração, **não estreita nada** (`RN-NUC-043`). O motivo nasce agora ou não nasce — e "agora" quer
dizer antes de `MSA` ser modelado, não antes de ser construído.

**Passada compartilhada com `F-007`:** aquele item também acrescenta motivo à mesma lista fechada, por
alteração da mesma `RN-NUC-043`. Se os dois forem pegos juntos, a alteração da regra dona é **uma** só;
se forem pegos separados, o segundo cita o primeiro. O que não pode acontecer é duas alterações
independentes da mesma regra na mesma semana.

## Gate obrigatório

**`produto`** — fronteira: o motivo é do núcleo (lista fechada de `NUC`) e as `RN` que o produzem são de
módulo. Isso está certo e é o mesmo arranjo de `RN-NUC-056`; o card confirma que continua certo.

Nenhum gate de `seguranca` ou de `performance` **nesta** passada: ela é de spec, não toca DDL, endpoint
nem consulta. Os dois entram quando o fato for modelado.

## Referências

`docs/produto/captura-varredura-invariante-10-2026-09-11.md` §2.3 e §2.7 ·
`docs/produto/modulos/mesa-comanda.md:107` · `:150` · `:164` · `:190` · `:237` ·
`docs/produto/modulos/pedido-cliente-final.md:243` ·
`docs/produto/fatos-de-operacao-dominios-fechados.md:45` · `:57` · §1 (`RN-NUC-056`, o precedente) ·
`docs/produto/modulos/mesa-comanda.md` §5 (as duas listas) ·
`memory/plataforma/gotcha-motivo-enumerado-que-engole-dois-diagnosticos.md` · `F-007`

# F-007 — `PER`: código lido e não resolvido passa a separar catálogo incompleto de catálogo retido velho

**Tipo:** Comportamento fechado · **Estado:** escopo original **entregue** em 2026-09-23
(`tarefas/T-0016-nascer-lacuna-per-6.md`, fechada); escopo absorvido de `F-028` em 2026-09-23, **a
executar** (seção "Absorção de `F-028` — 2026-09-23") · **Dono:** `produto` · **Território:**
`docs/produto/**` · **Cobre o achado** `2.12` da varredura do invariante 10 e, desde 2026-09-23, o
`2.21` de `docs/produto/captura-varredura-sem-rn-2026-09-23.md`

## Objetivo

Uma leitura chega ao terminal, é válida, e não resolve para item nenhum. Hoje a recusa produz fato por
`RN-NUC-043`, e o motivo disponível é `published_artifact_missing`
(`docs/produto/fatos-de-operacao-dominios-fechados.md` §1.1), que diagnostica **publicação** — item sem
preço, limite não publicado, versão de regra ausente. **Duas causas diferentes caem ali dentro e somem:**

- o código que o cliente passa e o negócio **não tem cadastrado**;
- o código que existe no catálogo, mas o **catálogo retido naquele terminal** ainda não conhece
  (`RN-OFF-020`).

A primeira é trabalho de cadastro que o produto poderia entregar pronto em vez de cobrar: a lista dos
códigos que o negócio usa e o catálogo dele não tem. A segunda é defasagem de reconciliação, e a série
que a mede é a mesma que `RN-NUC-056` criou para identidade, pela mesma razão — **recusa que cresce com
a idade do retido é defasagem; recusa que não correlaciona com a idade é outra coisa e não se conserta
encurtando a janela.**

É o terceiro caso do mesmo padrão (`memory/plataforma/gotcha-motivo-enumerado-que-engole-dois-diagnosticos.md`),
depois de `2.2` (resolvido) e `2.3` (`F-005`).

## Escopo

- **O nascimento de `LACUNA-PER-6`** como regra do núcleo, numerada, com critério de aceite e caminho
  infeliz: o identificador de item que não resolve no catálogo aplicado, sem contato. Entrou no escopo
  em 2026-09-23 por ordem do humano (ficha `T-0016`, Pedido): "A lacuna de periféricos precisa nascer,
  pois então que ela nasça." A regra é `RN-NUC-063`.
- **Motivo próprio na lista fechada** (`fatos-de-operacao-dominios-fechados.md` §1.1), diagnosticando
  **leitura não resolvida**, por alteração de `RN-NUC-043` com a `RN` dona citada. Distinto de
  `published_artifact_missing`, que continua diagnosticando publicação.
- **Marco de reconciliação do catálogo retido**, sem o qual "idade do catálogo" é afirmada e não
  derivada. É a mesma cláusula que `RN-NUC-056` acrescentou para o conjunto de identificação, e é ela
  que faz a correlação idade × recusa existir.
- **A `RN` dona**, citando `RN-PER-014` (infeliz) e `RN-OFF-020`.
- **As duas listas de captura** na spec de `PER` (`modulos/perifericos.md` §3), que hoje nomeiam esta
  ausência **como acidental**, citando `2.12`.

## Fora de escopo

- **Mudar o desfecho da leitura não resolvida.** Ela continua recusada, continua dizendo ao operador o
  que fazer (`PN-17`), e o caminho por código do item continua existindo.
- **Cadastrar item a partir do código recusado.** O item entrega a lista; transformar lista em cadastro
  é capacidade, tem outro dono e não tem entrada no catálogo de capacidades. Nomeado aqui para não
  voltar como descoberta.
- **`published_artifact_missing`** não muda de significado nem perde casos. Item sem preço e versão de
  regra ausente continuam nele.
- **Grão, repouso e custo da série** — `arquiteto-dados` e `performance`, depois de `D-06`.

## Critério de aceite

1. Leitura de código que **não existe no catálogo do cliente** → recusada, com o motivo novo, e o fato
   distingue este caso de item sem preço. Com `7891000315507`, que tem estrutura de GTIN de circulação
   global (classe `gtin_global`), o fato carrega o valor, e o cliente tira a lista "códigos que meus
   caixas leram e meu catálogo não tem" sem coleta nova; o provedor, na mesma leitura, não vê o valor.
   Com `2001234001502` (faixa `20`, circulação restrita) ou um QR, o fato carrega comprimento,
   simbologia e classe, e nunca o valor. O desfecho do lançamento é o mesmo nos três casos
   (`RN-NUC-063`, aceites 1, 6 e 7).
2. Leitura de código que **existe no catálogo publicado** e não está no retido daquele terminal →
   recusada, com o mesmo motivo, **e** o fato carrega a versão de catálogo aplicada, de onde a idade
   do retido se deriva pelo marco de reconciliação. Sem o marco, este aceite não é verificável — é o
   que torna o marco parte do item.
3. Um terminal com retido de 6 horas e outro com retido de 6 dias, no mesmo estabelecimento: as recusas
   dos dois são comparáveis por idade. É o único jeito de responder "encurtar a janela resolve?".
4. Recusa por item sem preço continua saindo com `published_artifact_missing`. Motivo novo que rouba
   caso do antigo é o mesmo defeito, invertido.
5. Nenhum dos fatos acima bloqueia a venda: a recusa é do lançamento daquela leitura, o operador segue
   pelo caminho por código do item, e falha ao registrar não interrompe nada.

## Registra / Não registra

**Registra:**

- **A leitura que não resolveu**, com o motivo próprio, o operador e o terminal (`RN-NUC-043` exige o
  ator), o domínio de conexão, a **versão de catálogo aplicada** e a **origem da entrada** — leitura ou
  digitação, para que o erro de digitação não infle a conta do cadastro.
- **Do código apresentado**, sempre: comprimento, simbologia (`unknown` quando o leitor não a
  transmite) e classe estrutural `gtin_global | gtin_restricted | not_gtin`, calculada no terminal pela
  tabela de `RN-NUC-063` (a), tirada da GS1 General Specifications R26. Só com `gtin_global`: o valor
  inteiro, consumido só pelo cliente.
- **O marco de reconciliação do catálogo retido** — quando aquele terminal passou a reter cada versão
  (`published_artifact_version_received`). É fato próprio, não campo de outro: a idade se deriva dele,
  e sem ele ela é afirmada.

**Não registra, e por quê:**

- **O código lido fora da classe `gtin_global`**, nem parte, nem derivação (truncado, hash). O que
  passa por um leitor pode ser credencial ao portador (vale, cartão de fidelidade), dado de meio de
  pagamento ou identificação de pessoa, e a base da ausência é `RN-NUC-056`(a) com `RN-OFF-023` itens
  2 a 4. Perde-se o valor de código interno sem estrutura de GTIN global (código próprio, etiqueta de
  balança em `2x`); fica a contagem por classe e comprimento.
- **O valor, mesmo `gtin_global`, fora do ambiente do cliente:** nem no canal do provedor
  (`RN-PRV-009`), nem em agregado sobre clientes (`D-06`), nem em registro de erro, cópia de apoio ou
  exportação de diagnóstico do terminal. É a lacuna de sortimento do cliente, fato de negócio dele.
- **Nada do conteúdo em contexto de identificar documento ou pessoa** (`RN-PER-013`): lá esta regra não
  se aplica, e o fato de leitura não carrega nem comprimento, nem simbologia, nem classe
  (`modulos/perifericos.md` §3, `COD-01`).
- **Idade ou defasagem do catálogo como campo.** Derivadas do marco e da versão (`RN-NUC-045`).
- **Duração entre a leitura e a recusa.** Marco, não duração (`RN-NUC-045`).

## Depende de

**A trava antiga caiu em 2026-09-23:** `LACUNA-PER-6` nasceu neste item, junto com o motivo, que é a
ordem que `RN-NUC-043` exige — enumeração aplicada depois não estreita nada.

**A resposta de `seguranca` sobre o código lido chegou em 2026-09-23**
(`docs/auditorias/2026-09-23-codigo-lido-no-fato.md` §3) e foi aplicada: nada mais trava os aceites.
Para testar sem leitor físico, os quatro identificadores dos aceites de `RN-NUC-063` bastam como
entrada digitada, porque a classe não depende da origem: `7891000315507`, `2001234001502`,
`7891000315508` e um texto de 200 caracteres. A simbologia só se prova com leitor, e o caso
`unknown` é o de fábrica.

**Passada compartilhada com `F-005`**, que altera a mesma `RN-NUC-043`. A alteração deste item deixou a
regra com uma lista datada de motivos acrescentados (`fatos-de-operacao.md` §2); `F-005` entra como mais
uma entrada dela, na mesma forma, sem reescrever as anteriores.

## Gate obrigatório

**`produto`** — fronteira: o motivo é do núcleo, a regra que o produz é de `PER`.

**`seguranca`** — e aqui não é formalidade: a pergunta "o fato carrega o código lido?" é dele. Um código
de item não é dado de pessoa; o que passa por um leitor pode ser. O gate responde se a captura do código
é admissível e sob que forma, e a resposta destrava o aceite 1. Respondido em 2026-09-23
(`docs/auditorias/2026-09-23-codigo-lido-no-fato.md`), com o degrau 2 aceito pelo thread no mesmo dia.

## Absorção de `F-028` — 2026-09-23

Escopo reaberto só pelo que `F-028` traz; o que está acima foi entregue e não se reabre. Justificativa
nas quatro partes em `docs/produto/backlog-recortes.md` (entrada `F-028`). O texto de origem continua em
`docs/backlog/F-028-leitura-recusada-em-camada-modal-vira-fato.md`.

**Objetivo.** O leitor dispara durante uma camada modal. A regra é certa e está escrita: a leitura é
**recusada, contada e sinalizada dentro da camada**, nunca enfileirada e nunca descartada em silêncio
(`docs/design/foco-teclado-e-leitor.md:68-71`; lei 12 em `docs/design/estados-e-interacao.md:349`). A
contagem existe para o operador saber o que reler, e nenhuma spec diz que ela vira fato. Perde-se
quantos itens quase ficaram fora da venda porque uma camada abriu no meio de uma rajada de leitura, que
é a medida de que a camada está no lugar errado do fluxo.

**Escopo.** Motivo próprio na lista de `RN-NUC-043` para leitura recusada por estado da interface,
distinto de `item_identifier_unresolved`, pela mesma forma das entradas anteriores (`fatos-de-operacao.md`
§2, lista datada). E a contagem por camada: quantas leituras aquela camada recusou, e qual camada era.

**Fora de escopo.** Mudar o desfecho: a leitura continua recusada e sinalizada. O sinal audível (`S-01`,
`estados-e-interacao.md:360`).

**Critério de aceite** (numeração contínua com a de cima):

6. Com a confirmação de sangria aberta, três leituras: as três são recusadas e sinalizadas na camada, e
   existe fato com o motivo próprio, a camada e a contagem 3.
7. O motivo não se confunde com o de leitura não resolvida: `7891000315508` lido fora de camada e o
   mesmo código lido com a confirmação de sangria aberta aparecem na mesma janela com motivos
   diferentes, e o primeiro continua com o desfecho de `RN-NUC-063`.

**Registra:** o motivo, a camada, a contagem, o instante, o terminal e o ator (`RN-NUC-043` exige o ator
em toda recusa, a mesma correção que este item já fez em 2026-09-23).
**Não registra:** o código lido, nem no degrau 1 de `RN-NUC-063` (comprimento, simbologia, classe). A
decisão que o fato informa é se a camada está no lugar errado do fluxo, e ela não depende de qual item
foi lido; o diagnóstico de catálogo é o de cima. Se a escrita da regra achar decisão que precise do
código, o item nomeia a decisão antes de acrescentá-lo.

**Depende de.** A trava de `F-028` ("não executável antes de `T-0016` fechar") caiu: `T-0016` fechou em
2026-09-23. Sobram duas coisas, e quem pegar precisa delas antes de escrever a primeira linha:

- **Os dois arquivos que recebem o motivo estão no teto.** `fatos-de-operacao-dominios-fechados.md` tem
  400 linhas e recebe a linha da tabela §1.1; `fatos-de-operacao.md` tem 396 e recebe a entrada da lista
  datada de `RN-NUC-043`, que `F-005` também vai usar. O primeiro precisa ser partido antes, e o eixo já
  está proposto: levar a tabela de classe estrutural (GS1) para um arquivo irmão (`tarefas/T-0016-...md`,
  Fechamento, SOBROU). O segundo cabe uma das duas entradas; quem entrar em segundo lugar parte o
  arquivo.
- **O nome da camada.** Ele entra só como id de vocabulário fechado, nunca como texto da tela
  (`memory/plataforma/convention-campo-de-texto-livre-nao-e-campo-enumeravel.md`). Se `docs/design/**`
  não tiver vocabulário que nomeie a camada modal, é `PERGUNTAS: para ui` antes de a regra ser escrita, e
  até a resposta o fato sai com motivo e contagem e declara a camada como ausência nomeada.

Para testar sem leitor físico, basta a entrada digitada no mesmo destino de leitura, como nos aceites de
cima; a regra de camada não depende da origem.

**Gate.** `performance`: o registro acontece no meio de uma rajada de leitura, no caminho crítico
(orçamento de adicionar item, `.claude/rules/performance.md` §3). `produto` na fronteira, como o de cima:
o motivo é do núcleo, a regra que o produz é de `PER`.

**Ficha.** Executar este escopo exige reabrir `T-0016`: o estado do item é o estado da ficha dele, e uma
segunda ficha para o mesmo item está proibida (`.claude/rules/backlog.md` §4 e §5). Reabrir é do thread.

## Alterações — 2026-09-23

- **Escopo estendido** para incluir o nascimento de `LACUNA-PER-6`. Contra: a seção `Depende de`, que
  tratava a lacuna como trava externa. Prova: ordem do humano de 2026-09-23 (`T-0016`, Pedido).
- **Aceite 2 e `Registra`:** "o fato carrega a idade do retido" passou a "carrega a versão aplicada, de
  onde a idade se deriva". Por quê: `RN-NUC-045` (`fatos-de-operacao.md:206`) proíbe duração como campo;
  o desfecho verificado é o mesmo.
- **`Não registra`:** saiu "quem operava o terminal". Por quê: `RN-NUC-043` (`fatos-de-operacao.md:130`)
  exige o ator em toda recusa, e a linha contradizia regra aprovada. Registrar não é ler: leitura por
  pessoa continua sendo `RN-REL-008`.
- **`Registra`:** entrou a origem da entrada (leitura ou digitação). Prova: `RN-PER-015`
  (`modulos/perifericos-classes.md:138`) faz os dois caminhos equivalentes, e sem a origem o erro de
  digitação cai no mesmo motivo que o código não cadastrado.
- **O marco ficou geral:** um fato por versão de artefato publicado recebida, não só de catálogo. Prova:
  `RN-NUC-015` (`nucleo-publicacao-e-texto.md:136`) já exige saber quais terminais confirmaram cada
  versão, e nenhum fato realizava isso.

**Passada C.3, mesma data:**

- **Número da regra:** `RN-NUC-057` passou a `RN-NUC-063`. Contra: o número dado na C.1. Prova:
  `RN-NUC-057` a `RN-NUC-062` já existiam em `docs/produto/nucleo-estabelecimento.md:140` e em
  `nucleo-caixa-e-turno.md:7`, escritos em paralelo, e nenhum código citava o nosso ainda.
- **Aceite 1:** ganhou o caso com valor (`gtin_global`) e os casos sem valor. Contra: o aceite anterior,
  que se verificava sem o código. Prova: `docs/auditorias/2026-09-23-codigo-lido-no-fato.md` §3 e a
  decisão do thread em `tarefas/T-0016-nascer-lacuna-per-6.md` ("aceito o degrau 2").
- **`Registra` e `Não registra`:** "não registra o código" virou os dois degraus, e a base da ausência
  trocou `RN-OFF-027` por `RN-NUC-056`(a) com `RN-OFF-023` itens 2 a 4. Prova: auditoria `:203`, que
  mostra que `RN-OFF-027` só chegava aqui por analogia. `RN-OFF-027` continua citado por outro motivo:
  a cláusula (b) dele, valor nunca como chave de decisão.
- **`Depende de`:** a dependência de `seguranca` foi respondida e saiu; entrou a lista de entradas de
  teste.

**Absorção de `F-028`, mesma data, depois do fechamento de `T-0016`:**

- **Escopo reaberto** pela seção "Absorção de `F-028`". Contra: o item fechado, que cobria só a leitura
  não resolvida. Prova: `docs/produto/backlog-recortes.md` (entrada `F-028`) e a autorização em
  `tarefas/T-0017-varrer-escopo-sem-rn.md`, seção "thread — 2026-09-23 (conferência por conjunto e
  respostas)".
- **Aceite 7** ganhou um caso concreto (`7891000315508`, dentro e fora da camada) no lugar de "aparecem
  separadas na mesma janela" (`F-028-...md:37-38`). Por quê: a separação só se prova contra o motivo que
  este item criou, e o identificador é um dos quatro que já servem de entrada de teste. O desfecho
  exigido é o mesmo.
- **`Registra` da absorção** ganhou o ator, pela mesma razão da correção anterior deste item
  (`RN-NUC-043` exige o ator em toda recusa); `F-028` não o listava.

## Referências

`RN-NUC-063` (`docs/produto/fatos-de-operacao-dominios-fechados.md` §1) · `RN-NUC-015` ·
`docs/produto/captura-varredura-invariante-10-2026-09-11.md` §2.12 ·
`docs/produto/modulos/perifericos-classes.md` §2 (`RN-PER-014`, infeliz) ·
`docs/produto/modulos/perifericos.md` §3 (as duas listas) ·
`docs/produto/fatos-de-operacao-dominios-fechados.md` §1.1 (`published_artifact_missing`) · §1
(`RN-NUC-056`, o precedente de motivo + marco) · `RN-OFF-020` · `RN-OFF-023` · `RN-OFF-027` ·
`LACUNA-PER-6` · `docs/auditorias/2026-09-23-codigo-lido-no-fato.md` (§3, `COD-01`) · GS1 General
Specifications R26, https://ref.gs1.org/standards/genspecs/ ·
`memory/plataforma/gotcha-motivo-enumerado-que-engole-dois-diagnosticos.md` · `F-005`

**Da absorção de `F-028`:** `docs/backlog/F-028-leitura-recusada-em-camada-modal-vira-fato.md` ·
`docs/produto/captura-varredura-sem-rn-2026-09-23.md` §2.21 · `docs/produto/backlog-recortes.md` ·
`docs/design/foco-teclado-e-leitor.md:68-71` · `docs/design/estados-e-interacao.md:349`, `:360` ·
`memory/plataforma/convention-campo-de-texto-livre-nao-e-campo-enumeravel.md` · `.claude/rules/performance.md` §3

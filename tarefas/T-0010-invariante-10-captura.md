---
id: T-0010
backlog: F-001
titulo: Invariante 10 — capturar é o padrão, e a varredura que o torna real
status: fechada
escopo: cliente=- vertical=- modulo=- camada=produto
aberta_em: 2026-09-11
---

## Pedido

O humano, em 2026-09-11, depois de eu listar o que já tinha entrado de riqueza de informação na
Fase 1 e ressalvar que a decisão mais cara sobre isso seguia aberta:

> "Foi como eu falei, você deveria colocar como regra. Porque quanto mais informação a gente tiver,
> de rastreabilidade, de informação de cliente para a gente poder tratar esses dados depois e ajudar
> o cliente. Eu acho que eu já deixei isso claro nas regras antigas."

**Verificação da última frase, feita antes de escrever qualquer coisa:** busca por captura,
rastreabilidade, backfill e telemetria em `.claude/rules/**` e `CLAUDE.md` devolveu **uma** ocorrência,
"captura de tela", num item sobre PR. O valor estava claro nas conversas; a regra nunca tinha sido
escrita. É o que explica a lacuna parada: sem regra, o default de não capturar vencia por inércia.

## Plano

Sem Plano de Despacho do `orquestrador` — o recorte veio do próprio pedido e a execução foi sequencial
num território só (`produto`), com as edições de `.claude/rules/**` e `CLAUDE.md` feitas pelo thread
principal, que é seu dono. Enquadra no encurtamento de `processo.md` §5, **exceto** por não ter tido
item antes, que é o furo declarado em `docs/backlog/F-001-*.md`.

## Decisões do humano — 2026-09-11

| # | Decisão |
|---|---|
| 1 | O invariante entra. Virou **invariante 10** do `CLAUDE.md` §7 |
| 2 | `LACUNA-NUC-038`: **saída `B`**, fato aditivo próprio, com autorização explícita para revogar `RN-NUC-003` infeliz (c) |
| 3 | A seção `Registra / Não registra` entra nos **três** lugares: esqueleto de card, anatomia do item e contrato de spec de módulo |

## Thread principal — 2026-09-11

Aplicado: `CLAUDE.md` §7 (invariante 10, com os três limites) · `.claude/rules/produto.md` (seção
"Capturar é o padrão", mais a seção nova no esqueleto de card e o parágrafo da spec de módulo) ·
`.claude/rules/dados.md` §3.1 · `.claude/rules/backlog.md` §8.

Memória escrita: `decision-capturar-e-o-padrao-nao-capturar-exige-justificativa` ·
`convention-ausencia-decidida-versus-acidental` · `gotcha-motivo-enumerado-que-engole-dois-diagnosticos` ·
`decision-ciclo-de-vida-do-pedido-sobe-como-fato-aditivo` · `rule-recusa-por-identidade-tem-motivo-proprio`.

## produto — 2026-09-11 — varredura e decisão

Entregas em `docs/produto/`: `captura-ciclo-de-vida-do-pedido-proposta.md`,
`captura-varredura-invariante-10-2026-09-11.md`, `fatos-de-operacao-ciclo-de-vida-do-pedido.md`
(`RN-NUC-052` a `055`, mais as duas listas em §3, que são o exemplar da seção nova), `RN-NUC-056` e o
motivo `identity_unrecognized` em `fatos-de-operacao-dominios-fechados.md`, a revogação datada em
`nucleo-venda.md:157`.

A varredura achou **7 violações** já existentes, seis delas ausência **acidental**. Uma corrigida no
lugar (`nucleo-publicacao-e-texto.md:124`, distinção artefato × fato), as outras viraram proposta ou
item a recortar.

**PARCIAL, declarado pelo próprio agent:** 11 arquivos de `docs/produto/**` lidos integralmente, 5 em
parte, **20+ não lidos** — listados em ordem de risco em `captura-varredura-invariante-10-2026-09-11.md`
§5. Eles estão declarados como **não verificados**, nunca como conformes.

> **Nota de processo, e é um desvio:** os dois relatórios de `produto` desta ficha não foram colados
> **verbatim**, contra `handoff.md`. O conteúdo substantivo deles foi transferido para
> `docs/produto/**` e `memory/plataforma/**`, que são endereços fixos e citáveis; o que se perde é o
> raciocínio intermediário. Declarado aqui em vez de omitido.

## produto — 2026-09-12 — conclusão da varredura

```
## RELATÓRIO — produto — T-0010
STATUS: PARCIAL
FEITO:
  - Terminei a varredura na ordem de risco da §5. Recorte adotado: o conjunto normativo é o dos
    39 arquivos que carregam `RN` — 20 lidos integralmente (10 na 1ª passada, 10 nesta) e 19 lidos
    de forma dirigida (todo bloco `**Infeliz**`, mais contrato e seções de captura). Nenhum arquivo
    com `RN` ficou fora.
  - Achei 4 violações novas, todas ausência ACIDENTAL: 2.9 leitura de relatório não deixa rastro ·
    2.10 provisionamento que falha no meio não produz fato · 2.11 entrega eletrônica do documento
    não produz fato (a impressa produz) · 2.12 código lido e não resolvido não separa catálogo
    incompleto de catálogo retido velho.
  - Escrevi a seção `Registra / Não registra` nos SETE contratos de módulo (MSA, COZ, PCF, ATI,
    PER, REL, FIS+EMI) — o maior item de "fica para depois" desta ficha.
  - Resolvi 2.9 em parte: cláusula em `LACUNA-NUC-037` e em `matriz-celulas-a-valorar.md` §2 (f)
    obrigando quem valorar a célula a decidir autorização E registro. Nenhum valor de célula escrito.
  - Abri `LACUNA-EMI-017` (a entrega do documento exige prova registrada? em que forma?) — humano
    com contador.
  - Acrescentei 7 entradas à §3 (ausências decididas e certas), a maioria da família do provedor.
ARQUIVOS:
  docs/produto/captura-varredura-invariante-10-2026-09-11.md (editado)
  docs/produto/modulos/mesa-comanda.md · cozinha.md · pedido-cliente-final.md · atendimento-ia.md ·
    perifericos.md · relatorios.md · fiscal.md (editados: seção nova no contrato)
  docs/produto/matriz-operacao-papel-modulos.md · matriz-celulas-a-valorar.md ·
    fiscal-emissao-contingencia.md (editados: cláusula e lacuna)
NÃO FEITO:
  - 14 arquivos SEM `RN` continuam não verificados, nomeados na §5 com o risco de cada um. O de
    maior risco é `catalogo-de-capacidades.md`: recusa de capacidade pode estar recusando captura
    por tabela, e não foi conferida item a item.
  - Os achados 2.3 a 2.7 e os 4 novos continuam sendo CARD, não regra. Não emiti `RN` nova.
  - `catalogo-de-modulos.md`: ~20 módulos com contrato curto e sem spec não receberam as duas
    listas — elas nascem na spec de cada um, não no catálogo.
DECISÕES:
  - Não emiti `RN` nova nesta passada. A 1ª pôde emitir `RN-NUC-056` porque o humano decidiu na
    mesma sessão; aqui não houve decisão, e achado vira card.
  - As listas `Não registra` NÃO absorveram as ausências acidentais como se fossem decididas: cada
    uma aparece nomeada como acidental, citando o achado. Sem isso, a seção que existe para impedir
    ausência de virar acidente seria o instrumento que converte acidente em decisão retroativa.
  - `LACUNA-EMI-017` e não `LACUNA-NUC-044`: a série é por escopo, e a pergunta é de emissão. Pôr
    número de núcleo obrigaria a lacuna a morar em arquivo cujo dono não é o fiscal.
  - Recorte de cobertura por "arquivo que carrega `RN`": desfecho de operação só existe dentro de
    regra numerada. Arquivo sem `RN` pode repetir mal o que a regra diz — defeito de prosa, não de
    captura.
RISCOS:
  - QUATRO arquivos passaram de 400 linhas (`00-nucleo.md` §8): `modulos/fiscal.md` 433,
    `modulos/pedido-cliente-final.md` 422, `modulos/atendimento-ia.md` 419 e a própria varredura,
    427. Justificativa: a seção é exigida pela regra e as três specs já declaram o teto no
    cabeçalho. Eixo de partição sugerido, quando alguém pagar: `fiscal.md` separa a fronteira dos
    três módulos (§1) do contrato de cada um; `pedido-cliente-final.md` separa canal de sessão (já
    tem irmão); `atendimento-ia.md` idem. A varredura não deve ser partida: é citada por §número
    de quatro arquivos.
  - `glossario.md` não tem entrada para o vocabulário de captura (fato de operação, marco, descarte
    contado) — só `audit_trail`. O glossário está no teto e a passada é própria (`LACUNA-REL-007`).
  - `LACUNA-PER-6` trava o achado 2.12: o motivo enumerado precisa nascer junto com ela, e
    enumeração aplicada depois não estreita nada (`RN-NUC-043`).
PERGUNTAS:
  - para humano: `LACUNA-EMI-017` — a norma exige prova de entrega do documento ao cliente-final, e
    em que forma? Sem ela, o fato de entrega é desenhado como fato nosso, sem valor probatório.
  - para humano: ao valorar `LACUNA-NUC-037`, a leitura de relatório é `R` (deixa trilha) ou `P`
    (não deixa rastro nenhum, e "este relatório é usado" fica sem resposta para sempre)?
VERIFICAÇÃO: não rodei nada executável — território é `docs/produto/**`. Conferi por busca: 39
  arquivos com `### RN-`; nenhum contrato de módulo tinha `Registra`/`Não registra` antes desta
  passada; `LACUNA-NUC-043` era o maior da série NUC e `LACUNA-EMI-016` o maior da série EMI, então
  nenhum número foi reaproveitado; contagem de linhas dos arquivos editados.
MEMÓRIA SUGERIDA:
  - type=convention escopo=plataforma camada=produto
    slug=nao-registra-nao-absorve-ausencia-acidental — a segunda lista do invariante 10 nomeia a
    ausência acidental como acidental; escrevê-la lá sem isso converte acidente em decisão
    retroativa e apaga o achado.
  - type=gotcha escopo=plataforma camada=produto
    slug=celula-de-matriz-decide-autorizacao-e-registro — `R` × `P` (`RN-NUC-029`) decide as duas
    coisas; lacuna de célula escrita como pergunta de autorização fecha a captura por omissão. Caso:
    `LACUNA-NUC-037` sobre `REL`, o único módulo que não produz fato nenhum.
  - type=convention escopo=processo camada=produto
    slug=varredura-de-captura-le-o-caminho-infeliz-primeiro — os 11 achados das duas passadas
    saíram de bloco `**Infeliz**`; sucesso vira venda e deixa rastro sozinho.
PRÓXIMO PASSO SUGERIDO: orquestrador — decidir se os 9 cards de achado (2.3 a 2.7, 2.9 a 2.12) viram
  itens em `docs/backlog/` agora ou depois de o humano responder as duas PERGUNTAS.
```

## produto — 2026-09-12 — os 14 arquivos sem `RN`, e os achados viram item

```
## RELATÓRIO — produto — T-0010
STATUS: OK
FEITO:
  - Li os 14 arquivos SEM `RN` que a §5 nomeava como não verificados, começando pelo de maior risco
    declarado (`catalogo-de-capacidades.md`). Doze por inteiro; dois de forma dirigida, e a
    diferença está declarada arquivo por arquivo. A lista de não verificados DEIXOU DE EXISTIR:
    para efeito do invariante 10, `docs/produto/**` está lido inteiro.
  - O risco de maior calibre NÃO se confirmou: `catalogo-de-capacidades.md` §7–§9 foi conferido item
    a item e as duas recusas de captura que ele tem (`R-04` histórico de cliente-final sem `CLF`,
    `R-05` reconhecimento por característica física) estão CERTAS, decididas, com motivo — foram
    para a lista de ausências decididas, não para a de achados.
  - Dois achados novos, os dois ACIDENTAIS: 2.13 o formulário de capacidade (14 campos) não pergunta
    o que a capacidade registra · 2.14 nó de manifesto descartado pelo terminal não produz fato.
  - Escrevi os dois num arquivo IRMÃO da varredura, não dentro dela — ela está em 427 linhas contra
    teto de 400, e o brief proibia engordar os quatro já estourados. A §5 da varredura encolheu (a
    lista de 14 saiu) e aponta para o irmão; a série da §2 é contínua entre os dois.
  - Abri NOVE itens em `docs/backlog/`: `F-005` a `F-013`, mais a linha de cada um no `INDEX.md` e
    um parágrafo explicando a família `captura`.
ARQUIVOS:
  docs/produto/captura-varredura-terceira-passada-2026-09-12.md (novo)
  docs/produto/captura-varredura-invariante-10-2026-09-11.md (editado: cabeçalho e §5)
  docs/backlog/F-005..F-013 (nove novos) · docs/backlog/INDEX.md (editado)
NÃO FEITO: —
DECISÕES:
  - AGRUPAMENTO dos nove achados em SETE itens, por fluxo e nunca por achado: `F-005` cobre 2.3+2.7
    (`MSA`, duas mãos no mesmo alvo) · `F-006` cobre 2.4+2.5 (`PCF`, conversão do canal, e a
    varredura já liga os dois causalmente) · `F-007` 2.12 (`PER`) · `F-008` 2.6 (`ATI`) · `F-009`
    2.9 (`REL`) · `F-010` 2.10 (`PRV`) · `F-011` 2.11 (`EMI`).
  - NÃO fundi `F-006` com `F-008`, apesar de os dois medirem a mesma coisa (onde o cliente-final
    desiste no canal): são contratos de módulo diferentes, com travas diferentes, e fundir traria um
    segundo contrato para dentro do item. Os dois se citam.
  - NÃO fundi `F-005` com `F-007`, apesar de os dois alterarem `RN-NUC-043`: agrupar por mecanismo é
    o oposto de agrupar por fluxo. Cada um declara a passada compartilhada, e se forem pegos juntos
    a alteração da regra dona é uma só.
  - Abri `F-012` e `F-013` para os dois achados NOVOS, além dos nove que o brief pediu. Default
    declarado: achado que não vira item some, que é a razão da parte 2 inteira.
  - NÃO acrescentei o campo 15 a `catalogo-de-capacidades.md`. A escolha entre campo obrigatório e
    cláusula de promoção é do card `F-013`; aplicá-la aqui obrigaria a retro-preencher 10 entradas
    num arquivo a 9 linhas do teto, sem decisão que o sustente.
  - Nenhuma `RN` nova, terceira passada seguida. Mantida a regra: sem decisão do humano, achado é
    card.
RISCOS:
  - 2.14 é o achado que o recorte da segunda passada NÃO podia alcançar, e isso é estrutural, não
    descuido: composição de tela por manifesto é `plataforma` (`fronteira-do-nucleo.md:59`), fora do
    território de `produto` (`roadmap-de-modulos.md:154`), logo nunca terá `RN`. Se houver mais
    escopo nessa condição, ele está igualmente fora de qualquer varredura ancorada em `RN`.
  - A seção `## Fica para depois, com dono

> **Superada em parte pelo `## Fechamento` de 2026-09-12**, que é quem vale. As três primeiras linhas
> foram entregues dentro da própria tarefa; ficam aqui porque foram pendência de verdade entre
> 2026-09-11 e 2026-09-12, e apagá-las esconderia que a tarefa cresceu duas vezes.

- ~~As duas listas nas sete specs de módulo já escritas (`MSA`, `COZ`, `PCF`, `ATI`, `PER`, `REL`, `FIS`)~~ — **feito em 2026-09-12**, segunda passada de `produto`
- ~~Achados `2.3` a `2.7` da varredura~~ — **viraram item em 2026-09-12**: `F-005` (2.3+2.7), `F-006` (2.4+2.5), `F-008` (2.6)
- ~~Os 20+ arquivos não lidos~~ — **feito em 2026-09-12**, terceira passada; sobra um resíduo nomeado no fechamento
- Modelagem dos cinco fatos novos, com grão dependendo de `D-06` — `arquiteto-dados`, Fase 1
- `LACUNA-OFF-016`: valor provisório declarado sem medida, ou esperar a série começar — **humano**
- `backlog-edicoes-a-aplicar.md` está em **1351 linhas** contra teto de 400, pré-existente e sem exceção declarada

## Fechamento — 2026-09-12

ENTREGUE:
- Invariante 10 no `CLAUDE.md` §7, com os três limites, e aplicação em `.claude/rules/produto.md`
  (seção "Capturar é o padrão", esqueleto de card e contrato de spec de módulo),
  `.claude/rules/dados.md` §3.1 e `.claude/rules/backlog.md` §8. A seção `Registra / Não registra`,
  com **duas** listas, passou a ser obrigatória em card de comportamento fechado e em contrato de
  módulo.
- `LACUNA-NUC-038` fechada pela saída `B` (fato aditivo próprio), com a revogação **datada** em
  `nucleo-venda.md:157` e os fatos como `RN-NUC-052` a `RN-NUC-055`; `RN-NUC-056` e o motivo
  `identity_unrecognized` fecharam o achado 2.2.
- Varredura de `docs/produto/**` em três passadas, com **14 achados** numerados em série contínua
  entre dois arquivos irmãos, cada um classificado em ausência **decidida** ou **acidental**.
- As duas listas escritas nos **sete** contratos de módulo com spec (`MSA`, `COZ`, `PCF`, `ATI`,
  `PER`, `REL`, `FIS`+`EMI`), cada ausência acidental nomeada **como acidental**, citando o achado.
- Nove itens abertos em `docs/backlog/` (`F-005` a `F-013`), agrupados por fluxo, todos com dono.

ARQUIVOS (do fechamento; os da execução estão nos três relatórios acima):
  tarefas/T-0010-invariante-10-captura.md (editado)
  memory/plataforma/convention-nao-registra-nao-absorve-ausencia-acidental.md (novo)
  memory/plataforma/gotcha-celula-de-matriz-decide-autorizacao-e-registro.md (novo)
  memory/processo/convention-varredura-de-captura-infeliz-primeiro-e-ancora-rn-nao-basta.md (novo)
  memory/processo/convention-achado-agrupa-por-fluxo-nunca-por-mecanismo.md (novo)
  memory/plataforma/convention-necessidade-antes-de-mecanismo.md (editado: fusão + `atualizado`)
  memory/plataforma/INDEX.md · memory/processo/INDEX.md (editados: linhas novas e um gancho revisto)

VERIFICAÇÃO:
- **A cobertura foi conferida por conjunto, não pela contagem do relatório** — `find` de
  `docs/produto/**` (59 arquivos) contra a união das três listas de cobertura, com `comm`. Os **39**
  arquivos que carregam `### RN-` estão todos nomeados; os 14 sem `RN` da terceira passada batem
  arquivo a arquivo; `glossario.md` e `README.md` constam como lidos por inteiro. **Sobram três, e
  são os que a própria tarefa produziu**: `captura-ciclo-de-vida-do-pedido-proposta.md` e as duas
  varreduras. Nenhum arquivo de `docs/produto/**` ficou fora.
- Dois erros de aritmética nos relatórios, os dois na direção segura (sobra cobertura, não falta):
  "20 lidos integralmente" sobre uma lista de **21** nomes, e "39 que carregam `RN`" sobre uma
  cobertura de **40** nomes.
- Aplicações conferidas em disco: `LACUNA-NUC-038` marcada **FECHADA** em `fatos-de-operacao.md:342`
  · revogação datada em `nucleo-venda.md:152-160` · `RN-NUC-052` a `056` existem com enunciado
  próprio · os sete contratos de módulo contêm `Não registra` · os nove itens `F-005`..`F-013`
  existem em `docs/backlog/` com linha no `INDEX.md`, e `F-007` está marcado **bloqueada** lá.
- Contagem de linhas dos arquivos acima do teto, hoje: `modulos/fiscal.md` 433 ·
  `captura-varredura-invariante-10-2026-09-11.md` 436 · `modulos/pedido-cliente-final.md` 422 ·
  `modulos/atendimento-ia.md` 421. Os dois últimos números divergem do relatório (427 e 419), que
  foram medidos antes da edição seguinte.
- Nada executável foi rodado: a tarefa inteira é `docs/**`, `.claude/**` e `memory/**`.

PRONTO:
- **Regra de negócio numerada com critério de aceite** — cumprido: `RN-NUC-052` a `RN-NUC-056`. "O
  código cita o número": **não se aplica**, nada foi implementado.
- **Teste do caso concreto / regressão** — não se aplica: nenhuma mudança de comportamento em código.
- **DDL, endpoint, consulta/lista/tela** — não se aplica: a tarefa não tocou `db/**`, `apps/**` nem
  `packages/**`. O achado 2.14 fala de terminal, mas entregou **item**, não implementação.
- **Decisão não óbvia virou registro em `memory/`, no escopo certo, com a linha de índice na mesma
  passada** — cumprido: quatro registros novos, uma fusão, seis linhas de índice tocadas.
- **Toda `MEMÓRIA SUGERIDA` escrita, fundida ou recusada com motivo** — cumprido, as seis:
  `nao-registra-nao-absorve-ausencia-acidental` **escrita** · `celula-de-matriz-decide-autorizacao-e-registro`
  **escrita** · `varredura-de-captura-le-o-caminho-infeliz-primeiro` e
  `varredura-ancorada-em-rn-nao-alcanca-plataforma` **fundidas** num registro só de `processo/`,
  porque a segunda é o buraco do método da primeira e quem lesse só uma repetiria a falha ·
  `recusa-de-mecanismo-declara-o-que-a-captura-ganha` **fundida** em
  `convention-necessidade-antes-de-mecanismo`, que já governa as quatro partes da recusa ·
  `achado-agrupa-por-fluxo-nunca-por-mecanismo` **escrita**.
- **Nenhum segredo entrou no repo** — cumprido; a tarefa é prosa de produto e de processo.
- **Ficha com o plano** — não se aplica: não houve Plano de Despacho, e o encurtamento de
  `processo.md` §5 está declarado na seção `## Plano`.
- **Relatórios verbatim** — **não cumprido nos dois primeiros**, e é irreparável: o texto não existe
  mais. O desvio já estava declarado na ficha em 2026-09-11, e o conteúdo substantivo foi para
  endereços fixos (`docs/produto/**`, `memory/plataforma/**`); o que se perdeu foi o raciocínio
  intermediário. Os dois relatórios de 2026-09-12 estão verbatim.
- **A violação que abriu a tarefa continua registrada** — o trabalho foi despachado **antes** de
  existir item, e `F-001` foi criado retroativamente com o furo escrito dentro dele, como precedente
  a não repetir, nunca como exceção autorizada (`backlog.md` §2). Fechar a tarefa não absolve isso.

JULGAMENTO DA FRASE "A LISTA DE NÃO VERIFICADOS DEIXOU DE EXISTIR":
**Sustenta-se, com um resíduo nomeado.** Nenhum arquivo de `docs/produto/**` está sem cobertura
declarada, e a profundidade de cada um está dita. O resíduo é de **lente**, não de lista:
`superficie-por-papel-momentos.md` (289 linhas) foi contado entre "os 39 que carregam `RN`" e lido
pelo critério de leitura dirigida — "todo bloco `**Infeliz**`" —, só que ele não tem nenhum `### RN-`
e **zero** blocos `**Infeliz**` (medido em 2026-09-12). Ou seja: cobertura nominal. E ele é
justamente a espécie que a terceira passada existe para pegar — 70 citações de `RN` sem governar
nenhuma, que é a definição de "prosa que repete a regra e, ao repetir, estreita". Isso não segura a
tarefa: é uma releitura de um arquivo, com a lente certa, contra um método que agora está escrito.
Vai para o `SOBROU`, e o método virou registro.

SOBROU:
- **Releitura de `superficie-por-papel-momentos.md` com a lente de arquivo sem `RN`** (recusa que
  arrasta a captura · enumeração fechada sem o ramo infeliz · prosa que estreita) — `produto`.
- **Varrer o escopo que nunca terá `RN`** atrás de captura ausente — o achado 2.14 tem item
  (`F-012`), mas a pergunta "o que mais está nessa condição?" não tem. É item de backlog a recortar,
  e o recorte é de `produto`, dono de `docs/backlog/**`; o método está em
  [[convention-varredura-de-captura-infeliz-primeiro-e-ancora-rn-nao-basta]]. Alvo provável:
  `postura-nova-geracao.md`, `fronteira-do-nucleo.md` e o que `plataforma` decide sobre terminal e
  manifesto.
- `LACUNA-EMI-017` — a norma exige prova de entrega do documento ao cliente-final, e em que forma? —
  **humano**, com o contador. `F-011` não espera por ela.
- Valoração de `LACUNA-NUC-037` — leitura de relatório é `R` (deixa trilha) ou `P` (não deixa rastro
  nenhum, e "este relatório é usado" fica sem resposta para sempre)? — **humano**. `F-009` entrega a
  folha de decisão em vez de esperar.
- `LACUNA-PER-6` não existe, e é ela que trava `F-007`: motivo enumerado depois não estreita nada
  (`RN-NUC-043`). A lacuna precisa nascer no núcleo — **humano** decide o valor, `produto` escreve a
  lacuna.
- `F-001` tem a seção `Fora de escopo` **vencida em três linhas** (as duas listas nas sete specs, os
  achados 2.3 a 2.7 e os 20+ arquivos foram entregues dentro da tarefa). Correção de uma passada, em
  `docs/backlog/**` — `produto`.
- Quatro arquivos acima do teto de 400 linhas, com eixo de partição já sugerido no relatório da
  segunda passada — `produto`, quando alguém pagar. `backlog-edicoes-a-aplicar.md`, em 1351,
  continua sendo o caso extremo e é pré-existente.
- `glossario.md` sem entrada para o vocabulário de captura (fato de operação, marco, descarte
  contado) — `produto`, passada própria, `LACUNA-REL-007`.
- `backlog-edicoes-correcoes-2026-08-26.md:14` cita `.claude/rules/jira.md`, excluído em 2026-09-11:
  referência morta em arquivo histórico — `produto`, uma linha.
- Modelagem dos fatos novos em `db/**`, com o grão dependendo de `D-06` — `arquiteto-dados`, Fase 1.

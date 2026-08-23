# docs/produto — regra de negócio

Dono exclusivo: agent `produto`. Regra em `.claude/rules/produto.md`. Nada aqui é código, tabela,
rota, componente ou stack — e nada aqui decide prioridade, prazo ou escopo comercial.

## Por onde entrar

| Se você quer… | Comece por |
|---|---|
| saber o que vamos construir e em que ordem | [roadmap-de-modulos.md](roadmap-de-modulos.md) |
| saber o que uma palavra significa | [glossario.md](glossario.md) |
| decidir se algo é núcleo, módulo, vertical ou cliente | [fronteira-do-nucleo.md](fronteira-do-nucleo.md) |
| saber se uma ideia é recusada, e por quê | [postura-nova-geracao.md](postura-nova-geracao.md) |
| achar o módulo dono de um assunto | [catalogo-de-modulos.md](catalogo-de-modulos.md) |
| saber como o sistema opera sem rede | [operacao-offline-e-sincronizacao.md](operacao-offline-e-sincronizacao.md) |
| saber **que fato** se registra no instante em que acontece | [fatos-de-operacao.md](fatos-de-operacao.md) e os três irmãos |
| saber **quem pode** praticar uma operação | [matriz-operacao-papel.md](matriz-operacao-papel.md) e os dois irmãos |
| saber **o que um papel vê** na tela | [superficie-por-papel.md](superficie-por-papel.md) |
| saber o que **nós** vemos do cliente, e o que libera cada parte | [superficie-do-provedor.md](superficie-do-provedor.md) |
| **valorar célula** — o que está esperando decisão do humano | [matriz-celulas-a-valorar.md](matriz-celulas-a-valorar.md) |

## Convenções que valem para todo arquivo daqui

- Regra é numerada `RN-<COD>-<nnn>`, tem **enunciado, motivo, critério de aceite e caminho infeliz**, e
  é citada pelo banco, pela API e pelo teste. Número **nunca** é reaproveitado nem renumerado
  (`glossario.md` §4.2). Toda regra é heading `### RN-<COD>-<nnn>` — a conformidade é conferida por
  busca, e outro nível de heading faz a regra sumir da contagem.
- **`PROVISÓRIA`** no título = a regra depende de uma lacuna e **não é agendável para construção**; o
  que se agenda é resolver a lacuna.
- **`LACUNA-<COD>-<nnn>`** = o que não sabemos, no lugar onde a frase confiante estaria, sempre com
  **dono da resposta** nomeado. Ausência de fonte nunca é preenchida com plausível.
- **Teto de 400 linhas por arquivo.** Arquivo que estoura é **partido por eixo declarado**, com
  numeração contínua entre os irmãos — nunca "parte 1 / parte 2". É por isso que há conjuntos de dois
  e de três arquivos abaixo, com o mesmo peso normativo.
- `PN-nn` **veta** mecanismo; `CAP-<COD>-<nnn>` é o que se **agenda**. A fronteira é mecânica: se o
  roadmap pode agendá-la, é capacidade.
- **Sobre autorização, a célula da matriz é a autoridade única** (`RN-NUC-039`): papel nomeado na prosa
  de qualquer regra é **candidato**, nunca concessão. Quem escreve regra que nomeia papel cita a linha e
  o valor da célula, ou marca a lacuna. Operação sem linha nas matrizes é negada a todos.

## Raiz — o que vale para todo módulo

### Roadmap e fundação
- [roadmap-de-modulos.md](roadmap-de-modulos.md) — proposta de MVP 1 / subsequente / horizonte por
  **dependência**, piso antes de diferencial, o custo explícito da emissão própria e o que a Fase 1
  **não pode** modelar. Proposta: nada aprovado.
- [glossario.md](glossario.md) — autoridade única de vocabulário: um termo, um significado, um nome em
  inglês para o código; inclui o **registro imutável de código de módulo** (§4.3) e o léxico de módulo
  (§6), separado do léxico de ramo.
- [fronteira-do-nucleo.md](fronteira-do-nucleo.md) — o teste dos três negócios (posto, padaria, loja de
  roupa) aplicado item por item: o que é núcleo, o que desce para módulo, o que é do ramo e o que é
  configuração de cliente.
- [postura-nova-geracao.md](postura-nova-geracao.md) — os 20 `PN`: o que recusamos do PDV arcaico e o
  que o produto faz **em consequência**. É a metade que veta.
- [postura-auditoria-pn.md](postura-auditoria-pn.md) — tabela derivada: confere de relance que nenhum
  `PN` recusa **capacidade** sem uma saída declarada. Divergiu? vale o `PN`, não a tabela.

### Operação do provedor — três arquivos, um conjunto (`RN-PRV-001` a `010`, `015` a `017`)
O **quinto escopo**: o nosso negócio, que não é núcleo, módulo, vertical nem cliente. Nada **neste
conjunto** é superfície (ela é o conjunto seguinte), e os dois papéis novos não são coluna de matriz de
cliente (`provider_support` é, e permanece).
- [operacao-do-provedor.md](operacao-do-provedor.md) — o escopo `provedor`, a desambiguação da palavra
  "plataforma", os três papéis nossos e os dois **eixos de alcance** (ler × mutar).
- [operacao-do-provedor-alcance.md](operacao-do-provedor-alcance.md) — irmão com o mesmo peso: o que o
  suporte muda, a interação com o cliente-final, a **decisão de 2026-08-23** sobre o administrador geral,
  o consentimento por cláusula de contrato e o que **nunca** se entrega a um cliente (valor, ordenação ou
  comparação derivada de outro). **As lacunas dos três moram aqui** (§4).
- [operacao-do-provedor-autorizacao.md](operacao-do-provedor-autorizacao.md) — irmão com o mesmo peso: as
  duas travas que o escopo **não herda de ninguém** — operação sem célula é negada a todo papel nosso, e
  ato nosso nunca se sustenta em autoridade do cliente.

### Superfície do provedor — um arquivo (`RN-PRV-018` a `020`)
- [superficie-do-provedor.md](superficie-do-provedor.md) — o que **nós** vemos: a administração de
  metadado (o que é legítimo sob qualquer resposta), o que **não** entra e por quê (pico por
  estabelecimento, artefato de observação corrente, janela declarada sem retenção), e a tabela de **o que
  cada trava libera** — que é a resposta a "quais telas vão existir" na forma que sobrevive a `D-01`/`D-02`.
  Nada aqui é tela, bloco ou gráfico.

### Fatos de operação — quatro arquivos, um conjunto (`RN-NUC-041` a `049`, `RN-PRV-011` a `014` e `021`)
O que se registra **no instante em que acontece**, porque fato não capturado no instante é
**irrecuperável** — a única parte que migration não conserta depois. Grão aqui é **candidato**: o
veredito é do `arquiteto-dados`.
- [fatos-de-operacao.md](fatos-de-operacao.md) — o que a operação do **cliente** produz: caminho de
  venda no grão do item, a disciplina do grão, conectividade e os marcos que dão tempo. **As lacunas e as
  perguntas dos quatro moram aqui** (§7).
- [fatos-de-operacao-provedor.md](fatos-de-operacao-provedor.md) — irmão com o mesmo peso: o que os
  **papéis nossos** praticam (a leitura é fato de igual peso ao ato), o ciclo de vida do cliente, do
  módulo, do schema e do terminal, e a **sugestão** nossa ao cliente — sustentação enumerável do mesmo
  cliente, e projeção que nunca chega com a autoridade do fato (`RN-PRV-021`).
- [fatos-de-operacao-dominios-fechados.md](fatos-de-operacao-dominios-fechados.md) — irmão com o mesmo
  peso: o **fato de recusa** e as três listas fechadas de valor — motivo de recusa (sem ele, "módulo não
  usado" é invisível), motivo de **cancelamento** e **modo de atendimento**. Enumeração só estreita algo
  se nascer com o campo.
- [fatos-de-operacao-retencao-e-descarte.md](fatos-de-operacao-retencao-e-descarte.md) — irmão com o
  mesmo peso: **o fato depois do instante**. A ordem de sacrifício do recurso local do terminal
  (`RN-NUC-046`) e a relação entre retenção e janela de leitura (`RN-NUC-049`) — o mesmo defeito em duas
  escalas de tempo, a perda chegando ao leitor com a cara de ausência.

### Catálogos
- [catalogo-de-modulos.md](catalogo-de-modulos.md) — todos os módulos previstos, inclusive de verticais
  que ainda não atendemos: código, escopo justificado, ativação, expõe/exige e **o que acontece com o
  cliente que tem o módulo desligado**.
- [catalogo-de-capacidades.md](catalogo-de-capacidades.md) — as 11 capacidades **candidatas** (nenhuma
  nasce aceita) mais o **método** de procurar capacidade nova numa vertical. É a metade que se agenda. O
  campo de escopo **não** admite `provedor`, e a recusa está escrita na §1.
- [receitas-por-vertical.md](receitas-por-vertical.md) — que módulos cada ramo liga (`RES`, `PST`,
  `VAR`), com o que é do ramo e o que só parecia ser. Vertical não tem código e não é ativável.

### Núcleo de venda — três arquivos, um conjunto normativo (`RN-NUC-001` a `016`, mais `037` e `038`)
- [nucleo-venda.md](nucleo-venda.md) — a tabela das operações do núcleo e as regras de pedido, venda
  imutável, pagamento e correção por fato novo (`001`–`008`), mais a **resolução escopada** de venda por
  referência humana (`038`). **As lacunas dos três moram aqui** (§6).
- [nucleo-caixa-e-turno.md](nucleo-caixa-e-turno.md) — sessão de caixa e dinheiro na gaveta
  (`009`–`012`), mais **abrir sessão em nome de outro** (`037`).
- [nucleo-publicacao-e-texto.md](nucleo-publicacao-e-texto.md) — que artefato o núcleo **publica** para
  o terminal aplicar offline, e por que texto do sistema nunca é instrução (`013`–`016`).

### Autorização — dois arquivos, um conjunto (`RN-NUC-017` a `025`)
- [papeis-e-permissoes.md](papeis-e-permissoes.md) — quais papéis existem, por que cada um existe, em
  que escopo vale, e o que **não** sobreviveu à reconciliação de sete artefatos.
- [papeis-atribuicao-e-delegacao.md](papeis-atribuicao-e-delegacao.md) — como a autoridade chega a uma
  pessoa, se limita e **expira**: atribuição, delegação, escalonamento, autoridade retida offline.

### Matriz operação × papel — três arquivos, um conjunto (`RN-NUC-026` a `033`, `039`, `040`)
Quem pode praticar cada operação, célula por célula. Célula `?` é ausência de decisão, e ausência de
decisão **nega** — não é comportamento aprovado.
- [matriz-operacao-papel-contrato.md](matriz-operacao-papel-contrato.md) — o **vocabulário da célula**
  (`026`), a coluna de offline (`027`), a contenção (`028`), o registro (`029`), a **precedência da
  célula sobre a prosa** (`039`) e **o que se delega** (`040`).
- [matriz-operacao-papel.md](matriz-operacao-papel.md) — a matriz do **núcleo** (39 linhas), o
  fechamento de sessão alheia (`030`), o fechamento do dia (`031`), a reapresentação de via (`032`), as
  divergências reconciliadas (§7) e a contagem (§8).
- [matriz-operacao-papel-modulos.md](matriz-operacao-papel-modulos.md) — papel de núcleo em operação de
  **módulo** (`033`), as operações de `MSA`, `COZ`, `PCF`, `ATI`, `FIS`, `EMI` e da vertical, o **eixo de
  leitura** (§7) e a contagem consolidada (§8). **As lacunas de célula moram aqui** (§9).
- [matriz-celulas-a-valorar.md](matriz-celulas-a-valorar.md) — **não é uma quarta matriz**: é a folha de
  valoração, com linha **candidata** e valor de célula em **branco** — a matriz do escopo `provedor` (14
  linhas) e as duas linhas de `REL` que `LACUNA-NUC-037` esperava. Célula em branco **não** é `?`, e nada
  dela entra na contagem da §8 acima.

### Superfície por papel — dois arquivos, um conjunto (`RN-NUC-034` a `036`)
- [superficie-por-papel.md](superficie-por-papel.md) — o que cada papel **vê**: origem do que aparece
  (`035`, com a **leitura derivada**), como a negação chega a quem pede (`036`), e por que superfície
  nunca é a fonte da autorização.
- [superficie-por-papel-momentos.md](superficie-por-papel-momentos.md) — anexo com o mesmo peso: o que
  cada momento de operação exige à mão, operação sensível por operação sensível.

### Continuidade offline — contrato transversal (`RN-OFF-001` a `033`)
- [operacao-offline-e-sincronizacao.md](operacao-offline-e-sincronizacao.md) — as 4 classes de operação,
  o catálogo de classificação por operação (§4) e o **default: operação não classificada é recusada** até
  a spec do módulo dono classificá-la.
- [fila-local-conteudo-e-repouso.md](fila-local-conteudo-e-repouso.md) — o que a fila local contém, o
  que **nunca** contém, e o que o terminal retém depois de o item confirmado sair.
- [fila-local-autoridade-e-identidade.md](fila-local-autoridade-e-identidade.md) — irmão do anterior,
  partido em 2026-08-23: o que o terminal retém para **poder operar** — autoridade retida com validade,
  meio de identificação com reconciliação, e a habilitação a vender do terminal, com prazo.
- [offline-grandezas-e-orcamento.md](offline-grandezas-e-orcamento.md) — 23 grandezas com unidade e
  **sem valor**: valor operacional é configuração por cliente com vigência, nunca constante.

### Fiscal — a arquitetura, e `EMI` em três arquivos
- [fiscal-regimes-e-vigencia.md](fiscal-regimes-e-vigencia.md) — o requisito atemporal: regimes
  **coexistem**, toda regra tem vigência, e o fato **congela** a versão de regra que o produziu; fato
  passado nunca é recalculado.
- [fiscal-emissao-propria.md](fiscal-emissao-propria.md) — `EMI`, habilitar e manter: custódia da
  credencial, layout versionado em **três cadências** de publicação, habilitação por UF, ambiente e
  tipo de documento.
- [fiscal-emissao-contingencia.md](fiscal-emissao-contingencia.md) — o documento **depois** da venda:
  retorno do autorizador (autorizado × rejeitado × denegado), numeração e série, e contingência como
  máquina de estado com prazo por documento.
- [fiscal-custodia-e-trilha.md](fiscal-custodia-e-trilha.md) — onde o ato de assinar acontece:
  **capacidade com prazo e revogação**, nunca credencial estacionada no terminal; trilha append-only
  por ato; furto de terminal é comprometimento.

## `modulos/` — spec profunda de um módulo

Existe só para módulo que alguém vai construir; o resto tem a entrada do catálogo e nada mais.

- [modulos/fiscal.md](modulos/fiscal.md) — a decisão de fronteira **`FIS` / `EMI` / `APU`** e a spec de
  `FIS` (tributação). `APU` está fora do MVP, com o custo declarado.
- [modulos/mesa-comanda.md](modulos/mesa-comanda.md) — `MSA`: consumo em aberto vinculado a lugar ou
  ficha, abertura, transferência e fechamento.
- [modulos/cozinha.md](modulos/cozinha.md) — `COZ`: ponto de produção e estado do trabalho, incluindo o
  que acontece quando o display cai ou a rede local morre no meio do serviço.
- [modulos/pedido-cliente-final.md](modulos/pedido-cliente-final.md) — `PCF`: o cliente-final monta o
  próprio pedido e manda para dentro do PDV; nenhum cálculo de valor vive aqui.
- [modulos/pedido-cliente-final-sessao.md](modulos/pedido-cliente-final-sessao.md) — anexo de `PCF`, com
  o mesmo peso normativo: a **sessão externa** como fronteira de confiança do canal.
- [modulos/atendimento-ia.md](modulos/atendimento-ia.md) — `ATI`: atender em linguagem natural,
  **propor** e transferir para humano quando não sabe. Automação nunca decide dinheiro.
- [modulos/atendimento-ia-fronteira-de-confianca.md](modulos/atendimento-ia-fronteira-de-confianca.md) —
  anexo de `ATI`: o que entra no contexto da conversa nunca é instrução, e nenhum texto do sistema é.
- [modulos/perifericos.md](modulos/perifericos.md) — `PER`: a **lei do módulo** — `PN-18` (periférico não
  é refém da venda) como regra operacional, classes de capacidade, continuidade por domínio e contrato
  (`001`–`008`). **As lacunas dos dois moram aqui** (§4).
- [modulos/perifericos-classes.md](modulos/perifericos-classes.md) — irmão de `PER` com o mesmo peso: a
  regra de **cada classe** (`009`–`019`), a costura fiscal com `EMI` e leitura de código.
- [modulos/relatorios.md](modulos/relatorios.md) — `REL`: relatório existe pela **decisão** que informa;
  o que é `REL` e o que é superfície de operação; escopo por estabelecimento × cliente.
- [modulos/relatorios-semente-de-perguntas.md](modulos/relatorios-semente-de-perguntas.md) — irmão de
  `REL`: as seis perguntas da semente, os papéis **sem** relatório, os recusados e as lacunas dos dois.

## `verticais/` — o que o ramo exige além do núcleo

- [verticais/restaurante.md](verticais/restaurante.md) — `RES`: recorte do ramo, fluxo por modo de
  atendimento, jargão mapeado ao glossário, hardware e rede esperados, e as regras do ramo.

`PST` (posto) e `VAR` (varejo) têm **receita** em `receitas-por-vertical.md` e **não têm spec de
vertical** — o pré-requisito para atendê-las de verdade é a spec, não mais capacidade.

## `clientes/` — deliberadamente vazio

Não há cliente-piloto nomeado: o foco inicial é a **vertical restaurante como classe**. O primeiro
arquivo aqui nasce com nome real, e como **configuração sobre a vertical** — nunca o contrário
(`catalogo-de-modulos.md` §1).

## Em elaboração

Nada em elaboração declarado hoje. Esta seção existe para tornar **ausência** visível: arquivo previsto
e ainda não escrito entra aqui, com o motivo, e sai quando entrar em disco. A entrada de
`matriz-operacao-papel.md` saiu em 2026-08-23 — a matriz existe, em **três** arquivos (seção acima).

## Vizinhos, fora do território de `produto`

`docs/arquitetura/` — dossiês de pesquisa com fonte por afirmação (fiscal, e as opções de `D-01`/`D-02`)
e racional extenso. `docs/auditorias/` — relatório de `seguranca` e de `performance`. `docs/design/` —
tokens, grade e espaços.

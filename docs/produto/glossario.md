# Glossário — autoridade única de vocabulário

Um termo, um significado, um nome em inglês. Quem discordar de um nome muda **este** arquivo (via
`produto`), não o nome no seu território.

**O que este arquivo decide:** o significado do termo e a palavra em inglês que o código usa.
**O que ele não decide:** forma física (tabela, coluna, tipo, plural, chave). Isso é de
`arquiteto-dados` e `backend` — eles citam o nome daqui e escolhem a forma lá.

Convenções de nomeação:
- Termo em **pt-BR** na conversa e na spec; identificador em **inglês**, `snake_case`, singular.
- **Sem abreviação**: `quantity`, não `qtd`/`qty`; `value`/`amount`, não `vlr`.
- Termo composto no código preserva a ordem do inglês (`catalog_item`, não `item_catalog`).
- Um conceito não tem sinônimo. Se aparecerem dois nomes para a mesma coisa, um dos dois está errado
  e este arquivo resolve qual.

---

## 1. Léxico do núcleo

Tudo nesta seção passou pelo teste da fronteira (`fronteira-do-nucleo.md`): posto de gasolina,
padaria e loja de roupa precisam **todos** do conceito.

### 1.1 Escopo e identidade

| Termo | No código | Significado | Não confundir com |
|---|---|---|---|
| Cliente (tenant) | `tenant` | A empresa que contrata a Forja. É a unidade de isolamento de dado. | cliente-final |
| Cliente-final | `customer` | Quem compra. Pode ser anônimo. | cliente (tenant) |
| Estabelecimento | `establishment` | Unidade de operação de um cliente (tenant), com **identidade jurídica própria**: é dele que a venda sai, é em nome dele que o documento é emitido, e o dinheiro de um não se mistura com o do outro. Um cliente (tenant) tem **uma ou mais**. | cliente (tenant); terminal |
| Terminal | `terminal` | O dispositivo onde se opera o PDV, vinculado a um estabelecimento. | posto de caixa |
| Terminal habilitado a vender por um estabelecimento | `sales_enabled_terminal` | Terminal cujo vínculo com **um** estabelecimento foi estabelecido **com contato** e fica retido nele. É esse fato — mais o operador identificado — que sustenta o **ato ordinário** sem rede (`RN-OFF-032`), e é ele que escopa a resolução de venda por referência humana (`RN-NUC-038`). Furto, perda ou destruição **revogam** a habilitação **no servidor** (`RN-OFF-016`, `RN-EMI-038`) — no terminal offline ela cai quando **vence por tempo sem contato**, com aviso antes — sem prazo, revogação de terminal é promessa que o offline não cumpre (`LACUNA-OFF-017`). | autoridade retida; atribuição restrita a terminal |
| Fuso do cliente | `tenant_time_zone` | Fuso em que "hoje", turno e fechamento são interpretados. | fuso do servidor |
| Fuso do estabelecimento | `establishment_time_zone` | Fuso da unidade onde a operação de fato acontece. Existe porque um cliente (tenant) pode ter estabelecimentos em fusos diferentes. | fuso do cliente (tenant) |
| Moeda do cliente | `tenant_currency` | Moeda em que valor é exibido e cobrado. | — |

**Proibido**: usar "cliente" sem qualificador em spec, código ou conversa. Sempre "cliente (tenant)"
ou "cliente-final".

**Estabelecimento é entidade de primeira classe, não atributo do cliente (tenant).** Nada no produto
presume um estabelecimento por cliente: turno, sessão de caixa, numeração de documento, regime
tributário, identidade fiscal, ponto de emissão (§6) e configuração de módulo são **por
estabelecimento**. Consequência aberta, e é conflito de **regra**, não de forma: a vigência fiscal se
resolve no fuso do **estabelecimento** (`modulos/fiscal.md`, `fiscal-regimes-e-vigencia.md`), enquanto
"hoje", turno e fechamento estão declarados no fuso do **cliente (tenant)**
(`fronteira-do-nucleo.md` §2.1). Os dois não podem valer ao mesmo tempo para um cliente com
estabelecimentos em fusos diferentes → `[[LACUNA-GLO-001]]`. Até fechar, nenhuma spec presume qual
dos dois manda, e quem escrever regra que dependa disso cita a lacuna.

### 1.2 Catálogo e preço

| Termo | No código | Significado | Não confundir com |
|---|---|---|---|
| Catálogo | `catalog` | O conjunto do que o tenant pode vender. | estoque |
| Item de catálogo | `catalog_item` | Uma coisa vendável, identificável e precificável. | item de venda |
| Código do item | `item_code` | Identificador do item legível por máquina ou digitável pelo operador. | identificador interno |
| Unidade de medida | `unit_of_measure` | Em que se conta o item, com casas decimais declaradas. | embalagem |
| Quantidade | `quantity` | Quanto do item, na unidade dele. Pode ser fracionária. | contagem de linhas |
| Preço | `price` | Valor unitário de um item para um contexto e um período. | preço pago |
| Lista de preço | `price_list` | Conjunto de preços aplicável a um contexto (estabelecimento, canal, período). | tabela de desconto |
| Vigência | `effective_period` | Janela em que um preço ou uma regra vale. | data de criação |

**Proibido**: `product` como nome de entidade. "Produto" é ambíguo (é também o software e é o nome
de um papel do processo). Use `catalog_item`.

### 1.3 Pedido, venda e correção

| Termo | No código | Significado | Não confundir com |
|---|---|---|---|
| Pedido | `order` | O registro da intenção de compra **em construção**: mutável, cancelável, ainda sem valor devido definitivo. | venda |
| Item de pedido | `order_item` | A linha que liga um item de catálogo a uma quantidade e a um preço dentro de um pedido. | item de catálogo |
| Venda | `sale` | O fato comercial **concluído**: composição de itens, valor e contrapartida fechados. Imutável. | pedido |
| Item de venda | `sale_item` | A linha congelada de um item na venda concluída. | item de pedido |
| Desconto | `discount` | Redução deliberada de valor, com origem e autorização identificáveis. | erro de preço |
| Acréscimo | `surcharge` | Aumento deliberado de valor sobre item ou venda. | imposto |
| Total | `total_amount` | Valor devido pela venda, calculado no backend. | soma vista na tela |
| Cancelamento de venda | `sale_cancellation` | Fato novo que anula uma venda concluída inteira. | apagar venda |
| Devolução | `return` | Fato novo que desfaz parte do que foi vendido, referenciando a venda original. | cancelamento |
| Comprovante | `receipt` | Documento **não** fiscal entregue como prova de operação. | documento fiscal |
| Modo de atendimento | `service_mode` | Como o pedido será atendido e entregue ao cliente-final, **declarado no pedido** e nunca inferido do canal de entrada. Domínio mínimo do núcleo: atendido **presencialmente** no estabelecimento × **entregue em endereço**. | canal (`channel`, §6) |
| Observação do item de pedido | `order_item_note` | Texto livre que acompanha uma linha do pedido e altera **como** ela é atendida ("sem cebola", "ajustar a barra", "embalar para presente"). Nasce com o item, viaja com ele, e quem cumpre apenas lê. Quando vem de fora (cliente-final, canal, plataforma) é **entrada não confiável** e carrega origem declarada — `RN-ATI-018`. | instrução de preparo — que é esta observação **lida por `COZ`**, não outro conceito |

Distinção crítica: **pedido é mutável, venda é imutável.** Um pedido pode nascer e morrer sem virar
venda; uma venda nunca é editada nem apagada — correção é fato novo referenciando o original. Se as
duas coisas são uma estrutura só ou duas, no banco, é decisão de `arquiteto-dados`; o significado
está fixado aqui.

**Modo de atendimento e observação do item são do núcleo** — decisão de fronteira registrada em
`fronteira-do-nucleo.md` §2.3. Em uma cláusula cada: o documento fiscal exige saber se a operação é
presencial ou de entrega em endereço, e isso vale para qualquer ramo que entregue; e a observação do
item existe **sem** `COZ` (embalagem, presente, "sem gelo" no balcão), então deixá-la em módulo
tiraria de quem não tem produção a capacidade que o caderno de papel já dá hoje (regra núcleo §12).
Valor de modo além do mínimo é extensão de módulo — retirada posterior é `CMP`, salão × balcão é
refino de `MSA`/vertical, e o que a norma exige para retirada presencial de pedido remoto é
`LACUNA-RES-002`. **Atualização de 2026-08-22:** a spec do núcleo passou a existir, com `RN-NUC-001` a
`RN-NUC-016` em três arquivos. A **observação do item** ganhou regra própria (`RN-NUC-016`); o **modo de
atendimento** continua sem regra numerada (`[[LACUNA-GLO-002]]`, reduzida).

### 1.4 Pagamento

| Termo | No código | Significado | Não confundir com |
|---|---|---|---|
| Pagamento | `payment` | Uma parcela da contrapartida de uma venda: meio, valor e resultado. | venda |
| Meio de pagamento | `payment_method` | Como se paga (dinheiro, cartão, instantâneo, a prazo…), em domínio fechado. | adquirente |
| Pagamento dividido | `split_payment` | Mais de um pagamento para a mesma venda. | divisão de conta |
| Troco | `change_due` | Valor devolvido ao cliente-final quando o pago excede o devido. | diferença de caixa |
| Estorno de pagamento | `payment_reversal` | Fato novo que desfaz um pagamento já registrado. | cancelamento de venda |
| Chave de idempotência | `idempotency_key` | Identificador enviado pelo chamador que garante que repetir não duplica. | identificador da venda |

### 1.5 Caixa e turno

"Caixa" tem quatro significados em pt-BR e **não se usa sozinho** em spec nem em código:

| Termo | No código | Significado |
|---|---|---|
| Posto de caixa | `register` | O ponto lógico de atendimento onde se cobra. |
| Sessão de caixa | `register_session` | Da abertura ao fechamento: um operador responsável, um posto, um fundo. |
| Gaveta | `cash_drawer` | O compartimento físico de dinheiro. |
| Operador de caixa | papel `cashier` | A pessoa no papel de cobrar. |
| Turno | `shift` | Janela operacional do estabelecimento. Eixo **independente** da sessão de caixa: um turno contém várias sessões, e uma sessão não define um turno. |
| Fundo de troco | `opening_float` | Dinheiro colocado na gaveta na abertura da sessão. |
| Movimento de caixa | `cash_movement` | Qualquer entrada/saída de dinheiro que não é pagamento de venda. |
| Sangria | `cash_withdrawal` | Retirada de dinheiro da gaveta durante a sessão. |
| Suprimento | `cash_supply` | Aporte de dinheiro na gaveta durante a sessão. |
| Diferença de caixa | `cash_difference` | Divergência entre o esperado e o contado no fechamento. |

### 1.6 Pessoas, autorização e rastro

| Termo | No código | Significado | Não confundir com |
|---|---|---|---|
| Operador | `operator` | Pessoa que opera o PDV, autenticada. É o **sujeito**, não um papel. | papel |
| Papel | `role` | Conjunto de permissões, com escopo, que um operador **porta**. Conjunto **fechado** no núcleo: `cashier`, `manager`, `owner`, `fiscal_officer` (`papeis-e-permissoes.md`). | cargo no RH; atribuição |
| Gerente | papel `manager` | Papel que autoriza a exceção e responde pelo dinheiro do estabelecimento. Escopo: estabelecimento. | dono |
| Dono | papel `owner` | Papel que decide o que o negócio vende, por quanto, e o que cada papel autoriza. Escopo: cliente (tenant). | gerente; provedor |
| Responsável fiscal | papel `fiscal_officer` | Papel que responde pelo uso do poder de assinar em nome do estabelecimento (`RN-EMI-036`). Escopo: estabelecimento. | contador; responsável legal — se a norma os exige é `LACUNA-NUC-012` |
| Provedor | `provider` | Quem fornece a Forja. **Não** é cliente (tenant) e não tem escopo de cliente. | cliente (tenant) |
| Papel do provedor | papel `provider_support` | O papel **nosso** dentro do ambiente de um cliente, existente apenas como concessão com escopo mínimo, prazo, motivo e trilha visível ao cliente, e nunca com dado de pagamento (`RN-NUC-024`). | papel de cliente |
| Atribuição | `assignment` | O vínculo operador × papel × escopo, com restrição opcional de terminal e de janela de tempo. **Não** é artefato publicado. | papel; delegação |
| Delegação | `delegation` | Concessão temporária de um subconjunto próprio do que o delegante já porta, com prazo, sem cadeia (`RN-NUC-021`). | atribuição |
| Dono da fila | `queue_owner` | **Atribuição** nomeada, por estabelecimento: o alvo único da fila de pendências e da lista de trabalho (`RN-OFF-011`). Não concede autorização, e **não é papel** (`papeis-e-permissoes.md` §4.2). | papel; responsável do estabelecimento |
| Responsável do estabelecimento | `establishment_responsible` | **Atribuição** nomeada: o alvo da escalada quando a fila não é olhada. | dono da fila; dono (`owner`) |
| Autoridade retida | `retained_authority` | O papel de quem autenticou, e o que ele autoriza, retidos no terminal para operar sem contato — com validade declarada e revogação valendo na reconexão (`RN-OFF-024`). | artefato publicado |
| Meio de identificação retido | `retained_identification_means` | O que o terminal retém para **identificar** quem pratica o ato sem contato. **Terceira categoria** de coisa retida, ao lado de artefato publicado (versão e vigência) e de autoridade retida (validade): ela **identifica e não autoriza**, e o que a governa é **reconciliação**, não validade (`RN-OFF-033`). | autoridade retida; artefato publicado |
| Ato ordinário | `ordinary_act` | Ato do fluxo de venda que se sustenta em **terminal habilitado + operador identificado**, nunca na autoridade retida da pessoa (`RN-OFF-032`): vencer a validade da autoridade retida **não** o para. O conjunto é **fechado pela matriz**: são as linhas cuja coluna `Offline` carrega **`terminal+ident`** (`RN-NUC-027`, cláusula 3) — hoje nove. | operação sensível, que é o oposto |
| Operação sensível | `sensitive_operation` | Ação que move dinheiro, altera fato concluído, abre gaveta **ou entrega de novo o que comprova um fato** — as seis de `.claude/rules/seguranca.md` §2, reimpressão inclusa (`RN-NUC-032`). O critério não é "mexe em dinheiro": é ser **irreversível ou não conferível depois**, e é por isso que o registro é precondição do ato, não subproduto (`RN-NUC-029`). | ato ordinário; ação rara |
| Autorização | `authorization` | Verificação, no backend, de que um papel pode executar uma operação, **no escopo do objeto** dela (`RN-NUC-018`). | botão escondido |
| Trilha de auditoria | `audit_trail` | Registro append-only de quem fez o quê, quando e sobre qual objeto. | log de aplicação |

**A distinção que mais custou aqui:** "o que o papel X autoriza" é **artefato publicado** — versionado,
com vigência, congelado no fato (`RN-NUC-013`). "Esta pessoa está no papel X" é **autoridade retida** —
sem versão, com validade, revogável na reconexão (`RN-OFF-024`). Confundir as duas foi o que fazia
`RN-OFF-007` contradizer `RN-OFF-014`. Detalhe em `papeis-atribuicao-e-delegacao.md` §1. **E são três, não
duas, desde 2026-08-23:** o **meio de identificação retido** (`RN-OFF-033`) é categoria própria — pendurá-lo
em uma das outras duas dá resposta errada em direções opostas (como artefato nunca expiraria; como
autoridade pararia o balcão ao expirar).

**Escopo de papel tem dois níveis, cliente e estabelecimento** — terminal e janela de tempo são
restrições da **atribuição**, e turno **não** é escopo de autorização (`RN-NUC-018`).

### 1.7 Âncora fiscal (vocabulário mínimo)

O núcleo conhece **que existe** obrigação documental; a regra é do módulo `FIS`. Estes quatro termos
são o contrato entre os dois. O módulo pode acrescentar termo — **nunca** redefinir estes.

| Termo | No código | Significado |
|---|---|---|
| Documento fiscal | `fiscal_document` | Documento exigido por obrigação, emitido a partir de um fato comercial. |
| Fato gerador | `taxable_event` | O fato comercial que dá origem à obrigação — no núcleo, a venda concluída. |
| Regime | `tax_regime` | O conjunto de regras sob o qual um estabelecimento apura. Coexistem. |
| Versão de regra | `rule_version` | A versão vigente de uma regra no instante do fato gerador, congelada com ele. |

### 1.8 Continuidade, pendência e publicação

O núcleo opera com rede ruim (`fronteira-do-nucleo.md` §2.1) e isso tem vocabulário próprio, usado em
`operacao-offline-e-sincronizacao.md`. **Atualização de 2026-08-22:** os três **têm** regra numerada
agora — `pending_operation_queue` em `RN-NUC-001`, `published_artifact` em `RN-NUC-013` a `RN-NUC-015`,
`work_list` em `RN-OFF-012` mais o dono nomeado em `RN-NUC-020`.

| Termo | No código | Significado | Não confundir com |
|---|---|---|---|
| Fila de pendências | `pending_operation_queue` | Operações já aceitas no terminal e ainda não confirmadas pelo servidor. **Não é cache**: é fato que já aconteceu e dinheiro que já trocou de mão. | cache local; rascunho |
| Lista de trabalho | `work_list` | Onde vai o item que **saiu** da fila por exigir decisão humana, com dono de papel gerencial, motivo preservado e efeito declarado. | fila de pendências; trabalho a produzir (§6) |
| Artefato publicado | `published_artifact` | Dado versionado que o servidor publica e o terminal **aplica** offline (preço, limite, regra fiscal). Aplicar não é decidir (`PN-13`). | configuração de terminal; cache |

---

## 2. Léxico de plataforma

Não é núcleo de venda: é o mecanismo que permite o núcleo existir para vários ramos.

| Termo | No código | Significado |
|---|---|---|
| Módulo | `module` | Unidade de funcionalidade ativável por cliente, sem deploy dedicado. |
| Capacidade | `capability` | O que um módulo ativo passa a permitir. Lida do registro de controle, nunca inferida. |
| Vertical (ramo) | `vertical` | Classe de negócio (restaurante, posto, varejo). Não é cliente. |
| Manifesto | `manifest` | Descrição servida da composição de tela: ids de vocabulário fechado. |
| Bloco | `block` | Nó do manifesto que aponta para um componente do catálogo embarcado. |
| Provisionamento | `provisioning` | Criar o ambiente de um cliente novo do zero. |

---

## 3. Léxico de ramo

Termo de ramo **é permitido e desejável aqui** — o glossário é autoridade sobre todo o vocabulário.
O que é proibido é ele valer para o núcleo: nenhum destes aparece em spec, nome ou condição de
núcleo. Cada linha declara o ramo dono.

### 3.1 Restaurante / alimentação servida

| Termo | No código | Ramo | Significado |
|---|---|---|---|
| Mesa | `table` | restaurante | Lugar físico de consumo ao qual se vincula consumo em aberto. |
| Comanda | `tab` | restaurante | Consumo acumulado em aberto, vinculado a mesa, pessoa ou ficha, fechado em um pagamento. |
| Praça / área | `service_area` | restaurante | Agrupamento de mesas para divisão de atendimento. |
| Atendente de salão | `attendant` | restaurante | Quem atende a mesa e lança o consumo. **Nunca** `waiter`/`server` (`server` colide com servidor). |
| Taxa de serviço | `service_charge` | restaurante | Encargo sobre o consumo, **receita do estabelecimento**. Se cobra e quanto é de cliente, não do ramo. Distinta de gorjeta (§6). |
| Couvert | `cover_charge` | restaurante | Encargo por pessoa. Existência é de cliente. |
| Divisão de conta | `bill_split` | restaurante | Repartir o consumo em aberto entre pagadores. |
| Ficha técnica | `recipe` | alimentação | Composição de um item preparado a partir de insumos. |

**Produção não é léxico de ramo.** Os termos de produção saíram desta tabela para o §6 (léxico de
módulo): `COZ` é cross-vertical — ótica monta lente, farmácia manipula, gráfica imprime, padaria
assa —, e classificá-los como jargão de restaurante contradizia a própria entrada do módulo no
catálogo. O jargão do ramo ("pedido de produção", "monitor da cozinha", "via impressa") continua
mapeado para o léxico de módulo em `verticais/restaurante.md` §3, que é onde jargão vive.

### 3.2 Combustível

| Termo | No código | Ramo | Significado |
|---|---|---|---|
| Bomba | `pump` | posto | Equipamento de abastecimento. |
| Bico | `nozzle` | posto | Ponto de saída de um produto em uma bomba. |
| Tanque | `tank` | posto | Reservatório de onde o bico puxa. |
| Encerrante | `pump_totalizer` | posto | Totalizador acumulado do bico, base de conferência. |
| Abastecimento | `fueling` | posto | O evento de saída de combustível, origem de um pedido. |
| Frota | `fleet_account` | posto | Conta de terceiro que consome e paga depois. Ver nota abaixo. |

### 3.3 Varejo de mercadoria

| Termo | No código | Ramo | Significado |
|---|---|---|---|
| Grade | `variant_matrix` | moda | Combinação de eixos (cor, tamanho) de um mesmo item. |
| Etiqueta | `label` | varejo | Impresso de identificação/preço afixado à mercadoria. |
| Condicional | `consignment_out` | moda | Mercadoria que sai sem venda, para decisão posterior. |
| Troca | `exchange` | varejo | Devolução com substituição, não com dinheiro. |
| Item pesável | `weighed_item` | mercado/padaria | Item cuja quantidade vem de balança. |
| Balança | `scale` | mercado/padaria | Periférico que fornece quantidade. |

### 3.4 Parece de ramo e não é

Casos em que o jargão nasceu num ramo mas o conceito é módulo cross-vertical. Classificar errado
aqui custa reimplementação (ver `fronteira-do-nucleo.md` §5):

| Jargão | Conceito real | No código | Por que é módulo, não vertical |
|---|---|---|---|
| Frota (posto), convênio, crediário | Conta a prazo | `credit_account` | Padaria, oficina e loja de bairro vendem a prazo com a mesma mecânica. |
| Delivery (restaurante) | Entrega | `delivery` | Loja de roupa e farmácia entregam igual. |
| Retirada no balcão | Retirada | `pickup` | Qualquer ramo com pedido antecipado. |
| Comissão de garçom | Comissão | `commission` | Loja de roupa e serviços comissionam vendedor. |
| Ficha de fidelidade | Fidelidade | `loyalty` | Não é de ramo nenhum, é de política do cliente. |

---

## 4. Código de módulo e numeração de regra

### 4.1 Regra de formação do código

- **3 ou 4 letras**, `A–Z` maiúsculas, sem número, sem acento.
- Derivado do nome do módulo em **pt-BR** (é o nome que o humano fala), por consoantes ou sílabas
  iniciais: `fiscal → FIS`, `cozinha → COZ`.
- **Único e imutável.** Código nunca é reaproveitado, nem quando o módulo morre — porque a regra
  numerada com ele já foi citada em código, banco e teste.
- **Nunca contém nome de ramo** se o módulo é de núcleo ou cross-vertical.
- Este arquivo é o **registro único** de códigos. Módulo novo não nasce com código escolhido na spec
  dele: o código é reservado aqui primeiro, e a spec cita.

### 4.2 Numeração

`RN-<COD>-<nnn>` — `nnn` com três dígitos, sequencial **por código**, começando em `001`.

- Número **nunca** é renumerado nem reaproveitado. Regra revogada fica no arquivo marcada como
  revogada, com o que a substituiu.
- Regra de **núcleo** usa `NUC`. Regra de **vertical** usa o código da vertical.
- Regra de **um cliente** não ganha código próprio: entra na sequência do módulo ou da vertical que
  ela altera, com escopo `cliente:<id>` declarado e a regra geral que ela **supera** citada
  explicitamente.
- Toda `RN` tem critério de aceite. Sem critério, não é regra e não recebe número.

### 4.3 Registro de códigos

Reservados agora, porque os passos seguintes desta tarefa vão numerar em paralelo. A lista de
módulos **não está fechada aqui** — fechar é do catálogo de módulos.

| Código | Escopo | Nome | Situação |
|---|---|---|---|
| `NUC` | núcleo | Núcleo de venda | reservado |
| `FIS` | módulo | Fiscal | reservado |
| `MSA` | módulo | Mesa e comanda | reservado |
| `COZ` | módulo | Produção / cozinha | reservado |
| `PCF` | módulo | Pedido pelo cliente-final | reservado |
| `ATI` | módulo | Atendimento com IA | reservado |
| `RES` | vertical | Restaurante | reservado |
| `PST` | vertical | Posto de combustível | reservado |
| `VAR` | vertical | Varejo de mercadoria | reservado |
| `PER` | módulo | Periféricos | reservado |
| `EST` | módulo | Estoque | reservado |
| `PUB` | módulo | Publicação de catálogo | reservado |
| `PRM` | módulo | Promoção condicional | reservado |
| `ECG` | módulo | Encargo nomeado | reservado |
| `CLF` | módulo | Cadastro de cliente-final | reservado |
| `VOU` | módulo | Vale e voucher | reservado |
| `ADQ` | módulo | Captura de pagamento eletrônico | reservado |
| `PRZ` | módulo | Conta a prazo | reservado |
| `PGO` | módulo | Pagamento por canal remoto | reservado |
| `CMP` | módulo | Cumprimento de pedido | reservado |
| `ORC` | módulo | Orçamento | reservado |
| `COM` | módulo | Comissão | reservado |
| `RSV` | módulo | Reserva | reservado |
| `REL` | módulo | Relatórios gerenciais | reservado |
| `INT` | módulo | Integração com terceiro | reservado |
| `GRD` | módulo | Grade de variantes | reservado |
| `ETQ` | módulo | Etiqueta | reservado |
| `BMB` | módulo | Bomba e abastecimento | reservado |
| `FTC` | módulo | Ficha técnica | reservado |
| `FRN` | módulo | Fornecedor e compra | reservado |
| `FID` | módulo | Fidelidade | reservado |
| `ENT` | módulo | Entrega em endereço | reservado |
| `TRC` | módulo | Troca | reservado |
| `CSG` | módulo | Condicional | reservado |
| `EMI` | módulo | Emissão de documento fiscal | reservado |
| `APU` | módulo | Apuração e obrigação acessória | reservado |
| `PRV` | **provedor** | Operação do provedor — o quinto escopo (`operacao-do-provedor.md`) | reservado |

As linhas de `PER` para baixo foram acrescentadas por `catalogo-de-modulos.md` (T-0001, passo 2), que
é onde a **lista de módulos** e a fronteira de cada um vivem; este arquivo continua sendo o registro
único dos **códigos**. Uma eventual partição do fiscal reserva os códigos dela aqui, não lá.

**Partição do fiscal (T-0001, passo 3a):** `FIS` passou a nomear a **tributação** — decidir o que
incide, sobre que base, em que regime, sob que versão de regra. `EMI` e `APU` são as outras duas
partes, ambas **camada 2** (exigem `FIS`). Fronteira, justificativa e regras em `modulos/fiscal.md`
§1. Nenhum código foi renomeado nem aposentado, e nenhuma `RN-FIS-nnn` havia sido emitida antes.

Códigos **bloqueados**, para não gerarem ambiguidade: `PDV`, `POS`, `NFE`, `NF`, `SAT`, `TEF` — os
três primeiros por colisão de leitura, os demais por parecerem afirmar sigla de documento ou de
integração que ainda não confirmamos (ver `PERGUNTAS` da ficha T-0001).

---

## 5. Termos e formas proibidas

| Proibido | Use | Por quê |
|---|---|---|
| "cliente" sem qualificador | cliente (tenant) / cliente-final | Os dois aparecem na mesma frase o tempo todo; ambiguidade aqui vira consulta errada. |
| "caixa" sozinho | posto de caixa / sessão de caixa / gaveta / operador de caixa | Quatro conceitos, um substantivo. |
| `product` | `catalog_item` | "Produto" também é o software e um papel do processo. |
| "nota" | documento fiscal / comprovante | Confunde obrigação com prova de operação. |
| "conta" | comanda / conta a prazo / total devido | Três coisas diferentes. |
| `server`, `waiter` | `attendant` | `server` colide com servidor. |
| `qtd`, `vlr`, `dt`, `nf`, `desc` | nome inteiro em inglês | Abreviação não sobrevive a quem entra depois. |
| "apagar" venda, pagamento, movimento | cancelar / estornar / devolver (fato novo) | Fato concluído não se apaga; a palavra errada convida o modelo errado. |
| "mesa", "bomba", "comanda" em spec de núcleo | conceito de núcleo equivalente | Termo de ramo no núcleo vaza para tabela e não sai sem migration. |

---

## 6. Léxico de módulo (cross-vertical)

Termo que **só existe quando um módulo está ligado** e que **não é de ramo nenhum**: o mesmo módulo
serve ramos diferentes, então o vocabulário dele também. Não confundir com §2 (plataforma) nem com §3
(jargão de ramo). Cada linha declara o módulo dono; nenhum destes termos entra em spec de núcleo.

| Termo | No código | Módulo | Significado | Não confundir com |
|---|---|---|---|---|
| Ponto de produção | `production_point` | `COZ` | Posto de trabalho que prepara, monta ou transforma antes da entrega. Quais existem e como se chamam é configuração do cliente. | estabelecimento; terminal |
| Trabalho a produzir | `production_work` | `COZ` | A unidade de `COZ`: o que precisa ser feito, derivado de um item de pedido (ou de parte dele), endereçado a um ponto. Nasce no lançamento, não na venda. | item de pedido; pedido (`order`) |
| Etapa de produção | `production_stage` | `COZ` | Estado do trabalho: pendente, em produção, pronto, entregue, encerrado sem produzir. | estado de cumprimento (`CMP`) |
| Painel de produção | `production_display` | `COZ` | Tela de acompanhamento no ponto de produção. | via de produção |
| Via de produção | `production_ticket` | `COZ` | Impressão dirigida a um ponto de produção. Exige `PER`. | comprovante; documento fiscal |
| Operador de produção | papel `production_operator` | `COZ` | Papel de quem produz e registra avanço de etapa. | atendente de salão (`attendant`); operador de caixa (`cashier`) |
| Gorjeta | `tip` | `ECG` | Valor destinado a quem atende e **repassado ao empregado** — não é receita do estabelecimento. É a palavra da norma na exclusão de base (`verticais/restaurante.md` §1.2). | taxa de serviço (`service_charge`), que é receita do estabelecimento |
| Valor retido por intermediação | `intermediary_withheld_amount` | `INT` | Parte do valor pago pelo cliente-final que a plataforma intermediária retém e **não repassa** ao estabelecimento. | taxa de entrega (encargo, `ECG`); desconto |
| Estado de cumprimento | `fulfillment_state` | `CMP` | Onde o pedido está perante o cliente-final até ser entregue ou retirado (pendente, pronto, entregue), com senha ou chamada. | etapa de produção; estado da venda |
| Ponto de emissão | `issuing_point` | `EMI` | A unidade que emite documento fiscal: é dela o estado de contingência e é por ela que a numeração corre. | terminal; estabelecimento |
| Canal | `channel` | `PCF` | Por onde um pedido de origem externa entra: dispositivo do cliente-final, terminal de autoatendimento, plataforma de terceiro. | modo de atendimento (§1.3), que é como o pedido será atendido |
| Sessão externa | `external_session` | `PCF` | O contexto escopado que dá sentido ao lançamento vindo de fora — um cliente (tenant), um estabelecimento, um destino, uma janela. Nunca escala para papel de operador. | operador; identidade de cliente-final |
| Proposta pendente | `pending_proposal` | `ATI`, `PCF` | Saída de automação ou de canal externo que só vira fato com confirmação de operador com papel autorizado (`PN-16`). | pedido; comando |
| Identidade persistente de cliente-final | `customer_identity` | `CLF` | Cliente-final reconhecido como a mesma pessoa entre sessões. **Se existe e como se autentica é D-03**; o dado é de `CLF`, nunca de `MSA` nem de `PCF`. | sessão externa, que é anônima por construção |

**Identificadores aposentados, nunca reaproveitados** (T-0001): `preparation_order` e
`preparation_stage`, substituídos por `production_work` e `production_stage`. Motivo: a produção é
cross-vertical, o nome antigo carregava o ramo e `preparation_order` colidia com `order` (pedido) do
núcleo. Nenhum código ou regra numerada os citava.

## 7. Lacunas do vocabulário

- `[[LACUNA-GLO-001: quando um cliente (tenant) tem estabelecimentos em fusos diferentes, qual fuso decide vigência de regra, "hoje", turno e fechamento — o do estabelecimento ou o do cliente? Os dois estão declarados hoje, em arquivos diferentes. **Dono:** humano; é a mesma pergunta 3 do fim de `operacao-offline-e-sincronizacao.md`]]`
- `[[LACUNA-GLO-002 — **reduzida em 2026-08-22**, e a redução foi conferida termo por termo: a spec do núcleo existe (`RN-NUC-001` a `RN-NUC-025`, em `nucleo-venda.md`, `nucleo-caixa-e-turno.md`, `nucleo-publicacao-e-texto.md`, `papeis-e-permissoes.md`, `papeis-atribuicao-e-delegacao.md`). Ganharam regra: `order_item_note` (`RN-NUC-016`), `pending_operation_queue` (`RN-NUC-001`), `published_artifact` (`RN-NUC-013`), `work_list` (`RN-OFF-012` + `RN-NUC-020`). **FECHADA em 2026-08-23:** o resíduo era `service_mode`, e ele passou a ser regido por `RN-NUC-048` (`fatos-de-operacao-dominios-fechados.md` §3) — domínio fechado do núcleo, ausência não é valor (a venda não conclui sem modo), cada fato carrega o modo vigente no instante dele, valor novo só por alteração daquela regra com o teste dos três negócios, e efeito sobre preço/encargo/tributo é do módulo dono. Nada foi renomeado e a linha de §1.3 não muda]]`

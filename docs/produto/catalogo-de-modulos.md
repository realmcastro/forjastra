# Catálogo de módulos

Todos os módulos previstos da Forja — **inclusive os de verticais que ainda não atendemos**. O
catálogo existe para que a próxima vertical não renegocie o núcleo: quando chegar posto ou varejo, a
resposta "isso é módulo, e o módulo já tem código e fronteira" já está escrita. Aqui é **uma entrada
curta por módulo**; spec profunda mora em `modulos/<modulo>.md` e só existe para módulo que o humano
cortar para construir.

## 1. Como ler, e o que vale para toda entrada

Campos: **propósito** (abre a entrada) · **Escopo** (núcleo/módulo/vertical/cliente + motivo em uma
cláusula pelo teste dos três negócios — posto, padaria, loja de roupa — de `fronteira-do-nucleo.md`,
citado aqui como `fronteira`) · **Ativação** (liga isolado? exige qual módulo antes?) · **Expõe**
(evento/consulta que outro módulo usa sem conhecer o de dentro) · **Exige** (capacidade do núcleo ou
de outro módulo) · **Desligado** (o que acontece com o cliente que **não** tem o módulo) · **Sensível**
(dado sensível que toca; proteção é de `seguranca`).

- **Código vem do registro único** de `glossario.md` §4.3 — imutável, nunca reaproveitado; módulo que
  morre deixa o código aposentado. **Classificação segue** o procedimento de `fronteira` §4, parando
  no primeiro "sim", e cada entrada cita a seção que sustenta a resposta.
- **"Exige" nunca é `import`.** A dependência é contrato publicado ou evento, e ligar `B` que exige
  `A` sem `A` é recusado **na ativação** — não é tela quebrando depois.
- **Entrada sem "Desligado" não está pronta**: é o teste de plugabilidade. Onde a resposta honesta
  fosse "quebra", a entrada diria isso em vez de contornar.
- Item que contradiz um `PN` de `postura-nova-geracao.md` é recusado citando o número. E este arquivo
  **não** decide ordem de construção nem prioridade (é do humano), não fala de preço nem de pacote, e
  não desce para tabela, rota, tela ou bloco.

**O escopo `cliente` existe e está deliberadamente vazio.** O foco inicial é a **vertical restaurante
como classe**; não há cliente-piloto nomeado. Por isso nenhuma entrada tem escopo `cliente` e nada foi
criado em `docs/produto/clientes/` — resultado, não esquecimento: `cliente` é **valor de configuração**
dentro de um módulo que ele já tem (`fronteira` §1 e §5.2), não é capacidade, então não vira entrada
nem ganha código. Exceção que não cabe em configuração é regra numerada na sequência do módulo que ela
supera, contada como dívida (`glossario.md` §4.2). O primeiro arquivo em `clientes/` nasce com nome
real e como configuração sobre a vertical, nunca o contrário.

**Não é módulo, e por isso não está no catálogo:** plataforma (isolamento por cliente, registro de
módulos ativos, manifesto, provisionamento, migration — `fronteira` §2.1), o núcleo de venda, e a
**exportação do próprio dado pelo cliente** — é `PN-10`, vale para todo cliente, e módulo desligável
ali contradiria a postura (relatório gerencial elaborado é outra coisa, e é módulo: `REL`).

## 2. Camada 0 — o núcleo

### `NUC` — Núcleo de venda · núcleo
Vender, receber, conferir o dinheiro e guardar o fato — em qualquer ramo, com rede ruim, sem perder
venda. **Escopo** núcleo: é o conjunto que os três negócios **quebram** sem (`fronteira` §2, item por
item) — catálogo com preço e vigência, pedido, venda imutável, correção por fato novo, pagamento e
troco, sessão de caixa e turno, operador com papel e trilha, âncora da obrigação, idempotência e
continuidade offline; mais **modo de atendimento** e **observação do item de pedido** (`glossario.md`
§1.3, `fronteira` §2.3). **Ativação** sempre ligado; não existe cliente sem núcleo.
**Expõe** venda concluída (o fato que os módulos escutam), pedido, pagamento, sessão de caixa,
operador e papel autorizado, trilha de auditoria, âncora fiscal (`glossario.md` §1.7). **Exige** da
plataforma: isolamento por cliente, registro de módulos ativos, manifesto de tela.
**Desligado** não se aplica — desligar o núcleo é desinstalar o produto; `fronteira` §3 lista o que
nunca desce daqui e vale contra todo módulo deste catálogo. **Sensível** identificação opcional do
cliente-final na venda (sem histórico — histórico é `CLF`), credencial do operador, espécie na gaveta.

## 3. Camada 1 — módulos que exigem só o núcleo

### `FIS` · `EMI` · `APU` — Fiscal, partido em três · módulos
**Partição decidida** (passo 3a; fronteira e `RN` em `modulos/fiscal.md` §1): `FIS` **tributação** (o que
incide, sobre que base, em que regime, sob que versão de regra, congelado no fato), `EMI` **emissão** (montar,
assinar, transmitir, tratar retorno, guardar, cancelar) e `APU` **apuração e obrigação acessória** (consolidar,
escriturar, declarar) mudam por norma e em cadência diferentes, e `EMI`/`APU` são substituíveis por terceiro
enquanto `FIS` não é. **Emissão é própria** (decisão do humano): a Forja monta, assina e transmite, com
credencial sob nossa custódia (padrão) ou assinatura fora da Forja. **`APU` fica fora do MVP, sem data.**
**Escopo** módulo: a **regra** muda por lei, regime e cliente (`fronteira` §2.7 e §6) — núcleo é só a âncora.
**Ativação** `FIS` isolado, só núcleo; `EMI` e `APU` exigem `FIS` (camada 2).
**Expõe** `FIS` o fato tributado congelado (por tributo, base, regime, versão de regra) e a consulta de
vigência; `EMI` estado da obrigação por venda e documento para reimpressão e envio; `APU` o resultado do
período. **Exige** do núcleo: venda concluída como fato gerador com instante e fuso, identidade jurídica,
correção como fato novo; do cliente: regime com vigência, identidade fiscal, dado tributário do catálogo.
**Desligado** `FIS` off: vende, conclui e confere, comprovante não fiscal, `EMI`/`APU` não ativáveis — e
cliente **com** obrigação e `FIS` off opera irregular, decisão dele e do contador dele. `EMI` off: tributo
segue congelado, obrigação fica **externa** (contador, provedor) — configuração suportada. `APU` off
(padrão do MVP): apuração e declaração ficam com o contador. A venda nunca para (`PN-01`). **Sensível**
credencial de assinatura e transmissão do cliente (nunca no repositório), documento de pessoa do
destinatário quando a obrigação exige, dado tributário do catálogo.

### `PER` — Periféricos · módulo
Falar com o equipamento do balcão: impressora, gaveta, balança, display de cliente-final, leitor.
**Escopo** módulo: o driver depende do equipamento do cliente, não do ramo (`fronteira` §2.5) — e
quantidade fracionária já é núcleo (§2.2), então não existe módulo de balança. **Ativação** isolado, só
núcleo. **Expõe** capacidade de impressão e acionamento no terminal, e o resultado da tentativa.
**Exige** do núcleo: venda concluída e comprovante a imprimir; autorizar gaveta é operação sensível
**do núcleo**, não do periférico.
**Desligado** a venda fecha e o comprovante fica disponível por outro meio; `PN-18` obriga o mesmo com
o módulo **ligado** e o equipamento falhando. **Sensível** conteúdo do comprovante em trânsito.

### `EST` — Estoque · módulo
Saber quanto existe de cada item e registrar entrada, saída, perda e contagem. **Escopo** módulo:
padaria produz, posto mede tanque, loja conta peça — nem a necessidade nem a mecânica são comuns aos
três (`fronteira` §2.2). **Ativação** isolado, só núcleo. **Expõe** disponibilidade por item, evento
de movimento, resultado de contagem. **Exige** do núcleo: item com unidade de medida declarada, e a
venda concluída como origem da baixa.
**Desligado** a venda não consulta disponibilidade, nada é baixado, sem aviso de falta nem tela de estoque; o caixa vende igual. **Sensível** —

### `PUB` — Publicação de catálogo · módulo
Dar ao item o conteúdo que um canal externo precisa exibir: descrição, imagem, atributo público,
agrupamento, disponibilidade por canal. **Escopo** módulo: só faz sentido onde existe canal para o
cliente-final ver (`fronteira` §2.2) — catálogo com código e preço é núcleo, conteúdo publicável não
é. **Ativação** isolado, só núcleo (o cliente mantém conteúdo antes de existir canal). **Expõe**
catálogo publicável por canal, já filtrado pelo disponível. **Exige** do núcleo: item, preço vigente e
a decisão de valor — `PUB` **exibe**, nunca calcula (`PN-13`).
**Desligado** nenhum canal externo tem o que mostrar; o operador vende pelo código do item. **Sensível** —

### `PRM` — Promoção condicional · módulo
Reduzir valor por regra de combinação (leve N, casado, faixa de quantidade, janela de horário).
**Escopo** módulo: nenhum dos três quebra sem ela (`fronteira` §2.2), e desconto/acréscimo simples com
limite por papel é núcleo (§2.3). **Ativação** isolado, só núcleo. **Expõe** promoção aplicável a um
pedido e o motivo da aplicação (comprovante e trilha). **Exige** do núcleo: pedido, preço vigente,
valor devido decidido no backend (`PN-13`).
**Desligado** só existe desconto e acréscimo manual, com autorização por papel; nenhuma regra automática é avaliada. **Sensível** —

### `ECG` — Encargo nomeado · módulo
Cobrar encargo com nome próprio (serviço, entrega, embalagem, por pessoa), com base de cálculo e regra
de isenção declaradas. **Escopo** módulo: padaria e loja de roupa não cobram, e o acréscimo do núcleo
cobre o caso simples (`fronteira` §2.3) — **se cobra e quanto** é sempre de cliente, nunca do ramo
(§5). **Ativação** isolado, só núcleo. **Expõe** o encargo do pedido discriminado por nome, para
comprovante e para o fiscal. **Exige** do núcleo: pedido, base de cálculo, valor decidido no backend.
**Desligado** o cliente usa acréscimo manual do núcleo, sem nome nem regra própria. **Sensível** —

### `CLF` — Cadastro de cliente-final · módulo
Conhecer quem compra: identificação, contato, endereço e histórico de compra. **Escopo** módulo:
padaria de balcão vende a vida inteira sem cadastrar ninguém (`fronteira` §2.3) — a identificação
**opcional** na venda é núcleo, guardar histórico não. **Ativação** isolado, só núcleo. **Expõe**
consulta por identificador, histórico de compra, evento de vínculo com a venda. **Exige** do núcleo:
venda concluída e a identificação opcional já coletada nela.
**Desligado** a venda aceita identificação para a obrigação documental e não guarda histórico; módulo
que precisa de identidade de pessoa (`FID`, `PRZ`, `ENT`, `PCF`) declara isso na própria entrada.
**Sensível** **o mais carregado do catálogo em dado de pessoa** — nome, documento, telefone, endereço,
histórico de consumo; a retenção disso é decisão de produto, não efeito colateral.

### `VOU` — Vale e voucher · módulo
Emitir e consumir crédito nominal ou ao portador como forma de abater valor devido. **Escopo** módulo:
política de cliente, não necessidade de ramo (`fronteira` §2.4). **Ativação** isolado, só núcleo.
**Expõe** saldo e validade de um crédito, evento de emissão e de consumo. **Exige** do núcleo:
pagamento como parcela da contrapartida, estorno como fato novo, autorização por papel para emitir (é
operação sensível).
**Desligado** não existe crédito a consumir; o cliente usa os meios do núcleo. **Sensível** crédito ao portador é valor em si; vale nominal identifica pessoa.

### `ADQ` — Captura de pagamento eletrônico · módulo
Falar com quem autoriza o pagamento eletrônico e trazer o resultado para dentro da venda. **Escopo**
módulo: mecanismo e parceiro variam por cliente, não por ramo, e o núcleo só registra o resultado
(`fronteira` §2.4). **Ativação** isolado, só núcleo. **Expõe** resultado da captura (autorizado,
negado, indefinido), identificador de conciliação, evento de estorno. **Exige** do núcleo: pagamento,
chave de idempotência (`PN-02`), estorno como fato novo.
**Desligado** o operador registra o pagamento com o resultado obtido fora do sistema; a venda fecha
igual e a conciliação é manual.
**Sensível** meio de pagamento e retorno do autorizador — **número completo, CVV e trilha não existem
neste fluxo**; credencial de parceiro do cliente.

### `PRZ` — Conta a prazo · módulo
Vender agora e cobrar depois de um pagador identificado (frota, convênio, crediário), com limite,
saldo e fechamento de período. **Escopo** módulo: mesma mecânica em ramos diferentes e nenhum dos três
a exige (`fronteira` §2.4; `glossario.md` §3.4, "parece de ramo e não é"). **Ativação** isolado, só
núcleo; usa `CLF` quando o pagador é pessoa cadastrada. **Expõe** limite e saldo, evento de lançamento
e de liquidação, extrato do período. **Exige** do núcleo: venda concluída, meio de pagamento em
domínio fechado, autorização por papel para lançar acima do limite.
**Desligado** não existe venda sem contrapartida imediata; o meio "a prazo" não é ofertado. **Sensível** identificação do pagador e o histórico de dívida dele.

### `PGO` — Pagamento por canal remoto · módulo
Receber sem o pagador estar no balcão: cobrança enviada por link ou código, paga antes ou depois.
**Escopo** módulo: `fronteira` §2.4 classifica "pagamento antecipado por canal externo" como módulo, e
o canal externo aqui é a **própria cobrança** — não depende de `PCF`. **Ativação** isolado, só núcleo.
**Expõe** cobrança remota e estado dela (pendente, paga, expirada), evento de confirmação. **Exige**
do núcleo: pedido ou venda como origem do valor, idempotência, valor decidido no backend.
**Desligado** todo recebimento acontece no balcão. **Sensível** contato do pagador para envio da cobrança; credencial de parceiro do cliente.

### `CMP` — Cumprimento de pedido · módulo
Tratar o pedido que **não** se encerra no ato: fila, estado (pendente, pronto, entregue), senha ou
chamada, retirada no balcão. **Escopo** módulo: loja de roupa entrega na hora e posto entrega no ato
do abastecimento (`fronteira` §2.3, ciclo de cumprimento). **Ativação** isolado, só núcleo. **Expõe**
estado de cumprimento de um pedido (`glossario.md` §6), fila do estabelecimento, evento de mudança de
estado. **Exige** do núcleo: pedido e venda concluída; nenhum cálculo de valor.
**Fronteira confirmada** (T-0001): é o **dono do estado de cumprimento**, e não é casca de `COZ` nem do
núcleo — `RN-COZ-009` faz o destino viajar com o trabalho **sem** `COZ` interpretá-lo, e fila/senha no
núcleo apareceria no PDV de quem entrega no ato (`fronteira` §5.1). Não é base de receita nenhuma:
liga-se por **formato de operação** (`receitas-por-vertical.md` §5).
**Desligado** o pedido conclui e se encerra no ato; sem fila, senha ou estado. **Sensível** contato do cliente-final quando há chamada por mensagem.

### `COZ` — Produção · módulo
Organizar o que precisa ser preparado a partir dos itens pedidos: roteamento por ponto de produção,
etapa de produção, acompanhamento em tela ou impressão dirigida. **Escopo** módulo: quem revende
embalado não precisa, quem prepara sob pedido não trabalha sem (`fronteira` §2.3). **Cross-vertical,
confirmado pelo teste dos três negócios aplicado a "ponto de produção"**: padaria sim, loja de roupa
não, posto só se servir alimentação — logo não é núcleo; e existe fora da alimentação (ótica montando
lente, farmácia manipulando, gráfica imprimindo), logo não é de ramo. Por isso o vocabulário dele é
**léxico de módulo** (`glossario.md` §6), e o jargão do ramo é mapeado em `verticais/<ramo>.md` §3.
**Ativação** isolado, só núcleo; usa `PER`
quando o ponto recebe impressão (sem `PER`, só tela). **Expõe** o que está por produzir, o estado de
cada etapa, evento de "pronto". **Exige** do núcleo: item de pedido com quantidade e a **observação do
item** (`glossario.md` §1.3), que `COZ` lê e nunca cria, e a configuração de pontos de produção do
cliente.
**Desligado** o operador comunica a produção por fora (voz, papel); pedido e venda não mudam. **Sensível** —

### `MSA` — Mesa e comanda · módulo, ligado por vertical (restaurante)
Acumular consumo em aberto vinculado a lugar físico, pessoa ou ficha, e fechar tudo em um pagamento —
com transferência e divisão de conta. **Escopo** módulo: só existe onde se consome antes de pagar
(`fronteira` §2.3); termo de ramo é esperado nesta entrada e proibido em entrada de núcleo.
**Ativação** isolado, só núcleo. **Expõe** consumo em aberto de um lugar/ficha e o total parcial,
evento de abertura, transferência e fechamento. **Exige** do núcleo: pedido mutável (é ele que
acumula), venda concluída no fechamento, autorização por papel para transferir e para cancelar item já
lançado.
**Desligado** todo pedido é aberto e fechado no ato, no balcão — o restaurante que opera só balcão
funciona sem este módulo, e é isso que prova que ele é plugável. **Sensível** nome do cliente-final
quando a ficha é nominal.

### `ORC` — Orçamento · módulo
Registrar proposta de valor que pode não virar venda, com validade, e convertê-la em pedido quando
aceita. **Escopo** módulo: nenhum dos três quebra sem ele (`fronteira` §2.3). **Ativação** isolado, só
núcleo. **Expõe** o orçamento e o estado dele (aberto, aceito, expirado), evento de conversão em
pedido. **Exige** do núcleo: catálogo com preço vigente e criação de pedido a partir da aceitação.
**Desligado** não existe proposta registrada; quem pede valor recebe resposta verbal. **Sensível** contato do interessado, quando informado.

### `COM` — Comissão · módulo
Atribuir a venda (ou o item) a quem vendeu e apurar a comissão devida por período. **Escopo** módulo:
padaria não comissiona, loja de roupa depende disso (`fronteira` §2.3). **Ativação** isolado, só
núcleo. **Expõe** apuração por pessoa e por período, evento de atribuição. **Exige** do núcleo:
operador autenticado (ou vendedor informado na venda) e a venda concluída imutável — comissão apurada
sobre fato que muda é conflito, não relatório.
**Desligado** a venda registra o operador, como sempre, e ninguém apura comissão. **Sensível** vínculo entre pessoa e remuneração.

### `RSV` — Reserva · módulo
Comprometer antecipadamente um horário e, quando existir, um lugar — com confirmação e registro de
não comparecimento. **Escopo** módulo: nenhum dos três quebra sem ela (`fronteira` §4, resposta 2).
**Ativação** isolado, só núcleo; com `MSA` a reserva aponta para um lugar, sem `MSA` é só horário e
quantidade de pessoas. **Expõe** agenda e estado de cada reserva, evento de chegada e de ausência.
**Exige** do núcleo: estabelecimento, turno e fuso do cliente (reserva é um instante no fuso dele).
**Desligado** não há agenda; o atendimento é por ordem de chegada. **Sensível** nome e contato de quem reservou.

### `REL` — Relatórios gerenciais · módulo
Responder pergunta de gestão sobre o que já aconteceu: curva de item, comparativo, meta, desempenho.
**Escopo** módulo: útil, não indispensável, e cada cliente quer diferente (`fronteira` §2.5) — **a
exportação do próprio dado é núcleo** (`PN-10`) e não depende deste módulo. **Ativação** isolado, só
núcleo; enriquece com o que estiver ligado (`EST`, `COM`, `FIS`…) lendo o que cada um **expõe**, nunca
o de dentro deles. **Expõe** consultas agregadas por período e por estabelecimento, sempre dentro de
um cliente. **Exige** do núcleo: venda, pagamento e sessão de caixa como fatos imutáveis, e o fuso do
cliente para o corte de "hoje".
**Desligado** o cliente tem o fechamento do dia e a exportação do núcleo; nenhuma análise elaborada é
composta. **Sensível** agregado de dado de pessoa quando `CLF` está ligado; desempenho por operador.

### `INT` — Integração com terceiro · módulo
Deixar um parceiro autorizado do cliente (contador, marketplace, retaguarda) consumir e alimentar dado
por contrato publicado, com escopo e revogação. **Escopo** módulo: a **proibição** de dar acesso ao
banco é núcleo (`PN-14`), a capacidade de integrar é ativável por cliente (`fronteira` §4, resposta
2). **Ativação** isolado, só núcleo. **Expõe** o contrato publicado e versionado, e notificação de
fato relevante para quem assinou. **Exige** do núcleo: escopo de cliente em toda leitura, autorização
por papel, trilha de quem consumiu o quê.
**Desligado** nenhum terceiro tem acesso; a saída de dado é a exportação do núcleo, feita pelo cliente.
**Sensível** credencial do parceiro e todo dado que o contrato expõe — é a superfície externa.

### `GRD` — Grade de variantes · módulo, ligado por vertical (varejo de moda)
Tratar um mesmo item em combinações de eixos (cor, tamanho, sabor) sem multiplicar cadastro à mão.
**Escopo** módulo: padaria e posto não precisam, loja de roupa não vive sem (`fronteira` §2.2).
**Ativação** isolado, só núcleo; conversa com `EST` por evento quando há controle por combinação.
**Expõe** a combinação vendável e o código dela, consulta de eixos de um item. **Exige** do núcleo:
item com código e preço.
**Desligado** cada combinação é um item de catálogo próprio, cadastrado individualmente. **Sensível** —

### `ETQ` — Etiqueta · módulo, ligado por vertical (varejo)
Gerar identificação afixável à mercadoria (código, preço, validade, origem) e imprimi-la. **Escopo**
módulo: loja de roupa e mercado etiquetam, posto e serviço servido no ato não (`fronteira` §4,
resposta 2). **Ativação** isolado para gerar; **exige `PER`** para imprimir — sem `PER`, produz o
conteúdo e não imprime. **Expõe** conteúdo de etiqueta de um item ou lote. **Exige** do núcleo: item,
código e preço vigente.
**Desligado** o cliente etiqueta por fora, ou não etiqueta; a venda sai pelo código do item. **Sensível** —

### `BMB` — Bomba e abastecimento · módulo, ligado por vertical (posto)
Conversar com o equipamento que mede a saída do produto: liberar, ler o que saiu, virar pedido e
conferir totalizador contra o que foi vendido. **Escopo** módulo: padaria e loja de roupa não têm
equipamento medindo saída, posto não vende sem (`fronteira` §4, resposta 2); termo de ramo é esperado
nesta entrada. **Ativação** isolado, só núcleo; conversa com `EST` por evento para o estoque do tanque
e com `PRZ` quando o pagador é conta a prazo. **Expõe** abastecimento medido como origem de pedido,
leitura de totalizador, evento de divergência. **Exige** do núcleo: quantidade fracionária com casas
declaradas (§2.2 — é por isso que ela é núcleo), pedido e venda.
**Desligado** o operador lança item e quantidade à mão; a conferência de totalizador não existe.
**Sensível** identificação de veículo/pagador quando o abastecimento é vinculado a conta.

## 4. Camada 2 — módulos que exigem outro módulo

A dependência é contrato ou evento, verificada na ativação. Nenhum destes lê o de dentro do outro.

### `FTC` — Ficha técnica · módulo
Declarar de que insumos um item preparado é feito, e em que quantidade. **Escopo** módulo: quem
revende embalado não precisa (`fronteira` §2.2). **Ativação** isolado só para **documentar**
composição e custo; para baixar insumo ao vender, **exige `EST`**. **Expõe** composição e custo de um
item, evento de consumo previsto por item vendido. **Exige** do núcleo: item e unidade de medida; de
`EST`: o movimento de insumo, por evento.
**Desligado** o item preparado é vendido como item simples, sem consumo de insumo. **Sensível** —

### `FRN` — Fornecedor e compra · módulo
Registrar de quem se compra e o que entrou, com custo, para alimentar estoque e custo do item.
**Escopo** módulo: só faz sentido onde há controle do que entra (`fronteira` §4, resposta 2).
**Ativação** **exige `EST`** — sem estoque a entrada não tem para onde ir e o módulo viraria cadastro
sem consequência. **Expõe** compra e custo de entrada, evento de recebimento. **Exige** do núcleo:
item e estabelecimento; de `EST`: o movimento de entrada.
**Desligado** a entrada é lançada direto em `EST` (ou não é lançada); sem histórico de fornecedor nem
de custo de compra. **Sensível** identificação e contato do fornecedor (pessoa ou empresa).

### `FID` — Fidelidade · módulo
Acumular e resgatar benefício por compra recorrente de um cliente-final identificado. **Escopo**
módulo: política de cliente, não de ramo (`fronteira` §2.4; `glossario.md` §3.4). **Ativação** **exige
`CLF`** — sem identidade de quem compra não há a quem acumular; usa `VOU` quando o resgate vira
crédito. **Expõe** saldo de benefício, evento de acúmulo e de resgate. **Exige** do núcleo: venda
concluída como origem do acúmulo e o abatimento decidido no backend (`PN-13`); de `CLF`: a identidade
do cliente-final.
**Desligado** nenhum benefício é acumulado; a venda não muda. **Sensível** histórico de consumo ligado a pessoa identificada.

### `ENT` — Entrega em endereço · módulo
Levar o pedido até um endereço: destino, responsável pela entrega, estado do trajeto e comprovação.
**Escopo** módulo: loja de roupa e farmácia entregam igual ao serviço de alimentação — é módulo, não
vertical (`glossario.md` §3.4). **Ativação** **exige `CMP`**, porque entrega é um destino de
cumprimento e sem fila/estado não há o que acompanhar; usa `ECG` para taxa de entrega nomeada e `CLF`
para endereço guardado. **Expõe** estado da entrega e destino, evento de saída e de conclusão.
**Exige** do núcleo: pedido e venda; de `CMP`: o estado de cumprimento.
**Desligado** o pedido é retirado no estabelecimento. **Sensível** endereço, telefone e nome do destinatário; localização de quem entrega.

### `TRC` — Troca · módulo
Substituir mercadoria devolvida por outra, resolvendo a diferença de valor. **Escopo** módulo:
devolução é núcleo (`fronteira` §2.3), e troca com substituição e saldo é comportamento a mais, que
padaria e posto não usam. **Ativação** isolado para troca de valor igual ou com pagamento da
diferença; **exige `VOU`** quando sobra saldo a favor do cliente-final. **Expõe** a troca como par de
fatos ligados à venda original, evento de crédito gerado. **Exige** do núcleo: devolução como fato
novo referenciando o original (`PN-07`) e autorização por papel.
**Desligado** o cliente resolve com devolução + venda nova, sem vínculo entre elas. **Sensível** identificação de quem trocou, se a política do cliente exigir.

### `CSG` — Condicional · módulo, ligado por vertical (varejo de moda)
Deixar mercadoria sair sem venda, para decisão posterior, e cobrar ou receber de volta. **Escopo**
módulo: os três negócios do teste operam sem (`fronteira` §4, resposta 2). **Ativação** **exige
`EST`** — mercadoria fora sem venda é posse a controlar; usa `CLF` para saber com quem está. **Expõe**
o que está fora, com quem e desde quando, evento de retorno e de conversão em venda. **Exige** do
núcleo: item e a venda concluída quando a condicional se converte; de `EST`: o movimento.
**Desligado** não existe saída sem venda; o cliente controla por fora. **Sensível** identificação de
quem levou a mercadoria.

### `PCF` — Pedido pelo cliente-final · módulo
Deixar o cliente-final montar o próprio pedido, no dispositivo dele ou em terminal de autoatendimento,
e mandar para dentro do PDV. **Escopo** módulo: os três negócios vendem sem canal para o cliente-final
(`fronteira` §4, resposta 2), e o canal (dispositivo do cliente-final ou terminal de autoatendimento)
é **configuração**, não módulo novo. **Ativação** **exige `PUB`** (não há canal sem conteúdo a exibir)
e **exige um destino**: `MSA` quando o pedido cai em consumo em aberto, `CMP` quando cai em
fila/retirada — sem destino declarado, a ativação é recusada; usa `PGO` para pagamento antecipado e
`CLF` quando o pedido é identificado. **Expõe** o pedido de origem externa, marcado pelo canal, para o
núcleo tratar como qualquer pedido. **Exige** do núcleo: pedido, preço vigente e **todo** cálculo de
valor, desconto e disponibilidade — `PCF` coleta e exibe (`PN-13`); exige também a identidade do
interlocutor como **requisito** (anônimo por sessão, identificado por contato, ou conta), cuja
estratégia é **D-03** e não se presume aqui.
**Desligado** todo pedido nasce de um operador; nenhuma superfície externa existe.
**Sensível** contato e identificação do cliente-final, endereço quando há `ENT`, e o vínculo entre
sessão externa e pedido.

### `ATI` — Atendimento com IA · módulo
Atender em linguagem natural: tirar dúvida sobre o catálogo, montar pedido e passar para humano quando
não sabe. **Escopo** módulo: os três negócios operam sem (`fronteira` §4, resposta 2) — é capacidade,
não postura, e `PN-16` vale com ele ligado ou desligado. **Ativação** **exige `PUB`** (é sobre o
catálogo publicado que ele responde); para atender cliente-final, **exige `PCF`**, que é quem define
canal, destino do pedido e identidade do interlocutor — ligado sem `PCF`, atende **operador** e nada
mais. **Expõe** proposta de pedido e proposta de ação, sempre como **proposta pendente**, e evento de
transferência para humano. **Exige** do núcleo: cálculo de valor, disponibilidade e autorização — nada
disso vive aqui; e o limite de `PN-16`: automação **propõe**, o que move valor ou altera fato
concluído exige confirmação de operador com papel autorizado, com proposta + confirmação na trilha, e
sem resposta confiável ela entrega a conversa a um humano em vez de improvisar.
**Desligado** o atendimento é humano; nenhuma proposta automática existe e nenhum canal muda.
**Sensível** **conteúdo de conversa** (pode conter qualquer coisa que o interlocutor escreva, inclusive
dado de pessoa não solicitado), identificação do interlocutor, e o que sai para provedor externo de
modelo. Retenção de conversa é decisão de produto pendente, declarada na spec do módulo, não aqui.

## 5. Verticais — a receita mora em outro arquivo

Vertical **não tem código de módulo** e não é ativável: é a lista de módulos que o ramo liga, a
configuração padrão e o vocabulário (`fronteira` §1). Comportamento de ramo que não cabe em nenhum
módulo é sinal de fronteira de módulo errada, **nunca** licença para código de ramo (`PN-09`). Não
existe "desligar uma vertical": desliga-se módulo.

As receitas de `RES`, `PST` e `VAR` saíram deste arquivo para **`receitas-por-vertical.md`**, e o
eixo do corte é o **motivo de mudança**: entrada de módulo muda quando o módulo muda; receita muda
quando ligamos ou revisamos uma vertical. O detalhe de cada ramo (fluxo, jargão, hardware, regras
`RN-<VERT>-nnn`) continua em `verticais/<ramo>.md`.

## 6. Candidatos que ficaram sem código, de propósito

Código é imutável e nunca reaproveitado (`glossario.md` §4.1): reservar código para módulo que talvez
não exista gera código aposentado sem uso. Estes ficam nomeados, sem código, até alguém os pedir.

- **Recorrência/assinatura** (cobrança periódica de um plano) — plausível, sem demanda declarada.
- **Marketing e campanha** (envio à base de clientes-finais) — depende de `CLF` e de uma decisão sobre
  uso de dado de pessoa que ninguém tomou. **Ponto, escala e folha** — `fronteira` §2.6 já colocou
  fora do produto hoje. **Múltiplos idiomas** — `fronteira` §2.1, fora de escopo hoje.
- **Loja própria na internet** — hoje é `PUB` + `PCF` + `PGO` combinados; vira módulo só se a
  combinação provar que não basta.
- **Partição do fiscal** — deixou de ser candidato: está **decidida** em `FIS` / `EMI` / `APU`
  (`modulos/fiscal.md` §1), com os três códigos já no registro de `glossario.md` §4.3.

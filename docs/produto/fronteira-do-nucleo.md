# A fronteira do núcleo

Este arquivo responde uma pergunta por item: **isto é do núcleo de venda, de um módulo, de um ramo
ou deste cliente?** É a decisão mais cara de errar no projeto. Regra de ramo colocada no núcleo
aparece no PDV de quem não é daquele ramo, e só sai com ciclo expand/contract em N clientes.

**O teste, aplicado item por item:** um posto de gasolina, uma padaria e uma loja de roupa precisam
**todos** disto? Se um dos três não precisa, não é núcleo. Não vale responder "mas seria bom para
todos" — a pergunta é se a operação dos três **quebra** sem aquilo.

## 1. Os seis escopos, e o que cada um pode conter

| Escopo | O que é | Contém código próprio? |
|---|---|---|
| **Núcleo** | O que todo negócio que vende precisa para vender, receber e prestar contas. | Sim. É o que sempre está ligado. |
| **Módulo** | Capacidade ativável por cliente, sem deploy dedicado e sem alterar o núcleo. | Sim. |
| **Vertical (ramo)** | **Receita**: quais módulos ligar, com que configuração padrão, e o vocabulário do ramo. | **Não.** |
| **Cliente** | **Valores**: configuração daquele cliente dentro dos módulos que ele tem. | **Não.** |
| **Plataforma** | O **mecanismo** que faz um produto servir N clientes e N ramos: isolamento por cliente, registro de módulo ativo, manifesto de tela, ciclo de migration, provisionamento. | Sim. |
| **Provedor** | O **nosso negócio**: operar, sustentar, faturar e melhorar a Forja para N clientes (`operacao-do-provedor.md`). | Sim — e **se é a mesma aplicação do PDV é decisão aberta** (`D-01`/`D-02`). |

A linha que mais evita discussão futura: **vertical não é implementação.** Se um comportamento do
ramo não cabe em nenhum módulo, isso não autoriza "código de restaurante" — é sinal de que falta um
módulo ou de que a fronteira de um módulo existente está errada. Mesma coisa para cliente: exceção
de cliente que exige código é **dívida declarada**, com regra numerada, escopo `cliente:<id>` e a
regra geral que ela supera citada. Nunca é o caminho fácil.

**As duas últimas linhas entraram em 2026-08-23, e a ausência delas era defeito, não economia.**
`plataforma` já era usada como valor de escopo em §2.1 sem ter linha aqui, e o quinto escopo estava
anunciado em prosa em quatro arquivos sem endereço nenhum (`RN-EMI-040`, `RN-REL-006`,
`papeis-e-permissoes.md:189`, `modulos/relatorios-semente-de-perguntas.md:186`). O que cada uma **pode**
e **nunca pode** conter:

- **Plataforma** — pode conter o mecanismo multi-cliente e multi-ramo. **Nunca** desce para módulo nem
  para vertical, e **nunca** é "regra de venda": `plataforma ≠ núcleo de venda`.
- **Provedor** — pode conter papel nosso, o que observamos para operar, a nossa trilha e a contagem que
  só existe somando clientes. **Nunca** contém regra de venda, capacidade ativável por cliente, papel de
  cliente, nem alcance a fato de negócio de cliente sem autorização declarada (`RN-PRV-001`,
  `RN-PRV-010`). E **nunca** herda o nome "plataforma": são espécies diferentes, e o nome errado aqui
  viaja para nome de coluna na Fase 1 (`RN-PRV-002`).

Os dois **não descem** e **não sobem**: nada em `plataforma` ou em `provedor` vira módulo, vertical ou
configuração de cliente, e nenhum item de venda sobe para eles por conveniência de lugar.

## 2. O resultado do teste, item por item

Motivo em uma cláusula. Onde a resposta ao teste é "não", a cláusula diz **qual dos três** não
precisa — é isso que torna a classificação auditável depois.

### 2.1 Escopo, identidade e operação

| Item | Escopo | Motivo |
|---|---|---|
| Isolamento de dado por cliente (tenant) | plataforma | Nenhum cliente pode ver dado de outro, independentemente de ramo ou módulo. |
| Vários estabelecimentos por cliente | núcleo | Os três podem ter mais de uma unidade, e o dinheiro de uma não se mistura com o da outra. |
| Terminal identificado, vinculado a estabelecimento | núcleo | Sem saber de onde veio a venda não se confere caixa em nenhum ramo. |
| Fuso e moeda do cliente | núcleo | "Vendas de hoje", turno e fechamento dependem do fuso do cliente, não do servidor. |
| Registro de módulos ativos por cliente | plataforma | É o mecanismo que faz o resto ser plugável. |
| Composição de tela por manifesto | plataforma | É como um binário serve ramos diferentes. |
| Operação com rede instável, sem perder venda | **núcleo** | Os três operam com internet ruim; perder venda é o pior defeito de PDV depois de vazar dado. |
| Idempotência de operação que move dinheiro | **núcleo** | Reenvio acontece em qualquer ramo; duplicar venda é prejuízo direto. |
| Múltiplos idiomas de interface | fora de escopo hoje | Nenhum cliente-alvo exige; entra como capacidade quando exigir, não antes. |

### 2.2 Catálogo e preço

| Item | Escopo | Motivo |
|---|---|---|
| Item vendável com código e preço | núcleo | Sem isso não existe venda em ramo nenhum. |
| Unidade de medida com casas decimais declaradas | núcleo | Combustível vende em fração, padaria em peso, roupa em unidade — o núcleo tem que servir os três. |
| Lista de preço por contexto e vigência | núcleo | Os três mudam preço e precisam saber qual valia no dia da venda passada. |
| Item composto por eixos (cor/tamanho) | módulo | Padaria e posto não precisam; loja de roupa não vive sem. |
| Composição por insumo (ficha técnica) | módulo | Quem revende embalado não precisa. |
| Promoção condicional (regra de combinação) | módulo | Nenhum dos três quebra sem ela. |
| Descrição rica e imagem do item | módulo | Só faz sentido onde existe canal para o cliente-final ver. |
| Controle de estoque | módulo | Padaria produz, posto mede tanque, loja conta peça: nem a necessidade nem a mecânica são comuns. |

### 2.3 Pedido e venda

| Item | Escopo | Motivo |
|---|---|---|
| Pedido em construção (itens, quantidade, preço aplicado) | núcleo | É o ato de vender; existe nos três. |
| Venda concluída **imutável** | núcleo | Prestação de contas nos três depende de o fato passado não mudar. |
| Correção por fato novo (cancelamento, devolução, estorno) | núcleo | Errar acontece nos três; a forma de corrigir é a mesma. |
| Desconto e acréscimo com limite por papel | núcleo | Os três dão desconto e os três precisam limitar quem dá. |
| Identificação **opcional** do cliente-final na venda | núcleo | Documento do comprador é pedido nos três; guardar histórico dele não. |
| **Modo de atendimento** declarado no pedido, no mínimo presencial × entrega em endereço | núcleo | O documento fiscal exige saber qual dos dois é, e os três podem entregar; valor a mais (retirada, salão × balcão) é módulo/vertical. |
| **Observação livre no item de pedido** | núcleo | Os três recebem instrução que muda como a linha é atendida ("sem cebola", "ajustar a barra", "embalar para presente") e hoje a anotam no papel; ela existe sem módulo de produção. |
| Cadastro e histórico de cliente-final, fidelidade | módulo | Padaria de balcão vende a vida inteira sem cadastrar ninguém. |
| Ciclo de cumprimento (fila, preparo, entrega, retirada) | módulo | Loja de roupa entrega na hora; posto entrega na bomba. |
| Consumo em aberto vinculado a lugar físico | módulo (ligado por vertical) | Só existe onde se consome antes de pagar. |
| Encargo nomeado (serviço, entrega, embalagem) | módulo / vertical | Padaria e loja de roupa não cobram; o acréscimo do núcleo cobre o caso simples. |
| Orçamento que pode não virar venda | módulo | Nenhum dos três quebra sem ele. |
| Comissão de quem vendeu | módulo | Padaria não comissiona; loja de roupa depende disso. |

### 2.4 Pagamento

| Item | Escopo | Motivo |
|---|---|---|
| Vários pagamentos para uma venda, com troco | núcleo | Pagar parte em dinheiro e parte em cartão acontece nos três. |
| Meio de pagamento como domínio fechado | núcleo | Os três precisam separar o que é dinheiro do que é cartão para conferir caixa. |
| Estorno de pagamento como fato novo | núcleo | Consequência direta da imutabilidade da venda. |
| Integração com adquirente / captura em terminal de cartão | módulo | Mecanismo e parceiro variam por cliente, não por ramo; o núcleo só registra o resultado. |
| Conta a prazo (frota, convênio, crediário) | módulo | Mesma mecânica em ramos diferentes; nenhum dos três a exige. |
| Pagamento antecipado por canal externo | módulo | Depende de existir canal externo. |
| Voucher, vale, fidelidade como forma de abater valor | módulo | Política de cliente, não necessidade de ramo. |

### 2.5 Caixa, turno e prestação de contas

| Item | Escopo | Motivo |
|---|---|---|
| Sessão de caixa: abertura, fundo, fechamento, conferência | núcleo | Os três recebem dinheiro em espécie e precisam fechar o dia. |
| Sangria e suprimento | núcleo | Consequência de guardar dinheiro em gaveta, comum aos três. |
| "Abrir gaveta" como operação sensível autorizada e registrada | núcleo | Onde tem dinheiro tem desvio; o registro é o controle. |
| Acionamento do periférico de gaveta | módulo | O driver depende do equipamento do cliente, não do ramo. |
| Turno operacional do estabelecimento | núcleo | Existe nos três e é o eixo de conferência de responsabilidade. |
| Fechamento do dia por estabelecimento | núcleo | Saber quanto entrou e comparar com o contado é obrigação dos três. |
| Relatório gerencial elaborado (curva, comparativo, meta) | módulo | Útil, não indispensável; e é o tipo de coisa que cada cliente quer diferente. |

### 2.6 Pessoas e controle

| Item | Escopo | Motivo |
|---|---|---|
| Operador autenticado em cada ação | núcleo | Sem autor, não há trilha; e sem trilha não há controle de dinheiro. |
| Papel com permissão verificada no backend | núcleo | Os três têm dono, gerente e caixa com poderes diferentes. |
| Trilha de auditoria de operação sensível | núcleo | É a única prova de quem cancelou, quem descontou, quem abriu a gaveta. |
| Ponto, escala, folha | fora do produto hoje | Nenhum dos três compra um PDV por isso. |

### 2.7 Obrigação documental (detalhe em §6)

| Item | Escopo | Motivo |
|---|---|---|
| A venda pode exigir documento; a venda guarda a referência e o estado dele | núcleo | Os três emitem documento; sem a âncora, o módulo não tem onde se prender. |
| O estabelecimento tem identidade jurídica própria | núcleo | Documento é emitido em nome de alguém, nos três. |
| Regra, apuração, emissão, contingência, regime | módulo `FIS` | A regra muda por lei, por regime e por cliente; o núcleo não pode mudar com ela. |
| Momento de emissão dentro do fluxo operacional | vertical | Quem consome antes de pagar emite em outro instante que quem paga no ato. |

## 3. O que nunca desce do núcleo

Independentemente de qualquer pedido de cliente ou de conveniência de módulo:

1. **Imutabilidade do fato concluído** — venda, pagamento e movimento de caixa não se editam nem se
   apagam. Nenhum módulo recebe permissão de alterar fato passado.
2. **Autoria e autorização** — nenhum módulo executa operação sensível sem papel verificado no
   backend e trilha gravada.
3. **Cálculo de valor devido** — total, desconto e tributo são decididos no backend do núcleo/módulo
   responsável, nunca na tela e nunca no manifesto.
4. **Não perder venda** — a continuidade da operação com rede ruim é do núcleo. Nenhum módulo pode
   ser condição para vender; módulo indisponível degrada, não bloqueia o caixa.
5. **Isolamento por cliente** — nenhum módulo, relatório ou exportação cruza cliente.
6. **Vocabulário do núcleo** — nenhum termo de ramo entra em nome, condição ou spec de núcleo
   (`glossario.md` §5).

## 4. Como classificar um item novo

**Antes da lista, uma pergunta que a lista não faz — e é ela que o teste dos três negócios responde
errado.** *Isto é mecanismo multi-cliente, ou é do nosso negócio?* Se é mecanismo → **plataforma**; se é
nosso → **provedor**; e nenhum dos dois entra na lista abaixo. Sem essa pergunta primeiro, "isolamento de
dado por cliente" responde **sim** aos três negócios e a lista o classifica como núcleo, que é o erro que
§2.1 já não comete na prática e a lista permitia no papel.

Depois, na ordem, parando no primeiro "sim":

1. Os três negócios do teste **quebram** sem isto? → **núcleo**.
2. Dá para ligar e desligar sem tocar no núcleo, e alguém opera bem sem isto? → **módulo**.
3. É a lista de módulos que um ramo liga, a configuração padrão dele ou o jargão dele? →
   **vertical** (sem código próprio).
4. É um valor, limite, texto ou preferência dentro de um módulo que o cliente já tem? →
   **cliente** (configuração).
5. Nada disso serve? Então a fronteira de módulo está errada. **Não escolha por eliminação** — traga
   como pergunta.

Erro de classificação assumido explicitamente é aceitável; classificação silenciosa não. Toda
resposta "2" ou "3" que fica na dúvida vira linha em `RISCOS` da tarefa.

## 5. Vertical ou cliente — a distinção que o humano levantou

A pergunta prática: esta diferença é **"o ramo funciona assim"** ou **"este cliente quer assim"**?

**É de vertical quando:**
- o próximo cliente do mesmo ramo vai precisar disto **sem pedir** — é a operação do ramo, não uma
  opinião;
- quem trabalha no ramo tem **nome próprio** para isso, e usa esse nome antes de nos conhecer;
- a operação do ramo **não fecha** sem isso (não é "fica melhor", é "não dá para trabalhar");
- dois clientes do ramo, disputando entre si, fariam igual.

**É de cliente quando:**
- dois clientes do mesmo ramo podem discordar e **os dois estarem certos** (cobra taxa de serviço ou
  não; exige senha de gerente acima de qual valor; imprime comprovante sempre ou só se pedirem);
- é **valor, limite, texto ou preferência** — não capacidade nova;
- muda porque o dono mudou de ideia, não porque o ramo mudou;
- dá para expressar como configuração de um módulo que ele já tem.

**Teste de decisão rápido:** escreva a diferença como frase e troque o sujeito. "Restaurante fecha a
conta antes de emitir o documento" continua verdade com outro restaurante → vertical. "Restaurante
cobra 10% de serviço" não continua verdade com outro restaurante → cliente.

### 5.1 Por que confundir custa caro

| Erro | O que acontece | Custo de sair |
|---|---|---|
| Regra de **cliente** promovida a **vertical** | O próximo cliente do ramo recebe comportamento que ele não pediu, e descobre operando. | Já está em produção em N clientes do ramo: virar isso em configuração é expand/contract mais renegociação com quem já se acostumou. |
| Regra de **vertical** rebaixada a **cliente** | A mesma coisa é reescrita a cada venda nova do ramo, divergindo em cada cópia. | Correção de defeito tem que ser aplicada N vezes, e o ramo nunca fica mais barato de vender — o ganho de escala do produto simplesmente não acontece. |
| Regra de **cliente ou vertical** promovida a **núcleo** | Aparece no PDV de quem não é do ramo, como campo inútil, etapa a mais ou termo que ninguém entende. | O pior dos três: mexe em núcleo com todos os clientes em produção. |

**Assimetria deliberada:** na dúvida entre vertical e cliente, escolha **cliente** (configuração) —
promover depois é barato, remover comportamento que já foi entregue não é. Na dúvida entre módulo e
núcleo, escolha **módulo**, pela mesma razão. A regra "escolha o mais geral que ainda é verdade"
vale para **conhecimento**; para **comportamento**, o padrão é o escopo mais estreito que resolve.

### 5.2 Onde a diferença mora, na prática

- Diferença de **vertical** → uma linha na receita da vertical: "este ramo liga os módulos X, Y, Z
  com a configuração padrão P".
- Diferença de **cliente** → um valor de configuração dentro de um módulo que ele já tem.
- Diferença de cliente que **não cabe** em configuração → regra numerada de escopo `cliente:<id>`,
  com `supera:` apontando a regra geral, e o custo de manter as duas declarado no relatório. É o
  último recurso, e é contado como dívida.

## 6. Obrigação fiscal — o que é núcleo, o que é vertical, o que é cliente

Aqui **não** entra regra fiscal concreta: nem alíquota, nem sigla de documento, nem prazo, nem
layout, nem data de calendário legal. Isto é só a divisão de responsabilidade — a arquitetura do
módulo é passo separado.

**Núcleo (não negocia, não desce):**
- A venda é fato imutável, e é ela o fato gerador da obrigação.
- A venda guarda **a referência e o estado** da obrigação documental: exigida, emitida, rejeitada,
  cancelada, pendente. O núcleo não sabe o que cada estado significa por dentro.
- Correção documental é **fato novo** referenciando o original — nunca edição do passado.
- O estabelecimento tem identidade jurídica própria; o dinheiro e os documentos de um não se
  misturam com os do outro.
- **Falha na emissão não pode impedir a venda de existir.** A obrigação é resolvida depois; a venda
  não se perde porque a rede caiu.

**Módulo `FIS` (onde a regra vive):**
- Regra com **vigência**, apuração, emissão, contingência, retransmissão, coexistência de regimes.
- O fato gerador **congela** a versão de regra que o produziu: fato passado nunca é recalculado por
  regra nova.

**Vertical:**
- **Quando** a obrigação é cumprida dentro do fluxo operacional do ramo (quem consome antes de pagar
  emite em outro instante que quem paga no ato de retirar a mercadoria).
- Que tipo de documento o ramo tipicamente precisa, e para quem ele vai.
- Nada disso é código: é receita e configuração padrão.

**Cliente:**
- Regime tributário e identidade fiscal de cada estabelecimento.
- **Se a obrigação é cumprida pela Forja ou fora dela:** ligar `EMI` (nós montamos, assinamos e
  transmitimos por ele) ou deixar `EMI` desligado, com a obrigação no contador ou no provedor dele —
  configuração suportada, não degradação (`modulos/fiscal.md` §3.1). Com `EMI` ligado, ainda é dele a
  escolha entre credencial sob nossa custódia (padrão) e credencial mantida fora da Forja
  (`RN-EMI-003`). Credencial **nunca** fica no repositório.
- Dado tributário dos itens do catálogo dele.
- Preferências operacionais: emitir sempre ou só quando pedirem; consolidar ou emitir por parte.

**A capacidade que nós construímos — e esta não é decisão de cliente:** a Forja **emite por conta
própria** (decisão do humano, T-0001). Monta o documento a partir do fato já tributado, assina,
transmite, trata o retorno, guarda, cancela e opera contingência: é o módulo `EMI`
(`modulos/fiscal.md` §3, `fiscal-emissao-propria.md`, `fiscal-emissao-contingencia.md`). Não somos
consumidores de provedor de terceiro. A redação anterior desta seção — "quem emite por ele: provedor,
integrador ou emissão própria" como decisão de cliente — misturava duas perguntas diferentes: **quem
cumpre a obrigação de um cliente** (é dele) e **que capacidade existe no produto** (é nossa).

O que **não** está respondido, e não é de produto: se a Forja atua como **intermediária fiscal de
terceiro** — emitindo, assinando ou transmitindo em nome de quem **não** é cliente (tenant) dela
(revenda, escritório de contabilidade com carteira própria, plataforma intermediária). É decisão
comercial e de responsabilidade legal → `PERGUNTAS: para humano`. Enquanto não houver resposta, toda
spec presume o caso estreito: emitimos **apenas** para estabelecimento de cliente (tenant) da Forja.

**O que não afirmamos** — e que precisa vir do humano ou do contador dele antes de qualquer spec
fiscal: quais documentos emitimos, se a emissão é própria ou por terceiro, quais regimes os
clientes-alvo têm, e o que da transição tributária em curso ele considera fechado. Enquanto isso não
existir, spec fiscal com número é alucinação, não trabalho adiantado.

## 7. Reclassificar depois

Vai acontecer: algo aqui está errado e só se descobre com cliente operando.

- **Descer do núcleo para módulo** segue expand/contract: o módulo nasce, o núcleo para de ser lido,
  e a remoção é release separado com aval do humano. Nada é apagado por decisão de agent.
- **Subir de módulo para núcleo** exige que o teste dos três negócios passe para **todos** — e a
  primeira pergunta é por que ele falhava antes.
- Toda reclassificação vira **decisão registrada** com o motivo e o que se aprendeu. Reclassificação
  silenciosa faz esta tabela mentir, e a tabela é o que impede a próxima discussão de recomeçar do
  zero.

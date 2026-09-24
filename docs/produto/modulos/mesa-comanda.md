# Módulo `MSA` — Mesa e comanda

Spec profunda do módulo. A entrada curta é `catalogo-de-modulos.md` (`MSA`) — este arquivo aprofunda e
**não** a substitui. Código de `glossario.md` §4.3, imutável. Regras numeradas `RN-MSA-nnn`.

**O que este arquivo não faz:** não define tabela, coluna, rota, contrato técnico, tela, componente ou
bloco — territórios de `arquiteto-dados`, `backend` e `ui`. Não calcula dinheiro: total, desconto,
acréscimo e troco são do núcleo (`glossario.md` §1.3 e §1.4), tributo e segregação são dos módulos
fiscais (`modulos/fiscal.md` §3.1), encargo nomeado é `ECG` (`PN-13`). Não decide prioridade de
construção (é do humano). Nenhuma afirmação fiscal é feita aqui: o que dependeria de norma está na §7
como `LACUNA-MSA-n` ou remetido a `RN-RES-nnn` de `verticais/restaurante.md`.

## 1. Propósito e fronteira

**Propósito.** Acumular consumo em aberto — vinculado a um lugar físico ou a uma ficha — durante um
tempo em que o valor devido ainda não está fechado, e entregá-lo ao núcleo para virar **uma** cobrança
no fim. É o módulo do "consome primeiro, paga depois" dentro do estabelecimento.

**O que o módulo é de verdade:** um pedido do núcleo que fica aberto, ganha lançamentos de mais de uma
pessoa e de mais de um dispositivo, muda de lugar, se junta a outro, se divide, atravessa a virada do
dia e a troca de operador — e só no fim vira venda. Tudo o que `MSA` acrescenta ao núcleo é isso:
**duração, vínculo e movimentação** do consumo antes da cobrança.

**Mesa e comanda são um módulo só, e é deliberado.** A mecânica é idêntica: consumo em aberto ligado a
um **alvo**. Muda apenas o tipo do alvo — lugar físico (mesa), ficha/cartão entregue à pessoa
(comanda), ou nome de exibição. Quais tipos o cliente usa é configuração (`RN-MSA-013`), não módulo
diferente. Consequência aceita: um bar que só usa ficha carrega o conceito de lugar desligado por
configuração, e não paga nada por isso. Código é imutável: separar depois exigiria **código novo**
(`glossario.md` §4.1) — por isso a decisão está declarada aqui, não implícita.

**Fora da fronteira de `MSA`:** estado de preparo e fila de produção (`COZ`); fila, senha e retirada de
pedido que não se encerra no ato (`CMP`); reserva de horário/lugar (`RSV`); histórico de pessoa
(`CLF`); taxa de serviço e couvert (`ECG`); comissão do atendente (`COM`); documento fiscal (`FIS`,
`EMI`). Nenhum desses é importado por `MSA`: a conversa é por contrato ou evento (invariante 2).

## 2. Entidades conceituais

Conceitos, não estruturas de dados. O nome em inglês, quando existe, é o de `glossario.md` §3.1.

- **Consumo em aberto** (comanda, `tab`) — o acúmulo mutável de lançamentos com identidade própria,
  desde a abertura até o encerramento. É a entidade central do módulo.
- **Alvo do vínculo** — o que localiza o consumo no serviço: lugar físico (mesa, `table`), ficha/cartão,
  ou nome de exibição. O alvo é **endereço**, não identidade (`RN-MSA-003`).
- **Praça / área** (`service_area`) — agrupamento de lugares para dividir atendimento. Existe só quando
  o alvo é lugar físico.
- **Lançamento** — o ato de acrescentar item de pedido ao consumo, com autor e instante. O item em si é
  do núcleo (`order_item`); `MSA` acrescenta a quem, quando e em qual consumo. A **observação do item**
  (`order_item_note`, `glossario.md` §1.3) também é do núcleo e viaja com o item: `MSA` transporta e
  apresenta, não interpreta — quem a lê para produzir é `COZ`.
- **Responsável pelo consumo** — o operador (papel de atendente ou equivalente) atribuído ao consumo
  naquele momento. Muda por fato registrado, não por dedução de turno.
- **Movimentação** — transferência (troca de alvo), junção (dois consumos viram um) e separação (um
  vira dois). Cada uma é fato com autor, instante e motivo quando aplicável.
- **Repartição de fechamento** (divisão de conta, `bill_split`) — como os lançamentos do consumo se
  distribuem entre partes no momento de cobrar. Não é entidade viva: existe no fechamento.
- **Encerramento** — o fim do consumo, por cobrança (vira venda) ou por cancelamento com motivo.
- **Peça de conferência** — a apresentação do acumulado ao cliente-final antes de pagar ("a conta").
  Não é venda, não é comprovante, não é documento fiscal e não fixa valor (`RN-MSA-001`).

## 3. Casos de uso

1. Abrir consumo em um alvo declarado, com responsável identificado.
2. Lançar item no consumo, de terminal fixo ou de dispositivo na mão, com o link caído ou não.
3. Consultar o acumulado parcial e apresentar a peça de conferência ao cliente-final.
4. Retirar item lançado por engano ou por devolução no salão, com papel autorizado.
5. Transferir o consumo inteiro, ou item a item, para outro alvo.
6. Juntar dois consumos (mesas que viraram uma) e separar um consumo em dois.
7. Abrir um segundo consumo no mesmo alvo, declaradamente (dois consumos separados na mesma mesa).
8. Trocar o responsável pelo consumo na virada de turno, com o consumo aberto.
9. Fechar o consumo inteiro em uma cobrança, ou reparti-lo em várias.
10. Atravessar o fechamento da sessão de caixa e a virada do dia com consumo aberto.
11. Encerrar consumo esquecido ou não cobrável, por decisão de quem tem papel para isso.
12. Operar tudo acima com um ponto de produção inalcançável ou com `COZ` desligado.

## 4. Regras

Campos: **Enunciado** (testável) · **Motivo** · **Aceite** (caso concreto) · **Infeliz** (caminho
infeliz). Numeração imutável (`glossario.md` §4.2). Nenhuma regra deste arquivo é PROVISÓRIA: nenhuma
depende de lacuna para existir — a §7 registra o que muda de **forma**, não de comportamento.

### RN-MSA-001 — Consumo em aberto não é venda, e nada nele fixa valor devido

**Enunciado:** enquanto o consumo está aberto não existe venda, valor devido definitivo, pagamento nem
obrigação documental; o acumulado exibido é informação, e a peça de conferência entregue ao
cliente-final é declaradamente não fiscal e não vincula valor.
**Motivo:** pedido é mutável e venda é imutável (`glossario.md` §1.3); no salão o fato gerador é o
fechamento, não o lançamento (`RN-RES-004`). Tratar o acumulado como venda criaria N fatos imutáveis
sobre intenção que ainda muda.
**Aceite:** abrir consumo, lançar 5 itens ao longo de 40 minutos, imprimir a conferência, retirar 1
item com papel autorizado, fechar → **uma** venda com 4 itens, nenhuma venda cancelada, nenhum
documento cancelado; e durante os 40 minutos o consumo não aparece em nenhuma consulta de vendas nem
de faturamento do dia.
**Infeliz:** o cliente-final contesta o valor **depois** do fechamento → não é edição da venda
(`PN-07`); é fato novo do núcleo (cancelamento ou devolução), sujeito ao que `RN-RES-004` e
`LACUNA-RES-007` tratam. A **forma** da peça de conferência depende de `[[LACUNA-MSA-1]]`; o
comportamento (não é venda, não fixa valor) não depende dela.

### RN-MSA-002 — Todo consumo nasce com alvo declarado e responsável identificado

**Enunciado:** abrir consumo exige um alvo declarado e um operador responsável identificado; consumo
sem um dos dois é recusado na abertura.
**Motivo:** o alvo é como o consumo é encontrado no pico, e o responsável é a única forma de atribuir o
lançamento errado a alguém. Sem os dois, o lançamento cai no consumo de outra pessoa — é aí que o
dinheiro escapa no ramo.
**Aceite:** tentar abrir consumo sem alvo → recusado, com mensagem de operação e ação possível
(`PN-17`); com alvo → aberto e localizável **pelo alvo**, sem consultar identificador interno.
**Infeliz:** o alvo já tem consumo aberto → o produto **não** cria um segundo silenciosamente e **não**
funde os dois: apresenta o existente e exige escolha explícita entre lançar nele ou abrir um segundo
consumo declarado no mesmo alvo, ficando os dois distinguíveis por quem opera.

### RN-MSA-003 — O alvo é endereço, não identidade

**Enunciado:** lugar e ficha são reutilizados muitas vezes no mesmo dia; a identidade do consumo é
própria e independente do alvo, e nenhum lançamento, histórico ou saldo é atribuído ao alvo como se o
alvo fosse o consumo.
**Motivo:** a mesa 12 tem oito consumos num dia e a ficha 30 volta ao maço depois de paga. Confundir
alvo com identidade mistura consumo de clientes-finais diferentes — é cobrança de quem não consumiu.
**Aceite:** fechar o consumo da mesa 12 e abrir outro na mesma mesa em seguida → dois consumos
distintos; o segundo nasce **vazio**, e nenhum lançamento do primeiro aparece nele nem em sua
conferência.
**Infeliz:** a mesma ficha é entregue a outro cliente-final antes de o consumo anterior ser encerrado
→ cai em `RN-MSA-002` (alvo com consumo aberto exige escolha explícita), e a correção é transferência
item a item (`RN-MSA-005`), nunca edição do lançamento.

### RN-MSA-004 — Lançamento tem autor, e retirar item é fato novo autorizado

**Enunciado:** cada lançamento carrega autor e instante; retirar item já lançado é operação sensível
que exige papel autorizado, motivo e trilha, e **não** apaga o lançamento — registra a retirada.
**Motivo:** `PN-07` e `PN-11`. Cancelar item já lançado é o caminho natural de furto no ramo
(`verticais/restaurante.md` §2.1): sem autor e sem trilha, o item some do consumo e da conferência.
**Aceite:** operador com papel apenas de lançamento tenta retirar item → negado **no backend**, mesmo
que a interface tenha sido burlada, e a tentativa entra na trilha; quem a célula autoriza retira → o
consumo passa a não cobrar o item, e a trilha mostra lançamento e retirada, com autor, instante e motivo
de cada um. **Quem é** vem da célula, não desta prosa (`RN-NUC-039`): "retirar item lançado" é linha da
matriz de módulos (§2) — `R` para `manager` e `owner`, `N·cfg` para `cashier` (concedível pela
configuração de `RN-MSA-013`, sempre **com registro**), recusa offline.
**Infeliz:** o item já foi produzido → a retirada do consumo **não** desfaz a produção. O trabalho é
encerrado pelo caminho de `COZ` (`RN-COZ-007`) e o descarte é declarado; quantificá-lo como perda de
insumo só existe se `EST` estiver ligado. Sem `COZ`, o aviso à produção é por fora, como hoje.

### RN-MSA-005 — Transferência move o consumo; não copia, não recria, não reenvia trabalho

**Enunciado:** transferir consumo (inteiro ou item a item) entre alvos preserva a identidade, o autor e
o instante de cada lançamento; nada é recriado com instante novo, e nada é reenviado à produção.
**Motivo:** recriar lançamento quebra a trilha, reabre a janela de furto e faria a cozinha produzir
duas vezes o mesmo item (`RN-RES-007`). Transferir é rotina, não exceção: o cliente-final troca de
lugar, a mesa cheia se abre em duas, a ficha é trocada.
**Aceite:** consumo com 4 lançamentos transferido para outro alvo → os 4 mantêm autor e instante
originais, a trilha registra a transferência com autor, e nenhum trabalho novo chega à produção.
**Infeliz:** destino inválido, ou dois operadores transferindo o mesmo consumo ao mesmo tempo → uma
transferência vence e a outra é **recusada** apresentando o estado atual; nunca "a última escrita
ganha", nunca item duplicado, nunca item perdido no caminho.

### RN-MSA-006 — Junção e separação preservam o conjunto, item por item

**Enunciado:** juntar dois consumos em um, ou separar um em dois, preserva o conjunto de lançamentos:
nada é criado, nada desaparece, e a soma das partes reproduz exatamente o todo.
**Motivo:** mesmo motivo de `RN-RES-006` — é onde o dinheiro escapa por soma que não fecha. E o
histórico precisa dizer de onde cada lançamento veio, senão a conferência com o cliente-final é
indefensável.
**Aceite:** dois consumos de 3 e 2 lançamentos juntados → um consumo com 5 lançamentos, cada um com
autor e instante originais, e o registro aponta os dois consumos de origem.
**Infeliz:** uma das partes já está em fechamento ou com pagamento em curso → a junção é **recusada
antes de qualquer efeito**; não existe junção parcial, e nenhum lançamento fica em dois consumos.

### RN-MSA-007 — A divisão é repartição entregue ao núcleo; `MSA` nunca calcula valor

**Enunciado:** `MSA` entrega ao núcleo **quais lançamentos vão em qual parte** (ou a instrução "dividir
igualmente em N"); quem calcula total, encargo, desconto e tributo de cada parte é o núcleo e os
módulos responsáveis. `MSA` não soma, não rateia e não distribui centavo.
**Motivo:** `PN-13` e `fronteira-do-nucleo.md` §3.3. Rateio feito no módulo (ou pior, na tela) é
divergência garantida entre o que o cliente-final vê e o que é cobrado.
**Aceite:** consumo de 3 itens repartido em 2 partes, uma delas com metade de um item (quantidade
fracionária do núcleo) → a repartição reproduz exatamente os 3 itens, e os totais de cada parte vêm do
backend; nenhum valor exibido é composto por `MSA`.
**Infeliz:** repartição que sobra ou falta lançamento → o fechamento é recusado **antes** de concluir
qualquer cobrança (`RN-RES-006`); nenhuma parte é concluída "para resolver o resto depois". Divisão
igualitária que não fecha em centavos → a diferença é resolvida por quem calcula o valor, e `MSA`
apenas transporta a instrução.

### RN-MSA-008 — Um consumo produz no máximo uma cobrança concluída

**Enunciado:** um consumo em aberto pode ser fechado **uma única vez**; repetir o fechamento — inclusive
depois de resposta perdida ou de reinício do terminal — devolve o mesmo resultado (a mesma venda, ou o
mesmo conjunto de vendas da repartição), nunca uma segunda cobrança.
**Motivo:** `PN-02`. Cobrar duas vezes a mesma mesa é o defeito de dinheiro mais visível do ramo — quem
descobre é o cliente-final, no balcão, com fila atrás.
**Aceite:** enviar o fechamento do mesmo consumo três vezes, uma delas com a resposta derrubada no meio
→ uma venda, um pagamento, um documento; as repetições devolvem o mesmo resultado.
**Infeliz:** dois terminais fecham o mesmo consumo ao mesmo tempo com repartições diferentes → uma
vence, a outra é recusada com o estado atual apresentado a quem opera; em nenhuma das duas fica venda
parcial concluída. Exclusividade **com o link caído** é requisito duro declarado em `RN-MSA-011`.

### RN-MSA-009 — Consumo em aberto atravessa sessão de caixa, turno e virada de dia

**Enunciado:** nada em `MSA` fecha, cancela ou congela consumo por causa de fechamento de sessão de
caixa, de fim de turno ou de virada de dia no fuso do cliente; e o consumo sobrevive à troca do
operador responsável, que é fato registrado.
**Motivo:** `RN-RES-005`; turno é eixo independente da sessão de caixa (`glossario.md` §1.5). Mesa que
abre 23:50 e fecha 00:30 é rotina, e o atendente que abriu pode ter ido embora antes de o consumo
fechar.
**Aceite:** abrir consumo às 23:50 no fuso do cliente, fechar a sessão de caixa às 00:10 com o consumo
aberto, trocar o responsável, lançar mais um item e fechar às 00:40 → a sessão fecha reportando o
consumo aberto, os lançamentos posteriores são aceitos, a troca de responsável está na trilha, e a
venda pertence ao dia e ao turno da **conclusão**.
**Infeliz:** o responsável sai sem transferir a responsabilidade → o consumo não fica órfão: passa a
responder ao responsável do turno como pendência declarada, e o próximo lançamento exige que alguém
assuma a responsabilidade explicitamente.

### RN-MSA-010 — Consumo é encerrado por decisão humana, nunca pelo relógio

**Enunciado:** nenhum consumo é fechado, cancelado, arquivado ou descartado automaticamente por tempo,
por virada de dia, por fim de expediente ou por rotina de limpeza; encerrar exige papel autorizado,
motivo, e escolha explícita entre cobrança e cancelamento.
**Motivo:** `RN-RES-005` (caminho infeliz) e `PN-07`. Fechamento automático cria venda que não
aconteceu, ou apaga consumo que aconteceu — os dois são falsificação de fato.
**Aceite:** consumo aberto há três dias → continua aberto, contável e visível como pendência ao
responsável; só é encerrado por operador autorizado, que escolhe cobrança (com pagamento) ou
cancelamento (com motivo), e a escolha fica na trilha com autor e instante.
**Infeliz:** consumo que não pode ser cobrado (o cliente-final foi embora sem pagar) → é encerrado como
cancelamento com motivo, **nunca** como venda paga fantasma nem como descarte silencioso; o valor não
cobrado fica declarado. Se esse encerramento tem qualquer reflexo documental: `[[LACUNA-MSA-2]]`.

### RN-MSA-011 — O consumo em aberto opera com o link caído

**Enunciado:** abrir, lançar, consultar e conferir consumo funcionam com o link de internet indisponível
e sem depender de o terminal que cobra estar acessível no mesmo instante; lançamentos são fatos
**aditivos** e convergem sem perda quando a conexão volta.
**Motivo:** `PN-01`, `PN-15` e `verticais/restaurante.md` §4 — o dispositivo que lança não é o que
cobra, e a rede local não cobre bem o salão inteiro.
**Aceite:** cortar o link, lançar em duas mesas de dois dispositivos diferentes, restabelecer → nenhum
lançamento se perde e nenhum aparece duplicado (`PN-02`); durante o corte, o operador vê no próprio
terminal que há pendências e quantas, sem interpretação técnica (`PN-15`).
**Infeliz:** operação **não aditiva** (transferência, junção, retirada de item, fechamento) tentada
enquanto o dispositivo não tem o consumo em estado confirmado → é recusada, apresentando o último
estado conhecido e o instante dele, e quem opera decide. O produto **não** resolve por relógio nem por
"última escrita ganha". Este é o requisito mais duro que `MSA` impõe a quem construir o fluxo: manter
exclusividade de fechamento (`RN-MSA-008`) com rede intermitente — declarado aqui como exigência, e a
forma de garanti-la é de `backend`, não deste arquivo.

### RN-MSA-012 — Nada em `MSA` depende de `COZ`, e nada nele espera preparo

**Enunciado:** lançar, transferir, repartir e fechar consumo funcionam com `COZ` desligado e com o ponto
de produção inalcançável; `MSA` não consulta estado de preparo para aceitar, alterar ou encerrar
consumo, e "pronto" não é condição de nada aqui.
**Motivo:** invariante 2 (módulo não importa módulo) e `RN-RES-007`. Se fechar dependesse do preparo,
um display caído travaria o caixa no pico (`PN-01`, `RN-RES-010`).
**Aceite:** com `COZ` desligado, o ciclo completo (abrir, lançar, conferir, repartir, fechar) roda igual
e nenhuma etapa cita produção; com `COZ` ligado e o ponto inalcançável, o lançamento é aceito, o
consumo permanece íntegro e o fechamento não é bloqueado.
**Infeliz:** fechar consumo com trabalho ainda em produção → **permitido**, e o produto avisa que há
trabalho em curso sem bloquear. O que acontece com esse trabalho é regra de `COZ` (`RN-COZ-005`,
`RN-COZ-007`), não de `MSA`.

### RN-MSA-013 — Alvo, praça e limites são configuração do cliente

**Enunciado:** quais tipos de alvo existem (lugar, ficha, nome), quantos lugares, como se agrupam em
praças, quem pode transferir, juntar, retirar item e encerrar consumo — tudo isso é configuração do
cliente, editável por ele, sem chamado e sem deploy.
**Motivo:** `fronteira-do-nucleo.md` §5.2, `PN-03`, `PN-09` e `PN-20`. Dois clientes do mesmo ramo
discordam disso e os dois estão certos.
**Aceite:** o `owner` — célula `R` só para ele na linha "configurar alvos, praças, limites e papéis
autorizados" (matriz de módulos §2), recusa offline — cria uma praça com 6 lugares e muda quem pode
transferir, sem intervenção nossa; o próximo consumo já respeita a mudança, e a trilha registra quem
mudou o quê (`PN-20`).
**Infeliz:** o cliente quer comportamento que não cabe em configuração → vira regra numerada de escopo
`cliente:<id>` na sequência deste módulo, com `supera:` apontando a regra geral e o custo declarado
(`fronteira-do-nucleo.md` §5.2). Nunca condicional a cliente no código (`PN-09`).

### RN-MSA-014 — Ficha nominal é opcional e o dado de pessoa é o mínimo do serviço

**Enunciado:** vincular consumo a um nome é opcional; `MSA` guarda apenas o necessário para localizar o
consumo durante o serviço, não constrói histórico por pessoa e não cruza consumos por nome.
**Motivo:** histórico de cliente-final é `CLF` (`fronteira-do-nucleo.md` §2.3). Sem esta regra, `MSA`
vira cadastro de pessoas por acidente — capacidade que o cliente não ligou e dado que ninguém decidiu
guardar.
**Aceite:** com `CLF` desligado, é possível abrir consumo nominal por nome de exibição, encerrá-lo e
conferir que nenhuma consulta relaciona dois consumos pelo mesmo nome, e que nada além do que a venda
do núcleo já retém foi criado.
**Infeliz:** o cliente quer reconhecer quem já veio → liga `CLF`, e a identificação passa a ser do
módulo dono do dado de pessoa. `MSA` não passa a guardar por conta própria. Prazo de retenção do nome
de exibição é decisão pendente do humano (§7).

## 5. Contrato do módulo

**Expõe** (contrato ou evento; nunca o de dentro): o consumo em aberto de um alvo, com seus lançamentos
e o acumulado informativo · a lista de consumos abertos de um estabelecimento, com responsável, alvo e
instante de abertura · evento de abertura, de lançamento, de retirada de item, de transferência, de
junção, de separação, de troca de responsável e de encerramento (com o desfecho: cobrança ou
cancelamento) · a repartição entregue no fechamento.

**Exige do núcleo:** pedido mutável (é ele que acumula) e venda concluída imutável no fechamento ·
cálculo de valor devido, desconto, acréscimo e troco · operador autenticado com papel verificado no
backend e trilha de auditoria · idempotência em tudo que move dinheiro · continuidade offline ·
estabelecimento, turno e fuso do cliente · isolamento por cliente.

**Exige do cliente (configuração):** tipos de alvo em uso, lugares e praças, e os papéis autorizados a
transferir, juntar, retirar item e encerrar consumo (`RN-MSA-013`).

**Ativação:** isolado, só núcleo. Não exige nenhum outro módulo. `PCF` com destino `MSA` exige `MSA`
ativo, e a ativação sem ele é recusada (`RN-RES-008`, caminho infeliz) — a dependência é de `PCF`, não
de `MSA`.

**Desligado:** todo pedido é aberto e fechado no ato, no ponto de cobrança. Nenhuma tela, termo ou etapa
cita mesa, comanda, praça ou divisão de conta (`PN-04`); o restaurante que opera só balcão fecha venda
normalmente, e é isso que prova que consumo em aberto é módulo e não núcleo (`RN-RES-008`). Nada quebra:
`MSA` não é condição para vender (`fronteira-do-nucleo.md` §3.4).

**Sensível:** nome de exibição do cliente-final quando a ficha é nominal (`RN-MSA-014`) · vínculo entre
operador e o consumo, que é insumo de apuração de comissão quando `COM` está ligado e de avaliação de
desempenho · a trilha de retiradas de item, que é dado sobre conduta de pessoa identificada e por isso
é lida por papel autorizado, não exposta na operação. Nenhum dado de pagamento existe em `MSA`: o meio
e o resultado do pagamento são do núcleo. Proteção e retenção são de `seguranca` e do humano.

**Registra** (acrescentado em 2026-09-12, `CLAUDE.md` §7.10): a abertura do consumo, com alvo,
responsável e instante · cada lançamento, com o autor — que muda quando ele vem do cliente-final por
`PCF`, e é o autor que muda, nunca a regra (§6) · cada retirada de item, com autor e a autoridade que
a permitiu (`RN-MSA-004`) · transferência, junção e separação, cada uma com o antes e o depois, que é
o que mantém "de onde veio este item" respondível depois de o alvo mudar · troca de responsável · o
encerramento **com o desfecho** — cobrança ou cancelamento —, nunca o consumo saindo da lista sem
dizer em quê deu · a repartição entregue no fechamento · e a recusa de qualquer uma delas, pelo fato
de recusa do núcleo (`RN-NUC-043`).

**Não registra**, e cada um com o motivo:

- **Quem é o cliente-final.** O nome de exibição existe só quando a ficha é nominal (`RN-MSA-014`);
  identidade persistente é de `CLF`, opt-in, e `MSA` não passa a guardar por conta própria (§4,
  infeliz).
- **Por que o operador retirou a linha.** Obter o motivo exige perguntar no meio do serviço, que é
  etapa a mais no caminho crítico; onde ele existe sem perguntar, já é enumerado na lista fechada de
  recusa (`RN-NUC-054`, motivo).
- **Duração de nada** — tempo de mesa, tempo até fechar e ocupação são derivados dos marcos
  (`RN-NUC-045`), e marco é o que se registra.
- **Duas ausências que não são decisão, e ficam aqui para não passarem por uma.** A **colisão** —
  dois operadores, ou um operador e o canal externo, sobre o mesmo consumo, e um perde — produz
  recusa, mas o motivo disponível não a diagnostica (achado 2.3 de
  `captura-varredura-invariante-10-2026-09-11.md`). E o **segundo consumo aberto no mesmo alvo** não
  distingue operação real de operador que não achou o consumo certo (achado 2.7). As duas são
  ausência **acidental**, com card e dono; escrevê-las nesta lista não as converte em ausência
  decidida.

## 6. Fronteira com os outros módulos

- **`COZ`** — `MSA` expõe o lançamento; `COZ` decide o que fazer com ele. `MSA` **não** lê fila nem
  etapa de preparo, e `COZ` **não** altera consumo (`RN-MSA-012`, `RN-COZ-010`). Os dois funcionam
  sozinhos: `MSA` sem `COZ` serve o bar que só entrega o que já está pronto; `COZ` sem `MSA` serve o
  balcão que cobra antes.
- **`CMP`** — `MSA` cobre o consumo que se encerra **no** estabelecimento, com cobrança no fim; `CMP`
  cobre o pedido que não se encerra no ato (fila, senha, retirada) e é o dono do **estado de
  cumprimento** (`glossario.md` §6). Num restaurante só de salão, `CMP` desligado não deixa nada
  faltando, e por isso ele **não** é base da receita do ramo (`receitas-por-vertical.md` §5). Se um pedido precisa dos dois,
  são dois destinos distintos do mesmo pedido, não um módulo dentro do outro.
- **`PCF`** — o cliente-final lança no próprio dispositivo com destino `MSA`; o consumo é o mesmo, o
  autor do lançamento é que muda. Toda regra desta spec vale igual, inclusive `RN-MSA-004` (autor) e
  `RN-MSA-011` (offline).
- **`ECG`, `FIS`/`EMI`** — encargo nomeado entra em linha própria segregada (`RN-RES-003`) e o
  documento nasce no fechamento (`RN-RES-004`). `MSA` informa **quando** o consumo fechou e o que ele
  continha; não decide valor, base, tratamento nem documento.
- **`RSV`, `CLF`, `COM`, `EST`** — apontam para o consumo ou consomem o que ele expõe. Nenhum deles é
  condição para `MSA` operar, e `MSA` não é condição para nenhum deles.

## 7. Lacunas e pendências

Perguntas abertas em 2026-08-22. Nenhuma bloqueia o comportamento das regras da §4; todas podem mudar a
**forma** de um artefato ou o registro de um encerramento.

- `[[LACUNA-MSA-1: a peça de conferência entregue ao cliente-final antes do pagamento ("a conta") tem exigência de forma, de dizeres, ou vedação para não ser confundida com documento fiscal ou comprovante? — sem fonte em 2026-08-22]]`
- `[[LACUNA-MSA-2: consumo em aberto encerrado como cancelamento, sem cobrança (cliente-final saiu sem pagar), gera qualquer reflexo documental ou é só controle interno? — sem fonte em 2026-08-22]]`
- `[[LACUNA-MSA-3: a divisão de conta em várias vendas (RN-RES-006) gera um documento por parte — existe vedação a emitir vários documentos para o mesmo consumo, ou exigência de vínculo declarado entre eles? — sem fonte em 2026-08-22]]`

**Pendente com o humano, não com fonte:** por quanto tempo o nome de exibição de uma ficha nominal fica
retido depois do encerramento do consumo (`RN-MSA-014`). É decisão de produto do humano, não questão
fiscal — e sem ela a retenção nasce por omissão, que é o modo de dado de pessoa acumular sem ninguém
decidir.

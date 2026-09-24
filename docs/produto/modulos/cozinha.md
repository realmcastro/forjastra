# Módulo `COZ` — Produção / cozinha

Spec profunda do módulo. A entrada curta é `catalogo-de-modulos.md` (`COZ`) — este arquivo aprofunda e
**não** a substitui. Código de `glossario.md` §4.3, imutável. Regras numeradas `RN-COZ-nnn`.

**O nome do arquivo é o nome que o humano usa; o vocabulário interno não é.** `COZ` é
**cross-vertical**: uma padaria, uma cafeteria, uma lanchonete e um serviço de montagem ligam o mesmo
módulo. Por isso, daqui para baixo o módulo fala de **ponto de produção** e de **trabalho a produzir** —
"cozinha", "chapa", "bar", "confeitaria" são nomes que o cliente dá aos pontos dele, e o mapeamento do
jargão é receita da vertical (`verticais/restaurante.md` §3). Nenhuma regra deste arquivo pressupõe
alimentação.

**O que este arquivo não faz:** não define tabela, coluna, rota, contrato técnico, tela, componente ou
bloco — territórios de `arquiteto-dados`, `backend` e `ui`. Não calcula dinheiro: valor, desconto,
encargo e tributo são do núcleo e dos módulos fiscais (`PN-13`). Não decide prioridade de construção.
O que dependeria de norma está na §7 como `LACUNA-COZ-n`.

## 1. Propósito e fronteira

**Propósito.** Transformar item pedido em **trabalho a produzir**, entregá-lo ao ponto de produção
certo, manter visível em que etapa cada trabalho está, e sinalizar que ficou pronto — sem nunca ser
condição para vender, cobrar ou concluir.

**O que o módulo é de verdade:** a ponte entre "alguém pediu" e "alguém fez", num ambiente onde quem
produz tem as mãos ocupadas, a rede é pior que em qualquer outro canto do estabelecimento, e a fila é
recurso disputado entre modos de atendimento (`verticais/restaurante.md` §2.5).

**Fora da fronteira de `COZ`:** consumo em aberto e cobrança (`MSA`, núcleo); fila de espera do
cliente-final, senha e retirada (`CMP`); entrega em endereço (`ENT`); insumo, saldo e perda
quantificada (`EST`); composição do item a partir de insumo (`FTC`); impressão e equipamento (`PER`);
disponibilidade de venda e preço (núcleo). `COZ` não importa nenhum desses: conversa por contrato ou
evento (invariante 2).

**Vocabulário — resolvido.** O léxico deste módulo é **léxico de módulo**, não de ramo:
`glossario.md` §6 registra **ponto de produção** (`production_point`), **trabalho a produzir**
(`production_work`), **etapa de produção** (`production_stage`), **painel** e **via de produção**, e o
papel **operador de produção** (`production_operator`). Os identificadores `preparation_order` e
`preparation_stage` foram **aposentados** — carregavam o ramo e colidiam com `order` (pedido) do
núcleo. O jargão do ramo segue mapeado em `verticais/restaurante.md` §3.

## 2. Entidades conceituais

- **Ponto de produção** — posto de trabalho que prepara, monta ou transforma antes da entrega. Quais
  existem, como se chamam e o que cada um faz é configuração do cliente.
- **Trabalho a produzir** — a unidade do módulo: o que precisa ser feito, derivado de um item de pedido
  (ou de parte dele), endereçado a um ponto. Tem identidade própria e vida própria: nasce no
  lançamento, não na venda.
- **Etapa** — o estado do trabalho: pendente, em produção, pronto, entregue, encerrado sem produzir
  (descartado ou não produzível). Avança por ação registrada, com autor e instante.
- **Roteamento** — a regra que decide qual ponto recebe qual trabalho. Configuração do cliente,
  resolvida no servidor.
- **Fila do ponto** — o conjunto de trabalhos ainda não concluídos naquele ponto, em ordem declarada.
- **Agrupamento de saída** — os trabalhos que devem ficar prontos juntos (o mesmo pedido, o mesmo alvo
  de entrega, a mesma etapa do serviço). É intenção declarada, não sincronização automática.
- **Destino de entrega** — para onde o produzido vai, como referência **recebida** de quem originou o
  pedido (lugar, ficha, senha, balcão, entrega). `COZ` transporta, não interpreta.
- **Instrução de preparo** — não é conceito próprio deste módulo: é a **observação do item de pedido**
  (`order_item_note`, `glossario.md` §1.3) lida por quem produz. **O dono é o núcleo** — ela nasce com
  o item, viaja com ele e existe sem `COZ` (embalagem, presente, "sem gelo" no balcão). `COZ` lê e
  apresenta; nunca cria, nunca valida, nunca altera. Regra numerada é da spec do núcleo
  (`[[LACUNA-GLO-002]]`).
- **Caminho de apresentação** — como o trabalho chega a quem produz: tela no ponto, impressão dirigida
  (`PER`), ou leitura em outro dispositivo. É capacidade, não desenho de tela.
- **Apresentação confirmada** — o fato de que aquele trabalho já chegou ao ponto. É o que evita
  apresentar duas vezes e o que mede o atraso de entrega ao ponto (§5).

## 3. Casos de uso

1. Item lançado gera trabalho e chega ao ponto certo, com ou sem venda existindo.
2. Um item gera trabalho em mais de um ponto, com etapas próprias.
3. Quem produz marca em produção, marca pronto e marca entregue.
4. Quem serve/entrega marca entregue sem que quem produz tenha registrado.
5. A fila de um ponto acumula e alguém precisa saber quanto e desde quando.
6. Item é retirado do pedido depois de o trabalho ter começado, ou depois de pronto.
7. O ponto não consegue produzir o item (faltou insumo, equipamento parou).
8. O caminho de apresentação de um ponto cai no meio do serviço, e volta depois (§5).
9. O cliente muda o roteamento durante o serviço.
10. O estabelecimento opera com `MSA` desligado (balcão), e com `MSA` ligado (salão), sem mudar o
    contrato de `COZ`.
11. Um ponto opera só com impressão, sem tela nenhuma.

## 4. Regras

Campos: **Enunciado** (testável) · **Motivo** · **Aceite** (caso concreto) · **Infeliz** (caminho
infeliz). Numeração imutável (`glossario.md` §4.2). Nenhuma regra é PROVISÓRIA: nenhuma depende de
lacuna para existir.

### RN-COZ-001 — Trabalho nasce do lançamento, não da venda

**Enunciado:** o item lançado gera trabalho no instante do lançamento; venda concluída não é condição
para produzir, e concluir a venda depois **não** gera trabalho novo nem reapresenta o existente.
**Motivo:** `RN-RES-007` (onde este caso é a rotina do ramo). Onde se produz antes de cobrar, amarrar a
produção à venda faz o ponto esperar o pagamento; e reapresentar no fechamento produz o item duas vezes.
**Aceite:** lançar item num consumo em aberto → o ponto recebe o trabalho sem existir venda; fechar o
consumo depois → nenhum trabalho novo aparece em nenhum ponto e nenhum é reapresentado.
**Infeliz:** o pedido morre sem virar venda (cancelado, desistência) → o trabalho já emitido **não** é
apagado: é encerrado como descartado, com autor e motivo, e o descarte fica declarado. Quantificar o
insumo perdido só existe se `EST` estiver ligado.

### RN-COZ-002 — O roteamento é configuração do cliente, decidida no servidor

**Enunciado:** qual ponto recebe qual trabalho vem de configuração do cliente (por item, por
agrupamento de catálogo, por estabelecimento, por modo de atendimento), resolvida no backend; nenhum
operador escolhe o ponto dentro do fluxo de lançamento e nenhum terminal decide o roteamento.
**Motivo:** `PN-03` (configuração não mora no terminal) e `PN-13` aplicado à decisão de servidor. Se o
roteamento fosse escolha do operador no pico, cada terminal produziria um resultado diferente e o item
sairia do ponto errado.
**Aceite:** o mesmo item lançado de dois dispositivos diferentes chega ao **mesmo** ponto; mudar a
configuração durante o serviço afeta o próximo lançamento e **não** muda o roteamento de trabalho já
emitido (`PN-08`).
**Infeliz:** item sem roteamento configurado → o trabalho não desaparece e o lançamento não é bloqueado
(`fronteira-do-nucleo.md` §3.4): vai ao ponto padrão declarado do estabelecimento, marcado como sem
roteamento, e a falta fica visível a quem configura. Nunca descarte silencioso.

### RN-COZ-003 — Um item pode gerar trabalho em mais de um ponto, e cada trabalho tem etapa própria

**Enunciado:** um item de pedido pode originar mais de um trabalho (pontos distintos, etapas em
sequência); cada trabalho tem etapa própria, e o item só é "pronto" quando **todos** os trabalhos dele
estão prontos.
**Motivo:** é a operação real de quem tem mais de um ponto: uma parte do mesmo pedido sai de um ponto,
outra de outro, em tempos diferentes. Tratar o item como unidade indivisível faria o ponto mais rápido
esperar o mais lento, ou o item ser apresentado como pronto sem estar.
**Aceite:** item configurado para dois pontos → dois trabalhos, cada um com sua etapa; marcar pronto em
um deles **não** torna o item pronto, e quem serve vê qual parte falta.
**Infeliz:** um dos pontos está inalcançável → os outros produzem normalmente, o item fica pendente
naquela parte, e o estado apresentado diz **qual** parte falta e desde quando. Nunca "pronto" parcial
apresentado como pronto.

### RN-COZ-004 — Etapa avança por ação declarada, nunca por tempo

**Enunciado:** pendente → em produção → pronto → entregue avança por ação registrada com autor e
instante; nenhum estado avança por temporizador, e "pronto" nunca é inferido de tempo estimado.
**Motivo:** estado inferido por relógio anuncia como pronto o que ninguém fez, e deixa esfriar/esperar
o que já estava. Tempo é **medição** para quem gerencia (`RN-COZ-011`), não fato de produção.
**Aceite:** trabalho parado 40 minutos permanece em produção e aparece como atraso na fila do ponto;
nada o marca pronto sozinho, e ninguém é avisado de que ficou pronto.
**Infeliz:** quem produz não tem como registrar (o ponto só tem impressão, o dispositivo caiu, as mãos
estão ocupadas) → o avanço pode ser registrado por outro papel autorizado — quem retira, quem serve,
quem gerencia — sempre com o **autor real**. O produto não finge que a produção registrou.

### RN-COZ-005 — "Pronto" é notificação, não permissão

**Enunciado:** a etapa de um trabalho não libera nem impede nada no núcleo: não autoriza cobrança, não
fecha consumo, não conclui venda, não emite documento e não é condição de nenhuma operação de dinheiro.
**Motivo:** invariante 2 e `PN-01`. Se fechar a venda dependesse de "pronto", um ponto de produção
caído travaria o caixa exatamente no pico (`RN-RES-010`).
**Aceite:** fechar um consumo com trabalho em produção → conclui normalmente (`RN-MSA-012`); marcar
pronto depois de a venda estar concluída → nada muda no dinheiro, no documento nem na venda.
**Infeliz:** o cliente quer impedir a cobrança antes de tudo estar entregue → isso é **aviso** a quem
opera, nunca bloqueio de conclusão; se ele insistir em bloqueio, é regra de escopo `cliente:<id>` com
`supera:` declarado e custo registrado (`fronteira-do-nucleo.md` §5.2), e contraria `PN-01` — o que
significa que ela é recusada, não configurada.

### RN-COZ-006 — A fila nunca esconde trabalho

**Enunciado:** a ordem apresentada em cada ponto vem de regra declarada (ordem de lançamento,
prioridade por modo de atendimento, hora prometida quando o cliente a configurou); trabalho **só** sai
da fila por etapa concluída ou por encerramento autorizado — nunca por idade, por volume, por limite de
apresentação ou por reordenação automática.
**Motivo:** trabalho que desaparece da fila é trabalho que ninguém faz, e quem descobre é o
cliente-final esperando. A disputa de fila entre modos de atendimento é real
(`verticais/restaurante.md` §2.5) e precisa ser regra declarada, não efeito colateral.
**Aceite:** 200 trabalhos pendentes num ponto → todos continuam contáveis e alcançáveis, o total
pendente e o mais antigo são visíveis, e nenhum é omitido da fila.
**Infeliz:** a fila cresce além do que o ponto consegue produzir → o produto **declara** o acúmulo
(quantos e desde quando) a quem produz e a quem gerencia, e não reordena nem oculta para a fila parecer
menor. Priorizar é decisão humana registrada, com a regra de prioridade do cliente como padrão.

### RN-COZ-007 — Retirar item não desfaz o que já foi feito

**Enunciado:** quando o item sai do pedido ou do consumo (`RN-MSA-004`), o trabalho correspondente é
encerrado como descartado (não iniciado), como produzido-e-descartado (já pronto) ou como entregue —
com autor e motivo. O trabalho nunca é apagado, e nenhuma etapa registrada é revertida.
**Motivo:** `PN-07`. O insumo e o tempo foram gastos de verdade; apagar o trabalho esconde desperdício
e apaga a única prova de que aquele item existiu.
**Aceite:** retirar item antes de o trabalho iniciar → encerrado como descartado, e o ponto é avisado;
retirar item já pronto → encerrado como produzido-e-descartado, o descarte fica declarado, e a trilha
mostra quem retirou e por quê.
**Infeliz:** o ponto está inalcançável e não recebe o aviso → o aviso fica pendente e é apresentado
quando o ponto voltar; enquanto isso, o caminho degradado declarado pelo cliente (impressão em outro
ponto, outro dispositivo, ou voz e papel) é caminho **válido** (`PN-18`). Item já produzido e já
entregue não volta a ser trabalho: a correção é do consumo/venda, não daqui.

### RN-COZ-008 — Ponto de produção indisponível não para o serviço

**Enunciado:** quando o caminho de apresentação de um ponto fica indisponível — tela caída,
impressora parada, rede local morta até aquele canto — o lançamento continua sendo aceito, o trabalho
continua sendo emitido e registrado, e a indisponibilidade é visível a quem lança e a quem gerencia,
não apenas no ponto que caiu.
**Motivo:** `RN-RES-010` (contingência é operação normal do pico), `PN-01`, `PN-15` e `PN-18`. A área de
produção é o pior ambiente de rede e o pior ambiente físico do estabelecimento
(`verticais/restaurante.md` §4): tratar a queda como exceção é tratar o pico como exceção.
**Aceite:** cortar a rede local até um ponto durante o serviço e lançar 5 itens → os 5 lançamentos são
aceitos e os 5 trabalhos existem e são contáveis; quem lançou vê, no ato, que aquele ponto está
inalcançável e quantos trabalhos aguardam apresentação; ao restabelecer, o ponto recebe os 5 em ordem
de lançamento e **cada um uma única vez** (`PN-02`).
**Infeliz:** o ponto não volta durante o serviço → o trabalho é apresentado pelo caminho alternativo
declarado do cliente (outro ponto, outro dispositivo, ou voz e papel), o produto continua contando o
pendente e o atraso de apresentação, e **nada é descartado por não ter sido apresentado**. O que se
perde, e o que não se perde, está detalhado na §5.

### RN-COZ-009 — O trabalho carrega o destino que recebeu, e `COZ` não olha dentro de outro módulo

**Enunciado:** cada trabalho carrega a referência de destino informada por quem originou o pedido —
lugar, ficha, senha, balcão, entrega — como referência recebida; `COZ` não consulta o interior de `MSA`,
`CMP`, `PCF` ou `ENT` e não deduz destino.
**Motivo:** invariante 2. Sem a referência viajando com o trabalho, o produzido sai do ponto e ninguém
sabe de quem é; com `COZ` lendo o de dentro de `MSA`, os dois deixam de ser plugáveis.
**Aceite:** com `MSA` desligado, o trabalho de uma venda de balcão carrega a referência da venda (ou a
senha, se `CMP` estiver ligado) e é entregável; com `MSA` ligado, carrega a referência do lugar ou da
ficha — e o contrato de `COZ` é **o mesmo** nos dois casos, sem ramificação por módulo ativo.
**Infeliz:** o canal de origem não informou destino → o trabalho ainda é emitido, marcado sem destino, e
exige resolução por quem opera **antes da entrega**; o lançamento nunca é bloqueado por isso.

### RN-COZ-010 — `COZ` não move dinheiro, não altera pedido e não decide disponibilidade

**Enunciado:** nada em `COZ` altera item, quantidade, preço, total, tributo ou estado de venda; e
"acabou o item" não é decisão de `COZ` — disponibilidade é catálogo/`EST`.
**Motivo:** `PN-13` e `fronteira-do-nucleo.md` §3.3. E se a produção pudesse alterar o pedido, o
cliente-final receberia coisa diferente da que pediu sem ninguém autorizar.
**Aceite:** nenhum caminho de `COZ` altera valor ou composição do pedido; quem produz sinalizando "não
tem mais" gera **proposta** a quem tem papel para mudar catálogo ou estoque (`PN-16`), nunca efeito
direto na venda.
**Infeliz:** o ponto não consegue produzir (faltou insumo, equipamento parou) → o trabalho é encerrado
como **não produzível**, com motivo, quem lançou é avisado, e a correção do pedido ou do consumo é feita
por quem tem papel para isso (`RN-MSA-004`). `COZ` não retira item nem devolve valor.

### RN-COZ-011 — Tempo é medição, não promessa

**Enunciado:** `COZ` registra instantes (emitido, apresentado, iniciado, pronto, entregue) e expõe o
decorrido; não estima tempo de preparo como fato e não promete prazo ao cliente-final.
**Motivo:** prazo prometido é decisão de negócio do cliente, não cálculo nosso, e estimativa
apresentada como fato vira reclamação no balcão. `PN-16`: automação propõe, não decide.
**Aceite:** nenhum canal recebe de `COZ` um "fica pronto em X" que `COZ` tenha inventado; o que existe é
decorrido **medido** e, quando o cliente configurou uma promessa por ponto ou por modo, ela é exposta
como configuração dele, com o desvio medido visível.
**Infeliz:** um canal externo (`PCF`, `INT`) exige prazo para exibir → recebe a promessa configurada
pelo cliente, ou nada. `COZ` não preenche a lacuna com estimativa própria.

### RN-COZ-012 — Quem produz é identificado, e as ações sensíveis do ponto são autorizadas

**Enunciado:** registrar avanço de etapa, encerrar trabalho sem produzir e reordenar fila são operações
com papel verificado no backend e trilha de quem, quando e o quê; o dispositivo do ponto **não** é
identidade.
**Motivo:** `PN-11`. Encerrar trabalho sem produzir é onde desperdício e desvio se esconder — sem autor,
não há como distinguir erro de operação de subtração de mercadoria.
**Aceite:** encerrar trabalho sem produzir com papel que não tem essa permissão → negado no backend,
mesmo que a interface tenha sido burlada, e a tentativa entra na trilha; com papel autorizado →
registrado com autor, instante e motivo.
**Infeliz:** o ponto opera um dispositivo compartilhado, sem identificação individual (rotina do ramo) →
o produto exige um **responsável identificado por sessão do ponto** e registra as ações sob ele,
declarando explicitamente que a granularidade ali é a sessão, não a pessoa. É dívida declarada, não
silêncio. **D-03** herda este requisito: papel e sessão de ponto são requisito de negócio; a estratégia
de identidade é decisão do humano.

## 5. Quando o ponto de produção cai no meio do serviço

Não é caminho de exceção: é o pico (`RN-RES-010`). Esta seção responde o que acontece com cada coisa, e
diz o que **se perde**.

**O trabalho já apresentado.** Sobrevive. O que foi impresso está na mão de quem produz e a produção
continua sem nós; o que estava na tela, se o dispositivo do ponto retém localmente o que recebeu,
continua legível. O estado no sistema fica congelado no último registro anterior à queda, e é
apresentado como **último estado conhecido, com o instante** — nunca como estado atual.

**O trabalho em curso.** Aqui há perda possível, e ela é declarada: avanço de etapa registrado no ponto
enquanto ele está sem rede sobe quando a conexão volta, **com o instante em que aconteceu**, não o da
sincronização. Se o dispositivo do ponto não retém (só imprime, foi reiniciado, foi desligado), **o
avanço se perde** — o trabalho reaparece no estado anterior e é reapresentado. O que **não** se perde é
o trabalho: ele nunca depende do dispositivo do ponto para existir. O que se faz quando isso acontece:
quem produz remarca, e o produto não infere "pronto" para tapar o buraco (`RN-COZ-004`). Requisito que
sai daqui para quem construir: o dispositivo de apresentação retém localmente o que recebeu e o que
registrou, e a reconciliação usa o instante do registro.

**O que o operador de salão vê.** Que aquele ponto está **inalcançável** — não uma mensagem de erro
técnico (`PN-17`) — desde quando, e quantos trabalhos aguardam apresentação nele (`PN-15`). Vê o estado
de cada trabalho rotulado como último estado conhecido. E continua conseguindo lançar, transferir,
repartir e fechar, porque nada disso passa por `COZ` (`RN-MSA-012`).

**Como reconcilia quando volta.** (1) Trabalho emitido durante o corte é apresentado **uma única vez**,
em ordem de lançamento, marcado com o atraso de apresentação. (2) Avanços registrados no ponto durante
o corte são aplicados pelo instante em que ocorreram, não pelo de chegada. (3) Fatos incompatíveis
registrados nos dois lados (o salão marcou entregue, o ponto encerrou como descartado) **não** são
resolvidos por relógio nem sobrescritos: os dois ficam registrados e o conflito é apresentado ao
responsável para decisão. (4) Nada é descartado por não ter sido apresentado.

**Decisão explícita sobre duplicar apresentação.** Se a apresentação saiu mas a confirmação se perdeu
(a via imprimiu e o registro não voltou), o produto **reapresenta** — e a segunda via nasce marcada como
reapresentação, para quem produz não fazer duas vezes. O trade-off é deliberado: via duplicada e
marcada é barata; trabalho nunca apresentado é trabalho que ninguém faz e cliente-final esperando. Isso
não contradiz `PN-02`: a idempotência protege o **fato** (um trabalho, um item, uma venda) — a
apresentação física é entrega best-effort com marcação, não fato de dinheiro.

**Se o ponto não volta no serviço inteiro.** O caminho é o do próprio produto, e o alternativo declarado
pelo cliente (impressão em outro ponto, leitura em outro dispositivo, voz e papel) é caminho **válido**,
não fracasso (`PN-18`). O que o produto garante é que, no fim do serviço, ninguém precisa adivinhar: o
que foi emitido, o que foi apresentado, o que foi produzido e o que ficou sem apresentação são
contáveis.

## 6. Contrato do módulo

**Expõe:** o que está por produzir em um ponto, com etapa, instante de emissão e atraso · o estado de
produção de um item de pedido (todas as partes, `RN-COZ-003`) · a fila e o acúmulo de um ponto
(quantos, mais antigo) · a disponibilidade do caminho de apresentação de cada ponto e o pendente de
apresentação · evento de emissão, de apresentação confirmada, de mudança de etapa, de "pronto", de
entrega e de encerramento sem produzir.

**Exige do núcleo:** item de pedido com quantidade e unidade declarada · o lançamento como fato
observável (não a venda) · operador autenticado com papel verificado no backend e trilha · continuidade
offline · estabelecimento e fuso do cliente · isolamento por cliente.

**Exige do cliente (configuração):** quais pontos de produção existem, o roteamento
(`RN-COZ-002`), a regra de ordem e prioridade da fila (`RN-COZ-006`), o caminho de apresentação de cada
ponto e o alternativo, e os papéis autorizados às operações da `RN-COZ-012`.

**Ativação:** isolado, só núcleo. Usa `PER` quando o ponto recebe impressão — sem `PER`, o ponto só
tem tela, e um cliente cujos pontos são todos de impressão precisa de `PER` para que `COZ` seja útil.
Isso é dependência de **capacidade declarada na ativação**, não `import`: `COZ` não deixa de funcionar
sem `PER`, deixa de ter caminho de apresentação impressa.

**Desligado:** o operador comunica a produção por fora — voz, papel, o grito de sempre. Pedido, consumo
e venda não mudam em nada; nenhuma tela, termo ou etapa cita ponto de produção, fila ou etapa de
produção (`PN-04`). Nada quebra: `COZ` não é condição para vender (`fronteira-do-nucleo.md` §3.4). O
cliente que revende embalado opera a vida inteira sem ele.

**Sensível:** a **via impressa fica em ambiente aberto** — bancada, chão, lixo comum da área de
produção — e por isso não carrega dado de pessoa, endereço, contato, valor cobrado nem qualquer dado de
pagamento; leva o mínimo para produzir e para saber para onde vai. A **instrução de preparo** pode
carregar informação sobre condição de saúde do cliente-final (restrição, alergia): é o dado mais
sensível que este módulo toca, entra só quando necessário ao preparo, não vira histórico e não é
cruzada entre pedidos (`[[LACUNA-COZ-2]]`). Etapas por autor são dado sobre desempenho de pessoa
identificada: lidas por papel autorizado, nunca expostas como ranking na operação. Proteção e retenção
são de `seguranca` e do humano.

**Registra** (acrescentado em 2026-09-12, `CLAUDE.md` §7.10): a emissão de cada trabalho, com ponto,
etapa e instante · a apresentação confirmada, e o **pendente de apresentação** quando o caminho não
estava disponível · cada mudança de etapa, com autor · "pronto" e entrega · o **encerramento sem
produzir**, com autor e motivo, inclusive quando o pedido morreu sem virar venda — o trabalho já
emitido não é apagado (`RN-COZ-001`, infeliz) · o trabalho que foi ao ponto padrão por falta de
roteamento, **marcado como sem roteamento** (`RN-COZ-002`, infeliz) · e a disponibilidade do caminho
de apresentação de cada ponto, com instante.

**Não registra**, e cada um com o motivo:

- **Dado de pessoa, endereço, contato, valor cobrado e qualquer dado de pagamento.** A via fica em
  ambiente aberto — bancada, chão, lixo da área de produção — e o que não viaja nela também não vira
  fato deste módulo (§6, Sensível).
- **A instrução de preparo como histórico.** Ela pode carregar condição de saúde do cliente-final:
  entra só quando necessária ao preparo, não vira série e não é cruzada entre pedidos
  (`[[LACUNA-COZ-2]]`).
- **Duração de preparo como campo.** Os marcos já estão registrados e a duração deriva deles
  (`RN-NUC-045`).
- **Agregado de desempenho por pessoa.** As etapas têm autor porque a trilha exige; compor ranking a
  partir disso é decisão do humano (`RN-REL-008`), nunca consequência do registro.
- **A pessoa, quando o ponto opera em dispositivo compartilhado.** A granularidade do autor ali é a
  **sessão do ponto**, e isso é dívida declarada em §5, não descoberta depois.
- **O insumo perdido** no encerramento sem produzir: quantificá-lo só existe com `EST` ligado
  (`RN-COZ-001`, infeliz), e o módulo não estima o que não mede.

## 7. Lacunas e pendências

- `[[LACUNA-COZ-1: a via de produção (impressão dirigida ao ponto) tem qualquer exigência ou vedação de forma para não ser confundida com documento fiscal ou comprovante? — sem fonte em 2026-08-22]]`
- `[[LACUNA-COZ-2: instrução de preparo que revela condição de saúde do cliente-final (alergia, restrição alimentar) tem regime próprio de tratamento, minimização e retenção? — sem fonte em 2026-08-22]]`

**Pendente com o humano, não com fonte:** se os pontos de produção dos clientes-alvo têm tela,
impressora ou os dois (já perguntado em `verticais/restaurante.md` §4) — a resposta decide se `PER` é
condição prática de `COZ` neste ramo, e qual dos dois caminhos de apresentação é o principal.

**Resolvido nesta tarefa:** o dono de **instrução de preparo** é o **núcleo** — ela é a observação do
item de pedido (`glossario.md` §1.3, `fronteira-do-nucleo.md` §2.3), e `COZ` segue apenas
transportando e lendo. O que falta é a **regra numerada** `RN-NUC-nnn`, que pertence à spec do núcleo:
`[[LACUNA-GLO-002]]`.

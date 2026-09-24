# Catálogo de módulos — camada 2, os que exigem outro módulo

> **Irmão de `catalogo-de-modulos.md`, com o mesmo peso.** Partido em 2026-09-23 (T-0014, passo A.2b),
> quando a entrada de `ADI` levou aquele arquivo de 399 para 433 linhas. O eixo do corte é a **camada de
> ativação**, que já organizava o arquivo: lá ficam como ler (§1), o núcleo (§2), a camada 1 (§3), as
> verticais (§5) e os candidatos sem código (§6); aqui fica a §4 inteira, com o texto de antes, sem
> edição. O número da seção foi mantido para não invalidar citação. As regras de leitura e os campos de
> cada entrada são os de `catalogo-de-modulos.md` §1, e `fronteira` quer dizer `fronteira-do-nucleo.md`.

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

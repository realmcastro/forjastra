# Vertical `RES` — restaurante / alimentação servida

Receita do ramo, não implementação: módulos ligados, configuração padrão, vocabulário e a regra que é
**do ramo** (`fronteira-do-nucleo.md` §1, citado como `fronteira`). Vertical não tem código próprio; o
que não cabe em módulo é fronteira de módulo errada, nunca licença para código de ramo (`PN-09`). A
receita curta é `receitas-por-vertical.md` §2 — este arquivo aprofunda, não a substitui.

**Recorte do ramo.** A fonte do regime específico não fala "restaurante": fala de bares e restaurantes
(inclusive lanchonetes), pastelarias, **padarias**, casas de chá, de sucos, de doces e salgados,
cafeterias, sorveterias e similares, no fornecimento de alimentação e de bebidas não alcoólicas
**preparadas e manipuladas no próprio local**
([Res. CGIBS 6/2026, art. 396](https://www.cgibs.gov.br/upload/arquivos/202604/30084927-res-cgibs-n-6-30-abr-2026-regulamenta-o-ibs.pdf);
`docs/arquitetura/fiscal/2026-08-22-dossie-iva-ibs-cbs-2.md` §6). O eixo desta vertical é **preparar e
servir no local**, não "ter mesa" — e a padaria, um dos três negócios do teste da fronteira, entra
aqui pelo que ela prepara. Isso **não** promove nada ao núcleo: posto e loja de roupa seguem fora.
**Nada aqui é número fiscal calculável:** percentual só como texto de norma, com link e data; alíquota,
base e apuração são de `FIS` (`fronteira` §6); o que não tem fonte está na §7 como `LACUNA-RES-nnn`.

## 1. O que o ramo exige além do núcleo

Cada item passou pelo teste de trocar o sujeito da frase (`fronteira` §5): a frase continua verdade
com **outro** estabelecimento do ramo? Se sim, é do ramo. Se não, é de cliente.

| # | Exigência do ramo | Frase com o sujeito trocado | Por que o núcleo não tem |
|---|---|---|---|
| 1 | Consumo acumulado em aberto, vinculado a lugar/ficha, fechado num pagamento só | "Outro restaurante de salão também consome antes de pagar" — verdade | Posto cobra na bomba, padaria no balcão, loja de roupa no caixa: os três **não** quebram sem isso (`fronteira` §2.3) |
| 2 | O consumo é lançado **longe** do ponto de cobrança | "Outro restaurante de salão lança na mesa e cobra no caixa" — verdade | Os três lançam onde cobram; o núcleo só exige terminal identificado (`fronteira` §2.1) |
| 3 | O que foi pedido vira trabalho para um ponto de preparo, antes de existir venda | "Outra lanchonete também manda para a chapa antes de receber" — verdade | Loja de roupa não prepara nada; é módulo `COZ` (`fronteira` §2.3) |
| 4 | O item vendido tem **composição declarada** quanto a ter sido preparado no local | "Outra padaria também vende pão que ela fez e refrigerante que ela revendeu" — verdade | Posto e loja de roupa não têm o corte "preparado por mim × revendido"; e a consequência é fiscal (item 5), não de catálogo |
| 5 | O documento **segrega** o que está no regime específico do que está no geral | "Outro bar também vende cerveja (fora) junto com o prato (dentro)" — verdade | Exigência da norma do ramo, não de todo negócio que vende — ver §1.1 |
| 6 | Encargo de serviço/gorjeta tem **tratamento** próprio no documento | "Outro restaurante que cobra serviço tem o mesmo tratamento" — verdade **do tratamento** | Padaria e loja de roupa não cobram (`fronteira` §2.3). Atenção: **se cobra e quanto é de cliente** (§5.3) |
| 7 | A obrigação documental é cumprida em instante distinto por modo de atendimento | "Outro restaurante emite no fechamento da mesa, não no lançamento" — verdade | `fronteira` §6 já classifica o **momento** como decisão de vertical |
| 8 | Dois regimes convivem no mesmo estabelecimento, no mesmo dia | "Outro restaurante também vende bebida alcoólica e prato preparado" — verdade | Coexistência de regime é arquitetura de `FIS`; **que ela é rotina aqui** é fato do ramo |
| 9 | Pico concentrado: a maior parte dos fechamentos acontece em poucas janelas do dia | "Outro restaurante também fecha quase tudo no almoço e no jantar" — verdade | O núcleo exige operar com rede ruim; a **forma** do pico é do ramo e vira orçamento (§4) |

### 1.1 A segregação no documento é exigência do ramo, com consequência financeira

O documento fiscal **tem que segregar** os valores do regime específico dos do regime geral, e **na
falta de segregação o valor total da operação vai para o regime geral**
([Res. CGIBS 6/2026, art. 398 e par. único](https://www.cgibs.gov.br/upload/arquivos/202604/30084927-res-cgibs-n-6-30-abr-2026-regulamenta-o-ibs.pdf);
dossiê §6). As alíquotas do regime específico ficam, no texto da norma, **reduzidas em 40%**
([Decreto 12.955/2026, art. 400](https://www.in.gov.br/en/web/dou/-/decreto-n-12.955-de-29-de-abril-de-2026-702415229);
dossiê §6 — as duas fontes conferem, e a própria fonte marca "MUDA? provável").

Consequência de produto, e por isso não é detalhe do fiscal: **a classificação do item no catálogo e a
segregação linha por linha no pedido são exigência do ramo**. Errar não gera rejeição visível no caixa
— gera perda de redução que só aparece na apuração. Ficam **fora** do regime específico: bebida
alcoólica ainda que preparada no estabelecimento; produto e bebida não alcoólica adquiridos de
terceiro e não preparados no local; bebida não alcoólica **industrializada**, mesmo manipulada no
local; e alimentação para pessoa jurídica sob contrato
([arts. 396 par. único e 397](https://www.cgibs.gov.br/upload/arquivos/202604/30084927-res-cgibs-n-6-30-abr-2026-regulamenta-o-ibs.pdf)).
É também **vedada a apropriação de crédito** pelo adquirente nesse regime
([art. 401](https://www.cgibs.gov.br/upload/arquivos/202604/30084927-res-cgibs-n-6-30-abr-2026-regulamenta-o-ibs.pdf)) —
muda a conversa com cliente-final pessoa jurídica, não o fluxo do caixa. Duas coisas que **não**
decorrem disso: (a) segregar exige **classificação** do item, **não** ficha técnica — exigir `FTC` para
emitir obrigaria todo cliente do ramo a cadastrar insumo antes de vender; (b) qual item é de qual
classificação é **dado tributário do catálogo do cliente** (`fronteira` §6), não valor da vertical.

### 1.2 Gorjeta e intermediação: o tratamento é do ramo, o "se cobra" é de cliente

Ficam **excluídos da base**: a **gorjeta**, se repassada integralmente ao empregado e se não exceder
**15%** do valor total do fornecimento de alimentação e bebidas; e os valores **não repassados** ao
estabelecimento pelo serviço de entrega e intermediação de pedidos por plataforma digital. Nos dois
casos a exclusão depende de **estar segregado no documento** — sem segregação, a base é o valor total
([Res. CGIBS 6/2026, art. 399, §§ 1º a 4º](https://www.cgibs.gov.br/upload/arquivos/202604/30084927-res-cgibs-n-6-30-abr-2026-regulamenta-o-ibs.pdf);
dossiê §6). Portanto: **carregar a gorjeta em linha própria e segregada é do ramo**; **cobrar taxa de
serviço, e quanto, é de cliente** (`fronteira` §5 — "restaurante cobra 10% de serviço" não sobrevive à troca de
sujeito). Se a taxa compulsória na conta é alcançada pela palavra "gorjeta" da norma:
`LACUNA-RES-004`. Se o repasse integral precisa de prova no produto: `LACUNA-RES-005`.

### 1.3 Regime tributário do cliente: os dois, desde o dia 0

O optante pelo Simples ou pelo MEI fica sujeito às regras desses regimes, quem não opta cai no regime
regular, e o optante pelo Simples **pode** optar por apurar IBS/CBS pelo regular mantendo o Simples
para os demais tributos
([art. 41, §§ 1º a 4º](https://www.cgibs.gov.br/upload/arquivos/202604/30084927-res-cgibs-n-6-30-abr-2026-regulamenta-o-ibs.pdf);
dossiê §7). Para a vertical, uma consequência só: **nenhum fluxo do ramo assume regime**. Regime é dado
do estabelecimento, com vigência, e mudá-lo não reescreve o passado (`PN-08`).

## 2. Fluxo operacional por modo de atendimento

O **modo de atendimento** é o eixo que organiza o ramo, e **não** é o canal de entrada do pedido: um
pedido nascido no dispositivo do cliente-final pode terminar em salão, retirada ou entrega. O modo
determina quem toca no quê e qual é a obrigação documental. Um cliente do ramo opera **um ou vários**
modos, frequentemente todos ao mesmo tempo, no mesmo estabelecimento e no mesmo pico.

### 2.1 Consumo no salão

- **Nasce** na mesa: o atendente lança (`MSA`, em terminal na mão ou fixo, se o cliente do ramo
  trabalha com anotação em papel) ou o cliente-final lança (`PCF` com destino `MSA`). É **mutável** todo
  o consumo: nova rodada, item cancelado por engano, transferência, junção de mesas.
- **Dinheiro** entra no fim, depois do consumo — define o modo e é a razão de `MSA` existir.
- **Obrigação** cumprida no **fechamento** do consumo, não no lançamento (`RN-RES-004`); com divisão
  de conta em documentos separados, uma vez por parte (`RN-RES-006`).
- **Quem toca:** atendente lança e entrega; produção prepara e sinaliza pronto; operador de caixa
  cobra e conclui. Em estabelecimento pequeno é **a mesma pessoa** em dois papéis — o produto separa
  por **papel**, nunca por pessoa, e autoriza no backend (`PN-11`).
- **Caro aqui:** o consumo atravessa fechamento de sessão e virada de dia (`RN-RES-005`); cancelar
  item já lançado é operação sensível com trilha, porque é o caminho natural de furto no ramo.

### 2.2 Balcão / atendimento rápido

- **Nasce** no ponto de cobrança, com o operador — ou em terminal de autoatendimento (`PCF`, que é
  configuração de canal, não módulo novo).
- **Dinheiro** entra antes da entrega, no ato, e não existe consumo em aberto: é o modo que **prova**
  que `MSA` é plugável (`RN-RES-008`). **Obrigação** cumprida na conclusão da venda, que é imediata.
- **Quem toca:** operador cobra e conclui; produção prepara depois de a venda existir; chamada por
  senha ou nome só existe se o cliente ligou `CMP`.
- **Caro aqui:** é o caminho crítico do caixa com fila na frente. Nada — periférico (`PN-18`),
  autorização de documento (§4) ou módulo desligado — pode bloquear a conclusão.

### 2.3 Retirada no estabelecimento

- **Nasce** em canal remoto (`PCF`, telefone anotado pelo operador, plataforma via `INT`) ou no balcão
  com hora marcada.
- **Dinheiro** entra antecipado no canal (`PGO`) **ou** na retirada; as duas variantes são legítimas e
  a escolha é **de cliente**. O pedido não muda de natureza por causa disso.
- **Obrigação** cumprida na conclusão da venda — que é o **pagamento**, não a entrega física. Qual
  documento e qual indicador de presença cabem em pedido remoto retirado presencialmente:
  `LACUNA-RES-002` — é por isso que `RN-RES-009` é **provisória**.
- **Quem toca:** operador ou canal recebe; produção prepara; quem entrega no balcão confere contra o
  pedido. Sem `CMP` não existe estado nem senha — o pedido é gritado, como hoje.

### 2.4 Entrega em endereço

- **Nasce** em canal próprio (`PCF`), plataforma de terceiro (`INT`) ou telefone.
- **Dinheiro** entra no canal (`PGO`), na plataforma — e aí há valor **não repassado**, excluído da
  base **se segregado** (§1.2) — ou **na porta**, em dinheiro ou cartão. Pagamento na porta é o pior
  caso de rede do produto inteiro.
- **Obrigação:** a NFC-e aceita indicador presencial ou **entrega a domicílio**; operação não
  presencial pela internet é rejeitada e exige NF-e modelo 55; e entrega a domicílio é
  **parametrizável por UF**, que pode recusá-la
  ([MOC 7.0 Anexo I, campo B25b](https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-anexo-i-leiaute-e-rv.pdf);
  `docs/arquitetura/fiscal/2026-08-22-dossie-emissao-propria.md` §1.3). Se o Ceará admite ou recusa:
  `LACUNA-RES-003`.
- **Quem toca:** operador aceita; produção prepara; entregador leva e às vezes **cobra**; a
  plataforma, quando existe, fica entre o cliente-final e nós.
- **Caro aqui:** o dispositivo do entregador está na rua, sem rede confiável, e registra recebimento
  de dinheiro. É `PN-01` e `PN-02` no limite.

### 2.5 O que os quatro modos têm em comum

1. O **modo** é declarado no pedido, não inferido do canal (`RN-RES-009`) — porque documento e
   indicador de presença dependem dele (§2.4).
2. O item preparado no local não muda de classificação por causa do modo — a fonte recorta pela
   **preparação** no local, e sua lista de exclusões não menciona onde se consome
   ([art. 396 e par. único](https://www.cgibs.gov.br/upload/arquivos/202604/30084927-res-cgibs-n-6-30-abr-2026-regulamenta-o-ibs.pdf)).
   Se consumo fora do local altera o regime: `LACUNA-RES-006`. **Não afirmo que não altera.**
3. Um estabelecimento roda os quatro modos no mesmo pico, com o mesmo catálogo e a mesma produção; a
   fila de produção é recurso disputado entre eles — quem prioriza é regra de `COZ`.

## 3. Jargão do ramo mapeado ao vocabulário

Coluna "Conceito" cita `glossario.md` §3.1 (jargão do ramo), §6 (léxico de módulo) ou §1 (núcleo). As
faltas que esta seção declarava como `sem termo` foram **cunhadas no glossário**, não aqui.

| O operador fala | Conceito | Onde vive |
|---|---|---|
| mesa, número | Mesa `table` | `MSA` |
| comanda, ficha, "a conta da 12" | Comanda `tab` (nunca "conta" sozinho, §5 do glossário) | `MSA` |
| praça, setor, ala | Praça / área `service_area` | `MSA` |
| garçom, garçonete, "meu setor" | Atendente de salão `attendant` (papel) | núcleo (papel) + `MSA` |
| cozinha, chapa, bar, confeitaria (como destino) | Ponto de produção `production_point` (§6) | `COZ` |
| "saiu pedido"; "saiu", "pronto" | Trabalho a produzir `production_work`; etapa de produção `production_stage` (§6) | `COZ` |
| monitor da cozinha; via impressa | Painel de produção `production_display`; via de produção `production_ticket` (§6) | `COZ` + `PER` |
| quem opera na produção | Operador de produção, papel `production_operator` (§6) | núcleo (papel) + `COZ` |
| "sem cebola", "bem passado", "sem gelo" | Observação do item de pedido `order_item_note` (§1.3) — lida por `COZ`, criada no núcleo | núcleo + `COZ` |
| "os 10%", taxa, serviço; couvert | Taxa de serviço `service_charge`; couvert `cover_charge` — **se cobra e quanto é de cliente** | `ECG` |
| gorjeta, caixinha | Gorjeta `tip` (§6) — repassada ao empregado, distinta de taxa de serviço `service_charge`, que é receita do estabelecimento | `ECG` + `FIS` |
| rachar, dividir, "por pessoa" | Divisão de conta `bill_split` | `MSA` |
| meia porção, 300 g; rodízio, self-service | Quantidade `quantity` fracionária (balança é `PER`); item por pessoa — **núcleo** | núcleo |
| happy hour, preço do almoço, menu do dia | Lista de preço `price_list` por contexto e vigência — **núcleo** | núcleo |
| cortesia, "na faixa"; quebra, perda | Desconto `discount` autorizado por papel — **núcleo**; movimento de estoque | núcleo; `EST` |
| fiado, conta do cliente, convênio | Conta a prazo `credit_account` — módulo cross-vertical | `PRZ` |
| delivery, "o aplicativo" | Entrega `delivery` + intermediação por plataforma | `ENT` + `INT` |
| valor retido pela plataforma | Valor retido por intermediação `intermediary_withheld_amount` (§6) — o "não repassado" da norma (§1.2) | `INT` + `FIS` |
| viagem, para levar, marmita | Retirada `pickup` | `CMP` |
| reserva; ficha técnica | Reserva; ficha técnica `recipe` | `RSV`; `FTC` |

Proibido mesmo aqui: `waiter`/`server` (colide com servidor) — é `attendant` (`glossario.md` §5).

## 4. Expectativa de hardware e de rede — isto é requisito

O que o produto **não pode assumir**, com a consequência. Nenhum número operacional (terminais, banda,
latência) é afirmado: o que eu não medi virou pergunta ao fim desta seção.

| Requisito do ramo | Por que | Consequência para o produto |
|---|---|---|
| O dispositivo que **lança** não é o que **cobra** | Modo salão (§2.1) | Lançamento e cobrança são fluxos independentes; nenhum depende de o outro estar disponível no mesmo instante |
| O ponto de produção é o pior ambiente físico do estabelecimento (calor, gordura, umidade, ruído, mão ocupada) | Rotina do ramo | O ponto de produção é operável com alvo grande e com a mão ocupada, **sem depender de teclado nem de ponteiro**; e precisa funcionar por **impressão** quando não há tela (`PER`) |
| A rede local pode não cobrir bem a área de produção (parede, metal, forno) | Rotina do ramo | O lançamento **não se perde** se o ponto de produção estiver inalcançável; a comunicação com a produção degrada, não bloqueia |
| Link de internet **único**, sem redundância presumida, e o pico de fechamento coincide com o pico de uso do link | §1, item 9 | Fechar venda não pode bloquear esperando rede (`PN-01`) |
| A autorização do documento **não é instantânea**: o nível de serviço acordado pelos estados é inferior a 30 s em 85% do tempo ([MOC 7.0 Anexo IV, itens 2 e 4](https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-anexo-iv-manual-contingencia-nfc-e.pdf)) | Fonte, não estimativa | O fluxo de fechamento não espera autorização para concluir a venda; contingência é caminho normal (`RN-RES-010`) |
| Contingência **imprime mais**, não menos: Detalhe da Venda + segunda via "Via do Estabelecimento" enquanto a nota não é autorizada, salvo guarda eletrônica com termo prévio ([MOC 7.0 Anexo IV, item 4](https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-anexo-iv-manual-contingencia-nfc-e.pdf)) | Fonte | Papel e tempo de impressora aumentam justamente no pico com rede ruim; falta de papel não impede a venda (`PN-18`), mas gera pendência declarada |
| **Onde o documento é assinado** limita onde a contingência funciona: certificado A1 é arquivo, A3 exige mídia criptográfica conectada a cada uso (dossiê emissão própria §2.2) | Fonte | O produto declara o ponto de assinatura; não presume que qualquer terminal ou o dispositivo do entregador assina |
| No Ceará (UF **base**, não universal) o CF-e por MFE está vedado desde 2026-01-01, e o MFE era a alternativa de contingência ao lado da NFC-e off-line ([Decreto CE 36.417/2025](https://sefazlegis.sefaz.ce.gov.br/api/openFile?id=8ede79ea-72c0-44bd-aeee-9a7d0d5b9428)) | Fonte | Não existe caminho de contingência em hardware fiscal para esses clientes: a contingência é a do próprio produto |
| Queda de energia derruba terminal, rede local e link juntos; e o dispositivo do atendente pode ser dele, não do estabelecimento | Rotina; prática a confirmar | Retomada não perde consumo em aberto nem venda pendente de transmissão (`PN-01`, `PN-02`); dispositivo pessoal muda a superfície de segurança e o gate de `seguranca` |

**Perguntas ao humano (números que eu não tenho e não invento):** quantos terminais e dispositivos por
estabelecimento, e quais; existe servidor local ou cada terminal fala direto com a nuvem; tecnologia e
qualidade real do link, com ou sem redundância; existe energia ininterrupta; tipo de certificado dos
clientes-alvo (A1, A3 ou nuvem); a produção tem tela, impressora ou os dois; o dispositivo do
atendente é do estabelecimento ou dele.

## 5. Módulos que esta vertical liga

Códigos de `glossario.md` §4.3; cada entrada é `catalogo-de-modulos.md`. "Liga" é a receita **padrão**:
o cliente do ramo liga ou desliga conforme o formato dele.

### 5.1 Núcleo da receita — o ramo sem estes não opera no modo declarado

| Módulo | Por que o ramo liga | Configuração padrão da receita | Decisão de cliente dentro dele |
|---|---|---|---|
| `MSA` | Modo salão (§2.1) não existe sem consumo em aberto | Consumo vinculado a lugar físico; transferência e divisão de conta habilitadas | Quantidade de lugares e praças; quem pode transferir; quem pode cancelar item lançado |
| `COZ` | O que é pedido vira trabalho antes de existir venda (§1, item 3) | Roteamento por ponto de produção; etapa de preparo visível ao salão | Quais pontos existem; tela, impressão ou os dois; ordem da fila e prioridade entre modos |
| `FIS` **+ `EMI`** | Segregação (§1.1) e gorjeta (§1.2) só existem no documento — e `EMI` é quem emite; ligar só `FIS` é o cliente que **não** emite pela Forja (`receitas-por-vertical.md` §1) | Classificação de item obrigatória no cadastro; encargo em linha própria; emissão própria com contingência (`RN-RES-010`) | Regime e identidade fiscal; dado tributário do item; guarda eletrônica ou segunda via impressa; onde a credencial fica (`RN-EMI-003`) |
| `PER` | Contingência imprime (§4) e produção sem tela imprime | Impressora de comprovante; impressão dirigida ao ponto de produção quando não há tela | Modelo de equipamento; onde cada impressora fica |

### 5.2 Conforme o formato de operação

| Módulo | Liga quando | Observação |
|---|---|---|
| `CMP` | há modo que **não** se encerra no ato: retirada, entrega, balcão com espera | **Divergência resolvida a favor desta linha** (`receitas-por-vertical.md` §5): num restaurante só de salão, `MSA` + `COZ` cobrem o acompanhamento e `CMP` desligado não deixa nada faltando, então `CMP` saiu da base da receita. `CMP` continua existindo como dono do estado de cumprimento |
| `PCF` + `PUB` | o cliente-final monta o próprio pedido (mesa, autoatendimento, canal remoto) | `PCF` **exige** destino declarado (`MSA` ou `CMP`) e `PUB`; sem isso a ativação é recusada, não degradada |
| `ENT`; `INT` | há entrega em endereço; há plataforma de terceiro no meio | `ENT` exige `CMP` e é **módulo cross-vertical**, não do ramo; `INT` é onde aparece o valor **não repassado** (§1.2) |
| `ECG` | o cliente cobra taxa de serviço, couvert ou taxa de entrega | O **tratamento** é do ramo; **cobrar** é do cliente (§5.3) |
| `EST`; `FTC` | o cliente controla o que tem; quer custo e consumo de insumo | Ramo com perecível costuma querer `EST`; nenhum dos dois é condição de operar, e `FTC` **não** é condição para segregar (§1.1) |
| `RSV` | o cliente trabalha com reserva | Com `MSA`, a reserva aponta para um lugar |
| `ATI` | atendimento em linguagem natural | Sem `PCF`, atende **operador**. `PN-16` vale nos dois modos: automação **propõe** |

### 5.3 Parecia do ramo e não é

| O que parece regra do ramo | O que é de verdade | Prova |
|---|---|---|
| "Restaurante cobra 10% de serviço"; "cobra couvert" | **Cliente** — existência e valor | Troque o sujeito: outro restaurante não cobra, e os dois estão certos (`fronteira` §5) |
| "Garçom recebe comissão" | **Módulo** `COM`, cross-vertical | Loja de roupa comissiona igual (`glossario.md` §3.4) |
| "Restaurante tem delivery" | **Módulo** `ENT`, cross-vertical | Farmácia entrega igual |
| "Restaurante dá senha e chama" | **Módulo** `CMP`, e só nos formatos com espera | Um restaurante de salão não usa |
| "Restaurante tem cartão fidelidade" | **Módulo** `FID` + `CLF` — política de cliente | Não é de ramo nenhum |
| "Restaurante anota o cliente para fiado" | **Módulo** `PRZ`, cross-vertical | Frota e convênio são a mesma mecânica |
| "Restaurante tem preço de almoço e de jantar" | **Núcleo** — lista de preço por contexto e vigência | `fronteira` §2.2 |
| "Restaurante vende meia porção / por peso" | **Núcleo** — quantidade fracionária; balança é `PER` | `fronteira` §2.2; não existe módulo de balança |
| "Restaurante divide em dinheiro + cartão" | **Núcleo** — vários pagamentos por venda | `fronteira` §2.4 |
| "Restaurante só emite documento se o cliente pedir" | **Não escrevi como regra**: é preferência de cliente (`fronteira` §6) e não achei fonte que condicione a obrigação ao pedido — ao contrário, problema técnico não exime de emitir (dossiê emissão própria §10.3) | — |

## 6. Regras do ramo

Numeração `RN-RES-nnn`, imutável (`glossario.md` §4.2). Campos: **Enunciado** (testável) · **Motivo** ·
**Aceite** (caso concreto) · **Infeliz** (caminho infeliz). Regra **PROVISÓRIA** depende de lacuna da
§7 e não vira código antes de ela fechar.

### RN-RES-001 — Item vendável do ramo nasce com classificação de regime declarada
**Enunciado:** neste ramo, cadastrar item sem a classificação que distingue preparado no local,
revendido de terceiro, industrializado e bebida alcoólica é **recusado no cadastro**.
**Motivo:** sem segregação, o valor total da operação cai no regime geral
([art. 398](https://www.cgibs.gov.br/upload/arquivos/202604/30084927-res-cgibs-n-6-30-abr-2026-regulamenta-o-ibs.pdf))
e a redução de 40% se perde
([art. 400](https://www.in.gov.br/en/web/dou/-/decreto-n-12.955-de-29-de-abril-de-2026-702415229)).
Recusar no cadastro é barato; descobrir na apuração, não.
**Aceite:** item sem classificação → recusado, com mensagem de operação e ação possível (`PN-17`);
com classificação → aceito, e a venda seguinte segrega.
**Infeliz:** item legado sem classificação (migração, importação) **não bloqueia a venda**
(`fronteira` §3.4, `PN-01`): a linha é marcada regime não determinado, o desvio entra na trilha, fica
visível ao responsável, e o efeito financeiro é declarado — nunca silencioso.

### RN-RES-002 — A segregação é decidida no backend, e o caixa não a altera
**Enunciado:** a segregação de cada linha vem da classificação do item; nenhuma tela de operação
oferece trocá-la, e mudar classificação é cadastro com papel autorizado e trilha.
**Motivo:** `PN-13` e `PN-11`. O erro é financeiro e diferido — deixar a decisão na fila do caixa
transfere risco fiscal para quem tem 30 segundos.
**Aceite:** venda com prato preparado no local + cerveja + refrigerante em lata industrializado → as
três linhas saem pelo tratamento da classificação de cada item, e nenhuma tela do fluxo de venda
permite alterar isso.
**Infeliz:** classificação ausente → `RN-RES-001`. Classificação **errada** percebida depois: corrige
no cadastro, com vigência, e **não** recalcula fato passado (`PN-08`).

### RN-RES-003 — Encargo e gorjeta vão em linha própria segregada, nunca embutidos no item
**Enunciado:** taxa de serviço, couvert, gorjeta, taxa de entrega e valor não repassado por
plataforma aparecem em linha própria identificada, nunca somados ao preço do item.
**Motivo:** a exclusão da base depende de estarem **segregados**; sem segregação, a base é o valor
total
([art. 399, §§ 1º a 4º](https://www.cgibs.gov.br/upload/arquivos/202604/30084927-res-cgibs-n-6-30-abr-2026-regulamenta-o-ibs.pdf)).
**Aceite:** pedido com item + taxa de serviço + valor retido por plataforma → três linhas
identificadas separadamente, e o total confere com o cobrado.
**Infeliz:** cliente que **embute** o encargo no preço do prato — o produto não impede (o preço é
dele), registra que naquele arranjo não há valor segregado a excluir, e avisa **na configuração**,
não no caixa.

### RN-RES-004 — No salão, o fato gerador é o fechamento do consumo, não o lançamento
**Enunciado:** consumo em aberto acumula lançamentos mutáveis; venda e obrigação documental nascem no
fechamento.
**Motivo:** pedido é mutável, venda é imutável (`glossario.md` §1.3). Emitir por lançamento criaria N
documentos imutáveis sobre intenção que ainda muda, e cada correção teria de caber na janela de
cancelamento da NFC-e, **não superior a 30 minutos** da autorização, redutível por UF
([Ajuste SINIEF 19/16, cl. 15ª](https://www.confaz.fazenda.gov.br/legislacao/ajustes/2016/AJ_019_16));
fora do prazo o cancelamento é **rejeitado**
([MOC 7.0 Visão Geral, 5.9.4](https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-visao-geral.pdf)).
**Aceite:** abrir mesa, lançar 5 itens em 40 minutos, cancelar 1 lançado por engano com papel
autorizado, fechar → **um** documento, com 4 itens, e nenhum documento cancelado.
**Infeliz:** item consumido e contestado depois do fechamento → não é edição da venda (`PN-07`), é
fato novo sujeito ao prazo acima; o que fazer depois do prazo é `LACUNA-RES-007`.

### RN-RES-005 — Consumo em aberto atravessa sessão de caixa e virada de dia
**Enunciado:** fechar a sessão de caixa ou virar o dia no fuso do cliente **não** fecha consumo em
aberto, e o sistema nunca conclui venda por conveniência de fechamento.
**Motivo:** mesa que abre 23:50 e fecha 00:30 é rotina do ramo, e turno é eixo independente da sessão
(`glossario.md` §1.5). Fechar sozinho criaria venda que não aconteceu (`PN-07`).
**Aceite:** abrir consumo às 23:50 no fuso do cliente e fechar a sessão às 00:10 com o consumo aberto
→ a sessão fecha, reporta o consumo aberto, o consumo continua recebendo lançamento, e a venda
pertence ao dia e ao turno da **conclusão**.
**Infeliz:** consumo esquecido aberto → o produto **sinaliza** ao responsável e exige encerramento
explícito, com papel autorizado e motivo: venda ou cancelamento. Nunca descarte silencioso, nunca
fechamento automático.

### RN-RES-006 — Divisão de conta fecha por igualdade, item por item
**Enunciado:** um consumo pode virar uma venda com vários pagamentos **ou** várias vendas; em qualquer
arranjo a soma das partes é igual ao consumo, item por item, e cada venda carrega a própria segregação
(`RN-RES-002`).
**Motivo:** dividir é rotina do ramo e é onde o dinheiro escapa (soma que não fecha, item em duas partes).
**Aceite:** consumo de 3 itens dividido em 2 vendas, uma com metade de um item (quantidade fracionária
do núcleo) → a soma das duas vendas reproduz exatamente os 3 itens.
**Infeliz:** divisão que sobra ou falta item → fechamento recusado **antes** de concluir qualquer
venda. Nenhuma venda parcial é concluída; nada de "resolve na próxima".

### RN-RES-007 — A produção começa sem depender de venda
**Enunciado:** o lançamento roteia o item ao ponto de produção na hora; venda concluída não é condição
para produzir, e concluir a venda depois **não** reenvia nada à produção.
**Motivo:** no salão a comida é feita antes de ser paga (§2.1); amarrar produção à venda faria a
cozinha esperar o pagamento.
**Aceite:** lançar item numa mesa → o ponto de produção recebe sem existir venda; fechar a mesa depois
→ nenhum item reaparece na produção.
**Infeliz:** ponto de produção inalcançável no instante do lançamento → o lançamento **não se perde**,
fica pendente com estado visível, e a produção é avisada pelo caminho degradado que `COZ` declarar
(voz e papel são caminho válido: `PN-18`).

### RN-RES-008 — Nenhum modo exige módulo que o cliente não ligou
**Enunciado:** cada modo (§2) opera completo com o conjunto mínimo da §5, e o restaurante que só opera
balcão fecha venda sem `MSA`.
**Motivo:** invariante de plugabilidade; prova que consumo em aberto é módulo, não núcleo.
**Aceite:** cliente do ramo com `MSA` desligado → o fluxo de balcão abre, lança, cobra e conclui, e
nenhuma tela cita mesa ou comanda (`PN-04`).
**Infeliz:** `PCF` ligado com destino `MSA` e `MSA` desligado → **ativação recusada** com o motivo, não
tela quebrada no meio do serviço (`catalogo-de-modulos.md`, entrada `PCF`).

### RN-RES-009 (PROVISÓRIA — depende de `LACUNA-RES-002` e `LACUNA-RES-003`) — O modo é declarado, nunca inferido
**Enunciado:** todo pedido nasce com o modo declarado (salão, balcão, retirada, entrega); o canal de
entrada **não** determina o modo, e nenhum passo posterior o adivinha.
**Motivo:** o documento aplicável depende disso — a NFC-e aceita presencial ou entrega a domicílio,
operação não presencial pela internet é rejeitada e exige NF-e modelo 55, e entrega a domicílio é
parametrizável por UF
([MOC 7.0 Anexo I, B25b](https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-anexo-i-leiaute-e-rv.pdf)).
**Aceite:** dois pedidos do mesmo canal remoto, um para retirada e outro para entrega → cada um chega
ao `FIS` com o modo declarado, e o `FIS` decide o documento sem consultar o canal.
**Infeliz:** pedido sem modo declarado → recusado **na entrada** do canal; nunca aceito para descobrir
no fechamento que não há documento aplicável.

### RN-RES-010 — Contingência é operação normal do pico, não exceção
**Enunciado:** o produto entra e sai de contingência sem decisão documento por documento e sem parar
a fila; a venda conclui antes de existir autorização.
**Motivo:** a autorização não é instantânea — o nível de serviço acordado é inferior a 30 s em 85% do
tempo — e a contingência off-line da NFC-e prevê gerar, assinar e imprimir **sem autorização prévia**,
transmitindo até o fim do primeiro dia útil seguinte
([MOC 7.0 Anexo IV, itens 2 e 4](https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-anexo-iv-manual-contingencia-nfc-e.pdf));
entrar em contingência é decisão do contribuinte, e permiti-la é decisão da UF
([mesmo anexo, item 2](https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-anexo-iv-manual-contingencia-nfc-e.pdf)).
No Ceará o MFE deixou de ser alternativa em 2026-01-01
([Decreto CE 36.417/2025](https://sefazlegis.sefaz.ce.gov.br/api/openFile?id=8ede79ea-72c0-44bd-aeee-9a7d0d5b9428)).
**Aceite:** cortar o link durante o fechamento de três mesas seguidas → as três vendas concluem, os
documentos saem em contingência, e ao voltar o link cada documento é transmitido **uma** vez (`PN-02`).
**Infeliz:** impressora sem papel em contingência → a venda ainda conclui (`PN-18`) e a pendência de
impressão obrigatória fica declarada ao responsável, porque a segunda via exigida enquanto a nota não
é autorizada só é dispensável por guarda eletrônica com termo prévio, decisão do cliente
([mesmo anexo, item 4](https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-anexo-iv-manual-contingencia-nfc-e.pdf)).

### RN-RES-011 — Dois regimes convivem no mesmo estabelecimento e no mesmo dia
**Enunciado:** nenhum fluxo do ramo assume regime único: no mesmo dia e estabelecimento há operação no
regime específico e no geral, e o cliente pode ser do Simples ou do regular.
**Motivo:** bebida alcoólica, produto de terceiro não preparado no local e alimentação a pessoa
jurídica sob contrato ficam **fora** do regime específico
([arts. 396 par. único e 397](https://www.cgibs.gov.br/upload/arquivos/202604/30084927-res-cgibs-n-6-30-abr-2026-regulamenta-o-ibs.pdf));
e o optante pelo Simples pode apurar IBS/CBS pelo regime regular
([art. 41, §§ 3º e 4º](https://www.cgibs.gov.br/upload/arquivos/202604/30084927-res-cgibs-n-6-30-abr-2026-regulamenta-o-ibs.pdf)).
**Aceite:** no mesmo dia, uma venda de balcão com prato + cerveja e um fornecimento a pessoa jurídica
sob contrato → os tratamentos coexistem, nenhum é deduzido de um "tipo de cliente (tenant)" único.
**Infeliz:** o cliente muda de regime → a mudança tem vigência, vale para fato novo, e nada do
histórico é recalculado (`PN-08`).

## 7. Lacunas — o que não afirmo

Cada uma é pergunta aberta em 2026-08-22, contra os dossiês de `docs/arquitetura/fiscal/`. Regra que
depende de lacuna está marcada PROVISÓRIA na §6.

- `[[LACUNA-RES-001: "na falta de segregação, o valor total da operação vai para o regime geral" alcança o documento inteiro quando **uma** linha não está classificada, ou só a linha? — sem fonte em 2026-08-22]]`
- `[[LACUNA-RES-002: qual documento e qual indicador de presença se aplicam a pedido feito por canal remoto e **retirado presencialmente** no estabelecimento? — sem fonte em 2026-08-22]]`
- `[[LACUNA-RES-003: o Ceará admite ou recusa entrega a domicílio na NFC-e (parâmetro de UF, erro 785)? — sem fonte em 2026-08-22]]`
- `[[LACUNA-RES-004: a "gorjeta" excluída da base alcança a taxa de serviço cobrada compulsoriamente na conta, ou só a gorjeta espontânea? — sem fonte em 2026-08-22]]`
- `[[LACUNA-RES-005: o repasse integral ao empregado e o teto de 15% precisam de comprovação no documento ou na apuração, e são aferidos por documento ou por período? — sem fonte em 2026-08-22]]`
- `[[LACUNA-RES-006: consumo **fora** do local (retirada, entrega) altera o enquadramento do item preparado no local, ou o recorte é só a preparação? — sem fonte em 2026-08-22]]`
- `[[LACUNA-RES-007: passado o prazo de cancelamento da NFC-e, qual é o caminho de correção de consumo cobrado errado, se o pedido fora de prazo é rejeitado e a carta de correção é vedada para as variáveis que determinam o valor do imposto? — sem fonte em 2026-08-22]]`
- `[[LACUNA-RES-008: em que situação o restaurante passa a ter obrigação de documento de **serviço** (NFS-e/ISS) — taxa de serviço, evento, buffê, contrato com pessoa jurídica — se o fornecimento de alimentação em bar e restaurante é, por lei complementar, circulação de mercadoria ([LC 87/1996, art. 2º, I](https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp87.htm))? — sem fonte em 2026-08-22]]`

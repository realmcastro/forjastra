# Núcleo de venda — a regra numerada

> **Por que na raiz e não em `modulos/`.** O núcleo não é plugável e não tem "comportamento
> desligado": ele está sempre ligado, em todo cliente (tenant), em todo ramo. Colocá-lo sob
> `modulos/` sugeriria o contrário e contradiz os invariantes 2 e 3.
>
> **O que este arquivo é.** As operações que o núcleo **possui**, com `RN-NUC-nnn`: enunciado,
> precondição, o que produz, comportamento nos três domínios de falha, caminho infeliz e critério de
> aceite.
>
> **Três arquivos, um conjunto normativo.** O núcleo estourou o teto de 400 linhas e foi partido no
> eixo **operação**, que é o eixo pelo qual ele é lido e citado: **este** arquivo tem o cabeçalho
> normativo, a tabela das operações (§1), pedido/venda/pagamento/correção (`RN-NUC-001` a
> `RN-NUC-008`, mais `RN-NUC-038` — resolução escopada, acrescentada em 2026-08-23 — §2) e as lacunas de
> todos (§6); `nucleo-caixa-e-turno.md` tem caixa, dinheiro na
> gaveta e turno (`RN-NUC-009` a `RN-NUC-012`); `nucleo-publicacao-e-texto.md` tem publicação de
> artefato e texto guardado (`RN-NUC-013` a `RN-NUC-016`). Numeração **contínua e imutável** entre os
> três (`glossario.md` §4.2), e a numeração de **seção** deste arquivo também não foi reaproveitada:
> §3, §4 e §5 mudaram de arquivo e os números ficaram vagos de propósito, para não invalidar citação
> já feita. Regra de qualquer um dos três é regra do núcleo, sem hierarquia entre eles.
>
> **Nível de heading é contrato de busca, não estética.** Nos três arquivos, toda regra é um heading
> `### RN-NUC-nnn — <enunciado curto>`, e `##` é só agrupamento. Conformidade do repo é conferida por
> busca (`^### RN-NUC-`); dois níveis quebrariam a busca e a regra sumiria da contagem.
>
> **O que o conjunto fecha.** `LACUNA-OFF-001` (as sete linhas do núcleo sem regra citável — ver §6,
> `LACUNA-NUC-007`, para o que **não** fechou), a costura de `LACUNA-OFF-010` (que artefato o núcleo
> publica — `RN-NUC-013` a `RN-NUC-015`) e `LACUNA-GLO-002` (`service_mode`, `order_item_note`,
> `pending_operation_queue`, `work_list`, `published_artifact` sem regra).
>
> **O que este arquivo não é.** Não é papel nem permissão (passo 2 e 3 da T-0003) — aqui a autoridade
> aparece só como **requisito por operação**. Não é tela, bloco, componente nem relatório. Não é
> tabela, coluna, endpoint, formato de identificador nem stack: **D-01 a D-04 estão ABERTAS**. Não é
> regra fiscal: fato fiscal aqui só é **remetido** a `RN-FIS`/`RN-EMI`.
>
> **Nenhum número.** Prazo, teto, limite, tolerância, quantidade e casas decimais concretas são
> `LACUNA-NUC-<n>` (§6) ou `LACUNA-OFF-<n>`, com dono nomeado. Valor não medido em spec de produto
> vira orçamento por acidente.
>
> **Nenhum termo de ramo.** Nenhuma regra abaixo usa mesa, comanda, produção, bomba ou frota como
> condição (`PN-04`, invariante 3). Onde a capacidade é de módulo, o módulo é citado pelo código.
>
> Vocabulário: `glossario.md` (autoridade única). Fronteira: `fronteira-do-nucleo.md`. Continuidade:
> `operacao-offline-e-sincronizacao.md`, que é dono da lei de convergência e da tabela de
> classificação. Este conjunto **fornece** as `RN` que as células do núcleo de lá citam, e a única
> coisa que ele alterou lá foram **essas células** — nenhuma `RN-OFF` foi reescrita por aqui.

## 1. As operações do núcleo — nove linhas herdadas, doze operações

Recorte tirado da tabela de classificação de `operacao-offline-e-sincronizacao.md` §4 — não é escopo
paralelo. `D1` link caiu/LAN viva · `D2` terminal isolado · `D3` rede boa, serviço externo fora.
Classe é a lei de convergência (`RN-OFF-004` a `RN-OFF-007`). A coluna final é a regra que passou a
reger a célula lá; **linha herdada** é como a operação estava escrita antes deste trabalho.

| # | Operação | D1 | D2 | D3 | Classe | Regida por |
|---|---|---|---|---|---|---|
| 1 | Abrir pedido, lançar item, corrigir pedido em construção | integral | integral | integral | 1 | `RN-NUC-001`, `RN-NUC-002` |
| 2 | Compor o valor devido: preço, desconto no limite, encargo, tributo | integral | integral | integral | 1 (aplica) | `RN-NUC-006`, `RN-NUC-013` (+ `RN-OFF-020`) |
| 3 | Concluir venda com pagamento em espécie | integral | integral | integral | 1 + 3 | `RN-NUC-003`, `RN-NUC-004` |
| 4 | Concluir venda com pagamento que exige adquirente | recusa | recusa | recusa | 4 | `RN-NUC-005` |
| 5 | Aplicar desconto acima do limite do papel | recusa | recusa | recusa | 4 | `RN-NUC-007` |
| 6 | Alterar preço, catálogo, papel ou configuração — **publicar** | recusa | recusa | recusa | 4 | `RN-NUC-014` |
| 7 | Cancelar ou devolver venda concluída | recusa | recusa | recusa | 4 | `RN-NUC-008` (+ `RN-FIS-006`, `RN-EMI-021`) |
| 8a | Sangria e suprimento | degradado | degradado | degradado | 1 no fato + 4 na autoridade | `RN-NUC-011` |
| 8b | Abrir gaveta como consequência de venda em espécie no próprio terminal | integral | integral | integral | 1 | `RN-NUC-012` (a) |
| 8c | Abrir gaveta fora de venda | degradado | degradado | degradado | 1 no fato + 4 na autoridade | `RN-NUC-012` (b) |
| 9a | Abrir sessão de caixa | integral | integral | integral | 1 | `RN-NUC-009` |
| 9b | Fechar sessão de caixa | degradado | degradado | degradado | 1 | `RN-NUC-010` |

**A linha 8 herdada estava errada, e corrigi-la é a mudança mais importante deste conjunto.** Ela
classificava **três** operações diferentes numa célula única de recusa — e `RN-OFF-003` proíbe
exatamente isso. A consequência prática da recusa: o dinheiro sai fisicamente da gaveta com o link
caído e o produto **não registra**, ou a gaveta não abre e a venda em espécie da linha 3 não se
conclui, contra `PN-01`. As duas alternativas são piores que operar. `RN-NUC-011` e `RN-NUC-012` (em
`nucleo-caixa-e-turno.md`) partem a linha e declaram o desfecho de cada parte.

**A linha 9 herdada dizia "degradado" para abrir e fechar juntos**, e as duas não têm o mesmo
desfecho: abrir é aditivo e **integral** (`RN-NUC-009`), fechar é **degradado** porque o fechamento do
estabelecimento depende dos outros terminais (`RN-NUC-010`). Dizer "degradado" na abertura afirmaria
pendência que não existe, e é o tipo de imprecisão que o construtor implementa ao pé da letra.

**As linhas 4, 5 e 6 continuam recusa, e a recusa está certa.** São os três lugares onde operar
offline significaria **fabricar autoridade** que ninguém concedeu (`RN-OFF-007`, `PN-11`, `PN-13`).
Cada uma declara — aqui na §2, ou em `nucleo-publicacao-e-texto.md` no caso da 6 — a necessidade
preservada e o caminho que a atende sem fabricar autoridade; recusa sem esse caminho declarado seria
omissão, não regra.

---

## 2. Pedido, venda, pagamento e correção

### RN-NUC-001 — Pedido em construção é local ao terminal, mutável, e nunca entra na fila

**Enunciado** o pedido em construção do núcleo pertence a **um** terminal: ele é criado, alterado e
descartado ali, sobrevive ao reinício da aplicação naquele terminal, e **não** é estado compartilhado
entre terminais nem item da fila de pendências (`pending_operation_queue` é de fato **concluído**).
**Precondição** terminal identificado e vinculado a um estabelecimento; operador autenticado (papel
retido vale — `RN-OFF-024`); sessão de caixa **não** é exigida para construir pedido.
**Produz** um pedido mutável, sem valor devido definitivo, que pode morrer sem virar venda. **Não é
fato imutável** — `PN-07` só alcança a venda concluída.
**Motivo** é o que torna verdadeira a célula "integral em D2" da linha 1: se o pedido do núcleo
dependesse de estado confirmado por outro terminal, ele seria classe 2 e seria **recusado** com o
terminal isolado — o pior desfecho possível no caminho crítico.
**Offline** integral em D1, D2 e D3; classe 1. Nada nesta operação consulta servidor.
**Infeliz** o operador precisa **retomar em outro posto** o pedido começado em um — necessidade real,
e o núcleo não a atende: consumo em aberto compartilhado é capacidade de `MSA`, e mesmo com `MSA`
ligado a transferência é classe 2 (`RN-MSA-011`). O produto diz que aquele pedido está naquele
terminal, e o caminho aditivo é concluir ali. Nunca duplica o pedido nos dois.
**Aceite** construir um pedido com vários itens em D2, reiniciar a aplicação do terminal, reencontrar
o pedido íntegro, concluí-lo — e verificar que em nenhum momento ele apareceu na contagem de
pendências nem em outro terminal.

### RN-NUC-002 — Lançar item aplica artefato publicado; item sem preço publicado não é lançado

**Enunciado** lançar um item de pedido exige que o item de catálogo e o preço aplicável **já estejam**
no artefato publicado que o terminal retém (`RN-NUC-013`); o lançamento grava a quantidade na unidade
declarada do item e **qual versão** de catálogo e de preço aplicou.
**Precondição** `RN-NUC-001` mais artefato publicado presente e com vigência que cobre o instante do
lançamento.
**Produz** uma linha de pedido (`order_item`) mutável, com quantidade, item, preço aplicado e as
versões usadas. Pode carregar observação (`RN-NUC-016`).
**Motivo** é a metade de "aplicar, não decidir" (`RN-OFF-020`) no lançamento: preço digitado no
terminal é o terminal decidindo dinheiro, que `PN-13` recusa.
**Offline** integral em D1, D2 e D3; classe 1 — **aplica**.
**Infeliz** o item não está no artefato publicado (cadastrado enquanto o terminal estava offline, ou
preço vencido) → o **item** não é lançado, a **venda continua** com o que existe, e o produto diz que
falta publicação daquele item — nunca inventa preço, nunca lança sem preço "para acertar depois".
Necessidade legítima por trás disso: **vender algo cujo preço não está publicado** (item novo,
sobra, item avariado). O mecanismo velho — valor livre digitado no caixa — é recusado por `PN-13`; o
mecanismo que a atenderia sem fabricar decisão é **item de preço aberto publicado, com teto por
papel**, que é artefato, não decisão local. **Se esse item existe no núcleo é `LACUNA-NUC-002`**, do
humano; até fechar, o desfecho é o desta cláusula.
**Aceite** em D1, D2 e D3, lançar cinco itens presentes no artefato publicado funciona e cada linha
guarda as versões aplicadas; tentar lançar um item ausente do artefato não lança nada, não altera o
total, não produz item de fila, e a mensagem diz o que falta — sem código de erro.

### RN-NUC-003 — Concluir a venda produz fato imutável, com identidade cunhada no terminal e referência humana da faixa

**Enunciado** concluir a venda transforma o pedido em **venda** (`sale`) imutável: itens, quantidades,
valor devido, contrapartida e versões de artefato **congelados**. A venda nasce com **duas** coisas
distintas: a **identidade de idempotência** cunhada no terminal (`RN-OFF-013`) e uma **referência
humana** consumida de faixa pré-alocada (`RN-OFF-006`), única no escopo do estabelecimento, que o
cliente-final pode trazer de volta. Porque ela é única **só** nesse escopo, **toda** resolução por
referência humana é escopada antes de resolver, e não depois: `RN-NUC-038`.
**Precondição** pedido com ao menos um item; valor composto por artefato publicado (`RN-NUC-006`);
contrapartida registrada e suficiente (`RN-NUC-004`, `RN-NUC-005`); faixa com número disponível.
**Produz** venda **append-only** — nunca editada, nunca apagada (`PN-07`) — mais a referência ao
estado da obrigação documental, cujo significado é de `FIS`/`EMI`, não do núcleo.
**Motivo** duas identidades porque elas resolvem problemas diferentes: uma impede que reenvio duplique
(`PN-02`), a outra permite que uma pessoa localize a venda no balcão sem sistema na mão — e é dela
que dependem devolução, reimpressão e conferência.
**Offline** integral em D1, D2 e D3; classe 1 (o fato) **combinada com** classe 3 (a referência sai de
faixa finita). Nenhuma das duas identidades é pedida ao servidor.
**Infeliz** (a) a faixa esgota offline → a **venda continua existindo** e a referência que faltou é
pendência nomeada, no tratamento de `RN-OFF-006`, infeliz (a); nunca referência inventada, nunca
reuso. (b) a resposta do servidor se perde depois do commit → reenvio devolve o mesmo resultado
(`RN-OFF-013`). (c) o operador desiste no meio → o pedido morre, e pedido morto não é venda: nada
sobe.
**Aceite** cortar o link, concluir três vendas em terminais diferentes, restabelecer: existem três
vendas, nenhuma duplicada, cada uma com o instante do fato (`RN-OFF-019`), com as versões de artefato
aplicadas e com referência humana distinta; nenhuma referência foi alocada duas vezes.

### RN-NUC-004 — Pagamento em espécie conclui sem ninguém de fora, e exige sessão de caixa aberta

**Enunciado** pagamento em espécie é registrado com o valor recebido e o troco devido calculado a
partir do valor devido já composto; ele **não** consulta terceiro e **não** depende de rede. Venda com
pagamento em espécie exige **sessão de caixa aberta** naquele terminal.
**Precondição** sessão de caixa aberta (`RN-NUC-009`); valor devido composto; meio "espécie" habilitado
no artefato publicado (`RN-NUC-013`).
**Produz** um pagamento (`payment`) imutável vinculado à venda, e o troco como parte dele. Espécie
recebida entra no esperado da sessão.
**Motivo** dinheiro em espécie cai numa gaveta que é de **alguém**: sem sessão aberta não existe
responsável, e sem responsável o fechamento não fecha em nenhum dos três negócios do teste de
fronteira. Troco é aritmética sobre valor já decidido — não é decisão nova, logo não é `PN-13`.
**Offline** integral em D1, D2 e D3; classe 1. É a operação que sustenta *"faltou internet, mas não
podemos deixar de vender"*.
**Infeliz** (a) o recebido é menor que o devido → não é venda concluída: é pagamento parcial, e a
venda só conclui quando a contrapartida fecha (pagamento dividido é do núcleo); se o restante exige
terceiro e o terceiro está fora, vale `RN-NUC-005` e a venda **não** conclui como paga. (b) não há
troco na gaveta → o produto **não** decide pelo operador: registra o que foi recebido e o que foi
devolvido, e a diferença aparece na conferência (`RN-NUC-010`). (c) não há sessão aberta → a venda em
espécie é recusada dizendo que falta abrir a sessão, que é operação disponível offline
(`RN-NUC-009`) — nunca "venda sem caixa" para acertar depois.
**Aceite** com o link cortado e o adquirente inalcançável (D1 e D3), concluir venda em espécie com
troco: a venda fecha, o pagamento existe, o esperado da sessão sobe pelo recebido, e o fluxo inteiro
ocorre sem nenhum modal de rede (`RN-OFF-018`).

### RN-NUC-005 — Pagamento que exige autorização de terceiro só existe com o resultado dela presente

**Enunciado** meio de pagamento que dependa de autorização de terceiro **não** se torna pagamento sem
o **resultado** dessa autorização; ausência de resultado é ausência de pagamento — nunca "pago,
confirma depois", nunca item de fila. O núcleo registra o resultado; obter o resultado é de `ADQ`,
`PGO` ou `PRZ`.
**Precondição** meio habilitado no artefato publicado, com a marca de que ele **exige** autorização de
terceiro (`RN-NUC-013`) — é isso que permite ao terminal recusar sozinho, sem perguntar a ninguém.
**Produz** nada, quando não há resultado. Com resultado, um pagamento imutável que **cita** o
resultado recebido.
**Motivo** enfileirar autorização é autorizar sem autorizador e conferir quando o dinheiro já saiu
(`RN-OFF-007`). O risco de captura não autorizada é do estabelecimento, e o produto não pode
assumi-lo em nome dele por conta própria.
**Offline** **recusa** em D1, D2 e D3; classe 4. Em D3 é o caso mais confundido: a rede está boa, o
servidor responde, e a operação ainda assim não acontece — a mensagem diz **qual** terceiro está
fora, não "sem conexão".
**Infeliz** o cliente-final não tem outro meio. **Necessidade legítima preservada:** receber a
contrapartida sem espécie com o autorizador fora do ar. **Mecanismo recusado:** captura offline
confirmada depois — ele transfere ao estabelecimento um risco que ele não escolheu e cria pagamento
sem autorização na trilha. **O que o produto faz:** recusa **o meio**, nunca a venda; nomeia o
terceiro indisponível; oferece os meios habilitados que não dependem dele; e deixa a decisão com quem
opera. **Se existe uma captura offline pré-autorizada** — finita, contada, com limite publicado, na
forma de `RN-OFF-025` — é decisão do humano com o adquirente: `LACUNA-NUC-006`.
**Aceite** em D3, com o servidor respondendo, tentar concluir por meio que exige terceiro: nenhum
pagamento é criado, nenhum item entra na fila, a venda continua aberta e a mensagem nomeia o terceiro
e os meios disponíveis. Repetir a tentativa não cria dois pagamentos.

### RN-NUC-006 — Desconto e acréscimo dentro do limite publicado são aplicação, não decisão

**Enunciado** desconto e acréscimo **até** o limite publicado para o papel de quem está operando são
aplicados localmente, com autor identificado, e o fato congela **qual versão do limite** foi aplicada.
Acima do limite, vale `RN-NUC-007`.
**Precondição** limite por papel presente no artefato publicado; **operador identificado** no terminal
(`RN-OFF-033`) e terminal **habilitado a vender** por aquele estabelecimento (`RN-OFF-032`i). **Não**
exige autoridade retida dentro da validade: aplicar limite até o teto é **ato ordinário** (célula da
linha 6, `terminal+ident`), e é isso que faz esta operação ser integral sem contato. Sem contato **e**
sem autoridade retida válida, o teto aplicado é o do **papel-piso**, publicado (`RN-OFF-032`, cláusula
do teto), e o registro diz **qual** teto foi aplicado (`RN-NUC-029`, fonte (3)) — acima dele a operação
deixa de ser ordinária e vale `RN-NUC-007`. **Corrigido em 2026-08-23** (`AUT-15`): esta precondição
exigia "papel conhecido, retido, dentro da validade", o que parava a linha 6 ao vencer a validade.
**Produz** valor devido recomposto na venda, com o desconto/acréscimo, o autor e a versão do limite
congelados na venda concluída.
**Motivo** é a metade "opera" da costura `PN-13` × `PN-01`: o limite é dado publicado com vigência,
aplicá-lo não é decidir. Sem esta regra, todo desconto cairia em `RN-OFF-007` e o caixa pararia por
uma exceção corriqueira.
**Offline** integral em D1, D2 e D3; classe 1 — aplica.
**Infeliz** o limite não está no artefato publicado → **não** se presume limite nenhum: desconto é
recusado como se estivesse acima do limite (falha fechado, `RN-OFF-008`), e a falta de publicação é
declarada. Presumir "sem limite" ou "limite zero" por omissão são os dois erros opostos, e os dois
são defeito.
**Aceite** em D2, operador com limite publicado aplica desconto dentro dele: entra, com autor e versão
do limite na venda. Com o artefato de limite ausente, o mesmo desconto é recusado, e a mensagem diz
que o limite não foi publicado para aquele papel. E com a validade da autoridade retida **vencida** e o
link caído, o mesmo desconto entra até o teto do **papel-piso**, com o teto registrado e distinguível na
trilha do desconto que uma atribuição de `manager` autorizaria (`RN-NUC-029`).

### RN-NUC-007 — Desconto acima do limite é autoridade nova, e autoridade nova não nasce no terminal

**Enunciado** desconto (ou acréscimo) além do limite publicado do papel exige autoridade **verificada
no servidor**; ela não é concedida, presumida nem enfileirada no terminal. Concedida, ela fica na
trilha com quem autorizou, quando, sobre qual venda e quanto.
**Precondição** para acontecer: conexão com o servidor e papel que autorize aquele excesso. Para ser
recusada: nada — é o default.
**Produz** quando autorizada, o mesmo fato de `RN-NUC-006` mais o registro do ato de autorização.
Quando não, nada.
**Motivo** `PN-11`: a exceção continua existindo, o que muda é que ela tem autor. Excesso liberado
offline é o caminho de fraude mais barato que um PDV oferece, porque quem o usa escolhe o momento.
**Offline** **recusa** em D1, D2 e D3; classe 4.
**Infeliz** o cliente-final está na frente e a exceção é legítima. **Necessidade preservada:** liberar
exceção na hora, sem parar o caixa. **Mecanismo recusado:** senha de gerente digitada no terminal
offline valendo como autorização — ela cria autoridade sem autorizador e sem trilha verificável.
**O que o produto faz:** dois caminhos, e só dois — (a) **online**, com o papel verificado no
servidor; (b) **exceção nomeada publicada antes**, com limite próprio, consumo contado e trilha por
uso, na forma de `RN-OFF-025`, que é artefato e não decisão local. Se existe, quanto vale e para
quem: configuração do cliente, valor do humano (`LACUNA-OFF-004` é o precedente de forma).
**Aceite** em D1, D2 e D3, desconto acima do limite é negado com mensagem de operação (o que fazer, não
o que falhou), nenhum item de fila é criado, e a tentativa aparece na trilha. Com o produto online, a
mesma operação é autorizada por papel que a permite e o ato fica registrado.

### RN-NUC-008 — Correção de fato concluído é fato novo, e ela não se resolve offline enquanto a obrigação documental não está resolvida

**Enunciado** cancelamento de venda, devolução e estorno de pagamento são **fatos novos** que
referenciam o original, com autor, instante e motivo; o original nunca é editado nem apagado
(`PN-07`). Enquanto a obrigação documental da venda original **não está resolvida**, a correção não
acontece offline.
**Precondição** venda concluída existente e localizável pela referência humana **dentro do escopo
resolvido da identidade autenticada** (`RN-NUC-003`, `RN-NUC-038`) — nunca localizada primeiro e conferida
depois; papel autorizado; estado da obrigação documental conhecido.
**Produz** um fato novo append-only, mais o que `FIS`/`EMI` exigirem do lado documental — cuja regra é
de lá (`RN-FIS-006`, `RN-EMI-021`, `RN-EMI-029`), nunca daqui.
**Motivo** o núcleo não pode prometer uma correção cuja perna documental ele não consegue cumprir: o
desfecho do documento é binário e tem prazo legal (`RN-EMI-024`). Cancelar no núcleo com documento
autorizado pendente é criar divergência que custa dinheiro e passa pelo contador.
**Offline** **recusa** em D1, D2 e D3; classe 4 — pela perna documental **e** pela perna do pagamento,
quando o estorno depende de terceiro (`RN-NUC-005`).
**Infeliz** o erro foi agora, o cliente-final está na frente. **Necessidade preservada:** desfazer o
que foi registrado errado, na hora. **O caminho que o produto oferece hoje:** corrigir **antes** de
concluir — o pedido em construção é livremente alterável (`RN-NUC-001`), e é ali que vive a maior
parte do erro do balcão. Depois de concluída, a correção espera conexão, e o produto diz o que o
operador pode prometer. **Existe caminho aditivo para o erro do mesmo dia antes de o documento ser
autorizado?** `LACUNA-NUC-005`, do humano com o contador.
**Aceite** tentar cancelar, offline, uma venda concluída: negado, com o motivo em linguagem de
operação, sem item de fila e com a tentativa na trilha; o original permanece íntegro. Online, o
cancelamento cria fato novo, o original continua consultável, e o saldo do dia é reconstruível dos
fatos.

### RN-NUC-038 — Venda e pagamento são resolvidos **dentro** do escopo da identidade autenticada; referência humana nunca é resolvida antes de ser escopada

**Enunciado** toda operação que **localiza** uma venda, um pagamento ou um movimento de caixa — por
referência humana, por identidade de idempotência ou por qualquer outro identificador — resolve o objeto
**dentro** do cliente (tenant) e do estabelecimento resolvidos a partir da **identidade autenticada** e do
registro da plataforma, **nunca** a partir de identificador informado no pedido, e **nunca** resolvendo
primeiro para conferir o escopo depois. Duas cláusulas: **(a)** identificador informado é **entrada de
busca dentro do escopo**, nunca endereço do objeto; **(b)** a resposta a uma referência que **não existe**
no escopo e a resposta a uma que existe em **outro** escopo são a **mesma**, e nenhuma das duas revela
existência (`RN-NUC-022`, `RN-EMI-039`).
**Escopo** núcleo: posto, padaria e loja de roupa precisam todos, e a regra passa a valer no primeiro
cliente com dois estabelecimentos — que é o caso comum, não o exótico.
**Precondição** estabelecimento resolvido (`RN-NUC-018`; sem ele não há autorização, e a recusa é
incidente, não erro de campo). **Não é operação nova e não ganha linha na matriz**: é atributo das
operações que localizam — 9, 12, 13, 17 e 30 —, como `RN-NUC-016` é atributo das que guardam texto.
**Motivo** é o achado `AUT-01` de 2026-08-23. `RN-NUC-003` declara a referência humana única **só no
escopo do estabelecimento**, de propósito, e a cláusula de resolução escopada estava escrita **duas
vezes** — para documento fiscal (`RN-EMI-039`) e para fila (`RN-OFF-026`) — e faltava exatamente no objeto
mais usado do núcleo. Sem ela, dois desfechos e os dois ruins: ou o terminal resolve a venda do
estabelecimento vizinho e a entrega — itens, valor e, onde a entrega exigiu, identificação do comprador
(`RN-EMI-017`) —, que é **vazamento entre pessoas jurídicas dentro de um mesmo cliente**, o que
`RN-NUC-018`, motivo, diz que nenhuma defesa de isolamento por cliente pega; ou a autorização nega pelo
escopo do objeto e o operador **não consegue reapresentar a via da própria venda**. A **ordem** das duas
etapas é o que separa os dois desfechos, e escopar antes resolve os dois de uma vez. O custo de não ter
isto **cresce** com `LACUNA-NUC-003`: referência curta que reinicia por dia torna a colisão entre
estabelecimentos diária.
**Aceite** dois estabelecimentos A e B do mesmo cliente, a mesma referência `000123` existindo nos dois.
(1) `cashier` autenticado em A digita `000123` → recebe **a venda de A**, com registro (`RN-NUC-032`), e
nenhuma resposta contém dado, contagem ou indício da venda de B. (2) O mesmo operador digita uma
referência que existe **só** em B → recebe a **mesma** resposta que receberia para referência inexistente,
sem nenhum sinal de que ela existe em outro escopo. (3) O mesmo par de casos para cancelar/devolver
(`RN-NUC-008`) e para localizar pagamento. (4) O negativo que prova a ordem: **nenhuma** superfície do
produto aceita "estabelecimento" como campo do pedido para localizar venda, pagamento ou movimento.
**Infeliz** o cliente-final comprou na loja vizinha e voltou nesta, e o operador **precisa** daquela
venda. Necessidade legítima, e ela não se nega em silêncio: a resposta diz o **alcance da busca** — "esta
busca alcança o estabelecimento em que você está" —, que é fato sobre a operação e não revela existência
de nada. E o produto declara que **não tem caminho hoje**: localizar venda de **outro** estabelecimento do
mesmo cliente não é operação de nenhuma das duas matrizes, logo é negada a todos (`RN-NUC-026`) —
`LACUNA-NUC-036`, irmã de `LACUNA-NUC-019`, porque venda e documento carregam o mesmo conteúdo.
**Offline** integral em D1, D2 e D3 sobre o que o terminal retém: o terminal é vinculado a **um**
estabelecimento (`glossario.md` §1.1, `RN-OFF-032`), então o escopo é **retido** e não consultado — e o
que ele não retém não é localizado nem inventado (`RN-NUC-032`, offline).

---

## 6. Lacunas do núcleo

`001` a `008` abertas em 2026-08-22, `036` em 2026-08-23; todas valem para os **três** arquivos do
conjunto. Nenhuma bloqueia as regras —
todas mudam quem constrói o quê, e cada regra que depende de uma delas foi escrita para **sobreviver às
duas respostas**.

- **`LACUNA-NUC-001`** — **conflito de fuso, aberto.** Com estabelecimentos em fusos diferentes, qual
  fuso decide vigência, "hoje", turno e fechamento: o do **estabelecimento** (`RN-FIS-008`) ou o do
  **cliente (tenant)** (`fronteira-do-nucleo.md` §2.1, `.claude/rules/dados.md` §3)? Os dois estão
  escritos hoje. **Dono:** humano. É a mesma pergunta de `LACUNA-GLO-001` e `LACUNA-OFF-006`. Até
  fechar, `RN-NUC-010` e `RN-NUC-013` **declaram** o fuso que usaram em vez de presumir qual manda.
- **`LACUNA-NUC-002`** — existe **item de preço aberto** no núcleo (valor informado pelo operador)? Se
  existir, ele é artefato publicado com **teto por papel**, nunca valor livre (`RN-NUC-002`, infeliz;
  `PN-13`). **Dono:** humano. Bloqueia a capacidade, não a regra.
- **`LACUNA-NUC-003`** — o **grão** da referência humana da venda (`RN-NUC-003`): ela reinicia por dia?
  é densa e sequencial, ou esparsa? **Há tensão real aqui:** faixa pré-alocada por terminal
  (`RN-OFF-006`) e sequência densa diária são incompatíveis, e escolher uma custa a outra. Formato é
  **D-04**; o grão e o reinício são de produto com o humano. **Dono:** humano, com entrada de
  `arquiteto-dados`.
- **`LACUNA-NUC-004`** — **precisão e arredondamento** da composição do valor: qual é a regra, e ela é
  publicada pelo núcleo ou por `FIS`? Não afirmada aqui, porque errar arredondamento é erro
  financeiro sistemático e ele aparece no fechamento do contador. **Dono:** humano (com o contador);
  forma, depois, de `arquiteto-dados` (`.claude/rules/dados.md` §3 já veta ponto flutuante).
- **`LACUNA-NUC-005`** — existe caminho **aditivo** para corrigir venda concluída offline no mesmo dia,
  **antes** de o documento fiscal ser autorizado (`RN-NUC-008`, infeliz)? Hoje o desfecho é recusa até
  haver conexão. **Dono:** humano com o contador; entrada de `FIS`/`EMI`.
- **`LACUNA-NUC-006`** — o **domínio fechado de meios de pagamento** não existe: `glossario.md` §1.4
  declara que ele é fechado e não o enumera, e `RN-NUC-005` depende de saber **quais** exigem
  autorização de terceiro. Junto: existe captura offline pré-autorizada, na forma de `RN-OFF-025`?
  **Dono:** humano (com o adquirente), mais `ADQ`, `PGO`, `PRZ`.
- **`LACUNA-NUC-007`** — **fechada pela metade em 2026-08-23; o que resta é turno.** Ela nasceu com duas
  operações do núcleo (`fronteira-do-nucleo.md` §2.5) fora da tabela §4 de
  `operacao-offline-e-sincronizacao.md`, logo recusadas pelo default de `RN-OFF-008`. **Metade fechada:**
  o **fechamento do dia por estabelecimento** ganhou regra dona (`RN-NUC-031`) e a linha entrou na §4 por
  transcrição — `degradado` em D1 e D3, **recusa** em D2, classe 1 no fato e 2 na precondição. **Metade
  aberta:** **abertura e fechamento de turno** continua sem nenhuma regra numerada e por isso continua
  recusada pelo default — e isso **não é defeito**: o humano respondeu "não sei ainda / depende do
  cliente" sobre turno ser ou não a sessão de caixa, e classificar sem saber exigiria inventar a operação
  (quem abre, o que ele encerra, o que acontece com sessão aberta na virada). `RN-NUC-010` só o nomeia
  como pendência; `RN-NUC-018` mantém que turno **não** é escopo de autorização. Enquanto assim, a recusa
  é dívida declarada, não desfecho aprovado, e é a última contradição com `PN-01` no núcleo. **Dono:**
  humano, para dizer o que é turno; depois `produto`. A parte de fuso é `LACUNA-NUC-001`.
- **`LACUNA-NUC-036`** — **existe operação de localizar venda, pagamento ou movimento de caixa de outro
  estabelecimento do mesmo cliente (tenant)?** Hoje não existe em nenhuma das duas matrizes, logo é negada
  a todos (`RN-NUC-026`, `RN-NUC-038`, infeliz). A necessidade é real e conhecida (o cliente-final compra
  numa loja e volta noutra), e o conteúdo em jogo é o mesmo do documento fiscal — valor, itens e, onde a
  entrega exigiu, identificação do comprador. Se existir, entra na matriz com papel, escopo e registro, e
  passa por `seguranca` antes: é travessia entre pessoas jurídicas. **Dono:** humano; irmã de
  `LACUNA-NUC-019`, aberta em 2026-08-23.
- **`LACUNA-NUC-008`** — quanto tempo vale o **papel retido** no terminal (`RN-OFF-024`), do qual
  `RN-NUC-009`, `RN-NUC-011` e `RN-NUC-012` dependem para operar offline. É `LACUNA-OFF-011`, e está
  repetida aqui porque três regras do conjunto (todas em `nucleo-caixa-e-turno.md`) param de valer sem
  ela. **Dono:** humano.

# Módulo `ATI` — Atendimento com IA

Spec profunda do módulo. A entrada curta é `catalogo-de-modulos.md` (`ATI`) — este arquivo aprofunda e
**não** a substitui. Código de `glossario.md` §4.3, imutável. Regras numeradas `RN-ATI-nnn`.

**A spec de `ATI` são dois arquivos.** Este, e o anexo `atendimento-ia-fronteira-de-confianca.md`, de
eixo único — **a fronteira de confiança da conversa**: quem fala, o que entra no contexto, e o que a
saída pode compor. Lá moram `RN-ATI-009`, `014`, `017`, `018`, `019` e `LACUNA-ATI-3`–`4`; a numeração
é **uma só**, contínua entre os dois arquivos, e nada foi renumerado.

**O que este arquivo não faz:** não define tabela, coluna, rota, contrato técnico, tela, componente,
bloco ou stack, e **não escolhe modelo, provedor, biblioteca nem arquitetura de instrução** — isso é
decisão técnica, não existe decisão registrada sobre ela (`CLAUDE.md` §8), e construir `ATI` sem ela é
`BLOQUEIO` na fase de construção. Não calcula dinheiro nem disponibilidade (§6). Não decide prioridade
(é do humano). Nenhuma afirmação fiscal: o que dependeria de norma está na §8 ou remetido a
`RN-RES-nnn`/`LACUNA-RES-nnn`.

**`ATI` é cross-vertical e são dois produtos em um módulo.** Ligado sem `PCF`, atende **operador** —
interno, autenticado, treinado. Ligado com `PCF`, atende também **cliente-final** — externo, anônimo,
e o texto dele é entrada hostil. O limite (`PN-16`) é o mesmo nos dois; o risco não é (§2).

## 1. Propósito e fronteira

**Propósito.** Atender em linguagem natural sobre o que já existe no sistema — o catálogo publicado, o
pedido em curso, o que o interlocutor já pediu — e transformar isso em **propostas** que um humano
confirma. Nada mais.

**O que o módulo é de verdade:** uma superfície de conversa **sem autoridade**. Ela lê o que tem
permissão de ler, compõe referências ao que o servidor resolve, e emite proposta pendente. Ela não é
operador, não é papel, não é um caminho novo para operação sensível, e não é dona de nenhuma regra de
negócio — a regra vive no backend (`fronteira-do-nucleo.md` §3.3, `PN-13`).

**O que o módulo não é:** não é o canal (o canal é `PCF`), não é o catálogo (é `PUB`), não é
substituto de atendente e não é sistema de decisão. `ATI` não gera regra, não aprende preço, não
descobre política do cliente (tenant) por conta própria e não preenche lacuna de configuração.

**Fora da fronteira:** canal, sessão externa, destino e submissão (`PCF`); conteúdo publicável
(`PUB`); consumo em aberto e fechamento (`MSA`); fila, senha e estado (`CMP`); produção e prazo
(`COZ`); pagamento (`PGO`, `ADQ`, núcleo); cadastro e histórico de pessoa (`CLF`); tributação e
documento (`FIS`, `EMI`). Nada disso é importado: contrato publicado ou evento (invariante 2).

## 2. Os dois interlocutores — no anexo

A tabela de risco dos dois modos e os requisitos de identidade estão na §1 do anexo, com o que **D-03**
precisa responder, listado e não escolhido (`CLAUDE.md` §8). Daqui basta: a IA **não tem identidade
própria** — toda proposta carrega a do interlocutor e toda confirmação a do humano que confirmou; no
modo operador o limite é o papel dele, verificado na confirmação e no backend; no modo cliente-final o
limite é o escopo da sessão externa de `PCF` (`RN-PCF-005`), o texto é **entrada hostil** por definição,
a conversa **morre com o destino** (`RN-ATI-014`) e a escalada para humano é obrigatória
(`RN-ATI-007`).

## 3. Entidades conceituais

- **Conversa** — a sequência de mensagens de um interlocutor num canal, num escopo. Tem começo, fim e
  prazo de retenção declarado (`RN-ATI-013`).
- **Interlocutor** — operador ou cliente-final (§2). Nunca "usuário" sem qualificador.
- **Proposta** — a única saída de `ATI` que tem consequência: um pedido de ação, **pendente**, dirigido
  a quem tem papel para confirmá-la. Sem confirmação, nada aconteceu.
- **Confirmação / recusa** — o ato humano que transforma a proposta em fato, ou a descarta. É onde a
  autorização é verificada.
- **Referência resolvida** — item, pedido ou estado citado por identificador e resolvido pelo servidor
  antes de aparecer na resposta (`RN-ATI-004`). O que não resolve, não aparece.
- **Escalada** — a entrega da conversa a um humano, com o que já foi dito, quando a IA não sabe ou não
  pode (`RN-ATI-006`, `RN-ATI-007`).
- **Não sei** — desfecho **normal** e declarado da conversa, não erro.
- **Fronteira de processamento** — o limite dentro do qual o conteúdo da conversa fica. O que sai dela
  é declarado e autorizado pelo cliente (tenant) (`RN-ATI-013`).

## 4. Casos de uso

1. Operador pergunta o que existe no catálogo, onde está um item, o que um pedido contém.
2. Operador pede à IA que monte um lançamento; ele confirma.
3. Operador pede algo que move valor (desconto, cortesia, cancelamento) e recebe **proposta**.
4. Cliente-final pergunta sobre o catálogo publicado e monta a cesta conversando; ele mesmo submete
   por `PCF`.
5. Cliente-final pergunta algo que a IA não sabe; a conversa vai para um humano do estabelecimento.
6. Cliente-final escreve instrução maliciosa, se declara gerente, ou pede dado de outra pessoa.
7. Cliente-final pergunta se um item tem determinado ingrediente, ou se é seguro para uma alergia.
8. Cliente-final pergunta quando fica pronto, quanto custa com desconto, se pode trocar depois.
9. A IA fica indisponível, lenta ou incerta no meio do pico.
10. O cliente (tenant) desliga `ATI` por canal, por modo ou inteira, no meio do serviço.

## 5. Regras

Campos: **Enunciado** (testável) · **Motivo** · **Aceite** (caso concreto) · **Infeliz**. Numeração
imutável (`glossario.md` §4.2). Nenhuma regra é PROVISÓRIA.

**`RN-ATI-009`, `014`, `017`, `018` e `019` estão no anexo** `atendimento-ia-fronteira-de-confianca.md`,
por eixo e não por importância — inclusive `RN-ATI-018`, que é a regra de injeção indireta e a mais
carregada deste módulo. A sequência abaixo salta o `009` de propósito.

### RN-ATI-001 — `ATI` propõe; nunca decide

**Enunciado:** toda saída de `ATI` que produziria efeito no sistema é **proposta pendente**, e só vira
fato por confirmação de humano com papel autorizado, verificada no backend. Sem confirmação, nada
mudou em pedido, consumo, venda, dinheiro, catálogo, estoque, fila ou configuração.
**Motivo:** `PN-16` é lei. Automação que decide dinheiro sozinha transforma um erro de interpretação em
prejuízo silencioso, e ninguém consegue apontar quem autorizou.
**Aceite:** pedir à IA algo que altera valor (desconto, cortesia, cancelamento) → devolve proposta
pendente; sem confirmação, nenhum valor, nenhum fato e nenhum documento mudou; confirmada, o efeito
existe com autor humano na trilha (`RN-ATI-012`).
**Infeliz:** a proposta é confirmada e estava errada → correção é fato novo (`PN-07`), atribuída a quem
confirmou, com a proposta e a conversa referenciadas. `ATI` não "desfaz" nada por conta própria.

### RN-ATI-002 — A IA não tem identidade nem autoridade próprias

**Enunciado:** não existe papel, identidade de serviço ou credencial de `ATI` que execute operação; a IA
alcança, para ler e para propor, no máximo o que o interlocutor já alcança pelo próprio papel ou pela
própria sessão — nunca mais.
**Motivo:** `PN-11`. Uma automação com papel próprio é exatamente a "senha de gerente que todo mundo
sabe": autorização sem pessoa responsável.
**Aceite:** operador com papel apenas de lançamento pede pela IA uma operação de gerente → a proposta
existe, mas a confirmação dele é **negada no backend**, e a tentativa entra na trilha; a mesma
proposta confirmada por quem tem o papel produz o efeito.
**Infeliz:** o cliente (tenant) quer que a IA execute sozinha uma rotina repetitiva → só cabe se a
rotina **não** for operação sensível e não mover valor; se mover, é recusa citando `PN-16`, não
configuração.

### RN-ATI-003 — Dois interlocutores, dois limites, verificados no servidor

**Enunciado:** o modo cliente-final só existe com `PCF` ativo, e nele a conversa vê e propõe apenas
dentro do escopo da sessão externa (`RN-PCF-005`); o modo operador é limitado pelo papel dele. Nenhum
caminho de conversa mistura os dois escopos, e o limite é verificado no backend, não na composição da
resposta.
**Motivo:** `catalogo-de-modulos.md` (`ATI`) e `PN-11`. São dois públicos com risco diferente (§2);
tratar os dois com o mesmo limite significa dar ao anônimo o alcance do operador, ou tornar a IA
inútil para o operador.
**Aceite:** com `PCF` desligado, nenhuma conversa com cliente-final é possível — a capacidade não
existe, não é uma tela escondida; com `PCF` ligado, uma conversa de cliente-final que peça qualquer
coisa fora do escopo da sessão não obtém nada, e a tentativa fica registrada.
**Infeliz:** o cliente (tenant) quer que o cliente-final consiga, pela conversa, algo que `RN-PCF-007`
proíbe → recusado citando o número; o pedido dele vira **proposta** ao operador, como qualquer outro.

### RN-ATI-004 — A IA só referencia o que o servidor resolve

**Enunciado:** item, pedido, estado e qualquer objeto citado na resposta ou numa proposta existem por
**identificador** resolvido pelo servidor contra o catálogo publicado (`PUB`) e o escopo do
interlocutor; referência que não resolve é **descartada**, e a resposta degrada para "não sei"
(`RN-ATI-006`) em vez de descrever o que não existe.
**Motivo:** é o que impede a IA de inventar item, tamanho, combinação ou variação que o cliente
(tenant) não vende. Item inventado vira pedido que ninguém consegue produzir, e a fatura disso é uma
pessoa esperando algo que nunca existiu.
**Aceite:** perguntar por um item que não está no catálogo do canal → a resposta diz que não existe ou
que não sabe, e **não** oferece substituto inventado; toda proposta de lançamento contém apenas
identificadores que o servidor resolveu, e uma proposta com referência não resolvida é recusada antes
de ser apresentada.
**Infeliz:** o interlocutor descreve algo que existe com outro nome → a IA pode oferecer candidatos
**resolvidos** e pedir escolha; se nada resolve, escala. Nunca cria o item, nunca promete "acho que
temos".

### RN-ATI-005 — A IA não afirma valor, tributo, disponibilidade nem prazo

**Enunciado:** preço, total, desconto, encargo, tributo, disponibilidade e prazo aparecem na conversa
**somente** como valores resolvidos por quem os decide (§6); se não há valor resolvido, a resposta o
omite e diz que não sabe — nunca estima, nunca arredonda, nunca calcula, nunca "em torno de".
**Motivo:** `PN-13` e `RN-COZ-011`. Valor dito por automação e diferente do cobrado é uma discussão no
balcão que termina em desconto que ninguém autorizou; prazo inventado é a mesma coisa, com fila.
**Aceite:** perguntar o preço final com desconto → o que aparece é o valor decidido no backend, ou
nada; perguntar quando fica pronto → aparece a promessa configurada pelo cliente (tenant), ou "não
sei" (`RN-COZ-011`, `RN-PCF-011`). Induzir a IA a afirmar um preço → ela não afirma.
**Infeliz:** o valor resolvido muda depois da resposta (preço novo, item indisponível) → vale o
resolvido no fato, e a divergência é apresentada como em `RN-PCF-001`; a conversa anterior não vincula
valor nenhum.

### RN-ATI-006 — Não saber é caminho normal, e é declarado

**Enunciado:** quando a IA não tem resposta resolvida, ela **diz que não sabe** e oferece o caminho
seguinte (o humano, o balcão, o que ela sabe fazer); ela não responde por aproximação, não inventa
justificativa e não continua a conversa como se soubesse.
**Motivo:** `PN-16` na parte que quase todo mundo esquece: a automação que "responde qualquer coisa em
vez de admitir que não sabe" é recusada. Num PDV, a resposta errada dita com confiança custa mais que
a ausência de resposta.
**Aceite:** perguntar algo fora do escopo, ou sobre dado que não existe → a resposta é que não sabe,
com o caminho seguinte, e o desfecho "não sei" fica **contável** (é medição de qualidade, não
vergonha); nenhuma resposta plausível é composta sem referência resolvida.
**Infeliz:** ela não sabe **e** não há caminho seguinte configurado → diz que não sabe e que não há
caminho, sem prometer retorno. Silêncio, mensagem técnica e beco sem saída são defeito (`PN-17`).

### RN-ATI-007 — A escalada tem destino declarado, e o que se vê quando não há humano

**Enunciado:** no modo cliente-final, `ATI` só é ativável com um destino de escalada declarado pelo
cliente (tenant); a escalada entrega ao humano a conversa e o contexto já coletado, e o cliente-final
vê que agora é um humano, quando ninguém assumiu, e qual é a alternativa (balcão, telefone, pedir sem
conversa por `PCF`).
**Motivo:** o modo externo cria expectativa em alguém que não tem outro canal para reclamar. Escalada
sem destino é a IA prometendo um atendimento que não existe — pior que não ter IA.
**Aceite:** ativar `ATI` em modo cliente-final sem destino de escalada → **ativação recusada**; com
destino → uma conversa escalada aparece a quem tem papel, com o histórico, e o cliente-final vê o
estado real, inclusive "ninguém assumiu ainda".
**Infeliz:** ninguém do estabelecimento assume (pico, fora do horário) → o cliente-final é informado
com honestidade e recebe a alternativa; o pedido por `PCF` continua funcionando sem a conversa
(`RN-ATI-008`). Nada de fila invisível e nada de "já vamos te atender" sem ninguém do outro lado.

### RN-ATI-008 — `ATI` nunca está no caminho crítico

**Enunciado:** com `ATI` indisponível, lenta, incerta ou desligada, vender, lançar, cobrar, concluir,
emitir documento e pedir por `PCF` continuam funcionando sem nenhuma etapa a mais; e desligar `ATI`
por canal, por modo ou inteira é ação do cliente (tenant), imediata, sem chamado e sem deploy.
**Motivo:** `PN-01`, `PN-03` e `PN-20`. O caminho crítico do caixa é o único que não aceita regressão;
nenhuma capacidade conversacional pode entrar nele.
**Aceite:** desligar `ATI` no meio do serviço → nenhum fluxo de venda ou de pedido muda de forma,
nenhuma tela fica sem saída, e as propostas pendentes que existiam continuam confirmáveis ou
recusáveis por humano; com `ATI` lenta, nenhum fechamento espera por ela.
**Infeliz:** a IA fica intermitente → o interlocutor vê o estado em linguagem de operação (`PN-15`,
`PN-17`) e o caminho sem conversa continua ali. Nunca uma venda esperando resposta de automação.

### RN-ATI-010 — A resposta não sai do escopo, e não confirma o que está fora dele

**Enunciado:** a resposta nunca contém dado de outro consumo, outra venda, outro cliente-final, outro
operador, outro estabelecimento ou outro cliente (tenant) — e nunca confirma nem nega a **existência**
de algo fora do escopo do interlocutor. Isso vale para **toda** superfície de saída da conversa, não só
para a resposta bem-sucedida: mensagem de recusa, de erro, de indisponibilidade, de tempo esgotado e de
escalada dizem o mesmo para o que existe fora do escopo e para o que não existe.
**Motivo:** invariante 1 (isolamento) e `PN-17`. Negar de um jeito diferente de "não existe" já
entrega a informação: é assim que se descobre quem esteve, quanto gastou e quem trabalhou ali. E a
mensagem de falha é a superfície mais fácil de esquecer: "não consegui ler o consumo 45 do Centro" é
oráculo completo — confirma o consumo, o estabelecimento e a presença, sem responder nada.
**Aceite:** pedir na conversa o consumo do alvo vizinho, uma venda por identificador, ou quem atendeu
determinada mesa → a resposta é a mesma para o que existe e para o que não existe, e nada do escopo
alheio aparece; nenhuma mensagem revela schema, identificador interno ou detalhe de outro cliente
(tenant).
**Infeliz:** o interlocutor insiste, reformula, ou tenta pela lateral ("quanto foi a última venda
daqui?") → mesma resposta. Ampliar o escopo é decisão de papel, não de insistência.

### RN-ATI-011 — A IA não certifica saúde e não fala pelo estabelecimento

**Enunciado:** `ATI` nunca afirma que um item é seguro para alergia, intolerância, restrição religiosa
ou condição de saúde, nem afirma composição, ingrediente ou origem como garantia; e nunca assume, em
nome do estabelecimento, compromisso de troca, devolução, garantia, prazo, indenização ou obrigação
fiscal. Ela transmite a restrição como instrução de preparo (`COZ`) e escala o resto.
**Motivo:** é a única categoria em que o erro fere pessoa, não dinheiro. A fonte de verdade sobre
composição é `FTC`, que é **opcional** e pode estar ausente ou incompleta, e o regime de tratamento
desse dado é lacuna aberta (`[[LACUNA-COZ-2]]`). E compromisso jurídico assumido por automação é
compromisso do cliente (tenant) que ninguém dele autorizou.
**Aceite:** perguntar "isso tem glúten?" ou "é seguro para alérgico a camarão?" → a resposta não
afirma nem nega segurança: informa o que o cadastro traz **como cadastro**, registra a restrição para
a produção, e escala para humano; perguntar sobre troca, garantia ou nota → escala, sem prometer.
**Infeliz:** o cliente (tenant) preenche `FTC` inteira e quer que a IA responda composição → continua
sendo informação de cadastro, atribuída a ele, e **nunca** certificação de segurança; a mudança desse
limite exige decisão registrada do humano, não configuração.

### RN-ATI-012 — Proposta, confirmação, recusa e escalada ficam na trilha

**Enunciado:** toda proposta emitida, toda confirmação, toda recusa e toda escalada entram na trilha
com quem, quando, o quê e a referência da conversa que a originou; e o cliente (tenant) consegue ver
quantas propostas a IA emitiu, quantas foram confirmadas, quantas recusadas e quantas corrigidas
depois.
**Motivo:** `PN-11` e `PN-16`. Sem isso não existe como saber se a IA está ajudando ou criando
retrabalho, e "desligar porque parece ruim" é decisão sem dado. É também o único caminho honesto para
o cliente (tenant) auditar uma automação que fala em nome dele.
**Aceite:** emitir três propostas, confirmar uma, recusar outra e deixar a terceira expirar → as
quatro situações aparecem na trilha com autor e instante, e a taxa de recusa é consultável por quem
tem papel; nenhum efeito no sistema existe sem a confirmação correspondente registrada.
**Infeliz:** a IA emite proposta em volume alto e ninguém confirma → é sinal medido, não opinião: o
cliente (tenant) desliga o modo (`RN-ATI-008`) sem depender de nós. Proposta não confirmada expira e
**não** vira fato por decurso de prazo.

### RN-ATI-013 — Conversa tem prazo declarado, fronteira declarada, e não é insumo de treinamento

**Enunciado:** cada categoria de conteúdo que `ATI` guarda — mensagem do interlocutor, resposta,
proposta e o vínculo com a sessão ou o operador — tem prazo de retenção **declarado**, e categoria sem
prazo **impede a ativação**. O que sai da fronteira de processamento é declarado ao cliente (tenant),
que autoriza; e conteúdo de conversa **não** é usado para treinar nem melhorar modelo sem autorização
explícita, revogável e registrada dele, nunca por padrão e nunca fora do escopo daquele cliente
(tenant).
**Motivo:** conversa é o dado mais imprevisível do produto — contém o que a pessoa quiser escrever,
inclusive dado de pessoa não solicitado e condição de saúde. O catálogo já alertou que sem prazo
fixado na spec a retenção nasce por omissão, e isso é dívida silenciosa. Invariante 1: conteúdo de um
cliente (tenant) não atravessa a fronteira dele por conveniência de automação.
**Aceite:** ativar `ATI` com uma categoria sem prazo → **ativação recusada**, nomeando a categoria;
com todas declaradas → ativa, e o cliente (tenant) vê o que é guardado, por quanto tempo, o que sai da
fronteira, e consegue revogar a autorização de uso sem perder o atendimento.
**Infeliz:** o interlocutor escreve dado que ninguém pediu (documento, telefone, condição de saúde) →
o produto não o promove a cadastro (`RN-PCF-004`, `CLF` é quem guarda pessoa), ele fica sujeito ao
prazo da conversa, e o prazo concreto de cada categoria é decisão do humano (§8): esta regra garante
que **nenhuma** categoria exista sem prazo, não qual é o prazo.

### RN-ATI-015 — Nenhum derivado de conversa é compartilhado entre clientes (tenant)

**Enunciado:** além do conteúdo da conversa, **todo artefato derivado dela** — resposta reaproveitada,
estrutura de busca ou de recuperação construída sobre o conteúdo, registro guardado por processador
externo, medição que carregue texto — pertence a **um** cliente (tenant), é endereçado com o escopo
dele, e nunca é lido, reusado nem consultado no atendimento de outro. Derivado sem escopo declarado
impede a ativação, como categoria sem prazo em `RN-ATI-013`.
**Motivo:** `RN-ATI-013` fechou o caso lento e visível (treinar modelo com conversa). O caso rápido e
invisível é o derivado do dia a dia, que não tem a palavra "treinamento" em lugar nenhum: reaproveitar
resposta por chave colidente devolve conteúdo de outro cliente (tenant) sem que ninguém tenha treinado
nada. Invariante 1 não distingue os dois — e o schema separado não protege artefato que vive fora dele.
**Aceite:** dois clientes (tenant) fazendo a mesma pergunta, com o mesmo texto, no mesmo instante →
nenhuma resposta, estrutura de recuperação, registro ou medição de um é usada para o outro, nem para
acelerar, nem para "melhorar"; auditar o que existe lista os derivados **por cliente (tenant)**, com
prazo (`RN-ATI-013`).
**Infeliz:** um processador externo guarda registro por conta própria → é saída da fronteira de
processamento e cai na declaração autorizável e revogável de `RN-ATI-013`; sem essa declaração a
capacidade não é ativável — não é ajuste posterior de contrato com fornecedor.

### RN-ATI-016 — O escopo é reavaliado na confirmação, não só na leitura

**Enunciado:** uma proposta só é confirmável se o escopo que a originou **ainda vale no instante da
confirmação** — sessão viva, destino aberto, papel do confirmador suficiente, referências ainda
resolvidas (`RN-ATI-004`). Perda de escopo — sessão morta, consumo encerrado, papel revogado, item
retirado do catálogo, canal desligado — **invalida** a proposta, independentemente do prazo de
expiração; e o conteúdo que a IA leu para compô-la não é reexibido a quem já não alcança aquele escopo.
**Motivo:** `RN-ATI-002` limita o que a IA alcança no instante da **leitura** e `RN-ATI-012` expira a
proposta por **prazo**. Entre os dois sobra uma proposta que **carrega o que leu**: confirmá-la depois
aplica um escopo que já não existe — é o papel revogado ainda produzindo efeito, e o consumo encerrado
recebendo lançamento. Prazo não cobre isso, porque a perda de escopo não avisa nem espera o prazo.
**Aceite:** emitir proposta, revogar o papel do operador (ou encerrar o consumo, ou desligar o canal) e
confirmar → confirmação **negada**, com motivo em linguagem de operação (`PN-17`), tentativa na trilha
(`RN-ATI-012`), e nada mudado em valor, fato ou documento; com o escopo intacto → confirma normalmente.
**Infeliz:** a proposta era legítima e o escopo caiu por acidente (queda de rede, troca de turno) → o
caminho é **propor de novo** dentro do escopo atual, nunca reaproveitar a antiga; nenhuma proposta é
"revalidada" por quem tem mais papel sem reler o que a originou.

## 6. O que a automação decide sozinha, e o que exige humano

| Ação | Quem decide | Por quê |
|---|---|---|
| Responder sobre catálogo publicado, com referência resolvida | `ATI` | leitura, sem efeito, `RN-ATI-004` |
| Montar rascunho/cesta que o próprio interlocutor submete | `ATI` | o ato de submeter é dele, não da IA |
| Propor lançamento, retirada, desconto, cortesia, cancelamento | `ATI` **propõe** | `PN-16`, `RN-ATI-001` |
| Aplicar desconto, cortesia, ajuste de preço | operador com papel | move valor; `PN-11`, `PN-13` |
| Cancelar item, pedido, venda; estornar pagamento | operador com papel | altera fato concluído; `PN-07` |
| Aceitar pedido externo | conforme `RN-PCF-008` — nunca a IA | compromete insumo e promessa |
| Recusar pedido por juízo | operador | é negar atendimento a uma pessoa |
| Recusar por condição objetiva (horário, item inexistente) | automático, e a IA só **transmite** o motivo | condição verificável, sem juízo |
| Alterar catálogo, preço, disponibilidade, estoque, configuração | operador com papel (`PN-20`) | é a fonte que a IA lê; a IA não escreve nela |
| Prometer prazo | ninguém: só a promessa configurada | `RN-COZ-011`, `RN-ATI-005` |
| Afirmar segurança alimentar, garantia, troca, obrigação fiscal | ninguém: escala | `RN-ATI-011` |
| Compor agregação sobre conduta de pessoa identificada | ninguém, salvo declaração para um papel | `RN-ATI-017` |
| Encerrar a conversa por não saber | `ATI`, declarando | `RN-ATI-006` |

**De onde vem cada cálculo** (a IA **exibe** o resolvido, nunca compõe): preço, total e troco do
núcleo; desconto e acréscimo do núcleo, autorizados por papel; promoção de `PRM`; encargo nomeado de
`ECG` (`RN-RES-003`); tributo, base e regime de `FIS` (`modulos/fiscal.md` §2); documento de `EMI`
(`RN-EMI-001`); disponibilidade do catálogo e de `EST`; prazo da configuração do cliente (tenant)
(`RN-COZ-011`).

## 7. Contrato do módulo

**Expõe:** proposta pendente (de lançamento, de correção, de ação sensível), sempre com o interlocutor
e a conversa referenciados · evento de confirmação, de recusa e de expiração de proposta · evento de
escalada para humano, com o contexto coletado · o desfecho da conversa, inclusive "não sei", como
medição · o estado da capacidade (disponível, degradada, desligada) para quem opera.

**Exige do núcleo:** operador autenticado com papel verificado no backend e trilha (`PN-11`) · **todo**
cálculo de valor e a decisão de disponibilidade (§6) · catálogo com item, código e preço vigente ·
idempotência na confirmação (`PN-02`) · estabelecimento, fuso e moeda do cliente (tenant) ·
isolamento por cliente (tenant), inclusive nos derivados de conversa (`RN-ATI-015`) · reavaliação de
escopo no ato da confirmação (`RN-ATI-016`) · a identidade e a recuperação de contexto descritas no
anexo — **requisito para D-03**.

**Exige de outros módulos e ativação:** exige `PUB` (é sobre o catálogo publicado que ela responde).
Para o **modo cliente-final**, exige `PCF` — que define canal, destino e identidade do interlocutor —
e um **destino de escalada declarado** (`RN-ATI-007`); sem `PCF`, a ativação não falha: `ATI` atende
**operador** e nada mais (`catalogo-de-modulos.md`, `ATI`). Consome o que `MSA`, `CMP`, `COZ` e `EST`
expõem, sem ler o interior de nenhum (invariante 2).

**Desligado:** o atendimento é humano; nenhuma proposta automática existe; nenhuma tela, termo ou
etapa cita conversa ou assistente (`PN-04`); nenhum canal muda de comportamento. Nada quebra: `ATI`
não é condição para vender, para pedir nem para produzir (`RN-ATI-008`).

**Sensível:** **conteúdo de conversa** é o dado mais imprevisível do produto — pode conter nome,
documento, contato, endereço, condição de saúde e qualquer coisa que o interlocutor escreva, sem que
tenhamos pedido · a vinculação entre conversa e pessoa ou sessão · o desempenho por operador inferível
das propostas confirmadas, que é dado sobre conduta de pessoa identificada e é lido por papel
autorizado, nunca exposto como ranking na operação — e que `ATI` **não compõe** sem declaração
(`RN-ATI-017`) · **o que sai da fronteira de processamento** e **todo derivado de conversa**
(`RN-ATI-013`, `RN-ATI-015`). Nenhum dado de pagamento existe em `ATI`. Toda categoria tem prazo
declarado; proteção é de `seguranca`, e os prazos são do humano (§8).

## 8. Lacunas e pendências

`LACUNA-ATI-3` (que agregação sobre conduta pode ser declarada) e `LACUNA-ATI-4` (o vocabulário fechado
de origens de contexto) estão na §4 do anexo — dono: humano, as duas.

- `[[LACUNA-ATI-1: existe restrição a atendimento automatizado que interage com o consumidor final — dever de informar que ele fala com automação, ou de oferecer atendimento humano — aplicável ao modo cliente-final? — sem fonte em 2026-08-22]]`
- `[[LACUNA-ATI-2: conteúdo de conversa que contém dado de pessoa ou condição de saúde tem regime próprio de retenção, minimização e transferência a terceiro processador? É LACUNA-COZ-2 visto do canal de conversa; não afirmo nada além dela — sem fonte em 2026-08-22]]`

**Pendente com o humano, não com fonte:**

1. **Os prazos de retenção por categoria** de `RN-ATI-013` (mensagem do interlocutor, resposta,
   proposta, vínculo com sessão/operador). A regra garante que nenhuma categoria exista sem prazo;
   **qual** é o prazo é decisão dele. Sem resposta, a ativação fica recusada por construção.
2. **O conteúdo de conversa pode ser processado fora da nossa fronteira?** Se sim, o cliente (tenant)
   autoriza por declaração revogável (`RN-ATI-013`) — e nasce uma `decision` a registrar. Se não, o
   requisito de fronteira fechada precisa entrar antes de qualquer construção.
3. **Modelo, provedor e arquitetura de instrução não estão decididos** e não são deste arquivo. `ATI`
   não é construível sem essa decisão: ela pertence ao humano (e a `backend`, quando D-01 fechar), e
   até existir, construir `ATI` é `BLOQUEIO`.
4. **O modo cliente-final vale a pena antes do modo operador?** O risco é assimétrico (§2) e a decisão
   de corte é do humano (roadmap). `produto` só declara que os dois modos compartilham o limite
   `PN-16` e que o externo exige `PCF` e destino de escalada.

# Varredura do invariante 10 sobre as specs — onde a captura falta hoje

> **O que é.** A passada de 2026-09-11 sobre `docs/produto/**` procurando o que o invariante 10
> (`CLAUDE.md` §7.10) passa a cobrar e a spec ainda não entrega: cláusula que impede captura, desfecho
> que dispensa captura, e — o caso mais comum — desfecho que simplesmente não perguntou.
>
> **Recomendação, nada aprovado.** Não cria `RN`, não reserva código, não revoga cláusula. Um achado
> foi corrigido no lugar (§4) porque era redação; o resto é proposta, com dono.
>
> **Cobertura é declarada** (§5). Ela era parcial nas duas primeiras passadas; a **terceira**, de
> 2026-09-12, fechou os 14 arquivos sem `RN` e mora em
> `captura-varredura-terceira-passada-2026-09-12.md`, irmão deste — os achados **2.13** e **2.14** são
> de lá, e a série da §2 é contínua entre os dois.
>
> **Segunda passada — 2026-09-12.** A primeira entregou `PARCIAL` com 20 e poucos arquivos não lidos.
> Esta terminou a lista da §5 na ordem de risco dela: os **39 arquivos que carregam `RN`** — o
> conjunto normativo inteiro — foram lidos, 20 por inteiro e 19 de forma dirigida (todo bloco
> `**Infeliz**`, mais contrato e seções de captura), que é onde a perda se concentra. Quatro achados
> novos entraram na §2 (**2.9** a **2.12**), todos ausência **acidental**; as duas listas
> `Registra / Não registra` entraram nos **sete** contratos de módulo (§4); uma lacuna nasceu
> (`LACUNA-EMI-017`) e uma cláusula foi acrescentada a `LACUNA-NUC-037`. O que continua não lido está
> na §5, nomeado, e nenhum dele carrega `RN`.

---

## 1. Como a lista está ordenada

Por **o que se perde**, não por esforço. Um achado sobe na lista quando a informação ausente não tem
substituto e não tem backfill; desce quando existe outro caminho para a mesma resposta, ainda que mais
caro.

A distinção que aparece em todo achado é entre ausência **decidida** e ausência **acidental**:

- **decidida** — existe cláusula escrita dizendo que aquilo não se registra, com motivo. Continua
  sendo ausência, e pode estar errada, mas alguém perguntou.
- **acidental** — o desfecho está escrito e ninguém perguntou se ele produz fato. Seis meses depois,
  as duas são indistinguíveis para quem lê, e é por isso que a segunda lista da §3 existe.

Nenhum achado aqui é sobre dado pessoal a mais. Todos são sobre **tentativa que falhou** — o caminho
infeliz, que é onde a perda se concentra, porque sucesso vira venda e deixa rastro sozinho.

## 2. Os achados

### 2.1 Ciclo de vida do pedido — o caso de referência

**Onde:** `nucleo-venda.md:157` (`RN-NUC-003`, infeliz c).
**Não é capturado:** pedido aberto, item retirado antes de concluir, pedido morto.
**Perde-se para sempre:** o denominador de qualquer taxa de conversão, a cesta abandonada, o passo da
desistência, o par lançar↔retirar, o defeito nosso visto em N clientes, e a falsificabilidade da
hipótese offline.
**Espécie:** ausência **decidida** — a cláusula existe e tem motivo. O que faltava era o custo dela
escrito ao lado.
**Encaminhamento:** proposta completa em `captura-ciclo-de-vida-do-pedido-proposta.md`, com as duas
saídas, o custo de adiar e a forma da revogação. Decisão do humano, `LACUNA-NUC-038`.
**RESOLVIDO em 2026-09-11** — saída `B`. A cláusula foi revogada em `nucleo-venda.md:157` e os quatro
fatos viraram `RN-NUC-052` a `RN-NUC-055`, em `fatos-de-operacao-ciclo-de-vida-do-pedido.md`.

### 2.2 Identidade não reconhecida no terminal não tem fato nem motivo

**Onde:** `fila-local-autoridade-e-identidade.md:262` (`RN-OFF-033`, infeliz b) e
`nucleo-caixa-e-turno.md:48` (`RN-NUC-009`, infeliz c).
**Não é capturado:** a tentativa de um operador legítimo de operar num terminal cujo conjunto de
identificação retido está defasado, e a do operador que nunca esteve no conjunto (contratado durante a
queda). As duas regras dizem que ele "não opera naquele terminal, e isso é declarado" — declarado a
quem, e como, não está em lugar nenhum.

E há um segundo buraco, mais difícil de ver: a lista fechada de motivos de recusa
(`fatos-de-operacao-dominios-fechados.md:37`) **não tem** motivo que diagnostique identidade não
reconhecida. O mais próximo é `authority_absent`, que diagnostica **configuração de papel**
(`:41`) — e `RN-OFF-033`(a) diz, com estas palavras, que identificar não é autorizar. Encaixar um no
outro faz o diagnóstico apontar para o lugar errado: "arrume o papel dessa pessoa", quando a causa é a
frequência de reconciliação do conjunto retido.

**Perde-se para sempre:** quantos operadores legítimos ficaram impedidos de trabalhar, em que
terminais e por quanto tempo. Esse é o único número que fecharia `LACUNA-OFF-016`
(`fila-local-autoridade-e-identidade.md:264` — com que frequência o terminal reconcilia e qual o
tamanho máximo do conjunto) **por medida** em vez de palpite. Sem o fato, a lacuna fecha por escolha
arbitrária e o erro só aparece como "o caixa 3 não deixa a Fulana entrar", sem série que o sustente.

E vale a trava de `RN-NUC-043`: motivo enumerado depois, sobre campo que nasceu sem enumeração, não
estreita nada. O campo nasce agora ou não nasce.

**Espécie:** ausência **acidental**. Ninguém perguntou o que "isso é declarado" produz.
**Encaminhamento:** card, dono `produto`. Duas edições que andam juntas — acrescentar o motivo à
lista fechada, que é o caminho que a própria `RN-NUC-043` prevê ("motivo novo entra por alteração
desta regra, com a `RN` dona citada", `fatos-de-operacao-dominios-fechados.md:57`), e dizer em
`RN-OFF-033` infeliz (b) que o desfecho produz fato. Nome sugerido do motivo: `identity_unrecognized`,
diagnosticando **reconciliação do conjunto retido**, regido por `RN-OFF-033`, consumido por `C` e por
`P` no canal de `RN-PRV-009`.
**RESOLVIDO em 2026-09-11** — o motivo entrou na lista fechada e a regra dona é `RN-NUC-056`
(`fatos-de-operacao-dominios-fechados.md` §1), com a cláusula de `RN-NUC-043` que o autoriza. Uma coisa
mudou em relação ao sugerido: a regra acrescenta o **marco de reconciliação**, sem o qual "idade do
conjunto" é afirmada e não derivada — e é a idade que fecha `LACUNA-OFF-016` por medida.

### 2.3 Perda de corrida não tem motivo enumerado

**Onde:** `mesa-comanda.md:150` (`RN-MSA-005`), `:164` (`RN-MSA-006`), `:190` (`RN-MSA-008`), e
`pedido-cliente-final.md:243` (`RN-PCF-009`, aceite).
**Não é capturado com o diagnóstico certo:** as quatro descrevem o mesmo desfecho — dois operadores,
ou um operador e o canal externo, agem sobre o mesmo consumo e **um perde**. A recusa produz fato por
`RN-NUC-043`, mas o motivo disponível é `business_precondition_unmet`
(`fatos-de-operacao-dominios-fechados.md:45`), que já carrega sessão de caixa fechada, pedido sem item
e lista de bloqueio. Colisão entra ali dentro e some.
**Perde-se para sempre:** a frequência de colisão por alvo, por praça e por faixa do dia. É o que diz
se a divisão do salão está errada, se a superfície leva duas pessoas ao mesmo alvo, e quanto a
exclusividade de fechamento — que `RN-MSA-011` chama de requisito mais duro do módulo
(`mesa-comanda.md:237`) — custa em operação real. Hoje esse custo é afirmado e não é medível.
**Espécie:** ausência **acidental**.
**Encaminhamento:** card, dono `produto`, mesma mecânica de 2.2 — motivo novo na lista fechada por
alteração de `RN-NUC-043`. Nome sugerido: `state_changed_concurrently`, diagnosticando **concorrência
sobre o mesmo objeto**, regido por `RN-MSA-005`/`RN-MSA-008`/`RN-OFF-005`.

### 2.4 Rascunho do canal externo morre sem fato

**Onde:** `pedido-cliente-final.md:69` — "Rascunho ... morre sem consequência".
**Não é capturado:** a abertura do rascunho no canal, o que ele continha, e a morte dele sem
submissão.
**Perde-se para sempre:** a conversão do canal (quantos abrem e quantos submetem), em que passo o
cliente-final desiste, e se o autoatendimento converte pior que o atendente. Nenhuma dessas respostas
existe por outro caminho: o canal é a única superfície em que o cliente-final opera sozinho, e o que
ele desiste de fazer não aparece em nenhum outro lugar do produto.
**Não é o mesmo caso de 2.1.** `LACUNA-NUC-038` trata do pedido do **núcleo**, local ao terminal, com
operador identificado. O rascunho é outro sujeito, em outro dispositivo, sob sessão anônima — e a
decisão de um não decide o outro. Aprovar `B` em 2.1 não cobre isto.
**Espécie:** ausência **acidental**, e o texto mostra por quê: "morre sem consequência" fala do
**efeito** (não reserva, não gera trabalho, não cobra), não do registro. As duas leituras cabem na
mesma frase, e ninguém perguntou qual valia.
**Limite 1 já resolvido:** a sessão externa é anônima por construção e morre com o destino
(`RN-PCF-016`), então o fato não carrega identidade nenhuma e não precisa carregar.
**Encaminhamento:** card, dono `produto`. Depende da decisão de 2.1 apenas no vocabulário, não no
mérito — se o humano escolher o piso lá, faz sentido oferecer as duas mesmas saídas aqui.

### 2.5 Divergência entre exibir e submeter não vira fato

**Onde:** `pedido-cliente-final.md:106` (`RN-PCF-001`, infeliz).
**Não é capturado:** a submissão que chega com item fora do catálogo ou preço diferente do exibido. A
regra manda apresentar a divergência ao cliente-final e nada mais.
**Perde-se para sempre:** quantas submissões batem em divergência, em que canal e sobre quais itens.
É o que separa mudança legítima de catálogo (o preço mudou mesmo, e o canal está correto) de defeito
de publicação no canal (o canal está exibindo coisa velha) — duas causas que chegam ao operador como a
mesma reclamação, e uma delas é nossa. É também causa direta do abandono que 2.4 mede.
**Espécie:** ausência **acidental**.
**Encaminhamento:** card, dono `produto`. Pode ser recusa (`RN-NUC-043`) com motivo
`published_artifact_incorrect`, que já existe na lista de correção de venda
(`fatos-de-operacao-dominios-fechados.md:114`) e ainda não tem equivalente na lista de recusa — o par
faltando é indício de que a enumeração de recusa nasceu sem o caso do canal.

### 2.6 Escalada que ninguém assume não tem marco de desfecho

**Onde:** `modulos/atendimento-ia.md:190` (`RN-ATI-007`, infeliz).
**Não é capturado:** o instante em que um humano assume a conversa escalada, e o desfecho da escalada
que ninguém assumiu. `RN-ATI-012` registra a escalada; o outro lado do marco não existe.
**Perde-se para sempre:** quanto tempo o cliente-final espera depois de escalado, e quantas escaladas
morrem sem atendimento. É exatamente o dado que responde a pendência 4 da própria spec
(`modulos/atendimento-ia.md:391` — o modo cliente-final vale a pena antes do modo operador?), hoje
decidível só por opinião.
**Espécie:** ausência **acidental**.
**Encaminhamento:** card, dono `produto`. É marco, não duração (`RN-NUC-045`), então o acréscimo é um
fato de assunção e o desfecho da conversa escalada — nada de campo de tempo.

### 2.7 Segundo consumo no mesmo alvo não distingue intenção de engano

**Onde:** `mesa-comanda.md:107` (`RN-MSA-002`, infeliz).
**Não é capturado:** qual das duas escolhas o operador fez quando o alvo já tinha consumo aberto —
lançar no existente, ou abrir um segundo consumo declarado.
**Perde-se:** quantos "segundos consumos no mesmo alvo" são operação real (dois grupos na mesma mesa)
e quantos são operador que não achou o consumo certo. A segunda leitura é defeito de superfície
**nosso**, e hoje ela é indistinguível da primeira.
**Espécie:** ausência **acidental**, de perda menor — parte da resposta é derivável do que sobra
(dois consumos no mesmo alvo, abertos com poucos segundos de diferença, é indício). Derivável não é o
mesmo que registrado, então fica na lista, embaixo.
**Encaminhamento:** card de baixa prioridade, dono `produto`.

### 2.8 Observação, não achado: a necessidade que não tem operação

**Onde:** `nucleo-venda.md:105` (`RN-NUC-001`, infeliz) — retomar em outro posto o pedido começado em
um. A regra reconhece a necessidade como real e declara que o núcleo não a atende.
**Por que não é achado:** não existe operação a tentar, logo não existe tentativa a registrar. O
produto não oferece o caminho, e o operador resolve por fora.
**O que fica dito:** a demanda real por consumo compartilhado no núcleo permanece invisível, e é ela
que diria se `MSA` deveria ser núcleo. Capturá-la exigiria criar uma operação só para poder recusá-la,
o que é caro e estranho. Registrado aqui para não voltar como descoberta.

**Os quatro achados da segunda passada — 2026-09-12.** Vêm depois de 2.8 porque o número não se
reaproveita, não porque perdem menos: pela ordem da §1, **2.10** entra logo abaixo de 2.3 (a série
que falta é a única resposta para "onde o provisionamento quebra"), **2.11** e **2.12** ficam na
faixa de 2.5, e **2.9** é o de menor perda imediata e o de maior risco de virar permanente, porque
ele se fecha sozinho quando alguém valorar uma célula sem saber que está decidindo captura.

### 2.9 Leitura de relatório não deixa rastro, e a lacuna que vai criar a célula não sabe que decide isso

**Onde:** `modulos/relatorios.md` §3 ("Nenhum evento: `REL` não produz fato, só lê") e `:30` (a
operação de ler não tem linha em matriz nenhuma, `LACUNA-NUC-037`).
**Não é capturado:** que um relatório foi lido — qual, por qual papel, em que escopo e sobre que
janela.
**Perde-se para sempre:** se cada um dos seis relatórios da semente é usado, por quem e com que
frequência. É a única conferência possível da promessa de `RN-REL-001` — "relatório existe pela
decisão que informa" —, e ela hoje só é verificável **antes** de construir, nunca depois. A
assimetria que torna o buraco visível: **exportar** documento fiscal registra quem pediu, o escopo e
o volume (`RN-EMI-039`), e **ler** o agregado do mesmo período não registra nada.
**Espécie:** ausência **acidental**, com um agravante que não existe nos outros achados: ela está
pendurada numa lacuna aberta, e a lacuna está escrita como pergunta de **autorização**. O valor da
célula decide duas coisas — quem lê e se a leitura produz registro (`R` × `P`, `RN-NUC-029`) —, e
quem a fechar tende a escolher `P` por ser leitura, fechando a captura sem perceber que decidiu.
**Limite 1 já resolvido:** papel e escopo bastam; **quem** leu por pessoa continua fora, por
`RN-REL-008` e `LACUNA-REL-002`, e nada aqui os toca.
**RESOLVIDO em parte, 2026-09-12** — a cláusula que obriga a valoração a decidir as duas coisas
entrou em `matriz-operacao-papel-modulos.md` §9 (`LACUNA-NUC-037`) e em `matriz-celulas-a-valorar.md`
§2, item (f). O **valor** continua sendo do humano; o que mudou é que ele não decide a captura por
omissão.

### 2.10 Provisionamento que falha no meio não produz fato — e é a falha que o fato prometia informar

**Onde:** `fatos-de-operacao-provedor.md` §3, linha `tenant_provisioned` (instante: "ao concluir o
provisionamento"; decisão declarada: "quanto tempo leva pôr um cliente em pé, e **onde o
provisionamento falha**") contra `RN-PRV-013` (enunciado: "**falha também é fato**").
**Não é capturado:** o provisionamento que começou e não concluiu — em que passo parou e por quê.
Migration tem cobertura (`migration_applied` é linha por `(schema, versão)`, com desfecho, e falha é
linha, não ausência); o **passo que contém a migration** não tem. Provisionar é o conjunto de
migrations **mais** módulos contratados, habilitação de emissão por UF e por ambiente
(`RN-EMI-012`), segredos por UF (`RN-EMI-007`) e as atribuições nomeadas do estabelecimento
(`RN-NUC-020`) — e a falha fora da migration não tem onde existir.
**Perde-se para sempre:** onde o provisionamento quebra, que é exatamente a decisão escrita na
própria célula, e o denominador de qualquer taxa — quantos tentamos contra quantos entraram em pé.
Com um cliente por vez isso parece dispensável; com N, é a diferença entre "demora muito" e "demora
no passo 4, que depende de terceiro".
**Espécie:** ausência **acidental**, e é contradição interna: a regra dona diz que falha é fato, a
tabela define o fato no instante da conclusão, e ninguém perguntou o que acontece entre os dois.
**Encaminhamento:** card, dono `produto`. O desfecho candidato é o mecanismo que `RN-PRV-013` já usa
para migration, estendido ao passo que a contém — nenhum campo novo de pessoa, nenhum dado de
cliente, só passo, instante e desfecho.

### 2.11 A entrega do documento por meio eletrônico não produz fato; a impressa produz

**Onde:** `fiscal-emissao-contingencia.md` §2 (`RN-EMI-017`) contra `RN-PER-004` e
`modulos/perifericos.md` §2, tabela de `RN-PER-005`.
**Não é capturado:** que o documento foi entregue, por que meio e quando, no caminho eletrônico. No
caminho impresso o fato existe — é o desfecho da tentativa de periférico, com os três valores e o
indeterminado.
**Perde-se para sempre:** duas coisas. A primeira é se a substituição que a norma admite é de fato
usada, e em que proporção — o número que decide se a classe de impressão é piso prático do cliente
(pergunta já aberta em `modulos/perifericos.md` §4) e se `EMI` com `PER` desligado é configuração
real ou teórica (§3, "Desligado"). A segunda é mais dura: a identificação do comprador é coletada
**porque a entrega escolhida a exige** (`RN-EMI-017`, e `fatos-de-operacao.md` §6, item 3, recusa
coletar o que ela não exigiu). Sem fato da entrega, a minimização fica **afirmada e não
conferível** — não existe como mostrar que o dado pessoal coletado serviu ao que o justificou.
**Espécie:** ausência **acidental**, por assimetria entre os dois meios da mesma obrigação.
**Limite 1:** o fato não precisa carregar a identificação — meio, documento e instante bastam, e é
justamente isso que torna a coleta auditável sem duplicá-la.
**Encaminhamento:** card, dono `produto`, para o fato de entrega. A metade normativa — se a norma
exige **prova** de entrega e em que forma — não é minha e nasceu como `LACUNA-EMI-017`
(`fiscal-emissao-contingencia.md`), respondida por humano/contador. As duas são independentes: o
fato serve à decisão de produto mesmo que a norma não exija prova nenhuma.

### 2.12 Código lido e não resolvido não separa catálogo incompleto de catálogo retido velho

**Onde:** `modulos/perifericos-classes.md` §2 (`RN-PER-014`, infeliz) e
`fatos-de-operacao-dominios-fechados.md` §1.1, motivo `published_artifact_missing`.
**Não é capturado com o diagnóstico certo:** a leitura que chega, é válida e não resolve. A recusa
produz fato por `RN-NUC-043`, e o motivo disponível diagnostica **publicação** — item sem preço,
limite não publicado, versão de regra ausente. Duas causas diferentes caem ali dentro e somem: o
código que o cliente passa e **não tem cadastrado**, e o código que existe mas o **catálogo retido
naquele terminal** ainda não conhece (`RN-OFF-020`).
**Perde-se para sempre:** de um lado, a lista de códigos que o negócio usa e o catálogo dele não
tem — trabalho de cadastro que o produto poderia entregar pronto em vez de cobrar. De outro, a idade
do catálogo retido contra a frequência de recusa, que é a mesma série que `RN-NUC-056` criou para
identidade e pela mesma razão: recusa que **cresce com a idade** é defasagem de reconciliação, e
recusa que não correlaciona com a idade é outra coisa e não se conserta encurtando a janela.
**Espécie:** ausência **acidental**, e é o terceiro caso do mesmo padrão
(`gotcha-motivo-enumerado-que-engole-dois-diagnosticos`).
**Encaminhamento:** card, dono `produto`, mesma mecânica de 2.2 e 2.3 — motivo próprio na lista
fechada, por alteração de `RN-NUC-043`, com a `RN` dona citada; e marco de reconciliação do catálogo
retido, sem o qual a idade é afirmada e não derivada. **Duas travas, e as duas são do card, não
minhas:** o desfecho do caso offline é `[[LACUNA-PER-6]]`, que é do núcleo e ainda não existe, então
o motivo nasce com ela; e **se o fato carrega o código lido** é a pergunta que decide se ele serve
para cadastrar — um código de item não é dado de pessoa, mas o que entra por um leitor pode ser
qualquer coisa, inclusive documento, e `RN-OFF-027` só admite presença.
**RESOLVIDO em 2026-09-23** (`F-007`, `T-0016`) — `LACUNA-PER-6` nasceu como `RN-NUC-063`
(`fatos-de-operacao-dominios-fechados.md` §1), com motivo e marco próprios; o código lido entra no fato
só como GTIN de circulação global (`docs/auditorias/2026-09-23-codigo-lido-no-fato.md` §3).

## 3. As ausências que estão decididas, e estão certas

A segunda lista do invariante 10 já existe em parte, e vale dizer onde — é o material que **não**
precisa de trabalho:

- `fatos-de-operacao.md:301` §6 — seis recusas escritas, cada uma com as quatro partes: cartão,
  conteúdo de texto de terceiro, identificação que a entrega não exigiu, gravação de tela e de tecla,
  composição do dinheiro por espécie, localização do terminal.
- `nucleo-caixa-e-turno.md:128` — gaveta aberta por chave, fisicamente, fora do produto. A spec diz
  que não registra e **não finge** ter registrado; aparece como divergência na conferência.
- `operacao-offline-e-sincronizacao.md:230` — terminal perdido com fila retida: a perda é declarada em
  duas partes, e a segunda é "não quantificável". Declarar o que não se sabe é o oposto de contá-lo
  como zero.
- `modulos/cozinha.md:250` — dispositivo de ponto compartilhado: a granularidade do autor é a sessão
  do ponto, não a pessoa, e isso é dito como dívida declarada.
- `RN-PER-004` (`modulos/perifericos.md:107`) — "não tentada" é um desfecho. O caso em que nada
  aconteceu produz fato.

Cinco lugares em que alguém perguntou. A diferença entre esta lista e a da §2 é só essa pergunta.

**Acrescentados pela segunda passada, 2026-09-12** — e a família do provedor, que era o item 1 da
ordem de risco, é a mais bem resolvida do conjunto:

- `fatos-de-operacao-provedor.md` §4 — seis coisas que os fatos nossos **nunca** carregam, cada uma
  com o motivo: o conteúdo lido, dado de cartão, valor de segredo de emissão, dado pessoal de
  cliente-final além do mínimo, texto de terceiro como campo de decisão, e valor de campo sensível em
  fato de edição.
- `RN-PRV-011` — a trilha **nomeia** o que foi alcançado e nunca copia o que foi lido, com o motivo
  escrito: copiar criaria um segundo acervo do dado do cliente, com outro leitor e outra retenção, e
  a auditoria viraria o vazamento que ela existe para detectar.
- `RN-PRV-014` — pergunta nossa **não** coleta fato novo no ambiente do cliente; e a cláusula da
  forma (`PRV-16`) obriga cada leitura derivada a declarar a forma admissível **e** a recusada, com o
  precedente escrito: "módulo contratado e nunca usado" é binário, nunca contagem, série, curva ou
  ordenação.
- `RN-NUC-056` (a) — a recusa por identidade **nunca** carrega o meio de identificação apresentado,
  nem parte dele, nem derivação dele.
- `RN-PER-017` — a superfície do cliente-final não retém o que exibiu além da operação em curso, e a
  razão é a pessoa seguinte na fila.
- `RN-ATI-014` — a conversa morre com o destino e não é recuperada por alvo nem por dispositivo: a
  perda é declarada como preferível a entregar histórico a um desconhecido.
- `RN-REL-005` — o inverso do registro, e ele pertence a esta lista: ausência de módulo **nunca** é
  gravada nem apresentada como zero, porque zero é fato e ausência não é.

## 4. O que foi corrigido nesta passada

Um item, por ser redação e não mérito:

**`nucleo-publicacao-e-texto.md:124`** (`RN-NUC-014`, aceite) — dizia "negado, nada gravado, nada
enfileirado". Lido ao pé da letra por quem constrói, suprime o fato de recusa que `RN-NUC-043` exige
de toda operação recusada, e some justamente com o registro de quem tenta publicar offline sem
conseguir. A frase ganhou a distinção entre o artefato (que não se grava) e o fato (que se grava),
citando a regra dona. Nenhum desfecho mudou.

### 4.1 O que a segunda passada corrigiu — 2026-09-12

**As duas listas entraram nos sete contratos de módulo**, que era o item de maior volume em "fica
para depois" da ficha `T-0010`. Uma seção `Registra / Não registra` em cada, ao lado de `Expõe` ·
`Exige` · `Desligado` · `Sensível`, como manda `.claude/rules/produto.md`:
`modulos/mesa-comanda.md` §5 · `modulos/cozinha.md` §6 · `modulos/pedido-cliente-final.md` §7 ·
`modulos/atendimento-ia.md` §7 · `modulos/perifericos.md` §3 · `modulos/relatorios.md` §3 ·
`modulos/fiscal.md` §2.1 (`FIS`) e §3.1 (`EMI`).

**Nenhuma das listas criou captura nova**, e isso é deliberado: elas derivam do que as `RN` já
obrigam. O que elas acrescentam é a **segunda** lista, com motivo escrito em cada linha — e, onde a
ausência é acidental, a linha diz isso e cita o achado, em vez de blindá-la. Sem esse cuidado, a
seção que existe para impedir a ausência de virar acidente seria o instrumento que converte acidente
em decisão retroativa, que é o pior desfecho possível para ela.

**`LACUNA-NUC-037` ganhou cláusula** (`matriz-operacao-papel-modulos.md` §9, e item (f) em
`matriz-celulas-a-valorar.md` §2): a célula decide autorização **e** registro. Nenhum valor de célula
foi escrito, e nenhuma contagem das matrizes mudou.

**`LACUNA-EMI-017` nasceu** (`fiscal-emissao-contingencia.md`, §Lacunas): a entrega do documento
exige prova registrada, e em que forma? Nada afirmado por analogia; responde humano/contador.

## 5. Cobertura — o que foi lido, como, e o que continua não verificado

**O recorte que a segunda passada adotou, e ele é a razão de a cobertura ter fechado:** o conjunto
normativo é o dos arquivos que carregam `RN`. São **39**. Desfecho de operação só existe dentro de
uma regra numerada, e arquivo sem `RN` não pode esconder um desfecho que não captura — pode, no
máximo, repetir mal o que a regra diz, que é defeito de prosa e não de captura. É por isso que a
lista de "não verificado" abaixo não tem nenhum arquivo com `RN`.

**Lido integralmente — 20 dos 39.** Na primeira passada: `fatos-de-operacao.md` ·
`fatos-de-operacao-dominios-fechados.md` · `fatos-de-operacao-retencao-e-descarte.md` ·
`nucleo-venda.md` · `nucleo-caixa-e-turno.md` · `nucleo-publicacao-e-texto.md` ·
`operacao-offline-e-sincronizacao.md` · `modulos/mesa-comanda.md` ·
`modulos/pedido-cliente-final.md` · `modulos/atendimento-ia.md`. Na segunda:
`fatos-de-operacao-provedor.md` · `fatos-de-operacao-ciclo-de-vida-do-pedido.md` ·
`modulos/fiscal.md` · `fiscal-emissao-contingencia.md` · `fiscal-custodia-e-trilha.md` ·
`fiscal-emissao-propria.md` (corpo normativo inteiro, §1 a §6; a tabela de fontes não) ·
`modulos/perifericos.md` · `modulos/perifericos-classes.md` · `modulos/relatorios.md` ·
`modulos/relatorios-semente-de-perguntas.md` · `papeis-atribuicao-e-delegacao.md`.

**Lido de forma dirigida — os 19 restantes, e o que "dirigida" quer dizer.** Todo bloco
`**Infeliz**` do arquivo, mais o contrato e as seções de captura. O critério não é comodidade: o
caminho infeliz é onde a perda se concentra, porque sucesso vira venda e deixa rastro sozinho — foi
assim que os sete achados da primeira passada apareceram, e os quatro desta também.
`fiscal-regimes-e-vigencia.md` · `matriz-operacao-papel.md` · `matriz-operacao-papel-contrato.md` ·
`matriz-operacao-papel-modulos.md` · `papeis-e-permissoes.md` · `superficie-por-papel.md` ·
`superficie-do-provedor.md` · `operacao-do-provedor.md` · `operacao-do-provedor-alcance.md` ·
`operacao-do-provedor-autorizacao.md` · `nucleo-estabelecimento.md` ·
`offline-grandezas-e-orcamento.md` · `fila-local-conteudo-e-repouso.md` ·
`fila-local-autoridade-e-identidade.md` (§3 a §5, da primeira passada) · `modulos/cozinha.md` (§2 a
§5 na primeira, §4 e §6 na segunda) · `modulos/pedido-cliente-final-sessao.md` ·
`modulos/atendimento-ia-fronteira-de-confianca.md` · `verticais/restaurante.md` ·
`superficie-por-papel-momentos.md`.

**Lido por inteiro, sem `RN`:** `glossario.md` (leitura obrigatória de todo trabalho de `produto`) ·
`README.md`, na primeira passada.

**A lista de não verificados deixou de existir — terceira passada, 2026-09-12.** Os **14** arquivos
sem `RN` que ficavam aqui nomeados foram lidos, e a cobertura de cada um, com a profundidade
declarada, está em **`captura-varredura-terceira-passada-2026-09-12.md`** §1. Para efeito do
invariante 10, `docs/produto/**` está lido por inteiro.

Dois achados novos saíram dali, e a série continua naquele arquivo sem reaproveitar número: **2.13**
(o formulário de capacidade não pergunta o que a capacidade passa a registrar) e **2.14** (nó de
manifesto descartado pelo terminal não produz fato). O maior risco declarado aqui —
`catalogo-de-capacidades.md` recusando captura por tabela nas §7 a §9 — foi conferido item a item e
**não se confirmou**: as duas recusas de captura que ele tem (`R-04`, `R-05`) estão certas e entraram
na §3 pelo arquivo irmão.

O segundo arquivo continua valendo para `catalogo-de-modulos.md`, e o motivo não mudou: ele carrega o
contrato curto de ~20 módulos **ainda sem spec**, e as duas listas não se escrevem para módulo que
ainda não tem regra — quando cada um ganhar spec, as listas nascem lá.

Nenhum achado da §2 saiu de arquivo não lido, nas três passadas.

## 6. Fora de escopo

- **Revogar qualquer cláusula.** Nenhuma foi revogada aqui, e a única que a §2 propõe revogar está na
  proposta separada, para o humano. A segunda passada não revogou nada e não propõe revogação
  nenhuma: os quatro achados novos são acréscimo, não conflito com cláusula vigente.
- **Valorar célula.** A cláusula acrescentada a `LACUNA-NUC-037` diz **o que** a valoração decide;
  ela não decide. As 43 células `?` e o total de 380 de `matriz-operacao-papel-modulos.md` §8
  continuam exatos.
- **Emitir `RN` nova.** A segunda passada não criou nenhuma. Achado vira card, e card vira regra
  depois de o humano priorizar — a exceção da primeira passada (`RN-NUC-056`) existiu porque houve
  decisão dele na mesma sessão.
- **`G-03`, `G-04`, `G-05`, `LACUNA-NUC-041`, `042` e `043`** — continuam do humano, e nada aqui as
  toca.
- **Onde cada fato repousa e por quanto tempo** — `D-06` e `LACUNA-NUC-040`, com `RN-NUC-049`
  obrigando o par a fechar junto.
- **Grão e custo medido** — `arquiteto-dados` e `performance`. Esta varredura nomeia o que falta
  registrar, nunca a forma nem o preço.

## 7. Referências

`CLAUDE.md` §7.10 · `.claude/rules/produto.md` ("Capturar é o padrão") ·
`captura-ciclo-de-vida-do-pedido-proposta.md` · `fatos-de-operacao-provedor.md` §3 e §4 ·
`modulos/relatorios.md` §3 · `modulos/perifericos-classes.md` §2 ·
`matriz-operacao-papel-modulos.md` §9 · `matriz-celulas-a-valorar.md` §2 ·
`fiscal-emissao-contingencia.md` §2 · `fatos-de-operacao.md:301` ·
`fatos-de-operacao-dominios-fechados.md:37` · `fatos-de-operacao-dominios-fechados.md:57` ·
`fila-local-autoridade-e-identidade.md:262` · `mesa-comanda.md:150` · `pedido-cliente-final.md:69` ·
`modulos/atendimento-ia.md:190` ·
`memory/plataforma/decision-capturar-e-o-padrao-nao-capturar-exige-justificativa.md`

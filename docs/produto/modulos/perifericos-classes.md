# `PER` — regra por classe de capacidade: impressão exigida, leitura, exibição e medição

Segundo dos dois arquivos de `PER` (`RN-PER-009` a `RN-PER-019`). **Eixo do corte:**
`modulos/perifericos.md` é a **lei do módulo** — as classes, `PN-18` como regra operacional, a
continuidade por domínio, o contrato e as lacunas (`RN-PER-001` a `RN-PER-008`); ele muda quando o
**módulo** muda. **Este** arquivo é a regra de **cada classe**, uma a uma; ele muda quando uma classe
muda — por norma fiscal (§1) ou por operação (§2, §3, §4). Numeração contínua e imutável entre os dois
(`glossario.md` §4.2).

**Vale aqui tudo o que o cabeçalho de `perifericos.md` declara**, e três coisas dele são pré-condição
para ler este arquivo: nenhum fato fiscal é afirmado aqui (tudo vem de `EMI`, com fonte e `F-nn` lá);
nenhum fabricante, modelo, protocolo, porta ou biblioteca é nomeado (**D-01 e D-02 ABERTAS**); nenhum
número é inventado. **As lacunas dos dois arquivos moram em `perifericos.md` §4** —
`[[LACUNA-PER-1]]` a `[[LACUNA-PER-6]]`, e três delas nascem neste arquivo.

Convenção das regras, igual à do irmão: heading `### RN-PER-nnn — <enunciado>`; dentro, **Enunciado**,
**Motivo**, **Aceite**, **Infeliz**.

## 1. A dependência dura de `EMI` — e o paradoxo resolvido

O paradoxo: `PN-18` diz que periférico não bloqueia a venda, e a contingência off-line consiste em
**gerar, assinar e imprimir** num passo só (`RN-EMI-027`, F-68), imprimindo **detalhe e segunda via**
além do documento marcado (`RN-EMI-026`, F-70), sem poder substituir o impresso por meio eletrônico
(F-64). Se a impressão falhou, o documento foi gerado e assinado e **não** foi entregue.

### RN-PER-009 — `PN-18` protege a venda, não a obrigação: impressão obrigatória não cumprida é dívida nomeada, nunca venda bloqueada nem sucesso presumido

**Enunciado** falha de impressão obrigatória tem **três** consequências simultâneas, e nenhuma delas é
opcional: (a) a venda **conclui** (`PN-18`, `RN-EMI-016`); (b) a obrigação **não** é considerada
cumprida, e a falta entra como pendência nomeada ao responsável, dizendo qual via faltou
(`RN-EMI-026` infeliz); (c) `PER` **não** oferece caminho substituto onde a norma não o admite
(`RN-PER-011`). O que degrada é a **venda**; o que **não** degrada é a **obrigação**.
**Motivo** é a resolução do paradoxo, e ela é uma distinção, não um afrouxamento: `PN-18` fala do que
o periférico pode impedir — **concluir a venda** — e nunca prometeu que a obrigação legal se resolve
por degradação. `RN-EMI-016` já diz as duas metades ("a venda não se perde porque a emissão falhou; e a
obrigação não desaparece porque a venda foi salva") e lista "sem impressora" no caminho infeliz. O erro
que esta regra impede é o inverso do que parece: não é travar o caixa, é **fechar a pendência** porque
a venda fechou bem.
**Aceite** em contingência, com a classe de impressão indisponível, concluir uma venda: ela conclui, o
cliente-final é informado do que não pôde ser entregue **em linguagem de operação** (`PN-17`), a
pendência existe por via faltante com o documento identificado, e nenhum contador de pendências volta a
zero por decurso (`RN-EMI-031`). E o inverso, que é o teste de verdade: **não** existe caminho no
produto que marque a obrigação como cumprida sem desfecho **cumprida** registrado por `RN-PER-004`.
**Infeliz** o responsável não age e a pendência acumula → ela continua contável para sempre
(`RN-EMI-031`), e o padrão aparece como uso de contingência medido (`RN-EMI-032`). `PER` não escala nem
decide nada disso: ele **reporta**, e o dono da fila é `EMI`.

### RN-PER-010 — Em contingência cada via exigida tem desfecho próprio; a falta é nomeada por via, nunca "não imprimiu"

**Enunciado** quando a obrigação exige mais de uma via com destinos diferentes — documento marcado ao
cliente-final, detalhe, via de retenção do estabelecimento (`RN-EMI-026`) — cada uma é um trabalho com
desfecho próprio (`RN-PER-004`). Cumprir uma e falhar outra é o desfecho normal, não exceção.
**Motivo** as vias têm destino, dono e consequência diferentes: a do cliente-final é entrega, a de
retenção é guarda à disposição do fisco. "Não imprimiu" apaga qual das duas falhou, e portanto apaga
qual obrigação está aberta — que é justamente o que o responsável precisa saber para agir dentro do
prazo (`RN-EMI-028`).
**Aceite** o papel acaba depois do documento do cliente-final e antes da via de retenção → a pendência
diz **exatamente** isso, com o documento identificado; e a via já entregue não é reimpressa junto com a
que faltou (`RN-PER-007`).
**Infeliz** o cliente escolheu guarda eletrônica com termo prévio em vez de segunda via impressa
(`RN-EMI-026`, F-70) → a via de retenção **não é** trabalho de `PER` naquele estabelecimento, e não
gera pendência de impressão. A escolha é configuração do cliente decidida na habilitação, lida por
`PER`, nunca decidida por ele.

### RN-PER-011 — `PER` não decide contingência, não escolhe modalidade e não oferece o meio eletrônico onde ele não é admitido

**Enunciado** `PER` não entra em contingência, não sai, não escolhe modalidade e não sugere entrega
eletrônica como equivalente do impresso. Entrar e sair é estado do **ponto de emissão** (`RN-EMI-024`),
a modalidade é dado por UF (`RN-EMI-025`), e a admissibilidade do meio eletrônico é de `RN-EMI-017`.
**Motivo** a substituição do impresso por meio eletrônico, admitida na operação normal, **não vale** em
contingência (`RN-EMI-026`, F-64). Um módulo de periférico que oferecesse "manda por meio eletrônico"
ao ver a impressora parada estaria inventando conformidade — e faria isso no pico, para o operador que
não tem como conferir. É o caso exato em que analogia com "todo PDV faz assim" produz irregularidade.
**Aceite** com a impressão indisponível em contingência, nenhuma superfície oferece o caminho
eletrônico; a alternativa oferecida é o que `RN-EMI-026` permite, e nada mais.
**Infeliz** o cliente-final pede o documento por meio eletrônico em contingência → a recusa diz o
motivo em linguagem de operação e o que ele recebe no lugar; nunca um envio "para resolver".

### RN-PER-012 — Entrega repetida é entrega do mesmo documento, com autor registrado; reimprimir nunca é reemitir

**Enunciado** imprimir de novo documento fiscal, comprovante ou via já existente é **entrega repetida
do mesmo fato**: não altera fato concluído, não consome numeração, não produz documento novo, não muda
estado de emissão — e é registrada com autor, instante, posto e motivo.
**Motivo** `PN-07` (fato concluído não se edita) e `RN-EMI-022` (número não se reusa). O registro do
autor existe porque via impressa a mais é instrumento de fraude barato (duas vias circulando como se
fossem duas operações), e porque o operador precisa poder reimprimir sem chamar ninguém (`PN-20`) — as
duas coisas ao mesmo tempo só ficam de pé com trilha.
**Aceite** reimprimir um documento autorizado 10 vezes: 10 registros de entrega, **um** documento, um
número, nenhuma mudança de estado; e o conteúdo é idêntico ao original inclusive depois de a regra
tributária mudar (`PN-08`, `RN-EMI-030`).
**Infeliz** **exige papel autorizado?** Sim, e a resposta não é deste arquivo: `RN-NUC-032`
(`matriz-operacao-papel.md`, linha 17) decidiu que apresentar de novo — ou reimprimir — via de venda ou
documento **que já existe** é operação do `cashier`, **com registro de auditoria que inclui quantas
vezes já foi apresentada**, e que consultar em lote, exportar e enumerar são **outra** operação, que ela
não libera (`RN-EMI-039`). `PER` **executa** essa decisão e não a reinterpreta: nenhuma classe de
impressão é caminho de enumeração, e o registro de autor é exigido em todos os casos, fiscal ou não.
Abrir compartimento de valor fora de venda também já tem dono e célula: `RN-NUC-012`(b), **linha 16 da
matriz do núcleo** — `R` para `manager` e `owner`, `N` para `cashier`, retida offline. Este arquivo cita
a célula, não a prosa, e **nenhum papel novo nasce em `PER`** (`RN-NUC-017`, `RN-NUC-019`, `RN-NUC-039`).

## 2. Leitura de código — primeira classe, não acessório

### RN-PER-013 — O que a leitura dispara vem do contexto declarado, nunca do conteúdo lido

**Enunciado** uma leitura é **entrada de dado** dirigida ao contexto em que o operador está (lançar
item, identificar documento, identificar pessoa quando a operação a pede, conferir). O conteúdo lido
**nunca** escolhe a ação, nunca navega, nunca é executado e nunca é interpretado como comando.
**Motivo** invariante 4 do produto e `.claude/rules/seguranca.md` §4: string que vem de fora não é
código. Um código impresso por terceiro é entrada controlada por quem imprimiu o código — se ele
escolher a ação, quem imprime a etiqueta manda no PDV. E do lado da operação: leitura que faz coisa
diferente dependendo do conteúdo é impossível de aprender de músculo (`PN-06`).
**Aceite** a mesma leitura em dois contextos produz duas coisas diferentes, cada uma prevista pelo
contexto; e nenhum conteúdo lido — por longo, estranho ou construído que seja — troca de tela, executa
ação ou altera valor.
**Infeliz** o contexto aceita leitura para mais de uma finalidade → a finalidade é **declarada pelo
contexto** antes da leitura, não deduzida do formato do que foi lido.

### RN-PER-014 — Leitura que não resolve não inventa ação: recusa dizendo o que leu e o que faltou

**Enunciado** leitura recebida e não resolvida pelo contexto produz recusa que diz **o que foi lido** e
**o que se esperava ali**, sem código técnico, sem "tente novamente" e sem efeito parcial no pedido.
**Motivo** `PN-17`. No caixa, a leitura errada é rotina (código do fornecedor, embalagem coletiva,
etiqueta de outro sistema) e o operador tem uma pessoa na frente: ele precisa saber se digita, se troca
o produto ou se chama alguém — nas próximas duas palavras, não no chamado de suporte.
**Aceite** ler um código desconhecido durante um lançamento: o pedido em construção fica **intacto**, a
recusa nomeia o que foi lido e o que aquele contexto esperava, e o operador segue pela digitação
(`RN-PER-015`) sem reabrir nada.
**Infeliz** o código é válido e o produto não o encontra no catálogo que o terminal retém, sem contato
(`RN-OFF-020`) → a leitura é aceita como leitura e a **resolução** é que falha, dizendo que falta
contato para resolver aquele identificador. Qual é a regra do núcleo para identificador não resolvível
offline é `[[LACUNA-PER-6]]` — não a invento aqui.

### RN-PER-015 — Nenhum caminho existe só por leitura, e nenhum existe só por toque

**Enunciado** toda operação que aceita leitura de código aceita **também** o mesmo identificador
digitado; e todo caminho crítico da venda é completável por teclado e leitor, sem toque (`PN-05`). A
leitura é caminho **primeiro**, nunca caminho **único**.
**Motivo** as duas metades de `PN-05`, e `PN-18` na terceira: leitor tratado como acessório produz
interface que exige mouse; leitor tratado como obrigatório produz caixa parado quando ele falha. Só o
par resolve — e é por isso que a ausência de leitor **degrada** (`RN-PER-005`) em vez de bloquear.
**Aceite** fechar uma venda de três itens só com teclado e leitor, sem encostar na tela; e fechar a
mesma venda **sem** leitor, digitando os identificadores, com o mesmo número de passos por item.
**Infeliz** o identificador não é digitável por natureza (longo, não impresso em texto legível) → é
defeito de **quem definiu o identificador**, declarado como tal, e o produto oferece outro caminho de
seleção; nunca "só com leitor".

## 3. Exibição ao cliente-final

O **espaço de desenho** dessa superfície não está fechado: `docs/design/grade-e-espacos.md` §10 (G-03)
registra que o display de balcão não é nem E3 nem E4, e o dono é humano/`produto`. Esta seção declara
**o que `PER` expõe** ali; não desenha tela, não escolhe bloco e não fixa tamanho — é
`[[LACUNA-PER-5]]`.

### RN-PER-016 — A exibição ao cliente-final é espelho derivado, de origem única, sem dado de pessoa e sem interação

**Enunciado** essa superfície mostra **apenas** o que o backend já decidiu para a operação em curso —
o que está sendo lançado, o valor devido, o recebido e o troco — como **derivado**, com origem única
(`PN-13`). Ela não recebe interação, não pede confirmação, não coleta nada, e **não** carrega dado de
pessoa, contato, endereço, documento, histórico, nome de operador nem qualquer dado de pagamento.
**Motivo** duas necessidades diferentes, e a segunda é a que se esquece: quem paga precisa acompanhar o
que está sendo cobrado **sem perguntar** (é o que evita a discussão no fim da venda); e a tela fica
virada para o salão, exposta a quem passa — pelo mesmo raciocínio que faz a via de produção não levar
dado de pessoa (`cozinha.md` §6) e a entrega do documento minimizar identificação (`RN-EMI-017`). É
superfície pública dentro do estabelecimento.
**Aceite** com identificação de cliente-final coletada na venda, nada dela aparece nessa superfície; o
valor exibido é sempre o mesmo que o backend decidiu, e nunca um cálculo feito ali; a pessoa que lê é
**não treinada** e não tem nada para tocar.
**Infeliz** a superfície fica sem conteúdo (entre vendas, ou sem dado) → mostra estado neutro, nunca
mensagem técnica, nunca a última venda de outra pessoa (`RN-PER-017`). E nenhum erro do produto é
exibido ali: erro fala com o **operador** (`PN-17`).

### RN-PER-017 — A superfície do cliente-final não retém o que exibiu além da operação em curso

**Enunciado** encerrada a operação (concluída, cancelada ou abandonada), o conteúdo daquela operação
deixa de estar exibido. Nada do que foi mostrado sobrevive para a operação seguinte nem para quem
chegar depois.
**Motivo** é a mesma necessidade da regra anterior levada ao tempo: a superfície é pública e a pessoa
seguinte na fila não é a pessoa anterior. Tela de balcão com o total de quem acabou de pagar é
vazamento de operação de terceiro dentro do estabelecimento — barato de evitar agora, caro de descobrir
depois.
**Aceite** concluir uma venda e observar a superfície: o conteúdo da venda encerrada não está mais
visível quando a pessoa seguinte chega ao balcão, sem ninguém agir para isso.
**Infeliz** a superfície perde contato com o posto de trabalho no meio da operação → ela **não** congela
o último conteúdo indefinidamente: passa a estado neutro, e a venda segue sem ela (`RN-PER-005`).

## 4. Quantidade medida

### RN-PER-018 — Quantidade medida é leitura transportada com origem declarada; `PER` não converte, não arredonda e não decide tolerância

**Enunciado** `PER` entrega a leitura **como leitura**, com a unidade em que ela foi obtida e o instante,
e marca a quantidade do item como **medida** (em oposição a informada). Conversão de unidade,
arredondamento, casas decimais e aceitação da leitura são do núcleo — quantidade fracionária com casas
declaradas é **núcleo**, não módulo (`fronteira-do-nucleo.md` §2.2), e não existe módulo de balança
(`receitas-por-vertical.md` §5).
**Motivo** `PN-13`: a quantidade entra no valor devido, então quem decide como ela vira número é quem
decide dinheiro. E `RN-PER-003`: periférico que arredonda é um segundo lugar decidindo cobrança, no
lugar mais difícil de auditar.
**Aceite** a mesma leitura, no mesmo item, produz o mesmo valor devido em qualquer posto de trabalho e
com qualquer equipamento daquela classe; e a origem (medida/informada) está no registro do item.
**Infeliz** a leitura chega em unidade que o item não usa, ou fora de qualquer faixa plausível → é
**recusada** pelo dono da regra com o motivo, e `PER` não converte "para ajudar". Tolerância,
arredondamento e exigência sobre instrumento em uso na cobrança são `[[LACUNA-PER-2]]` — pendência com
o humano, não analogia.

### RN-PER-019 — Medição indisponível degrada para quantidade informada por pessoa, marcada como informada

**Enunciado** sem a classe de captura de quantidade medida, a venda de item por quantidade fracionária
continua: a quantidade é informada por pessoa e **marcada** como informada, com autor.
**Motivo** `PN-18` e a §12 da regra núcleo: a necessidade é cobrar o que foi medido; recusar a **venda**
por falta do equipamento seria recusar a capacidade e chamar isso de rigor. A marcação existe porque a
diferença importa depois — para conferência e para quem investiga divergência —, e porque a origem
declarada já é padrão do produto (`RN-NUC-016`, texto guardado com origem declarada).
**Aceite** com a classe indisponível, vender um item por quantidade fracionária: a venda conclui, o
valor é decidido no backend a partir da quantidade informada, e o registro diz que aquela quantidade foi
**informada**, com autor; a conferência consegue separar informadas de medidas em um período.
**Infeliz** o negócio não aceita cobrar por quantidade informada (política do cliente) → é
**configuração do cliente** que recusa aquele item naquele posto, com o motivo dito ao operador — nunca
regra geral do produto, e nunca venda travada por decisão nossa.

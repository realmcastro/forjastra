# `EMI` — custódia, poder de assinar e trilha do ato

Terceiro arquivo de `EMI`, aberto em 2026-08-22 por **decisão do humano sobre dois achados críticos** de
auditoria. Aqui está **um** assunto: quem guarda o quê, **onde o ato de assinar acontece**, quem pode
usar esse poder, como ele se revoga e como se prova depois que foi usado. O que precisa estar em pé para
emitir está em `fiscal-emissao-propria.md` (`RN-EMI-008` a `RN-EMI-016`); o que acontece com cada
documento depois da venda está em `fiscal-emissao-contingencia.md` (`RN-EMI-017` a `RN-EMI-032`); a
fronteira do módulo e `RN-EMI-001` a `RN-EMI-003` estão em `modulos/fiscal.md` §3.

**Regras que moraram em `fiscal-emissao-propria.md` §1 e vieram para cá sem alteração de número:**
`RN-EMI-004` a `RN-EMI-007` (numeração é imutável — `glossario.md` §4.2; mudou o arquivo, não a regra).
**Regras novas:** `RN-EMI-033` a `RN-EMI-041`.

**Regra de honestidade.** Toda afirmação sobre exigência de emissão carrega **link inline** e o `F-nn` da
tabela `## Fontes` de um dos arquivos irmãos — este arquivo **não duplica linha de fonte**: os fatos que
ele usa (F-35 a F-40, F-64, F-66) estão tabulados em `fiscal-emissao-propria.md`, e F-67 a F-75 em
`fiscal-emissao-contingencia.md`. Fonte única: o dossiê datado
`docs/arquitetura/fiscal/2026-08-22-dossie-emissao-propria.md`. **Nenhum fato foi verificado por mim na
fonte primária.** Onde não há fonte existe `[[LACUNA-EMI-<n>]]` **no lugar da frase**. Convenção: o
**título é o enunciado**; o bloco traz motivo, critério de aceite e caminho infeliz.

**Segredo:** credencial de assinatura, código de segurança do contribuinte e código de responsável
técnico são tratados aqui como **ativos nomeados, com responsável, vigência e alcance** — e nada mais.
Nenhum caminho, arquivo, formato de armazenamento, transporte, repositório, senha ou dispositivo
(`CLAUDE.md` §7.8, `.claude/rules/00-nucleo.md` §8). "Onde a capacidade de assinar reside" é **mecanismo**
e depende de **D-01** e **D-03**, ABERTAS: esta spec declara o requisito e para aí.

## 1. Custódia da credencial de assinatura

Decisão do humano, entrada e não pendência: **nós guardamos** (padrão) **e** existe a capacidade
alternativa em que a credencial fica fora da Forja (`RN-EMI-003`). Da norma: a validade jurídica do
documento vem da assinatura **do emitente** somada à autorização de uso (F-35); a credencial é do
titular, emitida por AC credenciada na ICP-Brasil; e a que **assina** tem função distinta da que
identifica o aplicativo na conexão com o autorizador (F-36). Quem responde pela custódia:
`[[LACUNA-EMI-001: que instrumento rege a custódia de credencial de assinatura de terceiro, e que
responsabilidade o custodiante assume perante o emitente e perante o fisco? — sem fonte em 2026-08-22]]`.
O que há de fonte é que, no **único** arranjo em que a norma admite terceiro assinando em nome do
emitente, a responsabilidade legal e tributária **permanece do emitente** (F-39); nada nas fontes
abertas transfere responsabilidade a quem guarda.

### RN-EMI-004 — A credencial é ativo de um cliente só, com vigência própria, e o produto avisa antes de vencer em vez de descobrir no caixa

**Motivo** o tipo mais comum vale **1 ano**; outro vale até 5 anos mas exige mídia conectada a cada uso;
o de nuvem exige autorização por dispositivo a cada uso
([carta de serviços](https://www.gov.br/pt-br/servicos/obter-certificacao-digital), F-37) — N clientes são
N vigências independentes que ninguém sincroniza. E credencial vencida **não é caso de contingência**: a
contingência off-line exige **assinar** (F-68, em `fiscal-emissao-contingencia.md`), e indisponibilidade
técnica não dispensa a obrigação (F-66).
**Aceite** cada estabelecimento tem vigência conhecida e consultável; na janela de aviso, quem pode agir
(não o operador de caixa) é avisado de forma **contável, repetida e escalonada**, com o efeito em uma
frase ("a partir de tal data este estabelecimento para de emitir"); vencida, a venda **conclui** e a
pendência diz "credencial vencida", não "erro de transmissão".
**Infeliz** vence no meio do serviço → nenhuma venda retida, nenhum modal no caixa, pendências
**contadas e visíveis**, obrigação intacta. A antecedência da janela é configuração do cliente
(`RN-OFF-028`); **não afirmo um número** (`PERGUNTAS` 2).

### RN-EMI-005 — Trocar, renovar ou revogar credencial é evento datado; documento já assinado não é reassinado nem revalidado

**Motivo** `PN-08` e `RN-FIS-005`: documento autorizado é fato concluído. E a troca é rotina — vigência
de 1 ano, e perda da mídia do tipo de 5 anos é perda da credencial (F-37): a troca **não avisada** também
acontece.
**Aceite** documento autorizado antes da troca segue íntegro, consultável e reimprimível depois dela;
documento **montado e ainda não assinado** é assinado com a credencial vigente e registra qual; série e
numeração não mudam por troca de credencial (`RN-EMI-023`).
**Infeliz** credencial revogada com pendentes já assinados → eles seguem para transmissão como estão, e o
que **ainda não** foi assinado fica pendente com o motivo "sem credencial vigente" — nunca reassinado em
silêncio. Quem retém a **capacidade** de assinar não é alcançado por esta regra: é `RN-EMI-037`.

### RN-EMI-006 — O modo de assinatura é declarado por estabelecimento, e é ele que determina qual contingência existe ali

**Enunciado** custódia na Forja (padrão) ou credencial fora da Forja (`RN-EMI-003`): configuração
declarada do estabelecimento, conhecida **na ativação**, não descoberta no pico.
**Motivo** o modo decide **onde** o documento pode ser assinado, e assinar é pré-requisito da
contingência off-line (F-68) — logo decide o que o caixa entrega quando o autorizador não responde (o
que degrada: `RN-EMI-027`).
**Aceite** ativar emissão sem modo declarado é **recusado na ativação**; com o modo declarado, o produto
informa antes do primeiro dia de operação quais modalidades de contingência existem ali e o que se perde
no modo externo. O **lugar** do ato de assinar é atributo à parte, e é `RN-EMI-033`.
**Infeliz** o cliente muda de modo depois de operar → configuração **datada**, com efeito declarado por
escrito; documentos já emitidos não são afetados; pendentes assinados seguem (`RN-EMI-005`).

### RN-EMI-007 — Emissão tem mais de um segredo por cliente e por UF, cada um com responsável e vigência — e nenhum aparece em documento, log ou exportação

**Motivo** além da credencial de assinatura, o código de segurança do contribuinte entra no código
bidimensional do impresso e é **conhecido só pelo contribuinte e pelo fisco da UF**
([MOC 7.0 Anexo I, ZX02](https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-anexo-i-leiaute-e-rv.pdf),
F-38); e onde a UF exige credenciamento de software emissor pode haver **código de responsável técnico**
(F-40). Três coisas distintas, com donos e ciclos distintos — "certificado" no singular esconde duas.
**Aceite** habilitar emissão em uma UF produz a lista **nomeada** do que falta, com responsável, vigência
e **alcance** de cada item (`RN-EMI-041`), **sem exibir valor**; nenhuma superfície — tela, recibo,
exportação, registro de erro, memória do projeto — apresenta o valor de qualquer um deles.
**Aceite (acrescentado em 2026-08-22)** a proibição vale também **em repouso no ponto de emissão**: o que
a contingência exige lá é a **capacidade** de `RN-EMI-033`, com prazo, escopo e revogação, nunca o valor
de um segredo estacionado no terminal — e nada disso entra na fila local (`RN-OFF-023`, item 2).
**Infeliz** um segredo está indisponível ou foi trocado pelo cliente → pendência nomeada dizendo
**qual**, venda segue (`RN-EMI-001`); o efeito sobre documentos já emitidos é
`[[LACUNA-EMI-002: quem emite o código de segurança do contribuinte, com que validade, como se rotaciona
e revoga, e o que acontece com os documentos já emitidos quando ele é trocado? — sem fonte em
2026-08-22]]`.

**Alternativa documentada, não adotada — PAA.** Existe modelo nacional em que provedor homologado pelo
ENCAT assina e pede autorização **em nome do emitente**, com a responsabilidade permanecendo do
emitente, vínculo desfeito por qualquer das partes com efeito imediato, e público-alvo declarado de MEI,
produtor rural e optantes do Simples
([NT 2026.001 v1.02b](https://www.nfe.fazenda.gov.br/portal/exibirArquivo.aspx?conteudo=AlgHfV6gpAU%3D),
F-39). **O que ele tiraria de cima de nós:** a custódia da credencial e o ato de assinar — não a
tributação, não a montagem, não a fila de pendências, não a responsabilidade do cliente. **Não adotado**;
custo comparado é do passo 9; adequação em
`[[LACUNA-EMI-003: o público-alvo declarado do PAA (MEI, produtor rural, Simples) exclui emitente do
regime regular, e a homologação pelo ENCAT recai sobre a desenvolvedora ou sobre o provedor? — sem fonte
em 2026-08-22]]`.

## 2. Onde o ato de assinar acontece — a decisão de 2026-08-22

Achado crítico da auditoria: a contingência off-line consiste em **gerar, assinar e imprimir sem
autorização prévia** (F-68), e o impresso exige o código bidimensional que carrega o identificador do
código de segurança do contribuinte (F-38). Logo a contingência **põe no ponto de emissão** o poder de
produzir documento completo — e `RN-EMI-007` proibia o segredo em tela, recibo, exportação e log, mas era
**silente sobre repouso no ponto de emissão**, que é exatamente onde a contingência o coloca.

**A decisão do humano foi manter a contingência e fechar o risco**, não escolher entre as duas: recusar a
contingência seria recusar **capacidade** (`.claude/rules/00-nucleo.md` §12) — o cliente-final sairia com
comprovante não fiscal toda vez que o link caísse, e a necessidade que a contingência atende (documento
na mão do cliente-final, sem rede, com prazo para transmitir) é legítima e é da norma. O que se recusa é
o **mecanismo** "credencial estacionada no terminal, sem prazo, sem escopo e sem trilha".

### RN-EMI-033 — Onde o ato de assinar acontece é atributo declarado; no ponto de emissão ele existe como capacidade limitada em escopo e prazo, revogável e contada por uso — nunca como credencial estacionada

**Enunciado** o **lugar** do ato de assinar é atributo explícito do estabelecimento e de cada ponto de
emissão, declarado na habilitação (`RN-EMI-012`) ao lado do modo (`RN-EMI-006`). Onde esse lugar é o
**ponto de emissão**, o que existe lá é uma **capacidade de assinar**, com quatro limites simultâneos e
declarados: (a) **escopo** — só documento fiscal daquele estabelecimento, na série daquele ponto de
emissão (`RN-EMI-023`); (b) **prazo** declarado, sem renovação sem contato; (c) **revogável** com efeito
imediato (`RN-EMI-037`); (d) **contada por uso**, com trilha por ato (`RN-EMI-035`). A capacidade abrange
tudo que a norma exige para o documento sair completo naquele lugar — inclusive o que compõe o código
bidimensional do impresso (F-38) — e os quatro limites valem para a capacidade **inteira**, não só para o
ato de assinar. Que itens exatamente a norma exige ali: `[[LACUNA-EMI-016]]`.
**Motivo** `RN-EMI-027` até aqui apenas **implicava** "no terminal" sem nunca dizer, e o que a spec não
diz o construtor decide sozinho. Dito o lugar, o risco fica nomeável: quem tem o ponto de emissão na mão
tem, até o fim do prazo, o poder de emitir em nome do emitente — e a responsabilidade legal e tributária
é **do emitente** (F-39), então o dano é dele, não nosso. Prazo curto com revogação é o que transforma
"comprometimento indefinido" em "janela conhecida e mensurável".
**Aceite** a habilitação declara, por escrito e antes do primeiro dia de operação, **onde** se assina,
com que prazo a capacidade vale e o que acontece quando ela vence sem contato; capacidade vencida faz o
ponto de emissão **recusar assinar** e cair no degrau declarado de `RN-EMI-016` (documento montado, não
assinado), sem travar o caixa (`RN-EMI-001`) e **sem renovar sozinho** offline; a contagem de uso por
ponto de emissão é consultável, ao lado da contagem de contingência (`RN-EMI-032`).
**Infeliz** a capacidade vence com o ponto de emissão sem contato (**D1** ou **D2**, `RN-OFF-001`) → não
há renovação local: a contingência off-line deixa de existir naquele ponto até reconectar, a venda
continua (`RN-EMI-016`), e a pendência diz **"capacidade de assinar vencida neste ponto de emissão"** —
nunca "erro de transmissão". O prazo é configuração do cliente (`RN-OFF-028`) e **não escrevo o número**:
`[[LACUNA-EMI-014]]`.

### RN-EMI-034 — A requisição de assinatura é validada contra o estabelecimento do documento antes de assinar; nenhuma credencial ou capacidade é escolhida por identificador que o pedido informa

**Enunciado** a credencial (ou a capacidade, `RN-EMI-033`) usada em um ato de assinatura **decorre do
documento**: o estabelecimento é resolvido a partir do documento e do contexto autenticado, e o ativo é
selecionado a partir dele. Nenhum caminho — emissão, retransmissão de pendente (`RN-EMI-030`), drenagem
de fila (`RN-OFF-010`), pedido de inutilização (F-56), cancelamento (`RN-EMI-029`), reimpressão,
exportação — aceita identificador de credencial, de capacidade ou de estabelecimento vindo de quem pede.
**Motivo** `RN-EMI-004` diz que a credencial é ativo de **um cliente só** — e isso não impede um pedido
de assinatura apontar para a credencial de outro. É o caminho de acesso indireto desta camada, e ele é
pior que ler dado alheio: a validade jurídica vem da assinatura **do emitente** (F-35), então assinar
documento de A com o ativo de B produz documento inválido para A **e** uso indevido do ativo de B, com a
responsabilidade recaindo sobre B (F-39).
**Aceite** pedido em que o documento pertence a um estabelecimento e o ativo indicado é de outro é
**recusado**, registrado na trilha (`RN-EMI-035`) e escalado como **incidente** — não como erro de
preenchimento de campo, não com mensagem que revele o que existe do outro lado; e nenhuma superfície
oferece "assinar como" outro estabelecimento.
**Infeliz** o documento chega sem estabelecimento resolvível → **não é assinado**: pendência nomeada
"estabelecimento não resolvido" e escalada, nunca escolha de ativo por default (`.claude/rules/00-nucleo`
falha fechado é a postura, e aqui default é falsificação).

### RN-EMI-035 — Cada ato de assinatura tem registro próprio e append-only: a trilha é do ato, não do documento

**Enunciado** todo ato de assinatura produz um registro que **não se edita nem se apaga**, com: operador,
ponto de emissão, estabelecimento, instante do ato, identificação **não secreta** do ativo usado e a
vigência dele, ambiente (`RN-EMI-011`) e versão de especificação (`RN-EMI-008`). Retido pelo **mesmo
prazo do documento** (`LACUNA-EMI-007`). **Jamais** contém valor de credencial, de código de segurança do
contribuinte ou de código de responsável técnico (`RN-EMI-007`).
**Motivo** o ato e o documento não são a mesma coisa e não coincidem no tempo: pendente é assinado com a
credencial vigente no momento da assinatura (`RN-EMI-005`), documento em contingência é assinado no ponto
de emissão e transmitido depois preservando a identidade original (F-71), e um documento rejeitado é
gerado de novo com a mesma numeração e série (F-71) — logo "quem assinou o quê, quando e com qual
vigência" **não é dedutível do documento**. Sem essa trilha, revogar (`RN-EMI-037`) e responder ao
emitente sobre uso indevido (`RN-EMI-038`) são conversas sem prova.
**Aceite** para qualquer documento é possível dizer quantos atos de assinatura existiram, quando, por
quem e com qual ativo; o registro é append-only (correção é registro novo referenciando o anterior,
`RN-FIS-006`); nenhum campo dele contém valor de segredo; e ele acompanha a minimização de dado de pessoa
(`RN-EMI-017`) — a trilha é do ato, não do comprador.
**Infeliz** o ato aconteceu sem contato → o registro nasce no ponto de emissão, com o instante do fato
(`RN-OFF-019`), e drena como o documento (`RN-EMI-028`, `RN-OFF-010`); ato que chega ao servidor **sem**
registro correspondente é achado, escalado ao dono da fila (`RN-OFF-011`) e ao responsável do
estabelecimento — nunca aceito em silêncio por ter assinatura válida.

### RN-EMI-036 — Conceder, renovar, ampliar ou revogar a capacidade de assinar é operação de papel nomeado; assinar dentro do fluxo de venda decorre da capacidade já concedida

**Enunciado** duas classes, e a distinção é o que impede a regra de parar o caixa: **(1) atos sobre a
capacidade** — conceder, renovar, ampliar escopo, revogar, encerrar (`RN-EMI-037`, `RN-EMI-038`) — exigem
**papel nomeado** e ficam na trilha; **(2) o ato de assinar dentro do fluxo de venda** decorre da
capacidade já concedida e **não** pede autorização por documento. Fora do fluxo de venda, cada ato de
assinatura volta a exigir papel nomeado: pedido de inutilização de faixa (F-56), cancelamento e
cancelamento por substituição (F-75), retransmissão em massa, reemissão de pendente antigo.
**Motivo** usar o poder de assinar em nome do emitente é o ato de maior consequência do módulo, e hoje
ele apareceria como ato interno do sistema — sem autor, sem papel, sem recusa possível. Mas pedir
autorização por documento no caixa é parar o caixa (`PN-01`, `RN-EMI-001`), então a autorização é da
**capacidade**, não do documento; o que sai do fluxo de venda não tem essa pressa e volta a ser
autorizado ato por ato.
**Aceite** nenhum caminho concede ou renova capacidade sem papel nomeado registrado; o fluxo de venda
assina sem interrupção enquanto a capacidade vale; toda operação de assinatura fora do fluxo de venda
recusa quando não há papel válido (`RN-OFF-024` para papel retido) e o pedido fica pendente, nomeado.
**Infeliz** o cliente não tem **ninguém** portando o papel — que é `fiscal_officer`, com célula `R`
(`matriz-operacao-papel-modulos.md` §5), e ninguém o porta naquele estabelecimento (`RN-NUC-020`) → as
operações fora do fluxo de venda **não acontecem** (falha fechado), pendentes com o motivo "ninguém porta
o papel"; a emissão corrente continua, e o produto **não** se autoconcede o papel. **Corrigido em
2026-08-23:** dizia "não tem papel definido (D-03 ABERTA)" — o papel está definido desde `RN-NUC-019`; de
D-03 é **como** ele prova identidade.

### RN-EMI-037 — Revogar ou trocar a capacidade tem efeito imediato em todo ponto de emissão alcançável; o que não é alcançado expira sozinho, e a janela de exposição é declarada

**Enunciado** revogação é evento datado com efeito **imediato** em todo ponto de emissão e em toda cópia
retida da capacidade. Ponto de emissão alcançável para de assinar no instante da revogação; ponto de
emissão **sem contato** para quando a capacidade vence (`RN-EMI-033`, prazo) e, ao reconectar, verifica
capacidade e revogação **antes** de qualquer novo ato de assinatura. A janela de exposição é, por
construção, o prazo **restante** da capacidade — e é declarada ao cliente, não escondida.
**Motivo** `RN-EMI-005` cobre o **documento** ("já assinado não é reassinado"); não cobre **quem retém o
poder de assinar**. E terminal sem rede não recebe revogação: é isso, e só isso, que justifica o prazo
curto de `RN-EMI-033` — sem prazo, a revogação seria promessa que a física do offline não cumpre.
**Aceite** revogar produz: instante declarado, lista de pontos de emissão que confirmaram, lista dos que
**não** foram alcançados com o último contato de cada um e o prazo restante da capacidade de cada um, e a
faixa de numeração que cada um retém (`RN-OFF-006`); nenhum ponto de emissão alcançável assina depois do
instante; documento já assinado segue íntegro (`RN-EMI-005`).
**Infeliz** a revogação é urgente e um ponto de emissão está sem contato → o produto **declara** o que
não alcançou, com desde quando, para que a decisão de encerrar a faixa (`RN-EMI-038`) seja tomada com o
dado à vista; nunca apresenta "revogado" como se todos tivessem recebido, e nunca conta como zero o que
não sabe (`RN-OFF-016`).

### RN-EMI-038 — Furto, perda ou destruição de ponto de emissão é evento de comprometimento, não só de perda: revoga a capacidade, encerra a faixa e é notificado ao cliente

**Enunciado** registrar que um ponto de emissão foi furtado, perdido ou destruído dispara, em **um** ato:
(a) revogação da capacidade daquele ponto (`RN-EMI-037`); (b) **encerramento** da faixa que ele retinha,
com desfecho por número não usado (`RN-EMI-022`, `RN-OFF-006` infeliz (c)); (c) **notificação ao cliente**
com o que estava retido, o que pode ter sido emitido e **as duas janelas** — até quando a capacidade de
assinar valia (`RN-EMI-033`) **e** até quando o terminal ainda **vende**, prazo próprio da habilitação
(`RN-OFF-032`i, `LACUNA-OFF-017`); (d) item na lista do dono da fila (`RN-OFF-011`, `RN-OFF-012`). A perda
da **fila** segue `RN-OFF-016`: mesmo evento, duas consequências, nenhuma no lugar da outra.
**Motivo** correção de defeito declarado: `RN-OFF-016` tratava terminal roubado apenas como **contagem de
venda perdida**. Com `RN-EMI-033`, o furto leva também a capacidade de assinar não vencida e a faixa
restante — emitir em nome do emitente, ocupando número que ele terá de justificar (F-35), sob a
responsabilidade legal e tributária dele (F-39): perda de dado e comprometimento de poder são eventos
diferentes. **A segunda janela entrou em 2026-08-23 (`AUT-16`):** a primeira diz até quando o dispositivo
**emite**; só a segunda diz até quando ele **vende** — o intervalo em que há via saindo no nome dele.
**Aceite** o evento é registrável por papel nomeado (`RN-EMI-036`) em um passo, e produz as quatro
consequências de forma verificável: capacidade revogada, faixa encerrada com desfecho por número, registro
da notificação com data **e com as duas janelas datadas**, item na lista de trabalho. Nada disso depende
de o terminal responder.
**Infeliz** o terminal reaparece → a capacidade encerrada **não** é reativada e a faixa encerrada **não**
é reaberta: o ponto de emissão é rehabilitado como novo, com faixa nova. Documento que ele tenha assinado
no intervalo é fato a apurar com o responsável e o contador (`RN-FIS-006`, `RN-EMI-031`) — nunca aceito
só porque a assinatura era válida, nunca apagado.

## 3. Escopo do que sai — exportação, apresentação e consolidado

### RN-EMI-039 — Exportar, consultar e apresentar documento é escopado ao estabelecimento; nenhuma superfície nossa é caminho de enumeração

**Enunciado** toda superfície que devolve documento — consulta, reimpressão, exportação, apresentação ao
fisco, entrega ao contador — resolve o estabelecimento a partir de **quem está autenticado** e do
registro da plataforma, nunca de identificador informado no pedido. Consolidar entre estabelecimentos
**do mesmo cliente** é ato declarado, com registro do que saiu — e **o papel que o pratica não está
decidido: é `LACUNA-NUC-019`**, logo a operação é hoje **negada a todos** (`RN-NUC-026`). Entre
clientes, **nunca** (`RN-EMI-040`).

**Correção de 2026-08-23 (`AUT-08`).** Até esta data o enunciado dizia "com papel nomeado
(`RN-EMI-036`)" — a regra do `fiscal_officer`, papel de escopo **estabelecimento** cujo objeto é o poder
de assinar, não a contabilidade —, enquanto a célula correspondente nega por omissão. Quem
implementasse a partir deste arquivo construiria a consolidação sem nunca ler a célula, e o desfecho é
travessia entre pessoas jurídicas de um mesmo cliente. `RN-NUC-039` decide a precedência (**vence a
célula**) e exige, em (c), que a `RN` cite a linha e o valor **ou marque a lacuna**: é o que este
enunciado passa a fazer. Fechada `LACUNA-NUC-019`, a concessão nasce na célula e este texto cita a linha.
**Motivo** `RN-EMI-017` exige que o documento seja recuperável e apresentável pelo cliente **sem depender
de nós** (F-64) — capacidade legítima e necessária numa fiscalização, que não se recusa. Mas
"recuperável" sem escopo declarado é lista de documentos para quem pedir, e documento fiscal carrega
valor, itens e, quando a entrega o exigiu, identificação do comprador (`RN-EMI-017`).
**Aceite** pedido cujo documento não pertence ao escopo autenticado é recusado com resposta que **não
revela existência** (mesmo texto para "não existe" e "não é seu"); nenhuma superfície nossa permite varrer
número, faixa ou chave de acesso para descobrir documento — a consulta pública do consumidor pela chave é
do fisco (F-69), não superfície nossa; toda exportação registra quem pediu, o escopo e o volume. E o
pedido de consolidação entre estabelecimentos do mesmo cliente é **recusado citando a célula** (`?`,
`LACUNA-NUC-019`), nunca autorizado por esta prosa.
**Infeliz** o cliente precisa entregar o acervo inteiro ao contador → existe exportação declarada, por
estabelecimento e período, com registro, praticada pelo papel que a **célula** declarar; enquanto
`LACUNA-NUC-019` estiver aberta a capacidade não existe e o caminho é fechá-la, nunca acesso amplo
"porque é do mesmo grupo", e nunca por identificador colado no pedido.

### RN-EMI-040 — Contagem que só existe somando clientes vive fora do escopo de qualquer cliente, e nenhuma superfície de cliente a alcança

**Enunciado** os consolidados que atravessam clientes — quantas habilitações existem e quantas cabem por
UF (`RN-EMI-013`), uso agregado de contingência para efeito de operação nossa (`RN-EMI-032`) — são dado
**nosso**, de operação da plataforma, com papel nosso. Nenhuma tela, exportação, relatório, contagem ou
mensagem endereçada a um cliente devolve valor que dependa de outro cliente, e nenhuma consulta feita no
escopo de um cliente atravessa esse escopo para computá-lo.
**Motivo** o consolidado por UF não é escolha nossa: ele existe porque a norma impõe teto de **5 códigos
de responsável técnico por UF para a desenvolvedora** (F-40) — e esse número só se conhece somando
clientes. Expor "quantas habilitações cabem nesta UF" a um cliente responde, na prática, "quantos
concorrentes já estão aqui": é vazamento entre clientes por agregado, que sobrevive a schema correto.
**Aceite** o aceite de `RN-EMI-013` ("o produto sabe dizer, por UF, quantas habilitações existem, quantas
cabem e o que falta") é resposta **nossa**, para papel nosso; o que o cliente vê é apenas o dele — as
habilitações **dele**, o que falta **nele**; nenhum caminho de cliente lê ou agrega estabelecimento de
outro cliente, em nenhuma superfície, inclusive relatório e exportação.
**Infeliz** o cliente pergunta se cabe habilitação na UF dele → responde-se **sim ou não, com o efeito**,
sem número que revele terceiro; a decisão comercial é do humano (`RN-EMI-013`, infeliz).

### RN-EMI-041 — Segredo cujo alcance é mais de um cliente é declarado como compartilhado, com o efeito do comprometimento em N clientes

**Enunciado** todo segredo de emissão é declarado com **alcance**, além de responsável e vigência
(`RN-EMI-007`): um estabelecimento, um cliente, ou **N clientes**. Segredo de alcance N clientes declara
também quem pode usá-lo, como se rotaciona, e o que acontece com **cada** cliente afetado na rotação e no
comprometimento.
**Motivo** `RN-EMI-007` descreve segredo "por cliente e por UF", e há um candidato que pode não caber
nisso: se o código de responsável técnico for **por desenvolvedora** (F-40, `LACUNA-EMI-005`), ele é o
único ativo deste produto cujo comprometimento atinge **todos** os clientes daquela UF ao mesmo tempo —
um incidente, N emitentes. Declarar o alcance é o que faz a diferença aparecer antes do incidente.
**Aceite** enquanto `LACUNA-EMI-005` estiver aberta, o código de responsável técnico é tratado como de
**alcance desconhecido**: nenhuma habilitação de UF que o exija é fechada sem decisão do humano, e o
alcance consta na lista de `RN-EMI-007`; confirmado que é por desenvolvedora, o plano de rotação e o
efeito por cliente são requisito **antes do segundo cliente** naquela UF, não depois do incidente.
**Infeliz** a UF exige o código **e** exige o hash dele no documento (F-40) **e** o cliente opera
contingência off-line → a capacidade de `RN-EMI-033` naquele ponto de emissão passaria a abranger um
segredo de alcance N clientes, o que amplia o efeito de `RN-EMI-038` de um cliente para todos os da UF.
**Isso não é decisão minha:** fica declarado como consequência a resolver com o humano **antes** de
habilitar UF que exija o código (`LACUNA-EMI-005`, `LACUNA-EMI-016`), e até lá nenhuma UF nessa condição
é habilitada com contingência off-line.

## 4. Acréscimo ao contrato de `EMI`

Não substitui `modulos/fiscal.md` §3.1 nem `fiscal-emissao-propria.md` §6 — acrescenta. **Expõe também**
o lugar declarado do ato de assinar por ponto de emissão (`RN-EMI-033`) · estado e prazo restante da
capacidade por ponto de emissão · contagem de atos de assinatura por ponto de emissão e por operador
(`RN-EMI-035`) · pontos de emissão não alcançados por uma revogação (`RN-EMI-037`) · alcance declarado de
cada segredo (`RN-EMI-041`). **Exige também do cliente** o lugar do ato de assinar declarado na
habilitação · papel nomeado para atos sobre a capacidade (`RN-EMI-036`, **D-03**) · registro de furto,
perda ou destruição de ponto de emissão como evento (`RN-EMI-038`). **Sensível também** a trilha de atos
de assinatura (`RN-EMI-035`) e a lista de pontos de emissão com capacidade viva.

## Fontes

Este arquivo **não tabula fonte**: F-35 a F-48, F-57 a F-63 e F-66 estão em `fiscal-emissao-propria.md`;
F-49 a F-56, F-64, F-65 e F-67 a F-75 em `fiscal-emissao-contingencia.md`; F-01 a F-34 nos dois arquivos
de `FIS`. Fato de emissão que não esteja tabulado em um desses **não existe** nas specs de `EMI`.

## Lacunas

`LACUNA-EMI-001` a `003` vieram de `fiscal-emissao-propria.md` §1 com as regras; `014` a `016` nascem
aqui. As demais estão nos arquivos irmãos.

- **`LACUNA-EMI-001`** (§1) — instrumento e responsabilidade da custódia de credencial de terceiro. Não
  muda o fluxo; muda o que assinamos com o cliente e o que `seguranca` exigirá. Agora também alcança a
  **capacidade** de `RN-EMI-033`: guardar credencial e conceder poder de assinar a um terminal do cliente
  podem ter instrumentos diferentes. **Responde:** humano / jurídico.
- **`LACUNA-EMI-002`** (`RN-EMI-007`) — ciclo de vida do código de segurança do contribuinte: quem
  emite, validade, rotação, revogação, efeito sobre documentos já emitidos. **Nenhuma** fonte oficial
  aberta descreve. **Responde:** humano / SEFAZ da UF.
- **`LACUNA-EMI-003`** (§1, PAA) — o público-alvo declarado alcança o regime regular? A homologação pelo
  ENCAT recai sobre a desenvolvedora ou sobre o provedor? **Fecha parcialmente `LACUNA-FIS-010`**.
  **Responde:** humano.
- **`LACUNA-EMI-014`** (`RN-EMI-033`, `RN-EMI-037`) — **por quanto tempo** a capacidade de assinar vale
  no ponto de emissão sem contato, e qual o escopo máximo admissível (um turno? uma faixa? um dia de
  operação?). É o número que **define a janela de exposição** de um terminal furtado e o número que
  define quantas vezes por dia o cliente reautentica: as duas pontas são custo real, e nenhuma medida
  existe. **Não escrevo o número.** **Responde:** humano, com `seguranca` (risco) e `performance` (custo
  de renovar em N terminais). Unidade declarada; valor não.
- **`LACUNA-EMI-015`** (`RN-EMI-036`) — **reduzida em 2026-08-23** (divergência inversa): ela dizia que
  estas operações "falham fechado", e as células das duas dão **`R` a `fiscal_officer`**
  (`matriz-operacao-papel-modulos.md` §5) — a célula vence a prosa (`RN-NUC-039`), logo elas **são**
  autorizadas, e a metade de **papel** nunca foi D-03: é a prova de existência do papel (`RN-NUC-019`).
  **Segue aberto** o que é de **D-03** — **como** ele prova identidade para exercê-las. **Responde:**
  humano; se a intenção era a operação ficar indecisa, o conserto é a **célula**, não esta prosa.
- **`LACUNA-EMI-016`** (`RN-EMI-033`) — **o que exatamente** a norma exige estar disponível no ponto de
  emissão para o documento sair completo em contingência? Sabemos de dois itens nomeados nas fontes (o
  que compõe o código bidimensional, F-38; o hash do código de responsável técnico onde a UF o exige,
  F-40), mas a especificação **não foi lida integralmente** (`LACUNA-EMI-009`) e **nenhuma regra aqui
  afirma qual campo existe**. Consequência: o escopo da capacidade de `RN-EMI-033` é declarado por
  função ("o que a norma exige para o documento sair completo"), não por lista. **Responde:** nova
  pesquisa antes da Fase 1.

## PERGUNTAS: para humano

1. **Custódia — sob que instrumento?** (`LACUNA-EMI-001`.) Guardar credencial de assinatura de N
   clientes é decisão tomada; o que não existe é o instrumento que diz o que assumimos se ela for usada
   indevidamente. É contrato, não código, e precisa existir **antes** do primeiro cliente. Com
   `RN-EMI-033`, a pergunta ganhou uma segunda metade: e quando o poder de assinar está num terminal
   **do cliente**, de quem é a responsabilidade pelo que sair dele durante a janela de `LACUNA-EMI-014`?
2. **Janela de aviso de vencimento** (`RN-EMI-004`): com quanta antecedência avisar, e **quem** é
   avisado (dono, gerente, contador)? Não inventei número. Ligada à pergunta sobre o **tipo** de
   credencial dos clientes-alvo — o tipo decide se o vencimento é anual e se a assinatura pode acontecer
   em qualquer terminal (F-37), o que decide a contingência (`RN-EMI-027`).
3. **Prazo e escopo da capacidade de assinar** (`LACUNA-EMI-014`), e **como** quem porta o papel prova
   identidade para exercê-la (`LACUNA-EMI-015`, D-03). Sem o prazo, "revogável com efeito imediato" não
   vale para terminal sem rede; **quem** revoga já está respondido — `fiscal_officer`, célula `R`. Falta
   confirmar a linha 34 (registrar furto: `manager`, `owner` e `fiscal_officer`, todos `R`).

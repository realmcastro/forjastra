# Operação offline e sincronização — contrato transversal

> **Piso, não teto.** Módulo pode ser **mais restritivo** que isto — nunca mais permissivo. Módulo que precise ser mais permissivo declara `supera: [[operacao-offline]]` na própria spec, com motivo e custo: a exceção fica visível em vez de silenciosa.
>
> **`OFF` não é módulo ativável.** Não está no catálogo, não tem "comportamento desligado", ninguém "liga o offline". É contrato transversal: vale para o núcleo e para todo módulo, ativo ou não.
>
> **Três arquivos irmãos, com o mesmo peso normativo** (os dois primeiros abertos em 2026-08-22, o
> terceiro nascido da partição de 2026-08-23):
> `fila-local-conteudo-e-repouso.md` (`RN-OFF-021` a `RN-OFF-023` e `RN-OFF-027` — confidencialidade em
> repouso, saída do item confirmado, a lista fechada do que a fila nunca contém, texto opaco),
> `fila-local-autoridade-e-identidade.md` (`RN-OFF-024` a `RN-OFF-026`, `RN-OFF-032`, `RN-OFF-033` —
> papel retido, exceção de teto, transferência escopada, ato ordinário, meio de identificação retido e a
> habilitação a vender do terminal) e `offline-grandezas-e-orcamento.md` (`RN-OFF-028` a `RN-OFF-031` — valor operacional é
> configuração por cliente, grandezas com unidade e sem valor, orçamento do caixa medido sob drenagem,
> grandeza de plataforma). Regra deste arquivo corrigida por eles é corrigida **aqui**, no lugar, e a
> correção aparece na própria regra.
>
> **Dono de duas coisas, e só duas:** a **lei de convergência** (§3) e a **tabela de classificação** (§4). Comportamento concreto continua na spec do módulo, e cada célula da tabela **cita a `RN`** que a rege; célula sem `RN` para citar é **lacuna declarada** (§8), nunca prosa nova aqui. É assim que este arquivo cobra em vez de duplicar.
>
> **Nenhum número.** Tamanho de fila, lote, espera, tentativa, duração: cada um é `LACUNA-OFF-nnn` com dono. Número não medido em spec de produto vira orçamento por acidente.
>
> As `RN-OFF-nnn` estão agrupadas **por tema**, não em ordem numérica (a numeração é imutável — `glossario.md` §4.2). Cenário que não exercita nenhuma `RN` é defeito, não ilustração.
>
> Escrito **contra caso de uso** (§7), porque foi como o pedido chegou: *"faltou internet, mas não podemos deixar de vender"*.

## 1. Os três domínios de falha — não existe "offline"

| # | Domínio | Vivo | Morto |
|---|---|---|---|
| **D1** | **Link de internet caiu, LAN viva** | terminal, LAN, outro terminal do estabelecimento, ponto de produção, impressora local | servidor, autorizador fiscal, adquirente, canal externo |
| **D2** | **Terminal isolado**, sem LAN | só o próprio terminal e o que ele retém | estado compartilhado entre terminais, ponto de produção, impressora de rede |
| **D3** | **Rede boa, serviço externo fora** | tudo, inclusive o servidor | autorização de terceiro: autorizador fiscal, adquirente, serviço remoto |

Três consequências que uma faixa única esconderia: **D1 não é degradação para todos** — `COZ` opera **integralmente** ali, porque lançar, rotear, imprimir e avançar etapa acontecem na LAN (`RN-COZ-008`); chamar isso de degradado seria falso a favor do produto. **D2 é onde `MSA` morde** — perder a LAN é perder o estado compartilhado, e é a exclusividade de fechamento (`RN-MSA-008`) que `RN-MSA-011` declara como o requisito mais duro do módulo. **D3 é o que mais se confunde com "internet caiu"** — o terminal está conectado, o servidor responde, e a operação ainda assim não obtém autorização (`EMI`, adquirente); a causa é outra, logo a resposta ao operador é outra.

### RN-OFF-001 — Toda regra de continuidade declara em qual domínio vale

**Enunciado** nenhuma regra, tabela ou cenário deste produto usa "offline", "sem rede" ou "fora do ar" sem dizer se fala de **D1**, **D2**, **D3** ou de uma combinação.
**Motivo** a mesma operação tem três desfechos; sem o domínio, "funciona offline" não é testável e o aceite não sabe o que cortar.
**Aceite** cortar só o link (D1), só a LAN (D2) e só o serviço externo (D3) são **três** ensaios distintos, e cada regra citada na §4 diz o que faz em cada um.
**Infeliz** regra herdada sem domínio declarado → lida como valendo **apenas D1**, o caso mais brando, e a falta é lacuna do módulo dono; nunca estendida a D2/D3 por generosidade.

### RN-OFF-002 — Por domínio, o desfecho é um de três, e só três

**Enunciado** para cada operação e cada domínio o desfecho é **opera integralmente**, **opera degradado com fila** ou **recusa dizendo por quê**; "degradado" exige nomear o que fica pendente.
**Motivo** o quarto desfecho de fato é "trava sem explicar", que é o PDV recusado por `PN-01`; e degradado sem pendência nomeada é dado perdido com aparência de sucesso.
**Aceite** toda célula da §4 tem um dos três valores; nenhuma diz "depende", "parcial" ou fica vazia.
**Infeliz** o desfecho real não cabe nos três (a operação começa e não termina) → é defeito de spec do módulo, não desfecho novo: a operação é partida em duas, cada uma com o seu.

## 2. A unidade de classificação é a operação, não o módulo

`MSA` prova por que: **lançar item** opera com o link caído e converge sozinho; **transferir consumo** não opera e é recusado — as duas no mesmo módulo, na mesma regra (`RN-MSA-011`). Módulo classificado numa faixa única mente sobre metade dele.

### RN-OFF-003 — Classificação é por caso de uso; a linha do módulo é resumo derivado

**Enunciado** a unidade classificada é a **operação** (caso de uso nomeado na spec do módulo); nenhuma decisão de produto, contrato ou construção se apoia em classificação de módulo inteiro.
**Motivo** é o erro mais fácil e o mais caro: faixa por módulo faz o construtor tratar transferência como lançamento, e o defeito aparece como item que some ou cobrança dobrada.
**Aceite** na §4 cada linha é uma operação; `MSA` aparece em três linhas com classes diferentes, e nenhuma linha diz "`MSA`: aditivo".
**Infeliz** módulo cuja spec só declara comportamento agregado → suas operações caem no default de `RN-OFF-008` até serem classificadas uma a uma.

## 3. Lei de convergência — as quatro classes

Generalização de precedente que já existe: `RN-MSA-008` (uma cobrança por consumo, mesmo com resposta perdida) e `RN-MSA-011` (aditivo converge, não-aditivo é recusado) foram escritas para consumo em aberto. A lei abaixo é a mesma coisa sem o módulo — `MSA` é a **instância que a originou**, não a dona dela.

### RN-OFF-004 — Classe 1, aditivo: enfileira, reenvia, e a ordem entre irmãos não importa

**Enunciado** operação **aditiva** — acrescenta fato sem depender do estado que outro produziu — opera integralmente offline, é enfileirada e reenviada, e converge sem árbitro: dois terminais offline acrescentando ao mesmo agregado produzem os dois fatos, em qualquer ordem de chegada.
**Motivo** é o que sustenta *"não podemos deixar de vender"*: a maior parte do volume do caixa é aditiva, e aditivo não precisa de decisão nenhuma para convergir.
**Aceite** dois terminais em D1 acrescentam ao mesmo agregado; ao restabelecer existem os dois fatos, nenhum duplicado (`RN-OFF-013`), e trocar a ordem de chegada não muda o resultado.
**Infeliz** parecia aditiva mas o resultado depende da ordem (o segundo fato só vale se o primeiro existir) → não é classe 1: é classe 2, e a ordem é tratada por `RN-OFF-010`.

### RN-OFF-005 — Classe 2, não-aditivo: recusa, e a recusa fala com quem opera

**Enunciado** operação que exige estado **confirmado** por outro terminal ou pelo servidor é **recusada** enquanto esse estado não está confirmado; a recusa apresenta o último estado conhecido **com o instante dele**, em linguagem de operação, e deixa a decisão com quem opera.
**Motivo** aceitar e "resolver depois" é escolher entre dois fatos incompatíveis sem ninguém olhando — em consumo em aberto isso é item perdido ou cobrança dobrada (`RN-MSA-011`, infeliz).
**Aceite** transferir consumo em D2 é recusado com "este dispositivo está sem contato com os outros desde HH:MM; o último estado que ele conhece é X" — não com código de erro, não com "tente novamente".
**Infeliz** a operação é urgente para quem opera → o produto oferece o caminho **aditivo** equivalente quando existe (fato novo em vez de alteração do anterior) e, quando não existe, diz o que falta acontecer. Nunca contorna a recusa aceitando o não-aditivo.

### RN-OFF-006 — Classe 3, recurso único ou escasso: faixa pré-alocada enquanto há conexão

**Enunciado** operação que **aloca recurso único ou escasso** não converge e **não pode simplesmente recusar**, porque recusar aqui é parar o caixa. E o recurso tem **duas naturezas**, com mecanismos diferentes — a distinção foi escrita em 2026-08-23, porque a regra descrevia as duas e nomeava o mecanismo de uma só: **(1) escasso e enumerável**, alocado de um espaço compartilhado entre terminais — número de documento fiscal, número de pedido, senha, reserva: exige **faixa pré-alocada por terminal**, obtida enquanto há conexão e consumida offline sem consultar ninguém; **(2) único e local**, exclusivo do posto e não enumerável — a **gaveta** é o exemplo, e é o único no núcleo hoje: não há faixa a alocar e não há espaço compartilhado a colidir, então ele **não** entra no mecanismo (1) e é classe **1** na tabela §4, pelo que `RN-NUC-012` decide (a) e (b). É requisito; o mecanismo de (1) é da Fase 1 (`LACUNA-OFF-003`).
**Motivo** dois terminais offline alocando do mesmo espaço colidem, e nenhuma regra de convergência resolve isso depois: número de documento fiscal é sequencial por estabelecimento e por série (`RN-EMI-022`), e número repetido não é conflito de dado — é declaração falsa.
**Aceite** dois terminais entram em D1 com faixas disjuntas, concluem vendas consumindo a própria faixa, e ao voltar nenhum identificador foi alocado duas vezes; a faixa de cada terminal é consultável, com o consumido e o restante. **Para o recurso do tipo (2), o aceite é outro e é o que separa os dois:** dois terminais do mesmo posto, em D1, acionam a gaveta — nenhum dos dois consulta faixa, nenhum dos dois recusa por esgotamento, e o que existe é o desfecho da tentativa física (`RN-PER-004`) mais a divergência de conferência, quando houver (`RN-NUC-012`, infeliz a).
**Infeliz** três desfechos que **têm** de estar declarados, e são o que separa esta classe de um desejo: (a) **a faixa acaba offline** → a operação que depende dela deixa de acontecer, mas a **venda continua** (`RN-EMI-016`, `RN-EMI-001`) e o que faltou é pendência nomeada com efeito declarado, no mesmo tratamento de modalidade de contingência ausente (`RN-EMI-025`) — nunca identificador inventado, nunca reuso (`RN-EMI-022`); (b) **o terminal volta com faixa não usada** → o não usado tem desfecho explícito e datado, e no caso fiscal o desfecho é o de `RN-EMI-022`; (c) **o terminal é descomissionado com faixa não usada** → a faixa é encerrada por ação declarada, com autor e instante, e o que ela continha entra na fila (§5). Falta regra de módulo para citar em algum dos três? É lacuna, não improviso.

### RN-OFF-007 — Classe 4, autoridade: nunca enfileira, e falha fechado

**Enunciado** **nenhuma** decisão de autoridade é enfileirada, presumida ou concedida offline: autorização de papel, autorização de cartão pelo adquirente, desconto acima do limite, mudança de preço, catálogo, configuração, classificação tributária ou regra fiscal. Ausência de autoridade é **negação**, não espera.
**Motivo** enfileirar autoridade é autorizar sem autorizador e conferir quando o dinheiro já saiu. `PN-11`, `PN-13`, `PN-16` e `RN-RES-002` são a mesma frase aplicada a alvos diferentes.
**Aceite** em D1, D2 e D3: desconto acima do limite é negado, pagamento que exige adquirente não conclui como pago, alteração de preço ou de classificação não acontece — e nenhuma das três produz item de fila. O que o terminal já recebeu e retém como **artefato publicado** (preço com vigência, limite por papel, encargo configurado) **continua valendo**: é dado publicado, não decisão nova (`RN-OFF-020`).
**Correção de 2026-08-22:** o **papel de quem autenticou** estava nesta lista e **não pertence a ela** — papel retido é **autoridade**, não dado publicado, e tem validade declarada, revogação na reconexão e recusa até **reconectar** (`RN-OFF-024`b; reautenticar sem contato não existe — `RN-OFF-033`). A confusão entre os dois é o que fazia esta regra contradizer o caminho infeliz de `RN-OFF-014`.
**Correção de 2026-08-23:** **identificar** quem pratica o fato não é **autorizar** o ato, e o **ato ordinário** de venda depende só da primeira — logo ele **não** cai nesta regra e não para quando a validade da autoridade retida vence (`RN-OFF-032`, `RN-OFF-033`). Isto não afrouxa nada aqui: nenhuma **decisão** de autoridade passou a ser enfileirável, presumível ou concedível offline.
**Infeliz** o operador precisa da autorização para atender → o produto diz **qual** autoridade falta, por que ela não pode vir do terminal, e oferece o caminho que não a exige. Nunca "autorizado localmente, confirma depois".

### RN-OFF-008 — Operação sem classe declarada é classe 2

**Enunciado** operação ainda não classificada nas quatro classes é tratada como **classe 2 (recusa)** até ser classificada na spec do módulo dono.
**Motivo** o **catálogo de módulos** tem 31 entradas (`catalogo-de-modulos.md`, uma por cabeçalho de módulo — número reconferido em 2026-08-23, e ele **não** conta as linhas da §4, que são operações já classificadas) e classificar tudo hoje seria palpite; falhar fechado mantém a lacuna **visível** em vez de virar suposição otimista. Destravar uma operação recusada custa uma linha de spec; reconciliar dado divergente em N clientes não.
**Aceite** operação ausente da §4 é recusada em D1, D2 e D3 com "esta operação exige conexão", e a ausência aparece como **lacuna nomeada** — trabalho, não comportamento aprovado (`LACUNA-NUC-007` é o exemplo vivo; `LACUNA-OFF-001` foi o precedente, fechado em 2026-08-22).
**Infeliz** o default recusa algo que o negócio precisa offline → a correção é **classificar**, com `RN` do módulo e critério de aceite; nunca afrouxar o default.

### RN-OFF-009 — "Última escrita ganha" e resolução por relógio são recusadas

**Enunciado** nenhum conflito é resolvido por ordem de chegada, por relógio do terminal, por "o servidor tem razão" ou por descarte silencioso. Conflito de classe 1 não existe (converge); de classe 2 não acontece (foi recusado antes); de classe 3 é impedido pela faixa; de classe 4 não é conflito, é negação.
**Motivo** as quatro classes existem para que **não haja** conflito a resolver; onde aparece um, a classificação está errada — e "última escrita ganha" é a heurística que esconde esse erro, convertendo defeito de spec em dado perdido em produção.
**Aceite** nenhuma regra, tabela ou cenário deste produto contém desempate por horário ou por ordem de chegada; onde há duas versões de um fato, as duas são apresentadas a uma pessoa (`RN-COZ-008` e `cozinha.md` §5 são o precedente).
**Infeliz** apareceu conflito que nenhuma classe previu → é **achado**, escala para o dono do módulo, e até a reclassificação a operação cai no default de `RN-OFF-008`.

### RN-OFF-020 — Offline o terminal **aplica** artefato publicado e versionado; nunca **decide** valor

**Enunciado** compor valor devido offline é **aplicar** o que o backend já decidiu e publicou — preço com vigência, lista de preço, limite do papel, encargo configurado, versão de regra tributária — recebido enquanto havia conexão e retido no terminal; o fato concluído registra **qual versão de cada artefato** usou. O que exige **decisão nova** (preço fora do publicado, desconto acima do limite, regra ausente) não é composto localmente: cai em `RN-OFF-007` ou em pendência nomeada (`RN-FIS-011`, `RN-FIS-018`).
**Motivo** `PN-13` (quem calcula dinheiro é o backend) e `PN-01` (a venda fecha offline) parecem colidir e não colidem: a distinção é entre **decidir** e **aplicar**. O mecanismo já existe no fiscal — regra é **dado publicável com vigência** (`RN-FIS-009`) e o fato **congela a versão** que o produziu (`RN-FIS-004`, `RN-FIS-013`). Esta regra generaliza isso ao resto do valor e **não altera** `PN-13` nem `PN-01`: descreve a costura entre os dois.
**Aceite** em D1, D2 e D3 o terminal conclui a venda com total, desconto no limite, encargo e tributo compostos a partir de artefato publicado, e o fato guarda as versões usadas; nenhuma composição local produz valor que o backend não publicou antes.
**Infeliz** na sincronização o artefato atual do servidor **difere** do que o terminal usou → o fato **não é recalculado nem editado** (`PN-07`, `PN-08`, `RN-FIS-005`). Dois desfechos: (a) a versão usada **era** vigente no instante do fato → o fato prevalece e não há divergência a tratar; (b) **não era** (artefato velho no terminal, ou relógio divergente — `RN-OFF-019`) → o fato continua intacto, a divergência vira **pendência nomeada** para o dono da fila com o efeito financeiro declarado, e correção, se houver, é **fato novo** referenciando o original (`RN-FIS-006`). **Que artefato o núcleo publica: `RN-NUC-013`** (o conjunto é fechado, cada membro tem versão e vigência, e o fato congela a versão de cada um), quem publica: `RN-NUC-014`, e o terminal que estava offline durante a publicação: `RN-NUC-015` — `LACUNA-OFF-010` fechada em 2026-08-22.

## 4. Tabela de classificação

Uma linha por **operação**. `integral` = opera sem perda · `degradado` = opera e deixa pendência nomeada · `recusa` = não acontece, e diz por quê. A última coluna é o que **rege** a célula: sem ela a linha é lacuna, não regra.

| Operação | Módulo | D1 | D2 | D3 | Classe | Regida por |
|---|---|---|---|---|---|---|
| Abrir pedido, lançar item, corrigir pedido em construção | núcleo | integral | integral | integral | 1 | `RN-NUC-001`, `RN-NUC-002` |
| Compor o valor devido: preço, desconto no limite, encargo, tributo | núcleo + `FIS` | integral | integral | integral | 1 (aplica) | `RN-OFF-020`, `RN-NUC-006`, `RN-NUC-013`, `RN-FIS-004`, `RN-FIS-013` |
| Concluir venda com pagamento em espécie | núcleo | integral | integral | integral | 1 + 3 | `RN-NUC-003`, `RN-NUC-004` |
| Concluir venda com pagamento que exige adquirente | núcleo | recusa | recusa | recusa | 4 | `RN-NUC-005` |
| Aplicar desconto acima do limite do papel | núcleo | recusa | recusa | recusa | 4 | `RN-NUC-007` (**dentro** do limite: `RN-NUC-006`, integral) |
| Alterar preço, catálogo, papel ou configuração — **publicar** | núcleo | recusa | recusa | recusa | 4 | `RN-NUC-014`, `RN-NUC-015` |
| Cancelar ou devolver venda concluída | núcleo + `FIS` | recusa | recusa | recusa | 4 | `RN-NUC-008`, `RN-FIS-006`, `RN-EMI-021`, `RN-EMI-029` |
| Sangria e suprimento | núcleo | degradado | degradado | degradado | 1 no fato + 4 na autoridade | `RN-NUC-011`, `RN-OFF-024` |
| Abrir gaveta como consequência de venda em espécie no próprio terminal | núcleo | integral | integral | integral | 1 | `RN-NUC-012` (a) |
| Abrir gaveta fora de venda | núcleo | degradado | degradado | degradado | 1 no fato + 4 na autoridade | `RN-NUC-012` (b), `RN-OFF-024` |
| Abrir sessão de caixa | núcleo | integral | integral | integral | 1 | `RN-NUC-009` |
| Fechar sessão de caixa | núcleo | degradado | degradado | degradado | 1 | `RN-NUC-010` |
| Fechar **o dia** do estabelecimento | núcleo | degradado | **recusa** | degradado | 1 no fato + 2 na precondição | `RN-NUC-031` |
| Abrir consumo, lançar, consultar, conferir | `MSA` | integral | integral | integral | 1 | `RN-MSA-011`, `RN-MSA-004` |
| Transferir, juntar, separar, retirar item | `MSA` | recusa | recusa | integral | 2 | `RN-MSA-011`, `RN-MSA-005`, `RN-MSA-006` |
| Fechar consumo (uma cobrança, uma vez) | `MSA` | recusa | recusa | integral | 2 | `RN-MSA-008`, `RN-MSA-011` |
| Emitir e rotear trabalho ao ponto de produção | `COZ` | integral | degradado | integral | 1 | `RN-COZ-008`, `RN-COZ-009` |
| Avançar etapa no ponto de produção | `COZ` | integral | degradado | integral | 1 | `RN-COZ-008`, `cozinha.md` §5 |
| Encerrar trabalho sem produzir, reordenar fila | `COZ` | integral | recusa | integral | 4 | `RN-COZ-012` |
| Cliente-final lança pelo próprio dispositivo | `PCF` | recusa | recusa | recusa | 2 | `RN-PCF-010`, `RN-PCF-006` |
| Aceitação automática de pedido externo | `PCF` | recusa | recusa | recusa | 4 | `RN-PCF-008` |
| Atendimento por IA (qualquer interlocutor) | `ATI` | recusa | recusa | recusa | 4 | `RN-ATI-008`, `RN-ATI-001` |
| Tributar o fato gerador com a regra vigente | `FIS` | integral | integral | integral | 1 | `RN-FIS-013`, `RN-FIS-011`, `RN-FIS-018` |
| Resolver qual versão de regra vale | `FIS` | integral | integral | integral | 1 | `RN-FIS-008` + `LACUNA-OFF-006` |
| Emitir documento fiscal | `EMI` | contingência | contingência | contingência | regime próprio | `RN-EMI-024`, `RN-EMI-001`, `RN-EMI-016` |
| Consumir número de documento | `EMI` | integral | integral | integral | 3 | `RN-EMI-022`, `RN-EMI-023` + `LACUNA-OFF-002` |
| Transmitir pendente, drenar fila | `EMI` | degradado | degradado | degradado | regime próprio | `RN-EMI-028`, `RN-EMI-029`, `RN-EMI-030` |
| Executar qualquer classe de periférico em equipamento do **próprio posto** | `PER` | integral | integral | integral | 1 | `RN-PER-008`, `RN-PER-004`, `RN-PER-005` |
| Executar classe de periférico em destino alcançado pela **LAN** | `PER` | integral | **degradado** | integral | 1 | `RN-PER-008`, `RN-PER-007` |
| Registrar o **desfecho** da tentativa de periférico | `PER` | integral | integral | integral | 1 | `RN-PER-004` |
| Acionar compartimento de valor (gaveta) por `PER` | `PER` + núcleo | integral (a) · degradado (b) | idem | idem | 1 no fato + 4 na autoridade | `RN-NUC-012` (a) e (b), `RN-PER-003` |
| Ler código e **usar** a leitura | `PER` | integral | integral | integral | 1 | `RN-PER-013`, `RN-PER-014`, `RN-PER-015` |
| Entrega repetida de documento ou comprovante **já existente** | `PER` + núcleo | integral | integral | integral | 1 | `RN-PER-012`, `RN-NUC-032` |

**Atualizado em 2026-08-22 — o núcleo passou a ter regra numerada.** Onde havia sete células citando `LACUNA-OFF-001`, agora há `RN-NUC-001` a `RN-NUC-016` (`nucleo-venda.md`, `nucleo-caixa-e-turno.md`, `nucleo-publicacao-e-texto.md`). Três consequências que mudam o comportamento afirmado aqui, não só a citação:

1. **O caminho crítico do caixa deixou de ser recusa.** **Oito** das doze linhas do núcleo operam nos três domínios — cinco integral (abrir pedido/lançar item, compor valor, concluir em espécie, abrir gaveta por venda, abrir sessão) e três degradado com pendência nomeada (sangria e suprimento, abrir gaveta fora de venda, fechar sessão). Enquanto essas células caíam no default de `RN-OFF-008`, esta tabela afirmava o contrário de `PN-01` — e afirmava por **omissão**, que é o modo mais difícil de enxergar.
2. **Duas linhas herdadas eram uma célula para operações diferentes**, contra `RN-OFF-003`, e foram partidas: "sangria, suprimento, abrir gaveta" em três (`RN-NUC-011`, `RN-NUC-012` a e b) e "abrir e fechar sessão de caixa" em duas, porque abrir é aditivo e integral e fechar é degradado (`RN-NUC-009`, `RN-NUC-010`).
3. **As quatro recusas que restam são fundamentadas, não default.** Três recusam porque operar ali significaria **fabricar autoridade** que ninguém concedeu (`RN-OFF-007`): adquirente (`RN-NUC-005`), desconto acima do limite (`RN-NUC-007`) e publicação (`RN-NUC-014`) — e cada uma declara na própria regra a necessidade preservada e o caminho que a atende sem fabricá-la; as duas primeiras têm caminho alternativo, a terceira não tem nenhum, porque publicar **é** autoria. A quarta, cancelar ou devolver venda concluída (`RN-NUC-008`), recusa por outro motivo: a perna **documental** tem prazo legal e desfecho binário (`RN-EMI-024`), e o núcleo não promete correção cuja perna documental ele não consegue cumprir. Existe caminho aditivo para o erro do mesmo dia antes de o documento ser autorizado? `LACUNA-NUC-005`, do humano com o contador.

**Acrescentado em 2026-08-23 — as seis linhas de `PER`.** Elas **não** eram uma decisão pendente: `RN-PER-008` já classificava as seis operações por domínio, e esta tabela simplesmente não as tinha — logo, pelo default de `RN-OFF-008`, **toda** operação de periférico estava classificada como classe 2, recusa. Por escrito, o PDV offline não imprimia e não abria gaveta, o contrário de `PN-18` e de `RN-PER-005` ("nenhuma classe é pré-condição da conclusão da venda"). É o mesmo defeito por **omissão** que a nota de 2026-08-22 corrigiu para o núcleo, e a correção é a mesma: transcrever a classificação da regra dona, sem alterá-la. Duas leituras que as linhas obrigam a declarar: em **D2** a classe executada em destino de LAN é **degradada** e o trabalho fica **retido e retomável** (`RN-PER-007`), nunca perdido nem duplicado; e nenhuma das seis é `recusa` em nenhum domínio, porque periférico é o recurso mais **local** do produto — o que falha nele é a entrega, não a venda, e a perda é nomeada classe por classe (`RN-PER-005`).

**Acrescentado em 2026-08-23 — fechar o dia do estabelecimento.** Também não era decisão pendente: `RN-NUC-031` (`matriz-operacao-papel.md`) já classifica a operação por domínio, e esta tabela não a tinha — logo, pelo default de `RN-OFF-008`, fechar o dia estava recusado nos três domínios, que é metade de `LACUNA-NUC-007` e era contradição direta com `PN-01` (a padaria sem pendência alguma não fechava o dia porque o link caiu). A linha é **transcrição**, e nada aqui altera a regra dona. Duas leituras que ela obriga a declarar: **D2 é recusa sempre**, e não por autoridade — a lista de bloqueio depende de estado confirmado pelos outros postos e **não é computável a partir de um terminal isolado**; e a recusa quando a lista de bloqueio **tem** item é **precondição da regra** (`RN-NUC-031`, enunciado e aceite), não desfecho de domínio, distinção que importa porque `RN-OFF-002` proíbe célula que diga "depende". Em **D1** e **D3** o desfecho é degradado no sentido exato de `RN-OFF-002`: o fechamento é fato aditivo e imutável, fica pendente de sincronização, e as pendências informativas entram **declaradas item por item**.

O que **não** fechou: `RN-NUC-016` (texto guardado com origem declarada) não tem linha própria porque não é operação — é atributo das linhas de pedido, desconto e movimento de caixa, e sua faixa está declarada na regra (integral em D1, D2 e D3; classe 1). E **uma operação do núcleo continua ausente desta tabela** — **abertura e fechamento de turno** —, logo continua recusada pelo default de `RN-OFF-008`: é a metade que resta de `LACUNA-NUC-007` (`nucleo-venda.md` §6), a última contradição aberta com `PN-01`, e ela é dívida declarada, não desfecho aprovado. Ela **não** se fecha por transcrição, porque não existe regra dona: turno não tem nenhuma regra numerada, e o humano respondeu "não sei ainda" sobre turno ser ou não a sessão de caixa.

### RN-OFF-017 — Emissão fiscal não é "fila": é contingência, e tem casa própria

**Enunciado** documento fiscal **não** entra na fila genérica deste contrato. Emissão sem autorizador é **contingência**: regime declarado do ponto de emissão, com entrada e saída datadas, marcação no documento, prazo legal por tipo de documento e desfecho **binário**. A regra é `docs/produto/fiscal-emissao-contingencia.md`, `RN-EMI-017` a `RN-EMI-032`.
**Motivo** contingência tem obrigação legal, prazo em horas e forma própria; tratá-la como "nova tentativa" apaga tudo isso (`RN-EMI-024`).
**Aceite** nenhuma regra deste arquivo altera prazo, desfecho, numeração ou marcação de documento fiscal; onde os dois falam do mesmo objeto, vale `EMI`.
**Infeliz** um cenário deste arquivo parece contradizer `EMI` → é defeito **deste** arquivo, corrigido aqui, nunca em `EMI`.

## 5. A fila de pendências

`RN-EMI-028` já exige lista nomeada, ordenada por prazo, com marco e consequência por documento — e **nenhuma spec deste produto diz onde ela vive nem quem a opera**. Trabalho de retaguarda diário, com prazos de horas, sem papel atribuído. Esta seção é a casa disso.

### RN-OFF-010 — Ordem é por agregado, nunca global

**Enunciado** a fila **não** é uma FIFO única: dentro de um agregado a ordem é obrigatória e declarada (venda antes do pagamento, pagamento antes da emissão); entre agregados independentes não há ordem, e um agregado travado **nunca** bloqueia o resto.
**Motivo** fila global transforma um item problemático em paralisia do estabelecimento inteiro — uma venda que não sobe pararia a sincronização de todos os consumos e de todos os terminais.
**Aceite** com um agregado travado os demais drenam até o fim; o travado é contável, nomeado e localizável, e a drenagem não reinicia do começo (`RN-EMI-030`: cada item preserva a própria identidade).
**Infeliz** dois agregados que pareciam independentes têm dependência real → a dependência é **declarada** como parte do agregado maior, não resolvida com fila global.

### RN-OFF-011 — A fila tem dono nomeado, superfície própria e consequência declarada

**Enunciado** existe **uma atribuição** dona da fila — `queue_owner` (`RN-NUC-020`), atribuição e nunca pessoa —, com superfície onde quem a porta vê: quantos itens, desde quando, de que terminal, qual o prazo mais próximo e qual o efeito de perder cada prazo. O operador de caixa **não** a porta.
**Correção de 2026-08-23:** este enunciado dizia "um papel", e a auditoria mostrou que a divergência não era inerte (`AUT-11`): como **papel**, `queue_owner` ficaria fora do conjunto fechado de `RN-NUC-019`, sem coluna em nenhuma matriz — logo com toda célula negada por `RN-NUC-026` — e, o ponto, o **gate** de `RN-NUC-020` deixaria de existir, porque ele verifica uma **atribuição** declarada. O estabelecimento concluiria a habilitação sem alvo de fila. Como **atribuição**, o alvo ausente é estado declarado e a habilitação não conclui (`papeis-e-permissoes.md` §4.2).
**Motivo** fila sem dono é fila que ninguém olha, e no caso fiscal o prazo é de horas (`RN-EMI-028`, `RN-EMI-031`). Sem dono, o produto entrega o documento e não entrega o que fazer quando ele não é autorizado — que é o caso mais frequente.
**Aceite** com itens pendentes existe superfície nomeada, ordenada por prazo, que quem porta `queue_owner` alcança sem passar pelo caixa; fila vazia é estado visível, não ausência de tela; e estabelecimento **sem** a atribuição declarada não conclui a habilitação (`RN-NUC-020`), nunca uma fila cujo alvo é ninguém.
**Infeliz** ninguém olha → o produto **escala** por conta própria ao `establishment_responsible` antes do vencimento do prazo mais próximo, e o não-olhado nunca vira silêncio. `LACUNA-OFF-007` está **respondida na parte de papel** (`manager`, escopo estabelecimento, designado por `queue_owner`) e **aberta na parte de número** — com quanta antecedência escalar é `LACUNA-NUC-014`.

### RN-OFF-012 — Item irremediável sai da fila para uma lista de trabalho nomeada

**Enunciado** operação que o servidor rejeita **em definitivo** — não por indisponibilidade, mas por motivo que só uma pessoa resolve — para de ser retentada, **sai** da fila e entra em lista de trabalho nomeada, com dono de papel gerencial, motivo preservado literalmente e efeito declarado. Não desaparece em silêncio e não retenta para sempre.
**Enumeração para leitura derivada, com o campo de texto livre qualificado** (acrescentado em 2026-08-23, `AUT-12`). O que a decisão de resolver o item exige, e o que a superfície mostra por `RN-NUC-035` (i.b): **o efeito declarado**, o **estado** (transitório × definitivo), o **terminal**, o **operador** e o **instante do fato** — e a **presença** do motivo literal preservado. O **conteúdo** do motivo é campo de **texto livre de terceiro**, e ele tem as três declarações que `RN-NUC-035` (i.b) exige: **(1)** a decisão exige o **literal**, porque só ele diz o que o terceiro recusou e nenhuma classificação derivada dele é confiável (`RN-OFF-027`, motivo); **(2)** quem o alcança é **quem porta `queue_owner`** (`RN-OFF-011`), o mais estreito que resolve o item — não todo portador da célula da linha 29; **(3)** ele **não** vai para contagem, lista, relatório nem exportação (`RN-OFF-027`, aceite), e carrega a minimização de `RN-EMI-017` porque pode conter identificação do comprador.
**Motivo** generaliza `RN-EMI-019` (retransmissão suspensa) para fora do fiscal. As duas falhas são igualmente caras: laço infinito consome o terminal e esconde o problema; descarte silencioso perde venda que já aconteceu — receita **e** obrigação.
**Aceite** item rejeitado em definitivo aparece exatamente uma vez na lista, com motivo e origem (terminal, operador, instante do fato); a fila drena até o fim sem ele; e ele nunca é retentado automaticamente depois disso.
**Infeliz** o motivo não é reconhecido pela versão do produto → estado "rejeição não reconhecida", texto do servidor preservado e escalado (como `RN-EMI-018`, infeliz); nunca lido como sucesso nem como transitório. Quantas tentativas antes de "definitivo", e com que espaçamento: `LACUNA-OFF-005`.

### RN-OFF-013 — A identidade da operação é cunhada no terminal, offline, antes de existir servidor

**Enunciado** toda operação enfileirável nasce com **identidade própria de idempotência**, cunhada **no terminal**, no instante do fato, sem consultar servidor e sem depender de conexão; reenviar com a mesma identidade devolve o **mesmo** resultado, e o servidor nunca cria identidade para operação que nasceu offline.
**Motivo** `PN-02` e `RN-MSA-008`: repetição não é acidente, é caminho normal — resposta perdida, terminal reiniciado depois do commit, operador que apertou de novo. Identidade nascida no servidor tornaria indesduplicável exatamente o que mais dói: venda e pagamento.
**Aceite** a mesma venda concluída offline é enviada três vezes, uma delas depois de reinstalar o terminal → uma venda, um pagamento, um documento (`PN-02`, `RN-EMI-020`).
**Infeliz** duas operações distintas nascem com a mesma identidade → é defeito **crítico** de construção, não caso de negócio: a colisão é detectada, a segunda é recusada e escalada, nunca fundida com a primeira. **O formato da identidade é `D-04` e não é decidido aqui**: este arquivo declara o requisito (cunhada no terminal, offline, única, estável entre reenvios) e nada além (`LACUNA-OFF-003`).

### RN-OFF-014 — Existe teto de operação offline, declarado, e alguém o decide

**Enunciado** o terminal **não** acumula pendência indefinidamente: existe teto declarado, medido em **vendas concluídas pendentes de sincronização** (não em bytes, não em minutos), a partir do qual o produto **recusa continuar** a operar offline. É configuração do cliente, com padrão que **o humano** decide (`LACUNA-OFF-004`).
**Motivo** a fila não é cache: é venda que já aconteceu e dinheiro que já trocou de mão — perdê-la é perder receita **e** descumprir obrigação fiscal. Fila grande é risco crescente e continuar vendendo aumenta a aposta; mas recusar cedo demais é parar o caixa, que é o que `PN-01` recusa. Por isso o número é do negócio, não nosso.
**Aceite** ao aproximar-se do teto o operador é avisado com antecedência declarada e o responsável é escalado; ao atingi-lo, venda nova é recusada com mensagem de operação (o que fazer, não o que falhou), e nada da fila é descartado.
**Infeliz** o teto é atingido no pico → a recusa é da **venda nova**, nunca da fila existente, e o produto declara o que destrava: restabelecer conexão, ou a exceção de `RN-OFF-025` — decisão **online**, ou exceção **pré-autorizada, finita e contada**, com trilha própria por uso. **Correção de 2026-08-22:** onde esta regra dizia "decisão explícita de papel autorizado que assume o risco", ela autorizava offline o que `RN-OFF-007` proíbe; vale `RN-OFF-025`, e papel retido segue `RN-OFF-024`.

### RN-OFF-015 — Recurso local esgotado nunca descarta fato

**Enunciado** quando o armazenamento local do terminal se aproxima do limite, o produto **para de aceitar fato novo** antes de perder fato já concluído; nada da fila é apagado, compactado com perda, sobrescrito ou rotacionado.
**Motivo** mesmo raciocínio de `RN-OFF-014` em outro recurso: entre "não vender agora" e "perder venda que já aconteceu", a segunda é irreversível.
**Aceite** com o recurso no limite, a venda nova é recusada com mensagem de operação e a fila permanece íntegra e contável; ao drenar, a operação volta sozinha.
**Infeliz** o recurso esgota mesmo assim (falha física) → perda declarada, não silenciosa: o que o produto sabe que existia e não subiu é reportado ao dono da fila com terminal, instante e quantidade. Margem de segurança e como medi-la: `LACUNA-OFF-005`.
**Contrapeso obrigatório (2026-08-22):** esta regra é **anti-perda**, e sozinha ela especificaria um terminal acumulando tudo para sempre. Ela vale **junto** com `RN-OFF-021` (conteúdo ilegível em repouso) e `RN-OFF-022` (item **confirmado** sai do terminal) — e a proibição de apagar, compactar com perda, sobrescrever e rotacionar aqui é sobre item **não confirmado**, que continua absoluta, inclusive com o recurso no limite.

### RN-OFF-016 — Terminal reinstalado ou descomissionado não é caminho de perda

**Enunciado** reinstalar, trocar ou descomissionar terminal com fila pendente **não** apaga a fila e não é caminho para descartá-la: exige drenagem, ou transferência explícita por papel autorizado, com autor, instante e o que foi transferido em trilha. A transferência é **escopada ao mesmo cliente e estabelecimento**, nunca por identificador que o pedido informa (`RN-OFF-026`), e o papel usado nela segue `RN-OFF-024`. Faixa não usada segue `RN-OFF-006`, infeliz (c).
**O que quem transfere vê, enumerado** (acrescentado em 2026-08-23 por `AUT-05`): **quantos** itens, de **que tipo**, de **que terminal**, **desde quando**, o **prazo mais próximo** e o **desfecho de cada item**. Seis campos, e é **inventário** — não é o **conteúdo** do item. Transferir é decidir sobre um conjunto, e a decisão não exige ler o que a fila carrega: o conteúdo inclui o que comprova recebimento de pagamento e pode incluir identificação do comprador e texto de terceiro (`RN-OFF-023`, itens 3, 4 e 6), e lê-lo é **operação de leitura com célula própria** (`matriz-operacao-papel-modulos.md` §7, hoje `?` — `LACUNA-NUC-018`), nunca leitura derivada de uma transferência (`RN-NUC-035` i.b). Sem esta enumeração, "o que exatamente vai transferido" entregava a fila inteira por dentro de uma operação permitida.
**Motivo** `PN-03` diz que o terminal é substituível — e é por isso que a substituição precisa declarar o que vai embora com ele. Reinstalação é a rota mais fácil para fazer venda pendente desaparecer sem ninguém decidir nada.
**Aceite** terminal com pendências é reinstalado; ao voltar, as pendências que ele retinha são localizáveis e drenam, ou existe registro nomeado de transferência/perda com autor. Em nenhum caminho a contagem vai a zero sem desfecho por item. **Pelo lado negativo:** na mesma transferência, quem a executa vê os seis campos do inventário e **não** alcança o conteúdo de item nenhum — nem o que comprova recebimento de pagamento, nem identificação de comprador, nem texto de terceiro —, e a tentativa de alcançá-lo é negada pela célula da linha de leitura, não pela ausência de tela.
**Infeliz** o terminal foi perdido, roubado ou destruído com fila retida → **é evento de comprometimento, não só de perda** (`RN-EMI-038`: revoga a capacidade de assinar, encerra a faixa, notifica o cliente). **Correção de 2026-08-22:** "quantificada pelo que o servidor sabia existir" era **inexequível** — o servidor só conhece o que já subiu, e fato nascido offline é invisível para ele por construção (`RN-OFF-013`). O limite correto: a perda é quantificada **até onde o servidor conhecia**, e o restante é declarado como **perda não quantificável**, com terminal, último contato e o intervalo até o evento. Escalada ao responsável e ao dono da fila; nunca reconciliada em silêncio, e nunca contada como zero por falta de dado. Onde a fila reside, e se pode residir fora do terminal: `LACUNA-OFF-008`.

### RN-OFF-019 — O instante do fato é o do fato, e divergência de relógio é fato declarado

**Enunciado** operação concluída offline carrega o **instante em que aconteceu**, medido no terminal, não o da sincronização (`cozinha.md` §5 é o precedente); ao recuperar conexão, a divergência entre o relógio do terminal e a referência é **registrada como fato**, com o valor da divergência, e não corrige retroativamente nenhum instante já gravado.
**Motivo** fronteira de turno, "vendas de hoje" e vigência de regra dependem de hora. Terminal offline com hora errada atribui a versão de regra errada a uma venda — erro diferido, financeiro, descoberto pelo contador.
**Aceite** venda concluída offline aparece no servidor com o instante do fato e com a divergência de relógio declarada; nenhum instante gravado é reescrito na sincronização.
**Infeliz** a divergência cruza fronteira de vigência, de turno ou de dia → o fato **não** é silenciosamente atribuído: vira pendência nomeada para o dono da fila, com as duas interpretações à vista. **Existe conflito aberto e este arquivo não escolhe lado:** `RN-FIS-008` resolve vigência no fuso do **estabelecimento**, e `glossario.md` §1.1 mais `.claude/rules/dados.md` §3 dizem que o fuso é dado do **cliente (tenant)** — `LACUNA-OFF-006`, resolução do humano.

## 6. O que o operador vê, e o que ele nunca decide

### RN-OFF-018 — O operador vê estado, pendência e o que pode prometer; conflito técnico nunca é dele

**Enunciado** em qualquer domínio o terminal mostra, sem interpretação técnica: que **está** offline e há quanto tempo, **quantas** operações estão pendentes, e **o que pode ser prometido ao cliente-final** neste estado (o que sai agora, o que sai depois, o que não sai). Reconciliação que exige julgamento vai para o papel dono da fila (§5), em lista de trabalho — **nunca** em modal no caixa.
**Motivo** `PN-15`, `PN-17` e `PN-01`. O operador tem fila na frente e trinta segundos; pedir que ele decida entre duas versões de um fato garante decisão ruim e culpa quem menos podia decidir.
**Aceite** durante D1, D2 e D3 o operador conclui o fluxo de venda sem nenhum modal de erro de rede, enxerga estado e contagem de pendências no próprio terminal, e nenhuma tela oferece a ele escolher entre versões de um fato.
**Infeliz** existe conflito que exige julgamento → sai do caixa e entra na lista de trabalho do papel dono; o caixa segue vendendo. O operador é **informado** apenas quando isso muda o que ele pode prometer.

## 7. Cenários

### C-01 — Internet cai no pico e a venda continua (o caso do pedido)

**ATOR** operador de caixa. **GATILHO** o link de internet cai às 20h14, no pico.
**ESTADO INICIAL** terminal 2, consumo em aberto no alvo 14 (`MSA`) com 3 itens lançados, LAN viva, ponto de produção alcançável, 0 pendências.
**PASSOS** lança 2 itens no alvo 14 · abre venda de balcão com 4 itens · recebe em espécie e conclui.
**O QUE O SISTEMA FAZ** aceita os lançamentos (classe 1, `RN-MSA-011`) · roteia os trabalhos pela LAN, integralmente (D1, `RN-COZ-008`) · compõe o total a partir do preço publicado que o terminal retém, registrando as versões usadas (`RN-OFF-020`) · conclui com identidade cunhada no terminal (`RN-OFF-013`) · consome número da faixa pré-alocada (`RN-OFF-006`) e entra em contingência por ponto de emissão (`RN-EMI-024`).
**O QUE O OPERADOR VÊ** "sem conexão desde 20h14 · 5 pendências"; o fluxo inteiro sem modal.
**DESFECHO** venda concluída, documento em contingência, 6 pendências, caixa nunca parou.
**CAMINHO INFELIZ** o cliente-final quer pagar com cartão → recusado como classe 4 (`RN-OFF-007`), com o motivo dito em operação e a espécie oferecida como alternativa.
**EXERCITA** `RN-OFF-004`, `RN-OFF-006`, `RN-OFF-007`, `RN-OFF-013`, `RN-OFF-020`, `RN-MSA-011`, `RN-COZ-008`, `RN-EMI-024`.

### C-02 — A rede volta e sincroniza

**ATOR** o sistema e, depois, o papel dono da fila. **GATILHO** o link volta às 21h03.
**ESTADO INICIAL** terminal 2 com 41 pendências de 12 agregados; terminal 1 com 8 pendências de 3 agregados; 19 documentos em contingência.
**PASSOS** o produto drena · o dono da fila abre a superfície de pendências.
**O QUE O SISTEMA FAZ** drena por agregado, com a ordem interna respeitada e sem ordem global (`RN-OFF-010`) · cada operação sobe com o instante do fato e a divergência de relógio declarada (`RN-OFF-019`) · cada documento em contingência drena preservando identidade e prazo próprios (`RN-EMI-028`, `RN-EMI-030`).
**O QUE O OPERADOR VÊ** a contagem de pendências caindo; nenhuma ação pedida a ele.
**DESFECHO** fila em zero, ou com o restante nomeado por prazo; o fechamento do dia fecha (`PN-01`).
**CAMINHO INFELIZ** um agregado trava → os outros 11 terminam; o travado é contável, localizável, e não reinicia a drenagem (`RN-OFF-010`).
**EXERCITA** `RN-OFF-010`, `RN-OFF-011`, `RN-OFF-019`, `RN-EMI-028`, `RN-EMI-030`.

### C-03 — Reenvio duplicado que não duplica

**ATOR** o terminal. **GATILHO** a resposta do servidor se perde depois do commit; o terminal reinicia.
**ESTADO INICIAL** venda de 4 itens concluída offline, identidade cunhada no terminal, 1 pendência.
**PASSOS** primeiro envio (resposta perdida) · reinício · reenvio · o operador aperta concluir de novo.
**O QUE O SISTEMA FAZ** reconhece a mesma identidade nas três tentativas e devolve o mesmo resultado (`RN-OFF-013`, `PN-02`); a emissão correspondente não duplica documento (`RN-EMI-020`).
**O QUE O OPERADOR VÊ** a mesma venda, uma vez, com o mesmo total; nenhuma menção a reenvio.
**DESFECHO** uma venda, um pagamento, um documento.
**CAMINHO INFELIZ** duas operações distintas com a mesma identidade → a segunda é recusada e escalada, nunca fundida (`RN-OFF-013`, infeliz).
**EXERCITA** `RN-OFF-013`, `RN-MSA-008`, `RN-EMI-020`.

### C-04 — A faixa de numeração acaba offline

**ATOR** operador de caixa. **GATILHO** a faixa pré-alocada do terminal 2 esgota às 22h40, ainda sem link.
**ESTADO INICIAL** D1 há 2h26, 63 pendências, faixa do terminal 2 no último número.
**PASSOS** conclui a venda seguinte · tenta a próxima.
**O QUE O SISTEMA FAZ** conclui a **venda** (o fato comercial não depende do documento — `RN-EMI-016`, `RN-EMI-001`) · não inventa número e não reusa (`RN-EMI-022`) · registra o documento como pendência nomeada, no tratamento de modalidade ausente (`RN-EMI-025`) · escala ao responsável e ao dono da fila.
**O QUE O OPERADOR VÊ** que a venda está registrada, que o documento fiscal **não** saiu, e o que pode dizer ao cliente-final — em linguagem de operação, sem termo técnico.
**DESFECHO** vendas continuam existindo; documentos ficam pendentes com efeito declarado; nada é inventado.
**CAMINHO INFELIZ** o que se entrega ao cliente-final nesse estado não está coberto por `RN-EMI-017` nem por `RN-EMI-026` (os dois tratam de documento **existente**) → `LACUNA-OFF-009`, dono humano.
**EXERCITA** `RN-OFF-006`, `RN-OFF-014`, `RN-EMI-016`, `RN-EMI-022`, `RN-EMI-025`.

### C-05 — O ponto de produção cai no meio do serviço

**ATOR** quem lança e quem produz. **GATILHO** a LAN até o ponto de produção morre às 20h50 (D2 do ponto, D1 do estabelecimento).
**ESTADO INICIAL** 5 trabalhos em curso no ponto, 2 apresentados por impressão, 3 em tela.
**PASSOS** lança 5 itens novos · o ponto volta 18 minutos depois.
**O QUE O SISTEMA FAZ** aceita os 5 lançamentos e cria os 5 trabalhos (`RN-COZ-008`) · marca o ponto como inalcançável para quem lança · ao voltar apresenta os 5 em ordem de lançamento, cada um uma única vez · avanço de etapa registrado no ponto sobe com o instante em que aconteceu (`RN-OFF-019`, `cozinha.md` §5).
**O QUE O OPERADOR VÊ** que aquele ponto está inalcançável e quantos trabalhos aguardam apresentação.
**DESFECHO** nenhum trabalho perdido, serviço não parou, fechamento não bloqueado (`RN-MSA-012`).
**CAMINHO INFELIZ** o dispositivo do ponto não retém e foi reiniciado → o **avanço de etapa** se perde e é declarado como perda; o **trabalho** não se perde e é reapresentado (`cozinha.md` §5).
**EXERCITA** `RN-OFF-002`, `RN-OFF-019`, `RN-COZ-008`, `RN-MSA-012`.

### C-06 — Operação não-aditiva tentada offline e recusada

**ATOR** atendente. **GATILHO** o dispositivo dele perde a LAN (D2) e o cliente-final pede para juntar duas contas.
**ESTADO INICIAL** dispositivo isolado há 6 minutos; alvo 14 com 5 itens e alvo 15 com 2, ambos em estado conhecido às 20h44.
**PASSOS** tenta juntar 14 e 15 · tenta lançar mais um item no 14.
**O QUE O SISTEMA FAZ** recusa a junção (classe 2, `RN-OFF-005`, `RN-MSA-006`, `RN-MSA-011`) apresentando o último estado conhecido e o instante dele · **aceita** o lançamento, que é aditivo.
**O QUE O OPERADOR VÊ** "este dispositivo está sem contato com os outros desde 20h44; o que ele conhece do alvo 14 é isto" — não um código de erro, não "tente novamente".
**DESFECHO** nada foi juntado, nada foi perdido, o consumo continua sendo lançado.
**CAMINHO INFELIZ** o cliente-final está indo embora e a junção é urgente → o produto diz o que falta acontecer e o atendente decide (cobrar separado agora é caminho aditivo válido). Nunca aceita a junção para reconciliar depois (`RN-OFF-009`).
**EXERCITA** `RN-OFF-003`, `RN-OFF-005`, `RN-OFF-009`, `RN-MSA-006`, `RN-MSA-011`.

### C-07 — Terminal reinstalado com fila pendente

**ATOR** quem instala, e o papel dono da fila. **GATILHO** o terminal 2 apresenta defeito e é reinstalado com 63 pendências e faixa parcialmente consumida.
**ESTADO INICIAL** 63 pendências retidas no terminal, 19 documentos em contingência, faixa com números não usados.
**PASSOS** tentativa de reinstalar antes de drenar.
**O QUE O SISTEMA FAZ** exige drenagem ou transferência explícita por papel autorizado, com autor e instante em trilha (`RN-OFF-016`) · encerra a faixa não usada por ação declarada, com desfecho fiscal por `RN-EMI-022` · nada vai a zero sem desfecho por item.
**O QUE O OPERADOR VÊ** que existem 63 pendências e que a reinstalação não é caminho para elas desaparecerem.
**DESFECHO** terminal novo operando; pendências drenadas ou transferidas com registro; faixa encerrada com desfecho.
**CAMINHO INFELIZ** o terminal foi perdido, furtado ou destruído com a fila retida → é comprometimento, não só perda (`RN-EMI-038`), e a perda é declarada em **duas** partes: quantificada até onde o servidor conhecia, e o restante como **perda não quantificável** (`RN-OFF-016`, corrigido em 2026-08-22). O cenário completo é `C-09`, em `fila-local-conteudo-e-repouso.md`.
**EXERCITA** `RN-OFF-016`, `RN-OFF-006`, `RN-OFF-011`, `RN-OFF-026`, `RN-EMI-022`, `RN-EMI-038`.

### C-08 — Item da fila rejeitado em definitivo

**ATOR** papel dono da fila (gerencial). **GATILHO** uma operação da fila é rejeitada pelo servidor por motivo que só uma pessoa resolve.
**ESTADO INICIAL** fila drenando, 63 itens, 1 deles rejeitado repetidamente sempre com o mesmo motivo — e o motivo é de classe que só uma pessoa resolve, não indisponibilidade (é isso que o torna definitivo, não a contagem de tentativas).
**PASSOS** o produto para de retentar aquele item · o item entra na lista de trabalho.
**O QUE O SISTEMA FAZ** classifica como definitivo, remove da fila, cria **um** item na lista de trabalho nomeada com motivo literal, terminal, operador e instante do fato (`RN-OFF-012`, generalizando `RN-EMI-019`) · a fila drena os outros 62 até o fim (`RN-OFF-010`).
**O QUE O OPERADOR VÊ** nada: não é dele. O caixa segue vendendo (`RN-OFF-018`).
**DESFECHO** um item nomeado com dono, nenhum laço, nenhum descarte.
**CAMINHO INFELIZ** o motivo não é reconhecido pela versão do produto → "rejeição não reconhecida", texto do servidor preservado e escalado; nunca lido como sucesso nem como transitório.
**EXERCITA** `RN-OFF-010`, `RN-OFF-012`, `RN-OFF-018`, `RN-EMI-019`.

## 8. Lacunas e pendências

Abertas em 2026-08-22. Nenhuma bloqueia as regras da §3; todas mudam quem constrói o quê. Lacuna
fechada **permanece na lista**, marcada `FECHADA` e com o que a fechou: é por ela que se entende por que
uma célula da §4 mudou de valor. Fechadas até aqui: `LACUNA-OFF-001` e `LACUNA-OFF-010`.

- **`LACUNA-OFF-001` — FECHADA em 2026-08-22.** Era a maior lacuna deste arquivo: sete linhas da §4 (pedido, venda em espécie, adquirente, desconto, configuração, gaveta/sangria, sessão de caixa) sem `RN-NUC-nnn` para citar, sustentadas só por postura (`PN-01`, `PN-02`, `PN-11`, `PN-15`), que não tem critério de aceite e não é citável por construtor. Fechada por `RN-NUC-001` a `RN-NUC-016`, e o efeito não foi só de citação: as células **mudaram de valor**, porque o default de `RN-OFF-008` estava afirmando recusa no caminho crítico do caixa (ver a nota sob a tabela §4). **Sucessora parcial:** `LACUNA-NUC-007` — em 2026-08-23 o **fechamento do dia** ganhou linha (transcrição de `RN-NUC-031`) e só **abertura/fechamento de turno** continua fora da tabela, logo no default de recusa.
- **`LACUNA-OFF-002`** — é **admissível** pré-alocar faixa de numeração fiscal por terminal? A numeração é sequencial por estabelecimento e por série, subsérie é vedada e a série separa processo de emissão (`RN-EMI-022`, `RN-EMI-023`); se a faixa por terminal exigir **série por ponto de emissão**, muda habilitação, custo e o desfecho do não usado. **Dono:** humano (com o contador). Bloqueia o mecanismo, não o requisito.
- **`LACUNA-OFF-003`** — mecanismo de alocação de faixa e **formato** da identidade cunhada no terminal (`RN-OFF-006`, `RN-OFF-013`). **`D-04` está ABERTA** — este arquivo declara o requisito e nada além. **Dono:** `arquiteto-dados`, Fase 1.
- **`LACUNA-OFF-004`** — o **número** do teto de operação offline, em **vendas concluídas pendentes** (`RN-OFF-014`), e o aviso de aproximação. **Dono:** humano. Unidade declarada; valor não.
- **`LACUNA-OFF-005`** — todo número operacional da fila: tamanho, lote de drenagem, espaçamento e quantidade de tentativas antes de "definitivo" (`RN-OFF-012`), margem de recurso local (`RN-OFF-015`), duração de sincronização. **Dono:** `performance`, Fase 2, com medida — não com palpite. **Acrescentado em 2026-08-22:** nenhum desses valores é constante do produto — todos são configuração por cliente com vigência (`RN-OFF-028`), e as grandezas e unidades estão nomeadas em `offline-grandezas-e-orcamento.md` §2.
- **`LACUNA-OFF-006`** — **conflito aberto de fuso.** `RN-FIS-008` resolve vigência no fuso do **estabelecimento**; `glossario.md` §1.1 e `.claude/rules/dados.md` §3 tratam o fuso como dado do **cliente (tenant)**. Terminal offline com relógio divergente atribui versão de regra pela hora local — de qual hora local? **Dono:** humano. Este arquivo não escolhe lado (`RN-OFF-019`).
- **`LACUNA-OFF-007`** — **qual papel** é dono da fila de pendências, e qual a escalada quando ninguém olha (`RN-OFF-011`; `RN-EMI-028` já pedia e ninguém atribuiu). **Dono:** humano; entrada direta de **D-03**.
- **`LACUNA-OFF-008`** — onde a fila **reside**, e se pode residir fora do terminal que a criou (`RN-OFF-016`). Mecanismo, não requisito. **Dono:** `backend` e `arquiteto-dados`, Fase 2. **Condição acrescentada em 2026-08-22, e ela é de produto:** esta lacuna **fecha antes** de a fila poder conter dado de pessoa, junto de `LACUNA-OFF-012` (confidencialidade em repouso) e com gate de `seguranca` — `RN-OFF-021`, infeliz.
- **`LACUNA-OFF-009`** — o que se entrega ao cliente-final quando a venda existe e o documento fiscal **não** foi emitido (faixa esgotada, modalidade ausente): `RN-EMI-017` e `RN-EMI-026` tratam de documento existente. **Dono:** humano (com o contador).
- **`LACUNA-OFF-010` — FECHADA no lado de produto em 2026-08-22.** A costura `PN-13` × `PN-01` fora do fiscal: **que artefato** o núcleo publica ao terminal para compor valor offline, e ele é **versionado e congelado no fato** como a regra fiscal já é (`RN-FIS-004`, `RN-FIS-009`)? O requisito estava em `RN-OFF-020`; o conjunto agora está em `RN-NUC-013` — lista **fechada**, cada membro com versão, vigência e o que o fato congela, mais o que explicitamente **não** é artefato publicado (papel retido é autoridade, `RN-OFF-024`; faixa é alocação, `RN-OFF-006`). `RN-NUC-014` diz que só papel autorizado publica, online, e que o terminal nunca é autor; `RN-NUC-015` diz o que acontece com o terminal que estava offline durante a publicação — e que o servidor **não recalcula** na volta. **Continua aberto:** o **como** (granularidade de transporte, versionamento, quem confirma o quê) — **dono:** `backend`, Fase 2. Dois membros do conjunto dependem de lacuna própria: precisão/arredondamento (`LACUNA-NUC-004`) e fuso (`LACUNA-NUC-001`).

`LACUNA-OFF-012` e `014` estão em `fila-local-conteudo-e-repouso.md` §5; `011`, `015`, `016` e `017` em
`fila-local-autoridade-e-identidade.md` §5; `LACUNA-OFF-013` em `offline-grandezas-e-orcamento.md` §3.

**Perguntas para o humano, uma linha cada:** (1) o teto de `LACUNA-OFF-004` — quantas vendas pendentes antes de recusar continuar, e **existe** exceção offline para passar dele (`RN-OFF-025`)? (2) qual papel opera a fila de pendências, e ele existe no cliente-alvo? (3) de quem é o fuso que decide vigência quando o estabelecimento está em fuso diferente do cliente (tenant)? (4) quanto tempo vale o papel retido no terminal (`LACUNA-OFF-011`)?

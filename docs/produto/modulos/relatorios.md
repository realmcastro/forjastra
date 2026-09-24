# Módulo `REL` — Relatórios gerenciais

Spec do módulo. A entrada curta é `catalogo-de-modulos.md` (`REL`) — este arquivo aprofunda e **não**
a substitui. Código de `glossario.md` §4.3, imutável. Regras numeradas `RN-REL-nnn`, heading
`### RN-REL-nnn`, mesmo contrato de busca dos demais.

**Dois arquivos, um conjunto normativo.** Partido no eixo **o que governa qualquer relatório × quais
perguntas a semente tem, e o que foi recusado**. Este arquivo tem o cabeçalho normativo, a fronteira,
as oito regras gerais (`RN-REL-001` a `RN-REL-008`) e o contrato do módulo;
`relatorios-semente-de-perguntas.md` tem as seis perguntas da semente (`RN-REL-009` a `RN-REL-014`),
os papéis sem relatório, os **recusados** e as **lacunas dos dois**. Numeração contínua e imutável
entre os dois, sem hierarquia entre eles. Foi partido porque o arquivo único chegou a 457 linhas.

**A tese deste arquivo, e ela vale mais que a lista.** A pergunta que o relatório responde é
**produto**; a forma de apresentá-la é **design** (Fase 3). Então aqui não há tipo de gráfico, eixo,
forma, cor, componente nem bloco — e um item que só se consegue descrever como gráfico **não está
pronto** e não entra. É a mesma disciplina de "capacidade sem critério de aceite não entra": gráfico
sem a pergunta declarada é decoração, e decoração em superfície de gestão faz alguém decidir com
confiança que o dado não sustenta.

**O que estes arquivos não fazem.** Não definem tabela, coluna, índice, pré-agregação, rota, contrato
técnico, tela nem componente (territórios de `arquiteto-dados`, `backend` e `ui`). Não calculam
dinheiro nem decidem valor (`PN-13`): relatório **lê** fato. Não decidem prioridade nem corte de MVP —
a ordem de construção de `REL` está em `roadmap-de-modulos.md` e é do humano. Não escrevem número:
teto, prazo e volume são `LACUNA-REL-n` (irmão, §4).

**Não cunham vocabulário.** Nenhum identificador novo é criado aqui. Se a semente exigir termo no
`glossario.md`, é `LACUNA-REL-007` — o glossário está no teto de tamanho e a passada é própria.

**Ler um relatório é operação autorizável, a célula dela não é minha — e ela ainda não existe.** Cada
relatório declara **quem decide** com o dado, e esse nome é **indicação de candidato, nunca concessão**
(`RN-NUC-039`). O passo 3 da T-0003 entregou as três matrizes e **`REL` não recebeu linha em nenhuma
delas**; enquanto isso durar, ler relatório de `REL` é **negado a todos** (`RN-NUC-026`, `RN-NUC-039`a),
e a pergunta está marcada como `LACUNA-NUC-037` (`matriz-operacao-papel-modulos.md` §9). Nada neste
arquivo nem no irmão autoriza leitura por prosa; o default continua **negado** (`RN-NUC-022`).

---

## 1. Propósito e fronteira

**Propósito.** Responder pergunta de gestão sobre o que **já aconteceu**, no recorte que informa uma
decisão concreta de quem opera o negócio — e responder de forma que quem lê saiba de onde o número
veio, que período ele cobre e o que ele **não** cobre.

**Fora da fronteira de `REL`:**

| Não é `REL` | É | Por quê |
|---|---|---|
| exportação do próprio dado pelo cliente | **núcleo** (`PN-10`) | é postura, não módulo desligável |
| fila de pendências de sincronização | **núcleo/offline** (`RN-OFF-011`) | superfície de operação com prazo e dono |
| lista de trabalho de item irremediável | **núcleo/offline** (`RN-OFF-012`) | idem, com dono de papel gerencial |
| fila de documento fiscal pendente, ordenada por prazo | **`EMI`** (`RN-EMI-028`) | prazo de **horas**; relatório é de dias |
| conferência do fechamento da sessão de caixa | **núcleo** (`RN-NUC-010`) | é o ato de fechar, não a análise dele |
| painel do dia em andamento | **superfície de operação** (T-0003, passo 5) | frescura de minutos; ver `RN-REL-002` |
| projeção do que vai acontecer | **fora**, hoje | `REL` é sobre o que já aconteceu; ver irmão, §3 |
| apuração e obrigação acessória | **`APU`** | consolidar para o fisco não é informar decisão de gestão |

`REL` **não importa** nenhum módulo: conversa por contrato publicado ou evento (invariante 2, e
`RN-REL-004`).

---

## 2. As regras que governam qualquer relatório deste módulo

### RN-REL-001 — Relatório existe pela decisão que informa, e sem decisão nomeada e sem quem a toma ele não entra

**Enunciado** todo relatório de `REL` declara **oito** campos, e a ausência de qualquer um o
desqualifica: (1) a **decisão** concreta que alguém toma com ele; (2) **quem** decide, por papel
existente; (3) o **grão**, com limite; (4) a **janela**; (5) a **frescura** aceitável; (6) o
**escopo**; (7) quais **módulos o alimentam e por qual contrato ou evento**; (8) o que acontece
**quando o módulo-fonte está desligado**. Os campos (3) a (8) admitem `LACUNA-REL-n` com dono
declarado. Os campos (1) e (2) **não admitem lacuna**: relatório sem decisão nomeada ou sem papel que
a tome vai para os recusados (irmão, §3). O papel do campo (2) é **candidato**: ele diz de quem é a
decisão, não que a leitura esteja autorizada — autorização nasce na célula, e enquanto `REL` não tiver
linha (`LACUNA-NUC-037`) nenhum campo (2) concede nada (`RN-NUC-039`).

**Motivo** "acompanhar o desempenho" não é decisão — é a frase que faz um relatório existir sem
ninguém precisar dele, e ela custa duas vezes: custa a construção e custa a confiança de quem lê
número que não muda ação nenhuma. Exigir a decisão **e o papel** corta os dois defeitos de uma vez:
relatório órfão (ninguém decide) e relatório que só existiria com um papel que não existe — e papel
não nasce para ter quem leia relatório (`RN-NUC-017`, proibição de papel por antecipação).

**Aceite** para cada item proposto, a frase "com este relatório, o `<papel>` decide `<ação>`" é
escrita e é uma ação verificável: "com este relatório, o `owner` decide quanto comprar de cada item
para o próximo ciclo" → entra. "Com este relatório, o `owner` acompanha o faturamento" → não é ação,
vai para os recusados com o motivo.

**Infeliz** a decisão existe e nenhum dos papéis do núcleo a toma (`papeis-e-permissoes.md` §3) → o
relatório **não entra** e a pergunta vira `PERGUNTAS: para humano`. Nunca se cria papel para dar dono
a um relatório, e nunca se atribui a decisão ao papel mais alto "porque ele pode tudo".

### RN-REL-002 — Grão sem limite não existe; janela e frescura são declaradas, e é a frescura que separa relatório de superfície ao vivo

**Enunciado** todo grão declara o **limite** que o torna finito (paginação, recorte máximo, ou
domínio naturalmente fechado). Toda janela declara **de quando a quando**, em períodos fechados. Toda
frescura declara **quanto atraso a decisão tolera**, em ordem de grandeza — e pergunta cuja decisão
**não** tolera atraso de horas **não é relatório**: é superfície de operação, e sai deste módulo.

**Motivo** grão sem limite é a forma mais comum de um relatório funcionar no cliente pequeno e parar
o banco no maior — e como a consulta roda em N schemas, o pior cliente é o que manda. Frescura é o
campo que ninguém escreve e o único que decide arquitetura: uma pergunta de dias aceita ser respondida
sobre período fechado; uma de minutos obriga leitura do que está acontecendo agora, e aí ela concorre
com o caixa. Confundir as duas é como painel ao vivo nasce disfarçado de relatório.

**Aceite** cada relatório da semente tem grão com limite, janela em períodos fechados e frescura em
ordem de grandeza; nenhum diz "todos os itens" nem "tempo real". Item cuja frescura declarada for de
minutos é recusado aqui e endereçado à superfície de operação, com a decisão preservada.

**Infeliz** o limite depende de um teto que ninguém fixou → `LACUNA-REL-001`, dono `performance`. O
relatório continua declarado e **não** é construído com limite implícito: limite ausente é limite
infinito, e limite infinito é achado, não relatório.

### RN-REL-003 — Relatório não é fila, nem lista de trabalho, nem superfície de operação — e não as absorve

**Enunciado** `REL` **não** possui e **não** substitui: a fila de pendências e o seu dono
(`RN-OFF-011`), a lista de trabalho de item irremediável (`RN-OFF-012`), a fila de documento fiscal
ordenada por prazo (`RN-EMI-028`) e a conferência de fechamento de sessão (`RN-NUC-010`). Onde `REL`
olha para o mesmo material, ele olha para a **recorrência** dele, com frescura de dias, e cita a
superfície que continua sendo a dona do caso individual.

**Motivo** as duas coisas têm prazos de naturezas diferentes e uma engole a outra em silêncio.
Pendência fiscal tem prazo de **horas** e efeito legal por item; a análise de recorrência tem prazo de
dias e efeito estrutural. Tratar a fila como "um relatório de pendências" faz o prazo de horas
desaparecer dentro de um período de agregação — e o item vence enquanto alguém lê a média da semana.

**Aceite** existindo item pendente, ele aparece na fila da superfície dona, ordenado por prazo, com
ou sem `REL` ligado; desligar `REL` não apaga nem atrasa nenhuma fila; e nenhum relatório desta spec
é o único lugar onde um prazo de horas aparece.

**Infeliz** um relatório da semente é a única superfície onde um caso individual acionável aparece →
é defeito de fronteira: o caso volta para a superfície dona e o relatório fica só com a recorrência.

### RN-REL-004 — Relatório lê o que o módulo expõe, por contrato ou evento publicado; nunca o de dentro dele

**Enunciado** `REL` se alimenta **exclusivamente** do que cada módulo declara **expor**
(`catalogo-de-modulos.md`, campo **Expõe**) e do que o núcleo expõe — venda concluída, pedido,
pagamento, sessão de caixa, operador e papel autorizado, trilha, âncora fiscal. Nenhum relatório lê
estrutura interna, estado intermediário ou dado não exposto de outro módulo, e nenhum relatório exige
que um módulo passe a expor algo **sem** que a spec daquele módulo declare a exposição.

**Motivo** `REL` é o ponto do sistema onde "módulo não importa módulo" é mais fácil de violar, porque
a tentação é legítima: a pergunta é boa e o dado está ali. Uma vez que um relatório lê o de dentro de
`EST`, desligar `EST` deixa de ser desligar um módulo e passa a ser quebrar um relatório — e o
invariante de plugabilidade morre pelo caminho mais barato que existe.

**Aceite** para cada relatório, cada fonte é nomeada como "`<módulo>`: `<o que ele expõe>`", e o que
ele expõe consta do catálogo daquele módulo. Fonte que não consta é **pedido de exposição nova**,
declarado como pergunta ao dono da spec daquele módulo — nunca leitura direta.

**Infeliz** o relatório precisa de algo que nenhum módulo expõe → ele fica **incompleto e declarado**
(`RN-REL-005`), com a pergunta endereçada. Nunca se deduz o dado faltante de outra fonte "parecida":
número derivado de fonte errada é indistinguível de número certo, e é assim que uma decisão de compra
sai errada sem ninguém perceber.

### RN-REL-005 — Módulo-fonte desligado: a série **não existe**, e "não existe" nunca é apresentado como zero

**Enunciado** quando o módulo que alimenta uma série está desligado no cliente, a resposta é **"esta
série não existe neste cliente"**, com o motivo (o módulo que a produz não está ativo). É **proibido**
apresentar zero, vazio, traço ou branco no lugar. A ausência é declarada onde o número apareceria, não
em nota de pé, e o relatório continua respondendo a parte que ele consegue responder.

**Motivo** zero é um **fato** — "vendi zero deste item", "não houve pendência" — e ausência de módulo
não é fato nenhum. Quem lê zero decide sobre ele: tira o item do catálogo que na verdade não é medido,
conclui que a operação fiscal está limpa quando ela simplesmente não passa por aqui. Confundir os dois
faz o dono tomar decisão sobre dado que não existe, e o erro é invisível justamente para quem mais
confia no relatório.

**Aceite** cliente com `EMI` desligado abre o relatório de recorrência de pendência fiscal
(`RN-REL-014`) → ele diz "este cliente não emite documento fiscal por este produto; a série não
existe", e **não** "nenhuma pendência". Cliente com `EST` desligado abre o relatório de reposição
(`RN-REL-009`) → a quantidade vendida aparece, a cobertura de saldo é declarada inexistente, e nenhum
saldo zero é exibido. Ligar o módulo faz a série passar a existir **a partir dali**, e o relatório diz
desde quando ela é medida.

**Infeliz** o módulo foi desligado **no meio** da janela → a janela é partida e declarada: o período
em que a série existiu e o período em que ela não existiu, nunca somados como se fossem o mesmo. Dado
já registrado não é apagado por desligamento (invariante 2); ele só para de ser produzido.

### RN-REL-006 — Escopo é estabelecimento ou cliente; consolidado que só existe somando clientes é dado nosso, e nenhuma superfície de cliente o alcança

**Enunciado** todo relatório declara escopo **por estabelecimento** ou **por cliente** (soma dos
estabelecimentos daquele cliente). A autorização de leitura é avaliada no escopo do **objeto**
(`RN-NUC-018`): `manager` de um estabelecimento não alcança o outro, nem por dentro de um agregado.
Consolidado que **só existe somando clientes** é dado **nosso**, de operação da plataforma, e nenhuma
tela, exportação, relatório, contagem ou mensagem endereçada a um cliente devolve valor que dependa de
outro cliente (`RN-EMI-040`). Nenhuma consulta feita no escopo de um cliente atravessa esse escopo.

**Motivo** o agregado é o caminho pelo qual vazamento entre clientes sobrevive a schema correto: a
consulta não cruza nada, mas o número entregue só existia porque alguém somou o vizinho. E dentro de um
mesmo cliente há o caso mais silencioso: gerente de uma loja lendo o resultado da outra por dentro de
um total "do cliente" — não cruza schema, então nenhuma defesa de isolamento por cliente o pega, e são
pessoas jurídicas diferentes.

**Aceite** este aceite descreve o **recorte**, não a concessão: os papéis citados são candidatos, e a
autorização de ler depende da célula que `LACUNA-NUC-037` ainda não criou (`RN-NUC-039`). Suposta a
leitura autorizada, o candidato de escopo estabelecimento (hoje `manager`) que pede o relatório no
escopo cliente → recebe apenas o recorte do estabelecimento dele, ou uma negação que não revela o que
existe no outro (`RN-OFF-026`); o candidato de escopo cliente (hoje `owner`) recebe os dois recortes e o
total. Enquanto a célula não existir, os dois pedidos são **negados**, e a negação cita a lacuna, não
esta prosa. Nenhum relatório da semente é comparativo com outro cliente, em nenhuma forma, inclusive
anonimizada ou em faixa.

**Infeliz** alguém pede comparação com o mercado → recusados (irmão, §3), com a necessidade nomeada e
preservada. Se um dia existir, é decisão do humano, fora do escopo de cliente, e passa por `seguranca`
antes de existir como pergunta.

### RN-REL-007 — Relatório lê fato; ele não recalcula, não corrige e não esconde a correção

**Enunciado** relatório apresenta o fato como ele foi registrado e a correção como **outro fato**, os
dois visíveis e vinculados (`PN-07`, `RN-NUC-008`). Nenhum relatório reescreve histórico, "ajusta" um
período fechado, nem recalcula valor: valor, desconto, encargo e tributo vêm congelados na versão
publicada que vigia no instante do fato (`RN-NUC-013`), e o que o relatório faz é **agregar**, nunca
decidir (`PN-13`).

**Motivo** duas necessidades reais empurram para o defeito: ver o resultado "já corrigido" e comparar
preço histórico com o de hoje. Atender a primeira reescrevendo o passado apaga a única evidência de que
houve correção — e é exatamente o que a auditoria e o contador precisam ver. Atender a segunda
recalculando o passado com a regra de hoje produz um número que nunca existiu.

**Aceite** venda cancelada no dia seguinte aparece, na janela, como o fato original **e** o fato de
correção, com o efeito líquido declarado como líquido — nunca como uma venda que desapareceu.
Republicar preço não muda nenhum número de período anterior.

**Infeliz** a correção pertence a uma janela e o fato original a outra → as duas janelas mostram o que
aconteceu **nelas**, e o vínculo é navegável. Nunca se move um fato de período para "fechar" a conta.

### RN-REL-008 — Recorte por pessoa não entra sem decisão do humano

**Enunciado** nenhum relatório desta semente tem grão, coluna, ordenação ou filtro **por pessoa** —
operador que atendeu, gerente que autorizou, quem fechou a sessão. O grão é o estabelecimento, o posto
de caixa, o item, a sessão, o ponto de emissão. O recorte por pessoa é `LACUNA-REL-002`, com dono
**humano**.

**Motivo** o dado existe: a trilha registra quem fez o quê com que autoridade, e ela é obrigatória
(`PN-11`). Mas lê-la como indicador de conduta é decisão sobre vigilância de trabalhador, já recusada
como capacidade sem aceite em `catalogo-de-capacidades.md` — e não é decisão de agent. Somar a trilha
por pessoa e chamar de desempenho é a forma mais fácil de transformar uma garantia de auditoria em
instrumento de gestão de gente, sem ninguém ter decidido isso.

**Aceite** nenhum dos relatórios da semente nomeia pessoa em grão, coluna ou ordenação; a trilha
continua íntegra e consultável caso a caso pelo papel autorizado, para o ato específico. Diferença de
caixa aparece por sessão e por posto, com a pendência nomeada — não por operador.

**Infeliz** a decisão exige a pessoa (apuração de um caso concreto de diferença de dinheiro) → isso é
**caso individual** na trilha, autorizado por papel, com registro de quem consultou — não é relatório
agregado, e a semente não o cobre.

---

## 3. Contrato do módulo

**Expõe** consultas agregadas por período e por estabelecimento, sempre **dentro de um cliente**
(`catalogo-de-modulos.md`, `REL`). Nenhum evento: `REL` não produz fato, só lê.
**Exige do núcleo** venda, pagamento e sessão de caixa como fatos imutáveis; a versão publicada
congelada em cada fato (`RN-NUC-013`); o fuso do cliente para o corte de período; autorização por papel
no escopo do objeto (`RN-NUC-018`). **Exige dos demais módulos** apenas o que cada um declara expor.
**Desligado** o cliente continua com o fechamento do dia e com a exportação do próprio dado, que são do
núcleo (`PN-10`) — nenhuma fila, nenhuma pendência e nenhuma operação depende de `REL`. Nenhuma análise
elaborada é composta, e isso é ausência de análise, não erro de tela.
**Sensível** agregado que se aproxima de pessoa (cliente-final quando `CLF` está ligado; operador, que
`RN-REL-008` mantém fora do grão).

**Registra** (acrescentado em 2026-09-12, `CLAUDE.md` §7.10) **nada, e é o único módulo do produto
nessa condição** — `REL` lê fato e não produz nenhum. A única coisa que ele poderia registrar é a
**própria leitura**, e ela não está decidida: ler relatório não tem linha em matriz nenhuma
(`LACUNA-NUC-037`), e o valor da célula decide **duas** coisas ao mesmo tempo, quem lê e se a leitura
deixa rastro (`R` × `P`, `RN-NUC-029`). A cláusula que obriga quem valorar a decidir as duas está em
`matriz-operacao-papel-modulos.md` §9 e em `matriz-celulas-a-valorar.md` §2, item (f).

**Não registra**, e cada um com o motivo:

- **A própria leitura, hoje.** Ausência **acidental**, pendurada na célula acima — achado 2.9 de
  `captura-varredura-invariante-10-2026-09-11.md`. Sem ela, "este relatório é usado, por quem e com
  que frequência" não é respondível, e é essa a única conferência possível da promessa de
  `RN-REL-001`: relatório existe pela decisão que informa. A assimetria que torna o buraco visível:
  **exportar** documento fiscal registra quem pediu, o escopo e o volume (`RN-EMI-039`), e ler o
  agregado do mesmo período não registra nada.
- **Pessoa, em grão, coluna, ordenação ou filtro** (`RN-REL-008`). É decisão sobre vigilância de
  trabalhador, do humano, em `LACUNA-REL-002` — a trilha continua íntegra e consultável caso a caso.
- **Qualquer valor que dependa de outro cliente**, inclusive anonimizado ou em faixa (`RN-REL-006`):
  é vazamento por agregado, que sobrevive a schema correto.
- **Projeção.** Fora da fronteira do módulo hoje (§1), e o que existe é `CAP-REL-001`, candidata e
  não agendada.
- E a trava que é de captura, não de leitura: **ausência de módulo nunca vira zero**, nem gravado nem
  apresentado (`RN-REL-005`). Zero é fato; ausência não é, e confundir os dois faz alguém decidir
  sobre dado que não existe.

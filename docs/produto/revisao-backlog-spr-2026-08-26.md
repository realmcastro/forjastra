# Revisão do backlog `SPR` contra a spec aprovada — 2026-08-26

> **O que este arquivo é.** A revalidação das 52 issues do board `SPR` contra `docs/produto/**`, card por
> card. É **recomendação**: nada aqui altera issue, e nada aqui é decisão. Quem decide é o humano; quem
> executa no Jira é o thread principal (`.claude/rules/jira.md` §2).
>
> **O que ele não é.** Não decide prioridade, prazo, corte comercial nem ordem de venda — é do humano, e
> já está definido no board. Não cria `RN`, não reserva código de módulo em `glossario.md` §4.3, não abre
> `LACUNA-<COD>-<nnn>` (as lacunas achadas aqui são `G-nn` **desta revisão**, e viram `LACUNA` ou `RN` no
> arquivo dono quando o humano decidir). Não afirma nada fiscal, de pagamento ou de adquirente.
>
> **Método.** Para cada card: a **necessidade** existe? ela já tem `RN` aprovada? o escopo declarado passa
> no teste dos três negócios (`fronteira-do-nucleo.md` §2)? o card contradiz regra aprovada? Card mal
> escrito **não** é card desnecessário — a pergunta é sobre a necessidade, nunca sobre o texto.
>
> **CONFERIDO CONTRA O BOARD EM 2026-08-26.** Este arquivo foi escrito sem acesso ao Jira. O corpo real
> das 53 issues foi lido depois. Os achados estão em `revisao-backlog-spr-conferencia-2026-08-26.md` e o
> texto corretivo em `backlog-edicoes-correcoes-2026-08-26.md` — issue de aplicação `SPR-54`. **Quatro vereditos mudaram** (`SPR-8`, `SPR-9`, `SPR-30`, `SPR-36`), uma
> afirmação de §1.2 é **falsa** (`service_mode`, ver `SPR-1`), e **seis substituições de descrição
> apagariam critério de aceite ainda válido**. Onde este arquivo e a conferência divergirem, vence a
> conferência: ela leu o corpo.
>
> **Não repete** o que o humano já comentou no board: append-only em `SPR-30`/`SPR-12`, colisão offline da
> numeração em `SPR-6`, observação livre na chave de equivalência em `SPR-33`/`SPR-21`, "última escrita
> ganha" em `SPR-11`, autoridade do backend e desfecho offline em `SPR-27`, paginação/N+1 em `SPR-9`, tipo
> do dinheiro em `SPR-28`, fronteira núcleo/módulo nas Epics `SPR-5`/`SPR-15`. Onde um desses pontos
> reaparece abaixo, é porque a **classificação** dele muda: deixa de ser risco e passa a ser contradição
> com regra aprovada, com `path:linha` (§3).

## Resumo em quatro linhas

- **Lixo: nenhum.** Zero `EXCLUIR`. Toda issue das 52 nomeia uma necessidade que se sustenta.
- **2 `FUNDIR`** (`SPR-21`, `SPR-24`), **33 `AJUSTAR`**, **17 `MANTER`** — corrigido pela conferência de
  2026-08-26, que tirou `SPR-8`, `SPR-9`, `SPR-30` e `SPR-36` de `MANTER`. Antes da conferência: 29 e 21.
- O problema real do board não é card demais: é **três cards de modelagem agendados sobre entidade que
  `produto` nunca classificou** (`SPR-31`, `SPR-32`, `SPR-33`) — isso é pior que lixo, porque produz
  progresso aparente em cima de fronteira não decidida, na fase em que errar custa migration.
- **9 regras que o backlog pressupõe e a spec não tem** (§2), duas delas bloqueantes da Fase 1.

---

## 1. Veredito por card

### 1.1 As 19 criadas em 2026-08-26

| Card | Marca | O quê |
|---|---|---|
| `SPR-34` Epic Fase 1 | **AJUSTAR** | Falta no escopo da Epic o que a Fase 1 **não pode** não ter: as três reservas de `roadmap-de-modulos.md:258` (numeração, congelamento/grão, âncora documental — condição declarada da Opção B), a política de arredondamento (`:333`) e `LACUNA-GLO-001` (fuso) antes de modelar qualquer coisa datada. Ver `G-01`, `G-02`. |
| `SPR-35` Epic cliente | MANTER | Escopo coerente com `D-02` e com `.claude/rules/ui.md`; nenhuma regra de negócio pressuposta. |
| `SPR-39` chave, timestamps, exclusão lógica | MANTER | É `D-04` literal (`CLAUDE.md` §8). Território de `arquiteto-dados`, sem regra de produto pendente. |
| `SPR-40` dinheiro e quantidade | **AJUSTAR** | Tipo/escala é `arquiteto-dados` (`.claude/rules/dados.md` §3). Mas **precisão, arredondamento e a ordem em que se aplica** são artefato publicado (`nucleo-publicacao-e-texto.md:46`, `LACUNA-NUC-004`) e decisão de **produto com o humano e o contador** (`roadmap-de-modulos.md:333`) — não cabem num card de modelo, e sem elas o congelado nasce sem a metade que o cancelamento usa. Declarar a parte de produto, aqui ou em card próprio. |
| `SPR-36` schema de controle | **BLOQUEAR** *(corrigido na conferência; era `MANTER`)* | O escopo do card põe o **fuso na linha do cliente**, com justificativa escrita — e isso **decide `LACUNA-GLO-001`** (`glossario.md:395`), que é do humano e pergunta exatamente estabelecimento × cliente. Vence em **2026-09-08**, e nenhuma issue do board faz a pergunta. Coluna de fuso no cliente torna fuso por estabelecimento impossível sem expand/contract em N schemas. O resto do card (módulos ativos, livro-razão, `checksum`, retomada) não depende dela. |
| `SPR-37` venda, pagamento, caixa, turno, operador | **AJUSTAR** | **Retirar `turno` ou condicioná-lo.** `LACUNA-NUC-007` está aberta com resposta "não sei ainda" do humano; abrir e fechar turno **não tem `RN`** e continua recusado pelo default (`nucleo-venda.md:370`). Modelar turno hoje é inventar quem abre, o que ele encerra e o que acontece com sessão aberta na virada — e o modelo é a camada onde isso não se desfaz. |
| `SPR-38` executor de migration | MANTER | `.claude/rules/migrations.md` cobre; nada de produto. |
| `SPR-41` gate de segurança do modelo | MANTER | É o gate 2 do `CLAUDE.md` §4. Obrigatório, não opcional. |
| `SPR-42` Expo sem custódia | MANTER | `D-02`; não duplica `SPR-43` — a custódia é o que separa as duas superfícies. |
| `SPR-43` Expo com custódia | MANTER | Idem. É o Windows offline que decide `D-02`. |
| `SPR-44` analisador do manifesto + despacho tipado | MANTER | `.claude/rules/ui.md` §1 e invariantes §7.4/§7.5. |
| `SPR-45` vocabulário fechado de ids | MANTER | Janela de renome fecha na primeira entrega — a posição na trilha está certa por dependência. |
| `SPR-46` mensagens + formatação única | **AJUSTAR** | *Motivo corrigido na conferência.* Não é omissão: o card **já respondeu** `LACUNA-GLO-001` — o escopo diz "o fuso é do cliente" e o **critério de aceite** afirma "dois clientes de fusos diferentes". Escolha em aceite vira o teste que prova o código certo, e é mais difícil de reverter que silêncio. O formatador **formata**, nunca decide qual fuso vale; o fuso é artefato publicado, linha não delegável (`nucleo-publicacao-e-texto.md:49`), e a ausência dele é erro, não default. |
| `SPR-47` variantes por espaço e interação | MANTER | Eixos corretos; permissão e módulo não são eixo (`.claude/rules/ui.md`). |
| `SPR-48` foco, teclado, leitor | MANTER | Requisito de operação, não acessibilidade opcional. |
| `SPR-49` tokens em código | MANTER | `docs/design/**`, território de `ui`. |
| `SPR-50` decidir o arranjo | MANTER | `D-02`; dono é o humano. |
| `SPR-51` prova medida da drenagem | MANTER | `R-08` (`docs/arquitetura/d-01-d-02-stack-opcoes.md:56`); é medição, e medir é o único jeito de fechar. |
| `SPR-52` camada de dados e framework HTTP | MANTER | Metade aberta de `D-01`. |
| `SPR-53` esta revisão | MANTER | — |

### 1.2 As 33 do backlog anterior

| Card | Marca | O quê |
|---|---|---|
| `SPR-1` recortar núcleo × módulo | **AJUSTAR** | A necessidade **já foi atendida**: `fronteira-do-nucleo.md`, `catalogo-de-modulos.md` e as 25 `RN-NUC`. Reescopar para o **resíduo** declarado: turno (`LACUNA-NUC-007`), conferido e aberto. ⚠️ **`service_mode` saiu do resíduo — a afirmação era falsa.** Ele tem regra: `RN-NUC-048` (`fatos-de-operacao-dominios-fechados.md:124`), e `glossario.md:396` registra `LACUNA-GLO-002` como **FECHADA em 2026-08-23** por causa dela. As linhas `roadmap-de-modulos.md:155` e `:171` estão velhas, e esta revisão as copiou sem conferir a substância. O comentário já publicado em `SPR-1` carrega o erro e precisa de retratação. |
| `SPR-2` pedido pelo cliente-final | **AJUSTAR** | `PCF` tem spec (18 `RN` + anexo de sessão). O que **não** existe é `PUB`, que `PCF` exige e tem **0 `RN`** (`roadmap-de-modulos.md:286`) — reescopar o spike para `PUB` e para as lacunas de `PCF`, não para levantar de novo o que já está escrito. |
| `SPR-3` entrega de pedidos | **AJUSTAR** | Necessidade real e **duas** casas: `CMP` (estado de cumprimento) e `ENT` (entrega em endereço), que **exige** `CMP`. Os dois têm 0 `RN`. Um card só produz um módulo só, e a fronteira aprovada tem dois (`catalogo-de-modulos.md:170`, `:310`). Partir por módulo. |
| `SPR-4` cozinha | **AJUSTAR** | `COZ` tem 12 `RN` e a §5 sobre queda do ponto no meio do serviço. Reescopar para o resíduo: `LACUNA-COZ-1`, `LACUNA-COZ-2` e a pergunta ao humano (tela, impressora ou os dois). |
| `SPR-5` Epic atendimento e comanda | MANTER | Escopo casa com `MSA`. Exigência: os filhos **citam** `RN-MSA-nnn` em vez de reenunciar — card que reenuncia regra existente produz a segunda versão dela. |
| `SPR-6` iniciar comanda em mesa | **AJUSTAR** | Aceite correto e alinhado a `RN-MSA-002`/`RN-MSA-003`. Falta declarar que "Comanda 1, 2, 3 **por mesa**" é uma **segunda referência humana** sem regra: a única referência com regra é única no escopo do **estabelecimento** (`nucleo-venda.md:296`, `RN-NUC-038`), e um contador por alvo não herda nem o escopo nem o mecanismo de faixa. Ver `G-06`. |
| `SPR-7` iniciar comanda em cliente | **AJUSTAR** | Três coisas: (a) "cliente" sem qualificador é proibido (`glossario.md:353`) — aqui é **nome de exibição** do cliente-final; (b) falta **ficha/cartão** como tipo de alvo, que `RN-MSA-013` tem e o card omite; (c) citar `RN-MSA-014` — sem ela `MSA` vira cadastro de pessoas por acidente (`modulos/mesa-comanda.md:272`). ⚠️ **A conferência achou uma quarta, e ela é contradição, não ajuste:** o aceite exige *"identificador técnico próprio do cliente no modelo de dados da comanda"* — que **é** a entidade de pessoa que `RN-MSA-014` proíbe. Vai para §3, ao lado da linha 8. |
| `SPR-8` múltiplas comandas na mesma mesa | **AJUSTAR** *(corrigido na conferência; era `MANTER`)* | É o caminho infeliz de `RN-MSA-002` já aprovado (escolha explícita, dois consumos distinguíveis) — citar. **E o corpo pede o mesmo contador sem regra de `SPR-6`:** *"identificação incremental dentro da mesa. Exemplo: Mesa 10 → Comanda 1 e Comanda 2."* É `G-06`, e a parte do aceite que depende dela fica atrás da decisão. |
| `SPR-9` consultar comandas em andamento | **AJUSTAR** *(corrigido na conferência; era `MANTER`)* | Coberto pelo contrato de `MSA`; acrescentar a citação de `RN-NUC-038` (consulta que **localiza** resolve dentro do escopo da identidade autenticada). **E o corpo pede *"identificar o número da comanda"*** — terceira aparição do contador de `G-06`. |
| `SPR-10` alterar mesa da comanda | **AJUSTAR** | É `RN-MSA-005`. Faltam três cláusulas que a regra aprovada tem e o card não: autor e instante de cada lançamento **preservados**, **nada** reenviado à produção, e transferência concorrente **recusada** com o estado atual (nunca última escrita). |
| `SPR-11` múltiplos garçons na mesma comanda | **AJUSTAR** | Coberto por `RN-MSA-011` (aditivo converge, não aditivo é recusado). Trocar a observação de "fora do escopo do MVP" pela citação da regra — o humano já apontou o default indesejado. |
| `SPR-12` cancelar comanda | **AJUSTAR** | Contradição, não ajuste de texto: condicionar o encerramento ao estado de preparo é exatamente o que `RN-MSA-012` e `RN-COZ-005` proíbem. §3, linha 1. |
| `SPR-13` comanda encerrada externamente | **AJUSTAR** | Inverte a fronteira: encerramento é operação **de `MSA`**, por decisão humana com papel, motivo e desfecho declarado entre cobrança e cancelamento (`modulos/mesa-comanda.md:212`). Reescrever como "o fechamento no ponto de cobrança conclui o consumo", que é o núcleo agindo, não "outro módulo encerra". |
| `SPR-14` tabelas do módulo, sem tocar o núcleo | **AJUSTAR** | Escopo certo (invariante 2, `.claude/rules/dados.md` §5). Corrigir uma entidade: "cliente/identificação textual" **não** é entidade de pessoa em `MSA` — é atributo de exibição, sem histórico e sem cruzamento (`RN-MSA-014`). Entidade de pessoa é `CLF`. |
| `SPR-15` Epic composição da comanda | **AJUSTAR** | O conteúdo dos filhos é composição de **pedido** — núcleo — e o nome da Epic ancora tudo em comanda. Além do que o humano já comentou: **quatro** dos filhos (`SPR-16`, `SPR-19`, `SPR-20`, `SPR-26`) dependem de entidade que a spec **não tem** (§2), então a Epic não é agendável inteira, só card por card. |
| `SPR-16` navegar pelo catálogo | **AJUSTAR** | Necessidade real (achar o item sem saber o código). Mas **categoria de catálogo não existe na spec**: não está no glossário, não tem `RN`, não tem linha na fronteira, e `PUB` reivindica "agrupamento" como capacidade de **módulo** (`catalogo-de-modulos.md:99`). Ver `G-03`. "Sem limitação fixa de profundidade" é **mecanismo**, e mecanismo de catálogo quente passa pelo gate de `performance` antes de virar aceite. |
| `SPR-17` pesquisar produtos | **AJUSTAR** | Necessidade real e distinta de `SPR-16` (não é duplicata). Falta o que toda operação precisa: classificação de continuidade — operação não classificada é **recusada** por default (`RN-OFF-008`) — e a fonte da busca, que offline só pode ser o artefato publicado retido (`nucleo-publicacao-e-texto.md:42`). |
| `SPR-18` configuração do produto | **AJUSTAR** | Duas coisas. (a) É **tela**, e tela é de `ui` — produto entrega a regra, não a etapa. (b) O mecanismo "**todo** produto passa por etapa de configuração" é recusado — refutação de quatro partes em §5.1. A regra defensável é condicional: item com **escolha obrigatória pendente** não é lançável sem a escolha. |
| `SPR-19` selecionar variação | **AJUSTAR** | *Caracterização corrigida na conferência.* O card **não** pede combinação por eixos: ele declara o limite — *"variações para diferenças simples, como tamanho"* e *"diferenças estruturais relevantes devem ser cadastradas como produtos distintos"*, que é o **comportamento desligado de `GRD` já escrito**, uma das três saídas da §4 item 2. A pergunta de fronteira fica, mais estreita: eixo único com preço próprio é núcleo, ou é o degrau de baixo de `GRD`? E a receita `RES` **não liga `GRD`** (`receitas-por-vertical.md:46`) — buraco da spec, não do card. Ver `G-04`. |
| `SPR-20` adicionar adicionais | **AJUSTAR** | A necessidade é a mais concreta do board e **não tem dono em lugar nenhum** da spec: nem núcleo, nem módulo, nem código reservado. E "valor do adicional incorporado ao valor do item" compõe valor a partir de algo **fora** da lista fechada de artefato publicado, que o aceite de `RN-NUC-013` proíbe (`nucleo-publicacao-e-texto.md:98`). Ver `G-05` e §3, linha 3. |
| `SPR-21` observação no item | **FUNDIR** com `SPR-22` | A regra **já existe e é do núcleo**: `RN-NUC-016` (origem declarada, texto opaco, nunca instrução, nunca chave de decisão) mais `order_item_note` no glossário §1.3 e a linha de fronteira `:87`. O que sobra do card é a coleta no lançamento do item, que é `SPR-22`. Card próprio aqui produz uma segunda versão de uma regra aprovada. |
| `SPR-22` adicionar produto à comanda | **AJUSTAR** | É `RN-NUC-002` + `RN-MSA-004`. Falta o que a regra aprovada exige e o card não pede: a linha grava **quais versões** de catálogo e de preço aplicou, e o lançamento grava **autor e instante**. Sem isso o fato nasce sem procedência e não é reconstruível offline. |
| `SPR-23` consolidar itens equivalentes | **AJUSTAR** | Necessidade real (ler a comanda no pico). Mecanismo recusado: consolidar **o fato**. Refutação de quatro partes em §5.2; contradições em §3, linhas 4 e 5. |
| `SPR-24` alterar quantidade de item | **FUNDIR** com `SPR-25` | Reduzir quantidade de item lançado **é** retirada parcial, e reduzir a zero é `SPR-25`. Dois cards para a mesma pergunta já produziram duas respostas diferentes: `SPR-25` fala de autorização, `SPR-24` trata redução como edição simples — sem papel, sem motivo, sem trilha, contra `RN-MSA-004`. Uma regra, um card. Aumentar quantidade é lançamento aditivo e cabe no mesmo enunciado. |
| `SPR-25` remover item da comanda | **AJUSTAR** | O eixo "enviado × não enviado" é estado de **`COZ`** usado como porteiro de `MSA` — §3, linha 1. O eixo aprovado é outro e existe: pedido em construção é livremente mutável (`nucleo-venda.md:94`), lançamento em consumo aberto é fato com autor e sai por **retirada autorizada** (`RN-MSA-004`), e o que acontece com o trabalho já feito é `RN-COZ-007`, sem consulta de volta. |
| `SPR-26` exibir disponibilidade | **AJUSTAR** | Necessidade real. Duas ausências: **não existe `RN` de disponibilidade no núcleo** — indisponível hoje significa "ausente do artefato publicado" (`RN-NUC-002`), que é ausência, não item visível marcado; e a disponibilidade com dono é de `EST` (`catalogo-de-modulos.md:93`), que está **fora do MVP 1** (`roadmap-de-modulos.md:184`). Ver `G-07`. |
| `SPR-27` validar disponibilidade antes do envio | **AJUSTAR** | Mesma ausência de `G-07`. Além do que o humano já comentou: "envio à cozinha" é `COZ`, e **`COZ` não decide disponibilidade** (`modulos/cozinha.md:217`) nem bloqueia lançamento (`RN-COZ-008`) — declarar **quem** bloqueia, e que o bloqueio é do lançamento no núcleo, não do envio à produção. |
| `SPR-28` calcular valor do item | **AJUSTAR** | "Fora do MVP: descontos" contradiz a spec aprovada — desconto e acréscimo com limite por papel são **núcleo** (`fronteira-do-nucleo.md:84`) e têm duas `RN` (`RN-NUC-006`, `RN-NUC-007`) dentro do MVP 1. §3, linha 6. Taxas, promoção e gorjeta ficam fora com razão: são `ECG`, `PRM` e módulo. |
| `SPR-29` calcular total da comanda | **AJUSTAR** | Contradiz `RN-MSA-007`: `MSA` **nunca** soma, rateia ou distribui centavo (`modulos/mesa-comanda.md:168`); o acumulado é informativo e vem do backend (`RN-MSA-001`). Reescrever como card de **núcleo** que compõe o acumulado, exposto por `MSA`. |
| `SPR-30` corrigir item enviado por lançamento novo | **AJUSTAR — descrição** *(corrigido na conferência; era `MANTER`)* | **Só o título foi trocado.** A descrição ainda diz *"o item poderá ser editado após o envio"* e *"não é necessário apresentar histórico detalhado da alteração no MVP"* — o mecanismo recusado, intacto. Mesmo estado de `SPR-18`: título corrigido sobre corpo intacto, e quem pegar o card implementa o corpo. Além disso, a pergunta que o comentário deixou aberta (*"exige autorização de papel?"*) **já tem resposta**: `RN-MSA-004` mais a célula de `RN-NUC-039` (`matriz-operacao-papel-contrato.md:213`), a mesma citada em `SPR-25`. |
| `SPR-31` modelar hierarquia de categorias | **AJUSTAR** | Não é agendável como modelo: a entidade não foi classificada (`G-03`) e o card de regra (`SPR-16`) vem **depois** dele na trilha. Modelo antes da regra é o inverso do invariante 7 e de `.claude/rules/processo.md` §2 — e é a fase em que errar custa expand/contract em N schemas. |
| `SPR-32` modelar produto, variação e complemento no núcleo | **AJUSTAR** | O título afirma uma fronteira que **nenhuma regra aprovada sustenta** e que uma linha aprovada contradiz (§3, linha 2): variação por eixos é `GRD`, módulo; e "complemento/adicional" não tem escopo, dono nem código (`G-05`). Além disso "produto" é vocabulário proibido para entidade (`glossario.md:63`) — é `catalog_item`, e o próprio gotcha do board diz que o termo do título chega ao nome da tabela. A parte de **ingrediente no módulo** está certa (`fronteira-do-nucleo.md:73`, `FTC`/`EST`). |
| `SPR-33` equivalência de composição | **AJUSTAR** | Mesma inversão de `SPR-31`: modelo agendado antes da regra (`SPR-23`). E a chave proposta inclui a observação em texto livre — que `RN-NUC-016` declara **nunca chave de decisão** (`nucleo-publicacao-e-texto.md:171`): não é armadilha a evitar, é contradição com regra aprovada. |

---

## 2. Regra que o backlog pressupõe e a spec não tem

Cada uma é o lugar onde uma frase confiante do card não tem regra atrás. `G-01` e `G-02` **travam a
Fase 1**; `G-03` a `G-05` travam a Epic `SPR-15` e os três cards de modelagem.

| # | O que o backlog pressupõe | Estado real | Dono da resposta |
|---|---|---|---|
| `G-01` | Que a Fase 1 modela o que a Opção B exige. | As **três reservas** de `roadmap-de-modulos.md:258` — numeração por estabelecimento e série, congelamento **e o grão** dele, âncora da obrigação documental no fato — são condição declarada da decisão do humano em T-0005, e **nenhuma issue do board as cobre**. `SPR-37` para em venda/pagamento/caixa/operador. Sem elas, "depois a gente liga `EMI`" é migração de dado fiscal em N clientes. | humano (confirmar que entram) + `produto` (grão) + `arquiteto-dados` |
| `G-02` | Que `turno` é modelável. | `LACUNA-NUC-007` aberta, resposta do humano "não sei ainda"; abrir/fechar turno **não tem `RN`** e é recusado por default (`nucleo-venda.md:370`). `SPR-37` o inclui no modelo. | humano (o que é turno), depois `produto` |
| `G-03` | Que existe **categoria de catálogo**, hierárquica, no núcleo. | Não existe: sem termo no glossário §1.2, sem `RN`, sem linha na fronteira, e `PUB` reivindica "agrupamento" como capacidade de **módulo** (`catalogo-de-modulos.md:99`). Dois cards a modelam (`SPR-31`) e a usam (`SPR-16`). Teste dos três negócios não foi aplicado a ela em lugar nenhum. | `produto` (fronteira), com o humano |
| `G-04` | Que **variação** de item é do núcleo. | A spec classifica combinação por eixos como módulo `GRD` (`fronteira-do-nucleo.md:72`, `catalogo-de-modulos.md:253`), e `CAP-GRD-001` nomeia "cor, tamanho, **sabor**" (`catalogo-de-capacidades.md:247`) — ou seja, a variação do restaurante já tem dono, e ele é um módulo de **horizonte** que a receita `RES` **não liga** (`receitas-por-vertical.md:46`). O buraco é da spec: o ramo precisa e a receita não prevê. | `produto` (rever a receita `RES` ou a fronteira de `GRD`), com o humano |
| `G-05` | Que **adicional / complemento** existe. | Não existe em nenhum escopo: não é núcleo (posto e loja de roupa não precisam — o teste falha), não é `PRM` (promoção condicional), não é `ECG` (encargo nomeado), não é `FTC` (insumo), e não tem código reservado em `glossario.md` §4.3. Três cards dependem dela (`SPR-18`, `SPR-20`, `SPR-32`) e um compõe **valor** com ela (§3, linha 3). | `produto` (classificar; se for módulo, o código é reservado no glossário **antes** da spec), com o humano |
| `G-06` | Que "Comanda 1, 2, 3 por mesa" é identificação legítima. *(Conferência: toca `SPR-6`, `SPR-8` **e** `SPR-9`, não só `SPR-6`.)* | A única referência humana com regra é a da venda, única no escopo do **estabelecimento**, consumida de faixa pré-alocada (`RN-NUC-003`), e toda resolução por ela é escopada antes (`RN-NUC-038`). Um contador por alvo é um segundo espaço de nomes sem regra, sem escopo declarado e sem mecanismo de alocação — e o grão da referência já é tensão aberta (`LACUNA-NUC-003`). | `produto` + humano |
| `G-07` | Que existe **disponibilidade** de item no caminho de venda. | Disponibilidade com dono é de `EST` (`catalogo-de-modulos.md:93`), **fora do MVP 1** (`roadmap-de-modulos.md:184`); com `EST` desligado "a venda não consulta disponibilidade" (`:96`). No núcleo, indisponível é **ausência** do artefato publicado (`RN-NUC-002`), não item visível marcado. `SPR-26` e `SPR-27` presumem o item visível-e-bloqueado. | `produto` (existe marca de disponibilidade no núcleo?), com o humano |
| `G-08` | Que **busca textual** de catálogo é operação conhecida. | Sem `RN`, sem classe de convergência, sem fonte declarada. Operação não classificada é **recusada** por default (`RN-OFF-008`, enunciado em `operacao-offline-e-sincronizacao.md`, não aberto nesta revisão). `SPR-17` a pede como aceite. | `produto` (classificar), depois `arquiteto-dados`/`performance` |
| `G-09` | Que a **política de arredondamento** já está resolvida. | É linha da tabela de artefato publicado com `LACUNA-NUC-004` no lugar do valor (`nucleo-publicacao-e-texto.md:46`), e `roadmap-de-modulos.md:333` a coloca como decisão de produto com o humano e o contador **antes** da Fase 1. `SPR-28`, `SPR-29` e `SPR-40` a pressupõem. | humano (com o contador), forma depois em `arquiteto-dados` |

---

## 3. Card que contradiz regra aprovada

| # | Card | Regra contrariada | Em que a contradição consiste |
|---|---|---|---|
| 1 | `SPR-12`, `SPR-25` (e o eixo "enviado" em `SPR-27`, `SPR-30`) | `RN-MSA-012` (`modulos/mesa-comanda.md:243`) e `RN-COZ-005` (`modulos/cozinha.md:143`) | Condicionam aceitar, alterar ou **encerrar** consumo ao estado de preparo. `RN-MSA-012` diz que `MSA` **não consulta** estado de preparo para nenhuma das três; `RN-COZ-005` diz que a etapa "não libera nem impede nada". Consequência que a regra existe para evitar: display caído travando o encerramento no pico. |
| 2 | `SPR-32` *(a conferência tirou `SPR-19` desta linha)* | `fronteira-do-nucleo.md:72` e `catalogo-de-modulos.md:253` | Põe **variação por eixos** no núcleo — pelo título, que é nosso, não do autor do card; a fronteira aprovada a classifica como módulo (`GRD`), com o motivo escrito ("padaria e posto não precisam"). É o erro que a §5.1 da fronteira chama de o pior dos três: mexe em núcleo com todos os clientes em produção. **`SPR-19` sai daqui:** o corpo dele manda diferença estrutural para item próprio, que é o `GRD` desligado. Ele levanta `G-04`, não a contradiz. |
| 3 | `SPR-20` | `RN-NUC-013`, lista fechada (`nucleo-publicacao-e-texto.md:32`) e aceite (`:98`) | "Valor do adicional incorporado ao valor do item" compõe valor a partir de artefato que **não está** na lista fechada de publicação. O aceite da regra é literal: verificar que **nenhum** valor da venda foi composto a partir de algo fora da tabela. Ou a tabela muda por alteração declarada da regra, ou o adicional não compõe valor offline. |
| 4 | `SPR-23`, `SPR-33` | `RN-NUC-016` (`nucleo-publicacao-e-texto.md:171`) | A observação entra na **chave de equivalência**, e a regra diz que o texto guardado é opaco e **nunca chave de decisão**. O humano já marcou a armadilha; o ponto novo é a classificação: é contradição com regra aprovada, não trade-off a ponderar. |
| 5 | `SPR-23` | `RN-PCF-006` (`modulos/pedido-cliente-final.md:181`) e `RN-MSA-004` (`modulos/mesa-comanda.md:127`) | `RN-PCF-006` é explícita: o produto **não deduplica por semelhança**, só por repetição da mesma submissão — duas pessoas pedirem a mesma coisa é rotina. E consolidar dois lançamentos num só apaga **autor e instante** de cada um, que `RN-MSA-004` exige e que é a única prova contra o furto por cancelamento de item. |
| 6 | `SPR-28` | `fronteira-do-nucleo.md:84`, `RN-NUC-006`, `RN-NUC-007` | Declara desconto "fora do MVP"; desconto e acréscimo com limite por papel são núcleo, têm duas `RN` e estão no MVP 1 (`roadmap-de-modulos.md:155`). Um card não retira do MVP o que o roadmap põe nele. |
| 7 | `SPR-29` | `RN-MSA-007` (`modulos/mesa-comanda.md:168`), `RN-MSA-001` (`:83`) | Atribui a soma a `MSA`; a regra diz que `MSA` não soma, não rateia e não distribui centavo, e que o acumulado é informativo e vem do backend. |
| 8 | `SPR-14` (parcial) | `RN-MSA-014` (`modulos/mesa-comanda.md:272`) | "Cliente/identificação textual" como entidade do módulo é o caminho pelo qual `MSA` vira cadastro de pessoas por acidente — que é o motivo escrito da regra. Nome de exibição é atributo, sem histórico e sem cruzamento; pessoa é `CLF`. |
| 9 | `SPR-7` *(acrescentada pela conferência)* | `RN-MSA-014` (`modulos/mesa-comanda.md:272`) | O aceite exige *"identificador técnico próprio do cliente no modelo de dados da comanda"*. Identificador técnico para a pessoa, dentro do modelo de `MSA`, **é** a entidade que a regra proíbe. Mesmo defeito da linha 8, um passo antes: `SPR-7` o pede, `SPR-14` o modela. |

Nota de vocabulário, transversal e não cosmética: `SPR-16` a `SPR-32` dizem "produto" onde a autoridade
única diz **item de catálogo** (`glossario.md:63`, que proíbe `product` como entidade). O gotcha já
registrado do board é exatamente este caminho — o termo do título chega ao nome da tabela sem ninguém
decidir.

---

## 4. Lacunas de fronteira ainda abertas

O que o board deixa sem resposta na pergunta "núcleo, módulo, vertical ou cliente?". Nenhuma se decide
por eliminação (`fronteira-do-nucleo.md` §4, passo 5): as três primeiras vêm como pergunta.

1. **Categoria / agrupamento de catálogo** (`G-03`) — candidatos: núcleo (achar item é dos três
   negócios), `PUB` (que já reivindica agrupamento para canal externo), ou os dois com nomes
   diferentes. A assimetria deliberada da fronteira §5.1 diz: na dúvida entre módulo e núcleo, escolha
   **módulo**. Contra-argumento honesto: sem nenhum agrupamento no núcleo, o operador de padaria só
   acha item por código, e é isso que o caderno de papel já dá hoje (regra núcleo §12).
2. **Variação por eixos no ramo `RES`** (`G-04`) — `GRD` é o dono, mas está em horizonte e fora da
   receita `RES`. Três saídas, todas com custo: ligar `GRD` na receita `RES` e antecipá-lo; aceitar que
   cada combinação é item próprio (que é o comportamento **desligado** já escrito de `GRD`); ou rever a
   fronteira de `GRD`. A terceira é a mais caro de errar.
3. **Adicional / complemento** (`G-05`) — sem dono. Se for módulo, o código nasce em `glossario.md`
   §4.3 **antes** da spec; se for núcleo, a fronteira §2.2 ganha linha nova e o teste dos três negócios
   tem que passar para os três, o que hoje não passa.
4. **Disponibilidade no caminho de venda** (`G-07`) — marca no núcleo, ou exclusivamente `EST`? Decidir
   por `EST` implica que `SPR-26`/`SPR-27` não são construíveis no MVP 1.
5. **Busca de catálogo** (`G-08`) — capacidade do núcleo ou superfície de operação? A classificação de
   continuidade muda com a resposta.
6. **Turno** (`G-02`) — não é fronteira entre escopos, é ausência de definição. Continua a última
   contradição com `PN-01` no núcleo.

---

## 5. As duas recusas de mecanismo, com as quatro partes

Só o **mecanismo** é recusado nos dois casos; a necessidade fica, e melhor atendida.

### 5.1 `SPR-18` — "todo produto passa por etapa de configuração antes de ser adicionado"

1. **Necessidade legítima:** não perder variação, complemento ou observação por esquecimento — hoje o
   operador anota no papel e o erro só aparece na entrega ou na conferência.
2. **Mecanismo recusado, e por que é ruim:** impor a etapa a **todo** item, inclusive ao que não tem
   escolha nenhuma. Ele cobra o custo da exceção em 100% dos lançamentos, no único caminho que não
   aceita regressão (o caixa com fila), e quebra o fluxo completável por leitor de código sem tocar a
   tela — que é requisito de operação, não conforto.
3. **Mecanismo que fica:** a regra é **condicional** — item cujo lançamento tem **escolha obrigatória
   pendente** não é lançável sem a escolha, e a recusa diz qual escolha falta (`PN-17`). Item sem
   escolha obrigatória é lançado em um toque. Qual item tem escolha obrigatória é dado publicado, não
   decisão do terminal.
4. **Por que é melhor, e como se prova:** aceite mensurável em dois sentidos — lançar por leitor 20
   itens sem escolha obrigatória sem nenhuma etapa intermediária; e tentar lançar item com escolha
   obrigatória pendente e ser recusado nomeando a escolha. O mecanismo antigo reprova o primeiro teste.

### 5.2 `SPR-23` — consolidar itens equivalentes fundindo o fato

1. **Necessidade legítima:** a comanda tem que ser **legível** no pico. Vinte linhas iguais de
   refrigerante são ilegíveis, e ilegível é o que faz o atendente conferir errado na frente do
   cliente-final.
2. **Mecanismo recusado, e por que é ruim:** fundir dois lançamentos em uma linha de quantidade 2.
   Apaga autor e instante de cada lançamento (`RN-MSA-004`), que é a única prova contra o furto por
   cancelamento de item; torna ambíguo o que fazer com o trabalho já emitido (`RN-COZ-001`); e usa
   texto livre como chave de decisão (`RN-NUC-016`). No canal externo é pior: `RN-PCF-006` já decidiu
   que duas pessoas pedindo a mesma coisa são dois lançamentos.
3. **Mecanismo que fica:** consolidação é **agregação de apresentação** sobre fatos que permanecem
   separados — a superfície mostra "2× X-Burger", os dois lançamentos continuam existindo com autor,
   instante e trilha próprios, e a retirada age sobre um lançamento, não sobre uma linha somada.
   Equivalência para **exibir** pode considerar composição; **identidade** de fato nunca é composição.
4. **Por que é melhor, e como se prova:** aceite em três partes — a tela mostra uma linha agregada; a
   trilha mostra dois lançamentos com autores diferentes; retirar "um" retira o lançamento escolhido, e
   a trilha mostra qual. O mecanismo antigo não consegue produzir a segunda nem a terceira prova, e é
   por isso que ele parece mais simples: ele descarta a informação que sustenta as duas.

---

## 6. Honestidade sobre o que **não** é lixo

Nenhuma das 52 é descartável, e três merecem dito explícito porque parecem candidatas óbvias:

- **`SPR-1` a `SPR-4`** parecem redundantes com a spec, e não são: a necessidade que cada um nomeia
  segue real. O que mudou é que parte já foi atendida — então eles encolhem para o resíduo, não somem.
  Fechar um deles como "já feito" sem nomear o resíduo (`PUB` com 0 `RN`, `CMP`/`ENT` com 0 `RN`, turno,
  `service_mode`) perde a única lista que sabe o que falta.
- **`SPR-16` a `SPR-33`** são os cards mais bem escritos do board — têm critério de aceite, caminho
  negativo e dependência declarada entre si (`SPR-25` remete a `SPR-30` de propósito, para não duplicar
  regra). O problema deles não é qualidade: é que quatro repousam sobre entidade inexistente.
- **`SPR-51`** parece overhead de processo e é o oposto: é a única issue do board que se compromete com
  **medida** em vez de opinião, sobre o requisito que mais restringe a escolha de arranjo.

O que eu **não** verifiquei, e por isso não afirmo: se as 52 issues do board são exatamente estas 52
(li a transcrição do brief, não o Jira); o corpo integral dos 19 cards novos, de que recebi só o título;
e o enunciado de `RN-OFF-008` na fonte, que citei pelo que outros arquivos aprovados dizem dele.

> **Resolvido em 2026-08-26 pela conferência** (`revisao-backlog-spr-conferencia-2026-08-26.md`): o
> conjunto é `SPR-1`..`SPR-53`, sem buraco. Dez dos 19 cards novos tiveram o corpo lido — e um deles,
> `SPR-36`, mudou de `MANTER` para `BLOQUEAR` por causa disso. Nove seguem lidos só pelo título, e a
> conferência declara quais. `RN-OFF-008` continua não conferido na fonte.
>
> Uma lacuna nova, que não estava em nenhuma das duas listas: **o fuso do cliente está escrito em quatro
> cards** (`SPR-34`, `SPR-36`, `SPR-37`, `SPR-46`) e `LACUNA-GLO-001` não tem issue no board. O primeiro
> deles vence em 2026-09-08.

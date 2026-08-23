# Custo da agregação do provedor — servidor, período e retenção — T-0004, passo 5

> **O que é.** Custo **em forma** de `fatos-de-operacao.md` (381 linhas), `fatos-de-operacao-provedor.md`
> (198), `operacao-do-provedor*.md` e as perguntas de console do `## Pedido` da T-0004. Escopo:
> `RN-NUC-041` a `046`, `RN-PRV-011` a `014`, e as perguntas de gestão que somam clientes.
>
> **Dois arquivos, um relatório.** Eixo da partição: **onde o custo é pago**. Aqui, o **servidor**: período
> aberto, agregado, fan-out em N schemas, retenção. No irmão
> `2026-08-23-custo-de-agregacao-do-provedor-caminho-critico.md`, o **terminal**: o caminho crítico do
> caixa e o volume dos fatos que ele produz — **é lá que está a prioridade um**. Numeração de achado
> contínua; partição declarada porque o texto único fechou em **420 linhas**, acima do teto de 400.
>
> **Não existe código, banco nem dado.** Por `.claude/rules/performance.md` §1: **nenhum número aqui foi
> medido**, e nenhum foi inventado. Entrego (a) custo em forma `O(...)`, (b) o que precisaria rodar para
> medir (§1), (c) estimativa **rotulada `ESTIMATIVA`, com a conta à vista e as hipóteses nomeadas como
> hipóteses**. **Nenhuma decisão aberta presumida:** `D-01` a `D-05`, e `D-06` (passo 4, em paralelo) —
> onde o custo depende de uma delas, digo qual e paro.
>
> **Prefixo `CST-`**, primeiro achado numerado de `performance` neste repositório (`AUT-` é da T-0003;
> `PRV-` é de `seguranca` nesta ficha — não colido com nenhum). A consulta de `performance` da T-0003 não
> escreveu arquivo: a substância dela vive em
> `memory/plataforma/decision-agregado-de-periodo-fechado-nao-e-cache.md`, e este relatório a continua.

## Índice dos achados

| ID | Título curto | Sev |
|---|---|---|
| `CST-01` (irmão) | O único freio legítimo ao grão fino é custo **medido**, e ele não é exercitável: faltam duas grandezas e o hardware-alvo | ALTO |
| `CST-02` (irmão) | A ordem de sacrifício de `RN-NUC-046` tem duas classes e deixa fora exatamente as quatro de maior volume do caminho crítico | ALTO |
| `CST-03` | O console do provedor não tem orçamento próprio nem cláusula de cessão ao caixa — `RN-OFF-030` é o precedente que mostra a falta | ALTO |
| `CST-04` | "Quantas operações estão acontecendo agora" em unidade de negócio **exige** cache; a versão que passa `F1` não exige nada | MÉDIO |
| `CST-05` | Retenção por classe e teto de janela de leitura são o **mesmo número** por dois lados, com dois donos e nenhuma regra ligando | ALTO |
| `CST-06` | Fan-out consolidado não declara o que faz com schema que falha: soma parcial apresentada como total | MÉDIO |
| `CST-07` (irmão) | `operation_refused` é o único fato desta família cuja cardinalidade **não** é limitada pelo negócio do cliente, e o valor que a governa não é declarado por ninguém | ALTO |
| `CST-08` (irmão) | "Terminal-alvo modesto" não é especificado em lugar nenhum: nenhuma medida de caminho crítico é reprodutível nem comparável entre releases | MÉDIO |

**Por que cinco `ALTO` e nenhum `CRÍTICO`.** Custo não vaza dado e não frauda dinheiro — `CRÍTICO` aqui é
do outro auditor, e ele já usou o dele (`PRV-01`). Os cinco `ALTO` têm o mesmo formato, e é ele que os
separa dos três `MÉDIO`: são decisões que a **Fase 1** toma agora, no modelo, e cujo custo depois só se
corrige com migration em N schemas ou com dado que nunca existiu. Nenhum é "isto vai ficar lento".

---

## 1. O que precisaria rodar para medir, do lado do banco — e por que nada rodou

Uma vez, para não repetir em cada achado. **Não rodei nada**: não há `db/`, DDL (gate 2 não se aplica a
esta ficha), aplicação nem dado. `EXPLAIN (ANALYZE, BUFFERS)` exige tabela; tabela exige `D-04` e o
veredito de grão do passo 4 — os dois abertos nesta data. O que precisaria rodar **no terminal** está no
irmão, §1.

1. Gerador sintético de fato nas faixas de cardinalidade do irmão, §3, em **um** schema: `10²`, `10⁶` e `10⁹`
   linhas de item, com distribuição de itens por venda e por estabelecimento parametrizada.
2. `EXPLAIN (ANALYZE, BUFFERS)` **frio e quente** das seis leituras já publicadas (`RN-REL-009` a `014`)
   e das três perguntas de gestão do `## Pedido` (módulo mais usado, módulo não usado, volume/pico), na
   **janela mais longa** — que aqui é semestral, a maior que já apareceu no projeto.
3. Repetir com **N schemas** e medir separadamente o **custo fixo por schema** (conexão, plano, primeiro
   bloco) do custo variável (linhas varridas). É a separação que decide `CST-03` e `CST-06`, e ela não
   aparece se você medir só um schema e multiplicar.
4. Custo de escrita: linhas/s de fato por schema com os índices do passo 4 presentes — índice em tabela
   de escrita alta é custo do **caminho de gravação**, não só espaço.

## 2. Período **aberto** — o veredito, sem amaciar

O `## Pedido` quer duas coisas que parecem uma: "**quantas operações estão acontecendo**" e "**que horas
é o pico**". Elas têm custos opostos, e separá-las é a metade útil desta seção.

**"Que horas é o pico" não é período aberto.** Pico de hora, dia ou mês **encerrado** é agregado de
período **fechado** sobre fato imutável (`RN-REL-007`, `docs/produto/modulos/relatorios.md:207-224`) —
derivação reconstruível, sem invalidação, e por isso fora da proibição de cache, exatamente como
`memory/plataforma/decision-agregado-de-periodo-fechado-nao-e-cache.md:15-19` fixou. O acompanhamento
**mensal e semestral** que o humano pediu é integralmente período fechado. Custo dele: §4.

**"Quantas operações estão acontecendo agora" é período aberto, e aí a resposta é dura.**

**Existe forma de responder sem cache? Sim — e é a mesma forma que sobrevive à fronteira.** A pergunta
tem duas versões, e elas não custam o mesmo:

- **Em unidade do negócio do cliente** (operações/hora por estabelecimento): **reprova `F1` e `F3`** da
  fronteira que o passo 2 entregou nesta ficha
  (`docs/auditorias/2026-08-23-operacao-do-provedor-e-console-de-gestao.md:79-95` e `:132-152`) —
  "operação" é a nossa palavra para a venda dele, e a hora de pico **é** a forma. Antes de ser caro, isso é
  dado de negócio, veículo `RN-PRV-010`. E é **esta** versão que exige cache, porque só ela agrega período
  aberto por cima da tabela quente do caixa.
- **Em unidade da nossa infraestrutura** (requisições, erros, itens de fila em drenagem, terminais sem
  contato — agregado sobre **todos** os clientes): passa `F1` e **não precisa de cache nem toca schema de
  cliente nenhum**, porque é medida na **nossa borda**, onde o dado já passa. Custo: `O(1)` em schemas —
  **sem fan-out** — mais `O(eventos na borda)`, trabalho que já existe.

**É este o resultado da seção,** e não é sorte: a versão da pergunta que é nossa por natureza é lida onde
o dado já é nosso; a que exige cache é a que estava pedindo o dado do cliente com outro nome. Não recuso a
**necessidade** — saber se a operação está de pé agora é legítima e é nossa. Recuso o **mecanismo** de
respondê-la contando a venda do cliente em período aberto, e o novo é melhor em três coisas verificáveis:
não tem invalidação, não tem chave por tenant (logo não tem a classe de defeito que vaza), e não gasta
nada da instância que serve o caixa.

### CST-04 — A pergunta em unidade de negócio exige cache; as três coisas a decidir antes de qualquer cache — [MÉDIO]
ONDE: `## Pedido` da T-0004 (tarefas/T-0004-gestao-de-estabelecimentos-e-operacao-do-provedor.md:20-23); `docs/produto/fatos-de-operacao-provedor.md:109-133`
(`RN-PRV-014`, que já proíbe coletar fato novo para pergunta nossa);
`memory/plataforma/decision-agregado-de-periodo-fechado-nao-e-cache.md:15-19`.
MEDIDO: nada. `ESTIMATIVA` com a conta à vista e **duas hipóteses declaradas como hipóteses**: console
recarregando a cada `r` segundos sobre `N` schemas custa `N/r` consultas por segundo, **permanentes**,
lineares em clientes e **independentes** de alguém estar olhando. Nem `r` nem `N` existem (`r` é superfície,
passo 7; `N` é `LACUNA-REL-001`). O que a conta mostra sem valor nenhum: o custo do painel ao vivo é por
**recarga × schemas**, não por pergunta — é o único tipo de leitura que degrada sem ninguém pedir nada.
CAUSA: agregado de período aberto tem invalidação por construção (o período não terminou), e por isso é
cache no sentido da proibição de `.claude/rules/performance.md`.
CRESCE COMO: `O(schemas × 1/intervalo de recarga)`, mais `O(linhas na janela aberta)` por schema.
CORREÇÃO SUGERIDA: responder a pergunta pela borda nossa (unidade de operação, agregado sobre todos os
clientes) e **não** construir agregado de período aberto sobre fato de cliente; se o humano decidir que
precisa da versão em unidade de negócio, ela entra como leitura de `RN-PRV-010` com cláusula e trilha —
dono: `produto`, com `seguranca` no gate.

**Se, ainda assim, a decisão for cache — as três coisas que se decidem *antes*, e nenhuma é minha:**
1. **O que invalida.** Fato novo no período aberto invalida o agregado daquele recorte; correção por fato
   novo (`RN-NUC-008`, `RN-REL-007`) invalida **período já encerrado** — nem o fechado é imune quando há
   correção retroativa. Quem enumera os eventos: `produto`.
2. **Qual é a chave.** Precisa de cliente, estabelecimento, recorte de tempo **e sujeito de fuso**
   (`RN-NUC-042` + `LACUNA-GLO-001`): chave sem sujeito de fuso funde dois dias diferentes em clientes de
   fusos diferentes. **Chave errada em multi-tenant é vazamento entre clientes**, e aí o assunto não é meu
   — é `seguranca`, e é o `F6` dele (forma no **repouso**, não política de leitura). Onde o agregado mora é
   `D-06`, do passo 4: **não presumo**.
3. **Quem é o dono da invalidação** — nomeado, não "quem escrever primeiro". Sem dono, o agregado envelhece
   em silêncio, e agregado velho de período aberto é pior que ausência: é apresentado como se fosse agora.

---

## 3. `LACUNA-REL-001` — as cinco medidas, e qual escolha cada uma decide

Insumo da **Fase 1**, conforme `memory/plataforma/decision-agregado-de-periodo-fechado-nao-e-cache.md:37-39`.
Confirmo o endereço e a substância. Dono da lacuna: `performance` (medida) + humano (expectativa de uso),
em `docs/produto/modulos/relatorios-semente-de-perguntas.md:213-216`.

**Aviso que precede a lista e é o mais importante dela:** estas medidas decidem o **eixo do agregado**
(venda ou item), **não** o grão do fato — que já está decidido e é fino (`RN-NUC-041`). Nenhuma linha desta
seção pode ser lida como "o `performance` disse que item é caro, então grave o total": grão grosso de fato
é irreversível, agregado grosso se refaz com uma consulta. Confundir os dois é como o pedido do humano
("qual produto não está compensando") morre sem que ninguém tenha decidido matá-lo.

| # | Medida (unidade) | Qual escolha ela decide | A função, com o limiar como grandeza |
|---|---|---|---|
| 1 | **Linhas de item por dia no maior cliente** (contagem/dia) | eixo do agregado de período fechado: **item** direto × item pré-agregado | Se `linhas/dia × dias da janela semestral × estabelecimentos` ÷ **vazão de varredura medida** (linhas/ms, `EXPLAIN` frio no servidor-alvo) **couber** no orçamento do console, o eixo é **item**, consultado direto, e nenhum agregado precisa existir. Se **não couber**, o eixo item exige agregado de período fechado por dia (derivação, não cache), e a pergunta passa a ser a #2. Limiar = orçamento do console (que **não existe**: `CST-03`) ÷ vazão medida. |
| 2 | **Itens por venda — mediano e p95** (contagem) | se **um** eixo serve as duas famílias de pergunta, ou se são dois agregados | O mediano dá o multiplicador entre os eixos (`item ≈ mediano × venda`). O que decide é a **assimetria** `p95/mediano`: baixa → o eixo **item** serve também as perguntas de venda por agrupamento, e um agregado basta; alta → a pergunta de nível venda paga a cauda do item toda vez, e aí existe um segundo agregado, por venda. Ninguém mede a assimetria, e é ela que decide. Limiar = razão `p95/mediano`, adimensional. |
| 3 | **Estabelecimentos por cliente** (contagem) | ordem das colunas de índice e necessidade de partição: `estabelecimento+instante` × `instante` | Escopo cliente é soma de estabelecimentos **dentro** de um schema (`RN-REL-006`, `relatorios.md:179-206`), então o custo é `O(estabelecimentos × linhas/estabelecimento)`. Se o maior cliente tem **muitos** e o filtro quente é "um estabelecimento, um dia", o líder do índice é estabelecimento; se quase todos têm **um**, instante-primeiro basta e o índice composto é peso morto na escrita. Decisão de modelo: **`arquiteto-dados`** — eu entrego a medida e a função, não o índice. |
| 4 | **Número de schemas** (contagem) | se **existe** desenho de fan-out que feche o orçamento, ou se o agregado precisa ser alimentado na escrita (`D-06`) | Custo do consolidado = `N × custo_fixo_por_schema` + `Σ custo_variável`. Com janela aberta e pequena, o **custo fixo domina**, e ele cresce em `N` sem nada a otimizar dentro da consulta. A medida que decide não é o total: é o **custo fixo por schema** (ms: conexão, plano, primeiro bloco) contra `N`. Se `N × custo_fixo` já estoura o orçamento, **nenhum** desenho de fan-out sobrevive e a decisão vira `D-06`. É a bifurcação mais estruturante desta lista. |
| 5 | **Cardinalidade e distribuição de motivo** (contagem; e a fração do motivo dominante) | tamanho do agregado de recusa, e se compressão de rajada é necessária | Cardinalidade é **conhecida e baixa**: 8 motivos no cliente (`fatos-de-operacao.md:262-271`) + 7 nossos (`fatos-de-operacao-provedor.md:160-168`). Consequência direta: o agregado "recusa por motivo por dia por estabelecimento" tem `O(dias × 8 × estabelecimentos)` linhas — pequeno, fechado, e agregável sem varrer o fato. **O que falta medir é a distribuição:** se um motivo concentra a maior parte do volume (candidato óbvio: `no_contact` em rajada), a cardinalidade da **tabela** é governada por ele sozinho, e é aí que a compressão de rajada de `RN-NUC-043` (infeliz) ganha ou perde o freio de custo medido. Limiar = fração do motivo dominante, adimensional. |

**Uma medida que a lista de `LACUNA-REL-001` não tem e a Fase 1 precisa:** a **razão retiradas ÷
lançamentos** (`order_item_removed` ÷ `order_item_added`). Ela decide o tamanho de uma tabela inteira e é
a única entrada do custo dos quatro fatos `PROVISÓRIA`. Sem ela, `LACUNA-NUC-038` chega ao humano sem
preço.

---

## 4. Multiplicação por cliente, e a janela semestral

O objeto desta ficha é literalmente o caso que `.claude/rules/performance.md` §2 chama de multiplicação
por cliente: **agregado por período em N schemas**, com fan-out `O(schemas)`. Sigo a forma que o registro
de memória já fixou (`:34-35`) e a estendo para o console:

- **Leitura do cliente sobre o próprio negócio** (`RN-REL-010`): `O(vendas × itens/venda)` na janela mais
  longa, vezes `O(estabelecimentos)`. Fan-out `O(1)` — um schema.
- **Leitura nossa consolidada, período fechado**: o mesmo, vezes **fan-out `O(schemas)`**, mais
  `N × custo_fixo_por_schema`.
- **Leitura nossa, período aberto**: o acima **dividido pelo intervalo de recarga** (§2, `CST-04`).

**Qual medida do pior cliente decide, e por que o pior e não a média.** A medida é **linhas varridas na
janela semestral no maior cliente ÷ vazão de varredura medida no servidor-alvo**, frio e quente. O pior
cliente decide por duas razões independentes: **(a)** o total do fan-out é soma, mas a **latência** é dada
pelo máximo — um schema lento atrasa o consolidado inteiro; **(b)** orçamento calibrado na média **exclui
em silêncio o maior cliente** do console, que é o que mais precisamos ver. Média aqui não é imprecisão: é
o mecanismo pelo qual o maior cliente desaparece do painel.

### CST-03 — O console do provedor não tem orçamento próprio nem cláusula de cessão ao caixa — [ALTO]
ONDE: `.claude/rules/performance.md` §3 (os cinco orçamentos são todos do caixa; nenhum é de superfície
nossa); precedente em `docs/produto/offline-grandezas-e-orcamento.md:54-72` (`RN-OFF-030`).
MEDIDO: nada. Achado de **ausência de orçamento**, que se confere lendo a tabela.
CAUSA: `RN-OFF-030` já estabeleceu, para a drenagem, a cláusula que falta aqui: "drenar **não compete**
com o caixa", e o orçamento do caminho crítico vale **com a fila no teto e drenando**. A drenagem ganhou
cláusula explícita por ser produtor nosso que compete com o caixa. O console é **outro** produtor nosso
que compete com o caixa, e não tem nenhuma. Enquanto `D-06` estiver aberta, a hipótese viva é que ele leia
os schemas de cliente — a **mesma instância que atende o caixa** —, então cada recarga é carga na base que
não aceita regressão, e nada manda o console ceder. E ele é o pior tipo de produtor: contínuo, independente
de quem está olhando, crescendo em `N`.
CRESCE COMO: `O(schemas × 1/intervalo de recarga)` de carga permanente na instância do caixa.
CORREÇÃO SUGERIDA: orçamento próprio do console, declarado, **mais** cláusula de cessão ao caminho crítico
no modelo de `RN-OFF-030` (a consulta do console cede recurso, é interrompível e nunca é a razão de uma
venda esperar) — dono: `produto` (a cláusula), com `arquiteto-dados` (onde a leitura mora, `D-06`).

### CST-06 — Fan-out consolidado sem desfecho declarado para schema que falha: soma parcial apresentada como total — [MÉDIO]
ONDE: consolidado nosso pedido em `tarefas/T-0004-gestao-de-estabelecimentos-e-operacao-do-provedor.md:20-23`; precedente da regra que falta em
`docs/produto/modulos/relatorios.md:155-178` (`RN-REL-005`: "não existe" nunca é apresentado como zero).
MEDIDO: nada.
CAUSA: em `N` schemas, um schema fora do ar, em manutenção, com migration em curso (falha é fato
previsto, `fatos-de-operacao-provedor.md:178`) ou estourando tempo é **normal e previsto** — mesma premissa
de `.claude/rules/migrations.md` §2 ("falhar no schema 7 de 20 é normal"). Nenhum artefato diz o que o
consolidado faz nesse caso, e o desfecho plausível é o pior: somar os que responderam e apresentar como
total. É a nossa versão exata do defeito que `RN-REL-005` proíbe do lado do cliente — ausência apresentada
como zero — e no consolidado ela é indetectável, porque ninguém sabe quanto o ausente teria somado.
CRESCE COMO: probabilidade de ao menos um schema indisponível cresce com `N`; a `10²` schemas é
condição de rotina, não exceção.
CORREÇÃO SUGERIDA: todo número consolidado declara sobre **quantos e quais** schemas foi computado, e
recusa-se a ser apresentado como total quando incompleto — dono: `produto` (a regra), `backend` (a forma
da resposta).

---

## 5. Retenção e volume — a conta em forma, e a grandeza que o humano decide

"Guardar para sempre para poder analisar depois" tem custo, e ele é **linear em três fatores
multiplicados**, que é o pior formato possível para um número que ninguém escolheu:

**A conta, em forma** (rotulada `ESTIMATIVA` porque nenhum operando é medido — só a forma é entregável):

```
espaço(classe k) = taxa_k [linhas/dia] × janela_k [dias] × (largura_k + índices_k) [bytes/linha] × N_schemas
```

Quatro leituras que a forma entrega sem número nenhum:
1. **Retenção é o único fator que alguém escolhe:** `taxa_k` é o negócio do cliente, `largura_k` é o
   modelo, `N` é comercial. `janela_k` é decisão — e é a única.
2. **Índice pode custar mais que o dado:** em tabela de fato estreita e muito indexada `índices_k` supera
   `largura_k`, e a decisão de índice é do `arquiteto-dados`.
3. **`N_schemas` multiplica tudo**, inclusive o que foi guardado "porque é pequeno".
4. **As classes não têm a mesma liberdade:** fiscal e financeiro têm prazo externo e são append-only
   (`.claude/rules/dados.md` §4) — `janela` deles **não** é nossa. Recusa, conectividade, periférico e
   ciclo de vida do pedido não têm prazo declarado nenhum e são as de maior `taxa`. Os fatos nossos
   (`provider_*`) têm `taxa` baixa e valor de prova alto — guardá-los é barato, e `RN-PRV-011` depende
   disso. Os de ciclo de vida (`tenant_provisioned`, `module_state_change`, `migration_applied`) são
   `O(atos)`, os mais baratos do conjunto.

**A grandeza que o humano decide** (não o valor — a grandeza): **janela de retenção por classe de fato**,
em dias, com uma janela por classe e não uma para todas. É `LACUNA-NUC-040`
(`fatos-de-operacao.md:347-351`), cuja proposta é do passo 4. **Não palpito grão nem retenção: é
`PERGUNTAS` ao `arquiteto-dados`.**

**Nota de convergência com o passo 4 (lido em disco depois de escrito este relatório, 2026-08-23).** A
seção de retenção do `arquiteto-dados` na ficha da T-0004 separa **três relógios** — obrigação · prova
(trilha) · discricionário — e isso **corrige a unidade** que eu usei acima: a janela não incide sobre
"classe de fato", incide sobre **relógio**, e custo medido só é argumento legítimo no terceiro. `CST-05`
sobrevive e fica mais preciso: a cláusula "retenção ≥ janela mais longa" pertence ao relógio **3**; nos
relógios 1 e 2 a janela é externa (prazo legal, cláusula de `RN-PRV-010`) e nenhuma leitura nossa a
encurta. Ele também acrescenta dois custos que a minha conta acima **não tinha** e que são dele:
**janela de migration** (quanto mais retido, mais caro cada mudança de estrutura em N schemas, e
`migrations.md` §5 já diz que constraint e mudança de tipo em tabela grande vão pelo ciclo de quatro
etapas) e **tempo de restauração**, que em PDV se mede em caixa parado. Acolho os dois: são custo de
retenção que eu havia deixado de fora.

### CST-05 — Retenção por classe e teto de janela de leitura são o mesmo número por dois lados, com dois donos e nenhuma regra ligando — [ALTO]
ONDE: `docs/produto/fatos-de-operacao.md:347-351` (`LACUNA-NUC-040`, dono `arquiteto-dados` + humano);
`docs/produto/modulos/relatorios-semente-de-perguntas.md:213-216` (`LACUNA-REL-001`, dono `performance` +
humano); regra do lado do cliente que falta do nosso lado em `docs/produto/modulos/relatorios.md:155-178`.
MEDIDO: nada. Achado de **relação ausente entre duas lacunas**, conferível lendo as duas.
CAUSA: retenção define até onde o fato existe; teto de janela define até onde a leitura pede. Mesmo número
por dois lados, hoje em duas lacunas, com **dois donos**, e nenhuma cláusula ligando. Duas consequências,
e a segunda é a séria: **(a)** o acompanhamento **semestral** põe **piso** na retenção de toda classe que
ele lê — escolher retenção sem saber a janela mais longa é escolher, sem perceber, que o relatório
semestral não existe; **(b)** retenção abaixo da janela devolve série **truncada** e nada obriga a declarar
o truncamento. `RN-REL-007` proíbe reescrever histórico e `RN-REL-005` proíbe apresentar inexistência como
zero — nenhuma das duas fala de dado **descartado por retenção**, que chega ao leitor com a mesma cara de
"vendeu menos".
CRESCE COMO: o dano não cresce em volume, cresce em **irrecuperabilidade**: passada a janela, o fato não
existe mais e nenhuma decisão futura o recupera.
CORREÇÃO SUGERIDA: fechar `LACUNA-NUC-040` e `LACUNA-REL-001` **na mesma passada**, com a cláusula
"retenção de uma classe é ≥ a janela mais longa de qualquer leitura publicada sobre ela, e janela
truncada por retenção é declarada como inexistente, nunca apresentada como valor" — dono: `produto` (a
cláusula), `arquiteto-dados` + humano (os números).

## 6. O que eu **não** consegui verificar — e não aprovo por ausência de evidência

1. **Nenhum número, de nenhuma natureza.** Sem banco, DDL, aplicação e terminal, não houve `EXPLAIN`,
   tempo real, contagem de consultas nem tamanho de bundle. Todo `O(...)` aqui é forma derivada de spec.
2. **Não afirmo orçamento estourado.** `CST-01` diz que o **freio por custo medido não é exercitável**, o
   que é diferente e é o que o disco sustenta.
3. **Não avaliei grão nem retenção** — passo 4, do `arquiteto-dados`; onde precisei, virou `PERGUNTAS`.
4. **Não li** as specs de módulo (`MSA`, `COZ`, `PCF`, `PER`, `EMI`) além do que `fatos-de-operacao*.md`
   afirma delas; os fatos de módulo não estão enumerados (passo 3), então o volume que eles acrescentam a
   esta conta é **desconhecido e não estimado**.
5. **Não presumi `D-06`.** Onde o custo depende de onde o agregado mora, disse que depende e parei.
6. **Não conferi na fonte** `RN-NUC-001`, `RN-NUC-003`, `RN-NUC-008`, `RN-NUC-013`, `RN-FIS-004/005`,
   `RN-REL-009`, `RN-REL-012`, `PN-01`, `PN-15`: citei-os pelo que `fatos-de-operacao*.md`,
   `roadmap-de-modulos.md` e a auditoria do passo 2 afirmam deles.

## 7. Reincidência

Nada reincidente: não há achado de `performance` anterior neste repositório. As três correções de premissa
do registro de memória **seguem válidas** — pré-agregação no `platform` continua restrição (com o corolário
`F6` do passo 2); paginação continua limitando saída e não entrada (produz `CST-05` e a linha
`order_item_added` da §3 do irmão); e transferir o dono continua não transferindo o custo, que é `CST-03`
reaparecendo em outra superfície com outro nome.

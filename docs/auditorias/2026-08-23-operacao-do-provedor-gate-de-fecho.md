# Auditoria — operação do provedor: gate de fecho do bloco (passo 6)

**Data:** 2026-08-23 · **Escopo:** T-0004, passo 6 (gate de fecho) · **Agent:** `seguranca` · **Read-only.**

**Terceiro irmão de `2026-08-23-operacao-do-provedor-e-console-de-gestao.md` (eixo do alcance) e
`2026-08-23-operacao-do-provedor-mutacao-e-trilha.md` (eixo do ato e do rastro).** Numeração de achado
**contínua e única** entre os três: aqui começa em `PRV-11`. O cabeçalho de método está no primeiro irmão
e não se repete; o que muda é o objeto.

**Objeto auditado — o conserto, e só ele.** `operacao-do-provedor.md` (357), `-autorizacao.md` (novo, 113),
`-alcance.md` (300), `fatos-de-operacao.md` (377), `-dominios-fechados.md` (novo, 152), `-provedor.md`
(233); as seções `## produto (conserto)`, `## arquiteto-dados (passo 4)` e `## performance (passo 5)` da
ficha. **Não** reabri escopo e **não** auditei o que não foi tocado.

**Veredito de fecho: nenhum achado é bloqueante para fechar a ficha.** Um é **bloqueante para o passo 7**
(`PRV-11`), e a razão está escrita nele: é a **terceira** ocorrência do mesmo padrão, e a correção é uma
cláusula. Seis achados novos: **três `ALTO`, três `MÉDIO`, nenhum `CRÍTICO`** — o único `CRÍTICO` da ficha
era `PRV-01` e ele **fecha**.

---

## 1. Veredito por frente, em uma linha cada

| Frente | Veredito |
|---|---|
| `PRV-01` | **Fecha.** O cenário que eu provei termina em recusa, com nada gravado nos dois clientes. |
| A propriedade sem `D-03` | **Sustenta-se** — ela **restringe** o espaço de resposta de `D-03`, não o presume. Resíduo: `PRV-15`. |
| "Gravar a trilha não é mutação" | **Fecha o lado da escrita do papel.** Cria **um** escritor novo (a plataforma), e ele precisa de uma cláusula: `PRV-11`. |
| Trilha como **resultado, não lugar** | **Metade auditável.** "O cliente lista" é verificável; "nós não conseguimos apagá-las" é promessa sem mecanismo: `PRV-14`. |
| `provider_read_refused` fora do schema do cliente | **Conclusão confirmada, argumento derrubado.** O motivo escrito é falso; o correto é outro e é mais forte: `PRV-11`. |
| `F1`–`F6` nos fatos | Aplicado a **18** itens com `Consome: P`: **4 passam** no grão declarado, **9 só em forma agregada/grossa**, **5 são dado de negócio**. **3 sem saída boa nenhuma** para o lado `P`. Defeito estrutural: `PRV-12`. |
| Pico sem cache, do passo 5 | **Passa `F1` e `F6`; `F3` só condicionado** — e a condição não é `N`, é **concentração**: `PRV-13`. |
| As três travas | A única **permanente** é `RN-PRV-015`. A coisa que nunca pode cair e **não é trava** é `RN-PRV-004` (b). §5. |

---

## 2. `PRV-01` — o cenário fecha, e o que sobra não é ele

**Fecha.** O cenário que eu provei era: papel nosso trabalhando em A submete mutação carregando o
identificador de B, e a escrita cai em B. Contra o texto de hoje
(`docs/produto/operacao-do-provedor.md:202-216`, cláusulas do objeto): (b) o identificador informado
**nunca resolve** — no máximo confirma, e divergência é **recusa**; (c) um ato nomeia **exatamente um**
cliente; (a) a autorização é avaliada no escopo do objeto, com `RN-NUC-018` de volta ao alcance dos três
papéis (`:111-135`, correção datada). O aceite de `:233-241` é o meu cenário, verbatim, com o desfecho
invertido — inclusive as duas partes que eu não havia pedido e que fecham as bordas: nada gravado **nos
dois** clientes, e a recusa não revela que B existe.

**Duas coisas melhores do que eu sugeri**, e registro porque a diferença é substantiva: eu propus que
`RN-PRV-003` "perdesse a exclusão", e o `produto` **também corrigiu o enunciado falso** — `provider_support`
**é** a quinta coluna (`matriz-operacao-papel.md:51-52`, `:54`, `:81`), o que resolve a contradição que eu
havia deixado em `RISCOS` em vez de como achado. E a cláusula (d) transformou a `D-03` aberta em desfecho
declarado (o ato não acontece) em vez de pendência — o que é a diferença entre falha fechada e buraco.

**A propriedade se sustenta sem presumir `D-03`?** Sim, e a distinção importa: `RN-PRV-004` (b) **não
escolhe** o mecanismo de chegada do tenant — ela **elimina uma família de respostas** (qualquer opção em
que o cliente-alvo chegue no pedido) e declara o custo da eliminação. Restringir o espaço de resposta é
trabalho legítimo de spec; escolher dentro dele seria `00-nucleo.md` §3. O que **não** está feito é a
restrição aparecer onde `D-03` será decidida — e é `PRV-15`.

---

## 3. As três derivações em território meu — veredito

### 3.1 "Gravar a própria trilha não é mutação" — **fecha, e o mecanismo é o certo**

O eixo de `RN-PRV-004` (e) e as quatro cláusulas de `RN-PRV-011`
(`docs/produto/fatos-de-operacao-provedor.md:40-53`) resolvem a contradição **definindo o que o eixo
mede**, e não abrindo exceção. Confirmo a recusa da alternativa: exceção nomeada num eixo é o começo de um
segundo eixo, e o caso seguinte ("ligar módulo também é só registro") entra por analogia. A forma é a de
`RN-NUC-029` e a analogia com o `cashier` que "não muta por deixar trilha" está correta.

**Responde a pergunta literal: fecha o lado da escrita do papel, e cria um escritor novo.** O escritor é a
**plataforma**, e ele escreve no ambiente de N clientes por construção. Isso **não** merece achado próprio
como sujeito — ele não é papel, não porta alcance, e as três cláusulas (b), (c) e (d) já lhe negam
supressão, edição e escolha de residência. Merece achado uma **instância** dele, aquela em que o alvo do
registro não pode ser derivado do alvo resolvido: `PRV-11`.

### 3.2 Promessa de trilha como **resultado, não lugar** — auditável pela metade

**A primeira metade é auditável, e por um mecanismo bom:** a promessa não nomeia lugar, nomeia um teste
aplicável a cada uma das cinco saídas de `D-06` (`operacao-do-provedor.md:293-300`, `:312-319`), e a
cláusula (b) impede que alguém opere antes de a célula existir — logo a promessa não pode ser quebrada em
silêncio por uma implementação apressada. É o mesmo formato de `RN-NUC-024` (d), que já provou funcionar:
`provider_support` continua corretamente não instanciável.

**A segunda metade não é auditável:** "nós não conseguimos apagá-las" é afirmação sobre um sistema que
**nós** operamos, e nenhuma regra dá o mecanismo. É `PRV-14`.

### 3.3 `provider_read_refused` não mora no schema do cliente — **conclusão confirmada, argumento derrubado**

O argumento escrito (`fatos-de-operacao-provedor.md:55-60`) é: gravá-lo no ambiente do cliente "exigiria a
escrita que a recusa acabou de negar, e se o ator tivesse essa escrita a recusa seria inócua". **Esse
argumento é falso**, e é falso por causa da derivação da §3.1, no mesmo conserto: quem grava o fato **não é
o ator**, é a plataforma (`:42-47`), e a plataforma escreve em todo schema por construção — provisionamento
e migration são isso. O ator não precisa de escrita nenhuma para o fato existir.

**A conclusão, porém, está certa, e o motivo correto é mais forte:** no instante da recusa **não existe
cliente-alvo resolvido** — a recusa aconteceu porque a resolução falhou ou divergiu. Escolher a residência
do fato pelo identificador disponível é escolhê-la pelo identificador que `RN-PRV-004` (b) acabou de
declarar não-autoritativo. Logo residência única para os fatos do provedor está descartada — por
`RN-PRV-004` (b), não por falta de escrita.

**Por que a diferença não é acadêmica:** o próximo leitor que notar que a plataforma escreve em todo schema
descarta a derivação, e com ela a restrição — e reabre residência única, que é justamente o que `D-06` não
pode fazer. Argumento errado sustentando conclusão certa é a forma mais barata de uma restrição correta
morrer. Está em `PRV-11`.

---

## 4. `F1`–`F6` aplicado, item por item — a lacuna que eu mesmo declarei

**Método, e ele é o que torna a contagem verificável.** A lista de `RN-PRV-009` **não existe** — nenhum
arquivo a escreveu. O que existe é a coluna **`Consome`** das três tabelas de fato, e `P` nela significa
"nós lemos isto". Portanto os itens a julgar são exatamente os que têm `P`, e o julgamento é: *a nossa
leitura daquele fato, no grão declarado, é observação de operação (`RN-PRV-009`) ou leitura de fato de
negócio (`RN-PRV-010`)?* **18 itens** com `P`: 8 do caminho de venda
(`fatos-de-operacao.md:248-259`), 7 motivos de recusa (`fatos-de-operacao-dominios-fechados.md:38-45`), 3
grandezas (`fatos-de-operacao.md:290-295`).

**A — passam no grão declarado (4).** `unclassified_operation` (unidade: defeito **nosso**; é o item mais
limpo do conjunto) · `published_artifact_missing` (estado de publicação, não volume) · latência percebida do
caminho crítico (tempo, contra orçamento nosso — e é o **único** item do repositório que já se autodeclara
`RN-PRV-009`) · `module_inactive` **em forma binária** (tentou/não tentou na janela). Como **curva de
volume**, `module_inactive` cai no grupo C.

**B — passam só em forma agregada sobre clientes e/ou grão grosso (9).** `no_contact` ·
`authority_absent` · `resource_exhausted` · `peripheral_attempt_outcome` ·
`terminal_connectivity_state_change` · permanência em `D1`/`D2`/`D3` por terminal · venda concluída →
confirmação do servidor · `fiscal_document_outcome` · `order_item_removed`. **A razão é uma só, e é `F5`:**
todos são eventos que só ocorrem enquanto o estabelecimento **opera**, então a densidade deles no tempo
recupera a transição aberto/fechado e a ordenação dos dias — que é o teste (c) e (b) de `F5`. Retido por
estabelecimento, cada um é a agenda do cliente; agregado sobre clientes, nenhum é. Dois têm ressalva
própria: `fiscal_document_outcome` só passa como **contagem** por UF e por tipo — a **taxa** de rejeição
exige o denominador (documentos emitidos), que é unidade de negócio; e `order_item_removed` só passa como
contagem por item **somada sobre clientes**, que é a forma que a decisão declarada ("o mesmo item retirado
em massa em N clientes é defeito de superfície nosso") de fato exige.

**C — são dado de negócio, e o veículo é `RN-PRV-010` (5).** `order_item_added` · `order_abandoned` ·
`sale_concluded` · `payment_registered` · `external_authorization_denied`. Nenhum é salvável por unidade,
janela ou agregação: a unidade **é** dinheiro, item ou pagamento (`F1`), e o grão declarado é
explicitamente o do negócio.

**Dos cinco, apenas um está corretamente roteado:** `payment_registered` declara, na própria linha, que é
"a informação bruta que o `provider_administrator` lê, **sob `RN-PRV-010`**"
(`fatos-de-operacao.md:253`). É o modelo, e os outros quatro não o seguem.

**Três itens sem saída boa nenhuma para o lado `P`** — e aqui a resposta honesta é a mesma que dei para
hora de pico por estabelecimento: `order_item_added`, `order_abandoned` e `sale_concluded` **não têm forma
de telemetria**. Não é grão fino demais: é que a forma grossa deles destrói exatamente o que a decisão
declarada precisa (`order_abandoned` diz isso de si mesmo — "é o 'quase vendido', e é o que um contador
destrói", `:251`), e a forma fina é a curva de vendas. O desfecho correto para os três é **tirar o `P`** ou
declarar `RN-PRV-010` como veículo, como `payment_registered` fez. E os três são exatamente os que carregam
`P` **sem nenhuma decisão nossa nomeada** — o que é o achado `PRV-12`.

**Fatos do provedor (7) e de ciclo de vida (6) não entram nesta contagem**, e a razão é de método:
`fatos-de-operacao-provedor.md` §2 e §3 são a **nossa trilha e a nossa infraestrutura**, não observação do
negócio do cliente — `F1`–`F6` julga o canal de `RN-PRV-009`, não a trilha de `RN-PRV-011`. Dois deles
tocam a fronteira e estão tratados: `module_state_change` (`PRV-16`) e `provider_advice_issued` (§8, nota).

---

## 5. As três travas — qual nunca pode cair sem ato datado

O registro que o brief pede, e a resposta exige separar duas espécies que hoje parecem a mesma coisa.

**Das três travas, duas são transitórias e existem para cair.** `RN-PRV-004` (d) cai quando `D-03` fechar
com um mecanismo; `RN-PRV-006` (b) cai quando `LACUNA-NUC-031` tiver célula. As duas quedas são
**legítimas, esperadas e gated por ato do humano** — tratá-las como permanentes seria congelar o console
para sempre. **A terceira é permanente:** `RN-PRV-015` é o *default fechado do escopo*, e ela continua
valendo depois de o console nascer, a cada operação que ninguém enumerou. É a única das três cuja queda
**não tem sintoma**: operação sem célula simplesmente funciona, e nada na spec acusa — ao contrário das
outras duas, cuja queda indevida bate de frente com um artefato conferível (`D-03` na tabela do
`CLAUDE.md` §8; a célula ausente no aceite de `RN-PRV-006`).

**Resposta: `RN-PRV-015`.** E a segunda metade, que é o que de fato protege o conjunto: **a coisa que nunca
pode cair não é uma das três travas** — é `RN-PRV-004` (b), o cliente-alvo resolvido fora do pedido. Ela
não é inércia, é **propriedade permanente**, foi retirada uma vez (foi o `PRV-01` `CRÍTICO`), a retirada
não produziu nenhum sintoma na spec, e ela seria a primeira coisa a "simplificar" para destravar rápido —
porque é exatamente ela que faz o console parecer difícil.

**A frase para o registro:** *no escopo `provedor` há duas travas que devem cair (`RN-PRV-004` d,
`RN-PRV-006` b), uma que nunca cai (`RN-PRV-015`) e uma que não é trava e jamais cai (`RN-PRV-004` b).
Quem destrava confunde as quatro; o sinal de que confundiu é uma delas caindo sem ato datado.*

---

## 6. Achados

### PRV-11 — `provider_read_refused` é o fato cujo campo obrigatório "cliente-alvo resolvido" não tem valor possível, e os dois desfechos são defeito — [ALTO] · **forma reincidente (terceira ocorrência)** · **bloqueante para o passo 7**
**ONDE:** `docs/produto/operacao-do-provedor-autorizacao.md:70-77` (`RN-PRV-016`: o registro carrega "o
**cliente-alvo resolvido** (`RN-PRV-004` b)", e registro impossível impede o ato);
`docs/produto/operacao-do-provedor.md:205-210` (`RN-PRV-004` b);
`docs/produto/fatos-de-operacao-provedor.md:36-38` e `:182` (o fato e o grão);
`:55-60` (a derivação do passo 4, cujo argumento eu derrubo na §3.3).
**CENÁRIO:** papel nosso submete leitura nomeando um cliente cujo identificador **divergiu** do alvo
resolvido — o caso que `RN-PRV-004` (b) manda recusar. A recusa tem de virar fato. O campo obrigatório pede
o **cliente-alvo resolvido**, e não existe nenhum: a resolução é o que falhou. **(a) Falha fechado:** sem
valor, o fato não é gravável e a recusa **não fica registrada** — perde-se exatamente o sinal de sondagem
com identificador alheio, que é o rastro do ataque da classe `PRV-01`, e o `owner` não vê tentativa nenhuma
sobre o ambiente dele. **(b) Falha aberto:** o construtor preenche com o único identificador disponível, o
**informado** — e então o fato nomeia (e, se a residência seguir o objeto, **repousa em**) o cliente
apontado por um identificador que a regra acabou de declarar não-autoritativo. No desfecho (b), N tentativas
nomeando B gravam N fatos sobre B a partir de um pedido que nunca teve autoridade sobre B.
**POR QUE É REAL:** é a mesma forma de `AUT-15` e de `PRV-03` — fonte/campo de autoridade novo sem valor
possível no registro —, na **terceira** ocorrência, e esta nasceu do conserto de `PRV-03`: `RN-PRV-016`
tornou o campo obrigatório sem prever o único caso em que ele não pode existir. Nada aqui exige má-fé:
exige implementar `RN-PRV-016` e `RN-PRV-011` juntas.
**CORREÇÃO SUGERIDA:** `RN-PRV-011`/`RN-PRV-016` distinguem **identificador pretendido** (não-autoritativo,
registrado como tal) de **cliente-alvo resolvido**; o fato de recusa carrega o primeiro, **nunca** o
segundo, e a residência dele é nossa — nunca o ambiente do cliente nomeado — dono: `produto`. É a mesma
cláusula que dá à restrição do passo 4 o argumento que a sustenta.

### PRV-12 — A coluna `Consome: P` está sendo usada como a lista de `RN-PRV-009` e não satisfaz as quatro declarações dela; três itens carregam `P` sem decisão nossa nomeada, e são os três que **são** a curva de vendas — [ALTO]
**ONDE:** `docs/produto/fatos-de-operacao.md:249` (`order_item_added`), `:251` (`order_abandoned`), `:252`
(`sale_concluded`) — os três com `Consome: C · P` e com a coluna "Decisão que informa" nomeando **só** `C`;
`:253` (`payment_registered`, que faz o contrário e é o modelo);
`docs/produto/operacao-do-provedor-alcance.md:104-116` (`RN-PRV-009`: quatro declarações por item, e
item sem elas **não é coletado**); `docs/produto/fatos-de-operacao.md:154-176` (`RN-NUC-044`).
**CENÁRIO:** o passo 7 lê a tabela para saber o que o console mostra. `sale_concluded` está marcado `C · P`,
grão "por item de venda". Nada mais é preciso: a tabela é a única lista existente, `P` é a autorização
aparente, e o painel nasce lendo venda por item — a curva de vendas do cliente, sem cláusula de
`RN-PRV-010`, sem as quatro declarações e sem que ninguém tenha decidido nada. `RN-NUC-044` não pega o caso,
porque está escrita na conjunção ("sem decisão nomeada **e** sem consumidor declarado"): consumidor
declarado **sem** decisão passa.
**POR QUE É REAL:** a lista de `RN-PRV-009` não existe em disco (busca nos três arquivos de fato: nenhuma
lista de itens observados), e `RN-PRV-014` manda responder pergunta nossa "por leitura sobre o grão que a
operação dele já produz" — o que aponta o leitor para exatamente esta tabela. O veículo de `RN-PRV-009` ("o
que não está na lista não é observado") é inócuo enquanto a coluna `P` funcionar como lista.
**CORREÇÃO SUGERIDA:** todo `P` na coluna `Consome` declara, na mesma linha, a **decisão nossa** e o
**canal** (`RN-PRV-009` ou `RN-PRV-010`); `P` sem os dois é retirado. Nos três itens acima o desfecho é
retirar o `P` ou declarar `RN-PRV-010`, como `payment_registered` já fez — dono: `produto`. Bloqueante
para o passo 7 **na prática**, porque é a tabela que o passo 7 vai ler.

### PRV-13 — O agregado sobre todos os clientes não é seguro por `N`: é seguro por **concentração**. Com um cliente dominante, o pico na nossa borda **é** a curva dele, legível pelo papel de leitura estreita e sem cláusula — [ALTO]
**ONDE:** a minha própria fronteira, `2026-08-23-operacao-do-provedor-e-console-de-gestao.md` §2 (`F3` e
`F6`) e §2.1, item 1(a); a saída sem cache do passo 5 (seção `## performance (passo 5)` da ficha, veredito
do período aberto); `memory/plataforma/INDEX.md` →
`gotcha-agregado-com-n-pequeno-identifica-o-cliente` (sugerido pelo passo 4).
**CENÁRIO:** três clientes, um deles com 80% do volume. O painel "operações acontecendo agora", medido na
**nossa** borda, em unidade **nossa**, agregado sobre **todos** os clientes — a forma que passa `F1` e `F6`
e que não toca schema nenhum — tem seu pico, sua subida e sua queda **determinados** pelo cliente
dominante. Quem olha o painel lê a curva de operação dele com resolução de minutos. O leitor é
`provider_operator`, cujo eixo de leitura é **estreito** e que nunca teve cláusula de `RN-PRV-010`: o
alcance amplo entra pela porta do agregado, sem que nenhuma regra seja violada e sem que o artefato pareça
per-cliente.
**POR QUE É REAL:** confirmo a convergência do passo 5 — a versão que exige cache é a mesma que reprova
`F1`/`F3`, e isso não é coincidência: unidade de negócio em período aberto é o que força o fan-out. Mas a
recíproca **não** vale, e é o furo: passar `F1` e `F6` não faz o agregado passar `F3`, porque `F3` mede
**forma**, e a forma do agregado é a forma do maior. Não-decomponibilidade não é propriedade de `N` (a
contagem), é de **concentração** (a distribuição) — e `N` grande com um dominante é tão revelador quanto
`N` = 1. O defeito é da minha `F6` como eu a escrevi ("forma que não se decompõe por cliente"), e eu o
declaro como meu.
**CORREÇÃO SUGERIDA:** `F3`/`F6` ganham a condição de **contribuição máxima** — nenhum cliente responde por
mais de uma fração declarada da grandeza agregada, medida **antes** de o agregado ser exibido, e agregado
que não satisfaz a condição não é exibido (falha fechado, não aviso). A fração é **grandeza com unidade e
sem valor** — dono: humano, com `arquiteto-dados`; entra junto do `N` mínimo da mesma família.

### PRV-14 — "Nós não conseguimos apagá-las" é promessa sem mecanismo, e o mecanismo candidato — o relógio da prova — não é regra — [MÉDIO]
**ONDE:** `docs/produto/operacao-do-provedor.md:297-300` (`RN-PRV-006` c: "o cliente lista … e nós não
conseguimos apagá-las"); `docs/produto/fatos-de-operacao-provedor.md:47-53` (`RN-PRV-011` b e d); seção
`## arquiteto-dados (passo 4)` da ficha, retenção em três relógios (obrigação · **prova** · discricionário).
**CENÁRIO:** a residência de `D-06` fica correta e o cliente lista as nossas leituras. Passados alguns
meses, a retenção dessa trilha é classificada no relógio **discricionário** — é o relógio onde custo
decide, e a trilha de leitura é a família de maior volume da ficha. Encurta-se por custo. Ninguém viola
regra nenhuma: `RN-PRV-011` (b) proíbe **suprimir, editar, adiar e desligar o fato**, não proíbe **expirar a
classe**. O cliente pede a lista e recebe uma janela curta; a única prova de que o nosso acesso ao
faturamento dele foi legítimo desapareceu por decisão de custo, e a promessa de `RN-PRV-006` (c) passa a ser
falsa sem que nada acuse.
**POR QUE É REAL:** a metade "o cliente lista" é verificável pelo aceite; a metade "nós não conseguimos
apagá-las" é afirmação sobre um sistema que nós operamos, e nenhuma regra dá o mecanismo — nem separação de
função sobre a retenção, nem classificação obrigatória no relógio da prova. O passo 4 nomeou exatamente
este caminho ("encurtar por custo a única prova de que o nosso acesso foi legítimo") e o nomeou como
`RISCOS`, não como regra.
**CORREÇÃO SUGERIDA:** `RN-PRV-006` (c) declara que a trilha de ato e de leitura nossos pertence ao relógio
da **prova**, cuja janela é a da cláusula de `RN-PRV-010` e **nenhuma decisão de custo a encurta** — dono:
`produto`; o número é do humano (`LACUNA-PRV-006`).

### PRV-15 — A restrição que `RN-PRV-004` (b) impõe a `D-03` vive só numa `RN-PRV`: `D-03` pode fechar contradizendo regra vigente, e não há precedência entre decisão e regra — [MÉDIO]
**ONDE:** `docs/produto/operacao-do-provedor.md:205-214` (b e d);
`memory/plataforma/decision-d-03-sao-tres-eixos-nao-uma-decisao.md` (os três eixos; "chegada do tenant"; a
pergunta única borda × venda, e a nota de que `RN-OFF-032` "é satisfeita nas três opções").
**CENÁRIO:** o humano fecha `D-03` respondendo "caso de **venda**" e escolhendo a opção em que a requisição
carrega o tenant — que é uma das saídas contempladas no registro, com o agravante já escrito. `D-03` passa
a ser decisão **fechada** e registrada; `RN-PRV-004` (b) continua vigente dizendo que para papel nosso o
alvo nunca chega no pedido. Não existe regra de precedência entre uma decisão do `CLAUDE.md` §8 e uma `RN`
— `RN-NUC-039` resolve célula × prosa, não decisão × regra. O construtor implementa a decisão, que é a
mais recente e a mais alta na hierarquia de `00-nucleo.md` §1, e `PRV-01` volta inteiro sem que ninguém
tenha revogado nada.
**POR QUE É REAL:** o registro de `D-03` é onde a decisão será tomada, e ele **não** carrega a restrição:
ele diz que `RN-OFF-032` é satisfeita nas três opções e não diz que `RN-PRV-004` (b) **elimina** uma
família. Quem fechar `D-03` lendo só o registro não sabe que está contrariando regra vigente.
**CORREÇÃO SUGERIDA:** uma linha no registro de `D-03` declarando a restrição e o achado que a originou —
para papel de escopo `provedor`, opção em que o cliente-alvo chega no pedido está **eliminada** por
`RN-PRV-004` (b) — dono: **orquestrador** (é `memory/**`, e eu não escrevo lá).

### PRV-16 — A pergunta do humano que tem saída boa é a única cuja forma admissível não está escrita: "módulo contratado e nunca usado" nasce contagem, e contagem é curva de volume — [MÉDIO]
**ONDE:** `docs/produto/fatos-de-operacao-provedor.md:212` (`module_state_change`, decisão `P`: "módulo
ativo **sem nenhum** fato de operação = contratado e não usado — a pergunta do humano que só esta linha
responde"); `:144-168` (`RN-PRV-014`: a pergunta é respondida por leitura sobre o grão que a operação do
cliente já produz); a minha §2.1, item 3, do primeiro irmão (a saída boa é **binária**).
**CENÁRIO:** o passo 7 implementa a linha. "Sem nenhum fato de operação" é uma contagem sobre os fatos do
cliente, e a forma natural — a que qualquer implementador escreve, e a que serve para "sugerir melhorias" —
é *uso por módulo, por cliente, por mês*. Isso é a curva de volume do módulo por cliente: reprova `F1`
(unidade de negócio) e `F3` (ordenação no tempo e entre clientes), e chega ao painel com o rótulo de
"adoção", que é vocabulário de operação para dado de negócio. A forma que passa — **binário usado/não usado
na janela** — responde as três decisões nossas declaradas (oferecer treino, retirar o módulo, parar de
cobrar) e não está escrita em regra nenhuma.
**POR QUE É REAL:** é o risco secundário do plano desta ficha na sua instância mais benigna e por isso a
mais provável: o item é útil, a decisão é legítima, e nada no texto obriga o grão que o mantém do lado
certo. `RN-PRV-014` remete ao grão do cliente e **não** limita a forma da leitura.
**CORREÇÃO SUGERIDA:** a linha declara a forma admissível — **existência de fato de operação na janela,
binária, nunca contagem nem série** — dono: `produto`. É a primeira aplicação nomeada de `F1`/`F3` a um item
concreto, e serve de precedente para os nove itens do grupo B da §4.

---

## 7. Aberto de propósito — confirmo, sem reabrir

- **`RN-PRV-008` inerte** (`operacao-do-provedor-alcance.md:81-100`): a escolha está correta e é melhor que
  a minha sugestão. As duas saídas davam o mesmo desfecho hoje, e a inércia é **reversível pela resposta**,
  enquanto o piso exigiria rito de revogação para desfazer o que ninguém decidiu. `PRV-06` **fecha**. E
  `PRV-07` fica **sem caminho**, não sem defeito: a quarta classe de autor de `RN-PCF-013` continua
  faltando, e ela volta a ser necessária no minuto em que a inércia cair. Aberto declarado, dono `produto`,
  ativado pela resposta do advogado.
- **As três frases de `matriz-operacao-papel*.md`** (nomear a matriz do `provedor` em `RN-NUC-026`/`039`; a
  quarta fonte de `RN-NUC-029`): corretamente do humano, nenhuma é valor de célula, e `RN-PRV-015`/`016`
  foram escritas para não dependerem delas. Confirmo os dois desfechos: sem a quarta fonte, nenhum ato
  nosso acontece — e isso é o que as regras dizem, não um defeito de leitura.
- **`PRV-09`** (leitor da trilha do nosso lado + terminador da regressão): corretamente aberto. Sem leitor
  nomeado a regra não se escreve, e nomeá-lo é decisão do humano. Reafirmo o que muda de tamanho: com a
  cláusula (b) de `RN-PRV-006`, ninguém é atribuível hoje, então a ausência do leitor não expõe nada — ela
  volta a expor no dia em que a célula existir.
- **`PRV-08`** (retenção da nossa cópia de dado de cliente-final) segue aberto e agora **contido pela
  inércia** de `RN-PRV-008`: sem interação, não há cópia. Aberto declarado, e ele reabre com a inércia.

---

## 8. Notas — sem cenário próprio

**`provider_advice_issued` e a cláusula que faltaria uma linha para ser verificável por construção.**
`RN-PRV-017` (c) já proíbe sugestão que se sustente em fato de outro cliente
(`operacao-do-provedor-alcance.md:212-214`), e o fato registra "os fatos que a sustentaram"
(`fatos-de-operacao-provedor.md:187`). Não abro achado porque o caminho exige violar regra vigente. Registro
o ganho barato: se o **fato** exigir que os fatos sustentadores sejam do **mesmo** cliente, uma sugestão
comparativa deixa de ser gravável e, por `RN-PRV-012`, deixa de acontecer — a proibição de `RN-PRV-017` (c)
passa de promessa a propriedade, e o aceite "buscar artefato cuja fonte inclua fato de outro cliente →
zero" passa a ser conferível na trilha em vez de na intenção.

**O grupo B da §4 é uma decisão de repouso, não de lista.** Os nove itens passam agregados e reprovam
retidos por estabelecimento — logo o que decide não é a lista de `RN-PRV-009`, é **onde e em que forma eles
repousam**, que é `D-06` e é a Fase 1. Encaminho para `arquiteto-dados` como restrição, não como achado:
grão fino por estabelecimento é transitório; retido é grosso ou agregado.

**Concordância independente, e vale registrar porque o oposto seria alarme.** O passo 5 chegou a "só
'agora' é período aberto" e eu a "hora de pico por estabelecimento não tem saída" sem nos lermos, e as
duas apontam a mesma correção. `PRV-13` é a única parte em que eu **não** confirmo a saída dele
integralmente — e não porque a conta esteja errada, mas porque a conta é sobre custo e a fronteira é sobre
forma.

---

## 9. O que **não** consegui verificar

1. **`D-03` segue ABERTA.** `PRV-15` é achado de processo e independe da resposta; o tamanho do dano de
   `PRV-01`, não.
2. **A matriz do escopo `provedor` continua inexistente.** `RN-PRV-015` está correta como enunciado; a
   verificação célula a célula é do passo 7, e não a fiz.
3. **`D-06` não existe**, então a promessa de `RN-PRV-006` (c) só está verificada como **teste**, nunca
   contra uma residência real. `PRV-14` é o que a torna insuficiente enquanto o relógio da prova não for
   regra.
4. **Não reauditei o passo 4 nem o passo 5** além dos três pontos que me foram dirigidos. Não li os dois
   arquivos de `performance` inteiros — li o relatório deles na ficha e o veredito do período aberto.
5. **Não li** `fatos-de-operacao-dominios-fechados.md` §2.1 (os nove códigos de cancelamento) nem
   `RN-NUC-048` verbatim: são domínio fechado de valor de fato do cliente, sem alcance nosso declarado, e
   fora das quatro frentes. **Não os aprovo** — declaro que não os examinei.
6. **Não li norma alguma** e não afirmo base legal em nenhum ponto.
7. **Não rodei teste:** não há código. Verificação = leitura e conferência de endereço em disco nesta data.

## 10. Reincidência

**`PRV-11` é a terceira ocorrência do mesmo padrão** — campo ou fonte de autoridade nova sem valor possível
no registro — depois de `AUT-15` (T-0003) e `PRV-03` (T-0004, passo 2). As duas primeiras estão **fechadas**;
esta **nasceu do conserto da segunda**, que é o caso exato de
`memory/plataforma/gotcha-regra-nova-que-nao-corrige-a-celula-nasce-inerte` ("reauditar o conserto é
obrigatório"). Três ocorrências em duas fichas é sinal de **processo**, não de texto, e a leitura que eu
proponho ao humano é: toda vez que uma regra nova cria um sujeito, um campo obrigatório ou uma fonte de
autoridade, o **caso de falha daquele mesmo mecanismo** é o primeiro lugar a olhar — foi ali as três vezes.

`PRV-13` é **reincidência de conceito, do lado de quem audita**: é `RN-EMI-040` (vazamento por agregado)
aparecendo pela terceira vez com vetor novo — cliente→cliente na T-0003, cliente→nós no passo 2, e agora
agregado→dominante. A forma do defeito é estável; o vetor muda a cada escopo novo.

**Nenhum outro achado meu reaparece aberto.** `PRV-01` a `PRV-06` e `PRV-10` fecham; `PRV-07`, `PRV-08` e
`PRV-09` estão abertos **por escolha declarada**, com dono, e não os conto como reincidentes.

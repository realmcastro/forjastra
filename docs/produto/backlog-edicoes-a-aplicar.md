# Edições a aplicar no backlog `SPR` — 2026-08-26

> **O que este arquivo é.** O texto final das edições que decorrem de `revisao-backlog-spr-2026-08-26.md`,
> organizado para ser aplicado **mecanicamente** no Jira. Cada entrada traz o texto literal, pronto para
> colar. Nada aqui é resumo de instrução: é o artefato.
>
> **Por que ele existe em vez de eu editar direto.** A regra de 2026-08-26 me dá o backlog
> (`.claude/rules/jira.md` §2), mas o mecanismo não subiu nesta sessão: minhas ferramentas são leitura e
> escrita de arquivo. Então eu escrevo, o thread principal aplica **verbatim**.
>
> **O que este arquivo não faz.** Não decide `G-01`..`G-09` — as nove continuam com o humano, quatro delas
> por serem fronteira núcleo × módulo, que a fronteira aprovada manda vir como **pergunta**, nunca por
> eliminação (`fronteira-do-nucleo.md:169`, passo 5). Não cria `RN` nova. Não reserva código de módulo em
> `glossario.md` §4.3. Não mexe em prioridade, prazo, dono nem status. **Não exclui card.**

## Como aplicar

> ⚠️ **PARE. Leia `revisao-backlog-spr-conferencia-2026-08-26.md` antes de aplicar qualquer coisa daqui.**
> Conferido contra o board em 2026-08-26, e três coisas invalidam a aplicação mecânica deste arquivo:
>
> 1. **17 entradas de comentário do Bloco A já foram aplicadas** entre 12:37 e 12:43 de 2026-08-26, mais
>    a nota de vocabulário em 5 dos 13 cards e os títulos de `SPR-17` e `SPR-18`. Comentário é
>    append-only: republicar produz duplicata que não se apaga. A lista exata está na §1 da conferência.
> 2. **As seis substituições de descrição apagariam critério de aceite existente e ainda válido** —
>    todas as seis, não algumas. O texto corretivo de cada uma está em
>    `backlog-edicoes-correcoes-2026-08-26.md`, pronto para entrar, e ele vai **junto** com a entrada
>    daqui, nunca depois. Aplicar sem ele é exatamente o defeito que o item 4 desta lista mandava
>    evitar, e que eu não pude checar sozinho.
> 3. **Quatro vereditos mudaram e duas entradas ficaram redundantes** (`SPR-28`, `SPR-33`). Uma entrada
>    já publicada contém afirmação falsa (`SPR-1`, `service_mode`).
>
> Issue de aplicação: `SPR-54`.

1. **Ordem.** Aplique o **Bloco A** inteiro. **Pare no Bloco B** — ele espera resposta do humano.
2. **Cabeçalho de todo comentário** (`jira.md` §4), acrescentado pelo thread principal, não repetido em
   cada entrada abaixo:
   ```
   [T-<id> · produto · 2026-08-26]
   ```
3. **Antes de substituir uma descrição**, poste um comentário preservando a descrição atual **verbatim**.
   Comentário é append-only; descrição não é. Sem esse comentário, a versão anterior morre em silêncio, e
   trocar o combinado de quem escreveu o card sem deixar o anterior legível é o defeito que a trava 3 de
   `.claude/rules/jira.md` existe para impedir.
4. **Eu não li o corpo dos cards no Jira** — li a transcrição do brief. Onde uma entrada substitui
   descrição ou título, confira que nenhum critério de aceite existente e ainda válido se perde; se
   perder, poste-o como comentário antes de substituir.
5. **Cinco cards já receberam edição em 2026-08-26** (`SPR-12`, `SPR-28`, `SPR-31`, `SPR-32`, `SPR-33`).
   Onde a entrada diz "já aplicado", não republique; o que ela acrescenta está marcado como tal.

---

# Bloco A — aplicável hoje, sem depender de nenhuma `G`

### SPR-16, SPR-17, SPR-18, SPR-19, SPR-20, SPR-22, SPR-23, SPR-26, SPR-27, SPR-28, SPR-31, SPR-32, SPR-33 — AJUSTAR (nota de vocabulário)
CAMPO: comentário
PROVA: `docs/produto/glossario.md:55`, `:63`, `:71`, `:81`, `:355`
DEPENDE DE: nada
TEXTO NOVO:

**Vocabulário — autoridade única, e a correção mais barata de fazer agora.**

Onde este card diz "produto" para a **entidade vendável**, o termo é **item de catálogo**
(`catalog_item`). `docs/produto/glossario.md:55` define: "uma coisa vendável, identificável e
precificável". `docs/produto/glossario.md:63` **proíbe** `product` como nome de entidade, e `:355`
repete na tabela de formas proibidas, com o motivo: "produto" também é o software **e** um papel do
processo, e ambiguidade aqui não se resolve depois.

Isto não é cosmético. O termo do título e da descrição chega ao **nome da tabela** sem ninguém decidir, e
depois não sai sem migration em N schemas — renomear é o ciclo expand/contract de quatro etapas, com
aprovação do humano na última (`.claude/rules/migrations.md` §4). Corrigir agora custa uma edição de
texto.

Termos relacionados, todos de `docs/produto/glossario.md`: **item de pedido** (`order_item`, `:71`) é a
linha que liga um item de catálogo a uma quantidade e a um preço dentro de um pedido; **observação do
item de pedido** (`order_item_note`, `:81`) é o texto livre que altera **como** aquela linha é atendida.

> Aplicar o mesmo texto, sem alteração, em cada card da lista cujo corpo use "produto" como entidade. Eu
> não vejo os corpos; quem aplica vê. Card da lista que não usar o termo dispensa o comentário.

---

### SPR-1 — AJUSTAR
CAMPO: comentário
PROVA: `docs/produto/nucleo-venda.md:370`, `docs/produto/roadmap-de-modulos.md:155`, `:171`
DEPENDE DE: nada — nomeia `G-02`, não a decide
TEXTO NOVO:

**Reescopo recomendado — o que este card pede já foi entregue em parte, e o resíduo é o que ainda trava
construção.**

**Já atendido, em disco:** `docs/produto/fronteira-do-nucleo.md` (o teste dos três negócios e as tabelas
§2.1–§2.4), `docs/produto/catalogo-de-modulos.md` (31 módulos, cada um com escopo, ativação, expõe/exige
e comportamento desligado) e as 25 `RN-NUC`. Manter este card como levantamento amplo é refazer o que
está em disco.

**Resíduo que ainda trava construção, e que nenhum outro card cobre:**

1. **Turno.** `LACUNA-NUC-007` (`docs/produto/nucleo-venda.md:370`) está fechada pela metade: o
   fechamento do dia por estabelecimento ganhou regra dona (`RN-NUC-031`), mas **abertura e fechamento de
   turno continua sem nenhuma regra numerada**. É `G-02` desta revisão, e é do humano.
2. **`service_mode` sem `RN`.** `docs/produto/roadmap-de-modulos.md:155` e `:171` o listam como piso do
   documento fiscal, e ele não tem regra numerada.

**O que muda é o escopo, não a necessidade.** Fechar este card como "já feito" sem nomear o resíduo perde
a única lista que sabe o que falta.

---

### SPR-2 — AJUSTAR
CAMPO: comentário
PROVA: `docs/produto/catalogo-de-modulos.md:98`, `docs/produto/roadmap-de-modulos.md:184`
DEPENDE DE: nada
TEXTO NOVO:

**Reescopo recomendado.** `PCF` **tem spec**: 18 `RN` mais o anexo de sessão
(`docs/produto/modulos/pedido-cliente-final.md`, `docs/produto/modulos/pedido-cliente-final-sessao.md`).
Levantar de novo o que já está escrito é custo sem ganho.

**O que não existe, e `PCF` exige:** `PUB` — publicação de catálogo — com **0 `RN`**.
`docs/produto/catalogo-de-modulos.md:98` o descreve (descrição, imagem, atributo público, agrupamento,
disponibilidade por canal; **exibe, nunca calcula**), e `docs/produto/roadmap-de-modulos.md:184` o coloca
**fora do MVP 1**. O comportamento desligado é literal: "nenhum canal externo tem o que mostrar; o
operador vende pelo código do item".

**Resíduo deste card:** as lacunas de `PCF` e a spec de `PUB` — não um levantamento novo de `PCF`.

---

### SPR-3 — AJUSTAR
CAMPO: comentário
PROVA: `docs/produto/catalogo-de-modulos.md:170`, `:310`, `docs/produto/modulos/mesa-comanda.md:321`, `docs/produto/roadmap-de-modulos.md:184`
DEPENDE DE: nada
TEXTO NOVO:

**Reescopo recomendado — a necessidade é real e tem duas casas, não uma.**

`docs/produto/catalogo-de-modulos.md` classifica separadamente:

- **`CMP`** — o pedido que **não se encerra no ato**: fila, senha, retirada. É o dono do **estado de
  cumprimento** (`docs/produto/modulos/mesa-comanda.md:321`).
- **`ENT`** — entrega em endereço, que **exige** `CMP`.

Os dois têm **0 `RN`** e os dois estão fora do MVP 1 (`docs/produto/roadmap-de-modulos.md:184`). Um card
só produz um módulo só, e a fronteira aprovada tem dois — então este card comporta recorte por módulo,
com a dependência `ENT → CMP` declarada.

**Recorte é recomendação, não execução.** Partir uma issue muda o combinado de quem a escreveu, então
fica para o humano decidir entre recortar em dois ou manter um card com dois entregáveis nomeados. Nada
aqui exclui o card, e a necessidade que ele nomeia segue real.

---

### SPR-4 — AJUSTAR
CAMPO: comentário
PROVA: `docs/produto/modulos/cozinha.md:184`, `:215`, `docs/produto/glossario.md:377`
DEPENDE DE: nada
TEXTO NOVO:

**Reescopo recomendado.** `COZ` **tem spec**: 12 `RN` em `docs/produto/modulos/cozinha.md`, incluindo a
§5 sobre queda do ponto no meio do serviço, `RN-COZ-008` (`:184` — ponto de produção indisponível não
para o serviço) e `RN-COZ-010` (`:215` — `COZ` não move dinheiro, não altera pedido e não decide
disponibilidade).

**Resíduo:** `LACUNA-COZ-1` e `LACUNA-COZ-2` (§7 do mesmo arquivo), mais a pergunta ao humano ainda
aberta — **tela, impressora, ou os dois** no ponto de produção. Não é detalhe de escopo: a via impressa
é `production_ticket` e **exige `PER`** (`docs/produto/glossario.md:377`), o que muda a dependência
deste card.

---

### SPR-5 — MANTER, com exigência para os filhos
CAMPO: comentário
PROVA: `docs/produto/modulos/mesa-comanda.md:13`, `docs/produto/matriz-operacao-papel-contrato.md:213`
DEPENDE DE: nada
TEXTO NOVO:

**Escopo confirmado.** Casa com `MSA` (`docs/produto/modulos/mesa-comanda.md` §1) e nada nele muda.

**Uma condição, válida para todos os filhos desta Epic:** card filho **cita** `RN-MSA-nnn`; não
reenuncia a regra. Card que reenuncia regra aprovada produz a **segunda versão** dela, e duas versões da
mesma regra divergem sem ninguém perceber. É o mesmo motivo pelo qual `RN-NUC-039`
(`docs/produto/matriz-operacao-papel-contrato.md:213`) faz a célula da matriz prevalecer sobre papel
nomeado em prosa: prosa duplicada é onde a autoridade se perde.

---

### SPR-6 — AJUSTAR
CAMPO: comentário
PROVA: `docs/produto/modulos/mesa-comanda.md:98`, `:111`, `docs/produto/nucleo-venda.md:137`, `:294`
DEPENDE DE: nada — declara `G-06`, não a decide
TEXTO NOVO:

**Uma cláusula faltando, e uma pendência que não é deste card.**

O aceite está correto e alinhado a duas regras aprovadas: `RN-MSA-002`
(`docs/produto/modulos/mesa-comanda.md:98` — abrir consumo exige alvo declarado **e** responsável
identificado; sem um dos dois é recusado na abertura) e `RN-MSA-003` (`:111` — o alvo é **endereço**, não
identidade: fechar o consumo da mesa 12 e abrir outro na mesma mesa dá dois consumos distintos, e o
segundo nasce **vazio**).

**Falta declarar:** "Comanda 1, 2, 3 **por mesa**" é uma **segunda referência humana**, e ela não tem
regra. A única referência humana com regra é a da venda: única no escopo do **estabelecimento**,
consumida de **faixa pré-alocada** (`RN-NUC-003`, `docs/produto/nucleo-venda.md:137`), e toda resolução
por ela é **escopada antes** de resolver, nunca depois (`RN-NUC-038`, `:294`). Um contador por alvo é um
segundo espaço de nomes: não herda o escopo, não herda o mecanismo de alocação, e o grão da referência já
é tensão aberta.

Isto é `G-06` desta revisão — pergunta ao humano, **não** decidida aqui. Consequência prática: a parte do
aceite que depende de "Comanda 1, 2, 3 por mesa" fica atrás de `G-06`; o resto do card (`RN-MSA-002`,
`RN-MSA-003`) não depende dela e segue.

---

### SPR-7 — AJUSTAR
CAMPO: comentário
PROVA: `docs/produto/glossario.md:353`, `docs/produto/modulos/mesa-comanda.md:255`, `:270`, `:344`
DEPENDE DE: nada
TEXTO NOVO:

**Três correções, todas contra regra já aprovada.**

1. **"cliente" sem qualificador é forma proibida** (`docs/produto/glossario.md:353`): os dois sentidos —
   cliente (tenant) e cliente-final — aparecem na mesma frase o tempo todo, e a ambiguidade vira consulta
   errada. Aqui o termo correto é **nome de exibição do cliente-final**.
2. **Falta um tipo de alvo.** `RN-MSA-013` (`docs/produto/modulos/mesa-comanda.md:255`) declara três —
   lugar físico, **ficha/cartão** e nome de exibição — e quais existem é **configuração do cliente**,
   editável por ele, sem chamado e sem deploy. O card omite ficha/cartão, que é justamente o alvo do bar
   que não tem mesa numerada.
3. **Citar `RN-MSA-014`** (`docs/produto/modulos/mesa-comanda.md:270`): vincular consumo a um nome é
   **opcional**; `MSA` guarda apenas o necessário para localizar o consumo durante o serviço, **não**
   constrói histórico por pessoa e **não** cruza consumos por nome. Sem esta citação, `MSA` vira cadastro
   de pessoas por acidente — que é o motivo escrito da regra. Aceite dela: com `CLF` desligado, abrir
   consumo nominal, encerrá-lo, e conferir que **nenhuma** consulta relaciona dois consumos pelo mesmo
   nome, e que nada além do que a venda do núcleo já retém foi criado.

**Pendência que não é deste card:** o **prazo de retenção** do nome de exibição depois do encerramento é
decisão do humano (`docs/produto/modulos/mesa-comanda.md:344`) — e sem ela a retenção nasce por omissão,
que é o modo de dado de pessoa acumular sem ninguém decidir.

---

### SPR-8 — MANTER, com citação
CAMPO: comentário
PROVA: `docs/produto/modulos/mesa-comanda.md:107`
DEPENDE DE: nada
TEXTO NOVO:

**Citação faltando — o card está certo, e é o caminho infeliz de uma regra já aprovada.**

`RN-MSA-002`, caminho infeliz (`docs/produto/modulos/mesa-comanda.md:107`): quando o alvo já tem consumo
aberto, o produto **não** cria um segundo silenciosamente e **não** funde os dois — apresenta o existente
e exige **escolha explícita** entre lançar nele ou abrir um segundo consumo declarado no mesmo alvo,
ficando os dois **distinguíveis por quem opera**.

Citar a regra em vez de reenunciá-la (condição da Epic `SPR-5`).

Aceite: dois consumos abertos na mesma mesa, criados por escolha explícita → cada lançamento cai em um
só, e quem opera distingue os dois **pelo alvo e pela apresentação**, sem consultar identificador
interno.

---

### SPR-9 — MANTER, com citação
CAMPO: comentário
PROVA: `docs/produto/modulos/mesa-comanda.md:284`, `docs/produto/nucleo-venda.md:294`
DEPENDE DE: nada
TEXTO NOVO:

**Citação faltando.** O card está coberto pelo contrato de `MSA`
(`docs/produto/modulos/mesa-comanda.md:284` — a lista de consumos abertos de um estabelecimento, com
responsável, alvo e instante de abertura) e nada nele muda.

Acrescentar a citação de `RN-NUC-038` (`docs/produto/nucleo-venda.md:294`): toda operação que
**localiza** algo resolve o objeto **dentro** do cliente (tenant) e do estabelecimento resolvidos a
partir da **identidade autenticada**, nunca a partir de identificador informado no pedido, e **nunca**
resolvendo primeiro para conferir o escopo depois. Consulta que localiza consumo por alvo é exatamente
esse caso.

Aceite: a resposta a um alvo que **não existe** no escopo e a resposta a um que existe em **outro**
escopo são a **mesma**, e nenhuma das duas revela existência.

---

### SPR-10 — AJUSTAR
CAMPO: comentário
PROVA: `docs/produto/modulos/mesa-comanda.md:141`, `docs/produto/operacao-offline-e-sincronizacao.md:102`
DEPENDE DE: nada
TEXTO NOVO:

**Três cláusulas que a regra aprovada tem e o card não.** É `RN-MSA-005`
(`docs/produto/modulos/mesa-comanda.md:141`).

1. **Autor e instante de cada lançamento são preservados.** Transferir **move** o consumo: não copia, não
   recria com instante novo. Recriar lançamento quebra a trilha e reabre a janela de furto.
2. **Nada é reenviado à produção.** Recriar faria a cozinha produzir duas vezes o mesmo item.
3. **Transferência concorrente é recusada.** Dois operadores transferindo o mesmo consumo ao mesmo tempo
   → uma vence, a outra é **recusada apresentando o estado atual**; nunca "a última escrita ganha", nunca
   item duplicado, nunca item perdido no caminho. `RN-OFF-009`
   (`docs/produto/operacao-offline-e-sincronizacao.md:102`) recusa em geral resolução por ordem de
   chegada, por relógio do terminal e por descarte silencioso.

Aceite da regra, a copiar: consumo com 4 lançamentos transferido para outro alvo → os 4 mantêm autor e
instante **originais**, a trilha registra a transferência com autor, e **nenhum** trabalho novo chega à
produção.

---

### SPR-11 — AJUSTAR
CAMPO: comentário
PROVA: `docs/produto/modulos/mesa-comanda.md:224`
DEPENDE DE: nada
TEXTO NOVO:

**Trocar a observação de escopo pela citação da regra.** "Fora do escopo do MVP" deixa o comportamento
nascer por omissão, e aqui o default por omissão é o indesejado.

`RN-MSA-011` (`docs/produto/modulos/mesa-comanda.md:224`) já decide: lançamentos são fatos **aditivos** e
convergem sem perda quando a conexão volta; operação **não aditiva** — transferência, junção, retirada de
item, fechamento — tentada enquanto o dispositivo não tem o consumo em estado confirmado é **recusada**,
apresentando o último estado conhecido e o instante dele, e quem opera decide. O produto **não** resolve
por relógio nem por "última escrita ganha".

Aceite: cortar o link, lançar em duas mesas de dois dispositivos diferentes, restabelecer → nenhum
lançamento se perde e nenhum aparece duplicado; e **durante** o corte o operador vê no próprio terminal
que há pendências e **quantas**, sem interpretação técnica.

---

### SPR-12 — AJUSTAR
CAMPO: comentário
PROVA: `docs/produto/modulos/mesa-comanda.md:241`, `docs/produto/modulos/cozinha.md:141`, `docs/produto/modulos/mesa-comanda.md:210`
DEPENDE DE: nada
TEXTO NOVO:

**Contradição com regra aprovada — não é ajuste de texto.**

Condicionar o **encerramento** do consumo ao estado de preparo é exatamente o que duas regras aprovadas
proíbem:

- `RN-MSA-012` (`docs/produto/modulos/mesa-comanda.md:241`) — `MSA` **não consulta** estado de preparo
  para aceitar, alterar **ou encerrar** consumo, e "pronto" não é condição de nada aqui. Caminho infeliz
  literal: fechar consumo com trabalho ainda em produção é **permitido**, e o produto **avisa** sem
  bloquear.
- `RN-COZ-005` (`docs/produto/modulos/cozinha.md:141`) — a etapa "não libera nem impede nada": não
  autoriza cobrança, não fecha consumo, não conclui venda, não emite documento, e não é condição de
  nenhuma operação de dinheiro.

Consequência que as duas regras existem para evitar: um display caído travando o encerramento no pico.

**Aceite, nos dois sentidos:**

1. Com `COZ` **desligado**, o encerramento roda igual e nenhuma etapa cita produção.
2. Com `COZ` **ligado e o ponto inalcançável**, o encerramento **não** é bloqueado; o produto avisa que
   há trabalho em curso. O que acontece com esse trabalho é `RN-COZ-007`
   (`docs/produto/modulos/cozinha.md:169`), não deste card.

E o desfecho do encerramento é **escolha explícita** entre cobrança e cancelamento com motivo, por papel
autorizado (`RN-MSA-010`, `docs/produto/modulos/mesa-comanda.md:210`) — nunca descarte silencioso, nunca
venda paga fantasma.

> Se o comentário já publicado neste card em 2026-08-26 já carrega `RN-MSA-012`, `RN-COZ-005` e o aceite
> nos dois sentidos, este é redundante: **já aplicado**, não republique.

---

### SPR-13 — AJUSTAR
CAMPO: título
PROVA: `docs/produto/modulos/mesa-comanda.md:210`, `:56`
DEPENDE DE: nada
TEXTO NOVO:

O fechamento no ponto de cobrança conclui o consumo em aberto

---

### SPR-13 — AJUSTAR
CAMPO: descrição
PROVA: `docs/produto/modulos/mesa-comanda.md:210`, `:181`, `docs/produto/modulos/cozinha.md:141`, `:215`
DEPENDE DE: nada
TEXTO NOVO:

## Enunciado

Encerrar um consumo em aberto é operação **de `MSA`**, por decisão humana, com papel autorizado, motivo,
e escolha explícita entre **cobrança** e **cancelamento**. Nenhum outro módulo encerra consumo. O que
acontece no ponto de cobrança é o **núcleo** concluindo a venda a partir do que `MSA` entregou — não um
módulo externo agindo sobre o consumo.

## Por que o enunciado anterior invertia a fronteira

"Comanda encerrada externamente" põe o encerramento fora do dono dele. As regras aprovadas:

- `RN-MSA-010` (`docs/produto/modulos/mesa-comanda.md:210`) — consumo é encerrado por decisão humana,
  **nunca pelo relógio**. Nada o fecha, cancela, arquiva ou descarta automaticamente por tempo, virada de
  dia, fim de expediente ou rotina de limpeza.
- `RN-MSA-008` (`docs/produto/modulos/mesa-comanda.md:181`) — um consumo produz **no máximo uma**
  cobrança concluída; repetir o fechamento devolve o **mesmo** resultado.
- `RN-COZ-005` (`docs/produto/modulos/cozinha.md:141`) — a etapa de produção **não fecha consumo** e não
  é condição de nenhuma operação de dinheiro.
- `RN-COZ-010` (`docs/produto/modulos/cozinha.md:215`) — nada em `COZ` altera item, quantidade, preço,
  total, tributo ou estado de venda.

## Aceite

1. Encerrar consumo por cobrança → uma venda, um pagamento, um documento. Enviar o fechamento do mesmo
   consumo três vezes, uma delas com a resposta derrubada no meio, devolve o **mesmo** resultado
   (`RN-MSA-008`, aceite).
2. Consumo aberto há três dias → **continua aberto**, contável e visível como pendência ao responsável;
   nada o encerra automaticamente (`RN-MSA-010`, aceite).
3. Consumo que não pode ser cobrado (o cliente-final foi embora sem pagar) → encerrado como
   **cancelamento com motivo**, nunca como venda paga fantasma nem descarte silencioso, e o valor não
   cobrado fica **declarado** (`RN-MSA-010`, infeliz).
4. Com `COZ` desligado, ou com o ponto de produção inalcançável, os itens 1 a 3 se comportam igual
   (`RN-MSA-012`).

## Caminho infeliz

Dois terminais fecham o mesmo consumo ao mesmo tempo, com repartições diferentes → uma vence, a outra é
**recusada apresentando o estado atual** a quem opera; em nenhuma das duas fica venda parcial concluída
(`RN-MSA-008`, infeliz). Exclusividade **com o link caído** é requisito duro declarado em `RN-MSA-011`.

## Pendência declarada, não presumida

Se o encerramento por cancelamento tem qualquer reflexo documental é `LACUNA-MSA-2`
(`docs/produto/modulos/mesa-comanda.md:341`) — sem fonte, e nada aqui a presume.

---

### SPR-14 — AJUSTAR
CAMPO: comentário
PROVA: `docs/produto/modulos/mesa-comanda.md:270`, `docs/produto/fronteira-do-nucleo.md:88`, `docs/produto/glossario.md:353`
DEPENDE DE: nada
TEXTO NOVO:

**Uma entidade corrigida.** O escopo do card está certo — tabelas do módulo, sem tocar o núcleo — e é o
invariante 2 mais `.claude/rules/dados.md` §5: ligar módulo pode criar tabela nova; **nunca** alterar
tabela do núcleo.

**Correção:** "cliente / identificação textual" **não** é entidade de pessoa em `MSA`. É **atributo de
exibição** — sem histórico e sem cruzamento. `RN-MSA-014`
(`docs/produto/modulos/mesa-comanda.md:270`): `MSA` guarda apenas o necessário para localizar o consumo
durante o serviço, **não constrói histórico por pessoa e não cruza consumos por nome**. Entidade de
pessoa é `CLF` (`docs/produto/fronteira-do-nucleo.md:88` — cadastro e histórico de cliente-final é
módulo, porque "padaria de balcão vende a vida inteira sem cadastrar ninguém").

Modelar isso como entidade de pessoa é o caminho pelo qual `MSA` vira cadastro de pessoas por acidente —
capacidade que o cliente não ligou e dado que ninguém decidiu guardar. É o motivo escrito da regra.

E o termo é **nome de exibição do cliente-final**, não "cliente": forma proibida
(`docs/produto/glossario.md:353`).

Aceite: com `CLF` desligado, abrir consumo nominal, encerrá-lo, e conferir que **nada além do que a venda
do núcleo já retém** foi criado.

---

### SPR-15 — AJUSTAR
CAMPO: comentário
PROVA: `docs/produto/fronteira-do-nucleo.md:81`, `:87`, `:169`, `docs/produto/modulos/mesa-comanda.md:19`
DEPENDE DE: nada — nomeia `G-03`, `G-04`, `G-05`, `G-07`, não as decide
TEXTO NOVO:

**Dois pontos sobre esta Epic.**

**1. O conteúdo dos filhos é composição de pedido, e composição de pedido é núcleo.**
`docs/produto/fronteira-do-nucleo.md:81` põe "pedido em construção (itens, quantidade, preço aplicado)"
no núcleo; `:87` põe "observação livre no item de pedido" no núcleo, com o motivo escrito — os três
negócios recebem instrução que muda como a linha é atendida, e hoje a anotam no papel. O que `MSA`
acrescenta ao pedido do núcleo é **duração, vínculo e movimentação** do consumo antes da cobrança
(`docs/produto/modulos/mesa-comanda.md:19`), não a composição. Então os filhos citam `RN-NUC-nnn` para a
composição e `RN-MSA-nnn` para o que é do módulo, sem reenunciar nenhuma das duas.

**2. Esta Epic não é agendável inteira — só card por card.** Quatro filhos repousam sobre entidade que a
spec aprovada **não tem**:

- `SPR-16` — categoria de catálogo (`G-03`)
- `SPR-19` — variação por eixos (`G-04`)
- `SPR-20` — adicional / complemento (`G-05`)
- `SPR-26` — disponibilidade no caminho de venda (`G-07`)

As quatro são perguntas ao humano, e nenhuma se decide por eliminação
(`docs/produto/fronteira-do-nucleo.md:169`, passo 5). Os filhos restantes seguem, e o bloqueio dos quatro
está declarado em cada um.

**Vocabulário:** onde os filhos dizem "produto" para a entidade, o termo é **item de catálogo**
(`catalog_item`) — `docs/produto/glossario.md:63` proíbe `product` como nome de entidade.

---

### SPR-17 — AJUSTAR
CAMPO: título
PROVA: `docs/produto/glossario.md:63`
DEPENDE DE: nada
TEXTO NOVO:

Pesquisar item de catálogo

> Se o título no board tiver mais palavras que a transcrição que eu recebi ("pesquisar produtos"), aplique
> **só** a substituição `produtos → item de catálogo` e preserve o resto.

---

### SPR-17 — AJUSTAR
CAMPO: comentário
PROVA: `docs/produto/operacao-offline-e-sincronizacao.md:95`, `docs/produto/nucleo-publicacao-e-texto.md:42`, `:105`
DEPENDE DE: nada — declara `G-08`, não a decide
TEXTO NOVO:

**Duas cláusulas faltando.** A necessidade é real e **distinta** de `SPR-16`: achar o item sem saber o
código não é o mesmo que navegar por agrupamento. Este card não é duplicata.

**1. Classificação de continuidade.** Busca textual de catálogo não tem classe declarada, e operação sem
classe declarada é **classe 2 — recusa** pelo default de `RN-OFF-008`
(`docs/produto/operacao-offline-e-sincronizacao.md:95`). Ou seja: como o card está hoje, o aceite offline
dele **é recusar**. Classificá-la é `G-08` desta revisão — do humano, depois de `produto` — e **não** é
decidida aqui. O default não se afrouxa para caber um card: a correção é **classificar**, com `RN` do
módulo dono e critério de aceite (`RN-OFF-008`, infeliz).

**2. Fonte da busca.** Offline, a única fonte possível é o **artefato publicado retido** pelo terminal —
catálogo aplicável ao estabelecimento, com item, código e unidade de medida com casas declaradas
(`RN-NUC-013`, `docs/produto/nucleo-publicacao-e-texto.md:42`). O terminal **aplica**; nunca cria, altera
nem versiona artefato (`RN-NUC-014`, `:105`). O card não declara a fonte, e sem declará-la ela nasce por
omissão.

---

### SPR-18 — AJUSTAR
CAMPO: título
PROVA: `docs/produto/glossario.md:63`
DEPENDE DE: nada
TEXTO NOVO:

Escolha obrigatória pendente impede o lançamento do item de catálogo

---

### SPR-18 — AJUSTAR
CAMPO: descrição
PROVA: `.claude/rules/00-nucleo.md` §12, `.claude/rules/ui.md` §3, `docs/produto/nucleo-publicacao-e-texto.md:29`
DEPENDE DE: nada — declara `G-04` e `G-05`, não as decide
TEXTO NOVO:

## Necessidade (preservada)

Não perder variação, complemento ou observação por esquecimento. Hoje o operador anota no papel e o erro
só aparece na entrega ou na conferência. A necessidade não está em discussão.

## Mecanismo recusado, e por que ele é ruim

"**Todo** item passa por etapa de configuração antes de ser adicionado." Ele cobra o custo da **exceção**
em 100% dos lançamentos, inclusive nos itens que não têm escolha nenhuma, e cobra no único caminho que
não aceita regressão: o caixa com fila. E quebra o fluxo completável por **leitor de código de barras sem
tocar a tela**, que é requisito de operação, não conforto (`.claude/rules/ui.md` §3: teclado e leitor são
primeira classe, e todo fluxo de venda é completável sem tocar na tela).

## Enunciado (mecanismo que fica)

A regra é **condicional**: um item de catálogo cujo lançamento tem **escolha obrigatória pendente** não é
lançável sem a escolha, e a recusa **nomeia qual escolha falta**. Item sem escolha obrigatória é lançado
em **um** toque, sem etapa intermediária.

**Quais** itens têm escolha obrigatória é **dado publicado**, nunca decisão do terminal — o terminal
aplica artefato retido, não decide (`RN-NUC-013`, `docs/produto/nucleo-publicacao-e-texto.md:29`).

## Aceite — dois sentidos, os dois obrigatórios

1. Lançar por leitor de código de barras 20 itens **sem** escolha obrigatória → nenhuma etapa
   intermediária em nenhum dos 20, e nenhum toque na tela.
2. Tentar lançar item **com** escolha obrigatória pendente → recusado, e a mensagem nomeia **a escolha
   que falta** e a ação possível (`PN-17`).

O mecanismo recusado reprova o teste 1. É essa a diferença, e ela é medível.

## Fronteira deste card

A **etapa** — tela, passo, componente, ordem visual — é território de `ui`. Este card entrega a
**regra**, não a etapa.

## O que este card ainda não pode declarar

**Que** escolhas obrigatórias existem depende de classificar variação por eixos (`G-04`) e adicional /
complemento (`G-05`), que são perguntas abertas ao humano. A regra condicional acima **não** depende
delas: ela vale para qualquer escolha obrigatória publicada, e foi escrita para não mudar quando o
conjunto de escolhas for decidido.

---

### SPR-21 — FUNDIR (absorvido por `SPR-22`)
CAMPO: comentário
PROVA: `docs/produto/nucleo-publicacao-e-texto.md:160`, `docs/produto/glossario.md:81`, `docs/produto/fronteira-do-nucleo.md:87`
DEPENDE DE: nada
TEXTO NOVO:

**Fundido em `SPR-22`.** A regra da observação do item **já existe, e é do núcleo** — não é regra nova a
escrever aqui:

- `RN-NUC-016` (`docs/produto/nucleo-publicacao-e-texto.md:160`) governa origem declarada, opacidade do
  texto, e a vedação de ele ser **chave de decisão**.
- O termo é `order_item_note`, autoridade única em `docs/produto/glossario.md:81`.
- A linha de fronteira que a classifica como **núcleo** é `docs/produto/fronteira-do-nucleo.md:87`: os
  três negócios recebem instrução que muda como a linha é atendida ("sem cebola", "ajustar a barra",
  "embalar para presente"), e ela existe **sem** módulo de produção.

O que sobrava de trabalho neste card era a **coleta** da observação no ato do lançamento — e o ato do
lançamento é `SPR-22`. Card próprio aqui produziria uma **segunda versão** de uma regra aprovada, e duas
versões da mesma regra divergem sem ninguém perceber.

**Este card não é excluído.** A necessidade que ele nomeia é real e continua atendida: ela mudou de casa,
não de existência. Excluir exigiria as quatro partes de `.claude/rules/00-nucleo.md` §12 mais autorização
do humano, e aqui elas não existem — não há mecanismo recusado, só endereço corrigido.

---

### SPR-22 — FUNDIR (absorve `SPR-21`)
CAMPO: título
PROVA: `docs/produto/glossario.md:55`, `:63`
DEPENDE DE: nada
TEXTO NOVO:

Lançar item de catálogo no consumo em aberto, com observação

---

### SPR-22 — FUNDIR (absorve `SPR-21`)
CAMPO: descrição
PROVA: `docs/produto/nucleo-venda.md:113`, `docs/produto/modulos/mesa-comanda.md:125`, `docs/produto/nucleo-publicacao-e-texto.md:160`, `:89`
DEPENDE DE: nada
TEXTO NOVO:

## Enunciado

Lançar um item de catálogo em um consumo em aberto exige que o item **e** o preço aplicável já estejam no
artefato publicado que o terminal retém. O lançamento grava a quantidade na **unidade declarada** do
item, **qual versão** de catálogo e de preço aplicou, e o **autor e o instante** do lançamento. O
lançamento pode carregar uma **observação do item de pedido** (`order_item_note`), coletada no mesmo ato.

## Regras que governam

- `RN-NUC-002` (`docs/produto/nucleo-venda.md:113`) — lançar item **aplica** artefato publicado; item sem
  preço publicado **não é lançado**; a linha grava as versões aplicadas. O motivo é "aplicar, não
  decidir": preço digitado no terminal é o terminal decidindo dinheiro.
- `RN-MSA-004` (`docs/produto/modulos/mesa-comanda.md:125`) — cada lançamento carrega **autor e
  instante**. Sem isso o lançamento errado não se atribui a ninguém, e é aí que o dinheiro escapa no ramo.
- `RN-NUC-016` (`docs/produto/nucleo-publicacao-e-texto.md:160`) — a observação carrega **origem
  declarada** (quem escreveu, por qual canal, em que instante), atribuída **na borda que a recebeu**; é
  preservada **literal e opaca**; é exibida **atribuída à origem** e distinguível de mensagem do produto;
  e **nunca** é chave de decisão, nunca concede autoridade, nunca amplia escopo, nunca muda limite, nunca
  aplica valor e nunca altera prioridade.

## Aceite

1. Lançar item cujo preço está no artefato publicado retido, **com o link caído** → aceito; a linha
   guarda a versão de catálogo e a versão de preço aplicadas, mais autor e instante.
2. Lançar item **sem** preço no artefato publicado retido → recusado **falhando fechado**, e a falta é
   declarada como **falta de publicação**, não como erro de rede; a venda **continua** com o que existe
   (`RN-NUC-013`, infeliz (a) — `docs/produto/nucleo-publicacao-e-texto.md:89`).
3. Lançar com observação ("sem cebola") → a observação é gravada com origem declarada, é apresentada
   atribuída à origem, e **nenhuma** decisão do produto (preço, roteamento, prioridade, autorização)
   muda por causa do texto.
4. Conferir que o texto da observação não é interpretado como código, marcação ou instrução em nenhum
   caminho.

## Caminho infeliz

Observação vinda de fora — cliente-final, canal, plataforma — é **entrada não confiável** e carrega
origem declarada (`docs/produto/glossario.md:81`).

## Nota de fusão

Este card absorve `SPR-21` (observação no item), que deixa de ter enunciado próprio. O motivo está no
comentário de `SPR-21`, e `SPR-21` **não** é excluído.

---

### SPR-23 — AJUSTAR
CAMPO: título
PROVA: `docs/produto/modulos/mesa-comanda.md:125`
DEPENDE DE: nada
TEXTO NOVO:

Agregar itens equivalentes na apresentação do consumo

---

### SPR-23 — AJUSTAR
CAMPO: descrição
PROVA: `docs/produto/modulos/mesa-comanda.md:125`, `docs/produto/modulos/cozinha.md:88`, `docs/produto/nucleo-publicacao-e-texto.md:170`, `docs/produto/modulos/pedido-cliente-final.md:180`
DEPENDE DE: nada
TEXTO NOVO:

## Necessidade (preservada)

A comanda tem que ser **legível no pico**. Vinte linhas iguais de refrigerante são ilegíveis, e ilegível
é o que faz o atendente conferir errado na frente do cliente-final. A necessidade não está em discussão.

## Mecanismo recusado, e por que ele é ruim

Consolidar **o fato**: fundir dois lançamentos numa linha de quantidade 2. Três razões, cada uma contra
regra aprovada:

1. Apaga **autor e instante** de cada lançamento, que `RN-MSA-004`
   (`docs/produto/modulos/mesa-comanda.md:125`) exige — e que é a única prova contra o furto por
   cancelamento de item.
2. Torna ambíguo o que fazer com o trabalho **já emitido**: o trabalho nasce do lançamento, não da venda
   (`RN-COZ-001`, `docs/produto/modulos/cozinha.md:88`).
3. Usa **texto livre como chave de decisão**, que `RN-NUC-016`
   (`docs/produto/nucleo-publicacao-e-texto.md:170`) proíbe literalmente: o texto é opaco e **nunca chave
   de decisão**.

E no canal externo o contrário já foi decidido: `RN-PCF-006`
(`docs/produto/modulos/pedido-cliente-final.md:180`) diz que o produto **não deduplica por semelhança**,
só por repetição da mesma submissão, porque duas pessoas pedirem a mesma coisa é **rotina**.

## Enunciado (mecanismo que fica)

Consolidação é **agregação de apresentação** sobre fatos que permanecem **separados**. A superfície
mostra uma linha agregada ("2× X-Burger"); os lançamentos continuam existindo separados, cada um com
autor, instante e trilha próprios; e toda retirada age sobre **um lançamento**, nunca sobre uma linha
somada.

Equivalência para **exibir** pode considerar a composição do item. **Identidade** de fato nunca é
composição, e **nunca** inclui a observação do item de pedido (`RN-NUC-016`).

## Aceite

1. Lançar o mesmo item duas vezes, por **dois autores diferentes** → a tela mostra **uma** linha agregada
   com quantidade 2.
2. A trilha do mesmo consumo mostra **dois** lançamentos, com autores e instantes distintos.
3. Retirar "um" → retira o **lançamento escolhido**, e a trilha mostra **qual**; o outro permanece
   intocado, com seu autor e instante.
4. Dois lançamentos do mesmo item com observações diferentes → a diferença de texto **não** decide
   agregação nem separação, porque o texto não é chave de decisão.
5. Nenhum valor exibido na linha agregada é composto por `MSA` (`RN-MSA-007`,
   `docs/produto/modulos/mesa-comanda.md:166`).

## Por que o novo é melhor, e como se prova

O mecanismo recusado **não consegue** produzir as provas 2 e 3. É por isso que ele parece mais simples:
ele descarta exatamente a informação que sustenta as duas.

## Fora deste card

A **chave de equivalência** como estrutura de dado é `SPR-33`, que permanece bloqueada por outro motivo —
ver o comentário lá.

---

### SPR-24 — FUNDIR (absorvido por `SPR-25`)
CAMPO: comentário
PROVA: `docs/produto/modulos/mesa-comanda.md:125`, `docs/produto/modulos/pedido-cliente-final.md:183`
DEPENDE DE: nada
TEXTO NOVO:

**Fundido em `SPR-25`.** Reduzir a quantidade de um item já lançado **é** retirada parcial, e reduzir a
zero é exatamente `SPR-25`. A mesma pergunta em dois cards já produziu **duas respostas diferentes**:
`SPR-25` fala de autorização; este trata a redução como edição simples — sem papel, sem motivo, sem
trilha.

A regra aprovada é uma só: `RN-MSA-004` (`docs/produto/modulos/mesa-comanda.md:125`) — retirar item já
lançado é **operação sensível** que exige papel autorizado, motivo e trilha, e **não apaga** o
lançamento: registra a retirada. Edição simples de quantidade é o caminho que essa regra existe para
fechar; o motivo escrito dela é que cancelar item já lançado é o caminho natural de furto no ramo.

**Aumentar** quantidade também cabe no enunciado de `SPR-25`, e cabe pelo outro lado: é lançamento
**aditivo** novo, não edição. `RN-PCF-006` (`docs/produto/modulos/pedido-cliente-final.md:183`) já diz
literalmente que "alterar quantidade de item já lançado não existe aqui: é retirada autorizada
(`RN-MSA-004`) mais lançamento novo".

**Este card não é excluído.** A necessidade — corrigir a quantidade lançada errada — é real, e passa a
ser atendida por `SPR-25` com papel, motivo e trilha, que este card não tinha.

---

### SPR-25 — FUNDIR (absorve `SPR-24`) + corrigir o eixo
CAMPO: título
PROVA: `docs/produto/modulos/mesa-comanda.md:125`
DEPENDE DE: nada
TEXTO NOVO:

Retirar item do consumo, e alterar quantidade de item já lançado

---

### SPR-25 — FUNDIR (absorve `SPR-24`) + corrigir o eixo
CAMPO: descrição
PROVA: `docs/produto/modulos/mesa-comanda.md:125`, `:241`, `docs/produto/nucleo-venda.md:92`, `docs/produto/modulos/cozinha.md:169`
DEPENDE DE: nada
TEXTO NOVO:

## Enunciado

Retirar um item já lançado num consumo em aberto — inteiro, ou em parte da quantidade — é **fato novo
autorizado**: exige papel autorizado, motivo e trilha, e **não apaga** o lançamento original.
**Aumentar** a quantidade não é edição: é **lançamento aditivo novo**. Nada nisto consulta estado de
preparo.

## O eixo é a natureza do fato, nunca o estado de preparo

- Pedido **em construção** do núcleo é local ao terminal, mutável, e pode morrer sem virar venda —
  `RN-NUC-001` (`docs/produto/nucleo-venda.md:92`).
- Lançamento em **consumo aberto** é fato com autor e instante, e sai por **retirada autorizada** —
  `RN-MSA-004` (`docs/produto/modulos/mesa-comanda.md:125`).
- **"Enviado × não enviado" não é eixo desta regra.** É estado de `COZ`, e `RN-MSA-012`
  (`docs/produto/modulos/mesa-comanda.md:241`) diz que `MSA` **não consulta** estado de preparo para
  aceitar, alterar ou encerrar consumo. Usar preparo como porteiro é o que faz um display caído travar a
  operação no pico. O que acontece com o trabalho já feito é `RN-COZ-007`
  (`docs/produto/modulos/cozinha.md:169`), **sem consulta de volta**.

## Aceite

1. Operador com papel apenas de lançamento tenta retirar item → **negado no backend**, mesmo que a
   interface tenha sido burlada, e a tentativa entra na trilha.
2. Quem a célula da matriz autoriza retira → o consumo passa a não cobrar o item, e a trilha mostra
   **lançamento e retirada**, cada um com autor, instante e motivo. **Quem pode** é a célula, não esta
   prosa (`RN-NUC-039`, `docs/produto/matriz-operacao-papel-contrato.md:213`): a linha "retirar item
   lançado" é `R` para `manager` e `owner`, `N·cfg` para `cashier` — concedível pela configuração de
   `RN-MSA-013`, sempre **com registro** — e recusa offline.
3. Reduzir a quantidade de 3 para 1 → registra **retirada de 2**, com autor e motivo; o lançamento de 3
   continua existindo na trilha.
4. Aumentar de 1 para 3 → **dois lançamentos aditivos novos**, cada um com autor e instante próprios;
   nenhuma linha existente é editada (`RN-PCF-006`,
   `docs/produto/modulos/pedido-cliente-final.md:183`).
5. Retirar item **já produzido** → a retirada do consumo **não desfaz** a produção; o trabalho é
   encerrado pelo caminho de `COZ` como produzido-e-descartado, com autor e motivo, e o descarte fica
   declarado (`RN-COZ-007`). A retirada **não espera** nem consulta esse desfecho.
6. Com `COZ` **desligado**, os itens 1 a 5 se comportam igual, e nenhuma etapa cita produção
   (`RN-MSA-012`, aceite).

## Caminho infeliz

Retirada tentada enquanto o dispositivo **não tem o consumo em estado confirmado** → **recusada**,
apresentando o último estado conhecido e o instante dele, e quem opera decide. Nunca "última escrita
ganha", nunca resolução por relógio (`RN-MSA-011`, `docs/produto/modulos/mesa-comanda.md:224`;
`RN-OFF-009`, `docs/produto/operacao-offline-e-sincronizacao.md:102`).

## Notas de fronteira

- Este card absorve `SPR-24` (alterar quantidade de item). Motivo no comentário de `SPR-24`, e `SPR-24`
  **não** é excluído.
- Correção de item **já concluído em venda** continua sendo `SPR-30`. Este card é sobre **consumo em
  aberto**.

---

### SPR-27 — AJUSTAR
CAMPO: comentário
PROVA: `docs/produto/modulos/cozinha.md:215`, `:184`, `docs/produto/modulos/mesa-comanda.md:241`, `docs/produto/nucleo-venda.md:113`
DEPENDE DE: nada — declara `G-07`, não a decide
TEXTO NOVO:

**Uma correção de fronteira, aplicável hoje. E uma pendência que não é deste card.**

**Correção:** "validar disponibilidade antes do **envio à cozinha**" põe o bloqueio no lugar errado.
`COZ` não decide disponibilidade e não bloqueia lançamento:

- `RN-COZ-010` (`docs/produto/modulos/cozinha.md:215`) — "acabou o item" **não** é decisão de `COZ`;
  disponibilidade é catálogo / `EST`. Quem produz sinalizando "não tem mais" gera **proposta** a quem tem
  papel para mudar catálogo ou estoque, **nunca** efeito direto na venda.
- `RN-COZ-008` (`docs/produto/modulos/cozinha.md:184`) — com o ponto indisponível, o lançamento
  **continua sendo aceito** e o trabalho continua sendo emitido e registrado.
- `RN-MSA-012` (`docs/produto/modulos/mesa-comanda.md:241`) — `MSA` não consulta preparo para aceitar
  lançamento.

Ou seja: se algo bloqueia, o bloqueio é do **lançamento no núcleo**, nunca do envio à produção. O card
precisa declarar **quem** bloqueia.

**Pendência:** *quem* bloqueia depende de existir marca de disponibilidade no caminho de venda, e a spec
não tem essa marca. É `G-07`, pergunta ao humano. Hoje, no núcleo, indisponível significa **ausência do
artefato publicado** — `RN-NUC-002` (`docs/produto/nucleo-venda.md:113`) não lança item sem preço
publicado, e a falta é declarada como falta de publicação. Disponibilidade **com dono** é de `EST`
(`docs/produto/catalogo-de-modulos.md:93`), **fora do MVP 1**
(`docs/produto/roadmap-de-modulos.md:184`), e o comportamento desligado dele é literal: "a venda não
consulta disponibilidade" (`:96`).

A parte deste card que depende de **item visível e bloqueado** fica atrás de `G-07`. A correção de
fronteira acima não depende dela.

---

### SPR-28 — AJUSTAR
CAMPO: comentário
PROVA: `docs/produto/fronteira-do-nucleo.md:84`, `docs/produto/nucleo-venda.md:215`, `:244`, `docs/produto/roadmap-de-modulos.md:155`, `:184`
DEPENDE DE: nada — declara `G-09`, não a decide
TEXTO NOVO:

**Contradição com a spec aprovada, na linha "fora do MVP".**

Desconto e acréscimo **não** estão fora do MVP 1. São **núcleo** —
`docs/produto/fronteira-do-nucleo.md:84`, com o motivo escrito: "os três dão desconto e os três precisam
limitar quem dá" — e têm duas `RN` **dentro** do MVP 1 (`docs/produto/roadmap-de-modulos.md:155`, bloco
`NUC`):

- `RN-NUC-006` (`docs/produto/nucleo-venda.md:215`) — **até** o limite publicado para o papel de quem
  opera, é **aplicação**: acontece localmente, com autor identificado, e o fato congela **qual versão do
  limite** foi aplicada. Sem contato e sem autoridade retida válida, o teto aplicado é o do
  **papel-piso**, publicado, e o registro diz **qual** teto foi aplicado.
- `RN-NUC-007` (`docs/produto/nucleo-venda.md:244`) — **acima** do limite é autoridade nova, verificada
  **no servidor**; não é concedida, presumida nem enfileirada no terminal. **Recusa** em D1, D2 e D3,
  classe 4. O motivo escrito: excesso liberado offline é o caminho de fraude mais barato que um PDV
  oferece, porque quem o usa escolhe o momento.

Um card não retira do MVP o que o roadmap põe nele.

**Ficam fora com razão, e por dono declarado:** taxa de serviço, couvert e embalagem são `ECG`; promoção
condicional é `PRM`; gorjeta e comissão são de módulo. Nenhum deles está no MVP 1
(`docs/produto/roadmap-de-modulos.md:184`).

**Pendência declarada, não decidida:** a **precisão e o arredondamento** da composição do valor, e a
ordem em que se aplicam, são linha da tabela fechada de `RN-NUC-013` com `LACUNA-NUC-004` **no lugar do
valor** (`docs/produto/nucleo-publicacao-e-texto.md:46`), e decisão de produto **com o humano e o
contador, antes da Fase 1** (`docs/produto/roadmap-de-modulos.md:333`). É `G-09`. O aceite de **centavo**
deste card fica atrás dela.

> Se o comentário já publicado neste card em 2026-08-26 já carrega `RN-NUC-006`, `RN-NUC-007` e
> `fronteira-do-nucleo.md:84`, essa parte é **já aplicada**; poste apenas o parágrafo de `G-09` se ele
> ainda não estiver lá.

---

### SPR-29 — AJUSTAR
CAMPO: título
PROVA: `docs/produto/modulos/mesa-comanda.md:166`
DEPENDE DE: nada
TEXTO NOVO:

Compor o acumulado do consumo em aberto — o núcleo compõe, `MSA` expõe

---

### SPR-29 — AJUSTAR
CAMPO: descrição
PROVA: `docs/produto/modulos/mesa-comanda.md:166`, `:81`, `docs/produto/nucleo-publicacao-e-texto.md:27`, `:97`
DEPENDE DE: nada — declara `G-09`, não a decide
TEXTO NOVO:

## Enunciado

O acumulado de um consumo em aberto é **composto pelo núcleo** e apenas **exposto** por `MSA`. `MSA` não
soma, não rateia e não distribui centavo. O acumulado exibido é **informação**, não valor devido:
enquanto o consumo está aberto não existe venda, valor devido definitivo, pagamento nem obrigação
documental.

## Regras que governam

- `RN-MSA-007` (`docs/produto/modulos/mesa-comanda.md:166`) — `MSA` entrega ao núcleo **quais lançamentos
  vão em qual parte** (ou a instrução "dividir igualmente em N"); quem calcula total, encargo, desconto e
  tributo de cada parte é o núcleo e os módulos responsáveis. Literal: "`MSA` não soma, não rateia e não
  distribui centavo." O motivo escrito: rateio feito no módulo, ou pior, na tela, é divergência garantida
  entre o que o cliente-final vê e o que é cobrado.
- `RN-MSA-001` (`docs/produto/modulos/mesa-comanda.md:81`) — o acumulado exibido é informação, e a peça de
  conferência entregue ao cliente-final é declaradamente **não fiscal** e **não vincula valor**.
- `RN-NUC-013` (`docs/produto/nucleo-publicacao-e-texto.md:27`) — nenhum valor é composto a partir de algo
  fora da lista **fechada** de artefato publicado, e o fato congela a versão de cada artefato que
  participou dele.

## Aceite

1. Consumo com 3 itens → o acumulado exibido vem do backend, e **nenhum** valor exibido é composto por
   `MSA` nem pela tela.
2. Repartir o consumo em 2 partes, uma delas com metade de um item → a repartição reproduz **exatamente**
   os 3 itens, e os totais de cada parte vêm do backend (`RN-MSA-007`, aceite).
3. Durante os 40 minutos em que o consumo está aberto, ele **não** aparece em nenhuma consulta de vendas
   nem de faturamento do dia (`RN-MSA-001`, aceite).
4. Verificar que **nenhum** valor do acumulado foi composto a partir de artefato fora da tabela de
   `RN-NUC-013` (`docs/produto/nucleo-publicacao-e-texto.md:97`).

## Caminho infeliz

Repartição que sobra ou falta lançamento → o fechamento é **recusado antes** de concluir qualquer
cobrança; nenhuma parte é concluída "para resolver o resto depois". Divisão igualitária que não fecha em
centavos → a diferença é resolvida por quem calcula o valor, e `MSA` apenas transporta a instrução
(`RN-MSA-007`, infeliz).

## Pendência declarada, não decidida

A **precisão e o arredondamento** da composição, e a ordem em que se aplicam, são linha da tabela de
`RN-NUC-013` com `LACUNA-NUC-004` no lugar do valor (`docs/produto/nucleo-publicacao-e-texto.md:46`), e
decisão de produto com o humano e o contador **antes** da Fase 1
(`docs/produto/roadmap-de-modulos.md:333`). É `G-09`. Este card compõe o acumulado; ele **não** decide o
arredondamento, e o aceite de centavo fica atrás de `G-09`.

---

### SPR-33 — AJUSTAR (parte que não depende de nenhuma `G`)
CAMPO: comentário
PROVA: `docs/produto/nucleo-publicacao-e-texto.md:160`, `:170`
DEPENDE DE: nada
TEXTO NOVO:

**A chave de equivalência não pode incluir a observação — e isto não é armadilha a evitar, é contradição
com regra aprovada.**

`RN-NUC-016` (`docs/produto/nucleo-publicacao-e-texto.md:160`, cláusula em `:170`): o texto que o núcleo
guarda é preservado **literal e opaco** — nunca interpretado como código, marcação ou instrução, e
**nunca chave de decisão**, nunca capaz de conceder autoridade, ampliar escopo, mudar limite, aplicar
valor ou alterar prioridade. A observação do item de pedido (`order_item_note`) é nomeada por essa regra.

Chave de equivalência **é** chave de decisão. Então: a observação **não** entra na chave, em nenhuma
versão do modelo.

E o que a chave serve para decidir também mudou: consolidação é **agregação de apresentação**, não fusão
de fato — ver a descrição corrigida de `SPR-23`. Equivalência para **exibir** pode considerar composição;
**identidade** de fato nunca é composição.

Isto vale independentemente do bloqueio já registrado neste card, e **não** o levanta.

---

### SPR-46 — AJUSTAR
CAMPO: comentário
PROVA: `docs/produto/glossario.md:395`, `docs/produto/nucleo-publicacao-e-texto.md:49`
DEPENDE DE: nada — declara `LACUNA-GLO-001`, já nomeada na spec, não a decide
TEXTO NOVO:

**Dependência a declarar — `LACUNA-GLO-001`**, aberta e do humano (`docs/produto/glossario.md:395`):
quando um cliente (tenant) tem estabelecimentos em fusos diferentes, qual fuso decide vigência, "hoje",
turno e fechamento — o do estabelecimento ou o do cliente? Os dois estão declarados hoje, em arquivos
diferentes.

Consequência para este card: o formatador único **formata**, e **nunca** decide qual fuso vale. O fuso é
**artefato publicado** — configuração do estabelecimento usada na composição, linha **não delegável** da
tabela de `RN-NUC-013` (`docs/produto/nucleo-publicacao-e-texto.md:49`) — e o fato congela os valores
vigentes **com o fuso declarado**.

Sem esta cláusula, o card fecha escolhendo o fuso por omissão, **dentro de um utilitário** — que é o pior
lugar possível para uma decisão de produto morar, porque ninguém a revisa depois.

Aceite: nenhum caminho do formatador escolhe fuso; ele recebe o fuso declarado do fato ou do artefato
publicado, e a **ausência** dele é erro, não default.

---

# Bloco B — não aplicar. Espera resposta do humano.

> **Pare aqui.** Cada entrada abaixo depende de uma lacuna `G-nn` que é do humano. Nenhuma delas foi
> decidida, e nenhuma se decide por eliminação (`docs/produto/fronteira-do-nucleo.md:169`, passo 5).
> Quatro são fronteira núcleo × módulo, e errar para "núcleo" é o defeito mais caro do projeto: sai só
> com migration em N schemas.
>
> **Em nenhum destes cards a necessidade está em discussão.** Card mal escrito não é card desnecessário —
> a pergunta é sobre a necessidade, e em todos ela se sustenta.

### SPR-16 — BLOQUEAR
CAMPO: comentário
PROVA: `docs/produto/catalogo-de-modulos.md:98`, `docs/produto/fronteira-do-nucleo.md:64`–`:75`, `:169`
DEPENDE DE: `G-03`
TEXTO NOVO:

**Bloqueada — `G-03`: "categoria de catálogo" não existe na spec aprovada, e este card a usa como se
existisse.**

A necessidade é real e não está em discussão: **achar o item sem saber o código**. O caderno de papel já
resolve isso hoje, e o produto não pode entregar menos (`.claude/rules/00-nucleo.md` §12).

**O que falta:** "categoria de catálogo", hierárquica, não tem termo em `docs/produto/glossario.md`, não
tem `RN`, não tem linha na tabela de fronteira de catálogo e preço
(`docs/produto/fronteira-do-nucleo.md:64`–`:75`), e o **agrupamento** é reivindicado como capacidade de
**módulo** por `PUB` (`docs/produto/catalogo-de-modulos.md:98`: "descrição, imagem, atributo público,
**agrupamento**, disponibilidade por canal"). O teste dos três negócios nunca foi aplicado a ela.

**Por que não decido aqui:** caso assim vem como **pergunta**, nunca por eliminação
(`docs/produto/fronteira-do-nucleo.md:169`, passo 5). Os candidatos e o custo de cada um estão em
`docs/produto/revisao-backlog-spr-2026-08-26.md` §4, item 1 — inclusive o contra-argumento honesto: sem
nenhum agrupamento no núcleo, o operador de padaria só acha item por código.

**Além do bloqueio, uma correção de mecanismo para quando ele cair:** "sem limitação fixa de profundidade"
é **mecanismo**, não necessidade — e mecanismo de catálogo quente passa pelo gate de `performance`
(`CLAUDE.md` §4, gate 4) antes de virar critério de aceite.

**Desbloqueia com:** resposta do humano a `G-03`.

---

### SPR-19 — BLOQUEAR
CAMPO: comentário
PROVA: `docs/produto/fronteira-do-nucleo.md:71`, `:206`, `docs/produto/catalogo-de-modulos.md:253`, `docs/produto/receitas-por-vertical.md:46`
DEPENDE DE: `G-04`
TEXTO NOVO:

**Bloqueada — `G-04`: este card põe variação por eixos no núcleo, e a fronteira aprovada a classifica
como módulo.**

A necessidade é legítima e é do ramo — tamanho, sabor. Não está em discussão.

**A contradição:** `docs/produto/fronteira-do-nucleo.md:71` classifica "item composto por eixos
(cor/tamanho)" como **módulo**, com o motivo escrito: "padaria e posto não precisam; loja de roupa não
vive sem". O dono é `GRD` (`docs/produto/catalogo-de-modulos.md:253`), que nomeia literalmente "cor,
tamanho, **sabor**", e cujo comportamento **desligado** é: cada combinação é um item de catálogo próprio,
cadastrado individualmente.

**O buraco é da spec, não do card:** `GRD` está fora do MVP 1
(`docs/produto/roadmap-de-modulos.md:184`) e a receita da vertical `RES` **não o liga**
(`docs/produto/receitas-por-vertical.md:46`). Então o ramo de construção precisa da capacidade e a
receita não a prevê.

**Por que não decido aqui:** as três saídas têm custo, e a terceira — rever a fronteira de `GRD` — é a
mais caro de errar, porque mexer em núcleo acontece com todos os clientes em produção
(`docs/produto/fronteira-do-nucleo.md:206`). As três estão em
`docs/produto/revisao-backlog-spr-2026-08-26.md` §4, item 2.

**Desbloqueia com:** resposta do humano a `G-04` — ligar `GRD` na receita `RES` e antecipá-lo; aceitar o
comportamento desligado já escrito (cada combinação é item de catálogo próprio); ou rever a fronteira de
`GRD`.

---

### SPR-20 — BLOQUEAR
CAMPO: comentário
PROVA: `docs/produto/glossario.md` §4.1 e §4.3, `docs/produto/nucleo-publicacao-e-texto.md:29`–`:50`, `:32`, `:97`, `:79`
DEPENDE DE: `G-05`
TEXTO NOVO:

**Bloqueada — `G-05`: "adicional / complemento" não existe em nenhum escopo da spec aprovada.**

A necessidade é a mais concreta do board e não está em discussão.

**O que falta:** a entidade não é núcleo (o teste dos três negócios **falha** — posto e loja de roupa não
precisam), não é `PRM` (promoção condicional), não é `ECG` (encargo nomeado), não é `FTC` (insumo / ficha
técnica), e **não tem código reservado** em `docs/produto/glossario.md` §4.3. Reservar código não é meu:
se a resposta for "módulo", o código nasce no glossário **antes** da spec, e código de módulo é
**imutável** (`glossario.md` §4.1).

**Contradição adicional, independente da fronteira:** "valor do adicional incorporado ao valor do item"
compõe valor a partir de artefato que **não está** na lista fechada de `RN-NUC-013`
(`docs/produto/nucleo-publicacao-e-texto.md:29`–`:50`). O aceite dessa regra é literal (`:97`): verificar
que **nenhum** valor da venda foi composto a partir de algo fora da tabela. E a lista é fechada —
"artefato novo entra por alteração desta regra, com motivo escrito, nunca por conveniência de construção"
(`:32`). Duas saídas, as duas pelo humano: ou a tabela muda por alteração declarada de `RN-NUC-013`, ou o
adicional **não compõe valor offline**.

Há um contrato já escrito que serve de precedente para a primeira saída: **todo** módulo que compõe valor
publica artefato versionado com vigência, e o fato congela a versão de cada um
(`docs/produto/nucleo-publicacao-e-texto.md:79`).

**Desbloqueia com:** resposta do humano a `G-05` (classificar), mais a decisão sobre a tabela de
`RN-NUC-013`.

---

### SPR-26 — BLOQUEAR
CAMPO: comentário
PROVA: `docs/produto/nucleo-venda.md:113`, `docs/produto/catalogo-de-modulos.md:90`, `:96`, `docs/produto/roadmap-de-modulos.md:184`, `docs/produto/modulos/cozinha.md:215`
DEPENDE DE: `G-07`
TEXTO NOVO:

**Bloqueada — `G-07`: não existe `RN` de disponibilidade no caminho de venda do núcleo, e este card
presume o item visível e marcado como indisponível.**

A necessidade é real: quem opera precisa saber que não tem **antes** de prometer ao cliente-final.

**O estado real da spec:**

- No núcleo, indisponível significa **ausência do artefato publicado**: `RN-NUC-002`
  (`docs/produto/nucleo-venda.md:113`) não lança item sem preço publicado, e a falta é declarada como
  **falta de publicação**. Isso é ausência — não item visível marcado.
- Disponibilidade **com dono** é de `EST` (`docs/produto/catalogo-de-modulos.md:90`, que expõe
  "disponibilidade por item"), e `EST` está **fora do MVP 1**
  (`docs/produto/roadmap-de-modulos.md:184`). O comportamento desligado é literal: "a venda não consulta
  disponibilidade, nada é baixado, sem aviso de falta nem tela de estoque; o caixa vende igual" (`:96`).
- E `COZ` **não** decide disponibilidade (`RN-COZ-010`, `docs/produto/modulos/cozinha.md:215`), então não
  há terceiro caminho já escrito.

**A pergunta, que é do humano:** existe marca de disponibilidade no **núcleo**, ou disponibilidade é
exclusivamente de `EST`? Decidir por `EST` implica que este card **não é construível no MVP 1** — o que é
resposta legítima, e é bem diferente de o card ser desnecessário.

**Desbloqueia com:** resposta do humano a `G-07`.

---

### SPR-31 — BLOQUEAR (já aplicado; o que segue é o que vai além)
CAMPO: comentário
PROVA: `.claude/rules/processo.md` §2, `.claude/rules/migrations.md` §4
DEPENDE DE: `G-03`
TEXTO NOVO:

> Rótulo `bloqueada` e comentário de bloqueio **já aplicados** em 2026-08-26. Poste o que segue apenas se
> o comentário já publicado não o cobrir.

**Além do já registrado: o bloqueio deste card tem duas pernas, não uma.**

1. **`G-03`** — a entidade "categoria de catálogo" nunca foi classificada. Ver o bloqueio de `SPR-16`.
2. **Inversão de ordem** — o card de **modelo** está agendado **antes** do card de **regra** (`SPR-16`)
   na trilha. Isso inverte o invariante 7 (contrato antes de código) e a definição de pronto de
   `.claude/rules/processo.md` §2, que exige a regra numerada em `docs/produto/**`, com critério de
   aceite, antes do modelo. E é a fase em que errar custa o ciclo expand/contract em N schemas
   (`.claude/rules/migrations.md` §4), não um refactor.

A segunda perna **não** cai com a resposta de `G-03`: mesmo com a fronteira decidida, a regra vem antes
do modelo.

**Desbloqueia com:** `G-03` respondida **e** `SPR-16` com regra numerada e critério de aceite.

---

### SPR-32 — BLOQUEAR (já aplicado; o que segue é o que vai além)
CAMPO: comentário
PROVA: `docs/produto/fronteira-do-nucleo.md:71`, `:72`, `docs/produto/catalogo-de-modulos.md:253`, `docs/produto/glossario.md:63`, `:355`
DEPENDE DE: `G-04`, `G-05` (a parte de vocabulário não depende de nenhuma)
TEXTO NOVO:

> Rótulo `bloqueada` e comentário de bloqueio **já aplicados** em 2026-08-26. Poste o que segue apenas se
> o comentário já publicado não o cobrir.

**Além do já registrado: o título afirma uma fronteira que nenhuma regra aprovada sustenta, e que uma
linha aprovada contradiz.** "Modelar produto, variação e complemento **no núcleo**":

- **Variação** por eixos é **módulo** (`GRD`) — `docs/produto/fronteira-do-nucleo.md:71` e
  `docs/produto/catalogo-de-modulos.md:253`. É `G-04`.
- **Complemento / adicional** não tem escopo, dono nem código reservado. É `G-05`.
- **"Produto"** é vocabulário proibido para entidade (`docs/produto/glossario.md:63`, `:355`) — o termo é
  `catalog_item`. **Esta parte não depende de nenhuma `G`:** vale já, e é exatamente onde o termo do
  título chega ao nome da tabela.

**O que está certo no card e não é bloqueado:** ingrediente / insumo no **módulo**.
`docs/produto/fronteira-do-nucleo.md:72` classifica "composição por insumo (ficha técnica)" como módulo,
com o motivo escrito ("quem revende embalado não precisa"), e os donos são `FTC` e `EST`.

**Título quando desbloquear:** ele não pode ser escrito hoje, porque nomeia exatamente o que `G-04` e
`G-05` decidem. A única parte já decidida é a substituição de "produto" por "item de catálogo".

**Desbloqueia com:** `G-04` e `G-05` respondidas.

---

### SPR-33 — BLOQUEAR (já aplicado; o que segue é o que vai além)
CAMPO: comentário
PROVA: `.claude/rules/migrations.md` §4
DEPENDE DE: `G-04`, `G-05`
TEXTO NOVO:

> Rótulo `bloqueada` e comentário de bloqueio **já aplicados** em 2026-08-26. Poste o que segue apenas se
> o comentário já publicado não o cobrir.

**Além do já registrado:** a chave de equivalência de **composição** não pode ser desenhada antes de a
spec dizer **o que compõe** um item de catálogo. Composição hoje depende de duas entidades não
classificadas — variação (`G-04`) e adicional / complemento (`G-05`). Chave desenhada sobre composição
indefinida é chave que muda quando a fronteira cair, e chave em N schemas muda por expand/contract
(`.claude/rules/migrations.md` §4), não por edição.

**A perna do bloqueio que cai hoje é outra**, e está no comentário aplicável do Bloco A: a observação em
texto livre **nunca** entra na chave, por `RN-NUC-016`. Essa parte não espera nenhuma `G`.

**Desbloqueia com:** `G-04` e `G-05` respondidas, **e** `SPR-23` com a regra aprovada — a descrição
corrigida de `SPR-23` está no Bloco A.

---

### SPR-34 — BLOQUEAR (parte de escopo)
CAMPO: comentário
PROVA: `docs/produto/roadmap-de-modulos.md:258`–`:266`, `:328`, `:334`, `docs/produto/nucleo-publicacao-e-texto.md:46`, `docs/produto/glossario.md:395`
DEPENDE DE: `G-01`, `G-02`, `G-09`
TEXTO NOVO:

**Bloqueada na parte de escopo — `G-01` e `G-02`.** O card não está errado: está **incompleto** naquilo
que a Fase 1 não pode não ter, e completá-lo exige decisão do humano.

**`G-01` — as três reservas da Opção B.** `docs/produto/roadmap-de-modulos.md:258`–`:266` declara que
**três** coisas entram no modelo da Fase 1 **mesmo sem `EMI` construído**, e que são pré-requisito da
Fase 1 mesmo com `EMI` desligado para todo cliente — é a condição de "todos os dados para a futura
implementação existirem" que o humano pediu ao confirmar a Opção B (T-0005):

1. **Numeração** como mecanismo de **alocação** por estabelecimento **e** série, com alocação concorrente
   e possivelmente no terminal.
2. **Congelamento** do fato **e o grão** dele.
3. **Âncora da obrigação documental** no fato, para que a venda antiga saiba a que documento ela
   corresponderia.

Sem as três, "depois a gente liga `EMI`" não é transição: é **migração de dado fiscal em N clientes**
(`:264`). **Nenhuma issue do board as cobre** — `SPR-37` para em venda, pagamento, caixa e operador.

**O grão é a parte cara.** `docs/produto/roadmap-de-modulos.md:328` é explícito: se o congelado nascer
por **venda** em vez de por `item × tributo × base × regime × redutor`, a segregação de `RN-FIS-015` e a
decomposição de `RN-FIS-014` ficam **irrecuperáveis para todo o histórico**. O dono declarado é
`produto`, **com o humano e o contador**, antes da Fase 1 (`:334`) — e não é meu para decidir sozinho,
porque envolve afirmação fiscal que eu não tenho como confirmar.

**`G-02` — turno.** Ver o bloqueio de `SPR-37`.

**Também no escopo, e também do humano:** a política de arredondamento (`G-09` —
`docs/produto/nucleo-publicacao-e-texto.md:46` e `docs/produto/roadmap-de-modulos.md:333`) e
`LACUNA-GLO-001`, o fuso (`docs/produto/glossario.md:395`). As duas **antes** de modelar qualquer coisa
datada ou valorada.

**Desbloqueia com:** `G-01` (confirmação de que as três reservas entram, mais o grão com o contador),
`G-02` e `G-09`.

---

### SPR-37 — BLOQUEAR (só a parte de turno)
CAMPO: comentário
PROVA: `docs/produto/nucleo-venda.md:370`, `:381`, `docs/produto/operacao-offline-e-sincronizacao.md:95`, `:99`, `docs/produto/modulos/mesa-comanda.md:194`
DEPENDE DE: `G-02`
TEXTO NOVO:

**Bloqueada só na parte de turno — `G-02`.** Venda, pagamento, sessão de caixa e operador **seguem**;
nada abaixo os atinge.

**Retirar `turno` do escopo, ou condicioná-lo explicitamente a `G-02`.** Razão:

- `LACUNA-NUC-007` (`docs/produto/nucleo-venda.md:370`) está **fechada pela metade**: o fechamento do dia
  por estabelecimento ganhou regra dona (`RN-NUC-031`), mas **abertura e fechamento de turno continua sem
  nenhuma regra numerada**.
- Sem regra, a operação é **recusada** pelo default de `RN-OFF-008`
  (`docs/produto/operacao-offline-e-sincronizacao.md:95`) — e o próprio enunciado dessa regra cita
  `LACUNA-NUC-007` como **o exemplo vivo** (`:99`).
- A resposta do humano registrada é "não sei ainda", e o dono declarado é **humano, para dizer o que
  turno é; depois `produto`** (`docs/produto/nucleo-venda.md:381`).

Modelar turno hoje é inventar quem o abre, o que ele encerra, e o que acontece com sessão de caixa aberta
na virada — e o **modelo** é a camada onde isso não se desfaz.

**O que já está decidido e não se perde:** turno é **eixo independente** da sessão de caixa
(`docs/produto/glossario.md` §1.5); consumo em aberto **atravessa** sessão de caixa, turno e virada de
dia sem ser fechado, cancelado ou congelado; e a venda pertence ao dia e ao turno da **conclusão**
(`RN-MSA-009`, `docs/produto/modulos/mesa-comanda.md:194`). Essas cláusulas existem e sobrevivem a
qualquer resposta de `G-02` — mas **nenhuma** delas diz o que turno **é**.

**Desbloqueia com:** resposta do humano a `G-02`.

---

### SPR-40 — BLOQUEAR (só a parte de produto)
CAMPO: comentário
PROVA: `docs/produto/nucleo-publicacao-e-texto.md:46`, `:60`–`:64`, `docs/produto/roadmap-de-modulos.md:333`–`:334`
DEPENDE DE: `G-09`
TEXTO NOVO:

**Bloqueada só na parte de produto — `G-09`.** Tipo e escala de dinheiro e de quantidade são de
`arquiteto-dados` (`.claude/rules/dados.md` §3) e **seguem** sem depender disto.

**O que é de produto e não está decidido: precisão, arredondamento, e a ordem em que se aplica.**

- É **artefato publicado**: linha da tabela **fechada** de `RN-NUC-013` — "precisão e arredondamento da
  composição do valor" — com `LACUNA-NUC-004` **no lugar do valor**
  (`docs/produto/nucleo-publicacao-e-texto.md:46`). O fato congela a versão da regra de composição.
- É **trava**, não retaguarda: desde 2026-08-23 a linha 38 da matriz — moeda, precisão, arredondamento e
  fuso — é **não delegável**, porque decide **quanto se paga em cada venda** e a que **dia** o fato
  pertence (`docs/produto/nucleo-publicacao-e-texto.md:60`–`:64`, achado `AUT-13`).
- O dono declarado é `produto` **com o humano e o contador, antes da Fase 1**
  (`docs/produto/roadmap-de-modulos.md:333`–`:334`), e o motivo escrito é direto: sem ela, "o
  cancelamento erra por centavo".

**Por que eu não a escrevo:** depende de norma e de confirmação contábil. Regra fiscal ou de composição
de valor que eu não tenho como confirmar não sai daqui por analogia com "todo PDV faz assim".

**Consequência de fechar o card sem isso:** o congelado nasce sem a metade que o cancelamento usa — e o
congelado é append-only, então a correção não é edição, é histórico errado.

**Desbloqueia com:** `G-09` respondida pelo humano com o contador. Depois disso a **forma** é de
`arquiteto-dados`.

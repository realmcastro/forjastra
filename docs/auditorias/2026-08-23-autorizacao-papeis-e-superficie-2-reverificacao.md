# Auditoria — reverificação das correções (`AUT-01` a `AUT-14`)

**Data:** 2026-08-23 · **Escopo:** T-0003, passo 4, rodadas 2 e 3 · **Agent:** `seguranca` · **Read-only.**

**Irmão de `2026-08-23-autorizacao-papeis-e-superficie.md`.** A primeira rodada está no teto de 400
linhas, então a divisão é por **rodada**, não por eixo: lá os achados `AUT-01` a `AUT-11` e a resposta
de prioridade um; aqui a conferência das correções e os achados que a conferência produziu — `AUT-12` a `AUT-14` na
rodada 2 (§ abaixo) e `AUT-15` a `AUT-17` na rodada 3 (§ final). Numeração contínua entre os dois.

**O que foi conferido:** só se a correção fecha o cenário que a primeira rodada **provou**. Não reabri
escopo e não auditei o que não foi corrigido.

**Veredito por achado.** Fecham: `AUT-01` (`RN-NUC-038`, e fecha melhor — a cláusula (b) iguala a
resposta de "não existe" e "existe em outro escopo", matando o oráculo de existência), `AUT-02`
(`RN-NUC-040` + partição da linha 18 em 18/36/37/38/39), `AUT-03`, `AUT-04`, `AUT-06`, `AUT-07`
(`RN-NUC-037`), `AUT-08` (`RN-NUC-039`), `AUT-09` e `AUT-10` — os dois últimos por mecanismo **melhor**
que o que eu sugeri: `RN-NUC-024` (e) passou a nomear a capacidade de assinar como absoluto **e**
`RN-NUC-039` (b) fez da célula um teto, e (d) tornou a concessão **não concedível** enquanto a leitura
da trilha não tiver célula. Fecham com resíduo: `AUT-05` (resíduo em `AUT-12`), `AUT-02` (resíduo em
`AUT-13`). `AUT-11` fecha.

**O risco de conserto materializou-se em `AUT-14`**, e ele não vem de nenhum dos 11: vem de
`RN-OFF-032`, escrita na mesma rodada.

---

### AUT-12 — A leitura derivada de `RN-NUC-035` (i.b) autoriza o texto literal de terceiro na lista de trabalho, porque a `RN` dona o enumera — [MÉDIO]
**ONDE:** `docs/produto/superficie-por-papel.md:74-81` (`RN-NUC-035` i.b, nova);
`docs/produto/operacao-offline-e-sincronizacao.md:180` (`RN-OFF-012`, enunciado — **não** alterado);
`docs/produto/fila-local-conteudo-e-repouso.md:178-187` (`RN-OFF-027`);
`docs/produto/superficie-por-papel-momentos.md:141-148` (a nota de leitura que declara o contrário).
**CENÁRIO:** item rejeitado em definitivo entra na lista de trabalho. `manager` resolve o item (linha
29, `R`) — objeto produzido por outro terminal, logo **leitura derivada**. A cláusula (i.b) libera
"apenas os campos que a decisão exige, **enumerados na `RN` dona**", e a `RN` dona é `RN-OFF-012`, cujo
enunciado enumera "**motivo preservado literalmente**". Esse motivo é o texto do autorizador, e
`RN-OFF-027`, motivo, diz literalmente que ele "pode conter identificação do comprador, logo herda a
minimização de `RN-EMI-017` **no momento em que aparece na lista de trabalho**". Resultado: o `manager`
lê identificação de comprador **fora da venda** — exatamente a operação cuja célula é `?`
(`LACUNA-NUC-018`) — e a leitura **passa** pelo novo portão, em vez de ser barrada por ele.
**POR QUE É REAL:** é a mesma forma de defeito de `AUT-05`, um arquivo adiante, e agora com o portão a
favor. `superficie-por-papel-momentos.md:146` declara que "o conteúdo de terceiro continua sem
decisão" — mas isso é nota em arquivo **derivado**, e a regra que governa a origem libera. A primeira
rodada já nomeou esse padrão: regra que contradiz o arquivo derivado dela é o caminho mais barato de a
autorização vazar, porque ninguém precisa violar nada. O estreitamento de (i.b) foi eficaz nas duas
linhas cujas `RN` foram enumeradas na mesma passada (13 e 30) e inócuo onde a enumeração **preexistia**
e inclui texto opaco.
**CORREÇÃO SUGERIDA:** (i.b) exclui campo que qualquer regra declare **opaco** (`RN-OFF-027`,
`RN-NUC-016`) — texto opaco não é campo enumerável, é conteúdo —, e `RN-OFF-012` separa o **inventário**
do item (estado, origem, efeito declarado) do **conteúdo literal**, que é origem (iii) — dono:
`produto`.

### AUT-13 — A partição da linha 18 deixou precisão, arredondamento e fuso no pacote delegável, contra o critério que a própria `RN-NUC-040` (b) declara — [MÉDIO]
**ONDE:** `docs/produto/matriz-operacao-papel.md:91` (linha 38, nota ¹² = **delegável**), `:117`
(nota ¹²), `:119` (nota ¹³ e o critério); `docs/produto/matriz-operacao-papel-contrato.md`
(`RN-NUC-040` b, a lista fechada de quatro); `docs/produto/nucleo-publicacao-e-texto.md:46` e `:49`
(`RN-NUC-013`: precisão/arredondamento e fuso são artefatos publicados).
**CENÁRIO:** `owner` delega a linha 38 a X, o funcionário de retaguarda — delegação legítima pelo
rótulo ¹² ("pacote de retaguarda"). X publica a regra de **precisão e arredondamento** da composição do
valor. Dois desfechos, os dois financeiros e sistemáticos: **(a)** arredondamento deslocado aplica-se a
**todo** fato, é classe 1 (aplicado offline, `RN-NUC-013`), fica **congelado** no fato e o servidor
**não recalcula** na volta (`RN-NUC-015`) — erro que só aparece no fechamento do contador, que é
exatamente o motivo pelo qual `LACUNA-NUC-004` existe e não foi afirmada; **(b)** publicando o **fuso**,
X move a fronteira de "hoje", do turno e da vigência de preço (`RN-NUC-010`, infeliz (c)), e — pelo
risco que a primeira rodada registrou — plausivelmente a base de cálculo da validade da autoridade
retida.
**POR QUE É REAL:** pelo critério que `RN-NUC-040` (b) escreve para justificar a lista fechada — "elas
publicam a **trava** que contém a autoridade, não o que o negócio vende" — precisão, arredondamento e
fuso **não** são o que o negócio vende: são a aritmética e o relógio de todo fato. A partição acertou as
quatro travas de autoridade e classificou a trava **aritmética** como retaguarda. Não é caminho novo (o
pacote antigo já a continha), é caminho **remanescente** que a correção teve a chance de fechar e
rotulou como legítimo.
**CORREÇÃO SUGERIDA:** partir a linha 38 e mover precisão/arredondamento — e a decisão sobre fuso —
para a lista não delegável de `RN-NUC-040` (b), ou declarar por escrito por que a trava aritmética é
retaguarda — dono: `produto`. Entrada de `LACUNA-NUC-004`.

### AUT-14 — `RN-OFF-032` contradiz a coluna `Offline` de dez linhas e, por `RN-NUC-039`, perde para elas: o comportamento do caminho crítico fica indefinido — [ALTO]
**ONDE:** `docs/produto/fila-local-conteudo-e-repouso.md:215-262` (`RN-OFF-032`, nova);
`docs/produto/matriz-operacao-papel.md` — linhas 1–4, 6, 10, 12, 15, 17, todas com `retida` na coluna
`Offline` (`matriz-operacao-papel.md:54-73`); `docs/produto/matriz-operacao-papel-contrato.md`
(`RN-NUC-027`, cláusulas 2 e 3, **não** alteradas; `RN-NUC-039`, nova);
`docs/produto/superficie-por-papel.md:28` e `superficie-por-papel-momentos.md:202`.
**CENÁRIO:** `RN-OFF-032` declara que o **ato ordinário** — abrir pedido, lançar item, concluir venda,
receber em espécie, abrir e fechar a **própria** sessão, gaveta por venda — **não** se sustenta em
autoridade retida. As células dessas mesmas operações continuam marcadas `retida`, e `RN-NUC-027` define
`retida` como "concedida por **autoridade retida válida**". São a mesma operação com dois valores. E
`RN-NUC-039`, criada na mesma rodada, resolve o empate **contra** a correção: a célula é autoridade
única sobre autorização e vence prosa em **qualquer** `RN`, inclusive a dona. Logo, pela letra do
conjunto, `RN-OFF-032` é inerte justamente nas operações que ela existe para liberar — e o implementador
correto mantém o balcão dependente de autoridade retida, isto é, **o caixa para de vender quando a
validade vence**, que é o defeito contra `PN-01` que a regra foi escrita para fechar. O implementador
que preferir a prosa faz exatamente o que `RN-NUC-039` proíbe, reabrindo a classe de `AUT-08`. Não há
terceira leitura.
**Segundo efeito, no mesmo par:** `RN-NUC-027` cláusula 2 ("para `owner` toda célula offline é recusa"),
`RN-NUC-028` (d) e as duas afirmações de superfície de que "quem porta **apenas** `owner`, com o link
caído, **não vende**" passam a ser falsas sob `RN-OFF-032` — vender virou ato ordinário, que depende da
habilitação do **terminal** e da identificação, não do papel. A superfície continua declarando ao
`owner`, na habilitação, uma consequência que a regra nova removeu. Erra para o lado seguro hoje, e é o
tipo de afirmação obsoleta que depois se "conserta" dando autoridade retida ao `owner`.
**POR QUE É REAL:** não é hipótese de arquitetura: são dois textos normativos do mesmo conjunto, com a
mesma data, dizendo coisas diferentes sobre as mesmas dez linhas, e uma terceira regra da mesma data
declarando qual vence. Nada aqui exige má-fé nem descuido — exige apenas ler o conjunto.
**CORREÇÃO SUGERIDA:** `RN-NUC-027` ganha o **quarto** valor de coluna `Offline` para o ato ordinário
(concedido por habilitação do terminal + identificação, `RN-OFF-032`), as dez linhas recebem esse valor,
e as três afirmações sobre o `owner` offline são reescritas — dono: `produto`. Enquanto a coluna não
mudar, `RN-OFF-032` **não** está em vigor, por `RN-NUC-039`.

---

## Nota sobre `RN-OFF-032`, que não é achado e é o que mais me preocupa depois de `AUT-14`

`RN-OFF-032` (i) — "terminal habilitado a vender por aquele estabelecimento" — é fato retido que
**não expira** ("nenhuma das duas expira com a validade de `RN-OFF-024`"), e a reconciliação de
`RN-OFF-033` (b) e (d) só tem efeito **quando o terminal a recebe**. Terminal furtado e mantido offline
nunca a recebe. `RN-EMI-033` (b) deu prazo declarado à capacidade de assinar exatamente por isso, e
`RN-EMI-037`, motivo, escreve a razão: "terminal sem rede não recebe revogação — é isso, e só isso, que
justifica o prazo curto; sem prazo, a revogação seria promessa que a física do offline não cumpre". A
capacidade de **vender** recebeu o tratamento oposto, no mesmo repositório, com o argumento contrário
disponível uma pasta ao lado. Não abro achado porque o cenário de dano que consigo montar — dispositivo
furtado que segue abrindo sessão, concluindo venda em espécie e entregando via em nome do emitente,
indefinidamente — depende de `AUT-14` ser resolvido **a favor** de `RN-OFF-032`, e hoje ele não está
resolvido. Resolvido a favor, isto é achado, e a correção é uma linha: (i) tem prazo declarado, renovado
no contato, como `RN-EMI-033` (b).

## Nota sobre o canal de pedido nomeado de `RN-NUC-036`

Ele é, por construção, um **oráculo**: quem nomeia operações em série distingue "negado ao meu papel"
(existe, outro autoriza) de "sem suporte de decisão" (existe, ninguém decidiu), e assim reconstrói o
mapa de autorização do próprio estabelecimento — que é o objeto de `LACUNA-NUC-029`. Não abro achado
por três razões: o alcance é intra-estabelecimento; `RN-NUC-022` e `RN-NUC-023` já mandam a **tentativa**
para a trilha, então a varredura é registrada; e a alternativa (silêncio) é o defeito que `AUT-06`
provou ser pior. Duas cláusulas baratas fecham o resíduo, se `produto` quiser: a resposta para nome
**desconhecido** é idêntica à de operação que o papel não alcança, e o pedido nomeado é sempre
registrado, não só quando vira ato.

---

# Rodada 3 — conferência do quarto valor `terminal+ident` (correção de `AUT-14`)

**Veredito.** `AUT-14` **fecha**: `RN-NUC-027` passou a quatro valores, `terminal+ident` está em nove
células (linhas 1, 2, 3, 4, 6, 10, 12, 15, 27), `RN-OFF-032` aponta para a coluna em vez de competir
com ela, e o conjunto ficou **fechado pela coluna** e verificável por busca. As três diferenças em
relação à minha proposta são **melhores** que ela: nove linhas por critério aplicado linha a linha (a
minha era enumeração em prosa, que é o defeito que `AUT-14` denunciou); a exclusão de 5, 17 e 32 é
correta; e a cláusula do teto do papel-piso na linha 6 resolve uma inimplementabilidade que eu não
havia visto. `AUT-12` **fecha** (§ ponto 3 abaixo). Três achados novos, todos nascidos da correção.

### AUT-15 — Célula `R` com `terminal+ident` não tem valor possível no campo "atribuição que autorizou" de `RN-NUC-029` — [MÉDIO]
**ONDE:** `docs/produto/matriz-operacao-papel-contrato.md` — `RN-NUC-029` (registro: "operador **e** a
**atribuição ou a concessão** que autorizou", duas fontes e só duas) e `RN-NUC-027` cláusula 3 ("o ato
ordinário ele pratica **sem atribuição nenhuma**"); `docs/produto/matriz-operacao-papel.md:61`, `:65`,
`:67` (linhas 6, 10 e 12 — valor de papel `R`, coluna `terminal+ident`);
`docs/produto/nucleo-venda.md` (`RN-NUC-006`, **Precondição** ainda exige "papel de quem opera
conhecido — retido, dentro da validade").
**CENÁRIO:** link caído desde 20h, validade da autoridade retida vencida às 21h. Às 21h30 o operador
aplica desconto dentro do limite (linha 6, `R` + `terminal+ident`, teto do papel-piso). O registro é
**precondição do ato** e exige a atribuição que autorizou — e nenhuma autorizou: quem sustentou o ato
foi a habilitação do terminal. Dois desfechos, e os dois são defeito. **(a) Falha fechado:** sem valor
para o campo, o ato é "sem registro", e `RN-NUC-029` diz que ato sem registro **não acontece** — logo
desconto no limite, abrir e fechar a própria sessão voltam a ser recusados ao vencer a validade, que é
exatamente o defeito contra `PN-01` que `AUT-14` removeu. **(b) Falha aberto na trilha:** o
implementador preenche o campo com a única atribuição que o operador tem — se ele porta `manager`, o
desconto aplicado ao teto do **papel-piso** aparece na trilha como autorizado pela atribuição de
`manager`, cujo teto publicado é maior. A verificação que a cláusula do teto existe para permitir
torna-se **impossível a partir da trilha**: piso e teto de gerente ficam indistinguíveis.
**POR QUE É REAL:** é a mesma forma de `AUT-14` — prosa da regra dona contra a coluna — deslocada da
coluna `Offline` para a regra do registro. `RN-NUC-029` foi emendada em 2026-08-23 para admitir
**concessão** ao lado de atribuição (`AUT-10`) e não foi emendada para admitir **identificação**, que é
a terceira fonte que a mesma rodada criou. E `RN-NUC-006` continua com precondição de autoridade retida.
**CORREÇÃO SUGERIDA:** `RN-NUC-029` admite a terceira fonte — a **identificação retida** de `RN-OFF-033`
— e exige, quando ela é a fonte, que o registro diga **qual teto** foi aplicado; `RN-NUC-006` aponta
para a coluna em vez de exigir autoridade retida — dono: `produto`.

### AUT-16 — `C-09` afirma que o terminal furtado perde a habilitação a vender; o prazo é a única coisa que o efetiva, e a notificação ao cliente não carrega essa janela — [MÉDIO]
**ONDE:** `docs/produto/fila-local-conteudo-e-repouso.md` — `C-09`, "o terminal **perde** a habilitação
de vender por aquele estabelecimento (`RN-OFF-032`i), de modo que quem o tiver em mãos **não pratica ato
ordinário nele**", afirmado sem janela; `docs/produto/fila-local-autoridade-e-identidade.md:155-163`
(cláusula do prazo, `LACUNA-OFF-017`); `docs/produto/fiscal-custodia-e-trilha.md` (`RN-EMI-038` (c), que
já notifica "até quando a **capacidade** valia").
**CENÁRIO:** terminal furtado às 23h10 e mantido offline. O servidor revoga a habilitação; o dispositivo
nunca recebe a revogação. Até o prazo de (i) vencer, quem o tem em mãos abre sessão, conclui venda em
espécie, abre a gaveta e entrega via em nome do emitente. O cliente é notificado por `RN-EMI-038` (c)
com "até quando a capacidade **de assinar** valia" e **não** com até quando o terminal ainda vende —
então ele não sabe por quanto tempo vigiar via circulando no nome dele, e `C-09` lhe diz o contrário:
que o dispositivo já não pratica ato ordinário.
**POR QUE É REAL:** é literalmente a frase que `RN-EMI-037`, motivo, proíbe escrever — "sem prazo, a
revogação seria promessa que a física do offline não cumpre". A cláusula do prazo em `RN-OFF-032` sabe
disso; `C-09` e a notificação não foram atualizadas junto. A exposição residual é **inerente e
aceitável** — o que é defeito é afirmá-la como zero.
**CORREÇÃO SUGERIDA:** `C-09` declara a **janela restante** da habilitação a vender, e a notificação de
`RN-EMI-038` (c) passa a carregá-la ao lado da janela da capacidade de assinar — dono: `produto`.

### AUT-17 — Nenhuma célula de módulo carrega `terminal+ident`, e o ato ordinário de `MSA` recusa no minuto em que o do núcleo passa — [MÉDIO] · **não bloqueia a T-0003**
**ONDE:** `docs/produto/matriz-operacao-papel-modulos.md:16-19` (declara o estado e diz que a
divergência "é achado") e §2, linhas "Abrir consumo com alvo e responsável" e "Lançar item em consumo em
aberto" (`P`/`P`/`P`, coluna `retida`); `docs/produto/fila-local-autoridade-e-identidade.md`
(`RN-OFF-032`: "módulo classifica as operações dele pelo mesmo critério").
**CENÁRIO:** cliente com `MSA` ligado — a primeira vertical. Link caído desde 20h; validade vencida às
21h. Às 21h01, no mesmo terminal, o núcleo abre pedido, lança item e conclui em espécie
(`terminal+ident`), e o módulo **recusa** lançar item em consumo em aberto (`retida`), que é a operação
mais frequente daquela operação. Pelo critério de `RN-OFF-032` as duas são ato ordinário: o papel-piso
as alcança pelo próprio papel, sem autorização de outro e sem mover dinheiro fora de venda.
**POR QUE É REAL:** é `AUT-14` um nível abaixo, e o próprio arquivo de módulos declara a divergência em
vez de escondê-la. `produto` acertou em não tocar: valor de célula é do humano (`RN-NUC-026`).
**NÃO BLOQUEIA A T-0003**, e a distinção importa: falha **fechado** — o desfecho é recusa de serviço,
nunca autoridade concedida —, o valor da célula é decisão declarada do humano, e as `RN` donas
(`RN-MSA-004`, `RN-MSA-011`, `RN-COZ-004`) estão fora do escopo desta ficha, que é núcleo. **Bloqueia,
sim, duas afirmações menores:** que o contrato de offline está completo para cliente com módulo ligado,
e a entrega de `MSA` ao primeiro cliente. Decidir as células de módulo **antes** de implementá-las é o
caminho; descobrir no balcão é o que este achado evita.
**CORREÇÃO SUGERIDA:** o humano decide, módulo por módulo, quais operações são ato ordinário, e a célula
recebe `terminal+ident` — dono: humano, com `produto`; candidato número um da próxima auditoria.

## Notas da rodada 3 — sem cenário de dano

**`queue_owner` virou discriminador de minimização, e isso tensiona `RN-NUC-020`.** `RN-OFF-012` (2)
usa a **atribuição** `queue_owner` como portão para o **conteúdo** literal, enquanto `RN-NUC-020` diz
que as duas atribuições nomeadas "**não concedem autorização**". Não é contradição — estreitar
informação dentro de operação autorizada é piso de minimização, e `RN-NUC-035` já declara que ele pode
ser mais estreito que a célula, nunca mais largo. Consequência a registrar, não a corrigir: o gate de
habilitação de `RN-NUC-020` ("sem `queue_owner` a habilitação não conclui") passa a proteger também a
**resolubilidade** do item de fila, o que reforça `AUT-11` em vez de enfraquecê-lo.

**O ponto 1 da consulta, respondido pelo lado que não é `AUT-15`:** `terminal+ident` **não** abre nada
para os quatro papéis de cliente. A coluna declara explicitamente que não concede a quem a célula do
papel nega, `provider_support` segue em `recusa` em toda linha, e o alcance do quarto valor é o conjunto
fechado de nove. O `owner`-only passar a vender sem contato é ganho de `PN-01` sem ganho de autoridade:
as nove linhas são todas ou `P` ou `R`, nenhuma é `A:` nem move dinheiro fora de venda.

# Dois varejos vizinhos como corpo de prova — catálogo, variação e "especificação de produto"

> **O que é.** Insumo trazido pelo humano em 2026-09-11: duas lojas reais e vizinhas — uma de roupa e
> acessórios, uma de polpa de fruta. Até aqui a única vertical nomeada era restaurante, e o material
> de fronteira era hipótese. Este arquivo testa a hipótese dele ("é um módulo só, se o módulo puder
> criar as especificações de produto") contra o que já está aprovado.
>
> **O que ele não faz.** Não fecha `G-03`, `G-04` nem `G-05` — as três são do humano
> (`memory/plataforma/state-pendencias-abertas-2026-08-23.md` §0, itens 3, 4 e 5), e
> `fronteira-do-nucleo.md:169` proíbe fechar fronteira por eliminação. Entrega o que faz a resposta
> caber em duas linhas, com o que se perde em cada saída.
>
> **Fato que ninguém confirmou vai marcado `[a confirmar]`** e está recolhido na §11. Nada neste
> arquivo depende de um `[a confirmar]` para valer; onde dependeria, a conclusão está partida em dois
> ramos.

## 1. A resposta, em quatro linhas

- **É um módulo só, e ele já existe:** `GRD` — Grade de variantes (`catalogo-de-modulos.md:253`), que
  nomeia literalmente "cor, tamanho, **sabor**", e `catalogo-de-capacidades.md:247` repete os três. A
  polpa não pede nada que o `GRD` escrito não cubra.
- **"Especificação de produto" não é uma coisa: são três, com três donos.** O que multiplica a unidade
  vendável é `GRD`; o que só descreve é `PUB`; o que se mede no ato é unidade e quantidade do núcleo.
  §3 e §4.
- **O que os dois casos derrubam não é a fronteira de `GRD` — é o carimbo de ramo nele.** "Ligado por
  vertical (varejo de moda)" e a linha `Grade | variant_matrix | moda` do glossário não sobrevivem a
  uma loja de polpa. **Os dois foram corrigidos em 2026-09-11** — §10.
- **Recomendação em `G-04`:** eixo único é o degrau de baixo de `GRD`, não do núcleo. O motivo que ainda
  não estava escrito está na §5, e ele é sobre **quem** cruza a fronteira.

## 2. Onde os dois fluxos são de fato o mesmo

"O fluxo é basicamente o mesmo" é a frase do humano, e ela se sustenta — mas não pela razão óbvia.

| Etapa | Loja de roupa | Loja de polpa | Mesmo? |
|---|---|---|---|
| Localizar o item | por código na etiqueta, ou pela lista `[a confirmar]` | pela lista, ou por código `[a confirmar]` | sim — e é onde `G-08` mora |
| Escolher **qual unidade física** sai | tamanho e cor, de lista fechada | sabor, e peso de embalagem quando há mais de um | sim — é o mesmo gesto |
| Quantidade | 2 peças | 3 potes · **ou** 0,750 kg na balança | **não** — ver §3 |
| Preço | do item, ou da combinação | do item, ou da combinação, ou por unidade de medida | sim, `price` + `price_list` |
| Concluir, pagar, emitir, conferir caixa | idêntico | idêntico | sim |

A diferença entre as duas lojas está **inteiramente antes da venda**, no cadastro. Do lançamento em
diante os dois negócios exercem o mesmo núcleo, linha por linha — e é isso, não a semelhança de
aparência, que sustenta a hipótese do humano.

E é também o que recusa um "módulo de venda de roupa". A necessidade que ele atende é legítima: um
mesmo código de venda servir dois negócios cujo produto se descreve diferente, sem reescrever o
fluxo. O mecanismo é que é ruim — venda é núcleo e já serve os dois sem alteração (linha 5 da tabela),
então um módulo por ramo duplicaria o caminho de venda uma vez por ramo; e nome de ramo em módulo é
proibido por `glossario.md:273` e pelo invariante 3. No lugar dele: núcleo de venda, mais `GRD` para o
que multiplica unidade vendável, mais `PUB` para o que só descreve, mais unidade e quantidade do
núcleo para o que se mede. **A prova de que o arranjo novo é melhor é verificável e está na §4:**
nenhuma linha de "Expõe" e "Exige" de `GRD` muda entre as duas lojas, e o comportamento desligado é o
mesmo nas duas. Se a construção fosse de ramo, essas listas divergiriam.

## 3. A linha que separa variação de quantidade

Esta é a distinção que o caso da polpa traz e que o caso da roupa sozinho nunca traria, porque roupa
não se pesa.

```
valor que descreve a unidade vendida
→ ele vem de uma lista fechada, definida no cadastro?        → VARIAÇÃO   (GRD)
→ ele é medido no instante da venda, por balança ou bomba?   → QUANTIDADE (núcleo)
→ ele só descreve o que já está definido, sem mudar
  qual unidade sai da prateleira?                            → DESCRIÇÃO  (PUB)
```

**"1 kg" é as três coisas, conforme a loja.** Pote fechado de 1 kg na prateleira: valor de eixo, uma
combinação vendável com código próprio. Polpa pesada no balcão: `quantity = 1,000` sobre um item com
unidade de medida em kg, que é núcleo desde `fronteira-do-nucleo.md:69` e tem escala declarada por
`.claude/rules/dados.md` §3. "Rendimento de 10 copos" impresso no rótulo: descrição, `PUB`.

O critério formal, e ele é o que torna o teste auditável: **variação exige conjunto de valores
fechado; quantidade medida não tem conjunto fechado.** Uma balança produz qualquer valor dentro da
resolução dela. Tentar exprimir isso como eixo produz cadastro sem fim — uma linha por peso possível
—, e o sintoma aparece no cadastro, não na venda, que é onde ninguém está olhando.

A pergunta do brief ("`dados.md` §3 resolve o caso da polpa?") tem resposta partida: resolve inteiro
o caminho da balança, e **não toca** o caso da embalagem fechada, que é variação e cai em `G-04`.

## 4. Roupa e polpa são a mesma construção, com uma ressalva nomeada

São. A construção é: um item, mais N eixos de valores fechados, produzindo um conjunto de combinações
vendáveis, cada uma com código próprio, contagem própria e preço próprio ou herdado do item.

- Roupa: tamanho × cor. **Gênero não é eixo** — §6.
- Polpa: sabor × peso de embalagem, quando há mais de um peso `[a confirmar]`.

Onde elas diferem, e nenhuma das diferenças é estrutural:

| | Roupa | Polpa |
|---|---|---|
| Cardinalidade | multiplica: 6 tamanhos × 8 cores = 48 combinações por modelo (exemplo aritmético, não medição) | achatada: sabores × 1 ou 2 pesos |
| Preço por combinação | tipicamente um preço por modelo `[a confirmar]` | quase certamente um preço por peso `[a confirmar]` — é exatamente o caso de `G-04` |
| Perecibilidade | não | lote e validade — **e isso não é eixo**, é movimento de `EST`; ver §12 |

O que prova que é uma construção só, e não duas parecidas: as listas **Expõe** e **Exige** da entrada
de `GRD` (`catalogo-de-modulos.md:256-259`) não mudam uma palavra ao trocar roupa por polpa, e o
comportamento **Desligado** é o mesmo para as duas. Construção diferente teria contrato diferente.

## 5. Recomendação — `G-04`: eixo único é o degrau de baixo de `GRD`

O argumento que decide não é o custo de cadastro, que já está nas três saídas do dossiê. É **quem
dispara a mudança de escopo**.

Se eixo único for núcleo e eixo múltiplo for módulo, a fronteira passa a ser cruzada pelo comerciante
digitando um valor. Concretamente: a loja de polpa vende só potes de 1 kg, logo sabor é eixo único,
logo o item é estrutura de núcleo. No verão ela lança o pote de 500 g — dois eixos, estrutura de
módulo. O mesmo item de catálogo teria de migrar de uma estrutura para a outra, em produção, em N
schemas, por causa de um cadastro. Travessia de fronteira disparada por digitação não tem gatilho de
código, não passa por revisão e não aciona gate nenhum: ela só aparece quando quebra.

Isso também dissolve a "fronteira difusa entre um eixo e dois eixos" que o dossiê registra em
`backlog-lacunas-g01-g09.md:134`. Não é difusa por falta de critério; é difusa porque **não existe
diferença de construção entre N=1 e N=2** — a §4 mostra as duas lojas usando o mesmo contrato.

**O que se perde escolhendo assim, e é real:** `GRD` está fora do MVP 1
(`roadmap-de-modulos.md:185`) e a receita `RES` não o liga (`receitas-por-vertical.md:46`). Então o
restaurante do MVP 1 cadastra "Suco 300 ml" e "Suco 500 ml" como dois itens — que é o comportamento
**Desligado** de `GRD`, já escrito, não uma degradação nova. Antecipar `GRD` para o MVP 1, ou aceitar
esse cadastro dobrado, é decisão de prioridade e é do humano.

**O que se perde escolhendo núcleo:** mexer no núcleo com todos os clientes em produção
(`fronteira-do-nucleo.md:203`, o pior dos três erros da tabela), padaria e posto ganhando uma
estrutura de eixo que nunca preenchem, mais a travessia por digitação acima.

## 6. Gênero não é eixo, é agrupamento — e essa distinção alimenta `G-03`

"Masculino, feminino e etcétera" são palavras do humano sobre o catálogo da loja de roupa. Pelo teste
da §3, gênero não passa: não existe um cadastro único de camiseta em que o operador escolhe masculino
ou feminino no ato da venda — são modelagens diferentes, cadastradas separadamente. Gênero **classifica
itens**; tamanho e cor **variam um item**.

Em uma linha: **o eixo escolhe qual unidade sai da prateleira; o agrupamento escolhe qual item o
operador está procurando.**

O que isso dá para `G-03`, e é evidência, não opinião: **as duas lojas discordam sobre quanto
agrupamento precisam, e nenhuma das duas quebra sem ele.** A loja de roupa tem catálogo largo e
navega; a de polpa tem catálogo estreito e acha tudo numa lista plana `[a confirmar]`. Pelo teste dos
três negócios, agrupamento **não é do núcleo** — e o argumento a favor do núcleo registrado no dossiê
("sem agrupamento o operador de padaria só acha item por código",
`backlog-lacunas-g01-g09.md:89`) fica mais fraco com estes dois casos na mão, porque na loja de roupa
achar por código é justamente o caminho normal, com etiqueta e leitor.

Entre as outras duas saídas do dossiê — `PUB`, que já nomeia "agrupamento"
(`catalogo-de-modulos.md:99`), e "os dois, com nomes distintos" — **os dois varejos não decidem**, e
eu não vou escolher por eliminação. O que decide é a pergunta 3 da §11, e ela custa uma frase.

## 7. Acessório não é adicional, e a loja de roupa é evidência em `G-05`

Teste: a coisa se vende sozinha, com código e preço próprios? Cinto, bolsa e bijuteria: sim. "Bacon
duplo": não, ele não existe sem uma linha de pedido embaixo.

Então **acessório é item de catálogo comum**, no máximo em outro agrupamento — não tem relação com
`G-05`. Tratá-lo como adicional porque as duas palavras são parecidas é exatamente
`memory/plataforma/gotcha-capacidade-sem-dono-entra-pelo-titulo-do-card.md`: termo fora do glossário
que entra pela vizinhança do nome.

E isso **acrescenta evidência a `G-05`**: uma loja de roupa real, com acessórios, continua sem precisar
de adicional. A saída "núcleo" de `G-05` seguia reprovada no teste dos três negócios por hipótese
(`backlog-lacunas-g01-g09.md:109`); agora reprova por caso.

**A exceção que pode mover `G-05`, e é a pergunta 4 da §11:** ajustar a barra, bordar o nome, embalar
para presente com custo. `fronteira-do-nucleo.md:87` usa "ajustar a barra" como exemplo de
**observação do item de pedido**, que é núcleo (`RN-NUC-016`) — e observação **não muda valor**. Se a
loja cobra pelo ajuste, aquilo deixa de ser observação e passa a ter a forma exata do adicional: algo
que se pendura numa linha, não se vende sozinho, e compõe valor. Uma loja de roupa cobrando ajuste
seria o primeiro caso de adicional fora da alimentação, e mudaria o desenho de `G-05`.

## 8. Com o módulo desligado, nenhuma das duas quebra

`produto.md` exige a resposta, e "quebra" reprovaria a spec. Com `GRD` desligado, cada combinação é um
item de catálogo próprio, cadastrado individualmente — comportamento já escrito em
`catalogo-de-modulos.md:259`. As duas lojas continuam vendendo, emitindo documento, conferindo caixa e
contando estoque.

Um ponto que costuma ser dito errado: **`GRD` desligado não perde granularidade de estoque.** Se cada
combinação é um item, `EST` conta por item, que é a mesma granularidade. O que se perde é economia de
cadastro e a pergunta "qual combinação está faltando" (`CAP-GRD-001`), que depende de contagem por
combinação e traz custo próprio declarado em `catalogo-de-capacidades.md:250`. Usar estoque como
argumento a favor de `GRD` é usar o argumento errado.

## 9. O que cada loja perde com a construção da outra

- **Polpa com a construção de roupa** — forçar peso aferido a virar eixo. Perde o caminho da balança,
  que é núcleo e sai de graça, e ganha um cadastro sem fim, porque o conjunto de valores não é fechado
  (§3). É o pior dos dois erros, e é silencioso: aparece no cadastro, não na venda.
- **Roupa com a construção de polpa** — tratar tamanho e cor como quantidade sobre um item. Não se
  exprime: "tamanho M" não é um número. A loja cai no comportamento desligado de `GRD` — um item por
  combinação — e perde economia de cadastro e a resposta de `CAP-GRD-001`. Não perde nada no caminho da
  venda.

A assimetria é o que orienta a decisão: uma das trocas **degrada de forma declarada e reversível**, a
outra produz um cadastro que não fecha.

## 10. Defeitos de vocabulário que os dois casos expõem

Os três têm prova em `path:linha`. **Reavaliados em 2026-09-11, depois de escritos: dois não dependem
de `G-04` e foram aplicados; o terceiro depende e ficou.** A leitura que separa os dois grupos: "grade"
significa **combinação** de eixos, e combinação é `GRD` em qualquer das três saídas de `G-04` — inclusive
na saída "núcleo", onde o que subiria é **eixo único**, não a combinação. Já o termo **eixo** sozinho é
exatamente o objeto em disputa, então escrevê-lo no glossário escolheria a seção (§1 núcleo × §6 módulo)
e com ela a resposta.

1 e 2 **aplicados** em 2026-09-11 · 3 **não aplicado**, e o motivo está nele.

1. **`glossario.md:242`** classifica `Grade | variant_matrix` como léxico de **ramo: moda**. A loja de
   polpa não é moda e precisa de grade. É o mesmo defeito que o próprio arquivo já corrigiu uma vez, e
   pela mesma razão — os termos de produção saíram de §3 para §6 porque `COZ` é cross-vertical
   (`glossario.md:221`). Correção proposta: mover a linha para §6 (léxico de módulo), módulo dono
   `GRD`. O identificador `variant_matrix` **não** muda. — **APLICADO em 2026-09-11:** a linha saiu de
   §3.3 e está em §6 com módulo dono `GRD`, mais o critério do conjunto fechado, que é o que separa
   variação de quantidade medida.
2. **`catalogo-de-modulos.md:253`** carimba `GRD` como "módulo, ligado por vertical (varejo de moda)",
   e o corpo da mesma entrada diz "cor, tamanho, **sabor**". `receitas-por-vertical.md:69` já o lista em
   `VAR`, "conforme o segmento", não em moda. A contradição é interna à entrada. Correção proposta:
   `### GRD — Grade de variantes · módulo`, sem carimbo de vertical, com a reclassificação registrada
   como manda `fronteira-do-nucleo.md:283`. — **APLICADO em 2026-09-11:** a entrada virou `módulo
   cross-vertical`, com o caso da polpa no **Escopo**, a reclassificação citando
   `[[decision-grd-e-cross-vertical-nao-e-de-moda]]`, e uma linha dizendo que `G-04` continua aberta.
3. **"combinação vendável" não existe no glossário** e é usada em `catalogo-de-modulos.md:257` e em
   `catalogo-de-capacidades.md:238`, `:248` e `:254`. É o que o operador vende, o que `EST` conta e o
   que `ETQ` imprime. Pelo gancho de
   `memory/plataforma/gotcha-capacidade-sem-dono-entra-pelo-titulo-do-card.md`, termo sem entrada é
   lido como núcleo por omissão — que é a deriva de `G-04` acontecendo pela porta do vocabulário. Mesma
   observação para **eixo**, que só existe hoje dentro da definição de Grade. — **NÃO APLICADO, e é o
   que depende de `G-04`:** a entrada de **eixo** tem de escolher entre §1 (núcleo) e §6 (módulo), e
   essa escolha **é** a resposta de `G-04`; escrevê-la antes fecharia a lacuna pela porta do
   vocabulário, que é justamente o defeito que o item denuncia. **Combinação vendável** entra na mesma
   passada, porque a definição dela cita eixo. Segundo motivo, independente: `glossario.md` está a
   poucas linhas do teto de 400 (`00-nucleo.md` §8), e duas entradas novas exigem decidir o que sai.

## 11. Perguntas ao humano — as cinco que fecham o resto

Cada uma responde em duas linhas, e cada uma diz o que decide.

1. **A loja de polpa vende por peso aferido na balança, por embalagem fechada, ou os dois?** Decide se
   o caso dela toca `G-04` (embalagem) ou só o núcleo de quantidade (balança) — e decide se `PER` com
   balança entra na conta.
2. **Ela tem mais de um peso de embalagem por sabor?** Se sim, é o caso de eixo com preço próprio de
   `G-04`, com loja real atrás; se não, `G-04` continua apoiado só no exemplo de bebida do
   restaurante.
3. **Na loja de roupa, o operador lança a peça lendo etiqueta, ou procurando numa lista na tela?**
   Decide `G-03` quase sozinha: se ele lê etiqueta, agrupamento não está no caminho crítico da venda e
   é capacidade de retaguarda e de canal; se ele procura na tela, agrupamento é caminho de venda e o
   argumento a favor do núcleo volta a ficar de pé.
4. **A loja de roupa cobra por ajuste, barra, bordado ou embalagem para presente?** Decide se existe
   adicional fora da alimentação — o que muda o desenho de `G-05` e a fronteira dele (§7).
5. **As duas lojas são clientes-alvo ou corpo de prova?** Elas são `VAR`, cuja receita base é
   `PER, FIS, EMI, EST` (`receitas-por-vertical.md:68`), e `EST` está fora do MVP 1
   (`roadmap-de-modulos.md:185`). Atendê-las de verdade abre a segunda vertical; usá-las como corpo de
   prova não custa nada. Prioridade é sua.

## 12. Fora de escopo

- **`G-03`, `G-04` e `G-05` não são fechadas aqui.** A recomendação da §5 é recomendação.
- **Nada de modelo.** Tabela, coluna, chave e forma da combinação vendável são de `arquiteto-dados`;
  este arquivo só diz de quem é o conceito.
- **Lote e validade da polpa não têm dono declarado hoje.** `ETQ` imprime validade
  (`catalogo-de-modulos.md:262`) e nenhuma entrada diz quem é o dono do dado. Não é eixo — o lote não
  escolhe o que sai da prateleira, ele rastreia o que já saiu — e o candidato natural é `EST`, mas isso
  não está escrito em lugar nenhum. Fica como achado, não como decisão.
- **Das três correções de vocabulário da §10, duas foram aplicadas em 2026-09-11 e a terceira não** —
  qual e por quê está em cada item, e o critério de separação está no cabeçalho da §10.
- **Prioridade, prazo e escopo comercial** são do humano.

## Referências

`docs/produto/fronteira-do-nucleo.md:69` · `:71` · `:87` · `:169` · `:203` · `:283` ·
`docs/produto/catalogo-de-modulos.md:99` · `:253` · `:256-259` · `:262` ·
`docs/produto/glossario.md:221` · `:242` · `:273` · `docs/produto/receitas-por-vertical.md:46` · `:68` ·
`:69` · `docs/produto/roadmap-de-modulos.md:185` · `docs/produto/catalogo-de-capacidades.md:238` ·
`:247` · `:250` · `docs/produto/backlog-lacunas-g01-g09.md:89` · `:109` · `:134` ·
`memory/plataforma/state-pendencias-abertas-2026-08-23.md` §0 itens 3, 4 e 5 ·
`memory/plataforma/gotcha-capacidade-sem-dono-entra-pelo-titulo-do-card.md` · `.claude/rules/dados.md` §3

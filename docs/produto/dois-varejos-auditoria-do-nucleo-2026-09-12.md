# Auditoria do núcleo contra as duas lojas reais — o que está classificado como núcleo e o corpus não sustenta

> **O que é.** A segunda passada sobre o corpus de duas lojas vizinhas reais (roupa e acessórios ·
> polpa de fruta) trazido pelo humano em 2026-09-11. A primeira passada testou a hipótese dele sobre
> especificação de produto e está em `dois-varejos-corpo-de-prova-2026-09-11.md`. Esta passada vira a
> lente para o outro lado: **as 28 linhas que `fronteira-do-nucleo.md` §2 classifica como núcleo**,
> uma a uma, contra as duas lojas.
>
> **Por que agora.** `fronteira-do-nucleo.md` foi escrito quando restaurante era a única vertical
> nomeada. Nenhuma destas duas lojas é restaurante, e a Fase 1 vai modelar exatamente essas linhas.
>
> **O que ele não faz.** Não fecha `G-03`, `G-04` nem `G-05`. Não aplica nenhuma correção — o
> inventário é o entregável, a correção é item separado. Não refaz a primeira passada: §1 diz onde
> cada parte dela já está respondida.
>
> **Item:** `F-014`. **Não depende de `LACUNA-NUC-041`** (moeda do cliente ou do estabelecimento):
> nenhum dos seis achados muda com qualquer das duas respostas, e a única linha que toca moeda
> (`:57`) é confirmada pelo fuso, não pela moeda.

## 1. O que esta passada não refaz

| Pergunta do corpus | Onde já está respondida |
|---|---|
| O que as duas lojas têm de fato em comum | `dois-varejos-corpo-de-prova-2026-09-11.md` §2 |
| Onde o produto difere, e de que espécie é a diferença | idem §3 e §4 |
| Variação e quantidade são a mesma coisa? | idem §3 · registro `business-rule-variacao-exige-conjunto-fechado-quantidade-nao` |
| A resposta à hipótese do humano, com as quatro partes | idem §1, §2 (parágrafo final) e §5 |
| Gênero é eixo? Acessório é adicional? | idem §6 e §7 |
| O que cada loja perde com a construção da outra | idem §9 |
| Defeitos de vocabulário de `GRD` | idem §10 (dois aplicados, um pendente de `G-04`) |
| As cinco perguntas ao humano | `memory/plataforma/state-pendencias-abertas-2026-08-23.md` §0.3 |

**Conferido, não refeito:** o teste que separa variação de quantidade continua valendo contra os dois
casos. Roupa produz `tamanho × cor`, conjunto fechado no cadastro; polpa pesada no balcão produz um
número que a balança escolhe no ato. Nada nas duas lojas contradiz o registro, e ele não precisa de
emenda.

**Esta passada não propõe nenhuma linha nova de núcleo.** O teste dos três negócios está aplicado,
item a item, às 28 linhas que já estão lá — §3.

## 2. O que o corpus alcança, e o que ele não alcança

O depoimento do humano descreve **o que as lojas vendem**, não como elas operam. Disso vem um limite
que muda a leitura da tabela: para boa parte das linhas de núcleo, o corpus **não diz nada** — e
ausência de depoimento não é evidência contra. Então o veredicto tem quatro valores, e o terceiro é o
mais comum:

- **confirmada** — as duas exigem, e o caso é nomeável.
- **neutra** — uma exige, a outra não contradiz.
- **fora do alcance** — o corpus não alcança. Não reprova nada.
- **nenhuma das duas exige** — achado.

Onde a tabela se apoia em "concluir, pagar, emitir e conferir caixa são idênticos nas duas", a fonte é
`dois-varejos-corpo-de-prova-2026-09-11.md:41`, já aprovada, não uma inferência nova.

Dois achados desta passada **não vêm do corpus**: vêm da cláusula de motivo da própria linha, que
sustenta a classificação com um argumento mais fraco do que o teste de `fronteira-do-nucleo.md:9`
exige. Eles estão marcados como **achado de motivo**, e a distinção importa: um diz que a linha está
no lugar errado, o outro diz que ela pode estar no lugar certo pelo argumento errado.

## 3. As 28 linhas, uma a uma

| Linha | Item | Veredicto | O que o corpus diz |
|---|---|---|---|
| `:55` | Vários estabelecimentos por cliente | fora do alcance | Não se sabe se alguma das duas tem segunda unidade. Degenera em N=1 sem custo. |
| `:56` | Terminal vinculado a estabelecimento | confirmada | As duas vendem em ponto físico e conferem dinheiro ali. |
| `:57` | Fuso e moeda do cliente | confirmada | As duas fecham o dia; "vendas de hoje" existe nas duas. |
| `:60` | Operar com rede instável sem perder venda | fora do alcance | Nenhuma das duas foi observada sem rede. |
| `:61` | Idempotência de operação que move dinheiro | fora do alcance | Reenvio não observado. |
| `:68` | Item vendável com código e preço | confirmada | Sem isto nenhuma das duas vende. |
| `:69` | Unidade de medida com casas declaradas | **confirmada, e reforçada** | É a linha que o corpus mais sustenta: roupa em unidade (escala 0), polpa em kg na balança (escala fracionária). |
| `:70` | Lista de preço por contexto e vigência | **achado A-01** | A vigência as duas exigem. A dimensão **canal**, nenhuma das duas usa. |
| `:81` | Pedido em construção | confirmada | É o ato de vender nas duas. |
| `:82` | Venda concluída imutável | confirmada | Prestação de contas nas duas. |
| `:83` | Correção por fato novo | neutra | Troca de peça é rotina na roupa; na polpa o corpus não diz. |
| `:84` | Desconto e acréscimo com limite por papel | fora do alcance | Não se sabe se dão desconto nem quem autoriza. |
| `:85` | Identificação opcional do cliente-final | fora do alcance | Não se sabe se pedem documento do comprador. |
| `:86` | Modo de atendimento no pedido | **achado A-03** (de motivo) | O corpus não alcança; o motivo da linha é que não se sustenta. |
| `:87` | Observação livre no item de pedido | **neutra — achado A-05** | Sustentada por um caso só entre as duas, e esse caso pode migrar para `G-05`. |
| `:99` | Vários pagamentos para uma venda, com troco | neutra | Troco em espécie, as duas. Pagamento dividido, fora do alcance. |
| `:100` | Meio de pagamento como domínio fechado | confirmada | As duas separam espécie de cartão para conferir caixa. |
| `:101` | Estorno de pagamento como fato novo | neutra | Decorre de `:82`, que é confirmada; não observado nas duas. |
| `:111` | Sessão de caixa | confirmada | As duas recebem espécie e fecham o dia. |
| `:112` | Sangria e suprimento | fora do alcance | Não observado. Loja pequena pode não sangrar. |
| `:113` | Abrir gaveta como operação autorizada e registrada | fora do alcance — **alimenta A-04** | "Autorizada por quem", numa loja operada pelo dono, é pergunta aberta. |
| `:115` | Turno operacional do estabelecimento | **achado A-02** | Nenhuma das duas exige turno separado da sessão de caixa, e a definição está em lacuna. |
| `:116` | Fechamento do dia por estabelecimento | confirmada | As duas contam o que entrou. |
| `:123` | Operador autenticado em cada ação | fora do alcance — **alimenta A-04** | Não se sabe quantas pessoas operam. |
| `:124` | Papel com permissão verificada no backend | **achado A-04** (de motivo) | A classificação se sustenta; a cláusula de motivo não. |
| `:125` | Trilha de auditoria de operação sensível | confirmada | As duas guardam dinheiro em gaveta. |
| `:132` | A venda guarda referência e estado do documento | confirmada | Emitir é idêntico nas duas (`corpo-de-prova:41`). |
| `:133` | Estabelecimento com identidade jurídica própria | confirmada | O documento sai em nome de alguém nas duas. |

**Contagem, e ela fecha em 28:** 12 confirmadas · 4 neutras · 8 fora do alcance · 4 com achado. Das
quatro, duas são **achado de linha** (`:70`, `:115` — a classificação se apoia em algo que as duas
lojas não exercem) e duas são **achado de motivo** (`:86`, `:124` — a classificação pode estar certa, o
argumento que a sustenta não está). Fora da tabela ficam A-05, que é fraco e mora numa linha neutra
(`:87`), e A-06, que é de vocabulário numa linha de **módulo** (`:71`, §4.6).

Nenhuma linha foi reprovada pelo corpus, e o número que mais diz alguma coisa é o **8**: para quase um
terço do núcleo, duas lojas reais não têm o que dizer. O depoimento cobre o que elas vendem, não como
elas operam — e é isso que as quatro perguntas da §5 tentam comprar barato.

## 4. Os achados

### A-01 — `fronteira-do-nucleo.md:70` põe uma dimensão de módulo dentro de uma entidade de núcleo

A linha classifica "lista de preço por **contexto** e vigência" como núcleo, e o motivo dela justifica
só a vigência: "os três mudam preço e precisam saber qual valia no dia da venda passada". Sobre
contexto, o motivo é silencioso.

`glossario.md:60` — autoridade única de vocabulário — define contexto como **"estabelecimento, canal,
período"**. Estabelecimento é núcleo (`:55`) e período é a vigência. Sobra **canal**, e canal só existe
onde um módulo o cria: o ciclo de cumprimento é módulo (`:89`) e o pedido pelo cliente-final é módulo
(`modulos/pedido-cliente-final.md`). Uma entidade do núcleo carrega, como dimensão, algo cujo produtor
está classificado como módulo na mesma tabela.

O corpus confirma pelo lado de fora: **nenhuma das duas lojas tem um segundo canal**. A loja de roupa
vende no balcão, a de polpa vende no balcão, e as duas preenchem a dimensão com um valor constante
para sempre.

As quatro partes, porque isto recusa um mecanismo:

1. **Necessidade preservada** — o mesmo item custar diferente conforme por onde a venda entrou (o
   canal carrega custo próprio: comissão de aplicativo, embalagem, entrega). É legítima e não se
   recusa.
2. **Mecanismo recusado** — canal como dimensão obrigatória de toda resolução de preço do núcleo. Ele
   é ruim porque faz o cliente que nunca terá um segundo canal pagar a dimensão em toda consulta de
   preço, e porque planta no núcleo a forma de um ramo (o que vende pelo balcão **e** por entrega),
   que é o pior dos três erros da tabela de `fronteira-do-nucleo.md:203`.
3. **Mecanismo novo** — o núcleo tem lista de preço por **estabelecimento e vigência**. Preço por
   canal é capacidade do módulo que cria o canal, e ele compõe sobre a lista do núcleo.
4. **Por que é melhor, e como se prova** — prova-se pelo comportamento desligado: com os módulos de
   canal desligados, as duas lojas continuam com preço correto e vigência correta, e nada na operação
   delas some. Com a dimensão no núcleo, o teste de `:9` não passa — nenhum dos três negócios **quebra**
   sem preço por canal.

**Não fecho isto.** É fronteira, e fronteira é do humano. O que a linha precisa, no mínimo, é
**nomear as dimensões** em vez de dizer "contexto": hoje ela e o glossário discordam em silêncio, e a
leitura larga é a que vence porque é a do glossário.

### A-02 — `fronteira-do-nucleo.md:115` classifica turno como núcleo antes de alguém saber o que turno é

A linha diz "turno operacional do estabelecimento | núcleo | existe nos três e é o eixo de conferência
de responsabilidade". Três coisas do próprio repositório trabalham contra ela:

- **A definição está aberta.** `LACUNA-NUC-007` segue com a metade do turno em aberto, e turno **não
  tem nenhuma `RN` numerada** — logo continua recusado pelo default de `RN-OFF-008`. `nucleo-venda.md:383`
  chama isso de "a última contradição com `PN-01` no núcleo".
- **A resposta registrada do humano é a assinatura de outro escopo.** Ele respondeu "não sei ainda /
  depende do cliente" sobre turno ser ou não a sessão de caixa (`nucleo-venda.md:380`). E
  `fronteira-do-nucleo.md:188` define exatamente essa frase — dois clientes do mesmo ramo podem
  discordar e os dois estarem certos — como o que caracteriza escopo de **cliente**.
- **O corpus não exerce a linha.** Nas duas lojas, o eixo de conferência de responsabilidade
  disponível é a sessão de caixa. Turno como coisa separada precisaria de troca de responsável dentro
  do mesmo dia, e o corpus não diz que isso acontece em nenhuma das duas.

**Não recuso a capacidade turno** — quem tem dois responsáveis no mesmo dia precisa separar de quem é
cada real na gaveta, e a sessão de caixa sozinha não responde isso quando duas sessões pertencem à
mesma pessoa. O que recuso é **afirmar o escopo antes da definição**, porque a Fase 1 vai modelar essa
linha e classificação errada aqui sai por migration em N schemas.

Desfecho proposto, e ele custa uma linha: a célula vira `núcleo — provisório, pendente de
LACUNA-NUC-007`. O próprio arquivo autoriza isso em `:172` — erro de classificação assumido
explicitamente é aceitável, classificação silenciosa não —, e hoje esta é silenciosa.

### A-03 — `fronteira-do-nucleo.md:86` sustenta núcleo em "podem", e a outra metade é afirmação fiscal sem fonte

Achado de motivo. A linha põe o modo de atendimento (presencial × entrega em endereço) no núcleo com
esta justificativa: *"O documento fiscal exige saber qual dos dois é, e os três **podem** entregar"*.

O teste declarado pelo próprio arquivo, em `:9`, é se a operação dos três **quebra** sem aquilo, e diz
explicitamente que "seria bom para todos" não vale. "Podem entregar" é a forma fraca que `:9` recusa —
é a única linha das 28 que se sustenta assim.

A outra metade é uma afirmação sobre exigência de documento fiscal, e ela não cita fonte. O mesmo
arquivo, em `:272`, diz que spec fiscal sem o humano ou o contador atrás é alucinação, não trabalho
adiantado. Então esta metade **não vira achado fechado**: vira pergunta (Q-D, §5).

O corpus não decide: nenhuma das duas lojas foi descrita entregando, e ausência de menção não é
evidência. O que o corpus faz é tirar o apoio implícito — as duas primeiras lojas reais do projeto não
exercem a distinção.

Dois desfechos, os dois limpos: ou o contador confirma a exigência e a linha passa a citar a fonte, ou
`service_mode` desce para o módulo que cria a entrega. **Decidir agora vale mais que depois**, porque
`service_mode` já é vocabulário de núcleo com regra própria (`nucleo-venda.md:28`) e a Fase 1 o modela.

### A-04 — `fronteira-do-nucleo.md:124` pressupõe três papéis que nenhuma das duas lojas foi descrita tendo

Achado de motivo, e o mais barato de corrigir. A linha está certa: papel com permissão verificada no
backend é núcleo, e continua sendo com **um** papel só. O motivo é que afirma demais — "os três têm
dono, gerente e caixa com poderes diferentes".

Loja de bairro operada pelo dono, com uma pessoa no balcão, é o caso comum do corpus, e nela não
existem três poderes distintos. Duas linhas vizinhas herdam o problema: `:113` (abrir gaveta como
operação **autorizada**) e `:123` (operador autenticado em **cada** ação) descrevem uma operação com
separação de funções que talvez não exista em nenhuma das duas.

Isto não move fronteira. Move a pergunta Q-A (§5), e ela decide algo prático: se o produto exige mais
de um papel para operar, ele exige da loja de polpa uma cerimônia que a loja de polpa não tem.

### A-05 — `fronteira-do-nucleo.md:87` se apoia, entre as duas lojas, em um caso só — e esse caso pode mudar de dono

A observação livre no item de pedido está no núcleo com três exemplos: "sem cebola" (restaurante),
"ajustar a barra" (roupa), "embalar para presente". Entre as duas lojas reais, só a de roupa exerce a
linha; a de polpa não tem caso nomeado.

E o caso da roupa já está sob pergunta: `dois-varejos-corpo-de-prova-2026-09-11.md` §7 mostra que, se a
loja **cobra** pelo ajuste, aquilo deixa de ser observação (que não muda valor) e passa a ter a forma
exata do adicional, que é `G-05`. Se a resposta for "sim, cobra", a linha `:87` fica sustentada por
"sem cebola" e "embalar para presente" — um exemplo de restaurante e um que o corpus não observou.

Registro como achado fraco e **dependente de pergunta já aberta** (a quarta de §0.3). Não acrescento
pergunta nova por isto.

### A-06 — `fronteira-do-nucleo.md:71` repete, num path novo, o carimbo de moda já corrigido

A linha classifica "Item composto por eixos (cor/tamanho)" como módulo — classificação certa — com o
motivo "padaria e posto não precisam; **loja de roupa** não vive sem". O parêntese nomeia dois eixos de
moda e o motivo nomeia um ramo só.

É o mesmo defeito que `memory/modulos/grd/decision-grd-e-cross-vertical-nao-e-de-moda.md` registrou e
que foi corrigido em dois lugares em 2026-09-11 (`glossario.md` e `catalogo-de-modulos.md`). Este path
não estava na lista. Custo de deixar: quem classificar um cliente de polpa não procura `GRD`, porque a
linha diz que a coisa é de loja de roupa — e a capacidade se duplica com outro nome.

Correção barata e sem dependência de `G-04`, pelo mesmo critério que separou as três correções de
vocabulário: isto é **combinação de eixos**, que é `GRD` em qualquer saída de `G-04`. Cabe em item
próprio, e não precisa esperar resposta do humano.

## 5. Perguntas novas ao humano

Quatro, e nenhuma repete as cinco de `state-pendencias-abertas-2026-08-23.md` §0.3.

- **Q-A — quantas pessoas operam cada loja, e existe mais de um papel de fato?** Decide A-04, e decide
  se `:113` e `:123` descrevem uma operação que existe. Se a resposta for "o dono e mais ninguém", o
  produto precisa de um caminho em que autorizar e ser autorizado são a mesma pessoa **sem** que isso
  vire a porta destrancada de todo mundo.
- **Q-B — alguma das duas vende por outro canal além do balcão (aplicativo, telefone, entrega)?**
  Decide A-01 pelo lado do corpus. Se as duas são balcão puro, o preço por canal não tem nenhuma loja
  real atrás.
- **Q-C — alguma das duas troca de responsável dentro do mesmo dia, com a mesma gaveta?** Decide A-02:
  é o caso que distingue turno de sessão de caixa, e é a única forma de saber se turno existe fora do
  restaurante.
- **Q-D — para você com o contador: o documento fiscal exige distinguir venda presencial de entrega
  em endereço?** Decide A-03. Não respondo isto por analogia, e sem a resposta a linha `:86` fica com
  a classificação que tem e a justificativa pela metade.

## 6. Fora de escopo

- **`G-03`, `G-04` e `G-05` continuam abertas.** Nada aqui as fecha, e A-01 e A-02 são recomendações,
  não decisões.
- **Nenhuma correção aplicada.** Os seis achados apontam para `fronteira-do-nucleo.md`, que é território
  de `produto` — corrigir na mesma passada misturaria o inventário com a mudança, e A-01 a A-04
  dependem de resposta que ninguém deu. A-06 é a única aplicável já, e cabe em item próprio.
- **Nada de modelo.** Coluna, tabela, chave e forma da lista de preço são de `arquiteto-dados`.
- **As 8 linhas "fora do alcance" não são dívida.** São o que este corpus não enxerga. Corpus maior
  (ou a resposta de Q-A a Q-D) estreita isso; nenhuma delas vira achado por ausência.
- **Prioridade, prazo e escopo comercial** são do humano — inclusive a decisão, já registrada como
  pendente, de tratar estas duas lojas como clientes-alvo ou como corpo de prova.

## Referências

`docs/produto/fronteira-do-nucleo.md:9` · `:55` · `:70` · `:71` · `:86` · `:87` · `:89` · `:113` ·
`:115` · `:123` · `:124` · `:172` · `:188` · `:203` · `:272` ·
`docs/produto/dois-varejos-corpo-de-prova-2026-09-11.md:41` · §7 · §10 ·
`docs/produto/nucleo-venda.md:28` · `:380` · `:383` · §6 · `docs/produto/glossario.md:60` ·
`docs/produto/modulos/pedido-cliente-final.md` ·
`memory/plataforma/state-pendencias-abertas-2026-08-23.md` §0.3 ·
`memory/plataforma/business-rule-variacao-exige-conjunto-fechado-quantidade-nao.md` ·
`memory/modulos/grd/decision-grd-e-cross-vertical-nao-e-de-moda.md`

# Fatos de operação — os domínios fechados de valor que um fato carrega

> **Terceiro irmão de `fatos-de-operacao.md` e `fatos-de-operacao-provedor.md`, com o mesmo peso
> normativo.** Nasceu em 2026-08-23, no conserto do passo 4 da T-0004: o irmão principal estava em 381
> linhas, no teto de 400, e faltavam **duas** listas fechadas que só valem se nascerem com o campo.
>
> **Eixo da partição.** O primeiro eixo do conjunto é **quem pratica o fato** (operação do cliente ×
> papéis nossos). O segundo, deste arquivo, é **o fato × o domínio fechado de valor que ele carrega**:
> aqui moram o fato de recusa e as **três** listas fechadas — motivo de **recusa** (`RN-NUC-043`, cuja
> regra dona continua no irmão, §2), motivo de **cancelamento** (`RN-NUC-047`) e **modo de atendimento**
> (`RN-NUC-048`). O **quarto** irmão, da mesma data, é `fatos-de-operacao-retencao-e-descarte.md` (o fato
> depois do instante); o **quinto**, de 2026-09-11, é `fatos-de-operacao-ciclo-de-vida-do-pedido.md`.
> **As lacunas e as perguntas dos cinco moram no irmão principal** (§7).
>
> **Acrescentado em 2026-09-11:** o nono motivo de recusa (`identity_unrecognized`, §1.1) e a regra dona
> dele, `RN-NUC-056` (§1) — o desfecho "o operador não é reconhecido neste terminal" não tinha fato
> nem motivo, e é dele que sai o único número que fecha `LACUNA-OFF-016` por medida.
>
> **Acrescentado em 2026-09-23:** o décimo motivo (`item_identifier_unresolved`, §1.1) e a regra dona
> dele, `RN-NUC-063` (§1), que é o nascimento de `LACUNA-PER-6` — o identificador de item que não
> resolve no catálogo aplicado caía em `published_artifact_missing` e levava duas causas junto. Na
> mesma data a regra passou a admitir, num degrau estreito, o valor do identificador (cláusula a, e a
> exceção única em "o que a recusa nunca carrega", abaixo).
>
> **Por que estas três coisas ficam juntas, e não é arrumação.** Elas são a mesma decisão repetida: um
> campo cujo valor é de **lista fechada, com código estável**, e cuja enumeração só estreita algo se
> nascer **na mesma passada em que o campo nasce**. Enumeração aplicada depois, sobre texto livre, não
> estreita nada (`convention-campo-de-texto-livre-nao-e-campo-enumeravel`) — é irrecuperável pelo mesmo
> mecanismo que faz esta ficha existir. Errar aqui não custa migration: custa a pergunta que nunca mais
> tem resposta.
>
> **O que este arquivo não é.** Não é tabela, coluna, tipo, chave nem retenção. Não valora célula de
> autorização. **Nenhum número.** Nada foi renumerado ao ser movido para cá, e nenhum motivo da lista de
> recusa foi acrescentado, removido ou reescrito na mudança.
>
> **Formato das regras:** `Enunciado` · `Motivo` · `Aceite` · `Infeliz`.

---

## 1. O fato de recusa, e a lista fechada de motivos

Um fato — `operation_refused` — com motivo enumerado. Ator, instante e módulo dono como na §3 do irmão;
domínio de conexão presente quando ele é parte da causa. Grão candidato: **uma linha por tentativa**
(`RN-NUC-043`, infeliz). A regra dona é `RN-NUC-043`, em `fatos-de-operacao.md` §2.

### 1.1 Os motivos, e o que cada um diagnostica

| Motivo | Diagnostica | Regido por | Consome |
|---|---|---|---|
| `no_contact` | **infraestrutura**: link, LAN ou serviço externo, e o domínio diz qual | `RN-OFF-001` a `RN-OFF-005` | C · P |
| `external_authorization_denied` | **resposta negativa obtida** — adquirente negou, autorizador rejeitou ou denegou. **Não** é o mesmo que não obter resposta, e confundir os dois é o erro que faz trocar de operadora por causa de link | `RN-NUC-005`, `RN-EMI-024` | C · P |
| `authority_absent` | **configuração de papel**: célula que nega, autoridade retida vencida, concessão ausente | `RN-NUC-039`, `RN-OFF-007`, `RN-OFF-024`, `RN-NUC-024` | C · P |
| `identity_unrecognized` | **reconciliação do conjunto retido**: o terminal não reconhece a identificação apresentada. A causa candidata é a **janela de reconciliação daquele terminal**, nunca o papel da pessoa — identificar não é autorizar (`RN-OFF-033`a) | `RN-OFF-033`, `RN-NUC-056` | C · P |
| `published_artifact_missing` | **publicação**: item sem preço publicado, limite não publicado, versão de regra ausente, catálogo ausente do terminal ou sem versão que cubra o instante. Identificador que não corresponde a item nenhum **não** é este motivo | `RN-NUC-002`, `RN-NUC-013`, `RN-FIS-011` | C · P |
| `item_identifier_unresolved` | **resolução de identificador**: o identificador apresentado para lançar item não corresponde a item nenhum na versão de catálogo que o terminal aplicou. Duas causas candidatas, e o motivo **não** escolhe entre elas: o negócio não tem o item **cadastrado**, ou o **catálogo retido** naquele terminal está defasado. Quem separa é a versão aplicada contra a vigente e a idade do retido, as duas derivadas (`RN-NUC-063`, cláusula e). O valor do identificador só no degrau 2, e só no `C` (cláusula a) | `RN-NUC-063`, `RN-PER-014`, `RN-OFF-020` | C · P |
| `resource_exhausted` | **recurso escasso**: faixa esgotada, teto offline atingido, recurso local no limite | `RN-OFF-006`, `RN-OFF-014`, `RN-OFF-015` | C · P |
| `module_inactive` | **capacidade não contratada** — é o motivo que responde "o que este cliente tentou e não tinha" | `catalogo-de-modulos.md`, `RN-REL-005` | C · P |
| `business_precondition_unmet` | **precondição do negócio**: sessão de caixa fechada, pedido sem item, lista de bloqueio com item no fechamento do dia, **venda sem modo de atendimento declarado** | `RN-NUC-004`, `RN-NUC-031`, `RN-NUC-048` | C |
| `unclassified_operation` | **defeito nosso**: operação sem classificação ou sem célula, recusada pelo default | `RN-OFF-008`, `RN-NUC-039` | P |

**O canal do lado `P`, declarado em 2026-08-23 (`PRV-12`).** Esta tabela entra na lista de `RN-PRV-009`
(cláusula b), e o canal de **toda** linha dela é `RN-PRV-009`: recusa é **observação de operação**, nunca
fato de negócio do cliente. A decisão nossa que sustenta o `P` é do **fato**, não do valor — o motivo de
`RN-NUC-043` a nomeia: separar diagnóstico de **infraestrutura**, de **configuração de papel** e de
**defeito nosso**, que é o que faz "não deu" virar três correções diferentes. `operation_refused` é **um**
fato com domínio fechado; a coluna `Consome` por motivo diz apenas **em que valores** cada leitura recai.
A **forma** admissível de cada uma — retida por estabelecimento × agregada sobre clientes — é decisão de
**repouso** (`D-06`), encaminhada pelo passo 6, e não se escolhe aqui.

**A lista é fechada.** Motivo novo entra por alteração de `RN-NUC-043`, com a `RN` dona citada — nunca
como texto livre, e nunca acomodado em um motivo existente "porque é parecido". Ocorrência que não
cabe em nenhum é registrada como `unclassified_operation`, que é **trabalho visível**, não categoria
de repouso: é o mesmo mecanismo de `RN-OFF-008`, e é ele que impede a lista de virar mentira por
conveniência.

**O que a recusa nunca carrega:** o texto exibido ao operador (é mensagem de operação, e mensagem não
é campo de decisão), qualquer dado de pagamento, e qualquer texto de terceiro como campo enumerado
(`RN-OFF-027`, `RN-OFF-023`) — presença, não conteúdo. **Alterado em 2026-09-23 (T-0016, C.3), com
uma exceção só:** o identificador `gtin_global` na recusa `item_identifier_unresolved` entra como valor,
consumo só `C` (`RN-NUC-063` a). É chave de catálogo de forma fechada, conferida no terminal antes de
qualquer registro, identifica mercadoria e não decide nada. Toda outra forma dele continua fora.

### RN-NUC-056 — Identidade não reconhecida no terminal é recusa com motivo próprio; o fato nunca carrega a identificação apresentada, e a idade do conjunto retido é derivada de marco

**Enunciado** a tentativa de identificação que o conjunto retido do terminal **não reconhece**
(`RN-OFF-033`, infeliz b) é operação **recusada** e produz fato (`RN-NUC-043`), **por tentativa**, com
motivo `identity_unrecognized`, terminal, estabelecimento e instante. Três cláusulas: **(a)** o fato
**nunca** carrega o meio de identificação apresentado, nem parte dele, nem derivação dele — o conjunto
retido é confidencial em repouso e não aparece em registro de erro, cópia de apoio nem exportação de
diagnóstico (`RN-OFF-033`c), e a recusa não é exceção a isso; **(b)** a **reconciliação** do conjunto
retido é **marco próprio** (`identity_set_reconciled`), registrado no instante em que o terminal a
recebe, para que a **idade do conjunto** em cada recusa seja **derivada** (`RN-NUC-045`) em vez de
afirmada; **(c)** quando a tentativa recusada é a **própria identificação**, e não uma operação que a
pressupõe, a operação pretendida registrada é *identificar-se no terminal* — que **não** é linha de
matriz e não autoriza nada (`RN-OFF-033`a), então a recusa existe sem que nenhuma célula seja criada.
O **ator** deste fato é o terminal, e é a única linha da §1.1 em que não há operador a nomear: a
ausência de autor aqui é o conteúdo do fato, não campo faltando.

**Escopo** núcleo. Um posto, uma padaria e uma loja de roupa têm todos operador que chega ao terminal
e precisa ser reconhecido sem contato, e nos três o desfecho é o mesmo: ele não trabalha ali.

**Motivo** o desfecho já está escrito em dois lugares — `RN-OFF-033` infeliz (b) e `RN-NUC-009` infeliz
(c) — e os dois dizem que o operador "não opera naquele terminal, e isso é declarado". Declarado a
ele, na tela. Nada disso vira fato, então **quantos** operadores ficaram impedidos, **em que
terminais** e **por quanto tempo** não existe no servidor. Esse é o único número que fecha
`LACUNA-OFF-016` (frequência de reconciliação e tamanho do conjunto) **por medida**: o par *recusa ×
idade do conjunto no instante da recusa* é a série que decide, porque recusa que **cresce com a idade**
é defasagem de reconciliação, e recusa que não correlaciona com a idade é outra coisa e não se conserta
encurtando a janela. Sem a série, a lacuna fecha por escolha arbitrária e o erro só aparece como "o
caixa 3 não deixa a Fulana entrar" — caso isolado, sem nada que o sustente. E o motivo precisa ser
**próprio**: `authority_absent` diagnostica configuração de papel, e mandar consertar o papel de uma
pessoa quando a causa é a janela de um terminal é o diagnóstico apontando para o lugar errado, que é
exatamente o que a lista fechada existe para evitar. A trava é temporal, como sempre nesta ficha —
motivo enumerado depois, sobre campo que nasceu sem ele, não estreita nada.

**Aceite** com o link cortado desde antes do expediente e um operador que o conjunto retido não
reconhece, tentar abrir sessão de caixa (`RN-NUC-009`, infeliz c): a sessão **não** abre **e** existe
fato de recusa com `identity_unrecognized`, terminal e instante; a terceira tentativa da mesma pessoa
produz o **terceiro** fato (por tentativa, `RN-NUC-043`, infeliz). Ao restabelecer o contato, a leitura
responde, para aquele estabelecimento, quantas recusas por identidade houve, em que terminais e com o
conjunto de que idade — sem coleta nova. Teste negativo, conferível por busca: nenhum fato, registro de
erro ou exportação contém o meio de identificação apresentado, e nenhuma recusa por identidade é
registrada como `authority_absent`.

**Infeliz** (a) a pessoa recusada **não era** operador daquele estabelecimento → o produto não sabe, e
não finge saber: o fato registra que uma identificação não foi reconhecida, nunca **de quem** ela era
(cláusula a). Distinguir "legítimo com conjunto defasado" de "nunca foi operador" não é respondível por
este fato, e leitura que o afirmar está inventando; o que a série entrega é a correlação com a idade do
conjunto, e é ela que a decisão de `LACUNA-OFF-016` precisa. (b) o próprio fato de recusa é descartado
por aperto de recurso local → cede com os demais fatos de recusa, com descarte contado (`RN-NUC-046`), e
a lacuna **não** se fecha sobre série truncada apresentada como completa (`RN-NUC-049`c). (c) o
**mecanismo** de prova de identidade ainda não existe — eixo E2 de **D-03**, ABERTA (`LACUNA-OFF-015`).
Esta regra não o escolhe e não depende de saber qual é; ela declara o que o fato contém sob qualquer
mecanismo. Mecanismo que só torne a recusa contável **registrando a identificação apresentada** não
satisfaz a cláusula (a), e escolhê-lo é decisão do humano com o custo à vista.

### RN-NUC-063 — Identificador de item que não resolve no catálogo aplicado é recusa do lançamento com motivo próprio; sem contato, o terminal diz o que não tem, nunca que o item não existe

Nasceu em 2026-09-23 como a regra de `LACUNA-PER-6` (`modulos/perifericos.md` §4), por decisão do
humano: "A lacuna de periféricos precisa nascer, pois então que ela nasça." Nasceu `RN-NUC-057` e foi
renumerada no mesmo dia, sem citação em código, porque `057` a `062` foram tomadas em paralelo
(`nucleo-estabelecimento.md:140`). Cláusulas (a) e (f) da passada C.3, sobre a auditoria
`docs/auditorias/2026-09-23-codigo-lido-no-fato.md` §3.

**Enunciado** o identificador apresentado para lançar item — lido ou digitado, que são o mesmo caminho
(`RN-PER-015`) —, entregue completo, que **não corresponde a item nenhum** na versão de catálogo que o
terminal aplica no instante (`RN-NUC-013`), é **lançamento recusado**: a linha não nasce, o pedido em
construção fica intacto, e a recusa produz fato (`RN-NUC-043`), por tentativa, com motivo
`item_identifier_unresolved`. Seis cláusulas:

- **(a) O que o fato carrega, em dois degraus.** **Degrau 1, sempre:** operação pretendida (lançar
  item), operador, papel, terminal, estabelecimento, instante, domínio de conexão (`RN-OFF-001`), **a
  versão de catálogo contra a qual a resolução falhou**, a **origem da entrada** (leitura ou
  digitação), o **comprimento** do que foi apresentado, a **simbologia** e a **classe estrutural**
  (`gtin_global`, `gtin_restricted` ou `not_gtin`, tabela abaixo). Simbologia é de lista fechada:
  `ean_upc`, `other_linear`, `two_dimensional` ou `unknown`. `unknown` é o caso comum, porque o
  identificador de simbologia vem desligado de fábrica no leitor. Na digitação não há simbologia, e a
  origem já diz isso. **Degrau 2, só com `gtin_global`:** o **valor inteiro**, só dígitos, no máximo 14,
  como foi apresentado. Fora do degrau 2 o identificador não entra, nem parte, nem derivação (truncado,
  hash). A base da ausência é `RN-NUC-056`(a), pelo mesmo raciocínio, e `RN-OFF-023` itens 2 a 4: o que
  passa pelo campo de item pode ser credencial ao portador (vale, cartão de fidelidade), dado de meio de
  pagamento ou identificação de quem compra. As condições do degrau 2 são cinco, e nenhuma é opcional:
  1. **Contexto:** só lançar item. Em contexto de identificar documento ou pessoa (`RN-PER-013`) esta
     regra não se aplica, e nada do conteúdo entra (`modulos/perifericos.md` §3, `Não registra`).
  2. **Consumo:** o valor é `C` e só `C`. O `P` (`RN-PRV-009`) recebe o degrau 1. O valor nunca entra
     em agregado sobre clientes (`D-06`) nem em superfície que devolva a um cliente o que chegou a outro.
  3. **Lugar:** a classificação acontece no terminal, quando o fato se forma, antes de qualquer registro
     de erro, cópia de apoio ou exportação de diagnóstico. O valor admitido também não vai a esses
     três; ele existe no fato e em nenhum outro lugar.
  4. **Falha fechado:** falha ao classificar é `not_gtin`, sem valor. A classificação é cálculo local
     sobre tabela embutida: não pede contato, não espera nada e não segura a venda.
  5. **Nunca chave de decisão** (`RN-OFF-027`b): o valor informa quem cadastra. Se cadastrar a partir
     dele deixar de estar fora de escopo e virar automático, volta ao gate de `seguranca`, porque aí
     quem imprime o código decide o catálogo.

  **A classe estrutural.** Fonte: GS1 General Specifications, Release 26.0, ratificada em janeiro de
  2026, https://ref.gs1.org/standards/genspecs/ (Tabelas 1-4, 1-5 e 1-6; §2.1.2, §2.1.3, §2.1.10,
  §2.1.11.3, §2.1.12.2 e §7.9.1), conferida em 2026-09-23. Aplica-se na ordem, e a primeira linha que
  decide encerra:

  | # | Entrada | Classe |
  |---|---|---|
  | 1 | algum caractere que não é dígito, ou comprimento diferente de 8, 12, 13 e 14 | `not_gtin` |
  | 2 | dígito verificador não confere (§7.9.1: pesos 3 e 1 alternados, o 3 no dígito à esquerda do verificador) | `not_gtin` |
  | 3 | 12 dígitos: ganha um zero à esquerda e segue como 13 (a Tabela 1-4 lê o GTIN-12 assim). 14 dígitos com indicador `0`: segue como os 13 seguintes. 13 dígitos começando com `00000`: é GTIN-8 com zeros à esquerda (Tabela 1-4, `0000001`–`0000099`) e segue pela linha 5 com os oito últimos | — |
  | 4 | 13 dígitos, prefixo `02`, `04`, `20`–`29`, `0001000`–`0007999` (GTIN-12 de numeração interna, §2.1.11.3), `952` (demonstração), `980` (recibo de reembolso), `981`–`983` e `99` (cupom) | `gtin_restricted` |
  | 4a | 13 dígitos, prefixo `05` ou `984`–`989` (reservados) | `not_gtin` |
  | 4b | 13 dígitos, qualquer outro prefixo, inclusive `977` (ISSN), `978`–`979` (ISBN) e `789`–`790` (GS1 Brasil) | `gtin_global` |
  | 5 | 8 dígitos (Tabela 1-5): `000`–`099` e `200`–`299` (numeração interna) e `952` → `gtin_restricted`; `977`–`999` (reservados) → `not_gtin`; o resto → `gtin_global` | conforme a linha |
  | 6 | 14 dígitos, indicador `9` (medida variável, que não cruza o PDV, §2.1.10) | `gtin_restricted` |
  | 6a | 14 dígitos, indicador `1` a `8`, cujos dígitos seguintes dariam `gtin_restricted` ou `not_gtin` pelas linhas 3 a 4b (numeração interna não se codifica em GTIN-14, §2.1.2 e §2.1.3) | `not_gtin` |
  | 6b | 14 dígitos, indicador `1` a `8`, o resto | `gtin_global` |
  | 7 | qualquer caso que a tabela não decide, ou erro ao classificar | `not_gtin` |

  `977`–`979` contam como globais por decisão do thread de 2026-09-23 (T-0016): identificam livro e
  revista, nunca pessoa, e a loja que os vende precisa saber qual faltou. `05` fica em `not_gtin` porque
  as fontes divergem (a Tabela 1-4 diz que ele emite prefixo de empresa; a Tabela 1-6 e
  https://www.gs1.org/standards/id-keys/company-prefix dizem que é reservado), e na dúvida o valor não
  entra. Mudar a tabela é alteração desta regra, com a edição da GS1 citada.
- **(b) A fronteira com `published_artifact_missing`, na ordem:** catálogo ausente do terminal, ou sem
  versão cuja vigência cubra o instante → `published_artifact_missing` (`RN-NUC-013`, infeliz a e b);
  identificador que resolve para item e falta preço ou limite → `published_artifact_missing`
  (`RN-NUC-002`); só o identificador que não corresponde a item na versão aplicada cai aqui.
- **(c) Sem contato, o terminal não afirma inexistência.** A recusa diz ao operador que o item não está
  no catálogo que **este terminal** tem, com o instante em que recebeu essa versão, e, em `D1` ou `D2`,
  que não foi possível conferir se há versão mais nova (`RN-OFF-005`, `PN-17`). Nunca "produto não
  cadastrado", nunca "tente novamente".
- **(d) Nada se presume e nada se enfileira.** Não nasce linha provisória, item genérico, preço
  informado nem lançamento "a resolver na volta": compor valor de item que o backend não publicou é
  decidir valor no terminal (`RN-OFF-020`, `RN-OFF-007`). Vender por preço informado é
  `LACUNA-NUC-002` (preço aberto), do humano, e esta regra não a antecipa.
- **(e) A idade do catálogo aplicado é derivada de marco.** O terminal passar a reter uma versão de
  artefato publicado é marco próprio, `published_artifact_version_received` (`fatos-de-operacao.md` §3).
  Em cada recusa, a **idade** é o instante da recusa menos o instante do marco da versão aplicada, e a
  **defasagem** é a versão aplicada contra a vigente publicada no instante (`RN-NUC-014` registra autor
  e instante de cada publicação). Nenhuma das duas é campo do fato (`RN-NUC-045`).
- **(f) "Válido" quer dizer entregue completo, e não é a classe estrutural.** O identificador válido de
  `RN-PER-014` (infeliz) é o que chegou inteiro ao contexto de lançar item, na forma que o catálogo do
  negócio usar. A classe da cláusula (a) responde outra pergunta: o que dele pode entrar no fato. O
  catálogo aceita identificador que não é GTIN (código próprio da loja de roupa, etiqueta de balança), e
  com "válido" igual a `gtin_global` todo código interno não resolvido cairia em
  `unclassified_operation` ou de volta em `published_artifact_missing`, que é o defeito corrigido aqui.
  **A classe nunca muda o desfecho do lançamento** (`RN-PER-013`): recusa, mensagem e caminho do
  operador são os mesmos nas três, e a faixa GS1 não vira condição de venda. A recomendação de
  `seguranca` depende da classe, não desta definição, e vale como foi escrita (auditoria `:206`).

**Escopo** núcleo. A loja de conveniência do posto, a padaria e a loja de roupa lançam item por
identificador, retêm catálogo no terminal e vão receber código que o catálogo retido não tem. O núcleo
lança por identificador digitado mesmo sem `PER` ligado, então a regra não pode morar no módulo; `PER`
é por onde a leitura entra, e `RN-PER-014` cita esta.

**Motivo** `published_artifact_missing` diagnostica **publicação**, e colocar ali o identificador que
não resolve junta duas causas que pedem ações opostas: o código que o negócio usa e **não cadastrou** é
trabalho de retaguarda dele; o código que existe e o **catálogo retido** daquele terminal ainda não
conhece é entrega de publicação, e o cadastro está certo. Recusa que cresce com a idade do retido é
defasagem; recusa que não correlaciona com a idade é cadastro, e encurtar a janela não a conserta — é a
mesma série de `RN-NUC-056`, pela mesma razão. A cláusula (c) existe porque, sem contato, o terminal não
sabe qual das duas é: dizer "não cadastrado" manda o operador chamar alguém para cadastrar um item que
já existe, ou desistir de vender. A origem da entrada existe porque o identificador **digitado errado**
cai no mesmo motivo, e sem ela o erro de digitação infla a conta do cadastro. O degrau 2 existe porque,
sem ele, a recusa diz que faltou cadastro e não diz **qual** item: a lista pronta para cadastrar se
perde, e fato não tem backfill. Ele é estreito porque o que passa pelo leitor é entrada de quem imprimiu
o código, e só a estrutura de GTIN global, calculável offline, separa mercadoria de documento, cobrança
e credencial (auditoria §2 e §3). A trava é temporal: motivo enumerado depois, sobre campo que nasceu
sem ele, não estreita nada.

**Aceite**

1. Com contato e a versão aplicada sendo a vigente, apresentar identificador que o catálogo do
   estabelecimento não tem: a linha não nasce, os demais itens do pedido ficam intactos, e existe fato
   `item_identifier_unresolved` com a versão aplicada e a origem. A leitura conclui "cadastro" porque
   versão aplicada e vigente coincidem, sem ler identificador nenhum. Com o identificador
   `7891000315507` (verificador confere, prefixo `789`), o fato traz classe `gtin_global` e o valor, e
   o cliente obtém a lista "códigos que meus caixas leram e meu catálogo não tem" sem coleta nova. A
   leitura do mesmo fato pelo `P` não contém o valor.
2. Terminal em `D2` retendo a versão `N` do catálogo; publicar `N+1` com um item novo; ler o código
   dele no terminal: recusa com o mesmo motivo, versão `N`, domínio `D2`, e a mensagem não diz que o
   item não existe. Ao reconectar, a leitura deriva que `N` estava defasada e a idade dela, sem coleta
   nova.
3. Dois terminais do mesmo estabelecimento, um com o retido de 6 horas e outro de 6 dias: as recusas dos
   dois se comparam por idade derivada, e a pergunta "encurtar a janela resolve?" tem resposta.
4. Item encontrado sem preço publicado sai com `published_artifact_missing`, e catálogo ausente do
   terminal também. Teste negativo, por busca: nenhum caso de `RN-NUC-002` ou de `RN-NUC-013` (a) e (b)
   sai com o motivo novo, e nenhum identificador sem item correspondente sai com o antigo.
5. O operador segue lançando e conclui a venda com os outros itens; falha ao registrar a recusa não
   interrompe nada e cede na ordem de `RN-NUC-046`.
6. As três classes, com o mesmo desfecho. `2001234001502` (verificador confere, prefixo `20`) →
   `gtin_restricted`, com comprimento 13, sem valor. `7891000315508` (verificador errado) → `not_gtin`,
   sem valor. Um QR de 200 caracteres lido no campo de item → `not_gtin`, comprimento 200, simbologia
   `two_dimensional` ou `unknown`, sem valor. Nos três a recusa, a mensagem e o caminho do operador são
   os de `7891000315507` (cláusula f).
7. Teste negativo, conferível por busca: fora do degrau 2, nenhum fato contém o identificador
   apresentado, nem parte, nem derivação; e **nenhum** registro de erro, cópia de apoio ou exportação de
   diagnóstico o contém, nem no degrau 2. A mensagem ao operador pode mostrá-lo (`RN-PER-014`), e
   mensagem não é campo do fato (§1.1).

**Infeliz** (a) leitura incompleta ou ilegível não chega a ser identificador apresentado: é tentativa
de periférico que **falhou** (`RN-PER-004`), com fato próprio, e não é esta recusa. (b) o código é de
embalagem coletiva, de fornecedor ou de etiqueta de outro sistema → é o mesmo motivo, e está certo: o
negócio pode cadastrá-lo ou é ruído. Com `gtin_global` o valor deixa o negócio separar os dois; nas
outras classes, não. (c) item retirado de circulação que continua na prateleira → não está na versão
aplicada, cai aqui, e a causa é cadastro. (d) a versão nova foi publicada instantes antes e ainda não
chegou ao terminal com contato → o fato continua certo, porque carrega a versão, e a derivação mostra a
defasagem. (e) o fato de recusa é descartado por aperto de recurso local → cede com os demais, com
descarte contado (`RN-NUC-046`), e nenhuma leitura apresenta série truncada como completa
(`RN-NUC-049`c). (f) etiqueta de balança externa, com peso ou preço embutido no código → faixa `2x`,
`gtin_restricted`, sem valor, e a resolução falha porque o código carrega mais que o item:

> **Indisponível — lançar item a partir de etiqueta com peso ou preço embutido no código (faixa `02`,
> `20`–`29`).** Não funciona: ler a etiqueta da balança e ter o item lançado com a quantidade ou o valor
> que ela traz. Falta: a estrutura nacional da faixa, que a GS1 deixa a cada Organização Membro (GenSpecs
> R26 §2.1.12.2) e não foi confirmada para o Brasil; depois dela, a regra de quem decide o valor embutido
> (`PN-13`), que é de `produto`. Responde: humano, pelo documento técnico da GS1 Brasil. Enquanto isso:
> recusa por esta regra, e o operador lança pelo identificador do item com a quantidade informada
> (`RN-PER-015`, `RN-PER-019`). Desde: 2026-09-23.

(g) a GS1 realoca faixa numa edição nova → alteração desta regra com a edição citada; fato já formado
não é reclassificado (`PN-07`), e a leitura que atravessa a data a declara. (h) documento de pessoa
jurídica de 14 dígitos, lido ou digitado no campo de item, que passa no verificador (cerca de 1 em 10,
ESTIMATIVA da auditoria §3) e cai em faixa global → entra como valor. Risco residual declarado, contido
pela condição 2: fica no ambiente do cliente e não chega ao `P`. (i) o leitor transmite UPC-E em 8
dígitos, ou ISBN e ISSN em 10 caracteres → o valor se perde, ou entra num formato que não é o GTIN do
item. Quem o recupera é o leitor configurado para transmitir o GTIN inteiro; o terminal não expande.

---

## 2. O motivo da correção de venda concluída

### RN-NUC-047 — Cancelamento, devolução e estorno carregam motivo **enumerado**; sem lista fechada, "por que cancelamos tanto" não tem resposta nunca

**Enunciado** o fato novo que corrige venda concluída (`RN-NUC-008` — cancelamento, devolução, estorno)
carrega, além de autor, instante e referência ao original, um **motivo de código enumerado**, da lista
fechada de §2.1. O motivo é **campo de decisão** e nunca texto livre; texto livre pode acompanhar como
observação e **não** é campo de decisão nem de agregação (mesma separação de `RN-NUC-043`). Devolução
enumera o motivo **por item devolvido**, porque é por item que ela existe. Ocorrência que não cabe em
nenhum código é registrada como **não classificada**, que é defeito nosso visível, não categoria de
repouso. Esta regra **não** altera nenhum desfecho de `RN-NUC-008`: ela fixa a **forma** de um campo que
aquela regra já exige.

**Motivo** é o mecanismo de `RN-NUC-043` aplicado ao outro fato que ninguém enumerou, e o passo 4 da
T-0004 o nomeou como irrecuperável: a recusa ganhou lista fechada e o **cancelamento** não. Sem ela,
"por que cancelamos tanto neste cliente" só tem resposta lendo texto livre — que ninguém lê, e que não
agrega. E as causas que mais se parecem para quem opera são as mais diferentes para quem conserta:
cancelamento por **erro de quem operou** é treino ou superfície; por **preço publicado errado** é
defeito de publicação e não do operador; por **registro em duplicidade** é defeito de idempotência
**nosso**; por **desistência do cliente-final** não é defeito de ninguém e é o motivo legítimo mais
comum. Sem código, as quatro chegam como "cancelou", que é o mesmo que não chegar. Enumerar depois não
estreita nada: o campo nasce agora, com o fato.

**Aceite** ao fim de um mês, com o mesmo volume de cancelamentos, responder **sem ler um só texto
livre**: quantos foram erro de operação, quantos foram preço ou limite publicado errado, quantos foram
duplicidade e quantos foram desistência do cliente-final — e, para o terceiro, apontar em que terminal e
em que faixa do dia. Segundo aceite, o negativo: nenhum fato de correção existe sem código de motivo, e
tentar registrar a correção sem ele → recusado, com fato de recusa
(`business_precondition_unmet`). Terceiro: uma devolução de dois itens em que só um voltou por defeito
distingue os dois motivos, item a item.

**Infeliz** o motivo verdadeiro não está na lista — e vai acontecer, porque a operação real inventa
casos. Então o fato nasce **não classificado**, o que é trabalho nosso visível e contável, e o código
novo entra por alteração desta regra, com a `RN` dona citada. Nunca se acomoda caso novo num código
existente "porque é parecido": um `operator_error` inflado esconde exatamente o defeito de produto que a
lista existe para achar.

### 2.1 Os motivos da correção, e o que cada um diagnostica

| Motivo | Diagnostica | Regido por |
|---|---|---|
| `operator_error` | **operação**: lançou, cobrou ou concluiu errado. Contado por terminal e por faixa do dia, é treino ou superfície — nunca conclusão sobre a pessoa (`RN-REL-008` continua decidindo leitura por pessoa) | `RN-NUC-008` |
| `customer_withdrawal` | **nada do produto**: o cliente-final desistiu, trocou de ideia ou não levou. É o motivo legítimo mais comum, e existe para **não** inflar os outros | `RN-NUC-008` |
| `item_unavailable` | **catálogo ou disponibilidade**: o que foi vendido não pôde ser entregue | `RN-NUC-002`, `RN-NUC-013` |
| `item_rejected_by_customer` | **o que foi entregue**: recusado por defeito, item trocado ou qualidade. É de produto ou de produção, não de venda | `RN-NUC-008` |
| `published_artifact_incorrect` | **publicação**: preço, desconto, encargo ou limite aplicado estava errado. É o motivo que impede que erro de publicação apareça como erro de operador | `RN-NUC-013`, `RN-NUC-014` |
| `payment_unresolved` | **pagamento**: não se consumou, ou foi desfeito pelo lado do meio de pagamento. O desfecho é regra de `RN-NUC-005` e do módulo dono, nunca deste campo | `RN-NUC-005` |
| `duplicate_record` | **defeito nosso**: a mesma venda ficou registrada duas vezes. Contado, é o único desta lista que aponta para nós — idempotência ou superfície | `RN-NUC-003` |
| `external_requirement` | **exigência externa**: a correção decorre de obrigação documental ou de determinação de terceiro. A regra do desfecho é do módulo dono (`RN-EMI-021`, `RN-FIS-006`), **nunca** daqui, e nada aqui afirma norma | `RN-NUC-008` |
| `unclassified_correction` | **defeito de classificação nosso**, visível e contável | `RN-NUC-008` |

---

## 3. O modo de atendimento

### RN-NUC-048 — Modo de atendimento é domínio fechado do núcleo; ausência não é valor, e cada fato carrega o modo vigente no instante dele

**Enunciado** `service_mode` (`glossario.md` §1.3) é **domínio fechado do núcleo**, com código estável:
nunca texto livre, nunca termo de ramo (`mesa`, `balcão`, `bomba`, `delivery` **não** são valores) e
nunca inferido do canal de entrada (`channel`, de `PCF`). O domínio mínimo é o do glossário: atendido
**presencialmente no estabelecimento** × **entregue em endereço**. Quatro cláusulas: (a) **não existe
valor "não informado"** — a venda **não se conclui** sem modo declarado, e a recusa é fato com motivo
`business_precondition_unmet` (§1.1); (b) **cada fato carrega o modo vigente no instante daquele fato**,
e nenhum fato tem o modo reescrito depois — mudar o modo enquanto o pedido está em construção é alteração
local do pedido (`RN-NUC-001`), **não** fato novo, e a diferença entre abertura e conclusão se lê nos dois
fatos; (c) **valor novo entra por alteração desta regra**, com o teste dos três negócios escrito, e
**módulo não acrescenta valor** a este domínio por conta própria; (d) qualquer efeito do modo sobre
preço, encargo, tributo, produção ou entrega é regra do **módulo dono**, declarada lá — o núcleo não
presume nenhum.

**Motivo** o termo existe no glossário desde a primeira passada, é conteúdo de `order_opened`
(`fatos-de-operacao.md` §3) e **nenhuma regra numerada o regia** — é o resíduo de `LACUNA-GLO-002`, o
último dela, e o passo 4 da T-0004 nomeou a consequência: fato de núcleo cujo conteúdo é conceito sem
regra nasce com o valor indefinido, e o valor indefinido de um conceito de atendimento vira **texto
livre** ou **código de ramo**. As duas saídas são caras e diferentes: texto livre torna "quanto do meu
faturamento é entrega" irrespondível para sempre; código de ramo põe `mesa` num campo do **núcleo**, que
é o defeito que `glossario.md` §5 lista e que só sai com migration em N schemas. E o glossário já
proibia inferir do canal, sem dizer o que acontece quando o modo **falta** ou **muda** — que era
exatamente o que faltava.

**Aceite** concluir venda sem modo declarado → **negado**, com fato de recusa
`business_precondition_unmet`, e nenhuma venda existe. Pedido aberto como presencial e concluído como
entrega → `order_opened` diz presencial, `sale_concluded` diz entrega, e a leitura sabe as duas coisas
**sem** nenhum campo mutável; a pergunta "quantos atendimentos mudam de modo no meio" é respondível sem
coleta nova. Teste negativo, conferível por busca: nenhum valor de `service_mode` em spec, exemplo ou
leitura é `mesa`, `balcão`, `bomba`, `delivery` ou texto livre; e nenhuma regra deduz o modo do canal.

**Infeliz** o cliente quer um modo que o domínio não tem — consumo no local com serviço à mesa, retirada
no balcão de pedido feito de casa, entrega por terceiro. **Necessidade legítima:** o negócio dele atende
de formas que o par mínimo não separa. **O teste, e ele é o mesmo de sempre:** se o modo muda o que o
**núcleo** faz com a venda para um posto, uma padaria **e** uma loja de roupa, ele entra no domínio por
alteração desta regra; se muda só o que **um módulo** faz, o vocabulário é do módulo — `channel` (`PCF`),
`fulfillment_state` (`CMP`), mesa e comanda (`MSA`) — e o modo continua sendo um dos dois. Acomodar valor
de ramo no domínio do núcleo é barato hoje e é o defeito mais caro deste projeto amanhã.

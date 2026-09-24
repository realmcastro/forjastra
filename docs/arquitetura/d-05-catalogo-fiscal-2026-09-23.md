# D-05: onde mora a regra fiscal que vale para mais de um cliente

> Proposta de `arquiteto-dados` · T-0020, passo G.1 · item `F-020` · 2026-09-23.
> Quem decide é o thread. Este documento não cria migration, não modela `FIS` e não diz o conteúdo de
> nenhuma alíquota: conteúdo é do contador, e a modelagem de `FIS` é item próprio, depois deste.
> A prova da §5.7 rodou num contêiner descartável e não é o DDL futuro.

## 1. A recomendação, em quatro linhas

1. **A autoridade mora no `platform`**: uma cópia só de cada versão de regra, escrita uma vez, com as
   restrições declarativas do banco (unicidade, recusa de vigência retroativa, conteúdo que confere com
   o digest).
2. **Cada cliente com `FIS` ligado tem uma projeção no próprio schema**: a mesma versão, com o mesmo
   id e o mesmo digest, escrita por um gravador que só tem `INSERT`. O fato de venda referencia a
   projeção por FK dentro do schema, e a sessão do cliente nunca lê o `platform`.
3. **Ordem: publicar na autoridade, projetar em cada schema, só então liberar aos terminais daquele
   cliente.** É a mesma ordem de [[decision-d-06-ii-trilha-no-platform-com-projecao-no-cliente]].
4. **Vigência é data civil**, resolvida à meia-noite no fuso do estabelecimento do fato
   (`RN-FIS-008`, `RN-NUC-057`). É a exceção declarada a "nunca `date`" de `dados.md` §3 (§5.3).

Defeito desta saída, na mesma frase: ela custa N cópias do catálogo e abre uma janela entre a
autoridade e a projeção de cada cliente, na qual dois clientes podem resolver versões diferentes para o
mesmo dia local. A janela é **detectada** sempre, por uma consulta dentro do schema (§5.7, G11). Ela
**não é impedida**: impedir exigiria bloquear a venda, e o invariante 10 proíbe.

## 2. O que qualquer saída precisa cumprir

Restrições já aprovadas, e nenhuma saída pode violar uma delas:

| Fonte | O que exige da casa |
|---|---|
| `RN-FIS-009` (`fiscal-regimes-e-vigencia.md:155`) | regra nova entra por **publicação de dado**, sem build, sem migration, sem atualizar terminal |
| `RN-FIS-008`, `RN-NUC-057` | vigência resolvida no fuso do **estabelecimento** do fato; não existe fuso do cliente |
| `RN-NUC-058` | valor monetário vale numa moeda declarada e só se aplica a estabelecimento dela |
| `RN-NUC-013`, `RN-NUC-015` | o terminal aplica a versão que retém; o servidor não recalcula na volta; divergência vira pendência |
| `RN-FIS-004`, `RN-FIS-005` | o fato congela a versão; nada escreve no passado; vigência retroativa é recusada na publicação |
| `dados.md` §1 | nenhuma consulta de cliente cruza schema; nenhuma tabela de cliente no `platform` |
| [[decision-papel-de-aplicacao-assumido-por-transacao]] | `app_t_<slug>` alcança só o próprio schema, e a credencial nua não alcança nada |
| `db/universo-e-declaracao.md` §7.5.3 | schema fora de `platform` e `t_*` reprova o `verify` (saída `3`) |

A última linha tira da mesa um quarto schema dedicado ao catálogo: ele exigiria mudar o `verify` e o
alvo do executor (`CONTRATO.md` §1: alvo é `platform` **ou** `tenant`) sem ganhar isolamento nenhum.

**O critério de `D-06`** (a residência segue o objeto do fato) decide a autoridade: o objeto de uma
alíquota de UF é o território, e nenhum cliente. Ela não pode morar num `t_<slug>`, porque sairia com o
cliente e não existiria antes do primeiro. O único lugar do banco que não é de cliente é o `platform`.

## 3. Os dois eixos de escala

- **N clientes** lendo a mesma regra.
- **M mudanças por ano**, com data escolhida pela norma e não por nós, e aviso que vai de meses (F-05)
  a um dia (o caminho infeliz de `F-020`).

Nos próximos dois anos (até 2028-09) o eixo municipal não morde: até 2028 a alíquota está em norma
nacional (F-03, F-04), e a lei própria de cada município vem de 2029 em diante (F-05, F-06). Então o
volume do catálogo no período é dominado pela regra nacional e pelas 27 UFs.

## 4. As três saídas do registro, nos dois eixos

| Saída | N clientes | M mudanças | Lei de um dia para o outro |
|---|---|---|---|
| **1. `platform`, lido pela sessão do cliente** | uma cópia; custo zero por cliente | uma escrita por versão | a versão está em todos no mesmo instante |
| **1'. `platform`, lido fora da transação do cliente** | idem | idem | idem |
| **2. replicada em cada schema, sem autoridade** | N cópias; nada para comparar | N escritas por versão, sem referência | quem não recebeu a tempo diverge, e ninguém sabe |
| **3. artefato que acompanha o release** | uma cópia por release | um release por mudança | exige release de emergência para todos os clientes |

**Saída 1.** Resolve a divergência e mantém a restrição declarativa. O custo está no acesso: todo
`app_t_<slug>` passa a ter `USAGE` no `platform` e `SELECT` no catálogo, o que abre exceção no único
caminho que a §7.5.1 prova. O fato não pode ter FK para a versão, porque FK entre schemas é consulta de
cliente cruzando schema. E quando o cliente sai, as versões que os fatos dele congelaram ficam aqui.

**Saída 1'.** A mesma casa, lida por um papel próprio antes de abrir a transação do cliente. Nenhuma
sessão de cliente lê o `platform`. O custo: um segundo pool no caminho de sincronização da venda (a
pergunta que [[convention-alcance-de-schema-e-privilegio-nao-escolha]] deixou aberta), um fato sem FK
(a checagem vira código, e [[convention-o-que-o-banco-impoe-vence-o-que-alguem-lembra]] diz o que isso
vale), e o conjunto que o terminal recebe montado de duas fontes em duas transações. É a saída mais
barata em armazenamento, e é o fallback da recomendação (§8, saída 1').

**Saída 2.** A venda lê só o próprio schema. Publicar vira N escritas sem nenhuma cópia de referência,
então a cópia que não chegou e a cópia que chegou errada são indistinguíveis de cadastro do cliente.

**Saída 3.** Zera a divergência e dá um conteúdo único e revisável por versão. Contradiz `RN-FIS-009`,
que é regra aprovada: a regra entra sem build e sem release. E perde a restrição declarativa. Um
artefato de dado desacoplado do release deixa de ser a saída 3 e precisa de casa, o que volta à 1.

## 5. A saída recomendada: autoridade no `platform`, projeção verificável no cliente

É a composição da 1 com a 2. Da 1 ela guarda a cópia única e a restrição na escrita; da 2, a venda que
lê só o próprio schema. O que fecha o defeito da 2 é existir uma autoridade contra a qual a projeção se
compara, com o mesmo id e o mesmo digest dos dois lados.

### 5.1 Forma mínima (nomes ilustrativos; as tabelas são do item de `FIS`)

| Onde | O quê | Stream de migration |
|---|---|---|
| `platform.rule_versions` | a autoridade: identidade da regra, território, `valid_from` (data), `published_at`, conteúdo tipado, digest | `platform/` |
| `platform.rule_version_projections` | o livro da entrega: (schema, versão, `projected_at`), retomável como o ledger | `platform/` |
| `t_<slug>.rule_versions` | a projeção: mesmo id, mesmo digest, conteúdo em **texto canônico**, `projected_at` próprio | `modules/fis/` |

- **Id:** `uuid` ordenado no tempo, gerado onde a linha nasce, que é a autoridade (`D-04`). A projeção
  reusa o id. Resolver versão pelo id só é seguro **dentro da projeção do próprio cliente**, nunca na
  autoridade a partir de id recebido ([[gotcha-chave-unica-globalmente-parece-endereco]]).
- **Digest com algoritmo no valor** (`sha256:<hex>`), para que trocar o algoritmo seja aditivo.
  `sha256()` é nativo do PostgreSQL desde a 11, sem extensão (medido em 16.15, G3).
- **Conteúdo da projeção em `text`, não em `jsonb`.** O digest é sobre bytes, e `jsonb` não preserva
  ordem de chave nem espaço (documentação do PostgreSQL, tipo `jsonb`). Número dentro do conteúdo é
  string decimal canônica, como manda [[decision-dinheiro-e-quantidade]].
- **Por que texto e não tabelas tipadas na projeção:** tipada, toda forma nova de regra (`RN-FIS-009`,
  caminho infeliz) exigiria migration nas duas streams em passo travado, e isso é fonte de drift. A
  restrição sobre o **conteúdo** mora na autoridade, onde ele é escrito. A projeção restringe
  **identidade** (FK do fato) e **integridade** (conteúdo confere com o digest). É essa a divisão
  honesta, e o gate precisa lê-la assim.
- **Projeção e autoridade são append-only**, com o gatilho de imutabilidade da família (`0002`) e o
  cuidado de [[gotcha-gatilho-de-comando-nao-protege-particao]] se alguma delas for particionada. Versão
  publicada e substituída continua existindo, inclusive a que nunca vigiu (`F-020`, Registra).

### 5.2 Ordem: publicar, projetar, liberar

```
publicação (ato nosso, online)
→ autoridade grava com COMMIT
→ para cada schema com FIS ligado, uma transação: INSERT na projeção + linha no livro da entrega
→ o conjunto publicado a um terminal de X sai só da projeção de X
→ o terminal aplica a versão retida cuja vigência cobre o dia local do fato
```

Falhar no schema 7 de 20 é normal: os 6 ficam projetados, a rodada é retomável, e reinserir a mesma
versão cai na chave primária, que o gravador lê como "já projetado"
([[gotcha-on-conflict-com-alvo-exige-select]]). Não é migration: é processo em lotes, como backfill
(`migrations.md` §6). E não exige deploy, o que cumpre `RN-FIS-009`.

Como o terminal só recebe o que a projeção do cliente dele tem, o fato que chega na sincronização
referencia uma versão que existe na projeção, e a FK não recusa venda legítima. Id desconhecido não
derruba a venda: o fato do núcleo grava, e o congelado de `FIS` vira "não tributado, com motivo"
(`RN-FIS-004`, infeliz; `RN-FIS-011`).

### 5.3 Vigência é data civil, e a exceção a `dados.md` §3 é declarada

"Vigente a partir de 2027-01-01" começa em instantes diferentes em cada fuso: o Brasil tem ao menos
cinco regiões de hora em uso (`America/Noronha`, `Sao_Paulo`, `Manaus`, `Rio_Branco`, `Eirunepe`,
todas presentes no tzdata desta máquina), e uma regra nacional atravessa todas. Um `timestamptz` não
representa "meia-noite local de cada estabelecimento". Então `valid_from` é `date`, sem hora, e a hora
vem do fuso publicado do estabelecimento no instante do fato. Medido (G9): o mesmo instante
`2027-01-01T03:30Z` resolve a versão nova em São Paulo e a antiga em Manaus, e está certo.

A resolução: entre as versões da regra e do território com `valid_from` até o dia local, a de maior
`valid_from` e, no empate, a de maior `published_at`. O empate cobre a correção antes da vigência (erro
achado no ensaio de `RN-FIS-010`), sem editar a versão errada.

### 5.4 Guarda de retroatividade, declarativa na autoridade

Com retroatividade recusada, a versão vigente num dia é função só do que foi publicado antes dele, e a
resolução é estável: nenhuma publicação futura muda a resposta de um dia que já começou. A guarda compara
`published_at` com a meia-noite de `valid_from` no fuso do território em que o dia começa primeiro, que é
dado do catálogo (público), não configuração de cliente. Medido: publicar às 20h de Brasília da véspera
passa (G1); publicar à 0h de Brasília do próprio dia é recusado, porque em Noronha o dia começou às
02:00Z (G2). Um limite agnóstico de território (UTC+14) seria simples e recusaria a lei publicada na
véspera à noite, que é justamente o caminho infeliz.

### 5.5 A fronteira entre as duas espécies de regra

**No catálogo:** o enunciado que não nomeia cliente nem estabelecimento, e sim território,
classificação, regime (como espécie) e data. Alíquota, redução por classificação, lista de códigos,
forma de regime.

**No schema do cliente, em qualquer saída:** o que nomeia o cliente ou a unidade. Regime do
estabelecimento no tempo (`RN-FIS-007`), inscrição, a classificação que o cliente deu ao item
(`fronteira-do-nucleo.md` §6), exceção concedida a ele por ato próprio. Esses referenciam a projeção
por FK dentro do schema. Se a pergunta 3 de `fiscal-regimes-e-vigencia.md:317` terminar em "o cliente
pode sobrepor a nossa leitura", a sobreposição é mais um artefato publicado pelo cliente, no schema
dele, e o fato congela as duas versões. A casa aceita as duas respostas.

### 5.6 Quem escreve e quem lê

| Principal | Alcança | Não alcança |
|---|---|---|
| publicador (superfície nossa, credencial do console de `D-06`(ii)) | `INSERT` na autoridade | schema de cliente |
| leitor da autoridade (processo de entrega) | `SELECT` na autoridade | schema de cliente |
| gravador de projeção | `USAGE` em cada `t_*` com `FIS`, `INSERT` só na projeção | `SELECT` em qualquer lugar (G6) |
| `app_t_<slug>` | `SELECT` na própria projeção | `INSERT`/`UPDATE` na projeção (G7), `platform`, outro `t_*` (G7) |

Duas consequências que o item de `FIS` herda:

- **O `ALTER DEFAULT PRIVILEGES` do papel de cliente entrega `INSERT, SELECT, UPDATE` à projeção no
  instante em que ela nasce** (medido, G4). A migration que cria a projeção revoga `INSERT` e `UPDATE` do
  papel do cliente na mesma transação. Sem isso, qualquer defeito no caminho de requisição de X planta
  uma versão que os terminais de X recebem.
- **O gravador é o segundo principal da família do gravador de `D-06`(ii).** `platform.role_declarations`
  hoje só conhece `executor` e `app_credential` (`db/universo-e-declaracao.md` §7.5.4), e a §7.5.1 acusa
  quem alcança `t_*` sem declaração. O tipo de declaração e a regra do `verify` para "gravador de
  projeção" se desenham uma vez, para os dois.

O gravador errar de schema não expõe nada: o conteúdo é público e igual para todos, e não carrega
cliente. É a diferença para o `TRL-01` de `docs/auditorias/2026-09-23-d-06-trilha.md`. O que resta é
**falsificação** (versão com digest coerente e conteúdo que a autoridade nunca publicou), e ela exige a
credencial do gravador. Detecta-se comparando digests da projeção com a autoridade, por schema. Assinar
a versão e o terminal conferir a assinatura fecharia o caso sem depender do `verify`, ao custo de uma
chave nossa sob custódia: registrado em §9 como P2.

### 5.7 O que foi medido

PostgreSQL 16.15, contêiner `forja-g1-pg` na porta 55541, removido ao fim. Dois clientes (`t_x`, `t_y`),
papéis sem login como os do arranjo real, gravador separado.

| # | Caso | Resultado |
|---|---|---|
| G1 | versão com vigência 2027-01-01 publicada em 2026-12-31T23:00Z | aceita |
| G2 | mesma vigência publicada em 2027-01-01T03:00Z | recusada: o dia começou às 02:00Z em Noronha |
| G3 | digest que não confere com o conteúdo | recusada |
| G4 | privilégio do papel de cliente na projeção recém-criada, antes do `REVOKE` | `INSERT,SELECT,UPDATE` |
| G5 | gravador projeta nos dois schemas, com valores vindos do leitor | aceito |
| G6 | gravador tenta ler a projeção | `permission denied for table` |
| G7 | `app_t_x` tenta gravar na projeção, ler `t_y`, ler `platform` | três `permission denied` |
| G8 | digests de `t_x` e `t_y` | iguais |
| G9 | mesmo instante, estabelecimentos em São Paulo e Manaus | versão nova e versão antiga, cada uma no seu dia local |
| G10 | congelado com versão fora da projeção | recusado pela FK; com versão projetada, aceito |
| G11 | venda de 2027-01-01 local que congelou a versão de 2026 | listada pela consulta de divergência, dentro de `t_x` |

Não medi: tempo de entrega com N real, volume de um catálogo real, e o `verify` do executor contra o
gravador (ele não conhece o tipo ainda).

## 6. Os critérios de aceite de `F-020`

**1. Mudança de alíquota em D, X às 23h59 da véspera e Y à 0h01 de D.** As duas vendas estão em dias
locais diferentes e **devem** congelar versões diferentes (G9). A pergunta real é se X e Y podem
congelar versões diferentes para o **mesmo dia local**. A resolução do servidor é uma só, porque a
autoridade é uma só e a projeção tem o mesmo digest em todo schema (G8). Ainda assim acontece, por dois
caminhos: terminal sem contato (`RN-NUC-015`) e projeção que chegou tarde ao schema de Y. Os dois são
detectados pela **mesma** consulta, dentro do schema (G11), rodada em dois momentos: na ingestão do fato
e na chegada de uma versão cuja vigência já começou (o `projected_at` da projeção diz isso sem ler o
`platform`). O desfecho é pendência nomeada ao dono da fila do cliente (`RN-OFF-011`), com o efeito em
valor. A demora da entrega é nossa, e o livro da entrega no `platform` a mostra por schema.

**2. Terminal sem contato.** A versão chega ao terminal como qualquer artefato publicado
(`RN-NUC-013`), antes da vigência no caso normal. Começada a vigência com ele offline: se a versão
anterior foi publicada sem fim, ele a aplica e a divergência aparece na sincronização; se foi publicada
com fim e ele não tem sucessora, a composição falha fechado naquele item e o fato fica não tributado com
motivo (`RN-NUC-013`, infeliz b; `RN-FIS-011`). Qual das duas é regra de `FIS` e talvez do contador; a
casa permite as duas, que é o que o caminho infeliz de `F-020` pede.

**3. Isolamento.** Nenhuma sessão de cliente lê fora do próprio schema (G7). A leitura do catálogo sai da
projeção do próprio cliente.

**4. Registro.** É do thread: `decision` em `memory/plataforma/` com
`supera: [[decision-d-05-catalogo-de-regra-fiscal-sem-casa]]`, e a linha de `D-05` no `CLAUDE.md` §8.

## 7. Coerência com o que já está decidido

- **`D-06`(ii):** mesmo padrão (autoridade no `platform`, projeção derivada no cliente, ordem autoridade
  → projeção → liberação), sem o pseudônimo, porque a projeção do catálogo não carrega pessoa. Quem
  publicou fica só na autoridade; se o cliente precisar ver, entra pseudônimo por cliente, como lá.
- **Dinheiro e quantidade:** valor dentro do conteúdo é string canônica. Na autoridade tipada, alíquota é
  `numeric` sem modificador sob domínio de envelope com `min_scale()`
  ([[gotcha-envelope-de-escala-usa-min-scale]]); o envelope da alíquota é do item de `FIS`. Parâmetro em
  dinheiro (valor fixo por unidade, se a norma usar) declara a moeda na versão.
- **`RN-NUC-057`:** o catálogo não tem fuso que decida dia de fato. O fuso do território em que o dia
  começa primeiro serve só à guarda de retroatividade, que decide se uma publicação é aceita e nunca a
  que dia um fato pertence.
- **`RN-NUC-058`:** versão com parâmetro em moeda só se aplica a estabelecimento dessa moeda; nos outros,
  ausência explícita (`RN-FIS-011`). O catálogo não converte moeda.

## 8. O recusado, nas quatro partes

**Saída 1, sessão do cliente lendo o `platform`.** (1) Necessidade: uma cópia da regra do território,
com restrição declarativa, lida por N clientes sem divergir. (2) Recusado porque concede `platform` a
todo papel de cliente, deixa o fato sem FK e deixa fora do export do cliente as versões que ele
congelou. (3) Autoridade no `platform` com projeção no cliente. (4) Mantém a cópia única e a restrição na
escrita, sem concessão nova ao papel de cliente e com FK dentro do schema; provado por G7 e G10.

**Saída 1', papel próprio lendo o `platform` fora da transação.** (1) Necessidade: a de cima, sem
cópia por cliente. (2) Recusado porque põe um segundo pool no caminho da sincronização, deixa a validade
da versão no fato como código e monta o conjunto do terminal em duas transações. (3) Projeção no
cliente. (4) Troca armazenamento (N cópias) por FK, uma transação e nenhuma leitura de `platform` no
caminho da venda. **A troca é reversível nos dois sentidos**, porque o fato referencia o id da
autoridade: sair da projeção é contrair; voltar a ela é projetar de novo o que a autoridade tem. Se a
faixa de 10⁴ clientes tornar o volume caro (§10, pergunta 5), a 1' é o caminho.

**Saída 2, réplica sem autoridade.** (1) Necessidade: a venda lê só o próprio schema. (2) Recusado
porque não há referência contra a qual a cópia se compare, e a divergência fica silenciosa. (3) Autoridade
única, digest, livro da entrega e a consulta de divergência. (4) A divergência passa a ser detectada, com
uma consulta só para os dois caminhos; provado por G8 e G11.

**Saída 3, artefato no release.** (1) Necessidade: nenhuma divergência entre clientes, conteúdo único e
revisável por versão. (2) Recusado porque `RN-FIS-009` proíbe release para mudança de regra, e a norma
escolhe a data; e porque perde a restrição do banco. (3) Versão como dado na autoridade, com digest. (4) O
digest faz o papel do hash do artefato, publicar é escrita de dado (G1), e retroatividade e conteúdo
adulterado são recusados pelo banco (G2, G3).

**Gravador sendo o próprio papel do cliente.** (1) Necessidade: menos principais para declarar e
verificar. (2) Recusado porque exige `INSERT` do papel do cliente na projeção, e aí o caminho de
requisição de X planta versão para os terminais de X. (3) Gravador separado, só `INSERT`, sem `SELECT`.
(4) Plantar versão exige a credencial do gravador, que nenhum caminho de requisição tem; provado por G6
e G7.

## 9. O aviso B6 depois do fechamento

`modulos/fiscal.md:80` (e a cópia em `pendencias-fase-1-e-2-2026-09-23.md:272-279`) apoia o
`Enquanto isso` em "`FIS` não entra no modelo enquanto `D-05` estiver aberta". Fechada `D-05`, `FIS` é
modelável e a frase perde a base. `LACUNA-FIS-002` continua aberta, e ela trava mais do que o total:
calcular o tributo sem saber se o preço o contém já é escolher uma das duas respostas. Texto proposto,
para o dono de `docs/produto/**`:

> **Indisponível: tributo composto no total da venda.** Não funciona: compor o IBS/CBS no total que o
> cliente-final paga, porque não se sabe se o tributo está contido no preço praticado ou é acrescido a
> ele no fechamento. Falta: a regra de composição do preço ao consumidor (`LACUNA-FIS-002`). Responde:
> humano, com o contador. Enquanto isso: a incidência que depende da composição não é calculada, e o
> fato fica **não tributado, com o motivo nomeado** (`RN-FIS-011`); a venda conclui com o total que o
> núcleo compõe e com comprovante não fiscal (§2.1, `Desligado`). A resposta entra como versão
> publicada, sem migration: no catálogo, se for regra do território; na configuração do
> estabelecimento, se for escolha do cliente ([[slug-da-decisão-d-05]]). Desde: 2026-09-23.

A diferença para hoje: o fato não tributado passa a existir e a ser contável, o que o invariante 10 pede.

## 10. As cinco perguntas de `dados.md` §6

**1. Outro ramo, outro fuso.** Ramo: nenhuma coluna de vertical; a regra é chaveada por território,
classificação, regime e data, e uma forma nova (valor fixo por litro, por exemplo) é `RN-FIS-009`, não
coluna. Fuso: vigência é data civil resolvida no fuso do estabelecimento (G9); dois estabelecimentos do
mesmo cliente em fusos diferentes resolvem cada um o seu dia. Outro país: o código de território
precisa declarar o esquema de codificação, para que nada presuma a lista de UFs.

**2. Consulta que fica cara, e o índice.** Não está no caminho do caixa: o terminal compõe com o que
retém. No servidor: (a) montar o conjunto do terminal (versões vigentes e futuras dos territórios da
unidade), e (b) a consulta de divergência, na ingestão e na chegada tardia. As duas pedem índice na
projeção por (regra, território, `valid_from`, `published_at`), que a unicidade já dá, e índice no
congelado por versão (FK). A mais cara é a (b) na chegada tardia, limitada à janela desde `valid_from`.
A entrega é O(N) por publicação. ESTIMATIVA: versão pequena (uma alíquota) em 10³ schemas são 10³
transações curtas, segundos a um minuto; versão com 10⁴ linhas de classificação são 10⁷ linhas, de
~2 a ~17 min a 10⁵ ou 10⁴ linhas/s. Não medido. Orçamento de fechamento (1 s) não é tocado.

**3. A coluna que vou querer mudar em 6 meses.** `valid_from` como `date`. Vai parecer errada no dia em
que alguém quiser vigência com hora. Está certa hoje porque `RN-FIS-008` e `RN-NUC-057` definem a
vigência na meia-noite de cada estabelecimento, e um instante único não expressa isso. Norma com hora é
forma nova, e entra como coluna nova e nula. Em segundo lugar: o conteúdo da projeção em texto, que
alguém vai querer tipar; o custo seria migration em passo travado nas duas streams (§5.1).

**4. Isolamento.** Pela sessão de cliente, nenhum caminho novo (G7). O conteúdo projetado é público e sem
cliente. O único principal novo que alcança N schemas é o gravador, sem leitura (G6). O livro da entrega
fica no `platform` e nunca é projetado. Cache no `backend`: o conjunto liberado a X depende da projeção de
X, então cache compartilhado por id de versão liberaria a X o que X ainda não tem, e a FK recusaria a
sincronização; cache, se houver, é por cliente e estabelecimento.

**5. Cardinalidade em 2 anos.** ESTIMATIVA, com a conta à vista: autoridade de 10³ a 10⁴ versões (regra
nacional mais 27 UFs, dezenas de publicações por ano cada, municipal ainda nulo até 2029); conteúdo de
10⁵ linhas se as listas de classificação forem por versão. Projeção: isso vezes N. Livro da entrega:
versões × N, 10⁷ no teto de 10³ clientes. **10² clientes:** irrelevante. **10³:** a entrega de versão
grande leva minutos, e a publicação com aviso de um dia precisa de alarme de entrega incompleta. **10⁴:**
projetar só os territórios dos estabelecimentos de cada cliente corta o termo dominante de 2029 em diante,
ou se volta à saída 1' (§8).

## 11. O que o item de modelagem de `FIS` herda

- Migrations: autoridade e livro da entrega na stream `platform/`; projeção em `modules/fis/`; nunca as
  duas no mesmo arquivo (`migrations.md` §7). Tabelas novas, sem lock em tabela quente; a entrega é
  processo em lotes, fora de migration. O checklist de `migrations.md` §10 se responde lá, sobre o DDL.
- **A stream de módulo ainda não roda**: o registro de módulo ativo não existe e qualquer arquivo em
  `db/migrations/modules/**` recusa a rodada (`CONTRATO.md` §2.3, §11.6). A projeção depende dele, e a
  entrega também, para saber quais schemas têm `FIS`.
- `REVOKE INSERT, UPDATE` do papel do cliente na projeção, na migration que a cria (G4).
- Tipo de declaração e regra do `verify` para gravador de projeção, junto com o de `D-06`(ii).
- Serializador canônico único em `packages/contracts/`, o mesmo do ponto fixo, para que o terminal
  confira o digest do que retém. Recomendação: o congelado guarda id **e** digest da versão aplicada, e
  digest diferente na ingestão vira pendência, nunca recusa.
- O domínio de envelope usado na autoridade é redefinido no `platform`; o texto dele tem de ser idêntico
  ao da stream de cliente, e nada no `verify` compara os dois hoje.

## 12. Registra / Não registra

**Registra:** cada versão publicada, com vigência, instante e autor (autoridade); a chegada de cada
versão a cada schema (`projected_at`, nos dois lados); a pendência de divergência, por fato. **Não
registra:** leitura do catálogo por cliente, porque o congelado de cada venda já diz qual versão foi
aplicada (`F-020`). O livro da entrega não é leitura: registra entrega, e versão entregue e nunca aplicada
não deixa congelado nenhum.

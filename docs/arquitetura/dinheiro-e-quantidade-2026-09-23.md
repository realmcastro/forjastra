# Dinheiro e quantidade: tipo, unidade e escala

> **Status: PROPOSTA.** Nada aqui está decidido. Quem decide é o thread principal, por delegação do
> humano de 2026-09-23, depois de ler este arquivo e a consulta do `backend` (E.2). O registro em
> `db/convencoes.md` vai no brief de T-H.
> Autor: `arquiteto-dados` · T-0018 passo E.1 · item `SPR-40` · 2026-09-23.

## 0. O que isto decide e o que não toca

Decide o **tipo de coluna**, a **unidade** e a **escala** de dois grupos de valor: dinheiro (valor
devido, pago, rateado, movimentado) e quantidade (quanto do item, na unidade dele). Diz também como o
valor atravessa banco, driver, backend, JSON e terminal, e onde a regra de rateio se encaixa.

| Fora | Dono |
|---|---|
| Destino do centavo sobrante, modo de arredondamento, ordem de aplicação | `produto` + humano + contador: `G-09`, `LACUNA-NUC-004` (T-0014, em paralelo) |
| Moeda do cliente ou do estabelecimento | `produto`: `LACUNA-NUC-041` (em paralelo). A §8 dá as duas saídas |
| Casas e tolerância de quantidade medida por instrumento | humano: `LACUNA-PER-2` (`docs/produto/modulos/perifericos.md:292`) |
| Imposto, base de cálculo, gorjeta | `produto`, `FIS` (fora de escopo do item) |
| Representação exata na rede | `backend` (E.2). A §6 dá as restrições medidas |
| Qualquer migration | T-H e T-I. Nenhuma DDL deste arquivo é migration |

## 1. Entradas que a escolha tem que respeitar

- **`dados.md` §3**: dinheiro é inteiro em menor unidade **ou** `numeric(14,2)`, uma escolha para todo
  o sistema; nunca ponto flutuante. Quantidade é `numeric` com escala declarada; `integer` bloqueia
  vertical.
- **`RN-OFF-020`** (`docs/produto/operacao-offline-e-sincronizacao.md:109`) e **`RN-NUC-015`**
  (`docs/produto/nucleo-publicacao-e-texto.md:131`): offline o **terminal compõe o valor devido**
  aplicando artefato publicado, e na volta o servidor **não recalcula**. Consequência para este
  documento: a mesma aritmética roda em dois lugares, servidor e terminal, e precisa dar o mesmo
  centavo nos dois.
- **`RN-NUC-013`** (`docs/produto/nucleo-publicacao-e-texto.md:27`): a unidade de medida com casas
  declaradas é artefato publicado; "precisão e arredondamento da composição do valor" também, com a
  versão congelada no fato (linha `:46`, `LACUNA-NUC-004`).
- **`RN-PER-018`** (`docs/produto/modulos/perifericos-classes.md:191`): o periférico não arredonda,
  porque um segundo lugar decidindo cobrança é o lugar mais difícil de auditar. O banco também é um
  segundo lugar; ver §2.1.
- **`docs/produto/nucleo-venda.md:36`**: spec de produto não afirma casas decimais concretas. Os
  números de escala abaixo vêm de `dados.md` §3 e do item `SPR-40`, não de `RN`.

## 2. O que foi medido

PostgreSQL 16.15 em container local, máquina de desenvolvimento, uma execução por medida salvo quando
indicado. Driver `pg` 8.23.0 com `pg-types` 2.2.0, os instalados em `apps/api/node_modules`; Node
22.23.1. A ordem entre candidatos vale; o valor absoluto não é o de produção.

### 2.1 Semântica de entrada

| Entrada | Resultado |
|---|---|
| `'17.925'::numeric(14,2)` | **`17.93`, sem erro.** `17.915` vira `17.92`, `-17.925` vira `-17.93`: metade para longe do zero |
| `'17.925'::bigint` | erro `invalid input syntax for type bigint` |
| `numeric` sem modificador com `CHECK (min_scale(v) <= 2)`, valor `17.925` | recusado pela constraint |
| o mesmo `CHECK` escrito com `scale(v)`, valor `17.900` | **recusado**: `scale()` conta zero à direita. `min_scale()` aceita `17.900` e `17` |
| `'1000000000000.00'::numeric(14,2)` | erro `numeric field overflow` (teto `< 10^12`) |
| `sum()` de `bigint`, de `integer`, de `numeric` | `numeric`, `bigint`, `numeric`. `avg()` de `bigint`: `numeric` |

O primeiro resultado decide mais do que parece. Com `numeric(14,2)`, um valor calculado com casa a
mais é **arredondado pelo banco**, com a regra do banco, antes de qualquer `CHECK` enxergar. Se `G-09`
fechar em arredondamento bancário (metade para o par), o banco aplica outra regra em silêncio sempre
que alguém gravar valor não normalizado. Nenhum sintoma aparece.

### 2.2 Custo de mudar depois: o que reescreve a tabela

`ALTER COLUMN ... TYPE` sobre tabela com índice, comparando `relfilenode` antes e depois:

| Mudança | Tabela | Índice |
|---|---|---|
| `numeric(14,2)` → `numeric(18,2)` (mais precisão, mesma escala) | intacta | intacto |
| `numeric(14,2)` → `numeric` sem modificador | intacta | intacto |
| `numeric(14,3)` → `numeric(18,3)` | intacta | intacto |
| `numeric(14,2)` → `numeric(14,3)` ou `numeric(16,3)` (mais escala) | **reescrita** | |
| `numeric(14,3)` → `numeric(15,4)` | **reescrita** | |
| `numeric` → `numeric(14,2)` | **reescrita** | |
| `numeric(14,2)` → domínio sobre `numeric` | **reescrita** | |
| `integer` → `bigint` · `bigint` → `numeric(18,2)` · `bigint` → `numeric` | **reescrita** | |
| envelope em domínio: `ALTER DOMAIN ... ADD CONSTRAINT ... NOT VALID` + `VALIDATE` | intacta | |

"Intacta" ainda pega lock exclusivo curto no `ALTER`; o lock do `VALIDATE` de domínio não foi medido.
A linha `bigint` → `numeric` subestima o custo real: sair de centavos para reais muda o **significado**
do número (divide por 100), e isso não é troca de tipo, é coluna nova com backfill, o ciclo completo de
`migrations.md` §4 em N schemas.

### 2.3 Tamanho e agregação

Linha no formato de item de venda (`uuid`, quantidade `numeric(14,3)`, preço, valor e desconto), 2M
linhas, preço entre R$ 1,00 e R$ 200,99:

| Dinheiro como | Tabela | Bytes por linha | Bytes médios do valor | `sum()` de 2 colunas, 1 worker, 3 execuções |
|---|---:|---:|---:|---|
| `bigint` centavos | 146 MB | 76,6 | 8,0 | 276 · 275 · 266 ms |
| `numeric(14,2)` | 145 MB | 75,9 | 7,0 | 443 · 410 · 410 ms |

Espaço empata: `numeric` é variável e fica abaixo de 8 bytes na faixa de valor de PDV. A soma em
`numeric` custa cerca de 1,5 vez a de `bigint`. As duas somas conferem ao centavo.

Inserção em bloco de 2M linhas (valor e quantidade), tabela `unlogged`, execuções 2 e 3:
`numeric(14,2)` com modificador 1.595 e 1.573 ms; `numeric` com `CHECK (min_scale ...)` 1.882 e
1.958 ms. O `CHECK` custa por volta de 0,16 µs por linha; no caixa, que grava uma venda por vez, isso
não aparece.

### 2.4 Driver e JavaScript

| Caso | Chega no Node como |
|---|---|
| coluna `bigint` · `sum()` · `count(*)` | `string` (`"1234"`) |
| coluna `numeric` ou domínio sobre `numeric` (OID 1700) | `string`, com a escala gravada (`"12.30"`) |
| `array[...]::numeric[]` · `array_agg(numeric)` | **`number`**: `pg-types` registra o OID 1231 com `parseFloat` (`textParsers.js:189`) |
| `array_agg(bigint)` | `string` |
| `to_json(90071992547409.93::numeric)` montado no SQL | `number` `90071992547409.94`: **perdeu o centavo** no `JSON.parse` do driver |
| `JSON.stringify({ v: 10n })` | `TypeError`: `BigInt` não serializa sem conversão explícita |
| `Number.MAX_SAFE_INTEGER` | 9.007.199.254.740.991, ou R$ 90 trilhões se a unidade for centavo |
| `1.005 * 100` · `0.1 + 0.2` | `100.49999999999999` · `0.30000000000000004` |

A vantagem que se costuma atribuir ao inteiro na fronteira ("chega como número, sem conversão") não
existe com este driver: `bigint` chega como `string`, igual a `numeric`. O backend converte nos dois
casos.

## 3. Dinheiro: as saídas, em ordem de custo de reversão

Aplicando [[convention-o-caro-e-o-tipo-da-chave-nao-a-geracao]]: primeiro o que custa desfazer,
depois o desempenho. Da mais barata de reverter para a mais cara.

| # | Saída | Se estiver errada, desfazer custa |
|---|---|---|
| **M2b** | `numeric` sem modificador, envelope em **domínio** por schema (`money_amount`: `min_scale(value) <= 2`, `abs(value) < 10^12`), valor em unidade **maior** da moeda | trocar constraint do domínio, sem reescrita (§2.2). Voltar para `numeric(14,2)` reescreve |
| **M2** | `numeric(14,2)`, valor em unidade maior | mais precisão: metadado. Mais escala: tirar o modificador também é metadado, e isso leva a M2b sem o domínio; ir para domínio reescreve |
| **M1** | `bigint` em menor unidade (centavos) | fração de centavo, ou moeda com outro expoente sem dado de expoente: coluna nova com outro significado, backfill em lotes, expand/contract nas quatro etapas, em N schemas |

**O que cada uma entrega e o que perde:**

| | Ganha | Perde |
|---|---|---|
| **M2b** | banco **recusa** casa a mais em vez de arredondar (§2.1); a convenção vive num objeto só por schema, e coluna nenhuma escolhe escala própria; afrouxar envelope é trocar constraint | soma ~1,5 vez `bigint`; `CREATE DOMAIN` não tem `IF NOT EXISTS`, então a migration precisa de guarda de existência; a escala gravada segue a da entrada (`17.9` e `17.90` são o mesmo valor com textos diferentes), então o backend grava forma canônica |
| **M2** | tipo declara o envelope sozinho; escala de saída uniforme; forma mais conhecida | **arredonda em silêncio** com regra do banco (§2.1); cada coluna repete `(14,2)` e nada impede a próxima de nascer `(12,3)`; migrar para domínio depois reescreve |
| **M1** | soma mais rápida; banco recusa fração; valor inteiro facilita comparar | o número sozinho não diz o valor, depende do expoente da moeda; preço com fração de centavo não cabe (§5); consulta de suporte lê `1792` como R$ 1.792; e a vantagem na fronteira do driver não existe (§2.4) |

A exatidão empata entre as três, e é por um motivo que vale a pena escrever: em nenhuma delas o
backend faz conta com `number`. Ele converte a `string` do driver para inteiro escalado (`BigInt`) e
faz aritmética inteira (§6). O tipo do banco decide o que o banco recusa, quanto custa mudar e como a
coluna se lê; não decide se a conta sai certa.

## 4. Quantidade: a escala pela vertical mais exigente conhecida

| Vertical e caso | Unidade | Casas | Fonte |
|---|---|---|---|
| Roupa (`dois-varejos-corpo-de-prova-2026-09-11.md:39`) | unidade | 0 | corpo de prova |
| Restaurante, hambúrguer | unidade | 0 | item `SPR-40` |
| Restaurante, meia porção, 300 g (`verticais/restaurante.md:171`) | kg | fracionária | spec de vertical, sem número |
| Polpa na balança, 0,750 kg (`dois-varejos-corpo-de-prova-2026-09-11.md:39`) | kg | 3 no exemplo | corpo de prova |
| Arroz a granel | kg | 2 no item, 3 em `dados.md` §3 | as duas fontes divergem |
| Combustível | litro | 3 | item `SPR-40` e `dados.md` §3 |

**A mais exigente conhecida é 3 casas**, e duas verticais chegam a ela por caminhos independentes
(balança e bomba). A divergência do granel (2 no item, 3 na regra) se resolve sozinha: o envelope é 3,
e 2 é o que a **unidade** declara, se for isso.

**Duas coisas diferentes, e o erro caro é tratá-las como uma:**

1. **Envelope da coluna**: o máximo que o banco aceita, igual para todo o sistema. Proposta: domínio
   `quantity_value` sobre `numeric`, `min_scale(value) <= 3`, `abs(value) < 10^11`. O teto de 10^11 é
   proposta minha, equivalente ao `numeric(14,3)`, e sai barato de mudar pelo mesmo mecanismo.
2. **Casas declaradas da unidade de medida**: dado publicado (`RN-NUC-013`), de 0 a 3, por unidade. O
   backend recusa quantidade com mais casas que a unidade do item declara, com motivo, e nunca
   arredonda "para ajudar" (`RN-PER-018`, infeliz).

Uma escala por classe de produto em colunas diferentes está recusada: é a "convenção local de tabela"
que o critério de conclusão do item proíbe, e soma de quantidade entre classes deixaria de ser uma
coluna só.

**Opção para T-H, não decidida aqui:** a linha do item congela a escala declarada
(`quantity_scale smallint`) e carrega `CHECK (min_scale(quantity) <= quantity_scale)`. Com isso a casa
declarada deixa de depender só do backend lembrar, e a linha passa a dizer sozinha com que precisão foi
vendida. `RN-NUC-013` já manda congelar a versão da unidade publicada; esta coluna seria a forma
estrutural disso, e não um fato novo. Quem decide se é redundância com a versão congelada é T-H.

**O que ainda pode subir o envelope para 4 casas, sem fonte hoje:** exigência de instrumento de
medida ou de documento fiscal sobre casas de quantidade (`LACUNA-PER-2`, norma não confirmada). Se
existir, o envelope sobe por troca de constraint (§2.2), sem reescrita. É o argumento para o envelope
estar em domínio e não em modificador: com `numeric(14,3)`, ir para 4 casas reescreve a maior tabela de
fato do sistema em cada schema.

## 5. Preço unitário é outra família de valor

Valor devido, pago e rateado nunca tem fração de centavo: ninguém paga R$ 0,001. Preço unitário é
tarifa, e o resultado dele só vira dinheiro depois de multiplicado pela quantidade e arredondado.

**Hipótese de ramo, sem fonte no repositório:** preço de combustível por litro publicado com 3 casas
(R$ 6,299/L). Não está em `docs/produto/**` nem em dossiê com URL, então não entra como fato. Se for
confirmado, M1 não o representa em centavos, e seria preciso um segundo inteiro com outro expoente, que
é exatamente a convenção local que o item proíbe.

**Proposta:** dois domínios desde o primeiro DDL, `money_amount` e `unit_price`, com o **mesmo**
envelope hoje (escala 2). Separar agora não custa nada; juntar depois é grátis, porque os dois são
`numeric`; separar depois reescreve cada coluna de preço. Se a hipótese se confirmar, só `unit_price`
troca de constraint.

## 6. Como o valor atravessa as fronteiras

```
coluna numeric (domínio)
→ driver: string com a escala gravada        ("17.90", "0.750")
→ backend: inteiro escalado em BigInt        (1790n na escala 2, 750n na escala 3)
   · recusa casa a mais, nunca arredonda na leitura
   · toda conta é inteira; divisão só pela função de arredondamento versionada (§7)
→ rede: string decimal canônica, escala exata ("17.90")
→ terminal: formata para exibir; offline, compõe com o mesmo módulo de ponto fixo (RN-OFF-020)
```

Nenhuma biblioteca decimal é necessária: `BigInt` é nativo no Node e no navegador. A conta verificada
em Node, com funções de 20 linhas:

| Caso | Exato | Metade para cima | Metade para o par |
|---|---|---|---|
| polpa, 0,750 kg × R$ 23,90/kg | 17,925 | **17,93** | **17,92** |
| combustível, 37,512 L × R$ 6,299/L (hipótese da §5) | 236,288088 | 236,29 | 236,29 |
| roupa, 2 un × R$ 89,90 | 179,80 | 179,80 | 179,80 |

O caso da polpa mostra por que o modo de arredondamento é de `G-09`/`LACUNA-NUC-004` e não pode ficar
com o banco: as duas regras dão centavos diferentes para a mesma venda.

**Restrições para E.2, vindas de §2.1 e §2.4:**

- Quantidade **nunca** trafega como número JSON: é fracionária, e `JSON.parse` a converte em `float`.
- Dinheiro como número JSON só seria exato em M1, até R$ 90 trilhões por valor. Como o driver entrega
  `string` e `BigInt` não serializa sem conversão, M1 não economiza conversão nenhuma.
- **Proibido montar JSON de valor dentro do SQL** (`to_json`, `json_agg`, `json_build_object`): o
  driver faz `JSON.parse` e o centavo se perde (medido). O JSON sai do backend, a partir da `string`.
- **Proibido ler `numeric[]` com o parser padrão** (`array_agg` de valor): chega como `float`. Ou a
  consulta não agrega em array, ou o parser do OID 1231 é trocado, e isso é decisão do `backend`.
- `Number(...)`, `parseFloat` e operador aritmético sobre valor monetário ou quantidade são defeito no
  backend e no terminal. O cliente exibe e coleta (`ui.md` §4); quando compõe offline, usa o módulo de
  ponto fixo e nada mais.
- Conta de valor dentro do `INSERT` (`quantity * unit_price` no SQL) está recusada: com M2 o banco
  arredondaria em silêncio pela regra dele; com M2b recusaria, e a venda pararia no caixa.

**Pergunta de território que isto abre:** o módulo de ponto fixo roda no servidor **e** no terminal,
e precisa ser o mesmo código para dar o mesmo centavo nos dois. `packages/**` fora de `packages/sdui`
continua fechado (`CLAUDE.md` §2). Onde ele mora é decisão do thread.

## 7. Rateio com resto: o caso e o ponto de encaixe

Desconto de R$ 10,00 na venda, rateado proporcionalmente entre três linhas de R$ 7,00, R$ 5,00 e
R$ 3,00 (total R$ 15,00). Conta inteira, em centavos, conferida em Node:

```
parte exata = 1000 × valor_da_linha / 1500
linha 1: 700000 / 1500 = 466, resto 1000
linha 2: 500000 / 1500 = 333, resto  500
linha 3: 300000 / 1500 = 200, resto    0
soma dos pisos = 999  →  sobra 1 centavo
```

| Destino do centavo (`G-09`) | Linha 1 | Linha 2 | Linha 3 | Soma |
|---|---:|---:|---:|---:|
| maior resto | 4,67 | 3,33 | 2,00 | 10,00 |
| maior valor de linha | 4,67 | 3,33 | 2,00 | 10,00 |
| última linha | 4,66 | 3,33 | **2,01** | 10,00 |

Casos-limite, também conferidos: R$ 10,00 em três linhas iguais pelo maior resto dá 3,34 / 3,33 / 3,33
e depende de regra de **empate**; R$ 0,01 em três linhas iguais deixa duas linhas com desconto zero.
Arredondar por linha e somar não é o mesmo que somar e arredondar: três linhas de polpa (17,925 cada)
dão R$ 53,79 no primeiro caso e R$ 53,78 no segundo, com metade para cima.

**O que `G-09` precisa responder, para este encaixe funcionar:** modo de arredondamento; arredondar
por linha ou no total; destino do centavo; regra de empate. Nada disso muda tipo de coluna.

**O que o modelo garante, independente da resposta:**

- Cada parte rateada é **gravada** na linha, em `money_amount`, e nunca recalculada na leitura.
  Recalcular com a regra de hoje uma venda feita com a regra de ontem produz outro centavo.
- A versão da regra de composição aplicada é congelada no fato (`RN-NUC-013`, `:46`). A coluna exata é
  de T-H.
- A soma das partes igual ao total rateado é invariante entre linhas, e `CHECK` não soma linhas. Ela
  vive na função de rateio do backend, com teste de propriedade, e na verificação de conferência.
  Gatilho para isso seria regra de negócio no banco sem `decision` (`backend.md`, Nunca).

## 8. Moeda: as duas saídas de `LACUNA-NUC-041`

Nas duas, **nenhuma coluna de moeda ao lado de cada valor**. Moeda é contexto do fato, não atributo de
cada número. E nas duas existe um domínio fechado de moeda como tabela de lookup por schema (código
ISO 4217 estável e o expoente da menor unidade), semeada com `ON CONFLICT DO NOTHING`, conforme
`dados.md` §3.

| | **A: moeda do cliente** | **B: moeda do estabelecimento** |
|---|---|---|
| Onde mora | registro do cliente (e publicado ao terminal como configuração) | atributo datado do estabelecimento, publicado com vigência |
| O fato de venda | não carrega moeda: ela é constante no schema | congela a versão da configuração (`RN-NUC-013` já exige); recomendo **também** `currency_code` no cabeçalho da venda, nunca na linha |
| Por que a coluna no cabeçalho em B | | relatório que soma estabelecimentos precisa agrupar por moeda sem juntar versão de configuração por venda; sem ela, soma de duas moedas sai como um número só, sem erro |
| Se a decisão virar depois | de A para B: `ADD COLUMN` nulável no cabeçalho, e o backfill é exato, porque todo histórico tem a moeda única do cliente. Nada se perde | de B para A: a coluna fica, inerte e correta |
| Envelope de escala | 2 serve BRL; moeda de expoente 3 exige trocar constraint do domínio | idem |
| Agregado no `platform` (`D-06`) | agrupa por moeda do cliente | agrupa por moeda da linha agregada |

A assimetria da última coluna é o que importa: **não registrar a moeda por venda em A não perde
nada**, porque o histórico é recuperável com certeza. Em B, a coluna no cabeçalho custa 4 bytes por
venda e evita a soma silenciosa de moedas.

## 9. As cinco perguntas de `dados.md` §6

**1. Outro ramo, outro fuso?** Ramo: o envelope de 3 casas cobre bomba e balança, e unidade usa 0 por
dado, não por tipo; nada aqui tem palavra de vertical. Ramo novo que exija 4 casas troca constraint do
domínio. Fuso: dinheiro e quantidade não carregam calendário. A única ligação com o fuso é indireta:
"vendas de hoje" soma valores numa janela de `occurred_at`, que já é de `D-04`.

**2. Que consulta fica cara, e que índice ela pede?** Soma de valor em período longo: `numeric` custa
~1,5 vez `bigint` (medido, §2.3). O índice que ela pede é o de `occurred_at`, não o do valor; filtro
por faixa de valor não existe em tela quente conhecida. O caso caro de verdade é relatório que
**recalcula** valor de linha a partir de quantidade × preço: fica caro e sai errado. Está proibido
(§7). Período fechado sai de agregado materializado
([[decision-agregado-de-periodo-fechado-nao-e-cache]]), e aí a diferença de soma sai do caminho quente.

**3. Que coluna eu vou querer mudar em 6 meses?** O envelope de `unit_price`, se a hipótese do
combustível (§5) se confirmar, e o de `quantity_value`, se `LACUNA-PER-2` trouxer exigência de 4 casas.
Estão certos hoje porque refletem o máximo **conhecido**, e o mecanismo foi escolhido para que mudar
seja troca de constraint e não reescrita. Terceira candidata: `currency_code` no cabeçalho, se
`LACUNA-NUC-041` fechar em A e a coluna já tiver nascido; ela fica, inerte.

**4. Existe caminho em que uma consulta veja dado de outro cliente?** Não por esta convenção: domínio e
lookup de moeda nascem **em cada** schema de cliente, sem referência ao `platform` nem a outro schema.
Dois pontos laterais: agregado no `platform` carrega cliente **e** moeda, senão soma moedas de clientes
diferentes; e a versão da regra de arredondamento é publicação **do cliente**, não global, então o
centavo de um cliente não muda por decisão tomada para outro.

**5. Cardinalidade em 2 anos?** Não tenho vendas por dia por estabelecimento; a pergunta já está com o
humano desde `db/convencoes.md` §5. Faixas, para a linha de item:

| Linhas | O que muda |
|---|---|
| até ~10⁶ | nada; a diferença de soma é ruído |
| ~10⁷ | soma de período longo em `numeric` passa de centenas de ms; agregado de período fechado deixa de ser opcional para relatório |
| ~10⁸ a 10⁹ | ESTIMATIVA pela proporção medida (75,9 bytes por linha): 7 a 70 GB por schema. Particionamento por `occurred_at` entra; trocar tipo de valor aqui é impraticável, e é por isso que o envelope precisa ser mutável sem reescrita desde o primeiro DDL |

## 10. Recomendação

**Recomendo M2b:** dinheiro, preço unitário e quantidade em `numeric` sem modificador, com o envelope
em três domínios por schema (`money_amount` escala 2, `unit_price` escala 2, `quantity_value` escala
3), valor em unidade maior da moeda, aritmética de ponto fixo em `BigInt` no backend e no terminal,
string decimal canônica na rede. Nenhuma dependência nova.

M2 (`numeric(14,2)`) é a segunda escolha aceitável: não fecha M2b, porque tirar o modificador é
metadado (§2.2). Mas deixa o banco arredondando em silêncio até alguém fazer isso, e migrar para
domínio depois reescreve.

**Recusa de M1 (inteiro em centavos), nas quatro partes:**

1. **Necessidade, que fica inteira:** dinheiro exato, soma sem erro, fração de centavo impossível onde
   ela não existe, e conta rápida.
2. **Mecanismo recusado e por que é ruim:** `bigint` em menor unidade. O número só vira valor com o
   expoente da moeda ao lado; preço unitário com fração de centavo não cabe; corrigir qualquer das
   duas muda o significado da coluna e vira expand/contract com backfill em N schemas (§2.2). A
   vantagem na fronteira, que é o argumento usual, não existe com este driver (§2.4).
3. **Mecanismo novo:** `numeric` com envelope em domínio, mais aritmética inteira em `BigInt` no
   backend (§6).
4. **Por que é melhor, e como se prova:** a exatidão é a mesma, porque a conta é inteira nos dois
   (§6, casos verificados); o banco recusa fração excedente em vez de aceitá-la (§2.1, `17.925`
   recusado); o valor se lê como é em consulta e em documento fiscal; e o envelope muda sem reescrita
   (§2.2, tabela intacta). O custo aceito é a soma ~1,5 vez mais lenta (410 contra 270 ms em 2M × 2
   colunas), em leitura agregada e fora do caminho do caixa.

**Recusa de M2 como primeira escolha, nas quatro partes:**

1. **Necessidade:** envelope de escala declarado e visível, igual para todo o sistema.
2. **Mecanismo recusado:** modificador `(14,2)` em cada coluna. Ele arredonda casa excedente com a
   regra do banco, antes de qualquer `CHECK` (§2.1), e repete o envelope em cada coluna, onde nada
   impede a próxima de nascer diferente.
3. **Mecanismo novo:** domínio por schema, com o envelope em constraint.
4. **Por que é melhor:** o banco recusa em vez de decidir o centavo, o que é a mesma razão pela qual
   `RN-PER-018` tira o arredondamento do periférico; a convenção existe em um objeto por schema; e o
   mecanismo de mudança medido não reescreve tabela. Prova: `17.925` e `0.7505` recusados pelo domínio,
   `17.900` aceito, constraint afrouxada com a tabela intacta (§2.1, §2.2).

## 11. Ilustração (não é migration)

```sql
-- Forma, não arquivo. A migration real (T-H) guarda a existência, porque CREATE DOMAIN não tem
-- IF NOT EXISTS, e declara lock_timeout, alvo e transacionalidade como migrations.md §7 exige.
CREATE DOMAIN t_example.money_amount AS numeric
  CHECK (min_scale(VALUE) <= 2 AND abs(VALUE) < 1e12);
CREATE DOMAIN t_example.unit_price AS numeric
  CHECK (min_scale(VALUE) <= 2 AND abs(VALUE) < 1e12);
CREATE DOMAIN t_example.quantity_value AS numeric
  CHECK (min_scale(VALUE) <= 3 AND abs(VALUE) < 1e11);
```

Sinal (valor positivo, quantidade maior que zero) é `CHECK` de cada tabela, não do domínio: devolução
é linha nova com valor positivo (`dados.md` §4), e isso é desenho de T-H.

## Referências

`.claude/rules/dados.md` §3 e §6 · `.claude/rules/migrations.md` §4, §5, §7 · `db/convencoes.md` §5 ·
`docs/backlog/SPR-40-fechar-tipo-unidade-e-escala-de-dinheiro-e-de-quantidade.md` ·
`docs/produto/backlog-lacunas-g01-g09.md:37` (`G-09`) · `docs/produto/nucleo-estabelecimento.md:168`
(`LACUNA-NUC-041`) · `docs/produto/nucleo-venda.md:362` (`LACUNA-NUC-004`) ·
`docs/produto/modulos/perifericos.md:292` (`LACUNA-PER-2`) ·
`memory/plataforma/convention-o-caro-e-o-tipo-da-chave-nao-a-geracao.md` ·
`memory/plataforma/gotcha-moeda-viajou-na-parentese-do-fuso.md` ·
`apps/api/node_modules/pg-types/lib/textParsers.js:167` e `:189`

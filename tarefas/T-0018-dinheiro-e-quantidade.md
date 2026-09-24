---
id: T-0018
backlog: SPR-40
titulo: Fechar tipo, unidade e escala de dinheiro e de quantidade
status: fechada
escopo: cliente=- vertical=- modulo=- camada=dados+backend
aberta_em: 2026-09-23
---

## Pedido

"Cara, sobre as decisões, você faz o que for melhor para a escalabilidade. A lacuna de periféricos
precisa nascer, pois então que ela nasça. A gente vai fazer a base e bem feita. O que não tiver ao seu
alcance, você vai continuando o restante e coloca um aviso claro lá na hora da, do módulo tal coisa não
funciona porque precisa de tal coisa." (humano, 2026-09-23)

Regra de trabalho que saiu disso: [[convention-decisao-delegada-com-aviso-no-modulo]]. Plano da base
inteiro, com as ondas, no relatório do `orquestrador` de 2026-09-23; aqui entra só a parte desta ficha.

## Plano

## PLANO: T-E (T-0018), SPR-40 dinheiro e quantidade
BACKLOG: SPR-40
ESCOPO: tipo, unidade e escala de dinheiro e de quantidade, e como elas atravessam banco, API (JSON) e TypeScript; o caso de rateio com resto.
FORA DE ESCOPO: imposto e base de cálculo; adicionar dependência (se a proposta pedir biblioteca decimal, é `BLOQUEIO` para o thread decidir).
ESCOPO DE MEMÓRIA: camada=dados+backend
DECISÕES ABERTAS QUE TOCAM ISSO: `G-09` rateio (A.2a).
PASSOS:
1. E.1 `arquiteto-dados`
   - **Brief:** proposta com as duas saídas (centavos inteiros × `numeric(14,2)`) e a escala de quantidade pela vertical mais exigente **conhecida**, ordenadas por custo de reversão ([[convention-o-caro-e-o-tipo-da-chave-nao-a-geracao]]). As cinco perguntas de `dados.md` §6.
   - Só lê `db/**`.
   - **Entrega:** `docs/arquitetura/dinheiro-e-quantidade-2026-09-23.md`.
   - Onda 1, paralelo.
2. E.2 `backend` (consulta)
   - **Brief:** representação na fronteira JSON/TS de cada saída (limite de inteiro seguro, string decimal) e o que o cliente nunca faz com o valor.
   - **Entrega:** no máximo 10 linhas.
   - Depende de E.1.
3. **Thread: decisão**, na ficha. Fechamento: `decision` em `plataforma/`, e o caso de rateio usando a regra de A.2a.
   - Depende de E.2 e de A.2a.
   - O registro em `db/convencoes.md` vai no brief de T-H.
GATES: nenhum agora. A DDL passa pelo gate 2 em T-H e T-I.
RISCO PRINCIPAL: escolher a escala pela primeira vertical.

## Decisão do thread — 2026-09-23

Adotada a M2b, com uma alteração: `unit_price` tem envelope de **3** casas (e não 2), porque
combustível é vertical conhecida e alargar domínio agora custa zero. A consulta do `backend` confirmou
os quatro pontos e acrescentou duas regras (valor em `jsonb` como string; nenhum `setTypeParser`
global), e a escala exata também na entrada, pela comparação idempotente byte a byte.

Onde mora o ponto fixo: **`packages/contracts/`**, aberto para ele pela mesma leitura que abriu
`packages/sdui` (o módulo não depende do modelo de venda nem do contrato de rota). O humano delegou a
pergunta do `backend` em 2026-09-23. Recusado: nascer em `apps/api/src/` e mudar depois. A mudança seria
mecânica, mas enquanto durasse, o terminal teria de copiar o código ou esperar por ele, e cópia está
proibida.

A dependência de `G-09` saiu do caminho: o modo de arredondamento é parâmetro explícito e versionado do
módulo, e a regra de composição é artefato publicado pelo `owner` (inventário A.1, B1). Nenhum modo é
escolhido aqui.

## Fechamento — 2026-09-23

ENTREGUE: decisão de tipo, unidade e escala de dinheiro, preço e quantidade, e da representação na
rede; lugar do módulo de ponto fixo decidido.
ARQUIVOS: `docs/arquitetura/dinheiro-e-quantidade-2026-09-23.md`;
`memory/plataforma/decision-dinheiro-e-quantidade.md`; três gotchas em `memory/plataforma/`
(`gotcha-typmod-numeric-arredonda-em-silencio`, `gotcha-numeric-em-json-e-array-vira-float-no-driver`,
`gotcha-envelope-de-escala-usa-min-scale`); `CLAUDE.md` §2 (abertura de `packages/contracts/`).
VERIFICAÇÃO: as medidas são do E.1 (PostgreSQL 16.15 descartável; driver `pg` instalado; Node 22 com
`BigInt`). O thread não rodou nada além de ler.
PRONTO:
- Regra de negócio: não se aplica (é convenção técnica; o arredondamento é `G-09`, de `T-0014`).
- Teste: não se aplica (não houve código). O módulo nasce com teste na tarefa que o implementa.
- DDL e gate 2: não se aplica aqui. A primeira DDL com estes domínios é `F-021`, com gate próprio.
- Decisão registrada: sim, `decision-dinheiro-e-quantidade`, com a linha no índice.
- Memória sugerida: as três gotchas do E.1 foram escritas, e a do E.2 (`jsonb`) foi fundida na segunda.
  A `decision` sugerida foi escrita.
- Segredo: nenhum.
- Ficha com plano, relatórios verbatim e fechamento: sim.
SOBROU:
- `.claude/rules/dados.md` §3 ainda diz "centavos ou `numeric(14,2)`". Precisa de edição pelo humano ou
  de permissão, porque a escrita em `.claude/**` foi negada em 2026-09-23.
- Implementar o módulo de ponto fixo em `packages/contracts/` (`backend`), com item de backlog novo,
  depois de `F-016` liberar a numeração.
- Envelope de total de muitos anos no agregado do `platform` (`D-06`(i)) e moeda nele, fora daqui.
- Perguntas ao `produto`: granel com 2 ou 3 casas por unidade (o envelope cobre os dois), e arredonda
  por linha ou no total (`G-09`, com `T-0014`).

## arquiteto-dados — 2026-09-23 (E.1, proposta)

## RELATÓRIO — arquiteto-dados — T-0018 (E.1)
STATUS: OK

FEITO:
- Escrevi a proposta de tipo, unidade e escala de dinheiro, preço unitário e quantidade. As saídas estão ordenadas por custo de reversão, e cada custo foi medido em Postgres 16.15, num container meu que já foi removido.
- Medi quatro coisas. (1) O que cada tipo faz com casa decimal a mais na entrada. (2) Quais mudanças de tipo reescrevem a tabela, comparando `relfilenode` de tabela e de índice antes e depois. (3) Tamanho e custo de `sum()` em 2M linhas. (4) O que o `pg` 8.23.0 / `pg-types` 2.2.0 instalados em `apps/api` devolvem ao Node.
- Conferi em Node, com `BigInt` nativo, três contas: quantidade × preço (polpa, combustível, roupa), o rateio com resto em três políticas e os casos-limite (empate e R$ 0,01).
- Deixei o ponto de encaixe de `G-09` (§7) e as duas saídas de `LACUNA-NUC-041` (§8).

ARQUIVOS:
- /home/mcastro/work/freelas/forja/docs/arquitetura/dinheiro-e-quantidade-2026-09-23.md (novo, 398 linhas: abaixo do teto, mas perto dele)
- Só leitura: db/convencoes.md, a ficha T-0018, o item SPR-40, docs/produto/{backlog-lacunas-g01-g09, nucleo-estabelecimento, nucleo-publicacao-e-texto, operacao-offline-e-sincronizacao, dois-varejos-*, receitas-por-vertical, fronteira-do-nucleo, glossario, modulos/perifericos*, catalogo-de-modulos}.md, apps/api/node_modules/pg-types/lib/textParsers.js

NÃO FEITO: —

DECISÕES:
- **Recomendação: M2b.** É `numeric` sem modificador, com o limite de escala e de tamanho (o "envelope") escrito num domínio por schema. São três domínios: `money_amount` (escala ≤ 2, |v| < 10^12), `unit_price` (escala ≤ 2) e `quantity_value` (escala ≤ 3, |v| < 10^11). O valor fica em unidade maior da moeda. A conta é feita em ponto fixo com `BigInt`, e o valor viaja na rede como string decimal.
  - Isso diverge do texto literal de `dados.md` §3 ("`numeric(14,2)`"). O texto da regra é do thread.
  - M2 (`numeric(14,2)`) continua aceitável. Não fecha M2b, porque tirar o modificador é só metadado (medido). O defeito dela: o banco arredonda em silêncio `17.925` para `17.93` (metade para longe do zero), passando por cima de qualquer regra de `G-09`.
  - M1 (centavos em `bigint`) está recusada nas quatro partes (§10). Sair dela depois muda o significado da coluna, o que vira expand/contract com backfill em N schemas. E a vantagem que ela teria na fronteira não existe com este driver: `bigint` também chega como `string`.
  - Custo aceito: `sum()` em `numeric` fica cerca de 1,5× mais lento (410 contra 270 ms, 2M linhas × 2 colunas). O espaço empata (145 contra 146 MB).
- **Quantidade: 3 casas**, pela balança e pela bomba. O envelope da coluna (3) é diferente das casas declaradas por unidade, que são dado publicado entre 0 e 3. O backend recusa quantidade com casa a mais, nunca arredonda.
  - A escala por classe de produto está recusada.
  - Deixo para T-H uma opção sem decidir: a linha do item guardar `quantity_scale` junto com um `CHECK`.
- **Preço unitário separado de valor desde o primeiro DDL**, com o mesmo envelope hoje. Separar agora custa zero; separar depois reescreve cada coluna de preço.
- **Nenhuma biblioteca decimal é necessária**, por isso não há BLOQUEIO. Se o `backend` (E.2) quiser uma por ergonomia, aí vira BLOQUEIO.
- **Moeda:** nas duas saídas, nenhuma coluna de moeda ao lado de cada valor. Na saída B (moeda do estabelecimento), recomendo `currency_code` no cabeçalho da venda, para que uma soma não misture duas moedas sem erro. Na saída A não é preciso: o histórico se recupera com certeza.

RISCOS:
- Gotchas medidos, que valem para qualquer escolha:
  - `numeric[]` e `array_agg(numeric)` chegam ao Node como `float`, porque o `pg-types` trata o OID 1231 com `parseFloat` (`textParsers.js:189`).
  - `to_json`/`json_agg` de valor montado dentro do SQL perde centavo no `JSON.parse` do driver: `90071992547409.93` virou `.94`.
  - `CHECK` com `scale()` recusa `17.900`. Tem que ser `min_scale()`.
- `CREATE DOMAIN` não tem `IF NOT EXISTS`, então a migration de T-H precisa de guarda de existência para ser idempotente.
- Não medi o lock do `ALTER DOMAIN ... VALIDATE CONSTRAINT`.
- A conta de valor roda no servidor e no terminal (`RN-OFF-020`, `RN-NUC-015`), e o código de ponto fixo precisa ser um só nos dois. `packages/**` fora de `sdui` continua fechado (`CLAUDE.md` §2).
- Agregado no `platform` (`D-06`) precisa carregar moeda, e o teto de 10^12 não serve para total de muitos anos.
- `db/` aparece inteiro como não rastreado no `git status`. É o trabalho da outra instância (T-0009); não toquei.

PERGUNTAS:
- para produto/humano: combustível tem preço unitário com 3 casas (R$ 6,299/L)? Hoje é hipótese de ramo, sem fonte no repositório. Se confirmar, só o envelope de `unit_price` muda.
- para produto: o granel é 2 casas (item SPR-40) ou 3 (`dados.md` §3)? O envelope 3 atende os dois; a resposta vira dado da unidade.
- para produto (G-09): arredonda por linha ou no total? As três linhas de polpa do exemplo dão R$ 53,79 contra R$ 53,78. E qual é a regra de empate no destino do centavo?
- para backend (E.2): pode confirmar string decimal canônica na escala exata para dinheiro e quantidade, e a proibição de JSON montado no SQL?
- para thread: onde mora o módulo de ponto fixo que o servidor e o terminal compartilham?

VERIFICAÇÃO:
- Postgres 16.15 (container `t0018-medida`, já removido), usando os scripts salvos na scratchpad da sessão.
- Semântica de entrada: typmod, bigint, `CHECK` com `scale` e com `min_scale`, estouro, tipo de retorno de `sum`/`avg`, `to_json`.
- Matriz de reescrita com 10 mudanças, conferindo tabela e índice.
- Troca de constraint de domínio sem reescrever a tabela.
- `numeric(14,2)` → domínio reescreve.
- `sum()` com 3 execuções. Inserção de 2M linhas com 3 execuções, das quais relato a 2ª e a 3ª.
- Driver: OIDs 20 e 1700 chegam como string, 1231 como float, domínio chega como OID 1700.
- Node 22.23.1: `BigInt` ponto fixo, rateio e limites de `number`.
- Não rodei nenhuma migration nem o executor de `db/migrator`.

MEMÓRIA SUGERIDA:
- type=gotcha escopo=plataforma camada=dados slug=gotcha-typmod-numeric-arredonda-em-silencio — `numeric(p,s)` arredonda casa excedente (metade para longe do zero) antes de qualquer CHECK, e o banco decide o centavo no lugar da regra de arredondamento.
- type=gotcha escopo=plataforma camada=backend slug=gotcha-numeric-em-json-do-sql-e-em-array-vira-float — `to_json`/`json_agg` de valor e `numeric[]` chegam ao Node como `float` pelo `pg`; o JSON de valor sai do backend, a partir da string.
- type=gotcha escopo=plataforma camada=dados slug=gotcha-scale-conta-zero-a-direita — CHECK de envelope usa `min_scale()`; com `scale()`, `17.900` é recusado.
- type=decision escopo=plataforma camada=dados slug=decision-dinheiro-e-quantidade — só depois que o thread decidir.

PRÓXIMO PASSO SUGERIDO: backend — consulta E.2 sobre representação na rede. Ler a §6 do documento (restrições medidas) e responder em no máximo 10 linhas.

## backend — 2026-09-23 (E.2, consulta)

## RELATÓRIO — backend — T-0018 (consulta de arquiteto-dados)
STATUS: OK
FEITO:
1. **(1) Confirmo.** Na borda, cada domínio tem um schema TypeBox `Type.String` com padrão fixo: escala exata, sem expoente, sem `+`, sem zero à esquerda, sem `-0`. O sinal é decidido por domínio. A escala exata vale também na entrada: `"17.9"` é recusado com erro de campo, não normalizado. O motivo que falta na proposta é que, com string canônica, o reenvio idempotente (`backend.md` §3) é comparado byte a byte. Se a entrada fosse normalizada, duas grafias diferentes seriam aceitas como a mesma requisição.
2. **(2) Confirmo, e amplio.** Duas regras entram:
   - Valor gravado dentro de `jsonb` também vai como string, porque o driver faz `JSON.parse` na leitura e perde o centavo do mesmo jeito.
   - Não se registra parser global de tipo para o OID 1700, nem para o 1231. O `setTypeParser` vale para o processo inteiro e age escondido. A regra é não agregar valor em array no caminho de requisição.
3. **(3) Confirmo.** `BigInt` basta para somar, para multiplicar quantidade (escala 3) por preço (escala 2), que dá escala 5 e volta a 2 só pela função de arredondamento, e para ratear com divisão inteira e resto. Não entra dependência. O módulo não traz modo de arredondamento padrão. O modo é parâmetro explícito e versionado, porque é de `G-09`/`LACUNA-NUC-004` e continua aberto. A serialização passa só pelo `format` do módulo, já que `BigInt` não passa por `JSON.stringify`.
4. **(4) O terminal nunca:**
   - usa `Number`, `parseFloat` ou operador aritmético sobre valor;
   - arredonda por conta própria ou escolhe modo de arredondamento;
   - compõe valor fora de artefato publicado (`RN-OFF-020`);
   - manda número JSON;
   - devolve à rede a string formatada para exibição. Formatar é caminho de ida só: à rede volta a string canônica recebida ou a composta pelo módulo.
5. **Onde mora.** Em `packages/contracts/`, porque a forma do valor na rede é contrato. O código é TypeScript puro, sem dependência e sem API de Node, para rodar igual no Node e no navegador. Até o pacote abrir, ele nasce isolado em `apps/api/src/` sem importar Fastify nem Kysely, e a mudança de lugar fica mecânica. Cópia no terminal é proibida: duas cópias dão centavo diferente.
ARQUIVOS: `docs/arquitetura/dinheiro-e-quantidade-2026-09-23.md` §2.4, §5–§9 (só leitura), `apps/api/package.json` (só leitura), `docs/produto/operacao-offline-e-sincronizacao.md:109-115` (só leitura)
NÃO FEITO: —
DECISÕES: Escala exata também na entrada. O custo é recusar `"17.9"` vindo de um terminal com defeito. Em troca, a comparação idempotente fica determinística.
RISCOS: Não confirmei qual processo compõe o valor offline, a página ou o acompanhante em Node (`D-02`). Se for o acompanhante, não sei se `BigInt` é suportado no motor da página. Nos dois casos o módulo é o mesmo.
PERGUNTAS:
  - para humano: abrir agora `packages/contracts/` só para o módulo de ponto fixo, ou ele nasce isolado em `apps/api/src/` e muda de lugar quando o terminal precisar dele?
VERIFICAÇÃO: Li a proposta e o `package.json`. Rodei `grep` em `apps/api/src`: não há `setTypeParser`, OID 1700/1231, `BigInt`, `to_json` nem `json_agg` hoje. Não rodei código.
MEMÓRIA SUGERIDA:
  - type=gotcha escopo=plataforma slug=gotcha-valor-em-jsonb-perde-centavo-no-driver — valor em `jsonb` ou JSON montado no SQL volta como `float` pelo `JSON.parse` do `pg`, e o valor vai como string
PRÓXIMO PASSO SUGERIDO: thread/humano: decidir onde mora o módulo; em seguida backend especifica o contrato do módulo (parse, format, soma, produto, rateio, arredondamento com modo explícito).

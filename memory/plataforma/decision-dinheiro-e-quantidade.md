---
name: decision-dinheiro-e-quantidade
description: dinheiro, preço unitário e quantidade são `numeric` sem modificador sob três domínios de envelope (valor ≤2 casas, preço ≤3, quantidade ≤3), em unidade maior da moeda; conta em ponto fixo com BigInt; string decimal canônica na rede; centavos em bigint recusado
type: decision
escopo: plataforma
camada: dados
data: 2026-09-23
relaciona: [[decision-d-04-chave-timestamps-exclusao]], [[gotcha-typmod-numeric-arredonda-em-silencio]], [[gotcha-numeric-em-json-e-array-vira-float-no-driver]], [[gotcha-envelope-de-escala-usa-min-scale]]
tarefa: T-0018
---

Decidido pelo thread em 2026-09-23, por delegação do humano, sobre a proposta M2b de
`docs/arquitetura/dinheiro-e-quantidade-2026-09-23.md`, com a consulta do `backend` na ficha:

- **Banco:** `numeric` sem modificador, sob três domínios por schema de cliente: `money_amount` (escala
  ≤ 2, |v| < 10^12), `unit_price` (escala ≤ **3**) e `quantity_value` (escala ≤ 3, |v| < 10^11). O
  envelope é `CHECK` com `min_scale()`. Preço unitário é domínio próprio desde o primeiro DDL.
- **Quantidade:** envelope de 3 casas; as casas por unidade são dado publicado (0 a 3). O backend
  recusa casa a mais, nunca arredonda.
- **Conta:** ponto fixo com `BigInt`, sem biblioteca. O modo de arredondamento é parâmetro explícito e
  versionado (`G-09`), nunca padrão escondido.
- **Rede:** string decimal canônica na escala exata, na entrada também (`"17.9"` é recusado), validada
  por schema na borda. Valor em `jsonb` vai como string. Nada de JSON de valor montado no SQL, nada de
  `numeric[]` no caminho de requisição, nenhum `setTypeParser` global.
- **Moeda:** nenhuma coluna ao lado de cada valor. Se a moeda for do estabelecimento (`LACUNA-NUC-041`),
  o cabeçalho da venda leva `currency_code`.
- **O código de ponto fixo é um só**, compartilhado por servidor e terminal, em TypeScript puro. Mora em
  `packages/contracts/`, que abre para ele pela mesma leitura de `packages/sdui` (`CLAUDE.md` §2).
  Cópia no terminal é proibida: duas cópias dão centavo diferente.

**Por quê:** `numeric(14,2)` arredonda em silêncio antes de qualquer `CHECK` e decide o centavo no lugar
da regra; tirar o modificador depois é só metadado, mas o arredondamento já terá gravado dado. Centavos
em `bigint` foram recusados: sair deles muda o significado da coluna em N schemas (expand/contract com
backfill), e a vantagem na fronteira não existe com o driver `pg`, que também entrega `bigint` como
string. O preço com 3 casas cobre combustível (vertical conhecida) e alargar domínio custa zero agora.
Custo aceito, medido: `sum()` cerca de 1,5× mais lento que em `bigint` (410 contra 270 ms, 2M linhas).

**Como aplicar:** o `.claude/rules/dados.md` §3 ainda diz "centavos ou `numeric(14,2)`". Esta decisão
supera o texto literal até a regra ser atualizada (edição de `.claude/**` negada por permissão em
2026-09-23). A primeira migration de cliente (`F-021`) cria os domínios com guarda de existência
(`CREATE DOMAIN` não tem `IF NOT EXISTS`) e registra a convenção em `db/convencoes.md`.

---
id: T-0021
backlog: F-030
titulo: Módulo de ponto fixo de dinheiro e quantidade em packages/contracts
status: fechada
escopo: cliente=- vertical=- modulo=- camada=backend
aberta_em: 2026-09-23
---

## Pedido

"resume agora. continue os trabalhos. mas seja mais direto." (humano, 2026-09-23). Item nascido da
decisão de `T-0018` ([[decision-dinheiro-e-quantidade]]).

## Plano

Encurtado (`processo.md` §5 não se aplica inteiro, porque é dinheiro: a ficha existe).
1. `backend` implementa `docs/backlog/F-030-*.md` em `packages/contracts/`, com os sete aceites como teste.
2. `seguranca` não se aplica (sem entrada de rede nem tenant); o `os-review` do próprio fechamento cobre.
GATES: nenhum dos cinco; o módulo não tem consulta nem endpoint.

## Fechamento — 2026-09-23

ENTREGUE: `packages/contracts` com o módulo de ponto fixo (`parse`, `format`, `add`, `multiply`,
`roundToMoney`, `exactToMoney`, `allocateByLargestRemainder`), sem dependência nova.
ARQUIVOS: `packages/contracts/**`; memória `plataforma/gotcha-float-apaga-o-empate-do-arredondamento`.
VERIFICAÇÃO: conferido pelo thread em 2026-09-23: `npm run typecheck` saída `0`; `npm test` 26/26. Mutação
M1–M4 pelo autor, todas mortas.
PRONTO:
- Regra citada nos testes (`RN-NUC-064`, `RN-NUC-067`, aceites de `F-030`): sim.
- Teste do caso concreto: sim, os sete aceites. Gates: não se aplica (sem consulta, endpoint ou DDL).
- Memória sugerida: a gotcha escrita; `convention-linha-exata-nao-exige-modo` fundida nela ("Como aplicar").
- Segredo: nenhum.
SOBROU: integrar em `apps/api` (schema de borda por domínio) e decidir como o `apps/api` e o terminal
consomem os pacotes sem `exports`, junto com a resolução de `@forja/sdui` sem workspace (`backend`).

## backend — 2026-09-23

## RELATÓRIO — backend — T-0021
STATUS: OK
FEITO:
- Criei `packages/contracts/` com a mesma forma de `packages/sdui`: mesmo `package.json` e mesmos scripts, `tsconfig.json` copiado sem alteração, as mesmas duas dependências de desenvolvimento nas mesmas versões (`typescript` 7.0.2, `@types/node` 22.20.2), instaladas com `npm install --offline` a partir do cache. Nenhuma dependência nova. O lock confere com o de `sdui` para as duas.
- Escrevi o módulo de ponto fixo:
  - `parse` e `format` canônicos, com a escala declarada por quem chama. Fora da forma, é recusa com código nomeado, nunca normalização.
  - `add`, para valores da mesma grandeza e da mesma escala.
  - `multiply`, quantidade × preço, exato.
  - `roundToMoney`, com modo obrigatório, pela lista fechada de `RN-NUC-067`.
  - `exactToMoney`.
  - `allocateByLargestRemainder`, pela regra de `RN-NUC-064`.
  - Toda função devolve `Outcome` (`{ok,value}` ou `{ok:false,error:{code}}`). Nada lança, nada registra.
- Os sete aceites do `F-030` viraram teste, cada um citando `F-030` e a `RN`. Incluí a tabela de `RN-NUC-067` (0,350 × 29,90 e 23,456 × 6,299, nos quatro modos), o caso 10,465 e o teste de propriedade da repartição.
- Aceite 7 vale por construção: `tsconfig.src.json` compila só `src/`, com `types: []` e sem DOM, e `npm run typecheck` roda essa compilação junto com a normal.

ARQUIVOS:
- `/home/mcastro/work/freelas/forja/packages/contracts/package.json` (novo)
- `/home/mcastro/work/freelas/forja/packages/contracts/package-lock.json` (novo, gerado)
- `/home/mcastro/work/freelas/forja/packages/contracts/tsconfig.json` (novo, cópia de `sdui`)
- `/home/mcastro/work/freelas/forja/packages/contracts/tsconfig.src.json` (novo)
- `/home/mcastro/work/freelas/forja/packages/contracts/README.md` (novo)
- `/home/mcastro/work/freelas/forja/packages/contracts/src/index.ts` (novo)
- `/home/mcastro/work/freelas/forja/packages/contracts/src/fixed-point/value.ts` (novo): tipos, envelope, `build`, guarda de execução
- `/home/mcastro/work/freelas/forja/packages/contracts/src/fixed-point/canonical.ts` (novo): `parse`, `format`
- `/home/mcastro/work/freelas/forja/packages/contracts/src/fixed-point/arithmetic.ts` (novo): `add`, `multiply`, `roundToMoney`, `exactToMoney`, `ROUNDING_MODES`
- `/home/mcastro/work/freelas/forja/packages/contracts/src/fixed-point/allocate.ts` (novo)
- `/home/mcastro/work/freelas/forja/packages/contracts/test/{helpers,canonical.test,arithmetic.test,allocate.test,types.test}.ts` (novos)
- `node_modules/` e `dist/` também foram criados; os dois estão no `.gitignore`.

NÃO FEITO: —

DECISÕES:
- **Quarto tipo, `ExactAmount`.** É o produto exato antes de virar dinheiro: escala até 6, sem teto próprio e sem `format`, porque não tem forma de rede. `roundToMoney` só aceita `ExactAmount`, então dinheiro não tem como ser arredondado de novo (`RN-NUC-067`: "valor já arredondado nunca é arredondado de novo"). Isso é garantido pelo tipo e tem teste.
- **`exactToMoney`, que não estava no brief.** Pela precondição de `RN-NUC-067`, linha de valor exato (2 × 5,00) não depende de modo publicado. Sem essa função, quem compõe teria de exigir modo até para linha exata. Ela recusa com `requires-rounding` quando sobra casa, e só aí o modo passa a ser exigido.
- **Dinheiro só na escala 2** (`MONEY_SCALE`). Moeda com outro expoente é troca de envelope, como diz o item. Preço e quantidade aceitam escala de 0 a 3. O teto de `unit_price` (< 10^12) foi adotado do valor, e está declarado em `value.ts`.
- **Negativo é recusado em todo domínio** (`negative`, na leitura e na guarda de execução). Não há subtração. Tem teste.
- **Valor 0 repartido sobre soma 0 devolve zeros; qualquer valor acima de 0 sobre soma 0 é `allocation-exceeds-base`.** A lista vazia segue a mesma regra.
- **Cada função pública confere o envelope de novo na execução.** Isso cobre chamador JavaScript sem tipo e valor forjado com `as`: unidade negativa, `number` no lugar de `bigint`, domínio `'toString'`. O domínio é procurado com `Object.hasOwn`.
- **String gigante é recusada pelo comprimento, antes do `BigInt`:** parte inteira com mais de 12 dígitos já está fora de todos os tetos.
- **Códigos de erro em kebab-case**, como `sdui` faz (`'not-json'`). Os modos ficam em snake_case, como a `RN` os nomeia.
- **Divergência no caso 10,465:** ele não prova sozinho que `half_even` erra em ponto flutuante. Em float, `0.35*29.9 = 10.464999999999998`: o empate some, `half_even` acerta 10,46 por acaso, e quem erra é `half_up`, que dá 10,46 em vez de 10,47. O teste afirma isso. Acrescentei 0,020 × 27,25 = 0,545, em que o float fica acima da metade e `half_even` em float sobe para 0,55; o módulo dá 0,54. Acrescentei também 0,015, empate com vizinho ímpar, que sobe para 0,02.
- **O brief de sistema diz que `D-01` está ABERTA; o `CLAUDE.md` §8 diz FECHADA.** Não afeta nada aqui: o módulo não toca framework.

RISCOS:
- O motor que compõe offline precisa de `BigInt`, `Object.hasOwn` e ES2022. Isso não foi confirmado no terminal e fica para a integração.
- Custo de `BigInt` no caminho de adicionar item: não medi, e o item diz que se mede na integração.
- `add` usa `NoInfer`, do TypeScript 5.4 ou superior, para prender a grandeza no operando da esquerda. Sem ele, dinheiro + quantidade compilava; o `@ts-expect-error` acusou isso durante o trabalho.
- `packages/` inteiro está fora do git (`??`), `sdui` inclusive. O humano é quem decide o commit.

PERGUNTAS: —

VERIFICAÇÃO:
- `npm run typecheck` (`tsc --noEmit && tsc -p tsconfig.src.json`): limpo. Os 10 `@ts-expect-error` de `types.test.ts` estão ativos, e um deles acusou o defeito do `add` antes da correção.
- `npm test`: 26 testes, 26 passam, 0 falham.
- Por construção, na cópia do scratchpad, `tsc -p tsconfig.src.json` recusa `process.env` (TS2591), `import 'node:fs'` (TS2591) e `console.log` (TS2584). O original compila limpo.
- Busca `grep -rnE "Number\(|parseFloat|parseInt|Math\.|toFixed|from 'node:|require\(|process\.|Buffer|globalThis|console\." src`: uma ocorrência só, `src/index.ts:6`, que é comentário. Todo `number` em `src` é escala ou índice de tipo, nunca valor.
- Mutação, numa cópia no scratchpad (depois conferi com `diff` que a cópia voltou igual ao original):
  - M1, empate de `half_even` sempre sobe: morrem 3, entre eles "RN-NUC-067: 0,350 × 29,90 = 10,465 nos quatro modos" e "half_even no empate exato".
  - M2, arredondamento silenciado: morrem 5, entre eles os dois da tabela de `RN-NUC-067`, o aceite 3 e o aceite 4.
  - M3, empate de resto vai à última lançada: morrem 3, entre eles "RN-NUC-064 aceite 1: 10,00 sobre três linhas de 10,00 dá 3,34 · 3,33 · 3,33" e o teste de propriedade.
  - M4, `half_up` sem subir no empate: morrem 4.
  - O controle volta a 26 de 26.
  - M1 e M2 compilaram só com `--noUnusedLocals false --noUnusedParameters false`, porque o `tsc` estrito já barra a mutação por variável sem uso.

MEMÓRIA SUGERIDA:
- type=gotcha escopo=plataforma slug=gotcha-float-apaga-o-empate-do-arredondamento — em float, 0,35 × 29,90 = 10,464999…: o empate some, `half_up` dá 10,46 e `half_even` acerta por acaso; 0,020 × 27,25 fica acima da metade e `half_even` erra para 0,55.
- type=convention escopo=plataforma slug=convention-linha-exata-nao-exige-modo — quem compõe a linha chama `exactToMoney` primeiro e só exige modo publicado quando vier `requires-rounding` (precondição de `RN-NUC-067`).

PRÓXIMO PASSO SUGERIDO: backend — em passada própria, integrar em `apps/api` o schema de borda por domínio, com `parse` e `format` deste pacote, e decidir como `apps/api` consome o pacote, porque hoje ele não tem `exports` (`sdui` também não).

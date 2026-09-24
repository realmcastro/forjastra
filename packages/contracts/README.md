# `packages/contracts` — o que é contrato de rede e roda igual nas duas pontas

Hoje, só o ponto fixo de dinheiro, preço unitário e quantidade (`F-030`). É o único código que faz
conta com valor, e o servidor e o terminal usam o mesmo: com duas implementações, a mesma venda sai
com centavo diferente em cada ponta (`RN-OFF-020`, `RN-NUC-015`). A decisão que ele implementa é
`memory/plataforma/decision-dinheiro-e-quantidade.md`.

## Rodar

```
npm install
npm run typecheck
npm test
```

`typecheck` compila duas vezes. A segunda (`tsconfig.src.json`) pega só `src/`, sem os tipos de Node
e sem DOM: importar `node:*` ou usar `process`, `Buffer` ou `console` fora de `test/` não compila.

## Contrato

```
string canônica ("17.90", "0.750") + escala declarada por quem chama
→ parse                        Money | UnitPrice | Quantity, inteiro escalado em BigInt
→ add · multiply               multiply devolve ExactAmount, exato (escala 3 × 3 = 6)
→ exactToMoney | roundToMoney  a primeira recusa se sobrar casa; a segunda exige modo
→ allocateByLargestRemainder   RN-NUC-064
→ format                       string canônica
```

- Toda função devolve `Outcome`: `{ ok: true, value }` ou `{ ok: false, error: { code } }`. Nada lança
  e nada registra.
- Forma canônica: escala exata, ponto, sem expoente, sem sinal, sem zero à esquerda. Fora dela é
  recusa com código, nunca normalização.
- Envelope: `money_amount` só escala 2 e < 10^12; `unit_price` escala 0 a 3 e < 10^12 (teto adotado
  do valor, porque a decisão não fixa um); `quantity_value` escala 0 a 3 e < 10^11.
- Negativo é recusado em todo domínio. Devolução é linha nova com valor positivo.
- Modos (`RN-NUC-067`): `half_up`, `half_even`, `down`, `up`. Nenhum é padrão. Qual modo vale para uma
  venda é publicação do estabelecimento, e arredondar por linha ou no total é de quem compõe: as duas
  sequências se escrevem com `add` e `roundToMoney`.

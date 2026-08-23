# Memória — módulo `FIS` (tributação)

`FIS` decide **o que incide, sobre que base, em que regime, sob que versão de regra**. Emissão de
documento é `EMI`, apuração é `APU` — módulos irmãos, índices próprios. Spec:
`docs/produto/modulos/fiscal.md` e `docs/produto/fiscal-regimes-e-vigencia.md`.

## Armadilhas

- [Grão do congelado é irrecuperável](gotcha-grao-do-congelado-e-irrecuperavel.md) — congelar por venda em vez de `item × tributo × base × regime × redutor` perde segregação e decomposição para todo o histórico, e recompor é proibido · camada:dados

## Regras de negócio

_(vazio — as `RN-FIS` vivem na spec; aqui só entra o que a spec não deriva)_

## Decisões

- **Onde mora o catálogo de regra fiscal é `D-05` e está ABERTA** → [[decision-d-05-catalogo-de-regra-fiscal-sem-casa]] em `plataforma/`. **`FIS` não é modelável antes disso.**

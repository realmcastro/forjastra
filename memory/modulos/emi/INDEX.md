# Memória — módulo `EMI` (emissão de documento fiscal)

`EMI` monta, assina e transmite o documento. Tributação é `FIS` (camada 1, exigida). Spec:
`docs/produto/modulos/fiscal.md`, `docs/produto/fiscal-emissao-propria.md`,
`fiscal-emissao-contingencia.md`, `fiscal-custodia-e-trilha.md`.

## Armadilhas

- [Numeração é mecanismo de alocação, não coluna](gotcha-numeracao-fiscal-e-mecanismo-de-alocacao.md) — unicidade e sequência por estabelecimento **e** série; faixa por terminal e sequência densa diária são incompatíveis, e renumerar depois é impossível · camada:dados

## Regras de negócio

_(vazio — as `RN-EMI` vivem na spec)_

## Decisões

- **Emissão é própria** (montamos, assinamos, transmitimos) → [[decision-emissao-fiscal-propria]] em `plataforma/`.
- [EMI desligado por padrão no MVP 1](decision-emi-desligado-por-padrao-mvp1.md) — perfil-alvo inicial (interior) não liga `EMI`; ativação é config por cliente/tenant, condicionada às três reservas de modelo do roadmap §5.3 estarem na Fase 1 · camada:produto

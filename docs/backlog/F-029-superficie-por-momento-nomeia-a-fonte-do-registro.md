# F-029 — A superfície por momento passa a dizer as três fontes do registro, e não só a atribuição

**Tipo:** Comportamento fechado · **Estado:** a fazer · **Dono:** `produto` · **Território:**
`docs/produto/**` · **Cobre o achado** `2.22` de `docs/produto/captura-varredura-sem-rn-2026-09-23.md`
· **Agrupador:** F-001 · **Rótulo:** captura

## Objetivo

Alinhar três frases de `superficie-por-papel-momentos.md` com `RN-NUC-028` e `RN-NUC-029`. As duas
redações lado a lado:

| Arquivo derivado | Regra dona |
|---|---|
| `superficie-por-papel-momentos.md:96-97`: "o registro nomeia a **atribuição mais estreita**", sem condição | `matriz-operacao-papel-contrato.md:129-131` (`RN-NUC-028`): "**quando é atribuição que sustenta o ato**, o registro nomeia a atribuição mais estreita; nas outras duas fontes de `RN-NUC-029` não há atribuição a nomear, e o registro diz a fonte que houve" |
| `:180-181`: a mesma frase, para `owner` | idem |
| `:216`, na seção sem contato: "Cada fato registra `owner` como autor" | `:160-168` (`RN-NUC-029`): o ato ordinário sem contato se sustenta em **identificação retida mais habilitação do terminal**, e com limite aplicado o registro diz o teto do **papel-piso** |

A do arquivo derivado estreita. Quem implementa a superfície por ela grava atribuição onde a regra manda
gravar a terceira fonte, e o desconto no teto do papel-piso fica igual ao desconto de gerente na trilha.
É exatamente a "falha aberto na trilha" que `RN-NUC-029` descreve (`:188-191`), e ela só aparece quando
alguém procura quem autorizou um desconto.

A mesma frase sem condição está em `papeis-atribuicao-e-delegacao.md:77` (`RN-NUC-020`, "cada ato
registra **qual** atribuição o autorizou"), fora do conjunto da varredura e achada na conferência. É a
regra dona de atribuição; a redação dela é anterior à terceira fonte, que entrou por `AUT-15` em
2026-08-23.

## Escopo

- As três frases de `superficie-por-papel-momentos.md` e a de `RN-NUC-020:77`, cada uma dizendo que o
  registro nomeia **em que o ato se sustentou**, com a atribuição como um dos três casos.
- Conferir `superficie-por-papel.md` e `matriz-operacao-papel-contrato.md` atrás da mesma frase.

## Fora de escopo

- Mudar `RN-NUC-028` ou `RN-NUC-029`: elas estão certas, e são o parâmetro.
- As 37 citações de `superficie-por-papel-momentos.md` a `RN` em arquivo que estava em edição em
  2026-09-23: segunda passada da lente C.

## Critério de aceite

1. Ler só `superficie-por-papel-momentos.md` §3.3 e implementar o registro do `owner` que vende sem
   contato produz o que `RN-NUC-029:198-204` exige: fonte (3) e o teto do papel-piso, nunca atribuição.
2. Busca por "atribuição mais estreita" nos arquivos de papel devolve só ocorrências condicionadas à
   fonte ser atribuição.

## Registra / Não registra

**Registra:** o que `RN-NUC-029` já manda, sem acréscimo.
**Não registra:** nada muda; o item corrige prosa que, lida sozinha, levaria a registrar menos do que a
regra manda.

## Depende de

Nada. `superficie-por-papel-momentos.md` e `papeis-atribuicao-e-delegacao.md` não estavam entre os
arquivos em edição em 2026-09-23.

## Gate obrigatório

`produto`. `seguranca` lê, porque a trilha é a única defesa das operações sensíveis
(`matriz-operacao-papel-contrato.md:177-179`).

## Referências

`docs/produto/captura-varredura-sem-rn-2026-09-23.md` §2.22 · `docs/produto/superficie-por-papel-momentos.md:96-97`,
`:180-181`, `:213-216` · `docs/produto/matriz-operacao-papel-contrato.md:120-207` ·
`docs/produto/papeis-atribuicao-e-delegacao.md:77`

---
name: gotcha-numeracao-fiscal-e-mecanismo-de-alocacao
description: numeração de documento fiscal é invariante de unicidade e sequência por estabelecimento E série, e é mecanismo de alocação, não coluna — acrescentá-la depois exige unicidade retroativa em N schemas, e renumerar é impossível
type: gotcha
escopo: modulo:emi
camada: dados
data: 2026-08-22
tarefa: T-0001
---

**Sintoma:** a numeração entra no modelo como "mais uma coluna" do documento. Aí descobre-se que ela é
**invariante**: única e sequencial por **estabelecimento e série**. Acrescentar a garantia depois exige
`UNIQUE` retroativo em N schemas (ciclo expand/contract inteiro, `.claude/rules/migrations.md` §4) — e
**renumerar é impossível**: o número já está com o autorizador e com o cliente-final.

**Por quê é mecanismo e não valor:** o número tem de existir no momento da emissão, inclusive **sem
rede**. Isso obriga a escolher o mecanismo de alocação junto com o modelo, e os dois mecanismos óbvios
são **incompatíveis entre si**:
- **faixa pré-alocada por terminal** — funciona offline, produz sequência com buracos;
- **sequência densa diária** — não tem buraco, exige um alocador único e online.

Escolher os dois é escolher nenhum.

**Como aplicar:** o modelo de `EMI` declara o mecanismo de alocação **antes** da tabela. Quem porta o
estado de contingência e por onde a numeração corre é o **ponto de emissão** (`issuing_point`), não o
terminal nem o estabelecimento — o glossário já fixou isso.

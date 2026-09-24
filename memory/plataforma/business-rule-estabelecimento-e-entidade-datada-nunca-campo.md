---
name: business-rule-estabelecimento-e-entidade-datada-nunca-campo
description: o estabelecimento pertence a um cliente por vínculo imutável, todo fato do núcleo o nomeia — inclusive quando o cliente tem uma unidade só — e o ciclo de vida dele é fato datado com estado derivado, nunca campo sobrescrito
type: business-rule
escopo: plataforma
camada: produto
data: 2026-09-11
relaciona: [[gotcha-fuso-do-estabelecimento-versus-fuso-do-cliente]], [[decision-tenancy-schema-por-cliente]], [[gotcha-moeda-viajou-na-parentese-do-fuso]]
tarefa: T-0009
---

`RN-NUC-050` e `RN-NUC-051`, escritas em 2026-09-11 (`docs/produto/nucleo-estabelecimento.md`). A
entidade era declarada de primeira classe no glossário e **não tinha regra numerada** — o schema de
controle ia nascer sem ela.

Três cláusulas que decidem modelo:

1. **O vínculo estabelecimento→cliente é imutável.** Estabelecimento não muda de cliente
   (`LACUNA-NUC-043` guarda o caso que testa isso: venda da loja, reorganização societária).
2. **Todo fato do núcleo nomeia a unidade, inclusive com uma só.** Nada de coluna opcional resolvida
   depois. O atalho da unidade implícita funciona perfeitamente até o dia da segunda loja, e **fato
   passado não tem backfill**: os registros antigos ficam sem saber onde aconteceram, para sempre.
3. **Ciclo de vida é fato datado, estado derivado**, na forma de `RN-PRV-013`. Não existe campo de
   estado sobrescrito.

**Por quê:** o schema isola **cliente**, não estabelecimento
([[decision-tenancy-schema-por-cliente]]), então a unidade é a coisa que o modelo precisa nomear e o
isolamento não nomeia por ele. É a mesma raiz de
[[gotcha-fuso-do-estabelecimento-versus-fuso-do-cliente]]: some com um estabelecimento só, reaparece
com dois.

**Como aplicar:** qualquer tabela de fato do núcleo carrega a unidade, obrigatória, desde a primeira
migration. Fuso, moeda e identidade fiscal do estabelecimento **ficam de fora** por enquanto, cada um
com lacuna nomeada (`LACUNA-GLO-001`, `LACUNA-NUC-041` e `nucleo-estabelecimento.md` §3).

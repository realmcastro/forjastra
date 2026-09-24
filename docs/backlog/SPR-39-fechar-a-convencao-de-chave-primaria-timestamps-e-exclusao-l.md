# SPR-39 — Fechar a convenção de chave primária, timestamps e exclusão lógica

**Tipo:** Spike · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-09-16
**Agrupador:** SPR-34

---

## Objetivo

Fechar a convenção de chave primária, `created_at`/`updated_at`, e exclusão lógica que vale para o núcleo e para todo módulo, em todo cliente — a metade de D-04 ainda aberta (`CLAUDE.md` §8). Toda tabela da Fase 1 nasce sob esta convenção: fechar agora é a decisão mais barata; corrigir depois é migration sobre tabela em uso, em N schemas, pelo ciclo de quatro etapas de `migrations.md` §4.

## Escopo

**1. Chave primária — forma e geração.** A chave de idempotência é cunhada no terminal, offline, sem servidor (`backend.md` §3). A convenção decide: UUID gerado no cliente, id sequencial gerado no servidor, ou os dois para propósitos diferentes — e qual impacto isso tem num ramo de volume alto (ex.: posto, muitas vendas por segundo).

**2. Timestamps.** Venda é registrada em UTC; turno fecha no fuso do cliente (`dados.md` §3). `created_at` e `updated_at` são `timestamptz`, sempre — a convenção fecha se existe alguma exceção a isso. Nenhuma `timestamp` sem fuso, nenhuma `date` para o que tem hora.

**3. Exclusão lógica.** Cancelar uma venda, remover um item de catálogo, remover um operador pedem resposta própria. Fiscal e financeiro já são append-only por invariante (`dados.md` §4): cancelamento é linha nova referenciando a original, nunca deleção nem soft delete. A convenção decide o resto — soft delete uniforme para o que não é fiscal/financeiro, ou caso a caso por tabela.

## Critério de aceite

A convenção sai registrada em local único e verável (`decision` de memória, ou `docs/produto/`) com: o formato exato de chave primária e como ela nasce em cada caso (terminal offline vs. servidor); a regra de `timestamptz` e fuso para `created_at`/`updated_at`; e a regra de exclusão lógica por categoria de tabela (fiscal/financeiro vs. resto) — cada uma das três com exemplo de DDL. **Toda tabela da Fase 1 segue exatamente esta convenção, sem exceção não declarada.** SPR-36, SPR-37 e as demais specs de modelagem dependem dela e não modelam antes dela existir.

## Fora de escopo

Índices, particionamento, estratégia de crescimento — de `arquiteto-dados`, fora desta decisão.

## Referências

`.claude/rules/dados.md` §3 e §4 · `.claude/rules/migrations.md` §4 · `CLAUDE.md` §8 (D-04)

## Resultados esperados

Uma decisão escrita, com o que foi recusado e o trade-off real, cobrindo os três pontos: forma e geração da chave primária, incluindo se ela é cunhável no terminal offline, sem servidor; timestamps obrigatórios em timestamptz UTC; e onde a exclusão lógica vale e onde não vale.A decisão precisa ser testável: dada uma tabela nova qualquer, um revisor decide sozinho se ela está conforme. Enquanto esta issue não fechar, nenhuma tabela da Fase 1 é criada.

---
name: gotcha-ancora-documental-mora-em-fis-nao-em-emi
description: a âncora entre venda e obrigação documental é campo nullable no núcleo de FIS, nunca em tabela de EMI — tenant que nunca liga EMI não tem as tabelas de EMI (migration de módulo só roda no schema que ativa), e uma venda antiga não pode ganhar a âncora retroativamente
type: gotcha
escopo: modulo:fis
camada: dados
data: 2026-08-24
relaciona: [[gotcha-grao-do-congelado-e-irrecuperavel]], [[gotcha-numeracao-fiscal-e-mecanismo-de-alocacao]], [[decision-emi-desligado-por-padrao-mvp1]]
tarefa: T-0005
---

**Sintoma:** modelar a terceira reserva do roadmap §5.3 ("âncora da obrigação documental no fato de
venda") como FK ou coluna em tabela de `EMI`. Funciona enquanto todo cliente tem `EMI` ligado — e
quebra no primeiro cliente que não tem, porque migration de módulo só roda no schema do cliente que
**ativa** aquele módulo (`.claude/rules/migrations.md` §8): um tenant que nunca ligou `EMI` não tem
as tabelas de `EMI` no schema dele.

**Por quê importa (confirmado em consulta a `arquiteto-dados`, T-0005, motivada por
[[decision-emi-desligado-por-padrao-mvp1]]):** com `EMI` desligado por padrão para o perfil-alvo
inicial, a âncora não pode morar numa tabela que aquele cliente não possui. Além disso, histórico de
venda antiga não pode ser "corrigido" retroativamente para ganhar a âncora quando o cliente decidir
ligar `EMI` depois — venda é fato append-only (`.claude/rules/dados.md` §4), e o ponto de decisão
"esta venda vai virar documento" só existe se foi gravado **no instante do fato**.

**Como aplicar:** a âncora é campo **nullable no núcleo de `FIS`** (a tabela do fato fiscal da venda,
não do documento), presente em todo schema desde o dia 1 — inclusive nos clientes que nunca ligam
`EMI`. Nula significa "sem obrigação documental resolvida ainda"; passa a ser preenchida a partir do
momento em que `EMI` liga para aquele cliente, só para vendas dali para frente. Nenhuma reserva das
três de §5.3 muda com o toggle por tenant — o toggle só decide se a âncora chega a ser consumida por
`EMI`, não onde ela mora.

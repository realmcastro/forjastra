---
name: convention-alcance-de-schema-e-privilegio-nao-escolha
description: toda leitura e toda escrita de cliente abrem transação, porque a credencial nua não alcança schema nenhum — o contexto da borda entrega um executor de transação, nunca um handle pronto, e o caminho que precisa de `platform` (o mapa identidade→schema) **não cabe neste pool**
type: convention
escopo: plataforma
camada: backend
data: 2026-09-12
relaciona: [[decision-papel-de-aplicacao-assumido-por-transacao]], [[gotcha-set-role-de-sessao-vaza-no-pool]], [[convention-o-que-o-banco-impoe-vence-o-que-alguem-lembra]]
tarefa: T-0011
---

Com o papel de aplicação assumido por transação ([[decision-papel-de-aplicacao-assumido-por-transacao]]),
alcançar schema deixou de ser escolha de quem escreve a rota e virou **privilégio**: fora de
transação a conexão é a credencial nua, que não tem `USAGE` em schema nenhum e leva
`42501 permission denied for schema`.

**A consequência no contrato da borda:** o contexto de cliente entrega um **executor de transação**
(`apps/api/src/tenant/context.ts:30`), não um handle pronto para consultar. Handle pronto seria a
credencial nua: pedir um seria pedir `42501`. A alternativa descartada foi o handle preguiçoso, que
abrisse transação sozinho na primeira consulta — ele esconde o limite da transação de quem escreve a
rota, e numa rota que move dinheiro saber onde a transação começa e termina **é** a regra, não
detalhe de infraestrutura.

**O que isso fecha:** "função de dados com tenant opcional" deixa de ser algo que alguém precisa
lembrar de evitar. Só `tenantTransactionRunner()` produz um handle de cliente, e o tipo é marcado, de
modo que o compilador recusa handle solto onde se espera handle preso.

**O que isso abre, e é pergunta aberta com dono:** o caminho legítimo que **não** é de cliente também
não cabe neste pool. O mapa identidade→schema precisa ler `platform`, e a credencial não alcança
`platform` — conexão própria com papel próprio, ou mapa resolvido fora do banco, é decisão de
`arquiteto-dados` + `seguranca`, e é onde a pergunta de IDOR volta a existir.

**Como aplicar:** toda rota que toca dado de cliente roda dentro do executor de transação. Quem
precisar falar com serviço externo (adquirente, fisco) tira essa chamada de dentro da transação —
uma conexão do pool fica presa enquanto a transação vive, e `idle_in_transaction_session_timeout`
deixa de ser enfeite. Consulta que precise de `platform` não passa por aqui: levante a pergunta em
vez de conceder privilégio para destravar.

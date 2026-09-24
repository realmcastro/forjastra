---
name: gotcha-conexao-de-controle-do-kysely-fica-fora-do-envelope
description: o `Client` repassado ao Kysely para cancelar consulta **não** passa pelo envelope de protocolo estendido do pool — hoje é inerte porque o texto é template com o `pid` produzido pelo servidor, e deixa de ser no dia em que algum valor de fora entrar nele
type: gotcha
escopo: plataforma
camada: backend
data: 2026-09-12
relaciona: [[gotcha-protocolo-simples-do-pg-aceita-multi-statement]], [[convention-o-que-o-banco-impoe-vence-o-que-alguem-lembra]]
tarefa: T-0011
---

**Sintoma futuro, e é o pior tipo: nenhum hoje.** O pool da aplicação força protocolo estendido em
toda consulta, então o servidor recusa multi-statement mesmo com zero parâmetro
([[gotcha-protocolo-simples-do-pg-aceita-multi-statement]]). Esse envelope alcança o que sai pelo
pool — e **não** alcança a conexão de controle.

O Kysely recebe `pool.Client` (membro não documentado do `pg`, repassado em
`apps/api/src/db/pool.ts:112-117`) e a usa para exatamente dois textos:
`select pg_cancel_backend(<pid>)` e `select pg_terminate_backend(<pid>)`, com o `pid` vindo do
`processID` da conexão, produzido pelo servidor. Nenhum identificador de fora entra no texto, a
conexão não assume papel, e nada em `apps/api` dispara cancelamento hoje — auditado em 2026-09-11
contra `kysely/dist/dialect/postgres/postgres-driver.js:25` e `:163-192`.

**O que ela é, e é por isso que está registrada:** a **única exceção declarada** ao invariante "todo
texto que sai desta conexão carrega parâmetro ligado". Enquanto o texto for template com número do
driver, a exceção é inerte. No dia em que alguém passar `controlClient` com valor vindo de fora, é
protocolo simples outra vez, sem nada acusando — o envelope está em outro lugar do arquivo e a
revisão olha o pool, não o `Client`.

**Como aplicar:** exceção declarada mora no código, junto do que ela excetua, não só em auditoria —
quem lê `pool.ts` precisa encontrar a cláusula ali. Se algum dia essa conexão emitir outro texto, ou
o envelope alcança ela, ou o texto passa a carregar parâmetro ligado; as duas saídas servem, não
emitir nada é a terceira.

---
name: gotcha-set-role-de-sessao-vaza-no-pool
description: `SET ROLE` sem `LOCAL` atravessa o `COMMIT` e a conexão volta ao pool com o papel do cliente anterior — é o mesmo defeito do `search_path`, agora em privilégio, e a única forma correta é `SET LOCAL ROLE` dentro de transação
type: gotcha
escopo: plataforma
camada: backend
data: 2026-09-11
relaciona: [[gotcha-search-path-serve-o-executor-e-vaza-no-pool]], [[decision-papel-de-aplicacao-assumido-por-transacao]]
tarefa: T-0009
---

**Sintoma:** idêntico ao do `search_path` — uma requisição opera como outro cliente, sem erro, e só
sob concorrência.

Medido em PostgreSQL 16.15: `SET LOCAL ROLE` é solto no `COMMIT`, **sem precisar de `RESET`**, e a
conexão volta a ser a credencial. `SET ROLE` **sem** `LOCAL` **permanece na sessão depois do
`COMMIT`** — a conexão volta ao pool carregando o papel do cliente anterior, e a próxima transação
começa com o privilégio errado.

**Por quê é a mesma armadilha de novo, e vale reconhecê-la:** é o segundo estado de sessão que
sobrevive à requisição e vaza no pool. O primeiro foi o `search_path`
([[gotcha-search-path-serve-o-executor-e-vaza-no-pool]]). A forma da armadilha é sempre a mesma —
comando que parece local e é de sessão — e ela vai reaparecer em toda variável de sessão do Postgres
que alguém usar para carregar contexto de tenant.

**A diferença que importa em relação ao `search_path`:** ali o vazamento era de **alvo**, e
qualificar por consulta resolvia. Aqui é de **privilégio**, e não há como qualificar: o papel é
propriedade da sessão. Só existe a forma local, e ela obriga transação.

**Como aplicar:** `SET LOCAL ROLE` sempre, dentro de transação, nunca `SET ROLE`. A forma
parametrizável é `set_config('role', $1, true)`, com o `true` sendo exatamente o "local" —
`set_config` com `false` tem o mesmo defeito. Consulta fora de transação leva `permission denied`, e
isso é o desenho falhando fechado, não um problema a contornar.

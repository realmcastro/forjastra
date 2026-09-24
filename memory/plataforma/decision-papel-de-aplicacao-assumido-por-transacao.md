---
name: decision-papel-de-aplicacao-assumido-por-transacao
description: uma credencial `NOINHERIT` com login e N papéis sem login, um por cliente, assumidos com `SET LOCAL ROLE` na transação; o desempate foi operacional (um segredo em vez de N, e provisionar não distribui credencial) e o custo é o passo intermediário, que falha fechado
type: decision
escopo: plataforma
camada: seguranca
data: 2026-09-11
relaciona: [[decision-tenancy-schema-por-cliente]], [[gotcha-set-role-de-sessao-vaza-no-pool]], [[convention-o-que-o-banco-impoe-vence-o-que-alguem-lembra]], [[convention-ato-de-privilegio-e-passo-do-comando-que-provisiona]]
tarefa: T-0009
---

Decidido pelo humano em 2026-09-11. **Uma credencial `NOINHERIT` com `LOGIN`**, e **N papéis sem
`LOGIN`**, um por cliente (`app_t_<slug>`). A conexão assume o papel do cliente no início da
transação e o larga no `COMMIT`.

**Por que a camada existe, e este é o ponto que não pode se perder:** uma migration pode criar função
que, disparada pelo caixa a cada venda, escreve no schema de **outro cliente** — e nenhum crivo de
texto fecha isso, porque dentro do corpo de função a linguagem deixa de ser SQL. Cinco arranjos foram
medidos em PostgreSQL 16.15, e a prova decisiva é a do **papel único para todos**: o vazamento
acontece **e a venda conclui com sucesso**. Com papel por cliente, a venda **falha**, com a função
nomeada no erro, e nada é gravado dos dois lados. A camada não impede o defeito: troca escrita
silenciosa no schema alheio por falha barulhenta no caixa, que é a melhor falha disponível.

**O desempate entre as duas formas que satisfazem isso foi operacional, não de isolamento:** um
segredo para guardar e rotacionar em vez de N, e provisionar cliente novo não cria credencial que
alguém precisa entregar ao lugar certo.

**O custo aceito:** o passo intermediário. Se o código esquecer de assumir o papel, a conexão fica
sem privilégio nenhum e leva `permission denied for schema` — erra para o lado seguro.

**O resíduo, declarado:** a credencial é membro dos N papéis, então trocar de cliente **dentro** da
transação é privilégio que ela tem. O que impede é não existir caminho para o chamador emitir comando
novo — mais um motivo para a proibição de SQL montado por concatenação na borda.

**Como aplicar:** `SET LOCAL ROLE`, nunca `SET ROLE` ([[gotcha-set-role-de-sessao-vaza-no-pool]]).
Privilégio concedido: `USAGE` no próprio schema mais `SELECT, INSERT, UPDATE` — sem `CREATE`, sem
`DELETE` (nada no núcleo apaga linha), sem sequência, sem `TEMP`. E `ALTER DEFAULT PRIVILEGES` é
**obrigatório** junto do `GRANT ON ALL TABLES`: sem ele, a tabela criada pela migration seguinte nasce
invisível para o cliente, e o sintoma aparece só no release seguinte, no caixa.

---
name: gotcha-protocolo-simples-do-pg-aceita-multi-statement
description: o driver escolhe protocolo simples quando a consulta não tem **nenhum** parâmetro (`values: []` inclusive), e ali o servidor aceita uma lista de comandos numa mensagem só — o que contém injeção não é "parametrizar", é **ter parâmetro**
type: gotcha
escopo: plataforma
camada: backend
data: 2026-09-11
relaciona: [[gotcha-set-role-de-sessao-vaza-no-pool]], [[convention-o-que-o-banco-impoe-vence-o-que-alguem-lembra]], [[convention-nome-de-schema-e-parametro-nunca-concatenacao]]
tarefa: T-0011
---

**Sintoma:** uma consulta sem parâmetro executa mais de um comando, e a sessão sai diferente do que
entrou. Nenhuma revisão acusa, porque "não tem parâmetro, então não tem injeção" é a intuição.

O driver `pg` escolhe **protocolo simples** quando não há parâmetro ligado — e `query(texto, [])`
conta como não ter. No protocolo simples, o servidor aceita **lista de comandos** numa mensagem só.
Com **um** parâmetro ligado, o mesmo servidor recusa: `42601 cannot insert multiple commands into a
prepared statement`.

**Medido em 2026-09-11**, PostgreSQL 16.15, com o texto `select 1; set role app_t_outro; select 1`:
pelo driver nu, **aceito** — três resultados, e `current_user` vira o outro cliente. E, sem `LOCAL`,
o papel **atravessa o `COMMIT`**: a conexão volta ao pool lendo o cliente errado, sem erro nenhum.

**A frase que precisa mudar:** "usamos parâmetros, então estamos protegidos" descreve uma **prática**.
A propriedade real é **ter parâmetro** — e ela desaparece exatamente nas consultas estáticas, que são
as que ninguém revisa, porque não têm entrada do usuário.

**A saída, e ela é de mecanismo:** forçar **protocolo estendido** no pool inteiro, e aí o servidor
recusa multi-statement mesmo com zero parâmetro. A propriedade deixa de depender de quem escreve a
consulta. O custo é que toda consulta paga Parse/Bind, inclusive `begin` e `commit` — **não medido**,
e é candidato ao primeiro número de `performance` quando existir rota.

**Como aplicar:** o pool da aplicação nasce em protocolo estendido. Antes de afirmar que um caminho
está protegido por parametrização, confira se ele **tem** parâmetro — e prefira fechar o canal a
confiar em quem escreve, que é a regra geral
([[convention-o-que-o-banco-impoe-vence-o-que-alguem-lembra]]). Nota de ferramenta: o campo existe em
`pg` 8.23.0 e **falta** em `@types/pg` 8.23.1, então o compilador não ajuda a lembrar dele.

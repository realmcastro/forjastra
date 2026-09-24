---
name: gotcha-search-path-serve-o-executor-e-vaza-no-pool
description: a solução de alvo do executor de migration não se transporta para o caminho de requisição — conexão devolvida ao pool carrega o `search_path` do cliente anterior e a requisição seguinte lê o schema errado sem nenhum erro de código; em requisição o alvo é qualificação por consulta, nunca estado de sessão
type: gotcha
escopo: plataforma
camada: backend
data: 2026-09-11
relaciona: [[decision-tenancy-schema-por-cliente]], [[convention-nome-de-schema-e-parametro-nunca-concatenacao]], [[gotcha-withschema-nao-alcanca-sql-cru]]
tarefa: T-0011
---

**Sintoma:** uma requisição devolve o dado de outro cliente. Sem exceção, sem log de erro, sem
consulta malformada. E não reproduz sob carga baixa, porque depende de duas requisições caírem na
mesma conexão física.

**A armadilha é a semelhança.** O executor de migration resolve o alvo com `search_path`, e resolve
**bem** — lá quem conecta é o executor, iterando um schema por vez, com conexão dedicada. O desenho
está auditado e aprovado. Copiá-lo para o caminho de requisição parece reaproveitar solução provada,
e é onde ele quebra: **numa requisição, quem conecta atende N clientes.**

`SET search_path` é **estado de sessão**. A conexão volta ao pool carregando o alvo do cliente
anterior; a requisição seguinte, se não reescrever o alvo antes da primeira leitura, consulta o
schema errado — e o Postgres não tem como saber que aquilo é um erro, porque a consulta é válida.

**Medido em 2026-09-11**, PostgreSQL 16.15, com pool de `max: 1` para forçar as duas leituras na
mesma conexão física, dois schemas de cliente com uma linha distinta cada, e uma **isca** em
`public.orders` com um marcador reconhecível, alcançável de propósito. Com qualificação por consulta,
`search_path` permaneceu `"$user", public` nos dois ciclos, cada cliente leu o seu, e a isca nunca
apareceu.

**A saída:** no caminho de requisição, o schema é **qualificado na própria consulta**
(`withSchema`/identificador qualificado), não configurado na sessão. `SET LOCAL` também resolveria,
mas obriga transação em toda leitura; qualificar não tem estado e é mais barato.

**Como aplicar:** antes de reaproveitar qualquer solução de alvo entre camadas, pergunte **quem
conecta** e quantos clientes aquela conexão atende na vida dela. Conexão dedicada e conexão em pool
compartilhado são ambientes diferentes o bastante para inverter o veredito da mesma técnica. Vale
para cache, transação, variável de sessão e qualquer outro estado que sobreviva à requisição.

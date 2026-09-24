---
name: gotcha-withschema-nao-alcanca-sql-cru
description: o qualificador de schema do query builder alcança o que o construtor monta e **não** alcança fragmento SQL cru, que cai no `search_path` da conexão — então um único trecho cru no caminho de requisição reabre o vazamento de tenant que a qualificação fechou
type: gotcha
escopo: plataforma
camada: backend
data: 2026-09-11
relaciona: [[gotcha-search-path-serve-o-executor-e-vaza-no-pool]], [[decision-d-01-fastify-e-kysely]]
tarefa: T-0011
---

**Sintoma:** a mesma consulta funciona corretamente em toda a aplicação, e **um** trecho lê o schema
errado. O trecho tem em comum com os outros tudo, menos ter sido escrito como SQL cru.

`withSchema` qualifica os identificadores que o **construtor** monta. Um fragmento `sql` cru é texto:
o builder o repassa sem interpretar, e os identificadores dentro dele se resolvem pelo `search_path`
da conexão — que, no caminho de requisição, é justamente o que não se deve usar
([[gotcha-search-path-serve-o-executor-e-vaza-no-pool]]).

**Por quê é perigoso além da média:** a defesa de tenant passa a depender de **qual API** o autor
escolheu, não de o código estar certo. Um trecho cru entra por motivo legítimo — uma função que o
builder não cobre, uma expressão de janela, um `ON CONFLICT` mais fino — e o autor não tem nenhum
sinal de que acabou de sair da proteção. O teste passa, porque em desenvolvimento costuma haver um
schema só.

**Como aplicar:** SQL cru no caminho de requisição é **proibido por regra**, não desencorajado por
comentário (`backend.md`). Onde ele for realmente necessário, o identificador de schema entra
qualificado e explícito dentro do próprio fragmento, e o trecho carrega teste que o exerce com dois
clientes. Existe teste que falha no dia em que alguém achar que dá — mantenha-o.

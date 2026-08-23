# Memória — Verticais (conhecimento por ramo, reusável entre clientes)

Um subdiretório por ramo. Leia **só** o do ramo do cliente da sua tarefa.

| Vertical | Índice | Estado |
|---|---|---|
| restaurante | — | **nada registrado aqui de propósito**: a spec da vertical mora em `docs/produto/verticais/restaurante.md` (11 `RN-RES`) e é derivável dela; registro nasce quando aparecer fato do ramo que a spec não deriva |

O que mora aqui: o que o ramo exige e que se repete entre clientes daquele ramo (exigência fiscal,
fluxo operacional típico, jargão, expectativa de hardware). O que é de **um** cliente vai para
`clientes/<cliente>/`. O que vale para qualquer ramo vai para `plataforma/`.

Cuidado com o vício de origem: como o primeiro cliente é um restaurante, é fácil escrever regra de
restaurante como se fosse plataforma. Ver [[decision-forja-e-pdv-modular]].

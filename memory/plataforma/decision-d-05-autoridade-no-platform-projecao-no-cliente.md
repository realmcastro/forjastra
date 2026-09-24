---
name: decision-d-05-autoridade-no-platform-projecao-no-cliente
description: D-05 fechada em 2026-09-23: cada versão de regra fiscal tem autoridade no platform, escrita uma vez; cada cliente com FIS recebe no próprio schema uma projeção com o mesmo id e digest, e o fato aponta para ela por FK local; ordem publicar → projetar → comparar → liberar; vigência em data civil
type: decision
escopo: plataforma
camada: dados
data: 2026-09-23
relaciona: [[decision-d-06-ii-trilha-no-platform-com-projecao-no-cliente]], [[gotcha-default-privileges-entrega-insert-na-projecao]], [[gotcha-digest-sobre-jsonb-nao-confere]]
supera: [[decision-d-05-catalogo-de-regra-fiscal-sem-casa]]
tarefa: T-0020
---

Decidido pelo thread, por delegação do humano, sobre `docs/arquitetura/d-05-catalogo-fiscal-2026-09-23.md`
(a quarta saída, que junta a 1 e a 2), com a consulta de `seguranca` na ficha:

- **Autoridade no `platform`**, uma linha por versão, escrita uma vez. O objeto da regra é o território, e
  nenhum cliente (a residência segue o objeto, como em `D-06`).
- **Projeção no schema do cliente com `FIS`**, com o mesmo id e o mesmo digest. O fato de venda aponta para
  ela por FK dentro do schema. Nenhuma sessão de cliente lê o `platform`.
- **Ordem:** publicar, projetar em cada schema, **comparar a projeção com a autoridade** e só então
  liberar aos terminais do cliente. Quem compara é o executor, com `SELECT` nos dois lados, a cada rodada,
  e divergência é fatal no livro da entrega (`D05-01`).
- **Vigência em `date`**, exceção declarada a `dados.md` §3: a regra começa à meia-noite de cada
  estabelecimento, no fuso dele (`RN-NUC-057`). Guarda de retroatividade na autoridade.
- **Conteúdo em `text` canônico com digest.** Assinatura da versão fica P2.
- **Gravador de projeção** separado do papel do cliente, só `INSERT` e por coluna (sem o instante de
  entrega), declarado. O `REVOKE` do `INSERT`/`UPDATE` que o `ALTER DEFAULT PRIVILEGES` dá ao papel do
  cliente vai na mesma transação que cria a projeção, e o `verify` afirma a ausência com
  `pg_has_role(..., 'SET')`.

**Por quê:** a saída 3 contradiz `RN-FIS-009` (regra nova sem release). Com autoridade única, a
divergência entre clientes não é impedida (impedir bloquearia a venda), e sim detectada numa consulta
dentro do schema.

**Como aplicar:** o item de `FIS` herda `D05-01` e a pergunta invertida de `TRL-04` juntos. A stream
`modules/**` ainda não roda (sem registro de módulo ativo), e o gravador precisa de espécie de declaração
própria, desenhada junto com a da borda de `D-03` e o grupo do `PAP-28`.

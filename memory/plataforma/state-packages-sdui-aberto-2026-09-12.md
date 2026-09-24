---
name: state-packages-sdui-aberto-2026-09-12
description: packages/sdui existe desde 2026-09-12 com o vocabulário de bloco e o analisador do manifesto, sem nenhuma dependência de runtime; apps/web continua fechado, e o CLAUDE.md §2 ainda diz que packages/** é proibido
type: state
escopo: plataforma
camada: sdui
data: 2026-09-12
relaciona: [[decision-vocabulario-de-bloco-tem-espelho-executavel]], [[decision-d-02-arranjo-d]]
tarefa: T-0012
---

**`packages/sdui/**` foi aberto antes da fase que o criaria** (Fase 3), com a mesma justificativa
que abriu `apps/api/**` em 2026-09-11: o que está lá dentro **não depende do modelo de venda nem
do contrato de rota**, então a fase seguinte não o refaz. Verificado no fechamento de `T-0012`: o
pacote não importa nada fora dele além de `node:test` e `node:assert` nos testes, e `source` do nó
é string **opaca**, carregada e nunca resolvida.

O que existe: vocabulário fechado de 8 papéis com registro de prefixos e livro de publicados
(`src/vocabulary/`), analisador tolerante, despacho tipado com piso e a escada rede → cache → piso
(`src/manifest/`). 22 arquivos, o maior com 229 linhas, TypeScript estrito, **zero dependência de
runtime** — só `typescript` e `@types/node`, nas mesmas versões de `apps/api`.

O que **não** existe lá, e não deve nascer antes da Fase 3: componente, tema, resolução de variante,
prop tipada por papel. `apps/web/**` continua **fechado**.

**Três divergências abertas, e nenhuma trava trabalho:**

- **`CLAUDE.md` §2 ainda diz que `packages/**` é proibido.** Está desatualizado desde 2026-09-12.
  Quem corrige é o humano ou o thread principal, não agent.
- **Não há workspace na raiz** (nenhum `package.json` em `/`): cada pacote se instala sozinho, então
  `apps/api` ainda **não resolve** `@forja/sdui`. Importar o tipo de id no emissor exige decidir a
  forma de resolução antes — dono `backend`.
- **V-02 em aberto:** os nomes dos campos do nó são provisórios e moram em
  `src/manifest/wire.ts`, num lugar só, com teste que os fixa. Fechar V-02 é editar esse arquivo e
  ver um teste falhar.

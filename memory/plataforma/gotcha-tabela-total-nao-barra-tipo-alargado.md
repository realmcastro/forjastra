---
name: gotcha-tabela-total-nao-barra-tipo-alargado
description: tabela total sobre união de literais (Record<BlockKind, fn>) impede membro faltando e não impede alguém declarar Record<string, fn> e atribuir — TypeScript não tem tipo de objeto exato, então a checagem de excedente só alcança o literal
type: gotcha
escopo: plataforma
camada: sdui
data: 2026-09-12
relaciona: [[decision-vocabulario-de-bloco-tem-espelho-executavel]]
tarefa: T-0012
---

**Sintoma:** ninguém vê sintoma. O código compila, os testes passam, e a garantia que se acreditava
ter no tipo ("papel novo quebra quem despacha") continua valendo para quem escreve a tabela como
literal e deixa de valer para quem a declara alargada.

`BlockRenderers<T> = { readonly [K in BlockKind]: (node: NodeOf<K>) => T }` entrega duas coisas de
verdade: tabela **incompleta** não compila, e o piso (`block.fallback`) é membro obrigatório, então
piso opcional não existe. O que ela **não** entrega: barrar um
`Record<string, (node: unknown) => T>` declarado à parte e atribuído no lugar dela. TypeScript não
tem tipo de objeto exato; o que pega o membro a mais é a checagem de propriedade excedente, e ela
só alcança o **literal**.

**Por quê importa aqui:** a lei 12 do sistema de design (`vocabulario-e-eixos.md` §5) proíbe mapa
`kind → Component` genérico justamente porque ele apaga a checagem de props no único ponto em que o
dado vem da rede. O tipo fecha a porta comum e deixa aberta a porta de quem alarga de propósito —
nessa, quem cobra é a revisão, não o compilador.

**Como aplicar:** vale para **qualquer** tabela exaustiva sobre união de literais, não só a de
renderizadores — inclui o emissor de manifesto em `apps/api`, quando ele nascer. Duas regras de
revisão: a tabela se escreve como **literal** no ponto de declaração, e o tipo de quem a recebe é o
mapeado, nunca `Record<string, …>`. Tabela montada por espalhamento de um objeto de tipo largo é
achado de revisão, mesmo compilando. Está anotado em `packages/sdui/src/manifest/dispatch.ts:18`.

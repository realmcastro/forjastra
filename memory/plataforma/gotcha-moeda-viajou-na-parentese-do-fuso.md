---
name: gotcha-moeda-viajou-na-parentese-do-fuso
description: o conflito de escopo da moeda (do cliente ou do estabelecimento?) existia desde sempre e nunca foi perguntado, porque andava dentro do parêntese da lacuna do fuso — duas regras aprovadas discordavam e nenhuma revisão acusava, já que a segunda metade nunca teve enunciado próprio
type: gotcha
escopo: plataforma
camada: dados
data: 2026-09-11
relaciona: [[gotcha-fuso-do-estabelecimento-versus-fuso-do-cliente]], [[business-rule-estabelecimento-e-entidade-datada-nunca-campo]]
tarefa: T-0009
---

**Sintoma:** duas regras aprovadas se contradizem, várias revisões passam por cima das duas, e
ninguém acusa.

`RN-NUC-013` escrevia os atributos como "moeda, fuso (`LACUNA-NUC-001`)". A lacuna referenciada
perguntava **só sobre o fuso**. A moeda pegou carona no parêntese: ficou visualmente coberta por uma
pergunta em aberto que não era sobre ela. Toda revisão que olhou aquela linha viu uma lacuna
declarada e seguiu. A pergunta "a moeda é do cliente ou do estabelecimento?" só foi escrita em
2026-09-11, como `LACUNA-NUC-041`, ao modelar a entidade.

**Por quê é grave:** uma lacuna aberta é um pedido de atenção, e ela **protege** o item que nomeia.
Um item que divide parêntese com ela herda a proteção sem herdar a pergunta — fica marcado como
"sabemos que falta" sem que nada falte formalmente. É pior do que não ter lacuna nenhuma, porque a
ausência de marca pelo menos chama revisão.

**O custo concreto aqui:** se a moeda for do estabelecimento, ela não é coluna do cliente, e trocar
depois é expand/contract em N schemas de cliente.

**Como aplicar:** cada item que espera decisão tem **lacuna própria, com enunciado próprio**. Lista
de dois ou mais atributos com uma referência de lacuna no fim é defeito de escrita: ou a lacuna cobre
todos e o enunciado dela os nomeia, ou cada um ganha a sua. Ao ler regra com parêntese de lacuna,
confira se o enunciado da lacuna alcança **cada** item da lista — foi assim que esta apareceu.

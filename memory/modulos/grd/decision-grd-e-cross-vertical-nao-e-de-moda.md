---
name: decision-grd-e-cross-vertical-nao-e-de-moda
description: GRD é módulo cross-vertical e não de moda — uma loja de polpa de fruta precisa de eixo (sabor × peso) e não é moda; o carimbo "ligado por vertical (varejo de moda)" e a classificação de Grade como léxico de moda no glossário contradizem o corpo da própria entrada, que já nomeia "sabor"
type: decision
escopo: modulo:GRD
camada: produto
data: 2026-09-11
relaciona: [[business-rule-variacao-exige-conjunto-fechado-quantidade-nao]], [[decision-forja-e-pdv-modular]], [[gotcha-board-spr-e-nomeado-pela-vertical]]
---

`GRD` atende **qualquer** negócio cujo produto tem eixos de variação com lista fechada. Não é módulo
de vestuário.

**A prova, e ela está dentro do próprio repositório:** `docs/produto/catalogo-de-modulos.md:253`
nomeia os eixos como "cor, tamanho, **sabor**", e `catalogo-de-capacidades.md:247` repete os três.
Sabor não é moda. A mesma entrada que carimba o módulo como "ligado por vertical (varejo de moda)"
já descreve um eixo que só existe fora da moda. `glossario.md:242` repete o defeito, classificando
`Grade | variant_matrix` como léxico de moda.

**O que revelou:** duas lojas vizinhas reais trazidas pelo humano em 2026-09-11, uma de roupa e uma
de polpa de fruta. A hipótese dele era que fosse um módulo só. É, e ele já existe. Nenhuma linha de
"Expõe" ou "Exige" de `GRD` muda entre as duas lojas, e o comportamento com o módulo **desligado** é
o mesmo nas duas. Se a construção fosse de ramo, essas listas divergiriam.

**Por quê importa mais do que uma etiqueta errada:** é o erro de framing do `CLAUDE.md` §7.3
acontecendo de novo, um ramo abaixo. Carimbo de vertical num módulo faz o próximo leitor não procurar
`GRD` quando o cliente não é loja de roupa, e a capacidade se duplica num módulo novo com outro nome.
É o mesmo mecanismo de [[gotcha-capacidade-sem-dono-entra-pelo-titulo-do-card]], ao contrário:
capacidade **com** dono, escondida por um rótulo.

**Como aplicar:** `GRD` se liga por necessidade do catálogo do cliente, nunca por ramo. As três
correções de vocabulário (mover `Grade` no glossário, tirar o carimbo de vertical do catálogo de
módulos, criar a entrada de **combinação vendável**) estão prontas em
`docs/produto/dois-varejos-corpo-de-prova-2026-09-11.md` §10 e entram numa passada só, junto com a
resposta de `G-04`.

---
name: business-rule-variacao-exige-conjunto-fechado-quantidade-nao
description: o valor que descreve a unidade vendida é variação se vem de lista fechada do cadastro, quantidade se é medido no ato da venda, e descrição se não muda qual unidade sai; "1 kg" é as três coisas conforme a loja, e tratar peso aferido como eixo de variação produz cadastro sem fim
type: business-rule
escopo: plataforma
camada: produto
data: 2026-09-11
relaciona: [[gotcha-fronteira-cruzada-por-digitacao-de-cadastro]], [[decision-forja-e-pdv-modular]]
---

Três coisas diferentes se parecem no cadastro e têm donos diferentes. O teste que as separa:

```
valor vem de lista fechada definida no cadastro   → VARIAÇÃO    (módulo GRD)
valor é medido no instante da venda               → QUANTIDADE  (núcleo)
valor só descreve, sem mudar qual unidade sai     → DESCRIÇÃO   (módulo PUB)
```

Critério formal: **variação exige conjunto de valores fechado; quantidade medida não tem conjunto
fechado.**

`1 kg` é as três coisas, conforme a loja. Pote de polpa de 1 kg ao lado de um de 500 g: conjunto
fechado, é variação. Polpa pesada na balança: medida no ato, é quantidade. "Aproximadamente 1 kg"
impresso no rótulo de um produto que sai sempre igual: descrição.

**Por quê:** forçar peso aferido a virar eixo de variação produz um cadastro sem fim, e **o sintoma
aparece no cadastro, não na venda**, que é onde ninguém olha. A venda continua funcionando enquanto o
cadastro apodrece. `.claude/rules/dados.md` §3 já resolve o caminho da balança (`numeric` com escala
declarada) e **não toca** o da embalagem fechada, que é a lacuna `G-04`.

**Como aplicar:** antes de modelar qualquer atributo de produto, rode o teste. Na dúvida entre
variação e quantidade, pergunte se existe lista fechada: se o comerciante pode digitar um valor novo
durante a venda, não é variação. Vale para a Fase 1 inteira, e errar aqui sai por migration em N
schemas.

Corpo de prova: duas lojas reais (roupa e polpa de fruta), em
`docs/produto/dois-varejos-corpo-de-prova-2026-09-11.md`.

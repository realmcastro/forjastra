---
name: convention-corrigir-dentro-da-linha-quando-o-arquivo-esta-no-teto
description: arquivo no teto de 400 cujas linhas são citadas por path:linha em território que o agent não edita se corrige dentro da linha, não partindo — partir cria referência pendurada que o dono não pode consertar
type: convention
escopo: processo
camada: processo
data: 2026-08-23
relaciona: [[gotcha-endereco-de-relatorio-envelhece-na-propria-sessao]]
tarefa: T-0003
---

Partir arquivo é a saída padrão para o teto de 400 linhas. Ela **não** vale quando as linhas daquele arquivo
são citadas por `path:linha` de dentro de um território que o agent não pode editar: partir move o conteúdo e
deixa a citação apontando para outra coisa, e o agent não tem como consertar do outro lado. A saída é
reescrever **dentro da linha** — comprimir o texto existente, saldo zero — e declarar o custo: o próximo
crescimento obriga a partição, e ela tem que vir no mesmo despacho de quem reaponta as referências.

**Por quê:** referência pendurada é pior que arquivo apertado. Arquivo apertado é visível e mede; citação que
aponta para o lugar errado passa por correta e é lida como verdade. Aconteceu em 2026-08-23 com um arquivo
fiscal em 400 linhas citado por dois dossiês de arquitetura — o agent recusou partir, e a recusa estava certa.

**Como aplicar:** antes de partir, busque quem cita o arquivo. Todas as citações no seu território? Parta. Há
citação fora dele? Reescreva dentro da linha e reporte a partição como pendência com dono, ou peça o despacho
conjunto.

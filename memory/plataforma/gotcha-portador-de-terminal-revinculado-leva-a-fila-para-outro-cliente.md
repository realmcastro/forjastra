---
name: gotcha-portador-de-terminal-revinculado-leva-a-fila-para-outro-cliente
description: encerrar estabelecimento revoga a habilitação e não descomissiona o aparelho; vendido junto com a loja e habilitado em Y, o terminal drena a fila de X resolvida pelo registro atual, gravando vendas de X em t_y ou perdendo-as
type: gotcha
escopo: plataforma
camada: seguranca
data: 2026-09-23
relaciona: [[decision-d-03-opcao-c-sujeito-local-ao-cliente]]
tarefa: T-0015
---

`IDN-01` do gate de `D-03`. O caminho: `RN-NUC-059` revoga, `RN-NUC-061` aceita habilitar porque não há
habilitação vigente, e o registro do terminal resolve o cliente pelo estado atual.

**Como aplicar:** o cliente de um fato vem do portador que o produziu, e o portador nunca é revinculado.
Aparelho com passado em outro cliente só habilita depois de drenar ou de declarar a fila na origem.

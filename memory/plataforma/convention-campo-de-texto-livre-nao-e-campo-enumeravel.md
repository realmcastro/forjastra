---
name: convention-campo-de-texto-livre-nao-e-campo-enumeravel
description: enumerar um campo de texto livre de terceiro numa RN não abre leitura sobre o conteúdo dele — estreitamento por enumeração só funciona quando a RN dona é enumerada na mesma passada, e é inócuo onde a enumeração preexistia e contém texto opaco
type: convention
escopo: plataforma
camada: produto
data: 2026-08-23
relaciona: [[decision-celula-e-autoridade-unica-sobre-autorizacao]]
tarefa: T-0003
---

`AUT-12`: a leitura derivada libera "os campos que a `RN` dona enumera", e `RN-OFF-012` **já**
enumerava "motivo preservado literalmente" — que `RN-OFF-027` diz poder conter identificação do
comprador. O estreitamento não alcançou nada ali.

**Padrão geral, e é o que vale guardar:** estreitar leitura por enumeração de campo é **eficaz onde a
`RN` dona foi enumerada na mesma passada** e **inócuo onde a enumeração preexistia e contém texto
opaco**. Campo de texto livre não é campo enumerável por si — o nome do campo é conhecido, o conteúdo
não.

**Como aplicar:** para abrir leitura sobre campo de texto de terceiro, a `RN` declara as três coisas:
(1) que a decisão pede o **literal**, (2) **quem** o alcança — o papel mais estreito —, e (3) que ele
**não vai** para contagem, lista, relatório nem exportação. Sem as três, a superfície mostra
**presença**, não conteúdo. Vale para toda `RN` que enumere campo de texto livre, hoje e depois.

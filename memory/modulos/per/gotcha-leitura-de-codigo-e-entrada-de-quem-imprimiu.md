---
name: gotcha-leitura-de-codigo-e-entrada-de-quem-imprimiu
description: o que passa pelo leitor de código foi impresso por terceiro e pode ser documento de pessoa, cobrança instantânea com CPF, boleto ou credencial ao portador; "registrar cada leitura" sem dizer o que entra no fato vira captura de dado pessoal pelo invariante 10
type: gotcha
escopo: modulo:per
camada: seguranca
data: 2026-09-23
relaciona: [[decision-codigo-lido-entra-so-como-gtin-global]]
tarefa: T-0016
---

A auditoria `docs/auditorias/2026-09-23-codigo-lido-no-fato.md` achou `COD-01`. `perifericos.md`
registrava "cada leitura de código" sem dizer o que da leitura entra no fato. Pelo invariante 10, esse
silêncio vira captura: o operador lê o QR do documento do cliente-final, e nome, CPF e nascimento viram
fato no schema do cliente.

**Como aplicar:** toda spec que registra leitura declara o que da leitura entra no fato. O conteúdo
lido fica fora por padrão. A exceção única é o GTIN global em contexto de lançar item
([[decision-codigo-lido-entra-so-como-gtin-global]]). Valor truncado ou com hash não resolve: truncado
vaza prefixo, e CPF com hash se reverte por força bruta.

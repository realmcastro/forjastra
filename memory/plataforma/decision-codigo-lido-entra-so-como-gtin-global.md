---
name: decision-codigo-lido-entra-so-como-gtin-global
description: o fato de identificador de item não resolvido carrega sempre comprimento, simbologia e classe estrutural, e o valor só quando a classe é gtin_global em contexto de lançar item; a classe se calcula no terminal pela GS1 R26, antes de qualquer log, e o valor só o cliente lê
type: decision
escopo: plataforma
camada: produto
data: 2026-09-23
relaciona: [[decision-capturar-e-o-padrao-nao-capturar-exige-justificativa]], [[gotcha-leitura-de-codigo-e-entrada-de-quem-imprimiu]]
tarefa: T-0016
---

`LACUNA-PER-6` nasceu como `RN-NUC-063` (`docs/produto/fatos-de-operacao-dominios-fechados.md:137`),
com motivo próprio `item_identifier_unresolved`. A regra tem dois degraus:
- **degrau 1, sempre:** comprimento, simbologia (`ean_upc`, `other_linear`, `two_dimensional`,
  `unknown`) e a classe `gtin_global | gtin_restricted | not_gtin`;
- **degrau 2:** o valor, só dígitos e até 14, quando a classe é `gtin_global` e o contexto é lançar
  item. Esse valor nunca entra em contexto de identificar pessoa, nunca vai ao escopo `provedor` nem a
  agregado sobre clientes, e nunca vai a registro de erro ou diagnóstico.

A tabela de classe está na própria regra, pela GS1 General Specifications R26 (2026-01). ISBN e ISSN
(`977`–`979`) contam como global. `05` fica como `not_gtin` porque as fontes divergem. "Identificador
válido" quer dizer "entregue completo", e **não** "ser `gtin_global`": a classe nunca muda o desfecho do
lançamento.

**Por quê:** manter o código sempre fora perdia saber **qual** item faltou no catálogo retido, que é o
aceite 1. O valor de GTIN global é dado de catálogo, não de pessoa. O que passa pelo leitor também pode
ser documento, cobrança instantânea, boleto ou credencial, e só a estrutura GTIN separa esses casos
offline.

**Como aplicar:** a classificação roda no terminal, no instante em que o fato se forma e antes de
qualquer log. Falha ao classificar vira `not_gtin`, sem valor. Nova edição da GS1 que realoque faixa
muda a tabela da regra por alteração datada. O identificador AIM vem desligado de fábrica, então nada
depende dele.

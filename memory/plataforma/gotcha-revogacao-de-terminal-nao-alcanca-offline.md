---
name: gotcha-revogacao-de-terminal-nao-alcanca-offline
description: revogação é ato do servidor e terminal offline não a recebe — então "terminal furtado não vende mais" é falso; a janela é o prazo de habilitação e ela se declara, com as duas datas na notificação ao cliente
type: gotcha
escopo: plataforma
camada: produto
data: 2026-08-23
relaciona: [[business-rule-habilitacao-a-vender-do-terminal-tem-prazo]], [[business-rule-ato-ordinario-versus-operacao-sensivel]]
tarefa: T-0003
---

**Sintoma:** spec afirmando que o terminal furtado "perde a habilitação" ou "não pratica mais ato ordinário",
sem janela. A frase parece uma garantia e é uma promessa que a física do offline não cumpre.

Revogar é ato do **servidor**. Um dispositivo sem rede **não recebe** revogação. Logo quem tem o terminal em
mãos pratica ato ordinário até a habilitação **vencer por tempo sem contato** — exposição inerente, limitada
pelo prazo, **nunca zero**. Foi `AUT-16`, e a mesma frase falsa apareceu em **três** pontas, uma delas dentro
da própria regra que criou o prazo.

**Por quê:** é o mesmo argumento que já tinha dado prazo à capacidade de assinar, aplicado à capacidade de
vender — e a assimetria passou porque cada regra foi escrita num despacho diferente. Afirmar janela zero é
literalmente a frase que o motivo de `RN-EMI-037` proíbe escrever.

**Como aplicar:** toda capacidade retida no terminal declara prazo e janela. Notificação ao cliente sobre
terminal comprometido carrega **as duas** validades — até quando a capacidade de assinar valia **e** até
quando o terminal ainda vende. Ao escrever "perde X na hora", pergunte: na hora **onde**? Se a resposta é "no
servidor", o texto precisa dizer isso.

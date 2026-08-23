---
name: gotcha-nenhuma-superficie-nossa-enumera-clientes-para-escolher
description: superfície nossa nunca lista clientes para o operador escolher, porque escolher numa lista É resolver o alvo pelo que o pedido informa — é a derivação, na tela, do achado CRÍTICO da T-0004
type: gotcha
escopo: plataforma
camada: produto
data: 2026-08-23
relaciona: [[decision-leitura-e-mutacao-sao-eixos-independentes]], [[gotcha-a-trava-que-nunca-cai-nao-e-a-inercia]]
tarefa: T-0004
---

**Sintoma:** a primeira tela que qualquer um desenha para um console de operação é um seletor de cliente —
uma lista, uma busca, um combo. Parece requisito óbvio e é o defeito.

**O fato:** o cliente-alvo de um ato nosso **nunca** se resolve a partir de identificador que o pedido
informa; ele é resolvido antes, fora do pedido, e o objeto é resolvido **dentro** dele. Identificador que o
pedido carregue pode, no máximo, **confirmar** o alvo já resolvido, e divergência é **recusa** — nunca
correção silenciosa. Escolher numa lista é precisamente informar o alvo no pedido. Corolário do mesmo eixo:
**nenhuma superfície nossa tem cliente-alvo implícito** — default de tenant em papel nosso é o pior default
deste sistema.

**Por quê a proibição é maior do lado nosso:** do lado do cliente, "não enumerar" protege o catálogo de
operações. Do nosso, protege a **carteira** — a lista de quem são os nossos clientes é informação comercial
que a tela entrega de graça, e o vazamento nem precisa de acesso indevido.

**Por quê ela é fácil de perder:** ela **não é** inércia esperando decisão; é propriedade permanente. Já foi
retirada uma vez (foi o achado `CRÍTICO` da T-0004: um papel que **escreve** em N clientes ficou fora da
única cláusula do repositório que proíbe resolver escopo por identificador informado, e a exclusão se
justificava por propriedade do **sujeito** numa regra que só fala do **objeto**). A retirada **não produziu
sintoma nenhum** — e é ela que faz o console *parecer* difícil de construir.

**Como aplicar:** um ato nomeia **exatamente um** cliente; alcançar o segundo exige ato novo de resolução,
registrado. O alvo é visível a quem opera e nomeado no registro do ato. Antes de declarar uma regra
inaplicável a um sujeito novo, pergunte **de que lado ela fala** — objeto ou sujeito.

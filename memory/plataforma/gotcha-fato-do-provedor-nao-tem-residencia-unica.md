---
name: gotcha-fato-do-provedor-nao-tem-residencia-unica
description: existe ao menos uma classe de fato nosso — a tentativa recusada — para a qual nenhum ambiente de cliente é escolhível, logo não existe regra única de residência para os fatos do provedor; é derivação, não preferência, e o argumento fácil para ela é FALSO
type: gotcha
escopo: plataforma
camada: dados
data: 2026-08-23
relaciona: [[decision-d-06-sao-tres-residencias-nao-uma]], [[convention-gravar-a-propria-trilha-nao-e-mutacao]]
tarefa: T-0004
---

**Sintoma:** alguém propõe "todos os fatos da nossa operação moram em X" — e a proposta é
irrefutável até chegar no fato de **tentativa recusada** (`provider_read_refused`).

**O fato:** quando um papel nosso pede o que o eixo dele não alcança, ou pede sobre um cliente que ele não
alcança, a tentativa tem de ficar registrada. Nesse instante **não existe cliente-alvo resolvido** — a
resolução é exatamente o que falhou —, e escolher a residência pelo identificador que o pedido informou é
usar o identificador que a regra acabou de declarar **não-autoritativo**. Logo esse fato mora do nosso
lado, **necessariamente**, e qualquer regra única de residência já está descartada por construção.

**O argumento falso, que é o primeiro que ocorre e ficou registrado como recusado:** "gravá-lo no ambiente
do cliente exigiria a escrita que a recusa acabou de negar, e se o ator a tivesse a recusa seria inócua."
É **falso**: quem grava não é o ator, é a **plataforma**, que escreve em todo schema por construção
([[convention-gravar-a-propria-trilha-nao-e-mutacao]]). O motivo correto é a **classe em que a resolução
do alvo falhou**, não a falta de escrita.

**Por quê importa guardar o argumento errado junto da conclusão certa:** conclusão certa sustentada por
argumento falso morre na próxima leitura — quem derruba o argumento derruba a restrição com ele, e a
restrição é o que protege o desenho. E a formulação geral tem de ser escolhida com cuidado: "na recusa não
existe alvo resolvido" **não** é verdade em todos os casos (na recusa por **divergência**, o alvo existe —
é o cliente em que se trabalhava). A restrição vale pela **classe em que a resolução falhou**, e é assim
que ela é verdadeira sempre, não na maioria.

**Como aplicar:** ao propor residência, teste primeiro o **caso de falha** do próprio mecanismo. E ao
trocar um argumento por outro, deixe o velho escrito e recusado no lugar dele — apagar deixa a conclusão
sem lastro.

---
name: gotcha-motivo-enumerado-que-engole-dois-diagnosticos
description: quando uma lista fechada de motivos tem um item próximo o bastante, o implementador encaixa a causa nova nele — e o encaixe manda consertar a coisa errada sem produzir nenhum sintoma; o motivo que falta nasce na mesma passada da regra ou não nasce
type: gotcha
escopo: plataforma
camada: produto
data: 2026-09-11
relaciona: [[decision-capturar-e-o-padrao-nao-capturar-exige-justificativa]], [[gotcha-regra-nova-que-nao-corrige-a-celula-nasce-inerte]], [[convention-ausencia-decidida-versus-acidental]]
tarefa: T-0009
---

**Sintoma:** um diagnóstico que aponta consistentemente para a causa errada, e uma série de dados que
parece saudável porque todo evento foi classificado com sucesso.

**Os dois casos achados em 2026-09-11**, varrendo as specs contra o invariante 10:

- **identidade não reconhecida** cairia em `authority_absent`, que diagnostica **configuração de
  papel**. `RN-OFF-033`(a) diz explicitamente que identificar não é autorizar. O encaixe manda
  consertar o papel do operador quando a causa real é a reconciliação da identidade no terminal.
- **perda de corrida** cairia em `business_precondition_unmet`, que já carrega sessão fechada e
  pedido sem item. Colisão entra ali e **some** — vira indistinguível de dois outros casos.

**Por quê acontece:** lista fechada é o mecanismo certo (`dados.md` §3 prefere lookup a `enum`), e
justamente por ser fechada ela força uma escolha. Quando nenhum item descreve a causa nova, o
implementador não para: ele escolhe o mais próximo, porque parar custa uma conversa e encaixar custa
nada. E o encaixe **não gera sintoma** — o evento é registrado, a contagem fecha, o gráfico existe.
O defeito só aparece quando alguém age sobre o diagnóstico e conserta a coisa errada.

**A trava que fecha a janela:** por `RN-NUC-043`, enumerar depois não estreita o que já foi gravado.
O motivo **nasce junto da regra que cria a causa, ou não nasce** — os eventos passados ficam
classificados errado para sempre, e não há backfill que os separe.

**Como aplicar:** ao escrever regra que cria uma causa de recusa, de falha ou de interrupção, abra a
lista fechada correspondente **na mesma passada** e confira se existe item que a descreva **sem
ambiguidade**. "Dá para usar aquele ali" é o sintoma, não a solução. É a mesma mecânica de
[[gotcha-regra-nova-que-nao-corrige-a-celula-nasce-inerte]]: regra nova que não atualiza o registro
enumerado que a expressa nasce inerte, e aqui nasce pior que inerte, nasce mentindo.

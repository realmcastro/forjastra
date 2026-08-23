---
name: gotcha-a-trava-que-nunca-cai-nao-e-a-inercia
description: das travas que hoje impedem o escopo `provedor` de operar, duas EXISTEM para cair, uma nunca cai e é a única cuja queda não tem sintoma (o default fechado do escopo), e a coisa que ninguém pode remover não é trava nenhuma — é a cláusula do cliente-alvo fora do pedido
type: gotcha
escopo: plataforma
camada: seguranca
data: 2026-08-23
relaciona: [[gotcha-nenhuma-superficie-nossa-enumera-clientes-para-escolher]], [[decision-celula-e-autoridade-unica-sobre-autorizacao]], [[gotcha-regra-nova-que-nao-corrige-a-celula-nasce-inerte]]
tarefa: T-0004
---

**Sintoma:** o escopo `provedor` está escrito por inteiro e **não opera nada**. Alguém vai chamar isso de
bug e destravar tudo de uma vez. Quatro coisas parecem a mesma coisa e não são.

1. **Transitória, existe para cair:** o mecanismo que resolve o cliente-alvo fora do pedido não está
   decidido (`D-03`, terceiro eixo). Cai com a decisão do humano.
2. **Transitória, existe para cair:** nenhum papel nosso é atribuível enquanto a leitura da trilha não tiver
   célula. Cai com a célula.
3. **Permanente, e a única cuja queda não tem sintoma:** o **default fechado do escopo** — operação sem
   célula é negada. Se ela cair, a operação simplesmente **funciona**, e nada acusa. Escopo novo declara o
   próprio default **na passada em que nasce**: apontar para a regra de outro escopo importa a citação, não
   a trava, porque aquela regra está escrita sobre "as duas matrizes" e "os cinco papéis".
4. **Não é trava, e jamais cai:** o **cliente-alvo nunca vem do pedido**
   ([[gotcha-nenhuma-superficie-nossa-enumera-clientes-para-escolher]]). Não é inércia esperando resposta, é
   propriedade permanente — já foi retirada uma vez, a retirada não produziu sintoma, e é ela que faz o
   console *parecer* difícil.

**Por quê importa:** congelar 1 e 2 congela o console; remover 3 ou 4 abre o sistema. Quem destrava rápido
confunde as quatro, e o **sinal de que confundiu** é uma delas caindo sem ato datado.

**Como aplicar:** inoperância declarada é desfecho, não defeito. Ao propor destravar, diga qual das quatro
está caindo e por qual ato. E prefira **inércia declarada** a negativa absoluta quando a pergunta é do
humano: as duas dão hoje o mesmo desfecho, e a inércia é reversível pela resposta, enquanto o piso só se
desfaz por ato datado com custo escrito e célula corrigida.

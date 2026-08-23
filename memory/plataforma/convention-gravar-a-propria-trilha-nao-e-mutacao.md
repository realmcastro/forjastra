---
name: convention-gravar-a-propria-trilha-nao-e-mutacao
description: o eixo de mutação mede alcance sobre o dado do negócio do cliente, nunca sobre o registro do próprio ato — e promessa de trilha se escreve como RESULTADO (o cliente lista, nós não encurtamos), nunca como lugar
type: convention
escopo: plataforma
camada: produto
data: 2026-08-23
relaciona: [[decision-leitura-e-mutacao-sao-eixos-independentes]], [[decision-d-06-sao-tres-residencias-nao-uma]], [[business-rule-registro-de-ato-nomeia-em-que-o-ato-se-sustentou]]
tarefa: T-0004
---

Exigir que toda leitura nossa deixe fato legível pelo cliente parecia obrigar o papel que **só lê** a
**escrever** no ambiente dele — contradição frontal com o eixo de mutação. A saída **não** é abrir exceção:
é definir o que o eixo mede.

**A convenção, duas metades da mesma coisa:**

1. **Gravar a própria trilha não é mutação.** O eixo mede alcance sobre o **dado do negócio do cliente**,
   nunca sobre o registro do próprio ato. Quem grava é a **plataforma**, como precondição da leitura — a
   mesma forma de `RN-NUC-029`, pela qual ninguém diz que o `cashier` "muta" por deixar trilha. Corolários
   que vêm de graça: ninguém suprime o fato, ler **não** concede escrita, e **fato não gravável ⇒ a leitura
   não acontece**.
2. **A promessa se escreve como resultado, não como lugar.** A regra exige que o cliente **liste** as
   nossas leituras e que nós **não** as apaguemos nem encurtemos; ela não escolhe onde o fato mora.
   Residência que não sustenta o resultado é **residência recusada** — não é promessa reduzida.

**Por quê:** exceção nomeada dentro de um eixo é o começo de um segundo eixo — o próximo caso ("mas ligar
módulo também é só registro") entra por analogia e ninguém consegue recusar. Definir *o que o eixo mede*
fecha por construção. E foi a segunda metade que fez a regra sobreviver às **cinco** saídas de `D-06` sem
presumir nenhuma: enquanto a residência estava aberta, a propriedade já era conferível.

**O que é escrevível e o que não é:** "nós não conseguimos apagar" é afirmação de mecanismo, e o mecanismo
não é de produto. O que se escreve são quatro partes conferíveis: a classe está no relógio da **prova**
([[convention-retencao-tem-tres-relogios]]); **nenhuma operação nossa** apaga, edita, suspende ou encurta;
reduzir a janela é ato datado **visível ao cliente antes de valer**; e a janela vigente é declarada, com
truncamento apresentado como truncamento.

**Como aplicar:** toda regra que promete legibilidade ou permanência de registro declara o **resultado** e
deixa a residência para quem decide residência. Regra que nomeia lugar morre na primeira mudança de lugar.

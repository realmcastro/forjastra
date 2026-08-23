---
name: gotcha-o-caso-de-falha-do-mecanismo-novo-e-o-primeiro-lugar-a-olhar
description: três vezes em duas fichas, uma regra criou campo ou fonte de autoridade obrigatória e o sujeito novo não tinha valor possível naquele campo — e a terceira nasceu do conserto da segunda; quem cria sujeito novo entrega o campo dele na mesma passada
type: gotcha
escopo: plataforma
camada: produto
data: 2026-08-23
relaciona: [[gotcha-regra-nova-que-nao-corrige-a-celula-nasce-inerte]], [[business-rule-registro-de-ato-nomeia-em-que-o-ato-se-sustentou]]
tarefa: T-0004
---

**Sintoma:** um campo obrigatório sem valor possível. O construtor descobre isso na implementação, não na
revisão, e resolve por conta própria — do jeito mais barato.

**O padrão, três ocorrências em duas fichas:** o registro do ato tem de declarar **em que o ato se
sustentou**; a lista de fontes é fechada; e cada mecanismo novo criou um sujeito ou uma situação para a qual
**nenhuma** das fontes existentes tem valor. A terceira ocorrência **nasceu do conserto da segunda** — o
conserto criou um sujeito novo (a plataforma gravando por conta própria) e não entregou o campo dele.

**Os dois desfechos, e os dois são defeito:** falha **fechado** perde o rastro (recusa registrada vira recusa
silenciosa, e apaga o rastro de sondagem com identificador alheio); falha **aberto** grava o fato no cliente
errado, ou grava um valor falso porque era o único disponível.

**A saída não é escolher entre os dois:** é declarar **de que sujeito** a obrigatoriedade fala. A
obrigatoriedade é do **ato que acontece**; o fato da tentativa **recusada** é outro sujeito, e não a herda.
Definir o sujeito fecha por construção; abrir exceção nomeada convida o próximo caso por analogia.

**A leitura operacional, que é o valor deste registro:** toda vez que uma regra cria **sujeito**, **campo
obrigatório** ou **fonte de autoridade**, o primeiro lugar a olhar é o **caso de falha daquele mesmo
mecanismo** — foi ali as três vezes. E o corolário: quem cria sujeito novo entrega o campo dele **na mesma
passada**, do mesmo modo que quem muda desfecho de célula entrega a célula
([[gotcha-regra-nova-que-nao-corrige-a-celula-nasce-inerte]]).

**Consequência de processo, para o humano:** três ocorrências do mesmo padrão em duas fichas é sinal de
**processo**, não de código — e a terceira nascer do conserto da segunda diz que reauditar o conserto não é
zelo, é etapa.

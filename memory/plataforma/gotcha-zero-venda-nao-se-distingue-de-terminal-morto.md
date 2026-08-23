---
name: gotcha-zero-venda-nao-se-distingue-de-terminal-morto
description: sem fato de pedido aberto, "zero venda às 15h" e "o terminal morreu no terceiro item às 15h" produzem a MESMA série — a hipótese offline fica infalsificável, e é o argumento mais forte de `LACUNA-NUC-038`
type: gotcha
escopo: plataforma
camada: dados
data: 2026-08-23
relaciona: [[convention-fato-nao-carrega-campo-de-calendario]], [[decision-d-06-sao-tres-residencias-nao-uma]]
tarefa: T-0004
---

**Sintoma:** um buraco na curva de vendas, e duas explicações — a operação parou, ou o registro parou — sem
nenhum dado que escolha entre elas.

**O fato:** por regra vigente, pedido em construção é **local ao terminal** e "pedido morto não é venda:
nada sobe". Logo os quatro fatos de ciclo de vida do pedido (aberto, item lançado que foi retirado, item
retirado, abandonado) **não existem** hoje no servidor. A consequência que ninguém tinha nomeado: a série
de venda passa a ter duas explicações para todo vale e **nenhuma forma de escolher** — a hipótese offline
fica **infalsificável**. Isso não é perda de relatório, é perda de capacidade de diagnóstico do próprio
produto.

**Por quê é irrecuperável:** não há backfill. Fato de ciclo de vida nasce no instante ou não existe. Cada
dia sem a decisão é um dia de fato que não volta — e a decisão **não é retroativa**. Junto com a hipótese
infalsificável caem: o **denominador** (nenhuma taxa de conversão jamais existe, para trás, em nenhuma
janela), a **cesta quase vendida** (o insumo mais direto para sugerir melhoria ao cliente), o tempo até
concluir, **em que passo** a desistência acontece, o par lançar↔retirar (erro de operação × indecisão ×
falta de produto ficam indistinguíveis) e defeito **nosso** de superfície visto em N clientes.

**O piso, que é piso e não alternativa:** o terminal **conta** pedidos mortos e sincroniza só a contagem,
com primeiro instante, último instante e contagem. Salva o denominador e nada mais — contagem responde
"quantos", nunca "o que eles queriam".

**Como aplicar:** capturar isso **revoga cláusula vigente**, e revogar cláusula vigente é ato datado do
humano, nunca efeito colateral de uma lista de fatos. O mecanismo proposto preserva a regra do pedido local:
o que sincroniza não é o pedido, é fato aditivo próprio. Quem for medir "vendeu menos" antes dessa decisão
declare, no próprio relatório, que a hipótese alternativa não é testável.

---
name: gotcha-capacidade-sem-dono-entra-pelo-titulo-do-card
description: capacidade que não tem escopo, dono nem código em lugar nenhum da spec chega ao board como se fosse núcleo, pelo título do card — "adicional/complemento" entrou assim e três cards passaram a depender dela
type: gotcha
escopo: plataforma
camada: produto
data: 2026-08-26
relaciona: [[gotcha-board-spr-e-nomeado-pela-vertical]], [[gotcha-modelo-agendado-antes-da-regra-que-o-define]]
tarefa: SPR-53
---

**Sintoma:** um termo aparece no título e no critério de aceite de vários cards, todos coerentes
entre si, e ninguém percebe que ele **não existe na spec**. Não tem linha na fronteira, não tem `RN`,
não está no glossário, não tem código de módulo reservado. Mas está no board, escrito com confiança,
e por omissão é lido como núcleo.

Caso concreto: **"adicional / complemento"**. Não é núcleo (padaria e posto não precisam — o teste
dos três negócios falha), não é `PRM`, não é `ECG`, não é `FTC`. Três cards dependiam dela, e um
compunha **valor** a partir dela, contra a lista fechada de `RN-NUC-013`.

**Por quê:** o board aceita qualquer substantivo. A spec não — nela, entidade sem linha de fronteira
e sem termo no glossário simplesmente não existe. O card viaja no meio: ele soa como requisito,
herda a autoridade de estar no board, e a primeira pessoa a implementá-lo cria a tabela. É o mesmo
caminho de [[gotcha-board-spr-e-nomeado-pela-vertical]], só que sem nem o ramo para acusar.

**Como aplicar:** antes de aceitar card que nomeia entidade, procure o termo em `glossario.md` §1. Não
está lá? Ou ele é sinônimo de algo que está — e o card usa o termo canônico — ou é **capacidade sem
dono**, e aí a pergunta é de fronteira, não de implementação. Se o veredito for módulo, o código nasce
no `glossario.md` §4.3 **antes** da spec; se for núcleo, a fronteira ganha linha nova e o teste dos
três negócios tem que passar para os três.

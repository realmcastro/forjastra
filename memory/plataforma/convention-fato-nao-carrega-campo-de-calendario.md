---
name: convention-fato-nao-carrega-campo-de-calendario
description: fato carrega só o instante — dia, data de negócio, faixa horária, mês e turno são derivação de LEITURA; é isto que faz a família de fatos sobreviver ao conflito de fuso fechando para qualquer lado
type: convention
escopo: plataforma
camada: dados
data: 2026-08-23
relaciona: [[gotcha-fuso-do-estabelecimento-versus-fuso-do-cliente]], [[decision-tenancy-schema-por-cliente]]
tarefa: T-0004
---

Nenhum fato nasce com `business_date`, faixa horária, mês ou turno derivado. **Só o instante** — e dois
instantes, não um: o declarado pelo terminal e o de recepção no servidor.

**Por quê (calendário):** dia é função de um fuso cujo dono está **indecidido** — regra aprovada contra
regra aprovada, e o conflito só aparece no cliente com dois estabelecimentos em fusos diferentes
([[gotcha-fuso-do-estabelecimento-versus-fuso-do-cliente]]). Um fato nascido com data de negócio transforma
o fechamento dessa lacuna em **backfill em N schemas** — exatamente o que a Fase 1 existe para evitar. Com
só o instante, a família sobrevive à decisão fechando para **qualquer** lado.

**Preço aceito e declarado:** agrupar por hora ou por dia passa a ser trabalho de **leitura**, não filtro
barato. É o preço certo: leitura cara se conserta com índice; fato errado não se conserta.

**Por quê (dois instantes):** guardar um só é escolher qual pergunta nunca terá resposta — com o do
terminal, "o fato chegou quando?"; com o do servidor, "o fato aconteceu quando?", que é a que o negócio
usa. A divergência de relógio já é fato próprio, o que informa **que** houve desvio, não como corrigir uma
linha. Com os dois instantes, qualquer correção futura é derivável. **Dois instantes nascem juntos ou
nunca.**

**Como aplicar:** ao propor conteúdo de fato, a única grandeza de tempo admissível é instante. Qualquer
campo que responda "de que dia é isto" é derivação — e derivação mora na leitura, onde tem dono de fuso.

---
name: gotcha-julgar-o-proprio-texto-nao-pega-erro-de-escopo-ou-de-fato
description: amostragem independente do thread principal — não do próprio produto — achou cinco defeitos substantivos que a passada de escrita não viu (todos corrigidos), um deles em lote gerado com o modelo padrão, não só com o mais barato; reduzir custo de modelo não é a única fonte do risco, a ausência de segundo olhar é
type: gotcha
escopo: processo
camada: processo
data: 2026-08-27
relaciona: [[gotcha-comentario-de-preservacao-perde-conteudo-na-conversao-adf]], [[gotcha-o-titulo-nao-e-o-card]]
tarefa: T-0008
---

**Sintoma:** em T-0008 (52 issues do board reescritas por `produto` em 4 lotes — Lote 1 com
`model: haiku`, Lotes 2 a 4 com o modelo padrão), a verificação independente do thread principal
encontrou, depois de cada lote entregue como `STATUS: OK`, defeitos que a própria passada de escrita
não pegou:

1. `SPR-52` (Lote 1, Haiku) recomendava um framework (Fastify) dentro de um card sobre decisão de
   arquitetura ainda aberta (`D-01`) — território de `backend`, não de `produto`
   (`00-nucleo.md` §3).
2. `SPR-39` (Lote 1, Haiku) estava na forma errada — Prova em vez de Decisão — para uma convenção
   que é `D-04`, ainda aberta e sem meio-termo.
3. `SPR-42` (Lote 2, **modelo padrão**) afirmava "React Native + Expo já está fechado como cliente",
   citando uma seção do dossiê de arquitetura que não sustenta a afirmação — `D-02` segue aberta.
4. `SPR-40` e `SPR-41` (Lote 1, Haiku) tinham typo que virou palavra sem sentido ("almonda"),
   contagem errada ("cinco perguntas" onde há quatro) e uma dupla negação que inverte o sentido do
   gate de segurança ("nenhum achado crítico não resolvido bloqueia..." quando deveria ser o
   oposto). Todos os cinco defeitos foram corrigidos, cada um em despacho separado — a dupla negação
   exigiu um segundo despacho pontual porque a correção original tratava só de typo/palavra sem
   sentido/número errado, e a inversão de lógica só apareceu numa releitura posterior.

**Por quê:** quem escreve e quem julga o próprio texto na mesma sessão têm o mesmo ponto cego —
viés de confirmação não é exclusivo do modelo mais barato. O achado 3 saiu de um lote com o modelo
padrão, não do lote Haiku: baixar o custo do modelo reduz um tipo de erro (fluência, forma), não o
erro de escopo (recomendar fora do território) nem o erro de fato (citar fonte que não sustenta a
afirmação). Nenhum desses dois é sensível à qualidade do modelo gerador — são sensíveis a **ter ou
não um segundo olhar**.

**Como aplicar:** toda passada de reescrita de card/backlog em lote termina com verificação
independente do thread principal antes de fechar a tarefa, **mesmo quando o lote roda no modelo
padrão** — "modelo melhor" não é motivo para pular o passo. A verificação cobre três eixos
específicos, não leitura geral: (1) **escopo** — o agent escreveu algo que é território de outro
agent (biblioteca, framework, endpoint, coluna)? (2) **fato** — toda afirmação de "decisão fechada"
bate com a tabela de decisões abertas do `CLAUDE.md` §8 e com a fonte citada, lida de verdade, não
só pelo número da seção? (3) **leitura literal** — a frase, lida ao pé da letra e não pela intenção
presumida, diz o que deveria dizer, inclusive quando há negação dupla? Achado nesses eixos vira
correção pontual, despachada e documentada na ficha, antes do fechamento — nunca silenciado por já
estar "quase pronto".

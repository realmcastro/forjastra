---
name: convention-ausencia-decidida-versus-acidental
description: a única diferença entre "decidimos não registrar isto" e "ninguém perguntou" é alguém ter escrito o motivo — seis meses depois as duas são indistinguíveis, e por isso a segunda lista da spec é o artefato, nunca a boa intenção
type: convention
escopo: plataforma
camada: produto
data: 2026-09-11
relaciona: [[decision-capturar-e-o-padrao-nao-capturar-exige-justificativa]], [[gotcha-zero-venda-nao-se-distingue-de-terminal-morto]]
tarefa: T-0009
---

Uma spec que não registra um fato pode estar em dois estados completamente diferentes:

- **ausência decidida** — alguém perguntou, pesou e escreveu o motivo;
- **ausência acidental** — ninguém perguntou.

**No texto, elas são idênticas.** As duas se manifestam como silêncio. Quem lê a spec seis meses
depois não tem como distinguir uma decisão madura de um esquecimento, e o custo dessa confusão é
assimétrico: diante de uma ausência sem motivo, a leitura caridosa ("deve ter sido decidido") vence,
e o esquecimento vira jurisprudência.

**Por isso a segunda lista é o artefato.** `CLAUDE.md` §7.10 manda toda spec declarar o que o fluxo
registra **e o que ele deliberadamente não registra, com o motivo**. A primeira lista se escreve
sozinha, porque é o trabalho. A segunda exige percorrer o fluxo procurando o que não está lá, que é o
trabalho que ninguém faz espontaneamente — e é ela que converte ausência acidental em ausência
decidida, ou revela que a ausência não tinha dono.

**Como aplicar:** ao revisar spec existente, classifique cada ausência nas duas espécies antes de
propor correção. Acidental de baixo risco se corrige na hora; decidida se respeita; decidida **sem
motivo escrito** não existe — é acidental com aparência de decisão. Ao escrever spec nova, a segunda
lista não é opcional, e ela é a parte que a revisão deve olhar primeiro, porque é a única que
ninguém escreveria por conta própria.

# Recortes do backlog: fusão e exclusão, com a justificativa que sobrevive ao item

Este arquivo existe porque a justificativa de um recorte não pode morar no item recortado: ela morreria
junto com ele (`.claude/rules/backlog.md` §7, trava 2). Cada entrada cita o identificador, vem **antes**
da edição dos itens e tem as quatro partes de `.claude/rules/00-nucleo.md` §12.

**Fusão não é exclusão.** Na fusão, o item absorvido continua em disco, com o texto original preservado
e um ponteiro no topo para o absorvente; nada sai do backlog. Exclusão de arquivo continua exigindo o
`EXCLUIR` do humano, e nenhuma entrada abaixo o pede.

---

## 2026-09-23 · `F-022` absorvido em `F-012`

**Quem autorizou:** o thread, por delegação do humano de 2026-09-23
(`memory/processo/convention-decisao-delegada-com-aviso-no-modulo.md`), em
`tarefas/T-0017-varrer-escopo-sem-rn.md`, seção "thread — 2026-09-23 (conferência por conjunto e
respostas)". A recomendação é da passada que criou `F-022` (`T-0017`, relatório D.1, DECISÕES).

1. **Necessidade preservada.** Saber que o terminal serviu menos do que o manifesto pediu, por qualquer
   das causas que a regra de degradação decide (resposta inaproveitável, nó de forma inválida, estado
   desconhecido, id desconhecido, bloco fora da faixa, tela sem nó válido), em que degrau da escada ele
   estava, e se a zona era de ação crítica. Nenhum aceite de `F-022` se perde: os seis passam para
   `F-012`.
2. **Mecanismo recusado, e por que é ruim.** Dois itens com a mesma regra dona, o mesmo gate e a mesma
   decisão de grão. `F-022` declara que espera o grão de `F-012` e herda a forma dele
   (`F-022-...md:80`), e o escopo dele altera o fato que `F-012` cria, ao pôr a criticidade do slot no
   fato de id desconhecido (`F-022-...md:38-39`). Separados, a mesma regra é escrita duas vezes e o
   mesmo fato muda de forma entre as duas passadas.
3. **Mecanismo novo.** Um item só, `F-012`, com o escopo estendido pelo conteúdo de `F-022`. `F-022`
   fica em disco como ponteiro, com o texto original abaixo.
4. **Por que é melhor, e como se prova.** Uma decisão de grão para a série inteira, uma regra dona, um
   gate de `performance` sobre o caminho de render, e o fato de id desconhecido nasce com a criticidade
   desde a primeira versão. Prova: o aceite 3 de `F-022` ("ler os descartes em zona crítica devolve
   quais terminais estão sem qual ação") e o aceite 2 de `F-012` ("quantos terminais ainda não conhecem
   cada id") passam a ser respondidos pelo mesmo fato, e não por dois.

## 2026-09-23 · `F-028` absorvido em `F-007`

**Quem autorizou:** o mesmo, na mesma seção de `T-0017`. A recomendação está no próprio `F-028`
(`F-028-...md:7-9`).

1. **Necessidade preservada.** Saber quantas leituras uma camada modal recusou, e qual camada, separado
   da leitura que chega e não resolve item. É a medida de que a camada está no lugar errado do fluxo
   (`F-028-...md:19-20`). Os dois aceites de `F-028` passam para `F-007`.
2. **Mecanismo recusado, e por que é ruim.** Item próprio, marcado "não executável antes de `T-0016`
   fechar", alterando a mesma lista de motivos de `RN-NUC-043` que `F-007` alterou, no mesmo fluxo de
   leitura de `PER`. O aceite que define o item é justamente a separação entre os dois motivos
   (`F-028-...md:37-38`), e ele só se verifica contra o motivo que `F-007` criou.
3. **Mecanismo novo.** `F-007` absorve o escopo de `F-028` como alteração datada. `F-028` fica em disco
   como ponteiro, com o texto original abaixo.
4. **Por que é melhor, e como se prova.** O fluxo de leitura de `PER` tem um item só dono dos motivos
   que ele produz, e a separação entre "leitura não resolvida" e "leitura recusada por camada" se prova
   na mesma entrega que a define. Prova: o aceite 7 de `F-007` (antes aceite 2 de `F-028`) põe as duas
   recusas na mesma janela e exige motivos distintos.
   **Custo declarado:** `F-007` estava fechado com `T-0016`. A absorção reabre o escopo dele pelo que
   `F-028` traz, e o par um para um (`backlog.md` §4) obriga a reabrir `T-0016` para executá-lo, porque
   uma segunda ficha para o mesmo item está proibida. A alternativa, que o thread recusou ao autorizar,
   era manter `F-028` com ficha própria.

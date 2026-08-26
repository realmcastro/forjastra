---
name: gotcha-endereco-de-relatorio-envelhece-na-propria-sessao
description: path:linha e lista de pendências de relatório envelhecem dentro da própria sessão — 2026-08-23 teve três endereços errados com substância correta, e 2026-08-26 teve o oposto: endereço certo apontando substância morta, publicada como afirmação falsa num comentário append-only; confira a substância, nunca aceite o endereço, e confira a lista contra o alvo
type: gotcha
escopo: processo
camada: processo
data: 2026-08-23
atualizado: 2026-08-26
tarefa: T-0003, T-0006
---

**Sintoma:** um relatório cita `arquivo:linha` para provar um ponto. A linha não diz aquilo — ou diz
outra coisa, ou o defeito apontado já foi corrigido por outro agent na mesma sessão. O agent leu o
arquivo antes da edição de um irmão, e o relatório congelou o endereço.

Três ocorrências em 2026-08-23, **todas com substância correta**. Numa delas, o resíduo apontado (um
cenário do contrato de offline que não listaria o conjunto retido) simplesmente **não existia mais**.

**A segunda forma da mesma coisa:** **tabela de lacuna é a primeira coisa a mentir.** Duas linhas da
mesma tabela de lacunas diziam "pendente" para algo já medido no dia anterior e "não editei" para algo
já editado. Contabilidade escrita à mão envelhece mais rápido que o arquivo que ela descreve.

**Como aplicar:**
- Ao validar relatório: confira a **substância**, nunca aceite o endereço. Reproduza a busca em vez de
  abrir a linha citada.
- Ao despachar correção baseada em relatório: mande o agent **localizar por busca**, não por linha.
- Ao fechar bloco: releia a tabela de lacunas do arquivo tocado; ela não se atualiza sozinha e ninguém
  a revisa por hábito.
- Corolário de brief, aprendido no mesmo dia: apontar **três** pontas de uma contradição **não**
  autoriza supor que são três. A quarta existia, num arquivo irmão, e teria sobrevivido à correção.

## Duas ocorrências novas em 2026-08-26 (T-0006), e as duas são o avesso da primeira

**A substância é que morreu, não o endereço.** `roadmap-de-modulos.md:155` e `:171` dizem
"`service_mode` sem `RN`". As linhas existem e estão nesses números; o que caiu foi o fato —
`RN-NUC-048` existe, e `glossario.md:396` registra `LACUNA-GLO-002` como fechada em 2026-08-23 por
causa dela. Uma revisão copiou as duas linhas sem conferir a substância, e a afirmação falsa foi
**publicada como comentário de issue**, que é append-only: só saiu por retratação explícita, também
publicada. O custo subiu de "corrigir um relatório" para "publicar duas vezes no registro público".

**A lista de pendências envelhece com o passo que a antecede.** A conferência listava a nota de
vocabulário como pendente em `SPR-19`, `SPR-20` e `SPR-32`; o passo executado entre ela e a aplicação
já a tinha embutido no comentário de bloqueio dos três, com a mesma prova. Conferir a **lista contra o
alvo** — e não o alvo contra a lista — foi o que evitou três duplicatas irreversíveis.

**Como aplicar, acrescentado:**
- Antes de citar `path:linha` em artefato **público** (issue, comentário, documento entregue), abra a
  linha **e** confira o fato contra a fonte que o define (`RN`, glossário, tabela de lacunas). Endereço
  certo com fato morto é o caso que a leitura por linha não pega.
- Toda lista de pendências carrega a data e o passo em que foi escrita. Ao aplicá-la, o alvo manda: leia
  o estado atual do alvo e derive o que falta, em vez de executar a lista item por item.

---
name: gotcha-endereco-de-relatorio-envelhece-na-propria-sessao
description: path:linha de relatório de agent envelhece dentro da própria sessão — três ocorrências em 2026-08-23, todas com substância correta e endereço errado, uma delas apontando defeito que já não existia; confira a substância, nunca aceite o endereço
type: gotcha
escopo: processo
camada: processo
data: 2026-08-23
tarefa: T-0003
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

---
name: convention-nao-registra-nao-absorve-ausencia-acidental
description: ao escrever a lista "Não registra" numa spec que já tem ausência acidental, a entrada nomeia a ausência como acidental e cita o achado — senão o artefato que existe para impedir ausência de virar acidente é o instrumento que converte acidente em decisão retroativa
type: convention
escopo: plataforma
camada: produto
data: 2026-09-12
relaciona: [[convention-ausencia-decidida-versus-acidental]], [[decision-capturar-e-o-padrao-nao-capturar-exige-justificativa]]
tarefa: T-0010
---

A segunda lista do invariante 10 (`CLAUDE.md` §7.10) é lida como **decisão com motivo**. Então
escrever nela um fato que ninguém decidiu não capturar — porque a varredura acabou de descobrir que
ele falta — apaga o achado: a ausência entra vestida de decisão madura, com um motivo redigido por
quem estava varrendo, e ninguém reabre.

**Por quê:** o ganho inteiro da segunda lista está em distinguir ausência **decidida** de ausência
**acidental**, que no texto são silêncio idêntico ([[convention-ausencia-decidida-versus-acidental]]).
Preencher a lista durante a correção inverte o efeito, e inverte sem sintoma: o arquivo fica com
aparência de conformidade **melhor** do que antes da varredura, e o defeito que a varredura achou
desaparece do texto que deveria guardá-lo. É a trava que impede a própria correção de engolir o
defeito que ela corrige.

**Como aplicar:**

- Entrada de ausência **decidida** carrega o motivo pelo qual não registrar está certo.
- Entrada de ausência **acidental** carrega o oposto: que ela é acidental, o número do achado e o
  item que a resolve — `"não registra X — ausência ACIDENTAL, achado 2.n de <varredura>, item F-nnn"`.
  O campo de motivo diz que a pergunta está **aberta**, nunca por que a ausência é boa.
- **Conversão de acidental para decidida é ato do humano** ou de decisão registrada, nunca efeito
  colateral de alguém preencher a lista. Varredura nomeia; não decide.
- A mesma disciplina vale na revisão: entrada da segunda lista sem motivo escrito, ou com motivo
  genérico, é acidental com aparência de decisão — trate como achado, não como conformidade.

**Caso que originou:** a passada de 2026-09-12 escreveu as duas listas nos sete contratos de módulo
(`MSA`, `COZ`, `PCF`, `ATI`, `PER`, `REL`, `FIS`+`EMI`) **depois** de a varredura ter achado doze
ausências, a maioria acidental. Cada uma foi nomeada como acidental dentro da própria lista, citando
o achado; sem isso, os nove itens `F-005`..`F-013` teriam nascido contradizendo a spec que os
originou.

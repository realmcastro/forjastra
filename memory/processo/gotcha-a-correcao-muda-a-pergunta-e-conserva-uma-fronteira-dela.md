---
name: gotcha-a-correcao-muda-a-pergunta-e-conserva-uma-fronteira-dela
description: em três reincidências seguidas, a correção mudou a pergunta certa e **conservou uma fronteira da pergunta antiga** — e os testes que a aprovaram tinham sido montados a partir da lista do achado, então provaram o achado e não a classe
type: gotcha
escopo: processo
camada: processo
data: 2026-09-11
relaciona: [[gotcha-palavra-proibida-nao-fecha-classe-ancora-fecha]], [[convention-enumerar-quem-alcanca-vence-conferir-o-esperado]], [[gotcha-julgar-o-proprio-texto-nao-pega-erro-de-escopo-ou-de-fato]]
tarefa: T-0009
---

**Sintoma:** um controle é corrigido, a correção é medida, o teste passa — e o gate seguinte acha a
mesma classe de defeito por um caminho vizinho. Repetidamente.

Aconteceu **três vezes** em 2026-09-11, no mesmo dia, com controles diferentes. E o padrão só ficou
visível quando o auditor foi obrigado a explicar **o que no processo** deixou passar, em vez de só
apontar o código:

1. A convergência de herança foi corrigida e ficou **escopada ao concedente** — a tabela do Postgres
   tem uma linha por `(papel, membro, concedente)`, e reemitir por um concedente não toca a linha do
   outro. O ator do cenário original era o operador; o conserto rodava pelo executor.
2. O discriminador de "quem alcança" foi corrigido e **conservou a população da pergunta antiga**: um
   filtro que fazia sentido quando o universo era "executor e credencial" foi levantado para um
   universo que é "qualquer um".
3. A pergunta foi invertida corretamente e **conservou o universo de schemas** — passou a enumerar
   quem alcança, mas só dentro dos schemas de cliente, e o caminho vizinho passava por `public`.

**A raiz é a mesma nas três:** a correção acerta **a pergunta** e herda, sem ninguém notar, **uma
fronteira** da pergunta velha — o concedente, a população, o universo. A fronteira não estava errada
antes; ela só deixou de caber quando a pergunta mudou.

**E os testes não pegaram porque foram montados da lista do achado.** Teste escrito a partir dos
casos que o auditor listou prova **o achado**. Ele não prova a classe, e passa com folga enquanto o
vizinho segue aberto.

**Como aplicar** — ao corrigir controle de segurança, além do teste do caso relatado, escreva o teste
que ataca **o conserto**:

- **Quem mais cabe na condição nova?** Se a correção introduziu um filtro, pergunte de que população
  ele foi tirado e se essa população mudou.
- **Reproduza com o ator escrito no cenário**, não com o mais conveniente. O cenário do achado dizia
  "operador"; o teste rodou como executor, e a diferença **era** o defeito.
- **O universo mudou junto com a pergunta?** Pergunta nova sobre universo velho é meia correção.

Enquanto essas três não forem respondidas, "corrigido e medido" significa que o caso relatado morreu.

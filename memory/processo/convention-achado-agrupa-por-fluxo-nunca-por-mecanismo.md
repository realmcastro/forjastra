---
name: convention-achado-agrupa-por-fluxo-nunca-por-mecanismo
description: achado de varredura vira item agrupado por fluxo (o contrato de módulo em que ele mora), nunca por mecanismo (a regra que vários achados alteram) — agrupar por mecanismo economiza uma edição de regra e entrega um item que atravessa dois contratos
type: convention
escopo: processo
camada: produto
data: 2026-09-12
relaciona: [[decision-backlog-e-o-registro-publico-da-tarefa]], [[decision-produto-e-o-dono-do-backlog]]
tarefa: T-0010
---

Onze achados da varredura do invariante 10 viraram nove itens (`F-005`..`F-013`), e o corte foi por
**fluxo**: cada item mora num contrato de módulo só. Dois achados do mesmo módulo se fundem
(`F-005` = 2.3 + 2.7, em `MSA`); dois achados que alteram a **mesma regra** em módulos diferentes
**não** se fundem (`F-005` e `F-007` alteram os dois a enumeração de `RN-NUC-043`, e ficaram
separados).

**Por quê:** item agrupado por mecanismo troca uma edição de regra por um item com dois donos, duas
travas e dois aceites. Quem o pega precisa entrar em dois contratos para entregar um; quem o revisa
não consegue dizer se está pronto. A economia é de quem escreve o item, e o custo é de quem o executa
— sempre nessa direção.

**Como aplicar:**

- Agrupe por fluxo e por contrato. O teste: o item cabe dentro de um contrato de módulo, com um dono?
- Achados que alteram a mesma regra dona **se citam** e declaram a passada compartilhada: se forem
  pegos juntos, a alteração da regra é uma só, e isso está escrito nos dois.
- Medir a mesma coisa não é razão para fundir. `F-006` (`PCF`) e `F-008` (`ATI`) medem onde o
  cliente-final desiste no canal, e continuam separados porque são contratos diferentes, com travas
  diferentes.
- **Achado que não vira item some.** Foi por isso que os dois achados novos da terceira passada
  ganharam item (`F-012`, `F-013`) no mesmo despacho em que nasceram, sem esperar a próxima rodada.

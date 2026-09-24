---
name: gotcha-numero-de-rn-colide-entre-instancias-paralelas
description: território de arquivo disjunto não protege a sequência de números de RN, que é global; duas instâncias de produto em paralelo tomaram RN-NUC-057 no mesmo dia, e a faixa de números tem de ser reservada no plano, como a de itens de backlog
type: gotcha
escopo: processo
camada: processo
data: 2026-09-23
tarefa: T-0014
---

Em 2026-09-23, `T-0014` (A.2a) e `T-0016` (C.1) escreveram `RN-NUC-057` em arquivos diferentes. A.2a
chegou a renumerar o dele para `063` antes de saber que C.3 tinha renumerado o outro para `063`
também, e depois renumerou o dele para `066`. O sintoma é uma citação que aponta para a regra errada,
sem erro nenhum.

**Por quê:** o paralelismo por território cobre **arquivo**. O número da `RN` é um contador global que
nenhum arquivo guarda.

**Como aplicar:** plano que despacha mais de uma instância de `produto` em paralelo reserva uma faixa de
números por instância, do jeito que já se faz com `F-<nnn>`. Quem renumera ganha a mudança pelo lado de
menos citações e conta as citações antes.

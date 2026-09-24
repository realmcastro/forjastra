---
name: gotcha-glossario-mais-estreito-que-a-rn-que-o-governa
description: o glossário é autoridade sobre o nome do termo, nunca sobre o alcance dele — duas entradas descreviam menos do que a `RN` dona mandava, e quem modelasse lendo só o glossário teria posto flag de exclusão no núcleo e a chave primária errada
type: gotcha
escopo: plataforma
camada: produto
data: 2026-09-11
relaciona: [[decision-d-04-chave-timestamps-exclusao]], [[gotcha-capacidade-sem-dono-entra-pelo-titulo-do-card]]
tarefa: T-0009
---

**Sintoma:** um modelo tecnicamente correto contra o glossário, e errado contra a regra. Ninguém
acusa, porque as duas fontes concordam em tudo que dizem; a divergência está no que o glossário
**não** diz.

**Os dois casos, achados em 2026-09-11 ao modelar a Fase 1:**

- `effective_period` estava descrito como coisa de "preço ou regra". `RN-NUC-014` manda **toda**
  publicação nascer com versão e vigência declaradas, e item de catálogo é publicação. Quem lesse só
  o glossário concluiria que tirar produto de circulação não tem mecanismo, e proporia `deleted_at`
  no núcleo, que a convenção proíbe.
- `idempotency_key` estava descrito como "identificador enviado pelo chamador", com aviso de não
  confundir com identificador da venda. `RN-OFF-013` prende a identidade à operação enfileirável e
  `RN-NUC-003` diz que a venda nasce com ela. Lido isolado, o glossário levaria a uma chave
  substituta com a identidade numa coluna ao lado, que é exatamente a saída recusada por `D-04`.

**Por quê acontece:** o glossário é escrito para definir **nome**, num momento em que o termo aparece
num contexto só. A `RN` que o governa nasce depois, ou alarga depois, e a entrada não é revisitada. A
assimetria é estrutural: a regra cresce, a definição fica.

**Como aplicar:** o glossário manda no **nome** do termo (e nesse ponto é autoridade única). Sobre o
**alcance**, a `RN` vence sempre. Antes de modelar em cima de um termo, abra a `RN` que o governa e
compare — divergência encontrada é achado para `produto`, não licença para escolher a leitura que
convém. E quem escreve `RN` que alarga um termo existente corrige a entrada na mesma passada, que é o
mesmo princípio de [[gotcha-regra-nova-que-nao-corrige-a-celula-nasce-inerte]]: regra nova que não
atualiza o registro que a expressa nasce inerte.

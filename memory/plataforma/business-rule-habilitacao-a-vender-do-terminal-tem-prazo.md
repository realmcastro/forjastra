---
name: business-rule-habilitacao-a-vender-do-terminal-tem-prazo
description: a habilitação a vender do terminal vence por tempo sem contato, com aviso antes — sem prazo, a revogação é promessa que a física do offline não cumpre; o número é LACUNA-OFF-017 e é do humano
type: business-rule
escopo: plataforma
camada: produto
data: 2026-08-23
relaciona: [[business-rule-ato-ordinario-versus-operacao-sensivel]]
tarefa: T-0003
---

`RN-OFF-032`(i) + `LACUNA-OFF-017` (`docs/produto/fila-local-autoridade-e-identidade.md`): a
habilitação a vender de um terminal **expira** depois de tempo sem contato, e o terminal avisa antes
de expirar. O prazo não tem número — o número é do humano.

**Por quê:** o argumento é o mesmo, palavra por palavra, que deu prazo à capacidade de assinar
documento fiscal, e existe precedente escrito no repositório: **terminal sem rede não recebe
revogação, então sem prazo a revogação é promessa que a física do offline não cumpre.** Sem prazo, o
terminal furtado e mantido offline abre sessão, conclui venda e entrega via em nome do emitente
indefinidamente — contra o cenário `C-09` que o próprio contrato de offline escreve.

**A tensão, que é a decisão do humano:** curto demais **para de vender** quem opera dias com link
ruim, e a regra escrita para não parar o caixa passa a pará-lo por decurso de prazo (contra `PN-01`);
longo demais deixa o terminal furtado vendendo por todo o intervalo. Não é a mesma grandeza de
`LACUNA-OFF-011`, e provavelmente não é da mesma ordem: lá o evento contido é revogação de **pessoa**
(frequente, prevista); aqui é perda de **dispositivo** (rara, notada).

**Como aplicar:** este é o **único** caso em que o ato ordinário para. Enquanto o número não existir,
o comportamento é indefinido em **duração**, não em forma — quem implementar não inventa o valor,
lê a configuração e trata a ausência como erro.

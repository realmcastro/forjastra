---
name: convention-decisao-delegada-com-aviso-no-modulo
description: desde 2026-09-23 decisão pendente do humano é tomada pelo thread com critério de escalabilidade e registrada; o que depende de terceiro não trava, o módulo recebe aviso explícito do que não funciona e por quê
type: convention
escopo: processo
camada: processo
data: 2026-09-23
relaciona: [[convention-bloqueio-nomeia-o-default-silencioso]], [[state-execucao-solo-2026-09-11]]
---

Palavras do humano em 2026-09-23: "sobre as decisões, você faz o que for melhor para a
escalabilidade", "a lacuna de periféricos precisa nascer, pois então que ela nasça", "a gente vai
fazer a base e bem feita", e "o que não tiver ao seu alcance, você vai continuando o restante e
coloca um aviso claro [...] do módulo tal coisa não funciona porque precisa de tal coisa".

**Por quê:** com um executor só, pergunta pendente é trabalho parado, e as decisões em fila eram
reversíveis e já tinham recomendação.

**Como aplicar:**
- Decisão de produto ou de arquitetura em aberto (inclusive `D-03`) é tomada pelo critério de
  escalabilidade, com o recusado e o motivo, no registro de sempre (`decision`, item, ficha). A
  trava do invariante 9 continua: decisão **registrada** não é presunção, decisão silenciosa é.
- O que depende de terceiro (contador, loja real, adquirente) não se decide por analogia. A spec e o
  módulo afetados recebem um **aviso de indisponibilidade**: o que não funciona, qual dependência
  falta e quem a responde. O resto do módulo segue sendo construído.

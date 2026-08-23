---
name: decision-contencao-de-papel-nao-gera-autoridade-retida
description: os papéis do núcleo são cinco e fechados, a contenção entre eles é declarada e não inferida — e conter outro papel não faz o portador reter autoridade dele, por isso o owner sozinho não pratica operação sensível offline
type: decision
escopo: plataforma
camada: produto
data: 2026-08-23
relaciona: [[business-rule-ato-ordinario-versus-operacao-sensivel]], [[decision-celula-e-autoridade-unica-sobre-autorizacao]]
tarefa: T-0003
---

Cinco papéis no núcleo, conjunto fechado: `cashier`, `manager`, `owner`, `fiscal_officer`,
`provider_support` (9 candidatos recusados). Contenção declarada: `cashier ⊆ manager ⊆ owner`;
`fiscal_officer` é **ortogonal**; `provider_support` fica **fora da rede** do cliente.

`RN-NUC-028`: a contenção é **declarada, não inferida**, não cruza escopo, não alcança papel de módulo
e **não gera autoridade retida**.

**Por quê:** contenção é conveniência de leitura de permissão online. Autoridade **retida** é dado com
prazo guardado num dispositivo que pode ser furtado — herdá-la por contenção multiplicaria em silêncio
o que cada terminal carrega. O custo aceito e visível: o dono do negócio de uma pessoa precisa da
atribuição de `cashier` ou `manager` para praticar **operação sensível** sem contato; como `owner` ele
autoriza, mas não retém. O **ato ordinário** ele pratica sem atribuição nenhuma
([[business-rule-ato-ordinario-versus-operacao-sensivel]]) — é o teste de "não quebrar o cliente
pequeno", e ele passa.

**Como aplicar:** ao escrever regra ou tela que dependa de papel, nunca derive alcance por contenção;
leia a célula. E ao habilitar um cliente, a declaração precisa dizer isto em voz alta — é a pergunta
que o dono de padaria faz no primeiro dia.

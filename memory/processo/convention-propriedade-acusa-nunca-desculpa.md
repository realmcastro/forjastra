---
name: convention-propriedade-acusa-nunca-desculpa
description: num controle de acesso, propriedade do catálogo que o beneficiário pode emitir (admin_option, LOGIN, extensão, dono do schema, nome no ambiente, ser membro do grupo) só serve para acusar; excluir o legítimo exige identidade registrada pelo ato, nunca pelo verificador
type: convention
escopo: processo
camada: seguranca
data: 2026-09-12
relaciona: [[convention-exclusao-se-prova-com-o-excluido-hostil]], [[state-retomada-2026-09-23]]
tarefa: T-0009
---

A camada de papel de `db/**` reabriu nove vezes até 2026-09-12 com a mesma anatomia: o controle
enumerava quem alcança o schema e **desculpava** os legítimos por uma propriedade que o próprio
beneficiário carrega (`admin_option`, `LOGIN`, `pg_depend deptype='e'`, dono do schema, o nome vindo
do ambiente). Cada uma dessas é emitida por um comando de quem ataca. O nono gate, em 2026-09-23,
achou mais uma roupa: a permanência da credencial é "ser membro do grupo", e o executor administra
o grupo (`PAP-28`).

**Por quê:** trocar um predicado de exclusão por outro predicado de exclusão foi tentado oito vezes, e
em todas mediu-se que o buraco seguinte abria uma casa ao lado.

**Como aplicar:** propriedade do catálogo pode **acusar**. **Desculpar** exige identidade registrada
pelo ato que cria o legítimo (`provision`, `migrate`) numa tabela que o verificador só lê
(`platform.role_declarations`). Antes de aceitar uma exclusão, pergunte quem consegue emitir o
critério dela. Se quem ataca consegue, a exclusão é o furo.

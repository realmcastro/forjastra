---
name: gotcha-heranca-e-propriedade-da-concessao-nao-do-papel
description: em PostgreSQL 16 `inherit_option` é propriedade do `GRANT`, não do papel — `ALTER ROLE … NOINHERIT` não conserta concessão existente, e `WITH INHERIT FALSE` vence o atributo do papel; verificar o papel em vez da concessão aprova o vazamento
type: gotcha
escopo: plataforma
camada: dados
data: 2026-09-11
relaciona: [[decision-papel-de-aplicacao-assumido-por-transacao]], [[convention-enumerar-quem-alcanca-vence-conferir-o-esperado]]
tarefa: T-0009
---

**Sintoma:** a credencial da aplicação alcança o schema de **todos** os clientes sem assumir papel
nenhum, e toda verificação responde **`conforme`**.

A intuição diz que "não herda" é atributo do papel — e a verificação natural é olhar `rolinherit`.
Em PostgreSQL 16 isso está errado em duas direções, e as duas foram medidas em 16.15:

- **`ALTER ROLE … NOINHERIT` depois não muda concessão já existente.** O papel fica marcado como não
  herdando, e a concessão antiga continua herdável.
- **`WITH INHERIT FALSE` no `GRANT` vence o atributo do papel.** Uma credencial criada **sem**
  `NOINHERIT` (`rolinherit = t`), recebendo a concessão com a opção, leva `permission denied for
  schema` — e `SET LOCAL ROLE` continua funcionando normalmente.

**Por quê isso é grave além do defeito:** a garantia estava, até então, na digitação de um passo
**manual** de operador. Uma palavra omitida ali punha o sistema no arranjo de papel compartilhado
desde o primeiro cliente, e nenhum controle acusava. Pôr a opção **no `GRANT` do ato automatizado**
move a garantia do runbook para o artefato.

**O lado bom, medido duas vezes por agents diferentes:** reemitir a mesma concessão sobre uma já
herdável muda `inherit_option` de `t` para `f` **sem `REVOKE`**, a leitura direta passa a `42501` na
hora, e `SET LOCAL ROLE` continua funcionando. Então herança indevida é **convergível** pelo próprio
ato de provisionamento, não um estado que para a rodada — e essa é a diferença entre um defeito que o
sistema conserta sozinho na próxima passagem e um que exige intervenção.

**Como aplicar:** conceda sempre com a opção explícita, e **verifique `pg_auth_members.inherit_option`,
nunca `pg_roles.rolinherit`**. A regra geral: quando uma propriedade pode morar no objeto **ou** na
relação entre objetos, confira na relação — é lá que ela decide.

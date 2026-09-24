---
name: decision-d-06-ii-trilha-no-platform-com-projecao-no-cliente
description: D-06(ii) fechada na residência em 2026-09-23: a autoridade da trilha dos nossos atos mora no platform e sobrevive à saída do cliente; o cliente lê uma projeção derivada no schema dele, com pseudônimo por cliente; gravação autoridade → projeção → liberação; papel e ordem ainda em revisão (TRL-01, TRL-02)
type: decision
escopo: plataforma
camada: dados
data: 2026-09-23
relaciona: [[decision-d-06-sao-tres-residencias-nao-uma]], [[gotcha-gatilho-de-comando-nao-protege-particao]], [[gotcha-on-conflict-com-alvo-exige-select]]
supera: [[decision-d-06-sao-tres-residencias-nao-uma]]
tarefa: T-0019
---

Só a parte (ii) de `D-06`, a trilha dos nossos atos. (i) e (iii) continuam abertas.

- **Autoridade no `platform`** (saída S1). Ela é retida e sobrevive à saída do cliente.
- **Projeção derivada no schema do cliente.** Ela sai junto com o cliente e nunca tem autoridade
  própria. Tratá-la como fato seria ter duas autoridades.
- **Pseudônimo por cliente** na projeção, e não o identificador global da pessoa nossa. Assim não há
  chave de correlação entre schemas. É a parte irreversível: pseudônimo exportado não volta.
- **Ordem:** a autoridade grava com `COMMIT`, depois uma transação grava a projeção junto com o ato ou
  a leitura, e só então o resultado é liberado. A autoridade é sempre superconjunto da projeção.
- **O console do provedor é outra aplicação**, com credencial própria. A leitura automática nossa sobre N
  clientes gera um fato por cliente e por classe.

**Papel e ordem, passados no gate 2 em 2026-09-23** (reauditoria `docs/auditorias/2026-09-23-d-06-trilha-reauditoria.md`):
cada cliente tem `prv_t_X` (NOLOGIN NOINHERIT, membro de `forja_prv` com herança), privilégio só ao grupo,
e RLS restritiva que exige a projeção **confirmada em transação anterior**. A ordem é única: intenção na
autoridade com `COMMIT` → projeção com `COMMIT` → leitura ou ato. Ato sobre objeto do `platform` grava o
desfecho na mesma transação. `TRL-03`…`TRL-09` são requisito escrito das migrations da trilha (§16 do
documento), e elas não nascem sem eles.

**Por quê:** a trilha não pode sair com o cliente, e o cliente precisa ver o que fizemos nele sem
alcançar o `platform`. Medido pelo F.2: nenhum caminho leva de um cliente a dado de outro.

**Como aplicar:** a trilha é append-only particionada. Isso exige gatilho de linha no pai e tratar
`TRUNCATE` e `DETACH` por partição. O gravador grava com `INSERT` simples e trata `23505` na chave
primária como "já gravado". O expurgo nunca é `DELETE`, e nada expira enquanto `LACUNA-PRV-006` não tiver
número.

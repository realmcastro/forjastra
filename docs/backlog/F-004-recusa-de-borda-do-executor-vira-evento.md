# F-004 — A recusa de borda do executor vira evento em `platform.executor_events`

**Tipo:** Comportamento fechado · **Estado:** a fazer · **Dono:** `arquiteto-dados` (migration de
domínio e desenho); implementação no executor por `coder`, sob spec · **Território:** `db/**`

## Objetivo

A recusa de borda do executor passa a escrever uma linha em `platform.executor_events` antes de sair
`2`. Recusa de borda é o que acontece quando alguém roda o executor contra um banco nomeando, em
`FORJA_MIGRATOR_APP_CREDENTIAL_ROLE`, um papel que não é a credencial da aplicação daquele cluster:
`provision`, `migrate` e `verify` recusam antes da primeira escrita
(`db/migrator/src/preconditions.ts:69-95`, `db/papel-do-cliente.md` §7.7).

Hoje essa recusa existe **só no terminal de quem rodou**, e some com o terminal. Ela é a primeira
coisa que se procura quando se suspeita de alcance indevido a schema de cliente: é o registro de que
alguém apontou o executor para este banco nomeando outro papel. Isso é registro forense, não log.

O precedente interno é `load_refused` (`db/migrator/src/executor.ts:117-134`,
`db/migrator/IMUTABILIDADE-E-FATOS.md` §19.4): abre conexão **só** para registrar uma recusa já
decidida, pelo argumento de que achado que só existe no terminal some com o terminal. A recusa de
borda é da mesma espécie, e o auditor decidiu pelo sim em
`docs/auditorias/2026-09-11-gate-final-camada-de-papel.md:270-279`.

## Escopo

- **Código de evento novo** em `platform.executor_event_kinds`, por migration de `platform`, na forma
  idempotente que a 0008 e a 0009 já usam (`db/migrations/platform/0009__event_kinds_tenant_reach.sql:32-41`).
  Quantos códigos, e com que nome, é do desenho: a régua da 0008 é **um código por diagnóstico cuja mão
  humana é outra**, e as faltas que a recusa distingue hoje não pedem todas a mesma mão — "o ato do
  operador não rodou" manda rodar `db/papel-do-cliente.md` §7.2, e "a chave aponta para o papel que
  administra o grupo" manda corrigir o ambiente.
- **A escrita do evento**, depois da decisão de recusar e fora da transação que recusou.
- **Os dois limites da §3 do gate**, abaixo, como parte do comportamento — não como detalhe de
  implementação.

## Fora de escopo

- **Mudar o desfecho da recusa.** Continua `2`, continua antes da primeira escrita, continua sem
  conceder nada e sem criar schema (medido em `docs/auditorias/2026-09-11-gate-final-camada-de-papel.md:50`).
- **As outras recusas do executor.** `load_refused` já registra; as demais têm código próprio ou não têm
  e isso é outro assunto.
- **`PAP-13`…`PAP-18`.** Este item não conserta nenhum achado; ele dá casa a um fato. O gate diz
  explicitamente que não é bloqueio de fechamento de `T-0009` (`:279`).
- **Consulta, relatório ou alerta sobre os eventos gravados.** A tabela responde "o que deu errado"; quem
  a lê e quando é trabalho de quem opera, e ainda não tem item.

## Critério de aceite

Três casos, cada um com o desfecho exato:

1. **Banco com `platform` aplicada** (pelo menos um cliente provisionado). Rodar `provision`, `migrate` e
   `verify` com `FORJA_MIGRATOR_APP_CREDENTIAL_ROLE` nomeando um papel que não é a credencial: os três
   continuam saindo `2`, nenhuma concessão sai, nenhum schema nasce — **e** existe linha nova em
   `platform.executor_events` com o código novo, o papel nomeado pelo ambiente no detalhe, e o
   `db_role` da conexão que rodou.
2. **Banco vazio, em que `platform` sequer existe** — é a sonda `Q2` do gate (`:50`). A saída continua
   `2` e nada é criado, **e a saída do processo diz que não conseguiu registrar o evento**. A ausência
   aparece; ela não some. Evento que às vezes não sai e não avisa é registro que mente por omissão.
3. **Tabela existe e a escrita falha** (conexão derrubada, privilégio negado sobre a tabela). Saída
   continua `2`, o desfecho da rodada não muda, e a falha de registro é reportada — é o comportamento
   que `db/migrator/src/events.ts:98-103` já tem, e que este item não pode perder.

Dois invariantes sobre a escrita: a conexão do evento é aberta **depois** da decisão de recusar, nunca
antes; e ela não participa da transação que recusou. Reusar a conexão da decisão seria escrever para o
`ROLLBACK` levar, que é a razão de a linha não existir hoje.

## Registra / Não registra

**Registra:**

- **Que a recusa de borda correu neste banco**, com o instante (o par `occurred_at` / `received_at` que
  a tabela já mantém) e o papel da conexão que rodou (`db_role`, preenchido pela sessão).
- **O nome do papel que o ambiente nomeou.** É o valor forense central do fato: sem ele, sabe-se que
  houve recusa e não se sabe para onde alguém estava apontando. Em que coluna esse texto mora é do
  desenho; `detail` é a que existe.
- **Qual precondição faltou.** É o que separa "o ato do operador não rodou neste cluster" de "a chave
  do ambiente aponta para outro papel", e as duas mandam investigar coisas diferentes.

**Não registra, e por quê:**

- **A recusa quando `platform.executor_events` não existe.** Não há onde escrever, e forçar a tabela a
  existir antes da recusa inverteria a ordem que a §7.7 protege (recusar **antes** da primeira escrita).
  A ausência é dita no terminal, caso 2 acima — é não-captura declarada, não silêncio.
- **Qualquer parte de `FORJA_MIGRATOR_DATABASE_URL`**: senha, host, porta, banco. Segredo nunca
  (`00-nucleo.md` §8). O `db_role` já responde quem conectou.
- **Quem rodou o comando** — usuário do sistema operacional, máquina, diretório. É dado pessoal, o
  invariante manda minimizar, e a pergunta operacional ("sob que papel isso entrou no banco") já está
  respondida pelo `db_role`. Falha fechado: não registra. Reabrir é decisão de `seguranca` com o humano.

## Depende de

**Nada em aberto — o item é executável hoje.** `platform.executor_events` existe desde
`db/migrations/platform/0004__executor_events.sql`; o seed idempotente de código tem três precedentes
(0006, 0008, 0009); o gravador que engole a falha e reporta já está escrito
(`db/migrator/src/events.ts:73-106`); e o ponto da decisão de recusar é
`db/migrator/src/preconditions.ts:88-95`.

Uma condição de mesma passada: se a estrutura de `platform` mudar, `db/referencia-estrutural-platform.txt`
acompanha no mesmo commit. Esse arquivo **é** a verdade do `verify`, e referência defasada faz o `verify`
sair `3` listando estrutura real como sobra (medido, `:62`).

## Gate obrigatório

**`arquiteto-dados`** responde o checklist de `.claude/rules/migrations.md` §10 — a migration é de
`platform`, transacional, idempotente, e não toca schema de cliente.

**`seguranca`**: gate 2 do `CLAUDE.md` §4 (DDL). O escopo da auditoria é curto e nomeado: o evento não
pode carregar segredo nem dado pessoal, e o caminho de escrita não pode alterar o desfecho da recusa.

## Referências

`docs/auditorias/2026-09-11-gate-final-camada-de-papel.md:270-279` (a decisão do auditor e os dois
limites) · `:50` (`Q2`, a recusa medida sobre banco vazio) · `db/papel-do-cliente.md` §7.7 ·
`db/migrator/src/preconditions.ts:69-95` · `db/migrator/src/executor.ts:117-134` (o precedente
`load_refused`) · `db/migrator/src/events.ts:73-106` · `db/migrator/IMUTABILIDADE-E-FATOS.md` §19.2 e
§19.4 · `db/migrations/platform/0009__event_kinds_tenant_reach.sql` (a régua dos códigos)

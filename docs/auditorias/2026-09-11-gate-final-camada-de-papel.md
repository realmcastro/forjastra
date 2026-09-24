# Auditoria — gate final da camada de papel (T-0009 e T-0011)

**Data:** 2026-09-11 · **Agent:** `seguranca` · **Read-only.**
**Escopo:** o que mudou em código desde `docs/auditorias/2026-09-11-camada-de-papel.md`
(`PAP-01`…`PAP-12`). Medido: `db/migrator/src/{preconditions,tenant-role,tenant-reach,executor,config}.ts`,
`src/commands/verify.ts`, `src/run.ts`, `db/papel-do-cliente.md` §7.2–§7.7,
`db/verificacao-do-papel.md` inteira, `db/migrations/platform/0009__event_kinds_tenant_reach.sql`,
`db/migrator/test/{papel-do-cliente,recusa-de-borda,crivo}.test.ts`, e do lado do servidor
`apps/api/src/db/{pool,tenant-role,tenant-db}.ts`.

**Antecessoras, nenhuma editada:** `…-executor-e-schema-platform.md`,
`…-executor-e-schema-platform-reauditoria.md`, `…-delta-db-e-borda-api.md`,
`…-executor-implementado.md`, `…-camada-de-papel.md`.

**Numeração:** continua o prefixo `PAP-`, em `PAP-13`. Mesmo escopo, mesma camada.

**Vereditos na §5.** Curto: seis dos doze achados anteriores estão fechados e medidos; três estão
**parcialmente** fechados, e a parte que sobra em cada um é a mesma classe do achado original, uma
casa ao lado. Três `ALTO`, um `MÉDIO`, dois `BAIXO`.

---

## 0. Método

PostgreSQL **16.15** em container descartável próprio (`postgres:16`, porta 55432, `trust`), criado
e **removido ao fim** (conferido: `docker ps` vazio). Não usei o Postgres do ambiente do humano.
Sondas em `scratchpad`; nada escrito na árvore do projeto fora deste arquivo e das duas seções de
ficha. As duas suítes foram rodadas contra o `dist/` que elas mesmas compilam, então o binário
medido é o código auditado.

**As duas suítes, rodadas por mim:**

| Suíte | Resultado |
|---|---|
| `db/migrator` (`FORJA_MIGRATOR_TEST_ADMIN_URL` num servidor `trust`) | `83 tests · 82 pass · 0 fail · 1 skipped` (o piso, sem servidor antigo), saída `0` |
| `apps/api` (`FORJA_TEST_DATABASE_URL` num banco com poder de criar papel) | `39 tests · 39 pass · 0 fail`, saída `0` |

Confere com o que o humano verificou. **Com o servidor autenticando por senha, em vez de `trust`, a
mesma suíte do executor dá `82 pass` menos nove: `# fail 0 # cancelled 9`, saída `1`**. É o
`PAP-17`.

Arranjo vivo reproduzido inteiro, do zero, para cada sonda: grupo `forja_app`, credencial
`LOGIN NOINHERIT`, executor `LOGIN CREATEROLE NOSUPERUSER` com `ADMIN OPTION` no grupo, os dois
`REVOKE` da §7.2, dois clientes provisionados pelo comando, e a borda de `apps/api` conectada por
cima com `createPool`/`createRootDb`/`tenantTransactionRunner` reais.

| Sonda | Pergunta | Resultado |
|---|---|---|
| `Q1` | o ato da §7.3 emite a opção nova? | sim: as três concessões à credencial saem `inherit_option = f`, `set_option = t`. `provision` e `verify` saem `0` |
| `Q2` | `PAP-07`: ambiente nomeando papel que não é a credencial | `provision`, `migrate` e `verify` saem **`2`**, nenhuma concessão ao papel nomeado, nenhum schema criado, e **`platform` sequer existe** ao fim: a recusa corre antes da primeira escrita |
| `Q3` | concessão herdável emitida **pelo executor**, depois `migrate --schema` | converge `t → f`, a leitura direta volta a `permission denied`. É o que o teste cobre |
| `Q4` | a mesma concessão emitida **pelo operador** (`postgres`) | **não converge.** `migrate` sai `0` dizendo "completando o papel de banco", a linha herdável sobrevive, a credencial nua continua alcançando `t_acme`, e `verify` fica em `3` para sempre |
| `Q5` | `REVOKE app_t_acme FROM forja_credencial` emitido pelo executor sobre o estado do `Q4` | **aceito**, e apaga só a linha do executor: sobra a herdável do operador. A correção manual óbvia piora o estado |
| `Q6` | `GRANT app_t_acme TO ops_leitura` (papel `LOGIN` de fora) | `verify` sai **`3`**, linha `alcance ao schema "t_acme": ops_leitura é membro do papel do cliente`. A pergunta invertida funciona |
| `Q7` | a mesma linha **com `WITH ADMIN OPTION`** | `ops_leitura` lê `t_acme.orders` (`{id:1, total_cents:111}`) sem assumir papel, e `verify` sai **`0`, sem uma linha** |
| `Q8` | view de apoio em `public` sobre dois clientes, com `PUBLIC` ainda com `USAGE` no `public` | a credencial **nua** lê os dois clientes por ela. `verify` registra só `ato do operador pendente`, sem mudar código de saída, e nada nomeia a view |
| `Q9` | janela de rotação: duas credenciais no grupo, ambiente na nova | `verify` **`3`** e `migrate` **`3`** em **todo** cliente existente, nomeando a credencial antiga como quem "alcança indevidamente"; `provision` de cliente novo sai `0` |
| `Q10` | `FORJA_DATABASE_URL` da API apontando para o executor | falha fechado: `42501 permission denied to set role "app_t_acme"` |
| `Q11` | `FORJA_DATABASE_URL` da API apontando para superusuário | funciona, e **fica contido**: dentro da transação `current_user = app_t_acme` e o outro cliente dá `42501` |
| `Q12` | `FORJA_MIGRATOR_DATABASE_URL` apontando para a credencial da aplicação | falha fechado: `1`, `permission denied for database`, nada criado |
| `Q13` | o mesmo apontando para superusuário | `provision` e `verify` saem `0`; os schemas nascem com dono `postgres` e sobra uma linha `privilégio inesperado` sem veto (§13.4, declarado) |
| `Q14` | `FORJA_MIGRATOR_PLATFORM_REFERENCE` apontando para arquivo vazio | falha fechado: saída `3`, toda a estrutura real listada como "sobra" |
| `Q15` | a borda com a credencial correta | `current_user = app_t_acme`, `session_user = forja_credencial`, lê o próprio cliente, `42501 permission denied for schema t_globex` no outro |

---

## 1. Prioridade um: existe caminho em que um cliente vê dado de outro?

**Sim, dois medidos, e nenhum deles depende de o schema estar errado.** Os dois estão abaixo como
`PAP-14` e `PAP-15`. Item por item:

1. **Consulta que alcança schema de outro cliente?** Pela borda, não: `Q15` mede o desfecho certo de
   ponta a ponta, com o artefato de produção. Fora da borda, sim, por duas portas que a verificação
   não olha (`PAP-14`, `PAP-15`).
2. **O tenant vem de identidade autenticada?** Sim, por assinatura: `TenantDirectory.resolve` recebe
   só o `Principal` (`apps/api/src/tenant/context.ts:50`) e o padrão devolve `null`
   (`:64`). Inalterado e continua bom.
3. **Operação de dados com tenant ausente cai em default?** Não. Só
   `tenantTransactionRunner` produz `TenantDb` (`apps/api/src/db/tenant-role.ts:56`), a raiz é
   marcada e não é exportada para rota. `SEC-12` **fechado**: as duas marcas existem e são
   mutuamente inatribuíveis (`apps/api/src/db/tenant-db.ts:24` e `:36`).
4. **Id de recurso validado contra o tenant?** Não se aplica: só existe `/health`
   (`apps/api/src/http/server.ts:223`). O análogo uma camada abaixo é a pergunta invertida, e ela
   tem um furo (`PAP-14`).
5. **Canal lateral com tenant no escopo?** Um medido, e é o `PAP-15`: objeto em `public` fora do
   campo de visão de toda pergunta que este sistema faz. O canal do pool (`PAP-04`) está **fechado**
   no mecanismo, medido no `Q15` e coberto por teste vivo.

---

## 2. Achados

### PAP-13 — a convergência da herança é escopada ao concedente, e o `migrate` sai `0` sobre o estado que ela não corrigiu — [ALTO] — **reincidente de `PAP-01`**
ONDE: `db/migrator/src/tenant-role.ts:243-252` (a reemissão), `:156` (`credencial_herda` vira parte a
convergir), `db/papel-do-cliente.md:126` e `:236-244` (a afirmação), tabela da §7.4 em
`db/papel-do-cliente.md:224`, e o teste em `db/migrator/test/papel-do-cliente.test.ts:322-324`.
CENÁRIO: medido (`Q4`). A credencial da aplicação é criada pelo **operador** na §7.2, que é quem tem
superusuário. Esse mesmo operador encontra o `permission denied for schema` da prova E ao subir a
primeira rota e "conserta" com `GRANT app_t_acme TO forja_credencial WITH INHERIT TRUE`, na conexão
que ele já tem aberta. `pg_auth_members` tem uma linha **por concedente**, então isso não altera a
linha do executor: passam a existir duas, `forja_exec / inherit_option = f` e
`postgres / inherit_option = t`. O efeito é a união: a credencial nua alcança `t_acme` sem assumir
papel nenhum. `verify` acusa `3` e imprime "Converge com migrate --schema t_acme"; `migrate --schema
t_acme` imprime "completando o papel de banco" e **sai `0`**; `verify` volta a `3`. O laço não
termina, e as duas mensagens afirmam uma correção que não aconteceu. Pior (`Q5`): o `REVOKE
app_t_acme FROM forja_credencial` emitido pelo executor é **aceito** e apaga só a linha dele,
deixando a herdável de pé e tirando a legítima.
POR QUE É REAL: a §7.4 e o comentário de `tenant-role.ts:243-247` afirmam, sem condição, que
reemitir "corrige no lugar, sem `REVOKE`", e que "o resultado é estritamente menos privilégio do que
havia". As duas frases valem **só quando o concedente é o mesmo**. A palavra `grantor` não aparece
uma vez em `db/**` nem em `apps/**` (conferido por `grep`), e a chave de `pg_auth_members` é
`(roleid, member, grantor)`.
CORREÇÃO SUGERIDA: `credencial_herda` continua certa (ela é `EXISTS`, pega qualquer linha); a
convergência tem que virar recusa nesse caso, ou emitir `REVOKE … GRANTED BY` por concedente
divergente antes de reconceder, com a §7.4 dizendo qual dos dois — dono: `arquiteto-dados`, depois
`coder`.

**O que no processo deixou passar.** O teste que guarda o `PAP-01`
(`test/papel-do-cliente.test.ts:310-340`) diz no comentário que reproduz "o que um operador escreve
ao encontrar o `permission denied` da prova E e 'consertar' na mão", e roda a linha por
`withClient(executorUrl, …)`. A reprodução foi feita pela conexão que estava à mão, não pelo ator
que o cenário do achado nomeia, e é justamente o ator que decide o desfecho. Some-se o auxiliar
`herda()` (`:525-534`), que lê `linha.rows[0]?.inherit_option` de uma consulta que pode devolver mais
de uma linha: mesmo alguém reproduzindo o caso dos dois concedentes teria uma asserção que responde
pela linha que vier primeiro. **Regra que fecha a classe:** cenário de achado se reproduz com o
sujeito escrito no cenário, e asserção sobre catálogo multi-linha conta linhas em vez de ler a
primeira.

### PAP-14 — `NOT m.admin_option` esconde da pergunta invertida exatamente a concessão que ela existe para achar — [ALTO] — **reincidente em classe de `PAP-02` e `PAP-03`**
ONDE: `db/migrator/src/tenant-reach.ts:49` (e o racional em `:26`),
`db/verificacao-do-papel.md:139` e `:158-161`.
CENÁRIO: medido, os dois lados na mesma sonda. `GRANT app_t_acme TO ops_leitura` (papel `LOGIN`
criado fora do arranjo) faz `verify` sair **`3`** com a linha nomeando `ops_leitura` (`Q6`). A
**mesma linha com `WITH ADMIN OPTION`** faz `ops_leitura` ler `t_acme.orders` sem assumir papel
nenhum, porque a concessão nasce com `inherit_option = t`, e `verify` sai **`0`, em silêncio**
(`Q7`). Uma palavra separa o controle que funciona do controle que não vê nada, e é a palavra que
alguém digita quando quer delegar a concessão adiante. Quem pode produzir esse estado é quem tem
`ADMIN OPTION` sobre `app_t_*`: o operador e o próprio executor, que é exatamente a durabilidade
invisível que o `PAP-03` nomeou.
POR QUE É REAL: o texto declara que a via de membership "aparece no instante em que alguém lhe der
`USAGE` ou membership" (`db/verificacao-do-papel.md:168-170`). Medido, não aparece quando a
membership carrega `admin_option`. O filtro existe para excluir o executor, e existe um jeito de
excluir o executor que não excluiu mais ninguém: excluí-lo pelo **nome** (`current_user`, ou o dono
do schema), que é um sujeito, e não por um sinalizador que qualquer beneficiário pode carregar.
CORREÇÃO SUGERIDA: trocar `NOT m.admin_option` por `m.member IS DISTINCT FROM to_regrole(current_user)`
na via `membro`, e cobrir o caso com `WITH ADMIN OPTION` no teste da §7.5.1 — dono: `arquiteto-dados`.

**O que no processo deixou passar.** O discriminador foi levantado da §7.5, onde ele responde sobre
membership em `forja_app` e a população é "o executor e a credencial", e aplicado na §7.5.1, onde ele
responde sobre membership em `app_t_*` e a população é "qualquer um". O texto usa essa origem como
justificativa: "é o mesmo discriminador que a §7.5 já usa". **Um discriminador carrega a população
que o justificou**; reusá-lo em outra pergunta obriga a reperguntar quem mais está na população nova.
E o teste da §7.5.1 (`test/papel-do-cliente.test.ts:401`) enumera os quatro estados que o `PAP-02`
listou, nenhum deles uma variação dos filtros da consulta nova: teste escrito a partir da lista do
achado prova o achado, nunca o conserto.

### PAP-15 — `public` está fora do campo de visão de todas as perguntas, e uma view ali entrega dois clientes à credencial nua — [ALTO] — extensão de `PAP-02` e `PAP-12`
ONDE: `db/migrator/src/tenant-reach.ts:37` e `:45` (`WHERE n.nspname LIKE 't\_%'` nas duas vias),
`db/migrator/src/commands/verify.ts:51` e `:68-71` (a comparação estrutural cobre `platform` e cada
`t_*`, e só).
CENÁRIO: medido (`Q8`). Numa máquina em que o `REVOKE USAGE ON SCHEMA public FROM PUBLIC` da §7.2 não
foi rodado, o dono do banco cria uma view de apoio, `public.v_pedidos`, unindo `t_acme.orders` e
`t_globex.orders`, e concede `SELECT` nela. A credencial da aplicação, **sem assumir papel nenhum**,
devolve as linhas dos dois clientes. A view roda com o privilégio do dono, então o papel do cliente
deixa de estar no caminho. `verify` sai `3` apenas por diferenças estruturais dos schemas de cliente
e imprime, sobre a condição que habilita tudo isso, só
`ato do operador pendente: PUBLIC ainda alcança o schema public`, que por decisão **não** muda o
código de saída. A view não é nomeada por nada.
POR QUE É REAL: a §7.5.1 corrigiu a **pergunta** (enumerar quem alcança, em vez de conferir o
esperado) e manteve o **universo** (os schemas que se espera que sejam de cliente). Objeto de
terceiro schema é a mesma cegueira do `PAP-02` uma casa ao lado. O crivo impede migration de criar
objeto fora do namespace alvo, então isso só chega por SQL na mão, que `migrations.md` §9 já chama
de drift, e drift em `public` é o único que nenhum comando enxerga.
CORREÇÃO SUGERIDA: afirmar no `verify` que o conjunto de schemas não-sistema é exatamente
`platform` + `t_*`, e que `public` está vazio, com divergência saindo em `3` — uma consulta, sem
privilégio novo — dono: `arquiteto-dados`.

### PAP-16 — a §7.7 autoriza duas credenciais para proteger a rotação, e a §7.5.1 reprova exatamente esse estado — [MÉDIO]
ONDE: `db/papel-do-cliente.md:330-333` e `db/migrator/src/preconditions.ts:24-27` (a pluralidade
declarada) contra `db/migrator/src/tenant-reach.ts:50` e `src/run.ts:286-295` (a recusa).
CENÁRIO: medido (`Q9`). A rotação que a §7.7 descreve, nas palavras dela ("criar a nova, conceder,
migrar a configuração e só então retirar a velha"), põe duas credenciais no grupo. No instante em que
a configuração migra para a nova, `verify` sai `3` e `migrate` sai `3` em **todo** cliente existente,
com a mensagem "alguém além do dono e do papel do cliente alcança o schema … adotá-lo em silêncio
seria herdar alcance que ninguém declarou", nomeando a credencial legítima anterior. `provision` de
cliente novo continua saindo `0`, e o cliente nasce com o papel concedido só à credencial nova, isto
é, inalcançável pela aplicação que ainda está rodando com a antiga.
POR QUE É REAL: a §7.7 escreveu, com todas as letras, que recusar a pluralidade "travaria `migrate` no
meio de uma rotação, que é exatamente a hora em que travar custa mais caro". A §7.5.1, escrita na
mesma rodada, em outro arquivo, trava `migrate` no meio da rotação. O operador que encontrar isso
tem duas saídas rápidas e as duas são ruins: revogar a credencial antiga enquanto a aplicação ainda a
usa (o caixa para), ou voltar a configuração para a antiga e não rotacionar.
CORREÇÃO SUGERIDA: a §7.5.1 excluir o conjunto de credenciais que a §7.7 aceita (membros de
`forja_app`, com `LOGIN`, sem `admin_option`), em vez do único nome vindo do ambiente, e a §7.7 dizer
qual das duas manda — dono: `arquiteto-dados`.

**O que no processo deixou passar.** Duas regras corretas, escritas na mesma passada, em dois
arquivos, com consequências opostas sobre o mesmo estado, e nenhuma citando a outra. É a classe de
[[gotcha-regra-nova-que-nao-corrige-a-celula-nasce-inerte]] fora de `docs/produto`. E metade disto já
estava prevista: [[gotcha-ordem-de-provisionamento-decide-se-o-env-errado-e-pego]] registra que a
verificação de alcance "acusa nomeando o legítimo como intruso" quando o parâmetro muda depois. O
registro existia, a correção nova produziu exatamente o sintoma dele, e ninguém releu o registro ao
escrever a §7.7.

### PAP-17 — o guarda do "pulado com motivo" cobre dois `SQLSTATE`, e a suíte quebra com `fail 0` no servidor mais comum — [BAIXO]
ONDE: `db/migrator/test/papel-do-cliente.test.ts:615-626`.
CENÁRIO: medido. Contra um Postgres com `scram-sha-256` (o padrão de qualquer container
`postgres:16` sem `POSTGRES_HOST_AUTH_METHOD=trust`, e o do ambiente local deste repositório), o
`before` do arquivo conecta como papel sem senha e o `pg` levanta um erro **de cliente**,
`SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string`, que não tem `code`. O guarda só
reconhece `28000` e `28P01`, então relança, o hook falha, e a suíte imprime
`# tests 83 · # pass 73 · # fail 0 · # cancelled 9` com saída `1`. Os nove testes cancelados são a
camada de papel inteira.
POR QUE É REAL: `# fail 0` é a linha que qualquer pessoa lê primeiro, e ela diz zero falhas enquanto o
arquivo que prova o `PAP-01` inteiro não rodou. O guarda existe para o caso "não dá para medir aqui" e
não cobre a forma mais provável dele.
CORREÇÃO SUGERIDA: reconhecer também o erro sem `code` cuja mensagem casa com a exigência de senha, e
pular com o mesmo motivo — dono: `coder`.

### PAP-18 — a lista de casos do `CONTRATO.md` §14 parou em 35, três testes citam números que não existem e dois arquivos disputam o 35 — [BAIXO]
ONDE: `db/migrator/CONTRATO.md:305` (último caso, sobre view e `RETURNS SETOF`) contra
`db/migrator/test/papel-do-cliente.test.ts:310` ("Caso 35, o `PAP-01`"), `:368` ("Caso 36"), `:401`
("Caso 37"), `:490` ("Caso 38"), e `test/crivo.test.ts:357` ("Caso 35"). `test/recusa-de-borda.test.ts`
não cita caso nenhum.
CENÁRIO: alguém confere a cobertura pela lista, encontra 35 casos e 35 na lista, e conclui que a suíte
está descrita. Dois testes diferentes respondem por "caso 35", e três casos citados não existem.
POR QUE É REAL: a definição de pronto de `processo.md` §2 usa o número como o laço entre contrato e
teste. Laço duplicado é laço que não prende: nenhuma das duas pontas acusa.
CORREÇÃO SUGERIDA: estender a lista §14 até o caso que existe, e renumerar as citações duplicadas —
dono: `arquiteto-dados`.

---

## 3. Os cinco pontos do brief, respondidos

**1. O `.env` copiado, e o limite geral do controle parametrizado.** A correção está de pé e eu
medi (`Q2`): os três comandos saem `2`, nenhuma concessão sai, nenhum schema nasce, e `platform`
sequer chega a existir. A pergunta confere o ambiente contra o catálogo, como o achado pedia.

Sobre o limite: há **quatro** parâmetros nossos que nomeiam um sujeito ou uma autoridade do mundo, e
os medi um por um.

| Parâmetro | Confere contra o mundo? | Desfecho medido de apontar errado |
|---|---|---|
| `FORJA_MIGRATOR_APP_CREDENTIAL_ROLE` | **sim**, §7.7 | `2`, antes da primeira escrita (`Q2`) |
| `FORJA_MIGRATOR_DATABASE_URL` | só o prefixo `app_` | credencial da aplicação: falha fechado, `1`, nada criado (`Q12`). Superusuário: `provision` e `verify` saem `0`, schemas com dono `postgres`, e sobra a linha `privilégio inesperado` sem veto (`Q13`) |
| `FORJA_MIGRATOR_PLATFORM_REFERENCE` | não, e é o parâmetro que **é** a verdade do `verify` | falha fechado: referência vazia lista a estrutura inteira como sobra e sai `3` (`Q14`) |
| `FORJA_DATABASE_URL` (`apps/api`) | **não**, e é o gêmeo exato do `PAP-07` do outro lado da parede | executor: falha fechado, `42501 permission denied to set role` (`Q10`). Superusuário: funciona e **fica contido** dentro da transação, com `42501` no outro cliente (`Q11`) |

Conclusão, e é a razão de nenhum deles virar achado: os três não conferidos **falham fechado hoje**,
e nos dois casos que importam quem os fecha não somos nós. O que fecha o `Q10` é `set_option = f` do
`CREATEROLE` do 16; o que fecha o `Q12` é o executor não ter `CREATE` no banco. São propriedades do
servidor, e a §7.7 acabou de estabelecer no repositório a postura contrária: confere-se o parâmetro
antes de confiar. Registro como recomendação, não como achado: `apps/api` ganhar, na subida, a mesma
pergunta de uma linha ao catálogo sobre a própria credencial (existe, tem `LOGIN`, é membro de
`forja_app` sem `admin_option`, e nenhuma concessão dela é herdável). Sem ela, `PAP-13` do lado do
banco é invisível do lado do servidor, que é onde ele custa.

**2. A conexão de controle do `pg`.** Não é achado, e a declaração do `backend` está correta. Li o
uso no Kysely: `postgres-driver.js:25` repassa `pool.Client`, e `#executeControlQuery` (`:163-192`) o
usa para exatamente dois textos, `select pg_cancel_backend(<pid>)` e
`select pg_terminate_backend(<pid>)` (`:91` e `:134`), com o `pid` vindo do `processID` da conexão,
produzido pelo servidor. Nenhum identificador de fora entra no texto, a conexão não assume papel, e
nada em `apps/api` hoje dispara cancelamento. O que ela **é**, e vale escrever no lugar certo: a
única exceção declarada ao invariante "todo texto que sai por esta conexão carrega parâmetro ligado"
(`apps/api/src/db/pool.ts:115-117`). Enquanto o texto for template com número vindo do driver, a
exceção é inerte; no dia em que alguém passar `controlClient` com valor de fora, é protocolo simples
outra vez.

**3. A recusa de borda não escreve evento. Merece?** **Sim, e eu decido pelo sim**, com dois limites.
O precedente interno é `load_refused` (`src/executor.ts:126-134`, §19.4), que abre conexão **só** para
registrar uma recusa que já foi decidida, pelo argumento de que achado que só existe no terminal some
com o terminal. A recusa de borda é da mesma espécie e tem um valor forense que a outra não tem:
é o registro de que alguém rodou o executor contra este banco nomeando um papel que não é a
credencial, que é a primeira coisa que se procura quando se suspeita de alcance indevido. Os dois
limites: só quando `platform.executor_events` existe (na sonda `Q2`, sobre banco vazio, não havia onde
escrever, e evento que às vezes não sai é registro que mente por omissão, então a ausência é
declarada e não silenciosa); e falhar ao escrever não muda o desfecho nem a saída `2`, como na §19.4.
É migration de domínio, dono `arquiteto-dados`. **Não é bloqueio de fechamento.**

**4. O executor superusuário no teste da §7.7.** **Aceito o argumento**, e ele é mais forte do que o
autor escreveu. A asserção que importa naquele arquivo é **negativa** (nenhuma concessão saiu), e com
superusuário todos os `GRANT` impedidos funcionariam, então a ausência prova o momento da recusa em
vez de refletir falta de privilégio. Acrescento o que fecha a dúvida do outro lado: a consulta de
`preconditions.ts:38-50` lê `pg_roles` e `pg_auth_members`, que são legíveis por qualquer papel, e
`to_regrole` devolve nulo em vez de erro, então não há caminho pelo qual a recusa se comporte
diferente para um executor não-superusuário. O caminho **saudável** com executor não-superusuário já
está coberto no outro arquivo. A cobertura é completa entre os dois; o que faltava era dizer isso, e
o comentário do arquivo diz.

**5. A mudança de código de saída.** Está declarada no lugar canônico:
`db/migrator/PROVISION-E-VERIFY.md` §12 põe "precondição de papel não satisfeita
(`db/papel-do-cliente.md` §7.7)" na linha do `2`, e "alcance de terceiro ao schema de um cliente
(§13.5)" na linha do `3`. Quem automatiza lê essa tabela, e a §7.7 ainda explica em prosa por que `2`
e não `3`. **Uma lacuna:** o `CONTRATO.md` §14, que é onde se confere se o comportamento tem caso, não
tem caso para nenhum dos dois (é o `PAP-18`). Então a promessa está escrita e a prova de que ela é
cobrada não está indexada.

---

## 4. Notas — sem cenário, não são achados

- **Comentário vencido em `src/executor.ts:33-35`**: diz que `resolveContentScreen()` "hoje devolve
  `undefined` e faz a rodada ser recusada". Ela devolve o crivo real desde que a §11 foi implementada
  (`src/content-screen.ts:45-47`). Quem ler só o comentário conclui que o executor recusa toda rodada.
- **O `verify` do `Q13` sai `0` com os schemas pertencendo a `postgres`.** É a §13.4 funcionando como
  desenhada (registro sem veto), e o desencontro de privilégio padrão que isso cria é pego depois por
  `tabelas_sem_select`. Fica anotado porque o dono do schema é o sujeito que o `PAP-14` recomenda usar
  como âncora, e as duas coisas precisam ser decididas juntas.
- **`PAP-05` fechado e medido.** `apps/api/src/db/tenant-role.ts:61` assume o papel com
  `set_config('role', $1, true)`, o `Q15` confirma `current_user = app_t_acme` dentro da transação e
  `42501` no outro cliente, e os comentários dos dois arquivos agora apontam para a §6.2.
- **`PAP-04` fechado no mecanismo.** `apps/api/src/db/pool.ts:70-101` força `queryMode: 'extended'`
  mesmo com `values: []`. Coberto por teste vivo na suíte de `apps/api`, que rodou.
- **`PAP-06`, `PAP-08`, `PAP-09`, `PAP-10`, `PAP-11`, `PAP-12` fechados**, conferidos por leitura
  dirigida: a coluna do privilégio padrão virou sinal com nome que diz sobre quem ela responde
  (`src/tenant-role.ts:78` e `:168-176`); `REVOKE TEMPORARY` entrou na §7.2
  (`db/papel-do-cliente.md:56`) com a pergunta correspondente (`src/tenant-reach.ts:105-115`); o
  `(?:setof )?` saiu do padrão (`src/refusals.ts:130`) e o caso está no `crivo.test.ts:392`; os três
  estados têm três códigos e só os convergíveis imprimem o comando (`src/commands/verify.ts:196-203`);
  nenhuma afirmação de piso 15 sobrou.

---

## 5. Vereditos

**1. O executor pode provisionar um cliente que vai operar de verdade?**

**Sim, e desta vez a cadeia inteira foi medida, não só o ato.** `provision` cria registro, schema,
migrations e papel com a concessão certa (`inherit_option = f`, `set_option = t`); `verify` sai `0`; e
a borda de produção, com esse cliente, lê o próprio schema e leva `42501` no do vizinho (`Q1`, `Q15`).
Isso é mais do que existia no gate anterior, em que a borda não assumia papel nenhum.

**Com uma condição que não é do executor e que ele não consegue provar:** o ato do operador (§7.2)
precisa estar aplicado **inteiro** naquele banco, os dois `REVOKE` inclusive, e ninguém pode ter
concedido `app_t_*` à mão. Nenhuma das duas coisas o `verify` reprova hoje: a primeira ele registra sem
veto, e é ela que abre o `PAP-15`; a segunda ele reprova em uma forma e não vê na outra (`PAP-14`).
Então a resposta prática: **provisione**, e antes do primeiro cliente em operação rode uma vez, à mão,
as duas perguntas que o comando não faz: `nspacl` de `public` e `datacl` do banco sem entrada para
`PUBLIC`, e `pg_auth_members` sobre cada `app_t_*` contendo apenas o executor e a credencial.

**2. `T-0009` e `T-0011` podem fechar?**

**`T-0011`: sim.** Tudo que a auditoria anterior apontou em `apps/api` está fechado e medido
(`PAP-04`, `PAP-05`, `SEC-12`), a suíte roda 39/39 contra banco de verdade, e nada novo apareceu do
lado do servidor. A única coisa que sobra é recomendação, não defeito: a pergunta de subida sobre a
própria credencial (§3, ponto 1), que é trabalho novo e cabe em item de backlog.

**`T-0009`: não, e falta pouco.** O entregável da última rodada foi "esta camada passa a ser
verificável", e três estados medidos hoje ou passam como conformes ou têm a correção anunciada e não
executada. Para fechar:

1. **`PAP-14`**: trocar um predicado por outro na via `membro` da §7.5.1, mais um caso de teste com
   `WITH ADMIN OPTION`. É o mais barato e o que mais compra: sem ele, a pergunta invertida tem um furo
   do tamanho do que ela veio consertar.
2. **`PAP-13`**: decidir entre recusar ou revogar por concedente, corrigir as duas frases que afirmam
   convergência incondicional, e reescrever o teste para emitir a concessão pelo **operador**.
3. **`PAP-15`**: a asserção de que não existe schema não-sistema fora de `platform` + `t_*` e de que
   `public` está vazio.
4. **`PAP-16`**: alinhar §7.7 e §7.5.1 sobre quantas credenciais existem. Uma frase decide, e a frase
   é de quem opera.

`PAP-17` e `PAP-18` não seguram o fechamento, mas o `PAP-17` **atrapalha a conferência dele**: enquanto
o guarda não reconhecer o servidor com senha, a suíte que prova esta camada pode não rodar e ainda
dizer `# fail 0`.

**Contagem de reincidência, que é o sinal sobre o processo.** O crivo reabriu quatro vezes; a camada
de papel, uma; agora, duas (`PAP-13` e `PAP-14`) mais uma extensão (`PAP-15`). O padrão comum às três
não é descuido de quem corrigiu: nos três casos a correção mudou a **pergunta** e conservou alguma
fronteira da pergunta antiga: o concedente, a população do discriminador, o universo de schemas. E as
três foram provadas por testes montados a partir da lista do achado. **A regra que fecharia a classe:**
todo conserto de achado entrega, junto, um caso que ataca o **conserto** e não o achado, escrito
perguntando quem mais cabe na condição nova.

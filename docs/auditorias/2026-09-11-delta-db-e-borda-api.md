# Auditoria — delta de `db/**` e gate 3 sobre a borda de `apps/api`

**Data:** 2026-09-11 · **Agent:** `seguranca` · **Read-only.**
**Escopo A:** T-0009, delta da correção da reauditoria (`MIG-09` a `MIG-17`), gate 2.
**Escopo B:** T-0011, gate 3 (`CLAUDE.md` §4) sobre `apps/api/src/**` — primeira auditoria.

**Antecessoras, nenhuma editada:** `docs/auditorias/2026-09-11-executor-e-schema-platform.md`
(`MIG-01`…`MIG-08`) e `docs/auditorias/2026-09-11-executor-e-schema-platform-reauditoria.md`
(`MIG-09`…`MIG-17`).

**Os dois vereditos estão na §6 e na §7**, e o segundo mais curto dos dois é o que importa:
**oito dos nove achados da reauditoria fecham; `MIG-10` reabre** por uma grafia, e ele é o único que
bloqueava o `coder`.

---

## 0. Método — o que foi medido

PostgreSQL **16.15** (`docker.io/library/postgres:16`), container descartável, removido ao fim.
Papel **`forja_exec`**, `NOSUPERUSER NOCREATEDB`, dono do banco e do schema — é a credencial do
executor, não a do superusuário, e a diferença muda o resultado de duas provas. `0000`…`0004`
aplicadas dos arquivos reais, sem edição. Borda de `apps/api` exercitada contra o `dist/` compilado
do código real, com sonda própria em `/tmp` (nada escrito na árvore do projeto).

| Prova | Pergunta | Resultado |
|---|---|---|
| `Q1` | `0000`…`0004` aplicam, e duas vezes? | aplicam; segunda rodada só `NOTICE` de guarda. 4 gatilhos em `pg_trigger` |
| `Q2` | a `0002` recusa as seis formas de mutação? | **sim**: `DELETE` com `WHERE`, `DELETE` sem `WHERE`, `DELETE … WHERE false`, `UPDATE` de `slug`, `UPDATE` de `created_at`, `TRUNCATE`. Nenhuma passou |
| `Q3` | o arquivo `db/referencia-estrutural-platform.txt` reproduz do banco real? | **sim**, 62 linhas, `diff` vazio contra a impressão da §13.3 tirada do banco |
| `Q4` | escape 1 (`DISABLE TRIGGER` do dono) funciona, e o `verify` o enxerga? | funciona; `pg_trigger.tgenabled = 'D'`; **a impressão da §13.3 fica idêntica byte a byte** |
| `Q5` | `CREATE OR REPLACE FUNCTION` sobre `reject_mutation` neutraliza o quê? | as **três** tabelas de uma vez: `DELETE` em `tenants` e em `schema_migrations` passaram. A impressão **detecta** (md5 muda) |
| `Q6` | escape 2 (`session_replication_role`) | `permission denied to set parameter` para `forja_exec`; pelo superusuário, `DELETE` passa. Confere com o declarado |
| `Q7` | escape 3 (`REVOKE` do próprio dono) | bloqueia mesmo com gatilho desligado (`permission denied for table tenants`); o dono devolve com `GRANT`. Confere com o declarado |
| `Q8` | a `0003` recusa reescrita do livro-razão? | **sim**: `checksum`, `DELETE`, `DELETE … WHERE false`, `TRUNCATE`, e a reabertura `applied_at → NULL`. A conclusão legítima (em voo → concluída) passa |
| `Q9` | a `0004` recusa mutação de fato? | **sim**: `UPDATE`, `DELETE`, `TRUNCATE`. `TRUNCATE … CASCADE` no domínio também morre, porque o cascade bate na tabela travada |
| `Q10` | o domínio `executor_event_kinds` sem trava — o que dá? | `DELETE` de um código passa; o `INSERT` do evento seguinte morre na chave estrangeira; a impressão não vê (não compara linha) |
| `Q11` | o padrão da §11.3 pega `"t_globex".orders` e `T_GLOBEX.orders`? | **não pega nenhum dos dois**, e o Postgres resolve os dois para o mesmo objeto |
| `Q12` | formas permitidas pela §11.2 + grafia com aspas alcançam outro cliente? | **sim**: a view leu a linha do outro cliente; o `ALTER TABLE` escreveu no schema do outro, e a §10.4 não viu |
| `Q13` | os 5 arquivos do repositório passam nas próprias regras §11.3/§11.5? | **passam**. Nenhum falso positivo sobre os literais que existem hoje |
| `Q14` | rota desconhecida sem identidade responde o quê? | **401**, em `GET`, `POST`, `HEAD` e `OPTIONS`. `routeOptions.config` existe no contexto de 404, então o hook não explode |
| `Q15` | rota registrada sem `anonymous` | **401**. Nasce fechada, confirmado |
| `Q16` | `x-request-id` enviado pelo chamador | ignorado; o devolvido é sempre nosso |
| `Q17` | `tenantOf` em rota sem contexto | `500 internal_error` + fato `request_failed_internal`. Falha fechado |
| `Q18` | `search_path` no pool compartilhado vaza? | **vaza**: depois de servir `t_globex`, a consulta sem alvo leu `t_globex`, `current_schema()` = `t_globex` |
| `Q19` | a solução nova tem o problema simétrico? | **não**: emite `select "dono" from "t_globex"."orders"`; a consulta sem escopo na mesma conexão caiu em `public`, nunca no cliente anterior |
| `Q20` | fragmento cru dentro de handle preso ao schema | leu a isca de `public`, em silêncio. Confirma o buraco declarado |
| `Q21` | tempo: rota que existe × rota que não existe, sem credencial | 3000 amostras cada: **226,3 µs × 139,6 µs**. Com `nullFactSink`: 152,3 µs × 118,7 µs |
| `Q22` | volume que um anônimo escreve no canal de fato | 3500 requisições → 3500 linhas, 955 500 bytes, **273 bytes por requisição** |
| `Q23` | `x-request-id` em rajada no mesmo milissegundo | `…-7000`, `…-7001`, `…-7002`: a sequência é pública |
| `Q24` | `apiErrorFromPostgres` confunde código de erro do Node? | `EPIPE`, `EPERM`, `EBUSY` → `sqlstate=<código>`. `ENOENT` e `ECONNRESET` não |
| `Q25` | segredo na árvore de `apps/api` | nenhum. `FORJA_DATABASE_URL` no `.env.example` sem valor; as outras 8 chaves são número, nível de log e `127.0.0.1` |

Verificação de sanidade do código: `npm run typecheck` limpo, `npm test` **27/27**. Rodados por mim,
não herdados do relatório.

---

## 1. Achado por achado da reauditoria

| # | Estado | O que verifiquei |
|---|---|---|
| `MIG-09` | **FECHADO no mecanismo** | `Q1`, `Q2`. O ataque medido em `P12` não passa mais em nenhuma das seis formas. O que sobra é detecção do desligamento → `SEC-02` |
| `MIG-10` | **REABERTO** | `Q11`, `Q12`. A §11.3 nasceu com mecanismo escrito dos dois lados, e o mecanismo cai com aspas e com maiúscula → `SEC-01`, **reincidente** |
| `MIG-11` | **FECHADO** | `Q3`. O arquivo de referência reproduz byte a byte do banco real. A perna do `platform` passa a ter resposta a cada rodada, sem `CREATEDB`. A saída `4` fica reservada ao transitório |
| `MIG-12` | **FECHADO** | `APLICACAO-E-ALVO.md:83-92`: as duas buscas estão separadas e a de achado tem consulta escrita, por nome em todos os namespaces |
| `MIG-13` | **FECHADO** | `PROVISION-E-VERIFY.md:91-97`: enumeração pelo catálogo, registro como confronto, as duas direções nomeadas e com tipo de evento. O descartável órfão tem tratamento próprio |
| `MIG-14` | **FECHADO** | `papeis-e-credencial.md:38-56`: `forja_app` torna "que papéis são de aplicação" fato de catálogo, e "com que papel a aplicação conecta" fica declarado como observável de execução. A consulta funciona inclusive se alguém conceder `USAGE` direto ao membro, porque `has_schema_privilege` mede privilégio efetivo |
| `MIG-15` | **FECHADO em oito de nove** | `0004` dá casa às duas detecções e a mais oito. A nona ausência não está na lista → `SEC-04` |
| `MIG-16` | **FECHADO** | `APLICACAO-E-ALVO.md:210-231`. A §10.3.0 existe, a citação é no servidor e vale para os dois lugares que criam schema. **Não remedi o slug hostil** — a medida é do autor, e o caminho (`format('%I')` no servidor, texto devolvido) é o correto |
| `MIG-17` | **FECHADO** | §11.6 recusa a rodada inteira se houver arquivo de módulo; `PROVISION-E-VERIFY.md:59-66` e `:116-122` dizem o que o executor faz enquanto o registro não existe. Os dois artefatos passam a dizer a mesma coisa |

Nota sobre a nota anterior: o gerador de `tenant_id` deixou de ser lacuna
(`PROVISION-E-VERIFY.md:74-79` fixa UUID v7 com `node:crypto`, e estende a mesma regra a
`executor_events.event_id`).

---

## 2. Achados — escopo A (`db/**`)

### SEC-01 — a fronteira de schema da §11.3 cai com aspas e com maiúscula — [ALTO] · **reincidente de `MIG-10`**
**ONDE:** `db/migrator/RECUSAS.md:92-95` (a tabela de qualificadores recusados) e `:170-173`
(§11.7 item 2, que menciona identificador entre aspas e não cobre este caso).
**CENÁRIO:** medido em `Q11` e `Q12`. Alvo `tenant`, `search_path` de um schema só, regime
transacional. Dois comandos que casam **formas inteiras** da §11.2 corrigida:

```sql
CREATE OR REPLACE VIEW espelho WITH (security_invoker = true)
    AS SELECT * FROM "t_globex".orders;          -- devolveu a linha do outro cliente
ALTER TABLE "t_globex".orders ADD COLUMN IF NOT EXISTS intruso text;  -- escreveu no schema do outro
```

O padrão declarado exige `\s*\.` logo depois do identificador; a aspa de fecho entra no meio e o
padrão não casa. A segunda grafia é mais barata ainda: `T_GLOBEX.orders` resolve para o mesmo objeto
(o Postgres dobra identificador não citado para minúscula) e o padrão é só minúsculo. Medi as duas
contra o regex literal do documento: `t_globex.orders` **recusa**; `"t_globex".orders`,
`T_GLOBEX.orders` e `"T_globex" . orders` **passam**. A §10.4 não socorre: no `ALTER TABLE` não nasce
objeto, e a contagem de relações em `t_globex` ficou em 1 enquanto a tabela ganhava coluna.
**POR QUE É REAL:** a §11.3 foi escrita para fechar o `MIG-10` e é o único mecanismo entre uma
migration e o schema de outro cliente. O carregador ainda não existe, então quem o escrever vai
transcrever o padrão como está — é literalmente o que o documento entrega para transcrever. E a
declaração do §11.7 item 2 não cobre: ela fala de comando que **se classifica diferente** da forma
esperada, com desempate "o que não se classifica é recusado"; aqui o comando se classifica
corretamente e o desempate nunca dispara. O `security_invoker` da §11.7 item 5 também não socorre no
pior caso: ele protege quando o papel de aplicação **não** alcança o outro schema, e "um papel de
aplicação por cliente ou um só" segue aberto em `papeis-e-credencial.md` §3.
**CORREÇÃO SUGERIDA:** normalizar antes de comparar (minúscula e aspas removidas), ou recusar `"` em
arquivo de migration, que é o lado seguro que a própria §11.1 escolheu — dono: `arquiteto-dados`.

### SEC-02 — a trava da `0002` se desliga com um comando que nenhum controle do sistema enxerga — [MÉDIO]
**ONDE:** `db/migrator/IMUTABILIDADE-E-FATOS.md:47-48` (escape 1, declarado) e `:55-57` ("três atos
deliberados e **nomeáveis**") contra `db/migrator/PROVISION-E-VERIFY.md:202-205` (a linha `gatilho`
da impressão, que usa `pg_get_triggerdef`).
**CENÁRIO:** medido em `Q4`, com a credencial do executor:

```sql
ALTER TABLE platform.tenants DISABLE TRIGGER tenants_reject_mutation;
DELETE FROM platform.tenants WHERE slug='globex';
UPDATE platform.tenants SET slug='globex' WHERE slug='acme';
```

O `tenant_id` que era do `acme` volta a resolver para `t_globex` — a consequência inteira do
`MIG-09`, três comandos em vez de dois. O catálogo registra `tgenabled = 'D'`, e
**`pg_get_triggerdef` não carrega o estado de habilitação**: a impressão da §13.3 saiu byte a byte
idêntica à referência versionada. `verify` aprova. O contraste está medido em `Q5` e é o que torna
isto um defeito e não um custo: trocar o corpo de `reject_mutation` por `RETURN NULL` neutraliza as
**três** tabelas de uma vez (medido: `DELETE` passou em `tenants` e no livro-razão inteiro) e **essa**
o `md5` da linha `funcao` detecta. O controle pega o escape largo e perde o barato.
**POR QUE É REAL:** a §18.2 declara o escape, e eu confirmo o declarado. O que não se sustenta é a
compensação: "nomeáveis" pressupõe alguém que os nomeie, e não existe. A referência estrutural — o
único artefato que olharia — foi gerada com a coluna que responderia isso de fora.
**CORREÇÃO SUGERIDA:** acrescentar `tgenabled` à linha `gatilho` da impressão da §13.3 e regenerar a
referência — uma coluna, e o escape passa a ser achado do `verify` — dono: `arquiteto-dados`.

### SEC-03 — a captura de fato da `0004` se desarma pela tabela de domínio, e o desenho garante que ninguém perceba — [MÉDIO]
**ONDE:** `db/migrations/platform/0004__executor_events.sql:135-137` (a decisão de não travar o
domínio) contra `:96-97` (a chave estrangeira) e
`db/migrator/IMUTABILIDADE-E-FATOS.md:120-122` (§19.2: falhar ao escrever não muda desfecho nem
código de saída).
**CENÁRIO:** medido em `Q10`, com a credencial do executor, **um comando**:

```sql
DELETE FROM platform.executor_event_kinds WHERE code = 'structure_mismatch';
```

Não há gatilho nessa tabela, então passa. A partir daí, todo achado do `verify` tenta virar linha e
morre em `violates foreign key constraint "executor_events_kind_code_fkey"` — e a §19.2 manda o
executor reportar e **seguir para o que já ia fazer**. A rodada se comporta exatamente como antes, o
código de saída é o mesmo, e a impressão da §13.3 não acusa, porque ela compara estrutura e o
domínio é **linha**. A detecção que a `0004` existe para tornar permanente para de ser escrita sem
nenhum sintoma. Funciona para os dez códigos enquanto nenhum evento daquele tipo existir, e o
`checksum_mismatch` — o mais próximo de evidência de adulteração que o sistema tem — é o mais fácil,
porque num banco saudável ele nunca foi usado.
**POR QUE É REAL:** o comentário da `0004` justifica a ausência da trava raciocinando sobre
**reescrever descrição** ("reescrever uma descrição não apaga fato nenhum"), e o caminho é **apagar
código**, que é outra operação com outra consequência. É a terceira vez nesta tarefa que o mecanismo
novo nasce com o caso de falha dele não tratado ([[gotcha-o-caso-de-falha-do-mecanismo-novo-e-o-primeiro-lugar-a-olhar]]).
Contraponto medido e a favor do autor: `TRUNCATE … CASCADE` no domínio **morre**, porque o cascade
bate na tabela travada. O buraco é exatamente o `DELETE` de linha.
**CORREÇÃO SUGERIDA:** o mesmo gatilho `reject_mutation` sobre `executor_event_kinds` — a tabela é
domínio fechado e valor novo entra por migration, então `UPDATE`/`DELETE` não tem caso legítimo —
dono: `arquiteto-dados`.

### SEC-04 — a recusa do carregador é a única detecção com autor do outro lado, e é a que não vira fato — [MÉDIO] · invariante 10
**ONDE:** `db/migrator/RECUSAS.md:15-17` ("Nenhuma conexão é aberta") contra
`db/migrations/platform/0004__executor_events.sql:29-40` (as três ausências declaradas) e
`db/migrator/IMUTABILIDADE-E-FATOS.md:98-113` (os dez tipos).
**CENÁRIO:** uma migration com o comando do `SEC-01` é commitada e alguém roda `migrate`. O
carregador recusa, saída `2`, nome do arquivo e trecho na saída do processo — e mais nada. Rodar de
novo não deixa rastro; corrigir o arquivo apaga o episódio. Os dez tipos da `0004` cobrem falha,
divergência e drift, que são todos coisas que o **executor** observa sobre si mesmo; a recusa do
carregador é a única em que existe outra pessoa do outro lado, e é a que não tem casa. As três
ausências declaradas são autor humano, identificador de rodada e ato recusado pelos gatilhos — esta
é uma quarta, e não está lá.
**POR QUE É REAL:** o invariante 10 inverteu o ônus. O impedimento aqui não é técnico como no caso
dos gatilhos (lá a transação morre e leva a escrita junto): a credencial existe, o banco está de pé,
e a escolha de não abrir conexão é do desenho da §11, por rapidez. Escolha de desenho é justamente o
que o invariante manda declarar. O que se perde para sempre: que alguém escreveu uma migration que
tentou atravessar a fronteira de cliente.
**CORREÇÃO SUGERIDA:** ou um tipo `load_refused` escrito por conexão aberta só para isso, ou a
ausência entrando na lista da `0004` com o motivo — as duas servem, o silêncio não — dono:
`arquiteto-dados`.

### SEC-05 — divergência em linha `funcao` não distingue servidor que reformatou de corpo que alguém trocou — [BAIXO]
**ONDE:** `db/migrator/PROVISION-E-VERIFY.md:226-231` e
`db/referencia-estrutural-platform.txt:15-17`.
**CENÁRIO:** o risco que o autor levantou, respondido com o que medi. A exposição é pequena — 2 das
62 linhas dependem de formatação do servidor, e troca de versão maior é decisão registrada. A
consequência não é o alarme falso em si, é o que ele ensina: no dia do primeiro alarme, a resposta
certa é "regenera a referência", e quem operou aprende que divergência em `funcao` significa
"regenera". Divergência em `funcao` é exatamente o que `Q5` mostrou detectar a neutralização das três
travas de uma vez. É assim que um controle de integridade morre — não desligado, dispensado.
**POR QUE É REAL:** com `md5` não existe informação para distinguir os dois casos, por construção.
O próprio documento já manda quem investiga ler `pg_get_functiondef` à mão; o que falta é isso não
depender de alguém decidir investigar.
**CORREÇÃO SUGERIDA:** ao divergir uma linha `funcao`, o `verify` imprimir as duas definições em
texto, não só o nome — dono: `arquiteto-dados`.

---

## 3. Achados — escopo B (`apps/api/src/**`)

### SEC-06 — a guarda "rota não casou não produz fato" é ela própria o oráculo de existência de rota — [MÉDIO]
**ONDE:** `apps/api/src/http/server.ts:173-189`.
**CENÁRIO:** medido em `Q21`, 3000 amostras por caso, no processo. Rota que existe e recusa por
identidade: **226,3 µs** de mediana. Rota que não existe: **139,6 µs**. Trocando o destino de fato
por `nullFactSink`, as mesmas medidas dão 152,3 µs e 118,7 µs — ou seja, dos 86,7 µs de diferença,
**~53 µs são a escrita do fato**, e os outros ~34 µs são o caminho de 404, que qualquer framework
tem. Quem não tem credencial nenhuma separa "esta rota existe" de "não existe", que é precisamente a
propriedade que o 401-para-tudo compra, e faz isso sem limite de taxa (declarado ausente pelo autor).
**POR QUE É REAL:** o custo assimétrico está no caminho **não autenticado**, que é o único que o
desenho se propõe a manter indistinguível. **Limitação declarada:** medi no processo, não pela rede;
pela rede, 53 µs exigem estatística, e a ausência de limite de taxa é o que torna a estatística
barata. Não é achado contra o que existe hoje (a única rota é anônima e responde 200), é contra a
primeira rota de negócio.
**CORREÇÃO SUGERIDA:** tirar o trabalho assimétrico do caminho síncrono — emitir o fato depois da
resposta, ou emitir para os dois casos e resolver volume por outro mecanismo — dono: `backend`.

**A pergunta que o autor fez, respondida:** a guarda **não** perde sinal de ataque que valha a pena.
Varredura é volume, e volume se lê no log de acesso, que é onde ele mesmo a colocou; um fato por
tentativa de rota inexistente só transformaria a trilha em medida de varredura, que é o defeito de
[[gotcha-artefato-corrente-colide-com-trilha-por-ocorrencia]]. O problema da guarda é outro e está
acima: ela é o que **torna** o caminho assimétrico.

### SEC-07 — o canal de fato de borda é dirigido por quem não tem credencial — [MÉDIO]
**ONDE:** `apps/api/src/http/server.ts:144-162` com `:177-189`, e
`apps/api/src/observability/border-facts.ts:83-112`.
**CENÁRIO:** medido em `Q22`. O fato `request_rejected_no_identity` nasce **antes** de qualquer
identidade existir. 3500 requisições sem credencial contra um padrão de rota conhecido produziram
3500 linhas e 955 500 bytes: **273 bytes por requisição**, escolhidos por quem chama. Hoje isso vai
para a saída padrão e o autor declara com todas as letras que aquilo não é trilha; o dia que morde é
quando `D-06` fechar e o destino virar retido — aí o mesmo comando afoga o sinal que importa e
consome o orçamento de retenção, e `convention-retencao-tem-tres-relogios` diz que encurtar retenção
por custo é o que não se faz com a prova. `droppedBorderFactCount` conta falha do destino, nunca
volume, então nem o sintoma aparece.
**POR QUE É REAL:** o autor declarou o custo do limite de taxa pelo lado de `D-03` ("cada requisição
sem credencial passa a custar verificação de prova"). O custo que já existe hoje é outro e não está
declarado: o volume do canal de observabilidade é do chamador anônimo.
**CORREÇÃO SUGERIDA:** teto por janela para fato de recusa por identidade, com o excedente virando
**contagem** em vez de linha — dono: `backend`, com o destino durável ficando com `D-06`.

### SEC-08 — `x-request-id` publica o contador global de ids na única superfície pública — [MÉDIO]
**ONDE:** `apps/api/src/http/server.ts:133-135` e `:96`, com `apps/api/src/id/uuid-v7.ts:15-34`.
**CENÁRIO:** medido em `Q23`. Três chamadas a `/health` no mesmo milissegundo devolveram ids
terminando em `-7000`, `-7001`, `-7002`: os 12 bits de sequência são zerados por milissegundo e
incrementados por **cunhagem**, e o gerador é o mesmo do identificador de requisição e do
identificador de fato de borda (`border-facts.ts:98`). Quem consulta `/health` duas vezes e lê a
diferença de sequência conta quantos ids o processo cunhou no intervalo — requisições de todos os
clientes e fatos de todos os clientes. Repetindo, sai uma série temporal de atividade do servidor
inteiro, sem credencial. `gotcha-agregado-e-seguro-por-concentracao-nao-por-N` é a posição já
registrada do projeto sobre isto: com um cliente dominante, o agregado **é** a curva dele.
**POR QUE É REAL:** `/health` é a única superfície pública, nasce em `127.0.0.1` e o autor pediu que
ela passasse pelo gate. Este é o achado que decide se ela pode sair do loopback: enquanto for
loopback, o alcance é de quem já está na máquina; exposta, não é.
**CORREÇÃO SUGERIDA:** sortear os 12 bits de sequência no início de cada milissegundo (a
monotonicidade dentro do processo se mantém com contador separado do valor publicado), ou não
devolver `x-request-id` em rota anônima — dono: `backend`.

### SEC-09 — o buraco declarado do SQL cru falha em silêncio, e podia falhar alto — [BAIXO]
**ONDE:** `apps/api/src/db/pool.ts:19-28` (nenhum `search_path` fixado) com
`apps/api/src/db/tenant-db.ts:32-35` (o buraco, declarado).
**CENÁRIO:** medido em `Q20` e `Q19`. `sql\`select dono from orders\`` sobre um handle
`withSchema('t_acme')` devolveu a linha plantada em `public` — sem erro, com dado. O `search_path`
da conexão da aplicação é o padrão `"$user", public` (medido), porque `createPool` não fixa nenhum.
Então o desfecho do fragmento cru é ler `public` em silêncio; e se a opção ainda aberta de
`papeis-e-credencial.md` §3 for **um papel por cliente** com o papel nomeado como o schema, o
desfecho vira ler aquele schema em silêncio (medido com um papel chamado `t_globex`:
`current_schema()` = `t_globex`).
**POR QUE É REAL:** o buraco já está declarado e já virou proibição em `.claude/rules/backend.md`,
e **não há fragmento cru em `src/` hoje** — verifiquei. O que é evitável é o modo de falha: hoje a
proibição é a única camada, e quando ela for violada o sintoma é dado errado, não erro.
**CORREÇÃO SUGERIDA:** fixar o `search_path` do pool em um schema que não contém nada, para que
fragmento cru morra em `relation … does not exist` em vez de responder — dono: `backend`.

### SEC-10 — código de erro do Node com cinco caracteres é lido como `SQLSTATE` — [BAIXO]
**ONDE:** `apps/api/src/db/pg-error.ts:16-20` (`/^[0-9A-Z]{5}$/`) com
`apps/api/src/http/server.ts:191-206`.
**CENÁRIO:** medido em `Q24`. `apiErrorFromPostgres({ code: 'EPIPE' })` devolve `internal_error` com
`internalDetail: 'sqlstate=EPIPE'`; idem `EPERM` e `EBUSY`. Para fora não muda nada (500 opaco), mas
o ramo de log é decidido por `sqlstate !== undefined`, então a pilha **não** é registrada — e num
erro de sistema a pilha é a única coisa que conserta o defeito. O fato de borda passa a carregar um
`SQLSTATE` que não existe.
**POR QUE É REAL:** os três códigos existem em Node e chegam de `EPIPE`/`EPERM` em escrita e em
acesso a recurso. Não é alcançável a partir de rota de negócio hoje porque não há rota; é item de
"antes da primeira".
**CORREÇÃO SUGERIDA:** exigir uma segunda marca de erro do `pg` (por exemplo `severity` ou `routine`)
antes de tratar `code` como `SQLSTATE` — dono: `backend`.

### SEC-11 — `scope_not_resolved` separa credencial válida de inválida — [BAIXO]
**ONDE:** `apps/api/src/errors.ts:22-25` e `:54-55`, com `apps/api/src/http/server.ts:151-155`.
**CENÁRIO:** quando `D-03` fechar, quem apresenta prova aceita e não tem cliente mapeado recebe
**403**; quem apresenta prova que não serve recebe **401**. Com uma lista de credenciais furtadas ou
adivinhadas, isso separa as vivas das mortas sem que nenhum cliente exista para elas.
**POR QUE É REAL:** a distinção é deliberada e boa para diagnóstico — os dois códigos respondem
perguntas diferentes, e é o que
[[gotcha-motivo-enumerado-que-engole-dois-diagnosticos]] recomenda. O achado é para a decisão ser
tomada com o custo à vista, não para reverter: se a resposta for manter, mantenha declarado.
**CORREÇÃO SUGERIDA:** se o oráculo incomodar, responder `401` nos dois e guardar a distinção **só**
no fato de borda, onde ela já está — dono: `backend` + humano.

### SEC-12 — `RootDb` e `TenantDb` são o mesmo tipo, então a trava 2 não tem apoio do compilador — [BAIXO]
**ONDE:** `apps/api/src/db/tenant-db.ts:15` e `:18` (`RootDb` e `TenantDb` são dois aliases do mesmo
`Kysely<TenantDatabase>`), com `apps/api/src/db/pool.ts:30` (`createRootDb` exportado).
**CENÁRIO:** um arquivo de rota escreve `import { createPool, createRootDb } from '../db/pool.js'` e
tem nas mãos um handle que alcança todo schema. Compila limpo, passa nos 27 testes, e nada no
repositório acusa — não há regra de importação nem teste sobre o grafo de módulos.
**POR QUE É REAL:** a trava que o autor declarou é sobre o **caminho da requisição**, e essa eu
confirmo: `request.tenant.db` só existe depois da resolução, `tenantOf` falha fechado (`Q17`), e não
há singleton de raiz em lugar nenhum. O que não existe é a trava no **grafo de módulos**, e a
diferença aparece no tipo: como `RootDb` e `TenantDb` são o mesmo alias, o compilador não distingue
handle preso de handle solto. A base já tem o padrão que resolveria — a marca de tipo de `Principal`
(`identity/principal.ts:14-18`) — aplicada onde a consequência é menor.
**CORREÇÃO SUGERIDA:** marcar `TenantDb` com símbolo próprio, de modo que só `tenantDb()` produza o
tipo que as consultas aceitam; custa nada enquanto não há rota — dono: `backend`.

---

## 4. As cinco perguntas de `seguranca.md` §1

**1. Existe caminho em que uma consulta alcança schema de outro cliente?**
No banco, **sim**: `SEC-01`, medido, por migration com grafia citada ou maiúscula. Na borda, **não**:
`Q19` mostra o SQL emitido totalmente qualificado, e a consulta sem escopo na mesma conexão física
caiu em `public`, nunca no cliente anterior — que é a diferença exata entre a solução nova e o
`search_path` do executor, cujo vazamento reproduzi em `Q18`. O resíduo da borda é o fragmento cru
(`SEC-09`), que hoje não existe em `src/` e cujo pior desfecho é `public`, não outro cliente.

**2. O tenant vem de identidade autenticada, ou de algo que o chamador controla?**
Da identidade, e **por assinatura**: `TenantDirectory.resolve(principal)` recebe um `Principal` e
nada mais (`tenant/context.ts:36-39`). `body`, `query`, cabeçalho e path não têm como chegar lá sem
mudar o tipo. O `IdentityProvider` recebe cabeçalho, que é correto — é de onde uma prova vem — e o
que ele devolve é opaco. Confirmo a trava 1 como estrutural.

**3. Existe operação de dados que aceita tenant ausente e cai em default?**
Não. `TenantContext.db` só nasce depois de `resolve` devolver identificação; `tenantOf` lança
`internal_error` (medido, `Q17`); os dois provedores padrão devolvem `null` e o desfecho é recusa.
A ressalva é `SEC-12`, que é sobre outro caminho.

**4. Id de recurso validado contra o tenant?**
**Não aplicável ainda, e é o item para vigiar na primeira rota.** Não há consulta, e a única
validação de forma que existe (`tenant/schema-name.ts`) é declarada pelo próprio autor como forma e
não alvo, corretamente. O mecanismo que vai decidir isto é a qualificação por consulta: id de outro
cliente devolve zero linha porque a tabela consultada é a do schema resolvido. O que ainda pode
trazer o item 4 de volta é qualquer rota que resolva algo numa tabela de `platform` —
[[gotcha-chave-unica-globalmente-parece-endereco]] é o registro que descreve exatamente esse convite.

**5. Cache, fila, log, arquivo temporário, exportação e relatório?**
Não há cache, fila nem exportação. Log: o serializador entrega id, método e padrão de rota, e nada
de URL crua, cabeçalho ou corpo (`server.ts:100-109`) — confere. Canais laterais que **encontrei e
medi**: `SEC-06` (tempo), `SEC-07` (volume no canal de fato), `SEC-08` (contador de id em superfície
pública). No lado do banco, a saída do executor e a impressão do `verify` carregam a carteira e estão
classificadas em `papeis-e-credencial.md` §4 — continua correto.

---

## 5. Notas — sem cenário concreto, logo não são achados

- **`INSERT` forjado no livro-razão** é possível e agora é **permanente**, porque a `0003` fechou o
  `DELETE` (medido). O efeito pretendido — o executor pular uma migration que julga aplicada — é
  detectado por §3 (`checksum_mismatch` se o arquivo existe com outro conteúdo,
  `ledger_entry_without_file` se não existe), e os dois já são tipo de evento da `0004`. Só escapa
  quem forjar com o checksum verdadeiro do arquivo verdadeiro, e aí o `verify` estrutural responde.
  Mecanismo coberto; a nota é que endurecer remoção também tornou a forja irremovível.
- **O `REVOKE` de `papeis-e-credencial.md` §5 não tem casa mecanizada nem verificação.** Ele entra
  "no ato que cria o papel", e esse ato não existe como artefato; privilégio está fora da impressão
  por decisão declarada (confirmei em `Q7`: `REVOKE`/`GRANT` não mudam uma linha da impressão). Não
  vira achado porque a consequência já está inteira em `SEC-02`; vira aviso para quem desenhar a
  operação, porque hoje as três camadas da defesa de `platform.tenants` são inverificáveis por
  automação.
- **Os cinco arquivos do repositório passam nas próprias regras** §11.3 e §11.5 (medido, `Q13`),
  incluindo os literais `'platform'`, `'public'`, `'information_schema'` e `'^pg_'` da `0001`, que
  não são seguidos de ponto. Falso positivo sobre literal é real como o documento declara, mas não
  morde o corpo atual. O caso que vai morder um dia é literal com ponto logo depois de palavra
  reservada — um `https://public.` dentro de um `CHECK`, por exemplo.
- **`/health` responde 200 independentemente do estado do banco.** É disponibilidade, não segurança:
  um balanceador manda tráfego para processo com banco morto. Fica como risco, dono `backend`.
- **`0002`/`0003` usam `CREATE OR REPLACE TRIGGER`**, que exige PostgreSQL 14+. Não está declarado
  como piso de versão em lugar nenhum que eu tenha lido. Uma linha em `db/convencoes.md` resolve.

---

## 6. Veredito 1 — o `coder` pode implementar o executor?

**Três dos quatro bloqueios da reauditoria caem. O quarto continua, e é o mesmo.**

**Liberado agora, além do que já estava:**
- `provision` passo 4 e o schema do `verify` — `MIG-16` fechado pela §10.3.0;
- `verify` inteiro — `MIG-11` e `MIG-13` fechados, e a referência do `platform` reproduz do banco
  real (`Q3`), o que torna o comando executável e não decorativo;
- tudo que lê módulo ativo — `MIG-17` fechado: o executor **recusa a rodada** se houver arquivo de
  módulo, e isso é implementável hoje sem inventar nada.

**Continua bloqueado: o carregador (§11).** `SEC-01` é `MIG-10` reaberto, e o padrão que o `coder`
transcreveria está escrito de um jeito que falha com uma aspa. Escrever agora fixa em código a
mesma brecha, dessa vez em TypeScript, onde ela fica mais cara de achar.

**Em paralelo, não bloqueia o `coder`:** `SEC-02` e `SEC-03` são migrations novas (`0005`, `0006`) e
uma coluna na consulta da §13.3; `SEC-04` e `SEC-05` são contrato. O executor não emite nenhum dos
comandos envolvidos.

**O que não pude verificar, e digo em vez de aprovar:** nenhum comportamento do executor, porque ele
não existe; lock, tempo e custo sobre N schemas reais; o slug hostil da §10.3.0, que é medida do
autor e cujo caminho eu li e considero correto, sem ter remedido.

## 7. Veredito 2 — a borda passa no gate 3?

**Passa, para o que ela é hoje: uma fundação com uma rota anônima e nenhuma rota de negócio.** As
duas travas que o autor chama de estruturais seguram no caminho da requisição, e eu as testei em vez
de ler: tenant por assinatura, contexto só depois da resolução, `tenantOf` falhando fechado, rota
nascendo fechada, 401 para rota desconhecida sem identidade, identificador de correlação sempre
nosso, e os dois provedores de `D-03` recusando tudo — **isto último é verdade no código**, e a
única implementação que não recusa vive em `test/border.test.ts` e nunca é ligada em `main.ts`.
Nenhum segredo na árvore.

**`/health` passa como está, enquanto for `127.0.0.1`.** Não toca banco, não diz versão, não conta
nada. O que decide a saída do loopback é `SEC-08`, e é só isso.

**Antes da primeira rota de negócio, nesta ordem:**
1. `SEC-12` — marcar o tipo do handle preso. Custa nada com zero rota e nunca mais será tão barato.
2. `SEC-09` — fixar o `search_path` do pool, para o fragmento cru morrer alto em vez de responder.
3. `SEC-06` + `SEC-07` — o caminho não autenticado não pode fazer trabalho assimétrico nem ter
   volume escolhido por quem chama. As duas correções são a mesma conversa.
4. `SEC-10` — a confusão de `EPIPE` com `SQLSTATE` só morde quando houver rota que falhe.
5. **Limite de taxa**, que o autor já declarou ausente: ele é pré-requisito de `SEC-06` e `SEC-07`,
   não item separado.
6. **O mapa identidade→schema sem `USAGE` em `platform`** — já roteado por ele para
   `arquiteto-dados` + `seguranca`. É o ponto em que a pergunta 4 da §4 (IDOR) volta a existir, e a
   resposta precisa chegar antes da rota, não com ela.

**Não pude verificar:** comportamento sob concorrência real, pela rede e com credencial válida,
porque não há provedor de identidade; custo do caminho crítico, que é de `performance`; e o
comportamento do pool sob `max` maior que 1 com carga, que não medi.

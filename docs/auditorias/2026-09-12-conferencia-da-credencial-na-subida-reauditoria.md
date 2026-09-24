# Reauditoria — a conferência da credencial na subida (`T-0013` / `F-003`), gate 3

**Data:** 2026-09-12 · **Escopo:** `apps/api/src/db/credential-query.ts`,
`apps/api/src/db/app-credential.ts`, `apps/api/src/config.ts`,
`apps/api/src/observability/startup-facts.ts`, `apps/api/scripts/run-tests.mjs`,
`apps/api/test/app-credential-live.test.ts`, `apps/api/package.json` · **Read-only.**

**Linha de base:** `docs/auditorias/2026-09-12-conferencia-da-credencial-na-subida.md`
(`SUB-01`…`SUB-04`). A numeração continua em **`SUB-05`**.

**Fora de escopo, e não foi tocado:** `db/**` — há arquiteto trabalhando lá. O que desta página
depende de `db/**` entra por leitura e está citado por `path`, nunca medido como achado daquele lado.

**Estado dos quatro anteriores:** `SUB-01`, `SUB-03` e `SUB-04` estão **fechados** — reproduzi os três
estados e os três agora recusam ou não são aceitos. `SUB-02` está **fechado no mecanismo que ele
nomeou** (herança entre papéis de cliente) e **reaberto pelo desfecho** que ele descreve: o mesmo
vazamento, pelo mesmo caminho de requisição, continua de pé por outro mecanismo — é o `SUB-05`.

**Quatro achados: um `ALTO`, dois `MÉDIO`, um `BAIXO`.** Nenhum é desvio da implementação contra a
spec. Os sete casos de aceite do `F-003` foram medidos e os sete passam.

---

## 0. Método

PostgreSQL **16.15** (`postgres:16`, Debian 16.15-1.pgdg13+2), container descartável **meu**,
`forja-sub2-pg`, `127.0.0.1:55601`, `POSTGRES_HOST_AUTH_METHOD=trust`, **removido ao fim** (conferido:
só sobraram os três containers do arquiteto). O Postgres do humano (5432) não foi tocado.

Arranjo com **duas mãos**, reproduzindo `db/papel-do-cliente.md` §7.2 e §7.3: operador `postgres`
(superusuário) faz a §7.2, executor `forja_exec` (`LOGIN NOINHERIT CREATEROLE`, **não superusuário**,
com `CREATE` no banco) faz a §7.3 para dois clientes — `t_acme` e `t_globex`, papéis `app_t_acme` e
`app_t_globex`, `GRANT app_t_<slug> TO forja_credencial WITH INHERIT FALSE, SET TRUE`, uma linha em
`orders` de cada (`111` e `222`).

Sonda descartável fora da árvore do projeto, carregando o `dist` compilado: chama
`assertAppCredential` com coletor de fato em memória, depois lê os dois `orders` **pelo handle raiz,
nu**, e depois pelo **caminho normal de requisição** — `root.transaction()` +
`set_config('role', …, true)`, que é literalmente o que `tenant-role.ts:56-67` faz. O `dist` foi
restaurado e reconstruído ao fim; `sha256` de `dist/src/db/credential-query.js` idêntico ao de antes
das mutações (`1f975a6f…db864`).

**Arranjo íntegro, medido antes de qualquer cenário:** a conferência sobe com
`{"role":"ok","login":"ok","group":"ok","inheritance":"ok","reach":"ok","assumed":"ok"}`; a credencial
nua leva `42501` nos dois schemas; `app_t_acme → t_globex` e `app_t_globex → t_acme` levam `42501`;
`app_t_acme → t_acme` lê `111`.

### As quatro contagens do autor, conferidas

| Rodada | Comando | Medido por mim |
|---|---|---|
| `R1` | `npm test`, banco servido por superusuário | `72 tests · 72 pass · 0 fail · 0 cancelled · 0 skipped`, saída `0` |
| `R2` | `npm run test:no-db` | `72 · 59 pass · 0 fail · 0 cancelled · 13 skipped`, saída `0` |
| `R3` | `npm test` **sem** `FORJA_TEST_DATABASE_URL` | saída `1`, **nenhum** teste executado |
| `R4` | `npm test`, banco servido por `forja_exec` (`CREATEROLE`, não superusuário) | `72 · 71 pass · 1 fail · 0 skipped`, saída `1`; a falha é o caso 3, exigindo superusuário |

**As quatro batem com o relatório do autor, exatas.**

### As três mutações do autor, repetidas

| Mutação no `dist` | Medido |
|---|---|
| `m.inherit_option → false` (linha da quarta pergunta) | `71 pass · 1 fail`, saída `1` — cai o **caso 4** |
| `has_schema_privilege(…) → false` | `70 pass · 2 fail`, saída `1` — caem os **casos 6 e 7** |
| `pg_has_role(current_user, assumido.oid, 'SET') → false` | `71 pass · 1 fail`, saída `1` — cai o **caso 8** |

**As três reproduzem o que ele relatou.** A quarta mutação, que ele não fez, virou `SUB-08`.

---

## 1. Prioridade um: existe caminho em que um cliente vê dado de outro?

**Sim, e o pior deles está dentro do handle que a borda entrega à rota** (`SUB-05`). Nenhum é
alcançável por requisição HTTP: todos exigem um `GRANT` de quem já administra papel ou schema no
cluster — o operador, ou o **executor**, que não é superusuário. Item a item de `seguranca.md` §1:

1. **Consulta que alcança schema de outro cliente?** **Sim**, por três estados medidos aqui, nenhum
   visto pelas seis perguntas (`SUB-05`, três variantes) e mais um pelo handle raiz (`SUB-06`). O
   arranjo íntegro continua fechado, medido.
2. **O tenant vem de identidade autenticada?** Fora deste escopo — a conferência não decide tenant.
   O papel de banco do processo vem de `current_user`/`session_user` do catálogo, que o chamador HTTP
   não alcança. Ataquei de novo `options=-c role=app_t_acme` na URL: recusado, agora por **três**
   perguntas (`role`, `login` e `reach`). Sem achado.
3. **Operação de dados que aceita tenant ausente e cai em default?** Não se aplica. O único default é
   o nome do grupo, constante em código (`app-credential.ts:81`), reconferido: `process.env` tem uma
   única ocorrência em `apps/api/src`, em `config.ts`, e `loadConfig` não tem chave de grupo.
4. **Id de recurso validado contra o tenant (IDOR)?** Não se aplica: esta camada não recebe id de
   ninguém. A única entrada é `groupRole`, e `main.ts:23` a omite.
5. **Canal lateral — cache, fila, log, arquivo temporário, exportação?** O fato de subida é o único, e
   **não nomeia cliente** — confirmado por leitura (`startup-facts.ts:63-75`, a interface inteira) e
   medido em duas recusas. O fato emitido no estado `reach: refused` saiu, literal:
   `{"factId":…,"kind":"startup_credential_refused","currentRole":"forja_credencial","sessionRole":"forja_credencial","groupRole":"forja_app","verdict":{…}}`
   — nenhum nome de schema, nenhum papel de cliente, nenhum host, nenhuma porta. A recusa que nomeia
   sai por `stderr`, com o teto de cinco. **Sem achado**, e a separação entre os dois canais está
   cumprida como o `F-003` a escreveu.

---

## 2. Achados

### SUB-05 — privilégio de objeto (ou atributo) num papel de cliente que este processo assume vaza no caminho normal de requisição, e as seis perguntas respondem `ok` — [ALTO] — **reincidente de `SUB-02`**

ONDE: `apps/api/src/db/credential-query.ts:81-86` (a quinta pergunta: sujeito `current_user`,
mecanismo `nspacl`) contra `:87-96` (a sexta: sujeito `todo papel assumível`, mecanismo
`pg_auth_members`). O buraco é a célula que as duas não cobrem.

CENÁRIO: medido, três variantes, todas partindo do arranjo íntegro.

**(a) — a de digitação, emitida pelo próprio executor.** O ato da §7.3 tem duas linhas em que o slug
do schema e o do papel são o mesmo texto. Trocar um deles:

```sql
GRANT USAGE ON SCHEMA t_globex TO app_t_acme;                          -- aceito para forja_exec
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA t_globex TO app_t_acme;
```

Medido depois dessas duas linhas: a conferência **sobe**, emite `startup_credential_verified` com os
**seis** `ok`, `reach` sai `[]` e `assumed` sai `[]`. E então, pelo caminho normal da borda:

```
BEGIN; SET LOCAL ROLE app_t_acme;
SELECT total_cents FROM t_globex.orders WHERE id = 1;   -->  222
```

O cliente `acme` lê a venda do cliente `globex`. A credencial nua continua levando `42501` nos dois
schemas, então nenhuma das outras perguntas tem por onde notar.

**(b) — o mesmo, contra o schema de controle.** `GRANT USAGE ON SCHEMA platform TO app_t_acme` mais
`GRANT SELECT ON platform.tenants`: medido, a subida responde os seis `ok` e a transação de `acme` lê
a carteira inteira de clientes (`acme|t_acme`, `globex|t_globex`).

**(c) — atributo, não privilégio.** `ALTER ROLE app_t_acme SUPERUSER` (exige operador superusuário,
então é a mais fraca das três): medido, a subida responde os seis `ok` e `app_t_acme → t_globex`
devolve `222`. A terceira pergunta lê `rolsuper`, e lê **só** de `current_user`.

POR QUE É REAL: a correção de 2026-09-12 abriu duas frentes e fechou três das quatro células.

| | mecanismo: concessão de **papel** | mecanismo: privilégio de **objeto** / atributo |
|---|---|---|
| sujeito: **a credencial** | pergunta 4, `inheritance` | pergunta 5, `reach` |
| sujeito: **papel que ela assume** | pergunta 6, `assumed` | **ninguém** |

A sexta pergunta enumera o universo certo — medi o que ela enxerga, e é exatamente
`{app_t_acme, app_t_globex, forja_app}`, isto é, todo papel que `set_config('role', …)` consegue
assumir, nada a mais e nada a menos. O que ela pergunta **sobre** cada um é uma coluna só,
`m.inherit_option`. Alcance por `nspacl` e atributo de papel ficam fora, e são os dois mecanismos que
o `SUB-01` e a terceira pergunta já tinham nomeado como perigosos **para a credencial**. O desfecho é
o do `SUB-02`, palavra por palavra: alcance **dentro** do handle que a borda entrega à rota, sem erro
nosso, sem tocar em código, com o fato de subida afirmando `verified`.

Não é `CRÍTICO` pela mesma contenção que segurou `SUB-01` e `SUB-02`: o estado exige um `GRANT` de
quem administra schema ou papel, e não é alcançável por requisição de fora. É `ALTO` pela mesma razão
que eles foram: o vazamento é entre clientes e o fato **afirma** que a pergunta foi respondida com sim.

CORREÇÃO SUGERIDA: a quinta pergunta passa a ter o mesmo sujeito da sexta — `has_schema_privilege`
avaliado para cada papel assumível contra os schemas que **não** são o dele —, ou o `Objetivo` do
`F-003` para de afirmar cobertura que a cláusula não tem — dono: `backend`; a pergunta invertida
primária é do `verify`, dono `arquiteto-dados`, e continua fora deste gate.

### SUB-06 — a quinta pergunta é cega para todo schema fora de `t\_%`, e é em `platform` que mora a carteira de clientes — [MÉDIO] — **reincidente em classe de `PAP-15`**

ONDE: `apps/api/src/db/credential-query.ts:84` (`WHERE n.nspname LIKE 't\\_%'`).

CENÁRIO: medido. `GRANT USAGE ON SCHEMA platform TO forja_credencial` mais
`GRANT SELECT ON platform.tenants`: a conferência **sobe** com os seis `ok`, `reach` sai `[]`, e a
credencial **nua, sem assumir papel nenhum**, lê `platform.tenants` inteiro. A mesma função que a
quinta pergunta usa responde `t` para `platform` — medi as cinco linhas lado a lado:
`platform|t · public|f · relatorios|f · t_acme|f · t_globex|f`. O `t` está a uma linha de distância do
universo da pergunta.

POR QUE É REAL: `db/papeis-e-credencial.md:39-42` faz disso um invariante nomeado — *"Nenhum papel de
aplicação recebe `USAGE` em `platform`. O schema de controle guarda o registro de clientes e o
livro-razão, que juntos são a carteira inteira"* — e o `platform` de hoje tem `tenants`,
`schema_migrations`, `executor_events` e `role_declarations`, este último o mapa dos papéis declarados
legítimos (`db/referencia-estrutural-platform.txt:54-69`). A conferência de subida existe para
responder **o que esta credencial alcança**, e o único invariante de alcance que o repositório escreveu
por extenso é justamente o que ela não pergunta.

Também medi a variante que ainda não tem caminho no código, e por isso ela fica de fora do achado e
vai como nota: um schema `relatorios` com view consolidada sobre os dois clientes, `USAGE` e `SELECT`
concedidos à credencial — a credencial nua lê `acme|111` e `globex|222` numa consulta só, e os seis
`ok`. A view é `security definer` por padrão, então ela não precisa de privilégio nenhum em `t_*`. Não
existe hoje quem crie essa view; existe a regra que diz que relatório consolidado é agregação no
`platform` (`.claude/rules/dados.md` §1), e é para lá que essa variante aponta.

Não é `ALTO` porque o dado é **cadastral e de controle**, não venda de cliente, e porque o alcance
está no handle raiz, que a borda não entrega a rota nenhuma. É `MÉDIO` porque a informação é a
carteira inteira de clientes mais o mapa do próprio arranjo de isolamento, que é o que `SEC`/`PAP`
vêm tratando como sensível desde 2026-09-11.

**Sobre a pergunta que o brief manda responder — quem controla o nome de um schema:** ninguém de fora,
e a forma está fechada dos dois lados. `platform.tenants.schema_name` é **gerada**, `('t_'::text || slug)`
(`db/referencia-estrutural-platform.txt:67`), e `apps/api/src/tenant/schema-name.ts:13-22` só produz e
só aceita `t_` + slug minúsculo, com `platform`, `public`, `information_schema`, `pg_*` e `verify_*`
recusados. Medi também quem pode criar schema no banco: `datacl` = `{=c/postgres, postgres=CTc/postgres,
forja_exec=C/postgres}` — `PUBLIC` tem `CONNECT` e nada mais. **Não existe schema de cliente fora de
`t\_%`**, e o filtro não pode ser evadido por esse lado. O que existe é o inverso: schema que **não é**
de cliente e mesmo assim alcança dado de cliente, que é este achado.

### SUB-07 — o gate sai `0` com zero teste executado — [MÉDIO] — **reincidente em classe de `SUB-03`, `PAP-17` e `PAP-23`**

ONDE: `apps/api/scripts/run-tests.mjs:29` (`ALVO`) contra `:80-91` (as guardas, que olham
`fail`, `cancelled` e o código do filho — nunca o total).

CENÁRIO: medido. Copiei o script para fora da árvore trocando **só** a linha do alvo, para
`dist/test/**/*.naoexiste.js`, e rodei com `FORJA_TEST_DATABASE_URL` servida por superusuário. Saída:

```
ℹ tests 0 · pass 0 · fail 0 · cancelled 0 · skipped 0
gate: 0 testes · 0 passando · 0 falhando · 0 cancelados · 0 pulados.
saida=0
```

`node --test` com glob que não casa arquivo nenhum sai `0`, e o gate concorda com ele.

POR QUE É REAL: o script foi escrito para um defeito de uma frase — *"a linha que se lê primeiro diz
`0 fail`, o código de saída concorda com ela, e a propriedade que a camada existe para garantir não foi
exercida"* — e essa frase descreve o que acabei de medir. O gatilho não é hipotético: `tsconfig.json`
carrega `rootDir: "."`, `outDir: "dist"` e `include: ["src/**/*.ts", "test/**/*.ts"]`, e o alvo do
script é a **conjunção** dessas três coisas com a convenção de nome `*.test.ts`. Mudar `rootDir`,
estreitar `include`, mover a pasta de teste ou adotar `*.spec.ts` deixa o gate verde sobre nada, e
nenhuma das quatro é mudança exótica — todas são refactor de configuração que ninguém associa a
segurança. O script já falha fechado quando não consegue **ler** o resumo (`:70-78`); o que falta é a
mesma postura quando o resumo existe e está vazio.

CORREÇÃO SUGERIDA: o gate reprova quando `total` for menor que um piso declarado, ou simplesmente
quando for `0` — dono: `coder`.

### SUB-08 — três colunas que sustentam recusa sobrevivem à mutação com `72/72` — [BAIXO]

ONDE: `apps/api/src/db/credential-query.ts:54` (`r.rolcanlogin`), `:61` (`session_user`) e `:83`
(`('USAGE'), ('CREATE')`).

CENÁRIO: medido, três mutações no `dist`, cada uma revertida e conferida por `sha256`. Todas com banco
servido por superusuário, que é o modo de gate:

| Mutação | Gate |
|---|---|
| `session_user::text` → `current_user::text` | `72 · 72 pass`, saída **`0`** |
| `(VALUES ('USAGE'), ('CREATE'))` → `(VALUES ('USAGE'))` | `72 · 72 pass`, saída **`0`** |
| `r.rolcanlogin` → `true` | `72 · 72 pass`, saída **`0`** |

A segunda tem estado real por trás, e eu o montei: `GRANT CREATE ON SCHEMA t_globex TO
forja_credencial`, sem `USAGE`. A conferência **intacta** recusa (`reach: refused`), e a credencial
nua, nesse estado, executa `CREATE TABLE t_globex.isca(x int)` com sucesso — cria objeto dentro do
schema do outro cliente. Com a mutação, essa recusa some e o gate não nota.

POR QUE É REAL, e por que é `BAIXO`: é a mesma classe do `SUB-03` — propriedade que sustenta recusa e
que nenhum teste exerce —, só que agora o gate obriga banco e zero pulados, então o que sobra é
cobertura parcial em vez de silêncio total. Nenhuma das três abre buraco **hoje**: medi o ataque do
papel pré-assumido (`options=-c role=app_t_acme`) **com** a mutação de `session_user` aplicada, e ele
continua recusado, agora por `login` e por `reach` — a redundância entre as perguntas segura o caso.
`rolcanlogin` mutado é inexplorável, porque papel `NOLOGIN` não conecta. O `CREATE` é o único com
consequência, e é integridade do schema alheio, não leitura.

CORREÇÃO SUGERIDA: um caso vivo para cada uma — conexão com papel pré-assumido, `GRANT CREATE` sem
`USAGE`, e o `login` fica declarado como não exercível — dono: `backend`.

---

## 3. O que o brief mandou atacar, e que não virou achado

**A exclusão da sexta pergunta resiste.** É a única exclusão que existe na camada, e a história desta
base diz que é onde o buraco mora — então ataquei por três lados. O predicado é
`assumido.oid IS DISTINCT FROM (SELECT oid FROM me)`, e a pergunta 4 varre exatamente
`m.member = me AND m.inherit_option` com o mesmo `JOIN` e o mesmo formato de texto: o par cobre o
universo inteiro sem folga, e **não existe estado em que a quarta responda `ok` sobre a credencial e a
sexta a exclua**, porque as duas leem a mesma linha da mesma tabela com o mesmo predicado. Quando `me`
é vazio (papel fora do catálogo), `IS DISTINCT FROM NULL` deixa de excluir qualquer um — a exclusão
some em vez de crescer, e a primeira pergunta já recusou antes. Confirmei também que a exclusão é por
**identidade que nós escrevemos**, não por propriedade que o excluído carrega: não há lista de
isenção, nome de ambiente como sujeito, nem sinalizador que alguém se conceda. O limite desta camada
continua sendo de **alcance da pergunta**, e não de **quem responde** — e o `SUB-05` é mais uma
fronteira de alcance, não uma exclusão indevida.

**O universo "papéis que este processo consegue assumir" é fechado.** Medi o que a credencial vê:
`pg_has_role(current_user, …, 'SET')` responde `t` para `app_t_acme`, `app_t_globex`, `forja_app` e
para ela mesma, e `f` para `forja_exec` e `postgres`. É exatamente o conjunto que
`set_config('role', …, true)` de `tenant-role.ts:61` consegue assumir, porque é o mesmo privilégio que
o servidor exige ali. Entrar nesse universo exige um `GRANT … WITH SET TRUE` de quem tem `ADMIN
OPTION` sobre o papel — e entrar **amplia** o que a sexta pergunta confere, nunca diminui. Provei a
metade positiva: `GRANT forja_app TO app_t_acme WITH INHERIT TRUE`, que é a via pela qual um
privilégio concedido ao grupo chegaria a um cliente, é **pega** — `assumed: refused`, nomeando
`app_t_acme herda forja_app (concedido por forja_exec)`. E `GRANT USAGE ON SCHEMA t_globex TO
forja_app` sozinho **não** vaza, porque nenhuma concessão de `forja_app` é herdável no arranjo
íntegro: medido, `42501` nos dois sentidos. A afirmação de `db/papel-do-cliente.md` sobre isso está
correta.

**`test:no-db` saindo `0` com 13 pulados é aceitável**, e a razão não é o número: é que o modo parcial
só existe por **argv**, nunca por ambiente, e ele grita o que não exercitou (`run-tests.mjs:93-100`).
Medi a variante que me preocupou — `npm test -- --no-database`, que o `npm` repassa ao script: ela
**rebaixa** o gate a parcial e sai `0`. Não é achado, porque a bandeira continua visível na linha de
comando de quem a escreveu e o aviso sai na mesma tela; é a mesma superfície de `npm run test:no-db`,
com outro nome. Vale saber que a diferença entre gate e parcial não está no **nome do script**.

**Um `t_*` sujo derruba a frota inteira, e não achei caminho de fora para provocá-lo.** Medido:
`CREATE SCHEMA t_terceiro; GRANT USAGE ON SCHEMA t_terceiro TO PUBLIC` — um schema sem relação nenhuma
com os dois clientes — faz **todo** processo daquele banco parar de subir, com `reach: refused`. Criar
schema exige `CREATE` no banco, e o `datacl` medido dá isso só ao dono e ao executor; `PUBLIC` tem
`CONNECT` e nada mais, e a §7.2 já tira `TEMPORARY`. Não há rota HTTP que crie schema, e a porta nem
abriu quando a pergunta roda. Então: **não é negação de serviço provocável de fora**, e o desfecho é o
certo. O que vale registrar é o raio: um estado que afeta **um** schema recusa **todos** os processos,
inclusive os que servem clientes sãos, e a recusa é do arranjo inteiro, não daquele cliente.

**`FORJA_PG_POOL_MAX=0` é nota, não achado.** Confirmei o mecanismo na fonte instalada:
`node_modules/pg-pool/index.js:89` faz `this.options.max = this.options.max || this.options.poolSize || 10`,
e `0` é falso em JavaScript. Não pendura nada, não abre nada, não fecha nada — é um valor de
configuração ignorado sem aviso. Fica sendo incoerência com a régua que `config.ts:67-77` acabou de
estabelecer para os três tempos (*"não existe valor que diga espere para sempre"*), e a mesma frase
vale aqui: não existe valor que diga "pool de tamanho zero". Uma linha em `loadConfig`, quando alguém
estiver por perto.

**O diagnóstico de falha de conexão — e aqui minha medida diverge da do autor.** Ele relatou `(Error)`
em 5,48 s com o catálogo travado; eu medi, no mesmo estado (`ACCESS EXCLUSIVE` em
`pg_catalog.pg_auth_members`, tempos no padrão), recusa em **5,39 s com `57014`**, que é o diagnóstico
certo. O único estado em que `(Error)` aparece é o **outro**: escuta TCP que aceita e nunca completa o
handshake — aí o erro do `pg` não tem `code` e `describeQueryFailure` cai em `error.name`. Isso não
esconde exaustão: medi `ALTER ROLE forja_credencial CONNECTION LIMIT 0` e a recusa saiu **`53300`**,
nomeada. O que `(Error)` esconde é só a diferença entre "banco mudo" e "rede mordida no meio", e as
duas pedem o mesmo ato. **Nota, não achado** — com a correção de que o `57014` do `SUB-04` continua
saindo, e que o autor provavelmente mediu outra coisa.

**Não consegui ler `apps/api/.env.example`** — bloqueio de permissão do meu ambiente, o mesmo que o
autor relatou. Então não conferi se ele sugere `0` em alguma das três chaves de tempo, que passaria a
recusar a subida. Fica declarado como não verificado.

---

## 4. Os sete casos de aceite do `F-003`

Medidos contra o arranjo montado por mim, nesta ordem, e os **sete passam**: credencial correta sobe
com os seis `ok` (1); executor recusa por `group`, nomeando `ADMIN OPTION` (2); superusuário recusa
por `group`, com a frase sobre atravessar privilégio de schema (3); concessão herdável de outra mão
recusa por `inheritance`, nomeando o concedente (4); grupo inexistente manda rodar a §7.2 **inteira**
(5); `USAGE` direto à credencial e `USAGE` a `PUBLIC` recusam por `reach` (6); herança entre papéis de
cliente recusa por `assumed`, nomeando `app_t_acme herda app_t_globex (concedido por forja_exec)` (7).
O invariante que atravessa os sete — **não existe chave de ambiente que desligue a conferência** —
está cumprido: reconferido que `APP_GROUP_ROLE` é constante, que `main.ts:23` não passa `groupRole`, e
que `loadConfig` não tem chave de grupo.

---

## 5. Veredito — `T-0013` pode fechar?

**Não.** Três dos quatro achados anteriores fecharam de verdade, e o trabalho da segunda rodada é bom:
a decisão pela cláusula foi a certa, a sexta pergunta enumera o universo exato, e o gate de teste
deixou de ser silêncio verde. O que segura é que o `SUB-02` foi fechado pelo **mecanismo** e não pelo
**desfecho** — o mesmo vazamento, pelo mesmo caminho de requisição, continua de pé por uma célula da
matriz que a correção não cobriu.

| O que falta | Tamanho | Dono |
|---|---|---|
| `SUB-05` — a quinta pergunta ganhar o sujeito da sexta (`has_schema_privilege` por papel assumível contra os schemas que não são o dele), **ou** o `Objetivo` do `F-003` parar de afirmar que nenhum papel assumido alcança outro cliente | uma cláusula de SQL com um `LATERAL` a mais, ou um parágrafo no item | `backend`; `produto` se o recorte mudar |
| `SUB-06` — decidir o universo da quinta pergunta: `t\_%` mais os schemas que o arranjo proíbe a papel de aplicação alcançar (`platform`), ou declarar que alcance fora de `t\_%` é do `verify` | uma linha no `WHERE`, ou um parágrafo | `backend` |
| `SUB-07` — o gate reprovar com `total = 0` | uma condição | `coder` |
| `SUB-08` — um caso vivo para `session_user` e um para `CREATE` sem `USAGE` | dois testes | `backend` |

**`SUB-07` e `SUB-08` não seguram sozinhos.** O que segura é `SUB-05`, e `SUB-06` anda junto porque é
a mesma decisão vista do outro lado: as duas perguntas novas escolheram **um** sujeito e **um**
universo cada, e as duas escolhas deixaram de fora exatamente o que a outra cobria. Fechar pelo
caminho barato continua disponível e continua sendo defensável — declarar, no `Objetivo` e no texto do
fato, que a subida confere **alcance da credencial** e **herança de papel**, e que alcance por
privilégio de objeto de um papel de cliente é a pergunta invertida do `verify`. O que não pode
continuar é `startup_credential_verified` sair num estado em que `acme` lê a venda de `globex`.

Uma coisa vale dizer porque é a terceira auditoria seguida em que ela se confirma: esta camada
continua **não excluindo ninguém por propriedade que o excluído carrega**. Ataquei a única exclusão
que existe e ela resistiu. O defeito que sobra é de **alcance da pergunta**, e essa é a classe boa de
defeito: fecha-se com uma cláusula, não com um redesenho.

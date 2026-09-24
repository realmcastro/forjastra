# Auditoria — a camada de papel de banco (gate 5)

**Data:** 2026-09-11 · **Agent:** `seguranca` · **Read-only.**
**Escopo:** T-0009. `db/papel-do-cliente.md` (§7 inteira, arquivo novo), `db/papeis-e-credencial.md`
§6.2, `db/migrator/PROVISION-E-VERIFY.md` §12, §13.1, §13.4 e §13.5,
`db/migrations/platform/0008__event_kinds_tenant_role.sql`, e a §11.2 reescrita
(`db/migrator/RECUSAS.md`). Li também, por serem a contraparte executável do que o texto promete:
`db/migrator/src/tenant-role.ts`, `src/commands/verify.ts`, `src/config.ts`, `src/session.ts`,
`src/refusals.ts`, e a borda que vai consumir esta camada (`apps/api/src/db/**`).

**Antecessoras, nenhuma editada:** `…-executor-e-schema-platform.md` (`MIG-01`…`MIG-08`),
`…-executor-e-schema-platform-reauditoria.md` (`MIG-09`…`MIG-17`), `…-delta-db-e-borda-api.md`
(`SEC-01`…`SEC-12`), `…-executor-implementado.md` (`EXE-01`…`EXE-10`).

**Prefixo novo, `PAP-`.** `SEC-` e `EXE-` já nomeiam escopos diferentes.

**Veredito na §5.** Curto: o desenho da camada está certo e o executor **pode** provisionar um
cliente de verdade; o `EXE-01` **ainda não fecha**, e o que falta não é o ato da §7.3, é a
propriedade de que ele depende. Um achado `CRÍTICO`, dois `ALTO`.

---

## 0. Método — o que foi medido

PostgreSQL **16.15** (container local `postgres:16`), dois bancos descartáveis criados e
**removidos ao fim**, mais todos os papéis criados por eles (conferido: `pg_roles` e `pg_database`
voltaram a zero). Sondas em `/tmp`; **nada foi escrito na árvore do projeto** fora deste arquivo.
O crivo foi exercitado contra o `dist/` compilado (conferido: `dist/src/refusals.js` é mais novo que
`src/refusals.ts`, então o binário medido é o código auditado).

Reproduzi o arranjo da §6.2 inteiro: `forja_app` sem `LOGIN`, credencial `LOGIN NOINHERIT`, executor
`CREATEROLE NOSUPERUSER` com `ADMIN OPTION` no grupo, dois clientes (`t_acme`, `t_globex`) criados
pelo executor, e o ato da §7.3 aplicado tal como está escrito. **A pergunta da §7.5 foi rodada
verbatim**, com `$1 = forja_app` e `$2` = a credencial, contra cada estado adulterado.

Não repeti a verificação do autor (67 testes, 1 pulado). Não a contesto e não a herdo: o que está
abaixo eu medi.

| Prova | Pergunta | Resultado |
|---|---|---|
| `P1` | o ato da §7.3 roda como escrito, por executor não-superusuário? | **sim**, os seis comandos, num commit, em 16.15 |
| `P2` | credencial criada **sem** a palavra `NOINHERIT` (§7.2), resto idêntico | a credencial **lê os dois clientes sem assumir papel nenhum**, e a §7.5 responde **conforme nas duas linhas** |
| `P3` | `GRANT app_t_acme TO cred WITH INHERIT TRUE` sobre credencial `NOINHERIT` | mesmo desfecho do `P2`, §7.5 **conforme** |
| `P4` | `GRANT ... WITH INHERIT FALSE, SET TRUE` com a credencial `rolinherit = t` | `inherit_option = f`, e a leitura volta a `permission denied`. **A opção da concessão vence o atributo do papel** |
| `P5` | `GRANT USAGE, SELECT` de `t_globex` para `app_t_acme` | `app_t_acme` lê `t_globex`; §7.5 **conforme** |
| `P6` | `GRANT app_t_globex TO app_t_acme` | `SET ROLE` encadeado funciona; §7.5 **conforme** |
| `P7` | schema com tudo concedido a **`PUBLIC`** e nada ao papel, `ALTER DEFAULT PRIVILEGES ... TO PUBLIC` | §7.5 **conforme em todas as colunas**, `default_acl_presente = t`, e `app_t_acme` lê o schema |
| `P8` | papel `LOGIN` fora do prefixo (`ops`), com `USAGE`+`SELECT` nos dois clientes | lê os dois; §7.5 **conforme**; nenhuma outra pergunta do sistema o enxerga |
| `P9` | `GRANT DELETE, TRUNCATE, REFERENCES, TRIGGER` ao papel do cliente | §7.5 **conforme**. O `DELETE` que a §7.3 recusa por decisão entra sem sintoma |
| `P10` | §7.5 rodada por papel **diferente** do que criou os privilégios padrão | `default_acl_presente = f` em **todo** schema → saída `3` em todo schema |
| `P11` | tabela criada no schema por papel sem privilégio padrão | `tabelas_sem_select = 1`. **É esta coluna, não a do `default_acl`, que pega o sintoma do release seguinte** |
| `P12` | `CREATEROLE` em 16.15: trocar senha da credencial / tornar-se membro dela | **recusados os dois**, como o autor mediu |
| `P13` | `CREATEROLE` em 16.15: o que **sobra** | cria papel `LOGIN` e concede `app_t_<slug>` a ele; `ALTER ROLE app_t_x LOGIN PASSWORD`; propaga `CREATEROLE`; `DROP ROLE` do papel de cliente. Recusados: `SUPERUSER`, `CREATEDB`, `BYPASSRLS`, `pg_authid`, e **`SET ROLE` para o papel que ele mesmo criou** (`set_option = f`) |
| `P14` | injeção na borda: texto montado com entrada hostil, conexão `pg` 8.23 | `SET ROLE` injetado executa, a consulta seguinte lê o outro cliente (`999`), **o papel atravessa o `COMMIT`** e fica na conexão devolvida ao pool |
| `P15` | seleção de protocolo do `pg` | `query(texto)` e `query(texto, [])` vão pelo **protocolo simples** e aceitam multi-statement; com **um** parâmetro o servidor recusa (`cannot insert multiple commands into a prepared statement`) |
| `P16` | `EXE-01` (corpo com `set_config('search_path')`) com o papel do cliente assumido | **falha fechado**: nada gravado nos dois schemas |
| `P17` | o mesmo `EXE-01` disparado pelo papel do executor | **vazou**: linha gravada em `t_globex.orders` a partir de um `INSERT` em `t_acme` |
| `P18` | `TEMP` no banco e sombreamento de nome não qualificado | o papel do cliente **tem** `TEMP` (via `PUBLIC` no `datacl`); `CREATE TEMP TABLE orders` faz `orders` não qualificado resolver para a temporária, com `search_path = t_acme` explícito |
| `P19` | `REVOKE USAGE, CREATE ON SCHEMA public FROM PUBLIC` emitido pelo executor | `WARNING: no privileges could be revoked` e **saída 0**, como o autor mediu. Em 16, `nspacl` do `public` já nasce só com `=U`: `CREATE` não está em jogo |
| `P20` | âncora da cabeça da view (§11.2) | segundo `WITH (…)` antes do `AS`: **recusado**. `security_invoker = false`, opção extra na mesma lista, opção antes do `security_invoker`: **recusados**. `WITH CHECK OPTION` no fim: passa, como o texto declara |
| `P21` | `RETURNS TABLE ( … )` e `RETURNS SETOF …` | `TABLE` recusado; **`SETOF` passa**, contra o que a §11.2 reescrita afirma |
| `P22` | `rolconfig` do papel assumido (`ALTER ROLE app_t_x SET search_path`) | **não se aplica** em `SET ROLE`. A sessão manteve `"$user", public` |

---

## 1. Prioridade um — existe caminho em que um cliente vê dado de outro?

**Sim, três, e nenhum deles é o schema estar errado.**

1. **Existe consulta que alcança schema de outro cliente?** No arranjo íntegro, não (`P16`). Mas a
   integridade depende de uma propriedade que nada verifica: `P2` e `P3` produzem uma credencial
   que lê todos os clientes, e a verificação chama isso de conforme. É o `PAP-01`.
2. **O tenant vem de identidade autenticada?** Sim, por assinatura: `TenantDirectory.resolve` recebe
   só o `Principal` (`apps/api/src/tenant/context.ts:38`), e o padrão devolve `null`. Continua bom.
3. **Operação de dados com tenant ausente cai em default?** Não. `tenantDb` exige nome de schema
   validado, e a raiz não é exportada para rota. Mantido de `SEC-12`, que segue aberto no tipo.
4. **Id de recurso validado contra o tenant?** Não se aplica ainda: não existe rota com id. O que
   **existe** é o análogo desta pergunta uma camada abaixo, e ele é o `PAP-02`: nenhuma pergunta
   deste sistema é "quem alcança o schema deste cliente?" — todas são "o papel que eu espero está
   bem formado?". `P5`, `P7` e `P8` são três respostas diferentes para a primeira pergunta, e as
   três passam pela segunda.
5. **Canal lateral com tenant no escopo?** Um, medido: **a conexão do pool** (`P14`). Papel assumido
   com `SET ROLE` sem `LOCAL` atravessa o `COMMIT` e fica na conexão. Enquanto toda leitura estiver
   dentro de transação que assume o papel, o estrago é contido; a consulta fora de transação, que a
   §6.2 mediu como "falha fechado", passa a **ler o cliente anterior em silêncio**.

---

## 2. Achados

### PAP-01 — a propriedade que separa o arranjo escolhido da prova C é uma palavra num ato manual, e nada a verifica — [CRÍTICO]
ONDE: `db/papel-do-cliente.md:43` (`CREATE ROLE <credencial> LOGIN NOINHERIT`), `db/papel-do-cliente.md:72`
(`GRANT app_t_<slug> TO <credencial>`), `db/migrator/src/tenant-role.ts:198` (`GRANT %I TO %I`, sem opção),
e a coluna `credencial_assume` da §7.5.
CENÁRIO: o operador roda a §7.2 e escreve `CREATE ROLE forjapp LOGIN PASSWORD …`, sem a palavra
`NOINHERIT`. Nada mais muda: o executor provisiona dois clientes pelo ato da §7.3, sem erro. Medido
(`P2`): a credencial, **sem assumir papel nenhum**, lê `t_acme` e `t_globex` na mesma sessão, e a
pergunta da §7.5 responde `conforme` nas duas linhas, com `atributo_indevido = f`. O mesmo estado
chega por um segundo caminho, mais provável ainda: quem estiver fazendo a primeira rota funcionar
encontra `permission denied for schema` (que é a prova E, desenhada para acontecer) e corrige com
`GRANT app_t_acme TO <credencial> WITH INHERIT TRUE` — medido (`P3`), mesmo desfecho, mesma resposta
verde.
POR QUE É REAL: o arranjo da §6.2 é a prova D. O que o distingue da prova C — "um papel de aplicação
para todos, vazamento com a venda concluindo com sucesso" — é exclusivamente a herança não acontecer.
A §7.1 põe a criação da credencial no lado do operador, que é justamente o lado sem artefato e sem
verificação; e a §7.5, que existe para tornar esta camada verificável, olha os `app_t_*` e nunca a
credencial. Em 16 a herança é propriedade **da concessão**, não do papel (`pg_auth_members.inherit_option`),
e a concessão quem faz é o executor, que hoje a emite sem opção nenhuma.
CORREÇÃO SUGERIDA: emitir `GRANT %I TO %I WITH INHERIT FALSE, SET TRUE` no ato (medido em `P4`: fixa a
propriedade mesmo com a credencial `rolinherit = t`, e é sintaxe que só existe a partir do 16, que o
piso agora garante) e acrescentar à §7.5 a coluna `inherit_option` da concessão, com divergência
saindo em `3` — dono: `arquiteto-dados`, depois `coder`.

### PAP-02 — a §7.5 pergunta se o papel esperado está bem formado, nunca quem mais alcança o schema — [ALTO]
ONDE: `db/papel-do-cliente.md:167-192` (a consulta), `db/migrator/src/tenant-role.ts:44-70` (a mesma consulta em código),
`db/migrator/PROVISION-E-VERIFY.md:387`.
CENÁRIO: três estados, medidos, todos com a §7.5 respondendo `conforme` em todas as colunas:
(a) `GRANT USAGE, SELECT` de `t_globex` para `app_t_acme` (`P5`) — o papel de um cliente lê o outro;
(b) um schema cujos privilégios foram concedidos a **`PUBLIC`** em vez de ao papel, inclusive o
`ALTER DEFAULT PRIVILEGES ... TO PUBLIC` (`P7`) — `has_schema_privilege` e `has_table_privilege`
enxergam o privilégio de `PUBLIC`, então todas as colunas ficam verdes e **qualquer** papel do
cluster lê aquele cliente; (c) um papel `LOGIN` fora do prefixo (`P8`) com `USAGE` nos dois clientes.
POR QUE É REAL: a junção é `'app_' || nspname`, então o universo da pergunta é o papel esperado. Um
papel adulterado com privilégio **a mais** (`P9`: `DELETE` e `TRUNCATE`, que a §7.3 recusa por
decisão escrita) e um papel **alheio** com alcance são exatamente o que a §7.4 chama de drift, e é o
que a pergunta não tem como devolver. A §7.5 é boa no que pergunta: `LOGIN`, `CREATE` no próprio
schema, `USAGE` em `platform`, ausência do papel, `admin_option` no grupo — tudo isso ela pega.
CORREÇÃO SUGERIDA: acrescentar a pergunta invertida, que é uma consulta e não pede privilégio novo —
por schema `t_*`, todo `grantee` de `nspacl` que não seja o dono nem `app_<schema>`, com `grantee = 0`
lido como `PUBLIC` (medido: devolve exatamente os três estados acima e nada mais no banco íntegro) —
dono: `arquiteto-dados`.

### PAP-03 — o que sobra de `CREATEROLE` em 16 é cunhar credencial, e nada neste sistema pergunta por ela — [ALTO]
ONDE: `db/papel-do-cliente.md:225-243` (§7.6).
CENÁRIO: o executor (não-superusuário, `CREATEROLE`) roda
`CREATE ROLE ops LOGIN PASSWORD …; GRANT USAGE, SELECT ON … t_acme, t_globex TO ops`. Medido (`P8`,
`P13`): `ops` lê os dois clientes, a §7.5 responde conforme, `ops` não é membro de `forja_app` e
portanto também escapa da consulta da §1. O acesso sobrevive à rotação da credencial da aplicação,
porque não é ela.
POR QUE É REAL: confirmei os dois atos que o piso 16 fecha (`P12`) e que em 15 abriam. O que 16 **não**
fecha: criar papel com `LOGIN` e senha, conceder a ele qualquer papel sobre o qual o executor tenha
`ADMIN OPTION` (todos os `app_t_*`, porque ele os criou, e `forja_app`, por concessão da §7.2),
`ALTER ROLE app_t_x LOGIN PASSWORD` (este a §7.5 pega, por `atributo_indevido`), propagar
`CREATEROLE`, e `DROP ROLE` do papel de um cliente. Em compensação, 16 impede o executor de
**assumir** o papel que criou (`set_option = f`), o que é mais do que a §7.6 afirma.
Isto não é argumento contra o `CREATEROLE`: o executor já é dono de todos os schemas. É argumento
contra a **durabilidade invisível** — comprometer a credencial do executor por uma hora deixa um
`LOGIN` permanente que nenhum artefato descreve e nenhuma pergunta procura.
CORREÇÃO SUGERIDA: a pergunta invertida do `PAP-02` já nomeia `ops`; some a ela a enumeração dos
papéis com `LOGIN` no banco confrontada com a lista esperada (executor, credencial), como linha de
registro no molde da §13.4 — dono: `arquiteto-dados`.

### PAP-04 — o resíduo da §6.2 não é contido por "consulta parametrizada", e sim por "consulta com parâmetro" — [MÉDIO]
ONDE: `db/papeis-e-credencial.md:265-267` (o parágrafo do resíduo), `apps/api/src/db/pool.ts:16`.
CENÁRIO: medido de ponta a ponta (`P14`), com `pg` 8.23.0, o driver que já está na árvore:
transação abre, `SET LOCAL ROLE app_t_acme`, e uma consulta montada por template com entrada hostil
`1'; SET ROLE app_t_globex; SELECT …` devolve três resultados — o do cliente certo, o `SET`, e o
`999` do outro cliente. Depois do `COMMIT` a sessão **continua** como `app_t_globex`, e a leitura
seguinte fora de transação lê o cliente errado sem erro nenhum (a mesma consulta, com a credencial
nua, dá `permission denied`).
POR QUE É REAL: a §6.2 escreve que o que contém o resíduo é "consulta parametrizada não emite `SET`".
Medido (`P15`): o `pg` escolhe o protocolo **simples** sempre que não há parâmetro, **inclusive com
array vazio**, e ali o servidor aceita múltiplos comandos; com um parâmetro ligado, o servidor recusa.
A propriedade que segura o isolamento, portanto, não é "a equipe parametriza": é "todo texto que chega
à conexão do cliente carrega ao menos um parâmetro ligado". Um `ORDER BY` montado por template, que
não tem valor a ligar, é protocolo simples e é o canal inteiro.
CORREÇÃO SUGERIDA: escrever o invariante na regra da borda nesses termos e prová-lo com um teste que
tente multi-statement pelas duas formas — dono: `backend`, com a frase da §6.2 corrigida por
`arquiteto-dados`.

### PAP-05 — a borda não assume papel nenhum, e o comentário dela diz que a escolha ainda está aberta — [MÉDIO]
ONDE: `apps/api/src/db/tenant-db.ts:20-35`, `apps/api/src/db/pool.ts:13` e `:16`.
CENÁRIO: `pool.ts` diz, hoje, "Continua em aberto se o papel de aplicação é um por cliente ou um só
(§3 do mesmo arquivo)" — a §3 fechou em 2026-09-11 e a resposta é a §6.2. `tenant-db.ts` declara que
o escopo de cliente é feito por **qualificação de identificador**, e que "nenhum outro estado de
sessão é permitido aqui", que é exatamente a instrução contrária ao `SET LOCAL ROLE` que o arranjo
exige. Quem implementar a primeira rota lê esses dois comentários e conclui que basta qualificar.
POR QUE É REAL: se a borda não assume o papel, o papel que atende requisição é a credencial, e o
desfecho depende só de qual credencial está na `connectionString`. Com a credencial da §7.2 íntegra,
tudo falha fechado (prova E) e alguém vai "consertar" — e o conserto barato é o `PAP-01`.
CORREÇÃO SUGERIDA: `SET LOCAL ROLE` como parte não opcional da abertura de transação de cliente,
com o comentário dos dois arquivos apontando para a §6.2 — dono: `backend`.

### PAP-06 — `default_acl_presente` responde sobre quem pergunta, e agora isso reprova com saída `3` — [MÉDIO]
ONDE: `db/papel-do-cliente.md:190` (`d.defaclrole = to_regrole(current_user)::oid`),
`db/migrator/PROVISION-E-VERIFY.md:396`.
CENÁRIO: medido (`P10`): a mesma consulta, no mesmo banco íntegro, rodada por papel diferente do que
criou os privilégios padrão, devolve `default_acl_presente = f` em **todos** os schemas. Como a §13.5
liga divergência a saída `3`, o `verify` rodado por um operador para auditar o banco reprova a frota
inteira com "papel adulterado". É o defeito que a própria §13.4 descreve e evita — controle que
reprova sempre é controle que se aprende a ignorar — agora ligado ao veto em vez do registro.
POR QUE É REAL: `current_user` não é propriedade do banco auditado, é de quem digitou o comando.
Nota junto, porque muda a leitura da §7.3: a mitigação que realmente pega o sintoma "tabela nova
nasce invisível" é `tabelas_sem_select`, medida em `P11`, e ela é independente de quem pergunta.
CORREÇÃO SUGERIDA: ancorar a coluna no dono do schema (`pg_namespace.nspowner`), ou emitir linha
própria "privilégio padrão ausente para o papel que vai criar tabela" sem saída `3`, mantendo o `3`
no que `tabelas_sem_select` acusa — dono: `arquiteto-dados`.

### PAP-07 — a mesma variável de ambiente nomeia a credencial no ato e na verificação — [MÉDIO]
ONDE: `db/migrator/src/config.ts:93` (`FORJA_MIGRATOR_APP_CREDENTIAL_ROLE`),
`db/migrator/src/tenant-role.ts:198`, coluna `credencial_assume` da §7.5.
CENÁRIO: um `.env` copiado de outra máquina nomeia um papel existente que não é a credencial da
aplicação — o papel pessoal de quem desenvolve, ou o `ops` do `PAP-03`. `migrate` concede **todos** os
papéis de cliente a ele, um por schema visitado, sem erro; e o `verify`, que lê a mesma variável,
responde `credencial_assume = t` e `conforme`. A validação existente só recusa nome começando por
`app_`.
POR QUE É REAL: verificação que confere o ato contra a mesma entrada que produziu o ato não é
verificação. O único fato independente disponível é o catálogo: a credencial da aplicação é o membro
de `forja_app` **sem** `admin_option` que tem `LOGIN`, e deveria haver exatamente um.
CORREÇÃO SUGERIDA: confrontar o nome vindo do ambiente com essa pergunta antes do primeiro `GRANT`,
recusando com saída `2` quando divergir — dono: `arquiteto-dados`.

### PAP-08 — o papel do cliente tem `TEMP`, que a §7.3 declara não conceder, e todo nome de migration é não qualificado — [MÉDIO]
ONDE: `db/papel-do-cliente.md:111` ("Sem sequência e sem `TEMP`"), `db/migrator/RECUSAS.md` §11.3.
CENÁRIO: medido (`P18`): `datacl` do banco nasce com `=Tc/`, isto é, `TEMPORARY` e `CONNECT` para
`PUBLIC`; o papel do cliente cria `CREATE TEMP TABLE orders` e, com `search_path = t_acme` explícito,
um `orders` não qualificado passa a resolver para a temporária (1 linha) em vez da tabela real (4).
Como a §11.3 **obriga** todo corpo de função e gatilho de migration a escrever nome não qualificado,
todo corpo é sombreável. Com o canal do `PAP-04` aberto, o efeito não é ler errado: é a venda gravar
numa relação que some no fim da sessão, sem erro.
POR QUE É REAL: a lista da §7.3 é a autoridade sobre o que o papel pode fazer, e ela afirma uma
ausência que o banco não tem. Privilégio de banco não se concede só por `GRANT`: `PUBLIC` já carrega
`TEMPORARY` por padrão.
CORREÇÃO SUGERIDA: `REVOKE TEMPORARY ON DATABASE … FROM PUBLIC` no ato do operador (§7.2), com a
pergunta correspondente no `verify`, e a frase da §7.3 corrigida — dono: `arquiteto-dados`.

### PAP-09 — `RETURNS SETOF` passa o crivo, e a §11.2 reescrita diz que é recusa — [BAIXO]
ONDE: `db/migrator/RECUSAS.md:139` e `:177`, contra `db/migrator/src/refusals.ts:129`
(`/^ returns (?:setof )?[a-z0-9_]+…/`).
CENÁRIO: uma migration com `CREATE OR REPLACE FUNCTION f() RETURNS SETOF orders LANGUAGE sql AS
$b$ … $b$` é **aceita** pelo crivo (`P21`), enquanto o contrato afirma que a superfície de consulta
sancionada é a view, obrigada a `security_invoker`. `RETURNS TABLE ( … )` é de fato recusado.
POR QUE É REAL: divergência documento↔código sobre um controle recém-escrito, do mesmo tipo do
`EXE-09` e do `EXE-10`. Não vi caminho de privilégio por trás dela — sem `SECURITY DEFINER`, a função
roda como quem a chama, e §11.3 e §11.5 continuam correndo no corpo —, e é por isso que é `BAIXO` e
não mais.
CORREÇÃO SUGERIDA: tirar o `(?:setof )?` do padrão, ou tirar a frase do contrato; uma das duas, com
teste — dono: `arquiteto-dados` decide qual, `coder` aplica.

### PAP-10 — o estado `incompleto` sai com o código que manda investigar adulteração — [BAIXO]
ONDE: `db/migrator/src/commands/verify.ts:172`, `db/migrations/platform/0008__event_kinds_tenant_role.sql:32`,
tabela da §7.4.
CENÁRIO: um cliente cujo privilégio padrão ficou para trás (executor trocado) ou cuja tabela nova
nasceu sem `SELECT` é classificado `incompleto` e registrado como `tenant_role_divergent`, cuja
descrição é "atributo ou privilégio fora do ato que o cria" e cuja ação documentada é "investiga:
alguém tocou no papel fora deste ato" — explicitamente **não** rodar `migrate`. A linha impressa só
sugere o comando que converge no caso `ausente`. A ação certa para `incompleto` é justamente
`migrate --schema`, que converge sozinho.
POR QUE É REAL: são três estados e dois códigos. É o `gotcha-motivo-enumerado-que-engole-dois-diagnosticos`
que o comentário da própria `0008` cita como razão para ter dois códigos, reaparecendo um degrau
abaixo. **Reincidente em classe**, não em achado.
CORREÇÃO SUGERIDA: um terceiro código, ou a linha impressa do `incompleto` nomeando o comando que
converge — dono: `arquiteto-dados`.

### PAP-11 — três textos mandam o próximo leitor para a decisão revogada — [BAIXO]
ONDE: `db/papel-do-cliente.md:241` ("o piso continua **15**"), `db/convencoes.md:308` ("O banco é
PostgreSQL 15 ou mais novo", sob o título "Piso de versão do PostgreSQL — **16**"),
`apps/api/src/db/pool.ts:13` ("Continua em aberto se o papel de aplicação é um por cliente ou um só").
CENÁRIO: quem for criar o primeiro papel de leitura de operação lê a §7.6 e conclui que precisa subir
o piso antes — já foi subido, e o código recusa abaixo de `160_000` (`db/migrator/src/session.ts:65`). Quem for
escrever a primeira rota lê `pool.ts` e conclui que o arranjo está em aberto.
POR QUE É REAL: são as três frases exatamente onde alguém vai procurar a decisão, e as três contam a
versão anterior dela.
CORREÇÃO SUGERIDA: três edições de uma linha — dono: `arquiteto-dados` (as duas de `db/`), `backend`
(a de `apps/api`).

### PAP-12 — o `REVOKE` do schema `public` é um controle que só existe no texto, e dá para perguntar por ele — [BAIXO]
ONDE: `db/papel-do-cliente.md:46` (§7.2).
CENÁRIO: o ato é do operador, sem artefato; se ele for pulado, nada acusa. Confirmei o motivo de ele
estar lá e não no executor (`P19`: o executor recebe `WARNING` e sai com **sucesso**). O que a medição
muda é o tamanho do que está em jogo: em 16, `nspacl` do `public` já nasce `{pg_database_owner=UC/…,
=U/…}`, então `CREATE` não está concedido a `PUBLIC` por padrão e o papel de cliente **não** consegue
plantar isca ali (medido: `permission denied for schema public`). O que sobra é `USAGE`, e ele só
importa se alguém com posse criar objeto em `public`.
POR QUE É REAL: baixo impacto, mas ausência indetectável. E dá para detectar com uma pergunta sem
parâmetro, que medi nos dois estados: existe entrada com `grantee = 0` em `pg_namespace.nspacl` do
`public` (e, junto, em `pg_database.datacl` com `privilege_type = 'TEMPORARY'`, que é o `PAP-08`).
Antes do `REVOKE`: `t | t`. Depois: `f | f`.
CORREÇÃO SUGERIDA: essa pergunta no `verify`, no molde da §13.4 — linha nomeada e evento
`privilege_unexpected`, **sem** mudar código de saída, porque nada versionado aplica o `REVOKE` —
dono: `arquiteto-dados`.

---

## 3. As perguntas que o brief fez, respondidas

**1. O resíduo da §6.2 é contenção suficiente?** Hoje sim, por ausência de superfície: não existe
rota que monte consulta. Como propriedade permanente, não — e o erro não está na escolha do arranjo,
está na frase que descreve o que a sustenta. Ver `PAP-04`: o que contém não é "parametrizar", é "todo
texto que chega à conexão do cliente carrega parâmetro ligado", porque com zero parâmetros o driver
já instalado vai de protocolo simples e o servidor aceita `;`. Mecanismo de banco que feche isso não
existe no arranjo escolhido: a credencial é membro dos N papéis e `SET ROLE` é conferido contra o
`session_user`, não contra o papel corrente. A alternativa que fecharia é a que foi recusada (N
credenciais), e o desempate já foi dado e não é meu. Então a contenção é de borda, e por isso ela
precisa ser **verificável** — um teste, não uma frase. No dia da primeira rota que monta consulta a
partir de entrada, o desfecho medido é o `P14`: leitura do outro cliente na mesma requisição, e a
conexão volta ao pool carregando o papel dele.

**2. `CREATEROLE` do executor.** Confirmados os dois atos que 16 recusa (`P12`), mais um que a §7.6
não menciona e é a favor dela: em 16 o criador **não** consegue `SET ROLE` para o papel que criou
(`set_option = f`). O que sobra de perigoso está no `PAP-03`, e é um só, em uma frase: ele cunha
credencial `LOGIN` com alcance de cliente, e ninguém pergunta por credencial que não estava prevista.

**3. A pergunta da §7.5 deixa passar papel adulterado?** Sim, quatro formas, todas medidas, todas
respondendo `conforme`: privilégio **a mais** no próprio schema (`P9`), privilégio no schema **de
outro cliente** (`P5`), papel **membro de outro papel** de cliente (`P6`), e privilégio concedido a
**`PUBLIC`** em vez de ao papel, inclusive o `ALTER DEFAULT PRIVILEGES` (`P7`). A quinta forma que o
brief levantou — `ALTER DEFAULT PRIVILEGES` amarrado a outro papel — é a única que ela **pega**, e
pega bem. Ver `PAP-02`.

**4. A mitigação do `FOR ROLE`.** Verificada, e funciona por uma coluna diferente da que o texto
credita. `default_acl_presente` compara contra `current_user`, então ela reprova quando quem pergunta
é outro (`P10`, que é o `PAP-06`) e acerta quando é o executor. Quem pega o sintoma que aparece no
caixa um release depois é `tabelas_sem_select` (`P11`): tabela criada por papel sem privilégio padrão
conta 1, independentemente de quem pergunta. Somada à convergência da §7.4, que roda ao fim de todo
schema visitado e reconcede o que falta na mesma rodada em que a migration criou a tabela, a janela
entre "tabela nasce invisível" e "tabela fica legível" fecha dentro do próprio `migrate`. A camada
está certa; só não é a coluna que a §7.3 diz.

**5. O `REVOKE` do `public`.** `PAP-12`: é controle só no texto, é menos grave do que parece em 16, e
a ausência dele vira detectável com uma pergunta de uma linha que medi nos dois estados.

**6. O `GRANT` não separar família de tabela.** A ausência está bem argumentada e eu não a reabro:
privilégio do Postgres é por schema e por tipo de objeto, e separar famílias exigiria um schema por
família, que contradiz a tenancy fechada. Mas a conclusão de que "a estrutura sozinha basta" precisa
de uma condição que hoje não está escrita: o gatilho de recusa só é equivalente ao privilégio se ele
**não puder ser desligado** por quem atende a requisição. Quem desliga gatilho é o dono da tabela,
que é o executor, não o papel do cliente — então para a família fiscal, sim, basta, e o `P9` mostra o
preço de errar na outra ponta: `DELETE` e `TRUNCATE` concedidos à mão passam despercebidos, e
`TRUNCATE` não dispara gatilho de linha. Isto é o `PAP-02` outra vez, e é por isso que a resposta
sobre a família fiscal depende dele: a estrutura basta **enquanto** alguém verificar que o privilégio
não cresceu.

**7. A âncora da cabeça da view.** Confirmada, medida em quatro formas (`P20`): segundo `WITH (…)`
antes do `AS`, `security_invoker = false`, opção extra na mesma lista e opção antes do
`security_invoker` são todas recusadas; `WITH CHECK OPTION` no fim passa, como o texto declara. A
obrigatoriedade do `security_invoker` se sustenta. O que não se sustenta é a outra metade da mesma
frase: `RETURNS SETOF` (`PAP-09`).

---

## 4. Notas — sem cenário, não são achados

- **A mensagem que o caixa vê quando o `EXE-01` é contido não diz o que aconteceu.** Medido (`P16`):
  o erro é `relation "orders" does not exist`, não `permission denied` — sem `USAGE` no schema, o
  servidor não revela a existência do objeto. A §6.2 descreve o desfecho como "o erro apontando a
  linha do corpo da função", o que é verdade, mas quem investigar vai procurar migration faltando, não
  fronteira violada.
- **`rolconfig` do papel assumido é inerte** (`P22`): `ALTER ROLE app_t_x SET search_path = …` não se
  aplica em `SET ROLE`. Um vetor de adulteração a menos, e vale escrever para ninguém precisar medir
  de novo.
- **A consulta da §7.5 morre se `platform` não existir**: `has_schema_privilege(…, 'platform', …)`
  levanta erro, ao contrário de `to_regrole`, que devolve nulo. Só acontece em banco sem a `0000`, em
  que nada mais funciona.
- **A estimativa do §7.1 sobre o nome está certa**: `app_` + 40 do slug + `t_` cabe em 63 bytes.

---

## 5. Veredito

**O `EXE-01` fecha?** No instante que morde, o da operação, **o mecanismo fecha e eu medi**: com o
papel do cliente assumido, o corpo de função que move a venda para o schema de outro cliente falha e
não grava nos dois lados (`P16`); com o papel do executor, o mesmo arquivo vaza (`P17`). No instante
da migration, não fecha, e isso é ausência declarada na §6.2, com custo escrito — não reabro.

**Mas fechado ele ainda não está**, e por duas razões que não são o ato da §7.3: a borda não assume
papel nenhum (`PAP-05`), então hoje não existe o papel que produz o desfecho do `P16`; e a propriedade
de que o desfecho depende não é verificada por nada (`PAP-01`), então o dia em que a borda assumir o
papel, ninguém consegue provar que a credencial não herda. O ato está certo. O que falta é uma linha
nele (`WITH INHERIT FALSE, SET TRUE`) e uma coluna na pergunta que o confere.

**O executor pode provisionar um cliente de verdade?** **Sim** — e é a primeira vez neste gate que a
resposta é sim. Rodei o ato inteiro da §7.3 como executor não-superusuário em 16.15, com
`ADMIN OPTION` no grupo, e os seis comandos aplicam num commit (`P1`). O que o `provision` produz é um
cliente com schema, migrations e papel próprio, e um estado incompleto dele falha fechado em operação.
O que esse cliente **ainda não tem** é prova de que o papel dele é o único caminho até o schema dele:
enquanto o `PAP-01` e o `PAP-02` estiverem abertos, o `verify` responde `conforme` para quatro estados
que vazam entre clientes, e "conforme" é a palavra em que todo mundo vai confiar.

**Ordem sugerida:** `PAP-01` antes do primeiro cliente em operação (é uma linha no ato e uma coluna na
pergunta); `PAP-02` e `PAP-03` juntos, porque são a mesma consulta invertida; `PAP-05` antes da
primeira rota; o resto quando o dono do território passar por perto.

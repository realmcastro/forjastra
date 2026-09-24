# Terceira auditoria do gate 3 — conferência da credencial na subida (`T-0013`, `F-003`)

Data: 2026-09-23 · Autor: `seguranca` · Escopo: `apps/api/src/db/{app-credential,credential-query,credential-refusals}.ts`,
`apps/api/src/observability/startup-facts.ts`, `apps/api/scripts/run-tests.mjs`, e a fronteira com o
`verify` de `db/migrator` (só leitura e execução do `dist` da árvore, sem mutação).

Continua a numeração de `docs/auditorias/2026-09-12-conferencia-da-credencial-na-subida-reauditoria.md`:
achados novos a partir de `SUB-09`.

## 1. Veredito

**O gate 3 não fecha.** `SUB-05`, `SUB-06`, `SUB-07` e `SUB-08` fecharam no que nomeavam, reproduzido
estado por estado (§3). Dois achados novos seguram o fechamento:

- `SUB-09` [ALTO] — existe um quinto mecanismo de alcance, a **delegação por dono de objeto**, que a
  matriz não pergunta. Em duas das quatro formas medidas (regra de reescrita e view materializada) o
  `verify` também não muda uma linha: o estado passa pelos dois lados da parede.
- `SUB-10` [MÉDIO], reincidente de `SUB-07` — o gate sai `0` com teste `todo` falhando, e sai `0` com
  os dois arquivos vivos fora do glob, inclusive com a mutação do `SUB-03` aplicada.

`SUB-11` e `SUB-12` são `BAIXO` e não seguram sozinhos.

**Resposta explícita à prioridade um:** existe caminho em que um cliente vê (e escreve) dado de outro
com o servidor afirmando `startup_credential_verified`: `SUB-09`. Ele exige DDL manual do dono das
tabelas (o executor ou o superusuário), fora do caminho de migration, e não é alcançável por requisição
de fora. Nenhum caminho novo parte do chamador: o tenant continua vindo do contexto da borda, e o fato
de subida continua sem nome de cliente (medido, §3).

## 2. Ambiente

PostgreSQL **16.15** (`postgres:16`, Debian 16.15-1.pgdg13+2), dois containers descartáveis meus,
`forja-s13-pg` (`127.0.0.1:55510`, arranjo) e `forja-s13-gate` (`127.0.0.1:55512`, banco do gate),
`trust`, **removidos ao fim** (conferido: zero containers `forja-s13-*`). `devstack-pg`, `devstack-s3`,
`serve-offgrid-cms`, os `forja-t9-*` e os `forja-g9-*` da auditoria paralela não foram tocados.

Arranjo montado **pelos atos reais**: §7.2 emitida pelo operador `postgres`; `migrate`, `provision acme`
e `provision globex` rodados pelo `dist` da árvore de `db/migrator` com executor `forja_exec`
(`LOGIN NOINHERIT CREATEROLE`, não superusuário). Uma tabela `orders` por cliente, com venda `111` em
`t_acme` e `222` em `t_globex`, criada pelo executor. Essas tabelas não estão na referência estrutural,
então o `verify` de base sai `3` com linhas `sobra`; toda conclusão sobre o `verify` abaixo é **diff**
da saída contra essa base.

`apps/api` copiado para o scratchpad e recompilado: o `dist` resultante é **idêntico** ao da árvore
(`sha256` arquivo a arquivo). Toda mutação foi feita na cópia. Servidor de teste na porta `55511`.
`apps/api/dist` e `db/migrator/dist` terminaram byte a byte iguais ao início (`sha256` de 54 e 120
arquivos, conferidos).

## 3. O que fechou, medido

| Estado | Antes (relatório de 2026-09-12) | Agora |
|---|---|---|
| saudável | seis `ok` | sete `ok`, `/health` `200` |
| `SUB-05a` `GRANT USAGE ON SCHEMA t_globex TO app_t_acme` (executor) | seis `ok` | saída `78`, `assumedReach: refused`, porta fechada |
| `SUB-05b` o mesmo em `platform` | seis `ok` | saída `78`, `assumedReach: refused` |
| `SUB-05c` `ALTER ROLE app_t_acme SUPERUSER` | seis `ok` | saída `78`, duas recusas, a de atributo primeiro |
| `SUB-06` `USAGE` em `platform` à credencial | seis `ok` | saída `78`, `reach: refused` |
| dono: `ALTER SCHEMA t_globex OWNER TO app_t_acme` | — | saída `78`, `assumedReach: refused` |
| `USAGE` de `t_globex` a `PUBLIC` | — | saída `78`, `reach` e `assumedReach`; `app_t_globex` excluído do próprio schema |
| `SUB-07` alvo sem arquivo | saída `0` | saída `1` nos dois modos |
| `SUB-08` três mutações | `72/72` | as três morrem (casos 11 e 12) |

- **Contagens do autor, exatas:** gate `83 · 83 pass · 0 skipped`, saída `0`; `--no-database`
  `83 · 64 pass · 19 skipped`, saída `0`; sem a variável, saída `1` sem teste executado. **Não rodei**
  o `R4` (banco servido pelo executor): não é propriedade de segurança do gate.
- **As oito mutações do autor morrem**, com os mesmos casos que ele nomeou (`session_user`, `CREATE`
  da credencial, `rolcanlogin`, alcance de assumido, atributo, universo sem `platform`, exclusão
  `false`, exclusão `true` derrubando 9 casos com o caso 1 entre eles).
- **Escala:** 600 schemas de cliente a mais, provisionados pela forma da §7.3 (603 `t_*`): a consulta
  de subida responde **zero** linha nas quatro colunas de alcance, em **278–288 ms** (três execuções,
  credencial nua). O servidor sobe com os sete `ok`. Uma concessão hostil nesse cluster
  (`app_t_s13n0300 -> t_globex`) recusa com saída `78`.
- **Fato de recusa:** `factId`, `occurredAt`, `kind`, `currentRole`, `sessionRole`, `groupRole`,
  `verdict` e nenhum nome de cliente, conferido na recusa por `PUBLIC` com 603 schemas.

## 4. Pergunta (1) do autor: os mecanismos de alcance

Medido um por um, contra o servidor:

| Candidato | O que a matriz faz | Por quê |
|---|---|---|
| `PUBLIC` no schema | acusa (`reach` e `assumedReach`) | `has_schema_privilege` responde por `PUBLIC` |
| `pg_read_all_data` a `app_t_acme`, `INHERIT TRUE` (a transação de `acme` lê `222`) | acusa (`assumed` e `assumedReach`) | a linha está em `pg_auth_members`, e o papel predefinido vira alcance em `has_schema_privilege` |
| `pg_read_all_data` a `app_t_acme` só `SET` | acusa (`assumedReach`) | o papel predefinido entra em `assumidos` pela cadeia de `SET` |
| `pg_write_all_data` a `forja_app` | acusa (`assumed` e `assumedReach`) | idem |
| `pg_read_all_data` à credencial (padrão e `INHERIT TRUE`) | acusa (`assumedReach`; e `inheritance`/`reach` no segundo) | idem |
| `ALTER DEFAULT PRIVILEGES … ON SCHEMAS` e `ON TABLES` a `app_t_acme` | **não acusa na subida**, e está certo | nada é alcançado até existir schema novo; o `provision initech` seguinte sai `3` nomeando `app_t_acme tem USAGE no schema` |
| `BYPASSRLS` em papel assumido | acusa (a coluna existe) | mas **nenhum teste mata a mutação dela** (`SUB-11`); sem RLS no modelo, não há alcance a medir |
| extensão confiável criada pelo próprio papel | não se aplica | medido: `app_t_acme` e a credencial levam `Must have CREATE privilege on current database`; `pgcrypto` criada pelo executor em `t_acme` tem 0 rotinas `SECURITY DEFINER`, todas de `postgres`, e o servidor sobe `ok`, que é o certo |
| **delegação por dono de objeto** | **não acusa** | `SUB-09` |

O executor não-superusuário não consegue conceder papel predefinido nem mudar `SUPERUSER`, `BYPASSRLS`
ou `REPLICATION` (medido, as quatro recusas nomeadas pelo servidor). As linhas de papel predefinido e
de atributo acima são, portanto, atos de superusuário.

### SUB-09 — a delegação por dono de objeto é um quinto mecanismo de alcance, e em duas formas nenhum dos dois lados a acusa — [ALTO] — **reincidente em classe de `PAP-15`**

ONDE: `apps/api/src/db/credential-query.ts:79-87` e `apps/api/src/db/app-credential.ts:42-68` (a
matriz e a afirmação de que ela fecha); `db/migrator/src/structure-print.ts:41-81` (o `verify` imprime
`relkind` `r`, `p`, `v`, `S`, gatilho e rotina, e não imprime regra nem view materializada).

CENÁRIO: o dono das tabelas de cliente (o executor, não superusuário) cria à mão, em `t_acme`, um objeto
cuja definição roda com o privilégio **dele** e aponta para `t_globex`. Medido nas quatro formas, com o
servidor subindo `startup_credential_verified`, sete `ok` e `/health` `200` em todas:

| Forma | Pela transação de `acme` (`SET LOCAL ROLE app_t_acme`) | `verify` |
|---|---|---|
| `CREATE RULE … ON INSERT TO t_acme.orders DO ALSO INSERT INTO t_globex.orders …` | a venda `INSERT INTO t_acme.orders VALUES (7, 777)` conclui **e** grava `1007/777` em `t_globex.orders` | saída textual **idêntica** à base: a regra não aparece |
| `CREATE MATERIALIZED VIEW t_acme.mv_apoio AS SELECT … FROM t_globex.orders` | lê `222` | saída textual **idêntica** à base |
| função `SECURITY DEFINER` em `t_acme` lendo `t_globex` | lê `222` | só `sobra: funcao relatorio()` |
| view sem `security_invoker` em `t_acme` lendo `t_globex` | lê `222` | só `sobra: visao v_apoio` |

POR QUE É REAL: o objeto mora no schema do próprio cliente, onde o papel dele tem `USAGE`, e é
executado com o privilégio do dono, que alcança todo `t_*` (§7.3 faz do executor dono). A regra de
reescrita é o desfecho exato que `tenant-role.ts:8-14` diz que a camada de papel existe para
transformar em falha barulhenta: escrita no schema alheio **com a venda concluindo em sucesso**. O
crivo de migration impede isso por dois lados (`refusals.ts:38` recusa `SECURITY DEFINER`, e
`FOREIGN_SCHEMA` em `refusals.ts:78-81` recusa qualificador `t_*`), então o estado é drift: é por isso
que ele é `ALTO` e não `CRÍTICO`, e é por isso que o detector dele teria de ser o `verify`, que para
regra e view materializada é cego. `has_schema_privilege(app_t_acme, t_globex, …)` continua `f` nos
quatro estados, então nenhuma pergunta de alcance pode vê-lo.

CORREÇÃO SUGERIDA: o `verify` passa a imprimir regra de reescrita (exceto `_RETURN`) e view
materializada em schema protegido, e a acusar objeto de schema protegido cuja dependência
(`pg_depend`) atravessa para outro schema protegido — dono: `arquiteto-dados`. E o topo de
`app-credential.ts` declara a delegação por objeto como fora da matriz, nomeando quem a responde, em vez
de afirmar três mecanismos fechados — dono: `backend`. Se `backend` preferir responder na subida, uma
consulta sem falso positivo existe: o arranjo legítimo não tem nenhum objeto de schema protegido com
dependência em outro schema protegido.

## 5. Pergunta (2) do autor: a fronteira com o `verify`

Medido contra o `verify` do `dist` da árvore, em diff contra a base:

| Estado | `apps/api` | `verify` | Fecha? |
|---|---|---|---|
| papel `NOLOGIN` fora dos assumidos, no grupo, com `USAGE` em `t_globex` | sobe `ok` (fora do sujeito, por desenho) | `alcance ao schema "t_globex": forja_s13_ponte tem USAGE` | sim |
| privilégio padrão latente sobre schemas | sobe `ok` | `provision` seguinte sai `3` nomeando o alcance, antes de o cliente novo ter papel | sim |
| `app_t_acme` com `CREATE` no **próprio** schema (o excluído legítimo em estado hostil; a §7.3 diz "sem `CREATE`") | sobe `ok`: a exclusão cobre `USAGE` e `CREATE` do par | `papel de banco: app_t_acme: tem CREATE no próprio schema` | sim |
| `app_t_acme` dono do **próprio** schema | sobe `ok` | `dono inesperado: o schema "t_acme" pertence a "app_t_acme"` | sim |
| regra de reescrita e view materializada (`SUB-09`) | sobe `ok` | **silêncio** | **não** |
| papel `LOGIN` no grupo com `pg_read_all_data` (`SUB-12`) | sobe `ok` (fora do sujeito) | **silêncio** | **não** |

A exclusão nova (`'app_' || nspname`) foi atacada com o excluído legítimo em estado hostil, que é o
teste que a governa: os dois estados hostis possíveis sobre o próprio schema passam pelo `apps/api` e
são acusados pelo `verify`. A exclusão não desculpa nada que o outro lado não pegue.

### SUB-12 — um papel com leitura total predefinida lê todos os clientes e `platform`, e nenhum dos dois lados acusa — [BAIXO]

ONDE: `db/verificacao-do-papel.md` §7.5.1 (as duas vias são `nspacl` e membro direto de `app_t_*`);
`db/migrator/src/tenant-reach.ts`.

CENÁRIO: o operador cria um papel `LOGIN`, põe no grupo e concede `pg_read_all_data` (o gesto natural
para um usuário de relatório consolidado). Medido: esse papel lê `111` em `t_acme`, `222` em `t_globex`
e as três linhas de `platform.tenants`; a saída do `verify` fica textualmente **idêntica** à base, e o
`apps/api` sobe `ok`, como deve, porque o papel não é assumido por este processo.

POR QUE É REAL: o alcance por papel predefinido não passa por `nspacl` nem por membro de `app_t_*`,
que são as duas vias que a §7.5.1 enumera. É `BAIXO` porque só o superusuário concede papel predefinido
(o executor leva `Only roles with the ADMIN option on role "pg_read_all_data"`, medido), e a mesma mão
cria superusuário `LOGIN`, que a §7.5.1 já declara fora ao recusar enumerar todo papel `LOGIN`. O que
falta é o papel predefinido ser uma concessão nomeada e barata de enumerar, e não estar declarado.

CORREÇÃO SUGERIDA: a pergunta invertida acrescenta a via "membro de `pg_read_all_data` ou
`pg_write_all_data`", ou a §7.5.1 a declara fora com o motivo — dono: `arquiteto-dados`. A auditoria
paralela de `db/**` pode ter o mesmo achado com outra numeração.

## 6. O gate de teste (`run-tests.mjs`)

Medido na cópia, com banco servido, arquivo de sonda acrescentado ao `dist/test` e removido depois:

| Marcador | Saída | Placar impresso |
|---|---|---|
| `{ todo: true }` com asserção que falha | **`0`** | `84 testes · 83 passando · 0 falhando · 0 pulados` |
| `t.todo()` no corpo, e falha | **`0`** | idem |
| `{ skip: <condição> }` | `1` | `1 pulados`, gate reprovado |
| `t.skip()` condicional no corpo | `1` | idem |
| `return` antecipado condicional | `0` | nenhum executor enxerga isto (nota §7) |
| `test.only` sem `--test-only` | `1` | o Node 22.23.1 avisa e roda todos; o irmão que falha reprova |

### SUB-10 — o gate sai `0` com `todo` falhando e com os testes vivos fora do glob — [MÉDIO] — **reincidente de `SUB-07`**

ONDE: `apps/api/scripts/run-tests.mjs:80-86` (lê `tests`, `pass`, `fail`, `cancelled`, `skipped`, e não
`todo`) e `:103` (`total === 0`).

CENÁRIO: dois estados, os dois com `FORJA_TEST_DATABASE_URL` servida.
(a) Um caso vivo marcado `todo` cuja asserção falha: saída `0`, e o placar soma 83 de 84 sem acusar a
diferença. `todo` é pulo que roda e descarta a falha, e o gate recusa pulo.
(b) Os arquivos vivos saem do glob `dist/test/**/*.test.js` (o refactor de nome ou de `rootDir` que o
próprio comentário de `:93-96` descreve): com `app-credential-live` fora, `69 · 69 pass`, saída `0`; com
os dois vivos fora, `64 · 64 pass`, saída `0`, e **nenhum teste toca o banco**. Com a mutação do
`SUB-03` aplicada (`m.inherit_option → false` na herança da credencial): glob íntegro, `8 fail`, saída
`1`; vivo fora do glob, `69 · 69 pass`, saída **`0`**.

POR QUE É REAL: (b) é o defeito que o gate existe para matar, em modo de gate: a consulta ao catálogo
não é executada por teste nenhum e a suíte sai `0`. A correção do `SUB-07` fechou o caso que o achado
nomeava (zero arquivo) e conservou a fronteira dele (arquivo a menos), que é o padrão registrado em
[[gotcha-a-correcao-muda-a-pergunta-e-conserva-uma-fronteira-dela]]. A recusa ao piso numérico
continua certa. O que não envelhece é o gate saber **quais** arquivos exigem banco.

CORREÇÃO SUGERIDA: em modo de gate, exigir `passaram === total` (pega `todo` e qualquer categoria
futura) e reprovar se algum arquivo vivo nomeado no script não produziu teste executado — dono:
`backend` (implementação por `coder`, se o orquestrador preferir).

### SUB-11 — a mutação que tira `CREATE` da sétima pergunta sobrevive com `83/83` — [BAIXO] — **reincidente em classe de `SUB-08`**

ONDE: `apps/api/src/db/credential-query.ts:161` (o `VALUES ('USAGE'), ('CREATE')` de
`assumed_schema_reach`).

CENÁRIO: trocar só esse `VALUES` por `('USAGE')` deixa o gate em `83 · 83 pass`, saída `0`. O estado
real que a coluna recusa existe: `GRANT CREATE ON SCHEMA t_globex TO app_t_acme` sem `USAGE`. A
conferência intacta sai `78` nomeando `app_t_acme -> t_globex (CREATE)`, e a transação de `acme` cria
`t_globex.isca_s13` com dono `app_t_acme` (medido).

POR QUE É REAL: o caso 12 mata essa mutação na coluna da credencial (`:146`) e não na do papel
assumido. É a correção do `SUB-08` conservando a fronteira de sujeito. Também sobrevive, com `83/83`,
`('BYPASSRLS', assumido.rolbypassrls) → false`, sem alcance a medir enquanto não houver RLS.
`assumidos` incluindo a própria credencial também sobrevive, e é mutante equivalente: só acrescenta
linha.

CORREÇÃO SUGERIDA: um caso vivo com `CREATE` sem `USAGE` num papel de cliente sobre o schema do outro —
dono: `backend`.

## 7. Notas (sem cenário que feche achado)

- **Estatística de coluna por privilégio de tabela sem `USAGE`.** Com `GRANT SELECT ON ALL TABLES IN
  SCHEMA t_globex TO app_t_acme` (a segunda linha da §7.3 com o slug trocado), a leitura direta leva
  `42501`, mas `pg_catalog.pg_stats` devolve `most_common_vals {222}` de `t_globex.orders` na transação
  de `acme`, o servidor sobe `ok` e o `verify` fica idêntico. O `USAGE` não é ponto de estrangulamento
  para essa visão. Não vira achado porque nenhuma rota lê `pg_stats`. Vira no dia em que alguma ler.
- **Volume de cada cliente é legível por qualquer sessão.** A credencial nua lê
  `pg_stat_user_tables.n_tup_ins` de `t_globex.orders` (`51`). É propriedade do schema por cliente,
  não desta camada. Vira achado se alguma superfície expuser estatística de catálogo.
- **`return` antecipado condicional** passa por qualquer gate. A defesa é revisão, e o caso 3 já foi
  convertido de pulo em falha nomeada.
- **Consulta** `O(papéis × schemas)`: 278–288 ms com 603 schemas, medido. É de `performance` se a faixa
  passar de milhares.
- `F-003` continua falando em "seis perguntas": é a pergunta aberta a `produto` desde 2026-09-12.

## 8. Reincidência

`SUB-10` reincide `SUB-07`, e a classe (gate verde sobre propriedade não exercida) chega à quinta
encarnação (`PAP-17`, `PAP-23`, `SUB-03`, `SUB-07`, `SUB-10`). `SUB-11` reincide `SUB-08`. `SUB-09` é
da classe de `PAP-15` (objeto que roda com o privilégio do dono). Pela `processo.md` §6, reincidência é
pauta com o humano.

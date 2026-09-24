# Auditoria — a camada de papel depois da declaração (T-0009)

**Data:** 2026-09-12 · **Agent:** `seguranca` · **Read-only.**
**Escopo:** o que mudou em `db/**` depois de `docs/auditorias/2026-09-12-reauditoria-camada-de-papel.md`
(`PAP-19`…`PAP-23`). Medido: `db/migrations/platform/0011__role_declarations.sql`,
`0012__event_kinds_role_declarations.sql`, `db/migrator/src/{role-declarations,schema-universe,
tenant-reach,tenant-role,tenant-role-act,run,preconditions}.ts`,
`src/commands/{verify,verify-questions,migrate,provision}.ts`,
`db/migrator/test/{exclusao-hostil,politica-de-veto,piso-de-medicao,alcance-e-concedente,
papel-do-cliente}.test.ts`, `db/universo-e-declaracao.md`, `db/verificacao-do-papel.md`,
`db/papel-do-cliente.md` §7.7, `db/migrator/CONTRATO.md` §14.

**Numeração:** continua em `PAP-24`. Quatro achados: um `ALTO`, dois `MÉDIO`, um `BAIXO`.
Um é **reincidente em classe** de `PAP-20`.

**Veredito, curto:** `PAP-19`, `PAP-20`, `PAP-21`, `PAP-22` e `PAP-23` estão **fechados, e eu medi os
cinco** — as quatro sondas do gate anterior saem `3` contra o código novo, e desfazer o estado
devolve `0` em todas, sem um falso positivo. A **troca de mecanismo funcionou no eixo que ela
atacava**: não sobrou exclusão que o beneficiário se conceda. O que ela **não** mudou é o **alcance
da pergunta**, e é ali que está o `PAP-24`: a §7.5.1 continua enumerando só o membro **direto** de
`app_t_<slug>`, e agora o conjunto excluído é uma lista de nomes cuja própria lista de membros
ninguém pergunta. Um comando do operador entrega todo cliente a um papel de fora, com `verify` e
`migrate` em `0` e **zero linha impressa**. **`T-0009` não pode fechar.** Detalhe na §7.

---

## 0. Método

PostgreSQL **16.15** (`postgres:16`, `PostgreSQL 16.15 (Debian 16.15-1.pgdg13+2)`) em **três**
containers descartáveis meus, criados e removidos ao fim: `forja-audit-pap8` (porta 55452, `trust`,
só a suíte), `forja-audit-pap8-scram` (55453, `scram-sha-256`, só a suíte) e
`forja-audit-pap8-probe` (55454, `trust`, só o arranjo vivo). O Postgres do humano (`devstack-pg`,
5432) não foi tocado. Sondas em `scratchpad`; nada escrito na árvore fora deste arquivo e da minha
seção na ficha.

Separar o servidor da suíte do servidor das sondas não é zelo: papel é objeto de **cluster**, e a
primeira rodada que fiz no mesmo container deu `# pass 61 · # fail 6 · # cancelled 28` por colisão de
`app_t_acme` entre a sonda e o arnês. O número que vale é o do servidor limpo.

**As duas contagens que o brief exige, medidas por mim, com o `dist/` que a própria suíte compila:**

| Servidor | Resultado | Saída |
|---|---|---|
| `trust` | `# tests 96 · # pass 95 · # fail 0 · # cancelled 0 · # skipped 1` | `0` |
| `scram-sha-256` | `# tests 96 · # pass 78 · # fail 1 · # cancelled 0 · # skipped 17` | `1` |

**Confere com o que o autor mediu, nos dois.** A única falha no `scram` é
`o piso de medição da suíte`, que é o controle novo fazendo o que ele existe para fazer. `npx tsc
--noEmit` passa.

**Arranjo vivo**, montado do zero com o binário real (`node dist/src/main.js`), não com o arnês:
banco `forja_probe`, grupo `forja_app`, credencial `forja_credencial` (`LOGIN NOINHERIT`), executor
`forja_executor` (`LOGIN CREATEROLE`, **não superusuário**, com `ADMIN OPTION` no grupo e `CREATE` no
banco), os dois `REVOKE` da §7.2, dois clientes provisionados pelo comando (`t_acme`, `t_globex`),
uma migration de `tenant` criando `orders`, uma linha em cada. Estado inicial: `provision` `0`,
`migrate` `0`, `verify` `0`.

| Sonda | Pergunta | Resultado |
|---|---|---|
| `S1` | `PAP-19`: segunda credencial do grupo com `GRANT … WITH INHERIT TRUE` do operador | lê os dois clientes nua; `verify` **`3`** nomeando as duas linhas, `migrate --schema` **`3`** antes de conceder. Desfeito: `0`. **Fechado** |
| `S2` | `PAP-20`: ponte `NOLOGIN` com `ADMIN OPTION` no grupo, seis comandos do executor | o leitor lê os dois; `verify` **`3`** nomeando a ponte nos dois schemas. Desfeito: `0`. **Fechado** |
| `S3` | `PAP-22`: `ALTER SCHEMA t_acme OWNER TO probe_dono` pelo executor, e depois o dono apagando o próprio ACL | `3` nas duas formas; com o ACL apagado sobra só `dono inesperado`, que é o ponto. Desfeito: `0`. **Fechado** |
| `S4` | `PAP-21`: `pgcrypto` instalada pelo executor (`extowner = forja_executor`) + `ALTER EXTENSION … ADD VIEW` | `3` antes e depois do `ALTER`; a extensão **sozinha** sai `0`. Desfeito: `0`. **Fechado** |
| `S5` | o executor consegue delegar papel **declarado**? | **não**: `GRANT forja_credencial TO x` e `GRANT forja_executor TO x` levam `permission denied to grant role` — em 16, `CREATEROLE` só administra o que ele criou |
| `S6` | ampliação pelo ambiente: executor cria `probe_cred`, põe no grupo, roda `migrate` com o `.env` apontando para ela | declarada; depois `GRANT probe_cred TO probe_leitor` (o executor **tem** `ADMIN OPTION` sobre o que criou) e `probe_leitor` lê os dois clientes. `verify` **`0`**, com uma linha `registra e não reprova` |
| `S7` | **um comando do operador**: `GRANT forja_credencial TO ops_leitura` | `ops_leitura` lê os dois clientes por `SET ROLE`; `verify` **`0`**, `migrate` **`0`**, **nenhuma linha menciona `ops_leitura`**. É o `PAP-24` |
| `S8` | rotina em `public` que **escapa** da regex (SQL dinâmico), dono não-superusuário | a regex devolve `f` e o objeto **continua acusado** (`3`): a heurística só acrescenta. Confirmado |
| `S9` | `ALTER ROLE app_t_acme LOGIN`, sem mutação | `3`, `tem LOGIN ou outro atributo que o ato da §7.3 não concede` |
| `S10` | `GRANT USAGE ON SCHEMA platform` + `SELECT ON platform.tenants` ao papel do cliente | a credencial assume o papel e lê a carteira inteira (`acme,globex`); sem mutação `verify` sai **`3`**; com a mutação `M5`, **`0`** |
| `S11` | quem escreve em `platform.role_declarations` | credencial e papel do cliente: `permission denied for schema platform`. Executor: `INSERT` cru **aceito**. Gatilho recusa `UPDATE`/`DELETE`/`TRUNCATE` **inclusive para superusuário** |
| `S12` | `INSERT` cru de `('ops_leitura','executor')` + `ALTER SCHEMA t_acme OWNER TO ops_leitura` | `ops_leitura` é dono de `t_acme` e lê os dois; `verify` **`0`**; **nenhum** `app_role_declared` gravado. É o `PAP-25` |
| `S13` | derrubar `ops_leitura` e recriar o mesmo nome | a exclusão **rearma sozinha**: o ataque do `S12` volta a sair `0` sem nenhuma declaração nova |
| `S14` | tabela existindo e **vazia** (banco provisionado antes da `0011`) | `3`, onze linhas, e uma rodada de `migrate` resolve. Mas a instrução impressa manda devolver posse que já está certa. É o `PAP-27` |
| `S15` | schema com prefixo reservado (`pg_isca`, `information_schema`) | o **servidor** recusa, inclusive para superusuário: as exclusões por padrão de nome da §7.5.3 não são emitíveis por quem ataca |

**Mutação no `dist`**, rodando `node --test dist/test/**/*.test.js` **sem** recompilar (o `npm test`
recompila e apagaria a mutação). Base: `95 pass · 0 fail`, saída `0`. `dist/` restaurado e conferido
byte a byte ao fim.

| Mutação | O que silencia | Suíte |
|---|---|---|
| `M1` | devolve a exclusão por propriedade: `admin_option` no grupo volta a desculpar | **`fail 1`** — caso 45 pega |
| `M2` | tira o braço de referência da §7.5.3, voltando ao `deptype='e'` puro | **`fail 1`** — caso 47 pega |
| `M6` | tira a condição de permanência da credencial declarada (excluir mesmo fora do grupo) | **`fail 1`** — caso 43 pega |
| `M3` | `atributo_indevido` vira `false` | **`pass 95 · fail 0`, saída `0`** |
| `M5` | `atributo_indevido`, `create_indevido`, `usage_em_platform` e `heranca_de_outra_credencial`, os quatro | **`pass 95 · fail 0`, saída `0`** |

---

## 1. Prioridade um: existe caminho em que um cliente vê dado de outro?

**Sim, e o que sobrou tem uma forma só: alcance por papel que a declaração desculpa, herdado
transitivamente por quem a declaração não menciona.** Item por item:

1. **Consulta que alcança schema de outro cliente?** Sim, por duas portas, e as duas medidas hoje:
   `PAP-24` (membro de um papel declarado, um comando do operador, `verify` em `0` e **nenhuma**
   linha) e `PAP-25` (declaração escrita fora do ato, `verify` em `0` com uma linha que não veta). As
   quatro portas do gate anterior estão **fechadas**, medidas em `S1`–`S4`.
2. **O tenant vem de identidade autenticada?** Inalterado nesta rodada e fora de escopo
   (`apps/api/**`, fechado no gate de 2026-09-11).
3. **Operação de dados com tenant ausente cai em default?** Não, e melhorou: a pergunta que **não
   pôde ser feita** agora reprova (`checkRoleDeclarationsPresent`, `verify-questions.ts:98-112`),
   medido em `S14` e no caso 48. Falha fechada.
4. **Id de recurso validado contra o tenant?** O análogo desta camada é a pergunta invertida da
   §7.5.1. Ela deixou de confiar em propriedade e passou a confiar em **nome registrado** — a troca
   está certa. O que ela continua sem validar é o **grafo de membros** desses nomes, e é o `PAP-24`.
5. **Canal lateral com tenant no escopo?** `public` está fechado no que eu consegui atacar: objeto de
   dono não-superusuário é sempre listado, a regex só acrescenta (`S8`), o prefixo reservado é
   recusado pelo servidor (`S15`). `platform` continua inalcançável pelo papel do cliente
   (`usage_em_platform` veta), e `S10` mede o que acontece quando alguém abre essa porta: o papel do
   cliente lê a carteira de **todos** os clientes. Sem achado próprio — o controle existe e funciona;
   o que ele não tem é teste (`PAP-26`).

---

## 2. A pergunta central do brief: a classe fechou?

**No eixo que ela ataca, fechou.** Eu enumerei **todas** as exclusões do caminho de decisão e
classifiquei cada uma. Nenhuma remanescente é propriedade que o beneficiário emite.

### §7.5.1 — `tenant-reach.ts:53-84`

| # | Exclusão | Onde | Classificação |
|---|---|---|---|
| E1 | nome em `platform.role_declarations` | `:54-62` | **identidade registrada** ✓ |
| E1a | dentro de E1: `role_kind = 'executor'` exclui **sem condição nenhuma** | `:58` | identidade, **sem permanência** → `PAP-25` |
| E1b | dentro de E1: `app_credential` exige membership no grupo | `:59-61` | propriedade do lado que **estreita** a exclusão ✓ (medido: `M6` é pego) |
| E2 | `g.grantee IS DISTINCT FROM to_regrole('app_' || n.nspname)` | `:71` | identidade **derivada do nome do schema**, que ninguém emite ✓ |
| E3 | `NOT EXISTS legitimo` na via `membro` | `:82` | identidade ✓ |

### §7.5.3 e §7.5.4 — `schema-universe.ts`

| # | Exclusão | Onde | Classificação |
|---|---|---|---|
| U1 | `nspname NOT LIKE 'pg\_%'`, `<> information_schema` | `:57-58` | nome reservado **pelo servidor**, medido em `S15` ✓ |
| U2 | `<> public`, `<> platform`, `NOT LIKE 't\_%'` | `:59-61` | o universo declarado ✓ |
| U3 | relação: `NOT (extensão E dono superusuário) OR referencia schema nosso` | `:76-86` | propriedade — **mas** não produzível por não-superusuário (medido no caso 47 e em `S4`) e com braço de acusação que nenhuma exclusão alcança ✓ |
| U4 | rotina: idem, com regex no corpo | `:94-98` | idem. A regex só **acrescenta**: medido em `S8`, corpo com SQL dinâmico escapa dela e o objeto continua acusado ✓ |
| U5 | dono não é executor declarado | `:153-155` | identidade, com a mesma fonte da §7.5.1 ✓ (herda `PAP-25`) |

### §7.4 / §7.5 — `tenant-role.ts`, e `preconditions.ts`

`no_grupo` (`:96-98`, `NOT m.admin_option`), `create_indevido`, `usage_em_platform`,
`atributo_indevido` e as duas colunas de herança (`:104-122`) estão **todas do lado que acusa**, e
`credencial_no_grupo` (`preconditions.ts:45-50`) também. O autor tinha razão nas duas que citou.

**A ressalva de uma linha:** `cred` (`tenant-role.ts:87-91`) usa `role_kind='app_credential'` **sem**
exigir membership no grupo, enquanto `legitimo` exige. A assimetria cai do lado seguro — uma
credencial declarada fora do grupo é acusada pela §7.5.1 **e** continua sendo perguntada por
`heranca_*`. Nota, não achado.

**O que a troca de mecanismo não mudou, e é a resposta à régua do brief.** A pergunta velha era "quem
alcança, e quem eu desculpo por propriedade". A nova é "quem alcança, e quem eu desculpo por nome". A
**fronteira herdada** é a mesma nas duas: `tenant-reach.ts:79` junta por
`m.roleid = to_regrole('app_' || n.nspname)` e enumera **um nível**. Antes isso não doía porque o
conjunto excluído era definido por propriedade e qualquer membro carregava a propriedade errada.
Agora o conjunto é um conjunto de **nomes**, e ser membro de um nome excluído é ser invisível —
sem carregar propriedade nenhuma, sem tocar em papel de cliente, sem tocar na tabela de declaração.
É o `PAP-24`, e ele é a mesma classe do `PAP-20`: uma ponte que a exclusão desculpa. O que mudou é a
ponte: era `probe_ponte`, agora é `forja_credencial`.

---

## 3. As três perguntas dirigidas do brief

### 3.1 A ampliação pelo ambiente (ausência declarada 1): "já podia ler" cobre o caso?

**Não cobre.** Medido em `S6`, e a diferença é de três tipos, nenhum deles "leitura":

- **Delegação.** O executor cria `probe_cred`, a declara rodando `migrate` com outro nome no `.env`
  e, porque em 16 o criador ganha `ADMIN OPTION` sobre o que cria, emite
  `GRANT probe_cred TO probe_leitor`. `probe_leitor` é uma credencial **separada**, usável por quem
  nunca teve a conexão do executor. "Já podia ler" é sobre o executor; isto é sobre outra pessoa.
- **Permanência.** O alcance sobrevive à rotação do executor: a membership de `probe_cred` no grupo e
  os `GRANT app_t_*` dela continuam de pé depois de `forja_executor` sair de cena.
- **Silêncio dirigido.** A única linha é
  `registra e não reprova: credencial de aplicação a mais: "probe_cred" …`, e ela é **idêntica** à
  linha de uma rotação legítima em andamento (§7.7). `probe_leitor` não aparece em lugar nenhum.

**O que a linha datada com autor de fato compra**, e é real: quem investiga **depois de desconfiar**
tem `declared_by`, `declared_at` e um `app_role_declared` para ancorar a investigação. É mais do que
havia. O que ela não compra é **detecção** — nada cobra a linha, ela não veta, e o beneficiário final
não é nomeado.

**A trava que o texto invoca não trava isto.** `db/universo-e-declaracao.md:175-178` diz que "a trava
contra o `.env` copiado continua sendo a recusa de borda da §7.7 (`PAP-07`), que confere o nome
contra o catálogo". Medido: a §7.7 confere se o nome existe, tem `LOGIN`, está no grupo e não o
administra — e o executor satisfaz **as quatro** sozinho, com dois comandos. A recusa de borda para
o `.env` copiado de outra máquina; ela não para quem tem a conexão.

### 3.2 A heurística de referência para rotina: escapar dela desculpa alguma coisa?

**Não.** Medido em `S8`: uma função `SECURITY DEFINER` em `public` cujo corpo monta
`'select count(*) from ' || quote_ident('t' || '_acme') || '.orders'` faz a regex devolver `f`, e o
`verify` mesmo assim sai **`3`** com
`fora do universo declarado: "public.f_isca" existe no schema public — rotina, dono: forja_executor`.
A razão é estrutural e está certa: a exclusão pede `extensão` **E** `dono superusuário`, e um
não-superusuário não produz objeto de dono superusuário — `CREATE ROLE … SUPERUSER`, `SET ROLE` e
`ALTER … OWNER TO` para superusuário são todos negados a ele. A heurística fica exatamente onde o
autor disse que ela fica: do lado que acrescenta.

### 3.3 A declaração como fonte da verdade: quem escreve, e o que o gatilho cobre?

Medido em `S11`, `S12` e `S13`:

- **A credencial da aplicação e o papel do cliente não alcançam a tabela** (`permission denied for
  schema platform`). Essa metade está certa e é a que mais importa.
- **O executor escreve por `INSERT` cru**, sem passar por `declareArrangement`: sem linha
  `papel declarado:`, sem `app_role_declared` (o contador ficou em `2`, as duas do `provision`).
- **O gatilho cobre `UPDATE`, `DELETE` e `TRUNCATE`** — inclusive para superusuário, medido — e
  **não cobre `INSERT`**, que é desenho. O efeito combinado: a declaração é fácil de plantar e
  impossível de retirar sem desligar o gatilho.
- **`role_kind='executor'` não tem condição de permanência.** Para `app_credential`, tirar do grupo
  torna a declaração inerte, e isso é testado (caso 43, medido em `M6`). Para `executor`, não existe
  nada equivalente: a linha exclui para sempre, e `S13` mostra que derrubar o papel e recriá-lo com o
  mesmo nome **rearma** o ataque sem nenhuma declaração nova.

---

## 4. Achados

### PAP-24 — a exclusão virou nome, e ninguém pergunta quem é membro do nome: um `GRANT` do operador entrega todo cliente a um papel de fora, com `verify` em `0` e nenhuma linha — [ALTO] — **reincidente em classe de `PAP-20`**
ONDE: `db/migrator/src/tenant-reach.ts:79` (a via `membro` junta por
`m.roleid = to_regrole('app_' || n.nspname)` e enumera **só** o membro direto) contra `:54-62`
(`legitimo`), e `db/universo-e-declaracao.md:140-145`, que descreve a condição de permanência como se
ela bastasse.
CENÁRIO: medido (`S7`), em arranjo saudável recém-provisionado, **um comando** na conexão que o
operador já tem aberta — a mesma mão e o mesmo reflexo que produziram o `PAP-13` e o `PAP-19`:

```
CREATE ROLE ops_leitura LOGIN;
GRANT forja_credencial TO ops_leitura;
```

Depois disso `ops_leitura` — que não é membro de `forja_app`, não é membro de nenhum `app_t_*` e não
está em `platform.role_declarations` — faz `SET ROLE forja_credencial; SET ROLE app_t_acme;` e lê
`t_acme.orders`; trocando para `app_t_globex`, lê o outro cliente. Medido:
`acme=1` e `globex=1`. `verify` sai **`0`** ("verify: nenhuma diferença"), `migrate` sai **`0`**, e
`grep ops_leitura` na saída de `verify` devolve **zero linhas**. A linha está à vista no catálogo:
`pg_auth_members` tem `forja_credencial | ops_leitura | postgres | inherit_option=t`.
POR QUE É REAL: a §7.5.1 pergunta "quem é membro de `app_t_<slug>`" e responde `forja_credencial`,
que está em `legitimo` e some. Ninguém pergunta quem é membro de `forja_credencial`. Essa fronteira
existia antes e era inócua: enquanto a exclusão era por propriedade, um membro a mais não carregava a
propriedade certa e caía na pergunta. Ao trocar a exclusão por **nome**, a fronteira virou o caminho
— o mecanismo novo herdou a fronteira do velho no ponto exato em que ela passou a importar. Não é
privilégio de superusuário indo embora: o resultado é uma **credencial de login separada, permanente,
usável por quem nunca teve a senha da aplicação**, e nenhum comando desta base a nomeia. O mesmo vale
para `GRANT forja_executor TO <alguém>`, e aí o beneficiário também é dono de todo schema, com a
§7.5.4 concordando porque o dono continua sendo executor declarado.
CORREÇÃO SUGERIDA: a §7.5.1 enumerar o **fecho transitivo** de quem alcança `app_t_<slug>`
(`pg_auth_members` recursivo, parando em quem está em `legitimo` **e** acusando quem chega por
ele) — ou, mais barato, uma pergunta nova que afirme os membros de cada papel declarado: o conjunto
esperado tem tamanho conhecido e é vazio para a credencial — dono: `arquiteto-dados`.

### PAP-25 — a tabela que desculpa aceita escrita fora do ato, `role_kind='executor'` desculpa sem condição, e a linha é irrevogável — [MÉDIO]
ONDE: `db/migrator/src/tenant-reach.ts:58` (`d.role_kind = 'executor'` sem condição de permanência),
`db/migrations/platform/0011__role_declarations.sql:126-128` (o gatilho cobre `UPDATE`/`DELETE`/
`TRUNCATE` e não cobre `INSERT`), `db/migrator/src/commands/verify-questions.ts:316-334` (a linha que
nomeia e não veta) e `db/universo-e-declaracao.md:173-186` (as três ausências declaradas, que não
incluem nenhuma das três abaixo).
CENÁRIO: medido (`S11`, `S12`, `S13`), tudo na conexão do executor não-superusuário:

```
CREATE ROLE ops_leitura LOGIN;
INSERT INTO platform.role_declarations (declaration_id, role_name, role_kind, declared_by)
VALUES (gen_random_uuid(), 'ops_leitura', 'executor', 'forja_executor');
GRANT ops_leitura TO forja_executor;
ALTER SCHEMA t_acme OWNER TO ops_leitura;
GRANT SELECT ON ALL TABLES IN SCHEMA t_acme TO ops_leitura;
GRANT app_t_globex TO ops_leitura;
```

`ops_leitura` lê os dois clientes e é dono de `t_acme`. `verify` sai **`0`**; a única linha é
`registra e não reprova: executor declarado a mais`. **Nenhum `app_role_declared` foi gravado** — o
contador ficou em `2`, as duas do `provision`. Retirar a linha é impossível pelo caminho normal: o
gatilho recusa `DELETE` **também para superusuário** (medido). E `S13` fecha o ciclo: derrubando
`ops_leitura` e recriando o mesmo nome, o ataque volta a sair `0` sem nenhuma declaração nova.
POR QUE É REAL: as três propriedades que a §7.5.4 vende — "ampliar a exclusão é ato datado com
autor", "só enquanto a condição que produziu a declaração valer", "`verify` nunca escreve" — valem
para o caminho `app_credential` e **não** valem para o `executor`. A primeira é contornada pelo
`INSERT` cru; a segunda não existe para `executor`; a terceira continua verdadeira e é a que salva a
metade boa do desenho. A tabela virou o coração do controle, e o ator do modelo de ameaça desta
camada — o executor não-superusuário, que é quem emitiu os comandos do `PAP-20` e do `PAP-22` —
escreve nela sem passar pelo ato. O que impede isto de ser `ALTO` é que a linha fica visível em toda
rodada seguinte e o `INSERT` deixa `declared_by`; o que impede de ser `BAIXO` é que a linha não veta,
não nomeia o beneficiário, e não há como retirá-la.
CORREÇÃO SUGERIDA: `role_kind='executor'` ganhar condição de permanência verificável (o papel
existir, ser dono de `platform`, e nenhum outro executor declarado ser dono de schema nosso), e a
§7.5.4 afirmar que **toda** declaração tem um `app_role_declared` correspondente — a divergência é
exatamente o `INSERT` fora do ato — dono: `arquiteto-dados`.

### PAP-26 — quatro dos cinco motivos de recusa da §7.4 não têm teste: silenciá-los inteiros deixa a suíte em `95 pass · 0 fail`, saída `0` — [MÉDIO]
ONDE: `db/migrator/src/tenant-role.ts:94-95` (`atributo_indevido`), `:124` (`create_indevido`),
`:125` (`usage_em_platform`), `:115-122` (`heranca_de_outra_credencial`), contra
`db/migrator/test/papel-do-cliente.test.ts` e `test/alcance-e-concedente.test.ts`, onde nenhuma das
quatro frases de `describeState` aparece.
CENÁRIO: medido por mutação no `dist`, sem recompilar. `M3` troca `atributo_indevido` por `false`:
`ALTER ROLE app_t_acme LOGIN` — que sem mutação sai `3` (`S9`) — deixa de ser nomeado, e a suíte sai
`# pass 95 · # fail 0`, **saída `0`**. `M5` silencia as quatro juntas, com o mesmo resultado. O
estado concreto que passa a não ser acusado com `M5`: `GRANT USAGE ON SCHEMA platform` +
`GRANT SELECT ON platform.tenants` ao papel do cliente, medido em `S10` — a credencial assume
`app_t_acme` e lê a carteira de **todos** os clientes (`acme,globex`), e o `verify` mutado diz
"nenhuma diferença". Por contraste, `M1`, `M2` e `M6` — que mexem no que este gate escreveu — são
pegas por um caso cada (45, 47, 43).
POR QUE É REAL: não é hipótese sobre o futuro. Esta camada reabriu **oito** vezes, e sete das oito
correções reescreveram uma consulta desta mesma família. `usage_em_platform` e `atributo_indevido`
são exatamente o tipo de coluna que se perde numa reescrita — `M4`, a primeira versão da minha
mutação, quebrou a consulta por deixar `$1` órfão, o que mostra o quanto o arquivo é uma peça só. O
gate que deveria pegar a perda já foi consertado duas vezes (`PAP-17`, `PAP-23`) e continua sem
cobrar estas quatro. A prova dos cinco predicados que este gate escreveu é boa; a dos quatro que ele
**herdou** não existe.
CORREÇÃO SUGERIDA: um caso por motivo de `divergente`, no molde do caso 45 — o papel do cliente em
estado hostil (`LOGIN`, `CREATE` no próprio schema, `USAGE` em `platform`, herdado por credencial
declarada que não é a do ambiente), cada um com o `3` e a frase — dono: `coder`.

### PAP-27 — o banco sem declaração manda o operador devolver uma posse que já está certa — [BAIXO]
ONDE: `db/migrator/src/schema-universe.ts:172-177` (`describeOwner`) contra
`db/universo-e-declaracao.md:180-186` (a ausência declarada 3, que promete "a saída é uma rodada de
`migrate`").
CENÁRIO: medido (`S14`). Tabela `role_declarations` existindo e **vazia** — o estado do banco
provisionado antes da `0011`, e também o de uma rodada de `migrate` que morra entre a stream
`platform` e `declareArrangement`. O `verify` sai `3` com onze linhas, três delas:

```
dono inesperado: o schema "platform" pertence a "forja_executor", que não é executor declarado …
Devolver a posse é mão humana — ALTER SCHEMA ... OWNER TO <executor>, na conexão de quem pode emiti-lo
```

O dono **já é** o executor. Quem seguir a instrução impressa emite um comando que não muda nada e
continua com o `3`. A saída correta — rodar `migrate`, que declara as duas linhas — está no
documento e **não** está na mensagem.
POR QUE É REAL: é o primeiro `verify` de todo banco existente depois desta migration, e é o estado
que a própria ausência declarada 3 diz que vai acontecer. Custa uma frase agora; custa um operador
perseguindo um fantasma no dia em que acontecer.
CORREÇÃO SUGERIDA: quando `platform.role_declarations` estiver **vazia**, a §7.5.4 dizer isso em vez
de acusar dono e alcance — uma linha "o arranjo ainda não foi declarado: rode `migrate`" cobre os
onze achados de uma vez — dono: `arquiteto-dados`.

---

## 5. Os quatro casos hostis (45–48): quantos atacam?

**Dois atacam o conserto, um ataca meio, e um é de outra espécie — e essa espécie é bem-vinda.** A
régua é a que eu escrevi no gate anterior: exclusão se prova pelo que ela deixa passar, com o
excluído em estado hostil.

- **Caso 45 (`PAP-19` + `PAP-20`)** — `test/exclusao-hostil.test.ts:128-211`. Põe **dois** papéis em
  estado hostil e mede que os dois são acusados, mais o desfazer devolvendo `0` nas duas pontas.
  Excelente contra o mecanismo **velho**. Mas o excluído do mecanismo **novo** é
  `{forja_executor, forja_credencial}`, e nenhum dos dois é posto em estado hostil em lugar nenhum: o
  sósia e a ponte **não estão declarados**. A docstring do arquivo (`:30-32`) diz que o caso cobre
  "o nome declarado com a credencial ainda no grupo … e contra a saída do grupo"; o que o teste faz é
  `REVOKE app_t_hostil_um FROM <sósia>`, que é sair do **papel do cliente**, não do grupo. A saída do
  grupo está coberta — pelo caso 43, que é de outra rodada (medido: `M6` é pego por ele). O `PAP-24`
  mora exatamente no buraco que sobra. **Meio ataque.**
- **Caso 46 (`PAP-22`)** — `:222-281`. Põe o sujeito afirmado em estado hostil de verdade: o dono
  **apaga a própria entrada de ACL** para sumir da pergunta invertida, e a afirmação de posse
  continua acusando; depois se reconcede `USAGE` para provar que a posse é o alcance. **Ataca.**
- **Caso 47 (`PAP-21`)** — `:295-367`. Ataca a exclusão que sobrou ("objeto de extensão cujo dono é
  superusuário") pelo único lado que o ator do modelo alcança: instalando ele mesmo uma extensão
  confiável e pendurando a isca nela. E mede a contraprova que importa — a extensão **sozinha** não
  vira ruído. **Ataca.**
- **Caso 48** — `:376-397`. Não ataca exclusão nenhuma: ataca uma **ausência**, e é a primeira vez
  que esta suíte mede "a pergunta que não pôde ser feita reprova". Espécie diferente, e ela devia
  existir desde o `PAP-17`. **Conta a favor, fora da régua.**

**Contra a rodada anterior**: lá foi um de quatro; aqui são dois inteiros, um meio e um de outra
espécie. A régua pegou. O que ela ainda não produziu é o caso do **excluído legítimo** em estado
hostil — `GRANT forja_credencial TO <papel de fora>` —, que é o `PAP-24` e é a pergunta que a própria
docstring do arquivo se propõe a responder.

---

## 6. Notas — sem cenário, não são achados

- **`PAP-23` fechado, e eu medi os dois lados.** No `scram-sha-256` a suíte agora sai
  `# pass 78 · # fail 1 · # skipped 17`, saída `1`, e a falha é `o piso de medição da suíte`. Limite
  honesto do mecanismo, por leitura de `test/piso-de-medicao.test.ts:40-66`: ele cobra **o servidor**,
  não o **número de pulos**. Um `t.skip` interno — o caso 47 tem um, quando `pgcrypto` não está
  disponível (`:304`) — continua saindo `0`. Sem cenário medido, então nota.
- **A §7.5.2 continua perguntando só por `PUBLIC`** (`tenant-reach.ts:146` e `:150`, `g.grantee = 0`).
  Reincidente da nota do gate anterior (`R13`), e continua sem achado próprio pela mesma razão: o
  objeto em `public` é que é o alcance, e ele tem os seus.
- **A lista de `relkind` da §7.5.3** (`schema-universe.ts:75`) cobre `r,p,v,m,f,S` e deixa de fora
  tipo composto e índice. Nenhum dos dois é canal de dado, e eu não achei um que fosse. Nota.
- **Numeração do contrato íntegra.** §14 vai de 1 a 50, sem buraco e sem duplicata (contado). O caso
  14 é o único sem citação `Caso N` em teste; os outros 49 têm.
- **Os quatro arquivos de horário anterior são coerentes com o resto.**
  `migrations/platform/0010__…sql` (10:18), `src/executor.ts` (10:19), `test/support/postgres.ts`
  (10:22) e `test/recusa-de-borda.test.ts` (10:41) são da rodada anterior. Conferido: os oito códigos
  de evento que o código novo emite estão declarados entre a `0010` (quatro) e a `0012` (quatro), o
  catálogo do banco provisionado bate, e nenhum `kind` do código fica sem linha —
  `platform.executor_events` gravou `app_role_declared`, `executor_role_plural` e
  `privilege_unexpected` nas sondas sem uma queixa de espécie desconhecida. Os códigos de saída
  também batem: `migrate` sem a tabela sai `2` por `executor.ts`, `verify` sai `3`. Nada a corrigir.
- **`S5` é uma boa notícia que vale registrar**: em 16, `CREATEROLE` **não** administra papel que não
  criou. É isso que impede o executor de emitir `GRANT forja_credencial TO <alguém>` sozinho, e é por
  isso que o `PAP-24` precisa da mão do **operador** e não da do executor. Se alguém der `ADMIN
  OPTION` sobre a credencial ao executor "para facilitar a rotação", o `PAP-24` passa a ser
  alcançável por ele. Vale uma linha na §7.2.

---

## 7. Veredito — `T-0009` pode fechar?

**Não.**

O que falta, com tamanho, em ordem de retorno por linha:

1. **`PAP-24`** — *uma consulta*. A §7.5.1 deixar de parar no primeiro nível: fecho transitivo sobre
   `pg_auth_members`, ou uma pergunta nova que afirme os membros de cada papel declarado (o conjunto
   esperado é vazio, o que torna a afirmação trivial de escrever e de ler). Mais um caso de teste com
   o **excluído legítimo** em estado hostil — `GRANT forja_credencial TO <papel de fora>` —, que é o
   caso que a docstring do `exclusao-hostil.test.ts` já promete e não entrega.
2. **`PAP-25`** — *uma condição e uma afirmação*. Condição de permanência para
   `role_kind='executor'`, e a §7.5.4 afirmando que toda declaração tem `app_role_declared` ao lado.
   A segunda parte é o que transforma o `INSERT` cru em achado em vez de silêncio.
3. **`PAP-26`** — *quatro casos de teste*. Um por motivo de `divergente`, no molde do 45. Não segura
   o fechamento sozinho; segura a **conferência** dos dois acima, porque enquanto esses predicados
   não tiverem prova, qualquer reescrita da consulta os leva sem que nada acuse.
4. **`PAP-27`** — *uma frase*. A mensagem do banco sem declaração mandando rodar `migrate` em vez de
   devolver posse.

**O que já pode ser dado por fechado, medido por mim:** `PAP-19` (`S1`), `PAP-20` (`S2`), `PAP-21`
(`S4`), `PAP-22` (`S3`), `PAP-23` (as duas contagens de suíte), e o `PAP-18` continua íntegro.
Nenhum falso positivo: em `S1`–`S4` e `S12`–`S14`, desfazer o estado devolveu `0` em **todas** as
sondas, e o arranjo saudável sai `0` com uma linha só, a do `privilégio inesperado` da §13.4.

**Contagem de reincidência, que continua sendo o sinal sobre o processo — e mudou de sinal.** O crivo
reabriu quatro vezes; a camada de papel, uma; o sexto gate achou duas mais uma extensão; o sétimo
achou três reincidências e um novo, **todas regressões**. Este achou **uma reincidência em classe e
três novos, e nenhuma regressão**: `S1`–`S4` provam que nenhum estado que o código anterior acusava
passou a ser aprovado. A troca de exclusão por identidade foi a primeira correção desta camada que
não abriu o buraco seguinte uma casa ao lado. O `PAP-24` não é o mesmo padrão: ele não nasceu da
correção, ele **sobreviveu** a ela — é a fronteira que as oito rodadas anteriores nunca tocaram,
porque todas discutiam **quem** desculpar e nenhuma discutiu **até onde a pergunta vai**.

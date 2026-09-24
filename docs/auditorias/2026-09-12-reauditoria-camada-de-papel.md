# Auditoria — reauditoria da camada de papel (T-0009)

**Data:** 2026-09-12 · **Agent:** `seguranca` · **Read-only.**
**Escopo:** só o que mudou em `db/**` depois de `docs/auditorias/2026-09-11-gate-final-camada-de-papel.md`
(`PAP-13`…`PAP-18`). Medido: `db/migrator/src/{tenant-reach,tenant-role,run}.ts`,
`src/commands/verify.ts`, `db/migrations/platform/0010__event_kinds_grantor_and_universe.sql`,
`db/migrator/test/alcance-e-concedente.test.ts`, `test/support/postgres.ts`,
`db/papel-do-cliente.md` §7.3/§7.4/§7.7, `db/verificacao-do-papel.md` §7.5.1–§7.5.3,
`db/migrator/CONTRATO.md` §14.

**Fora de escopo, e não reauditado:** `apps/api/**` (fechou no gate anterior, `T-0011` fechada).

**Numeração:** continua em `PAP-19`. Cinco achados: quatro `ALTO`, um `MÉDIO`. Três são
**reincidentes** — de `PAP-13`, `PAP-14` e `PAP-15`, cada um reaberto pela correção do outro.

**Veredito, curto:** `PAP-13` a `PAP-18` estão corrigidos **no caso listado**, e eu medi cada um.
Nenhum dos três primeiros fechou a **classe**: as três correções trocaram a pergunta e conservaram
uma fronteira da pergunta velha, que é exatamente o padrão que o gate anterior extraiu. Quatro
estados novos, todos medidos, em que um papel lê o schema de um cliente e `verify` sai `0`.
**`T-0009` não pode fechar.** Detalhe na §6.

---

## 0. Método

PostgreSQL **16.15** (`postgres:16`, `PostgreSQL 16.15 (Debian 16.15-1.pgdg13+2)`) em dois containers
descartáveis **meus**, criados e removidos ao fim: `forja-audit-pap7` (porta 55442, `trust`) e
`forja-audit-pap7-scram` (porta 55443, `scram-sha-256`). Não usei o Postgres do ambiente do humano
(`devstack-pg`, 5432). Sondas em `scratchpad`; nada escrito na árvore fora deste arquivo e da minha
seção na ficha.

**As duas contagens que o brief exige, medidas por mim, com o `dist/` que a própria suíte compila:**

| Servidor | Resultado | Saída |
|---|---|---|
| `trust` | `# tests 88 · # pass 87 · # fail 0 · # cancelled 0 · # skipped 1` | `0` |
| `scram-sha-256` | `# tests 88 · # pass 75 · # fail 0 · # cancelled 0 · # skipped 13` | `0` |

**Confere com o que o autor mediu, nos dois.** O único pulado no `trust` é o piso de versão
(`sem FORJA_MIGRATOR_TEST_OLD_URL`); os 13 do `scram` são esse mais os **12 da camada de papel**, cada
um com o motivo impresso. `PAP-17` está fechado no mecanismo — e o que ele produz agora é o `PAP-23`.

**Arranjo vivo, montado do zero com o binário real** (`node dist/src/main.js`), não com o arnês de
teste: banco `forja_probe`, grupo `forja_app`, credencial `forja_credencial` (`LOGIN NOINHERIT`),
executor `forja_executor` (`LOGIN CREATEROLE`, **não superusuário**, com `ADMIN OPTION` no grupo e
`CREATE` no banco), os dois `REVOKE` da §7.2 aplicados, dois clientes provisionados pelo comando
(`t_acme`, `t_globex`), uma migration de `tenant` criando `orders`, e uma linha em cada. Estado
inicial: `provision` `0`, `migrate` `0`, `verify` `0`.

| Sonda | Pergunta | Resultado |
|---|---|---|
| `R1` | o arranjo saudável, como o catálogo o vê | **toda** linha de `pg_auth_members` sobre `app_t_*` sai com `inherit_option = f`: credencial `(f,f,t)`, executor `(t,f,f)`. Zero exceção |
| `R2` | `PAP-13` pelo nome do ambiente: `GRANT app_t_acme TO forja_credencial WITH INHERIT TRUE` emitido por `postgres` | `migrate --schema` sai **`3`**, nomeia o concedente e o `REVOKE` dele, **não** imprime "completando o papel de banco", e a linha do executor continua `inherit_option = f`: a recusa é antes da escrita. **Corrigido** |
| `R3` | a mesma sujeira apontada para uma **segunda** credencial do grupo (`forja_credencial_v2`) | ela lê `t_acme` **e** `t_globex` nua; `verify` sai **`0`**; `migrate` sai **`0`**. Só a linha `credencial de aplicação a mais`. É o `PAP-19` |
| `R4` | o mesmo estado com o ambiente nomeando `forja_credencial_v2` | `verify` sai **`3`** nomeando a herança. **Mesmo banco, dois vereditos opostos, decididos pela variável de ambiente** |
| `R5` | contraprova do `R3`: o predicado anterior (`NOT m.admin_option`) veria? | sim — `forja_credencial_v2` aparece nas quatro linhas. O estado saía `3` antes da correção do `PAP-16` |
| `R6` | ponte `NOLOGIN` com `admin_option` no grupo, tudo emitido **pelo executor** não-superusuário | `probe_leitor` (`LOGIN`, fora de todo o arranjo) lê os dois clientes nua; `verify` sai **`0`** e **não nomeia nada**. É o `PAP-20` |
| `R7` | contraprova do `R6` | o predicado anterior listava `probe_ponte` nos dois schemas |
| `R8` | `ALTER SCHEMA t_acme OWNER TO probe_dono` + `GRANT SELECT ON ALL TABLES`, pelo executor | `probe_dono` lê `t_acme.orders`; `verify` **`0`**, `migrate` **`0`**, nada nomeado. É o `PAP-22` |
| `R9` | `CREATE EXTENSION pgcrypto SCHEMA public` por não-superusuário | aceito: extensão confiável, `extowner = forja_executor` |
| `R10` | view em `public` unindo dois clientes | `verify` **`3`**, `public_object_present`. **`PAP-15` corrigido no caso listado** |
| `R11` | `ALTER EXTENSION pgcrypto ADD VIEW public.v_isca` sobre a mesma view | `verify` volta a **`0`**, "nenhuma diferença", e a credencial nua lê `t_acme` pela view. É o `PAP-21` |
| `R12` | `structure_print` exclui objeto de extensão? | **não** (`src/structure-print.ts:42-82`): a fuga do `R11` não alcança schema de cliente |
| `R13` | `USAGE` em `public` concedido a papel **nomeado** em vez de a `PUBLIC` | a §7.5.2 não diz uma palavra: ela só pergunta por `grantee = 0` |

---

## 1. Prioridade um: existe caminho em que um cliente vê dado de outro?

**Sim. Quatro, todos medidos hoje, todos com `verify` saindo `0`, e três deles criados pelas
correções desta rodada.** Item por item:

1. **Consulta que alcança schema de outro cliente?** Sim, por quatro portas novas: `PAP-19` (segunda
   credencial do grupo com concessão herdável), `PAP-20` (ponte `NOLOGIN` com `admin_option` no
   grupo), `PAP-21` (objeto em `public` escondido dentro de extensão) e `PAP-22` (dono do schema).
   Nas quatro, o beneficiário lê **sem assumir papel nenhum** e o comando de verificação sai `0`.
2. **O tenant vem de identidade autenticada?** Inalterado nesta rodada e fora de escopo
   (`apps/api/**`, fechado no gate anterior).
3. **Operação de dados com tenant ausente cai em default?** Não, e piorou num ponto: a pergunta que
   **veta** herança (`heranca_de_outro_concedente`, `credencial_herda`) só existe para o papel que a
   variável de ambiente nomeia. Para qualquer outra credencial do grupo, não há pergunta — não é
   default silencioso, é ausência de pergunta (`PAP-19`).
4. **Id de recurso validado contra o tenant?** O análogo desta camada é a pergunta invertida da
   §7.5.1, e ela agora exclui um **conjunto** em vez de um nome. O `PAP-20` é o IDOR desta camada: a
   exclusão é decidida por dois sinalizadores que o beneficiário carrega (`admin_option` no grupo,
   `rolcanlogin`) e que **o executor concede sozinho**, sem superusuário.
5. **Canal lateral com tenant no escopo?** Sim, um: `public` continua sendo o canal, agora por baixo
   da própria exclusão que a correção do `PAP-15` introduziu (`PAP-21`). `platform.executor_events`
   carrega nome de schema de outros clientes no `detail`, e continua inalcançável pelo papel do
   cliente (`usage_em_platform` é vetado) — sem achado.

**`PAP-13`, `PAP-14` e `PAP-15` fecharam a classe?** Não. Os três fecharam o **caso listado**, e eu
medi os três fechados (`R2`, caso 41 do contrato, `R10`). Nenhum fechou a classe:

| Achado | Caso fechado | Classe que continua aberta |
|---|---|---|
| `PAP-13` | a credencial **do ambiente** herdando por outro concedente | qualquer **outra** credencial do grupo herdando, de qualquer concedente (`PAP-19`) |
| `PAP-14` | `admin_option` sobre `app_t_*` escondendo o beneficiário | `admin_option` sobre **`forja_app`** escondendo o beneficiário — o sinalizador mudou de lugar, não saiu (`PAP-20`) |
| `PAP-15` | objeto em `public` sem dono de extensão | o mesmo objeto **com** dependência de extensão (`PAP-21`); e o dono do schema, que nenhuma pergunta afirma (`PAP-22`) |

---

## 2. Achados

### PAP-19 — a exclusão do `PAP-16` vale para o conjunto, e a pergunta sobre herança vale só para um nome: a segunda credencial do grupo lê todo cliente com `verify` em `0` — [ALTO] — **reincidente de `PAP-13`**
ONDE: `db/migrator/src/tenant-reach.ts:72-76` (a exclusão nova) contra
`src/tenant-role.ts:83-91` (`credencial_herda` e `heranca_de_outro_concedente`, os dois presos a
`$2`), `src/commands/verify.ts:313-324` (a linha que nomeia, sem veto), e
`db/papel-do-cliente.md:352-381`.
CENÁRIO: medido (`R3`, `R4`, `R5`). A rotação da §7.7, exatamente como ela está escrita: o operador
cria `forja_credencial_v2`, `GRANT forja_app TO forja_credencial_v2`, e sobe a aplicação com ela. A
aplicação leva `permission denied for schema t_acme` — a prova E, o mesmo sintoma do `PAP-13` — e o
operador escreve o mesmo reflexo do `PAP-13` na conexão que já tem aberta:
`GRANT app_t_acme TO forja_credencial_v2 WITH INHERIT TRUE`. Resultado medido: `forja_credencial_v2`
lê `t_acme.orders` **e** `t_globex.orders` sem assumir papel nenhum; `verify` sai **`0`** e `migrate`
sai **`0`**; a única linha impressa é `credencial de aplicação a mais`, cujo texto **afirma** que a
§7.5.1 não conta aquele alcance como alcance de terceiro. Com o ambiente nomeando `v2` em vez de
`forja_credencial`, o **mesmo banco** sai `3` e nomeia a herança (`R4`).
POR QUE É REAL: `credencial_herda` e `heranca_de_outro_concedente` filtram por
`m.member = to_regrole($2)`, e `$2` é `FORJA_MIGRATOR_APP_CREDENTIAL_ROLE`. A §7.5.1 deixou de
depender desse nome (`tenant-reach.ts:47-48` declara isso como postura, citando o `PAP-07`) e passou
a excluir o conjunto inteiro; as duas perguntas que **vetam** herança ficaram no nome. Antes da
correção do `PAP-16`, o estado saía `3` pela §7.5.1 — medido no `R5`: a linha de `v2` tem
`admin_option = f` e o predicado anterior a listava nos dois schemas. **É uma regressão: estado que
saía `3` passou a sair `0`.** O que a exclusão nova não distingue é a **forma da concessão**: na §7.3
a credencial recebe `WITH INHERIT FALSE, SET TRUE`, e nada confere isso fora do nome do ambiente.
CORREÇÃO SUGERIDA: nunca excluir da §7.5.1 linha com `m.inherit_option` verdadeiro, seja quem for o
beneficiário — medido no `R1`, num arranjo saudável **toda** membership de `app_t_*` tem
`inherit_option = f`, então o predicado não produz falso positivo — dono: `arquiteto-dados`.

### PAP-20 — o sinalizador que o beneficiário carrega mudou de lugar e continua sendo sinalizador: duas linhas do executor abrem alcance permanente e mudo — [ALTO] — **reincidente de `PAP-14`**
ONDE: `db/migrator/src/tenant-reach.ts:72-76` (o braço `g.admin_option`) contra
`src/tenant-reach.ts:250-258` (`EXTRA_CREDENTIAL_SQL`, que exige `NOT m.admin_option AND
r.rolcanlogin`), e o racional em `src/tenant-reach.ts:26-38`.
CENÁRIO: medido (`R6`, `R7`), **tudo emitido pelo executor, que não é superusuário**:
`CREATE ROLE probe_ponte NOLOGIN` · `GRANT forja_app TO probe_ponte WITH ADMIN OPTION` ·
`GRANT app_t_acme TO probe_ponte` · `GRANT app_t_globex TO probe_ponte` ·
`CREATE ROLE probe_leitor LOGIN` · `GRANT probe_ponte TO probe_leitor`. Resultado: `probe_leitor` —
um papel `LOGIN` que não é membro de `forja_app` nem de papel de cliente nenhum — lê os dois clientes
nua. `verify` sai **`0`** e **não imprime uma linha sobre isso**: a ponte é excluída da §7.5.1 por
ter `admin_option` no grupo, e é ignorada por `EXTRA_CREDENTIAL_SQL` por não ter `LOGIN`.
POR QUE É REAL: o próprio comentário da correção diz que o defeito do `PAP-14` era excluir por
"um sinalizador que qualquer beneficiário pode carregar" em vez de "por um sujeito". A exclusão nova
é composta por **dois sinalizadores** — `admin_option` sobre `forja_app` e `rolcanlogin` — e o
executor concede o primeiro sozinho, porque a §7.2 lhe dá `ADMIN OPTION` no grupo. O braço `LOGIN`
ganhou controle compensatório (a linha `app_credential_plural`); o braço `admin_option` **não ganhou
nenhum**, e a §7.7 declara só o residual do primeiro (`db/papel-do-cliente.md:378-381`). Medido no
`R7`: o predicado anterior listava `probe_ponte` nos dois schemas. Também é regressão.
CORREÇÃO SUGERIDA: a mesma linha do `PAP-19` fecha este (a concessão à ponte nasce com
`inherit_option = t`, medido); e enumerar o braço `admin_option` do grupo como
`EXTRA_CREDENTIAL_SQL` já enumera o braço `LOGIN`, para que a exclusão nunca seja silenciosa —
dono: `arquiteto-dados`.

### PAP-21 — `deptype = 'e'` é controlado por quem ataca: uma linha devolve a `public` a invisibilidade que a §7.5.3 acabou de tirar — [ALTO] — **reincidente de `PAP-15`**
ONDE: `db/migrator/src/tenant-reach.ts:202-203` e `:208-209` (as duas exclusões por `pg_depend`), e a
ausência declarada em `:183-187`.
CENÁRIO: medido (`R9`, `R10`, `R11`). O ator é o mesmo do `PAP-15` — quem consegue criar objeto em
`public`. Ele cria a view de apoio unindo `t_acme` e `t_globex`: `verify` sai `3` e nomeia
(`R10`, a correção funciona). Ele então roda **uma linha a mais**,
`ALTER EXTENSION pgcrypto ADD VIEW public.v_isca`, e `verify` volta a sair **`0`** dizendo
"nenhuma diferença", com a credencial da aplicação lendo `t_acme` pela view — medido, a leitura saiu
`forja_credencial lê t_acme: 1`. E não é privilégio de superusuário: no `R9` o **executor**
não-superusuário criou `pgcrypto` (extensão confiável) e virou dono dela, bastando `CREATE` no banco
— que ele tem — e `CREATE`+`USAGE` em `public`.
POR QUE É REAL: a justificativa escrita para a exclusão é que "quem planta a isca não tem como
pendurá-la numa extensão sem primeiro poder criar extensão, que é privilégio de outro nível"
(`tenant-reach.ts:186-187`). Desde o PostgreSQL 13 extensão confiável **não** é privilégio de outro
nível, e `ALTER EXTENSION … ADD` pede ser dono da extensão e da relação — que é exatamente quem
acabou de criar as duas. A premissa da ausência declarada está errada, e eu a testei nos dois
sentidos. Limite honesto, medido no `R12`: `structure_print` **não** exclui objeto de extensão, então
a fuga não alcança schema de cliente; ela é de `public`, e `public` é onde o `PAP-15` mora.
CORREÇÃO SUGERIDA: não excluir por dependência de extensão, e sim reprovar objeto em `public` cuja
definição referencie schema `t_*` ou `platform` — ou manter a exclusão só para extensão cujo dono
seja superusuário, dizendo isso na §7.5.3 — dono: `arquiteto-dados`.

### PAP-22 — o dono do schema é excluído da pergunta e afirmado por ninguém: duas linhas do executor entregam um cliente a um papel de fora — [ALTO]
ONDE: `db/migrator/src/tenant-reach.ts:63` (`g.grantee <> n.nspowner`) contra `:40-45` (o texto que
descreve este exato caminho) e `src/tenant-reach.ts:189-211` (a §7.5.3, que enumera schema **fora** do
universo e nunca afirma quem é dono dos que estão dentro).
CENÁRIO: medido (`R8`), pelo executor não-superusuário: `CREATE ROLE probe_dono LOGIN` ·
`GRANT probe_dono TO forja_executor` · `ALTER SCHEMA t_acme OWNER TO probe_dono` ·
`GRANT SELECT ON ALL TABLES IN SCHEMA t_acme TO probe_dono`. Depois disso `probe_dono` — fora de
`forja_app`, fora de todo `app_t_*` — lê `t_acme.orders`. `verify` sai `0`, `migrate` sai `0`, nada é
nomeado. O `nspacl` resultante é `{probe_dono=UC/probe_dono,app_t_acme=U/probe_dono}`: a entrada de
`probe_dono` some da pergunta porque a pergunta exclui o dono, e o `USAGE`, que é o ponto de
estrangulamento declarado, vem da própria posse.
POR QUE É REAL: o comentário da correção do `PAP-14` diz, com todas as letras, que
"`ALTER SCHEMA … OWNER TO` move a exclusão sem que nada acuse" — e usa isso como razão para **não**
usar o dono como âncora, mantendo-o como **exclusão** três linhas abaixo. A frase condena o código
que ficou. A §7.5.3 era o lugar natural de fechar (ela é a pergunta sobre o universo, e já lê
`pg_get_userbyid(nspowner)` para o que está **fora**), e ela conservou essa fronteira. Além da
leitura, o dono do schema pode `DROP SCHEMA … CASCADE`: o mesmo estado invisível é caminho de
destruição de dado de um cliente.
CORREÇÃO SUGERIDA: a §7.5.3 afirmar também **quem é dono** de `platform` e de cada `t_*` — um único
sujeito esperado, o mesmo que aplica as migrations — com divergência saindo em `3` —
dono: `arquiteto-dados`.

### PAP-23 — a suíte que prova esta camada passou a sair `0` quando ela não roda — [MÉDIO] — **reincidente em classe de `PAP-17`**
ONDE: `db/migrator/test/support/postgres.ts:196-213` (o guarda) e o efeito medido na §0.
CENÁRIO: medido. Contra um `postgres:16` sem `POSTGRES_HOST_AUTH_METHOD=trust` — o padrão de qualquer
container, e o do ambiente local deste repositório — a suíte sai
`# pass 75 · # fail 0 · # cancelled 0 · # skipped 13`, **saída `0`**. Os 12 pulados são a camada de
papel inteira: os cinco casos do `alcance-e-concedente` e os sete do `papel-do-cliente`. Uma
integração contínua que rode `npm test` contra o container padrão fica verde tendo provado **nada**
sobre isolamento entre clientes, e uma reincidência do `PAP-13`/`PAP-14`/`PAP-15` passa sem acusar.
POR QUE É REAL: antes da correção o mesmo ambiente saía `1` (nove cancelados), e alguém era obrigado
a olhar. A correção trocou o defeito por silêncio verde: o `PAP-17` reclamava que
"`# fail 0` é a linha que se lê primeiro, e ela mentia sobre a camada inteira", e a linha que se lê
primeiro continua dizendo o mesmo — agora com a saída concordando com ela. O motivo impresso está
correto e é honesto; o que falta é alguém cobrar o número.
CORREÇÃO SUGERIDA: a suíte falhar quando o total de pulados exceder o piso conhecido (hoje `1`, o
servidor antigo), ou o comando de gate exigir `FORJA_MIGRATOR_TEST_ADMIN_URL` num servidor `trust` —
dono: `coder`.

---

## 3. Para cada correção: que fronteira da pergunta velha ela conservou?

É o método que o gate anterior extraiu, e ele achou quatro dos cinco achados acima.

| Correção | Pergunta nova | Fronteira conservada em silêncio | Achado |
|---|---|---|---|
| `PAP-13` (recusar por concedente) | "quem concedeu esta herança?" | **de quem** se pergunta a herança: continua só `$2`, o nome do ambiente | `PAP-19` |
| `PAP-14` (âncora no arranjo) | "quem alcança, além do arranjo declarado?" | a exclusão continua decidida por **sinalizador do beneficiário**, e um deles o executor concede | `PAP-20` |
| `PAP-15` (universo declarado) | "existe objeto fora do universo?" | o **dono** dos objetos e schemas que estão **dentro** do universo | `PAP-22` |
| `PAP-15` (exclusão de extensão) | "este objeto veio de extensão?" | "vir de extensão" é atributo **mutável pelo atacante**, não procedência | `PAP-21` |
| `PAP-16` (exclusão pelo conjunto) | "quantas credenciais o grupo aceita?" | **o que** as credenciais do conjunto podem carregar: nada confere a forma da concessão delas | `PAP-19` |
| `PAP-17` (guarda do pulado) | "dá para medir aqui?" | quem cobra que a medição **aconteceu** | `PAP-23` |
| `PAP-18` (numeração) | — | nenhuma. Fechado: §14 vai de 1 a 44, sem buraco, sem duplicata entre arquivos | — |

## 4. Os quatro casos "que atacam o conserto" — atacam?

**Um dos quatro ataca. Os outros três atacam o achado, ou testam o falso positivo em vez do falso
negativo.** É a mesma falha de processo das três rodadas anteriores, uma camada acima, como o brief
suspeitava.

- **Caso 40 (`PAP-13`)** — `test/alcance-e-concedente.test.ts:205-231`. A segunda metade pergunta se
  a condição nova **engole o caso convergível** (duas linhas herdáveis, retira a do operador, a do
  executor volta a convergir). É teste de **falso positivo**. A pergunta que acha o `PAP-19` —
  "quem mais herda o papel, além de `$2`?" — não é feita. **Meio ataque.**
- **Caso 41 (`PAP-14`)** — `:273-315`. Enumera dois membros da exclusão nova: o papel de outro
  cliente (não cabe, continua acusado) e um papel `LOGIN` posto no grupo (cabe, é nomeado). Enumera
  os membros que o autor **pensou**, não a fronteira do predicado que ele **escreveu**: o braço
  `g.admin_option` nunca aparece no teste, e é o `PAP-20`. Pior, a única concessão que ele faz à
  credencial excluída é a legítima, `WITH INHERIT FALSE, SET TRUE` (`:298`) — a forma perigosa,
  `INHERIT TRUE`, não é testada em lugar nenhum, e é o `PAP-19`. **Não ataca o conserto.**
- **Caso 42 (`PAP-15`)** — `:347-366`. A segunda metade acrescenta uma função `SECURITY DEFINER` e um
  schema a mais. Isso é **ampliar a lista de esconderijos da mesma forma**, e é bom — mas a única
  saída que a consulta nova tem é a exclusão por `pg_depend`, e ela não é tocada. **Amplia a lista,
  não ataca o conserto.**
- **Caso 43 (`PAP-16`)** — `:390-434`. Roda a rotação nos dois sentidos, prova que a exclusão é pelo
  conjunto e não pelo nome do ambiente, e prova que sair do grupo devolve a acusação. **Este ataca o
  conserto**, e é o melhor dos quatro. O que ele não pergunta é o que o conjunto excluído pode
  **carregar**.

**A regra que fecharia a classe, uma camada acima da que o gate anterior escreveu:** o caso que ataca
o conserto não é o que enumera quem cabe na condição nova — é o que pergunta **o que quem cabe pode
fazer**. Exclusão se testa com o beneficiário excluído em estado **hostil**, não em estado legítimo.
Três dos quatro casos acima põem o excluído em estado legítimo e verificam que nada acusa, que é
precisamente o desfecho que o defeito produz.

## 5. Notas — sem cenário, não são achados

- **A escolha assimétrica de âncora se sustenta, nos dois lugares, e não achei um terceiro lugar
  errado.** No `PAP-13` a âncora é `current_user` (`tenant-role.ts:90`) e o erro cai em **recusa**:
  conferido por leitura e por medida — a coluna só dispara sobre `inherit_option` verdadeiro, que é
  estado errado em qualquer arranjo (`R1`), então "errar" ali significa recusar um estado que já é
  defeituoso. No `PAP-14` a âncora é o arranjo declarado e o erro cairia em **aprovação**, então
  `current_user` ali produziria o `verify` do operador acusando a frota — o argumento está certo. Os
  outros três usos de `current_user` na camada (`default_acl_de_quem_pergunta` em `:100`,
  `FOR ROLE CURRENT_USER` em `:311`, e `PRIVILEGE_SQL` em `verify.ts:121`) respondem sobre quem
  pergunta, **não vetam**, e o nome de cada um diz isso. Nenhum terceiro lugar errado.
- **O tamanho dos quatro arquivos não é problema de leitura, com uma ressalva.** `verify.ts` (516) é
  o único que cresceu em **superfície de controle**, e o que dificulta a revisão não é o tamanho: é
  que a política de veto de cada uma das oito perguntas está codificada **no ponto de chamada** —
  `differenceFound = (await x()) || differenceFound` veta (`:56`, `:59`, `:65`, `:66`, `:67`, `:76`),
  `await x()` não veta (`:58`, `:60`, `:68`) — e não existe um lugar só onde essa divisão esteja
  escrita. Nas quatro sondas em que medi vazamento, `verify` **imprimiu linhas** e saiu `0`; quem lê
  a saída não tem como saber, sem abrir o código, que aquela linha não veta. Os três arquivos de
  documentação (`papel-do-cliente.md` 406, `CONTRATO.md` 410, `PROVISION-E-VERIFY.md` 411) são
  índices consultados por seção e não pedem leitura contínua: sem ressalva.
- **`PAP-18` fechado e conferido.** §14 vai de 1 a 44 sem buraco; a citação `Caso 35` aparece três
  vezes, todas em `test/crivo.test.ts` e todas sobre os cinco sub-itens do mesmo caso;
  `recusa-de-borda.test.ts:15` passou a citar o 44. Nenhuma citação acima da lista, nenhuma disputa
  entre arquivos.
- **A §7.5.2 só pergunta por `PUBLIC`** (`tenant-reach.ts:139` e `:143`, `g.grantee = 0`). Medido no
  `R13`: `GRANT USAGE ON SCHEMA public TO <papel nomeado>` não produz linha nenhuma. É a condição que
  habilita o `PAP-21` e o `PAP-15`, e ela é invisível quando concedida a um nome em vez de a todos.
  Sem achado próprio porque o objeto em `public` é que é o alcance, e ele tem os seus.
- **A migration `0010` está correta**: alvo `platform`, transacional, `ON CONFLICT DO NOTHING`, quatro
  códigos com descrição que nomeia a seção. Rodou nas minhas duas sondas e no `provision` do zero.

---

## 6. Veredito — `T-0009` pode fechar?

**Não.**

O que falta, com tamanho, em ordem de retorno por linha:

1. **`PAP-19` + `PAP-20`** — *um predicado*. Não excluir da §7.5.1 nenhuma linha com
   `m.inherit_option` verdadeiro, seja quem for o beneficiário. Medido no `R1`: zero falso positivo no
   arranjo saudável. Fecha os dois achados e cobre também o caso original do `PAP-14`. Mais um caso de
   teste com o excluído em estado **hostil** (`INHERIT TRUE` para a segunda credencial) e outro com a
   ponte `NOLOGIN`.
2. **`PAP-22`** — *uma consulta*. A §7.5.3 afirmar o dono de `platform` e de cada `t_*`, divergência
   em `3`. É o mesmo tamanho da afirmação de universo que já está lá.
3. **`PAP-21`** — *uma decisão, depois uma consulta*. Trocar a exclusão por dependência de extensão
   por algo que o atacante não controla. A decisão é de `arquiteto-dados`; a alternativa mais barata
   que medi é exigir que o dono da extensão seja superusuário.
4. **`PAP-23`** — *duas linhas no comando de teste*. Não segura o fechamento sozinho, mas segura a
   **conferência** dos três acima: enquanto o gate puder sair `0` com a camada inteira pulada,
   qualquer correção destas pode ser dada por provada sem ter rodado.

**O que já pode ser dado por fechado, medido:** `PAP-13` no caso da credencial do ambiente (`R2`),
`PAP-15` no caso do objeto sem extensão (`R10`), `PAP-16` na janela de rotação (caso 43, e o `R3`
confirma que `migrate` não trava), `PAP-17` no mecanismo do guarda, `PAP-18` inteiro.

**Contagem de reincidência, que continua sendo o sinal sobre o processo.** O crivo reabriu quatro
vezes; a camada de papel, uma; o sexto gate achou duas mais uma extensão; este achou **três
reincidências e um achado novo**, e três delas são regressões: `PAP-19`, `PAP-20` e `PAP-21` são
estados que o código **anterior** a esta rodada acusava com saída `3` e que o código **desta** rodada
aprova com `0`. A correção de um achado abriu o seguinte em todos os três casos, e as correções foram
escritas na mesma passada, olhando uma para a outra. Não é descuido de quem corrigiu: é que o teste
que acompanha cada correção mede o **desfecho desejado da exclusão**, e exclusão só se prova pelo que
ela deixa passar.

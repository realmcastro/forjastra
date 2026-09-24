# Auditoria — a conferência da credencial na subida (`T-0013` / `F-003`)

**Data:** 2026-09-12 · **Escopo:** `apps/api/src/db/app-credential.ts`,
`apps/api/src/observability/startup-facts.ts`, `apps/api/src/main.ts`,
`apps/api/test/app-credential.test.ts`, `apps/api/test/app-credential-live.test.ts` ·
**Gate 3** (`CLAUDE.md` §4) · **Read-only.**

**Numeração própria: `SUB-01`…`SUB-04`.** Não é continuação da série `PAP-`, que é da camada de papel
do banco. Onde um achado daqui é a mesma classe de um `PAP-`, está dito na linha do título.

**Fora de escopo, e não foi tocado:** `db/**`. A linha de base daquela camada é
`docs/auditorias/2026-09-12-reauditoria-camada-de-papel.md`, e há correção em curso lá.

**Quatro achados: dois `ALTO`, um `MÉDIO`, um `BAIXO`.** Nenhum é desvio da implementação contra a
spec: os cinco casos de aceite do `F-003` foram medidos e os cinco passam. Os dois `ALTO` são estados
em que a credencial alcança schema de cliente **e as quatro perguntas respondem `ok`** — o limite do
que foi perguntado, não erro em como se perguntou.

---

## 0. Método

PostgreSQL **16.15** (`postgres:16`, Debian 16.15-1.pgdg13+2) em container descartável próprio,
`127.0.0.1:55444`, `POSTGRES_HOST_AUTH_METHOD=trust`, **removido ao fim**. O Postgres do ambiente do
humano (5432) não foi tocado.

Arranjo montado à mão, reproduzindo `db/papel-do-cliente.md` §7.2 e §7.3 com **duas mãos** — o
operador (`postgres`) faz a §7.2, o executor (`forja_exec`, `CREATEROLE`, **não superusuário**) faz a
§7.3: grupo `forja_app`, credencial `forja_credencial` (`LOGIN NOINHERIT`), executor `forja_exec`
(membro `WITH ADMIN OPTION`), schemas `t_acme` e `t_globex` com dono `app_t_acme` / `app_t_globex`, e
uma linha em `orders` de cada.

Sonda: um script descartável carregando o `dist` compilado, chamando `assertAppCredential` com um
coletor de fato em memória e, logo depois, tentando ler `t_acme.orders` e `t_globex.orders`
**pelo handle raiz, sem assumir papel**. A sonda foi apagada e o `dist` foi reconstruído e conferido
byte a byte contra a cópia anterior à medição.

| Rodada | Comando | Resultado medido |
|---|---|---|
| `R1` | `npm run typecheck` | saída `0` |
| `R2` | `npm test` sem `FORJA_TEST_DATABASE_URL` | `58 tests · 48 pass · 0 fail · 0 cancelled · 10 skipped`, saída **`0`** |
| `R3` | `npm test` com `FORJA_TEST_DATABASE_URL` (superusuário) | `58 · 58 pass · 0 fail · 0 cancelled · 0 skipped`, saída **`0`** |
| `R4` | `npm test` com banco servido por papel `CREATEROLE` **não** superusuário | `58 · 56 pass · 1 fail · 1 skipped`, saída `1`; falha `XX000 no possible grantors` no caso 4, e o caso 3 pula |
| `R5` | mutação no `dist`: `m.inherit_option` → `false` na consulta, **sem** banco | `58 · 48 pass · **0 fail** · 10 skipped`, saída **`0`** |
| `R6` | a mesma mutação **com** banco | `58 · 57 pass · 1 fail`, saída `1`, `not ok 4 - caso 4` |

**`R2` e `R3` confirmam os dois números do autor, exatos.**

---

## 1. Prioridade um: existe caminho em que um cliente vê dado de outro?

**Sim, dois, e os dois passam pela conferência com veredito `ok` nas quatro perguntas** (`SUB-01` e
`SUB-02`). Nenhum deles é alcançável por requisição de fora: os dois exigem um `GRANT` emitido por
quem já tem poder de conceder no cluster (o operador, ou o **executor**, que não é superusuário).

Respondendo item a item a `seguranca.md` §1:

1. **Consulta que alcança schema de outro cliente?** Sim, por dois estados novos medidos aqui
   (`SUB-01`, `SUB-02`), nenhum deles visto pela conferência. O caminho normal continua fechado: no
   arranjo saudável a credencial nua leva `42501` nos dois schemas (medido).
2. **O tenant vem de identidade autenticada?** Fora deste escopo — a conferência não decide tenant.
   O que ela decide, o papel de banco do processo, vem de `current_user` do catálogo, que o chamador
   HTTP não alcança. Sem achado.
3. **Operação de dados que aceita tenant ausente e cai em default?** Não se aplica. O único default
   na camada nova é o nome do grupo, e ele é constante em código (confirmado, §4).
4. **Id de recurso validado contra o tenant (IDOR)?** Não se aplica: a camada nova não recebe id de
   ninguém. A única entrada é `groupRole`, que `main.ts` não passa.
5. **Canal lateral — cache, fila, log, arquivo temporário, exportação?** O fato de subida é o único
   canal, sai uma vez por processo pela saída padrão, e **não carrega host, porta, banco, senha nem
   o papel que o parâmetro nomeia** — confirmado lendo `startup-facts.ts:52-64` e medindo as quatro
   recusas (§5.3). Sem achado.

---

## 2. Achados

### SUB-01 — privilégio de objeto concedido direto à credencial (ou a `PUBLIC`) põe ela nua dentro do schema de cliente, e as quatro perguntas respondem `ok` — [ALTO] — mesma classe de `PAP-13`

ONDE: `apps/api/src/db/app-credential.ts:114-120` (a quarta pergunta lê **só** `pg_auth_members`) e
`:221-233` (a recusa que dela depende).

CENÁRIO: medido, duas variantes. O estado inicial é o arranjo saudável, em que a credencial leva
`42501 permission denied for schema` nos dois clientes. A aplicação sobe com uma credencial que ainda
não recebeu o papel de um cliente novo e o operador vê no log exatamente esse `42501`. O reflexo
registrado no `PAP-13` é `GRANT app_t_acme TO forja_credencial WITH INHERIT TRUE`, e a conferência
**pega** esse (medido). O reflexo mais comum diante da frase `permission denied for schema t_acme` é
outro:

```
GRANT USAGE ON SCHEMA t_acme TO forja_credencial;
GRANT SELECT ON ALL TABLES IN SCHEMA t_acme TO forja_credencial;
```

Medido depois dessas duas linhas: o servidor **sobe**, emite
`startup_credential_verified` com `{"role":"ok","login":"ok","group":"ok","inheritance":"ok"}`,
`inheritableGrants` sai `[]`, e a credencial **nua, sem assumir papel nenhum**, lê
`t_acme.orders` → `[{"total_cents":111}]`. A segunda variante é `GRANT USAGE ON SCHEMA t_globex TO
PUBLIC; GRANT SELECT ON t_globex.orders TO PUBLIC` — mesmo desfecho, e essa nem nomeia beneficiário.

POR QUE É REAL: `pg_auth_members` guarda concessão de **papel**. `GRANT … ON SCHEMA` e `GRANT … ON
TABLE` moram em `nspacl` e `relacl`, e a consulta não as olha. A propriedade que a quarta pergunta
persegue — "a credencial alcança schema de cliente sem assumir papel" — tem dois mecanismos, e ela
confere um. O dano não é o alcance sozinho: é o fato `startup_credential_verified` **afirmar** que a
pergunta foi respondida com sim. Medida da contenção, que é o que segura a severidade em `ALTO` e não
`CRÍTICO`: dentro da transação com `SET LOCAL ROLE app_t_globex`, a leitura de `t_acme` volta a dar
`42501` — o alcance existe só pelo handle raiz, que a borda não entrega a rota nenhuma.

CORREÇÃO SUGERIDA: ou a pergunta passa a incluir `has_schema_privilege(current_user, nspname,
'USAGE')` sobre os schemas de cliente, ou o texto do fato e da spec declara, com todas as letras, que
alcance por privilégio de objeto **não** é conferido aqui e é do `verify` — dono: `backend` (a
declaração), `produto` (o recorte da spec, se a pergunta crescer).

### SUB-02 — um papel de cliente herdando outro papel de cliente vaza no caminho de requisição, e a conferência sobe verificada — [ALTO]

ONDE: `apps/api/src/db/app-credential.ts:119` (`m.member = (SELECT oid FROM me)` — a pergunta é só
sobre a própria credencial) e `apps/api/src/db/tenant-role.ts:38-45` (o papel assumido por transação,
que é o que passa a herdar).

CENÁRIO: medido, **emitido pelo executor, que não é superusuário**. Uma linha:

```
GRANT app_t_globex TO app_t_acme WITH INHERIT TRUE;      -- aceita para forja_exec
```

Depois dela, a conferência de subida responde `inheritableGrants: []` e o servidor sobe com
`startup_credential_verified`. E então, pelo caminho normal de requisição — a transação que assume o
papel do cliente `acme`:

```
BEGIN; SET LOCAL ROLE app_t_acme;
SELECT total_cents FROM t_globex.orders WHERE id = 1;   -->  222
```

O cliente `acme` lê a venda do cliente `globex`. Sem nenhum erro nosso, sem tocar no código.

POR QUE É REAL: a pergunta sobre herança tem sujeito fixo em `current_user`, e `current_user` na
subida é a credencial. Os papéis que a credencial **assume** ficam fora do sujeito, e são eles que
executam a consulta de negócio. `pg_auth_members` mostra a linha (`app_t_globex | app_t_acme |
forja_exec | inherit_option = t`, medido), então a informação está ao alcance da mesma consulta que
já roda — o que falta é perguntar. A severidade não sobe a `CRÍTICO` porque o estado exige um `GRANT`
de quem administra os papéis de cliente, e não é alcançável por requisição de fora; mas, ao contrário
do `SUB-01`, o alcance está **dentro** do handle que a borda entrega à rota.

CORREÇÃO SUGERIDA: a pergunta primária é do `verify` do executor (dono: `arquiteto-dados`, e é da
mesma família de `PAP-20`/`PAP-22`, fora do escopo deste gate); do lado do servidor, ou a quarta
pergunta passa a cobrir `m.member IN (papéis de cliente que este processo assume)`, ou a spec declara
que herança **entre** papéis de cliente não é conferida aqui — dono: `backend`.

### SUB-03 — sem banco a suíte sai `0` com a consulta ao catálogo nunca executada — [MÉDIO] — **reincidente em classe de `PAP-23` e `PAP-17`**

ONDE: `apps/api/test/app-credential-live.test.ts:28` (`PULAR`) e `apps/api/package.json:12` (o
comando de teste, que não cobra o número de pulados).

CENÁRIO: medido (`R2`, `R5`). Sem `FORJA_TEST_DATABASE_URL` a suíte sai
`58 tests · 48 pass · 0 fail · 10 skipped`, código `0`. Os 14 testes de `app-credential.test.ts`
rodam nesse modo, e a afirmação do autor de que a camada nova não fica sem rodar está **correta na
letra** — mas o que eles exercem é `refusalsAgainst`, `verdictOf` e `AppCredentialError`, que
decidem sobre um `CredentialAnswers` montado à mão. A consulta que produz esse objeto não é executada
por nenhum deles. A prova: mutei `m.inherit_option` para `false` no `dist` — a quarta pergunta passa
a nunca ver herança nenhuma, que é o `PAP-13` reaberto — e a suíte sem banco saiu
`48 pass · **0 fail** · 10 skipped`, código `0` (`R5`). A mesma mutação com banco sai `1 fail`
(`R6`).

POR QUE É REAL: é o defeito que o `PAP-17` nomeou e o `PAP-23` reabriu, agora na camada nova: a linha
que se lê primeiro diz `0 fail`, o código de saída concorda com ela, e a propriedade que a camada
existe para garantir não foi exercida. Uma integração contínua sem banco fica verde tendo provado a
tabela de decisão e nada sobre o catálogo.

CORREÇÃO SUGERIDA: o comando de gate exigir `FORJA_TEST_DATABASE_URL`, ou a suíte falhar quando o
total de pulados exceder um piso declarado — dono: `coder`, na mesma passada do `PAP-23`, que pede a
mesma coisa em `db/migrator`.

### SUB-04 — `FORJA_PG_STATEMENT_TIMEOUT_MS=0` pendura a subida sem porta, sem fato e sem código de saída — [BAIXO]

ONDE: `apps/api/src/config.ts:67` (o `integer` aceita `0`) contra `apps/api/src/main.ts:22-28` (o
`await` da conferência).

CENÁRIO: medido. Segurei `ACCESS EXCLUSIVE` em `pg_catalog.pg_auth_members` por 30 s e subi o
servidor. Com o padrão (`5000`), a conferência falha em **5,5 s** com `57014` e o processo sai `78`
(medido) — o `statement_timeout` viaja no pacote de inicialização do `pg`
(`node_modules/pg/lib/client.js:558-560`), então **vale já na primeira consulta** e não há intervalo
descoberto. Com `FORJA_PG_STATEMENT_TIMEOUT_MS=0`, que o Postgres lê como "sem limite", o processo
ficou **22 s pendurado, porta `39999` fechada em todas as sondagens, nenhum fato emitido**, e só
terminou porque eu o matei (código `124`).

POR QUE É REAL: falha fechado — nada é atendido —, mas fica **invisível**. Um supervisor que reinicia
por término de processo espera para sempre, e um que decide por porta aberta nunca chega a decidir.
Nenhum fato de recusa sai, então a janela de indisponibilidade é o silêncio que o `F-003` foi escrito
para eliminar. `0` como "sem limite" é a convenção do Postgres e o `integer` de `config.ts` a aceita
sem comentar.

CORREÇÃO SUGERIDA: recusar `0` nos três tempos de banco em `loadConfig`, ou dar à conferência um
limite próprio no processo — dono: `backend`.

---

## 3. As três perguntas do brief

**1. A mensagem de recusa vaza algo do arranjo de isolamento?** Ela nomeia, no caso de herança, cada
concessão **feita à própria credencial** e quem a emitiu (`app-credential.ts:225-226`), e nada além:
não lista quem mais é membro do grupo, não lista schemas, não lista outras credenciais. Confirmei
lendo e medindo as quatro recusas. **Julgo que não é achado, e que a escolha está certa**, por três
razões. A informação sai por `stderr` na subida, para quem já controla o processo e, por consequência, a própria `FORJA_DATABASE_URL` — quem lê essa saída já pode perguntar ao catálogo o que
quiser. O que ela nomeia é o mínimo acionável, e o custo de omiti-lo foi medido no gate anterior
(`Q5`): sem o concedente, o `REVOKE` óbvio apaga a linha legítima e deixa a herdável de pé, o que
**piora** o estado. E o limite que importa está respeitado: o teto de cinco nomes
(`app-credential.ts:136-144`, medido no teste de nove concessões) impede que a recusa vire um censo
dos clientes do cluster. Nota, não achado: os nomes são `app_t_<slug>`, e o slug é o nome do cliente;
se algum dia essa saída for agregada num destino com leitores diferentes dos do banco, a conta muda.

**2. O sujeito `current_user` fecha o caso do papel pré-assumido?** **Sim, e eu ataquei por dois
caminhos diferentes, os dois fechados.** Com `options=-c role=app_t_acme` na URL, a conferência
recusa com `[role] a conexão entrou como "forja_credencial" e está como "app_t_acme"` (medido). Com
`ALTER ROLE forja_credencial SET role = 'app_t_acme'`, que é o caminho que não passa pelo parâmetro e
seria o jeito de contornar uma conferência que só olhasse a URL, a recusa é a mesma (medido). Nos
dois casos a sessão de fato alcançava `t_acme.orders` nua, e o servidor não subiu. Ataquei também
a terceira variante, `ALTER ROLE forja_credencial INHERIT`, que em teoria reabriria a herança de todas
as concessões existentes: em 16 a herança é propriedade de cada linha de `pg_auth_members`, o atributo
do papel só serve de padrão para concessões novas, e o alcance **não** mudou (medido, `42501` nos dois
schemas). A decisão de conferir `session_user` junto está certa e é barata.

**3. A consulta precisa de limite de tempo próprio?** **Não, com uma ressalva que virou `SUB-04`.**
Os dois intervalos estão cobertos por parâmetro de sessão, e medi os dois: `connectionTimeoutMillis`
fecha o handshake que não completa (subi um listener TCP que aceita e nunca fala — a porta HTTP
`39999` ficou fechada nas seis sondagens de um em um segundo, e o processo saiu `78`), e
`statement_timeout` fecha a consulta que não volta (`57014` em 5,5 s com a tabela travada). Como o
`pg` envia `statement_timeout` no pacote de inicialização, não existe a janela em que a primeira
consulta correria sem limite. O que falta é recusar o valor `0`.

---

## 4. As duas afirmações do autor

**"O nome do grupo é constante em código, nunca ambiente." — confirmada.** `APP_GROUP_ROLE`
(`app-credential.ts:55`) não é lido de ambiente em lugar nenhum: `grep` por `process.env` em
`apps/api/src` devolve **uma** ocorrência, `config.ts:57`, e `loadConfig` não tem chave de grupo
(`config.ts:57-72`). O parâmetro `groupRole` tem exatamente um chamador de produção,
`main.ts:23`, que o **omite**; os outros seis chamadores são os testes vivos. Nenhuma chave de
ambiente nova entrou no arquivo de exemplo. O invariante do `F-003` — "não existe chave de ambiente
que desliga a conferência" — está cumprido, e o argumento do autor sobre por que o nome não pode vir
do ambiente é o correto.

**"Esta conferência cobre o `PAP-19` para a credencial que o processo usa." — confirmada, e o limite
que ela declara é o limite certo.** Montei o `PAP-19`: criei `forja_credencial_v2`, `GRANT forja_app
TO forja_credencial_v2`, `GRANT app_t_acme TO forja_credencial_v2 WITH INHERIT TRUE` — a rotação da
§7.7 com o reflexo do `PAP-13`. Medido: o servidor apontado para `v2` **não sobe**, e a recusa nomeia
`app_t_acme (concedido por postgres)`; o servidor apontado para a credencial antiga **sobe**, e está
certo, porque ela continua sem alcançar nada (`42501` nos dois schemas, medido). A diferença para o
`verify`, que erra nesse mesmo estado, é que aqui o sujeito não é um nome de ambiente: é quem a
conexão **é**. O que fica de fora é credencial que nenhum processo nosso usa, e isso é a pergunta
invertida do `verify`, corretamente declarada fora de escopo.

---

## 5. Recusa, disponibilidade e o fato de subida

**5.1 Existe caminho em que o processo continua atendendo depois de decidir recusar?** **Não, e eu
medi em vez de ler.** Por construção, `main.ts` faz `assertAppCredential` (`:23`) antes de
`buildServer` (`:30`), de `app.listen` (`:51`) e do registro dos handlers de sinal (`:48-49`) — não há
`listen` anterior a desfazer, promessa não aguardada, nem handler pendente. Medido em quatro estados
(superusuário, executor, papel inexistente, banco fora do ar): saída `78` nos quatro, e o processo
terminou sozinho em menos de um segundo, sem `process.exit`. E no estado em que a recusa **demora**,
que é onde um `listen` prematuro apareceria, sondei a porta `39999` a cada segundo durante os seis
segundos da conferência pendurada: **fechada em todas**. `process.exitCode` com o pool destruído
antes (`main.ts:26`) drena o laço e termina; não observei nenhuma saída truncada.

**5.2 "Sem banco, o processo não sobe" é melhoria ou negação de serviço nova?** **Melhoria, e não
achei caminho em que alguém de fora provoque a recusa.** O que mudou é que um servidor sem banco
deixa de responder `/health` com `ok`, e um `/health` que diz `ok` quando nenhuma rota de negócio
funciona é pior que a ausência dele: é a porta pela qual um balanceador manda tráfego real para um
processo que só sabe recusar. Quem provoca a recusa é quem controla a `FORJA_DATABASE_URL` ou a rede
entre o processo e o banco, e nenhum dos dois é o chamador HTTP — não há entrada de requisição no
caminho, porque a porta ainda não abriu. O custo real é operacional e vale registrar: com o banco
indisponível, **nenhum processo novo sobe**, então um reinício durante um blip de rede não volta.
Isso é a escolha certa (falha fechado) e é consequência declarada, não defeito. `SUB-04` é o único
lugar onde essa recusa fica invisível.

**5.3 O fato de subida carrega dado sensível?** **Não** — confirmado lendo `startup-facts.ts:52-64`,
que é a definição inteira do que sai: `factId`, `kind`, `occurredAt`, `currentRole`, `sessionRole`,
`groupRole`, `verdict`. Não há campo para host, porta, banco, senha, nem para o papel que a URL
nomeia. Confirmado também nas quatro saídas medidas, inclusive nas duas em que a pergunta nem chegou
ao servidor, onde os dois papéis saem `(desconhecido)` e o veredito inteiro sai `unanswered`. O
tratamento de erro de `describeQueryFailure` (`app-credential.ts:278-289`) mantém a mensagem do `pg`
fora do texto e deixa só o código: medi `ECONNREFUSED`, `28000`, `57014` — nenhum deles carrega
endereço. O contador de `emitStartupFact` (`:91-105`) não lança, então o destino quebrado não derruba
a recusa que ele descreve (provado no teste sem banco, e a mecânica é a correta).

---

## 6. Notas — sem cenário de exploração, não são achados

- **O diagnóstico do timeout de conexão é fraco.** No estado em que o servidor aceita TCP e não
  completa o handshake, o erro do `pg` não tem `code`, e `describeQueryFailure` cai no `error.name`:
  a recusa sai `(Error)`, que não distingue nada. Medido. Não vaza, e não muda o desfecho.
- **Se `rootDb.destroy()` lançar no `catch` de `main.ts:26`, a recusa original é perdida**: o erro que
  propaga deixa de ser `AppCredentialError`, a saída vira `1` em vez de `78` e a mensagem que nomeia
  a pergunta que falhou não é impressa. Continua fechado (nada é atendido). Não consegui construir um
  estado em que `pool.end()` lance, então fica como nota.
- **O caso 3 do teste vivo pula em silêncio quando o banco de teste não é servido por superusuário**
  (medido em `R4`). Hoje isso não produz silêncio verde porque o caso 4 falha ruidosamente no mesmo
  ambiente (`XX000 no possible grantors`, saída `1`) — mas quem consertar o caso 4 para tolerar
  `CREATEROLE` precisa lembrar que o 3 passa a pular sozinho. É `SUB-03` visto por outro ângulo.
- **A recusa sai por `stderr` e o fato por `stdout`**, e o fato não carrega a razão, só o veredito.
  Quem coletar apenas a saída padrão sabe **qual** pergunta falhou e não sabe **por quê**. É coerente
  com a lista "Não registra" do `F-003` e com `D-06` aberta; vale saber quando a trilha ganhar
  residência.

---

## 7. Veredito — `T-0013` pode fechar?

**Não ainda.** Nada do que falta é mecanismo novo, e a implementação faz o que a spec pediu: medi os
cinco casos de aceite do `F-003` e os cinco passam, o invariante de não haver chave de escape está
cumprido, a recusa é fechada e o fato de subida não carrega nada sensível. O que segura são dois
estados medidos em que o fato diz `verified` sobre uma propriedade que não foi conferida, e uma
suíte que fica verde sem exercer a consulta.

| O que falta | Tamanho | Dono |
|---|---|---|
| `SUB-01` — decidir entre incluir `has_schema_privilege` na consulta (uma cláusula, mais o schema de onde vem a lista de clientes) **ou** declarar no fato e na spec que alcance por privilégio de objeto não é conferido aqui | uma cláusula de SQL, ou um parágrafo | `backend`; `produto` se a pergunta crescer |
| `SUB-02` — o mesmo, para herança **entre** papéis de cliente. A correção primária é do `verify`, e é da família de `PAP-20`/`PAP-22`, portanto fora deste gate; aqui basta não afirmar cobertura que não existe | um parágrafo, ou um predicado a mais | `backend` (declaração); `arquiteto-dados` (o `verify`) |
| `SUB-03` — o gate exigir `FORJA_TEST_DATABASE_URL`, ou a suíte cobrar o número de pulados | duas linhas no comando de teste | `coder`, junto com `PAP-23` |
| `SUB-04` — recusar `0` nos tempos de banco em `loadConfig` | uma condição | `backend` |

**`SUB-03` e `SUB-04` não seguram sozinhos.** O que segura é o par `SUB-01`/`SUB-02`, e ele pode ser
fechado pelo caminho barato: se a decisão for manter as quatro perguntas como estão — o que é
defensável, porque alcance de terceiro é a pergunta do `verify` —, então o que falta é **uma frase no
lugar certo** dizendo o que `startup_credential_verified` não verificou. A alternativa cara, crescer
a pergunta, mexe na lista "Não registra" do `F-003` e é decisão de `produto`, não de auditoria.

O que **não** encontrei, e vale dizer porque é onde esta classe de controle falhou oito vezes do
outro lado da parede: a conferência **não** exclui ninguém por propriedade que o excluído carrega. Ela
não tem lista de isenção, não tem nome de ambiente como sujeito, não tem sinalizador que o atacante
se concede. O sujeito é `current_user` conferido contra `session_user`, e os dois vêm do servidor.
Foi por isso que os ataques `options=-c role=`, `ALTER ROLE … SET role` e `ALTER ROLE … INHERIT`
falharam contra ela, e é por isso que ela cobre o `PAP-19` que o `verify` não cobre. O limite dela é
de **alcance da pergunta**, não de **quem responde** — que é uma classe melhor de limite, porque se
fecha com uma cláusula e não com um redesenho.

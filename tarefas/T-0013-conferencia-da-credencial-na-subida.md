---
id: T-0013
backlog: F-003
titulo: apps/api confere a própria credencial na subida
status: aberta
escopo: cliente=- vertical=- modulo=- camada=backend+seguranca
aberta_em: 2026-09-12
---

## Pedido

Recomendação do gate final de 2026-09-11 (§3, ponto 1), virada em item `F-003` pelo `produto`.

O servidor sobe confiando no que `FORJA_DATABASE_URL` aponta. Do lado do banco existe um estado
herdável (`PAP-13`, e depois `PAP-19`) que torna a credencial da aplicação capaz de alcançar schema
de cliente **sem assumir papel** — e esse estado é invisível do lado do servidor, que é onde ele
custa. O executor já faz a pergunta equivalente sobre o parâmetro dele e falha fechado; o servidor
não faz.

## Plano

Sem Plano de Despacho: um agent (`backend`), uma camada. O gate 3 de `seguranca` **se aplica** pelo
que a mudança protege (escopo de tenant), e roda no fim — está declarado no próprio item.


## backend — 2026-09-12

### O que passou a existir

`apps/api` pergunta ao catálogo, na subida e antes de `listen`, sobre o papel a que a própria
conexão pertence de fato. Quatro perguntas, uma consulta, um fato de subida, e recusa com saída
`78` em qualquer divergência.

```
loadConfig → createPool → createRootDb
→ assertAppCredential   ← a porta não abre antes daqui
→ buildServer → listen
```

A consulta é a primeira ida ao banco do processo, então ela também cobre o caso em que o banco
sequer responde: antes, isso aparecia na primeira requisição de um caixa.

### As cinco respostas possíveis, e o que cada uma faz

| Estado | Pergunta que falha | Desfecho |
|---|---|---|
| credencial de `db/papel-do-cliente.md` §7.2 | nenhuma | sobe, `/health` responde |
| ambiente apontando para o executor | `group` (tem `ADMIN OPTION`) | não sobe, saída `78` |
| ambiente apontando para superusuário | `group` (não é membro) + nomeia o superusuário | não sobe, saída `78` |
| concessão herdável à credencial | `inheritance` | não sobe, nomeia a concessão **e o concedente** |
| grupo inexistente | `group` | não sobe, manda rodar a §7.2 inteira |
| catálogo não respondeu | `query` | não sobe; o veredito das quatro fica `unanswered` |

### Decisões

- **O nome do grupo é constante em código** (`APP_GROUP_ROLE = 'forja_app'`), como no executor.
  Chave de ambiente para ele seria chave de escape com outro nome: aponta-se a pergunta para um
  grupo que se controla e ela passa a responder sim sobre nada.
- **`current_user` é o sujeito, e `session_user` é conferido junto.** Conexão que chega com papel
  já assumido faria as outras três perguntas responderem sobre um papel que não autenticou.
- **Saída `78` (`EX_CONFIG`) para toda recusa**, a mesma da configuração ausente: os dois desfechos
  se fecham com a mesma classe de ato humano, e a conferência nem sempre separa "chave errada" de
  "ato do operador faltando". Quem separa é a mensagem.
- **`process.exitCode`, não `process.exit`**, no caminho de recusa: o fato de subida acabou de sair
  pela saída padrão, e o Node documenta que `process.exit` pode truncar escrita pendente ali
  (documentação, não medição minha). O pool é destruído antes,
  para o laço de eventos drenar.

### Verificação

Tudo medido em 2026-09-12, PostgreSQL **16.15** em container descartável próprio
(`postgres:16`, porta 55433, `trust`), criado e **removido ao fim** — não usei o Postgres do
ambiente do humano.

| O que rodei | Resultado |
|---|---|
| `npm run typecheck` | saída `0` |
| `npm test` sem banco | `58 tests · 48 pass · 0 fail · 0 cancelled · 10 skipped`, saída `0` |
| `npm test` com `FORJA_TEST_DATABASE_URL` | `58 tests · 58 pass · 0 fail · 0 cancelled · 0 skipped`, saída `0` |
| `node dist/src/main.js` apontado para `postgres` | não subiu, saída `78`, recusa nomeando o superusuário |
| `node dist/src/main.js` apontado para o executor | não subiu, saída `78`, recusa nomeando `ADMIN OPTION` |
| `node dist/src/main.js` apontado para papel inexistente | não subiu, saída `78`, `query` com `28000` e sem host no texto |
| `node dist/src/main.js` com a credencial correta | subiu, `startup_credential_verified`, `/health` → `200` |

Os 10 testes vivos são os 5 de `tenant-role-live` mais os 5 casos do `F-003`. A camada nova também
tem 14 testes que **não** precisam de banco, então ela roda nos dois modos.

## seguranca — 2026-09-12

## RELATÓRIO — seguranca — T-0013
STATUS: PARCIAL
FEITO:
- Auditei o gate 3 sobre `app-credential.ts`, `startup-facts.ts`, `main.ts` e os dois testes novos.
  Relatório em `docs/auditorias/2026-09-12-conferencia-da-credencial-na-subida.md`, numeração
  `SUB-01`…`SUB-04` (própria, não continua a série `PAP-`).
- Montei o arranjo de `db/papel-do-cliente.md` §7.2 e §7.3 com duas mãos (operador e executor
  `CREATEROLE` não superusuário) em PostgreSQL 16.15 descartável próprio, `127.0.0.1:55444`,
  removido ao fim. O Postgres do humano (5432) não foi tocado.
- Ataquei as quatro perguntas por oito caminhos. Cinco falharam contra a conferência (`options=-c
  role=`, `ALTER ROLE … SET role`, `ALTER ROLE … INHERIT`, herança transitiva pelo grupo — recusada
  pelo próprio servidor como ciclo —, e o `PAP-19` na credencial do processo). **Três passaram**, e
  dois viraram achado `ALTO`.
- Confirmei os dois números da suíte, exatos, e provei por mutação que o modo sem banco não exerce
  a consulta ao catálogo.
ARQUIVOS:
- `docs/auditorias/2026-09-12-conferencia-da-credencial-na-subida.md` (novo)
- `tarefas/T-0013-conferencia-da-credencial-na-subida.md` (editado — só esta seção)
- `apps/api/src/db/app-credential.ts`, `apps/api/src/observability/startup-facts.ts`,
  `apps/api/src/main.ts`, `apps/api/src/config.ts`, `apps/api/src/db/pool.ts`,
  `apps/api/test/app-credential.test.ts`, `apps/api/test/app-credential-live.test.ts` (só leitura)
NÃO FEITO: `T-0013` não pode fechar ainda. Quatro itens, nenhum de mecanismo novo, com tamanho na §7
  do relatório: `SUB-01` e `SUB-02` (uma cláusula de SQL **ou** uma frase declarando o que
  `startup_credential_verified` não verificou) seguram o fechamento; `SUB-03` e `SUB-04` não seguram
  sozinhos.
DECISÕES:
- Classifiquei `SUB-01` e `SUB-02` como `ALTO`, não `CRÍTICO`, apesar de os dois alcançarem schema de
  cliente: os dois exigem um `GRANT` de quem já administra papéis no cluster e nenhum é alcançável por
  requisição de fora. `SUB-01` fica contido fora da transação (medido: com o papel do outro cliente
  assumido, volta `42501`); `SUB-02` **não** fica, e é por isso que os dois empatam em vez de o
  primeiro ser maior.
- Não classifiquei a mensagem de recusa como achado. Ela nomeia o concedente de propósito, o custo de
  omiti-lo foi medido no `Q5` do gate anterior, e o teto de cinco nomes impede que ela vire censo de
  clientes. Vai como nota, com o limite de quando isso mudaria.
- Não reauditei `db/**`, como o brief pediu. `SUB-02` toca a fronteira: a correção primária é do
  `verify`, e a registro nomeando o dono sem entrar lá.
RISCOS:
- `SUB-04` é em `apps/api/src/config.ts:67`, que não é arquivo novo desta tarefa. Entrou porque a
  pergunta 3 do brief é exatamente sobre ele.
- O caso 4 do teste vivo exige banco servido por superusuário: com `CREATEROLE` apenas, ele falha com
  `XX000 no possible grantors` (medido). Quem tolerar `CREATEROLE` depois precisa lembrar que o caso 3
  passa a pular sozinho.
PERGUNTAS:
  - para produto: fechar `SUB-01`/`SUB-02` pela frase (declarar o que a conferência não confere) ou
    pela cláusula (crescer a pergunta)? A segunda mexe na lista "Não registra" do `F-003`, que é sua.
VERIFICAÇÃO: tudo medido em 2026-09-12, PostgreSQL 16.15 em container próprio removido ao fim.
  `npm run typecheck` → `0`. `npm test` sem banco → `58 tests · 48 pass · 0 fail · 0 cancelled ·
  10 skipped`, saída `0` (confere com o relatado). Com banco superusuário → `58 · 58 pass · 0 fail ·
  0 cancelled · 0 skipped`, saída `0` (confere). Com banco `CREATEROLE` não superusuário → `56 pass ·
  1 fail · 1 skipped`, saída `1`. Mutação `m.inherit_option → false` no `dist`: sem banco
  `48 pass · 0 fail`, saída `0`; com banco `1 fail`, saída `1`. `main.js` medido em cinco estados
  (credencial correta com `/health` `200`; superusuário, executor, papel inexistente e banco fora do
  ar, os quatro saída `78`). Porta HTTP sondada a cada segundo durante conferência pendurada:
  fechada nas seis. `statement_timeout` com `pg_auth_members` travada: `57014` em 5,5 s, saída `78`;
  com `FORJA_PG_STATEMENT_TIMEOUT_MS=0`: 22 s pendurado, porta fechada, nenhum fato, morto por mim.
  A sonda descartável foi apagada e o `dist` reconstruído e conferido contra a cópia anterior.
MEMÓRIA SUGERIDA:
  - type=gotcha escopo=plataforma slug=quatro-perguntas-da-subida-nao-veem-privilegio-de-objeto —
    `pg_auth_members` guarda concessão de papel; `GRANT USAGE ON SCHEMA` mora em `nspacl` e é
    invisível à conferência de subida, que sobe com `verified`.
  - type=gotcha escopo=plataforma slug=heranca-entre-papeis-de-cliente-vaza-no-caminho-de-requisicao —
    `GRANT app_t_b TO app_t_a WITH INHERIT TRUE`, uma linha do executor, faz o cliente A ler o schema
    de B dentro da transação que assume o papel de A.
  - type=convention escopo=processo slug=mutacao-prova-que-o-teste-pulado-nao-cobre — desligar a
    propriedade no artefato compilado e rodar a suíte é o jeito barato de provar que `0 fail` sem
    banco não prova a camada.
PRÓXIMO PASSO SUGERIDO: `backend` — fechar `SUB-01`, `SUB-02` e `SUB-04`, depois de `produto`
  responder se a pergunta cresce ou se o limite é declarado.

## backend (segunda rodada) — 2026-09-12

Fechamento de `SUB-01`, `SUB-02`, `SUB-03` e `SUB-04` do gate 3. A decisão do humano foi **pela
cláusula**, não pela frase: declarar o limite num parágrafo deixaria de pé um vazamento medido, e o
`SUB-02` vaza **dentro do handle que a borda entrega à rota**.

### As quatro perguntas viraram seis

```
credencial do processo
→ quem ela é    : role · login · group · inheritance   (as quatro de antes)
→ o que alcança : reach · assumed                      (SUB-01 e SUB-02)
→ recusa: saída 78, porta nunca aberta, fato nomeando a pergunta
```

- **`reach`** — `has_schema_privilege(current_user, n.oid, 'USAGE'|'CREATE')` sobre
  `nspname LIKE 't\_%'`. Fecha as duas variantes do `SUB-01`, inclusive a que concede a `PUBLIC` e
  não nomeia beneficiário nenhum. Medido: no arranjo íntegro da §7.3 (`WITH INHERIT FALSE, SET TRUE`)
  a função responde `f` para o schema do próprio cliente, porque ela responde por privilégio
  **herdado** — é exatamente a propriedade "alcança sem assumir papel".
- **`assumed`** — para todo papel que este processo consegue assumir
  (`pg_has_role(current_user, …, 'SET')`), as concessões herdáveis **daquele papel**. Fecha o
  `SUB-02`. O sujeito deixou de ser só `current_user`, que era o buraco.

O universo de cada uma é o conjunto que o sistema protege (`t\_%`, o mesmo do `verify`; papéis que
este processo assume), nunca um atributo que o beneficiário carrega. A única exclusão é a própria
credencial na sexta pergunta, porque a quarta já responde por ela — identidade que nós escrevemos.

### O que ficou declarado fora, com medida

- **Concessão entre papéis de cliente só com `SET`, sem `INHERIT`.** Medido: a transação que assume
  `app_t_a` leva `42501` no schema de `b`; só alcança quem assumir o **segundo** papel na mesma
  transação, e `tenant-role.ts` assume um só, formado no contexto da borda. A linha aparece na
  pergunta invertida do `verify` (§7.5.1).
- **Grupo herdando papel de cliente** não existe: o servidor recusa como ciclo
  (`role "app_t_globex" is a member of role "forja_app"`, medido).
- **Mudança depois da subida** e **credencial que nenhum processo nosso usa** continuam do `verify`.

### `SUB-03` — o gate exige banco, e exige zero pulados

Escolhi a primeira das duas saídas do relatório, e mais uma cláusula: `npm test` **falha** sem
`FORJA_TEST_DATABASE_URL`, e reprova se **qualquer** teste pular. Piso de pulados envelhece — vira o
número que alguém ajusta quando incomoda — e deixaria o modo sem banco continuar saindo `0`, que é o
silêncio verde do achado. O modo parcial virou `npm run test:no-db`, bandeira de linha de comando e
nunca variável de ambiente, e ele diz em voz alta o que não exercitou.

Provado por mutação, com banco: `m.inherit_option → false` derruba o caso 4; `has_schema_privilege →
false` derruba os casos 6 e 7; `pg_has_role(…, 'SET') → false` derruba o caso 8. Sem banco, o gate
nem começa.

### `SUB-04` — `0` não é tempo

`loadConfig` recusa `0` nas três chaves de tempo de banco. Medido antes: 12 s pendurado, porta
fechada em todas as sondagens, nenhum fato, nenhum código de saída. Depois: recusa em 475 ms com
saída `78` e a mensagem dizendo por que `0` não é um valor.

### O caso 4 do teste vivo, que quebrava com executor não-superusuário

Era defeito de montagem, e a causa é de 16: o criador de um papel recebe `admin_option` e **não**
recebe `set_option` (medido), então um operador `CREATEROLE` não-superusuário não tem como conceder
o papel que o executor criou — `XX000 no possible grantors`. A segunda mão do `PAP-13` passou a ser
um papel próprio (`forja_mao_probe_*`, `LOGIN NOINHERIT`, com `ADMIN OPTION` sobre o papel do
cliente concedido pelo executor), e não o operador: `GRANT … TO <operador> WITH ADMIN OPTION`
emitido pelo executor leva `0LP01 ADMIN option cannot be granted back to your own grantor` quando o
operador é quem criou o executor. O cenário sempre foi sobre **duas mãos com poder de conceder**,
não sobre superusuário.

O caso 3 passou a **falhar**, em vez de pular, quando o banco de teste não é servido por
superusuário: pulo silencioso em modo de gate é o `SUB-03` por outro caminho.

## RELATÓRIO — backend — T-0013
STATUS: OK
FEITO:
- Cresci a pergunta de subida de quatro para seis. `reach` (`SUB-01`) pergunta
  `has_schema_privilege(current_user, n.oid, 'USAGE'|'CREATE')` sobre `nspname LIKE 't\_%'`;
  `assumed` (`SUB-02`) pergunta as concessões herdáveis de **todo papel que este processo consegue
  assumir** (`pg_has_role(current_user, …, 'SET')`). O veredito do fato de subida ganhou as duas.
- Reproduzi `SUB-01` (duas variantes), `SUB-02` e `SUB-04` contra o servidor **antes** e **depois**.
  Antes: os três estados subiam (`SUB-01`/`SUB-02`, `/health` → `200`, `verified`) ou penduravam
  (`SUB-04`). Depois: recusa com saída `78`, porta fechada, fato nomeando a pergunta.
- `SUB-03`: `npm test` virou gate — exige `FORJA_TEST_DATABASE_URL` e reprova se **qualquer** teste
  pular. O modo sem banco é `npm run test:no-db`, bandeira de linha de comando, nunca variável de
  ambiente. Provei por três mutações no `dist` que o gate pega o que a suíte sem banco não pegava.
- `SUB-04`: `loadConfig` recusa `0` nas três chaves de tempo de banco, com a razão na mensagem.
- Consertei a montagem do caso 4 do teste vivo (`XX000 no possible grantors` com executor
  não-superusuário) e transformei o pulo silencioso do caso 3 em falha nomeando o que falta.
ARQUIVOS:
- `apps/api/src/db/credential-query.ts` (novo — a consulta saiu de `app-credential.ts`)
- `apps/api/test/config.test.ts` (novo) · `apps/api/scripts/run-tests.mjs` (novo)
- `apps/api/src/db/app-credential.ts`, `apps/api/src/config.ts`,
  `apps/api/src/observability/startup-facts.ts`, `apps/api/test/app-credential.test.ts`,
  `apps/api/test/app-credential-live.test.ts`, `apps/api/package.json`, `apps/api/README.md`
  (editados)
- `tarefas/T-0013-conferencia-da-credencial-na-subida.md` (editado — só minha seção)
- `docs/auditorias/2026-09-12-conferencia-da-credencial-na-subida.md`, `db/papel-do-cliente.md`,
  `db/verificacao-do-papel.md`, `docs/backlog/F-003-conferencia-da-credencial-na-subida.md`
  (só leitura)
NÃO FEITO: —
DECISÕES:
- **Pela cláusula, como o humano decidiu.** O universo de cada pergunta nova é o conjunto que o
  sistema protege — `t\_%`, o mesmo do `verify`, e os papéis que este processo assume —, nunca um
  atributo do beneficiário. A única exclusão é a própria credencial na sexta pergunta, porque a
  quarta já responde por ela: identidade que nós escrevemos.
- **`reach` pergunta `USAGE` e `CREATE`.** `USAGE` é o estrangulamento medido (`§7.5.1`), e `CREATE`
  sem `USAGE` ainda deixa criar objeto no schema alheio.
- **A consulta saiu para `src/db/credential-query.ts`.** Com as duas cláusulas dentro,
  `app-credential.ts` passava de 400 linhas. A divisão é onde ela custa menos: a decisão não precisa
  de banco e a pergunta não decide nada.
- **Gate exige banco e zero pulados**, em vez de piso de pulados. Piso deixaria o modo sem banco
  continuar saindo `0`, que é o silêncio verde do achado, e envelhece — vira o número que alguém
  ajusta quando incomoda.
- **A segunda mão do caso 4 virou papel próprio**, não o operador. Medido: `GRANT … TO <operador>
  WITH ADMIN OPTION` pelo executor leva `0LP01 ADMIN option cannot be granted back to your own
  grantor` quando o operador criou o executor; e o operador `CREATEROLE` não-superusuário leva
  `XX000 no possible grantors` sem essa concessão. O `PAP-13` sempre foi sobre duas mãos com poder
  de conceder, não sobre superusuário.
RISCOS:
- **Cluster com `t_*` sujo passa a não subir.** Um `GRANT USAGE … TO PUBLIC` esquecido em qualquer
  schema `t_*` do cluster recusa a subida. É o desfecho certo, e é mudança de comportamento para
  quem tem cluster fora do arranjo da §7.2/§7.3.
- **A correção primária do `SUB-02` continua em `db/**`**, e não é minha. Li a doc da §7.5.1 e ela
  enumera a via `membro`, que cobriria a linha; **não** rodei o `verify` para confirmar.
- **`.env.example` está fora do meu alcance de leitura** (bloqueio de permissão do ambiente), então
  não pude conferir se ele sugere `0` em alguma chave de tempo. Se sugerir, o exemplo passa a
  recusar a subida e precisa de uma linha.
- **`FORJA_PG_POOL_MAX=0` continua aceito** e o `pg` o transforma em `10` em silêncio
  (`node_modules/pg-pool/index.js:89`). Não pendura nada, então ficou fora desta rodada; é valor
  ignorado sem aviso.
- **O diagnóstico de falha de conexão continua fraco** (nota §6 do auditor): com o catálogo travado
  e os tempos no padrão, a recusa saiu `(Error)` em 5,48 s — quem fechou primeiro foi o tempo de
  conexão, não o `57014` que o auditor mediu. Mesmo desfecho (`78`), diagnóstico pior.
PERGUNTAS:
  - para produto: a lista **Registra** do `F-003` fala em "veredito das quatro perguntas" e o
    **Critério de aceite** em "qual das quatro"; são seis desde hoje, e as duas novas nomeiam
    cliente na recusa (schema alcançado, papel que herda) enquanto o **fato** continua carregando só
    o veredito. A lista **Não registra** precisa da cláusula que separa os dois? Proponho: "o fato
    não carrega o nome do que a recusa encontrou; a recusa carrega, na saída de erro do processo,
    com teto de cinco nomes".
VERIFICAÇÃO: tudo medido em 2026-09-12, PostgreSQL **16.15** (`postgres:16`) em container
  descartável **meu**, `127.0.0.1:55550`, `trust`, **removido ao fim** — o Postgres do humano (5432)
  não foi tocado. Arranjo da §7.2/§7.3 com duas mãos, operador `postgres` e executor `forja_exec`
  (`CREATEROLE`, não superusuário), dois clientes (`t_acme`, `t_globex`) com uma venda cada.
  · `npm run typecheck` → saída `0`.
  · **Gate** (`npm test`, banco superusuário) → `72 tests · 72 pass · 0 fail · 0 cancelled ·
    0 skipped`, saída `0`.
  · **Parcial** (`npm run test:no-db`) → `72 · 59 pass · 0 fail · 0 cancelled · 13 skipped`,
    saída `0`, com o aviso de que a pergunta ao catálogo não foi exercida.
  · **Gate sem a variável** → saída `1`, nenhum teste rodado, mensagem nomeando as duas saídas.
  · **Gate com banco `CREATEROLE` não-superusuário** → `72 · 71 pass · 1 fail · 0 cancelled ·
    0 skipped`, saída `1`: o caso 4 (que falhava com `XX000`) **passa**, e o que resta é o caso 3
    exigindo superusuário com a frase que diz isso. Era `56 pass · 1 fail · 1 skipped` antes.
  · **Antes da correção, no servidor:** `GRANT USAGE ON SCHEMA t_acme TO forja_credencial` →
    sobe `verified`, `/health` `200`, credencial nua lê `t_acme.orders` (`111`). `GRANT app_t_globex
    TO app_t_acme WITH INHERIT TRUE` pelo executor → sobe `verified`, `/health` `200`, e
    `BEGIN; SET LOCAL ROLE app_t_acme; SELECT … FROM t_globex.orders` devolve `222`.
    `FORJA_PG_STATEMENT_TIMEOUT_MS=0` com `pg_auth_members` em `ACCESS EXCLUSIVE` → 12 s pendurado,
    porta fechada nas cinco sondagens, nenhum fato, morto por mim (`124`).
  · **Depois:** `USAGE` direto → saída `78`, `reach: refused`, `/health` sem resposta. `USAGE` a
    `PUBLIC` → saída `78`, `reach: refused`. Herança entre papéis de cliente → saída `78`,
    `assumed: refused`, recusa nomeando `app_t_acme herda app_t_globex (concedido por forja_exec)`.
    `…TIMEOUT_MS=0` → recusa de configuração em **475 ms**, saída `78`; o mesmo nas outras duas
    chaves de tempo. Estado saudável → sobe, `verified` com os seis `ok`, `/health` `200`.
  · **Mutação no `dist`, com banco:** `m.inherit_option → false` derruba o caso 4;
    `has_schema_privilege → false` derruba os casos 6 e 7; `pg_has_role(…,'SET') → false` derruba o
    caso 8. O `dist` foi restaurado e reconstruído, e conferido idêntico ao de antes das mutações.
  · **Confiabilidade (`backend.md` §5), declarada mesmo não sendo fluxo de venda:** *offline* —
    banco fora do ar na subida é recusa, a porta nunca abre e nenhum processo novo sobe durante um
    blip de rede (consequência aceita, §5.2 do auditor); *repetição* — a conferência é leitura pura,
    repetir a subida repete a pergunta e não muda estado nenhum no banco; *resposta perdida depois
    do commit* — não existe commit nesta camada, e o único efeito externo é o fato de subida, que é
    melhor-esforço por desenho (`emitStartupFact` nunca lança, conta descarte). Nenhuma venda
    atravessa este caminho: a porta não está aberta enquanto ele roda.
MEMÓRIA SUGERIDA:
  - type=gotcha escopo=plataforma slug=has-schema-privilege-responde-por-privilegio-herdado —
    `has_schema_privilege(current_user, …)` ignora o que vem por papel com `INHERIT FALSE`, e é por
    isso que ela é a pergunta exata para "alcança schema sem assumir papel"; `GRANT USAGE ON SCHEMA`
    mora em `nspacl` e é invisível a qualquer pergunta sobre `pg_auth_members`.
  - type=gotcha escopo=plataforma slug=criador-de-papel-recebe-admin-e-nao-set —
    em 16 quem cria um papel fica com `admin_option` e sem `set_option`, e `ADMIN` não pode ser
    concedido de volta ao próprio concedente (`0LP01`): montagem de cenário de duas mãos precisa de
    um terceiro papel, não do operador.
  - type=convention escopo=processo slug=gate-de-teste-exige-banco-e-zero-pulados —
    suíte que pula em modo de gate é `0 fail` sobre propriedade não exercida; o modo parcial é
    bandeira de linha de comando, nunca variável de ambiente, e diz o que não exercitou.
  - type=gotcha escopo=plataforma slug=zero-em-tempo-de-banco-e-sem-limite —
    `0` em `statement_timeout`, `idle_in_transaction_session_timeout` e `connectionTimeoutMillis`
    significa "espere para sempre": o processo não abre porta, não emite fato e não termina.
PRÓXIMO PASSO SUGERIDO: `seguranca` — reauditar o gate 3 sobre as duas cláusulas novas
  (`src/db/credential-query.ts`, `src/db/app-credential.ts:refusalsAgainst`) e sobre o gate de teste,
  com atenção a se a quinta pergunta pode ser cegada por alguém que controla o nome de um schema.

## seguranca (reauditoria do gate 3) — 2026-09-12

Relatório completo em `docs/auditorias/2026-09-12-conferencia-da-credencial-na-subida-reauditoria.md`.
Continuação da numeração: `SUB-05`…`SUB-08`.

`SUB-01`, `SUB-03` e `SUB-04` fecharam — reproduzi os três estados e os três recusam ou não são
aceitos. `SUB-02` fechou no **mecanismo** que ele nomeou e continua aberto no **desfecho**: é o
`SUB-05`.

### RELATÓRIO — seguranca — T-0013
STATUS: OK
FEITO:
- Reauditei o gate 3 sobre as duas cláusulas novas (`credential-query.ts`, `refusalsAgainst`), sobre o
  gate de teste e sobre a recusa de `0` em tempo de banco. Quatro achados novos: um `ALTO`, dois
  `MÉDIO`, um `BAIXO`.
- **`SUB-05` [ALTO], reincidente de `SUB-02`.** A correção abriu duas frentes e fechou três das quatro
  células da matriz *sujeito × mecanismo*: sujeito **papel assumido** com mecanismo **privilégio de
  objeto ou atributo** não é perguntado por ninguém. Três variantes medidas, todas com os seis `ok` e
  `startup_credential_verified`: `GRANT USAGE + SELECT ON SCHEMA t_globex TO app_t_acme` (o erro de
  digitação da §7.3, emitido pelo executor não-superusuário) → `BEGIN; SET LOCAL ROLE app_t_acme;
  SELECT … FROM t_globex.orders` devolve `222`; o mesmo contra `platform` → a transação de `acme` lê a
  carteira de clientes; `ALTER ROLE app_t_acme SUPERUSER` → idem, e é a mais fraca porque exige
  superusuário. O desfecho é o do `SUB-02`, palavra por palavra: alcance **dentro** do handle que a
  borda entrega à rota.
- **`SUB-06` [MÉDIO], reincidente em classe de `PAP-15`.** O universo `nspname LIKE 't\_%'` deixa
  `platform` fora, e `db/papeis-e-credencial.md:39-42` faz de "nenhum papel de aplicação recebe
  `USAGE` em `platform`" um invariante nomeado. Medido: `GRANT USAGE ON SCHEMA platform TO
  forja_credencial` sobe com os seis `ok` e a credencial nua lê `platform.tenants`. A mesma função da
  quinta pergunta responde `t` para `platform` — está a uma linha do universo.
- **`SUB-07` [MÉDIO], reincidente em classe de `SUB-03`/`PAP-17`/`PAP-23`.** O gate sai `0` com **zero**
  teste executado. Medido com o alvo trocado para um glob que não casa nada: `tests 0 · pass 0 · fail 0`,
  `gate: 0 testes · 0 passando`, saída `0`. O gatilho é refactor de configuração (`rootDir`, `include`,
  nome da pasta, `*.spec.ts`), não exotismo.
- **`SUB-08` [BAIXO].** Quarta mutação, a que faltava: `session_user → current_user`,
  `(VALUES ('USAGE'), ('CREATE')) → (VALUES ('USAGE'))` e `rolcanlogin → true` passam o gate com
  `72 · 72 pass`, saída `0`. A do `CREATE` tem estado real por trás — medido, `GRANT CREATE ON SCHEMA
  t_globex TO forja_credencial` sem `USAGE` deixa a credencial nua executar `CREATE TABLE t_globex.isca`,
  e a conferência intacta recusa esse estado.
ARQUIVOS:
- `docs/auditorias/2026-09-12-conferencia-da-credencial-na-subida-reauditoria.md` (novo)
- `tarefas/T-0013-conferencia-da-credencial-na-subida.md` (editado — só esta seção)
- `apps/api/src/**`, `apps/api/test/**`, `apps/api/scripts/run-tests.mjs`, `apps/api/package.json`,
  `apps/api/tsconfig.json`, `db/papel-do-cliente.md`, `db/papeis-e-credencial.md`,
  `db/referencia-estrutural-platform.txt`, `docs/backlog/F-003-…md` (só leitura)
NÃO FEITO: —
DECISÕES:
- **`SUB-05` fica em `ALTO`, não `CRÍTICO`**, pela mesma contenção de `SUB-01`/`SUB-02`: exige `GRANT`
  de quem administra schema ou papel, e não é alcançável por requisição de fora.
- **A variante do schema `relatorios` com view consolidada ficou como nota, não como achado.** Medi
  (credencial nua lê os dois clientes numa consulta, seis `ok`), mas não existe hoje quem crie essa
  view. Cenário concreto exige caminho existente; o de `platform` existe, o outro é para onde a regra
  de relatório consolidado aponta.
- **Não reauditei `db/**`**, como o brief pediu. A correção primária do `SUB-05` é da mesma família
  `PAP-20`/`PAP-22` e continua do `verify`; aqui o que se cobra é não afirmar cobertura inexistente.
RISCOS:
- **Raio da recusa.** Medido: um `GRANT USAGE ON SCHEMA t_terceiro TO PUBLIC` num schema sem relação
  com cliente nenhum faz **todo** processo daquele banco parar de subir. Desfecho certo, e não achei
  caminho de fora para provocá-lo (`datacl` medido dá `CREATE` só ao dono e ao executor; `PUBLIC` tem
  `CONNECT` e nada mais). O que sobra é operacional: estado de um schema recusa a frota inteira.
- **`npm test -- --no-database` rebaixa o gate a parcial e sai `0`** (medido). Não é achado — a bandeira
  continua em argv e o aviso sai na mesma tela —, mas a diferença entre gate e parcial não está no nome
  do script.
- **`FORJA_PG_POOL_MAX=0` continua ignorado em silêncio.** Confirmado na fonte instalada:
  `node_modules/pg-pool/index.js:89`, `this.options.max = this.options.max || … || 10`. Nota, não achado:
  incoerência com a régua que `config.ts:67-77` acabou de estabelecer.
- **Minha medida diverge da do autor no diagnóstico de conexão.** Com `pg_catalog.pg_auth_members` em
  `ACCESS EXCLUSIVE` e tempos no padrão, medi recusa em **5,39 s com `57014`**, não `(Error)` em 5,48 s.
  `(Error)` só aparece no outro estado, escuta TCP que aceita e nunca fala. E não esconde exaustão:
  `CONNECTION LIMIT 0` sai `53300`, nomeado.
- **Não consegui ler `apps/api/.env.example`** — mesmo bloqueio de permissão que o autor relatou. Não
  conferi se ele sugere `0` em alguma chave de tempo.
PERGUNTAS:
  - para backend: a quinta pergunta passa a ter o sujeito da sexta (`has_schema_privilege` por papel
    assumível, contra os schemas que não são o dele), ou o `Objetivo` do `F-003` para de afirmar que
    nenhum papel assumido alcança outro cliente? As duas fecham `SUB-05`; só o silêncio não fecha.
  - para produto: se a resposta acima for a segunda, o `Critério de aceite` do `F-003` ganha o caso do
    privilégio de objeto num papel de cliente como estado **declarado fora**, com o dono nomeado?
VERIFICAÇÃO: tudo medido em 2026-09-12, PostgreSQL **16.15** (`postgres:16`), container descartável
  **meu** (`forja-sub2-pg`, `127.0.0.1:55601`, `trust`), **removido ao fim** — os três containers do
  arquiteto e o Postgres do humano (5432) não foram tocados. Arranjo §7.2/§7.3 com duas mãos, operador
  `postgres` e executor `forja_exec` (`CREATEROLE`, não superusuário), dois clientes com uma venda cada.
  · **As quatro contagens do autor, conferidas e exatas:** gate com superusuário `72 tests · 72 pass ·
    0 fail · 0 cancelled · 0 skipped`, saída `0`; `test:no-db` `72 · 59 pass · 13 skipped`, saída `0`;
    gate sem a variável, saída `1` e nenhum teste executado; gate com banco `CREATEROLE` não-superusuário
    `72 · 71 pass · 1 fail · 0 skipped`, saída `1`, a falha sendo o caso 3 exigindo superusuário.
  · **As três mutações do autor, repetidas:** `m.inherit_option → false` derruba o caso 4;
    `has_schema_privilege → false` derruba os casos 6 e 7; `pg_has_role(…,'SET') → false` derruba o
    caso 8. `dist` restaurado e reconstruído, `sha256` idêntico (`1f975a6f…db864`).
  · **Os sete casos de aceite do `F-003`:** medidos, os sete passam.
  · **Arranjo íntegro:** sobe com os seis `ok`; credencial nua `42501` nos dois schemas;
    `app_t_acme → t_globex` e `app_t_globex → t_acme` `42501`; `app_t_acme → t_acme` lê `111`.
  · **Exclusão da sexta pergunta, atacada e resistiu:** o par pergunta 4 / pergunta 6 lê a mesma linha
    da mesma tabela com o mesmo predicado, então não há estado em que a 4 responda `ok` sobre a
    credencial e a 6 a exclua. Com `me` vazio, a exclusão some em vez de crescer.
  · **Universo da sexta pergunta, medido:** `pg_has_role(current_user, …, 'SET')` responde `t` para
    `app_t_acme`, `app_t_globex`, `forja_app` e a própria credencial, e `f` para `forja_exec` e
    `postgres` — exatamente o que `set_config('role', …)` consegue assumir. A via de grupo é pega:
    `GRANT forja_app TO app_t_acme WITH INHERIT TRUE` → `assumed: refused`. E `GRANT USAGE ON SCHEMA
    t_globex TO forja_app` sozinho não vaza (`42501` nos dois sentidos).
  · **Fato de subida:** lido (`startup-facts.ts:63-75`) e medido em duas recusas — `factId`, `kind`,
    `occurredAt`, `currentRole`, `sessionRole`, `groupRole`, `verdict`, e **nenhum nome de cliente**.
  · **Nome de schema:** `platform.tenants.schema_name` é gerada `('t_'::text || slug)`
    (`db/referencia-estrutural-platform.txt:67`) e `schema-name.ts:13-22` só produz/aceita `t_` + slug
    minúsculo. `datacl` medido: `{=c/postgres, postgres=CTc/postgres, forja_exec=C/postgres}`. Não
    existe schema de cliente fora de `t\_%`.
  · **Não rodei** o `verify` do executor (fora de escopo, `db/**` em movimento) e **não li**
    `apps/api/.env.example` (bloqueio de permissão).
MEMÓRIA SUGERIDA:
  - type=gotcha escopo=plataforma slug=pergunta-de-alcance-tem-dois-eixos-sujeito-e-mecanismo —
    conferência de isolamento no banco varre uma matriz *sujeito × mecanismo*: sujeito é a credencial
    **e** todo papel que ela assume; mecanismo é concessão de papel (`pg_auth_members`) **e** privilégio
    de objeto (`nspacl`) **e** atributo de papel (`rolsuper`). Fechar três células e chamar de fechado é
    como `SUB-02` reabriu como `SUB-05`.
  - type=gotcha escopo=plataforma slug=gate-de-teste-verde-sobre-zero-teste —
    `node --test` com glob que não casa arquivo nenhum sai `0`; gate que só olha `fail`/`cancelled` sai
    `0` junto e imprime "0 testes · 0 passando". Piso de total é a guarda que falta.
  - type=gotcha escopo=plataforma slug=zero-em-pool-max-vira-dez-no-pg-pool —
    `pg-pool` faz `max = max || poolSize || 10`, e `0` é falso em JavaScript: `FORJA_PG_POOL_MAX=0` vira
    `10` sem aviso. Mesma classe do `0` em tempo de banco, sem a consequência de pendurar.
PRÓXIMO PASSO SUGERIDO: `backend` — fechar `SUB-05` e `SUB-06` pela cláusula ou pela declaração (a
  pergunta está em PERGUNTAS), e `coder` — o piso de total no `run-tests.mjs` (`SUB-07`).

## backend (terceira rodada) — 2026-09-12

Fechamento de `SUB-05`, `SUB-06`, `SUB-07` e `SUB-08`. Pela **cláusula**, como o humano decidiu, e
pelo mesmo motivo das duas rodadas anteriores: o desfecho medido é um cliente lendo a venda do outro
com o servidor afirmando que conferiu.

### A matriz, que é o diagnóstico do auditor e virou a forma do código

|  | mecanismo: concessão de **papel** | mecanismo: privilégio de **objeto** (e atributo) |
|---|---|---|
| sujeito: **a credencial** | `inheritance` | `reach` |
| sujeito: **papel que ela assume** | `assumed` | **`assumedReach`** ← entrou agora |

As seis perguntas cobriam três células. A sétima fecha a quarta, e é a única em que o alcance está
**dentro do handle que a borda entrega à rota** — por isso `SUB-02` tinha sido fechado pelo mecanismo
que ele nomeia e continuava de pé pelo desfecho que ele descreve.

`assumedReach` tem **duas** recusas, com dois atos distintos, e a de atributo vem primeiro:

- **atributo** — `ALTER ROLE app_t_<a> SUPERUSER`. Medido: papel superusuário responde `t` em
  `has_schema_privilege` para **todo** schema, então a lista de alcance sai nomeando o cluster
  inteiro e o `REVOKE` que ela sugere não muda nada. O ato certo é `ALTER ROLE … NOSUPERUSER
  NOBYPASSRLS`, e quem lê a mensagem de cima para baixo precisa dele primeiro;
- **privilégio de objeto** — `GRANT USAGE ON SCHEMA t_<b> TO app_t_<a>`, o erro de digitação da §7.3,
  onde duas linhas seguidas carregam o mesmo slug.

### As quatro propriedades que o auditor atacou e não derrubou, e o que fiz com elas

1. **A exclusão da sexta pergunta é sólida.** Preservada, e agora **estrutural**: as perguntas 6 e 7
   leem o mesmo CTE `assumidos`, em vez de repetirem o predicado. Duplicar era o jeito de as duas
   divergirem numa edição futura.
2. **O universo "papéis que este processo assume" é fechado.** Intocado — é literalmente o mesmo
   conjunto, agora lido de um lugar só.
3. **O fato de subida não nomeia cliente.** Intocado: `assumedReach` entra no veredito como
   `ok|refused|unanswered`, e a lista vai só para a saída de erro, com o teto de cinco.
4. **Não existe schema de cliente fora de `t\_%`.** Continua verdade, e o universo cresceu pelo outro
   lado: entrou `platform`, que **não** é schema de cliente e mesmo assim alcança dado de cliente.

E a régua: **nenhuma exclusão por propriedade que o excluído carrega.** A exclusão nova é o schema
do próprio papel, `'app_' || nspname` — a mesma junção com que o executor verifica o arranjo
(§7.1), identidade que nós escrevemos. Provado nos dois sentidos por mutação: removê-la faz **8**
casos falharem, inclusive o saudável; torná-la total faz 2 falharem.

### `SUB-06` — uma linha no `WHERE`, como o auditor disse

O universo das perguntas de alcance passou de `t\_%` para `t\_%` mais `platform`. `platform` é o
único invariante de alcance que o repositório escreveu por extenso (`db/papeis-e-credencial.md:39-42`)
e era o único que esta camada não perguntava.

**Conferi que ele não acusa o saudável, e isto era o risco de verdade:** procurei em `db/**` toda
concessão sobre `platform` a papel de aplicação e **não existe nenhuma** — nem no ato do operador
(§7.2), nem no do executor (§7.3), nem no migrator. `apps/api` também não lê `platform`: o único
ponto que precisaria disso é `tenant/context.ts:54-62`, que está parado esperando `D-03` justamente
por causa dessa proibição. `public` ficou **fora** do universo de propósito: `USAGE` nele é concedido
a `PUBLIC` pelo servidor, e quem o tira é o `REVOKE` da §7.2 — outra pergunta, de outro dono.

### `SUB-07` — uma condição

`total === 0` reprova, nos **dois** modos. Zero, e não um piso: piso envelhece — vira o número que
alguém ajusta quando incomoda — e é a mesma recusa que já tinha sido feita ao piso de pulados. O que
o script sabe afirmar sem envelhecer é que suíte que não executou nada não provou nada.

### `SUB-08` — dois casos vivos, e eles matam três mutações

- **caso 11**, conexão que chega com `options=-c role=app_t_<a>`: mata a mutação de `session_user`
  **e** a de `rolcanlogin`, porque papel de cliente é `NOLOGIN` por construção. O `login` deixou de
  ser "não exercível";
- **caso 12**, `GRANT CREATE` sem `USAGE`: mata a mutação que tira `('CREATE')` do universo. O
  estado é real e está montado dentro do teste — a credencial nua **cria tabela** no schema do outro
  cliente. Ela não consegue derrubá-la, porque `DROP` resolve o nome e resolver nome exige `USAGE`;
  por isso a limpeza é do operador.

### A divergência de medição: **o auditor está certo, e meu `RISCOS` anterior cai**

Reproduzi o estado dele — `ACCESS EXCLUSIVE` em `pg_catalog.pg_auth_members`, tempos no padrão — duas
vezes: recusa em **5 028 ms** e **5 029 ms**, as duas com **`57014`**, que é o diagnóstico certo.
Confirmei também a outra metade: `ALTER ROLE … CONNECTION LIMIT 0` recusa em 23 ms com **`53300`**
nomeado. O `(Error)` que relatei na rodada passada não se reproduz neste estado. Retiro a afirmação.

### A terceira via de alcance, que apareceu enquanto eu justificava a escolha da cláusula

Escrevi que não trocaria `has_schema_privilege` por uma varredura de `nspacl` — linear em vez de
quadrática — porque a varredura perde o alcance por **dono**. Era afirmação sobre o Postgres que eu
não tinha medido, então medi, e ela se confirma com uma ressalva que vale mais que a afirmação
original: num schema **sem ACL explícito**, `ALTER SCHEMA t_<b> OWNER TO app_t_<a>` faz
`has_schema_privilege` passar de `f` para `t` com `nspacl` ainda **nulo** e `aclexplode` devolvendo
zero linhas. Num schema que já recebeu a §7.3 o `nspacl` não é nulo e o servidor reescreve a entrada
do dono na troca — ali a varredura enxergaria. O buraco dela é o schema **nunca concedido**, que é o
estado de `platform` e de todo schema recém-criado.

Disso saiu o **caso 14**: dono é a terceira via de alcance, ao lado de concessão e atributo, e
transferir a posse é uma linha. A cláusula nova já a cobria — medido no servidor: `ALTER SCHEMA
t_globex OWNER TO app_t_acme` derruba a subida com `assumedReach: refused`, nomeando
`app_t_acme -> t_globex (USAGE)` e `(CREATE)`. Não foi desenho meu, foi consequência de a pergunta
ser direta em vez de composta — que é exatamente o argumento para mantê-la.

## RELATÓRIO — backend — T-0013
STATUS: OK
FEITO:
- `SUB-05` fechado **pela cláusula**: sétima pergunta `assumedReach`, sujeito em todo papel que este
  processo assume, mecanismo em privilégio de objeto (`has_schema_privilege` contra os schemas que
  **não** são o dele) e em atributo (`rolsuper`, `rolbypassrls`). Duas recusas, dois atos, a de
  atributo primeiro. Fecha a quarta célula da matriz sujeito × mecanismo.
- `SUB-06` fechado com uma linha no `WHERE`: o universo das duas perguntas de alcance passou a ser
  `t\_%` **mais** `platform`, nomeado pela constante `CONTROL_SCHEMA`.
- `SUB-07` fechado com uma condição: `total === 0` reprova o gate, nos dois modos, com mensagem que
  nomeia o alvo e as quatro coisas que o determinam.
- `SUB-08` fechado com dois casos vivos (11 e 12) que matam as **três** mutações.
- Caso 14 acrescentado: **dono** é a terceira via de alcance, e a cláusula nova já a cobria. Saiu de
  medir uma afirmação minha que eu não tinha medido.
- As perguntas 6 e 7 passaram a ler o **mesmo** CTE `assumidos`, em vez de repetirem o predicado —
  a propriedade "mesmo sujeito" virou estrutural em vez de textual.
- A divergência de medição resolvida a favor do auditor; retirei minha afirmação anterior.
- `app-credential.ts` passou de 400 linhas com a cláusula nova: a tabela de decisão saiu para
  `credential-refusals.ts`, e `app-credential.ts` a reexporta.
ARQUIVOS:
- `apps/api/src/db/credential-refusals.ts` (novo — a tabela de decisão saiu de `app-credential.ts`)
- `apps/api/src/db/credential-query.ts`, `apps/api/src/db/app-credential.ts`,
  `apps/api/src/db/tenant-role.ts`, `apps/api/src/observability/startup-facts.ts`,
  `apps/api/scripts/run-tests.mjs`, `apps/api/test/app-credential.test.ts`,
  `apps/api/test/app-credential-live.test.ts`, `apps/api/README.md` (editados)
- `tarefas/T-0013-conferencia-da-credencial-na-subida.md` (editado — só minha seção)
- `docs/auditorias/2026-09-12-conferencia-da-credencial-na-subida-reauditoria.md`,
  `db/papel-do-cliente.md`, `db/papeis-e-credencial.md`, `db/verificacao-do-papel.md`,
  `db/migrator/**` (só leitura)
NÃO FEITO: —
DECISÕES:
- **`assumedReach` é pergunta nova, não crescimento da quinta.** O auditor sugeriu "a quinta ganha o
  sujeito da sexta"; separei porque o **ato que conserta é outro** — `REVOKE … FROM <papel de
  cliente>` em vez de `FROM <credencial>` — e o veredito por pergunta é o que alguém lê primeiro
  quando o servidor não sobe. Custo: o veredito do fato ganhou um sétimo campo.
- **Atributo é recusa separada, e vem antes do alcance.** Medido: papel superusuário responde `t` em
  `has_schema_privilege` para todo schema, então sem a separação a recusa sairia mandando revogar
  privilégio que ninguém concedeu. Não excluí o superusuário da lista de alcance — seria exclusão
  por propriedade que o excluído carrega.
- **`rolbypassrls` entra junto de `rolsuper`, e é preventivo declarado.** Não há RLS no modelo hoje,
  então não medi vazamento por ele; medi que a conferência o pega. É o outro atributo que atravessa
  verificação de privilégio, custa um termo, e não tem como acusar arranjo legítimo — papel de
  aplicação nasce `NOLOGIN NOINHERIT` e nada além.
- **`public` fica fora do universo**, e a ausência é decidida: `USAGE` nele é concedido a `PUBLIC`
  pelo servidor, e quem o tira é o `REVOKE` da §7.2. Incluí-lo faria a conferência recusar todo
  cluster em que aquela linha não rodou — que é defeito real, mas de outra pergunta e de outro dono.
- **`TENANT_ROLE_PREFIX` virou exportado de `tenant-role.ts`.** A cláusula nova precisa da junção
  `'app_' || nspname`, e havia duas cópias do prefixo; a terceira faria três coisas que têm de
  concordar sem nada que as force. A autoridade é onde `tenantRoleName` é formado.
- **Mantive `has_schema_privilege` e recusei a varredura de `nspacl`**, que seria linear: ela perde o
  alcance por propriedade de dono (`ALTER SCHEMA … OWNER TO`), que não deixa entrada em ACL nenhuma.
  Custo medido em RISCOS.
- **O teste vivo continua num arquivo só, e ele passa de 400 linhas (741).** Um arranjo de duas mãos,
  catorze casos, uma limpeza. Separar exigiria montá-lo duas vezes em processos diferentes, e montagem
  duplicada foi a origem do defeito da rodada passada (`XX000 no possible grantors`). Justificativa
  registrada aqui e no topo do arquivo, como `00-nucleo.md` §8 exige.
- **O arranjo do teste vivo passou a incluir as duas linhas de privilégio de schema da §7.3.** Sem
  elas, papel de cliente não alcançava nem o próprio schema, e a exclusão nova responderia `[]` por
  não haver privilégio nenhum — não por ela funcionar. Emitidas pelo operador porque aqui o schema é
  dele; para `has_schema_privilege` o concedente não existe (ao contrário da concessão de papel).
RISCOS:
- **Custo quadrático na subida, medido.** A pergunta de alcance por papel assumido é
  `O(papéis × schemas)`: **74 ms** com 302 schemas de cliente e **360 ms** com 602, no mesmo
  container — a razão 4,9× para 2× em N confirma a curva. Roda **uma vez por processo**, antes de a
  porta abrir, nunca no caminho de requisição. Extrapolando (estimativa, não medida): ~1 s com 1 000
  clientes, ~4 s com 2 000. Se um cluster passar dessa faixa, é pauta de `performance`, e a saída
  barata não é a varredura de ACL (perde dono) e sim cortar o lado de schemas por lote.
- **`R4` (gate com banco servido por executor não-superusuário) saiu de 1 para 4 falhas**, e as
  quatro são **assertivas nomeadas**: casos 3, 10, 13 e 14 dizem exatamente o que aquele papel não
  consegue montar. Nenhuma é erro cru do driver — conferi as quatro mensagens. O gate continua sendo
  `R1`, com banco por superusuário, como `run-tests.mjs` documenta.
- **O caso 13 toca um objeto de nome fixo, `platform`.** É o único do arquivo que pode já existir no
  banco apontado. Ele cria só se faltar, concede, revoga, e derruba só o que criou com `RESTRICT` —
  nunca `CASCADE`. Ainda assim: apontar `FORJA_TEST_DATABASE_URL` para um banco com `platform` de
  verdade faz o teste conceder e revogar `USAGE` ali por alguns milissegundos. O README já manda
  apontar para banco descartável; esta é mais uma razão.
- **Cluster com `platform` fora do arranjo passa a não subir.** Qualquer `GRANT USAGE ON SCHEMA
  platform` a papel de aplicação recusa a subida. Procurei em `db/**` e **não existe** concessão
  assim; `apps/api` não lê `platform` (`tenant/context.ts:54-62` está parado por `D-03` justamente
  por isso). É mudança de comportamento para quem tiver um cluster fora da §7.2/§7.3.
- **`.env.example` continua fora do meu alcance de leitura** (bloqueio de permissão do ambiente, o
  mesmo que o auditor relatou). Não conferi se ele sugere `0` em alguma chave de tempo.
- **`FORJA_PG_POOL_MAX=0` continua aceito** e o `pg` o transforma em `10` em silêncio
  (`node_modules/pg-pool/index.js:89`). Fora do escopo desta rodada; é uma linha em `loadConfig`.
- **Os três containers `forja-audit-pap8*` que existiam quando comecei não existem mais.** Não os
  removi — removi só os três meus, nomeados `forja-backend-sub5-*`, e listei antes e depois. Se o
  auditor ainda precisava deles, quem os derrubou foi outra sessão.
- **`db/**` está em movimento** (arquiteto e auditor trabalhando lá). Li `db/papel-do-cliente.md`,
  `db/papeis-e-credencial.md` e `db/migrator/**` e não escrevi nada. Se a §7.3 mudar as duas linhas
  de privilégio de schema, o arranjo do teste vivo acompanha.
- **A pergunta invertida continua sendo do `verify`**: quem alcança schema de cliente sem ser papel
  deste processo, e mudança depois da subida. Não mudou nesta rodada.
PERGUNTAS:
  - para produto: o `F-003` fala em "veredito das quatro perguntas" e agora são **sete**. Pergunta de
    2026-09-12 ainda aberta, e cresceu: a lista **Não registra** precisa da cláusula que separa o
    fato da recusa? Proponho, inalterado: "o fato não carrega o nome do que a recusa encontrou; a
    recusa carrega, na saída de erro do processo, com teto de cinco nomes".
VERIFICAÇÃO: tudo medido em 2026-09-12, PostgreSQL **16.15** (`postgres:16`, Debian 16.15-1.pgdg13+2)
  em container descartável **meu**, `forja-backend-sub5-pg`, `127.0.0.1:55701`, `trust`, **removido
  ao fim** (conferido: sobraram só os cinco containers que não são meus). O Postgres do humano (5432)
  não foi tocado. Arranjo da §7.2/§7.3 com duas mãos — operador `postgres` e executor `forja_exec`
  (`LOGIN NOINHERIT CREATEROLE`, **não superusuário**, com `CREATE` no banco) —, schema `platform`
  com `tenants`, dois clientes (`t_acme`, `t_globex`) com uma venda cada (`111` e `222`).
  · `npx tsc --noEmit` → saída `0`.
  · **ANTES da correção**, com o `dist` do commit anterior (`sha256 1f975a6f…db864`, idêntico ao que
    o auditor relatou): **`SUB-05` (a)** `GRANT USAGE ON SCHEMA t_globex TO app_t_acme` **pelo
    executor** → subida `verified` com os **seis** `ok`, e `BEGIN; SET LOCAL ROLE app_t_acme; SELECT
    total_cents FROM t_globex.orders` devolve **222**. **(b)** o mesmo contra `platform` → seis `ok`,
    e a transação de `acme` lê a carteira inteira (`acme`, `globex`). **(c)** `ALTER ROLE app_t_acme
    SUPERUSER` → seis `ok`, e `app_t_acme` lê `t_globex` (`222`) **e** `platform`. **`SUB-06`**
    `GRANT USAGE ON SCHEMA platform TO forja_credencial` → seis `ok`, e a credencial **nua** lê
    `platform.tenants` inteiro. As quatro reproduzem o relatório do auditor, exatas.
  · **ANTES — as quatro contagens do auditor, conferidas por mim:** `R1` `72 · 72 pass · 0 fail ·
    0 skipped`, saída `0`; `R2` `72 · 59 pass · 13 skipped`, saída `0`; `R3` saída `1`, nenhum teste
    executado; `R4` `72 · 71 pass · 1 fail`, saída `1`. **As quatro batem.**
  · **ANTES — `SUB-07`:** script copiado para fora da árvore com o alvo trocado para um glob sem
    correspondência → `gate: 0 testes · 0 passando · 0 falhando · 0 cancelados · 0 pulados`, saída
    **`0`**. Reproduz.
  · **ANTES — as três mutações do `SUB-08`** no `dist`, com banco: `session_user → current_user`
    `72 · 72 pass` saída `0`; `(VALUES ('USAGE'), ('CREATE')) → (VALUES ('USAGE'))` `72 · 72 pass`
    saída `0`; `r.rolcanlogin → true` `72 · 72 pass` saída `0`. As três reproduzem. E o estado real
    da segunda: `GRANT CREATE ON SCHEMA t_globex TO forja_credencial` **sem** `USAGE` → a conferência
    intacta recusa por `reach` (`t_globex (CREATE)`), e a credencial nua executa
    `CREATE TABLE t_globex.isca(x int)` com **sucesso**. Ela não consegue o `DROP` (`42501`, o nome
    não resolve sem `USAGE`), então a limpeza foi do operador.
  · **DEPOIS — as quatro rodadas:** `R1` (gate, banco por superusuário) → **`83 testes · 83 passando
    · 0 falhando · 0 cancelados · 0 pulados`**, saída `0`. `R2` (`test:no-db`) → `83 · 64 pass ·
    19 skipped`, saída `0`, com o aviso do que não exercitou. `R3` (sem a variável) → saída `1`,
    **nenhum** teste executado, mensagem nomeando as duas saídas. `R4` (banco por `forja_exec`) →
    `83 · 79 pass · 4 fail · 0 skipped`, saída `1`, e as quatro falhas são **assertivas nomeadas**,
    nenhuma erro cru do driver: casos 3 e 10 exigem superusuário, caso 13 exige ser dono de
    `platform` ou poder criá-lo, caso 14 exige ser dono do schema **e** poder assumir o papel.
  · **DEPOIS — `SUB-07`:** mesmo alvo vazio → `suíte reprovada: 0 testes · 0 passando`, saída **`1`**,
    nos **dois** modos (gate e `--no-database`).
  · **DEPOIS — no servidor de verdade** (`node dist/src/main.js`, porta 38071, sonda em `/health`):
    **saudável** → sobe, `startup_credential_verified` com os **sete** `ok`, `/health` **200**.
    **`SUB-05` (a)** → saída **78**, `/health` sem resposta, `assumedReach: refused`, recusa nomeando
    `app_t_acme -> t_globex (USAGE)`. **(b)** → saída `78`, nomeando `app_t_acme -> platform (USAGE)`.
    **(c)** → saída `78`, **duas** recusas `assumedReach`, a de atributo primeiro
    (`app_t_acme (SUPERUSER)`), a de alcance depois. **`SUB-06`** → saída `78`, `reach: refused`,
    nomeando `platform (USAGE)`. **Dono** (`ALTER SCHEMA t_globex OWNER TO app_t_acme`, pelo
    operador) → saída `78`, `assumedReach: refused`, nomeando `app_t_acme -> t_globex (USAGE)` e
    `(CREATE)`. **Saudável de novo, depois de cada uma e depois de todas** → sobe, sete `ok`,
    `/health` **200**.
  · **DEPOIS — mutação no `dist`, com banco, cada uma revertida e conferida por `sha256`:**
    `session_user → current_user` derruba o **caso 11**; `remove ('CREATE')` derruba o **caso 12**;
    `rolcanlogin → true` derruba o **caso 11**; `alcance de papel assumido → false` derruba os
    **casos 9, 10 e 14**; `atributo → false` derruba o **caso 10**; `universo volta a ser só t\_%`
    derruba o **caso 13**; `exclusão do próprio schema → false` (deixa de acusar) derruba os **casos
    9, 10 e 14**; `exclusão removida → true` (**acusa o saudável**) derruba **9 casos, inclusive o
    caso 1**. `dist` restaurado e conferido idêntico ao de antes das mutações
    (`sha256 dfc29cb9…cd8c`).
  · **Os dois lados, que é o que o brief exigiu:** acusa o hostil nas **cinco** variantes acima, e
    **não acusa o saudável** — o arranjo íntegro sobe com os sete `ok` antes e depois de cada estado
    hostil, e sobe com **602** schemas de cliente provisionados pela §7.3 (a pergunta nova responde
    `0` linhas, medido). Procurei em `db/**` e não existe concessão sobre `platform` a papel de
    aplicação, então a inclusão de `SUB-06` não pode acusar cluster provisionado corretamente.
  · **Custo, medido:** `74 ms` com 302 schemas de cliente, `360 ms` com 602, três execuções cada, na
    credencial nua, dentro do container. Com 602 clientes provisionados pela §7.3 a pergunta nova
    responde **zero** linhas — não acusa arranjo legítimo em escala.
  · **Dono, medido isolado** (container próprio, criado e removido só para isto): num schema **sem
    ACL explícito**, `ALTER SCHEMA t_globex OWNER TO app_t_acme` leva `has_schema_privilege` de `f`
    para `t` com `nspacl` **nulo** e `aclexplode` devolvendo **0** linhas. Num schema que já recebeu
    a §7.3, `nspacl` tem 3 entradas e o servidor reescreve a do dono na troca.
  · **A divergência do brief, reproduzida:** catálogo travado em `ACCESS EXCLUSIVE` com os tempos no
    padrão → recusa em **5 028 ms** e **5 029 ms** (duas execuções), as duas com **`57014`**. E
    `ALTER ROLE forja_credencial CONNECTION LIMIT 0` → recusa em **23 ms** com **`53300`**. **O
    auditor está certo**; meu `(Error)` em 5,48 s não se reproduz. `RISCOS` anterior retirado.
  · **Confiabilidade (`backend.md` §5), declarada de novo porque a camada mudou:** *offline* — banco
    fora do ar na subida continua sendo recusa, a porta nunca abre, e a pergunta nova não muda isso
    (é a mesma consulta, com mais colunas); *repetição* — a conferência é leitura pura, repetir a
    subida repete a pergunta e não muda estado nenhum no banco, e a pergunta nova não escreve nada;
    *resposta perdida depois do commit* — não existe commit nesta camada, e o único efeito externo é
    o fato de subida, que é melhor-esforço por desenho (`emitStartupFact` nunca lança, conta
    descarte). Nenhuma venda atravessa este caminho: a porta não está aberta enquanto ele roda. O que
    **mudou** é o custo: até 360 ms medidos a mais na subida com 602 clientes, antes de `listen`.
MEMÓRIA SUGERIDA:
  - type=gotcha escopo=plataforma slug=superusuario-responde-sim-em-has-schema-privilege —
    papel com `rolsuper` responde `t` em `has_schema_privilege` para **todo** schema: conferência de
    alcance por privilégio detecta o atributo, mas a mensagem sai mandando revogar o que ninguém
    concedeu. Atributo pede pergunta e ato próprios (`ALTER ROLE … NOSUPERUSER`), e antes do alcance.
  - type=gotcha escopo=plataforma slug=create-sem-usage-cria-e-nao-derruba —
    `GRANT CREATE ON SCHEMA` sem `USAGE` deixa criar tabela no schema alheio e **não** deixa
    derrubá-la, porque `DROP` resolve o nome e resolver nome exige `USAGE`. Cenário que monta esse
    estado precisa de uma terceira mão para limpar.
  - type=convention escopo=plataforma slug=pergunta-honesta-vence-composicao-de-parciais —
    `has_schema_privilege` é `O(papéis × schemas)` e uma varredura de `nspacl` seria linear, mas em
    schema **sem ACL explícito** a varredura é cega ao alcance por **dono** (`ALTER SCHEMA … OWNER
    TO` deixa `nspacl` nulo, medido). Trocar a pergunta direta por composição de perguntas parciais é
    o padrão que abriu `SUB-01`, `SUB-02` e `SUB-05` — e foi medindo a justificativa da recusa que a
    terceira via de alcance apareceu.
  - type=convention escopo=processo slug=gate-reprova-com-total-zero —
    suíte que executou zero teste sai `0` no `node --test` e a linha "0 falhando" concorda. Piso
    envelhece; a condição que não envelhece é `total === 0` reprovar. Quarta encarnação da classe
    (`SUB-03`, `PAP-17`, `PAP-23`, `SUB-07`).
  - type=decision escopo=plataforma slug=universo-de-alcance-inclui-o-schema-de-controle —
    as perguntas de alcance da subida cobrem `t\_%` **mais** `platform`, e `public` fica de fora de
    propósito (`USAGE` ali é do servidor, e quem o tira é o `REVOKE` da §7.2). Conferido que nenhuma
    concessão sobre `platform` a papel de aplicação existe em `db/**`.
PRÓXIMO PASSO SUGERIDO: `seguranca` — terceira auditoria do gate 3 sobre `assumedReach`
  (`src/db/credential-query.ts`, `src/db/credential-refusals.ts`) e sobre o piso de total do
  `run-tests.mjs`. Duas perguntas que eu levantaria no lugar dele: (1) a matriz agora tem **três**
  mecanismos — concessão, privilégio de objeto e **dono** —, e dono só é coberto porque
  `has_schema_privilege` o responde; existe um quarto mecanismo que ela também responde sem eu ter
  percebido, ou um que ela **não** responde? (2) o universo do sujeito continua sendo "papel que
  este processo assume"; o alcance de um papel que ninguém assume mas que **está no grupo** é do
  `verify`, e vale conferir se a fronteira entre os dois ainda fecha depois de `assumedReach`.

## seguranca — 2026-09-23 (terceira auditoria do gate 3)

## RELATÓRIO — seguranca — T-0013
STATUS: OK
FEITO:
- Fiz a terceira auditoria do gate 3. O relatório está em `docs/auditorias/2026-09-23-conferencia-da-credencial-na-subida-terceira.md` e traz quatro achados novos: `SUB-09` [ALTO], `SUB-10` [MÉDIO, reincidente de `SUB-07`], `SUB-11` [BAIXO, reincidente em classe de `SUB-08`] e `SUB-12` [BAIXO].
- **O gate 3 não fecha.** `SUB-05`…`SUB-08` fecharam no que nomeavam, reproduzido estado por estado. `SUB-09` e `SUB-10` seguram o fechamento. `SUB-11` e `SUB-12` não seguram sozinhos.
- **Prioridade um:** sim, existe caminho. Com `SUB-09` um cliente lê e **escreve** dado de outro enquanto o servidor sobe `startup_credential_verified`. Esse caminho exige DDL manual do dono das tabelas, fora do caminho de migration. Não é alcançável por requisição de fora. O tenant continua vindo do contexto da borda, e o fato de subida continua sem nome de cliente (medido com 603 schemas).
- **Pergunta (1) do autor:** a matriz cobre mais do que ele listou. Medi que acusa `PUBLIC` no schema e papel predefinido (`pg_read_all_data` e `pg_write_all_data`, com herança e só com `SET`, sobre papel assumido, grupo e credencial). O privilégio padrão latente não aparece na subida, e o `provision` seguinte sai `3` nomeando o alcance. Extensão confiável não é criável pelo papel assumido nem pela credencial (medido). O mecanismo que ela **não** responde é o quinto, a delegação por dono de objeto (`SUB-09`). Nas quatro formas medidas, o servidor sobe com os sete `ok`:
  - regra de reescrita: a venda de `acme` conclui e grava `1007/777` em `t_globex`, e o `verify` fica idêntico à base;
  - view materializada: `acme` lê `222`, e o `verify` fica idêntico à base;
  - função `SECURITY DEFINER` e view sem `security_invoker`: o `verify` acusa só como `sobra` estrutural.
- **Pergunta (2) do autor:** a fronteira fecha em quatro estados, cada um acusado pelo `verify`:
  - papel do grupo que ninguém assume, com `USAGE`;
  - privilégio padrão latente;
  - o excluído legítimo com `CREATE` no próprio schema;
  - o excluído legítimo dono do próprio schema.

  Ela não fecha em dois: `SUB-09` (regra e view materializada) e `SUB-12` (papel `LOGIN` no grupo com `pg_read_all_data` lê os dois clientes e `platform`, e o `verify` fica idêntico).
- **`run-tests.mjs`:** `skip` condicional (por opção e por `t.skip()`) reprova, e `only` sem `--test-only` roda todos. `todo` que falha passa com saída `0`, e o placar soma 83 de 84 sem acusar a diferença. Com os dois arquivos vivos fora do glob, o gate sai `64 · 64 pass` com saída `0`. Com a mutação do `SUB-03` e o arquivo vivo de fora, sai `69 · 69 pass` com saída `0` (`SUB-10`).
- **Mutações:** as oito do autor morrem com os casos que ele nomeou. Entre as minhas, três sobreviveram com `83/83`:
  - tirar `('CREATE')` da sétima pergunta. O estado real existe: `acme` cria tabela em `t_globex`, e a conferência intacta o recusa (`SUB-11`);
  - `BYPASSRLS → false`, sem RLS no modelo e portanto sem alcance a medir;
  - incluir a credencial em `assumidos`, que é mutante equivalente: só acrescenta linha.
ARQUIVOS:
- `docs/auditorias/2026-09-23-conferencia-da-credencial-na-subida-terceira.md` (novo)
- `apps/api/src/db/{app-credential,credential-query,credential-refusals,tenant-role,tenant-db}.ts`, `apps/api/src/observability/startup-facts.ts`, `apps/api/src/main.ts`, `apps/api/src/tenant/schema-name.ts`, `apps/api/scripts/run-tests.mjs`, `db/papel-do-cliente.md`, `db/verificacao-do-papel.md`, `db/universo-e-declaracao.md`, `db/migrator/src/{refusals,tenant-reach,structure-print,namespace-snapshot}.ts`, `docs/backlog/F-003-conferencia-da-credencial-na-subida.md`, a ficha (só leitura; `dist` executado, nunca alterado)
NÃO FEITO: —
DECISÕES:
- **`SUB-09` ficou em `ALTO`, não em `CRÍTICO`.** O estado é drift de dono, e o crivo o impede em migration (`refusals.ts:38`, `:78-81`). Não é `MÉDIO` porque a calibração da casa para objeto que roda com o privilégio do dono e passa pelo `verify` é `ALTO` (`PAP-15`, `PAP-21`), e porque aqui os dois lados ficam em silêncio.
- **`SUB-09` tem dois donos**, porque o detector natural de drift é o `verify` e a afirmação de cobertura está no `apps/api`.
- **`SUB-12` ficou em `BAIXO`:** só o superusuário concede papel predefinido (o executor leva recusa, medido), e a mesma mão cria superusuário `LOGIN`, que a §7.5.1 já declara fora.
- **`pg_stats` ficou como nota, não como achado.** Com a segunda linha da §7.3 com o slug trocado, `acme` lê `most_common_vals {222}` de `globex` e os dois lados ficam em silêncio. Nenhuma rota lê `pg_stats`, então falta o ator.
RISCOS:
- As duas convenções citadas no brief (`convention-propriedade-acusa-nunca-desculpa`, `convention-exclusao-se-prova-com-o-excluido-hostil`) **não existem** em `memory/processo/`, nem no índice. Apliquei a regra pelo texto de `db/verificacao-do-papel.md` §7.5.1 e pelo próprio brief. O orquestrador precisa escrever os dois registros ou corrigir a referência.
- `SUB-09` e `SUB-12` tocam `db/**`, que a auditoria paralela cobre. Pode haver achado duplicado com outra numeração.
- Qualquer sessão lê `pg_stat_user_tables` de todo cliente (a credencial nua viu `n_tup_ins = 51` em `t_globex`). É propriedade do schema por cliente, e vira achado no dia em que alguma superfície expuser estatística de catálogo.
PERGUNTAS:
  - para arquiteto-dados: o `verify` passa a imprimir regra de reescrita (exceto `_RETURN`) e view materializada em schema protegido, e a acusar dependência que atravessa entre schemas protegidos (`SUB-09`)? E a via "membro de papel predefinido" entra na §7.5.1 ou fica declarada fora (`SUB-12`)?
  - para backend: a delegação por objeto fica declarada fora no topo de `app-credential.ts`, com o dono nomeado, ou vira pergunta de subida (o arranjo legítimo não tem objeto com dependência entre schemas protegidos)? E o gate passa a exigir `pass === total` mais os arquivos vivos nomeados (`SUB-10`)?
VERIFICAÇÃO: tudo medido em 2026-09-23, PostgreSQL 16.15, nos containers `forja-s13-pg` (55510) e `forja-s13-gate` (55512), **removidos ao fim** (zero `forja-s13-*`). O arranjo foi montado pela §7.2 do operador e pelo `migrate`/`provision` reais do `dist` da árvore, com executor não superusuário. Servidor na porta 55511. O `dist` de `apps/api` recompilado no scratchpad é idêntico ao da árvore, e toda mutação foi feita na cópia. `apps/api/dist` e `db/migrator/dist` terminaram byte a byte iguais (`sha256` de 54 e 120 arquivos). Gate `83/83`, parcial `64 + 19 skipped`, e sem variável saída `1`: as três contagens do autor, exatas. Com 603 schemas, zero linha e 278–288 ms. `devstack-*`, `serve-offgrid-cms`, `forja-t9-*` e `forja-g9-*` não foram tocados. **Não rodei** o `R4` (gate com banco servido pelo executor) e não li `apps/api/.env.example`.
MEMÓRIA SUGERIDA:
  - type=gotcha escopo=plataforma slug=delegacao-por-dono-de-objeto-e-o-quinto-mecanismo — regra de reescrita, view materializada, view sem `security_invoker` e função `SECURITY DEFINER` no schema do próprio cliente rodam como o dono; `has_schema_privilege` do papel assumido continua `f`, e regra e view materializada não aparecem no `verify`.
  - type=gotcha escopo=processo slug=todo-que-falha-passa-no-gate — `node --test` conta `todo` à parte, e gate que olha `fail`/`skipped` sai `0` com asserção falhando; a condição que não envelhece é `pass === total`.
  - type=gotcha escopo=plataforma slug=usage-nao-estrangula-pg-stats — privilégio de tabela sem `USAGE` no schema não lê a tabela e lê `most_common_vals` dela por `pg_stats`.
PRÓXIMO PASSO SUGERIDO: `arquiteto-dados` — cobertura de regra e view materializada no `verify` (`SUB-09`) e decisão sobre papel predefinido (`SUB-12`); `backend` — declarar ou perguntar a delegação por objeto (`SUB-09`), e o gate com `pass === total` mais os arquivos vivos nomeados (`SUB-10`) e o caso de `CREATE` do papel assumido (`SUB-11`). Depois, `seguranca` volta para a quarta rodada.

## backend (quarta rodada) — 2026-09-23

## RELATÓRIO — backend — T-0013 (quarta rodada)
STATUS: OK

FEITO:
- **`SUB-09` virou a oitava pergunta de subida, `delegation`.** É uma pergunta nova, fora da matriz sujeito × mecanismo, e sai com duas recusas na forma das existentes: saída 78 e motivo nomeando o objeto e os dois schemas. Os dois predicados:
  - **dependência que sai do próprio schema:** uma linha de `pg_depend` em que o objeto dependente mora em schema protegido e o objeto referenciado mora em **qualquer outro** schema;
  - **toda rotina `SECURITY DEFINER` em schema protegido**, com qualquer corpo.
- A pergunta cobre as quatro formas medidas (regra, view materializada, view, função `SECURITY DEFINER`). Também cobre, medido por mim, estes mecanismos que delegam privilégio:
  - chave estrangeira com `ON UPDATE CASCADE` (o `UPDATE` de acme reescreveu uma linha de globex);
  - herança e partição entre schemas (a leitura do pai devolveu a filha do outro cliente, e a escrita no pai gravou na partição dele);
  - salto por schema fora de `t_*` e `platform`;
  - gatilho, padrão de coluna, domínio, política e operador que chamam objeto de fora do schema.
- **`SUB-10`:**
  - em modo de gate, `run-tests.mjs` exige `passando === total`, e `todo` reprova com mensagem própria;
  - `ARQUIVOS_VIVOS` nomeia os três arquivos vivos. Um relator de máquina novo registra de que arquivo veio cada teste, e arquivo da lista sem nenhum teste executado reprova o gate nomeando o arquivo;
  - o modo parcial lista quais arquivos vivos não rodaram.
- **`SUB-11`:** caso 15. O papel assumido recebe `CREATE` sem `USAGE` no schema alheio, cria de fato a tabela lá (dono = papel de acme) e a subida recusa nomeando `(CREATE)`.
- **`SUB-12`:** não havia caso nomeado, então escrevi o caso 16. Com `pg_read_all_data WITH INHERIT TRUE` no papel assumido, acme lê 222 e a subida recusa por `assumed` e `assumedReach`. Com o mesmo papel concedido à credencial, recusa por `assumedReach`. O caso confere na resposta inteira do catálogo a linha `pg_read_all_data -> <schema> (USAGE)`.
- O título do erro de subida mudou para "a conferência recusou a credencial de banco deste processo, ou o banco a que ela aponta". Com a oitava pergunta, a credencial certa pode ser recusada por causa do banco, e o título antigo acusava a credencial.
- Atualizei `README.md`: oito perguntas, o gate novo e as contagens.

ARQUIVOS:
- `/home/mcastro/work/freelas/forja/apps/api/src/db/credential-query.ts` (editado)
- `/home/mcastro/work/freelas/forja/apps/api/src/db/credential-refusals.ts` (editado)
- `/home/mcastro/work/freelas/forja/apps/api/src/db/app-credential.ts` (editado)
- `/home/mcastro/work/freelas/forja/apps/api/src/observability/startup-facts.ts` (editado)
- `/home/mcastro/work/freelas/forja/apps/api/scripts/run-tests.mjs` (editado)
- `/home/mcastro/work/freelas/forja/apps/api/scripts/gate-reporter.mjs` (novo)
- `/home/mcastro/work/freelas/forja/apps/api/test/delegation-live.test.ts` (novo)
- `/home/mcastro/work/freelas/forja/apps/api/test/app-credential-live.test.ts` (editado)
- `/home/mcastro/work/freelas/forja/apps/api/test/app-credential.test.ts` (editado)
- `/home/mcastro/work/freelas/forja/apps/api/README.md` (editado)
- `apps/api/dist/**` (reconstruído pelo build)
- `db/**`, a ficha e a auditoria (só leitura; o `db/` foi copiado para o scratchpad no começo e nada lá foi escrito)

NÃO FEITO: —

DECISÕES:
- **O lado de destino não para nos schemas protegidos, e isso vai além do texto do brief.** O critério do brief era "outro schema protegido, ou `platform`". Medi que, com ele, o executor contorna a pergunta assim: cria `ext`, põe em `ext` uma view sobre `t_globex` e em `t_acme` uma view sobre a de `ext`. Acme lê 222. Um gatilho em `t_acme` chamando uma rotina `SECURITY DEFINER` de `ext` gravou em `t_globex`, com `has_schema_privilege(app_t_acme, ext)` = `f`. Então o destino passou a ser qualquer schema que não seja o do próprio objeto. O catálogo do sistema não precisa de exclusão: dependência sobre objeto embutido não vira linha de `pg_depend` (medido: zero linhas de objeto protegido sobre `oid < 16384` no arranjo do `migrate` real). A decisão continua sendo a do thread (pergunta de subida); é o predicado dela que ficou fechado.
- **`SECURITY DEFINER` não se julga por dependência.** Medido: corpo `plpgsql` e corpo `sql` entre cifrões não deixam linha em `pg_depend` sobre as tabelas que leem; só `BEGIN ATOMIC` deixa. Com o critério literal, a forma comum passaria. O predicado é a existência da rotina em schema protegido, que o crivo de migration já recusa.
- **A view com `security_invoker` não fica desculpada**, embora o brief listasse só "view sem `security_invoker`". Desculpá-la seria exclusão por uma propriedade que o dono da view desliga com um `ALTER VIEW` (`convention-propriedade-acusa-nunca-desculpa`). O arranjo legítimo não tem view que atravesse schema, então isso não gera falso positivo.
- **`delegation` é pergunta própria**, e o veredito do fato ganhou o oitavo campo. O fato continua sem nome de cliente: nenhuma ocorrência de nome de schema no stdout da recusa com 602 schemas.
- **`delegation-live.test.ts` cria e derruba um banco próprio.** A pergunta olha o banco inteiro, o `node --test` roda arquivos em paralelo, e um estado hostil deste arquivo derrubaria a subida do outro. O banco próprio também deixa `platform` ser criado sem disputar com o caso 13.
- **Arquivos acima de 400 linhas, com justificativa registrada no topo de cada um:**
  - `delegation-live.test.ts` (583): dez casos sobre um arranjo;
  - `app-credential-live.test.ts` (874): dezesseis casos, a mesma justificativa de antes;
  - `app-credential.test.ts` (418): os casos compartilham o fixture `respostas()`, que eu não quis duplicar.
- **O caso 10 prova o vazamento só pelo gatilho.** Padrão de coluna, domínio, política e operador entram por reconhecimento, conferido na resposta inteira do catálogo. O vazamento de cada um é o mesmo mecanismo: a rotina de fora roda como o dono.

RISCOS:
- **O custo cresce com o número de objetos do banco.** Com 602 schemas de uma tabela: consulta inteira em 287–304 ms, delegação em 16 ms. Com 11 tabelas, 10 índices e 1 view por schema (111 mil linhas em `pg_depend`): consulta inteira em 623–686 ms, delegação em cerca de 330 ms. Fica abaixo do teto de 1 s, e não otimizei. ESTIMATIVA: os dois pontos são compatíveis com crescimento linear na delegação, então com 1 000 clientes desse porte a subida passa de 1 s. É pauta de `performance`. O plano mostra um merge join sobre `objetos` inteiro, e filtrar o lado dependente antes da junção é a saída barata. Essa otimização não foi medida.
- **Ruído na recusa de chave estrangeira:** os gatilhos internos de RI aparecem ao lado da constraint. A lista tem teto de cinco nomes, e a constraint vem primeiro na ordem alfabética. Não excluí os gatilhos internos, porque isso seria exclusão por propriedade.
- **Troca de dono de schema e volta tira o `USAGE` do papel do cliente.** Observado: o caso 10 falhou com `42501` no schema de A logo depois do caso 9 (que faz `ALTER SCHEMA OWNER TO app_A` e volta), e passou depois de reconceder o `USAGE`. A causa ser a fusão da entrada de ACL do papel na do dono é inferência; não consultei `nspacl`. Vale para `arquiteto-dados` conferir se a convergência do `migrate` recoloca o privilégio.
- **Rotina `SECURITY DEFINER` fora dos schemas protegidos, chamada direto pelo nome**, fica fora e está declarada no topo de `app-credential.ts`. A chamada exige texto de consulta que nenhuma rota escreve e `USAGE` que o arranjo não dá ao papel de cliente. Quem acusa esse estado é o `verify` (§7.5.3).
- Os containers `forja-d9-*` (5) apareceram durante a sessão e não são meus; imagino que sejam da auditoria ou do `arquiteto-dados`. Não toquei neles.

PERGUNTAS:
  - para produto: o `F-003` fala em "quatro perguntas" e agora são **oito**. A pergunta está aberta desde 2026-09-12 e cresceu. Proponho de novo, sem mudança: "o fato não carrega o nome do que a recusa encontrou; a recusa carrega, na saída de erro, com teto de cinco nomes".
  - para arquiteto-dados: o lado do `verify` de `SUB-09` adota o mesmo critério (destino em qualquer outro schema, e não só nos protegidos, mais `SECURITY DEFINER` por existência)? Com o critério "entre protegidos", o salto por `ext` passa, e passa só porque o `verify` acusa o schema `ext` por outra linha (§7.5.3).

VERIFICAÇÃO: tudo rodado em 2026-09-23, PostgreSQL 16.15, nos containers `forja-b13-pg` (55520, arranjo) e `forja-b13-gate` (55522), **removidos ao fim** (zero `forja-b13-*`). `devstack-*`, `serve-offgrid-cms`, `forja-t9-*` e `forja-d9-*` não foram tocados.
- **Arranjo:** §7.2 pelo operador, depois `migrate`, `provision acme` e `provision globex` reais, pela cópia do `dist` de `db/migrator` feita no scratchpad, com o executor `forja_exec` não superusuário. O `verify` de base saiu `0`.
- **Typecheck e build:** `npx tsc --noEmit` saída 0; `npm run build` saída 0.
- **Suíte:**
  - gate com banco: `99 testes · 99 passando · 0 pulados · 0 todo`, saída 0. Arquivos vivos: app-credential-live (16), delegation-live (10), tenant-role-live (5);
  - `--no-database`: `99 · 68 passando · 31 pulados`, saída 0, nomeando os três arquivos vivos que não rodaram;
  - sem a variável: saída 1;
  - no fim, nenhum banco, papel ou schema de teste ficou no banco do gate.
- **Mutação no `dist`, numa cópia no scratchpad.** Cada uma foi revertida, e a cópia terminou idêntica por `sha256`:
  - `dep.nsp <> ref.nsp` trocado por `false` derruba os casos de delegação 2, 3, 4, 6, 7, 8 e 10;
  - `prosecdef` trocado por `false` derruba os casos de delegação 5 e 9;
  - exclusão do próprio schema trocada por `true` derruba 21 casos, entre eles o **caso 1 de delegação** (estrutura saudável dentro do schema) e o caso 1 de credencial;
  - destino restrito a `protegidos` derruba os casos de delegação 7 e 10;
  - cada ramo de `objetos` silenciado derruba um caso nomeado: `pg_class` (2, 3, 4, 6, 7, 8, 10), `pg_proc` (10), `pg_type` (10), `pg_constraint` (6), `pg_operator` (10), `pg_rewrite` (2, 3, 4, 7, 8, 10), `pg_trigger` (10), `pg_attrdef` (10), `pg_policy` (10);
  - `SUB-11`: tirar `('CREATE')` da sétima pergunta derruba o **caso 15**;
  - `SUB-12`: tirar papel `pg_%` de `assumidos` derruba o **caso 16**.
- **Gate (`SUB-10`), na cópia:**
  - sonda `todo` que falha: saída 1 (`98 passando · 1 todo`);
  - `delegation-live` fora do glob: saída 1, nomeando o arquivo;
  - os três vivos fora: `68 · 68 passando`, saída 1;
  - mutação do `SUB-03` com glob íntegro: 10 falhas; com `app-credential-live` fora do glob: `82 · 82`, saída **1**;
  - silenciar `passaram !== total` faz a sonda `todo` sair 0, e silenciar a checagem dos arquivos vivos faz o arquivo fora do glob sair 0. As duas condições são o que pega.
- **Servidor de verdade** (`node dist/src/main.js`, porta 55521, sonda em `/health`), com o `dist` final:
  - arranjo saudável: sobe, oito `ok`, `/health` 200;
  - regra: saída 78. O operador conferiu `1007/777` gravado em `t_globex` pela venda de acme. A recusa nomeia `rule espelho on table t_acme.orders (t_acme -> t_globex)`;
  - view materializada: acme lê 222; saída 78;
  - view: acme lê 222; saída 78;
  - `SECURITY DEFINER`: acme lê 222; saída 78, `function t_acme.relatorio()`;
  - chave estrangeira: `t_globex.espelho` reescrita para 2; saída 78;
  - salto por `ext_b13`: acme lê 222; saída 78;
  - gatilho e padrão chamando rotina de fora: grava `5009/999` em `t_globex`; saída 78;
  - saudável de novo depois de todos: sobe, 200;
  - em escala, com 602 schemas: saudável sobe; uma view em `t_b13n0300` sobre `t_globex` sai 78; saudável de novo sobe.
- **Não rodei** o `R4` (gate com banco servido pelo executor) nem o `verify` depois dos estados hostis (é de `db/**`), e não li `.env.example`.
- **Confiabilidade (`backend.md` §5):**
  - offline: banco fora do ar na subida continua sendo recusa, e a porta não abre;
  - repetição: a pergunta nova é leitura pura de catálogo, e repetir a subida não muda estado nenhum;
  - resposta perdida depois do commit: esta camada não faz commit. O único efeito externo é o fato de subida, que é melhor esforço e nunca lança. Nenhuma venda passa por aqui, porque a porta está fechada enquanto a conferência roda. O que muda é o custo de subida, medido acima.

MEMÓRIA SUGERIDA:
  - type=gotcha escopo=plataforma slug=security-definer-nao-deixa-dependencia — corpo `plpgsql` e `sql` entre cifrões não gravam em `pg_depend` o que leem; só `BEGIN ATOMIC` grava. Rotina `SECURITY DEFINER` se acusa por existência, nunca por dependência.
  - type=gotcha escopo=plataforma slug=delegacao-por-dono-salta-por-schema-de-fora — uma pergunta de dependência restrita aos schemas protegidos é contornada por uma view ou gatilho que passa por schema de fora (medido: leitura e escrita cruzando clientes). O destino tem de ser qualquer outro schema.
  - type=gotcha escopo=plataforma slug=troca-de-dono-de-schema-leva-o-usage-do-papel — ida e volta de `ALTER SCHEMA … OWNER TO` deixou o papel do cliente sem acesso ao próprio schema (`42501` observado; a causa pela fusão de ACL é inferência).
  - type=gotcha escopo=processo slug=gate-confere-arquivo-vivo-por-nome — o total cai junto quando o arquivo sai do glob; o que não envelhece é `pass === total` mais uma lista nomeada de arquivos que exercem o banco.

PRÓXIMO PASSO SUGERIDO: `seguranca`, na quarta auditoria do gate 3, sobre `delegation` (`src/db/credential-query.ts`, `src/db/credential-refusals.ts`), `scripts/run-tests.mjs` com `scripts/gate-reporter.mjs`, e os casos 15, 16 e `test/delegation-live.test.ts`. Duas perguntas que eu levantaria no lugar dele: (1) existe objeto que roda como o dono sem deixar linha em `pg_depend` e sem ser rotina `SECURITY DEFINER`? (2) o relator do gate pode ser enganado por um arquivo vivo que roda um teste trivial e pula o resto? Isso é contido por `pass === total`, mas vale atacar. `performance` entra pelo custo linear da delegação.

## thread — 2026-09-23 (validação da quarta rodada)

Conferido pelo thread em 2026-09-23: `npx tsc --noEmit` saída `0`; `npm run test:no-db` com
`99 testes · 68 passando · 0 falhando · 31 pulados · 0 todo`, saída `0`, nomeando os três arquivos vivos
que não rodaram. **O gate com banco não foi rodado pelo thread**: o número `99/99` é do autor.

Decisões sobre o que o autor levou além do brief, todas aceitas: o destino da dependência é **qualquer**
outro schema (medido: o salto por `ext` contornava o critério "entre protegidos"); `SECURITY DEFINER` se
acusa por existência; view com `security_invoker` não é desculpada. Resposta à pergunta ao `produto` sobre
`F-003`: aceito o texto proposto, "o fato não carrega o nome do que a recusa encontrou; a recusa carrega,
na saída de erro, com teto de cinco nomes", e o item atualiza de quatro para oito perguntas numa passada
do `produto`.

**A ficha continua aberta.** Falta a quarta auditoria do gate 3 (`seguranca`, com as duas perguntas do
autor) e a medida de `performance` do custo linear da delegação. As duas ficam **sem despacho**, por
pedido do humano de 2026-09-23. O lado do `verify` de `SUB-09` deve adotar o mesmo critério de destino;
isso vai para o `arquiteto-dados`, que está rodando o recorte 1 de `T-0009`.

## seguranca — 2026-09-23 (quarta auditoria, interrompida)

## RELATÓRIO — seguranca — T-0013 (quarta auditoria do gate 3)
STATUS: PARCIAL

FEITO:
- Copiei `db/`, `apps/` e `scripts/` para o scratchpad no começo, antes de qualquer leitura, por causa da edição paralela do `arquiteto-dados` em `db/**`. Guardei também o `sha256` de `apps/api/dist` (56 arquivos) e de `db/migrator/dist` (128 arquivos).
- Li a ficha a partir de "backend (quarta rodada)", a validação do thread e a terceira auditoria.
- Li `apps/api/src/db/credential-query.ts` inteiro, incluindo o CTE `objetos` e as duas colunas novas, `delegated_dependencies` e `definer_routines`.
- A sessão foi interrompida nesse ponto e não vou retomar a análise ofensiva neste despacho.

ARQUIVOS:
- `/home/mcastro/work/freelas/forja/tarefas/T-0013-conferencia-da-credencial-na-subida.md` (só leitura)
- `/home/mcastro/work/freelas/forja/docs/auditorias/2026-09-23-conferencia-da-credencial-na-subida-terceira.md` (só leitura)
- `/home/mcastro/work/freelas/forja/apps/api/src/db/credential-query.ts` (só leitura)
- `/home/mcastro/work/freelas/forja/docs/auditorias/2026-09-23-conferencia-da-credencial-na-subida-quarta.md` **não foi escrito**

NÃO FEITO:
- Pergunta (1) do autor: a medida dos candidatos a objeto que roda como o dono sem linha em `pg_depend` e sem ser `SECURITY DEFINER`.
- Pergunta (2) do autor: o ataque ao relator do gate com arquivo vivo que roda um teste trivial e pula o resto. Também ficaram sem conferir os dois pontos em que o `arquiteto-dados` diz que o gate de `apps/api` diverge do de `db/migrator` (o teste que o `node --test` inventa para arquivo vazio, e arquivo que usa banco fora da lista ou do glob).
- Não li `credential-refusals.ts`, `run-tests.mjs`, `gate-reporter.mjs`, os casos 15 e 16 nem `delegation-live.test.ts`.
- Não reproduzi as contagens `99/99` e `68 + 31`, e não rodei o servidor em estado hostil.
- **Não respondo se o gate 3 fecha, e não respondo a prioridade um desta rodada.** Sem medida, as duas respostas seriam palpite. Vale o que a terceira auditoria mediu: `SUB-09` e `SUB-10` seguravam o fechamento, e o `99/99` com banco continua sendo só a palavra do autor, porque o thread também não o rodou.

DECISÕES:
- Parei em vez de entregar conclusão sem a medida. Declarar o gate aberto ou fechado sem reproduzir nada seria aprovar, ou reprovar, por falta de evidência (`seguranca.md` Nunca).

RISCOS:
- Com esta rodada incompleta, o gate 3 fica sem veredito atual. `SUB-09` a `SUB-12` seguem com o estado da terceira auditoria até alguém reauditar.
- Uma leitura estática, que ainda não medi e fica rotulada como observação: `definer_routines` filtra `pg_proc` pelos schemas protegidos. Rotina `SECURITY DEFINER` em schema de fora, chamada por objeto de schema protegido, depende de a chamada deixar linha em `pg_depend`. O autor já declara fora a chamada direta pelo nome. O caso da chamada a partir de objeto protegido precisa de medida antes de virar achado ou nota.

PERGUNTAS:
  - para humano/orquestrador: a quarta auditoria vai para uma nova instância de `seguranca`, com o mesmo escopo? O ambiente está limpo para isso: nenhum container criado e nenhum `forja-s13-*` de pé.

VERIFICAÇÃO:
- Conferi no fim que `apps/api/dist` e `db/migrator/dist` estão idênticos por `sha256` à captura do começo (`diff` vazio nos dois).
- Zero containers `forja-s13-*`. Não subi nenhum container, não abri conexão com banco e não rodei suíte nem servidor.
- `127.0.0.1:5432`, `devstack-*`, `serve-offgrid-cms` e `forja-t9-*` não foram tocados. Não usei git e nada de segredo entrou em arquivo nenhum.

MEMÓRIA SUGERIDA: —

PRÓXIMO PASSO SUGERIDO: `seguranca`, nova instância, com o mesmo brief da quarta auditoria. As cópias em `/tmp/claude-1000/-home-mcastro-work-freelas-forja/8f2328e5-fe14-4cad-a506-7b31fbdfd7f2/scratchpad/{db-snap,apps-snap,api-dist-before.sha,mig-dist-before.sha}` servem de ponto de partida, desde que ela confira que a árvore não mudou desde 2026-09-23T20:35.

## thread — 2026-09-23

Quarta auditoria interrompida antes de medir, sem veredito. Não redespachei: é a segunda interrupção de trabalho ofensivo nesta sessão (a primeira foi no `PAP-28`), e repetir o mesmo caminho seria contornar o bloqueio. Fica para o humano decidir.

## thread — 2026-09-23 (permissão do humano)

O humano, em 2026-09-23: "eu concedo permissao para destravar! Avançe nas tres esperas." Redespachado.

## seguranca — 2026-09-23 (quarta auditoria, segunda tentativa, interrompida)

## RELATÓRIO — seguranca — T-0013 (quarta auditoria do gate 3, segunda tentativa)
STATUS: PARCIAL

Um classificador de segurança interrompeu minha resposta. Parei ali, como o brief manda, e não retomei o trabalho por outro caminho.

**Onde parou.** Logo depois da última leitura que terminou: o `cat` de `db/migrator/scripts/{arquivos-vivos.json,relator-por-arquivo.mjs,run-tests.mjs}`, feito na cópia do scratchpad. O classificador reteve o que veio depois dessa leitura, então não sei dizer que trecho exato o disparou. Quando parei, eu ainda não tinha subido nenhum container, aberto conexão com banco, rodado suíte ou servidor, nem feito mutação.

FEITO:
- Copiei `db/migrator` e `db/migrations` para `<scratchpad>/snap/` no começo, antes de qualquer leitura.
- Conferi às 21:00 que `apps/api/dist` (56 arquivos) e `db/migrator/dist` (128) continuam idênticos por `sha256` à captura de 20:35 da instância anterior.
- Li a ficha a partir de "backend (quarta rodada)", `credential-query.ts`, `run-tests.mjs`, `gate-reporter.mjs`, o começo dos três arquivos vivos (como cada um trata a ausência de banco) e o gate de `db/migrator`.

ARQUIVOS:
- `docs/auditorias/2026-09-23-conferencia-da-credencial-na-subida-quarta.md`: **não foi escrito**. Não havia medida para pôr nele.
- Todo o resto foi só leitura. No scratchpad escrevi apenas `snap/`, `api-dist-now.sha` e `mig-dist-now.sha`.

NÃO FEITO:
- Pergunta (1): nenhum candidato medido, e isso inclui a rotina `SECURITY DEFINER` fora dos schemas protegidos chamada por objeto protegido.
- Pergunta (2): não houve ataque ao gate nem reprodução das contagens `99/99` e `68 + 31`.
- **Não respondo se o gate 3 fecha, e não respondo a prioridade um desta rodada.** Continua valendo o estado da terceira auditoria: `SUB-09` e `SUB-10` seguravam o fechamento, e o `99/99` é só a palavra do autor.

DECISÕES:
- Parei no ponto da interrupção em vez de reformular e tentar de novo. Esta é a terceira interrupção de trabalho ofensivo na sessão, e contornar o classificador não é decisão minha.

RISCOS:
- Ficam duas observações que tirei só lendo o código, sem medir. Não viraram achado.
  - **Divergência entre os dois gates.** O relator de `db/migrator` descarta o teste que o `node --test` inventa para arquivo sem caso nenhum (ele sai com o nome do próprio arquivo) e conta só `details.type === 'test'`. O de `apps/api` (`gate-reporter.mjs:13-21`) não faz nenhuma das duas coisas. Então, em princípio, um arquivo vivo esvaziado contaria como executado. Falta medir.
  - **Arquivo com banco fora da lista.** O `db/migrator` procura arquivos que falam com o banco pela árvore inteira de `dist/test` e reprova o que estiver fora do glob ou fora da lista. O `apps/api` só confere os três nomes de `ARQUIVOS_VIVOS` (`run-tests.mjs:44-48`) e não enxerga arquivo novo com banco fora deles.
- Sem veredito atual, o gate 3 segue aberto de fato.

PERGUNTAS:
  - para humano: a auditoria segue por outro meio (você mesmo roda as medidas, ou aceita que a quarta rodada feche só com leitura estática, sem medida)? Ou fica suspensa? Redespachar o mesmo brief tende a parar no mesmo ponto.

VERIFICAÇÃO:
- `sha256` dos dois `dist`: iguais à captura de 20:35 (`diff` vazio).
- `docker ps -a` no começo mostrava só `devstack-s3`, `devstack-pg` e `serve-offgrid-cms`. Não criei nenhum `forja-s13-*` e não toquei em 127.0.0.1:5432.
- Não usei git, e nenhum segredo entrou em arquivo.

MEMÓRIA SUGERIDA: —

PRÓXIMO PASSO SUGERIDO: humano — decidir como fechar a quarta auditoria. Se for reaberta, o ponto de partida é `<scratchpad>/snap/`, conferindo antes que os dois `dist` ainda batem com `api-dist-before.sha` e `mig-dist-before.sha`.

Paths: `/home/mcastro/work/freelas/forja/tarefas/T-0013-conferencia-da-credencial-na-subida.md`, `/home/mcastro/work/freelas/forja/apps/api/scripts/gate-reporter.mjs`, `/home/mcastro/work/freelas/forja/apps/api/scripts/run-tests.mjs`, `/tmp/claude-1000/-home-mcastro-work-freelas-forja/8f2328e5-fe14-4cad-a506-7b31fbdfd7f2/scratchpad/snap/migrator/scripts/relator-por-arquivo.mjs`

## thread — 2026-09-23

Segunda tentativa interrompida pelo classificador, mesmo com a permissão dada pelo humano na conversa: a permissão da conversa não muda o classificador. Não redespachei a auditoria. Despachado em seu lugar o conserto defensivo das duas divergências de gate que a leitura estática achou.

## backend — 2026-09-23 (gate da suíte alinhado ao do migrator)

## RELATÓRIO — backend — T-0013
STATUS: OK. O ponto opcional (`delegation`) foi medido e a mudança pedida não foi aplicada, porque não teve efeito mensurável (ver DECISÕES).

FEITO:
- Relator do gate (`apps/api/scripts/gate-reporter.mjs`) reescrito na forma de `db/migrator/scripts/relator-por-arquivo.mjs`. Ele emite `{file}` só para `test:pass` com `details.type === 'test'`, sem `skip`/`todo`, e descarta o teste que o `node --test` inventa para arquivo sem caso nenhum (`resolve(name) === file`). Isso corrige a divergência 1.
- Executor (`apps/api/scripts/run-tests.mjs`): a lista saiu do script e foi para `scripts/live-files.json`, com nomes relativos a `dist/test`. O gate agora percorre `dist/test` inteiro e reprova na mesma forma do migrator: lista vazia, arquivo fora do glob, arquivo não declarado e arquivo não executado. A contagem por arquivo passou a ser relativa ao `cwd`, e não mais à raiz do pacote. Isso corrige a divergência 2.
- Criado `test/test-runner.test.ts`, com 6 casos sobre uma árvore de mentira: esvaziado, ausente, novo fora da lista, fora do glob, a contraprova e a lista não vazia.
- `README.md` atualizado: nova descrição do gate e contagem de 99 para 105.

ARQUIVOS:
- apps/api/scripts/gate-reporter.mjs (editado)
- apps/api/scripts/run-tests.mjs (editado, 258 linhas)
- apps/api/scripts/live-files.json (novo)
- apps/api/test/test-runner.test.ts (novo)
- apps/api/README.md (editado)
- db/migrator/scripts/* (só leitura)
- apps/api/src/db/credential-query.ts (só leitura)

NÃO FEITO: —

DECISÕES:
- **Marca de "fala com o banco" = a string `FORJA_TEST_DATABASE_URL` no `.js` compilado.** O migrator usa como marca a importação de `support/postgres.js`, que não existe em `apps/api`. Os três arquivos vivos leem a chave diretamente, e ela sobrevive à compilação (conferido: só esses três em `dist/`). Não exclui pasta `support`: um apoio que leia a chave em nome de outros cai como "fora do alvo", de propósito, porque esconderia a marca de quem o importa. O teste monta a chave em pedaços para não se autoclassificar (0 ocorrências no `.js` compilado).
- **Modo parcial mantido como estava**: roda tudo e os vivos pulam. Não adotei o alvo derivado do migrator porque isso ficava fora das duas divergências do brief.
- **`delegation`: não apliquei o filtro do lado dependente.** Medi em PG 16.15, com 602 schemas × (11 tabelas com PK, FK, CHECK e DEFAULT, 10 índices, 1 view), 139.562 linhas em `pg_depend`. São mais linhas que as 111 mil do README, porque não reproduzi a carga exata. Cada consulta foi a primeira de uma sessão nova, 7 rodadas cada, só a subconsulta de delegação, como superusuário:
  - atual: 316–343 ms;
  - com o filtro do lado dependente em CTE antes da junção: 316–344 ms, sem ganho. Cerca de 75% dos objetos com namespace já estão em schema protegido, então o filtro corta pouco. O restante é `pg_toast`;
  - `objetos AS NOT MATERIALIZED`, com ou sem o filtro: 147–160 ms. Porém, com `max_parallel_workers_per_gather = 0` volta a 325–363 ms. O ganho é só paralelismo: a inclinação não muda, e ele some em servidor sem workers.
  - `work_mem` de 64 MB também não muda nada (282–323 ms), embora o plano atual tenha ordenação que vai para disco.
  - Não apliquei nenhuma das duas mudanças: a primeira não tem efeito, e a segunda depende de configuração do servidor, numa consulta de segurança. Não medi a consulta inteira pelo caminho real da credencial.

RISCOS:
- **HEAD está inconsistente.** O commit `1d84811` ("Estabelecer a fundação do servidor em apps/api"), feito por outra sessão durante esta tarefa, capturou `scripts/live-files.json` e `test/test-runner.test.ts` junto com as versões antigas de `run-tests.mjs` e `gate-reporter.mjs`. Nesse commit, `test-runner.test.ts` falha 5 de 6. Os scripts corrigidos estão só na working tree (`M`). Não mexi em git.
- `dist/` não é limpo pelo `tsc`: um `.test.ts` apagado deixa o `.js` antigo rodando no glob. Vale nas duas suítes, e está fora do escopo.
- Divergências restantes entre as duas suítes, fora do brief:
  - no api, `todo` só reprova no gate; no migrator, reprova nos dois modos;
  - no api, o modo parcial não confere `passaram + pulados === total`;
  - no api, falha na leitura do resumo não imprime o motivo.
- `apps/api/.env.example` está sem rastreio na árvore e não é meu.

PERGUNTAS:
- para orquestrador/performance: aceitar `NOT MATERIALIZED` em `objetos`? A semântica é a mesma (um snapshot só), e o ganho de cerca de 2× depende de workers paralelos. Ou abrir item próprio para uma reformulação que reduza o custo serial?

VERIFICAÇÃO:
- **Antes**, com os scripts antigos numa árvore de mentira que tem `scripts/` e `dist/test`: arquivo vivo esvaziado saiu `0`; arquivo novo lendo a chave fora da lista saiu `0`. O `test-runner.test.ts` contra os scripts antigos deu 1 de 6 passando.
- **Depois**, na mesma árvore: esvaziado saiu `1` ("não executado: delegation-live.test.js"); novo saiu `1` ("não declarado: novo-live.test.js"); limpo saiu `0`. O `test-runner.test.ts` deu 6 de 6.
- **Árvore real `dist/test`, com banco**:
  - cópia `extra-live.test.js` → saída `1`, não declarado;
  - `tenant-role-live.test.js` esvaziado → saída `1`, não executado;
  - depois de recompilar com `tsc` → saída `0`.
- `npm run typecheck` → `0`.
- `npm run test:no-db` → `0`, com 105 testes, 74 passando e 31 pulados.
- `npm test` sem banco → `1`.
- **Gate completo** com Postgres 16.15 descartável `forja-b13-pg16` em 127.0.0.1:55520 → `0`, com 105 de 105 passando e 3 arquivos vivos exercidos.
- O contêiner foi removido. A porta 5432 não foi tocada.

MEMÓRIA SUGERIDA:
- type=gotcha escopo=plataforma slug=gotcha-node-test-inventa-teste-para-arquivo-vazio — arquivo de teste sem caso sai como `test:pass` com o nome do próprio arquivo e `type: 'test'`; relator por arquivo precisa descartar `resolve(name) === file` (Node 22.23.1, 2026-09-23).
- type=gotcha escopo=plataforma slug=gotcha-delegation-custo-e-paralelismo-nao-filtro — filtrar o lado dependente não barateia a pergunta `delegation` (75% dos objetos são protegidos); `NOT MATERIALIZED` corta cerca de 2× só com workers paralelos, e o custo serial fica em cerca de 330 ms com 139 mil linhas em `pg_depend`.

PRÓXIMO PASSO SUGERIDO: seguranca — conferir o gate novo de `apps/api` (a marca pela chave do banco e as três recusas por arquivo) e o estado do HEAD `1d84811` antes do próximo commit.

## thread — 2026-09-23

`NOT MATERIALIZED` recusado: o ganho depende de workers paralelos, numa consulta de segurança. O custo serial (~330 ms com 139 mil linhas em `pg_depend`) fica abaixo do teto de 1 s; medir no pior cliente é do gate de `performance` da Fase 2. O HEAD publicado (`1d84811`) tem os scripts antigos com o teste novo, que falha 5 de 6; o próximo commit corrige.

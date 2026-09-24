---
id: T-0011
backlog: F-002
titulo: Fundação do servidor — borda, tenant, erro e ponte para o banco
status: fechada
escopo: cliente=- vertical=- modulo=- camada=backend
aberta_em: 2026-09-11
---

## Pedido

O humano, em 2026-09-11: *"Não dá pra pôr o backend pra jogo não?"*

Ficha própria porque `T-0009` é `camada: dados` e lista `apps/api` em **FORA DE ESCOPO** com todas as
letras — o `backend` recusou escrever a seção dele lá e pediu ficha nova, corretamente.

## Decisão que destravou

`D-01` fechou no mesmo dia: **Fastify e Kysely**
([[decision-d-01-fastify-e-kysely]]). Kysely venceu por uma **ausência**: não tem motor de migration
próprio, então o conflito com o executor nosso deixa de existir em vez de ser administrado.

## backend — 2026-09-11 — a fundação

`STATUS: PARCIAL`, declarado. Entregue em `apps/api/**`: TypeScript estrito, Fastify 5, Kysely, `pg`,
mais TypeTypeBox para o schema ser fonte única do validador **e** do tipo.

**As duas travas que ele fez estruturais em vez de disciplinares**, e é o que mais importa nesta
entrega:

1. O resolvedor de tenant recebe **só** o sujeito autenticado — `body`, `query`, cabeçalho e path
   estão fora **por assinatura**, não por revisão de código.
2. A raiz do Kysely **não é exportada** para rota nenhuma; o handle só existe já preso ao schema.
   "Função de dados com tenant opcional" não é algo que alguém precise lembrar de evitar: não há como
   escrever.

**Verificado de fato:** type check limpo · 27 testes, 27 passando · servidor subindo em
`127.0.0.1`, `GET /health` em 200 e rota desconhecida sem identidade em **401, não 404** (não
enumera superfície) · contra PostgreSQL 16.15 com pool de `max: 1`, dois clientes na **mesma conexão
física** leram cada um o seu, com isca plantada em `public` que nunca apareceu · sem
`FORJA_DATABASE_URL` o processo sai com código de configuração e nomeia a chave que falta · nenhum
segredo na árvore versionada.

**Não feito, com o impedimento nomeado em cada um:** provedor de identidade e diretório de clientes
reais (`D-03` ABERTA — os dois padrões **recusam tudo**, e ele declara que isso é a política, não
implementação faltando); destino durável do fato de borda (`D-06` ABERTA — o padrão escreve JSON na
saída padrão e o arquivo **declara em letras que aquilo não é trilha**); nenhuma rota de negócio.

## Fica para depois, com dono

- Gate 3 sobre a borda — `seguranca`
- O mapa identidade→schema sem `USAGE` em `platform`: conexão própria com papel próprio, ou mapa
  resolvido de fora? — `arquiteto-dados` + `seguranca`
- Recusa na borda produz motivo de recusa do domínio? Nenhum dos nove a descreve — `produto`
- Endereço de rede do chamador entra no fato de borda? Hoje **não** entra, falha fechado por ser dado
  pessoal; o custo é não distinguir varredura de terminal com defeito — **humano**
- Não há `package.json` na raiz. Quando `db/migrator/**` virar código, alguém decide monorepo por
  acidente ao criar o segundo pacote — e `packages/**` está proibido até a fase que o cria

## seguranca — 2026-09-11 (gate 3 sobre a borda)

Relatório completo em `docs/auditorias/2026-09-11-delta-db-e-borda-api.md` (escopo B, §0, §3, §4,
§5 e §7). O denso:

**Passa no gate 3 para o que ela é hoje.** As duas travas estruturais seguram no caminho da
requisição, e foram testadas, não lidas: tenant por assinatura, contexto só depois da resolução,
`tenantOf` falhando fechado com 500 e fato, rota nascendo fechada, rota desconhecida sem identidade
em **401** (medido em `GET`, `POST`, `HEAD` e `OPTIONS`), `x-request-id` do chamador ignorado. Os
dois provedores de `D-03` **recusam tudo, e isso é verdade no código** — a única implementação que
não recusa vive em `test/border.test.ts` e `main.ts` nunca a liga. Nenhum segredo na árvore.
`typecheck` limpo e 27/27 testes, rodados por mim.

**A medida do autor sobre o pool confere, e a solução nova não tem o problema simétrico.** Reproduzi
o vazamento do `search_path` (a conexão volta com o alvo do cliente anterior) e medi a alternativa:
o Kysely emite `select "dono" from "t_globex"."orders"` e a consulta sem escopo na mesma conexão cai
em `public`, nunca no cliente anterior. Não há fragmento `sql` cru em `src/` hoje.

**Achados, todos com dono `backend`:** `SEC-06` [MÉDIO] a guarda "rota não casou não produz fato" é
ela própria um oráculo de existência de rota — 226,3 µs × 139,6 µs em 3000 amostras, dos quais ~53 µs
são a escrita do fato (medido no processo, não pela rede) · `SEC-07` [MÉDIO] o canal de fato é
dirigido por quem não tem credencial: 273 bytes por requisição anônima, sem teto · `SEC-08` [MÉDIO]
`x-request-id` publica o contador global de cunhagem de id em `/health`, e é o que decide se ela sai
do loopback · `SEC-09` [BAIXO] o buraco declarado do SQL cru falha em silêncio e podia falhar alto,
fixando o `search_path` do pool · `SEC-10` [BAIXO] `EPIPE`/`EPERM`/`EBUSY` são lidos como `SQLSTATE`
e a pilha some do log · `SEC-11` [BAIXO] `scope_not_resolved` separa credencial válida de inválida ·
`SEC-12` [BAIXO] `RootDb` e `TenantDb` são o mesmo alias, então o compilador não distingue handle
preso de handle solto, e `createRootDb` é exportado.

**A pergunta que o autor fez, respondida:** a guarda não perde sinal de ataque que valha a pena —
varredura é volume e volume é do log de acesso, como ele mesmo escreveu. O defeito dela é outro: é o
que torna o caminho não autenticado assimétrico (`SEC-06`).

**`/health` passa como está, enquanto for `127.0.0.1`.** O que decide a saída do loopback é `SEC-08`,
e é só isso.

**Antes da primeira rota de negócio, nesta ordem:** `SEC-12` (marcar o tipo do handle, custa nada com
zero rota) · `SEC-09` (fixar o `search_path` do pool) · `SEC-06` + `SEC-07` com o limite de taxa, que
é pré-requisito dos dois e não item separado · `SEC-10` · e o mapa identidade→schema sem `USAGE` em
`platform`, que ele já roteou e que é onde a pergunta de IDOR volta a existir.

## backend — 2026-09-11 — a borda assume o papel do cliente

## RELATÓRIO — backend — T-0011
STATUS: OK
FEITO:
- Fechei `PAP-05`: a transação de cliente assume `app_t_<slug>` com `set_config('role', $1, true)`
  logo depois do `begin`, e o larga no `COMMIT` e no `ROLLBACK`. Os dois comentários que mandavam o
  próximo leitor para a decisão revogada foram reescritos (`pool.ts`, `tenant-db.ts`).
- `TenantContext` deixou de entregar handle e passou a entregar **transação**. Handle pronto para
  consultar fora de transação seria a credencial nua, que não alcança schema nenhum: pedir um seria
  pedir `42501`.
- Fechei `PAP-04` por mecanismo, não por frase: o pool da aplicação força **protocolo estendido** em
  toda consulta, então o servidor recusa mais de um comando por mensagem mesmo com zero parâmetro.
- Fechei `SEC-12`: `RootDb` e `TenantDb` viraram tipos **marcados** e mutuamente inatribuíveis, no
  padrão da marca de `Principal`. Só `tenantTransactionRunner()` produz um `TenantDb`.
- 12 testes novos (7 sem banco, 5 contra Postgres real), e os dois sentidos rodados.
ARQUIVOS:
- `apps/api/src/db/tenant-role.ts` (novo) — nome do papel, o executor de transação, o porquê medido
- `apps/api/src/db/pool.ts` (editado) — envelope de protocolo estendido; comentário de `:13` corrigido
- `apps/api/src/db/tenant-db.ts` (editado) — marcas de tipo; o texto que instruía o contrário do papel
- `apps/api/src/tenant/context.ts` (editado) — `db` → `transaction`
- `apps/api/src/http/server.ts` (editado) — a borda monta o executor na resolução do cliente
- `apps/api/test/tenant-role.test.ts` (novo) — ordem, parâmetro ligado, qualificação, marca de tipo
- `apps/api/test/tenant-role-live.test.ts` (novo) — a prova contra Postgres, pulada sem a variável
- `apps/api/test/border.test.ts` (editado) — o duplo de raiz declara que é duplo; contexto entrega transação
- `apps/api/README.md` (editado) — a consequência declarada e como rodar a prova
NÃO FEITO: —
DECISÕES:
- **O contexto entrega transação, não handle.** Alternativa descartada: handle preguiçoso que abrisse
  transação sozinho na primeira consulta. Ele esconderia o limite da transação de quem escreve a rota
  — e numa rota que move dinheiro, saber onde a transação começa e termina **é** a regra, não detalhe
  de infraestrutura.
- **Protocolo estendido em todo o pool**, em vez de crivo de texto ou de "exigir ao menos um
  parâmetro". Crivo de texto é o mecanismo que o lado do banco já recusou; exigir parâmetro puniria
  consulta estática legítima e ensinaria a inventar parâmetro de mentira. O trade-off aceito: toda
  consulta paga Parse/Bind, inclusive `begin` e `commit`. **Não medi o custo disso** — é o primeiro
  número que `performance` deve tirar quando existir rota.
- **Marca em `RootDb` também**, não só em `TenantDb`. Marcar um só deixaria a raiz atribuível onde se
  espera cliente. O preço é uma conversão declarada em `createRootDb` e outra no duplo de teste, e
  esse preço é o ponto: fora desses dois lugares, ninguém produz raiz sem dizer que está produzindo.
- **`app_` + nome do schema é derivado, nunca configurado.** Tabela de-para é a coisa que desencontra
  (`db/papel-do-cliente.md` §7.1), e a forma do schema é conferida ao montar o executor — antes de
  existir conexão, não na primeira consulta.
RISCOS:
- **Toda requisição de cliente passa a segurar uma conexão do pool durante uma transação aberta.**
  `idle_in_transaction_session_timeout` (10 s, valor escolhido e nunca medido) deixa de ser enfeite e
  vira o que derruba uma rota que chame serviço externo de dentro da transação. Quem escrever a
  primeira rota que fale com adquirente ou com fisco precisa disso fora da transação.
- **O resíduo da `decision` continua existindo e a contenção é de borda.** A credencial é membro dos N
  papéis, então trocar de cliente dentro da transação é privilégio que ela tem. O que fechei foi o
  **canal** (multi-statement); o que não fecha por mecanismo de banco é um `SET ROLE` emitido de
  propósito por código nosso. Isso é vigilância de revisão, e o teste do texto hostil é o que acusa
  se o canal reabrir.
- **`SEC-09` mudou de tamanho, e é inferência, não medida.** Fragmento cru sem qualificação caía em
  `public` em silêncio; com o papel assumido e o `REVOKE` do `public` da §7.2, ele deveria passar a
  levar `42501`. **Não medi esse caso específico** — quem pegar `SEC-09` mede antes de decidir se
  ainda precisa fixar `search_path` no pool.
- O `Client` não documentado do `pg` é repassado ao Kysely para a conexão de controle que cancela
  consulta. Essa conexão **não** passa pelo envelope de protocolo estendido. Ela não assume papel e
  só emite `pg_cancel_backend`, então não alcança dado de cliente; se algum dia ela emitir outra
  coisa, o envelope precisa alcançá-la.
PERGUNTAS:
  - para arquiteto-dados: o `verify` confere que a credencial tem `INHERIT FALSE` (`PAP-01`)? A borda
    depende disso: com herança ligada, a credencial alcança os N schemas **sem** assumir papel, e todo
    o desenho vira decoração sem nenhum sintoma.
  - para humano: o teste contra banco fica fora do `npm test` padrão (pula sem
    `FORJA_TEST_DATABASE_URL`) ou entra no gate de release com um Postgres descartável no processo de
    integração?
VERIFICAÇÃO: **medido, não descrito.** PostgreSQL **16.15** em container descartável, derrubado ao
fim (conferido: nenhum papel e nenhum schema `probe` sobrou; as senhas foram sorteadas em execução e
apagadas, nada em arquivo do repositório).
- `npm run typecheck` limpo. `npm test` **sem** banco: 39 testes, **34 passando, 5 pulados**. **Com**
  banco: **39 passando, 0 falhando**.
- Credencial nua lendo schema de cliente: `42501 permission denied for schema`.
- Pool `max: 1`, dois clientes, **mesma conexão física** (mesmo `pg_backend_pid` nas quatro idas):
  cada um leu só o seu (111 e 999), `current_user` foi `app_t_…_a` e `app_t_…_b` dentro, e voltou a
  ser a credencial depois de cada `COMMIT`.
- Com o papel de A assumido, ler o schema de B: `42501`.
- Texto hostil `select 1; set role app_t_…_b; select 1` — pelo pool da aplicação: `42601 cannot
  insert multiple commands into a prepared statement`, e a sessão continua a credencial. Pelo `pg`
  nu, com zero parâmetro: **aceito**, três resultados, e `current_user` vira o outro cliente no meio
  da transação. Medi também que, sem `LOCAL`, o papel **atravessa o `COMMIT`** e a conexão volta ao
  pool lendo o outro cliente sem erro nenhum.
- **Os dois sentidos, rodados:** troquei `true` por `false` no `set_config` e tirei o modo estendido
  do pool. Resultado: **4 testes falharam** (22, 24, 29, 31) e passaram a 35/39. Restaurado, 39/39.
  Tirar o campo `queryMode` por inteiro nem compila — a marca do tipo local pega antes do teste.
MEMÓRIA SUGERIDA:
  - type=gotcha escopo=plataforma camada=backend slug=protocolo-simples-do-pg-aceita-multi-statement —
    `pg` escolhe protocolo simples quando a consulta não tem **nenhum** parâmetro, `values: []`
    inclusive, e ali o servidor aceita lista de comandos; a propriedade que contém não é
    "parametrizar", é "ter parâmetro" — e `queryMode: 'extended'` (real em `pg` 8.23.0, ausente em
    `@types/pg` 8.23.1) fecha o canal no mecanismo em vez de na lembrança
  - type=convention escopo=plataforma camada=backend slug=alcance-de-schema-e-privilegio-nao-escolha —
    toda leitura e toda escrita de cliente abrem transação, porque a credencial nua não alcança schema
    nenhum; o único caminho legítimo sem cliente é o que não toca banco, e o mapa identidade→schema
    **não pode** usar este pool
PRÓXIMO PASSO SUGERIDO: `seguranca` — reauditar `PAP-04` e `PAP-05` contra o que passou a existir em
`apps/api/src/db/**`, com atenção a dois pontos que eu não posso me auto-aprovar: a conexão de
controle do `pg` fora do envelope de protocolo estendido, e se a contenção de borda continua válida
quando `PAP-01` (`INHERIT FALSE` na credencial) ainda está aberto no lado do banco.

## seguranca — 2026-09-11 (gate final da borda)

## RELATÓRIO — seguranca — T-0011
STATUS: OK
FEITO:
- Medi a camada de papel do lado do servidor contra Postgres 16.15, com o artefato de produção
  (`createPool`, `createRootDb`, `tenantTransactionRunner`), não com réplica.
- Rodei a suíte: `39 tests · 39 pass · 0 fail`, saída `0`.
- `PAP-05` **fechado e medido**: dentro da transação, `current_user = app_t_acme` e
  `session_user = forja_credencial`; o próprio schema lê, o do vizinho dá
  `42501 permission denied for schema t_globex`.
- `PAP-04` **fechado no mecanismo**: `queryMode: 'extended'` forçado mesmo com `values: []`
  (`apps/api/src/db/pool.ts:70-101`), coberto por teste vivo.
- `SEC-12` **fechado**: as duas marcas de tipo existem e são mutuamente inatribuíveis
  (`apps/api/src/db/tenant-db.ts:24` e `:36`); só `tenantTransactionRunner` produz `TenantDb`.
- **Nenhum achado novo em `apps/api`.** Os seis achados desta rodada são todos de `db/**` e estão em
  `T-0009`.
ARQUIVOS: docs/auditorias/2026-09-11-gate-final-camada-de-papel.md (novo) · `apps/api/**` só leitura
NÃO FEITO: —
DECISÕES:
1. **A conexão de controle do `pg` não vira achado.** Li o uso no Kysely: `pool.Client` só serve a
   `select pg_cancel_backend(<pid>)` e `select pg_terminate_backend(<pid>)`, com o `pid` vindo do
   `processID` produzido pelo servidor. Nenhum identificador de fora entra no texto, ela não assume
   papel, e nada em `apps/api` dispara cancelamento hoje. O que ela é: a única exceção declarada ao
   invariante "todo texto desta conexão carrega parâmetro ligado", e a declaração de `pool.ts:112-117`
   está correta.
2. **`FORJA_DATABASE_URL` fica como recomendação, não como achado.** Ele é o gêmeo exato do `PAP-07` do
   outro lado da parede: nomeia o sujeito legítimo por configuração e nada o confronta com o catálogo.
   Medido, os dois desvios plausíveis falham fechado ou ficam contidos, então não há cenário hoje. O
   que me incomoda é **quem** os fecha: o executor apontado ali para de funcionar por `set_option = f`
   do `CREATEROLE` do 16, propriedade do servidor, não nossa.
RISCOS:
- Recomendação, com dono: `apps/api` conferir na subida a própria credencial contra o catálogo, na
  mesma forma da §7.7 (existe, tem `LOGIN`, é membro de `forja_app` sem `admin_option`, e nenhuma
  concessão dela é herdável). Sem a última cláusula, o `PAP-13` do lado do banco é invisível do lado do
  servidor, que é onde ele custa: a credencial com uma concessão herdável residual alcança todo cliente
  fora de transação, e a borda não tem como saber.
- `apps/api/src/tenant/context.ts:57-64`: o diretório padrão não resolve ninguém, por `D-03` aberta.
  Falha fechado, e continua sendo o certo enquanto a decisão não existir.
PERGUNTAS: —
VERIFICAÇÃO: suíte de `apps/api` rodada contra banco de verdade (`39/39`, saída `0`). Sondas `Q10`,
`Q11` e `Q15` do relatório: a borda com a credencial correta, com o executor e com superusuário na
`FORJA_DATABASE_URL`. Leitura dirigida de `kysely/dist/dialect/postgres/postgres-driver.js:25` e
`:163-192` para a conexão de controle.
MEMÓRIA SUGERIDA:
- type=gotcha escopo=plataforma camada=backend slug=conexao-de-controle-do-kysely-fica-fora-do-envelope —
  `pool.Client` é repassado ao Kysely e não passa pelo envelope de protocolo estendido; hoje é inerte
  porque o texto é template com `pid` do driver, e deixa de ser no dia em que carregar valor de fora.
PRÓXIMO PASSO SUGERIDO: none. `T-0011` pode fechar; a recomendação de conferir a própria credencial na
subida é trabalho novo e cabe em item de backlog, com dono `backend`.


## Fechamento — 2026-09-12

ENTREGUE: a fundação do servidor em `apps/api/**` — borda Fastify com validação de entrada, tenant
resolvido uma vez a partir do sujeito autenticado, forma única de erro, ponte Kysely para o banco, e
a **camada de papel do lado do servidor**: toda leitura e toda escrita de cliente rodam em transação
com `app_t_<slug>` assumido por `set_config('role', $1, true)` e largado no `COMMIT`. Três achados
da rodada anterior fecharam medidos: `PAP-04` (protocolo estendido forçado no pool, que faz o
servidor recusar multi-statement mesmo com zero parâmetro), `PAP-05` (papel assumido por transação) e
`SEC-12` (`RootDb` e `TenantDb` viraram marcas mutuamente inatribuíveis; só `tenantTransactionRunner`
produz handle de cliente).

ARQUIVOS:
- `apps/api/src/db/pool.ts`, `db/tenant-db.ts`, `db/tenant-role.ts`, `tenant/context.ts`,
  `http/server.ts`, `apps/api/README.md`
- `apps/api/test/tenant-role.test.ts`, `test/tenant-role-live.test.ts`, `test/border.test.ts`
- `docs/auditorias/2026-09-11-delta-db-e-borda-api.md` (gate 3) e
  `docs/auditorias/2026-09-11-gate-final-camada-de-papel.md` (gate final, §5 veredito 2)
- `memory/plataforma/convention-alcance-de-schema-e-privilegio-nao-escolha.md` (novo),
  `memory/plataforma/gotcha-conexao-de-controle-do-kysely-fica-fora-do-envelope.md` (novo),
  `memory/plataforma/INDEX.md` (duas linhas)

VERIFICAÇÃO: **do fechamento, por mim, em 2026-09-12** — só leitura dirigida, nada rodado: os
símbolos que a auditoria cita continuam existindo onde ela diz (`pool.ts:112-117` com a conexão de
controle declarada, `tenant-db.ts:24` e `:36` com as duas marcas, `tenant-role.ts:61` com o
`set_config` local, `tenant/context.ts:30` entregando executor de transação). Varredura de segredo em
`apps/api/src/**`, `apps/api/test/**` e `README.md`: nenhuma ocorrência; `apps/api/.env.example` **não
consegui ler** (negado pela permissão do ambiente), então quanto a ele fico com a afirmação dos dois
agents de que carrega placeholder.
**Da tarefa, medido pelos agents em 2026-09-11**, PostgreSQL 16.15 em container descartável: suíte
`39/39` contra banco de verdade (sem banco, 34 passando e 5 pulados), `typecheck` limpo, os dois
sentidos do fix rodados (trocando `true` por `false` no `set_config` e tirando o modo estendido:
35/39, quatro testes caem; restaurado, 39/39). `seguranca` repetiu a suíte com o artefato de produção
e mediu `current_user = app_t_acme` dentro da transação, `session_user = forja_credencial`, e
`42501 permission denied for schema t_globex` no vizinho.

PRONTO:
- **Regra de negócio numerada em `docs/produto/**`** — não se aplica: a entrega é fundação de borda e
  infraestrutura de isolamento; nenhuma regra de negócio nova nasceu aqui, e nenhuma rota de negócio
  existe. O que governa esta camada é decisão de plataforma, registrada
  ([[decision-papel-de-aplicacao-assumido-por-transacao]]), não `RN`.
- **Teste do caso concreto** — cumprido: 12 testes novos (7 sem banco, 5 contra Postgres real),
  incluindo o texto hostil `select 1; set role app_t_…_b; select 1` recusado com `42601` pelo pool da
  aplicação e **aceito** pelo `pg` nu, que é a prova de que o fecho é de mecanismo e não de
  disciplina. Os dois sentidos rodados e declarados.
- **DDL / `migrations.md` §10** — não se aplica: nenhum arquivo de `db/**` foi tocado nesta ficha; a
  camada de papel do lado do banco é `T-0009`.
- **Gate de `seguranca` sobre endpoint** — cumprido, e duas vezes: gate 3 sobre a borda
  (`docs/auditorias/2026-09-11-delta-db-e-borda-api.md`) e o gate final sobre a camada de papel
  (`docs/auditorias/2026-09-11-gate-final-camada-de-papel.md`, §5 veredito 2: **`T-0011`: sim**, nada
  novo em `apps/api`, a única sobra é recomendação).
- **Gate de `performance`** — não se aplica hoje: não há rota de negócio, consulta de lista,
  relatório nem tela. Fica nomeado o primeiro número que `performance` deve tirar quando a primeira
  rota existir: o custo de Parse/Bind imposto a **toda** consulta pelo protocolo estendido, inclusive
  `begin` e `commit`, que o autor declarou não ter medido.
- **Decisão não óbvia virou memória** — cumprido, abaixo.
- **Nada de segredo** — cumprido no que pude conferir (ver `VERIFICAÇÃO`); as senhas do container de
  prova foram sorteadas em execução e não ficaram em arquivo.
- **`MEMÓRIA SUGERIDA` avaliada** — cumprido, as três:
  1. `gotcha` · `protocolo-simples-do-pg-aceita-multi-statement` — **já escrita** em
     `memory/plataforma/`, com `tarefa: T-0011`. Confirmei o conteúdo e a linha de índice; nada a
     acrescentar.
  2. `convention` · `alcance-de-schema-e-privilegio-nao-escolha` — **escrita**, em
     `memory/plataforma/`. Não foi fundida à `decision` do papel por transação porque o fato é outro:
     lá está a escolha do arranjo no banco, aqui está a consequência no **contrato da borda** (o
     contexto entrega executor de transação, nunca handle; e o caminho que precisa de `platform` não
     cabe neste pool). Quem lê a decisão não descobre o contrato; quem lê o contrato não precisa da
     prova de cinco arranjos.
  3. `gotcha` · `conexao-de-controle-do-kysely-fica-fora-do-envelope` — **escrita**, em
     `memory/plataforma/`. Vale registro apesar de inerte: é a única exceção declarada ao invariante
     do envelope, e exceção inerte é exatamente a que ninguém lembra no dia em que deixa de ser.
- **Ficha com plano e relatórios** — cumprido **em parte, e declarado**: as duas seções finais
  (`backend` e `seguranca` de 2026-09-11) estão **verbatim**. As duas primeiras
  (`backend — a fundação` e `seguranca — gate 3 sobre a borda`) estão em **resumo**, não no formato de
  relatório, e não há plano do `orquestrador` colado — a ficha nasceu de um pedido direto do humano
  ("não dá pra pôr o backend pra jogo não?"), com o `backend` recusando escrever em `T-0009`. Não
  reescrevo seção de outro agent, então fica registrado aqui: o conteúdo daquelas duas está integral
  nas auditorias citadas, e é lá que a prova vive.
- **Índices** — `tarefas/INDEX.md` e `docs/backlog/INDEX.md` são do thread principal, na mesma
  passada deste fechamento.

SOBROU:
- **`apps/api` conferir a própria credencial contra o catálogo na subida** — dono `backend`, e é
  trabalho novo: vira item de backlog escrito pelo `produto`, não foi criado aqui. A pergunta, de uma
  linha, na forma da §7.7 do lado do banco: a credencial existe, tem `LOGIN`, é membro de `forja_app`
  **sem `admin_option`**, e **nenhuma concessão dela é herdável**. É a última cláusula que compra o
  que falta: sem ela, o `PAP-13` do lado do banco é invisível do lado do servidor, que é onde ele
  custa — credencial com concessão herdável residual alcança todo cliente **fora** de transação, e a
  borda não tem como saber. Recomendação da auditoria (§3, ponto 1), não defeito: hoje os desvios
  plausíveis falham fechado, mas quem os fecha é propriedade do servidor (`set_option = f` do
  `CREATEROLE` do 16), não nossa.
- **A exceção declarada de `apps/api/src/db/pool.ts:112-117`** — dono `backend`. A conexão de
  controle do `pg` é o único texto que sai sem parâmetro ligado; é inerte enquanto for template com o
  `pid` vindo do driver, e deixa de ser no dia em que alguém passar `controlClient` com valor de
  fora. O comentário de lá explica o repasse do `Client`; o que falta é a cláusula dizendo que aquilo
  **é** a exceção ao envelope de protocolo estendido e o que a reativa. Exceção que só vive em
  auditoria não é lida por quem edita o arquivo.
- **`SEC-06`, `SEC-07`, `SEC-08`, `SEC-09`, `SEC-10`, `SEC-11`** — dono `backend`, na ordem que a
  auditoria de gate 3 fixou, e **antes da primeira rota de negócio**. `SEC-09` mudou de tamanho com o
  papel assumido e virou inferência, não medida: quem o pegar mede antes de decidir se ainda precisa
  fixar `search_path` no pool.
- **O mapa identidade→schema sem `USAGE` em `platform`** — dono `arquiteto-dados` + `seguranca`. É
  onde a pergunta de IDOR volta a existir, e está preso a `D-03`.
- **`D-03` e `D-06` seguem ABERTAS** — humano. Enquanto isso, os dois provedores de identidade
  recusam tudo (é política declarada, não implementação faltando) e o fato de borda sai em JSON na
  saída padrão, com o arquivo declarando que aquilo não é trilha.
- **O teste contra banco entra no gate de release ou fica fora do `npm test`?** — humano. Hoje pula
  sem `FORJA_TEST_DATABASE_URL`, e a consequência é a suíte poder dizer `0 fail` sem ter provado esta
  camada.
- **Não há `package.json` na raiz** — fica anotado: quando `db/migrator/**` virar código, alguém
  decide monorepo por acidente ao criar o segundo pacote, e `packages/**` está proibido até a fase que
  o cria.

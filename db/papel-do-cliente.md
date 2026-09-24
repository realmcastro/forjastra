# O papel de banco de um cliente — §7

> Parte de `db/papeis-e-credencial.md`, e continua a numeração dela: aqui moram a **§7.1** a **§7.4**,
> a **§7.6** e a **§7.7**. A prova de que o ato funcionou mora em `db/verificacao-do-papel.md` (§7.5,
> §7.5.1, §7.5.2) e em `db/universo-e-declaracao.md` (§7.5.3, §7.5.4).
> Nasceu em 2026-09-11, quando o humano fechou o arranjo de papel (§6.2) e decidiu que criar papel,
> conceder e revogar são **passos do `provision`** — não script à parte, não runbook.
> O motivo é o que o gate de `seguranca` apontou duas vezes: artefato separado é artefato que alguém
> esquece de rodar, e "o ato que cria o papel não é artefato" era o que tornava esta camada
> inverificável. Sendo passo do mesmo comando que cria o schema, ele não pode ser pulado — quem
> provisiona cliente provisiona o papel dele, no mesmo ato, ou o comando falha.
> Mora em arquivo próprio pelo teto de 400 linhas, que é a mesma razão de o contrato ter sido partido.
> Revisto em 2026-09-12, no sétimo gate
> (`docs/auditorias/2026-09-12-reauditoria-camada-de-papel.md`, `PAP-19` a `PAP-23`): a §7.4 ganhou
> dois desfechos, e a §7.7 passou a dizer **por qual comando** a rotação acontece, porque a exclusão
> da §7.5.1 deixou de ser inferida do grupo e passou a ser declaração nossa
> (`db/universo-e-declaracao.md` §7.5.4).
> Autor: `arquiteto-dados` · T-0009.

## 7.1 Os três papéis, e quem cria cada um

| Papel | Quem cria | Quando | Carrega senha? |
|---|---|---|---|
| `forja_app` — grupo sem `LOGIN` e sem privilégio próprio | o operador | uma vez, antes do primeiro cliente | não |
| a credencial da aplicação — `LOGIN NOINHERIT`, membro de `forja_app` | o operador | uma vez | **sim**, e é o único segredo desta página |
| `app_t_<slug>` — o papel do cliente, sem `LOGIN` | o **executor**, dentro do `provision` | um por cliente | não |

**O corte é pelo segredo.** O que carrega senha é ato do operador, porque senha não atravessa artefato
deste repositório (§2). O que não carrega senha é ato do executor, porque ali não há o que proteger e
há tudo a ganhar em ser mecânico — é justamente o papel por cliente, que é o que se multiplica.

O executor precisa saber o **nome** da credencial, nunca a senha dela, para conceder o papel do cliente
a ela. O nome vem de ambiente, como a conexão (§2), na chave **`FORJA_MIGRATOR_APP_CREDENTIAL_ROLE`**,
fixada em 2026-09-11. Ela carrega **nome de papel**, jamais senha — é por isso que ela pode ser citada
aqui enquanto a de conexão não pode. A linha correspondente do `.env.example` é preenchida fora deste
processo, pela mão que já guarda o segredo; nenhum artefato deste repositório a escreve. A ausência da
chave recusa `provision`, `migrate` e `verify` com saída `2`, nomeando a chave — a mesma postura do
`lock_timeout`. `status` não a exige, porque não pergunta nada sobre papel.

**O nome do papel do cliente é `app_` + o nome do schema**, e isso não é estilo: a verificação da §7.5
é uma junção por `'app_' || nspname`, sem tabela de-para e sem o que desencontrar. Com o teto de 40 do
slug (`APLICACAO-E-ALVO.md` §10.2), o nome tem no máximo 46 bytes, dentro dos 63 do Postgres. O prefixo
`app_` é **reservado**, e a reserva vale para os **dois** nomes que o executor conhece: a credencial que
vem do ambiente e o papel do executor, lido de `current_user`. Qualquer um dos dois começando por `app_`
recusa na borda com saída `2` (§7.7). O segundo caso parece rebuscado e não é: pela junção da §7.5, um
executor chamado `app_t_algo` **é** o papel de banco do schema `t_algo` — a verificação passaria a
conferir o executor contra si mesmo e aprovaria um cliente que não tem papel nenhum.

O nome do papel entra no comando pelo caminho da `APLICACAO-E-ALVO.md` §10.3.0 — `format('%I')` no
servidor, com o nome chegando como parâmetro —, pela mesma razão que o nome do schema: `CREATE ROLE` e
`GRANT` não aceitam parâmetro na posição do identificador.

## 7.2 O ato do operador, uma vez por banco

```sql
CREATE ROLE forja_app NOLOGIN;
CREATE ROLE <credencial> LOGIN NOINHERIT PASSWORD <a senha vem do cofre, nunca deste arquivo>;
GRANT forja_app TO <credencial>;
GRANT forja_app TO <papel do executor> WITH ADMIN OPTION;
REVOKE USAGE, CREATE ON SCHEMA public FROM PUBLIC;
REVOKE TEMPORARY ON DATABASE <banco> FROM PUBLIC;
```

Sete coisas que não são detalhe de digitação:

- **`NOINHERIT` na segunda linha deixou de ser a única trava.** Até o quinto gate, o arranjo inteiro
  dependia desta palavra: sem ela a credencial alcança todos os schemas **sem assumir papel nenhum**,
  que é a prova C da §6.2 — vazamento com a venda concluindo em sucesso —, e a §7.5 respondia
  `conforme`. Ela continua aqui, e quem passou a garantir a propriedade é a **opção de herança de cada
  concessão** do ato do executor (§7.3). Medido em 2026-09-11, PostgreSQL 16.15, com a credencial
  criada de propósito **sem** `NOINHERIT` (`rolinherit = t`): a concessão com `WITH INHERIT FALSE`
  produz `permission denied for schema` na leitura direta dos dois clientes, e `SET LOCAL ROLE`
  continua funcionando. Em 16 a herança é propriedade **da concessão** (`pg_auth_members.inherit_option`),
  não do papel — então a garantia passou a morar onde existe artefato, e não onde existe digitação.
- **`WITH ADMIN OPTION` na quarta linha é o que permite ao executor pôr os papéis de cliente no
  grupo.** Medido em 2026-09-11: sem ela, o `GRANT forja_app TO app_t_<slug>` do passo da §7.3 leva
  `permission denied to grant role`, a transação inteira cai e nenhum cliente é provisionado — falha
  fechada, e é a que se quer. **Isto põe o executor em `pg_auth_members` como membro do grupo**, então
  a consulta da §1 — todo membro de `forja_app` sem `USAGE` em `platform` — precisa ler
  `admin_option`, ou ela acusa o executor, que tem `USAGE` em `platform` por construção. Medido em
  2026-09-11: quem recebeu `WITH ADMIN OPTION` aparece com `admin_option = t` e o papel de cliente com
  `f`, e é essa coluna que separa "quem administra o grupo" de "quem é papel de aplicação".
- **O `REVOKE` do `public` é do operador porque o executor não é dono daquele schema.** Medido em
  2026-09-11, PostgreSQL 16.15: o executor emitindo o mesmo comando recebe
  `WARNING: no privileges could be revoked for "public"` e **sai com sucesso**. Um `REVOKE` que não
  revoga nada e não falha é a pior forma possível de um controle existir, e é por isso que ele está
  aqui e não lá. Depois dele, medido, o papel de cliente deixa de ter `USAGE` em `public` — que é onde
  uma isca alcançável por todos moraria ([[gotcha-search-path-serve-o-executor-e-vaza-no-pool]]).
- **O `REVOKE TEMPORARY` fecha o sombreamento de nome não qualificado.** `datacl` nasce com
  `TEMPORARY` para `PUBLIC`, então o papel do cliente tem o privilégio sem que ninguém o conceda —
  e a §7.3 afirmava o contrário. Medido em 2026-09-11: com `search_path = t_acme` **explícito**, o
  papel do cliente cria `CREATE TEMP TABLE orders` e o `orders` não qualificado passa a resolver para
  a temporária (1 linha) em vez da tabela real (3); o nome qualificado continua vendo 3. Como
  `RECUSAS.md` §11.3 **obriga** todo corpo de função e gatilho a escrever nome não qualificado, todo
  corpo é sombreável, e o efeito não é ler errado: é a venda gravar numa relação que some no fim da
  sessão. O `REVOKE` é do operador pela mesma razão do anterior — medido, o executor emitindo-o recebe
  `WARNING: no privileges could be revoked` e **sai com sucesso**. Depois dele, medido, `CREATE TEMP
  TABLE` leva `permission denied to create temporary tables` para o papel do cliente **e** para o
  executor, e os dois é o que se quer: nenhuma linha de `db/migrator/src/**` cria tabela temporária
  (procurado), a gramática da §11.2 não tem forma que a crie, e ordenação que transborda para disco
  não depende deste privilégio (medido: 200 000 linhas com `work_mem = 64kB`, dentro do papel do
  cliente, sem erro). Arquivo temporário não é objeto temporário. Quem precisar de uma temporária um
  dia recebe `GRANT TEMPORARY` nominal, que é o lado certo para errar.
- **`ADMIN OPTION` sobre a credencial da aplicação nunca vai para o executor**, nem na rotação. Com
  ela, o executor faz `GRANT <credencial> TO <papel de fora>`, e o papel de fora assume a credencial e,
  por ela, todo cliente, com um login separado que sobrevive à troca do executor: é a cadeia do
  `PAP-25`. A única `ADMIN OPTION` do executor nesta seção é a da quarta linha, sobre `forja_app`.
  Medido em 2026-09-23, PostgreSQL 16.15: a concessão feita pelo operador sai em `verify` `3` como
  membro de papel declarado (§7.5.5), e `migrate` recusa antes de conceder.
- **O executor precisa do atributo `CREATEROLE`**, e o que isso custa está na §7.6.
- **Quem cria a credencial é o operador, e desde 2026-09-12 o banco cobra isso.** Em 16, `CREATE ROLE`
  emitido por um `CREATEROLE` **não-superusuário** concede o papel novo ao criador, com `ADMIN
  OPTION` — então credencial criada pelo executor nasce com o executor como **membro dela**, e a
  §7.5.5 acusa isso com saída `3`. Está certo que acuse: uma credencial que o executor pode repassar a
  um terceiro é a cadeia inteira do `PAP-25`, e o terceiro fica com um login separado e permanente,
  que sobrevive à rotação do executor. Vale igual na janela de rotação da §7.7: a credencial nova sai
  da mão do operador, nunca da do executor.

## 7.3 O passo do executor, num commit só

```sql
CREATE ROLE app_t_<slug> NOLOGIN NOINHERIT;
GRANT forja_app TO app_t_<slug>;
GRANT app_t_<slug> TO <credencial> WITH INHERIT FALSE, SET TRUE;
GRANT USAGE ON SCHEMA t_<slug> TO app_t_<slug>;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA t_<slug> TO app_t_<slug>;
ALTER DEFAULT PRIVILEGES FOR ROLE CURRENT_USER IN SCHEMA t_<slug>
    GRANT SELECT, INSERT, UPDATE ON TABLES TO app_t_<slug>;
```

**É uma transação, e isso foi medido em 2026-09-11, PostgreSQL 16.15 e 15.19:** `CREATE ROLE` e
`ALTER DEFAULT PRIVILEGES` são transacionais, e o `ROLLBACK` não deixa papel para trás — conferido por
`pg_roles` depois de desfazer. Ou o papel nasce com os privilégios dele, ou não nasce. Não existe
estado intermediário em que o papel exista sem alcance, que seria o estado difícil de diagnosticar:
conexão que autentica e não lê nada.

**`WITH INHERIT FALSE, SET TRUE` é a linha de que o arranjo inteiro depende.** Ela diz que a
credencial pode **assumir** o papel do cliente e não pode **herdar** nada dele. Três medições de
2026-09-11, PostgreSQL 16.15, executor não-superusuário:

- com a credencial criada **sem** `NOINHERIT`, a concessão sai com `inherit_option = f` e a leitura
  direta de `t_acme` e de `t_globex` pela credencial nua leva `permission denied for schema`. A
  opção da concessão vence o atributo do papel, e é por isso que ela está aqui e não só na §7.2;
- **reconceder corrige no lugar, sem `REVOKE`, e só quando o concedente é o mesmo**: sobre uma
  concessão herdável emitida por **este** executor, emitir a mesma linha muda `inherit_option` de `t`
  para `f` e a leitura que funcionava passa a falhar. É o que permite à convergência da §7.4 tratar
  este caso como falta. A condição do concedente não estava escrita aqui até o sexto gate, e a
  ausência dela é o `PAP-13`, medido e decidido na §7.4;
- a sintaxe **só existe a partir do 16**: medido, 15.19 recusa a mesma linha com
  `syntax error at or near "INHERIT"`. O piso de `db/convencoes.md` §9 deixou de valer só para o
  `CREATEROLE` da §7.6 e passou a ser exigência deste ato — quem tentar voltar para 15 não perde uma
  proteção de longo prazo, perde o comando.

**A concessão do grupo não carrega opção, e é escolha.** `forja_app` não tem privilégio próprio
(§7.1), então herdá-lo não alcança nada; e o dia em que alguém conceder privilégio ao grupo, quem
acusa é a pergunta invertida da §7.5.1, que enumera **todo** alcance ao schema do cliente, inclusive
o que chega por um papel de grupo. Opção que não protege invariante nenhum é coluna a mais para a
verificação conferir.

**A linha de `ON ALL TABLES` e a de `ALTER DEFAULT PRIVILEGES` fazem coisas diferentes, e as duas são
necessárias.** A primeira alcança o que **já existe** no schema quando o ato roda; a segunda alcança o
que **ainda vai existir**, e só o que for criado pelo papel nomeado em `FOR ROLE`. Medido: tabela
criada antes do ato e tabela criada depois ficam as duas legíveis, e **view também** — `ALL TABLES` e o
padrão de `TABLES` incluem view, o que importa porque toda view de migration é obrigatoriamente
`security_invoker` (`RECUSAS.md` §11.2) e sem `SELECT` nela o cliente não lê a própria view.

**`FOR ROLE CURRENT_USER`, e não o nome do papel do executor escrito por extenso.** É o mesmo sujeito
que a §7.5 compara (`defaclrole = to_regrole(current_user)`), então não há um terceiro identificador
atravessando o sistema para desencontrar do que efetivamente cria as tabelas. Escolha do `coder` em
2026-09-11, adotada aqui.

**Isso muda o risco de trocar o papel do executor, e não o elimina.** `FOR ROLE` amarra o privilégio
padrão a **um** papel: trocado o executor, as tabelas antigas continuam legíveis e as criadas pelo
executor novo nascem invisíveis para o cliente. O que `CURRENT_USER` resolve é a metade silenciosa —
o privilégio padrão passa a nascer sempre no mesmo papel que a §7.5 pergunta, então o desencontro
**aparece**: no `migrate` como parte a convergir, que o executor novo reemite sozinho, e no `verify`
como linha nomeada e evento `tenant_role_default_acl_absent`. Ele **não** reprova, e a razão está na
§7.5: a coluna responde sobre quem pergunta, não sobre o banco — ligá-la à saída `3` faria o `verify`
de um operador acusar a frota inteira de adulteração. Quem reprova nesse caminho é
`tabelas_sem_select`, que independe de quem pergunta. O que `CURRENT_USER` não resolve, e continua
sendo obrigação de quem troca o papel: a janela entre a troca e a primeira rodada de `migrate` — nela,
tabela nova nasce invisível e nada acusou ainda. Por isso trocar
o papel do executor continua exigindo rodar `migrate` uma vez em cada cliente antes do próximo
release. A entrada antiga de `pg_default_acl`, do papel anterior, fica para trás e é inerte: retirá-la
é `REVOKE`, que este ato não tem (§7.4).

**Papel é objeto de cluster, não de banco**, e isso não é curiosidade de catálogo. Dois bancos no mesmo
cluster — operação e uma cópia restaurada ao lado — têm cada um o seu `t_<slug>`, com os `GRANT` sobre
schema e tabela separados por banco, e **um só** `app_t_<slug>`, compartilhado: quem mexe nos atributos
dele pela cópia mexe nos da operação. A consequência imediata apareceu no `coder` em 2026-09-11: a
suíte do executor deixou de rodar em paralelo, porque oito arquivos que provisionam o mesmo slug em
bancos descartáveis diferentes disputam o mesmo papel. Vale como regra de operação, não só de teste —
banco descartável e banco de operação não moram no mesmo cluster.

Medido junto, e é o caso que mostra por que isto não pode ficar de fora: num schema provisionado **sem**
a linha de `ALTER DEFAULT PRIVILEGES`, a tabela criada por uma migration posterior nasceu **invisível**
para o papel do cliente. O sintoma não aparece no dia do provisionamento: aparece no primeiro release
seguinte, no caixa, como `permission denied for table` numa tabela que acabou de ser criada.

**Quatro escolhas deste conjunto, e nenhuma é omissão:**

- **Sem `CREATE` no schema.** O papel que atende requisição não cria estrutura. Estrutura nasce em
  migration, e migration é do executor.
- **Sem `DELETE`.** Nada no núcleo apaga linha: fato é append-only (`dados.md` §4) e tirar cadastro de
  circulação é vigência, não remoção (`db/convencoes.md` §4). Conceder `DELETE` seria privilégio para
  uma operação que a convenção diz não existir. Quando ela existir, ampliar este conjunto é mudança
  **desta seção**, com revisão — e até lá a falha é alta e nomeada (`permission denied for table`),
  que é o lado certo para errar.
- **Sem sequência.** `D-04` fixou chave `uuid` gerada na borda, então não há sequência no modelo do
  núcleo, e a lista não cresce por antecipação — é a mesma postura do índice parcial em
  `RECUSAS.md` §11.2. A primeira sequência vem com mudança desta seção.
- **`TEMP` não está nesta lista, e não é por esquecimento: ele não se resolve aqui.** O privilégio de
  criar objeto temporário é do **banco**, não do schema, e `PUBLIC` já o carrega por padrão — este ato
  não teria o que conceder nem o que negar. Até 2026-09-11 esta seção afirmava a ausência dele, e a
  afirmação era falsa: quem a produz é o `REVOKE TEMPORARY` do ato do operador (§7.2), e quem a
  confere é a linha de registro da §7.5.2.
- **O privilégio não distingue fato de cadastro.** `UPDATE` é concedido no schema inteiro, embora fato
  não se atualize. É limitação do mecanismo, não descuido: privilégio padrão do Postgres é por schema e
  por tipo de objeto, nunca por família de tabela. Separar famílias exigiria um schema por família
  (contradiz um schema por cliente) ou um ato de privilégio versionado por tabela, que não existe e
  apodreceria. Quem impede o `UPDATE` num fato é a estrutura — gatilho de recusa, no mesmo lugar em que
  `platform.schema_migrations` já se protege (`CONTRATO.md` §18) —, e essa camada **é** versionada,
  porque mora na migration. Ausência decidida, não esquecimento.

## 7.4 Onde ele roda, e o que acontece se o `provision` falhar no meio

**No `provision` ele é o passo 7**, depois do passo 6 (`PROVISION-E-VERIFY.md` §13.1, na numeração
do contrato do executor). Depois, e não
antes, porque `ON ALL TABLES` precisa das tabelas já criadas — e o que vier depois dele, em release
futuro, é coberto pelo `ALTER DEFAULT PRIVILEGES` da mesma transação.

**No `migrate` e no `migrate --schema` ele roda ao fim de cada schema de cliente visitado**, tenha a
rodada aplicado alguma migration naquele schema ou não. É a única forma de a retomada convergir: um
cliente cujo `provision` morreu no passo 7 já tem todas as migrations aplicadas, então "converge só
quando aplicou algo" o deixaria quebrado para sempre, com o comando dizendo "nada pendente".

**A convergência pergunta antes de agir**, e a pergunta é a mesma consulta da §7.5:

| O que a consulta devolve | O que o executor faz |
|---|---|
| tudo conforme | **nada**. Rodada em banco saudável não escreve privilégio nenhum |
| papel ausente | o ato da §7.3 inteiro, num commit |
| papel presente, sem `LOGIN`, no grupo, e **faltando** `GRANT` ou o privilégio padrão | só o que falta, no mesmo commit |
| papel presente e a credencial **herda** ele por concessão **deste** executor (`credencial_herda`, §7.5) | reemite a linha do ato com `WITH INHERIT FALSE, SET TRUE`, que corrige a concessão no lugar |
| **qualquer credencial declarada** herda o papel por concessão de **outro concedente** (`heranca_de_outro_concedente`, §7.5) | **para**, com saída `3`, nomeando as duas pontas — credencial e concedente — e o `REVOKE` que só ele pode emitir |
| uma credencial declarada que **não** é a do ambiente herda o papel por concessão **deste** executor (`heranca_de_outra_credencial`, §7.5) | **para**, com saída `3`: este ato concede a um nome só, e convergir diria ter corrigido sem corrigir. A saída é rodar `migrate` com o ambiente apontando para ela, ou revogar |
| papel presente **com `LOGIN`**, ou fora do grupo, ou com atributo indevido | **para**, com saída `3`, nomeando o papel |
| papel presente com privilégio **a mais** — `create_indevido` ou `usage_em_platform` (§7.5) | **para**, com saída `3`, nomeando o papel |
| alguém **que não está declarado** alcança o schema (§7.5.1) | **para**, com saída `3`, nomeando quem alcança |
| o dono de `platform` ou de um `t_*` não é executor declarado (§7.5.4) | **para**, com saída `3`: devolver a posse é mão humana |

**Falta e excesso são lados diferentes, e só um converge.** A linha nova saiu de uma leitura do `coder`
em 2026-09-11, e ela está certa: o ato da §7.3 só **concede**. Retirar privilégio é `REVOKE`, que não
está neste ato e não pode estar em migration (`RECUSAS.md` §11.2). Então excesso não é convergível por
construção — tratá-lo como "faltando" faria o `migrate` conceder o que já sobra, declarar convergência e
deixar o alcance excedente de pé, com a saída dizendo `0`. Ele é `tenant_role_divergent`, que é o código
cuja ação humana é investigar quem tocou no papel.

**A linha da herança parece contradizer isso e não contradiz**, porque o corte não é entre falta e
excesso: é entre **o que este ato reemite** e o que só `REVOKE` corrige. A concessão herdável **deste
executor** é excesso, e mesmo assim converge, porque a correção é reemitir **a linha literal da §7.3**
— medido em 2026-09-11: sobre uma concessão com `inherit_option = t`, o mesmo
`GRANT … WITH INHERIT FALSE, SET TRUE` a muda para `f` sem `REVOKE`, e a leitura direta que funcionava
volta a dar `permission denied`. O resultado é estritamente menos privilégio do que havia, e o estado
que ele desfaz é o caminho do `PAP-01`: a credencial lendo todo cliente sem assumir papel nenhum. Já
`USAGE` concedido a um terceiro (§7.5.1) só sai com `REVOKE`, e revogar sozinho apagaria privilégio que
alguém pode ter concedido por decisão — esse fica para a mão humana.

**E a linha nova, a do concedente alheio, é onde as duas frases acima valiam sem condição e não
deviam.** Até o sexto gate esta seção dizia, sem qualificar, que reemitir "corrige no lugar" e que "o
resultado é estritamente menos privilégio do que havia" — e as duas valem **só quando o concedente é o
mesmo**. Quatro medições de 2026-09-11, PostgreSQL 16.15, decidem o caso:

- o operador, que é quem tem superusuário e quem cria a credencial (§7.2), encontra o
  `permission denied for schema` da prova E e "conserta" com
  `GRANT app_t_<slug> TO <credencial> WITH INHERIT TRUE`: passam a existir **duas** linhas, e o efeito
  é a união — a credencial nua alcança o cliente;
- reemitir a linha da §7.3 grava a do executor e **deixa a do operador intacta**. Era daqui que saía
  `migrate` dizendo "completando o papel de banco" e **saindo `0`**, com `verify` voltando a `3`;
- o `REVOKE` do executor é **aceito** e apaga **só a linha dele**: tira a legítima e deixa a herdável;
- `REVOKE … GRANTED BY <operador>`, pelo executor, leva `permission denied to revoke privileges`.

**Então o executor recusa, e não conserta** — quem revoga é quem concedeu, e ele **não consegue**
fazê-lo em nome de outro. A mensagem nomeia o concedente e carrega o comando dele,
`REVOKE app_t_<slug> FROM <credencial>`, que medido apaga só a linha de quem o emite e deixa a do
executor de pé: nada mais é preciso depois.

Perguntar antes importa por dois motivos além do custo: rodada saudável não exige do executor o
privilégio de conceder, e o terceiro caso — reaplicar só o que falta — é o que torna a retomada
barata em N schemas.

Os dois últimos casos são drift (`migrations.md` §9), não entrada ruim: um papel `app_t_<slug>` feito à mão
carrega privilégio que ninguém declarou, e adotá-lo em silêncio é herdar alcance desconhecido. A mão
humana resolve, e a retomada é `migrate --schema t_<slug>`. No `provision`, o papel tem que estar
**ausente** — pelo mesmo motivo do passo 3 sobre o schema —, e a redundância existe pela mesma razão:
medido, o servidor recusa `CREATE ROLE` repetido com `42710 role already exists`, então são duas
travas para o mesmo erro de digitação.

**A falha no passo 7 entra na história que já existia, sem tratamento próprio.** Ela deixa o cliente
registrado, o schema criado e as migrations aplicadas — exatamente o estado que uma falha no passo 6 já
deixava —, e a retomada é a mesma: `migrate --schema t_<slug>`. Duas coisas mudam, e as duas para
melhor: o estado incompleto agora **falha fechado em operação**, porque sem o papel a aplicação não
consegue nem abrir a transação daquele cliente (prova E da §6.2); e ele deixou de ser invisível,
porque a §7.5 o encontra.

## 7.5 Como isto é verificado

Mora em arquivo próprio: **`db/verificacao-do-papel.md`**, com a §7.5, a §7.5.1 e a §7.5.2, e
**`db/universo-e-declaracao.md`**, com a §7.5.3, a §7.5.4 e a §7.5.5. O corte é o
mesmo teto de 400 linhas que partiu o contrato, e a pergunta que o novo arquivo responde é outra —
aqui está o **ato** que cria o papel, lá está a **prova** de que o papel do cliente é o único caminho
até o schema dele. Citação na forma `§7.5` continua endereçando a mesma seção.

## 7.6 O preço do `CREATEROLE`, medido em 15 e em 16

O executor precisa de `CREATEROLE` para que o ato exista como passo dele. O atributo não é neutro, e
significa coisas diferentes em 15 e em 16 — foi essa diferença que subiu o piso, e por isso 15 deixou
de ser versão admitida (`db/convencoes.md` §9). Medido em 2026-09-11, servidor
15.19 e servidor 16.15, com um executor não-superusuário e uma credencial que **não** foi criada
por ele:

| Ato do executor, com `CREATEROLE` | 15.19 | 16.15 |
|---|---|---|
| criar `app_t_<slug>`, pôr no grupo, conceder à credencial | aceita | aceita |
| **trocar a senha da credencial** | **aceita** | recusa: `permission denied to alter role` |
| **tornar-se membro da credencial** | **aceita** | recusa: `Only roles with the ADMIN option ... may grant this role` |

Em 15, `CREATEROLE` alcança **todo** papel não-superusuário do cluster. Hoje isso não acrescenta nada
ao que o executor já pode: ele é dono de todos os schemas de cliente e lê o registro inteiro (§4), e a
credencial que ele tomaria tem privilégio que é subconjunto do dele. **O dia que muda o veredito é o
primeiro papel que não é subconjunto** — papel de pessoa quando `D-03` fechar, papel de leitura de
operação, papel de um processo de terceiro. Em 15, o executor alcança esse papel; em 16, não.

**O piso é 16, e foi esta tabela que o subiu.** Decisão do thread principal em 2026-09-11
(`db/convencoes.md` §9); o executor recusa iniciar abaixo de `160000` (`APLICACAO-E-ALVO.md` §6). O
texto anterior desta seção deixava o piso em 15 e guardava um gatilho — "sobe no dia em que nascer um
papel fora dos três da §7.1". O gatilho foi consumido em vez de esperado, e a razão é de custo: sem
cliente em produção, subir custa uma linha e zero migração, enquanto esperar custa alguém lembrar do
gatilho no dia em que criar o papel de pessoa, meses depois, sem esta página aberta.

A tabela deixou de ser motivo de espera e virou o motivo do piso: quem quiser voltar para 15 — servidor
de operação preso na versão, hospedagem sem 16 — tem que derrubar as duas linhas do meio, e a volta vem
com compensação escrita para o `CREATEROLE` do executor. É decisão do humano, e está aqui para ser
derrubada com o argumento à vista, não descoberta depois.

## 7.7 O que o executor confere na borda, e recusa com saída `2`

O ato do operador (§7.2) é **precondição** do ato do executor (§7.3). Precondição que ninguém confere
vira erro do servidor no meio da fila, e a mensagem do servidor nomeia o objeto que falta, nunca o ato
que alguém esqueceu de rodar. Então, antes de abrir a primeira transação, `provision`, `migrate`,
`migrate --schema` e `verify` conferem — uma consulta, nenhum privilégio especial — e **recusam com
saída `2`, nomeando o passo da §7.2 que falta**:

| Precondição | Como se confere | O que a mão humana faz |
|---|---|---|
| `FORJA_MIGRATOR_APP_CREDENTIAL_ROLE` presente no ambiente | leitura do ambiente | preenche a chave (§7.1) |
| nem a credencial nem `current_user` começam por `app_` | prefixo dos dois nomes | renomeia o papel; o prefixo é reservado (§7.1) |
| o grupo `forja_app` existe | `to_regrole('forja_app') IS NOT NULL` | roda a §7.2 |
| o nome do ambiente **é** a credencial da aplicação: existe, tem `LOGIN`, é membro do grupo e não tem `admin_option` sobre ele | uma consulta a `pg_auth_members` e `pg_roles` | corrige a chave, ou roda a §7.2 |

`status` não confere nenhuma delas, porque não pergunta nada sobre papel e não escreve nada.

**A última linha confere o ambiente contra o catálogo, e não contra si mesmo** — é o `PAP-07`. O nome
da credencial entra por `FORJA_MIGRATOR_APP_CREDENTIAL_ROLE`, e até o quinto gate a única trava sobre
ele era o prefixo reservado: um `.env` copiado de outra máquina, nomeando o papel pessoal de quem
desenvolve, fazia o `migrate` conceder **todos** os papéis de cliente àquele papel, um por schema
visitado, sem erro — e o `verify`, que lê a mesma variável, respondia `credencial_assume = t` e
`conforme`. Verificação que confere o ato contra a mesma entrada que produziu o ato não verifica nada.
O fato independente disponível é o catálogo: a credencial da aplicação é membro de `forja_app`, tem
`LOGIN` e não tem `admin_option` sobre o grupo — medido em 2026-09-11, essa consulta devolve **só** a
credencial, porque o executor entra com `admin_option = t` e os papéis de cliente não têm `LOGIN`.

**Ela não exige que haja *uma* só**, e isso é ausência decidida: trocar a credencial é criar a nova,
conceder, migrar a configuração e só então retirar a velha, e durante essa janela existem duas. Recusar
a pluralidade travaria `migrate` no meio de uma rotação, que é exatamente a hora em que travar custa
mais caro.

**A rotação acontece por um comando, e não por um `GRANT` na mão.** Isto mudou no sétimo gate, e é
consequência direta de a exclusão da §7.5.1 ter deixado de ser inferida do grupo: o que a exclui é a
**declaração** (§7.5.4), e quem declara é o ato. A ordem passa a ser:

1. **o operador** cria a credencial nova e a põe no grupo (`CREATE ROLE … LOGIN NOINHERIT`,
   `GRANT forja_app TO <nova>`). É ele, e não o executor: em 16, papel criado por um `CREATEROLE`
   não-superusuário nasce com o criador como membro, e a §7.5.5 acusa isso (§7.2, último item);
2. alguém roda **`migrate` com o ambiente apontando para a nova**. Essa rodada declara a nova e emite
   o `GRANT app_t_<slug> TO <nova> WITH INHERIT FALSE, SET TRUE` em cada cliente;
3. a configuração da aplicação migra para a nova;
4. terminada a migração, a mão humana tira a velha do grupo e revoga os papéis de cliente dela.

Entre o passo 2 e o passo 4 as duas credenciais estão declaradas, as duas alcançam, e o `verify` sai
`0` nomeando a que não é a do ambiente — apontando para qualquer uma das duas. Medido em 2026-09-12.
Fora dessa ordem, o `GRANT` emitido na mão produz uma credencial que alcança e **não** está declarada,
e a §7.5.1 a acusa em `3`: é o mesmo desfecho do papel de fora, e é de propósito.

Depois do passo 4, a declaração da velha continua na tabela — ela é append-only — e a exclusão dela
**deixa de valer**, porque a §7.5.1 só exclui credencial declarada que ainda esteja no grupo. Enquanto
os `GRANT` dela ficarem de pé, ela continua podendo assumir o papel de cada cliente, e o `verify`
passa a acusá-la. Medido.

**Esta seção manda sobre a §7.5.1 no que toca a quantas credenciais existem, e a §7.5.1 foi corrigida
para obedecê-la.** É o `PAP-16`: as duas nasceram na mesma rodada, em arquivos diferentes, com
consequências opostas sobre o mesmo estado, e nenhuma citando a outra. A §7.5.1 excluía da pergunta
invertida **o único nome vindo do ambiente**, então, no instante em que a configuração migrava para a
nova, `verify` e `migrate` saíam `3` em **todo** cliente, nomeando a credencial legítima anterior como
quem "alcança indevidamente" — medido em 2026-09-11. As duas saídas rápidas do operador seriam ruins:
revogar a antiga enquanto a aplicação ainda a usa, que é o caixa parando, ou não rotacionar.

A §7.5.1 passou a excluir o **conjunto** que esta seção aceita, e não mais um nome. No sétimo gate esse
conjunto deixou de ser inferido do catálogo — "membro de `forja_app`, com `LOGIN`, sem `admin_option`"
— e passou a ser o que está **declarado** em `platform.role_declarations` (§7.5.4): o `PAP-20` mediu
que a inferência desculpava uma ponte `NOLOGIN` com `ADMIN OPTION` que o próprio executor monta em
seis comandos. Para que a exclusão não vire ausência invisível, o `verify` **nomeia** cada credencial
declarada além da que o ambiente carrega, em linha própria e evento `app_credential_plural`, sem tocar
no código de saída — e faz o mesmo para executor declarado a mais, em `executor_role_plural`.

**Duas consequências da janela, declaradas, porque o executor não resolve nenhuma das duas:**

- **`provision` de cliente novo durante a janela concede o papel só à credencial que o ambiente
  nomeia**, então o cliente nasce inalcançável pela aplicação que ainda roda com a outra. Falha
  fechado — indisponibilidade daquele cliente, não vazamento —, e a saída é `migrate --schema
  t_<slug>` depois que a configuração terminar de migrar. Ampliar o ato da §7.3 para conceder a
  **todas** as credenciais do grupo foi recusado: trocaria uma indisponibilidade de janela por alcance
  permanente a todo papel `LOGIN` que estiver no grupo naquele instante, a que está saindo inclusive.
- **Terminada a rotação, retirar a credencial velha do grupo é mão humana.** Enquanto ela estiver lá
  ela é credencial de aplicação pela definição desta seção, e a §7.5.1 não a conta como terceiro — a
  linha `app_credential_plural` existe para que ninguém descubra isso seis meses depois.

**O que isto corrige, medido em 2026-09-11.** Sem o grupo, o `provision` morre no passo 7 com
`role "forja_app" does not exist` e saída `1`, deixando o cliente registrado, o schema criado e as
migrations aplicadas — sem papel. São três defeitos num: a mensagem manda investigar um papel de banco
quando o que falta é um ato do operador; a saída `1` promete, pela `PROVISION-E-VERIFY.md` §12, que
reexecutar normalmente resolve, e aqui reexecutar nunca resolve, porque `provision` é recusado no passo
2; e o estado incompleto nasce **depois** de o cliente existir, quando podia ter sido impedido antes de
qualquer escrita.

**No `verify` é pior, e por isso ele também recusa em vez de reprovar.** Sem o grupo, o `to_regrole($1)`
da §7.5 devolve nulo, `no_grupo` sai falso em **toda** linha e o comando acusa `tenant_role_divergent`
em todos os clientes, com saída `3` — N diagnósticos falsos, cada um mandando investigar quem adulterou
um papel que ninguém tocou, e o diagnóstico verdadeiro em lugar nenhum. Controle que reprova tudo é o
controle que se aprende a ignorar, que é o mesmo argumento da §7.5 sobre por que a divergência de papel
sai em `3` e a de privilégio do executor não.

**Por que `2` e não `3`.** `3` é divergência em algo que este ato versiona e que um comando único
corrige (`PROVISION-E-VERIFY.md` §12). Aqui não há o que corrigir versionadamente: falta um ato do
operador, e nenhuma migration o executa. É a mesma classe de "configuração ausente", que a §12 já põe
em `2`, e é a mesma postura do piso de versão (§7.6) e do `lock_timeout`: o que o executor depende, ele
confere antes de confiar.

**E o executor não cria o grupo para se destravar**, mesmo onde o servidor permitiria. A §7.2 é uma
unidade: grupo, credencial, membership e o `REVOKE` do `public`. Criar só o grupo deixaria um grupo
vazio, com o `REVOKE` do `public` por fazer e a operação achando que a §7.2 rodou — o pior desfecho
possível, porque some o sintoma sem fazer o trabalho.

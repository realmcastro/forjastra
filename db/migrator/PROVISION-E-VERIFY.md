# Comandos, cliente novo e verificação — §12 e §13 do contrato do executor

> Parte de `db/migrator/CONTRATO.md`. A numeração é global no conjunto (`CONTRATO.md` §0): é a mesma
> §13 que `platform/0001__tenant_registry.sql` cita em comentário.
> Revisto em 2026-09-11 na correção do gate de `seguranca`: `MIG-02` (provisionar sobre schema de
> cliente existente, medido, sem um único erro), `MIG-04` (o `drop` do `verify` apoiado em reserva que
> não existia) e `MIG-05` (`platform` era o único schema que o `verify` não olhava).
> Revisto de novo em 2026-09-11, na reauditoria: `MIG-11` (a perna do `platform` dependia de um
> privilégio que a decisão do humano nega, e a saída `4` virava permanente), `MIG-13` (nada dizia se a
> enumeração era pelo registro ou pelo catálogo) e `MIG-17` (três seções liam um registro de módulos
> ativos que não existe). A §13.3 nasceu: a impressão de estrutura passou a ter consulta escrita.
> Revisto pela terceira vez em 2026-09-11, no terceiro gate: `SEC-02` (a impressão da §13.3 não
> carregava o estado de habilitação do gatilho, então `ALTER TABLE ... DISABLE TRIGGER` saía byte a
> byte idêntico e `verify` aprovava) e a nota do gate sobre o `REVOKE` de `db/papeis-e-credencial.md`
> §5, que não tinha verificação nenhuma. A §13.3 ganhou uma coluna e a §13.4 nasceu.
> Revisto em 2026-09-11, na conferência do executor implementado contra a spec: §12 (os dois códigos
> de saída que a tabela não enumerava) e §13.2/§13.3 (o carimbo do descartável passou a ser
> minúsculo, e a impressão continua com um `replace` só).
> Revisto no quarto gate, em 2026-09-11: `EXE-04` (a impressão não carregava o corpo da view, e
> `verify` aprovava view reapontada para o schema de outro cliente), `EXE-09` (a stream `platform`
> corre antes da recusa do `provision`, e duas linhas prometiam "nada aplicado") e `EXE-10` (a §13.3
> no papel e a no código eram consultas diferentes). §12, §13.1 e §13.3 mudaram.
> Revisto em 2026-09-11, quando o humano fechou o arranjo de papel (`db/papeis-e-credencial.md` §6.2)
> e mandou o ato que cria o papel do cliente ser passo do `provision`: o passo 7 nasceu na §13.1, a
> convergência entrou no `migrate`, a §12 acompanhou e a §13.5 nasceu.

## 12. Comandos e códigos de saída

| Comando | O que faz | O que ele escreve |
|---|---|---|
| `migrate` | aplica o pendente em `platform` e em todos os schemas de cliente registrados, e converge o papel de cada cliente visitado (`db/papel-do-cliente.md` §7.4) | objetos das migrations, linhas do ledger, o papel do cliente e os privilégios dele **quando faltam**, e linha em `platform.executor_events` quando detecta (§19) |
| `migrate --schema t_<slug>` | o mesmo, restrito a um schema **que esteja no registro** (§10.1). `platform` continua sendo verificado antes | idem |
| `status` | lista, por schema, o aplicado e o pendente | **nada** |
| `provision <slug>` | registra o cliente, cria o schema dele, aplica o núcleo e cria o papel de banco dele (§13) | uma linha em `platform.tenants`, o schema, as linhas do ledger, e o papel `app_t_<slug>` com os privilégios de `db/papel-do-cliente.md` §7.3 |
| `verify` | prova que o conjunto reproduz o banco a partir do vazio, compara cada schema real com a referência, e pergunta ao catálogo pelo papel de cada cliente (§13) | **cria e derruba schema descartável próprio**; escreve em `platform.executor_events` o que encontrar; não toca em schema de cliente, não escreve no ledger, não altera `platform.tenants`, **não cria e não altera papel** |

A linha do `verify` era, até a revisão anterior, "não escreve nada", ao lado de uma §13 que o descrevia
criando schema e derrubando schema. Duas afirmações sobre o mesmo comando, e a que mentia era a curta.
Agora ele escreve uma coisa a mais, e por decisão: achado que só existe no terminal some com o terminal
(`MIG-15`, invariante 10).

| Saída | Significado |
|---|---|
| `0` | nada pendente, ou tudo aplicado; no `verify`, nenhuma diferença |
| `1` | **falha de aplicação**: o corpo da migration, a asserção de alvo (§10.3.1 e §10.3.2), ou objeto novo fora do namespace alvo (§10.4). Os schemas anteriores permanecem aplicados, a rodada parou |
| `2` | recusa do carregador (§11), configuração ausente, precondição de papel não satisfeita (`db/papel-do-cliente.md` §7.7), ou entrada recusada na borda (slug já registrado, schema fora do registro). Nenhuma migration foi aplicada **no schema do cliente**; no `provision`, a stream `platform` já pode ter sido aplicada antes da recusa, e o passo 0 da §13.1 diz por quê |
| `3` | **divergência**: de checksum, de ledger, da estrutura do ledger (§3, §9), schema registrado que não existe no catálogo (§10.1), estrutura encontrada pelo `verify` (§13.2), papel de cliente ausente, incompleto ou adulterado, alcance de terceiro ao schema de um cliente (§13.5), concessão herdável do papel emitida por **outro concedente** (`db/papel-do-cliente.md` §7.4), ou schema fora de `platform` e `t_*` e objeto em `public` (`db/universo-e-declaracao.md` §7.5.3). Nada foi aplicado no schema que divergiu |
| `4` | **verificação não pôde ser concluída**, e só por causa **transitória**: o schema descartável não pôde ser criado ou não pôde ser derrubado, ou o arquivo de referência do `platform` não foi lido. Não é aprovação nem reprovação, e nunca é silêncio |

Os códigos são separados porque as falhas pedem ações humanas diferentes: `1` normalmente se resolve
reexecutando, `2` editando um arquivo ou corrigindo o comando, `3` nunca se resolve reexecutando, e `4`
diz que ninguém ainda sabe se está certo.

**Os dois casos que a tabela deixava de fora, e por que caem onde caem.** Objeto fora do namespace alvo
(§10.4) sai em `1`: no regime transacional o `ROLLBACK` desfaz o corpo, e o desfecho é o de qualquer
falha de aplicação — os schemas anteriores ficam aplicados e a rodada para no atual. O retrato de `oid`
é tirado em dois instantes, então DDL concorrente de outra conexão cabe dentro dele, e reexecutar é o
que separa isso de uma migration que realmente escreve fora do alvo; é a ação que `1` promete. Pô-lo em
`3` mentiria na segunda metade da linha, porque detecção no schema 7 de 20 deixa seis aplicados. Schema
registrado e ausente do catálogo (§10.1) sai em `3`: é drift, reexecutar devolve o mesmo resultado, e a
mão humana precisa criar o schema, restaurá-lo ou tirar a linha do registro.

**Um `3` não se resolve reexecutando, e dois deles não se resolvem nem com `migrate`.** A promessa do
código é "reexecutar devolve o mesmo resultado", e a maioria dos casos ainda tem um comando único que
os corrige — `migrate --schema`, e a linha do `verify` o imprime. Dois não têm, e a linha deles carrega
outra coisa no lugar: a concessão de outro concedente carrega o `REVOKE` **e o nome de quem precisa
emiti-lo** (§7.4), e o alcance de terceiro carrega quem alcança (§13.5). Linha de divergência que manda
convergir onde convergir não corrige é pior que linha nenhuma: foi assim que o `migrate` passou a sair
`0` sobre estado não corrigido, no `PAP-13`.

**E `3` não quer dizer que o banco está intocado.** Quer dizer que nada foi aplicado no schema que
divergiu e que nenhuma aplicação começou depois da detecção. A conferência de checksum corre antes de
tudo (§3), e ali nada mesmo foi aplicado; a conferência dos clientes corre depois da stream `platform`,
que pode ter sido aplicada na mesma rodada. Sem essa distinção, a frase curta manda quem lê procurar no
lugar errado.

**A saída `4` deixou de ter caso permanente, e isso foi o `MIG-11`.** Enquanto a referência do
`platform` era um banco descartável, e o humano decidiu que o executor não recebe `CREATEDB`, toda
execução em ambiente de operação terminava em `4` — e `4` significando três coisas, uma delas
inevitável, é `4` que ninguém lê mais. A referência passou a ser declarada (§13.2), que não pede
privilégio nenhum, então `4` voltou a significar "aconteceu algo que exige mão humana agora".

## 13. Cliente novo, e a verificação de que o conjunto reproduz o banco

### 13.1 `provision <slug>`

A ordem é normativa, e cada passo é uma trava que não depende do passo anterior ter sido escrito:

1. **forma** — o slug passa pela validação e pelos reservados da §10.2. Falhou: saída `2`;
2. **identidade** — `INSERT` em `platform.tenants`. O `UNIQUE (slug)` do registro é a trava
   estrutural; violação é saída `2`, com "cliente já registrado", e a mensagem manda usar
   `migrate --schema` se a intenção era retomar;
3. **ausência do schema** — `SELECT` em `pg_namespace` pelo nome `t_<slug>`. Presente: aborta, saída
   `2`, sem criar e sem registrar;
4. **criação** — `CREATE SCHEMA` pelo caminho da §10.3.0, **sem `IF NOT EXISTS`**. Medido: sobre schema
   existente o servidor recusa com `42P06` e a transação rola de volta. Com `IF NOT EXISTS`, que era o
   texto anterior, o servidor emite um `NOTICE` e segue — foi assim que o auditor entrou no schema de
   um cliente existente e aplicou o núcleo inteiro dentro dele, com saída de sucesso;
5. **commit** — identidade e schema nascem no mesmo commit. Não existe cliente registrado sem schema
   nem schema sem cliente registrado;
6. **aplicação** — as migrations de núcleo, cada uma no seu commit (§7). **Módulo não entra aqui
   enquanto não existir o registro de ativação** (`CONTRATO.md` §2.3): não há o que ler, e a §11.6
   recusa a rodada se houver arquivo de módulo no repositório. Quando o registro existir, este passo
   volta a dizer "núcleo e módulos contratados";
7. **papel de banco do cliente** — `app_t_<slug>`, os `GRANT` dele e o privilégio padrão do schema, num
   commit só, pelo ato de `db/papel-do-cliente.md` §7.3. Depois do passo 6 porque `ON ALL TABLES`
   precisa das tabelas já criadas; o que vier depois é coberto pelo `ALTER DEFAULT PRIVILEGES` do mesmo
   commit. Papel já existente: saída `3` (§7.4 de lá). As precondições dele — chave de ambiente,
   prefixo reservado, grupo e credencial — correm **antes do passo 1** e recusam com `2` (§7.7 de lá).

**Entre o passo 1 e o passo 2 corre a stream `platform`, e com ela a declaração do arranjo** —
`platform.role_declarations`, o papel da conexão e a credencial do ambiente
(`db/universo-e-declaracao.md` §7.5.4). Ela corre ali porque a `0011` precisa estar aplicada para
haver onde declarar, e antes do passo 2 porque recusar com o cliente já registrado custa mais caro. A
numeração não a inclui, pela mesma razão que não inclui a stream: os números são citados de fora.

**A numeração não inclui a stream `platform` de propósito.**
O registro de clientes nasce na `0001`: enquanto a stream estiver atrás, não existe onde inserir a
identidade do passo 2. A consequência é que uma recusa do passo 2 ou do passo 3 sai com a stream
`platform` **aplicada**, e é por isso que a §12 diz "nada aplicado no schema do cliente" em vez de
"nada aplicado". A lista anterior omitia isso, e duas linhas de spec prometiam mais do que o comando
entrega (`EXE-09`) — a tabela de códigos de saída é onde alguém confere o que uma recusa
garante, e ela garantia demais. Não virou passo numerado porque a numeração é citada de fora, por
esta seção, pela §12 e pelos testes de aceite da `CONTRATO.md` §14, e renumerar apodreceria as três.

Os passos 3 e 4 são redundantes de propósito: um é verificação do executor e o outro é recusa do
servidor. O erro que essa redundância cobre não é ataque, é digitação — e o desfecho dela era dois
clientes registrados apontando para o mesmo schema, que é a colisão de chave mais cara que este sistema
admite.

**O `tenant_id` do passo 2 é gerado pelo executor**, porque a coluna é `uuid NOT NULL` sem `DEFAULT`:
`D-04` fechou que a chave é ordenada no tempo e nasce na borda, e o gerador nativo do Postgres produz
valor aleatório, que é a saída recusada. Para não deixar a escolha para quem implementa, ela está aqui:
**UUID versão 7** — 48 bits de milissegundos desde a época Unix, 4 bits de versão, 2 bits de variante e
o restante de um gerador **criptográfico** (`node:crypto`, que é biblioteca padrão e não acrescenta
dependência a `D-01`). A mesma regra vale para `platform.executor_events.event_id` (§19).

**Falha no passo 6 ou no passo 7** deixa o cliente registrado e o schema criado, com parte das
migrations aplicadas e sem papel de banco. A retomada é `migrate --schema t_<slug>` nos dois casos, e
rodar `provision` de novo é recusado no passo 2. Isso é desenho, não limitação: `provision` cria
identidade, e identidade não se cria duas vezes.

**O papel entra nessa mesma história, e não precisou de tratamento próprio** — precisou de duas coisas,
ditas em `db/papel-do-cliente.md` §7.4. A convergência do passo 7 roda ao fim de **todo** schema que o
`migrate` visita, tenha ele aplicado migration ou não: quem morreu no passo 7 já está com tudo
aplicado, e "converge só quando aplicou algo" o deixaria quebrado com o comando dizendo "nada
pendente". E o estado incompleto falha fechado em operação — sem o papel, a aplicação não abre nem a
transação daquele cliente (`db/papeis-e-credencial.md` §6.2, prova E) — além de a §13.5 o encontrar.

### 13.2 `verify`

`provision` roda todas as migrations do núcleo, na ordem, do zero. Se o conjunto não reproduz um banco
correto a partir do vazio, o conjunto está quebrado (`migrations.md` §8). `verify` é o que transforma
isso em verificação e não em esperança.

**Quais schemas ele olha, e é o catálogo que manda.** A enumeração é `pg_namespace`, todos os que
casam `t_%`, e o registro entra como **confronto**, não como fonte. As duas direções são achado, e
cada uma vira linha em `platform.executor_events` (§19):

| Encontrado | Significa | Tipo do evento |
|---|---|---|
| schema `t_*` no catálogo, ausente de `platform.tenants` | drift: alguém criou schema fora do `provision` | `schema_without_registry` |
| linha em `platform.tenants` cujo schema não existe no catálogo | drift: o schema sumiu, e `migrate` já para nele (§10.1) | `registered_schema_missing` |

Enumerar pelo **registro** era a leitura alternativa e ela cega o comando exatamente onde ele é vendido
como resposta ao drift: um schema `t_*` que ninguém registrou seria invisível a tudo (`MIG-13`). O
custo de enumerar pelo catálogo é o schema descartável órfão, e ele tem tratamento próprio no passo 7.

**Schema de referência, para os schemas de cliente:**

1. o nome é `t_verify_<aaaammddthhmmssz>_<16 hexadecimais minúsculos aleatórios>`, o componente
   aleatório vindo de gerador criptográfico. Carimbo sozinho é previsível e colide com outra execução
   no mesmo segundo. **O carimbo é minúsculo, e o `t` e o `z` dele também.** Este é o único
   identificador que o sistema gera sem passar pela borda da §10.2, e enquanto ele não era minúsculo
   puro o catálogo passou a citá-lo (`ON "t_verify_…Z_…".orders`), a impressão da §13.3 deixou de casar
   com a de qualquer cliente, e todo cliente comparado divergiu em `orders_pkey`. Medido em PostgreSQL
   16.15 em 2026-09-11, nas duas grafias do mesmo nome: minúsculo, a impressão do descartável sai
   idêntica à do cliente byte a byte; com `T` e `Z`, sete linhas divergem, `md5` de função inclusive;
2. o prefixo `verify_` é reservado na §10.2 **e** por `CHECK` em `platform.tenants`, então nenhum
   cliente pode ter um nome dessa família;
3. antes de criar, o nome não pode existir no catálogo; a criação é `CREATE SCHEMA` sem
   `IF NOT EXISTS`, citado pelo caminho da §10.3.0. O executor guarda o `oid` do namespace criado;
4. as migrations são aplicadas ali **sem escrever no ledger**. Linha do ledger nunca é apagada
   (`CONTRATO.md` §5) e este schema é: registrar produziria, para sempre, linhas nomeando um schema
   que não existe, e `status` passaria a mentir. O conjunto pendente de um schema novo é conhecido sem
   ledger — é o conjunto inteiro;
5. **uma referência só, enquanto a §11.6 valer.** A regra permanente é uma referência por conjunto de
   módulos ativos, porque clientes com módulos diferentes têm estrutura legitimamente diferente e
   comparar todos contra uma referência de módulos completos produziria diferença que não é drift.
   Enquanto não existir registro de ativação, nenhum cliente tem módulo e nenhuma migration de módulo
   pode estar no repositório, então o conjunto é um só: o núcleo. Esta frase volta a ser a regra
   completa no dia em que o registro nascer, e não antes — antes ela mandaria o executor ler o que não
   existe (`MIG-17`);
6. comparação: a **impressão de estrutura** da §13.3, tirada do schema real e da referência, comparada
   linha a linha. Diferença é **achado** (`migrations.md` §9): saída `3`, o que diferiu na mensagem, e
   uma linha `structure_mismatch` em `platform.executor_events`;
7. remoção do schema descartável, com **três condições conferidas no ato**, todas no catálogo: o `oid`
   do namespace ainda é o que esta execução criou; o nome casa com o padrão do passo 1; e o nome não
   aparece em `platform.tenants.schema_name`. Falhando qualquer uma, o schema **fica** e a saída é `4`,
   com o nome na mensagem. A remoção é `DROP SCHEMA ... CASCADE`, e é a segunda e última exceção de
   remoção do executor.

**O descartável órfão**, que é o preço declarado da enumeração pelo catálogo: schema `t_verify_%` que
uma execução anterior não conseguiu derrubar. Ele **não** é reportado como cliente sem registro — o
nome o identifica —, e execução nenhuma consegue removê-lo, porque a condição 1 do passo 7 é o `oid`
que *aquela* execução criou. Então ele é nomeado na saída como resíduo, a cada rodada, até que uma mão
humana o derrube. Aparecer toda vez é a intenção: resíduo que some do relatório vira schema esquecido
com estrutura de cliente dentro.

**Referência para o `platform`.** O schema de controle tem nome constante e migrations que o qualificam
literalmente, então ele não pode ser reproduzido num schema descartável ao lado. A referência dele é
**declarada**: `db/referencia-estrutural-platform.txt`, a impressão da §13.3 tirada de um banco em que a
stream `platform` foi aplicada do zero, versionada junto das migrations. `verify` compara o `platform`
real contra esse arquivo; diferença é saída `3` e linha `structure_mismatch`.

Quem escreve migration de `platform` regenera o arquivo na mesma mudança, e o teste de aceite 18
(`CONTRATO.md` §14) é o que impede os dois de divergirem em silêncio: banco limpo, stream aplicada,
impressão tirada, comparada com o arquivo.

A referência anterior era um **banco descartável** criado pelo próprio `verify`, e ela caiu por duas
razões: exige `CREATEDB`, que o humano decidiu não dar ao executor, o que fazia toda execução real
terminar em `4` sem comparar nada (`MIG-11`); e o `DROP DATABASE` que ela pedia era o comando mais
destrutivo do sistema e o único sem condição de alvo escrita. Comparar contra arquivo declarado dá
resposta a cada rodada; comparar contra banco de referência dava resposta em nenhuma.

**O que o `verify` lê de todos os clientes**, e é bom que esteja nomeado: ele é o único leitor
cross-schema autorizado do sistema. A leitura é de **catálogo** — nomes e tipos de estrutura —, nunca
de dado de negócio, e nenhuma consulta dele seleciona linha de tabela de cliente. Ele continua sendo o
único, e a saída dele carrega a carteira: classificação em `db/papeis-e-credencial.md` §4.

`verify` é também a resposta ao drift: ajuste feito na mão em ambiente compartilhado aparece como
diferença contra a impressão de referência. Em banco de produção o comando roda com a ressalva do
passo 7 explícita, ou não roda.

### 13.3 A impressão de estrutura

Uma consulta só, parametrizada pelo nome do schema, usada nos dois lugares: o `platform` contra o
arquivo declarado, e cada cliente contra o schema descartável. O nome do schema entra como **valor**,
em `WHERE`, então aqui não há identificador a citar.

```sql
SELECT linha FROM (
    SELECT format('tabela      %s', c.relname) AS linha
      FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
     WHERE n.nspname = $1 AND c.relkind IN ('r','p')
    UNION ALL
    SELECT format('coluna      %s.%s %s %s %s', c.relname, a.attname,
                  replace(format_type(a.atttypid, a.atttypmod), $1 || '.', ''),
                  CASE WHEN a.attnotnull THEN 'NOT NULL' ELSE 'NULL' END,
                  coalesce(replace(pg_get_expr(d.adbin, d.adrelid), $1 || '.', ''), '-'))
      FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
      JOIN pg_attribute a ON a.attrelid = c.oid
      LEFT JOIN pg_attrdef d ON d.adrelid = c.oid AND d.adnum = a.attnum
     WHERE n.nspname = $1 AND c.relkind IN ('r','p','v') AND a.attnum > 0 AND NOT a.attisdropped
    UNION ALL
    SELECT format('restricao   %s.%s %s', c.relname, con.conname,
                  replace(pg_get_constraintdef(con.oid), $1 || '.', ''))
      FROM pg_constraint con JOIN pg_class c ON c.oid = con.conrelid
      JOIN pg_namespace n ON n.oid = c.relnamespace
     WHERE n.nspname = $1
    UNION ALL
    SELECT format('indice      %s', replace(i.indexdef, $1 || '.', ''))
      FROM pg_indexes i WHERE i.schemaname = $1
    UNION ALL
    SELECT format('sequencia   %s', c.relname)
      FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
     WHERE n.nspname = $1 AND c.relkind = 'S'
    UNION ALL
    SELECT format('visao       %s %s md5:%s', c.relname,
                  coalesce(array_to_string(c.reloptions, ','), '-'),
                  md5(replace(pg_get_viewdef(c.oid), $1 || '.', '')))
      FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
     WHERE n.nspname = $1 AND c.relkind = 'v'
    UNION ALL
    SELECT format('materializada %s %s md5:%s', c.relname,
                  coalesce(array_to_string(c.reloptions, ','), '-'),
                  md5(replace(pg_get_viewdef(c.oid), $1 || '.', '')))
      FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
     WHERE n.nspname = $1 AND c.relkind = 'm'
    UNION ALL
    SELECT format('regra       %s.%s habilitacao:%s md5:%s', c.relname, r.rulename, r.ev_enabled,
                  md5(replace(pg_get_ruledef(r.oid), $1 || '.', '')))
      FROM pg_rewrite r JOIN pg_class c ON c.oid = r.ev_class
      JOIN pg_namespace n ON n.oid = c.relnamespace
     WHERE n.nspname = $1 AND r.rulename <> '_RETURN'
    UNION ALL
    SELECT format('gatilho     %s habilitacao:%s',
                  replace(pg_get_triggerdef(t.oid), $1 || '.', ''), t.tgenabled)
      FROM pg_trigger t JOIN pg_class c ON c.oid = t.tgrelid
      JOIN pg_namespace n ON n.oid = c.relnamespace
     WHERE n.nspname = $1 AND NOT t.tgisinternal
    UNION ALL
    SELECT format('funcao      %s(%s) md5:%s', p.proname,
                  pg_get_function_identity_arguments(p.oid),
                  md5(replace(pg_get_functiondef(p.oid), $1 || '.', '')))
      FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
     WHERE n.nspname = $1
    UNION ALL
    SELECT format('dominio     %s %s %s %s', t.typname,
                  replace(format_type(t.typbasetype, t.typtypmod), $1 || '.', ''),
                  CASE WHEN t.typnotnull THEN 'NOT NULL' ELSE 'NULL' END,
                  coalesce(replace(t.typdefault, $1 || '.', ''), '-'))
      FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace
     WHERE n.nspname = $1 AND t.typtype = 'd'
    UNION ALL
    SELECT format('dominio     %s.%s %s', t.typname, con.conname,
                  replace(pg_get_constraintdef(con.oid), $1 || '.', ''))
      FROM pg_constraint con JOIN pg_type t ON t.oid = con.contypid
      JOIN pg_namespace n ON n.oid = t.typnamespace
     WHERE n.nspname = $1
) AS impressao ORDER BY linha COLLATE "C";
```

**As linhas `dominio` e o `replace` no tipo da coluna entraram em 2026-09-23** (T-0022), junto dos
domínios de valor. `format_type` qualifica o tipo que não está no `search_path` de quem pergunta, e
medido em PostgreSQL 16 a coluna de domínio saía `t_probe.money_amount`: a primeira coluna de valor faria
todo cliente divergir do descartável. E a restrição de domínio tem `conrelid = 0`, então a linha
`restricao` não a via, e um envelope afrouxado à mão saía idêntico à referência. O `platform` não tem
domínio e só usa tipo do sistema, então `db/referencia-estrutural-platform.txt` não muda.

Cinco propriedades, e as cinco foram medidas em PostgreSQL 16.15 em 2026-09-11:

- **Neutra ao nome do schema na referência qualificada**, que é a forma `<schema>.` com que o catálogo
  escreve toda menção do schema a si mesmo. É o `replace(…, $1 || '.', '')` de cada definição. Sem ele,
  `indexdef`, `triggerdef`, `functiondef`, a definição de chave estrangeira e o `nextval` de um
  `DEFAULT` carregam o schema de origem, e a impressão de `t_acme` nunca casaria com a do descartável.
  Medido: dois schemas com a mesma DDL e nomes diferentes produziram saídas **idênticas**, byte a byte.

  **Um `replace` só, e ele basta por construção.** O catálogo cita o nome quando ele não é minúsculo
  puro, e aí a forma vira `"<schema>".`, que este `replace` não alcança. Nenhum nome deste sistema
  chega lá: o slug do cliente é `^[a-z][a-z0-9_]{1,39}$` na borda **e** por `CHECK` no registro
  (§10.2), o descartável é minúsculo pelo passo 1 da §13.2, e `platform` é constante.

  **O código implementado tem dois `replace`, e o segundo sai.** Ele foi escrito quando o nome do
  schema descartável ainda tinha `T` e `Z` maiúsculos e o catálogo o citava; o carimbo passou a ser
  minúsculo (§13.2, passo 1) e, com isso, o segundo `replace` deixou de alcançar qualquer coisa.
  Medido pelo gate: ele remove `"<schema>".` **do próprio schema impresso** e nunca de outro, então
  `REFERENCES t_vitima.orders(id)` dentro de `t_alvo` sobrevive aos dois e aparece na impressão. Não
  há buraco a fechar, e é por isso que ele é dívida e não achado: é apagamento cego de texto, hoje
  inalcançável, dentro da única consulta do sistema cujo trabalho é enxergar diferença. Fica escrito
  aqui o que motivou sua existência, para que ele não volte com a mesma boa intenção.

  A leitura alternativa era um segundo `replace`, sobre `'"' || $1 || '".'`, ensinando a consulta a
  neutralizar também a forma citada. A necessidade que ela atende — comparar schemas de nomes
  diferentes — está preservada inteira, pelo caminho mais barato: um nome minúsculo. O mecanismo foi
  recusado por duas razões. Ele não entrega a neutralidade incondicional que promete: alcança a forma
  citada **seguida de ponto** e não alcança o nome em posição não qualificada, e essa posição existe —
  medido em 2026-09-11, `pg_get_functiondef` de uma função criada com `SET search_path FROM CURRENT`
  devolve `SET search_path TO 't_acme'`, que nenhum dos dois `replace` toca. E cada `replace` é
  apagamento cego de texto dentro da única consulta do sistema cujo trabalho é enxergar diferença:
  ampliar o apagamento para acomodar uma escolha de formato que é nossa troca um defeito que falha
  **alto** — todo cliente diverge, e alguém corrige no mesmo dia — por um que falha **baixo**, em que
  uma diferença real some da comparação. A prova de que o resíduo está fechado é a §11.5, que recusa
  `SET search_path` em qualquer posição do arquivo e recusa a aspa dupla inteira: nem a forma citada
  nem a não qualificada podem nascer de uma migration nossa.
- **Carrega o corpo da view, e isto entrou no `EXE-04`.** A linha `visao` levava nome e
  `reloptions`, nunca a definição. Medido: um schema de cliente com `resumo` lendo a própria `orders`,
  impressão tirada; a view recriada na mão apontando para `orders` de **outro** cliente, impressão
  tirada de novo, **idêntica linha a linha**. As colunas casavam porque o formato é o mesmo, e
  `SELECT` na view devolvia as linhas do outro cliente. View com `security_invoker` é forma permitida
  (§11.2) e é o objeto mais barato que existe para atravessar schema; o único controle automatizado
  contra drift aprovava exatamente a diferença que mais importa. Medido depois da correção, nos dois
  sentidos: DDL igual em dois schemas de nomes diferentes produz o mesmo `md5`, e a view reapontada
  produz `md5` diferente. O corpo entra por `md5` pela mesma razão da função, e com o mesmo par de
  preços declarados.

  Medido também o que fazia essa linha ser suspeita de indeterminismo: `pg_get_viewdef` qualifica ou
  não o nome de tabela conforme o `search_path` da sessão que imprime, e os dois caminhos convergem
  depois do `replace` — com o schema no `search_path` sai `FROM orders`, sem ele sai
  `FROM <schema>.orders` e o `replace` produz `FROM orders`. O `md5` foi o mesmo nos dois arranjos.
- **Determinística.** `ORDER BY … COLLATE "C"` não depende da localidade do servidor, e nada na
  consulta depende de `oid` nem de ordem física.
- **Detecta a diferença que importa.** Medido: uma coluna acrescentada na mão em um dos dois schemas
  apareceu como uma linha a mais, e só ela.
- **Enxerga gatilho desligado**, e isto entrou no `SEC-02`. `pg_get_triggerdef` **não** carrega o
  estado de habilitação: sem a coluna `tgenabled`, `ALTER TABLE platform.tenants DISABLE TRIGGER
  tenants_reject_mutation` — o primeiro dos três atos que a §18.2 declara — saía da impressão byte a
  byte idêntico à referência, e `verify` aprovava um banco em que a trava do registro de clientes
  estava desligada. Medido nos dois sentidos em 2026-09-11: com a coluna, o mesmo comando produz
  **uma** linha divergente (`habilitacao:D` onde a referência diz `habilitacao:O`), e religar o gatilho
  devolve a impressão idêntica. A letra entra **crua**, como o catálogo a guarda, e não traduzida: um
  valor que o Postgres venha a acrescentar aparece como letra desconhecida em vez de virar texto vazio
  numa tradução que não o previu.

**As linhas `materializada` e `regra` entraram em 2026-09-23, no `SUB-09`**: uma regra que grava no
`orders` de outro cliente e uma view materializada sobre ele deixavam a impressão idêntica à base. O
porquê e o que ficou de fora estão em `db/delegacao-por-dono.md` §7.5.6.

A função entra por `md5` da definição, e não pela definição inteira, porque um corpo de função é
multilinha e quebraria a comparação linha a linha. Dois preços, os dois declarados: divergência em
`funcao` diz *qual* função mudou e não *o que* mudou, e quem investigar lê `pg_get_functiondef` à mão;
e o texto que entra no `md5` é formatado pelo servidor, então **trocar de versão maior do Postgres pode
mudar o `md5` sem que uma linha do repositório tenha mudado**. Nesse dia a referência é regenerada junto
da troca — e troca de versão maior é decisão registrada, não acidente.

Fora da impressão, de propósito: privilégio, porque `GRANT` não é estrutura e não viaja no mesmo
checksum que a tabela (`db/papeis-e-credencial.md` §3) — e é a §13.4 que passa a fazer essa pergunta,
separada; `COMMENT`, porque comentário não muda comportamento nenhum e esta comparação existe para
pegar o que muda; e qualquer linha de dado, porque o `verify` não lê dado de cliente e não é aqui que
ele vai começar.

### 13.4 A verificação de privilégio do executor sobre o registro de clientes

`db/papeis-e-credencial.md` §5 manda revogar `UPDATE`, `DELETE` e `TRUNCATE` do papel do executor sobre
`platform.tenants`. Esse `REVOKE` entra no ato que cria o papel, que não é migration e hoje não é
artefato nenhum, e o gate apontou a consequência: das três camadas que protegem o registro, nenhuma era
verificável por automação. Duas passaram a ser — o gatilho, pela §13.3, e esta.

`verify` faz **uma** pergunta ao catálogo, sem parâmetro, sobre a conexão que ele mesmo está usando:

```sql
SELECT usesuper,
       has_table_privilege('platform.tenants', 'UPDATE')   AS pode_atualizar,
       has_table_privilege('platform.tenants', 'DELETE')   AS pode_remover,
       has_table_privilege('platform.tenants', 'TRUNCATE') AS pode_truncar
  FROM pg_user WHERE usename = current_user;
```

Medido em 2026-09-11, os três estados que ela distingue: papel do executor sem o `REVOKE` aplicado
devolve `f | t | t | t`; com o `REVOKE`, `f | f | f | f`, e o `DELETE` passa a levar
`permission denied` mesmo com o gatilho desligado; superusuário devolve `t | t | t | t`, porque
superusuário carrega todo privilégio por construção e a pergunta perde sentido para ele.

**O que `verify` faz com a resposta:** qualquer um dos três privilégios presente vira uma linha nomeada
na saída e um evento `privilege_unexpected` em `platform.executor_events` (§19). Quando `usesuper` é
verdadeiro, a mesma linha sai dizendo que a conexão é de superusuário — o que é, por si, contrário a
`db/papeis-e-credencial.md` §1.

**E o código de saída não muda**, que é a única decisão desta seção com trade-off real. Divergência de
estrutura é `3` porque tem resposta única: regenerar ou corrigir. Aqui não tem — o `REVOKE` não é
aplicado por nada versionado, então em todo banco recém-criado, e em toda máquina de quem desenvolve
com superusuário, a resposta seria `3` em **toda** rodada. Controle que reprova sempre não é obedecido,
é dispensado, e o `SEC-05` descreve exatamente essa morte. Então a detecção vira **registro permanente**
(a linha em `executor_events`, que ninguém apaga) em vez de veto; o dia em que o `REVOKE` tiver casa
mecanizada no ato que cria o papel, promover para saída `3` é uma linha e passa a ter resposta única.

### 13.5 A verificação do papel de banco de cada cliente

`verify` faz sete perguntas ao catálogo sobre esta camada, e elas moram em
`db/verificacao-do-papel.md` e em `db/universo-e-declaracao.md`, contraparte do ato que as produz:
**§7.5**, o papel de cada cliente está bem formado; **§7.5.1**, quem mais alcança o schema dele;
**§7.5.2**, o que os `REVOKE` do operador deixaram de fazer; **§7.5.3**, o que existe fora de
`platform` e de `t_*`; **§7.5.4**, quem está declarado, se cada declaração tem o ato ao lado, e quem é
dono de cada schema nosso; **§7.5.5**, se algum papel declarado tem membro — e ali o conjunto esperado
é vazio. Antes delas correm as precondições da §7.7: sem o grupo no cluster, a primeira acusaria
**todos** os clientes como divergentes, e a ausência recusa com `2` em vez de reprovar N vezes.

Divergência vira linha nomeada e evento (`platform/0008__…` a `0013__…`), e o código de saída sai da
tabela da §13.6 — nunca do ponto de chamada.

## 13.6 A política de veto: um lugar só, e a exceção contada

Nasceu em 2026-09-12, no sétimo gate. Até ele, **a política de cada pergunta morava no ponto de
chamada** de `verify`: `differenceFound = (await x()) || differenceFound` vetava, `await x()` não, e
não existia lugar nenhum onde a divisão estivesse escrita. Nas quatro sondas em que a reauditoria mediu
vazamento, o comando **imprimiu as linhas e saiu `0`** — e quem lia a saída não tinha como saber, sem
abrir o código, que aquela linha não vetava. Comando que produz a evidência e a contradiz na mesma
execução é pior que comando que não pergunta.

Agora existe **uma** tabela, em `db/migrator/src/commands/verify.ts`, que declara pergunta por
pergunta se ela veta ou só nomeia. Quatro propriedades, e as quatro são o contrato dela:

1. **O default de pergunta nova é vetar.** O tipo obriga: `veta: false` sem `motivo` não compila, e
   pergunta fora da tabela não tem como ser chamada, porque o nome dela **é** o tipo do parâmetro.
2. **"Nomear sem veto" é exceção com motivo escrito ao lado**, e a classe do motivo é sempre a mesma:
   o que a pergunta cobra não é aplicado por nada versionado, ou depende de quem pergunta. Reprovar
   ali faria o comando reprovar em toda rodada de toda máquina (`SEC-05`).
3. **A exceção é contada.** O caso 49 da `CONTRATO.md` §14 compara a lista derivada da tabela com a
   lista esperada: ela crescer é uma mudança de teste, que alguém lê.
4. **A saída diz de que lado cada linha está.** Linha de pergunta sem veto sai prefixada por
   `registra e não reprova:`.

As quatro exceções de hoje: privilégio do executor sobre `platform.tenants` (§13.4); declarações além
do arranjo desta rodada (§7.5.4, a janela de rotação da §7.7); privilégio padrão do papel que pergunta
(§7.5); e o ato do operador no `public` e no banco (§7.5.2). **Todo o resto veta**, e isso inclui a
pergunta que **não pôde ser feita**: sem `platform.role_declarations` — ou com ela **vazia**, desde o
oitavo gate (`PAP-27`) —, `verify` sai `3` dizendo que não perguntou, e nomeia a rodada de `migrate`
que resolve.

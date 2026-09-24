# Aplicação e alvo — §6 a §10 do contrato do executor

> Parte de `db/migrator/CONTRATO.md`. A numeração é global no conjunto (`CONTRATO.md` §0): as seções
> abaixo são as mesmas §6 a §10 que as migrations já escritas citam.
> Revisto em 2026-09-11 na correção do gate de `seguranca`: `MIG-01` (alvo perdido no regime
> não-transacional), `MIG-02` (nome de schema entrando por linha de comando) e `MIG-05` (bootstrap
> validando o ledger pelo nome).
> Revisto de novo em 2026-09-11, na reauditoria: `MIG-12` (a §8 prometia detectar índice fora do alvo
> com uma busca restrita ao alvo) e `MIG-16` (`CREATE SCHEMA` não aceita *bind parameter*, e a §10.3
> tinha deixado de descrever a única interpolação que precisa do nome dentro do comando).
> Revisto em 2026-09-11, na conferência do executor implementado contra a spec: §6 (piso de versão
> do servidor conferido na entrada), §9 e §10.3.1 (quando a asserção de alvo corre antes do corpo).
> Revisto no quarto gate, em 2026-09-11: `EXE-03` (o teto do slug era 41 e o padrão de isolamento
> enxergava 40). §10.2.

## 6. Sessão

Toda conexão do executor abre com, nesta ordem:

| Parâmetro | Valor | Por quê |
|---|---|---|
| `lock_timeout` | **obrigatório, vindo de configuração** | sem valor configurado o executor recusa iniciar, com mensagem nomeando a chave. Nenhum padrão implícito, e nenhum número inventado aqui: o primeiro valor sai de medida, não de palpite |
| `statement_timeout` | `0` | um DDL que está **progredindo** não deve ser morto; só o que está **esperando** lock, e disso cuida `lock_timeout` |
| `idle_in_transaction_session_timeout` | vindo de configuração | executor morto no meio não deixa transação segurando lock indefinidamente |
| `application_name` | `forja-migrator` | para `pg_stat_activity` dizer quem está segurando o quê |

Com que papel e com que credencial essa conexão é aberta: `db/papeis-e-credencial.md`. O executor
recusa iniciar se a credencial não vier de ambiente, e não existe valor padrão em código.

**Piso de versão do servidor, conferido na entrada.** Na conexão de controle, antes de qualquer outra
coisa, o executor lê `server_version_num` e recusa iniciar abaixo de `160000`, com saída `2`, nomeando
a versão encontrada, o piso e `db/convencoes.md` §9.

**O piso 16 é fixado pelo `CREATEROLE` do executor**, não pela view: em 15 o atributo alcança todo papel
não-superusuário do cluster, e em 16 não (`db/papel-do-cliente.md` §7.6). A view com `security_invoker`,
que `RECUSAS.md` §11.2 torna obrigatória, exige 15 — ela era quem mandava até 2026-09-11 e deixou de
ser. As duas dependências continuam vivas, e o piso é a maior delas. Sem esta conferência, um servidor
14 aceita o conjunto inteiro e quebra na primeira migration que tiver view — no meio da fila de
schemas, com `ERROR: unrecognized parameter "security_invoker"`, que não nomeia a causa e manda quem lê
investigar a migration em vez do servidor; e um servidor 15 aplica tudo sem sintoma nenhum, com o
executor alcançando papel que não é dele.
Conferir custa uma consulta sem privilégio nenhum e acontece antes de o primeiro schema ser tocado;
descobrir no meio custa uma frota parcialmente aplicada. É o mesmo desenho do `lock_timeout` acima e do
retrato estrutural da §9: o que o executor depende, ele confere antes de confiar.

## 7. Aplicação e transação

**Transacional (o caso normal):**

```
BEGIN
  SET LOCAL lock_timeout / search_path do schema alvo (§10.3.1)
  corpo da migration
  verificação de namespace (§10.4)
  INSERT na linha do ledger, com started_at, applied_at e duration_ms
COMMIT
```

A linha do ledger e o efeito da migration são o mesmo commit. Ou a migration existe inteira e está
registrada, ou nenhum dos dois aconteceu. Não há estado intermediário observável.

**Falha:** o schema corrente é revertido pelo próprio `ROLLBACK`, a rodada **para** ali, e os schemas já
concluídos permanecem aplicados. Falhar no schema 7 de 20 é caminho previsto, não acidente: os seis
primeiros ficam prontos e a próxima rodada retoma do sétimo.

**Retomada:** a próxima rodada recalcula o conjunto pendente por `(schema_name, version)` e aplica só o
que falta. Como a linha do ledger só existe em caso de sucesso, e como toda migration é idempotente
(`IF NOT EXISTS`, `ON CONFLICT DO NOTHING`), reexecutar não duplica efeito, mesmo que a falha tenha
acontecido depois de o corpo rodar e antes do commit.

## 8. Migration não-transacional

Existe para um caso e só um: `CREATE INDEX CONCURRENTLY`, que não roda dentro de transação. Uma
migration marcada `transacional: nao` contém **apenas** comandos que exigem isso, e o carregador a
recusa se ela contiver qualquer outro DDL.

Sequência, em **conexão dedicada** (§10.3.2):

```
1. INSERT no ledger com applied_at NULL, e COMMIT    (marca de "em voo")
2. alvo fixado em escopo de sessão e conferido (§10.3.2)
3. corpo, comando a comando, em autocommit, com asserção de alvo antes de cada comando
4. verificação de namespace (§10.4)
5. UPDATE da linha com applied_at e duration_ms, e COMMIT
6. conexão fechada, nunca devolvida a pool
```

**O que a retomada precisa limpar.** Linha com `applied_at IS NULL` significa que a rodada anterior
morreu no meio. Para cada nome declarado em `cria-indice`, procurado **dentro do namespace alvo**, e
nunca por nome solto:

1. se o índice não existe no namespace alvo, nada a limpar;
2. se existe e `pg_index.indisvalid = true`, ele está completo: nada a limpar, e o passo 5 do fluxo
   acima é refeito;
3. se existe e `indisvalid = false`, ele é lixo da tentativa anterior e é removido com
   `DROP INDEX CONCURRENTLY`, qualificado pelo namespace alvo.

Este é o **único** `DROP` que o executor emite dentro de schema de cliente, e ele só alcança índice que
a própria migration declarou criar e que o catálogo confirma estar inválido **naquele namespace**.
Índice válido nunca é removido, e índice não declarado nunca é tocado. A proibição de `DROP` de
`migrations.md` §4 continua inteira para tudo mais.

**São duas buscas diferentes, e confundi-las era a contradição que o gate achou (`MIG-12`).** A busca
de **limpeza** é restrita ao namespace alvo, e é a dos três itens acima. A busca de **achado** é pelo
nome em **todos** os namespaces, e é outra consulta:

```sql
SELECT n.nspname
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
 WHERE c.relkind = 'i' AND c.relname = $1;
```

**Índice declarado que aparece fora do namespace alvo não é limpeza, é achado.** A rodada para, com o
nome e o namespace na mensagem, o evento vira linha `index_outside_target` (§19), e a remoção é decisão
humana: o executor não remove objeto fora do schema em que estava trabalhando, nem para consertar o
próprio estrago. É a sequela de `MIG-01`, e a busca por nome solto era o que a escondia — medido: com o
`search_path` restrito ao alvo, `to_regclass('ix_ghost')` devolve nulo enquanto o índice existe em
`public`, então a ausência de resposta não prova a ausência do objeto. A detecção primária continua
sendo a §10.4, que pega o `oid` novo fora do alvo no momento da criação; esta busca é o que faz a
promessa desta seção ter consulta que a produza.

## 9. Bootstrap do ledger

O executor não pergunta se o **nome** existe; pergunta o que existe com aquele nome:

```sql
SELECT c.relkind
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
 WHERE n.nspname = 'platform' AND c.relname = 'schema_migrations';
```

| Resposta | Significado | O que o executor faz |
|---|---|---|
| nenhuma linha | banco novo, ou anterior ao ledger | aplica `platform/0000__ledger.sql` em uma transação e, na mesma, insere a linha que registra a própria `0000` |
| `r` (tabela) | ledger provável | confere o retrato estrutural (abaixo) antes de qualquer outra coisa |
| qualquer outro `relkind` | drift: view, tabela estrangeira, sequência com o nome do ledger | **saída `3`**, nada aplicado, mensagem nomeando o `relkind` encontrado |

`to_regclass` foi recusado aqui, e o motivo é medido: ele casa com **view** tão bem quanto com tabela
(PostgreSQL 16.15, 2026-09-11), e um banco ajustado à mão — que `migrations.md` §9 prevê — faria o
executor concluir que o ledger existe quando o que existe é uma view sem nenhuma das restrições.

**Retrato estrutural do ledger.** Depois de aplicar o `0000`, e antes de confiar em um ledger
pré-existente, o executor compara o que está no catálogo contra o que a §5 declara: as sete colunas,
com nome, tipo, nulidade e ordem, e as sete restrições pelo nome (`schema_migrations_pkey` e as seis
`CHECK` do `0000`). Divergência é **saída `3`**, nomeando o que falta ou sobra.

**O retrato do bootstrap olha coluna e restrição, e não olha gatilho** — de propósito. Quando ele roda
num banco novo, `platform/0003__ledger_append_only.sql` ainda não passou, então o ledger legitimamente
não tem gatilho nenhum; exigi-lo aqui faria o bootstrap reprovar exatamente o banco vazio que ele
existe para atender. A conferência completa do `platform`, gatilho e função inclusive, é do `verify`
(§13.2), que roda com tudo aplicado.

Pela mesma razão, e está escrito na §10.3.1: a asserção de alvo da `0000` num banco vazio só pode
correr **depois** do corpo, porque é o corpo que cria o schema `platform`.

Sem esse retrato, o caso medido é este: uma `platform.schema_migrations` pré-existente com **as mesmas
sete colunas e nenhuma restrição** faz o `CREATE TABLE IF NOT EXISTS` pular em silêncio; a tabela
resultante aceitou checksum não hexadecimal, duas linhas para a mesma `(schema_name, version)` e uma
linha com `duration_ms` preenchido e `applied_at` nulo. A partir daí a verificação de checksum da §3
não tem resposta única e a retomada da §8 lê "em voo" onde não há voo.

A linha da própria `0000` **não está dentro do arquivo, e não poderia estar**: ela carrega o checksum
do próprio arquivo, e nenhum arquivo contém o próprio checksum. Quem a escreve é o executor, pelo mesmo
caminho de qualquer outra migration (§7), com uma diferença: aqui o `INSERT` é `ON CONFLICT DO NOTHING`.
O bootstrap corre antes de haver conjunto pendente calculado, então ele precisa tolerar um ledger que já
tenha a linha — o caso é banco ajustado na mão, e abortar ali seria transformar drift em impossibilidade
de rodar. Para as demais migrations o `INSERT` é simples, porque linha pré-existente ali significaria
duas rodadas simultâneas, que este desenho não admite (§16).

O arquivo é idempotente por conta própria (`CREATE SCHEMA IF NOT EXISTS`, `CREATE TABLE IF NOT EXISTS`,
e toda restrição nascendo junto da tabela em vez de por alteração posterior), então aplicá-lo contra um
banco em que ele já passou é inofensivo.

A verificação de checksum da §3 só acontece **depois** do bootstrap, porque antes dele não há onde ler
checksum registrado.

Divergência conhecida, declarada para não virar duas verdades: o comentário de
`platform/0000__ledger.sql` cita a consulta antiga, `to_regclass(...) IS NULL`, porque foi escrito
antes desta revisão. Migration aplicada não se edita (`migrations.md` §1), e a correção de prosa em
arquivo de migration é `COMMENT ON` em migration futura, não edição. Quem lê o arquivo e esta seção
juntos segue esta: a consulta normativa é a de `relkind` acima.

## 10. Identificador de schema: a única interpolação do sistema

O executor é o único lugar do produto que precisa de um nome de schema dentro de um comando
(`CREATE SCHEMA`, `search_path`), e `00-nucleo.md` §8 proíbe montar SQL por concatenação. O mecanismo,
em camadas, e nenhuma delas sozinha.

### 10.1 Procedência: o nome sempre volta a um registro

| Entrada | De onde vem o nome | Confronto obrigatório |
|---|---|---|
| rodada normal (`migrate`) | `platform.tenants.schema_name` | é a fonte; não há o que confrontar |
| `migrate --schema t_<slug>` | quem digita | o nome **tem** que existir em `platform.tenants.schema_name`. Ausente: saída `2`, nenhuma aplicação, nenhuma conexão de trabalho aberta |
| `provision <slug>` | quem digita | slug ausente do registro **e** schema ausente do catálogo, nesta ordem, com as travas do §13 |

Duas consequências que valem como regra:

- **`migrate` nunca cria schema.** Se um schema registrado não existe no catálogo, isso é drift
  (`migrations.md` §9) e a rodada para, nomeando o schema. Criar schema é ato de `provision`, e de mais
  ninguém. Essa fronteira é o que impede `--schema` de virar um criador de schema por digitação.
- **`--schema public` e qualquer outro nome fora do registro são recusados pela mesma regra**, sem
  precisar de lista de exceção. Antes desta revisão, o contrato não exigia o confronto, e a stream
  `tenant` inteira podia ser aplicada no `public` sem um único erro (medido).

### 10.2 Validação na borda

`^[a-z][a-z0-9_]{1,39}$` para o slug, com o schema sendo `t_` + slug: **de 2 a 40 caracteres**, o que
mantém o nome dentro dos 63 bytes de identificador do Postgres com folga. A mesma regra existe como
`CHECK` na coluna do registro (`platform/0001__tenant_registry.sql` mais
`platform/0007__tenant_slug_length.sql`), para que a validação não dependa de o código lembrar dela.

**O teto era 41 e virou 40 no quarto gate, e o caractere a mais tinha efeito de isolamento.** A expressão
anterior era `{1,40}`, que conta a classe inicial uma vez e a repetição até 40: 41 no total. O padrão
que recusa qualificador de schema alheio (`RECUSAS.md` §11.3) enxergava 40, e o cliente de slug com 41
caracteres saía da fronteira de isolamento sem sintoma nenhum — os outros continuavam protegidos e o
arquivo passava na revisão (`EXE-03`, medido). Dois números escritos à mão em dois arquivos, sem
constante comum e sem teste ligando um ao outro.

A correção é dos dois lados e nenhum deles é "escrever o mesmo número com mais cuidado": o teto
encolheu aqui e no banco, e o padrão da §11.3 **deixou de escrever comprimento**. Sobra um número no
sistema, e ele está em dois lugares que são camadas diferentes de propósito (borda e `CHECK`), com
teste de aceite conferindo que concordam. Encolher foi o lado escolhido porque nenhum cliente existe,
porque um slug de 40 caracteres já é comprido demais para alguém digitar, e porque o outro lado
mandaria o padrão de isolamento crescer para caber um nome.

Reservados, recusados na borda **e** por `CHECK` no registro: `platform`, `public`,
`information_schema`, o prefixo `pg_` e o prefixo `verify_`.

O `verify_` é o único dos cinco que morde hoje: o schema descartável do `verify` se chama
`t_verify_<carimbo>` (§13), e um cliente com slug começando em `verify_` produziria um nome dessa
família — o schema de um cliente real entrando na única rotina do sistema que remove schema. Os outros
quatro não podiam colidir enquanto o prefixo `t_` existir, e ficam porque são baratos e porque o
prefixo é o tipo de coisa que alguém revisita.

Validação de forma **não** é validação de alvo. A citação impede injeção de comando; ela não tem
opinião sobre qual identificador é o certo. Quem cuida disso é a §10.1, e por isso as duas existem.

### 10.3 Citação no servidor, com o nome chegando como parâmetro

**Nenhum identificador é citado por código do cliente.** O nome do schema sempre atravessa como *bind
parameter* e quem o transforma em identificador é o Postgres. Existem dois caminhos, porque existem
dois lugares onde o nome precisa entrar, e a revisão anterior tinha descrito só um.

#### 10.3.0 Quando o nome entra no **texto do comando**: `CREATE SCHEMA`

`CREATE SCHEMA` não aceita parâmetro na posição do identificador — medido em PostgreSQL 16.15 em
2026-09-11: `PREPARE cs(text) AS CREATE SCHEMA $1` é erro de sintaxe. E o caminho de `set_config` da
§10.3.1 só alcança `search_path`, que é valor, não identificador. Então este é o **único** comando do
sistema que precisa do nome dentro do próprio texto, e a citação dele é feita **no servidor**, em dois
passos:

```sql
-- 1. o servidor produz o comando, com o nome chegando como parâmetro
SELECT format('CREATE SCHEMA %I', $1);

-- 2. o texto devolvido é enviado verbatim, sem uma linha de composição no cliente
```

Medido no mesmo dia, com o slug hostil `t_x"; DROP TABLE probe.alvo; --`: o passo 1 devolveu
`CREATE SCHEMA "t_x""; DROP TABLE probe.alvo; --"`, o passo 2 criou um schema com esse nome **literal**,
nenhum comando extra rodou e a tabela alvo continuou com as duas linhas que tinha.

Vale para os dois lugares que criam schema: o passo 4 de `provision` (§13.1) e o schema descartável do
`verify` (§13.2). O nome do descartável é gerado por dentro e **não** passa pela validação de slug da
§10.2 — o prefixo `verify_` é justamente o que aquela borda recusa —, então ele tem a própria checagem
de forma, que é o padrão do passo 1 da §13.2, conferido antes da citação.

A restrição de `00-nucleo.md` §8 continua inteira: o que ela proíbe é o cliente montar SQL por
concatenação, e aqui quem monta é o servidor, com a citação dele.

#### 10.3.1 e 10.3.2: quando o nome entra como **valor**

Nos dois regimes de aplicação o nome não entra em comando nenhum: ele vira o valor do parâmetro
`forja.target_schema`, e o `search_path` sai de `quote_ident` sobre esse valor. O texto SQL é constante
nos dois casos. O que muda entre eles é **o escopo** em que o alvo vive.

##### Regime transacional (§10.3.1)

```sql
-- 1. o nome chega como parâmetro, nunca dentro do texto do comando
SELECT set_config('forja.target_schema', $1, true);

-- 2. texto constante; quote_ident faz a citação
SELECT set_config('search_path', quote_ident(current_setting('forja.target_schema')), true);

-- 3. conferência antes do corpo
SELECT current_schema(), array_length(current_schemas(false), 1);
```

O terceiro argumento `true` faz o ajuste local à transação, então o `search_path` não vaza para a
conexão seguinte. O `search_path` contém **exatamente um** schema, sem `public`, de modo que um
`CREATE TABLE` sem qualificação no corpo da migration não tem outro lugar onde pousar. O passo 3 é
recusa, não registro: `current_schema()` diferente do alvo, ou mais de um schema no caminho, aborta a
transação antes do corpo.

**Quando o passo 3 corre, e a exceção é uma só.** Ele corre **antes** do corpo sempre que o schema já
existe — o que é todo schema de cliente, porque `migrate` nunca cria schema (§10.1), e todo `platform`
depois da `0000`. E corre **depois** do corpo em todos os casos, sem exceção.

A exceção da frente é a `platform/0000` num banco vazio: o schema `platform` é criado pelo corpo dela,
e enquanto ele não existe o `search_path` da sessão aponta para um nome ausente, com `current_schema()`
nulo. Exigir a asserção ali reprovaria exatamente o banco vazio que o bootstrap existe para atender —
é o mesmo motivo pelo qual o retrato do bootstrap não olha gatilho (§9).

A cobertura não cai com isso, e o que a sustenta é a asserção de trás mais a §10.4, que roda dos dois
lados em todos os casos: se o corpo tivesse posto o `search_path` em outro lugar, ou criado objeto fora
do alvo, a conferência posterior aborta antes do `COMMIT` e nada existiu. A asserção da frente é o que
impede o corpo de **começar** no lugar errado; ela é prevenção, e num schema que ainda não existe não
há lugar errado onde começar.

##### Regime não-transacional (§10.3.2)

Aqui o mecanismo acima **não funciona**, e isso foi medido em PostgreSQL 16.15 em 2026-09-11: em
autocommit a transação é o próprio comando, `set_config(..., true)` morre com ele, e o comando seguinte
roda com `search_path = public`. No mesmo teste o parâmetro `forja.target_schema` também já não
existia, e o `CREATE INDEX CONCURRENTLY` seguinte foi para `public` (o auditor mediu a criação em
`public`; aqui, sem tabela homônima lá, ele falhou). Os dois desfechos são o mesmo defeito: **o alvo
não sobrevive ao statement.**

Então, no regime não-transacional:

1. a migration roda em **conexão dedicada**, aberta para ela e fechada ao fim, nunca devolvida a pool.
   É essa conexão, e só ela, que pode ter estado de sessão;
2. o alvo é fixado em **escopo de sessão** — o mesmo caminho de parâmetro e `quote_ident`, com o
   terceiro argumento `false`:

```sql
SELECT set_config('forja.target_schema', $1, false);
SELECT set_config('search_path', quote_ident(current_setting('forja.target_schema')), false);
```

3. antes de **cada** comando do corpo, o executor confere `current_schema()` e o tamanho de
   `current_schemas(false)`. Divergiu, a rodada para sem emitir o comando;
4. ao fim, a verificação de namespace da §10.4;
5. a conexão é fechada. Fechar é o que apaga o estado de sessão: medido, conexão nova nasce com
   `current_schema() = public`, sem herdar nada.

Medido nesse arranjo: `current_schema()` continua sendo o schema alvo no comando seguinte, o
`CREATE INDEX CONCURRENTLY` nasce no schema alvo e o índice sai válido.

Por que não a alternativa óbvia, qualificar o nome dentro do arquivo: é um arquivo para N schemas, e
qualificar exigiria substituir texto de SQL antes de enviá-lo, arquivo por arquivo — a concatenação que
`00-nucleo.md` §8 proíbe, saindo de um ponto mecanizado para todo autor de migration, para sempre.

### 10.4 Verificação de namespace, nos dois regimes

Ao fim de cada migration de alvo `tenant`, o executor confere que **nenhum objeto novo apareceu fora do
namespace alvo**. A forma é um retrato de `oid` tirado antes e depois, restrito ao que está **fora** do
alvo e fora dos namespaces de sistema (`pg_catalog`, `information_schema`, `pg_toast*`, `pg_temp*`),
sobre `pg_class`, `pg_type`, `pg_proc` e `pg_namespace`. Qualquer `oid` presente no retrato de depois e
ausente no de antes é divergência.

| Regime | Quando roda | O que a divergência causa |
|---|---|---|
| transacional | antes do `COMMIT` | `ROLLBACK`. O objeto nunca existiu, a rodada para, a mensagem nomeia objeto e namespace |
| não-transacional | depois do último comando do corpo, e depois de cada comando quando a migration tiver mais de um | a rodada para com a linha do ledger **em voo**; o objeto continua lá, porque não há transação para desfazer, e removê-lo é decisão humana (§8) |

A assimetria é declarada de propósito: no regime não-transacional esta verificação é **detecção**, não
prevenção. A prevenção ali é o passo 3 da §10.3.2, que confere o alvo antes de cada comando. Escrever
"antes do commit" num regime que não tem commit foi exatamente o que deixou o único regime perigoso sem
verificação nenhuma.

**O que esta verificação não pega, e foi medido (`MIG-10`, prova `P7b`):** ela procura objeto **novo**
fora do alvo, então não vê alteração de objeto que já existe. Com o retrato indo de 26 `oid` para 26,
a tabela de outro cliente ganhou `CHECK`, coluna, `COMMENT`, `DEFAULT` e uma linha. Também não vê
leitura: um `CREATE TABLE ... AS SELECT` de outro schema deposita o objeto novo **dentro** do alvo, que
é onde ele deveria estar. Quem cobre esses dois casos é a §11.3, pela recusa da referência qualificada
antes de abrir conexão — e é por isso que o mecanismo é em camadas. Esta é detecção de efeito; aquela
é recusa de forma.

Migration de alvo `platform` recebe a mesma verificação, com o alvo sendo `platform`. A simetria custa
uma linha de código e fecha o caminho inverso, que hoje depende só de recusa textual (§11).

### 10.5 Tensão declarada com `dados.md` §1, e como o gate a resolveu

A regra diz que toda migration referencia o schema explicitamente e que `search_path` não é segurança.
As migrations de alvo `platform` qualificam `platform.` literalmente, porque o nome é constante. As de
alvo `tenant` não podem: é um arquivo para N schemas. Para elas, a referência explícita é feita pelo
executor, com o nome chegando por parâmetro e um `search_path` de um schema só.

O gate de `seguranca` confirmou essa leitura em 2026-09-11
(`docs/auditorias/2026-09-11-executor-e-schema-platform.md` §1): a cláusula da regra tem como
destinatário **quem conecta**, e no executor quem conecta é ele mesmo, iterando sobre um registro, sem
chamador e sem pedido. A aprovação veio condicionada a `MIG-01` e `MIG-02`, que são as §10.1 e §10.3.2
acima.

Fica dito, porque a leitura contrária já apareceu uma vez: a citação por `format('%I')` protege contra
**injeção de comando** e não protege contra **alvo errado**. Slug hostil vira, no pior caso, um nome de
schema feio, que a §10.2 recusa antes. Slug **válido e errado** entra em qualquer lugar que a §10.1 não
confrontar.

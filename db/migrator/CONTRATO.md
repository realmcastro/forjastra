# Contrato do executor de migration

> Fonte normativa: `.claude/rules/migrations.md`. Este documento não cria regra de banco, ele fixa o
> **comportamento observável** do executor, para que a implementação não decida sozinha o que a regra
> deixou em aberto.
> `D-01` (ORM e query builder) segue ABERTA: nada aqui presume ORM. O executor fala SQL por um driver,
> e as únicas dependências aprovadas são `pg`, `typescript` e `node:test`.
> Autor: `arquiteto-dados` · T-0009 passo 4 · 2026-09-11.
> Revisto em 2026-09-11, ao escrever `platform/0000__ledger.sql`: §2.2, §5, §9, §11 e §16.
> Revisto em 2026-09-11, na correção do gate de `seguranca`
> (`docs/auditorias/2026-09-11-executor-e-schema-platform.md`, achados `MIG-01` a `MIG-08`): §4, §5,
> §8, §9, §10, §11, §12, §13, §14, §15 e §16. Nesta revisão o documento foi **partido em quatro**.
> Revisto em 2026-09-11, na correção da reauditoria
> (`docs/auditorias/2026-09-11-executor-e-schema-platform-reauditoria.md`, `MIG-09` a `MIG-17`): §2.3,
> §5.1, §14 e §16, mais as §17, §18 e §19, que nasceram. O conjunto passou a ter **cinco** arquivos.
> Revisto em 2026-09-11, no terceiro gate (`docs/auditorias/2026-09-11-delta-db-e-borda-api.md`,
> `SEC-01` a `SEC-04`): §14 e §17.3. As correções de conteúdo estão em `RECUSAS.md` (§11),
> `PROVISION-E-VERIFY.md` (§13.3 e a §13.4, que nasceu) e `IMUTABILIDADE-E-FATOS.md` (§18, §19).
> `D-01` fechou desde então; o entregável de banco continua sendo SQL puro e versionado.
> Revisto em 2026-09-11, na conferência do executor implementado contra a spec: §16 (o custo real de
> duas rodadas simultâneas, e o dia em que a trava deixa de ser pendência).
> Revisto no quarto gate, em 2026-09-11 (`docs/auditorias/2026-09-11-executor-implementado.md`,
> `EXE-01` a `EXE-10`): §14, com sete casos novos e dois corrigidos. As correções de conteúdo estão em
> `RECUSAS.md` (§11.1, §11.2, §11.3, §11.5, §11.7), `PROVISION-E-VERIFY.md` (§12, §13.1, §13.3) e
> `db/papeis-e-credencial.md` (§6, que nasceu).
> Revisto em 2026-09-11, quando o humano fechou o arranjo de papel e mandou o ato que cria o papel de
> cliente virar passo do `provision`: §0 (o conjunto passou a ter **sete** arquivos), mais
> `PROVISION-E-VERIFY.md` (§12, §13.1, §13.5), `RECUSAS.md` (§11.2, §11.5) e a §7, em
> `db/papel-do-cliente.md`, que nasceu.
> Revisto no quinto gate, em 2026-09-11 (`docs/auditorias/2026-09-11-camada-de-papel.md`, `PAP-01` a
> `PAP-12`): §0 (o conjunto passou a ter **oito** arquivos) e `PROVISION-E-VERIFY.md` §12 e §13.5. O
> conteúdo corrigido está em `db/papel-do-cliente.md` (§7.2 a §7.4, §7.7), `db/papeis-e-credencial.md`
> (§6.2) e `db/verificacao-do-papel.md`, que nasceu com a §7.5 partida.
> Revisto no sétimo gate, em 2026-09-12
> (`docs/auditorias/2026-09-12-reauditoria-camada-de-papel.md`, `PAP-19` a `PAP-23`): §0 (o conjunto
> passou a ter **nove** arquivos, com `db/universo-e-declaracao.md`) e §14, com seis casos novos e
> dois reescritos. O conteúdo corrigido está em `db/verificacao-do-papel.md` (§7.5 e §7.5.1),
> `db/universo-e-declaracao.md` (§7.5.3 e a §7.5.4, que nasceu), `db/papel-do-cliente.md` (§7.4, §7.7)
> e `PROVISION-E-VERIFY.md` (§13.1, §13.2 e a §13.6, que nasceu).

## 0. Os arquivos, e por que a numeração é global

O contrato não cabia em um arquivo depois das correções do gate, e cada arquivo novo nasceu do mesmo
teto. O corte é por **pergunta que alguém faz ao contrato**, não por tamanho:

| Arquivo | Pergunta que ele responde | Seções |
|---|---|---|
| `db/migrator/CONTRATO.md` (este) | o que é uma migration, como ela é descoberta, o que se exige dela | §1–§5, §14–§17 |
| `db/migrator/APLICACAO-E-ALVO.md` | como e **onde** ela é aplicada | §6–§10 |
| `db/migrator/RECUSAS.md` | o que o carregador recusa antes de abrir conexão | §11 |
| `db/migrator/PROVISION-E-VERIFY.md` | como um cliente nasce, e como se prova que o conjunto reproduz o banco | §12–§13 |
| `db/migrator/IMUTABILIDADE-E-FATOS.md` | o que o `platform` recusa alterar, e o que o executor registra quando detecta | §18–§19 |
| `db/papeis-e-credencial.md` | com que papel de banco o executor conecta, e o que a aplicação **não** alcança | §0–§6, numeração própria |
| `db/papel-do-cliente.md` | como nasce o papel de banco de um cliente | §7.1–§7.4, §7.6 e §7.7, na numeração do arquivo acima |
| `db/verificacao-do-papel.md` | como se prova que esse papel é o **único** caminho até o schema do cliente | §7.5, §7.5.1 e §7.5.2 |
| `db/universo-e-declaracao.md` | o que existe fora do que declaramos, e quem nós declaramos legítimo | §7.5.3 e §7.5.4 |

A numeração de seção é **global no conjunto**: uma seção mora em um arquivo só, e nenhum número é
reaproveitado. Citação na forma `CONTRATO.md §10` continua endereçando a mesma seção que endereçava
antes do corte. Isso não é gosto: `platform/0000__ledger.sql` e `platform/0001__tenant_registry.sql`
citam `§3`, `§5`, `§6`, `§9`, `§10`, `§13`, `§18` e `§19` dentro de comentário, e migration aplicada
não se edita
(`migrations.md` §1) — renumerar apodreceria referência dentro do único tipo de arquivo que não tem
conserto.

## 1. Vocabulário

| Termo | Significado neste documento |
|---|---|
| **migration** | um arquivo `.sql` com cabeçalho declarado (§4) |
| **stream** | a sequência à qual a migration pertence: `platform`, `tenant` ou `module:<codigo>` |
| **version** | o caminho do arquivo relativo a `db/migrations/`, sem `.sql`. Exemplo: `tenant/0007__add_order_discount` |
| **alvo** | `platform` ou `tenant`. Uma migration tem exatamente um |
| **schema** | um nome concreto de schema no banco: `platform`, ou `t_<slug>` de um cliente |
| **rodada** | uma execução do comando `migrate`, sobre o conjunto de schemas que o registro conhece |
| **ledger** | `platform.schema_migrations` |
| **código de módulo** | as três letras maiúsculas do registro de `docs/produto/glossario.md` §4.3 (`EST`, `FIS`, `MSA`). É o identificador estável do módulo, e é o que o ledger guarda |

## 2. Descoberta e ordem

### 2.1 Layout

```
db/migrations/
├── platform/NNNN__nome.sql         alvo platform
├── tenant/NNNN__nome.sql           alvo tenant, núcleo
└── modules/<codigo>/NNNN__nome.sql alvo tenant, stream do módulo. <codigo> é o código de
                                    módulo (§1) em minúsculas: modules/est/, modules/fis/
```

O diretório é organização. **O cabeçalho é normativo.** Arquivo cujo cabeçalho contradiz o diretório é
recusado no carregamento, antes de qualquer conexão. Duas fontes que podem discordar precisam de uma
que mande, e a que manda é a que o revisor lê junto do SQL.

### 2.2 Numeração

`NNNN` com quatro dígitos, **por stream**, não global. Um módulo numera a partir de `0001` sem
coordenar com o núcleo, o que é a condição para módulo ser plugável sem tocar o núcleo.

O primeiro número legal é `0000` na stream `platform` e `0001` nas demais. O `0000` é reservado à
migration do ledger, a única que o executor aplica antes de existir ledger para consultar (§9), e a
checagem de buraco parte do primeiro número legal da stream, não do primeiro arquivo encontrado —
senão a ausência de um `platform/0001` recém-apagado passaria despercebida.

O carregador recusa a rodada inteira quando encontra, em qualquer stream: número repetido, número fora
de sequência (buraco), ou dois arquivos com o mesmo número e nomes diferentes. Buraco é conflito de
merge não resolvido, e a rodada não é o lugar de descobrir isso.

### 2.3 Ordem de aplicação dentro de um schema

1. Todas as pendentes de `platform` (só no schema `platform`), por número.
2. Todas as pendentes de `tenant`, por número.
3. Cada `module:<codigo>` **ativo naquele cliente**, os módulos em ordem alfabética do código, cada um
   por número.

O núcleo inteiro é aplicado antes de qualquer módulo na mesma rodada. Daí sai o invariante que o autor
de migration de módulo pode usar: **no instante em que uma migration de módulo roda, o núcleo daquele
schema está na versão mais alta que existe no repositório**. A ordem alfabética entre módulos é
arbitrária de propósito: ela é determinística e reproduzível, e módulo que dependesse da ordem estaria
violando "módulo não importa módulo" (`CLAUDE.md` §7.2).

Módulo ativo é lido do registro no `platform`, nunca deduzido da existência de tabela (`dados.md` §5).

**Esse registro ainda não existe, e o contrato diz isto em voz alta porque o `.sql` sozinho não
bastou.** `platform/0001__tenant_registry.sql` declara na ausência 7 que a tabela de domínio de módulo
não nasce ali, e o fato de ativação depende de `D-03` (ausência 4). A reauditoria encontrou três
seções deste conjunto lendo um registro inexistente (`MIG-17`), e a pior saída seria a silenciosa:
tratar todo cliente como "sem módulo" faz o `verify` aprovar um cliente cujas tabelas de módulo
ninguém comparou.

Enquanto o registro não existir, então: **a stream de módulo não é aplicada por nenhum comando**, e a
presença de qualquer arquivo em `db/migrations/modules/**` **recusa a rodada inteira** (§11.6). Não é
lacuna tolerada em silêncio: é uma parada visível no dia em que a primeira migration de módulo for
escrita, e quem a escrever vai encontrar esta seção antes de encontrar o executor.

### 2.4 Ordem entre schemas

Os schemas de cliente são processados em ordem estável (nome do schema, ascendente), um de cada vez.
Nunca há transação abrangendo dois schemas. `platform` é sempre processado antes de qualquer cliente na
mesma rodada.

## 3. Checksum

`sha-256` dos **bytes** do arquivo, em hexadecimal minúsculo. Sem normalização de espaço, de fim de
linha ou de codificação: normalizar é esconder exatamente a edição que o checksum existe para pegar.

Para que a ausência de normalização não produza falso positivo, o carregador **recusa** arquivo que
contenha `CR` (0x0D) ou que não seja UTF-8 válido. Assim a única causa possível de divergência é edição
de conteúdo.

**Divergência é erro fatal que para tudo.** Em toda rodada, antes de aplicar qualquer coisa, o executor
compara o checksum registrado de cada versão já aplicada, em cada schema, contra o arquivo em disco.
Qualquer uma das três situações aborta a rodada sem aplicar nada:

| Situação | Significado |
|---|---|
| checksum diverge | migration aplicada foi editada (`migrations.md` §1) |
| versão no ledger sem arquivo em disco | migration aplicada foi apagada ou renomeada |
| arquivo pendente com número inferior ao maior já aplicado naquele stream e schema | alguém inseriu migration atrás da cabeça da fila |

A mensagem nomeia schema, versão, checksum registrado e checksum calculado. Não existe modo de
continuar, nem sinalizador que ignore. Recuperar disso é decisão humana com a mão no repositório.
A classificação dessa mensagem, que carrega nome de cliente, está em `db/papeis-e-credencial.md` §4.

O checksum prova que o **arquivo** não mudou. Ele nunca observou o banco, e por isso não substitui a
conferência de estrutura do §9 nem a do `verify` (§13).

## 4. Cabeçalho da migration

Comentários no topo do arquivo, antes de qualquer SQL, uma diretiva por linha:

```sql
-- alvo: tenant                 platform | tenant                      obrigatório
-- modulo: EST                  só quando alvo=tenant e stream=module  condicional
-- transacional: sim            sim | nao                              obrigatório
-- reversivel: nao; cria tabela nova, a inversa seria remoção (migrations.md §4)  obrigatório
-- cria-indice: ix_orders_occurred_at   só quando transacional=nao      condicional
```

O carregador recusa arquivo sem as três diretivas obrigatórias, com diretiva desconhecida, ou com
`reversivel` sem justificativa depois do valor. `cria-indice` é a lista de nomes de índice que a
migration cria com `CREATE INDEX CONCURRENTLY`, e é o que torna a limpeza da retomada capaz de não
adivinhar (§8).

**`modulo` carrega o código de módulo (§1), em maiúsculas, nunca o nome por extenso e nunca o nome do
diretório.** O carregador recusa valor fora de `^[A-Z]{3}$` e recusa arquivo cujo código não seja o
nome do diretório em maiúsculas. O registro único desses códigos é `docs/produto/glossario.md` §4.3, e
ele é prosa: o carregador confere **forma** e **acordo com o diretório**, quem confere pertinência é
quem revisa o arquivo. O valor da diretiva é o que o ledger guarda na coluna `module` (§5).

Por que o código e não o nome do diretório: a pergunta "quais módulos este schema tem" é respondida
pelo ledger, e nome de diretório é organização de repositório — renomeável, traduzível, e sem dono. O
código de três letras é o identificador que o glossário fixou e que a numeração de regra (`RN-EST-004`)
já usa, então ele é a única grafia que liga a linha do ledger à regra de negócio que a originou.

## 5. O ledger

`platform.schema_migrations`, criado pela migration `platform/0000__ledger.sql`.

| Coluna | Tipo | Nota |
|---|---|---|
| `schema_name` | `text NOT NULL` | o schema concreto onde a migration foi aplicada |
| `version` | `text NOT NULL` | §1 |
| `checksum` | `text NOT NULL` | hex de 64 caracteres |
| `module` | `text NULL` | **código de módulo** (§1, §4), `NULL` para `platform` e para o núcleo |
| `started_at` | `timestamptz NOT NULL` | |
| `applied_at` | `timestamptz NULL` | `NULL` significa iniciada e não concluída (§8) |
| `duration_ms` | `integer NULL` | escrito junto de `applied_at` |

Chave primária **natural**: `(schema_name, version)`. É a unidade de aplicação de `migrations.md` §2, e
não há chave substituta.

Uma nota de nomenclatura: a regra chama a coluna de `schema`; aqui ela é `schema_name` porque `SCHEMA`
é palavra-chave do padrão SQL e vira identificador citado em toda consulta que tocar o ledger. É a
única divergência de nome em relação à regra, e ela é de grafia, não de conteúdo.

O ledger **não** carrega `created_at` nem `updated_at`. `started_at` já é o instante de criação da
linha, e a única atualização possível é a de conclusão, que `applied_at` registra. `D-04` fechou em
2026-09-11 confirmando exatamente isto para a família de ledger e registro de processo
(`db/convencoes.md` §3 e §8), e o DDL está em `db/migrations/platform/0000__ledger.sql`.

Duas frases desta seção são `CHECK` no DDL, para não dependerem de o executor lembrar delas: o
checksum tem 64 caracteres hexadecimais minúsculos, e `applied_at` e `duration_ms` são nulos ou
preenchidos juntos. A segunda é o que dá sentido único a "em voo" (§8).

Linha do ledger nunca é apagada. Por isso o `verify` **não escreve no ledger** (§13): o schema dele é
descartável e a linha não seria.

### 5.1 O que o ledger registra, e o que ele deliberadamente não registra

Invariante 10 do `CLAUDE.md` §7 obriga a declaração, e `RN-PRV-013`
(`docs/produto/fatos-de-operacao-provedor.md`) já descreve o fato que falta.

A versão anterior desta seção declarava três ausências e a reauditoria derrubou a justificativa da
primeira nos próprios termos dela (`MIG-15`): o ledger **já** grava linha de sucesso sem autor nenhum,
e `RN-PRV-013` descreve o grão de `migration_applied` como "(schema, versão), com desfecho e duração",
sem autor. O impedimento real nunca foi `D-03`; era o `ROLLBACK` levar a linha junto com o efeito. São
dois impedimentos diferentes e eles foram separados:

| Impedimento | O que ele realmente impede | Estado |
|---|---|---|
| `ROLLBACK` leva a linha | escrever a falha **na mesma transação** que falhou | **resolvido**: segunda conexão, fora dela (§19) |
| `D-03` aberta | dizer **qual pessoa** rodou | segue aberto, e a coluna entra por expand quando fechar |

**O desfecho de falha passou a ter casa**, e ela não é coluna nova no ledger: é
`platform.executor_events` (§19, `platform/0004__executor_events.sql`). O ledger existe para responder
"o que está aplicado", e misturar tentativa com aplicação estraga essa resposta — a forma provável que
a versão anterior previa é a que foi construída. Junto dela foram as duas detecções que o gate cobrou
por nome, checksum divergente e diferença encontrada pelo `verify`, que antes paravam a rodada e
morriam na saída do processo.

Duas ausências permanecem, e nenhuma é esquecimento:

1. **O autor da rodada.** Papel de banco não é pessoa, e é só o papel que o executor conhece
   (`db/papeis-e-credencial.md`). `platform.executor_events` guarda esse papel em `db_role`; a pessoa
   depende do primeiro eixo de `D-03`, ABERTA. Coluna escrita hoje nasceria sem valor possível.
2. **A rodada como unidade.** Não há identificador ligando as N linhas aplicadas na mesma execução. O
   que se perde é "este release entrou junto"; o que sobra é reconstruir por `started_at`, que é
   aproximação. Cabe em coluna nova nas **duas** tabelas — e acrescentá-la a uma só produziria
   correlação pela metade, que é pior que correlação por instante. É expand (`migrations.md` §4), não
   edição do `0000`.

O que **não** se perde por ausência de coluna: qual versão cada schema alcançou e quando, que é a
pergunta que a operação faz todo dia e que o ledger responde por si.

Uma imprecisão conhecida, declarada para não virar duas verdades: o `COMMENT ON COLUMN` de `module` no
`0000` diz "Nome do módulo", escrito antes de esta seção fixar o código de três letras. O comentário
não é falso, é frouxo, e `migration` aplicada não se edita: a correção é um `COMMENT ON COLUMN` em
migration futura, e o comportamento já está fechado pela recusa do carregador (§4).

## 14. Testes de aceite

Os três de `migrations.md` §3, mais os que o resto deste contrato cria. Contra um Postgres real e
descartável, nenhum contra duplo de teste: o que está sendo testado é comportamento do banco.

Os marcados **Sem banco** são a exceção: medem o crivo, a política de veto e o **executor da suíte**,
que são ferramenta nossa. O caso 59 existe porque gate que aprova sem ter medido nada já reapareceu
quatro vezes nesta base.

| # | Cenário | Desfecho exigido |
|---|---|---|
| 1 | banco vazio, `migrate` + `provision` | `platform` correto e um schema de cliente completo |
| 2 | schema com dado representativo | migration nova aplica sem perder linha |
| 3 | `migrate` rodado duas vezes seguidas | segunda rodada: nenhuma linha nova no ledger, impressão de estrutura idêntica à da primeira |
| 4 | processo morto no schema k de N | os k-1 anteriores permanecem; a rodada seguinte converge, sem duplicar linha do ledger e sem duplicar efeito |
| 5 | um byte alterado em migration já aplicada | saída `3`, nada aplicado, mensagem nomeando schema, versão e os dois checksums |
| 6 | não-transacional interrompida no meio do `CREATE INDEX CONCURRENTLY` | rodada seguinte encontra `indisvalid = false`, derruba, recria, e o índice final é válido |
| 7 | não-transacional com `cria-indice`, aplicada a dois schemas de cliente | o índice existe **em cada schema alvo**, com `relnamespace` conferido, e **não** existe em `public` (§10.3.2) |
| 8 | corpo que cria objeto fora do schema alvo, nos dois regimes | transacional: aborta antes do commit; não-transacional: a rodada para na primeira verificação seguinte, com o objeto e o namespace nomeados (§10.4) |
| 9 | `provision <slug>` com slug já registrado, e `provision <slug>` cujo schema já existe | recusa nos dois casos, saída `2`, **nada aplicado no schema do cliente** e nenhuma linha nova no registro. A stream `platform` pode ter sido aplicada antes da recusa (§13.1, passo 0) |
| 10 | `migrate --schema` com nome fora do registro, inclusive `public` | recusa, saída `2`, nenhuma conexão de aplicação aberta (§10.1) |
| 11 | `platform.schema_migrations` pré-existente como view, e pré-existente como tabela de mesmas colunas sem restrição | saída `3` nos dois casos, nomeando o que divergiu (§9) |
| 12 | migration com `DROP SCHEMA`, com `ALTER TABLE ... DROP CONSTRAINT`, com `GRANT`, com `UPDATE` e com bloco `DO` | recusa do carregador, saída `2`, nenhuma conexão de aplicação aberta (§11) |
| 13 | alvo `tenant` com `CREATE TABLE IF NOT EXISTS c AS SELECT * FROM t_outro.orders`, com `INSERT ... SELECT ... ON CONFLICT DO NOTHING`, com `CREATE OR REPLACE VIEW ... FROM t_outro.orders`, e com `ALTER TABLE t_outro.orders ADD COLUMN` | recusa do carregador nos quatro, saída `2`, nenhuma conexão de aplicação aberta (§11.2, §11.3). É o `MIG-10` virando teste |
| 14 | **todo** arquivo de `db/migrations/platform/` passando pelo carregador, e uma view legítima com alias (`SELECT o.total FROM orders o`) | nenhum recusado: a fronteira da §11.3 não pode reprovar alias |
| 15 | `UPDATE`, `DELETE` e `TRUNCATE` em `platform.tenants`, e o par `DELETE`+`UPDATE` que faz um cliente resolver para o schema de outro | recusa do banco nos três, com a mensagem do gatilho; nenhuma linha mudou (§18) |
| 16 | linha do ledger em voo concluída pelo executor; depois `UPDATE` de `checksum`, de `version` e de `started_at`, e `DELETE` | a conclusão passa, as quatro reescritas são recusadas pelo banco (§18) |
| 17 | arquivo qualquer em `db/migrations/modules/` | recusa da rodada inteira, saída `2`, nomeando os arquivos (§11.6) |
| 18 | `verify` contra um `platform` a que se acrescentou uma coluna na mão | diferença contra a referência declarada, achado nomeado e linha em `platform.executor_events` (§13.2, §19) |
| 19 | migration de alvo `tenant` com `"t_outro".orders` entre aspas, com `T_OUTRO.orders` em maiúscula, e com `"T_outro" . orders` | recusa do carregador nos três, saída `2`, nenhuma conexão de aplicação aberta. É o `SEC-01` virando teste, e o teste 13 sem ele passava (§11.1, §11.3, §11.5) |
| 20 | **todo** arquivo de `db/migrations/platform/` pelo carregador, depois da regra nova | nenhum recusado: a recusa da aspa dupla não pode reprovar o corpo atual, cujas aspas estão todas em comentário (§11.5) |
| 21 | `ALTER TABLE platform.tenants DISABLE TRIGGER tenants_reject_mutation`, e `verify` em seguida | uma linha divergente contra `db/referencia-estrutural-platform.txt` (`habilitacao:D`), saída `3` e `structure_mismatch`. Religar devolve a impressão idêntica (§13.3) |
| 22 | `DELETE`, `UPDATE` de `code`, `UPDATE` de `description` e `TRUNCATE ... CASCADE` em `platform.executor_event_kinds` | recusa do banco nos quatro, com a mensagem do gatilho; `INSERT ... ON CONFLICT DO NOTHING` do seed continua passando na segunda rodada (§18.1) |
| 23 | migration recusada pelo carregador, com banco de pé | saída `2`, nada aplicado, **e** uma linha `load_refused` em `platform.executor_events` nomeando o arquivo. Com o banco fora do ar: a mesma saída `2`, falha de escrita reportada (§19.4) |
| 24 | `verify` num banco em que o `REVOKE` de `db/papeis-e-credencial.md` §5 não foi aplicado | linha nomeada na saída e evento `privilege_unexpected`; o código de saída **não** muda (§13.4) |
| 25 | corpo de função com `SET LOCAL search_path`, com `SET SESSION search_path`, com `SET LOCAL ROLE` e com `PERFORM set_config('search_path', …)`, nenhum deles com qualificador de schema | recusa do carregador nos quatro, saída `2`. É o `EXE-01` virando teste, e os quatro passavam pela regra anterior (§11.5) |
| 26 | `ALTER TABLE … ADD COLUMN IF NOT EXISTS c integer` seguido de `, DROP COLUMN total`, de `, DISABLE TRIGGER …`, de `, DROP CONSTRAINT …` e de `, OWNER TO …` | recusa nos quatro, saída `2`: vírgula fora de parêntese não cabe na forma. É o `EXE-02` (§11.2) |
| 27 | slug de 41 caracteres na borda, o mesmo slug por `INSERT` direto em `platform.tenants`, e uma migration de `tenant` com `… FROM t_<40 caracteres>.orders` | recusa nos três: borda (§10.2), `CHECK` (`0007`) e carregador (§11.3). É o `EXE-03`, e o terceiro passava com 41 e era recusado com 40 |
| 28 | `verify` com a view de um cliente recriada na mão apontando para `orders` de outro schema, mesmas colunas | linha `visao` divergente, saída `3` e `structure_mismatch`. É o `EXE-04`, e antes dele a impressão saía idêntica linha a linha (§13.3) |
| 29 | `CREATE OR REPLACE FUNCTION` com `LANGUAGE c`, com `LANGUAGE plpython3u`, com a cláusula `SET search_path = …` depois de `LANGUAGE`, e com corpo `BEGIN ATOMIC` | recusa nos quatro: os dois primeiros pela lista fechada de linguagem, os dois últimos pela cauda da forma (`EXE-06`, §11.2) |
| 30 | `CREATE SCHEMA IF NOT EXISTS t_globex` e `CREATE SCHEMA IF NOT EXISTS relatorios`, os dois em alvo `platform` | recusa nos dois: a forma só cria `platform`. É o `EXE-07`, e o primeiro criava schema de cliente sem linha no registro (§11.2) |
| 31 | função com corpo entre `$BODY$ … $BODY$`, e função cujo rótulo de abertura e de fecho diferem só na caixa | a primeira passa; a segunda é recusada nomeando o rótulo. É o `EXE-08`, e antes a primeira era recusada com mensagem que mandava procurar o defeito na §11.2 (§11.1 item 2) |
| 32 | `provision` num banco com o grupo e a credencial já criados (§7.2), e depois uma transação que assume o papel do cliente | o papel nasce sem `LOGIN`, no grupo, assumível pela credencial; a transação lê o próprio schema, e leva `permission denied` no schema de outro cliente e em `platform`. Fora de transação, sem assumir, leva `permission denied` também (`db/papel-do-cliente.md` §7.3, `db/papeis-e-credencial.md` §6.2) |
| 33 | `provision` cujo passo 7 morre — papel `app_t_<slug>` pré-existente — e, depois de a mão humana removê-lo, `migrate --schema` **sem nada pendente** | saída `3` na primeira, com cliente registrado e schema aplicado; a segunda cria o papel mesmo sem aplicar migration, e `verify` para de acusar. É a convergência de `db/papel-do-cliente.md` §7.4, e sem ela o cliente ficaria quebrado para sempre |
| 34 | tabela criada por migration **depois** do `provision`, e a mesma tabela num schema provisionado sem o `ALTER DEFAULT PRIVILEGES` | no primeiro, o papel do cliente lê sem ato nenhum a mais; no segundo, a tabela é ilegível e `verify` devolve `tenant_role_divergent` com saída `3` (`db/papel-do-cliente.md` §7.3, §13.5) |
| 35 | view com `WITH CHECK OPTION` depois da consulta; view sem `security_invoker`; `RETURNS TABLE ( … )` e `RETURNS SETOF`; e `COMMENT ON … IS` com a palavra do comando `SET` dentro do literal | a primeira passa (interior terminal); as quatro seguintes são recusadas, e a última com a mensagem dizendo que a ocorrência está **dentro de um literal** (§11.2, §11.5) |
| 36 | concessão herdável de `app_t_<slug>` à credencial emitida **pelo executor**, e `migrate --schema` em seguida | converge sem `REVOKE`: `inherit_option` vai de `t` para `f`, a leitura nua volta a `permission denied`, e assumir o papel na transação continua funcionando. É o `PAP-01` (`db/papel-do-cliente.md` §7.4) |
| 37 | privilégio padrão ausente **sozinho**, sem tabela ilegível | linha nomeada e evento `tenant_role_default_acl_absent`, com o código de saída **inalterado**; `migrate` o reemite. É o `PAP-06` (`db/verificacao-do-papel.md` §7.5) |
| 38 | `PUBLIC` com `USAGE` no schema de um cliente; o papel de um cliente com `USAGE` no de outro; papel `LOGIN` de fora com `USAGE`; e papel de fora feito membro do papel do cliente | banco íntegro devolve **zero** linha; cada adulteração sai em `3` com `tenant_schema_foreign_grant` nomeando quem alcança, e desfazê-la zera a pergunta. `migrate --schema` para **antes de conceder**. É o `PAP-02` (§7.5.1) |
| 39 | banco sem os dois `REVOKE` do ato do operador (§7.2) | linha nomeada e evento `public_grant_present`, **sem** mudar o código de saída; aplicados os dois, a pergunta para de achá-los (§7.5.2) |
| 40 | concessão herdável de `app_t_<slug>` à credencial emitida **pelo operador**, com a linha do executor de pé | `verify` e `migrate --schema` saem `3` nomeando o concedente e o `REVOKE` que só ele emite; `migrate` **não** sai `0` e não escreve nada. O `REVOKE` do executor apaga a legítima e deixa a herdável; `GRANTED BY` é negado a ele. Retirada a do operador, a do executor volta a convergir. É o `PAP-13` (§7.4) |
| 41 | `GRANT app_t_<slug> TO <papel LOGIN de fora> WITH ADMIN OPTION`; `GRANT app_t_<slug> TO app_t_<outro>`; um papel `LOGIN` posto **dentro** de `forja_app` e agraciado na forma legítima **sem declaração**; e o mesmo papel depois de uma rodada de `migrate` que o declara | os dois primeiros saem em `3`; o terceiro **também**, porque estar no grupo com `LOGIN` deixou de desculpar (`PAP-20`); o quarto é excluído e **nomeado** por `app_credential_plural`, sem veto. É o `PAP-14` reescrito no sétimo gate (§7.5.1, §7.5.4) |
| 42 | view em `public` unindo dois clientes, função `SECURITY DEFINER` em `public`, e um schema fora de `platform` e `t_*` | a credencial nua lê os dois clientes pela view; `verify` sai `3` nomeando os três, com `public_object_present` e `schema_outside_universe`. É o `PAP-15` (§7.5.3) |
| 43 | janela de rotação da §7.7, feita pelo comando: `migrate` com o ambiente apontando para a credencial nova, e depois `verify` apontando para cada uma das duas | `verify` e `migrate` saem `0` nos dois sentidos, sem nenhuma linha de alcance, e a outra credencial é nomeada por `app_credential_plural`. Retirada do grupo, a declaração dela **deixa de excluir** e ela volta a ser acusada. É o `PAP-16` (`db/papel-do-cliente.md` §7.7) |
| 44 | ambiente nomeando papel que não é a credencial da aplicação — fora do grupo, sem `LOGIN`, com `admin_option`, inexistente — e banco sem o grupo `forja_app` | recusa com saída **`2`** em `provision`, `migrate`, `migrate --schema` e `verify`, antes da primeira escrita: nenhuma concessão ao papel nomeado, nenhum schema criado. `status` não confere e não recusa. É o `PAP-07` (§7.7) |
| 45 | o **sósia** — `LOGIN NOINHERIT` no grupo, sem `admin_option`, com `GRANT … WITH INHERIT TRUE` do operador — e a **ponte** — `NOLOGIN` com `ADMIN OPTION` no grupo, montada em seis comandos do executor não-superusuário, com um leitor `LOGIN` membro dela | os dois leem os clientes nua, e os dois saem em `3` nomeados; `migrate` para **antes de conceder**. Antes do sétimo gate os dois saíam `0`, a ponte **em silêncio**. É o `PAP-19` e o `PAP-20` (§7.5.1, §7.5.4) |
| 46 | `ALTER SCHEMA t_<slug> OWNER TO <papel de fora>` pelo executor, e em seguida o dono **apagando a própria entrada de ACL** do schema | `3` nas duas, com `tenant_schema_owner_unexpected`; depois de apagar o ACL a pergunta invertida não tem o que enumerar e a afirmação de dono continua acusando, e o dono se reconcede `USAGE` para provar que a posse é o alcance. É o `PAP-22` (§7.5.4) |
| 47 | `CREATE EXTENSION pgcrypto` por não-superusuário, view em `public` sobre dois clientes, e `ALTER EXTENSION pgcrypto ADD VIEW public.v_isca` | `3` antes e depois do `ALTER`: pendurar na extensão muda a dependência, não a posse nem a referência. A extensão **sozinha** sai `0`, sem uma linha de ruído. É o `PAP-21` (§7.5.3) |
| 48 | `verify` e `migrate` num banco sem `platform.role_declarations` | `verify` sai `3` com `role_declarations_missing` dizendo **que não perguntou**; `migrate` recusa em `2` antes de tocar em papel. Pergunta não feita reprova (§7.5.4) |
| 49 | a tabela de política de veto do `verify` | as perguntas sem veto são exatamente as quatro declaradas, cada uma com motivo escrito; a maioria veta. Sem banco (§13.6) |
| 50 | `npm test` sem `FORJA_MIGRATOR_TEST_ADMIN_URL`, e contra um `postgres:16` **sem** `POSTGRES_HOST_AUTH_METHOD=trust` | a suíte **falha** nos dois, nomeando o que falta. Antes ela saía `0` com 13 pulados, a camada de papel inteira entre eles. É o `PAP-23` |
| 51 | `GRANT <credencial declarada> TO <papel de fora>` e `GRANT <executor declarado> TO <papel de fora>`, os dois pela mão do operador | o papel de fora lê os dois clientes por `SET ROLE`; `verify` sai `3` com `declared_role_member` nomeando o membro e o concedente, `migrate --schema` sai `3` **antes de conceder**, e desfazer o `GRANT` devolve `0`. Antes os dois saíam `0`, com zero linha citando o beneficiário. É o `PAP-24` (§7.5.5) |
| 52 | `INSERT` cru em `platform.role_declarations` declarando um papel de fora como `executor`, mais `ALTER SCHEMA t_<slug> OWNER TO <ele>`; depois o papel derrubado e o **mesmo nome** recriado | `3` com `role_declaration_unattested` **e** com `tenant_schema_owner_unexpected`: declarar não desculpa posse, porque o executor só exclui enquanto for dono de `platform`. O rearme pelo nome recriado também sai `3`. Antes os dois saíam `0`. É o `PAP-25` (§7.5.4) |
| 53 | linha plantada com o **nome do arranjo**, e uma rodada com esse nome no ambiente | a rodada **assume** a linha, imprime `declaração assumida:` e grava `role_declaration_adopted`; o `verify` seguinte não a acusa mais. Sem a adoção, a tabela append-only deixaria o comando em `3` para sempre (§7.5.4) |
| 54 | `platform.role_declarations` existindo e **vazia** | `3` com `role_declarations_empty`, **uma** linha, nomeando a rodada de `migrate` que resolve — e **nenhuma** linha de dono ou de alcance. Antes eram treze, três delas mandando devolver posse que já estava certa. É o `PAP-27` (§7.5.4) |
| 55 | `ALTER ROLE app_t_<slug> LOGIN`, e uma conexão direta com esse papel | o papel do cliente vira conexão por si e lê o schema sem passar pela credencial; `verify` e `migrate --schema` saem `3` com `tenant_role_divergent` nomeando o atributo, e `NOLOGIN` devolve `0`. É `atributo_indevido`, do `PAP-26` (§7.5) |
| 56 | `GRANT CREATE ON SCHEMA t_<slug> TO app_t_<slug>`, e a credencial assumindo o papel para criar tabela ali | o papel do cliente planta objeto que migration nenhuma conhece; `verify` sai `3` nomeando `tem CREATE no próprio schema`. É `create_indevido`, do `PAP-26` (§7.5) |
| 57 | `GRANT USAGE ON SCHEMA platform` + `GRANT SELECT ON platform.tenants` ao papel do cliente | a **credencial declarada** assume o papel e lê a carteira de **todos** os clientes; `verify` sai `3` nomeando `tem USAGE em platform`. É `usage_em_platform`, do `PAP-26`, e o sujeito hostil é o excluído legítimo da §7.5.1 |
| 58 | concessão herdável de `app_t_<slug>` a uma **segunda credencial declarada**, emitida pelo próprio executor | ela lê o cliente nua; `verify` sai `3` dizendo que o papel é herdado por credencial declarada que não é a do ambiente, e `migrate` com o ambiente apontando para ela **converge**, devolvendo `permission denied` à leitura nua. É `heranca_de_outra_credencial`, do `PAP-26` (§7.4) |
| 59 | o executor da suíte contra uma árvore de mentira: servidor faltando, alvo que não casa arquivo nenhum, alvo derivado vazio no modo parcial, um teste **pulado** com os dois servidores servidos, e o modo parcial com um arquivo de banco ao lado | recusa com saída `1` nos quatro primeiros — servidor faltando **antes** de rodar, os outros **depois**, com o placar à vista. O modo parcial roda só o que não fala com banco, diz que não é o gate, e sai `0`; sem a bandeira, o mesmo alvo inclui o arquivo de banco. Desde o `PAP-29`: `todo` nas quatro formas, com corpo falhando, reprova nos dois modos; no gate, passar é `pass === total`; arquivo de `scripts/arquivos-vivos.json` que não executou teste, arquivo que fala com banco fora da lista e arquivo que fala com banco fora do glob reprovam, nomeados; com a lista inteira exercida, sai `0` contando os arquivos. Sem banco (o próprio executor da suíte) |
| 60 | o executor, dono das tabelas de cliente, cria à mão no schema de um cliente: regra `DO ALSO INSERT` no `orders` do outro, regra no próprio schema, view materializada sobre o outro e sobre o próprio, view sobre um schema de fora que lê o outro, view com `security_invoker`, rotina `SECURITY DEFINER`, e view em `platform` sobre um cliente | a regra grava no outro cliente com a venda concluindo, e a materializada o entrega ao papel do cliente; `verify` sai `3` em todos, com `sobra: regra` e `sobra: materializada` na impressão, e `delegação por dono de objeto` com `object_owner_delegation` onde o objeto depende de outro schema ou é `SECURITY DEFINER`, e **só** ali. Desfeito cada um, `0`. É o `SUB-09` (`db/delegacao-por-dono.md` §7.5.6) |
| 61 | `pg_read_all_data` a um papel `LOGIN` no grupo; o mesmo, por um degrau, à **credencial declarada**; `pg_write_all_data` ao **executor declarado** | os dois primeiros leem os dois clientes; `verify` sai `3` com `alcance ao schema … alcança pg_read_all_data` em cada schema, e `migrate` recusa antes de conceder. A declaração não desculpa papel predefinido. Desfeito, `0`. É o `SUB-12` (§7.5.1) |
| 62 | a rotação da §7.7 até o fim (credencial nova declarada, tirada do grupo e dos clientes, retratada); depois o executor a devolve ao grupo e a um cliente; uma linha plantada retratada; o executor em uso retratado; `platform.role_retractions` ausente | a linha do `verify` segue o estado (ativa, inerte, e nenhuma depois da retratação); devolvida, ela sai `3` como alcance de terceiro, e a rodada que a nomeia de novo sai `2`; a plantada retratada deixa de ser acusada; retratar o executor só acusa mais; sem a tabela, `3` com `role_retractions_missing` e `migrate` em `2`. A retratação é append-only, única por nome e só de nome declarado. É o `PAP-30` (§7.5.4) |

## 15. O checklist de `migrations.md` §10, respondido

1. **Forward-only? Alguma etapa destrutiva?** Sim, forward-only. Duas remoções existem e as duas são
   nominais: índice inválido criado pela própria migration (§8) e o schema descartável do `verify`
   (§13, com as três condições de alvo). Nenhuma alcança dado de cliente. A etapa 4 do ciclo
   expand/contract não passa por este executor.
2. **Roda duas vezes? Em schema vazio e com dado?** Sim, e são os testes 1, 2 e 3 da §14. A
   idempotência é exigida da migration e verificada pelo teste, não presumida do autor. O que a
   exigência quer dizer para cada forma de comando, e qual é a forma aprovada de acrescentar
   restrição depois da tabela, está na §17.
3. **Que lock pega, por quanto tempo, no maior cliente?** **Não medido, e não medível hoje**: não
   existe cliente, nem migration de tabela real, nem volume. `lock_timeout` é obrigatório e sem padrão
   implícito (§6), o que faz a rodada falhar e ser retomada em vez de travar o caixa. O primeiro número
   sai da primeira aplicação sobre volume real.
4. **É transacional? Se não, o que a retomada limpa?** Transacional por padrão. O caso não-transacional
   é restrito a `CREATE INDEX CONCURRENTLY`, roda em conexão dedicada com o alvo fixado em escopo de
   sessão (§10.3.2), e a limpeza é o índice inválido declarado no cabeçalho, procurado **dentro do
   namespace alvo** (§8).
5. **Alvo é `platform` ou cliente, e só um?** Declarado no cabeçalho, verificado contra o diretório,
   reforçado pelas recusas da §11 e conferido no catálogo ao fim de cada migration (§10.4).
6. **Precisa de backfill?** Não. Nenhuma migration deste bloco move dado, e backfill é processo em
   lotes fora da migration de DDL (`migrations.md` §6). O executor não tem comando de backfill, de
   propósito, e a §11 recusa `UPDATE` e `DELETE` em migration.
7. **Quem lê a estrutura antiga hoje?** Ninguém. Não existe código de produto lendo banco: `db/` é a
   primeira coisa da Fase 1 e o repositório não tem `apps/` nem `packages/`.

## 16. O que este contrato não decide

- Como o executor é invocado em operação (cron, comando manual, passo de release).
- Concorrência entre duas rodadas simultâneas. O desenho atual assume execução única, e a trava por
  `pg_advisory_lock` no `platform` continua pendência — com prazo, agora. No regime transacional ela é
  barata: a chave primária do livro-razão recusa a segunda linha e o `ROLLBACK` leva junto o corpo que
  a segunda rodada acabou de aplicar, então o custo é uma rodada perdida e uma mensagem confusa. No
  regime não-transacional (§8) ela deixa de ser barata: a linha em voo é escrita **antes** do corpo, e
  a rodada que a encontra a lê como rodada anterior morta no meio e entra na limpeza, que pode derrubar
  com `DROP INDEX CONCURRENTLY` o índice inválido que a outra rodada está construindo naquele instante.
  **A trava passa de pendência a exigência no dia em que a primeira migration `transacional: nao`
  entrar no repositório**, e hoje não existe nenhuma.
- Qual pessoa rodou a migration (§5.1 item 1). Depende de `D-03`. O papel de banco já é registrado.
- O identificador de rodada (§5.1 item 2), que só serve se entrar nas duas tabelas ao mesmo tempo.
- Qualquer conteúdo de migration. Este documento descreve quem aplica, nunca o que é aplicado.

## 17. Idempotência: o que é exigido, e a forma aprovada de acrescentar restrição

`migrations.md` §3 exige que toda migration possa rodar duas vezes sem estragar nada. O `0000` e o
`0001` cumprem isso com `IF NOT EXISTS`, e enquanto só existiu `CREATE TABLE` a exigência não custou
nada. Ela custa no primeiro `ALTER TABLE ... ADD CONSTRAINT`, que **não tem** `IF NOT EXISTS` e cujo
caminho usual de guarda — o bloco `DO` — a §11.5 recusa. A versão anterior deste contrato registrava
isso como pendência (§16) e mandava a primeira migration que precisasse vir ao humano. Esta seção
fecha a pendência, porque ela não é de uma migration: é infraestrutura de todas as que vierem.

### 17.1 Que estado o executor consegue produzir

A exigência de rodar duas vezes existe para a **retomada**, e a retomada só encontra os estados que o
executor produz. Este executor produz dois:

| Estado | Como se chega | O que a migration precisa suportar |
|---|---|---|
| **retomada depois de falha** | transação revertida, ledger sem a linha | rodar de novo a partir do estado anterior à tentativa |
| **reaplicação completa** | só na `platform/0000`, que corre antes de existir ledger para consultar (§9) | rodar de novo sobre o efeito já aplicado |

Fora da `0000`, **reaplicação de versão concluída não acontece**: o ledger tem a linha e a versão sai
do conjunto pendente. O terceiro estado — alguém aplicou o arquivo na mão — é drift, e drift já é
defeito por `migrations.md` §9, com resposta própria no `verify` (§13.2).

### 17.2 As três formas, em ordem de preferência

1. **Junto do `CREATE TABLE IF NOT EXISTS`.** É o caso normal e o único que os quatro arquivos de hoje
   usam. Restrição que nasce com a tabela não precisa de guarda nenhuma, e é por isso que a §11.2 pede
   que toda restrição nasça ali.
2. **Como índice, quando a invariante é unicidade.** `CREATE UNIQUE INDEX IF NOT EXISTS` é idempotente
   por construção (medido: a segunda rodada emite `NOTICE` e segue) e dá a mesma garantia de
   unicidade. O que ele **não** dá: a restrição não aparece em `pg_constraint`, e não pode ser alvo de
   chave estrangeira. Se alguém vai referenciar aquelas colunas, a forma é a 3.
3. **`ALTER TABLE ... ADD CONSTRAINT` em migration transacional.** A idempotência aqui vem da
   transação, não do comando: medido em PostgreSQL 16.15 em 2026-09-11, a segunda execução sobre o
   estado já aplicado falha com *"constraint already exists"*, e a mesma medida mostra que depois de
   uma transação revertida a tentativa seguinte aplica limpa. Como a retomada sempre parte do estado
   anterior à tentativa (§17.1), essa forma é retomável — e só nesse regime.

**Por isso a §11.4 recusa `ADD CONSTRAINT` em migration marcada `transacional: nao`.** Sem transação,
a segunda tentativa morre e a rodada não converge, e o defeito só apareceria no dia de uma retomada,
que é o dia em que ninguém quer descobrir mais nada.

Para tabela com volume, a forma 3 é `ADD CONSTRAINT ... NOT VALID` numa migration e
`VALIDATE CONSTRAINT` em outra (`migrations.md` §5). A segunda é idempotente por conta própria:
medido, `VALIDATE CONSTRAINT` sobre restrição já validada é aceito e não faz nada.

### 17.3 Gatilho e função

`CREATE OR REPLACE FUNCTION` e `CREATE OR REPLACE TRIGGER` (PostgreSQL 14 ou mais novo; o piso deste
sistema é **16**, e quem o fixa é outra coisa — `db/convencoes.md` §9) são idempotentes por construção — medido: a segunda rodada substitui o corpo pelo mesmo texto e
`pg_trigger` continua com um gatilho só. É a forma que as migrations `0002`, `0003` e `0004` usam, e é
o que permite uma trava nascer depois da tabela sem violar nem a §11 nem `migrations.md` §4.

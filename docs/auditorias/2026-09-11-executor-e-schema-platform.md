# Auditoria — executor de migration e schema `platform`

**Data:** 2026-09-11 · **Escopo:** T-0009, gate 2 (`CLAUDE.md` §4) · **Agent:** `seguranca` · **Read-only.**

**Objeto auditado, e só ele:** `db/migrator/CONTRATO.md` (394) e `db/migrations/platform/0000__ledger.sql`
(86), com `db/convencoes.md` como contexto da convenção vigente. Não auditei o que não existe: não há
`apps/`, `packages/`, rota, código de executor nem `0001__platform_controle.sql`. Onde um achado depende
de algo ainda não escrito, isso está dito no próprio achado.

**Veredito: o gate passa com correção exigida antes do passo 5.** Nenhum achado `CRÍTICO`. Três `ALTO`,
dois `MÉDIO`, dois `BAIXO`. Os três `ALTO` são defeitos do contrato, não do DDL — e é por isso que o
momento de corrigi-los é agora, antes de existir implementação que os transcreva. O `0000__ledger.sql`
sai da auditoria **sem achado próprio**: o único ponto dele que aparece aqui (`MIG-05`) é sobre como o
executor o aplica, não sobre o que ele declara.

**Numeração:** série `MIG-nn`, nova, sem continuidade com as auditorias de 2026-08-23 (escopo disjunto).
Nenhum achado **reincidente**: não há auditoria anterior sobre camada de dados.

---

## 0. Método — o que foi medido, e onde

Tudo abaixo rodou contra **PostgreSQL 16.15** em container descartável (`postgres:16`, removido ao fim),
o mesmo motor que o `arquiteto-dados` usou. Cada prova está nomeada `A`…`I` e é citada pelo achado que
a usa. O que **não** foi medido está na §7.

| Prova | O que perguntei ao banco | Resultado |
|---|---|---|
| `A` | papel comum de aplicação, com `GRANT` só no schema dele, alcança o quê? | enumera **todos** os `t_*` por `pg_namespace` e todas as tabelas deles por `pg_tables`; **não** lê `platform` nem `t_acme` (erro de privilégio) |
| `B` | o mecanismo de `CONTRATO.md` §10 apontado a um slug que nomeia schema de **cliente existente** | `CREATE SCHEMA IF NOT EXISTS` emite `NOTICE`, o `search_path` pousa no schema do cliente, o corpo aplica e `COMMIT`. Zero erro |
| `C` | `to_regclass('platform.schema_migrations')` distingue tabela de **view**? | não. Uma view com esse nome faz o executor concluir que o ledger existe |
| `C2` | `CREATE TABLE IF NOT EXISTS` sobre tabela de mesmo nome e estrutura diferente | pula com `NOTICE`; a tabela ficou com **0 restrições** |
| `E` | `REVOKE SELECT ON pg_namespace FROM PUBLIC` fecha a enumeração? | **não**: `pg_tables` continuou listando `t_acme` e `t_globex`. Quebrou `\dt` e metadados de driver |
| `F` | `DROP SCHEMA t_vitima CASCADE` dentro da transação de uma migration de alvo `tenant` | executou e destruiu o schema. Nenhuma recusa do §11 casa com esse texto |
| `G` | `set_config('search_path', …, true)` sobrevive ao regime **autocommit** da §8? | **não**. No statement seguinte `current_schema()` é `public` |
| `G2` | `CREATE INDEX CONCURRENTLY … ON orders(id)` nesse regime | índice criado em **`public`**, não no schema do cliente. Sem erro |
| `H` | ledger sem PK (estrutura divergente) + `INSERT … ON CONFLICT DO NOTHING` | duas linhas para a mesma `(schema_name, version)`, com checksums diferentes |
| `I` | a lista de slugs reservados do §10(2) impede alguma colisão real? | não: com `schema = 't_' || slug`, nenhum dos quatro nomes reservados podia colidir |

Busca por credencial no repositório: `grep -rInE "postgres(ql)?://|PGPASSWORD|DATABASE_URL|PGUSER="`
sobre a árvore inteira (exceto `.git`) — **nenhuma ocorrência**. `.gitignore` cobre `.env` e `.env.*`
com exceção de `.env.example`. Não há segredo no repo, e não há `.env` na árvore.

---

## 1. Pergunta 1 do `arquiteto-dados` — `search_path` de um schema só satisfaz `dados.md` §1?

**Satisfaz. A regra não exige qualificação literal dentro de cada `.sql` de alvo `tenant`, e exigir isso
tornaria o sistema pior.** A resposta é firme, e o fundamento é este, em três partes:

**(a) A cláusula tem dois destinatários, e o executor é o segundo.** `dados.md` §1 diz: "`search_path`
não é segurança: o schema é resolvido por quem conecta, e toda migration referencia o schema
explicitamente". A primeira metade nomeia o destinatário — **quem conecta** resolve o schema. Em tempo
de requisição, quem conecta é um processo que atende N clientes, e ali o `search_path` de fato não é
segurança: ele seria escolhido em função de algo que chegou no pedido. No executor não existe pedido nem
chamador: quem conecta **é** o executor, e ele resolve o schema iterando sobre um registro que ele mesmo
lê. A propriedade que a regra protege continua inteira.

**(b) O mecanismo alternativo é estritamente pior, e isso é verificável.** Qualificar literalmente dentro
de um arquivo que roda em N schemas exige substituir o nome no texto do SQL antes de enviá-lo, arquivo
por arquivo. Isso é exatamente a concatenação que `00-nucleo.md` §8 proíbe, e ela sairia de **um** ponto
mecanizado e auditável para **todo** arquivo de migration do sistema, escrito à mão, por autores
diferentes, para sempre. A troca é: uma exceção provada contra muitas exceções confiadas.

**(c) A prova do `arquiteto-dados` sustenta — e é mais estreita do que a frase que ela apoia.** Reproduzi
o mecanismo com slug hostil e o resultado é o que ele relatou. Mas a citação por `format('%I')` protege
contra **injeção de comando**, e não protege — nem poderia — contra **alvo errado**. Prova `B`: o mesmo
caminho, com o slug `t_acme` de um cliente existente, pousou dentro do schema daquele cliente e aplicou o
corpo inteiro, com `NOTICE` e saída de sucesso. A citação faz o nome virar identificador; ela não tem
opinião sobre **qual** identificador. Isso não derruba o registro
`memory/plataforma/convention-nome-de-schema-e-parametro-nunca-concatenacao.md` — derruba a leitura de
que ele fecha o assunto do schema alvo. Falta a linha que separa as duas coisas (`MEMÓRIA SUGERIDA`).

**A aprovação é condicionada a duas coisas que o contrato afirma e o banco desmente**, e são os dois
primeiros achados: o `search_path` de um schema só **não existe** no regime não-transacional (`MIG-01`),
e o schema alvo não é validado contra o registro de clientes em nenhuma das duas entradas de linha de
comando (`MIG-02`). Sem elas, "o `search_path` contém exatamente um schema, sem `public`"
(`CONTRATO.md:265-266`) é falso na metade dos regimes e verdadeiro sobre o schema errado na outra.

---

## 2. Pergunta 2 do `arquiteto-dados` — quem pode ler o livro-razão?

**O caso do `gotcha-nenhuma-superficie-nossa-enumera-clientes-para-escolher` não se aplica ao ledger, e
aplicar-se-ia a uma coisa maior que ele.** Três conclusões, cada uma com o que a sustenta:

**1. O ledger não é a superfície do gotcha.** Aquele registro fala de superfície oferecida a **quem
opera**, onde escolher numa lista é resolver o alvo pelo que o pedido informa. `platform.schema_migrations`
não é oferecida a ninguém: é tabela interna de um processo de operação, sem tela, sem rota e sem sujeito.
O que ela tem em comum com o gotcha é apenas a consequência — a carteira exposta.

**2. Sobre essa consequência, o ledger é o canal **menor**, e o maior não se fecha com `GRANT`.** Medido
em `A`: um papel de aplicação com `GRANT` apenas no schema do próprio cliente **não** lê o ledger nem
dado de outro schema (erro de privilégio nos dois casos), **e ainda assim** lista todos os `t_*` por
`pg_namespace` e todas as tabelas de todos eles por `pg_tables` — o que entrega a carteira e, de quebra,
quais módulos cada cliente tem, pelas tabelas que existem no schema dele. Medido em `E`: revogar
`SELECT ON pg_namespace FROM PUBLIC` **não** fecha, porque `pg_tables` é view de superusuário e lê o
catálogo com o privilégio do dono; o que a revogação fecha é `\dt` e a introspecção de driver. Num
cluster com um banco e um schema por cliente, **a enumeração da carteira é propriedade da tenancy
escolhida**, não defeito deste artefato. Fechá-la de verdade exigiria um banco por cliente, que
`decision-tenancy-schema-por-cliente` recusou por custo de operação, com o trade-off escrito.

**3. O que dá para fixar hoje, sem tocar em `D-03`.** Nada abaixo escolhe residência do sujeito,
mecanismo de prova ou chegada do tenant — os três eixos de `D-03`. São afirmações sobre **papel de
banco**, que é outro objeto:

- **o papel que roda o executor não é o papel que a aplicação usa.** É a única razão pela qual `A` falhou
  em ler `platform` e `t_acme`: o papel não era dono. Se a aplicação usar a credencial do executor — que é
  o que acontece quando ninguém decide o contrário — o isolamento por schema vira decoração, e nenhuma
  linha de código precisa estar errada para isso (`MIG-06`);
- **nenhum processo que atende cliente recebe `USAGE` em `platform`;**
- **registrar que o catálogo enumera a carteira de qualquer forma**, para que quem fechar `D-03` não
  presuma que schema por cliente esconde quem são os clientes. Essa premissa, se entrar silenciosa numa
  opção de `D-03`, sai cara depois.

A ausência de `GRANT` no `0000__ledger.sql` **está correta** e não é achado: privilégio não pertence à
migration que cria a tabela, pertence à decisão de papéis que ainda não existe. O achado é a decisão não
existir em lugar nenhum, e é `MIG-06`.

---

## 3. Achados

### MIG-01 — objeto de cliente nasce em `public` no regime não-transacional — [ALTO]
**ONDE:** `db/migrator/CONTRATO.md:187-191` (§8, sequência em autocommit) com `:251-266` (§10.3) e
`:268-270` (§10.4).
**CENÁRIO:** uma migration `transacional: nao` com
`CREATE INDEX CONCURRENTLY ix_orders_occurred_at ON orders (occurred_at)` — a forma que a §8 existe para
atender. O executor aplica o §10.3 e emite o corpo comando a comando em autocommit. Medido (`G`):
`set_config('search_path', …, true)` é local à transação, e em autocommit a transação é o próprio
statement, então **o comando seguinte já roda com `search_path = public`**. Medido (`G2`): o índice foi
criado em `public.orders`, não no schema do cliente, sem erro e sem aviso. Aplicada aos N clientes, a
mesma migration cria **um** objeto em `public` na primeira passada e não faz nada nas seguintes
(`IF NOT EXISTS`), enquanto o ledger registra "aplicada" em todos. O índice que o caixa precisa não
existe em nenhum schema de cliente, e existe um objeto comum a todos fora de qualquer schema de cliente.
**POR QUE É REAL:** o caminho é o caminho normal da §8, não um desvio. E a única verificação mecanizada
que pegaria isso — §10.4, "ao fim de cada migration de alvo `tenant`, **antes do commit**, o executor
confere que todo objeto criado na transação pertence ao namespace alvo" — está escrita para o regime que
tem commit, ou seja, está ausente exatamente no regime que falha. A limpeza da retomada (§8, passos 1-3)
procura o índice pelo nome declarado em `cria-indice` e o encontraria válido em `public`, concluindo
"nada a limpar".
**CORREÇÃO SUGERIDA:** no regime não-transacional o schema alvo não pode depender de estado de sessão
local à transação, e a verificação de namespace da §10.4 precisa de forma própria ali — dono:
`arquiteto-dados`.

### MIG-02 — o schema alvo entra por linha de comando e não é confrontado com o registro — [ALTO]
**ONDE:** `db/migrator/CONTRATO.md:239-246` (§10.1 e §10.2), `:315` e `:317` (§12), `:330-334` (§13).
**CENÁRIO:** dois caminhos, os dois medidos em `B`. (1) `provision acme` quando `t_acme` já existe: o
§10.2 valida **forma** (`^[a-z][a-z0-9_]{1,40}$`) e recusa quatro nomes reservados; nada confronta o slug
com os clientes já registrados nem com os schemas já existentes. `CREATE SCHEMA IF NOT EXISTS` pula com
`NOTICE`, o corpo do núcleo aplica **dentro do schema do cliente existente**, e ao fim há dois clientes
registrados apontando para o mesmo schema — o que faz a borda resolver, para os dois, o mesmo dado.
(2) `migrate --schema t_<slug>`: o contrato não exige que esse nome esteja no registro. `--schema public`
segue o mesmo caminho e aplica a stream `tenant` inteira no `public`.
**POR QUE É REAL:** `provision` é descrito como "registra o cliente e cria o schema dele **do zero**" (`:317`), e nada no
contrato transforma isso em verificação. O erro que dispara é um erro de digitação de operador, não um
ataque; o resultado é a pior consequência do sistema, e ela chega sem mensagem de erro. Medido: a saída
foi `COMMIT`, com dois `NOTICE`.
**CORREÇÃO SUGERIDA:** `provision` recusa slug já registrado **e** schema já existente, e o nome de
`--schema` só é aceito se estiver no registro de clientes — dono: `arquiteto-dados`.

### MIG-03 — as recusas do §11 são mais estreitas que a regra que elas citam, e `DROP SCHEMA` passa — [ALTO]
**ONDE:** `db/migrator/CONTRATO.md:287-308`, em particular `:294-295`, `:296-299` e `:300-303`.
**CENÁRIO:** medido em `F`. Uma migration de alvo `tenant` contendo `DROP SCHEMA t_vitima CASCADE;`
atravessa a lista inteira: não é `DROP TABLE` nem `DROP COLUMN`; não é `ALTER … RENAME`; não é `TRUNCATE`;
não é `DELETE`; e não casa com "referencia outro schema qualificado", porque o padrão declarado
(`\bt_[a-z0-9_]{1,40}\.`) exige o ponto final, e `DROP SCHEMA t_vitima` não tem ponto. Executado dentro da
transação de um alvo `tenant`, destruiu o schema e a tabela dele. Pelo mesmo buraco passam
`ALTER TABLE … DROP CONSTRAINT` (que `migrations.md` §4 proíbe nominalmente, por remover invariante de
negócio), `DROP INDEX` não concorrente, `DROP TYPE`, `ALTER TYPE` e `GRANT`/`REVOKE`.
**POR QUE É REAL:** o autor declarou que a lista pega o caso honesto e não o adversário, e isso é aceitável
como postura. O defeito é outro: a lista **se apresenta** como mecanização de `migrations.md` §4
(`:300-301` cita a regra), e quem a lê passa a acreditar que a proibição está mecanizada. O caso honesto
que ela deixa passar é o mais provável de todos — alguém escrevendo DDL de limpeza. A defesa humana
continua sendo a principal; o que falha é a expectativa que a lista cria sobre si.
**CORREÇÃO SUGERIDA:** ou a lista cobre a §4 inteira e o §11 diz que a cobertura é por lista de permissão
e não por lista de bloqueio, ou a §11 declara no próprio texto o que ela **não** pega — dono:
`arquiteto-dados`.

### MIG-04 — o `drop` do `verify` se apoia num prefixo que o contrato não reserva — [MÉDIO]
**ONDE:** `db/migrator/CONTRATO.md:338` e `:344-348` (§13) contra `:246` (§10.2).
**CENÁRIO:** a §13 afirma que o `drop` do passo 5 "alcança apenas um schema que o próprio `verify` criou
nesta execução, com prefixo reservado que `provision` recusa". Os nomes reservados do §10.2 são
`platform`, `public`, `information_schema` e o prefixo `pg_` — `verify` não está lá. Medido em `I`: como
o schema é `'t_' || slug`, **nenhum** dos quatro reservados podia colidir com nada, enquanto o slug
`verify_20260911` é aceito pela forma do §10.2 e produz `t_verify_20260911`. Se o formato do carimbo
(não especificado) tiver granularidade de dia, esse é o schema descartável daquela execução: `verify`
provisiona **dentro** do schema do cliente (mecanismo do `MIG-02`, medido em `B`) e o passo 5 o derruba.
**POR QUE É REAL:** a única garantia escrita do `drop` é uma reserva que não existe no lugar onde reservas
são declaradas. O contrato também não fixa o formato do carimbo nem se o `drop` é `CASCADE`, então a
distância entre o alvo pretendido e o alvo possível é decidida por quem implementa, no passo 5.
**CORREÇÃO SUGERIDA:** reservar o prefixo `verify_` no §10.2, fixar o formato do carimbo com componente
não previsível, e o `drop` conferir no catálogo que o schema foi criado por esta execução antes de
derrubá-lo — dono: `arquiteto-dados`.

### MIG-05 — o bootstrap valida o ledger pelo nome, e `platform` é o único schema que o `verify` não olha — [MÉDIO]
**ONDE:** `db/migrator/CONTRATO.md:208-231` (§9), `:336-344` (§13) e
`db/migrations/platform/0000__ledger.sql:33-35`.
**CENÁRIO:** medido em `C`, `C2` e `H`. O executor decide se o ledger existe com
`SELECT to_regclass('platform.schema_migrations') IS NULL` — e `to_regclass` casa com **view**, não só com
tabela (`C`). Num banco ajustado à mão (`migrations.md` §9 prevê que isso acontece), uma
`platform.schema_migrations` com estrutura diferente faz o `CREATE TABLE IF NOT EXISTS` pular em silêncio
e **nenhuma** das seis `CHECK` nem a PK do `0000` nascem (`C2`: 0 restrições). Sem a PK,
`INSERT … ON CONFLICT DO NOTHING` do §9 não tem conflito para detectar e o ledger passa a aceitar duas
linhas para a mesma `(schema_name, version)` com checksums diferentes (`H`) — e aí a verificação da §3,
que compara "o checksum registrado de cada versão já aplicada", não tem resposta única. O checksum prova
que o **arquivo** não mudou; ele nunca observou o banco.
**POR QUE É REAL:** o `verify` (§13) compara a impressão de estrutura de cada schema de **cliente** contra
um schema descartável de referência. `platform` não entra nessa comparação em passo nenhum — e `platform`
é onde moram o ledger e o registro de clientes, inclusive a `CHECK` de formato de slug que o §10.2 descreve
como a camada que existe "para que a validação não dependa de o código lembrar dela". Essa camada pode
não existir e nada acusa.
**CORREÇÃO SUGERIDA:** o bootstrap confere a estrutura do ledger, não só a presença do nome, e o `verify`
ganha `platform` como alvo de comparação — dono: `arquiteto-dados`.

### MIG-06 — não existe separação de papel de banco declarada em lugar nenhum — [MÉDIO]
**ONDE:** ausência. `db/migrator/CONTRATO.md:146-153` (§6) especifica quatro parâmetros de sessão e não
menciona papel nem procedência de credencial; `db/convencoes.md` não trata do assunto; não há `GRANT` em
nenhum arquivo do repositório.
**CENÁRIO:** o executor cria os schemas, logo é dono deles. Se o processo que atende cliente usar a mesma
credencial — que é o caminho de menor resistência quando nada foi decidido, e é o que a primeira
implementação vai fazer se ninguém disser o contrário — então o isolamento por schema deixa de existir:
dono de schema lê e escreve em todos. Medido em `A`: com papéis separados, o papel de aplicação levou
`permission denied` ao tentar `platform.schema_migrations` e `t_acme.orders`; é essa separação, e só ela,
que produziu os dois erros.
**POR QUE É REAL:** não é hipótese de arquitetura, é o estado de hoje — a decisão não existe em nenhum
arquivo, e o passo 5 (`coder`) precisa de uma string de conexão para rodar o primeiro teste. A decisão de
papel de banco **não** depende de `D-03`: `D-03` decide onde mora a pessoa, o que ela apresenta e como o
tenant chega na borda; nenhuma das três perguntas muda o fato de que o migrador e a aplicação não podem
compartilhar credencial.
**CORREÇÃO SUGERIDA:** fixar agora, como convenção de `db/`, que o papel do executor é distinto do papel
da aplicação e que nenhum papel de aplicação recebe `USAGE` em `platform`; a credencial vem de ambiente,
com `.env.example` e nenhum default em código — dono: `arquiteto-dados`, com `coder` consumindo no passo 5.

### MIG-07 — a carteira de clientes é enumerável pelo catálogo por qualquer papel que consiga conectar — [BAIXO]
**ONDE:** propriedade de `decision-tenancy-schema-por-cliente`, visível a partir de
`db/migrations/platform/0000__ledger.sql:33` (o primeiro `t_*` do sistema nasce aqui).
**CENÁRIO:** medido em `A` e `E`. Qualquer papel que abra conexão no banco executa
`SELECT nspname FROM pg_namespace WHERE nspname LIKE 't\_%'` e recebe a lista de todos os clientes
provisionados; `pg_tables` devolve, além disso, as tabelas de cada um, o que revela quais módulos cada
cliente tem. `REVOKE` em `pg_namespace` não fecha (a view `pg_tables` continua respondendo) e quebra
introspecção legítima.
**POR QUE É REAL:** foi executado, com um papel que tinha `GRANT` só no próprio schema e que levou
`permission denied` em tudo que era dado. A informação vaza sem acesso indevido a dado nenhum.
**CORREÇÃO SUGERIDA:** não é corrigível dentro do desenho escolhido; o que se corrige é a premissa — quem
fechar `D-03` precisa saber que a fronteira que protege a carteira é **quem consegue abrir conexão**, não
o `GRANT` sobre o ledger — dono: `arquiteto-dados` (registro), com efeito sobre `D-03` (humano).

### MIG-08 — a mensagem de erro do executor nomeia cliente, e o destino dela não está definido — [BAIXO]
**ONDE:** `db/migrator/CONTRATO.md:92-93` (§3) e `:320-328` (§12).
**CENÁRIO:** a mensagem de divergência "nomeia schema, versão, checksum registrado e checksum calculado",
e a impressão de estrutura do `verify` percorre todos os schemas de cliente. Os dois artefatos carregam
a carteira. Enquanto o executor for CLI rodado por quem já tem credencial do banco, o alcance é o mesmo
de `MIG-07` e não muda nada. O cenário que morde é o dia em que a saída dele vira log agregado, anexo de
ticket ou artefato de pipeline com leitura mais larga que a do banco.
**POR QUE É REAL:** a memória do projeto já tem a posição de que chave de log e de exportação carrega
escopo (`decision-tenancy-schema-por-cliente`), e este é o primeiro produtor de log do sistema.
**CORREÇÃO SUGERIDA:** declarar no §12 que saída e artefato do executor têm a mesma classificação de
`docs/auditorias/**` — referência, nunca colagem, fora do canal de operação — dono: `arquiteto-dados`.

---

## 4. As cinco perguntas de `seguranca.md` §1, respondidas neste escopo

**1. Existe caminho em que uma consulta alcança schema de outro cliente?** **Sim, dois, e os dois foram
executados.** `MIG-02` (o executor entra no schema de um cliente existente por slug repetido, e aplica
nele) e `MIG-03` (corpo de migration alcança e destrói outro schema, atravessando as recusas do §11). Um
terceiro é legítimo e precisa ficar nomeado: o passo 3 do `verify` lê a estrutura de **todos** os schemas
de cliente. É leitura de catálogo, nunca de dado de negócio, e é a razão de o comando existir — mas é o
único leitor cross-schema autorizado do sistema, e convém que continue sendo o único e que a restrição a
catálogo esteja escrita.

**2. O tenant vem de identidade autenticada ou de algo que o chamador controla?** Não há chamador nem
requisição neste escopo. Em rodada normal o schema vem do registro no `platform` (`§10.1`), que é a
procedência certa. Nas duas entradas de linha de comando (`provision <slug>`, `migrate --schema`) ele vem
de quem digita, e o contrato não o confronta com o registro — é `MIG-02`. O nível de confiança do
operador de CLI é aceitável; o que não é aceitável é o erro de digitação ter o desfecho do `MIG-02`.

**3. Existe operação que aceita tenant ausente e cai em default?** **Sim** — e não por omissão do
contrato, por comportamento do banco. `MIG-01`: perdido o `search_path` local, o Postgres cai no default
`"$user", public` e o objeto nasce em `public`. O contrato afirma o contrário em `:265-266`, e a
afirmação vale só no regime transacional.

**4. Id de recurso é validado contra o tenant?** O análogo aqui é a chave do ledger, `(schema_name,
version)`, e ela é calculada pelo executor, não recebida — não há IDOR neste escopo. Duas observações que
viram dívida assim que o `0001__platform_controle.sql` existir: o ledger não tem FK para o registro de
clientes (linha pode nomear schema inexistente — estado normal depois de todo `verify`, que registra e
depois derruba), e nada impede que duas linhas do registro apontem para o mesmo schema (`MIG-02`).

**5. Cache, fila, log, arquivo temporário, exportação e relatório carregam tenant no escopo?** Não há
cache nem fila neste escopo. Log e artefato: `MIG-08`. Arquivo temporário: o schema descartável do
`verify` é o equivalente aqui, e o problema dele é o alvo do `drop` (`MIG-04`), não a chave. Chave
colidente **existe** e é o `MIG-02`: dois clientes com o mesmo nome de schema é a colisão de chave mais
cara possível neste sistema, e ela nasce de um comando de provisionamento sem verificação de unicidade.

---

## 5. Notas — sem cenário concreto, logo não são achados

- **`ON CONFLICT DO NOTHING` do §9 (`:220`) é justificável como está.** A janela que ele abre é mais
  estreita do que parece: a §3 verifica o checksum de tudo que já foi aplicado **depois** do bootstrap,
  então uma linha pré-existente com checksum divergente termina em saída `3`. O que ele não cobre é
  estrutura, e isso já está no `MIG-05`. Não vi cenário em que a tolerância do `INSERT`, sozinha,
  produza dano.
- **Duas rodadas simultâneas (`§16`, `:392-393`)** continuam sem trava. Não é achado de segurança com
  cenário: as duas rodadas convergem para o mesmo estado ou uma falha em lock. Vira achado no dia em que
  `provision` e `migrate` puderem correr juntos sobre o mesmo schema, e aí encontra o `MIG-02` pelo lado
  de dentro.
- **§10.4 não tem espelho para alvo `platform`.** A verificação de namespace cobre `tenant`. O caminho
  inverso — migration de `platform` criando objeto em schema de cliente — hoje é barrado pelo
  `search_path` e pela recusa textual do `:296-299`, que é a única recusa do §11 escrita com cuidado de
  fronteira de identificador. Sem cenário para reportar; anoto porque a simetria é barata.
- **Nenhum segredo no repositório**, verificado por busca (§0). O contrato **não** diz de onde vem a
  credencial do executor, e essa lacuna chega ao passo 5 como decisão de quem implementa — está dentro
  da correção do `MIG-06`.

---

## 6. O que este gate **não** cobriu

- **Não auditei código de executor**: ele não existe (passo 5). Tudo aqui é sobre o que o contrato
  **exige** do código, e é por isso que os três `ALTO` são corrigíveis por edição de contrato.
- **Não auditei `0001__platform_controle.sql`** (passo 7, ainda não escrito). O registro de clientes é o
  lugar natural da unicidade de slug que o `MIG-02` pede, e o gate daquele arquivo precisa confirmar que
  ela nasceu lá.
- **Não medi lock, tempo nem custo sobre N schemas reais.** Não é minha camada e não havia volume.
- **Não avaliei privilégio de papel de banco em operação**, porque a decisão não existe (`MIG-06`). O que
  medi foi o comportamento do Postgres com e sem separação, para que a decisão seja tomada sabendo o que
  cada lado produz.

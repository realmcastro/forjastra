# Reauditoria — executor de migration e schema `platform`

**Data:** 2026-09-11 · **Escopo:** T-0009, gate 2 (`CLAUDE.md` §4) · **Agent:** `seguranca` · **Read-only.**

**Objeto:** os quatro arquivos do contrato partido (`db/migrator/CONTRATO.md`,
`db/migrator/APLICACAO-E-ALVO.md`, `db/migrator/RECUSAS.md`, `db/migrator/PROVISION-E-VERIFY.md`),
`db/papeis-e-credencial.md`, e `db/migrations/platform/0001__tenant_registry.sql`, que não passou por
auditoria antes. `0000__ledger.sql` reentra só onde o comportamento novo o alcança.

**Antecessora:** `docs/auditorias/2026-09-11-executor-e-schema-platform.md` (`MIG-01` a `MIG-08`). Ela
não foi editada e continua sendo o registro da primeira passada.

**Veredito, e ele não é um sim nem um não:** dos oito achados anteriores, **seis fecham**, um fecha
por registro e **um fecha só no papel**. Nove achados novos, dos quais **dois `ALTO`**. O passo 5
(`coder`) é liberado **por partes** — a lista está na §9, e ela é o entregável mais importante deste
relatório.

---

## 0. Método — o que foi medido

PostgreSQL **16.15** em container descartável (`docker.io/library/postgres:16`, removido ao fim), o
mesmo motor das duas passadas anteriores. `0000` e `0001` aplicados do arquivo real, sem edição.
Cada prova é `P1`…`P12` e é citada pelo achado que a usa.

| Prova | Pergunta ao banco | Resultado |
|---|---|---|
| `P1` | `0001` aplica, e duas vezes? | aplica; segunda rodada não faz nada. 4 colunas, 4 restrições, `schema_name` `GENERATED ... STORED` |
| `P2` | as travas do registro seguram? | slug repetido → `tenants_slug_key`; `verify_x` → `tenants_slug_reserved_check`; `Acme` → `tenants_slug_format_check`; escrever `schema_name` direto → recusado por ser coluna gerada |
| `P3` | formas **permitidas** pela §11.2 alcançam outro schema? | **sim**: `CREATE TABLE IF NOT EXISTS ... AS SELECT * FROM t_globex.orders`, `INSERT INTO seed SELECT ... ON CONFLICT DO NOTHING` e `CREATE OR REPLACE VIEW ... AS SELECT * FROM t_globex.orders` copiaram/expuseram a linha do outro cliente dentro do alvo |
| `P4` | a correção de `MIG-01` funciona? | **sim**: `set_config(...,false)` em sessão dedicada, `current_schema()` = `t_acme` antes e depois, `current_schemas(false)` = 1, `CREATE INDEX CONCURRENTLY` nasceu em `t_acme` com `indisvalid = t`, havendo `public.orders` homônima |
| `P5` | conexão nova herda estado de sessão? | não: `current_schema()` = `public`, `forja.target_schema` ausente |
| `P6` | com alvo de sessão correto, comando **qualificado** escapa? | sim: `CREATE INDEX CONCURRENTLY ... ON public.orders` nasceu em `public` com `current_schema()` continuando `t_acme`; `to_regclass('ix_fantasma')` = nulo e 0 ocorrências dentro do alvo |
| `P7b` | o retrato de `oid` da §10.4 pega alcance a objeto **existente** fora do alvo? | **não**: 26 → 26. Enquanto isso `t_globex.orders` ganhou `CHECK`, coluna, `COMMENT`, `DEFAULT` e uma linha |
| `P8` | o retrato estrutural da §9 casa com o DDL? | sim: 7 colunas, 7 restrições, nomes conferidos |
| `P9` | a consulta de `relkind` distingue view? | sim: `relkind = v` onde `to_regclass` diz presente |
| `P10` | o catálogo prova a separação de papéis? | prova **dono de schema** e `USAGE`; não prova com que papel a aplicação conecta |
| `P11` | `CREATE SCHEMA` aceita o nome como parâmetro? | **não**: `PREPARE ... AS CREATE SCHEMA $1` é erro de sintaxe; `set_config`+`quote_ident` não alcança o comando |
| `P12` | a linha "imutável" de `platform.tenants` resiste a `UPDATE`/`DELETE`? | **não**: dois comandos fizeram o `tenant_id` do `acme` resolver para `t_globex`. Nenhum gatilho, nenhuma regra, nenhum registro |

Busca por credencial na árvore (`postgres://`, `PGPASSWORD`, `DATABASE_URL`, `PGUSER=`): só as duas
auto-referências desta auditoria e da anterior. **Nenhum segredo no repositório.**

---

## 1. Achado por achado da passada anterior

| # | Estado | O que verifiquei |
|---|---|---|
| `MIG-01` | **FECHADO** | `P4`, `P5`. A correção é a que o autor descreve e ela funciona, inclusive com tabela homônima em `public`. Resíduo em `MIG-12` |
| `MIG-02` | **FECHADO na criação, ABERTO na mutação** | `P1`, `P2`: `UNIQUE (slug)` + coluna gerada tornam estruturalmente impossível dois clientes no mesmo schema **por `INSERT`**. `P12` mostra a mesma consequência por `UPDATE`/`DELETE` → `MIG-09`, **reincidente por porta diferente** |
| `MIG-03` | **FECHADO no caso medido, incompleto na classe** | `DROP SCHEMA` de fato cai (não há `DROP` na lista). Mas a lista classifica **pelo começo do comando** e não olha o resto: `P3` e `P7b` → `MIG-10` |
| `MIG-04` | **FECHADO** | não construí estado em que as três condições passem sobre schema que não seja o descartável. Detalhe na §3.3. Resíduo operacional em `MIG-13` |
| `MIG-05` | **FECHADO na perna do bootstrap, só no papel na perna do `verify`** | `P8`, `P9` confirmam a perna do bootstrap. A perna do `platform` depende de privilégio que a decisão do humano nega → `MIG-11`, **reincidente (parcial)** |
| `MIG-06` | **FECHADO como convenção, com a premissa de auditabilidade falsa** | `P10` → `MIG-14` |
| `MIG-07` | **REGISTRADO** | `db/papeis-e-credencial.md:65-77` diz o que precisava ser dito, inclusive a frase que `D-03` herda. Nada a acrescentar |
| `MIG-08` | **FECHADO** | `db/papeis-e-credencial.md:79-85` classifica saída e artefato, e cobre os dois produtores (§3 do contrato e §13.2) |

A inconsistência §12/§13 do `verify` está corrigida: `PROVISION-E-VERIFY.md:17` e `:19-20` dizem o que
ele escreve e admitem que a linha curta era a que mentia.

---

## 2. Achados novos

### MIG-09 — a linha do registro de clientes é declarada imutável e não é — [ALTO] · reincidente de `MIG-02` por outra porta
**ONDE:** `db/migrations/platform/0001__tenant_registry.sql:55-61` (a prosa), `:114-115` (o
`COMMENT ON TABLE`: "Linha nunca é alterada nem removida") e a ausência de qualquer trava no `CREATE
TABLE` de `:71-112`.
**CENÁRIO:** medido em `P12`, dois comandos, com a credencial do executor — que é a credencial que a
pessoa que roda migration tem na mão, e `migrations.md` §9 prevê ajuste manual como coisa que
acontece:

```
DELETE FROM platform.tenants WHERE slug='globex';
UPDATE platform.tenants SET slug='globex' WHERE slug='acme';
```

O `tenant_id` do `acme` passa a resolver para `t_globex`, que é o schema com o dado do globex. O
`created_at` continua marcando o registro original, então a linha não carrega sinal de ter mudado.
Nenhum gatilho e nenhuma regra existem na tabela (`P12`). E **nenhuma verificação do sistema acusa**:
`migrate` não vê drift (o schema existe e está registrado), `verify` compara estrutura e a estrutura
está certa. A variante sem `UPDATE` é pior de outro jeito: `DELETE` sem `WHERE` apaga a única resposta
para "qual schema pertence a qual cliente" — `tenant_id` só existe aqui, e o ledger guarda
`schema_name`, não cliente.
**POR QUE É REAL:** a imutabilidade está afirmada em prosa e em `COMMENT`, e não existe em lugar
nenhum do DDL. O `MIG-02` foi fechado onde ele foi medido (`INSERT`), e a consequência que ele nomeava
— dois clientes resolvendo para o mesmo schema — continua alcançável pela mutação. `CREATE TRIGGER`
está na lista de permissão da §11.2, então a trava é expressável dentro das regras que já existem.
**CORREÇÃO SUGERIDA:** migration nova (`0002`) com gatilho que recusa `UPDATE` e `DELETE` em
`platform.tenants`, e o ato recusado virando fato (invariante 10) — dono: `arquiteto-dados`.

### MIG-10 — a lista de permissão classifica pelo começo do comando, e o resto do comando alcança outro schema — [ALTO]
**ONDE:** `db/migrator/RECUSAS.md:26` (§11.1 item 4, "classifica cada comando pela **forma com que ele
começa**"), `:31-51` (§11.2), `:64-71` (§11.3, os dois bullets de fronteira) e `:91-109` (§11.5).
**CENÁRIO:** medido em `P3` e `P7b`. Alvo `tenant`, `search_path` de um schema só, regime
transacional — tudo como o contrato manda. Estes cinco comandos **começam** por forma permitida:

```
CREATE TABLE IF NOT EXISTS copia AS SELECT * FROM t_globex.orders;      -- P3: copiou a linha
INSERT INTO seed SELECT * FROM t_globex.orders ON CONFLICT DO NOTHING;  -- P3: copiou a linha
CREATE OR REPLACE VIEW espelho AS SELECT * FROM t_globex.orders;        -- P3: expôs a tabela
ALTER TABLE t_globex.orders ADD CONSTRAINT chk CHECK (total >= 0) NOT VALID;  -- P7b
ALTER TABLE t_globex.orders ADD COLUMN IF NOT EXISTS intruso text;            -- P7b
```

Os três primeiros **leem** o schema de outro cliente e depositam o resultado dentro do alvo; os dois
últimos **escrevem** no schema do outro. A §10.4 não vê nenhum dos cinco: nos três primeiros o objeto
novo nasce **dentro** do alvo, e nos dois últimos não nasce objeto — `P7b` mediu o retrato de `oid`
indo de 26 para 26 enquanto a tabela do outro cliente ganhava restrição, coluna, comentário, default e
uma linha. Aplicada a rodada inteira, uma dessas migrations copia o dado de um cliente para **todos**
os schemas.
**POR QUE É REAL:** a única coisa entre esses comandos e o outro schema é o bullet de `:64-66` — "tem
alvo `tenant` e referencia `platform.` ou outro schema qualificado". Ele **não tem mecanismo
declarado**, enquanto o bullet irmão, o de alvo `platform`, tem padrão escrito (`\bt_[a-z0-9_]{1,40}\.`)
e até a justificativa da fronteira de identificador. Quem implementar o carregador no passo 5 vai
inventar o padrão do lado que falta, e o alvo natural — "identificador seguido de ponto" — reprova
`o.total` de qualquer `VIEW` e qualquer alias, o que pressiona a afrouxar exatamente no lado que
protege o isolamento. **E a §11.5 não declara isto**: os quatro itens dela falam de corpo de função,
ausência de parser, privilégio de papel e adversário — nenhum diz que a forma permitida olha só o
começo do comando.
**CORREÇÃO SUGERIDA:** escrever na §11.3 o mecanismo do lado `tenant` com a mesma precisão do lado
`platform` (inclusive o que fazer com alias e com `pg_catalog.`), e acrescentar à §11.5 o item que
falta — dono: `arquiteto-dados`.

### MIG-11 — a verificação de `platform` fica declarada como não executada em toda parte — [MÉDIO] · reincidente (parcial) de `MIG-05`
**ONDE:** `db/migrator/PROVISION-E-VERIFY.md:94-101` (a referência por banco descartável) com `:28`
(saída `4`) e `:88-92` (a mesma saída `4` quando o `drop` do descartável não pode acontecer).
**CENÁRIO:** o humano decidiu que o executor **não** recebe `CREATEDB`. Então, nos ambientes de
operação, o caminho do `:98` é o caminho único: toda execução de `verify` termina em `4`. A
consequência não é a decisão estar errada — é que `4` deixa de ser sinal. Ele significa hoje três
coisas diferentes: "não comparei o `platform`" (permanente e esperado), "não consegui derrubar o
schema descartável" (transitório e exige mão humana agora) e, por tabela, "não sei dizer se os
clientes estão certos". Um operador que vê `4` toda vez para de ler `4`. E o efeito líquido é que a
perna do `MIG-05` que motivou a correção — a `CHECK` de formato de slug do `platform` podia não existir
sem que nada acusasse — **continua sem verificação em todo ambiente real**.
**POR QUE É REAL:** não é hipótese sobre privilégio: é a leitura direta do texto sob a decisão já
tomada. E existe caminho que não precisa de `CREATEDB`: a §9 já compara o ledger contra um retrato
estrutural declarado (`P8`), e o mesmo mecanismo cobre `platform.tenants`. Comparar contra retrato
declarado dá resposta a cada rodada; comparar contra banco de referência dá resposta em nenhuma.
**CORREÇÃO SUGERIDA:** estender o retrato estrutural da §9 a todo objeto do `platform`, e reservar a
saída `4` para o que é transitório, com o caso permanente saindo com sinal próprio — dono:
`arquiteto-dados`.

### MIG-14 — a premissa que torna a convenção de papéis auditável não se sustenta na afirmação 1 — [MÉDIO]
**ONDE:** `db/papeis-e-credencial.md:32-36` ("o que separa um papel do outro é privilégio no banco…
A verificação é uma consulta ao catálogo… e ela dá a mesma resposta sem ler uma linha da aplicação").
**CENÁRIO:** medido em `P10`. O catálogo responde duas coisas: quem é dono de cada schema
(`pg_namespace.nspowner`) e que papéis têm `USAGE` em `platform`
(`has_schema_privilege`). Nenhuma delas responde **com que papel a aplicação conecta**. Conectei com a
credencial do executor sob `application_name = 'forja-app'`: o catálogo antes e depois é idêntico
byte a byte, e o único lugar onde o fato aparece é `pg_stat_activity`, que zera na desconexão — medido:
`0` sessões depois de fechar. Ou seja, o defeito que a afirmação 1 existe para impedir é justamente o
que o catálogo não enxerga. A afirmação 2 é auditável pela forma, mas não pelo sujeito: "papel de
aplicação" não é fato de catálogo, então "nenhum papel de aplicação tem `USAGE` em `platform`" não se
escreve como consulta enquanto a classe do papel não for observável.
**POR QUE É REAL:** o autor declarou essa premissa como "a que precisa sobreviver a esta página". Ela
é o que separa convenção de intenção, e ela está errada na metade que importa.
**CORREÇÃO SUGERIDA:** tornar a classe do papel um fato de catálogo (papéis de aplicação como membros
de um papel de grupo, e a consulta passando a ser sobre os membros), e declarar que "qual credencial a
aplicação usa" é observável de execução — `log_connections` ou amostragem de `pg_stat_activity` —,
nunca de catálogo — dono: `arquiteto-dados`.

### MIG-15 — o ledger não registra as duas detecções que ele existe para tornar possíveis — [MÉDIO] · invariante 10
**ONDE:** `db/migrator/CONTRATO.md:185-208` (§5.1, as três ausências declaradas) contra `:107-118` (§3,
divergência de checksum) e `db/migrator/PROVISION-E-VERIFY.md:85-87` (§13.2 item 6, "diferença é
achado").
**CENÁRIO:** duas coisas que acontecem e não viram fato nenhum, e nenhuma das duas está na lista de
ausências declaradas. (1) **Divergência de checksum** — o sinal de que uma migration aplicada foi
editada, que é o mais próximo de evidência de adulteração que este sistema tem. Ela para a rodada e
morre na saída do processo: rodar de novo não deixa rastro, e quem editou o arquivo de volta apaga a
única evidência. (2) **Diferença encontrada pelo `verify`** — o resultado do comando que o contrato
vende como "a resposta ao drift" não é persistido em lugar algum. Some com o terminal.
Sobre a ausência 1 declarada (desfecho de falha), a justificativa não se sustenta nos próprios termos:
ela diz que o fato "pede autor" e que o autor depende de `D-03` — mas **o ledger já grava a linha de
sucesso sem autor nenhum, hoje**, e `RN-PRV-013` descreve o grão de `migration_applied` como "(schema,
versão), com desfecho e duração", sem autor. O impedimento real de escrever a falha é o `ROLLBACK`
levar a linha junto, e o próprio §5.1 já nomeia a saída (segunda conexão, fora da transação que
falhou), que é exatamente a terceira cláusula do invariante 10.
**POR QUE É REAL:** invariante 10 inverteu o ônus — não capturar exige justificativa registrada. Duas
detecções de segurança não têm justificativa porque não estão na lista, e a terceira tem justificativa
que o próprio artefato contradiz. O que se perde para sempre: em que schema o release quebrou, e que
alguém editou migration aplicada.
**CORREÇÃO SUGERIDA:** acrescentar as duas detecções à declaração do §5.1 — com casa, ou com motivo
que sobreviva à leitura — e separar o impedimento real da ausência 1 do impedimento de `D-03` — dono:
`arquiteto-dados`.

### MIG-16 — a única interpolação do sistema perdeu o mecanismo na revisão — [MÉDIO]
**ONDE:** `db/migrator/APLICACAO-E-ALVO.md:182-185` (§10.3, "O texto SQL é constante. O nome do schema
atravessa como *bind parameter*") contra `db/migrator/PROVISION-E-VERIFY.md:46-49` (§13.1 passo 4,
`CREATE SCHEMA` sem `IF NOT EXISTS`) e `:75-76` (§13.2 passo 3, o schema descartável).
**CENÁRIO:** medido em `P11`. `CREATE SCHEMA` não aceita o nome como parâmetro — `PREPARE cs(text) AS
CREATE SCHEMA $1` é erro de sintaxe — e o caminho `set_config` + `quote_ident` só alcança `search_path`.
O único comando do sistema que **precisa** do nome dentro do texto é o que a §10.3 deixou de descrever.
A revisão trocou `format('%I')` por `set_config`+`quote_ident` e resolveu o alvo; o `CREATE SCHEMA`
ficou sem forma escrita — inclusive na verificação do próprio autor, que continuou usando
`format('%I')` (ficha T-0009, `VERIFICAÇÃO`, item `MIG-02`). Quem escrever o passo 5 decide sozinho, e
o caminho de menor resistência é citar o identificador no cliente, em TypeScript, à mão.
**POR QUE É REAL:** a §10 abre dizendo que o mecanismo é "em camadas, e nenhuma delas sozinha". Sem a
camada de citação escrita, sobra uma camada só — o `^[a-z][a-z0-9_]{1,40}$` da §10.2 — e o nome do
schema descartável do `verify` nem passa por ela, porque é gerado por dentro e o prefixo `verify_` é
justamente o que a borda recusa.
**CORREÇÃO SUGERIDA:** escrever na §10.3 que a citação de `CREATE SCHEMA` é feita **no servidor**
(`SELECT format('CREATE SCHEMA %I', $1)`, texto devolvido e enviado), e que nenhum identificador é
citado por código do cliente — dono: `arquiteto-dados`.

### MIG-17 — três seções do contrato leem um registro de módulos ativos que não existe e não está planejado — [MÉDIO]
**ONDE:** `db/migrator/CONTRATO.md:81-82` e `:90` (§2.3), `db/migrator/PROVISION-E-VERIFY.md:52`
(§13.1 passo 6) e `:81-84` (§13.2 item 5), contra
`db/migrations/platform/0001__tenant_registry.sql:46-49` (ausência 7, que declara que a tabela de
domínio de módulo **não** nasce) e `:27-35` (ausência 4, o fato de ativação depende de `D-03`).
**CENÁRIO:** o passo 5 precisa implementar "aplicar os módulos contratados" (`provision`), "cada
`module:<codigo>` ativo naquele cliente" (`migrate`) e "uma referência por conjunto de módulos ativos
encontrada no registro" (`verify`). O registro não existe em `platform`, e o `0001` declara que não
vai existir tão cedo. As três saídas de quem implementa são: parar (correto, mas o contrato não avisa
que é para parar), tratar todo cliente como sem módulo (silencioso, e faz o `verify` aprovar um
cliente cujas tabelas de módulo ninguém comparou), ou deduzir o módulo pela existência de tabela —
que é nominalmente proibido por `dados.md` §5 e pelo próprio `:90`.
**POR QUE É REAL:** a ausência está declarada no `.sql` e **não** está declarada no contrato, que é o
documento que o `coder` vai ler. Dois artefatos da mesma tarefa afirmam coisas opostas sobre a mesma
tabela.
**CORREÇÃO SUGERIDA:** o contrato declarar, nas três seções, que o registro de módulo ativo ainda não
existe e o que o executor faz enquanto isso — dono: `arquiteto-dados`.

### MIG-12 — a §8 promete detectar um índice fora do alvo com uma busca que só olha dentro do alvo — [BAIXO]
**ONDE:** `db/migrator/APLICACAO-E-ALVO.md:65-73` (a limpeza, "procurado **dentro do namespace
alvo**", e o item 1: "se o índice não existe no namespace alvo, nada a limpar") contra `:80-85`
("Índice declarado que aparece fora do namespace alvo não é limpeza, é achado. A rodada para").
**CENÁRIO:** medido em `P6`. Com o alvo correto e um comando qualificado, o índice nasce em `public` e
a busca restrita ao alvo devolve zero — que o item 1 lê como "nada a limpar", e a rodada segue. A
frase que promete o achado não tem consulta que a produza: para ver o fantasma é preciso procurar o
nome **em todos os namespaces**, que é o oposto do que o texto acabou de fixar.
**POR QUE É REAL:** a detecção primária existe (a §10.4 pega o `oid` novo fora do alvo no momento da
criação), então o dano é limitado; o defeito é a contradição interna, que chega ao passo 5 como
escolha de quem implementa.
**CORREÇÃO SUGERIDA:** separar as duas buscas no texto — a de limpeza é restrita ao alvo, a de achado
é por nome em todos os namespaces — dono: `arquiteto-dados`.

### MIG-13 — nada diz se o `verify` enumera schemas pelo registro ou pelo catálogo, e a resposta muda o que ele enxerga — [BAIXO]
**ONDE:** `db/migrator/PROVISION-E-VERIFY.md:17` ("compara cada schema real com a referência"),
`:85-87` (item 6) e `:108-110` ("`verify` é também a resposta ao drift").
**CENÁRIO:** pelo registro, um schema `t_*` que exista no catálogo e não esteja em `platform.tenants`
é invisível a tudo: `migrate` itera o registro (§10.1), `verify` idem, e ninguém o reporta — enquanto
o comando é vendido como a resposta ao drift. Pelo catálogo, o mesmo comando passa a reportar como
achado todo schema descartável que uma execução anterior não conseguiu derrubar (§13.2 passo 7, saída
`4`), que é estado previsto e sem caminho de limpeza: a condição 1 do `drop` é o `oid` que **aquela**
execução criou, então execução nenhuma consegue remover o restinho de outra.
**POR QUE É REAL:** as duas leituras são defensáveis e o texto não escolhe; quem escolhe é o passo 5.
**CORREÇÃO SUGERIDA:** fixar que a enumeração é pelo catálogo e que schema `t_*` fora do registro é
achado nomeado, com o descartável órfão tendo tratamento próprio — dono: `arquiteto-dados`.

---

## 3. As perguntas que o brief fez, respondidas uma a uma

### 3.1 A §11.5 declara o suficiente sobre o que a lista de permissão não pega? **Não.**
Ela declara quatro coisas e todas procedem. Falta a quinta, e é a única com consequência de
isolamento: **a classificação olha o começo do comando, e nada mais**. `P3` e `P7b` são a prova, e o
achado é `MIG-10`. Enquanto isso não estiver escrito, a §11.5 comete o mesmo defeito que o `MIG-03`
nomeou na versão anterior — criar expectativa de cobertura maior que a real —, só que uma camada mais
fundo e mais difícil de perceber, porque agora a lista é de permissão e "lista de permissão" soa como
fechamento.

### 3.2 Inverter o controle: o que é legítimo e vai ser recusado?
Levantei a lista lendo a §11.2 contra o que este projeto já disse que vai precisar. Nenhum item é
achado; é o custo previsto da inversão, e ele deve ser sabido antes, não descoberto sob prazo:

- `CREATE EXTENSION` — recusado. Hoje não morde (`D-04` tirou o gerador de uuid do banco), mas morde
  no dia de `citext`, `pg_trgm` ou `btree_gin` para busca de catálogo.
- `CREATE MATERIALIZED VIEW` e `REFRESH` — recusados. `dados.md` §4 admite saldo materializado
  reconstruível, e `performance.md` fala de relatório consolidado.
- `ALTER TABLE ... ATTACH/DETACH PARTITION` — recusado; `CREATE TABLE IF NOT EXISTS ... PARTITION OF`
  passa. Particionamento entra pela metade, o que é pior do que não entrar.
- `CREATE TYPE`, `CREATE DOMAIN`, `CREATE COLLATION`, `CREATE STATISTICS` — recusados.
- `ALTER TABLE ... SET (…)`, `ALTER INDEX`, `ANALYZE` — recusados.
- `DROP INDEX CONCURRENTLY` de índice que se provou inútil — recusado, e esse é deliberado
  (`migrations.md` §4), mas é o que mais vai pressionar, porque índice morto custa escrita todo dia.
- **A armadilha real:** `ALTER TABLE ... ADD CONSTRAINT` **está** na lista e não tem forma
  idempotente (§16 admite). Ele só é seguro porque, no regime transacional, o `ROLLBACK` desfaz a
  tentativa anterior. No dia em que alguém puser um `ADD CONSTRAINT` numa migration não-transacional,
  a retomada quebra. A §11.3 já recusa "não-transacional com comando que não exija isso" — vale
  escrever que essa recusa é o que protege a §16.

Recomendo, e não é achado: a mensagem de recusa nomeia **a forma encontrada** e aponta o caminho de
ampliação (revisão do contrato). O autor já registrou esse risco; ele é o que decide se a lista
sobrevive à primeira pressão.

### 3.3 Detectar basta, no regime não-transacional?
**Basta, e só porque o conjunto de comandos ali é de um item.** A prevenção do passo 3 da §10.3.2 é
real: `P4` mostra o alvo sobrevivendo a cada statement, e com `search_path` de um schema só, sem
`public`, comando **não qualificado** não tem outro lugar onde pousar. O que escapa da prevenção é o
comando **qualificado** (`P6`), e aí a §10.4 detecta depois do fato. O dano possível é o teto do que
`CREATE INDEX CONCURRENTLY` faz: um índice a mais, num objeto que não é do alvo, sem perda de dado e
sem leitura de dado. Para esse teto, detectar basta, e a decisão humana de remover é a postura certa.

Duas condições que sustentam esse "basta", e as duas precisam continuar verdadeiras: (i) o regime
não-transacional continuar restrito a `CREATE INDEX CONCURRENTLY`, com a recusa do carregador que o
garante; (ii) o comando qualificado ser recusado no texto — que é `MIG-10`, o mesmo buraco. Se a §11.3
afrouxar, a detecção passa a ser o único controle, e aí ela não basta mais.

### 3.4 As três condições do `drop` do descartável: existe estado em que passem sobre outro schema?
**Não encontrei, e tentei por três lados.** (i) Nome: a família `t_verify_%` é proibida a cliente por
`CHECK` — medido em `P2` — então nenhum schema de cliente casa com o padrão. (ii) Registro: a terceira
condição pega o que estiver em `platform.tenants.schema_name`, e como o nome é gerado com 16
hexadecimais de gerador criptográfico, um schema real nunca cai ali por coincidência. (iii) `oid`: a
reutilização exigiria esgotar o contador global de `oid` dentro de uma execução, o que não é cenário.
A condição que faz o trabalho é a do `oid`; as outras duas protegem contra o descuido, não contra
estado adversário — e está bem assim, porque esta rotina não tem adversário, tem operador.

Uma assimetria que fica anotada e vira `MIG-13` pelo lado operacional: o `drop` do **schema** tem três
condições, e o `drop` do **banco** descartável do `platform` (`PROVISION-E-VERIFY.md:96-97`) não tem
nenhuma escrita. Sob a decisão do humano (sem `CREATEDB`) esse caminho não roda em ambiente de
operação; se um dia rodar num cluster de desenvolvimento que tenha dado real, `DROP DATABASE` é o
comando mais destrutivo do sistema e é o único sem condição declarada.

### 3.5 A separação de papéis é verificável por catálogo?
**Metade.** É `MIG-14`, com `P10` como prova.

---

## 4. As sete ausências do `0001` — declaradas, ou decisão por omissão?

Este era o risco principal do plano. Conferi uma a uma contra a fonte que cada uma cita.

| # | Ausência | Veredito |
|---|---|---|
| 1 | fuso do cliente e do estabelecimento | **declarada.** Regra aprovada contra regra aprovada, lacuna aberta com o humano. Coluna escrita hoje seria escolha de árbitro |
| 2 | moeda | **declarada.** O argumento decisivo é o certo: se a moeda for do estabelecimento, a coluna não é desta tabela, e corrigir depois é expand/contract em N schemas |
| 3 | identidade fiscal | **declarada.** É de `FIS` e o catálogo fiscal não tem casa (`D-05`) |
| 4 | fatos do ciclo de vida | **declarada, com uma generalização que não se sustenta.** "Todos exigem AUTOR" vale para os fatos com sujeito humano; não vale para `migration_applied`, cujo grão em `RN-PRV-013` é "(schema, versão), com desfecho e duração". É o que sustenta `MIG-15` |
| 5 | estabelecimento, terminal, habilitação | **declarada, e é a mais bem argumentada das sete.** Tabela de cliente não mora no controle (`dados.md` §1), FK não cruza schema, e o terminal depende do terceiro eixo de `D-03` |
| 6 | dinheiro e quantidade | **declarada, e trivialmente verdadeira**: não há coluna de valor nesta tabela, então a ausência não decide nada |
| 7 | módulo e capacidade como domínio | **declarada no `.sql` e contradita pelo contrato.** É `MIG-17` |

**Seis das sete são ausências declaradas de verdade.** A 4 é declarada com justificativa mais larga
que o fato suporta, e a 7 é declarada no arquivo errado — o `coder` lê o contrato, não o comentário do
`0001`.

---

## 5. Invariante 10 aplicado ao que esta tarefa entrega

O ledger declara três ausências e elas estão numeradas, o que é o que o invariante pede. O que falta
é o que a §2 registra como `MIG-15`: as duas **detecções** (checksum divergente, drift do `verify`)
não estão na lista nem em lugar nenhum, e são justamente os eventos de segurança deste escopo. Somo a
terceira, que nasce do `MIG-09`: mutação do registro de clientes não é recusada nem registrada, e é o
ato com a pior consequência possível nesta camada.

Nenhum dos três exige `D-03`: nenhum precisa de pessoa. Quem escreve é o executor, e o sujeito é o
papel de banco, que ele conhece.

---

## 6. Entrada para `D-03` — um papel de aplicação por cliente, ou um só

Não decido, e o registro é este, para o humano fechar junto com o resto de `D-03`.

**Um papel por cliente.** O `GRANT` vira a fronteira: erro de código que tente alcançar outro schema
volta como `permission denied` em vez de devolver dado. É a única opção em que o banco participa do
isolamento, e é a que torna `MIG-14` verificável de verdade (membros do grupo de aplicação, um por
cliente, nenhum com `USAGE` em `platform`). Custo: N papéis crescendo com a carteira, `GRANT` no ato
de provisionamento (`§13.1`), e o `pool` de conexão passando a ser por papel — o que muda de "uma
piscina" para "uma piscina por cliente" e mexe em custo de conexão, que é recurso escasso no Postgres.
Ligar módulo passa a exigir `GRANT` novo, então privilégio entra no caminho de `provision` e de
ativação de módulo.

**Um papel só.** Uma piscina, custo de conexão constante, sem `GRANT` por cliente. Toda a fronteira
passa a morar na borda da requisição: o papel alcança todos os schemas de cliente, e o que impede o
vazamento é exclusivamente o código que resolve o tenant. O banco deixa de ser a segunda camada e
vira testemunha.

**O que liga isso a `D-03`:** o terceiro eixo (como o cliente chega na borda) decide se a conexão pode
ser escolhida **depois** de resolver o tenant. Se a resolução acontecer antes de tocar o banco, um
papel por cliente é implementável; se o próprio banco participar da resolução, não é. Por isso a
pergunta pertence ao pacote de `D-03` e não se responde aqui.

**O que já está fechado e não volta:** o papel do executor não atende requisição, aconteça o que
acontecer com a pergunta acima (`db/papeis-e-credencial.md:56-60`).

---

## 7. As cinco perguntas de `seguranca.md` §1

**1. Existe caminho em que uma consulta alcança schema de outro cliente?** **Sim, um, e ele foi
executado:** corpo de migration com referência qualificada a outro schema, que a lista de permissão
não vê (`MIG-10`, provas `P3` e `P7b`). Os dois caminhos da passada anterior estão fechados — o do
`provision` estruturalmente (`P1`, `P2`), o do `DROP SCHEMA` pela inversão da lista. O leitor
cross-schema legítimo continua sendo um só, o `verify`, e continua restrito a catálogo
(`PROVISION-E-VERIFY.md:103-106`).

**2. O tenant vem de identidade autenticada ou de algo que o chamador controla?** Não há chamador. As
duas entradas de linha de comando agora são confrontadas com o registro (§10.1), e `migrate` deixou de
poder criar schema — as duas correções centrais do `MIG-02`. O que passou a importar mais é a
**integridade do registro**, que é `MIG-09`: a procedência está certa, e a fonte dela é mutável em
silêncio.

**3. Existe operação que aceita tenant ausente e cai em default?** Não mais. `P4` e `P5`: o alvo existe
nos dois regimes e não vaza entre conexões. Anoto um detalhe medido em `P11`: com o parâmetro
`forja.target_schema` perdido, `current_setting` devolve string vazia em vez de falhar, e
`quote_ident('')` produz `""` — a asserção do passo 3 da §10.3.1 é o que transforma isso em recusa.
Ela não é opcional; é o que faz o regime falhar fechado.

**4. Id de recurso é validado contra o tenant?** O análogo é o par `(slug → schema_name)`, e ele agora
é derivado pelo banco (`GENERATED ... STORED`), com `UNIQUE` sobre o slug — não há mais como dois
clientes apontarem para o mesmo schema por inserção. O que não é validado é a **permanência** dessa
ligação: `MIG-09`.

**5. Cache, fila, log, arquivo temporário, exportação, relatório?** Não há cache nem fila. Log e
artefato: classificados (`MIG-08`, fechado). Arquivo temporário: o schema descartável, com o `drop`
resolvido (§3.4) e o resíduo em `MIG-13`. Chave colidente: fechada na inserção, aberta na mutação
(`MIG-09`).

---

## 8. Notas — sem cenário concreto, logo não são achados

- **`tenant_id` não tem gerador declarado.** A coluna é `uuid NOT NULL` sem `DEFAULT` por decisão de
  `D-04` (ordenado no tempo, gerado na borda), e a borda que cria a linha é o `provision` do executor.
  Nem o contrato nem o `0001` dizem qual regra de geração o executor usa, e as dependências aprovadas
  são `pg`, `typescript` e `node:test` — então o passo 5 vai escrever um gerador ordenado à mão ou
  cair no aleatório, que é a saída que `D-04` recusou. Vale uma frase no contrato.
- **A prosa do `0001` conta quatro reservados e a §10.2 lista cinco.** O `CHECK` está certo (cobre os
  cinco, medido em `P2`); é imprecisão de comentário, e migration aplicada não se edita. Já declarada
  pelo autor.
- **As duas imprecisões declaradas do `0000`** (`COMMENT` de `module`, e o comentário citando
  `to_regclass`) estão corretamente tratadas como `COMMENT ON` futuro. O comportamento normativo é o
  do texto novo, e `P9` confirma que a consulta nova faz o que promete.
- **Numeração global entre os quatro arquivos:** confirmei que `§1`–`§16` aparecem uma vez cada e que
  as citações dentro de `0000` e `0001` (`§3`, `§5`, `§6`, `§9`, `§10`, `§13`) continuam apontando
  para a seção certa. A decisão está certa pela razão que ele deu.
- **Concorrência entre rodadas** continua sem trava e continua declarada (§16). Não virou achado
  porque `provision` agora falha fechado no `UNIQUE` e `migrate` não cria schema — as duas rodadas
  convergem ou uma morre no lock.

---

## 9. Veredito — o `coder` pode escrever o executor?

**Pode, por partes, e a divisão é esta.** Um `BLOQUEIO` geral atrasaria trabalho que já está
especificado com precisão; um "pode tudo" entregaria ao passo 5 quatro decisões que não são dele.

**Liberado agora** — o mecanismo está escrito, medido e sem achado aberto:
descoberta, ordem e checksum (§2, §3); cabeçalho (§4); ledger e bootstrap, inclusive o retrato
estrutural (§5, §9 — `P8`, `P9`); sessão (§6); aplicação transacional e retomada (§7); regime
não-transacional e limpeza (§8, §10.3.2 — `P4`, `P5`, com a ressalva do `MIG-12`, que é redação);
verificação de namespace (§10.4); procedência do nome (§10.1); códigos de saída (§12); `provision`
passos 1 a 3, 5 e 6 (§13.1).

**Bloqueado até a correção chegar:**
1. **O carregador (§11) — `MIG-10`.** É o que o `coder` implementaria primeiro, e é onde falta o
   mecanismo que impede uma migration de alcançar outro schema. Escrever agora é fixar em código a
   decisão que o contrato não tomou.
2. **`provision` passo 4 e o schema do `verify` — `MIG-16`.** Falta a forma de citar o identificador
   em `CREATE SCHEMA`. Não é detalhe de implementação: é a única interpolação do sistema.
3. **`verify` — `MIG-11` e `MIG-13`.** O comando tem uma perna que não roda em lugar nenhum e uma
   enumeração indefinida.
4. **Tudo que lê módulo ativo — `MIG-17`.** Hoje o `coder` não tem como implementar sem inventar.

**Em paralelo, e não bloqueia o `coder`:** `MIG-09` (migration `0002` com a trava do registro),
`MIG-14` (a forma auditável da convenção de papéis) e `MIG-15` (o que passa a ser registrado). O
executor não emite `UPDATE` nem `DELETE` em `platform.tenants`, então a ausência da trava não muda uma
linha do código dele — muda o que acontece quando alguém tem a credencial na mão.

**O que eu não pude verificar, e digo em vez de aprovar:** nenhum comportamento do executor, porque
ele não existe; lock, tempo e custo sobre N schemas reais, porque não há cliente nem volume; o
comportamento do `verify` em qualquer perna, pela mesma razão; e o custo do retrato de catálogo da
§10.4, que o próprio autor levantou como risco e que é pergunta de `performance`, não minha.

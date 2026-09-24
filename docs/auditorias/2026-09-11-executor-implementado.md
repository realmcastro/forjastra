# Auditoria — o executor implementado (gate 4)

**Data:** 2026-09-11 · **Agent:** `seguranca` · **Read-only.**
**Escopo:** T-0009, passo de implementação. `db/migrator/src/**`, `db/migrator/test/**`,
`db/migrations/platform/0005__event_kinds_immutability.sql`,
`db/migrations/platform/0006__event_kinds_refusal_and_privilege.sql`, e a §11 reescrita
(`db/migrator/RECUSAS.md`) depois da correção do terceiro gate.

**Antecessoras, nenhuma editada:** `docs/auditorias/2026-09-11-executor-e-schema-platform.md`
(`MIG-01`…`MIG-08`), `…-executor-e-schema-platform-reauditoria.md` (`MIG-09`…`MIG-17`),
`…-delta-db-e-borda-api.md` (`SEC-01`…`SEC-12`).

**Prefixo novo, `EXE-`,** porque `SEC-` já nomeia achados de dois escopos diferentes na auditoria
anterior e reaproveitá-lo produziria duas coisas com o mesmo nome.

**Veredito na §6.** Ele é curto: **não**, o executor ainda não pode provisionar cliente de verdade.
Quatro achados `ALTO`, e três deles são o mesmo controle — a §11 — caindo pela **terceira** rodada,
agora por dois caminhos que não são grafia.

---

## 0. Método — o que foi medido

PostgreSQL **16.15** (`docker.io/library/postgres:16.15`), container descartável próprio, removido
ao fim. O crivo foi exercitado contra o `dist/` compilado do código real (conferido: nenhum `.ts` de
`src/` ou `test/` é mais novo que o `dist/`, então o binário medido é o código auditado). Sondas em
`/tmp`; **nada foi escrito na árvore do projeto** fora deste arquivo.

Não repeti a verificação já feita pelo autor (typecheck limpo, 55 testes passando, 24 casos de
aceite mapeados). Não a contesto e não a herdo como evidência minha: o que está abaixo eu medi.

| Prova | Pergunta | Resultado |
|---|---|---|
| `V1` | as quatro grafias do `SEC-01` (`t_x.`, `"t_x".`, `T_X.`, `"T_x" . `) | **as quatro recusadas.** A correção do `SEC-01` se sustenta |
| `V2` | as duas lacunas que a §11.7 item 2 declara (espaçamento, comentário no meio do comando) | **as duas estão cobertas.** `normalize` colapsa `\s+`; o comentário vira espaço. `t_outro/* */.orders` e `t_outro . orders` são recusados |
| `V3` | `SET LOCAL search_path TO t_outro` dentro de corpo de função | **passa o crivo.** A §11.5 proíbe `SET search_path` "em qualquer posição" e o padrão é `\bset\s+search_path\b` |
| `V4` | o arquivo inteiro do `V3` (tabela + função + gatilho), pelo crivo | **aprovado, 3 comandos.** Nenhum qualificador de schema no corpo |
| `V5` | o mesmo arquivo, aplicado num Postgres real | `INSERT INTO t_alvo.vendas` gravou linha em **`t_vitima.orders`**. Vazamento entre clientes, medido |
| `V6` | `ALTER TABLE orders ADD COLUMN IF NOT EXISTS c integer, DROP COLUMN total` | **passa o crivo**; no banco, a coluna `total` **sumiu** |
| `V7` | `ALTER TABLE platform.tenants ADD COLUMN …, DISABLE TRIGGER tenants_reject_mutation` | **passa o crivo**; no banco, o `UPDATE` que o gatilho existia para recusar passou |
| `V8` | `ALTER TABLE … ADD COLUMN …, DROP CONSTRAINT …` e `…, OWNER TO …` | **passam o crivo** |
| `V9` | slug de 41 caracteres (o máximo que `target.ts` aceita) como qualificador | **passa o crivo**; com 40, recusa. No banco, a view leu a linha do outro cliente |
| `V10` | `verify`: view de um cliente reapontada para o schema de outro, mesmas colunas | **impressão idêntica byte a byte** antes e depois. A view devolve a linha do outro cliente |
| `V11` | a impressão esconde chave estrangeira para outro schema? | **não**: `REFERENCES t_vitima.orders(id)` sobrevive aos dois `replace` |
| `V12` | `CREATE OR REPLACE FUNCTION … LANGUAGE c AS 'lib','sym'` e `LANGUAGE plpython3u` | **passam o crivo**. Quem recusa é o papel do banco, não o arquivo |
| `V13` | `CREATE SCHEMA IF NOT EXISTS t_globex` em alvo `platform` | **passa o crivo** |
| `V14` | rótulo de cifrão em maiúscula (`$BODY$`), forma legal pela §11.1 item 2 | **recusado**, com mensagem que não descreve o motivo. Falha fechado |
| `V15` | `SET LOCAL search_path` como comando solto, fora de corpo de função | **recusado** pela lista de permissão. É a lista, não a §11.5, que o pega |
| `V16` | `approveAllScreen` é alcançável de produção? | só por `run({ contentScreen })`. `main.ts` não passa o parâmetro; o parâmetro existe em `src/` |

---

## 1. Prioridade um: existe caminho em que um cliente vê dado de outro?

**Existe, e eu o rodei fim a fim.** As cinco perguntas de `.claude/rules/seguranca.md` §1,
respondidas:

1. **Consulta que alcança schema de outro cliente?** **Sim**, por três caminhos independentes, todos
   medidos: `EXE-01` (corpo de função que troca o `search_path` em tempo de execução), `EXE-03`
   (qualificador cujo nome é um caractere mais longo do que o padrão da §11.3 enxerga) e `EXE-04`
   (drift de view que o `verify` aprova). O primeiro **escreve** no schema alheio a cada venda.
2. **O alvo vem de identidade, ou de algo que o chamador controla?** Vem do registro. `migrate
   --schema` confronta `platform.tenants` **antes** do bootstrap (`commands/migrate.ts:37-51`), e
   `provision` valida a forma antes de tudo (`commands/provision.ts:26`). Este eixo está certo.
3. **Operação que aceita alvo ausente e cai em default?** Não encontrei. `setTargetLocal` /
   `setTargetSession` + `assertTarget` exigem `current_schema()` igual ao alvo e `search_path` com
   **exatamente um** schema, e o regime não-transacional refaz a asserção antes de **cada** comando
   (`apply.ts:152-157`). O único caminho sem asserção prévia é o `0000` em banco vazio, declarado, e
   ali o `search_path` aponta para schema inexistente — falha fechado.
4. **Id de recurso validado contra o tenant (IDOR)?** Não se aplica: o executor não recebe id de
   recurso de chamador nenhum. O análogo — nome de schema — está coberto pelo item 2.
5. **Canal lateral (cache, fila, log, temporário, exportação, relatório)?** Sem cache, sem fila, sem
   arquivo temporário. Sobram três concentradores, todos declarados e nenhum novo: a saída do
   `verify` (percorre todos os clientes), a mensagem de divergência (nomeia schema) e
   `platform.executor_events.detail`, que guarda o diff estrutural de **todos** os clientes numa
   tabela só. Os três caem na classificação de `db/papeis-e-credencial.md` §4. Nota na §5.

---

## 2. Achados

### EXE-01 — `SET LOCAL search_path` no corpo de função atravessa a §11.5 e move a venda de um cliente para o schema de outro — [ALTO] · **reincidente de `MIG-10`/`SEC-01`** (mesmo controle, terceira reabertura)

**ONDE:** `db/migrator/src/refusals.ts:35` (`/\bset\s+search_path\b/`) e `:36` (`/\bset\s+role\b/`).

**CENÁRIO** (medido, `V3`→`V5`). Uma migration de alvo `tenant`, três comandos, **nenhum
qualificador de schema em lugar nenhum**:

```sql
CREATE TABLE IF NOT EXISTS vendas (id integer, valor integer);
CREATE OR REPLACE FUNCTION espelha() RETURNS trigger AS $fn$
BEGIN
  SET LOCAL search_path TO t_vitima;
  INSERT INTO orders (id, segredo) VALUES (new.id, 'espelho');
  RETURN new;
END
$fn$ LANGUAGE plpgsql;
CREATE OR REPLACE TRIGGER espelha_venda AFTER INSERT ON vendas
  FOR EACH ROW EXECUTE FUNCTION espelha();
```

O crivo **aprova o arquivo inteiro**. Aplicado, ele nasce em **todos** os schemas de cliente, porque
é stream `tenant`. Depois disso, `INSERT INTO t_alvo.vendas VALUES (1234, 500)` gravou a linha em
`t_vitima.orders` — medido, a linha está lá com o texto que eu pus.

**POR QUE É REAL:** o padrão exige `search_path` **imediatamente** depois de `set`. `SET LOCAL
search_path`, `SET SESSION search_path` e `SET LOCAL ROLE` têm uma palavra no meio e não casam. A
§11.5 escreve o proibido como "`SET search_path` … em qualquer posição", e `SET LOCAL search_path` é
um `SET search_path`: a implementação é mais estreita que a regra que ela cita, que é literalmente o
enunciado do `MIG-03`. Isto **não** depende de adversário: fixar `search_path` dentro de função é o
conselho mais repetido da literatura de plpgsql, e quem o seguir numa migration de `tenant` fixa
todos os clientes no schema que ele tinha aberto no dia. A §11.7 item 4 reserva o adversário para a
revisão humana; este é o erro honesto que a lista existe para pegar. As duas camadas seguintes não
alcançam: a §10.4 procura objeto novo **fora** do alvo, e a função nasce **dentro**; a impressão da
§13.3 compara estrutura, e a estrutura é idêntica em todos os clientes — é o efeito de execução que
difere.

**CORREÇÃO SUGERIDA:** recusar `set` seguido de `search_path`/`role`/`session authorization` com
qualquer número de qualificadores (`local`, `session`) entre eles, e escrever na §11.5 que o alvo é
o **comando** `SET`, não a colocação das palavras — dono: `arquiteto-dados` (§11.5) e `coder`
(`refusals.ts`).

---

### EXE-02 — a forma `ALTER TABLE` classifica só a primeira ação, e a vírgula traz `DROP COLUMN`, `DISABLE TRIGGER` e `OWNER TO` — [ALTO] · **reincidente de `MIG-10`** (classificar pelo começo, um nível abaixo)

**ONDE:** `db/migrator/src/refusals.ts:133-134`.

**CENÁRIO** (medido, `V6`→`V8`). `ALTER TABLE name action [, ...]` é a sintaxe do comando; o padrão
ancora só a primeira ação e nada lê o resto:

| Arquivo | Crivo | Banco |
|---|---|---|
| `ALTER TABLE orders ADD COLUMN IF NOT EXISTS c integer, DROP COLUMN total;` | **passa** | coluna `total` removida |
| `ALTER TABLE platform.tenants ADD COLUMN IF NOT EXISTS c integer, DISABLE TRIGGER tenants_reject_mutation;` | **passa** | `UPDATE` no registro de clientes passou |
| `ALTER TABLE orders ADD COLUMN IF NOT EXISTS c integer, DROP CONSTRAINT orders_total_check;` | **passa** | — |
| `ALTER TABLE orders ADD COLUMN IF NOT EXISTS c integer, OWNER TO forja_app;` | **passa** | — |

**POR QUE É REAL:** `migrations.md` §4 lista `DROP COLUMN` e "remover `CHECK`/`UNIQUE` que garante
invariante de negócio" como **proibidos em migration, sem exceção de agent**, e a §11.2 diz "**uma**
ação por comando" e "**todo** `DROP`, de qualquer objeto" fora da lista. O crivo é o único mecanismo
dessas três frases, e ele lê a vírgula como parte do ruído. A correção do `MIG-10` foi "classificar
pela forma **inteira**, do primeiro ao último token"; esta forma volta a classificar pelo começo. A
linha do `platform` é a pior: ela desliga, dentro de uma migration aprovada, a trava que a `0002`
existe para ser. O `verify` pega **depois** — a coluna sumida aparece na impressão, o
`habilitacao:D` também —, e "depois" num sistema forward-only é uma coluna que não volta.

**CORREÇÃO SUGERIDA:** recusar vírgula fora de parênteses na forma `ALTER TABLE`, que é a leitura
literal de "uma ação por comando" — dono: `coder` (`refusals.ts`), com a frase da §11.2 já escrita.

---

### EXE-03 — o qualificador `t_` da §11.3 cobre 40 caracteres e o slug aceita 41 — [ALTO]

**ONDE:** `db/migrator/src/refusals.ts:54-55` (`t_[a-z0-9_]{1,40}`) contra
`db/migrator/src/target.ts:144` (`/^[a-z][a-z0-9_]{1,40}$/`, que admite slug de **41**).

**CENÁRIO** (medido, `V9`). `isValidTenantSlug` aprova um slug de 41 caracteres, e
`tenantSchemaNameFromSlug` devolve um nome de 43 — legal no Postgres, que admite 63. Uma migration
de alvo `tenant` com `… AS SELECT * FROM t_<41 caracteres>.orders` **passa o crivo**; com 40, é
recusada. Aplicada, a view devolveu a linha do outro cliente. O padrão não casa por backtracking:
depois de 40 caracteres o próximo não é o ponto, e não há fronteira de palavra mais adiante.

**POR QUE É REAL:** o limite existe nos dois arquivos, com números diferentes, e nada liga um ao
outro — nem constante compartilhada, nem teste. Basta um cliente com nome comprido para a §11.3
deixar de valer **para aquele cliente**, sem sintoma nenhum: os outros continuam protegidos e o
arquivo passa na revisão. É o defeito silencioso na forma mais pura, e ele já nasceu pronto.

**CORREÇÃO SUGERIDA:** derivar o padrão da §11.3 da mesma constante que valida o slug, ou apertar o
slug para o que o padrão cobre — nunca dois números escritos à mão em dois arquivos — dono: `coder`,
com a escolha do número em `arquiteto-dados` (§10.2 e §11.3).

---

### EXE-04 — a impressão da §13.3 não carrega o corpo da view, e o `verify` aprova a view que lê o schema de outro cliente — [ALTO] · mesma classe do `SEC-02`

**ONDE:** `db/migrator/src/structure-print.ts:152-154` (linha `visao`, que leva só nome e
`reloptions`) e `PROVISION-E-VERIFY.md` §13.3, a fonte de onde a consulta foi transcrita.

**CENÁRIO** (medido, `V10`). Schema `t_drift` com `orders` e a view `resumo` lendo `t_drift.orders`.
Impressão tirada. Em seguida, na mão — que é exatamente o drift que a §13.2 diz que este comando
existe para responder:

```sql
CREATE OR REPLACE VIEW t_drift.resumo WITH (security_invoker = true) AS
  SELECT id, segredo FROM t_vitima.orders;
```

Impressão tirada de novo: **idêntica**, linha a linha. As colunas casam porque o formato é o mesmo,
e a linha `visao` nunca carregou o corpo. `SELECT * FROM t_drift.resumo` devolve as linhas de
`t_vitima`. Tabela, coluna, restrição, índice, gatilho e **função** (por `md5` da definição inteira)
estão na impressão; a view é o único objeto cujo corpo ficou de fora.

**POR QUE É REAL:** view com `security_invoker` é forma **permitida** pela §11.2, e é o objeto mais
barato que existe para atravessar schema. O `verify` é o único controle automatizado contra drift, a
§13.3 se declara "detecta a diferença que importa", e a diferença que importa mais que todas passa.
É a mesma raiz do `SEC-02` — a impressão amostra um conjunto incompleto de atributos do catálogo —,
com a diferença de que o `SEC-02` escondia o **desarme de uma trava** e este esconde uma **leitura
entre clientes em curso**.

**CORREÇÃO SUGERIDA:** acrescentar `md5(pg_get_viewdef(...))` à linha `visao`, com os mesmos dois
`replace` das outras — dono: `arquiteto-dados` (§13.3) e `coder` (`structure-print.ts`).
`db/referencia-estrutural-platform.txt` **não** precisa ser regenerado: o `platform` não tem view
nenhuma hoje (conferido, 88 linhas, nenhuma `visao`).

---

### EXE-05 — a raiz de composição de produção aceita crivo injetado, e o comentário diz que o padrão é `undefined` — [MÉDIO]

**ONDE:** `db/migrator/src/executor.ts:30-39`.

**CENÁRIO** (medido, `V16`). `RunOptions.contentScreen` é opcional e `run()` faz
`options.contentScreen ?? resolveContentScreen()`. `main.ts:59` não passa o parâmetro, então o
**comando** está seguro hoje; o que existe é o parâmetro, em `src/`, e ele é obedecido. O duplo
permissivo `test/support/screen.ts` entra por ele, em `test/alvo.test.ts:55` e `:86`. O raciocínio
do duplo está certo — um arquivo que cria objeto fora do alvo é, por construção, um arquivo que o
crivo real recusa, e sem desligar a primeira camada não há como exercitar a segunda. O que está
errado é **onde** a costura mora.

Agravante, e é o que me faz reportar em vez de deixar em nota: o comentário das linhas 31-34 diz
"em produção vem de `resolveContentScreen()`, que hoje devolve `undefined` e faz a rodada ser
recusada". Isso deixou de ser verdade quando o crivo nasceu. Quem lê a raiz de composição hoje
conclui que produção roda **sem** crivo, e quem for consertar essa "ausência" tem um parâmetro à mão
para passar um crivo próprio.

**POR QUE É REAL:** a trava de `loader.ts:24-30` protege contra o crivo **ausente**, e a medi: sem
ele, saída `2`, antes de qualquer conexão. Ela não protege contra o crivo **injetado**, e é esse o
caminho que existe. A distância entre "nenhum caminho de produção aceita" e "nenhum caminho de
produção usa" é uma chamada.

**CORREÇÃO SUGERIDA:** o teste da §10.4 chamar `load()` com o duplo e montar o `RunContext`
diretamente, tirando `contentScreen` de `RunOptions`; se a costura tiver de ficar, o comentário
corrigido no mesmo passo — dono: `coder`.

---

### EXE-06 — `LANGUAGE c` e `plpython3u` passam o crivo, e quem recusa é um papel sem casa e sem teste — [BAIXO]

**ONDE:** `db/migrator/src/refusals.ts:104-107` (a forma `CREATE OR REPLACE FUNCTION`, que não olha
`LANGUAGE`).

**CENÁRIO** (medido, `V12`). `CREATE OR REPLACE FUNCTION leak() RETURNS integer AS 'libqualquer',
'sym' LANGUAGE c;` e a versão `plpython3u` passam o crivo. No banco, as duas exigem superusuário —
e o executor **não deve** ser superusuário (`db/papeis-e-credencial.md` §1), o que fecha o caso na
prática. O que não fecha: o ato que cria o papel ainda não é artefato nenhum deste repositório
(§5 do mesmo arquivo), nenhum teste exercita a separação, e a máquina de quem desenvolve conecta
com superusuário — que é o que `test/support/postgres.ts:39` usa.

**POR QUE É REAL:** é `BAIXO` e não mais porque a barreira efetiva existe e a detecção existe
(`verify` §13.4 reporta `usesuper`). Fica registrado porque o dia em que alguém rodar o executor com
credencial administrativa "só para provisionar o primeiro cliente" é o dia em que um arquivo de
migration vira execução arbitrária no servidor — e esse dia é plausível justamente porque o papel
não tem ato versionado que o crie.

**CORREÇÃO SUGERIDA:** exigir `LANGUAGE` de lista fechada (`plpgsql`, `sql`) na forma da §11.2 —
dono: `arquiteto-dados` (§11.2) e `coder`.

---

### EXE-07 — `CREATE SCHEMA IF NOT EXISTS t_<slug>` em alvo `platform` passa, contra a frase que diz que schema de cliente nasce só no `provision` — [BAIXO]

**ONDE:** `db/migrator/src/refusals.ts:74-77`; a frase é `RECUSAS.md` §11.2, linha da forma
`CREATE SCHEMA`.

**CENÁRIO** (medido, `V13`). Uma migration de `platform` com `CREATE SCHEMA IF NOT EXISTS t_globex;`
passa o crivo. Aplicada, cria um schema de cliente sem linha em `platform.tenants`. Consequências,
nenhuma catastrófica: `migrate` nunca o alcança (itera pelo registro), `verify` o denuncia como
`schema_without_registry`, e `provision globex` passa a ser recusado no passo 3 — o cliente real fica
sem poder nascer com o nome dele, e desfazer isso é `DROP SCHEMA`, que nenhum agent pode emitir.

**POR QUE É REAL:** o crivo confere o alvo da forma e não o **nome** que ela cria, e a spec escreve
a restrição em prosa ("Schema de cliente é criado por `provision`, nunca por migration") sem
mecanismo. É a mesma assimetria que o `SEC-01` corrigiu na §11.3: frase sem padrão.

**CORREÇÃO SUGERIDA:** recusar nome com o prefixo `t_` na forma `CREATE SCHEMA` — dono: `coder`.

---

### EXE-08 — rótulo de cifrão em maiúscula, que a §11.1 item 2 declara legal, é recusado com mensagem que não diz o motivo — [BAIXO]

**ONDE:** `db/migrator/src/sql-text.ts:138` (`/^\$([a-z_][a-z0-9_]*)?\$/`, sem `i`).

**CENÁRIO** (medido, `V14`). `$BODY$ … $BODY$` — o rótulo que qualquer ferramenta de banco gera por
padrão — não é reconhecido como literal. O corpo passa a ser lido como código, é partido no `;`
interno, e o pedaço final (`end $body$ language plpgsql`) não casa forma nenhuma. A recusa sai como
"nenhuma forma da lista de permissão da §11.2 classifica este comando", que manda o autor procurar
o problema no lugar errado.

**POR QUE É REAL:** a §11.1 item 2 admite "cifrão com **rótulo**" sem restringir a caixa, e o
Postgres também não restringe. O desfecho é **fechado** — recusa, não passagem —, e por isso é
`BAIXO`. Falso positivo é a política declarada da §11.1; falso positivo com mensagem enganosa não é.

**CORREÇÃO SUGERIDA:** aceitar rótulo em qualquer caixa no reconhecedor, ou recusar o rótulo não
minúsculo **por nome**, com mensagem própria — dono: `coder`; se a escolha for restringir, a §11.1
item 2 ganha a frase — dono: `arquiteto-dados`.

---

### EXE-09 — `provision` aplica a stream `platform` antes de recusar, e duas linhas da spec dizem que nada foi aplicado — [BAIXO] · divergência de documento, não de código

**ONDE:** `db/migrator/src/commands/provision.ts:29-32`, contra `PROVISION-E-VERIFY.md` §13.1 (a
lista de seis passos, que não menciona aplicar `platform`), `CONTRATO.md` §14 caso 9 ("recusa nos
dois casos, saída `2`, **nada** aplicado") e `PROVISION-E-VERIFY.md` §12, linha da saída `2`
("Nenhuma migration foi aplicada").

**CENÁRIO:** repositório com uma migration de `platform` pendente; `provision acme` com `acme` já
registrado. A stream `platform` é aplicada, e só então o passo 2 recusa com saída `2`. O passo 1
(forma do slug) continua antes de tudo — conferido em `:26`, e a descrição do autor está correta
neste ponto.

**POR QUE É REAL:** o comportamento é necessário (o registro de clientes nasce na `0001`, e não há
onde inserir antes dela), e o teste de aceite existente afere o que importa — nenhuma linha nova no
registro, núcleo não aplicado no schema alheio (`test/provisionamento.test.ts:29-57`). Quem está
errado é o texto: a tabela de códigos de saída é o lugar onde alguém confere o que uma recusa
garante, e ela garante mais do que o sistema entrega. Item de honestidade, não de segurança.

**CORREÇÃO SUGERIDA:** a §13.1 ganha o passo 0 ("`platform` é levado à cabeça da fila antes do
passo 2, porque o registro nasce na `0001`"), e a §12 e o caso 9 passam a dizer "nada aplicado **no
schema do cliente**" — dono: `arquiteto-dados`.

---

### EXE-10 — a §13.3 no papel e a §13.3 no código são consultas diferentes — [BAIXO] · divergência declarada pelo autor, confirmada e sem buraco

**ONDE:** `db/migrator/src/structure-print.ts:121-170` (dois `replace`) contra
`PROVISION-E-VERIFY.md` §13.3 (um).

**O que verifiquei**, porque a pergunta do autor era se neutralizar demais esconde diferença real:
não esconde. O `replace` adicional remove `"<schema>".` **do próprio schema impresso**, nunca de
outro. Medido (`V11`): chave estrangeira `REFERENCES t_vitima.orders(id)` dentro de `t_alvo`
sobrevive aos dois `replace` e aparece na impressão. A assimetria entre os dois lados da comparação
é benigna: o nome do descartável tem maiúscula e vem citado do catálogo, o de cliente é minúsculo
puro e vem cru, e cada um é removido pelo `replace` que lhe cabe — o outro é no-op. Um nome de
cliente **nunca** vem citado, porque o prefixo `t_` impede que ele seja palavra reservada e o slug
impede maiúscula. O risco que sobra é falso positivo (texto literal `"t_acme".` dentro de um
`CHECK`), que é o lado seguro.

**POR QUE É REAL:** o defeito é que a spec diz uma coisa e o código faz outra, e a spec é o que a
próxima pessoa transcreve. Nenhuma propriedade de segurança está perdida.

**CORREÇÃO SUGERIDA:** transcrever os dois `replace` para a §13.3, com a frase do porquê (o catálogo
cita o nome quando ele não é minúsculo puro, e o carimbo do descartável tem `T` e `Z`) — dono:
`arquiteto-dados`. É a resposta à pergunta aberta que o comentário de `structure-print.ts:104-113`
deixou endereçada a ele.

---

## 3. O crivo da §11, respondido como o brief pediu

**A declaração da §11.7 item 2 não ficou honesta — ficou invertida.** Ela declara como não coberto:
"espaçamento entre tokens que faça uma forma da §11.2 ser reconhecida de outro jeito, e comentário
no meio de um comando". Medi as duas (`V2`): **as duas estão cobertas**. `normalize` colapsa `\s+`
em um espaço único antes de qualquer comparação, e `stripComments` troca o comentário por um espaço
em vez de apagá-lo — as duas decisões estão certas e são exatamente o que fecha essas grafias.
`t_outro/* nota */.orders` e `t_outro   .   orders` são recusados.

O que **não** está coberto, e não aparece na declaração, não é grafia nenhuma:

| Classe | Achado | Por que a §11.7 item 2 não a nomeia |
|---|---|---|
| **semântica de comando**: uma palavra qualificadora no meio de um `SET` | `EXE-01` | a §11.5 fala em "posição" da palavra, e o buraco é de **sintaxe do comando**, não de posição |
| **cauda de forma permitida**: a vírgula do `ALTER TABLE` | `EXE-02` | a §11.1 item 6 promete classificar "do primeiro ao último token", e esta forma lê só o começo da ação |
| **limite numérico**: 40 contra 41 caracteres de slug | `EXE-03` | não é análise de texto, é um número escrito duas vezes em dois arquivos |

O controle reabriu pela terceira vez, e desta vez **não** por uma grafia que ninguém tinha
imaginado. Reabriu porque a lista de permissão descreve formas em prosa e as implementa em prefixo:
cada forma da §11.2 declara o que o resto do comando não pode conter, e três delas (`ALTER TABLE`,
`CREATE OR REPLACE FUNCTION`, `CREATE SCHEMA`) não têm mecanismo para o resto. Enquanto o mecanismo
for "casa o começo, mais uma lista de proibições por palavra", cada rodada vai achar a próxima
palavra. A saída que muda a curva não é mais uma correção pontual: é a forma declarar o que **pode**
vir depois dela — o que é, em tamanho, o que a §11.2 já escreve em português na coluna da direita.

---

## 4. As perguntas do brief que não viraram achado

**`test/support/screen.ts` pode ser alcançado fora do teste?** Sim, pelo parâmetro de `run()` —
virou `EXE-05`. O duplo em si está bem escrito e bem justificado; é a costura que está em `src/`.

**A trava de falha fechada de `loader.ts` tem caminho que a contorne?** Não encontrei. `load()` é o
único ponto que monta `LoadedSet`, a recusa é a primeira instrução da função
(`loader.ts:24-30`), e `discover()` só corre depois. O teste `recusa-sem-crivo.test.ts` a exercita
pelos dois lados. O que ela não cobre é o crivo **injetado** (`EXE-05`): ela pergunta se existe, não
se é o certo.

**`uuid-v7.ts` duplicado de `apps/api`.** Não é achado. As duas cópias geram identidade, e
identidade aqui não autoriza nada — `platform.tenants.tenant_id` e `executor_events.event_id` nunca
resolvem acesso, e o `UNIQUE (slug)` é que é a trava do `provision`
(`memory/plataforma/gotcha-chave-unica-globalmente-parece-endereco.md` diz a mesma coisa pelo outro
lado). Se as duas divergirem, o que se perde é a ordenação no tempo de duas famílias de linha que
nunca são comparadas entre si. A duplicação está declarada no cabeçalho do arquivo, com o motivo, e
o motivo é bom.

**`test/support/postgres.ts` conecta como superusuário, e a separação de papéis não é exercitada por
teste nenhum.** É aceitável **hoje**, e não será no ato de provisionamento. Aceitável porque o que
os 55 testes provam é comportamento do executor, e para isso o papel é indiferente; e porque a
separação foi medida por mim no gate 2 e por mim de novo no gate 3, com resultado registrado. Não é
aceitável como estado permanente por uma razão simples: `db/papeis-e-credencial.md` §1 diz que o que
separa um papel do outro é **privilégio no banco, não disciplina de código**, e uma afirmação que só
um auditor verificou, na mão, em duas datas, é disciplina. O que muda quando houver ato de
provisionamento: o `REVOKE` da §5 e os `GRANT` ganham arquivo, e aí o teste que falta é um só —
criar o papel do executor pelo ato real, e conferir que `DELETE` em `platform.tenants` e leitura no
schema de outro cliente levam `permission denied`. Enquanto esse ato não existir, o
`privilege_unexpected` do `verify` (§13.4) é a única verificação repetível, e ela pergunta pelo
papel **corrente**, não pela separação.

**`provision` que falha no passo 6 deixa cliente registrado e schema criado com parte aplicada —
tem consequência de isolamento?** Não. O schema parcial é um schema **vazio ou incompleto do próprio
cliente**: nenhum dado de outro cliente chega lá, o registro aponta para o schema certo (o
`schema_name` é derivado no banco, e `insertTenant` nem o envia — `registry.ts:257`), e a retomada é
`migrate --schema`, que confronta o registro antes de tudo. A consequência é de **operação**: até a
retomada, o `verify` acusa aquele cliente como divergente da referência, o que está correto e é
exatamente o que se quer ver. O desenho está certo e a declaração dele também.

---

## 5. Notas (sem cenário concreto — não são achados)

- **`platform.executor_events` concentra o diff estrutural de todos os clientes** em `detail`. Está
  dentro de `platform`, a que nenhum papel de aplicação tem `USAGE` (`papeis-e-credencial.md` §1,
  afirmação 2), e cai na classificação da §4 do mesmo arquivo. Vale confirmar que a §4, que fala em
  "saída e artefato do executor", é lida como cobrindo **a tabela** também — hoje ela nomeia a saída.
- **`FORJA_MIGRATOR_PLATFORM_REFERENCE` vem do ambiente** (`config.ts:147-149`). Quem controla o
  ambiente troca o arquivo de referência e neutraliza a perna do `platform` no `verify`. É o mesmo
  nível de confiança da string de conexão, então não é achado; é o tipo de coisa que se descobre
  tarde.
- **Schema `t_verify_*` que não casa o padrão do descartável** fica fora da comparação estrutural
  **e** do confronto com o registro (`commands/verify.ts:116-118`). Declarado na §13.2, e o `CHECK`
  de `platform.tenants` impede que um cliente tenha esse nome. É reportado como resíduo a cada
  rodada, que é o comportamento pedido.
- **`0005` e `0006` não têm achado.** A `0005` fecha o desarme do `SEC-03` pela mesma forma das três
  travas anteriores, e a recusa total do `UPDATE` está justificada com as quatro partes de
  `00-nucleo.md` §12. A `0006` cabe inteira nas colunas da `0004`. As duas passam pelo crivo real, e
  o `INSERT` da `0006` é idempotente contra o gatilho da `0005` (é `INSERT`, e o gatilho é de
  `UPDATE`/`DELETE`/`TRUNCATE`).

---

## 6. Veredito

**O executor está pronto para provisionar um cliente de verdade? Não.**

O que falta, item por item, em ordem de bloqueio:

1. **`EXE-01`** — uma migration aprovada pelo crivo escreve a venda de um cliente no schema de
   outro, medido fim a fim. Bloqueia.
2. **`EXE-02`** — uma migration aprovada pelo crivo remove coluna e desliga a trava do registro de
   clientes, medido. Bloqueia: é perda de dado num sistema forward-only.
3. **`EXE-03`** — a fronteira de schema não vale para cliente de nome comprido, e nada avisa.
   Bloqueia, ou o slug encolhe antes do primeiro `provision` (é a correção mais barata das três).
4. **`EXE-04`** — o único controle automatizado contra drift aprova view que lê outro cliente.
   Bloqueia o uso do `verify` como garantia; não bloqueia o `provision` em si.
5. **`EXE-05`** — costura de teste na raiz de composição, com comentário que descreve o oposto do
   estado atual. Não bloqueia; corrigir antes de mais alguém ler aquele arquivo.
6. **`EXE-06` a `EXE-10`** — não bloqueiam. `EXE-09` e `EXE-10` são texto, e o texto é o que a
   próxima pessoa transcreve.

**O que está sólido, e é a maior parte.** A resolução de alvo (`assertTarget` com `current_schema()`
e profundidade do `search_path`, antes de cada comando no regime não-transacional) é o melhor
mecanismo deste pacote. A citação de identificador no servidor não tem alternativa melhor. A
procedência do nome de schema pelo registro está fechada nos dois comandos. A trava de crivo ausente
existe e funciona. A verificação de namespace é camada honesta, com o que ela não pega escrito no
próprio arquivo. `0005` e `0006` fecham o que o gate anterior abriu.

**Roteamento da correção:**

| Achado | Código (`coder`) | Documento (`arquiteto-dados`) |
|---|---|---|
| `EXE-01` | `src/refusals.ts` | `RECUSAS.md` §11.5 — o alvo é o comando `SET`, não a colocação |
| `EXE-02` | `src/refusals.ts` | — (a §11.2 já diz "uma ação por comando") |
| `EXE-03` | `src/refusals.ts` + `src/target.ts` | `APLICACAO-E-ALVO.md` §10.2 e `RECUSAS.md` §11.3, se o número mudar |
| `EXE-04` | `src/structure-print.ts` | `PROVISION-E-VERIFY.md` §13.3 |
| `EXE-05` | `src/executor.ts`, `test/alvo.test.ts` | — |
| `EXE-06` | `src/refusals.ts` | `RECUSAS.md` §11.2 |
| `EXE-07` | `src/refusals.ts` | — |
| `EXE-08` | `src/sql-text.ts` | `RECUSAS.md` §11.1 item 2, se a escolha for restringir |
| `EXE-09` | — | `PROVISION-E-VERIFY.md` §12 e §13.1, `CONTRATO.md` §14 caso 9 |
| `EXE-10` | — | `PROVISION-E-VERIFY.md` §13.3 |

**Teste de aceite que cada correção deve trazer**, porque nenhum dos quatro `ALTO` seria pego pela
suíte atual: o arquivo do `V4` recusado; `ALTER TABLE` com vírgula recusado; qualificador de slug
máximo recusado; e a view reapontada produzindo diferença no `verify`. Os quatro são casos novos da
§14 — dono: `arquiteto-dados` para numerá-los, `coder` para escrevê-los.

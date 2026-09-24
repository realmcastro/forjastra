# Recusas do carregador — §11 do contrato do executor

> Parte de `db/migrator/CONTRATO.md`. A numeração é global no conjunto (`CONTRATO.md` §0).
> Reescrito em 2026-09-11 na correção do gate de `seguranca` (`MIG-03`): a lista anterior se
> apresentava como mecanização de `migrations.md` §4 e não era. Medido pelo auditor:
> `DROP SCHEMA t_vitima CASCADE;` atravessava a lista inteira e destruía o schema, porque o padrão de
> referência cruzada exigia o ponto do nome qualificado e `DROP SCHEMA t_vitima` não tem ponto.
> Reescrito de novo em 2026-09-11, na reauditoria (`MIG-10`): a lista de permissão classificava o
> comando pelo **começo** e ignorava o resto, e cinco comandos que começam por forma permitida
> copiaram ou expuseram dado de outro cliente. §11.1, §11.2, §11.3, §11.4 e §11.5 mudaram, e a §11.6
> nasceu.
> Reescrito pela terceira vez em 2026-09-11, no terceiro gate (`SEC-01`, `MIG-10` **reincidente**): a
> fronteira de schema da §11.3 comparava texto cru, e caiu com uma aspa e com uma maiúscula. Duas
> formas permitidas, escritas `"t_globex".orders` e `T_GLOBEX.orders`, leram e escreveram no schema de
> outro cliente — medido. §11, §11.1, §11.3, §11.5 e §11.7 mudaram.
> Reescrito pela quarta vez em 2026-09-11, no quarto gate (`EXE-01`, `EXE-02`, `EXE-03`, `EXE-06`,
> `EXE-07`, `EXE-08`): a lista descrevia forma em português e a implementava em prefixo, então cada
> forma tinha uma cauda que ninguém lia. `ALTER TABLE ... ADD COLUMN c integer, DROP COLUMN total`
> passou e a coluna sumiu; `SET LOCAL search_path` dentro de corpo de função passou e a venda de um
> cliente foi gravada no schema de outro. A §11.2 passou a declarar **onde cada forma termina**, a
> §11.5 passou a mirar o comando `SET` em vez da vizinhança de duas palavras, e a §11.7 parou de
> declarar como lacuna duas coisas que estavam cobertas e de omitir as três que não estavam.
> Revisto em 2026-09-11, com a âncora da §11.2 já implementada e 12 ataques medidos: o `coder` achou
> duas formas cuja cauda o texto não decidia — a view, cujo interior vai até o fim do comando, e o
> `RETURNS` de função. As duas ficaram escritas, e a §11.5 ganhou o requisito de mensagem do falso
> positivo dentro de literal.

## 11. O que o carregador recusa, antes de abrir conexão

Toda recusa aborta a **rodada inteira**, com saída `2`, nomeando arquivo e trecho. Nenhuma migration é
aplicada, e nenhuma conexão é aberta **para aplicar**. Recusa nunca é aviso: arquivo recusado não roda
em schema nenhum, e não existe sinalizador que ignore.

Depois da decisão de recusar, e só depois dela, o executor abre uma conexão **só para escrever o fato**
`load_refused` (`CONTRATO.md` §19.4) e a fecha. Isso não afrouxa nada: a decisão já está tomada, nenhum
arquivo roda, e falhar ao escrever a linha não muda o desfecho nem a saída `2` (§19.2). A versão
anterior dizia "nenhuma conexão é aberta" como propriedade de segurança, e ela nunca foi isso — era
rapidez, e custava a única detecção deste sistema que tem um autor humano do outro lado (`SEC-04`).

### 11.1 Como o texto é lido

Antes de qualquer verificação de conteúdo, o carregador:

1. **remove comentários** — `--` até o fim da linha e `/* */`, inclusive aninhados. Sem isso, a prosa
   do cabeçalho reprovaria o próprio arquivo: `platform/0000__ledger.sql` explica em comentário o que a
   inversa dele faria, e explicar uma remoção não é executá-la;
2. **preserva literais de string**, para que texto de `COMMENT ON` continue sendo texto. São dois
   tipos: aspas simples com `''` escapado, e **cifrão com rótulo** (`$fn$ … $fn$`), que é como um corpo
   de função entra no arquivo. Cifrão **sem** rótulo (`$$`) é recusado sempre (§11.5), o que torna a
   varredura não ambígua: o fecho de um literal rotulado é o mesmo rótulo, e não há aninhamento a
   adivinhar. **O rótulo vale em qualquer caixa** (`$BODY$` é rótulo legal, e é o que toda ferramenta
   de banco gera por padrão), e o fecho é o **mesmo texto** do abre, comparado sem dobrar caixa,
   porque para o Postgres `$BODY$` e `$body$` são rótulos diferentes. O reconhecedor anterior exigia
   rótulo minúsculo: `$BODY$` deixava de ser literal, o corpo era partido no `;` interno e a recusa
   saía dizendo que nenhuma forma da §11.2 classificava o pedaço final, o que manda o autor procurar
   o defeito no lugar errado (`EXE-08`);
3. **recusa a aspa dupla** em qualquer posição do que sobrou (§11.5). Sem identificador citado, a
   única variação de grafia que resta é a caixa, e o passo 4 dá conta dela;
4. **normaliza para comparar** — as verificações das §11.2, §11.3 e §11.5 correm sobre uma cópia em
   **minúscula** do comando. O Postgres dobra identificador não citado para minúscula, então
   `T_GLOBEX.orders` e `t_globex.orders` endereçam o mesmo objeto (medido) e só a cópia normalizada
   vê os dois como o mesmo texto. A cópia serve à comparação e a nada mais: a mensagem de recusa cita
   o texto **original**, que é o que o autor procura no arquivo;
5. **separa os comandos** pelo `;` fora de literal;
6. **classifica cada comando pela forma inteira** (§11.2), ancorada nas **duas** pontas: a forma casa
   a partir do primeiro token e declara onde o comando termina. Texto que sobre entre o último token
   que a forma nomeia e o fim do comando é recusa, sem que a lista precise dizer o que ele era.

Os itens 3 e 4 são a correção do `SEC-01`, e existem porque a versão anterior comparava texto cru: dois
comandos que casavam formas permitidas — uma view com `security_invoker` e um `ALTER TABLE` — leram e
escreveram no schema de outro cliente só por trocarem a grafia do qualificador. Os quatro endereçam a
mesma tabela, e cada metade da correção sozinha deixa passar metade deles — medido em 2026-09-11, com o
padrão literal da §11.3:

| Regra | `t_globex.orders` | `"t_globex".orders` | `T_GLOBEX.orders` | `"T_globex" . orders` |
|---|---|---|---|---|
| texto cru (a anterior) | recusa | passa | passa | passa |
| só normalização | recusa | passa | recusa | passa |
| só recusa de aspa | passa | recusa | passa | recusa |
| **as duas (esta)** | **recusa** | **recusa** | **recusa** | **recusa** |

É por isso que são as duas e não uma: a normalização é obrigatória porque `T_GLOBEX` não tem aspa para
recusar, e a recusa da aspa é obrigatória porque a aspa de fecho entra entre o identificador e o ponto,
onde nenhuma normalização de caixa ajuda.

O item 6 é a correção do `MIG-10`, e a âncora de fim é a do `EXE-02`. As duas metades nasceram do
mesmo defeito, um ano-luz de distância uma da outra no texto e a um caractere de distância no efeito.
Classificar pelo começo permitia que `CREATE TABLE IF NOT EXISTS copia AS SELECT * FROM
t_globex.orders` fosse lido como "cria tabela" e depositasse a linha de outro cliente dentro do alvo,
com a criação acontecendo **dentro** do schema alvo — invisível para a verificação de namespace da
§10.4, que procura objeto novo fora do alvo. Classificar sem âncora de fim permitia que
`ALTER TABLE orders ADD COLUMN IF NOT EXISTS c integer, DROP COLUMN total` fosse lido como "acrescenta
coluna": a §11.2 dizia "**uma** ação por comando" e nada no mecanismo lia a vírgula. Medido: a coluna
`total` sumiu, e o mesmo comando sobre `platform.tenants` desligou, dentro de uma migration aprovada,
o gatilho que a `0002` existe para ser.

Duas consequências de leitura, e as duas já morderam:

- **Falso positivo é recusa, e a recusa é o lado seguro.** Um literal que contenha a grafia de um
  comando proibido reprova o arquivo, e o autor reescreve o literal. O inverso — deixar passar por
  elegância de análise — é o defeito que esta seção existe para não ter.
- **Comentário dentro de um corpo de função não é comentário do arquivo.** O corpo é literal, e o
  passo 1 não entra em literal: uma nota escrita ali é texto do corpo e passa pelas verificações de
  forma. Nota sobre o corpo vai **acima** da função, e `platform/0003__ledger_append_only.sql` leva
  essa nota justamente por ter tropeçado nisto.

### 11.2 Lista de permissão: cada forma declara onde termina

Comando que não case uma destas formas **inteiras** é recusado. A lista é curta de propósito:
ampliá-la é mudança **deste contrato**, e passa por revisão.

Três regras valem para todas as formas, e é a segunda que mudou no quarto gate:

1. **Cabeça fechada.** A forma casa a partir do primeiro token do comando.
2. **Cauda fechada.** A forma declara **onde o comando termina**, e o casamento é ancorado no fim.
   O que sobrar entre o último token que a forma nomeia e o fim do comando é recusa — a lista não
   precisa saber o que era aquilo, e é justamente por não precisar que ela para de perder a próxima
   palavra. `DROP COLUMN`, `DISABLE TRIGGER`, `OWNER TO` e `SET search_path` como atributo de função
   morrem aqui **sem estarem escritos em lugar nenhum**.
3. **Interior declarado.** Quatro formas têm um interior que não se enumera: a lista de colunas de
   `CREATE TABLE`, a lista de colunas de `CREATE INDEX`, a consulta de uma view e o corpo de uma
   função. Para elas a forma declara o interior como **não analisado por gramática**, e nomeia o que
   ainda corre lá dentro: a §11.3, a §11.5, e a recusa de `SELECT` onde ela vale. Nada além disso
   corre, e o corpo de função é o único interior onde o texto deixa de ser SQL — a §11.7 item 1 diz
   o que assume dali em diante.

**Uma dessas formas tem interior terminal, e é a view**: o último token que ela nomeia é o `AS`, e o
interior vai dali até o fim do comando. Então a regra 2 não se aplica a ela, e não por lacuna — achar
onde uma consulta termina exige o parser que a §11.7 item 2 declara não existir. A âncora da view é
toda do lado da cabeça, e é disso que a obrigatoriedade do `security_invoker` depende.

| Forma permitida | Onde o comando termina | Interior |
|---|---|---|
| `CREATE SCHEMA IF NOT EXISTS platform` | no nome, e o nome só pode ser `platform` | — |
| `CREATE TABLE IF NOT EXISTS <nome> ( … )` | no parêntese que fecha a lista aberta logo depois do nome | não enumerado. `SELECT` é recusa, o que dispensa enumerar `AS SELECT`, `AS TABLE`, `PARTITION OF` e `OF <tipo>` |
| `CREATE [UNIQUE] INDEX [CONCURRENTLY] IF NOT EXISTS <nome> ON <tabela> [USING <metodo>] ( … )` | no parêntese que fecha a lista de colunas | não enumerado. `SELECT` é recusa. `CONCURRENTLY` tem que concordar com a diretiva `transacional` (§4) |
| `CREATE DOMAIN <nome> AS <tipo> CONSTRAINT <nome> CHECK ( … )` | no parêntese que fecha o `CHECK` | não enumerado. `SELECT` é recusa. `<tipo>` é um identificador só, sem modificador. Não tem `IF NOT EXISTS`, e a retomada vem da transação (`CONTRATO.md` §17.2, forma 3) |
| `CREATE SEQUENCE IF NOT EXISTS <nome>` | no nome | — |
| `CREATE OR REPLACE VIEW <nome> WITH (security_invoker = true) AS <consulta>` | **no fim do comando**: o interior é terminal, e a opção tem que vir imediatamente depois do nome | não enumerado, e a consulta não pode ser vazia. A opção é **obrigatória**, e a razão está na §11.7 item 5. Consulta é legítima aqui; quem faz o isolamento é a §11.3 |
| `CREATE OR REPLACE FUNCTION <nome>(<args>) RETURNS <tipo>`, mais **exatamente** as cláusulas `LANGUAGE <plpgsql\|sql>` e `AS <literal de cifrão rotulado>`, em qualquer ordem | na última das duas cláusulas | o corpo é literal e **não é analisado** além da §11.3 e da §11.5. `<tipo>` é **um identificador só**: `RETURNS TABLE ( … )` e `RETURNS SETOF …` são recusa |
| `CREATE [OR REPLACE] TRIGGER … EXECUTE FUNCTION <nome>(…)` | no parêntese que fecha a chamada | `SELECT` é recusa. `OR REPLACE` é a forma idempotente (§17) |
| `COMMENT ON <objeto> IS <literal>` | no literal | `SELECT` é recusa |
| `INSERT INTO <nome> ( <colunas> ) VALUES <tuplas> ON CONFLICT DO NOTHING` | em `DO NOTHING` | só literal nas tuplas. `SELECT` e `RETURNING` são recusa: seed é valor literal, nunca consulta |
| `ALTER TABLE <nome> <uma ação>` | no fim da ação, e **vírgula fora de parêntese é recusa** | a ação é `ADD COLUMN IF NOT EXISTS`, `ADD CONSTRAINT`, `VALIDATE CONSTRAINT`, `ALTER COLUMN … SET NOT NULL` ou `ALTER COLUMN … SET DEFAULT`. `USING` é recusa (troca de tipo), `SELECT` é recusa |

Seis decisões desta tabela que não são detalhe de escrita:

- **`CREATE SCHEMA` só cria `platform`.** A versão anterior dizia "só em alvo `platform`" e conferia o
  alvo da forma, nunca o **nome** que ela criava: uma migration de `platform` com
  `CREATE SCHEMA IF NOT EXISTS t_globex` passava e criava um schema de cliente sem linha no registro,
  que `provision` depois recusa e nenhum agent pode desfazer, porque desfazer é `DROP SCHEMA`
  (`EXE-07`). Schema de cliente nasce em `provision` (§10.1), e a única migration que cria schema é a
  `0000`. O dia em que existir um terceiro schema de controle, isto é mudança de contrato, com
  revisão — que é o preço certo para uma decisão desse tamanho.
- **`LANGUAGE` é lista fechada: `plpgsql` ou `sql`.** `LANGUAGE c` e `LANGUAGE plpython3u` passavam a
  forma anterior (`EXE-06`). No banco as duas exigem superusuário, e o executor não deve ser
  superusuário (`db/papeis-e-credencial.md` §1) — então a barreira efetiva existia e é por isso que o
  achado era baixo. O que não existia era a recusa no arquivo, no dia em que alguém rodar o executor
  com credencial administrativa "só para provisionar o primeiro cliente".
- **A cauda da forma de função é o que recusa `SET` como atributo.** `CREATE FUNCTION … SET
  search_path = t_vitima` é cláusula legal do Postgres e fixa o alvo da função no schema de outro
  cliente sem uma linha dentro do corpo. Medido em 2026-09-11, PostgreSQL 16.15: um gatilho assim
  gravou a linha no schema alheio, com o corpo escrevendo `INSERT INTO orders2` sem qualificador
  nenhum. A recusa da palavra `set` (§11.5) também o pega; o ponto é que a cauda o pegaria sozinha, e
  é assim que a próxima cláusula que ninguém imaginou morre. Ela não está proibida em lugar nenhum desta seção: ela é
  recusada porque a forma termina em `LANGUAGE`/`AS` e ela vem depois. O mesmo vale para
  `SECURITY DEFINER`, `COST`, `STRICT`, `IMMUTABLE`, e para o corpo padrão `BEGIN ATOMIC` do
  PostgreSQL 14, que não tem literal de cifrão para casar.
- **`WHERE` de índice parcial fica de fora, e isso é escolha.** Nenhum arquivo de hoje precisa, e a
  lista não cresce por antecipação. O primeiro índice parcial vem com mudança deste contrato, que é
  uma revisão e não uma surpresa.
- **`WITH CHECK OPTION` passa, por ser interior, não por estar autorizado.** A pergunta veio de quem
  implementou: a forma deveria recusar texto depois da consulta? Não — "depois da consulta" não é
  ponto que se ache sem parser, e enumerar a cláusula para recusá-la seria a lista de palavra
  proibida de novo, na forma em que ela já falhou quatro vezes. O que ela faz é restringir escrita
  através da view; não há por onde ampliar alcance. O que a forma ancora é a cabeça: nome, opção
  colada nele, `AS`, consulta não vazia — e assim um segundo `WITH (…)` antes do `AS` não cabe.
- **`RETURNS TABLE ( … )` e `RETURNS SETOF` são recusa**, e nenhum arquivo de hoje usa. Vale a regra
  do índice parcial, e há um motivo a mais: função que devolve conjunto é superfície de consulta, e a
  superfície sancionada aqui é a **view** — obrigada a `security_invoker`, com o corpo legível no
  catálogo. A função põe a mesma consulta no interior que nenhum texto fecha (§11.7 item 1). Ampliar
  a forma é mudança deste contrato, e a revisão precisa responder por que uma view não serve.

**`CREATE DOMAIN` entrou em 2026-09-23** (T-0022), com os três domínios de valor da primeira migration
de cliente (`db/convencoes.md` §10). A forma é a mais estreita que atende: o tipo base sem modificador,
porque `numeric(14,2)` como base de domínio é o arredondamento silencioso que o domínio existe para
evitar; uma restrição só, nomeada; e nada depois dela, então `NOT NULL`, `DEFAULT` e `COLLATE` morrem na
cauda. Sem `IF NOT EXISTS` no Postgres, a guarda é a transação, como a do `ADD CONSTRAINT`, e a guarda
que pula em silêncio seria pior: ela aceitaria um domínio pré-existente com outro envelope.

O que fica de fora por não estar na lista, e é bom que fique explícito: `UPDATE` e `DELETE` (backfill é
processo em lotes, fora da migration — `migrations.md` §6), `GRANT` e `REVOKE` (privilégio é
`db/papeis-e-credencial.md`, não migration), `ALTER TYPE`, `ALTER SCHEMA`, `ALTER … OWNER TO`,
`CREATE/ALTER/DROP ROLE`, `CREATE EXTENSION`, `COPY`, e **todo** `DROP`, de qualquer objeto.

A obrigatoriedade de `security_invoker` **exige** PostgreSQL 15: em 14 o servidor recusa a opção com
*"unrecognized parameter"*, medido, e uma migration com view não aplicaria. Ela era quem fixava o piso
até 2026-09-11, e não é mais — hoje ele é **16**, pelo `CREATEROLE` do executor (`db/convencoes.md` §9).

**Por que `SELECT` é recusa em quase toda forma:** é ele que transforma um comando de estrutura em um
comando de **dado**, e dado que entra numa migration só pode ter vindo de algum lugar. Os dois lugares
onde uma consulta é legítima — o corpo de uma view e o de uma função — são justamente os dois em que o
texto fica gravado e legível no catálogo depois, e onde a §11.3 continua valendo.

**O que a cauda fechada resolve, e o que ela não resolve.** Ela resolve a classe inteira em que o
comando é SQL: enquanto a forma nomear onde termina, palavra nova depois do fim não passa, e não
existe próxima rodada de "achamos mais uma". Ela não resolve o **interior** que não é enumerável, e um
dos quatro não é nem SQL: o corpo de uma função é plpgsql, e classificá-lo exigiria um parser que a
§11.7 item 2 declara não existir. Ali a lista volta a ser palavra proibida, e palavra proibida é
incompleta por construção — medido três rodadas seguidas. O que fecha aquele interior não é texto:
é o privilégio do papel que **executa** o corpo, e o desenho está em `db/papeis-e-credencial.md` §6.

### 11.3 Fronteira de schema: o mecanismo, agora escrito dos dois lados

Antes desta revisão, o lado `platform` tinha padrão escrito e o lado `tenant` tinha uma frase sem
mecanismo. A assimetria era o defeito: quem implementasse o carregador inventaria o padrão do lado que
falta, e o alvo natural — "identificador seguido de ponto" — reprovaria `o.total` de qualquer view e de
qualquer alias, o que pressiona a afrouxar exatamente o lado que protege o isolamento.

O conjunto de nomes de schema que podem existir neste banco é **fechado**: `platform`, `public`,
`information_schema`, os `pg_*` do sistema e os `t_*` de cliente. Migration nenhuma cria outro
(`CREATE SCHEMA` só existe em alvo `platform`, e schema de cliente nasce em `provision`). Então a
recusa é por **lista de qualificadores**, não por "qualquer coisa seguida de ponto", e alias escapa por
construção:

| Alvo | Qualificador recusado | O que continua passando |
|---|---|---|
| `tenant` | `\b(platform\|public\|information_schema\|pg_[a-z0-9_]*\|t_[a-z0-9_]*)\s*\.` | `o.total`, `venda.id`, todo alias, todo nome não qualificado |
| `platform` | `\b(public\|information_schema\|pg_[a-z0-9_]*\|t_[a-z0-9_]*)\s*\.` | `platform.`, que é o próprio alvo e é o que as migrations de lá qualificam literalmente |

**O padrão do `t_` não escreve comprimento, e isso é a correção do `EXE-03`.** Ele escrevia
`t_[a-z0-9_]{1,40}` enquanto a borda que valida o slug admitia 41 caracteres, e as duas metades não
tinham nada que as ligasse: nem constante comum, nem teste. Medido: uma migration de alvo `tenant`
com `… FROM t_<41 caracteres>.orders` passava o crivo e, aplicada, a view devolveu a linha do outro
cliente; com 40 caracteres, o mesmo arquivo era recusado. A fronteira valia para quase todo cliente e
deixava de valer, sem sintoma, para o cliente de nome comprido.

A correção tem dois lados, e nenhum deles é escrever o mesmo número em dois arquivos com mais
cuidado. O teto do slug encolheu para 40, no banco e na borda (`0007__tenant_slug_length.sql`,
§10.2), e **o padrão parou de ter número**: `t_[a-z0-9_]*` não tem com o que divergir. O `pg_` já era
escrito assim, então isto é a regra da casa, não uma exceção. O preço é falso positivo em um
identificador chamado `t_qualquer_coisa` seguido de ponto, que nenhuma convenção nossa produz — o
prefixo `t_` é de schema — e falso positivo é recusa, que é o lado seguro (§11.1).

**Os dois padrões correm sobre a cópia normalizada da §11.1 item 4, nunca sobre o texto cru**, e é essa
frase que fecha o `SEC-01`. Eles são escritos só em minúscula porque a normalização já aconteceu;
aplicá-los ao texto original devolve exatamente o buraco medido, em que `T_GLOBEX.orders` passa por não
casar caractere a caractere. A outra metade da correção é a §11.5: sem aspa dupla no arquivo, não existe
`"t_globex"` para a fronteira de identificador do padrão perder.

Quatro coisas que fazem parte do mecanismo e não são detalhe:

- **A busca corre sobre o comando inteiro, literais inclusive.** Um corpo de função entre cifrões é
  código, e é o caminho mais óbvio para alcançar outro schema depois que a §11.2 apertou. O preço é
  que um `COMMENT ON … IS 'ver t_globex.orders'` também reprova — falso positivo, recusa, autor
  reescreve (§11.1).
- **`pg_` entra na lista dos dois lados.** Com `search_path` de um schema só, `pg_catalog` continua
  implicitamente resolvido, então qualificar nunca é necessário — e o que `pg_` qualificado faz numa
  migration é leitura de catálogo, que é trabalho do executor, não do arquivo.
- **A fronteira de identificador e o ponto fazem parte do padrão.** Procurar o par de caracteres solto
  reprovaria `octet_length`, `current_setting` e `statement_timeout`, e o primeiro arquivo do sistema
  já usa o primeiro deles.
- **Recusar é a resposta, mesmo quando o qualificador é o do próprio alvo escrito de outro jeito.** O
  padrão não tenta adivinhar intenção, e não existe caso legítimo de uma migration de cliente nomear
  schema nenhum: o alvo é resolvido pelo executor (§10.3), e o arquivo escreve nome não qualificado.

### 11.4 Recusas de arquivo e de cabeçalho

- não tem as três diretivas obrigatórias, ou tem diretiva desconhecida (§4);
- `reversivel` sem justificativa depois do valor;
- `modulo` fora de `^[A-Z]{3}$`, ou em desacordo com o nome do diretório (§4);
- cabeçalho que contradiz o diretório;
- contém `CR` ou não é UTF-8 válido (§3);
- é marcado `transacional: nao` e contém comando que não exija isso;
- é marcado `transacional: sim` e contém `CONCURRENTLY`;
- é marcado `transacional: nao` e contém `ALTER TABLE … ADD CONSTRAINT`. Essa forma não tem guarda de
  existência, e no regime transacional quem garante a retomada é o `ROLLBACK` (§17): sem transação,
  a segunda tentativa morre em "constraint already exists" e a rodada não converge;
- tem `cria-indice` declarando nome que não aparece no corpo, ou cria com `CONCURRENTLY` um índice que
  não está declarado (§8 depende dessa lista para saber o que limpar).

### 11.5 Formas proibidas em qualquer posição do arquivo

Não é sobre o começo do comando, é sobre a presença — depois da remoção de comentários (§11.1), e
dentro de literal também:

- **aspa dupla** (`"`) em qualquer posição, inclusive dentro de literal — é a correção do `SEC-01`, e
  o que ela custa está logo abaixo;
- **cifrão sem rótulo** (`$$`) — o rótulo é o que torna a varredura de literal não ambígua, e exigi-lo
  custa quatro caracteres ao autor;
- **`DO`** abrindo comando, e qualquer bloco anônimo — SQL dinâmico dentro do arquivo desfaz toda a
  análise desta seção, e é a concatenação que `00-nucleo.md` §8 proíbe;
- **`EXECUTE`**, exceto quando seguido imediatamente de `FUNCTION` ou `PROCEDURE`, que é a única
  sintaxe possível de `CREATE TRIGGER`. A recusa é do `EXECUTE` que executa texto; a palavra na
  cláusula do gatilho não executa nada;
- **`format(`** — mesma razão, inclusive dentro de corpo de função. `RAISE` tem marcadores próprios e
  não precisa dela;
- **`SECURITY DEFINER`** — função que roda com o papel do dono é escalonamento de privilégio nascido
  em migration;
- **`COMMIT`, `ROLLBACK`, `RESET`**, e **`BEGIN` abrindo um comando** — disputariam o controle de
  sessão e de transação com o executor (§7, §10.3). `BEGIN` dentro de um corpo de função é sintaxe de
  bloco, não transação, e por isso a recusa é do `BEGIN` que **abre comando**, não da palavra;
- **o comando `SET`, seja qual for o que venha depois dele.** A palavra `set` só é aceita em três
  vizinhanças, e são as três em que ela não é comando: `set not null`, `set default` e `set null`
  (ação de `ALTER TABLE` e ação de chave estrangeira). Qualquer outra coisa depois de `set` é recusa.
  Esta é a correção do `EXE-01`, e a forma dela importa mais que o achado. A regra anterior era
  `SET search_path` e `SET ROLE`, implementadas como duas palavras coladas, e a declaração dizia
  "em qualquer posição": `SET LOCAL search_path`, `SET SESSION search_path` e `SET LOCAL ROLE` têm uma
  palavra no meio e atravessavam as duas. Medido fim a fim: uma migration de alvo `tenant` com três
  comandos e **nenhum qualificador de schema em lugar nenhum** foi aprovada, e depois de aplicada o
  `INSERT` de uma venda gravou a linha no schema de outro cliente. Enumerar `local` e `session` teria
  fechado aquele arquivo e deixado a classe aberta; recusar o comando fecha a classe;
- **`set_config(`** em qualquer posição, inclusive dentro de corpo de função. Ele faz, com sintaxe de
  chamada de função, exatamente o que o comando `SET` faz, e por isso nenhuma regra sobre a palavra
  `set` o alcança: `set_config` é um identificador só. Medido em 2026-09-11, PostgreSQL 16.15: um
  gatilho cujo corpo é `PERFORM set_config('search_path', 't_vitima', true);` seguido de
  `INSERT INTO orders …` grava no schema de outro cliente, sem a palavra `SET`, sem `EXECUTE`, sem
  `format(` e sem um ponto qualificador para a §11.3 ver — a `'t_vitima'` é literal e não tem ponto.
  Esta linha é o quarto buraco da mesma classe em três rodadas, e é a prova de que fechar o corpo de
  função por palavra proibida é perseguir o próximo nome: veja a §11.7 item 1;
- **`COPY`, `pg_read_file`, `pg_ls_dir`, `lo_import`, `lo_export`** — alcance ao sistema de arquivos do
  servidor a partir de um arquivo de migration.

**As recusas desta seção alcançam literal, e a saída do falso positivo é a mensagem, não o
afrouxamento.** Perguntado em 2026-09-11: valeria restringir a recusa do comando `SET` ao texto fora
de literal, já que um `COMMENT ON … IS '… set …'` reprova o arquivo? Não. Corpo de função **é** um
literal, e foi de dentro dele que vieram os quatro últimos escapes; isentar literal só seria seguro
enquanto valessem, ao mesmo tempo, a exigência de cifrão rotulado no corpo (§11.2) e a recusa de
`EXECUTE`, `format(` e `DO` — quatro elos, e nenhum deles avisa o outro no dia em que mudar. O custo
fica como está: falso positivo é recusa (§11.1), o autor reescreve o texto. O que **é** exigido é que
a mensagem diga que a ocorrência está **dentro de um literal**, com o trecho, senão o autor procura um
comando que o arquivo dele não tem. Nenhum dos oito arquivos de hoje esbarra nisso, e a grafia
realista em prosa nossa seria a abreviação de mês, que não aparece porque data é `AAAA-MM-DD`
(`00-nucleo.md` §8).

**O que a recusa da aspa dupla torna impossível escrever**, e é curto de propósito:

| Deixa de caber num arquivo de migration | Sobra |
|---|---|
| identificador citado de qualquer tipo: `"t_globex".orders`, `"Pedidos"`, `"order id"` | nome em `snake_case` minúsculo, que é a convenção de `db/convencoes.md` para tudo que nasce aqui |
| nome de colação citado: `COLLATE "C"`, `COLLATE "pt-BR"`, em corpo de view, expressão de índice ou `CHECK` | nada: **esta é a perda real**, e o dia em que uma colação explícita for necessária, ampliar a lista é mudança deste contrato, com revisão (§11.2) |
| o caractere `"` dentro de texto de `COMMENT ON`, de `RAISE` e de `CHECK` | aspa simples duplicada, ou o texto sem ela — os sete arquivos de hoje passam sem tocar em nenhum |

A necessidade que a aspa atende é **escrever um identificador que a sintaxe crua não aceita**. Ela é
real, e num arquivo de migration **nosso** ela não aparece: todo identificador daqui é escolhido por
nós, em minúsculo, sem espaço e sem palavra reservada. O mecanismo recusado é a análise que tentaria
entender a citação — e ela é ruim porque isto não é um parser de SQL (§11.7 item 2), então cada grafia
nova vira uma correção depois de alguém medir a fuga, que é o histórico desta seção, duas
auditorias seguidas. O
mecanismo novo é a recusa do caractere, que elimina a classe inteira em vez de perseguir grafia, e se
prova por construção: sem `"` no arquivo, não existe identificador citado para o padrão da §11.3 perder.
Custa quatro casos de escrita, um só deles com perda de verdade, e a §11.1 já escolheu esse lado quando
declarou falso positivo como recusa.

Medido em 2026-09-11, com o texto dos sete arquivos de `db/migrations/platform/` depois da remoção de
comentários: nenhum contém aspa dupla, e nenhum é recusado pela regra nova. As aspas que aparecem no
`grep` cru estão todas em comentário, que o passo 1 remove antes.

### 11.6 Recusa de rodada: módulo sem registro de ativação

Enquanto não existir em `platform` o registro de módulo ativo por cliente (`CONTRATO.md` §2.3), a
presença de **qualquer** arquivo em `db/migrations/modules/**` recusa a rodada inteira, com saída `2`,
nomeando os arquivos encontrados.

Por quê: sem o registro, o executor não tem como saber em que cliente aplicar aquela migration, e as
três saídas de quem implementa são piores que parar — tratar todo cliente como sem módulo (silencioso,
e faz o `verify` aprovar cliente cujas tabelas de módulo ninguém comparou), deduzir o módulo pela
existência de tabela (proibido por `dados.md` §5), ou escolher por conta própria. A recusa transforma
uma decisão de quem implementa numa parada visível no dia em que a primeira migration de módulo for
escrita. Hoje o diretório não existe e nada é bloqueado.

### 11.7 O que esta lista **não** pega

Declarado porque a versão anterior criava a expectativa contrária, e expectativa errada sobre defesa é
pior que defesa ausente. Esta seção foi reescrita no quarto gate porque a declaração anterior estava
**invertida**: ela nomeava como lacuna duas coisas que o auditor mediu e achou cobertas (espaçamento
entre tokens, que a normalização colapsa; comentário no meio de comando, que o passo 1 troca por
espaço), e não nomeava nenhuma das três que estavam abertas.

1. **O corpo de uma função não é fechável por texto, e é aqui que esta lista termina.** Sem `EXECUTE`,
   sem `format(`, sem `set_config(`, sem o comando `SET` e sem referência qualificada, o corpo é
   estático e legível na revisão — mas quem o lê é a **revisão**, não o carregador. A diferença entre
   este item e os outros é de espécie: as demais lacunas são de grafia ou de forma, e uma gramática
   ancorada nas duas pontas as fecha por classe (§11.2). O corpo não é SQL, é plpgsql, e fechá-lo por
   gramática exigiria um parser de outra linguagem dentro de um crivo que o item 2 declara não ser
   nem parser de SQL. O que sobrou ali é lista de palavra proibida, e lista de palavra proibida é
   incompleta por construção: três rodadas de auditoria, três palavras novas (`DROP SCHEMA` sem
   ponto, o identificador citado, o comando `SET` com qualificador no meio), mais a quarta que este
   documento escreve antes de alguém medir (`set_config`). A curva não fecha somando a quinta.
   **Quem fecha aquele interior é o privilégio do papel que executa o corpo**, e não este arquivo:
   o desenho, com a medida das duas pernas, está em `db/papeis-e-credencial.md` §6. A consequência
   operacional, dita aqui para não ficar só lá: enquanto o papel de aplicação for um só para todos os
   clientes, um gatilho escrito por engano num arquivo de `tenant` atravessa schema em produção, e
   nada neste arquivo o impede.
2. **Isto é análise de texto, não análise sintática de SQL.** Não há parser. O que a §11.2 passou a
   ter é gramática por forma, ancorada nas duas pontas, que é o quanto se consegue sem um: cada forma
   nomeia a própria cabeça, a própria cauda e o próprio interior, e o que não coube é recusa. Isso
   fecha classe, não instância — `DROP COLUMN` depois da vírgula e `SET search_path` como atributo de
   função morrem sem estarem escritos em lugar nenhum. **O que continua não coberto**, e agora está
   escrito: o **interior** das quatro formas que têm interior (item 1 e item 6), e qualquer grafia que
   faça o próprio delimitador ser lido errado — o `;` dentro de literal, o rótulo de cifrão, o
   parêntese de fecho. As duas grafias conhecidas de identificador foram tratadas na leitura, não no
   desempate: caixa, pela normalização (§11.1 item 4), e citação, pela recusa do caractere (§11.5).
3. **Nada aqui limita o que o papel do banco pode fazer.** Um arquivo que passe pela lista e um papel
   com privilégio amplo continuam podendo mais do que deveriam. A fronteira de privilégio é
   `db/papeis-e-credencial.md` §6. Até o quarto gate esta linha dizia que as duas são "independentes",
   e isso lia como se uma dispensasse a outra: elas são **as duas camadas**, e cada uma pega o que a
   outra não pega. Esta recusa falha **cedo** — na leitura do arquivo, antes de qualquer conexão, com
   o defeito nomeado e o arquivo inteiro barrado em todos os schemas. O privilégio falha **tarde** —
   no instante da execução, com um erro que não diz qual arquivo o causou. Trocar uma pela outra
   troca um defeito por outro; é por isso que são duas.
4. **O adversário.** Quem escreve uma migration tem acesso de escrita ao repositório e, provavelmente,
   à revisão. Esta lista existe para o **erro honesto** — alguém escrevendo DDL de limpeza, que é o
   caso mais provável de todos — e a defesa contra o adversário continua sendo a revisão humana antes
   do commit, mais o privilégio do papel.
5. **View executa com o privilégio de quem a criou, e quem cria é o executor.** É por isso que
   `security_invoker = true` é obrigatório na §11.2: sem ele, uma view no schema de um cliente
   emprestaria o alcance do executor a qualquer papel que a selecione, e o alcance do executor é todos
   os schemas. A §11.3 já impede que o corpo da view nomeie outro schema; a opção fecha o caso em que
   o corpo passa a alcançar mais depois, por objeto recriado.
6. **Expressão dentro de comando permitido.** `DEFAULT`, `CHECK` e expressão de índice podem chamar
   função, e a função pode ter sido criada em migration anterior. A §11.3 cobre a referência
   qualificada; o resto é revisão.

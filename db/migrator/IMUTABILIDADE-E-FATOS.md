# Imutabilidade e fatos — §18 e §19 do contrato do executor

> Parte de `db/migrator/CONTRATO.md`. A numeração é global no conjunto (`CONTRATO.md` §0).
> Nasceu em 2026-09-11, na correção da reauditoria de `seguranca`
> (`docs/auditorias/2026-09-11-executor-e-schema-platform-reauditoria.md`): `MIG-09` (a linha do
> registro de clientes era declarada imutável e não era) e `MIG-15` (as duas detecções que o executor
> existe para tornar possíveis não viravam fato nenhum).
> Revisto em 2026-09-11, no terceiro gate: `SEC-02` (desligar o gatilho era o escape mais barato e o
> único que nenhum controle enxergava), `SEC-03` (a tabela de domínio sem trava desarmava a captura
> inteira com um `DELETE`) e `SEC-04` (a recusa do carregador não virava fato). Mudaram a §18.1, a
> §18.2 e a §19.1; a §19.4 nasceu.
> Autor: `arquiteto-dados` · T-0009.

## 18. O que o `platform` recusa alterar

Duas tabelas do schema de controle declaravam imutabilidade em `COMMENT ON TABLE` e não tinham trava
nenhuma. Uma delas foi medida pelo gate, com a credencial do executor e dois comandos:

```sql
DELETE FROM platform.tenants WHERE slug='globex';
UPDATE platform.tenants SET slug='globex' WHERE slug='acme';
```

Depois disso o `tenant_id` do `acme` resolve para `t_globex`, e o auditor leu o dado de lá. O
`created_at` não muda, então a linha não carrega sinal de ter mudado; `migrate` não vê drift, porque o
schema existe e está registrado; e `verify` compara **estrutura**, que continua certa. É o invariante 1
do `CLAUDE.md` §7 caindo por uma porta que nenhuma verificação do sistema olhava.

### 18.1 As quatro travas, e o que cada uma cobre

| Tabela | Recusa | Deixa passar | Onde |
|---|---|---|---|
| `platform.tenants` | `UPDATE`, `DELETE`, `TRUNCATE` | `INSERT` (é o que `provision` faz) | `0002`, gatilho de comando |
| `platform.schema_migrations` | `DELETE`, `TRUNCATE`, e toda reescrita | `INSERT`, e **uma** atualização: `applied_at` de nulo para preenchido, com as demais colunas intactas | `0003` |
| `platform.executor_events` | `UPDATE`, `DELETE`, `TRUNCATE` | `INSERT` | `0004`, mesma função da `0002` |
| `platform.executor_event_kinds` | `UPDATE`, `DELETE`, `TRUNCATE` | `INSERT`, que é como um código novo entra, por migration | `0005`, mesma função da `0002` |

A atualização que o ledger deixa passar é a do passo 5 da §8: a migration não-transacional grava a
linha "em voo" antes do corpo e a conclui depois. É a única atualização que o executor emite no ledger
em todo o desenho, e por isso a trava pode ser tão apertada. `duration_ms` não entra na condição
porque `schema_migrations_completion_check` já o amarra a `applied_at` — testá-lo no gatilho seria uma
segunda verdade sobre a mesma regra.

**Gatilho de comando, e não de linha**, nas travas de recusa total, por três razões medidas: `TRUNCATE`
só admite gatilho de comando; um `DELETE` que não casa linha nenhuma não dispara gatilho de linha e
passaria sem recusa; e a recusa não precisa ler `OLD` nem `NEW`, porque nenhuma mutação é legítima. A
trava do ledger, que precisa comparar `OLD` com `NEW`, é de linha na parte do `UPDATE` e de comando na
parte da remoção.

### 18.2 O que a trava não alcança, medido

1. **O dono da tabela desliga o gatilho.** `ALTER TABLE ... DISABLE TRIGGER` é aceito do dono, e depois
   dele o `DELETE` passa — medido em 2026-09-11.
2. **O superusuário desliga todos.** `session_replication_role = 'replica'`. Medido: o papel do
   executor leva `permission denied to set parameter`, então esse caminho exige superusuário.
3. **O `REVOKE` do §5 de `db/papeis-e-credencial.md` também não é absoluto.** Medido: revogar
   `UPDATE, DELETE, TRUNCATE` do próprio dono funciona e bloqueia mesmo com o gatilho desligado — e o
   dono consegue devolver o privilégio a si mesmo com um `GRANT`.

A quarta trava, a da `0005`, nasceu no terceiro gate e por um caminho que as três primeiras não cobriam:
o domínio de tipos de evento não tinha gatilho, e um `DELETE` de código ali desarmava para sempre a
captura daquele tipo, com a rodada seguinte se comportando exatamente como antes (`SEC-03`, medido). O
`UPDATE` do `code` desarma igual, medido no mesmo dia, e é por isso que a trava recusa as três operações
e não só a remoção.

**A frase "atos deliberados e nomeáveis" era metade verdadeira, e a metade que faltava era a que
importa.** O gate mediu (`SEC-02`): `ALTER TABLE ... DISABLE TRIGGER` é o ato 1, e o catálogo guardava
`tgenabled = 'D'` sem que nada olhasse — a impressão de estrutura da §13.3 saía **byte a byte idêntica**
à referência versionada, então `verify` aprovava. Não existia quem nomeasse. O contraste era o que
condenava o desenho: o escape mais largo, trocar o corpo de `reject_mutation` e neutralizar as quatro
tabelas de uma vez, o `md5` da linha `funcao` **detectava**. O controle pegava o caro e perdia o barato.

Desde a correção, a impressão carrega `tgenabled` e o ato 1 produz uma linha divergente no `verify`
(medido nos dois sentidos). O ato 3, o `GRANT` que devolve privilégio revogado, virou pergunta da §13.4.
O ato 2, o superusuário com `session_replication_role`, continua sem detecção **e continua declarado**:
ele não deixa marca no catálogo, e quem o executa já podia tudo.

Com isso, o que as quatro travas entregam é que **corromper o registro deixou de ser um comando e passou
a ser três atos deliberados, dois deles com um lugar que os acusa depois**. Elas não entregam
impossibilidade para quem tem a credencial e decide, e este contrato não finge que entregam. O que a
detecção custa, e é bom que esteja dito: ela é **periódica**, não contínua — entre duas rodadas de
`verify`, um gatilho desligado, usado e religado não deixa linha nenhuma.

### 18.3 Por que não a trava estrutural mais forte

A trava que resistiria ao dono é o dono ser outro papel: `platform.tenants` pertencendo a um papel de
que o executor não é membro. O custo mata a ideia, e é bom que esteja escrito para não voltar como
sugestão barata:

- toda migration futura que altere `platform.tenants` exige a posse, então ela passaria a ser aplicada
  por um papel diferente do que aplica o resto — e `migrations.md` §8 exige que o conjunto reproduza o
  banco a partir do vazio, com um caminho só;
- a linha do ledger e o efeito da migration têm que cair no **mesmo commit** (§7). Mesmo commit é mesma
  conexão, e mesma conexão é mesmo papel: separar o dono separaria os dois, que é a propriedade que
  torna o ledger confiável.

Fica registrado como entrada para `D-03` e para quem desenhar a operação, junto do resto de
`db/papeis-e-credencial.md` §3.

### 18.4 O ato recusado, e por que ele não vira linha

Invariante 10 manda declarar. O gatilho lança, a transação morre, e nenhuma escrita dentro dela
sobrevive — inclusive a que registraria a tentativa. A captura que existe é o **log de erro do
servidor**, medido em 2026-09-11: com `log_min_error_statement` no padrão, o servidor grava `ERROR` e
`STATEMENT`, ou seja, o comando recusado na íntegra.

Não é a mesma coisa que a linha da §19, e a diferença importa: o log do servidor é retido pela
operação, não pelo banco, e quem olha o log é quem já tem acesso ao servidor. A casa possível seria uma
segunda conexão, que é o desenho da §19 — e não foi usada aqui porque quem emite o comando recusado é
uma pessoa no `psql`, não o executor, e o executor não está lá para escrever nada.

**Isto não é o mesmo caso da §19.4**, e a distinção é o que o terceiro gate cobrou. Aqui o impedimento é
**técnico**: o gatilho lança, a transação morre, e não há processo nosso em execução para abrir uma
segunda conexão — quem emitiu o comando é uma pessoa no `psql`. Na recusa do carregador não há
impedimento nenhum: o executor está rodando, a credencial existe, o banco está de pé, e não abrir
conexão era escolha de desenho. Ausência por impedimento se declara; ausência por escolha se justifica
ou se corrige, e essa foi corrigida.

## 19. `platform.executor_events` — o que o executor detectou e não conseguiu aplicar

O ledger responde "o que está aplicado". Esta tabela responde "o que deu errado", que era a pergunta
sem casa: checksum divergente e diferença encontrada pelo `verify` paravam a rodada e morriam na saída
do processo. Rodar de novo não deixava rastro, e quem editasse o arquivo de volta apagava a única
evidência de adulteração que este sistema tem.

DDL: `platform/0004__executor_events.sql`. São duas tabelas, o domínio fechado (`executor_event_kinds`)
e os fatos (`executor_events`), porque `dados.md` §3 pede tabela de lookup e não `enum`: acrescentar
tipo de evento é `INSERT` em migration, e alterar `enum` em N schemas seria DDL.

### 19.1 Os catorze tipos, e a qual detecção cada um pertence

| Código | Detectado em |
|---|---|
| `checksum_mismatch` | §3 — migration aplicada foi editada |
| `ledger_entry_without_file` | §3 — versão registrada sem arquivo em disco |
| `migration_behind_head` | §3 — arquivo pendente atrás da cabeça da fila |
| `ledger_structure_mismatch` | §9 — retrato estrutural do ledger não casa |
| `migration_failed` | §7 — a tentativa que o `ROLLBACK` levou embora |
| `object_outside_target` | §10.4 — objeto novo fora do namespace alvo |
| `index_outside_target` | §8 — índice declarado aparecendo fora do alvo |
| `structure_mismatch` | §13.2 — `verify` achou diferença contra a referência |
| `schema_without_registry` | §13.2 — schema `t_*` no catálogo e fora de `platform.tenants` |
| `registered_schema_missing` | §10.1 — registro apontando schema que não existe |
| `load_refused` | §11 — o carregador recusou um arquivo e abortou a rodada (§19.4) |
| `privilege_unexpected` | §13.4 — `verify` achou no papel do executor privilégio que a operação manda revogar |
| `tenant_role_missing` | §13.5 — `verify` não achou o papel de banco de um cliente registrado |
| `tenant_role_divergent` | §13.5 — o papel existe com atributo ou privilégio fora do ato que o cria |

`load_refused` e `privilege_unexpected` entraram pela `0006`, no terceiro gate; os dois de papel, pela
`0008`, quando criar o papel do cliente virou passo do `provision` (`db/papel-do-cliente.md` §7). Os dez
primeiros são todos coisas que o executor observa **sobre si mesmo**; `load_refused` é a única detecção
deste sistema com outra pessoa do outro lado, e era a que não tinha casa. Os dois de papel são a
primeira dupla em que **o mesmo achado se separa pela ação humana**, não pelo lugar da detecção: ausente
converge com `migrate --schema`, adulterado nunca converge (§7.5 de lá).

Tipo novo entra por migration. O executor **não** inventa código: `kind_code` tem chave estrangeira
para o domínio, então um código que não exista é recusado pelo banco, não aceito em silêncio.

### 19.2 Como a linha é escrita

- **`migration_failed` vai por uma segunda conexão**, aberta fora da transação que falhou. Escrever na
  mesma seria escrever para o `ROLLBACK` levar, que é exatamente por que a linha não existia antes.
- **Falhar ao escrever a linha não muda o desfecho da rodada nem o código de saída.** Invariante 10,
  terceira cláusula: o registro nunca bloqueia a operação. A falha de escrita é reportada e o executor
  segue para o que já ia fazer, que nesses casos é parar.
- **O sujeito é `db_role`, o papel de banco com que o executor conectou.** Não é pessoa; pessoa depende
  de `D-03` e entra por expand quando `D-03` fechar (`CONTRATO.md` §5.1).
- **`occurred_at` e `received_at` são os dois instantes de um fato** (`dados.md` §3.1). Empatam no
  caminho normal e se afastam quando a escrita vem por segunda conexão, depois de uma transação morta.
- **Nada de dado de negócio.** As colunas de contexto são schema, versão, os dois checksums e um
  `detail` com teto de 2000 bytes. O alcance disso é o mesmo da saída do executor, classificado em
  `db/papeis-e-credencial.md` §4: a tabela carrega a carteira de clientes pelos nomes de schema, e sai
  daqui por referência, nunca colada.

### 19.3 Cardinalidade, índice e o que muda em cada faixa

Em dois anos: **10² a 10⁴ linhas**. Uma rodada limpa não escreve nada aqui; o que escreve é falha,
divergência e `verify` com achado, e cada um desses é evento raro por construção. `load_refused` (§19.4)
é o único tipo que alguém pode repetir de propósito — rodar `migrate` dez vezes com o mesmo arquivo
recusado escreve dez linhas —, e continua dentro da faixa: quem faz isso está editando um arquivo, não
operando um sistema, e a décima linha é informação sobre a décima tentativa.

Índice só na chave estrangeira (`dados.md` §3). **Não** há índice em `occurred_at`, e é escolha
declarada: a chave primária é `uuid` ordenado por tempo (`D-04`, K2), a leitura típica é "o que houve
por último" sobre uma tabela de 10⁴ linhas, e índice especulativo é dívida com cara de virtude
(`performance.md`). Na faixa de 10⁶ — que só aconteceria com o executor rodando em laço, o que já é
outro defeito — o índice de tempo entra, e entra por migration de expand.

### 19.4 A linha da recusa do carregador

`load_refused` é o fato de que **alguém escreveu uma migration que o carregador não aceitou**: forma
fora da lista de permissão, qualificador de outro schema, aspa dupla, cabeçalho inválido (§11). O
desfecho da rodada não muda em nada — saída `2`, nenhuma migration aplicada, arquivo e trecho na saída
do processo.

- **A conexão é aberta depois da decisão, e só para escrever.** A §11 dizia "nenhuma conexão é aberta",
  e isso era rapidez apresentada como propriedade de segurança: a decisão de recusar já está tomada
  quando a conexão abre, nenhum arquivo roda, e a conexão fecha em seguida.
- **Uma linha por arquivo recusado na rodada.** `version` leva o caminho do arquivo (a mesma forma de
  versão do ledger, §1), `schema_name` fica nulo porque nenhum schema foi tocado, e `detail` leva a
  regra que recusou e o trecho, truncado no teto de 2000 bytes da coluna.
- **Falhar ao escrever não muda nada** (§19.2): a falha é reportada e a saída continua `2`. É
  especialmente provável aqui, porque a recusa acontece no primeiro comando de quem está editando
  migration, muitas vezes sem banco de pé.
- **O que continua não capturado, e é declarado:** a recusa que acontece na máquina de quem escreve,
  antes de existir commit, quando não há banco para escrever — que é o caso mais comum e também o mais
  inofensivo, porque ali o carregador está fazendo exatamente o que deve, no lugar mais barato.

**Por que capturar, se a recusa também está no git.** O git guarda o arquivo **se ele for commitado**.
O episódio que interessa é o outro: o arquivo que foi recusado e corrigido antes de entrar, num
ambiente compartilhado, onde ninguém mais fica sabendo que uma migration tentou atravessar a fronteira
de cliente. Sem esta linha, essa tentativa não existe em lugar nenhum depois que o autor salva o
arquivo de novo.

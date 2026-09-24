# O universo do banco, e quem nós declaramos legítimo — §7.5.3 e §7.5.4

> Parte de `db/papeis-e-credencial.md`, e continua a numeração dela. A §7.5, a §7.5.1 e a §7.5.2 estão
> em `db/verificacao-do-papel.md`; o ato que cria o papel do cliente é a §7.3, em
> `db/papel-do-cliente.md`.
> A §7.5.3 nasceu em 2026-09-11, no sexto gate (`PAP-15`). A **§7.5.4 nasceu em 2026-09-12**, no
> sétimo (`docs/auditorias/2026-09-12-reauditoria-camada-de-papel.md`, `PAP-19` a `PAP-23`), junto da
> troca que fecha a classe daquele gate: a exclusão da §7.5.1 deixou de ser propriedade do catálogo e
> passou a ser **declaração nossa**. A **§7.5.5 nasceu no oitavo**, no mesmo dia
> (`docs/auditorias/2026-09-12-gate-da-declaracao-camada-de-papel.md`, `PAP-24` a `PAP-27`), e ela é a
> outra metade da mesma ideia: se a exclusão é um nome, alguém tem que perguntar **quem é membro
> daquele nome**. As três saíram de `db/verificacao-do-papel.md` pelo teto de 400 linhas de
> `00-nucleo.md` §8.
> Autor: `arquiteto-dados` · T-0009.

**O que este arquivo responde, em uma frase:** nada existe neste banco fora do que declaramos —
nem schema, nem objeto em `public`, nem papel que alcance um cliente, nem dono de schema nosso.

| Pergunta | O que ela responde | Divergência |
|---|---|---|
| §7.5.3 | existe schema fora de `platform` e `t_*`, ou objeto em `public`? | saída `3` |
| §7.5.4 | quem nós declaramos legítimo, quem o operador retratou, e quem é dono dos nossos schemas? | dono e declaração sem ato: saída `3`. Declaração a mais: **registra e não reprova** |
| §7.5.5 | alguém é membro de um papel declarado? | saída `3`. O conjunto esperado é **vazio** |

## 7.5.3 O universo: o que existe fora de `platform` e de `t_*`

Entrou em 2026-09-11, no sexto gate, e é o `PAP-15`. As duas perguntas acima — e a comparação
estrutural do `verify`, e o crivo do carregador — olham `platform` e cada `t_*`. **O que mora num
terceiro schema está fora do campo de visão de tudo.**

A §7.5.1 corrigiu a *pergunta* (enumerar quem alcança, em vez de conferir o esperado) e manteve o
*universo* (os schemas que se espera que sejam de cliente). Objeto de terceiro schema é a mesma
cegueira do `PAP-02` uma casa ao lado — é o padrão das três reincidências deste gate: a correção muda
a pergunta e conserva em silêncio uma fronteira da pergunta velha.

**O que foi medido, e é o motivo desta seção existir.** Numa máquina em que o
`REVOKE USAGE ON SCHEMA public FROM PUBLIC` da §7.2 não foi rodado, o dono do banco cria uma view de
apoio em `public` unindo `t_acme.orders` e `t_globex.orders` e concede `SELECT` nela. A credencial da
aplicação, **sem assumir papel nenhum**, devolve as linhas dos dois clientes: a view roda com o
privilégio de quem a criou, então o papel do cliente deixa de estar no caminho. Antes desta seção,
`verify` registrava só `ato do operador pendente: PUBLIC ainda alcança o schema public` — que por
decisão não muda o código de saída (§7.5.2) — e a view não era nomeada por nada.

Então a afirmação passa a ser explícita: **os schemas não-sistema são exatamente `platform` e `t_*`, e
`public` está vazio.** Uma consulta, nenhum privilégio novo:

```sql
SELECT n.nspname AS nome, 'schema' AS especie, pg_get_userbyid(n.nspowner) AS dono, '' AS motivo
  FROM pg_namespace n
 WHERE n.nspname NOT LIKE 'pg\_%'
   AND n.nspname <> 'information_schema'
   AND n.nspname <> 'public'
   AND n.nspname <> 'platform'
   AND n.nspname NOT LIKE 't\_%'
UNION ALL
SELECT 'public.' || c.relname, 'relacao ' || c.relkind::text, pg_get_userbyid(c.relowner),
       CASE WHEN <referencia schema nosso> THEN 'e a definição dela referencia schema nosso'
            ELSE '' END
  FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
 WHERE n.nspname = 'public'
   AND c.relkind IN ('r', 'p', 'v', 'm', 'f', 'S')
   AND (NOT (<pertence a extensão> AND <dono do objeto é superusuário>)
        OR <referencia schema nosso>)
UNION ALL
-- o mesmo para pg_proc, com "referencia" saindo do corpo da rotina
 ORDER BY 1;
```

A consulta literal está em `db/migrator/src/schema-universe.ts`; aqui os dois predicados aparecem
nomeados porque é deles que esta seção trata. `<referencia schema nosso>` sai de `pg_depend` sobre a
regra de reescrita, para relação, e do corpo por expressão regular, para rotina.

**Aqui a divergência reprova**, com `schema_outside_universe` ou `public_object_present` e saída `3`,
ao contrário da §7.5.2 logo acima. A diferença é a de sempre: aquela seção depende de um `REVOKE` que
nada versionado aplica, então acusaria em toda máquina; esta afirma uma propriedade que o próprio
conjunto de migrations produz e que nenhum caminho legítimo quebra. O crivo da §11 impede migration de
criar objeto fora do alvo, então o que chega aqui é SQL na mão, que `migrations.md` §9 já chama de
drift — e drift em `public` era o único que nenhum comando enxergava.

**Rotina entra, e não é zelo.** A lista do achado tinha uma view, e conserto montado a partir da lista
do achado prova o achado. O que mais alcança dois clientes morando em `public` é uma função
`SECURITY DEFINER`, que nem sequer é relação — ela é nomeada pela mesma pergunta, e está no caso 42.

**A desculpa de extensão era controlada por quem ataca, e é o `PAP-21`.** Até o sétimo gate bastava
`pg_depend` com `deptype = 'e'` para o objeto sumir desta pergunta, e a ausência declarada afirmava que
"quem planta a isca não tem como pendurá-la numa extensão sem antes poder criar extensão, que é
privilégio de outro nível". **A premissa estava errada.** Medido em 2026-09-12, PostgreSQL 16.15:
extensão **confiável** é criável por não-superusuário desde o PostgreSQL 13; o executor criou
`pgcrypto` e virou dono dela (`extowner = forja_executor`); e `ALTER EXTENSION pgcrypto ADD VIEW
public.v_isca` devolveu o `verify` de `3` para `0`, com a credencial nua lendo dois clientes pela view.

**A necessidade continua, e ela é real**: reprovar todo objeto de extensão faria o controle acusar
qualquer máquina com `pgcrypto` em `public`, e controle que reprova sempre é dispensado. O mecanismo é
que muda, em duas partes:

1. **a extensão só desculpa o objeto cujo dono é superusuário.** Medido no mesmo dia: as 36 rotinas de
   `pgcrypto` instaladas pelo executor nasceram com `proowner = postgres`, porque extensão confiável
   roda o script dela como o superusuário de origem; já a view do ataque continuou com
   `relowner = forja_executor` depois do `ALTER EXTENSION … ADD`, que muda a dependência e **não** muda
   a posse. E um não-superusuário não produz objeto de dono superusuário por SQL: `CREATE ROLE …
   SUPERUSER`, `SET ROLE` e `ALTER … OWNER TO` para superusuário são todos negados a ele. Medido nos
   dois sentidos: a isca continua acusada dentro da extensão, e `pgcrypto` sozinha, instalada pelo
   mesmo papel, não produz linha nenhuma;
2. **referência a schema nosso acusa, e nenhuma desculpa a alcança.** Objeto em `public` cuja definição
   referencia `platform` ou `t_*` é nomeado ainda que esteja dentro de extensão de superusuário. É
   esta parte que fecha a classe, porque a primeira ainda é uma propriedade — só que uma que o ator
   medido não emite.

Para rotina, "referencia" é **heurística declarada**: corpo que monta SQL dinâmico escapa dela.
Heurística que só acrescenta linha é segura; a que exclui é o defeito que este gate corrigiu.

## 7.5.4 A declaração: quem nós dissemos que é legítimo, e quem é dono dos nossos schemas

Nasceu em 2026-09-12, no sétimo gate, e ela é a correção da **classe** que reabriu oito vezes nesta
camada. A §7.5.1 conta a história do defeito; esta seção define o mecanismo que o substitui.

**A regra, em uma frase: propriedade do catálogo só pode acusar, nunca desculpar.**

### O registro

`platform.role_declarations` (`platform/0011__role_declarations.sql`): uma linha por papel que nós
declaramos legítimo, com o tipo (`executor` ou `app_credential`), quem declarou e quando. A tabela é
**append-only**, com o gatilho genérico da `0002`: declaração alterada em silêncio seria uma exclusão
nova sem autor e sem data, que é exatamente o que ela existe para impedir.

| Quem escreve | Quando | O que acontece |
|---|---|---|
| `provision` | depois da stream `platform`, antes do passo 2 | declara o papel da conexão e a credencial do ambiente |
| `migrate` | depois da stream `platform`, antes de visitar cliente | o mesmo, e é o caminho da rotação da §7.7 |
| `verify` | **nunca** | quem só verifica não amplia o conjunto que a verificação desculpa |

A escrita é `INSERT ... ON CONFLICT (role_name) DO NOTHING` numa transação só: ou o arranjo inteiro
fica declarado, ou nada fica — metade declarada faria a §7.5.1 acusar a outra metade como terceiro.
Rodada que não amplia nada não escreve e não imprime; rodada que amplia imprime a linha
`papel declarado:` e grava `app_role_declared`. **Ampliar a exclusão é um ato datado com autor**, e é
essa a diferença que a tabela entrega.

Os dois nomes já passaram pela recusa de borda da §7.7 quando chegam aqui — o grupo existe, a
credencial existe, tem `LOGIN`, é membro do grupo e não o administra —, então o que se declara é o
arranjo conferido contra o catálogo, e não o que o `.env` afirma sozinho.

### Como a §7.5.1 usa o registro

Exclui **por nome literal**, e só enquanto a condição que produziu a declaração valer. **Cada espécie
tem a sua condição, e a do executor entrou no oitavo gate (`PAP-25`):**

| Espécie | Condição de permanência | Quando ela cai |
|---|---|---|
| `app_credential` | continuar membro de `forja_app` | a mão humana tira a velha do grupo ao fim da rotação (§7.7) |
| `executor` | **ser dono de `platform`** | a posse de `platform` muda de mãos |

Terminada a rotação, a credencial velha volta a ser acusada enquanto os `GRANT` dela ficarem de pé —
porque ela continua podendo **assumir** o papel de todo cliente. É a propriedade entrando do lado que
acrescenta linha.

**Nas duas espécies, só a declaração vigente exclui**: a que tem retratação (abaixo) deixa de
desculpar alcance e posse, qualquer que seja o estado do catálogo.

**Por que `platform`, e não "é dono de algum schema nosso".** A segunda seria a exclusão por
propriedade que o beneficiário emite, de novo: `ALTER SCHEMA t_acme OWNER TO <ele>` é um comando de
quem ataca. Transferir a posse de `platform` também é um comando — só que ele **desarma o executor
legítimo na mesma passada**: o antigo deixa de ser dono, perde a exclusão, e todo alcance dele passa a
ser acusado pela §7.5.1 e pela afirmação de dono. Não existe estado em que essa troca seja silenciosa,
que é o que se pede de uma condição de permanência.

Medido em 2026-09-12, PostgreSQL 16.15, com o executor não-superusuário: `INSERT` cru declarando
`ops_leitura` como `executor`, mais `ALTER SCHEMA t_acme OWNER TO ops_leitura`, saía `0` sem uma
linha; com a condição, sai `3` na afirmação de dono, na §7.5.5 e na conferência abaixo. E **o rearme
parou de funcionar**: derrubar o papel e recriar o mesmo nome devolvia a exclusão de graça, porque a
linha não sai da tabela — agora o nome recriado não é dono de `platform` e a declaração continua
inerte.

### Toda declaração tem o ato ao lado, ou é acusada

Entrou no oitavo gate, e ela cobra o que esta seção já afirmava. A §7.5.4 vendia "ampliar a exclusão é
ato datado com autor", e nada conferia isso: medido em 2026-09-12, o executor escreve na tabela por
`INSERT` cru — sem linha impressa e sem `app_role_declared` —, e a linha plantada passava a desculpar
o alcance do beneficiário em toda rodada seguinte. A afirmação inverte o ônus: **a divergência entre a
tabela e a trilha de fatos é exatamente esse `INSERT`**, e ela sai em `3` com
`role_declaration_unattested`.

**A saída existe, e é deliberada.** A tabela é append-only, então a linha plantada não sai — e uma
acusação sem saída é um `verify` em `3` para sempre, que é a forma mais rápida de ensinar alguém a
desligar o controle. Então uma rodada **assume** a linha: `migrate` ou `provision` com aquele nome na
conexão (se for executor) ou no ambiente (se for credencial) grava `role_declaration_adopted`, dizendo
que a linha já existia sem ato, com quem a escreveu e quando. Quem lê a trilha depois distingue "foi
declarado" de "foi assumido".

**O limite, declarado, porque ele não é pequeno:** quem escreve a linha crua também consegue gravar o
fato — `platform.executor_events` aceita `INSERT` do executor, por desenho, e é a tabela de fatos
dele. Esta conferência pega o plantio **descuidado**, não o forjado. O que ela fecha é a distância
entre o que este documento afirmava e o que o banco conferia.

### Retirar uma declaração

Entrou em 2026-09-23, no nono gate (`PAP-30`). A tabela é append-only e não tinha saída: a credencial
aposentada no fim da rotação continuava nomeada em todo `verify` com a instrução de tirá-la do grupo,
que já tinha sido cumprida, e N rotações deixavam N linhas iguais escondendo a que importa.

**Retirar é linha nova, e é ato do operador**, em `platform.role_retractions`
(`platform/0014__role_retractions.sql`). A declaração continua de pé como histórico; a retratação diz
por quem, quando e por quê ela deixou de valer. Procedimento, na conexão do operador:

1. Se o papel ainda alcança alguma coisa, tirar primeiro: `REVOKE forja_app FROM <papel>` e, para
   cada cliente, `REVOKE app_t_<slug> FROM <papel> GRANTED BY <executor>`. O `verify` diz o estado: a
   linha `credencial de aplicação a mais` passa a dizer **inerte** quando não sobra nada a tirar.
2. Registrar a retratação, com o motivo por extenso:

   ```sql
   INSERT INTO platform.role_retractions (role_name, reason)
   VALUES ('<papel>', '<por que a declaração deixou de valer, com a data>');
   ```

   Chave, autor (`current_user`) e instante saem da própria tabela.
3. Rodar `verify`. A linha do papel some; se ele ainda alcançar algum cliente, a §7.5.1 passa a
   acusá-lo como terceiro, com saída `3`.

**Ela só estreita.** Declaração retratada deixa de desculpar na §7.5.1 e na afirmação de dono, sai da
lista de declarações a mais e da conferência do ato, e é a segunda saída da linha plantada, ao lado
da adoção abaixo. Nenhuma pergunta que **acusa** a ignora: a §7.5.5 continua perguntando pelos membros
de todo nome declarado. Por isso a tabela não tem trava contra o executor, que é o dono dela: o pior
que ele faz com um `INSERT` é retratar a si mesmo, e aí todo schema nosso passa a ser acusado
(medido, caso 62).

**Ela é terminal.** Um nome, uma retratação, e só de nome declarado (chave estrangeira). O nome
retratado não volta: a `0011` tem `UNIQUE (role_name)`, e `provision` e `migrate` recusam com saída `2`
a rodada que o nomeia. Quem precisa daquele papel de novo cria outro nome pelo ato do operador.
Reabrir um nome retratado seria ampliar a exclusão com uma linha escrita à mão, que é o que esta seção
existe para impedir.

**Sem a tabela, a pergunta não é feita**: `verify` sai `3` com `role_retractions_missing`, e `migrate`
recusa com `2`, como na ausência da `0011`.

### A afirmação de dono, e por que ela é pergunta e não filtro

O dono de `platform` e de cada `t_*` **é afirmado**: ele tem que ser um executor declarado, e
divergência sai em `3` com `tenant_schema_owner_unexpected`.

Medido em 2026-09-12, PostgreSQL 16.15, com o executor **não-superusuário**:
`CREATE ROLE probe_dono LOGIN` · `GRANT probe_dono TO forja_executor` ·
`ALTER SCHEMA t_acme OWNER TO probe_dono` · `GRANT SELECT ON ALL TABLES IN SCHEMA t_acme` — depois
disso `probe_dono`, fora de `forja_app` e fora de todo `app_t_*`, lê `t_acme.orders`, e `verify` e
`migrate` saíam `0` sem nomear nada. O `nspacl` resultante era
`{probe_dono=UC/probe_dono,app_t_acme=U/probe_dono}`: a entrada sumia da pergunta invertida **porque
ela excluía o dono**, e o `USAGE`, que é o ponto de estrangulamento declarado, vinha da própria posse.

**Ela é pergunta própria, e não um filtro a mais da §7.5.1**, porque um dono consegue apagar a própria
entrada de ACL e continuar dono: medido, `REVOKE ALL ON SCHEMA … FROM <dono>` tira a linha que a
pergunta invertida enumeraria, e o dono se reconcede `USAGE` quando quiser. Posse não se lê no ACL.

**O dono não é só leitura**: ele pode `DROP SCHEMA … CASCADE`. O mesmo estado invisível era caminho de
destruição do dado de um cliente.

### A pergunta que não pôde ser feita reprova

Seis perguntas do `verify` leem esta tabela — quem alcança o cliente, o papel de banco, o dono, as
declarações a mais, a declaração sem ato e a §7.5.5. Num banco em que a `0011` não foi aplicada, elas
não têm resposta, e o desfecho é `3` com `role_declarations_missing` dizendo que não foram feitas.
`migrate` recusa antes, com saída `2`, porque falta estrutura e não há o que convergir. Passar em
silêncio aqui seria o `PAP-23` uma camada abaixo: ficar verde por não ter perguntado.

**Tabela vazia é o mesmo caso, e ela tem mensagem própria (`PAP-27`).** É o estado do banco
provisionado antes da `0011`, e o de uma rodada de `migrate` que morra entre a stream `platform` e a
declaração. Medido em 2026-09-12: o `verify` saía `3` com **treze** linhas acusando dono e alcance, e
três delas mandavam `ALTER SCHEMA ... OWNER TO <executor>` sobre schemas cujo dono **já era** o
executor — quem seguisse a instrução impressa emitiria um comando que não muda nada e continuaria com
`3`. Agora o desfecho é `3` com **uma** linha, `role_declarations_empty`, e ela nomeia a saída que
funciona: uma rodada de `migrate`.

## 7.5.5 Papel declarado não tem membro

Nasceu no oitavo gate, e ela é o `PAP-24`. **A §7.5.1 trocou a exclusão por nome e continuou
enumerando só o membro direto de `app_t_<slug>`** — e foi essa fronteira, não a troca, que abriu o
buraco. Enquanto a exclusão era propriedade do catálogo, um membro a mais não carregava a propriedade
certa e caía na pergunta; virando nome, **ser membro de um nome excluído passou a ser invisibilidade**.

Medido em 2026-09-12, PostgreSQL 16.15, em arranjo saudável recém-provisionado, com **dois comandos**
na conexão que o operador já tem aberta:

```sql
CREATE ROLE ops_leitura LOGIN;
GRANT forja_credencial TO ops_leitura;
```

`ops_leitura` faz `SET ROLE forja_credencial; SET ROLE app_t_acme;` e lê `t_acme.orders`; trocando o
papel, lê o outro cliente. `verify` saía **`0`**, `migrate` saía **`0`**, e `grep ops_leitura` na saída
devolvia **zero linha** — enquanto `pg_auth_members` carregava a concessão à vista.

A afirmação, e o conjunto esperado é **vazio**:

```sql
select d.role_name as papel, d.role_kind as especie,
       m.member::regrole::text as membro,
       m.grantor::regrole::text as concedente
  from platform.role_declarations d
  join pg_auth_members m on m.roleid = to_regrole(d.role_name)::oid
 where to_regrole(d.role_name) is not null;
```

**Por que conjunto vazio, e não uma lista de exceções.** Nenhum papel deste arranjo nasce com membro:
o executor e a credencial são pontas de **conexão**, não grupos. Quem agrupa é `forja_app`, que não é
declarado e não tem privilégio próprio (§7.1). Afirmação de conjunto vazio é a forma mais barata de
ler e a mais difícil de enganar — não há exceção para alguém se encaixar.

**Por que ela basta, sem fecho transitivo.** Toda cadeia `intruso → R1 → … → app_t_<slug>` termina em
um elo declarado ou não declarado. Se o membro direto do papel do cliente não é declarado, a §7.5.1 o
acusa. Se é, o elo anterior é membro de um papel **declarado**, e esta pergunta o acusa — a menos que
ele também esteja declarado, e aí a recursão anda um degrau até o intruso. Intruso declarado é a
ampliação do `PAP-25`, que tem pergunta própria. O fecho transitivo nomearia melhor o beneficiário
final e custaria uma consulta recursiva; a afirmação acusa o mesmo estado e cabe numa leitura.

**Declaração não desculpa membro, nem quando o membro também está declarado.** Excluir aqui pelo mesmo
conjunto que a §7.5.1 exclui deixaria uma linha plantada comprar silêncio nas duas perguntas de uma
vez.

**O concedente entra na linha**, porque a chave de `pg_auth_members` é `(roleid, member, grantor)`: a
mesma membership por duas mãos são duas linhas, e o `REVOKE` que a retira é da mão que a emitiu. É a
mesma lição do `PAP-13`.

**Divergência é `declared_role_member` e saída `3`, e `migrate` para antes de conceder**: conceder o
papel do cliente a uma credencial que tem membro é entregá-lo ao membro junto, e a correção é
`REVOKE`, que o ato da §7.3 não tem.

**Uma consequência operacional, e ela é do PostgreSQL 16:** `CREATE ROLE` emitido por um `CREATEROLE`
**não-superusuário** concede o papel novo ao criador, com `ADMIN OPTION`. Ou seja, credencial criada
**pelo executor** nasce com o executor como membro, e esta pergunta a acusa. Está certo que acuse: uma
credencial que o executor pode repassar é a cadeia do `PAP-25` inteira. O ato do operador (§7.2) já
diz que quem cria a credencial é **ele**, e agora o banco cobra isso.

## O que a §7.5.4 e a §7.5.5 não alcançam, e é declarado

Revisto no oitavo gate, e a primeira ausência **mudou de texto porque o texto estava errado**.

**Errata, e ela precisa morar aqui.** O texto refutado abaixo está copiado no cabeçalho de
`db/migrations/platform/0011__role_declarations.sql`, item 1 de "O QUE ESTA TABELA NÃO ALCANÇA", e
**aquele cabeçalho não vai ser corrigido**: a migration já foi aplicada, e `migrations.md` §1 não abre
exceção nem para comentário. Um arquivo novo só para consertar prosa também não serve — migration é
DDL, não errata. Então a correção vive onde a `0011` já manda olhar (linha 6 do cabeçalho dela aponta
para este documento), e quem ler o cabeçalho encontra o argumento velho com o endereço do novo ao
lado. O item 3 daquele cabeçalho envelheceu do mesmo jeito: o primeiro `verify` de um banco sem
declaração deixou de acusar dono e alcance, e responde `role_declarations_empty` (`PAP-27`).

1. **Quem tem a conexão do executor amplia o conjunto** rodando `migrate` com outro nome no ambiente.
   A versão anterior desta linha dizia que isso "não é fuga nova, porque esse papel já é dono de todo
   schema de cliente". **O argumento não cobre o caso, e foi medido.** O executor cria um papel, o
   declara pelo `.env` e — porque em 16 o criador ganha `ADMIN OPTION` sobre o que cria — concede esse
   papel a um terceiro: o resultado é uma **credencial de login separada, permanente, usável por quem
   nunca teve a conexão do executor, e que sobrevive à rotação dele**. "Já podia ler" é sobre o
   executor; isto é sobre outra pessoa, e depois.

   A trava que este documento invocava — a recusa de borda da §7.7 (`PAP-07`) — também não cobre:
   medido, ela confere se o nome existe, tem `LOGIN`, está no grupo e não o administra, e o executor
   satisfaz **as quatro** sozinho com dois comandos. Ela para o `.env` copiado de outra máquina; não
   para quem tem a conexão.

   **O que a linha datada compra é investigação, não detecção**: `declared_by`, `declared_at` e o fato
   `app_role_declared` ancoram quem for procurar **depois de desconfiar**. Quem produz a detecção é a
   §7.5.5, e ela é nova: o terceiro que recebe a credencial plantada é membro de papel declarado, e
   sai em `3` nomeado. Medido nos dois sentidos em 2026-09-12 — antes, `verify` em `0` com uma linha
   idêntica à de uma rotação legítima; depois, `migrate` recusando **antes de conceder** e `verify`
   em `3` nomeando o beneficiário.
2. **Superusuário passa por cima de tudo**, aqui como no gatilho da `0002`. Vale também para a
   conferência do ato: superusuário escreve na tabela e grava o fato.
3. **A conferência do ato pega o descuidado, não o forjado.** Quem planta a linha crua também
   consegue gravar `app_role_declared`, porque `platform.executor_events` é a tabela de fatos do
   executor e aceita `INSERT` dele. O que ela custa a quem ataca é um segundo ato deliberado, que
   também fica gravado.
4. **Banco provisionado antes da `0011`** não tem declaração nenhuma. Desde o oitavo gate isso não
   produz mais as treze linhas de dono e alcance: sai `role_declarations_empty`, com a saída certa na
   mensagem. Continua sendo falha fechada — `3` —, e a alternativa (o `verify` declarando o que
   encontra) continua recusada, porque seria a verificação confiando no estado que ela existe para
   julgar.
5. **A §7.5.5 não enumera papel `LOGIN` solto no cluster**, pela mesma razão da §7.5.1: em máquina de
   quem desenvolve isso acusaria papel pessoal em toda rodada. Ela só pergunta pelos membros dos nomes
   que **nós** declaramos, que é um conjunto de tamanho conhecido.

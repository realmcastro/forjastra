# A prova de que o papel do cliente é o único caminho até o schema dele — §7.5

> Parte de `db/papeis-e-credencial.md`, e continua a numeração dela: aqui moram a **§7.5**, a
> **§7.5.1** e a **§7.5.2**. A §7.5.3 e a §7.5.4 estão em `db/universo-e-declaracao.md`; o ato que
> cria o papel é a §7.3, em `db/papel-do-cliente.md`.
> Revisto em 2026-09-12, no sétimo gate
> (`docs/auditorias/2026-09-12-reauditoria-camada-de-papel.md`, `PAP-19` a `PAP-23`): a exclusão da
> §7.5.1 deixou de ser propriedade do catálogo e passou a ser declaração nossa, a §7.5.3 trocou a
> desculpa de extensão, e a §7.5.4 nasceu.
> Revisto de novo no oitavo, no mesmo dia
> (`docs/auditorias/2026-09-12-gate-da-declaracao-camada-de-papel.md`, `PAP-24` a `PAP-27`): a classe
> que a troca atacava **fechou**, e o que sobrou foi o **alcance da pergunta** — a §7.5.1 enumera um
> nível de membership, e com a exclusão virada nome, ser membro de um nome excluído virou
> invisibilidade. Daí a §7.5.5, em `db/universo-e-declaracao.md`.
> Nasceu em 2026-09-11, no quinto gate de `seguranca`
> (`docs/auditorias/2026-09-11-camada-de-papel.md`, achados `PAP-01` a `PAP-12`), quando a §7.5 ganhou
> uma segunda pergunta e não coube mais no arquivo do ato. Mora em arquivo próprio pelo teto de 400
> linhas, que é a mesma razão de o contrato ter sido partido.
> Autor: `arquiteto-dados` · T-0009.

**O que este arquivo responde, em uma frase:** o papel do cliente existe, tem exatamente o alcance que
o ato lhe deu, e **ninguém mais** alcança o schema daquele cliente.

Três perguntas, e o corte entre elas não é de assunto, é de **quem responde por elas**:

| Pergunta | O que ela responde | Divergência |
|---|---|---|
| §7.5 | o papel esperado está bem formado? | saída `3`, menos a coluna que depende de quem pergunta |
| §7.5.1 | **quem** alcança o schema deste cliente? | saída `3` |
| §7.5.2 | o que o ato do operador (§7.2) deixou de fazer? | **registra e não reprova** |
| §7.5.3 | existe schema fora de `platform` e `t_*`, ou objeto em `public`? | saída `3` |
| §7.5.4 | quem nós declaramos legítimo, e quem é dono dos nossos schemas? | saída `3` no dono e na declaração sem ato; declaração a mais **registra e não reprova** |
| §7.5.5 | alguém é membro de um papel declarado? | saída `3`. O conjunto esperado é **vazio** |

## 7.5 A pergunta sobre o papel esperado, e por que aqui a divergência reprova

`verify` faz uma pergunta ao catálogo, uma linha por schema `t_*`, sem parâmetro além dos dois nomes
que ele já conhece (o grupo e a credencial):

```sql
WITH alvo AS (
  SELECT n.nspname AS schema_name,
         to_regrole('app_' || n.nspname) AS role_oid
    FROM pg_namespace n
   WHERE n.nspname LIKE 't\_%'
), cred AS (
  SELECT to_regrole(d.role_name)::oid AS oid
    FROM platform.role_declarations d
   WHERE d.role_kind = 'app_credential' AND to_regrole(d.role_name) IS NOT NULL
)
SELECT a.schema_name,
       a.role_oid IS NOT NULL AS papel_existe,
       r.rolcanlogin OR r.rolsuper OR r.rolcreaterole OR r.rolcreatedb
         OR r.rolbypassrls OR r.rolreplication OR r.rolinherit AS atributo_indevido,
       EXISTS (SELECT 1 FROM pg_auth_members m
                WHERE m.member = a.role_oid AND m.roleid = to_regrole($1)
                  AND NOT m.admin_option) AS no_grupo,
       EXISTS (SELECT 1 FROM pg_auth_members m
                WHERE m.roleid = a.role_oid AND m.member = to_regrole($2)) AS credencial_assume,
       EXISTS (SELECT 1 FROM pg_auth_members m
                WHERE m.roleid = a.role_oid AND m.member = to_regrole($2)
                  AND m.inherit_option) AS credencial_herda,
       (SELECT json_agg(json_build_object('credencial', c.credencial, 'concedente', c.concedente)
                        ORDER BY c.credencial, c.concedente)
          FROM (SELECT DISTINCT m.member::regrole::text AS credencial,
                                m.grantor::regrole::text AS concedente
                  FROM pg_auth_members m
                 WHERE m.roleid = a.role_oid AND m.inherit_option
                   AND m.grantor IS DISTINCT FROM to_regrole(current_user)::oid
                   AND (m.member = to_regrole($2) OR m.member IN (SELECT cred.oid FROM cred))
               ) c
       ) AS heranca_de_outro_concedente,
       (SELECT array_agg(DISTINCT m.member::regrole::text)
          FROM pg_auth_members m
         WHERE m.roleid = a.role_oid AND m.inherit_option
           AND m.grantor IS NOT DISTINCT FROM to_regrole(current_user)::oid
           AND m.member IS DISTINCT FROM to_regrole($2)
           AND m.member IN (SELECT cred.oid FROM cred)
       ) AS heranca_de_outra_credencial,
       has_schema_privilege(a.role_oid, a.schema_name, 'USAGE')  AS usage_no_proprio,
       has_schema_privilege(a.role_oid, a.schema_name, 'CREATE') AS create_indevido,
       has_schema_privilege(a.role_oid, 'platform', 'USAGE')     AS usage_em_platform,
       (SELECT count(*) FROM pg_class c JOIN pg_namespace n2 ON n2.oid = c.relnamespace
         WHERE n2.nspname = a.schema_name AND c.relkind IN ('r','p','v','m')
           AND NOT has_table_privilege(a.role_oid, c.oid, 'SELECT')) AS tabelas_sem_select,
       EXISTS (SELECT 1 FROM pg_default_acl d JOIN pg_namespace n3 ON n3.oid = d.defaclnamespace
                WHERE n3.nspname = a.schema_name AND d.defaclobjtype = 'r'
                  AND d.defaclrole = to_regrole(current_user)::oid) AS default_acl_de_quem_pergunta
  FROM alvo a LEFT JOIN pg_roles r ON r.oid = a.role_oid
 ORDER BY a.schema_name;
```

`to_regrole` devolve nulo em vez de erro quando o papel não existe, e é por isso que ele está ali: a
pergunta precisa distinguir "não existe" de "existe errado" **na mesma passada**, sem morrer na
primeira. As chamadas de privilégio recebem o `oid`, então a linha com `role_oid` nulo devolve nulo em
todas elas e a leitura fica inequívoca.

**`credencial_herda` é a coluna que fecha o `PAP-01`, e ela pergunta pela concessão, não pelo papel.**
Em 16 a herança é propriedade de cada `GRANT` (`pg_auth_members.inherit_option`), não do atributo do
papel — `atributo_indevido` já lia `rolinherit`, e mesmo assim o estado passava: medido em 2026-09-11,
PostgreSQL 16.15, uma credencial `NOINHERIT` com `GRANT … WITH INHERIT TRUE` lê todos os clientes sem
assumir papel nenhum. Medido também o contrário, que é o que torna a coluna barata: sobre uma concessão
herdável, reemitir a linha da §7.3 muda `inherit_option` para `f` e a leitura direta volta a dar
`permission denied for schema` — então este caso **converge** no `migrate` (§7.4) em vez de parar a
rodada.

**`heranca_de_outro_concedente` é a coluna do `PAP-13`, e ela pergunta pelo concedente.** A chave de
`pg_auth_members` é `(roleid, member, grantor)`: a mesma concessão emitida por duas mãos são **duas
linhas**, e o efeito é a união delas. Medido em 2026-09-11, PostgreSQL 16.15, com a linha do executor
de pé: `GRANT app_t_acme TO <credencial> WITH INHERIT TRUE` emitido pelo **operador** acrescenta a
segunda linha, a credencial nua volta a ler o cliente, e **reemitir a linha da §7.3 grava a do
executor e deixa a do operador intacta**. Por isso este caso não converge — ele recusa, e a §7.4 diz
com que comando e de quem.

O sujeito desta coluna é `current_user`, e é escolha, não descuido: a pergunta que ela faz é "esta
conexão consegue corrigir isso reemitindo?". Errar aqui para o lado de outro concedente faz o comando
**recusar**, nunca passar — o oposto do que aconteceria na §7.5.1, onde o mesmo raciocínio produziria
acusação falsa.

**As duas colunas de herança deixaram de valer só para o nome do ambiente, e é o `PAP-19`.** Até o
sétimo gate elas filtravam por `m.member = to_regrole($2)`, e `$2` é o que o `.env` carrega. Medido em
2026-09-12, PostgreSQL 16.15, na janela de rotação da §7.7 exatamente como ela está escrita: com uma
segunda credencial no grupo, o operador emite `GRANT app_t_<slug> TO <a outra> WITH INHERIT TRUE`, ela
passa a ler **todos** os clientes nua, e o **mesmo banco** sai `0` ou `3` conforme o nome que estiver
no ambiente. O sujeito passou a ser o conjunto de `platform.role_declarations` (§7.5.4) — o mesmo que
a §7.5.1 exclui, para que não existam duas definições de "quem é credencial" para desencontrar.

**`heranca_de_outra_credencial` é o que sobra dessa extensão, e ela recusa em vez de convergir.** A
concessão herdável **deste** executor à credencial **do ambiente** converge, porque reemitir a linha da
§7.3 a corrige no lugar. À credencial declarada que **não** é a do ambiente, não: o ato só emite para
um nome, e convergir deixaria a herança de pé com o comando dizendo ter corrigido — que é a forma
exata do `PAP-13`. Ela cai em `tenant_role_divergent`, e a mensagem carrega as duas saídas: rodar
`migrate` com o ambiente apontando para aquela credencial, ou revogar.

Medido em 2026-09-11 com dois schemas, um provisionado por este ato e outro montado à mão: o segundo
saiu com a coluna de privilégio padrão falsa, e foi o único campo que os separou — exatamente o defeito
que só apareceria no release seguinte (§7.3).

**Uma coluna desta consulta não responde sobre o banco, responde sobre quem pergunta — e ela nunca
reprova.** `default_acl_de_quem_pergunta` compara `pg_default_acl` contra `current_user`, porque o
privilégio padrão vale para o papel que **vai criar** a próxima tabela. Medido em 2026-09-11: o mesmo
banco íntegro, perguntado por um papel diferente do que provisionou, devolve a coluna falsa em **todos**
os schemas. Ligá-la à saída `3` faria o `verify` de um operador reprovar a frota inteira acusando
adulteração — que é o defeito que a `PROVISION-E-VERIFY.md` §13.4 descreve e evita. Então:

- no `migrate`, ela é **parte a convergir**: o executor reemite o `ALTER DEFAULT PRIVILEGES` e a coluna
  fica verdadeira para ele, que é quem cria tabela ali;
- no `verify`, ela é **linha nomeada e evento `tenant_role_default_acl_absent`**, sem tocar no código
  de saída;
- quem pega o sintoma de verdade — tabela criada e invisível para o cliente — é `tabelas_sem_select`,
  que não depende de quem pergunta e continua reprovando.

**Cada linha divergente vira linha nomeada na saída e um evento**, com quatro códigos e não um
(`platform/0008__event_kinds_tenant_role.sql`, `platform/0009__event_kinds_tenant_reach.sql` e
`platform/0010__event_kinds_grantor_and_universe.sql`):

| Evento | Quando | O que a mão humana faz | Saída |
|---|---|---|---|
| `tenant_role_missing` | `papel_existe` falso | `migrate --schema t_<slug>`, que converge | `3` |
| `tenant_role_incomplete` | papel existe e falta parte do ato: a concessão à credencial, a herança, `USAGE`, `SELECT` em tabela | `migrate --schema t_<slug>`, que converge | `3` |
| `tenant_role_divergent` | papel existe **com** `LOGIN`, fora do grupo, com atributo indevido ou com privilégio a mais | investiga: alguém tocou no papel fora deste ato. **Não** rode `migrate` esperando conserto | `3` |
| `tenant_role_default_acl_absent` | falta privilégio padrão para o papel que perguntou | roda `migrate` com o papel do executor, ou ignora se está auditando com outro papel | inalterada |
| `tenant_role_foreign_grantor` | a credencial herda o papel por concessão de **outro concedente** | o concedente, na conexão dele, emite `REVOKE app_t_<slug> FROM <credencial>`. **Não** rode `migrate` esperando conserto: ele recusa | `3` |

São cinco porque os diagnósticos são cinco e a ação humana é outra em cada um. O terceiro código
nasceu do `PAP-10`: até ele, o estado **incompleto** — que `migrate` conserta sozinho — saía com o
código cuja ação documentada é "investiga, não rode `migrate`". É o defeito de motivo enumerado que
engole dois diagnósticos ([[gotcha-motivo-enumerado-que-engole-dois-diagnosticos]]) um degrau abaixo de
onde ele foi visto da primeira vez.

**E aqui a divergência muda o código de saída para `3`**, ao contrário da pergunta de privilégio de
`PROVISION-E-VERIFY.md` §13.4. A diferença não é de gravidade, é de resposta: o `REVOKE` daquela
seção não é aplicado por nada versionado, então ela reprovaria em toda rodada de toda máquina, e
controle que reprova sempre é controle que se aprende a ignorar. Este ato **é** versionado e tem um
comando único que o corrige, que é a definição de `3` em `PROVISION-E-VERIFY.md` §12.

## 7.5.1 A pergunta invertida: quem alcança o schema deste cliente?

A §7.5 pergunta se o papel **esperado** está bem formado. O universo dela é uma junção por
`'app_' || nspname`, então tudo que não é o papel esperado está fora do campo de visão. Quatro estados
medidos no quinto gate passavam por ela como `conforme`, e os quatro dão leitura do dado de um cliente
a quem não deveria tê-la: o papel de um cliente com `USAGE` no schema de outro, um papel `LOGIN` fora
do prefixo, o schema concedido a `PUBLIC`, e um papel qualquer feito membro do papel do cliente.

A pergunta que fecha os quatro é uma só, e ela **enumera o que existe** em vez de conferir o que se
espera:

```sql
WITH RECURSIVE legitimo AS (
  SELECT to_regrole(d.role_name)::oid AS oid
    FROM platform.role_declarations d
   WHERE to_regrole(d.role_name) IS NOT NULL
     AND NOT EXISTS (SELECT 1 FROM platform.role_retractions rr WHERE rr.role_name = d.role_name)
     AND ((d.role_kind = 'executor'
           AND EXISTS (SELECT 1 FROM pg_namespace pn
                        WHERE pn.nspname = 'platform' AND pg_get_userbyid(pn.nspowner) = d.role_name))
          OR EXISTS (SELECT 1 FROM pg_auth_members g
                      WHERE g.roleid = to_regrole($1)::oid
                        AND g.member = to_regrole(d.role_name)::oid))
), acima (origem, papel) AS (
  SELECT to_regrole($1)::oid, to_regrole($1)::oid WHERE to_regrole($1) IS NOT NULL
  UNION
  SELECT g.member, g.member FROM pg_auth_members g WHERE g.roleid = to_regrole($1)::oid
  UNION
  SELECT a.origem, m.roleid FROM acima a JOIN pg_auth_members m ON m.member = a.papel
), predefinido AS (
  SELECT DISTINCT a.origem, a.papel FROM acima a
   WHERE a.papel IN (SELECT to_regrole(nome)::oid FROM unnest($3::text[]) AS nome)
)
SELECT n.nspname AS schema_name, 'acl' AS via,
       CASE WHEN g.grantee = 0 THEN 'PUBLIC' ELSE g.grantee::regrole::text END AS alcanca,
       g.privilege_type AS detalhe
  FROM pg_namespace n
  CROSS JOIN LATERAL aclexplode(COALESCE(n.nspacl, acldefault('n', n.nspowner))) AS g
 WHERE n.nspname LIKE 't\_%'
   AND g.grantee IS DISTINCT FROM to_regrole('app_' || n.nspname)::oid
   AND NOT EXISTS (SELECT 1 FROM legitimo l WHERE l.oid = g.grantee)
UNION ALL
SELECT n.nspname, 'membro', m.member::regrole::text,
       concat_ws(' e ', CASE WHEN m.admin_option THEN 'ADMIN OPTION' END,
                        CASE WHEN m.inherit_option THEN 'herança' END)
  FROM pg_namespace n
  JOIN pg_auth_members m ON m.roleid = to_regrole('app_' || n.nspname)::oid
 WHERE n.nspname LIKE 't\_%'
   AND NOT EXISTS (SELECT 1 FROM legitimo l WHERE l.oid = m.member)
UNION ALL
SELECT n.nspname, 'predefinido', p.origem::regrole::text, p.papel::regrole::text
  FROM pg_namespace n CROSS JOIN predefinido p
 WHERE n.nspname LIKE 't\_%'
 ORDER BY 1, 2, 3, 4;
```

O filtro por schema (`$2`) da convergência do `migrate` foi omitido aqui; a forma executada é a de
`db/migrator/src/tenant-reach.ts`. **Revista em 2026-09-23**: a declaração que exclui é a **vigente**,
sem retratação (§7.5.4, `PAP-30`), e a terceira via é o papel predefinido (`SUB-12`), abaixo.

`$1` é o **grupo**, e deixou de ser a credencial no sexto gate. Medido em 2026-09-11 e reconferido em
2026-09-12, PostgreSQL 16.15, executor não-superusuário, dois clientes provisionados pelo ato da §7.3:
**nenhuma linha** no banco íntegro, e exatamente as adulterações quando elas existem.

**Por que `nspacl` basta, e a pergunta não precisa varrer tabela por tabela.** `USAGE` no schema é
ponto de estrangulamento, e isso foi medido nos dois sentidos: papel com `USAGE` no schema e sem
`SELECT` na tabela leva `permission denied for table`; papel com `SELECT` na tabela e sem `USAGE` no
schema leva `permission denied for schema` — sem alcançar o schema, nenhum privilégio de objeto dentro
dele vale. Uma consulta em vez de N, e ela não cresce com o número de tabelas.

**As duas vias existem porque o alcance chega por dois caminhos**, e o segundo não aparece em `nspacl`:
`GRANT app_t_<slug> TO <alguém>` dá ao alguém tudo o que o papel do cliente tem, sem tocar no ACL do
schema. Medido: o papel assim concedido nasce com `inherit_option = t` quando o beneficiário herda —
isto é, ele lê o cliente **sem nem precisar assumir** o papel.

**A terceira via é o papel predefinido do servidor, e ela não tem exclusão** (`SUB-12`). Medido em
2026-09-23, do lado de `apps/api`: um papel `LOGIN` no grupo com `pg_read_all_data` lê os dois clientes
e `platform`, e a saída do `verify` ficava idêntica à base, porque esse alcance não passa por `nspacl`
nem por membro de `app_t_*`. A pergunta sobe a cadeia de `pg_auth_members` a partir do grupo e de cada
membro direto dele e acusa quem chega a `pg_read_all_data`, `pg_write_all_data`,
`pg_read_server_files`, `pg_write_server_files`, `pg_execute_server_program` ou `pg_maintain` (17+).
**Papel declarado inclusive**: nenhum papel deste arranjo precisa de papel predefinido, e desculpá-lo
seria a declaração comprando alcance que ela nunca descreveu. A subida é por `pg_auth_members`, e não
por `pg_has_role`, que responde `true` para superusuário em qualquer pergunta. Fora, com motivo:
`pg_monitor` e os de estatística, que mostram texto de consulta e não dado de tabela (as consultas
deste sistema são parametrizadas); e papel com papel predefinido **fora** do grupo, que é concessão de
superusuário e cai na mesma recusa de enumerar todo papel `LOGIN` do cluster, abaixo.

### A exclusão é identidade declarada, não propriedade do catálogo

Entrou no sétimo gate (`docs/auditorias/2026-09-12-reauditoria-camada-de-papel.md`), e é a correção
que fecha a **classe** que reabriu oito vezes. Some os oito achados desta camada e eles têm uma
anatomia só: a pergunta enumera quem alcança e depois exclui os legítimos por uma **propriedade que o
beneficiário carrega**.

| Exclusão que já esteve aqui | Quem emite essa propriedade | Achado |
|---|---|---|
| `NOT admin_option` sobre o papel do cliente | quem recebe a concessão | `PAP-14` |
| membro de `forja_app` com `LOGIN` ou com `admin_option` | quem entra no grupo, e o executor põe quem quiser | `PAP-20` |
| `g.grantee <> n.nspowner` — o dono do schema | quem roda `ALTER SCHEMA … OWNER TO` | `PAP-22` |
| o nome que vem do ambiente | quem edita o `.env` | `PAP-19` |

**Toda exclusão por propriedade que o excluído carrega é uma exclusão que ele se concede.** Era por
isso que cada conserto abria o buraco seguinte uma casa ao lado, e não por descuido de quem corrigiu.

Então a exclusão passou a ser **nome literal contra `platform.role_declarations`** (§7.5.4), e a regra
que a governa cabe numa frase: **propriedade do catálogo só pode acusar, nunca desculpar.** A
propriedade continua no desenho, sempre do lado que **acrescenta** linha:

- a credencial declarada que **saiu do grupo** volta a ser acusada — a declaração vale enquanto a
  condição que a produziu valer, e tirar do grupo é como a §7.7 encerra a rotação;
- `ADMIN OPTION` e `herança` viraram **descrição** na linha, porque mudam o que a mão humana tem pela
  frente, e não decidem coisa nenhuma;
- o dono do schema deixou de ser exclusão e virou **afirmação** própria (§7.5.4).

Medido em 2026-09-12, PostgreSQL 16.15, com o executor não-superusuário emitindo tudo o que o cenário
permite: a ponte `NOLOGIN` com `ADMIN OPTION` no grupo, a segunda credencial do grupo com concessão
herdável, e o dono de fora saem **os três** em `3`, nomeados — e os três saíam `0` antes, dois deles
**em silêncio**.

**Nem `current_user` nem o dono do schema servem de âncora aqui, e agora nenhum dos dois precisa
servir.** `current_user` faz o mesmo banco responder diferente conforme quem pergunta, numa pergunta
que **veta** com saída `3`: o `verify` do operador acusaria o executor legítimo em todo cliente, que é
o defeito que a §7.7 descreve sobre reprovar a frota inteira.

**Divergência é `tenant_schema_foreign_grant` e saída `3`, e a convergência não a toca.** Corrigir é
`REVOKE`, que o ato da §7.3 não tem: revogar sozinho apagaria privilégio que alguém pode ter concedido
por decisão, e adotá-lo em silêncio é herdar alcance que ninguém declarou. Linha nomeada, evento, mão
humana.

**O que esta pergunta não cobre, declarado, e revisto no oitavo gate:**

- **Quem é membro dos nomes que ela exclui.** Ela enumera o membro **direto** de `app_t_<slug>` e para
  ali. Enquanto a exclusão era propriedade do catálogo isso era inócuo — um membro a mais não
  carregava a propriedade certa e caía na pergunta. Virando nome, `GRANT forja_credencial TO <alguém>`
  passou a entregar todo cliente com `verify` em `0` e zero linha impressa (`PAP-24`, medido). Quem
  responde isso é a **§7.5.5**, e o conjunto esperado lá é vazio.

- Um papel `LOGIN` cunhado pelo executor e que ainda não recebeu alcance nenhum (§7.6) — ele não
  aparece aqui porque não alcança nada, e aparece no instante em que alguém lhe der `USAGE` ou
  membership. Enumerar todo papel `LOGIN` do cluster foi recusado: em máquina de quem desenvolve isso
  acusa papel pessoal em toda rodada, e registro que sempre acusa é registro que ninguém lê. Vale
  igual para um papel `LOGIN` que alguém ponha **dentro** de `forja_app` sem lhe conceder papel de
  cliente nenhum: o grupo não tem privilégio próprio (§7.1), então estar nele não alcança nada.
- O `ADMIN OPTION` que o **executor** tem sobre cada `app_t_*` por tê-los criado. É a durabilidade
  que o `PAP-03` nomeou, ela continua de pé, e retirá-la exigiria um executor que não cria papel —
  o que desfaz a §7.3 inteira. O que mudou é que ela é excluída **por nome declarado**, e não por
  carregar `admin_option`.
- Quem tem a conexão do executor amplia o conjunto declarado rodando `migrate` com outro nome no
  ambiente. **O texto anterior dizia que isso "não é fuga nova, porque esse papel já é dono de todo
  schema de cliente", e o oitavo gate mediu que o argumento não cobre o caso**: o executor cria o
  papel, o declara pelo `.env` e o concede a um terceiro, e o que sobra é uma credencial de login
  separada e permanente, que sobrevive à rotação dele. A linha datada compra **investigação**, não
  detecção; quem detecta é a §7.5.5, que acusa o terceiro. O detalhe, com a medição, está em
  `db/universo-e-declaracao.md`, na lista de ausências declaradas.

## 7.5.2 As duas ausências que só o operador aplica, e que por isso registram sem reprovar

O ato do operador (§7.2) termina em dois `REVOKE`, e nenhum deles é aplicado por coisa versionada. A
§7.7 confere as precondições que **impedem** o executor de trabalhar; estas duas não impedem nada, e
por isso são registro, não veto — o mesmo corte da `PROVISION-E-VERIFY.md` §13.4:

```sql
SELECT
  EXISTS (SELECT 1 FROM pg_namespace n
          CROSS JOIN LATERAL aclexplode(COALESCE(n.nspacl, acldefault('n', n.nspowner))) g
           WHERE n.nspname = 'public' AND g.grantee = 0) AS public_no_schema_public,
  EXISTS (SELECT 1 FROM pg_database d
          CROSS JOIN LATERAL aclexplode(COALESCE(d.datacl, acldefault('d', d.datdba))) g
           WHERE d.datname = current_database()
             AND g.grantee = 0 AND g.privilege_type = 'TEMPORARY') AS public_com_temp;
```

Medido em 2026-09-11, nos dois estados: antes dos `REVOKE`, `t` nas duas colunas; depois, `f` nas duas.
Sem parâmetro, sem privilégio especial. Qualquer coluna verdadeira vira linha nomeada e evento
`public_grant_present`, **sem** mudar o código de saída.

O que cada uma vale, medido no mesmo dia: em 16, `nspacl` do `public` já nasce sem `CREATE` para
`PUBLIC`, então o papel do cliente não planta isca lá — o que sobra é `USAGE`, e ele só importa se
alguém com posse criar objeto naquele schema. Já o `TEMPORARY` do `datacl` vale muito mais do que
parece: com ele, o papel do cliente cria `CREATE TEMP TABLE orders` e, com `search_path` explícito no
schema do cliente, o `orders` **não qualificado** de qualquer corpo de função ou gatilho passa a
resolver para a temporária (medido: 1 linha na temporária contra 3 na tabela real, e o nome qualificado
continuando a ver 3). Como `RECUSAS.md` §11.3 obriga nome não qualificado em todo corpo de migration,
a ausência deste privilégio é o que impede a venda de gravar numa relação que some no fim da sessão.

## 7.5.3, 7.5.4, 7.5.5 e 7.5.6

A §7.5.6, a delegação por dono de objeto (`SUB-09`), mora em **`db/delegacao-por-dono.md`**. As outras
três moram em arquivo próprio: **`db/universo-e-declaracao.md`**. O corte é o mesmo teto de 400 linhas que
partiu o contrato, e a pergunta que o outro arquivo responde é outra — aqui está "quem alcança o
schema deste cliente", lá está "o que existe fora do que declaramos, e quem nós declaramos". Citação
na forma `§7.5.3` continua endereçando a mesma seção.

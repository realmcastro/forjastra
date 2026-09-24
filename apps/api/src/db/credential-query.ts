import { sql, type RawBuilder } from 'kysely';
import { TENANT_ROLE_PREFIX } from './tenant-role.js';

/**
 * A pergunta ao catálogo sobre a própria credencial — o lado do banco de `app-credential.ts`.
 *
 * Mora em arquivo próprio desde 2026-09-12, quando as quatro perguntas viraram seis: o arquivo da
 * decisão passava de 400 linhas com a consulta dentro, e é aqui que a divisão custa menos, porque
 * **a decisão não precisa de banco e a pergunta não decide nada**. Quem muda esta consulta muda o
 * que o servidor consegue ver; quem muda a de lá muda o que ele faz com o que viu.
 *
 * Uma consulta, nenhum privilégio especial: `pg_roles`, `pg_namespace` e `pg_auth_members` são
 * legíveis por qualquer papel, `to_regrole` devolve nulo em vez de erro para nome que não existe, e
 * `has_schema_privilege`/`pg_has_role` respondem sobre quem pergunta.
 *
 * Todo objeto vai **qualificado por `pg_catalog`**, e isso não é estilo: é a mesma razão pela qual
 * fragmento cru não anda solto no caminho de requisição (`backend.md` Nunca). `current_user` e
 * `session_user` são palavras reservadas e não se qualificam — e, por serem reservadas, não há o
 * que as sombreie.
 */

/**
 * **O concedente entra no texto de cada concessão** porque é ele que decide o ato que conserta:
 * `pg_auth_members` tem uma linha por concedente, e o `REVOKE` emitido por outro apaga a linha
 * errada — medido pelo auditor em 2026-09-11 (`Q5`), onde a correção manual óbvia tirou a concessão
 * legítima e deixou a herdável de pé.
 *
 * **`naked_schema_reach` é o `SUB-01`.** `pg_auth_members` guarda concessão de **papel**;
 * `GRANT USAGE ON SCHEMA` mora em `nspacl` e não aparece lá. O reflexo diante de
 * `42501 permission denied for schema t_<slug>` é conceder `USAGE` direto à credencial, e medido em
 * 2026-09-12 (PostgreSQL 16.15) isso põe a credencial **nua** dentro do schema do cliente com as
 * outras perguntas respondendo `ok`. `has_schema_privilege` responde por privilégio **herdado**, e
 * essa é a propriedade certa: com o arranjo íntegro da §7.3 (`WITH INHERIT FALSE, SET TRUE`) ela
 * responde `f` para o schema do próprio cliente, e responde `t` assim que alguém concede direto à
 * credencial **ou a `PUBLIC`** — as duas variantes medidas.
 *
 * `USAGE` e `CREATE` são perguntados porque são os dois privilégios de schema; `USAGE` é o ponto de
 * estrangulamento medido do outro lado da parede (`db/verificacao-do-papel.md` §7.5.1: sem ele,
 * nenhum privilégio de objeto dentro do schema vale), e `CREATE` sem `USAGE` ainda deixa criar
 * objeto no schema alheio.
 *
 * **O universo é `nspname LIKE 't\\_%'` mais o schema de controle** (ver `CONTROL_SCHEMA`). Não é
 * exclusão por propriedade que o excluído carrega: são os dois conjuntos que o sistema protege, e o
 * nome do schema de cliente é contrato dos dois lados (`db/papel-do-cliente.md` §7.1,
 * `src/tenant/schema-name.ts`).
 *
 * **`assumed_inheritable_grants` é o `SUB-02`.** A pergunta sobre herança tem sujeito em
 * `current_user`, e quem executa a consulta de negócio não é ela: é o papel que a transação assume
 * (`tenant-role.ts`). `GRANT app_t_<b> TO app_t_<a> WITH INHERIT TRUE` — uma linha, aceita para o
 * executor não-superusuário — faz o cliente `a` ler o schema de `b` pelo caminho normal de
 * requisição, medido em 2026-09-12, com a subida respondendo `inheritableGrants: []`. O sujeito
 * passa a ser **todo papel que este processo consegue assumir**, que é o que `pg_has_role(…, 'SET')`
 * enumera, e a pergunta sobre cada um é a mesma de sempre.
 *
 * **`assumed_schema_reach` e `assumed_role_attributes` são o `SUB-05`**, e são a quarta célula da
 * matriz: as três anteriores cobriam credencial × papel, credencial × objeto e papel assumido ×
 * papel, e faltava papel assumido × objeto. Medido em 2026-09-12, PostgreSQL 16.15, com a
 * conferência de seis perguntas respondendo **todos** `ok` e emitindo `verified`:
 * `GRANT USAGE ON SCHEMA t_globex TO app_t_acme` — o erro de digitação da §7.3, duas linhas com o
 * mesmo slug — e `BEGIN; SET LOCAL ROLE app_t_acme; SELECT … FROM t_globex.orders` devolve `222`.
 *
 * O sujeito é o mesmo conjunto da pergunta anterior, e por isso os dois leem o **mesmo** `assumidos`:
 * duplicar o predicado seria o jeito de os dois divergirem numa edição futura, com um respondendo
 * sobre um universo que o outro não vê.
 *
 * **A exclusão é o schema do próprio papel**, `'app_' || nspname` — a mesma junção com que o
 * executor verifica o arranjo (§7.1), e identidade que nós escrevemos, nunca isenção que o papel
 * carrega. Para o grupo, que não tem schema, ela nunca casa: o grupo tem de alcançar nada.
 *
 * **O atributo é pergunta separada porque o ato que o conserta é outro.** Papel superusuário
 * responde `t` em `has_schema_privilege` para todo schema (medido), então sem esta coluna a recusa
 * sairia mandando revogar privilégio que ninguém concedeu.
 *
 * **Custo, medido em 2026-09-12** no mesmo container, com a credencial nua: a pergunta de alcance
 * por papel assumido é `O(papéis × schemas)`, e são `74 ms` com 302 schemas de cliente e
 * `360 ms` com 602 — quadrática, confirmada pelos dois pontos. Roda **uma vez por processo**, antes
 * de a porta abrir, nunca no caminho de requisição.
 *
 * **E é por isso que a pergunta é `has_schema_privilege`, e não uma varredura de `nspacl`**, que
 * seria linear em vez de quadrática: **dono** é a terceira via de alcance, ao lado de concessão e
 * atributo, e transferir a posse é uma linha que o executor emite sem ser superusuário. Medido em
 * 2026-09-12, PostgreSQL 16.15, num schema **sem ACL explícito**: depois de
 * `ALTER SCHEMA t_globex OWNER TO app_t_acme`, `has_schema_privilege` passa de `f` para `t` e
 * `nspacl` continua **nulo**, com `aclexplode` devolvendo zero linhas — a varredura não teria o que
 * ler. Num schema que já recebeu a §7.3 o `nspacl` não é nulo e o servidor reescreve a entrada do
 * dono na troca, então ali a varredura enxergaria; o buraco dela é o schema nunca concedido, que é
 * o estado de `platform` e de todo schema recém-criado.
 *
 * **`delegated_dependencies` e `definer_routines` são o `SUB-09`**, e o assunto deixa de ser papel:
 * é o objeto que roda com o privilégio do **dono**. O executor é dono de todo schema de cliente
 * (§7.3), então regra de reescrita, view materializada, view sem `security_invoker` e função
 * `SECURITY DEFINER` criadas por ele no schema de `acme` e apontando para `globex` põem um cliente
 * dentro do outro com `has_schema_privilege` do papel assumido respondendo `f`. Medido pelo auditor
 * em 2026-09-23, PostgreSQL 16.15: a venda de `acme` conclui e grava em `t_globex` pela regra, e a
 * subida respondia os sete `ok`.
 *
 * O critério é **dependência que atravessa**: objeto de um schema protegido que depende de objeto de
 * **outro** schema, qualquer que seja. O arranjo legítimo não tem nenhum (o crivo de migration recusa
 * qualificador de schema alheio, `db/migrator/src/refusals.ts`), então a resposta saudável é vazia
 * por construção, e não por exclusão. O que fica de fora é só a dependência dentro do mesmo schema,
 * que é identidade do catálogo e não propriedade que o dono do objeto escolhe. Por isso **não** se
 * desculpa a view com `security_invoker`: quem a criou desliga a opção com um `ALTER VIEW`. O
 * catálogo do sistema não precisa de exclusão: dependência sobre objeto embutido não vira linha de
 * `pg_depend` (medido em 2026-09-23, zero linhas de objeto de schema protegido sobre `oid < 16384`
 * no arranjo do `migrate` real).
 *
 * **O lado de destino não para nos schemas protegidos**, e isso é medido. Com o destino
 * restrito a `t_*` e `platform`, o dono cria um schema `ext` fora dos dois, põe nele uma view sobre
 * `t_globex` e, no schema de `acme`, uma view sobre a de `ext`: medido em 2026-09-23, a transação de
 * `acme` lê a venda de `globex` pelo salto, e um gatilho em tabela de `acme` chamando rotina
 * `SECURITY DEFINER` de `ext` grava em `t_globex`, com `has_schema_privilege(app_t_acme, ext)`
 * respondendo `f`. Nenhuma das duas pontas atravessava entre schemas protegidos.
 *
 * O `pg_depend` pega mais do que as quatro formas medidas, e as que ele pega a mais também são
 * delegação, medidas aqui em 2026-09-23: chave estrangeira entre dois clientes roda a checagem e o
 * `ON UPDATE CASCADE` como dono da tabela (a transação de `acme` descobre se um id existe em
 * `globex`, e o `UPDATE` dela reescreve linha de `globex`), e herança e partição de tabela entre
 * schemas checam privilégio só no pai (a leitura do pai devolve a linha da filha do outro cliente,
 * e a escrita no pai grava na partição dele).
 *
 * **Função `SECURITY DEFINER` não se julga por dependência.** Medido em 2026-09-23: corpo em
 * `plpgsql` e corpo `sql` entre cifrões não deixam linha nenhuma em `pg_depend` sobre as tabelas
 * que leem; só o corpo `BEGIN ATOMIC` deixa. O corpo é opaco, e o dono é quem alcança tudo, então
 * a pergunta é a existência dela em schema protegido. O mesmo crivo recusa `SECURITY DEFINER` em
 * migration, e a resposta saudável é vazia de novo.
 *
 * `objetos` dá o schema de cada objeto pela coluna de namespace do catálogo dele, e os que não têm
 * coluna própria (regra, gatilho, padrão de coluna, política) herdam o schema da tabela. Os dois
 * lados da dependência leem o mesmo conjunto; só o lado dependente é filtrado aos protegidos.
 *
 * **Custo, medido em 2026-09-23**, credencial nua, 602 schemas de cliente provisionados pela forma
 * da §7.3: com uma tabela por schema, a consulta inteira leva 287–304 ms e a pergunta de delegação,
 * 16 ms; com 11 tabelas, 10 índices e uma view por schema (111 mil linhas em `pg_depend`), a
 * consulta leva 623–686 ms e a delegação, cerca de 330 ms. A delegação é linear no número de
 * objetos do banco; a pergunta de alcance por papel assumido continua sendo a parte quadrática.
 */
/**
 * O schema de controle. **Ele entra no universo das perguntas de alcance** desde 2026-09-12
 * (`SUB-06`): `db/papeis-e-credencial.md` §1 escreve por extenso que *nenhum papel de aplicação
 * recebe `USAGE` em `platform`*, porque lá moram o registro de clientes e o livro-razão, que
 * juntos são a carteira inteira. Era o único invariante de alcance que o repositório tinha escrito,
 * e o único que esta camada não perguntava.
 *
 * Medido em 2026-09-12, PostgreSQL 16.15: com `USAGE` em `platform` concedido à credencial, a
 * subida respondia os seis `ok` e a credencial **nua** lia `platform.tenants` inteiro.
 *
 * Não é exclusão nem inclusão por propriedade de beneficiário: é o segundo conjunto que o sistema
 * protege, nomeado por identidade que nós escrevemos. `public` fica de fora porque `USAGE` nele é
 * concedido a `PUBLIC` pelo servidor, e o que o tira de circulação é o `REVOKE` da §7.2 — outra
 * pergunta, de outro dono.
 */
export const CONTROL_SCHEMA = 'platform';

export function credentialQuery(groupRole: string): RawBuilder<CredentialRow> {
  return sql<CredentialRow>`
WITH me AS (
  SELECT r.oid, r.rolcanlogin, r.rolsuper
    FROM pg_catalog.pg_roles r
   WHERE r.rolname = current_user
), grp AS (
  SELECT pg_catalog.to_regrole(${groupRole}) AS oid
), assumidos AS (
  SELECT r.oid, r.rolname, r.rolsuper, r.rolbypassrls
    FROM pg_catalog.pg_roles r
   WHERE pg_catalog.pg_has_role(current_user, r.oid, 'SET')
     AND r.oid IS DISTINCT FROM (SELECT oid FROM me)
), protegidos AS (
  SELECT n.oid, n.nspname
    FROM pg_catalog.pg_namespace n
   WHERE n.nspname LIKE 't\\_%'
      OR n.nspname::text = ${CONTROL_SCHEMA}
), objetos AS (
  SELECT 'pg_catalog.pg_class'::pg_catalog.regclass AS classid, c.oid AS objid, c.relnamespace AS nsp
    FROM pg_catalog.pg_class c
  UNION ALL
  SELECT 'pg_catalog.pg_proc'::pg_catalog.regclass, p.oid, p.pronamespace
    FROM pg_catalog.pg_proc p
  UNION ALL
  SELECT 'pg_catalog.pg_type'::pg_catalog.regclass, t.oid, t.typnamespace
    FROM pg_catalog.pg_type t
  UNION ALL
  SELECT 'pg_catalog.pg_constraint'::pg_catalog.regclass, k.oid, k.connamespace
    FROM pg_catalog.pg_constraint k
  UNION ALL
  SELECT 'pg_catalog.pg_operator'::pg_catalog.regclass, o.oid, o.oprnamespace
    FROM pg_catalog.pg_operator o
  UNION ALL
  SELECT 'pg_catalog.pg_rewrite'::pg_catalog.regclass, r.oid, c.relnamespace
    FROM pg_catalog.pg_rewrite r JOIN pg_catalog.pg_class c ON c.oid = r.ev_class
  UNION ALL
  SELECT 'pg_catalog.pg_trigger'::pg_catalog.regclass, g.oid, c.relnamespace
    FROM pg_catalog.pg_trigger g JOIN pg_catalog.pg_class c ON c.oid = g.tgrelid
  UNION ALL
  SELECT 'pg_catalog.pg_attrdef'::pg_catalog.regclass, a.oid, c.relnamespace
    FROM pg_catalog.pg_attrdef a JOIN pg_catalog.pg_class c ON c.oid = a.adrelid
  UNION ALL
  SELECT 'pg_catalog.pg_policy'::pg_catalog.regclass, po.oid, c.relnamespace
    FROM pg_catalog.pg_policy po JOIN pg_catalog.pg_class c ON c.oid = po.polrelid
)
SELECT current_user::text AS current_role_name,
       session_user::text AS session_role_name,
       (SELECT oid FROM me) IS NOT NULL AS role_exists,
       coalesce((SELECT rolcanlogin FROM me), false) AS role_can_login,
       coalesce((SELECT rolsuper FROM me), false) AS role_is_superuser,
       (SELECT oid FROM grp) IS NOT NULL AS group_exists,
       EXISTS (SELECT 1 FROM pg_catalog.pg_auth_members m
                WHERE m.roleid = (SELECT oid FROM grp) AND m.member = (SELECT oid FROM me)
                  AND NOT m.admin_option) AS in_group,
       EXISTS (SELECT 1 FROM pg_catalog.pg_auth_members m
                WHERE m.roleid = (SELECT oid FROM grp) AND m.member = (SELECT oid FROM me)
                  AND m.admin_option) AS administers_group,
       coalesce((SELECT pg_catalog.array_agg(DISTINCT granted.rolname::text ||
                          ' (concedido por ' || grantor.rolname::text || ')')
                   FROM pg_catalog.pg_auth_members m
                   JOIN pg_catalog.pg_roles granted ON granted.oid = m.roleid
                   JOIN pg_catalog.pg_roles grantor ON grantor.oid = m.grantor
                  WHERE m.member = (SELECT oid FROM me) AND m.inherit_option),
                '{}'::text[]) AS inheritable_grants,
       coalesce((SELECT pg_catalog.array_agg(DISTINCT s.nspname::text || ' (' || p.priv || ')')
                   FROM protegidos s
                   CROSS JOIN LATERAL (VALUES ('USAGE'), ('CREATE')) AS p(priv)
                  WHERE pg_catalog.has_schema_privilege(current_user, s.oid, p.priv)),
                '{}'::text[]) AS naked_schema_reach,
       coalesce((SELECT pg_catalog.array_agg(DISTINCT assumido.rolname::text || ' herda ' ||
                          granted.rolname::text || ' (concedido por ' || grantor.rolname::text || ')')
                   FROM assumidos assumido
                   JOIN pg_catalog.pg_auth_members m
                     ON m.member = assumido.oid AND m.inherit_option
                   JOIN pg_catalog.pg_roles granted ON granted.oid = m.roleid
                   JOIN pg_catalog.pg_roles grantor ON grantor.oid = m.grantor),
                '{}'::text[]) AS assumed_inheritable_grants,
       coalesce((SELECT pg_catalog.array_agg(DISTINCT assumido.rolname::text || ' -> ' ||
                          s.nspname::text || ' (' || p.priv || ')')
                   FROM assumidos assumido
                   CROSS JOIN protegidos s
                   CROSS JOIN LATERAL (VALUES ('USAGE'), ('CREATE')) AS p(priv)
                  WHERE assumido.rolname::text IS DISTINCT FROM ${TENANT_ROLE_PREFIX} || s.nspname::text
                    AND pg_catalog.has_schema_privilege(assumido.oid, s.oid, p.priv)),
                '{}'::text[]) AS assumed_schema_reach,
       coalesce((SELECT pg_catalog.array_agg(DISTINCT assumido.rolname::text || ' (' || a.marca || ')')
                   FROM assumidos assumido
                   CROSS JOIN LATERAL (VALUES ('SUPERUSER', assumido.rolsuper),
                                             ('BYPASSRLS', assumido.rolbypassrls)) AS a(marca, tem)
                  WHERE a.tem),
                '{}'::text[]) AS assumed_role_attributes,
       coalesce((SELECT pg_catalog.array_agg(DISTINCT
                          pg_catalog.pg_describe_object(d.classid, d.objid, 0) || ' (' ||
                          de.nspname::text || ' -> ' || para.nspname::text || ')')
                   FROM pg_catalog.pg_depend d
                   JOIN objetos dep ON dep.classid = d.classid AND dep.objid = d.objid
                   JOIN objetos ref ON ref.classid = d.refclassid AND ref.objid = d.refobjid
                   JOIN protegidos de ON de.oid = dep.nsp
                   JOIN pg_catalog.pg_namespace para ON para.oid = ref.nsp
                  WHERE dep.nsp <> ref.nsp),
                '{}'::text[]) AS delegated_dependencies,
       coalesce((SELECT pg_catalog.array_agg(DISTINCT
                          pg_catalog.pg_describe_object('pg_catalog.pg_proc'::pg_catalog.regclass, p.oid, 0) ||
                          ' (' || s.nspname::text || ', dono ' || dono.rolname::text || ')')
                   FROM pg_catalog.pg_proc p
                   JOIN protegidos s ON s.oid = p.pronamespace
                   JOIN pg_catalog.pg_roles dono ON dono.oid = p.proowner
                  WHERE p.prosecdef),
                '{}'::text[]) AS definer_routines
`;
}

export interface CredentialRow {
  readonly current_role_name: string;
  readonly session_role_name: string;
  readonly role_exists: boolean;
  readonly role_can_login: boolean;
  readonly role_is_superuser: boolean;
  readonly group_exists: boolean;
  readonly in_group: boolean;
  readonly administers_group: boolean;
  readonly inheritable_grants: readonly string[];
  readonly naked_schema_reach: readonly string[];
  readonly assumed_inheritable_grants: readonly string[];
  readonly assumed_schema_reach: readonly string[];
  readonly assumed_role_attributes: readonly string[];
  readonly delegated_dependencies: readonly string[];
  readonly definer_routines: readonly string[];
}

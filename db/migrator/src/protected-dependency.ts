import type pg from 'pg';

/**
 * `db/delegacao-por-dono.md` §7.5.6, o `SUB-09`: **a delegação por dono de objeto.** Duas
 * afirmações de conjunto vazio sobre os schemas protegidos, que são `platform` e todo `t_*`: nenhum
 * objeto deles depende de objeto de **outro schema, qualquer que seja**, e nenhuma rotina deles é
 * `SECURITY DEFINER`. O critério é o mesmo da pergunta `delegation` da subida de `apps/api`
 * (`apps/api/src/db/credential-query.ts`), de propósito: dois critérios para o mesmo estado são dois
 * lados da parede para desencontrar.
 *
 * O quinto mecanismo de alcance é a delegação por dono de objeto. Medido do outro lado da parede em
 * 2026-09-23, com o executor não-superusuário criando à mão, em `t_acme`, um objeto que roda com o
 * privilégio dele e aponta para `t_globex`: a regra de reescrita grava no outro cliente **com a venda
 * concluindo em sucesso**, e a view materializada entrega a leitura. `has_schema_privilege` continua
 * `f` nos quatro estados, então nenhuma pergunta de alcance o vê: o objeto mora no schema do próprio
 * cliente, onde o papel dele tem `USAGE`.
 *
 * **O conjunto esperado é vazio, por construção.** O crivo recusa qualificador de outro schema nas
 * duas streams (`RECUSAS.md` §11.3) e recusa `SECURITY DEFINER` (§11.5), e o executor fixa o
 * `search_path` no alvo, então migration nossa não produz nenhuma das duas coisas. Qualquer linha
 * aqui é drift.
 *
 * **O destino não para nos schemas protegidos**, e isso foi medido pelo `backend` em 2026-09-23: com
 * o destino restrito a `t_*` e `platform`, uma view de `acme` sobre uma view num schema `ext`, que lê
 * `t_globex`, entregava a venda do outro cliente pelo salto, e nenhuma ponta atravessava entre
 * protegidos. O catálogo do sistema não pede exclusão: dependência sobre objeto embutido não vira
 * linha em `pg_depend`. **A view com `security_invoker` não é desculpada**: quem a criou desliga a
 * opção com um `ALTER VIEW`, então ela é propriedade que o dono do objeto emite.
 *
 * **Por que o dono de cada lado é resolvido por catálogo, e não por `pg_identify_object`.** Medido em
 * 2026-09-23, PostgreSQL 16.15: ela devolve `schema` nulo para regra, gatilho e default de coluna, que
 * são justamente três das formas que atravessam. Então o schema de cada objeto sai da coluna de
 * namespace do catálogo dele, ou da relação a que ele pertence. Uma junção por catálogo, e não uma
 * subconsulta por linha de `pg_depend`: a tabela cresce com o número de objetos de todos os clientes.
 *
 * **Rotina `SECURITY DEFINER` se acusa por existência, e não por dependência.** Corpo em PL/pgSQL
 * e corpo `sql` entre cifrões não deixam linha em `pg_depend` sobre o que leem (medido: só `BEGIN
 * ATOMIC` deixa), e o dono é quem alcança tudo. Rotina comum em PL/pgSQL lendo outro schema continua
 * sem dependência, e quem a pega é a comparação de estrutura (`sobra: funcao`): ela roda com o
 * privilégio de quem chama, então o alcance dela é o do papel do cliente, que as outras perguntas
 * cobrem.
 */
const PROTECTED_DEPENDENCY_SQL = `
WITH protegido AS (
  SELECT oid, nspname FROM pg_namespace WHERE nspname = 'platform' OR nspname LIKE 't\\_%'
), dono (classid, objid, nsp) AS (
            SELECT 'pg_class'::regclass::oid, c.oid, c.relnamespace FROM pg_class c
  UNION ALL SELECT 'pg_proc'::regclass::oid, p.oid, p.pronamespace FROM pg_proc p
  UNION ALL SELECT 'pg_type'::regclass::oid, t.oid, t.typnamespace FROM pg_type t
  UNION ALL SELECT 'pg_constraint'::regclass::oid, k.oid, k.connamespace FROM pg_constraint k
  UNION ALL SELECT 'pg_operator'::regclass::oid, o.oid, o.oprnamespace FROM pg_operator o
  UNION ALL SELECT 'pg_opclass'::regclass::oid, o.oid, o.opcnamespace FROM pg_opclass o
  UNION ALL SELECT 'pg_opfamily'::regclass::oid, o.oid, o.opfnamespace FROM pg_opfamily o
  UNION ALL SELECT 'pg_collation'::regclass::oid, o.oid, o.collnamespace FROM pg_collation o
  UNION ALL SELECT 'pg_conversion'::regclass::oid, o.oid, o.connamespace FROM pg_conversion o
  UNION ALL SELECT 'pg_statistic_ext'::regclass::oid, o.oid, o.stxnamespace FROM pg_statistic_ext o
  UNION ALL SELECT 'pg_ts_config'::regclass::oid, o.oid, o.cfgnamespace FROM pg_ts_config o
  UNION ALL SELECT 'pg_ts_dict'::regclass::oid, o.oid, o.dictnamespace FROM pg_ts_dict o
  UNION ALL SELECT 'pg_namespace'::regclass::oid, n.oid, n.oid FROM pg_namespace n
  UNION ALL SELECT 'pg_attrdef'::regclass::oid, a.oid, c.relnamespace
              FROM pg_attrdef a JOIN pg_class c ON c.oid = a.adrelid
  UNION ALL SELECT 'pg_trigger'::regclass::oid, g.oid, c.relnamespace
              FROM pg_trigger g JOIN pg_class c ON c.oid = g.tgrelid
  UNION ALL SELECT 'pg_rewrite'::regclass::oid, r.oid, c.relnamespace
              FROM pg_rewrite r JOIN pg_class c ON c.oid = r.ev_class
  UNION ALL SELECT 'pg_policy'::regclass::oid, y.oid, c.relnamespace
              FROM pg_policy y JOIN pg_class c ON c.oid = y.polrelid
)
SELECT DISTINCT po.nspname AS schema_name,
       pg_describe_object(d.classid, d.objid, 0) AS objeto,
       pr.nspname AS alvo_schema,
       pg_describe_object(d.refclassid, d.refobjid, 0) AS alvo
  FROM pg_depend d
  JOIN dono o ON o.classid = d.classid AND o.objid = d.objid
  JOIN protegido po ON po.oid = o.nsp
  JOIN dono r ON r.classid = d.refclassid AND r.objid = d.refobjid
  JOIN pg_namespace pr ON pr.oid = r.nsp
 WHERE po.oid <> pr.oid
 ORDER BY 1, 2, 3, 4
`;

const DEFINER_ROUTINES_SQL = `
SELECT n.nspname AS schema_name,
       pg_describe_object('pg_proc'::regclass, p.oid, 0) AS rotina,
       pg_get_userbyid(p.proowner) AS dono
  FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
 WHERE (n.nspname = 'platform' OR n.nspname LIKE 't\\_%') AND p.prosecdef
 ORDER BY 1, 2
`;

/** Uma linha por par (objeto de schema protegido, objeto de outro schema). Banco íntegro: nenhuma. */
export interface ProtectedDependencyRow {
  readonly schema_name: string;
  readonly objeto: string;
  readonly alvo_schema: string;
  readonly alvo: string;
}

export async function readProtectedDependencies(
  client: pg.Client,
): Promise<readonly ProtectedDependencyRow[]> {
  const result = await client.query<ProtectedDependencyRow>(PROTECTED_DEPENDENCY_SQL);
  return result.rows;
}

export function describeProtectedDependency(row: ProtectedDependencyRow): string {
  return (
    `${row.objeto}, no schema "${row.schema_name}", depende de ${row.alvo}, no schema ` +
    `"${row.alvo_schema}": o objeto roda com o privilégio do dono e alcança o outro schema sem que ` +
    'o papel do cliente precise de acesso a ele. Nenhuma migration nossa produz isso; remover o ' +
    'objeto é mão humana, depois de saber quem o criou (db/delegacao-por-dono.md §7.5.6)'
  );
}

/** Uma linha por rotina `SECURITY DEFINER` em schema protegido. Banco íntegro: nenhuma. */
export interface DefinerRoutineRow {
  readonly schema_name: string;
  readonly rotina: string;
  readonly dono: string;
}

export async function readDefinerRoutines(client: pg.Client): Promise<readonly DefinerRoutineRow[]> {
  const result = await client.query<DefinerRoutineRow>(DEFINER_ROUTINES_SQL);
  return result.rows;
}

export function describeDefinerRoutine(row: DefinerRoutineRow): string {
  return (
    `${row.rotina}, no schema "${row.schema_name}", é SECURITY DEFINER e roda com o privilégio de ` +
    `"${row.dono}": o corpo não deixa rastro em pg_depend, e o dono alcança todo schema nosso. ` +
    'Nenhuma migration nossa cria rotina assim (RECUSAS.md §11.5); remover é mão humana ' +
    '(db/delegacao-por-dono.md §7.5.6)'
  );
}

import type pg from 'pg';
import { EXECUTOR_STILL_LEGITIMATE_SQL } from './role-declarations.js';
import { DECLARATION_IN_FORCE_SQL } from './role-retractions.js';

/**
 * **§7.5.3**, o universo — que schemas existem, e o que mora em `public` —, e **§7.5.4**, o dono de
 * cada schema nosso. As duas em `db/verificacao-do-papel.md`.
 *
 * Elas saíram de `tenant-reach.ts` no sétimo gate, quando a §7.5.4 nasceu: aquele arquivo responde
 * "quem alcança o schema deste cliente", estas respondem "o que existe fora do que declaramos". São
 * perguntas diferentes, e o teto de 400 linhas de `00-nucleo.md` §8 chegou junto.
 *
 * As duas são **read-only** e não pedem privilégio nenhum além de ler o catálogo.
 */

/**
 * §7.5.3. As perguntas de papel e a comparação estrutural olham `platform` e cada `t_*`: **o que mora
 * num terceiro schema está fora do campo de visão de tudo**, e é o `PAP-15`. Medido no sexto gate:
 * uma view em `public` unindo `t_acme.orders` e `t_globex.orders` devolve os dois clientes **para a
 * credencial nua**, porque a view roda com o privilégio de quem a criou e o papel do cliente sai do
 * caminho.
 *
 * A afirmação é: **os schemas não-sistema são exatamente `platform` e `t_*`, e `public` está vazio.**
 *
 * **A exclusão de objeto de extensão era controlada por quem ataca, e é o `PAP-21`.** Até o sétimo
 * gate bastava `pg_depend` com `deptype = 'e'` para o objeto sumir desta pergunta, e a justificativa
 * escrita era que "quem planta a isca não tem como pendurá-la numa extensão sem primeiro poder criar
 * extensão, que é privilégio de outro nível". **A premissa estava errada**, e eu a medi nos dois
 * sentidos em 2026-09-12, PostgreSQL 16.15: extensão **confiável** é criável por não-superusuário
 * desde o PostgreSQL 13, o executor criou `pgcrypto` e virou dono dela (`extowner = forja_executor`),
 * e `ALTER EXTENSION pgcrypto ADD VIEW public.v_isca` devolveu o `verify` de `3` para `0`, com a
 * credencial nua lendo dois clientes pela view.
 *
 * **A necessidade que a exclusão atende é real e continua atendida**: reprovar todo objeto de
 * extensão faria o controle acusar qualquer máquina com `pgcrypto` instalada em `public`, e a §7.5 já
 * diz o que acontece com controle que reprova sempre. O que muda é o mecanismo, em duas partes:
 *
 * 1. **a extensão só desculpa o objeto cujo dono é superusuário.** Medido em 2026-09-12: o executor
 *    não-superusuário instalou `pgcrypto` (`extowner = forja_executor`) e as 36 rotinas dela nasceram
 *    com `proowner = postgres` — extensão confiável roda o script dela como o superusuário de
 *    origem, e é por isso que o dono do **objeto** separa o que veio da extensão do que alguém
 *    pendurou nela. A view do ataque continuou com `relowner = forja_executor` depois do
 *    `ALTER EXTENSION … ADD`, porque aquele comando muda a dependência e **não** muda a posse. Um
 *    não-superusuário não produz objeto de dono superusuário por SQL: `CREATE ROLE … SUPERUSER`,
 *    `SET ROLE` e `ALTER … OWNER TO` para superusuário são todos negados a ele;
 * 2. **referência a schema nosso acusa, e nenhuma exclusão a alcança.** Objeto em `public` cuja
 *    definição referencia `platform` ou `t_*` é nomeado mesmo dentro de extensão de superusuário. É
 *    a parte que fecha a classe: a primeira regra ainda é uma propriedade, e esta é a acusação que
 *    não depende de propriedade nenhuma.
 *
 * Para relação, "referencia" sai de `pg_depend` sobre a regra de reescrita, que é fato do catálogo.
 * Para rotina, sai do corpo por expressão regular, e isso é **heurística declarada**: corpo que monta
 * SQL dinâmico escapa dela. Heurística que só **acrescenta** linha é segura; a que exclui é o defeito
 * que este gate inteiro corrigiu.
 */
const SCHEMA_UNIVERSE_SQL = `
SELECT n.nspname AS nome, 'schema' AS especie, pg_get_userbyid(n.nspowner) AS dono, '' AS motivo
  FROM pg_namespace n
 WHERE n.nspname NOT LIKE 'pg\\_%'
   AND n.nspname <> 'information_schema'
   AND n.nspname <> 'public'
   AND n.nspname <> 'platform'
   AND n.nspname NOT LIKE 't\\_%'
UNION ALL
SELECT 'public.' || c.relname, 'relacao ' || c.relkind::text, pg_get_userbyid(c.relowner),
       CASE WHEN EXISTS (SELECT 1 FROM pg_depend dr
                           JOIN pg_rewrite rw ON rw.oid = dr.objid
                                             AND dr.classid = 'pg_rewrite'::regclass
                           JOIN pg_class ref ON ref.oid = dr.refobjid
                           JOIN pg_namespace rn ON rn.oid = ref.relnamespace
                          WHERE rw.ev_class = c.oid
                            AND (rn.nspname = 'platform' OR rn.nspname LIKE 't\\_%'))
            THEN 'e a definição dela referencia schema nosso'
            ELSE '' END
  FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
 WHERE n.nspname = 'public'
   AND c.relkind IN ('r', 'p', 'v', 'm', 'f', 'S')
   AND (NOT (EXISTS (SELECT 1 FROM pg_depend d
                      WHERE d.classid = 'pg_class'::regclass AND d.objid = c.oid
                        AND d.deptype = 'e' AND d.refclassid = 'pg_extension'::regclass)
             AND EXISTS (SELECT 1 FROM pg_roles r WHERE r.oid = c.relowner AND r.rolsuper))
        OR EXISTS (SELECT 1 FROM pg_depend dr
                     JOIN pg_rewrite rw ON rw.oid = dr.objid
                                       AND dr.classid = 'pg_rewrite'::regclass
                     JOIN pg_class ref ON ref.oid = dr.refobjid
                     JOIN pg_namespace rn ON rn.oid = ref.relnamespace
                    WHERE rw.ev_class = c.oid
                      AND (rn.nspname = 'platform' OR rn.nspname LIKE 't\\_%')))
UNION ALL
SELECT 'public.' || p.proname, 'rotina', pg_get_userbyid(p.proowner),
       CASE WHEN p.prosrc ~* '(^|[^a-z0-9_])(platform|t_[a-z0-9_]+)[[:space:]]*\\.'
            THEN 'e o corpo dela referencia schema nosso'
            ELSE '' END
  FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
 WHERE n.nspname = 'public'
   AND (NOT (EXISTS (SELECT 1 FROM pg_depend d
                      WHERE d.classid = 'pg_proc'::regclass AND d.objid = p.oid
                        AND d.deptype = 'e' AND d.refclassid = 'pg_extension'::regclass)
             AND EXISTS (SELECT 1 FROM pg_roles r WHERE r.oid = p.proowner AND r.rolsuper))
        OR p.prosrc ~* '(^|[^a-z0-9_])(platform|t_[a-z0-9_]+)[[:space:]]*\\.')
 ORDER BY 1
`;

/** Uma linha por coisa fora do universo declarado. Banco íntegro devolve **nenhuma**. */
export interface SchemaUniverseRow {
  readonly nome: string;
  /** `schema`, quando é um namespace a mais; `relacao <relkind>` ou `rotina`, quando mora em `public`. */
  readonly especie: string;
  readonly dono: string;
  /** Vazio, ou a razão que **nenhuma** exclusão alcança: o objeto referencia `platform` ou `t_*`. */
  readonly motivo: string;
}

export async function readSchemaUniverseRows(
  client: pg.Client,
): Promise<readonly SchemaUniverseRow[]> {
  const result = await client.query<SchemaUniverseRow>(SCHEMA_UNIVERSE_SQL);
  return result.rows;
}

export function isExtraSchema(row: SchemaUniverseRow): boolean {
  return row.especie === 'schema';
}

export function describeUniverse(row: SchemaUniverseRow): string {
  if (isExtraSchema(row)) {
    return `o schema "${row.nome}" existe e não é platform nem t_* (dono: ${row.dono})`;
  }
  const base = `"${row.nome}" existe no schema public — ${row.especie}, dono: ${row.dono}`;
  return row.motivo === '' ? base : `${base}, ${row.motivo}`;
}

/**
 * §7.5.4, o `PAP-22`. **O dono de `platform` e de cada `t_*` é afirmado**, e não usado como exclusão.
 *
 * Medido em 2026-09-12, PostgreSQL 16.15, com o executor **não-superusuário**:
 * `CREATE ROLE probe_dono LOGIN` · `GRANT probe_dono TO forja_executor` ·
 * `ALTER SCHEMA t_acme OWNER TO probe_dono` · `GRANT SELECT ON ALL TABLES IN SCHEMA t_acme` — e
 * `probe_dono`, que não é membro de `forja_app` nem de papel de cliente nenhum, lê `t_acme.orders`,
 * com `verify` e `migrate` saindo `0` e nada sendo nomeado. O `nspacl` resultante era
 * `{probe_dono=UC/probe_dono,app_t_acme=U/probe_dono}`: a entrada sumia da §7.5.1 porque a pergunta
 * excluía o dono, e o `USAGE`, que é o ponto de estrangulamento declarado, vinha da própria posse.
 *
 * **O dono não é só leitura.** Ele pode `DROP SCHEMA … CASCADE`: o mesmo estado invisível é caminho
 * de destruição do dado de um cliente.
 *
 * A afirmação usa a mesma fonte da §7.5.1 — `platform.role_declarations` —, então não há um segundo
 * conceito de "quem é legítimo" para desencontrar do primeiro. Um executor novo passa a poder ser
 * dono no instante em que a rodada dele o declara, e não antes.
 *
 * **E ela pede a condição de permanência do executor (`PAP-25`), não só a declaração.** Medido em
 * 2026-09-12: um `INSERT` cru na tabela declarava um papel de fora como `executor`, e daí
 * `ALTER SCHEMA t_acme OWNER TO <ele>` passava por esta pergunta sem uma linha, porque o dono **era**
 * executor declarado. Com a condição, só o dono de `platform` desculpa a posse de schema nosso — e
 * mover a posse de `platform` desarma o executor legítimo na mesma passada, que é o que impede a
 * condição de ser propriedade que o beneficiário se concede.
 */
const SCHEMA_OWNER_SQL = `
SELECT n.nspname AS schema_name, pg_get_userbyid(n.nspowner) AS dono
  FROM pg_namespace n
 WHERE (n.nspname = 'platform' OR n.nspname LIKE 't\\_%')
   AND NOT EXISTS (SELECT 1 FROM platform.role_declarations d
                    WHERE d.role_kind = 'executor'
                      AND d.role_name = pg_get_userbyid(n.nspowner)
                      AND ${DECLARATION_IN_FORCE_SQL}
                      AND ${EXECUTOR_STILL_LEGITIMATE_SQL})
 ORDER BY 1
`;

/**
 * Uma linha por schema nosso cujo dono não é o executor declarado que ainda vale. Banco íntegro
 * devolve **nenhuma**.
 */
export interface SchemaOwnerRow {
  readonly schema_name: string;
  readonly dono: string;
}

export async function readUnexpectedOwners(
  client: pg.Client,
): Promise<readonly SchemaOwnerRow[]> {
  const result = await client.query<SchemaOwnerRow>(SCHEMA_OWNER_SQL);
  return result.rows;
}

export function describeOwner(row: SchemaOwnerRow): string {
  return (
    `o schema "${row.schema_name}" pertence a "${row.dono}", que não é executor declarado em ` +
    'platform.role_declarations, ou é e já não é dono de platform, ou teve a declaração retratada ' +
    '(§7.5.4): o dono lê tudo o que há ' +
    'ali e pode derrubar o schema. Devolver a posse é mão humana — ALTER SCHEMA ... OWNER TO ' +
    '<executor>, na conexão de quem pode emiti-lo'
  );
}

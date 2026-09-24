import type pg from 'pg';
import { refused } from './errors.js';

/**
 * `platform.role_retractions`: `db/universo-e-declaracao.md` §7.5.4, "Retirar uma declaração", e o
 * `PAP-30`.
 *
 * A declaração é append-only e não tinha saída: a credencial aposentada no fim da rotação da §7.7
 * continuava sendo nomeada em todo `verify`, com uma instrução que já tinha sido cumprida, e N
 * rotações deixavam N linhas iguais escondendo a que importa. A retratação é **linha nova**, escrita
 * pelo operador, e a declaração vigente de um papel é a que não tem retratação.
 *
 * **Ela só estreita.** Toda pergunta que exclui por declaração passa a excluir só a vigente; nenhuma
 * pergunta que acusa passa a acusar menos. Então quem escreve aqui, seja quem for, só consegue fazer o
 * `verify` acusar mais, e é por isso que a tabela não precisa de trava contra o executor, que é o
 * dono dela.
 *
 * Mora fora de `role-declarations.ts` pelo teto de 400 linhas, e porque o sujeito é outro: lá está
 * quem nós dissemos que é legítimo, aqui está quem o operador disse que deixou de ser.
 */

/**
 * O fragmento que faz de uma declaração a **vigente**. Correlacionado a `d.role_name`, sem parâmetro,
 * e usado em todo ponto que **exclui** por declaração: a §7.5.1 (`tenant-reach.ts`), a afirmação de
 * dono (`schema-universe.ts`), as declarações a mais e a conferência do ato. Uma definição só, pela
 * mesma razão de `EXECUTOR_STILL_LEGITIMATE_SQL`: duas produziriam dois conceitos de "vale" para
 * desencontrar.
 *
 * Quem **acusa** por declaração não o usa, de propósito: a §7.5.5 continua perguntando pelos membros
 * de todo nome declarado, e a pergunta pelo papel de banco continua conferindo herança de toda
 * credencial declarada. Retratação que tirasse nome de pergunta que acusa seria a retratação
 * desculpando, que é o que ela não pode fazer.
 */
export const DECLARATION_IN_FORCE_SQL = `
  NOT EXISTS (SELECT 1 FROM platform.role_retractions rr WHERE rr.role_name = d.role_name)
`;

const TABLE_EXISTS_SQL = `
select 1
  from pg_class c join pg_namespace n on n.oid = c.relnamespace
 where n.nspname = 'platform' and c.relname = 'role_retractions' and c.relkind = 'r'
`;

export async function roleRetractionsExist(client: pg.Client): Promise<boolean> {
  const result = await client.query(TABLE_EXISTS_SQL);
  return result.rowCount === 1;
}

const RETRACTED_AMONG_SQL = `
select role_name, retracted_by,
       to_char(retracted_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as retracted_at
  from platform.role_retractions
 where role_name = any($1::text[])
 order by role_name collate "C"
`;

interface RetractedRow {
  readonly role_name: string;
  readonly retracted_by: string;
  readonly retracted_at: string;
}

/**
 * A recusa de `provision` e de `migrate` quando o arranjo desta rodada nomeia um papel retratado.
 *
 * Saída `2`, a mesma classe da recusa de borda da §7.7: o que está errado é o ambiente ou a conexão,
 * não algo versionado que um comando converge. Seguir adiante seria pior que parar: a declaração
 * não volta (a `0011` tem `UNIQUE (role_name)`), então a rodada trabalharia com um papel que a §7.5.1
 * acusa como terceiro, e a primeira convergência de cliente recusaria no meio.
 */
export async function assertNoneRetracted(
  client: pg.Client,
  names: readonly string[],
): Promise<void> {
  if (!(await roleRetractionsExist(client))) {
    throw refused(
      'platform.role_retractions não existe neste banco, e sem ela não há como saber se o arranjo ' +
        'desta rodada foi retratado (db/universo-e-declaracao.md §7.5.4). Ela nasce em ' +
        'platform/0014__role_retractions.sql: o conjunto de migrations desta rodada não a tem, ' +
        'então nada de papel foi tocado.',
    );
  }
  const result = await client.query<RetractedRow>(RETRACTED_AMONG_SQL, [names]);
  if (result.rows.length === 0) return;

  const linhas = result.rows
    .map(
      (row) =>
        `"${row.role_name}" teve a declaração retratada por "${row.retracted_by}" em ` +
        row.retracted_at,
    )
    .join('; ');
  throw refused(
    `esta rodada nomeia papel cuja declaração foi retratada: ${linhas}. A retratação é terminal: ` +
      'o nome não volta a ser declarado, e quem precisa daquele papel de novo cria outro nome pelo ' +
      'ato do operador (db/universo-e-declaracao.md §7.5.4). Nada foi aplicado a papel de cliente.',
  );
}

/**
 * As declarações **vigentes**, com o estado de cada uma no catálogo: é o que a pergunta das
 * declarações a mais precisa para não dar a instrução errada (`PAP-30`, e antes dele o `PAP-27`):
 * a credencial que já saiu do grupo e não tem papel de cliente não tem mais o que tirar, e mandar
 * tirar é a instrução para um estado que já está certo.
 *
 * `$1` é o grupo. `papeis_de_cliente` conta de quantos `app_t_*` o papel é membro, por qualquer
 * concessão.
 */
const IN_FORCE_WITH_STATE_SQL = `
select d.role_name, d.role_kind, d.declared_by,
       to_regrole(d.role_name) is not null as existe,
       exists (select 1 from pg_auth_members g
                where g.roleid = to_regrole($1)::oid
                  and g.member = to_regrole(d.role_name)::oid) as no_grupo,
       (select count(distinct m.roleid) from pg_auth_members m
          join pg_roles r on r.oid = m.roleid
         where m.member = to_regrole(d.role_name)::oid
           and r.rolname like 'app\\_t\\_%')::int as papeis_de_cliente
  from platform.role_declarations d
 where ${DECLARATION_IN_FORCE_SQL}
 order by d.role_name collate "C"
`;

export interface DeclarationInForce {
  readonly role_name: string;
  readonly role_kind: 'executor' | 'app_credential';
  readonly declared_by: string;
  readonly existe: boolean;
  readonly no_grupo: boolean;
  readonly papeis_de_cliente: number;
}

export async function readDeclarationsInForce(
  client: pg.Client,
  group: string,
): Promise<readonly DeclarationInForce[]> {
  const result = await client.query<DeclarationInForce>(IN_FORCE_WITH_STATE_SQL, [group]);
  return result.rows;
}

/**
 * Credencial inerte: não existe mais, ou não está no grupo e não assume papel de cliente nenhum. É o
 * estado em que a §7.7 deixa a credencial velha ao fim da rotação, e o que falta nele é só a
 * retratação.
 */
export function isInertCredential(declaracao: DeclarationInForce): boolean {
  return !declaracao.existe || (!declaracao.no_grupo && declaracao.papeis_de_cliente === 0);
}

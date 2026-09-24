import type pg from 'pg';
import { diverged } from './errors.js';
import { EXECUTOR_STILL_LEGITIMATE_SQL } from './role-declarations.js';
import { DECLARATION_IN_FORCE_SQL } from './role-retractions.js';

/**
 * As perguntas que `db/verificacao-do-papel.md` acrescentou ao lado da §7.5: **§7.5.1**, quem alcança
 * o schema deste cliente, e **§7.5.2**, o que os `REVOKE` do ato do operador deixaram de fazer. A
 * §7.5.3 (o universo) e a §7.5.4 (o dono e a declaração) moram em `schema-universe.ts`.
 *
 * Elas moram fora de `tenant-role.ts` pela razão que partiu o arquivo da spec: lá está o **ato** que
 * cria o papel, aqui está a **prova** de que o papel do cliente é o único caminho até o schema dele.
 *
 * As duas são **read-only** e não pedem privilégio nenhum além de ler o catálogo.
 */

/**
 * Os papéis predefinidos do servidor cujo privilégio alcança dado de cliente sem passar por `nspacl`
 * nem por `app_t_*` (`SUB-12`): os dois de dado, os três de arquivo e programa do servidor (que leem
 * o diretório de dados por baixo de qualquer ACL), e o de manutenção, que existe a partir do 17 e
 * trava ou reescreve toda tabela. Nome que o servidor não conhece vira `NULL` em `to_regrole` e sai
 * do conjunto sem erro.
 *
 * Fora, de propósito: `pg_monitor` e os de estatística, que mostram texto de consulta de outras
 * sessões e não dado de tabela (as consultas deste sistema são parametrizadas), e
 * `pg_signal_backend`, que derruba sessão e não lê nada.
 */
export const PREDEFINED_REACH_ROLES = [
  'pg_read_all_data',
  'pg_write_all_data',
  'pg_read_server_files',
  'pg_write_server_files',
  'pg_execute_server_program',
  'pg_maintain',
] as const;

/**
 * §7.5.1, a pergunta invertida. A §7.5 junta por `'app_' || nspname`, então o universo dela é o papel
 * **esperado** e tudo o que não é ele fica fora do campo de visão — quatro estados medidos no quinto
 * gate passavam como `conforme` dando leitura do dado de um cliente a quem não deveria tê-la. Esta
 * **enumera o que existe** em vez de conferir o que se espera.
 *
 * **Duas vias, porque o alcance chega por dois caminhos.** `nspacl` basta para o primeiro, e isso foi
 * medido nos dois sentidos: `USAGE` no schema é ponto de estrangulamento, e sem ele nenhum privilégio
 * de objeto lá dentro vale. O segundo não aparece em ACL nenhum: `GRANT app_t_<slug> TO <alguém>` dá
 * ao alguém tudo o que o papel do cliente tem, sem tocar no schema.
 *
 * **A exclusão é por nome, contra `platform.role_declarations`, e é o sétimo gate inteiro.** Até ele,
 * a exclusão era sempre uma **propriedade que o beneficiário carrega**: `NOT admin_option`
 * (`PAP-14`), membership no grupo com `LOGIN` ou com `admin_option` (`PAP-20`), e a posse do schema
 * (`PAP-22`). As três são emitidas por um comando de quem ataca — `GRANT … WITH ADMIN OPTION`,
 * `CREATE ROLE … LOGIN`, `ALTER SCHEMA … OWNER TO` —, e é por isso que cada conserto abria o buraco
 * seguinte uma casa ao lado. Medido em 2026-09-12, PostgreSQL 16.15, **tudo emitido pelo executor
 * não-superusuário**: uma ponte `NOLOGIN` com `ADMIN OPTION` no grupo dá a um papel `LOGIN` de fora a
 * leitura nua dos dois clientes, com `verify` saindo `0` e sem imprimir uma linha; e
 * `ALTER SCHEMA t_acme OWNER TO <papel de fora>` mais um `GRANT SELECT` entrega o cliente, também com
 * `verify` em `0`.
 *
 * **A regra que substitui as três, em uma frase: propriedade do catálogo só pode acusar, nunca
 * desculpar.** O que exclui é identidade que nós escrevemos (`role-declarations.ts`); a propriedade
 * entra do lado que **acrescenta** linha — a credencial declarada que saiu do grupo volta a aparecer
 * aqui, porque a declaração vale enquanto a condição que a produziu valer, e retirar do grupo é
 * exatamente como a §7.7 encerra uma rotação.
 *
 * **Nem `current_user` nem o dono do schema servem de âncora, e agora nenhum dos dois precisa
 * servir.** `current_user` faria o mesmo banco responder diferente conforme quem pergunta, numa
 * pergunta que **veta** com saída `3`. O dono é pior: ele se move com um comando, e quem o move sai
 * do campo de visão — por isso ele deixou de ser exclusão e virou **afirmação** própria (§7.5.4).
 *
 * **A declaração que exclui é a vigente** (`PAP-30`): a retratada deixa de desculpar, e o alcance que
 * sobrar dela volta a ser acusado aqui.
 *
 * **A terceira via é o papel predefinido, e ela não tem exclusão nenhuma** (`SUB-12`). Medido do
 * outro lado da parede em 2026-09-23: um papel `LOGIN` no grupo com `pg_read_all_data` lê todos os
 * clientes e `platform`, e a saída do `verify` ficava idêntica à base, porque esse alcance não passa
 * por `nspacl` nem por membro de `app_t_*`. Aqui a pergunta sobe a cadeia de `pg_auth_members` a
 * partir do grupo e de cada membro direto dele — o executor e a credencial inclusive, porque nenhum
 * papel deste arranjo precisa de papel predefinido, e desculpar o declarado seria a declaração
 * comprando alcance que ela nunca descreveu. A subida é por `pg_auth_members`, e não por
 * `pg_has_role`, porque esta responde `true` para superusuário em qualquer pergunta: o executor de
 * quem desenvolve com superusuário seria acusado em toda rodada, sem concessão nenhuma a revogar.
 *
 * `$1` é o grupo, e não a credencial: a pergunta não depende do nome que vem do ambiente, que é a
 * mesma postura do `PAP-07`. O segundo parâmetro não está na §7.5.1 e não muda o que a consulta
 * responde: ele restringe a pergunta a um schema, que é o que a convergência do `migrate` precisa.
 * Nulo devolve a pergunta inteira, que é a forma que o `verify` usa. O terceiro é a lista de papéis
 * predefinidos, que entra como valor e não como texto da consulta.
 */
const TENANT_REACH_SQL = `
WITH RECURSIVE legitimo AS (
  SELECT to_regrole(d.role_name)::oid AS oid
    FROM platform.role_declarations d
   WHERE to_regrole(d.role_name) IS NOT NULL
     AND ${DECLARATION_IN_FORCE_SQL}
     AND ((d.role_kind = 'executor' AND ${EXECUTOR_STILL_LEGITIMATE_SQL})
          OR EXISTS (SELECT 1 FROM pg_auth_members g
                      WHERE g.roleid = to_regrole($1)::oid
                        AND g.member = to_regrole(d.role_name)::oid))
), acima (origem, papel) AS (
  SELECT to_regrole($1)::oid, to_regrole($1)::oid
   WHERE to_regrole($1) IS NOT NULL
  UNION
  SELECT g.member, g.member FROM pg_auth_members g WHERE g.roleid = to_regrole($1)::oid
  UNION
  SELECT a.origem, m.roleid FROM acima a JOIN pg_auth_members m ON m.member = a.papel
), predefinido AS (
  SELECT DISTINCT a.origem, a.papel
    FROM acima a
   WHERE a.papel IN (SELECT to_regrole(nome)::oid FROM unnest($3::text[]) AS nome)
)
SELECT n.nspname AS schema_name,
       'acl' AS via,
       CASE WHEN g.grantee = 0 THEN 'PUBLIC' ELSE g.grantee::regrole::text END AS alcanca,
       g.privilege_type AS detalhe
  FROM pg_namespace n
  CROSS JOIN LATERAL aclexplode(COALESCE(n.nspacl, acldefault('n', n.nspowner))) AS g
 WHERE n.nspname LIKE 't\\_%'
   AND ($2::text IS NULL OR n.nspname = $2::text)
   AND g.grantee IS DISTINCT FROM to_regrole('app_' || n.nspname)::oid
   AND NOT EXISTS (SELECT 1 FROM legitimo l WHERE l.oid = g.grantee)
UNION ALL
SELECT n.nspname, 'membro', m.member::regrole::text,
       concat_ws(' e ',
                 CASE WHEN m.admin_option THEN 'ADMIN OPTION' END,
                 CASE WHEN m.inherit_option THEN 'herança' END)
  FROM pg_namespace n
  JOIN pg_auth_members m ON m.roleid = to_regrole('app_' || n.nspname)::oid
 WHERE n.nspname LIKE 't\\_%'
   AND ($2::text IS NULL OR n.nspname = $2::text)
   AND NOT EXISTS (SELECT 1 FROM legitimo l WHERE l.oid = m.member)
UNION ALL
SELECT n.nspname, 'predefinido', p.origem::regrole::text, p.papel::regrole::text
  FROM pg_namespace n
  CROSS JOIN predefinido p
 WHERE n.nspname LIKE 't\\_%'
   AND ($2::text IS NULL OR n.nspname = $2::text)
 ORDER BY 1, 2, 3, 4
`;

/** Uma linha por alcance não previsto. Banco íntegro devolve **nenhuma**. */
export interface TenantReachRow {
  readonly schema_name: string;
  /**
   * `acl`, quando o alcance chega pelo ACL do schema; `membro`, quando chega pelo papel do cliente;
   * `predefinido`, quando chega por papel predefinido do servidor alcançado a partir do grupo.
   */
  readonly via: string;
  /** O papel que alcança, ou `PUBLIC`. */
  readonly alcanca: string;
  /**
   * O privilégio, na via `acl`. Na via `membro`, o que a concessão carrega: `ADMIN OPTION` quando ela
   * pode ser delegada adiante sem passar pelo executor, `herança` quando o beneficiário lê o cliente
   * **sem assumir** o papel. As duas mudam o que a mão humana tem pela frente, e nenhuma das duas
   * decide coisa nenhuma aqui: elas descrevem, a exclusão é por nome.
   */
  readonly detalhe: string;
}

export async function readTenantReachRows(
  client: pg.Client,
  group: string,
  schema?: string,
): Promise<readonly TenantReachRow[]> {
  const result = await client.query<TenantReachRow>(TENANT_REACH_SQL, [
    group,
    schema ?? null,
    PREDEFINED_REACH_ROLES,
  ]);
  return result.rows;
}

export function describeReach(row: TenantReachRow): string {
  if (row.via === 'predefinido') {
    return (
      `${row.alcanca} alcança ${row.detalhe}, papel predefinido que lê ou escreve todo schema do ` +
      'banco por baixo do ACL, e nenhum papel deste arranjo precisa dele'
    );
  }
  if (row.via !== 'membro') return `${row.alcanca} tem ${row.detalhe} no schema`;
  const membro = `${row.alcanca} é membro do papel do cliente`;
  return row.detalhe === '' ? membro : `${membro}, com ${row.detalhe}`;
}

/**
 * A recusa da §7.5.1: alguém que não está declarado alcança o schema. **A convergência não toca
 * nisto.** Corrigir é `REVOKE`, que o ato da §7.3 não tem, e revogar sozinho apagaria privilégio que
 * alguém pode ter concedido por decisão.
 */
export function foreignReachError(schema: string, rows: readonly TenantReachRow[]): Error {
  return diverged(
    `alguém que não está declarado em platform.role_declarations alcança o schema "${schema}": ` +
      `${rows.map(describeReach).join('; ')}. Retirar isso é REVOKE, que este ato não tem: ` +
      'adotá-lo em silêncio seria herdar alcance que ninguém declarou ' +
      '(db/verificacao-do-papel.md §7.5.1).',
  );
}

/**
 * §7.5.2. As duas ausências que só o ato do operador (§7.2) produz, e que por isso **registram sem
 * reprovar** — o mesmo corte da §13.4: nada versionado aplica os dois `REVOKE`, e controle que
 * reprova em toda rodada de toda máquina é controle que se aprende a ignorar.
 *
 * O `TEMPORARY` do banco vale mais do que parece: com ele o papel do cliente cria
 * `CREATE TEMP TABLE orders` e, com `search_path` no schema do cliente, o nome **não qualificado**
 * de qualquer corpo de função ou gatilho passa a resolver para a temporária. Como `RECUSAS.md` §11.3
 * obriga nome não qualificado em todo corpo de migration, é a ausência deste privilégio que impede a
 * venda de gravar numa relação que some no fim da sessão.
 */
const PUBLIC_GRANT_SQL = `
SELECT
  EXISTS (SELECT 1 FROM pg_namespace n
          CROSS JOIN LATERAL aclexplode(COALESCE(n.nspacl, acldefault('n', n.nspowner))) g
           WHERE n.nspname = 'public' AND g.grantee = 0) AS public_no_schema_public,
  EXISTS (SELECT 1 FROM pg_database d
          CROSS JOIN LATERAL aclexplode(COALESCE(d.datacl, acldefault('d', d.datdba))) g
           WHERE d.datname = current_database()
             AND g.grantee = 0 AND g.privilege_type = 'TEMPORARY') AS public_com_temp
`;

export interface PublicGrantRow {
  readonly public_no_schema_public: boolean;
  readonly public_com_temp: boolean;
}

export async function readPublicGrants(client: pg.Client): Promise<PublicGrantRow | undefined> {
  const result = await client.query<PublicGrantRow>(PUBLIC_GRANT_SQL);
  return result.rows[0];
}

export function describePublicGrants(row: PublicGrantRow): readonly string[] {
  const achados: string[] = [];
  if (row.public_no_schema_public) {
    achados.push('PUBLIC ainda alcança o schema public');
  }
  if (row.public_com_temp) {
    achados.push('PUBLIC ainda tem TEMPORARY neste banco');
  }
  return achados;
}

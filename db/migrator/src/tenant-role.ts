import type pg from 'pg';

/**
 * O papel de banco de um cliente: `db/papel-do-cliente.md` §7, inteira.
 *
 * O ato que cria o papel é **passo do comando que provisiona** (§7.4), não script à parte: artefato
 * separado é artefato que alguém esquece de rodar, e era isso que tornava esta camada inverificável.
 *
 * Duas coisas deste arquivo não são detalhe de escrita:
 *
 * - **O nome do papel é `app_` + o nome do schema**, e o prefixo é reservado. É o que faz a
 *   verificação da §7.5 ser uma junção por `'app_' || nspname`, sem tabela de-para e sem o que
 *   desencontrar.
 * - **`ALTER DEFAULT PRIVILEGES` anda junto de `GRANT ON ALL TABLES`.** A primeira linha alcança o
 *   que já existe; a segunda, o que a próxima migration criar. Medido em 2026-09-11: sem ela, a
 *   tabela criada por uma migration posterior nasce invisível para o papel do cliente, e o sintoma
 *   aparece só no release seguinte, no caixa, como `permission denied for table`.
 */

/** §7.1: reservado. Nem a credencial nem o papel do executor podem usá-lo. */
export const TENANT_ROLE_PREFIX = 'app_';

/** §7.2: o grupo sem `LOGIN` e sem privilégio próprio. O nome é fixado pela spec, não por ambiente. */
export const APP_GROUP_ROLE = 'forja_app';

export function tenantRoleName(schema: string): string {
  return TENANT_ROLE_PREFIX + schema;
}

/**
 * §7.5. Uma linha por schema `t_*`, com o grupo e a credencial como parâmetro.
 *
 * `to_regrole` devolve nulo em vez de erro quando o papel não existe, e é por isso que ele está
 * aqui: a pergunta precisa distinguir "não existe" de "existe errado" **na mesma passada**, sem
 * morrer na primeira.
 *
 * O terceiro parâmetro não está na §7.5 e não muda o que a consulta responde: ele restringe a
 * pergunta a um schema, que é o que a convergência do `migrate` precisa (§7.4). Nulo devolve a
 * pergunta inteira, que é a forma que o `verify` usa.
 *
 * **`credencial_herda` pergunta pela concessão, não pelo papel.** Em 16 a herança é propriedade de
 * cada `GRANT` (`pg_auth_members.inherit_option`), e `atributo_indevido` já lia `rolinherit` sem
 * pegar este estado: medido em 2026-09-11, uma credencial `NOINHERIT` com `GRANT … WITH INHERIT
 * TRUE` lê **todos** os clientes sem assumir papel nenhum, e esta pergunta respondia `conforme`.
 *
 * **`heranca_de_outro_concedente` é o `PAP-13`, e ela pergunta pelo concedente.** A chave de
 * `pg_auth_members` é `(roleid, member, grantor)`: a mesma concessão emitida por duas mãos são duas
 * linhas, e o efeito é a união delas. Medido em 2026-09-11, PostgreSQL 16.15: com a linha do
 * executor de pé, `GRANT app_t_acme TO <credencial> WITH INHERIT TRUE` emitido pelo **operador**
 * acrescenta uma segunda linha, `inherit_option = t`, e a credencial nua volta a ler o cliente;
 * reemitir a linha da §7.3 grava a do executor e **deixa a do operador intacta**. Por isso este
 * caso não converge — ele recusa (§7.4).
 *
 * O sujeito aqui é `current_user`, e de propósito: a pergunta é "esta conexão consegue corrigir
 * isso reemitindo?". Errar para o lado de outro concedente faz o comando **recusar**, nunca passar,
 * que é o oposto de onde a §7.5.1 pode errar — lá o mesmo raciocínio produziria acusação falsa, e
 * por isso lá a âncora é o arranjo declarado, não quem pergunta.
 *
 * **As duas colunas de herança deixaram de valer só para o nome do ambiente, e é o `PAP-19`.** Até o
 * sétimo gate elas filtravam por `m.member = to_regrole($2)`, e `$2` é o que o `.env` carrega: com
 * uma segunda credencial no grupo — a janela de rotação da §7.7, escrita como ela está escrita —, o
 * operador emitia `GRANT app_t_<slug> TO <a outra> WITH INHERIT TRUE`, ela lia **todos** os clientes
 * nua, e o **mesmo banco** saía `0` ou `3` conforme o nome que estivesse no ambiente (medido em
 * 2026-09-12, PostgreSQL 16.15). O sujeito passou a ser o conjunto declarado em
 * `platform.role_declarations`, que é o mesmo conjunto que a §7.5.1 exclui: uma só definição de
 * "quem é credencial", e não duas para desencontrar.
 *
 * **`heranca_de_outra_credencial` é o que sobra dessa extensão, e ela recusa em vez de convergir.**
 * A concessão herdável **deste** executor à credencial **do ambiente** converge, porque reemitir a
 * linha da §7.3 a corrige no lugar. À credencial declarada que **não** é a do ambiente, não: o ato
 * só emite para um nome, então convergir deixaria a herança de pé e o comando diria ter corrigido —
 * que é a forma exata do `PAP-13`. A saída é rodar `migrate` com o ambiente apontando para ela, ou
 * revogar.
 *
 * **`default_acl_de_quem_pergunta` responde sobre `current_user`, não sobre o banco**, e o nome diz
 * isso porque a coluna nunca reprova: medido, o mesmo banco íntegro perguntado por outro papel
 * devolve falso em todos os schemas, e ligá-la à saída `3` faria o `verify` de um operador acusar a
 * frota inteira de adulteração. Quem pega o sintoma de verdade é `tabelas_sem_select`.
 */
const TENANT_ROLE_SQL = `
WITH alvo AS (
  SELECT n.nspname AS schema_name,
         to_regrole('app_' || n.nspname) AS role_oid
    FROM pg_namespace n
   WHERE n.nspname LIKE 't\\_%'
     AND ($3::text IS NULL OR n.nspname = $3::text)
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
                 WHERE m.roleid = a.role_oid
                   AND m.inherit_option
                   AND m.grantor IS DISTINCT FROM to_regrole(current_user)::oid
                   AND (m.member = to_regrole($2) OR m.member IN (SELECT cred.oid FROM cred))
               ) c
       ) AS heranca_de_outro_concedente,
       (SELECT array_agg(DISTINCT m.member::regrole::text)
          FROM pg_auth_members m
         WHERE m.roleid = a.role_oid
           AND m.inherit_option
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
 ORDER BY a.schema_name
`;

/** A linha como o catálogo devolve: nulo em toda coluna de privilégio quando o papel não existe. */
export interface TenantRoleRow {
  readonly schema_name: string;
  readonly papel_existe: boolean;
  readonly atributo_indevido: boolean | null;
  readonly no_grupo: boolean;
  readonly credencial_assume: boolean;
  readonly credencial_herda: boolean;
  /**
   * Uma entrada por par (credencial declarada, concedente que não é esta conexão) de uma concessão
   * herdável do papel do cliente. Nulo quando não há nenhuma — é `json_agg` sem linha, não lista
   * vazia. O par existe porque a pergunta deixou de valer só para o nome do ambiente: o `REVOKE` que
   * corrige nomeia as duas pontas.
   */
  readonly heranca_de_outro_concedente: readonly ForeignGrantorRow[] | null;
  /**
   * As credenciais declaradas — **diferentes** da que o ambiente nomeia — que herdam o papel por
   * concessão **desta** conexão. Este ato só reemite para um nome, então aqui ele recusa em vez de
   * dizer que corrigiu.
   */
  readonly heranca_de_outra_credencial: readonly string[] | null;
  readonly usage_no_proprio: boolean | null;
  readonly create_indevido: boolean | null;
  readonly usage_em_platform: boolean | null;
  /** `count(*)` chega como texto: é `bigint` do lado do servidor. */
  readonly tabelas_sem_select: string;
  /** Sobre quem pergunta, e não sobre o banco: por isso ela não entra na classificação. */
  readonly default_acl_de_quem_pergunta: boolean;
}

export interface TenantRoleNames {
  readonly group: string;
  readonly credential: string;
}

export async function readTenantRoleRows(
  client: pg.Client,
  names: TenantRoleNames,
  schema?: string,
): Promise<readonly TenantRoleRow[]> {
  const result = await client.query<TenantRoleRow>(TENANT_ROLE_SQL, [
    names.group,
    names.credential,
    schema ?? null,
  ]);
  return result.rows;
}

/**
 * §7.4, a tabela de decisão. Cinco estados, e o que os separa é a **mão que corrige**: o que falta o
 * executor concede; o que está errado ele não adota, porque um papel mexido à mão carrega privilégio
 * que ninguém declarou; e o que foi concedido por outra mão só a mão que o concedeu retira.
 */
export type TenantRoleState =
  | { readonly kind: 'conforme' }
  | { readonly kind: 'ausente' }
  | { readonly kind: 'incompleto'; readonly faltando: readonly Missing[] }
  | { readonly kind: 'divergente'; readonly motivos: readonly string[] }
  | { readonly kind: 'concedente_alheio'; readonly herancas: readonly ForeignGrantorRow[] };

/** Um par (credencial declarada, concedente) de uma concessão herdável que esta conexão não retira. */
export interface ForeignGrantorRow {
  readonly credencial: string;
  readonly concedente: string;
}

export type Missing = 'credencial' | 'heranca' | 'usage' | 'tabelas' | 'default_acl';

export function classifyTenantRole(row: TenantRoleRow): TenantRoleState {
  if (!row.papel_existe) return { kind: 'ausente' };

  /**
   * Antes de tudo que existe, porque é o único estado em que reemitir **passa** e não corrige: o
   * `PAP-13` é o `migrate` saindo `0` dizendo "completando o papel de banco" sobre uma herança que
   * continua de pé. Diagnóstico mais específico vence o mais geral, e este tem autor e comando.
   */
  const herancas = row.heranca_de_outro_concedente;
  if (herancas !== null && herancas.length > 0) {
    return { kind: 'concedente_alheio', herancas };
  }

  const motivos: string[] = [];
  if (row.atributo_indevido === true) {
    motivos.push('tem LOGIN ou outro atributo que o ato da §7.3 não concede');
  }
  if (!row.no_grupo) motivos.push(`não é membro de ${APP_GROUP_ROLE} sem ADMIN OPTION`);
  // Excesso de privilégio não se conserta concedendo, e retirar é REVOKE, que este ato não tem: o
  // caso cai no lado que para. Falha fechado (§7.4, terceiro caso é só sobre o que falta).
  if (row.create_indevido === true) motivos.push('tem CREATE no próprio schema');
  if (row.usage_em_platform === true) motivos.push('tem USAGE em platform');
  /**
   * Concessão herdável **deste** executor a uma credencial declarada que **não** é a do ambiente: o
   * ato só emite para um nome, então tratá-la como falta faria a rodada dizer "completando o papel
   * de banco" e sair `0` com a herança de pé, que é a forma exata do `PAP-13`. Cai no lado que para,
   * e a mensagem carrega os dois caminhos de saída.
   */
  const outraCredencial = row.heranca_de_outra_credencial;
  if (outraCredencial !== null && outraCredencial.length > 0) {
    motivos.push(
      `é herdado por ${outraCredencial.map((nome) => `"${nome}"`).join(', ')}, que é credencial ` +
        'declarada e não é a que o ambiente nomeia: este ato concede a um nome só. Rode migrate ' +
        'com o ambiente apontando para ela (§7.1), que aí a reemissão corrige no lugar, ou revogue ' +
        'a concessão',
    );
  }
  if (motivos.length > 0) return { kind: 'divergente', motivos };

  const faltando: Missing[] = [];
  if (!row.credencial_assume) faltando.push('credencial');
  /**
   * Herança é excesso de privilégio e mesmo assim converge, porque o corte da §7.4 não é entre
   * falta e excesso: é entre o que este ato **reemite** e o que só `REVOKE` corrige. Medido em
   * 2026-09-11: sobre uma concessão com `inherit_option = t`, a linha literal da §7.3 a muda para
   * `f` sem `REVOKE`, e a leitura direta que funcionava volta a dar `permission denied`.
   */
  if (row.credencial_herda) faltando.push('heranca');
  if (row.usage_no_proprio !== true) faltando.push('usage');
  if (Number.parseInt(row.tabelas_sem_select, 10) > 0) faltando.push('tabelas');
  if (faltando.length > 0) return { kind: 'incompleto', faltando };

  return { kind: 'conforme' };
}

/**
 * O privilégio padrão saiu da classificação e virou sinal próprio (§7.5). No `migrate` ele continua
 * sendo **parte a convergir** — o executor reemite o `ALTER DEFAULT PRIVILEGES` e a coluna fica
 * verdadeira para quem cria tabela ali; no `verify` ele é linha nomeada e evento
 * `tenant_role_default_acl_absent`, sem tocar no código de saída.
 */
export function defaultAclAbsent(row: TenantRoleRow): boolean {
  return row.papel_existe && !row.default_acl_de_quem_pergunta;
}

export function describeDefaultAclAbsent(row: TenantRoleRow): string {
  return `${tenantRoleName(row.schema_name)}: falta ${describeMissing('default_acl')}`;
}

export function describeState(row: TenantRoleRow, state: TenantRoleState): string {
  const papel = tenantRoleName(row.schema_name);
  switch (state.kind) {
    case 'conforme':
      return `${papel}: conforme`;
    case 'ausente':
      return `${papel}: ausente`;
    case 'incompleto':
      return `${papel}: falta ${state.faltando.map(describeMissing).join(', ')}`;
    case 'divergente':
      return `${papel}: ${state.motivos.join('; ')}`;
    case 'concedente_alheio':
      return (
        `${papel}: ` +
        state.herancas
          .map(
            (heranca) =>
              `"${heranca.credencial}" herda o papel por concessão de "${heranca.concedente}"`,
          )
          .join('; ') +
        ', que não é quem pergunta'
      );
  }
}

function describeMissing(missing: Missing): string {
  switch (missing) {
    case 'credencial':
      return 'o GRANT que torna o papel assumível pela credencial';
    case 'heranca':
      return 'a opção da concessão à credencial: hoje ela herda o papel em vez de só assumi-lo';
    case 'usage':
      return 'USAGE no próprio schema';
    case 'tabelas':
      return 'SELECT em tabela ou view do schema';
    case 'default_acl':
      return 'o privilégio padrão que cobre o que a próxima migration criar';
  }
}

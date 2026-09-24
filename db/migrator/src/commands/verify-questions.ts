import type pg from 'pg';
import { readTenants, tenantRegistryExists } from '../registry.js';
import {
  describeDefinerRoutine,
  describeProtectedDependency,
  readDefinerRoutines,
  readProtectedDependencies,
} from '../protected-dependency.js';
import { isInertCredential, readDeclarationsInForce } from '../role-retractions.js';
import { tenantRoleNames, type RunContext } from '../run.js';
import {
  describePublicGrants,
  describeReach,
  readPublicGrants,
  readTenantReachRows,
} from '../tenant-reach.js';
import {
  describeOwner,
  describeUniverse,
  isExtraSchema,
  readSchemaUniverseRows,
  readUnexpectedOwners,
} from '../schema-universe.js';
import {
  classifyTenantRole,
  defaultAclAbsent,
  describeDefaultAclAbsent,
  describeState,
  readTenantRoleRows,
  type TenantRoleRow,
} from '../tenant-role.js';
import { foreignGrantorFix } from '../tenant-role-act.js';

/**
 * As perguntas do `verify`, uma função por pergunta. **Quem decide se a pergunta veta é
 * `verify.ts`**, na tabela única da §13.6 — daqui não sai código de saída, só a resposta "achei" ou
 * "não achei".
 *
 * O corte é do sétimo gate. Até ele, a política de veto morava no ponto de chamada
 * (`differenceFound = (await x()) || differenceFound` vetava, `await x()` não), espalhada por oito
 * chamadas e escrita em lugar nenhum: nas quatro sondas em que o auditor mediu vazamento, o comando
 * **imprimiu linhas e saiu `0`**, e quem lia a saída não tinha como saber, sem abrir o código, que
 * aquela linha não vetava.
 */

/** Toda pergunta devolve isto: achou o que procurava, ou não. O veto é decidido fora. */
export type Achado = boolean;

/**
 * §13.4. Uma pergunta ao catálogo, sem parâmetro, sobre a conexão que o próprio `verify` está usando.
 *
 * O `REVOKE` de `db/papeis-e-credencial.md` §5 não é aplicado por nada versionado, então em todo
 * banco recém-criado e em toda máquina de quem desenvolve com superusuário a resposta seria `3` em
 * **toda** rodada. Controle que reprova sempre não é obedecido, é dispensado (`SEC-05`).
 */
const PRIVILEGE_SQL = `
select usesuper,
       has_table_privilege('platform.tenants', 'UPDATE')   as pode_atualizar,
       has_table_privilege('platform.tenants', 'DELETE')   as pode_remover,
       has_table_privilege('platform.tenants', 'TRUNCATE') as pode_truncar
  from pg_user where usename = current_user
`;

interface PrivilegeRow {
  readonly usesuper: boolean;
  readonly pode_atualizar: boolean;
  readonly pode_remover: boolean;
  readonly pode_truncar: boolean;
}

export async function checkExecutorPrivilege(ctx: RunContext, client: pg.Client): Promise<Achado> {
  if (!(await tenantRegistryExists(client))) return false;

  const resposta = await client.query<PrivilegeRow>(PRIVILEGE_SQL);
  const linha = resposta.rows[0];
  if (linha === undefined) return false;

  const demais = [
    linha.pode_atualizar ? 'UPDATE' : undefined,
    linha.pode_remover ? 'DELETE' : undefined,
    linha.pode_truncar ? 'TRUNCATE' : undefined,
  ].filter((nome): nome is string => nome !== undefined);
  if (demais.length === 0) return false;

  const motivo = linha.usesuper
    ? `a conexão é de superusuário (${ctx.session.dbRole}), o que por si é contrário a ` +
      'db/papeis-e-credencial.md §1'
    : `o papel "${ctx.session.dbRole}" tem ${demais.join(', ')} em platform.tenants, que ` +
      'db/papeis-e-credencial.md §5 manda revogar';
  ctx.report(`privilégio inesperado: ${motivo}`);
  await ctx.events.record({ kind: 'privilege_unexpected', detail: motivo });
  return true;
}

/**
 * §13.5, a pergunta da §7.5 sobre o papel **esperado**, uma linha por schema de cliente.
 *
 * O descartável do próprio `verify` fica de fora porque ele não é cliente: ele nasce e morre dentro
 * desta execução, e papel de banco é do cliente que a carteira registra.
 *
 * `verify` **não cria e não altera papel** (§12): ele pergunta, nomeia e registra.
 */
export async function readRoleRows(
  ctx: RunContext,
  client: pg.Client,
  clientSchemas: readonly string[],
): Promise<readonly TenantRoleRow[]> {
  // A consulta pergunta por `USAGE` em `platform`, então ela pressupõe o schema de controle de pé.
  // Sem registro de clientes não há carteira contra a qual perguntar, e a resposta é não perguntar.
  if (!(await tenantRegistryExists(client))) return [];
  const rows = await readTenantRoleRows(client, tenantRoleNames(ctx.config));
  return rows.filter((row) => clientSchemas.includes(row.schema_name));
}

export async function checkTenantRoles(
  ctx: RunContext,
  rows: readonly TenantRoleRow[],
): Promise<Achado> {
  let found = false;

  for (const row of rows) {
    const state = classifyTenantRole(row);
    if (state.kind === 'conforme') continue;

    found = true;
    // Cinco estados, cinco códigos: ausente e incompleto convergem com um comando, divergente manda
    // investigar e explicitamente **não** rodar `migrate`, e concedente alheio manda revogar na
    // conexão de quem concedeu. Um código a menos faz o implementador encaixar no item mais próximo
    // e consertar a coisa errada, sem gerar sintoma (`PAP-10`).
    const converge = state.kind === 'ausente' || state.kind === 'incompleto';
    if (state.kind === 'concedente_alheio') {
      // O `PAP-13`: aqui a linha **não** pode mandar convergir, porque era convergindo que o
      // `migrate` saía `0` sem corrigir. Ela carrega o comando de quem corrige, e quem corrige não é
      // este executor — o texto da recusa já nomeia as duas pontas, então ele entra no lugar do
      // resumo.
      ctx.report(`papel de banco: ${foreignGrantorFix(row.schema_name, state.herancas)}`);
    } else {
      ctx.report(
        `papel de banco: ${describeState(row, state)}` +
          (converge ? `. Converge com migrate --schema ${row.schema_name}` : ''),
      );
    }
    await ctx.events.record({
      kind: EVENTO_DO_ESTADO[state.kind],
      schemaName: row.schema_name,
      detail: describeState(row, state),
    });
  }

  return found;
}

const EVENTO_DO_ESTADO = {
  ausente: 'tenant_role_missing',
  incompleto: 'tenant_role_incomplete',
  divergente: 'tenant_role_divergent',
  concedente_alheio: 'tenant_role_foreign_grantor',
} as const;

/**
 * A coluna que responde sobre **quem pergunta**, e não sobre o banco (§7.5). Ela é pergunta própria
 * desde o sétimo gate, e não uma linha sem veto escondida dentro da pergunta que veta: ligá-la ao
 * veto faria o `verify` de um operador acusar a frota inteira de adulteração, e escondê-la dentro de
 * outra pergunta faz a saída misturar o que reprova com o que não reprova.
 */
export async function checkDefaultAcl(
  ctx: RunContext,
  rows: readonly TenantRoleRow[],
): Promise<Achado> {
  let found = false;
  for (const row of rows) {
    if (!defaultAclAbsent(row)) continue;
    found = true;
    ctx.report(
      `papel de banco: ${describeDefaultAclAbsent(row)}. Rode migrate com o papel que cria as ` +
        'tabelas, ou ignore se está auditando com outro papel',
    );
    await ctx.events.record({
      kind: 'tenant_role_default_acl_absent',
      schemaName: row.schema_name,
      detail: describeDefaultAclAbsent(row),
    });
  }
  return found;
}

/**
 * §7.5.1, a pergunta invertida: **quem** alcança o schema deste cliente. `PUBLIC`, papel de outro
 * cliente e acesso herdado por membership ficam fora do campo de visão da §7.5, que junta pelo papel
 * esperado. **Divergência sai em `3` e a convergência não a toca**, porque corrigir é `REVOKE`.
 */
export async function checkTenantReach(
  ctx: RunContext,
  client: pg.Client,
  clientSchemas: readonly string[],
): Promise<Achado> {
  if (!(await tenantRegistryExists(client))) return false;

  const rows = (await readTenantReachRows(client, tenantRoleNames(ctx.config).group)).filter((row) =>
    clientSchemas.includes(row.schema_name),
  );
  for (const row of rows) {
    ctx.report(`alcance ao schema "${row.schema_name}": ${describeReach(row)}`);
    await ctx.events.record({
      kind: 'tenant_schema_foreign_grant',
      schemaName: row.schema_name,
      detail: describeReach(row),
    });
  }
  return rows.length > 0;
}

/**
 * §7.5.2. Nada versionado aplica os dois `REVOKE` do ato do operador (§7.2), então vale o molde da
 * §13.4: linha nomeada e evento, sem veto.
 */
export async function checkPublicGrants(ctx: RunContext, client: pg.Client): Promise<Achado> {
  if (!(await tenantRegistryExists(client))) return false;

  const row = await readPublicGrants(client);
  if (row === undefined) return false;

  const achados = describePublicGrants(row);
  for (const achado of achados) {
    ctx.report(`ato do operador pendente: ${achado} (db/papel-do-cliente.md §7.2)`);
    await ctx.events.record({ kind: 'public_grant_present', detail: achado });
  }
  return achados.length > 0;
}

/**
 * §7.5.3, o `PAP-15` e o `PAP-21`. Todas as outras perguntas olham `platform` e `t_*`, então um
 * objeto num terceiro schema é ponto cego por construção — e uma view em `public` sobre dois
 * clientes entrega os dois à credencial nua, medido.
 *
 * Não depende do registro de clientes estar de pé: a pergunta é sobre o catálogo do banco inteiro, e
 * ela vale igual num banco recém-criado.
 */
export async function checkSchemaUniverse(ctx: RunContext, client: pg.Client): Promise<Achado> {
  const rows = await readSchemaUniverseRows(client);
  for (const row of rows) {
    ctx.report(`fora do universo declarado: ${describeUniverse(row)}`);
    await ctx.events.record({
      kind: isExtraSchema(row) ? 'schema_outside_universe' : 'public_object_present',
      ...(isExtraSchema(row) ? { schemaName: row.nome } : {}),
      detail: describeUniverse(row),
    });
  }
  return rows.length > 0;
}

/**
 * §7.5.6, o `SUB-09`: a delegação por dono de objeto. Nenhum objeto de schema protegido depende de
 * objeto de outro schema, e nenhuma rotina de schema protegido é `SECURITY DEFINER`. Como a §7.5.3,
 * a pergunta é sobre o catálogo do banco inteiro e não lê declaração, então vale igual num banco
 * recém-criado.
 */
export async function checkOwnerDelegation(ctx: RunContext, client: pg.Client): Promise<Achado> {
  const dependencias = await readProtectedDependencies(client);
  for (const row of dependencias) {
    ctx.report(`delegação por dono de objeto: ${describeProtectedDependency(row)}`);
    await ctx.events.record({
      kind: 'object_owner_delegation',
      schemaName: row.schema_name,
      detail: describeProtectedDependency(row),
    });
  }
  const rotinas = await readDefinerRoutines(client);
  for (const row of rotinas) {
    ctx.report(`delegação por dono de objeto: ${describeDefinerRoutine(row)}`);
    await ctx.events.record({
      kind: 'object_owner_delegation',
      schemaName: row.schema_name,
      detail: describeDefinerRoutine(row),
    });
  }
  return dependencias.length + rotinas.length > 0;
}

/**
 * §7.5.4, o `PAP-22`: o dono de `platform` e de cada `t_*` é **afirmado**. Medido em 2026-09-12, com
 * o executor não-superusuário: `ALTER SCHEMA t_acme OWNER TO <papel de fora>` mais um `GRANT SELECT`
 * entregam o cliente, e o dono ainda pode `DROP SCHEMA … CASCADE`.
 */
export async function checkSchemaOwners(ctx: RunContext, client: pg.Client): Promise<Achado> {
  const rows = await readUnexpectedOwners(client);
  for (const row of rows) {
    ctx.report(`dono inesperado: ${describeOwner(row)}`);
    await ctx.events.record({
      kind: 'tenant_schema_owner_unexpected',
      schemaName: row.schema_name,
      detail: describeOwner(row),
    });
  }
  return rows.length > 0;
}

/**
 * §7.5.4, o par do `PAP-16`. A §7.5.1 exclui **o conjunto declarado**, e excluir em silêncio um
 * conjunto que ninguém enumera é trocar um veto falso por uma ausência invisível. Então o `verify`
 * **nomeia** cada declaração além do arranjo desta rodada — o papel com que ele conecta e a
 * credencial que o ambiente nomeia —, no molde da §13.4: linha e evento, sem veto. Durante a rotação
 * da §7.7 este é o estado esperado, e reprovar aqui travaria `migrate` na hora em que travar custa
 * mais caro.
 *
 * **Só a declaração vigente é nomeada, e a instrução segue o estado** (`PAP-30`). A retratada não
 * aparece: ela já não desculpa nada, e o que sobrar dela é acusado pela §7.5.1. A credencial que já
 * saiu do grupo e não assume papel de cliente não recebe a ordem de sair do grupo, que ela já
 * cumpriu: recebe a única coisa que falta, a retratação. Antes, as duas liam o mesmo texto para
 * sempre, e N rotações deixavam N linhas iguais escondendo a que importa.
 */
export async function nameExtraDeclarations(ctx: RunContext, client: pg.Client): Promise<Achado> {
  const names = tenantRoleNames(ctx.config);
  const declaracoes = await readDeclarationsInForce(client, names.group);
  let found = false;

  for (const declaracao of declaracoes) {
    if (declaracao.role_kind === 'app_credential') {
      if (declaracao.role_name === names.credential) continue;
      found = true;
      const detalhe = isInertCredential(declaracao)
        ? `"${declaracao.role_name}" é credencial de aplicação declarada além de ` +
          `"${names.credential}", e já está inerte: fora do grupo e sem papel de cliente. Falta só ` +
          'a retratação, que é ato do operador e tira esta linha das próximas rodadas ' +
          '(db/universo-e-declaracao.md §7.5.4, retirar uma declaração)'
        : `"${declaracao.role_name}" é credencial de aplicação declarada além de ` +
          `"${names.credential}", que o ambiente nomeia. A §7.7 aceita a pluralidade durante a ` +
          'rotação, e a §7.5.1 não conta o alcance dela como alcance de terceiro: se a rotação já ' +
          'terminou, tirá-la do grupo, revogar os papéis de cliente e retratar a declaração é mão ' +
          'humana (§7.5.4)';
      ctx.report(`credencial de aplicação a mais: ${detalhe}`);
      await ctx.events.record({ kind: 'app_credential_plural', detail: detalhe });
      continue;
    }

    if (declaracao.role_name === ctx.session.dbRole) continue;
    found = true;
    /**
     * Quem pergunta nem sempre é executor: um operador auditando a frota é caminho previsto (§7.5), e
     * dizer a ele "há um executor **além** de você" seria falso. A linha muda com o sujeito, e nos
     * dois casos ela nomeia o mesmo fato — quem pode ser dono de schema nosso sem que nada acuse.
     */
    const souExecutor = declaracoes.some(
      (outra) => outra.role_kind === 'executor' && outra.role_name === ctx.session.dbRole,
    );
    const detalhe = souExecutor
      ? `"${declaracao.role_name}" é executor declarado além de "${ctx.session.dbRole}", que é quem ` +
        'pergunta: ele pode ser dono de schema nosso, e se a troca de executor terminou o papel ' +
        'antigo não devia mais existir neste cluster, e a declaração dele se retrata (§7.5.4)'
      : `"${declaracao.role_name}" é executor declarado, e quem pergunta ("${ctx.session.dbRole}") ` +
        'não é: esta rodada está auditando com outro papel, o que é previsto. A linha existe para ' +
        'que o conjunto de quem pode ser dono de schema nosso seja enumerado (§7.5.4)';
    ctx.report(`executor declarado a mais: ${detalhe}`);
    await ctx.events.record({ kind: 'executor_role_plural', detail: detalhe });
  }

  return found;
}

/**
 * A enumeração é pelo catálogo e o registro entra como **confronto**, nas duas direções. Enumerar
 * pelo registro cegaria o comando onde ele é vendido como resposta ao drift.
 */
export async function confrontRegistry(
  ctx: RunContext,
  client: pg.Client,
  clientSchemas: readonly string[],
): Promise<Achado> {
  if (!(await tenantRegistryExists(client))) return false;

  const registered = (await readTenants(client)).map((tenant) => tenant.schema_name);
  let found = false;

  for (const schema of clientSchemas) {
    if (registered.includes(schema)) continue;
    found = true;
    ctx.report(`drift: o schema "${schema}" existe no catálogo e não está em platform.tenants`);
    await ctx.events.record({ kind: 'schema_without_registry', schemaName: schema });
  }

  for (const schema of registered) {
    if (clientSchemas.includes(schema)) continue;
    found = true;
    ctx.report(`drift: "${schema}" está em platform.tenants e não existe no catálogo`);
    await ctx.events.record({ kind: 'registered_schema_missing', schemaName: schema });
  }

  return found;
}

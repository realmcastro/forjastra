import type pg from 'pg';
import { applyMigration } from './apply.js';
import { requireAppCredential, type MigratorConfig } from './config.js';
import { applyFailed, diverged, ExecutorError, refused } from './errors.js';
import type { EventRecorder } from './events.js';
import { assertLedgerStructure, probeLedgerRelkind, readLedger, type LedgerRow } from './ledger.js';
import type { LoadedMigration, LoadedSet } from './loader.js';
import {
  declaredMemberError,
  describeDeclaredMember,
  readDeclaredRoleMembers,
} from './role-declarations.js';
import type { Session } from './session.js';
import { PLATFORM_SCHEMA } from './target.js';
import { describeReach, foreignReachError, readTenantReachRows } from './tenant-reach.js';
import {
  APP_GROUP_ROLE,
  classifyTenantRole,
  defaultAclAbsent,
  describeDefaultAclAbsent,
  describeState,
  readTenantRoleRows,
  tenantRoleName,
  type TenantRoleNames,
} from './tenant-role.js';
import {
  applyTenantRoleAct,
  divergentRoleError,
  foreignGrantorError,
  FULL_ACT,
} from './tenant-role-act.js';

/**
 * O que `migrate`, `provision` e `status` compartilham: bootstrap do livro-razão (§9), verificação
 * de divergência (§3), conjunto pendente e aplicação em ordem (§2.3, §2.4).
 */

export interface RunContext {
  readonly config: MigratorConfig;
  readonly session: Session;
  readonly events: EventRecorder;
  readonly loaded: LoadedSet;
  readonly report: (message: string) => void;
}

export type StreamScope = 'platform' | 'tenant';

export function streamOf(loaded: LoadedSet, scope: StreamScope): readonly LoadedMigration[] {
  return scope === 'platform' ? loaded.platform : loaded.tenant;
}

export function scopeOfSchema(schema: string): StreamScope {
  return schema === PLATFORM_SCHEMA ? 'platform' : 'tenant';
}

/**
 * §9. O executor não pergunta se o **nome** existe; pergunta o que existe com aquele nome, e o
 * retrato estrutural corre depois, em todos os caminhos: num banco novo, para conferir o que a
 * `0000` acabou de criar; num banco existente, antes de confiar nele.
 */
export async function bootstrapLedger(ctx: RunContext): Promise<void> {
  const client = ctx.session.client;
  const relkind = await probeLedgerRelkind(client);

  if (relkind === undefined) {
    const zero = ctx.loaded.platform.find((migration) => migration.number === 0);
    if (zero === undefined) {
      throw refused(
        'não existe platform/0000 no conjunto, e é ela que cria o livro-razão (CONTRATO.md §9)',
      );
    }
    ctx.report(`${PLATFORM_SCHEMA}: aplicando ${zero.version} (bootstrap do livro-razão)`);
    await applyMigration(
      ctx.config,
      client,
      zero,
      { schema: PLATFORM_SCHEMA, writeLedger: true, bootstrap: true },
      ctx.events,
    );
  } else if (relkind !== 'r') {
    await ctx.events.record({
      kind: 'ledger_structure_mismatch',
      schemaName: PLATFORM_SCHEMA,
      detail: `platform.schema_migrations existe com relkind "${relkind}", e não como tabela`,
    });
    throw diverged(
      `platform.schema_migrations existe com relkind "${relkind}": não é a tabela do livro-razão ` +
        '(CONTRATO.md §9). Nada foi aplicado.',
    );
  }

  try {
    await assertLedgerStructure(client);
  } catch (cause) {
    if (cause instanceof ExecutorError) {
      await ctx.events.record({
        kind: 'ledger_structure_mismatch',
        schemaName: PLATFORM_SCHEMA,
        detail: cause.message,
      });
    }
    throw cause;
  }
}

/**
 * §3. **Divergência é erro fatal que para tudo.** Em toda rodada, antes de aplicar qualquer coisa,
 * o executor compara o checksum registrado de cada versão já aplicada, em cada schema, contra o
 * arquivo em disco. Não existe modo de continuar, nem sinalizador que ignore.
 */
export async function assertNoDivergence(
  ctx: RunContext,
  ledgerRows: readonly LedgerRow[],
  scopeSchemas: readonly string[],
): Promise<void> {
  for (const row of ledgerRows) {
    const migration = ctx.loaded.byVersion.get(row.version);
    if (migration === undefined) {
      await ctx.events.record({
        kind: 'ledger_entry_without_file',
        schemaName: row.schema_name,
        version: row.version,
        checksumExpected: row.checksum,
      });
      throw diverged(
        `schema "${row.schema_name}", versão "${row.version}": registrada no livro-razão e sem ` +
          'arquivo em disco. Migration aplicada foi apagada ou renomeada (CONTRATO.md §3).',
      );
    }
    if (migration.checksum !== row.checksum) {
      await ctx.events.record({
        kind: 'checksum_mismatch',
        schemaName: row.schema_name,
        version: row.version,
        checksumExpected: row.checksum,
        checksumFound: migration.checksum,
      });
      throw diverged(
        `schema "${row.schema_name}", versão "${row.version}": migration aplicada foi editada.\n` +
          `  registrado: ${row.checksum}\n` +
          `  calculado:  ${migration.checksum}\n` +
          'Não existe modo de continuar: recuperar disso é decisão humana com a mão no repositório ' +
          '(CONTRATO.md §3).',
      );
    }
  }

  for (const schema of scopeSchemas) {
    await assertNothingBehindHead(ctx, ledgerRows, schema);
  }
}

export async function assertNothingBehindHead(
  ctx: RunContext,
  ledgerRows: readonly LedgerRow[],
  schema: string,
): Promise<void> {
  const stream = streamOf(ctx.loaded, scopeOfSchema(schema));
  const appliedVersions = new Set(
    ledgerRows.filter((row) => row.schema_name === schema).map((row) => row.version),
  );
  const head = stream
    .filter((migration) => appliedVersions.has(migration.version))
    .reduce((highest, migration) => Math.max(highest, migration.number), -1);

  for (const migration of stream) {
    if (appliedVersions.has(migration.version)) continue;
    if (migration.number >= head) continue;
    await ctx.events.record({
      kind: 'migration_behind_head',
      schemaName: schema,
      version: migration.version,
      detail: `maior número já aplicado nesse stream e schema: ${String(head).padStart(4, '0')}`,
    });
    throw diverged(
      `schema "${schema}": ${migration.version} está pendente e é anterior ao maior número já ` +
        `aplicado (${String(head).padStart(4, '0')}). Alguém inseriu migration atrás da cabeça da ` +
        'fila (CONTRATO.md §3).',
    );
  }
}

export interface PendingMigration {
  readonly migration: LoadedMigration;
  /** Linha com `applied_at` nulo: a rodada anterior morreu no meio desta (§8). */
  readonly inFlight: LedgerRow | undefined;
}

export function pendingFor(
  ctx: RunContext,
  ledgerRows: readonly LedgerRow[],
  schema: string,
): readonly PendingMigration[] {
  const rows = new Map(
    ledgerRows.filter((row) => row.schema_name === schema).map((row) => [row.version, row]),
  );
  const pending: PendingMigration[] = [];
  for (const migration of streamOf(ctx.loaded, scopeOfSchema(schema))) {
    const row = rows.get(migration.version);
    if (row === undefined) {
      pending.push({ migration, inFlight: undefined });
      continue;
    }
    if (row.applied_at === null) pending.push({ migration, inFlight: row });
  }
  return pending;
}

export async function applyPending(
  ctx: RunContext,
  schema: string,
  pending: readonly PendingMigration[],
  options: { readonly writeLedger: boolean } = { writeLedger: true },
): Promise<void> {
  for (const { migration, inFlight } of pending) {
    ctx.report(`${schema}: aplicando ${migration.version}`);
    await applyMigration(
      ctx.config,
      ctx.session.client,
      migration,
      {
        schema,
        writeLedger: options.writeLedger,
        inFlight,
      },
      ctx.events,
    );
  }
}

/**
 * §10.1: **`migrate` nunca cria schema.** Se um schema registrado não existe no catálogo, isso é
 * drift (`migrations.md` §9) e a rodada para, nomeando o schema. Criar schema é ato de `provision`,
 * e de mais ninguém — é essa fronteira que impede `--schema` de virar um criador de schema por
 * digitação.
 */
export async function assertRegisteredSchemasExist(
  ctx: RunContext,
  client: pg.Client,
  schemas: readonly string[],
): Promise<void> {
  for (const schema of schemas) {
    const found = await client.query('select 1 from pg_namespace where nspname = $1', [schema]);
    if (found.rowCount === 1) continue;
    await ctx.events.record({ kind: 'registered_schema_missing', schemaName: schema });
    throw diverged(
      `o schema "${schema}" está em platform.tenants e não existe no catálogo. É drift, e migrate ` +
        'não cria schema (APLICACAO-E-ALVO.md §10.1).',
    );
  }
}

export async function readLedgerRows(session: Session): Promise<readonly LedgerRow[]> {
  return readLedger(session.client);
}

export function tenantRoleNames(config: MigratorConfig): TenantRoleNames {
  return { group: APP_GROUP_ROLE, credential: requireAppCredential(config) };
}

/**
 * A convergência do papel de banco do cliente: `db/papel-do-cliente.md` §7.4.
 *
 * **Ela pergunta antes de agir**, e a pergunta é a mesma consulta da §7.5. Rodada em banco saudável
 * não escreve privilégio nenhum, e não exige do executor o privilégio de conceder; papel ausente
 * leva o ato inteiro; papel presente e incompleto leva só o que falta; papel presente e fora do ato
 * **para**, porque adotá-lo seria herdar alcance que ninguém declarou.
 *
 * No `migrate` ela roda ao fim de **todo** schema de cliente visitado, tenha a rodada aplicado
 * migration ali ou não: um cliente cujo `provision` morreu no passo 7 já está com tudo aplicado, e
 * convergir só quando aplicou algo o deixaria quebrado para sempre, com o comando dizendo "nada
 * pendente".
 *
 * **A pergunta invertida da §7.5.1 corre primeiro, e antes de qualquer escrita.** Ela é a única cuja
 * correção é `REVOKE`, que este ato não tem: alcance de terceiro para a rodada, e parar depois de
 * conceder deixaria privilégio novo num schema que já ia reprovar.
 */
export async function convergeTenantRole(
  ctx: RunContext,
  schema: string,
  options: { readonly mustBeAbsent?: boolean } = {},
): Promise<void> {
  const client = ctx.session.client;
  const names = tenantRoleNames(ctx.config);
  const rows = await readTenantRoleRows(client, names, schema);
  const row = rows[0];
  if (row === undefined) {
    throw applyFailed(
      `o schema "${schema}" não apareceu no catálogo na hora de conferir o papel de banco dele ` +
        '(db/papel-do-cliente.md §7.5)',
    );
  }

  /**
   * §7.5.5, o `PAP-24`, e ela corre junto da pergunta invertida pela mesma razão: conceder o papel do
   * cliente a uma credencial que tem membro é entregá-lo ao membro junto, e a correção é `REVOKE`,
   * que este ato não tem.
   */
  const membros = await readDeclaredRoleMembers(client);
  if (membros.length > 0) {
    for (const membro of membros) {
      await ctx.events.record({
        kind: 'declared_role_member',
        schemaName: schema,
        detail: describeDeclaredMember(membro),
      });
    }
    throw declaredMemberError(membros);
  }

  const alcances = await readTenantReachRows(client, names.group, schema);
  if (alcances.length > 0) {
    const detalhe = alcances.map(describeReach).join('; ');
    await ctx.events.record({
      kind: 'tenant_schema_foreign_grant',
      schemaName: schema,
      detail: detalhe,
    });
    throw foreignReachError(schema, alcances);
  }

  const state = classifyTenantRole(row);

  /**
   * **Antes do `mustBeAbsent` e antes de qualquer escrita**, o `PAP-13`: concessão herdável emitida
   * por outro concedente não converge e não se revoga daqui. Até o sexto gate este estado caía em
   * `incompleto`, a rodada reemitia a linha da §7.3 e **saía `0`** dizendo "completando o papel de
   * banco", com a herança de pé e a credencial nua lendo o cliente. Sair antes do `mustBeAbsent`
   * é o que faz `provision` e `migrate` darem o mesmo diagnóstico, que é o que nomeia o concedente.
   */
  if (state.kind === 'concedente_alheio') {
    const detalhe = describeState(row, state);
    await ctx.events.record({
      kind: 'tenant_role_foreign_grantor',
      schemaName: schema,
      detail: detalhe,
    });
    throw foreignGrantorError(schema, state.herancas);
  }

  /**
   * No `provision` o papel tem que estar **ausente**, pelo mesmo motivo do passo 3 sobre o schema, e
   * a redundância existe pela mesma razão: medido, o servidor recusa `CREATE ROLE` repetido com
   * `42710 role already exists`, então são duas travas para o mesmo erro de digitação.
   */
  if (options.mustBeAbsent === true && state.kind !== 'ausente') {
    const papel = tenantRoleName(schema);
    await ctx.events.record({
      kind: 'tenant_role_divergent',
      schemaName: schema,
      detail: `provision encontrou "${papel}" já existente: ${describeState(row, state)}`,
    });
    throw diverged(
      `o papel "${papel}" já existe, e provision não adota papel que ele não criou ` +
        `(${describeState(row, state)}). Se a intenção era retomar, use migrate --schema ${schema}, ` +
        'que converge (db/papel-do-cliente.md §7.4).',
    );
  }

  /**
   * O privilégio padrão saiu da classificação (§7.5) e continua sendo **parte a convergir**: quem
   * reemite o `ALTER DEFAULT PRIVILEGES` é o mesmo papel que vai criar a próxima tabela ali, que é
   * exatamente o sujeito de que a coluna fala.
   */
  const privilegioPadrao: readonly 'default_acl'[] = defaultAclAbsent(row) ? ['default_acl'] : [];

  switch (state.kind) {
    case 'conforme':
      if (privilegioPadrao.length === 0) return;
      ctx.report(`${schema}: completando o papel de banco — ${describeDefaultAclAbsent(row)}`);
      await applyTenantRoleAct(client, schema, names, { create: false, parts: privilegioPadrao });
      return;
    case 'divergente':
      await ctx.events.record({
        kind: 'tenant_role_divergent',
        schemaName: schema,
        detail: describeState(row, state),
      });
      throw divergentRoleError(schema, state.motivos);
    case 'ausente':
      ctx.report(`${schema}: criando o papel de banco "${tenantRoleName(schema)}"`);
      await applyTenantRoleAct(client, schema, names, FULL_ACT);
      return;
    case 'incompleto':
      ctx.report(`${schema}: completando o papel de banco — ${describeState(row, state)}`);
      await applyTenantRoleAct(client, schema, names, {
        create: false,
        parts: [...state.faltando, ...privilegioPadrao],
      });
      return;
  }
}

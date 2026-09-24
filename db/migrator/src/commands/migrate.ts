import { refused } from '../errors.js';
import { readTenants, tenantRegistryExists } from '../registry.js';
import { declareArrangement } from '../role-declarations.js';
import {
  applyPending,
  assertNoDivergence,
  assertNothingBehindHead,
  assertRegisteredSchemasExist,
  bootstrapLedger,
  convergeTenantRole,
  pendingFor,
  readLedgerRows,
  type RunContext,
} from '../run.js';
import { PLATFORM_SCHEMA } from '../target.js';

/**
 * `migrate`: aplica o pendente em `platform` e em todos os schemas de cliente registrados
 * (`PROVISION-E-VERIFY.md` §12).
 *
 * A ordem é normativa: `platform` é sempre processado antes de qualquer cliente, os clientes vêm em
 * ordem estável de nome, um de cada vez, e nunca há transação abrangendo dois schemas
 * (`CONTRATO.md` §2.4).
 */

export interface MigrateOptions {
  /** `--schema t_<slug>`: restringe a rodada a um schema **que esteja no registro** (§10.1). */
  readonly schema?: string | undefined;
}

export async function migrate(ctx: RunContext, options: MigrateOptions = {}): Promise<void> {
  const client = ctx.session.client;

  /**
   * O confronto de `--schema` corre **antes do bootstrap**, e não depois, porque §10.1 exige que um
   * nome fora do registro não aplique nada. Confrontar depois aplicaria a stream `platform` inteira
   * antes de descobrir que o nome não serve.
   */
  if (options.schema !== undefined) {
    if (!(await tenantRegistryExists(client))) {
      throw refused(
        'platform.tenants ainda não existe, então não há registro contra o qual confrontar ' +
          `"${options.schema}". Rode migrate sem --schema primeiro (APLICACAO-E-ALVO.md §10.1).`,
      );
    }
    const known = await readTenants(client);
    if (!known.some((tenant) => tenant.schema_name === options.schema)) {
      throw refused(
        `o schema "${options.schema}" não está em platform.tenants. O nome sempre volta a um ` +
          'registro (APLICACAO-E-ALVO.md §10.1), e migrate nunca cria schema. Nada foi aplicado.',
      );
    }
  }

  await bootstrapLedger(ctx);

  const ledgerRows = await readLedgerRows(ctx.session);
  await assertNoDivergence(ctx, ledgerRows, [PLATFORM_SCHEMA]);
  await applyPending(ctx, PLATFORM_SCHEMA, pendingFor(ctx, ledgerRows, PLATFORM_SCHEMA));

  /**
   * O arranjo é declarado depois de `platform` estar aplicado — é a `0011` que cria a tabela — e
   * antes de qualquer papel de cliente ser tocado, porque é essa tabela que a §7.5.1 lê para saber
   * quem alcança legitimamente (`db/universo-e-declaracao.md` §7.5.4).
   */
  await declareArrangement(ctx);

  const tenants = await readTenants(client);
  const targets =
    options.schema === undefined
      ? tenants.map((tenant) => tenant.schema_name)
      : [options.schema];

  for (const schema of targets) {
    await assertNothingBehindHead(ctx, ledgerRows, schema);
  }
  await assertRegisteredSchemasExist(ctx, client, targets);

  for (const schema of targets) {
    await applyPending(ctx, schema, pendingFor(ctx, ledgerRows, schema));
    /**
     * A convergência do papel de banco roda ao fim de **todo** schema visitado, tenha esta rodada
     * aplicado migration ali ou não (`db/papel-do-cliente.md` §7.4). É a única forma de a retomada
     * convergir: um cliente cujo `provision` morreu no passo 7 já tem tudo aplicado, e convergir só
     * quando aplicou algo o deixaria quebrado com o comando dizendo "nada pendente".
     */
    await convergeTenantRole(ctx, schema);
  }
}

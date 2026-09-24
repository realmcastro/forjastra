import { probeLedgerRelkind } from '../ledger.js';
import { readTenants, tenantRegistryExists } from '../registry.js';
import { pendingFor, readLedgerRows, scopeOfSchema, streamOf, type RunContext } from '../run.js';
import { PLATFORM_SCHEMA } from '../target.js';

/**
 * `status`: lista, por schema, o aplicado e o pendente. **Não escreve nada** — nem no livro-razão,
 * nem em `platform.executor_events`, nem no catálogo (`PROVISION-E-VERIFY.md` §12).
 *
 * Por isso ele também não faz bootstrap: um banco sem livro-razão é um estado que o `status` tem
 * que saber **relatar**, não corrigir.
 */
export async function status(ctx: RunContext): Promise<void> {
  const client = ctx.session.client;

  if (!(await tenantRegistryExists(client))) {
    ctx.report('platform.tenants não existe: o schema de controle ainda não foi aplicado.');
  }

  // O livro-razão pode não existir, e aqui isso é **estado a relatar**, não erro a engolir: a
  // pergunta é a mesma da §9, e a resposta dela decide se há o que ler.
  const relkind = await probeLedgerRelkind(client);
  if (relkind !== undefined && relkind !== 'r') {
    ctx.report(`platform.schema_migrations existe com relkind "${relkind}", e não como tabela.`);
  }
  const ledgerRows = relkind === 'r' ? await readLedgerRows(ctx.session) : [];
  const schemas = [
    PLATFORM_SCHEMA,
    ...(await tenantSchemas(ctx)),
  ];

  for (const schema of schemas) {
    const applied = ledgerRows.filter((row) => row.schema_name === schema);
    const inFlight = applied.filter((row) => row.applied_at === null);
    const pending = pendingFor(ctx, ledgerRows, schema);
    const total = streamOf(ctx.loaded, scopeOfSchema(schema)).length;

    ctx.report(
      `${schema}: ${applied.length - inFlight.length} de ${total} aplicadas, ` +
        `${pending.length} pendentes${inFlight.length > 0 ? `, ${inFlight.length} em voo` : ''}`,
    );
    for (const { migration, inFlight: row } of pending) {
      ctx.report(`  pendente: ${migration.version}${row === undefined ? '' : ' (em voo)'}`);
    }
  }
}

async function tenantSchemas(ctx: RunContext): Promise<readonly string[]> {
  if (!(await tenantRegistryExists(ctx.session.client))) return [];
  const tenants = await readTenants(ctx.session.client);
  return tenants.map((tenant) => tenant.schema_name);
}

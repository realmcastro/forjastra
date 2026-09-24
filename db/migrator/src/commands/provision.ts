import { refused } from '../errors.js';
import { insertTenant, isUniqueViolation } from '../registry.js';
import { declareArrangement } from '../role-declarations.js';
import {
  applyPending,
  assertNoDivergence,
  bootstrapLedger,
  convergeTenantRole,
  pendingFor,
  readLedgerRows,
  type RunContext,
} from '../run.js';
import { renderCommand } from '../session.js';
import { PLATFORM_SCHEMA, tenantSchemaNameFromSlug } from '../target.js';
import { uuidV7 } from '../uuid-v7.js';
import { schemaExists } from '../apply.js';

/**
 * `provision <slug>`: `PROVISION-E-VERIFY.md` §13.1.
 *
 * A ordem é normativa, e cada passo é uma trava que não depende do passo anterior ter sido escrito.
 * Os passos 3 e 4 são redundantes de propósito — um é verificação do executor, o outro é recusa do
 * servidor. O erro que essa redundância cobre não é ataque, é digitação, e o desfecho dela era dois
 * clientes registrados apontando para o mesmo schema.
 */
export async function provision(ctx: RunContext, slug: string): Promise<void> {
  // Passo 1: forma. Antes de qualquer conexão de trabalho e antes de qualquer escrita.
  const schema = tenantSchemaNameFromSlug(slug);

  // O registro de clientes e o livro-razão precisam existir antes de haver onde registrar.
  await bootstrapLedger(ctx);
  const ledgerRows = await readLedgerRows(ctx.session);
  await assertNoDivergence(ctx, ledgerRows, [PLATFORM_SCHEMA]);
  await applyPending(ctx, PLATFORM_SCHEMA, pendingFor(ctx, ledgerRows, PLATFORM_SCHEMA));

  /**
   * O arranjo é declarado antes do passo 2, porque o passo 7 concede a um papel que a §7.5.1
   * precisa reconhecer depois — e porque recusar aqui, antes de qualquer escrita, é mais barato que
   * recusar com o cliente já registrado (`db/universo-e-declaracao.md` §7.5.4).
   */
  await declareArrangement(ctx);

  const client = ctx.session.client;
  await client.query('begin');
  try {
    // Passo 2: identidade. O UNIQUE (slug) é a trava estrutural.
    try {
      await insertTenant(client, uuidV7(), slug);
    } catch (cause) {
      if (!isUniqueViolation(cause)) throw cause;
      throw refused(
        `cliente já registrado: "${slug}". Se a intenção era retomar uma aplicação que parou no ` +
          `meio, use migrate --schema ${schema} (PROVISION-E-VERIFY.md §13.1).`,
        { cause },
      );
    }

    // Passo 3: ausência do schema, conferida no catálogo.
    if (await schemaExists(client, schema)) {
      throw refused(
        `o schema "${schema}" já existe no catálogo. provision não entra em schema existente: ` +
          'identidade não se cria duas vezes (PROVISION-E-VERIFY.md §13.1).',
      );
    }

    /**
     * Passo 4: criação, **sem `IF NOT EXISTS`**. Medido: sobre schema existente o servidor recusa
     * com `42P06` e a transação rola de volta. Com `IF NOT EXISTS` o servidor emite um `NOTICE` e
     * segue — foi assim que o auditor entrou no schema de um cliente existente e aplicou o núcleo
     * inteiro dentro dele, com saída de sucesso.
     *
     * O nome vai como parâmetro e quem o cita é o servidor (§10.3.0).
     */
    const createSchema = await renderCommand(client, 'CREATE SCHEMA %I', schema);
    await client.query(createSchema);

    // Passo 5: identidade e schema no mesmo commit.
    await client.query('commit');
  } catch (cause) {
    await client.query('rollback').catch(() => undefined);
    throw cause;
  }

  ctx.report(`cliente "${slug}" registrado, schema "${schema}" criado`);

  /**
   * Passo 6: as migrations de núcleo, cada uma no seu commit. Módulo não entra aqui enquanto não
   * existir o registro de ativação (`CONTRATO.md` §2.3): não há o que ler, e a §11.6 recusa a
   * rodada se houver arquivo de módulo no repositório.
   *
   * Falha aqui deixa o cliente registrado e o schema criado, com parte das migrations aplicadas. A
   * retomada é `migrate --schema`, e rodar `provision` de novo é recusado no passo 2. Isso é
   * desenho, não limitação.
   */
  const rowsAfterPlatform = await readLedgerRows(ctx.session);
  await applyPending(ctx, schema, pendingFor(ctx, rowsAfterPlatform, schema));

  /**
   * Passo 7: o papel de banco do cliente, os `GRANT` dele e o privilégio padrão do schema, num
   * commit só (`db/papel-do-cliente.md` §7.3). **Depois do passo 6** porque
   * `GRANT … ON ALL TABLES` precisa das tabelas já criadas; o que vier depois é coberto pelo
   * `ALTER DEFAULT PRIVILEGES` do mesmo commit.
   *
   * Falha aqui deixa o mesmo estado que falha no passo 6 — cliente registrado, schema criado,
   * migrations aplicadas — e a retomada é a mesma: `migrate --schema`, que converge.
   */
  await convergeTenantRole(ctx, schema, { mustBeAbsent: true });
  ctx.report(`papel de banco de "${slug}" criado`);
}

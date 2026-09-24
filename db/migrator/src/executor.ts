import { requireAppCredential, type MigratorConfig } from './config.js';
import { resolveContentScreen, type ContentScreen } from './content-screen.js';
import { createEventRecorder, type EventRecorder } from './events.js';
import { load } from './loader.js';
import { assertOperatorActDone } from './preconditions.js';
import { migrate } from './commands/migrate.js';
import { provision } from './commands/provision.js';
import { status } from './commands/status.js';
import { verify } from './commands/verify.js';
import type { RunContext } from './run.js';
import { LoadRefusedError, refused } from './errors.js';
import { assertServerVersion, openSession } from './session.js';
import { APP_GROUP_ROLE, TENANT_ROLE_PREFIX } from './tenant-role.js';
import { uuidV7 } from './uuid-v7.js';

/**
 * A raiz de composição: onde o crivo de conteúdo, a configuração e a conexão se encontram.
 *
 * **O carregamento acontece antes da conexão**, e é isso que faz uma recusa da §11 não abrir sequer
 * um socket. É também aqui que a ausência do crivo vira recusa da rodada (`loader.ts`).
 */

export type Command =
  | { readonly kind: 'migrate'; readonly schema?: string | undefined }
  | { readonly kind: 'status' }
  | { readonly kind: 'provision'; readonly slug: string }
  | { readonly kind: 'verify' };

export interface RunOptions {
  readonly config: MigratorConfig;
  readonly report: (message: string) => void;
  /**
   * O crivo da §11. Em produção vem de `resolveContentScreen()`, que devolve o crivo real desde que
   * a §11 foi implementada (`content-screen.ts`). O parâmetro existe para o teste da verificação de
   * namespace (§10.4) poder passar um crivo permissivo — nunca para afrouxar a recusa em produção.
   */
  readonly contentScreen?: ContentScreen | undefined;
}

export async function run(command: Command, options: RunOptions): Promise<void> {
  const screen = options.contentScreen ?? resolveContentScreen();
  const events = createEventRecorder(options.config, uuidV7, options.report);

  /**
   * A credencial da aplicação é exigida **antes do carregamento e antes da conexão**, nos três
   * comandos que criam ou conferem papel de cliente (`db/papel-do-cliente.md` §7.1). `status` não a
   * exige porque não escreve nada.
   */
  const appCredential =
    command.kind === 'status' ? undefined : requireAppCredential(options.config);

  let loaded;
  try {
    loaded = load(options.config.migrationsDir, screen);
  } catch (cause) {
    if (cause instanceof LoadRefusedError) await recordRefusals(events, cause);
    throw cause;
  }
  const session = await openSession(options.config);
  const ctx: RunContext = {
    config: options.config,
    session,
    events,
    loaded,
    report: options.report,
  };

  try {
    // Antes de qualquer outra coisa na conexão de controle, e antes de o primeiro schema ser
    // tocado: o piso de versão do servidor (§6).
    await assertServerVersion(session.client);
    assertExecutorOutsideRolePrefix(session.dbRole);
    /**
     * E antes da primeira escrita, a §7.7: o ato do operador (§7.2) é precondição do ato do
     * executor, e o que ninguém confere vira erro do servidor no meio da fila — no `provision`,
     * depois de o cliente já existir.
     */
    if (appCredential !== undefined) {
      await assertOperatorActDone(session.client, {
        group: APP_GROUP_ROLE,
        credential: appCredential,
      });
    }

    switch (command.kind) {
      case 'migrate':
        await migrate(ctx, { schema: command.schema });
        return;
      case 'status':
        await status(ctx);
        return;
      case 'provision':
        await provision(ctx, command.slug);
        return;
      case 'verify':
        await verify(ctx);
        return;
    }
  } finally {
    await session.end();
  }
}

/**
 * A outra metade da reserva do prefixo (`db/papel-do-cliente.md` §7.1): nem a credencial nem o papel
 * do executor podem usá-lo. Um executor chamado `app_t_algo` seria o papel de banco de algum schema
 * pela junção da §7.5, e o privilégio padrão daquele schema passaria a apontar para ele mesmo.
 */
function assertExecutorOutsideRolePrefix(dbRole: string): void {
  if (!dbRole.startsWith(TENANT_ROLE_PREFIX)) return;
  throw refused(
    `a conexão do executor é o papel "${dbRole}", e o prefixo "${TENANT_ROLE_PREFIX}" é reservado ` +
      'ao papel de banco de cada cliente (db/papel-do-cliente.md §7.1). Nada foi aplicado.',
  );
}

/**
 * §19.4: a conexão é aberta **depois da decisão de recusar**, e só para escrever o fato. A decisão
 * já está tomada, nenhum arquivo roda, e falhar ao escrever não muda o desfecho nem a saída `2`
 * (§19.2) — o que é especialmente provável aqui, porque a recusa acontece no primeiro comando de
 * quem está editando migration, muitas vezes sem banco de pé.
 *
 * Uma linha por arquivo recusado: `version` leva o caminho do arquivo e `schema_name` fica nulo,
 * porque nenhum schema foi tocado.
 */
async function recordRefusals(events: EventRecorder, refusal: LoadRefusedError): Promise<void> {
  for (const entry of refusal.entries) {
    await events.record({
      kind: 'load_refused',
      version: entry.version,
      detail: entry.message,
    });
  }
}

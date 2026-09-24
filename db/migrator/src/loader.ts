import type { ContentScreen } from './content-screen.js';
import { discover, type DiscoveredMigration } from './discovery.js';
import { ExecutorError, EXIT_REFUSED, LoadRefusedError, refused, type LoadRefusal } from './errors.js';

/**
 * O carregamento inteiro, e ele acontece **antes de abrir conexão** (`RECUSAS.md` §11).
 *
 * Ordem: descoberta e checksum (§2, §3) → crivo de conteúdo (§11) → conjunto carregado. O crivo é
 * obrigatório: sem ele a rodada é recusada, com saída `2`. Ver `content-screen.ts` para por quê.
 */

export interface LoadedMigration extends DiscoveredMigration {
  /** Comandos separados pelo crivo (§11.1, passo 3). Usados pelo regime não-transacional. */
  readonly commands: readonly string[];
}

export interface LoadedSet {
  readonly platform: readonly LoadedMigration[];
  readonly tenant: readonly LoadedMigration[];
  readonly byVersion: ReadonlyMap<string, LoadedMigration>;
}

export function load(migrationsDir: string, screen: ContentScreen | undefined): LoadedSet {
  if (screen === undefined) {
    throw refused(
      'o crivo de conteúdo da §11 não está implementado, e sem ele nenhuma migration é aplicada. ' +
        'A §11.3 está em correção (identificador citado e maiúsculo atravessavam a fronteira de ' +
        'schema, medido). Ver db/migrator/src/content-screen.ts.',
    );
  }

  let discovered;
  try {
    discovered = discover(migrationsDir);
  } catch (cause) {
    throw asLoadRefusal(cause);
  }

  /**
   * O crivo corre em **todos** os arquivos antes de a rodada morrer, porque §19.4 pede uma linha
   * `load_refused` **por arquivo recusado**. Parar no primeiro esconderia os demais de quem está
   * corrigindo, e o custo de continuar é zero: nada disso toca o banco.
   */
  const refusals: LoadRefusal[] = [];
  const screened: LoadedMigration[] = [];
  for (const migration of discovered.all) {
    try {
      screened.push({
        ...migration,
        commands: screen.screen({
          version: migration.version,
          text: migration.text,
          header: migration.header,
        }),
      });
    } catch (cause) {
      refusals.push(refusalOf(cause, migration.version));
    }
  }
  if (refusals.length > 0) throw new LoadRefusedError(refusals);

  const byVersion = new Map(screened.map((migration) => [migration.version, migration]));
  return {
    platform: screened.filter((migration) => migration.streamKind === 'platform'),
    tenant: screened.filter((migration) => migration.streamKind === 'tenant'),
    byVersion,
  };
}

function asLoadRefusal(cause: unknown): unknown {
  if (cause instanceof ExecutorError && cause.exitCode === EXIT_REFUSED) {
    return new LoadRefusedError([{ version: cause.version, message: cause.message }]);
  }
  return cause;
}

function refusalOf(cause: unknown, version: string): LoadRefusal {
  if (cause instanceof ExecutorError && cause.exitCode === EXIT_REFUSED) {
    return { version: cause.version ?? version, message: cause.message };
  }
  throw cause;
}

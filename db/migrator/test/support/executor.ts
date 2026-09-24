import type { MigratorConfig } from '../../src/config.js';
import { ExecutorError, EXIT_APPLY_FAILED, EXIT_OK, type ExitCode } from '../../src/errors.js';
import { run, type Command } from '../../src/executor.js';
import type { ContentScreen } from '../../src/content-screen.js';
import { REAL_PLATFORM_REFERENCE } from './tree.js';
import { APP_CREDENTIAL_ROLE } from './postgres.js';

/**
 * Roda o executor como o comando roda, e devolve o mesmo que o processo devolveria: código de saída
 * e o que foi impresso. O teste cobra o código de saída porque ele é contrato
 * (`PROVISION-E-VERIFY.md` §12), não detalhe de implementação.
 */

export interface RunResult {
  readonly exitCode: ExitCode;
  readonly output: string;
  readonly error: string | undefined;
}

export interface RunOptions {
  readonly url: string;
  readonly migrationsDir: string;
  readonly platformReference?: string;
  /**
   * Ausente: o crivo real da §11. Só o teste da verificação de namespace (§10.4) passa um crivo
   * permissivo aqui, e o motivo está em `screen.ts`.
   */
  readonly contentScreen?: ContentScreen;
  /**
   * O nome da credencial da aplicação (`db/papel-do-cliente.md` §7.1). O padrão é a credencial que
   * `createDatabase` garante no cluster; o teste da ausência da chave passa `null` aqui.
   */
  readonly appCredentialRole?: string | null;
}

export function testConfig(options: RunOptions): MigratorConfig {
  return {
    connectionString: options.url,
    lockTimeoutMs: 5_000,
    idleInTransactionTimeoutMs: 30_000,
    connectionTimeoutMs: 10_000,
    migrationsDir: options.migrationsDir,
    platformReferenceFile: options.platformReference ?? REAL_PLATFORM_REFERENCE,
    appCredentialRole:
      options.appCredentialRole === null
        ? undefined
        : options.appCredentialRole ?? APP_CREDENTIAL_ROLE,
  };
}

export async function runExecutor(command: Command, options: RunOptions): Promise<RunResult> {
  const lines: string[] = [];
  try {
    await run(command, {
      config: testConfig(options),
      report: (message) => lines.push(message),
      ...(options.contentScreen === undefined ? {} : { contentScreen: options.contentScreen }),
    });
    return { exitCode: EXIT_OK, output: lines.join('\n'), error: undefined };
  } catch (cause) {
    if (cause instanceof ExecutorError) {
      return { exitCode: cause.exitCode, output: lines.join('\n'), error: cause.message };
    }
    return {
      exitCode: EXIT_APPLY_FAILED,
      output: lines.join('\n'),
      error: cause instanceof Error ? cause.message : String(cause),
    };
  }
}

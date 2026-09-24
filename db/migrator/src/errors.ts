/**
 * Falha do executor, com o código de saída de `PROVISION-E-VERIFY.md` §12 grudado nela.
 *
 * O código é parte do erro e não do ponto de saída porque cada código pede uma ação humana
 * diferente: `1` normalmente se resolve reexecutando, `2` editando um arquivo ou corrigindo o
 * comando, `3` nunca se resolve reexecutando, e `4` diz que ninguém ainda sabe se está certo.
 * Decidir isso no `catch` do `main` obrigaria a adivinhar a origem pela mensagem.
 */

/** Os cinco de `PROVISION-E-VERIFY.md` §12. */
export const EXIT_OK = 0;
export const EXIT_APPLY_FAILED = 1;
export const EXIT_REFUSED = 2;
export const EXIT_DIVERGED = 3;
export const EXIT_UNVERIFIABLE = 4;

export type ExitCode =
  | typeof EXIT_OK
  | typeof EXIT_APPLY_FAILED
  | typeof EXIT_REFUSED
  | typeof EXIT_DIVERGED
  | typeof EXIT_UNVERIFIABLE;

export interface ExecutorErrorOptions {
  readonly cause?: unknown;
  /**
   * O arquivo recusado, na forma de versão de `CONTRATO.md` §1. É ele que vai para a coluna
   * `version` da linha `load_refused` (§19.4), que pede **uma linha por arquivo recusado**.
   */
  readonly version?: string | undefined;
  /**
   * O evento de `platform.executor_events` desta falha já foi escrito por quem a detectou, com o
   * tipo específico dela. Sem esta marca, a camada de aplicação escreveria um `migration_failed`
   * genérico por cima de um `object_outside_target`, e o mesmo fato viraria duas linhas.
   */
  readonly recorded?: boolean;
}

export class ExecutorError extends Error {
  readonly exitCode: ExitCode;
  readonly recorded: boolean;
  readonly version: string | undefined;

  constructor(exitCode: ExitCode, message: string, options: ExecutorErrorOptions = {}) {
    super(message, options.cause === undefined ? undefined : { cause: options.cause });
    this.name = 'ExecutorError';
    this.exitCode = exitCode;
    this.recorded = options.recorded === true;
    this.version = options.version;
  }
}

/**
 * Recusa do carregador (§11), com a lista do que foi recusado, arquivo por arquivo.
 *
 * Ela existe separada porque o desfecho dela tem um passo a mais que as outras recusas: depois da
 * decisão, e só depois dela, o executor abre uma conexão para escrever `load_refused` (§19.4).
 */
export class LoadRefusedError extends ExecutorError {
  readonly entries: readonly LoadRefusal[];

  constructor(entries: readonly LoadRefusal[]) {
    super(
      EXIT_REFUSED,
      entries.map((entry) => entry.message).join('\n'),
      entries.length === 1 ? { version: entries[0]!.version } : {},
    );
    this.name = 'LoadRefusedError';
    this.entries = entries;
  }
}

export interface LoadRefusal {
  /** Caminho do arquivo, quando a recusa é de um arquivo. Ausente quando é da rodada (§11.6). */
  readonly version: string | undefined;
  readonly message: string;
}

export function refused(message: string, options?: ExecutorErrorOptions): ExecutorError {
  return new ExecutorError(EXIT_REFUSED, message, options);
}

export function diverged(message: string, options?: ExecutorErrorOptions): ExecutorError {
  return new ExecutorError(EXIT_DIVERGED, message, options);
}

export function applyFailed(message: string, options?: ExecutorErrorOptions): ExecutorError {
  return new ExecutorError(EXIT_APPLY_FAILED, message, options);
}

export function unverifiable(message: string, options?: ExecutorErrorOptions): ExecutorError {
  return new ExecutorError(EXIT_UNVERIFIABLE, message, options);
}

export function describeCause(cause: unknown): string {
  if (cause instanceof Error) return cause.message;
  return String(cause);
}

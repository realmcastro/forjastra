import { copyFileSync, mkdirSync, mkdtempSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Árvore de migrations descartável para teste.
 *
 * A stream `platform` é **copiada do repositório**, byte a byte, e não recriada: é ela que o
 * checksum do livro-razão registra e é contra a impressão dela que
 * `db/referencia-estrutural-platform.txt` foi gerado. Recriar o conteúdo aqui produziria um teste
 * que passa contra um arquivo que não existe.
 *
 * A stream `tenant` não existe no repositório ainda (a Fase 1 entregou só o `platform`), então ela é
 * escrita aqui, por arquivo, pelo caso de teste que precisa dela.
 */

/** `db/` a partir de `db/migrator/dist/test/support/tree.js`. */
const REPO_DB_DIR = fileURLToPath(new URL('../../../../', import.meta.url));

export const REAL_PLATFORM_DIR = join(REPO_DB_DIR, 'migrations', 'platform');
export const REAL_PLATFORM_REFERENCE = join(REPO_DB_DIR, 'referencia-estrutural-platform.txt');

export interface FixtureFile {
  readonly name: string;
  readonly text: string;
}

export interface TreeOptions {
  readonly platform?: 'repositorio' | readonly FixtureFile[];
  readonly tenant?: readonly FixtureFile[];
  readonly modules?: Readonly<Record<string, readonly FixtureFile[]>>;
}

export function buildMigrationsDir(options: TreeOptions = {}): string {
  const root = mkdtempSync(join(tmpdir(), 'forja-migrations-'));

  const platform = options.platform ?? 'repositorio';
  if (platform === 'repositorio') {
    const target = join(root, 'platform');
    mkdirSync(target);
    for (const file of readdirSync(REAL_PLATFORM_DIR)) {
      copyFileSync(join(REAL_PLATFORM_DIR, file), join(target, file));
    }
  } else {
    writeFiles(join(root, 'platform'), platform);
  }

  if (options.tenant !== undefined) writeFiles(join(root, 'tenant'), options.tenant);

  for (const [code, files] of Object.entries(options.modules ?? {})) {
    writeFiles(join(root, 'modules', code), files);
  }

  return root;
}

function writeFiles(directory: string, files: readonly FixtureFile[]): void {
  mkdirSync(directory, { recursive: true });
  for (const file of files) writeFileSync(join(directory, file.name), file.text, 'utf-8');
}

/** Cabeçalho mínimo que passa pela §4, para o corpo do teste ficar visível. */
export function tenantMigration(body: string, options: { transacional?: boolean; criaIndice?: string } = {}): string {
  const transacional = options.transacional === false ? 'nao' : 'sim';
  const criaIndice = options.criaIndice === undefined ? '' : `-- cria-indice: ${options.criaIndice}\n`;
  return (
    '-- alvo: tenant\n' +
    `-- transacional: ${transacional}\n` +
    '-- reversivel: nao; fixture de teste, e a inversa apagaria o que ela cria\n' +
    criaIndice +
    '\n' +
    body.trimStart()
  );
}

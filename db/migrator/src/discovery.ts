import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { refused } from './errors.js';
import { parseHeader, type MigrationHeader } from './header.js';

/**
 * Descoberta, ordem e checksum: `CONTRATO.md` §2 e §3, mais a recusa de rodada de
 * `RECUSAS.md` §11.6.
 *
 * Tudo aqui acontece **antes de abrir conexão**. Recusa daqui aborta a rodada inteira com saída
 * `2`, nomeando arquivo e trecho, e não existe sinalizador que ignore.
 */

export type StreamKind = 'platform' | 'tenant' | 'module';

export interface DiscoveredMigration {
  /** Caminho relativo a `db/migrations/`, sem `.sql` (`CONTRATO.md` §1). */
  readonly version: string;
  readonly absolutePath: string;
  /** `platform`, `tenant` ou `module:<CODIGO>`. */
  readonly stream: string;
  readonly streamKind: StreamKind;
  readonly moduleCode: string | undefined;
  readonly number: number;
  readonly text: string;
  readonly checksum: string;
  readonly header: MigrationHeader;
}

export interface DiscoveredSet {
  readonly platform: readonly DiscoveredMigration[];
  readonly tenant: readonly DiscoveredMigration[];
  /** Vazio enquanto a §11.6 valer: arquivo de módulo recusa a rodada antes de chegar aqui. */
  readonly modules: ReadonlyMap<string, readonly DiscoveredMigration[]>;
  readonly all: readonly DiscoveredMigration[];
}

const FILE_NAME = /^(\d{4})__([a-z0-9_]+)\.sql$/;
const KNOWN_DIRECTORIES = ['platform', 'tenant', 'modules'] as const;
const MODULE_DIRECTORY = /^[a-z]{3}$/;

/** O `0000` é reservado ao ledger, a única migration aplicada antes de existir ledger (§2.2). */
const FIRST_LEGAL_NUMBER: Readonly<Record<StreamKind, number>> = {
  platform: 0,
  tenant: 1,
  module: 1,
};

export function discover(migrationsDir: string): DiscoveredSet {
  const entries = listDirectory(migrationsDir);
  for (const entry of entries) {
    if (!(KNOWN_DIRECTORIES as readonly string[]).includes(entry)) {
      throw refused(
        `db/migrations/${entry}: fora do layout de CONTRATO.md §2.1, que tem platform/, tenant/ e modules/<codigo>/`,
      );
    }
  }

  refuseModuleStream(migrationsDir);

  const platform = readStream(migrationsDir, 'platform', 'platform', undefined);
  const tenant = readStream(migrationsDir, 'tenant', 'tenant', undefined);

  return {
    platform,
    tenant,
    modules: new Map(),
    all: [...platform, ...tenant],
  };
}

/**
 * `RECUSAS.md` §11.6: enquanto não existir em `platform` o registro de módulo ativo por cliente, a
 * presença de **qualquer** arquivo em `db/migrations/modules/**` recusa a rodada inteira.
 *
 * Sem o registro, o executor não sabe em que cliente aplicar aquela migration, e as três saídas de
 * quem implementa são piores que parar: tratar todo cliente como sem módulo faz o `verify` aprovar
 * cliente cujas tabelas de módulo ninguém comparou.
 */
function refuseModuleStream(migrationsDir: string): void {
  const modulesDir = join(migrationsDir, 'modules');
  const found: string[] = [];
  for (const moduleDir of listDirectory(modulesDir)) {
    for (const file of listDirectory(join(modulesDir, moduleDir))) {
      found.push(`modules/${moduleDir}/${file}`);
    }
    if (!MODULE_DIRECTORY.test(moduleDir)) found.push(`modules/${moduleDir}`);
  }
  if (found.length === 0) return;
  throw refused(
    `stream de módulo não é aplicada por nenhum comando enquanto não existir o registro de ativação ` +
      `em platform (CONTRATO.md §2.3, RECUSAS.md §11.6). Encontrado: ${found.join(', ')}`,
  );
}

function readStream(
  migrationsDir: string,
  directory: string,
  streamKind: StreamKind,
  moduleCode: string | undefined,
): readonly DiscoveredMigration[] {
  const stream = moduleCode === undefined ? streamKind : `module:${moduleCode}`;
  const files = listDirectory(join(migrationsDir, directory));
  const migrations: DiscoveredMigration[] = [];
  const byNumber = new Map<number, string>();

  for (const file of files) {
    const matched = FILE_NAME.exec(file);
    if (!matched) {
      throw refused(
        `${directory}/${file}: nome fora da forma NNNN__nome.sql, com quatro dígitos (CONTRATO.md §2.1)`,
      );
    }
    const number = Number.parseInt(matched[1]!, 10);
    const previous = byNumber.get(number);
    if (previous !== undefined) {
      throw refused(
        `stream ${stream}: número ${matched[1]} aparece em dois arquivos, "${previous}" e "${file}" (CONTRATO.md §2.2)`,
      );
    }
    byNumber.set(number, file);

    const version = `${directory}/${file.slice(0, -'.sql'.length)}`;
    const absolutePath = join(migrationsDir, directory, file);
    const text = readText(absolutePath, version);
    const { header } = parseHeader(text, version);
    assertHeaderAgreesWithDirectory(header, streamKind, moduleCode, version);

    migrations.push({
      version,
      absolutePath,
      stream,
      streamKind,
      moduleCode,
      number,
      text,
      checksum: checksumOf(text),
      header,
    });
  }

  migrations.sort((a, b) => a.number - b.number);
  assertNoGap(migrations, streamKind, stream);
  return migrations;
}

/**
 * Buraco é conflito de merge não resolvido, e a rodada não é o lugar de descobrir isso (§2.2). A
 * conta parte do primeiro número **legal** da stream: partir do primeiro arquivo encontrado deixaria
 * passar a ausência de um `platform/0001` recém-apagado.
 */
function assertNoGap(
  migrations: readonly DiscoveredMigration[],
  streamKind: StreamKind,
  stream: string,
): void {
  let expected = FIRST_LEGAL_NUMBER[streamKind];
  for (const migration of migrations) {
    if (migration.number !== expected) {
      throw refused(
        `stream ${stream}: buraco na numeração, esperava ${String(expected).padStart(4, '0')} e encontrou ` +
          `${String(migration.number).padStart(4, '0')} em ${migration.version} (CONTRATO.md §2.2)`,
      );
    }
    expected += 1;
  }
}

function assertHeaderAgreesWithDirectory(
  header: MigrationHeader,
  streamKind: StreamKind,
  moduleCode: string | undefined,
  version: string,
): void {
  const expectedAlvo = streamKind === 'platform' ? 'platform' : 'tenant';
  if (header.alvo !== expectedAlvo) {
    throw refused(
      `${version}: cabeçalho declara alvo "${header.alvo}" e o diretório diz "${expectedAlvo}" (RECUSAS.md §11.4)`,
    );
  }
  if (moduleCode === undefined && header.modulo !== undefined) {
    throw refused(`${version}: diretiva modulo fora da stream de módulo (CONTRATO.md §4)`);
  }
  if (moduleCode !== undefined && header.modulo !== moduleCode) {
    throw refused(
      `${version}: modulo "${header.modulo ?? '(ausente)'}" não é o nome do diretório em maiúsculas, "${moduleCode}"`,
    );
  }
}

/**
 * `CONTRATO.md` §3: o checksum é dos **bytes**, sem normalização nenhuma. Para que a ausência de
 * normalização não produza falso positivo, arquivo com `CR` ou que não seja UTF-8 válido é
 * recusado — assim a única causa possível de divergência é edição de conteúdo.
 */
function readText(absolutePath: string, version: string): string {
  const bytes = readFileSync(absolutePath);
  if (bytes.includes(0x0d)) {
    throw refused(`${version}: contém CR (0x0D); o checksum é dos bytes e não normaliza (§3)`);
  }
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch (cause) {
    throw refused(`${version}: não é UTF-8 válido (§3)`, { cause });
  }
}

export function checksumOf(text: string): string {
  return createHash('sha256').update(Buffer.from(text, 'utf-8')).digest('hex');
}

function listDirectory(path: string): readonly string[] {
  let entries: readonly string[];
  try {
    entries = readdirSync(path);
  } catch (cause) {
    if ((cause as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw cause;
  }
  return [...entries].filter((entry) => !entry.startsWith('.')).sort();
}


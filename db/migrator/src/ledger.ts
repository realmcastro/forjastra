import type pg from 'pg';
import { diverged } from './errors.js';

/**
 * O livro-razão `platform.schema_migrations`: `CONTRATO.md` §5, e o bootstrap da §9.
 *
 * A unidade de aplicação é `(schema_name, version)`, que é também a chave primária natural. Linha
 * do livro-razão nunca é apagada, e a única atualização que o executor emite em todo o desenho é a
 * conclusão de uma migration em voo (§8, passo 5).
 */

export const LEDGER_SCHEMA = 'platform';
export const LEDGER_TABLE = 'schema_migrations';

export interface LedgerRow {
  readonly schema_name: string;
  readonly version: string;
  readonly checksum: string;
  readonly module: string | null;
  readonly started_at: Date;
  readonly applied_at: Date | null;
  readonly duration_ms: number | null;
}

const INSERT_SQL = `
insert into platform.schema_migrations
    (schema_name, version, checksum, module, started_at, applied_at, duration_ms)
values ($1, $2, $3, $4, $5, $6, $7)
`;

/**
 * O `ON CONFLICT DO NOTHING` existe **só** no bootstrap (§9): ele corre antes de haver conjunto
 * pendente calculado, então precisa tolerar um ledger que já tenha a linha — o caso é banco
 * ajustado na mão, e abortar ali transformaria drift em impossibilidade de rodar. Para as demais
 * migrations o `INSERT` é simples, porque linha pré-existente significaria duas rodadas
 * simultâneas, que este desenho não admite (§16).
 */
const INSERT_BOOTSTRAP_SQL = `${INSERT_SQL} on conflict do nothing`;

const INSERT_IN_FLIGHT_SQL = `
insert into platform.schema_migrations
    (schema_name, version, checksum, module, started_at, applied_at, duration_ms)
values ($1, $2, $3, $4, $5, null, null)
`;

const COMPLETE_IN_FLIGHT_SQL = `
update platform.schema_migrations
   set applied_at = $1, duration_ms = $2
 where schema_name = $3 and version = $4
`;

const READ_SQL = `
select schema_name, version, checksum, module, started_at, applied_at, duration_ms
  from platform.schema_migrations
`;

export interface LedgerEntryInput {
  readonly schemaName: string;
  readonly version: string;
  readonly checksum: string;
  readonly module: string | undefined;
  readonly startedAt: Date;
  readonly appliedAt: Date;
  readonly durationMs: number;
}

export async function insertLedgerEntry(
  client: pg.Client,
  entry: LedgerEntryInput,
  options: { readonly bootstrap: boolean } = { bootstrap: false },
): Promise<void> {
  await client.query(options.bootstrap ? INSERT_BOOTSTRAP_SQL : INSERT_SQL, [
    entry.schemaName,
    entry.version,
    entry.checksum,
    entry.module ?? null,
    entry.startedAt,
    entry.appliedAt,
    entry.durationMs,
  ]);
}

/** Passo 1 da §8: a marca de "em voo", com `applied_at` nulo, em commit próprio. */
export async function insertInFlightEntry(
  client: pg.Client,
  entry: {
    readonly schemaName: string;
    readonly version: string;
    readonly checksum: string;
    readonly module: string | undefined;
    readonly startedAt: Date;
  },
): Promise<void> {
  await client.query(INSERT_IN_FLIGHT_SQL, [
    entry.schemaName,
    entry.version,
    entry.checksum,
    entry.module ?? null,
    entry.startedAt,
  ]);
}

/** Passo 5 da §8. É a única atualização que o executor emite no livro-razão. */
export async function completeInFlightEntry(
  client: pg.Client,
  entry: {
    readonly schemaName: string;
    readonly version: string;
    readonly appliedAt: Date;
    readonly durationMs: number;
  },
): Promise<void> {
  await client.query(COMPLETE_IN_FLIGHT_SQL, [
    entry.appliedAt,
    entry.durationMs,
    entry.schemaName,
    entry.version,
  ]);
}

export async function readLedger(client: pg.Client): Promise<readonly LedgerRow[]> {
  const result = await client.query<LedgerRow>(READ_SQL);
  return result.rows;
}

/**
 * §9: o executor não pergunta se o **nome** existe; pergunta o que existe com aquele nome.
 *
 * `to_regclass` foi recusado aqui, e o motivo é medido: ele casa com **view** tão bem quanto com
 * tabela, e um banco ajustado à mão faria o executor concluir que o ledger existe quando o que
 * existe é uma view sem nenhuma das restrições.
 */
const RELKIND_SQL = `
select c.relkind
  from pg_class c join pg_namespace n on n.oid = c.relnamespace
 where n.nspname = $1 and c.relname = $2
`;

export async function probeLedgerRelkind(client: pg.Client): Promise<string | undefined> {
  const result = await client.query<{ relkind: string }>(RELKIND_SQL, [
    LEDGER_SCHEMA,
    LEDGER_TABLE,
  ]);
  return result.rows[0]?.relkind;
}

/**
 * O retrato estrutural do ledger (§9): as sete colunas, com nome, tipo, nulidade e ordem, e as sete
 * restrições pelo nome.
 *
 * Ele **não** olha gatilho, de propósito: num banco novo a `0003` ainda não passou, então o ledger
 * legitimamente não tem gatilho nenhum, e exigi-lo faria o bootstrap reprovar exatamente o banco
 * vazio que ele existe para atender. A conferência completa do `platform` é do `verify` (§13.2).
 *
 * Sem este retrato, o caso medido é uma `platform.schema_migrations` pré-existente com as mesmas
 * sete colunas e nenhuma restrição: o `CREATE TABLE IF NOT EXISTS` pula em silêncio e a tabela
 * passa a aceitar checksum não hexadecimal e duas linhas para a mesma chave.
 */
const EXPECTED_COLUMNS: readonly (readonly [string, string, boolean])[] = [
  ['schema_name', 'text', true],
  ['version', 'text', true],
  ['checksum', 'text', true],
  ['module', 'text', false],
  ['started_at', 'timestamp with time zone', true],
  ['applied_at', 'timestamp with time zone', false],
  ['duration_ms', 'integer', false],
];

const EXPECTED_CONSTRAINTS: readonly string[] = [
  'schema_migrations_checksum_check',
  'schema_migrations_completion_check',
  'schema_migrations_duration_ms_check',
  'schema_migrations_module_check',
  'schema_migrations_pkey',
  'schema_migrations_schema_name_check',
  'schema_migrations_version_check',
];

const COLUMNS_SQL = `
select a.attname, format_type(a.atttypid, a.atttypmod) as tipo, a.attnotnull
  from pg_attribute a
  join pg_class c on c.oid = a.attrelid
  join pg_namespace n on n.oid = c.relnamespace
 where n.nspname = $1 and c.relname = $2 and a.attnum > 0 and not a.attisdropped
 order by a.attnum
`;

const CONSTRAINTS_SQL = `
select con.conname
  from pg_constraint con
  join pg_class c on c.oid = con.conrelid
  join pg_namespace n on n.oid = c.relnamespace
 where n.nspname = $1 and c.relname = $2
 order by con.conname collate "C"
`;

export async function assertLedgerStructure(client: pg.Client): Promise<void> {
  const columns = await client.query<{ attname: string; tipo: string; attnotnull: boolean }>(
    COLUMNS_SQL,
    [LEDGER_SCHEMA, LEDGER_TABLE],
  );
  const found = columns.rows.map((row) => `${row.attname} ${row.tipo} ${row.attnotnull}`);
  const expected = EXPECTED_COLUMNS.map(([name, type, notNull]) => `${name} ${type} ${notNull}`);
  if (found.length !== expected.length || found.some((line, index) => line !== expected[index])) {
    throw diverged(
      `platform.schema_migrations não tem a estrutura de CONTRATO.md §5.\n` +
        `  esperado: ${expected.join(' | ')}\n` +
        `  encontrado: ${found.join(' | ') || '(nenhuma coluna)'}`,
    );
  }

  const constraints = await client.query<{ conname: string }>(CONSTRAINTS_SQL, [
    LEDGER_SCHEMA,
    LEDGER_TABLE,
  ]);
  const names = constraints.rows.map((row) => row.conname);
  const missing = EXPECTED_CONSTRAINTS.filter((name) => !names.includes(name));
  const extra = names.filter((name) => !EXPECTED_CONSTRAINTS.includes(name));
  if (missing.length > 0 || extra.length > 0) {
    throw diverged(
      `platform.schema_migrations não tem as restrições de CONTRATO.md §5.\n` +
        `  faltando: ${missing.join(', ') || '(nenhuma)'}\n` +
        `  sobrando: ${extra.join(', ') || '(nenhuma)'}`,
    );
  }
}

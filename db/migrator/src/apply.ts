import type pg from 'pg';
import type { MigratorConfig } from './config.js';
import { applyFailed, describeCause, ExecutorError } from './errors.js';
import type { EventRecorder } from './events.js';
import {
  completeInFlightEntry,
  insertInFlightEntry,
  insertLedgerEntry,
  type LedgerRow,
} from './ledger.js';
import type { LoadedMigration } from './loader.js';
import {
  describeOutsideObjects,
  newObjectsOutsideTarget,
  takeSnapshot,
  type NamespaceSnapshot,
} from './namespace-snapshot.js';
import { openSession, renderCommandWithTwoIdentifiers } from './session.js';
import { assertTarget, setTargetLocal, setTargetSession } from './target.js';

/**
 * Aplicação: `APLICACAO-E-ALVO.md` §7 (transacional) e §8 (não-transacional).
 *
 * A diferença entre os dois não é de estilo. No transacional a linha do livro-razão e o efeito da
 * migration são o mesmo commit, e a verificação de namespace é **prevenção**, porque o `ROLLBACK`
 * desfaz. No não-transacional não há commit para pendurar nada: o alvo vive em escopo de sessão
 * numa conexão dedicada, a asserção corre antes de **cada** comando, e a verificação de namespace é
 * **detecção**, com o objeto continuando lá.
 */

export interface ApplyOptions {
  readonly schema: string;
  /**
   * Falso no `verify` (§13.2, passo 4): o schema descartável não escreve no livro-razão, porque
   * linha de lá nunca é apagada e registrá-lo produziria, para sempre, linhas nomeando um schema
   * que não existe.
   */
  readonly writeLedger: boolean;
  /** Só a `platform/0000`, que corre antes de existir ledger para consultar (§9). */
  readonly bootstrap?: boolean;
  /** Linha com `applied_at` nulo encontrada para esta versão neste schema (§8, retomada). */
  readonly inFlight?: LedgerRow | undefined;
}

const SCHEMA_EXISTS_SQL = 'select 1 from pg_namespace where nspname = $1';

export async function schemaExists(client: pg.Client, schema: string): Promise<boolean> {
  const result = await client.query(SCHEMA_EXISTS_SQL, [schema]);
  return result.rowCount === 1;
}

export async function applyMigration(
  config: MigratorConfig,
  control: pg.Client,
  migration: LoadedMigration,
  options: ApplyOptions,
  events: EventRecorder,
): Promise<void> {
  if (migration.header.transacional) {
    await applyTransactional(control, migration, options, events);
    return;
  }
  await applyNonTransactional(config, migration, options, events);
}

async function applyTransactional(
  client: pg.Client,
  migration: LoadedMigration,
  options: ApplyOptions,
  events: EventRecorder,
): Promise<void> {
  const startedAt = new Date();
  const startedTick = process.hrtime.bigint();

  await client.query('begin');
  try {
    /**
     * A asserção de alvo corre **antes** do corpo sempre que o schema já existe, que é o caso de
     * toda migration de cliente (`migrate` nunca cria schema, §10.1) e de toda migration de
     * `platform` depois da `0000`. Na `0000` de um banco vazio ela não pode correr antes: o schema
     * `platform` é criado pelo corpo dela, e `current_schema()` é nulo enquanto ele não existe.
     * Por isso ela corre **também** depois do corpo, em todos os casos — ali ela vale para os dois.
     */
    const existedBefore = await schemaExists(client, options.schema);
    await setTargetLocal(client, options.schema);
    if (existedBefore) await assertTarget(client, options.schema);

    const before = await takeSnapshot(client, options.schema);
    await client.query(migration.text);
    await assertTarget(client, options.schema);
    await assertNothingOutside(before, client, migration, options, events);

    if (options.writeLedger) {
      await insertLedgerEntry(
        client,
        {
          schemaName: options.schema,
          version: migration.version,
          checksum: migration.checksum,
          module: migration.header.modulo,
          startedAt,
          appliedAt: new Date(),
          durationMs: elapsedMs(startedTick),
        },
        { bootstrap: options.bootstrap === true },
      );
    }
    await client.query('commit');
  } catch (cause) {
    await rollbackQuietly(client);
    await recordFailure(events, migration, options, cause);
    throw asApplyFailure(migration, options, cause);
  }
}

/**
 * §8. Existe para um caso e só um: `CREATE INDEX CONCURRENTLY`, que não roda dentro de transação.
 *
 * A conexão é dedicada, aberta para esta migration e fechada ao fim, nunca devolvida a pool.
 * Fechar é o que apaga o estado de sessão: medido, conexão nova nasce com `current_schema()` em
 * `public`, sem herdar nada.
 */
async function applyNonTransactional(
  config: MigratorConfig,
  migration: LoadedMigration,
  options: ApplyOptions,
  events: EventRecorder,
): Promise<void> {
  const session = await openSession(config);
  const client = session.client;
  const startedAt = options.inFlight?.started_at ?? new Date();
  const startedTick = process.hrtime.bigint();

  try {
    await setTargetSession(client, options.schema);
    await assertTarget(client, options.schema);

    if (options.inFlight === undefined) {
      if (options.writeLedger) {
        await insertInFlightEntry(client, {
          schemaName: options.schema,
          version: migration.version,
          checksum: migration.checksum,
          module: migration.header.modulo,
          startedAt,
        });
      }
    } else {
      await cleanUpAfterInterruptedRun(client, migration, options, events);
    }

    const before = await takeSnapshot(client, options.schema);
    for (const command of migration.commands) {
      await assertTarget(client, options.schema);
      await client.query(command);
      await assertNothingOutside(before, client, migration, options, events);
    }

    if (options.writeLedger) {
      await completeInFlightEntry(client, {
        schemaName: options.schema,
        version: migration.version,
        appliedAt: new Date(),
        durationMs: elapsedMs(startedTick),
      });
    }
  } catch (cause) {
    await recordFailure(events, migration, options, cause);
    throw asApplyFailure(migration, options, cause);
  } finally {
    await session.end();
  }
}

const INDEX_IN_TARGET_SQL = `
select i.indisvalid
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  join pg_index i on i.indexrelid = c.oid
 where n.nspname = $1 and c.relname = $2 and c.relkind = 'i'
`;

/** A busca de **achado** da §8: pelo nome, em todos os namespaces, e não só no alvo. */
const INDEX_ANYWHERE_SQL = `
select n.nspname
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
 where c.relkind = 'i' and c.relname = $1
`;

/**
 * O que a retomada precisa limpar (§8). Linha com `applied_at` nulo significa que a rodada anterior
 * morreu no meio. Para cada nome declarado em `cria-indice`, procurado **dentro do namespace
 * alvo**, e nunca por nome solto:
 *
 * 1. não existe no namespace alvo: nada a limpar;
 * 2. existe e é válido: está completo, nada a limpar;
 * 3. existe e é inválido: é lixo da tentativa anterior, e sai com `DROP INDEX CONCURRENTLY`.
 *
 * Este é o **único** `DROP` que o executor emite dentro de schema de cliente. Índice válido nunca é
 * removido, e índice não declarado nunca é tocado.
 *
 * Índice declarado que aparece **fora** do alvo não é limpeza, é achado: a rodada para e a remoção
 * é decisão humana. A busca por nome solto era o que escondia isso — medido, com o `search_path`
 * restrito ao alvo, `to_regclass('ix_ghost')` devolve nulo enquanto o índice existe em `public`.
 */
async function cleanUpAfterInterruptedRun(
  client: pg.Client,
  migration: LoadedMigration,
  options: ApplyOptions,
  events: EventRecorder,
): Promise<void> {
  for (const indexName of migration.header.criaIndice) {
    const anywhere = await client.query<{ nspname: string }>(INDEX_ANYWHERE_SQL, [indexName]);
    const outside = anywhere.rows
      .map((row) => row.nspname)
      .filter((nspname) => nspname !== options.schema);
    if (outside.length > 0) {
      await events.record({
        kind: 'index_outside_target',
        schemaName: options.schema,
        version: migration.version,
        detail: `índice "${indexName}" declarado em cria-indice aparece em ${outside.join(', ')}`,
      });
      throw applyFailed(
        `o índice "${indexName}", declarado por ${migration.version}, existe fora do alvo ` +
          `"${options.schema}": ${outside.join(', ')}. O executor não remove objeto fora do schema ` +
          'em que estava trabalhando (§8): a remoção é decisão humana.',
        { recorded: true },
      );
    }

    const inTarget = await client.query<{ indisvalid: boolean }>(INDEX_IN_TARGET_SQL, [
      options.schema,
      indexName,
    ]);
    const state = inTarget.rows[0];
    if (state === undefined || state.indisvalid) continue;

    const dropCommand = await renderCommandWithTwoIdentifiers(
      client,
      'DROP INDEX CONCURRENTLY %I.%I',
      options.schema,
      indexName,
    );
    await client.query(dropCommand);
  }
}

/**
 * §10.4. No regime transacional isto roda antes do `COMMIT` e a divergência causa `ROLLBACK`: o
 * objeto nunca existiu. No não-transacional o objeto continua lá, porque não há transação para
 * desfazer, e a linha do livro-razão fica **em voo**.
 */
async function assertNothingOutside(
  before: NamespaceSnapshot,
  client: pg.Client,
  migration: LoadedMigration,
  options: ApplyOptions,
  events: EventRecorder,
): Promise<void> {
  const born = newObjectsOutsideTarget(before, await takeSnapshot(client, options.schema));
  if (born.length === 0) return;

  const described = describeOutsideObjects(born);
  await events.record({
    kind: 'object_outside_target',
    schemaName: options.schema,
    version: migration.version,
    detail: described,
  });
  throw applyFailed(
    `${migration.version} criou objeto fora do namespace alvo "${options.schema}": ${described} ` +
      '(APLICACAO-E-ALVO.md §10.4)',
    { recorded: true },
  );
}

/**
 * A tentativa que o `ROLLBACK` levou embora (§19.1). O evento mais específico já foi registrado por
 * quem detectou — objeto fora do alvo e índice fora do alvo têm tipo próprio —, então aqui só entra
 * o que falhou por outro motivo.
 */
async function recordFailure(
  events: EventRecorder,
  migration: LoadedMigration,
  options: ApplyOptions,
  cause: unknown,
): Promise<void> {
  if (cause instanceof ExecutorError && cause.recorded) return;
  await events.record({
    kind: 'migration_failed',
    schemaName: options.schema,
    version: migration.version,
    detail: describeCause(cause),
  });
}

function asApplyFailure(
  migration: LoadedMigration,
  options: ApplyOptions,
  cause: unknown,
): ExecutorError {
  if (cause instanceof ExecutorError) return cause;
  return applyFailed(
    `falhou ao aplicar ${migration.version} em "${options.schema}": ${describeCause(cause)}`,
    { cause },
  );
}

async function rollbackQuietly(client: pg.Client): Promise<void> {
  try {
    await client.query('rollback');
  } catch {
    // A conexão pode já ter morrido; o efeito é o mesmo e o erro original é o que importa.
  }
}

function elapsedMs(startedTick: bigint): number {
  return Number((process.hrtime.bigint() - startedTick) / 1_000_000n);
}

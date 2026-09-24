import type { MigratorConfig } from './config.js';
import { describeCause } from './errors.js';
import { openSession } from './session.js';

/**
 * `platform.executor_events`: `IMUTABILIDADE-E-FATOS.md` §19.
 *
 * O livro-razão responde "o que está aplicado"; esta tabela responde "o que deu errado", que era a
 * pergunta sem casa — checksum divergente e diferença do `verify` paravam a rodada e morriam na
 * saída do processo.
 *
 * Duas propriedades que são regra, não zelo:
 *
 * - **A escrita vai por uma segunda conexão**, aberta fora da transação que falhou. Escrever na
 *   mesma seria escrever para o `ROLLBACK` levar, que é exatamente por que a linha não existia.
 * - **Falhar ao escrever não muda o desfecho da rodada nem o código de saída** (invariante 10,
 *   terceira cláusula). A falha é reportada e o executor segue para o que já ia fazer.
 */

export const EVENT_KINDS = [
  'checksum_mismatch',
  'ledger_entry_without_file',
  'migration_behind_head',
  'ledger_structure_mismatch',
  'migration_failed',
  'object_outside_target',
  'index_outside_target',
  'structure_mismatch',
  'schema_without_registry',
  'registered_schema_missing',
  'load_refused',
  'privilege_unexpected',
  'tenant_role_missing',
  'tenant_role_divergent',
  'tenant_role_incomplete',
  'tenant_schema_foreign_grant',
  'tenant_role_default_acl_absent',
  'public_grant_present',
  'tenant_role_foreign_grantor',
  'schema_outside_universe',
  'public_object_present',
  'app_credential_plural',
  'app_role_declared',
  'tenant_schema_owner_unexpected',
  'role_declarations_missing',
  'executor_role_plural',
  'declared_role_member',
  'role_declaration_unattested',
  'role_declarations_empty',
  'role_declaration_adopted',
  'role_retractions_missing',
  'object_owner_delegation',
] as const;

export type EventKind = (typeof EVENT_KINDS)[number];

export interface ExecutorEvent {
  readonly kind: EventKind;
  readonly occurredAt?: Date;
  readonly schemaName?: string | undefined;
  readonly version?: string | undefined;
  readonly checksumExpected?: string | undefined;
  readonly checksumFound?: string | undefined;
  readonly detail?: string | undefined;
}

/** O teto de `executor_events_detail_check`. Texto maior é sinal de que o evento pedia colunas. */
const DETAIL_LIMIT_BYTES = 2000;

const INSERT_SQL = `
insert into platform.executor_events
    (event_id, kind_code, occurred_at, received_at, db_role,
     schema_name, version, checksum_expected, checksum_found, detail)
values ($1, $2, $3, greatest(now(), $3), $4, $5, $6, $7, $8, $9)
`;

export interface EventRecorder {
  record(event: ExecutorEvent): Promise<void>;
}

/**
 * `received_at` sai de `greatest(now(), occurred_at)` porque os dois instantes vêm de relógios
 * diferentes: o do processo, que observou, e o do servidor, que escreve. Uma diferença de
 * milissegundos entre eles violaria `executor_events_received_after_occurred_check` e perderia o
 * fato — e perder o fato é o defeito que esta tabela existe para não ter.
 */
export function createEventRecorder(
  config: MigratorConfig,
  uuid: () => string,
  report: (message: string) => void,
): EventRecorder {
  return {
    async record(event: ExecutorEvent): Promise<void> {
      const occurredAt = event.occurredAt ?? new Date();
      try {
        const session = await openSession(config);
        try {
          await session.client.query(INSERT_SQL, [
            uuid(),
            event.kind,
            occurredAt,
            session.dbRole,
            event.schemaName ?? null,
            event.version ?? null,
            event.checksumExpected ?? null,
            event.checksumFound ?? null,
            truncateDetail(event.detail),
          ]);
        } finally {
          await session.end();
        }
      } catch (cause) {
        report(
          `não consegui registrar o evento "${event.kind}" em platform.executor_events: ` +
            `${describeCause(cause)}. O desfecho da rodada não muda (§19.2).`,
        );
      }
    },
  };
}

function truncateDetail(detail: string | undefined): string | null {
  if (detail === undefined || detail === '') return null;
  const bytes = Buffer.from(detail, 'utf-8');
  if (bytes.length <= DETAIL_LIMIT_BYTES) return detail;
  return new TextDecoder('utf-8').decode(bytes.subarray(0, DETAIL_LIMIT_BYTES)).replace(/�$/, '');
}

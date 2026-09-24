import type pg from 'pg';

/**
 * Verificação de namespace: `APLICACAO-E-ALVO.md` §10.4.
 *
 * Um retrato de `oid` tirado antes e depois, restrito ao que está **fora** do alvo e fora dos
 * namespaces de sistema. Qualquer `oid` presente depois e ausente antes é divergência.
 *
 * O que ela **não** pega, e foi medido (`MIG-10`, prova `P7b`): alteração de objeto que já existe,
 * e leitura de outro schema depositada dentro do alvo. Quem cobre esses dois é a §11.3, pela recusa
 * da referência qualificada antes de abrir conexão. Esta é detecção de efeito; aquela é recusa de
 * forma, e o mecanismo é em camadas de propósito.
 */

const SNAPSHOT_SQL = `
SELECT 'relacao'   AS catalogo, c.oid::bigint AS oid, n.nspname AS namespace, c.relname AS objeto
  FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
 WHERE n.nspname <> $1 AND n.nspname NOT IN ('pg_catalog', 'information_schema')
   AND n.nspname NOT LIKE 'pg\\_toast%' AND n.nspname NOT LIKE 'pg\\_temp%'
UNION ALL
SELECT 'tipo', t.oid::bigint, n.nspname, t.typname
  FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace
 WHERE n.nspname <> $1 AND n.nspname NOT IN ('pg_catalog', 'information_schema')
   AND n.nspname NOT LIKE 'pg\\_toast%' AND n.nspname NOT LIKE 'pg\\_temp%'
UNION ALL
SELECT 'rotina', p.oid::bigint, n.nspname, p.proname
  FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
 WHERE n.nspname <> $1 AND n.nspname NOT IN ('pg_catalog', 'information_schema')
   AND n.nspname NOT LIKE 'pg\\_toast%' AND n.nspname NOT LIKE 'pg\\_temp%'
UNION ALL
SELECT 'namespace', n.oid::bigint, n.nspname, n.nspname
  FROM pg_namespace n
 WHERE n.nspname <> $1 AND n.nspname NOT IN ('pg_catalog', 'information_schema')
   AND n.nspname NOT LIKE 'pg\\_toast%' AND n.nspname NOT LIKE 'pg\\_temp%'
`;

interface SnapshotRow {
  readonly catalogo: string;
  readonly oid: string;
  readonly namespace: string;
  readonly objeto: string;
}

export interface OutsideObject {
  readonly catalogo: string;
  readonly namespace: string;
  readonly objeto: string;
}

export type NamespaceSnapshot = ReadonlyMap<string, OutsideObject>;

export async function takeSnapshot(
  client: pg.Client,
  targetSchema: string,
): Promise<NamespaceSnapshot> {
  const result = await client.query<SnapshotRow>(SNAPSHOT_SQL, [targetSchema]);
  const snapshot = new Map<string, OutsideObject>();
  for (const row of result.rows) {
    snapshot.set(`${row.catalogo}:${row.oid}`, {
      catalogo: row.catalogo,
      namespace: row.namespace,
      objeto: row.objeto,
    });
  }
  return snapshot;
}

export function newObjectsOutsideTarget(
  before: NamespaceSnapshot,
  after: NamespaceSnapshot,
): readonly OutsideObject[] {
  const born: OutsideObject[] = [];
  for (const [key, object] of after) {
    if (!before.has(key)) born.push(object);
  }
  return born;
}

export function describeOutsideObjects(objects: readonly OutsideObject[]): string {
  return objects
    .map((object) => `${object.catalogo} ${object.namespace}.${object.objeto}`)
    .join(', ');
}

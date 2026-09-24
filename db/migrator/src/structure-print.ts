import { readFileSync } from 'node:fs';
import type pg from 'pg';
import { unverifiable } from './errors.js';

/**
 * A impressão de estrutura: `PROVISION-E-VERIFY.md` §13.3, transcrita verbatim.
 *
 * Uma consulta só, parametrizada pelo nome do schema, usada nos dois lugares: o `platform` contra o
 * arquivo declarado, e cada cliente contra o schema descartável. O nome entra como **valor**, em
 * `WHERE`, então aqui não há identificador a citar.
 *
 * O `replace(…, $1 || '.', '')` de cada definição é o que torna a impressão **neutra ao nome do
 * schema**: sem ele, `indexdef`, `triggerdef`, `functiondef` e a definição de chave estrangeira
 * carregam o schema de origem, e a impressão de `t_acme` nunca casaria com a do descartável.
 *
 * **Um `replace` por definição, e não dois**, mesmo tendo o catálogo uma forma citada que ele não
 * alcança. A neutralidade que esta consulta declara não é comprável por cobertura de gramática:
 * `pg_get_functiondef` devolve o nome em posição **não qualificada** (`SET search_path TO 't_acme'`),
 * que `replace` nenhum daqui tocaria. Ela se compra por construção, do outro lado — nome de schema
 * minúsculo puro, garantido pela borda da §10.2 para cliente e pelo carimbo do descartável na §13.2.
 * Cada `replace` é apagamento cego dentro da única consulta cujo trabalho é **enxergar** diferença,
 * então o que se acrescenta aqui falha baixo, e em silêncio. O resíduo está fechado por outra porta:
 * `RECUSAS.md` §11.5 recusa `SET search_path` em qualquer posição e a aspa dupla inteira.
 *
 * A linha `visao` carrega o corpo da view por `md5`, e isso entrou no `EXE-04`: ela levava nome e
 * `reloptions`, nunca a definição, e uma view recriada na mão apontando para a `orders` de **outro**
 * cliente saía da impressão idêntica linha a linha. View com `security_invoker` é forma permitida
 * (`RECUSAS.md` §11.2) e é o objeto mais barato que existe para atravessar schema: o único controle
 * automatizado contra drift aprovava exatamente a diferença que mais importa. O corpo entra por
 * `md5` pela mesma razão da função, e com o mesmo par de preços declarados.
 *
 * As linhas `materializada` e `regra` entraram no `SUB-09`, e pela mesma razão da `visao`: as duas são
 * objetos que rodam com o privilégio do dono, e medido em 2026-09-23 uma regra `DO ALSO INSERT INTO`
 * o `orders` de outro cliente e uma view materializada sobre ele deixavam a impressão **idêntica**
 * à base. A regra `_RETURN` fica de fora porque ela **é** a view (a `visao` e a `materializada` já
 * carregam o corpo dela), e a regra leva `ev_enabled` cru pela mesma razão do gatilho. Nenhuma
 * forma permitida do crivo cria uma ou outra (`RECUSAS.md` §11.2), então no banco íntegro as duas
 * linhas não existem, e a referência do `platform` não muda.
 *
 * As linhas `dominio` e o `replace` no tipo da coluna entraram em 2026-09-23 (T-0022), com os
 * domínios de valor da primeira migration de cliente. Os dois defeitos eram do mesmo tamanho e de
 * direções opostas. `format_type` qualifica o tipo que não está no `search_path` de quem pergunta
 * (medido: `t_probe.money_amount`), então a primeira coluna de domínio faria **todo** cliente
 * divergir do descartável, que é o `verify` reprovando banco íntegro. E a restrição de domínio tem
 * `conrelid = 0`, então ela ficava fora da linha `restricao`: um envelope afrouxado à mão
 * (`ALTER DOMAIN … DROP CONSTRAINT`) saía idêntico à referência. O `platform` não tem domínio e usa só
 * tipo do sistema, então a referência dele não muda.
 *
 * A linha `gatilho` carrega `pg_trigger.tgenabled` **cru**, e isso entrou no `SEC-02`:
 * `pg_get_triggerdef` não diz se o gatilho está habilitado, então `DISABLE TRIGGER` — o primeiro dos
 * três atos que a §18.2 declara — saía da impressão idêntico à referência, e o `verify` aprovava um
 * banco em que a trava do registro de clientes estava desligada. A letra não é traduzida: um valor
 * que o Postgres venha a acrescentar aparece como letra desconhecida em vez de virar texto vazio.
 */
const STRUCTURE_PRINT_SQL = `
SELECT linha FROM (
    SELECT format('tabela      %s', c.relname) AS linha
      FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
     WHERE n.nspname = $1 AND c.relkind IN ('r','p')
    UNION ALL
    SELECT format('coluna      %s.%s %s %s %s', c.relname, a.attname,
                  replace(format_type(a.atttypid, a.atttypmod), $1 || '.', ''),
                  CASE WHEN a.attnotnull THEN 'NOT NULL' ELSE 'NULL' END,
                  coalesce(replace(pg_get_expr(d.adbin, d.adrelid), $1 || '.', ''), '-'))
      FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
      JOIN pg_attribute a ON a.attrelid = c.oid
      LEFT JOIN pg_attrdef d ON d.adrelid = c.oid AND d.adnum = a.attnum
     WHERE n.nspname = $1 AND c.relkind IN ('r','p','v') AND a.attnum > 0 AND NOT a.attisdropped
    UNION ALL
    SELECT format('restricao   %s.%s %s', c.relname, con.conname,
                  replace(pg_get_constraintdef(con.oid), $1 || '.', ''))
      FROM pg_constraint con JOIN pg_class c ON c.oid = con.conrelid
      JOIN pg_namespace n ON n.oid = c.relnamespace
     WHERE n.nspname = $1
    UNION ALL
    SELECT format('indice      %s', replace(i.indexdef, $1 || '.', ''))
      FROM pg_indexes i WHERE i.schemaname = $1
    UNION ALL
    SELECT format('sequencia   %s', c.relname)
      FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
     WHERE n.nspname = $1 AND c.relkind = 'S'
    UNION ALL
    SELECT format('visao       %s %s md5:%s', c.relname,
                  coalesce(array_to_string(c.reloptions, ','), '-'),
                  md5(replace(pg_get_viewdef(c.oid), $1 || '.', '')))
      FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
     WHERE n.nspname = $1 AND c.relkind = 'v'
    UNION ALL
    SELECT format('materializada %s %s md5:%s', c.relname,
                  coalesce(array_to_string(c.reloptions, ','), '-'),
                  md5(replace(pg_get_viewdef(c.oid), $1 || '.', '')))
      FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
     WHERE n.nspname = $1 AND c.relkind = 'm'
    UNION ALL
    SELECT format('regra       %s.%s habilitacao:%s md5:%s', c.relname, r.rulename, r.ev_enabled,
                  md5(replace(pg_get_ruledef(r.oid), $1 || '.', '')))
      FROM pg_rewrite r JOIN pg_class c ON c.oid = r.ev_class
      JOIN pg_namespace n ON n.oid = c.relnamespace
     WHERE n.nspname = $1 AND r.rulename <> '_RETURN'
    UNION ALL
    SELECT format('gatilho     %s habilitacao:%s',
                  replace(pg_get_triggerdef(t.oid), $1 || '.', ''), t.tgenabled)
      FROM pg_trigger t JOIN pg_class c ON c.oid = t.tgrelid
      JOIN pg_namespace n ON n.oid = c.relnamespace
     WHERE n.nspname = $1 AND NOT t.tgisinternal
    UNION ALL
    SELECT format('funcao      %s(%s) md5:%s', p.proname,
                  pg_get_function_identity_arguments(p.oid),
                  md5(replace(pg_get_functiondef(p.oid), $1 || '.', '')))
      FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
     WHERE n.nspname = $1
    UNION ALL
    SELECT format('dominio     %s %s %s %s', t.typname,
                  replace(format_type(t.typbasetype, t.typtypmod), $1 || '.', ''),
                  CASE WHEN t.typnotnull THEN 'NOT NULL' ELSE 'NULL' END,
                  coalesce(replace(t.typdefault, $1 || '.', ''), '-'))
      FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace
     WHERE n.nspname = $1 AND t.typtype = 'd'
    UNION ALL
    SELECT format('dominio     %s.%s %s', t.typname, con.conname,
                  replace(pg_get_constraintdef(con.oid), $1 || '.', ''))
      FROM pg_constraint con JOIN pg_type t ON t.oid = con.contypid
      JOIN pg_namespace n ON n.oid = t.typnamespace
     WHERE n.nspname = $1
) AS impressao ORDER BY linha COLLATE "C";
`;

export async function structurePrint(
  client: pg.Client,
  schema: string,
): Promise<readonly string[]> {
  const result = await client.query<{ linha: string }>(STRUCTURE_PRINT_SQL, [schema]);
  return result.rows.map((row) => row.linha);
}

/**
 * A referência declarada do `platform` (§13.2). Ela existe porque o schema de controle tem nome
 * constante e migrations que o qualificam literalmente, então não pode ser reproduzido num schema
 * descartável ao lado — e porque a alternativa, um banco de referência, exige `CREATEDB`, que o
 * humano decidiu não dar ao executor.
 *
 * Não conseguir ler o arquivo é saída `4`: não é aprovação nem reprovação.
 */
export function readDeclaredReference(path: string): readonly string[] {
  let text: string;
  try {
    text = readFileSync(path, 'utf-8');
  } catch (cause) {
    throw unverifiable(`não consegui ler a referência estrutural do platform em "${path}"`, {
      cause,
    });
  }
  return text
    .split('\n')
    .filter((line) => !line.startsWith('#'))
    .filter((line) => line.trim() !== '');
}

export interface StructureDifference {
  readonly sobrando: readonly string[];
  readonly faltando: readonly string[];
}

export function compareStructure(
  reference: readonly string[],
  found: readonly string[],
): StructureDifference {
  const faltando = difference(reference, found);
  const sobrando = difference(found, reference);
  return { faltando, sobrando };
}

export function hasDifference(difference: StructureDifference): boolean {
  return difference.faltando.length > 0 || difference.sobrando.length > 0;
}

export function describeDifference(difference: StructureDifference): string {
  const parts: string[] = [];
  for (const line of difference.faltando) parts.push(`  falta:  ${line}`);
  for (const line of difference.sobrando) parts.push(`  sobra:  ${line}`);
  return parts.join('\n');
}

/** Multiconjunto: linha repetida em um lado e única no outro é diferença, e precisa aparecer. */
function difference(left: readonly string[], right: readonly string[]): readonly string[] {
  const counts = new Map<string, number>();
  for (const line of right) counts.set(line, (counts.get(line) ?? 0) + 1);
  const missing: string[] = [];
  for (const line of left) {
    const remaining = counts.get(line) ?? 0;
    if (remaining > 0) counts.set(line, remaining - 1);
    else missing.push(line);
  }
  return missing;
}

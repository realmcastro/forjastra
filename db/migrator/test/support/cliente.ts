import { randomUUID } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type pg from 'pg';
import { REAL_PLATFORM_DIR, type FixtureFile } from './tree.js';

/**
 * Apoio dos testes do modelo de cliente (T-0022, `F-021`).
 *
 * A stream `tenant` é lida do repositório, byte a byte, pelo mesmo motivo da `platform` em `tree.ts`:
 * o que está sendo testado é o arquivo que vai rodar em N schemas, e recriar o conteúdo aqui daria um
 * teste que passa contra um arquivo que não existe.
 *
 * Os gravadores abaixo escrevem com o superusuário do servidor de teste. Superusuário passa por cima de
 * privilégio e não passa por cima de `CHECK`, chave, unicidade nem gatilho, que é o que estes testes
 * medem. O que depende de privilégio é medido com a credencial assumindo o papel do cliente.
 */

export const REAL_TENANT_DIR = join(dirname(REAL_PLATFORM_DIR), 'tenant');

export function realTenantFiles(ate?: string): readonly FixtureFile[] {
  const nomes = readdirSync(REAL_TENANT_DIR)
    .filter((nome) => nome.endsWith('.sql'))
    .sort();
  if (nomes.length === 0) throw new Error(`nenhuma migration em ${REAL_TENANT_DIR}`);
  const escolhidos = ate === undefined ? nomes : nomes.filter((nome) => nome.slice(0, 4) <= ate);
  return escolhidos.map((name) => ({ name, text: readFileSync(join(REAL_TENANT_DIR, name), 'utf-8') }));
}

/** Autor por atribuição, a única fonte que os atos de `F-021` usam (matriz, linhas 23, 30, 34, 38, 40, 41). */
export interface Autor {
  readonly operador: string;
  readonly papel: string;
  readonly atribuicao: string;
}

export function autor(papel = 'owner'): Autor {
  return { operador: randomUUID(), papel, atribuicao: randomUUID() };
}

export interface Unidade {
  readonly id: string;
  readonly criadaEm: string;
}

export async function criarUnidade(
  c: pg.Client,
  schema: string,
  nome: string,
  instante: string,
): Promise<Unidade> {
  const id = randomUUID();
  const a = autor('owner');
  await c.query(
    `insert into ${schema}.establishments
       (establishment_id, name, occurred_at, received_at,
        author_operator_id, author_role_code, support_source_code, support_assignment_id)
     values ($1, $2, $3, $3, $4, $5, 'assignment', $6)`,
    [id, nome, instante, a.operador, a.papel, a.atribuicao],
  );
  return { id, criadaEm: instante };
}

export async function renomear(
  c: pg.Client,
  schema: string,
  unidade: Unidade,
  nome: string,
  instante: string,
): Promise<void> {
  const a = autor('owner');
  await c.query(
    `insert into ${schema}.establishment_name_changes
       (name_change_id, establishment_id, establishment_created_at, name, occurred_at, received_at,
        author_operator_id, author_role_code, support_source_code, support_assignment_id)
     values ($1, $2, $3, $4, $5, $5, $6, $7, 'assignment', $8)`,
    [randomUUID(), unidade.id, unidade.criadaEm, nome, instante, a.operador, a.papel, a.atribuicao],
  );
}

export interface Mudanca {
  readonly id: string;
  readonly seq: number;
  readonly kind: 'closure' | 'reopening';
  readonly at: string;
}

export async function mudarOperacao(
  c: pg.Client,
  schema: string,
  unidade: Unidade,
  seq: number,
  kind: 'closure' | 'reopening',
  instante: string,
  anterior?: Mudanca,
): Promise<Mudanca> {
  const id = randomUUID();
  const a = autor('owner');
  await c.query(
    `insert into ${schema}.establishment_operation_changes
       (change_id, establishment_id, establishment_created_at, change_sequence, change_kind,
        preceding_sequence, preceding_occurred_at, occurred_at, received_at,
        author_operator_id, author_role_code, support_source_code, support_assignment_id)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $8, $9, $10, 'assignment', $11)`,
    [
      id, unidade.id, unidade.criadaEm, seq, kind,
      anterior?.seq ?? null, anterior?.at ?? null, instante,
      a.operador, a.papel, a.atribuicao,
    ],
  );
  return { id, seq, kind, at: instante };
}

export async function publicarConfiguracao(
  c: pg.Client,
  schema: string,
  unidade: Unidade,
  versao: number,
  fuso: string,
  moeda: string,
  publicadaEm: string,
  vigenteDesde: string = publicadaEm,
): Promise<string> {
  const id = randomUUID();
  const a = autor('owner');
  await c.query(
    `insert into ${schema}.establishment_configurations
       (configuration_id, establishment_id, establishment_created_at, configuration_version,
        effective_from, establishment_time_zone, establishment_currency, occurred_at, received_at,
        author_operator_id, author_role_code, support_source_code, support_assignment_id)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $8, $9, $10, 'assignment', $11)`,
    [id, unidade.id, unidade.criadaEm, versao, vigenteDesde, fuso, moeda, publicadaEm,
      a.operador, a.papel, a.atribuicao],
  );
  return id;
}

export type Especie = 'enablement' | 'renewal' | 'decommission' | 'closure_revocation' | 'compromise';

/** O que uma linha de `sales_enabled_terminal_facts` precisa que o fato seguinte copie. */
export interface Fato {
  readonly id: string;
  readonly terminal: string;
  readonly seq: number;
  readonly kind: Especie;
  readonly at: string;
  readonly enablement: string | null;
  readonly unidade: string | null;
}

export interface NovoFato {
  readonly kind: Especie;
  readonly at: string;
  /** Obrigatório a partir do segundo fato. */
  readonly anterior?: Fato;
  /** Só para habilitação; renovação e fim herdam do anterior, salvo sobrescrita de teste. */
  readonly unidade?: string | null;
  readonly enablement?: string | null;
  readonly encerramento?: Mudanca;
  readonly pedidoDe?: string;
  /** Sobrescritas para provar recusa. */
  readonly seq?: number;
  readonly semAutor?: boolean;
  readonly comAutor?: boolean;
  readonly validade?: number | null;
  readonly especieDoEncerramento?: string;
}

const COM_AUTOR: readonly Especie[] = ['enablement', 'decommission', 'compromise'];
const COM_VALIDADE: readonly Especie[] = ['enablement', 'renewal'];

export async function gravarFato(
  c: pg.Client,
  schema: string,
  terminal: string,
  novo: NovoFato,
): Promise<Fato> {
  const id = randomUUID();
  const ant = novo.anterior;
  const seq = novo.seq ?? (ant === undefined ? 1 : ant.seq + 1);
  const periodo =
    novo.kind === 'compromise' ? null : novo.kind === 'enablement' ? id : (ant?.enablement ?? null);
  const enablement = novo.enablement === undefined ? periodo : novo.enablement;
  const unidadeHerdada = novo.kind === 'compromise' ? null : (ant?.unidade ?? null);
  const unidade = novo.unidade === undefined ? unidadeHerdada : novo.unidade;
  const temAutor = novo.comAutor ?? (novo.semAutor === true ? false : COM_AUTOR.includes(novo.kind));
  const a = autor('manager');
  const validade =
    novo.validade === undefined ? (COM_VALIDADE.includes(novo.kind) ? 28_800 : null) : novo.validade;

  await c.query(
    `insert into ${schema}.sales_enabled_terminal_facts
       (fact_id, terminal_id, terminal_sequence, fact_kind,
        preceding_sequence, preceding_kind, preceding_occurred_at, preceding_enablement_fact_id,
        enablement_fact_id, establishment_id, offline_validity_seconds, requested_from_terminal_id,
        closure_change_id, closure_change_kind, occurred_at, received_at,
        author_operator_id, author_role_code, support_source_code, support_assignment_id)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $15,
             $16, $17, $18, $19)`,
    [
      id, terminal, seq, novo.kind,
      ant?.seq ?? null, ant?.kind ?? null, ant?.at ?? null, ant?.enablement ?? null,
      enablement, unidade, validade, novo.pedidoDe ?? null,
      novo.encerramento?.id ?? null,
      novo.encerramento === undefined ? null : (novo.especieDoEncerramento ?? 'closure'),
      novo.at,
      temAutor ? a.operador : null, temAutor ? a.papel : null,
      temAutor ? 'assignment' : null, temAutor ? a.atribuicao : null,
    ],
  );
  return { id, terminal, seq, kind: novo.kind, at: novo.at, enablement, unidade };
}

/** Terminal novo e a primeira habilitação, na mesma transação: é assim que ele nasce (tenant/0006). */
export async function novoTerminal(
  c: pg.Client,
  schema: string,
  unidade: Unidade,
  instante: string,
): Promise<Fato> {
  const terminal = randomUUID();
  await c.query('begin');
  try {
    await c.query(`insert into ${schema}.terminals (terminal_id) values ($1)`, [terminal]);
    const fato = await gravarFato(c, schema, terminal, { kind: 'enablement', at: instante, unidade: unidade.id });
    await c.query('commit');
    return fato;
  } catch (causa) {
    await c.query('rollback');
    throw causa;
  }
}

/** Código do erro do Postgres, para comparar com 23505, 23503, 23514, 42501 e P0001. */
export function sqlstate(erro: unknown): string | undefined {
  if (typeof erro !== 'object' || erro === null || !('code' in erro)) return undefined;
  const code = (erro as { code?: unknown }).code;
  return typeof code === 'string' ? code : undefined;
}

export async function falha(promessa: Promise<unknown>): Promise<{ code: string | undefined; message: string }> {
  try {
    await promessa;
  } catch (erro) {
    return { code: sqlstate(erro), message: erro instanceof Error ? erro.message : String(erro) };
  }
  throw new Error('o comando passou, e devia ter sido recusado');
}

import { randomBytes } from 'node:crypto';
import type pg from 'pg';
import { applyMigration, schemaExists } from '../apply.js';
import { diverged, describeCause, unverifiable } from '../errors.js';
import { listTenantSchemasInCatalog, readTenants, tenantRegistryExists } from '../registry.js';
import { renderCommand } from '../session.js';
import {
  compareStructure,
  describeDifference,
  hasDifference,
  readDeclaredReference,
  structurePrint,
} from '../structure-print.js';
import { PLATFORM_SCHEMA } from '../target.js';
import type { RunContext } from '../run.js';
import {
  checkDeclarationsAttested,
  checkDeclaredRoleMembers,
  checkRoleDeclarationsPresent,
} from './verify-declarations.js';
import {
  checkDefaultAcl,
  checkExecutorPrivilege,
  checkOwnerDelegation,
  checkPublicGrants,
  checkSchemaOwners,
  checkSchemaUniverse,
  checkTenantReach,
  checkTenantRoles,
  confrontRegistry,
  nameExtraDeclarations,
  readRoleRows,
  type Achado,
} from './verify-questions.js';

/**
 * `verify`: `PROVISION-E-VERIFY.md` §13.2 e §13.6.
 *
 * `provision` roda todas as migrations do núcleo, na ordem, do zero. Se o conjunto não reproduz um
 * banco correto a partir do vazio, o conjunto está quebrado (`migrations.md` §8). Este comando é o
 * que transforma isso em verificação e não em esperança.
 *
 * Ele **não** toca em schema de cliente, **não** escreve no livro-razão, **não** altera
 * `platform.tenants` e **não** declara papel (§7.5.4). O que ele escreve é `platform.executor_events`,
 * por decisão: achado que só existe no terminal some com o terminal.
 */

const DISPOSABLE_PATTERN = /^t_verify_\d{8}t\d{6}z_[0-9a-f]{16}$/;
const RESIDUE_PREFIX = 't_verify_';

/**
 * **§13.6: a política de veto mora aqui, e em nenhum outro lugar.**
 *
 * Até o sétimo gate ela morava no ponto de chamada — `differenceFound = (await x()) || differenceFound`
 * vetava, `await x()` não —, espalhada por oito chamadas e escrita em lugar nenhum. Nas quatro sondas
 * em que a reauditoria mediu vazamento, o comando **imprimiu as linhas e saiu `0`**: um comando que
 * produz a evidência e a contradiz na mesma execução é pior que um comando que não pergunta.
 *
 * Três propriedades, e as três são o contrato desta tabela:
 *
 * 1. **O default de pergunta nova é vetar.** O tipo obriga: `veta: false` sem `motivo` não compila, e
 *    pergunta que não está nesta tabela não tem como ser chamada, porque o nome dela é o tipo do
 *    parâmetro.
 * 2. **"Nomear sem veto" é exceção, e carrega o motivo escrito ao lado.** Todo motivo aqui é a mesma
 *    classe: o que a pergunta pede não é aplicado por nada versionado, então ela reprovaria em toda
 *    rodada de toda máquina, e controle que reprova sempre é controle que se aprende a ignorar.
 * 3. **A exceção é contada.** `PERGUNTAS_SEM_VETO` é derivada desta tabela e o caso 49 a compara com
 *    a lista esperada: a lista crescer é uma mudança de teste, que alguém lê.
 *
 * E a saída passou a dizer de que lado cada linha está: linha de pergunta sem veto sai prefixada por
 * `registra e não reprova:`, para que quem lê não precise abrir o código para saber o que aquilo
 * muda.
 */
type Politica = { readonly veta: true } | { readonly veta: false; readonly motivo: string };

export const POLITICA_DE_VETO = {
  'estrutura de platform': { veta: true },
  'privilégio do executor sobre platform.tenants': {
    veta: false,
    motivo:
      'o REVOKE de db/papeis-e-credencial.md §5 não é aplicado por nada versionado, então em banco ' +
      'recém-criado e em máquina de quem desenvolve com superusuário isso reprovaria sempre (§13.4)',
  },
  'universo de schemas e objetos em public': { veta: true },
  'delegação por dono de objeto': { veta: true },
  'registro de papéis declarados': { veta: true },
  'declaração escrita fora do ato': { veta: true },
  'membro de papel declarado': { veta: true },
  'dono de platform e de cada cliente': { veta: true },
  'declarações além do arranjo desta rodada': {
    veta: false,
    motivo:
      'a janela de rotação da §7.7 produz este estado de propósito, e reprovar aqui travaria migrate ' +
      'na hora em que travar custa mais caro. A linha existe para que a exclusão seja enumerada',
  },
  'catálogo contra platform.tenants': { veta: true },
  'papel de banco de cada cliente': { veta: true },
  'privilégio padrão do papel que pergunta': {
    veta: false,
    motivo:
      'a coluna responde sobre current_user, não sobre o banco: o verify de um operador acusaria a ' +
      'frota inteira de adulteração (§7.5). Quem reprova o sintoma é tabelas_sem_select',
  },
  'quem alcança o schema de cada cliente': { veta: true },
  'ato do operador no public e no banco': {
    veta: false,
    motivo:
      'os dois REVOKE da §7.2 são ato do operador e nada versionado os aplica, então isso reprovaria ' +
      'em toda máquina (§7.5.2)',
  },
  'estrutura de cada cliente': { veta: true },
} as const satisfies Record<string, Politica>;

export type Pergunta = keyof typeof POLITICA_DE_VETO;

/** As exceções, derivadas da tabela — é esta lista que o caso 49 cobra. */
export const PERGUNTAS_SEM_VETO: readonly Pergunta[] = (
  Object.keys(POLITICA_DE_VETO) as Pergunta[]
).filter((nome) => !POLITICA_DE_VETO[nome].veta);

export async function verify(ctx: RunContext): Promise<void> {
  const client = ctx.session.client;
  const reference = readDeclaredReference(ctx.config.platformReferenceFile);

  let differenceFound = false;

  /**
   * O único lugar em que uma pergunta vira código de saída. A marca na saída e o veto saem da mesma
   * entrada da tabela, então não há como uma linha dizer uma coisa e o desfecho dizer outra.
   */
  const perguntar = async (
    nome: Pergunta,
    fazer: (ctx: RunContext) => Promise<Achado>,
  ): Promise<Achado> => {
    const politica: Politica = POLITICA_DE_VETO[nome];
    const marcado: RunContext = politica.veta
      ? ctx
      : { ...ctx, report: (mensagem) => ctx.report(`registra e não reprova: ${mensagem}`) };
    const achou = await fazer(marcado);
    if (achou && politica.veta) differenceFound = true;
    return achou;
  };

  await perguntar('estrutura de platform', (c) => comparePlatform(c, client, reference));
  await perguntar('privilégio do executor sobre platform.tenants', (c) =>
    checkExecutorPrivilege(c, client),
  );
  await perguntar('universo de schemas e objetos em public', (c) => checkSchemaUniverse(c, client));
  await perguntar('delegação por dono de objeto', (c) => checkOwnerDelegation(c, client));

  /**
   * As seis perguntas seguintes leem `platform.role_declarations`. Sem ela — e, desde o gate da
   * declaração, com ela **vazia** (`PAP-27`) — não há o que responder, e a resposta honesta é
   * reprovar dizendo isso. Não perguntar em silêncio é como o `PAP-23` nasceu, uma camada acima.
   */
  const semDeclaracoes = await perguntar('registro de papéis declarados', (c) =>
    checkRoleDeclarationsPresent(c, client),
  );

  const catalogSchemas = await listTenantSchemasInCatalog(client);
  const residues = catalogSchemas.filter((schema) => schema.startsWith(RESIDUE_PREFIX));
  const clientSchemas = catalogSchemas.filter((schema) => !schema.startsWith(RESIDUE_PREFIX));

  if (!semDeclaracoes) {
    /**
     * As duas perguntas do gate da declaração, e elas correm **antes** das que usam a tabela para
     * excluir: uma declaração plantada fora do ato e um membro de papel declarado mudam o que todas
     * as seguintes desculpam, então nomeá-los primeiro é o que faz a saída se ler de cima para baixo.
     */
    await perguntar('declaração escrita fora do ato', (c) => checkDeclarationsAttested(c, client));
    await perguntar('membro de papel declarado', (c) => checkDeclaredRoleMembers(c, client));
    await perguntar('dono de platform e de cada cliente', (c) => checkSchemaOwners(c, client));
    await perguntar('declarações além do arranjo desta rodada', (c) =>
      nameExtraDeclarations(c, client),
    );
    const roleRows = await readRoleRows(ctx, client, clientSchemas);
    await perguntar('papel de banco de cada cliente', (c) => checkTenantRoles(c, roleRows));
    await perguntar('privilégio padrão do papel que pergunta', (c) => checkDefaultAcl(c, roleRows));
    await perguntar('quem alcança o schema de cada cliente', (c) =>
      checkTenantReach(c, client, clientSchemas),
    );
  }

  await perguntar('catálogo contra platform.tenants', (c) =>
    confrontRegistry(c, client, clientSchemas),
  );
  await perguntar('ato do operador no public e no banco', (c) => checkPublicGrants(c, client));

  const disposable = await createDisposable(client);
  let residueLeftBehind: string | undefined;
  try {
    await applyTenantStream(ctx, disposable.schema);
    const referencePrint = await structurePrint(client, disposable.schema);
    for (const schema of clientSchemas) {
      await perguntar('estrutura de cada cliente', (c) =>
        compareClient(c, client, schema, referencePrint),
      );
    }
  } finally {
    // O descartável sai mesmo quando a comparação falhou; o que ele nunca faz é sair sem as três
    // condições do passo 7 conferidas no ato.
    residueLeftBehind = await dropDisposable(ctx, client, disposable);
  }

  for (const residue of residues) {
    ctx.report(
      `resíduo: o schema "${residue}" é descartável de uma execução anterior que não conseguiu ` +
        'derrubá-lo. Execução nenhuma consegue removê-lo, porque a condição de `oid` é a da ' +
        'execução que o criou: a remoção é mão humana.',
    );
  }

  /**
   * A diferença vence o descartável não derrubado quando os dois acontecem: `3` diz "está errado" e
   * `4` diz "ninguém sabe se está certo". Sabendo, a resposta é `3`, e o resíduo continua nomeado na
   * saída — e será nomeado de novo a cada rodada, até uma mão humana derrubá-lo.
   */
  if (differenceFound) {
    throw diverged('verify encontrou diferença. Nada foi aplicado e nada foi corrigido.');
  }
  if (residueLeftBehind !== undefined) {
    throw unverifiable(residueLeftBehind);
  }
  ctx.report('verify: nenhuma diferença.');
}

/**
 * A referência do `platform` é **declarada** (`db/referencia-estrutural-platform.txt`), e não um
 * banco descartável ao lado: o schema de controle tem nome constante e migrations que o qualificam
 * literalmente, e a alternativa exigia `CREATEDB`, que o humano decidiu não dar ao executor —
 * o que fazia toda execução real terminar em `4` sem comparar nada.
 */
async function comparePlatform(
  ctx: RunContext,
  client: pg.Client,
  reference: readonly string[],
): Promise<boolean> {
  const found = await structurePrint(client, PLATFORM_SCHEMA);
  const difference = compareStructure(reference, found);
  if (!hasDifference(difference)) return false;

  ctx.report(`platform difere da referência declarada:\n${describeDifference(difference)}`);
  await ctx.events.record({
    kind: 'structure_mismatch',
    schemaName: PLATFORM_SCHEMA,
    detail: describeDifference(difference),
  });
  return true;
}

async function compareClient(
  ctx: RunContext,
  client: pg.Client,
  schema: string,
  referencePrint: readonly string[],
): Promise<boolean> {
  const found = await structurePrint(client, schema);
  const difference = compareStructure(referencePrint, found);
  if (!hasDifference(difference)) return false;

  ctx.report(`${schema} difere da referência:\n${describeDifference(difference)}`);
  await ctx.events.record({
    kind: 'structure_mismatch',
    schemaName: schema,
    detail: describeDifference(difference),
  });
  return true;
}

interface Disposable {
  readonly schema: string;
  readonly namespaceOid: string;
}

/**
 * O nome do descartável: `PROVISION-E-VERIFY.md` §13.2, passo 1.
 *
 * Carimbo **e** 16 hexadecimais de gerador criptográfico, porque carimbo sozinho é previsível e
 * colide com outra execução no mesmo segundo. O prefixo `verify_` é reservado na §10.2 e por `CHECK`
 * em `platform.tenants`, então nenhum cliente pode ter um nome dessa família.
 *
 * **Tudo minúsculo, o `t` e o `z` do carimbo inclusive**, e isso é a propriedade, não o estilo. Este
 * é o único identificador que o sistema gera sem passar pela borda da §10.2, e enquanto ele não era
 * minúsculo puro o catálogo passava a citá-lo (`ON "t_verify_…Z_…".orders`): a impressão da §13.3
 * deixava de casar com a de qualquer cliente, e todo cliente comparado divergia em `orders_pkey`.
 * A neutralidade ao nome do schema que a §13.3 declara se compra **por construção** aqui, e não por
 * cobertura de gramática lá — `pg_get_functiondef` devolve o nome em posição não qualificada
 * (`SET search_path TO 't_acme'`), que `replace` nenhum de lá alcançaria.
 */
export function disposableSchemaName(now: Date = new Date()): string {
  const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z').toLowerCase();
  return `t_verify_${stamp}_${randomBytes(8).toString('hex')}`;
}

async function createDisposable(client: pg.Client): Promise<Disposable> {
  const schema = disposableSchemaName();
  if (!DISPOSABLE_PATTERN.test(schema)) {
    throw unverifiable(`nome de schema descartável fora do padrão da §13.2: "${schema}"`);
  }

  try {
    if (await schemaExists(client, schema)) {
      throw unverifiable(`o schema descartável "${schema}" já existe no catálogo`);
    }
    const createSchema = await renderCommand(client, 'CREATE SCHEMA %I', schema);
    await client.query(createSchema);
  } catch (cause) {
    throw unverifiable(
      `não consegui criar o schema descartável "${schema}": ${describeCause(cause)}`,
      { cause },
    );
  }

  const oid = await client.query<{ oid: string }>(
    'select oid::bigint::text as oid from pg_namespace where nspname = $1',
    [schema],
  );
  const namespaceOid = oid.rows[0]?.oid;
  if (namespaceOid === undefined) {
    throw unverifiable(`o schema descartável "${schema}" não apareceu no catálogo depois de criado`);
  }
  return { schema, namespaceOid };
}

/**
 * As migrations são aplicadas ali **sem escrever no livro-razão**: linha de lá nunca é apagada e
 * este schema é descartável, então registrar produziria, para sempre, linhas nomeando um schema que
 * não existe. O conjunto pendente de um schema novo é conhecido sem livro-razão: é o conjunto
 * inteiro.
 */
async function applyTenantStream(ctx: RunContext, schema: string): Promise<void> {
  for (const migration of ctx.loaded.tenant) {
    await applyMigration(
      ctx.config,
      ctx.session.client,
      migration,
      { schema, writeLedger: false },
      ctx.events,
    );
  }
}

/**
 * Passo 7: remoção com **três condições conferidas no ato**, todas no catálogo. Falhando qualquer
 * uma, o schema **fica** e a saída é `4`, com o nome na mensagem. É a segunda e última exceção de
 * remoção do executor.
 */
async function dropDisposable(
  ctx: RunContext,
  client: pg.Client,
  disposable: Disposable,
): Promise<string | undefined> {
  const refuse = (motivo: string): string => {
    const message =
      `o schema descartável "${disposable.schema}" não foi derrubado (${motivo}), e fica no ` +
      'catálogo. Removê-lo é mão humana (PROVISION-E-VERIFY.md §13.2, passo 7).';
    ctx.report(message);
    return message;
  };

  const current = await client.query<{ oid: string }>(
    'select oid::bigint::text as oid from pg_namespace where nspname = $1',
    [disposable.schema],
  );
  const oid = current.rows[0]?.oid;
  if (oid !== disposable.namespaceOid) {
    return refuse(`o oid do namespace não é o que esta execução criou`);
  }
  if (!DISPOSABLE_PATTERN.test(disposable.schema)) {
    return refuse('o nome não casa com o padrão do descartável');
  }
  if (await tenantRegistryExists(client)) {
    const registered = await readTenants(client);
    if (registered.some((tenant) => tenant.schema_name === disposable.schema)) {
      return refuse('o nome aparece em platform.tenants');
    }
  }

  try {
    const dropSchema = await renderCommand(client, 'DROP SCHEMA %I CASCADE', disposable.schema);
    await client.query(dropSchema);
  } catch (cause) {
    return refuse(describeCause(cause));
  }
  return undefined;
}

import { CONTROL_SCHEMA } from './credential-query.js';
import { TENANT_ROLE_PREFIX } from './tenant-role.js';
import type { CheckOutcome, CredentialCheckVerdict } from '../observability/startup-facts.js';

/**
 * A tabela de decisão da conferência de subida: das respostas do catálogo para as recusas, e das
 * recusas para o veredito do fato.
 *
 * Mora em arquivo próprio desde 2026-09-12, quando a sétima pergunta entrou (`SUB-05`) e
 * `app-credential.ts` passou de 400 linhas. É a segunda metade da mesma divisão que tirou a consulta
 * dali: **a pergunta não decide nada, a decisão não precisa de banco, e agora a orquestração não
 * precisa das duas.** Quem muda este arquivo muda o que o servidor faz com o que viu, e nada aqui
 * abre conexão — é por isso que cada ramo se prova sem arranjo.
 *
 * Por que a matriz sujeito × mecanismo é a forma certa de ler o que está abaixo:
 * `app-credential.ts`, no topo.
 */

/**
 * Qual das **oito** perguntas falhou. `query` é a nona possibilidade: a pergunta não saiu.
 *
 * As quatro primeiras perguntam sobre **quem a credencial é**; `reach`, `assumed` e `assumedReach`
 * perguntam sobre **o que ela alcança**, e juntas fecham a matriz sujeito × mecanismo que
 * `app-credential.ts` desenha no topo. `delegation` pergunta sobre o que **o dono de objeto**
 * empresta a quem usa o objeto (`SUB-09`), e fica fora da matriz porque o sujeito dela não é papel.
 */
export type CredentialQuestion =
  | 'role'
  | 'login'
  | 'group'
  | 'inheritance'
  | 'reach'
  | 'assumed'
  | 'assumedReach'
  | 'delegation'
  | 'query';

export interface CredentialRefusal {
  readonly question: CredentialQuestion;
  /** O que falhou e qual ato humano fecha aquela falta. Nunca sai em resposta HTTP. */
  readonly reason: string;
}

export interface CredentialAnswers {
  readonly currentRole: string;
  readonly sessionRole: string;
  readonly roleExists: boolean;
  readonly roleCanLogin: boolean;
  readonly roleIsSuperuser: boolean;
  readonly groupExists: boolean;
  readonly inGroup: boolean;
  readonly administersGroup: boolean;
  /** Já formatadas como `<papel> (concedido por <concedente>)`. Só concessões à própria credencial. */
  readonly inheritableGrants: readonly string[];
  /** Schemas de cliente que a credencial alcança **sem assumir papel**, como `t_acme (USAGE)`. */
  readonly nakedSchemaReach: readonly string[];
  /** `<papel que este processo assume> herda <papel> (concedido por <concedente>)`. */
  readonly assumedInheritableGrants: readonly string[];
  /** `<papel que este processo assume> -> <schema que não é o dele> (USAGE|CREATE)`. */
  readonly assumedSchemaReach: readonly string[];
  /** `<papel que este processo assume> (SUPERUSER|BYPASSRLS)`. */
  readonly assumedRoleAttributes: readonly string[];
  /** `<objeto, como o catálogo o descreve> (<schema dele> -> <schema de que ele depende>)`. */
  readonly delegatedDependencies: readonly string[];
  /** `<rotina SECURITY DEFINER> (<schema>, dono <papel>)`. */
  readonly definerRoutines: readonly string[];
}

const MAX_GRANTS_NAMED = 5;
const OPERATOR_ACT = 'db/papel-do-cliente.md §7.2';

/**
 * Quantos itens nomear antes de resumir. Lista de N clientes não cabe numa mensagem, e o teto é o
 * que impede a recusa de virar censo do cluster — vale igual para papel concedido e para schema
 * alcançado, que são as duas carteiras de clientes que esta camada consegue enxergar.
 */
function nameSome(items: readonly string[]): string {
  const primeiros = items.slice(0, MAX_GRANTS_NAMED).join(', ');
  const resto = items.length - MAX_GRANTS_NAMED;
  return resto > 0 ? `${primeiros} e mais ${resto}` : primeiros;
}

/**
 * As oito perguntas, decididas **sem banco** — é o que permite provar cada ramo sem arranjo, e
 * provar o arranjo sem duplicar a decisão.
 *
 * Ordem importa: a mensagem é lida de cima para baixo por alguém cujo servidor não subiu.
 */
export function refusalsAgainst(
  answers: CredentialAnswers,
  groupRole: string,
): readonly CredentialRefusal[] {
  const refusals: CredentialRefusal[] = [];

  if (!answers.roleExists) {
    refusals.push({
      question: 'role',
      reason:
        `o catálogo não tem papel chamado "${answers.currentRole}". A conexão autenticou e o ` +
        'papel não está lá: ou ele foi removido do cluster entre o login e esta pergunta, ou este ' +
        `banco não é o que ${OPERATOR_ACT} preparou`,
    });
    // Sem o papel no catálogo, as outras três perguntam sobre nada, e três frases mandando
    // investigar coisas diferentes é pior que uma.
    return refusals;
  }

  if (answers.currentRole !== answers.sessionRole) {
    refusals.push({
      question: 'role',
      reason:
        `a conexão entrou como "${answers.sessionRole}" e está como "${answers.currentRole}": ela ` +
        'chegou com papel já assumido, e as outras perguntas passariam a responder sobre um papel ' +
        'que não é o que autenticou. Tire a opção de papel de FORJA_DATABASE_URL e aponte a chave ' +
        'para a credencial da aplicação',
    });
  }

  if (!answers.roleCanLogin) {
    refusals.push({
      question: 'login',
      reason:
        `o papel "${answers.currentRole}" não tem LOGIN, e a credencial da aplicação conecta ` +
        `(${OPERATOR_ACT}, segunda linha): este nome é de outro papel`,
    });
  }

  if (!answers.groupExists) {
    refusals.push({
      question: 'group',
      reason:
        `o grupo "${groupRole}" não existe neste cluster. Rode ${OPERATOR_ACT} **inteira**, não a ` +
        'linha que falta: ela é uma unidade — grupo, credencial, concessão e os dois REVOKE —, e ' +
        'fazer só o pedaço some com o sintoma sem fazer o trabalho',
    });
  } else if (answers.administersGroup) {
    refusals.push({
      question: 'group',
      reason:
        `o papel "${answers.currentRole}" administra "${groupRole}" (ADMIN OPTION), e quem ` +
        `administra o grupo é o executor de migration (${OPERATOR_ACT}, quarta linha): ` +
        'FORJA_DATABASE_URL está apontando para o executor, não para a credencial da aplicação',
    });
  } else if (!answers.inGroup) {
    refusals.push({
      question: 'group',
      reason:
        `o papel "${answers.currentRole}" não é membro de "${groupRole}"` +
        (answers.roleIsSuperuser
          ? ', e é superusuário deste cluster. Superusuário atravessa todo privilégio de schema, ' +
            'então com ele o isolamento entre clientes deixa de ser uma propriedade do banco e ' +
            'passa a depender de o código nunca errar. '
          : '. ') +
        `Aponte FORJA_DATABASE_URL para a credencial de ${OPERATOR_ACT}, terceira linha`,
    });
  }

  if (answers.inheritableGrants.length > 0) {
    refusals.push({
      question: 'inheritance',
      reason:
        `o papel "${answers.currentRole}" tem concessão herdável: ` +
        `${nameSome(answers.inheritableGrants)}. Com INHERIT, ele alcança o que foi concedido ` +
        '**sem assumir papel nenhum**, e toda a camada de papel por transação deixa de separar ' +
        'cliente de cliente. Cada linha sai pelo concedente que a emitiu (REVOKE … GRANTED BY): ' +
        'pg_auth_members tem uma linha por concedente, e o REVOKE emitido por outro apaga a linha ' +
        'errada. A concessão legítima do executor volta com WITH INHERIT FALSE ' +
        '(db/papel-do-cliente.md §7.3)',
    });
  }

  if (answers.nakedSchemaReach.length > 0) {
    refusals.push({
      question: 'reach',
      reason:
        `o papel "${answers.currentRole}" alcança schema de cliente **sem assumir papel nenhum**: ` +
        `${nameSome(answers.nakedSchemaReach)}. Isto é privilégio concedido ao schema — à própria ` +
        'credencial ou a PUBLIC —, que não passa por pg_auth_members e por isso a pergunta sobre ' +
        'herança não o vê. Ele nasce do reflexo diante de "permission denied for schema": quem lê ' +
        'essa frase concede USAGE à credencial e o alcance vira nu e permanente. Quem alcança o ' +
        `schema é o papel ${TENANT_ROLE_PREFIX}<schema>, assumido por transação; o que fecha é ` +
        'REVOKE ALL ON SCHEMA <schema> FROM <credencial> e de PUBLIC (db/papel-do-cliente.md §7.3)',
    });
  }

  if (answers.assumedInheritableGrants.length > 0) {
    refusals.push({
      question: 'assumed',
      reason:
        'papel que este processo assume por transação herda outro papel: ' +
        `${nameSome(answers.assumedInheritableGrants)}. Quem herda alcança o schema do outro ` +
        'cliente **dentro da transação do primeiro**, pelo caminho normal de requisição, sem erro ' +
        'nenhum e sem tocar em código nosso. Concessão entre papel de cliente e papel de cliente ' +
        'não existe no arranjo: o que fecha é REVOKE <papel herdado> FROM <papel que herda> ' +
        'GRANTED BY <concedente> (db/papel-do-cliente.md §7.3, e a pergunta invertida do verify em ' +
        'db/verificacao-do-papel.md §7.5.1)',
    });
  }

  /**
   * O atributo vem **antes** do alcance de propósito. Papel superusuário responde `t` em
   * `has_schema_privilege` para **todo** schema (medido em 2026-09-12, PostgreSQL 16.15), então a
   * lista abaixo sai nomeando o cluster inteiro e o `REVOKE` que ela sugere não muda nada. Quem lê
   * de cima para baixo precisa do ato certo primeiro.
   */
  if (answers.assumedRoleAttributes.length > 0) {
    refusals.push({
      question: 'assumedReach',
      reason:
        'papel que este processo assume por transação tem atributo que atravessa privilégio: ' +
        `${nameSome(answers.assumedRoleAttributes)}. Atributo não é concessão e não aparece em ` +
        'privilégio de schema nenhum: enquanto ele estiver lá, o papel alcança todo cliente deste ' +
        'banco de dentro da transação do primeiro, e revogar privilégio não muda nada. Papel de ' +
        `aplicação nasce "NOLOGIN NOINHERIT" e nada além disso (${TENANT_ROLE_PREFIX}<schema>, ` +
        'db/papel-do-cliente.md §7.3); o que fecha é ALTER ROLE <papel> NOSUPERUSER NOBYPASSRLS',
    });
  }

  if (answers.assumedSchemaReach.length > 0) {
    refusals.push({
      question: 'assumedReach',
      reason:
        'papel que este processo assume por transação alcança schema que não é o dele: ' +
        `${nameSome(answers.assumedSchemaReach)}. É a quarta parede da mesma casa: a pergunta ` +
        'sobre herança olha concessão de papel e não vê privilégio de objeto, e a pergunta sobre ' +
        'alcance olhava só a credencial. Duas linhas do ato do executor levam o mesmo slug, e ' +
        'trocar um deles põe um cliente dentro do schema do outro **pelo caminho normal de ' +
        `requisição**, sem erro nenhum. O schema de controle "${CONTROL_SCHEMA}" entra na mesma ` +
        'lista, porque lá mora a carteira de clientes (db/papeis-e-credencial.md §1). O que fecha ' +
        'é REVOKE ALL ON SCHEMA <schema> FROM <papel> e de PUBLIC (db/papel-do-cliente.md §7.3)',
    });
  }

  if (answers.delegatedDependencies.length > 0) {
    refusals.push({
      question: 'delegation',
      reason:
        'objeto de um schema protegido depende de objeto de outro schema: ' +
        `${nameSome(answers.delegatedDependencies)}. Regra, view, view materializada e chave ` +
        'estrangeira rodam com o privilégio do dono, herança e partição checam privilégio só no ' +
        'pai, e o dono dos schemas de cliente alcança todos eles: quem usa o objeto no schema de ' +
        'um cliente lê ou escreve no do outro sem privilégio nenhum sobre ele, e as perguntas de ' +
        'alcance respondem ok. O arranjo não tem dependência fora do próprio schema, e o crivo de ' +
        'migration a recusa: o objeto nasceu fora do caminho de migration. O que fecha é derrubar ' +
        'o objeto nomeado, pelo dono dele, e rodar o verify do executor (db/verificacao-do-papel.md)',
    });
  }

  if (answers.definerRoutines.length > 0) {
    refusals.push({
      question: 'delegation',
      reason:
        `rotina SECURITY DEFINER em schema protegido: ${nameSome(answers.definerRoutines)}. Ela ` +
        'roda com o privilégio do dono, e o corpo dela não deixa rastro no catálogo sobre o que ' +
        'lê: julgá-la por dependência deixaria passar a forma comum. O crivo de migration recusa ' +
        'SECURITY DEFINER (db/migrator/src/refusals.ts), então ela nasceu fora do caminho de ' +
        'migration. O que fecha é derrubar a rotina, ou recriá-la SECURITY INVOKER, pelo dono dela',
    });
  }

  return refusals;
}

const QUESTION_ORDER = [
  'role',
  'login',
  'group',
  'inheritance',
  'reach',
  'assumed',
  'assumedReach',
  'delegation',
] as const;

export function verdictOf(
  refusals: readonly CredentialRefusal[],
  answered: boolean,
): CredentialCheckVerdict {
  const outcome = (question: (typeof QUESTION_ORDER)[number]): CheckOutcome => {
    if (!answered) return 'unanswered';
    return refusals.some((refusal) => refusal.question === question) ? 'refused' : 'ok';
  };
  return {
    role: outcome('role'),
    login: outcome('login'),
    group: outcome('group'),
    inheritance: outcome('inheritance'),
    reach: outcome('reach'),
    assumed: outcome('assumed'),
    assumedReach: outcome('assumedReach'),
    delegation: outcome('delegation'),
  };
}

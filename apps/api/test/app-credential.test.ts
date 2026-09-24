import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  AppCredentialError,
  assertAppCredential,
  refusalsAgainst,
  verdictOf,
  type CredentialAnswers,
  type CredentialQuestion,
} from '../src/db/app-credential.js';
import { createPool, createRootDb } from '../src/db/pool.js';
import {
  emitStartupFact,
  nullStartupFactSink,
  type StartupFact,
  type StartupFactSink,
} from '../src/observability/startup-facts.js';

/**
 * As oito perguntas decididas sem banco (`F-003`, mais `SUB-01`/`SUB-02` do gate 3, `SUB-05`/`SUB-06`
 * da reauditoria e `SUB-09` da terceira auditoria).
 *
 * O arranjo vivo prova que o catálogo responde o que se espera; isto prova o que o servidor faz
 * com cada resposta — inclusive as que não dá para montar num banco de verdade, como um papel
 * sem `LOGIN` que mesmo assim conectou.
 */

const GRUPO = 'forja_app';

/** A credencial correta da `db/papel-do-cliente.md` §7.2, e cada teste estraga um pedaço dela. */
function respostas(mudanca: Partial<CredentialAnswers> = {}): CredentialAnswers {
  return {
    currentRole: 'forja_credencial',
    sessionRole: 'forja_credencial',
    roleExists: true,
    roleCanLogin: true,
    roleIsSuperuser: false,
    groupExists: true,
    inGroup: true,
    administersGroup: false,
    inheritableGrants: [],
    nakedSchemaReach: [],
    assumedInheritableGrants: [],
    assumedSchemaReach: [],
    assumedRoleAttributes: [],
    delegatedDependencies: [],
    definerRoutines: [],
    ...mudanca,
  };
}

function perguntas(answers: CredentialAnswers): readonly CredentialQuestion[] {
  return refusalsAgainst(answers, GRUPO).map((recusa) => recusa.question);
}

function motivo(answers: CredentialAnswers): string {
  return refusalsAgainst(answers, GRUPO)
    .map((recusa) => recusa.reason)
    .join('\n');
}

test('credencial correta não produz recusa nenhuma', () => {
  assert.deepEqual(refusalsAgainst(respostas(), GRUPO), []);
  assert.deepEqual(verdictOf([], true), {
    role: 'ok',
    login: 'ok',
    group: 'ok',
    inheritance: 'ok',
    reach: 'ok',
    assumed: 'ok',
    assumedReach: 'ok',
    delegation: 'ok',
  });
});

test('papel ausente do catálogo recusa sozinho, sem as outras três frases', () => {
  const recusas = refusalsAgainst(respostas({ roleExists: false, groupExists: false }), GRUPO);
  assert.equal(recusas.length, 1);
  assert.equal(recusas[0]?.question, 'role');
});

test('conexão que chegou com papel já assumido é recusada', () => {
  const answers = respostas({ sessionRole: 'postgres', currentRole: 'forja_credencial' });
  assert.deepEqual(perguntas(answers), ['role']);
  assert.match(motivo(answers), /entrou como "postgres"/);
});

test('papel sem LOGIN falha a segunda pergunta', () => {
  assert.deepEqual(perguntas(respostas({ roleCanLogin: false })), ['login']);
});

test('grupo inexistente manda rodar a §7.2 inteira, não a linha que falta', () => {
  const answers = respostas({ groupExists: false, inGroup: false });
  assert.deepEqual(perguntas(answers), ['group']);
  assert.match(motivo(answers), /inteira/);
});

/** O caso 2 do `F-003`: a chave aponta para o executor, que entra no grupo com `ADMIN OPTION`. */
test('quem administra o grupo é o executor, e a mensagem diz isso', () => {
  const answers = respostas({ inGroup: false, administersGroup: true });
  assert.deepEqual(perguntas(answers), ['group']);
  assert.match(motivo(answers), /ADMIN OPTION/);
  assert.match(motivo(answers), /executor/);
});

/** O caso 3 do `F-003`: hoje sobe e funciona, contido. Depois, não sobe. */
test('superusuário fora do grupo é recusado, e a mensagem nomeia o superusuário', () => {
  const answers = respostas({
    currentRole: 'postgres',
    sessionRole: 'postgres',
    inGroup: false,
    roleIsSuperuser: true,
  });
  assert.deepEqual(perguntas(answers), ['group']);
  assert.match(motivo(answers), /superusuário/);
});

/** O caso 4 do `F-003`, que é o `PAP-13` visto do lado do servidor. */
test('concessão herdável recusa e nomeia a concessão e quem a concedeu', () => {
  const answers = respostas({ inheritableGrants: ['app_t_acme (concedido por postgres)'] });
  assert.deepEqual(perguntas(answers), ['inheritance']);
  assert.match(motivo(answers), /app_t_acme \(concedido por postgres\)/);
  assert.match(motivo(answers), /GRANTED BY/);
});

test('lista longa de concessões herdáveis é resumida, não despejada', () => {
  const muitas = Array.from({ length: 9 }, (_, i) => `app_t_c${i} (concedido por postgres)`);
  const texto = motivo(respostas({ inheritableGrants: muitas }));
  assert.match(texto, /e mais 4/);
  assert.equal(texto.includes('app_t_c8'), false);
});

/**
 * `SUB-01`: o alcance por privilégio de objeto. O estado hostil é o reflexo mais comum diante de
 * `permission denied for schema` — e antes desta cláusula ele subia com as quatro respondendo `ok`.
 */
test('alcance nu em schema de cliente recusa, e nomeia o schema e o que fecha', () => {
  const answers = respostas({ nakedSchemaReach: ['t_acme (USAGE)'] });
  assert.deepEqual(perguntas(answers), ['reach']);
  assert.match(motivo(answers), /t_acme \(USAGE\)/);
  assert.match(motivo(answers), /REVOKE ALL ON SCHEMA/);
  // A variante que não nomeia beneficiário nenhum é a mesma resposta do catálogo, então a
  // mensagem tem que mandar revogar também de PUBLIC — senão o REVOKE óbvio não muda nada.
  assert.match(motivo(answers), /PUBLIC/);
});

/** `SUB-02`: o alcance de quem a credencial **assume**, que é quem executa a consulta de negócio. */
test('papel assumido que herda outro papel recusa, e nomeia os dois e o concedente', () => {
  const answers = respostas({
    assumedInheritableGrants: ['app_t_acme herda app_t_globex (concedido por forja_exec)'],
  });
  assert.deepEqual(perguntas(answers), ['assumed']);
  assert.match(motivo(answers), /app_t_acme herda app_t_globex \(concedido por forja_exec\)/);
  assert.match(motivo(answers), /GRANTED BY/);
});

/**
 * `SUB-05`, a quarta célula da matriz: sujeito no papel assumido, mecanismo em privilégio de
 * objeto. O estado hostil é o **erro de digitação** da §7.3 — duas linhas carregam o mesmo slug —, e
 * antes desta cláusula ele subia com as **seis** perguntas respondendo `ok` enquanto um cliente lia
 * a venda do outro pelo caminho normal de requisição.
 */
test('papel assumido que alcança schema alheio recusa, e nomeia o par e o que fecha', () => {
  const answers = respostas({ assumedSchemaReach: ['app_t_acme -> t_globex (USAGE)'] });
  assert.deepEqual(perguntas(answers), ['assumedReach']);
  assert.match(motivo(answers), /app_t_acme -> t_globex \(USAGE\)/);
  assert.match(motivo(answers), /REVOKE ALL ON SCHEMA/);
  assert.match(motivo(answers), /PUBLIC/);
});

/**
 * A variante (b) do `SUB-05`, e o `SUB-06` visto do lado do papel assumido: o alvo é o schema de
 * controle, onde mora a carteira de clientes. A mensagem tem que nomear `platform`, senão quem lê
 * trata o achado como se fosse um schema de cliente qualquer.
 */
test('alcance de papel assumido no schema de controle nomeia o schema de controle', () => {
  const answers = respostas({ assumedSchemaReach: ['app_t_acme -> platform (USAGE)'] });
  assert.deepEqual(perguntas(answers), ['assumedReach']);
  assert.match(motivo(answers), /platform/);
  assert.match(motivo(answers), /carteira de clientes/);
});

/**
 * A variante (c) do `SUB-05`: atributo, não privilégio. Ela vem **antes** do alcance na mensagem
 * porque papel superusuário responde `t` em `has_schema_privilege` para todo schema — a lista de
 * alcance sai nomeando o cluster inteiro, e o `REVOKE` que ela sugere não muda nada.
 */
test('atributo que atravessa privilégio recusa primeiro, e manda o ato certo', () => {
  const answers = respostas({
    assumedRoleAttributes: ['app_t_acme (SUPERUSER)'],
    assumedSchemaReach: ['app_t_acme -> t_globex (USAGE)'],
  });
  assert.deepEqual(perguntas(answers), ['assumedReach', 'assumedReach']);

  const recusas = refusalsAgainst(answers, GRUPO);
  assert.match(recusas[0]?.reason ?? '', /ALTER ROLE <papel> NOSUPERUSER NOBYPASSRLS/);
  assert.equal(
    (recusas[0]?.reason ?? '').includes('REVOKE'),
    false,
    'o ato do atributo não é revogar privilégio, e misturar os dois manda o operador ao lugar errado',
  );
  assert.match(recusas[1]?.reason ?? '', /REVOKE ALL ON SCHEMA/);
});

test('lista longa de alcance de papel assumido também é resumida', () => {
  const muitos = Array.from({ length: 9 }, (_, i) => `app_t_a -> t_c${i} (USAGE)`);
  const texto = motivo(respostas({ assumedSchemaReach: muitos }));
  assert.match(texto, /e mais 4/);
  assert.equal(texto.includes('t_c8'), false);
});

/**
 * `SUB-09`, o quinto mecanismo: objeto que empresta o privilégio do dono. Medido pelo auditor em
 * 2026-09-23 com as outras sete perguntas respondendo `ok`, então a recusa tem de sair sozinha, com
 * a sua pergunta, nomeando o objeto e os dois schemas.
 */
test('dependência entre schemas protegidos recusa sozinha, nomeando objeto e os dois schemas', () => {
  const answers = respostas({
    delegatedDependencies: ['rule espelho on table t_acme.orders (t_acme -> t_globex)'],
  });
  assert.deepEqual(perguntas(answers), ['delegation']);
  assert.match(motivo(answers), /rule espelho on table t_acme\.orders \(t_acme -> t_globex\)/);
  assert.match(motivo(answers), /privilégio do dono/);
  assert.deepEqual(verdictOf(refusalsAgainst(answers, GRUPO), true), {
    role: 'ok',
    login: 'ok',
    group: 'ok',
    inheritance: 'ok',
    reach: 'ok',
    assumed: 'ok',
    assumedReach: 'ok',
    delegation: 'refused',
  });
});

test('rotina SECURITY DEFINER em schema protegido recusa, e manda o ato do dono', () => {
  const answers = respostas({ definerRoutines: ['function t_acme.relatorio() (t_acme, dono forja_exec)'] });
  assert.deepEqual(perguntas(answers), ['delegation']);
  assert.match(motivo(answers), /function t_acme\.relatorio\(\) \(t_acme, dono forja_exec\)/);
  assert.match(motivo(answers), /SECURITY INVOKER/);
});

test('as duas formas de delegação saem como duas recusas, a de dependência primeiro', () => {
  const answers = respostas({
    delegatedDependencies: ['materialized view t_acme.mv (t_acme -> t_globex)'],
    definerRoutines: ['function t_acme.relatorio() (t_acme, dono forja_exec)'],
  });
  assert.deepEqual(perguntas(answers), ['delegation', 'delegation']);
  const recusas = refusalsAgainst(answers, GRUPO);
  assert.match(recusas[0]?.reason ?? '', /materialized view/);
  assert.match(recusas[1]?.reason ?? '', /SECURITY DEFINER/);
});

test('lista longa de delegação também é resumida', () => {
  const muitos = Array.from({ length: 9 }, (_, i) => `view t_a.v${i} (t_a -> t_b)`);
  const texto = motivo(respostas({ delegatedDependencies: muitos }));
  assert.match(texto, /e mais 4/);
  assert.equal(texto.includes('t_a.v8'), false);
});

/**
 * As três perguntas de alcance são independentes entre si. O estado abaixo é o que a reauditoria
 * mediu subindo como `verified`: `reach` e `assumed` limpos, e um cliente dentro do schema do outro.
 */
test('alcance de papel assumido falha sozinho, com reach e assumed respondendo ok', () => {
  const answers = respostas({ assumedSchemaReach: ['app_t_acme -> t_globex (USAGE)'] });
  assert.deepEqual(verdictOf(refusalsAgainst(answers, GRUPO), true), {
    role: 'ok',
    login: 'ok',
    group: 'ok',
    inheritance: 'ok',
    reach: 'ok',
    assumed: 'ok',
    assumedReach: 'refused',
    delegation: 'ok',
  });
});

test('lista longa de schemas alcançados também é resumida: a recusa não vira censo', () => {
  const muitos = Array.from({ length: 9 }, (_, i) => `t_c${i} (USAGE)`);
  const texto = motivo(respostas({ nakedSchemaReach: muitos }));
  assert.match(texto, /e mais 4/);
  assert.equal(texto.includes('t_c8'), false);
});

/**
 * As duas perguntas novas são independentes das quatro antigas **e uma da outra**: o estado em que
 * tudo mais está certo e as duas falham é exatamente o que o gate 3 mediu subindo como `verified`.
 */
test('alcance e herança de papel assumido falham juntos, com o resto respondendo ok', () => {
  const answers = respostas({
    nakedSchemaReach: ['t_acme (USAGE)'],
    assumedInheritableGrants: ['app_t_acme herda app_t_globex (concedido por forja_exec)'],
  });
  assert.deepEqual(perguntas(answers), ['reach', 'assumed']);
  assert.deepEqual(verdictOf(refusalsAgainst(answers, GRUPO), true), {
    role: 'ok',
    login: 'ok',
    group: 'ok',
    inheritance: 'ok',
    reach: 'refused',
    assumed: 'refused',
    assumedReach: 'ok',
    delegation: 'ok',
  });
});

test('perguntas independentes falham juntas, cada uma com sua frase', () => {
  const answers = respostas({
    roleCanLogin: false,
    inGroup: false,
    administersGroup: true,
    inheritableGrants: ['forja_app (concedido por postgres)'],
  });
  assert.deepEqual(perguntas(answers), ['login', 'group', 'inheritance']);
  assert.deepEqual(verdictOf(refusalsAgainst(answers, GRUPO), true), {
    role: 'ok',
    login: 'refused',
    group: 'refused',
    inheritance: 'refused',
    reach: 'ok',
    assumed: 'ok',
    assumedReach: 'ok',
    delegation: 'ok',
  });
});

test('pergunta que não saiu fica unanswered, que não é ok nem refused', () => {
  assert.deepEqual(verdictOf([{ question: 'query', reason: 'x' }], false), {
    role: 'unanswered',
    login: 'unanswered',
    group: 'unanswered',
    inheritance: 'unanswered',
    reach: 'unanswered',
    assumed: 'unanswered',
    assumedReach: 'unanswered',
    delegation: 'unanswered',
  });
});

test('a mensagem do erro carrega toda recusa e diz que a porta não abriu', () => {
  const erro = new AppCredentialError(refusalsAgainst(respostas({ roleCanLogin: false }), GRUPO));
  assert.match(erro.message, /LOGIN/);
  assert.match(erro.message, /não abriu a porta/);
  assert.equal(erro instanceof Error, true);
});

/**
 * Falhar ao **perguntar** é recusa, nunca passe livre — e a recusa não pode carregar o endereço
 * de onde a pergunta ia. Porta 1 não tem quem escute, então o `pg` recusa a conexão sem esperar.
 */
test('catálogo inalcançável recusa a subida, sem vazar host, porta nem papel do parâmetro', async () => {
  const fatos: StartupFact[] = [];
  const coletor: StartupFactSink = { name: 'teste', record: (fato) => void fatos.push(fato) };

  const pool = createPool({
    connectionString: 'postgres://forja_credencial_de_teste@127.0.0.1:1/forja_nada',
    poolMax: 1,
    statementTimeoutMs: 2_000,
    idleInTransactionTimeoutMs: 2_000,
    connectionTimeoutMs: 2_000,
  });
  const raiz = createRootDb(pool);

  try {
    await assert.rejects(
      () => assertAppCredential(raiz, { factSink: coletor }),
      (erro: unknown) => {
        assert.equal(erro instanceof AppCredentialError, true);
        const mensagem = (erro as AppCredentialError).message;
        assert.equal((erro as AppCredentialError).refusals[0]?.question, 'query');
        assert.equal(mensagem.includes('127.0.0.1'), false, 'a recusa não carrega host');
        assert.equal(mensagem.includes('forja_nada'), false, 'a recusa não carrega o banco');
        assert.equal(
          mensagem.includes('forja_credencial_de_teste'),
          false,
          'a recusa não carrega o papel do parâmetro: quem responde por ele é o catálogo',
        );
        return true;
      },
    );

    assert.equal(fatos.length, 1);
    assert.equal(fatos[0]?.kind, 'startup_credential_refused');
    assert.equal(fatos[0]?.currentRole, '(desconhecido)');
    assert.equal(fatos[0]?.verdict.group, 'unanswered');
  } finally {
    await raiz.destroy();
  }
});

test('fato de subida nunca derruba a recusa que ele descreve', () => {
  const quebrado: StartupFactSink = {
    name: 'quebrado',
    record() {
      throw new Error('destino fora');
    },
  };
  assert.doesNotThrow(() =>
    emitStartupFact(quebrado, {
      kind: 'startup_credential_verified',
      currentRole: 'forja_credencial',
      sessionRole: 'forja_credencial',
      groupRole: GRUPO,
      verdict: verdictOf([], true),
    }),
  );
  assert.doesNotThrow(() =>
    emitStartupFact(nullStartupFactSink, {
      kind: 'startup_credential_verified',
      currentRole: 'forja_credencial',
      sessionRole: 'forja_credencial',
      groupRole: GRUPO,
      verdict: verdictOf([], true),
    }),
  );
});

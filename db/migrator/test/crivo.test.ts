import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { contentScreen } from '../src/refusals.js';
import { parseHeader } from '../src/header.js';
import { ExecutorError, EXIT_REFUSED } from '../src/errors.js';
import { REAL_PLATFORM_DIR, tenantMigration } from './support/tree.js';

/** `RECUSAS.md` §11, e os casos 12, 13, 14, 19, 20 e 25 a 31 de `CONTRATO.md` §14. */

function passa(texto: string, version = 'tenant/0001__x'): readonly string[] {
  return contentScreen.screen({ version, text: texto, header: parseHeader(texto, version).header });
}

function recusa(texto: string, esperado: RegExp, version = 'tenant/0001__x'): void {
  assert.throws(
    () => passa(texto, version),
    (erro: unknown) =>
      erro instanceof ExecutorError && erro.exitCode === EXIT_REFUSED && esperado.test(erro.message),
    `${esperado} não recusou: ${texto}`,
  );
}

/**
 * Casos 14 e 20: **todo** arquivo do repositório passa, e uma view legítima com alias também.
 *
 * O piso é a existência do conjunto, não um número: a contagem escrita aqui envelhecia a cada
 * migration nova, e um piso que alguém atualiza por hábito deixa de ser piso.
 */
test('todo arquivo de db/migrations/platform passa pelo crivo', () => {
  const arquivos = readdirSync(REAL_PLATFORM_DIR);
  assert.ok(arquivos.length > 0, `nenhum arquivo em ${REAL_PLATFORM_DIR}: o alvo do caso 20 sumiu`);
  for (const arquivo of arquivos) {
    const texto = readFileSync(join(REAL_PLATFORM_DIR, arquivo), 'utf-8');
    const version = `platform/${arquivo.slice(0, -'.sql'.length)}`;
    const comandos = passa(texto, version);
    assert.ok(comandos.length > 0, version);
  }
});

test('a fronteira da §11.3 não reprova alias', () => {
  const comandos = passa(
    tenantMigration(`
CREATE OR REPLACE VIEW vendas_do_dia WITH (security_invoker = true) AS
    SELECT o.total FROM orders o;
`),
  );
  assert.equal(comandos.length, 1);
});

/** Caso 12: o que a lista de permissão deixa de fora. */
test('DROP, GRANT, UPDATE e bloco DO são recusados', () => {
  const casos: readonly (readonly [string, RegExp])[] = [
    ['DROP SCHEMA t_vitima CASCADE;', /qualificador de schema|nenhuma forma/],
    ['DROP TABLE orders;', /nenhuma forma/],
    ['ALTER TABLE orders DROP CONSTRAINT orders_pkey;', /nenhuma forma/],
    ['GRANT SELECT ON orders TO alguem;', /nenhuma forma/],
    ['UPDATE orders SET total = 0;', /comando SET|nenhuma forma/],
    ["DO $fn$ BEGIN PERFORM 1; END $fn$;", /bloco anônimo DO/],
  ];
  for (const [corpo, esperado] of casos) recusa(tenantMigration(corpo), esperado);
});

/** Caso 13: formas permitidas que alcançavam outro cliente (`MIG-10`). */
test('comando que começa permitido e alcança outro schema é recusado pela forma inteira', () => {
  recusa(
    tenantMigration('CREATE TABLE IF NOT EXISTS copia AS SELECT * FROM outra;'),
    /nenhuma forma|SELECT/,
  );
  recusa(
    tenantMigration('INSERT INTO copia (a) SELECT a FROM outra ON CONFLICT DO NOTHING;'),
    /SELECT: seed é valor literal/,
  );
  recusa(
    tenantMigration(
      'CREATE OR REPLACE VIEW v WITH (security_invoker = true) AS SELECT * FROM t_outro.orders;',
    ),
    /qualificador de schema "t_outro"/,
  );
  recusa(
    tenantMigration('ALTER TABLE t_outro.orders ADD COLUMN IF NOT EXISTS x integer;'),
    /qualificador de schema "t_outro"/,
  );
});

/**
 * Caso 19, e é o `SEC-01` virando teste: as três grafias que o teste 13 deixava passar. Medido pelo
 * gate: recusar aspa sozinha pega 2 dos 4, normalizar sozinha pega 2, as duas juntas pegam 4.
 */
test('aspa e maiúscula não contornam a fronteira de schema', () => {
  recusa(
    tenantMigration('ALTER TABLE "t_outro".orders ADD COLUMN IF NOT EXISTS x integer;'),
    /aspa dupla/,
  );
  recusa(
    tenantMigration('ALTER TABLE T_OUTRO.orders ADD COLUMN IF NOT EXISTS x integer;'),
    /qualificador de schema "t_outro"/,
  );
  recusa(
    tenantMigration('ALTER TABLE "T_outro" . orders ADD COLUMN IF NOT EXISTS x integer;'),
    /aspa dupla/,
  );
  recusa(
    tenantMigration('ALTER TABLE t_outro . orders ADD COLUMN IF NOT EXISTS x integer;'),
    /qualificador de schema "t_outro"/,
  );
});

test('aspa dupla é recusada mesmo dentro de literal e em COLLATE', () => {
  recusa(tenantMigration(`COMMENT ON TABLE orders IS 'o "pedido"';`), /aspa dupla/);
  recusa(
    tenantMigration('CREATE INDEX IF NOT EXISTS ix_a ON orders (total COLLATE "C");'),
    /aspa dupla/,
  );
});

test('aspa dupla em comentário não recusa: o passo 1 a remove antes', () => {
  const comandos = passa(
    tenantMigration(`
-- o "pedido" nasce aqui
CREATE TABLE IF NOT EXISTS orders (order_id uuid NOT NULL);
`),
  );
  assert.equal(comandos.length, 1);
});

test('as formas proibidas da §11.5 em qualquer posição', () => {
  const casos: readonly (readonly [string, RegExp])[] = [
    ['CREATE OR REPLACE FUNCTION f() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RETURN NEW; END $$;', /cifrão sem rótulo/],
    ["CREATE OR REPLACE FUNCTION f() RETURNS trigger LANGUAGE plpgsql AS $fn$ BEGIN EXECUTE 'x'; RETURN NEW; END $fn$;", /EXECUTE que executa texto/],
    ["CREATE OR REPLACE FUNCTION f() RETURNS trigger LANGUAGE plpgsql AS $fn$ BEGIN RAISE EXCEPTION format('x'); END $fn$;", /format\(\)/],
    ['CREATE OR REPLACE FUNCTION f() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $fn$ BEGIN RETURN NEW; END $fn$;', /SECURITY DEFINER/],
    ['COMMENT ON TABLE orders IS \'faça commit antes\';', /COMMIT/],
    ['CREATE TABLE IF NOT EXISTS a (x integer); SET search_path TO public;', /comando SET/],
    ['COPY orders FROM \'/etc/passwd\';', /COPY/],
  ];
  for (const [corpo, esperado] of casos) recusa(tenantMigration(corpo), esperado);
});

test('o gatilho tem que terminar em EXECUTE FUNCTION, e a view exige security_invoker', () => {
  recusa(
    tenantMigration('CREATE OR REPLACE VIEW v AS SELECT total FROM orders;'),
    /security_invoker = true é obrigatória/,
  );
  recusa(
    tenantMigration('CREATE OR REPLACE TRIGGER t BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE f();'),
    /terminar em EXECUTE FUNCTION/,
  );
});

/** §11.4, a parte que depende do corpo. */
test('regime e cria-indice são conferidos contra o corpo', () => {
  recusa(
    tenantMigration('CREATE INDEX CONCURRENTLY IF NOT EXISTS ix_a ON orders (total);'),
    /CONCURRENTLY em migration marcada "transacional: sim"/,
  );
  recusa(
    tenantMigration('CREATE TABLE IF NOT EXISTS a (x integer);', { transacional: false }),
    /só admite CREATE INDEX CONCURRENTLY/,
  );
  recusa(
    tenantMigration('ALTER TABLE orders ADD CONSTRAINT c CHECK (total >= 0);', { transacional: false }),
    /ADD CONSTRAINT em migration marcada "transacional: nao"/,
  );
  recusa(
    tenantMigration('CREATE INDEX CONCURRENTLY IF NOT EXISTS ix_a ON orders (total);', {
      transacional: false,
      criaIndice: 'ix_b',
    }),
    /cria-indice declara "ix_b", que o corpo não cria/,
  );
  recusa(
    tenantMigration('CREATE INDEX CONCURRENTLY IF NOT EXISTS ix_a ON orders (total);', {
      transacional: false,
    }),
    /o cabeçalho não o declara em cria-indice/,
  );

  const valido = passa(
    tenantMigration('CREATE INDEX CONCURRENTLY IF NOT EXISTS ix_a ON orders (total);', {
      transacional: false,
      criaIndice: 'ix_a',
    }),
  );
  assert.equal(valido.length, 1);
});

/** §11.2: `CREATE SCHEMA` só existe em alvo platform. */
test('CREATE SCHEMA em migration de cliente é recusado', () => {
  recusa(tenantMigration('CREATE SCHEMA IF NOT EXISTS outro;'), /só existe em alvo platform/);
});

/** Cabeçalho mínimo de alvo `platform`, para os casos 30 e 27 que só existem lá. */
function platformMigration(body: string): string {
  return (
    '-- alvo: platform\n' +
    '-- transacional: sim\n' +
    '-- reversivel: nao; fixture de teste, e a inversa apagaria o que ela cria\n' +
    '\n' +
    body.trimStart()
  );
}

const CORPO_QUE_ESCREVE = 'INSERT INTO orders (order_id) VALUES (gen_random_uuid()); RETURN NEW;';

function funcao(corpo: string): string {
  return (
    'CREATE OR REPLACE FUNCTION f() RETURNS trigger LANGUAGE plpgsql AS $fn$ BEGIN ' +
    corpo +
    ' END $fn$;'
  );
}

/**
 * Caso 25, e é o `EXE-01`: os quatro atravessavam a regra anterior, que era `SET search_path` e
 * `SET ROLE` implementadas como duas palavras coladas. Nenhum deles tem qualificador de schema, então
 * a §11.3 não os vê — o literal `t_vitima` não tem ponto.
 */
test('o comando SET e set_config( dentro de corpo de função são recusados', () => {
  recusa(tenantMigration(funcao(`SET LOCAL search_path TO t_vitima; ${CORPO_QUE_ESCREVE}`)), /comando SET/);
  recusa(tenantMigration(funcao(`SET SESSION search_path TO t_vitima; ${CORPO_QUE_ESCREVE}`)), /comando SET/);
  recusa(tenantMigration(funcao(`SET LOCAL ROLE outro_papel; ${CORPO_QUE_ESCREVE}`)), /comando SET/);
  recusa(
    tenantMigration(funcao(`PERFORM set_config('search_path', 't_vitima', true); ${CORPO_QUE_ESCREVE}`)),
    /set_config\(\)/,
  );
});

/** A palavra `set` continua passando nas três vizinhanças em que ela não é comando (§11.5). */
test('set not null, set default e set null não são o comando SET', () => {
  assert.equal(passa(tenantMigration('ALTER TABLE orders ALTER COLUMN total SET NOT NULL;')).length, 1);
  assert.equal(passa(tenantMigration('ALTER TABLE orders ALTER COLUMN total SET DEFAULT 0;')).length, 1);
  assert.equal(
    passa(
      tenantMigration(
        'CREATE TABLE IF NOT EXISTS items (order_id uuid REFERENCES orders (order_id) ON DELETE SET NULL);',
      ),
    ).length,
    1,
  );
});

/**
 * Caso 26, e é o `EXE-02`: a §11.2 dizia "uma ação por comando" desde a primeira versão, e nada no
 * mecanismo lia a vírgula. Nenhuma das quatro segundas ações está escrita na lista — quem as mata é a
 * cauda.
 */
test('vírgula fora de parêntese em ALTER TABLE traz uma segunda ação, e é recusa', () => {
  const segundas: readonly string[] = [
    'DROP COLUMN total',
    'DISABLE TRIGGER orders_reject_mutation',
    'DROP CONSTRAINT orders_pkey',
    'OWNER TO outro_papel',
  ];
  for (const segunda of segundas) {
    recusa(
      tenantMigration(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS c integer, ${segunda};`),
      /uma ação só/,
    );
  }
});

test('vírgula dentro de parêntese continua sendo lista, e passa', () => {
  const comandos = passa(
    tenantMigration('ALTER TABLE orders ADD CONSTRAINT orders_total_check CHECK (total BETWEEN 0 AND 10);'),
  );
  assert.equal(comandos.length, 1);
  assert.equal(
    passa(tenantMigration('ALTER TABLE orders ADD COLUMN IF NOT EXISTS preco numeric(14,2);')).length,
    1,
  );
});

/**
 * Caso 27, a perna do carregador: o padrão da §11.3 parou de escrever comprimento, então o cliente de
 * nome comprido deixou de sair da fronteira. Com `{1,40}` no padrão, o de 41 passava — e o slug de 41
 * deixou de existir na borda e no banco (`0007`).
 */
test('qualificador t_ de qualquer comprimento é recusado', () => {
  for (const tamanho of [1, 39, 40, 41, 63]) {
    const slug = 'a'.repeat(tamanho);
    recusa(
      tenantMigration(
        `CREATE OR REPLACE VIEW v WITH (security_invoker = true) AS SELECT total FROM t_${slug}.orders;`,
      ),
      /qualificador de schema/,
    );
  }
});

/**
 * Caso 29, e é o `EXE-06`: os dois primeiros pela lista fechada de linguagem, os demais pela cauda da
 * forma. `COST` entra junto porque isola a cauda — a §11.5 não tem nada sobre ele, e mesmo assim ele
 * não passa, que é o ponto de a forma declarar onde termina.
 */
test('a forma de função termina em LANGUAGE e AS, e nada vem depois', () => {
  const corpo = 'BEGIN RETURN NEW; END';
  recusa(
    tenantMigration(`CREATE OR REPLACE FUNCTION f() RETURNS integer LANGUAGE c AS $fn$ ${corpo} $fn$;`),
    /não é o fim dela/,
  );
  recusa(
    tenantMigration(
      `CREATE OR REPLACE FUNCTION f() RETURNS integer LANGUAGE plpython3u AS $fn$ ${corpo} $fn$;`,
    ),
    /não é o fim dela/,
  );
  recusa(
    tenantMigration(
      `CREATE OR REPLACE FUNCTION f() RETURNS trigger LANGUAGE plpgsql AS $fn$ ${corpo} $fn$ SET search_path = t_vitima;`,
    ),
    /comando SET|não é o fim dela/,
  );
  recusa(
    tenantMigration(
      `CREATE OR REPLACE FUNCTION f() RETURNS trigger LANGUAGE plpgsql AS $fn$ ${corpo} $fn$ COST 100;`,
    ),
    /não é o fim dela/,
  );
  recusa(
    tenantMigration('CREATE OR REPLACE FUNCTION f() RETURNS integer LANGUAGE sql BEGIN ATOMIC SELECT 1; END;'),
    /não é o fim dela|nenhuma forma/,
  );
});

/**
 * Caso 30, e é o `EXE-07`: a forma conferia o alvo e nunca o **nome** criado, então uma migration de
 * `platform` criava schema de cliente sem linha no registro — que o `provision` depois recusa e que
 * ninguém pode desfazer, porque desfazer é `DROP SCHEMA`.
 */
test('CREATE SCHEMA em alvo platform só cria platform', () => {
  const version = 'platform/0001__x';
  recusa(platformMigration('CREATE SCHEMA IF NOT EXISTS t_globex;'), /nome criado seja platform/, version);
  recusa(platformMigration('CREATE SCHEMA IF NOT EXISTS relatorios;'), /nome criado seja platform/, version);
  assert.equal(passa(platformMigration('CREATE SCHEMA IF NOT EXISTS platform;'), version).length, 1);
});

/**
 * Caso 31, e é o `EXE-08`: `$BODY$` é o rótulo que toda ferramenta de banco gera por padrão, e o
 * reconhecedor exigia minúsculo — o corpo era partido no `;` interno e a recusa mandava o autor
 * procurar o defeito na §11.2. O fecho continua sendo o **mesmo texto** do abre: para o Postgres,
 * `$BODY$` e `$body$` são rótulos diferentes.
 */
test('rótulo de cifrão vale em qualquer caixa, e o fecho é o mesmo texto', () => {
  const comandos = passa(
    tenantMigration(
      'CREATE OR REPLACE FUNCTION f() RETURNS trigger LANGUAGE plpgsql AS $BODY$ BEGIN RETURN NEW; END $BODY$;',
    ),
  );
  assert.equal(comandos.length, 1);

  recusa(
    tenantMigration(
      'CREATE OR REPLACE FUNCTION f() RETURNS trigger LANGUAGE plpgsql AS $Body$ BEGIN RETURN NEW; END $body$;',
    ),
    /literal de cifrão "\$Body\$" aberto e não fechado/,
  );
});

/**
 * Caso 35, as três metades da §11.2 e da §11.5 que a implementação tinha deixado implícitas.
 *
 * A view é a **única** forma de interior terminal: `WITH CHECK OPTION` depois da consulta passa por
 * ser interior, não por estar autorizado — ele restringe escrita através da view e não amplia
 * alcance nenhum. O que a forma ancora é a cabeça, e é por isso que um segundo `WITH (…)` antes do
 * `AS` não cabe.
 */
test('a view ancora pela cabeça: WITH CHECK OPTION passa, security_invoker ausente não', () => {
  assert.equal(
    passa(
      tenantMigration(
        'CREATE OR REPLACE VIEW v WITH (security_invoker = true) AS ' +
          'SELECT total FROM orders WITH CHECK OPTION;',
      ),
    ).length,
    1,
  );
  recusa(
    tenantMigration('CREATE OR REPLACE VIEW v AS SELECT total FROM orders;'),
    /security_invoker = true é obrigatória/,
  );
  recusa(
    tenantMigration(
      'CREATE OR REPLACE VIEW v WITH (security_barrier = true) WITH (security_invoker = true) ' +
        'AS SELECT total FROM orders;',
    ),
    /security_invoker = true é obrigatória/,
  );
});

/**
 * Caso 35, segunda metade: `<tipo>` é um identificador só. Função que devolve conjunto é superfície
 * de consulta, e a superfície sancionada é a view — obrigada a `security_invoker` e com o corpo
 * legível no catálogo.
 */
test('RETURNS TABLE e RETURNS SETOF são recusa, e RETURNS numeric(14,2) continua passando', () => {
  const corpo = 'BEGIN RETURN NEW; END';
  recusa(
    tenantMigration(
      `CREATE OR REPLACE FUNCTION f() RETURNS TABLE (total numeric) LANGUAGE plpgsql AS $fn$ ${corpo} $fn$;`,
    ),
    /não é o fim dela/,
  );
  recusa(
    tenantMigration(
      `CREATE OR REPLACE FUNCTION f() RETURNS SETOF orders LANGUAGE plpgsql AS $fn$ ${corpo} $fn$;`,
    ),
    /não é o fim dela/,
  );
  assert.equal(
    passa(
      tenantMigration(
        `CREATE OR REPLACE FUNCTION f() RETURNS numeric(14,2) LANGUAGE plpgsql AS $fn$ ${corpo} $fn$;`,
      ),
    ).length,
    1,
  );
});

/**
 * Caso 35, terceira metade: a recusa alcança literal de propósito (§11.5), e o que a spec exige é
 * que a **mensagem** diga onde a ocorrência está. Sem isso o autor procura no arquivo um comando
 * `SET` que ele não escreveu — e o falso positivo, que é aceito, vira meia hora de procura.
 */
test('palavra de comando dentro de literal é recusa, e a mensagem diz que é literal', () => {
  recusa(
    tenantMigration("COMMENT ON TABLE orders IS 'o operador pode set total, e isso é texto';"),
    /DENTRO DE UM LITERAL/,
  );
  recusa(
    tenantMigration("COMMENT ON TABLE orders IS 'o operador pode set total, e isso é texto';"),
    /trecho: 'o operador pode set total/,
  );

  // Fora de literal, a mensagem continua a de sempre: nada de "dentro de um literal" onde não há um.
  recusa(tenantMigration('ALTER TABLE orders SET SCHEMA t_outro;'), /comando SET/);
  assert.throws(
    () => passa(tenantMigration('ALTER TABLE orders SET SCHEMA outro;')),
    (erro: unknown) => erro instanceof ExecutorError && !/DENTRO DE UM LITERAL/.test(erro.message),
  );
});

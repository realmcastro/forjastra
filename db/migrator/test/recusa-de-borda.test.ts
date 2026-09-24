import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { runExecutor } from './support/executor.js';
import {
  APP_CREDENTIAL_ROLE,
  APP_GROUP_ROLE,
  createDatabase,
  skipWithoutPostgres,
  withClient,
  type DisposableDatabase,
} from './support/postgres.js';
import { buildMigrationsDir, tenantMigration } from './support/tree.js';

/**
 * Caso 44 de `CONTRATO.md` §14. A §7.7 de `db/papel-do-cliente.md`: o ato do operador (§7.2) é
 * precondição do ato do executor, e o executor o confere **antes da primeira escrita**, recusando
 * com saída `2` — que é a metade de precondição de papel do ponto 5 do sexto gate, e até ele estava
 * prometida na `PROVISION-E-VERIFY.md` §12 sem caso que a cobrasse.
 *
 * O caso que dá nome ao arquivo é o `PAP-07`: um `.env` copiado de outra máquina nomeia um papel que
 * não é a credencial da aplicação, e até a §7.7 o `migrate` concedia **todos** os papéis de cliente
 * àquele papel, um por schema visitado, sem erro — enquanto o `verify`, que lê a mesma variável,
 * respondia `conforme`. O teste cobra as duas metades: a recusa, e a ausência de qualquer concessão
 * ao papel nomeado no ambiente.
 *
 * **O executor aqui é superusuário**, ao contrário de `papel-do-cliente.test.ts`. O que está sendo
 * medido é o momento da recusa, não o privilégio de quem a recebe: com superusuário, todos os
 * `GRANT` que a recusa impede **funcionariam**, o que torna a ausência deles prova, e não efeito
 * colateral de falta de privilégio.
 */

const PEDIDOS = tenantMigration(`
CREATE TABLE IF NOT EXISTS orders (
    order_id uuid NOT NULL,
    total numeric(14,2) NOT NULL,
    CONSTRAINT orders_pkey PRIMARY KEY (order_id)
);
`);

/** Os quatro nomes que um ambiente errado pode carregar, e o diagnóstico que cada um pede. */
const FORA_DO_GRUPO = 'ambiente_intruso';
const SEM_LOGIN = 'ambiente_sem_login';
const ADMINISTRA = 'ambiente_administrador';
const INEXISTENTE = 'ambiente_que_nao_existe';

const IMPOSTORES = [FORA_DO_GRUPO, SEM_LOGIN, ADMINISTRA, INEXISTENTE] as const;

describe('a recusa de borda do ato do operador', { skip: skipWithoutPostgres }, () => {
  let db: DisposableDatabase;
  const migrationsDir = buildMigrationsDir({ tenant: [{ name: '0001__orders.sql', text: PEDIDOS }] });

  before(async () => {
    db = await createDatabase();

    for (const slug of ['borda', 'segunda']) {
      const feito = await runExecutor({ kind: 'provision', slug }, { url: db.url, migrationsDir });
      assert.equal(feito.exitCode, 0, feito.error);
    }

    await withClient(db.url, async (client) => {
      await client.query(await citado(client, 'CREATE ROLE %I LOGIN NOINHERIT', FORA_DO_GRUPO));
      await client.query(await citado(client, 'CREATE ROLE %I NOLOGIN', SEM_LOGIN));
      await client.query(await citado(client, `GRANT ${APP_GROUP_ROLE} TO %I`, SEM_LOGIN));
      await client.query(await citado(client, 'CREATE ROLE %I LOGIN NOINHERIT', ADMINISTRA));
      await client.query(
        await citado(client, `GRANT ${APP_GROUP_ROLE} TO %I WITH ADMIN OPTION`, ADMINISTRA),
      );
    });
  });

  after(async () => {
    await withClient(db.url, async (client) => {
      for (const papel of [FORA_DO_GRUPO, SEM_LOGIN, ADMINISTRA]) {
        await client.query(await citado(client, 'DROP ROLE IF EXISTS %I', papel));
      }
    });
    await db.drop();
  });

  /**
   * `PAP-07`, os dois lados: a recusa acontece, e **nada foi concedido** ao nome que veio do
   * ambiente. A segunda metade é a que prova o achado — antes da §7.7, o `migrate` saía `0` com
   * `app_t_borda` e `app_t_segunda` concedidos ao papel pessoal de quem copiou o `.env`.
   */
  test('o nome do ambiente que não é a credencial recusa nos quatro comandos, sem conceder nada', async () => {
    const saudavel = await runExecutor({ kind: 'verify' }, { url: db.url, migrationsDir });
    assert.equal(saudavel.exitCode, 0, `${saudavel.error}\n${saudavel.output}`);

    const diagnostico: Readonly<Record<string, RegExp>> = {
      [FORA_DO_GRUPO]: new RegExp(`não é membro de "${APP_GROUP_ROLE}"`),
      [SEM_LOGIN]: /não tem LOGIN/,
      [ADMINISTRA]: new RegExp(`administra "${APP_GROUP_ROLE}"`),
      [INEXISTENTE]: /não há papel com esse nome/,
    };

    for (const papel of IMPOSTORES) {
      for (const comando of [
        { kind: 'migrate' } as const,
        { kind: 'migrate', schema: 't_borda' } as const,
        { kind: 'verify' } as const,
        { kind: 'provision', slug: 'nunca' } as const,
      ]) {
        const resultado = await runExecutor(comando, {
          url: db.url,
          migrationsDir,
          appCredentialRole: papel,
        });
        const onde = `${papel} · ${comando.kind}`;
        assert.equal(resultado.exitCode, 2, `${onde}: ${resultado.error}\n${resultado.output}`);
        assert.match(resultado.error ?? '', /§7\.2/, onde);
        assert.match(resultado.error ?? '', diagnostico[papel]!, onde);
      }
    }

    // Nenhum papel de cliente foi concedido a nenhum deles: é isto que estava acontecendo antes.
    assert.deepEqual(await concessoesDeClientePara(db.url, IMPOSTORES), []);

    // E o `provision` recusado não deixou cliente registrado nem schema criado.
    await withClient(db.url, async (client) => {
      const registro = await client.query('select 1 from platform.tenants where slug = $1', ['nunca']);
      assert.equal(registro.rowCount, 0);
      const schema = await client.query('select 1 from pg_namespace where nspname = $1', ['t_nunca']);
      assert.equal(schema.rowCount, 0);
    });

    // Com o ambiente correto, tudo segue: a recusa é da borda, não do banco.
    const depois = await runExecutor({ kind: 'verify' }, { url: db.url, migrationsDir });
    assert.equal(depois.exitCode, 0, `${depois.error}\n${depois.output}`);
  });

  /**
   * Sem o grupo, o `provision` morria no passo 7 com `role "forja_app" does not exist` e saída `1`,
   * deixando cliente registrado, schema criado e migrations aplicadas — sem papel; e o `verify`
   * acusava `tenant_role_divergent` em **todos** os clientes, com saída `3`. Agora os dois recusam
   * na borda, nomeando o ato que falta.
   *
   * O grupo é objeto de **cluster** e outros arquivos da suíte dependem dele, então o estado
   * anterior é fotografado e devolvido no `finally`, opção por opção. Quem prova que a devolução
   * ficou completa é o `verify` do fim, que volta a sair `0`.
   */
  test('sem o grupo, os comandos recusam na borda e o verify não acusa divergência em cliente nenhum', async () => {
    const membros = await withClient(db.url, async (client) => {
      const linhas = await client.query<{
        papel: string;
        admin_option: boolean;
        inherit_option: boolean;
        set_option: boolean;
      }>(
        `select m.member::regrole::text as papel, m.admin_option, m.inherit_option, m.set_option
           from pg_auth_members m where m.roleid = to_regrole($1)`,
        [APP_GROUP_ROLE],
      );
      await client.query(await citado(client, 'DROP ROLE %I', APP_GROUP_ROLE));
      return linhas.rows;
    });

    try {
      for (const comando of [
        { kind: 'migrate' } as const,
        { kind: 'migrate', schema: 't_borda' } as const,
        { kind: 'provision', slug: 'nunca' } as const,
      ]) {
        const resultado = await runExecutor(comando, { url: db.url, migrationsDir });
        assert.equal(resultado.exitCode, 2, `${comando.kind}: ${resultado.error}`);
        assert.match(resultado.error ?? '', new RegExp(`o grupo "${APP_GROUP_ROLE}" não existe`));
      }

      const verificacao = await runExecutor({ kind: 'verify' }, { url: db.url, migrationsDir });
      assert.equal(verificacao.exitCode, 2, `${verificacao.error}\n${verificacao.output}`);
      assert.doesNotMatch(verificacao.output, /fora do ato que o cria/);
      assert.doesNotMatch(verificacao.error ?? '', /fora do ato que o cria/);

      // `status` não pergunta nada sobre papel, e por isso não confere nada disto.
      const relato = await runExecutor({ kind: 'status' }, { url: db.url, migrationsDir });
      assert.equal(relato.exitCode, 0, relato.error);
    } finally {
      await withClient(db.url, async (client) => {
        await client.query(await citado(client, 'CREATE ROLE %I NOLOGIN', APP_GROUP_ROLE));
        for (const membro of membros) {
          const grant = await citadoComDois(
            client,
            `GRANT %I TO %I WITH ADMIN ${sim(membro.admin_option)}, ` +
              `INHERIT ${sim(membro.inherit_option)}, SET ${sim(membro.set_option)}`,
            APP_GROUP_ROLE,
            membro.papel,
          );
          await client.query(grant);
        }
      });
    }

    const devolvido = await runExecutor({ kind: 'verify' }, { url: db.url, migrationsDir });
    assert.equal(devolvido.exitCode, 0, `${devolvido.error}\n${devolvido.output}`);
  });

  /** A credencial de verdade continua passando, e ela é o controle positivo de tudo acima. */
  test('a credencial nomeada corretamente atravessa a borda', async () => {
    const resultado = await runExecutor(
      { kind: 'migrate' },
      { url: db.url, migrationsDir, appCredentialRole: APP_CREDENTIAL_ROLE },
    );
    assert.equal(resultado.exitCode, 0, `${resultado.error}\n${resultado.output}`);
  });
});

async function concessoesDeClientePara(
  url: string,
  papeis: readonly string[],
): Promise<readonly string[]> {
  return withClient(url, async (client) => {
    const linhas = await client.query<{ concessao: string }>(
      `select alvo.rolname || ' -> ' || m.member::regrole::text as concessao
         from pg_auth_members m
         join pg_roles alvo on alvo.oid = m.roleid
        where alvo.rolname like 'app\\_t\\_%'
          and m.member::regrole::text = any($1::text[])
        order by 1`,
      [[...papeis]],
    );
    return linhas.rows.map((linha) => linha.concessao);
  });
}

function sim(valor: boolean): string {
  return valor ? 'TRUE' : 'FALSE';
}

async function citado(
  client: import('pg').Client,
  template: string,
  identifier: string,
): Promise<string> {
  const resposta = await client.query<{ command: string }>(
    'select format($1::text, $2::text) as command',
    [template, identifier],
  );
  return resposta.rows[0]!.command;
}

async function citadoComDois(
  client: import('pg').Client,
  template: string,
  first: string,
  second: string,
): Promise<string> {
  const resposta = await client.query<{ command: string }>(
    'select format($1::text, $2::text, $3::text) as command',
    [template, first, second],
  );
  return resposta.rows[0]!.command;
}

import pg from 'pg';

/**
 * Um banco descartável por arquivo de teste, dentro de um Postgres descartável.
 *
 * O que está sendo testado é comportamento do **banco** (`CONTRATO.md` §14: "nenhum contra duplo de
 * teste"), então não há como fugir de um servidor real. Sem ele, o teste é **pulado com motivo** —
 * nunca dado como passado.
 */

export const ADMIN_URL = process.env['FORJA_MIGRATOR_TEST_ADMIN_URL'];

export const skipWithoutPostgres: string | false =
  ADMIN_URL === undefined
    ? 'sem FORJA_MIGRATOR_TEST_ADMIN_URL: não há Postgres contra o qual rodar'
    : false;

export interface DisposableDatabase {
  readonly url: string;
  readonly name: string;
  drop(): Promise<void>;
}

let counter = 0;

/**
 * `adminUrl` existe para o teste do piso de versão, que precisa de um banco limpo num servidor
 * **antigo**. Banco por teste, e não um banco compartilhado: estado deixado por um teste anterior é
 * o jeito mais barato de um teste passar por engano.
 */
/**
 * O grupo e a credencial da aplicação (`db/papel-do-cliente.md` §7.2). São **ato do operador**, não
 * do executor, e por isso o teste os cria: sem eles, o passo 7 do `provision` não tem a quem
 * conceder o papel do cliente.
 *
 * Papel é objeto de **cluster**, não de banco: o `forja_app` de um banco descartável é o mesmo de
 * todos os outros. É daí que vem o `--test-concurrency=1` do `package.json` — dois arquivos de teste
 * provisionando o mesmo slug em bancos diferentes disputariam o mesmo `app_t_<slug>`.
 */
export const APP_GROUP_ROLE = 'forja_app';
export const APP_CREDENTIAL_ROLE = 'forja_credencial';

export async function createDatabase(adminUrl: string | undefined = ADMIN_URL): Promise<DisposableDatabase> {
  if (adminUrl === undefined) throw new Error('URL de administração ausente');
  counter += 1;
  const name = `forja_migrator_${process.pid}_${counter}`;

  const admin = new pg.Client({ connectionString: adminUrl });
  await admin.connect();
  try {
    const created = await admin.query<{ command: string }>('select format($1::text, $2::text) as command', [
      'CREATE DATABASE %I',
      name,
    ]);
    await admin.query(created.rows[0]!.command);
    await ensureAppRoles(admin);
  } finally {
    await admin.end();
  }

  const url = new URL(adminUrl);
  url.pathname = `/${name}`;

  return {
    url: url.toString(),
    name,
    async drop(): Promise<void> {
      const client = new pg.Client({ connectionString: adminUrl });
      await client.connect();
      try {
        const dropped = await client.query<{ command: string }>('select format($1::text, $2::text) as command', [
          'DROP DATABASE IF EXISTS %I WITH (FORCE)',
          name,
        ]);
        await client.query(dropped.rows[0]!.command);
        await dropTenantRoles(client);
      } finally {
        await client.end();
      }
    },
  };
}

/**
 * Idempotente, porque o papel sobrevive ao banco: a segunda chamada encontra os dois criados e não
 * faz nada. A credencial nasce **sem senha**, e é por isso que o servidor de teste precisa ser
 * descartável e de autenticação `trust` — senha em arquivo de teste é segredo no repositório
 * (`00-nucleo.md` §8).
 */
async function ensureAppRoles(admin: pg.Client): Promise<void> {
  const existentes = await admin.query<{ rolname: string }>(
    'select rolname from pg_roles where rolname = any($1::text[])',
    [[APP_GROUP_ROLE, APP_CREDENTIAL_ROLE]],
  );
  const tem = new Set(existentes.rows.map((linha) => linha.rolname));

  if (!tem.has(APP_GROUP_ROLE)) {
    await admin.query(await rendered(admin, 'CREATE ROLE %I NOLOGIN', APP_GROUP_ROLE));
  }
  if (!tem.has(APP_CREDENTIAL_ROLE)) {
    await admin.query(await rendered(admin, 'CREATE ROLE %I LOGIN NOINHERIT', APP_CREDENTIAL_ROLE));
    await admin.query(
      await rendered(admin, `GRANT ${APP_GROUP_ROLE} TO %I`, APP_CREDENTIAL_ROLE),
    );
  }
}

/**
 * O papel do cliente sobrevive ao banco que o motivou, e o nome dele vem do slug: sem esta limpeza,
 * a segunda rodada da suíte encontraria `app_t_acme` de pé e o passo 7 recusaria com saída `3`.
 * Roda **depois** do `DROP DATABASE`, porque é ele que leva embora os privilégios que impediriam a
 * remoção do papel.
 */
async function dropTenantRoles(client: pg.Client): Promise<void> {
  const papeis = await client.query<{ rolname: string }>(
    "select rolname from pg_roles where rolname like 'app\\_t\\_%'",
  );
  for (const { rolname } of papeis.rows) {
    try {
      await client.query(await rendered(client, 'DROP ROLE %I', rolname));
    } catch {
      // Papel com privilégio em outro banco vivo não sai daqui, e não é defeito do teste que o
      // pediu: quem o criou o derruba quando o banco dele cair.
    }
  }
}

async function rendered(client: pg.Client, template: string, identifier: string): Promise<string> {
  const resposta = await client.query<{ command: string }>(
    'select format($1::text, $2::text) as command',
    [template, identifier],
  );
  return resposta.rows[0]!.command;
}

export async function withClient<T>(url: string, body: (client: pg.Client) => Promise<T>): Promise<T> {
  const client = new pg.Client({ connectionString: url });
  await client.connect();
  try {
    return await body(client);
  } finally {
    await client.end();
  }
}

export async function scalar<T>(url: string, sql: string, values: readonly unknown[] = []): Promise<T | undefined> {
  return withClient(url, async (client) => {
    const result = await client.query(sql, [...values]);
    const row = result.rows[0] as Record<string, unknown> | undefined;
    if (row === undefined) return undefined;
    return Object.values(row)[0] as T;
  });
}

/** A URL de `base` com outro papel no lugar do usuário, e sem senha. */
export function comoPapel(base: string, papel: string): string {
  const url = new URL(base);
  url.username = papel;
  url.password = '';
  return url.toString();
}

/** `format('%I')` no servidor: identificador citado por quem sabe citar (`APLICACAO-E-ALVO.md` §10.3.0). */
export async function citado(
  client: pg.Client,
  template: string,
  identifier: string,
): Promise<string> {
  const resposta = await client.query<{ command: string }>(
    'select format($1::text, $2::text) as command',
    [template, identifier],
  );
  return resposta.rows[0]!.command;
}

export function codigo(erro: unknown): string | undefined {
  if (typeof erro !== 'object' || erro === null || !('code' in erro)) return undefined;
  const code = (erro as { code?: unknown }).code;
  return typeof code === 'string' ? code : undefined;
}

function mensagem(erro: unknown): string {
  return erro instanceof Error ? erro.message : String(erro);
}

const MOTIVO =
  'o servidor de teste não aceita papel sem senha: rode-o com POSTGRES_HOST_AUTH_METHOD=trust. ' +
  'Senha em teste seria segredo no repositório (00-nucleo.md §8).';

/**
 * Autenticação é do ambiente, não do teste: sem `trust`, papel sem senha não conecta, e os arquivos
 * que dependem de um executor não-superusuário deixam de ser mensuráveis. O motivo é dito, e nada é
 * dado como passado.
 *
 * **Duas formas, e a segunda é o `PAP-17`.** Quando o servidor exige senha, o erro nem sempre vem do
 * servidor: com `scram-sha-256` — o padrão de qualquer `postgres:16` sem
 * `POSTGRES_HOST_AUTH_METHOD=trust` — o `pg` falha **do lado do cliente**, antes do protocolo, com
 * `SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string` e **sem `code`**. Medido: com
 * o guarda cobrindo só `28000` e `28P01`, o erro era relançado, o `before` caía, e a suíte imprimia
 * `# fail 0` com nove testes **cancelados** e saída `1`. `# fail 0` é a linha que se lê primeiro, e
 * ela mentia sobre a camada inteira.
 */
export async function motivoDeNaoConectar(
  ...urls: readonly string[]
): Promise<string | undefined> {
  for (const url of urls) {
    try {
      await withClient(url, async () => undefined);
    } catch (causa) {
      const code = codigo(causa);
      if (code === '28000' || code === '28P01') return MOTIVO;
      // Sem `code` é erro do cliente, não do servidor: só a exigência de senha é motivo de pular.
      if (code === undefined && /password/i.test(mensagem(causa))) return MOTIVO;
      throw causa;
    }
  }
  return undefined;
}

/** Quantas linhas de um tipo de evento existem em `platform.executor_events`. */
export async function eventos(url: string, kind: string): Promise<number> {
  return withClient(url, async (client) => {
    const resultado = await client.query<{ total: string }>(
      'select count(*)::text as total from platform.executor_events where kind_code = $1',
      [kind],
    );
    return Number.parseInt(resultado.rows[0]?.total ?? '0', 10);
  });
}

import pg from 'pg';
import type { MigratorConfig } from './config.js';
import { applyFailed, refused } from './errors.js';

/**
 * Sessão do executor: `APLICACAO-E-ALVO.md` §6.
 *
 * Toda conexão abre com os quatro parâmetros, nesta ordem. `statement_timeout` é `0` de propósito:
 * um DDL que está **progredindo** não deve ser morto, e do que está **esperando** lock cuida o
 * `lock_timeout` — que não tem padrão implícito e vem de configuração.
 */

export const APPLICATION_NAME = 'forja-migrator';

export interface Session {
  readonly client: pg.Client;
  /** O sujeito que o executor conhece (`IMUTABILIDADE-E-FATOS.md` §19.2). Nunca uma pessoa. */
  readonly dbRole: string;
  end(): Promise<void>;
}

export async function openSession(config: MigratorConfig): Promise<Session> {
  const client = new pg.Client({
    connectionString: config.connectionString,
    connectionTimeoutMillis: config.connectionTimeoutMs,
    application_name: APPLICATION_NAME,
  });
  await client.connect();

  await client.query("select set_config('lock_timeout', $1, false)", [
    String(config.lockTimeoutMs),
  ]);
  await client.query("select set_config('statement_timeout', '0', false)");
  await client.query("select set_config('idle_in_transaction_session_timeout', $1, false)", [
    String(config.idleInTransactionTimeoutMs),
  ]);
  await client.query("select set_config('application_name', $1, false)", [APPLICATION_NAME]);

  const role = await client.query<{ current_user: string }>('select current_user');
  const dbRole = role.rows[0]?.current_user ?? 'desconhecido';

  return {
    client,
    dbRole,
    async end() {
      await client.end();
    },
  };
}

/**
 * Piso de versão do servidor, conferido na entrada (§6).
 *
 * **Subiu de 15 para 16 em 2026-09-11** (`db/convencoes.md` §9). Quem fixava o 15 era a view com
 * `security_invoker`, obrigatória em toda view de migration (`RECUSAS.md` §11.2), que um servidor 14
 * recusa com `unrecognized parameter`. Quem fixa o 16 é o `CREATEROLE` que o executor passou a
 * carregar para criar o papel de banco do cliente (`db/papel-do-cliente.md` §7.6): medido em 15.19,
 * esse atributo alcança **todo** papel não-superusuário do cluster, e o executor trocou a senha da
 * credencial da aplicação e se tornou membro dela; em 16.15 o servidor recusa os dois atos.
 *
 * Conferir custa uma consulta sem privilégio nenhum, antes de o primeiro schema ser tocado.
 * Descobrir no meio custa uma frota parcialmente aplicada, e a mensagem que o servidor daria não
 * nomeia a causa.
 */
export const MINIMUM_SERVER_VERSION_NUM = 160_000;

export async function assertServerVersion(client: pg.Client): Promise<void> {
  const resposta = await client.query<{ num: string; texto: string }>(
    "select current_setting('server_version_num') as num, current_setting('server_version') as texto",
  );
  const linha = resposta.rows[0];
  if (linha === undefined) {
    throw refused('o servidor não respondeu server_version_num, e o piso de versão não pôde ser conferido');
  }
  const encontrado = Number.parseInt(linha.num, 10);
  if (Number.isNaN(encontrado) || encontrado < MINIMUM_SERVER_VERSION_NUM) {
    throw refused(
      `PostgreSQL ${linha.texto} (server_version_num ${linha.num}) está abaixo do piso ` +
        `${MINIMUM_SERVER_VERSION_NUM}, que é o 16 de db/convencoes.md §9. Nada foi aplicado.`,
    );
  }
}

/**
 * Citação de identificador **no servidor**: `APLICACAO-E-ALVO.md` §10.3.0.
 *
 * O nome atravessa como *bind parameter*, quem o transforma em identificador é o Postgres, e o
 * texto devolvido é enviado verbatim. Nenhuma linha de composição no cliente, porque esta é a linha
 * exata onde o isolamento de tenant cai: medido com o slug hostil `t_x"; DROP TABLE probe.alvo; --`,
 * o servidor devolveu o nome inteiro citado e nenhum comando extra rodou.
 *
 * `CREATE SCHEMA` não aceita parâmetro na posição do identificador (medido: erro de sintaxe), e é
 * por isso que este caminho existe. Ele serve também aos dois outros comandos do executor que
 * precisam de nome dentro do texto: `DROP INDEX CONCURRENTLY` da limpeza (§8, qualificado pelo
 * namespace alvo) e `DROP SCHEMA` do descartável do `verify` (§13.2, passo 7).
 */
export async function renderCommand(
  client: pg.Client,
  template: string,
  identifier: string,
): Promise<string> {
  const rendered = await client.query<{ command: string }>('select format($1::text, $2::text) as command', [
    template,
    identifier,
  ]);
  const command = rendered.rows[0]?.command;
  if (command === undefined || command === '') {
    throw applyFailed(`o servidor não devolveu o comando citado para "${template}"`);
  }
  return command;
}

export async function renderCommandWithTwoIdentifiers(
  client: pg.Client,
  template: string,
  first: string,
  second: string,
): Promise<string> {
  const rendered = await client.query<{ command: string }>('select format($1::text, $2::text, $3::text) as command', [
    template,
    first,
    second,
  ]);
  const command = rendered.rows[0]?.command;
  if (command === undefined || command === '') {
    throw applyFailed(`o servidor não devolveu o comando citado para "${template}"`);
  }
  return command;
}

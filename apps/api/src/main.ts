import { loadConfig, ConfigError } from './config.js';
import { createPool, createRootDb } from './db/pool.js';
import { assertAppCredential, AppCredentialError } from './db/app-credential.js';
import { buildServer } from './http/server.js';

/** `EX_CONFIG`. O mundo que o processo aponta não é o que ele exige — ver o `catch` no fim. */
const EXIT_CONFIG = 78;

async function main(): Promise<void> {
  const config = loadConfig();
  const pool = createPool(config.database);
  const rootDb = createRootDb(pool);

  /**
   * **A porta não abre antes desta pergunta** (`F-003`). Ela é uma consulta ao catálogo sobre a
   * própria credencial, uma vez por processo, e é o gêmeo do que o executor já faz antes da
   * primeira escrita (`db/papel-do-cliente.md` §7.7).
   *
   * Ela também é a primeira ida ao banco do processo, então recusar aqui cobre o caso em que o
   * banco sequer responde — antes, isso aparecia na primeira requisição de um caixa.
   */
  try {
    await assertAppCredential(rootDb);
  } catch (error: unknown) {
    // Sem isto o pool segura o laço de eventos e o processo recusado não termina.
    await rootDb.destroy();
    throw error;
  }

  const app = buildServer({
    http: config.http,
    rootDb,
    logLevel: config.logLevel,
  });

  // Enquanto `D-03` estiver aberta, o servidor sobe sem nenhum provedor de identidade e toda
  // rota não anônima é recusada. Dizer isso na subida é o que evita alguém descobrir pelo 401.
  app.log.warn(
    'D-03 aberta: nenhum provedor de identidade registrado. Toda rota não anônima responde identity_not_established.',
  );

  const close = async (signal: string): Promise<void> => {
    app.log.info({ signal }, 'encerrando');
    await app.close();
    await rootDb.destroy();
    process.exit(0);
  };
  process.on('SIGTERM', () => void close('SIGTERM'));
  process.on('SIGINT', () => void close('SIGINT'));

  await app.listen({ host: config.http.host, port: config.http.port });
}

main().catch((error: unknown) => {
  if (error instanceof ConfigError) {
    process.stderr.write(`configuração inválida: ${error.message}\n`);
    process.exit(EXIT_CONFIG);
  }

  /**
   * Mesmo código de saída da configuração ausente, de propósito: os dois desfechos se fecham com
   * a mesma classe de ato humano — corrigir o parâmetro ou rodar `db/papel-do-cliente.md` §7.2 —
   * e a conferência nem sempre consegue separar um do outro (grupo inexistente e chave apontando
   * para outro cluster produzem a mesma resposta). Quem separa é a mensagem, que nomeia a
   * pergunta que falhou.
   *
   * `exitCode` em vez de `exit`: o fato de subida acabou de sair pela saída padrão, e o Node
   * documenta que `process.exit` pode truncar escrita ainda pendente ali. O pool já foi destruído, então o laço de
   * eventos drena sozinho e o processo termina logo depois desta linha.
   */
  if (error instanceof AppCredentialError) {
    process.stderr.write(`recusa na subida: ${error.message}\n`);
    process.exitCode = EXIT_CONFIG;
    return;
  }

  process.stderr.write(`falha ao subir: ${error instanceof Error ? error.stack : String(error)}\n`);
  process.exit(1);
});

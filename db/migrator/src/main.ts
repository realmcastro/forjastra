import { parseCommand } from './cli.js';
import { loadConfig } from './config.js';
import { run } from './executor.js';
import { EXIT_APPLY_FAILED, EXIT_OK, ExecutorError } from './errors.js';

/** O ponto de entrada do processo: só argv, configuração, saída e código de saída (§12). */

async function main(): Promise<number> {

  try {
    const command = parseCommand(process.argv.slice(2));
    const config = loadConfig();
    await run(command, { config, report: (message) => process.stdout.write(`${message}\n`) });
    return EXIT_OK;
  } catch (cause) {
    if (cause instanceof ExecutorError) {
      process.stderr.write(`${cause.message}\n`);
      return cause.exitCode;
    }
    process.stderr.write(`${cause instanceof Error ? cause.stack ?? cause.message : cause}\n`);
    return EXIT_APPLY_FAILED;
  }
}

process.exitCode = await main();

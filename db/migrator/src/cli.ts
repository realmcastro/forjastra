import type { Command } from './executor.js';
import { refused } from './errors.js';

/**
 * A linha de comando. `PROVISION-E-VERIFY.md` §12 fixa os quatro subcomandos.
 *
 * O executor não decide sozinho o que fazer quando a entrada não é reconhecida: recusa, com saída
 * `2`, sem abrir conexão.
 *
 * Isto mora fora de `main.ts` porque `main.ts` **roda** ao ser importado, e teste que importa o
 * analisador não deve disparar o processo.
 */

const USAGE = `uso:
  migrate [--schema t_<slug>]   aplica o pendente em platform e nos schemas registrados
  status                        lista, por schema, o aplicado e o pendente
  provision <slug>              registra o cliente, cria o schema dele e aplica o núcleo
  verify                        compara cada schema com a referência`;

export function parseCommand(argv: readonly string[]): Command {
  const [name, ...rest] = argv;
  switch (name) {
    case 'migrate': {
      if (rest.length === 0) return { kind: 'migrate' };
      if (rest.length === 2 && rest[0] === '--schema') {
        return { kind: 'migrate', schema: rest[1]! };
      }
      throw refused(`migrate aceita apenas --schema t_<slug>\n${USAGE}`);
    }
    case 'status':
      if (rest.length > 0) throw refused(`status não aceita argumento\n${USAGE}`);
      return { kind: 'status' };
    case 'provision': {
      const slug = rest[0];
      if (rest.length !== 1 || slug === undefined) {
        throw refused(`provision espera um slug\n${USAGE}`);
      }
      return { kind: 'provision', slug };
    }
    case 'verify':
      if (rest.length > 0) throw refused(`verify não aceita argumento\n${USAGE}`);
      return { kind: 'verify' };
    default:
      throw refused(`comando desconhecido: "${name ?? '(nenhum)'}"\n${USAGE}`);
  }
}

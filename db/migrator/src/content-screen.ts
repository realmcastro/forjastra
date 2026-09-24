import { contentScreen } from './refusals.js';
import type { MigrationHeader } from './header.js';

/**
 * O crivo de conteúdo da §11 (`db/migrator/RECUSAS.md`): o ponto de extensão e a implementação dele.
 *
 * O crivo é **obrigatório**. `loader.ts` recusa a rodada quando ele não existe, e essa trava fica de
 * pé mesmo agora que a implementação existe: sem crivo, um único `DROP SCHEMA t_vitima CASCADE` em
 * arquivo de migration atravessa o executor inteiro — foi o `MIG-03`, medido.
 *
 * O que a implementação entrega, e é a §11 inteira:
 *
 * 1. §11.1 — remover comentários, preservar literais, recusar a aspa dupla, normalizar para
 *    minúscula antes de comparar, separar os comandos pelo `;` fora de literal, e classificar cada
 *    comando **pela forma inteira**;
 * 2. §11.2 — a lista de permissão, com o que cada forma não pode conter;
 * 3. §11.3 — a fronteira de schema, pela lista fechada de qualificadores, nos dois alvos, sobre a
 *    cópia normalizada e sobre o comando inteiro, literais inclusive;
 * 4. §11.4 — as recusas de cabeçalho que dependem do corpo;
 * 5. §11.5 — as formas proibidas em qualquer posição.
 *
 * A recusa é `ExecutorError` com saída `2`, nomeando arquivo e trecho. O retorno de sucesso são os
 * **comandos separados**, que o regime não-transacional emite um a um (`APLICACAO-E-ALVO.md`
 * §10.3.2, passo 3). O regime transacional não os usa: ele envia o texto do arquivo verbatim,
 * dentro da transação, para que a separação de comandos não fique entre o autor e o servidor.
 */

export interface ScreenInput {
  /** `CONTRATO.md` §1: caminho relativo a `db/migrations/`, sem `.sql`. */
  readonly version: string;
  readonly text: string;
  readonly header: MigrationHeader;
}

export interface ContentScreen {
  /** Devolve os comandos separados, ou lança `ExecutorError` com saída `2` (§11). */
  screen(input: ScreenInput): readonly string[];
}

/**
 * O crivo da §11. Nunca devolva `undefined` daqui para "destravar" nada: `loader.ts` transforma
 * `undefined` em recusa da rodada, e é isso que impede o executor de aplicar arquivo que ninguém
 * leu.
 */
export function resolveContentScreen(): ContentScreen | undefined {
  return contentScreen;
}

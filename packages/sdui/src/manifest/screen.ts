/**
 * Degradação: **rede → cache local → piso embutido**, nesta ordem e sem pular etapa
 * (`ui.md` §1, `tolerancia-de-versao.md` §4.4).
 *
 * ```
 * resposta da rede
 * → análise
 * → aproveitável? tela da rede, e só então guarda no cache
 * → inaproveitável ou rede fora? análise do cache
 * → cache inaproveitável ou ausente? piso embutido
 * ```
 *
 * **Resposta inaproveitável não é cacheada.** Senão o defeito congela naquele terminal e a
 * degradação passa a servir dado quebrado para sempre — exatamente quando a rede cair, que é
 * quando o cache existe para servir.
 *
 * Esta camada é pura: ela **decide**, não faz E/S. Quem busca na rede e quem escreve no
 * armazenamento é o acompanhante; o que ele precisa saber está em `cacheWrite`.
 */

import type { Discard, Placed } from './types.js';
import { parseManifest, type UnusableReason } from './parse.js';

export type NetworkResult =
  | { readonly status: 'received'; readonly body: unknown }
  | { readonly status: 'unreachable' };

export type CachedManifest = {
  /** O corpo **como chegou**, não a árvore analisada: cliente novo reinterpreta manifesto velho. */
  readonly body: unknown;
  /** Instante da captura, `AAAA-MM-DDTHH:mm:ssZ`. Conteúdo fora da rede declara o instante. */
  readonly capturedAt: string;
};

export type ScreenOrigin = 'network' | 'cache' | 'floor';

export type Screen = {
  readonly origin: ScreenOrigin;
  readonly nodes: readonly Placed[];
  /**
   * Conteúdo que não veio da rede é `state.stale` e declara o instante (lei 15). O piso
   * embutido não é `stale`: ele não apresenta dado de fonte nenhuma.
   */
  readonly stale: boolean;
  readonly capturedAt: string | null;
};

export type CacheWrite =
  | { readonly action: 'store'; readonly body: unknown }
  | { readonly action: 'none'; readonly reason: 'no-response' | 'unusable-response' };

export type Degradation = {
  readonly screen: Screen;
  readonly cacheWrite: CacheWrite;
  /** Diagnóstico interno do que foi descartado no caminho, em ordem. */
  readonly discards: readonly Discard[];
  /** Por que a rede não serviu, quando não serviu. */
  readonly networkRefusedBecause: UnusableReason | 'unreachable' | null;
};

/**
 * O piso embutido. Carrega **só** `block.connection-status`, que tem de existir inclusive
 * quando não há manifesto nenhum (`PN-15`: o terminal não fica mudo).
 *
 * **V-05 está aberta** (`vocabulario-e-eixos.md` §6): se o piso embutido vende, ele é uma
 * composição fixa de papéis, e essa composição é contrato (`PN-06`). Enquanto a lacuna não
 * fechar, o piso informa e não vende — e informar de menos é recuperável, vender errado não.
 */
export const EMBEDDED_FLOOR: readonly Placed[] = [
  {
    resolution: 'block',
    zone: 'zone.anchor-top',
    node: {
      kind: 'block.connection-status',
      ordinal: 0,
      source: null,
      props: {},
      children: [],
    },
  },
];

export function resolveScreen(input: {
  readonly network: NetworkResult;
  readonly cache: CachedManifest | null;
}): Degradation {
  const discards: Discard[] = [];

  if (input.network.status === 'received') {
    const outcome = parseManifest(input.network.body);
    discards.push(...outcome.discards);
    if (outcome.status === 'usable') {
      return {
        screen: { origin: 'network', nodes: outcome.nodes, stale: false, capturedAt: null },
        cacheWrite: { action: 'store', body: input.network.body },
        discards,
        networkRefusedBecause: null,
      };
    }
    return fromCache(input.cache, discards, outcome.reason, {
      action: 'none',
      reason: 'unusable-response',
    });
  }

  return fromCache(input.cache, discards, 'unreachable', { action: 'none', reason: 'no-response' });
}

function fromCache(
  cache: CachedManifest | null,
  discards: Discard[],
  networkRefusedBecause: UnusableReason | 'unreachable',
  cacheWrite: CacheWrite,
): Degradation {
  if (cache !== null) {
    const outcome = parseManifest(cache.body);
    discards.push(...outcome.discards);
    if (outcome.status === 'usable') {
      return {
        screen: {
          origin: 'cache',
          nodes: outcome.nodes,
          stale: true,
          capturedAt: cache.capturedAt,
        },
        cacheWrite,
        discards,
        networkRefusedBecause,
      };
    }
  }

  return {
    screen: { origin: 'floor', nodes: EMBEDDED_FLOOR, stale: false, capturedAt: null },
    cacheWrite,
    discards,
    networkRefusedBecause,
  };
}

/**
 * Despacho **tipado**, com piso garantido pelo tipo.
 *
 * Mapa `kind → Component` com tipo genérico é proibido (`ui.md` §1, lei 12): ele apaga a
 * checagem de props exatamente onde o dado vem da rede, que é o único lugar onde a checagem
 * valia alguma coisa.
 *
 * Três propriedades que estão no **tipo**, não no costume:
 *
 * 1. `BlockRenderers<T>` é total sobre `BlockKind`. Papel novo no vocabulário quebra a
 *    compilação de quem despacha — é assim que "bloco novo exige deploy do cliente" deixa de
 *    ser combinado e vira erro de build.
 * 2. `block.fallback` é membro obrigatório da mesma tabela, então **piso opcional não
 *    existe**.
 * 3. `dispatchSlot` devolve `T`, nunca `T | undefined` e nunca por exceção: id desconhecido
 *    morreu na análise (virou piso ou sumiu), então ele não chega aqui.
 *
 * **O que o tipo não alcança, e é melhor estar escrito:** TypeScript não tem tipo de objeto
 * exato, então um `Record<string, (node: unknown) => T>` declarado à parte continua
 * atribuível a `BlockRenderers<T>`. Tabela escrita como literal — que é como se escreve uma —
 * é barrada pela checagem de propriedade excedente; o buraco só abre para quem alarga o tipo
 * de propósito. A lei 12 é cobrada na revisão nesse caso, não pelo compilador.
 */

import type { BlockKind } from '../vocabulary/block-kinds.js';
import type { ManifestNode, NodeOf, Slotted } from './types.js';

export type BlockRenderers<T> = {
  readonly [K in BlockKind]: (node: NodeOf<K>) => T;
};

/** Piso sem origem: existe para o caminho que o compilador já prova impossível. */
const ANONYMOUS_FLOOR: NodeOf<'block.fallback'> = {
  kind: 'block.fallback',
  ordinal: 0,
  source: null,
  props: {},
  children: [],
};

export function dispatchSlot<T>(slot: Slotted, renderers: BlockRenderers<T>): T {
  if (slot.resolution === 'floor') return renderers['block.fallback'](slot.node);
  return dispatchNode(slot.node, renderers);
}

/**
 * O `switch` é o mecanismo, e ele é deliberado: cada ramo chama o renderizador **daquele**
 * papel com o nó **daquele** papel, e o compilador confere as props ramo a ramo.
 */
export function dispatchNode<T>(node: ManifestNode, renderers: BlockRenderers<T>): T {
  switch (node.kind) {
    case 'block.region':
      return renderers['block.region'](node);
    case 'block.record-collection':
      return renderers['block.record-collection'](node);
    case 'block.record-summary':
      return renderers['block.record-summary'](node);
    case 'block.entry':
      return renderers['block.entry'](node);
    case 'block.option-set':
      return renderers['block.option-set'](node);
    case 'block.command':
      return renderers['block.command'](node);
    case 'block.fallback':
      return renderers['block.fallback'](node);
    case 'block.connection-status':
      return renderers['block.connection-status'](node);
    default: {
      // Papel sem ramo próprio não compila: aqui `node` é `never`. Em execução, um terminal
      // com registro e despacho divergentes ainda assim não pode ficar sem tela — então o
      // caminho impossível cai no piso, não em exceção.
      const semRamo: never = node;
      void semRamo;
      return renderers['block.fallback'](ANONYMOUS_FLOOR);
    }
  }
}

/**
 * A ação é oferecida? Só `block.command` entendido oferece. Piso nunca oferece — o terminal
 * não sabe o que a ação faz, então não a oferece (`tolerancia-de-versao.md` §4.3, item 4).
 */
export function offersAction(slot: Slotted): boolean {
  return slot.resolution === 'block' && slot.node.kind === 'block.command';
}

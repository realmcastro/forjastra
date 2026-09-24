/**
 * Os nomes dos campos do nó, em um lugar só.
 *
 * **V-02 está aberta** (`vocabulario-e-eixos.md` §6): o nome dos campos do manifesto é
 * contrato de `backend`, e não foi fixado. Os nomes abaixo são provisórios e existem para o
 * analisador poder ser escrito e provado agora; `kind` e `source` não são invenção deste
 * arquivo, a prosa do sistema de design já os nomeia (`ui.md` §1, §2.1).
 *
 * Ficam aqui, e não espalhados pelo analisador, por uma razão de custo: quando `backend`
 * fechar V-02, a resposta é uma edição neste arquivo e um teste que falha — e não uma
 * varredura por literais de string.
 *
 * O campo de **criticidade do slot** (§2.1), que também é V-02, deliberadamente **não** tem
 * nome aqui: o analisador não precisa dele. A zona já diz o que ele precisa saber — a zona
 * de ação crítica é `zone.anchor-bottom` —, e criticidade entra na derivação de densidade,
 * que é resolução de variante (`SPR-47`), não análise.
 */
export const WIRE = {
  /** Raiz: a lista de nós da tela. */
  nodes: 'nodes',
  /** Id do papel de bloco, do vocabulário fechado. */
  kind: 'kind',
  /** Zona de layout. Só na raiz: filho herda a zona do pai. */
  zone: 'zone',
  /** Posição dentro da zona (raiz) ou dentro do pai (filho). É contrato (`PN-06`). */
  ordinal: 'ordinal',
  /** Fonte de dado do bloco. Opaca para o analisador: nunca é interpretada. */
  source: 'source',
  /** Dado escalar que o bloco apresenta ou usa. Nunca expressão, nunca código. */
  props: 'props',
  /** Nós filhos, nos slots do bloco. */
  children: 'children',
} as const;

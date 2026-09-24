/**
 * Os manifestos hostis, **nomeados um a um**.
 *
 * O servidor que emite manifesto não existe (`apps/api` não tem rota de negócio), então a
 * prova vem daqui. "Usar mock" não seria resposta: cada entrada abaixo é um caso com desfecho
 * afirmado no teste que a consome.
 *
 * Os literais são **texto**, de propósito. É assim que o teste também cobre os nomes de campo
 * do nó (`WIRE`, V-02 em aberto): se alguém trocar um nome no analisador e esquecer do resto,
 * um teste falha em vez de o manifesto silenciosamente virar tela vazia.
 */

/** 1. Manifesto válido: região com dois filhos no fluxo, mais uma ação na zona crítica. */
export const MANIFESTO_VALIDO = JSON.stringify({
  nodes: [
    {
      kind: 'block.region',
      zone: 'zone.flow',
      ordinal: 0,
      children: [
        { kind: 'block.entry', ordinal: 0, props: { label: 'codigo' } },
        { kind: 'block.record-collection', ordinal: 1, source: 'sale.items' },
      ],
    },
    { kind: 'block.command', zone: 'zone.anchor-bottom', ordinal: 0, props: { label: 'cobrar' } },
  ],
});

/** 2. JSON malformado: vírgula dobrada e colchete sem fechar. */
export const JSON_MALFORMADO = '{"nodes": [{"kind": "block.region",, "zone": "zone.flow"}';

/** 3. Campo truncado: a resposta acabou no meio de um nó (conexão caiu no meio do corpo). */
export const CAMPO_TRUNCADO = '{"nodes":[{"kind":"block.region","zone":"zone.flow","ordi';

/** 4. Tipo desconhecido entre tipos válidos: o irmão bom tem de sobreviver. */
export const TIPO_DESCONHECIDO_ENTRE_VALIDOS = JSON.stringify({
  nodes: [
    { kind: 'block.timeline', zone: 'zone.flow', ordinal: 0 },
    { kind: 'block.record-summary', zone: 'zone.flow', ordinal: 1, source: 'sale.totals' },
    { kind: 'block.heat-map', zone: 'zone.flow', ordinal: 2 },
  ],
});

/** 5. Versão futura: campos que hoje não existem, na raiz, no nó e nas props. */
export const VERSAO_FUTURA = JSON.stringify({
  manifestVersion: 7,
  emittedAt: '2027-01-04T12:00:00Z',
  nodes: [
    {
      kind: 'block.entry',
      zone: 'zone.flow',
      ordinal: 0,
      criticality: 'critical',
      slots: { leading: 'glyph' },
      props: { label: 'codigo', autoFocus: true },
    },
  ],
});

/** 6. Nó de papel conhecido com props erradas: lista de objetos onde só cabe escalar. */
export const PROPS_ERRADAS = JSON.stringify({
  nodes: [
    {
      kind: 'block.record-summary',
      zone: 'zone.flow',
      ordinal: 0,
      props: { fields: [{ name: 'total' }] },
    },
    { kind: 'block.entry', zone: 'zone.flow', ordinal: 1 },
  ],
});

/** 7. Props com chave envenenada: `__proto__` não é prop estranha, é tentativa. */
export const PROPS_ENVENENADAS = '{"nodes":[{"kind":"block.entry","zone":"zone.flow","ordinal":0,"props":{"__proto__":{"pwned":true}}}]}';

/** 8. Nó válido entre dois inválidos, todos em `zone.flow`. */
export const VALIDO_ENTRE_DOIS_INVALIDOS = JSON.stringify({
  nodes: [
    { kind: 'block.region', zone: 'zone.flow' },
    { kind: 'block.entry', zone: 'zone.flow', ordinal: 1 },
    'isto nem objeto é',
  ],
});

/** 9. Id desconhecido na zona de ação crítica, com um irmão bom no fluxo. */
export const ID_DESCONHECIDO_EM_ZONA_CRITICA = JSON.stringify({
  nodes: [
    { kind: 'block.region', zone: 'zone.flow', ordinal: 0 },
    { kind: 'block.settle-payment', zone: 'zone.anchor-bottom', ordinal: 0 },
  ],
});

/** 10. Papel conhecido na zona que não o admite: só `block.command` ocupa a zona crítica. */
export const PAPEL_PROIBIDO_NA_ZONA_CRITICA = JSON.stringify({
  nodes: [
    { kind: 'block.region', zone: 'zone.flow', ordinal: 0 },
    { kind: 'block.record-collection', zone: 'zone.anchor-bottom', ordinal: 0 },
  ],
});

/** 11. Manifesto vazio: a lista existe e não tem nenhum nó. */
export const MANIFESTO_VAZIO = '{"nodes":[]}';

/** 12. Profundidade absurda: uma região dentro da outra, muito além de qualquer tela real. */
export function profundidadeAbsurda(niveis: number): string {
  let no: Record<string, unknown> = { kind: 'block.entry', ordinal: 0 };
  for (let i = 0; i < niveis; i += 1) {
    no = { kind: 'block.region', ordinal: 0, children: [no] };
  }
  return JSON.stringify({ nodes: [{ ...no, zone: 'zone.flow' }] });
}

/**
 * 13. Referência circular. Não existe em JSON: ela chega de um cache local que guardou um
 * objeto vivo, e é exatamente por isso que o analisador aceita `unknown`, não só texto.
 */
export function referenciaCircular(): unknown {
  const no: Record<string, unknown> = { kind: 'block.region', zone: 'zone.flow', ordinal: 0 };
  no['children'] = [no];
  return { nodes: [no] };
}

/** 14. Orçamento de nós estourado: irmãos demais na mesma zona. */
export function irmaosDemais(quantidade: number): string {
  const nodes = Array.from({ length: quantidade }, (_, index) => ({
    kind: 'block.entry',
    zone: 'zone.flow',
    ordinal: index,
  }));
  return JSON.stringify({ nodes });
}

/** 15. String que parece código: o cliente carrega como dado e nunca interpreta. */
export const STRING_QUE_PARECE_CODIGO = JSON.stringify({
  nodes: [
    {
      kind: 'block.entry',
      zone: 'zone.flow',
      ordinal: 0,
      source: "javascript:alert('x')",
      props: {
        label: '${total * 2}',
        hint: '<script>globalThis.pwned = true</script>',
      },
    },
  ],
});

/** 16. Papel que o servidor nunca emite, emitido pelo servidor. */
export const PISO_EMITIDO_PELO_SERVIDOR = JSON.stringify({
  nodes: [
    { kind: 'block.fallback', zone: 'zone.flow', ordinal: 0 },
    { kind: 'block.entry', zone: 'zone.flow', ordinal: 1 },
  ],
});

/** 17. A resposta que nunca chega é ausência de corpo, não corpo vazio. */
export const RESPOSTA_QUE_NUNCA_CHEGA = { status: 'unreachable' } as const;

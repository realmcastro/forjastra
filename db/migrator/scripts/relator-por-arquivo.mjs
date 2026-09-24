import { resolve } from 'node:path';

/**
 * Relator de máquina do executor da suíte: uma linha JSON por teste **executado e passado**, com o
 * arquivo de onde ele veio. É o que deixa o gate responder "este arquivo rodou", que o TAP não
 * responde: o resumo dele soma a suíte inteira e não diz de que arquivo veio cada teste (`PAP-29`).
 *
 * Conta só `type: 'test'`: o `describe` também chega como `test:pass`, e um bloco cujos testes foram
 * todos marcados `todo` passaria por arquivo executado.
 *
 * E não conta o teste que o `node --test` **inventa** para arquivo sem caso nenhum: medido em
 * 2026-09-23, Node 22.23.1, um arquivo que só importa o apoio de banco sai como `✔ <caminho do
 * arquivo>`, um teste passando com o nome do próprio arquivo, e entra no `# pass` do resumo. Sem esta
 * exclusão, o arquivo vivo esvaziado passaria por exercido.
 */
export default async function* relatorPorArquivo(eventos) {
  for await (const evento of eventos) {
    if (evento.type !== 'test:pass') continue;
    const dado = evento.data;
    if (dado.details?.type !== 'test') continue;
    if (dado.skip !== undefined || dado.todo !== undefined) continue;
    if (typeof dado.file === 'string' && resolve(dado.name) === dado.file) continue;
    yield `${JSON.stringify({ arquivo: dado.file ?? null })}\n`;
  }
}

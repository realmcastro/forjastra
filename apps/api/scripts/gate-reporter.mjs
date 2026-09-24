import { resolve } from 'node:path';

/**
 * Relator de máquina do gate: uma linha JSON por teste **executado e passado**, com o arquivo de onde
 * ele veio. Existe porque o resumo TAP soma a suíte inteira e não diz de que arquivo veio cada teste
 * (`SUB-10`), e a pergunta que o gate precisa responder é se os arquivos que exercem o banco rodaram.
 * `run-tests.mjs` lê este arquivo; ninguém mais o consome. É a mesma forma de
 * `db/migrator/scripts/relator-por-arquivo.mjs`, de propósito.
 *
 * Conta só `type: 'test'`: o `describe` também chega como `test:pass`, e um bloco cujos testes foram
 * todos marcados `todo` passaria por arquivo executado.
 *
 * E não conta o teste que o `node --test` **inventa** para arquivo sem caso nenhum. Medido em
 * 2026-09-23, Node 22.23.1: um arquivo vivo esvaziado, que só lê a chave do banco, sai como
 * `✔ <caminho do arquivo>`, um teste passando com o nome do próprio arquivo e `type: 'test'`. Sem esta
 * exclusão ele passava por arquivo exercido e o gate saía `0`.
 */
export default async function* gateReporter(source) {
  for await (const event of source) {
    if (event.type !== 'test:pass') continue;
    const data = event.data;
    if (data.details?.type !== 'test') continue;
    if (data.skip !== undefined || data.todo !== undefined) continue;
    if (typeof data.file === 'string' && resolve(data.name) === data.file) continue;
    yield `${JSON.stringify({ file: data.file ?? null })}\n`;
  }
}

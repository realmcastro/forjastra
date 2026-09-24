/**
 * Relator de máquina do gate: uma linha JSON por teste concluído, com o arquivo de onde ele veio.
 *
 * Existe porque o resumo TAP conta testes e não diz **de onde** eles vieram (`SUB-10`), e a pergunta
 * que o gate precisa responder é se os arquivos que exercem o banco rodaram. `run-tests.mjs` lê
 * este arquivo; ninguém mais o consome.
 *
 * Só `test:pass` e `test:fail`. `skip` e `todo` chegam como marca dentro do evento, e é por elas
 * que o gate separa teste executado de teste só declarado.
 */
export default async function* gateReporter(source) {
  for await (const event of source) {
    if (event.type !== 'test:pass' && event.type !== 'test:fail') continue;
    const data = event.data ?? {};
    yield `${JSON.stringify({
      outcome: event.type === 'test:pass' ? 'pass' : 'fail',
      file: typeof data.file === 'string' ? data.file : null,
      name: typeof data.name === 'string' ? data.name : null,
      nesting: typeof data.nesting === 'number' ? data.nesting : null,
      skip: data.skip !== undefined && data.skip !== false,
      todo: data.todo !== undefined && data.todo !== false,
    })}\n`;
  }
}

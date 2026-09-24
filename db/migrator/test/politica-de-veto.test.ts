import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { PERGUNTAS_SEM_VETO, POLITICA_DE_VETO } from '../src/commands/verify.js';

/**
 * Caso 49 de `CONTRATO.md` §14: a política de veto do `verify` (`PROVISION-E-VERIFY.md` §13.6).
 *
 * **Este caso existe para que a lista de exceções seja contada.** O tipo já impede que uma pergunta
 * nova nasça sem política e que "não veta" nasça sem motivo; o que ele não impede é a lista crescer
 * aos poucos, uma exceção por rodada, sem ninguém somar. A lista abaixo é a soma, e mexer nela é
 * mexer num teste — que é uma linha de diff que alguém lê.
 *
 * Sem banco: a tabela é dado do módulo.
 */
describe('a política de veto do verify', () => {
  /**
   * As quatro exceções, e a classe é a mesma nas quatro: **o que a pergunta cobra não é aplicado por
   * nada versionado**, ou **depende de quem pergunta**. Reprovar em qualquer uma delas faria o
   * comando reprovar em toda rodada de toda máquina, e controle que reprova sempre é controle que se
   * aprende a ignorar (`SEC-05`).
   */
  const ESPERADAS = [
    'privilégio do executor sobre platform.tenants',
    'declarações além do arranjo desta rodada',
    'privilégio padrão do papel que pergunta',
    'ato do operador no public e no banco',
  ];

  test('as perguntas sem veto são exatamente as quatro declaradas', () => {
    assert.deepEqual([...PERGUNTAS_SEM_VETO], ESPERADAS);
  });

  test('toda exceção carrega motivo escrito, e toda pergunta tem política', () => {
    for (const [nome, politica] of Object.entries(POLITICA_DE_VETO)) {
      if (politica.veta) continue;
      assert.ok(
        politica.motivo.length > 40,
        `a pergunta "${nome}" não veta e o motivo dela não explica por quê`,
      );
    }
    assert.ok(
      Object.keys(POLITICA_DE_VETO).length > PERGUNTAS_SEM_VETO.length,
      'a maioria das perguntas veta: o default de pergunta nova é vetar',
    );
  });
});

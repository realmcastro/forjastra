import type { ContentScreen, ScreenInput } from '../../src/content-screen.js';

/**
 * **Não é o crivo da §11, e não pode virar um.** Ele não recusa nada.
 *
 * Existe para um teste só: o da verificação de namespace (`APLICACAO-E-ALVO.md` §10.4). Um arquivo
 * que crie objeto fora do schema alvo é, por construção, um arquivo que o crivo real recusa na
 * §11.3 — então a única forma de exercitar a **segunda** camada é desligar a primeira. É isso que a
 * spec chama de mecanismo em camadas: aquela é recusa de forma, esta é detecção de efeito, e um
 * teste que só exercita a primeira não prova nada sobre a segunda.
 *
 * Usar isto em qualquer outro lugar desfaz a defesa contra `DROP SCHEMA` em arquivo de migration
 * (`MIG-03`, medido).
 *
 * A separação de comandos aqui é ingênua de propósito: ela cobre os fixtures desse teste, que são
 * comandos simples, sem literal e sem cifrão.
 */
export const approveAllScreen: ContentScreen = {
  screen(input: ScreenInput): readonly string[] {
    return input.text
      .split('\n')
      .filter((line) => !line.trimStart().startsWith('--'))
      .join('\n')
      .split(';')
      .map((command) => command.trim())
      .filter((command) => command !== '');
  },
};

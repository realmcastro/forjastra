import { uuidV7 } from '../id/uuid-v7.js';

/**
 * Fato de subida — invariante 10 aplicado ao único instante que a borda não cobre.
 *
 * O fato de borda (`border-facts.ts`) só existe depois que a porta abriu. Servidor que **não**
 * sobe não produz nenhum, então a janela em que ele não existiu é silêncio completo — e é a
 * primeira coisa que alguém procura quando o terminal diz que o sistema não abre.
 *
 * ## O que a subida registra
 *
 * | Fato | Responde a pergunta que não tem backfill |
 * |---|---|
 * | `startup_credential_verified` | sob que papel de banco este servidor esteve rodando naquele dia. Processo encerrado não deixa rastro nenhum |
 * | `startup_credential_refused` | qual das oito perguntas falhou, e por quanto tempo o servidor esteve fora por causa dela |
 *
 * Um por processo, nunca por requisição: repetir a conferência a cada requisição põe consulta de
 * catálogo no caminho do caixa, e o terceiro limite do invariante 10 não admite captura que
 * compete com a venda.
 *
 * ## O que a subida **não** registra, e por quê
 *
 * - **Qualquer parte de `FORJA_DATABASE_URL`** além do nome do papel que o catálogo devolveu:
 *   senha, host, porta, banco. Segredo nunca (`00-nucleo.md` §8), e o nome do papel é o que
 *   responde à pergunta. Vale inclusive quando a pergunta falha por não conectar: dali sai o
 *   código do erro, nunca a mensagem, que carrega endereço.
 * - **Inventário de papéis do cluster** — quem mais é membro do grupo, quem mais alcança schema
 *   de cliente. Essa pergunta é do `verify` do executor (`db/verificacao-do-papel.md` §7.5.1). Um
 *   servidor que a responde carrega um mapa do arranjo de isolamento que ele não usa, e que,
 *   vazado numa mensagem, descreve o próprio isolamento. O que sai daqui é só o que foi concedido
 *   **à própria credencial**, que é o que alguém precisa para agir.
 * - **O nome do que a recusa encontrou.** Desde 2026-09-12 a conferência enxerga schema de cliente
 *   alcançado (`reach`), papel de cliente que herda outro (`assumed`) e papel de cliente que
 *   alcança o schema alheio (`assumedReach`), e os três nomeiam cliente. Desde 2026-09-23 enxerga
 *   também objeto que delega o privilégio do dono (`delegation`), que nomeia dois.
 *   O fato carrega o **veredito por pergunta**, nunca a lista: quem precisa agir lê a recusa na
 *   saída de erro, que é do processo e some com ele; o fato é o que um dia terá residência
 *   (`D-06`) e seria lido por quem não administra este banco. Fato que nomeia cliente vira carteira
 *   de clientes no destino de trilha, e nenhuma pergunta operacional precisa do nome para ser
 *   respondida — "qual pergunta falhou, e por quanto tempo" basta.
 * - **Nada por requisição.** Ver acima.
 *
 * ## Onde isso é retido
 *
 * Em lugar nenhum, ainda: a residência da trilha é `D-06`, **ABERTA**. O destino padrão é a saída
 * padrão do processo, e **não é trilha** — não é retido, não é consultável e não prova nada.
 */

export type StartupFactKind = 'startup_credential_verified' | 'startup_credential_refused';

/** `unanswered` existe porque pergunta que não saiu é diferente de pergunta que falhou. */
export type CheckOutcome = 'ok' | 'refused' | 'unanswered';

export interface CredentialCheckVerdict {
  readonly role: CheckOutcome;
  readonly login: CheckOutcome;
  readonly group: CheckOutcome;
  readonly inheritance: CheckOutcome;
  /** Alcance nu em schema de cliente, por privilégio de objeto. Entrou em 2026-09-12 (`SUB-01`). */
  readonly reach: CheckOutcome;
  /** Herança dos papéis que este processo assume. Entrou em 2026-09-12 (`SUB-02`). */
  readonly assumed: CheckOutcome;
  /**
   * Alcance por privilégio de objeto — e atributo — dos papéis que este processo assume. Entrou em
   * 2026-09-12 (`SUB-05`), e é a quarta célula da matriz sujeito × mecanismo: `inheritance` e
   * `reach` têm sujeito na credencial, `assumed` e esta têm sujeito no papel assumido.
   */
  readonly assumedReach: CheckOutcome;
  /**
   * Objeto de schema protegido que empresta o privilégio do dono a quem o usa: dependência que
   * atravessa para outro schema protegido, ou rotina `SECURITY DEFINER`. Entrou em 2026-09-23
   * (`SUB-09`), e é o quinto mecanismo de alcance: nenhuma das outras perguntas o vê, porque o papel
   * assumido continua sem privilégio nenhum sobre o schema alheio.
   */
  readonly delegation: CheckOutcome;
}

export interface StartupFact {
  readonly factId: string;
  readonly kind: StartupFactKind;
  /** Instante em que o fato aconteceu. Nasce no servidor, então não há o par de `D-04`. */
  readonly occurredAt: string;
  /** O papel a que a conexão pertence de fato, como o catálogo o devolveu. */
  readonly currentRole: string;
  /** O papel com que a conexão autenticou. Diferente do anterior é estado que ninguém desenhou. */
  readonly sessionRole: string;
  /** O grupo contra o qual a pergunta foi feita. Nome fixado em código, nunca por ambiente. */
  readonly groupRole: string;
  readonly verdict: CredentialCheckVerdict;
}

export interface StartupFactSink {
  readonly name: string;
  record(fact: StartupFact): void;
}

export interface NewStartupFact {
  readonly kind: StartupFactKind;
  readonly currentRole: string;
  readonly sessionRole: string;
  readonly groupRole: string;
  readonly verdict: CredentialCheckVerdict;
}

let droppedFacts = 0;

/** Quantos fatos de subida o destino não aceitou desde que o processo subiu. */
export function droppedStartupFactCount(): number {
  return droppedFacts;
}

/**
 * **Nunca lança.** Terceiro limite do invariante 10: falha ao registrar não derruba a operação —
 * e aqui não derruba nem a recusa, que é o desfecho que o fato descreve. A falha vira contador,
 * porque o destino que falhou é o mesmo que receberia o fato sobre a falha.
 */
export function emitStartupFact(sink: StartupFactSink, fact: NewStartupFact): void {
  try {
    sink.record({
      factId: uuidV7(),
      occurredAt: new Date().toISOString(),
      kind: fact.kind,
      currentRole: fact.currentRole,
      sessionRole: fact.sessionRole,
      groupRole: fact.groupRole,
      verdict: fact.verdict,
    });
  } catch {
    droppedFacts += 1;
  }
}

/** Destino padrão: uma linha JSON na saída padrão. Não é trilha (ver o topo do arquivo). */
export const stdoutStartupFactSink: StartupFactSink = {
  name: 'stdout',
  record(fact: StartupFact): void {
    process.stdout.write(`${JSON.stringify({ startupFact: fact })}\n`);
  },
};

/** Descarta em silêncio. Existe para teste, e para quem precisar desligar com intenção. */
export const nullStartupFactSink: StartupFactSink = {
  name: 'null',
  record(): void {},
};

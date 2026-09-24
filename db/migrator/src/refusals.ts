import type { ContentScreen, ScreenInput } from './content-screen.js';
import { refused } from './errors.js';
import type { Alvo, MigrationHeader } from './header.js';
import {
  closingParen,
  hasTopLevelComma,
  literalAround,
  normalize,
  splitCommands,
  stripComments,
} from './sql-text.js';

/**
 * O crivo de conteúdo: `db/migrator/RECUSAS.md` §11, inteira.
 *
 * Toda recusa aborta a rodada, com saída `2`, nomeando arquivo e trecho. Nenhuma migration é
 * aplicada. A decisão é tomada **antes** de qualquer conexão de aplicação; a única conexão que a
 * recusa abre é a de `load_refused` (§19.4), depois de decidida, e quem a abre é o executor.
 *
 * Duas propriedades de leitura, e as duas são deliberadas:
 *
 * - **Falso positivo é recusa**, e a recusa é o lado seguro. Um literal que contenha a grafia de um
 *   comando proibido reprova o arquivo, e o autor reescreve o literal.
 * - **Isto é análise de texto, não análise sintática de SQL** (§11.7 item 2). O que não se classifica
 *   em uma forma permitida é recusado.
 */

/**
 * §11.5. A ordem importa para a mensagem, não para o desfecho: o primeiro que casar é o que o autor
 * lê primeiro.
 */
const FORBIDDEN: readonly (readonly [RegExp, string])[] = [
  [/\$\$/, 'cifrão sem rótulo ($$); o rótulo é o que torna a varredura de literal não ambígua'],
  [/^do\b/, 'bloco anônimo DO; SQL dinâmico desfaz a análise inteira desta lista'],
  [/^begin\b/, 'BEGIN abrindo comando; o controle de transação é do executor (§7)'],
  [/\bexecute\b(?!\s+(?:function|procedure)\b)/, 'EXECUTE que executa texto'],
  [/\bformat\s*\(/, 'format(); RAISE tem marcadores próprios e não precisa dela'],
  [/\bsecurity\s+definer\b/, 'SECURITY DEFINER; é escalonamento de privilégio nascido em migration'],
  [/\bcommit\b/, 'COMMIT; disputaria o controle de transação com o executor'],
  [/\brollback\b/, 'ROLLBACK; disputaria o controle de transação com o executor'],
  [/\breset\b/, 'RESET; disputaria o controle de sessão com o executor'],
  [
    /\bset\b(?!\s+(?:not null|default|null)\b)/,
    'o comando SET, seja qual for o que venha depois dele. A palavra só é aceita em três ' +
      'vizinhanças, e são as três em que ela não é comando: "set not null", "set default" e ' +
      '"set null". Enumerar SET search_path e SET ROLE fechava aqueles dois arquivos e deixava a ' +
      'classe aberta: SET LOCAL e SET SESSION têm uma palavra no meio e atravessavam (§11.5)',
  ],
  [
    /\bset_config\s*\(/,
    'set_config(); ele faz, com sintaxe de chamada de função, o que o comando SET faz, e nenhuma ' +
      'regra sobre a palavra "set" o alcança — set_config é um identificador só. O alvo do ' +
      'search_path é fixado pelo executor (§10.3)',
  ],
  [/\bcopy\b/, 'COPY; alcança o sistema de arquivos do servidor'],
  [/\bpg_read_file\b/, 'pg_read_file; alcança o sistema de arquivos do servidor'],
  [/\bpg_ls_dir\b/, 'pg_ls_dir; alcança o sistema de arquivos do servidor'],
  [/\blo_import\b/, 'lo_import; alcança o sistema de arquivos do servidor'],
  [/\blo_export\b/, 'lo_export; alcança o sistema de arquivos do servidor'],
];

/**
 * §11.3. O conjunto de nomes de schema que podem existir neste banco é **fechado**, então a recusa é
 * por lista de qualificadores, e não por "qualquer coisa seguida de ponto" — é isso que faz `o.total`
 * de qualquer alias escapar por construção.
 *
 * Os dois padrões correm sobre a cópia normalizada (§11.1 item 4), nunca sobre o texto cru. Aplicá-los
 * ao original devolve o buraco medido no `SEC-01`, em que `T_GLOBEX.orders` passa por não casar
 * caractere a caractere.
 *
 * **O padrão do `t_` não escreve comprimento**, e isso é o `EXE-03`: ele dizia `{1,40}` enquanto a
 * borda admitia 41, e as duas metades não tinham nada que as ligasse — o cliente de nome comprido
 * saía da fronteira sem sintoma. O teto mora no banco e na borda (`0007`, §10.2); aqui um padrão sem
 * número não tem com o que divergir, como o `pg_` já era escrito.
 */
const FOREIGN_SCHEMA: Readonly<Record<Alvo, RegExp>> = {
  tenant: /\b(platform|public|information_schema|pg_[a-z0-9_]*|t_[a-z0-9_]*)\s*\./,
  platform: /\b(public|information_schema|pg_[a-z0-9_]*|t_[a-z0-9_]*)\s*\./,
};

const HAS_SELECT = /\bselect\b/;
const CONCURRENT_INDEX =
  /^create (?:unique )?index concurrently if not exists ([a-z0-9_$]+) on\b/;

interface Form {
  readonly nome: string;
  /**
   * A cabeça (§11.2 regra 1): casa a partir do primeiro token. Quando a forma tem **interior** que
   * não se enumera (§11.2 regra 3), o padrão termina no `(` que o abre, e quem diz onde o interior
   * acaba é `closingParen`.
   */
  readonly casa: RegExp;
  /**
   * A cauda (§11.2 regra 2): o que tem que casar do fim do interior até o fim do comando. Ausente
   * significa que a própria cabeça já é ancorada no fim, ou que o fim é cobrado em `exige`.
   *
   * É ela que mata `DROP COLUMN`, `DISABLE TRIGGER`, `OWNER TO` e `SET search_path` como atributo de
   * função **sem que nenhum deles esteja escrito aqui**. Prosa dizendo "uma ação por comando" não é
   * âncora — a §11.2 dizia isso desde a primeira versão, e foi por essa frase que o `EXE-02` passou.
   */
  readonly cauda?: RegExp;
  /** O que o resto do comando não pode conter, além do que a §11.5 já proíbe. */
  readonly recusa?: readonly (readonly [RegExp, string])[];
  readonly exige?: readonly (readonly [RegExp, string])[];
  readonly somenteAlvo?: Alvo;
  /** §11.2: na forma de `ALTER TABLE`, vírgula fora de parêntese traz uma segunda ação. */
  readonly umaAcaoSo?: true;
}

/**
 * A cauda da forma de função: **exatamente** `LANGUAGE <plpgsql|sql>` e `AS <literal de cifrão
 * rotulado>`, em qualquer ordem, e nada depois.
 *
 * É o que recusa `SET search_path = t_vitima` como atributo — cláusula legal do Postgres que fixa o
 * alvo da função no schema de outro cliente sem uma linha dentro do corpo —, mais `SECURITY
 * DEFINER`, `COST`, `STRICT`, `IMMUTABLE`, e o corpo `BEGIN ATOMIC` do PostgreSQL 14, que não tem
 * literal de cifrão para casar. Nenhum deles está escrito aqui, e é esse o ponto.
 *
 * `LANGUAGE` é lista fechada (`EXE-06`): `LANGUAGE c` e `LANGUAGE plpython3u` exigem superusuário no
 * banco, e a barreira que faltava era a do arquivo, para o dia em que alguém rodar o executor com
 * credencial administrativa "só para provisionar o primeiro cliente".
 *
 * **`<tipo>` é um identificador só**, então `RETURNS TABLE ( … )` e `RETURNS SETOF …` são recusa — e
 * não por lacuna. Vale a regra de não crescer por antecipação (a mesma do `WHERE` de índice
 * parcial), mais um motivo forte: função que devolve conjunto é superfície de consulta, e a
 * superfície sancionada aqui é a **view**, obrigada a `security_invoker` e com o corpo legível no
 * catálogo. A função põe a mesma consulta no interior que nenhum texto fecha (§11.7 item 1).
 */
const FUNCTION_TAIL =
  /^ returns [a-z0-9_]+(?:\([0-9, ]+\))?(?:\[\])? (?:language (?:plpgsql|sql) as (\$[a-z0-9_]*\$).*\1|as (\$[a-z0-9_]*\$).*\2 language (?:plpgsql|sql))$/;

const FIM_DO_COMANDO = /^$/;

/** §11.2. A lista é curta de propósito: ampliá-la é mudança do contrato, e passa por revisão. */
const FORMS: readonly Form[] = [
  {
    nome: 'CREATE SCHEMA IF NOT EXISTS platform',
    casa: /^create schema if not exists [a-z0-9_]+$/,
    somenteAlvo: 'platform',
    exige: [
      [
        /^create schema if not exists platform$/,
        'o nome criado seja platform, e nenhum outro: schema de cliente nasce em provision (§10.1) ' +
          'e a única migration que cria schema é a 0000. Um CREATE SCHEMA de cliente aqui cria ' +
          'schema sem linha no registro, que o provision depois recusa e que ninguém pode desfazer, ' +
          'porque desfazer é DROP SCHEMA (EXE-07)',
      ],
    ],
  },
  {
    nome: 'CREATE TABLE IF NOT EXISTS <nome> ( … )',
    casa: /^create table if not exists [a-z0-9_.]+ ?\(/,
    cauda: FIM_DO_COMANDO,
    recusa: [[HAS_SELECT, 'SELECT em qualquer posição']],
  },
  {
    nome: 'CREATE [UNIQUE] INDEX [CONCURRENTLY] IF NOT EXISTS <nome> ON <tabela> [USING <metodo>] ( … )',
    casa:
      /^create (?:unique )?index (?:concurrently )?if not exists [a-z0-9_$]+ on [a-z0-9_.]+ ?(?:using [a-z0-9_]+ )?\(/,
    cauda: FIM_DO_COMANDO,
    recusa: [[HAS_SELECT, 'SELECT em qualquer posição']],
  },
  {
    /**
     * Entrou em 2026-09-23 (T-0022), com os domínios de valor da primeira migration de cliente
     * (`decision-dinheiro-e-quantidade`). Não tem `IF NOT EXISTS` porque o Postgres não tem: a
     * retomada vem da transação, como o `ADD CONSTRAINT` (`CONTRATO.md` §17.2, forma 3), e o regime
     * não-transacional já a recusa (§11.4).
     *
     * A forma é estreita de propósito. O tipo base é **um identificador sem modificador**, então
     * `numeric(14,2)` como base não passa, que é o arredondamento silencioso que os domínios existem
     * para evitar. A restrição é **uma**, nomeada, e o comando termina no parêntese dela: `NOT NULL`,
     * `DEFAULT` e `COLLATE` ficam de fora pela cauda, sem estarem escritos aqui.
     */
    nome: 'CREATE DOMAIN <nome> AS <tipo> CONSTRAINT <nome> CHECK ( … )',
    casa: /^create domain [a-z0-9_.]+ as [a-z0-9_]+ constraint [a-z0-9_]+ check ?\(/,
    cauda: FIM_DO_COMANDO,
    recusa: [[HAS_SELECT, 'SELECT em qualquer posição']],
  },
  {
    nome: 'CREATE SEQUENCE IF NOT EXISTS <nome>',
    casa: /^create sequence if not exists [a-z0-9_.]+$/,
  },
  {
    /**
     * A única forma com **interior terminal**: o último token que ela nomeia é o `AS`, e o interior
     * vai dali até o fim do comando. A ausência de `cauda` aqui é declaração, não lacuna — achar
     * onde uma consulta termina exige o parser que a §11.7 item 2 diz não existir. A âncora é toda
     * da cabeça (nome, opção colada nele, `AS`, consulta não vazia), e é assim que um segundo
     * `WITH (…)` antes do `AS` não cabe. `WITH CHECK OPTION` depois da consulta passa **por ser
     * interior**: ele restringe escrita através da view e não amplia alcance nenhum, e enumerá-lo
     * para recusar seria a lista de palavra proibida de novo (§11.2).
     */
    nome: 'CREATE OR REPLACE VIEW <nome> WITH (security_invoker = true) AS <consulta>',
    casa: /^create or replace view [a-z0-9_.]+ /,
    exige: [
      [
        /^create or replace view [a-z0-9_.]+ with \(security_invoker ?= ?true\) as .+$/,
        'a opção security_invoker = true é obrigatória e vem logo depois do nome, e é o que impede ' +
          'a view de emprestar o alcance do executor a quem a selecionar (§11.7 item 5)',
      ],
    ],
  },
  {
    nome: 'CREATE OR REPLACE FUNCTION <nome>(<args>) RETURNS <tipo>, com LANGUAGE e AS',
    casa: /^create or replace function [a-z0-9_.]+ ?\(/,
    cauda: FUNCTION_TAIL,
  },
  {
    nome: 'CREATE [OR REPLACE] TRIGGER … EXECUTE FUNCTION <nome>(…)',
    casa: /^create (?:or replace )?trigger [a-z0-9_]+ /,
    recusa: [[HAS_SELECT, 'SELECT em qualquer posição']],
    exige: [[/ execute function [a-z0-9_.]+ ?\([^()]*\)$/, 'o comando tem que terminar em EXECUTE FUNCTION']],
  },
  {
    nome: 'COMMENT ON <objeto> IS <literal>',
    casa: /^comment on /,
    recusa: [[HAS_SELECT, 'SELECT em qualquer posição']],
    exige: [[/ is '(?:[^']|'')*'$/, 'o comando tem que terminar no literal do comentário']],
  },
  {
    nome: 'INSERT INTO <nome> … VALUES … ON CONFLICT DO NOTHING',
    casa: /^insert into [a-z0-9_.]+ ?\(/,
    recusa: [
      [HAS_SELECT, 'SELECT: seed é valor literal, nunca consulta'],
      [/\breturning\b/, 'RETURNING'],
    ],
    exige: [
      [/\bvalues\b/, 'o comando tem que conter VALUES'],
      [/on conflict do nothing$/, 'o comando tem que terminar em ON CONFLICT DO NOTHING'],
    ],
  },
  {
    nome: 'ALTER TABLE <nome> <uma ação>',
    casa:
      /^alter table [a-z0-9_.]+ (?:add column if not exists |add constraint |validate constraint |alter column [a-z0-9_]+ set (?:not null|default ))/,
    umaAcaoSo: true,
    recusa: [
      [HAS_SELECT, 'SELECT em qualquer posição'],
      [/\busing\b/, 'USING: troca de tipo não passa por aqui'],
    ],
  },
];

export const contentScreen: ContentScreen = {
  screen(input: ScreenInput): readonly string[] {
    const stripped = stripComments(input.text, input.version);

    /**
     * §11.1 item 3 e §11.5: sem aspa dupla no arquivo, não existe identificador citado para a
     * fronteira da §11.3 perder. É metade da correção do `SEC-01` — a outra é a normalização, e
     * cada uma sozinha deixa passar metade dos quatro ataques medidos.
     */
    if (stripped.includes('"')) {
      throw refusal(
        input,
        'aspa dupla em qualquer posição, inclusive dentro de literal. Todo identificador daqui é ' +
          'escolhido por nós, em minúsculo, sem espaço e sem palavra reservada (§11.5)',
        trecho(stripped, stripped.indexOf('"')),
      );
    }

    const commands = splitCommands(stripped, input.version);
    for (const command of commands) {
      screenCommand(input, command);
    }
    screenAgainstHeader(input, commands);
    return commands;
  },
};

function screenCommand(input: ScreenInput, command: string): void {
  const normalized = normalize(command);

  for (const [pattern, motivo] of FORBIDDEN) {
    const encontrado = pattern.exec(normalized);
    if (encontrado === null) continue;

    /**
     * A recusa alcança literal, e é assim de propósito: corpo de função **é** literal, e foi de
     * dentro dele que vieram os quatro últimos escapes (§11.5). O que a spec exige é que a mensagem
     * **diga** isso, com o trecho — senão o autor procura no arquivo um comando que ele não tem.
     */
    const literal = literalAround(normalized, encontrado.index);
    if (literal === undefined) throw refusal(input, motivo, command);
    throw refusal(
      input,
      `${motivo}.\n  A ocorrência está DENTRO DE UM LITERAL, e a recusa alcança literal também ` +
        '(§11.5): corpo de função é literal, e isentá-los dependeria de quatro regras se manterem ' +
        'de acordo para sempre. Reescreva o texto do literal — falso positivo é recusa (§11.1).',
      literal,
    );
  }

  const foreign = FOREIGN_SCHEMA[input.header.alvo].exec(normalized);
  if (foreign !== null) {
    throw refusal(
      input,
      `qualificador de schema "${foreign[1]}" em migration de alvo ${input.header.alvo}: o alvo é ` +
        'resolvido pelo executor (§10.3) e o arquivo escreve nome não qualificado (§11.3)',
      command,
    );
  }

  const form = FORMS.find((candidate) => candidate.casa.test(normalized));
  if (form === undefined) {
    throw refusal(input, 'nenhuma forma da lista de permissão da §11.2 classifica este comando', command);
  }
  if (form.somenteAlvo !== undefined && form.somenteAlvo !== input.header.alvo) {
    throw refusal(
      input,
      `a forma "${form.nome}" só existe em alvo ${form.somenteAlvo}`,
      command,
    );
  }
  for (const [pattern, motivo] of form.recusa ?? []) {
    if (pattern.test(normalized)) {
      throw refusal(input, `a forma "${form.nome}" não admite ${motivo}`, command);
    }
  }
  for (const [pattern, motivo] of form.exige ?? []) {
    if (!pattern.test(normalized)) {
      throw refusal(input, `a forma "${form.nome}" exige que ${motivo}`, command);
    }
  }
  if (form.umaAcaoSo === true && hasTopLevelComma(normalized)) {
    throw refusal(
      input,
      `a forma "${form.nome}" é uma ação só, e a vírgula fora de parêntese traz a segunda: é ela ` +
        'que fazia ADD COLUMN … , DROP COLUMN total se classificar como "acrescenta coluna" e ' +
        'apagar uma (EXE-02, §11.2)',
      command,
    );
  }
  screenTail(input, form, normalized, command);
}

/**
 * A cauda fechada (§11.2 regra 2). A cabeça da forma termina no `(` que abre o interior; o interior
 * vai até o parêntese que o fecha, e do fim dele até o fim do comando quem manda é a cauda.
 *
 * O que sobrar entre o último token que a forma nomeia e o fim do comando é recusa, **sem que a lista
 * precise saber o que era aquilo** — e é justamente por não precisar que ela para de perder a próxima
 * palavra.
 */
function screenTail(input: ScreenInput, form: Form, normalized: string, command: string): void {
  if (form.cauda === undefined) return;

  // Falha fechado: forma com cauda tem cabeça terminando no `(` que abre o interior, e uma cabeça
  // que não termine ali sairia daqui sem cauda nenhuma conferida — que é o defeito, não o contorno.
  const cabeca = form.casa.exec(normalized);
  const abre = cabeca === null ? -1 : cabeca[0].length - 1;
  if (abre < 0 || normalized[abre] !== '(') {
    throw refusal(
      input,
      `a forma "${form.nome}" declara interior, e a cabeça dela não abriu parêntese neste comando`,
      command,
    );
  }

  const fecha = closingParen(normalized, abre);
  if (fecha === undefined) {
    throw refusal(
      input,
      `o parêntese que abre o interior da forma "${form.nome}" não fecha neste comando`,
      command,
    );
  }

  const resto = normalized.slice(fecha + 1);
  if (!form.cauda.test(resto)) {
    throw refusal(
      input,
      `a forma "${form.nome}" declara onde termina, e o que veio depois do interior não é o fim ` +
        `dela: "${resumo(resto)}"`,
      command,
    );
  }
}

/** §11.4, a parte que depende do corpo: regime e `cria-indice` contra o que o arquivo cria. */
function screenAgainstHeader(input: ScreenInput, commands: readonly string[]): void {
  const header: MigrationHeader = input.header;
  const criados: string[] = [];

  for (const command of commands) {
    const normalized = normalize(command);
    const concorrente = CONCURRENT_INDEX.exec(normalized);
    if (concorrente !== null) criados.push(concorrente[1]!);

    if (header.transacional && /\bconcurrently\b/.test(normalized)) {
      throw refusal(input, 'CONCURRENTLY em migration marcada "transacional: sim"', command);
    }
    if (!header.transacional && concorrente === null) {
      const motivo = /^alter table .* add constraint /.test(normalized)
        ? 'ALTER TABLE … ADD CONSTRAINT em migration marcada "transacional: nao": sem transação, a ' +
          'segunda tentativa morre em "constraint already exists" e a rodada não converge (§17.2)'
        : 'migration marcada "transacional: nao" só admite CREATE INDEX CONCURRENTLY';
      throw refusal(input, motivo, command);
    }
  }

  for (const declarado of header.criaIndice) {
    if (!criados.includes(declarado)) {
      throw refusal(
        input,
        `cria-indice declara "${declarado}", que o corpo não cria: a limpeza da retomada depende ` +
          'dessa lista para saber o que procurar (§8)',
        undefined,
      );
    }
  }
  for (const criado of criados) {
    if (!header.criaIndice.includes(criado)) {
      throw refusal(
        input,
        `o corpo cria "${criado}" com CONCURRENTLY e o cabeçalho não o declara em cria-indice`,
        undefined,
      );
    }
  }
}

function refusal(input: ScreenInput, motivo: string, trechoOriginal: string | undefined): Error {
  const onde = trechoOriginal === undefined ? '' : `\n  trecho: ${resumo(trechoOriginal)}`;
  return refused(`${input.version}: ${motivo}${onde}`, { version: input.version });
}

const TRECHO_LIMITE = 200;

function resumo(texto: string): string {
  const limpo = texto.trim().replace(/\s+/g, ' ');
  return limpo.length <= TRECHO_LIMITE ? limpo : `${limpo.slice(0, TRECHO_LIMITE)}…`;
}

function trecho(texto: string, posicao: number): string {
  const inicio = Math.max(0, posicao - 40);
  return texto.slice(inicio, posicao + 40);
}

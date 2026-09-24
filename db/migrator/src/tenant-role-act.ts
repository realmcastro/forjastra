import type pg from 'pg';
import { diverged } from './errors.js';
import { renderCommand, renderCommandWithTwoIdentifiers } from './session.js';
import {
  tenantRoleName,
  type ForeignGrantorRow,
  type Missing,
  type TenantRoleNames,
} from './tenant-role.js';

/**
 * O **ato** da §7.3 — o que o executor emite — e as **recusas** da §7.4 — o que ele não emite e por
 * quê. `tenant-role.ts` é a pergunta; este arquivo é a mão.
 *
 * O corte saiu do teto de 400 linhas de `00-nucleo.md` §8, quando o sétimo gate estendeu a pergunta
 * de herança ao conjunto declarado, e é o mesmo corte que partiu a spec em `db/papel-do-cliente.md`
 * (o ato) e `db/verificacao-do-papel.md` (a prova).
 */

/**
 * O ato da §7.3, **num commit só**. Medido em 2026-09-11, PostgreSQL 16.15 e 15.19: `CREATE ROLE` e
 * `ALTER DEFAULT PRIVILEGES` são transacionais e o `ROLLBACK` não deixa papel para trás. Ou o papel
 * nasce com o alcance dele, ou não nasce — não existe o estado difícil de diagnosticar, em que a
 * conexão autentica e não lê nada.
 *
 * Todo identificador atravessa como parâmetro e quem o cita é o servidor (`APLICACAO-E-ALVO.md`
 * §10.3.0): `CREATE ROLE` e `GRANT` não aceitam parâmetro na posição do identificador.
 *
 * `FOR ROLE CURRENT_USER` é o mesmo sujeito que a §7.5 confere (`defaclrole = to_regrole(current_user)`).
 * Trocar o papel do executor desliga o privilégio padrão em silêncio — as tabelas antigas continuam
 * legíveis e as novas nascem invisíveis —, e é a §7.5 que encontra isso.
 */
export async function applyTenantRoleAct(
  client: pg.Client,
  schema: string,
  names: TenantRoleNames,
  steps: { readonly create: boolean; readonly parts: readonly Missing[] },
): Promise<void> {
  const role = tenantRoleName(schema);
  const commands: string[] = [];

  if (steps.create) {
    commands.push(await renderCommand(client, 'CREATE ROLE %I NOLOGIN NOINHERIT', role));
    commands.push(await renderCommandWithTwoIdentifiers(client, 'GRANT %I TO %I', names.group, role));
  }
  /**
   * **`WITH INHERIT FALSE, SET TRUE` é a linha de que o arranjo inteiro depende** (§7.3): a
   * credencial pode **assumir** o papel do cliente e não pode **herdar** nada dele. Sem a opção, uma
   * credencial criada sem `NOINHERIT` lê todo schema de cliente sem assumir papel nenhum, que é a
   * prova C — e a opção da concessão vence o atributo do papel, medido em 2026-09-11.
   *
   * As duas partes emitem a mesma linha, e por isso ela sai uma vez só: `credencial` é a concessão
   * ausente, `heranca` é a mesma concessão existindo herdável, que reemitir corrige no lugar.
   */
  if (steps.parts.includes('credencial') || steps.parts.includes('heranca')) {
    commands.push(
      await renderCommandWithTwoIdentifiers(
        client,
        'GRANT %I TO %I WITH INHERIT FALSE, SET TRUE',
        role,
        names.credential,
      ),
    );
  }
  if (steps.parts.includes('usage')) {
    commands.push(
      await renderCommandWithTwoIdentifiers(client, 'GRANT USAGE ON SCHEMA %I TO %I', schema, role),
    );
  }
  if (steps.parts.includes('tabelas')) {
    commands.push(
      await renderCommandWithTwoIdentifiers(
        client,
        'GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA %I TO %I',
        schema,
        role,
      ),
    );
  }
  if (steps.parts.includes('default_acl')) {
    commands.push(
      await renderCommandWithTwoIdentifiers(
        client,
        'ALTER DEFAULT PRIVILEGES FOR ROLE CURRENT_USER IN SCHEMA %I ' +
          'GRANT SELECT, INSERT, UPDATE ON TABLES TO %I',
        schema,
        role,
      ),
    );
  }

  await client.query('begin');
  try {
    for (const command of commands) await client.query(command);
    await client.query('commit');
  } catch (cause) {
    await client.query('rollback').catch(() => undefined);
    throw cause;
  }
}

/** O ato inteiro: o que o passo 7 do `provision` roda sobre um schema sem papel. */
export const FULL_ACT: { readonly create: boolean; readonly parts: readonly Missing[] } = {
  create: true,
  parts: ['credencial', 'usage', 'tabelas', 'default_acl'],
};

/**
 * A recusa do `PAP-13`, e ela é **recusa, não conserto**: a §7.4 decidiu em 2026-09-11 que uma
 * concessão herdável de outro concedente não converge nem é revogada pelo executor.
 *
 * As três medições que sustentam a decisão, PostgreSQL 16.15:
 *
 * - reemitir a linha da §7.3 grava a concessão **do executor** e deixa a do outro concedente de pé,
 *   porque a chave é `(roleid, member, grantor)`. O `migrate` saía `0` sobre estado não corrigido;
 * - o `REVOKE` do executor apaga **só a linha dele**, tirando a concessão legítima e deixando a
 *   herdável — a correção óbvia piora o estado;
 * - `REVOKE … GRANTED BY <outro>` emitido pelo executor leva
 *   `permission denied to revoke privileges granted by role`: não há caminho daqui.
 *
 * O que corrige, medido: o próprio concedente, na conexão dele, emitindo o `REVOKE` simples. Ele
 * apaga só a linha dele e **deixa a do executor de pé**, então nada mais é preciso depois.
 */
export function foreignGrantorError(
  schema: string,
  herancas: readonly ForeignGrantorRow[],
): Error {
  return diverged(foreignGrantorFix(schema, herancas));
}

/**
 * A mensagem nomeia **as duas pontas** de cada concessão: a credencial e o concedente. Ela deixou de
 * assumir que a credencial é a do ambiente no sétimo gate (`PAP-19`), porque não é: a rotação da
 * §7.7 aceita mais de uma credencial declarada, e o `REVOKE` que corrige precisa do nome certo dos
 * dois lados ou não corrige nada.
 */
export function foreignGrantorFix(
  schema: string,
  herancas: readonly ForeignGrantorRow[],
): string {
  const papel = tenantRoleName(schema);
  const lista = herancas
    .map((heranca) => `"${heranca.credencial}" por concessão de "${heranca.concedente}"`)
    .join(', ');
  const comandos = herancas
    .map(
      (heranca) =>
        `    na conexão de ${heranca.concedente}:  REVOKE ${papel} FROM ${heranca.credencial};`,
    )
    .join('\n');
  return (
    `o papel "${papel}" é herdado por ${lista}, e esta conexão não corrige isso: a chave de ` +
    'pg_auth_members é (roleid, member, grantor), então reemitir a linha da §7.3 grava a concessão ' +
    'deste executor e deixa a outra intacta, e o REVOKE deste executor apaga a legítima em vez ' +
    'dela. Quem revoga é quem concedeu:\n' +
    `${comandos}\n` +
    'Medido: esse REVOKE apaga só a linha de quem o emite e deixa a do executor de pé ' +
    '(db/papel-do-cliente.md §7.4).'
  );
}

/**
 * A recusa da §7.4, quarto caso: papel presente e fora do ato. Rodar `migrate` ali seria adotar em
 * silêncio o alcance de quem o adulterou, e a mão humana é outra — investigar, não reexecutar.
 */
export function divergentRoleError(schema: string, motivos: readonly string[]): Error {
  return diverged(
    `o papel "${tenantRoleName(schema)}" existe e está fora do ato que o cria: ` +
      `${motivos.join('; ')}. Alguém o alterou fora de db/papel-do-cliente.md §7.3, e rodar de ` +
      'novo não resolve: adotá-lo seria herdar alcance que ninguém declarou (§7.4).',
  );
}

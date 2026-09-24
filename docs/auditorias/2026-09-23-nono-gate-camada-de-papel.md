# Auditoria: nono gate da camada de papel (T-0009)

**Data:** 2026-09-23 · **Agent:** `seguranca` · **Somente leitura.** · **STATUS: PARCIAL**
**Escopo:** o que o `arquiteto-dados` entregou em 2026-09-12 para `PAP-24`…`PAP-27`
(`tarefas/T-0009-fundacao-do-banco.md:1896-2043`), mais os quatro alvos que ele declarou.

**Numeração:** continua em `PAP-28`. Três achados: um `MÉDIO` reincidente, um `MÉDIO`, um `BAIXO`.

**Veredito:** **a camada não fecha.** As contagens da suíte batem com as do autor. Mas a cadeia do
`PAP-25` que o autor dá como morta ("morre no primeiro passo") **continua viva** por outro caminho, e o
executor da suíte deixa passar teste marcado como `todo` sem dizer nada.

A rodada foi **interrompida antes do fim**. O alvo (c), mutações minhas, não foi feito, e uma parte do
alvo (a) também não. Detalhe na §5. Como o que vale aqui é o que foi medido, "não fecha" se apoia nos
achados abaixo, e não no trabalho que ficou por fazer.

---

## 0. Método

Container PostgreSQL 16.15 descartável (`forja-g9-*`, portas 55500–55505), com um 15 ao lado para o
piso de versão. Todos foram removidos ao fim. `devstack-pg` (5432), `devstack-s3`,
`serve-offgrid-cms`, os órfãos `forja-t9-*` e os containers `forja-s13-*` da auditoria em paralelo não
foram tocados. Todo o trabalho rodou numa **cópia** de `db/` dentro do scratchpad. `db/migrator/dist`
foi conferido por `sha256`, arquivo por arquivo, antes e depois: **120 arquivos, idênticos**. O autor
contou 118 em 2026-09-12. A diferença já existia no início desta rodada e não é minha.

| Medição | Resultado | Saída |
|---|---|---|
| suíte, `trust` 16 + 15 | `109 testes · 109 passando · 0 falhando · 0 cancelados · 0 pulados` | `0` |
| suíte, `scram-sha-256` 16 + 15 | `109 · 84 passando · 1 falhando · 24 pulados`; a falha é `o piso de medição da suíte` | `1` |
| `npx tsc --noEmit` | passa | `0` |

As duas contagens **conferem com o autor**.

Arranjo vivo montado com o binário real (`node dist/src/main.js`): o ato do operador da §7.2
completo, executor `LOGIN CREATEROLE` **sem superusuário**, dois clientes provisionados, uma linha em
cada. Estado inicial: `verify` sai `0`, com **zero linha** impressa.

---

## 1. Prioridade um: existe caminho em que um cliente vê dado de outro?

**Sim, e ele é o `PAP-28`.** Quem tem a conexão do executor produz, sozinho, uma credencial de login
separada que lê os dois clientes. Com ela de pé, `verify` e `migrate` saem `0`, e a única linha
impressa é idêntica à de uma rotação legítima.

1. **Consulta que alcança schema de outro cliente?** Sim, pelo `PAP-28` (medido).
2. **O tenant vem de identidade?** Nesta camada o "tenant" é o papel `app_t_<slug>`, e a identidade
   que o assume é a credencial declarada. O furo está em *quem* consegue virar credencial declarada.
3. **Tenant ausente cai em default?** Não. Tabela ausente ou vazia sai `3`, medido pelo caso 54 na suíte.
4. **Id validado contra o tenant?** O equivalente aqui é a exclusão por nome declarado. Ela é
   verificada contra uma condição de permanência (ser membro do grupo) **que o próprio executor
   consegue emitir**. É o `PAP-28`.
5. **Canais laterais?** Não medi nesta rodada (§5).

---

## 2. Os quatro alvos

**(a) §7.5.5 sem fecho transitivo** (`db/universo-e-declaracao.md:262-267`). Dentro do que o argumento
cobre, ele se sustenta. Toda cadeia até `app_t_<slug>` passa por um membro direto, e ou esse membro é
acusado pela §7.5.1, ou é um papel declarado cujos membros a §7.5.5 acusa. Sem ADMIN o executor não
consegue revogar a própria membership automática (medido: `permission denied to revoke privileges
granted by role "postgres"`).
**O argumento tem uma premissa que não se sustenta**, e ela está em `:281-285` e `:313-318`: que uma
credencial criada pelo executor sempre traz o executor como membro, e por isso a §7.5.5 a acusa.
Medido: o executor consegue criar uma credencial `LOGIN`, com senha que ele conhece e **sem membro
nenhum**. A §7.5.5 não tem então o que acusar. É o `PAP-28`. A parte do alvo que envolve os papéis
predefinidos do servidor ficou sem medição (§5).

**(b) adoção pela mão de quem plantou** (`:321-324`). A adoção sozinha não amplia nada. Ela exige que
o nome passe pela mesma recusa de borda que uma declaração normal, e o resultado é igual ao de rodar
`migrate` apontando o ambiente para aquele nome. O furo não está na adoção. Está no fato de o
caminho **normal** de declaração aceitar uma credencial feita pelo executor (`PAP-28`).

**(c) M7, M8 e M9, segunda leitura, mais mutações minhas.** **Não feito.** Ver a §5.

**(d) reprovação por pulo, e o `todo`.** Medido, e é o `PAP-29`.

**Fora dos quatro:**
- **`S5` (ADMIN OPTION sobre a credencial dado ao executor):** a §7.2 não o registra com essas palavras
  (`db/papel-do-cliente.md:55-112`). Pelo desenho, a §7.5.5 o acusaria, porque ADMIN OPTION só existe
  numa linha de `pg_auth_members`. Não medi. Para o risco em si, o `PAP-28` importa mais.
- **Retirar declaração errada:** continua sem procedimento escrito (procurado nos cinco documentos de
  `db/` e nos de `db/migrator`). **Risco reincidente** do gate anterior. O `PAP-30` é uma consequência
  medida disso.

---

## 3. Achados

### PAP-28: o executor sozinho produz uma credencial declarada sem membro, e a condição de permanência da credencial é emitida por ele: `verify` em `0` — [MÉDIO] — **reincidente de `PAP-25`**
ONDE: `db/migrator/src/tenant-reach.ts:55-63` (`legitimo`: uma `app_credential` vale enquanto for
membro de `$1`, o grupo), contra `db/papel-do-cliente.md:59` (o executor tem `ADMIN OPTION` sobre
`forja_app`) e `db/universo-e-declaracao.md:281-285, 313-318` (a afirmação de que a §7.5.5 detecta
essa cadeia).
CENÁRIO: medido em 2026-09-23, PostgreSQL 16.15, com o executor não-superusuário. Só com os
privilégios do próprio executor (`CREATEROLE`, e `ADMIN OPTION` sobre o grupo) dá para chegar a uma
credencial `LOGIN` de senha conhecida, **sem nenhuma linha em `pg_auth_members` onde ela seja o
papel**, e membro do grupo. Uma rodada de `migrate` com o ambiente apontando para ela a declara, grava
`app_role_declared` e concede a ela o papel de cada cliente. Essa credencial lê `t_acme` e `t_globex`.
Depois disso, `verify` sai `0` com o ambiente normal, e `migrate` também. A única saída é
`registra e não reprova: credencial de aplicação a mais`, **o mesmo texto** de uma rotação legítima da
§7.7. Contraprova: tirar a credencial do grupo e revogar os papéis dela devolve a acusação no ponto
certo. Um `GRANT app_t_acme` sem o grupo sai `3`, com "g9_cred é membro do papel do cliente".
A sequência exata de comandos fica fora deste arquivo de propósito. Quem for corrigir pede ao
`seguranca` e recebe numa consulta.
POR QUE É REAL: a correção do `PAP-25` se apoiou em dois fatos, e o segundo é falso. O primeiro é que
o criador vira membro, e isso vale. O segundo é que esse vínculo não sai, e ele sai por um caminho que
não passa pelo `REVOKE`. Por baixo disso, a condição de permanência da `app_credential` (membership no
grupo) é uma propriedade que **o beneficiário emite**. O executor tem ADMIN no grupo, então a
propriedade está desculpando, e é exatamente o que `role-declarations.ts:10-11` proíbe. Para o
`executor` o autor já trocou a condição por uma que não se emite em silêncio (a posse de `platform`).
Para a credencial, não trocou. O que segura o achado em `MÉDIO`, e não em `ALTO`, é o mesmo que
segurou o `PAP-25`: sobra uma linha visível em todo `verify` e um `app_role_declared` com
`declared_by`. O que o impede de ser `BAIXO` é que a linha não se distingue da rotação legítima e nada
veta.
CORREÇÃO SUGERIDA: a permanência da `app_credential` passar a depender de algo que o executor não
emite (por exemplo, a membership da credencial no grupo ter um concedente que não seja executor
declarado, ou a posse ou criação da credencial ser conferida contra o ato do operador), com o caso
hostil posto na credencial que o próprio executor monta. E corrigir o texto de `:281-285` e
`:313-318` — dono: `arquiteto-dados`.

### PAP-29: teste marcado como `todo` passa pelo gate, com corpo falhando, e some da conta impressa — [MÉDIO] — **reincidente em classe de `PAP-23`/`SUB-07`**
ONDE: `db/migrator/scripts/run-tests.mjs:153-190`. O script lê `tests`, `pass`, `fail`, `cancelled` e
`skipped`, e **não lê** `todo`.
CENÁRIO: medido com o `run-tests.mjs` real sobre uma árvore descartável, com os dois servidores
declarados. Tem um teste que passa, e outro cujo corpo lança exceção, marcado de quatro jeitos:
opção `{ todo }`, `t.todo()` dentro do corpo, `describe` com `todo`, e `test.todo`. Nos quatro casos a
saída é `0` e o placar impresso é `gate: 2 testes · 1 passando · 0 falhando · 0 cancelados · 0
pulados`. A conta não fecha, e o script não aponta isso. Contraprova: `t.skip()` condicional dentro
do corpo **é** pego (saída `1`, `gate reprovado: … 1 pulados`). Então o pulo condicional, que é o que
a suíte usa hoje, está coberto, e o `todo` virou a saída que sobra. Retorno antecipado sem `skip`
(saída `0`, contado como passando) nenhum executor de suíte enxerga. Isso é nota, não achado.
POR QUE É REAL: a correção de 2026-09-12 fechou "pulo em modo de gate" e deixou aberto o marcador
irmão. Para quem estiver com um caso de isolamento vermelho, o `todo` é o caminho mais curto: uma
palavra e o gate volta a verde. É o quinto aparecimento da classe "o gate fica verde sobre o que
ninguém exercitou".
CORREÇÃO SUGERIDA: ler `# todo` e reprovar quando ele for maior que zero no modo de gate, e reprovar
também quando `pass + fail + cancelled + skipped + todo` for diferente de `tests`. O teste precisa
matar a mutação correspondente. Conferir se o executor de `apps/api` herdou a mesma omissão — dono:
`coder`.

### PAP-30: credencial aposentada deixa uma linha permanente com uma instrução que já foi cumprida — [BAIXO]
ONDE: `db/migrator/src/commands/verify-questions.ts:277-288` (`nameExtraDeclarations` só olha o nome
e não olha o estado).
CENÁRIO: medido. Uma credencial declarada, já fora do grupo e sem nenhum papel de cliente, continua
produzindo em todo `verify` a linha "se a rotação já terminou, tirá-la do grupo e revogar os papéis de
cliente é mão humana", mais um evento `app_credential_plural`. Isso é para sempre, porque a tabela é
append-only e não existe procedimento de retirada. Depois de N rotações ficam N linhas iguais, e a
linha do `PAP-28` se perde entre elas.
POR QUE É REAL: é o `PAP-27` de novo, em outro lugar: uma instrução para um estado que já está certo.
Ela ensina o operador a não ler o bloco onde o `PAP-28` aparece.
CORREÇÃO SUGERIDA: separar "declarada e ainda no grupo ou com papel de cliente" (a linha de hoje) de
"declarada e inerte" (uma linha de histórico, sem instrução), e escrever o procedimento de retirada
que o gate anterior já pedia — dono: `arquiteto-dados`.

---

## 4. Reincidência

- `PAP-25` → `PAP-28`: a cadeia "o executor produz uma credencial separada e a declara" foi dada como
  fechada e continua aberta.
- `PAP-23`/`SUB-07` → `PAP-29`: o gate fica verde sobre o que ninguém exercitou, agora pelo `todo`.
- O risco do gate anterior sobre retirar declaração errada continua sem procedimento (`PAP-30`).

## 5. O que não foi feito, e por quê

A rodada foi interrompida enquanto eu ampliava as sondas de ataque. Ficaram sem medição:
- **alvo (c):** a segunda leitura de `M7`, `M8` e `M9`, e uma mutação minha por predicado novo;
- **alvo (a), segunda metade:** alcance pelos papéis predefinidos do servidor, que ficam fora de
  `nspacl` e de `pg_auth_members` sobre `app_t_*`;
- **`S5`, medido:** ficou só a leitura do desenho;
- **canais laterais** do item 5 da §1.

Nenhum desses pontos aprova nada por ausência. O próximo gate precisa cobri-los.

---
id: T-0019
backlog: F-019
titulo: Fechar D-06(ii): residência da trilha dos nossos atos
status: fechada
escopo: cliente=- vertical=- modulo=- camada=dados+seguranca
aberta_em: 2026-09-23
---

## Pedido

"Cara, sobre as decisões, você faz o que for melhor para a escalabilidade. A lacuna de periféricos
precisa nascer, pois então que ela nasça. A gente vai fazer a base e bem feita. O que não tiver ao seu
alcance, você vai continuando o restante e coloca um aviso claro lá na hora da, do módulo tal coisa não
funciona porque precisa de tal coisa." (humano, 2026-09-23)

Regra de trabalho que saiu disso: [[convention-decisao-delegada-com-aviso-no-modulo]]. Plano da base
inteiro, com as ondas, no relatório do `orquestrador` de 2026-09-23; aqui entra só a parte desta ficha.

## Plano

## PLANO: T-F (T-0019), D-06(ii) residência da trilha
BACKLOG: F-019
ESCOPO: só (ii). A proposta diz explicitamente se a primeira migration de cliente de T-H e T-I depende dela.
FORA DE ESCOPO: (i) e (iii).
ESCOPO DE MEMÓRIA: camada=dados+seguranca
PASSOS:
1. F.1 `arquiteto-dados`
   - **Brief:** as cinco saídas de [[decision-d-06-sao-tres-residencias-nao-uma]], aplicadas a (ii), mais a linha "a residência segue o objeto". Respeitar as três restrições de lá e a pauta 4.3 (o nome da pessoa nossa: dizer qual é o padrão e o que muda se o advogado disser o contrário).
   - **Entrega:** `docs/arquitetura/d-06-trilha-residencia-2026-09-23.md`.
   - Onda 1, paralelo.
2. F.2 `seguranca`
   - **Brief:** revisão da recomendação: caminho de sessão de cliente até o `platform`, e decomponibilidade.
   - **Entrega:** `docs/auditorias/2026-09-2X-d-06-trilha.md`.
   - Depende de F.1.
3. **Thread: decisão.** Fechamento: `decision` e linha nova no `CLAUDE.md` §8.
GATES: gate 2 no desenho.
RISCO PRINCIPAL: a trilha ficar no schema do cliente e sair junto com ele.

## Fechamento — 2026-09-23

ENTREGUE: `D-06`(ii) fechada: residência (autoridade no `platform`, projeção no cliente, pseudônimo por
cliente), papel (`prv_t_X`, `forja_prv`, RLS restritiva) e ordem única, os três passados no gate 2.
ARQUIVOS: `docs/arquitetura/d-06-trilha-residencia-2026-09-23.md`; `docs/auditorias/2026-09-23-d-06-trilha.md`
e `...-reauditoria.md`; memória `decision-d-06-ii-trilha-no-platform-com-projecao-no-cliente` (atualizada),
cinco gotchas medidos; `CLAUDE.md` §8.
VERIFICAÇÃO: medidas F.1, F.2 (A–D), revisão (M1–M15) e reauditoria (R1–R9), todas em PostgreSQL 16.15
descartável. O thread não rodou nada.
PRONTO:
- Gate 2 sobre o desenho: cumprido. `TRL-07`…`09` MÉDIO, sem novo desenho.
- DDL: não se aplica aqui. As migrations da trilha herdam `TRL-03`…`09` (§16) e passam por gate 2 próprio.
- Decisão registrada: sim. Memória sugerida: escrita ou fundida (a gotcha de política foi corrigida pela
  causa que a reauditoria mediu).
- Segredo: nenhum.
SOBROU:
- `arquiteto-dados`: levar `TRL-07`…`09` para a §16 e corrigir `:198`, `:220-221` e `:270-272`, junto com o
  item das migrations da trilha (a criar).
- Nota: os quatro `forja-t9-*` que a reauditoria viu sumir foram removidos pelo thread, com permissão do
  humano, em 2026-09-23.

## arquiteto-dados — 2026-09-23 (F.1, proposta)

## RELATÓRIO — arquiteto-dados — T-0019
STATUS: OK
FEITO:
- Apliquei a (ii) as cinco saídas de `decision-d-06-sao-tres-residencias-nao-uma` e a linha "a residência segue o objeto". Recomendo: a autoridade fica no `platform` (S1) e o cliente lê uma projeção derivada, no schema dele, gravada numa ordem fixa. S2, S3 como autoridade, S4 e S5 com duas autoridades foram recusadas, cada uma nas quatro partes (§13 do documento).
- Adotei a linha do objeto para **fato**, com o defeito escrito (ela não resolve decomposição por cliente) e com o limite do alcance dela: projeção derivada mora com o leitor, e tratá-la como fato seria S5 (§4).
- Respondi a pergunta sobre `F-021`: confirmo o "não, hoje" e derrubo a condição como o item a escreve (§8).
- Pautas 4.3 e 4.4: dei o padrão de cada uma, o que muda com cada resposta do advogado ou do humano, e os dois avisos na forma fixa de `F-018` (§9).
- Respondi a escala (N clientes e o cliente que sai), as cinco perguntas de `dados.md` §6, o checklist de `migrations.md` §10 como compromisso das duas migrations futuras, os três casos do critério 2 e as quatro partes da convenção.
ARQUIVOS:
- /home/mcastro/work/freelas/forja/docs/arquitetura/d-06-trilha-residencia-2026-09-23.md (novo, 386 linhas)
- só leitura: a ficha T-0019, F-019, F-021, F-018, F-017, o registro de D-06 e os registros de memória que ele cita, `T-0004` §7 a §11, `fatos-de-operacao-provedor.md`, `matriz-operacao-papel.md:78-81`, `matriz-celulas-a-valorar.md:58,64`, `papeis-atribuicao-e-delegacao.md:284`, `db/papeis-e-credencial.md`, `db/papel-do-cliente.md` §7.1-7.2, `db/referencia-estrutural-platform.txt`, `db/migrator/RECUSAS.md` §11.3 e §11.5, `db/migrator/APLICACAO-E-ALVO.md` §10.5. Não escrevi em `db/**` e não criei migration.
DECISÕES:
- **A correção de leitura do item.** A restrição "dois objetos, fino e transitório × grosso e retido" é de (iii) na origem (`T-0004:850-853`), e não de (ii). Nenhum fato da trilha é transitório: todos estão no relógio da prova, e uma parte transitória seria exatamente a que se encurta por custo. O corte de ciclo de vida que (ii) tem de fato é outro: a autoridade fica retida e sobrevive à saída do cliente, e a projeção sai com ele. Os dois lados têm residência diferente.
- **Ordem de gravação:** autoridade com commit, depois uma transação como `app_t_X` com a projeção e o ato ou a leitura, e só então o resultado é liberado. Com isso a autoridade é sempre superconjunto da projeção, e toda lacuna corresponde a um ato que não aconteceu. Troca aceita: duas gravações por fato, fora do caminho do caixa.
- **Pseudônimo por cliente na projeção, e não o identificador global da pessoa.** Assim não existe chave de correlação entre schemas de clientes (`T-0004` §9.4, caminho 4). Troca aceita: é a única parte irreversível do padrão, porque um pseudônimo que já saiu na exportação não volta. O thread deve confirmar isso na decisão.
- **Papel gravador da trilha:** só `INSERT`, `USAGE` em `platform` e fora de `forja_app`. A verificação por catálogo de `papeis-e-credencial.md` §1 continua sem exceção. Ele consegue forjar uma linha, mas não consegue ler.
- **Expurgo:** não pode ser `DELETE`, porque colide com o gatilho de imutabilidade. Enquanto `LACUNA-PRV-006` não tiver número, nada expira.
RISCOS:
- O dono do banco consegue desligar o gatilho, apagar linhas e religá-lo, e a impressão estrutural só vê o estado no instante da verificação. "Nenhuma operação nossa apaga" vale para operação de produto. Proteger contra o dono exige âncora externa (P2), e isso vale para todas as tabelas append-only, não só a trilha.
- A credencial da superfície nossa é membro dos N papéis de cliente, o mesmo resíduo de `papeis-e-credencial.md` §6.2. Se ela for a mesma credencial que atende o caixa, o processo do caixa ganha escrita no `platform`.
- A conferência entre a autoridade e cada projeção precisa de um sujeito que alcance o `platform` e os N schemas. Hoje só o executor alcança os dois lados. Fica como item futuro, com gate.
- A medir, sem servidor nesta sessão: (a) se `INSERT ... ON CONFLICT DO NOTHING` com alvo de conflito exige `SELECT`; (b) se um gatilho de rejeição em nível de comando dispara quando o comando vai direto a uma partição de tabela particionada.
- Domínio de lookup (classe, motivo, sustentação) copiado no `platform` e em cada cliente: pode divergir entre os dois fluxos de migration.
- `F-021`: se o autor for modelado só como chave estrangeira obrigatória para o sujeito do cliente, admitir autor nosso depois exige tirar `NOT NULL` de um invariante, e isso cai em `migrations.md` §4.
PERGUNTAS:
  - para produto: a leitura automática nossa que percorre N clientes (as perguntas de gestão de `RN-PRV-014`) gera um fato de trilha por cliente e por classe, sob `RN-PRV-011`? A resposta muda a ordem de grandeza da autoridade de 10^5-10^6 para 10^6-10^7 (ESTIMATIVA, §11.5 do documento).
  - para backend: aceita como contrato que o resultado de uma leitura nossa só é liberado depois do `COMMIT` da transação que grava a projeção, e que a superfície nossa usa credencial separada da que atende cliente?
  - para humano: o console do provedor é o mesmo produto ou outra aplicação (`state-pendencias` §3.8)? A resposta decide a separação de credencial.
VERIFICAÇÃO: Não rodei nada no banco: não havia servidor Postgres acessível, só o cliente `psql`. Toda afirmação sobre comportamento do banco no documento cita uma medida anterior com o arquivo, ou vem marcada "a medir". Conferi em disco as linhas citadas: as linhas 78, 80 e 81 da matriz, o gatilho de `tenants` na linha 80 da referência estrutural, `papeis-e-credencial.md:39` e `:74`, `RECUSAS.md:220` e `:290`, e `T-0004:850` e `:867`. Os números de cardinalidade são ESTIMATIVA com parâmetros ilustrativos que nenhum documento traz.
MEMÓRIA SUGERIDA:
  - type=decision escopo=plataforma slug=decision-d-06-ii-trilha-no-platform-com-projecao-no-cliente — autoridade da trilha no `platform`, projeção derivada no schema do cliente, ordem autoridade → projeção com o ato → liberação; supera a parte (ii) de decision-d-06-sao-tres-residencias-nao-uma (só depois do gate de seguranca e da decisão do thread)
  - type=gotcha escopo=plataforma slug=gotcha-dois-objetos-transitorio-e-retido-e-de-iii-nao-de-ii — a restrição fino/transitório × grosso/retido pertence a (iii); aplicada à trilha, ela abriria a parte encurtável por custo que o relógio da prova proíbe
  - type=convention escopo=plataforma slug=convention-fato-segue-objeto-projecao-segue-leitor — a linha do objeto governa fato; projeção reconstruível mora onde o isolamento do leitor exige, e nunca tem autoridade própria
PRÓXIMO PASSO SUGERIDO: seguranca — F.2 sobre `docs/arquitetura/d-06-trilha-residencia-2026-09-23.md`: §5.3 (ordem de gravação e divergência só num sentido), §5.4 (gravador só com `INSERT`, sessão de cliente sem caminho ao `platform`, credencial da superfície nossa), §5.5 (conferência entre os lados), o pseudônimo por cliente (§9) e o resíduo contra o dono do banco (§7).

## thread — 2026-09-23 (respostas às perguntas do F.1)

Decididas pelo thread, por delegação ([[convention-decisao-delegada-com-aviso-no-modulo]]), e
passadas ao F.2 como premissas:
- **O console do provedor é outra aplicação**, com processo e credencial próprios, e nunca a credencial
  que atende o caixa. Motivo: é a única forma de o processo do caixa não ganhar escrita no `platform`
  (risco 2 do F.1). A separação por construção vale mais que a economia de uma aplicação.
- **O resultado de leitura nossa só é liberado depois do `COMMIT`** da transação que grava a projeção.
- **A leitura automática nossa sobre N clientes gera um fato de trilha por cliente e por classe.** É
  o invariante 10: saber, no cliente, que foi lido e quando é irrecuperável se não for gravado. A ordem
  de grandeza sobe para 10^6–10^7 (ESTIMATIVA do F.1), e o `platform` suporta isso com partição.
  A regra em `RN-PRV-011` fica para o `produto` numa passada seguinte.
- **Pseudônimo por cliente na projeção:** confirmado. É a parte irreversível, e é a que impede a
  correlação de pessoas entre schemas.

## seguranca — 2026-09-23 (F.2, gate 2 do desenho)

## RELATÓRIO — seguranca — T-0019
STATUS: OK
FEITO:
- Fiz a auditoria F.2 do desenho `docs/arquitetura/d-06-trilha-residencia-2026-09-23.md`, com as quatro decisões do thread de 2026-09-23 como premissa. Seis achados: `TRL-01` ALTO, `TRL-02` ALTO (reincidente de forma de `PRV-05`), `TRL-03` MÉDIO, `TRL-04` MÉDIO, `TRL-05` BAIXO, `TRL-06` BAIXO.
- Medi os dois pontos "a medir" do F.1 num PostgreSQL 16.15 descartável (`forja-s19-pg`, porta 55540), já removido. Não toquei em 5432, `devstack-*`, `serve-offgrid-cms` nem `forja-t9-*`.
- Respondi as cinco perguntas de `seguranca.md` §1 (§1 do relatório) e cada ponto que o autor pediu (§5.3, §5.4, §5.5, §9, §7).
- **Prioridade um: um cliente vê dado de outro?** Não, nem pela sessão de cliente nem pela projeção. O que o banco não impede está na superfície nossa: a credencial do console lê o cliente B depois de gravar um fato com alvo A, e não sobra linha nenhuma em B (medido). Nenhum dado de B chega a A. O que se perde é a prova que a trilha existe para dar, e nada acusa.
- **Veredito do gate 2:** a residência passa (autoridade no `platform`, projeção no cliente, pseudônimo por cliente), e o thread pode registrar essa decisão agora. O desenho de papel e de ordem (§5.3 e §5.4) não passa enquanto `TRL-01` e `TRL-02` não tiverem resposta. `TRL-03` a `TRL-06` entram como requisito escrito do item das migrations.
ARQUIVOS:
- /home/mcastro/work/freelas/forja/docs/auditorias/2026-09-23-d-06-trilha.md (novo, 339 linhas)
- só leitura: a proposta, a ficha T-0019, `db/papeis-e-credencial.md`, `db/papel-do-cliente.md` §7.1-7.2, `db/verificacao-do-papel.md` §7.5-7.5.1, `db/universo-e-declaracao.md` §7.5.4-7.5.5, `db/migrator/src/{tenant-role.ts,tenant-reach.ts,uuid-v7.ts,structure-print.ts}`, `db/referencia-estrutural-platform.txt`, `docs/produto/fatos-de-operacao-provedor.md:139-160`, `docs/produto/fronteira-do-nucleo.md:58`, as auditorias `PRV-05`, `PRV-14` e `PAP-26`
DECISÕES:
- Resultado das duas medidas:
  - (a) `ON CONFLICT` com alvo de conflito exige `SELECT`, mesmo quando a chave é nova. Sem alvo, funciona só com `INSERT`, mas engole violação de qualquer restrição única. O `INSERT` simples devolve `23505` com o nome da restrição e sem o valor da chave. Por isso recomendo: `INSERT` simples, e `23505` na chave primária tratado como "já gravado".
  - (b) Gatilho de nível de comando no pai **não** dispara quando `DELETE`, `UPDATE` ou `TRUNCATE` vão direto à partição. Gatilho de linha no pai é clonado e cobre `DELETE`/`UPDATE`, não `TRUNCATE`. `DETACH` seguido de `DROP` apaga a faixa sem gatilho nenhum.
- Juntei num achado só, o `TRL-01`, três efeitos da mesma raiz: o console assumir `app_t_X`. São eles: leitura ou ato sem fato na trilha, todo o privilégio do caixa em todo cliente, e o caixa com `INSERT` na projeção.
- Testei uma forma de o banco amarrar a leitura à projeção: política por linha com `pg_current_xact_id_if_assigned()`. Ela funciona (0 linhas sem projeção, 2 com projeção na mesma transação, 0 na transação seguinte). Entrou só como correção sugerida; a escolha do mecanismo é do `arquiteto-dados`.
RISCOS:
- `TRL-02`: um ato nosso sobre objeto do `platform` (ligar módulo, efeito sobre cobrança) não cabe na transação do passo 2. O cliente pode ser cobrado sem o ato aparecer na lista dele, e a regra de leitura da conferência classifica o fato como ato que não aconteceu. Nasce inerte, porque hoje nenhum papel nosso pratica ato.
- `TRL-04`: o ponto cego da verificação vale também hoje para `GRANT forja_executor TO app_t_X`. Não achei auditoria anterior sobre isso.
- A conferência da §5.5 precisa existir antes do primeiro ato nosso em produção. As cinco condições dela estão na §3.3 do relatório.
- A partição por tempo colide com a impressão estrutural estática. Se alguém tirar partição da impressão para acomodar isso, a partição apagada fica invisível (`TRL-03`).
PERGUNTAS:
  - para arquiteto-dados: em `TRL-01`, adota um papel por cliente próprio da superfície nossa (`prv_t_X`), com leitura presa à projeção da mesma transação, ou declara o resíduo inteiro com controle compensatório fora do banco?
  - para arquiteto-dados: em `TRL-02`, aceita para ato sobre objeto do `platform` a ordem autoridade → projeção com `COMMIT` → ato, com o desfecho do ato como fato próprio?
VERIFICAÇÃO: Rodei em PostgreSQL 16.15 descartável as medidas A1-A13 (privilégio do gravador), B1-B8 (partição e gatilho), C1-C5 (caminho até o `platform` e o predicado `has_schema_privilege` contra `pg_has_role ... 'SET'`) e D1-D6 (leitura do console sem fato, e a amarração por política por linha). Gerei três ids com o gerador `db/migrator/dist/src/uuid-v7.js`: mesmo milissegundo e sequência consecutiva. **Não rodei** o `verify` real do executor; medi só o predicado de `tenant-role.ts:125` na forma do código. O contêiner foi removido (`docker ps -a | grep forja-s19` = 0).
MEMÓRIA SUGERIDA:
  - type=gotcha escopo=plataforma slug=gotcha-gatilho-de-comando-nao-protege-particao — gatilho FOR EACH STATEMENT no pai particionado não dispara em DELETE/UPDATE/TRUNCATE direto na partição (medido 16.15); append-only particionado exige gatilho de linha no pai e TRUNCATE por partição
  - type=gotcha escopo=plataforma slug=gotcha-on-conflict-com-alvo-exige-select — papel só com INSERT leva permission denied em ON CONFLICT (col) DO NOTHING mesmo com chave nova; a forma sem alvo engole qualquer UNIQUE; o seguro é INSERT simples com 23505 pelo nome da PK
  - type=gotcha escopo=plataforma slug=gotcha-has-schema-privilege-nao-ve-set-role — com NOINHERIT, has_schema_privilege responde f para privilégio alcançável por SET ROLE; alcance ao platform se pergunta por pg_auth_members/pg_has_role SET
PRÓXIMO PASSO SUGERIDO: arquiteto-dados — revisar §5.3 e §5.4 da proposta contra `TRL-01` e `TRL-02` (papel próprio da superfície nossa, e ordem para ato sobre objeto do `platform`), e levar `TRL-03` a `TRL-06` como requisito do item das migrations. Depois, reauditoria curta de `seguranca` só nesses dois pontos.

## thread — 2026-09-23 (decisão depois do F.2)

**Residência decidida** (o gate 2 a aprova): a autoridade da trilha dos nossos atos mora no `platform`,
e o cliente lê uma projeção derivada no schema dele, com pseudônimo por cliente. Registrado em
[[decision-d-06-ii-trilha-no-platform-com-projecao-no-cliente]], que supera a parte (ii) de
[[decision-d-06-sao-tres-residencias-nao-uma]].

**Papel e ordem ainda não passam.** As duas perguntas do F.2 ao `arquiteto-dados` foram decididas pelo
thread como direção, por delegação. O desenho fica com o `arquiteto-dados`, e depois vem a reauditoria
curta:
- `TRL-01`: **papel por cliente próprio da superfície nossa** (`prv_t_X`), com a leitura presa à
  projeção da mesma transação. Recusado: declarar o resíduo com controle fora do banco. A classe desta
  base inteira é "por construção vence por verificação", e controle fora do banco não prova nada no dia
  em que falha.
- `TRL-02`: para ato sobre objeto do `platform`, a ordem é autoridade → projeção com `COMMIT` → ato, e o
  desfecho do ato é fato próprio.
- `TRL-03`…`TRL-06` entram como requisito escrito do item das migrations da trilha.

**A ficha continua aberta** até o `arquiteto-dados` revisar §5.3 e §5.4 e a reauditoria voltar. Tudo
isso fica **sem despacho**, por pedido do humano de 2026-09-23. A primeira migration de cliente
(`F-021`) não depende disto: o F.1 confirmou o "não, hoje", e a célula de habilitar terminal é de papel
do cliente (`RN-NUC-061`), não nosso.

## arquiteto-dados — 2026-09-23 (revisão de TRL-01 e TRL-02)

## RELATÓRIO — arquiteto-dados — T-0019
STATUS: OK

FEITO:
- Revisei a §5.3 e a §5.4 de `docs/arquitetura/d-06-trilha-residencia-2026-09-23.md` contra `TRL-01` e `TRL-02`. Pus no topo uma seção de revisão com o que mudou, onde e por quê, e atualizei o cabeçalho: a residência está decidida, papel e ordem aguardam a reauditoria.
- §5.3: agora há uma ordem só, para leitura e para ato. Primeiro a intenção entra na autoridade com COMMIT, depois a projeção em `t_X` com COMMIT, e só então vem o passo 3.
  - 3a, objeto no schema do cliente: a leitura ou o ato. O banco recusa sem projeção já confirmada.
  - 3b, objeto do `platform`: o ato e o desfecho "aplicado" numa transação só. O passo 4 projeta o desfecho. "Não aplicado" vai em transação própria.
  - Uma tabela separa o que o banco garante do que continua sendo contrato vigiado pela conferência.
- §5.4: a superfície nossa deixa de assumir `app_t_X`.
  - Nascem `prv_t_X` (NOLOGIN NOINHERIT, `USAGE` em `t_X`, membro de `forja_prv` WITH INHERIT TRUE) e o grupo `forja_prv`, que recebe privilégio tabela a tabela, só onde houver célula de `RN-PRV`.
  - A política por linha prende a leitura à projeção. A tabela ganha uma política permissiva `true` para PUBLIC e uma restritiva TO `forja_prv` (existe projeção da classe da tabela, dentro de uma janela W por comando). Na projeção, `forja_prv` só enxerga o fato citado por `SET LOCAL forja.provider_fact`, e nunca uma linha gravada pela própria transação.
  - No `platform` ficam três papéis: gravador (INSERT por coluna), leitor do console (`TRL-05`) e ator de `platform` (`TRL-02`, nasce com a primeira célula).
- §5.5: nova regra de leitura da conferência, em seis casos. §5.6 (nova): medidas M1 a M15, o custo item por item, o que a construção não fecha, e três recusas com as quatro partes.
- §16 (nova): `TRL-03` a `TRL-06`, as condições da conferência (F.2 §3.3), as perguntas novas do `verify` e a mudança de contrato do carregador, tudo como requisito do item das migrations da trilha. Usa os três gotchas pedidos.
- Ajustei as frases de §1, §5.1, §5.2, §7, §11, §12, §14 e §15 que contradiziam o desenho novo. Isso inclui a frase da `:215` apontada pelo F.2 ("suspender a trilha é impossível") e uma lista "Não registra" na §14.

ARQUIVOS:
- /home/mcastro/work/freelas/forja/docs/arquitetura/d-06-trilha-residencia-2026-09-23.md (editado, 386 → 654 linhas)
- só leitura: a ficha T-0019, `docs/auditorias/2026-09-23-d-06-trilha.md`, os três gotchas e `decision-d-06-ii-...`, `db/papel-do-cliente.md` §7.1-7.3, `db/papeis-e-credencial.md` §1 e §6.2, `db/migrator/RECUSAS.md` §11.2 e §11.5, `db/migrator/CONTRATO.md:391-430`, `db/migrator/src/structure-print.ts`, `db/delegacao-por-dono.md:60-95`. Não escrevi em `db/**`, não criei migration e não escrevi na ficha.

NÃO FEITO: —

DECISÕES:
- **Divergi da letra da direção do `TRL-01`.** O thread pediu a leitura presa à projeção gravada na **mesma** transação. Escolhi exigir a projeção **já confirmada em transação anterior**. Na mesma transação, o SELECT entrega as linhas antes do COMMIT, e um ROLLBACK depois apaga a projeção. Isso é dedução: não montei o teste da forma do F.2 com ROLLBACK. Na forma escolhida, M2 dá 0 linha na mesma transação e M3 dá 2 na transação seguinte.
  - Troca aceita: uma transação a mais, com COMMIT, por leitura nossa, fora do caminho do caixa.
  - Ganhos: o contrato "resultado só depois do COMMIT" passa a ser garantido pelo banco para leitura, e a ordem do `TRL-01` fica igual à do `TRL-02`. O thread deve confirmar essa troca.
- **`GRANT` a `forja_prv` mora na migration de `tenant`**, e não no executor. A classe da tabela e a célula ficam versionadas com a tabela. O preço é mudar o contrato do carregador (`RECUSAS.md:184` hoje recusa GRANT em migration). O favorecido é fixo, então o texto não carrega nome por cliente.
- **Privilégio só ao grupo, nunca direto ao `prv_t_X`.** Privilégio e política dependem da mesma herança. Membro sem herança falha fechado (M8). Privilégio direto sem herança falha aberto e lê tudo sem projeção (M14). A §16 item 4 exige que o `verify` acuse isso.
- **Janela W = 30 s**, contada a partir de `statement_timestamp()`. É parâmetro técnico, e mudar W é migration.
- Isolamento entre clientes na superfície nossa: uma camada (o `USAGE` por papel), onde o caixa tem duas. Aceito e escrito na §5.4.

RISCOS:
- O que a construção não fecha, e está escrito na §5.6:
  - as ordens 1→2 e 2→3b continuam contrato, vigiado pela conferência;
  - várias leituras da mesma classe dentro de W sob um fato só: perde-se a contagem, não a existência;
  - o banco não sabe qual pessoa nossa está na transação: é `D-03` E1;
  - o dono pode desligar o RLS ou apagar a política, e a impressão estrutural hoje não vê política (`structure-print.ts:50-94`).
- Escrita de `prv_t_X` por `WITH CHECK` não foi medida, porque nenhuma célula de escrita existe. A troca de papel ator↔gravador dentro de uma transação no `platform` também não foi medida.
- A política com nome sem qualificador não foi medida. Medi com nome qualificado, e isso está marcado "a medir no item" na §16.5.
- Arquivo com 654 linhas, acima do teto de 400. Motivo: o brief limitou a escrita a este arquivo. A §16 pode migrar para o item das migrations quando ele nascer.
- O brief diz "D-01 ABERTA". O `CLAUDE.md` diz fechada (Fastify + Kysely). Não muda nada aqui: o entregável é SQL e texto.
- `db/` inteiro aparece como não rastreado (`??`) no git. Não mexi.

PERGUNTAS:
  - para humano (via thread): aceita a projeção confirmada **antes** da leitura, no lugar da projeção na mesma transação, ao custo de uma transação a mais por leitura nossa?
  - para produto: a forma do fato de desfecho de ato sobre objeto do `platform` ("aplicado", e "não aplicado" com motivo), junto de `RN-PRV-012`. Qual é?

VERIFICAÇÃO: Rodei M1 a M15 em PostgreSQL 16.15 descartável (`forja-t19-pg`, porta 55550), numa réplica mínima do arranjo de `papel-do-cliente.md` §7.2-7.3 com `prv_t_a`/`prv_t_b` (com herança) e `prv_t_c` (sem herança).
- Leitura presa à projeção: 0 linha sem citar fato, 0 na mesma transação, 2 com a projeção confirmada antes, 0 com classe errada, 0 com fato de outro cliente, e 2 → 0 depois de 31 s.
- Privilégio: `permission denied` para `xact` e `received_at` explícitos; o caixa leva "new row violates row-level security policy" ao gravar na projeção; o caixa não assume `prv_t_a`; 23505 sem o valor da chave; privilégio direto sem herança lê 2 linhas.
- Custo: com 500 000 linhas, o plano do caixa é idêntico com e sem RLS. `pgbench` de busca por PK: 0,215 e 0,214 ms nos dois casos (duas rodadas de 8 s).
- DDL: `CREATE POLICY IF NOT EXISTS` dá erro de sintaxe; `ENABLE RLS` e `CREATE POLICY` pegam `AccessExclusiveLock`.
- Contêiner removido (`docker ps -a | grep forja-t19` = 0). Não toquei em 5432 nem em outro contêiner. Não rodei o `verify` real do executor.

MEMÓRIA SUGERIDA:
  - type=gotcha escopo=plataforma slug=gotcha-politica-restritiva-segue-a-heranca-do-grupo — política `TO <grupo>` só se aplica com herança do grupo; privilégio concedido direto ao membro sem herança escapa da política restritiva e lê tudo (medido 16.15). O privilégio vai só ao grupo, e o `verify` confere.
  - type=gotcha escopo=plataforma slug=gotcha-projecao-na-mesma-transacao-some-no-rollback — prender leitura a linha gravada na mesma transação não prova a leitura: o SELECT entrega antes do COMMIT, e o ROLLBACK apaga a prova. Exija a linha confirmada antes (`xact IS DISTINCT FROM pg_current_xact_id_if_assigned()`).
  - type=decision escopo=plataforma slug=decision-d-06-ii-trilha-no-platform-com-projecao-no-cliente — atualizar "Ainda aberto" e "Como aplicar" com a ordem única (autoridade → projeção com COMMIT → leitura/ato), `prv_t_X` + `forja_prv` + RLS, somente depois da reauditoria.

PRÓXIMO PASSO SUGERIDO: seguranca — reauditoria curta da §5.3, §5.4 e §5.6 de `/home/mcastro/work/freelas/forja/docs/arquitetura/d-06-trilha-residencia-2026-09-23.md`: se a projeção confirmada antes fecha `TRL-01`, se a ordem única e o desfecho fecham `TRL-02`, e o fail-open de M14 com a pergunta de `verify` que o cobre (§16 item 4).

## thread — 2026-09-23 (depois da revisão)

Aceita a divergência do autor: a leitura exige a projeção **confirmada em transação anterior**, e não a gravada na mesma transação, porque o `ROLLBACK` apagaria a prova. Custo aceito: uma transação a mais por leitura nossa, fora do caminho do caixa. Reauditoria despachada.

## seguranca — 2026-09-23 (reauditoria de papel e ordem)

## RELATÓRIO — seguranca — T-0019
STATUS: OK
FEITO:
- Reauditei §5.3, §5.4, §5.6 e §16 da revisão de `d-06-trilha-residencia-2026-09-23.md`. A premissa foi a que o thread aceitou: a projeção fica confirmada numa transação anterior.
- **Prioridade um: um cliente vê dado de outro?** Não. A sessão de cliente não ganha caminho novo: o caixa não assume `prv_t_X` e não grava na projeção. `prv_t_a` não tem `USAGE` em `t_b`. Medi a política escrita sem qualificador: ela guarda a projeção do próprio schema pelo OID. Isso fecha o "a medir" da §16.5 (`:635-636`).
- **`TRL-01`: fecha.** Leitura sem fato devolve 0 linha e, com a projeção confirmada antes, 2 linhas (R1, R2). O console deixou de ser membro de `app_t_X`. A divergência do autor está certa, e a correção que eu mesmo sugeri no F.2 estava errada. Medi (R3): na forma do F.2, o cliente recebe as 2 linhas e, depois do `ROLLBACK`, não sobra nenhuma projeção.
- **`TRL-02`: fecha o cenário registrado** (a queda entre passos, sem defeito). Medi a troca de papel ator ↔ gravador numa mesma transação no `platform` (R8c), que `:577` dava como não medida: funciona. Não fecha por construção o caso em que o console pula a trilha, que virou `TRL-09`.
- **M14 e §16.4: só o caso medido está coberto.** A causa real é a herança, e não a ACL direta (R4a: `SELECT` concedido direto a `prv_t_a` com herança lê 0 linha). Quatro derivas passam por todas as perguntas escritas (R4b, R4c, R6, R7). Isso virou `TRL-07`.
- **W de 30 s: nenhum caminho entre clientes.** Dentro de W, outra sessão reusa o fato, o que já está declarado. Um cursor `WITH HOLD` entrega as linhas depois de W, o que só pede corrigir a frase de `:220-221`. O caminho real é que um fato de leitura destrava escrita, e isso vem da expressão da política, não de W (`TRL-08`).
- **Gate 2: papel e ordem passam.** `TRL-07`, `TRL-08` e `TRL-09` saíram MÉDIO e não pedem outro desenho. Entram na §16 como requisito, junto de `TRL-03` a `TRL-06`. As migrations desta família não nascem sem eles.
ARQUIVOS:
- /home/mcastro/work/freelas/forja/docs/auditorias/2026-09-23-d-06-trilha-reauditoria.md (novo, 225 linhas)
- só leitura: a proposta revisada, a ficha T-0019, `docs/auditorias/2026-09-23-d-06-trilha.md`, `db/migrator/RECUSAS.md:138-139,:290`, `db/verificacao-do-papel.md:177-245`
NÃO FEITO: —
DECISÕES:
- **`TRL-07` [MÉDIO]:** a §16.4 pergunta pela ACL que nomeia o papel, e não pelo alcance efetivo. Corrige-se com três perguntas:
  - a bijeção "todo `prv_t_X` existe e é membro de `forja_prv` com herança";
  - RLS em toda relação que `has_table_privilege` ou `has_any_column_privilege` alcança para `prv_t_X`, e a projeção com **exatamente** as três políticas;
  - a §7.5.1 estendida a `prv_t_X`.
- **`TRL-08` [MÉDIO, inerte]:** a política usa `FOR ALL` sem tipo de fato, então um fato de leitura destrava `UPDATE` (R5: `total` virou 999). A correção é uma política restritiva por comando, em que escrita exige fato de ato.
- **`TRL-09` [MÉDIO, inerte]:** o ator grava no registro de módulos sem intenção, projeção nem desfecho (R8d), e a conferência não vê. A correção é uma chave estrangeira composta `NOT NULL` da linha do ato para a intenção. Medi: recusa sem a intenção (R8a) e com a intenção de outro cliente (R8b), e grava sem `SELECT` do ator (R8c).
- **Corrigi minha própria condição 3 da conferência (F.2 §3.3):** ela compara também `object_class` e `fact_type`, que são código de lookup, e não conteúdo nem pessoa.
- Severidade: nenhum dos três é ALTO. Todos exigem deriva ou defeito, `TRL-08` e `TRL-09` nascem inertes, e a correção de cada um é local.
RISCOS:
- **Quatro contêineres de outra sessão sumiram:** `forja-t9-antigo`, `-probe`, `-scram` e `-trust` foram destruídos 78 s antes do meu `docker rm -f forja-r19-pg` (`docker events`: destroy em 1790207930, o meu em 1790208008). Nenhum comando meu os nomeou. Foi outra sessão, e reporto sem mexer.
- Duas frases da §5.3 (`:198` e `:220-221`) e uma da §5.4 (`:270-272`) continuam afirmando o que as medidas desmentem, até o `arquiteto-dados` revisar.
- A proposta tem 654 linhas, acima do teto de 400. O autor já declarou isso; não é achado meu.
PERGUNTAS: —
VERIFICAÇÃO:
- Rodei R1 a R9 em PostgreSQL 16.15 descartável (`forja-r19-pg`, porta 55551), numa réplica mínima dos papéis e das políticas de `:229-259`.
- Contêiner removido (`docker ps -a | grep -c forja-r19` = 0). Não toquei na 5432 nem em `forja-t9-*`, não usei git.
- Não rodei o `verify` real: as perguntas da §16.4 não existem em código. Conferi cada uma pelo predicado que o texto descreve.
MEMÓRIA SUGERIDA:
  - type=gotcha escopo=plataforma slug=gotcha-politica-restritiva-segue-a-heranca-do-grupo — **fundir no registro sugerido pelo autor e corrigir a causa**: a política `TO grupo` vale para quem tem os privilégios do grupo. Concessão direta a membro com herança continua restrita (R4a). O fail-open vem de membro sem herança ou fora do grupo, e se confere pelo alcance efetivo (`has_table_privilege`/`has_any_column_privilege`), nunca pela ACL que nomeia.
  - type=gotcha escopo=plataforma slug=gotcha-fk-prende-ato-sem-dar-select — chave estrangeira composta `NOT NULL` prende a linha do ato à intenção sem dar `SELECT` ao ator, porque a checagem roda como dono e a mensagem sai sem o valor da chave (medido 16.15).
PRÓXIMO PASSO SUGERIDO: arquiteto-dados — levar `TRL-07`, `TRL-08` e `TRL-09` para a §16 (itens 4, 8 e 10, e a forma da política) e corrigir `:198`, `:220-221` e `:270-272`. Não precisa de nova reauditoria do desenho: o gate 2 das migrations confere isso.

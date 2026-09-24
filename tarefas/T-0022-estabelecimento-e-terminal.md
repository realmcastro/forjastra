---
id: T-0022
backlog: F-021
titulo: Modelar estabelecimento e terminal habilitado no schema de cliente
status: aberta
escopo: cliente=- vertical=- modulo=- camada=dados
aberta_em: 2026-09-23
---

## Pedido

"depois disso começe realmente, chega de papear!" (humano, 2026-09-23).

## Plano

## PLANO: T-H (T-0021), estabelecimento e terminal no schema de cliente
BACKLOG: F-021
PRÉ-REQUISITOS: `T-0009` fechada (gate de volta); A.2a (fuso, moeda, 042, 043); T-E decidida; T-B decidida (terminal habilitado e eixo E3); T-F decidida ou declarada independente.
PASSOS:
1. `arquiteto-dados`
   - **Brief:** primeiras migrations de cliente (`establishment`, `terminal`, `sales_enabled_terminal`), mais a coluna de fuso e moeda onde A.2a decidir. Se ela for do `platform`, é migration separada.
   - Registrar as convenções de T-E em `db/convencoes.md`.
   - Checklist de `migrations.md` §10; as ausências declaradas no topo; os três testes (vazio, com dado, duas vezes).
   - **Entrega:** `db/migrations/tenant/*`, com o resultado dos testes.
2. `seguranca`: gate 2 (isolamento, IDOR por `uuid`). **Entrega:** `docs/auditorias/`.
GATES: 2.

Nota do thread (2026-09-23): o pré-requisito "`T-0009` fechada" foi relaxado. O `PAP-28` segue aberto e
suspenso por bloqueio da ferramenta, e ele trata da declaração da credencial, não das tabelas de cliente.
As outras pré-condições estão cumpridas: `T-0014` A.2a (fuso, moeda, `RN-NUC-057`…`061`), `T-0018`
(dinheiro), `T-0015` (`D-03` C, `IDN-01`), `T-0019` (a trilha não é dependência hoje).

## Fechamento

—

## arquiteto-dados — 2026-09-23

## RELATÓRIO — arquiteto-dados — T-0022
STATUS: OK

Todos os testes passam. A suíte inteira do executor, rodada em Postgres 16 e 15, deu 143 de 143: nenhum pulado e 21 arquivos com banco exercidos. Ficaram decisões para o seu lado: quatro perguntas (duas para `produto`, uma para `seguranca`, uma para `performance`) e uma correção de memória, porque não segui o texto de `decision-dinheiro-e-quantidade` sobre a guarda de existência (motivo em DECISÕES).

FEITO:
- Escrevi 7 migrations de cliente. Todas são transacionais, nenhuma é reversível e cada uma declara suas ausências, numeradas, no topo:
  - `0001` cria os três domínios de valor.
  - `0002` cria a função genérica que recusa UPDATE/DELETE/TRUNCATE e as tabelas de domínio `roles` e `act_support_sources`, já semeadas.
  - `0003` cria `establishments`, onde a linha é o próprio fato de criação, e `establishment_name_changes`, que guarda o nome com data.
  - `0004` cria `establishment_operation_changes`: encerrar e reabrir, em sequência, com a alternância garantida por CHECK de paridade.
  - `0005` cria `establishment_configurations`, com versão, vigência, `establishment_time_zone` e `establishment_currency`.
  - `0006` cria `terminals` e `sales_enabled_terminal_facts`, onde a habilitação é uma máquina de estados por terminal.
  - `0007` acrescenta a chave estrangeira de `support_enablement_fact_id` nas quatro tabelas de estabelecimento.
- Faltavam duas peças no executor para a stream `tenant` (a descoberta, a ordem e o alvo já existiam):
  - O crivo não tinha forma para `CREATE DOMAIN`. Acrescentei uma forma estreita em `refusals.ts`: tipo base sem modificador, uma restrição nomeada, nada depois dela.
  - A impressão de estrutura do `verify` tinha dois defeitos. `format_type` qualifica o tipo com o schema (medi: saía `t_probe.money_amount`), então a primeira coluna de domínio faria todo cliente divergir da referência. E a restrição de domínio não aparecia em linha nenhuma, então um envelope afrouxado à mão passava sem aviso. Corrigi os dois; a referência do `platform` não muda.
- Atualizei a spec do executor na mesma mudança: `RECUSAS.md` §11.2 e `PROVISION-E-VERIFY.md` §13.3.
- Em `db/convencoes.md`: corrigi a linha 21 (o fuso é do estabelecimento, `RN-NUC-057`) e marquei as duas linhas acima dela como decididas. Acrescentei a §10 (dinheiro e quantidade) e a §11 (a forma do autor).
- Escrevi 4 arquivos de teste novos e 1 arquivo de apoio novo, e registrei os 3 arquivos com banco em `scripts/arquivos-vivos.json`.

ARQUIVOS:
- novos:
  - `/home/mcastro/work/freelas/forja/db/migrations/tenant/0001__value_domains.sql`
  - `/home/mcastro/work/freelas/forja/db/migrations/tenant/0002__authorship_lookups.sql`
  - `/home/mcastro/work/freelas/forja/db/migrations/tenant/0003__establishments.sql`
  - `/home/mcastro/work/freelas/forja/db/migrations/tenant/0004__establishment_operation_changes.sql`
  - `/home/mcastro/work/freelas/forja/db/migrations/tenant/0005__establishment_configurations.sql`
  - `/home/mcastro/work/freelas/forja/db/migrations/tenant/0006__terminals_and_sales_enablement.sql`
  - `/home/mcastro/work/freelas/forja/db/migrations/tenant/0007__support_enablement_references.sql`
  - `/home/mcastro/work/freelas/forja/db/migrator/test/cliente-migracao.test.ts`
  - `/home/mcastro/work/freelas/forja/db/migrator/test/cliente-estabelecimento-terminal.test.ts`
  - `/home/mcastro/work/freelas/forja/db/migrator/test/cliente-autor-e-configuracao.test.ts`
  - `/home/mcastro/work/freelas/forja/db/migrator/test/crivo-dominio.test.ts`
  - `/home/mcastro/work/freelas/forja/db/migrator/test/support/cliente.ts`
- editados:
  - `/home/mcastro/work/freelas/forja/db/convencoes.md`
  - `/home/mcastro/work/freelas/forja/db/migrator/src/refusals.ts`
  - `/home/mcastro/work/freelas/forja/db/migrator/src/structure-print.ts`
  - `/home/mcastro/work/freelas/forja/db/migrator/RECUSAS.md`
  - `/home/mcastro/work/freelas/forja/db/migrator/PROVISION-E-VERIFY.md`
  - `/home/mcastro/work/freelas/forja/db/migrator/scripts/arquivos-vivos.json`
- Não toquei em `tenant-reach`, `role-*`, `verify-*` nem em `platform/0000`…`0015`.

NÃO FEITO: —

DECISÕES:
1. **Guarda de existência dos domínios.** Não usei guarda de existência, e isto contradiz o texto de `decision-dinheiro-e-quantidade`.
   - O caminho usual (um bloco `DO`) é recusado pelo carregador.
   - A retomada fica garantida pela transação, como no `ADD CONSTRAINT` (§17.2, forma 3). Provei com um teste: a tentativa que falha não deixa domínio para trás, e a seguinte converge.
   - Uma guarda que pulasse em silêncio seria pior: ela aceitaria um domínio já existente com outro envelope.
   - Também fixei `unit_price` com o mesmo teto de `money_amount`, `< 1e12`, que é o do rascunho do dossiê; a decisão não dizia o teto.
2. **Vínculo terminal → estabelecimento.** Ele mora na habilitação, não na identidade do terminal (F-021 deixou essa escolha para mim).
   - A habilitação é uma sequência de fatos por terminal: `enablement`, `renewal`, `decommission`, `closure_revocation`, `compromise`.
   - Cada fato aponta para o anterior por uma chave estrangeira composta que carrega espécie, instante e período. Um CHECK diz o que pode vir depois de quê.
   - Com isso o banco torna impossível, sem gatilho e sem lock: duas habilitações vigentes, habilitar de novo sem encerrar a anterior, renovar depois do fim, reabilitar um terminal comprometido, sobrepor períodos no tempo, e revogar por um encerramento de outra unidade ou de outro instante.
   - Se a renovação e a revogação disputam o mesmo número de sequência, a segunda leva 23505.
3. **Terminal nasce com a primeira habilitação** (aceite 1). Uma chave estrangeira adiada até o primeiro fato, que tem de ser `enablement`, impede terminal sem estabelecimento de chegar ao COMMIT. Por isso `terminals` não tem timestamps próprios; é exceção a D-04, declarada.
4. **Forma do autor** (`convencoes.md` §11): seis colunas por fato, com uma coluna de referência por fonte e um CHECK "se e só se" por coluna. Assim uma quarta fonte entra sem afrouxar nenhuma restrição, que era a condição de d-06 §8. `author_operator_id` e `support_assignment_id` nascem NOT NULL onde o ato tem autor, mas ainda sem chave estrangeira: o operador e a atribuição são de SPR-37.
5. **Tabela do sujeito.** Não trouxe a tabela do operador para cá. Ela arrastaria a pergunta de quem cria o operador, e o primeiro `owner` nasce de um ato nosso, a quarta fonte que ainda não existe. SPR-37 fica com o operador e acrescenta as duas chaves estrangeiras (NOT VALID + VALIDATE).
6. **Configuração publicada.**
   - Vige no instante T a maior versão com `effective_from <= T`: a publicação posterior prevalece.
   - Vigência retroativa é recusada por CHECK.
   - O fuso é validado pela forma Área/Local (sem `Etc`) e pela existência no banco de fusos, porque `timezone(text,timestamptz)` é IMMUTABLE (medido).
   - A moeda é validada só pela forma ISO de três letras; conferir a lista é do backend.
7. **Nome do estabelecimento.** O nome de nascimento fica na própria linha, imutável e NOT NULL; cada mudança é uma linha datada. Evitei a chave estrangeira circular.
8. Editei `scripts/arquivos-vivos.json` e três arquivos de spec do executor, que já existiam. Sem a lista atualizada, o gate reprova arquivo que fala com o banco e não está nela; e a forma nova no crivo exige a spec alterada junto.

RISCOS:
- **Chaves de autor pendentes.** Se SPR-37 esquecer as chaves estrangeiras de `author_operator_id` e `support_assignment_id`, o autor pode ficar apontando para nada. Hoje nenhum escritor existe.
- **O que o banco não garante e fica com o backend** (Fase 2): que o encerramento revogue todo terminal da unidade; as precondições de habilitar (unidade aberta, `queue_owner`, fuso e moeda vigentes, aparelho sem fila de outro cliente); habilitação anterior ao nascimento da unidade; e ler de volta o desfecho gravado quando der 23505 na sequência (`gotcha-23505`).
- **Volume de `sales_enabled_terminal_facts`.** A renovação é gravada a cada contato do terminal, e a tabela tem 3 índices únicos (um de 5 colunas) mais 7 secundários. Ver a pergunta 5 de §6.
- **Papel do cliente pode inserir em `roles` e `act_support_sources`.** O privilégio padrão dá INSERT no schema inteiro; ausência declarada na `0002`. O dono é o ato de `papel-do-cliente.md` §7.3.
- **CHECK de fuso e restauração.** Restaurar num servidor com banco de fusos mais antigo que o nome gravado falharia. Baixo.
- **Texto defasado fora do meu território ou do brief:**
  - `.claude/rules/dados.md` §3 ainda diz "centavos ou numeric(14,2)" e fala de fuso do cliente no `platform`.
  - O comentário de `test/support/tree.ts` diz que a stream `tenant` não existe; não editei por estar fora da lista.
  - `CONTRATO.md` §14 não lista os casos novos.

PERGUNTAS:
  - para produto: não há linha na matriz para renomear estabelecimento, então pela `RN-NUC-026` a operação é negada a todos. Quem renomeia? O fato já tem forma e autor.
  - para produto: vigência retroativa da configuração está recusada, e a versão publicada depois prevalece sobre uma agendada antes. Confirma as duas regras?
  - para seguranca: o INSERT do papel do cliente nas tabelas de domínio é aceitável, ou o ato de §7.3 deve separá-las?
  - para performance: renovar a cada contato cabe no orçamento, ou produto deve limitar a renovação (por exemplo, só depois de consumida parte da validade)?

VERIFICAÇÃO:
- Postgres 16 e 15 descartáveis (`forja-e21-pg16`, `forja-e21-pg15`, portas 55570 e 55571), removidos ao fim. A porta 5432 não foi tocada.
- As 7 migrations passam pelo crivo real.
- `tsc --noEmit` sem erro.
- Testes novos: 20 com banco e 4 sem banco, todos passando.
  - Os três de `migrations.md` §3: schema vazio; schema com dado (aplico até a `0005`, gravo dado, depois a `0006` e a `0007`, sem perder linha); duas rodadas sem linha nova no livro-razão e com impressão idêntica. E a retomada da `0001`.
  - Aceites de F-021:
    - 1: terminal sozinho leva 23503 no COMMIT; habilitação sem unidade leva 23514; a busca por nome e DEFAULT com cara de "unidade padrão" não acha nada.
    - 2: habilitar por B sobre A leva 23514; mesmo número leva 23505; renovar como B leva 23503.
    - 4: consultas derivadas.
    - 5: o nome em T1 é o antigo.
    - 6: o papel de sul lendo ou escrevendo norte leva 42501.
    - 8 e 9: encerrar, reabrir e mover terminal.
    - Caminho infeliz: nada depois de `compromise`.
  - Append-only: UPDATE pelo papel do cliente dá P0001, DELETE dá 42501, e DELETE/TRUNCATE pelo dono dão P0001, nas 8 tabelas.
  - Domínios: 17.925, 1e12, NaN e ±Infinity recusados; 17.900 aceito.
  - `verify` sai 0 com os dois clientes, e com uma coluna de domínio; sai 3 com o envelope afrouxado à mão.
- Suíte completa (`npm test`, dois servidores): 143/143, 0 pulados.
- Não medi: lock, duração nem volume em cliente grande. Estimativa: todas as tabelas estão vazias em todo cliente nesta data, e a `0007` é a única que varre tabela.

CHECKLIST migrations.md §10 (0001–0007):
1. Todas são forward-only, nenhuma etapa destrutiva, nenhum DROP, RENAME ou DELETE. Ciclo §4: etapa 1 (expandir), sem aval necessário.
2. Rodam duas vezes: as seis primeiras por IF NOT EXISTS / CREATE OR REPLACE / ON CONFLICT DO NOTHING. CREATE DOMAIN (0001) e ADD CONSTRAINT (0006, 0007) dependem da transação, e isso foi testado. Rodam em schema vazio e com dado (testado).
3. Lock: da 0001 à 0006 só criam objeto novo; as chaves estrangeiras pedem SHARE ROW EXCLUSIVE em tabelas de domínio e de estabelecimento, vazias. A 0007 pede SHARE ROW EXCLUSIVE em quatro tabelas e varre uma coluna, que é nula em toda linha. Duração no maior cliente: não medida; hoje as tabelas estão vazias. `lock_timeout` vem do executor (§6).
4. Todas transacionais; nada a limpar na retomada.
5. Alvo `tenant` em todas, só ele.
6. Nenhum backfill.
7. Estrutura antiga lida hoje: nenhuma. É a primeira stream de cliente; `grep` em `apps/` não tem consulta a estas tabelas.

AS 5 PERGUNTAS dados.md §6:
1. **Outro ramo e outro fuso.** Nenhum nome ou coluna de ramo. Fuso e moeda são por unidade, com versão; duas unidades em Manaus e em São Paulo convivem no mesmo schema.
2. **Consultas que ficam caras.**
   - "Último fato por terminal": `DISTINCT ON`, servido pela chave única (terminal_id, terminal_sequence).
   - "Vigentes da unidade": índice (establishment_id, terminal_id), mais o último fato de cada terminal.
   - "Configuração vigente em T": (establishment_id, effective_from).
   - "Nome em T": chave única (establishment_id, occurred_at).
   - Nenhuma medida com EXPLAIN; é para o gate de performance.
3. **Coluna que vou querer mudar em 6 meses.** `offline_validity_seconds`: o número está em aberto (LACUNA-OFF-017) e a unidade pode virar outra grandeza. Está certa hoje porque é tempo de funcionamento, não calendário, e não tem DEFAULT. Também o envelope de `unit_price`, e as chaves estrangeiras de autor, que chegam com SPR-37.
4. **Isolamento.** Não há caminho: não existe coluna de cliente, o cliente é o schema. Medi 42501 cruzando schema. A IDOR por uuid dentro do cliente é conferência de escopo no backend (`RN-NUC-038`).
5. **Cardinalidade em 2 anos** (estimativa, parâmetros ilustrativos):
   - estabelecimentos, na faixa de 10^0 a 10^2 por cliente;
   - mudanças de nome, de operação e configurações, na de 10^1 a 10^3;
   - terminais, na de 10^0 a 10^3;
   - fatos de habilitação: 10^6 a 10^7 por cliente, com contato a cada 5 minutos, 16 horas por dia e 10 terminais.
   - Acima de 10^7, particionar por `occurred_at` ou reduzir a renovação passa a pesar.

MEMÓRIA SUGERIDA:
  - type=decision escopo=plataforma slug=decision-habilitacao-e-sequencia-de-fatos-por-terminal — o vínculo terminal→unidade é da habilitação; a sequência por terminal, com chave composta mais CHECK de transição, é a máquina de estados, e 23505 é a disputa legítima.
  - type=gotcha escopo=plataforma slug=gotcha-format-type-qualifica-dominio-fora-do-search-path — a impressão do `verify` divergia na primeira coluna de domínio, e a restrição de domínio (conrelid 0) era invisível.
  - type=gotcha escopo=plataforma slug=gotcha-check-com-nulo-e-transicao-livre — CHECK aceita NULL; transição e período precisam de coalesce e `IS NOT DISTINCT FROM`.
  - type=decision escopo=plataforma slug=decision-dinheiro-e-quantidade (corrigir) — "guarda de existência" vira "a guarda é a transação, forma 3"; `unit_price` com teto 1e12.

PRÓXIMO PASSO SUGERIDO: seguranca — gate 2 sobre `db/migrations/tenant/0001`…`0007`, a forma nova do crivo (`RECUSAS.md` §11.2) e a impressão com domínio (`PROVISION-E-VERIFY.md` §13.3). O foco é o isolamento pelo schema, o INSERT do papel do cliente nas tabelas de domínio, e se a máquina de estados fecha IDN-01 (comprometido nunca reabilitado; o fato leva a unidade da habilitação).

## thread — 2026-09-23 (validação e respostas)

Conferido pelo thread: `tsc --noEmit` saída `0`; `test:no-db` 53/53. O gate com banco (143/143 em 16 e 15)
é do autor.

Respostas, decididas pelo thread por delegação:
- **Renomear estabelecimento:** `owner`, com contato, como encerrar e reabrir. A linha da matriz entra na
  próxima passada de `produto`.
- **Configuração:** confirmadas as duas regras. Vigência retroativa é recusada, e a versão publicada depois
  prevalece sobre uma agendada antes.
- **INSERT do papel do cliente nas tabelas de domínio:** não é aceitável. As tabelas de lookup são só
  leitura para o papel do cliente, e o ato da §7.3 revoga (vai ao gate 2 como requisito).
- **Renovação a cada contato:** limitada. Renova-se só depois de consumido 1/4 da validade, o que reduz o
  volume em cerca de 4×. Vai para `produto` (`RN-OFF-035`) e para o backend na Fase 2.

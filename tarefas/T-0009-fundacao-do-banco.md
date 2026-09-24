---
id: T-0009
backlog: SPR-34
titulo: Fundação do banco — convenção, executor de migration e schema de controle
status: aberta
escopo: cliente=- vertical=- modulo=- camada=dados
aberta_em: 2026-09-11
---

## Pedido

O humano, em 2026-09-11: os colegas saíram, a execução passa a ser só dele, e o board inteiro está
vencido porque o calendário assumia três pessoas. Ele quer sair da fase de spec e construir. Nas
palavras dele: começar pela criação do banco, "uma plataforma que tenha todas as migrações, que o
banco se reconstrua sozinho", e a partir daí seguir para o backend. Alvo declarado do produto: MVP
sólido, escalável em informação e compatível com muitos dispositivos, porque aceitar múltiplos
dispositivos e ser rico em informação já é o diferencial mesmo sem múltiplos clientes.

A frente do cliente foi tratada em paralelo e **fechou**: `D-02` é o arranjo D
([[decision-d-02-arranjo-d]]), e `SPR-50` está concluída. Esta ficha é a frente de dados.

## Plano

```
## PLANO — T-0009 Fundação do banco: convenção, executor de migration e schema de controle
JIRA: SPR-34 (Epic) · SPR-39 (passo 2) · SPR-38 (passos 4-5) · SPR-36 (passo 7) · SPR-41 (passo 8)
ESCOPO: fechar D-04; especificar e implementar o executor de migration (forward-only, idempotente,
      retomável, N schemas, ledger por (schema, version)); DDL do schema `platform` recortado; gate de
      segurança sobre os dois. Alvo do bloco: o executor rodado contra um Postgres vazio produz
      `platform` correto mais um schema de cliente provisionado do zero, e rodar de novo não muda nada.
FORA DE ESCOPO: qualquer tabela da família de fatos (venda, pagamento, caixa, turno, trilha) · a coluna
      de fuso · tipo de dinheiro e escala de quantidade · catálogo (SPR-31/32/33) · `apps/api`,
      `packages/**` e qualquer código de HTTP · ORM e query builder (D-01 metade aberta, SPR-52) ·
      backfill · tabelas de módulo (SPR-14)
ESCOPO DE MEMÓRIA: cliente=- vertical=- modulo=- camada=dados
DECISÕES ABERTAS QUE TOCAM ISSO: D-04 (fecha DENTRO deste plano, passo 3) · D-01 metade aberta (não
      toca: executor é CLI, sem HTTP, e ORM está descartado por R-14; o único ponto de contato é o
      driver Postgres) · D-06 (ii) (não toca: excluída a família de fatos) · LACUNA-GLO-001 (não toca:
      coluna de fuso excluída por recorte)
PASSOS:
  1. thread principal — virar Fase 0 → Fase 1 no `CLAUDE.md` §2, porque o texto anterior proibia criar
     `db/` e um agent que o lesse recusaria o passo 4.
     — entrega: `CLAUDE.md` §2 reescrito — [sequencial, precede tudo] — FEITO 2026-09-11
  2. arquiteto-dados — proposta de D-04: forma da chave primária, conjunto de timestamps, exclusão
     lógica. Entrada obrigatória: `RN-OFF-013` exige identidade cunhada no terminal, offline, única e
     estável entre reenvios (docs/produto/operacao-offline-e-sincronizacao.md:204), e `LACUNA-OFF-003`
     (:346) nomeia `arquiteto-dados` como dono do formato.
     — entrega: `db/convencoes.md` + proposta no relatório — [sequencial, depende de 1]
  3. HUMANO — fecha D-04 lendo a proposta. Único ponto do plano em que ele é caminho crítico.
     — entrega: escolha registrada em `decision-d-04-*` + linha do `CLAUDE.md` §8 — [depende de 2]
  4. arquiteto-dados — spec do executor + DDL do ledger.
     — entrega: `db/migrator/CONTRATO.md` + `db/migrations/0000__ledger.sql` — [depende de 3]
  5. coder — implementar o executor em TypeScript estrito sob a spec, com os quatro testes de aceite.
     — entrega: `db/migrator/**` + testes — [depende de 4]
  6. produto (CONSULTA, read-only) — que entidades do schema de controle já têm regra numerada e qual é
     o nome de cada uma no glossário: cliente, estabelecimento, módulo ativo, terminal habilitado.
     — entrega: resposta no relatório — [paralelo com 4 e 5: territórios disjuntos]
  7. arquiteto-dados — DDL do schema `platform`, recortado, com cada ausência declarada no topo.
     — entrega: `db/migrations/0001__platform_controle.sql` — [depende de 3 e 6]
  8. seguranca — gate 2, escopo "executor de migration + schema platform".
     — entrega: `docs/auditorias/2026-09-<dd>-executor-e-schema-platform.md` — [depende de 5 e 7]
  9. orquestrador — fechamento: D-04 registrada, `state-fase-0-arquitetura-ia` e
     `state-board-spr-2026-08-26` atualizados, ficha e `tarefas/INDEX.md`.
     — entrega: memória escrita + ficha fechada — [sequencial]
GATES:
  1 (produto antes de código): cumprido por CONSULTA no passo 6. O contrato do executor é
    `.claude/rules/migrations.md`, não regra de negócio, então para o passo 4 o gate não se aplica, e
    isso é declarado, não omitido.
  2 (schema: arquiteto-dados desenha, seguranca audita): passos 4, 7 e 8.
  3 (endpoint novo): não se aplica, nenhum endpoint neste bloco.
  4 (performance): não se aplica, nenhuma consulta de tela nasce aqui. O custo do executor sobre N
    schemas só é medível com mais de um schema real; declarado para o bloco seguinte, não presumido.
  5 (BLOQUEIO não se ignora): vale.
RISCO PRINCIPAL: o recorte do passo 7 decidir por omissão o que ele diz que não decide. Uma coluna de
fuso que entra "porque o cliente precisa de uma", ou um `tenant_id` no `platform`, e a lacuna some sem
ninguém ter respondido. Mitigação: as ausências vão no topo do arquivo SQL e são item de conferência
do passo 8 e do fechamento, não confiança no autor.
```

### Decisões do thread principal sobre as sete perguntas do plano (2026-09-11)

O humano delegou a estratégia com todas as letras e pediu velocidade. Seis das sete são técnicas e
foram decididas aqui; a sétima foi adiada.

| # | Decisão | Motivo |
|---|---|---|
| P1 | **Inverter a Epic**: `SPR-39` → `SPR-38` → `SPR-36` → gate | `SPR-38` é o único card da Epic sem dependência de regra e estava atrás de seis que dependem |
| P2 | **Aprovado** `pg`, `typescript`, `node:test`. Nada além | `pg` não prejulga `SPR-52`: Kysely, Drizzle e Prisma assentam sobre ele ou o aceitam |
| P3 | **`db/`**, não `packages/` | `packages/` cria layout de monorepo antes de a decisão existir (`processo.md` §4) |
| P4 | **Recorte de `SPR-36`** sem coluna de fuso | coluna nullable depois é metadado; o card destrava hoje sem decidir `LACUNA-GLO-001` |
| P5 | **Partir `SPR-40`** em metade DDL e metade política | a metade DDL não precisa de `G-09`, e nenhuma tabela deste bloco tem dinheiro |
| P6 | **Adiar `SPR-54`/`T-0006`** | nada desta frente espera por ela; as quatro pendências são de catálogo e de UI |
| P7 | **Reatribuir a Epic `SPR-34`** ao humano e recalcular datas de 2026-09-11 | o calendário assumia três pessoas. Ressalva do plano, mantida: as estimativas nunca foram medidas, então o recálculo é hipótese de novo e o primeiro card que fechar dá o primeiro dado real |

## arquiteto-dados — 2026-09-11 (passos 2 e 4)

## RELATÓRIO — arquiteto-dados — T-0009
STATUS: PARCIAL
FEITO:
- Escrevi a proposta de `D-04` em `db/convencoes.md`: forma da chave primária, conjunto de timestamps
  e exclusão lógica, com recomendação nomeada como recomendação e uma tabela de "o que se perde em
  cada saída" para a escolha do humano caber em uma linha.
- Medi cinco formas de chave em Postgres 16.15 real (2M linhas cada, mais 200k em regime permanente):
  tamanho de índice, WAL, tempo de inserção e crescimento do índice. A medida está no arquivo, com o
  ambiente e a ressalva de execução única declarados.
- Respondi as cinco perguntas de `dados.md` §6 sobre a convenção proposta, em `db/convencoes.md` §5.
- Escrevi o contrato do executor em `db/migrator/CONTRATO.md`: descoberta e ordem, numeração por
  stream, alvo declarado, ledger, transação por schema, retomada, não-transacional, `lock_timeout`,
  bootstrap, provisionamento do zero, `verify`, recusas do carregador, códigos de saída e seis testes
  de aceite.
- Resolvi na spec a interpolação de identificador de schema (§10 do contrato) e **provei o mecanismo
  contra um slug hostil** em banco real.
- Respondi o checklist de `migrations.md` §10 em `db/migrator/CONTRATO.md` §15.
ARQUIVOS:
- `db/convencoes.md` (novo)
- `db/migrator/CONTRATO.md` (novo)
- `docs/produto/operacao-offline-e-sincronizacao.md`, `docs/produto/nucleo-venda.md`,
  `docs/produto/glossario.md`, `memory/plataforma/INDEX.md` e dois registros de lá (só leitura)
NÃO FEITO:
- `db/migrations/0000__ledger.sql`. **O ledger depende de `D-04`**, e o brief mandava não escrever
  nesse caso. A demonstração: dos três eixos de `D-04`, dois são independentes e um não é. Chave
  primária: independente, `(schema_name, version)` é natural e é a unidade de aplicação fixada por
  `migrations.md` §2, sem chave substituta possível. Exclusão lógica: independente, linha de ledger
  nunca é apagada. **Timestamps: dependente.** `dados.md` §3 exige `created_at` e `updated_at` em toda
  tabela; minha proposta abre exceção para tabelas append-only e de processo, e o ledger é
  exatamente uma delas. Se `D-04` fechar pela exigência literal, o DDL ganha duas colunas; se fechar
  pela exceção, não ganha. Como `migrations.md` §1 proíbe editar migration aplicada, e `0000` é a
  primeira de todas, errar aqui custa uma segunda migration para consertar o ledger com o próprio
  ledger. Colunas e semântica estão especificadas em `db/migrator/CONTRATO.md` §5; falta só o SQL.
- Nenhum teste rodado do executor: ele não existe ainda (passo 5).
DECISÕES:
- **A recomendação de chave é pelo tipo, não pelo algoritmo.** `uuid` mantém v4, v7 e ULID
  intercambiáveis sem DDL; `bigint` e `text` não. É o argumento que sustenta a recomendação, acima do
  desempenho medido.
- **A identidade de idempotência de `RN-OFF-013` é a própria PK**, não coluna ao lado de chave
  substituta. Assim a colisão que a regra manda detectar vira violação de unicidade verificada pelo
  banco, sem código.
- **Recusei coluna de exclusão lógica no núcleo** com as quatro partes de `00-nucleo.md` §12
  (`db/convencoes.md` §4). A necessidade preservada é "tirar de circulação sem perder histórico"; o
  mecanismo proposto é vigência declarada mais fato de mudança de estado, que é o caminho que
  `operacao-do-provedor-alcance.md:25` já fixou para módulo.
- **Numeração por stream, não global** (`CONTRATO.md` §2.2), para módulo não coordenar número com o
  núcleo. Custo: `version` passa a ser o caminho relativo, não o número solto.
- **`lock_timeout` sem padrão implícito.** O executor recusa iniciar sem valor configurado. Trade-off:
  atrito na primeira rodada, em troca de nenhum número inventado por mim.
- **`schema_name` no lugar de `schema`** no ledger, por `SCHEMA` ser palavra-chave do padrão SQL.
  Única divergência de nome contra `migrations.md` §2, e é de grafia.
RISCOS:
- **`dados.md` §3 vai ficar desatualizada** se `D-04` fechar pela exceção de timestamps para
  append-only. A regra é território de quem mantém `.claude/rules/**`, não meu.
- A tensão entre `search_path` e `dados.md` §1 ("toda migration referencia o schema explicitamente")
  está declarada em `CONTRATO.md` §10, com a minha leitura. **Ela é conclusão a confirmar no gate de
  `seguranca`, não conclusão minha.**
- As recusas do carregador (`CONTRATO.md` §11) são correspondência textual: pegam o caso honesto, não
  o adversário. A defesa contra o adversário é a revisão humana do arquivo antes do commit.
- Duas rodadas simultâneas do executor não estão resolvidas (`CONTRATO.md` §16). `pg_advisory_lock` no
  `platform` resolveria; não decidi.
- `verify` derruba o schema descartável que ele mesmo cria. É a segunda exceção de remoção do sistema
  e merece olhar do gate.
- Fora do escopo, visto de passagem: `glossario.md:108` define `idempotency_key` como "identificador
  enviado pelo chamador" e manda não confundir com "identificador da venda", enquanto `RN-NUC-003`
  trata a identidade cunhada no terminal como identidade da venda. Ou são o mesmo objeto e o
  glossário precisa de uma frase, ou são dois e a proposta de PK muda.
PERGUNTAS:
  - para humano: `D-04`. A recomendação está em `db/convencoes.md` §2.4, e a tabela de perdas por
    saída em §2.5. Uma linha fecha os três eixos.
  - para humano: quantas vendas por dia por estabelecimento o alvo do MVP espera? É a entrada que
    falta para a pergunta 5 de `dados.md` §6, e sem ela a faixa de cardinalidade fica declarada em
    vez de respondida.
  - para produto: `effective_period` (`glossario.md:61`) vale para **item de catálogo**, ou só para
    preço e regra? A recusa de exclusão lógica em `db/convencoes.md` §4 assume que vale.
  - para produto: a identidade de idempotência de `RN-NUC-003` e o `idempotency_key` de
    `glossario.md:108` são o mesmo objeto quando o chamador é o nosso terminal?
  - para produto: os dois instantes do fato ganham que nome no glossário? Propus `occurred_at` e
    `received_at`.
VERIFICAÇÃO:
- Rodei, em container `postgres:16` descartável (Postgres 16.15, `shared_buffers=128MB`,
  `max_wal_size=4GB`), as medidas de chave das tabelas de `db/convencoes.md` §2.2: 2.000.000 de linhas
  por candidato, mais 200.000 em regime permanente, mais um índice btree de `timestamptz` sobre 2,2M
  linhas. Uma execução por medida, sem repetição, em máquina de desenvolvimento. Container removido ao
  fim.
- Rodei o mecanismo de citação de identificador de `CONTRATO.md` §10 no mesmo banco, inclusive com o
  slug hostil `t_x"; drop table probe_result; --`: o Postgres criou um schema com esse nome literal,
  nenhum comando extra executou, e a tabela alvo do `drop` continuou com as 5 linhas que tinha.
- **Não rodei** nada do executor: não existe código (passo 5). **Não medi** lock, custo sobre N schemas
  reais nem manutenção do índice secundário sob inserção, e digo isso nos dois arquivos onde importa.
MEMÓRIA SUGERIDA:
  - type=convention escopo=plataforma camada=dados slug=convention-o-caro-e-o-tipo-da-chave-nao-a-geracao
    — escolher `uuid` mantém v4, v7 e ULID intercambiáveis sem DDL; o que não se desfaz em N schemas é
    o tipo da coluna, e é só ele que a decisão precisa acertar hoje.
  - type=convention escopo=plataforma camada=dados slug=convention-nome-de-schema-e-parametro-nunca-concatenacao
    — `set_config` + `format('%I')`/`quote_ident` com o nome chegando por bind parameter; provado em
    2026-09-11 contra slug hostil, e é o único ponto do sistema que precisa de identificador dinâmico.
  - type=gotcha escopo=plataforma camada=dados slug=gotcha-chave-unica-globalmente-parece-endereco
    — `uuid` único em todo lugar convida a resolver objeto só pela chave, que é o que `RN-NUC-038`
    proíbe; o isolamento continua sendo o schema mais o escopo resolvido da identidade autenticada.
PRÓXIMO PASSO SUGERIDO: HUMANO — fechar `D-04` lendo `db/convencoes.md` §2.4 e §2.5. Com a linha dele,
`arquiteto-dados` escreve `db/migrations/0000__ledger.sql` em uma passada curta e o passo 5 destrava.

## seguranca — 2026-09-11 (passo 8, gate 2)

## RELATÓRIO — seguranca — T-0009
STATUS: OK
FEITO:
- Auditei `db/migrator/CONTRATO.md` e `db/migrations/platform/0000__ledger.sql`, com `db/convencoes.md`
  como contexto. Relatório em `docs/auditorias/2026-09-11-executor-e-schema-platform.md`.
- Respondi as duas perguntas dirigidas a mim e as cinco de `seguranca.md` §1.
- Rodei dez provas contra Postgres 16.15 real (container descartável, removido ao fim). Cada achado cita
  a prova que o sustenta.
- Oito achados: três `ALTO` (`MIG-01`, `MIG-02`, `MIG-03`), dois `MÉDIO` (`MIG-04`, `MIG-05`), mais
  `MIG-06` (`MÉDIO`) e dois `BAIXO`. Nenhum `CRÍTICO`. Nenhum reincidente.
- Busquei credencial na árvore inteira: nenhuma ocorrência; `.gitignore` cobre `.env`.
ARQUIVOS:
- `docs/auditorias/2026-09-11-executor-e-schema-platform.md` (novo)
- `tarefas/T-0009-fundacao-do-banco.md` (esta seção)
- `db/migrator/CONTRATO.md`, `db/migrations/platform/0000__ledger.sql`, `db/convencoes.md`,
  `memory/plataforma/INDEX.md` e três registros de lá (só leitura)
NÃO FEITO: —
DECISÕES:
- **Aprovei o `search_path` de um schema só contra `dados.md` §1**, com fundamento em três partes
  (auditoria §1): a cláusula fala de quem conecta em tempo de requisição, o executor **é** quem conecta,
  e exigir qualificação literal no `.sql` de alvo `tenant` moveria uma interpolação mecanizada para N
  interpolações escritas à mão — piora exatamente a propriedade que a regra protege. A aprovação é
  **condicionada** a `MIG-01` e `MIG-02`, porque o contrato afirma duas coisas que o banco desmente.
- **Não derrubei a prova do `arquiteto-dados`; estreitei o alcance dela.** Citação por `format('%I')`
  protege contra injeção e não tem opinião sobre **qual** identificador. Com slug de cliente existente o
  mesmo caminho pousa dentro do schema daquele cliente e aplica (`MIG-02`, medido).
- **O gotcha de enumeração de clientes não se aplica ao ledger**, e o canal maior não se fecha por
  `GRANT`: `pg_namespace`/`pg_tables` entregam a carteira a qualquer papel que conecte, e revogar quebra
  introspecção sem fechar nada (medido). Separei o que dá para fixar hoje sem tocar em `D-03`: papel de
  banco do executor ≠ papel da aplicação (`MIG-06`) — é decisão de papel de banco, não de identidade.
- Numerei a série `MIG-nn`, sem continuidade com as auditorias de 2026-08-23 (escopo disjunto).
RISCOS:
- `MIG-01` é o que mais me preocupa para o passo 5: sem correção no contrato, o `coder` transcreve a §10.3
  para o regime autocommit e o defeito nasce implementado, silencioso, e só aparece como "falta índice no
  cliente" muito depois.
- O `0001__platform_controle.sql` (passo 7) é o lugar natural da unicidade de slug que o `MIG-02` pede.
  Se ele for escrito antes da correção, a verificação some entre os dois passos.
- Fora do escopo, visto de passagem: `CONTRATO.md` §12 lista `verify` como "Não escreve nada", e a §13
  descreve o mesmo comando criando schema, aplicando migrations, escrevendo no ledger e derrubando o
  schema. Quem ler só a tabela roda `verify` em produção acreditando que é leitura.
PERGUNTAS:
  - para arquiteto-dados: no regime não-transacional (§8), o schema alvo passa a ser fixado por sessão,
    ou cada comando do corpo é qualificado? A escolha muda o que a §10.4 precisa verificar ali.
  - para arquiteto-dados: `verify` registra o schema descartável no registro de clientes (passando por
    `provision`), ou provisiona por caminho próprio sem registrá-lo? A resposta decide se sobra cliente
    fantasma depois do `drop`.
  - para humano: papel de banco do executor separado do papel da aplicação pode ser fixado agora como
    convenção de `db/`, ou ele prefere que espere `D-03`? Minha leitura é que são objetos diferentes e
    não espera.
VERIFICAÇÃO:
- Rodei dez provas contra `postgres:16` (PostgreSQL 16.15) em container descartável, removido ao fim.
  As que sustentam achado: `search_path` local morre em autocommit e o `CREATE INDEX CONCURRENTLY`
  pousou em `public`; o mecanismo da §10 aplicou o corpo dentro de `t_acme` já existente, com `COMMIT`;
  `DROP SCHEMA t_vitima CASCADE` dentro de transação de alvo `tenant` destruiu o schema; `to_regclass`
  casa com view; `CREATE TABLE IF NOT EXISTS` sobre estrutura divergente deixou 0 restrições; ledger sem
  PK aceitou duas linhas para a mesma versão; papel comum enumerou todos os `t_*` e as tabelas deles, e
  `REVOKE` em `pg_namespace` não fechou.
- Busca por credencial: `grep -rInE "postgres(ql)?://|PGPASSWORD|DATABASE_URL|PGUSER="` na árvore inteira
  exceto `.git` — nenhuma ocorrência.
- **Não medi** lock, tempo, custo sobre N schemas reais, nem privilégio de papel em operação (a decisão
  não existe). **Não auditei** código de executor (não existe) nem `0001__platform_controle.sql` (não
  escrito).
MEMÓRIA SUGERIDA:
  - type=gotcha escopo=plataforma camada=dados slug=gotcha-search-path-local-nao-existe-em-autocommit
    — `set_config(..., true)` morre no fim do statement quando não há transação explícita, e o
    `CREATE INDEX CONCURRENTLY` da migration não-transacional nasce em `public`; medido em 16.15.
  - type=gotcha escopo=plataforma camada=seguranca slug=gotcha-citar-identificador-nao-escolhe-o-alvo
    — `format('%I')` impede injeção e não impede schema errado; provisionar com slug de cliente existente
    aplica o núcleo **dentro** do schema dele, com `NOTICE` e saída de sucesso.
  - type=convention escopo=plataforma camada=seguranca slug=convention-papel-do-migrador-nao-e-papel-da-aplicacao
    — quem cria o schema é dono dele; credencial compartilhada entre executor e aplicação anula o
    isolamento por schema sem nenhuma linha de código errada, e a decisão não depende de `D-03`.
  - type=gotcha escopo=plataforma camada=seguranca slug=gotcha-catalogo-enumera-a-carteira-e-grant-nao-fecha
    — `pg_namespace`/`pg_tables` entregam todos os `t_*` e as tabelas deles a qualquer papel que conecte;
    `REVOKE` quebra introspecção e não fecha, porque a view lê com o privilégio do dono. É propriedade da
    tenancy escolhida, e quem fechar `D-03` precisa saber disso antes.
  - type=gotcha escopo=plataforma camada=dados slug=gotcha-if-not-exists-nunca-converge-estrutura
    — `CREATE TABLE IF NOT EXISTS` sobre tabela divergente pula em silêncio e as restrições não nascem;
    checksum prova o arquivo, nunca o banco, e `verify` não olha `platform`.
PRÓXIMO PASSO SUGERIDO: `arquiteto-dados` — corrigir `CONTRATO.md` contra `MIG-01`, `MIG-02` e `MIG-03`
antes do passo 5, e decidir `MIG-04` e `MIG-05` na mesma passada. `MIG-06` precisa de uma linha do humano
ou de uma convenção em `db/`; sem ela o passo 5 escolhe por omissão ao escrever a string de conexão.

---

## arquiteto-dados — 2026-09-11 (passo 7)

## RELATÓRIO — arquiteto-dados — T-0009
STATUS: PARCIAL

FEITO:
- Escrevi `db/migrations/platform/0001__tenant_registry.sql`: uma tabela, `platform.tenants`, o
  registro de clientes que o executor lê (`CONTRATO.md` §10, camada 1, e §2.4).
- Declarei no topo do arquivo, numeradas, as **sete ausências** do schema de controle, cada uma com
  o nome da lacuna ou da decisão aberta que a sustenta. É a lista que o gate de `seguranca` confere.
- Rodei os três aceites de `migrations.md` §3 contra Postgres 16.15 real, mais a verificação de cada
  restrição, mais a medida de lock da reaplicação.
- Respondi o checklist de `migrations.md` §10 e as cinco perguntas de `dados.md` §6 (abaixo).

ARQUIVOS:
- `db/migrations/platform/0001__tenant_registry.sql` (novo, 124 linhas)
- `tarefas/T-0009-fundacao-do-banco.md` (editado — só esta seção)
- `db/convencoes.md`, `db/migrator/CONTRATO.md`, `db/migrations/platform/0000__ledger.sql` (só leitura)
- `docs/produto/nucleo-estabelecimento.md`, `fatos-de-operacao-provedor.md`,
  `operacao-do-provedor-alcance.md`, `fila-local-autoridade-e-identidade.md`,
  `operacao-offline-e-sincronizacao.md`, `glossario.md`, `catalogo-de-modulos.md`,
  `catalogo-de-capacidades.md`, `matriz-operacao-papel.md` (só leitura)
- `docs/auditorias/2026-09-11-executor-e-schema-platform.md` (só leitura)

NÃO FEITO — e nenhum item é recorte meu, cada um tem um impedimento nomeado:

1. **Nenhuma tabela de fato do ciclo de vida.** `tenant_provisioned`, `tenant_offboarded`,
   `module_state_change`, `sales_enablement_granted`, `sales_enablement_renewed` e
   `terminal_compromised` (`fatos-de-operacao-provedor.md:325` em diante) exigem **autor**, e a
   residência do sujeito é o **primeiro eixo de `D-03`, ABERTA**: não se sabe se a pessoa mora numa
   população global ou no schema do cliente. A segunda resposta faria o `platform` referenciar pessoa
   que vive dentro de um cliente, que é travessia de schema — então a **forma da coluna** depende da
   decisão, não só o valor dela. Coluna de autor escrita hoje nasce sem valor possível, que é o
   sintoma de [[gotcha-o-caso-de-falha-do-mecanismo-novo-e-o-primeiro-lugar-a-olhar]].
2. **`module_state_change` soma um segundo impedimento**, e ele é de produto, não meu: por
   `RN-PRV-007` a operação **é negada a todos** até `LACUNA-PRV-003` dizer quem confirma, e
   `fatos-de-operacao-provedor.md:328` diz "um fato, **dois autores possíveis** — nunca dois fatos"
   (nosso ou o `owner` do cliente). Modelar hoje escolhe um dos dois por acidente.
3. **Nenhuma tabela de domínio de módulo nem de capacidade.** O registro de códigos declara que a
   lista de módulos "**não está fechada aqui**" (`glossario.md` §4.3) e mistura escopos (`NUC` é
   núcleo, `RES`/`PST`/`VAR` são verticais, `PRV` é nosso); o catálogo de capacidades diz que
   "**nenhuma entrada nasce aceita**: `candidata` é o máximo que este arquivo produz". Semear
   qualquer um seria eu transformar prosa em domínio fechado, que é autoridade de `produto`
   (`migrations.md` §7: seed só de domínio fechado). E sem o fato de ativação do item 1, a tabela de
   domínio sozinha não tem leitor.
4. **`establishment`, `terminal` e `sales_enabled_terminal` não entram no `platform`** — ver
   `DECISÕES`, é a decisão de fronteira desta entrega, não uma omissão.
5. **Fuso, moeda e identidade fiscal**: `LACUNA-GLO-001`, `LACUNA-NUC-041` e
   `nucleo-estabelecimento.md` §3.

DECISÕES:

**(a) O arquivo se chama `0001__tenant_registry.sql`, não `0001__platform_controle.sql`.** Duas
razões e nenhuma é gosto. A primeira: o nome do arquivo **é** a `version` gravada no livro-razão
(`CONTRATO.md` §1), e `version` é identificador — `CLAUDE.md` manda identificador em inglês, que é o
que `0000__ledger` já faz. A segunda: depois do recorte acima o arquivo cria o registro de clientes e
**nada** do resto do controle; `migrations.md` §7 pede nome que diga o quê, e `platform_controle`
prometeria três registros e entregaria um. Como nada foi aplicado ainda, renomear hoje custa um `sed`
no plano; depois custaria uma migration nova.

**(b) `establishment` mora no schema do cliente, não no `platform`.** As quatro partes de
`00-nucleo.md` §12, porque isto recusa uma colocação, não uma necessidade.
*Necessidade preservada:* nomear a unidade de operação e identidade jurídica em todo fato do núcleo,
inclusive quando o cliente tem uma só (`RN-NUC-050`) — ela continua inteira, e obrigatória desde a
primeira migration de cliente.
*Mecanismo recusado:* a tabela no `platform`. Ela é ruim de forma verificável: o estabelecimento
carrega o nome pelo qual o operador reconhece a unidade, que é dado de negócio do cliente, e
`dados.md` §1 proíbe tabela de cliente aqui; e todo fato do núcleo (venda, pagamento, sessão de
caixa, fechamento) vive no schema do cliente, então a obrigatoriedade que `RN-NUC-050` exige ficaria
sem **chave estrangeira**, porque FK não atravessa schema. Sobraria disciplina de código exatamente
no lugar onde a regra diz "não existe caminho em que o dado seja ausente, nulo ou inferido".
*Mecanismo proposto:* `establishment` no schema do cliente, com FK obrigatória de todo fato do
núcleo para ela.
*Por que é melhor, e como se prova:* o banco passa a recusar fato sem unidade, em vez de pedir que
toda rota lembre. A prova é `RN-NUC-050`, aceite 1, no lado negativo: com a FK `NOT NULL`, "venda sem
estabelecimento" não é um caso a testar, é uma linha que o Postgres não aceita. E é o que
[[decision-tenancy-schema-por-cliente]] já diz — "o schema isola **cliente**, não estabelecimento",
isto é, as unidades vivem **dentro** do schema do cliente, e `RN-NUC-050` repete: "dois
estabelecimentos de um mesmo cliente vivem no **mesmo ambiente**".

**(c) `terminal` e `sales_enabled_terminal` ficam fora, e por um impedimento a mais que o (b).** O
ciclo de vida do terminal é praticado por papel **do cliente**, não nosso: a linha 34 da matriz do
núcleo ("registrar furto, perda ou destruição de terminal") vale `N R R R N`, e a linha 30
(transferir fila, descomissionar) também. Isso o puxa para o schema do cliente pelo mesmo argumento
do (b). Mas existe o contra-argumento, e ele não é meu para resolver: se o registro do terminal for o
que **resolve** qual cliente atende uma conexão, ele não pode morar dentro do cliente que ele
resolve — e "como o cliente chega na borda" é o **terceiro eixo de `D-03`**, ABERTA
([[decision-d-03-sao-tres-eixos-nao-uma-decisao]]). Enquanto o eixo estiver aberto, eu não escolho.
Note que `RN-OFF-032` continua satisfeita nos dois lados: reter a habilitação é fato exigido em
qualquer das opções, como o próprio registro de `D-03` diz.

**(d) `RN-PRV-013` está satisfeita, e a forma é "identidade + fluxo de fatos", não "estado".** A
regra proíbe ler o estado corrente de **campo sobrescrito**; ela não proíbe o sujeito ter linha de
identidade. `platform.tenants` não tem campo de estado e **não pode ganhar um**: das quatro colunas,
três são imutáveis por construção e a quarta é gerada. Não há `is_active`, não há `deleted_at`, não
há `terminated_at`. O precedente é o próprio livro-razão: `platform.schema_migrations` é fluxo de
fatos puro e o sujeito dele (o schema) é nomeado por texto. Quando os fatos do item 1 existirem, eles
apontam para `tenant_id` — a tabela é o **sujeito** dos fatos, nunca a projeção deles.
**Projeção materializada: não existe nenhuma neste arquivo, de propósito.** A pergunta que o brief
faz — "módulo ativo é consultado a cada requisição, quanto custa derivar" — é real e **não é
resolvível em DDL hoje**: derivar exige a tabela de fato, que está bloqueada, e responder por
projeção exigiria decidir, antes disso, se uma requisição dentro da sessão de um cliente pode ler o
`platform`. O gate anterior já registrou que esse caminho de leitura "nunca foi auditado"
(`docs/auditorias/2026-09-11-executor-e-schema-platform.md`, resposta 1). É pergunta para `backend` e
`seguranca`, e está em `PERGUNTAS`.

**(e) `platform.tenants` leva `created_at` e NÃO leva `updated_at`, e o gatilho genérico de `D-04`
§8 item 4 NÃO nasce aqui.** A linha é imutável: o `slug` não muda porque mudá-lo seria alterar o nome
de um schema em uso, e alterar nome de objeto é proibido (`migrations.md` §4); `tenant_id` é chave;
`schema_name` é gerado. `updated_at` numa linha imutável é exatamente a coluna que `D-04` tirou da
família de fato — "existiria só para convidar código a atualizá-la". Consequência declarada: o
gatilho continua devido e nasce com a **primeira tabela de cadastro editável**, que não é esta.

**(f) `schema_name` é coluna gerada, e aceito o preço.** Preço: `t_` passa a aparecer em dois lugares
(aqui e no executor, `CONTRATO.md` §10). Ganho: o banco recusa qualquer linha em que slug e schema
discordem, e o livro-razão ganha chave de junção direta — sem ela, "que versão o schema deste cliente
alcançou" (aceite de `RN-PRV-013`) exige compor a string na consulta.

**(g) Não criei FK de `platform.schema_migrations.schema_name` para cá**, apesar de a auditoria
anterior a ter apontado como dívida esperada. Ela estaria **errada**: o livro-razão registra também o
schema `platform`, que não é cliente, e os schemas descartáveis do comando de verificação, que são
derrubados enquanto a linha do livro-razão permanece ("linha nunca é apagada"). A FK transformaria
dois estados normais em erro. O que a auditoria queria dali — "duas linhas do registro apontando para
o mesmo schema" — está resolvido por `UNIQUE (slug)` mais a coluna gerada, sem FK nenhuma.

RISCOS:
- **`MIG-02` fica resolvido só pela metade, e a outra metade é do executor.** A minha metade está
  fechada em estrutura: duas linhas do registro apontando para o mesmo schema virou impossível. A
  metade que sobra — `provision <slug>` não confrontar o slug com os **schemas que já existem**
  (`CREATE SCHEMA IF NOT EXISTS` engole um schema preexistente sem erro), e `migrate --schema` aceitar
  nome fora do registro — não tem defesa em DDL nenhum, porque acontece antes de qualquer `INSERT`.
- **`MIG-04`**: `CHECK` de slug recusando o prefixo `verify_` entrega o primeiro terço da correção
  sugerida (reservar o prefixo). Os outros dois terços — formato do carimbo com componente não
  previsível, e o comando conferir no catálogo que o schema é desta execução antes de derrubá-lo —
  são de `CONTRATO.md` §13 e §10.2, que **não editei** por estarem em auditoria nesta mesma rodada.
- **O `slug` é o nome do cliente, e esta tabela é a enumeração da nossa carteira.** É o menor
  conteúdo possível — não há nome fantasia, documento, endereço nem valor —, mas quem alcançar a
  tabela lê a lista inteira de clientes. É o alvo de
  [[gotcha-nenhuma-superficie-nossa-enumera-clientes-para-escolher]] aplicado ao registro de
  controle, e reforça `MIG-06`: o papel de banco do executor e o da aplicação não deveriam ser o
  mesmo. Quem pode ler é de `seguranca`, não meu.
- **`CONTRATO.md` §4 usa `-- modulo: inventory` como exemplo**, enquanto o registro único dos códigos
  de módulo é o de três letras de `glossario.md` §4.3 (`EST` = Estoque). Se o `module` do livro-razão
  não for o código estável, "quais módulos este schema tem" passa a depender de nome de diretório.
  Não corrigi: `CONTRATO.md` está sob auditoria agora.
- **A ausência 4 vira dívida de verdade no dia em que a primeira migration de cliente existir**:
  `RN-NUC-050` exige que todo fato do núcleo nomeie a unidade **desde a primeira migration**, e o
  estabelecimento ainda depende de `LACUNA-GLO-001` e `LACUNA-NUC-041` para saber se leva fuso e
  moeda. As duas lacunas param o passo seguinte, não este.

PERGUNTAS:
- para humano: `LACUNA-NUC-041` — a moeda é do cliente (tenant) ou do estabelecimento? Se for do
  estabelecimento, a coluna nunca é desta tabela, e a decisão precede a primeira migration de cliente.
- para humano: `D-03`, eixo 1 (residência do sujeito) — enquanto ele estiver aberto, nenhuma tabela
  de fato do ciclo de vida é escrevível, porque a coluna de autor não tem referente possível.
  Confirma que isso para o passo, ou existe caminho que eu não estou vendo?
- para `backend`: "módulo ativo" é resolvido **por requisição** ou **uma vez por sessão/manifesto**?
  A resposta decide se o registro de ativação precisa de projeção materializada ou se a derivação
  sobre o fluxo de fatos basta — e a pergunta anterior a essa é se uma requisição na sessão de um
  cliente pode ler o `platform`.
- para `produto`: a lista de códigos de módulo **ativáveis** (o subconjunto de `glossario.md` §4.3
  que exclui núcleo, verticais e `PRV`) é fechada hoje? Sem ela, a tabela de domínio não tem seed
  legítimo.
- para `produto`: `capability` do glossário ("o que um módulo ativo passa a permitir", lida do
  registro de controle) e `CAP-<COD>-<nnn>` do catálogo de capacidades (opt-in, escolhida pelo
  comerciante) são **o mesmo objeto**? Se forem, capacidade é eixo independente de módulo e precisa
  de registro próprio; se não forem, o glossário tem dois sentidos para uma palavra.

VERIFICAÇÃO — rodado de fato, contra PostgreSQL 16.15 (container `devstack-pg`, base descartável
`forja_t0009_p7`, criada nesta sessão e **deixada em pé**: eu não derrubo base sem pedido):

| O que | Resultado real |
|---|---|
| Aceite 1 de `migrations.md` §3 — schema vazio | `0000` e depois `0001` aplicam do zero, sem erro |
| Aceite 2 — schema com dado representativo | 2 clientes inseridos; reaplicação não perdeu linha (`count = 2`) |
| Aceite 3 — duas rodadas seguidas | 2ª e 3ª rodadas: `NOTICE ... already exists, skipping`; impressão de estrutura (colunas, tipos, nulidade, default, expressão gerada, restrições, índices) **idêntica** por `diff` |
| `tenants_slug_format_check` | recusou `'Padaria'`, `'1padaria'` e slug de 42 caracteres |
| `tenants_slug_reserved_check` | recusou `'platform'`, `'pg_toast'` e `'verify_20260911'` |
| `tenants_slug_key` | recusou slug duplicado |
| `schema_name` gerada | `INSERT` com valor explícito falha: `cannot insert a non-DEFAULT value into column "schema_name"`; derivação confere (`padaria_central` produz `t_padaria_central`) |
| Junção com o livro-razão | `tenants` ⋈ `schema_migrations` por `schema_name` devolve a linha esperada |
| **Lock da reaplicação** (medido em `pg_locks`, mesma transação) | só `AccessShareLock` em relações de catálogo (`pg_class` e índices dele). **Nenhum lock sobre `platform.tenants`.** Reaplicar não faz caixa esperar |
| Recusas do carregador (`CONTRATO.md` §11), por `grep` | sem `CR`, UTF-8 válido, três diretivas presentes com justificativa de `reversivel`, nenhum token de controle de sessão ou transação, nenhum comando destrutivo, nenhuma referência a schema de cliente qualificado |

**Não rodei:** medida de custo sobre volume real (não existe cliente, nem volume, nem migration de
cliente); e não rodei o executor, porque ele não existe (passo 5).

CHECKLIST DE `migrations.md` §10:
1. **Forward-only? Etapa destrutiva?** Forward-only, nenhuma etapa destrutiva. Só `CREATE TABLE IF NOT
   EXISTS` e `COMMENT`; toda restrição nasce junto da tabela, nunca por alteração posterior.
2. **Roda duas vezes? Em schema vazio e com dado?** Sim, os três medidos acima.
3. **Que lock pega, e por quanto tempo, no maior cliente?** A pergunta quase não se aplica: o alvo é
   `platform`, um schema só, e a tabela é nova — nenhuma tabela existente é travada. Medido na
   reaplicação: nada além de catálogo. `lock_timeout` continua obrigatório e vem do executor
   (`CONTRATO.md` §6), sem padrão implícito.
4. **É transacional? Se não, o que a retomada limpa?** Transacional. Nada a limpar.
5. **Alvo é `platform` ou cliente, e só um?** `platform`, e só. Declarado no cabeçalho, e o arquivo
   não referencia schema de cliente qualificado (verificado por `grep` contra o padrão do §11).
6. **Precisa de backfill?** Não. Não move dado e não tem seed.
7. **Quem lê a estrutura antiga hoje?** Ninguém: não existe estrutura antiga, e não existe código de
   produto. O único leitor previsto é o executor do passo 5, que ainda não foi escrito.

AS CINCO PERGUNTAS DE `dados.md` §6:
1. **Outro ramo e outro fuso?** Ramo: nenhuma coluna carrega vocabulário de vertical, e o `slug` é
   identificador, nunca condição — nada ramifica por ele. Fuso: é o ponto forte do recorte. A tabela
   não tem coluna de fuso e **nenhum campo de calendário**; o único instante é `timestamptz` em UTC.
   `LACUNA-GLO-001` e `LACUNA-NUC-041` podem fechar para **qualquer** lado sem backfill nesta tabela.
2. **Que consulta fica cara, e qual índice ela pede?** Duas. (a) "lista de schemas da rodada", que o
   executor faz uma vez por rodada: varredura de uma tabela de ~10² linhas, e por isso **não criei
   índice nenhum** além dos dois implícitos (chave primária e unicidade do slug) — índice aqui seria
   custo de escrita sem leitor. (b) a junção com o livro-razão por `schema_name`, servida pela chave
   primária `(schema_name, version)` do lado do livro-razão. **Não medido em volume** — não existe
   volume; a forma é laço sobre 10² clientes contra índice, e o livro-razão cresce como
   (schemas × versões). Rotulado **estimativa**.
3. **Que coluna eu vou querer mudar em 6 meses?** `schema_name` gerada, se a regra do prefixo `t_`
   mudar (ambiente, sharding, prefixo por região) — seria expand/contract, e aceito o risco porque o
   prefixo está fixado por decisão fechada e a alternativa não tem enforcement nenhum. O segundo
   candidato é `created_at`, pelo motivo do `RISCOS`: quando o fato de provisionamento existir, esta
   coluna vira quase-sinônimo dele. Ela está certa hoje porque sem ela "desde quando esta linha
   existe" não tem resposta alguma, e o `COMMENT` na coluna diz explicitamente o que ela **não** é.
4. **Existe caminho em que uma consulta veja dado de outro cliente?** Não por dado de negócio: esta
   tabela não carrega nenhum — sem nome fantasia, sem documento, sem endereço, sem valor. O que ela
   **é**, por construção, é a enumeração da carteira, e esse é o risco real, declarado em `RISCOS`.
   Nenhuma consulta de cliente precisa dela: o schema é resolvido na borda, uma vez.
5. **Cardinalidade em 2 anos?** ~10² linhas (**estimativa**; a entrada é comercial e não é minha, a
   mesma postura da `§5` de `db/convencoes.md`). Em 10² e 10³ nada muda e a varredura continua livre.
   Em 10⁴ o gargalo deixa de ser esta tabela e passa a ser a iteração da rodada de migration sobre N
   schemas, que é problema do executor, não da estrutura.

MEMÓRIA SUGERIDA:
- type=decision escopo=plataforma camada=dados slug=decision-establishment-mora-no-schema-do-cliente
  — estabelecimento é tabela do cliente e não do `platform`: todo fato do núcleo o referencia por FK,
  e FK não atravessa schema; terminal fica indeciso pelo terceiro eixo de `D-03`.
- type=gotcha escopo=plataforma camada=dados slug=gotcha-coluna-de-autor-nao-tem-referente-com-d-03-aberta
  — toda tabela de fato do ciclo de vida trava no mesmo ponto: `autor` exige a residência do sujeito,
  que é `D-03` eixo 1; e a residência muda a **forma** da coluna, não só o valor.
- type=convention escopo=plataforma camada=dados slug=convention-identidade-e-imutavel-nao-leva-updated-at
  — linha cujas colunas são todas imutáveis não é cadastro: leva `created_at` e não leva
  `updated_at`, pelo mesmo argumento com que `D-04` tirou `updated_at` do fato.

PRÓXIMO PASSO SUGERIDO: `seguranca` — gate de isolamento sobre
`db/migrations/platform/0001__tenant_registry.sql`, com duas perguntas dirigidas: (1) a tabela é a
enumeração da carteira, então quem pode lê-la, e isso reforça `MIG-06`? (2) confirmar que as sete
ausências do topo do arquivo são ausências declaradas e não decisões por omissão.

---

## arquiteto-dados — 2026-09-11 (passo 8, correção do gate)

## RELATÓRIO — arquiteto-dados — T-0009
STATUS: OK

FEITO:
- Corrigi os três `ALTO` do gate, cada um com o mecanismo novo escrito e, nos dois que o auditor
  provou quebrados por execução, com a correção provada pela mesma via (Postgres 16.15 real).
- Parti `db/migrator/CONTRATO.md` (394 linhas, teto 400) em quatro arquivos, com **numeração de seção
  global** no conjunto: as citações `CONTRATO.md §n` que já existem dentro de `0000` e `0001`
  continuam endereçando a mesma seção. Critério do corte: uma pergunta por arquivo, não tamanho.
- Fixei a convenção de papel de banco em `db/papeis-e-credencial.md`, com a premissa que a torna
  auditável por catálogo, e registrei a enumeração da carteira como propriedade da tenancy escolhida.
- Declarei, sob invariante 10, o que o ledger registra e as **três ausências** dele, numeradas.
- Corrigi a `§4`: a diretiva `modulo` carrega o código de três letras de `glossario.md` §4.3.

ARQUIVOS:
- `db/migrator/CONTRATO.md` (editado — §1–§5, §14–§16, mais o mapa do §0)
- `db/migrator/APLICACAO-E-ALVO.md` (novo — §6–§10)
- `db/migrator/RECUSAS.md` (novo — §11)
- `db/migrator/PROVISION-E-VERIFY.md` (novo — §12–§13)
- `db/papeis-e-credencial.md` (novo)
- `db/migrations/platform/0000__ledger.sql`, `0001__tenant_registry.sql` (só leitura — não editados,
  `migrations.md` §1)

### Achado por achado

**`MIG-01` — FECHADO.** O alvo passa a ter duas formas, uma por regime (`§10.3.1` e `§10.3.2`). No
regime não-transacional: conexão dedicada, alvo fixado em **escopo de sessão** pelo mesmo caminho de
parâmetro e `quote_ident`, asserção de `current_schema()` antes de **cada** comando do corpo, e a
conexão fechada ao fim, nunca devolvida a pool. A verificação de namespace da `§10.4` ganhou forma que
roda nos dois regimes — retrato de `oid` fora do alvo, tirado antes e depois — e a assimetria está
declarada: no regime transacional ela **previne** (aborta antes do commit); no não-transacional ela
**detecta**, e a prevenção ali é a asserção por comando. A `§8` deixou de procurar o índice declarado
por nome solto e passa a procurá-lo dentro do namespace alvo; índice com esse nome fora do alvo é
achado, não limpeza — o executor não remove objeto fora do schema em que trabalhava.

**`MIG-02` — FECHADO.** Três mudanças. (1) `migrate --schema` só aceita nome presente em
`platform.tenants.schema_name`; `public` cai por essa regra, sem lista de exceção. (2) **`migrate`
nunca cria schema**: schema registrado que não existe é drift e para a rodada. Criar é ato exclusivo
de `provision`. (3) `provision` ganhou ordem normativa de quatro travas — forma, `UNIQUE (slug)` do
registro, ausência no `pg_namespace`, e `CREATE SCHEMA` **sem** `IF NOT EXISTS`, cuja recusa `42P06`
foi medida. As duas últimas são redundantes de propósito: uma é do executor, a outra é do servidor.

**`MIG-03` — FECHADO, por inversão.** A `§11` deixou de ser lista de bloqueio e passou a ser **lista
de permissão** por forma de comando, com o texto lido depois de remover comentário e preservar
literal, e com separação de comandos viável porque SQL dinâmico (`DO`, `EXECUTE`, `format(`) passou a
ser recusado em qualquer posição. `DROP` de qualquer objeto não está na lista — logo `DROP SCHEMA`,
`DROP CONSTRAINT`, `DROP TYPE`, `GRANT`, `REVOKE`, `ALTER TYPE` e `UPDATE` caem. A `§11.5` diz, em
quatro itens, **o que a lista não pega**: corpo de função, ausência de parser, privilégio de papel e
adversário. Era essa expectativa, e não a cobertura, que o auditor nomeou como defeito.

**`MIG-04` — FECHADO.** O primeiro terço já estava no `0001` (`CHECK` recusando prefixo `verify_`); a
`§10.2` agora reserva o mesmo prefixo na borda, e são cinco reservados, não quatro. O carimbo virou
`AAAAMMDDTHHMMSSZ` mais 16 hexadecimais de gerador criptográfico. O `drop` do passo 7 confere **três**
condições no catálogo antes de remover: o `oid` é o que esta execução criou, o nome casa com o padrão,
e o nome não está em `platform.tenants.schema_name`. Falhando qualquer uma, o schema fica e a saída é
`4`. O `DROP` é `CASCADE`, e isso está escrito.

**`MIG-05` — FECHADO.** O bootstrap pergunta `relkind`, não nome: view com o nome do ledger é saída
`3`, nomeando o `relkind`. Tabela existente passa por **retrato estrutural** (sete colunas com tipo,
nulidade e ordem; sete restrições por nome) contra o que a `§5` declara; divergência é saída `3`. O
`verify` ganhou `platform` como alvo, e como ele não é reproduzível num schema ao lado (as migrations
o qualificam literalmente), a referência é um **banco descartável**; sem privilégio para criá-lo, a
comparação **não acontece e é declarada** — saída `4`, nunca silêncio.

**`MIG-06` — FECHADO como convenção** (`db/papeis-e-credencial.md`), com a autorização do humano.
Duas afirmações: papel do executor ≠ papel da aplicação; nenhum papel de aplicação com `USAGE` em
`platform`. A premissa que as torna auditáveis está escrita junto: o que separa os dois é **privilégio
no banco**, verificável por consulta ao catálogo, não disciplina de código. Credencial vem de
ambiente, sem padrão implícito, com `.env.example` sem valor. **Deixei em aberto de propósito** um
papel de aplicação por cliente contra um só para todos: é decisão de operação e de borda, e o humano
autorizou as duas afirmações, não a terceira.

**`MIG-07` — REGISTRADO, não corrigido.** Não é corrigível dentro do desenho escolhido, e tentar
corrigir aqui seria pior (medido pelo gate: `REVOKE` em `pg_namespace` não fecha e quebra `\dt`). Está
em `db/papeis-e-credencial.md` §4 com o que expõe — a carteira, e quais módulos cada cliente tem — e
com a frase que `D-03` precisa herdar: a fronteira que protege a carteira é **quem consegue abrir
conexão**.

**`MIG-08` — FECHADO.** Saída e artefato do executor têm a classificação de `docs/auditorias/**`:
referência, nunca colagem, fora do canal de operação. Fica em `db/papeis-e-credencial.md` §4, com
ponteiro da `§3` do contrato (a mensagem de divergência) e da `§13.2` (a impressão de estrutura).

**Inconsistência `§12`/`§13` — FECHADA.** `verify` deixou de ser "não escreve nada": ele cria e derruba
schema descartável próprio, não toca em schema de cliente, não escreve no ledger e não altera
`platform.tenants`. `status` continua sendo o único que não escreve.

### As três perguntas do auditor

1. **Como o alvo é fixado no regime não-transacional?** `§10.3.2`, acima. Escopo de sessão em conexão
   dedicada, asserção por comando, conexão fechada ao fim.
2. **O `verify` registra o schema descartável no ledger?** **Não.** Linha do ledger nunca é apagada e
   o schema é: registrar produziria, para sempre, linhas nomeando schema inexistente, e `status`
   passaria a mentir. O conjunto pendente de um schema novo é conhecido sem ledger — é o conjunto
   inteiro. É exceção declarada ao "linha e efeito no mesmo commit" da `§7`, e a razão é que ali não
   há efeito a preservar.
3. **O que mais está pendente?** Três coisas, todas declaradas no texto: o fato de aplicação com
   desfecho de falha (`RN-PRV-013` exige, o ledger não guarda, e o autor depende de `D-03`); como uma
   restrição nasce depois da tabela de forma idempotente sem SQL dinâmico (`§16`); e a trava de
   concorrência entre rodadas (`§16`, já era pendência).

DECISÕES:
- **Numeração global entre os quatro arquivos**, em vez de renumerar por arquivo. `0000` e `0001`
  citam `§3`, `§5`, `§6`, `§9`, `§10` e `§13` em comentário, e migration aplicada não se edita:
  renumerar apodreceria referência dentro do único arquivo que não tem conserto. Custo: uma tabela de
  mapa no `§0`.
- **Não editei `0000__ledger.sql`.** Duas imprecisões de prosa nasceram desta revisão — o `COMMENT` de
  `module` diz "Nome do módulo", e o comentário do bootstrap cita `to_regclass`. As duas estão
  declaradas no texto novo (`§5.1` e `§9`) e a correção é `COMMENT ON` em migration futura. O
  comportamento já está fechado pela recusa do carregador e pela consulta de `relkind`.
- **Não criei migration nova nesta passada.** O `CHECK` de formato de `module` no ledger
  (`module IS NULL OR module ~ '^[A-Z]{3}$'`) seria a mesma camada estrutural que o `0001` deu ao
  slug, e eu recusei por dois motivos: `ALTER TABLE ... ADD CONSTRAINT` não tem `IF NOT EXISTS` e a
  `§11` recusa bloco `DO`, então não há forma idempotente aprovada hoje (é o item novo da `§16`); e
  DDL nova depois do gate pede gate de novo, o que atrasa o passo 5 sem fechar comportamento — a
  recusa do carregador já impede valor fora do código.
- **Corrigi um defeito da `§13` que o gate não pegou:** a impressão de referência era única ("o
  conjunto completo") e seria comparada contra clientes com **módulos diferentes**, produzindo
  diferença que não é drift. Agora é uma referência por combinação distinta de módulos ativos,
  reaproveitada quando repete.
- **Saída `4`** ("verificação não pôde ser concluída") entrou porque `verify` passou a ter um caminho
  em que ele não aprova nem reprova. Sem código próprio, esse caso sairia como `0`, que é a única
  resposta inaceitável.

RISCOS:
- A lista de permissão da `§11.2` é curta de propósito e **vai incomodar**: a primeira migration que
  precisar de uma forma fora dela para a rodada. É o comportamento desejado (ampliar a lista é revisão
  de contrato), mas quem implementa precisa saber que a mensagem de recusa tem que nomear a forma
  encontrada, ou o autor não descobre o que fazer.
- A verificação de namespace da `§10.4` tira retrato de catálogo a cada migration e a cada schema. Não
  medi o custo, e ele cresce com o número de objetos do banco, não com o volume de dado. Se for caro,
  a saída é restringir o retrato a `pg_class`, não abandoná-lo.
- `platform/0001` diz em comentário "dos quatro reservados" enquanto a `§10.2` agora lista cinco. O
  `CHECK` do arquivo está certo (cobre os cinco); é só a prosa que conta quatro. Não editável.
- Nada disto foi implementado: o executor não existe. Todo mecanismo novo é exigência sobre o passo 5,
  e o teste que o cobre está na `§14` (itens 7 a 12).

PERGUNTAS:
- para humano: um papel de aplicação **por cliente** ou **um só** para todos? Um por cliente faz o
  `GRANT` ser a fronteira e transforma erro de código em `permission denied`; um só é mais simples de
  operar e concentra a fronteira na borda. Não decidi porque o humano autorizou duas afirmações, e
  esta é a terceira (`db/papeis-e-credencial.md` §3).
- para humano: o `verify` do `platform` precisa de privilégio para criar banco descartável. Aceita que
  o papel do executor tenha `CREATEDB`, ou a comparação de `platform` fica declarada como não
  executada (saída `4`) fora dos ambientes em que ele tenha?

VERIFICAÇÃO:
Tudo abaixo contra PostgreSQL **16.15** em container descartável (`docker.io/library/postgres:16`,
removido ao fim), o mesmo motor do gate.

- **`MIG-01`, reprodução:** com `set_config(..., true)` em autocommit, o statement seguinte tem
  `current_schema() = public` e o parâmetro `forja.target_schema` já não existe — o
  `CREATE INDEX CONCURRENTLY` não achou a tabela do cliente. Mesmo defeito que o gate mediu.
- **`MIG-01`, correção:** com `set_config(..., false)` em conexão dedicada, `current_schema()` é
  `t_acme` antes e depois do corpo, `current_schemas(false)` tem **1** elemento, o
  `CREATE INDEX CONCURRENTLY` nasceu em `t_acme` e saiu `indisvalid = true`. Conexão nova abre em
  `public`: o estado de sessão não vaza.
- **`§10.4`:** o retrato de `oid` fora do alvo detectou **1** objeto novo (`public.vazou`) criado
  durante o corpo, em regime autocommit.
- **`§8`:** com `search_path` restrito ao alvo, `to_regclass('ix_ghost')` devolve nulo enquanto o
  índice existe em `public` — a busca por nome solto não prova ausência, e por isso a busca passou a
  ser por `relnamespace`.
- **`MIG-02`:** `CREATE SCHEMA` sem `IF NOT EXISTS`, pelo caminho de parâmetro e `format('%I')`, sobre
  schema existente: `ERROR: schema "t_acme" already exists` e `ROLLBACK`. Com `IF NOT EXISTS`, o mesmo
  comando: `NOTICE` e `COMMIT`.
- **`MIG-05`:** `to_regclass` diz que existe e `relkind` devolve `v` para uma view com o nome do
  ledger. Com tabela pré-existente de **mesmas sete colunas e nenhuma restrição**, o `0000` aplicado
  em uma transação passou inteiro, deixou **0 restrições**, e a tabela aceitou checksum não
  hexadecimal, duas linhas para a mesma `(schema_name, version)` e `duration_ms` preenchido com
  `applied_at` nulo.
- **`MIG-03`:** não há executor para rodar, então escrevi um **protótipo descartável** da `§11` (fora
  do repositório, em diretório temporário) e rodei sobre arquivos reais e hostis. `0000` e `0001`:
  aceitos. Recusados: `DROP SCHEMA t_vitima CASCADE`, `ALTER TABLE ... DROP CONSTRAINT`, `GRANT`,
  `UPDATE`, `ALTER COLUMN ... DROP NOT NULL`, `CREATE EXTENSION`, `SECURITY DEFINER`, bloco
  `DO $$ ... EXECUTE ...`, e `INSERT` sem `ON CONFLICT DO NOTHING`. Aceitos os dois casos legítimos:
  arquivo com `DROP` só em comentário e em literal de `COMMENT ON`, e migration não-transacional com
  `CREATE INDEX CONCURRENTLY` mais seed idempotente. **O protótipo não é entregável** (`D-01` aberta,
  e o executor é TypeScript no passo 5): ele prova que as regras escritas são decidíveis sobre o texto
  e que não reprovam os arquivos que já existem.
- **Não rodei:** lock, tempo e custo sobre N schemas reais (não há cliente nem volume); a verificação
  de `platform` por banco descartável (não há executor que a monte); e nenhum teste da `§14`, pela
  mesma razão.

### As cinco perguntas de `dados.md` §6

Não entreguei modelo nesta passada: nenhuma tabela, nenhuma coluna, nenhum índice. As cinco valem
sobre o que mudou, que é o mecanismo que aplica o modelo — e é assim que respondo, sem fingir que a
pergunta não se aplica.

1. **Sobrevive a outro ramo e a outro fuso?** Sim, e por construção: nada aqui conhece vertical, e a
   única coisa temporal que o executor escreve é `started_at`/`applied_at`, `timestamptz` em UTC. O
   carimbo do schema descartável do `verify` é UTC explícito (`...Z`), para não depender do fuso de
   quem roda o comando.
2. **Que consulta este mecanismo torna caro, e que índice ela pede?** A verificação de namespace
   (`§10.4`) e o retrato estrutural (`§9`, `§13.2`) leem catálogo — `pg_class`, `pg_namespace`,
   `pg_type`, `pg_proc`, `information_schema`. Catálogo já é indexado pelo Postgres e não aceita
   índice nosso. O custo cresce com o **número de objetos** do banco (logo, com N clientes × tabelas
   por cliente), não com volume de dado, e ele é pago por migration e por schema. **Não medido.**
3. **Que coluna eu vou querer mudar em 6 meses?** `platform.schema_migrations.module`: hoje é `text`
   sem `CHECK`, e a forma certa é `text` com `module IS NULL OR module ~ '^[A-Z]{3}$'`. Está certa
   como está **hoje** porque a recusa do carregador (`§4`) já impede valor fora do código, e porque
   não existe forma idempotente aprovada de acrescentar restrição (`§16`). A mudança é expand puro:
   `ADD CONSTRAINT` sobre valores que já obedecem.
4. **Existe caminho em que uma consulta veja dado de outro cliente?** Depois desta correção, o único
   leitor cross-schema é o `verify`, e ele lê **catálogo**, nunca linha de tabela de cliente — está
   escrito na `§13.2`. Os dois caminhos que o gate mediu (`MIG-02` e `MIG-03`) foram fechados pela
   `§10.1`/`§13.1` e pela `§11.2`. O que **permanece** é a enumeração da carteira pelo catálogo
   (`MIG-07`), que não é dado de negócio e não é corrigível neste desenho.
5. **Cardinalidade em 2 anos?** O ledger é `N schemas × M versões`: com ~10² clientes e ~10² a 10³
   migrations, 10⁴ a 10⁵ linhas (**estimativa** — a entrada de clientes é comercial e não é minha). Em
   10⁴ nada muda. Em 10⁶ a varredura de checksum da `§3` por rodada começa a pesar e passa a pedir
   índice por `schema_name`, que a PK já serve pelo prefixo. O que estoura antes disso não é a
   tabela: é o tempo de iterar N schemas numa rodada, que é problema de execução, não de estrutura.

MEMÓRIA SUGERIDA:
- type=convention escopo=plataforma camada=dados slug=convention-alvo-de-schema-tem-duas-formas-por-regime
  — em transação, `search_path` local; em autocommit, escopo de sessão em conexão dedicada e fechada
  ao fim, com asserção antes de cada comando. Uma forma só é o defeito, não a simplificação.
- type=convention escopo=plataforma camada=dados slug=convention-recusa-de-migration-e-lista-de-permissao
  — lista de bloqueio cria expectativa que não cumpre; a lista de permissão inverte o ônus e o que ela
  não pega fica escrito. Só é implementável porque SQL dinâmico está proibido no arquivo.
- type=convention escopo=plataforma camada=seguranca slug=convention-papel-do-migrador-nao-e-papel-da-aplicacao
  — fundir com a sugestão do `seguranca` no passo 7; o registro ganha a premissa: a separação é
  verificável por catálogo (dono de schema, `USAGE` em `platform`), não por leitura de código.
- type=gotcha escopo=plataforma camada=dados slug=gotcha-create-schema-if-not-exists-engole-o-alvo-errado
  — `IF NOT EXISTS` em provisionamento transforma erro de digitação em aplicação dentro do schema de
  outro cliente, com saída de sucesso. Idempotência no lugar errado é a trava que falta.

PRÓXIMO PASSO SUGERIDO: `seguranca` — reauditar os quatro arquivos do contrato e
`db/papeis-e-credencial.md` contra `MIG-01` a `MIG-08`, e confirmar que a `§11.5` declara o suficiente
sobre o que a lista de permissão não cobre. Depois disso, `coder` no passo 5.

## seguranca — 2026-09-11 (passo 8, reauditoria do gate 2)

## RELATÓRIO — seguranca — T-0009
STATUS: PARCIAL
FEITO:
- Reauditei os quatro arquivos do contrato partido, `db/papeis-e-credencial.md` e
  `db/migrations/platform/0001__tenant_registry.sql` (este, pela primeira vez). Relatório em
  `docs/auditorias/2026-09-11-executor-e-schema-platform-reauditoria.md`.
- Confirmei ou derrubei `MIG-01` a `MIG-08` um a um, com o que verifiquei em cada um: seis fecham,
  `MIG-07` fecha por registro, `MIG-05` fecha só na perna do bootstrap, `MIG-02` fecha só na criação.
- Doze provas contra Postgres 16.15 real (container descartável, removido ao fim), `P1`–`P12`.
- Nove achados novos: dois `ALTO` (`MIG-09`, `MIG-10`), cinco `MÉDIO` (`MIG-11`, `MIG-14` a `MIG-17`),
  dois `BAIXO` (`MIG-12`, `MIG-13`). `MIG-09` é **reincidente de `MIG-02` por outra porta**; `MIG-11` é
  **reincidente parcial de `MIG-05`**.
- Respondi as quatro perguntas do brief (§11.5 declara o suficiente; detecção basta no regime
  não-transacional; as três condições do `drop`; a auditabilidade por catálogo), as sete ausências do
  `0001`, o invariante 10 sobre o ledger, e as cinco de `seguranca.md` §1.
- Registrei a entrada de `D-03` que o humano pediu (um papel de aplicação por cliente contra um só),
  com o custo de cada saída em isolamento e em operação, sem decidir.

ARQUIVOS:
- `docs/auditorias/2026-09-11-executor-e-schema-platform-reauditoria.md` (novo)
- `db/migrator/CONTRATO.md`, `db/migrator/APLICACAO-E-ALVO.md`, `db/migrator/RECUSAS.md`,
  `db/migrator/PROVISION-E-VERIFY.md`, `db/papeis-e-credencial.md`,
  `db/migrations/platform/0000__ledger.sql`, `db/migrations/platform/0001__tenant_registry.sql`
  (só leitura)

NÃO FEITO:
- Nenhum comportamento do executor foi verificado: ele não existe. Tudo é exigência sobre o passo 5.
- Lock, tempo e custo sobre N schemas reais — não há cliente nem volume.
- Nenhuma perna do `verify` foi exercitada, pela mesma razão.
- Custo do retrato de catálogo da §10.4 — é pergunta de `performance`, não minha.

DECISÕES:
- **Liberei o passo 5 por partes em vez de bloquear tudo ou aprovar tudo.** A lista está na §9 do
  relatório. Bloqueio geral atrasaria mecanismo que está escrito, medido e sem achado; aprovação geral
  entregaria ao `coder` quatro decisões que não são dele (o mecanismo da §11.3, a citação de
  `CREATE SCHEMA`, as duas indefinições do `verify`, e o registro de módulo ativo que não existe).
- **Não relitiguei a decisão do humano sobre `CREATEDB`.** `MIG-11` não pede o privilégio: aponta que,
  sob a decisão tomada, a saída `4` vira o desfecho permanente de todo `verify` e a perna do `MIG-05`
  que motivou a correção fica sem verificação em qualquer ambiente — e que existe caminho sem
  privilégio nenhum, o retrato estrutural que a §9 já usa para o ledger.
- **`MIG-09` como `ALTO` e não `CRÍTICO`:** o ator precisa da credencial do executor, logo já lê o dado
  diretamente. O que o eleva acima de `MÉDIO` é que a consequência é a pior do sistema (um cliente
  resolvendo para o schema de outro), nenhuma verificação do contrato a detecta, a linha não guarda
  sinal de ter mudado, e a imutabilidade está afirmada em `COMMENT` como se fosse propriedade.
- **Relatório com 467 linhas**, acima do teto de `00-nucleo.md` §8, e a justificativa é o escopo: 8
  reconferências com evidência própria, 9 achados novos, 4 perguntas dirigidas do brief, as 7 ausências
  do `0001` uma a uma, e a entrada de `D-03`. Partir por arquivo espalharia a mesma auditoria por cinco
  documentos que ninguém leria na ordem.

RISCOS:
- **A pressão sobre a lista de permissão é o risco de médio prazo**, não um achado: §3.2 do relatório
  enumera o que é legítimo e vai ser recusado (extensão, view materializada, particionamento pela
  metade, `DROP INDEX` de índice morto). A lista sobrevive se a mensagem de recusa nomear a forma
  encontrada e o caminho de ampliação; morre se a primeira recusa legítima for resolvida afrouxando.
- `MIG-10` e `MIG-16` têm a mesma raiz: a revisão trocou mecanismos e deixou duas frases descrevendo
  intenção onde antes havia forma. Quem reescrever deve conferir que cada afirmação de mecanismo tem
  comando executável por trás — as duas que faltavam eu achei executando, não lendo.
- `tenant_id` não tem regra de geração escrita em lugar nenhum, e as dependências aprovadas não trazem
  gerador ordenado no tempo. O caminho de menor resistência do passo 5 é o aleatório, que `D-04`
  recusou. Fora do meu escopo; anotado na §8 do relatório.

PERGUNTAS:
  - para humano: `MIG-09` pede migration `0002` (gatilho que recusa `UPDATE`/`DELETE` em
    `platform.tenants`, e o ato recusado virando fato). Ela entra nesta tarefa, antes do passo 5, ou
    vira tarefa própria? O passo 5 não depende dela.
  - para `arquiteto-dados`: a §11.3, lado `tenant`, vai ganhar padrão escrito como o lado `platform`
    tem — e o que ela faz com `alias.coluna` e com `pg_catalog.`? É o que decide se `MIG-10` fecha por
    mecanismo ou por revisão humana declarada.

VERIFICAÇÃO:
Doze provas contra PostgreSQL **16.15** (`docker.io/library/postgres:16`, container descartável
removido ao fim), com `0000` e `0001` aplicados do arquivo real, sem edição. Tabela completa na §0 do
relatório. As que sustentam os dois `ALTO`:
- **`P12`** — `DELETE` da linha de um cliente e `UPDATE` do slug de outro: o `tenant_id` do primeiro
  cliente passou a resolver para o schema do segundo, cujo dado li em seguida. Nenhum gatilho, nenhuma
  regra, nenhum registro. `created_at` inalterado.
- **`P3`** — com alvo correto e `search_path` de um schema só, três comandos que **começam** por forma
  permitida (`CREATE TABLE IF NOT EXISTS ... AS SELECT`, `INSERT ... ON CONFLICT DO NOTHING`,
  `CREATE OR REPLACE VIEW`) copiaram e expuseram a linha de outro cliente dentro do alvo.
- **`P7b`** — retrato de `oid` da §10.4 foi de 26 para 26 enquanto a tabela de outro cliente ganhava
  `CHECK`, coluna, `COMMENT`, `DEFAULT` e uma linha.
- **`P4`/`P5`** — a correção do `MIG-01` funciona: índice em `t_acme`, `indisvalid = t`, havendo
  `public.orders` homônima; conexão nova nasce em `public`.
- **`P11`** — `PREPARE cs(text) AS CREATE SCHEMA $1` é erro de sintaxe: o comando não aceita o nome
  como parâmetro.
- Busca por credencial na árvore (`postgres://`, `PGPASSWORD`, `DATABASE_URL`, `PGUSER=`): só as duas
  auto-referências das auditorias. Nenhum segredo no repositório.

MEMÓRIA SUGERIDA:
- type=gotcha escopo=plataforma camada=dados slug=gotcha-lista-de-permissao-classifica-o-comeco-do-comando
  — inverter recusa para permissão não fecha a classe: `CREATE TABLE ... AS SELECT`,
  `INSERT ... SELECT` e `CREATE OR REPLACE VIEW` começam por forma permitida e leem outro schema, e o
  retrato de `oid` não os vê porque o objeto novo nasce dentro do alvo.
- type=gotcha escopo=plataforma camada=dados slug=gotcha-imutabilidade-afirmada-em-comment-nao-e-trava
  — `COMMENT ON` dizendo "linha nunca é alterada" não impede `UPDATE`; dois comandos fazem um cliente
  resolver para o schema de outro, e nenhuma verificação do executor detecta.
- type=convention escopo=plataforma camada=seguranca slug=convention-catalogo-prova-privilegio-nao-prova-credencial
  — corrige a premissa de `db/papeis-e-credencial.md` §1: o catálogo prova dono de schema e `USAGE`;
  com que papel a aplicação conecta é observável de execução (`pg_stat_activity`, `log_connections`),
  e some na desconexão.
- type=state escopo=plataforma camada=dados slug=state-d-03-entrada-papel-de-aplicacao-por-cliente
  — a terceira afirmação de papel de banco (um papel por cliente contra um só) entra no pacote de
  `D-03` pelo terceiro eixo; custos das duas saídas na §6 do relatório de reauditoria.

PRÓXIMO PASSO SUGERIDO: `arquiteto-dados` — fechar `MIG-10`, `MIG-11`, `MIG-16` e `MIG-17`, que são os
quatro que bloqueiam parte do passo 5; `MIG-09`, `MIG-14` e `MIG-15` podem correr em paralelo ao
`coder`, que já pode começar pela lista liberada da §9 do relatório.

## arquiteto-dados — 2026-09-11 (passo 8, correção da reauditoria)

## RELATÓRIO — arquiteto-dados — T-0009
STATUS: OK

FEITO:
- **`MIG-09` (ALTO) fechado, e o ataque foi reproduzido nos dois sentidos.** Antes: com a credencial do
  executor, `DELETE`+`UPDATE` fizeram o `tenant_id` do `acme` resolver para `t_globex` (reproduzido aqui,
  não só citado). Depois de `0002`: os dois comandos, mais `TRUNCATE`, `DELETE` sem `WHERE`, `DELETE ...
  WHERE false` e `UPDATE` de `created_at`, todos recusados pelo banco; `INSERT` do `provision` intacto.
- **`MIG-10` (ALTO) fechado.** §11 reescrita: classificação pela **forma inteira** do comando, mais o
  mecanismo de fronteira escrito dos **dois** lados (o lado `tenant` era um bullet sem padrão). Medido com
  protótipo do classificador: os 5 comandos de `P3`/`P7b` e mais 10 variantes são recusados; 11 comandos
  legítimos passam, alias inclusive; os 5 arquivos reais de `db/migrations/platform/` passam inteiros.
- **`MIG-11` fechado.** A referência do `platform` deixou de ser banco descartável (que exigia `CREATEDB`
  e fazia `verify` terminar sempre em `4`) e passou a ser **retrato declarado versionado**,
  `db/referencia-estrutural-platform.txt`. `4` voltou a ser só transitório; divergência de estrutura virou
  saída `3`. Efeito colateral deliberado: o `DROP DATABASE`, único comando destrutivo sem condição de alvo
  escrita (§3.4 da reauditoria), sumiu do contrato.
- **`MIG-12` fechado** (redação): §8 separa a busca de **limpeza** (restrita ao alvo) da busca de
  **achado** (por nome em todos os namespaces), com a consulta escrita.
- **`MIG-13` fechado.** `verify` enumera pelo **catálogo**; registro entra como confronto nas duas direções
  (`schema_without_registry`, `registered_schema_missing`). Descartável órfão tem tratamento próprio e é
  nomeado a cada rodada até uma mão humana o derrubar.
- **`MIG-14` fechado.** A premissa falsa foi substituída por tabela do que o catálogo prova e do que ele
  não prova, com duas correções: papel de aplicação vira membro de `forja_app` (a classe passa a ser fato
  de catálogo, por `pg_auth_members`), e "com que papel a aplicação conecta" é declarado observável de
  **execução** (`log_connections`/`pg_stat_activity`), nunca de catálogo.
- **`MIG-15` fechado por captura, não por ausência declarada.** Nasceu `platform.executor_events` (`0004`),
  com 10 tipos de evento em domínio fechado, um por detecção que o contrato já especificava. §5.1 foi
  reescrita separando os dois impedimentos: o real da ausência 1 era o `ROLLBACK` (resolvido, segunda
  conexão), não `D-03` (que só impede dizer *qual pessoa*). Duas ausências permanecem, numeradas.
- **`MIG-16` fechado.** §10.3.0 escreve a citação de `CREATE SCHEMA` **no servidor**:
  `SELECT format('CREATE SCHEMA %I', $1)`, texto devolvido e enviado verbatim. Medido com slug hostil.
- **`MIG-17` fechado.** §2.3 declara que o registro de módulo ativo não existe, §13.1 passo 6 e §13.2 item 5
  dizem o que o executor faz enquanto isso, e a §11.6 **recusa a rodada inteira** se houver qualquer arquivo
  em `db/migrations/modules/**`. Hoje o diretório não existe e nada é bloqueado.
- **Resíduos das ressalvas:** `MIG-02` (aberto na mutação) fecha junto do `MIG-09`; `MIG-03` (incompleto na
  classe) fecha junto do `MIG-10`; `MIG-05` (só no papel na perna do `verify`) fecha junto do `MIG-11`.
- **A forma idempotente de acrescentar restrição** (§16, o item que o brief mandou resolver) virou **§17**,
  com as três formas medidas e a recusa que as protege (`ADD CONSTRAINT` em migration não-transacional
  agora é recusa de carregador, §11.4).
- **Dois defeitos achados ao medir, e corrigidos:** (a) `§11.4` proibia `EXECUTE` em qualquer posição, o que
  tornava impossível `CREATE TRIGGER`, que a própria §11.2 permite — a proibição passou a excluir
  `EXECUTE FUNCTION`/`PROCEDURE`; (b) `BEGIN` proibido em qualquer posição impedia corpo de função em
  plpgsql — passou a ser proibido só **abrindo comando**. Os dois só apareceram porque o protótipo rodou
  contra os arquivos reais.
- **Uma porta idêntica à do `MIG-09`, no livro-razão, fechada antes de virar achado** (`0003`): `UPDATE` em
  `platform.schema_migrations.checksum` alinharia o registro ao arquivo editado e apagaria a única
  evidência de adulteração do sistema. A trava deixa passar **uma** atualização, a conclusão de uma
  migration em voo (§8 passo 5), e recusa toda reescrita e toda remoção.

ARQUIVOS:
- `db/migrations/platform/0002__tenant_registry_immutability.sql` (novo)
- `db/migrations/platform/0003__ledger_append_only.sql` (novo)
- `db/migrations/platform/0004__executor_events.sql` (novo)
- `db/referencia-estrutural-platform.txt` (novo)
- `db/migrator/IMUTABILIDADE-E-FATOS.md` (novo — §18 e §19)
- `db/migrator/RECUSAS.md` (reescrito — §11.1 a §11.7)
- `db/migrator/PROVISION-E-VERIFY.md` (reescrito — §12, §13.1, §13.2, e §13.3 nova)
- `db/migrator/CONTRATO.md` (editado — §0, §2.3, §5.1, §14, §15, §16, e §17 nova)
- `db/migrator/APLICACAO-E-ALVO.md` (editado — §8, §9, §10.3.0, §10.4)
- `db/papeis-e-credencial.md` (editado — premissa de auditabilidade; §5 nova)
- `db/migrations/platform/0000__ledger.sql`, `0001__tenant_registry.sql` (só leitura, não editados)

NÃO FEITO: —

DECISÕES:
1. **Três migrations, não uma.** `migrations.md` §7 pede um significado por arquivo. `0002` é a trava do
   registro (o que o brief pediu), `0003` é a mesma porta no livro-razão, `0004` é a casa dos fatos.
2. **A trava é gatilho, não privilégio — e os dois, não um.** `REVOKE UPDATE, DELETE, TRUNCATE` do executor
   entra em `db/papeis-e-credencial.md` §5, porque privilégio não viaja em migration (§11.2). Medido: o
   `REVOKE` segura mesmo com o gatilho desligado, e o dono consegue devolvê-lo a si mesmo. Nenhuma das duas
   camadas resiste ao dono decidido; somadas, transformam **um comando em três atos deliberados**. A trava
   que resistiria ao dono — `platform.tenants` pertencendo a outro papel — foi recusada com o custo escrito
   em §18.3: separaria a linha do livro-razão do efeito da migration, que precisam cair no mesmo commit.
3. **Gatilho de comando, não de linha**, nas recusas totais: `TRUNCATE` só admite gatilho de comando, e
   `DELETE ... WHERE false` não dispara gatilho de linha — passaria sem recusa.
4. **Cifrão com rótulo passa a ser permitido** (`$fn$`), cifrão sem rótulo continua recusado. Sem isso não
   existe corpo de função legível, e `CREATE TRIGGER` na lista de permissão seria letra morta.
5. **`security_invoker = true` passou a ser obrigatório em `CREATE OR REPLACE VIEW`.** View executa com o
   privilégio de quem a criou, e quem cria é o executor, que alcança todos os schemas. Custo zero hoje
   (não existe view nenhuma), e o dia de fazer isso é antes da primeira.
6. **`MIG-15` virou captura e não ausência declarada.** O invariante 10 inverteu o ônus e a justificativa
   antiga não sobrevivia à leitura do gate. O sujeito é o papel de banco (`db_role`); a pessoa continua
   dependendo de `D-03` e entra por expand.
7. **UUID versão 7 fixado como o gerador do executor** (§13.1), para `tenant_id` e `event_id`. `D-04`
   fechou "ordenado no tempo, gerado na borda" e admitia v7 ou ULID; deixar a escolha para o passo 5
   produziria o aleatório, que é a saída que `D-04` recusou. `node:crypto` é biblioteca padrão e não toca
   `D-01`.
8. **O contrato foi partido de novo**, com o mesmo critério declarado da primeira vez: uma pergunta por
   arquivo, numeração global preservada. Nenhuma seção mudou de número; `§17`, `§18` e `§19` nasceram no fim.

RISCOS:
- **`MIG-10` não pega tudo, e a §11.7 agora lista o quê:** corpo de função além da §11.3/§11.4 (função
  criada numa migration e chamada em outra é o caminho mais longo que resta); análise de texto sem parser
  (grafia exótica, identificador citado com aspas); expressão em `DEFAULT`/`CHECK`/índice chamando função
  criada antes; nada limita o privilégio do papel; e o adversário com acesso ao repositório continua fora
  do alcance desta lista — a defesa dele é revisão humana mais privilégio.
- **Falso positivo virou mais provável.** A busca de referência qualificada corre sobre literais também,
  então `COMMENT ON ... IS 'ver t_globex.orders'` reprova o arquivo. É o lado seguro e está declarado, mas
  é a primeira coisa que vai incomodar quem escreve migration.
- **A referência declarada do `platform` só vale enquanto for regenerada.** O teste de aceite 18 é o que
  impede os dois de divergirem em silêncio; sem ele rodando, o arquivo apodrece e `verify` aprova o errado.
- **O `md5` de `pg_get_functiondef` é formatado pelo servidor**: trocar de versão **maior** do Postgres
  pode mudar a referência sem que uma linha do repositório mude. Declarado no arquivo e na §13.3.
- **Três migrations novas exigem gate de novo**, e o escopo delas inclui DDL que escreve fato — o que é
  superfície nova, não só correção.
- **`forja_app` é papel de grupo que ainda não existe**: a auditabilidade da afirmação 2 de
  `papeis-e-credencial.md` depende de quem criar os papéis seguir a §1. Enquanto não houver papel de
  aplicação nenhum, a consulta é verdadeira por vacuidade.
- Fora de escopo, anotado: `docs/produto/` ainda não tem `RN` para "o registro de clientes é imutável" — a
  regra está no contrato de banco e não no catálogo de regra de negócio.

PERGUNTAS:
  - para humano: `db/migrations/platform/0003__ledger_append_only.sql` e `0004__executor_events.sql` vão
    além do que o brief pediu (ele pedia `0002`). Ficam, ou saem para tarefa própria? Argumento para ficar:
    `0003` é a mesma porta do `MIG-09` na tabela vizinha, e `0004` é o que o invariante 10 cobra de `MIG-15`.
  - para humano: a memória `convention-nome-de-schema-e-parametro-nunca-concatenacao` está **mais forte que
    o Postgres permite** e precisa da correção abaixo (é `memory/**`, território do orquestrador).

VERIFICAÇÃO: PostgreSQL **16.15** em container descartável (`docker.io/library/postgres:16`, removido ao
fim). Tudo abaixo foi executado, nada é inferência.
- `0000`→`0004` aplicadas **do zero** (banco vazio) e **duas vezes seguidas**, e também sobre banco **com
  dado** (2 clientes, 1 linha de livro-razão): segunda rodada só emite `NOTICE ... skipping`, nenhuma linha
  nova, nenhum erro. São os testes 1, 2 e 3 da §14.
- `MIG-09`, os dois sentidos: o par `DELETE`+`UPDATE` **funcionou** antes da `0002` (o `tenant_id` do `acme`
  passou a resolver para `t_globex`) e **é recusado** depois. Mais `TRUNCATE`, `DELETE` sem `WHERE`,
  `DELETE ... WHERE false` e `UPDATE` de `created_at`: recusados. `INSERT`: passa.
- Escapes medidos: `ALTER TABLE ... DISABLE TRIGGER` do dono **passa**;
  `SET session_replication_role='replica'` com papel não-superusuário leva `permission denied`; `REVOKE` do
  dono **funciona** e o dono devolve o privilégio a si mesmo com `GRANT`.
- Captura do ato recusado: o log do servidor grava `ERROR` **e** `STATEMENT` com o comando na íntegra
  (`log_min_error_statement` no padrão).
- `0003`: a conclusão legítima (`applied_at` nulo → preenchido) passa; `UPDATE` de `checksum`, de `version`,
  de `started_at`, o desfazer de `applied_at`, `DELETE` e `TRUNCATE` são recusados; `INSERT` normal passa.
- `0004`: `INSERT` de fato passa; `UPDATE`/`DELETE` recusados; `kind_code` fora do domínio barrado pela
  chave estrangeira; `received_at < occurred_at` barrado pelo `CHECK`.
- `MIG-10`: protótipo do classificador (scratchpad, **não** é código de produto) implementando a §11
  reescrita — 15 formas de ataque recusadas (as 5 medidas em `P3`/`P7b` mais 10 variantes), 11 comandos
  legítimos aceitos, e os 5 arquivos reais passando inteiros.
- `MIG-16`: `PREPARE cs(text) AS CREATE SCHEMA $1` → erro de sintaxe (confirma `P11`).
  `SELECT format('CREATE SCHEMA %I', $1)` com o slug `t_x"; DROP TABLE probe.alvo; --` devolveu o comando
  citado; enviado verbatim, criou schema com o nome **literal**, nenhum comando extra rodou, e a tabela
  alvo continuou com as duas linhas.
- §17: `ADD CONSTRAINT` duas vezes → erro na segunda; dentro de transação que falha → `ROLLBACK` e a
  tentativa seguinte aplica limpa; `VALIDATE CONSTRAINT` duas vezes → aceito; `CREATE UNIQUE INDEX IF NOT
  EXISTS` duas vezes → `NOTICE` e segue; `CREATE OR REPLACE TRIGGER` duas vezes → 1 gatilho em `pg_trigger`.
- §13.3: a impressão é **neutra ao nome do schema** — dois schemas com a mesma DDL e nomes diferentes
  (`t_a`, `t_verify_x`) produziram saída idêntica byte a byte; e detecta diferença real — uma coluna
  acrescentada apareceu como uma linha a mais, e só ela.
- Teste de aceite 18: a impressão do `platform` de um banco construído do zero **confere byte a byte** com
  `db/referencia-estrutural-platform.txt`.
- Higiene: todos os arquivos UTF-8, nenhum `CR`, nenhum arquivo acima de 400 linhas (maior: `CONTRATO.md`,
  354), nenhuma credencial na árvore.
- **Não rodei:** nada do executor, porque ele não existe (é o passo 5); lock, tempo e custo sobre N schemas
  reais, porque não há cliente nem volume; o `verify` em nenhuma perna, pela mesma razão.

CHECKLIST DE `migrations.md` §10 — vale para as três novas (`0002`, `0003`, `0004`):
1. **Forward-only? destrutiva?** Sim, forward-only. Nenhuma remove, renomeia ou trunca nada: `0002` e `0003`
   só criam função e gatilho, `0004` só cria tabela, índice, gatilho e seed. Nenhuma etapa do ciclo
   expand/contract está envolvida, logo não há aprovação de remoção a pedir.
2. **Roda duas vezes? em vazio e com dado?** Sim, as três, medido nos três estados. Idempotência por
   `CREATE OR REPLACE` (função e gatilho), `CREATE TABLE/INDEX IF NOT EXISTS` e `ON CONFLICT DO NOTHING`.
3. **Que lock, por quanto tempo, no maior cliente?** As três são de alvo `platform`, que tem 4 tabelas e
   cardinalidade de dezenas a milhares de linhas — não há "maior cliente" aqui. `0002` e `0003` pegam
   `ACCESS EXCLUSIVE` em `platform.tenants` e `platform.schema_migrations` pelo tempo de criar um gatilho
   (metadado, sem reescrita de tabela); `0004` cria tabela nova, sem lock sobre coisa existente.
   `lock_timeout` continua obrigatório e sem padrão implícito (§6). **Tempo não medido** sobre volume real,
   porque não existe volume real.
4. **Transacional? o que a retomada limpa?** As três são `transacional: sim`. A retomada não limpa nada: o
   `ROLLBACK` desfaz, e as formas usadas são todas idempotentes por conta própria.
5. **Alvo é `platform` ou cliente, e só um?** `platform`, nas três, declarado no cabeçalho e conferido
   contra o diretório.
6. **Precisa de backfill?** Não. Nenhuma move dado. O seed da `0004` é domínio fechado por código estável,
   idempotente, que é o que `migrations.md` §7 admite.
7. **Quem lê a estrutura antiga hoje?** Ninguém: não existe código de produto lendo banco, e o executor é o
   passo 5. Quem vai ler são os arquivos do contrato, e eles foram atualizados nesta mesma passada.

AS CINCO PERGUNTAS DE `dados.md` §6, para o que foi acrescentado:
1. **Outro ramo, outro fuso?** Nada aqui tem vocabulário de ramo: evento de executor, papel de banco,
   schema. Fuso: `occurred_at` e `received_at` são `timestamptz` em UTC, e nenhuma leitura desta tabela é
   "por dia do cliente" — é registro de operação do provedor, não de venda.
2. **Que consulta fica cara, e qual índice ela pede?** "O que houve por último", e "o que houve deste tipo".
   A segunda tem índice (a chave estrangeira, que `dados.md` §3 já exige). A primeira **não** tem, de
   propósito: a chave primária é `uuid` ordenado por tempo e a tabela tem 10²–10⁴ linhas em 2 anos.
3. **Que coluna eu vou querer mudar em 6 meses?** `detail`, hoje texto com teto de 2000 bytes. Se o executor
   passar a querer estrutura dentro dela (lista de diferenças do `verify`, por exemplo), a resposta certa é
   coluna nova ou tabela filha, nunca `jsonb` de conveniência — e a troca é expand, sem tocar linha escrita.
4. **Isolamento: alguma consulta vê dado de outro cliente?** Estas tabelas moram em `platform`, que nenhum
   papel de aplicação alcança (`papeis-e-credencial.md` §1, afirmação 2). Elas **carregam a carteira** pelos
   nomes de schema, e por isso estão classificadas junto da saída do executor (§4 do mesmo arquivo): saem
   por referência, nunca coladas. Nenhuma coluna guarda dado de negócio de cliente.
5. **Cardinalidade em 2 anos?** `executor_event_kinds`: 10 linhas, cresce por migration. `executor_events`:
   10²–10⁴ — rodada limpa não escreve nada, só falha, divergência e `verify` com achado. Em 10⁶, que só
   aconteceria com o executor em laço (outro defeito), entra índice por tempo, por expand.

MEMÓRIA SUGERIDA:
  - type=convention escopo=plataforma camada=dados
    slug=convention-nome-de-schema-e-parametro-nunca-concatenacao — **corrigir o registro existente**: ele
    diz "o nome chega por bind parameter", e `CREATE SCHEMA $1` é **erro de sintaxe** (medido em 16.15).
    Enunciado certo: *nenhum identificador é composto por código do cliente; o nome atravessa como bind
    parameter para o **servidor**, e quem cita é o Postgres — `quote_ident` quando o nome entra como
    **valor** (`search_path`), e `SELECT format('CREATE SCHEMA %I', $1)` devolvendo o **texto do comando**
    quando o nome precisa estar dentro dele, texto que o cliente envia verbatim*. A prova do slug hostil
    continua valendo e foi refeita hoje.
  - type=decision escopo=plataforma camada=dados slug=decision-imutabilidade-do-controle-e-trava-de-banco —
    tabela do `platform` declarada imutável leva gatilho de recusa; declaração em `COMMENT` não é trava, e
    a diferença custou um vazamento entre clientes medido.
  - type=convention escopo=plataforma camada=dados slug=convention-restricao-idempotente-sem-bloco-do —
    três formas aprovadas de acrescentar restrição sem `DO`, e por que `ADD CONSTRAINT` só vale em migration
    transacional.
  - type=decision escopo=plataforma camada=dados slug=decision-uuid-v7-como-gerador-da-borda — `D-04` fixou
    "ordenado no tempo"; a forma é UUIDv7 com aleatório criptográfico, e ela é do executor e de todo código
    que cunhe chave.
  - type=gotcha escopo=plataforma camada=dados slug=gotcha-comentario-dentro-de-corpo-de-funcao-nao-e-removido
    — o corpo entre cifrões é literal, então o carregador não remove comentário de lá; nota sobre a função
    vai acima dela.

PRÓXIMO PASSO SUGERIDO: `seguranca` — gate sobre o delta: `0002`, `0003`, `0004`, a §11 reescrita
(`MIG-10`), a §13.2/§13.3 (`MIG-11`, `MIG-13`), e a §5 de `papeis-e-credencial.md`. Depois dele, `coder`
com o bloqueio da §9 da reauditoria levantado.

## seguranca — 2026-09-11 (passo 8, gate 2 sobre o delta)

Relatório completo em `docs/auditorias/2026-09-11-delta-db-e-borda-api.md` (escopo A, §0 a §2, §5 e
§6). As duas auditorias anteriores não foram editadas. O denso:

**Oito dos nove achados da reauditoria fecham.** `MIG-11`, `MIG-12`, `MIG-13`, `MIG-14`, `MIG-16` e
`MIG-17` estão fechados no texto; `MIG-09` está fechado no mecanismo (as seis formas de mutação em
`platform.tenants` foram recusadas em banco real com a credencial do executor); `MIG-15` fecha em
oito de nove. O arquivo `db/referencia-estrutural-platform.txt` reproduz **byte a byte** do banco
real em PostgreSQL 16.15, 62 linhas, `diff` vazio — a perna do `platform` do `verify` passa a existir.

**`MIG-10` reabre, e é o único bloqueio que sobra.** O padrão de fronteira de schema da §11.3 não
pega `"t_globex".orders` nem `T_GLOBEX.orders`, e o Postgres resolve os dois para o mesmo objeto.
Duas formas inteiras da §11.2 corrigida alcançaram o outro cliente em banco real: a view devolveu a
linha alheia e o `ALTER TABLE` escreveu no schema alheio, com a §10.4 sem ver nada. `SEC-01`, ALTO,
reincidente.

**Achados novos, todos com dono `arquiteto-dados`:** `SEC-01` [ALTO] · `SEC-02` [MÉDIO] o
`DISABLE TRIGGER` do dono derruba a trava da `0002` e a impressão da §13.3 fica idêntica, porque
`pg_get_triggerdef` não carrega `tgenabled` — enquanto o escape mais largo (trocar o corpo de
`reject_mutation`, que neutraliza as três tabelas de uma vez) é detectado pelo `md5` · `SEC-03`
[MÉDIO] um `DELETE` na tabela de domínio, que não tem trava, desarma a captura de um tipo de evento
para sempre, e a §19.2 garante que a rodada não mude de comportamento · `SEC-04` [MÉDIO] a recusa do
carregador não vira fato e a ausência não está declarada · `SEC-05` [BAIXO] divergência em linha
`funcao` não distingue reformatação do servidor de corpo trocado.

**Veredito:** o `coder` fica liberado para `provision` passo 4, o schema do `verify`, o `verify`
inteiro e tudo que lê módulo ativo. **O carregador (§11) continua bloqueado** até `SEC-01`. `SEC-02`
a `SEC-05` correm em paralelo e não tocam uma linha do executor.

**Decisão do humano respeitada:** `0003` e `0004` ficam, e foram auditadas como entrega, não
relitigadas. As duas seguram o que prometem — as travas do livro-razão recusaram reescrita de
`checksum`, remoção e a reabertura `applied_at → NULL`, e deixaram passar só a conclusão de migration
em voo.

---

## arquiteto-dados — 2026-09-11 (passo 8, correção do terceiro gate)

## RELATÓRIO — arquiteto-dados — T-0009
STATUS: OK
FEITO:
- **`SEC-01` fechado com as duas metades**, e a medida mostra que nenhuma das duas basta sozinha.
  §11.1 ganhou dois passos de leitura: recusa da aspa dupla (item 3) e comparação sobre cópia em
  minúscula (item 4). §11.3 passou a dizer que os padrões correm sobre a cópia normalizada, nunca
  sobre o texto cru. §11.5 ganhou a aspa dupla como forma proibida, com a tabela do que deixa de ser
  escrevível. §11.7 item 2 foi reescrito: a declaração anterior falava de comando que se *classifica*
  diferente, e os dois comandos medidos se classificavam certo.
- **`SEC-02` fechado.** A linha `gatilho` da impressão de estrutura (§13.3) passou a carregar
  `pg_trigger.tgenabled`, cru. `DISABLE TRIGGER` do dono agora produz uma linha divergente contra a
  referência; antes saía byte a byte idêntico. §18.2 corrigida: "três atos nomeáveis" não se
  sustentava, e agora dois dos três têm quem os acuse.
- **`SEC-03` fechado pela `0005`**, com o mesmo gatilho das outras três tabelas. A trava recusa
  `UPDATE` também, porque renomear o `code` desarma igual ao `DELETE` — medido.
- **`SEC-04` decidido por capturar.** A recusa do carregador vira o fato `load_refused` (`0006`,
  §19.4), escrito por conexão aberta **depois** da decisão e só para isso. §11 deixou de dizer
  "nenhuma conexão é aberta" como propriedade de segurança, que é o que ela nunca foi.
- **Piso de versão escrito: PostgreSQL 15**, não 14 — quem o fixa é `security_invoker`, obrigatório em
  toda view de migration, e não o `CREATE OR REPLACE TRIGGER`. `db/convencoes.md` §9, com a medida nas
  três versões.
- **O `REVOKE` de `papeis-e-credencial.md` §5 ganhou verificação** (§13.4): uma pergunta de catálogo no
  `verify`, com evento `privilege_unexpected` e sem mudar o código de saída. Das três camadas de
  `platform.tenants`, duas passaram a ser verificáveis por automação.
- **Referência estrutural regenerada** na mesma passada, de um banco do zero com `0000`..`0006`.
- Seis testes de aceite novos no `CONTRATO.md` §14 (19 a 24), um por correção.

ARQUIVOS:
- `db/migrations/platform/0005__event_kinds_immutability.sql` (novo)
- `db/migrations/platform/0006__event_kinds_refusal_and_privilege.sql` (novo)
- `db/referencia-estrutural-platform.txt` (regenerado — 63 linhas de impressão, era 62)
- `db/migrator/RECUSAS.md` (editado — §11, §11.1, §11.2, §11.3, §11.5, §11.7)
- `db/migrator/PROVISION-E-VERIFY.md` (editado — §13.3; §13.4 nasceu)
- `db/migrator/IMUTABILIDADE-E-FATOS.md` (editado — §18.1, §18.2, §18.4, §19.1, §19.3; §19.4 nasceu)
- `db/migrator/CONTRATO.md` (editado — §14, §17.3)
- `db/convencoes.md` (editado — §9 nasceu)
- `db/papeis-e-credencial.md` (editado — §5)
- `db/migrations/platform/0000`..`0004` (só leitura, não editados)

NÃO FEITO: —

DECISÕES:
1. **As duas metades do `SEC-01`, e a medida é o argumento.** Contra os quatro ataques: texto cru
   recusa 1; só normalização recusa 2; só recusa de aspa recusa 2; as duas recusam 4. A aspa de fecho
   entra entre o identificador e o ponto, onde normalização de caixa não ajuda; `T_GLOBEX` não tem
   aspa para recusar. O custo da recusa de aspa está na §11.5, e a perda real é uma só: colação citada
   (`COLLATE "C"`) dentro de view, índice ou `CHECK`. Ampliar a lista é mudança do contrato.
2. **A trava da `0005` recusa `UPDATE`, e não só `DELETE`.** Necessidade preservada: corrigir descrição
   errada. Mecanismos recusados: liberar `UPDATE`, que reabre o desarme por renomeação de `code`
   (medido); e gatilho seletivo comparando `OLD`/`NEW`, que custa uma segunda função no controle para
   proteger prosa. Mecanismo novo: recusa total, com a fonte normativa da descrição sendo §19.1.
   Prova: com a `0005`, os quatro caminhos de mutação morrem e o seed idempotente continua passando.
   Preço aceito: descrição errada fica errada até um código novo substituí-la.
3. **`SEC-04` capturado, não declarado.** O impedimento das outras ausências é técnico (a transação do
   gatilho morre e leva a escrita); aqui não havia impedimento nenhum — executor rodando, banco de pé,
   credencial existente. Ausência por escolha de desenho se corrige. O que continua não capturado está
   escrito: recusa na máquina de quem escreve, sem banco, antes do commit.
4. **`privilege_unexpected` não muda o código de saída.** Divergência de estrutura é `3` porque tem
   resposta única. O `REVOKE` não é aplicado por nada versionado, então em banco novo e em máquina de
   desenvolvimento com superusuário a resposta seria `3` em toda rodada — e controle que reprova sempre
   é dispensado, que é o `SEC-05`. Vira registro permanente em vez de veto; promover a `3` é uma linha
   no dia em que o `REVOKE` tiver casa mecanizada.
5. **O piso é 15, não 14.** O auditor apontou `CREATE OR REPLACE TRIGGER` (14+); medi as duas coisas e
   quem manda é `security_invoker` (15+). Em 14 o conjunto de hoje aplicaria inteiro e a primeira view
   de cliente é que quebraria — o pior lugar para descobrir um piso.
6. **Editei `IMUTABILIDADE-E-FATOS.md`, que não está na lista de arquivos do brief.** §18.2 e §19.1
   afirmam exatamente o que os três achados desmentem (os "atos nomeáveis", os "dez tipos"). Deixá-las
   como estavam produziria duas verdades sobre o mesmo mecanismo. Não é arquivo de código e não colide
   com o `coder`.
7. **Corrigi duas citações erradas na §11.1 e §11.2**, que mandavam para a §11.4 o cifrão sem rótulo e
   o `SECURITY DEFINER` — os dois moram na §11.5. É o bloco que eu estava reescrevendo, e a citação
   errada manda quem implementa para a seção errada.

RISCOS:
- **A detecção de gatilho desligado é periódica, não contínua.** Entre duas rodadas de `verify`, um
  gatilho desligado, usado e religado não deixa linha nenhuma. Está escrito na §18.2.
- **O `coder` está implementando o executor agora, e três coisas que ele transcreve mudaram**: a
  consulta da §13.3 (uma coluna), a leitura da §11.1 (dois passos) e a §13.4, que não existia.
  **Já aconteceu, e é verificável**: `db/migrator/src/structure-print.ts:48` carrega a linha `gatilho`
  antiga, sem `tgenabled`, então a impressão que o executor produz hoje diverge em 5 das 63 linhas de
  `db/referencia-estrutural-platform.txt` e o `verify` reprovaria um banco correto. Não toquei: é
  arquivo de código, do território dele. O crivo da §11 ele deixou não implementado, recusando tudo
  (`db/migrator/src/content-screen.ts:8-10`), que é o comportamento certo enquanto a §11 estava em
  correção — e agora ela não está mais.
- **O superusuário continua fora de tudo**, por `session_replication_role` e por carregar privilégio
  por construção. Declarado, não corrigido, e não corrigível daqui.
- **A mensagem do gatilho genérico fala de encerrar cliente** (`HINT` da `0002`), e agora ela aparece
  também ao recusar mutação no domínio de tipos de evento, onde a frase não se aplica. Cosmético,
  custaria uma segunda função, não vale.
- **O `REVOKE` continua sem casa mecanizada.** O que existe agora é a pergunta; quem desenhar a
  operação ainda precisa criar o ato que aplica o `REVOKE` junto dos `GRANT`.
- `SEC-05` (divergência em linha `funcao` não distingue reformatação de troca de corpo) **não foi
  tratado** — não estava no brief. Medi, de lado, que entre 15.19 e 16.15 a impressão inteira sai
  idêntica, o que estreita o caso de alarme falso sem eliminá-lo.

PERGUNTAS:
- para humano: promover `privilege_unexpected` a saída `3` quando o ato que cria o papel existir, ou
  manter como registro para sempre?
- para `seguranca`: a recusa da aspa dupla e a normalização fecham o `SEC-01` no texto do contrato; a
  prova de que fecham **no executor** só existe quando o carregador for escrito. Isso basta para o
  `MIG-10` fechar agora, ou ele fica aberto até o teste 19 rodar em código?

VERIFICAÇÃO: PostgreSQL 16.15 em contêiner descartável, papel `forja_exec` `NOSUPERUSER NOCREATEDB`,
dono do banco e do schema — a mesma credencial do gate, nunca superusuário. Também 15.19 e 14.24 para o
piso de versão. Rodei:
- **reprodução do `SEC-01`**: a view com `"t_globex".orders` devolveu a linha do outro cliente; o
  `ALTER TABLE` com aspas e o com `T_GLOBEX` maiúsculo acrescentaram coluna no schema do outro (as
  quatro colunas conferidas em `pg_attribute`); em `t_acme` nasceu só a view, que é o que a §10.4 veria.
- **regra nova contra os quatro ataques**: 4 recusas de 4. Cada metade sozinha: 2 de 4. Tabela medida
  em `RECUSAS.md` §11.1.
- **os sete arquivos de `db/migrations/platform/`** pela regra nova, com remoção de comentários,
  literais preservados e cópia minúscula: **nenhum recusado**. As aspas do `grep` cru estão todas em
  comentário. Alias (`SELECT o.total FROM orders o`) e `octet_length` continuam passando.
- **reprodução do `SEC-02`**: `DISABLE TRIGGER` + `DELETE` + `UPDATE` de slug, e a impressão antiga
  saiu idêntica byte a byte. Com a coluna `tgenabled`: **uma** linha divergente (`habilitacao:D`),
  religar devolve idêntica.
- **reprodução do `SEC-03`**: `DELETE` do código passou, e o `INSERT` do evento seguinte morreu na
  chave estrangeira; `UPDATE` do `code` desarma igual. Depois da `0005`: `DELETE`, `DELETE … WHERE
  false`, `UPDATE` de `code`, `UPDATE` de `description` e `TRUNCATE … CASCADE` todos recusados pelo
  gatilho, e o seed `ON CONFLICT DO NOTHING` continua passando.
- **`0000`..`0006` em banco do zero, duas vezes seguidas**, e uma terceira base com dado
  representativo (cliente, linha de ledger, evento): segunda rodada só `NOTICE` de guarda, nenhuma
  linha perdida, 12 tipos, 5 gatilhos.
- **teste de aceite 18**: a consulta extraída do documento editado, rodada num banco do zero,
  reproduz `db/referencia-estrutural-platform.txt` com `diff` vazio (63 linhas).
- **lock da `0005`**: `ShareRowExclusiveLock` em `platform.executor_event_kinds`, com `lock_timeout`
  na sessão. Tabela de 12 linhas, no schema de controle, fora do caminho do caixa.
- **§13.4**: papel do executor sem `REVOKE` devolve `f|t|t|t`; com `REVOKE`, `f|f|f|f`, e o `DELETE`
  leva `permission denied` mesmo com o gatilho desligado; superusuário devolve `t|t|t|t`. `REVOKE` e
  `GRANT` não mudam uma linha da impressão, como o contrato declara.
- **piso de versão**: 14.24 recusa `security_invoker` com `unrecognized parameter`; 15.19 e 16.15
  aceitam; `CREATE OR REPLACE TRIGGER` passa nas três. A impressão inteira sai idêntica em 15.19 e
  16.15, `md5` de função incluído.
- **Não rodei**: nada do executor, porque ele não existe; lock e tempo sobre volume real de cliente;
  a escrita de `load_refused`, que depende do carregador.

### As cinco perguntas de `dados.md` §6

1. **Outro ramo, outro fuso.** Nada do que entrou tem vocabulário de negócio: `0005` é gatilho, `0006`
   são dois códigos de detecção do executor. Nenhuma coluna nova, nenhum instante novo — os dois
   instantes de `executor_events` seguem `timestamptz` em UTC, e nenhum código de evento depende de
   calendário, turno ou fechamento.
2. **Que consulta fica cara, e que índice ela pede.** Nenhuma. O domínio tem 12 linhas com chave
   primária em `code`, e a única leitura quente dele é a verificação de chave estrangeira, que usa
   essa chave. O gatilho da `0005` é de comando e não lê linha. A pergunta da §13.4 é uma chamada de
   `has_table_privilege` por rodada de `verify`.
3. **Que coluna eu vou querer mudar em 6 meses.** `executor_event_kinds.description`, e agora ela é
   imutável — é o preço declarado da decisão 2. Está certa hoje porque a fonte normativa da descrição
   é `CONTRATO.md` §19.1, e nenhum programa decide nada lendo essa coluna. O segundo candidato é
   `detail` de `executor_events`, com teto de 2000 bytes: se o trecho recusado do `load_refused` for
   sistematicamente truncado, o teto sobe por expand.
4. **Isolamento.** As duas migrations são de alvo `platform` e não tocam schema de cliente nenhum. O
   `load_refused` não abre conexão de aplicação e não nomeia schema (a coluna fica nula). O que a
   tabela continua carregando é a carteira pelos nomes de schema das outras detecções, classificada em
   `papeis-e-credencial.md` §4 — inalterado. Nenhuma consulta nova cruza schema; o único leitor
   cross-schema segue sendo o `verify`, e ele lê catálogo.
5. **Cardinalidade em 2 anos.** `executor_event_kinds`: **10¹**, uma linha por detecção que existe, e
   cresce por migration. `executor_events`: **10² a 10⁴**, como declarado na §19.3, e `load_refused` é
   o único tipo que alguém repete de propósito — dez execuções com o mesmo arquivo recusado são dez
   linhas, e continuam dentro da faixa. Em 10⁶ (executor em laço, que já é outro defeito) entra o
   índice de tempo, por expand.

### O checklist de `migrations.md` §10, para a `0005` e a `0006`

1. **Forward-only? Etapa destrutiva?** Sim, forward-only. Nenhuma das duas remove, renomeia, trunca ou
   apaga: `0005` cria um gatilho, `0006` insere dois códigos. O ciclo expand/contract não se aplica.
2. **Roda duas vezes? Em schema vazio e com dado?** Medido nos três cenários: banco do zero, banco com
   dado representativo, e a fila inteira rodada duas vezes seguidas. Segunda rodada só emite `NOTICE`
   de guarda, e o seed da `0004` e da `0006` reaplicado não dispara o gatilho novo, porque
   `ON CONFLICT DO NOTHING` não é `UPDATE`.
3. **Que lock, por quanto tempo, no maior cliente?** `ShareRowExclusiveLock` em
   `platform.executor_event_kinds` (medido), e `RowExclusiveLock` no `INSERT` da `0006`. A tabela tem
   12 linhas, vive no schema de controle e nenhum caixa a lê. O maior cliente não muda isso: `platform`
   é um só. `lock_timeout` continua sendo obrigação do executor (`CONTRATO.md` §6), e a medida rodou
   com ele definido.
4. **Transacional? O que a retomada limpa?** As duas são `transacional: sim`. Nada a limpar: ou a
   transação aplica, ou não deixa rastro, e as duas formas são idempotentes por construção.
5. **Alvo é `platform` ou cliente, e só um?** `platform` nas duas, declarado no cabeçalho e conferido
   contra o diretório.
6. **Precisa de backfill?** Não. Nenhuma linha existente é tocada.
7. **Quem lê a estrutura antiga hoje?** Ninguém em produção — não há executor escrito nem cliente
   provisionado. Quem lê o **contrato** antigo é o `coder`, agora, em `db/migrator/**`: a consulta da
   §13.3, a leitura da §11.1 e a §13.4 mudaram, e é isso que ele precisa reler antes de continuar.

MEMÓRIA SUGERIDA:
- type=gotcha escopo=plataforma camada=dados slug=analise-de-texto-cai-por-grafia-nao-por-forma — o
  padrão que protege fronteira de schema tem que rodar sobre texto normalizado e sem identificador
  citado; foi a mesma classe de falha duas auditorias seguidas (`MIG-10`, `SEC-01`), e cada metade da
  correção sozinha deixa passar metade dos ataques (medido).
- type=gotcha escopo=plataforma camada=dados slug=impressao-de-estrutura-nao-ve-estado-de-habilitacao
  — `pg_get_triggerdef` não carrega `tgenabled`, então gatilho desligado sai idêntico na comparação;
  controle que pega o escape caro e perde o barato é controle invertido.
- type=decision escopo=plataforma camada=dados slug=dominio-fechado-tambem-e-append-only — tabela de
  lookup referenciada por chave estrangeira desarma a captura inteira por `DELETE` ou por renomeação
  de código; a trava vale para ela como para a tabela de fato.
- type=convention escopo=plataforma camada=dados slug=piso-de-versao-do-postgres-e-15 — quem fixa é
  `security_invoker` (obrigatório em view de migration), não `CREATE OR REPLACE TRIGGER`; medido em
  14.24, 15.19 e 16.15.

PRÓXIMO PASSO SUGERIDO: `coder` — atualizar `db/migrator/src/structure-print.ts` para a §13.3 com
`tgenabled` (é a linha 48), implementar o crivo da §11 agora que ela fechou, e a pergunta da §13.4; em
paralelo, `seguranca` — reauditar o delta (`SEC-01` a `SEC-04`) contra `db/**`, com
atenção a duas coisas que eu não consigo provar daqui: se a recusa da aspa dupla fecha a classe inteira
ou só as grafias que medimos, e se o `load_refused` por conexão aberta depois da decisão abre algum
caminho que o "nenhuma conexão" fechava.

## seguranca — 2026-09-11 (passo 8, gate 4 sobre o executor implementado)

## RELATÓRIO — seguranca — T-0009
STATUS: OK
FEITO:
- Auditei `db/migrator/src/**` e `db/migrator/test/**` inteiros, mais `platform/0005` e `0006` e a
  §11 reescrita (`RECUSAS.md`), contra PostgreSQL 16.15 em container descartável próprio (removido).
- Ataquei o crivo da §11 com 25 arquivos fabricados contra o `dist/` compilado do código real, e
  levei os que passaram para um banco de verdade, para separar "passa no crivo" de "faz estrago".
- Respondi as três perguntas do autor (§11.7 item 2 honesto? · o segundo `replace` da §13.3 esconde
  diferença? · ordem real do `provision`) e as cinco do brief.
- Relatório em `docs/auditorias/2026-09-11-executor-implementado.md`. Nenhuma das três auditorias
  anteriores foi editada.
ARQUIVOS: `docs/auditorias/2026-09-11-executor-implementado.md` (novo) · todo o resto, só leitura
NÃO FEITO: —
DECISÕES:
- Prefixo `EXE-` em vez de continuar em `SEC-`: `SEC-01`…`SEC-12` já nomeia achados de dois escopos
  na auditoria anterior, e reaproveitar produziria duas coisas com o mesmo nome.
- Não repeti typecheck nem a suíte: o autor os rodou e eu não os contesto. Não os herdo como
  evidência minha — o que está no relatório eu medi.
- O relatório tem 483 linhas, acima do teto de `00-nucleo.md` §8. Justificativa: dez achados, cada
  um com cenário reproduzível, mais a tabela de 16 provas. Cortar cenário é o que transforma achado
  em opinião, e as três antecessoras têm tamanho equivalente pelo mesmo motivo.
RISCOS:
- `EXE-01`, `EXE-02` e `EXE-03` são a §11 caindo pela **terceira** rodada, e desta vez não por
  grafia: por forma implementada em prefixo (`ALTER TABLE`), por semântica de comando (`SET LOCAL`)
  e por um número escrito à mão em dois arquivos (40 contra 41). Enquanto o mecanismo for "casa o
  começo + lista de palavras proibidas", a próxima rodada acha a próxima palavra.
- `EXE-04`: o `verify` é vendido como a resposta ao drift e aprova view reapontada para outro
  cliente, impressão idêntica byte a byte. É a mesma raiz do `SEC-02`, e o `SEC-02` foi corrigido
  acrescentando **um** atributo à impressão — corrigir de novo do mesmo jeito não fecha a classe.
- A separação de papéis de `db/papeis-e-credencial.md` continua verificada só por mim, na mão, em
  três datas. Isso é disciplina, que é exatamente o que aquele arquivo diz não bastar.
PERGUNTAS:
  - para arquiteto-dados: a §11.2 vai declarar o que cada forma **pode** conter depois do começo, ou
    seguimos remendando por palavra proibida a cada rodada? É a pergunta que decide se `EXE-01` e
    `EXE-02` são as últimas duas ou as próximas duas.
  - para humano: o slug encolhe de 41 para 40 caracteres antes do primeiro `provision` (correção de
    uma linha, e nenhum cliente existe ainda), ou o padrão da §11.3 é que cresce?
VERIFICAÇÃO: PostgreSQL 16.15 em container descartável, subido e removido por mim; crivo exercitado
contra `dist/` (conferido que nenhum `.ts` é mais novo que o build); 16 provas com resultado na §0 do
relatório. Não rodei a suíte nem o typecheck: o autor rodou, e repetir não acha nada novo.
MEMÓRIA SUGERIDA:
- type=gotcha escopo=plataforma camada=dados slug=lista-de-permissao-que-casa-so-o-comeco-da-acao —
  `ALTER TABLE` aceita ações separadas por vírgula, e o padrão que valida a primeira não lê as
  outras: `ADD COLUMN …, DROP COLUMN …` atravessou o crivo e removeu a coluna (medido). Forma
  permitida precisa declarar o que pode vir **depois** dela, não só como começa.
- type=gotcha escopo=plataforma camada=dados slug=search-path-trocado-dentro-do-corpo-da-funcao —
  a fronteira de schema por qualificador não alcança função que troca `search_path` em tempo de
  execução: corpo sem nenhum qualificador escreveu no schema de outro cliente a cada venda (medido).
  `SET LOCAL` e `SET SESSION` não casam o padrão que procura `set search_path`.
- type=gotcha escopo=plataforma camada=dados slug=dois-limites-de-tamanho-em-dois-arquivos — o slug
  aceita 41 caracteres e o padrão da fronteira de schema cobre 40; o cliente de nome comprido fica
  sem a defesa, e nenhum outro cliente dá sintoma. Limite que protege e limite que valida saem da
  mesma constante ou divergem em silêncio.
- type=gotcha escopo=plataforma camada=dados slug=impressao-de-estrutura-nao-carrega-corpo-de-view —
  a view entra na impressão por nome e `reloptions`; reapontar o corpo para outro cliente mantendo
  as colunas produz impressão idêntica byte a byte (medido). Função entra por `md5` da definição; a
  view era o único objeto cujo corpo ficou de fora.
- type=convention escopo=plataforma camada=seguranca slug=costura-de-teste-na-raiz-de-composicao —
  duplo permissivo do crivo entra por parâmetro opcional de `run()`, em `src/`; a trava de falha
  fechada pergunta se o crivo **existe**, nunca se é o certo. Costura de teste mora no teste.
PRÓXIMO PASSO SUGERIDO: `coder` — `EXE-01`, `EXE-02` e `EXE-03` em `src/refusals.ts` e
`src/target.ts`, e `EXE-04` em `src/structure-print.ts`, cada um com o caso de aceite novo que a §14
vai numerar; antes disso, `arquiteto-dados` — decidir a pergunta da §11.2 acima, porque ela muda se a
correção de `EXE-01`/`EXE-02` é pontual ou de mecanismo, e fechar `EXE-09` e `EXE-10`, que são texto.

## arquiteto-dados — 2026-09-11 (passo 8, correção do quarto gate)

## RELATÓRIO — arquiteto-dados — T-0009
STATUS: PARCIAL

RESPOSTA À PERGUNTA DO CRIVO (vem primeiro, como o brief pediu): **as duas, e o crivo estava no
lugar certo para metade do problema.**

- A §11.2 passa a declarar o que cada forma pode conter depois do começo, na forma mais forte que
  existe sem parser: **cabeça fechada, cauda fechada, interior declarado**. A forma diz onde o comando
  termina e o casamento é ancorado no fim; o que sobrar é recusa sem que a lista saiba o que era.
  `EXE-02` morre aí, e com ele `DISABLE TRIGGER`, `OWNER TO`, `DROP CONSTRAINT` e `SET search_path`
  como atributo de função — **sem estarem escritos em lugar nenhum**. Medido: o atributo de função
  grava no schema alheio com o corpo sem qualificador nenhum.
- Onde o crivo **não** está no lugar certo é o **corpo de função**, e é exatamente onde ele caiu na
  terceira rodada. Ali o texto deixa de ser SQL, gramática não alcança, e o que sobra é palavra
  proibida. A prova de que palavra proibida não fecha eu medi antes de alguém me pedir: com
  `SET LOCAL search_path` corrigido, `PERFORM set_config('search_path','t_vitima',true)` faz o mesmo
  vazamento, sem a palavra `SET`, sem `EXECUTE`, sem `format(` e sem ponto qualificador para a §11.3
  ver. É o quarto buraco da mesma classe em três rodadas, e ele está fechado neste documento antes de
  virar achado — o que não muda a conclusão: a quinta palavra existe e eu não sei o nome dela.
- **O privilégio fecha aquele interior, e o papel que decide não é o que o brief supôs.** A §11.5
  recusa `SECURITY DEFINER`, então a função roda com o papel de **quem a dispara**. No `EXE-01` quem
  dispara é o caixa, a cada venda, não o executor. Medido, PostgreSQL 16.15, 2026-09-11:

  | Prova | Arranjo | Desfecho |
  |---|---|---|
  | A | papel dono dos dois schemas insere na venda | linha gravada em `t_vitima.orders`. Vazamento |
  | B | papel de aplicação **por cliente**, sem `USAGE` no schema alheio | a venda **falha**, função nomeada no erro. Nada gravado dos dois lados |
  | C | papel de aplicação **único para todos** | vazamento, e a venda conclui com sucesso |
  | D | uma credencial só, `SET LOCAL ROLE <papel do cliente>` na transação | mesmo desfecho de B |
  | E | a mesma conexão sem assumir papel (`NOINHERIT`) | `permission denied for schema`. Falha fechado |

  O privilégio não impede o defeito: troca escrita silenciosa no schema alheio por venda recusada,
  barulhenta, no caixa. É a melhor falha disponível, e é fechada.
- **O que o privilégio não pega, e por isso o crivo não sai:** `DROP COLUMN` no schema do próprio
  cliente (o executor é dono; nenhum `GRANT` diz não — o `EXE-02` é literalmente isso),
  `DISABLE TRIGGER` em `platform.tenants`, forma, cabeçalho, idempotência, e **a hora da falha**: o
  crivo falha na leitura do arquivo, antes de conexão, nomeando arquivo e trecho, e barra o arquivo em
  todos os schemas; o privilégio falha na execução, num cliente por vez, com erro que não diz de que
  arquivo veio.
- **Ordem, e o que bloqueia o quê:** as correções do crivo bloqueiam o primeiro `provision`. A camada
  de privilégio **não** bloqueia o `provision` — nenhuma aplicação conecta durante ele — e bloqueia o
  primeiro cliente **em operação**. O pré-requisito dela é o ato de provisionamento, que continua sem
  artefato neste repositório (`papeis-e-credencial.md` §5).

FEITO:
- `RECUSAS.md` §11.2 reescrita: três regras (cabeça/cauda/interior) e tabela por forma com a coluna
  "onde o comando termina". Fecha `EXE-02`, `EXE-06`, `EXE-07` por classe.
- §11.5: o alvo passou a ser o **comando** `SET` (a palavra só é aceita em `set not null`,
  `set default`, `set null`), mais a recusa de `set_config(` em qualquer posição. Fecha `EXE-01` no
  que é fechável por texto.
- §11.3: o padrão do qualificador `t_` deixou de escrever comprimento (`t_[a-z0-9_]*`). Fecha a
  origem do `EXE-03`: dois números escritos à mão em dois arquivos.
- §11.1 item 2: rótulo de cifrão em qualquer caixa, com fecho comparado sem dobrar caixa (`EXE-08`).
  Item 6: classificação ancorada nas duas pontas.
- §11.7 reescrita: a declaração anterior estava invertida (nomeava como lacuna duas coisas cobertas e
  omitia as três abertas). O item 1 passa a dizer que o corpo de função não é fechável por texto e
  entrega o caso ao privilégio; o item 3 passa a descrever as duas camadas em vez de chamá-las
  independentes.
- `papeis-e-credencial.md` §6, nova: os dois instantes, as cinco provas, o invariante ("nenhum papel
  que atende requisição tem `USAGE` no schema de outro cliente"), as duas saídas que o satisfazem, o
  que o privilégio não pega, e a ordem.
- `db/migrations/platform/0007__tenant_slug_length.sql`, nova: teto do slug de 41 para 40, por
  restrição **nova** que compõe com a da `0001` (corrigir a antiga seria editar migration aplicada ou
  `DROP CONSTRAINT`, os dois proibidos).
- `APLICACAO-E-ALVO.md` §10.2: borda para `^[a-z][a-z0-9_]{1,39}$`, com o porquê dos dois lados.
- `PROVISION-E-VERIFY.md` §13.3: a linha `visao` passou a carregar `md5(pg_get_viewdef(...))`
  (`EXE-04`); o segundo `replace` do código foi reconciliado — ele sai, com o motivo escrito para não
  voltar (`EXE-10`). §12 e §13.1: a stream `platform` corre antes da recusa do `provision` (`EXE-09`).
- `CONTRATO.md` §14: casos 25 a 31, um por achado; casos 9 e 20 corrigidos.
- `db/referencia-estrutural-platform.txt` regenerado contra banco real com `0000..0007`.

ARQUIVOS:
- `db/migrations/platform/0007__tenant_slug_length.sql` (novo)
- `db/papeis-e-credencial.md` (editado — §6 nova)
- `db/migrator/RECUSAS.md` (editado — §11.1, §11.2, §11.3, §11.5, §11.7)
- `db/migrator/PROVISION-E-VERIFY.md` (editado — §12, §13.1, §13.3)
- `db/migrator/APLICACAO-E-ALVO.md` (editado — §10.2)
- `db/migrator/CONTRATO.md` (editado — §14)
- `db/referencia-estrutural-platform.txt` (regenerado)

NÃO FEITO:
- **Nada em `db/migrator/src/**` nem `test/**`** — território do `coder`, e o brief o excluiu. As sete
  correções de texto viram código lá.
- **Não rodei o crivo implementado contra a `0007`.** O `dist/` deste instante devolve
  "crivo não implementado" por `resolveContentScreen()`, porque o `coder` está no meio da correção.
  O que confirmei por leitura: a `0007` usa duas formas da lista (`ALTER TABLE <nome> <uma ação>` com
  `ADD CONSTRAINT`, e `COMMENT ON`), sem aspa dupla, sem `set` fora de comentário, sem qualificador de
  outro schema, `transacional: sim` como a §11.4 exige para `ADD CONSTRAINT`.
- **O arranjo de papel de aplicação não está decidido** — é do humano e do `backend` (§6.2). O que
  entreguei é o invariante e as duas saídas medidas.
- **O ato de provisionamento continua sem artefato.** É onde moram criação de papel, `GRANT` e o
  `REVOKE` da §5. Não o escrevi: ele não é migration (a §11.2 recusa `GRANT`/`REVOKE`) e o brief
  limitou meu território aos `.md`, a `db/migrations/**` e à referência.

DECISÕES:
- **Restrição nova em vez de corrigir a `0001`.** A antiga continua mandando no alfabeto, a nova no
  teto; uma linha que passe nas duas tem de 2 a 40 caracteres. `octet_length` e não `length`, porque o
  limite de identificador do Postgres é em bytes.
- **O padrão da §11.3 perdeu o número em vez de ganhar o número certo.** Dois números à mão divergem
  de novo; um padrão sem número não tem com o que divergir. Preço: falso positivo em identificador
  `t_algo.`, que nenhuma convenção nossa produz.
- **`CREATE SCHEMA` só cria `platform`**, e não "qualquer nome sem prefixo `t_`". O terceiro schema de
  controle, se existir, é mudança de contrato com revisão.
- **O segundo `replace` da impressão sai.** Ele nasceu para o carimbo maiúsculo do descartável, que
  deixou de existir; hoje é apagamento cego inalcançável dentro da consulta cujo trabalho é enxergar
  diferença. O gate confirmou que ele não abre buraco, então isto é dívida, não achado.
- **Não multipliquei o papel do executor por cliente.** Fecharia o instante de aplicação, e custa
  credencial por cliente para o processo que já lê a carteira inteira por construção. Registrado na
  §6.2 como ausência decidida, com o que a reverteria.

AS CINCO DE `dados.md` §6, sobre a `0007`:
1. **Outro ramo, outro fuso?** Sim. O slug é identidade de cliente, sem ramo e sem tempo; o teto é de
   bytes de identificador do Postgres, que não varia. Nenhuma coluna de instante é tocada.
2. **Que consulta fica cara, e que índice ela pede?** Nenhuma. O `CHECK` roda no `INSERT` que acontece
   uma vez por cliente. O `ADD CONSTRAINT` varre a tabela, que cresce uma linha por cliente.
3. **Coluna que vou querer mudar em 6 meses?** O `slug`, e a resposta continua não: mudá-lo é renomear
   um schema em uso. O nome pelo qual alguém reconhece o cliente não é esta coluna — é do
   estabelecimento, e mora no schema do cliente (`RN-NUC-050`). O teto de 40 só aperta um
   identificador, nunca um nome de exibição.
4. **Isolamento: existe caminho em que uma consulta veja dado de outro cliente?** Esta migration é a
   metade de banco do fechamento de um: com ela, não existe slug válido fora do alcance do padrão da
   §11.3. O caminho que continua aberto é o corpo de função, e a resposta dele é a §6 de
   `papeis-e-credencial.md`, não esta tabela.
5. **Cardinalidade em 2 anos?** `platform.tenants` em 10¹–10², uma linha por cliente. Nada muda de
   faixa: em 10³ a varredura do `ADD CONSTRAINT` continua instantânea, e a tabela nunca é lida no
   caminho do caixa.

CHECKLIST DE `migrations.md` §10, sobre a `0007`:
1. **Forward-only? Destrutiva?** Forward-only, e não destrutiva: é `ADD CONSTRAINT`. Nada é dropado,
   renomeado ou truncado; a restrição da `0001` fica intacta. Não estamos em etapa nenhuma do ciclo
   expand/contract.
2. **Roda duas vezes? Em schema vazio e com dado?** Medido, PostgreSQL 16.15: schema vazio aplica;
   segunda aplicação sobre o estado já aplicado falha com *"constraint already exists"*, e depois de
   transação revertida a tentativa seguinte aplica limpa. É a forma 3 da `CONTRATO.md` §17.2, cuja
   idempotência vem da transação, e por isso o cabeçalho é `transacional: sim`. Com dado: a tabela
   está vazia em todo ambiente (não existe cliente). Se existisse linha de 41 caracteres, a migration
   falharia e pararia a rodada, que é o desfecho certo e está escrito no topo do arquivo.
3. **Que lock, por quanto tempo, no maior cliente?** `ACCESS EXCLUSIVE` em `platform.tenants` pelo
   tempo de varrer a tabela. Não medido em volume, porque não existe volume: a tabela é uma linha por
   cliente e nenhum caixa a lê. `lock_timeout` é do executor (`CONTRATO.md` §6).
4. **Transacional? O que a retomada limpa?** Transacional. A retomada não limpa nada: a transação
   revertida não deixa restrição para trás.
5. **Alvo `platform` ou cliente?** `platform`, e só ele. Declarado no cabeçalho e conferido contra o
   diretório.
6. **Backfill?** Não. Nenhuma linha é lida ou escrita.
7. **Quem lê a estrutura antiga hoje?** A borda que valida o slug (`db/migrator/src/target.ts`, do
   `coder`, que muda para `{1,39}` no mesmo passo) e o padrão da §11.3, que deixa de olhar comprimento.
   Nenhum código de produto lê `platform.tenants`: `apps/` não existe.

RISCOS:
- **A §11.2 é spec; o crivo é código.** Enquanto o `coder` não implementar a âncora de fim, o texto
  promete uma propriedade que o binário não tem — que é exatamente o defeito que o `EXE-02` mediu, com
  a frase "uma ação por comando" escrita desde a primeira versão. O gate 5 precisa medir a âncora, não
  lê-la.
- **A gramática fechada vai produzir falso positivo** na primeira migration que use uma cláusula
  legítima que a tabela não previu (`INCLUDE` de índice, `WHERE` de índice parcial, `COLLATE`). O
  desfecho é recusa com mensagem, o autor vem ao contrato, e a lista cresce sob revisão. É a política
  da §11.1, e só vira defeito se alguém "resolver" afrouxando a forma em vez de ampliar a lista.
- **O invariante da §6.2 não tem verificação mecanizada** enquanto o ato de provisionamento não
  existir, exatamente como o `REVOKE` da §5 não tinha até o terceiro gate. `verify` hoje pergunta pelo
  papel **corrente**, não pela separação.
- **`db/migrator/src/target.ts` e `0007` precisam entrar no mesmo passo.** Se a borda encolher e a
  migration não for aplicada, o `CHECK` continua aceitando 41 e a divergência fica invisível; se a
  migration for aplicada e a borda não encolher, o `provision` de um slug de 41 falha no banco em vez
  de falhar na borda, com mensagem pior. Nenhuma das duas ordens é errada; as duas metades soltas são.

PERGUNTAS:
  - para humano: o papel de aplicação é **um por cliente com `LOGIN`** (N credenciais, fronteira na
    credencial) ou **uma credencial `NOINHERIT` assumindo um papel sem `LOGIN` por cliente com
    `SET LOCAL ROLE` por transação** (um segredo, N papéis)? As duas satisfazem o invariante da §6.2 e
    foram medidas; a escolha é de operação, e trava o ato de provisionamento.
  - para humano: o ato de provisionamento (criação de papel, `GRANT`, `REVOKE`) vira artefato de qual
    território? Não é migration, e `db/` hoje só tem migrations e documento.

VERIFICAÇÃO:
- PostgreSQL **16.15** em container descartável, removido ao fim; nada escrito na árvore fora dos
  arquivos listados. Sondas em `/tmp`.
- **Vazamento por `set_config`:** reproduzido. Gatilho com `PERFORM set_config('search_path',
  't_vitima', true)` gravou a linha no schema de outro cliente, sem palavra da lista de proibições.
- **Cinco arranjos de papel (A–E):** medidos, tabela acima.
- **`SET` como atributo de função:** medido, grava no schema alheio.
- **`0007`:** aplicada do zero sobre `0000..0006`; segunda aplicação recusada com
  *"constraint already exists"*; aplicação limpa depois de transação revertida; slug de 40 aceito, de
  41 recusado nomeando `tenants_slug_length_check`.
- **Referência estrutural:** banco novo, `0000..0007` aplicadas, impressão da §13.3 **com a linha
  `visao` nova** tirada e comparada com o arquivo. Diferença: **uma linha**, a da restrição nova.
  O arquivo no repositório confere byte a byte com a impressão gerada.
- **Linha `visao`:** DDL igual em dois schemas de nomes diferentes produz o mesmo `md5` com e sem o
  schema no `search_path`; view reapontada para outro schema produz `md5` diferente. `EXE-04` fecha.
- **Os oito arquivos de `db/migrations/platform/`:** nenhum contém aspa dupla, `set` ou `set_config`
  fora de comentário. Conferido por busca, 2026-09-11.
- **Não rodei** o crivo implementado (indisponível no `dist/` deste instante) nem a suíte do `coder`.
- **Não rodei** `verify` fim a fim: ele depende do executor, que está em correção.

MEMÓRIA SUGERIDA:
  - type=gotcha escopo=plataforma camada=dados slug=crivo-textual-nao-fecha-corpo-de-funcao —
    dentro de um corpo plpgsql o texto deixa de ser SQL: gramática não alcança e palavra proibida é
    incompleta por construção (`SET LOCAL search_path` → `set_config(` → a próxima); quem fecha é o
    privilégio do papel que **dispara** a função, que é o da aplicação, não o do executor.
  - type=decision escopo=plataforma camada=seguranca slug=isolamento-tem-duas-camadas-e-elas-falham-em-horas-diferentes —
    crivo falha cedo (leitura do arquivo, defeito nomeado, barra em todos os schemas) e privilégio
    falha tarde (execução, um cliente por vez, sem dizer de que arquivo veio); trocar uma pela outra
    troca um defeito por outro.
  - type=convention escopo=plataforma camada=dados slug=fronteira-de-isolamento-nao-escreve-numero —
    limite escrito à mão em dois arquivos diverge (40 contra 41, medido, sem sintoma); ou o padrão
    deriva da constante, ou ele para de ter número e o número sobra num lugar só.

PRÓXIMO PASSO SUGERIDO: `coder` — implementar a âncora de fim da §11.2 (cabeça/cauda/interior), o
comando `SET` e `set_config(` da §11.5, o padrão sem comprimento da §11.3, o rótulo de cifrão em
qualquer caixa da §11.1 item 2, `{1,39}` em `target.ts`, a linha `visao` e a retirada do segundo
`replace` em `structure-print.ts`, e os casos 25 a 31 da §14. Depois, `seguranca` — gate 5, medindo a
âncora em vez de lê-la. Em paralelo, **humano** — as duas perguntas acima, que destravam o ato de
provisionamento.

## arquiteto-dados — 2026-09-11 (passo 8, reconciliação do piso 16 e recusa de borda)

## RELATÓRIO — arquiteto-dados — T-0009
STATUS: OK
FEITO:
- Reconciliei o piso 16 em **cinco** lugares, não três: os três do brief (`db/convencoes.md` §9 corpo,
  `db/papel-do-cliente.md` §7.6, `db/papeis-e-credencial.md` §3) e mais dois que também contradiziam a
  implementação — `db/migrator/APLICACAO-E-ALVO.md` §6, que ainda mandava recusar abaixo de `150000`,
  e `db/migrator/CONTRATO.md` §17.3. Ajustei também `db/migrator/RECUSAS.md` §11.2, que dizia ser
  quem fixa o piso.
- Escrevi em cada um que **o sujeito do piso trocou**: a view com `security_invoker` exige 15 e deixou
  de mandar; quem manda é o `CREATEROLE` do executor, que exige 16. `convencoes.md` §9 diz explicitamente
  que a tabela de versões responde a pergunta de ontem, para ninguém baixar o piso lendo só ela.
- `IMUTABILIDADE-E-FATOS.md` §19.1: doze → **catorze**, com `tenant_role_missing` e
  `tenant_role_divergent` na tabela e a procedência (`0008`) escrita.
- `papel-do-cliente.md` §7.1: chave fixada em `FORJA_MIGRATOR_APP_CREDENTIAL_ROLE`, com a nota de que
  ela leva nome de papel e nunca senha, e de que a linha do `.env.example` é preenchida fora deste
  processo. A reserva do prefixo `app_` passou a valer também sobre `current_user`.
- `papel-do-cliente.md` **§7.7 (nova)**: a recusa de borda, saída `2`, nomeando o ato da §7.2 — quatro
  precondições (chave de ambiente, prefixo reservado nos dois nomes, grupo `forja_app`, credencial
  existente e membro do grupo), em `provision`, `migrate`, `migrate --schema` e `verify`.
- `papel-do-cliente.md` §7.3: `FOR ROLE CURRENT_USER` adotado, risco reescrito, e nota de que papel é
  objeto de **cluster**. §7.4: excesso de privilégio virou linha própria, divergente, com o motivo.
ARQUIVOS:
- db/convencoes.md (editado) · db/papeis-e-credencial.md (editado) · db/papel-do-cliente.md (editado)
- db/migrator/APLICACAO-E-ALVO.md, CONTRATO.md, IMUTABILIDADE-E-FATOS.md, PROVISION-E-VERIFY.md,
  RECUSAS.md (editados)
NÃO FEITO: —
DECISÕES:
1. **A recusa de borda cobre quatro precondições, não só o grupo.** Credencial inexistente produz o
   mesmo defeito do grupo ausente, na mesma linha do mesmo passo; conferir uma e deixar a outra
   reproduz o achado com outro nome. Custa a mesma consulta.
2. **`verify` também recusa, em vez de reprovar.** Sem o grupo, `to_regrole` devolve nulo, `no_grupo`
   sai falso em toda linha e o comando acusa `tenant_role_divergent` em **todos** os clientes: N
   diagnósticos falsos e o verdadeiro em lugar nenhum.
3. **Saída `2`, não `3`.** `3` é divergência em algo versionado que um comando corrige; aqui falta um
   ato do operador, que nenhuma migration executa. Mesma classe de "configuração ausente".
4. **O executor não cria o grupo para se destravar.** Criaria grupo vazio, com o `REVOKE` do `public`
   por fazer e a operação achando que a §7.2 rodou — some o sintoma sem fazer o trabalho.
5. **Excesso de privilégio é divergente: o `coder` está certo.** O ato só concede; retirar é `REVOKE`,
   que não está nele e não pode estar em migration (`RECUSAS.md` §11.2). Tratar excesso como "faltando"
   faria o `migrate` conceder o que sobra, declarar convergência e sair `0` com o alcance de pé.
6. **`FOR ROLE CURRENT_USER` mitiga metade do risco, e a declaração foi reescrita nessa medida.** Ele
   elimina o terceiro identificador e torna o desencontro **visível** (`default_acl_presente = f` →
   `tenant_role_divergent` → saída `3`). Não elimina a janela entre trocar o papel do executor e a
   primeira rodada de `migrate`/`verify`: nela, tabela nova nasce invisível e nada acusou ainda.
RISCOS:
- `db/migrator/PROVISION-E-VERIFY.md` ficou em **exatamente 400 linhas**. Coube porque comprimi um
  parágrafo do §13.1 que repetia a §7.4 de `papel-do-cliente.md`. A próxima edição não cabe: a partição
  natural é a §13.3 (impressão de estrutura), autocontida.
- `db/migrator/RECUSAS.md` segue em 415, sem crescer nesta passada (a edição foi neutra em linhas).
- **Papel é objeto de cluster**: dois bancos no mesmo cluster compartilham `app_t_<slug>`, e quem mexe
  nos atributos dele por um mexe no outro. Escrito na §7.3.
- `seguranca` está auditando esta camada agora: mudei `papel-do-cliente.md` §7.1, §7.3, §7.4, §7.6 e
  acrescentei a §7.7; `PROVISION-E-VERIFY.md` §12, §13.1 e §13.5. **A consulta da §7.5 não mudou.**
PERGUNTAS: —
VERIFICAÇÃO: não rodei teste — nenhuma linha de código foi tocada. Conferi por `grep` que não sobrou
afirmação de piso 15 em `db/**` e que o nome da chave e o piso batem com o implementado
(`src/config.ts:93`, `src/session.ts:54-79`, `src/tenant-role.ts:23-46`). Contagem de linha por `wc -l`.
MEMÓRIA SUGERIDA:
- type=convention escopo=plataforma camada=dados slug=precondicao-de-ato-humano-se-confere-na-borda —
  o que outro ato humano deixou pronto se confere antes da primeira escrita e recusa nomeando **o ato**,
  nunca o objeto que o servidor não achou; terceira vez nesta ficha (piso, `lock_timeout`, grupo).
- type=gotcha escopo=plataforma camada=dados slug=papel-e-objeto-de-cluster-nao-de-banco — dois bancos
  no mesmo cluster dividem `app_t_<slug>`; o sintoma foi a suíte deixar de rodar em paralelo.
PRÓXIMO PASSO SUGERIDO: `coder` — implementar a §7.7 (recusa de borda, saída `2`, as quatro
precondições, nos quatro comandos), e nada além dela.

## seguranca — 2026-09-11 (gate final da camada de papel)

## RELATÓRIO — seguranca — T-0009
STATUS: OK
FEITO:
- Medi as correções de `PAP-01`…`PAP-12` contra Postgres 16.15 em container descartável próprio,
  criado e removido na sessão. Quinze sondas, todas contra o artefato de produção (o `dist/` que a
  própria suíte compila), nunca contra réplica.
- Rodei as duas suítes: `db/migrator` deu `83 tests · 82 pass · 0 fail · 1 skipped`, saída `0`;
  `apps/api` deu `39 · 39 · 0`, saída `0`. Confere com o que o humano verificou.
- Confirmei fechados e medidos: `PAP-04`, `PAP-05`, `PAP-06`, `PAP-07`, `PAP-08`, `PAP-09`,
  `PAP-10`, `PAP-11`, `PAP-12` e `SEC-12`.
- Abri seis achados: três `ALTO`, um `MÉDIO`, dois `BAIXO`. Dois são **reincidentes** (`PAP-13` de
  `PAP-01`, `PAP-14` em classe de `PAP-02`/`PAP-03`) e um é extensão de `PAP-02`/`PAP-12`.
ARQUIVOS: docs/auditorias/2026-09-11-gate-final-camada-de-papel.md (novo) · todo o resto só leitura
NÃO FEITO: —
DECISÕES:
1. **Continuei o prefixo `PAP-` em vez de abrir um novo.** Mesmo escopo e mesma camada; prefixo novo
   por rodada nova quebra o rastro de reincidência, que é o único número que diz algo sobre o processo.
2. **A recusa de borda merece evento, e decidi pelo sim sem perguntar.** O precedente interno é
   `load_refused` (§19.4), que abre conexão só para registrar recusa já decidida. Dois limites: só
   quando `platform.executor_events` existe, e falhar ao escrever não muda a saída `2`. Não é bloqueio
   de fechamento; é migration de domínio, dono `arquiteto-dados`.
3. **Aceitei o executor superusuário no teste da §7.7.** A asserção que importa lá é negativa, e com
   superusuário todo `GRANT` impedido funcionaria, então a ausência prova o momento da recusa. Somei o
   que fecha a dúvida: a consulta de precondição só lê catálogo público, então não há caminho para ela
   se comportar diferente com executor não-superusuário.
4. **Não elevei a `CRÍTICO` nenhum dos três `ALTO`.** Os três exigem um ato humano fora do processo
   (uma concessão à mão, ou o §7.2 pela metade), e em dois deles a detecção existe e funciona. `CRÍTICO`
   aqui gastaria a palavra que o próximo achado de verdade vai precisar.
RISCOS:
- `PAP-13` deixa `migrate` saindo `0` sobre um estado em que a credencial alcança o schema sem assumir
  papel. Detectado (`verify` fica em `3`), não corrigido, e a correção manual óbvia piora o estado.
- `PAP-14` é uma palavra de diferença entre `verify` saindo `3` com o intruso nomeado e saindo `0` em
  silêncio, com o mesmo alcance ao dado.
- `PAP-17` é fora do escopo do fechamento e atrapalha conferi-lo: contra servidor com senha, a suíte
  que prova esta camada não roda e ainda imprime `# fail 0`.
- Fora de escopo: `src/executor.ts:33-35` afirma que o crivo hoje devolve `undefined` e recusa toda
  rodada. Ele devolve o crivo real desde a implementação da §11.
PERGUNTAS:
  - para humano: na janela de rotação de credencial (`PAP-16`), quem manda, a §7.7 (duas credenciais
    válidas) ou a §7.5.1 (uma só, a do ambiente)? Uma frase decide, e ela é de quem opera.
VERIFICAÇÃO: as duas suítes rodadas, com os números acima. Quinze sondas contra 16.15, cada uma com o
arranjo da §7.2/§7.3 reconstruído do zero; a tabela de resultado está na §0 do relatório. Container
removido ao fim, conferido. Nada escrito na árvore fora do relatório e desta seção.
MEMÓRIA SUGERIDA:
- type=gotcha escopo=plataforma camada=dados slug=heranca-de-concessao-e-por-concedente — `pg_auth_members`
  tem uma linha por `(roleid, member, grantor)`, então reemitir `GRANT … WITH INHERIT FALSE` só corrige
  a linha do próprio concedente; o `REVOKE` sem `GRANTED BY` apaga a legítima e deixa a herdável.
- type=convention escopo=plataforma camada=seguranca slug=discriminador-carrega-a-populacao-que-o-justificou —
  predicado levantado de uma pergunta para outra (`NOT admin_option`) leva junto a população em que ele
  era exato; na população nova ele exclui quem ninguém quis excluir.
- type=convention escopo=processo camada=processo slug=teste-de-conserto-ataca-o-conserto-nao-o-achado —
  caso montado a partir da lista do achado prova o achado; o que fecha a classe é o caso que pergunta
  quem mais cabe na condição nova, e reproduzido pelo **ator escrito no cenário**.
PRÓXIMO PASSO SUGERIDO: `arquiteto-dados` — `PAP-14` e `PAP-15` primeiro (duas consultas, o maior
retorno por linha), depois `PAP-13` (decidir entre recusar ou revogar por concedente) e `PAP-16` (uma
frase alinhando §7.7 e §7.5.1).

---

## seguranca — 2026-09-12 (reauditoria do gate final)

## RELATÓRIO — seguranca — T-0009
STATUS: BLOQUEIO
FEITO:
- Reauditei só o delta de `db/**` posterior a `docs/auditorias/2026-09-11-gate-final-camada-de-papel.md`,
  com PostgreSQL 16.15 em dois containers descartáveis meus (`trust` na 55442, `scram-sha-256` na
  55443), criados e removidos ao fim. Não usei o Postgres do ambiente do humano.
- Confirmei as duas contagens do autor, medidas por mim contra o `dist/` que a suíte compila:
  `trust` → `88 tests · 87 pass · 0 fail · 0 cancelled · 1 skipped`, saída `0`;
  `scram-sha-256` → `88 tests · 75 pass · 0 fail · 0 cancelled · 13 skipped`, saída `0`.
- Montei o arranjo vivo do zero com o binário real (`node dist/src/main.js`), executor
  **não-superusuário**, dois clientes, dados, e rodei 13 sondas (`R1`…`R13`, tabela na §0 da
  auditoria).
- Medi `PAP-13`, `PAP-15`, `PAP-16`, `PAP-17` e `PAP-18` fechados **no caso listado**, e cinco
  achados novos: `PAP-19`…`PAP-23`. Três são regressões — estados que o código anterior a esta
  rodada acusava com `3` e que o código desta rodada aprova com `0`.
- Julguei os quatro casos 40–43: **um** ataca o conserto (o 43); os outros três atacam o achado ou
  testam falso positivo em vez de falso negativo.
ARQUIVOS:
- `docs/auditorias/2026-09-12-reauditoria-camada-de-papel.md` (novo)
- `db/migrator/src/{tenant-reach,tenant-role,run}.ts`, `src/commands/verify.ts`,
  `db/migrations/platform/0010__event_kinds_grantor_and_universe.sql`,
  `db/migrator/test/alcance-e-concedente.test.ts`, `test/support/postgres.ts`,
  `db/papel-do-cliente.md`, `db/verificacao-do-papel.md`, `db/migrator/CONTRATO.md` (só leitura)
NÃO FEITO: —
DECISÕES:
- Mantive severidade `ALTO` nos quatro vazamentos, e não `CRÍTICO`, para ficar calibrado com o gate
  anterior, que classificou `PAP-13`/`PAP-14`/`PAP-15` como `ALTO` tendo o mesmo efeito. O ator é
  sempre operador ou executor, e o defeito é o **controle não ver**, não um cliente alcançar o outro
  pela borda.
- Separei `PAP-19` e `PAP-20`, que são dois braços do mesmo predicado, porque o controle
  compensatório existe num e não no outro, e a correção mínima de cada um é diferente.
RISCOS:
- `PAP-23` não segura o fechamento sozinho, mas segura a **conferência** dos outros: enquanto
  `npm test` puder sair `0` com os 12 testes da camada de papel pulados, correção desta camada pode
  ser dada por provada sem ter rodado. Qualquer gate futuro tem que declarar contra que servidor
  rodou.
- A política de veto do `verify` está codificada no ponto de chamada de cada pergunta
  (`src/commands/verify.ts:56-68`), sem um lugar único que a declare. Nas quatro sondas de vazamento
  o comando **imprimiu linhas** e saiu `0`.
PERGUNTAS:
  - para `arquiteto-dados`: a exclusão da §7.5.1 pode passar a nunca excluir linha com
    `inherit_option` verdadeiro? Medido (`R1`): num arranjo saudável toda membership de `app_t_*`
    tem `inherit_option = f`, então o predicado não produz falso positivo e fecha `PAP-19`, `PAP-20`
    e o caso original do `PAP-14`.
  - para `arquiteto-dados`: a §7.5.3 passa a afirmar **quem é dono** de `platform` e de cada `t_*`?
    É a única pergunta que fecha o `PAP-22`, e é do mesmo tamanho da afirmação de universo que já
    está lá.
  - para humano: a exclusão por `pg_depend deptype = 'e'` da §7.5.3 fica, com a premissa corrigida
    (só extensão de dono superusuário), ou sai? Medido: extensão confiável é criável por
    não-superusuário desde o PostgreSQL 13, e `ALTER EXTENSION … ADD` devolve a `public` a
    invisibilidade que a §7.5.3 acabou de tirar.
VERIFICAÇÃO:
- Suíte inteira rodada por mim nos dois servidores, números acima, saída `0` nos dois.
- 13 sondas contra o arranjo vivo, com o binário real; cada uma com resultado na tabela da §0 da
  auditoria. Nenhum número deste relatório é estimativa.
- Containers `forja-audit-pap7` e `forja-audit-pap7-scram` removidos ao fim (conferido).
MEMÓRIA SUGERIDA:
  - type=gotcha escopo=plataforma camada=dados slug=exclusao-se-prova-pelo-que-ela-deixa-passar —
    controle que exclui um conjunto se testa com o excluído em estado **hostil**; testá-lo em estado
    legítimo verifica exatamente o desfecho que o defeito produz (três regressões medidas em
    2026-09-12).
  - type=gotcha escopo=plataforma camada=dados slug=deptype-e-nao-e-procedencia — "veio de extensão"
    é atributo mutável por quem ataca (`ALTER EXTENSION … ADD`, e extensão confiável é criável por
    não-superusuário desde o PostgreSQL 13), não procedência; não serve de exclusão em controle.
  - type=gotcha escopo=plataforma camada=dados slug=dono-do-schema-e-alcance-que-ninguem-afirma —
    o dono de um schema tem `USAGE` por posse e é excluído da pergunta de alcance;
    `ALTER SCHEMA … OWNER TO` move a exclusão sem que nada acuse, e também abre `DROP SCHEMA CASCADE`.
PRÓXIMO PASSO SUGERIDO: `arquiteto-dados` — `PAP-19` e `PAP-20` primeiro (um predicado fecha os dois,
com caso de teste do excluído em estado hostil), depois `PAP-22` (uma consulta) e `PAP-21` (uma
decisão antes da consulta). `PAP-23` é de `coder`, e vem antes da conferência dos três.

## seguranca — 2026-09-12 (gate da declaração)

## RELATÓRIO — seguranca — T-0009
STATUS: BLOQUEIO
FEITO:
- Reproduzi as quatro sondas do gate anterior contra o código novo: `PAP-19`, `PAP-20`, `PAP-21` e
  `PAP-22` saem `3` e desfazer o estado devolve `0`. **Zero falso positivo** nas sete sondas em que
  desfiz o estado.
- Enumerei **todas** as exclusões do caminho de decisão (§7.5.1, §7.5.3, §7.5.4, §7.4, §7.7) e
  classifiquei cada uma: nenhuma remanescente é propriedade que o beneficiário emite. A troca de
  mecanismo fechou o eixo que ela atacava.
- Medi que a fronteira herdada é outra: a §7.5.1 enumera só o membro **direto** de `app_t_<slug>`, e
  o conjunto excluído virou uma lista de nomes cuja lista de membros ninguém pergunta.
- Rodei as duas suítes e confirmei as duas contagens do autor. `PAP-23` fechado.
- Mutação no `dist` sem recompilar, seis mutantes: três mortos por caso (45, 47, 43), três vivos.
ARQUIVOS: `docs/auditorias/2026-09-12-gate-da-declaracao-camada-de-papel.md` (novo); todo o resto só
leitura. `db/migrator/dist/**` foi mutado durante a medição e **restaurado**, conferido byte a byte.
NÃO FEITO: —
DECISÕES:
- Três containers descartáveis em vez de dois: papel é objeto de cluster, e a primeira rodada da
  suíte no mesmo servidor das sondas deu `# pass 61 · # fail 6 · # cancelled 28` por colisão de
  `app_t_acme`. O número que vale é o do servidor limpo.
- `PAP-24` como `ALTO` e não `CRÍTICO`: o ator é o operador, que já lê tudo. O que faz dele achado é
  o resultado — credencial de login separada, permanente, usável por quem nunca teve a senha da
  aplicação, e nenhum comando a nomeia. Mesma régua do `PAP-19`, que tem a mesma mão.
- `PAP-25` como `MÉDIO` e não `ALTO`: a linha fica visível em toda rodada seguinte e o `INSERT` deixa
  `declared_by`. O que impede de ser `BAIXO` é que ela não veta, não nomeia o beneficiário e não há
  como retirá-la.
RISCOS:
- `S5`, e é notícia boa que vira risco: em 16, `CREATEROLE` não administra papel que não criou, e é
  só isso que impede o executor de emitir `GRANT forja_credencial TO <alguém>`. Se alguém der `ADMIN
  OPTION` sobre a credencial ao executor "para facilitar a rotação", o `PAP-24` passa a ser
  alcançável por ele. Vale uma linha na §7.2.
- A tabela de declaração é append-only para **todos**, superusuário inclusive (medido). Declaração
  errada plantada hoje só sai com o gatilho desligado à mão. Isso é desenho, e o desenho precisa
  dizer qual é o procedimento.
VERIFICAÇÃO:
- `db/migrator`, `trust` (`postgres:16`, 16.15, container meu, porta 55452):
  `# tests 96 · # pass 95 · # fail 0 · # cancelled 0 · # skipped 1`, saída `0`.
- `db/migrator`, `scram-sha-256` (porta 55453): `# tests 96 · # pass 78 · # fail 1 · # cancelled 0 ·
  # skipped 17`, saída `1`. A falha é `o piso de medição da suíte`. Confere com o autor nos dois.
- `npx tsc --noEmit`: passa.
- Arranjo vivo (porta 55454) montado com `node dist/src/main.js`: 15 sondas, todas na §0 do relatório.
- Seis mutações no `dist`: `M1` (propriedade volta a desculpar) morta pelo caso 45; `M2` (§7.5.3 sem
  o braço de referência) morta pelo caso 47; `M6` (credencial declarada excluída fora do grupo) morta
  pelo caso 43. `M3` e `M5` (`atributo_indevido`, `create_indevido`, `usage_em_platform`,
  `heranca_de_outra_credencial`) **vivas**, com a suíte em `95 pass · 0 fail`, saída `0`.
- Containers removidos ao fim. O Postgres do humano (5432) não foi tocado.
MEMÓRIA SUGERIDA:
  - type=gotcha escopo=plataforma camada=dados slug=exclusao-por-nome-nao-fecha-o-grafo-de-membros —
    trocar exclusão por propriedade por exclusão por nome registrado fecha a classe de quem se
    desculpa sozinho e **não** fecha a de quem é membro do nome excluído: a pergunta precisa do fecho
    transitivo, não do primeiro nível.
  - type=gotcha escopo=plataforma camada=dados slug=createrole-16-so-administra-o-que-criou — em
    PostgreSQL 16, `CREATEROLE` não concede membership em papel que ele não criou (medido: `permission
    denied to grant role`). É essa mudança da 16 que contém o executor; dar `ADMIN OPTION` sobre a
    credencial a ele desfaz a contenção.
  - type=convention escopo=processo camada=processo slug=predicado-sem-teste-morre-em-mutacao — o
    jeito barato de saber se um controle tem prova é silenciá-lo no artefato compilado e rodar a
    suíte sem recompilar. Aqui, três mutantes morreram e três sobreviveram com a suíte verde.
PRÓXIMO PASSO SUGERIDO: `arquiteto-dados` — `PAP-24` primeiro (uma consulta: fecho transitivo, ou
afirmação dos membros de cada papel declarado, cujo conjunto esperado é vazio), com caso de teste do
**excluído legítimo** em estado hostil; depois `PAP-25` (condição de permanência para `executor` e a
afirmação de que toda declaração tem `app_role_declared`) e `PAP-27` (uma frase). `PAP-26` é de
`coder`, e vem antes da conferência dos outros.

## arquiteto-dados — 2026-09-12 (retomada: PAP-24…PAP-27 medidos)

## RELATÓRIO — arquiteto-dados — T-0009

**STATUS: OK**

### FEITO

**Inventário primeiro.** Os quatro achados já estavam corrigidos em disco, com código e texto completos. O que faltava era exatamente o que o brief diz: **medição**, mais um caso de aceite declarado no contrato e nunca escrito.

**Os quatro achados, medidos contra o código em disco, em container próprio (PostgreSQL 16.15, portas 55472–55475 e 55482/55484, todos removidos ao fim; os órfãos `forja-t9-*` da rodada morta não foram tocados, nem o `devstack-pg` do humano na 5432):**

| Achado | Estado antes (auditoria) | Medido hoje |
|---|---|---|
| `PAP-24` | `verify` `0`, `migrate` `0`, zero linha | **fechado.** `verify` sai `3` nomeando `ops_leitura`, o papel declarado e o **concedente**; `migrate` e `migrate --schema` saem `3` **antes de conceder**; desfeito o `GRANT`, `0`. As duas metades (credencial e executor) |
| `PAP-25` | `verify` `0`, sem `app_role_declared` | **fechado nas três pontas.** `INSERT` cru sai `3` com `declaração sem ato`; `role_kind='executor'` deixou de desculpar posse (`dono inesperado` + alcance acusado); o rearme pelo nome recriado não volta a `0` |
| `PAP-26` | `M3` e `M5` sobreviviam (`95 pass · 0 fail`) | **fechado.** `M3` mata 1 caso, `M5` mata 4 |
| `PAP-27` | onze linhas, três mandando devolver posse certa | **fechado.** Uma linha, `role_declarations_empty`, nomeando `migrate` |

**A cadeia do `PAP-25` que o brief nomeia** (executor cria papel → declara pelo `.env` → concede a terceiro) **morre no primeiro passo**, e isso é mais forte que a correção sugerida: em 16 o `CREATEROLE` não-superusuário vira membro do que cria, então `migrate` com o `.env` apontando para a credencial recém-criada sai `3` na mesma rodada em que a declara. Completada a cadeia à força, `probe_leitor` aparece nomeado, com `forja_executor` como concedente — o "silêncio dirigido" da auditoria §3.1 acabou.

**O que faltava e eu escrevi:**

- **`db/migrator/test/executor-da-suite.test.ts`** (novo, 224 linhas) — caso 59, que estava em `CONTRATO.md` §14 **sem teste nenhum**. Cinco cenários contra uma árvore de mentira (nunca contra `dist/test` real, que seria recursão): servidor faltando, total zero nos dois modos, alvo derivado vazio, pulo em modo de gate, e o modo parcial com contraste.
- **`db/migrator/scripts/run-tests.mjs:122-140`** — defeito real que o teste novo achou. A leitura do resumo TAP estava em `try/finally` **sem `catch`**: resumo que nunca foi escrito saía como `ENOENT` com pilha de `node:fs`, contradizendo o comentário "falha fechado: resumo que não pôde ser lido não é resumo com zero". Código de saída certo, mensagem inútil. Agora falha com o motivo.
- **`db/universo-e-declaracao.md:291-297`** — errata do `PAP-25` sobre o texto da `0011`. O cabeçalho da `0011` carrega a afirmação refutada ("já podia ler") e o item 3 envelhecido, e **não foi editado**: migration aplicada não se edita (`migrations.md` §1), e arquivo novo só para consertar prosa não é migration. A correção mora onde a `0011` já manda olhar (linha 6 do cabeçalho dela aponta para este documento).
- **`db/migrator/CONTRATO.md`** — caso 59 reescrito para o que o teste faz; casos 14 e 20 deixaram de citar "os quatro/oito arquivos" (o diretório tem 14); preâmbulo da §14 honesto sobre os casos sem banco.
- **`db/migrator/test/piso-de-medicao.test.ts`** e **`test/crivo.test.ts`** — texto defasado. O primeiro ainda dizia "o piso conhecido de pulos é `1`" e mandava rodar arquivo direto, depois de o executor da suíte passar a reprovar **qualquer** pulo e a ganhar `test:no-db`. O segundo cobrava `arquivos.length >= 8`, piso que envelhece a cada migration.
- **`db/referencia-estrutural-platform.txt:23-25`** — conferência da `0013` registrada: 78 linhas idênticas, `verify` `0`, nada a regerar.

### ARQUIVOS

Nesta rodada:
- `/home/mcastro/work/freelas/forja/db/migrator/test/executor-da-suite.test.ts` (novo)
- `/home/mcastro/work/freelas/forja/db/migrator/scripts/run-tests.mjs` (editado)
- `/home/mcastro/work/freelas/forja/db/migrator/test/piso-de-medicao.test.ts` (editado)
- `/home/mcastro/work/freelas/forja/db/migrator/test/crivo.test.ts` (editado)
- `/home/mcastro/work/freelas/forja/db/migrator/CONTRATO.md` (editado)
- `/home/mcastro/work/freelas/forja/db/universo-e-declaracao.md` (editado)
- `/home/mcastro/work/freelas/forja/db/referencia-estrutural-platform.txt` (editado)

Da rodada interrompida, **conferidos e não reescritos**: `db/migrations/platform/0013__event_kinds_declared_membership.sql`, `db/migrator/src/commands/verify-declarations.ts`, `src/role-declarations.ts`, `src/tenant-reach.ts`, `src/schema-universe.ts`, `src/run.ts`, `src/commands/verify.ts`, `test/declaracao-hostil.test.ts`, `test/motivos-de-divergencia.test.ts`, `db/verificacao-do-papel.md`, `db/papel-do-cliente.md`, `db/migrator/PROVISION-E-VERIFY.md`.

### NÃO FEITO

—

### DECISÕES

1. **O cabeçalho da `0011` fica errado, e a errata vai para o documento.** As três saídas eram: editar a migration (proibido, `migrations.md` §1, sem exceção nem para comentário), criar uma `0014` sem DDL (migration é DDL, não errata — `migrations.md` §7), ou corrigir onde a própria `0011` aponta. Escolhi a terceira e nomeei o cabeçalho na errata, para que quem ler o argumento velho tenha o endereço do novo ao lado. Trade-off: quem lê só o `.sql` e não segue o ponteiro continua lendo o texto refutado.
2. **A `0013` também não foi editada** — ela já rodou nos meus bancos hoje. Nada nela precisava mudar.
3. **Três mutações novas** (`M7`, `M8`, `M9`) além das seis do auditor, sobre o que esta rodada escreveu: a §7.5.5, a condição de permanência do executor e a conferência do ato. A régua do `PAP-26` é que predicado sem prova some na reescrita seguinte, e ela vale para o código novo tanto quanto para o herdado.
4. **`M6` foi refeita.** A primeira versão deixou `$1` órfão e quebrou a consulta (48 cancelados) — é o `M4` do auditor de novo. Mutação que quebra não prova nada; a limpa mata pelo caso 43, como a auditoria mediu.

### RISCOS

1. **O executor deixou de poder criar a credencial da aplicação sem ser acusado.** Em 16 ele vira membro do que cria, e a §7.5.5 acusa — o que está certo e está documentado, mas **muda a operação**: qualquer runbook em que o executor crie a credencial passa a reprovar no gate. A §7.2 já manda o operador criá-la; quem tiver o hábito contrário vai descobrir pelo `3`.
2. **Linha plantada não sai da tabela.** A saída é a adoção (`role_declaration_adopted`), e quem planta a linha consegue adotá-la conectando com aquele nome. A ausência 3 de `db/universo-e-declaracao.md` declara isso: a conferência pega o descuidado, não o forjado.
3. **`src/target.ts:42`, `isValidTenantSchemaName`, é exportada e nunca chamada.** Anterior a esta rodada (2026-09-11). Não toquei — fora de escopo.
4. **Quatro arquivos passam de 400 linhas** (`00-nucleo.md` §8): `papel-do-cliente.md` 446, `PROVISION-E-VERIFY.md` 442, `CONTRATO.md` 435, `RECUSAS.md` 415. Todos já estavam acima; eu acrescentei 4 linhas líquidas ao `CONTRATO.md` e nenhuma aos outros. `CONTRATO.md` §14 é uma tabela que cresce um caso por gate — ela vai precisar de corte próprio.
5. **`packages/` apareceu na working tree às 11:17 de hoje**, de outra sessão. Não é meu território e não reverti (`git.md` §1).
6. **Quatro containers órfãos** da rodada morta continuam de pé nas portas 55462–55465 (`forja-t9-trust`, `-scram`, `-probe`, `-antigo`). Não os removi, por instrução.

### VERIFICAÇÃO

**As duas contagens de suíte, medidas por mim, com o `dist/` que a própria suíte compila:**

| Servidor | Resultado | Saída |
|---|---|---|
| `trust` (16.15) + `trust` (15.19) ao lado | `109 testes · 109 passando · 0 falhando · 0 cancelados · 0 pulados` | **`0`** |
| `scram-sha-256` (16.15) + 15 ao lado | `109 testes · 84 passando · 1 falhando · 0 cancelados · 24 pulados` | **`1`** |

A única falha no `scram` é `o piso de medição da suíte`. A base da rodada anterior era `96 · 95 pass · 1 skipped` e `96 · 78 pass · 1 fail · 17 skipped`; o `1 skipped` do `trust` sumiu porque o executor da suíte passou a exigir o servidor 15 e a reprovar qualquer pulo — isso fecha, de passagem, a nota da auditoria §6 sobre o `t.skip` interno do caso 47 sair `0`.

`npx tsc --noEmit`: **saída 0**.

**Gate com total zero (item 3 do brief), medido por três caminhos:**

- alvo que não casa arquivo nenhum, com os dois servidores servidos: **saída `1`**, `suíte reprovada: 0 testes · 0 passando · 0 falhando · 0 cancelados · 0 pulados`, com a mensagem nomeando `rootDir, outDir, include`;
- modo parcial com lista derivada vazia: **saída `1`**, mesma recusa;
- e o teste novo mata as quatro mutações do próprio executor da suíte (tirar a recusa por total zero → 1 falha; por pulo → 1; por servidor faltando → 1; a lista vazia voltando a virar descoberta automática → 2).

**Sondas vivas, com o binário real (`node dist/src/main.js`), não com o arnês.** Arranjo montado do zero: `forja_app`, `forja_credencial` (`LOGIN NOINHERIT`), `forja_executor` (`LOGIN CREATEROLE`, **não superusuário**), os `REVOKE` do operador, dois clientes provisionados, uma linha em cada.

| Sonda | Resultado |
|---|---|
| saudável | `verify` **`0`**; com o `REVOKE` da §5 aplicado, **zero linha**; sem ele, uma linha `registra e não reprova` |
| `PAP-24`, credencial | intruso lê `acme=1` e `globex=1` por `SET ROLE`; `verify` **`3`** nomeando membro + concedente; `migrate` e `migrate --schema` **`3`**; `REVOKE` → **`0`** |
| `PAP-24`, executor | `verify` **`3`**; `REVOKE` → **`0`** |
| cadeia do `PAP-25` pelo `.env` | `migrate` **`3`** já ao declarar; forçada até o fim, `probe_leitor` sai nomeado com o concedente. Desfeita, **`0`** |
| `PAP-25`, `INSERT` cru | plantado lê `t_acme`; `verify` **`3`** com `declaração sem ato` **e** `dono inesperado` **e** alcance acusado; `app_role_declared` ficou em `3` (não cresceu) |
| `PAP-25`, rearme | o `ALTER SCHEMA` nem passa, e a acusação da linha plantada persiste: **`3`** |
| `PAP-27` | coberto pelo caso 54, que roda no gate |

**As seis mutações do auditor, refeitas contra o baseline final** (`dist` mutado sem recompilar; `dist/` restaurado e conferido **idêntico byte a byte** ao fim, 118 arquivos):

| Mutação | Antes | Agora |
|---|---|---|
| `M1` admin_option no grupo volta a desculpar | `fail 1` | `fail 1` (caso 45) |
| `M2` `deptype='e'` puro | `fail 1` | `fail 1` (caso 47) |
| `M6` credencial declarada exclui fora do grupo | `fail 1` | `fail 1` (caso 43) |
| **`M3`** `atributo_indevido` → `false` | **`pass 95 · fail 0`, saída `0`** | **`fail 1`** (caso 55) |
| **`M5`** os quatro herdados juntos | **`pass 95 · fail 0`, saída `0`** | **`fail 4`** (casos 55, 56, 57, 58) |
| `M7` §7.5.5 silenciada (nova) | — | `fail 1` (caso 51) |
| `M8` sem permanência do executor (nova) | — | `fail 3` (casos 52, 53, 54) |
| `M9` conferência do ato silenciada (nova) | — | `fail 3` (casos 52, 53, 54) |

**Os dois lados, sempre.** Em toda sonda, desfazer o estado devolveu o código anterior; o arranjo saudável saiu `0` três vezes, em três bancos diferentes, uma delas com **zero linha impressa**. Nenhum falso positivo.

**Não rodei:** `EXPLAIN (ANALYZE, BUFFERS)` sobre as consultas novas. O custo está declarado abaixo como raciocínio, não como medida.

### CHECKLIST DE `migrations.md` §10 — `0013__event_kinds_declared_membership.sql`

1. **Forward-only? Etapa destrutiva?** Forward-only. O corpo é um `INSERT` de quatro linhas de domínio. Nenhuma etapa da §4 se aplica: nada é dropado, renomeado ou truncado.
2. **Roda duas vezes? Schema vazio e com dado?** Os três medidos hoje, num banco novo: `migrate` ×3 com um cliente provisionado e uma linha de venda no meio — ledger `15 → 15`, `executor_event_kinds` `30 → 30`, `md5` do conteúdo do domínio idêntico, a linha do cliente intacta, `verify` `0`.
3. **Que lock, por quanto tempo, no maior cliente?** `RowExclusiveLock` em `platform.executor_event_kinds` (30 linhas, domínio fechado) e o `RowShareLock` da FK vinda de `executor_events`. **Nenhuma tabela de cliente é tocada**, então o caixa não espera. `lock_timeout` é aplicado em toda sessão por `src/session.ts:30`, a partir de `FORJA_MIGRATOR_LOCK_TIMEOUT_MS`, que não tem padrão — sem ela o executor recusa subir. A tabela não cresce com o número de clientes, então "o maior cliente" não muda a resposta.
4. **Transacional? O que a retomada limpa?** Transacional, declarado na linha 2. Nada a limpar: ou as quatro linhas entram, ou nenhuma.
5. **Alvo?** `platform`, e só. Declarado na linha 1. Nenhum objeto de cliente.
6. **Backfill?** Não. Semente de domínio fechado por código estável, `ON CONFLICT DO NOTHING`.
7. **Quem lê a estrutura antiga?** Ninguém perdeu nada. Os quatro códigos novos são lidos pela FK `executor_events.kind_code`; os emissores são `src/commands/verify-declarations.ts:46,72,94,117`, `src/role-declarations.ts:354,386` e `src/run.ts:302`. Conferido que **todo** `kind` emitido pelo código tem linha de domínio declarada — 30 códigos, sem sobra dos dois lados.

**`0011` e `0012`** estão em disco desde antes desta rodada e **não foram tocadas** (checksum). O checklist delas é o da rodada que as escreveu; o que eu acrescento é medição: a stream inteira `0000..0013` foi aplicada do zero três vezes hoje, em três bancos, com `verify` `0` no fim.

### AS CINCO PERGUNTAS DE `dados.md` §6

O modelo em questão é `platform.role_declarations` mais o domínio de eventos.

1. **Outro ramo, outro fuso?** Sobrevive aos dois. A tabela guarda **nome de papel do cluster** — um posto, uma padaria e uma loja têm o mesmo executor e a mesma credencial, e nenhuma coluna carrega vocabulário de ramo. `declared_at` é `timestamptz` em UTC e só aparece formatado com `at time zone 'UTC'` explícito (`src/role-declarations.ts:238`); nada aqui depende do fuso do cliente, porque nada aqui é do cliente.
2. **Que consulta fica cara, e que índice ela pede?** Duas. A §7.5.5 (`DECLARED_MEMBERS_SQL`) junta 2–3 linhas com `pg_auth_members`, que tem dezenas de linhas: catálogo, barato, sem índice nosso a pedir. A cara em potencial é a §7.5.4 (`UNATTESTED_SQL`, `src/role-declarations.ts:236-245`): ela faz `strpos(e.detail, '"' || role_name || '" ') = 1` sobre `platform.executor_events`, que é **a única tabela deste desenho que cresce**. O que a segura é `executor_events_kind_code_idx`, que reduz o conjunto aos eventos de declaração — um punhado por banco. **Não medi com `EXPLAIN`**; é o ponto a medir se `app_role_declared` algum dia virar evento frequente, porque a comparação por prefixo é linear nas linhas que sobrarem do índice.
3. **Qual coluna eu vou querer mudar em 6 meses?** `role_kind`, que é `CHECK (role_kind IN ('executor','app_credential'))` e não tabela de lookup — o oposto do que `dados.md` §3 manda para domínio fechado. Está certo hoje porque o arranjo da §7.2 tem exatamente dois papéis, e um terceiro seria mudança do **arranjo**, não crescimento de domínio. E o trade-off que torna a exceção barata: `role_declarations` vive só no `platform`, que é **um** schema — alterar o `CHECK` é uma migration em um lugar, não em N. É exatamente a razão pela qual `executor_event_kinds` **é** tabela e esta coluna não precisa ser.
4. **Isolamento: alguma consulta vê dado de outro cliente?** Não. A tabela mora no `platform`, e o papel do cliente não alcança o `platform` — medido hoje pelo caso 57, que abre essa porta de propósito e vê a acusação. As duas perguntas novas rodam na conexão do executor, leem `pg_auth_members` e `platform`, e **não referenciam nenhum schema `t_`**. Nada no modelo é por cliente, então não há chave por onde vazar.
5. **Cardinalidade em 2 anos?** `role_declarations`: **10⁰–10¹** por banco. Duas linhas em regime normal, mais uma por rotação de credencial, e a linha da rotação nunca sai (append-only). Uma rotação por mês durante dois anos dá 26 linhas. Nada muda de faixa. `executor_events` é a de **10⁴–10⁶** — uma linha por achado e por recusa, por rodada, por schema —, e é ela que a §7.5.4 varre; na faixa de 10⁶ o índice de `kind_code` é o que impede a pergunta de virar seq scan, e é o primeiro número a medir se o `verify` começar a demorar.

### PERGUNTAS

- para **humano**: a `0011` fica com o cabeçalho errado e a errata no documento que ela cita (`db/universo-e-declaracao.md:291-297`). A alternativa era uma migration nova só para carregar prosa. Confirma o corte, ou prefere pagar uma `0014` inerte pela errata ficar no mesmo arquivo?
- para **humano**: os quatro containers `forja-t9-*` da rodada morta continuam de pé nas portas 55462–55465. Não os removi por instrução; posso removê-los quando você disser.

### MEMÓRIA SUGERIDA

- `type=gotcha escopo=plataforma camada=dados slug=create-role-de-createrole-vira-membership` — em PostgreSQL 16, `CREATE ROLE` emitido por `CREATEROLE` não-superusuário concede o papel novo ao criador com `ADMIN OPTION`: credencial criada **pelo executor** nasce com ele como membro, e a §7.5.5 acusa. Quem cria a credencial é o operador.
- `type=convention escopo=plataforma camada=dados slug=errata-de-migration-aplicada-mora-no-documento` — cabeçalho de migration já aplicada não se corrige; a errata vai para o documento que a migration cita como semântica, nomeando o arquivo e o item refutados.
- `type=gotcha escopo=processo camada=processo slug=gate-que-spawna-o-gate-herda-node-test-context` — processo filho que roda a suíte de dentro de um teste herda `NODE_TEST_CONTEXT`, `node --test` recusa rodar recursivamente e não escreve relator nenhum; quem lê o resumo recebe ausência de arquivo, não placar.
- `type=convention escopo=plataforma camada=dados slug=piso-de-suite-e-condicao-nao-contagem` — piso de teste escrito como número (`length >= 8`, "pulos = 1") envelhece a cada mudança e vira número que alguém ajusta por hábito; o piso é a condição (existe conjunto, existe servidor, zero pulo).

### PRÓXIMO PASSO SUGERIDO

`seguranca` — nono gate sobre `db/**`, com escopo declarado: (a) a §7.5.5 fecha o `PAP-24` sem fecho transitivo, e o argumento de suficiência está em `db/universo-e-declaracao.md:261-271` — ataque-o; (b) `role_declaration_adopted` é a saída da acusação do `PAP-25` e é alcançável por quem plantou a linha (ausência 3, `db/universo-e-declaracao.md:307-310`); (c) as três mutações novas (`M7`, `M8`, `M9`) foram escritas por mim sobre o meu próprio código, o que é o tipo de prova que precisa de segunda leitura; (d) o executor da suíte agora reprova por pulo, e vale medir se isso cria pressão para alguém marcar teste como `todo`.

## seguranca — 2026-09-23 (nono gate)

## RELATÓRIO — seguranca — T-0009
STATUS: PARCIAL

**A camada não fecha.** A rodada foi interrompida antes do fim, e o alvo (c) não foi feito (detalhe em NÃO FEITO). O "não fecha" vem de dois achados medidos, e não do que ficou por fazer.

**Prioridade um: sim, existe caminho em que um cliente vê dado de outro.** Só com os privilégios do próprio executor, sem superusuário, dá para montar uma credencial de login separada que lê os dois clientes. Com ela de pé, `verify` e `migrate` saem `0` (é o `PAP-28`).

FEITO:
- Refiz as duas contagens da suíte e elas conferem com o autor:
  - `trust` 16 + 15: `109 testes · 109 passando · 0 falhando · 0 pulados`, saída `0`.
  - `scram` 16 + 15: `109 · 84 passando · 1 falhando · 24 pulados`, saída `1`. A única falha é o piso de medição.
  - `tsc --noEmit` sai `0`.
- Montei um arranjo vivo com o binário real, executor sem superusuário e dois clientes. O estado saudável sai `verify` `0`, com zero linha.
- **(a)** Ataquei o argumento de suficiência da §7.5.5. Ele se sustenta dentro do que cobre: o executor não consegue revogar a própria membership automática (medido, `permission denied`). A premissa em `db/universo-e-declaracao.md:281-285, 313-318` é falsa: o executor consegue deixar uma credencial criada por ele sem membro nenhum. Isso vira o `PAP-28`.
- **(b)** A adoção sozinha não amplia nada: ela passa pela mesma recusa de borda que uma declaração normal. O furo está no caminho normal de declaração, que aceita credencial feita pelo executor (`PAP-28`).
- **(d)** Medi o `run-tests.mjs` real sobre uma árvore descartável. `todo` passa pelo gate nas quatro formas, mesmo com o corpo falhando, e some da conta impressa. `t.skip()` condicional no corpo é pego. Isso é o `PAP-29`.
- **Retirar declaração errada:** continua sem procedimento escrito. Medi a consequência: credencial aposentada deixa uma linha permanente com uma instrução que já foi cumprida (`PAP-30`).
- Escrevi o relatório de auditoria. A sequência exata de exploração ficou fora dele de propósito, e sai numa consulta para o dono.

ARQUIVOS:
- `/home/mcastro/work/freelas/forja/docs/auditorias/2026-09-23-nono-gate-camada-de-papel.md` (novo)
- Todo o resto só leitura. As mutações e sondas rodaram numa cópia de `db/` no scratchpad, já apagada.

NÃO FEITO:
- **Alvo (c):** a segunda leitura de M7, M8 e M9, e uma mutação minha por predicado novo.
- **Alvo (a), segunda metade:** alcance pelos papéis predefinidos do servidor, que ficam fora de `nspacl` e de `pg_auth_members`.
- **S5** medido: ficou só a leitura do desenho.
- **Canais laterais** (cache, fila, log e afins).
- Motivo: a rodada foi interrompida enquanto eu ampliava as sondas de ataque, e parei ali em vez de continuar.

DECISÕES:
- `PAP-28` como `MÉDIO` reincidente, com a mesma régua do `PAP-25`. A linha fica visível, com `app_role_declared` e `declared_by`, então não é `ALTO`. Não é `BAIXO` porque essa linha é indistinguível da de uma rotação legítima e nada veta.
- `PAP-29` como `MÉDIO`, reincidente em classe de `PAP-23`/`SUB-07`.

RISCOS:
- O executor de `apps/api` declara a mesma política de suíte e pode ter a mesma omissão do `todo`. Não verifiquei, porque é o escopo da auditoria em paralelo.
- `dist/` tem 120 arquivos, e o autor contou 118. A diferença é anterior a esta rodada. Conferi por `sha256` que terminou idêntico ao início.
- Os registros de memória que o brief cita (`convention-propriedade-acusa-nunca-desculpa`, `convention-exclusao-se-prova-com-o-excluido-hostil`) **não existem** em `memory/processo/`. Só aparecem como ganchos em `state-retomada-2026-09-12.md:8,33` e não estão no `INDEX.md`.
- Existem containers `forja-s13-*` rodando, da outra sessão. Não toquei.

PERGUNTAS:
- para orquestrador: despacho o `PAP-28` ao `arquiteto-dados` com a sequência de reprodução por consulta direta, e não pelo relatório? Hoje ela está fora do texto.

VERIFICAÇÃO:
- Suíte nas duas configurações, `tsc`, e sondas vivas contra o binário real, tudo com os resultados citados acima.
- Containers `forja-g9-*` removidos ao fim.
- `dist/` com 120 arquivos, `sha256` idêntico antes e depois.
- `devstack-pg`, `devstack-s3`, `serve-offgrid-cms`, os `forja-t9-*` e os `forja-s13-*` não foram tocados.
- Nenhum git que muda estado.

MEMÓRIA SUGERIDA:
- type=gotcha escopo=plataforma camada=seguranca slug=condicao-de-permanencia-emitida-pelo-beneficiario — a permanência da `app_credential` é ser membro do grupo, e o executor tem ADMIN sobre o grupo: é uma propriedade que desculpa e que o beneficiário emite, e foi por ela que a cadeia do `PAP-25` reabriu.
- type=gotcha escopo=processo camada=processo slug=todo-do-node-test-passa-pelo-gate — `node --test` conta `todo` à parte. Um gate que lê só pass, fail e skipped fica verde com corpo falhando, e o placar impresso não fecha a conta.

PRÓXIMO PASSO SUGERIDO:
- `arquiteto-dados`: `PAP-28` primeiro, com o caso hostil posto na credencial que o próprio executor monta; depois `PAP-30`.
- `coder`: `PAP-29`.
- Depois disso, um gate de `seguranca` que complete a §5 do relatório: alvo (c), papéis predefinidos, S5 medido e canais laterais.

## seguranca — 2026-09-23 (consulta: reprodução do PAP-28)

## CONSULTA — T-0009 — resposta: reprodução do PAP-28

Medido em 2026-09-23, PostgreSQL 16.15, executor **não-superusuário**. Arranjo saudável recém-provisionado (§7.2 completa, dois clientes com uma linha cada). Senha de container vai como `<placeholder>`.

**Pré-condição do arranjo (operador, uma vez):** a §7.2 concede `GRANT forja_app TO forja_executor WITH ADMIN OPTION`. É essa linha que dá ao executor ADMIN sobre o grupo, e é ela que o PAP-28 usa. Estado inicial medido: `verify` sai `0`, zero linha.

**Passos, todos na conexão do EXECUTOR (forja_executor), salvo a nota do passo 4:**

1. executor — cria uma ponte com CREATEROLE e a assume:
   ```
   CREATE ROLE g9_ponte NOLOGIN CREATEROLE;
   GRANT g9_ponte TO forja_executor WITH SET TRUE;
   SET ROLE g9_ponte;
   ```
2. executor (agindo como a ponte) — cria a credencial:
   ```
   CREATE ROLE g9_cred LOGIN NOINHERIT PASSWORD '<placeholder>';
   RESET ROLE;
   ```
   Sonda `select member::regrole, grantor::regrole, admin_option from pg_auth_members where roleid='g9_cred'::regrole;` devolve: **`g9_ponte | postgres | t`** — o membro automático é a ponte, não o executor.
3. executor — derruba a ponte:
   ```
   DROP ROLE g9_ponte;
   ```
   Sonda `select count(*) from pg_auth_members where roleid='g9_cred'::regrole;` devolve **`0`**. A credencial ficou **sem membro nenhum** — a §7.5.5 não tem o que acusar, e o executor sabe a senha dela.
4. executor — põe a credencial no grupo:
   ```
   GRANT forja_app TO g9_cred;
   ```
5. rodada de `migrate` com o **ambiente apontando para g9_cred** (`FORJA_MIGRATOR_APP_CREDENTIAL_ROLE=g9_cred`, conexão ainda do executor). Devolve:
   - `papel declarado: "g9_cred" passou a constar em platform.role_declarations …` (grava `app_role_declared`)
   - completa o papel de cada cliente para g9_cred, saída `EXIT=0`.
6. sonda de vazamento, conexão **g9_cred** (login separado, senha conhecida por quem tem a do passo 2):
   ```
   SET ROLE app_t_acme;   select count(*) from t_acme.orders;    -- devolve 1
   RESET ROLE;
   SET ROLE app_t_globex; select count(*) from t_globex.orders;  -- devolve 1
   ```
   Lê os **dois** clientes.
7. `verify` com o ambiente **normal** (env=forja_credencial): saída **`0`**, `verify: nenhuma diferença.` A única linha é `registra e não reprova: credencial de aplicação a mais: "g9_cred" …` — **texto idêntico** ao de uma rotação legítima da §7.7. `migrate` normal também sai `0`.

**Contraprovas medidas (para o teste hostil do fix):**
- tirar g9_cred do grupo e revogar os papéis de cliente dela (`REVOKE … GRANTED BY forja_executor`) devolve o estado a `verify` `0` sem alcance.
- `GRANT app_t_acme TO g9_cred` **sem** o grupo sai `3`, com `alcance ao schema "t_acme": g9_cred é membro do papel do cliente` — ou seja, é a membership no grupo (a "condição de permanência" da credencial) que compra o silêncio, e o executor a emite sozinho.

**A raiz, para o fix:** a permanência da `app_credential` na §7.5.1 (`tenant-reach.ts:55-63`) é "ser membro de `$1` (forja_app)". O executor tem ADMIN sobre forja_app (§7.2). Logo a condição é uma propriedade que o beneficiário emite — exatamente o que `role-declarations.ts:10-11` proíbe. Para o `executor` o autor já trocou por posse de `platform`, que não se emite em silêncio; para a credencial, não. O caso hostil do teste tem que ser **esta** credencial que o próprio executor monta, não o sósia/ponte não declarados.

Nenhum arquivo escrito nesta consulta. Auditoria não ampliada.

## arquiteto-dados — 2026-09-23 (correção do nono gate, interrompida)

## RELATÓRIO — arquiteto-dados — T-0009
STATUS: BLOQUEIO

FEITO:
- Li a ficha (o relatório da retomada de 2026-09-12, o nono gate e a consulta com a reprodução do PAP-28), `docs/auditorias/2026-09-23-nono-gate-camada-de-papel.md`, o SUB-09 e o SUB-12 de `docs/auditorias/2026-09-23-conferencia-da-credencial-na-subida-terceira.md` e as duas convenções de `memory/processo/`.
- Li `db/papel-do-cliente.md`, `db/universo-e-declaracao.md`, `db/migrations/platform/0011__role_declarations.sql` e, em `db/migrator/src/`, os arquivos `role-declarations.ts`, `tenant-reach.ts`, `preconditions.ts`, `config.ts`, `run.ts` e `tenant-role.ts`.
- Um classificador de segurança da ferramenta interrompeu a rodada enquanto eu ainda lia o código, antes de qualquer escrita. Parei ali e não retomei pelo mesmo caminho.

ARQUIVOS: todos só leitura. Nenhum arquivo foi criado ou editado em `db/**` nem fora dele.

NÃO FEITO: nenhum dos seis itens do brief foi implementado (PAP-28, PAP-29, PAP-30, o lado do `verify` do SUB-09, SUB-12, a linha S5 da §7.2). Não escrevi nenhuma migration nova, nenhum teste, nenhuma mutação, e não rodei a suíte.

DECISÕES: nenhuma foi tomada. Nada das decisões 1 a 6 do thread foi aplicado nem contestado.

RISCOS:
- O PAP-28 continua aberto, como a auditoria mediu: o executor consegue montar sozinho uma credencial que lê os dois clientes, e `verify` e `migrate` saem `0`.
- PAP-29, PAP-30, SUB-09 e SUB-12 também continuam abertos no lado de `db/**`.
- O `backend` está mexendo no gate de suíte de `apps/api` em paralelo. As duas formas do PAP-29 devem sair iguais, e o lado de `db/**` ainda não começou.

PERGUNTAS:
- para orquestrador: quer que eu seja despachado de novo, com o mesmo brief ou com um recorte menor? Uma opção é começar pelo PAP-29 e pelo PAP-30, que são mecânicos, e deixar o PAP-28 para um despacho próprio. Nesta rodada a interrupção veio antes de qualquer escrita, então não há estado parcial para retomar.

VERIFICAÇÃO: não rodei nada. Não subi nenhum container `forja-d9-*`, então não há nada a remover. Não toquei no `devstack-pg`, no `devstack-s3`, no `serve-offgrid-cms` nem nos `forja-t9-*`. Nenhum comando git que muda estado foi usado.

MEMÓRIA SUGERIDA: —

PRÓXIMO PASSO SUGERIDO: orquestrador — decidir se redespacha o `arquiteto-dados` com o brief inteiro ou em partes. A leitura desta rodada não precisa ser refeita: os arquivos acima são o contexto necessário.

## arquiteto-dados — 2026-09-23 (recorte 1: PAP-29, PAP-30, SUB-09, SUB-12, S5)

## RELATÓRIO — arquiteto-dados — T-0009
STATUS: OK (recorte 1 de 2. O `PAP-28` continua aberto e é o despacho seguinte.)

FEITO:
- **PAP-29 (gate da suíte de `db/migrator`).** Mudanças no gate:
  - `todo` reprova no gate e no modo parcial.
  - No gate, passar exige `pass === total`. No modo parcial, exige `pass + skipped === total`.
  - Relator novo, `scripts/relator-por-arquivo.mjs`, que registra de qual arquivo veio cada teste executado.
  - Lista nomeada em `scripts/arquivos-vivos.json` (18 arquivos). O gate reprova, nomeando o arquivo, em três casos: arquivo da lista que não executou nenhum teste; arquivo `.test.js` que usa o banco e não está na lista; arquivo que usa o banco e está fora do glob.
  - Medi que o `node --test` cria um teste que passa, com o nome do caminho, para um arquivo sem nenhum caso. Esse teste não conta como execução.
- **PAP-30 (retratação).**
  - Migration nova `platform/0014__role_retractions.sql`. É append-only, com uma retratação por nome, só de nome já declarado (FK) e terminal. O uuid v7 é gerado por DEFAULT, porque quem escreve a linha é o operador no psql.
  - Toda pergunta que exclui por declaração passa a usar só a declaração vigente: §7.5.1, dono, conferência do ato e declarações a mais. As perguntas que acusam continuam lendo todas as declarações.
  - A linha "credencial a mais" separa credencial ativa de credencial inerte. Para a inerte, a instrução é só a retratação.
  - `provision` e `migrate` saem com código `2` quando o arranjo nomeia um papel retratado.
  - Sem a tabela, `verify` sai `3` com `role_retractions_missing`.
  - Procedimento escrito em `db/universo-e-declaracao.md` §7.5.4, "Retirar uma declaração".
- **SUB-09, lado do `verify`.** Adotei o complemento do backend: destino é qualquer schema diferente do schema do objeto; `SECURITY DEFINER` é acusado por existência; `security_invoker` não é desculpado.
  - A impressão de estrutura ganhou as linhas `materializada` e `regra` (exceto `_RETURN`).
  - Pergunta nova que veta, "delegação por dono de objeto", com evento `object_owner_delegation`.
  - A spec está em `db/delegacao-por-dono.md` §7.5.6.
- **SUB-12.** Terceira via `predefinido` na §7.5.1, sem exclusão nenhuma, papel declarado inclusive. A consulta sobe `pg_auth_members` a partir do grupo e de cada membro direto dele. Papéis acusados: `pg_read_all_data`, `pg_write_all_data`, `pg_read_server_files`, `pg_write_server_files`, `pg_execute_server_program` e `pg_maintain`. A subida não usa `pg_has_role`, porque ele responde `true` para superusuário.
- **S5.** Uma linha na §7.2 de `db/papel-do-cliente.md`. Medido: concedida pelo operador, `verify` sai `3` (§7.5.5) e `migrate` recusa.
- **Casos 60, 61 e 62** em `CONTRATO.md` §14, e o caso 59 foi ampliado.

ARQUIVOS:
- Novos:
  - `db/migrations/platform/0014__role_retractions.sql`
  - `db/migrations/platform/0015__event_kinds_retraction_and_delegation.sql`
  - `db/migrator/src/role-retractions.ts`
  - `db/migrator/src/protected-dependency.ts`
  - `db/migrator/scripts/relator-por-arquivo.mjs`
  - `db/migrator/scripts/arquivos-vivos.json`
  - `db/migrator/test/alcance-lateral.test.ts`
  - `db/migrator/test/retratacao.test.ts`
  - `db/delegacao-por-dono.md`
- Editados:
  - `db/migrator/scripts/run-tests.mjs`
  - `db/migrator/src/tenant-reach.ts`
  - `db/migrator/src/schema-universe.ts`
  - `db/migrator/src/role-declarations.ts`
  - `db/migrator/src/structure-print.ts`
  - `db/migrator/src/events.ts`
  - `db/migrator/src/commands/verify.ts`
  - `db/migrator/src/commands/verify-questions.ts`
  - `db/migrator/src/commands/verify-declarations.ts`
  - `db/migrator/test/executor-da-suite.test.ts`
  - `db/migrator/test/exclusao-hostil.test.ts`: `DROP TABLE … CASCADE`, por causa da FK nova
  - `db/referencia-estrutural-platform.txt`: regerada, 92 linhas
  - `db/migrator/CONTRATO.md`
  - `db/migrator/PROVISION-E-VERIFY.md`
  - `db/papel-do-cliente.md`
  - `db/universo-e-declaracao.md`
  - `db/verificacao-do-papel.md`
- Só leitura: `apps/api/src/db/credential-query.ts`, `apps/api/scripts/*`.

NÃO FEITO: —

DECISÕES:
- **Retratação terminal.** O `UNIQUE (role_name)` da 0011 impede redeclarar o nome, e reabrir o nome seria ampliar a exclusão com uma linha escrita à mão. O custo: um nome retratado por engano só volta com papel de nome novo.
- **Nenhuma trava contra o executor em `role_retractions`.** A retratação só estreita. O pior que o executor faz é retratar a si mesmo, e aí todo schema passa a ser acusado (medido, caso 62).
- **§7.5.6 em arquivo próprio**, pelo teto de 400 linhas de `verificacao-do-papel.md` e de `universo-e-declaracao.md`.
- **Editei a 0015 depois que ela já tinha rodado**, para trocar o código do evento e a descrição, e renomeei o arquivo. Ela só tinha rodado nos bancos descartáveis desta sessão, que foram todos removidos, e `db/` está fora do git. Isso é exceção literal a `migrations.md` §1, e está declarada aqui.
- **Arquivos já acima de 400 linhas cresceram:** `PROVISION-E-VERIFY.md` (442→458), `papel-do-cliente.md` (446→452), `CONTRATO.md` (435→438). É a transcrição da SQL da §13.3, a linha S5 e as linhas dos casos. Partir esses arquivos fica fora do escopo.

RISCOS:
- O `PAP-28` continua aberto.
- **O gate de `apps/api` diverge do meu em dois pontos** (li `apps/api/scripts/gate-reporter.mjs`): lá não se exclui o teste criado para arquivo vazio, então um arquivo vivo esvaziado conta como exercido; e lá não se confere arquivo que usa o banco fora da lista nem fora do glob.
- **Via `predefinido` com muitos clientes:** um único `GRANT` imprime uma linha por schema `t_*`. É barulho proporcional ao dano.
- **Papel predefinido fora do grupo** continua sem acusação, conforme a decisão. Está declarado na §7.5.1.
- **Critério "qualquer outro schema":** um objeto de embutido não fixo do catálogo com oid entre 12000 e 16383 (views de `information_schema`, por exemplo) geraria linha em `pg_depend`. Hoje o crivo recusa esse qualificador, então é só risco futuro nos dois lados.
- **Risco do backend (ALTER SCHEMA … OWNER, ida e volta), medido:**
  - Passando por um papel terceiro, o `USAGE` se preserva.
  - Passando por `app_t_<slug>`, a entrada dele se funde com a do dono e some, e `has_schema_privilege` passa a `f`.
  - O `verify` acusa "falta USAGE no próprio schema. Converge com migrate", e o `migrate` recoloca o privilégio. Depois disso o `verify` sai `0`.
- **Achado lateral:** o `provision` que falha no passo 7 sai `1` com a pilha de erro impressa.

PERGUNTAS:
  - para backend: alinhar `apps/api/scripts/run-tests.mjs` nos dois pontos acima (teste criado para arquivo vazio; arquivo vivo fora da lista ou fora do glob)?

VERIFICAÇÃO:
- **Suíte:**

  | Modo | Placar | Saída |
  |---|---|---|
  | `trust` (16 + 15) | 119 testes · 119 passando · 0 todo · 18 arquivos vivos exercidos | 0 |
  | `scram` (16 + 15) | 119 · 88 passando · 1 falhando (o piso de medição, esperado) · 30 pulados | 1 |
  | `--no-database` | 49 · 49 passando | 0 |

  `tsc --noEmit` passou.
- **Mutações** feitas numa cópia de `db/` no scratchpad, sem recompilar. Todas morreram:

  | Mutação | Caso nomeado que morreu |
  |---|---|
  | M1, vigência ignorada em todo ponto | 3 casos de retratação |
  | M2, via predefinida silenciada | caso 61 |
  | M3, linha `regra` / M4, linha `materializada` | caso 60 |
  | M5, dependência que atravessa / M6, `prosecdef` | caso 60 |
  | M7, recusa de nome retratado | casos de retratação |
  | M8, credencial inerte | caso da rotação |
  | M9, guarda de `role_retractions` | caso da tabela ausente |
  | M10a, vigência na §7.5.1 | rotação |
  | M10b, vigência no dono | executor retratado |
  | M10c, vigência no ato | plantada |
  | M10d, vigência nas declarações a mais | rotação |
  | R2, `todo` e `pass === total` juntos | caso do `todo`, pela saída |
  | R3, arquivo da lista não executado | caso "arquivo vivo não rodou" |
  | R4, fora do glob / R5, não declarado | caso "fora do glob ou da lista" |
  | R6, teste criado para arquivo vazio | caso "arquivo vivo não rodou" |

  R1 (só o `todo`) morreu pela asserção da mensagem: sem ele, o `pass === total` ainda reprova. A primeira versão de M2 quebrava o parâmetro `$3` e ficou inválida; refeita. A queda de M3 a M6 também derruba o caso 61, porque o estado fica no banco compartilhado do arquivo.
  O `dist` da árvore ficou idêntico por sha256 antes e depois das mutações. Os dois scripts diferem só por edição minha de comentário.
- **`migrations.md` §3:**
  - Schema vazio: a suíte e os arranjos de sonda.
  - Com dado: platform em 0013 com declarações e eventos, depois `migrate` aplicou 0014 e 0015, `provision` e `verify` saíram `0`.
  - Duas vezes: a segunda rodada não aplica nada, e o corpo da 0014 e da 0015 rodado de novo à mão como executor passa.
- **Travas medidas dentro da transação:**
  - 0014: `ShareRowExclusive` em `role_declarations` e `AccessExclusive` na tabela nova.
  - 0015: `RowExclusive` em `executor_event_kinds`.
  - `platform.tenants` não é travada.
- **Custo, com 300 clientes de fixture (13 249 linhas em `pg_depend`):** consulta de delegação em 77 a 80 ms e `verify` inteiro em cerca de 4,0 s, sem nenhuma linha no banco íntegro.
- **Ambiente:** containers `forja-d9-*` nas portas 55530–55535, todos removidos (conferido: zero). Não toquei `devstack-*`, `serve-offgrid-cms` nem `forja-t9-*`. Nada de git.

**Item 6 (insumo do recorte 2), medido com o executor sem `ADMIN OPTION` em `forja_app`:**
- A primeira rodada de `migrate` sai `0`.
- `provision <slug>` registra o cliente, cria o schema e falha no passo 7 em `GRANT forja_app TO app_t_<slug>` (`tenant-role-act.ts:44`) com `permission denied to grant role "forja_app"` e saída `1`.
- `migrate` convergindo um papel ausente falha no mesmo `GRANT`.
- Com a `ADMIN OPTION` devolvida, `migrate` converge e `verify` sai `0`.
- Nenhum outro comando usa essa opção.

**Checklist de `migrations.md` §10 (0014 e 0015):**
1. Forward-only. Não é destrutiva.
2. Roda duas vezes; roda em schema vazio e com dado (medido acima).
3. Trava medida acima. `lock_timeout` vem da sessão do executor. O tempo no maior cliente não se aplica: o alvo é platform, com poucas linhas.
4. Transacional: sim.
5. Alvo só `platform`.
6. Sem backfill.
7. Nada de estrutura antiga mudou. Os leitores novos estão nos arquivos `src/` listados.

**`dados.md` §6:**
1. Outro ramo ou outro fuso: não há vocabulário de ramo, e o instante é `timestamptz` UTC.
2. Consulta cara: a delegação é linear em `pg_depend` (medido acima). A vigência usa o `UNIQUE (role_name)`.
3. Coluna que vou querer mudar em seis meses: o teto de 500 bytes de `reason`, e o caráter terminal da retratação.
4. Isolamento: só estreita, e as três perguntas novas não têm exclusão.
5. Cardinalidade em dois anos: retratações na ordem de 10¹ por banco; `pg_depend` na ordem de 10⁵ a 10⁶ com 10³ clientes.

MEMÓRIA SUGERIDA:
  - type=gotcha escopo=processo slug=gotcha-node-test-inventa-teste-para-arquivo-vazio — arquivo de teste sem nenhum caso sai no `node --test` 22 como um teste que passa, com o nome do caminho, e entra no `# pass`; gate que conta por arquivo tem de excluí-lo.
  - type=decision escopo=plataforma slug=decision-retratacao-de-declaracao-terminal — retirar uma declaração é linha nova em `platform.role_retractions`, feita pelo operador, que só estreita e é terminal (o nome não volta).
  - type=gotcha escopo=plataforma slug=gotcha-pg-identify-object-schema-nulo-em-regra-gatilho-default — `pg_identify_object` devolve `schema` nulo para regra, gatilho e default; o schema tem de ser resolvido pelo catálogo.

PRÓXIMO PASSO SUGERIDO: seguranca — gate sobre este recorte (PAP-29, PAP-30, SUB-09 do lado do `verify`, SUB-12, S5). Depois disso, arquiteto-dados no recorte 2 (PAP-28), com o item 6 acima como insumo.

## thread — 2026-09-23 (validação do recorte 1)

Conferido pelo thread: `npx tsc --noEmit` saída `0`; `npm run test:no-db` com `49 · 49 passando · 0 todo`,
saída `0`. **O gate com banco (`119/119` em `trust`) é do autor**: o thread não o rodou.

Aceita a exceção declarada a `migrations.md` §1: a `0015` foi editada e renomeada depois de rodar só nos
bancos descartáveis desta sessão, todos removidos, e nada disso está em git nem em banco compartilhado.
Daqui em diante, `0014` e `0015` são imutáveis.

Insumo do recorte 2, medido: o executor **precisa** do ADMIN OPTION sobre `forja_app`, porque
`provision` faz `GRANT forja_app TO app_t_<slug>` (`tenant-role-act.ts:44`). Tirar a opção não fecha o
`PAP-28` por construção. A direção decidida continua de pé (declarar a credencial é ato do operador), e
o recorte 2 precisa de outro mecanismo para o grupo, como o papel do cliente entrar por um grupo
intermediário que o executor administra sem administrar `forja_app`.

**A ficha continua aberta.** Faltam o recorte 2 (`PAP-28`), o gate de `seguranca` sobre o recorte 1, e o
alinhamento do gate de `apps/api` nos dois pontos que o autor achou (teste criado para arquivo vazio;
arquivo que usa o banco fora da lista ou do glob). Tudo **sem despacho**, por pedido do humano de
2026-09-23.

## arquiteto-dados — 2026-09-23 (recorte 2, interrompido)

## RELATÓRIO — arquiteto-dados — T-0009
STATUS: BLOQUEIO (recorte 2 de 2, `PAP-28`: nada implementado)

FEITO:
- Li as regras do brief (`00-nucleo.md`, `dados.md`, `migrations.md`, `handoff.md`). Li também, na ficha, o nono gate, a consulta com a reprodução do `PAP-28`, o meu relatório do recorte 1 (item 6 incluído) e a nota de validação do thread. Li ainda `docs/auditorias/2026-09-23-nono-gate-camada-de-papel.md` e `memory/processo/convention-propriedade-acusa-nunca-desculpa.md`.
- Li, só leitura, em `db/`: `papel-do-cliente.md` (§7.1 a §7.7), `universo-e-declaracao.md`, `papeis-e-credencial.md:40-120`, as migrations `0011`, `0014` e `0015`, e em `db/migrator/src/` os arquivos `tenant-reach.ts`, `role-declarations.ts`, `role-retractions.ts`, `tenant-role.ts`, `tenant-role-act.ts`, `preconditions.ts`, `commands/verify-questions.ts` e `commands/verify-declarations.ts`.
- Para saber quem mais depende da pertença ao grupo, li só em leitura `apps/api/src/db/app-credential.ts` e um trecho de `apps/api/src/db/credential-query.ts`.
- **Um classificador de segurança da ferramenta interrompeu a rodada** durante essa leitura do lado de `apps/api` (a leitura de `credential-query.ts` a partir da linha 150, sobre a consulta da conferência de credencial). Isso aconteceu antes de qualquer escrita. Como o brief manda, parei ali e não repeti a ação por outro caminho.

ARQUIVOS: todos só leitura. Nenhum arquivo foi criado ou editado em `db/**` nem fora dele.

NÃO FEITO (tudo do brief):
- a escolha e a medição do mecanismo que tira do executor a condição de permanência;
- a recusa do `migrate` para credencial que o operador não declarou;
- o `verify` saindo diferente de `0` para credencial no grupo sem declaração do operador;
- migration nova e os três testes de `migrations.md` §3;
- o caso hostil (a credencial que o próprio executor monta pela sequência da consulta), o caso saudável e a rotação legítima da §7.7;
- a mutação numa cópia do `dist` morrendo por predicado nomeado;
- a suíte em `trust` e em `scram`, o `tsc` e o checklist da §10.
Motivo: a interrupção acima.

DECISÕES: nenhuma tomada. O que segue é leitura, não decisão, e serve só para não se perder o contexto:
- Fato: a credencial está no grupo `forja_app`, e o `apps/api` confere isso no arranque (`app-credential.ts:122`, `in_group` sem ADMIN).
- Fato: os papéis de cliente também estão no grupo, por `GRANT` do executor (`tenant-role-act.ts:44`). O `no_grupo` de `tenant-role.ts` e a afirmação 2 de `papeis-e-credencial.md` §1 exigem isso.
- Inferência: tirar os papéis de cliente de `forja_app` (por um grupo intermediário que o executor administra, ou por nenhum grupo) muda `no_grupo`, o §7.3, a §7.7 e o texto de `papeis-e-credencial.md` §1. Não muda a pertença da credencial, que é o que o `apps/api` confere.
- Não medido: se, em 16, retirar a ADMIN OPTION do executor sobre `forja_app` exige `CASCADE` por causa das concessões que dependem dela. Isso decide como fica um arranjo que já existe.

RISCOS:
- O `PAP-28` continua aberto como a auditoria mediu. O executor monta sozinho uma credencial que lê os dois clientes, e `verify` e `migrate` saem `0`.
- Qualquer mecanismo que tire os papéis de cliente de `forja_app` toca a regra de `apps/api` sobre o que é "papel de aplicação". A conferência de arranque de lá não fica atrás do território de `db/**`.

PERGUNTAS:
  - para orquestrador: redespacho o recorte 2 com o mesmo brief? Outra opção: um brief que dispense a leitura de `apps/api/src/db/credential-query.ts`, com o `backend` respondendo por consulta curta se a conferência de arranque depende de o papel assumido ser membro de `forja_app`. Foi nessa leitura que a interrupção aconteceu.

VERIFICAÇÃO: não rodei nada. Não subi nenhum container `forja-d9-*`, então não há o que remover. Não toquei `127.0.0.1:5432`, `devstack-*`, `serve-offgrid-cms` nem `forja-t9-*`. Não usei git e não escrevi segredo.

MEMÓRIA SUGERIDA: —

PRÓXIMO PASSO SUGERIDO: orquestrador — decidir o redespacho do recorte 2. Só depois disso vem o `arquiteto-dados` de novo, com a leitura desta rodada como ponto de partida (os paths acima), sem precisar refazê-la.

## thread — 2026-09-23

Recorte 2 interrompido de novo por classificador de permissão, antes de qualquer escrita (terceira interrupção de trabalho sobre `PAP-28`/credencial na sessão). Não redespachei. O `PAP-28` segue aberto; decisão de retomar é do humano.

## thread — 2026-09-23 (permissão do humano)

O humano, em 2026-09-23: "eu concedo permissao para destravar! Avançe nas tres esperas." Redespachado.

## arquiteto-dados — 2026-09-23 (recorte 2, terceira interrupção)

## RELATÓRIO — arquiteto-dados — T-0009
STATUS: BLOQUEIO (recorte 2 de 2, `PAP-28`: nada implementado. Um classificador de segurança da ferramenta interrompeu a rodada pela terceira vez.)

FEITO:
- Li na ficha as seções de 2026-09-23: o nono gate, a consulta com a reprodução do `PAP-28`, o recorte 1 com o item 6, a validação do thread e a permissão do humano.
- Precisava reler o código antes de editar. Li, só leitura:
  - em `db/migrator/src/`: `role-declarations.ts`, `tenant-reach.ts`, `tenant-role-act.ts`, `tenant-role.ts`, `preconditions.ts`, trechos de `role-retractions.ts`, `executor.ts` e `commands/verify-questions.ts`;
  - `db/papel-do-cliente.md` §7.1 a §7.7 e `db/papeis-e-credencial.md` §1 e §2;
  - `db/migrator/test/support/postgres.ts`, `test/support/executor.ts`, `package.json` e o começo de `scripts/run-tests.mjs`.
- Não abri `apps/api/src/db/credential-query.ts`, como o brief pediu.
- **Onde parou:** a última ação que terminou foi um `grep` dos usos de `forja_app` e `ADMIN OPTION` nos arquivos `db/migrator/test/*.ts`, para mapear o que o arranjo de teste precisa mudar. Na resposta seguinte eu comparava as saídas de mecanismo, e foi aí que o classificador interrompeu. Parei ali, como o brief manda, e não retomei por outro caminho.

ARQUIVOS: todos só leitura. Nenhum arquivo foi criado ou editado em `db/**` nem fora dele.

NÃO FEITO (tudo do brief):
- escolher e medir o mecanismo: grupo intermediário, ou outra saída;
- medir se tirar o ADMIN exige `CASCADE` num arranjo existente, e escrever o procedimento de transição;
- a recusa do `migrate` para credencial não declarada pelo operador;
- o `verify` saindo diferente de `0` para credencial no grupo sem declaração do operador;
- a migration nova, se for precisa, e os três testes de `migrations.md` §3;
- o caso hostil, o caso saudável e a rotação da §7.7;
- a mutação numa cópia do `dist`;
- a suíte em `trust` e em `scram`, o `tsc`, o checklist da §10 e as cinco perguntas de `dados.md` §6.

Motivo: a interrupção acima.

DECISÕES: nenhuma tomada nem aplicada.

RISCOS:
- O `PAP-28` continua aberto como a auditoria mediu.
- As três interrupções caíram no mesmo tema: como o executor chega à pertença ao grupo. Redespachar com o mesmo brief tende a parar no mesmo ponto. Não sei qual trecho disparou o classificador, então não dá para contornar isso de dentro deste agent.

PERGUNTAS:
  - para humano: o trabalho sobre o `PAP-28` foi interrompido três vezes pelo classificador da ferramenta, inclusive com a sua permissão de 2026-09-23 registrada na ficha. Esse classificador não é controlado pelo projeto. Quer seguir por outra via? Uma opção é você mesmo desenhar ou aprovar o mecanismo, e o agent entrar só na transcrição e nos testes. Outra é ajustar a permissão do lado da ferramenta.

VERIFICAÇÃO: não rodei nada. Não subi container `forja-d9-*`, então não há o que remover. Não toquei `127.0.0.1:5432`, `devstack-*`, `serve-offgrid-cms` nem os containers de outra sessão. Não usei git e não escrevi segredo.

MEMÓRIA SUGERIDA: —

PRÓXIMO PASSO SUGERIDO: humano — decidir como destravar o recorte 2, conforme a pergunta acima. A leitura desta rodada não precisa ser refeita, e os paths estão em FEITO.

## thread — 2026-09-23 (PAP-28 suspenso)

Terceira interrupção do recorte 2 pelo classificador da ferramenta, com a permissão do humano já dada na conversa. Suspenso: não redespacho o mesmo tema. O `PAP-28` (MÉDIO) fica aberto como risco conhecido e **não bloqueia** `F-021`, porque trata da declaração da credencial e não das tabelas de cliente. Para destravar: o humano desenha ou aprova o mecanismo, e o agent só transcreve e testa; ou ajusta a permissão do lado da ferramenta.

# D-06(ii): onde mora a trilha dos nossos atos e das nossas leituras

> **Residência decidida, papel e ordem em revisão.** `arquiteto-dados`, `T-0019` (item `F-019`), passo
> F.1, 2026-09-23, revisado no mesmo dia depois do F.2. A residência virou registro `decision` que supera
> a parte (ii) de `memory/plataforma/decision-d-06-sao-tres-residencias-nao-uma.md`. A §5.3 e a §5.4
> esperam a reauditoria curta de `seguranca`. As partes (i) e (iii) continuam abertas, e nada aqui as
> presume.
>
> **Medida.** A primeira redação (F.1) não mediu nada: não havia servidor na sessão. A revisão abaixo
> mediu em PostgreSQL 16.15 descartável (`forja-t19-pg`, porta 55550, já removido), numa réplica mínima
> do arranjo de `db/papel-do-cliente.md` §7.2-7.3 com os papéis desta proposta. As medidas levam o
> rótulo `M1` a `M15` e estão na §5.6. O resto continua citação de medida anterior ou `ESTIMATIVA`.
>
> **Nenhuma migration nasce deste arquivo.** Escrever as migrations desta família é item próprio, com o
> gate 2, e os requisitos dele estão na §16.

## Revisão de 2026-09-23, depois do F.2 (`docs/auditorias/2026-09-23-d-06-trilha.md`)

A residência não mudou: o gate 2 a aprovou e ela está em
`memory/plataforma/decision-d-06-ii-trilha-no-platform-com-projecao-no-cliente.md`. O que mudou foi
papel e ordem, que o F.2 reprovou em `TRL-01` e `TRL-02`.

| Onde | O que mudou | Por quê |
|---|---|---|
| §5.3 | **uma ordem só, para toda classe:** autoridade com `COMMIT`, depois projeção com `COMMIT`, e só depois a leitura ou o ato. A leitura e o ato no schema do cliente são **recusados pelo banco** sem projeção já confirmada | `TRL-01`: o banco aceitava leitura sem fato (D5, D6 do F.2). `TRL-02`: ato sobre objeto do `platform` não cabe na transação do cliente |
| §5.3 | ato sobre objeto do `platform` grava o **desfecho** como fato próprio, na mesma transação do ato | `TRL-02`, direção do thread |
| §5.4 | a superfície nossa deixa de assumir `app_t_X`. Nascem o papel `prv_t_X`, o grupo `forja_prv`, a política por linha que prende a leitura à projeção, e três papéis no `platform` com fronteira declarada | `TRL-01`; `TRL-05` só na parte que muda §5.4 |
| §5.5 | a regra "autoridade sem projeção é ato que não aconteceu" passa a valer para toda classe, e a conferência ganha a regra do desfecho | consequência da ordem única |
| §5.6 | nova: as medidas e o custo do mecanismo | o thread pediu o custo |
| §16 | nova: `TRL-03` a `TRL-06`, as condições da conferência (F.2 §3.3) e o que o mecanismo da §5.4 acrescenta, como requisito do item das migrations | direção do thread |
| §1, §5.1, §5.2, §7, §11, §12, §14, §15 | frases ajustadas para não contradizer a §5.3 e a §5.4 | as frases do F.1 que o F.2 citou (`:151-153`, `:215`) estavam erradas |

**Uma divergência da letra da direção, e por quê.** O thread pediu "a leitura presa à projeção gravada
na **mesma** transação", que é a forma medida pelo F.2 (D1 a D3). Escolhi prender a leitura à projeção
**já confirmada em transação anterior**. A intenção do thread continua a mesma, a leitura presa à
projeção; o que muda é quando a projeção passa a existir. O motivo: na mesma transação, o `SELECT`
entrega as linhas à aplicação antes do `COMMIT`, e um `ROLLBACK` apaga a projeção depois disso. A
leitura teria acontecido e nada ficaria no schema do cliente. Não reproduzi isso em teste: é o que se
deduz do fato de a projeção só existir dentro da própria transação. Com a projeção confirmada antes,
a medida `M2` mostra que a leitura na mesma transação da projeção devolve **0** linha, e a `M3` mostra
que a leitura na transação seguinte devolve as linhas. Com isso o contrato "o resultado só sai depois do
`COMMIT`", que o thread tinha posto na conta do `backend`, passa a ser garantido pelo banco para
leitura, e a ordem de `TRL-01` fica igual à de `TRL-02`.

## 1. A resposta direta

| # | Proposta | Por quê, em uma linha |
|---|---|---|
| 1 | **A autoridade da trilha mora no `platform`**, inclusive a tentativa recusada sem alvo resolvido | é o único lado que sobrevive à saída do cliente e responde "o que a pessoa P fez" sem percorrer N schemas |
| 2 | **O cliente lê uma projeção derivada, no schema dele**, com o subconjunto que ele tem direito a listar | a sessão de cliente continua sem caminho nenhum até o `platform`, e a listagem fica isolada por construção |
| 3 | **Ordem fixa de gravação:** autoridade com `COMMIT`, projeção com `COMMIT`, e só então a leitura ou o ato, que o banco recusa no schema do cliente sem a projeção (§5.3) | toda leitura e todo ato nosso têm registro visível ao cliente **antes** de acontecer; divergência só existe num sentido |
| 4 | **"Quem" em duas camadas:** a autoridade guarda papel e identificador estável da pessoa; a projeção guarda papel e um pseudônimo próprio daquele cliente | o cliente distingue autores sem que exista chave de correlação entre schemas de clientes diferentes |
| 5 | **Alvo:** a autoridade é migration de `platform`; a projeção é migration de `tenant`; nunca as duas no mesmo arquivo | `.claude/rules/migrations.md` §7 |
| 6 | **`F-021` não depende desta decisão**, nem na condição que o item nomeia; o que a condição toca é a forma do campo de autor, que já é dependência declarada de `F-021` | §8 |

## 2. O que (ii) contém, e uma correção na leitura do item

**Os fatos de (ii):** `provider_read` e `provider_read_refused` (`RN-PRV-011`,
`docs/produto/fatos-de-operacao-provedor.md:33`), o ato nosso no ambiente do cliente (`RN-PRV-012`,
`:139`), o ato sob concessão de `provider_support` (`RN-NUC-024` d,
`docs/produto/papeis-atribuicao-e-delegacao.md:284`), e dois fatos que as quatro partes da convenção
exigem e que ainda não tinham nome: a **mudança de janela** e o **expurgo** (§7).

**A correção.** O item lê a terceira restrição do registro de `D-06` ("dois objetos com ciclos de vida
diferentes, fino e transitório para o incidente, grosso e retido") como restrição de (ii)
(`docs/backlog/F-019-...md:45`). Na origem ela é de (iii): `tarefas/T-0004-...md:850-853` diz "(iii)
herda (i) mais a restrição de repouso [...] grão fino por estabelecimento é transitório". Aplicada a
(ii), ela não tem objeto: **nenhum fato da trilha é transitório**, porque todo fato de (ii) está no
relógio da prova (`memory/plataforma/convention-retencao-tem-tres-relogios.md`), e uma parte "fina e
transitória" da trilha seria justamente a parte encurtável por custo que a separação dos relógios
existe para proibir.

O corte de ciclo de vida que (ii) tem de verdade é outro, e esta proposta dá residência diferente a
cada lado dele:

| Objeto | Ciclo de vida | Residência |
|---|---|---|
| **autoridade** (o fato) | retida pelo relógio da prova, sobrevive à saída do cliente | `platform` |
| **projeção** (derivada, reconstruível a partir da autoridade) | existe enquanto o cliente existe, sai com ele | schema do cliente |

A terceira restrição, lida no sentido original, é respeitada por omissão: nada desta proposta mora em
(iii). A primeira (agregado só em período fechado e forma não decomponível) também: a autoridade não é
agregado, e nenhum agregado sobre ela é publicado aqui.

## 3. As cinco saídas, aplicadas só a (ii)

Os defeitos gerais estão em `tarefas/T-0004-...md` §7.4. Aqui entra só o que muda quando a pergunta é
(ii).

| Saída | O que ela resolve para (ii) | O que ela quebra para (ii) | Veredito |
|---|---|---|---|
| **S1 `platform`** | sobrevive à saída; admite a recusa sem alvo; "o que P fez" e "o que fizemos em X" são uma tabela, sem fan-out | a listagem pelo cliente exige caminho de sessão de cliente até o `platform`, classe de caminho que hoje não existe | **adotada para a autoridade**, com o caminho de leitura substituído pela projeção (§5) |
| **S2 terceiro schema** | o mesmo que S1, e separa controle de operação nossa | o universo de schemas é fechado por construção (`db/migrator/RECUSAS.md` §11.3; schema fora de `platform` e `t_*` é acusado, `db/universo-e-declaracao.md` §7.5.3); muda a semântica de alvo do ledger; altera `decision-tenancy-schema-por-cliente` | recusada (§13) |
| **S3 schema do cliente** | a listagem pelo cliente fica isolada por construção | a prova sai com o cliente; a recusa sem alvo não tem schema escolhível (`gotcha-fato-do-provedor-nao-tem-residencia-unica`); a nossa pergunta vira `O(schemas)` | **recusada como autoridade, usada como projeção** |
| **S4 fora do banco** | um acervo de gravação única protegeria a trilha até contra o dono do banco, coisa que gatilho não faz | `D-01` fechou a stack do backend, não escolheu acervo nenhum: a saída continua presumindo infraestrutura sem decisão; perde restrição declarativa; é segundo controle de acesso e segunda retenção | recusada como residência; o ganho real vira complemento P2 (§15) |
| **S5 duas gravações** | põe cada leitor no lado dele | o defeito dela é ter **duas autoridades** que divergem em silêncio | **recusada na forma de duas autoridades; adotada na forma autoridade + projeção**, e a §5.3 mostra por que o defeito não se reproduz |

## 4. "A residência segue o objeto": adotada para fato, com o defeito escrito

**Adoto a linha para fatos.** O objeto de `provider_read` é um ato nosso que referencia um cliente, logo
a autoridade é nossa e mora do nosso lado. O objeto do **efeito** de um ato nosso (módulo ligado,
atribuição mudada, terminal habilitado) é estado do cliente, logo esse fato mora no schema dele, com
atribuição ao ato nosso. É a partição de `tarefas/T-0004-...md:867`, e ela fecha (§9).

**O defeito, que continua de pé:** a linha diz quem é dono do fato e não resolve decomposição por
cliente. A autoridade é decomponível por cliente por construção: cada linha nomeia o cliente-alvo, e
não há como ser de outro jeito. Esta proposta não esconde isso; ela limita o que a decomposição expõe:

- **o conteúdo é conduta nossa, não negócio do cliente:** a trilha nomeia classe de objeto e nunca
  copia o que foi lido (`RN-PRV-011`), então a autoridade não carrega dado de negócio de ninguém;
- **nenhuma sessão de cliente a lê:** o cliente lê a projeção (§5.2);
- **nenhum leitor nosso existe ainda** (§9, pauta 4.4): o risco da decomposição mora no leitor, e o
  leitor nasce com gate próprio.

**Onde a linha não se aplica, e por quê:** a projeção mora onde o isolamento do leitor dela exige, que é
o contrário do que a linha diz. A linha governa **fato**. Projeção é derivação reconstruível, sem
autoridade própria, na mesma distinção de `decision-agregado-de-periodo-fechado-nao-e-cache`. Tratar
a projeção como fato daria a ela autoridade própria, e duas autoridades é S5.

## 5. O desenho recomendado

### 5.1 A autoridade, no `platform`

Forma, não DDL. O item da migration decide nomes e tipos.

- **Chave:** `uuid` ordenado no tempo, gerado por quem grava (`D-04`), e é a mesma chave na projeção.
- **Instantes:** `occurred_at` e `received_at`, sem `updated_at` (`.claude/rules/dados.md` §3).
- **Quem:** código do papel nosso e identificador estável da pessoa. **Nunca o nome** (§9).
- **Alvo:** cliente-alvo resolvido, com chave estrangeira para `platform.tenants`. Nulo só na tentativa
  recusada em que a resolução falhou (`RN-PRV-011` f), com `CHECK` amarrando a nulidade ao tipo do fato;
  identificador **pretendido** em campo próprio, nunca no lugar do resolvido (`RN-PRV-011` e).
- **Sobre o quê:** estabelecimento (o `uuid` do cliente, sem chave estrangeira possível entre schemas),
  classe de objeto, sustentação (cláusula de `RN-PRV-010`, papel declarado, ou concessão com o `uuid`
  dela), motivo. Classe, sustentação e motivo são **lookup com código estável**, nunca `enum`
  (`dados.md` §3).
- **No ato:** quais campos mudaram e o efeito declarado sobre cobrança (`RN-PRV-012`), nunca valor de
  credencial nem dado de pagamento.
- **Imutável:** o mesmo gatilho de rejeição de `UPDATE`, `DELETE` e `TRUNCATE` que o `platform` já usa
  (`db/referencia-estrutural-platform.txt:76`), e nenhum papel de aplicação com `UPDATE` ou `DELETE`.

Três tabelas pequenas acompanham a autoridade, todas append-only e no `platform`:

- **registro de pessoa nossa:** o identificador estável e a correspondência com a pessoa, que **não se
  apaga** quando ela sai da equipe. Onde a pessoa se autentica é `D-03` E1 (`F-017`); o que esta
  proposta exige de qualquer resposta é que o identificador não seja reciclado e que a correspondência
  sobreviva à trilha;
- **pseudônimo por cliente:** um `uuid` aleatório por par (cliente, pessoa), único no par. Aleatório
  quer dizer v4, como exceção declarada a `D-04` (§16, `TRL-06`);
- **janela e expurgo:** a mudança de janela, com `declared_at` e `effective_at` e `CHECK` de que o
  segundo é posterior; e o fato de expurgo, que diz "fatos anteriores a T foram removidos" (§7).

**Por que a trilha sobrevive à saída:** `platform.tenants` rejeita `DELETE` por gatilho
(`db/referencia-estrutural-platform.txt:80`), então a chave estrangeira da autoridade continua
resolvendo depois que o schema do cliente deixa de existir, e nada na saída do cliente toca o
`platform`.

### 5.2 A projeção, no schema do cliente

- **Mesma chave** da autoridade. A superfície nossa grava com `INSERT` simples e lê `23505` na chave
  primária como "já gravado" ([[gotcha-on-conflict-com-alvo-exige-select]]; medido `M10`: a violação
  nomeia a restrição e, com a política por linha ligada, não traz o valor). A reprojeção da §5.5 roda
  com o dono e pode usar `ON CONFLICT DO NOTHING`.
- **Colunas:** instantes, tipo do fato, classe, sustentação, motivo, papel e **pseudônimo**. Sem
  identificador de cliente (o schema é o cliente) e sem identificador global da pessoa. Mais uma, que
  é mecanismo e não conteúdo: o identificador da transação que gravou a linha (`xid8`, com
  `DEFAULT pg_current_xact_id()`), de que a política da §5.4 depende. `received_at` e essa coluna
  nunca entram no privilégio de `INSERT` (medido `M7`).
- **Subconjunto:** só fato com alvo resolvido igual a este cliente. Tentativa recusada **não** é
  projetada enquanto `LACUNA-PRV-009` estiver aberta, e **nunca** pelo identificador pretendido
  (`RN-PRV-011` g e aceite (i), `fatos-de-operacao-provedor.md:115-118`).
- **Append-only**, pelo mesmo gatilho, criado pela migration de `tenant`.

### 5.3 A ordem de gravação

Revisada em 2026-09-23 (`TRL-01`, `TRL-02`). Uma ordem só, para leitura e para ato, e a diferença entre
objeto do cliente e objeto do `platform` fica no passo 3:

```
pedido de leitura ou ato nosso sobre o cliente X, com X resolvido e a sustentação conferida
→ 1. intenção na autoridade (platform), COMMIT                 falhou → nada acontece
→ 2. projeção em t_X, como prv_t_X, COMMIT                      falhou → nada acontece
→ 3a. objeto no schema de X: transação como prv_t_X, citando o fato do passo 2,
        com a leitura, ou com o ato e o fato de efeito em t_X    sem o passo 2, o banco recusa
→ 3b. objeto no platform: uma transação no platform
        com o ato e o desfecho "aplicado" na autoridade          os dois confirmam juntos, ou nenhum
        → 4. projeção do desfecho em t_X, COMMIT                 falhou → reprojeção (§5.5)
        ato recusado → desfecho "não aplicado" em transação própria
tentativa recusada → só o passo 1
```

**O que o banco garante e o que continua contrato:**

| Ordem | Quem garante | Como se prova |
|---|---|---|
| 2 antes de 3a | **o banco**: `prv_t_X` só lê ou escreve tabela do cliente com projeção já confirmada, da classe daquela tabela, citada pela transação e com no máximo W de idade (§5.4) | `M1` a `M6`, para leitura. A escrita usa a mesma expressão em `WITH CHECK` e não foi medida: nenhuma célula de escrita existe |
| ato de 3b junto do desfecho | **o banco**: uma transação no `platform` | atomicidade da transação |
| 1 antes de 2 | contrato do console. A política não alcança o `platform`, e não deve: nada em `t_X` lê o `platform` | a conferência acusa projeção sem intenção (§5.5) |
| 2 antes de 3b | contrato do console. O papel que age no `platform` não alcança `t_X`, e é o isolamento que exige isso | a conferência acusa desfecho aplicado sem projeção da intenção |

**Por que a divergência continua num sentido só.** Em toda classe a projeção vem antes do efeito, então
vale autoridade ⊇ projeção ⊇ o que aconteceu. "Intenção sem projeção" é leitura ou ato que não aconteceu:
por construção em 3a, e por contrato vigiado pela conferência em 3b. A divergência que sobra fica do lado
seguro: se o passo 3 falhar depois do 2, o cliente vê um acesso que não se consumou. A lista dele mostra
a mais, nunca a menos, e isso responde ao que o `TRL-01` apontou nas frases do F.1 que ele cita como `:151-153`, na numeração da primeira redação.

**Desfecho de ato sobre objeto do `platform` (`TRL-02`).** "Aplicado" confirma na mesma transação do ato,
então existe se e somente se o ato existe. "Não aplicado" não tem como estar junto, porque a transação do
ato recusado desfaz tudo: vai em transação própria, pelo gravador, e a ausência dele não prova nada,
porque a ausência de "aplicado" já prova. Ligar módulo pago para A com o passo 4 perdido deixa A com
o acesso já listado (passo 2) e com o desfecho faltando na lista, que a reprojeção repõe. O cenário do
F.2, em que A é cobrado sem nada na lista, deixa de existir.

**A projeção é testemunha de onde a leitura ocorreu.** Para ler em `t_Y` a transação precisa citar um
fato projetado em `t_Y`: citar o fato de `t_a` sob `prv_t_b` devolve 0 linha (`M5`). Se a autoridade
tiver gravado o cliente errado, o id do fato está em `t_Y` e a autoridade diz X, e a conferência acusa.
É o D6 do F.2, agora com rastro.

**A janela W.** A política aceita a projeção com `received_at` até W antes de **cada comando**
(`statement_timestamp()`), e não do começo da transação. Transação longa perde a leitura quando passa
de W (`M6`). W é parâmetro técnico e não prazo de negócio: mede o tempo entre confirmar a projeção e
terminar de ler. Proponho 30 s, e mudar W é migration.

### 5.4 Papéis de banco

Revisada em 2026-09-23 (`TRL-01`; `TRL-05` só no que muda aqui). **A superfície nossa não assume mais
`app_t_X`.** Assumir o papel do caixa dava à credencial do console todo o privilégio do caixa em todo
cliente e dava à credencial do caixa `INSERT` na projeção (`TRL-01`, segunda e terceira consequências).

| Papel | Onde | Privilégio | Quem cria | Medido |
|---|---|---|---|---|
| `app_t_X` (caixa) | `t_X` | o de hoje (`db/papel-do-cliente.md` §7.3). Na projeção lê tudo e não grava, porque nenhuma política de `INSERT` o alcança; `UPDATE` cai no gatilho | executor, sem mudança | `M9` |
| `forja_prv` | grupo, sem `LOGIN` | recebe o privilégio de tabela da superfície nossa, **tabela a tabela**, só onde existe célula de `RN-PRV`, e só por migration de `tenant` | operador, uma vez, ao lado de `forja_app` (§7.2), com `ADMIN OPTION` ao executor | — |
| `prv_t_X` | `t_X`, `NOLOGIN NOINHERIT` | `USAGE` em `t_X` e membro de `forja_prv` `WITH INHERIT TRUE`. Nenhum privilégio de tabela em nome próprio | executor, no `provision`, na transação que cria `app_t_X` | `M1` a `M8` |
| credencial do console | `LOGIN NOINHERIT` | membro de cada `prv_t_X`, do gravador e do leitor, `WITH INHERIT FALSE, SET TRUE`. Nunca de `app_t_X` nem de `forja_app` | operador | `M11`, `M12` |
| gravador da trilha | `platform` | `USAGE` em `platform` e `INSERT` **por coluna** na autoridade, sem `received_at`. Sem `SELECT` e sem `RETURNING` | fora de migration (§16) | F.2 A1 a A13 |
| leitor do console | `platform` | `SELECT` em `tenants`, no inventário e no pseudônimo. Nunca na autoridade | fora de migration (§16) | — |
| ator de `platform` | `platform` | `INSERT` só na tabela do objeto da célula (o registro de módulos, no caso do `TRL-02`). Sem `SELECT`, `UPDATE` ou `DELETE` | fora de migration, com a primeira célula de ato sobre objeto do `platform` | — |

**A política que prende a leitura.** Forma, e o item decide os nomes:

```sql
-- em toda tabela de t_X em que forja_prv tem privilégio
ALTER TABLE <tabela> ENABLE ROW LEVEL SECURITY;
CREATE POLICY <tabela>_open ON <tabela> AS PERMISSIVE FOR ALL TO PUBLIC
  USING (true) WITH CHECK (true);
CREATE POLICY <tabela>_provider_bound ON <tabela> AS RESTRICTIVE FOR ALL TO forja_prv
  USING (EXISTS (SELECT 1 FROM <projeção> p
                  WHERE p.object_class = '<código da classe da tabela>'
                    AND p.received_at >= statement_timestamp() - interval '30 seconds'))
  WITH CHECK (<a mesma expressão>);

-- na projeção
ALTER TABLE <projeção> ENABLE ROW LEVEL SECURITY;
CREATE POLICY <projeção>_read ON <projeção> AS PERMISSIVE FOR SELECT TO PUBLIC USING (true);
CREATE POLICY <projeção>_provider_scope ON <projeção> AS RESTRICTIVE FOR SELECT TO forja_prv
  USING (fact_id = nullif(current_setting('forja.provider_fact', true), '')::uuid
         AND xact IS DISTINCT FROM pg_current_xact_id_if_assigned());
CREATE POLICY <projeção>_provider_insert ON <projeção> AS PERMISSIVE FOR INSERT TO forja_prv
  WITH CHECK (xact = pg_current_xact_id());
```

Lida em ordem: a política da tabela pergunta se existe projeção daquela classe, recente, que eu enxergo.
A política da projeção decide o que `forja_prv` enxerga: só o fato que a transação citou com
`SET LOCAL forja.provider_fact`, e nunca linha gravada pela própria transação. Somadas, dão citação,
confirmação anterior, classe e janela. O caixa não é membro de `forja_prv`, então para ele só vale o
`true` permissivo, e o plano dele não muda (`M13`).

**Privilégio e política dependem da mesma herança, e é por isso que o privilégio vai só ao grupo.**
`prv_t_X` só tem privilégio de tabela por herança de `forja_prv`, e a política restritiva só o alcança
pela mesma herança. Membro sem herança falha fechado: `permission denied` (`M8`). O caminho que abre é
privilégio concedido direto a `prv_t_X`, porque escapa do grupo: a política não se aplica e ele lê tudo
sem projeção (`M14`). A verificação precisa acusar isso (§16, item 4).

**Por que o `GRANT` a `forja_prv` mora na migration de `tenant`.** A classe da tabela e a célula que a
abre são conhecimento daquela tabela, e ficam versionados com ela. O ato do executor concede por schema e
não sabe distinguir tabela (`db/papel-do-cliente.md:217`), e um ato por tabela dentro do executor é o que
aquela seção diz que apodreceria. O favorecido é fixo e é nome de cluster, então o texto da migration não
carrega nome por cliente e não precisa de `format(`. O preço é mudar o contrato do carregador, que hoje
recusa `GRANT` em migration (`db/migrator/RECUSAS.md:184`); a forma está na §16, item 5.

**Isolamento de `prv_t_X` entre clientes.** `prv_t_a` herda de `forja_prv` a ACL de `t_b.<tabela>`, mas
não tem `USAGE` em `t_b`: `permission denied for schema` (`M5`). Para a superfície nossa o isolamento
entre clientes fica numa camada só, o `USAGE` por papel, onde o caixa tem duas (`USAGE` e privilégio
de tabela, ambos por papel). Aceito porque o `USAGE` já é conferido pela pergunta invertida de
`db/verificacao-do-papel.md` §7.5.1, e porque, se ele vazar, ler `t_a` continua exigindo projeção em
`t_a`, que fica na lista do cliente lido.

- **Sessão de cliente:** nada muda. Nenhum papel de aplicação recebe `USAGE` em `platform`
  (`db/papeis-e-credencial.md:39`, medido pelo gate em `:74`), e a credencial do caixa não assume
  `prv_t_X` (`M11`).
- **Leitor da autoridade:** não existe. Nenhum papel recebe `SELECT` nela no nascimento (§9, 4.4).
- **O resíduo de `papeis-e-credencial.md` §6.2 muda de conteúdo.** A credencial do console continua
  membro dos N papéis por cliente. Trocar de cliente dentro da transação ainda é privilégio dela, e o
  que a troca rende agora é só leitura de tabela com célula, e só com projeção confirmada no cliente lido.

### 5.5 A conferência entre os dois lados

Comparar chaves da autoridade com as de cada projeção exige um sujeito que alcance os dois lados. O
único que já alcança é o executor, e o F.2 recusa que seja ele em agendador (§16, item 8). Vai como item
futuro, com gate de `seguranca`, agendado antes do primeiro ato ou leitura nossa em produção.

A regra de leitura, com a ordem da §5.3:

| Encontrado | Leitura |
|---|---|
| intenção na autoridade, sem projeção | não aconteceu, em toda classe |
| projeção sem intenção na autoridade | defeito do console: alarme |
| desfecho "aplicado" de objeto do `platform`, sem projeção da intenção | defeito de ordem: alarme |
| desfecho "aplicado" sem projeção do desfecho | passo 4 perdido: reprojetar |
| id de fato em `t_Y` com a autoridade dizendo X | ato no cliente errado: alarme |
| projeção sem efeito | acesso aberto que não se consumou; não é defeito |

### 5.6 As medidas e o custo do mecanismo

Medido em PostgreSQL 16.15, `forja-t19-pg`: executor sem superusuário, dono dos schemas; `forja_app`;
credencial do caixa e credencial do console `LOGIN NOINHERIT`; `app_t_a`, `app_t_b`, `app_t_c` como na
§7.3; `prv_t_a` e `prv_t_b` membros de `forja_prv` com herança, `prv_t_c` sem; as políticas acima com
W = 30 s e o gatilho de rejeição por comando na projeção.

| # | Cenário | Resultado |
|---|---|---|
| M1 | `prv_t_a` lê `orders` sem citar fato | 0 linha |
| M2 | grava a projeção, cita o fato e lê, na mesma transação | 0 linha |
| M3 | projeção confirmada antes; cita o fato na transação seguinte | 2 linhas, todas |
| M4 | fato de outra classe | 0 linha |
| M5 | fato de `t_a` citado sob `prv_t_b`, lendo `t_b` / `prv_t_a` lendo `t_b` | 0 linha / `permission denied for schema t_b` |
| M6 | lê, espera 31 s na mesma transação, lê de novo | 2, depois 0 |
| M7 | `prv_t_a` grava a projeção com `xact` ou `received_at` explícito | `permission denied for table` nos dois |
| M8 | `prv_t_a` com `INSERT` ou `UPDATE` em `orders` / `prv_t_c` (sem herança) lendo | `permission denied for table orders` nos três |
| M9 | `app_t_a`: lê `orders` e a projeção / grava na projeção / `UPDATE` na projeção | 2 e 3 linhas / `new row violates row-level security policy` / o gatilho recusa |
| M10 | `prv_t_a` regrava um fato já gravado | `23505` em `provider_access_pkey`, sem o valor da chave |
| M11 | credencial do caixa assume `prv_t_a` / caixa com `forja.provider_fact` ligado | `permission denied to set role` / vê o mesmo que sem |
| M12 | credencial do console lê sem assumir papel | `permission denied for schema t_a` |
| M13 | custo para o caixa, 500 000 linhas, `app_t_a`, tabela com e sem RLS | plano igual (PK; faixa de `occurred_at` com `LIKE`, que não é *leakproof*); `pgbench` de busca por PK, protocolo estendido, 8 s, duas rodadas: 0,215 e 0,214 ms nos dois casos |
| M14 | `SELECT` concedido direto a `prv_t_c`, sem herança do grupo | **2 linhas sem projeção**: falha aberta |
| M15 | `CREATE POLICY IF NOT EXISTS` / trava de `ENABLE ROW LEVEL SECURITY` e de `CREATE POLICY` / `ENABLE` duas vezes | erro de sintaxe / `AccessExclusiveLock` nos dois / sem erro |

Para `prv_t_X`, a subconsulta da política vira `InitPlan`: uma leitura pela PK da projeção por comando,
e o filtro por linha é o resultado dela.

**O custo, item por item:**

1. **Uma transação a mais, com `COMMIT`, por leitura ou ato nosso**, fora do caminho do caixa. Não medi
   a latência do `COMMIT`, que depende do disco.
2. **Tabela que ganha célula ganha RLS.** Para o caixa isso fica no ruído (`M13`). O custo real é de DDL:
   as duas formas pegam `AccessExclusiveLock` (`M15`), então abrir célula em tabela quente e grande é
   migration própria, com `lock_timeout`. Tabela que nasce com a célula, como a projeção, não paga nada.
3. **A classe fica no texto da política**, como código estável de lookup. Tabela sem célula não tem
   privilégio e fica invisível para a superfície nossa. Falha fechado.
4. **O contrato do carregador muda**, e `CREATE POLICY` não tem forma idempotente (`M15`): a idempotência
   vem da transação, como a de `ADD CONSTRAINT` (`db/migrator/CONTRATO.md:419`), e a migration é
   obrigatoriamente transacional.
5. **Executor e operador:** dois papéis por cliente no `provision`, perguntas novas no `verify`, um grupo
   e uma credencial a mais no ato do operador (§16).

**O que a construção não fecha, dito inteiro:**

- **A ordem 1 → 2 e a ordem 2 → 3b** são contrato, e a conferência as vigia (§5.5).
- **Repetição dentro de W.** Várias leituras da mesma classe sob um fato: o cliente vê um acesso, e não
  quantos comandos houve. `ROLLBACK` depois de ler não apaga nada, porque a projeção já estava
  confirmada. Perde-se a contagem, não a existência.
- **Pessoa.** O banco não sabe qual pessoa nossa está na transação, então o console pode citar o fato de
  outra pessoa, da mesma classe, dentro de W. Isso só fecha quando a identidade da pessoa chegar ao
  banco, e é `D-03` E1.
- **O dono do banco** desliga o RLS ou apaga a política, e a leitura sem projeção volta. A impressão
  estrutural hoje não vê nenhum dos dois (§16, item 4). É o mesmo resíduo do gatilho (§7).

**Recusados, nas quatro partes:**

| Recusado | Necessidade | Por que o mecanismo é ruim | O nosso | Por que é melhor, e a prova |
|---|---|---|---|---|
| projeção na mesma transação da leitura (a forma do F.2) | prender a leitura à projeção | o `SELECT` entrega as linhas antes do `COMMIT`, e o `ROLLBACK` apaga a projeção depois | projeção confirmada antes | nenhuma linha sai antes de a projeção estar confirmada: `M2` dá 0, `M3` dá 2 |
| privilégio de `forja_prv` por schema, com RLS em toda tabela | tabela nova não nascer legível para nós | tabela criada sem política nasce legível sem projeção, e o crivo teria de adivinhar a classe | privilégio por tabela, ao grupo, na migration da tabela | tabela sem célula não tem privilégio; a prova é o `permission denied` de `M8` |
| resíduo declarado, com controle fora do banco | saber o que a credencial do console fez | não prova nada no dia em que falha (decisão do thread) | política por linha | `M1` a `M6` |

## 6. Os três casos do critério 2

1. **Papel nosso lê o inventário de infraestrutura de X** (`R1`, `docs/produto/matriz-celulas-a-valorar.md:58`).
   Passo 1 grava o fato com classe "inventário de infraestrutura"; passo 2 grava a projeção em `t_X`
   junto com a leitura. Parte do inventário (versão de migration por schema) mora no `platform`: nesse
   caso o passo 2 é uma transação em `t_X` só com a projeção, e o resultado só sai depois dela. O `owner`
   de X lista o fato lendo o próprio schema. Hoje a operação de listar não tem célula
   (`LACUNA-NUC-031`) e a célula de `R1` está vazia: o caminho existe no modelo e nasce inerte.
2. **X encerra o contrato.** O schema de X segue a política de saída (`PN-10`; `tenant_offboarded` ainda
   é `PROVISÓRIA`, `fatos-de-operacao-provedor.md:336`) e leva a projeção. A autoridade fica no
   `platform`, com a chave estrangeira para a linha imutável de X em `platform.tenants`. **Por quanto
   tempo** é `LACUNA-PRV-006`; enquanto o número não existir, nada expira.
3. **A pessoa nossa que praticou o ato tenta ler a própria trilha.** Hoje: recusa, porque nenhum papel
   tem `SELECT` na autoridade, e a tentativa é ela mesma fato de tentativa recusada. Depois de 4.4: o
   papel de banco leitor não é concedido à credencial que pratica ato, então a separação de papel é
   garantida pelo banco; a separação de **pessoa** (a mesma pessoa portar os dois) é regra de atribuição,
   de `produto`. A projeção também não serve de atalho: listar a trilha no ambiente do cliente é
   operação do `owner`, e dar essa célula a `provider_support` seria a leitura da própria trilha por
   outro caminho.

## 7. As quatro partes de `convention-gravar-a-propria-trilha-nao-e-mutacao`

| Parte | Como a residência sustenta |
|---|---|
| a classe está no relógio da prova | a autoridade só tem prazo de cláusula (`RN-PRV-010`) e, depois da saída, `LACUNA-PRV-006`; nenhum prazo de custo se aplica a ela |
| nenhuma operação nossa apaga, edita, suspende ou encurta | gatilho de imutabilidade dos dois lados; nenhum papel de aplicação com `UPDATE`/`DELETE`. **Suspender** o lado que o cliente vê é impossível sem suspender o acesso: sem projeção confirmada, o banco não entrega linha nem aceita escrita a `prv_t_X` (§5.3, `M1` a `M6`). Suspender a autoridade não é impedido pelo banco, porque nada em `t_X` alcança o `platform`; a conferência acusa (§5.5). Ato sobre objeto do `platform` depende do contrato de ordem, e a conferência o vigia |
| reduzir a janela é ato datado e visível ao cliente antes de valer | a mudança de janela é fato com `declared_at < effective_at`, projetado no schema de cada cliente afetado no instante da declaração. O aviso mínimo é número, e não é meu |
| a janela vigente é declarada, e truncamento aparece como truncamento | a listagem mostra a janela em vigor e o fato de expurgo ("anterior a T, removido"), dos dois lados |

**O que isto não cobre, e fica escrito:** o dono do banco pode desligar o gatilho, remover linhas e
religá-lo. A impressão estrutural acusa gatilho desligado no instante da verificação
(`db/referencia-estrutural-platform.txt`, cabeçalho sobre `habilitacao`), não no intervalo entre duas
verificações. "Operação nossa" nas quatro partes é operação de produto; proteger contra o dono é o
complemento P2 da §15, e vale igual para todas as tabelas append-only do sistema.

**Expurgo** não pode ser `DELETE` (colide com o gatilho e com `migrations.md` §6). A forma da tabela
tem de admitir remoção por faixa de tempo; qual mecanismo, e a aprovação dele, vão com o número de
retenção, pelo humano (`migrations.md` §4).

## 8. A primeira migration de cliente (`F-021`) depende disto?

**Confirmo o "não, hoje".** Três provas:

- criar estabelecimento é só do `owner`, e `provider_support` é `N` na linha
  (`docs/produto/matriz-operacao-papel.md:78`);
- conceder `provider_support` é `?` (`:80`), logo negado, e sem concessão a linha 26 (`:81`) não tem
  quem opere; além disso a concessão não existe enquanto a leitura da trilha não tiver célula
  (`RN-NUC-024` d);
- nenhum papel de escopo `provedor` pratica ato até a quarta fonte de `RN-NUC-029` existir
  (`memory/plataforma/state-pendencias-abertas-2026-08-23.md` §1.2 e §1.3).

**Derrubo a condição como o item a escreve.** O item diz que, se a célula de habilitar terminal for de
papel nosso, "a residência da trilha passa a importar" em `F-021`
(`docs/backlog/F-021-...md`, "Depende de"). Pela linha do objeto adotada na §4, o fato de habilitação
afirma sobre o **terminal do cliente** e mora em `t_X` qualquer que seja o autor. O que muda com autor
nosso é o **campo de autor** desse fato: ele passa a apontar para a autoridade no `platform` (uma
coluna `uuid` anulável, sem chave estrangeira possível) e a nomear a sustentação por uma fonte nova.
Isso não é residência: é `RN-NUC-029` (quarta fonte) e `D-03` E1, e `F-021` já declara a segunda
("o eixo E1 decide onde mora o autor do fato de criação").

**A condição que sobra, e ela é de forma, não de residência:** `F-021` não pode modelar o autor como
chave estrangeira obrigatória para o sujeito do cliente como **única** forma. Se fizer, admitir autor
nosso depois exige tirar `NOT NULL` de um campo que garante "nunca nenhuma fonte"
(`business-rule-registro-de-ato-nomeia-em-que-o-ato-se-sustentou`), que é remover invariante e cai em
`migrations.md` §4. Se o autor nascer na forma da sustentação (fonte de lookup + referência), a quarta
fonte entra por linha de lookup e coluna anulável, que é metadado (`migrations.md` §5).

## 9. As pautas 4.3 e 4.4

**4.3 (o cliente tem direito ao nome da pessoa nossa?)** Padrão até a resposta: a autoridade guarda
papel e identificador estável; a projeção mostra papel e pseudônimo por cliente; o nome não está em
fato nenhum. Isso cumpre o "autor" do aceite de `RN-PRV-011` como distinção entre pessoas, e deixa a
pessoa resolvível por nós numa disputa.

- **Se o advogado disser que o cliente tem direito ao nome:** a residência não muda. A projeção ganha
  coluna anulável (metadado), fatos novos nascem com o nome, e os antigos são preenchidos por processo
  em lotes a partir da autoridade e do registro de pessoa (`migrations.md` §6; é derivação, não fato
  reconstituído). Isso só é possível porque a correspondência pessoa-identificador não se apaga (§5.1).
  O que a resposta precisa cobrir junto: o nome de alguém da nossa equipe passa a sair nas exportações
  de cliente que vai embora.
- **Se disser que nem o pseudônimo:** é a única parte irreversível deste padrão. Pseudônimo já projetado
  saiu com a exportação do cliente e não volta. Fatos novos deixam de carregar a coluna; os antigos
  ficam. O thread deve confirmar este padrão na decisão sabendo disso.

A partição de `T-0004:867` fecha nos dois casos, porque a metade do cliente é derivada da nossa no
instante da gravação e pode carregar o que o cliente tiver direito de ver.

```
> **Indisponível — nome da pessoa nossa na trilha visível ao cliente.** Não funciona: o cliente ver o
> nome de quem, do nosso lado, agiu ou leu no ambiente dele. Falta: saber se o cliente tem direito ao
> nome (`state-pendencias` §4.3). Responde: humano, com o advogado.
> Enquanto isso: o cliente vê o papel e um pseudônimo próprio do ambiente dele. Desde: 2026-09-23.
```

**4.4 (quem do nosso lado lê a trilha do nosso uso, `PRV-09`).** Não é pergunta de modelo. O modelo
entrega o que qualquer resposta precisa: um papel de banco leitor, com `SELECT` só na autoridade,
nunca concedido à credencial que pratica ato, e índice por (pessoa, instante).

```
> **Indisponível — leitura, do nosso lado, da trilha do nosso uso.** Não funciona: qualquer pessoa
> nossa ler os fatos da trilha, inclusive quem praticou o ato. Falta: o leitor nomeado (`PRV-09`,
> `state-pendencias` §4.4). Responde: humano.
> Enquanto isso: nenhum papel recebe leitura da autoridade; toda tentativa é recusada e vira fato de
> tentativa recusada. Desde: 2026-09-23.
```

## 10. Escala: N clientes, e o cliente que sai

- **Nossas perguntas não crescem com N:** "o que P fez" e "o que fizemos em X" são leitura de uma tabela
  por índice. Em S3 seriam `O(schemas)`.
- **Gravação:** um `INSERT` no `platform` e um no schema do cliente por fato, fora do caminho do caixa:
  a projeção é tabela própria, e nenhuma gravação da trilha trava tabela que a venda escreve
  (`dados.md` §3.1).
- **Onde N pesa de verdade:** leitura automática nossa que percorre os N clientes. Se cada rodada
  produzir um fato por cliente e por classe, a trilha cresce `O(N × classes × rodadas)`. Se isso é leitura
  de papel nosso, sujeita a `RN-PRV-011`, é pergunta para `produto` (§15), e é ela que define a ordem de
  grandeza da tabela.
- **O cliente que sai:** a projeção vai com ele; a autoridade fica, e o custo de ficar é linear no número
  de ex-clientes vezes a janela de `LACUNA-PRV-006`.

## 11. As cinco perguntas de `dados.md` §6

1. **Outro ramo, outro fuso.** Nenhum campo da trilha nomeia ramo: classe de objeto e motivo são lookup
   de código estável. Fuso: só instante, nenhum campo de calendário
   (`convention-fato-nao-carrega-campo-de-calendario`).
2. **Consulta cara e índice.** Listagem do cliente: projeção por `occurred_at`, barata. Disputa ou saída:
   autoridade por (cliente, instante). `PRV-09`: autoridade por (pessoa, instante). A cara é a
   conferência da §5.5, `O(clientes × fatos por cliente)`, periódica e fora do caminho. Nada medido.
3. **O que vou querer mudar em 6 meses.** (a) O "quem" da projeção, depois de 4.3: certo hoje porque a
   projeção é derivada e aceita expansão com preenchimento. (b) Classes e motivos: lookup, então
   acrescentar é inserir linha; o risco é o domínio divergir entre a cópia do `platform` e a de cada
   cliente, e a semente por código estável nos dois fluxos é o que segura. (c) O alvo anulável: certo
   porque `RN-PRV-011` f o exige, com `CHECK` por tipo.
4. **Isolamento.** Nenhum caminho novo de sessão de cliente até o `platform` (§5.4), e a credencial do
   caixa não assume papel nosso (`M11`). Caminho novo do nosso lado: gravador só com `INSERT`, que pode
   forjar linha e não pode ler. A superfície nossa não tem o privilégio do caixa: `prv_t_X` só alcança
   tabela com célula, e só com projeção confirmada naquele schema (§5.4). O pseudônimo por cliente evita
   chave de correlação entre schemas, que é o caminho 4 de `T-0004` §9.4. Resíduo: a credencial do
   console é membro dos N `prv_t_X`, e o isolamento entre clientes da superfície nossa é o `USAGE` por
   papel (§5.4).
5. **Cardinalidade em 2 anos.** `ESTIMATIVA`, com parâmetros ilustrativos que não existem em documento
   nenhum: 10 pessoas × 100 fatos/dia × 730 ≈ 7,3 × 10⁵; mais, se a leitura automática gerar fato por
   cliente, 10³ clientes × 5 classes × 1 rodada/dia × 730 ≈ 3,7 × 10⁶. Faixa **10⁶ a 10⁷** na autoridade;
   **10² a 10⁴** por projeção. Até 10⁶, uma tabela e dois índices. Em 10⁷, o expurgo por faixa passa a
   importar. Em 10⁸, partição por tempo vira pré-requisito de migrar; como partição introduzida depois
   em tabela imutável custa cópia inteira, particionar ou não é decisão do nascimento, com `performance`.
   Com partição, o gatilho de comando do pai não protege a partição (F.2, medido); a forma exigida está
   na §16, item 1.

## 12. Checklist de `migrations.md` §10, como compromisso das duas migrations futuras

1. **Forward-only, sem etapa destrutiva:** as duas só criam. O expurgo, quando existir, é item à parte,
   com aprovação do humano.
2. **Duas vezes, vazio e com dado:** `IF NOT EXISTS` e semente por código estável com
   `ON CONFLICT DO NOTHING`, nas duas.
3. **Lock:** tabelas novas, sem dado; `lock_timeout` obrigatório pelo executor. Índice futuro em tabela
   já grande vai por `CONCURRENTLY`, em migration própria. `ENABLE ROW LEVEL SECURITY` e `CREATE POLICY`
   pegam `AccessExclusiveLock` (`M15`): na projeção, que nasce vazia, não custa nada; abrir célula depois
   numa tabela quente é migration própria.
4. **Transacional:** sim, as duas, e na de `tenant` é obrigatório: `CREATE POLICY` não tem
   `IF NOT EXISTS` (`M15`), e a idempotência vem da transação (`db/migrator/CONTRATO.md:419`).
5. **Alvo:** autoridade `platform`; projeção `tenant`; arquivos separados. A de `platform` vem antes, e
   precisa existir assim que houver qualquer superfície nossa, porque a tentativa recusada acontece
   desde o primeiro pedido (`RN-PRV-011`, aceite (ii)).
6. **Backfill:** nenhum no nascimento. Reprojeção e o eventual nome (§9) são processo, fora da DDL.
7. **Quem lê o antigo:** não há antigo. As duas famílias são novas.

## 13. Recomendação e o recusado, nas quatro partes

**Recomendo:** autoridade no `platform` (S1) com projeção derivada no schema do cliente, gravadas na
ordem da §5.3.

| Recusado | Necessidade que ele atende | Por que o mecanismo é ruim | O nosso | Por que é melhor, e como se prova |
|---|---|---|---|---|
| **S1 com o cliente lendo o `platform` por papel dedicado e filtro de cliente** | o cliente listar os nossos atos | o isolamento vira correção de parâmetro: um erro de borda entrega a trilha inteira de Y a X, e a credencial que atende cliente ganha alcance ao `platform` | projeção no schema dele | a listagem roda como `app_t_X`; prova: o papel do cliente Y lendo a projeção de X leva `42501`, no padrão de dois clientes da suíte de `T-0011` |
| **Sessão de cliente com `USAGE` em `platform` e política por linha** | a mesma | quebra a afirmação 2 de `papeis-e-credencial.md` §1, verificada por catálogo, e troca construção por política | projeção | a verificação por catálogo de `forja_app` continua sem exceção; prova: a consulta de `papeis-e-credencial.md` §1 segue sem linha |
| **S2 terceiro schema** | separar controle de operação nossa | muda o universo fechado de schemas, o crivo do carregador e a semântica do ledger para ganhar pouco: o gravador já tem só `INSERT` | `platform` com papel gravador restrito | nenhuma mudança em `RECUSAS.md` nem em `universo-e-declaracao.md`; prova: `verify` sai 0 sem alteração de regra |
| **S3 como autoridade** | o cliente ver o que fizemos, isolado | a prova sai com ele, a recusa sem alvo não tem onde morar, e nossa pergunta vira fan-out | S3 só como projeção | caso 2 da §6: encerrado X, os fatos seguem consultáveis no `platform` |
| **S4 como residência** | trilha que nem o dono do banco consegue apagar | acervo sem decisão de infraestrutura, sem restrição declarativa, com segundo controle de acesso | banco com gatilho, e âncora externa como complemento P2 | restrições e chave estrangeira ficam no banco; a lacuna contra o dono fica declarada (§7) em vez de prometida |
| **S5 com duas autoridades** | cada leitor no lado dele | divergência silenciosa e indetectável | uma autoridade, projeção com a mesma chave, ordem fixa | divergência só num sentido e acusável por comparação de chaves (§5.3, §5.5) |

## 14. Caminho infeliz

A gravação do fato da trilha falha: **o ato ou a leitura nossa não acontece.** É o contrário do que
vale para a venda, onde o registro nunca bloqueia a operação (`CLAUDE.md` §7.10). Aqui o registro é
precondição (`RN-PRV-011` c), e quem transportar o "registro nunca bloqueia" do caixa para a trilha
apaga a prova que ela existe para dar. Falha no passo 2 também impede o ato, e em 3a quem impede é o
banco. Falha no passo 3 depois do 2 deixa na lista do cliente um acesso que não se consumou, e isso é o
lado certo para errar (§5.3). A única classe que se grava sem alvo resolvido é a tentativa recusada,
porque ali não há ato a impedir (`RN-PRV-011` f).

**Não registra, com motivo:** se a leitura do passo 3a devolveu linha. O banco só registraria isso com
uma escrita na transação da leitura, e o `ROLLBACK` a desfaria. O que o cliente precisa saber, que
abrimos acesso àquela classe e quando, já está confirmado antes (passo 2).

## 15. O que fica para quem

- `produto`: a leitura automática nossa que percorre N clientes gera um fato por cliente, e com que
  grão? Decide a cardinalidade (§10).
- `backend`: o contrato do console na §5.3, com os passos 1 a 4, a citação do fato por
  `SET LOCAL forja.provider_fact` no passo 3a, o reenvio com o mesmo id e `23505` na chave primária
  lido como "já gravado", e a transação no `platform` que troca de papel entre ator e gravador (não
  medi essa troca). O "resultado só depois do `COMMIT`" deixou de ser contrato dele para leitura: o
  banco garante.
- `seguranca`: reauditoria curta da §5.3 e da §5.4, com as medidas da §5.6.
- `produto`: a forma do fato de desfecho de ato sobre objeto do `platform` ("aplicado" e "não aplicado"
  com motivo), junto de `RN-PRV-012`.
- `arquiteto-dados` de `F-021`: a condição de forma do campo de autor (§8).
- **P2:** âncora externa de integridade (encadeamento de resumo exportado periodicamente) contra
  remoção pelo dono do banco, para todas as tabelas append-only, não só a trilha.
- **P2:** `.claude/rules/dados.md` §1 ganhar a frase que esta proposta aplica: fato mora com o objeto;
  projeção derivada mora com o leitor.

## 16. Requisitos do item das migrations da trilha

Entraram em 2026-09-23, por direção do thread depois do F.2. Cada um cita o achado de onde veio. As
migrations desta família não nascem sem eles.

1. **Partição (`TRL-03`).** Se a autoridade ou a projeção nascerem particionadas: rejeição `FOR EACH
   ROW` de `UPDATE` e `DELETE` no pai, que é clonada para cada partição; gatilho de `TRUNCATE` em
   **cada** partição, porque esse não é clonado; partições criadas por migration de `platform` e
   listadas pela impressão estrutural, e nunca retiradas dela para acomodar rotação
   ([[gotcha-gatilho-de-comando-nao-protege-particao]]). `DETACH` só como etapa 4 de `migrations.md`
   §4, com o humano. A gramática hoje recusa `PARTITION BY` e `PARTITION OF` pela cauda fechada
   (`db/migrator/RECUSAS.md:135`), então particionar é mudança de contrato. Particionar ou não se
   decide no nascimento, com `performance` (§11.5).
2. **Pergunta invertida do `platform` (`TRL-04`).** Quem alcança `platform` por ACL, e quem é membro,
   por qualquer cadeia de `pg_auth_members`, de papel que alcança. Pergunta-se por
   `pg_has_role(<sujeito>, <papel>, 'SET')` e nunca por `has_schema_privilege` do sujeito
   ([[gotcha-has-schema-privilege-nao-ve-set-role]]). O conjunto esperado é nomeado: o executor, e a
   credencial do console pelo gravador, pelo leitor e, quando existir, pelo ator. A mesma pergunta pega
   `GRANT forja_executor TO app_t_X`, que hoje é ponto cego.
3. **Declaração da credencial do console (`TRL-04`).** Espécie própria, fora de `forja_app` e distinta de
   `app_credential` (`db/universo-e-declaracao.md` §7.5.4), com condição de permanência dela. O
   `provision` passa a conceder papel de cliente a duas credenciais, cada uma ao seu (`app_t_X` à da
   aplicação, `prv_t_X` à do console), e nunca cruzado. O nome da credencial vem de ambiente, como
   `FORJA_MIGRATOR_APP_CREDENTIAL_ROLE`; o nome da chave é do item. O prefixo `prv_` fica reservado
   como o `app_` (`db/papel-do-cliente.md` §7.1), nos dois nomes que o executor conhece.
4. **Perguntas novas do `verify`, que o mecanismo da §5.4 exige.** Todas por catálogo:
   - todo membro de `forja_prv` é `'prv_' || nspname` de um schema de cliente, com
     `inherit_option = t`, fora o executor com `admin_option`; nenhum `app_t_X` e nenhuma credencial é
     membro dele;
   - nenhuma ACL de tabela nomeia `prv_t_X` diretamente, porque é o caminho que abre a leitura sem
     projeção (`M14`);
   - toda tabela com privilégio de `forja_prv` tem `relrowsecurity = t` e política restritiva
     `FOR ALL TO forja_prv`, e a projeção tem as três políticas da §5.4;
   - `forja_prv` não tem privilégio no `platform`, e nenhum papel além do executor tem `BYPASSRLS`;
   - a impressão estrutural passa a carregar `relrowsecurity`, `relforcerowsecurity` e cada política
     (nome, comando, permissiva ou restritiva, papéis, as duas expressões). Hoje ela lista tabela,
     coluna e gatilho e não lista política (`db/migrator/src/structure-print.ts:50-94`), e RLS desligado
     ou política apagada pelo dono abre a leitura sem projeção sem nada acusar.
5. **Contrato do carregador (`RECUSAS.md` §11.2).** Três formas fechadas, só em migration de `tenant`:
   a ação `ENABLE ROW LEVEL SECURITY` de `ALTER TABLE`; `CREATE POLICY <nome> ON <tabela> AS
   {PERMISSIVE|RESTRICTIVE} FOR <comando> TO {PUBLIC|forja_prv} [USING ( … )] [WITH CHECK ( … )]`, com
   interior declarado e não enumerado, como o da view; e `GRANT <privilégio> [( <colunas> )] ON <tabela>
   TO forja_prv`, com o favorecido fixo e sem `WITH GRANT OPTION`. Mais uma recusa de arquivo: `GRANT`
   a `forja_prv` sobre tabela que não recebe, no mesmo arquivo, o RLS e as políticas. `DISABLE`,
   `NO FORCE`, `ALTER POLICY` e `DROP POLICY` seguem recusados pela cauda fechada. A política escreve
   nome sem qualificador, resolvido no `search_path` que o executor fixa e gravado no catálogo pela
   referência ao objeto, como o corpo da view (§11.3). **A medir no item:** medi com nome qualificado, e
   a forma sem qualificador não foi medida.
6. **Leitor do console no `platform` (`TRL-05`).** Papel separado do gravador, com `SELECT` só em
   `tenants` (resolução por chave, nunca por lista:
   [[gotcha-nenhuma-superficie-nossa-enumera-clientes-para-escolher]]), no inventário e no pseudônimo, e
   nunca na autoridade. O gravador continua só com `INSERT`, por coluna, sem `received_at` e sem
   `RETURNING` (F.2 A7, A9), e grava com `INSERT` simples ([[gotcha-on-conflict-com-alvo-exige-select]]).
   Resíduo declarado: quem tem o leitor lê a tabela de pseudônimo inteira. O cliente nunca vê essa
   correspondência, e o leitor é nosso. Gravador, leitor e ator nascem fora de migration, porque a
   gramática não tem `CREATE ROLE` nem `GRANT` sobre o `platform` (`RECUSAS.md:184`), e nenhum deles
   carrega segredo; se é ato do operador ou do executor, pelo corte de `db/papel-do-cliente.md` §7.1,
   o item decide.
7. **Pseudônimo v4 (`TRL-06`).** 122 bits aleatórios (`gen_random_uuid()`), declarado no cabeçalho da
   migration como exceção a `D-04`, porque não é chave de fato. Nunca pelo gerador de
   `db/migrator/src/uuid-v7.ts`, e nunca derivado por resumo sem chave.
8. **A conferência (F.2 §3.3).** Item próprio, com gate de `seguranca`, agendado **antes** do primeiro
   ato ou leitura de papel nosso em produção. Não é o executor em agendador. Lê só chave: `fact_id` e
   `tenant_id` na autoridade, `fact_id` em cada projeção. A saída tem a classificação de
   `docs/auditorias/**`, porque nomeia cliente. Aplica a regra da §5.5.
9. **Autor sem pessoa (F.2 §5).** A leitura automática sobre N clientes tem autor sem pessoa. O `CHECK`
   que amarra o "quem" ao tipo do fato admite esse autor por valor declarado, nunca por nulo genérico.
10. **Ator de `platform` (`TRL-02`).** Nasce com a primeira célula de ato sobre objeto do `platform`, com
    gate próprio, e com o fato de desfecho escrito por `produto`.

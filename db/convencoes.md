# Convenções do banco — `D-04`

> **Status: VIGENTE.** `D-04` foi fechada pelo humano em 2026-09-11, e o que está escrito aqui é a
> convenção que vale para todo DDL deste repositório. A §9 não é de `D-04`: ela fixa o piso de versão
> do servidor, e mora aqui por ser a página que quem escreve DDL abre. O fechamento, com o que foi decidido linha a
> linha, está na §8. O que vem antes dela é a análise que sustentou a escolha, preservada como estava
> — inclusive as saídas recusadas, que são o registro de por que a escolha é esta.
> Autor: `arquiteto-dados` · T-0009 passos 2 e 4 · 2026-09-11. As §10 e §11 não são de `D-04`: entraram em
> 2026-09-23 (T-0022), com a primeira migration de cliente.

## 0. O que esta proposta decide e o que ela não toca

Decide três coisas, e só três: **forma da chave primária**, **conjunto de timestamps** e **exclusão
lógica**.

Fica de fora, por recorte do plano ou por ser de outro dono:

| Fora | Onde mora |
|---|---|
| Tipo do dinheiro (centavos inteiros × `numeric(14,2)`) | `SPR-40`, metade DDL. **Decidido em 2026-09-23: §10** |
| Escala da quantidade por unidade de medida | `SPR-40`. **Decidido em 2026-09-23: §10** |
| Fuso, e a quem ele pertence | **Decidido em 2026-09-23** (`RN-NUC-057`): é do **estabelecimento**, membro da configuração publicada dele com versão e vigência, identificado pela região. Não existe fuso do cliente (tenant). Coluna: `establishment_configurations.establishment_time_zone` (`tenant/0005`) |
| Mecanismo de faixa pré-alocada de referência humana | `G-01` / `SPR-37`, `RN-OFF-006` |
| Qualquer tabela da família de fatos, e o schema `platform` | passo 7 desta mesma ficha |

## 1. Entradas obrigatórias

A decisão não é livre. Quatro coisas já estão fixadas e a proposta tem que caber nelas.

**`RN-OFF-013`** (`docs/produto/operacao-offline-e-sincronizacao.md:204`): toda operação enfileirável
nasce com identidade de idempotência **cunhada no terminal**, no instante do fato, sem consultar
servidor. Reenviar com a mesma identidade devolve o mesmo resultado. Colisão de duas operações
distintas é defeito **crítico** de construção: detectada, a segunda recusada e escalada, nunca fundida.

**`RN-NUC-003`** (`docs/produto/nucleo-venda.md:136`): a venda nasce com **duas** identidades
distintas. A de idempotência, acima, e uma **referência humana** consumida de faixa pré-alocada, única
no escopo do estabelecimento, que o cliente-final traz de volta ao balcão. A consequência para `D-04` é
direta: a legibilidade por pessoa já tem dono, e não é a chave primária.

**`RN-NUC-038`** (`docs/produto/nucleo-venda.md:293`): nenhum objeto é resolvido pelo identificador que
o pedido informa. O identificador é entrada de busca **dentro** do escopo resolvido da identidade
autenticada. Uma chave globalmente única não autoriza ninguém a usá-la como endereço.

**`dados.md` §4 e `PN-07`**: o que é fiscal ou financeiro é append-only. Cancelamento e devolução são
linhas novas.

E a convenção de plataforma já registrada em
`memory/plataforma/convention-fato-nao-carrega-campo-de-calendario.md`: fato carrega **só instante**, e
**dois** (o declarado pelo terminal e o de recepção no servidor), porque data de negócio depende de um
fuso cujo dono está indecidido.

## 2. Chave primária

### 2.1 Os candidatos

| # | Candidato | Cunha no terminal, offline? |
|---|---|---|
| K1 | `uuid` aleatório (v4) | sim |
| K2 | `uuid` com prefixo temporal de 48 bits (v7 / ULID guardado como `uuid`) | sim |
| K3 | `bigint` sequencial do servidor | **não** |
| K4 | `text` de 26 caracteres, ordenado por tempo (ULID guardado como texto) | sim |
| K5 | composto `(terminal_id uuid, local_sequence bigint)` | sim |

K3 falha a entrada obrigatória mais forte. Uma sequência do servidor não existe no terminal sem rede, e
fazê-la existir exige faixa pré-alocada por terminal, que é `G-01` e está fora desta decisão. Ele
permanece na tabela porque é o piso de custo contra o qual os outros são medidos.

### 2.2 A medida

Postgres 16.15 em container, `shared_buffers=128MB`, `max_wal_size=4GB`, máquina de desenvolvimento.
2.000.000 de linhas por candidato, inseridas por um único `INSERT ... SELECT generate_series`. Uma
execução, sem repetição. **O que vale aqui é a ordem entre os candidatos, não o valor absoluto**: o
hardware não é o de produção e o caso de inserção linha a linha do PDV real não foi reproduzido.

Carga inicial, 2M linhas:

| Candidato | Inserção (ms) | WAL | Tabela | Índice da PK | Bytes por linha no índice |
|---|---:|---:|---:|---:|---:|
| K3 `bigint` sequencial | 7.173,6 | 260 MB | 84 MB | 43 MB | 22,5 |
| K2 `uuid` ordenado | 13.929,9 | 293 MB | 100 MB | 60 MB | 31,6 |
| K1 `uuid` aleatório | 17.378,2 | 322 MB | 100 MB | 76 MB | 39,8 |
| K4 `text` de 26 | 17.399,6 | 344 MB | 115 MB | 95 MB | 49,7 |
| K5 composto | 13.590,5 | 384 MB | 115 MB | 138 MB | 72,6 |

Regime permanente: mais 200.000 linhas sobre o índice já com 2M:

| Candidato | Inserção (ms) | WAL | Crescimento do índice |
|---|---:|---:|---:|
| K3 `bigint` | 713,7 | 25 MB | 4.384 kB |
| K2 `uuid` ordenado | 1.238,4 | 26 MB | 6.160 kB |
| K4 `text` de 26 | 1.820,5 | 31 MB | 9.704 kB |
| K1 `uuid` aleatório | 1.842,3 | 28 MB | 6.808 kB |

Terceira medida, usada na §5: índice btree de um `timestamptz`, construído em bloco sobre 2,2M linhas,
ocupa **47 MB**, 22,5 bytes por linha.

### 2.3 O que cada número quer dizer

**Tamanho do índice.** `uuid` são 16 bytes de valor; `bigint`, 8; o texto de 26 caracteres, 27. A
diferença medida entre K1 e K2 (76 MB contra 60 MB) é maior que a diferença de valor, porque não é só
o valor: inserção aleatória divide páginas ao meio e deixa metade vazia. K2 guarda o mesmo número de
bytes que K1 e ocupa 21% menos, só por chegar em ordem.

**Ordenação física e inserção.** É onde a escolha dói e é o que a segunda tabela mostra. Chave
aleatória escreve em posição arbitrária de um índice que não cabe em memória, então cada inserção
tende a uma leitura de disco. K1 custou 2,6 vezes K3 no regime permanente; K2 custou 1,7 vez. O efeito
cresce com o tamanho do índice, ou seja, com a idade do cliente.

**Legibilidade em log e em suporte.** Nenhuma das cinco é boa, e `RN-NUC-003` já resolveu o problema
em outro lugar: quem liga para o suporte diz a **referência humana**, não a chave. O que a chave
precisa é ser copiável sem ambiguidade, e `uuid` em forma canônica é. K4 ganharia em compacidade
visual e perde 58% a mais de índice por isso.

**Dois terminais offline cunhando ao mesmo tempo.** É o caso que mata K3 e K5.
K1 e K2 não coordenam: 122 bits aleatórios em K1, 74 em K2 (RFC 9562), e a probabilidade de dois
terminais produzirem o mesmo valor no mesmo milissegundo é desprezível. Nos dois casos a colisão que
`RN-OFF-013` manda detectar é uma violação de unicidade da própria chave primária, verificada pelo
banco, sem código nenhum.
K5 nunca colide, mas paga por isso com a chave mais cara de todas (72,6 bytes por linha), duplica toda
chave estrangeira do modelo, e **mente quando a fila é transferida**: `RN-OFF-016` e `RN-OFF-026`
permitem transferir pendência entre terminais, e a chave continuaria nomeando o terminal de origem
como se fosse endereço.

### 2.4 Recomendação

**Recomendação (minha, não decisão): `uuid` como tipo da chave primária de toda tabela, gerado na
borda que cria a linha, com a regra de geração ordenada por tempo (K2) onde a linha nasce no terminal
ou a tabela cresce.**

O argumento que sustenta a recomendação não é o desempenho, é **o que fica reversível**. O tipo da
coluna é o que não se muda sem o ciclo expand/contract em N schemas. A regra de geração não é coluna:
trocar v4 por v7, ou por ULID, ou por qualquer esquema de 128 bits, é mudança de código e não toca o
banco. Escolher `uuid` compra o direito de errar a geração e corrigir barato. Escolher `bigint` ou
`text` não compra.

Duas consequências que vão junto com a recomendação:

1. **A identidade de idempotência de `RN-OFF-013` é a própria chave primária da linha**, não uma coluna
separada ao lado de uma chave substituta. Três razões: `RN-NUC-003` já a trata como identidade da
venda; duas colunas únicas criam a janela em que a mesma operação existe duas vezes sob chaves
diferentes; e a detecção de colisão que `RN-OFF-013` exige passa a ser a violação de unicidade da PK.
2. **Chave única globalmente não é endereço.** `RN-NUC-038` continua valendo inteiro: toda resolução é
escopada antes, nunca conferida depois. Isto entra como regra escrita porque `uuid` produz exatamente
a ilusão contrária.

### 2.5 O que se perde em cada saída

Para o humano responder em uma linha.

| Se a escolha for | Ganha | Perde |
|---|---|---|
| **K2 `uuid` ordenado** (recomendado) | menor índice entre os que cunham offline, inserção 1,7× o piso, tipo reversível | o instante de criação fica legível dentro da chave para quem a vê |
| **K1 `uuid` aleatório** | não vaza instante nenhum; mesma coluna de K2, então a troca depois é só código | índice 27% maior e inserção 2,6× o piso, com o custo crescendo junto com a idade do cliente |
| **K4 `text` de 26** | identificador visualmente mais curto de ler e ditar | 58% a mais de índice que K2, tabela maior, e a mesma informação cabia em 16 bytes |
| **K5 composto** | colisão impossível por construção, sem depender de aleatoriedade | a chave mais cara medida, toda FK vira duas colunas, e a chave passa a mentir quando a fila é transferida |
| **K3 `bigint`** | o piso de custo em tudo | **inadmissível**: contradiz `RN-OFF-013`, e só volta a existir se a faixa pré-alocada de `G-01` virar precondição de qualquer escrita |

## 3. Conjunto de timestamps

`dados.md` §3 pede `created_at` e `updated_at` em toda tabela. A proposta é **manter a exigência para
cadastro e abrir exceção declarada para fato**, porque a família de fatos já tem um par de instantes
fixado por `memory/plataforma/convention-fato-nao-carrega-campo-de-calendario.md` e `updated_at` numa
tabela append-only é uma coluna que nunca muda de valor.

| Família | Instantes | Por quê |
|---|---|---|
| **Fato** (venda, pagamento, movimento de caixa, documento fiscal, trilha, fato de operação) | `occurred_at` e `received_at`, os dois `timestamptz NOT NULL` | os dois instantes de `RN-OFF-013` e da convenção: o declarado pelo terminal e o de recepção no servidor. Nascem juntos ou nenhum nasce. Nada de `updated_at`: a linha nunca é atualizada, e a coluna existiria só para convidar código a atualizá-la |
| **Cadastro e configuração** (catálogo, preço, terminal, operador, registro do `platform`) | `created_at` e `updated_at`, os dois `timestamptz NOT NULL DEFAULT now()` | a linha é editável, então "desde quando este valor é este" é pergunta real de suporte |
| **Ledger e registro de processo** | os instantes próprios do processo (`started_at`, `applied_at`) | `applied_at` já é o instante de criação; um `created_at` ao lado seria um segundo nome para a mesma coisa |

Todos em **UTC**, `timestamptz`, nunca `timestamp` sem fuso, nunca `date`. Nenhum campo de calendário
derivado, em nenhuma família.

**Sub-decisão que vai junto, e é do humano:** quem mantém `updated_at`. Com `D-01` metade aberta e ORM
descartado para este artefato, a única casa onde ela não é esquecida é um gatilho genérico, criado por
migration de núcleo e pendurado em toda tabela de cadastro. Gatilho carregando **regra de negócio**
exige `decision` (`backend.md`), e `updated_at` não é regra de negócio, é escrituração. Recomendo o
gatilho. A alternativa é a aplicação escrever a coluna, com o risco de a primeira rota que esquecer
produzir uma linha que mente sobre a própria idade.

## 4. Exclusão lógica

A pergunta do brief: o append-only vale para todas as entidades ou só para a família fiscal e
financeira, e o que decide as outras.

**Proposta: nenhuma tabela do núcleo tem coluna de exclusão lógica.** Nem `deleted_at`, nem
`is_deleted`, nem `is_active`. A razão muda de família para família, e é isso que responde "o que
decide as outras".

**Família fiscal e financeira.** Já está decidido fora daqui: `dados.md` §4 e `PN-07`. Não se edita, não
se apaga, e soft delete não vale. Nada a propor.

**Família de cadastro.** Aqui a recusa é minha e vai com as quatro partes que `00-nucleo.md` §12 exige.

1. **A necessidade, que é legítima e não se recusa:** tirar de circulação o que não se vende mais, sem
   perder o histórico. O item saiu de linha, o meio de pagamento foi descontinuado, o terminal foi
   descomissionado. Quem opera precisa que aquilo pare de aparecer na tela de venda, e quem consulta
   uma venda de seis meses atrás precisa que aquilo continue existindo.
2. **O mecanismo recusado e por que é ruim:** a coluna de exclusão lógica. Ela responde "isto está
   fora" com um bit, e não responde **desde quando**, **por quem** nem **por quê**. Ela obriga toda
   consulta do sistema a lembrar de um filtro, e o esquecimento não falha: entrega um item extinto na
   tela do caixa, o que aparece como defeito de produto e não como defeito de consulta. E ela duplica
   `effective_period`, que o glossário já tem (`glossario.md:61`) para dizer em que janela um preço ou
   uma regra vale.
3. **O mecanismo proposto:** **vigência declarada** no que sai de circulação, e **fato de mudança de
   estado** onde o negócio precisa de autor e motivo. O mesmo caminho que `operacao-do-provedor-alcance.md:25`
   já fixou para módulo: ativar e desativar é fato, linha nova, nunca edição de estado.
4. **Por que o proposto é melhor, e como se prova:** ele responde as três perguntas que o bit não
   responde, usa o mecanismo que o catálogo já usa para preço, e converte um filtro esquecível numa
   comparação de instante que o índice serve. A prova é um caso concreto: um item retirado em
   2026-03-01 e uma venda de 2026-02-10. Com vigência, a venda de fevereiro continua exibindo o item,
   a tela de venda de março não o oferece, e "desde quando ele saiu" tem resposta. Com `deleted_at`, a
   segunda pergunta tem resposta e a primeira depende de a consulta ter lembrado do filtro.

**Duas ressalvas honestas.** A primeira: estender `effective_period` do preço para o item de catálogo é
**inferência minha**, o glossário fala de preço e de regra. Confirmação é de `produto`, e está nas
perguntas do relatório. A segunda: descarte por obrigação de retenção
(`memory/plataforma/convention-retencao-tem-tres-relogios.md`,
`docs/produto/fatos-de-operacao-retencao-e-descarte.md`) apaga **conteúdo**, não linha, e não é
exclusão lógica. Ele fica fora desta proposta e tem dono próprio.

## 5. As cinco perguntas de `dados.md` §6, sobre esta convenção

**1. Sobrevive a outro ramo e a outro fuso?** Ramo: `uuid` e instante não carregam vocabulário de
vertical, nada aqui tem palavra de ramo. Fuso: é o ponto forte da proposta. Nenhum campo de calendário
nasce, então `LACUNA-OFF-006` (o conflito entre fuso do estabelecimento e fuso do cliente) pode fechar
para qualquer lado sem backfill. A ressalva verdadeira está na §4: vigência compara instantes em UTC, e
"vale a partir de amanhã" precisa de um fuso para ser **escrita**. Isso é trabalho de borda, não coluna,
e continua aberto com o resto de `LACUNA-GLO-001`.

**2. Que consulta fica cara, e qual índice ela pede?** "As vendas de hoje", "deste turno", "deste
operador". Sem campo de calendário, toda janela vira comparação de intervalo sobre `occurred_at`, o que
pede um btree de `timestamptz` em cada tabela quente. Medido: **47 MB para 2,2M linhas, 22,5 bytes por
linha**, construído em bloco. Com K2 uma parte dessas janelas sai pela própria PK, porque o prefixo
temporal ordena o índice primário; com K1 não sai, e o índice de `occurred_at` passa a ser obrigatório
em vez de conveniente. Não medi o custo de manutenção desse índice secundário sob inserção.

**3. Que coluna eu vou querer mudar em 6 meses?** A regra de geração do `uuid`, se a medida em
produção contradisser a de bancada; e o par de instantes do fato, se aparecer a necessidade de um
terceiro (o de saída da fila). A primeira não é mudança de coluna, é mudança de código, e é
exatamente por isso que a recomendação é pelo tipo e não pelo algoritmo. A segunda é `ADD COLUMN`
nullable, que `migrations.md` §5 classifica como barato.

**4. Existe caminho em que uma consulta veja dado de outro cliente?** Não por esta convenção: a chave
não carrega tenant e o isolamento continua sendo o schema. O que a convenção **cria** é um risco de
leitura: `uuid` globalmente único faz parecer seguro resolver um objeto só pela chave, e é precisamente
o que `RN-NUC-038` proíbe. Por isso a regra da §2.4, item 2, é texto normativo e não observação. Nota
que vem de `memory/plataforma/decision-tenancy-schema-por-cliente.md`: chave de cache, de fila, de log
e de exportação carrega cliente **e** estabelecimento; unicidade global da PK não dispensa nenhum dos
dois.

**5. Cardinalidade em 2 anos?** **Não tenho o número de vendas por dia por estabelecimento**, e ele não
está em `docs/produto/**`. Sem essa entrada, qualquer número meu seria palpite, então declaro as faixas
e o que muda em cada uma, e a entrada fica como pergunta ao humano.

| Faixa de linhas na tabela quente | O que muda |
|---|---|
| até ~10⁵ | nada. As cinco chaves servem, a diferença medida é ruído no uso real |
| ~10⁶ a 10⁷ | é a faixa da medida acima. A diferença entre K1 e K2 aparece como custo de inserção e tamanho de índice, e o índice deixa de caber confortavelmente em memória |
| ~10⁸ a 10⁹ | particionamento por intervalo de `occurred_at` entra na mesa, e chave ordenada por tempo passa de conveniência a pré-requisito prático, porque particionar por uma chave aleatória não agrupa nada |

## 6. O que a escolha não fecha

- Nome canônico dos dois instantes do fato (`occurred_at` e `received_at` é proposta minha; o glossário
  é de `produto`).
- Se `effective_period` vale para item de catálogo, e não só para preço e regra.
- Quem mantém `updated_at` (§3).
- Se a identidade de idempotência e o `idempotency_key` do glossário (`glossario.md:108`) são o mesmo
  objeto quando o chamador é o nosso terminal.

## 7. Como a escolha é registrada

Fechada por uma linha do humano, e o fechamento produz, na mesma passada: um registro `decision` em
`memory/plataforma/`, a linha de `D-04` no `CLAUDE.md` §8 virando `FECHADA`, e este arquivo perdendo o
aviso de proposta do topo.

## 8. O fechamento — 2026-09-11

`D-04` foi decidida pelo humano nesta data, nas quatro linhas abaixo. Elas são a convenção vigente; a
proposta que as precede vira histórico no instante em que esta seção existe.

1. **Chave primária: `uuid`, com geração ordenada por tempo** (K2 da §2.4), em toda tabela, gerado na
   borda que cria a linha. As duas consequências da §2.4 entram junto, como regra e não como
   observação: a identidade de idempotência de `RN-OFF-013` **é** a própria chave primária da linha,
   e chave única globalmente **não é endereço** — `RN-NUC-038` continua inteiro, toda resolução é
   escopada antes e nunca conferida depois.
2. **Timestamps: a tabela por família da §3**, com a exceção declarada. Fato leva `occurred_at` e
   `received_at`, os dois `timestamptz NOT NULL`, e **nenhum** `updated_at`. Cadastro e configuração
   levam `created_at` e `updated_at`. Ledger e registro de processo levam os instantes próprios do
   processo (`applied_at`, `started_at`), sem `created_at` redundante.
3. **Exclusão lógica: nenhuma coluna no núcleo.** Nem `deleted_at`, nem `is_deleted`, nem
   `is_active`. A necessidade que a §4 nomeia é atendida por vigência declarada mais fato de mudança
   de estado.
4. **`updated_at` é mantido por gatilho genérico no banco**, criado por migration de núcleo e
   pendurado em toda tabela de cadastro. Escrituração não é regra de negócio, e essa é a única casa
   onde a coluna não é esquecida.

**O que o fechamento destrava, e o que ele ainda não resolve.** Destravou o DDL do ledger
(`db/migrations/platform/0000__ledger.sql`), que dependia só do item 2. O gatilho do item 4 **ainda
não existe**: ele é migration de núcleo e a primeira tabela de cadastro ainda não foi escrita, então
ele nasce junto dela, não antes. A §6 continua aberta inteira — nenhum dos quatro itens de lá foi
tocado por este fechamento.

## 9. Piso de versão do PostgreSQL — **16**

Não é de `D-04`. Entrou em 2026-09-11, no terceiro gate de `seguranca`, que apontou o piso como não
escrito em lugar nenhum enquanto três coisas já dependiam dele.

**O banco é PostgreSQL 16 ou mais novo.** Escrever DDL, contrato ou consulta que exija mais que isso é
decisão registrada, não escolha de quem está escrevendo. O piso deixou de valer só no papel em
2026-09-11: o executor lê `server_version_num` ao abrir a conexão de controle e recusa iniciar abaixo
dele (`db/migrator/APLICACAO-E-ALVO.md` §6).

**Subiu de 15 para 16 em 2026-09-11**, por decisão do thread principal, e o gatilho que o
`arquiteto-dados` tinha escrito para "algum dia" foi puxado para agora por uma medida dele mesmo: em
**15.19**, o executor com `CREATEROLE` **trocou a senha da credencial da aplicação e se tornou membro
dela**. Em **16.15** os dois atos são recusados pelo servidor.

O motivo de subir agora em vez de deixar no gatilho: não existe cliente em produção, então a mudança
custa uma linha e zero migração, enquanto a janela é real e some sozinha. A regra do projeto é que o
que o banco **impõe** vence o que alguém precisa lembrar
([[convention-o-que-o-banco-impoe-vence-o-que-alguem-lembra]]) — e em 16 o banco impõe.

**Se isso custar caro em operação** (servidor de produção preso em 15, hospedagem que não oferece 16),
a volta para 15 deixou de ser uma linha: desde 2026-09-11 o ato que cria o papel do cliente emite
`GRANT … WITH INHERIT FALSE, SET TRUE` (`db/papel-do-cliente.md` §7.3), e 15.19 recusa essa sintaxe com
`syntax error at or near "INHERIT"` — medido. Voltar exige, então, outra forma de garantir que a
credencial não herda o papel do cliente, mais compensação escrita para o `CREATEROLE` do executor. A
decisão continua sendo do humano e está declarada aqui para ser derrubada com o custo à vista, não para
ser descoberta.

Quem fixava o 15 era a **view com `security_invoker`**, que `db/migrator/RECUSAS.md` §11.2 torna
obrigatória em toda view de migration: sem ela, uma view no schema de um cliente empresta ao selecionar
o alcance de quem a criou, que é o executor. Medido em 2026-09-11:

| Versão | `CREATE OR REPLACE TRIGGER` | View com `security_invoker` |
|---|---|---|
| 14.24 | aceita | **`ERROR: unrecognized parameter "security_invoker"`** |
| 15.19 | aceita | aceita |
| 16.15 | aceita | aceita |

O `CREATE OR REPLACE TRIGGER` das migrations `0002` a `0005` pede 14, e por isso **não** é ele que
manda: em 14 o conjunto aplicaria e a primeira view de cliente é que quebraria, que é o pior lugar para
descobrir um piso.

**O que fixa o piso trocou de sujeito, e a tabela acima não mostra isso.** Quem pedia 15 era a view;
quem pede 16 é o `CREATEROLE` do executor, que existe desde 2026-09-11 porque criar o papel de banco do
cliente é passo do `provision` (`db/papel-do-cliente.md` §7.6). A view **continua** exigindo 15 e
deixou de mandar — 15 atende a view e não atende o `CREATEROLE`. Quem ler só a tabela conclui 15 e
baixa o piso sem ver o que quebrou, porque a tabela responde a pergunta de ontem (em que versão a view
passou a existir), não a de hoje (em que versão `CREATEROLE` para de alcançar papel alheio). O gatilho
que estava escrito aqui para "algum dia" foi consumido: ele era o primeiro papel fora dos três da
`db/papel-do-cliente.md` §7.1, e a medida em 15.19 tornou a espera sem motivo.

Medido junto, e serve de referência para o dia da troca: a impressão de estrutura de
`CONTRATO.md` §13.3 sai **idêntica byte a byte** em 15.19 e 16.15 para a mesma DDL, `md5` de função
incluído. O risco declarado em `db/referencia-estrutural-platform.txt` — versão maior mudando a
formatação que entra no `md5` — existe e não se realizou nesta faixa. Ele volta a ser pergunta aberta
em cada troca de versão maior, e a resposta é regenerar o arquivo na mesma mudança.

## 10. Dinheiro e quantidade: `numeric` sob domínio de envelope

Decisão: `memory/plataforma/decision-dinheiro-e-quantidade.md` (T-0018). DDL: `tenant/0001__value_domains.sql`.

| Domínio | Base | Envelope (`CHECK`) | Para |
|---|---|---|---|
| `money_amount` | `numeric` | `min_scale(VALUE) <= 2 AND abs(VALUE) < 1e12` | valor e total, em unidade maior da moeda |
| `unit_price` | `numeric` | `min_scale(VALUE) <= 3 AND abs(VALUE) < 1e12` | preço unitário (combustível e granel usam 3 casas) |
| `quantity_value` | `numeric` | `min_scale(VALUE) <= 3 AND abs(VALUE) < 1e11` | quantidade; a casa efetiva por unidade de medida é dado publicado, com `CHECK` na tabela de item |

- **Toda coluna de valor, preço ou quantidade usa um destes três**, nunca `numeric(p,s)`: o modificador arredonda antes
  do `CHECK` e o banco decide o centavo. Nunca `float`, `real` ou `double`. O envelope usa `min_scale()`, nunca `scale()`.
- **Casa a mais é recusada, nunca arredondada.** O arredondamento é regra de negócio, versionada (`G-09`).
- **A moeda não mora ao lado do valor.** É da configuração publicada do estabelecimento (`RN-NUC-058`); o cabeçalho do fato
  que carrega valor congela a moeda, ou a versão da configuração que a tinha.
- **Afrouxar um envelope é trocar a restrição do domínio**, em N schemas, pelo ciclo de `migrations.md` §4: remover a
  restrição antiga é passo com aval do humano. Apertar exige conferir o dado antes.
- `CREATE DOMAIN` não tem `IF NOT EXISTS`, e a guarda é a transação (`db/migrator/CONTRATO.md` §17.2, forma 3; a forma
  permitida está em `RECUSAS.md` §11.2). A impressão de estrutura do `verify` carrega o domínio e a restrição dele (§13.3).

## 11. O autor de um ato: a forma de `RN-NUC-029`

O autor de um fato humano não é uma chave para o sujeito: é o operador **mais em que o ato se sustentou**, uma de três
fontes e nunca nenhuma. Seis colunas, com os mesmos nomes em toda tabela de fato do núcleo:

| Coluna | Conteúdo |
|---|---|
| `author_operator_id` | o sujeito (operador). Chave estrangeira nasce com a tabela dele (`SPR-37`) |
| `author_role_code` | papel no instante do ato (→ `roles`). **Nulo só com a terceira fonte**: identificar não prova papel (`RN-OFF-032`) |
| `support_source_code` | a fonte (→ `act_support_sources`): `assignment`, `concession`, `retained_identification_and_terminal_enablement` |
| `support_assignment_id` · `support_concession_id` · `support_enablement_fact_id` | a referência, **uma por fonte**, preenchida se e só se a fonte for a dela |

Um `CHECK` por coluna de referência, na forma `(support_source_code = '<fonte>') = (<coluna> IS NOT NULL)`. É isso que
permite a quarta fonte (ato nosso, `docs/arquitetura/d-06-trilha-residencia-2026-09-23.md` §8) entrar como linha nova
em `act_support_sources` mais coluna anulável e `CHECK` novo, na mesma migration, **sem afrouxar nem remover** restrição
nenhuma: `CHECK` que enumerasse as fontes teria que ser trocado. Onde o fato pode não ter autor humano (renovação da
habilitação, revogação pelo encerramento), as seis são nulas juntas, e a comparação usa `IS NOT DISTINCT FROM`.

# Papel de banco e credencial

> Convenção de `db/`, fixada em 2026-09-11 na correção do gate de `seguranca` (`MIG-06`, `MIG-07`,
> `MIG-08` de `docs/auditorias/2026-09-11-executor-e-schema-platform.md`), com autorização do humano
> para decidir agora, sem esperar `D-03`.
> Revisto em 2026-09-11, na reauditoria (`MIG-14`): a premissa de auditabilidade era mais forte que o
> que o catálogo entrega, e o `MIG-09` acrescentou a §5, sobre o privilégio do executor no registro.
> Revisto de novo em 2026-09-11, no terceiro gate: o `REVOKE` da §5 não tinha verificação nenhuma, e
> com ele as três camadas que protegem `platform.tenants` eram inverificáveis por automação. Duas
> deixaram de ser.
> Revisto no quarto gate, em 2026-09-11: a §6 nasceu. O gate perguntou se o crivo do carregador está
> no lugar certo, depois de ele cair três vezes seguidas, e a resposta tem uma perna aqui — a que
> fecha o interior que nenhum texto fecha.
> Revisto pela quinta vez em 2026-09-11: o humano fechou o arranjo de papel e decidiu que o ato que
> cria o papel é **passo do `provision`**, não script nem runbook. A §3 perdeu as duas perguntas que
> moravam nela, a §6.2 virou decisão fechada, e a §7 nasceu com o ato, a verificação dele e o preço
> do `CREATEROLE`.
> Autor: `arquiteto-dados` · T-0009.

## 0. Por que isto não espera `D-03`

`D-03` decide três eixos: onde mora o sujeito, como ele prova quem é, e como o cliente chega na borda.
Nenhum deles é sobre **papel de banco**. Papel de banco é o que o Postgres autentica e autoriza, e a
pergunta aqui é outra: com qual deles o executor conecta, e com qual a aplicação conecta. As duas
afirmações abaixo valem qualquer que seja a resposta de `D-03`, e nenhuma delas antecipa parte dela.

O custo de não decidir era conhecido e imediato: o passo seguinte desta tarefa precisa de uma string de
conexão para rodar o primeiro teste, e o caminho de menor resistência de quem implementa é usar a mesma
credencial em tudo. Nenhuma linha de código precisaria estar errada para o isolamento por schema virar
decoração.

## 1. As duas afirmações

**1. O papel que roda o executor não é o papel que a aplicação usa.** O executor cria os schemas, logo
é dono deles, e dono de schema lê e escreve em tudo que há dentro. Se o processo que atende cliente
usar essa credencial, o isolamento por schema deixa de existir — sem defeito de código, sem sintoma, e
sem nada para auditar depois.

**2. Nenhum papel de aplicação recebe `USAGE` em `platform`.** O schema de controle guarda o registro
de clientes e o livro-razão, que juntos são a carteira inteira. Processo que atende um cliente não tem
pergunta legítima a fazer ao `platform` por conexão direta: o que ele precisa saber sobre módulos
ativos chega pela borda, resolvido antes da consulta.

**A premissa que torna as duas auditáveis**, e é ela que precisa sobreviver a esta página: o que separa
um papel do outro é **privilégio no banco**, não disciplina de código. Convenção que só se verifica
lendo código não é convenção, é intenção.

**Até onde o catálogo prova isso, e onde ele para.** A primeira redação desta seção dizia que a
verificação é uma consulta ao catálogo e "dá a mesma resposta sem ler uma linha da aplicação". O gate
mediu e a frase estava errada na metade que importa (`MIG-14`):

| Pergunta | O catálogo responde? | Como |
|---|---|---|
| quem é dono de cada schema | **sim** | `pg_namespace.nspowner` |
| que papéis têm `USAGE` em `platform` | **sim** | `has_schema_privilege` |
| que papéis são de aplicação | **sim, depois desta revisão** | membros do papel de grupo `forja_app`, por `pg_auth_members` |
| **com que papel a aplicação conecta** | **não** | é observável de **execução**, nunca de catálogo |

Medido: conectando com a credencial do executor sob `application_name = 'forja-app'`, o catálogo antes
e depois é idêntico byte a byte, e o único lugar onde o fato aparece é `pg_stat_activity`, que zera na
desconexão. Ou seja, o defeito que a afirmação 1 existe para impedir — a aplicação usando a credencial
do executor — é justamente o que o catálogo não enxerga.

Daí as duas consequências, e elas são a correção:

- **Papel de aplicação é membro de `forja_app`**, um papel de grupo sem `LOGIN` e sem privilégio
  próprio, criado junto do primeiro papel de aplicação. Só com isso a afirmação 2 vira consulta: "todo
  membro de `forja_app` não tem `USAGE` em `platform`" é verificável sem saber quem são eles.
- **"Qual credencial a aplicação usa" se audita por observação de execução** — `log_connections`, ou
  amostragem de `pg_stat_activity` por `application_name` e `usename` —, e essa é a única forma. Quem
  desenhar a operação precisa ligar uma das duas; sem isso, a afirmação 1 é convenção sustentada por
  disciplina, que é exatamente o que esta página diz não bastar.

Medido em 2026-09-11, PostgreSQL 16.15, pelo gate: com os papéis separados, o papel de aplicação levou
`permission denied` ao tocar `platform.schema_migrations` e o schema de outro cliente. É essa separação,
e só ela, que produziu os dois erros.

## 2. Credencial

- **Vem de ambiente.** Nunca de arquivo versionado, nunca de valor padrão em código. Sem a variável, o
  executor recusa iniciar, nomeando a chave que falta — a mesma postura do `lock_timeout`
  (`CONTRATO.md` §6).
- **`.env.example` sem valor**, com a chave e um comentário do que ela espera. Segredo nunca entra no
  repositório, nem em exemplo, nem em teste (`00-nucleo.md` §8). Verificado em 2026-09-11: não há
  credencial na árvore, e `.gitignore` cobre `.env` e `.env.*` com exceção do exemplo.
- **Os nomes das chaves são declarados por quem implementa o executor** (passo 5), junto do
  `.env.example`. O que esta convenção fixa é que elas existem, que não têm padrão implícito e que a de
  conexão carrega o papel do executor — não quais palavras elas usam. Uma exceção, e ela não carrega
  segredo: a chave que leva o **nome** da credencial da aplicação está fixada
  (`FORJA_MIGRATOR_APP_CREDENTIAL_ROLE`, §7.1), porque a §7.5 e a recusa de borda da §7.7 a citam.

## 3. O que continua em aberto, e não se presume

As duas perguntas que moravam aqui fecharam em 2026-09-11: o arranjo de papel de aplicação está na
§6.2, e onde os `GRANT` são escritos está na §7. O que sobra é o que depende de `D-03`, e continua
proibido presumir:

- **Quem é o sujeito dentro de uma transação de cliente.** O papel de banco diz de que cliente é a
  transação; ele não diz que pessoa a pediu. Enquanto `D-03` estiver aberta, o sujeito que este
  sistema registra é `db_role` (`CONTRATO.md` §19.2), e pessoa entra por expand no dia em que existir.
- **Se vai existir papel de leitura de operação** — suporte, observação, relatório. Ele não existe
  hoje, e enquanto não existir nenhum papel cujo privilégio não seja subconjunto do privilégio do
  executor, o `CREATEROLE` dele não amplia alcance nenhum. Isso **não** é mais o que segura o piso de
  versão: o piso subiu para **16** em 2026-09-11 (`db/convencoes.md` §9, §7.6), justamente para não
  depender de alguém lembrar desta condição no dia em que esse papel nascer.

## 4. Enumeração da carteira, e a classificação da saída do executor

**A enumeração é propriedade da tenancy escolhida, não defeito deste artefato.** Medido pelo gate: um
papel com `GRANT` apenas no schema do próprio cliente, que leva `permission denied` em todo dado alheio,
ainda assim lista todos os schemas `t_*` por `pg_namespace` e as tabelas de cada um por `pg_tables` — o
que entrega a carteira de clientes e, pelas tabelas que existem em cada schema, quais módulos cada um
tem. Revogar `SELECT` em `pg_namespace` **não** fecha, porque `pg_tables` continua respondendo, e quebra
introspecção legítima e `\dt`.

Fechar isso de verdade exigiria um banco por cliente, que `decision-tenancy-schema-por-cliente` recusou
por custo de operação, com o trade-off escrito. Então o registro é este, e ele existe para quem fechar
`D-03` não presumir o contrário: **a fronteira que protege a carteira é quem consegue abrir conexão no
banco**, não o `GRANT` sobre o ledger.

**Saída e artefato do executor têm a mesma classificação de `docs/auditorias/**`.** A mensagem de
divergência de checksum nomeia schema, e a impressão de estrutura do `verify` percorre todos os schemas
de cliente: os dois carregam a carteira. Enquanto o executor for comando rodado por quem já tem
credencial do banco, o alcance é o mesmo do parágrafo acima e nada muda. O dia que morde é aquele em que
a saída vira log agregado, anexo de ticket ou artefato de pipeline, com leitura mais larga que a do
banco. Portanto: por referência, nunca colada, fora do canal de operação — e o mesmo vale para Jira e PR
(`.claude/rules/jira.md` §6).

## 5. O privilégio do executor sobre `platform.tenants`

O executor precisa de `SELECT` e de `INSERT` no registro de clientes — ler para iterar, inserir para
`provision`. Ele **não** precisa de `UPDATE` nem de `DELETE`, em nenhum comando, em nenhum caminho.
Então:

```
REVOKE UPDATE, DELETE, TRUNCATE ON platform.tenants FROM <papel do executor>;
```

Isso entra no ato que cria o papel, junto dos `GRANT`, e não em migration: a §11.2 do contrato recusa
`GRANT` e `REVOKE` em arquivo de migration, porque privilégio não é estrutura e não deve viajar no
mesmo checksum que a tabela.

**Medido em 2026-09-11**, e o resultado tem os dois lados: revogar do **dono** funciona — mesmo com o
gatilho de `CONTRATO.md` §18 desligado, o `DELETE` levou `permission denied` — e o dono consegue
devolver o privilégio a si mesmo com um `GRANT`. Ou seja, o `REVOKE` é a camada que pega o comando
distraído e não é a que segura quem decidiu. Somado ao gatilho, o efeito é que corromper o registro
deixou de ser um comando e passou a ser três atos deliberados.

A trava que resistiria ao dono é o dono ser outro papel, e ela foi recusada com o custo escrito em
`CONTRATO.md` §18.3: separar a posse separaria a linha do livro-razão do efeito da migration, que
precisam cair no mesmo commit.

**Onde este `REVOKE` é verificado, desde 2026-09-11.** Ele continua sem casa mecanizada, e agora a
razão é estreita: o ato que cria o papel **do cliente** virou artefato (§7), o que cria o papel **do
executor** não — ele nasce com o banco, antes de existir executor para criá-lo. Privilégio segue fora
da impressão de estrutura por decisão declarada (confirmado por medição: `REVOKE` e `GRANT` não mudam uma linha da impressão). O que
mudou é que a ausência dele passou a ser **perguntada**: `CONTRATO.md` §13.4 faz `verify` conferir, por
catálogo, se a conexão do executor ainda carrega `UPDATE`, `DELETE` ou `TRUNCATE` sobre o registro, e o
achado vira linha na saída e evento `privilege_unexpected` em `platform.executor_events`. Não muda o
código de saída, e a razão está lá.

Somando com o gatilho, que a impressão passou a enxergar desligado (`CONTRATO.md` §13.3), o estado das
três camadas de `platform.tenants` é este:

| Camada | Verificável por automação? | Por quê |
|---|---|---|
| gatilho da `0002` | **sim**, desde o terceiro gate | `tgenabled` entrou na impressão; desligar produz linha divergente |
| `REVOKE` desta seção | **sim**, desde o terceiro gate | pergunta de `verify` (§13.4); o achado é registro, não veto |
| posse da tabela em outro papel | não se aplica | recusada, com o custo em `CONTRATO.md` §18.3 |

O que continua fora do alcance de qualquer uma das três é o superusuário, que desliga gatilho por
parâmetro de sessão e carrega todo privilégio por construção — declarado em `CONTRATO.md` §18.2, e não
é defeito deste artefato: é o que significa ser superusuário.

## 6. As duas camadas, e qual delas fecha o corpo de uma função

A pergunta que abriu esta seção veio do quarto gate
(`docs/auditorias/2026-09-11-executor-implementado.md`), depois de o crivo do carregador reabrir pela
terceira vez: ele está no lugar certo, ou é um crivo textual tentando decidir uma propriedade que não
é textual?

**Ele está no lugar certo para o que é SQL, e não tem lugar dentro de um corpo de plpgsql.** A §11.2
do contrato passou a fechar cada forma nas duas pontas, e isso mata classe inteira de fuga sem
enumerar palavra. O que sobra é o **interior** de quatro formas, e um deles não é SQL: o corpo de uma
função. Ali o crivo volta a ser lista de palavra proibida, que é incompleta por construção. Esta
seção é a outra camada.

### 6.1 Dois instantes, dois papéis, e o papel que decide não é o que se imagina

`RECUSAS.md` §11.5 recusa `SECURITY DEFINER`, então toda função criada por migration roda com o papel
de **quem a dispara**. Isso separa o problema em dois instantes:

| Instante | Quem executa o corpo | O que o privilégio precisa negar |
|---|---|---|
| aplicação da migration | papel do executor | alcance a schema de outro cliente enquanto a migration corre. O caminho concreto existe: um seed `INSERT … ON CONFLICT DO NOTHING`, que é forma permitida, dispara um gatilho criado por migration anterior, e o corpo roda com o papel do executor, dono de todos os schemas |
| operação, a cada venda | papel de aplicação | o mesmo alcance, agora a cada `INSERT` do caixa, para sempre |

O segundo é o que morde. O gatilho do `EXE-01` não faz nada no dia em que é aplicado: ele espera a
primeira venda.

**Medido em 2026-09-11, PostgreSQL 16.15**, com o corpo de função do `EXE-01` reescrito para a forma
que nenhuma palavra proibida alcança (`PERFORM set_config('search_path', 't_vitima', true)`):

| Prova | Arranjo de papel | Desfecho |
|---|---|---|
| A | papel dono dos dois schemas insere na venda | linha gravada em `t_vitima.orders`. **Vazamento** |
| B | papel de aplicação **por cliente**, sem `USAGE` no schema alheio | a venda **falha**, com o erro apontando a linha do corpo da função. Nada gravado dos dois lados |
| C | papel de aplicação **único para todos os clientes** | vazamento, e a venda conclui com sucesso |
| D | uma credencial só, `SET LOCAL ROLE <papel do cliente>` dentro da transação | mesmo desfecho de B |
| E | a mesma conexão sem assumir papel nenhum (`NOINHERIT`, sem concessão direta) | `permission denied for schema`. Falha fechado |

A leitura de B, que é o ponto inteiro: o privilégio **não impede o defeito**, ele troca o desfecho.
Uma escrita silenciosa no schema de outro cliente vira uma venda recusada, barulhenta, no caixa, com
a função nomeada na mensagem. `dados.md` §1 diz que vazamento entre clientes é o pior defeito
possível neste sistema; venda recusada é a melhor falha disponível, e é falha fechada.

E a leitura de C: com um papel de aplicação para todos, **nenhuma** correção de texto no carregador
fecha este caso, porque o texto que vaza pode não ter palavra nenhuma da lista.

### 6.2 O invariante que isto fixa, e a escolha que continua não sendo minha

**Invariante:** nenhum papel que atende requisição tem `USAGE` no schema de outro cliente. É a forma
de privilégio do invariante 1 do `CLAUDE.md` §7, e ele não depende de `D-03`: papel de banco não é
sujeito, não é sessão e não é borda.

Duas saídas satisfazem o invariante, e a §3 registrava a escolha entre elas como pergunta aberta:

- **um papel com `LOGIN` por cliente** — a fronteira é a credencial, e são N segredos para operar;
- **uma credencial `NOINHERIT`, membro de um papel sem `LOGIN` por cliente, assumido com
  `SET LOCAL ROLE` no começo de cada transação** — um segredo, N papéis, e a prova E mostra que
  esquecer de assumir falha fechado em vez de cair no papel amplo.

**Decidido pelo humano em 2026-09-11: a segunda.** Uma credencial `NOINHERIT` com `LOGIN`, N papéis
sem `LOGIN` — um por cliente —, e a transação assume o papel do cliente no começo e o larga no fim.

O motivo tem duas partes, e nenhuma delas é isolamento: as duas saídas satisfazem o invariante, então
o desempate é operacional.

- **Um segredo para guardar e rotacionar, em vez de N.** Rotação é procedimento que alguém executa;
  com N credenciais é o mesmo procedimento N vezes, e o cliente esquecido é o que fica com a senha
  velha por tempo indeterminado.
- **Provisionar cliente novo não cria credencial que alguém precisa distribuir.** O papel do cliente
  não tem `LOGIN` e não tem senha: ele nasce dentro do `provision` (§7) e não precisa chegar a lugar
  nenhum. Na outra saída, cada cliente novo produz um segredo que alguém leva até a configuração do
  processo que atende — e é aí que ele vira variável copiada, arquivo de anotação, mensagem.

**O custo aceito é o passo intermediário:** existe um instante, entre abrir a conexão e a primeira
consulta, em que o papel ainda não foi assumido, e código que esqueça de assumir está errado. Ele erra
para o lado seguro, e é a prova E — a credencial `NOINHERIT` sem concessão direta leva
`permission denied for schema`. Não é "lê o schema errado": é não ler nada.

**A prova C é por que o papel compartilhado está fora**, e ela merece ser lida duas vezes: com um papel
de aplicação para todos os clientes, o gatilho do `EXE-01` gravou a venda no schema de outro cliente
**e a venda concluiu com sucesso**. Nenhum erro, nenhuma recusa, nada para investigar depois — o pior
desfecho possível deste sistema chegando pelo caminho mais barato de todos, que é uma aplicação
conectando com um papel só porque era mais simples de operar.

**Quatro medidas de 2026-09-11 no arranjo escolhido**, PostgreSQL 16.15, e as três primeiras são
requisito para quem implementa a borda:

| Medida | Resultado | O que ela obriga |
|---|---|---|
| `SET LOCAL ROLE` dentro de transação | vale até o `COMMIT`, e a conexão volta a ser a credencial **sem `RESET` nenhum** | é esta forma, e só ela |
| `SET ROLE` sem `LOCAL` | **atravessa o `COMMIT`** e fica na sessão | conexão devolvida ao pool carrega o papel do cliente anterior; é o defeito de [[gotcha-search-path-serve-o-executor-e-vaza-no-pool]] outra vez, agora em privilégio |
| consulta fora de transação, sem papel assumido | `permission denied for schema` | toda leitura de dado de cliente acontece dentro de transação, inclusive a que só lê |
| `SET LOCAL ROLE` para o papel de **outro** cliente, na mesma transação | funciona, e lê a linha do outro | é o resíduo do arranjo, abaixo |

**O resíduo, dito inteiro:** a credencial é membro dos N papéis, então trocar de cliente dentro da
transação é privilégio que ela tem. O que impede não é o banco: é não existir caminho para o chamador
emitir um comando novo. **E o invariante que fecha esse caminho não é "a equipe parametriza": é todo
texto que chega à conexão do cliente carregar ao menos um parâmetro ligado.** A distinção saiu do
quinto gate (`PAP-04`) e foi medida de novo em 2026-09-11, com o `pg` 8.23.0 que já está na árvore:
`query(texto)` **e** `query(texto, [])` vão pelo protocolo simples e devolvem dois resultados para
`select 1; select 2` — com array vazio inclusive —, enquanto um único parâmetro ligado faz o servidor
recusar com `cannot insert multiple commands into a prepared statement`. Um `ORDER BY` montado por
template não tem valor a ligar; logo é protocolo simples; logo é o canal inteiro, com uma consulta que
ninguém chamaria de concatenação de valor. Por isso a contenção é de borda e precisa ser **teste**, não
frase (`00-nucleo.md` §8, e é a mesma razão que sustenta `CONTRATO.md` §10.3). Na saída de N credenciais o resíduo seria outro e não menor: o
processo que atende N clientes guarda as N senhas, e vazar a configuração dele vaza todas. A diferença
real entre as duas saídas é onde o segredo mora, não quanto isolamento existe.

**O papel do executor fica como está, e isso é ausência decidida.** Um papel de migration por cliente
fecharia também o primeiro instante da tabela acima, e o custo é alto: o executor cria os schemas,
logo é dono deles, e passar a posse para papéis por cliente exige credencial por cliente para o
processo que já lê o registro inteiro de clientes por construção (§4). `SET ROLE` não serve de
fronteira aqui, porque `RESET ROLE` devolve o papel ao arquivo que quisesse voltar. O que protege o
primeiro instante enquanto isso: a gramática fechada da §11.2, que é o bastante para o erro honesto,
e a revisão humana antes do commit, que é o modelo de ameaça declarado em `RECUSAS.md` §11.7 item 4.
Registrado aqui para ser ausência decidida, não esquecimento.

### 6.3 O que o privilégio **não** pega, e por isso o crivo não sai

Nenhum `GRANT` expressa as regras abaixo, e todas são de `migrations.md`, não de isolamento:

- **`DROP COLUMN`, `DROP CONSTRAINT` e `TRUNCATE` dentro do schema do próprio cliente.** O executor é
  dono; privilégio nunca diria não. O `EXE-02` é exatamente isto, e mediu a coluna sumindo.
- **`DISABLE TRIGGER` em `platform.tenants`.** O `REVOKE` da §5 é sobre DML; desligar gatilho é DDL do
  dono. O crivo é o único mecanismo antes do fato, e a impressão da §13.3 é o único depois.
- **Forma, cabeçalho, idempotência, transacionalidade e `CONCURRENTLY`.** Nada disso tem privilégio
  correspondente.
- **A hora da falha.** O crivo falha na leitura do arquivo, antes de abrir conexão, nomeando arquivo e
  trecho, e barra o arquivo em **todos** os schemas. O privilégio falha no instante da execução, num
  cliente por vez, com uma mensagem que não diz de que arquivo aquilo veio. Trocar um pelo outro troca
  um defeito por outro.

### 6.4 Ordem, e o que bloqueia o quê

1. **As correções do crivo bloqueiam o primeiro `provision`.** São de texto e de código, e o `EXE-02`
   é perda de dado num sistema forward-only.
2. **A camada de privilégio não bloqueia o `provision`** — nenhuma aplicação conecta enquanto um
   cliente é provisionado. Ela bloqueia o **primeiro cliente em operação**, que é o primeiro dia em
   que existe um papel de aplicação.
3. **O ato de provisionamento deixou de ser o artefato que falta**, em 2026-09-11: ele é o passo 7 do
   `provision`, e mora na §7 (`db/papel-do-cliente.md`, e a prova dele em `db/verificacao-do-papel.md`).
   Era pré-requisito do item 2, e continua
   sendo — o que mudou é que ele existe, com verificação por catálogo (§7.5). O que segue sem casa
   mecanizada é só o `REVOKE` da §5, sobre o papel do executor, e a §5 diz por quê.

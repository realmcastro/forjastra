# `apps/api` — fundação do servidor

O que **não** depende do modelo de venda: resolução de cliente na borda, forma única de erro,
validação de entrada e a ponte para o Postgres. Nenhuma rota de negócio nasce aqui — elas
esperam o modelo, que espera lacunas do humano (`CLAUDE.md` §2).

## Rodar

```
cp .env.example .env     # e preencha FORJA_DATABASE_URL; o processo recusa subir sem ela
npm install
npm run typecheck
FORJA_TEST_DATABASE_URL=postgres://<operador>@127.0.0.1:5432/<banco descartável> npm test
npm run build && npm start
```

**`npm test` é o gate, e ele exige banco.** A camada de papel de banco só se prova contra um
Postgres de verdade: sem `FORJA_TEST_DATABASE_URL` o comando **falha** dizendo isso, em vez de sair
`0` tendo rodado só o que não precisa de banco. A razão é medida, não preferência
(`SUB-03`, `docs/auditorias/2026-09-12-conferencia-da-credencial-na-subida.md:150`): com a consulta
ao catálogo mutada no `dist`, a suíte sem banco continuava dizendo `0 fail`. Em modo de gate,
**nenhum teste pode pular** — pulo silencioso é a mesma linha verde sobre propriedade não exercida.

**E o gate reprova com total zero, nos dois modos** (`SUB-07`, na reauditoria de 2026-09-12).
`node --test` com um alvo que não casa arquivo nenhum sai `0`, e o script concordava: `0 testes ·
0 passando`, saída `0`. O alvo é a conjunção de `rootDir`, `outDir`, `include` e da convenção
`*.test.ts`, e mexer em qualquer uma das quatro é refactor de configuração que ninguém associa a
segurança.

**E o gate exige `passando = total` e os arquivos vivos por nome** (`SUB-10`, na terceira auditoria,
2026-09-23). `todo` roda o teste e descarta a falha dele, e com ele o gate saía `0` com uma asserção
falhando. Com os arquivos que exercem o banco fora do glob o total caía junto e o gate também saía
`0`, sem teste nenhum tocando o banco. `scripts/run-tests.mjs` nomeia esses arquivos
(`ARQUIVOS_VIVOS`) e reprova o que não executou nenhum teste; renomear um deles é mudar a lista no
mesmo diff.

```
npm run test:no-db       # modo parcial, declarado: 99 testes, 31 pulados
```

O modo parcial existe porque iterar em lógica pura sem subir banco é trabalho legítimo. Ele é uma
bandeira na linha de comando, nunca variável de ambiente, e diz em voz alta o que não exercitou.

A variável aponta para o **operador** do cluster — o papel que faz `db/papel-do-cliente.md` §7.2, e
que é superusuário. O teste cria a credencial, os papéis e os schemas que mede, todos com sufixo
sorteado, e derruba só o que criou. Aponte para banco descartável, nunca para banco com dado.
Com banco: 99 testes, nenhum pulado. `test/delegation-live.test.ts` cria um banco próprio e o
derruba no fim, porque a pergunta de delegação olha o banco inteiro e o estado hostil de um arquivo
derrubaria a subida de outro que rodasse ao lado.

Uma exceção de nome, e é a única: o schema de controle (`platform`). Ele entrou no universo das
perguntas de alcance, então um caso precisa montar alcance ali, e o nome dele é fixo. O teste
**cria só se faltar** e **derruba só o que criou**, com `RESTRICT`.

## O processo confere a própria credencial antes de abrir a porta

`FORJA_DATABASE_URL` deixou de ser palavra final. Na subida, uma consulta ao catálogo
(`src/db/credential-query.ts`) responde **oito** perguntas sobre o papel a que a conexão pertence de
fato e sobre o banco a que ela aponta, e `src/db/credential-refusals.ts` decide sobre elas. As quatro primeiras perguntam **quem a
credencial é**: o papel existe, tem `LOGIN`, é membro de `forja_app` sem `ADMIN OPTION`, e nenhuma
concessão **dele** é herdável. As três seguintes perguntam **o que ela alcança**, e a oitava pergunta
o que um objeto do banco **empresta** a quem o usa. Qualquer resposta
divergente é recusa: o processo escreve qual pergunta falhou e sai com `78`, sem atender requisição
nenhuma. Falhar ao **perguntar** também é recusa.

As quatro últimas não existiam em lugar nenhum deste lado da parede, e cada uma nasceu de um estado
medido em que o servidor subia dizendo `verified` enquanto um cliente lia a venda de outro. Juntas
elas fecham uma matriz de dois sujeitos por dois mecanismos, e a ordem em que as células foram
descobertas é a ordem em que elas vazaram:

|  | mecanismo: concessão de **papel** | mecanismo: privilégio de **objeto** (e atributo) |
|---|---|---|
| sujeito: **a credencial** | `inheritance` | `reach` |
| sujeito: **papel que ela assume** | `assumed` | `assumedReach` |

| Pergunta | O estado que ela fecha |
|---|---|
| `inheritance` | `GRANT app_t_<slug> TO <credencial> WITH INHERIT TRUE` por outra mão põe a credencial **nua** dentro do schema daquele cliente, sem assumir papel |
| `reach` | `GRANT USAGE ON SCHEMA t_<slug>` à credencial — **ou a `PUBLIC`** — dá o mesmo alcance por um caminho que não passa por `pg_auth_members`. É o reflexo de quem lê `permission denied for schema` |
| `assumed` | `GRANT app_t_<b> TO app_t_<a> WITH INHERIT TRUE`, uma linha, faz o cliente `a` ler o schema de `b` **dentro do handle que a borda entrega à rota** |
| `assumedReach` | `GRANT USAGE ON SCHEMA t_<b> TO app_t_<a>` — o **erro de digitação** da §7.3, onde duas linhas seguidas carregam o mesmo slug — dá o mesmo alcance sem passar por concessão de papel nenhuma. `ALTER ROLE app_t_<a> SUPERUSER` dá todos de uma vez |

**A oitava, `delegation`, fica fora da matriz** (`SUB-09`, 2026-09-23). O executor é dono dos schemas
de cliente, e regra de reescrita, view, view materializada, chave estrangeira e rotina
`SECURITY DEFINER` rodam com o privilégio do dono: um objeto dele no schema de `a`, apontando para
`b`, põe `a` dentro de `b` com as outras sete respondendo `ok`. A pergunta recusa objeto de schema
protegido que depende de objeto de **qualquer outro** schema, e toda rotina `SECURITY DEFINER` em
schema protegido, porque o corpo dela não deixa dependência no catálogo. O arranjo legítimo responde
vazio nas duas, e o crivo de migration recusa as duas coisas.

**O universo das perguntas de alcance é `t_*` mais `platform`.** O schema de controle guarda o
registro de clientes e o livro-razão, e `db/papeis-e-credencial.md` §1 escreve que nenhum papel de
aplicação recebe `USAGE` nele — era o único invariante de alcance escrito por extenso, e o único que
a conferência não perguntava.

**Não existe chave de ambiente que desligue a conferência**, e o nome do grupo também não vem do
ambiente. Consequência aceita e declarada: quem aponta `FORJA_DATABASE_URL` para `postgres` numa
máquina de desenvolvimento **para de subir**, e o arranjo de `db/papel-do-cliente.md` §7.2 passa a
ser pré-requisito de rodar o servidor, como já era de rodar a suíte viva.

**Custo, medido em 2026-09-23** com 602 schemas de cliente, cada um com 11 tabelas, 10 índices e
uma view: 623–686 ms a consulta inteira, dos quais cerca de 330 ms são a pergunta de delegação, que
cresce com o número de objetos do banco. Roda uma vez por processo, antes de a porta abrir.

O que isto **não** cobre, e a ausência é decidida: mudança depois da subida — concessão herdável
criada às três da manhã passa despercebida até o próximo reinício; concessão entre papéis de cliente
**só com `SET`, sem `INHERIT`**, que medido não dá alcance ao papel assumido; e credencial que
nenhum processo nosso usa. As três são a pergunta invertida do `verify`
(`db/verificacao-do-papel.md` §7.5.1), e o limite daqui é de alcance da pergunta, não de quem
responde: a conferência não exclui ninguém por propriedade que o excluído carrega.

**Tempo de banco não aceita `0`.** O Postgres lê `0` como "sem limite", e medido em 2026-09-12 um
`FORJA_PG_STATEMENT_TIMEOUT_MS=0` com o catálogo travado deixou o processo pendurado sem porta, sem
fato e sem código de saída. `src/config.ts` recusa o valor nas três chaves de tempo.

## O que está travado, e por quê

- **`D-03` (identidade) está ABERTA.** O provedor de identidade padrão recusa tudo
  (`src/identity/principal.ts`), e o diretório de clientes não resolve ninguém
  (`src/tenant/context.ts`). Enquanto for assim, `/health` é a única rota que responde. Isso é a
  política, não a falta dela.
- **`D-06` (residência da trilha) está ABERTA.** O fato de borda sai por uma porta
  (`src/observability/border-facts.ts`) cujo destino padrão é a saída padrão do processo — que
  **não é** trilha: não é retida e não prova nada.
- **`TenantDatabase` está vazia** (`src/db/tenant-db.ts`), então nenhuma consulta compila. É a
  propriedade certa enquanto o modelo não existe; quem gerar os tipos a partir do schema
  aplicado assume o dono desse passo.

## As três travas que não se afrouxam

1. **O cliente sai da identidade autenticada**, nunca de `body`, `query`, cabeçalho ou path — e
   isso está na **assinatura** do diretório, que recebe só o `Principal`.
2. **O handle do banco só existe dentro do contexto do cliente**, já preso ao schema dele. A raiz
   do Kysely não é exportada para rota nenhuma, então "função de dados com cliente opcional" não
   é algo que alguém precise lembrar de evitar: não há como escrever. Desde 2026-09-11 o
   compilador também separa os dois: `RootDb` e `TenantDb` têm marcas próprias, e só
   `tenantTransactionRunner()` produz a segunda.
3. **O alcance ao schema é privilégio de banco, não escolha de quem escreve a consulta.** A
   credencial da aplicação não alcança schema nenhum; quem alcança é `app_t_<slug>`, assumido com
   `SET LOCAL ROLE` na transação e largado no `COMMIT` (`src/db/tenant-role.ts`,
   `db/papel-do-cliente.md` §7).

## Consequência do papel por transação, declarada

**Toda leitura e toda escrita de cliente abrem transação.** Não existe consulta de cliente fora de
transação: a credencial nua leva `42501 permission denied for schema`, medido. Isso é o desenho
falhando fechado, e o custo é aceito.

O único caminho legítimo sem cliente que continua funcionando é o que **não toca banco** —
hoje, `/health`. O caminho que resolve identidade→schema **não pode** usar este pool, porque
`platform` está fora do alcance da credencial; a escolha de como ele conecta é de
`arquiteto-dados` + `seguranca`, e segue aberta.

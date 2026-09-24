# Regra — agent `arquiteto-dados`

Postgres. **Um schema por cliente.** Seu trabalho é o modelo que **não vai migrar depois** — a Fase 1
existe porque corrigir dado em produção de N clientes é o custo mais alto que este projeto tem.

Território: `db/**`. Você não escreve API nem UI.

## 1. Isolamento de tenant

- Um schema Postgres por cliente (`t_<slug>`), mais um schema de **controle** (`platform`) com o
  registro de clientes, módulos ativos, versão de migration aplicada por schema.
- **Nenhuma consulta cruza schema de cliente.** Relatório consolidado não é `JOIN` entre schemas:
  é agregação no `platform` alimentada por processo explícito.
- Nenhuma tabela de cliente vive no `platform`, e vice-versa. Se você precisar de "um lugar só para
  isso", pare — é sinal de fronteira errada.
- Migration é **idempotente** e roda N vezes, uma por schema, na mesma ordem. Toda migration declara
  se é de `platform` ou de cliente. Nunca as duas.
- `search_path` não é segurança: o schema é resolvido por quem conecta, e toda migration referencia
  o schema explicitamente.

## 2. Migration segue o ciclo de vida, e o ciclo é forward-only

Regra completa em `.claude/rules/migrations.md` — **leia antes de escrever qualquer DDL.** O resumo
que você não pode esquecer: migration aplicada nunca é editada; nada é dropado, renomeado ou
truncado por um agent; remover é o passo 4 de um ciclo expand→duplicar→preencher→contrair, em
release separado e com aprovação do humano; toda migration é idempotente e retomável, porque roda em
N schemas; e nenhuma migration é condicional a cliente.

## 3. Convenções (as que não dá para mudar depois)

- Nomes em **inglês**, `snake_case`, tabela no **plural** (`orders`, `order_items`).
- **Chave primária: `uuid`, geração ordenada por tempo**, em toda tabela (`D-04`, fechada em
  2026-09-11 → [[decision-d-04-chave-timestamps-exclusao]]). Onde a linha nasce no terminal, essa
  chave **é** a identidade de idempotência de `RN-OFF-013`, não uma coluna ao lado.
- **Timestamps variam por família, e a exceção é declarada:**
  - **fato** (venda, pagamento, movimento de caixa, documento fiscal, trilha): `occurred_at` e
    `received_at`, os dois `timestamptz NOT NULL`, e **nenhum `updated_at`** — a linha nunca é
    atualizada, e a coluna existiria só para convidar código a atualizá-la;
  - **cadastro e configuração**: `created_at` e `updated_at`, mantidos por gatilho genérico;
  - **ledger e registro de processo**: os instantes próprios (`applied_at`, `started_at`), sem
    `created_at` redundante ao lado.
- **Nenhuma coluna de exclusão lógica no núcleo.** Nem `deleted_at`, nem `is_active`. Tirar de
  circulação é vigência declarada mais fato de mudança de estado — a recusa, com as quatro partes,
  está em `db/convencoes.md` §4.
- **Tempo:** `timestamptz` sempre, armazenado em **UTC**. Nunca `timestamp` sem fuso, nunca `date`
  para algo que tem hora. O fuso é do **estabelecimento** (`RN-NUC-057`, desde 2026-09-23), parte da
  configuração publicada dele, aplicado na borda —
  turno, fechamento de caixa e "vendas de hoje" dependem disso e são caríssimos de corrigir depois.
- **Dinheiro (decidido em 2026-09-23, [[decision-dinheiro-e-quantidade]]):** `numeric` sem modificador sob
  domínio de envelope (`money_amount` ≤ 2 casas, `unit_price` ≤ 3, `quantity_value` ≤ 3), com `CHECK` por
  `min_scale()`; nunca `numeric(p,s)`, que arredonda em silêncio. O texto anterior dizia: inteiro em
  menor unidade (centavos) **ou** `numeric(14,2)`, uma escolha para todo o sistema.
  **Nunca** `float`/`real`/`double`.
- **Quantidade:** `numeric` com escala declarada (combustível e granel usam 3 casas; unidade usa 0).
  Escolher `integer` aqui bloqueia verticais inteiras.
- Domínio fechado: tabela de lookup com código estável, **não** `enum` do Postgres — adicionar valor
  a enum em N schemas é migration; inserir linha não é.
- Booleano nasce `NOT NULL DEFAULT`. Nulo tem que significar algo; se não significa, é defeito.
- Toda FK tem índice. Toda regra de unicidade do negócio é `UNIQUE` no banco, não só no código.
- `CHECK` para invariante que o banco pode garantir (total ≥ 0, quantidade > 0, status em lista).

## 3.1 Fato que a spec manda registrar tem coluna, e a ausência é declarada

Invariante 10 do `CLAUDE.md` §7. A sua parte dele é estrutural, não editorial:

- **Fato nasce com os dois instantes** (`occurred_at`, `received_at`) e sem `updated_at` (`D-04`).
  Registro que chega depois não reescreve o instante em que a coisa aconteceu.
- **Ausência é declarada no topo do arquivo de migration**, numerada, com o nome da lacuna ou da
  decisão aberta que a sustenta. Coluna que não nasce por recorte é diferente de coluna que ninguém
  pensou, e só o texto distingue as duas.
- **Não invente o fato que a spec não pediu**, e não o suprima porque "dá para derivar". Derivação de
  fato ausente é suposição com cara de consulta.
- **Captura não pode custar lock no caminho do caixa.** Se registrar um fato exige travar a tabela
  que a venda escreve, o desenho está errado, não a captura.

## 4. O que é fiscal/financeiro é append-only

Venda, pagamento, movimento de caixa e documento fiscal **não** se editam nem se apagam:
cancelamento e devolução são **linhas novas** que referenciam a original. Saldo é derivado, e se for
materializado, é reconstruível a partir dos eventos. Soft delete não vale para fiscal.

## 5. Modelo de módulo plugável

- Tabela de módulo ativo por cliente mora no `platform`. O código nunca deduz módulo ativo pela
  existência de tabela.
- Ligar módulo pode criar tabela nova; **nunca** alterar tabela do núcleo. Se o módulo precisa de um
  campo no núcleo, ou o campo é do núcleo (e vale para todos), ou vira tabela de extensão do módulo.
- Desligar módulo **não apaga dado**. Só para de ser lido.

## 6. Antes de entregar qualquer modelo, responda no relatório

1. Sobrevive a um cliente com **outro ramo** e a um com **outro fuso**?
2. Que consulta este modelo torna caro? Qual índice ela pede?
3. Qual coluna eu vou querer mudar em 6 meses — e por que ela está certa hoje?
4. Isolamento: existe caminho em que uma consulta veja dado de outro cliente?
5. Cardinalidade esperada em 2 anos (10², 10⁶, 10⁹?) e o que muda em cada faixa.

Sem essas cinco respostas, o modelo não está pronto para o gate de `seguranca`.

## Nunca

- Escrever DDL em linguagem de ferramenta. **D-01 fechou** (Fastify e Kysely), e isso **não** muda o
  seu entregável: DDL é SQL puro e versionado, aplicado pelo executor de `db/migrator/**` (R-14).
  Kysely consulta; ele não cria estrutura. Migration em código de biblioteca é `BLOQUEIO`.
- Coluna de vertical no núcleo (`table_number`, `pump_id`) — vai para tabela do módulo.
- `SELECT *` em migration, view ou exemplo.
- Nome abreviado (`qtd`, `vlr`, `dt`). O glossário de `produto` manda no vocabulário.

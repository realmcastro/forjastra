# Regra — Ciclo de vida do banco e migrations

Vale para `arquiteto-dados`, `coder` e quem provisiona cliente. É **agnóstica de ferramenta**: o
ciclo abaixo é do Postgres e da operação, não do ORM. Enquanto **D-01** estiver ABERTA, o
entregável é SQL/DDL versionado — a ferramenta que vai aplicar isso escolhemos depois, e ela precisa
se adaptar a estas regras, não o contrário.

## 1. Forward-only. Sempre.

- **Migration aplicada nunca é editada.** Nem para corrigir typo, nem para "melhorar", nem em
  branch local se ela já rodou em qualquer schema. Errou? **Nova** migration corrige.
- Por quê: o mesmo arquivo já rodou em N schemas de N clientes. Editar cria dois bancos com a mesma
  versão e conteúdo diferente — e isso não aparece até quebrar em produção, num cliente só.
- Não existe `down` de produção. Reverter é **avançar** com a migration inversa, escrita e revisada
  como qualquer outra. `down` pode existir para ambiente local; nunca é o plano de rollback.

## 2. O livro-razão (ledger)

`platform.schema_migrations`: `schema`, `version`, `checksum`, `applied_at`, `duration_ms`,
`module` (quando a migration é de módulo).

- O `checksum` existe para **detectar edição** de migration já aplicada: divergência é erro fatal,
  para tudo, não "avisa e continua".
- A unidade de aplicação é **(schema, version)**. Falhar no schema 7 de 20 é normal e previsto: os
  6 primeiros ficam aplicados, o processo é **retomável** e roda de novo sem duplicar efeito.
- Dentro de **um** schema, a migration é transacional: ou aplica inteira, ou nada. Entre schemas,
  nunca há transação global.

## 3. Idempotência é requisito, não zelo

Toda migration pode rodar duas vezes sem estragar nada (`IF NOT EXISTS`, guarda de existência,
`INSERT ... ON CONFLICT DO NOTHING` para seed de domínio). É isso que torna a retomada segura
depois de falha de rede, timeout de lock, ou processo morto no meio da fila de schemas.

Teste de aceite de toda migration, os três:
1. **Schema vazio** (cliente novo, provisionado do zero).
2. **Schema com dado** representativo (cliente existente).
3. **Rodada duas vezes** seguidas.

## 4. Mudança destrutiva não existe em uma etapa — o ciclo expand/contract

Trocar, remover ou renomear qualquer coisa em uso acontece em **quatro etapas**, com deploy entre
elas, e **nunca** duas no mesmo release:

| Etapa | O que faz | Estado do sistema |
|---|---|---|
| **1. Expandir** | cria o novo (coluna/tabela/índice) **nullable**, sem tocar no antigo | código antigo continua funcionando |
| **2. Duplicar escrita** | aplicação passa a escrever nos dois | ambos válidos, novo ainda incompleto |
| **3. Preencher** | backfill em lotes, retomável, fora da migration de DDL | novo fica completo; só então `NOT NULL`/`UNIQUE` |
| **4. Contrair** | para de ler e escrever no antigo; **remover** o antigo é migration separada, **em release futuro, com aprovação explícita do humano** | antigo inerte, depois removido |

- **Proibido em migration**, sem exceção de agent: `DROP TABLE`, `DROP COLUMN`, `ALTER ... RENAME`,
  `ALTER TYPE` com perda de precisão ou domínio, `TRUNCATE`, `DELETE` sem `WHERE` de escopo,
  remover `CHECK`/`UNIQUE` que garante invariante de negócio.
- Renomear = etapa 1 com o nome novo + etapas 2–4. Nunca `RENAME`.
- Coluna que virou inútil fica. Custo de uma coluna morta é ~zero; custo de descobrir em produção
  que ela ainda era lida por um cliente é uma venda perdida no caixa.
- Etapa 4 chega ao humano com: quem ainda lê o antigo (busca no código, com paths), há quantos dias
  o novo está completo em **todos** os schemas, e como voltar se der errado.

## 5. O caixa não pode parar — lock e janela

DDL pega lock; um caixa esperando lock é uma venda parada. Portanto:

- `lock_timeout` **sempre** definido na sessão de migration. Melhor a migration falhar e ser
  retomada do que travar a operação. Sem `lock_timeout`, a migration é recusada na revisão.
- `ADD COLUMN` **nullable e sem default volátil** é barato (metadado). `ADD COLUMN NOT NULL` com
  default em tabela grande, mudança de tipo e `UNIQUE` retroativo **não são**: vão pelo ciclo da §4.
- Índice em tabela quente: `CREATE INDEX CONCURRENTLY` — que **não roda em transação**, então mora
  numa migration sozinha, marcada como não-transacional, e falha deixa índice inválido que a
  retomada precisa derrubar antes de recriar (é a única exceção de `DROP`, e é sobre índice
  inválido criado pela própria migration).
- Constraint em tabela grande: `NOT VALID` primeiro, `VALIDATE CONSTRAINT` depois, em migration
  separada.
- Migration longa é dividida. Nenhuma migration mantém transação aberta "por muito tempo" — se você
  não sabe quanto tempo ela leva no maior cliente, você ainda não pode aplicá-la.

## 6. Backfill é processo, não migration

Preencher dado histórico sai da migration de DDL e vira job em **lotes**, com marcador de progresso,
retomável, idempotente, e interrompível sem estrago. Migration de DDL que faz `UPDATE` em tabela
inteira é recusada.

## 7. Uma migration, um significado

- Um arquivo = uma mudança coesa, com nome que diz o quê: `NNNN__add_order_discount.sql`.
- Sequência **imutável** e sem buraco. Duas migrations com o mesmo número é conflito de merge, não
  "resolve depois".
- Declare no topo: alvo (`platform` ou cliente), módulo (se for de módulo), transacional (sim/não),
  reversível (sim/não + por quê). Uma migration nunca mistura `platform` e cliente.
- Migration **não** contém regra de negócio, nem dado de cliente. Seed só de domínio fechado, por
  código estável, idempotente.

## 8. Migration nunca é condicional a cliente

Nenhuma migration tem `if cliente = X`. Todos os schemas de cliente convergem para a **mesma**
estrutura; o que varia entre clientes são **módulos ativos** e **dado**, nunca DDL ad hoc.

- Módulo ligado aplica o conjunto de migrations **daquele módulo** naquele schema, registrando
  `module` no ledger. Desligar módulo **não** roda nada e **não** apaga dado — só para de ler.
- Provisionar cliente novo = rodar todas as migrations do núcleo, na ordem, do zero, mais as dos
  módulos contratados. Se o conjunto não reproduz um banco correto a partir do vazio, o conjunto
  está quebrado — e isso é verificado a cada release, não descoberto no primeiro cliente novo.

## 9. Drift é defeito

Nada de SQL na mão em ambiente compartilhado. Ajuste feito manualmente **tem** que virar migration
no mesmo dia, ou os bancos divergem em silêncio. Verificação periódica de estrutura contra a
esperada é trabalho do `arquiteto-dados`, e divergência encontrada é achado, não curiosidade.

## 10. Checklist de revisão (o agent responde no relatório)

1. É forward-only? Alguma etapa é destrutiva? Se sim, qual etapa da §4 estamos e quem aprovou?
2. Roda duas vezes sem estragar? Roda em schema vazio **e** com dado?
3. Que lock pega, por quanto tempo, no **maior** cliente? Tem `lock_timeout`?
4. É transacional? Se não, por quê, e o que a retomada precisa limpar?
5. Alvo é `platform` ou cliente — e só um dos dois?
6. Precisa de backfill? Está fora da migration, em lotes?
7. Quem lê a estrutura antiga hoje (paths)?

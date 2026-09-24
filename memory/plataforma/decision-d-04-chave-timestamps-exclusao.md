---
name: decision-d-04-chave-timestamps-exclusao
description: D-04 fechada em 2026-09-11 — chave primária é `uuid` com geração ordenada por tempo e É a identidade de idempotência do terminal; timestamps variam por família (fato leva occurred_at/received_at e nenhum updated_at, cadastro leva created_at/updated_at); nenhuma coluna de exclusão lógica no núcleo; updated_at é mantido por gatilho
type: decision
escopo: plataforma
camada: dados
data: 2026-09-11
relaciona: [[decision-tenancy-schema-por-cliente]], [[decision-migrations-forward-only]], [[convention-fato-nao-carrega-campo-de-calendario]], [[convention-o-caro-e-o-tipo-da-chave-nao-a-geracao]], [[gotcha-chave-unica-globalmente-parece-endereco]]
tarefa: T-0009
---

Quatro linhas, decididas pelo humano sobre a proposta medida de `db/convencoes.md`.

1. **Chave primária: tipo `uuid`, geração ordenada por tempo** (v7, ULID ou equivalente de 128 bits).
2. **A identidade de idempotência de `RN-OFF-013` é a própria chave primária**, não uma coluna ao
   lado de uma chave substituta.
3. **Timestamps por família.** Fato (venda, pagamento, movimento de caixa, documento fiscal, trilha):
   `occurred_at` e `received_at`, `timestamptz NOT NULL`, e **nenhum** `updated_at`. Cadastro e
   configuração: `created_at`/`updated_at`. Ledger e registro de processo: os instantes próprios
   (`applied_at`, `started_at`), sem `created_at` redundante.
4. **Nenhuma coluna de exclusão lógica no núcleo.** Nem `deleted_at`, nem `is_active`. Tirar de
   circulação é vigência declarada mais fato de mudança de estado. `updated_at` é mantido por
   **gatilho genérico** criado por migration de núcleo.

**Por quê, e o argumento principal não é a medida.** O que não se desfaz em N schemas é o **tipo da
coluna**; a regra de geração é código. `uuid` mantém v4, v7 e ULID intercambiáveis sem tocar o banco,
então errar a geração custa um deploy e errar o tipo custa expand/contract em N clientes. `bigint` e
`text` não compram esse direito. `bigint` além disso contradiz `RN-OFF-013`, que exige cunhar
identidade no terminal, offline: contador de servidor está fora por regra, não por gosto.

Duas colunas únicas (chave substituta + chave de idempotência) foram recusadas porque criam a janela
em que a mesma operação existe duas vezes sob chaves diferentes. Sendo a PK, a colisão que
`RN-OFF-013` manda detectar **é** a violação de unicidade do banco.

`updated_at` em tabela append-only foi recusado porque a coluna nunca mudaria de valor, e a
existência dela é o convite para alguém escrever o `UPDATE` que a regra fiscal proíbe.

**A medida, para o registro** (Postgres 16.15, 2M linhas, execução única em máquina de
desenvolvimento, detalhe em `db/convencoes.md` §2.2): índice da PK com 60 MB para `uuid` ordenado,
76 MB para aleatório, 43 MB para `bigint` (o piso inadmissível), 95 MB para texto de 26, 138 MB para
composto. Inserção de 200k linhas em regime permanente: 1.238 ms ordenado contra 1.842 ms aleatório.

**O preço assumido:** o instante de criação fica legível dentro da chave. Aceito porque a venda
carrega instante visível de qualquer forma, e porque a troca para geração aleatória, se um dia
importar, é código e não DDL.

**Como aplicar:** toda tabela da Fase 1 nasce sob isto, sem exceção não declarada. `dados.md` §3 foi
atualizada para registrar a exceção de timestamps por família. Antes de propor `deleted_at` em
qualquer lugar, leia `db/convencoes.md` §4: a recusa lá tem as quatro partes, e a necessidade que ela
preserva é "tirar de circulação sem perder histórico".

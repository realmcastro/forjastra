-- alvo: tenant
-- transacional: sim
-- reversivel: nao; cria tabela nova, e a inversa apagaria os intervalos em que cada unidade esteve
--             encerrada, que é a única resposta para "esta unidade operava naquele dia"
--
-- Encerrar e reabrir estabelecimento. Regra: RN-NUC-059 (docs/produto/nucleo-estabelecimento.md),
-- matriz, linha 41. Item: F-021, aceite 8.
--
-- A FORMA: UMA SEQUÊNCIA POR ESTABELECIMENTO, E O BANCO GARANTE A ALTERNÂNCIA
--
-- Encerrar e reabrir são fatos (RN-NUC-051), nunca inversão de campo. Cada unidade tem a sua
-- sequência: a mudança 1 é um encerramento, a 2 uma reabertura, e assim por diante, com a espécie
-- presa à paridade. Cada mudança k > 1 aponta para a k-1 pela chave estrangeira composta, que carrega
-- o instante dela, e o CHECK local exige que a nova não seja anterior. Consequências, todas do banco:
--
-- - encerrar duas vezes seguidas é impossível (a segunda teria número par e espécie errada);
-- - duas mudanças concorrentes disputam o mesmo número, e a segunda leva violação de unicidade;
-- - o intervalo encerrado fica na história: reabrir é linha nova, e a de encerramento continua lá.
--
-- "A está encerrada no instante T" é a última mudança com occurred_at <= T ser um encerramento
-- (F-021, aceite 8, e RN-NUC-061 confere isso antes de habilitar). "Quais unidades operavam em D" é
-- nascimento antes do fim de D e ao menos um instante de D fora de intervalo encerrado.
--
-- POR QUE CHECK E NÃO TABELA DE DOMÍNIO PARA A ESPÉCIE
--
-- As duas espécies não são domínio que cresce: a alternância é a estrutura desta tabela, e uma
-- terceira espécie exigiria reescrever a paridade de qualquer forma. Pausa não é encerramento e não é
-- ato (RN-NUC-059). Mesmo raciocínio de role_kind em platform/0011.
--
-- O QUE O BANCO NÃO GARANTE AQUI, E QUEM GARANTE
--
-- Que o encerramento revogue a habilitação de TODO terminal da unidade no mesmo ato é quantificação
-- sobre outra tabela, e o banco não a expressa por restrição. O que ele garante é a outra metade: cada
-- revogação por encerramento aponta para um encerramento desta tabela, da mesma unidade e com o mesmo
-- instante (tenant/0006). Que o encerramento só aconteça com a lista de bloqueio de RN-NUC-031 vazia é
-- precondição conferida pelo backend, com a recusa como fato (RN-NUC-043).
--
-- AUSÊNCIAS DECLARADAS (dados.md §3.1)
--
-- 1. O fato de recusa de encerrar (unidade com sessão aberta, RN-NUC-059 aceite 2). A recusa é o fato
--    de RN-NUC-043, cuja tabela é de SPR-37; aqui só nasce o ato que aconteceu.
-- 2. Faixa de referência não usada encerrada no ato (RN-OFF-006). A faixa é de G-01 e SPR-37.
-- 3. Chave estrangeira de author_operator_id e de support_assignment_id: ausência 4 de tenant/0003,
--    pelo mesmo motivo. support_enablement_fact_id ganha a dela em tenant/0007.
-- 4. CHECK de received_at >= occurred_at: ausência 7 de tenant/0003.
--
-- IDEMPOTÊNCIA E LOCK
--
-- IF NOT EXISTS com toda restrição nascendo junto da tabela. Só cria objeto novo; a chave estrangeira
-- para establishments pede lock SHARE ROW EXCLUSIVE nela, que na primeira aplicação está vazia.

CREATE TABLE IF NOT EXISTS establishment_operation_changes (
    change_id                   uuid        NOT NULL,
    establishment_id            uuid        NOT NULL,
    establishment_created_at    timestamptz NOT NULL,

    change_sequence             integer     NOT NULL,
    change_kind                 text        NOT NULL,

    -- A mudança anterior da mesma unidade, com o instante dela. Nulas só na primeira.
    preceding_sequence          integer         NULL,
    preceding_occurred_at       timestamptz     NULL,

    occurred_at                 timestamptz NOT NULL,
    received_at                 timestamptz NOT NULL,

    -- Encerrar e reabrir são do owner (matriz, linha 41).
    author_operator_id          uuid        NOT NULL,
    author_role_code            text            NULL,
    support_source_code         text        NOT NULL,
    support_assignment_id       uuid            NULL,
    support_concession_id       uuid            NULL,
    support_enablement_fact_id  uuid            NULL,

    CONSTRAINT establishment_operation_changes_pkey
        PRIMARY KEY (change_id),

    CONSTRAINT establishment_operation_changes_sequence_key
        UNIQUE (establishment_id, change_sequence),

    -- Alvo da chave estrangeira da mudança seguinte.
    CONSTRAINT establishment_operation_changes_chain_key
        UNIQUE (establishment_id, change_sequence, occurred_at),

    -- Alvo da revogação por encerramento (tenant/0006): prende espécie, unidade e instante do ato.
    CONSTRAINT establishment_operation_changes_act_key
        UNIQUE (change_id, change_kind, establishment_id, occurred_at),

    CONSTRAINT establishment_operation_changes_establishment_fkey
        FOREIGN KEY (establishment_id, establishment_created_at)
        REFERENCES establishments (establishment_id, occurred_at),

    CONSTRAINT establishment_operation_changes_preceding_fkey
        FOREIGN KEY (establishment_id, preceding_sequence, preceding_occurred_at)
        REFERENCES establishment_operation_changes (establishment_id, change_sequence, occurred_at),

    CONSTRAINT establishment_operation_changes_sequence_check
        CHECK (change_sequence >= 1),

    CONSTRAINT establishment_operation_changes_kind_check
        CHECK (change_kind IN ('closure', 'reopening')),

    -- A alternância: ímpar encerra, par reabre. A primeira mudança de uma unidade é sempre encerrar.
    CONSTRAINT establishment_operation_changes_alternation_check
        CHECK ((change_sequence % 2 = 1) = (change_kind = 'closure')),

    CONSTRAINT establishment_operation_changes_preceding_check
        CHECK (
            (change_sequence = 1 AND preceding_sequence IS NULL AND preceding_occurred_at IS NULL)
            OR (change_sequence > 1 AND preceding_sequence = change_sequence - 1
                AND preceding_occurred_at IS NOT NULL)
        ),

    CONSTRAINT establishment_operation_changes_order_check
        CHECK (occurred_at > establishment_created_at
               AND (preceding_occurred_at IS NULL OR occurred_at >= preceding_occurred_at)),

    CONSTRAINT establishment_operation_changes_author_role_code_fkey
        FOREIGN KEY (author_role_code) REFERENCES roles (code),

    CONSTRAINT establishment_operation_changes_support_source_code_fkey
        FOREIGN KEY (support_source_code) REFERENCES act_support_sources (code),

    CONSTRAINT establishment_operation_changes_support_assignment_check
        CHECK ((support_source_code = 'assignment') = (support_assignment_id IS NOT NULL)),

    CONSTRAINT establishment_operation_changes_support_concession_check
        CHECK ((support_source_code = 'concession') = (support_concession_id IS NOT NULL)),

    CONSTRAINT establishment_operation_changes_support_enablement_check
        CHECK ((support_source_code = 'retained_identification_and_terminal_enablement')
               = (support_enablement_fact_id IS NOT NULL)),

    CONSTRAINT establishment_operation_changes_author_role_check
        CHECK ((support_source_code = 'retained_identification_and_terminal_enablement')
               = (author_role_code IS NULL))
);

-- As chaves únicas começam por establishment_id e servem as duas chaves estrangeiras para a própria
-- unidade e a leitura "última mudança de A até T". As colunas de domínio têm índice próprio.
CREATE INDEX IF NOT EXISTS establishment_operation_changes_author_role_code_idx
    ON establishment_operation_changes (author_role_code);

CREATE INDEX IF NOT EXISTS establishment_operation_changes_support_source_code_idx
    ON establishment_operation_changes (support_source_code);

COMMENT ON TABLE establishment_operation_changes IS
    'Encerrar e reabrir estabelecimento (RN-NUC-059), em sequência por unidade: ímpar encerra, par reabre. O estado em T é derivado da última mudança até T, e o intervalo encerrado fica na história.';

CREATE OR REPLACE TRIGGER establishment_operation_changes_reject_mutation
    BEFORE UPDATE OR DELETE OR TRUNCATE ON establishment_operation_changes
    FOR EACH STATEMENT EXECUTE FUNCTION reject_mutation();

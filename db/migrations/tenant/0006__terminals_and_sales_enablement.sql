-- alvo: tenant
-- transacional: sim
-- reversivel: nao; cria tabelas novas, e a inversa apagaria por qual unidade cada terminal vendia em
--             cada instante, que é de onde o fato da venda tira o estabelecimento e o cliente (IDN-01)
--
-- Terminal e habilitação a vender. Regras: RN-OFF-032 (i), RN-NUC-061, RN-NUC-059, RN-PRV-013,
-- RN-OFF-016; decisão memory/plataforma/decision-d-03-opcao-c-sujeito-local-ao-cliente.md, cláusula
-- IDN-01. Item: F-021, aceites 1, 2, 4, 8 e 9 e o caminho infeliz.
--
-- O VÍNCULO TERMINAL -> ESTABELECIMENTO É DA HABILITAÇÃO, NÃO DA IDENTIDADE DO TERMINAL
--
-- F-021 deixou a escolha para cá, com uma condição: descomissionar e habilitar de novo tem que bastar
-- para vender por outra unidade. Se o estabelecimento fosse coluna do terminal, o mesmo aparelho em B
-- seria outro terminal, e "por qual unidade T vendia em T1" deixaria de ser pergunta sobre T. Então o
-- terminal é só identidade, e a unidade está em cada habilitação. Isto é também o que IDN-01 pede: o
-- estabelecimento e o cliente de um fato são os da habilitação sob a qual ele nasceu, nunca os que o
-- registro do terminal disser quando o fato sobe. O fato de venda (SPR-37) aponta para a habilitação
-- por (enablement_fact_id, establishment_id), e esse par só existe numa linha que o banco já amarrou.
--
-- A FORMA: UMA SEQUÊNCIA DE FATOS POR TERMINAL, E O BANCO É A MÁQUINA DE ESTADOS
--
-- Cada terminal tem uma sequência 1, 2, 3... de fatos, de cinco espécies:
--
--   enablement          habilitação por um estabelecimento, com autor e validade
--   renewal             renovação pelo contato autenticado, sem autor humano (RN-NUC-061)
--   decommission        descomissionar (matriz, linha 30), com autor: encerra a habilitação
--   closure_revocation  revogação pelo encerramento da unidade (RN-NUC-059), no mesmo ato e instante
--   compromise          terminal declarado comprometido (linha 34), com autor: nada vem depois
--
-- O fato k > 1 aponta para o k-1 por chave estrangeira composta que carrega espécie, instante e a
-- habilitação vigente dele. O CHECK de transição diz o que pode vir depois de quê:
--
--   (início) ou decommission ou closure_revocation  ->  enablement
--   enablement ou renewal  ->  renewal, decommission, closure_revocation
--   qualquer espécie que não compromise  ->  compromise
--   compromise  ->  nada
--
-- O que isto torna impossível, sem gatilho, sem lock e sem lembrar de nada:
--
-- - duas habilitações vigentes para o mesmo terminal, ou uma que nomeie duas unidades (aceites 2 e 9):
--   habilitar exige que o fato anterior seja o fim da habilitação anterior;
-- - habilitar de novo sem descomissionar ou sem o encerramento da unidade (RN-NUC-061);
-- - renovar depois de descomissionado, de revogado ou de comprometido: a renovação precisaria ser o
--   fato seguinte de uma habilitação vigente, e o número dele já foi ocupado pelo fim. Duas escritas
--   concorrentes para o mesmo terminal (a renovação do contato e a revogação do gerente) disputam o
--   mesmo número, e a segunda leva 23505. A que perde é a que tem que perder, qualquer das duas;
-- - reabilitar terminal comprometido (caminho infeliz de F-021): nenhuma espécie aceita compromise
--   como anterior. Recuperado, ele entra como terminal novo;
-- - fato de um período apontando para a unidade de outro: renewal e fim herdam enablement_fact_id do
--   anterior, e a chave (enablement_fact_id, establishment_id) só casa com a linha da habilitação;
-- - fim anterior ao início, ou habilitação nova anterior ao fim da anterior: o instante do anterior
--   viaja na chave, e o CHECK local compara;
-- - revogação por encerramento sem encerramento: ela aponta para uma linha de
--   establishment_operation_changes que é closure, é da mesma unidade e tem o mesmo instante.
--
-- "T está habilitado agora, e desde quando" (RN-PRV-013, aceite; F-021, aceite 4) é o último fato de T
-- ser enablement ou renewal, e "desde quando" é o occurred_at da linha enablement_fact_id. "Por qual
-- unidade T vendia em T1" (aceite 9) é o establishment_id do último fato de T com occurred_at <= T1,
-- se ele for enablement ou renewal.
--
-- O TERMINAL NASCE NO ATO DA PRIMEIRA HABILITAÇÃO (F-021, aceite 1)
--
-- Não há operação de cadastrar terminal na matriz: o terminal passa a existir para o cliente quando é
-- habilitado (RN-NUC-061, linha 40). terminals leva uma chave estrangeira adiada para o primeiro fato
-- dele, que o CHECK obriga a ser enablement, e uma habilitação nomeia a unidade por NOT NULL. Terminal
-- sem estabelecimento não chega ao COMMIT. first_fact_sequence é constante e existe só para a chave
-- composta, o mesmo recurso de memory/plataforma/gotcha-fk-prende-ato-sem-dar-select.md.
--
-- POR QUE CHECK E NÃO TABELA DE DOMÍNIO PARA A ESPÉCIE
--
-- As cinco espécies são a máquina de estados: espécie nova exige reescrever a transição, que é
-- migration de qualquer forma. Mesmo raciocínio de tenant/0004 e de role_kind em platform/0011.
--
-- O QUE O BANCO NÃO GARANTE AQUI, E QUEM GARANTE
--
-- Precondições de habilitar (RN-NUC-061): unidade não encerrada, queue_owner declarado, fuso e moeda
-- publicados e vigentes, aparelho sem fila de outro cliente. Todas dependem de estado de outras
-- tabelas (e duas delas de tabelas que ainda não existem), então são conferência do backend, com a
-- recusa como fato de RN-NUC-043. O banco garante que cada uma seja derivável: tenant/0004 e
-- tenant/0005. Que o encerramento revogue TODO terminal da unidade é a mesma espécie de pergunta
-- (tenant/0004, "O que o banco não garante").
--
-- AUSÊNCIAS DECLARADAS (dados.md §3.1)
--
-- 1. O valor do prazo da habilitação (LACUNA-OFF-017). offline_validity_seconds é a grandeza: o tempo
--    de funcionamento sem contato que a habilitação ou a renovação concedeu, gravado no fato. Ele não
--    tem DEFAULT, porque o número não está decidido e DEFAULT seria decidi-lo. É tempo de funcionamento
--    e não instante de calendário (memory/plataforma/gotcha-prazo-offline-em-calendario-nao-se-cumpre.md),
--    por isso segundos e não um valid_until.
-- 2. Material de prova do terminal e o portador emitido por habilitação (F-017, eixo E2 de D-03). O
--    portador de IDN-01 se ancora em fact_id da habilitação; a forma dele é outro item. Segredo nunca
--    entra aqui (RN-NUC-061, Não registra).
-- 3. Vencimento da habilitação como fato. Vencer por tempo sem contato acontece no terminal, sem rede,
--    e o servidor não observa: a próxima renovação é o que ele observa (RN-NUC-061).
-- 4. O fato de recusa (habilitar negado, contato de terminal comprometido, aceite 6 de RN-NUC-061). É
--    o fato de RN-NUC-043, de SPR-37.
-- 5. Transferência de fila e fila de outro cliente a drenar (RN-OFF-016, RN-NUC-061 aceite 7). A fila
--    é de SPR-37 e de F-017.
-- 6. Identificação legível do terminal ("caixa 3"). Nenhuma regra a nomeia.
-- 7. Timestamps de terminals. A linha nasce no ato da primeira habilitação e não tem instante próprio:
--    os dela são os daquele fato, pela chave adiada. Exceção a D-04 declarada aqui.
-- 8. Chave estrangeira de author_operator_id e de support_assignment_id: ausência 4 de tenant/0003.
-- 9. Instante da habilitação comparado ao nascimento da unidade. Encerramento e revogação já são
--    comparados (tenant/0004 e a chave de closure_change_id); o início de uma habilitação contra o
--    nascimento da unidade não é, e é do backend, que habilita unidade que já existe.
-- 10. CHECK de received_at >= occurred_at: ausência 7 de tenant/0003.
--
-- IDEMPOTÊNCIA (migrations.md §3)
--
-- IF NOT EXISTS com as restrições nascendo junto das tabelas, CREATE OR REPLACE TRIGGER, e uma
-- restrição por ALTER TABLE ... ADD CONSTRAINT (a chave adiada de terminals, que precisa da outra
-- tabela), retomável pela transação (CONTRATO.md §17.2, forma 3).
--
-- LOCK (migrations.md §5)
--
-- Só cria tabelas novas e acrescenta restrição a uma delas, criada na mesma transação. As chaves
-- estrangeiras para establishments e establishment_operation_changes pedem SHARE ROW EXCLUSIVE nelas,
-- que na primeira aplicação estão vazias.

CREATE TABLE IF NOT EXISTS terminals (
    terminal_id                 uuid    NOT NULL,

    -- Constante: existe para a chave adiada até o primeiro fato do terminal.
    first_fact_sequence         integer NOT NULL DEFAULT 1,

    CONSTRAINT terminals_pkey
        PRIMARY KEY (terminal_id),

    CONSTRAINT terminals_first_fact_sequence_check
        CHECK (first_fact_sequence = 1)
);

COMMENT ON TABLE terminals IS
    'Terminal: identidade do dispositivo neste cliente, substituível, sem estabelecimento próprio. Nasce no ato da primeira habilitação; a unidade por que ele vende está em cada habilitação.';

CREATE OR REPLACE TRIGGER terminals_reject_mutation
    BEFORE UPDATE OR DELETE OR TRUNCATE ON terminals
    FOR EACH STATEMENT EXECUTE FUNCTION reject_mutation();

CREATE TABLE IF NOT EXISTS sales_enabled_terminal_facts (
    fact_id                         uuid        NOT NULL,
    terminal_id                     uuid        NOT NULL,
    terminal_sequence               integer     NOT NULL,
    fact_kind                       text        NOT NULL,

    -- O fato anterior do mesmo terminal. As quatro são nulas só no primeiro.
    preceding_sequence              integer         NULL,
    preceding_kind                  text            NULL,
    preceding_occurred_at           timestamptz     NULL,
    preceding_enablement_fact_id    uuid            NULL,

    -- A habilitação a que este fato pertence, e a unidade dela. Na própria habilitação,
    -- enablement_fact_id é fact_id; em compromise, as duas são nulas.
    enablement_fact_id              uuid            NULL,
    establishment_id                uuid            NULL,

    -- Tempo de funcionamento sem contato concedido (ausência 1). Só em enablement e renewal.
    offline_validity_seconds        integer         NULL,

    -- De que terminal a habilitação foi pedida, quando foi (RN-NUC-061, aceite 9).
    requested_from_terminal_id      uuid            NULL,

    -- O encerramento que revogou, em closure_revocation. A espécie é constante e existe para a chave.
    closure_change_id               uuid            NULL,
    closure_change_kind             text            NULL,

    occurred_at                     timestamptz NOT NULL,
    received_at                     timestamptz NOT NULL,

    -- Autor na forma de RN-NUC-029 (db/convencoes.md §11). Presente em enablement, decommission e
    -- compromise; ausente em renewal, que não é ato de ninguém, e em closure_revocation, cujo autor é
    -- o do encerramento.
    author_operator_id              uuid            NULL,
    author_role_code                text            NULL,
    support_source_code             text            NULL,
    support_assignment_id           uuid            NULL,
    support_concession_id           uuid            NULL,
    support_enablement_fact_id      uuid            NULL,

    CONSTRAINT sales_enabled_terminal_facts_pkey
        PRIMARY KEY (fact_id),

    CONSTRAINT sales_enabled_terminal_facts_sequence_key
        UNIQUE (terminal_id, terminal_sequence),

    -- Alvo da chave do fato seguinte.
    CONSTRAINT sales_enabled_terminal_facts_chain_key
        UNIQUE (terminal_id, terminal_sequence, fact_kind, occurred_at, enablement_fact_id),

    -- Alvo da chave de período, e da que o fato de venda vai usar (SPR-37).
    CONSTRAINT sales_enabled_terminal_facts_period_key
        UNIQUE (fact_id, establishment_id),

    CONSTRAINT sales_enabled_terminal_facts_terminal_fkey
        FOREIGN KEY (terminal_id) REFERENCES terminals (terminal_id),

    CONSTRAINT sales_enabled_terminal_facts_preceding_fkey
        FOREIGN KEY (terminal_id, preceding_sequence, preceding_kind, preceding_occurred_at,
                     preceding_enablement_fact_id)
        REFERENCES sales_enabled_terminal_facts (terminal_id, terminal_sequence, fact_kind, occurred_at,
                                                 enablement_fact_id),

    CONSTRAINT sales_enabled_terminal_facts_period_fkey
        FOREIGN KEY (enablement_fact_id, establishment_id)
        REFERENCES sales_enabled_terminal_facts (fact_id, establishment_id),

    CONSTRAINT sales_enabled_terminal_facts_establishment_fkey
        FOREIGN KEY (establishment_id) REFERENCES establishments (establishment_id),

    CONSTRAINT sales_enabled_terminal_facts_requested_from_fkey
        FOREIGN KEY (requested_from_terminal_id) REFERENCES terminals (terminal_id),

    CONSTRAINT sales_enabled_terminal_facts_closure_fkey
        FOREIGN KEY (closure_change_id, closure_change_kind, establishment_id, occurred_at)
        REFERENCES establishment_operation_changes (change_id, change_kind, establishment_id, occurred_at),

    CONSTRAINT sales_enabled_terminal_facts_sequence_check
        CHECK (terminal_sequence >= 1),

    CONSTRAINT sales_enabled_terminal_facts_kind_check
        CHECK (fact_kind IN ('enablement', 'renewal', 'decommission', 'closure_revocation', 'compromise')),

    -- O primeiro fato de um terminal é a habilitação em que ele nasce (aceite 1).
    CONSTRAINT sales_enabled_terminal_facts_first_check
        CHECK (terminal_sequence > 1 OR fact_kind = 'enablement'),

    -- As quatro colunas do anterior vão juntas: com uma só nula a chave composta deixaria de ser
    -- conferida (MATCH SIMPLE), e é este CHECK que fecha isso.
    CONSTRAINT sales_enabled_terminal_facts_preceding_check
        CHECK (
            (terminal_sequence = 1
             AND num_nonnulls(preceding_sequence, preceding_kind, preceding_occurred_at,
                              preceding_enablement_fact_id) = 0)
            OR (terminal_sequence > 1
                AND num_nulls(preceding_sequence, preceding_kind, preceding_occurred_at,
                              preceding_enablement_fact_id) = 0
                AND preceding_sequence = terminal_sequence - 1)
        ),

    -- A máquina de estados. coalesce porque CHECK aceita nulo, e nulo aqui seria transição livre.
    CONSTRAINT sales_enabled_terminal_facts_transition_check
        CHECK (
            (fact_kind = 'enablement'
             AND coalesce(preceding_kind, 'none') IN ('none', 'decommission', 'closure_revocation'))
            OR (fact_kind IN ('renewal', 'decommission', 'closure_revocation')
                AND coalesce(preceding_kind, 'none') IN ('enablement', 'renewal'))
            OR (fact_kind = 'compromise'
                AND coalesce(preceding_kind, 'none')
                    IN ('enablement', 'renewal', 'decommission', 'closure_revocation'))
        ),

    CONSTRAINT sales_enabled_terminal_facts_order_check
        CHECK (preceding_occurred_at IS NULL OR occurred_at >= preceding_occurred_at),

    -- O período: a habilitação é o próprio período; renovação e fim herdam o do anterior; o
    -- comprometimento não pertence a período nenhum.
    CONSTRAINT sales_enabled_terminal_facts_period_check
        CHECK (
            (fact_kind = 'enablement'
             AND enablement_fact_id IS NOT DISTINCT FROM fact_id
             AND establishment_id IS NOT NULL)
            OR (fact_kind IN ('renewal', 'decommission', 'closure_revocation')
                AND enablement_fact_id IS NOT NULL
                AND enablement_fact_id IS NOT DISTINCT FROM preceding_enablement_fact_id
                AND establishment_id IS NOT NULL)
            OR (fact_kind = 'compromise'
                AND enablement_fact_id IS NULL
                AND establishment_id IS NULL)
        ),

    CONSTRAINT sales_enabled_terminal_facts_validity_check
        CHECK ((fact_kind IN ('enablement', 'renewal')) = (offline_validity_seconds IS NOT NULL)
               AND (offline_validity_seconds IS NULL OR offline_validity_seconds > 0)),

    CONSTRAINT sales_enabled_terminal_facts_requested_from_check
        CHECK (fact_kind = 'enablement' OR requested_from_terminal_id IS NULL),

    CONSTRAINT sales_enabled_terminal_facts_closure_check
        CHECK ((fact_kind = 'closure_revocation') = (closure_change_id IS NOT NULL)
               AND (closure_change_id IS NULL) = (closure_change_kind IS NULL)
               AND (closure_change_kind IS NULL OR closure_change_kind = 'closure')),

    CONSTRAINT sales_enabled_terminal_facts_author_check
        CHECK ((fact_kind IN ('enablement', 'decommission', 'compromise')) = (author_operator_id IS NOT NULL)
               AND (author_operator_id IS NULL) = (support_source_code IS NULL)
               AND (author_operator_id IS NOT NULL
                    OR num_nonnulls(author_role_code, support_assignment_id, support_concession_id,
                                    support_enablement_fact_id) = 0)),

    CONSTRAINT sales_enabled_terminal_facts_author_role_code_fkey
        FOREIGN KEY (author_role_code) REFERENCES roles (code),

    CONSTRAINT sales_enabled_terminal_facts_support_source_code_fkey
        FOREIGN KEY (support_source_code) REFERENCES act_support_sources (code),

    CONSTRAINT sales_enabled_terminal_facts_support_enablement_fkey
        FOREIGN KEY (support_enablement_fact_id) REFERENCES sales_enabled_terminal_facts (fact_id),

    CONSTRAINT sales_enabled_terminal_facts_support_assignment_check
        CHECK ((support_source_code IS NOT DISTINCT FROM 'assignment') = (support_assignment_id IS NOT NULL)),

    CONSTRAINT sales_enabled_terminal_facts_support_concession_check
        CHECK ((support_source_code IS NOT DISTINCT FROM 'concession') = (support_concession_id IS NOT NULL)),

    CONSTRAINT sales_enabled_terminal_facts_support_enablement_check
        CHECK ((support_source_code IS NOT DISTINCT FROM 'retained_identification_and_terminal_enablement')
               = (support_enablement_fact_id IS NOT NULL)),

    CONSTRAINT sales_enabled_terminal_facts_author_role_check
        CHECK (support_source_code IS NULL
               OR (support_source_code = 'retained_identification_and_terminal_enablement')
                  = (author_role_code IS NULL))
);

-- terminal_id é servido pela chave única (terminal_id, terminal_sequence), que é também o caminho de
-- "último fato de T". As demais chaves estrangeiras têm índice próprio.
CREATE INDEX IF NOT EXISTS sales_enabled_terminal_facts_establishment_idx
    ON sales_enabled_terminal_facts (establishment_id, terminal_id);

CREATE INDEX IF NOT EXISTS sales_enabled_terminal_facts_enablement_idx
    ON sales_enabled_terminal_facts (enablement_fact_id);

CREATE INDEX IF NOT EXISTS sales_enabled_terminal_facts_requested_from_idx
    ON sales_enabled_terminal_facts (requested_from_terminal_id);

CREATE INDEX IF NOT EXISTS sales_enabled_terminal_facts_closure_idx
    ON sales_enabled_terminal_facts (closure_change_id);

CREATE INDEX IF NOT EXISTS sales_enabled_terminal_facts_author_role_code_idx
    ON sales_enabled_terminal_facts (author_role_code);

CREATE INDEX IF NOT EXISTS sales_enabled_terminal_facts_support_source_code_idx
    ON sales_enabled_terminal_facts (support_source_code);

CREATE INDEX IF NOT EXISTS sales_enabled_terminal_facts_support_enablement_idx
    ON sales_enabled_terminal_facts (support_enablement_fact_id);

COMMENT ON TABLE sales_enabled_terminal_facts IS
    'Habilitação a vender (glossario.md, sales_enabled_terminal), como sequência de fatos por terminal: enablement, renewal, decommission, closure_revocation, compromise. O estado em T é o último fato até T; a chave composta com o anterior é a máquina de estados.';

COMMENT ON COLUMN sales_enabled_terminal_facts.offline_validity_seconds IS
    'Tempo de funcionamento sem contato que esta habilitação ou renovação concedeu. O número é LACUNA-OFF-017, e por isso não há DEFAULT.';

CREATE OR REPLACE TRIGGER sales_enabled_terminal_facts_reject_mutation
    BEFORE UPDATE OR DELETE OR TRUNCATE ON sales_enabled_terminal_facts
    FOR EACH STATEMENT EXECUTE FUNCTION reject_mutation();

-- Terminal sem primeiro fato não chega ao COMMIT: a chave é conferida no fim da transação, depois de
-- a habilitação que o cria ter sido gravada.
ALTER TABLE terminals
    ADD CONSTRAINT terminals_first_fact_fkey
    FOREIGN KEY (terminal_id, first_fact_sequence)
    REFERENCES sales_enabled_terminal_facts (terminal_id, terminal_sequence)
    DEFERRABLE INITIALLY DEFERRED;

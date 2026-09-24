-- alvo: platform
-- transacional: sim
-- reversivel: nao; cria tabelas novas, e a inversa apagaria o único registro persistente de que uma
--             migration aplicada foi editada ou de que um banco divergiu
--
-- O que o executor detectou e não conseguiu aplicar. Semântica: db/migrator/CONTRATO.md §19.
--
-- POR QUE ESTE ARQUIVO EXISTE
--
-- Invariante 10 do CLAUDE.md §7: capturar é o padrão, não capturar exige justificativa registrada.
-- O livro-razão responde "o que está aplicado" e responde bem. As detecções do executor — checksum
-- divergente, drift encontrado pelo verify, objeto nascido fora do schema alvo — não tinham casa
-- nenhuma: paravam a rodada e morriam na saída do processo (MIG-15,
-- docs/auditorias/2026-09-11-executor-e-schema-platform-reauditoria.md). Rodar de novo não deixava
-- rastro, e quem editasse o arquivo de volta apagava a única evidência que existia.
--
-- Esta tabela não é coluna nova no livro-razão, e a razão é a mesma de CONTRATO.md §5.1: o livro-razão
-- existe para responder "o que está aplicado", e misturar tentativa com aplicação estraga essa
-- resposta. São duas perguntas, então são duas tabelas.
--
-- POR QUE O SUJEITO É O PAPEL DE BANCO, E NÃO UMA PESSOA
--
-- D-03 (residência do sujeito) segue ABERTA, e era ela que sustentava a ausência declarada em
-- CONTRATO.md §5.1. O gate desmontou o argumento nos próprios termos: o livro-razão já grava linha
-- sem autor nenhum, e RN-PRV-013 descreve o grão de migration_applied como "(schema, versão), com
-- desfecho e duração", sem autor. O sujeito que o executor conhece é o papel de banco com que ele
-- conectou, e é esse que a coluna db_role guarda.
--
-- AUSÊNCIA DECLARADA (invariante 10)
--
-- 1. AUTOR HUMANO. Depende de D-03, e coluna escrita hoje nasceria sem valor possível. Quando D-03
--    fechar, ela entra por expand (migrations.md §4), nullable, sem tocar a linha já escrita.
-- 2. IDENTIFICADOR DE RODADA. Não existe aqui pelo mesmo motivo que não existe no livro-razão
--    (CONTRATO.md §5.1 item 3): ele só serve se as duas tabelas o tiverem, e acrescentá-lo a uma só
--    produziria correlação pela metade, que é pior que correlação por started_at.
-- 3. O ATO RECUSADO PELOS GATILHOS DA 0002 E DA 0003. Não cabe aqui: o gatilho lança e a transação
--    morre, então nenhuma escrita sobrevive dentro dela. A captura existente é o log de erro do
--    servidor, medido em 2026-09-11: ERROR e STATEMENT, com log_min_error_statement no padrão.
--
-- COMO A ESCRITA NÃO BLOQUEIA A OPERAÇÃO (invariante 10, terceira cláusula)
--
-- A linha da falha de aplicação é escrita por uma SEGUNDA conexão, fora da transação que falhou —
-- se fosse na mesma, o ROLLBACK a levaria junto, que é exatamente por que ela não existia. Falha ao
-- escrever a linha não muda o desfecho nem o código de saída da rodada: ela é reportada e o executor
-- segue para o que já ia fazer, que é parar.
--
-- IDEMPOTÊNCIA (migrations.md §3)
--
-- Guarda de existência nas duas tabelas, toda restrição nascendo junto do CREATE TABLE, seed por
-- INSERT ... ON CONFLICT DO NOTHING e CREATE OR REPLACE TRIGGER. Segunda rodada não faz nada.

CREATE TABLE IF NOT EXISTS platform.executor_event_kinds (
    code         text NOT NULL,
    description  text NOT NULL,

    CONSTRAINT executor_event_kinds_pkey
        PRIMARY KEY (code),

    CONSTRAINT executor_event_kinds_code_check
        CHECK (code ~ '^[a-z][a-z0-9_]{2,40}$'),

    CONSTRAINT executor_event_kinds_description_check
        CHECK (octet_length(description) BETWEEN 1 AND 200)
);

-- Sem coluna de instante, e é escolha: a linha nasce de migration, e o instante em que aquela
-- migration entrou já está no livro-razão. Uma created_at aqui seria uma segunda resposta, mais fraca,
-- para a mesma pergunta.
COMMENT ON TABLE platform.executor_event_kinds IS
    'Domínio fechado dos tipos de evento do executor. Valor novo entra por migration, nunca por código.';

CREATE TABLE IF NOT EXISTS platform.executor_events (
    event_id           uuid        NOT NULL,
    kind_code          text        NOT NULL,

    -- Fato leva os dois instantes (dados.md §3 e §3.1): occurred_at é quando o executor observou,
    -- received_at é quando a linha foi escrita. Empatam no caminho normal e se afastam quando a
    -- escrita acontece por segunda conexão, depois de uma transação que morreu.
    occurred_at        timestamptz NOT NULL,
    received_at        timestamptz NOT NULL,

    -- O sujeito que o executor conhece. Nunca uma pessoa: ver a ausência 1 no topo.
    db_role            text        NOT NULL,

    -- Contexto, todo opcional porque nem todo tipo de evento tem todos. Nada de dado de negócio:
    -- o alcance destas colunas é o mesmo da saída do executor (db/papeis-e-credencial.md §4).
    schema_name        text            NULL,
    version            text            NULL,
    checksum_expected  text            NULL,
    checksum_found     text            NULL,
    detail             text            NULL,

    CONSTRAINT executor_events_pkey
        PRIMARY KEY (event_id),

    CONSTRAINT executor_events_kind_code_fkey
        FOREIGN KEY (kind_code) REFERENCES platform.executor_event_kinds (code),

    CONSTRAINT executor_events_received_after_occurred_check
        CHECK (received_at >= occurred_at),

    CONSTRAINT executor_events_db_role_check
        CHECK (octet_length(db_role) BETWEEN 1 AND 63),

    CONSTRAINT executor_events_schema_name_check
        CHECK (schema_name IS NULL OR octet_length(schema_name) BETWEEN 1 AND 63),

    CONSTRAINT executor_events_version_check
        CHECK (version IS NULL OR octet_length(version) > 0),

    -- O mesmo formato do livro-razão: o que não poderia ser um checksum não entra como um.
    CONSTRAINT executor_events_checksum_expected_check
        CHECK (checksum_expected IS NULL OR checksum_expected ~ '^[0-9a-f]{64}$'),

    CONSTRAINT executor_events_checksum_found_check
        CHECK (checksum_found IS NULL OR checksum_found ~ '^[0-9a-f]{64}$'),

    -- Teto para a coluna não virar despejo de saída de processo. Mensagem maior que isto é sinal de
    -- que o evento devia ter colunas, não prosa.
    CONSTRAINT executor_events_detail_check
        CHECK (detail IS NULL OR octet_length(detail) BETWEEN 1 AND 2000)
);

-- Toda FK tem índice (dados.md §3). Não há índice em occurred_at: a chave primária é uuid ordenado
-- por tempo (D-04, K2), e a cardinalidade desta tabela em 2 anos é de 10² a 10⁴ linhas — índice
-- especulativo aqui seria otimização sem medida (performance.md §1).
CREATE INDEX IF NOT EXISTS executor_events_kind_code_idx
    ON platform.executor_events (kind_code);

-- Fato é append-only (dados.md §4). Mesma trava da 0002, mesma função.
CREATE OR REPLACE TRIGGER executor_events_reject_mutation
    BEFORE UPDATE OR DELETE OR TRUNCATE ON platform.executor_events
    FOR EACH STATEMENT EXECUTE FUNCTION platform.reject_mutation();

-- O domínio não leva a trava, e é decisão, não esquecimento: o que ele guarda é descrição de tipo,
-- não evidência. Reescrever uma descrição não apaga fato nenhum, e a mutação dele já é recusada onde
-- importa — a §11.2 do contrato não admite UPDATE nem DELETE em migration.

INSERT INTO platform.executor_event_kinds (code, description) VALUES
    ('checksum_mismatch',          'Checksum do arquivo diverge do registrado: migration aplicada foi editada (CONTRATO.md §3).'),
    ('ledger_entry_without_file',  'Versão registrada no livro-razão sem arquivo em disco: migration aplicada foi apagada ou renomeada.'),
    ('migration_behind_head',      'Arquivo pendente com número inferior ao maior já aplicado naquele stream e schema.'),
    ('ledger_structure_mismatch',  'Retrato estrutural do livro-razão não casa com o declarado (CONTRATO.md §9).'),
    ('migration_failed',           'Aplicação falhou; a transação foi revertida e a rodada parou no schema nomeado.'),
    ('object_outside_target',      'Objeto novo apareceu fora do namespace alvo durante a migration (CONTRATO.md §10.4).'),
    ('index_outside_target',       'Índice declarado no cabeçalho apareceu fora do namespace alvo (CONTRATO.md §8).'),
    ('structure_mismatch',         'verify encontrou diferença entre um schema real e a referência (CONTRATO.md §13.2).'),
    ('schema_without_registry',    'Schema de cliente existe no catálogo e não está em platform.tenants.'),
    ('registered_schema_missing',  'Schema registrado em platform.tenants não existe no catálogo.')
ON CONFLICT DO NOTHING;

COMMENT ON TABLE platform.executor_events IS
    'O que o executor detectou e não conseguiu aplicar. Linha nunca é alterada nem removida. O livro-razão responde o que está aplicado; esta tabela responde o que deu errado.';

COMMENT ON COLUMN platform.executor_events.db_role IS
    'Papel de banco com que o executor conectou. Não é pessoa: autor humano depende de D-03.';

COMMENT ON COLUMN platform.executor_events.occurred_at IS
    'Instante em que o executor observou o evento. received_at é o instante da escrita, e os dois se afastam quando a escrita vem por segunda conexão.';

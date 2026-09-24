-- alvo: tenant
-- transacional: sim
-- reversivel: nao; cria a entidade a que todo fato do núcleo pertence, e a inversa apagaria a
--             resposta para "de que unidade saiu esta venda"
--
-- O estabelecimento e o nome dele. Regras: RN-NUC-050 e RN-NUC-051
-- (docs/produto/nucleo-estabelecimento.md), RN-NUC-060. Item: F-021.
--
-- A FORMA
--
-- A linha de establishments É o fato de criação (RN-NUC-051): autor, papel, fonte de sustentação e os
-- dois instantes, e nenhum updated_at (D-04, família de fato). Nada nela muda depois de gravada, e o
-- gatilho abaixo recusa a tentativa. O que nasce com a unidade são três coisas e nada além
-- (RN-NUC-050): o vínculo com o cliente, o fato datado de criação e o nome.
--
-- O VÍNCULO COM O CLIENTE É O SCHEMA, E NÃO UMA COLUNA (F-021, aceite 3)
--
-- Não existe coluna de cliente (tenant) aqui, e é isso que torna RN-NUC-060 garantida por construção:
-- o cliente de um estabelecimento é o schema onde a linha está, e mudar de cliente seria mover a linha
-- para outro schema. Não há comando para isso que o papel da aplicação alcance: app_t_x não tem
-- privilégio nenhum em t_y (db/papel-do-cliente.md §7.3, prova de 42501 em T-0022), e uma migration
-- que citasse outro schema é recusada pelo carregador (RECUSAS.md §11.3). Uma coluna de cliente seria
-- pior que a ausência: ela poderia discordar do schema, e aí haveria duas respostas.
--
-- O NOME É DATADO (RN-NUC-051 b, PN-08; F-021 aceite 5)
--
-- name aqui é o nome com que a unidade nasceu, imutável. Cada mudança é uma linha de
-- establishment_name_changes, e o nome no instante T é o da última mudança com occurred_at <= T, ou o
-- de nascimento se não houver nenhuma. Alterar o nome nunca muda o que um fato passado exibe, porque o
-- nome antigo continua existindo com o instante dele. Guardar o nome de nascimento na própria linha,
-- em vez de numa primeira linha da outra tabela, é o que garante por NOT NULL que toda unidade tem nome
-- desde o primeiro instante, sem chave estrangeira circular.
--
-- O INSTANTE DE CRIAÇÃO VAI COPIADO NA MUDANÇA DE NOME
--
-- establishment_created_at entra na chave estrangeira composta, e o CHECK local compara os dois: uma
-- mudança de nome anterior ao nascimento da unidade não é gravável. É o mesmo recurso das migrations
-- seguintes, e o motivo é um só: comparar instantes entre linhas por chave estrangeira mais CHECK é o
-- que o banco garante sem gatilho e sem lock.
--
-- AUSÊNCIAS DECLARADAS (dados.md §3.1)
--
-- 1. Identidade fiscal do estabelecimento (inscrição, regime, responsável). Não nasce enquanto D-05 não
--    estiver aplicada ao modelo em F-020 (nucleo-estabelecimento.md §3).
-- 2. Estado "ativo" ou "encerrado" como coluna. É derivado dos fatos de tenant/0004 (RN-NUC-051,
--    RN-NUC-059, Não registra).
-- 3. Fuso e moeda. São membros da configuração publicada, com versão e vigência (RN-NUC-057,
--    RN-NUC-058), em tenant/0005, e nunca coluna do estabelecimento.
-- 4. Chave estrangeira de author_operator_id e de support_assignment_id. O sujeito (operador) e a
--    atribuição são de SPR-37, e nenhuma das duas tabelas existe. As colunas nascem NOT NULL onde o ato
--    tem autor, para que o fato não nasça sem autor (F-021, Depende de); a restrição entra em SPR-37,
--    por ADD CONSTRAINT NOT VALID mais VALIDATE (migrations.md §5). Até lá nenhum escritor existe: a
--    rota de negócio da Fase 2 espera este modelo. support_concession_id fica sem chave estrangeira
--    pelo mesmo motivo, sem data: a concessão não tem tabela.
-- 5. Chave estrangeira de support_enablement_fact_id. A tabela de fatos do terminal nasce em
--    tenant/0006, e a restrição entra em tenant/0007.
-- 6. Quem pode renomear. Não há linha na matriz para mudar o nome do estabelecimento, e sem linha a
--    operação é negada a todos (RN-NUC-026). O fato tem forma pronta, com autor; a célula é pergunta
--    para produto no relatório de T-0022.
-- 7. CHECK de received_at >= occurred_at. Os fatos daqui são atos com contato e nascem no servidor,
--    então os dois instantes coincidem; o CHECK deixaria de valer no dia em que um instante declarado
--    por terminal entrar nesta família, e retirá-lo seria remover restrição (migrations.md §4).
--
-- IDEMPOTÊNCIA (migrations.md §3)
--
-- IF NOT EXISTS com toda restrição nascendo junto da tabela, e CREATE OR REPLACE TRIGGER.
--
-- LOCK (migrations.md §5)
--
-- Só cria tabela nova. A chave estrangeira para roles e act_support_sources pede lock nas duas tabelas
-- de domínio, que ninguém escreve fora de migration.

CREATE TABLE IF NOT EXISTS establishments (
    establishment_id            uuid        NOT NULL,

    -- O nome de nascimento. O nome vigente em T mora em establishment_name_changes.
    name                        text        NOT NULL,

    occurred_at                 timestamptz NOT NULL,
    received_at                 timestamptz NOT NULL,

    -- Autor na forma de RN-NUC-029 (db/convencoes.md §11). Criar é do owner (matriz, linha 23).
    author_operator_id          uuid        NOT NULL,
    author_role_code            text            NULL,
    support_source_code         text        NOT NULL,
    support_assignment_id       uuid            NULL,
    support_concession_id       uuid            NULL,
    support_enablement_fact_id  uuid            NULL,

    CONSTRAINT establishments_pkey
        PRIMARY KEY (establishment_id),

    -- Alvo das chaves estrangeiras que copiam o instante de criação para compará-lo.
    CONSTRAINT establishments_creation_instant_key
        UNIQUE (establishment_id, occurred_at),

    CONSTRAINT establishments_name_check
        CHECK (char_length(name) BETWEEN 1 AND 200 AND name = btrim(name)),

    CONSTRAINT establishments_author_role_code_fkey
        FOREIGN KEY (author_role_code) REFERENCES roles (code),

    CONSTRAINT establishments_support_source_code_fkey
        FOREIGN KEY (support_source_code) REFERENCES act_support_sources (code),

    CONSTRAINT establishments_support_assignment_check
        CHECK ((support_source_code = 'assignment') = (support_assignment_id IS NOT NULL)),

    CONSTRAINT establishments_support_concession_check
        CHECK ((support_source_code = 'concession') = (support_concession_id IS NOT NULL)),

    CONSTRAINT establishments_support_enablement_check
        CHECK ((support_source_code = 'retained_identification_and_terminal_enablement')
               = (support_enablement_fact_id IS NOT NULL)),

    -- Identificar quem está no terminal não prova papel (RN-OFF-032, cláusula do teto): com a terceira
    -- fonte o papel é ausente, e com as outras ele é obrigatório.
    CONSTRAINT establishments_author_role_check
        CHECK ((support_source_code = 'retained_identification_and_terminal_enablement')
               = (author_role_code IS NULL))
);

CREATE INDEX IF NOT EXISTS establishments_author_role_code_idx
    ON establishments (author_role_code);

CREATE INDEX IF NOT EXISTS establishments_support_source_code_idx
    ON establishments (support_source_code);

COMMENT ON TABLE establishments IS
    'Estabelecimento (RN-NUC-050): a linha é o fato de criação, com autor e instante, e nunca muda. O cliente dele é o schema; o nome vigente em T está em establishment_name_changes; encerrar e reabrir estão em establishment_operation_changes.';

COMMENT ON COLUMN establishments.name IS
    'Nome com que a unidade nasceu. Nome em T: a última mudança com occurred_at <= T, ou este.';

CREATE OR REPLACE TRIGGER establishments_reject_mutation
    BEFORE UPDATE OR DELETE OR TRUNCATE ON establishments
    FOR EACH STATEMENT EXECUTE FUNCTION reject_mutation();

CREATE TABLE IF NOT EXISTS establishment_name_changes (
    name_change_id              uuid        NOT NULL,
    establishment_id            uuid        NOT NULL,

    -- Cópia do instante de criação, conferida pela chave estrangeira composta.
    establishment_created_at    timestamptz NOT NULL,

    name                        text        NOT NULL,

    occurred_at                 timestamptz NOT NULL,
    received_at                 timestamptz NOT NULL,

    author_operator_id          uuid        NOT NULL,
    author_role_code            text            NULL,
    support_source_code         text        NOT NULL,
    support_assignment_id       uuid            NULL,
    support_concession_id       uuid            NULL,
    support_enablement_fact_id  uuid            NULL,

    CONSTRAINT establishment_name_changes_pkey
        PRIMARY KEY (name_change_id),

    CONSTRAINT establishment_name_changes_establishment_fkey
        FOREIGN KEY (establishment_id, establishment_created_at)
        REFERENCES establishments (establishment_id, occurred_at),

    -- Duas mudanças no mesmo instante dariam dois nomes para T. A segunda é recusada.
    CONSTRAINT establishment_name_changes_instant_key
        UNIQUE (establishment_id, occurred_at),

    CONSTRAINT establishment_name_changes_after_creation_check
        CHECK (occurred_at > establishment_created_at),

    CONSTRAINT establishment_name_changes_name_check
        CHECK (char_length(name) BETWEEN 1 AND 200 AND name = btrim(name)),

    CONSTRAINT establishment_name_changes_author_role_code_fkey
        FOREIGN KEY (author_role_code) REFERENCES roles (code),

    CONSTRAINT establishment_name_changes_support_source_code_fkey
        FOREIGN KEY (support_source_code) REFERENCES act_support_sources (code),

    CONSTRAINT establishment_name_changes_support_assignment_check
        CHECK ((support_source_code = 'assignment') = (support_assignment_id IS NOT NULL)),

    CONSTRAINT establishment_name_changes_support_concession_check
        CHECK ((support_source_code = 'concession') = (support_concession_id IS NOT NULL)),

    CONSTRAINT establishment_name_changes_support_enablement_check
        CHECK ((support_source_code = 'retained_identification_and_terminal_enablement')
               = (support_enablement_fact_id IS NOT NULL)),

    CONSTRAINT establishment_name_changes_author_role_check
        CHECK ((support_source_code = 'retained_identification_and_terminal_enablement')
               = (author_role_code IS NULL))
);

-- A chave única da mudança por instante começa por establishment_id, e é ela que serve a pergunta
-- "nome de A em T" e a chave estrangeira para establishments.
CREATE INDEX IF NOT EXISTS establishment_name_changes_author_role_code_idx
    ON establishment_name_changes (author_role_code);

CREATE INDEX IF NOT EXISTS establishment_name_changes_support_source_code_idx
    ON establishment_name_changes (support_source_code);

COMMENT ON TABLE establishment_name_changes IS
    'Cada mudança do nome do estabelecimento, datada (RN-NUC-051 b). O nome em T é o da última linha com occurred_at <= T; sem linha, o de nascimento.';

CREATE OR REPLACE TRIGGER establishment_name_changes_reject_mutation
    BEFORE UPDATE OR DELETE OR TRUNCATE ON establishment_name_changes
    FOR EACH STATEMENT EXECUTE FUNCTION reject_mutation();

-- alvo: tenant
-- transacional: sim
-- reversivel: nao; cria tabela nova, e a inversa apagaria o fuso e a moeda que cada fato congelou
--
-- A configuração publicada do estabelecimento, com o fuso e a moeda. Regras: RN-NUC-057 e RN-NUC-058
-- (docs/produto/nucleo-estabelecimento.md), RN-NUC-013 e RN-NUC-014
-- (docs/produto/nucleo-publicacao-e-texto.md), matriz, linha 38.
--
-- A FORMA
--
-- Cada linha é uma versão publicada: número por unidade, vigência a partir de effective_from, autor e
-- instante de publicação. Publicar de novo é linha nova, nunca UPDATE (RN-NUC-014, PN-08); o fato da
-- venda congela configuration_id, e é isso que o torna reconstruível sem consultar o presente.
--
-- QUAL VERSÃO VIGE NO INSTANTE T
--
-- A de maior configuration_version entre as de effective_from <= T. Publicação posterior prevalece
-- sobre anterior no que as duas cobrem, e é isso que permite corrigir uma publicação agendada: v2 para
-- daqui a um mês, v3 hoje corrigindo um erro, v4 reagendando a mudança. Nenhum intervalo se sobrepõe a
-- outro, porque a regra de leitura desempata por versão, e versão é única por unidade.
--
-- Vigência retroativa é recusada (CHECK effective_from >= occurred_at): o erro de cadastro se corrige
-- por publicação com vigência declarada, nunca por reescrita do passado (RN-NUC-057 infeliz c, PN-08),
-- e uma vigência anterior à publicação mudaria "o que vigia em T" para instantes em que o terminal já
-- aplicou outra versão. É restrição a mais, falhando fechado; afrouxá-la é decisão de produto, e a
-- pergunta está no relatório de T-0022.
--
-- FUSO: A REGIÃO, NUNCA O DESLOCAMENTO (RN-NUC-057)
--
-- establishment_time_zone é nome de região do banco de fusos (America/Sao_Paulo, America/Manaus). Dois
-- CHECK: a forma Área/Local sem o prefixo Etc, que é onde moram os deslocamentos fixos (UTC, Etc/GMT+3);
-- e a existência, pela conversão de um instante fixo para o fuso, que falha com "time zone not
-- recognized" para nome que o servidor não conhece. A conversão timezone(text, timestamptz) é
-- IMMUTABLE no catálogo (medido, PostgreSQL 16, 2026-09-23), e o banco de fusos não remove nome: nome
-- aposentado vira apelido.
--
-- MOEDA (RN-NUC-058)
--
-- establishment_currency é o código alfabético de três letras da ISO 4217. O CHECK confere a forma, e
-- não a lista: a lista muda por norma de terceiro, e conferir pertinência é do backend na borda. Os dois
-- nomes de coluna são os do glossário (establishment_time_zone, establishment_currency).
--
-- AUSÊNCIAS DECLARADAS (dados.md §3.1)
--
-- 1. Modo de arredondamento da linha (RN-NUC-067), que é membro da mesma configuração (matriz, linha
--    38, e a tabela de RN-NUC-013). A forma do modo é G-09 e não está decidida. Quando estiver, entra
--    como coluna anulável aqui: versão publicada antes dela não tem modo, e "sem modo publicado" já é o
--    desfecho da regra (a linha que precisa arredondar não é lançada).
-- 2. Precisão de composição. Mesma linha 38, e mesma razão da ausência 1.
-- 3. Existência de fuso e moeda publicados como precondição de habilitar terminal (RN-NUC-061). É
--    conferência do backend, e a recusa é fato de RN-NUC-043. O banco garante o que ela lê: se há
--    versão vigente em T.
-- 4. Chave estrangeira de author_operator_id e de support_assignment_id: ausência 4 de tenant/0003.
-- 5. CHECK de received_at >= occurred_at: ausência 7 de tenant/0003.
--
-- IDEMPOTÊNCIA E LOCK
--
-- IF NOT EXISTS com toda restrição nascendo junto da tabela. Só cria objeto novo.

CREATE TABLE IF NOT EXISTS establishment_configurations (
    configuration_id            uuid        NOT NULL,
    establishment_id            uuid        NOT NULL,
    establishment_created_at    timestamptz NOT NULL,

    configuration_version       integer     NOT NULL,
    effective_from              timestamptz NOT NULL,

    establishment_time_zone     text        NOT NULL,
    establishment_currency      text        NOT NULL,

    occurred_at                 timestamptz NOT NULL,
    received_at                 timestamptz NOT NULL,

    -- Publicar a configuração é do owner, não delegável (matriz, linha 38).
    author_operator_id          uuid        NOT NULL,
    author_role_code            text            NULL,
    support_source_code         text        NOT NULL,
    support_assignment_id       uuid            NULL,
    support_concession_id       uuid            NULL,
    support_enablement_fact_id  uuid            NULL,

    CONSTRAINT establishment_configurations_pkey
        PRIMARY KEY (configuration_id),

    CONSTRAINT establishment_configurations_version_key
        UNIQUE (establishment_id, configuration_version),

    CONSTRAINT establishment_configurations_establishment_fkey
        FOREIGN KEY (establishment_id, establishment_created_at)
        REFERENCES establishments (establishment_id, occurred_at),

    CONSTRAINT establishment_configurations_version_check
        CHECK (configuration_version >= 1),

    CONSTRAINT establishment_configurations_order_check
        CHECK (occurred_at >= establishment_created_at AND effective_from >= occurred_at),

    CONSTRAINT establishment_configurations_time_zone_form_check
        CHECK (establishment_time_zone ~ '^[A-Z][A-Za-z]+(/[A-Za-z0-9_+-]+)+$'
               AND establishment_time_zone !~ '^Etc/'),

    CONSTRAINT establishment_configurations_time_zone_known_check
        CHECK ((timestamptz '2000-01-01 00:00:00+00' AT TIME ZONE establishment_time_zone) IS NOT NULL),

    CONSTRAINT establishment_configurations_currency_check
        CHECK (establishment_currency ~ '^[A-Z]{3}$'),

    CONSTRAINT establishment_configurations_author_role_code_fkey
        FOREIGN KEY (author_role_code) REFERENCES roles (code),

    CONSTRAINT establishment_configurations_support_source_code_fkey
        FOREIGN KEY (support_source_code) REFERENCES act_support_sources (code),

    CONSTRAINT establishment_configurations_support_assignment_check
        CHECK ((support_source_code = 'assignment') = (support_assignment_id IS NOT NULL)),

    CONSTRAINT establishment_configurations_support_concession_check
        CHECK ((support_source_code = 'concession') = (support_concession_id IS NOT NULL)),

    CONSTRAINT establishment_configurations_support_enablement_check
        CHECK ((support_source_code = 'retained_identification_and_terminal_enablement')
               = (support_enablement_fact_id IS NOT NULL)),

    CONSTRAINT establishment_configurations_author_role_check
        CHECK ((support_source_code = 'retained_identification_and_terminal_enablement')
               = (author_role_code IS NULL))
);

-- "Versão vigente de A em T" percorre (establishment_id, effective_from) e desempata por versão; a
-- chave única da versão começa por establishment_id e serve a chave estrangeira para a unidade.
CREATE INDEX IF NOT EXISTS establishment_configurations_effective_idx
    ON establishment_configurations (establishment_id, effective_from);

CREATE INDEX IF NOT EXISTS establishment_configurations_author_role_code_idx
    ON establishment_configurations (author_role_code);

CREATE INDEX IF NOT EXISTS establishment_configurations_support_source_code_idx
    ON establishment_configurations (support_source_code);

COMMENT ON TABLE establishment_configurations IS
    'Configuração publicada do estabelecimento (RN-NUC-013, linha 38 da matriz): versão, vigência, fuso e moeda. Vige em T a maior versão com effective_from <= T. O fato congela configuration_id.';

COMMENT ON COLUMN establishment_configurations.establishment_time_zone IS
    'Fuso do estabelecimento por região, nunca por deslocamento fixo (RN-NUC-057). É o único fuso do núcleo.';

COMMENT ON COLUMN establishment_configurations.establishment_currency IS
    'Moeda do estabelecimento, código ISO 4217 de três letras (RN-NUC-058). Leitura que soma unidades agrupa por ela.';

CREATE OR REPLACE TRIGGER establishment_configurations_reject_mutation
    BEFORE UPDATE OR DELETE OR TRUNCATE ON establishment_configurations
    FOR EACH STATEMENT EXECUTE FUNCTION reject_mutation();

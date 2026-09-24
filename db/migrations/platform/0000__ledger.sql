-- alvo: platform
-- transacional: sim
-- reversivel: nao; cria schema e tabela novos, e a inversa apagaria o registro do que já foi
--             aplicado em cada schema, o que migrations.md §4 proíbe
--
-- O livro-razão de migrations. Semântica das colunas: db/migrator/CONTRATO.md §5.
--
-- COMO O EXECUTOR SABE QUE ESTA MIGRATION AINDA NÃO RODOU
--
-- Esta é a migration que cria a tabela que registra migrations, então ela é a única do sistema que
-- não pode perguntar ao ledger se já rodou. O executor descobre isso pelo catálogo, antes de abrir
-- qualquer transação de aplicação (CONTRATO.md §9):
--
--     SELECT to_regclass('platform.schema_migrations') IS NULL;
--
-- Verdadeiro significa banco novo, ou banco anterior ao ledger: o executor aplica este arquivo
-- primeiro, numa transação só, e nessa mesma transação grava a linha que registra a própria 0000.
-- Essa linha não está escrita aqui porque ela carrega o checksum deste arquivo, e nenhum arquivo
-- contém o próprio checksum. Falso significa que o ledger já responde por si, e daí em diante é ele
-- quem decide o que está pendente, inclusive sobre esta versão.
--
-- A verificação de checksum da CONTRATO.md §3 acontece depois do bootstrap, pela mesma razão: antes
-- dele não existe onde ler checksum registrado.
--
-- IDEMPOTÊNCIA (migrations.md §3)
--
-- As duas guardas abaixo são de existência, e toda restrição nasce junto do CREATE TABLE, nunca por
-- alteração posterior. Uma segunda rodada encontra schema e tabela prontos e não faz nada; não
-- existe estado parcial observável, porque nenhum passo depende de outro ter acontecido antes.
--
-- Configuração de sessão, lock_timeout inclusive, é do executor (CONTRATO.md §6), não deste arquivo.

CREATE SCHEMA IF NOT EXISTS platform;

CREATE TABLE IF NOT EXISTS platform.schema_migrations (
    schema_name  text        NOT NULL,
    version      text        NOT NULL,
    checksum     text        NOT NULL,
    module       text            NULL,
    started_at   timestamptz NOT NULL,
    applied_at   timestamptz     NULL,
    duration_ms  integer         NULL,

    CONSTRAINT schema_migrations_pkey
        PRIMARY KEY (schema_name, version),

    -- O nome cabe no identificador do Postgres. O formato do nome de cliente não é conferido aqui:
    -- esta tabela registra também o schema platform, e a regra de formato mora na coluna do registro
    -- de clientes (CONTRATO.md §10, camada 2).
    CONSTRAINT schema_migrations_schema_name_check
        CHECK (octet_length(schema_name) BETWEEN 1 AND 63),

    CONSTRAINT schema_migrations_version_check
        CHECK (octet_length(version) > 0),

    -- sha-256 em hexadecimal minúsculo, sem normalização (CONTRATO.md §3). O formato entra como
    -- restrição para que o ledger não aceite um checksum que nunca poderia bater.
    CONSTRAINT schema_migrations_checksum_check
        CHECK (checksum ~ '^[0-9a-f]{64}$'),

    -- Módulo ausente é NULL. Texto vazio seria um segundo jeito de dizer "nenhum", e os dois
    -- conviveriam sem sintoma até alguém agrupar por módulo.
    CONSTRAINT schema_migrations_module_check
        CHECK (module IS NULL OR octet_length(module) > 0),

    CONSTRAINT schema_migrations_duration_ms_check
        CHECK (duration_ms IS NULL OR duration_ms >= 0),

    -- Conclusão é um estado só: duration_ms é escrito junto de applied_at (CONTRATO.md §5). Sem esta
    -- restrição caberia uma linha concluída sem duração e uma linha em voo com duração, e as duas
    -- mentiriam para a retomada.
    CONSTRAINT schema_migrations_completion_check
        CHECK ((applied_at IS NULL) = (duration_ms IS NULL))
);

COMMENT ON TABLE platform.schema_migrations IS
    'Livro-razão de migrations: uma linha por (schema, versão) aplicada. Linha nunca é removida.';

COMMENT ON COLUMN platform.schema_migrations.version IS
    'Caminho do arquivo relativo a db/migrations/, sem .sql. Exemplo: platform/0000__ledger.';

COMMENT ON COLUMN platform.schema_migrations.applied_at IS
    'NULL significa iniciada e não concluída: não-transacional que a rodada anterior deixou em voo.';

COMMENT ON COLUMN platform.schema_migrations.module IS
    'Nome do módulo. NULL para platform e para o núcleo.';

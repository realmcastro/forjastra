-- alvo: tenant
-- transacional: sim
-- reversivel: nao; cria tabelas de domínio que os fatos seguintes referenciam, e a inversa apagaria o
--             vocabulário com que cada fato diz em que o ato se sustentou
--
-- A trava append-only do schema de cliente e os dois domínios fechados que o autor de um ato usa:
-- papel e fonte de sustentação. Forma do autor: db/convencoes.md §11.
--
-- POR QUE ESTE ARQUIVO EXISTE
--
-- Todo fato humano de F-021 (criar, renomear, encerrar e reabrir estabelecimento, publicar a
-- configuração, habilitar, descomissionar e declarar terminal comprometido) registra autor, papel e
-- instante (RN-NUC-051, RN-NUC-059, RN-NUC-061). O autor não é uma chave para o sujeito, e sim a forma
-- de RN-NUC-029: o operador MAIS em que o ato se sustentou, que é uma de três fontes e nunca nenhuma.
-- É a condição de forma que docs/arquitetura/d-06-trilha-residencia-2026-09-23.md §8 deixou para este
-- item: com a fonte em tabela de domínio e uma coluna de referência por fonte, uma quarta fonte (ato
-- nosso) entra por linha nova aqui e coluna anulável na tabela do fato, sem tirar NOT NULL nem
-- afrouxar CHECK de nada que já existe.
--
-- POR QUE TABELA DE DOMÍNIO E NÃO CHECK
--
-- dados.md §3: acrescentar valor a enum em N schemas é migration, inserir linha não é. Os papéis
-- crescem por módulo (production_operator é do COZ, docs/produto/glossario.md), e a fonte de
-- sustentação cresce uma vez já prevista. As duas tabelas são semeadas aqui, por código estável.
--
-- A TRAVA APPEND-ONLY
--
-- O papel do cliente tem SELECT, INSERT e UPDATE em todo o schema, sem distinção de família
-- (db/papel-do-cliente.md §7.3, "O privilégio não distingue fato de cadastro"). Quem impede o UPDATE
-- num fato é o gatilho, no mesmo desenho de platform.reject_mutation da platform/0002. Esta é a cópia
-- de cliente dela, e não uma chamada àquela: função de outro schema seria referência qualificada, que
-- o carregador recusa (RECUSAS.md §11.3), e o corpo não referencia objeto nenhum, então não depende de
-- search_path. A mensagem não nomeia o schema: o erro sobe pela aplicação, e nome de schema não sai
-- para o usuário (backend.md §3).
--
-- AUSÊNCIAS DECLARADAS (dados.md §3.1)
--
-- 1. Timestamps nas duas tabelas de domínio. São semente de migration, nunca alteradas (o gatilho
--    recusa UPDATE): o instante em que um código passou a existir é o da migration, e o livro-razão já
--    o registra. Mesmo desenho de platform.executor_event_kinds (platform/0004).
-- 2. Trava contra INSERT do papel do cliente nestas tabelas. O privilégio padrão concede INSERT em
--    todo o schema e não há como separar tabela de domínio por privilégio sem tocar no ato de
--    db/papel-do-cliente.md §7.3, que está fora deste item. Um código inserido pela aplicação não
--    apaga nem reescreve nada; o risco está no relatório de T-0022 para quem é dono daquele ato.
-- 3. Papel do provedor como concessão. provider_support entra como código porque o ato sob concessão
--    precisa nomeá-lo (RN-NUC-024); a concessão em si não é modelada aqui.
--
-- IDEMPOTÊNCIA (migrations.md §3)
--
-- IF NOT EXISTS, CREATE OR REPLACE e semente com ON CONFLICT DO NOTHING: rodar o corpo duas vezes não
-- muda nada.
--
-- LOCK (migrations.md §5)
--
-- Só cria objeto novo. Nenhuma tabela existente é tocada.

-- O corpo não referencia objeto nenhum, então não depende de search_path. TG_TABLE_NAME e TG_OP vêm do
-- gatilho, e toda tabela append-only do schema usa esta função.
CREATE OR REPLACE FUNCTION reject_mutation() RETURNS trigger
LANGUAGE plpgsql AS $fn$
BEGIN
    RAISE EXCEPTION
        'a tabela % não aceita %: a linha é registrada uma vez e nunca alterada',
        TG_TABLE_NAME, TG_OP
        USING HINT =
            'Corrigir é registrar um fato novo que referencia o anterior. Tirar de circulação é '
            'vigência ou fato de mudança de estado, nunca remoção de linha.';
END;
$fn$;

COMMENT ON FUNCTION reject_mutation() IS
    'Recusa UPDATE, DELETE e TRUNCATE na tabela em que estiver instalada. Genérica: nomeia a tabela e a operação pelo contexto do gatilho, e não o schema.';

CREATE TABLE IF NOT EXISTS roles (
    code         text NOT NULL,
    description  text NOT NULL,

    CONSTRAINT roles_pkey
        PRIMARY KEY (code),

    CONSTRAINT roles_code_check
        CHECK (code ~ '^[a-z][a-z0-9_]{2,60}$'),

    CONSTRAINT roles_description_check
        CHECK (octet_length(description) BETWEEN 1 AND 200)
);

COMMENT ON TABLE roles IS
    'Domínio dos papéis que um operador porta (glossario.md §1.6). O núcleo semeia os seus; módulo acrescenta os dele por migration própria. O papel gravado num fato é o do instante do ato.';

CREATE OR REPLACE TRIGGER roles_reject_mutation
    BEFORE UPDATE OR DELETE OR TRUNCATE ON roles
    FOR EACH STATEMENT EXECUTE FUNCTION reject_mutation();

INSERT INTO roles (code, description) VALUES
    ('cashier',          'Papel-piso do núcleo: opera a venda. Escopo: estabelecimento.'),
    ('manager',          'Autoriza a exceção e responde pelo dinheiro do estabelecimento. Escopo: estabelecimento.'),
    ('owner',            'Decide o que o negócio vende, por quanto, e o que cada papel autoriza. Escopo: cliente (tenant).'),
    ('fiscal_officer',   'Responde pelo uso do poder de assinar em nome do estabelecimento (RN-EMI-036). Escopo: estabelecimento.'),
    ('provider_support', 'Papel do provedor no ambiente do cliente, só como concessão com escopo, prazo e motivo (RN-NUC-024).')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS act_support_sources (
    code         text NOT NULL,
    description  text NOT NULL,

    CONSTRAINT act_support_sources_pkey
        PRIMARY KEY (code),

    CONSTRAINT act_support_sources_code_check
        CHECK (code ~ '^[a-z][a-z0-9_]{2,60}$'),

    CONSTRAINT act_support_sources_description_check
        CHECK (octet_length(description) BETWEEN 1 AND 200)
);

COMMENT ON TABLE act_support_sources IS
    'Em que um ato se sustentou (RN-NUC-029): uma de três fontes, nunca nenhuma. Cada fonte tem a sua coluna de referência na tabela do fato, e fonte nova entra com linha aqui e coluna anulável lá.';

CREATE OR REPLACE TRIGGER act_support_sources_reject_mutation
    BEFORE UPDATE OR DELETE OR TRUNCATE ON act_support_sources
    FOR EACH STATEMENT EXECUTE FUNCTION reject_mutation();

INSERT INTO act_support_sources (code, description) VALUES
    ('assignment',                                  'Atribuição: papel de cliente que alcança a operação pelo próprio papel. Referência: support_assignment_id.'),
    ('concession',                                  'Concessão de provider_support (RN-NUC-024 d). Referência: support_concession_id.'),
    ('retained_identification_and_terminal_enablement', 'Identificação retida mais habilitação do terminal a vender: o ato ordinário sem contato. Referência: support_enablement_fact_id; sem papel.')
ON CONFLICT DO NOTHING;

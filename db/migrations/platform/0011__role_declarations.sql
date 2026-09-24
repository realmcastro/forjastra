-- alvo: platform
-- transacional: sim
-- reversivel: nao; cria tabela nova, e a inversa apagaria a única resposta para "quem nós
--             declaramos como legítimo", que é o que a §7.5.1 passou a consultar
--
-- O registro dos papéis que nós declaramos legítimos. Semântica: db/universo-e-declaracao.md §7.5.4.
--
-- POR QUE ESTE ARQUIVO EXISTE
--
-- A camada de papel reabriu oito vezes, e os oito achados têm a mesma anatomia: a pergunta invertida
-- da §7.5.1 enumera quem alcança o schema de um cliente e depois EXCLUI os legítimos por uma
-- propriedade que o próprio beneficiário carrega. NOT admin_option (PAP-14), membro do grupo com
-- LOGIN ou com admin_option (PAP-20), dependência de extensão (PAP-21), dono do schema (PAP-22), o
-- nome que vem do ambiente (PAP-19). Cada propriedade dessas é concedida por quem ataca:
-- GRANT ... WITH ADMIN OPTION, CREATE ROLE ... LOGIN, ALTER EXTENSION ... ADD,
-- ALTER SCHEMA ... OWNER TO, uma linha no .env. Toda exclusão por propriedade que o excluído carrega
-- é uma exclusão que ele se concede, e é por isso que cada conserto abria o buraco seguinte uma casa
-- ao lado (docs/auditorias/2026-09-12-reauditoria-camada-de-papel.md §3).
--
-- Esta tabela é o outro lado: a exclusão passa a ser IDENTIDADE REGISTRADA POR NÓS, conferida por
-- nome literal. Um papel que não está aqui alcança indevidamente, seja qual for a propriedade que
-- ele carregue. A regra que a substitui, em uma frase: propriedade do catálogo só pode ACUSAR,
-- nunca DESCULPAR.
--
-- QUEM ESCREVE, E QUANDO
--
-- O executor, em provision e em migrate, depois de o ato do operador ser conferido (§7.7) e antes de
-- tocar em papel de cliente. Duas linhas por banco em regime normal: o papel com que o executor
-- conecta e a credencial que o ambiente nomeia. A rotação da §7.7 é uma terceira linha, datada, e
-- não uma inferência sobre quem está no grupo hoje.
--
-- verify NUNCA escreve aqui, e é o que mantém a pergunta honesta: quem só verifica não consegue
-- ampliar o conjunto que a verificação desculpa.
--
-- O QUE ESTA TABELA NÃO ALCANÇA, E É DECLARADO
--
-- 1. Quem tem a conexão do executor amplia o conjunto rodando migrate com outro nome no ambiente.
--    Isso não é fuga nova: esse papel já alcança todo schema de cliente por ser dono deles. O que a
--    tabela entrega é que a ampliação vira LINHA DATADA e evento app_role_declared, em vez de um
--    estado que nenhum comando nomeia. A trava contra o .env copiado continua sendo a recusa de
--    borda da §7.7 (PAP-07), que confere o nome contra o catálogo.
-- 2. Superusuário passa por cima de tudo, aqui como no gatilho da 0002.
-- 3. Banco provisionado antes desta migration não tem declaração nenhuma, e o primeiro verify
--    depois dela acusa o executor e a credencial como alcance de terceiro. É falha fechada e a saída
--    é uma rodada de migrate, que declara as duas. Não existe cliente em operação nesta data
--    (2026-09-12), então o custo real é zero; a alternativa — verify declarando o que encontra —
--    seria a verificação confiando no estado que ela existe para julgar.
--
-- COMO D-04 SE APLICA AQUI
--
-- Chave uuid sem DEFAULT: a regra de geração é ordenada no tempo e vive na borda que cria a linha
-- (o executor), e o gerador nativo do Postgres produz valor aleatório, que é a saída recusada.
--
-- Família de registro de processo (dados.md §3): instante próprio, declared_at, e nada de
-- created_at redundante nem de updated_at. A linha nunca é alterada — o gatilho abaixo é a trava —,
-- e retirar um papel de circulação não é UPDATE nem DELETE: é REVOKE no banco, e a partir dele a
-- linha vira histórico de uma legitimidade que já não alcança nada. Nenhuma coluna de exclusão
-- lógica (db/convencoes.md §4).
--
-- POR QUE role_kind É CHECK E NÃO TABELA DE DOMÍNIO
--
-- dados.md §3 manda tabela de lookup em vez de enum porque acrescentar valor a enum em N schemas é
-- migration. Aqui os dois valores não são um domínio que cresce: eles são os dois papéis que o ato
-- do operador da §7.2 cria, e um terceiro exigiria reescrever aquela seção e esta verificação junto
-- — ou seja, migration de qualquer forma. Uma tabela de duas linhas custaria FK, seed e um segundo
-- gatilho de imutabilidade para não ganhar nada.
--
-- IDEMPOTÊNCIA (migrations.md §3)
--
-- Guarda de existência, toda restrição nascendo junto do CREATE TABLE, e CREATE OR REPLACE TRIGGER.
-- Segunda rodada encontra tudo pronto e não faz nada.

CREATE TABLE IF NOT EXISTS platform.role_declarations (
    declaration_id uuid        NOT NULL,

    -- O nome literal do papel de banco. É por ele, e só por ele, que a §7.5.1 exclui.
    role_name      text        NOT NULL,

    -- 'executor' ou 'app_credential'. O que ele decide: a credencial declarada precisa continuar
    -- membro do grupo para ser excluída (§7.5.1), e o dono de platform e de cada t_* precisa ser um
    -- executor declarado (§7.5.4). Kind errado enfraquece as duas, e é por isso que ele é gravado
    -- pelo mesmo ato que já distingue os dois papéis.
    role_kind      text        NOT NULL,

    -- O papel que emitiu a declaração, lido de current_user. Quem ampliou o conjunto fica nomeado.
    declared_by    text        NOT NULL,

    declared_at    timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT role_declarations_pkey
        PRIMARY KEY (declaration_id),

    -- Um papel, uma declaração. O ON CONFLICT DO NOTHING do executor se apoia nesta restrição, e é
    -- ela que faz da segunda rodada um no-op em vez de uma segunda linha.
    CONSTRAINT role_declarations_role_name_key
        UNIQUE (role_name),

    CONSTRAINT role_declarations_role_name_check
        CHECK (octet_length(role_name) >= 1 AND octet_length(role_name) <= 63),

    CONSTRAINT role_declarations_declared_by_check
        CHECK (octet_length(declared_by) >= 1 AND octet_length(declared_by) <= 63),

    CONSTRAINT role_declarations_role_kind_check
        CHECK (role_kind IN ('executor', 'app_credential'))
);

COMMENT ON TABLE platform.role_declarations IS
    'Os papéis de banco que o executor declarou legítimos. A pergunta invertida da §7.5.1 exclui por nome contra esta tabela, nunca por propriedade do catálogo. Linha nunca é alterada nem removida.';

COMMENT ON COLUMN platform.role_declarations.role_name IS
    'Nome literal do papel. Ausência aqui é alcance indevido, seja qual for a propriedade que o papel carregue.';

COMMENT ON COLUMN platform.role_declarations.role_kind IS
    'executor ou app_credential: decide a condição de permanência da credencial (§7.5.1) e quem pode ser dono de schema (§7.5.4).';

COMMENT ON COLUMN platform.role_declarations.declared_by IS
    'O papel que emitiu a declaração. Ampliar o conjunto de exclusões deixa autor e data.';

COMMENT ON COLUMN platform.role_declarations.declared_at IS
    'Instante da declaração. É registro de processo: não há created_at nem updated_at ao lado (dados.md §3).';

-- A mesma função genérica da 0002, e pela mesma razão: declaração alterada em silêncio seria uma
-- exclusão nova sem autor e sem data, que é exatamente o que esta tabela existe para impedir.
-- FOR EACH STATEMENT cobre TRUNCATE e o DELETE que não casa linha nenhuma (0002).
CREATE OR REPLACE TRIGGER role_declarations_reject_mutation
    BEFORE UPDATE OR DELETE OR TRUNCATE ON platform.role_declarations
    FOR EACH STATEMENT EXECUTE FUNCTION platform.reject_mutation();

COMMENT ON TRIGGER role_declarations_reject_mutation ON platform.role_declarations IS
    'A declaração é append-only: retirar um papel de circulação é REVOKE no banco, nunca UPDATE ou DELETE aqui.';

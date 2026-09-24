-- alvo: platform
-- transacional: sim
-- reversivel: nao; cria tabela nova, e a inversa apagaria a única resposta para "quem o operador
--             disse que não é mais legítimo", que é o que a §7.5.1 passa a consultar
--
-- A retratação de uma declaração de papel. Semântica e procedimento: db/universo-e-declaracao.md
-- §7.5.4, "Retirar uma declaração".
--
-- POR QUE ESTE ARQUIVO EXISTE
--
-- platform.role_declarations (0011) é append-only e não tinha saída: uma declaração errada, ou a de
-- uma credencial aposentada no fim da rotação da §7.7, ficava lá para sempre. O nono gate
-- (docs/auditorias/2026-09-23-nono-gate-camada-de-papel.md, PAP-30) mediu o efeito: a credencial já
-- fora do grupo e sem papel de cliente continuava produzindo, em todo verify, uma instrução que já
-- tinha sido cumprida. Depois de N rotações ficam N linhas iguais, e a linha que importa se perde
-- entre elas. O risco já vinha do gate anterior, sem procedimento escrito.
--
-- A saída não é UPDATE nem DELETE na 0011, que aplicada não se edita e cuja trava é o ponto dela. É
-- uma LINHA NOVA, nesta tabela: a declaração continua de pé como histórico, e a retratação diz desde
-- quando, por quem e por quê ela deixou de valer.
--
-- O QUE A RETRATAÇÃO FAZ, E O QUE ELA NÃO FAZ
--
-- Ela só ESTREITA. Declaração retratada deixa de desculpar alcance na §7.5.1, deixa de desculpar
-- posse de schema na §7.5.4 e deixa de ser nomeada como declaração a mais. Nenhuma pergunta passa a
-- desculpar coisa nenhuma por causa dela: quem escreve aqui só consegue fazer o verify acusar mais.
-- É por isso que a tabela aceita INSERT do dono (o executor, que criou o schema) sem trava própria:
-- o pior que ele faz com ela é retratar a si mesmo, e aí todo schema nosso passa a ser acusado.
--
-- É TERMINAL. Um nome, uma retratação, e a 0011 tem UNIQUE (role_name): o nome retratado não volta a
-- ser declarado, e provision e migrate recusam uma rodada que o traga (saída 2). Quem precisar de
-- novo daquele papel cria outro nome. Reabrir um nome retratado seria a ampliação da exclusão por
-- uma linha escrita à mão, que é exatamente o que a §7.5.4 existe para impedir.
--
-- COMO D-04 SE APLICA AQUI
--
-- Quem escreve é o operador, no psql, e não o executor: a borda que cria a linha é a própria sessão
-- do banco. Por isso a chave tem DEFAULT, ao contrário da 0011, e o DEFAULT é ordenado no tempo
-- (versão 7: os 48 bits de milissegundo de clock_timestamp() sobre os bits aleatórios de
-- gen_random_uuid(), com o nibble de versão trocado de 4 para 7). A recusa da 0011 era ao gerador
-- nativo aleatório, e ela continua valendo.
--
-- Família de registro de processo (dados.md §3): o instante próprio, retracted_at, e nada de
-- created_at nem de updated_at. retracted_by sai de current_user. O motivo é obrigatório: fato sem
-- porquê é a pergunta que ninguém consegue responder seis meses depois (invariante 10).
--
-- IDEMPOTÊNCIA (migrations.md §3)
--
-- Guarda de existência, toda restrição nascendo junto do CREATE TABLE, e CREATE OR REPLACE TRIGGER.

CREATE TABLE IF NOT EXISTS platform.role_retractions (
    retraction_id uuid        NOT NULL
        DEFAULT encode(
            set_bit(
                set_bit(
                    overlay(uuid_send(gen_random_uuid())
                            placing substring(int8send(floor(extract(epoch from clock_timestamp()) * 1000)::bigint) from 3)
                            from 1 for 6),
                    52, 1),
                53, 1),
            'hex')::uuid,

    -- O nome literal do papel cuja declaração deixa de valer. A chave estrangeira impede a
    -- retratação de um nome que nunca foi declarado, que seria um erro de digitação calado.
    role_name      text        NOT NULL,

    -- Por que a declaração deixou de valer: fim de rotação, declaração errada, linha plantada.
    reason         text        NOT NULL,

    retracted_by   text        NOT NULL DEFAULT current_user,

    retracted_at   timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT role_retractions_pkey
        PRIMARY KEY (retraction_id),

    -- Um nome, uma retratação: ela é terminal. O índice desta restrição é também o da chave
    -- estrangeira abaixo (dados.md §3, toda FK tem índice).
    CONSTRAINT role_retractions_role_name_key
        UNIQUE (role_name),

    CONSTRAINT role_retractions_role_name_fkey
        FOREIGN KEY (role_name) REFERENCES platform.role_declarations (role_name),

    CONSTRAINT role_retractions_reason_check
        CHECK (octet_length(reason) >= 1 AND octet_length(reason) <= 500),

    CONSTRAINT role_retractions_retracted_by_check
        CHECK (octet_length(retracted_by) >= 1 AND octet_length(retracted_by) <= 63)
);

COMMENT ON TABLE platform.role_retractions IS
    'Retratação de declaração de papel, escrita pelo operador. Declaração retratada deixa de desculpar qualquer alcance. Terminal: o nome não volta a ser declarado. Linha nunca é alterada nem removida.';

COMMENT ON COLUMN platform.role_retractions.role_name IS
    'Nome literal do papel declarado em platform.role_declarations cuja declaração deixa de valer.';

COMMENT ON COLUMN platform.role_retractions.reason IS
    'Por que a declaração deixou de valer. Obrigatório.';

COMMENT ON COLUMN platform.role_retractions.retracted_by IS
    'O papel que emitiu a retratação, lido de current_user.';

COMMENT ON COLUMN platform.role_retractions.retracted_at IS
    'Instante da retratação. É registro de processo: não há created_at nem updated_at ao lado (dados.md §3).';

CREATE OR REPLACE TRIGGER role_retractions_reject_mutation
    BEFORE UPDATE OR DELETE OR TRUNCATE ON platform.role_retractions
    FOR EACH STATEMENT EXECUTE FUNCTION platform.reject_mutation();

COMMENT ON TRIGGER role_retractions_reject_mutation ON platform.role_retractions IS
    'A retratação é append-only e terminal: desfazê-la seria reabrir uma exclusão por linha escrita à mão.';

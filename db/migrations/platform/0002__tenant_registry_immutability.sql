-- alvo: platform
-- transacional: sim
-- reversivel: nao; a inversa devolveria ao registro de clientes a mutabilidade que este arquivo
--             existe para tirar, e "voltar a aceitar UPDATE" não é reversão, é o defeito
--
-- A trava que faltava em platform.tenants. Semântica: db/migrator/CONTRATO.md §18.
--
-- POR QUE ESTE ARQUIVO EXISTE
--
-- A 0001 declara a linha imutável em prosa e em COMMENT ON TABLE, e não tem trava nenhuma. O gate de
-- segurança mediu a consequência em 2026-09-11 (MIG-09,
-- docs/auditorias/2026-09-11-executor-e-schema-platform-reauditoria.md, prova P12): com a credencial
-- do executor, dois comandos — remover a linha de um cliente e reescrever o slug de outro — fazem o
-- tenant_id de um cliente resolver para o schema do outro, e o auditor leu o dado de lá. O created_at
-- não muda, então a linha não carrega sinal de ter mudado; migrate não vê drift, porque o schema
-- existe e está registrado; e verify compara estrutura, que continua certa.
--
-- É o invariante 1 do CLAUDE.md §7 caindo, e migration aplicada não se edita (migrations.md §1):
-- por isso a correção é arquivo novo, e não uma linha a mais na 0001.
--
-- O QUE ESTE ARQUIVO NÃO ALCANÇA, E É MEDIDO
--
-- 1. O DONO DA TABELA. Medido em 2026-09-11: ALTER TABLE ... DISABLE TRIGGER é aceito do dono, e
--    depois dele o DELETE passa. O executor é dono porque criou o schema, e tirar dele a posse desta
--    tabela custaria a atomicidade entre a linha do livro-razão e o efeito da migration
--    (CONTRATO.md §18.3). O que esta trava entrega é transformar um comando em três atos deliberados
--    e nomeáveis; ela não entrega impossibilidade para quem tem a credencial e decide.
-- 2. O SUPERUSUÁRIO. session_replication_role = 'replica' desliga todo gatilho. Medido: o papel do
--    executor leva "permission denied to set parameter", então esse caminho exige superusuário.
-- 3. O ATO RECUSADO NÃO VIRA LINHA. O gatilho lança, a transação morre, e nenhuma tabela poderia
--    guardar a tentativa dentro dela. A captura que existe é o log de erro do servidor, que registra
--    ERROR e STATEMENT (medido, com log_min_error_statement no padrão). A ausência é declarada aqui
--    por invariante 10, e a casa possível é uma segunda conexão, que é o mesmo desenho de
--    platform.executor_events (0004) — e não o caminho que esta migration toma, porque quem emite o
--    comando recusado é uma pessoa no psql, não o executor.
--
-- IDEMPOTÊNCIA (migrations.md §3)
--
-- CREATE OR REPLACE nas duas formas, medido rodando duas vezes: a função é substituída pelo mesmo
-- corpo e o gatilho continua sendo um só em pg_trigger. Nenhum passo depende de outro ter acontecido.

CREATE OR REPLACE FUNCTION platform.reject_mutation() RETURNS trigger
LANGUAGE plpgsql AS $fn$
BEGIN
    -- Genérica de propósito: TG_TABLE_SCHEMA, TG_TABLE_NAME e TG_OP vêm do gatilho, então toda
    -- tabela append-only do controle usa esta função e nenhuma precisa da própria. Ela nasce com o
    -- primeiro uso, como o gatilho genérico de updated_at de D-04 §8.
    -- O corpo não referencia objeto nenhum, então não depende de search_path.
    RAISE EXCEPTION
        '%.% não aceita %: a linha é registrada uma vez e nunca alterada',
        TG_TABLE_SCHEMA, TG_TABLE_NAME, TG_OP
        USING HINT =
            'Corrigir um registro errado é ato deliberado do dono da tabela, com o gatilho '
            'desligado e a razão escrita. Encerrar cliente é fato, não remoção de linha.';
END;
$fn$;

COMMENT ON FUNCTION platform.reject_mutation() IS
    'Recusa UPDATE, DELETE e TRUNCATE na tabela em que estiver instalada. Genérica: nomeia a tabela e a operação pelo contexto do gatilho.';

-- FOR EACH STATEMENT, e não FOR EACH ROW, por três razões medidas: TRUNCATE só admite gatilho de
-- comando; um DELETE que não casa linha nenhuma (WHERE false) não dispara gatilho de linha e passaria
-- sem recusa; e a recusa não precisa ler OLD nem NEW, porque nenhuma mutação é legítima aqui.
CREATE OR REPLACE TRIGGER tenants_reject_mutation
    BEFORE UPDATE OR DELETE OR TRUNCATE ON platform.tenants
    FOR EACH STATEMENT EXECUTE FUNCTION platform.reject_mutation();

COMMENT ON TRIGGER tenants_reject_mutation ON platform.tenants IS
    'A trava do COMMENT ON TABLE da 0001: a linha do registro de clientes é imutável. Sem ela, dois comandos fazem um cliente resolver para o schema de outro.';

-- alvo: platform
-- transacional: sim
-- reversivel: nao; a inversa devolveria ao livro-razão a mutabilidade que este arquivo tira, e o
--             checksum é a única prova de adulteração que este sistema tem
--
-- A trava do livro-razão. Semântica: db/migrator/CONTRATO.md §18.
--
-- POR QUE ESTE ARQUIVO EXISTE
--
-- A 0000 declara "Linha nunca é removida" em COMMENT ON TABLE, e a 0001 declarava a mesma coisa sobre
-- o registro de clientes. O gate de segurança mediu a segunda e ela não se sustentava (MIG-09); a
-- primeira nunca foi medida, e o mecanismo que a desmente é o mesmo comando na mesma credencial.
-- A consequência aqui é de outra natureza e é pior de um jeito: UPDATE em schema_migrations.checksum
-- alinha o registro ao arquivo editado, e a divergência que CONTRATO.md §3 chama de "o mais próximo
-- de evidência de adulteração que este sistema tem" deixa de existir sem deixar rastro.
--
-- A ÚNICA ATUALIZAÇÃO LEGÍTIMA, E POR QUE ELA É UMA SÓ
--
-- CONTRATO.md §8 passo 5: a migration não-transacional grava a linha com applied_at nulo antes do
-- corpo ("em voo") e a conclui depois. Essa transição — applied_at de nulo para preenchido — é a
-- única atualização que o executor emite no livro-razão, em todo o desenho. Tudo mais é reescrita.
-- duration_ms não aparece na condição abaixo de propósito: schema_migrations_completion_check já
-- amarra os dois, então testá-lo aqui seria uma segunda verdade sobre a mesma regra.
--
-- O QUE ESTE ARQUIVO NÃO ALCANÇA
--
-- O mesmo da 0002, medido lá e não repetido aqui: o dono desliga o gatilho, o superusuário desliga
-- todos, e o ato recusado vira linha no log de erro do servidor, não em tabela.
--
-- IDEMPOTÊNCIA (migrations.md §3)
--
-- CREATE OR REPLACE nas duas formas. Segunda rodada substitui a função pelo mesmo corpo e mantém um
-- gatilho de cada em pg_trigger.

-- Nota de grafia, e ela fica fora do corpo de propósito: comentário dentro de um corpo entre cifrões
-- é texto do corpo, não comentário do arquivo, e o carregador não o remove (CONTRATO.md §11.1). O
-- RAISE abaixo usa os marcadores próprios em vez de format(), que a §11.5 recusa em qualquer posição.

CREATE OR REPLACE FUNCTION platform.reject_ledger_rewrite() RETURNS trigger
LANGUAGE plpgsql AS $fn$
BEGIN
    IF OLD.applied_at IS NULL
       AND NEW.applied_at IS NOT NULL
       AND NEW.schema_name IS NOT DISTINCT FROM OLD.schema_name
       AND NEW.version     IS NOT DISTINCT FROM OLD.version
       AND NEW.checksum    IS NOT DISTINCT FROM OLD.checksum
       AND NEW.module      IS NOT DISTINCT FROM OLD.module
       AND NEW.started_at  IS NOT DISTINCT FROM OLD.started_at
    THEN
        RETURN NEW;
    END IF;

    RAISE EXCEPTION
        'platform.schema_migrations aceita uma atualização só, a conclusão de uma migration em voo; recusada em schema %, versão %, applied_at % para %',
        OLD.schema_name, OLD.version, OLD.applied_at, NEW.applied_at
        USING HINT =
            'Reescrever checksum, versão, schema ou instante de início apaga a única prova '
            'de que uma migration aplicada foi editada (CONTRATO.md §3).';
END;
$fn$;

COMMENT ON FUNCTION platform.reject_ledger_rewrite() IS
    'Deixa passar a conclusão de uma migration em voo (applied_at de nulo para preenchido) e recusa toda outra atualização do livro-razão.';

CREATE OR REPLACE TRIGGER schema_migrations_reject_rewrite
    BEFORE UPDATE ON platform.schema_migrations
    FOR EACH ROW EXECUTE FUNCTION platform.reject_ledger_rewrite();

-- Remoção não tem caso legítimo nenhum, então não precisa ler linha: gatilho de comando, que é
-- também o que alcança TRUNCATE e o DELETE que não casa linha alguma.
CREATE OR REPLACE TRIGGER schema_migrations_reject_removal
    BEFORE DELETE OR TRUNCATE ON platform.schema_migrations
    FOR EACH STATEMENT EXECUTE FUNCTION platform.reject_mutation();

COMMENT ON TRIGGER schema_migrations_reject_rewrite ON platform.schema_migrations IS
    'A trava do COMMENT ON TABLE da 0000, na parte da reescrita. Sem ela, um UPDATE em checksum apaga a evidência de migration editada.';

COMMENT ON TRIGGER schema_migrations_reject_removal ON platform.schema_migrations IS
    'A trava do COMMENT ON TABLE da 0000, na parte da remoção: linha do livro-razão nunca é apagada.';

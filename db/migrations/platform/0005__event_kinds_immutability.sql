-- alvo: platform
-- transacional: sim
-- reversivel: nao; a inversa devolveria ao domínio de tipos de evento a mutabilidade que este arquivo
--             tira, e é por ela que a captura de fato do executor se desarma sem nenhum sintoma
--
-- A trava que faltava no domínio de tipos de evento. Semântica: db/migrator/CONTRATO.md §18.
--
-- POR QUE ESTE ARQUIVO EXISTE
--
-- A 0004 deixou platform.executor_event_kinds sem trava, e a decisão está escrita lá: o que a tabela
-- guarda é descrição de tipo, não evidência, e reescrever uma descrição não apaga fato nenhum. O
-- raciocínio está certo sobre a operação que ele considerou, e a operação que importa é outra. O gate
-- mediu a consequência em 2026-09-11 (SEC-03,
-- docs/auditorias/2026-09-11-delta-db-e-borda-api.md), com a credencial do executor e um comando:
--
--     DELETE FROM platform.executor_event_kinds WHERE code = 'structure_mismatch';
--
-- Não havia gatilho, então passa. A partir dali todo achado daquele tipo tenta virar linha e morre na
-- chave estrangeira, e CONTRATO.md §19.2 manda o executor reportar e seguir para o que já ia fazer: a
-- rodada se comporta exatamente como antes, o código de saída é o mesmo, e a impressão de estrutura
-- não acusa, porque ela compara estrutura e o domínio é linha. A detecção que a 0004 existe para
-- tornar permanente para de ser escrita, e nada no sistema muda de comportamento.
--
-- Reproduzido nesta data, e o UPDATE desarma do mesmo jeito: renomear o code de um tipo que ainda não
-- tem evento é aceito, e o INSERT seguinte daquele tipo morre na mesma chave estrangeira. Por isso a
-- trava é a mesma das outras três tabelas do controle, e não uma que olhe só o DELETE.
--
-- O QUE A RECUSA DE UPDATE CUSTA, E POR QUE ELA FICA ASSIM
--
-- A necessidade preservada é corrigir uma descrição errada. Os mecanismos recusados são dois: deixar
-- o UPDATE passar, que reabre o desarme medido acima porque code é coluna da mesma linha; e um
-- gatilho seletivo que compare OLD e NEW e libere só description, que custa uma segunda função no
-- schema de controle para proteger prosa. O mecanismo que fica é a recusa total, com a fonte
-- normativa da descrição sendo CONTRATO.md §19.1 — a coluna é conveniência de leitura dentro do
-- banco, e nenhum programa decide nada a partir dela. É melhor porque não acrescenta função nenhuma,
-- fecha o caminho de desarme por UPDATE junto com o do DELETE, e o preço é uma descrição errada que
-- continua errada até um código novo substituí-la.
--
-- IDEMPOTÊNCIA (migrations.md §3)
--
-- CREATE OR REPLACE TRIGGER, a mesma forma das 0002, 0003 e 0004, e a mesma função: nada nasce aqui
-- além do gatilho. Segunda rodada o substitui por ele mesmo, e pg_trigger continua com um só.
--
-- O QUE ESTE ARQUIVO NÃO ALCANÇA
--
-- O mesmo das 0002 e 0003, medido lá: o dono desliga o gatilho e o superusuário desliga todos. O que
-- mudou desde então é que desligar deixou de ser invisível — a impressão de estrutura de
-- CONTRATO.md §13.3 passou a carregar o estado de habilitação de cada gatilho (SEC-02), e verify
-- acusa a diferença contra a referência declarada.

CREATE OR REPLACE TRIGGER executor_event_kinds_reject_mutation
    BEFORE UPDATE OR DELETE OR TRUNCATE ON platform.executor_event_kinds
    FOR EACH STATEMENT EXECUTE FUNCTION platform.reject_mutation();

COMMENT ON TRIGGER executor_event_kinds_reject_mutation ON platform.executor_event_kinds IS
    'Domínio fechado: código novo entra por INSERT de migration, e nenhum código existente se altera nem se apaga. Sem esta trava, apagar um código desarma a captura daquele tipo de evento sem sintoma.';

-- alvo: platform
-- transacional: sim
-- reversivel: nao; a inversa apagaria código de domínio, que é o desarme medido em SEC-03 e travado
--             pela 0005
--
-- Dois tipos de evento novos. Semântica: db/migrator/CONTRATO.md §19.1.
--
-- POR QUE ESTE ARQUIVO EXISTE
--
-- Os dez tipos da 0004 são todos coisas que o executor observa sobre si mesmo. O gate de 2026-09-11
-- apontou as duas detecções que ficaram sem casa (SEC-04 e a nota sobre o REVOKE,
-- docs/auditorias/2026-09-11-delta-db-e-borda-api.md):
--
-- 1. LOAD_REFUSED. A recusa do carregador (CONTRATO.md §11) é a única detecção deste sistema com um
--    autor humano do outro lado: alguém escreveu uma migration que tentou atravessar a fronteira de
--    cliente, ou que trouxe uma forma proibida, e o carregador a recusou. Ela morria na saída do
--    processo; rodar de novo não deixava rastro e corrigir o arquivo apagava o episódio. As três
--    ausências declaradas no topo da 0004 não cobrem esta: as duas primeiras dependem de D-03, e a
--    terceira é sobre o ato que o gatilho recusa, cujo impedimento é técnico — a transação morre e
--    leva a escrita junto. Aqui não há impedimento técnico nenhum: o banco está de pé e a credencial
--    existe. A escolha de não abrir conexão era de desenho, por rapidez, e desenho é exatamente o que
--    o invariante 10 manda declarar ou capturar. Passa a capturar: CONTRATO.md §19.4 diz como a linha
--    é escrita, e o que ela continua não alcançando.
--
-- 2. PRIVILEGE_UNEXPECTED. O REVOKE de db/papeis-e-credencial.md §5 — a camada que tira UPDATE,
--    DELETE e TRUNCATE do papel do executor sobre o registro de clientes — não tinha verificação
--    nenhuma, porque privilégio está fora da impressão de estrutura por decisão declarada
--    (CONTRATO.md §13.3). Verificado nesta data: REVOKE e GRANT não mudam uma linha da impressão.
--    verify passa a fazer a pergunta por catálogo (CONTRATO.md §13.4), e o achado tem casa aqui.
--
-- POR QUE NÃO UMA COLUNA NOVA, NEM UMA TABELA NOVA
--
-- Os dois cabem inteiros nas colunas que a 0004 já tem: kind_code, os dois instantes, db_role,
-- version (o caminho do arquivo recusado) e detail (a regra que recusou e o trecho). Acrescentar
-- coluna para eles seria expand sem necessidade, e tabela nova seria uma segunda resposta para a
-- pergunta que executor_events já responde.
--
-- IDEMPOTÊNCIA (migrations.md §3)
--
-- INSERT ... ON CONFLICT DO NOTHING, a mesma forma do seed da 0004. Medido nesta data: com o gatilho
-- da 0005 instalado, a segunda rodada não dispara recusa — DO NOTHING não é UPDATE, e o gatilho de
-- comando de UPDATE não vê um INSERT.

INSERT INTO platform.executor_event_kinds (code, description) VALUES
    ('load_refused',          'Carregador recusou um arquivo de migration e abortou a rodada antes de aplicar qualquer coisa (CONTRATO.md §11).'),
    ('privilege_unexpected',  'verify encontrou privilégio que papeis-e-credencial.md §5 manda revogar do papel do executor (CONTRATO.md §13.4).')
ON CONFLICT DO NOTHING;

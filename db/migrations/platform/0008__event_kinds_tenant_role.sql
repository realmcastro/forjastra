-- alvo: platform
-- transacional: sim
-- reversivel: nao; a inversa apagaria código de domínio, que é o desarme medido em SEC-03 e travado
--             pela 0005
--
-- Dois tipos de evento novos. Semântica: db/migrator/CONTRATO.md §19.1 e a §13.5.
--
-- POR QUE ESTE ARQUIVO EXISTE
--
-- Em 2026-09-11 o humano fechou o arranjo de papel de aplicação (db/papeis-e-credencial.md §6.2) e
-- decidiu que criar o papel do cliente, conceder e revogar são passos do provision, não script à
-- parte. O ato virou artefato, e artefato que ninguém confere é a mesma coisa que ato esquecido:
-- verify passa a perguntar ao catálogo se cada cliente tem o papel dele, com os atributos e os
-- privilégios que o ato produz (db/papel-do-cliente.md §7.5). O achado precisa de casa, e a casa é a
-- tabela de fatos que a 0004 criou.
--
-- POR QUE DOIS CÓDIGOS E NÃO UM
--
-- Os diagnósticos são dois e a mão humana é outra em cada um. Papel ausente é provisionamento que
-- morreu no meio, e o conserto é rodar migrate --schema, que converge. Papel presente e adulterado é
-- alguém que mexeu fora do ato, e rodar migrate ali seria adotar em silêncio o alcance de quem mexeu.
-- Um código só faria o segundo caso ser lido como o primeiro, que é o defeito de motivo enumerado que
-- engole dois diagnósticos: o implementador encaixa no item mais próximo e conserta a coisa errada,
-- sem gerar sintoma.
--
-- IDEMPOTÊNCIA (migrations.md §3)
--
-- INSERT ... ON CONFLICT DO NOTHING, a mesma forma do seed da 0004 e da 0006.

INSERT INTO platform.executor_event_kinds (code, description) VALUES
    ('tenant_role_missing',    'verify não encontrou o papel de banco de um cliente registrado: o provisionamento parou no passo 7 (CONTRATO.md §13.5).'),
    ('tenant_role_divergent',  'verify encontrou o papel de banco de um cliente com atributo ou privilégio fora do ato que o cria (CONTRATO.md §13.5).')
ON CONFLICT DO NOTHING;

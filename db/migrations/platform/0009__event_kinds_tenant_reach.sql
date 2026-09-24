-- alvo: platform
-- transacional: sim
-- reversivel: nao; a inversa apagaria código de domínio, que é o desarme medido em SEC-03 e travado
--             pela 0005
--
-- Quatro tipos de evento novos. Semântica: db/verificacao-do-papel.md §7.5, §7.5.1 e §7.5.2.
--
-- POR QUE ESTE ARQUIVO EXISTE
--
-- O quinto gate (docs/auditorias/2026-09-11-camada-de-papel.md) mediu quatro estados que vazam entre
-- clientes e que a pergunta da §7.5 respondia como conforme, mais dois que ela respondia como
-- adulteração sem ser. A correção acrescentou uma segunda pergunta — quem alcança o schema deste
-- cliente — e separou o que reprova do que só se registra. Achado precisa de casa, e a casa é a
-- tabela de fatos que a 0004 criou.
--
-- POR QUE QUATRO CÓDIGOS
--
-- Pela mesma régua da 0008: um código por diagnóstico cuja mão humana é outra.
--
--   tenant_role_incomplete         falta parte do ato; migrate --schema converge sozinho. Sem ele, o
--                                  estado incompleto saía como tenant_role_divergent, cuja ação
--                                  documentada é investigar e NÃO rodar migrate — o implementador
--                                  encaixa no item mais próximo e conserta a coisa errada.
--   tenant_schema_foreign_grant    alguém além do dono e do papel do cliente alcança o schema. A ação
--                                  é REVOKE por mão humana: este ato não revoga, e adotar em silêncio
--                                  é herdar alcance que ninguém declarou.
--   tenant_role_default_acl_absent falta privilégio padrão para o papel que perguntou. Depende de QUEM
--                                  pergunta, então registra e não reprova (§7.5, e o molde da §13.4).
--   public_grant_present           PUBLIC alcança o schema public ou tem TEMPORARY no banco. O REVOKE
--                                  que corrige é do operador, não versionado: registra e não reprova.
--
-- IDEMPOTÊNCIA (migrations.md §3)
--
-- INSERT ... ON CONFLICT DO NOTHING, a mesma forma do seed da 0004, da 0006 e da 0008.

INSERT INTO platform.executor_event_kinds (code, description) VALUES
    ('tenant_role_incomplete',         'verify encontrou o papel de banco de um cliente sem parte do que o ato cria: migrate --schema converge (verificacao-do-papel.md §7.5).'),
    ('tenant_schema_foreign_grant',    'verify encontrou alguém além do dono e do papel do cliente alcançando o schema de um cliente (verificacao-do-papel.md §7.5.1).'),
    ('tenant_role_default_acl_absent', 'verify não achou privilégio padrão do papel que perguntou: tabela criada por ele nasce invisível para o cliente (verificacao-do-papel.md §7.5).'),
    ('public_grant_present',           'verify encontrou PUBLIC no schema public ou com TEMPORARY no banco: o REVOKE do ato do operador não foi aplicado (papel-do-cliente.md §7.2).')
ON CONFLICT DO NOTHING;

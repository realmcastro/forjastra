-- alvo: platform
-- transacional: sim
-- reversivel: nao; a inversa apagaria código de domínio, que é o desarme medido em SEC-03 e travado
--             pela 0005
--
-- Quatro tipos de evento novos. Semântica: db/universo-e-declaracao.md §7.5.4 e §7.5.5.
--
-- POR QUE ESTE ARQUIVO EXISTE
--
-- O gate da declaração (docs/auditorias/2026-09-12-gate-da-declaracao-camada-de-papel.md) fechou a
-- classe que a 0011 atacava — nenhuma exclusão remanescente é propriedade que o beneficiário emite —
-- e mediu o que a troca NÃO mudou: o ALCANCE DA PERGUNTA. A §7.5.1 enumera quem é membro de
-- app_t_<slug> e para no primeiro nível. Enquanto a exclusão era propriedade, isso era inócuo: um
-- membro a mais não carregava a propriedade certa e caía na pergunta. Ao trocar a exclusão para
-- NOME, ser membro de um nome excluído virou invisibilidade — dois comandos do operador
-- (CREATE ROLE ops_leitura LOGIN; GRANT forja_credencial TO ops_leitura) entregavam os dois clientes
-- com verify em 0, migrate em 0 e zero linha impressa (PAP-24).
--
-- POR QUE QUATRO CÓDIGOS
--
-- Pela régua da 0008, da 0009, da 0010 e da 0012: um código por diagnóstico cuja mão humana é outra.
--
--   declared_role_member         alguém é membro de um papel declarado. O membro alcança tudo o que
--                                a declaração desculpa, sem carregar propriedade nenhuma e sem
--                                aparecer em pergunta nenhuma das anteriores. A mão humana revoga a
--                                concessão, e quem a emitiu nem sempre é o executor.
--   role_declaration_unattested  existe declaração sem o app_role_declared que o ato emite ao lado.
--                                Medido: o executor escreve na tabela por INSERT cru, sem linha e
--                                sem evento. A mão humana investiga quem plantou, com declared_by e
--                                declared_at à vista.
--   role_declarations_empty      a tabela existe e está vazia: o arranjo ainda não foi declarado. É
--                                o banco provisionado antes da 0011, e a saída é uma rodada de
--                                migrate — não a devolução de posse que as onze linhas da §7.5.4
--                                mandavam fazer antes (PAP-27).
--   role_declaration_adopted     uma rodada assumiu, de propósito, linha que já estava na tabela sem
--                                o fato do ato. É a SAÍDA da acusação acima: a tabela é append-only,
--                                então sem um ato de adoção uma linha plantada deixaria o verify em
--                                3 para sempre, e controle sem saída é controle que se aprende a
--                                desligar. Não é defeito e não reprova; é o fato que separa "foi
--                                declarado" de "foi assumido" para quem ler a trilha depois.
--
-- IDEMPOTÊNCIA (migrations.md §3)
--
-- INSERT ... ON CONFLICT DO NOTHING, a mesma forma do seed da 0004, da 0006, da 0008, da 0009, da
-- 0010 e da 0012.

INSERT INTO platform.executor_event_kinds (code, description) VALUES
    ('declared_role_member',        'verify encontrou alguém que é membro de um papel declarado: o membro alcança tudo o que a declaração desculpa, sem aparecer em nenhuma outra pergunta (universo-e-declaracao.md §7.5.5).'),
    ('role_declaration_unattested', 'verify encontrou declaração sem o app_role_declared que o ato emite: a linha foi escrita fora de provision e de migrate (universo-e-declaracao.md §7.5.4).'),
    ('role_declarations_empty',     'verify não fez as perguntas de papel: platform.role_declarations existe e está vazia, então o arranjo ainda não foi declarado. A saída é uma rodada de migrate (universo-e-declaracao.md §7.5.4).'),
    ('role_declaration_adopted',    'provision ou migrate assumiu linha que já constava em platform.role_declarations sem o fato do ato: a adoção é deliberada, datada e com autor (universo-e-declaracao.md §7.5.4).')
ON CONFLICT DO NOTHING;

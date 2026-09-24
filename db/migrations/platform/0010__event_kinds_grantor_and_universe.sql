-- alvo: platform
-- transacional: sim
-- reversivel: nao; a inversa apagaria código de domínio, que é o desarme medido em SEC-03 e travado
--             pela 0005
--
-- Quatro tipos de evento novos. Semântica: db/verificacao-do-papel.md §7.5, §7.5.1 e §7.5.3, e
-- db/papel-do-cliente.md §7.4 e §7.7.
--
-- POR QUE ESTE ARQUIVO EXISTE
--
-- O sexto gate (docs/auditorias/2026-09-11-gate-final-camada-de-papel.md) mediu três estados que os
-- comandos ou davam por conformes ou diziam ter corrigido sem corrigir: uma concessão herdável
-- emitida por outro concedente, sobre a qual migrate saía 0 (PAP-13); uma membership WITH ADMIN
-- OPTION, que o filtro da pergunta invertida escondia (PAP-14); e um objeto em public, que está fora
-- do campo de visão de toda pergunta deste sistema (PAP-15). Achado precisa de casa, e a casa é a
-- tabela de fatos que a 0004 criou.
--
-- POR QUE QUATRO CÓDIGOS
--
-- Pela mesma régua da 0008 e da 0009: um código por diagnóstico cuja mão humana é outra.
--
--   tenant_role_foreign_grantor  a credencial herda o papel de um cliente por concessão de outro
--                                concedente. Nem converge nem se revoga daqui: medido, o REVOKE do
--                                executor apaga a concessão legítima e deixa a herdável. Quem revoga
--                                é quem concedeu, na conexão dele.
--   schema_outside_universe      existe schema não-sistema fora de platform e de t_*. Nenhuma
--                                pergunta deste sistema olha para lá, então ele é ponto cego por
--                                construção: a mão humana move o objeto ou declara o schema.
--   public_object_present        existe objeto em public que não veio de extensão. Medido: uma view
--                                ali, sobre dois clientes, entrega os dois à credencial nua, porque
--                                ela roda com o privilégio de quem a criou.
--   app_credential_plural        há mais de uma credencial de aplicação no grupo. É o estado que a
--                                §7.7 aceita durante a rotação, e a §7.5.1 passou a excluir: registra
--                                e NÃO reprova, para que o conjunto excluído seja enumerado em vez de
--                                invisível.
--
-- IDEMPOTÊNCIA (migrations.md §3)
--
-- INSERT ... ON CONFLICT DO NOTHING, a mesma forma do seed da 0004, da 0006, da 0008 e da 0009.

INSERT INTO platform.executor_event_kinds (code, description) VALUES
    ('tenant_role_foreign_grantor', 'verify encontrou concessão herdável do papel de um cliente à credencial emitida por outro concedente: reemitir não corrige e o executor não revoga (papel-do-cliente.md §7.4).'),
    ('schema_outside_universe',     'verify encontrou schema não-sistema fora de platform e de t_*: nenhuma pergunta deste sistema o alcança (verificacao-do-papel.md §7.5.3).'),
    ('public_object_present',       'verify encontrou objeto no schema public fora de extensão: objeto ali roda com o privilégio de quem o criou e tira o papel do cliente do caminho (verificacao-do-papel.md §7.5.3).'),
    ('app_credential_plural',       'verify encontrou mais de uma credencial de aplicação no grupo: é o estado que a rotação da §7.7 produz, e a pergunta invertida o exclui (papel-do-cliente.md §7.7).')
ON CONFLICT DO NOTHING;

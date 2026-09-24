-- alvo: platform
-- transacional: sim
-- reversivel: nao; a inversa apagaria código de domínio, que é o desarme medido em SEC-03 e travado
--             pela 0005
--
-- Dois tipos de evento novos. Semântica: db/universo-e-declaracao.md §7.5.4 e
-- db/delegacao-por-dono.md §7.5.6.
--
-- POR QUE DOIS CÓDIGOS
--
-- Pela régua da 0008 em diante: um código por diagnóstico cuja mão humana é outra.
--
--   role_retractions_missing       verify não fez as perguntas de papel: platform.role_declarations
--                                  existe e platform.role_retractions não. Sem a segunda não há
--                                  como saber que declaração ainda vale, e responder como se todas
--                                  valessem desculparia exatamente o que alguém retratou. A saída é
--                                  uma rodada de migrate, que aplica a 0014.
--   object_owner_delegation        verify encontrou delegação por dono de objeto em schema
--                                  protegido (platform ou um t_*): objeto que depende de objeto de
--                                  OUTRO schema, qualquer que seja, ou rotina SECURITY DEFINER. É o
--                                  SUB-09 (docs/auditorias/2026-09-23-conferencia-da-credencial-na-subida-terceira.md):
--                                  regra de reescrita, view, view materializada, chave estrangeira,
--                                  default ou rotina que roda com o privilégio do dono e alcança
--                                  outro cliente. Nenhuma migration nossa produz esse estado, então
--                                  ele é drift, e a mão humana investiga quem criou o objeto.
--
-- IDEMPOTÊNCIA (migrations.md §3)
--
-- INSERT ... ON CONFLICT DO NOTHING, a mesma forma do seed da 0004 e das seguintes.

INSERT INTO platform.executor_event_kinds (code, description) VALUES
    ('role_retractions_missing', 'verify não fez as perguntas de papel: platform.role_retractions não existe, e sem ela não se sabe que declaração vale. Sai com migrate (universo-e-declaracao.md §7.5.4).'),
    ('object_owner_delegation',  'verify achou em platform ou num t_* objeto que depende de outro schema, ou rotina que executa como o dono: alcança com o privilégio dele (delegacao-por-dono.md §7.5.6).')
ON CONFLICT DO NOTHING;

-- alvo: platform
-- transacional: sim
-- reversivel: nao; a inversa apagaria código de domínio, que é o desarme medido em SEC-03 e travado
--             pela 0005
--
-- Quatro tipos de evento novos. Semântica: db/universo-e-declaracao.md §7.5.3 e §7.5.4, e db/verificacao-do-papel.md §7.5.1.
--
-- POR QUE ESTE ARQUIVO EXISTE
--
-- A reauditoria do sétimo gate (docs/auditorias/2026-09-12-reauditoria-camada-de-papel.md) mediu
-- quatro estados em que um papel lê o schema de um cliente e verify sai 0, e três deles eram
-- regressão: o código anterior àquela rodada os acusava com 3. A correção trocou a exclusão por
-- propriedade do catálogo pela declaração por nome (0011), e os três fatos abaixo são o que a troca
-- produz. Achado precisa de casa, e a casa é a tabela de fatos que a 0004 criou.
--
-- POR QUE QUATRO CÓDIGOS
--
-- Pela mesma régua da 0008, da 0009 e da 0010: um código por diagnóstico cuja mão humana é outra.
--
--   app_role_declared              o conjunto que a §7.5.1 exclui cresceu. Não é defeito e não
--                                  reprova: é o fato que faz de "ampliar a exclusão" um ato datado
--                                  com autor, em vez de um estado que ninguém nomeia.
--   tenant_schema_owner_unexpected o dono de platform ou do schema de um cliente não é executor
--                                  declarado. Medido: duas linhas do executor entregam um cliente a
--                                  um papel de fora, que passa a ler e pode derrubar o schema. A mão
--                                  humana devolve a posse; o executor não o faz sozinho.
--   role_declarations_missing      verify não pôde fazer as perguntas de papel porque a 0011 ainda
--                                  não foi aplicada. A pergunta que não foi feita reprova, em vez de
--                                  passar em silêncio: é a regressão do PAP-23 uma camada abaixo.
--   executor_role_plural           há mais de um executor declarado. Não reprova, pelo mesmo motivo
--                                  de app_credential_plural: trocar o papel do executor é uma janela
--                                  legítima. A mão humana confere se a troca terminou — o papel
--                                  antigo continua podendo ser dono de schema nosso.
--
-- IDEMPOTÊNCIA (migrations.md §3)
--
-- INSERT ... ON CONFLICT DO NOTHING, a mesma forma do seed da 0004, da 0006, da 0008, da 0009 e da
-- 0010.

INSERT INTO platform.executor_event_kinds (code, description) VALUES
    ('app_role_declared',              'O executor declarou um papel legítimo em platform.role_declarations: o conjunto que a pergunta invertida exclui cresceu (universo-e-declaracao.md §7.5.4).'),
    ('tenant_schema_owner_unexpected', 'verify encontrou platform ou o schema de um cliente com dono que não é executor declarado: o dono lê tudo e pode derrubar o schema (universo-e-declaracao.md §7.5.4).'),
    ('role_declarations_missing',      'verify não fez as perguntas de papel: platform.role_declarations não existe neste banco. Pergunta não feita reprova (universo-e-declaracao.md §7.5.4).'),
    ('executor_role_plural',           'verify encontrou mais de um executor declarado: o papel antigo de uma troca de executor continua podendo ser dono de schema nosso (universo-e-declaracao.md §7.5.4).')
ON CONFLICT DO NOTHING;

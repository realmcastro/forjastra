-- alvo: tenant
-- transacional: sim
-- reversivel: nao; a inversa removeria o tipo de toda coluna de valor que vier depois, e afrouxar o
--             envelope é trocar a restrição do domínio, nunca apagá-lo
--
-- Os três domínios de valor do núcleo. Decisão: memory/plataforma/decision-dinheiro-e-quantidade.md
-- (T-0018, 2026-09-23). Convenção escrita em db/convencoes.md §10.
--
-- POR QUE ESTE ARQUIVO EXISTE, E POR QUE AGORA
--
-- Nenhuma coluna de F-021 guarda valor. Os domínios nascem na primeira migration de cliente porque a
-- decisão manda: a convenção vive num objeto só por schema, e coluna nenhuma escolhe escala própria.
-- A primeira coluna de preço, total ou quantidade (SPR-37, SPR-32) já nasce com o tipo certo, e não há
-- janela em que alguém escreva numeric(14,2) por falta de alternativa.
--
-- numeric SEM modificador, e o envelope num CHECK com min_scale(). numeric(p,s) arredonda antes de
-- qualquer CHECK (17.925 vira 17.93 e o banco decide o centavo:
-- memory/plataforma/gotcha-typmod-numeric-arredonda-em-silencio.md), e scale() recusaria 17.900, que
-- tem duas casas significativas (gotcha-envelope-de-escala-usa-min-scale.md). Medido em 2026-09-23,
-- PostgreSQL 16: 17.925 é recusado, 17.900 e 17.9 entram, NaN e Infinity são recusados pelo abs(),
-- porque NaN compara acima de todo número e min_scale(NaN) é nulo.
--
-- unit_price tem o teto de money_amount e uma casa a mais: o preço de combustível e de granel usa três
-- (a decisão, "Preço unitário é domínio próprio desde o primeiro DDL"). Separar depois reescreveria
-- cada coluna de preço.
--
-- A GUARDA DE EXISTÊNCIA, E POR QUE ELA NÃO É UM BLOCO DO
--
-- CREATE DOMAIN não tem IF NOT EXISTS, e a guarda usual (bloco DO) é recusa do carregador
-- (db/migrator/RECUSAS.md §11.5). A necessidade que a guarda atende é a retomada: a migration tem que
-- poder rodar de novo depois de falhar. Aqui ela é atendida pela transação, como o ADD CONSTRAINT de
-- db/migrator/CONTRATO.md §17.2, forma 3: o CREATE DOMAIN roda dentro da mesma transação que grava a
-- linha do livro-razão, então ou os três domínios existem e a versão está registrada, ou nada existe.
-- A retomada sempre parte do estado anterior à tentativa (§17.1), e a reaplicação de versão concluída
-- não acontece fora da platform/0000. O único estado em que o comando encontraria o domínio já criado
-- é drift (domínio feito à mão sem linha no livro-razão), e ali falhar alto é o desfecho certo: uma
-- guarda que pulasse em silêncio aceitaria um domínio pré-existente com outro envelope, o mesmo defeito
-- que a §9 mediu no CREATE TABLE IF NOT EXISTS do ledger. A forma permitida entrou na lista da §11.2
-- nesta mesma mudança, e ela recusa modificador no tipo base: numeric(14,2) como base de domínio não
-- passa pelo crivo.
--
-- AUSÊNCIAS DECLARADAS (dados.md §3.1)
--
-- 1. Moeda ao lado do valor. Não nasce, pela decisão: a moeda é do estabelecimento (RN-NUC-058) e mora
--    na configuração publicada dele (tenant/0005); o cabeçalho da venda carrega a moeda, não cada valor.
-- 2. Domínio de casas por unidade de medida. A casa efetiva de uma quantidade (0 a 3) é dado publicado
--    do catálogo (SPR-32), e o CHECK que a compara com a unidade nasce na tabela de item, não aqui.
-- 3. Sinal. money_amount aceita negativo de propósito: o envelope é de escala e de teto, e se um valor
--    pode ser negativo é regra da coluna que o usa, com CHECK dela.
--
-- LOCK (migrations.md §5)
--
-- CREATE DOMAIN só escreve catálogo e não toca tabela nenhuma: nenhum lock de relação é pedido.

CREATE DOMAIN money_amount AS numeric
    CONSTRAINT money_amount_envelope_check
    CHECK (min_scale(VALUE) <= 2 AND abs(VALUE) < 1e12);

COMMENT ON DOMAIN money_amount IS
    'Valor monetário em unidade maior da moeda: até 2 casas, módulo menor que 10^12. Casa a mais é recusada, nunca arredondada. A moeda não está aqui: é da configuração publicada do estabelecimento.';

CREATE DOMAIN unit_price AS numeric
    CONSTRAINT unit_price_envelope_check
    CHECK (min_scale(VALUE) <= 3 AND abs(VALUE) < 1e12);

COMMENT ON DOMAIN unit_price IS
    'Preço unitário: até 3 casas (combustível e granel), módulo menor que 10^12. Domínio próprio para que o envelope do preço mude sem reescrever coluna de total.';

CREATE DOMAIN quantity_value AS numeric
    CONSTRAINT quantity_value_envelope_check
    CHECK (min_scale(VALUE) <= 3 AND abs(VALUE) < 1e11);

COMMENT ON DOMAIN quantity_value IS
    'Quantidade: envelope de até 3 casas, módulo menor que 10^11. A casa efetiva por unidade de medida é dado publicado do catálogo, conferido na tabela que usa o domínio.';

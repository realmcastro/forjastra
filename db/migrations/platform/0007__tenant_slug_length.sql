-- alvo: platform
-- transacional: sim
-- reversivel: nao; a inversa seria ALTER TABLE ... DROP CONSTRAINT, que migrations.md §4
--             proíbe em migration. Aperta um limite que hoje não tem linha para violar.
--
-- O teto do slug passa de 41 para 40 caracteres.
--
-- POR QUE ESTE ARQUIVO EXISTE
--
-- O CHECK da 0001 é '^[a-z][a-z0-9_]{1,40}$', que admite 2 a 41 caracteres: a primeira classe conta
-- uma vez e a repetição conta até 40. O padrão que recusa qualificador de schema de outro cliente
-- (db/migrator/RECUSAS.md §11.3) enxergava 40, e um cliente de slug com 41 saía da fronteira sem
-- sintoma nenhum — os outros continuavam protegidos e o arquivo passava na revisão
-- (EXE-03, docs/auditorias/2026-09-11-executor-implementado.md).
--
-- A correção tem dois lados e este arquivo é um deles. O outro é o padrão da §11.3, que deixou de
-- escrever comprimento nenhum: dois números escritos à mão em dois arquivos divergem de novo, e um
-- padrão sem número não tem com o que divergir. O teto do banco passa a ser a única fronteira de
-- comprimento do sistema, junto da borda que valida o slug antes de chegar aqui.
--
-- POR QUE UMA RESTRIÇÃO NOVA, E NÃO A CORREÇÃO DA ANTIGA
--
-- Corrigir a expressão da 0001 seria editar migration aplicada (migrations.md §1) ou trocar a
-- restrição por DROP + ADD (§4). A restrição nova compõe com a antiga: a de lá continua mandando no
-- alfabeto e no primeiro caractere, a daqui manda no teto. Uma linha que passe nas duas tem de 2 a 40
-- caracteres, que é o alvo.
--
-- O octet_length, e não length, pela mesma razão da 0000: o limite de identificador do Postgres é em
-- bytes. O alfabeto da 0001 já é ASCII, então os dois dariam o mesmo número hoje; o que muda é qual
-- pergunta a restrição faz, e a pergunta certa é a de bytes.
--
-- IDEMPOTÊNCIA (migrations.md §3)
--
-- ALTER TABLE ... ADD CONSTRAINT não tem guarda de existência, e a guarda dele é a transação
-- (CONTRATO.md §17.2, forma 3): a retomada sempre parte do estado anterior à tentativa, porque a
-- transação revertida não deixa a restrição para trás. Por isso o cabeçalho é transacional: sim, e
-- por isso RECUSAS.md §11.4 recusa esta forma em arquivo marcado transacional: nao.
--
-- SE JÁ EXISTISSE LINHA ACIMA DO TETO
--
-- A migration falharia e a rodada pararia naquele schema, que é o desfecho certo: um slug de 41
-- caracteres já virou nome de schema, e apertar o teto por cima dele produziria um registro que a
-- própria restrição recusa reescrever. O caminho ali seria outro — expand/contract sobre a identidade
-- do cliente, com o humano decidindo. Não existe cliente registrado hoje, em nenhum ambiente.
--
-- Medido em 2026-09-11, PostgreSQL 16.15: com a restrição aplicada, slug de 40 caracteres entra e
-- slug de 41 é recusado pelo nome desta restrição. Segunda aplicação sobre o estado já aplicado falha
-- com "constraint already exists", e depois de uma transação revertida a tentativa seguinte aplica
-- limpa — que é exatamente o que CONTRATO.md §17.2 descreve para esta forma.
--
-- LOCK (migrations.md §5)
--
-- ACCESS EXCLUSIVE sobre platform.tenants pelo tempo de varrer a tabela. Não existe cliente
-- registrado hoje, e a tabela cresce em uma linha por cliente: a varredura é sobre dezenas de linhas
-- no horizonte visível, não sobre volume de venda. O lock_timeout é do executor (CONTRATO.md §6), e
-- nenhum caixa lê esta tabela — quem a lê é o executor.

ALTER TABLE platform.tenants
    ADD CONSTRAINT tenants_slug_length_check
        CHECK (octet_length(slug) <= 40);

COMMENT ON CONSTRAINT tenants_slug_length_check ON platform.tenants IS
    'Teto de 40 caracteres para o slug. Compõe com tenants_slug_format_check, que admitia 41 e deixava o cliente de nome comprido fora da fronteira de schema do carregador.';

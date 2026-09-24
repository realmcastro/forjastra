-- alvo: tenant
-- transacional: sim
-- reversivel: nao; acrescenta restrição que garante que a terceira fonte de sustentação aponte para
--             uma habilitação que existe, e a inversa seria remover essa garantia (migrations.md §4)
--
-- A chave estrangeira de support_enablement_fact_id nas quatro tabelas de fato do estabelecimento.
-- Ausência 5 de tenant/0003, e a mesma referência em tenant/0004 e tenant/0005.
--
-- POR QUE ESTE ARQUIVO EXISTE
--
-- As tabelas do estabelecimento nasceram antes da tabela de fatos do terminal, e a tabela de fatos
-- aponta para elas (a habilitação nomeia a unidade; a revogação, o encerramento). Uma das duas
-- direções tinha que vir depois, e é esta: a terceira fonte de RN-NUC-029 (identificação retida mais
-- habilitação do terminal) não sustenta nenhum dos atos de F-021, que são todos com contato e de papel
-- (matriz, linhas 23, 38 e 41), então a coluna fica nula em toda linha que F-021 grava. A restrição
-- existe mesmo assim porque a forma do autor é uma só (db/convencoes.md §11), e referência sem chave
-- estrangeira é a que apodrece primeiro.
--
-- IDEMPOTÊNCIA (migrations.md §3)
--
-- ADD CONSTRAINT não tem IF NOT EXISTS, e a retomada vem da transação (CONTRATO.md §17.2, forma 3):
-- ou as quatro restrições e os quatro índices existem e a versão está registrada, ou nada existe.
--
-- LOCK (migrations.md §5)
--
-- ADD CONSTRAINT ... FOREIGN KEY pede SHARE ROW EXCLUSIVE na tabela que ganha a restrição e na
-- referenciada, e varre a primeira para validar. Na primeira aplicação as cinco tabelas estão vazias,
-- porque nascem no mesmo release; com dado, a varredura é de uma coluna nula em toda linha. Não é
-- NOT VALID porque não há volume a proteger: a forma em duas etapas é para tabela grande (§5), e
-- nenhuma destas tem linha antes deste arquivo em cliente nenhum.

ALTER TABLE establishments
    ADD CONSTRAINT establishments_support_enablement_fkey
    FOREIGN KEY (support_enablement_fact_id) REFERENCES sales_enabled_terminal_facts (fact_id);

CREATE INDEX IF NOT EXISTS establishments_support_enablement_idx
    ON establishments (support_enablement_fact_id);

ALTER TABLE establishment_name_changes
    ADD CONSTRAINT establishment_name_changes_support_enablement_fkey
    FOREIGN KEY (support_enablement_fact_id) REFERENCES sales_enabled_terminal_facts (fact_id);

CREATE INDEX IF NOT EXISTS establishment_name_changes_support_enablement_idx
    ON establishment_name_changes (support_enablement_fact_id);

ALTER TABLE establishment_operation_changes
    ADD CONSTRAINT establishment_operation_changes_support_enablement_fkey
    FOREIGN KEY (support_enablement_fact_id) REFERENCES sales_enabled_terminal_facts (fact_id);

CREATE INDEX IF NOT EXISTS establishment_operation_changes_support_enablement_idx
    ON establishment_operation_changes (support_enablement_fact_id);

ALTER TABLE establishment_configurations
    ADD CONSTRAINT establishment_configurations_support_enablement_fkey
    FOREIGN KEY (support_enablement_fact_id) REFERENCES sales_enabled_terminal_facts (fact_id);

CREATE INDEX IF NOT EXISTS establishment_configurations_support_enablement_idx
    ON establishment_configurations (support_enablement_fact_id);

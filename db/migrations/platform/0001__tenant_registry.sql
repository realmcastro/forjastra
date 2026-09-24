-- alvo: platform
-- transacional: sim
-- reversivel: nao; cria tabela nova, e a inversa apagaria a única resposta para
--             "qual schema pertence a qual cliente" (migrations.md §4)
--
-- O registro de clientes do schema de controle. É dele que sai o slug de cada cliente, que o
-- executor transforma em nome de schema pelo caminho de db/migrator/CONTRATO.md §10.
--
-- ESTE ARQUIVO CRIA UMA TABELA SÓ, E A LISTA ABAIXO É O MOTIVO
--
-- O schema de controle previsto por dados.md §1 tem três registros: clientes, módulos ativos e
-- versão de migration por schema. O terceiro existe desde a 0000. O segundo não é escrevível hoje,
-- e nem ele nem as demais entidades do controle entram aqui. Cada ausência tem nome, e nenhuma é
-- esquecimento — conferir esta lista é item do gate de seguranca.
--
-- 1. FUSO DO CLIENTE E DO ESTABELECIMENTO — LACUNA-GLO-001 (= LACUNA-NUC-001), aberta com o humano.
--    Regra aprovada contra regra aprovada sobre quem manda quando um cliente tem unidades em fusos
--    diferentes. Nenhuma coluna de fuso nasce aqui.
--
-- 2. MOEDA — LACUNA-NUC-041, aberta em 2026-09-11. O glossário a declara do cliente e RN-NUC-013 a
--    declara configuração do estabelecimento. Se ela for do estabelecimento, a coluna não é desta
--    tabela, e corrigir isso depois é expand/contract em N schemas.
--
-- 3. IDENTIDADE FISCAL DO ESTABELECIMENTO — terceira ausência de docs/produto/nucleo-estabelecimento.md
--    §3. Do que ela se compõe é de FIS, e o catálogo de regra fiscal ainda não tem casa (D-05).
--
-- 4. OS FATOS DO CICLO DE VIDA — tenant_provisioned, tenant_offboarded, module_state_change,
--    sales_enablement_granted, sales_enablement_renewed, terminal_compromised
--    (docs/produto/fatos-de-operacao-provedor.md §3). Todos exigem AUTOR, e a residência do sujeito
--    é o primeiro eixo de D-03, ABERTA: não se sabe se a pessoa mora numa população global ou no
--    schema do cliente, e a segunda resposta faria este schema referenciar pessoa de outro schema.
--    Um deles soma um segundo impedimento: por RN-PRV-007 a mudança de módulo é negada a todos até
--    LACUNA-PRV-003 dizer quem confirma, e o autor pode ser nosso ou do cliente ("um fato, dois
--    autores possíveis"). Coluna de autor escrita hoje nasce sem valor possível.
--    A trilha dos nossos atos é D-06 (ii), também aberta.
--
-- 5. ESTABELECIMENTO, TERMINAL E HABILITAÇÃO A VENDER — não são tabela do controle. O
--    estabelecimento carrega o nome pelo qual o operador reconhece a unidade e é referenciado por
--    todo fato do núcleo (RN-NUC-050), que vive no schema do cliente; dados.md §1 proíbe tabela de
--    cliente aqui, e chave estrangeira não atravessa schema. O terminal depende ainda do terceiro
--    eixo de D-03 (como o cliente é resolvido na borda): se o registro do terminal for o que resolve
--    o cliente, ele não pode morar dentro do cliente que ele resolve.
--
-- 6. DINHEIRO E QUANTIDADE — nenhuma coluna de valor nasce aqui; o tipo do dinheiro continua aberto.
--
-- 7. MÓDULO E CAPACIDADE COMO TABELA DE DOMÍNIO — o registro de códigos de módulo declara que a
--    lista "não está fechada aqui", e o catálogo de capacidades produz candidatas, nunca entradas
--    aceitas. Semear qualquer um dos dois seria transformar prosa em domínio fechado por conta
--    própria. Sem o fato de ativação do item 4, a tabela de domínio sozinha não é lida por ninguém.
--
-- COMO D-04 SE APLICA AQUI
--
-- A chave é uuid e não tem DEFAULT: a regra de geração é ordenada no tempo e vive na borda que cria
-- a linha, e o gerador nativo do Postgres produz valor aleatório, que é a saída recusada.
--
-- A linha é IMUTÁVEL: o slug não muda porque mudar o slug é renomear um schema, e alterar nome de
-- objeto é proibido em migration. Por isso a tabela leva created_at e NÃO leva updated_at — pelo
-- mesmo argumento com que D-04 tirou updated_at da família de fato: a coluna nunca mudaria de valor
-- e existiria só para convidar código a atualizá-la. Consequência declarada: o gatilho genérico de
-- updated_at, que D-04 §8 item 4 manda nascer junto da primeira tabela de cadastro, NÃO nasce aqui,
-- porque esta não é uma tabela de cadastro editável. Ele nasce com a primeira que for.
--
-- Nenhuma coluna de exclusão lógica. Encerrar um cliente é fato (RN-PRV-013), e o fato é o item 4.
--
-- IDEMPOTÊNCIA (migrations.md §3)
--
-- Guarda de existência, e toda restrição nascendo junto do CREATE TABLE em vez de por alteração
-- posterior. Segunda rodada encontra a tabela pronta e não faz nada; não há estado parcial
-- observável. Configuração de sessão, lock_timeout inclusive, é do executor (CONTRATO.md §6).

CREATE TABLE IF NOT EXISTS platform.tenants (
    tenant_id    uuid        NOT NULL,
    slug         text        NOT NULL,

    -- Derivada, e é isto que impede duas verdades. O executor também compõe "t_" mais o slug
    -- (CONTRATO.md §10); guardar a composição como coluna gerada faz o banco recusar qualquer linha
    -- em que as duas discordem, e dá ao livro-razão uma chave de junção direta, já que
    -- platform.schema_migrations registra o nome concreto do schema.
    schema_name  text        NOT NULL GENERATED ALWAYS AS ('t_' || slug) STORED,

    -- Instante em que a identidade foi registrada. NÃO é o fato tenant_provisioned de RN-PRV-013:
    -- aquele exige autor e está na ausência 4. Quem perguntar "desde quando este cliente existe"
    -- tem aqui uma resposta operacional, nunca a prova datada que a regra pede.
    created_at   timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT tenants_pkey
        PRIMARY KEY (tenant_id),

    -- Unicidade do slug é a unicidade do schema: a derivação acima é um para um, então uma segunda
    -- restrição sobre schema_name não acrescentaria invariante nenhum.
    CONSTRAINT tenants_slug_key
        UNIQUE (slug),

    -- A mesma expressão que a borda valida (CONTRATO.md §10, camada 2), aqui para a validação não
    -- depender de o código lembrar dela. O limite de 40 mantém o nome do schema dentro dos 63 bytes
    -- de identificador do Postgres com folga.
    CONSTRAINT tenants_slug_format_check
        CHECK (slug ~ '^[a-z][a-z0-9_]{1,40}$'),

    -- Dos quatro reservados, um morde hoje: o comando de verificação de estrutura provisiona um
    -- schema descartável cujo nome começa por "t_verify_" e o derruba no fim (CONTRATO.md §13). Um
    -- cliente com slug iniciado em "verify_" produziria exatamente esse nome, e o schema de um
    -- cliente real entraria na única rotina do sistema que remove schema. Os outros três não colidem
    -- enquanto o prefixo "t_" existir, e ficam porque são baratos e porque o prefixo é o tipo de
    -- coisa que alguém revisita.
    CONSTRAINT tenants_slug_reserved_check
        CHECK (
            slug NOT IN ('platform', 'public', 'information_schema')
            AND slug !~ '^pg_'
            AND slug !~ '^verify_'
        )
);

COMMENT ON TABLE platform.tenants IS
    'Registro de clientes (tenants): a identidade imutável de cada cliente e o schema dele. Linha nunca é alterada nem removida.';

COMMENT ON COLUMN platform.tenants.slug IS
    'Identidade legível e imutável do cliente. Imutável porque mudá-la seria alterar o nome de um schema em uso.';

COMMENT ON COLUMN platform.tenants.schema_name IS
    'Derivada do slug. É o valor que platform.schema_migrations.schema_name carrega para as migrations deste cliente.';

COMMENT ON COLUMN platform.tenants.created_at IS
    'Instante do registro da identidade. Não é o fato de provisionamento de RN-PRV-013, que exige autor e ainda não existe.';

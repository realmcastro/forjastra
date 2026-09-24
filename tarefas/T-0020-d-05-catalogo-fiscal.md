---
id: T-0020
backlog: F-020
titulo: Fechar D-05: casa do catálogo de regra fiscal de abrangência maior que o cliente
status: fechada
escopo: cliente=- vertical=- modulo=fis camada=dados
aberta_em: 2026-09-23
---

## Pedido

Delegação do humano de 2026-09-23 ([[convention-decisao-delegada-com-aviso-no-modulo]]), retomada com
"resume agora. continue os trabalhos. mas seja mais direto."

## Plano

## PLANO: T-G (T-0020), D-05 catálogo fiscal
BACKLOG: F-020
ESCOPO: onde mora a regra fiscal de abrangência maior que o cliente. O conteúdo das alíquotas é de classe (b), contador, e vira aviso em A.3.
PASSOS:
1. G.1 `arquiteto-dados`
   - **Brief:** as três saídas de [[decision-d-05-catalogo-de-regra-fiscal-sem-casa]], escalando com N clientes e vigência.
   - **Entrega:** `docs/arquitetura/d-05-catalogo-fiscal-2026-09-23.md`.
   - Onda 2, depois de E.1 e F.1, por carga.
2. `seguranca` (consulta), só se a recomendação criar leitura de sessão de cliente no `platform`.
3. **Thread: decisão**, mais a linha no §8.
GATES: gate 2 no desenho.
RISCO PRINCIPAL: agendar `FIS` antes disto.

## Fechamento — 2026-09-23

ENTREGUE: `D-05` decidida pela quarta saída da proposta, com a correção de `D05-01` (o executor compara a
projeção com a autoridade antes de liberar).
ARQUIVOS: `docs/arquitetura/d-05-catalogo-fiscal-2026-09-23.md`; memória
`plataforma/decision-d-05-autoridade-no-platform-projecao-no-cliente` (supera a de 2026-08-24),
`gotcha-default-privileges-entrega-insert-na-projecao`, `gotcha-digest-sobre-jsonb-nao-confere`;
`CLAUDE.md` §8.
VERIFICAÇÃO: as medidas G1–G11 são do G.1 (PostgreSQL 16.15 descartável). A consulta de `seguranca` foi só
leitura de desenho. O thread não rodou nada.
PRONTO:
- Decisão registrada, com linha no índice e no `CLAUDE.md` §8: sim.
- Gate de `seguranca`: consulta feita, um achado MÉDIO (`D05-01`) incorporado à decisão.
- DDL: não se aplica. A primeira DDL de `FIS` herda `D05-01` e `TRL-04`.
- Memória sugerida: as três do G.1 escritas. Segredo: nenhum.
SOBROU:
- Reescrever o aviso B6 em `docs/produto/modulos/fiscal.md:80` pelo texto da §9 do documento, e a cópia dele em
  `pendencias-fase-1-e-2-2026-09-23.md`; revisar `roadmap-de-modulos.md` §7.1 e `:158` (`produto`).
- Termo do glossário para o "território" da regra (`produto`).
- Espécie de declaração do gravador, desenhada junto com a da borda (`D-03`) e o grupo do `PAP-28`
  (`arquiteto-dados`).

## arquiteto-dados — 2026-09-23 (G.1, proposta)

## RELATÓRIO: arquiteto-dados, T-0020 (G.1)
STATUS: OK

**Recomendação para D-05, para o thread decidir:** uma quarta saída, que junta a 1 e a 2. A autoridade de cada versão de regra mora no `platform`, escrita uma vez, com as restrições do banco. Cada cliente com `FIS` ligado recebe no próprio schema uma projeção da versão, com o mesmo id e o mesmo digest, e o fato de venda aponta para ela por FK dentro do schema. A ordem é a de D-06(ii): publicar, projetar em cada schema, só então liberar aos terminais daquele cliente.

**Leitura de sessão de cliente no `platform`:** a recomendação não cria nenhuma (medido em G7). O gatilho literal da consulta a `seguranca` não dispara. Recomendo a consulta mesmo assim, sobre uma pergunta só: nasce um principal novo, o gravador de projeção, que alcança os N schemas (só `INSERT`, sem `SELECT`). Ele é da mesma família do gravador de D-06(ii).

FEITO:
- Avaliei as três saídas do registro nos dois eixos, N clientes e M mudanças por ano com data escolhida pela norma. Acrescentei a variante 1' (`platform` lido por papel próprio, fora da transação do cliente). Ela é o fallback se a faixa de 10⁴ clientes tornar caro o volume projetado.
- A saída 3 contradiz `RN-FIS-009`, que é regra aprovada: regra nova entra sem build e sem release. Um quarto schema dedicado reprova o `verify` (`db/universo-e-declaracao.md` §7.5.3) e exigiria mudar o alvo do executor, sem ganhar isolamento.
- Usei o critério de D-06 (a residência segue o objeto do fato): o objeto de uma alíquota de UF é o território, e nenhum cliente. Por isso a autoridade fica no `platform`.
- Respondi os critérios 1 a 3 de `F-020` e o caminho infeliz. O 4 é ato do thread.
  - Critério 1: com a autoridade única, a divergência entre clientes não é impedida, é detectada. Ela tem dois caminhos, terminal sem contato e projeção que chegou tarde. Os dois caem na mesma consulta dentro do schema, rodada na ingestão do fato e na chegada da versão. Impedir exigiria bloquear a venda, que o invariante 10 proíbe.
- Conferi a coerência com D-06(ii), com a decisão de dinheiro e quantidade e com `RN-NUC-057`/`058`.
- Propus o texto novo do aviso B6 (§9 do documento), respondi as cinco perguntas de `dados.md` §6 e escrevi o recusado nas quatro partes para 1, 1', 2, 3 e para a opção de o próprio papel do cliente ser o gravador.
- Medi a forma em PostgreSQL 16.15 (casos G1 a G11 do documento).

ARQUIVOS:
- `/home/mcastro/work/freelas/forja/docs/arquitetura/d-05-catalogo-fiscal-2026-09-23.md` (novo, 373 linhas)
- `db/**` só leitura: `db/migrator/CONTRATO.md` §0 a §2, `db/universo-e-declaracao.md` §7.5.4 e §7.5.5, lista de `db/migrations/platform/`.

NÃO FEITO: —

DECISÕES:
- **Vigência como `date`**, exceção declarada a `dados.md` §3. Uma regra nacional começa em instantes diferentes em cada fuso (Noronha, São Paulo, Manaus, Rio Branco e Eirunepé, todos confirmados no tzdata local). Um `timestamptz` não expressa "meia-noite de cada estabelecimento".
  - Medido (G9): o mesmo instante resolve a versão nova em São Paulo e a antiga em Manaus, cada uma no seu dia local.
- **Guarda de retroatividade na autoridade**, contra a meia-noite de `valid_from` no fuso do território em que o dia começa primeiro. Esse fuso é dado público do catálogo e nunca decide o dia de um fato.
  - Um limite universal (UTC+14) recusaria a lei publicada na véspera à noite (G1/G2).
- **Conteúdo da projeção em `text` canônico com digest**, não em tabelas tipadas nem em `jsonb`.
  - Tabelas tipadas obrigariam migration travada nas duas streams a cada forma nova de regra.
  - `jsonb` não preserva ordem de chave nem espaço, então o digest não confere. Isto vem da documentação do PostgreSQL; não medi.
  - Troca aceita: a restrição sobre o conteúdo fica só na autoridade. A projeção restringe a identidade (FK) e a integridade (digest).
- **Gravador separado do papel do cliente.** O `ALTER DEFAULT PRIVILEGES` dá `INSERT, SELECT, UPDATE` na projeção ao papel do cliente assim que ela nasce (medido em G4). Sem `REVOKE`, o caminho de requisição de X consegue plantar uma versão que os terminais de X recebem.

RISCOS:
- A stream `modules/**` não roda hoje: o registro de módulo ativo não existe (`CONTRATO.md` §2.3, §11.6). A projeção e a entrega dependem dele.
- `platform.role_declarations` só conhece `executor` e `app_credential`. O gravador (este e o de D-06(ii)) precisa de um tipo de declaração e de uma regra no `verify`, senão a §7.5.1 o acusa.
- O domínio de envelope da alíquota teria duas definições, uma no `platform` e outra no cliente, e nada no `verify` compara as duas.
- A segunda metade de `RN-NUC-015` ("quem publicou sabe quais terminais confirmaram") aplicada ao catálogo publicado por nós é leitura sobre N clientes. Isso é D-06(i)/(iii), que seguem abertas.
- Texto defasado, fora do meu território:
  - `operacao-offline-e-sincronizacao.md:147/239/351` ainda dá `LACUNA-OFF-006` como aberta, mas `RN-NUC-057` já a fechou (`nucleo-venda.md:356`).
  - `modulos/fiscal.md` ("D-04 ABERTA") e `fiscal-regimes-e-vigencia.md` §2/§6 ("D-01 a D-04 ABERTAS").
  - `roadmap-de-modulos.md` §7.1 e `:158` perdem a base quando D-05 fechar, junto com o B6 (`fiscal.md:80`) e a cópia dele em `pendencias-fase-1-e-2-2026-09-23.md:272-279`.
- `db/` aparece inteiro como não rastreado na working tree. É a outra instância; não toquei.

PERGUNTAS:
- para seguranca (consulta): o gravador de projeção, com `USAGE` em todo `t_*` com FIS e só `INSERT` na projeção, é aceitável como principal declarado? E comparar digests contra a autoridade basta contra falsificação, ou a assinatura da versão (P2) é requisito?
- para produto: que termo do glossário nomeia o "território" da regra (escopo geográfico de `RN-FIS-002`)? O documento usa `jurisdiction` só como ilustração.

VERIFICAÇÃO:
- Rodei em PostgreSQL 16.15, num contêiner descartável `forja-g1-pg` (porta 55541), removido ao fim. Script fora do repo, na scratchpad.
  - G1 a G3: guarda de retroatividade e de digest.
  - G4: privilégio por default.
  - G5 a G8: entrega sob o gravador, isolamento e digests iguais.
  - G9: resolução por fuso.
  - G10: FK.
  - G11: consulta de divergência.
  - Resultados na §5.7 do documento.
- Não medi o tempo de entrega com N real, o volume de um catálogo real, nem o `verify` do executor contra o gravador. Os números da §10 estão rotulados ESTIMATIVA.
- Não há migration, então o checklist de `migrations.md` §10 não se aplica aqui. O que a casa fixa para ele está na §11 e herda-se no item de FIS.

MEMÓRIA SUGERIDA:
- type=decision escopo=plataforma slug=decision-d-05-autoridade-no-platform-projecao-no-cliente: autoridade no platform, projeção com o mesmo id e digest no cliente, ordem publicar → projetar → liberar, vigência como data civil; `supera: [[decision-d-05-catalogo-de-regra-fiscal-sem-casa]]`.
- type=gotcha escopo=plataforma slug=gotcha-default-privileges-entrega-insert-na-projecao: tabela de projeção nasce gravável pelo papel do cliente por `ALTER DEFAULT PRIVILEGES` (medido); a migration que a cria revoga na mesma transação. Vale para D-06(ii).
- type=gotcha escopo=plataforma slug=gotcha-digest-sobre-jsonb-nao-confere: `jsonb` reordena chaves e normaliza espaço, então o conteúdo com digest vai em `text` canônico.

PRÓXIMO PASSO SUGERIDO: `seguranca`, consulta sobre o gravador (pergunta acima). Depois o thread decide D-05, registra e manda `produto` aplicar o B6 da §9.

## seguranca — 2026-09-23 (consulta sobre o gravador)

CONSULTA T-0020, resposta de seguranca para arquiteto-dados. Só leitura de desenho: d-05 §5, §9, §11 e TRL-01/TRL-04.

Isolamento, a prioridade um: não achei caminho de leitura entre clientes. O conteúdo da projeção é público e não carrega cliente. O gravador não tem `SELECT` (G6). O `app_t_X` não lê `t_y` nem o `platform` (G7). O risco que sobra é escrita em outro cliente, e isso é integridade.

(1) O gravador é aceitável como principal declarado, com uma condição: a pergunta invertida de `TRL-04` tem de cobrir também quem chega nele por cadeia de membro. Sem isso, um `GRANT <gravador> TO app_t_a` dá à credencial do caixa de A `INSERT` na projeção de todo cliente com `FIS`, e o predicado atual (`tenant-role.ts:125`) não enxerga isso. É a mesma correção de `TRL-04`, não é achado novo. Por coerência com `TRL-01`, o `INSERT` dele deve ser por coluna, sem `projected_at`, para que ele não consiga retrodatar a entrega.

(2) Comparar digest basta se a comparação tiver dono. Hoje ela não tem, e a assinatura continua P2:

### D05-01 — O reenvio lido como "já projetado", sem conferir o que ficou gravado, esconde versão plantada — [MÉDIO]
ONDE: d-05 §5.2 ("reinserir a mesma versão cai na chave primária, que o gravador lê como já projetado"), §5.6 (último parágrafo), §11 (o terminal confere o digest)
CENÁRIO: uma linha com o id da versão, digest coerente e conteúdo que a autoridade nunca publicou entra antes da rodada. Basta alguém ter `INSERT` ali: o `REVOKE` esquecido, a cadeia de `TRL-04` ou a credencial do gravador vazada. O gravador recebe 23505, não pode ler (G6) e registra "já projetado". Os terminais de X aplicam a versão falsa. A conferência do terminal e a da ingestão passam, porque comparam contra a própria linha falsa. Só a varredura contra a autoridade pega o caso, e §5.6 não diz quem a roda, com que papel nem com que cadência.
POR QUE É REAL: o digest só prova que o conteúdo bate com ele mesmo, e a única coisa que compara com a autoridade não tem principal nem cadência.
CORREÇÃO SUGERIDA: nomear quem compara (o executor, com `SELECT` nos dois lados), rodar a comparação a cada rodada de entrega e antes de liberar, e tratar divergência como fatal no livro da entrega. — dono: `arquiteto-dados`

(3) O `REVOKE` fecha a concessão direta do `ALTER DEFAULT PRIVILEGES`, e G4 mostra que ela entrega só `INSERT, SELECT, UPDATE`, sem `DELETE` nem `TRUNCATE`. Não fecha o caminho por papel alcançável com `SET ROLE` (`TRL-04`), e não impede que uma projeção futura nasça sem ele. Por isso o `verify` precisa afirmar que `app_t_X` não tem `INSERT`/`UPDATE` na projeção. Com `NOINHERIT`, `has_table_privilege` sozinho não serve: a checagem precisa incluir `pg_has_role(..., 'SET')`.

## RELATÓRIO — seguranca — T-0020
STATUS: OK
FEITO: respondi a consulta. Um achado novo, D05-01 [MÉDIO]. A condição de (1) e o furo de (3) são `TRL-04`, ainda aberto.
ARQUIVOS: docs/arquitetura/d-05-catalogo-fiscal-2026-09-23.md (só leitura); docs/auditorias/2026-09-23-d-06-trilha.md (só leitura)
NÃO FEITO: —
DECISÕES: assinatura continua P2 e não vira requisito. Todo caminho de falsificação exige uma falha anterior que o gate já cobre. O que faltava era o dono da comparação, não criptografia.
RISCOS: as correções de `TRL-04` e de D05-01 precisam entrar juntas no item de `FIS`.
PERGUNTAS: —
VERIFICAÇÃO: não rodei nada. Só li o desenho, como a consulta pediu.
MEMÓRIA SUGERIDA: —
PRÓXIMO PASSO SUGERIDO: arquiteto-dados, incluir D05-01 e a pergunta invertida de `TRL-04` nas heranças do item de `FIS` (d-05 §11).

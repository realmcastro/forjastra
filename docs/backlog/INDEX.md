# Backlog — migrado do board externo em 2026-09-11

Os 56 cards que existiam no board externo, trazidos para o repositório quando a ferramenta foi
abandonada. Daqui para a frente o backlog **é este diretório**: um arquivo por item, corpo integral,
sem nada em ferramenta de fora.

**O que os campos significam agora.** `Estado ao migrar` e `Prazo que constava` são registro
histórico, não estado atual: as datas foram calculadas em 2026-08-26 supondo três pessoas em
paralelo, e esse pressuposto caiu em 2026-09-11 (`memory/processo/state-execucao-solo-2026-09-11.md`).
Prazo vencido aqui não é atraso, é um número que perdeu o significado. O estado real de uma tarefa em
andamento mora na ficha dela, em `tarefas/`.

O conteúdo destes cards passou por duas rodadas de reescrita (`T-0007` contra as quatro perguntas de
`.claude/rules/produto.md`, `T-0008` contra o esqueleto de duas formas). É por isso que valia trazer
em vez de recomeçar.

**A família `F-005`..`F-013`, rótulo `captura`, nasceu em 2026-09-12 e tem uma origem só.** São os
achados da varredura do invariante 10 (`T-0010`, item `F-001`), que agrupa os nove: onze ausências de
captura foram encontradas em `docs/produto/**` e nenhuma delas vira `RN` sem decisão do humano — então
cada uma virou item, agrupada **por fluxo**, não por achado. Onde dois achados se resolvem na mesma
passada e no mesmo módulo, eles são um item, e o item diz quais cobre pelo número. Detalhe de cada um em
`docs/produto/captura-varredura-invariante-10-2026-09-11.md` §2 e no irmão
`captura-varredura-terceira-passada-2026-09-12.md` §2.

**`F-016` entrou na mesma família depois, e não veio de achado.** Veio do fechamento de `T-0010`: as
três passadas ancoraram a varredura em "arquivo que carrega `RN`" e depois em `docs/produto/**`
inteiro, e o escopo normativo que mora **fora** de `docs/produto/**` nunca entrou em âncora nenhuma.
É furo de método, não achado solto — por isso é `Prova`, e não `Comportamento` como os nove.

| Item | Tipo | Estado ao migrar | Prazo que constava | Agrupador | Rótulos | Título |
|---|---|---|---|---|---|---|
| [F-001](F-001-capturar-e-o-padrao-invariante-10.md) | Regra | **fechada** 2026-09-12 → [T-0010](../../tarefas/T-0010-invariante-10-captura.md) | — | — | — | Tornar a captura de fato de operação o padrão do sistema (invariante 10) |
| [F-002](F-002-fundacao-do-servidor.md) | Comportamento | **fechada** 2026-09-12 → [T-0011](../../tarefas/T-0011-fundacao-do-servidor.md) | — | — | — | Fundação do servidor: borda, tenant, erro e ponte para o banco |
| [F-003](F-003-conferencia-da-credencial-na-subida.md) | Comportamento | **em execução** desde 2026-09-12 → [T-0013](../../tarefas/T-0013-conferencia-da-credencial-na-subida.md) | — | — | — | `apps/api` confere a própria credencial na subida, antes de aceitar requisição |
| [F-004](F-004-recusa-de-borda-do-executor-vira-evento.md) | Comportamento | a fazer | — | — | — | A recusa de borda do executor vira evento em `platform.executor_events` |
| [F-005](F-005-colisao-e-segundo-consumo-em-msa-viram-fato.md) | Comportamento | a fazer | — | F-001 | captura | `MSA`: perda de corrida e segundo consumo no mesmo alvo passam a ter diagnóstico próprio |
| [F-006](F-006-conversao-do-canal-externo-rascunho-e-divergencia.md) | Comportamento | a fazer | — | F-001 | captura | `PCF`: o rascunho abandonado e a divergência entre exibir e submeter passam a deixar fato |
| [F-007](F-007-codigo-lido-e-nao-resolvido-tem-motivo-proprio.md) | Comportamento | **em execução** (reaberta 2026-09-23, escopo de `F-028`) → [T-0016](../../tarefas/T-0016-nascer-lacuna-per-6.md) | — | F-001 | captura | `PER`: código lido e não resolvido passa a separar catálogo incompleto de catálogo retido velho |
| [F-008](F-008-escalada-assumida-e-escalada-morta-em-ati.md) | Comportamento | a fazer | — | F-001 | captura | `ATI`: a escalada ganha o outro lado do marco — quem assumiu, e o que aconteceu com a que ninguém assumiu |
| [F-009](F-009-leitura-de-relatorio-deixa-rastro.md) | Comportamento | a fazer | — | F-001 | captura | `REL`: desenhar o fato de leitura de relatório para a valoração de `LACUNA-NUC-037` decidir sabendo o que perde |
| [F-010](F-010-provisionamento-que-falha-no-meio-vira-fato.md) | Comportamento | a fazer | — | F-001 | captura | `PRV`: o provisionamento que falha no meio passa a produzir fato, no passo em que parou |
| [F-011](F-011-entrega-eletronica-do-documento-vira-fato.md) | Comportamento | a fazer | — | F-001 | captura | `EMI`: a entrega do documento por meio eletrônico passa a produzir fato, como a impressa já produz |
| [F-012](F-012-no-de-manifesto-descartado-vira-fato.md) | Comportamento | a fazer — absorveu `F-022` em 2026-09-23 | — | F-001 | captura | Nó de manifesto descartado pelo terminal passa a produzir fato, e toda composição degradada também |
| [F-013](F-013-catalogo-de-capacidades-pergunta-o-que-a-capacidade-registra.md) | Comportamento | a fazer | — | F-001 | captura | O catálogo de capacidades passa a perguntar o que a capacidade registra e o que ela não registra |
| [F-014](F-014-auditar-o-nucleo-contra-as-duas-lojas-reais.md) | Prova | entregue 2026-09-12 — sem ficha (`processo.md` §5) → `docs/produto/dois-varejos-auditoria-do-nucleo-2026-09-12.md` | — | — | — | Auditar as 28 linhas de núcleo contra as duas lojas reais |
| [F-015](F-015-tirar-o-carimbo-de-moda-da-linha-de-eixos-da-fronteira.md) | Comportamento | entregue 2026-09-12 — sem ficha (`processo.md` §5) → `docs/produto/fronteira-do-nucleo.md:71` | — | — | — | Tirar o carimbo de ramo da linha de eixos em `fronteira-do-nucleo.md` (achado `A-06`) |
| [F-016](F-016-varrer-o-escopo-que-nunca-tera-rn.md) | Prova | **em execução** desde 2026-09-23 → [T-0017](../../tarefas/T-0017-varrer-escopo-sem-rn.md) | — | F-001 | captura | Varrer, atrás de captura ausente, o escopo que nunca terá `RN` |
| [F-017](F-017-fechar-d-03-identidade-e-prova.md) | Comportamento | **fechada** 2026-09-23 → [T-0015](../../tarefas/T-0015-fechar-d-03-identidade.md) | — | — | — | Fechar `D-03`: onde mora o sujeito, como ele prova quem é, e de onde chega o tenant |
| [F-018](F-018-decidir-as-lacunas-que-travam-as-fases-1-e-2.md) | Regra | **em execução** desde 2026-09-23 → [T-0014](../../tarefas/T-0014-decidir-lacunas-das-fases-1-e-2.md) | — | — | — | Decidir as lacunas de regra que travam as Fases 1 e 2, e pôr aviso de indisponibilidade no que depende de terceiro |
| [F-019](F-019-fechar-d-06-ii-residencia-da-trilha-dos-nossos-atos.md) | Comportamento | **fechada** 2026-09-23 → [T-0019](../../tarefas/T-0019-d-06-ii-residencia-da-trilha.md) | — | — | — | Fechar `D-06`(ii): onde mora a trilha dos nossos atos e das nossas leituras |
| [F-020](F-020-fechar-d-05-casa-do-catalogo-de-regra-fiscal.md) | Comportamento | **fechada** 2026-09-23 → [T-0020](../../tarefas/T-0020-d-05-catalogo-fiscal.md) | — | — | — | Fechar `D-05`: onde mora a regra fiscal que vale para mais de um cliente |
| [F-021](F-021-modelar-estabelecimento-e-terminal-habilitado.md) | Comportamento | **em execução** desde 2026-09-23 → [T-0022](../../tarefas/T-0022-estabelecimento-e-terminal.md) | — | — | — | Modelar estabelecimento, terminal e terminal habilitado a vender no schema de cliente |
| [F-022](F-022-composicao-degradada-alem-do-id-desconhecido-vira-fato.md) | Comportamento | **absorvido em `F-012`** 2026-09-23 → [`backlog-recortes.md`](../produto/backlog-recortes.md) | — | F-001 | captura | A composição de tela degradada pelo terminal passa a produzir fato, e não só no id desconhecido |
| [F-023](F-023-registro-interno-da-recusa-ganha-endereco.md) | Comportamento | a fazer | — | F-001 | captura | O "registro interno" para onde vai o detalhe técnico da recusa passa a existir |
| [F-024](F-024-regras-que-fecham-comportamento-fazem-a-pergunta-de-captura.md) | Regra | a fazer — dono humano ou thread; escrita em `.claude/**` negada em 2026-09-23 | — | F-001 | captura | As regras de agent que fecham comportamento passam a fazer a pergunta de captura |
| [F-025](F-025-recusa-na-borda-do-servidor-vira-fato.md) | Comportamento | a fazer — parcial: a linha sem identidade espera `F-017` | — | F-001 | captura | O que o servidor recusa ou reconhece na borda passa a produzir fato |
| [F-026](F-026-recusa-no-canal-local-vira-fato.md) | Comportamento | a fazer — não executável antes do contrato do canal local | — | F-001 | captura | O pedido que o acompanhante recusa à página passa a produzir fato |
| [F-027](F-027-gesto-do-operador-que-nao-vira-operacao-deixa-fato.md) | Comportamento | a fazer | — | F-001 | captura | O gesto do operador que não chega a operação passa a deixar fato |
| [F-028](F-028-leitura-recusada-em-camada-modal-vira-fato.md) | Comportamento | **absorvido em `F-007`** 2026-09-23 → [`backlog-recortes.md`](../produto/backlog-recortes.md) | — | F-001 | captura | Leitura recusada durante camada modal passa a produzir fato |
| [F-029](F-029-superficie-por-momento-nomeia-a-fonte-do-registro.md) | Comportamento | a fazer | — | F-001 | captura | A superfície por momento passa a dizer as três fontes do registro, e não só a atribuição |
| [F-030](F-030-modulo-de-ponto-fixo-de-dinheiro-e-quantidade.md) | Comportamento | **em execução** desde 2026-09-23 → [T-0021](../../tarefas/T-0021-modulo-de-ponto-fixo.md) | — | — | — | Módulo de ponto fixo de dinheiro e quantidade, em `packages/contracts/` |
| [SPR-1](SPR-1-recortar-o-escopo-do-ponto-de-venda-presencial-o-que-e-nucle.md) | Spike | Em andamento | 2026-09-30 | — | — | Recortar o escopo do ponto de venda presencial: o que é núcleo e o que é módulo |
| [SPR-2](SPR-2-modulo-de-pedido-pelo-cliente-final.md) | Spike | A fazer | 2026-11-30 | — | — | Módulo de Pedido pelo Cliente-Final |
| [SPR-3](SPR-3-modulo-de-entrega-de-pedidos.md) | Spike | A fazer | 2026-11-30 | — | — | Módulo de Entrega de Pedidos |
| [SPR-4](SPR-4-modulo-de-cozinha-recebimento-e-acompanhamento-de-pedidos.md) | Spike | A fazer | 2026-11-30 | — | — | Módulo de Cozinha: recebimento e acompanhamento de pedidos |
| [SPR-5](SPR-5-gestao-de-atendimento-e-comanda.md) | Epic | A fazer | 2026-11-13 | — | — | Gestão de Atendimento e Comanda |
| [SPR-6](SPR-6-iniciar-comanda-associada-a-mesa.md) | História | A fazer | 2026-11-13 | SPR-5 | — | Iniciar comanda associada a mesa |
| [SPR-7](SPR-7-iniciar-comanda-associada-a-cliente.md) | História | A fazer | 2026-11-13 | SPR-5 | — | Iniciar comanda associada a cliente |
| [SPR-8](SPR-8-criar-multiplas-comandas-para-uma-mesma-mesa.md) | História | A fazer | 2026-11-13 | SPR-5 | — | Criar múltiplas comandas para uma mesma mesa |
| [SPR-9](SPR-9-consultar-comandas-em-andamento.md) | História | A fazer | 2026-11-13 | SPR-5 | — | Consultar comandas em andamento |
| [SPR-10](SPR-10-alterar-mesa-associada-a-comanda.md) | História | A fazer | 2026-11-13 | SPR-5 | — | Alterar mesa associada à comanda |
| [SPR-11](SPR-11-permitir-atuacao-de-multiplos-garcons-na-mesma-comanda.md) | História | A fazer | 2026-11-13 | SPR-5 | — | Permitir atuação de múltiplos garçons na mesma comanda |
| [SPR-12](SPR-12-cancelar-comanda.md) | História | A fazer | 2026-11-13 | SPR-5 | — | Cancelar comanda |
| [SPR-13](SPR-13-o-fechamento-no-ponto-de-cobranca-conclui-o-consumo-em-abert.md) | História | A fazer | 2026-11-13 | SPR-5 | — | O fechamento no ponto de cobrança conclui o consumo em aberto |
| [SPR-14](SPR-14-modelar-as-entidades-de-atendimento-como-tabelas-do-modulo-s.md) | História | A fazer | 2026-10-23 | SPR-5 | — | Modelar as entidades de atendimento como tabelas do módulo, sem tocar o núcleo |
| [SPR-15](SPR-15-gestao-e-composicao-da-comanda.md) | Epic | A fazer | 2026-11-27 | — | — | Gestão e Composição da Comanda |
| [SPR-16](SPR-16-navegar-pelo-catalogo-de-produtos.md) | História | A fazer | 2026-11-27 | SPR-15 | bloqueada | Navegar pelo catálogo de produtos |
| [SPR-17](SPR-17-pesquisar-item-de-catalogo.md) | História | A fazer | 2026-11-27 | SPR-15 | — | Pesquisar item de catálogo |
| [SPR-18](SPR-18-escolha-obrigatoria-pendente-impede-o-lancamento-do-item-de.md) | História | A fazer | 2026-11-27 | SPR-15 | — | Escolha obrigatória pendente impede o lançamento do item de catálogo |
| [SPR-19](SPR-19-selecionar-variacao-do-produto.md) | História | A fazer | 2026-11-27 | SPR-15 | bloqueada | Selecionar variação do produto |
| [SPR-20](SPR-20-adicionar-adicionais-ao-produto.md) | História | A fazer | 2026-11-27 | SPR-15 | bloqueada | Adicionar adicionais ao produto |
| [SPR-21](SPR-21-adicionar-observacao-ao-item.md) | História | A fazer | 2026-11-27 | SPR-15 | — | Adicionar observação ao item |
| [SPR-22](SPR-22-lancar-item-de-catalogo-no-consumo-em-aberto-com-observacao.md) | História | A fazer | 2026-11-27 | SPR-15 | — | Lançar item de catálogo no consumo em aberto, com observação |
| [SPR-23](SPR-23-agregar-itens-equivalentes-na-apresentacao-do-consumo.md) | História | A fazer | 2026-11-27 | SPR-15 | — | Agregar itens equivalentes na apresentação do consumo |
| [SPR-24](SPR-24-alterar-quantidade-de-item.md) | História | A fazer | 2026-11-27 | SPR-15 | — | Alterar quantidade de item |
| [SPR-25](SPR-25-retirar-item-do-consumo-e-alterar-quantidade-de-item-ja-lanc.md) | História | A fazer | 2026-11-27 | SPR-15 | — | Retirar item do consumo, e alterar quantidade de item já lançado |
| [SPR-26](SPR-26-exibir-disponibilidade-dos-produtos.md) | História | A fazer | 2026-11-27 | SPR-15 | bloqueada | Exibir disponibilidade dos produtos |
| [SPR-27](SPR-27-validar-disponibilidade-antes-do-envio.md) | História | A fazer | 2026-11-27 | SPR-15 | — | Validar disponibilidade antes do envio |
| [SPR-28](SPR-28-calcular-valor-do-item.md) | História | A fazer | 2026-11-27 | SPR-15 | — | Calcular valor do item |
| [SPR-29](SPR-29-compor-o-acumulado-do-consumo-em-aberto-o-nucleo-compoe-msa.md) | História | A fazer | 2026-11-27 | SPR-15 | — | Compor o acumulado do consumo em aberto — o núcleo compõe, MSA expõe |
| [SPR-30](SPR-30-corrigir-item-ja-enviado-por-lancamento-novo-sem-editar-o-or.md) | História | A fazer | 2026-11-27 | SPR-15 | — | Corrigir item já enviado por lançamento novo, sem editar o original |
| [SPR-31](SPR-31-modelar-a-hierarquia-de-categorias-do-catalogo-sem-limite-ar.md) | História | A fazer | 2026-09-16 | SPR-34 | bloqueada | Modelar a hierarquia de categorias do catálogo, sem limite artificial de profundidade |
| [SPR-32](SPR-32-modelar-produto-variacao-e-complemento-no-nucleo-e-ingredien.md) | História | A fazer | 2026-09-22 | SPR-34 | bloqueada | Modelar produto, variação e complemento no núcleo — e ingrediente no módulo |
| [SPR-33](SPR-33-definir-a-equivalencia-de-composicao-de-itens-e-a-identidade.md) | História | A fazer | 2026-09-28 | SPR-34 | bloqueada | Definir a equivalência de composição de itens, e a identidade que a sustenta |
| [SPR-34](SPR-34-fase-1-modelo-de-dados-e-fundacao-do-servidor.md) | Epic | A fazer | 2026-10-23 | — | bloqueada | Fase 1 — modelo de dados e fundação do servidor |
| [SPR-35](SPR-35-fundacao-do-cliente-fechar-a-escolha-de-arranjo-b-ou-d.md) | Epic | A fazer | 2026-10-05 | — | — | Fundação do cliente — fechar a escolha de arranjo (B ou D) |
| [SPR-36](SPR-36-modelar-o-schema-de-controle-clientes-modulos-ativos-e-livro.md) | História | **em execução** desde 2026-09-11 → [T-0009](../../tarefas/T-0009-fundacao-do-banco.md) | 2026-10-07 | SPR-34 | bloqueada | Modelar o schema de controle: clientes, módulos ativos e livro-razão de migration |
| [SPR-37](SPR-37-modelar-venda-pagamento-caixa-turno-e-operador-no-schema-de.md) | História | A fazer | 2026-10-07 | SPR-34 | bloqueada | Modelar venda, pagamento, caixa, turno e operador no schema de cliente |
| [SPR-38](SPR-38-construir-o-executor-de-migration-forward-only-idempotente-n.md) | História | **em execução** desde 2026-09-11 → [T-0009](../../tarefas/T-0009-fundacao-do-banco.md) | 2026-09-30 | SPR-34 | — | Construir o executor de migration: forward-only, idempotente, N schemas, retomável |
| [SPR-39](SPR-39-fechar-a-convencao-de-chave-primaria-timestamps-e-exclusao-l.md) | Spike | **em execução** desde 2026-09-11 → [T-0009](../../tarefas/T-0009-fundacao-do-banco.md) | 2026-09-16 | SPR-34 | — | Fechar a convenção de chave primária, timestamps e exclusão lógica |
| [SPR-40](SPR-40-fechar-tipo-unidade-e-escala-de-dinheiro-e-de-quantidade.md) | Spike | **fechada** 2026-09-23 → [T-0018](../../tarefas/T-0018-dinheiro-e-quantidade.md) | 2026-10-15 | SPR-34 | bloqueada | Fechar tipo, unidade e escala de dinheiro e de quantidade |
| [SPR-41](SPR-41-gate-de-seguranca-do-modelo-da-fase-1-isolamento-de-tenant.md) | Spike | **em execução** desde 2026-09-11 → [T-0009](../../tarefas/T-0009-fundacao-do-banco.md) | 2026-10-09 | SPR-34 | — | Gate de segurança do modelo da Fase 1 — isolamento de tenant |
| [SPR-42](SPR-42-validar-expo-na-superficie-sem-custodia-retaguarda-cliente-f.md) | Spike | A fazer | 2026-09-09 | SPR-35 | — | Validar Expo na superfície SEM custódia — retaguarda, cliente-final e display de leitura à distância |
| [SPR-43](SPR-43-validar-expo-e-react-native-na-superficie-com-custodia-estac.md) | Spike | A fazer | 2026-09-09 | SPR-35 | — | Validar Expo e React Native na superfície COM custódia — estação Windows offline e terminal do operador |
| [SPR-44](SPR-44-analisador-tolerante-do-manifesto-e-despacho-tipado-com-fall.md) | História | **fechada** 2026-09-12 → [T-0012](../../tarefas/T-0012-vocabulario-e-analisador-do-manifesto.md) | 2026-09-18 | SPR-35 | — | Analisador tolerante do manifesto e despacho tipado com fallback garantido |
| [SPR-45](SPR-45-registro-do-vocabulario-fechado-de-ids-de-bloco.md) | História | **fechada** 2026-09-12 → [T-0012](../../tarefas/T-0012-vocabulario-e-analisador-do-manifesto.md) | 2026-08-31 | SPR-35 | — | Registro do vocabulário fechado de ids de bloco |
| [SPR-46](SPR-46-catalogo-de-mensagens-e-formatacao-unica-de-dinheiro-quantid.md) | História | A fazer | 2026-09-24 | SPR-35 | — | Catálogo de mensagens e formatação única de dinheiro, quantidade e fuso |
| [SPR-47](SPR-47-variantes-por-espaco-e-por-interacao-resolvidas-no-terminal.md) | História | A fazer | 2026-09-25 | SPR-35 | — | Variantes por espaço e por interação, resolvidas no terminal |
| [SPR-48](SPR-48-foco-teclado-e-leitor-de-codigo-de-barras-como-primeira-clas.md) | História | A fazer | 2026-10-05 | SPR-35 | — | Foco, teclado e leitor de código de barras como primeira classe |
| [SPR-49](SPR-49-tokens-do-sistema-de-design-em-codigo-primitiva-semantica-e.md) | História | A fazer | 2026-09-17 | SPR-35 | — | Tokens do sistema de design em código: primitiva, semântica e tema |
| [SPR-50](SPR-50-decidir-o-arranjo-do-cliente-interface-dentro-do-processo-na.md) | Spike | Concluído | 2026-09-14 | SPR-35 | — | Decidir o arranjo do cliente: interface dentro do processo nativo, ou navegador com acompanhante |
| [SPR-51](SPR-51-prova-medida-da-drenagem-que-nao-compete-com-o-caixa.md) | Spike | A fazer | 2026-10-29 | SPR-34 | — | Prova medida da drenagem que não compete com o caixa |
| [SPR-52](SPR-52-fechar-a-metade-aberta-da-decisao-de-stack-camada-de-dados-e.md) | Spike | A fazer | 2026-10-22 | SPR-34 | — | Fechar a metade aberta da decisão de stack: camada de dados e framework HTTP |
| [SPR-53](SPR-53-revalidar-o-backlog-inteiro-contra-a-spec-aprovada.md) | Spike | Concluído | 2026-08-27 | — | — | Revalidar o backlog inteiro contra a spec aprovada |
| [SPR-54](SPR-54-aplicar-no-board-a-revisao-do-backlog-contra-a-spec-aprovada.md) | História | Em andamento | — | — | bloqueada | Aplicar no board a revisão do backlog contra a spec aprovada |
| [SPR-55](SPR-55-reescrever-os-cards-do-board-contra-o-padrao-de-escrita-e-co.md) | História | Concluído | — | — | — | Reescrever os cards do board contra o padrão de escrita e congruência |
| [SPR-56](SPR-56-reescrever-os-cards-do-board-contra-o-esqueleto-de-duas-form.md) | História | Concluído | — | — | — | Reescrever os cards do board contra o esqueleto de duas formas (pós-T-0007) |

# Memória — Plataforma (vale para todo cliente e todo módulo)

Índice lido em **toda** tarefa. Filtre pela sua `camada` e abra registro só pelo gancho.

## Decisões

- [Forja é um PDV modular, não um sistema de restaurante](decision-forja-e-pdv-modular.md) — identidade do produto é núcleo de venda + módulos; restaurante é a primeira vertical, não o produto, e a vertical de construção é corpo de prova · camada:produto
- [Um schema Postgres por cliente](decision-tenancy-schema-por-cliente.md) — isolamento por schema (`t_<slug>`) + `platform` de controle; migration roda N vezes, nenhuma consulta cruza schema — **e o schema isola cliente, não estabelecimento** · camada:dados
- [Migration é forward-only, com ciclo expand/contract](decision-migrations-forward-only.md) — migration aplicada nunca é editada; nada é dropado/renomeado por agent; remoção é passo 4, em release separado, com aval do humano · camada:dados
- [Orquestrador planeja, thread principal despacha](decision-arquitetura-de-agents.md) — subagent não dispara subagent; territórios de escrita por path habilitam paralelismo; 5 gates obrigatórios · camada:processo
- [Memória é grafo por escopo, não pilha](decision-memoria-em-grafo.md) — plataforma/módulo/vertical/cliente com precedência do mais específico; leitura seletiva é o mecanismo de economia de contexto · camada:processo
- [A célula é a autoridade única sobre autorização](decision-celula-e-autoridade-unica-sobre-autorizacao.md) — a célula da matriz vence prosa em qualquer `RN`, inclusive na dona; papel nomeado em prosa é candidato, nunca concessão; valor de célula é do humano · camada:produto
- [Contenção de papel não gera autoridade retida](decision-contencao-de-papel-nao-gera-autoridade-retida.md) — 5 papéis fechados, `cashier ⊆ manager ⊆ owner`; conter não é reter, por isso o `owner` sozinho não faz operação sensível offline · camada:produto
- [D-03 são três eixos, não uma decisão](decision-d-03-sao-tres-eixos-nao-uma-decisao.md) — residência do sujeito · mecanismo de prova · chegada do tenant; **segue ABERTA**, fecha com uma pergunta única ao humano, e o terceiro eixo **já perdeu uma opção** para papel nosso (`PRV-15`) · camada:backend
- [D-05: o catálogo de regra fiscal não tem casa](decision-d-05-catalogo-de-regra-fiscal-sem-casa.md) — as três saídas têm defeito; `FIS` **não é modelável** antes de decidir, e a decisão nem está na tabela do `CLAUDE.md` §8 · camada:dados
- [Emissão fiscal é própria](decision-emissao-fiscal-propria.md) — montamos, assinamos e transmitimos; daí custódia de credencial, contingência no produto e vigência de regra como obrigação nossa, para sempre · camada:produto
- [Agregado de período fechado não é cache](decision-agregado-de-periodo-fechado-nao-e-cache.md) — derivação reconstruível de fato imutável escapa da proibição de cache; período aberto não; "pico" de período encerrado é **fechado**; ⚠️ **premissa corrigida em 2026-08-23**: existe agora um leitor cujas perguntas somam clientes · camada:performance
- [O nosso negócio é o quinto escopo: `provedor`](decision-quinto-escopo-provedor.md) — operação nossa não é núcleo, módulo, vertical nem cliente; tem endereço e código próprios (`PRV`), **não** herda o nome "plataforma", e nenhum identificador foi renomeado para caber na palavra do humano · camada:produto
- [Leitura e mutação são eixos independentes](decision-leitura-e-mutacao-sao-eixos-independentes.md) — nenhum papel nosso porta os dois amplos; é este eixo que **completou** o desenho vigente em vez de negá-lo, e a premissa "leitura nossa só por concessão" caiu em 2026-08-23 sem nenhum enunciado mudar · camada:produto
- [D-06 são três residências, não uma decisão](decision-d-06-sao-tres-residencias-nao-uma.md) — agregado que soma clientes · trilha dos nossos atos · observação de operação por cliente; **ABERTA**, cinco saídas com defeito em cada, e a trilha não pode ficar aberta para a Fase 1 · camada:dados
- [A legibilidade do foco é propriedade do par](decision-legibilidade-do-foco-e-propriedade-do-par.md) — 13,56/1,28 sobre desabilitado e 2,89/6,02 sobre `danger`; os dois membros são inseparáveis, e desenhar um só reprova em silêncio · camada:ui

## Regras de negócio

- [Ato ordinário × operação sensível](business-rule-ato-ordinario-versus-operacao-sensivel.md) — sem rede, a venda comum se apoia em terminal habilitado + operador identificado, nunca em autoridade de pessoa; só o sensível exige autoridade retida · camada:produto
- [A habilitação a vender do terminal tem prazo](business-rule-habilitacao-a-vender-do-terminal-tem-prazo.md) — terminal sem rede não recebe revogação, então sem prazo a revogação é promessa que a física do offline não cumpre; o número é `LACUNA-OFF-017` · camada:produto
- [Registro de ato nomeia em que o ato se sustentou](business-rule-registro-de-ato-nomeia-em-que-o-ato-se-sustentou.md) — uma de três fontes (atribuição · concessão · identificação retida + habilitação do terminal), nunca "nenhuma"; com a terceira e limite publicado, diz também qual teto · camada:produto

## Armadilhas

- [Regra nova que não corrige a célula nasce inerte](gotcha-regra-nova-que-nao-corrige-a-celula-nasce-inerte.md) — duas correções corretas da mesma rodada se anularam (`AUT-14`); quem muda desfecho de célula entrega a célula no mesmo despacho, e reauditar o conserto é obrigatório · camada:produto
- [Fuso do estabelecimento × fuso do cliente](gotcha-fuso-do-estabelecimento-versus-fuso-do-cliente.md) — regra aprovada contra regra aprovada; some com um estabelecimento só e reaparece com dois, decidindo a que dia o fato pertence · camada:dados
- [Revogação de terminal não alcança o offline](gotcha-revogacao-de-terminal-nao-alcanca-offline.md) — "terminal furtado não vende mais" é falso: revogar é ato do servidor, a janela é o prazo de habilitação, e a notificação carrega as duas validades · camada:produto
- [O caso de falha do mecanismo novo é o primeiro lugar a olhar](gotcha-o-caso-de-falha-do-mecanismo-novo-e-o-primeiro-lugar-a-olhar.md) — três vezes em duas fichas um campo obrigatório nasceu sem valor possível, e a terceira nasceu do **conserto** da segunda; quem cria sujeito novo entrega o campo dele na mesma passada · camada:produto
- [Nenhuma superfície nossa enumera clientes para escolher](gotcha-nenhuma-superficie-nossa-enumera-clientes-para-escolher.md) — escolher numa lista **é** resolver o alvo pelo que o pedido informa; do nosso lado a lista entrega a **carteira**, e a cláusula já foi retirada uma vez sem produzir sintoma · camada:produto
- [A trava que nunca cai não é a inércia](gotcha-a-trava-que-nunca-cai-nao-e-a-inercia.md) — duas das travas do escopo `provedor` **existem para cair**; a permanente é o default fechado (queda **sem sintoma**); e a quarta coisa não é trava — é o cliente-alvo fora do pedido · camada:seguranca
- [Fato do provedor não tem residência única](gotcha-fato-do-provedor-nao-tem-residencia-unica.md) — a tentativa **recusada** não tem ambiente de cliente escolhível, logo regra única de residência está descartada por construção; e o argumento fácil para isso é **falso** · camada:dados
- [Agregado é seguro por concentração, não por N](gotcha-agregado-e-seguro-por-concentracao-nao-por-n.md) — com um cliente dominante o pico do agregado **é** a curva dele e nenhum `N` conserta; a condição é **contribuição máxima**, medida antes de exibir, falhando fechado · camada:seguranca
- [Artefato corrente colide com trilha por ocorrência](gotcha-artefato-corrente-colide-com-trilha-por-ocorrencia.md) — painel ao vivo + "toda leitura é fato" = uma leitura por atualização: ou a trilha vira medida de recarga de tela, ou o artefato é isento e a isenção revoga a trilha em silêncio · camada:produto
- ["Zero venda às 15h" não se distingue de "o terminal morreu às 15h"](gotcha-zero-venda-nao-se-distingue-de-terminal-morto.md) — sem fato de pedido aberto a hipótese offline é **infalsificável**, e nada disso tem backfill; capturá-lo revoga cláusula vigente (`LACUNA-NUC-038`) · camada:dados

## Convenções

- [Necessidade antes de mecanismo](convention-necessidade-antes-de-mecanismo.md) — recusar mecanismo é evolução; recusar capacidade validada é defeito de produto disfarçado de postura; toda recusa tem quatro partes, e os `PN-nn` são critério citável por número · camada:produto
- [Operação sensível é o irreversível ou não conferível depois](convention-criterio-de-operacao-sensivel.md) — não é "move dinheiro"; por isso reimpressão de via entra, e por isso o registro é precondição do ato · camada:seguranca
- [Campo de texto livre não é campo enumerável](convention-campo-de-texto-livre-nao-e-campo-enumeravel.md) — estreitar leitura por enumeração só funciona onde a `RN` dona foi enumerada na mesma passada; sobre texto de terceiro, mostre presença, não conteúdo · camada:produto
- [Piso antes de diferencial no corte de MVP](convention-piso-antes-de-diferencial-no-corte-de-mvp.md) — capacidade obrigatória por dependência é piso; MVP não recebe diferencial enquanto houver piso descoberto · camada:produto
- [Gravar a própria trilha não é mutação](convention-gravar-a-propria-trilha-nao-e-mutacao.md) — o eixo de mutação mede alcance sobre o dado do **negócio** do cliente, nunca sobre o registro do próprio ato; e promessa de trilha se escreve como **resultado**, nunca como lugar — foi isso que a fez sobreviver às cinco saídas de `D-06` · camada:produto
- [Retenção tem três relógios](convention-retencao-tem-tres-relogios.md) — obrigação · **prova** · discricionário; pôr a trilha no discricionário permite encurtar **por custo** a única prova de que o nosso acesso foi legítimo, e retenção é ≥ a janela de leitura publicada · camada:dados
- [Fato não carrega campo de calendário](convention-fato-nao-carrega-campo-de-calendario.md) — só instante, e **dois** (terminal e recepção); dia, mês e turno são derivação de leitura, e é isso que faz a família sobreviver ao conflito de fuso fechando para **qualquer** lado · camada:dados
- [Célula candidata é espécie diferente de célula valorada](convention-celula-candidata-e-especie-diferente-de-celula-valorada.md) — branco **não** é `?`: `?` é valor e **conta**; branco é linha inexistente, e somar a folha à contagem da matriz produz número falso **sem sintoma** · camada:produto
- [Um prefixo, uma espécie](convention-prefixo-de-token-uma-especie.md) — o sufixo nunca é o discriminador (`spacing.` é escala, `space.` é espaço de desenho); e id que atravessa a rede não se renomeia nunca · camada:ui

## Estado

- [Fase 0 — arquitetura de trabalho com IA](state-fase-0-arquitetura-ia.md) — o que já existe, o que vem na Fase 1, o que está deliberadamente ausente · camada:processo
- [Pendências abertas em 2026-08-23](state-pendencias-abertas-2026-08-23.md) — as cinco decisões do humano, as lacunas que travam trabalho (`LACUNA-NUC-037` é a de maior alavanca) e os resíduos com dono · camada:processo

## Referências

- [Dossiês de decisão de arquitetura](reference-dossies-de-decisao-de-arquitetura.md) — `docs/arquitetura/`: D-01/D-02 (um binário para os três alvos **não** sobrevive), D-03, e a pesquisa fiscal com URL por afirmação · camada:backend
- [Projeto de referência: belasvue](reference-projeto-belasvue.md) — de onde vieram o esquema de memória e o SDUI; o que copiar e o que não copiar · camada:processo

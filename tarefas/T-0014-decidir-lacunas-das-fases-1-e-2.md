---
id: T-0014
backlog: F-018
titulo: Decidir as lacunas de regra das Fases 1 e 2 e dar aviso ao que depende de terceiro
status: aberta
escopo: cliente=- vertical=- modulo=- camada=produto
aberta_em: 2026-09-23
---

## Pedido

"Cara, sobre as decisões, você faz o que for melhor para a escalabilidade. A lacuna de periféricos
precisa nascer, pois então que ela nasça. A gente vai fazer a base e bem feita. O que não tiver ao seu
alcance, você vai continuando o restante e coloca um aviso claro lá na hora da, do módulo tal coisa não
funciona porque precisa de tal coisa." (humano, 2026-09-23)

Regra de trabalho que saiu disso: [[convention-decisao-delegada-com-aviso-no-modulo]]. Plano da base
inteiro, com as ondas, no relatório do `orquestrador` de 2026-09-23; aqui entra só a parte desta ficha.

## Plano

## PLANO: T-A (T-0014), decidir as lacunas de regra da Fase 1 e 2, com os avisos
BACKLOG: F-018
ESCOPO: inventário completo com classificação; decisão das lacunas de regra de classe (a) em três passadas por arquivo disjunto; avisos das de classe (b); ajuste do corpo dos itens afetados (`SPR-37`, `36`, `40`, `31`, `32`, `33`, `26`, `27`, `46`).
FORA DE ESCOPO: decisões de arquitetura (T-B, T-E, T-F, T-G); escopo `provedor`; valorar células de `REL` (fica com `F-009`); partir `roadmap-de-modulos.md`.
ESCOPO DE MEMÓRIA: cliente=- vertical=- modulo=- camada=produto
DECISÕES ABERTAS QUE TOCAM ISSO: `D-03`. A.2a não decide onde o operador mora e só escreve regra que valha nas três opções. `D-05`/`D-06`: não tocar.
PASSOS:
1. A.1 `produto`, inventário
   - **Brief:** levantar **todas** as pendências que travam a Fase 1 e a Fase 2, partindo da tabela preliminar acima e da seção de lacunas de cada spec de núcleo e de módulo do MVP.
   - Para cada uma: id, o que trava, classe (a) ou (b), quem decide, recomendação pelo critério de escalabilidade. Para as de classe (b): o texto do aviso e o arquivo onde ele mora.
   - Incluir seção "itens ausentes": cobertura de backlog da Fase 2 (não há item de rota de venda ou pagamento) e itens desatualizados (`SPR-52`).
   - Só lê; escreve um arquivo novo.
   - **Entrega:** `docs/produto/pendencias-fase-1-e-2-2026-09-23.md`.
   - Paralelo com A.2a, T-B.1, T-C.1, T-D.1, T-E.1 e T-F.1.
2. A.2a `produto`, cluster operação (o que trava o `SPR-37`)
   - **Brief:** decidir por regra `RN-*`, com o recusado e o motivo: turno × sessão de caixa, `LACUNA-GLO-001`, `NUC-041`, `042`, `043`, as reservas `G-01`, o rateio de `G-09` e `A-04`.
   - Critério: o desenho que não obriga nenhum dos ramos. Exemplos: turno como agrupamento declarado e opcional sobre a sessão de caixa; fuso onde uma rede com unidades em fusos diferentes continua correta.
   - Para `A-04`: a regra que muda autorização entrega a **célula** no mesmo despacho (`gotcha-regra-nova-que-nao-corrige-a-celula-nasce-inerte`).
   - Reescrever o corpo de `SPR-37` (aceite 5) e de `SPR-36` pela régua de edição.
   - **Arquivos, e só estes:** `nucleo-caixa-e-turno.md`, `nucleo-estabelecimento.md`, `nucleo-venda.md`, `glossario.md`, `fronteira-do-nucleo.md`, `papeis-e-permissoes.md`, `matriz-operacao-papel.md`, e os itens `SPR-34`/`36`/`37`/`40`.
   - Arquivo que passar de 400 linhas: justificar no relatório ou partir por eixo, e declarar qual das duas fez.
   - **Entrega:** as `RN` novas ou alteradas mais os itens editados.
   - Paralelo, desde a onda 1.
3. A.2b `produto`, cluster catálogo
   - **Brief:** decidir `G-03`, `G-04`, `G-05`, `G-07`, `A-01` e `A-05`, com o recusado e o motivo; editar `SPR-31`/`32`/`33`/`26`/`27`.
   - **Arquivos:** `nucleo-publicacao-e-texto.md` (`RN-NUC-013`), `catalogo-de-modulos.md`, os itens citados e, só depois de A.2a, `glossario.md`, `fronteira-do-nucleo.md` e `nucleo-venda.md`.
   - **Entrega:** as `RN` mais os itens.
   - Sequencial depois de A.2a (dividem glossário e fronteira).
4. A.3 `produto`, avisos
   - **Brief:** aplicar o aviso a cada pendência de classe (b) do inventário.
   - **Arquivos:** `modulos/fiscal.md`, `fiscal-*.md`, `modulos/pedido-cliente-final.md`, `modulos/atendimento-ia.md`, `operacao-do-provedor.md`, `fatos-de-operacao-retencao-e-descarte.md`, e `modulos/perifericos.md` **só depois de T-C fechar**.
   - **Entrega:** avisos em disco, com a lista `path:linha`.
   - Depende de A.1. Paralelo com A.2a e A.2b (arquivos disjuntos).
5. A.2c `produto`, cluster Fase 2
   - **Brief:** `LACUNA-OFF-017`, `OFF-016`, `NUC-039`, espaçamento de retentativa (declarar o dono), `G-08`, `PER-1`, e os relógios de prova e discricionário de `NUC-040`/`REL-001`.
   - Número com unidade e o motivo de cada um.
   - **Arquivos:** `operacao-offline-e-sincronizacao.md` (depois de T-C), `fila-local-*.md`, `fatos-de-operacao-retencao-e-descarte.md` (depois de A.3).
   - **Entrega:** as `RN`.
   - Depois de A.1, T-C e A.3.
6. `seguranca` (consulta)
   - **Brief:** para `A-04`, dizer se "autorizar e ser autorizado pela mesma pessoa" abre porta além da loja de uma pessoa só.
   - **Entrega:** resposta com no máximo 10 linhas.
   - Disparada pela `PERGUNTAS` de A.2a.
GATES: gate 1 (esta tarefa é o próprio `produto`). Gate 3 não se aplica, porque não há endpoint. `seguranca` entra só por consulta em `A-04`.
RISCO PRINCIPAL: A.2a escrever o fuso ou a moeda de modo que a coluna tenha dono errado. Depois da primeira migration de cliente, isso só sai por expand/contract em N schemas.

## Fechamento

—

## produto — 2026-09-23 (A.1, inventário)

## RELATÓRIO — produto — T-0014 (passo A.1)
STATUS: OK
FEITO:
- Inventariei as pendências que travam as Fases 1 e 2, a partir da tabela de `F-018` e do plano. Fechei o conjunto conferindo contra as seções de lacuna de 14 specs, `backlog-lacunas-g01-g09.md`, `dois-varejos-auditoria` §4–§5, `roadmap-de-modulos.md` §4/§5.3/§7/§10 e `state-pendencias-abertas-2026-08-23.md` inteiro. A lista do que foi varrido, e do que não foi com o motivo, está na §1 do arquivo.
- Classe (a): 15 entradas (A1–A15), cada uma com onde nasce, o que trava, a passada que decide, a recomendação e o eixo. Por exemplo: fuso do estabelecimento, com o caso Manaus/São Paulo respondido; moeda do estabelecimento; turno opcional sobre a sessão de caixa.
- Classe (b): 7 avisos (B1–B7) no formato fixo de `F-018`. O `Enquanto isso` de cada um cita uma regra ou um default que já existe, e cada aviso diz o arquivo onde vai morar.
- Seções à parte: o que já está decidido mas o registro ainda mostra aberto (§5), o que fica fora do conjunto e por quê (§6), os itens ausentes e desatualizados (§7), e onde o plano e o item divergem (§8).
ARQUIVOS: `docs/produto/pendencias-fase-1-e-2-2026-09-23.md` (novo, cerca de 387 linhas). Todo o resto foi só leitura.
NÃO FEITO: —
DECISÕES:
- Dividi `G-09` em duas partes. O mecanismo é (a) e fica com A.2a: a regra de composição é artefato publicado pelo `owner` (linha 38), versionado, e o produto enumera os modos sem escolher. A regra que a norma exige é (b) e ganha o aviso B1. Isso concilia o plano (rateio em A.2a) com o `F-018` (contador). E evita inventar arredondamento: sem publicação, a composição falha fechado por `RN-NUC-013`, infeliz (a).
- Tirei do conjunto `Q-A`, `Q-B`, `Q-C` e as três perguntas às lojas de §0.3. As recomendações A6, A8 e A9 sobrevivem a qualquer resposta: elas calibram, não decidem coluna.
- `Q-D`/`A-03` ficam como risco, sem aviso: se `service_mode` descer para módulo, o custo é coluna morta, não migração de dado.
- Incluí `G-07`, `G-08` e `LACUNA-FIS-002` apesar do Fora de escopo de `F-018`, cada uma com o `path:linha` que mostra que ela decide o núcleo ou o desfecho da venda. `PER-1` não tem esse motivo, e recomendo tirá-lo de A.2c.
- A13 também responde duas perguntas que `F-021` deixou para `produto`: reabilitar terminal comprometido e mover terminal entre estabelecimentos. A recomendação é cadastro novo mais descomissionar, sem operação própria.
RISCOS:
- Os números de linha andaram durante a leitura: `fatos-de-operacao.md` e `modulos/perifericos.md` mudaram, e `T-0016` já fez nascer `RN-NUC-057`. O arquivo manda conferir pelo id da lacuna.
- B1 tem consequência operacional. Até o `owner` publicar a regra de composição, item vendido por peso não compõe valor. A loja de polpa esbarra nisso no primeiro cadastro.
- A13 é o achado de maior alcance: sem a linha de habilitar terminal, nenhum ato ordinário acontece, e a Fase 2 inteira nasce negada.
- `T-0009` executa cinco itens (`SPR-34`, `36`, `38`, `39`, `41`), e o `docs/backlog/INDEX.md` mostra quatro deles "A fazer". Isso fere o par um para um de `backlog.md` §4. Não corrigi, porque escrevi só o arquivo do brief.
PERGUNTAS:
- para orquestrador: 15 pendências de classe (a) não têm passada no plano (§8, primeiro item). Aceita a distribuição proposta, sete para A.2a e seis para A.2c?
- para orquestrador: os avisos B1, B2 e B3 moram em `nucleo-venda.md` e `nucleo-publicacao-e-texto.md`, que são de A.2a e A.2b, não de A.3. E A.3 lista arquivos de `PCF`, `ATI` e `provedor`, onde o conjunto não tem pendência. Quem escreve esses três avisos, e esses três arquivos saem de A.3?
- para humano: pôr `GRD` no MVP 1 é escopo comercial. Sem ele, tamanho de bebida fica como item por combinação até `GRD` entrar (A9, `G-04`). Aceita?
VERIFICAÇÃO: Contei as linhas pelo `Grep` com contagem: 382 antes das duas últimas edições, que acrescentaram cerca de 5, logo abaixo de 400. Refiz o `grep habilit` nas três matrizes e confirmei que não há linha de habilitar terminal. Li as fontes de todas as `path:linha` citadas nesta passada. Não rodei nada além disso.
MEMÓRIA SUGERIDA:
- type=state escopo=plataforma slug=state-pendencias-abertas-2026-08-23: atualizar os itens já fechados. `D-01`, `D-02` e `D-04` fecharam em 2026-09-11; `LACUNA-NUC-038` fechou em 2026-09-11; `LACUNA-PER-6` virou `RN-NUC-057` em 2026-09-23. A §3.8 aponta para um registro removido. A §0 passa a apontar para `docs/produto/pendencias-fase-1-e-2-2026-09-23.md`.
- type=state escopo=plataforma slug=—: corrigir a linha `memory/plataforma/INDEX.md:90`, que ainda diz "ORM e framework HTTP seguem abertos".
- type=gotcha escopo=plataforma slug=gotcha-operacao-sem-linha-nega-o-proprio-caminho-critico: ato que é precondição de todo ato ordinário (habilitar terminal) nasceu sem linha em matriz nenhuma, e o default fechado negou a venda inteira sem nenhum sintoma na spec.
PRÓXIMO PASSO SUGERIDO: A.2a (`produto`) nesta ordem: A1–A4 (destravam `F-021`), A13, A5–A8 e A10–A12, depois o mecanismo de B1. A consulta a `seguranca` do plano cobre A8 e `LACUNA-NUC-015` juntas.

## produto — 2026-09-23 (A.3, avisos, primeira leva)

## RELATÓRIO — produto — T-0014 (passo A.3, primeira leva)
STATUS: OK
FEITO:
- Apliquei o B4 só em `EMI`: o aviso de numeração fiscal pré-alocada por terminal ficou no topo de `RN-EMI-022`. Acrescentei ao `Falta` o id `LACUNA-OFF-002`, para que ele possa ser rastreado. A parte de `operacao-offline-e-sincronizacao.md` §8 fica para a leva 2.
- Apliquei o B6 no topo da §2 (`FIS`) de `modulos/fiscal.md`. A linha de `LACUNA-FIS-002` (Lacunas) ganhou um ponteiro para o aviso. Reescrevi o `Não funciona` do rascunho do inventário, que dizia "saber se...", para dizer a capacidade que falha: compor o IBS/CBS no total que o cliente-final paga.
- Apliquei o B7 no topo de `RN-NUC-049`. O `Falta` ganhou `LACUNA-NUC-040` (relógio de obrigação) e `LACUNA-EMI-007` (guarda do documento).
- No inventário, marquei B4 como aplicado em parte e B6 e B7 como aplicados, com `path:linha`. Corrigi também três citações de `modulos/fiscal.md` que a minha inserção deslocou (`:189`→`:197`, `:372`→`:380`, `:376-377`→`:384-385`, `:194-195`→`:202-203`).
- Não apliquei os dois avisos da §9 de `d-06-trilha-residencia-2026-09-23.md` nem o de `GRD`. Os arquivos deles não são desta passada; os motivos estão em PERGUNTAS.
ARQUIVOS:
- `docs/produto/fiscal-emissao-contingencia.md` (editado; aviso em `:138`)
- `docs/produto/modulos/fiscal.md` (editado; aviso em `:80`, ponteiro em `:385`)
- `docs/produto/fatos-de-operacao-retencao-e-descarte.md` (editado; aviso em `:89`)
- `docs/produto/pendencias-fase-1-e-2-2026-09-23.md` (editado; marcas em `:261`, `:282`, `:291`; citações corrigidas em `:55`, `:272-273`, `:279`)
- `docs/arquitetura/d-06-trilha-residencia-2026-09-23.md`, `docs/produto/catalogo-de-modulos.md`, `docs/produto/backlog-lacunas-g01-g09.md`, `docs/produto/roadmap-de-modulos.md`, `docs/backlog/F-018-...md`, a ficha: só leitura.
NÃO FEITO: —
DECISÕES:
- **B6 no topo da §2, não numa `RN`.** Nenhuma `RN-FIS-*` trata da composição do total ao consumidor. A mais próxima é `RN-FIS-014` (soma das partes), e ela não depende da lacuna. Por isso o aviso ficou no topo da seção do módulo, onde começam todas as regras de `FIS`.
- **Arquivos acima de 400 linhas.** `fiscal-emissao-contingencia.md` foi de 403 para 409 linhas e `modulos/fiscal.md` de 433 para 442. Os dois já passavam do teto antes desta passada. Justifico em vez de partir: o critério 5 de `F-018` exige o aviso na seção da `RN`, e partir arquivo de `EMI`/`FIS` é recorte por eixo, fora de uma passada de avisos. Recomendo item próprio para partir os dois.
RISCOS:
- **O `Enquanto isso` do B6 vence quando `D-05` fechar.** Hoje ele se apoia em "`FIS` não entra no modelo" (`roadmap-de-modulos.md:317-319`). Fechada `D-05`, `FIS` fica modelável, e `LACUNA-FIS-002` passa a travar a construção sem nenhum padrão escrito. Quem fechar `D-05` precisa revisar este aviso na mesma passada. Uma saída possível, só a título de hipótese, é a mesma do B1: vale o que o `owner` publicar, e sem publicação a composição falha fechado.
- **B4 com `EMI` ligado.** Num cliente de outro perfil, com dois terminais em contingência sem contato na mesma série, nada em `fiscal-emissao-contingencia.md` diz como os números não colidem. É o "Não funciona" do aviso, e fica descoberto até `LACUNA-OFF-002` ter resposta.
- **Referência que a minha inserção deixou velha, fora do meu território.** `docs/arquitetura/d-01-d-02-stack-opcoes.md:31` e `:51` citam `fiscal-emissao-contingencia.md:217` para `RN-EMI-027`, que agora está em `:223`.
PERGUNTAS:
- para orquestrador: os dois avisos da §9 de `d-06-trilha-residencia-2026-09-23.md` (texto pronto em `:278-282` e `:289-293`) não têm arquivo de destino nomeado. A capacidade é do aceite de `RN-PRV-011` (`fatos-de-operacao-provedor.md:33`), que está fora da lista e é escopo `provedor`. Há ainda um impedimento de mérito: o `Enquanto isso` dos dois descreve comportamento de uma **proposta** ainda não decidida (o próprio arquivo diz, em `:3-6`, que o thread decide depois do gate F.2). Aplicado hoje, ele falha o critério 5 de `F-018`, porque não cita `RN` nem padrão já vigente. Recomendo aplicar em `fatos-de-operacao-provedor.md` (`RN-PRV-011`) na mesma passada que registrar a decisão de `T-0019`. Aceita?
- para orquestrador: o aviso de `GRD` não tem arquivo nesta passada. O lugar natural é `catalogo-de-modulos.md` (entrada `GRD`, `:253-264`, de A.2b), com eco em `backlog-lacunas-g01-g09.md` §5 (`G-04`). Texto proposto:
  ```
  > **Indisponível — variação de um item por eixo (tamanho, sabor, cor).** Não funciona: vender o mesmo
  > item em combinações de eixo, como bebida em 300 ml e 500 ml, sem cadastrar cada combinação. Falta:
  > `GRD` no MVP. Responde: humano (escopo comercial; `GRD` fora do MVP 1 por decisão de 2026-09-23).
  > Enquanto isso: cada combinação é item de catálogo próprio, cadastrado individualmente
  > (`catalogo-de-modulos.md:264`, `GRD` desligado). Desde: 2026-09-23.
  ```
  Quem escreve: A.2b, junto com a decisão de `G-04`?
VERIFICAÇÃO: Localizei os três avisos por `grep "Indisponível —"` nas linhas 89, 138 e 80. Contei as linhas com grep: 130, 409, 442 e o inventário por volta de 389. Li as fontes citadas em cada `Enquanto isso`: `roadmap-de-modulos.md:159`, `:258-259`, `:317-319`, `modulos/fiscal.md:202-203` e `RN-NUC-049` d. Procurei citações por número de linha dos três arquivos em todo o repositório e achei uma só, a de `d-01-d-02-stack-opcoes.md`, em RISCOS. Não rodei nada além disso.
MEMÓRIA SUGERIDA:
- type=gotcha escopo=processo slug=gotcha-aviso-cujo-enquanto-isso-vence-com-outra-decisao — aviso de indisponibilidade cujo `Enquanto isso` se apoia numa decisão aberta (o B6 em `D-05`) perde a base quando essa decisão fecha; quem fecha a decisão revisa os avisos que a citam.
PRÓXIMO PASSO SUGERIDO: produto — leva 2 de A.3: B4 em `operacao-offline-e-sincronizacao.md` §8 e B5 em `modulos/perifericos-classes.md` (`RN-PER-018`) e `modulos/perifericos.md` §4, depois que as instâncias que editam esses arquivos terminarem.

## thread — 2026-09-23 (respostas às perguntas do A.3)

- **Avisos da §9 de D-06:** aceito. Entram em `fatos-de-operacao-provedor.md` (`RN-PRV-011`) na mesma
  passada que registrar a decisão de `T-0019`, e não antes, porque o `Enquanto isso` precisa citar
  regra vigente.
- **Aviso de `GRD`:** o texto proposto está aceito. Quem o escreve é o A.2b, em `catalogo-de-modulos.md`
  (entrada `GRD`), com eco em `backlog-lacunas-g01-g09.md` §5, junto com a decisão de `G-04`.
- **Quem fechar `D-05` revisa o B6** (`modulos/fiscal.md:80`) na mesma passada.
- **Parar de despachar:** o humano pediu em 2026-09-23 que nenhum agente novo seja despachado. A leva 2
  do A.3 (B4 em `operacao-offline-e-sincronizacao.md` §8, B5 em periféricos), o A.2b e o A.2c ficam
  registrados como próximo passo, sem despacho.

## produto — 2026-09-23 (A.2a, cluster operação)

## RELATÓRIO — produto — T-0014 (passo A.2a, cluster operação)
STATUS: PARCIAL. As decisões estão escritas, com RN, aceite e célula. Mas texto aprovado que as contradiz continua em sete arquivos fora da minha lista (PERGUNTAS 3), e o "não" de `LACUNA-NUC-043` espera a consulta a `seguranca`.

FEITO:
- **Fuso** (`LACUNA-GLO-001` = `NUC-001` = `OFF-006`) virou `RN-NUC-057`. O fuso é do **estabelecimento**: faz parte da configuração publicada dele (linha 38), tem vigência e é nomeado pela região, nunca por deslocamento fixo. O núcleo não tem fuso do cliente (tenant), e `platform` não carrega fuso que decida o dia de um fato. O eixo que cresce é estabelecimentos por cliente.
  - Caso de prova de `F-018`, aceite 6: a venda em Manaus às 23h30 de 2026-10-13 (`2026-10-14T03:30Z`) pertence a 2026-10-13, tanto no fechamento de B quanto na leitura que soma A e B.
- **Moeda** (`NUC-041`) virou `RN-NUC-058`. É do estabelecimento, na mesma configuração publicada. Nenhuma leitura soma moedas diferentes, e preço publicado numa moeda só se aplica em unidade dessa moeda.
- **Encerrar estabelecimento** (`NUC-042`) virou `RN-NUC-059`.
  - Quem faz: só o `owner`, com contato, e a recusa vale para D1, D2 e D3.
  - Precondição: a lista de bloqueio de `RN-NUC-031` vazia.
  - No mesmo ato: a habilitação de todos os terminais é revogada e a faixa não usada é encerrada.
  - É reversível por **reabrir**, que não ressuscita habilitação nem faixa. Pausa não é encerramento.
- **Mudar de cliente** (`NUC-043`) virou `RN-NUC-060`: não existe. Loja vendida é encerrada num cliente e criada no outro, e nada atravessa. A recusa está nas quatro partes.
- **Habilitar terminal a vender** (`RN-OFF-032` i) virou `RN-NUC-061`.
  - `manager` ou `owner` habilitam, com contato. Na habilitação se conferem: unidade não encerrada, `queue_owner` declarado, fuso e moeda publicados.
  - Renovar não é ato de papel: é efeito do contato autenticado.
  - Terminal declarado comprometido nunca é reabilitado. Mover terminal para outra unidade é descomissionar e habilitar de novo. Isso responde duas perguntas que `F-021` deixava para `produto`.
- **Turno** (`G-02`, `NUC-007`, `A-02`, `Q-C`) virou `RN-NUC-062`. É um agrupamento declarado e **opcional** de sessões, entre abrir e fechar turno, feito por `manager` ou `owner` e sustentado por autoridade `retida`.
  - Nenhum fato carrega o turno, e nada o tem como precondição.
  - A troca de responsável pela gaveta no mesmo dia é resolvida pela sessão de caixa.
  - Vale para as duas respostas das lojas, então não espera `Q-C`.
  - Estão escritos o desfecho da virada do dia, o de sessão aberta sem turno e o de dois turnos sobrepostos em D2.
- **Loja de uma pessoa só** (`A-04`, `Q-A`) virou `RN-NUC-066`: ninguém autoriza a si mesmo. `A:<papel>` só se satisfaz com outro sujeito; quem porta o papel autorizador pratica o ato pela célula do próprio papel. Está nas quatro partes e vale em qualquer opção de `D-03`.
- **Rateio** (`G-09`, só a parte interna) virou `RN-NUC-064`. O valor da venda inteira é repartido uma vez, na conclusão, pelo maior resto, com empate decidido pela ordem de lançamento, e a parcela fica congelada na linha. Dois casos numéricos resolvidos servem de insumo para `T-0018`.
- **Reservas da Opção B** (`G-01`) viraram `RN-NUC-065`: a âncora, cujo estado nunca é ausência; o congelamento no grão da linha; e o lugar do número documental, separado da referência humana e vazio enquanto não houver `EMI`.
- **Aviso** na forma fixa, em `nucleo-venda.md` §6 (`LACUNA-NUC-004`): o arredondamento de quantidade × preço e o de tributo ficam indisponíveis. O `Enquanto isso` cita `RN-NUC-002` infeliz e `RN-NUC-013` infeliz (a). Entra no inventário como classe (b).
- **Matriz do núcleo**:
  - novas linhas 40 (habilitar), 41 (encerrar e reabrir) e 42 (turno), todas com valor atribuído;
  - nota ¹⁷ nas células `A:` das linhas 7 e 9;
  - notas novas ¹⁸ e ¹⁹, e a ¹⁶ atualizada;
  - contagem passou a 42 linhas e 210 células, com `?` ainda em 5.
- **Itens editados**: `SPR-37` (corpo, aceite 5 reescrito, aceites 6 e 7 novos, `F-021` e `LACUNA-NUC-003` no Depende de), `SPR-36` (fuso saiu do registro de cliente), `SPR-34` (invariante 5) e `SPR-40` (cenário 3 de moeda, e o caso de rateio passa a ser o aceite de `RN-NUC-064`). Cada um traz o que mudou, por quê e contra qual prova.
- **Glossário**:
  - `tenant_time_zone` e `tenant_currency` aposentados, sem reaproveitar o identificador;
  - entram `establishment_currency`, `establishment_closure` e `allocation`;
  - linha de turno e `LACUNA-GLO-001` marcadas FECHADA.
- **Fronteira do núcleo**: `:57` (fuso e moeda do estabelecimento), `:115` (turno como núcleo de uso opcional, classificação assumida) e `:113`, `:123`, `:124` (achado `A-04`).

ARQUIVOS:
- `/home/mcastro/work/freelas/forja/docs/produto/nucleo-estabelecimento.md` (editado, 371 linhas)
- `/home/mcastro/work/freelas/forja/docs/produto/nucleo-caixa-e-turno.md` (editado, 265)
- `/home/mcastro/work/freelas/forja/docs/produto/nucleo-venda.md` (editado, 399)
- `/home/mcastro/work/freelas/forja/docs/produto/nucleo-venda-congelamento.md` (novo, 122; partição por eixo, ver DECISÕES)
- `/home/mcastro/work/freelas/forja/docs/produto/glossario.md` (editado, 394)
- `/home/mcastro/work/freelas/forja/docs/produto/fronteira-do-nucleo.md` (editado, 285)
- `/home/mcastro/work/freelas/forja/docs/produto/papeis-e-permissoes.md` (editado, 351)
- `/home/mcastro/work/freelas/forja/docs/produto/matriz-operacao-papel.md` (editado, 396)
- `/home/mcastro/work/freelas/forja/docs/backlog/SPR-37-modelar-venda-pagamento-caixa-turno-e-operador-no-schema-de.md` (editado)
- `/home/mcastro/work/freelas/forja/docs/backlog/SPR-36-modelar-o-schema-de-controle-clientes-modulos-ativos-e-livro.md` (editado)
- `/home/mcastro/work/freelas/forja/docs/backlog/SPR-34-fase-1-modelo-de-dados-e-fundacao-do-servidor.md` (editado)
- `/home/mcastro/work/freelas/forja/docs/backlog/SPR-40-fechar-tipo-unidade-e-escala-de-dinheiro-e-de-quantidade.md` (editado)

NÃO FEITO:
- A edição dos arquivos que ainda contradizem as decisões (PERGUNTAS 3): estão fora da lista de escrita deste despacho.
- O memorando para `memory/`: é do thread. Os slugs já estão citados na spec (MEMÓRIA SUGERIDA).
- `LACUNA-NUC-003` (grão e reinício da referência humana): trava `SPR-37`, mas não estava no brief e nenhum outro passo do plano a assume.

DECISÕES:
- **Partição por eixo.** `nucleo-venda.md` já tinha 395 linhas e iria a mais de 420. As duas regras novas de congelamento foram para um arquivo irmão, e o §6 foi enxugado; o arquivo ficou em 399. O glossário não precisou ser partido: ficou em 394.
- **Números.** `RN-NUC-057` a `062`, `064`, `065` e `066`. A instância `T-0016` tinha feito nascer `LACUNA-PER-6` como `RN-NUC-057` e depois a renumerou para `063`, e o meu `A-04` estava em `063`. Renumerei o meu para `066`: nada o cita fora dos meus arquivos, e eles foram corrigidos.
- **Encerrar é reversível.** Irreversível transformaria cada engano em unidade duplicada para a mesma pessoa jurídica. A contrapartida é que reabrir não devolve a habilitação dos terminais.
- **Turno classificado como núcleo mesmo reprovando o passo 1 do teste** (`fronteira-do-nucleo.md` §4). Os três negócios não quebram sem ele. O motivo e o risco estão escritos na regra.
- **Fuso cadastrado errado não reescreve o passado** (`RN-NUC-057`, infeliz (c)). A correção é publicação com vigência nova, e o fato antigo mantém o dia da versão que congelou.
- **`manager` habilita terminal.** Se só o `owner` habilitasse, terminais por unidade × unidades por cliente virariam fila de uma pessoa só. O `cashier` fica fora.

RISCOS:
- **Alto.** O aviso de `LACUNA-NUC-004` recusa lançar linha cujo valor dá fração de centavo. Na prática, **combustível por litro e item pesado não vendem** até o contador responder a regra de arredondamento. É o desfecho honesto pelas regras atuais, mas afeta o MVP de posto e de padaria.
- **Citações que passaram a apontar para a regra errada:** `docs/backlog/F-007-...md:147` e `docs/produto/pendencias-fase-1-e-2-2026-09-23.md:302` ainda dizem que `PER-6` é `RN-NUC-057`. Esse número agora é a minha regra de fuso. O mesmo vale para o texto do relatório na ficha `T-0016` (`:129-195`).
- `RN-NUC-061` manda descomissionar pela linha 30, que diz "terminal **com fila**". Descomissionar terminal sem fila não tem linha explícita.
- As linhas 40 a 42 são delegáveis por default (`RN-NUC-040` lista só cinco não delegáveis). Se encerrar estabelecimento deve ou não ser delegável é P2.
- `SPR-37` cresceu: agora tem as reservas, o rateio e o turno. Recomendo partir (P2).
- A contagem consolidada em `matriz-operacao-papel-modulos.md` §8 (195 células) ficou desatualizada; o certo agora é 210.
- O cabeçalho de `nucleo-venda.md` ainda diz "D-01 a D-04 estão ABERTAS", o que é falso desde 2026-09-11 (P1, fora do brief).

PERGUNTAS:
- **para seguranca**, sobre `A-04` e `RN-NUC-066`: proibir a autoautorização e resolver a loja de uma pessoa pela célula direta do papel mais alto abre porta fora da loja de uma pessoa só? Em particular: se `D-03` permitir que o mesmo humano tenha dois sujeitos (operadores) no mesmo cliente, a regra é contornada. É preciso exigir "uma pessoa, um sujeito por cliente"?
- **para seguranca**, sobre `RN-NUC-060`: o "não" a mudar de cliente, feito como encerrar num cliente e criar no outro, abre alguma travessia lateral que peça gate? `F-018` exige o gate antes de a regra valer.
- **para thread**, edições que decorrem da decisão, fora da minha lista:
  - `.claude/rules/dados.md` §3 ("o fuso do cliente é dado do cliente (platform)") e `.claude/rules/ui.md` §3 ("fuso e moeda do cliente") — são regra, então o thread edita com aval do humano;
  - `fatos-de-operacao.md:102-126` (`RN-NUC-042`, "do estabelecimento ou do cliente"), `nucleo-publicacao-e-texto.md:49` (cita `LACUNA-NUC-001`) e `matriz-operacao-papel-contrato.md:49` (a linha de `A:` deve citar `RN-NUC-066`) — produto, noutro despacho; a `:49` pode ir com A.2b, que já edita esse arquivo;
  - `operacao-offline-e-sincronizacao.md:147`, `:239`, `:351`, `:360` (`LACUNA-OFF-006` FECHADA) e a transcrição da linha de turno na tabela §4 — A.2c;
  - `backlog-lacunas-g01-g09.md` e os itens `F-021` (fuso e moeda saem do "Não registra"; o `F-019` condicional cai, porque a célula não é nossa; as respostas sobre mover terminal e reabilitar comprometido), `SPR-46`, `SPR-28` e `SPR-29` — produto, num próximo despacho de backlog;
  - `db/convencoes.md:21` e o comentário em `db/migrations/platform/0001__tenant_registry.sql:17-18` — `arquiteto-dados`, só quando a próxima migration nascer (a migration aplicada não se edita).
- **para orquestrador**: `LACUNA-NUC-003` trava `SPR-37` e não tem passo. Vai para A.2c ou para um passo próprio?

VERIFICAÇÃO:
- Contei as linhas de cada arquivo tocado por busca: todos com 400 ou menos.
- Busquei `^### RN-NUC-0(5[7-9]|6\d)`: cada número aparece uma vez.
- Busquei `RN-NUC-063` nos meus arquivos: zero ocorrências depois da renumeração.
- Conferi à mão a aritmética dos dois casos de rateio e o instante UTC do caso de Manaus.
- Não reli os arquivos inteiros depois das edições. Não há teste a rodar: o entregável é spec.

MEMÓRIA SUGERIDA:
- type=decision escopo=plataforma slug=decision-fuso-e-moeda-sao-do-estabelecimento — fuso e moeda são da configuração publicada do estabelecimento, sem fuso nem moeda do cliente no núcleo; o recusado custaria expand/contract em N schemas no primeiro cliente com unidades em fusos ou moedas diferentes. Atualizar junto `gotcha-fuso-do-estabelecimento-versus-fuso-do-cliente` e `gotcha-moeda-viajou-na-parentese-do-fuso` como resolvidos.
- type=decision escopo=plataforma slug=decision-estabelecimento-encerra-reabre-e-nunca-muda-de-cliente — encerrar e reabrir são fatos do `owner` com a precondição de `RN-NUC-031`; loja vendida é encerrar e criar.
- type=decision escopo=plataforma slug=decision-turno-e-agrupamento-opcional-de-sessoes-de-caixa — turno opcional, derivado, fora de fato e de precondição; troca de gaveta é da sessão; núcleo por classificação assumida.
- type=decision escopo=plataforma slug=decision-rateio-pelo-maior-resto-congelado-na-linha — repartir uma vez, na conclusão, nunca de novo na correção; o arredondamento de linha e de tributo continua com o contador.
- type=decision escopo=plataforma slug=decision-reservas-da-opcao-b-entram-no-modelo-da-fase-1 — âncora que nunca é ausência, grão por linha, lugar do número documental vazio sem `EMI`.
- type=decision escopo=plataforma slug=decision-ninguem-autoriza-a-si-mesmo — `A:` exige outro sujeito; a loja de uma pessoa usa a célula do próprio papel.
- type=business-rule escopo=plataforma slug=business-rule-habilitar-terminal-e-de-manager-renovar-e-do-contato — atualizar o registro de habilitação com prazo já existente.
- type=gotcha escopo=processo slug=gotcha-numero-de-rn-colide-entre-instancias-paralelas — duas instâncias de `produto` pegaram `RN-NUC-057` e depois `063` no mesmo dia; paralelismo por arquivo não protege a sequência numérica, que é global. Reservar a faixa de números no plano.

PRÓXIMO PASSO SUGERIDO: `seguranca`, consulta com as duas perguntas acima. Depois, `produto` num despacho curto para os arquivos da PERGUNTAS 3 (priorizar `F-021`, que é a próxima peça da base, e `fatos-de-operacao.md`). As mudanças de escopo de `SPR-34`, `36`, `37` e `40` devem ir num commit próprio, separado das correções de texto, para o git guardar a redação anterior.

## thread — 2026-09-23 (depois do A.2a)

**Numeração conferida em disco:** cada `RN-NUC-056`…`066` aparece uma vez. `LACUNA-PER-6` é
**`RN-NUC-063`** (`fatos-de-operacao-dominios-fechados.md:137`), e `RN-NUC-057` é a regra de fuso
(`nucleo-estabelecimento.md:140`). O relatório C.1 colado em `T-0016` fala em `057` porque foi escrito
antes da renumeração. Ele fica verbatim, e esta nota é a correção.

**Decisão do thread sobre o risco ALTO do A.2a (combustível e item pesado sem vender):** vale o
mecanismo que o A.1 já tinha separado (B1). O **modo** de arredondar a linha é artefato publicado pelo
`owner`, versionado e congelado no fato, e o produto enumera os modos sem escolher. Publicado o modo, a
linha compõe e vende. Sem publicação, a composição falha fechado (`RN-NUC-013`, infeliz (a)). O que
continua com o contador é **qual modo a norma exige** quando `FIS` ou `EMI` estiverem ligados, e isso é
o aviso. Motivo: recusar a venda de combustível e de granel até o contador responder paralisaria duas
das verticais-alvo por uma pergunta que só restringe o caso fiscal. O aviso de `LACUNA-NUC-004` em
`nucleo-venda.md` §6 precisa ser reescrito nessa forma, e isso é edição do `produto`, sem despacho.

**Respostas às perguntas do A.2a:**
- `LACUNA-NUC-003` (grão e reinício da referência humana) vai para a A.2c, porque trava `SPR-37`.
- As duas perguntas a `seguranca` (`RN-NUC-066` × dois sujeitos da mesma pessoa, e `RN-NUC-060`)
  entram no gate B.3 de `D-03`, que já trata da residência do sujeito. Sem despacho agora.
- As edições fora da lista do A.2a ficam na fila de próximos passos, sem despacho. `.claude/rules/dados.md`
  §3 e `.claude/rules/ui.md` §3 dependem de permissão de escrita em `.claude/**`, negada em 2026-09-23.

## produto — 2026-09-23 (A.2c, cluster Fase 2)

## RELATÓRIO — produto — T-0014 (passo A.2c, cluster Fase 2)
STATUS: PARCIAL. Todas as decisões têm RN com aceite, recusado e motivo, e B4 e as remissões estão aplicados. Faltam três coisas fora da minha lista de escrita. (1) Pelo caminho infeliz de `F-018`, `RN-OFF-028` e `RN-OFF-029` teriam de ser corrigidas na mesma passada, e moram em `offline-grandezas-e-orcamento.md`. (2) As linhas de lacuna em sete arquivos de outros donos precisam da marca FECHADA. (3) Três valores esperam consulta a `seguranca`.

FEITO:
- **Arquivo novo, partido por eixo:** `fila-local-valores-de-partida.md`. A grandeza continua em `offline-grandezas-e-orcamento.md` e o valor decidido fica aqui. Todo número vem rotulado como não medido e é o padrão de `RN-OFF-028` (infeliz), com piso e teto que a configuração do cliente não atravessa.
- **Regras e números decididos:**
  - `RN-OFF-034` (`OFF-011` = `NUC-008`, e `NUC-033`): a autoridade retida vale 8 h sem contato, configurável de 0 a 12 h, e o aviso sai quando resta 1/4.
  - `RN-OFF-035` (`OFF-017`): a habilitação vale 72 h sem contato, configurável de 24 h a 7 dias, com aviso quando resta 1/3. Mudar o relógio ou reiniciar não estende nem encerra o prazo.
  - `RN-OFF-036` (`OFF-016`, fechada sem medida e declarada assim): reconcilia a cada contato e em até 5 min depois de uma mudança (teto 15 min). Sem teto de quantidade.
  - `RN-OFF-037` (`OFF-004`): 1.000 vendas pendentes por terminal, configurável de 100 a 5.000, aviso em 80 %. A exceção de `RN-OFF-025` existe, nasce vazia, e o `owner` a publica com até metade do teto.
  - `RN-OFF-038` (`OFF-014`): o registro fica até o fechamento do dia da venda, nunca mais de 48 h, e não guarda identificação do comprador.
  - `RN-OFF-040` (`NUC-014`): o item escala quando resta metade do tempo até o prazo e ninguém o abriu. A fração é configurável entre 1/4 e 3/4.
  - `RN-NUC-080` (`NUC-034`): delegação dura no máximo 30 dias, e renovar é delegar de novo.
- **Espaçamento de retentativa, com o dono declarado:** `RN-OFF-039` em `fila-local-conteudo-e-repouso.md:143`. O dono é `produto`, e a decisão é que esse espaçamento não existe: operação recusada não entra na fila e ninguém a retenta além de quem opera. Com isso `operation_refused` cresce com os atos de pessoa, não com a duração da queda. Recusei comprimir a rajada num fato só, porque `RN-NUC-041` e `RN-NUC-043` (infeliz) proíbem reduzir o grão sem custo medido.
- **`G-08`:** `RN-NUC-081` em `fila-local-autoridade-e-identidade.md:359` (§6 nova). A busca por texto é leitura local do catálogo que o terminal aplica, integral em D1, D2 e D3, e é atributo da linha 2 da matriz. Não registra o texto buscado (`RN-NUC-044`).
- **`LACUNA-NUC-003`:** `RN-NUC-082` em `operacao-offline-e-sincronizacao.md:216`. A referência humana é única no estabelecimento por toda a vida dele, não reinicia, é esparsa e não carrega significado. Recusei a sequência densa diária. A necessidade real que ela atendia, um número curto para chamar quem espera, é "senha", recurso de módulo (`RN-OFF-006`).
- **Relógios e teto de diagnóstico, em `fatos-de-operacao-retencao-e-descarte.md`:**
  - `RN-NUC-083` (`NUC-039`, `:86`): o diagnóstico ocupa até 10 % do armazenamento local, configurável de 2 a 25 %, fora da margem de `RN-OFF-015`.
  - `RN-NUC-084` (`:158`): lista fechada de classe para relógio. No discricionário, o fato fino vive o mês em curso mais 12 meses. A janela de leitura fina tem teto de 12 meses fechados (a parte de janela de `REL-001`). Uma contagem mensal por estabelecimento, operação, módulo e motivo sobrevive ao descarte.
  - `RN-NUC-085` (`:197`): a prova não expira enquanto o cliente existir, nem antes do fato que ela prova. Leva um aviso para o período depois da saída do cliente (`LACUNA-PRV-006`).
- **B4:** aplicado em `operacao-offline-e-sincronizacao.md` §8, abaixo de `LACUNA-OFF-002`. O `Enquanto isso` cita `RN-NUC-065`, item 3.
- **Remissões do A.2a no offline:**
  - linha de `FIS` na §4: passou a citar `RN-FIS-008` e `RN-NUC-057`;
  - `RN-OFF-019` (infeliz): corrigida, citando a redação anterior;
  - `LACUNA-OFF-006`: marcada FECHADA;
  - perguntas da §8: marcadas como respondidas;
  - linha de turno transcrita de `RN-NUC-062` (degradado nos três domínios; 1 no fato, 4 na autoridade), e o parágrafo que a dava como ausente foi corrigido;
  - linha nova de busca na §4.
- **P1 locais:** corrigi `LACUNA-OFF-003`, que dizia `D-04` aberta, e `LACUNA-OFF-012` e `RN-OFF-021` (infeliz), que diziam `D-01` e `D-02` abertas. Pus ponteiros nas regras donas (`RN-OFF-011`, `014`, `022`, `024`, `025`, `032`, `033`, `046`, `049` e `C-09`) e atualizei os cabeçalhos "Nenhum número" dos cinco arquivos.

ARQUIVOS:
- `/home/mcastro/work/freelas/forja/docs/produto/fila-local-valores-de-partida.md` (novo, 241 linhas)
- `/home/mcastro/work/freelas/forja/docs/produto/operacao-offline-e-sincronizacao.md` (editado, 380)
- `/home/mcastro/work/freelas/forja/docs/produto/fila-local-autoridade-e-identidade.md` (editado, 385)
- `/home/mcastro/work/freelas/forja/docs/produto/fila-local-conteudo-e-repouso.md` (editado, cerca de 236)
- `/home/mcastro/work/freelas/forja/docs/produto/fatos-de-operacao-retencao-e-descarte.md` (editado, 220)
- A ficha, o inventário, `nucleo-venda.md`, `papeis-*.md`, `fatos-de-operacao.md`, `CST-07` e `F-018`: só leitura.

NÃO FEITO (fora do território deste despacho; o texto de cada edição está em PERGUNTAS):
- A alteração no lugar de `RN-OFF-028` e `RN-OFF-029`.
- As marcas FECHADA nas lacunas que moram em outros arquivos.
- A edição de `SPR-37` e `SPR-17`.
- O registro em `memory/`.
- A reescrita do aviso de `LACUNA-NUC-004`, decidida pelo thread depois do A.2a. Ela fica em `nucleo-venda.md`, que não é meu arquivo neste passo.

DECISÕES:
- **Arquivo novo em vez de pôr cada valor ao lado da regra dona.** Com 13 regras, `operacao-offline` e `fila-local-autoridade` passariam de 400 linhas. O eixo "grandeza lá, valor aqui" também deixa todos os números revisáveis num lugar só. A glob `fila-local-*` do brief cobre o arquivo.
- **Onde moram as `RN-NUC`.** `RN-NUC-080` ficou no arquivo de valores e `RN-NUC-081` em `fila-local-autoridade`, porque os arquivos donos naturais não eram da minha lista. Nos dois casos a regra aponta o dono, `RN-NUC-021` e a linha 2 da matriz.
- **Frações em vez de minutos fixos** nos avisos (1/4, 1/3), na escalada (1/2) e no diagnóstico (10 %). Assim as relações da §1 do arquivo novo não se invertem em nenhuma configuração.
- **A contagem mensal que sobrevive ao descarte** (`RN-NUC-084` d) é o que torna seguro reter o fino por só 13 meses. Ela não substitui o fato: nasce dele antes do descarte, e isso não colide com `RN-NUC-041`.
- **Registro de auditoria de célula `R` classificado como prova.** Consequência: ele nunca é descartado enquanto a venda a que se refere existir.

RISCOS:
- **Alto.** Enquanto `RN-OFF-028` e `RN-OFF-029` (aceite) não forem alteradas, há duas regras vigentes em conflito. O conflito está declarado no topo do arquivo novo.
- Nenhum número foi medido. O 1.000 de `RN-OFF-037` leva o rótulo de estimativa.
- `RN-OFF-035` (infeliz): se "o último instante que ele consegue provar" for implementado de forma pessimista, uma queda de energia com o link caído pode parar o caixa. Vai para o gate de `seguranca` e de `backend`.
- `RN-NUC-084` (d) cria uma contagem permanente que `arquiteto-dados` precisa modelar.
- `operacao-offline` (380) e `fila-local-autoridade` (385) estão perto do teto de 400.
- As marcas FECHADA citam `[[decision-valores-de-partida-da-continuidade-offline]]`, que ainda não existe em `memory/`.

PERGUNTAS:
- **para seguranca**, uma consulta com três valores: habilitação de 72 h com teto de 7 dias (`RN-OFF-035`), autoridade retida de 8 h com teto de 12 h (`RN-OFF-034`) e registro retido de 48 h (`RN-OFF-038`). Algum deles abre exposição que peça teto menor?
- **para performance:** o gate de `RN-NUC-081` (busca dentro do caminho de lançar item).
- **para thread, edições fora da minha lista:**
  - `offline-grandezas-e-orcamento.md`:
    - `RN-OFF-028` (aceite), trocar "e nenhuma spec deste produto contém o número (...)" por: "e o valor de partida de cada um mora em `fila-local-valores-de-partida.md`, rotulado como não medido; nenhuma outra spec o repete";
    - `RN-OFF-029` (aceite), trocar "nenhuma grandeza da §2 aparece com número em spec de produto" por: "... fora de `fila-local-valores-de-partida.md`";
    - atualizar o cabeçalho "Nenhum valor" e a lista de lacunas herdadas da §3.
  - Marcar FECHADA:
    - `nucleo-venda.md` §6: `NUC-003` → `RN-NUC-082` e `NUC-008` → `RN-OFF-034`;
    - `papeis-e-permissoes.md` §6: `NUC-014` → `RN-OFF-040` e `NUC-034` → `RN-NUC-080`;
    - `superficie-por-papel.md`, em `:224` e `:364`: `NUC-033` → `RN-OFF-034`;
    - `fatos-de-operacao.md` §7: `NUC-039` → `RN-NUC-083` e `NUC-040` (discricionário e prova) → `RN-NUC-084`/`085`;
    - `modulos/relatorios-semente-de-perguntas.md:213`: `REL-001`, parte de janela, → `RN-NUC-084` (c);
    - `backlog-lacunas-g01-g09.md` §10: `G-08` → `RN-NUC-081`;
    - `papeis-atribuicao-e-delegacao.md`: ponteiro em `RN-NUC-021` (c).
  - Inventário `pendencias-fase-1-e-2`: B4 aplicado, A7, A14 e A15 fechadas.
  - Itens: `SPR-37` (`LACUNA-NUC-003` deixa de estar aberta), `SPR-17` (busca decidida) e `F-018` (tabela). Vão num commit próprio.
  - `glossario.md`: nomes em inglês dos marcos novos (aviso de vencimento, vencimento da habilitação, escalada da fila, descarte por retenção, contagem mensal).
- **para humano:** "o que o cliente-final pede e o catálogo não tem" deve virar decisão nomeada? Sem ela, a busca sem resultado não é registrada (`RN-NUC-081`).

VERIFICAÇÃO:
- Busquei `^### RN-(OFF-03[4-9]|OFF-04x|NUC-08x)` em `docs/produto`: cada número aparece uma vez, e só nos meus arquivos.
- Contei as linhas por grep: todos os cinco arquivos ficam com 400 ou menos.
- Busquei `LACUNA-OFF-006` e "ABERTA" nos meus arquivos: só restam as ocorrências já corrigidas.
- Conferi à mão a aritmética dos aceites de datas: sexta 20h +48 h e +72 h, 2026-10-01 +30 dias = 2026-10-31, e a janela de 13 meses em 2027-12-15.
- Não reli os arquivos inteiros depois das edições. Não há teste: o entregável é spec.

MEMÓRIA SUGERIDA:
- type=decision escopo=plataforma slug=decision-valores-de-partida-da-continuidade-offline — os padrões não medidos de autoridade (8 h), habilitação (72 h), reconciliação (5 min), teto (1.000), registro retido (até o dia, 48 h), escalada (1/2) e delegação (30 dias), com piso e teto; o eixo de cada um está no arquivo.
- type=decision escopo=plataforma slug=decision-retencao-discricionaria-13-meses-com-contagem-mensal — discricionário: mês em curso mais 12, janela de 12 meses fechados, contagem mensal permanente; prova: não expira enquanto o cliente existir, nem antes do fato que prova. Atualizar junto `convention-retencao-tem-tres-relogios`.
- type=decision escopo=plataforma slug=decision-referencia-humana-nao-reinicia — única no estabelecimento por toda a vida dele, esparsa e sem significado; número curto de chamada é "senha", de módulo.
- type=decision escopo=plataforma slug=decision-recusa-nao-se-retenta-automaticamente — `CST-07` fechado pela ausência de retentativa automática, não por compressão.
- Atualizar `business-rule-habilitacao-a-vender-do-terminal-tem-prazo` e `gotcha-revogacao-de-terminal-nao-alcanca-offline`: a janela passou a ser 72 h no padrão e nunca mais de 7 dias.

PRÓXIMO PASSO SUGERIDO: thread, com `seguranca` (consulta dos três valores). Depois, `produto` num despacho curto para as edições da PERGUNTA ao thread, começando por `RN-OFF-028`/`029`, que tiram o conflito entre regras vigentes, e por `SPR-37`.

## thread — 2026-09-23 (depois do A.2c)

- **Busca sem resultado:** decidido pelo thread, por delegação. Passa a ser fato, **sem o texto buscado**:
  estabelecimento, instante, origem e contagem. O fato não tem backfill, e o texto fica fora até o
  `seguranca` dizer se ele pode entrar e em que forma, como foi feito com o código lido (`RN-NUC-063`).
- **Os três valores** (`RN-OFF-034`, `035` e `038`) vão a consulta de `seguranca`. O conflito
  `RN-OFF-028`/`029` e as marcas FECHADA nos arquivos livres foram despachados ao `produto`. As marcas nos
  arquivos que outras instâncias editam agora ficam na fila.

## seguranca — 2026-09-23 (consulta sobre os três valores)

## RELATÓRIO: seguranca, T-0014 (consulta de produto)
STATUS: OK

Resposta curta: nenhum dos três valores precisa de teto menor, e nenhum abre caminho entre clientes. O terminal tem uma única habilitação (`RN-NUC-061`), e tudo o que ele guarda é de uma unidade só. Há um achado, e ele não está no número. Está no relógio que conta as 72 h.

- **`RN-OFF-038` (48 h):** não pede teto menor. O ladrão copia o registro operacional no instante do furto, então adiar o descarte não lhe dá dado novo. As vendas que ele fizer depois são dele. O conteúdo não tem comprador nem cartão.
- **`RN-OFF-034` (8 h, teto 12 h):** não pede teto menor. Habilitar outro terminal exige contato (`RN-NUC-061`), então a autoridade retida offline não chega a `IDN-07`. `IDN-07` acontece com contato, e sua correção não depende de nenhum desses valores (segundo fator no terminal e revogação em cascata). Depois da cascata, um T9 mantido offline vende até o prazo de `RN-OFF-035`, como qualquer terminal furtado.
- **`RN-OFF-035` (72 h, teto 7 dias):** diminuir o teto adianta pouco. Quem tem controle do dispositivo (root, edição do armazenamento do acompanhante) anula qualquer limite local, seja qual for o número. Contra esse atacante, o controle real é a revogação no primeiro contato, mais o lado fiscal. O teto contém o ladrão comum, e para esse 72 h é defensável.
- **O dilema da leitura pessimista:** tratar reinício como prazo vencido para o caixa depois de uma queda de energia com o link caído, e isso fere `PN-01`. A leitura segura contra quem mexe no relógio é contar tempo ligado sem contato, acumulado e persistido, e não tempo de calendário. Assim a queda de energia não para o caixa, e atrasar o relógio não estende o prazo (aceite 2). Essa leitura torna falsa a promessa de calendário do Motivo, que é o achado abaixo.
- **Requisito para `F-017` e o acompanhante (nota, não achado):** o contador acumulado avança e é persistido antes de cada ato ordinário. Sem isso, reinícios seguidos, cada um antes da gravação, zeram o avanço.

### SEG-T14-01: "no máximo três dias" é promessa de calendário que o terminal offline não consegue cumprir. [BAIXO]
ONDE: `docs/produto/fila-local-valores-de-partida.md:78`, `:81` e `:91`; janela declarada ao cliente em `RN-EMI-038` c.
CENÁRIO: terminal furtado, mantido offline, ligado 4 h por dia. Sem hora confiável no terminal, só existem duas formas de contar. A primeira é por tempo ligado: resiste a atrasar o relógio e dá cerca de 18 dias de calendário vendendo em nome do emitente. A segunda é por relógio de parede: aí atrasar o relógio estende o prazo, e o aceite (2) falha. A promessa ao cliente de "três dias" e "nunca mais de uma semana" não vale em nenhuma das duas.
POR QUE É REAL: o aceite (2) proíbe a contagem por relógio de parede, e nada na spec supõe uma fonte de tempo confiável offline.
CORREÇÃO SUGERIDA: definir o prazo como tempo ligado sem contato, acumulado e persistido, e declarar ao cliente que o calendário não tem limite contra quem mantém o dispositivo offline. Dono: `produto` (`RN-OFF-035` e `RN-EMI-038` c).

ARQUIVOS: `docs/produto/fila-local-valores-de-partida.md`, `docs/produto/nucleo-estabelecimento.md` e `docs/auditorias/2026-09-23-d-03-decisao.md` (só leitura)
VERIFICAÇÃO: li as §1 a §3, `RN-NUC-061` (`nucleo-estabelecimento.md:285-305`), `IDN-07` (`:341-356`) e sua exceção (`:164`). Não medi nada, conforme o brief. Não li `RN-EMI-038`, nem as regras de contingência fiscal que limitam o dano do lado da SEFAZ.
PRÓXIMO PASSO SUGERIDO: `produto` redefine a unidade de contagem de `RN-OFF-035` e `RN-OFF-034`, que usa a mesma cláusula, e corrige a declaração de `RN-EMI-038` c.

## produto — 2026-09-23 (passada de manutenção: F-030, fusões, remissões, provedor)

## RELATÓRIO — produto — passada de manutenção 2026-09-23 (T-0014, T-0016, T-0017, T-0019; T-0015 e T-0018 como fonte)
STATUS: OK

Os seis itens do brief estão em disco. A regra que resolve o cliente-alvo para a pessoa nossa está proposta em PERGUNTAS e não foi aplicada, como pedido. Usei `F-030`, `RN-NUC-090` e `RN-NUC-091`; `F-031`…`F-035`, `RN-NUC-092`…`094` e `RN-PRV-022`…`029` ficaram livres.

FEITO:
- **1. `F-030` criado**, dono `backend`, na anatomia de comportamento fechado. Tem 7 aceites com números fixos:
  - forma canônica byte a byte;
  - envelope;
  - polpa, combustível e roupa com dois modos de arredondamento;
  - "por linha × no total" (53,79 contra 53,78) deixado visível, sem decidir;
  - repartição por `RN-NUC-064`;
  - nenhum `number` como valor;
  - nenhuma API de Node.
  Nada bloqueia o item. Os pendentes estão escritos e não travam: a lista de modos, `BigInt` no motor do terminal e a dependência de desenvolvimento.
- **2. Fusões.**
  - Justificativa nas quatro partes escrita **antes**, em `docs/produto/backlog-recortes.md` (arquivo novo, porque não existia).
  - `F-022` e `F-028` viraram ponteiro, com o texto original preservado.
  - `F-012` absorveu `F-022`: aceites 7 a 12, escopo, as duas listas e o que `packages/sdui` faz hoje (`screen.ts:56`, `:87`: devolve `discards`, não registra). O título mudou.
  - `F-007` absorveu `F-028` numa seção datada própria, com aceites 6 e 7. O 7 virou caso concreto (`7891000315508`), e a mudança está registrada.
- **Reabrir `T-0016`: sim, é necessário.** O estado do item é o da ficha, e segunda ficha para o mesmo item é proibida (`backlog.md` §4 e §5). Está dito em `F-007` (seção da absorção) e na linha do índice.
- **3. `F-003`**: de seis para oito perguntas, com nota datada no topo (o quê, por quê, contra o quê).
  - Objetivo em três grupos; universo `t_*` mais `platform`.
  - Aceites 8 (`assumedReach`, `SUB-05`/`06`) e 9 (`delegation`, `SUB-09`).
  - O texto aceito, literal, no `Não registra`.
  - `performance` passou a se aplicar pelo custo de subida: 330 ms medidos pelo autor; passar de 1 s é ESTIMATIVA dele.
- **4. Remissões.**
  - `README.md`: índices com `057`…`066`, `090` e `091`, e o arquivo `nucleo-venda-congelamento.md`; 42 linhas no núcleo, 15 na folha do provedor.
  - `captura-varredura` §2.12 marcado RESOLVIDO → `063`.
  - `pendencias:302` corrigido.
  - `F-018:166` (a linha citada no brief deslocou) com `:314`/`:336`.
  - `RN-NUC-042` passou a dizer "do estabelecimento" (`RN-NUC-057`), com a redação anterior citada, e o arquivo ficou nas mesmas 396 linhas.
  - `matriz-operacao-papel-modulos.md` §8: 42/210 no núcleo, 79/395 no total, 43 `?`.
  - `F-021`:
    - fuso e moeda saíram do `Não registra` e foram para "configuração publicada";
    - encerrar e reabrir entraram, com o aceite 8;
    - "mover" e "reabilitar comprometido" foram respondidos por `RN-NUC-061`, com o aceite 9;
    - o `F-019` condicional caiu, e ficou a condição de forma do autor (d-06 §8);
    - entraram os três domínios de valor, pela decisão;
    - a conferência das precondições de habilitar ficou declarada fora, com dono.
  - `SPR-46`: fuso por `RN-NUC-057`, moeda como parâmetro, e a "formatação com resto" saiu porque contradiz a decisão.
  - `SPR-28`: 5 aceites concretos.
  - `SPR-29`: aceites 8 (rateio) e 9 (ordem de arredondar).
  - Cada item alterado tem a seção "Alterações".
- **5. Aviso B5** aplicado no topo de `RN-PER-018` e na linha de `LACUNA-PER-2` em `perifericos.md` §4. Marcado como aplicado no inventário.
- **6. Provedor.**
  - `RN-PRV-011` ganhou os dois avisos da §9 no topo (o `Enquanto isso` cita a cláusula j e `RN-PRV-015`) e três cláusulas:
    - (h): a residência decidida;
    - (i): a leitura automática gera um fato por cliente e por classe a cada rodada;
    - (j): pseudônimo por cliente.
  - As cláusulas vêm com motivo, aceites (iv)–(vi) e o caso infeliz, e a linha `provider_read` da §2 foi atualizada.
  - Linha `A7` "atribuir o primeiro `owner`, dentro do ato que provisiona (A1)" em `matriz-celulas-a-valorar.md`; contagens 15/45.
  - `RN-NUC-090` (primeiro `owner`, com o aviso de recuperação) em `papeis-atribuicao-e-delegacao.md` §5.
  - `RN-NUC-091` (segundo fator por classe de ato) em `papeis-e-permissoes.md` §5.1.

ARQUIVOS:
- `/home/mcastro/work/freelas/forja/docs/produto/backlog-recortes.md` (novo)
- `/home/mcastro/work/freelas/forja/docs/backlog/F-030-modulo-de-ponto-fixo-de-dinheiro-e-quantidade.md` (novo)
- Editados, em `docs/backlog/`: `F-003`, `F-007`, `F-012`, `F-018`, `F-021`, `F-022`, `F-028`, `SPR-28`, `SPR-29`, `SPR-46` e `INDEX.md` (só as linhas de F-007, F-012, F-022, F-028 e a nova de F-030)
- Editados, em `docs/produto/`: `README.md`, `captura-varredura-invariante-10-2026-09-11.md`, `pendencias-fase-1-e-2-2026-09-23.md`, `fatos-de-operacao.md`, `fatos-de-operacao-provedor.md`, `matriz-operacao-papel-modulos.md`, `matriz-celulas-a-valorar.md`, `papeis-e-permissoes.md`, `papeis-atribuicao-e-delegacao.md`, `modulos/perifericos.md`, `modulos/perifericos-classes.md`

NÃO FEITO: —

DECISÕES:
- **`RN-NUC-090` foi para o arquivo de atribuição** e `RN-NUC-091` para `papeis-e-permissoes`. Nenhum dos dois comportava as duas regras abaixo de 400 linhas.
- **`RN-NUC-091` vai além do B.1 em dois pontos**, pelo mesmo critério do alcance da credencial roubada:
  - `owner` também na linha 41 (encerrar e reabrir);
  - `manager`/`owner` na linha 40, porque habilitar acontece por construção num dispositivo ainda não habilitado.
- **A leitura automática (cláusula i) não nomeia pessoa**: declara a origem automática e o papel que declarou a leitura, e nunca "quem estava de plantão".
- **`A7` é linha própria, e não edição de `A1`**, para não quebrar `F-010:43`, que cita `A1`.
- **Fuso e moeda em `F-021` vão para a configuração publicada, e não para coluna**, contra a frase do próprio item ("eles entram aqui"). Prova: `RN-NUC-057`/`058`.
- **`F-030` adota para `unit_price` o teto de tamanho de `money_amount`** (a ilustração da proposta, §11), porque a decisão não o fixa. Está declarado no item.

RISCOS:
- **Arquivos no teto:**
  - `papeis-atribuicao-e-delegacao.md` 400;
  - `fatos-de-operacao-provedor.md` 399;
  - `fatos-de-operacao.md` 396;
  - `fatos-de-operacao-dominios-fechados.md` 400.
  O escopo absorvido em `F-007` exige partir o último antes de começar (está escrito no item).
- **`captura-varredura-invariante-10-2026-09-11.md` tem 439 linhas.** Já tinha 436 antes, é material sem peso normativo, e acrescentei 3 linhas de marca RESOLVIDO.
- **Contagem velha fora da minha lista:** `operacao-do-provedor-autorizacao.md:124` ("14 linhas, 6 de ato") e `F-010:43` ("14 linhas") agora são 15 linhas e 7 de ato.
- **`nucleo-venda.md` §6 (`LACUNA-NUC-004`)** ainda diz que arredondar a linha está indisponível, contra a decisão do thread em `T-0014`. `SPR-28` e `SPR-29` já citam a decisão. É arquivo proibido nesta passada.
- **`LACUNA-IDE-002` e `IDE-005`** aparecem abertas em `d-03-identidade-opcoes.md` e em `F-017`. Nenhum dos dois é meu nesta passada.
- **`docs/arquitetura/d-06-trilha-residencia-2026-09-23.md` mudou durante a passada** (revisão de papel e ordem). Cito por seção, não por linha.
- **`RN-NUC-090` nasce inerte:** `A7` sem célula, `LACUNA-NUC-031` e a quarta fonte de `RN-NUC-029`.
- **`RN-NUC-091`** depende do gate B.3 no `manager`.
- **Glossário sem termos novos:** pseudônimo por cliente, primeiro `owner`, segundo fator (arquivo proibido nesta passada).

PERGUNTAS:
- **para thread (gate de `D-03`), a entrada do ato que resolve o cliente-alvo** (`RN-PRV-004` d). Proposta, **não aplicada**:
  - **Regra.** A entrada é sempre um **objeto de origem já vinculado a um cliente por autoridade que não é a da pessoa nossa**, e nunca o cliente em si. Três origens, lista fechada:
    1. pedido aberto de dentro do ambiente do cliente por sujeito dele autenticado: chamado, pedido de mudança, e a concessão de `RN-NUC-024` quando `LACUNA-NUC-009` der a célula. O tenant veio da identidade do cliente (`backend.md` §1);
    2. fato nosso já gravado que nomeia o cliente pelo registro do `platform` (`RN-PRV-013`: migration que falhou no schema X, provisionamento incompleto);
    3. o ato que cria o cliente (`RN-NUC-090`).
  - **Mecânica.** A pessoa nossa entrega a referência opaca do objeto. O ato de resolução devolve a alça daquele cliente, que o B.2 já descreve, e o fato de resolução fica registrado (`RN-PRV-004` c). A pessoa vê a fila dos objetos atribuídos a ela, nunca a carteira.
  - **Recusado:** lista ou busca de clientes, identificador digitado, "último cliente" implícito. É o `gotcha-nenhuma-superficie-nossa-enumera-clientes-para-escolher`.
  - **Aceite:** a referência do pedido de A resolve A. Reusar a referência, usar referência inventada ou de outro cliente dá recusa sem revelar se existe.
  - **Infeliz:** o cliente só telefona. Ele abre o pedido na própria superfície e lê a referência; sem pedido dele, não há alvo e o suporte não age.
  - **Risco para o gate:** a fila é enumeração parcial da carteira, limitada ao que foi atribuído à pessoa.
  - **Prova:** `operacao-do-provedor.md:205-214`, `:249-258`; `RN-NUC-024`; a alça de escopo no B.2 (`T-0015`).
- **para thread:** reabrir `T-0016` para o escopo de `F-028`, ou reverter a absorção e dar ficha própria a `F-028`?

VERIFICAÇÃO:
- Li os trechos citados em disco antes de citar.
- Contei linhas por busca em todos os arquivos com risco de teto.
- Conferi as linhas movidas de `perifericos.md` (314/336), `screen.ts:56`/`:87` e os títulos de `SUB-05`/`06`/`09`.
- Reli o topo de `F-012` depois da edição.
- Não reli todos os arquivos inteiros. Não há código a rodar: o entregável é spec.

MEMÓRIA SUGERIDA:
- type=decision escopo=plataforma slug=decision-primeiro-owner-no-ato-de-provisionar — primeiro `owner` atribuído no ato de provisionar, só com zero `owner`; recuperação indisponível até advogado (`RN-NUC-090`).
- type=decision escopo=plataforma slug=decision-segundo-fator-por-classe-de-ato — piso por classe de ato, só com contato, e o cliente só aumenta (`RN-NUC-091`); pendente B.3 no `manager`.
- type=gotcha escopo=processo slug=gotcha-fusao-em-item-fechado-reabre-a-ficha — absorver escopo em item fechado obriga reabrir a ficha dele (par um para um); a alternativa é ficha própria para o absorvido.

PRÓXIMO PASSO SUGERIDO: thread. Primeiro, reabrir `T-0016` (ou reverter a absorção de `F-028`). Depois, levar a proposta de resolução de alvo ao B.3 de `D-03`. Por fim, despachar a `produto` a reescrita do aviso de `LACUNA-NUC-004` em `nucleo-venda.md` §6 e as contagens de `operacao-do-provedor-autorizacao.md:124` e `F-010:43`. Mudança de escopo (fusões, `F-021`, `SPR-28/29/46`, `F-003`) em commit próprio, separado das remissões.

## produto — 2026-09-23 (A.2c, passada curta: RN-OFF-028/029 e RN-NUC-100)

## RELATÓRIO — produto — T-0014 (A.2c, passada curta)
STATUS: OK

FEITO:
- Tirei o conflito entre `RN-OFF-028`/`029` e `fila-local-valores-de-partida.md`. O aceite de `RN-OFF-028` usa o texto que você pediu e diz quais ainda estão sem valor: `LACUNA-OFF-005` e `LACUNA-EMI-014`. No aceite de `RN-OFF-029` entrou "fora de `fila-local-valores-de-partida.md`" **e de `RN-NUC-083`** (ver DECISÕES). Pela régua de edição, o cabeçalho "Nenhum valor" foi reescrito e ganhou uma nota "Alterado em 2026-09-23" dizendo o que mudou, por quê e contra o quê.
- Separei as lacunas herdadas da §3 em abertas (`OFF-005`, `EMI-014`) e FECHADAS: `OFF-004` → `RN-OFF-037`, `OFF-011` → `RN-OFF-034`, `OFF-014` → `RN-OFF-038`, `NUC-039` → `RN-NUC-083`. Troquei os ponteiros velhos para a regra que fecha cada uma na tabela da §2 (linha do teto e linha do espaço de diagnóstico) e no infeliz de `RN-OFF-030`.
- Marquei `LACUNA-NUC-033` como FECHADA → `RN-OFF-034` em `superficie-por-papel.md:224` e `:365`, e também na tabela da §5 (`:332`), que citava a mesma lacuna.
- Marquei `LACUNA-REL-001` em `relatorios-semente-de-perguntas.md:213` como fechada **só em parte** (ver DECISÕES).
- Escrevi `RN-NUC-100` (e não `095`, conforme a correção) em `fila-local-autoridade-e-identidade.md` §6, logo depois de `RN-NUC-081`. O `Não registra` de `RN-NUC-081` foi editado pela régua: a busca sem resultado saiu da lista, com o motivo e a data. O cabeçalho do arquivo passa a citar `RN-NUC-100`.

ARQUIVOS:
- /home/mcastro/work/freelas/forja/docs/produto/offline-grandezas-e-orcamento.md (editado, 177 linhas)
- /home/mcastro/work/freelas/forja/docs/produto/superficie-por-papel.md (editado, 366)
- /home/mcastro/work/freelas/forja/docs/produto/modulos/relatorios-semente-de-perguntas.md (editado, 239)
- /home/mcastro/work/freelas/forja/docs/produto/fila-local-autoridade-e-identidade.md (editado, 400, exatamente no teto)
- fila-local-valores-de-partida.md, fatos-de-operacao-retencao-e-descarte.md, memory/processo/convention-decisao-delegada-com-aviso-no-modulo.md (só leitura)

NÃO FEITO: —

DECISÕES:
- **`RN-OFF-029` com duas moradas, não uma.** `RN-NUC-083` (`fatos-de-operacao-retencao-e-descarte.md:86`, 10 % do armazenamento local) é o valor da grandeza "espaço de fato de diagnóstico retido" da §2. Com o texto literal do brief, o aceite novo nasceria violado. A exceção ficou nomeada no aceite e no cabeçalho.
- **`LACUNA-REL-001` não fecha por inteiro.** `RN-NUC-084` (c) (`fatos-de-operacao-retencao-e-descarte.md:173-175`) fixa a janela só para **classe discricionária**. Os seis relatórios da semente (`RN-REL-009` a `014`) leem fato de obrigação ou de prova: venda, desconto e a autorização dele, sessão de caixa, desfecho fiscal. Marquei "parte de janela FECHADA para classe discricionária" e escrevi que, para a semente, a janela continua aberta. Marcar FECHADA sem essa ressalva afirmaria um teto que nenhuma regra fixa.
- **`RN-NUC-100` traz dois campos além dos quatro do brief.** São a versão de catálogo aplicada e se a busca terminou em lançamento. Sem a versão, "o catálogo não tem" não se distingue de "este terminal não recebeu" (`RN-NUC-081`, aceite). Sem o desfecho, "achou depois de reformular" não se distingue de "desistiu". Se quiser só os quatro, dá para cortar.
- **Grão escolhido: um fato por busca, nunca por tecla.** A busca termina quando lança, é limpa ou o operador sai. "Contagem" é o número de textos sem resultado dentro da busca. Onde um texto termina e o seguinte começa ficou com `ui`. Busca que acha de primeira não produz fato.
- **"Nem quem buscou" entrou no `Não registra` de `RN-NUC-100`.** A decisão informada é de catálogo, e recorte por pessoa é `LACUNA-REL-002`.
- **A revogação da cláusula de `RN-NUC-081` está atribuída a "decisão delegada (`T-0014`, A.2c)"**, conforme [[convention-decisao-delegada-com-aviso-no-modulo]]. Revogar cláusula que impede captura é ato do humano (`produto.md`).
- **Para caber no teto de 400 linhas**, encurtei de 3 para 2 linhas o parágrafo "Perguntas para o humano" da §5 de `fila-local-autoridade-e-identidade.md`. O conteúdo se mantém, e "que é de `D-03`" continua dito na própria `LACUNA-OFF-015`, poucas linhas acima.

RISCOS:
- `fila-local-autoridade-e-identidade.md` está em 400 linhas. A próxima regra ali exige partir o arquivo.
- `fila-local-valores-de-partida.md:20-23` ainda diz que o conflito está "declarado, até a alteração chegar". Agora está desatualizado.
- O fato novo não tem classe de retenção. Por `RN-NUC-084` (a), classe sem relógio fica na **obrigação** e não se descarta nunca.

PERGUNTAS:
- para thread: incluir o fato da busca sem resultado na lista **discricionária** de `RN-NUC-084` (a) e no nível que cede primeiro de `RN-NUC-046`? Arquivo: `fatos-de-operacao-retencao-e-descarte.md`. Sem isso ele cai na obrigação por default.
- para thread: pode abrir uma passada para atualizar `fila-local-valores-de-partida.md:20-23` (o conflito foi resolvido no arquivo dono) e para citar `RN-NUC-100` na linha da busca em `operacao-offline-e-sincronizacao.md:128`?
- para thread: o nome do fato em inglês é do `glossario.md` (fora do meu território nesta passada). Cunho numa passada própria?
- para seguranca (via thread): o texto buscado pode entrar em algum fato, inteiro, truncado ou normalizado? `RN-NUC-100` o exclui até a resposta.
- para humano: vale incluir na semente de `REL` um relatório do tipo "o que procuram e o catálogo não tem", com a janela que `RN-NUC-084` (c) já fixa para classe discricionária?

VERIFICAÇÃO: contei as linhas dos quatro arquivos com grep (400, 366, 177, 239). Confirmei com grep que `RN-NUC-100` não era usado antes. Não é código: não há teste para rodar.

MEMÓRIA SUGERIDA:
- type=business-rule escopo=plataforma slug=rule-busca-sem-resultado-e-fato-sem-texto — a busca por texto no catálogo que não acha nada vira um fato por busca, com versão aplicada e desfecho, sem o texto e sem quem buscou (`RN-NUC-100`).
- type=gotcha escopo=plataforma slug=gotcha-rn-nuc-084c-nao-alcanca-relatorio-de-obrigacao — a janela de 12 meses de `RN-NUC-084` (c) vale só para classe discricionária, e os relatórios da semente leem obrigação ou prova, então `LACUNA-REL-001` segue aberta para eles.

PRÓXIMO PASSO SUGERIDO: produto — passada curta em `fatos-de-operacao-retencao-e-descarte.md` (classe do fato novo), `fila-local-valores-de-partida.md:20-23` e `operacao-offline-e-sincronizacao.md:128`, depois de o thread responder as duas primeiras PERGUNTAS.

## thread — 2026-09-23 (respostas à passada curta)

- O fato da busca sem resultado (`RN-NUC-100`) é **discricionário** em `RN-NUC-084` (a) e está no nível que
  cede primeiro em `RN-NUC-046`.
- Aceitos os dois campos a mais (a versão aplicada e o desfecho) e o grão de um fato por busca.
- A semente de `REL` ganha "o que procuram e o catálogo não tem", com a janela discricionária.
- Passada seguinte, na fila: `fatos-de-operacao-retencao-e-descarte.md` (classe),
  `fila-local-valores-de-partida.md:20-23`, `operacao-offline-e-sincronizacao.md:128` e o nome do fato
  no glossário. A consulta a `seguranca` sobre o texto buscado também vai na fila.

## produto — 2026-09-23 (A.2b, cluster catálogo)

## RELATÓRIO — produto — T-0014 (passo A.2b, cluster catálogo)
STATUS: OK. As seis decisões estão escritas como RN, cada uma com o que foi recusado e o eixo em que escala. As remissões e os avisos B1, B2, B3 e GRD estão aplicados. O que sobrou fora da minha lista está em PERGUNTAS.

FEITO:
- **`G-09`, a parte do mecanismo, virou `RN-NUC-067`** (`nucleo-venda-congelamento.md:71`), como o thread decidiu.
  - O modo de arredondar é membro da configuração publicada do estabelecimento (linha 38), com versão e vigência. A lista é fechada: `half_up`, `half_even`, `down`, `up`, e o produto não escolhe nenhum.
  - Arredonda-se uma vez: quantidade × preço exato, depois o modo.
  - Sem modo publicado, só a linha que precisa arredondar é recusada. Linha de valor exato é lançada.
  - Casos de prova: 0,350 kg × 29,90 = 10,465, que dá 10,47, 10,46, 10,46 e 10,47 nos quatro modos. 23,456 L × 6,299 = 147,749344, que dá 147,75 com `half_up` e 147,74 com `down`.
- **O aviso de `LACUNA-NUC-004` foi reescrito** (`nucleo-venda.md` §6, `:374-380`) e repetido sob a tabela de `RN-NUC-013` (`nucleo-publicacao-e-texto.md:61`). Agora ele só cobre "qual modo a norma exige com `FIS` ou `EMI`" e o arredondamento do tributo. Combustível e granel vendem.
- **`G-03` virou `RN-NUC-068`.** `catalog_group` é núcleo de uso opcional, com classificação assumida, como o turno de A.2a.
  - O grupo pode conter grupos. Um item pode estar em zero, um ou vários grupos. Publicação com ciclo é recusada.
  - O grupo é conteúdo do membro "catálogo" (linha 18), não membro novo.
  - Recusados: só em `PUB`, e hierarquia com o item preso a uma folha única. O eixo é itens por catálogo.
- **`G-04` virou `RN-NUC-069`.** O núcleo vende item atômico, e toda variação é `GRD`, inclusive a de um eixo só. Recusado: eixo único no núcleo, porque deixaria duas formas de modelar tamanho e forçaria migração quando o cliente acrescenta o segundo eixo.
- **`G-05` e `A-05` viraram `RN-NUC-070`.**
  - A linha tem duas camadas: a do núcleo e a dos componentes `order_item_component` que cada módulo compõe. O núcleo soma e não interpreta.
  - Módulo novo `ADI` (adicional). É multiconjunto: "bacon duplo" é o adicional bacon com quantidade 2.
  - Instrução que cobra nunca é observação: vira adicional ou item de catálogo próprio.
  - Recusados: adicional no núcleo; adicional em `GRD` (daria 4¹⁰ combinações); adicional em `PRM`, `ECG` ou `FTC`; valor dentro da observação.
- **`G-07` virou `RN-NUC-071`.** O item fica no catálogo com a marca **fora de venda**, que faz parte da versão publicada e tem vigência.
  - Lançar item marcado é recusado com o motivo `business_precondition_unmet`.
  - Linha já lançada vale pela versão com que foi lançada. Sem contato, vale a divergência de `RN-NUC-015`(b).
  - **Isto contraria a recomendação A9 do inventário**, que era ausência. Motivo: a ausência confunde item tirado de venda com item não cadastrado, e contamina a conta de `RN-NUC-063`(e).
- **`A-01` virou `RN-NUC-072`.** O preço vale por estabelecimento ou para todos os do cliente, e o do estabelecimento vence. Canal é do módulo que cria o canal: nem `PCF` nem `INT` têm essa regra hoje, e o canal nunca compõe valor (`RN-PCF-001`).
- **`RN-NUC-013` foi alterada, com a redação anterior citada** (`nucleo-publicacao-e-texto.md:55`):
  - linha de preço por estabelecimento;
  - linha "Modo de arredondamento" no lugar de "LACUNA-NUC-004 — não afirmado";
  - fuso e moeda citam `RN-NUC-057` e `058`;
  - linha nova para artefato de módulo que compõe valor. Sem ela, o próprio aceite recusava o encargo de `ECG`.
- **Avisos:**
  - B3 no topo de `RN-NUC-005` e B2 no topo de `RN-NUC-008`, com ponteiro em §6.
  - O aviso de `GRD`, com o texto aceito, em `catalogo-de-modulos.md:272`, e o eco em `backlog-lacunas-g01-g09.md` §5.
  - Aviso novo de `ADI` fora do MVP 1.
- **Remissões:**
  - `RN-NUC-015` cita `published_artifact_version_received`.
  - `RN-NUC-013` infeliz (a) e `RN-NUC-002` infeliz citam `RN-NUC-063`(b).
  - A linha de `LACUNA-NUC-001` passou a `RN-NUC-057`.
  - O cabeçalho de `nucleo-venda.md` tinha "D-01 a D-04 ABERTAS" e "três arquivos"; os dois foram corrigidos.
  - O glossário ganhou a classe `gtin_global | gtin_restricted | not_gtin` e as simbologias `ean_upc | other_linear | two_dimensional | unknown`.
  - `matriz-operacao-papel-contrato.md:49` cita `RN-NUC-066`.
- **Glossário:** entraram `catalog_group`, `not_for_sale`, `order_item_component`, `add_on`, `channel_section` e o código `ADI`. "Complemento" e "categoria" viraram formas proibidas. Corrigi a linha de turno fundida com a de fundo de troco (`||`) e a nota de `LACUNA-GLO-002`, que dizia "sem regra" quando a lacuna já fechou.
- **Fronteira:** `:70` passou a "por estabelecimento". Linhas novas: preço de canal, agrupamento, fora de venda e `ADI`. As linhas de `GRD` e de observação (A-05) mudaram.
- **Catálogo de módulos:** atualizei `NUC`, `EST`, `PUB` e `GRD` e criei a entrada `ADI`. Corrigi também `RSV` e `REL`, que ainda diziam "fuso do cliente" e "turno" contra `RN-NUC-057` e `062`.
- **Itens de backlog, pela régua de edição**, cada um com um bloco "o que mudou, por quê, contra o quê":
  - `SPR-31`: rótulo retirado; aceites 2 a 4 caíram, entraram 1 a 5; depende de `SPR-32`.
  - `SPR-32`: variação e complemento saem do núcleo; entram versão, marca e camada de componentes; executável hoje.
  - `SPR-33`: chave "item + multiconjunto de componentes"; continua bloqueada por `SPR-23`.
  - `SPR-26` e `SPR-27`: têm critério de aceite agora. Declaram que não são executáveis antes da Fase 3 e nomeiam os cinco casos do catálogo de amostra que substitui a publicação real.
- **`backlog-lacunas-g01-g09.md`:** coluna "Estado em 2026-09-23" na tabela, linha "Fechada" nas seções §3, §4, §5 e §9, e as referências por linha trocadas por nome da entrada.

ARQUIVOS:
- `/home/mcastro/work/freelas/forja/docs/produto/nucleo-venda.md` (editado, 399 linhas)
- `/home/mcastro/work/freelas/forja/docs/produto/nucleo-venda-congelamento.md` (editado, 175)
- `/home/mcastro/work/freelas/forja/docs/produto/nucleo-publicacao-e-texto.md` (editado, 398)
- `/home/mcastro/work/freelas/forja/docs/produto/glossario.md` (editado, **400**)
- `/home/mcastro/work/freelas/forja/docs/produto/fronteira-do-nucleo.md` (editado, 289)
- `/home/mcastro/work/freelas/forja/docs/produto/catalogo-de-modulos.md` (editado, 350)
- `/home/mcastro/work/freelas/forja/docs/produto/catalogo-de-modulos-camada-2.md` (**novo**, 97; partição, ver DECISÕES)
- `/home/mcastro/work/freelas/forja/docs/produto/backlog-lacunas-g01-g09.md` (editado, 275)
- `/home/mcastro/work/freelas/forja/docs/produto/matriz-operacao-papel-contrato.md` (editado)
- `/home/mcastro/work/freelas/forja/docs/backlog/SPR-26-exibir-disponibilidade-dos-produtos.md`, `SPR-27-validar-disponibilidade-antes-do-envio.md`, `SPR-31-modelar-a-hierarquia-de-categorias-do-catalogo-sem-limite-ar.md`, `SPR-32-modelar-produto-variacao-e-complemento-no-nucleo-e-ingredien.md`, `SPR-33-definir-a-equivalencia-de-composicao-de-itens-e-a-identidade.md` (editados)

NÃO FEITO: —

DECISÕES:
- **Parti `catalogo-de-modulos.md` por camada de ativação.** Ele já tinha 399 linhas e foi a 433 com `ADI`. A §4 inteira (camada 2) foi para o arquivo irmão, verbatim, e o número da seção ficou vago no original, com ponteiro. Escolhi a camada 2 porque nenhuma citação por linha no repositório aponta para ela.
- **`nucleo-venda.md` não foi partido; foi compactado.** O cabeçalho de arquivos virou lista curta, e as lacunas fechadas (`001`, `007`) viraram ponteiro. Com isso os avisos B2 e B3 couberam no topo das RN e o arquivo ficou em 399.
- **Os avisos B2 e B3 ficam no topo da RN**, como os de A.3, e §6 aponta para eles.
- **Números usados: `067` a `072`**, dentro da faixa reservada. `073` a `079` não foram usados.

RISCOS:
- **Três arquivos do núcleo estão no teto:** glossário com 400, `nucleo-venda.md` com 399, publicação com 398. A próxima passada que escrever em qualquer um deles precisa partir antes.
- **`RN-NUC-070`(b) só vale se `SPR-32` modelar a camada de componentes agora.** Se não modelar, ligar `ADI` depois migra fato do núcleo.
- **`RN-NUC-071` nasce inerte em dois pontos, fora do meu território:**
  - `business_precondition_unmet` não cita a regra na §1.1 de `fatos-de-operacao-dominios-fechados.md`;
  - a marca só é publicada pela linha 18 da matriz (só `owner`). Um `manager` de restaurante não marca item esgotado sem delegação ampla.
- **`RN-NUC-070`, Registra:** "componente acrescentado e retirado é fato" depende de `order_item_added` e `order_item_removed` (`RN-NUC-053`, `054`) alcançarem componente. Hoje não alcançam.
- **`half_even` exige aritmética decimal exata.** 10,465 em ponto flutuante vira 10,4649… e dá o resultado errado. Isso é para `backend` e para T-0018.
- **Citações por linha que ficaram velhas:** os documentos históricos que citam `catalogo-de-modulos.md:93`, `:96`, `:99` e `:253` apontam para linhas que andaram de 1 a 5 posições. Corrigi só nos meus arquivos.
- **Cards ainda marcados como bloqueados por lacunas que fecharam:** `SPR-16`, `18`, `19`, `20`, `22` e `29` citam `G-03`, `G-04` ou `G-05` como bloqueio.
- **`RN-NUC-068` reprova o passo 1** do teste dos três negócios, com a classificação assumida por escrito, como o turno.

PERGUNTAS:
- para humano: `ADI` (adicional) entra no MVP 1? O default escrito é "fora", com aviso: a opção cobrada vira item de catálogo em linha própria, e a instrução vai na observação. É o restaurante quem mais sente isso.
- para thread: em `docs/backlog/INDEX.md`, os rótulos de `SPR-26`, `31` e `32` devem passar para "—", porque os itens já não estão bloqueados. Os títulos de `SPR-31` e `32` também ficaram velhos. Proposta: "Modelar o grupo de catálogo" e "Modelar o item de catálogo atômico, versionado, e a camada de componentes da linha". Quem atualiza?
- para thread: estas edições decorrem das decisões e estão fora da minha lista. Vão para um próximo despacho de `produto`?
  - `fatos-de-operacao-dominios-fechados.md` §1.1: `business_precondition_unmet` cita `RN-NUC-071`.
  - `fatos-de-operacao-ciclo-de-vida-do-pedido.md`: o lançamento e a retirada de componente viram fato.
  - `matriz-operacao-papel.md`: linha própria "pôr e tirar item de venda", `manager` e `owner` com `R`.
  - `README.md`: acrescentar o arquivo novo e as RN `067` a `072` ao índice.
  - `pendencias-fase-1-e-2-2026-09-23.md`: marcar B1, B2 e B3 como aplicados.
- para orquestrador: o inventário dá a passada A.2a/A.2b a A10 (`LACUNA-NUC-002`, preço aberto) e a A11 (forma de `NUC-006`, `NUC-035`), mas nenhum dos dois briefs as incluiu. Vão para A.2c?
- para orquestrador: B2 com `EMI` desligado não é pergunta ao contador. Corrigir venda sem contato nesse perfil é decisão de produto, e ninguém a tomou; hoje vale a recusa da linha 9. Entra em alguma passada?

VERIFICAÇÃO:
- Busquei `^### RN-NUC-0(6[7-9]|7\d)`: cada número de `067` a `072` aparece uma vez, e só nos meus arquivos.
- Contei as linhas por grep em todos os arquivos editados: todos com 400 ou menos.
- Conferi a aritmética dos dois casos de `RN-NUC-067` à mão.
- Conferi os alvos citados: o aviso em `modulos/fiscal.md:80`, a §3 de `fatos-de-operacao.md`, o marco `published_artifact_version_received`, `RN-NUC-063`(b), a linha 49 do contrato, as linhas 18 e 38 da matriz e o `business_precondition_unmet` da §1.1.
- Não reli os arquivos inteiros depois das edições. Não há teste a rodar: o entregável é spec.

MEMÓRIA SUGERIDA:
- type=decision escopo=plataforma slug=decision-modo-de-arredondar-e-publicado-pelo-estabelecimento — o modo de arredondar vem de lista fechada de quatro, é publicado pelo estabelecimento, versionado e congelado; o contador só responde o caso fiscal. Recusados: modo fixo, modo do cliente (tenant), modo por item, e recusar a linha até o contador responder.
- type=decision escopo=plataforma slug=decision-catalogo-item-atomico-grupo-opcional-fora-de-venda — o núcleo vende item atômico (`GRD` para todo eixo); o grupo de catálogo é opcional; "fora de venda" é marca da versão publicada, e a ausência foi recusada.
- type=decision escopo=modulo:adi slug=decision-adicional-e-modulo-adi-multiconjunto — adicional é módulo `ADI`, multiconjunto, e entra na linha como componente que o núcleo só soma.
- type=decision escopo=plataforma slug=decision-preco-por-estabelecimento-ou-cliente-canal-e-modulo — preço do estabelecimento vence o do cliente; canal nunca é dimensão do núcleo.
- type=state escopo=processo slug=state-specs-do-nucleo-no-teto-2026-09-23 — glossário, `nucleo-venda.md` e `nucleo-publicacao-e-texto.md` estão entre 398 e 400 linhas; quem escrever neles parte o arquivo antes.

PRÓXIMO PASSO SUGERIDO: `produto`, num despacho curto para as quatro edições da terceira pergunta (fatos, ciclo de vida, matriz, README), antes de `SPR-32` ir a `arquiteto-dados`. As mudanças de escopo dos cinco `SPR` devem entrar num commit próprio, separado das remissões, para o git guardar a redação anterior.

## thread — 2026-09-23 (respostas ao A.2b)

- **`ADI` entra no MVP 1.** Restaurante é a primeira vertical, e a opção cobrada ("bacon extra") é
  operação diária dele. A camada de componentes entra no `SPR-32` agora, e isso evita migrar fato do núcleo
  depois. `GRD` continua fora.
- Os rótulos e os títulos de `SPR-26`, `31` e `32` são atualizados pelo `produto` na próxima passada de
  backlog. As edições da terceira pergunta (fatos, ciclo de vida, matriz "pôr e tirar item de venda",
  README, inventário) vão juntas.
- `LACUNA-NUC-002` (preço aberto) e a forma de `NUC-006`/`NUC-035` (A10 e A11) entram na mesma passada.
  A correção de venda sem contato com `EMI` desligado (B2) também: é decisão de produto, e o default é a
  recusa da linha 9.

## produto — 2026-09-23 (SEG-T14-01, prazo por funcionamento)

## RELATÓRIO — produto — T-0014 (aplicação de SEG-T14-01)
STATUS: OK

FEITO:
- Mudei a unidade do prazo de `RN-OFF-035` para **horas de funcionamento sem contato, acumuladas e persistidas**. Mudar o relógio não altera a contagem. Reiniciar ou perder energia não encerra o prazo nem o zera. Inseri o bloco **Requisito do acompanhante (`F-017`)** no enunciado: o contador avança e é persistido antes de cada ato ordinário, uma gravação interrompida preserva o valor anterior, e nenhum ato é praticado com mais funcionamento do que o gravado.
- Reescrevi o Motivo de `RN-OFF-035` (o antigo `:78`, `:81`, `:82`). O "no máximo três dias" virou 72 h de funcionamento, com calendário sem limite contra quem mantém o terminal offline (ligado 4 h por dia dá 18 dias) e o controle real na revogação no primeiro contato. O "nunca mais de uma semana" virou 168 h ligado. Os recusados agora trazem "tratar reinício como vencido" (fere `PN-01`).
- Aceite de `RN-OFF-035`: 6 casos agora. Continuam o (1) e o (2), e o (6) é o antigo (3). Entraram três: queda de energia de 10 h, cinco reinícios seguidos e terminal furtado ligado 4 h por dia.
- Infeliz de `RN-OFF-035` (o antigo `:91`): contador ilegível ou ausente conta como prazo vencido, e só o contato restabelece. Nunca recomeça do zero.
- `RN-OFF-034`: passou a usar o mesmo contador e a mesma unidade, persistido antes de cada operação sensível. O aviso diz "a que horas, se o terminal seguir ligado". O aceite ganhou o caso do relógio atrasado. O Motivo agora declara o efeito da noite desligada (ver RISCOS).
- As duas regras têm nota **Corrigido em 2026-09-23 (`SEG-T14-01`)** dizendo o que mudou, por quê e contra o quê. Troquei nos títulos "horas sem contato" por "horas de funcionamento sem contato". A numeração não mudou.
- §3 Registra: os marcos de aviso e de vencimento passam a levar o funcionamento acumulado naquele instante, porque o servidor não sabe quanto tempo o terminal ficou ligado. Entrou também o fato "contador ilegível tratado como vencido".
- Linhas de Revisão de `RN-OFF-035` e `RN-OFF-038`: troquei "consulta a `seguranca` pendente" pelo que a consulta respondeu. Ela já está na ficha.
- `RN-EMI-038` (c): a segunda janela aponta para `RN-OFF-035` (antes `LACUNA-OFF-017`). Ela é dada em horas de funcionamento, **nunca como data**, e com a frase de que não há limite de calendário. O aceite traz o texto concreto da notificação: "vende até 72 h de funcionamento sem contato; em calendário, sem limite até a revogação no primeiro contato". Tem nota Corrigido.

ARQUIVOS:
- /home/mcastro/work/freelas/forja/docs/produto/fila-local-valores-de-partida.md (editado, 280 linhas)
- /home/mcastro/work/freelas/forja/docs/produto/fiscal-custodia-e-trilha.md (editado, 400 linhas: exatamente no teto)
- tarefas/T-0014-decidir-lacunas-das-fases-1-e-2.md:394-415, nucleo-estabelecimento.md:286-302, fila-local-autoridade-e-identidade.md:47-69 (só leitura)

NÃO FEITO: —

DECISÕES:
- Infeliz de `RN-OFF-035`: contador ilegível conta como vencido. O texto anterior dizia "conta a partir do último instante que consegue provar", e sem contador não há instante provável. A leitura otimista reabre o ataque de apagar o contador. O custo em `PN-01` fica restrito a armazenamento corrompido: a queda de energia sai do caso porque a gravação é atômica, e o contato restabelece na hora, sem ato de papel (`RN-NUC-061`). Em `RN-OFF-034` o mesmo desfecho não custa venda nenhuma.
- Para caber em 400 linhas, o aceite de `RN-EMI-038` deixou de repetir a lista das quatro consequências, que continuam em (a) a (d) do enunciado. A nota Corrigido ali tem uma linha só. O raciocínio completo mora em `RN-OFF-035`.
- Não criei nenhuma RN nova.

RISCOS:
- **`RN-OFF-034` e a noite desligada.** Com a contagem em funcionamento, a autoridade retida atravessa a noite num terminal desligado. Exemplo: gerente verificado às 19h, link caído logo depois, terminal desligado às 23h. Ele ainda tem 4 h de sangria sem contato no dia seguinte. O Motivo dizia que 12 h "impede que a autoridade atravesse para o expediente seguinte", e isso passou a valer só para o terminal que fica ligado. Deixei o efeito declarado no texto (`fila-local-valores-de-partida.md:60-64`).
- Dois irmãos ainda repetem a leitura de calendário e ficaram fora do meu território nesta passada: `fila-local-autoridade-e-identidade.md:169` ("72 h sem contato… entre 24 h e 7 dias") e `fila-local-conteudo-e-repouso.md:201-202` ("nunca mais de 7 dias").
- O prazo da capacidade de assinar (`RN-EMI-033` b, "prazo restante" em `RN-EMI-037`, `LACUNA-EMI-014`) provavelmente sofre do mesmo problema de relógio quando for fixado. Não mexi.
- `fiscal-custodia-e-trilha.md` está em 400 linhas. A próxima edição que acrescentar texto precisa dividir o arquivo.
- O nome do fato novo (contador ilegível) e do campo de funcionamento acumulado nos marcos fica com `glossario.md`, como a §3 já prevê. Ainda não existe lá.

PERGUNTAS:
- para seguranca: em `RN-OFF-034`, vale contar pelo **maior** entre funcionamento acumulado e calendário desde o último contato? Atrasar o relógio continua sem estender o prazo, porque o funcionamento é o piso. Desligar o terminal passa a consumir validade. E o vencimento ali só recusa operação sensível, sem parar venda nenhuma, então o argumento de `PN-01` que levou ao funcionamento em `RN-OFF-035` não se aplica. Sim ou não?
- para thread: despachar uma passada curta de `produto` para `fila-local-autoridade-e-identidade.md:169` e `fila-local-conteudo-e-repouso.md:201-202`?

VERIFICAÇÃO: contei as linhas dos dois arquivos com grep (280 e 400). Busquei "72 h|7 dias|168 h|três dias|uma semana" em `docs/` para achar as outras citações do prazo. Conferi `RN-NUC-061` antes de afirmar que o terminal comprometido não é renovado no contato. Não há teste a rodar: a entrega é spec.

MEMÓRIA SUGERIDA:
- Atualizar `business-rule-habilitacao-a-vender-do-terminal-tem-prazo` e `gotcha-revogacao-de-terminal-nao-alcanca-offline`: o prazo é de 72 h de **funcionamento** sem contato (teto 168 h), sem limite de calendário contra quem mantém o terminal offline, e o controle é a revogação no primeiro contato.
- type=gotcha escopo=plataforma camada=produto slug=gotcha-prazo-offline-em-calendario-nao-se-cumpre — um terminal sem hora confiável só conta tempo ligado. Prazo prometido em calendário é falso, e o contador precisa ser persistido antes de cada ato ou reinícios seguidos o zeram.

PRÓXIMO PASSO SUGERIDO: seguranca — consulta curta sobre a leitura "maior dos dois" em `RN-OFF-034`. Depois, produto: alinhar os dois irmãos citados em RISCOS.

## thread — 2026-09-23 (maior dos dois)

`RN-OFF-034` conta pelo **maior** entre o funcionamento acumulado e o calendário desde o último contato. Atrasar o relógio não estende o prazo, porque o funcionamento é o piso; adiantar o relógio só o encurta; desligar o terminal passa a consumir validade. O vencimento recusa só operação sensível e não para venda, então o argumento de `PN-01` não se aplica. `RN-OFF-035` fica em funcionamento puro.

## produto — 2026-09-23 (maior dos dois e irmãos)

## RELATÓRIO — produto — T-0014 (RN-OFF-034 "maior dos dois" e alinhamento dos irmãos)
STATUS: OK

FEITO:
- `RN-OFF-034` (`fila-local-valores-de-partida.md:43-87`): a validade passou a contar pelo **maior** entre as horas de funcionamento sem contato (contador de `RN-OFF-035`) e as horas de calendário pelo relógio do dispositivo, ambas desde o último contato em que o servidor conferiu a autoridade. O funcionamento é o piso: atrasar o relógio não estende a validade, e adiantar só a encurta. Mudei o título no mesmo sentido; o número não mudou.
- Enunciado: o aviso deixou de dizer "a que horas, se o terminal seguir ligado", porque o calendário corre com o terminal desligado, e a hora do vencimento já não depende disso.
- Nota nova **Corrigido de novo em 2026-09-23**, com o que mudou (só funcionamento → maior dos dois), o porquê (a autoridade atravessava a noite no terminal desligado) e contra o quê (a leitura em funcionamento puro da passada anterior). A primeira nota Corrigido (`SEG-T14-01`) ficou como estava.
- Motivo: tirei o parágrafo que declarava o efeito da noite desligada e a pergunta aberta. Agora 12 h impede a travessia para o expediente seguinte com o terminal ligado ou desligado. Diz por que aqui cabe calendário e em `RN-OFF-035` não: este vencimento só recusa operação sensível, então `PN-01` não se aplica. Também declara que, contra quem atrasa o relógio, o limite é o piso de funcionamento (12 h ligado no teto): o calendário protege o caso honesto e não esse. Entrou no Recusado: "funcionamento puro".
- Aceite, agora numerado de 1 a 5. O (3) é o caso novo da noite desligada: gerente verificado às 19h, link caído logo depois, terminal desligado às 23h com 4 h de funcionamento e religado às 07h sem contato. A autoridade já venceu pelo calendário (12 h), a sangria das 07h05 é recusada com "exige reconectar" e a venda em espécie continua. O (1) e o (2) (relógio atrasado 4 h) continuam de pé, porque o piso de funcionamento dá o mesmo desfecho das 04h01.
- Infeliz: relógio atrasado → vence pelo funcionamento, nunca depois dele; relógio adiantado → vence mais cedo pelo calendário, e nenhuma venda para. `RN-OFF-035` não foi tocada.
- `fila-local-autoridade-e-identidade.md:160-169`: o prazo de (i) passou a vencer por tempo de funcionamento sem contato, com 72 h no padrão, faixa de 24 h a 168 h e nenhum limite de calendário, mais um marcador de correção inline (`SEG-T14-01`, "o texto contava calendário, até 7 dias"). Tirei a frase velha "o valor é `LACUNA-OFF-017` e não o escrevo aqui", que contradizia o "Decidido" da linha seguinte. O trecho continua com as mesmas 9 linhas.
- O mesmo arquivo em `:203-205`, que estava fora do brief mas é o mesmo defeito: a janela do furto "declarada ao cliente com as duas datas" contradizia `RN-EMI-038` c ("nunca como data"). Passou a "limitada pelo prazo de funcionamento, sem limite de calendário, declarada em horas ligadas e nunca como data". Continua em 3 linhas.
- O mesmo arquivo em `:338`: o estado da `LACUNA-OFF-017` dizia "consulta a `seguranca` pendente" e passou a "valor conferido por `seguranca` em 2026-09-23". A edição fica na mesma linha.
- `fila-local-conteudo-e-repouso.md:199-204`: onde dizia "72 h no padrão, nunca mais de 7 dias" agora diz "72 h no padrão, nunca mais de 168 h ligado, sem limite de calendário contra quem o mantém offline e o liga pouco", com marcador de correção. O arquivo ganhou 2 linhas (236 → 238).

ARQUIVOS:
- /home/mcastro/work/freelas/forja/docs/produto/fila-local-valores-de-partida.md (editado, 280 → 291 linhas)
- /home/mcastro/work/freelas/forja/docs/produto/fila-local-autoridade-e-identidade.md (editado, continua com 400 linhas)
- /home/mcastro/work/freelas/forja/docs/produto/fila-local-conteudo-e-repouso.md (editado, 238 linhas)
- tarefas/T-0014-decidir-lacunas-das-fases-1-e-2.md:394-415 e :721-770 (só leitura)

NÃO FEITO: —

DECISÕES:
- Não parti `fila-local-autoridade-e-identidade.md`. Reescrevi os trechos com o mesmo número de linhas, e o arquivo ficou nas mesmas 400. Se a próxima edição acrescentar texto, o corte natural é por eixo: a §6 (`RN-NUC-081` e `RN-NUC-100`, busca de item no artefato publicado retido, `:353-400`, cerca de 48 linhas) vira `fila-local-catalogo-retido.md`, e o arquivo atual fica com autoridade, identidade e habilitação.
- O calendário de `RN-OFF-034` é medido pelo relógio do dispositivo, porque offline não existe outro. Por isso deixei escrito que ele não protege contra quem atrasa o relógio, e que ali vale o piso de funcionamento. Sem essa frase o Motivo prometeria de novo uma coisa de calendário que o terminal não cumpre, que é o defeito de `SEG-T14-01`.
- A relação da §1 ("validade da autoridade (teto 12 h) < prazo da habilitação (piso 24 h)") continua valendo sem mudança: o maior dos dois é sempre ≥ o funcionamento, então a autoridade vence quando o funcionamento ainda está em no máximo 12 h, abaixo de 24 h.
- Não criei nenhuma RN.

RISCOS:
- `fila-local-conteudo-e-repouso.md:207-208` ("cliente notificado com as duas janelas (até quando a capacidade de assinar valia e até quando o terminal ainda vende)") pode ser lido como data. Não é contradição explícita e não mexi.
- `fila-local-autoridade-e-identidade.md:210` ("venceu por tempo sem contato") e `:340` (texto preservado da lacuna) ainda falam em "tempo sem contato" sem unidade. O primeiro é genérico e remete a `RN-OFF-035`, e o segundo é histórico declarado. Deixei os dois como estão.
- A §3 de `fila-local-valores-de-partida.md` registra nos marcos o funcionamento acumulado e o instante do terminal. Com o relógio adulterado, o calendário de `RN-OFF-034` não se reconstrói com confiança a partir desse instante, e o funcionamento gravado continua sendo a prova. Não acrescentei campo.
- `RN-EMI-033` b e `LACUNA-EMI-014` (prazo da capacidade de assinar) seguem com o risco apontado na passada anterior. Não mexi.

PERGUNTAS: —

VERIFICAÇÃO: contei as linhas dos três arquivos com grep: 291, 400 e 238. Busquei "7 dias|uma semana|três dias|duas datas" em `docs/produto/`, e o que sobrou nos três arquivos são notas de correção que citam o texto antigo. Busquei `RN-OFF-034` em `docs/`, e nenhuma citação de fora afirma a unidade de contagem. Refiz os aceites de `RN-OFF-034` à mão: (1) vence às 04h pelos dois; (2) o funcionamento chega a 8 h às 04h reais; (3) às 07h o calendário marca 12 h, contra 8 h de validade. Não há teste a rodar, porque a entrega é spec.

MEMÓRIA SUGERIDA:
- type=business-rule escopo=plataforma camada=produto slug=(atualizar o registro que cobre a autoridade retida, se existir) — a autoridade retida conta pelo maior entre funcionamento e calendário desde o último contato; a habilitação a vender conta só funcionamento.
- Fundir ao gotcha sugerido na passada anterior (`gotcha-prazo-offline-em-calendario-nao-se-cumpre`): prazo cujo vencimento não para venda pode contar pelo maior dos dois, porque o calendário cobre o caso honesto e o funcionamento é o piso contra o relógio; prazo cujo vencimento para venda conta só funcionamento, por `PN-01`.

PRÓXIMO PASSO SUGERIDO: nenhum para produto. O thread pode registrar no fechamento o corte indicado em DECISÕES para quando `fila-local-autoridade-e-identidade.md` precisar crescer.

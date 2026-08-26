# Roadmap de módulos — proposta de corte

> **O que este arquivo é.** A **proposta** de ordem de construção: o que entra no MVP 1, o que vem
> depois, o que fica no horizonte, e **o critério** que decide cada posição. Ele existe para que o
> corte seja discutido com o tamanho real na mesa, e não pela ordem em que os assuntos apareceram.
>
> **O que ele não é.** Não é decisão: prioridade, corte e escopo comercial são do humano
> (`.claude/rules/produto.md`). Nada aqui está aprovado. **Não há data, prazo nem estimativa de
> esforço em tempo** — ordenar por tempo não medido é o número mais perigoso que este documento
> poderia carregar. Onde é preciso ordenar, a ordem é de **dependência**. Também não há tabela,
> coluna, rota, componente nem stack: `D-01` a `D-04` seguem ABERTAS e `D-05` é proposta nesta ficha.

---

## 1. Dois eixos que não se misturam

O humano foi explícito: *"na ordem de prioridade de construção, apenas construção, não
funcionamento"*. São dois eixos, e confundi-los é o defeito mais caro desta camada.

**Eixo de funcionamento — o produto.** A Forja é PDV geral **desde o dia 0**. O núcleo não conhece
ramo (`fronteira-do-nucleo.md` §3), e a vertical é receita de módulos (`receitas-por-vertical.md`),
não pré-requisito. Um posto, uma padaria e uma loja de roupa são clientes legítimos do primeiro
release que existir, ligando a receita deles sobre os módulos que existirem naquele momento. Nenhuma
vertical é pré-requisito de outra e nenhuma é "a principal" no produto.

**Eixo de construção — o trabalho.** A ordem em que **nós** construímos é puxada pelo restaurante,
porque é a vertical que o humano escolheu atender primeiro e é ela que fornece a operação real contra
a qual as regras se verificam. Restaurante é o **corpo de prova**, não o produto.

**As três consequências práticas, e é por elas que a distinção se audita:**

1. Módulo puxado por `RES` nasce com fronteira cross-vertical ou não nasce. `COZ` é o caso já
   decidido: o vocabulário dele é léxico de **módulo**, não de ramo (`glossario.md` §6), porque ponto
   de produção existe em ótica, farmácia e gráfica.
2. **Ordem de construção não vira ordem de venda.** Que `MSA` e `COZ` sejam construídos antes de
   `BMB` e `ETQ` não diz nada sobre a que cliente se vende primeiro — diz apenas contra qual operação
   as regras foram provadas.
3. **Nada no núcleo pode depender de um módulo do MVP 1 existir.** Se depender, a fronteira está
   errada e o defeito aparece no primeiro cliente que não é restaurante — quando já custa migration.

---

## 2. O critério — fase é dependência, e piso vem antes de diferencial

### 2.1 Fase é dependência, não prazo

Uma fase fecha quando o que ela entrega **não precisa mais ser refeito** pela seguinte
(`.claude/rules/processo.md` §4). Um item só é agendável quando **todas** as suas dependências estão
resolvidas, e há quatro tipos, com donos diferentes:

| Tipo | O que trava | Dono da resposta |
|---|---|---|
| **Contrato** | módulo que exige outro (`catalogo-de-modulos.md` §4) — ativação é recusada sem ele | `produto` |
| **Fato congelado** | dado que, se não nascer certo, é irrecuperável para todo o histórico (§7) | `arquiteto-dados` + `produto` |
| **Decisão do humano** | `D-01` a `D-05`, lacuna comercial, instrumento jurídico | **humano** |
| **Norma / fonte** | regra fiscal, trabalhista ou de consumo não confirmada | **humano** (com contador/jurídico) |

Dependência não resolvida não é "risco a acompanhar": é **bloqueio de agendamento**. Item nessa
situação é agendado para **resolver a dependência**, não para construir.

### 2.2 Piso × diferencial — a regra que evita o erro clássico

**Piso** é o que o negócio quebra sem. **Diferencial** é o que o dono do negócio escolhe ligar porque
melhora a operação dele. O erro clássico é agendar diferencial visível antes de piso invisível — e ele
se disfarça de duas maneiras, então as duas viram regra:

- **R1 — `CAP` com `opt-in: obrigatória por dependência` é piso por definição** (campo 11 de
  `catalogo-de-capacidades.md` §1 diz isso literalmente). **Medido hoje:** nenhuma das 10 está nesse
  estado — todas são `opt-in: sim`.
- **R2 — capacidade que preserva uma necessidade já atendida hoje, com mecanismo melhor, também é
  piso.** O sinalizador existe e é mecânico: `arcaico: sim → PN-nn` significa que a necessidade **já é
  atendida** pelo mecanismo velho que um `PN` recusa. Tratá-la como diferencial é entregar menos e
  chamar isso de modernidade — exatamente o que `.claude/rules/00-nucleo.md` §12 proíbe.
- **R3 — `MVP 1` não recebe diferencial enquanto houver piso descoberto.** Exceção só com argumento
  explícito ao humano, **item por item**. Hoje há piso **sem spec nenhuma** (§5.2), logo a proposta é
  **zero `CAP` no MVP 1**.
- **R4 — nenhuma `CAP` é agendada sem escolha do humano.** Todas as 10 são `candidata`; 4 estão em
  §7 do catálogo por falta de campo obrigatório, 9 em horizonte, 7 recusadas. **Nenhuma nasce aceita**,
  e este roadmap não promove nenhuma.
- **R5 — `RN` PROVISÓRIA não é agendada para código.** Ela é agendada para **resolver a lacuna**.

### 2.3 As 10 capacidades, classificadas por este critério

Classificação **proposta**, para o humano confirmar ou recusar item por item. Ela não agenda nada.

| `CAP` | Módulo dono | `arcaico` | Classificação proposta | Onde cai |
|---|---|---|---|---|
| `CAP-PER-001` | `PER` | sim → `PN-18` | **candidata a piso de `PER`** (R2) | com a spec de `PER` (§5.2) |
| `CAP-MSA-001` | `MSA` | sim → `PN-15` | **candidata a piso de `MSA`** (R2) | subsequente, com `PCF` |
| `CAP-PRZ-001` | `PRZ` | sim → `PN-20` | candidata a piso de `PRZ` (R2) | horizonte — `PRZ` fora do MVP |
| `CAP-ETQ-001` | `ETQ` | sim → `PN-20`, `PN-08` | candidata a piso de `ETQ` (R2) | horizonte — vertical `VAR` |
| `CAP-TRC-001` | `TRC` | sim → `PN-10`, `PN-11` | candidata a piso de `TRC` (R2) | horizonte — vertical `VAR` |
| `CAP-BMB-001` | `BMB` | sim → `PN-07` | candidata a piso de `BMB` (R2) | horizonte — vertical `PST` |
| `CAP-BMB-002` | `BMB` | sim → `PN-13` | candidata a piso de `BMB` (R2) | horizonte — vertical `PST` |
| `CAP-EST-001` | `EST` | não | **diferencial** | subsequente, depois de `EST` |
| `CAP-COZ-001` | `COZ` | não | **diferencial** | subsequente, depois de `COZ` |
| `CAP-GRD-001` | `GRD` | não | **diferencial** | horizonte — vertical `VAR` |

**Consequência que vale dizer em voz alta:** 7 das 10 são candidatas a **piso do módulo dono**, não
diferencial. Isso não as promove ao MVP 1 — cinco pertencem a módulos de verticais que não estão em
construção. Mas muda o que fazer com elas: piso de módulo entra na **spec do módulo** quando ele for
construído, em vez de ficar na fila de "coisas legais para depois", que é onde capacidade table-stakes
morre em silêncio.

---

## 3. O estado real do que existe — medido

Contagens medidas em 2026-08-22 por contagem de linhas e por busca de heading. **Não infladas e não
minimizadas:** é prosa normativa, não código; nada disso executa.

- **`docs/produto/`: 7.891 linhas em 28 arquivos.** Fora dele, e relevante: três dossiês fiscais + um
  adendo de base de cálculo em `docs/arquitetura/fiscal/`, o dossiê de opções de stack
  (`docs/arquitetura/d-01-d-02-stack-opcoes.md`) e quatro arquivos de design em `docs/design/` — não
  medi as linhas desses.
- **191 `RN` definidas**, em 9 famílias: `NUC` 25 · `EMI` 41 · `OFF` 31 · `FIS` 20 · `ATI` 19 ·
  `PCF` 18 · `MSA` 14 · `COZ` 12 · `RES` 11. Mais `PN` 20 e `CAP` 10 → **221 itens numerados**.
- **3 `RN` PROVISÓRIAS** (R5 da §2.2), agendadas para resolver a lacuna, com dono:

| Regra | Lacuna que a trava | Dono da resposta |
|---|---|---|
| `RN-EMI-015` — documento de serviço | `LACUNA-EMI-006`, `LACUNA-FIS-008` | humano (com contador) |
| `RN-FIS-016` — exclusão de base condicionada | `LACUNA-FIS-003` | humano (com contador) |
| `RN-RES-009` — modo declarado, nunca inferido | `LACUNA-RES-002`, `LACUNA-RES-003` | humano (com contador, por UF) |

- **74+ lacunas nomeadas com dono** — contagem herdada dos relatórios da ficha T-0001, **não medida
  por mim**. Cada uma existe no lugar de uma frase confiante que não tinha fonte.
- **Zero linha de código, zero DDL, zero `db/`.** `D-01` a `D-04` ABERTAS; `D-05` proposta (§7.1).

**Duas coisas que não estão fechadas e não podem sumir do resumo:**

1. **`LACUNA-NUC-007` — turno.** O humano respondeu **"não sei ainda"**. Em 2026-08-23 ela fechou pela
   metade: o **fechamento do dia** ganhou regra dona (`RN-NUC-031`) e linha na tabela de
   `operacao-offline-e-sincronizacao.md` §4 — `degradado` em D1 e D3, recusa em D2 —, então "fechar o dia
   offline é recusado" **deixou de ser verdade**. Continua fora da tabela, e no default de **recusa**
   (`RN-OFF-008`), só **abertura e fechamento de turno**: é **dívida declarada**, não desfecho aprovado,
   e é a última contradição com `PN-01` no núcleo (`nucleo-venda.md` §6). Fechá-la exige `RN-NUC` nova, e
   inventá-la para preencher célula é como comportamento entra inventado. Depende do humano.
2. **`service_mode`** é o único termo de núcleo cunhado no glossário (§1.3) que **não tem regra
   numerada** (resto de `LACUNA-GLO-002`). Ele é dependência do documento fiscal — que exige saber se
   a operação é presencial ou entregue em endereço — logo é piso, e piso sem `RN` não é construível.

---

## 4. MVP 1 — o que entra, e por que cada item é piso

Proposta. Ordenada por **dependência**, de baixo para cima; nada aqui é "primeiro" no sentido de
importância comercial. **Exceção declarada:** o item 6 (`EMI`) não é piso do perfil-alvo inicial —
desde 2026-08-24 (T-0005, decisão do humano) ele é módulo plugável, desligado por padrão para esse
perfil; ver a linha e §5.3/5.4.

| # | Bloco | Por que é piso | Estado da spec | Dependência que o trava |
|---|---|---|---|---|
| 1 | **Plataforma** (não é módulo) — isolamento por cliente, registro de módulos ativos, manifesto, provisionamento | sem isso nenhum módulo liga e o invariante 1 não existe | fora de `produto` por decisão (`fronteira-do-nucleo.md` §2.1) | `D-01`, `D-03`, `D-04` |
| 2 | **`NUC`** — pedido, venda imutável, pagamento, correção por fato novo, caixa, papéis | é o conjunto que os três negócios quebram sem | 25 `RN` | `service_mode` sem `RN`; `LACUNA-NUC-001` (fuso), `004` (arredondamento), `006` (meios de pagamento), `007` (turno) |
| 3 | **`OFF`** — contrato transversal de continuidade offline | o caixa não pode parar; é `PN-01` | **33 `RN`** (`001`–`033`) em quatro arquivos; grandezas sem valor não recontadas em 2026-08-23 | `LACUNA-OFF-002`/`003` (numeração), `011` (papel retido), `012` (repouso), `017` (habilitação a vender) |
| 4 | **Autorização** — papéis, atribuição, delegação, autoridade retida | operação sensível sem papel e sem trilha é fraude barata | 9 `RN` (`RN-NUC-017`–`025`) + a matriz operação × papel, **em disco desde 2026-08-23, em três arquivos** (`026`–`033`, `039`, `040`) | `D-03` |
| 5 | **`FIS`** — tributação, vigência, congelamento | sem tributo composto não há venda documentável em nenhum ramo; **entra ativo** no MVP 1 independentemente do estado de `EMI` (Opção B, §5.3, separa as duas decisões) | 20 `RN` (1 provisória) | **`D-05`** e o **grão do congelado** (§7) — hoje **não modelável**, e isso **não muda** com a decisão de `EMI` (§5.3/5.4) |
| 6 | **`EMI`** — bloco mínimo indivisível (§5) | **não é piso do MVP 1**: desde 2026-08-24 (T-0005) é módulo plugável, **desligado por padrão** para o perfil-alvo inicial (interior) — decisão do humano, Opção B (§5.3/5.4). É config por cliente/tenant, não característica do MVP inteiro: outro cliente com outro perfil pode ativá-lo depois, sem migração destrutiva, desde que as três reservas de modelo da §5.3 estejam na Fase 1 | 41 `RN` | `LACUNA-EMI-001`, `005`, `011`, `014`; numeração — relevantes para quando algum cliente ativar `EMI`; as três reservas de modelo (§5.3) são pré-requisito da Fase 1 mesmo com `EMI` desligado |
| 7 | **`PER`** — periféricos: comprovante impresso, gaveta | dependência dura de `EMI` (contingência **imprime**, e imprime mais) e base da receita `RES` | **19 `RN`** (`RN-PER-001`–`019`), em dois arquivos, escritos em 2026-08-22 | `LACUNA-PER-3` (imprimir depois), `PER-2`/`PER-4` (norma não confirmada) |
| 8 | **`MSA`** + **`COZ`** — consumo em aberto e ponto de produção | base da receita `RES`: sem eles a vertical de construção não opera | 14 + 12 `RN` | — |
| 9 | **`RES`** — a receita e as regras do ramo | é o corpo de prova de tudo acima | 11 `RN` (1 provisória) | `LACUNA-RES-002`/`003` |

### 4.1 Piso descoberto que ainda não é construível

Isto é o resultado mais importante da §4, e é o que sustenta a R3 da §2.2:

- **`PER` já tem spec** — 19 `RN` escritas em 2026-08-22, e a classificação offline das seis operações
  entrou na tabela de continuidade em 2026-08-23. O que ainda trava é `LACUNA-PER-3` (imprimir depois),
  no caminho crítico do caixa; a afirmação "0 regra numerada" era desta seção e ficou falsa.
- **`service_mode` sem `RN`** (§3) — piso do documento fiscal.
- **Turno** (`LACUNA-NUC-007`) — hoje recusado por default; o **fechamento de dia** saiu daqui em
  2026-08-23 (`RN-NUC-031`, com linha na tabela de offline).
- **A matriz operação × papel existe em disco** desde 2026-08-23, em três arquivos; o que falta dela são
  as células `?` com lacuna nomeada — não a matriz.

Enquanto os **três** que continuam abertos seguem abertos — `LACUNA-PER-3`, `service_mode`, turno —, **nenhuma `CAP` deveria entrar no MVP 1**. Não porque as
capacidades sejam ruins — duas delas (`CAP-PER-001`, `CAP-MSA-001`) são candidatas a piso do módulo
dono — mas porque construir escolha antes de construir obrigação é o que produz PDV bonito que o caixa
não usa.

### 4.2 O que explicitamente **não** entra no MVP 1

`PCF`, `ATI`, `PUB`, `CMP`, `ENT`, `ECG`, `EST`, `FTC`, `RSV`, `INT`, `ADQ`, `PGO`, `PRM`, `VOU`,
`CLF`, `PRZ`, `COM`, `ORC`, `REL`, `FID`, `TRC`, `CSG`, `GRD`, `ETQ`, `BMB`, `APU` — e o **documento
de serviço** dentro de `EMI` (§5.2). Risco de cada corte na §9.

Os dois cortes que contrariam o pedido literal do humano, e por isso levam justificativa nomeada:

- **`PCF`** exige `PUB` (não há canal sem conteúdo publicado) **e** um destino declarado — `MSA` ou
  `CMP`. `PUB` tem **0 `RN`**. Então `PCF` no MVP 1 arrasta a spec de `PUB` inteira antes de começar.
- **`ATI`** exige `PUB` **e**, para atender cliente-final, exige `PCF`
  (`catalogo-de-modulos.md` §4). É camada 2 sobre camada 2. Além disso é o módulo com a superfície não
  confiável mais larga do catálogo (conteúdo de conversa), depende de `D-03` para saber quem é o
  interlocutor, e tem `LACUNA-ATI-3`/`4` abertas. Detalhe na §9 e no relatório desta passada.

---

## 5. Emissão própria — o custo explícito, e as duas opções

A decisão de emitir por conta própria foi tomada **antes** de o tamanho dela existir. Agora existe: 41
`RN`, três arquivos, 19 lacunas só em `EMI`, e uma assinatura permanente de manutenção — a
especificação do documento muda por **três canais** com cadências diferentes (nota técnica, informe
técnico de tabela de domínio, atos conjuntos), e **alguém tem de observar as três listas**. Isso não é
trabalho de construção: é trabalho contínuo, e hoje **não está atribuído a ninguém**.

### 5.1 O bloco mínimo indivisível — o que não pode sair sob pena de `EMI` não entregar valor

| Item | Por que é indivisível |
|---|---|
| **Documento de mercadoria** | é o documento do caso base dos três ramos |
| **Contingência off-line** | sem ela, autorizador fora = cliente-final saindo com comprovante não fiscal |
| **Fila de pendências com prazo por documento** | contingência gera pendência com prazo de **horas**; sem a fila, `EMI` emite e não resolve o caso mais comum |
| **Desfecho de número** | inutilizar se não autorizado, cancelar se autorizado — desfecho binário que depende de **consultar** o autorizador, nunca de supor |
| **Aviso de vencimento de credencial** | credencial vencida **não tem contingência**: a contingência consiste em gerar, **assinar** e imprimir. Sem credencial não existe documento nenhum, nem off-line |
| **Versão de especificação gravada no documento** | sem ela não há como saber sob que regra o documento nasceu, e o congelamento de `FIS` fica sem par em `EMI` |

### 5.2 O que **não** cabe no MVP 1, e por quê (conclusão do passo 3b desta ficha)

| Fora | Motivo |
|---|---|
| **Documento de serviço (NFS-e/ISS)** | outro autorizador, **adesão municipal voluntária e sem prazo**, parte da documentação em minuta, e **regra de rejeição oposta**. `RN-EMI-015` é PROVISÓRIA e a habilitação já é **por tipo de documento**, então deixá-lo fora não mexe na fronteira |
| **Modalidades adicionais de contingência** além da off-line | cada modalidade é máquina de estado própria; a off-line cobre o caso base |
| **Segunda UF** | metade da regra de emissão é decisão de UF (credenciamento, código de responsável técnico, parâmetro estadual). Habilitar a segunda UF é **projeto**, não cliente novo |
| **Automação de rotação de credencial** | o **aviso** de vencimento fica (é continuidade); rotacionar sozinho não |

### 5.3 As duas opções, custeadas — decidido: Opção B (2026-08-24, T-0005)

**Decisão do humano.** Opção B. O MVP 1 não constrói emissão própria: o cliente liga só `FIS` e
compõe o tributo certo por item/venda; a obrigação documental fica fora da Forja. A decisão é
**config por perfil de cliente/tenant, não característica do MVP inteiro** — o perfil-alvo inicial
(interior) é quem fica sem `EMI` por padrão; outro cliente, com outro perfil, liga `EMI` depois sem
migração destrutiva, contanto que as três reservas abaixo tenham entrado no modelo da Fase 1. Esta
decisão resolve **A-vs-B de emissão**, e só isso: ela **não substitui** a resolução de `D-05` (§7.1).
`D-05` segue **aberta**, e é ela quem de fato trava a modelagem de `FIS` na Fase 1 — independentemente
de `EMI` estar ligado ou desligado para qualquer cliente.

**Opção A — emissão própria no MVP 1. Recusada nesta decisão.**
Entrega: o cliente vende e cumpre a obrigação documental dentro da Forja, inclusive com o autorizador
fora do ar. Custo, todo declarado: o bloco de 41 `RN`; `PER` especificado antes (a contingência
imprime); a fila de pendências com **superfície de retaguarda** e um **papel** que a opere — hoje
inexistente em toda a spec; **instrumento jurídico de custódia** de credencial antes do primeiro
cliente (`LACUNA-EMI-001` — é contrato, não código); habilitação por UF e ambiente, com homologação
**permanente**, não etapa; e a observação contínua das três cadências de especificação. Risco de
bloqueio: `LACUNA-EMI-011` (se a UF do caso base não admitir contingência off-line, o degrau 1 da
escala de degradação cai) e `LACUNA-EMI-005` (se o código de responsável técnico for por emitente, há
teto comercial por UF).

**Opção B — MVP 1 sem emissão própria, com caminho de transição declarado. Decidida.**
O cliente liga só `FIS`: compõe o tributo, e a obrigação documental fica com o contador ou o provedor
dele. Isso **já é configuração suportada** e tem comportamento desligado escrito
(`modulos/fiscal.md` §3.1), então não é gambiarra. Custo: o cliente-final recebe comprovante **não
fiscal**; não se vende para quem precisa emitir dentro do PDV; e o produto fica com uma promessa
central em aberto. **O caminho de transição só é honesto se três coisas entrarem no modelo da Fase 1
mesmo sem `EMI` construído** — senão ligar `EMI` depois é reescrever histórico, e histórico fiscal não
se reescreve:

1. **Numeração** como mecanismo de alocação por estabelecimento **e** série, com a possibilidade de
   alocação concorrente e possivelmente no terminal (§7.3).
2. **Congelamento** do fato e o **grão** dele (§7.2).
3. **Âncora da obrigação documental** no fato, para que a venda antiga saiba a que documento ela
   corresponderia.

Sem essas três, a Opção B não é "depois a gente liga": é migração de dado fiscal em N clientes. **As
três são pré-requisito da Fase 1 mesmo com `EMI` desligado** para todo cliente — é a condição de
"todos os dados para a futura implementação existirem" que o humano pediu ao confirmar a Opção B. Elas
não substituem `D-05` (§7.1): `D-05` trava a **casa** do catálogo de regra fiscal que `FIS` usa para
compor o tributo; as três reservas tratam da **numeração**, do **congelamento/grão** e da **âncora
documental** — condições diferentes, e as duas seguem abertas em paralelo.

### 5.4 O que decidiu entre A e B

Não era preferência técnica: era (a) se existe cliente-alvo que precisa emitir dentro do PDV desde o
primeiro dia; (b) se o instrumento de custódia pode existir antes do primeiro cliente; (c) se a UF do
caso base admite contingência off-line. Resolvido em 2026-08-24 (T-0005): para o perfil-alvo inicial
(interior), a resposta a (a) é **não** — é um perfil que não liga muito para nota fiscal, e o
documento fica com o contador dele. (b) e (c) ficam sem resposta necessária **enquanto esse for o
perfil-alvo**: como a decisão é por cliente/tenant (não característica do MVP inteiro), um cliente
futuro que responda diferente a (a) reabre (b) e (c) só para ele, no momento de ativar `EMI` — sem
mudar o MVP 1 nem exigir migração, desde que as três reservas da §5.3 já estejam no modelo.

---

## 6. Subsequente — na ordem em que a dependência permite

1. **`PUB`** — publicação de catálogo. É pré-requisito de `PCF` e de `ATI`, e hoje tem 0 `RN`.
2. **`CMP`** — estado de cumprimento; abre retirada, e é dependência dura de `ENT`.
3. **`PCF`** — pedido pelo cliente-final. Exige `PUB` + destino (`MSA` ou `CMP`); 18 `RN` já escritas,
   mais o anexo de sessão externa. Gate de `seguranca` **agendado e não cumprido**.
4. **`ATI`** — atendimento com IA. Exige `PUB` e, para cliente-final, `PCF`; 19 `RN` + anexo de
   fronteira de confiança. Gate de `seguranca` agendado.
5. **`EST`** (+ `FTC` onde há item preparado), **`ECG`**, **`ENT`**, **`INT`**, **`REL`**.
6. **`APU`** — apuração e obrigação acessória. Fora do MVP por decisão do humano, **sem data**; o
   custo de deixá-la fora está em `modulos/fiscal.md` §4 e pressupõe que o contador do cliente cumpre.
7. **Diferenciais que dependem do que ficou pronto:** `CAP-COZ-001` (exige tempo de preparo medido, e
   é ele que destrava duas entradas de horizonte), `CAP-EST-001` (exige disponibilidade confiável),
   `CAP-MSA-001` (exige `PCF` para a superfície do cliente-final).

## 7. O que a Fase 1 **não** pode modelar — e o que ela não pode errar

Esta seção é a mais importante para quem vai construir. Ela vem da consulta a `arquiteto-dados` nesta
ficha, e não é opinião de produto.

### 7.1 `FIS` não é modelável hoje — `D-05` está aberta

**O catálogo de regra fiscal não tem casa no modelo.** Uma alíquota de uma UF vale para todos os
clientes daquela UF, e as três saídas conhecidas são todas ruins de um jeito diferente:

- em `platform` → viola "nenhuma tabela de cliente vive no `platform`", e faria o fato de um cliente
  referenciar outro schema (proibido);
- replicado em cada `t_<cliente>` → "publicar regra" passa a ser escrita em N schemas, que **divergem
  em silêncio** (e drift é defeito, `.claude/rules/migrations.md` §9);
- **terceira opção**: artefato **versionado que acompanha o release**, não dado de banco — muda o
  problema de "sincronizar N schemas" para "publicar versão", ao custo de perder restrição
  declarativa no banco.

**Dizer isto em voz alta em vez de agendar `FIS`:** enquanto `D-05` não fechar, `FIS` **não entra no
modelo da Fase 1**. Agendá-lo como se fosse modelável produziria a decisão mais estruturante do
projeto tomada por omissão, dentro de uma migration.

### 7.2 Congelamento e grão — irrecuperável se nascer errado

O congelamento (`RN-FIS-004`) é a **única** exigência fiscal que não é acomodável depois: as outras
são tabela ou coluna nova preenchível por backfill; o congelado é dado que ou foi escrito no instante
do fato, ou **não existe mais** — e `RN-FIS-005` proíbe recompor. Fato sem snapshot fica para sempre
sem procedência.

**E o grão vale igual:** se o congelado nascer por **venda** em vez de por
`item × tributo × base × regime × redutor`, a segregação de `RN-FIS-015` e a decomposição de
`RN-FIS-014` ficam **irrecuperáveis para todo o histórico**. Junto disso, duas coisas que a spec de
produto não tinha visto e que são decisão de produto pendente, não de banco: o congelado precisa
incluir os **insumos** (base, quantidade, classificação, natureza da operação — senão `RN-FIS-010`
nasce inútil) e a **política de arredondamento**, com a ordem em que se aplica — senão o cancelamento
erra por centavo. **Dono:** `produto`, com o humano e o contador, **antes** da Fase 1.

### 7.3 Numeração de documento — o caro de `EMI`

Contingência, estado de retransmissão e versão de layout são metadado de documento já append-only:
coluna nova, barata. **Numeração não é coluna: é mecanismo de alocação.** É invariante de unicidade e
sequência por estabelecimento e série; acrescentá-la depois exige unicidade retroativa em N schemas
sobre dados que já podem ter colisão, e **renumerar é impossível** — o número já está com o autorizador
e na mão do cliente-final. Com emissão offline a alocação é concorrente e possivelmente no terminal, o
que exclui o mecanismo mais óbvio do banco. Há tensão real, e ela é de produto: faixa pré-alocada por
terminal (`RN-OFF-006`) e sequência densa diária são incompatíveis (`LACUNA-NUC-003`,
`LACUNA-OFF-002`).

### 7.4 Um conflito de regra que bloqueia modelar tempo

`RN-FIS-008` resolve vigência no fuso do **estabelecimento**; `.claude/rules/dados.md` §3 diz que o
fuso é dado do **cliente**; e "hoje", turno e fechamento estão escritos no fuso do cliente. Cliente
com estabelecimentos em fusos diferentes quebra uma das duas (`LACUNA-GLO-001`). A Fase 1 precisa da
resposta **antes** de modelar qualquer coisa datada.

---

## 8. Horizonte — nomeado, não agendado

- **Vertical `PST` (posto)** — receita escrita (`receitas-por-vertical.md` §3); **nunca especificada**:
  não existe `verticais/posto.md`, e `BMB` tem 0 `RN`.
- **Vertical `VAR` (varejo)** — receita escrita (§4); **não existe `verticais/varejo.md`**, e as três
  `CAP` de `VAR` se apoiam em **três fatos** e nada mais. Se `VAR` for para valer, o pré-requisito é a
  **spec da vertical**, não mais capacidade.
- **9 entradas de horizonte e 4 candidatas não desenvolvidas** de `catalogo-de-capacidades.md` §7/§8,
  cada uma com o filtro que falta.
- **7 recusadas** (§9 do mesmo arquivo) — recusa com motivo escrito não volta a cada três meses.
- **Candidatos sem código** (`catalogo-de-modulos.md` §6): recorrência/assinatura, marketing, loja
  própria na internet.

## 9. O que ficou fora, e o risco de cada corte

| Fora do MVP 1 | Risco real do corte |
|---|---|
| **`ATI`** | é o item que o humano nomeou no pedido. Cortar contraria a expectativa dele, e é o corte que eu mais defendo (relatório desta passada) |
| **`PCF`** | fecha a porta do canal externo no primeiro release; `MSA` cobre o salão, então a operação **não para** |
| **`PUB`** | 0 `RN`; sem ele não há canal nenhum. É o gargalo silencioso de `PCF` e `ATI` |
| **Fila de pendências de `EMI`** | **não está cortada, e não deve ser** (§5.1). É o corte que parece barato e destrói o valor de `EMI` |
| **Documento de serviço** | se a vertical de construção emitir serviço, um cliente real fica sem cumprir a obrigação — `LACUNA-RES-008` não sabe se o caso ocorre |
| **`APU`** | pressupõe que o contador do cliente cumpre a obrigação acessória; se ele não cumpre, o cliente perde dispensa |
| **`EST`/`FTC`** | sem estoque não há falta prevista nem consumo de insumo; o restaurante opera, mas às cegas |
| **`CMP`/`ENT`** | restaurante só de salão opera sem (`RN-RES-008`); quem tem retirada ou entrega, não |
| **`ADQ`/`PGO`** | `LACUNA-NUC-006` (domínio de meios de pagamento) já trava a regra; sem eles, cartão é fluxo externo ao PDV |
| **`REL`** | o cliente exporta o próprio dado por `PN-10`; relatório elaborado, não |
| **Verticais `PST` e `VAR`** | nenhum: o produto é geral por construção. O risco é do outro lado — vender antes de a receita ter spec de vertical |

## 10. Dívidas declaradas que o corte não resolve

1. **Turno segue recusado por default** (`LACUNA-NUC-007`, humano: "não sei ainda"); o **fechamento de
   dia** saiu da dívida em 2026-08-23 (`RN-NUC-031`). É a última contradição com `PN-01` no núcleo.
2. **`service_mode` sem `RN`** — piso do documento fiscal.
3. **Observação das três cadências de especificação fiscal sem dono** — trabalho contínuo, nosso.
4. **Fila de pendências de `EMI` sem superfície e sem papel** — a regra existe, o lugar não.
5. **Instrumento jurídico de custódia de credencial** (`LACUNA-EMI-001`) — contrato, não código, e
   precisa existir antes do primeiro cliente.
6. **Gates agendados e não cumpridos:** `seguranca` sobre `PCF`/`ATI` e sobre o modelo da Fase 1;
   `performance` sobre as 23 grandezas de `offline-grandezas-e-orcamento.md`.

---

## PERGUNTAS: para humano

O corte acima é **proposta**. Nada dele está aprovado. Das seis perguntas que mudam o desenho, a
segunda foi **resolvida em 2026-08-24 (T-0005)**; as outras cinco seguem abertas — a numeração não
muda, para manter a referência estável:

1. **Confirma o MVP 1 da §4** — plataforma, `NUC`, `OFF`, autorização, `FIS`, `EMI` (bloco mínimo),
   `PER`, `MSA`, `COZ`, `RES` — e **confirma que `PCF` e `ATI` ficam para o subsequente**, apesar de
   terem sido nomeados no pedido?
2. **RESOLVIDA (2026-08-24, T-0005): Opção B.** O MVP 1 não constrói emissão própria; `FIS` entra
   ativo (compõe o tributo certo por item/venda) e `EMI` fica módulo plugável, desligado por padrão
   para o perfil-alvo inicial (interior), ativável por outro cliente depois — é config por
   cliente/tenant, não característica do MVP inteiro. Condição: as três reservas de modelo da §5.3
   (numeração, congelamento/grão, âncora documental) entram na Fase 1 mesmo com `EMI` desligado. **Esta
   resposta não substitui a pergunta 3** (`D-05`): `D-05` segue aberta e trava a modelagem de `FIS`
   independentemente desta decisão de escopo de emissão.
3. **`D-05`** — onde mora o catálogo de regra fiscal: `platform`, replicado por schema, ou artefato
   versionado que acompanha o release? Sem isso `FIS` não entra na Fase 1.
4. **Confirma a reclassificação de piso** da §2.3, item por item — principalmente `CAP-PER-001` e
   `CAP-MSA-001`, que passariam a ser piso dos módulos donos em vez de diferencial na fila? Ou recusa
   alguma delas com argumento?
5. **`LACUNA-NUC-007` (turno)** — **o que é turno**: escopo de responsabilidade próprio ou a sessão de
   caixa? Sem a resposta, abrir e fechar turno fica recusado por default e isso vai para o release. O
   fechamento de dia já não está nesta pergunta (`RN-NUC-031`, 2026-08-23).
6. **`LACUNA-GLO-001`** — o fuso que decide vigência, "hoje", turno e fechamento é o do
   **estabelecimento** ou o do **cliente**? A Fase 1 precisa disso antes de modelar tempo.

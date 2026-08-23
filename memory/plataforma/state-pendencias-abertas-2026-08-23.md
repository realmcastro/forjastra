---
name: state-pendencias-abertas-2026-08-23
description: a fila do que falta depois de T-0001..T-0004 — uma pauta única para o humano em quatro blocos (frases de regra · células a valorar · decisões de arquitetura · comercial e legal), ordenada por alavanca, mais os resíduos com dono; cada linha sai daqui ao ser resolvida, e o registro inteiro quando esvaziar
type: state
escopo: plataforma
camada: processo
data: 2026-08-23
tarefa: T-0004
---

Substitui a versão de T-0003 (mesma data). A **narrativa** está nas fichas `T-0001` a `T-0004`
(relatórios verbatim) e nos `## Fechamento` delas — não se repete aqui.

**Por que a pauta é uma só:** T-0004 previu que cinco dos sete passos gerariam pergunta ao humano, e que
despejar quinze perguntas soltas **aumentaria** o bloqueio. Aumentou. Cada item abaixo está na **forma em
que se responde**, e nada avança por cima dele.

**Os cinco de maior alavanca, em ordem, atravessando os blocos:**
`LACUNA-NUC-038` (3.1 — perde valor **todo dia**) → `D-04` + **dinheiro** (3.2 e 3.3 — a Fase 1 não abre)
→ `D-06` (ii) (3.4 — a primeira migration não é escrevível) → **terminal-alvo** (3.5 — o mais barato de
todos, e destrava toda medição) → `LACUNA-NUC-037` (2.1 — uma linha de tabela solta seis relatórios).

---

## 1. Frases de regra — três frases, e são o que hoje mantém o escopo `provedor` inoperante

Nenhuma é valor de célula, nenhuma é número. As três moram em `docs/produto/matriz-operacao-papel*.md`,
que os agents desta ficha foram proibidos de tocar.

- **1.1** `RN-NUC-026` e `RN-NUC-039` passam a **nomear a matriz do escopo `provedor`** (default negado e
  precedência da célula sobre a prosa)? Hoje as duas estão escritas sobre "as duas matrizes" e "os cinco
  papéis": apontar para elas de um escopo novo importa a **citação**, não a trava
  ([[gotcha-a-trava-que-nunca-cai-nao-e-a-inercia]], item 3).
- **1.2** `RN-NUC-029` admite a **quarta fonte** — "papel de escopo `provedor`, nomeado, com o
  cliente-alvo resolvido no próprio registro"? Sem ela existe regra que proíbe o valor errado e **nenhum
  valor certo possível** ([[gotcha-o-caso-de-falha-do-mecanismo-novo-e-o-primeiro-lugar-a-olhar]]).
- **1.3** Sem 1.2, **nenhum papel nosso pratica ato nenhum**. Confirma que esse é o desfecho declarado até
  a frase existir? (É o desfecho correto; a pergunta existe para ele não ser tratado como defeito.)

## 2. Células a valorar — uma passada só, valor de célula é seu (`RN-NUC-026`)

A folha é `docs/produto/matriz-celulas-a-valorar.md`. **Atenção que decide se a contagem mente:** célula
**em branco** não é `?` — `?` é valor e **conta** nas 43 de 380 de `matriz-operacao-papel-modulos.md` §8;
branco é linha inexistente. Somar a folha àquela contagem produz número falso **sem sintoma**
([[convention-celula-candidata-e-especie-diferente-de-celula-valorada]]).

- **2.1 `LACUNA-NUC-037` — a de maior alavanca do repositório, e agora tem forma.** `REL` não tem **uma
  única** célula em nenhuma das três matrizes: seis relatórios especificados, todos negados a todos,
  porque prosa não concede. As duas linhas candidatas existem (§2 da folha: `L1` escopo estabelecimento,
  `L2` escopo cliente × 5 papéis + `Offline`). **Destrava com 12 valores.** Mudou desde T-0003: não falta
  mais desenhar a linha, falta valorá-la.
- **2.2 As 14 linhas do escopo `provedor`** (§1 da folha: 8 de leitura, 6 de ato × 3 papéis = **42**),
  mais **14** de `Sem contato`. Escrito sem valorar: nenhum papel nosso porta autoridade retida, logo hoje
  não há fundamento para valor diferente de `recusa` em nenhuma linha de `Sem contato`.
- **Total da folha: 52 células de papel + 16 de comportamento sem contato.** Duas linhas nasceram sem
  pedido e cada uma tem um obstáculo antes da valoração: **R7** (ler a nossa própria trilha — valorá-la
  em qualquer papel existente é dar a alguém a auditoria do próprio alcance; é `PRV-09` com forma) e **R8**
  (exportar — é o veículo clássico de sair do escopo com o dado inteiro num arquivo).
- **2.3 Herdado de T-0003, e é célula:** o ato ordinário tem **nove linhas ou dez**? E **alguma linha de
  módulo é ato ordinário**? Hoje nenhuma célula de módulo carrega `terminal+ident` — é o `AUT-17`, que
  segue **aberto**.
- **2.4 `LACUNA-EMI-015`** — divergência **inversa**: a lacuna diz que conceder/usar a capacidade de
  assinar "falha fechado", e as células dão `R` a `fiscal_officer`. Toca `D-03`; pode virar `BLOQUEIO`.

## 3. Decisões de arquitetura

- **3.1 `LACUNA-NUC-038` — a única que perde valor todo dia.** O fato de ciclo de vida do pedido (aberto,
  item lançado e retirado, retirado, abandonado) pode existir, revogando o "nada sobe" de `RN-NUC-003`
  infeliz (c)? O mecanismo proposto preserva `RN-NUC-001` inteira. **Não é retroativa**: cada dia sem a
  decisão é fato que não volta, e o ramo "não" torna a hipótese offline **infalsificável**
  ([[gotcha-zero-venda-nao-se-distingue-de-terminal-morto]]). Se a resposta for "não", o piso (contagem de
  pedidos mortos, com primeiro e último instante) salva **um** dos sete itens perdidos.
- **3.2 `D-04`** — convenção de PK, timestamps e soft delete. **A Fase 1 não abre.** Ganhou uma resposta
  parcial por eliminação: **nenhum fato desta família é soft-deletable**.
- **3.3 Representação de dinheiro — não existe registro nenhum, e `.claude/rules/dados.md` §3 a exige.**
  Inteiro em centavos **ou** `numeric(14,2)`: uma escolha, para todo o sistema, registrada como `decision`.
  **Não está em `D-04` e não está na tabela do `CLAUDE.md` §8.** Não bloqueia grão (as duas são neutras de
  grão); **bloqueia a primeira DDL**. Ao lado dela, a mesma classe de risco sem mitigação boa: a **escala
  da quantidade** (combustível e granel exigem casas decimais; aumentar escala depois é mudança de tipo em
  tabela grande, ciclo de quatro etapas em N schemas) — escolher pela vertical mais exigente **conhecida**,
  nunca pela primeira.
- **3.4 `D-06` — são três residências, e a (ii) não pode ficar aberta para a Fase 1.**
  ([[decision-d-06-sao-tres-residencias-nao-uma]]) (i) o agregado que soma clientes · (ii) **a trilha dos
  nossos atos e leituras** · (iii) a observação de operação por cliente. A (ii) não pode morar no schema do
  cliente (sai com ele) e é decomponível por construção; e `migrations.md` §7 proíbe uma migration misturar
  `platform` e cliente, então **a primeira migration da família de fatos não é escrevível** enquanto ela
  estiver aberta. Duas rotas independentes chegam a isso (custo de fan-out; proibição do ledger).
- **3.5 Terminal-alvo — o item mais barato desta pauta, e destrava toda medição.** Qual é o hardware de
  referência? Sem ele nenhuma medida de caminho crítico é reprodutível nem comparável entre releases, e o
  freio "custo medido" — o **único** freio legítimo a decisões irreversíveis de grão — fica **inalcançável**,
  o que faz o grão ser decidido por default no primeiro código.
- **3.6 `D-03`, agravada por mutação.** O humano que opera em mais de um cliente é caso de **borda** ou de
  **venda**? Borda → opção **C**; venda → **B**, assumindo **por escrito** que o isolamento passa a ser
  garantido por **verificação** em vez de por construção. **O que mudou em 2026-08-23:** não é mais só ler
  no cliente errado, é **escrever** no cliente errado — irreversível pelas regras append-only e alterando
  a fatura. E o terceiro eixo já perdeu uma opção: para papel nosso, o cliente-alvo **não vem do pedido**
  (`PRV-15`, já registrado em [[decision-d-03-sao-tres-eixos-nao-uma-decisao]]).
- **3.7 O fuso — mudou de urgência, não de dono.** Fuso do **estabelecimento** ou do **cliente**? Resolver
  mexe em `.claude/rules/dados.md`, território seu. **O que mudou:** a família de fatos sobrevive fechando
  para **qualquer** lado, porque nenhum fato carrega campo de calendário
  ([[convention-fato-nao-carrega-campo-de-calendario]]). Deixou de ser irrecuperável e passou a ser caro:
  **nenhuma leitura por hora, dia, mês ou turno é publicável** enquanto o dono da hora não existir.
- **3.8 `D-01`/`D-02`** — arranjo **B** (código-base único, cascas por alvo) ou **D** (web única +
  acompanhante nativo no Windows)? Servidor em Go, com o risco nomeado? **Nenhum código de produto** sai
  antes. Pergunta acrescentada por T-0004: **o console do provedor é o mesmo produto ou outra aplicação?**
- **3.9 `D-05`** — onde mora o catálogo de regra fiscal, e **ela ainda não está na tabela do `CLAUDE.md`
  §8**. `FIS` não é modelável ([[decision-d-05-catalogo-de-regra-fiscal-sem-casa]]).
- **3.10 Orçamento do console.** Ele cede ao caminho crítico do caixa como a drenagem cede (`RN-OFF-030`)?
  Hoje a hipótese viva é que ele leia a **mesma instância** que atende o caixa. Entra em `D-06`.
- **3.11 Números, todos com unidade declarada e sem valor** — e os três primeiros **se decidem juntos ou
  nenhum protege nada**:
  - **contribuição máxima** de um cliente numa grandeza agregada (fração) e **`N` mínimo** de clientes
    para um agregado ser retido. Enquanto não existirem, **nenhum agregado é apresentável**, e isso é
    desfecho, não pendência ([[gotcha-agregado-e-seguro-por-concentracao-nao-por-n]]).
  - **retenção por classe** (`LACUNA-NUC-040`) e **teto de janela de leitura** (`LACUNA-REL-001`): o mesmo
    número por dois lados, e `RN-NUC-049` agora os obriga a fechar na **mesma passada**. Consequência
    imediata e correta: **nenhuma leitura com janela declarada é publicável** antes de a retenção existir —
    inclusive o acompanhamento semestral que você pediu. Diga em que **relógio** cada classe está
    ([[convention-retencao-tem-tres-relogios]]).
  - **prazo da trilha após o cliente sair** (`PN-10` × `LACUNA-PRV-006`) e **prazo do relógio
    discricionário** (recusa, conectividade, periférico, sincronização).
  - **teto de fato de diagnóstico retido no terminal** (`LACUNA-NUC-039`) e **espaçamento de retentativa
    de operação recusada** — este último governa a cardinalidade da tabela mais volumosa da Fase 1 e
    **segue sem dono declarado**.
  - **janela do binário "módulo contratado e não usado"** (`LACUNA-PRV-013`) — e a pergunta de dentro: é
    **uma** janela ou **três**, porque a tolerância difere para oferecer treino, retirar o módulo e parar
    de cobrar?
  - **limite de erro de uma antecipação** (`CAP-REL-001`): existe default nosso, ou a capacidade não liga
    até o cliente declarar o dele?
  - **`LACUNA-OFF-017`** — prazo da habilitação a vender: curto demais para de vender quem tem link ruim;
    longo demais deixa o terminal furtado vendendo.
  - **unidade de uma leitura corrente** (`LACUNA-PRV-011`) — não é número, é definição, e sem ela o painel
    ao vivo não é especificável ([[gotcha-artefato-corrente-colide-com-trilha-por-ocorrencia]]).
- **3.12 Herdado, sem mudança:** **MVP** — confirmar ou alterar o corte de `docs/produto/roadmap-de-modulos.md`,
  com o custo da emissão própria à vista; e **turno** — respondido "não sei ainda / depende do cliente",
  e é por isso que metade de `LACUNA-NUC-007` segue aberta.

## 4. Comerciais e legais

- **4.1 Com advogado — a base do dado pessoal de cliente-final.** Em que base **nós** alcançamos o dado
  pessoal de quem **não assinou o nosso contrato**? O estabelecimento **não pode consentir em nome dele**.
  Nenhum agent afirmou base legal e nenhum citou norma. **Enquanto não houver resposta, `RN-PRV-008` está
  inerte** — nenhuma interação nossa com cliente-final acontece, e por consequência dois achados não têm
  caminho hoje. A resposta destrava sem revogar nada.
- **4.2 Com advogado — o cliente-final tem de saber que quem fala não é o estabelecimento?**
- **4.3 O cliente tem direito ao NOME da pessoa nossa** que agiu no ambiente dele, ou só ao papel e a um
  identificador? Ninguém tinha perguntado, e a resposta decide se a partição proposta em `D-06` (o efeito
  do ato no schema dele, a autoria do nosso lado) **fecha ou não**.
- **4.4 Quem, do nosso lado, lê a trilha do nosso próprio uso?** (`PRV-09`) A regra exige que não seja quem
  porta o alcance auditado, e os dois candidatos existentes não servem. Sem leitor nomeado a regra não se
  escreve — e é isto que hoje torna **nenhum** papel nosso atribuível.
- **4.5 "Sugerir melhoria" é interno ou vendável?** (`LACUNA-PRV-004`) A resposta "vendável" **reabre** uma
  recusa datada: a de o `provedor` ser escopo de capacidade no catálogo.
- **4.6 Quem confirma mudança de módulo que altera cobrança?** (`LACUNA-PRV-003`) O administrador geral, o
  cliente notificado, ou o cliente confirmando? Até responder, a operação é **negada a todos**.
- **4.7 O sujeito nosso é funcionário, sócio ou terceiro?** (`LACUNA-PRV-001`) · **o que observamos avisa
  ou é consultado?** (`LACUNA-PRV-005`) · **de quem é a responsabilidade** por decisão que o cliente toma a
  partir de número **nosso** errado? (`LACUNA-PRV-007`) · **"plano" é objeto próprio ou é o conjunto de
  módulos ativos?** (`LACUNA-PRV-012`) · **o cliente vê os mesmos fatos que nós vemos sobre ele, ou um
  subconjunto** — inclusive a nossa classificação de "defeito nosso"? (`LACUNA-PRV-008`) · **a tentativa
  nossa recusada é legível por ele?** (`LACUNA-PRV-009`)

---

## 5. Resíduos com dono (não são pauta do humano)

- **`seguranca`** — achados de T-0004 **abertos e declarados**: `PRV-07` e `PRV-08` (sem caminho hoje pela
  inércia de `RN-PRV-008`, o que fecha o caminho sem fechar o defeito), `PRV-09` (espera o leitor de 4.4),
  `PRV-16` (parcial: a forma binária entrou onde o achado pediu e o achado segue citado como aberto). Mais:
  as **20 células de ato fiscal irreversível** nunca foram auditadas uma a uma (confissão de escopo do
  próprio auditor), e o gate de `PCF`/`ATI` está **agendado e não cumprido**.
- **`produto`** — `RN-NUC-047` e `RN-NUC-048` são regras de **núcleo** morando no conjunto de *fatos*, e
  `RN-PRV-021` está longe da casa natural dela: quem for atrás não as encontra por vizinhança. Resíduo de
  prosa: `RN-EMI-040` e `LACUNA-NUC-011` ainda dizem "operação da plataforma". `RN-ATI-015` e `RN-ATI-017`
  seguem sem lista enumerada. Arquivos no teto: `catalogo-de-capacidades.md` (390),
  `verticais/restaurante.md` (400), `fiscal-custodia-e-trilha.md` (400), `glossario.md` (396),
  `roadmap-de-modulos.md` (398) — o próximo acréscimo em qualquer deles exige partir por eixo.
- **`ui`** — `docs/design/vocabulario-e-eixos.md:377` aponta para `state-sessao-2026-08-22-...`, que foi
  **removido** em 2026-08-23; a referência ficou pendurada. E falta **papel de bloco para entrada de
  comando por teclado** — id novo, nunca variante, slot da zona crítica com ordinal fixo.
- **`ui` (consulta, não tarefa)** — qual **espaço** o console do provedor habita? Nenhum dos quatro
  espaços declarados é ele: é trabalho de escritório, teclado, sessão longa, sem pico e sem alvo de toque
  apertado.
- **`arquiteto-dados`** — o grão dos fatos de **módulo** (`MSA`, `COZ`, `PCF`, `PER`, `EMI`) não foi
  julgado porque `produto` não os enumerou. Um despacho por módulo; o de `COZ` (tempo de produção por
  ponto) é o que vai faltar primeiro.
- **humano / thread** — o PDF `Forja-Relatorio-2026-08-22.pdf` na raiz **não contém a auditoria de
  segurança** e não diz que o gate estava aberto quando foi gerado. As fontes morreram com a sessão:
  regerar é refazer. Não entregar aos sócios documento que sugere gate cumprido.

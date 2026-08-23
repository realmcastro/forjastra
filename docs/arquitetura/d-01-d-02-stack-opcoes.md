# Dossiê de decisão — D-01 (backend/ORM) e D-02 (cliente/framework)

> **Não é decisão.** É a decisão **montada** para o humano tomar. `CLAUDE.md` §8 continua com D-01 e
> D-02 **ABERTAS** até ele dizer o contrário, e quem edita aquela tabela é o thread principal.
> **Datado: 2026-08-22.** Nenhuma fonte externa foi aberta nesta passada — por isso **toda** afirmação
> sobre capacidade de plataforma que dependeria de verificação externa está em `## LACUNAS`, com a
> pergunta exata, e **não** aparece como fato no corpo. Este é o risco número um deste documento:
> capacidade de navegador e de sistema operacional muda de versão, e afirmação confiante sobre ela
> envelhece em silêncio. Nenhum número de desempenho de linguagem, biblioteca ou runtime aparece aqui.
> Prefixo `LACUNA-STK-` é local deste dossiê e não pertence à numeração de `docs/produto/**`.

## A resposta direta

**"Um binário para os três alvos" não sobrevive aos requisitos que este projeto já escreveu.** O que
o mata não é preferência técnica nem maturidade de framework: é que **dois requisitos de produto já
aprovados exigem, no terminal, capacidade que a caixa de areia do navegador não concede a uma
página** — e "um binário para os três" só é verdade se o alvo web carregar o mesmo núcleo.

1. `RN-OFF-021` — o conteúdo da fila em repouso é **ilegível fora da aplicação**, com o dispositivo em
   mãos e a aplicação fechada (`docs/produto/fila-local-conteudo-e-repouso.md:34`).
2. `RN-EMI-033` + `RN-EMI-027` — o ato de **assinar** documento fiscal acontece **no ponto de emissão**,
   sem rede, e a contingência off-line é *gerar, assinar e imprimir* num só passo
   (`docs/produto/fiscal-custodia-e-trilha.md:127`, `docs/produto/fiscal-emissao-contingencia.md:217`).

O que **sobrevive** é diferente e é melhor do que parece: **um código-base**, com **camadas de
capacidade por alvo**, e o corte não é por formato de tela — é por **custódia** (§3.1). Nessa leitura,
o humano ganha dois dos três coelhos com uma cajadada só e o terceiro fica pequeno em vez de
desaparecer. Existe ainda um arranjo (§3.3, **D**) em que a interface é **uma só** para os três e o que
é nativo encolhe para um serviço acompanhante no Windows — ele é o mais próximo do que foi pedido, e
tem custo próprio declarado.

---

## 1. Os requisitos que decidem

Esta seção é o filtro. Ela vale mais que as opções: é ela que elimina, e é contra ela que §2 e §3 são
avaliadas. Cada linha já é regra aprovada, não desejo deste documento.

| # | Requisito | Origem | O que ele elimina |
|---|---|---|---|
| **R-01** | Conteúdo da fila **ilegível em repouso** fora da aplicação: outro programa, outro usuário do dispositivo, mídia retirada, dispositivo revendido. Alteração é **detectável**. | `fila-local-conteudo-e-repouso.md:34` (`RN-OFF-021`) | qualquer alvo cujo armazenamento local seja legível por quem tem o arquivo, e qualquer alvo sem custódia de chave fora do alcance de outro programa |
| **R-02** | O ato de assinar acontece no **ponto de emissão**, como capacidade com escopo, prazo, revogação imediata e **contagem por uso**, com trilha por ato. | `fiscal-custodia-e-trilha.md:127` (`RN-EMI-033`), `:154` (`034`), `:174` (`035`), `:216` (`037`) | alvo que não consegue assinar sem rede; alvo que não consegue **contar e reter trilha** do ato localmente; alvo em que a capacidade só existiria como credencial exportável |
| **R-03** | Contingência off-line é **gerar + assinar + imprimir** sem autorização prévia, transmitindo depois. Assinar é **parte** dela, não passo posterior. | `fiscal-emissao-contingencia.md:217` (`RN-EMI-027`) | separar "assino no servidor, imprimo no terminal": em D1/D3 não há servidor |
| **R-04** | Impressão do documento e do comprovante no terminal, com periférico que **não é pré-condição** da venda (falha degrada, não bloqueia). | `postura-nova-geracao.md:305` (`PN-18`), `RN-EMI-017` | alvo que só imprime pelo diálogo de impressão do hospedeiro, sem controle do desfecho de falha |
| **R-05** | **Faixa pré-alocada por terminal**, obtida com conexão e consumida offline sem consultar ninguém; número não se reusa e faixa não usada tem desfecho declarado. | `operacao-offline-e-sincronizacao.md:76` (`RN-OFF-006`), `RN-EMI-022` | alvo cujo armazenamento local pode ser **descartado pelo hospedeiro** (limpeza, pressão de espaço, modo privado): descarte de faixa é número fiscal queimado |
| **R-06** | Recurso local no limite → **para de aceitar fato novo**; nada não-confirmado é apagado, compactado com perda, sobrescrito ou rotacionado. | `operacao-offline-e-sincronizacao.md:199` (`RN-OFF-015`), `fila-local-...:54` (`RN-OFF-022`) | igual a R-05: durabilidade **não** best-effort, e a saída do item é por **confirmação**, nunca por tempo ou espaço |
| **R-07** | Identidade de idempotência **cunhada no terminal**, offline, sem servidor, estável entre reenvios; formato é **D-04**. | `operacao-offline-e-sincronizacao.md:185` (`RN-OFF-013`) | nada (todo alvo faz isso) — está aqui porque é o requisito que as pessoas confundem com os difíceis |
| **R-08** | Drenagem **não compete com o caixa**: o orçamento do caminho crítico vale com a **fila no teto e drenando**; drenagem interrompível na fronteira de agregado; contagem de pendências é **estado mantido**, não consulta por apresentação. | `offline-grandezas-e-orcamento.md:54` (`RN-OFF-030`), `.claude/rules/performance.md` §3 | alvo que só executa enquanto uma janela está aberta e em foco; arquitetura sem trabalho de fundo com prioridade cedível |
| **R-09** | Ordem é **por agregado**, nunca fila global; agregado travado nunca bloqueia o resto; rejeição definitiva sai da fila para lista de trabalho. | `operacao-offline-e-sincronizacao.md:164` (`RN-OFF-010`), `:178` (`012`) | fila como lista simples; retentativa infinita; descarte silencioso |
| **R-10** | **Quatro classes** de convergência e **três domínios** de falha (D1/D2/D3), com default de **recusa** para operação não classificada; "última escrita ganha" é recusado. | `operacao-offline-e-sincronizacao.md:23`, `:58`, `:91` (`RN-OFF-008`) | linguagem/arquitetura em que enumeração fechada não é verificável: o default é *falha fechado* e precisa ser garantido, não lembrado |
| **R-11** | SDUI: manifesto é **entrada não confiável**, parse tolerante que **nunca lança**, **despacho tipado** (proibido mapa `kind → Component` genérico), degradação rede → cache local → piso embutido, string da rede **nunca** executada. | `.claude/rules/ui.md` §1, `CLAUDE.md` §7.4/§7.5 | catálogo resolvido por reflexão/string; qualquer alvo cujo mecanismo natural seja interpretar expressão vinda do servidor |
| **R-12** | **Quatro espaços** de desenho com alvo, piso de texto, interação e densidade **diferentes**; E4 sem toque; E3 proíbe `compact` e o hardware é do cliente-final; teclado e leitor de código são **primeira classe** e todo o caminho de venda fecha sem tocar a tela. | `docs/design/grade-e-espacos.md:197`, `:326`, `postura-nova-geracao.md:105` (`PN-05`) | "uma tela que escala": E4 **não** se deriva de E1 por escala; e alvo com piso absoluto brigando com fluidez é conflito declarado (`grade-e-espacos.md:359`, C-03) |
| **R-13** | Postgres, **um schema por cliente**, nenhuma consulta cruza schema, consolidado nunca é `JOIN` entre schemas; tenant resolvido **uma vez, na borda, da identidade autenticada**; `search_path` **não é segurança**. | `memory/plataforma/decision-tenancy-schema-por-cliente.md`, `.claude/rules/dados.md` §1, `.claude/rules/backend.md` §1 | ORM/camada de dados que assume **um** schema fixo em configuração ou em tempo de compilação sem rota de resolução por requisição |
| **R-14** | Migration **forward-only**, idempotente, roda **N vezes** (uma por schema), **retomável** por `(schema, version)`, ledger com `checksum` que detecta edição, `lock_timeout` **sempre**, `CREATE INDEX CONCURRENTLY` fora de transação, backfill fora do DDL. | `.claude/rules/migrations.md` §1–§6, §10 | motor de migration de ORM que grava um ledger por banco, aplica em um alvo só, e não sabe retomar no schema 7 de 20 |
| **R-15** | Módulo **plugável**: capacidade ligada/desligada é lida do registro em `platform`, nunca inferida de tabela existente; módulo não importa módulo. | `.claude/rules/backend.md` §2, `CLAUDE.md` §7.2 | arquitetura em que a fronteira de módulo é convenção de pasta, sem contrato verificável |

Leitura obrigatória das linhas: **R-01, R-02, R-03, R-05 e R-06 são requisitos de plataforma, não de
interface.** É neles que D-02 se decide. R-13 e R-14 são onde D-01 se decide — e note que **nenhuma
das duas linhas fala de linguagem**: as duas falam de **camada de dados**.

---

## 2. Backend

### 2.1 O que R-13 e R-14 pedem da camada de dados — e o que ela não pode fazer

Isto vale para **qualquer** linguagem escolhida, e é a metade de D-01 que costuma ser esquecida
(`.claude/rules/backend.md` diz que D-01 inclui ORM/query builder):

- **Schema por requisição, resolvido na borda.** A camada de dados precisa de um caminho para
  executar a **mesma** consulta contra `t_<slug>` diferentes, sem que o schema apareça em nenhum lugar
  que o chamador controle. Concatenar nome de schema em string é proibido (`00-nucleo.md` §8), e
  identificador não é parametrizável em SQL — logo o schema entra por **vínculo da conexão** ou por
  **qualificação estática gerada**, nunca por interpolação de valor recebido.
- **`search_path` é conveniência, não fronteira.** `dados.md` §1 é explícito. Consequência prática: se
  o único mecanismo de isolamento em execução for `search_path`, um defeito de código que qualifique
  o schema errado atravessa a fronteira sem nada barrando. A pergunta de desenho que decorre disso —
  **papel de banco por cliente, com `GRANT` que torne o vazamento impossível no servidor de banco e
  não só no nosso código** — é de `arquiteto-dados` e `seguranca`, não minha (§7).
- **Sem migration de ORM.** R-14 exige ledger por `(schema, version)` no `platform`, `checksum` que
  para tudo ao divergir, retomada no meio da fila de schemas, `lock_timeout` na sessão e uma migration
  não-transacional isolada para índice concorrente. Nenhum desses cinco é o modelo de trabalho de um
  motor de migration acoplado a ORM, que assume **um** alvo e **um** ledger. Portanto: **o executor de
  migration é nosso**, em qualquer stack, e o insumo dele é SQL versionado — que é exatamente o que
  `migrations.md` já manda entregar enquanto D-01 está aberta. Isso **elimina o principal argumento de
  venda** de vários ORMs.
- **Dinheiro e quantidade.** `dados.md` §3 proíbe `float` e pede inteiro em centavos **ou**
  `numeric(14,2)` (uma escolha só, registrada), e quantidade `numeric` com escala declarada — 3 casas
  em granel/combustível. A camada de dados precisa levar `numeric` até o domínio **sem** passar por
  ponto flutuante em nenhum degrau (driver, serialização, contrato de API, manifesto SDUI).
- **O que ela não pode fazer:** deduzir tenant de qualquer coisa que veio na requisição; aceitar
  operação de dados com tenant ausente caindo em default (`backend.md` §1); e cruzar schema, inclusive
  em relatório — consolidado é agregação no `platform` (R-13).

### 2.2 Go contra os requisitos

**Onde ele resolve bem, e é honesto dizer que resolve:**

- **R-08 e `RN-OFF-031`** (a soma de pendências drenando ao mesmo tempo em N clientes × M terminais) é
  o problema mais bem servido por Go neste sistema: é um problema de **concorrência controlada e
  cancelável** — leque de trabalhadores por agregado, limite global, prioridade cedível ao caminho
  crítico, interrupção na fronteira de agregado sem perder progresso. É o feijão com arroz da
  linguagem, com cancelamento propagado por contexto explícito, e o cancelamento é **o** requisito de
  R-08(b).
- **R-13/R-14 na prática:** a comunidade Go convergiu para acesso a Postgres **SQL-primeiro** — o que
  significa que o desenho que R-14 exige (SQL versionado + executor próprio) é o **caminho normal**
  ali, não a exceção que se paga com atrito contra o framework. Driver nativo de Postgres maduro, sem
  dependência de C, é fato verificável no ecossistema; **não afirmo nada sobre desempenho dele** (não
  medi, e `00-nucleo.md` §4 proíbe).
- **Operação:** binário estático único, sem runtime a instalar no servidor, torna
  `PN-19`/reprodutibilidade de instalação um problema menor, e o custo de operar N schemas com um
  processo enxuto é baixo em esforço humano — que é o recurso escasso aqui.
- **`00-nucleo.md` §8 e `coder.md` §3:** erro explícito em cada fronteira combina com "erro nunca é
  engolido". Nesta base de regras isso é vantagem, não cerimônia.

**Onde ele cobra caro, especificamente neste projeto:**

- **R-10 e R-11 pedem enumeração fechada verificada pelo compilador, e Go não tem.** Este repositório
  é feito de enumerações fechadas: quatro classes de convergência, três domínios de falha, três
  desfechos por domínio (`RN-OFF-002`), estados do documento fiscal, sete itens que a fila nunca
  contém (`RN-OFF-023`), vocabulário fechado de blocos SDUI. Sem tipo-soma e sem verificação de
  exaustividade, **nenhuma** dessas listas ganha um erro de compilação quando alguém acrescenta um
  caso e esquece um lugar. O default é *falha fechado* (`RN-OFF-008`), e falha fechado precisa ser
  **garantido**, não lembrado. Isso é mitigável (fronteira de despacho única, teste de exaustividade
  gerado, `default` que recusa), mas é **trabalho recorrente de disciplina** e ele deve ser orçado
  como tal, não descoberto depois.
- **Dinheiro sem tipo nativo.** `numeric`/decimal exato é dependência externa ou inteiro em centavos
  disciplinado à mão. Combina com `dados.md`, mas a proibição de ponto flutuante passa a ser vigilância
  de revisão em cada conversão, inclusive na serialização do contrato.
- **O custo grande: Go não é o cliente.** Escolher Go no servidor é escolher **duas linguagens** no
  produto, porque nenhum dos quatro espaços de R-12 tem em Go um caminho de interface que eu recomende.
  Consequência concreta, e é a que dói: o **núcleo do cliente** (fila, cunhagem de identidade,
  faixa, repouso confidencial, trilha do ato, máquina de drenagem — R-01 a R-09) é o software mais
  difícil deste sistema, e ele **não** será código compartilhado com o servidor. Toda regra de
  convergência existirá em dois lugares, em duas linguagens, e a divergência entre elas é um defeito
  que aparece como venda duplicada ou fila que não drena. Mitigação real: contrato executável em
  `packages/contracts` + bateria de conformidade rodada nos dois lados a partir dos **mesmos** casos
  (os cenários `C-01`…`C-10` de `operacao-offline-e-sincronizacao.md` §7 já são essa bateria escrita).
  Isso é orçamento, não observação.

### 2.3 Duas alternativas, para o custo de oportunidade ficar à vista

Não estão aqui para vencer. Estão porque **as duas dissolvem exatamente o custo que fecha §2.2**, e o
humano precisa ver o preço de recusar isso.

- **.NET/C#.** Atrativo único neste projeto: é a plataforma em que o **terminal Windows** (R-01 a
  R-04) e o servidor podem ser **a mesma linguagem**, o que faz o núcleo do cliente virar biblioteca
  compartilhada de verdade. Tem tipo-soma? Não como Rust, mas tem correspondência de padrão com
  verificação de exaustividade em mais casos que Go, e tem decimal nativo — atende R-10 e "dinheiro"
  com menos disciplina manual. Preço: runtime a operar no servidor, ecossistema que empurra para
  ORM com motor de migration próprio (que R-14 obriga a **desligar**, e desligar o motor é abrir mão
  do motivo pelo qual se escolheu o ORM), e cultura de framework mais opinativa — o risco aqui é
  R-13 ser "resolvido" por configuração de contexto por tenant que esconde onde o schema foi decidido.
- **TypeScript/Node.** Atrativo único: é a plataforma em que `packages/contracts` e `packages/sdui`
  podem ser **um tipo só**, compartilhado entre servidor e cliente web/móvel, com união discriminada
  e exaustividade verificada — o que serve R-10 e R-11 melhor que qualquer outra opção desta lista.
  Preço, e é grande: o alvo mais exigente (E1 Windows, R-01 a R-05) fica dependente de um invólucro
  nativo e de módulos nativos para assinatura, periférico e repouso confidencial — ou seja, você paga
  a fronteira nativa **de todo jeito**, só que dentro do alvo que menos tolera surpresa; e o perfil de
  concorrência de R-08/`RN-OFF-031` (leque cancelável com prioridade) é o menos natural dos três.
- **Nota, não opção:** **Rust** é a única stack em que o núcleo do cliente poderia ser **um** artefato
  servindo os três alvos (desktop, biblioteca para móvel, WebAssembly) **e** o servidor, com tipo-soma
  e exaustividade. É a resposta mais forte no papel a R-01…R-11 e a mais fraca em velocidade de equipe
  e contratação. Só entra em pauta se a resposta do humano em §7 sobre tamanho e perfil de time
  sustentar; caso contrário é romance de arquitetura e o custo aparece no prazo.

### 2.4 O que não muda com a escolha de D-01

Independentemente da linguagem: SQL versionado como insumo; executor de migration próprio; ledger em
`platform`; tenant resolvido na borda a partir da identidade autenticada; contrato com tipo explícito
na fronteira e entrada da rede como não confiável; erro com forma única e estável; idempotência com
chave do cliente em tudo que move dinheiro ou estoque; manifesto SDUI como **snapshot** de ids de
vocabulário fechado. Estas linhas são de `backend.md` e de `migrations.md`, não de D-01 — e é por isso
que **D-01 é a mais reversível das duas decisões deste dossiê** (§4).

---

## 3. Cliente — os "três coelhos"

### 3.1 O eixo do corte não é o formato da tela. É a custódia.

O pedido do humano ("móvel, Windows offline, web") nomeia **formatos**. Os requisitos de §1 não se
organizam por formato — se organizam por **o que o dispositivo tem que guardar e poder fazer sozinho**.
A prova está em `RN-EMI-033`: onde o ato de assinar acontece é **atributo declarado** do ponto de
emissão, não característica do aparelho. Um dispositivo de mão declarado como ponto de emissão herda
R-01 a R-06 **inteiros**; uma estação fixa que **não** é ponto de emissão e não retém fila não herda
quase nada. Logo:

| Classe | Quem é | Herda | Formatos que ela ocupa hoje |
|---|---|---|---|
| **Cliente com custódia** — "terminal" | ponto de emissão e/ou detentor de fila local | **R-01 a R-09**, R-11, R-12 | E1 (estação fixa) e E2 quando declarado ponto de emissão |
| **Superfície sem custódia** | não assina, não retém fila, não consome faixa | R-11, R-12 e nada de R-01…R-06 | E3 (dispositivo do cliente-final), E4 (display), retaguarda: fila do dono (`RN-OFF-011`), lista de trabalho (`RN-OFF-012`), gestão |

Esse é o corte que faz o pedido do humano render: **a segunda classe é maior do que parece** — E3, E4 e
toda a retaguarda de `RN-OFF-011`/`RN-OFF-012`/`RN-EMI-028` vivem nela — e ela é servida **muito bem**
pelo navegador, com instalação zero, o que serve `PN-03` (terminal substituível) melhor que qualquer
aplicativo. O problema inteiro se concentra na primeira classe.

### 3.2 Alvo por alvo, contra §1

**Estação fixa em Windows, offline (E1 — o alvo mais exigente e o menos tolerante).** Precisa,
simultaneamente: assinar sem rede (R-02, R-03), imprimir em impressora térmica/fiscal com desfecho de
falha sob nosso controle (R-04), ler código de barras e — se houver — balança (R-12), persistir de
forma **ilegível em repouso e com alteração detectável** (R-01), garantir durabilidade que **não**
descarta fato (R-05, R-06), drenar em plano de fundo com prioridade cedível **sem** janela em foco
(R-08). Nenhum desses seis é requisito de interface. Todos são de plataforma. **É este alvo que decide
D-02**, e as perguntas que faltam sobre ele estão em §7 (A1 vs A3, versão de Windows, modelo de
impressora) — duas delas podem decidir sozinhas.

**Web.** O que o navegador faz bem aqui, e é bastante: toda a segunda classe de §3.1; leitor de código
de barras em modo teclado (é teclado, funciona); interface para os quatro espaços de R-12 com variante
e slot, como `ui.md` já manda. O que eu **não** afirmo que ele faz — e a lista abaixo é o núcleo do
`## LACUNAS`, porque cada item mudou de versão em navegador nos últimos anos e eu não abri fonte
nesta passada: assinatura com o algoritmo que o documento fiscal exige (o dossiê interno registra
XMLDSig RSA+SHA-1 — `docs/arquitetura/fiscal/2026-08-22-dossie-emissao-propria.md` §4 — e disponibilidade
de SHA-1 em API de assinatura de navegador é exatamente o tipo de coisa que foi restringida)
[[LACUNA-STK-001]]; chave privada entregue e retida de forma não exportável, e se isso satisfaz
"capacidade, não credencial estacionada" de `RN-EMI-033` [[LACUNA-STK-002]]; armazenamento local com
**garantia** de durabilidade contra limpeza e pressão de espaço, o que R-05/R-06 exigem
[[LACUNA-STK-003]]; confidencialidade em repouso contra quem tem o arquivo e a aplicação fechada, que
é a letra de R-01 [[LACUNA-STK-004]]; acesso a impressora térmica e a porta serial, e em quais
navegadores [[LACUNA-STK-005]]; execução de plano de fundo suficiente para drenar com a janela fechada
[[LACUNA-STK-006]]. **O que eu afirmo, e é arquitetura, não versão:** R-01 pede confidencialidade cuja
chave esteja fora do alcance de outro programa no dispositivo; uma página não tem custódia de segredo
independente do hospedeiro que a executa; portanto **o navegador só satisfaz R-01 apoiado em algo fora
dele** — cofre do sistema operacional, ou o serviço acompanhante de §3.3(D). Isso não é demérito do
navegador: é a fronteira de uma caixa de areia, e é a mesma fronteira que o torna o alvo **certo** para
E3, onde o hardware é do cliente-final (`grade-e-espacos.md:197`).

**Móvel — e a pergunta que o brief manda responder: qual espaço ele atende de verdade?** **Os dois, e
com requisitos opostos.** E3 é o dispositivo **do cliente-final**, que usa uma vez, não é treinado e
cujo hardware é dele — instalar aplicativo ali é atrito que mata o caso de uso, então **E3 é web, por
requisito, não por conveniência**; e `compact` é proibido lá. E2 é **o mesmo operador** do E1, com o
corpo em movimento e uma mão ocupada, alvo crítico 64 apesar da distância curta — é aplicativo, e
**herda R-01…R-06 se, e somente se, for declarado ponto de emissão ou retiver fila** (`RN-EMI-033`).
Tratar "móvel" como um alvo só é o erro de framing desta decisão: são dois alvos que só compartilham o
formato do aparelho.

### 3.3 Os quatro arranjos

| | Arranjo | Sobrevive a §1? | Onde morre / o que custa |
|---|---|---|---|
| **A** | **Um binário para os três alvos** | **Não** | morre no alvo web, em R-01 e R-02/R-03. Um binário só é "um" se o alvo mais fraco carregar o mesmo núcleo; se o web não carrega, o arranjo já é o **B** com outro nome. Custo escondido: para forçar A, alguém rebaixa R-01 a "confiamos na criptografia de disco do Windows" — o que é rebaixar requisito de produto por conveniência de construção, e `RN-OFF-021` fecha essa porta explicitamente |
| **B** | **Um código-base, núcleo compartilhado, cascas por alvo, camadas de capacidade declaradas** | **Sim** | custo: a camada de capacidade é **contrato**, não `if` — cada alvo declara o que tem, e a superfície sem custódia **não oferece** o que não pode cumprir (falha fechado, `00-nucleo.md` §8). Se essa declaração virar ramificação espalhada, o arranjo degenera em C com aparência de B |
| **C** | **Clientes separados por alvo** | Sim, e é o mais caro | três implementações das regras de convergência de R-09/R-10 → divergência entre elas aparece como venda duplicada ou fila travada. Só se justifica se as respostas de §7 mostrarem times separados por alvo |
| **D** | **Uma interface (web) para os três alvos + serviço acompanhante nativo só no Windows** | **Sim**, e é o mais próximo do pedido | o acompanhante carrega R-01 a R-06 e R-08 (assina, imprime, guarda a fila, consome a faixa, drena com a janela fechada); a interface é uma só para E1/E2/E3/E4 e para a retaguarda. **Custo honesto: você não escapou do alvo nativo — você o encolheu.** Continua havendo código nativo para escrever, instalar e atualizar no Windows, mais uma fronteira local nova entre página e acompanhante, que passa a ser superfície de ataque e precisa de gate de `seguranca` (quem pode falar com ele, como ele autentica a página, o que ele nunca aceita da página). Em troca: uma interface, um vocabulário SDUI, um lugar onde a regra de convergência vive |

**A escolha real está entre B e D**, e ela é uma pergunta única: **a interface do terminal roda dentro
do processo nativo (B) ou dentro de um navegador conversando com um processo nativo (D)?** C é o desfecho
de não decidir.

### 3.4 O que se compartilha em cada arranjo — nomeado

Em **B** e em **D**, o compartilhado é o mesmo conjunto, e ele é grande — o que é o argumento a favor
dos dois: ids do vocabulário SDUI e o contrato de bloco (`packages/sdui`); tipos do contrato de API
(`packages/contracts`); o analisador tolerante do manifesto com guardas nomeadas que **nunca lançam** e
a escada rede → cache → piso (R-11); catálogo de mensagens (nada de texto solto — `ui.md` §3);
formatação de dinheiro, quantidade e fuso por utilitário único; e as **regras** de R-07/R-09/R-10
(cunhagem de identidade, ordem por agregado, classificação e desfecho por domínio).

A diferença: em **B** o núcleo com custódia (R-01…R-06) é **biblioteca** ligada à casca de cada alvo,
e a casca web simplesmente **não** a liga; em **D** ele é **processo** separado, e a interface é a
mesma em todo alvo. Em **C**, o compartilhado se reduz a `packages/contracts` e ao vocabulário — o resto
é escrito três vezes.

**Consequência de deploy que o brief manda declarar:** o catálogo de componentes SDUI é **embarcado no
cliente** (`CLAUDE.md` §7.4), então bloco novo exige deploy do cliente. Em **A/B**, cada alvo tem a sua
versão de vocabulário e elas **divergem** — o terminal atualiza quando o cliente permite parada, o
navegador atualiza ao recarregar. Em **D**, o vocabulário é um só e atualiza junto. Mas atenção ao que
isso **não** muda: `backend.md` §4 já obriga o servidor a nunca supor que o cliente é da última versão,
e o cliente a descartar id desconhecido sem derrubar tela. Ou seja, **a tolerância de versão é
requisito nos quatro arranjos** — "um binário só" economiza operação, não economiza o requisito.

---

## 4. O que a escolha decide depois

**Fica irreversível (ou de reversão caríssima):**

1. **A linguagem do núcleo com custódia.** Ela guarda o **formato da fila em repouso**, o formato da
   identidade cunhada (R-07, e o formato é **D-04**), o livro da faixa consumida e a trilha do ato de
   assinatura. Trocar depois significa **ler o formato antigo** em terminais implantados que podem
   conter venda não confirmada — e R-06 proíbe descartar item não confirmado, inclusive para migrar.
   **É o item mais irreversível deste sistema inteiro**, mais que o schema do Postgres: banco migra com
   `expand/contract` sob nosso controle; terminal offline com fila pendente, não.
2. **O mecanismo de confidencialidade em repouso e a custódia da sua chave** (R-01). Trocar exige
   re-cifrar em dispositivos que podem estar sem contato. `LACUNA-OFF-012` já é isto, aberta em produto.
3. **A fronteira B vs D.** Depois de escolhida, ela define onde vive a regra de convergência e quem
   fala com o periférico. Migrar de B para D é reescrever a casca do terminal; de D para B é reescrever
   a interface no processo nativo.
4. **Os ids do vocabulário SDUI.** `CLAUDE.md` §7.4 e `PN-06`: id publicado é para sempre, e posição de
   ação do caminho crítico é contrato que só muda por decisão registrada.
5. **A escala de `numeric` de quantidade e a representação de dinheiro** (`dados.md` §3) — mas essa é
   D-04/`arquiteto-dados`, não D-01, e é decidida na Fase 1 de todo modo.

**Continua reversível, e não deve travar a decisão:**

- Framework de HTTP, roteador, biblioteca de validação, formato de log, telemetria.
- **A metade "ORM/query builder" de D-01**, desde que SQL versionado seja o insumo e o executor de
  migration seja nosso (§2.1) — trocar o mapeador não toca o banco nem o contrato.
- Hospedagem, forma de deploy do servidor, mecanismo de fila do lado servidor.
- Framework de interface da **superfície sem custódia** (E3, E4, retaguarda) — é a parte mais fácil de
  reescrever do sistema, porque não guarda estado que o negócio não possa perder.
- Sistema de design: `docs/design/**` já nasceu agnóstico, e tokens/grade atravessam qualquer framework.

**Ordem de decisão que decorre disso, e é a única recomendação de processo aqui:** decidir **D-02 antes
ou junto com D-01**, nunca depois. O item 1 acima é o mais irreversível e é de D-02; se D-01 fechar
primeiro em Go, D-02 já herda "duas linguagens" como fato consumado (§2.2, último ponto) — o que pode
até ser a escolha certa, mas precisa ser **escolha**, não consequência.

---

## 5. Recomendação

**Recomendo, e o humano decide.**

**D-01 — Go, com camada de dados SQL-primeiro e executor de migration próprio.** Fundamento: R-08 e
`RN-OFF-031` são o problema de servidor mais difícil que este produto tem, e são o que Go serve melhor;
R-14 já obriga a construir o executor de migration em qualquer stack, o que **anula** a vantagem do ORM
com motor próprio e converte "Go tem ORM fraco" de desvantagem em não-questão; e o custo de operação de
um binário único importa numa carteira de clientes pequenos e médios, que é a premissa da tenancy
(`decision-tenancy-schema-por-cliente.md`). **Risco principal nomeado: R-10/R-11 sem exaustividade
verificada pelo compilador** — o produto é feito de listas fechadas e o default é falha fechado; isso
tem de ser comprado com fronteira de despacho única e teste de exaustividade, orçado desde o começo.
**Segundo risco: duas linguagens no produto**, com a regra de convergência existindo em dois lugares
(§2.2) — mitigável por bateria de conformidade a partir dos cenários `C-01`…`C-10`, mas nunca eliminável.
**Não recomendo Go se** a resposta de §7 indicar equipe pequena com forte domínio de .NET **e** decisão
por terminal nativo em .NET: nesse caso o núcleo compartilhado entre servidor e terminal vale mais que
tudo que Go entrega aqui, e o risco principal passa a ser ORM com motor de migration ligado por inércia.

**D-02 — duas classes de cliente (§3.1), um código-base, e a escolha entre B e D.** Recomendo **B** como
padrão e **D** como candidato sério que depende de duas respostas de §7. Fundamento de B: o alvo E1 é o
menos tolerante do sistema, e em B ele não tem fronteira de processo entre a interface e a custódia —
uma superfície de ataque e um ponto de falha menos, o que importa quando o requisito é *o caixa não
para*. Fundamento de D: se a interface do terminal for a mesma da retaguarda e do E3, você tem **um**
vocabulário SDUI e **uma** implementação dos quatro espaços de R-12 — que é literalmente o pedido dos
três coelhos, com o nativo reduzido a um acompanhante. **Risco principal de B:** o código-base vira
três na prática se a camada de capacidade for `if` em vez de contrato (arranjo C disfarçado).
**Risco principal de D:** a fronteira local página↔acompanhante é uma superfície nova que **exige** gate
de `seguranca` antes de qualquer construção, e um acompanhante mal isolado é o caminho mais curto para
alguém fora da aplicação alcançar a fila que R-01 protege.

**O que eu recuso, com as quatro partes de `00-nucleo.md` §12:** (1) a **necessidade** — atender móvel,
Windows offline e web com um esforço só — é legítima e não se recusa: ela é economia real de construção e
de manutenção, e o humano está certo em exigi-la. (2) O **mecanismo recusado** é "um binário único para os
três", e ele é ruim porque só se realiza rebaixando R-01 e R-02/R-03 no alvo web, ou fingindo que o
terminal Windows é um navegador. (3) O **mecanismo novo** é o corte por custódia (§3.1) com um
código-base e camadas de capacidade declaradas (B ou D). (4) Ele é **melhor** porque entrega a mesma
economia onde ela existe de verdade — E3, E4, retaguarda e todo o vocabulário SDUI, que é a maior parte
das telas do produto — sem gastar uma linha rebaixando o único alvo que não tolera rebaixamento; e se
prova por construção: a superfície sem custódia **não oferece** operação que exija R-01…R-06, então não
existe caminho em que ela finja cumprir.

---

## LACUNAS

Prefixo local deste dossiê. Nenhuma delas é opinável por mim: todas exigem verificação em fonte
primária, na versão-alvo, na data da decisão — e todas são do tipo que envelhece.

| # | O que falta | Pergunta exata | Quem responde |
|---|---|---|---|
| **STK-001** | disponibilidade do algoritmo de assinatura exigido pelo documento fiscal na API de criptografia de navegador na versão-alvo | o par algoritmo+resumo registrado em `docs/arquitetura/fiscal/2026-08-22-dossie-emissao-propria.md` §4 está disponível para **assinar** (não só verificar) nos navegadores-alvo, hoje? | pesquisa, com URL de fonte primária |
| **STK-002** | entrega e retenção de chave privada não exportável em navegador | é possível colocar a chave no navegador sem que ela seja exportável, e isso satisfaz `RN-EMI-033` ("capacidade, não credencial estacionada") com escopo, prazo, revogação e contagem por uso? | `seguranca` + `produto` |
| **STK-003** | garantia de durabilidade do armazenamento local em navegador | existe garantia (não best-effort) de que o hospedeiro não descarta o armazenamento sob pressão de espaço ou limpeza do usuário? R-05/R-06 aceitam best-effort? | pesquisa + `produto` |
| **STK-004** | confidencialidade em repouso no navegador | qual mecanismo torna o armazenamento de uma página ilegível para outro programa/usuário do dispositivo com a aplicação fechada, sem depender de criptografia de disco do sistema? Se a resposta for "nenhum", R-01 elimina o navegador como cliente com custódia — e isso deve virar regra, não nota | `seguranca` |
| **STK-005** | periférico pelo navegador | acesso a impressora térmica/fiscal e a porta serial pelo navegador: em quais navegadores-alvo, com qual permissão, e o desfecho de falha é observável o suficiente para `PN-18`? | pesquisa + `ui` |
| **STK-006** | execução de fundo no navegador | a drenagem de R-08 acontece com a janela fechada ou fora de foco? Se não, o teto de `RN-OFF-014` é atingido por inatividade da interface, o que é defeito e não configuração | pesquisa + `performance` |
| **STK-007** | isolamento em execução no banco | R-13 é garantido por papel de banco por cliente com `GRANT`, ou só por qualificação de schema no nosso código? A resposta muda o que a camada de dados de D-01 precisa suportar (conexão por papel, e o custo de pool que isso traz em N schemas) | `arquiteto-dados` + `seguranca` |
| **STK-008** | E2 é ponto de emissão? | algum dispositivo de mão será declarado ponto de emissão ou deterá fila local? Se sim, ele herda R-01…R-06 inteiros e deixa de ser "só móvel" | `produto` |
| **STK-009** | retaguarda é superfície sem custódia? | a fila do dono (`RN-OFF-011`) e a lista de trabalho (`RN-OFF-012`) são operadas sem nenhuma custódia local? Confirmando, elas entram na segunda classe de §3.1 e o navegador as serve | `produto` |
| **STK-010** | custo de pool em N schemas | qual o custo de conexão de resolver schema por requisição em N clientes, e ele muda a escolha da camada de dados? Não medi e não estimo | `performance` |

---

## PERGUNTAS: para humano

1. **Windows é obrigatório, ou é o que os clientes têm hoje?** E **qual versão**? Se houver liberdade de
   sistema no terminal, o leque de D-02 muda inteiro; se houver versão antiga na base instalada, ela
   elimina opções sozinha.
2. **O certificado é A1 (arquivo) ou A3 (dispositivo)?** O dossiê fiscal registra os dois como
   admissíveis. Se A3 aparecer na base de clientes, existe **hardware físico no terminal** com interface
   própria — e isso decide D-02 sem discussão: navegador não alcança, e o arranjo D passa de candidato a
   obrigatório para aqueles clientes.
3. **Há hardware fiscal/periférico já escolhido?** Modelo de impressora, se é comando padrão de mercado
   ou biblioteca do fabricante, se há balança e leitor em porta serial. Biblioteca de fabricante
   normalmente vem para **um** sistema e **uma** linguagem — é a restrição mais dura possível a D-02, e é
   informação que só você tem.
4. **Tamanho e perfil do time, e quem mantém o quê.** Uma pessoa mantendo servidor + terminal + web
   aponta para um caminho; times separados por alvo apontam para outro (e só aí o arranjo C deixa de ser
   desperdício). É esta resposta que decide se a nota sobre Rust em §2.3 entra em pauta ou sai.
5. **Restrição de licença ou de custo de plataforma?** Framework de interface multiplataforma, biblioteca
   de impressora e fonte (já pendente na T-0002) têm licenças que variam de gratuita a por-assento.
6. **Existe sistema em uso hoje nos clientes-alvo?** Se sim: em que plataforma, e o terminal novo precisa
   **coexistir** com ele na mesma máquina? Coexistência muda o problema de "escolher stack" para
   "escolher stack que divide periférico com outro programa" — e `00-nucleo.md` §12 manda perguntar isso
   antes, não depois.
7. **Ordem:** você decide D-02 antes ou junto com D-01? Pelo §4, item 1, decidir D-01 primeiro entrega
   "duas linguagens" como fato consumado. É escolha válida — mas quero que seja escolha.

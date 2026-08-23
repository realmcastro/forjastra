---
id: T-0004
titulo: Gestão de estabelecimentos e operação do provedor
status: fechada
escopo: cliente=- vertical=- modulo=- camada=produto+dados+seguranca+performance
aberta_em: 2026-08-23
---

## Pedido

O humano pediu a **gestão dos estabelecimentos pela nossa parte** — não os clientes-finais do
estabelecimento, mas nós administrando os clientes. Verbatim do essencial:

> "x restaurante tem x módulos e eu posso personalizar quais módulos aparecem, quais usuários que têm,
> quais são os dados que eu posso trazer, quais estatísticas… é a visualização geral da aplicação pela
> nossa visão. Vamos ter certas ênfases, enxergar os dados do próprio estabelecimento, mas deve se
> planejar usuários pra fazer esse tipo de gestão. O usuário que faz a gestão e o **administrador geral
> que consegue ver tudo**, tanto os dados do cliente, quanto a gestão."

> "quais telas vão existir, quais estatísticas, quais dados, quais acompanhamentos mensais, semestrais…
> a gestão do esquema de banco, a gestão dos usuários de restaurante, quais módulos, **qual módulo está
> sendo mais usado, qual não está sendo usado**, quantas operações estão acontecendo, **que horas é o
> pico**."

> "direcionar pra que, quando for montar o banco, as tabelas a gente realmente consiga **não migrar
> depois porque ficou faltando**. Por exemplo, tabela de… iniciou a venda, finalizou a venda, colocou o
> produto."

> "ter tanta informação boa que a gente não vai precisar mais [migrar]… nossa base tão rica de informação
> que a gente consiga fazer esse acompanhamento muito bem, estatísticas muito boas na parte do
> administrativo, pra ter uma visão melhor sobre o cliente, **sugerir melhorias a ele**. E também o
> cliente conseguir se localizar, saber o que está acontecendo dentro da empresa dele — fiscal,
> financeiro, **predições financeiras, predições de vendas**, horário em que a venda está caindo, qual
> produto não está compensando, análise de produto."

Ele declarou que provavelmente está esquecendo itens ("tem muito mais coisa que eu não estou conseguindo
falar aqui de uma vez"). **Enumerar as perguntas que ele não fez é entregável, não cortesia.**

## Três achados de leitura que precederam o plano (conferidos em disco pelo thread principal)

1. **A spec já deportou este território quatro vezes, sem nunca lhe dar endereço.**
   `papeis-e-permissoes.md:189` tem a linha "**operação nossa que soma clientes**" classificada como *"não
   é papel dentro do cliente… vive fora do escopo de qualquer cliente, e `provider_support` **não** a
   alcança"*. `modulos/relatorios-semente-de-perguntas.md:186` diz *"é dado **nosso**, fora do escopo de
   qualquer cliente, e **não é este módulo**"*. Somam-se `RN-REL-006` e `RN-EMI-040`. E
   `fronteira-do-nucleo.md:26` já escreve "**plataforma ≠ núcleo de venda**" — o quinto escopo está
   anunciado na prosa e **ausente da tabela**. A tarefa é criar o **endereço**, não um console.
2. **A colisão do agregado é pior do que parecia, e a memória prova em vez de resolver.**
   `memory/plataforma/decision-agregado-de-periodo-fechado-nao-e-cache.md:24` diz que alojar agregado no
   `platform` seria **vazamento por agregado**, e a premissa que sustentava o registro era que *nenhuma
   pergunta soma clientes*. Essa premissa **acabou de deixar de ser verdade** — não para o cliente, para
   um leitor novo: nós.
3. **`PN-15` é o único aliado real do "administrador geral" hoje, e é aliado do mecanismo estreito.** Já
   existe canal de observação nossa aceito, e ele é aceito **porque é telemetria de operação, não leitura
   de dado de negócio**. A separação entre *administrar o cliente* e *ver o dado dele* não é hipótese: é
   linha que `PN-15` já desenhou e `RN-NUC-024` já protege.

### Segunda e terceira entradas do humano — 2026-08-23, durante o passo 1

**Correção de eixo.** O eixo **nunca foi cliente ↔ cliente**: "eu **não** quero que um cliente veja dados
de outro… a gente não está falando de comunicação cliente com cliente, e sim **a gente com cliente**".
Consequência: o custo que o thread principal havia atribuído à opção ampla — derrubar a afirmação "não
existe caminho em que um cliente veja dado de outro" — **estava errado** e foi retirado. Provedor lendo
dado que está na infraestrutura dele não é cliente vendo dado de outro.

**Substância dos dois papéis, dita pelo humano:**

> "o suporte vai fazer o papel de suporte, se tiver algum problema com os usuários do cliente ele vai
> conseguir **editar**, não vai ver faturamento, não vai ver cartão, vai ver nada. Vai conseguir
> **interagir com os clientes dos clientes**, e fazer ajustes, **mudar módulo, adicionar módulo**,
> etcétera dos clientes. Mas o administrador geral já consegue ver **dashboards claros dos clientes**,
> quando os clientes estão faturando, como está as vendas, **coisas horárias de Pix**, ele vai ter aquela
> **informação bruta** na frente dele, porque vai ser **uma das cláusulas que a gente vai implementar**."

Reenquadramentos que isso obriga, e que o thread principal repassou ao passo 1:
- **O suporte é papel de ESCRITA**, não de leitura. Leitura estreita, **mutação ampla** — o inverso do que
  o plano supôs. O risco dele não é vazamento: é **mutação indevida** e **agir como o cliente sem o
  cliente saber**. `PN-15` cobre diagnóstico, não conserto.
- **Mudar módulo é fato financeiro** (é a base de cobrança), então o papel que não vê faturamento é o que
  altera o que o cliente paga. Segregação de função saudável, mas exige append-only com autor, instante e
  motivo, e uma regra sobre **quem confirma** mudança que altera cobrança.
- **"Interagir com os clientes dos clientes"** é território novo: o cliente-final acha que fala com o
  estabelecimento. Em nome de quem o suporte fala, e como isso aparece na trilha? E o cliente-final é
  onde vive o dado pessoal minimizado — papel que "não vê sensível" e interage com cliente-final toca
  dado de terceiro por definição.
- **O administrador geral está DECIDIDO**, não é opção. Registrar como decisão datada, listando o que
  revoga — revogação em silêncio é o modo de falha mais caro documentado neste projeto.
- **A cláusula de contrato é o mecanismo de consentimento** (não consentimento por acesso). Fecha
  `LACUNA-NUC-009` pelo mecanismo, com duas exigências: a cláusula e o escopo técnico são **o mesmo
  objeto**; e o estabelecimento **não pode consentir em nome dos clientes-finais dele** — pergunta de
  advogado, não de produto.
- **Piso que vale inclusive para o administrador geral:** cartão completo, código de segurança e trilha
  nunca persistem. "Informação bruta" tem piso, e ele se escreve.
- **A trilha não é substituída pela cláusula:** a cláusula autoriza o acesso, não o torna invisível.

**Terceira entrada — a ênfase na base de dados:**

> "não esqueça da parte dos dados que eu falei. Então **foca na base de dados boa**, porque se a gente
> tiver uma boa base de dados a gente vai conseguir fazer **puta informações bacanas** pra esse sistema,
> funcionalidades, **maneiras diferentes de ver como é que está o negócio**."

Isto confirma a ordenação do plano em vez de mudá-la: os passos **3** (lista de fatos) e **4** (grão,
retenção, `D-06`) são o miolo da ficha, e a tela é o fim. Duas consequências acrescentadas ao escopo
deles:
- **"maneiras diferentes de ver" é requisito de grão, não de tela.** Modelo que nasce agregado não se
  desagrega depois: se o fato guarda só o total da venda, nenhuma tela futura responde "qual produto não
  compensa". Grão fino se agrega quando quiser; grão grosso é irreversível. É a decisão que o passo 4
  não pode errar.
- **Os dois papéis novos geram fatos que também precisam ser registrados** — suporte editou usuário,
  suporte mudou módulo (fato financeiro), administrador geral leu dado do cliente. **O último é a
  própria trilha**, e ele é tão irrecuperável quanto os outros: acesso não registrado no instante não se
  reconstitui depois. Entra na lista do passo 3.

## Plano

Colado do Plano de Despacho do `orquestrador` (2026-08-23). Ordenação por **irrecuperabilidade**, não por
visibilidade: primeiro o que fica gravado em identificador imutável, depois o fato que se perde se não for
capturado no instante, depois o que se conserta com migration, e só no fim a tela.

```
1 (produto)  ──►  2 (seguranca)  ─┐
             └─►  3 (produto)  ──►┼─►  4 (arq-dados)  ─┐
                                  └─►  5 (performance) ─┴─►  6 (seguranca)  ──►  7 (produto)
```

1. **`produto`** — o quinto escopo (endereço, vocabulário, prefixo de `RN`), os dois papéis nossos sob o
   teste de remoção, a desambiguação da palavra "plataforma" (três sentidos em colisão hoje), e **a
   pergunta única ao humano** sobre o administrador geral, redigida **conjuntamente com D-03**, com as
   três opções precificadas em invariante. Entrega: `docs/produto/operacao-do-provedor.md` + quinta linha
   em `fronteira-do-nucleo.md` §1 + linha em `glossario.md` §4.3.
2. **`seguranca`** [∥ 3] — precificar A/B/C **antes** de o humano decidir, e cravar o grão em que
   **telemetria deixa de ser telemetria**. Entrega: `docs/auditorias/`.
3. **`produto`** [∥ 2] — **a lista de fatos que o sistema tem que registrar no instante em que
   acontecem**, com o leitor de cada um e a decisão que ele informa; inclui **a recusa e o motivo**, sem
   o que "módulo não usado" é invisível. Entrega: `docs/produto/fatos-de-operacao.md`.
4. **`arquiteto-dados`** [∥ 5] — veredito de **grão** por fato, retenção, e proposta de **`D-06`** (onde
   mora o agregado cross-cliente), na forma em que D-05 foi proposta: saídas, defeito de cada uma,
   **nenhuma escolhida**. Entrega: seção própria nesta ficha.
5. **`performance`** [∥ 4] — custo em **forma** (`O(...)`), as medidas de `LACUNA-REL-001` dizendo qual
   medida vira qual escolha, e o reexame de período **aberto** (que é cache, e cai na proibição inteira).
6. **`seguranca`** — gate de fecho do bloco, com reincidência marcada.
7. **`produto`** — superfície **invariante** às três opções agora, o resto diferido com a opção que o
   habilita nomeada; matriz do escopo novo em arquivo próprio, com **valor de célula em branco**; e as
   predições entrando só se vier o **critério de aceite de erro** e a regra que as distingue do fato.

**GATES:** 1 (produto antes de código) — a tarefa inteira. 4 (performance) — passos 5 e 7. 3 (autorização)
— incide sobre o **modelo**, passos 2 e 6. Gate 2 (DDL) **não se aplica**: D-04 aberta, nenhum DDL nesta
ficha. Três `BLOQUEIO` esperados: administrador geral + D-03, D-04 + espelho de D-05, e D-01/D-02 (o
console é o mesmo produto ou outra aplicação?).

**RISCO PRINCIPAL:** esta tarefa fabricar, **por utilidade**, a autoridade cross-cliente e retida que o
desenho atual proíbe — e a afirmação "não existe caminho em que um cliente veja dado de outro" deixar de
ser verdade **sem que nenhum documento registre que ela mudou**. O mecanismo não é má-fé: o console é
genuinamente útil, e a versão útil é a que lê tudo. Cada passo isolado parece razoável, e ao fim dos sete
`provider_support` foi substituído na prática por um papel que alcança N clientes sem concessão, sem prazo
e sem trilha — restando dele só o nome.

**RISCO SECUNDÁRIO, e é o que engana:** a opção "só metadado" ser aceita como segura e virar, por grão
fino, a opção ampla com vocabulário técnico. Contagem de operações por hora, por estabelecimento, **é** a
curva de vendas do cliente escrita em outra unidade.

**RISCO DE PROCESSO:** cinco dos sete passos produzem pergunta ao humano, e a fila dele já tem sete itens
abertos. Por isso o passo 1 entrega **uma** pergunta única e o passo 7 entrega as linhas de matriz em
**uma** passada de valoração, com `LACUNA-NUC-037` incluída. Consolidar a pauta é entregável.

## produto (passo 1) — 2026-08-23

## RELATÓRIO — produto — T-0004
STATUS: OK
FEITO:
- Criei o **quinto escopo** `provedor` (código `PRV`), com endereço próprio em dois arquivos irmãos
  (`RN-PRV-001` a `010`), e dei a ele a **quinta e a sexta linha** de `fronteira-do-nucleo.md` §1 — duas,
  não uma: `plataforma` já era usada como valor de escopo em §2.1 **sem ter linha na tabela**, e
  acrescentar só a nova deixaria a tabela ainda mentindo.
- Desambigüei "plataforma" (`RN-PRV-002`): os três sentidos são **dois** — o schema `platform` e o escopo
  de memória são o mesmo sentido em duas altitudes. Quem cede o nome é a **expressão frouxa** "operação da
  plataforma", não o mecanismo. **Nenhum identificador é renomeado.**
- Submeti os dois papéis ao teste de remoção de `RN-NUC-017`: **os dois passam**, pelo limbo (a) — mas não
  como eu ia escrevê-los. `provider_operator` (o "suporte" do humano) muta amplo e lê estreito;
  `provider_administrator` lê amplo e não muta. `provider_support` **não é estendido** para mutação, e a
  recomendação vem com o custo escrito.
- Achei o eixo que o pedido não nomeava e que organiza tudo: **ler e mutar são independentes**
  (`RN-PRV-004`). É ele que preserva o desenho vigente inteiro — as negativas de `RN-NUC-024` (e) são sobre
  **agir** e sobre classe vedada a todos, nenhuma é sobre largura de **leitura**.
- Escrevi a decisão do humano de 2026-08-23 como **decisão registrada**, com a lista das negativas que
  **continuam** de pé e a **premissa implícita** que cai (leitura nossa só por concessão) — com data, que é
  o que impede revogação em silêncio.
- Consequências que ninguém pediu e que são de produto: mudar módulo é **fato append-only que altera
  cobrança** (`RN-PRV-007`), e interação com **cliente-final** é atribuída e mínima (`RN-PRV-008`). As
  duas já cobrem o que a terceira entrada do humano pede para o passo 3: os fatos dos papéis novos —
  suporte editou, suporte mudou módulo, administrador geral **leu** — nascem registrados no instante
  (`RN-PRV-006`, `RN-PRV-007`), e o último é a própria trilha.
- Sete lacunas `PRV` com dono, e **uma pergunta saiu da fila do humano** (comparativo de mercado: ele já
  respondeu não).
ARQUIVOS:
- `docs/produto/operacao-do-provedor.md` (novo, 248 linhas)
- `docs/produto/operacao-do-provedor-alcance.md` (novo, 232 linhas)
- `docs/produto/fronteira-do-nucleo.md` (editado — §1 duas linhas + o que cada uma pode/nunca pode; §4 com
  a pergunta que precede a lista, **sem renumerar** os cinco passos)
- `docs/produto/glossario.md` (editado — **uma** linha em §4.3; 395 → 396 linhas)
- `docs/produto/README.md` (editado — entrada do conjunto novo)
NÃO FEITO: —
DECISÕES:
- **Duas linhas na tabela de §1, não uma.** `plataforma` era valor de escopo sem linha; a lista de §4
  classificaria "isolamento por cliente" como **núcleo** (os três negócios quebram sem isto). Sem a
  pergunta que precede a lista, as linhas novas nasceriam inertes.
- **Partição em dois arquivos.** O texto único fechou em **455 linhas**, acima do teto. Eixo declarado:
  *quais papéis existem × o que alcançam e sob que autorização* — o mesmo eixo de
  `papeis-e-permissoes.md` × `papeis-atribuicao-e-delegacao.md`. Numeração contínua, sem hierarquia.
- **`PRV` como código, `provedor` como escopo.** `provider` já é termo de glossário e já governa
  `provider_support`; `PRV` não colide com nenhum dos 36 códigos nem com os bloqueados.
- **`provider_support` não é estendido para mutação.** Estendê-lo revogaria escopo mínimo, prazo, motivo
  por incidente e "nunca mais de um cliente" de uma vez — sobraria o nome, que é o risco principal do
  plano. Custo da alternativa que escolhi: existem agora **dois** caminhos nossos até o ambiente do
  cliente, então a promessa de trilha de `RN-NUC-024` (d) teve de ser estendida a todos os papéis
  (`RN-PRV-006`), senão o cliente lista os atos sob concessão (zero) e não lista os que acontecem de fato.
- **Colisão de vocabulário resolvida por mapeamento, não por rename.** O humano chama "suporte" o papel que
  muta; `provider_support` está gasto no papel de concessão, é **coluna de matriz** e é citado por meia
  dúzia de regras numeradas. Mapeamento declarado no arquivo.
- **`LACUNA-NUC-011` respondida na parte de papel** (`RN-PRV-005`), aberta na de pessoa e número — pelo
  precedente explícito de `LACUNA-OFF-007`.
- **`LACUNA-NUC-009` fechada pelo lado do mecanismo** (consentimento é cláusula de contrato, decisão do
  humano); `LACUNA-NUC-010` (prazo) continua aberta e é número, que não escrevo.
RISCOS:
- **`LACUNA-NUC-031` mudou de escopo e a célula é do passo 7.** Cresceu de "quem lê a trilha dos atos sob
  concessão" para "atos **e leituras** nossas". Sem a célula no mesmo bloco, `RN-PRV-006` nasce inerte —
  é literalmente `AUT-14` se repetindo.
- **Memória vencida, e não é minha para corrigir:** `decision-agregado-de-periodo-fechado-nao-e-cache`
  sustenta-se na premissa "nenhuma pergunta soma clientes", que **deixou de ser verdade** para um leitor
  novo (nós). Dono: orquestrador.
- **Dívida de nome:** duas coisas que um humano chama de "suporte". Mitigado por mapeamento declarado;
  o custo de resolver de verdade é renomear coluna de matriz, e não recomendo hoje.
- **Dívida de glossário:** `provider_operator` e `provider_administrator` estão **nomeados fora** do
  glossário, porque ele está em 396/400. Enquanto isso, há duas fontes para dois identificadores. A
  partição do glossário é despacho próprio.
- **Prosa vigente com a expressão retirada:** `RN-EMI-040` (enunciado) e `LACUNA-NUC-011` ainda dizem
  "operação da plataforma". Mesmo referente, nenhuma regra muda de desfecho, nenhuma célula afetada —
  resíduo de prosa com dono (`produto`).
- **Gate que passa a bloquear mais:** `RN-PRV-008` faz papel nosso tocar a superfície de cliente-final, e
  o gate de `seguranca` sobre `PCF`/`ATI` está **agendado e não cumprido** (`roadmap-de-modulos.md:373`).
- **O risco secundário do plano continua sem dono resolvido, de propósito:** `LACUNA-PRV-002` (onde a
  observação de operação deixa de ser operação) é do passo 2. Escrevê-la aqui transformaria o canal
  estreito no amplo com vocabulário técnico.
PERGUNTAS:
  - para humano: **`D-03`, agravada** — nosso humano em N clientes é caso de **borda** ou de **venda**? A
    decisão de 2026-08-23 empurra para venda (leitura ampla **e** mutação ampla como rotina), e agora não é
    só ler no cliente errado: é **escrever** no cliente errado.
  - para humano: **quem confirma** mudança de módulo que altera cobrança — o administrador geral, o cliente
    notificado, ou o cliente confirmando? (`LACUNA-PRV-003`; é a mesma pergunta aberta de
    `papeis-e-permissoes.md` §6). Até responder, a operação é **negada a todos**.
  - para humano, **com advogado**: o **cliente-final** tem de saber que quem fala não é o estabelecimento?
    E em que base o dado pessoal dele é alcançado por nós, se ele não assinou o nosso contrato? O
    estabelecimento **não pode consentir em nome dele**. Não afirmo base legal e não cito norma.
  - para humano: as cinco de `operacao-do-provedor-alcance.md` §3 — sujeito nosso (funcionário, sócio ou
    **terceiro**), "sugerir melhoria" interno × vendável, o console **avisa** ou é consultado, retenção
    depois da saída do cliente (`PN-10`), e responsabilidade por número nosso errado.
VERIFICAÇÃO: não rodei teste — não há código. Conferido em disco, arquivo e linha: `fronteira-do-nucleo.md`
§1 tinha **quatro** linhas e §2.1 já usava `plataforma` como valor (linhas 39, 43, 44); `glossario.md` em
**395** linhas, §4.3 com 36 códigos, nenhum `PRV`, e os bloqueados (`PDV`, `POS`, `NFE`, `NF`, `SAT`,
`TEF`); `catalogo-de-capacidades.md` §1 campo 6 admite só `nucleo|modulo|vertical` (linha 30) e a regra 4
proíbe capacidade de escopo núcleo (linhas 50-53); `papeis-e-permissoes.md` §3 (tabela dos 5 papéis, linha
129 do `provider_support`), §4 linha 189, §6 `LACUNA-NUC-009` a `011` e a pergunta de fronteira sobre
habilitar módulo (linha 297); `papeis-atribuicao-e-delegacao.md` §7 (`RN-NUC-024`, cinco cláusulas, linhas
284-351); `matriz-operacao-papel.md` linhas 80-81 (**linhas 25 e 26**, `provider_support` = `N`/`R`, offline
`recusa`) e a nota da linha 51 ("sempre recusa, em toda linha"); `RN-EMI-040` em
`fiscal-custodia-e-trilha.md:295`; `relatorios-semente-de-perguntas.md` linhas 186 e 201; `PN-10`, `PN-11`,
`PN-14`, `PN-15`, `PN-20` lidos verbatim; `RN-EMI-017`, `RN-OFF-027`, `RN-NUC-036`, `RN-REL-007` existem
como heading `###`; gate `PCF`/`ATI` agendado e não cumprido em `roadmap-de-modulos.md:373`;
`superficie-por-papel.md:328` e `:356` (`LACUNA-NUC-031` = **ausente**). Contagem de linhas medida:
`operacao-do-provedor.md` **248**, `operacao-do-provedor-alcance.md` **232**, texto único antes da partição
**455**. Não conferi se `RN-EMI-013`, `RN-EMI-028`, `RN-EMI-033`, `RN-EMI-036/037`, `RN-NUC-029` e
`RN-NUC-039` dizem exatamente o que cito — citei-os pelo que outros arquivos afirmam deles.
MEMÓRIA SUGERIDA:
  - type=decision escopo=plataforma slug=quinto-escopo-provedor — o nosso negócio é escopo próprio
    (`provedor`/`PRV`), não é núcleo/módulo/vertical/cliente, e **não** herda o nome "plataforma": o schema
    `platform` e o escopo de memória são o mesmo sentido, o nosso negócio é outra espécie
  - type=decision escopo=plataforma slug=leitura-e-mutacao-sao-eixos-independentes — nenhum papel do
    provedor porta os dois amplos; é isto que preserva `RN-NUC-024` inteiro em vez de revogá-lo, porque as
    negativas dele são sobre **agir**, não sobre largura de leitura
  - type=business-rule escopo=plataforma slug=leitura-nossa-por-clausula-de-contrato — decidido
    2026-08-23: o administrador geral lê o negócio do cliente; consentimento é **cláusula de contrato**
    (fecha `LACUNA-NUC-009` pelo mecanismo), a cláusula e o alcance técnico são o mesmo objeto, e a
    cláusula **não** dispensa a trilha
  - type=gotcha escopo=plataforma slug=premissa-implicita-cai-sem-enunciado-mudar — a premissa "leitura
    nossa só por concessão" não estava em enunciado nenhum (vivia em *motivo* e em narrativa de auditoria);
    premissa que cai sem registro é o modo de falha mais caro daqui — registre a queda com data
  - type=business-rule escopo=plataforma slug=modulo-ativo-e-fato-de-cobranca — ativar/desativar módulo é
    fato append-only e **altera a fatura**; quem o pratica é justamente quem não vê faturamento, então o
    ato declara o efeito no momento em que é praticado, senão segregação vira cegueira
  - type=convention escopo=plataforma slug=vocabulario-gasto-nao-se-renomeia-mapeia-se — id que é coluna de
    matriz e é citado por regra numerada não se renomeia para caber na palavra do humano: declara-se o
    mapeamento, e a dívida de nome fica visível
PRÓXIMO PASSO SUGERIDO: `seguranca` (passo 2) — precificar `LACUNA-PRV-002` (onde a observação de operação
deixa de ser operação) e, com a premissa nova, auditar o eixo que **mudou**: o risco do suporte não é
vazamento, é **mutação indevida** e agir como o cliente sem ele saber. Em paralelo, passo 3 (`produto`).

## produto (passo 3) — 2026-08-23

## RELATÓRIO — produto — T-0004
STATUS: PARCIAL
FEITO:
- Escrevi a **lista dos fatos** que o sistema tem de registrar no instante, em dois arquivos irmãos
  partidos pelo eixo **quem pratica o fato**: 12 fatos do caminho de venda + 1 fato de recusa com **8
  motivos enumerados** + 6 grandezas de tempo (`fatos-de-operacao.md`); 7 fatos de papel nosso com **7
  motivos enumerados** + 6 fatos de ciclo de vida (`fatos-de-operacao-provedor.md`). Cada fato com os
  seis campos, nenhum vazio.
- **O achado que trava o miolo do pedido, e é irrecuperável:** "iniciou a venda e não terminou" **não
  existe no servidor por regra aprovada** — `RN-NUC-001` (pedido em construção é local e fora da fila)
  e `RN-NUC-003`, infeliz (c), que diz literalmente **"nada sobe"**. Os quatro fatos que o humano mais
  pediu (`order_opened`, `order_item_added` do que foi retirado, `order_item_removed`,
  `order_abandoned`) colidem com isso. Marquei-os **`PROVISÓRIA`** e abri `LACUNA-NUC-038` com o
  mecanismo proposto e **não** decidido: o que sincroniza não é o pedido, é fato aditivo próprio
  (classe 1) — `RN-NUC-001` fica intacta, o que cai é o "nada sobe", e derrubar cláusula vigente é
  **ato datado do humano**, não efeito colateral de uma lista.
- **A recusa virou fato com motivo de lista fechada** (`RN-NUC-043`) e a enumeração nasceu **na mesma
  passada** do campo, que é a única forma de ela valer
  (`convention-campo-de-texto-livre-nao-e-campo-enumeravel`). As três recusas que se parecem para o
  operador ficaram separadas — `no_contact` (infraestrutura), `authority_absent` (configuração de
  papel), `unclassified_operation` (**defeito nosso**) — e acrescentei a quarta que ninguém tinha
  distinguido: `external_authorization_denied`, **resposta negativa obtida**, que não é ausência de
  contato e hoje se confunde com ela.
- **"Módulo não usado" ficou respondível, e a resposta precisa dos dois arquivos:** módulo **ativo
  desde** tal dia (`module_state_change`) com **zero** fato de operação até hoje, mais a recusa
  `module_inactive` para o que foi tentado e não existia. Ausência sozinha não distingue "não usa" de
  "nunca foi ligado" — e nenhum dos dois é telemetria nova: por `RN-NUC-041` todo fato declara a
  operação e o **módulo dono**, então "módulo mais usado", "volume de operações" e "pico" são
  **leitura**, não coleta.
- **A leitura nossa é fato de igual peso ao ato** (`RN-PRV-011`), e o fato **nomeia** o que foi
  alcançado sem **copiar o conteúdo lido** — senão a trilha vira um segundo acervo do dado sensível do
  cliente, com outro leitor e outra retenção. Sem este fato, `RN-PRV-006` é promessa inexequível.
- **Tempo entrou sem campo de duração** (`RN-NUC-045`): marcos nomeados, duração derivada. A latência
  percebida do caminho crítico ficou do outro lado da fronteira, como **medida de operação**
  (`RN-PRV-009`) e grandeza **sem valor**, para ser comparada com os orçamentos de
  `.claude/rules/performance.md` §3.
- **Regra que ninguém pediu e o desenho exigia** (`RN-NUC-046`): esta spec cria fatos de alto volume
  que competem pelo mesmo recurso local do fato que é dinheiro. Ordem de sacrifício declarada — recusa
  e conectividade cedem **antes** de venda, pagamento e movimento de caixa — e **descarte é contado**,
  senão a série mente por omissão e quem lê conclui que o problema parou.
- **`RN-NUC-042` fez `LACUNA-GLO-001` virar carga desta família inteira**: nenhuma leitura desta spec
  usa "hora", "pico", "dia" ou "mês" sem declarar de quem é o fuso. Não resolvi o conflito — resolvê-lo
  mexe em `.claude/rules/dados.md`, que é do humano.
- Separei, em cláusula própria, **registrar × ler**: o fato guarda o autor porque a trilha exige
  (`RN-NUC-029`); ler por pessoa é outra operação e depende de `RN-REL-008` e de célula. É o atalho
  pelo qual uma base honesta vira vigilância, e ele agora está fechado por escrito.
ARQUIVOS:
- `docs/produto/fatos-de-operacao.md` (novo, 381 linhas)
- `docs/produto/fatos-de-operacao-provedor.md` (novo, 198 linhas)
- `docs/produto/README.md` (editado — linha em "Por onde entrar" + seção do conjunto novo)
- só leitura: `operacao-do-provedor.md`, `operacao-do-provedor-alcance.md` (**não editados**, conforme o
  brief), `nucleo-venda.md` §2, `modulos/relatorios.md` §2, `operacao-offline-e-sincronizacao.md` §1–§4,
  `fila-local-conteudo-e-repouso.md`, `fila-local-autoridade-e-identidade.md`, `glossario.md`,
  `postura-nova-geracao.md` (`PN-15`), `offline-grandezas-e-orcamento.md`,
  `modulos/atendimento-ia*.md`, `memory/plataforma/INDEX.md` + 2 registros.
NÃO FEITO:
- **Os fatos de módulo não estão enumerados** (`MSA`, `COZ`, `PCF`, `PER` além do desfecho de tentativa,
  `EMI` além do desfecho do documento). Motivo: fato de módulo pertence à spec do módulo dono, e
  enumerá-los aqui seria escrever em nome de seis specs numa passada. Declarei a disciplina que eles
  herdam (`RN-NUC-041`, `RN-NUC-043`, `RN-NUC-044`) e listei só os dois que o caminho de venda do
  núcleo já atravessa. **É trabalho, não decisão** — um despacho por módulo, e o de `COZ` é o que o
  humano vai sentir falta primeiro (tempo de produção por ponto).
- **Grão não fechado em nenhum fato** — é do passo 4, por desenho do plano. O que entreguei é proposta
  com o freio de cada uma declarado.
- **`RN-ATI-015` e `RN-ATI-017` não foram fechadas**, e a razão é que elas **não estão abertas**: as
  duas são regras escritas, com aceite, em `modulos/atendimento-ia.md:278` e
  `modulos/atendimento-ia-fronteira-de-confianca.md:89` — nenhuma é lacuna e nenhuma trata de motivo
  enumerado. Conferi também que não existe `LACUNA-ATI-nnn` no repo (zero ocorrências). A citação do
  brief não corresponde ao disco; a **disciplina** que ela pedia (motivo só agrega se enumerado na mesma
  passada) veio de `convention-campo-de-texto-livre-nao-e-campo-enumeravel` e está aplicada em
  `RN-NUC-043` e `RN-PRV-012`.
DECISÕES:
- **Duas famílias de numeração, não uma.** `RN-NUC-041` a `046` para o fato da operação do **cliente**
  (o teste dos três negócios passa: posto, padaria e loja de roupa precisam **todos** saber o que
  vende, o que se anula e onde a operação trava) e `RN-PRV-011` a `014` para o que **nós** praticamos.
  Efeito colateral deliberado: **nenhum código de módulo novo**, logo `glossario.md` §4.3 não muda — e
  ele está em 397/400 linhas. Registrar fato **não é módulo**: o cliente não o desliga, e se pudesse, o
  dado faltaria, e a falta é a coisa irrecuperável.
- **Partição em dois arquivos, eixo `quem pratica o fato`.** Texto único passaria de 400. Os fatos do
  cliente e os nossos têm leitor, autoridade e retenção diferentes, e o eixo é o mesmo que já separa
  `operacao-do-provedor*.md` do resto.
- **As lacunas `NUC` novas moram no meu arquivo, não em `nucleo-venda.md` §6.** O padrão do repo é
  "lacuna mora no conjunto que a criou" (`PER`, `REL`, `OFF`, matriz de módulos), e `nucleo-venda.md`
  §6 hospeda as do **trio** do núcleo. Custo declarado em RISCOS.
- **`operation_refused` é um fato com motivo enumerado, não oito fatos.** Oito fatos duplicariam ator,
  instante e operação em oito lugares e tornariam a lista aberta por construção — motivo novo entraria
  como fato novo, sem passar por alteração de regra.
- **Não criei ID de fato** (`F-nn` já é fonte fiscal, e `FAT-`/`FO-` não existem no repo). O fato é
  identificado pelo **nome em inglês**, que é o que o glossário governa e o que o passo 4 vai usar.
- **`peak`/"pico" não entrou como fato nosso.** Pela disciplina de `RN-NUC-044`, sem decisão nomeada
  não entra; a única que consigo nomear do nosso lado é **janela de manutenção por cliente**, e ela
  está travada por `LACUNA-GLO-001` e `LACUNA-PRV-002`. Virou pergunta 1 ao humano, não fato.
RISCOS:
- **`LACUNA-NUC-038` é bloqueio de fato, não de spec.** Se o humano não decidir, o passo 4 modela sem os
  quatro fatos do pedido — e é justamente o dado que o humano pediu primeiro ("iniciou a venda,
  colocou o produto") e o único desta lista que **não** se recupera depois. Recomendo que ela entre na
  pauta antes do passo 4, não depois.
- **Quem procurar `LACUNA-NUC-038` em `nucleo-venda.md` §6 não vai achar.** Mitigado por citação
  cruzada no meu §7; o resíduo é de prosa, dono `produto`, e some quando alguém tocar
  `nucleo-venda.md` (que está em bom espaço).
- **Duas regras minhas ficam inertes até célula existir:** `RN-PRV-011` depende de `LACUNA-NUC-031`
  (passo 7) para o cliente **ler** a trilha, e `RN-NUC-043` produz fato que ninguém tem operação de
  leitura declarada para consultar. Regra que muda desfecho de célula e não entrega a célula nasce
  inerte (`AUT-14`) — as duas são do passo 7.
- **Volume no caminho crítico é risco real e não medido.** `order_item_added`, `order_item_removed`,
  `operation_refused` e `terminal_connectivity_state_change` são os quatro de maior volume, e escrever
  um fato por lançamento no terminal modesto pode encostar no orçamento de 150 ms. Pergunta 2, ao
  `performance`.
- **O risco secundário do plano encostou aqui.** `terminal_connectivity_state_change` e a contagem de
  operação por hora são, por grão, a curva de vendas do cliente em outra unidade. Não escrevi o
  critério (é `LACUNA-PRV-002`, passo 2) e deixei `RN-PRV-014` como o freio: pergunta nossa não coleta
  fato novo.
- **Memória vencida, reincidente e não é minha:** `decision-agregado-de-periodo-fechado-nao-e-cache`
  segue apoiada em "nenhuma pergunta soma clientes". Já reportado no passo 1; continua aberto.
PERGUNTAS:
  - para humano: **`LACUNA-NUC-038`** — o fato de ciclo de vida do pedido (aberto, item retirado,
    abandonado) pode existir, revogando o "nada sobe" de `RN-NUC-003` infeliz (c)? O mecanismo proposto
    preserva `RN-NUC-001` inteira. **Sem sim ou não, quatro fatos irrecuperáveis ficam fora do modelo.**
  - para humano: **qual decisão nossa "pico de horário" informa?** Se for janela de manutenção, ela
    depende de `LACUNA-GLO-001`; se não houver decisão, o fato não entra como nosso (fica leitura do
    cliente).
  - para humano: **`LACUNA-PRV-008`** — o cliente vê os **mesmos** fatos que nós vemos sobre ele, ou um
    subconjunto? Inclui a nossa classificação de "defeito nosso".
  - para humano, com `seguranca`: **`LACUNA-PRV-009`** — a **tentativa nossa recusada** é legível pelo
    cliente? Não é ato nem leitura no ambiente dele, mas é tentativa **sobre** ele.
  - para `performance`: os quatro fatos de maior volume, em forma, e o orçamento do caminho crítico com
    um fato por lançamento (detalhe em `fatos-de-operacao.md` §7, pergunta 2).
  - para `arquiteto-dados`: veredito de grão por fato + retenção por classe (`LACUNA-NUC-040`); e o
    ledger de migration por schema já é fato de `RN-PRV-013` — não desenhei forma nenhuma.
VERIFICAÇÃO: não rodei teste — não há código. Conferido em disco, arquivo e linha: `RN-NUC-001` a
`RN-NUC-003` verbatim (`nucleo-venda.md:92-161`; o "nada sobe" está em `:157-158`); `RN-REL-001` e
`RN-REL-002` verbatim (`modulos/relatorios.md:65-111`), mais `RN-REL-005` a `007`; as quatro classes e a
tabela de classificação (`operacao-offline-e-sincronizacao.md:28-34`, `:43-48`, `:65-107`, `:116-154`);
`RN-OFF-019` (`:232-236`), `RN-OFF-014`/`015`/`016` (`:209-228`), `RN-OFF-023` e `RN-OFF-027`
(`fila-local-conteudo-e-repouso.md:86-137`), `RN-OFF-028`/`029` (`offline-grandezas-e-orcamento.md:16-52`);
`PN-15` verbatim (`postura-nova-geracao.md:261-274`); `glossario.md` inteiro — **397** linhas, `PRV` já em
§4.3 linha 332, `LACUNA-GLO-001` em `:395`, e os nomes em inglês que usei conferidos um a um em §1.1 a
§1.8 e §6; `RN-ATI-015` (`modulos/atendimento-ia.md:278`) e `RN-ATI-017`
(`modulos/atendimento-ia-fronteira-de-confianca.md:89`) lidos verbatim — **são regras escritas, não
lacunas**; `convention-campo-de-texto-livre-nao-e-campo-enumeravel` e
`gotcha-fuso-do-estabelecimento-versus-fuso-do-cliente` lidos verbatim.
**Numeração conferida por busca antes de numerar:** `RN-NUC-04\d` → só `040` existe, em 8 arquivos;
`RN-PRV-0(1[1-9]|[2-9]\d)` → **zero**; `LACUNA-NUC-0[34]\d` → máximo **037**; `LACUNA-ATI` → zero;
`FAT-\d|FO-\d|FT-\d` → zero em todo o repo. **Contagem de linhas medida:** `fatos-de-operacao.md` **381**,
`fatos-de-operacao-provedor.md` **198**. **Não conferi na fonte:** `RN-NUC-029`, `RN-NUC-031`,
`RN-NUC-036`, `RN-NUC-039`, `RN-EMI-007`, `RN-EMI-017`, `RN-EMI-028`, `RN-EMI-033`, `RN-EMI-038`,
`RN-FIS-011`, `RN-PER-004`, `RN-REL-008` a `014` — citei-os pelo que `operacao-do-provedor*.md`,
`matriz-operacao-papel*.md` e `relatorios*.md` afirmam deles. Não editei
`operacao-do-provedor*.md` (`seguranca` está lendo), nem `memory/**`, nem `docs/auditorias/**`.
MEMÓRIA SUGERIDA:
  - type=convention escopo=plataforma slug=grao-fino-por-padrao-agregado-e-leitura — modelo que nasce
    agregado não se desagrega: o detalhe não foi perdido, ele nunca existiu; só dois freios adiam grão
    fino — **custo medido** e **minimização de dado pessoal** —, e "não vamos precisar disso" não é freio
  - type=business-rule escopo=plataforma slug=recusa-e-fato-com-motivo-enumerado — "qual módulo não está
    sendo usado" é invisível se só o sucesso é registrado; ausência de uso não deixa rastro, só a
    tentativa recusada deixa — e o motivo vale apenas se enumerado na mesma passada em que o campo nasce
  - type=gotcha escopo=plataforma slug=pedido-abandonado-nao-existe-no-servidor — `RN-NUC-001` +
    `RN-NUC-003` infeliz (c) dizem "nada sobe": "iniciou a venda e não terminou" **não existe hoje**, é
    irrecuperável, e capturá-lo revoga cláusula vigente — exige ato datado do humano (`LACUNA-NUC-038`)
  - type=convention escopo=plataforma slug=registrar-nao-e-ler — o fato guarda o autor porque a trilha
    exige; ler por pessoa é outra operação, com célula e decisão do humano (`RN-REL-008`, `RN-ATI-017`).
    Confundir as duas é como base honesta vira vigilância
  - type=business-rule escopo=plataforma slug=leitura-nossa-e-fato-que-nao-copia-o-lido — trilha de acesso
    nomeia o que foi alcançado e nunca o conteúdo: copiar cria um segundo acervo do dado sensível, com
    outro leitor e outra retenção — a auditoria virando o vazamento que ela detecta
  - type=convention escopo=plataforma slug=diagnostico-cede-antes-do-dinheiro-no-recurso-local — fato de
    recusa e de conectividade são alto volume e disputam o disco do terminal com a venda; ordem de
    sacrifício é declarada e **o descarte é contado**, senão a série mente por omissão
PRÓXIMO PASSO SUGERIDO: `arquiteto-dados` (passo 4) — veredito de grão fato por fato sobre as três tabelas
de `fatos-de-operacao.md` §3–§5 e as duas do irmão §2–§3, retenção por classe (`LACUNA-NUC-040`) e
proposta de `D-06`. **Antes dele, se der:** `LACUNA-NUC-038` ao humano — sem ela o passo 4 modela sem os
quatro fatos que o pedido nomeou primeiro. Em paralelo, `performance` (passo 5) com a pergunta 2.

## seguranca (passo 2) — 2026-08-23

## RELATÓRIO — seguranca — T-0004
STATUS: OK
FEITO:
- **`LACUNA-PRV-002` entregue como teste, não como adjetivo:** seis condições necessárias (unidade ·
  espelho-não-série · forma-não-valor · decisão e grão mais grosso · janela · destino e repouso), cada uma
  com procedimento, mais **um teste de admissão** aplicável por quem não conhece a nossa infraestrutura
  ("se eu entregasse este item, neste grão, ao próprio cliente, ele o reconheceria como informação do
  negócio dele?"). O número da janela **não** é meu: entreguei o teste que o produz.
- **Declarei onde a fronteira NÃO tem saída boa**, porque dizer isso é melhor que um critério que não
  segura: **hora de pico por estabelecimento não tem saída** (o pico *é* a forma; só existe agregado sobre
  todos os clientes, ou entregue **ao** cliente, ou dado de negócio por `RN-PRV-010`), e **métrica de
  infraestrutura por estabelecimento é proxy de atividade por construção** (saída parcial: grão fino é
  transitório, o retido é grosso — e isso é restrição de repouso, do passo 4). **"Qual módulo não está
  sendo usado" tem saída boa:** binário usado/não usado na janela, nunca volume, nunca curva.
- **Confirmei o teste central do passo 1 com uma correção de fundamento.** `provider_support` **não** foi
  estendido, nenhuma negativa vigente caiu, e `RN-PRV-004` é o eixo que preserva o desenho. **Mas** não é
  verdade que "nenhuma negativa vigente é sobre largura de leitura": existem **quatro** negativas de
  largura de leitura vigentes, e são **células** (`matriz-operacao-papel-modulos.md:168-171`, nota ⁷ em
  `:173-175`). Duas delas são exatamente o que o desenho novo concede em prosa — daí `PRV-06` e `PRV-02`.
- **Dez achados: um `CRÍTICO`, seis `ALTO`, três `MÉDIO`.** O `CRÍTICO` é `PRV-01`: `RN-PRV-003`
  (`operacao-do-provedor.md:105-107`) exclui os papéis nossos de `RN-NUC-018` e, com ele, da **única**
  cláusula do repositório que proíbe resolver escopo por identificador informado no pedido
  (`papeis-e-permissoes.md:101`) — retirada do papel que **escreve** em N clientes. `RN-NUC-018` é regra
  sobre o **objeto**, e todo objeto de ato nosso pertence a um cliente; a exclusão se justifica por
  propriedade do **sujeito**, que a regra nunca menciona.
- **Respondi os cinco itens de `seguranca.md` §1 um a um**, e o item 2 é o que mudou: para papel nosso o
  tenant **não** vem da identidade — vem de **seletor**, porque um papel que serve N clientes não tem
  tenant na identidade. É o que `.claude/rules/backend.md` §1 proíbe, e é a primeira vez que o proibido é
  inevitável.
- **Auditoria em dois arquivos irmãos, por eixo, com o motivo declarado** (teto de 400: o texto único
  fechou em 438).
ARQUIVOS:
- `docs/auditorias/2026-08-23-operacao-do-provedor-e-console-de-gestao.md` (novo, 318 linhas) — eixo do
  alcance: prioridade um, `LACUNA-PRV-002`, o veredito sobre `provider_support`, `PRV-01`, `02`, `06`, `10`
- `docs/auditorias/2026-08-23-operacao-do-provedor-mutacao-e-trilha.md` (novo, 155 linhas) — eixo do ato e
  do rastro: `PRV-03`, `04`, `05`, `07`, `08`, `09`, e o estado do gate `PCF`/`ATI`
- `docs/produto/operacao-do-provedor.md`, `operacao-do-provedor-alcance.md`, `papeis-e-permissoes.md`,
  `papeis-atribuicao-e-delegacao.md`, as três matrizes, `fiscal-custodia-e-trilha.md`,
  `modulos/pedido-cliente-final.md`, `modulos/relatorios-semente-de-perguntas.md`,
  `postura-nova-geracao.md`, `superficie-por-papel.md`, `roadmap-de-modulos.md`, `fronteira-do-nucleo.md`,
  as duas auditorias de T-0003 (só leitura)
NÃO FEITO: —
DECISÕES:
- **`PRV-01` é `CRÍTICO`, e não é inflação.** Ele bate os dois critérios: mutação que cai no cliente errado
  altera a fatura dele (`RN-PRV-007`) e é irreversível pelas regras append-only do próprio desenho; e a
  leitura no cliente errado, entregue como "sugestão" (`LACUNA-PRV-004`), é um cliente recebendo dado de
  outro. Deixei os outros nove abaixo dele de propósito — se tudo grita, ninguém lê os seis `ALTO`.
- **Dividi em dois arquivos por eixo**, com o nome irmão declarado nos dois cabeçalhos e numeração de
  achado contínua. Precedente: as duas auditorias da T-0003, que dividi por **rodada**.
- **Não abri achado sobre o conteúdo da trilha de leitura.** O aceite de `RN-PRV-006` enumera "autor,
  instante, objeto e autoridade" e **não** o valor lido — está certo. Virou nota com a guarda, porque
  "objeto" é a palavra que um implementador transforma em payload.
- **Não abri achado sobre a ambiguidade de "faturamento"** (duas grandezas: o que o cliente nos paga × a
  receita dele). O desfecho não muda, `RN-PRV-004` desambigua no aceite. Nota.
- **Não afirmei base legal em nenhum ponto**, inclusive em `PRV-06`: nomeei a consequência de
  **autorização** (a classe fica sem veículo, e falha fechado dá um desfecho só) e devolvi o resto ao
  humano com advogado.
RISCOS:
- **Os três padrões de defeito da T-0003 reapareceram no primeiro escopo novo:** prosa concedendo o que a
  célula nega (`AUT-08` → `PRV-02`, `PRV-06`), fonte de autoridade sem valor no registro (`AUT-15` →
  `PRV-03`), regra que muda desfecho de célula sem a célula (`AUT-14` → `PRV-04`). Nenhum é **reincidente**
  em sentido estrito — os três `AUT` estão corrigidos. É sinal de **processo**: é o argumento mais forte
  para a matriz do passo 7 e a reauditoria do passo 6 saírem no mesmo bloco.
- **`RN-PRV-006` nasce inerte, e é pior que inerte:** `RN-NUC-024` (d) amarra a **concedibilidade** à
  existência do leitor, e `RN-PRV-006` não amarra nada — os papéis novos são atribuíveis enquanto a trilha
  não tem leitor (`LACUNA-NUC-031`, ausente). O desenho novo fica pior que o vigente no ponto em que o
  vigente estava certo. Confirmo o alerta do passo 1: **é `AUT-14` se repetindo.**
- **A lista de fatos do passo 3 rodou em paralelo e não está auditada.** `fatos-de-operacao.md` e
  `fatos-de-operacao-provedor.md` existem em disco e não entraram no meu brief. **Sem aplicar F1–F6 aos
  itens deles, a fronteira que entreguei é texto.** Trabalho do passo 6.
- **`D-06` herda uma restrição, não uma preferência:** agregado identificável por cliente alojado no
  `platform` tira dado do cliente do schema que o isola — isolamento deixa de ser propriedade da
  construção. É o "vazamento por agregado" de
  `memory/plataforma/decision-agregado-de-periodo-fechado-nao-e-cache.md`, e **essa parte do registro
  segue válida**; o que caiu nele foi só a premissa "nenhuma pergunta soma clientes".
- **Requisito para o passo 7, fora de achado porque não há desenho:** nenhuma superfície nossa tem "cliente
  atual" implícito (default de tenant em papel nosso é o pior default deste sistema), e **exportação de
  diagnóstico** não tem regra nenhuma — é o veículo clássico de sair do escopo levando o dado inteiro.
- **Contradição interna do par do passo 1, não corrigida por mim:** `RN-PRV-003` diz que nenhum papel de
  escopo `provedor` é coluna de matriz de cliente; `operacao-do-provedor-alcance.md:122-123` diz que
  `provider_support` é `recusa` em toda linha das matrizes. E `operacao-do-provedor.md:105-106` afirma que
  as matrizes têm "por coluna os cinco papéis **de cliente**", quando a quinta é `provider_support`, que
  `papeis-e-permissoes.md:129` classifica como "**nosso**". Dono: `produto`.
PERGUNTAS:
  - para humano: **`D-03`, terceiro eixo** — o seletor de cliente do papel nosso é **escolhido no pedido**
    (isolamento por verificação) ou **emitido pelo servidor, uma vez, para um cliente só, herdado pela
    sessão** (isolamento por construção)? Com mutação em jogo, é esta a pergunta que decide o tamanho de
    `PRV-01`, e a opção **B** do dossiê passou a custar mais do que custava.
  - para `produto`: `RN-PRV-006` aceita a cláusula de `RN-NUC-024` (d) — papel de escopo `provedor` não é
    atribuível enquanto a leitura da trilha não tiver célula? É uma frase, e sem ela `PRV-04` fica aberto
    até o passo 7.
  - para humano, com advogado (já na fila, agora com consequência técnica nomeada): enquanto não houver
    base para o dado pessoal de **cliente-final**, ele entra no **piso** de §2.2 (vedado a todo papel
    nosso), ou `RN-PRV-008` se declara **inerte**? São as duas únicas saídas de falha fechado.
VERIFICAÇÃO: não rodei teste — não há código. Conferência de endereço em disco, um a um, nesta data:
`operacao-do-provedor.md` (**248** linhas) linhas 105-107, 118-129, 131-149, 162-189, 191-207, 213-233,
239-248; `operacao-do-provedor-alcance.md` (**232**) linhas 20-27, 49-76, 105-113, 117-126, 142-150,
163-176, 180-187, 193-208, 215-232; `papeis-e-permissoes.md` :75-104 (`RN-NUC-018`, com a frase do escopo
por identificador em **:101**), :123-129 (tabela dos 5, `provider_support` em **:129**, coluna "De quem" =
**nosso**), :189, :276-299; `papeis-atribuicao-e-delegacao.md` :282-351 (`RN-NUC-024`, cinco cláusulas; (d)
com a trava de concedibilidade em **:293-295**; as três negativas em **:298-299**);
`matriz-operacao-papel-contrato.md` :36-62 (`RN-NUC-026`, aceite "aos cinco papéis" em **:59**), :160-207
(`RN-NUC-029`, três fontes em **:161-165**), :213-244 (`RN-NUC-039`, "as duas matrizes" em **:214** e
**:218**, célula como teto em **:219**); `matriz-operacao-papel.md` :51, :54 (a quinta coluna **é**
`provider_support`), :80-81; `matriz-operacao-papel-modulos.md` :166-175 (as quatro linhas de leitura e a
nota ⁷), :180-183; `fiscal-custodia-e-trilha.md` :295-311 (`RN-EMI-040`: o enunciado proíbe **valor** em
**:299-301**; o motivo em **:302-305**); `modulos/pedido-cliente-final.md` :279-293 (`RN-PCF-012`),
:295-309 (`RN-PCF-013`, as três classes de autor em **:307-308**); `modulos/relatorios-semente-de-perguntas.md`
:186 e :201; `postura-nova-geracao.md` :186-197 (`PN-10`) e :261-274 (`PN-15`, o canal em **:269-274**);
`superficie-por-papel.md` :328 e :356 (`LACUNA-NUC-031` = **ausente**); `roadmap-de-modulos.md` :373 (gate
`PCF`/`ATI` **agendado e não cumprido**); `fronteira-do-nucleo.md` :20, :36-40, :58; busca por `telemetria`
em `docs/produto/**` = **zero**; busca por `provider_operator`/`provider_administrator` nas três matrizes =
**zero** (o aceite de `RN-PRV-003` confere). **Não li** `fatos-de-operacao.md` nem
`fatos-de-operacao-provedor.md` (passo 3, paralelo, fora do brief) — declarado no relatório. **Não li**
norma alguma. Contagem de linhas medida: irmão do alcance **318**, irmão da mutação **155**, texto único
antes da partição **438**.
MEMÓRIA SUGERIDA:
  - type=business-rule escopo=plataforma slug=fronteira-entre-observacao-de-operacao-e-dado-de-negocio —
    seis condições necessárias, e a que segura a linha é **forma, não valor**: item que revela ordenação no
    tempo, entre estabelecimentos ou entre clientes é dado de negócio, porque agregar não anonimiza e a
    hora de pico *é* a resposta de negócio; o teste de admissão é "o cliente reconheceria isto como
    informação do negócio dele?"
  - type=gotcha escopo=plataforma slug=hora-de-pico-por-estabelecimento-nao-tem-saida — não existe unidade,
    janela ou agregação que faça pico por estabelecimento ser telemetria: só há três saídas (agregado sobre
    todos os clientes · entregue **ao** cliente como relatório dele · dado de negócio por cláusula), e
    "métrica de infraestrutura por estabelecimento" é proxy de atividade por construção
  - type=gotcha escopo=plataforma slug=papel-que-serve-n-clientes-nao-tem-tenant-na-identidade — é o
    primeiro sujeito deste sistema para quem `backend.md` §1 não funciona: o tenant chega por **seletor**.
    Com leitura o dano é nosso; com **mutação** o dano é do cliente e é irreversível (fato append-only).
    Quem emite o seletor decide se o isolamento é construção ou verificação — é o terceiro eixo de `D-03`
  - type=gotcha escopo=plataforma slug=regra-de-escopo-novo-nao-herda-o-default-fechado — `RN-NUC-026` e
    `RN-NUC-039` estão escritas sobre "as duas matrizes" e "os cinco papéis": apontar para elas de um
    escopo novo não importa a trava, importa a citação. Escopo novo declara o próprio default **na passada
    em que nasce**, senão a primeira implementação decide
  - type=convention escopo=plataforma slug=exclusao-de-regra-se-justifica-pelo-objeto-nao-pelo-sujeito —
    `RN-NUC-018` fala do **objeto**; excluir um papel dela por uma propriedade do **sujeito** retira a
    cláusula anti-IDOR sem que nada acuse. Antes de declarar regra inaplicável, pergunte de que lado ela
    fala
PRÓXIMO PASSO SUGERIDO: `produto` — as três frases de `PRV-01`, `PRV-04` e `PRV-06`, que são baratas e
mudam desfecho: `RN-PRV-003` perde a exclusão de `RN-NUC-018` e `RN-PRV-004` ganha a cláusula do objeto +
um cliente por ato; `RN-PRV-006` ganha a trava de concedibilidade de `RN-NUC-024` (d); e a classe do
cliente-final entra no piso de §2.2 ou `RN-PRV-008` se declara inerte. Em seguida, `arquiteto-dados` (passo
4) com F6 e a restrição de `D-06`, e `performance` (passo 5) com o volume da trilha de leitura. No passo 6
eu reaudito o conserto **e** aplico F1–F6 aos itens de `fatos-de-operacao*.md`, que esta rodada não
auditou.

## arquiteto-dados (passo 4) — 2026-08-23

### 0. O que esta seção é

Veredito de **grão**, retenção e proposta de `D-06`. **Nenhum DDL, nenhuma tabela, coluna, índice,
tipo, chave** — `D-04` está ABERTA e a Fase 1 não abriu (`db/**` não existe: conferido). Onde escrevo
"o fato carrega X", **X é conteúdo do fato**, não coluna: nome em inglês, tipo, chave e índice são da
Fase 1, e o glossário manda no vocabulário.

Grão é a decisão **irreversível**; DDL é a que se corrige. Por isso esta seção existe e por isso ela
é a parte da ficha que precisa sobreviver até a Fase 1.

**Os dois únicos freios que aceitei** para adiar grão fino (`RN-NUC-041`): custo **medido** (dono
`performance`, passo 5 — pedi, não presumi) e **minimização** de dado pessoal. Usei o segundo **uma
vez** (§3, `provider_customer_interaction`) e o primeiro **zero** vezes, porque não tenho medida.
"Não vamos precisar disso" não aparece em nenhuma linha.

**Regra de fronteira entre `RN-NUC-041` e `RN-NUC-044`, que colidem e ninguém separou:**
`RN-NUC-044` decide **se o fato existe**; `RN-NUC-041` decide **o grão de um fato que existe**.
Composição do dinheiro contado por espécie (`fatos-de-operacao.md` §6.5) é **fato novo**, não grão
mais fino de um fato existente → `RN-NUC-044` vence e a recusa de `produto` está certa. Sem esta
separação, "grão fino por padrão" seria argumento para reabrir toda a §6, e não é.

### 1. Veredito de grão — o caminho de venda (`fatos-de-operacao.md` §3)

Legenda: **CONFIRMO** = o grão candidato de `produto` está certo e eu o ratifico · **REFINO** = o grão
correto é mais fino ou mais preciso que o candidato · **REDUZO** = mais grosso, com o freio nomeado.

| Fato | Veredito | Torna respondível | **Impossível para sempre se nascer mais grosso** |
|---|---|---|---|
| `order_opened` | CONFIRMO — um fato por pedido | quantos atendimentos começam; conversão por terminal, por operador, por faixa | **o denominador**. Venda é numerador; tentativa é denominador. Denominador não capturado não se reconstrói de numerador nenhum — nenhuma taxa de conversão jamais existe, em nenhuma janela, para trás |
| `order_item_added` | **REFINO** — um fato por **lançamento**, não por (pedido, item) com quantidade acumulada | sequência de montagem da cesta; intervalo entre lançamentos (`RN-NUC-045`); item lançado e retirado | acumular quantidade por (pedido, item) faz **lançar 1 + lançar 1** e **lançar 2** virarem o mesmo dado, e faz **lançar + retirar** virar **linha que nunca existiu** (soma zero). Some a sequência, o intervalo, e o par lançamento↔retirada inteiro |
| `order_item_removed` | **REFINO** — um fato por retirada, **referenciando o lançamento** que ela retira, não o item | erro de operação × indecisão do cliente-final × falta de produto — as três ações diferentes que `produto` nomeou | sem a referência ao lançamento, "lançou 3, retirou 1" é ambíguo para sempre; e o **discriminador** das três ações é o **tempo entre lançar e retirar** e a posição na sequência. Contador de anulações destrói os três de uma vez |
| `order_abandoned` | **REFINO** — um fato por pedido morto, e a composição é **derivada**, nunca copiada | a cesta "quase vendida": o que o cliente-final quis e não comprou — o sinal mais rico que existe para "sugerir melhorias" | aqui a armadilha **não é agregação, é apagamento**: hoje o pedido morre e as linhas dele morrem com ele. O grão certo não é copiar as linhas para dentro do fato de abandono — é as linhas **não serem apagadas**. Copiar cria dois acervos que divergem; apagar torna a composição inexistente |
| `sale_concluded` | CONFIRMO — **por item de venda** (`sale_item`), mais o fato de cabeçalho | "qual produto não está compensando" — a pergunta literal do humano; devolução parcial; mix | só o total da venda mata **toda** análise de item, para sempre. E mata a devolução parcial: não se referencia um total |
| — atribuição de valor no item | **REFINO** — o item carrega **quantidade, preço unitário aplicado e o valor da linha como registrado**: os três | reconstruir arredondamento, preço promocional e diferença entre `preço × quantidade` e o que foi cobrado | guardar dois dos três torna o terceiro uma **conta que não fecha** em algum caso e ninguém sabe qual: arredondamento e preço composto não se re-derivam. É o defeito que aparece como "um centavo" e nunca se explica |
| `payment_registered` | CONFIRMO — um fato **por pagamento** (dividido = vários) | "coisas horárias de Pix" (literal do humano); necessidade de troco e sangria; negociação de taxa por adquirente | total por meio por dia impede referenciar **um** pagamento — logo impede estorno, cancelamento e conciliação de pagamento dividido. E some o recorte horário, que era o pedido |
| `discount_applied` | **REFINO** — um fato por aplicação, **declarando se o desconto é da linha ou da venda**, e qual linha | o limite publicado está no lugar certo (`RN-REL-011`); quem autorizou | desconto nascido só no nível da venda torna margem por item **um rateio inventado depois**, não um dado. E "qual produto não está compensando" passa a depender desse rateio: a resposta principal do humano fica sendo palpite |
| `sale_cancelled` · `return_registered` | CONFIRMO — fato novo referenciando o original, **por item** na devolução | recorrência é do caso ou do procedimento | edição do fato anterior apaga a prova (`dados.md` §4). Devolução sem item impede saber **o que** voltou |
| — motivo do cancelamento | **LACUNA** — não é grão, é campo que não existe | — | `RN-NUC-043` enumerou o motivo da **recusa** e ninguém enumerou o do **cancelamento**. Por `convention-campo-de-texto-livre-nao-e-campo-enumeravel`, enumerar depois **não estreita nada**: se nascer texto livre, "por que cancelamos tanto neste cliente" fica sem resposta para sempre. `PERGUNTAS: para produto` |
| `register_session_*` · `cash_movement` · `cash_difference` | CONFIRMO — um fato por movimento; sessão com esperado e contado | diferença é do caso ou do procedimento (`RN-REL-013`) | a **composição por espécie** fica de fora por `RN-NUC-044` (§0) — e o preço dessa recusa correta é que, se a decisão aparecer em 2027, a composição dos fechamentos de 2026 não existe. Preço declarado, não escondido |
| `fiscal_document_outcome` | **REFINO** — um fato por **desfecho**, incluindo cada tentativa, cada entrada e cada saída de contingência; o estado corrente é **derivado** | pendência do dia × estrutural (`RN-REL-014`); rejeição em massa por UF = defeito nosso | guardar o **estado final** sobrescreve a sequência de rejeições — e a sequência **é** o diagnóstico. "Rejeitou 3× e autorizou" e "autorizou" ficam idênticos |
| `peripheral_attempt_outcome` | CONFIRMO — um fato por tentativa, com classe, destino e desfecho | qual posto tem impressora que falha; classe que falha em N clientes | contagem diária de falhas perde o **denominador** (tentativas) — logo perde a taxa — e perde o padrão "falha só na terceira via" |
| `terminal_connectivity_state_change` | CONFIRMO — um fato por **transição**, com o domínio de entrada; nunca amostragem | permanência em `D1`/`D2`/`D3`; onde medir o orçamento offline | **amostragem periódica é a coarsening que não se desfaz**: o instante verdadeiro da transição nunca existiu, e a resolução da série fica congelada no período de amostra para sempre. Residência: §7 — este é o fato onde `F3` morde |

**Consequência de grão que nenhuma linha acima cobre, e é do meu território:** `order_opened` carrega o
**modo de atendimento** (`service_mode`). `service_mode` está no glossário e **não tem regra numerada
nenhuma** (`LACUNA-GLO-002`, resíduo declarado em `glossario.md:396`). Fato cujo conteúdo é um conceito
sem regra nasce com o grão indefinido — e este é de núcleo, então o valor **não** pode ser texto livre
nem código de vertical. `PERGUNTAS: para produto`.

### 2. Recusa, marcos e sincronização

**`operation_refused` — CONFIRMO um fato por tentativa.** A compressão de rajada que `produto` deixou
para mim: **não a autorizo**, porque o único freio que a autorizaria é custo **medido** e eu não tenho
medida (é a pergunta 2 ao `performance`). O que entrego é a **forma** que ela teria de ter se a medida
vier: comprimir uma rajada só é admissível preservando **primeiro instante, último instante e
contagem** — nunca menos que os três —, e a compressão é **fato datado e declarado** (`RN-NUC-041`,
infeliz), nunca default. Motivo: com os três, "o caixa 3 tentou 40 vezes entre 14:02 e 14:09" continua
respondível; sem a contagem, a rajada vira uma ocorrência e o sintoma desaparece exatamente onde ele
mora.

**Marcos (`§5`) — CONFIRMO duração derivada, sem campo de duração.** Um marco que a lista não tem e o
grão exige: **"confirmação do servidor"** não é um marco do fato de venda, é o desfecho de uma
**tentativa de sincronização** do item de fila. Grão: um fato por **tentativa**, com desfecho — não só
a confirmação final. Sem isso, "quanto tempo o dinheiro ficou só no terminal" existe, mas "quantas
tentativas foram necessárias" não existe nunca, e é ela que distingue link ruim de serviço nosso lento.
Nota de fronteira: a unidade deste fato é **tentativa de sincronização** — unidade da nossa
infraestrutura, logo passa `F1` da auditoria do passo 2. É um dos poucos que passa.

**`RN-NUC-046` tem uma consequência de grão no servidor que ninguém escreveu.** O descarte é contado
**no terminal**; se a contagem não **sobe**, o servidor não distingue "não houve recusa" de "houve
recusa e ela foi descartada". Então: **a contagem de descarte é ela mesma um fato que sincroniza, e
sincroniza com prioridade acima dos fatos de diagnóstico que ela contabiliza.** Sem essa inversão de
prioridade, o mecanismo que existe para tornar a lacuna visível é o primeiro a ser descartado.

### 3. Os fatos nossos (`fatos-de-operacao-provedor.md` §2)

| Fato | Veredito | **Impossível para sempre se nascer mais grosso** |
|---|---|---|
| `provider_read` | **REFINO** — um fato por **(ato de acesso, classe de objeto alcançada)**, com identificador de correlação comum ao ato | `produto` não resolveu qual é a unidade de "uma leitura": um painel que toca 12 classes é 1 fato ou 12? Um fato por sessão ou por painel torna "o que meu foi alcançado" irrespondível para o cliente, e mata a decisão **nossa** (alcance usado toda semana = capacidade de diagnóstico faltando). Um fato por classe **com correlação** dá as duas leituras sem grupo repetido |
| `provider_read_refused` | CONFIRMO — um fato por tentativa | — · **e ele decide residência**: ver §7 |
| `provider_user_edit` | **REFINO** — o fato é **trilha**, e a **mudança de estado é outro fato, do cliente** | `produto` diz que o fato nomeia **quais campos** e não o que passaram a valer — está certo (§4.6 do irmão). Mas então o estado do acesso da equipe **não é derivável deste fato**, e `RN-PRV-013` exige estado derivado. Logo são **dois** fatos: a mudança de atribuição (do cliente, carrega valor) e o ato nosso (nosso, carrega autoria, autoridade e quais campos). Colapsar os dois faz uma de duas coisas irreversíveis: ou a trilha vira **segundo acervo** (o que `RN-PRV-011` proíbe), ou o estado fica **inreconstruível** (o que `RN-PRV-013` proíbe). Não há terceira |
| `provider_module_change` / `module_state_change` | CONFIRMO um fato, dois autores possíveis — **e REFINO em duas frentes** | (1) o **efeito de cobrança declarado** é **congelado no fato**, nunca um ponteiro para tabela de preço mutável: com ponteiro, "por que a fatura foi aquela" morre na primeira mudança de preço. (2) **pedir e confirmar são dois fatos** (`RN-PRV-007` diz que o ato não se consuma sem confirmação): pedido-não-confirmado que não deixa fato torna "quantas mudanças nós pedimos e o cliente recusou" invisível — e essa é, pelo próprio motivo de `RN-PRV-012`, a informação de produto mais valiosa do arquivo. **Quem** confirma é `LACUNA-PRV-003`; **que o pedido é fato** não depende dela |
| `provider_customer_interaction` | **REDUZO — freio: minimização** (`RN-PRV-008` b, `RN-EMI-017`, `RN-OFF-023` item 5) | o fato carrega **presença** e **qual dado mínimo a interação exigiu, item por item** — nunca o conteúdo. O que fica impossível: reler a conversa para auditar o que dissemos. Aceito, e é o único lugar onde reduzo grão. Preço declarado: se um dia a disputa for sobre **o que** foi dito, a resposta não existe |
| `provider_concession_*` | **REFINO** — escopo **resolvido** e congelado no fato (cliente, estabelecimento, classe de operação, prazo), não referência a definição de papel mutável | com referência, mudar a definição do papel muda **retroativamente** o que a concessão de 2026 significava. É a mesma classe de defeito do ponteiro de preço |
| `provider_advice_issued` | **REFINO, contra a leitura fácil de `RN-PRV-011`** — o fato carrega **o valor que nós afirmamos**, mais as referências aos fatos e a versão da derivação | e isto **não** viola `RN-PRV-011`: o proibido é copiar **o conteúdo lido** (dado do cliente); o exigido aqui é registrar **o que nós asseveramos** (nossa saída). Sem o valor afirmado, "o número nosso estava errado" — a pergunta que o próprio humano abriu — é inauditável para sempre, e piora quando o cliente sai (`PN-10`) e os fatos-fonte vão com ele. A tensão é real e está declarada |

### 4. Ciclo de vida (`fatos-de-operacao-provedor.md` §3)

- `tenant_provisioned` — **REFINO**: um fato por cliente com instante e desfecho; **o conjunto de
  migrations aplicado é derivado** de `migration_applied`, não duplicado dentro dele. Duplicar cria
  duas verdades sobre a mesma coisa, e a divergência aparece no provisionamento que falhou no meio.
- `migration_applied` — **CONFIRMO** um fato por **(schema, versão)**, com desfecho e duração, falha
  inclusa. É exatamente a unidade de aplicação de `migrations.md` §2, e é o **único** fato desta ficha
  cuja casa já está decidida: o ledger é de `platform`, porque o **objeto** do fato é o schema, que é
  nossa infraestrutura. Guardar aqui o `checksum` não é escolha minha, é `migrations.md` §2.
- `module_state_change` — ver §3. Acrescento a consequência de classe: por ser **base de cobrança**,
  este fato herda o relógio de **obrigação**, não o nosso relógio discricionário (§8).
- `sales_enablement_granted` · `_renewed` — **CONFIRMO** um fato por ato, com estabelecimento e
  validade vigente. **REFINO**: a validade é **congelada no fato**, não lida da configuração corrente
  (`RN-OFF-028` deixa o valor mudar por cliente e com vigência) — sem congelar, "qual era a janela
  aberta quando o terminal foi furtado" muda de resposta quando alguém recalibra o número.
- `terminal_compromised` — **CONFIRMO**, e a **janela** (declaração → vencimento) é derivada dos dois
  fatos, nunca um campo. Um campo de janela mente no dia em que a validade for renovada.
- `tenant_offboarded` — PROVISÓRIA, e é o fato onde `PN-10` e a retenção colidem (§8).

### 5. Três vereditos transversais — os que valem para todos os fatos

**5.1 Nenhum fato carrega campo de calendário.** Nenhum fato desta família nasce com dia, data de
negócio, faixa horária, mês ou turno **derivado**. Só o instante. Motivo: dia é função de um fuso cujo
dono está **indecidido** (`LACUNA-GLO-001`, `RN-NUC-042`), e um fato nascido com `business_date`
transforma o fechamento daquela lacuna em **backfill em N schemas** — a coisa exata que esta ficha
existe para evitar. Consequência aceita e declarada: agrupar por hora ou por dia passa a ser trabalho
de **leitura**, não de filtro barato. Esse é o custo, ele é do `performance` precificar, e eu o
prefiro: leitura caras se conserta com índice; fato errado não se conserta.

**5.2 Todo fato carrega dois instantes: o declarado pelo terminal e o de recepção no servidor.**
`RN-OFF-019` faz da divergência de relógio um fato próprio — o que informa **que** houve desvio, não
**como** corrigir uma linha específica. Com os dois instantes, qualquer correção futura é derivável.
Com um só, escolher qual guardar é escolher qual pergunta nunca terá resposta: com o do terminal, "o
fato chegou quando?"; com o do servidor, "o fato aconteceu quando?" — e esta segunda é a que o negócio
usa. Dois instantes nascem juntos ou nunca.

**5.3 Identificador de correlação que atravessa clientes é chave de junção contrabandeada.** Se um ato
nosso que toca dois clientes gravar **o mesmo** identificador nos dois schemas, ele cria uma chave que
permite correlacionar clientes **sem nenhuma consulta cruzar schema** — basta duas exportações e um
`join` fora do banco. O isolamento por schema não vê isso, porque nada cruza em tempo de consulta.
Forma correta: o identificador gravado **dentro** de um schema de cliente é derivado por cliente; o
identificador global vive só do nosso lado. Estende a cláusula de
`decision-tenancy-schema-por-cliente` ("chave de cache, fila, log e exportação carrega cliente e
estabelecimento") para **chave de correlação de fato**, que é onde ela ainda não estava escrita.

### 6. `LACUNA-NUC-038` — os quatro fatos, nos dois ramos (não parei)

Conferi em disco: `nucleo-venda.md:157-158` diz, literal, *"o operador desiste no meio → o pedido
morre, e pedido morto não é venda: nada sobe"*; `nucleo-venda.md:92-99` põe o pedido em construção como
local ao terminal, mutável, fora da fila, e declara explicitamente que ele **não é fato imutável**. A
colisão é real e é de cláusula vigente. **Precisão que o passo 3 quase alcançou e vale cravar:** o
provisório não é o fato `order_item_added` inteiro — é o **histórico de item dos pedidos que nunca
viram venda**. Item de venda concluída já está garantido por `sale_concluded`.

**Ramo A — o humano revoga o "nada sobe".** Grão: os quatro como fato aditivo próprio (classe 1,
`RN-OFF-004`), append-only, um por acontecimento, com os dois instantes de §5.2. **Decisão de modelo
que o ramo A obriga, e eu a tomo agora para que ela não seja tomada por acidente depois:** o item de
venda (`sale_item`) **continua sendo fato próprio, congelado na conclusão** — ele **não** é derivado
do fluxo de lançamentos. Recuso a alternativa elegante (a venda ser a soma dos lançamentos menos as
retiradas) por três razões: o fato fiscal tem de ser legível **sem replay** de uma série; os dois têm
**relógios de retenção diferentes** (§8), e um fato fiscal cuja fonte expira é um fato fiscal
incompleto; e o replay depende de a série estar íntegra, o que `RN-NUC-046` explicitamente não garante
para fato de diagnóstico. Preço aceito e declarado: **o mesmo item aparece em dois fatos**. Duplicação
consciente, com a razão escrita, é melhor que dependência do fiscal sobre série sacrificável.

**Ramo B — o "nada sobe" fica.** O que fica impossível **para sempre**, e é a informação que o humano
precisa para decidir:

1. **O denominador.** Quantos atendimentos começaram. Nenhuma taxa de conversão existe para trás, em
   nenhuma janela — nem aproximada, porque não há de onde aproximar.
2. **A cesta quase vendida.** O que o cliente-final quis e não levou. É demanda que nunca virou venda:
   o insumo mais direto de "sugerir melhorias ao cliente", e o único que o concorrente não tem porque
   ninguém o grava.
3. **Tempo até concluir.** O humano pediu explicitamente; o marco inicial não existe, logo a duração
   não é derivável de nada (`RN-NUC-045` deriva de marcos, e falta o primeiro).
4. **Em que passo a desistência acontece.** A diferença entre "desistiu antes do primeiro item" e
   "desistiu no pagamento" são dois problemas de produto sem nada em comum.
5. **O par lançar↔retirar.** Erro de operação, indecisão e falta de produto ficam indistinguíveis para
   sempre (§1).
6. **Defeito nosso de superfície.** O mesmo item retirado em massa em N clientes é defeito nosso, por
   `produto`. No ramo B nós nunca vemos, e o cliente atribui ao operador dele.
7. **A hipótese offline fica infalsificável** — e este ninguém disse: sem fato de pedido aberto, "zero
   venda às 15h" não se distingue de "o terminal morreu no terceiro item às 15h". A série passa a ter
   duas explicações e nenhuma forma de escolher.

**Piso que o ramo B admite, e é piso, não alternativa:** o terminal **conta** pedidos mortos e
sincroniza só a contagem (com primeiro e último instante, pela forma da §2). Isso salva **1** e nada
mais: contagem responde "quantos", nunca "o que eles queriam". Ofereço porque recusar sem oferecer o
piso seria recusar capacidade; declaro que é estritamente pior e em quê.

**O que o humano precisa saber sobre o custo do prazo:** a decisão **não é retroativa**. Cada dia sem
ela é um dia de fato que não volta. Não escrevo quantos dias nem quantos pedidos — não medi.

### 7. `D-06` — proposta: são **três** residências, não uma decisão

Na forma de `D-05`: as saídas conhecidas, o defeito de cada uma, **nenhuma escolhida**
(`decision-d-05-catalogo-de-regra-fiscal-sem-casa` manda não escolher para destravar; vale igual aqui).

**7.1 A colisão, literal.** `dados.md` §1 diz as duas coisas: relatório consolidado "é agregação no
`platform` alimentada por processo explícito" **e** "nenhuma tabela de cliente vive no `platform`". A
pergunta da ficha é o que exatamente pode morar lá **sem ser tabela de cliente**.

**7.2 A linha candidata do plano colapsa, e a substituta que eu proponho.** "Fato do negócio do
cliente × medida do nosso serviço ao cliente" colapsa em grão fino, como o plano já sabia e como a
auditoria do passo 2 provou em `F1` (contagem de operações por hora por estabelecimento é a curva de
vendas em outra unidade). **Proponho outra linha: a residência segue o OBJETO do fato, nunca o
leitor.** Objeto é a coisa sobre a qual o fato afirma algo. `migration_applied` afirma sobre um
**schema** (nosso) → `platform`, e é por isso que o ledger de `migrations.md` §2 nunca pareceu
violação. `sale_concluded` afirma sobre uma **venda** (dele) → schema dele. `provider_read` afirma
sobre um **ato nosso** que *referencia* um cliente — e referência não é objeto.
**O defeito desta linha, que eu preciso declarar porque é ela que eu proponho:** ela não resolve
decomponibilidade. Um fato cujo objeto é nosso e que carrega referência a cliente **é decomponível por
cliente**, logo reprova numa leitura literal de `dados.md` §1 e cai no `F6` da auditoria (isolamento
deixa de ser propriedade da construção). A linha do objeto diz **quem é o dono do fato**; ela não diz
**onde o dado repousa sem quebrar a promessa**. São duas perguntas, e é por isso que `D-06` é três.

**7.3 As três perguntas que hoje estão amarradas numa só.**

- **(i) O agregado que soma clientes** — capacidade, custo, "qual módulo ninguém usa", pico agregado.
- **(ii) A trilha dos nossos atos e das nossas leituras** — `RN-PRV-011`, `RN-PRV-012`, `RN-PRV-006`.
- **(iii) A observação de operação por cliente** que `F1`–`F6` admite (permanência em `D2`, taxa de erro
  nossa, tentativa de sincronização).

**7.4 As saídas, e o defeito de cada uma.** (Nenhuma escolhida.)

| Saída | O que é | Defeito |
|---|---|---|
| **S1 — `platform`** | tabela no schema de controle | viola a leitura literal de `dados.md` §1 para qualquer coisa decomponível por cliente; tira dado do cliente do schema que o isola (`F6`); e cria um caminho de leitura **de sessão de cliente para o `platform`** (para cumprir `RN-PRV-006`) que é uma classe de caminho que **hoje não existe e nunca foi auditada** |
| **S2 — um terceiro schema nosso**, irmão do `platform` | separa controle (clientes, módulos, ledger) de operação nossa (trilha, agregado) | `dados.md` §1 conhece **dois** tipos de schema; criar um terceiro é alterar `decision-tenancy-schema-por-cliente`, que não é meu. E `migrations.md` §7 exige que a migration declare alvo `platform` **ou** cliente, "nunca as duas" — um terceiro alvo muda a semântica do ledger. Não resolve decomponibilidade: só a muda de endereço |
| **S3 — no schema do cliente** | o fato do nosso ato mora no cliente que ele afeta | (a) nossa pergunta passa a ser `O(schemas)` e a agregação explícita nos devolve a S1; (b) **`provider_read_refused` é impossível aqui** — ver 7.6; (c) quando o cliente sai (`PN-10`), a **prova da nossa conduta sai com ele**, e é justamente a prova que pode ser contra nós |
| **S4 — fora do banco de produto** | trilha/telemetria em acervo separado | perde a restrição declarativa do banco (é o defeito 3 de `D-05`); `RN-PRV-006` exige o **cliente** ler, então o caminho de serviço tem de existir de todo jeito; e um segundo acervo é um segundo controle de acesso e uma segunda retenção — exatamente o "segundo acervo" que `RN-PRV-011` recusa. Além disso `D-01` está aberta: não posso presumir infraestrutura |
| **S5 — duas gravações** | projeção legível pelo cliente no schema dele; projeção nossa do nosso lado | as duas divergem em silêncio (defeito 2 de `D-05`), e a divergência é indetectável por cliente; e dobra escrita num caminho que já disputa o crítico |

**7.5 O que muda por pergunta.** **(i)** só é admissível se a forma **no repouso** não se decompõe por
cliente (`F6`) — e aí S1/S2 servem. Mas há uma armadilha que ninguém nomeou: **não-decomponibilidade é
propriedade de N, e N começa pequeno.** Com três clientes, o agregado identifica cada um; e agregado
calculado enquanto N é pequeno **nunca** fica anônimo depois. Some-se a isso que agregado de período
**fechado** é derivação reconstruível e agregado de período **aberto** é cache
(`decision-agregado-de-periodo-fechado-nao-e-cache`, parte que **segue válida**): então (i) só é
admissível em **período fechado** e acima de um N mínimo — número que não é meu. **(ii)** precisa
sobreviver à saída do cliente (mata S3), precisa ser lida pelo cliente (encarece S4) e é decomponível
por construção (colide com S1 literal). **É a mais afiada, e é onde a decisão do humano importa.**
**(iii)** herda (i) mais a restrição de repouso que o passo 2 me passou: grão fino por estabelecimento
é **transitório** (existe para o incidente) e o que se **retém** é grosso por `F5`. Traduzido para
modelo: são **dois objetos com ciclos de vida diferentes**, não um objeto com política de acesso.

**7.6 A instância mais afiada, atacada de frente.** Os fatos de `RN-PRV-011`–`014` são atos **nossos**
dentro do ambiente **dele**. Três resultados, e os dois primeiros são derivados, não opinião:

1. **`provider_read_refused` não pode morar no schema do cliente.** O fato nasce porque o ator **não
   tinha** autoridade sobre aquele cliente. Gravá-lo lá exigiria escrita no schema que a recusa acabou
   de negar — e se o ator tivesse essa escrita, a recusa seria inócua. Logo este fato mora do nosso
   lado, **necessariamente**. Uma residência única para todos os fatos do provedor está descartada por
   construção.
2. **`RN-PRV-011` obriga o papel que só lê a ESCREVER no ambiente do cliente.** Se a trilha da leitura
   tem de ser legível pelo cliente no schema dele, então ler produz escrita lá — o que contradiz
   `RN-PRV-004` (lê amplo, não muta) e reabre `PRV-01` do passo 2 pelo lado da escrita. Saída possível
   (não escolhida): a escrita é da **plataforma**, não do papel — mas isso é um sujeito novo com escrita
   em N schemas, e é decisão de `seguranca`/`backend`, não minha.
3. **Partição possível, e é proposta:** o **efeito** do ato (módulo ligado, atribuição mudada) é estado
   **dele** → fato no schema dele, com **atribuição** de que foi ato de papel nosso; a **autoria e a
   autoridade** (qual pessoa nossa, sob qual cláusula, com qual motivo, e o índice que soma clientes)
   são objeto **nosso** → do nosso lado. Nada cruza em consulta: o cliente lê o schema dele, nós lemos
   o nosso. Defeito declarado: exige que a metade dele carregue atribuição suficiente para `RN-PRV-006`
   **sem** nomear a pessoa nossa — e se o cliente tem direito ao **nome** do nosso funcionário, a
   partição não fecha. **Ninguém perguntou isso**, e é `PERGUNTAS`.

**7.7 Condicionamento à fronteira (`LACUNA-PRV-002`, cravada no passo 2).** Se a fronteira ficar mais
**estreita**, (iii) encolhe, mais itens viram leitura de negócio sob `RN-PRV-010` com trilha, e o peso
de `D-06` migra de (i)/(iii) para **(ii)** — a trilha cresce e a residência dela passa a ser o problema
central. Se ficar mais **larga**, (iii) cresce, e a decomponibilidade por cliente no nosso lado passa a
ser o risco dominante: aí S1 sem forma irreversivelmente grossa **é** o vazamento por agregado. Em
qualquer dos dois, o que **não** muda: (ii) não pode morar em S3, e (i) não pode repousar em forma
decomponível.

### 8. Retenção — são **três** relógios, não dois

O brief pediu dois (obrigação × escolha nossa). Separo três, porque juntar o terceiro no segundo
permite encurtá-lo por custo, e ele é o único que não pode ser encurtado por custo:

1. **Obrigação** — venda, pagamento, movimento de caixa, desfecho de documento fiscal, **e
   `module_state_change`** (é base de cobrança, logo é fato financeiro por `dados.md` §4; consequência
   não óbvia e é minha). Append-only, sem soft delete, prazo **legal**. Não escrevo prazo e não cito
   norma: é `produto`/humano, com advogado.
2. **Prova (trilha)** — `provider_read`, `provider_read_refused`, os atos de `RN-PRV-012`, concessões.
   O prazo dela é o que a **cláusula de contrato** prometeu (`RN-PRV-010`), não o que nos convém: ela é
   a única prova de que o acesso foi legítimo, e é prova potencialmente **contra nós**. Encurtá-la por
   custo é apagar a prova adversa — e é por isso que ela não pertence ao relógio 3.
3. **Discricionário** — recusa, conectividade, tentativa de periférico, tentativa de sincronização,
   latência. É aqui, e só aqui, que custo medido é argumento legítimo.

**A forma do custo de "guardar para sempre para poder analisar depois"** — forma, não número, porque
não medi:

- **Volume** cresce como `O(fatos/dia × janela)` **por schema**, e o total como isso `× O(schemas)`. O
  teto é o **pior cliente**, nunca a média.
- **Janela de migration**, e este é o custo que ninguém orça: `migrations.md` §5 diz que constraint e
  mudança de tipo em tabela grande não são baratas e vão pelo ciclo de quatro etapas. Logo **retenção
  decide a viabilidade das migrations futuras**: quanto mais tempo guardado, mais caro fica cada
  mudança de estrutura, em N schemas, num sistema onde "o caixa não pode parar".
- **Restauração** — tabela maior é recuperação mais longa, e para PDV isso se mede em caixa parado.
- **Superfície** — cada classe retida é superfície de auditoria e de incidente (`seguranca.md` §3).
  Retenção não é só custo, é **passivo**.

**`PN-10` — o cliente sai e leva o dado dele. E nós?** Três objetos, três respostas, e a terceira é a
armadilha:

- **Fatos do negócio dele** → vão com ele; nós não ficamos. É `PN-10` e não há tensão.
- **Trilha dos nossos atos** (relógio 2) → **temos de ficar**, senão a prova da nossa conduta acaba
  quando a relação acaba, exatamente quando ela pode ser exigida. Isso quer dizer que **o dado sobre um
  ex-cliente permanece do nosso lado** — e é aí que `PN-10` tensiona: ele leva o dele, e nós ficamos com
  o registro de tudo o que fizemos no ambiente dele. **Por quanto tempo é pergunta para o humano**
  (`LACUNA-PRV-006`), e a grandeza é: *prazo de retenção da trilha de ato nosso após o encerramento*,
  unidade tempo, **sem valor**.
- **Agregado já grosso** → parece não ter nada a apagar, e é falso: com N pequeno, o agregado histórico
  **identifica** o cliente que saiu. Grandeza: *N mínimo de clientes para que um agregado seja retido*,
  unidade contagem, **sem valor**. Consequência irrecuperável no instante da captura: agregado
  calculado hoje, com N pequeno, não fica anônimo em 2028.

**Cruzando com `RN-NUC-046` — retenção no terminal ≠ retenção no servidor.** No terminal a retenção é
governada pela **ordem de sacrifício** e o descarte é **contado** (`LACUNA-NUC-039` é o número, dono
`performance`+humano). No servidor, quem governa é obrigação e passivo. Consequência de modelo: a série
do servidor tem **buracos por desenho**, e o buraco tem de ser **representável no servidor** — o que
exige o fato de contagem de descarte da §2. Terminal descartando e servidor sem saber é a série
mentindo por omissão com aparência de silêncio.

### 9. As cinco perguntas de `dados.md` §6

**9.1 Sobrevive a outro ramo e a outro fuso?**
**Ramo:** sim, com **duas ressalvas nomeadas**. (a) **Quantidade** é grandeza na unidade do item, com
**escala declarada pela unidade** — combustível e granel exigem casas decimais, e quantidade nascida
como contagem inteira bloqueia verticais inteiras (`dados.md` §3). O grão da quantidade pertence ao
catálogo de unidades, não ao fato. (b) `service_mode` em `order_opened` é o único conteúdo desta
família com risco de vazar vertical, e ele **não tem regra numerada** (§1) — se nascer texto livre ou
código de ramo, o núcleo passa a conter vertical. Fora dessas duas, nenhum fato desta família nomeia
mesa, bomba, comanda ou frota.
**Fuso:** sim, **por construção**, e é o veredito 5.1: só instante, nenhum campo de calendário. É o que
faz a família sobreviver a `LACUNA-GLO-001` **fechando para qualquer lado** — inclusive ao cliente com
dois estabelecimentos em fusos diferentes, que é onde o defeito aparece.

**9.2 Que consulta este modelo torna caro, e qual índice ela pede?** Forma, não número (não medi;
`performance` é o passo 5):
- *"qual produto não está compensando"* — varredura de item de venda na janela: `O(vendas × itens por
  venda)`, e pede caminho de acesso por **(item, instante)** dentro do cliente. Já é o pior caso medido
  em forma de `RN-REL-010` no registro de memória.
- *"que horas é o pico"* — varredura por **instante** com agrupamento **calculado** na leitura (5.1
  cobrou esse preço de propósito): pede caminho por instante, e a agregação não tem atalho de filtro.
- *trilha de leitura* — **a leitura do administrador gera escrita**: um painel que toca `k` classes
  produz `O(k)` fatos (§3). É a única consulta desta família cujo custo é de **escrita no caminho de
  leitura**, e ninguém a mediu.
- *`operation_refused` em rajada* — `O(tentativas)` de escrita no **caminho crítico do caixa**, junto
  com `order_item_added` e `terminal_connectivity_state_change` (os quatro que o passo 3 já mandou ao
  `performance`).
- *qualquer pergunta nossa* — `O(schemas)` de fan-out por cima do custo por cliente, medido no **pior**
  cliente. É a multiplicação que `performance.md` §2 chama de o caso perigoso.

**9.3 Qual conteúdo eu vou querer mudar em 6 meses — e por que está certo hoje?**
1. **As enumerações de motivo** (`RN-NUC-043` §4.1, `RN-PRV-012` §2.1). Vou querer acrescentar valor, e
   está certo hoje **porque são domínio fechado em tabela de lookup com código estável, não `enum` do
   Postgres** (`dados.md` §3): acrescentar valor é inserir linha, não migration em N schemas.
2. **A taxonomia de "classe de objeto" de `provider_read`.** Ela cresce a cada módulo. Certa hoje pela
   mesma razão: lookup, não enum.
3. **A escala da quantidade.** É a que mais me preocupa, e é a única desta lista que **não** tem
   mitigação boa: aumentar escala depois é mudança de tipo em tabela grande — ciclo de quatro etapas de
   `migrations.md` §4, em N schemas. Certa hoje só se a escala for escolhida pela vertical mais
   exigente **conhecida**, e não pela primeira. Entra na Fase 1 como decisão, não como default.
4. **O efeito de cobrança declarado em `module_state_change`.** Vou querer mudar a forma quando o
   modelo de preço mudar — e está certo hoje justamente porque é **congelado**: o que muda é a forma dos
   fatos novos, nunca a dos antigos.

**9.4 Isolamento: existe caminho em que uma consulta veja dado de outro cliente?** Cinco caminhos, e
**nenhum é entre clientes** (o eixo é nós ↔ cliente, corrigido pelo humano):
1. Trilha ou agregado decomponível por cliente alojado em `platform` → dado do cliente fora do schema
   que o isola; isolamento passa de construção a verificação (`F6`, §7).
2. Agregado com **N pequeno** → reidentificação do cliente dentro do agregado (§8).
3. `RN-PRV-011` exigindo escrita no schema do cliente por sujeito que serve N clientes → **caminho de
   escrita** cruzando tenant, que é pior que leitura (é `PRV-01` pelo outro lado; §7.6).
4. **Identificador de correlação global gravado em dois schemas** → chave de junção entre clientes que
   nenhuma consulta precisa cruzar para funcionar (5.3). É o caminho que o isolamento por schema não vê.
5. **Estabelecimento**, não cliente: o schema isola cliente
   (`decision-tenancy-schema-por-cliente`, cláusula de `AUT-01`; `LACUNA-NUC-019` aberta). Todo fato
   desta família carrega estabelecimento, e **toda chave de agregado derivado também tem de carregar** —
   é onde a cláusula existente ainda não estava escrita.

**9.5 Cardinalidade em 2 anos, e o que muda em cada faixa.** **Não escrevo o número, porque os três
parâmetros que o determinam não existem em documento nenhum deste repositório** (clientes,
estabelecimentos/terminais por cliente, vendas/dia e itens/venda no pior cliente). O que entrego é a
forma e as faixas:

`linhas ≈ clientes × estabelecimentos × vendas/dia × (1 + itens/venda + pagamentos/venda) × dias`,
mais os fatos de diagnóstico, que **não** escalam com venda e sim com **tentativa** — e é por isso que
`operation_refused` e `terminal_connectivity_state_change` podem ser os mais volumosos da base **sem
que ninguém espere**, num cliente com link ruim.

| Faixa (por schema) | O que muda |
|---|---|
| **10²–10⁴** | nada. Tudo é varredura, todo índice é luxo. É onde o primeiro cliente vive, e é a faixa que engana |
| **10⁵–10⁷** | caminho de acesso por instante e por (item, instante) deixa de ser opcional; retenção começa a decidir custo de migration; o pior cliente já não se parece com a média |
| **10⁸–10⁹** | **partição por tempo deixa de ser otimização e passa a ser pré-requisito de conseguir migrar** (`migrations.md` §5). E aqui está o ponto irreversível de calendário: introduzir partição depois, em tabela quente, é mudança destrutiva que exige o ciclo de quatro etapas em N schemas. **A decisão de particionar é da Fase 1, no nascimento da tabela — não é ajuste posterior.** O gatilho numérico é do `performance` |

### 10. Checklist de `migrations.md` §10 — respondido como restrição das migrations futuras

Não há migration nesta entrega (`D-04` aberta, `db/**` inexistente). Respondo o checklist como o
**compromisso** que as migrations desta família terão de cumprir — é a forma de o checklist ser útil
antes de existir DDL:

1. **Forward-only? Etapa destrutiva?** Nenhuma etapa desta família é destrutiva: fato é append-only por
   natureza (`dados.md` §4), e **nenhum fato desta família é soft-deletable** — o que responde uma parte
   de `D-04` por eliminação, em vez de presumir.
2. **Roda duas vezes? Vazio e com dado?** Requisito herdado (`migrations.md` §3). O que esta família
   acrescenta: a **seed dos domínios fechados** (motivos de recusa, motivos de ato nosso, classes de
   objeto) é `INSERT ... ON CONFLICT DO NOTHING` por **código estável** — logo o código do motivo é
   parte do contrato, e mudá-lo depois é mudar chave de negócio.
3. **Que lock, por quanto tempo, no maior cliente? `lock_timeout`?** Não sei, e é honesto: depende da
   faixa de 9.5, que depende de parâmetros que não existem. O que já sei: `lock_timeout` obrigatório, e
   índice em tabela de fato quente é `CREATE INDEX CONCURRENTLY` → migration sozinha, não transacional.
4. **Transacional?** Sim para a DDL das tabelas de fato; **não** para os índices concorrentes, que são
   migrations próprias, e a retomada precisa derrubar índice inválido criado por ela mesma.
5. **Alvo `platform` ou cliente?** Depende de `D-06`, e é exatamente por isso que `D-06` precisa fechar
   **antes** da primeira migration desta família: `migrations.md` §7 proíbe uma migration misturar os
   dois, e hoje eu não sei de que lado três dos objetos moram.
6. **Backfill?** Nenhum, e é a propriedade mais valiosa desta família: fato nasce no instante, não se
   preenche para trás. O corolário é o motivo da ficha: **o que não nascer agora não tem backfill que
   conserte.**
7. **Quem lê a estrutura antiga hoje?** Ninguém: não há estrutura, não há código, não há cliente em
   produção. É a única janela em que este modelo é grátis de acertar.

### 11. Convergência com o passo 5 (lido em disco, não é a seção dele na ficha)

`docs/auditorias/2026-08-23-custo-de-agregacao-do-provedor.md` (420 linhas) apareceu em disco enquanto eu
escrevia. Li o índice, os cabeçalhos e as linhas `MEDIDO:` dos oito achados — **não** o corpo inteiro.
Três convergências que mudam o peso do que escrevi acima, e nenhuma divergência encontrada:

- **`CST-01`: o freio "custo medido" não é exercitável hoje** — nada foi medido, e faltam os dois
  operandos. Isso **confirma** que usá-lo zero vezes (§0) era a única postura disponível, e transforma a
  minha recusa de compressão de rajada (§2) em consequência de regra, não em preferência.
- **`CST-02`: a ordem de sacrifício de `RN-NUC-046` deixa fora os quatro fatos de maior volume do caminho
  crítico.** Se estiver certo, a minha exigência de §2 (a **contagem de descarte** é fato próprio, e
  sincroniza acima do que ela contabiliza) passa a valer para mais classes do que eu supus, e o dono do
  enunciado é `produto`.
- **`CST-05`: retenção por classe e teto de janela de leitura são o mesmo número por dois lados, com dois
  donos e nenhuma regra ligando.** É o elo que falta na minha §8: os três relógios dizem **quanto tempo
  o fato vive**; o teto de janela diz **quanto a leitura pode varrer**. Fixar um sem o outro produz base
  que guarda o que nenhuma leitura alcança, ou leitura que promete janela que a retenção não tem.

## RELATÓRIO — arquiteto-dados — T-0004
STATUS: BLOQUEIO
FEITO:
- **Veredito de grão nos 25 fatos distintos das cinco tabelas** (12 do caminho de venda +
  `operation_refused` + 7 nossos + 6 de ciclo de vida, com `module_state_change`/`provider_module_change`
  contados uma vez), mais os **marcos** da §5 — e acrescentei **dois itens que faltavam** (atribuição de
  valor dentro do item de venda; motivo enumerado de cancelamento). Cada um com o que torna respondível
  e — a coluna que ninguém escreve — **o que fica impossível para sempre** se nascer mais grosso.
  **Contados um a um: 12 CONFIRMO, 14 REFINO, 1 REDUZO**, um sem veredito por depender de lacuna
  (`tenant_offboarded`) e um que é campo inexistente, não grão (motivo de cancelamento). O REDUZO é
  único e vem com o freio nomeado: **minimização**, em `provider_customer_interaction`. Usei o freio
  "custo medido" **zero** vezes, porque não tenho medida; "não vamos precisar disso" não aparece.
- **Separei `RN-NUC-041` de `RN-NUC-044`**, que colidem e ninguém tinha separado: `044` decide **se o
  fato existe**, `041` decide **o grão de um fato que existe**. Sem isso, "grão fino por padrão" seria
  argumento para reabrir a §6 de `produto` inteira — e não é: a recusa da composição por espécie está
  certa.
- **Três vereditos transversais**, que valem mais que qualquer linha de tabela: (a) **nenhum fato
  carrega campo de calendário** — só instante —, o que faz a família sobreviver a `LACUNA-GLO-001`
  fechando para **qualquer** lado, ao preço declarado de agrupamento caro na leitura; (b) **dois
  instantes** (terminal e recepção) nascem juntos ou nunca; (c) **identificador de correlação global
  gravado em dois schemas é chave de junção entre clientes que nenhuma consulta precisa cruzar** — o
  isolamento por schema não vê esse caminho.
- **`D-06` proposto como `D-05` foi**: nenhuma escolhida. E proposto **como três residências, não uma**
  (agregado que soma clientes · trilha dos nossos atos · observação de operação por cliente), no
  precedente de `decision-d-03-sao-tres-eixos-nao-uma-decisao`. Cinco saídas com o defeito de cada uma,
  e o condicionamento explícito a `LACUNA-PRV-002` nos dois sentidos.
- **Ataquei a instância mais afiada e ela deu dois resultados derivados, não opinião:** (1)
  `provider_read_refused` **não pode** morar no schema do cliente — gravá-lo exigiria a escrita que a
  recusa acabou de negar —, o que **descarta por construção** qualquer residência única para os fatos
  do provedor; (2) `RN-PRV-011` obriga o papel que **só lê** a **escrever** no ambiente do cliente,
  contradizendo `RN-PRV-004` e reabrindo `PRV-01` pelo lado da escrita.
- **Retenção em três relógios, não dois** (obrigação · **prova** · discricionário). O terceiro é o que
  o brief não previa e o que importa: juntar a trilha no relógio discricionário permite **encurtar por
  custo a única prova de que o nosso acesso foi legítimo** — prova potencialmente contra nós.
- **`LACUNA-NUC-038` entregue nos dois ramos, sem parar**: no ramo A, a decisão de modelo que ele
  obriga (o item de venda continua fato próprio congelado, **não** derivado do fluxo de lançamentos) com
  o preço declarado; no ramo B, **sete coisas impossíveis para sempre**, incluindo uma que ninguém tinha
  dito — sem fato de pedido aberto, "zero venda às 15h" nunca se distingue de "o terminal morreu às
  15h", e a hipótese offline fica **infalsificável**.
- **Checklist de `migrations.md` §10 respondido como restrição das migrations futuras**, o que produziu
  dois resultados úteis antes de existir DDL: **nenhum fato desta família é soft-deletable** (responde
  por eliminação uma parte de `D-04` em vez de presumi-la), e **`D-06` tem de fechar antes da primeira
  migration**, porque `migrations.md` §7 proíbe uma migration misturar `platform` e cliente e hoje eu
  não sei de que lado três objetos moram.
ARQUIVOS:
- `tarefas/T-0004-gestao-de-estabelecimentos-e-operacao-do-provedor.md` (editado — **só** a minha seção,
  acrescentada ao final; nenhuma seção de outro agent tocada)
- só leitura: `docs/produto/fatos-de-operacao.md`, `fatos-de-operacao-provedor.md`,
  `operacao-do-provedor.md`, `operacao-do-provedor-alcance.md`, `nucleo-venda.md`,
  `operacao-offline-e-sincronizacao.md`, `fila-local-conteudo-e-repouso.md`,
  `offline-grandezas-e-orcamento.md`, `modulos/relatorios.md` (`RN-REL-007`), `glossario.md` (parcial),
  `docs/auditorias/2026-08-23-operacao-do-provedor-e-console-de-gestao.md` (§2 inteira),
  `memory/plataforma/INDEX.md` + 3 registros
- **`db/**` não tocado** (a fase não abriu); `docs/arquitetura/**` não tocado (sem dono declarado —
  virou `PERGUNTAS`, não iniciativa); `memory/**` e `docs/auditorias/**` não tocados
NÃO FEITO:
- **Nenhum DDL, e é o desenho:** `D-04` ABERTA. Sem convenção de PK, timestamp e soft delete não há
  tabela, coluna, índice nem tipo — e a Fase 1 não abriu.
- **Grão dos fatos de módulo** (`MSA`, `COZ`, `PCF`, `PER`, `EMI` além dos dois que o caminho de venda
  atravessa): `produto` não os enumerou, então não há o que julgar. A disciplina que eles herdam está
  em `RN-NUC-041`/`043`/`044`; o de `COZ` (tempo de produção por ponto) é o que vai faltar primeiro.
- **Nenhum número**: não medi nada. Retenção, teto de descarte, N mínimo de agregado, escala de
  quantidade, gatilho de partição e cardinalidade ficaram como **grandeza com unidade e sem valor**.
DECISÕES:
- **"O que o fato carrega" declarado como conteúdo, não como coluna.** Grão é a decisão irreversível e
  ele **inclui** o conteúdo (um fato por lançamento *com preço aplicado* é grão diferente de um fato por
  lançamento sem ele). Nome em inglês, tipo, chave e índice ficaram integralmente para a Fase 1. Se essa
  linha for considerada DDL, quem a considerar aponta a frase e eu a retiro — mas então o veredito de
  grão fica incompleto por construção.
- **Recusei a modelagem elegante do ramo A** (venda = soma dos lançamentos − retiradas) por três razões
  escritas na §6. Preço aceito e declarado: **o mesmo item aparece em dois fatos**.
- **Autorizei zero compressão de rajada em `operation_refused`.** Entreguei a **forma** que ela teria de
  ter (primeiro instante, último instante e contagem — nunca menos) para o caso de `performance` medir
  custo. Autorizar sem medida seria usar o freio proibido.
- **Contrariei a leitura fácil de `RN-PRV-011` em `provider_advice_issued`:** o fato **carrega o valor
  que nós afirmamos**. Não é cópia do conteúdo lido (dado dele) — é registro do que nós asseveramos
  (nossa saída), e é a única coisa que torna auditável "o número nosso estava errado", que é pergunta
  aberta do próprio humano. Tensão declarada em vez de resolvida em silêncio.
- **Propus linha nova para `D-06`** (residência segue o **objeto** do fato, nunca o leitor) e **declarei
  o defeito dela na mesma frase**: ela diz quem é o dono do fato e **não** resolve decomponibilidade.
  É por isso que `D-06` é três perguntas e não uma.
RISCOS:
- **Memória com premissa vencida — reporto, não edito:**
  `memory/plataforma/decision-agregado-de-periodo-fechado-nao-e-cache`. **O que caiu:** a correção 1
  ("nenhuma das perguntas de relatório precisa de pré-agregação no `platform`... nenhuma soma clientes")
  — falsa desde 2026-08-23 para um leitor novo, nós. **O que sobrevive, e é a maior parte:** a distinção
  período fechado (derivação reconstruível) × período aberto (cache, cai na proibição inteira); a
  qualificação de "vazamento por agregado" para agregado alojado no `platform`, que a auditoria do passo
  2 reconfirmou em `F6`; paginação limita a saída, nunca a janela; transferir o dono não transfere o
  custo; e o pior caso em forma de `RN-REL-010`. **Consequência nova:** a distinção fechado × aberto
  passa a valer também para o agregado **que soma clientes**, e é ela que torna (i) de `D-06`
  admissível **só** em período fechado. Dono: orquestrador.
- **Decisão que `dados.md` §3 exige e que não existe:** a representação de **dinheiro** (inteiro em
  centavos × `numeric(14,2)`) tem de ser "uma escolha, para todo o sistema, registrada como `decision`"
  — e não há registro nenhum em `memory/plataforma/INDEX.md`. Não está em `D-04` e não é minha. Não
  bloqueia o veredito de grão (as duas opções são neutras de grão), **bloqueia a primeira DDL**.
- **`sale_cancelled` sem motivo enumerado.** `RN-NUC-043` enumerou o motivo da recusa e ninguém
  enumerou o do cancelamento. Por `convention-campo-de-texto-livre-nao-e-campo-enumeravel`, enumerar
  depois não estreita nada — é irrecuperável no mesmo sentido dos fatos desta ficha, e é barato agora.
- **`service_mode` sem regra numerada** (`LACUNA-GLO-002`, resíduo em `glossario.md:396`) e ele é
  conteúdo de `order_opened`. Fato de núcleo cujo conteúdo é conceito sem regra pode nascer com código
  de vertical dentro.
- **A escala da quantidade é a única coisa desta ficha sem mitigação boa.** Aumentar escala depois é
  mudança de tipo em tabela grande: ciclo de quatro etapas em N schemas. Se nascer pela primeira
  vertical, bloqueia as outras.
- **`RN-PRV-011` × `RN-PRV-004`** (leitura obrigando escrita no ambiente do cliente) é colisão de
  desenho, não de modelo, e eu não a resolvo. Dono: `seguranca` + `backend`.
- **Contagem de descarte de `RN-NUC-046` precisa sincronizar com prioridade acima do que ela
  contabiliza** — hoje isso não está escrito em lugar nenhum, e sem a inversão o mecanismo que torna a
  lacuna visível é o primeiro a ser descartado. Dono: `produto`.
- **Fora de escopo, uma linha:** a ficha passou de 400 linhas há muito tempo e a minha seção a leva a
  **1264** linhas (medido). Justificativa (`00-nucleo.md` §8): a ficha é artefato compartilhado append-only e o meu
  território (`db/**`) não existe nesta fase, então não há outro lugar legítimo. O orquestrador já se
  comprometeu a persistir esta seção em `memory/plataforma/`.
PERGUNTAS:
  - para humano: **`LACUNA-NUC-038`** — decide o ramo. A informação nova que eu acrescento à pergunta:
    a decisão **não é retroativa**, cada dia sem ela é fato que não volta, e o ramo B torna a hipótese
    offline **infalsificável** (§6, item 7). Se a resposta for "não", o piso da §6 (contagem de pedidos
    mortos) salva **um** dos sete itens.
  - para humano: **`D-06`, e ela é três perguntas** (§7.3). A que não pode ficar em aberto para a Fase 1
    é a **(ii)**, a trilha: ela não pode morar no schema do cliente (sai com ele, e `provider_read_refused`
    é impossível lá), e é decomponível por cliente por construção.
  - para humano: **o cliente tem direito ao nome da pessoa nossa** que agiu no ambiente dele, ou só ao
    papel e a um identificador? `RN-PRV-006` diz "legível por ele" e não diz isso. **A resposta decide
    se a partição de 7.6.3 fecha ou não** — e ninguém tinha perguntado.
  - para humano: **retenção** — três grandezas, unidade declarada, **sem valor**: (a) prazo da trilha de
    ato nosso **após** o encerramento do cliente (`PN-10` × `LACUNA-PRV-006`); (b) **N mínimo** de
    clientes para um agregado ser retido (com N pequeno o agregado identifica, e isso não se anonimiza
    depois); (c) prazo do relógio discricionário (recusa, conectividade, periférico, sincronização).
  - para humano: **território** — se esta seção precisar virar documento próprio na Fase 1, ela mora em
    `docs/arquitetura/**`, que não tem dono declarado no `CLAUDE.md` §4. Não escrevi lá por isso.
  - para `produto`: motivo enumerado de **`sale_cancelled`**, na mesma passada em que o campo nascer; e
    regra numerada para **`service_mode`**. As duas são irrecuperáveis pelo mesmo mecanismo desta ficha.
  - para `performance`: além das duas do passo 3 — (a) o custo de **escrita no caminho de leitura** da
    trilha (`O(k)` fatos por painel que toca `k` classes de objeto, §9.2); (b) o **gatilho numérico de
    partição por tempo** (§9.5), que é decisão de nascimento da tabela e não ajuste posterior; (c) o
    custo de agrupar por hora/dia **sem** campo de calendário (5.1) — é o preço que eu escolhi pagar, e
    quero saber quanto é.
  - para `seguranca` (passo 6): confirmar ou derrubar o resultado 7.6.1 (`provider_read_refused` não
    pode morar no schema do cliente) e o 7.6.2 (`RN-PRV-011` obriga escrita por papel de leitura). Os
    dois são derivações minhas sobre território seu.
VERIFICAÇÃO: não rodei teste — não há código, e `db/**` não existe (`ls -d db` → não existe, conferido).
Conferido em disco nesta data, arquivo e linha: `fatos-de-operacao.md` **381** linhas, as três tabelas
(§3 doze linhas, §4.1 oito motivos, §5 seis grandezas), `RN-NUC-041` a `046` lidas verbatim, §6 seis
recusas e §7 lacunas e perguntas; `fatos-de-operacao-provedor.md` **198** linhas, `RN-PRV-011` a `014`
verbatim, §2 sete fatos, §2.1 sete motivos, §3 seis fatos de ciclo de vida, §4 seis proibições;
`nucleo-venda.md:92-99` (`RN-NUC-001`, "não é fato imutável") e `:150-161` (`RN-NUC-003`, o "nada sobe"
em **:157-158**); `RN-OFF-001` a `009` verbatim (`operacao-offline-e-sincronizacao.md:28-107`),
`RN-OFF-020` (`:107`); `RN-OFF-023` (sete itens) e `RN-OFF-027` (`fila-local-conteudo-e-repouso.md:86-137`);
`RN-OFF-028` a `030` (`offline-grandezas-e-orcamento.md:16-60`); `RN-PRV-007`, `008`, `009`, `010` e §2,
§2.1, §2.2 (`operacao-do-provedor-alcance.md:20-48`, `:78-190`); os seis cabeçalhos `RN-PRV-001` a `006`
(`operacao-do-provedor.md`); `RN-REL-007` (`modulos/relatorios.md:207-213`); `glossario.md` — `order_item`
(**:71**), `sale_item` (**:73**), `order_item_note` (**:81**), `pending_operation_queue` (**:181**),
`sales_enabled_terminal` (**:32**), `price` (**:59**), e `service_mode` **sem regra numerada** em
**:396**; auditoria do passo 2 §2 inteira (`F1`–`F6`, o teste de admissão e as três "sem saída boa") e
os quatro `RISCOS` dela que me tocam; `memory/plataforma/INDEX.md` (48 linhas, filtrado por camada) e,
verbatim, `decision-d-05-catalogo-de-regra-fiscal-sem-casa`,
`decision-agregado-de-periodo-fechado-nao-e-cache`, `decision-tenancy-schema-por-cliente`. Do passo 5
(`docs/auditorias/2026-08-23-custo-de-agregacao-do-provedor.md`, **420** linhas, aparecido em disco
durante a minha escrita) li **só** o índice, os cabeçalhos e as linhas `MEDIDO:` dos oito achados — §11
diz o que tirei disso e o que **não** li.
**Busca feita:** nenhum registro de decisão sobre representação de dinheiro em
`memory/plataforma/INDEX.md`. **Não conferi na fonte:** `RN-NUC-002`, `008`, `012`, `013`, `029`, `031`,
`036`, `039`, `RN-EMI-007`, `017`, `022`, `028`, `033`, `038`, `RN-REL-005`, `008` a `014`, `RN-PER-004`,
`RN-OFF-013`, `014`, `015`, `016`, `019`, `024`, `PN-01`, `PN-07`, `PN-10`, `PN-15`, `PN-20` — citei-os
pelo que `fatos-de-operacao*.md`, `operacao-do-provedor*.md` e a auditoria do passo 2 afirmam deles.
**Não li** `nucleo-caixa-e-turno.md`, as três matrizes, nem norma alguma. **Nenhum número medido por
mim; nenhum número escrito.**
MEMÓRIA SUGERIDA:
  - type=convention escopo=plataforma slug=residencia-segue-o-objeto-do-fato-nao-o-leitor — o objeto é a
    coisa sobre a qual o fato afirma algo, e referência a cliente **não é** objeto: é por isso que o
    ledger de migration em `platform` nunca foi violação. **Defeito da própria linha, inseparável dela:**
    diz quem é dono do fato e **não** resolve decomponibilidade por cliente — por isso `D-06` é três
    perguntas
  - type=decision escopo=plataforma slug=d-06-sao-tres-residencias-nao-uma — agregado que soma clientes ·
    trilha dos nossos atos · observação de operação por cliente: cinco saídas, defeito em cada,
    **nenhuma escolhida**; e a mais afiada é a trilha, porque não pode morar no schema do cliente (sai
    com ele) nem repousar decomponível fora dele
  - type=gotcha escopo=plataforma slug=fato-do-provedor-nao-tem-residencia-unica —
    `provider_read_refused` **não pode** morar no schema do cliente: gravá-lo exigiria a escrita que a
    recusa acabou de negar, e se o ator a tivesse a recusa seria inócua. É derivação, não preferência —
    qualquer proposta de residência única para os fatos do provedor já está descartada
  - type=convention escopo=plataforma slug=fato-nao-carrega-campo-de-calendario — só instante; dia, data
    de negócio, faixa horária, mês e turno são **derivação de leitura**. É o que faz a família sobreviver
    a `LACUNA-GLO-001` fechando para qualquer lado, e o preço (agrupar sai caro) é de leitura, que se
    conserta com índice — fato errado não se conserta
  - type=convention escopo=plataforma slug=dois-instantes-nascem-juntos-ou-nunca — terminal **e**
    recepção no servidor: `RN-OFF-019` informa que houve desvio de relógio, não como corrigir uma linha.
    Guardar um só é escolher qual pergunta nunca terá resposta — "aconteceu quando?" ou "chegou quando?"
  - type=gotcha escopo=plataforma slug=correlacao-global-em-dois-schemas-e-chave-de-juncao — identificador
    de ato nosso gravado igual em dois schemas de cliente permite correlacionar clientes **sem nenhuma
    consulta cruzar schema**: duas exportações e um `join` fora do banco. O isolamento por schema não vê
    este caminho; o identificador dentro de um schema de cliente é derivado por cliente
  - type=convention escopo=plataforma slug=retencao-tem-tres-relogios — obrigação (legal) · **prova**
    (o que a cláusula prometeu) · discricionário (custo medido decide). Juntar prova em discricionário
    permite encurtar por custo a única evidência de que o nosso acesso foi legítimo — evidência
    potencialmente contra nós
  - type=gotcha escopo=plataforma slug=agregado-com-n-pequeno-identifica-o-cliente —
    não-decomponibilidade é propriedade de **N**, e N começa pequeno: agregado calculado com três
    clientes identifica cada um e **não fica anônimo depois**. Vale inclusive para o ex-cliente de
    `PN-10`, que levou o dado dele e continua no nosso histórico
  - type=convention escopo=plataforma slug=rn-nuc-044-decide-se-o-fato-existe-041-decide-o-grao — as duas
    colidem e a fronteira é esta: fato novo passa por decisão nomeada (`044`); grão de fato existente
    nasce fino (`041`). Sem a separação, "grão fino por padrão" reabre toda recusa de `RN-NUC-044`
  - type=gotcha escopo=plataforma slug=particao-por-tempo-e-decisao-de-nascimento — introduzir partição
    depois, em tabela de fato quente, é mudança destrutiva pelo ciclo de quatro etapas em N schemas.
    A decisão é da Fase 1, no nascimento da tabela; o gatilho numérico é do `performance`
PRÓXIMO PASSO SUGERIDO: `performance` (passo 5) com as três perguntas novas de §9.2/§9.5 somadas às duas
do passo 3 — em especial o gatilho de partição, que é **decisão de nascimento** e não ajuste. Depois
`seguranca` (passo 6) com 7.6.1 e 7.6.2, que são derivações minhas em território dele. Ao humano, na
mesma pauta e nesta ordem de alavanca: `LACUNA-NUC-038` (irrecuperável por dia), `D-06` (ii), o nome da
pessoa nossa na trilha, e a decisão de dinheiro que `dados.md` §3 exige e que não existe.

## performance (passo 5) — 2026-08-23

## RELATÓRIO — performance — T-0004
STATUS: OK
FEITO:
- **Prioridade um respondida com veredito, não com ressalva:** o registro do fato **não precisa ser
  sincrônico** ao lançamento, e a razão é **estrutural**, não de desempenho — `sale_concluded` tem grão
  **por item de venda**, então perder um `order_item_added` em voo não perde item vendido, não perde
  dinheiro e não perde obrigação fiscal: perde **ciclo de vida**. Entreguei as **seis garantias**
  (todas regra vigente aplicada a este fato) e as três medidas que fecham a decisão.
- **Cortei o susto pela metade antes de precificá-lo:** `order_item_added` **é** o registro do
  lançamento, não um segundo trabalho sobre ele, e o pedido em construção já é local (`RN-NUC-001`) —
  logo o custo em disputa é a **durabilidade local**, nunca o envio (que já é fila e já tem cessão ao
  caixa por `RN-OFF-030`).
- **Veredito duro do período aberto, e ele tem uma saída que ninguém tinha visto:** "que horas é o
  pico" **não é período aberto** — pico de hora/dia/mês encerrado é período **fechado**, logo derivação
  e não cache, e o acompanhamento **mensal e semestral** que o humano pediu é integralmente fechado. Só
  "acontecendo **agora**" é aberto. E **existe** forma de responder sem cache: a versão em unidade da
  **nossa** infraestrutura, agregada sobre todos os clientes, medida na **nossa borda** — `O(1)` em
  schemas, **sem fan-out**, sem tocar schema de cliente. A versão que **exige** cache é exatamente a que
  reprova `F1`/`F3` do passo 2. Custo e fronteira se dissolvem juntos, e não por sorte.
- **As três coisas a decidir antes de qualquer cache** escritas mesmo recomendando não haver cache: o
  que invalida (inclui correção retroativa, que atinge **período fechado**), qual é a chave (precisa do
  **sujeito de fuso**, `LACUNA-GLO-001`; chave errada é vazamento → `seguranca`), e quem é o **dono** da
  invalidação.
- **`LACUNA-REL-001` entregue como função, não como lista:** cinco medidas, cada uma com "se X, então
  A; se Y, então B", limiar declarado como **grandeza** e valor em aberto. Duas correções de substância:
  o que decide o eixo em (2) não é o mediano de itens por venda, é a **assimetria `p95/mediano`**; e em
  (5) a cardinalidade de motivo **já é conhecida** (8 + 7), então o que falta medir é a **distribuição**,
  porque é ela que decide se compressão de rajada tem freio.
- **Uma medida que falta em `LACUNA-REL-001` e a Fase 1 precisa:** a razão **retiradas ÷ lançamentos**.
  Sem ela, `LACUNA-NUC-038` chega ao humano **sem preço**.
- **Oito achados: cinco `ALTO`, três `MÉDIO`, nenhum `CRÍTICO`** (custo não vaza dado; o `CRÍTICO` desta
  ficha é do `seguranca`). Os cinco `ALTO` têm o mesmo formato: decisão que a **Fase 1** toma agora, cujo
  custo depois só se corrige com migration em N schemas ou com dado que nunca existiu.
- **Auditoria em dois arquivos irmãos, por eixo** (`onde o custo é pago`: servidor × terminal), com o
  motivo declarado nos dois cabeçalhos — o texto único fechou em **420 linhas**, acima do teto.
ARQUIVOS:
- `docs/auditorias/2026-08-23-custo-de-agregacao-do-provedor.md` (novo, 277 linhas) — eixo do servidor:
  período aberto, `LACUNA-REL-001`, multiplicação por cliente, retenção; `CST-03`, `04`, `05`, `06`
- `docs/auditorias/2026-08-23-custo-de-agregacao-do-provedor-caminho-critico.md` (novo, 190 linhas) —
  eixo do terminal: caminho crítico e volume de fato; `CST-01`, `02`, `07`, `08`
- só leitura: `fatos-de-operacao.md`, `fatos-de-operacao-provedor.md`, `operacao-do-provedor.md`,
  `operacao-do-provedor-alcance.md`, `offline-grandezas-e-orcamento.md`, `modulos/relatorios.md`,
  `modulos/relatorios-semente-de-perguntas.md`, `operacao-offline-e-sincronizacao.md`,
  `fila-local-conteudo-e-repouso.md`, `roadmap-de-modulos.md` §7, as duas auditorias do passo 2,
  `memory/plataforma/decision-agregado-de-periodo-fechado-nao-e-cache.md` e
  `state-pendencias-abertas-2026-08-23.md`
NÃO FEITO:
- **Nenhum número medido, e é o desenho do passo.** Não há `db/`, DDL, aplicação, terminal nem dado:
  zero `EXPLAIN`, zero tempo real. Está declarado em §1 dos dois arquivos e na §6/§5 de "o que não
  consegui verificar".
- **Não fechei `LACUNA-NUC-039`** (teto de fato de diagnóstico no terminal), que é minha: ela precisa de
  medida no terminal-alvo, e o terminal-alvo não existe como referência (`CST-08`).
- **Não avaliei os fatos de módulo** (`MSA`, `COZ`, `PCF`, `PER`, `EMI`): não estão enumerados (passo 3),
  então o volume que eles acrescentam é **desconhecido e não estimado** — não é omissão, é ausência de
  entrada.
DECISÕES:
- **Não propus cache em nenhum ponto**, e onde a pergunta do produto só se responde com ele, disse que
  **a pergunta** é o problema (unidade de negócio em período aberto), não o mecanismo. `CST-04` é achado,
  não preferência.
- **Não propus desnormalização, agregado materializado nem índice.** Onde a medida decide desenho de
  modelo (ordem de coluna de índice, partição, pré-agregado), entreguei **a medida e a função** e nomeei
  `arquiteto-dados` como dono. É `PERGUNTAS`, não palpite.
- **Não usei `PRV-` nem `AUT-`:** prefixo `CST-`, primeiro achado numerado de `performance` neste
  repositório (a consulta da T-0003 não escreveu arquivo).
- **Partição por eixo, não por prioridade.** O caminho crítico ficou no irmão e isso está declarado no
  cabeçalho do arquivo principal ("é lá que está a prioridade um"), com numeração de achado contínua.
- **Chamei `RN-NUC-046` de "dois níveis" e não de "três":** dinheiro cede por último, recusa e
  conectividade cedem antes — e os quatro fatos de ciclo de vida do pedido não estão em nenhum dos dois
  (`CST-02`).
RISCOS:
- **`CST-05` é o que morde mais tarde e mais fundo:** retenção por classe (`LACUNA-NUC-040`) e teto de
  janela de leitura (`LACUNA-REL-001`) são o **mesmo número por dois lados**, com dois donos e nenhuma
  cláusula ligando. O acompanhamento **semestral** que o humano pediu põe **piso** na retenção de toda
  classe que ele lê; e retenção abaixo da janela devolve série truncada que **nada** obriga a declarar —
  `RN-REL-005` cobre módulo desligado, não dado descartado por retenção.
- **`CST-03` é o risco de arquitetura que o passo 7 vai herdar:** o console é produtor nosso que compete
  com o caixa, exatamente como a drenagem — e a drenagem ganhou cláusula explícita (`RN-OFF-030`),
  o console não tem nenhuma. Enquanto `D-06` estiver aberta, a hipótese viva é que ele leia a **mesma
  instância que atende o caixa**.
- **`CST-01` é risco de processo com efeito irreversível:** o freio (a) de `RN-NUC-041` (custo **medido**)
  é o único legítimo, e hoje ele é **inalcançável** — faltam duas grandezas na tabela que existe para
  tê-las e falta o hardware-alvo. Freio inalcançável não protege nada: o grão acaba decidido por default
  no primeiro código.
- **A auditoria do passo 2 e a minha concordam sem ter se lido** ("hora de pico por estabelecimento não
  tem saída" × "só 'agora' é período aberto"), e as duas apontam para a mesma correção de produto. Isso
  é bom sinal, **e** é sinal de que a pergunta do humano sobre pico vai receber duas negativas com
  vocabulário diferente — vale consolidar em uma no passo 7.
- **Fora de escopo, uma linha:** `RN-OFF-014` conta o teto em **vendas concluídas pendentes**, e os fatos
  de diagnóstico enchem o mesmo disco sem entrar nessa contagem. A defesa existe (`RN-OFF-015`,
  `RN-NUC-046`), mas teto e enchimento passaram a ter unidades diferentes. Dono: `produto`.
PERGUNTAS:
  - para `arquiteto-dados`: a **classe de fato** que ele vai propor no passo 4 é a mesma unidade da
    **retenção** (`LACUNA-NUC-040`)? Se sim, `CST-05` fecha com uma cláusula; se não, preciso saber qual
    é a unidade para dizer sobre o que a janela incide.
  - para `arquiteto-dados`: o grão retido do fato de recusa é **por tentativa** (como `RN-NUC-043`
    propõe) ou comprimido em rajada? Não palpito — o freio de compressão é custo medido, e eu não medi.
  - para `produto`: `RN-NUC-046` recebe os quatro fatos de ciclo de vida do pedido no nível que cede
    junto com recusa e conectividade (`CST-02`)? É uma cláusula, e sem ela `LACUNA-NUC-038` chega ao
    humano sem a consequência à vista.
  - para humano: **qual é o terminal-alvo** (`CST-08`)? Sem referência nomeada, nenhuma medida de
    caminho crítico é reprodutível nem comparável entre releases — e é o mais barato de todos os itens
    desta ficha.
  - para humano: o console do provedor tem **orçamento próprio**, e ele **cede** ao caminho crítico do
    caixa como a drenagem cede (`CST-03`)? A resposta muda o desenho do passo 7 e entra em `D-06`.
VERIFICAÇÃO: **não rodei nada, e é o ponto do passo:** sem `db/`, DDL, aplicação, terminal e dado, não há
`EXPLAIN (ANALYZE, BUFFERS)`, tempo real, contagem de consultas nem tamanho de bundle. O que precisaria
rodar está escrito em §1 dos dois arquivos, dividido entre lado do banco (4 itens) e lado do terminal (3),
com o bloqueio de cada um nomeado. **Conferência de endereço em disco, um a um, nesta data:**
`fatos-de-operacao.md` (**381** linhas) :62-72, :91-116, :117-146, :148-169, :171-195, :197-220, :226-250,
:254-281, :285-301, :305-323, :327-381 — o "um fato por lançamento" está em **:375** e a pergunta 2 em
**:372-376**; `fatos-de-operacao-provedor.md` (**198**) :27-53, :55-80, :82-107, :109-133, :144-152,
:154-168, :174-181, :185-198; `offline-grandezas-e-orcamento.md` (**143**) :16-38 (`RN-OFF-028`), :40-52,
:54-72 (`RN-OFF-030`), :74-94, :101-125 (tabela de grandezas — **as três linhas de caminho crítico são
:121-123**, e **não existe** linha de custo de fato, de fato por lançamento, nem de espaço de fato de
diagnóstico), :131-143; `operacao-offline-e-sincronizacao.md` :65-70 (`RN-OFF-004`), :109-131
(`RN-OFF-020`), :202-208 (`RN-OFF-013`), :209-215 (`RN-OFF-014`), :216-223 (`RN-OFF-015`), :232-240
(`RN-OFF-019`); `fila-local-conteudo-e-repouso.md` :64-85 (`RN-OFF-022`); `modulos/relatorios.md` :92-112
(`RN-REL-002`), :155-178 (`RN-REL-005`), :179-206 (`RN-REL-006`), :207-226 (`RN-REL-007`);
`modulos/relatorios-semente-de-perguntas.md` :56-78 (`RN-REL-010`), :213-216 (`LACUNA-REL-001`);
`operacao-do-provedor-alcance.md` :78-100 (`RN-PRV-009`), :142-166 (`RN-PRV-010`); `roadmap-de-modulos.md`
:283-296 (`D-05`) e :297-311 (§7.2, grão do congelado); `.claude/rules/performance.md` §3 (**:23-33**, e a
linha de adicionar item é **:27**); auditoria do passo 2, `...-console-de-gestao.md` :69-131 (F1–F6) e
:132-152 (§2.1); `memory/plataforma/decision-agregado-de-periodo-fechado-nao-e-cache.md` :15-19, :21-32,
:34-35, :37-39. **Busca:** `modesto|terminal-alvo` em `docs/` e `memory/` → **três** ocorrências, nenhuma
especificando o aparelho; `CST-` no repo antes desta passada → **zero**. **Contagem de linhas medida:**
irmão do servidor **277**, irmão do terminal **190**, texto único antes da partição **420**. **Não
conferi na fonte:** `RN-NUC-001`, `RN-NUC-003`, `RN-NUC-008`, `RN-NUC-013`, `RN-FIS-004/005`, `RN-REL-009`,
`RN-REL-012`, `PN-01`, `PN-15` — citei-os pelo que `fatos-de-operacao*.md`, `roadmap-de-modulos.md` e a
auditoria do passo 2 afirmam deles. Não editei `docs/produto/**`, `memory/**`, nem os arquivos de
`seguranca` em `docs/auditorias/`.
MEMÓRIA SUGERIDA:
  - type=decision escopo=plataforma slug=pico-e-periodo-fechado-so-agora-e-aberto — "que horas é o pico"
    de hora/dia/mês **encerrado** é derivação de período fechado, não cache; só "quantas operações estão
    acontecendo **agora**" é período aberto — e a versão dele que **não** exige cache é a que conta na
    **nossa borda**, em unidade nossa, agregada sobre todos os clientes: `O(1)` em schemas, sem fan-out
  - type=gotcha escopo=plataforma slug=custo-de-painel-ao-vivo-e-por-recarga-vezes-schemas — o custo de
    período aberto não é por pergunta, é por **recarga × N schemas**, permanente e independente de alguém
    estar olhando: é o único tipo de leitura que degrada sem ninguém pedir nada, e cresce com a base de
    clientes
  - type=convention escopo=plataforma slug=medida-que-falta-e-freio-que-nao-existe — quando a regra admite
    "custo medido" como único freio a uma decisão irreversível, a **ausência da grandeza** na tabela de
    medidas não é lacuna menor: é o freio inexistente, e a decisão passa a ser tomada por default no
    primeiro código
  - type=convention escopo=plataforma slug=retencao-e-janela-de-leitura-sao-o-mesmo-numero — retenção por
    classe de fato e teto de janela de relatório são o mesmo número visto de dois lados; fechá-los em
    lacunas separadas, com donos separados, produz relatório especificado sobre período cujo fato já foi
    descartado — e série truncada por retenção chega ao leitor com a cara de "vendeu menos"
  - type=gotcha escopo=plataforma slug=fan-out-parcial-e-ausencia-apresentada-como-total — em N schemas,
    um schema indisponível é rotina (`migrations.md` §2); somar os que responderam e apresentar como total
    é a nossa versão do defeito que `RN-REL-005` proíbe do lado do cliente, e no consolidado é
    indetectável, porque ninguém sabe quanto o ausente teria somado
  - type=gotcha escopo=plataforma slug=fato-de-diagnostico-e-o-unico-volume-nao-limitado-pelo-negocio —
    `order_item_added` cresce com a venda; `operation_refused` cresce com `O(duração da falha × taxa de
    retentativa)` e `terminal_connectivity_state_change` com a instabilidade do link. O valor que governa
    o primeiro deles não está em `RN-OFF-028`: a cardinalidade de uma tabela da Fase 1 é função de um
    número que nenhuma regra declara configurável
  - type=convention escopo=plataforma slug=consumidor-nosso-do-banco-do-caixa-cede-como-a-drenagem-cede —
    a drenagem ganhou cláusula explícita de não competir com o caixa (`RN-OFF-030`); todo produtor nosso
    que lê a mesma instância — console, exportação, agregado — precisa da mesma cláusula, senão o único
    orçamento que não aceita regressão é gasto por quem não vende nada
PRÓXIMO PASSO SUGERIDO: `produto` — três cláusulas baratas que mudam desfecho e que o passo 6 vai
reauditar de qualquer forma: `RN-NUC-046` recebe os quatro fatos de ciclo de vida do pedido (`CST-02`);
as três grandezas ausentes entram na tabela de `RN-OFF-029` (`CST-01`, `CST-07`); e a cláusula de
retenção ≥ janela mais longa, fechando `LACUNA-NUC-040` e `LACUNA-REL-001` na mesma passada (`CST-05`).
Ao humano, na mesma pauta: **terminal-alvo** (`CST-08`) e **orçamento do console com cessão ao caixa**
(`CST-03`) — os dois mais baratos de responder e os dois que destravam medida.

### Nota de leitura cruzada com o passo 4 — acrescentada depois de entregar os dois arquivos

O relatório do `arquiteto-dados` (passo 4, paralelo) apareceu na ficha depois de eu fechar as duas
auditorias. Li a seção de retenção (§8), a de convergência (§11) e o relatório. **Duas das minhas
`PERGUNTAS` acima já estão respondidas, e eu as retiro:**

- **Unidade da retenção:** não é "classe de fato", são **três relógios** (obrigação · prova ·
  discricionário). Isso **corrige** a unidade que eu usei e deixa `CST-05` mais preciso, não menos: a
  cláusula "retenção ≥ janela mais longa de leitura publicada" pertence ao relógio **3**; nos relógios 1 e
  2 a janela é externa (prazo legal; cláusula de `RN-PRV-010`) e nenhuma leitura nossa a encurta. Nota
  acrescentada ao arquivo do servidor, §5.
- **Grão da recusa:** ele autorizou **zero** compressão de rajada e entregou a **forma** que ela teria de
  ter (primeiro instante, último instante e contagem) caso eu meça custo. Ou seja: o freio da compressão é
  **meu para produzir**, e enquanto `CST-08` (terminal-alvo) e as grandezas de `CST-01` não existirem, ele
  não existe. A recusa dele está certa por regra, não por preferência.

**Acolho dois custos de retenção que a minha conta não tinha** e que são dele: **janela de migration**
(retenção decide a viabilidade de toda mudança de estrutura futura, em N schemas — `migrations.md` §5) e
**tempo de restauração**, que em PDV se mede em caixa parado. Nenhuma divergência encontrada entre os dois
relatórios. Fica de pé, e agora com duas fontes independentes, que **`D-06` precisa fechar antes da
primeira migration** — eu chego lá pelo custo do fan-out (`CST-03`, `CST-06`), ele pela proibição de
`migrations.md` §7 de misturar `platform` e cliente numa migration.

## produto (conserto PRV-01 a PRV-10) — 2026-08-23

## RELATÓRIO — produto — T-0004
STATUS: PARCIAL
FEITO:
- **`PRV-01` desmontado pelos dois lados, e a exclusão caiu com data e custo escrito.** Em
  `operacao-do-provedor.md` §2 a **exclusão de `RN-NUC-018`** foi retirada e a frase falsa corrigida em
  disco: as três matrizes têm cinco colunas de papel e a quinta é `provider_support`, papel **nosso**
  (`papeis-e-permissoes.md:129`; `matriz-operacao-papel.md:54`) — o que não é coluna são os **dois papéis
  novos**. O enunciado de `RN-PRV-003` também era falso no mesmo ponto e foi corrigido: `provider_support`
  **é** coluna e permanece, recusada em toda linha, e é essa coluna que faz a não-instanciabilidade dele
  ser conferível. `RN-PRV-004` ganhou **cinco cláusulas do objeto**, com aceite próprio de quatro casos e
  infeliz de quatro partes.
- **A propriedade que o brief pedia ficou de pé em forma testável e sem presumir `D-03`:** o cliente-alvo
  é resolvido **fora** do pedido; identificador que o pedido informa **nunca resolve** o alvo — no máximo
  o **confirma**, e divergência é **recusa**, nunca correção silenciosa. Somei duas coisas que a auditoria
  pedia como requisito e não tinham lugar: **um cliente por ato e por escopo de trabalho** (espelho de
  `RN-NUC-024`), e **nenhuma superfície nossa tem cliente-alvo implícito**. Falha fechado explícito na
  cláusula (d): com `D-03` aberta, o ato nosso que nomeia cliente **não acontece**.
- **`RN-PRV-011` × `RN-PRV-004` resolvido no eixo, não por exceção.** O fato da nossa leitura é gravado
  **pela plataforma**, como precondição da leitura, e **gravar a própria trilha não é mutação**: o eixo de
  mutação mede alcance sobre o **dado do negócio do cliente**, nunca sobre o registro do próprio ato — é a
  forma de `RN-NUC-029` (ninguém diz que o `cashier` "muta" por deixar trilha). A cláusula (e) de
  `RN-PRV-004` diz o mesmo do outro lado, para as duas regras não divergirem. Mais três cláusulas de
  resultado: ninguém suprime o fato, ler **não** concede escrita, e **fato não gravável ⇒ leitura não
  acontece**.
- **A regra sobrevive às cinco saídas de `D-06` porque não fala de residência, fala de resultado:** o
  cliente lista as nossas leituras e nós não conseguimos apagá-las; residência que não sustenta as duas
  coisas é **residência recusada**, não promessa reduzida. Registrei a derivação do passo 4 —
  `provider_read_refused` **não pode** morar no schema do cliente recusado, logo **residência única está
  descartada por construção** — como **restrição** que `D-06` respeita, sem escolher nada.
- **A família inerte, os quatro:** `RN-PRV-015` declara o **default fechado do escopo `provedor`** no
  próprio escopo (operação sem célula é negada aos três papéis; célula é autoridade única; prosa é
  candidato), explicitando que apontar para `RN-NUC-026`/`039` importaria a **citação**, não a trava.
  `RN-PRV-016` fecha `PRV-03` pelo lado que é meu: **é vedado** sustentar ato nosso em atribuição do
  cliente ou em sujeito sintético, e sem valor possível no campo o ato **não acontece**. `RN-PRV-006`
  ganhou a **trava de concedibilidade** de `RN-NUC-024` (d) — nenhum dos três papéis é atribuível
  enquanto `LACUNA-NUC-031` estiver ausente (`PRV-04`) — e o **perímetro** de `PRV-05`: o que define o
  perímetro da trilha é o **cliente afetado**, nunca onde o objeto repousa.
- **`PRV-06` escolhido em voz alta: `RN-PRV-008` é inerte**, não vai para o piso de §2.2. As duas saídas
  dão hoje o **mesmo** desfecho e diferem no preço da resposta do humano — o piso é negativa absoluta e só
  cai por ato datado (`RN-PRV-010` d); a inércia cai com a resposta. Custo escrito, cláusulas preservadas,
  e o efeito colateral declarado: com a inércia, **`PRV-07` não tem caminho hoje** (nenhuma mensagem nossa
  entra no canal de `PCF`).
- **`PRV-10` fechado no vetor certo:** `RN-PRV-017` proíbe **valor, ordenação, posição, faixa ou
  comparação** derivada de outro cliente em **qualquer** artefato nosso endereçado a um cliente — tela,
  exportação, relatório, mensagem, sugestão **ou conversa de pessoa nossa** —, e declara que o agregado
  que soma clientes **não tem objeto de consentimento**, logo é lido só por nós. O mecanismo substituto é
  nomeado e é melhor: comparar o cliente **com ele mesmo**, que responde a mesma necessidade, é
  reconstruível dos fatos dele e sobrevive a `PN-10`.
- **Os três resíduos do passo 4:** `RN-NUC-047` dá ao cancelamento/devolução/estorno **motivo de lista
  fechada** (nove códigos, cada um dizendo o que diagnostica — inclusive `duplicate_record`, que é o único
  que aponta para nós, e `published_artifact_incorrect`, que impede erro de publicação virar erro de
  operador); `RN-NUC-048` dá regra numerada a `service_mode` e **fecha `LACUNA-GLO-002`**; e `RN-NUC-046`
  ganhou a inversão de prioridade — **a contagem de descarte é fato e sincroniza acima do que ela
  contabiliza**, com aceite próprio.
- **Duas partições declaradas, por teto de 400 linhas, ambas por eixo real** (contagens medidas abaixo).
ARQUIVOS:
- `docs/produto/operacao-do-provedor.md` (editado — **357** linhas) — `PRV-01` (§2, correção datada;
  `RN-PRV-003`; `RN-PRV-004` cláusulas do objeto + aceite + infeliz), `PRV-04`/`PRV-05` (`RN-PRV-006`
  cláusulas a/b/c + aceite), cabeçalho e §2.1/§3 remetendo aos irmãos
- `docs/produto/operacao-do-provedor-autorizacao.md` (**novo, 113** linhas) — `RN-PRV-015` e `RN-PRV-016`.
  Nasceu porque o arquivo acima fechou em **414** linhas com as duas dentro
- `docs/produto/operacao-do-provedor-alcance.md` (editado — **300**) — `PRV-06` (declaração de inércia de
  `RN-PRV-008`), `PRV-10` (`RN-PRV-017`), `LACUNA-PRV-004` cresceu com o objeto de consentimento
- `docs/produto/fatos-de-operacao-provedor.md` (editado — **233**) — `RN-PRV-011`: as quatro cláusulas da
  contradição, a consequência derivada, o aceite das cláusulas, e a linha de `provider_read_refused`
- `docs/produto/fatos-de-operacao.md` (editado — **377**, era 381) — `RN-NUC-046` (prioridade do
  descarte); §4 saiu para o irmão; cabeçalho, `RN-NUC-043` e as três referências a §4 apontando para lá
- `docs/produto/fatos-de-operacao-dominios-fechados.md` (**novo, 152**) — §4 movida **verbatim** (nenhum
  motivo acrescentado, removido ou reescrito) + `RN-NUC-047` + `RN-NUC-048`
- `docs/produto/glossario.md` (editado — **396**, sem crescer: uma linha substituída no lugar) —
  `LACUNA-GLO-002` **fechada**
- `docs/produto/README.md` (editado — **207**) — os dois conjuntos passaram a três arquivos; duas linhas
  de índice novas. Fora da lista do brief, e declarado em `DECISÕES`
- `tarefas/T-0004-...md` (editado — só esta seção, ao final)
- só leitura: `papeis-e-permissoes.md`, `papeis-atribuicao-e-delegacao.md`, `matriz-operacao-papel.md`,
  `matriz-operacao-papel-contrato.md`, `matriz-operacao-papel-modulos.md`, `nucleo-venda.md`,
  `superficie-por-papel.md`, `fronteira-do-nucleo.md`, `fiscal-custodia-e-trilha.md`, as duas auditorias
  do passo 2
NÃO FEITO:
- **Nada em `matriz-operacao-papel*.md`** (proibido pelo brief, e é lá que moram as três frases que
  destravam os papéis): a que nomeia a matriz do `provedor` em `RN-NUC-026`/`RN-NUC-039`, e a **quarta
  fonte** de `RN-NUC-029`. `RN-PRV-015` e `RN-PRV-016` foram escritas para **não depender** delas — o
  default do escopo e a proibição do valor errado valem por si. O que depende é os papéis **operarem**.
- **Os três pedidos do passo 5 ao `produto`** (`CST-02` — os quatro fatos de ciclo de vida do pedido na
  ordem de sacrifício de `RN-NUC-046`; `CST-01`/`CST-07` — as grandezas ausentes em `RN-OFF-029`;
  `CST-05` — retenção ≥ janela mais longa, fechando `LACUNA-NUC-040` + `LACUNA-REL-001`). Fora deste
  brief, e dois deles em arquivo fora da minha lista. A minha emenda de `RN-NUC-046` é **compatível** com
  `CST-02`: a cláusula da contagem vale para quaisquer classes que a ordem contenha.
- **`PRV-07`, `PRV-08` e `PRV-09` não foram consertados.** `PRV-07` e `PRV-08` pedem `RN-PCF-012`/`013`,
  de `modulos/pedido-cliente-final.md`, fora da minha lista; e a inércia de `RN-PRV-008` fecha o caminho
  dos dois **hoje**, sem fechar o defeito. `PRV-09` (leitor da trilha do nosso lado + terminador da
  regressão) precisa de um leitor nomeado que hoje não existe em papel nenhum — está em `PERGUNTAS`.
- **Nenhuma célula valorada, nenhum número escrito**, e `D-01` a `D-06` intocadas.
DECISÕES:
- **Duas partições, e o eixo de cada uma é declarado no cabeçalho dos dois lados.** (1)
  `operacao-do-provedor-autorizacao.md`: eixo *quais papéis existem × o que alcançam × **a trava que o
  escopo não herda de ninguém***; as duas travas são a mesma espécie de defeito (`PRV-02` e `PRV-03` são
  "regra nova que não alcança a trava alheia"), então elas ficam juntas e não espalhadas. (2)
  `fatos-de-operacao-dominios-fechados.md`: eixo *o fato × **o domínio fechado de valor que ele
  carrega***; movi a §4 (recusa) para lá **junto** com as duas listas novas, senão o eixo nasceria vazando
  — uma lista fechada num arquivo e duas em outro é a colisão de prefixo em outra forma.
- **`PRV-06`: escolhi inércia e não o piso, e a razão é o preço de desfazer.** Piso de §2.2 é negativa
  absoluta; desfazê-lo exige ato datado, custo escrito e célula corrigida (`RN-PRV-010` d). Pôr no piso
  seria decidir por nós uma questão que é do humano com advogado **e** cobrar dele o rito de revogação
  para desfazer o que ninguém decidiu. Hoje as duas dão o mesmo desfecho: nenhum acesso.
- **Contrariei a redação sugerida em um ponto de `PRV-01`, e é por precisão, não por gosto.** O auditor
  propôs "`RN-PRV-003` perde a exclusão"; eu tirei a exclusão **e** corrigi o enunciado dele, porque a
  frase "nenhum é coluna das matrizes de cliente" é **falsa** para `provider_support` — era a contradição
  que o próprio relatório do passo 2 registrou nos `RISCOS`, e ela cairia de novo na próxima leitura.
- **Escrevi a resolução de `RN-PRV-011` × `RN-PRV-004` como cláusula do eixo, e não como exceção.** A
  alternativa era escrever "a trilha é exceção à regra de mutação" — recusada: exceção nomeada num eixo é
  o começo de um segundo eixo, e o próximo caso ("mas ligar módulo também é só registro") entra por
  analogia. Definir *o que o eixo mede* fecha por construção.
- **`RN-PRV-017` cobre conversa de pessoa nossa, não só artefato.** É o furo real de `PRV-10`: o
  comparativo sai pela boca antes de sair pela tela, e regra que só fala de artefato deixa o veículo mais
  barato aberto.
- **Editei `README.md`, que não está na lista do brief.** Criei dois arquivos; índice defasado é pior que
  índice ausente, e a alternativa era entregar dois arquivos que o índice do território nega. Duas linhas
  novas e três frases corrigidas, nada mais.
- **`RN-NUC-048` não decide *quem escolhe* o modo de atendimento** (operador a cada pedido × default
  publicado do estabelecimento): isso é superfície e configuração, e presumir aqui seria escrever tela.
  A regra decide o que o brief pedia: **falta** (não existe valor "não informado"; a venda não conclui) e
  **muda** (cada fato carrega o modo vigente no instante dele; mudança em construção é alteração local de
  `RN-NUC-001`, não fato novo — o que evita colidir com `LACUNA-NUC-038`).
RISCOS:
- **O escopo `provedor` hoje não opera nada, e isso é acumulação de três travas independentes** —
  `RN-PRV-004` (d) com `D-03` aberta, `RN-PRV-006` (b) com `LACUNA-NUC-031` ausente, `RN-PRV-015` sem
  matriz. Está escrito e é o desfecho correto, mas o passo 7 vai encontrar um console cujo primeiro
  requisito é **não fazer nada**; se alguém tratar isso como bug, as três caem juntas.
- **`RN-NUC-047` e `RN-NUC-048` são regras de núcleo escritas num arquivo de *fatos*.** A casa natural do
  modo de atendimento é `nucleo-venda.md` e a do motivo de correção é `RN-NUC-008` — nenhum dos dois está
  na minha lista. Ficam no irmão dos domínios fechados, corretamente numerados e citados; **quando alguém
  mexer em `RN-NUC-008` ou em `RN-NUC-001`, o risco é não achá-las.**
- **`RN-NUC-046` continua sem contemplar `CST-02`** (os quatro fatos de ciclo de vida do pedido na ordem
  de sacrifício). A minha emenda protege a **contagem**; ela não decide o que entra na ordem.
- **A frase "cada fato carrega o modo vigente no instante dele" pressupõe que `order_opened` exista.** Com
  `LACUNA-NUC-038` no ramo B, só o modo da conclusão existe, e "quantos atendimentos mudam de modo" morre
  com os outros sete itens do passo 4. A regra sobrevive às duas respostas; a **leitura**, não.
- **`RN-PRV-016` proíbe o valor errado e não cria o valor certo.** Enquanto `RN-NUC-029` não admitir a
  quarta fonte, a regra é uma proibição com desfecho fechado — que é melhor que o buraco, e é pior que a
  frase que falta. Se o passo 7 chegar antes dessa frase, o construtor vai encontrar `RN-PRV-016` e um
  campo sem valor possível.
- **Não auditei os itens de `fatos-de-operacao*.md` contra `F1`–`F6`** (é o passo 6, e o passo 2 declarou
  que a fronteira é texto até isso acontecer). Minhas emendas não movem nenhum item para dentro ou para
  fora da fronteira.
PERGUNTAS:
  - para humano (o mesmo dono das três, e as três são frases): **(1)** `RN-NUC-026` e `RN-NUC-039` passam
    a nomear a **matriz do escopo `provedor`** (default negado e precedência da célula)? **(2)**
    `RN-NUC-029` admite a **quarta fonte** — "papel de escopo `provedor`, nomeado, com o cliente-alvo
    resolvido no próprio registro"? **(3)** Sem (2), nenhum papel nosso pratica ato nenhum: confirma que
    esse é o desfecho até a frase existir? As três são de `matriz-operacao-papel*.md`, que este brief me
    proibiu de tocar, e nenhuma delas é valor de célula.
  - para humano, com advogado (já na fila, e agora com a escolha feita do meu lado): em que base o dado
    pessoal de **cliente-final** é alcançado por nós, já que ele não assinou o nosso contrato? Enquanto
    não houver resposta, **`RN-PRV-008` está inerte** — nenhuma interação nossa com cliente-final
    acontece. A resposta a destrava sem revogar nada.
  - para humano: **`PRV-09`** — quem, do nosso lado, lê a trilha do nosso próprio uso? `RN-PRV-005` (b)
    exige que não seja quem porta o alcance auditado, e os dois candidatos existentes não servem
    (`provider_operator` lê estreito; `provider_support` não é instanciável). Sem um leitor nomeado eu não
    escrevo a regra, e o terminador da regressão ("a leitura da trilha é registrada uma vez, e o registro
    do registro não é ato") depende dele.
  - para `seguranca` (passo 6): a resolução de `RN-PRV-011` × `RN-PRV-004` — **gravação é da plataforma, e
    trilha não é dado do negócio** — fecha `PRV-01` pelo lado da escrita, ou cria um sujeito novo com
    escrita em N schemas que precisa de achado próprio? Escrevi a propriedade (ninguém suprime, ler não
    concede escrita, fato não gravável impede a leitura) e **não** o mecanismo.
  - para `arquiteto-dados`: `RN-NUC-047` e `RN-NUC-048` chegam a tempo do veredito de grão, ou o passo 4
    já fechou? As duas listas são domínio fechado em lookup com código estável, como as suas §9.3 pede.
VERIFICAÇÃO: não rodei teste — não há código. Conferi endereço em disco, um a um, nesta data:
`papeis-e-permissoes.md` :75-104 (`RN-NUC-018`; a frase do escopo por identificador **é** a **:101**;
"avaliada contra o escopo do **objeto**" em **:78-80**), :123-129 (a tabela dos cinco; `provider_support`
em **:129** com "De quem" = **nosso**); `matriz-operacao-papel.md` :48-52 (a nota do `Offline`) e **:54**
(a linha de cabeçalho — a quinta coluna de papel **é** `provider_support`), :81 (linha 26);
`papeis-atribuicao-e-delegacao.md` :284-299 (`RN-NUC-024`; a trava de concedibilidade de (d) em
**:293-295**; as três negativas em **:298-299**); `matriz-operacao-papel-contrato.md` :36-42 e :57-59
(`RN-NUC-026`, "aos cinco papéis" em **:59**), :159-207 (`RN-NUC-029`, "exatamente uma de três" em
**:161-165**; "impedir a gravação do registro impede o ato" em **:195-196**, e o infeliz que recusa o ato
antes de ele acontecer em **:205-207**), :213-222 (`RN-NUC-039`, "as duas
matrizes" em **:214** e **:218**); `matriz-operacao-papel-modulos.md` :166-171 (as quatro linhas de
leitura; "consultar dado de pessoa fora da venda" **é** a **:169**) e :173-175 (nota ⁷);
`superficie-por-papel.md` **:328** (`LACUNA-NUC-031`, estado **ausente**); `fronteira-do-nucleo.md`
**:58** ("Registro de módulos ativos por cliente | plataforma"); `fiscal-custodia-e-trilha.md` :295-301
(`RN-EMI-040`; o enunciado proíbe **valor** em **:299-301**); `nucleo-venda.md` :267-292 (`RN-NUC-008`,
com "autor, instante e motivo" em **:269-270**) e :294-298 (`RN-NUC-038`, "resolve o objeto **dentro** do
cliente … a partir da identidade autenticada"); `glossario.md` **:80** (`service_mode`, domínio mínimo:
presencial × entregue em endereço), **:383** (`channel`, "não confundir com modo de atendimento"),
**:396** (`LACUNA-GLO-002`, que eu fechei); as duas auditorias do passo 2 inteiras (318 e 155 linhas) e as
seções `## seguranca (passo 2)` e `## arquiteto-dados (passo 4)` desta ficha. **Contagem de linhas
medida** por busca de linha (ripgrep em modo contagem — não tenho shell nesta sessão), arquivo por
arquivo, depois da última edição: `operacao-do-provedor.md` **357**
(chegou a **414** com as duas travas dentro, e foi por isso que partiu), `-autorizacao.md` **113**,
`-alcance.md` **300**, `fatos-de-operacao.md` **377** (era 381), `-provedor.md` **233**,
`-dominios-fechados.md` **152**, `glossario.md` **396** (não cresceu), `README.md` **207**. **Não li**
norma alguma e **não afirmo base legal** em nenhum ponto — inclusive em `PRV-06`, onde a consequência que
nomeio é de autorização. **Não conferi na fonte:** `RN-NUC-001`, `002`, `003`, `013`, `014`, `031`,
`036`, `RN-OFF-015`, `019`, `027`, `028`, `RN-EMI-017`, `021`, `RN-FIS-006`, `RN-PCF-012`, `013`,
`RN-PER-004`, `PN-10`, `PN-11` — citei-os pelo que os arquivos do meu território e as duas auditorias
afirmam deles. **Nenhum número medido por mim entrou em regra; nenhum número novo foi escrito.**
MEMÓRIA SUGERIDA:
  - type=convention escopo=plataforma slug=exclusao-de-regra-se-justifica-pelo-objeto-nao-pelo-sujeito —
    confirmada em uso e com o segundo lado: antes de declarar regra inaplicável a um sujeito novo,
    pergunte **de que lado ela fala**. `RN-NUC-018` fala do objeto, e todo objeto de ato nosso pertence a
    um cliente — a exclusão pelo sujeito retirou a cláusula anti-IDOR sem que nada acusasse
  - type=business-rule escopo=plataforma slug=cliente-alvo-do-papel-nosso-nao-vem-do-pedido — o
    identificador que o pedido informa **nunca resolve** o cliente-alvo: no máximo **confirma** o alvo já
    resolvido, e divergência é **recusa**, nunca correção silenciosa. Mais: um cliente por ato e por
    escopo de trabalho, e nenhuma superfície nossa com cliente-alvo implícito (`RN-PRV-004`, cláusulas do
    objeto)
  - type=business-rule escopo=plataforma slug=gravar-a-propria-trilha-nao-e-mutacao — o eixo de mutação
    mede alcance sobre o **dado do negócio do cliente**, nunca sobre o registro do próprio ato; a
    gravação é da **plataforma**, é precondição da leitura (forma de `RN-NUC-029`), e fato não gravável
    **impede** a leitura. É o que resolve `RN-PRV-011` × `RN-PRV-004` sem criar exceção de eixo
  - type=convention escopo=plataforma slug=promessa-de-trilha-se-escreve-como-resultado-nao-como-lugar —
    regra que promete legibilidade **não** escolhe residência: exige o resultado (o cliente lista, nós não
    apagamos), e residência que não o sustenta é **recusada**. É o que faz a regra sobreviver às cinco
    saídas de `D-06` sem presumir nenhuma
  - type=business-rule escopo=plataforma slug=nada-entregue-a-um-cliente-carrega-forma-de-outro — valor,
    **ordenação, posição, faixa ou comparação** derivada de outro cliente é vedada em tela, exportação,
    relatório, mensagem, sugestão **e conversa de pessoa nossa**; `RN-EMI-040` proíbe **valor**, e o
    vazamento mora na **forma**. O agregado que soma clientes não tem objeto de consentimento
  - type=convention escopo=plataforma slug=inercia-declarada-custa-menos-que-negativa-absoluta — quando
    falta base para uma classe de dado, declarar a regra **inerte** e pôr a classe no **piso** dão hoje o
    mesmo desfecho; o piso, porém, só se desfaz por ato datado com custo escrito e célula corrigida. Na
    dúvida sobre pergunta que é do humano, **inércia** — reversível pela resposta
  - type=convention escopo=plataforma slug=enumeracao-nasce-com-o-campo-ou-nao-nasce — aplicada duas
    vezes: motivo de **cancelamento** (`RN-NUC-047`) e **modo de atendimento** (`RN-NUC-048`) nasceram com
    lista fechada porque enumerar depois, sobre texto livre, não estreita nada. O campo enumerado tem de
    separar **causas que se parecem para quem opera e são diferentes para quem conserta**
PRÓXIMO PASSO SUGERIDO: `seguranca` (passo 6) — reauditar este conserto, com dois pontos que são
derivação minha em território dele: a resolução de `RN-PRV-011` × `RN-PRV-004` (gravação da plataforma) e
a suficiência das cláusulas do objeto de `RN-PRV-004` para fechar `PRV-01` **antes** de `D-03`. Em
paralelo, ao humano: as **três frases** de `matriz-operacao-papel*.md` (as duas travas mais a quarta
fonte), que são o que hoje mantém os três papéis inoperantes — e são frases, não decisões de célula.

## seguranca (passo 6 — gate de fecho) — 2026-08-23

## RELATÓRIO — seguranca — T-0004
STATUS: OK
FEITO:
- **`PRV-01` fecha, e o cenário que eu provei termina em recusa.** As cláusulas do objeto de `RN-PRV-004`
  (`operacao-do-provedor.md:202-216`) e a correção datada de §2 (`:111-135`) fecham o caminho pelos dois
  lados, e o aceite de `:233-241` é o meu cenário verbatim com o desfecho invertido — inclusive as duas
  bordas que eu não havia pedido (nada gravado **nos dois** clientes; a recusa não revela que B existe).
  **Duas coisas melhores que a minha sugestão:** o enunciado falso de `RN-PRV-003` foi corrigido (era
  contradição que eu havia deixado em `RISCOS`, não em achado), e (d) transformou `D-03` aberta em desfecho
  declarado em vez de pendência.
- **A propriedade se sustenta sem presumir `D-03`, e a distinção é a que importa:** `RN-PRV-004` (b) não
  **escolhe** o mecanismo de chegada do tenant — ela **elimina uma família de respostas** e escreve o
  custo. Restringir o espaço é trabalho de spec; escolher dentro dele seria `00-nucleo.md` §3. O que falta
  é a restrição aparecer **onde `D-03` será decidida** → `PRV-15`.
- **Veredito nas três derivações que o `produto` e o `arquiteto-dados` me dirigiram:** (i) "gravar a
  própria trilha não é mutação" **fecha** o lado da escrita do papel, e o mecanismo é o certo (define o que
  o eixo mede, não abre exceção); cria **um** escritor novo — a plataforma —, que não merece achado como
  sujeito e merece achado numa instância, `PRV-11`. (ii) A promessa como **resultado, não lugar** é
  auditável **pela metade**: "o cliente lista" é verificável pelo aceite contra as cinco saídas de `D-06`;
  "nós não conseguimos apagá-las" é promessa sem mecanismo → `PRV-14`. (iii) `provider_read_refused` fora
  do schema do cliente: **confirmo a conclusão e derrubo o argumento** — quem grava não é o ator, é a
  plataforma, que escreve em todo schema por construção, então "exigiria a escrita que a recusa negou" é
  falso; o motivo correto é que no instante da recusa **não existe cliente-alvo resolvido**, e escolher
  residência pelo identificador informado é usar o identificador que `RN-PRV-004` (b) acabou de declarar
  não-autoritativo. Conclusão certa com argumento errado morre na próxima leitura — é `PRV-11`.
- **`F1`–`F6` aplicados item por item, que era a lacuna que eu mesmo havia declarado.** Método: a lista de
  `RN-PRV-009` **não existe em disco**; o que existe é a coluna `Consome`, e `P` nela é "nós lemos isto".
  **18 itens** com `P` (8 do caminho de venda, 7 motivos de recusa, 3 grandezas). **Contagem: 4 passam no
  grão declarado · 9 só em forma agregada sobre clientes ou grão grosso · 5 são dado de negócio, veículo
  `RN-PRV-010`.** Dos cinco, **um** está corretamente roteado (`payment_registered`, que declara "sob
  `RN-PRV-010`" na própria linha e é o modelo).
- **Três itens sem saída boa nenhuma para o lado `P`** — `order_item_added`, `order_abandoned`,
  `sale_concluded`. Não é grão fino demais: a forma grossa destrói o que a decisão declarada precisa (o
  próprio `order_abandoned` diz isso de si) e a forma fina é a curva de vendas. Desfecho correto: **tirar o
  `P`** ou declarar `RN-PRV-010`. E são exatamente os três que carregam `P` **sem decisão nossa nomeada**
  → `PRV-12`.
- **Veredito sobre a saída sem cache do passo 5: passa `F1` e `F6`, e `F3` só condicionado.** Confirmo a
  convergência (a versão que exige cache é a que reprova `F1`/`F3`, e não por sorte: unidade de negócio em
  período aberto é o que força o fan-out). **A recíproca não vale**, e é o furo: a condição não é `N`, é
  **concentração** — com um cliente dominante, o pico do agregado na nossa borda **é** a curva dele, e ela
  fica legível pelo papel de leitura **estreita**, sem cláusula → `PRV-13`. O defeito é da minha `F6` como
  eu a escrevi, e o declaro como meu.
- **As três travas, com a resposta para o registro.** Duas são **transitórias e existem para cair**
  (`RN-PRV-004` d com `D-03`; `RN-PRV-006` b com a célula) — congelá-las seria congelar o console. **A
  permanente é `RN-PRV-015`**, e é a única cuja queda não tem sintoma: operação sem célula simplesmente
  funciona. E a segunda metade, que é o que protege o conjunto: **a coisa que nunca pode cair não é uma das
  três travas** — é `RN-PRV-004` (b), que não é inércia, é propriedade permanente, já foi retirada uma vez
  (o `CRÍTICO` da ficha), a retirada não produziu sintoma nenhum, e é ela que faz o console **parecer**
  difícil.
- **Seis achados novos: três `ALTO`, três `MÉDIO`, nenhum `CRÍTICO`.** O único `CRÍTICO` da ficha era
  `PRV-01` e ele fecha.
ARQUIVOS:
- `docs/auditorias/2026-08-23-operacao-do-provedor-gate-de-fecho.md` (novo, **394** linhas) — terceiro
  irmão, numeração contínua, `PRV-11` a `PRV-16`
- `docs/auditorias/2026-08-23-operacao-do-provedor-e-console-de-gestao.md` (editado — **uma** linha: a
  declaração do terceiro irmão, que sem ela ficava afirmando "dois arquivos" em artefato entregue; 318 →
  320)
- `docs/auditorias/2026-08-23-operacao-do-provedor-mutacao-e-trilha.md` (editado — a mesma linha; 155 → 157)
- `tarefas/T-0004-...md` (editado — só esta seção, ao final)
- só leitura: `operacao-do-provedor.md`, `-autorizacao.md`, `-alcance.md`, `fatos-de-operacao.md`,
  `-dominios-fechados.md` (§1 e §2 até `RN-NUC-047`), `-provedor.md`, `matriz-operacao-papel.md`,
  `matriz-operacao-papel-contrato.md`, `matriz-operacao-papel-modulos.md`, `papeis-e-permissoes.md`,
  `papeis-atribuicao-e-delegacao.md`, `superficie-por-papel.md`, `fronteira-do-nucleo.md`,
  `memory/plataforma/INDEX.md` + `decision-d-03-...` + `decision-agregado-...`, e as três seções novas
  desta ficha. **Não toquei** nos dois arquivos de `performance` nem em `docs/produto/**` nem em `memory/**`.
NÃO FEITO:
- **Não reauditei o passo 4 nem o passo 5** além dos três pontos dirigidos a mim. Dos dois arquivos de
  `performance` li o relatório na ficha e o veredito do período aberto — **não** os dois arquivos inteiros.
- **Não examinei** os nove códigos de cancelamento de `RN-NUC-047` §2.1 nem `RN-NUC-048` verbatim: domínio
  fechado de valor de fato do cliente, sem alcance nosso declarado, fora das quatro frentes. **Não os
  aprovo** — declaro que não os li.
- **Não apliquei `F1`–`F6` aos 13 fatos do provedor** (§2 e §3 do irmão), e é método, não omissão: eles são
  a nossa trilha e a nossa infraestrutura, não observação do negócio do cliente. Os dois que tocam a
  fronteira estão tratados (`PRV-16` e a nota de `provider_advice_issued`).
DECISÕES:
- **Nenhum `CRÍTICO`, e a disciplina é a mesma do passo 2.** Nada dos seis vaza dado entre clientes, expõe
  segredo ou permite fraude: `PRV-13` é leitura ampla chegando ao papel estreito **dentro** da nossa
  fronteira; `PRV-11` é registro impossível ou registro no lugar errado. Inflar aqui custaria a leitura dos
  três `ALTO`.
- **`PRV-13` é correção da minha própria fronteira, e a declaro como minha.** `F6` como eu a escrevi
  ("forma que não se decompõe por cliente") não cobre decomposição por **dominância**. Preferi abrir achado
  em vez de emendar em silêncio o arquivo do passo 2: emenda silenciosa em auditoria já entregue é
  exatamente o defeito que este projeto rastreia.
- **Não abri achado sobre `provider_advice_issued`** (nota em §8): o caminho exige violar `RN-PRV-017` (c),
  que é vigente. Registrei o ganho barato — se o **fato** exigir fatos sustentadores do **mesmo** cliente, a
  proibição passa de promessa a propriedade e o aceite fica conferível na trilha.
- **Não tratei o grupo B da §4 (9 itens) como achado.** Eles passam agregados e reprovam retidos por
  estabelecimento, logo o que decide não é a lista: é o **repouso**, que é `D-06` e Fase 1. Virou restrição
  encaminhada, não achado.
- **Confirmei a escolha de `PRV-06` (inércia, não piso) como melhor que a minha sugestão** e não a reabri.
  As duas dão o mesmo desfecho hoje e a inércia é reversível pela resposta.
RISCOS:
- **Três ocorrências do mesmo padrão em duas fichas** — campo ou fonte de autoridade nova sem valor possível
  no registro: `AUT-15` → `PRV-03` → `PRV-11`, e esta **nasceu do conserto** da anterior. É sinal de
  processo, e a leitura que proponho ao humano é operacional: toda vez que uma regra cria sujeito, campo
  obrigatório ou fonte de autoridade, **o caso de falha daquele mesmo mecanismo** é o primeiro lugar a
  olhar — foi ali as três vezes.
- **`RN-EMI-040` (vazamento por agregado) aparece com o terceiro vetor:** cliente→cliente (T-0003),
  cliente→nós (passo 2), agregado→dominante (`PRV-13`). A forma do defeito é estável; o vetor muda a cada
  escopo novo. Vale esperar o quarto.
- **A tabela de fatos é o artefato que o passo 7 vai ler como se fosse a lista de `RN-PRV-009`** — e ela
  não satisfaz as quatro declarações (`PRV-12`). O veículo "o que não está na lista não é observado" é
  inócuo enquanto a coluna `P` funcionar como lista.
- **Nada opera hoje, e é por isso que nenhum destes seis pode causar dano agora** — as três travas contêm
  tudo, inclusive `PRV-13`. O corolário é o risco: seis achados sobre um escopo inoperante são fáceis de
  arquivar como teóricos, e cinco deles viram concretos no dia em que a primeira célula for valorada.
- **`PRV-15` é `memory/**`, que não é meu.** Se o orquestrador não escrever a linha no registro de `D-03`, a
  restrição continua existindo só numa `RN-PRV`, e quem fechar `D-03` lendo o registro não saberá que
  contraria regra vigente.
PERGUNTAS:
  - para `produto`: **`PRV-11`** é o único que eu chamo de **bloqueante para o passo 7**, e é uma cláusula:
    `RN-PRV-011`/`RN-PRV-016` distinguem **identificador pretendido** (não-autoritativo, registrado como
    tal) de **cliente-alvo resolvido**; o fato de recusa carrega o primeiro, nunca o segundo, e não repousa
    no ambiente do cliente nomeado. Confirma que cabe antes do passo 7?
  - para `produto`: **`PRV-12`** — todo `P` na coluna `Consome` declara a **decisão nossa** e o **canal**
    (`RN-PRV-009` ou `RN-PRV-010`), e `P` sem os dois é retirado. Nos três itens da curva de vendas, é
    retirar o `P` ou fazer como `payment_registered` já faz.
  - para **orquestrador**: **`PRV-15`** — uma linha em
    `memory/plataforma/decision-d-03-sao-tres-eixos-nao-uma-decisao.md` declarando que, para papel de
    escopo `provedor`, a opção em que o cliente-alvo chega no pedido está **eliminada** por `RN-PRV-004`
    (b). É `memory/**` e não escrevo lá.
  - para humano, com `arquiteto-dados`: **`PRV-13`** — a **contribuição máxima** de um cliente numa grandeza
    agregada é grandeza com unidade e **sem valor**, e ela entra junto do `N` mínimo da mesma família. Sem
    ela, "agregado sobre todos os clientes" é seguro por suposição.
VERIFICAÇÃO: não rodei teste — não há código. **Conferência de endereço em disco, um a um, nesta data,
depois do conserto:** `operacao-do-provedor.md` (**357**) `:111-135` (correção datada de §2, com a frase
falsa retirada e `RN-NUC-018` de volta ao alcance dos três), `:144` (`RN-PRV-003`, enunciado corrigido),
`:202-216` (as cinco cláusulas do objeto; (b) em **:205-210**, (d) em **:212-214**, (e) em **:214-216**),
`:233-241` (aceite das cláusulas), `:249-258` (infeliz de quatro partes), `:289-300` (as três cláusulas de
`RN-PRV-006`; (c) em **:297-300**), `:312-319` (aceite delas), `:332-340` (§2.1, a partição),
`:346-349`; `operacao-do-provedor-autorizacao.md` (**113**) `:32-38` (`RN-PRV-015`), `:58-62` (as três
travas, declaradas juntas), `:70-77` (`RN-PRV-016`), `:105-113`; `operacao-do-provedor-alcance.md`
(**300**) `:81-100` (declaração de inércia de `RN-PRV-008`), **`:104-116`** (`RN-PRV-009` — **mudou de
linha** com o conserto; era `:78-100` no passo 2, e eu corrigi a citação antes de usá-la),
`:204-214` (`RN-PRV-017`, (c) em **:212-214**), `:216-224` (motivo), `:226-231` (aceite),
`:233-243` (infeliz); `fatos-de-operacao.md` (**377**) `:154-176` (`RN-NUC-044`, escrita na **conjunção** —
é isso que deixa passar "consumidor declarado sem decisão"), `:248-259` (as 12 linhas do caminho de venda;
`order_item_added` **:249**, `order_abandoned` **:251**, `sale_concluded` **:252**, `payment_registered`
**:253** — os três primeiros com `Consome: C · P` e decisão só de `C`, o quarto declarando `RN-PRV-010`),
`:290-295` (as 6 grandezas; 3 com `P`), `:350` e `:355` (`LACUNA-PRV-008`, `LACUNA-PRV-009`);
`fatos-de-operacao-dominios-fechados.md` (**152**) `:30-32` (o fato de recusa e o grão), `:36-45` (os 8
motivos; 7 com `P`), `:47-56`; `fatos-de-operacao-provedor.md` (**233**) `:36-38` (a tentativa recusada),
`:40-53` (as quatro cláusulas; (a) em **:42-47**), `:55-60` (a consequência derivada, cujo argumento eu
derrubo), `:179-187` (os 7 fatos nossos; `provider_read_refused` **:182**, `provider_advice_issued`
**:187**), `:209-216` (os 6 de ciclo de vida; `module_state_change` **:212**), `:220-233`;
`matriz-operacao-papel.md` **:51-52** e **:54** e **:81** (a quinta coluna **é** `provider_support`, e a
frase de `operacao-do-provedor.md:111-115` está correta em disco); `superficie-por-papel.md` **:328**
(`LACUNA-NUC-031`, **ausente**); `memory/plataforma/decision-d-03-sao-tres-eixos-nao-uma-decisao.md`
verbatim (os três eixos, "chegada do tenant", e a nota de que `RN-OFF-032` é satisfeita nas três opções —
**e nenhuma linha sobre a restrição de `RN-PRV-004` b**, que é `PRV-15`);
`decision-agregado-de-periodo-fechado-nao-e-cache.md` verbatim; `memory/plataforma/INDEX.md` (filtrado por
camada). **Buscas feitas:** lista de itens observados no formato de `RN-PRV-009` nos três arquivos de fato →
**nenhuma**; `telemetria` em `docs/produto/**` → **zero**. **Não li:** os dois arquivos de `performance`
(só o relatório na ficha), `RN-NUC-047` §2.1, `RN-NUC-048`, `modulos/pedido-cliente-final.md` nesta rodada,
e norma alguma. **Nenhum número medido por mim entrou no relatório.**
MEMÓRIA SUGERIDA:
  - type=convention escopo=plataforma slug=trava-transitoria-e-propriedade-permanente-nao-se-confundem — no
    escopo `provedor` há **duas** travas que devem cair (`RN-PRV-004` d, `RN-PRV-006` b), **uma** que nunca
    cai (`RN-PRV-015`, o default do escopo) e **uma** que não é trava e jamais cai (`RN-PRV-004` b, o
    cliente-alvo fora do pedido). Quem destrava rápido confunde as quatro, e o sinal de que confundiu é uma
    delas caindo sem ato datado
  - type=gotcha escopo=plataforma slug=agregado-e-seguro-por-concentracao-nao-por-n — não-decomponibilidade
    não é propriedade da **contagem** de clientes, é da **distribuição**: com um dominante, o pico do
    agregado é a curva dele, e nenhum `N` conserta. O artefato parece agregado, então o defeito não tem
    sintoma — a condição é **contribuição máxima**, medida antes de exibir, falhando fechado
  - type=gotcha escopo=plataforma slug=coluna-de-consumidor-vira-lista-de-autorizacao — declarar `P` na
    coluna "quem consome" de uma tabela de fatos é, na prática, autorizar a nossa leitura daquele fato: a
    tabela é a única lista que existe, e o veículo "o que não está na lista não é observado" fica inócuo.
    `P` só vale com a **decisão nossa** e o **canal** na mesma linha
  - type=gotcha escopo=plataforma slug=o-caso-de-falha-do-mecanismo-novo-e-o-primeiro-lugar-a-olhar —
    terceira ocorrência do mesmo padrão em duas fichas (`AUT-15` → `PRV-03` → `PRV-11`), e a terceira nasceu
    do conserto da segunda: regra que cria sujeito, campo obrigatório ou fonte de autoridade tem de dizer o
    que acontece **no caso em que o próprio mecanismo falha** — é lá que o valor obrigatório não existe
  - type=convention escopo=plataforma slug=conclusao-certa-com-argumento-errado-nao-sobrevive — a restrição
    "fato do provedor não tem residência única" está **certa**, e o argumento publicado para ela é falso
    (quem grava é a plataforma, que escreve em todo schema). O motivo correto é que na recusa **não existe
    cliente-alvo resolvido**. Argumento errado sustentando restrição correta é o modo mais barato de a
    restrição morrer na próxima leitura
  - type=convention escopo=plataforma slug=promessa-de-nao-apagar-precisa-de-relogio-de-prova — "o cliente
    lista" é auditável por aceite; "nós não conseguimos apagar" é afirmação sobre sistema que nós operamos, e
    só existe se a trilha pertencer ao **relógio da prova** — no relógio discricionário ela é encurtada por
    custo sem violar regra nenhuma
PRÓXIMO PASSO SUGERIDO: `produto` — **duas cláusulas**, e a primeira é a única que eu chamo de bloqueante
para o passo 7: `PRV-11` (identificador pretendido × cliente-alvo resolvido, e a residência do fato de
recusa) e `PRV-12` (todo `P` declara decisão e canal; os três itens da curva de vendas perdem o `P` ou
ganham `RN-PRV-010`). Depois, na mesma passada e sem novo ciclo de auditoria: `PRV-14` e `PRV-16`, que são
uma frase cada. Ao **orquestrador**: a linha de `PRV-15` no registro de `D-03`. Ao **humano**, junto da
pauta que já está aberta: a **contribuição máxima** de `PRV-13`, ao lado do `N` mínimo do passo 4. Não
peço nova reauditoria: estes seis são conferíveis por leitura, e eu declarei o cenário de cada um.

## produto (conserto PRV-11 a PRV-14) — 2026-08-23

## RELATÓRIO — produto — T-0004
STATUS: OK
FEITO:
- **`PRV-11` fechado com três cláusulas, e a terceira ocorrência do padrão fechou pelo mecanismo, não por
  exceção.** `RN-PRV-011` ganhou (e), (f) e (g): **identificador pretendido** e **cliente-alvo resolvido**
  passam a ser coisas diferentes, com campos diferentes; o fato de **tentativa recusada** carrega o
  primeiro e **não exige** o segundo, é **gravável e gravado** quando a resolução é o que falhou (ou
  quando ela ainda não existe, `D-03` aberta); e **residência nunca se escolhe pelo identificador
  pretendido**. A cláusula (c) — fato não gravável impede a leitura — é declarada como **não alcançando a
  recusa**, e a razão é a que fecha os dois desfechos de `PRV-11`: na recusa **não há ato a impedir**, e
  exigir ali o campo impossível troca recusa **registrada** por recusa **silenciosa**, que apaga o rastro
  de sondagem com identificador alheio.
- **A mesma frase existe do outro lado, para as duas regras não divergirem.** `RN-PRV-016` recebeu a
  cláusula de **sujeito**: a obrigatoriedade do campo é do **ato que acontece**, não do fato da tentativa
  recusada. É a forma do conserto anterior repetida de propósito — definir *de que sujeito a regra fala*,
  em vez de abrir exceção —, e ela cita a reincidência (`AUT-15` → `PRV-03` → `PRV-11`) com a leitura
  operacional: **regra que cria campo obrigatório declara o que acontece no caso em que o próprio
  mecanismo dela falha.**
- **O argumento falso foi trocado e o velho ficou escrito, recusado.** A "consequência derivada" do passo
  4 sustentava a restrição a `D-06` com "gravar no ambiente do cliente exigiria a escrita que a recusa
  negou" — falso, porque quem grava é a **plataforma**. A conclusão permanece pelo argumento certo:
  **existe ao menos uma classe** de fato nosso para a qual nenhum ambiente de cliente é escolhível, logo
  **não existe regra única de residência**. Não escrevi "no instante da recusa não existe cliente-alvo
  resolvido" como enunciado geral porque no caso de **divergência** ele existe (é o cliente em que se
  trabalhava) — a restrição vale pela classe em que a resolução falhou, e é assim que ela é verdadeira em
  todos os casos, não na maioria.
- **`PRV-12` fechado nos dois pedaços, e o pedaço da referência era o mais barato e o mais grave.**
  `RN-PRV-009` ganhou (b) a (e): **a lista é a coluna** `Consome` das tabelas da operação do cliente — não
  se cria segundo artefato, porque a implementação lê o que está perto do fato; **todo `P` declara decisão
  nossa e canal na mesma linha**, e `P` sem os dois é **retirado**; e os dois canais **não são
  intercambiáveis** — `RN-PRV-010` é leitura por ocorrência com motivo enumerado e **nunca** sustenta
  painel nem série corrente. É esta última que fecha o cenário do achado: `sale_concluded` marcado
  `RN-PRV-010` não pode virar painel de venda por item.
- **Os três itens da curva de vendas, decididos um a um e por razão diferente.** `order_item_added`
  **perdeu o `P`** — o grão *por item de venda* de `sale_concluded` já entrega o dado bruto que a decisão
  do humano de 2026-08-23 nomeou, e lançamento em pedido **em construção** não é venda. `order_abandoned`
  **perdeu o `P`** — pedido morto não é venda, nenhuma decisão nossa foi nomeada, e a forma grossa destrói
  o que a decisão do **cliente** precisa. `sale_concluded` **manteve o `P`** e ganhou decisão + canal
  (`RN-PRV-010`): retirá-lo contradiria a decisão datada do humano de que o `provider_administrator` lê
  faturamento e curva de vendas — seria revogação em silêncio, e não é minha.
- **`RN-NUC-044` fecha agora na disjunção.** O campo 4 passou a ser **por consumidor**: consumidor
  declarado **sem** decisão dele é o mesmo defeito que decisão sem consumidor. Era a conjunção do título
  que deixava passar "`P` com decisão só do cliente", que é autorização aparente para leitura que ninguém
  decidiu.
- **`PRV-14`: escrevi a propriedade exigida, em quatro partes conferíveis contra qualquer saída de
  `D-06`, e reduzi o enunciado ao que elas sustentam.** `RN-PRV-006` (d): a trilha pertence ao relógio da
  **prova** (nenhuma decisão de custo a encurta); **não existe operação nossa** que apague, edite,
  suspenda ou encurte a janela; reduzir a janela é ato de `RN-PRV-010` (d) **visível ao cliente antes de
  valer**; e a janela vigente é **declarada**, com truncamento apresentado como truncamento. "Nós não
  conseguimos apagá-las" saiu: é afirmação de mecanismo, o mecanismo é de `arquiteto-dados`/`backend`, e a
  regra declara a propriedade que ele terá de ter. `RN-PRV-011` (d) foi apontada para lá, com a data.
- **`PRV-13`: a condição escrita é concentração, sem limiar numérico.** `RN-PRV-017` (d): o agregado que
  soma clientes é legítimo **enquanto não for decomponível por concentração**; grandeza nova
  **contribuição máxima de um cliente na grandeza agregada** (fração, **sem valor**), avaliada **antes** de
  exibir, na **mesma janela e resolução** do artefato, com falha fechada e recusa que não nomeia o
  dominante. Declarei que passar em (a)/(b) **não** implica passar aqui — aquelas medem o que o artefato
  contém, esta mede o que ele permite reconstruir — e que é `RN-EMI-040` no terceiro vetor.
- **Os quatro pedidos do passo 5, todos escritos.** `CST-02`: `RN-NUC-046` ganhou os **quatro fatos de
  ciclo de vida do pedido** no nível que cede junto com recusa e conectividade, com aceite próprio e com a
  consequência posta à vista de `LACUNA-NUC-038`. `CST-01`/`CST-07`: as **três grandezas** entraram na
  tabela de `RN-OFF-029` (custo do registro durável de um fato no caminho crítico · fatos por lançamento ·
  espaço de fato de diagnóstico retido), com unidade, dono e **sem valor** — e com a frase que diz por que
  elas importam: sem os dois operandos, o freio (a) de `RN-NUC-041` é inalcançável e o grão acaba decidido
  por default. `CST-05`: **`RN-NUC-049`** — retenção de uma classe é **≥ a janela mais longa de leitura
  publicada** sobre ela, truncamento é declarado inexistente, e as duas lacunas (`LACUNA-NUC-040`,
  `LACUNA-REL-001`) passam a **ter de fechar na mesma passada**. A linha do `RN-OFF-014` também entrou,
  como **nota de unidade** no arquivo que é meu.
- **Uma partição declarada, por teto de 400** (contagens medidas abaixo).
ARQUIVOS:
- `docs/produto/fatos-de-operacao-provedor.md` (editado — **280**) — `RN-PRV-011` cláusulas (e) a (g)
  (`:59-76`), consequência derivada com o argumento trocado (`:78-88`), aceite (`:113-122`), infeliz
  (`:124-130`), a cláusula (d) apontada para `RN-PRV-006` (d) (`:53-57`), a linha de
  `provider_read_refused` na tabela, e o cabeçalho declarando o quarto irmão
- `docs/produto/operacao-do-provedor-autorizacao.md` (editado — **126**) — `RN-PRV-016`, cláusula de
  sujeito (`:79-87`) e aceite dela
- `docs/produto/operacao-do-provedor.md` (editado — **383**) — `RN-PRV-006` cláusula (d), as quatro partes
  da propriedade (`:302-319`), e o aceite dela (`:340-346`)
- `docs/produto/operacao-do-provedor-alcance.md` (editado — **372**) — `RN-PRV-009` cláusulas (b) a (e)
  (`:111-129`) e aceite (`:142-147`); `RN-PRV-017` cláusula (d) em `:243-254`, com motivo (`:266-271`),
  aceite (`:280-285`) e infeliz (`:297-308`) próprios, cada um **depois** do seu par original, que é o
  padrão da casa; `LACUNA-PRV-010` nova e a nota de que a sequência `LACUNA-PRV-` é única entre os dois
  conjuntos
- `docs/produto/fatos-de-operacao.md` (editado — **379**, era 377) — `RN-NUC-044` cláusula da disjunção
  (`:164-169`) e aceite (`:183`); as **três linhas** da tabela §3 corrigidas mais a de `payment_registered`
  (que também não nomeava decisão, só canal); a nota de canal e das duas retiradas (`:249-257`); a nota de
  canal em §5; `RN-NUC-046` virou ponteiro para o irmão novo (`:216`); `LACUNA-NUC-040` agora cita
  `RN-NUC-049`; cabeçalho com o terceiro eixo e a numeração
- `docs/produto/fatos-de-operacao-retencao-e-descarte.md` (**novo, 123**) — quarto irmão. `RN-NUC-046`
  movida **verbatim** + a cláusula de `CST-02` + terceiro aceite; `RN-NUC-049` nova
- `docs/produto/fatos-de-operacao-dominios-fechados.md` (editado — **162**) — o canal do lado `P` desta
  tabela, declarado no nível do **fato** e não do valor (`:48-55`)
- `docs/produto/offline-grandezas-e-orcamento.md` (editado — **161**) — três linhas novas no grupo `fato`
  da tabela de `RN-OFF-029`; a nota do freio inalcançável (`:134-139`); a nota de unidade de `RN-OFF-014`
  (`:141-147`)
- `docs/produto/README.md` (editado — **211**) — o conjunto de fatos passou a quatro arquivos. Fora da
  lista do brief, e declarado em `DECISÕES`
- `tarefas/T-0004-...md` (editado — só esta seção, ao final)
- só leitura: `docs/auditorias/2026-08-23-operacao-do-provedor-gate-de-fecho.md`,
  `2026-08-23-custo-de-agregacao-do-provedor.md` (`CST-05`),
  `2026-08-23-custo-de-agregacao-do-provedor-caminho-critico.md` (`CST-01`, `02`, `07`, `08`),
  `memory/plataforma/INDEX.md` (uma busca), e as seções `arquiteto-dados (passo 4)`, `performance (passo
  5)` e `seguranca (passo 6)` desta ficha
NÃO FEITO:
- **`PRV-15` e `PRV-16` não foram tratados**, e nenhum é meu neste despacho. `PRV-15` é `memory/**`
  (orquestrador). `PRV-16` (forma binária de "módulo contratado e nunca usado") não está no meu brief; eu
  **não** o fechei e **não** o enfraqueci: a cláusula (e) de `RN-PRV-009` cita-o como achado **aberto**,
  justamente para que a exclusão das tabelas do provedor da lista não seja lida como licença de forma.
- **`CST-07` só entrou pela metade.** A grandeza de **espaço** entrou; o **espaçamento de retentativa de
  operação recusada** — que é o valor que governa a cardinalidade daquele fato — **não** entrou na lista de
  `RN-OFF-028`, porque não estava no brief e porque é o achado próprio dele. Está em `RISCOS`.
- **`PRV-07`, `PRV-08` e `PRV-09` seguem como no conserto anterior** (dois sem caminho pela inércia de
  `RN-PRV-008`, um esperando leitor nomeado). Nada mudou neles nesta passada.
- **Nenhuma célula valorada, nenhum número escrito, `D-01` a `D-06` intocadas**, e nada em
  `matriz-operacao-papel*.md`, `docs/auditorias/**`, `memory/**` ou `.claude/**`.
DECISÕES:
- **Uma partição, e o eixo é o mesmo defeito em duas escalas de tempo.**
  `fatos-de-operacao-retencao-e-descarte.md` nasceu porque o irmão principal estava em **399** linhas e
  `RN-NUC-049` não caberia. Movi `RN-NUC-046` para lá em vez de espalhar: as duas regras falham
  **identicamente** — a perda chega ao leitor com a cara de ausência ("não houve recusa" na escala de
  horas, "vendeu menos" na de meses) —, e separá-las deixaria o leitor sem saber qual das duas está lendo.
  A alternativa era acomodar `RN-NUC-049` no irmão dos **domínios fechados**, recusada: seria o eixo
  vazando, que é a colisão de prefixo em outra forma.
- **`sale_concluded` manteve o `P`, e a razão não é conveniência: é que retirá-lo revogaria decisão datada
  do humano.** O auditor deu as duas saídas como válidas; para este item só uma é, porque em 2026-08-23 o
  humano decidiu que o `provider_administrator` lê faturamento e curva de vendas. O que eu escrevi foi o
  **canal** e a **forma** (por ocorrência, com motivo enumerado, nunca painel) — que é onde o dano do
  cenário morava.
- **Corrigi também `payment_registered`, que o auditor chamou de modelo.** Ele declarava o **canal** e não
  a **decisão**; pela cláusula que eu mesmo acabei de escrever, ele reprovaria no dia seguinte. Regra
  entregue já falsa numa linha da própria tabela é pior que a regra ausente.
- **A lista de `RN-PRV-009` é a coluna, e não um artefato novo.** A alternativa — escrever a lista — foi
  recusada por uma razão verificável: duas listas para o mesmo fato divergem, e a que a implementação lê é
  a que está encostada no fato. O custo aceito e declarado: a tabela ganha carga normativa que o cabeçalho
  dela não anunciava, então a carga está escrita nas duas pontas (na regra e sob a tabela).
- **Em `PRV-14` não classifiquei retenção nem escrevi número.** Classifiquei a **classe** no relógio da
  **prova**, que é o que o achado pedia e o que o passo 4 derivou; a janela continua sendo a da cláusula de
  contrato e o número é `LACUNA-PRV-006`, do humano.
- **Em `PRV-13` não escrevi limiar.** Nomeei a grandeza (fração) e abri `LACUNA-PRV-010` junto do `N`
  mínimo do passo 4, declarando que **as duas se decidem juntas ou nenhuma protege nada** — `N` grande com
  um dominante é tão revelador quanto `N` = 1.
- **Editei `README.md`, fora da lista do brief.** Criei um arquivo; índice que afirma "dois irmãos" quando
  há três é pior que índice ausente. Quatro linhas.
RISCOS:
- **`RN-NUC-046` mudou de arquivo e é a regra mais citada desta ficha** (as duas auditorias de
  `performance` a citam por `path:linha`). Deixei ponteiro no lugar antigo e numeração intacta, mas **as
  citações de linha das auditorias envelheceram** — quem for atrás delas cai no ponteiro, não no
  enunciado.
- **`RN-NUC-049` obriga duas lacunas a fecharem juntas, e nenhuma das duas é minha.** O efeito imediato é
  que **nenhuma leitura pode ser publicada com janela declarada** antes de a retenção existir — inclusive
  o acompanhamento semestral que o humano pediu. Isso é o desfecho correto e é caro; se alguém tratar como
  bug, a regra cai justamente onde ela protege.
- **A cláusula (c) de `RN-PRV-009` é a que mais trabalho cria depois.** Ela vale para toda linha `P`
  futura; hoje ela é verdadeira em disco (conferi as tabelas, uma a uma), e é o tipo de regra que se torna
  falsa na primeira linha acrescentada sem ler a regra.
- **`RN-PRV-017` (d) exige medir concentração antes de exibir, e isso é requisito de `backend` que ninguém
  recebeu ainda.** Escrito como propriedade, sem mecanismo — mas o passo 7 vai encontrar um painel cujo
  primeiro requisito é uma medida que não existe.
- **O espaçamento de retentativa de `CST-07` continua sem dono declarado** (`RN-OFF-028` não o lista), e é
  ele que governa a cardinalidade de `operation_refused` — a tabela cujo modelo a Fase 1 vai desenhar.
- **`PRV-16` segue aberto** e agora tem um lugar que o cita (`RN-PRV-009` e). Uma frase resolve, e não era
  deste brief.
- **Não reauditei o meu próprio conserto** — é a lição de `PRV-11`, que nasceu exatamente aí. As três
  cláusulas novas criam um sujeito novo? Não criam: elas **separam dois campos existentes** e declaram um
  como opcional numa classe. É a resposta que eu tenho; ela não substitui o gate.
PERGUNTAS:
  - para `seguranca`: **`PRV-11`** — a cláusula (f) torna o fato de recusa **gravável sem** cliente-alvo
    resolvido. Isso fecha os dois desfechos que você provou, ou cria um registro com campo opcional que
    o construtor vai preencher por hábito com o único valor disponível? Eu proibi a substituição em (e) e
    no infeliz; não tenho como proibir o hábito.
  - para `seguranca`: **`PRV-13`** — a condição de **contribuição máxima** avaliada antes de exibir, com
    falha fechada, basta enquanto o valor não existir? Hoje ela é regra sem número, o que significa
    "nenhum agregado é apresentável" — desfecho, não pendência, mas confirme que é o que você espera.
  - para humano: **`LACUNA-PRV-010`** (contribuição máxima, fração) entra na mesma pauta do `N` mínimo do
    passo 4 e de `LACUNA-NUC-040`/`LACUNA-REL-001`? As três são números, e `RN-NUC-049` já amarra as duas
    últimas entre si.
  - para humano: as **três frases de `matriz-operacao-papel*.md`** continuam pendentes e continuam sendo o
    que mantém os três papéis inoperantes. Nada nesta passada as substitui.
  - para `arquiteto-dados`: `RN-NUC-049` incide sobre **classe de fato**; você propôs **três relógios**.
    A cláusula (d) diz que ela só governa o relógio **discricionário** — confirma que a unidade em que a
    retenção será proposta permite dizer, por classe, em que relógio ela está?
VERIFICAÇÃO: não rodei teste — não há código. **Conferência de endereço em disco, um a um, nesta data,
antes de citar:** `docs/auditorias/2026-08-23-operacao-do-provedor-gate-de-fecho.md` (**394**) `:189-211`
(`PRV-11`), `:213-232` (`PRV-12`), `:234-256` (`PRV-13`), `:258-276` (`PRV-14`), `:296-313` (`PRV-16`, que
eu **não** consertei), `:110-158` (o método de `F1`–`F6` e a contagem 4/9/5), `:96-106` (o argumento
derrubado); `2026-08-23-custo-de-agregacao-do-provedor-caminho-critico.md` `:82-101` (`CST-01`, as duas
grandezas nomeadas), `:103-118` (`CST-02`, os quatro fatos), `:140-158` (`CST-07`, do qual só a grandeza de
espaço entrou); `2026-08-23-custo-de-agregacao-do-provedor.md` `:248-266` (`CST-05`, a cláusula sugerida
verbatim); ficha `:883-897` (os três relógios do passo 4) e `:1355-1357` (a linha de `RN-OFF-014`).
**Endereços do meu território conferidos depois da edição:** os nove arquivos acima, nas linhas citadas em
`ARQUIVOS`. **Conferência que sustenta a cláusula (c) de `RN-PRV-009` — feita linha a linha, porque uma
regra que nasce falsa em disco é pior que a ausência dela:** em `fatos-de-operacao.md` §3, as linhas com
`P` que **ficaram** são `order_item_removed`, `sale_concluded`, `payment_registered`,
`fiscal_document_outcome`, `peripheral_attempt_outcome` e `terminal_connectivity_state_change` — as quatro
últimas já nomeavam decisão nossa com o verbo "decide"; as duas primeiras foram corrigidas nesta passada.
Em §5, as três linhas com `P` nomeiam decisão nossa. Em `fatos-de-operacao-dominios-fechados.md` §1.1 o
`P` é por **valor** e a decisão é do **fato** (`RN-NUC-043`, motivo), e é isso que a nota declara.
**Contagem de linhas medida** por busca de linha (ripgrep em modo contagem — não tenho shell nesta
sessão), arquivo por arquivo, depois da última edição: `fatos-de-operacao.md` **379**,
`-retencao-e-descarte.md` **123**, `-dominios-fechados.md` **162**, `-provedor.md` **280**,
`operacao-do-provedor.md` **383**, `-alcance.md` **372**, `-autorizacao.md` **126**,
`offline-grandezas-e-orcamento.md` **161**, `README.md` **211**. O irmão principal estava em **399** antes
da partição, e é o número que a justifica. **Não li:** norma alguma, `modulos/relatorios.md`,
`modulos/relatorios-semente-de-perguntas.md` (`LACUNA-REL-001` citada pelo que `CST-05` afirma dela),
`matriz-operacao-papel*.md` nesta rodada, nenhum registro de `memory/**` além do `INDEX.md` de plataforma.
**Não conferi na fonte:** `RN-REL-005`, `RN-REL-007`, `LACUNA-REL-001`, `RN-OFF-014`, `RN-OFF-015`,
`RN-NUC-038`, `PN-01` — citados pelo que os arquivos do meu território e as três auditorias afirmam deles.
**Nenhum número medido por mim entrou em regra; nenhum número novo foi escrito em spec.**
MEMÓRIA SUGERIDA:
  - type=business-rule escopo=plataforma slug=identificador-pretendido-nao-e-cliente-alvo-resolvido — são
    **dois campos**, nunca um: o pretendido é registrado como pretendido, não resolve, não escolhe
    residência e não substitui o resolvido. O fato de **tentativa recusada** carrega o pretendido e é
    gravável **sem** alvo resolvido — porque na recusa não há ato a impedir, e exigir o campo impossível
    troca recusa registrada por recusa silenciosa
  - type=gotcha escopo=plataforma slug=campo-obrigatorio-sem-valor-possivel-tem-dois-desfechos-e-os-dois-sao-defeito
    — falha fechado perde o rastro do ataque; falha aberto grava o fato no cliente errado. A saída não é
    escolher entre os dois: é declarar **de que sujeito** a obrigatoriedade fala. Terceira ocorrência do
    padrão em duas fichas, e a terceira nasceu do conserto da segunda
  - type=convention escopo=plataforma slug=conclusao-certa-com-argumento-errado-se-troca-com-data — o
    argumento falso fica **escrito e recusado** no lugar dele, não apagado: apagar deixa a conclusão sem
    lastro e o próximo leitor a derruba junto com o argumento. Aplicado à restrição de residência dos
    fatos do provedor
  - type=business-rule escopo=plataforma slug=todo-p-declara-decisao-e-canal-ou-e-retirado — a coluna
    "quem consome" de uma tabela de fatos **é** a lista de autorização de leitura nossa: cada `P` declara,
    na mesma linha, a decisão nossa e o **canal** (observação de operação × leitura de dado de negócio), e
    os dois canais não são intercambiáveis — o segundo é por ocorrência, com motivo enumerado, e **nunca**
    sustenta painel nem série corrente
  - type=business-rule escopo=plataforma slug=promessa-de-nao-apagar-e-propriedade-em-quatro-partes —
    "nós não conseguimos apagar" não é escrevível; o que é escrevível é: classe no relógio da **prova**,
    **nenhuma operação nossa** que apague ou encurte, redução só por ato datado **visível ao cliente antes
    de valer**, e janela declarada com truncamento declarado. Qualquer residência tem de satisfazer as
    quatro, e a que não satisfaz é **recusada**
  - type=gotcha escopo=plataforma slug=agregado-e-seguro-por-concentracao-nao-por-n — confirmado em regra:
    a condição é **contribuição máxima** de um cliente, medida antes de exibir, na mesma janela e
    resolução do artefato, falhando fechado. Passar em "não contém número de outro" não implica passar em
    "não permite reconstruir a curva de outro" — a primeira mede conteúdo, a segunda mede forma
  - type=convention escopo=plataforma slug=perda-que-chega-como-ausencia-e-um-eixo-so — descarte por
    recurso local (horas) e truncamento por retenção (meses) são o **mesmo** defeito em duas escalas: o
    leitor recebe "não houve" onde houve. Por isso as duas regras moram juntas, e por isso as duas
    obrigam a **declarar a lacuna** em vez de apresentar zero
PRÓXIMO PASSO SUGERIDO: ao **humano**, três coisas que são frase ou número e nenhuma é minha: as **três
frases de `matriz-operacao-papel*.md`** (sem elas nada opera), e os números de `LACUNA-PRV-010` +
`LACUNA-NUC-040`/`LACUNA-REL-001`, que `RN-NUC-049` agora amarra entre si. Ao **orquestrador**: a linha de
`PRV-15` no registro de `D-03`. Depois disso, o passo 7 — e ele encontra, de propósito, um console que não
opera nada e um painel que não apresenta agregado até a contribuição máxima existir.

## produto (passo 7) — 2026-08-23

## RELATÓRIO — produto — T-0004
STATUS: OK
FEITO:
- **A superfície invariante entregue como derivação, não como desenho** (`superficie-do-provedor.md`,
  `RN-PRV-018` a `020`). `RN-PRV-018` **adota** `RN-NUC-034` a `036` em vez de escrever um contrato novo,
  com três adaptações declaradas: a origem **(ii)** (artefato publicado retido) **não se aplica** ao nosso
  lado; a origem (iii) aponta para a célula da **nossa** matriz; e a cláusula que **não** é herança —
  **nenhuma superfície nossa enumera clientes para escolher**, porque escolher cliente numa lista é
  resolver o alvo pelo que o pedido informa, que é exatamente o que `RN-PRV-004` (b) proíbe. Do lado do
  cliente "não enumerar" protege o catálogo de operações; do nosso, protege a **carteira**.
- **`RN-PRV-019`: sete itens de metadado, cada um com a forma admissível E a forma recusada ao lado.** A
  escolha de escrever a forma recusada é o miolo: uma tabela que diz só o que pode ser feito não freia
  refinamento nenhum, e o risco desta família nunca foi má-fé — foi **grão**. Item sem forma recusada não
  é item.
- **`PRV-16` fechado, e generalizado na mesma passada.** A forma do binário entrou onde o achado pediu (a
  linha de `module_state_change`) **e** como cláusula de `RN-PRV-014`: leitura derivada declara a forma
  admissível e a recusada, e **leitura cuja forma não está escrita não acontece**. Sem a cláusula geral, o
  próximo item nasceria com o mesmo defeito — os nove do grupo B da §4 do gate são exatamente essa fila.
  Abri `LACUNA-PRV-013` (a janela do binário) porque janela ausente é janela infinita, e infinita responde
  "algum dia foi usado", que não decide nada.
- **A tensão do painel resolvida, e a quarta obstrução é nova.** `RN-PRV-020`: `RN-PRV-010` **tem** canal
  para faturamento e curva de vendas (a decisão do humano de 2026-08-23 está intacta) e **não** sustenta
  artefato corrente (`RN-PRV-009` d). Faltam quatro coisas, três já na pauta (ato datado de `RN-PRV-010`
  d · a célula R5 · retenção por `RN-NUC-049`). **A quarta não estava escrita em lugar nenhum:** por
  `RN-PRV-011` toda leitura nossa é fato, então artefato corrente produz **uma leitura por atualização**,
  e só há dois desfechos — a trilha do `owner` fica ilegível por volume e a decisão que `provider_read`
  informa passa a medir recarga de tela, **ou** o artefato é isento da trilha, e a isenção é a revogação
  silenciosa de `RN-PRV-006`. Escrevi a **propriedade** que a unidade tem de satisfazer e abri
  `LACUNA-PRV-011`; a unidade em si não é minha e o mecanismo é de `backend`.
- **O semestral dito em voz alta, e o pico recusado com os três destinos na recusa.** `RN-NUC-049`
  aplicado ao nosso lado: janela declarada — mensal, semestral — é **especificável hoje e não publicável**
  até a retenção existir. E pico por estabelecimento **não tem forma nossa admissível**: os três destinos
  legítimos entram **na própria recusa**, para ela não ser lida como negativa da necessidade.
- **A matriz do escopo em arquivo próprio, com a distinção que decide se ela mente**
  (`matriz-celulas-a-valorar.md`). **Célula em branco não é `?`**: `?` é valor, tem significado e **conta**
  na contagem consolidada de `matriz-operacao-papel-modulos.md` §8; branco é a ausência da linha. Declarei
  que **as 43 de 380 continuam exatas** e que somar esta folha produz número falso. 14 linhas por
  **espécie de objeto** (8 leitura, 6 ato), pela disciplina que `LACUNA-NUC-037` já escreveu para `REL`:
  item novo na superfície não deve exigir célula nova.
- **Duas linhas que a folha ganhou e que ninguém tinha pedido:** **R7** (ler a nossa própria trilha) com o
  obstáculo que **precede** a valoração — valorá-la em qualquer dos três é dar a alguém a auditoria do
  próprio alcance (`RN-PRV-005` b), e é o achado `PRV-09` com forma; e **R8** (exportar), que é linha
  própria pelo precedente de `RN-NUC-032` e porque `RN-PRV-015` (motivo) já nomeia a exportação de
  diagnóstico como o veículo de sair do escopo com o dado inteiro num arquivo. Sem linha ela é negada por
  omissão; com linha, a negativa é **decidida**.
- **`LACUNA-NUC-037` entregue na mesma passada:** duas linhas (`L1` estabelecimento, `L2` cliente), não
  seis, com os cinco papéis de cliente, mais **o que já está decidido em volta** — os candidatos, por que
  `cashier` e `provider_support` não são candidatos, e o caso silencioso de `manager` em `L2`
  (`RN-REL-006`, motivo). Declarei o que **não** é linha ali: exportar (é `PN-10`/núcleo e
  `LACUNA-NUC-019`) e recorte por pessoa (`RN-REL-008`) — valorar `L1`/`L2` não abre nenhum dos dois.
- **As predições: os três entregáveis existem, então a capacidade entrou.** `CAP-REL-001`, 14 campos.
  **(1) Critério de erro:** medido sobre períodos fechados **que não participaram da derivação**, na
  **unidade da decisão**, apresentado ao lado, e a antecipação **se retira** quando o erro ultrapassa o
  limite de quem decide (`PN-20`) — sem limite declarado, não é apresentada. **(2) Apresentação:** a
  natureza acompanha o **valor**, não o artefato, e **sobrevive à extração** (exportação, cópia,
  impressão, voz); projeção **nunca** entra em total com fato — total misturado **é** projeção; e a
  precisão exibida não excede a que o erro sustenta. **(3) Responsabilidade:** o **mecanismo** é
  `RN-PRV-021`, vigente; **de quem é** continua `LACUNA-PRV-007`, do humano, e não a presumi.
- **A pergunta estrutural do campo 6 decidida por recusa, com as quatro partes.** `provedor` **não** vira
  quarto valor: o catálogo é, pelo cabeçalho, o que **o cliente escolhe ligar** — capacidade nossa esvazia
  os campos 10 e 11 —, `CAP-<COD_MODULO>-<nnn>` exige código de **módulo** e `PRV` está registrado em
  `glossario.md` §4.3 como **escopo**, e o roadmap que agenda dali é o do produto, não o do nosso negócio
  (`RN-PRV-002`). Mecanismo nosso: `RN-PRV-021`, `RN-PRV-017`, `RN-PRV-019` — **regra vigente**, com
  trilha e default fechado, que o catálogo não tem. Recusa **condicionada e datada**: se `LACUNA-PRV-004`
  responder "vendável", a pergunta reabre e o lugar é decisão de `catalogo-de-modulos.md`.
- **O ganho barato do gate virou propriedade:** `RN-PRV-021` (a) exige que os fatos sustentadores de uma
  sugestão sejam **todos do mesmo cliente** — então sugestão comparativa deixa de ser **gravável** e, por
  (b), deixa de acontecer. `RN-PRV-017` (c) passa de promessa a propriedade, e o aceite fica conferível na
  **trilha** em vez da intenção.
ARQUIVOS:
- `docs/produto/superficie-do-provedor.md` (**novo, 294**) — `RN-PRV-018` a `020`, os sete itens, os três
  papéis, a tabela de **o que cada trava libera** (12 linhas) e `LACUNA-PRV-011` a `013`
- `docs/produto/matriz-celulas-a-valorar.md` (**novo, 157**) — §1 a matriz do escopo `provedor` (14 linhas
  × 3 papéis + `Sem contato`); §2 as duas linhas de `REL` (× 5 papéis + `Offline`); §3 o que a folha pede
- `docs/produto/fatos-de-operacao-provedor.md` (editado — **351**, era 280) — `RN-PRV-021` novo; cláusula
  da forma em `RN-PRV-014`; linha de `provider_advice_issued` e de `module_state_change` corrigidas;
  cabeçalho
- `docs/produto/catalogo-de-capacidades.md` (editado — **390**, era 334) — `CAP-REL-001` em §3; a recusa do
  quarto valor do campo 6 em §1; a linha de §8 (`COZ`/`EST`) com o freio agora mensurável
- `docs/produto/modulos/relatorios-semente-de-perguntas.md` (editado — **235**, sem crescer) — a linha
  "previsão de venda / projeção de demanda" de §3 aponta para `CAP-REL-001`, com a data
- `docs/produto/matriz-operacao-papel-modulos.md` (editado — **277**) — **duas linhas** no bullet de
  `LACUNA-NUC-037`: onde estão as candidatas e que elas **não** entram na contagem da §8
- `docs/produto/operacao-do-provedor.md` (editado — **384**) · `-alcance.md` (**374**) ·
  `-autorizacao.md` (**129**) — ponteiros que diziam "passo 7" passaram a dizer o arquivo; a sequência
  `LACUNA-PRV-` declarada como única entre **três** conjuntos
- `docs/produto/README.md` (editado — **226**) — duas linhas em "Por onde entrar", o conjunto novo da
  superfície, a folha de valoração na seção da matriz, `RN-PRV-021` no conjunto de fatos, e **duas
  correções de índice**: o conjunto de fatos dizia "três arquivos" com **quatro** listados, e o catálogo
  dizia "10 capacidades" (agora 11)
- `tarefas/T-0004-...md` (editado — só esta seção, ao final)
- só leitura: `superficie-por-papel.md` (inteiro), `matriz-operacao-papel-modulos.md`,
  `modulos/relatorios.md` §1–§3, `modulos/relatorios-semente-de-perguntas.md`, `catalogo-de-capacidades.md`
  §1–§3 e §7–§9, `glossario.md` §4.3, `operacao-do-provedor*.md`, `fatos-de-operacao-provedor.md`,
  `docs/auditorias/2026-08-23-operacao-do-provedor-gate-de-fecho.md` §4–§10 e
  `...-e-console-de-gestao.md` §1–§2.1, `postura-nova-geracao.md` (**só os 20 títulos**)
NÃO FEITO:
- **Nenhuma célula valorada, nenhum número escrito, `D-01` a `D-06` intocadas.** Nada em
  `matriz-operacao-papel.md`, `-contrato.md`, `docs/auditorias/**`, `memory/**` ou `.claude/**`.
- **Não desenhei nada** — nenhum nome de tela, bloco, gráfico, espaço, ordem ou densidade. Qual **espaço**
  o nosso console habita virou `PERGUNTAS: para ui`.
- **`PRV-15` não é meu** (é `memory/**`, orquestrador) e continua aberto.
- **`PRV-07`, `PRV-08`, `PRV-09` seguem como estavam.** `PRV-09` ganhou **forma** (a linha R7 e o
  obstáculo escrito), não resposta: o leitor continua sendo pergunta ao humano.
- **Não reabri `LACUNA-REL-002`** (recorte por pessoa) nem "explicar por que o dia foi diferente do
  normal": o critério de erro que escrevi é sobre **projeção**, não sobre causa, e a segunda está recusada
  com "não reabro" em `relatorios-semente-de-perguntas.md` §3.
- **Não expandi `CAP-REL-001` em `RN-REL-nnn`.** O catálogo proíbe (campo 2), e agendar é do humano.
- **`CST-07` continua pela metade** (o espaçamento de retentativa de operação recusada segue sem dono em
  `RN-OFF-028`) — não era deste brief, e continua em `RISCOS`.
DECISÕES:
- **Uma folha de valoração, não duas.** A alternativa era um arquivo por frente (`provedor` e `REL`).
  Recusada por uma razão verificável: célula candidata é **espécie diferente** de célula valorada, e
  espalhar a espécie multiplica os lugares onde candidato pode ser lido como concessão. O eixo da
  partição é declarado e é real — *célula candidata × célula valorada* —, e é o mesmo eixo de "uma única
  passada de valoração". Custo aceito: o arquivo tem dois blocos com destinos **diferentes** quando
  valorados, e os dois destinos estão escritos no cabeçalho.
- **Nome fora da família `matriz-operacao-papel*`, de propósito.** Nomeá-lo `matriz-operacao-papel-provedor.md`
  o poria na família cujas células **são** autoridade, e é justamente o que ele não é. Mais: o aceite de
  `RN-PRV-003` é uma busca por `provider_operator` nos três arquivos daquela família **devolvendo zero** —
  entrar na família com esse nome não quebraria o aceite, mas convidaria a próxima leitura a quebrá-lo.
  Custo: quem trabalha na matriz não o encontra por vizinhança de nome, e a mitigação é o ponteiro que
  acrescentei em `LACUNA-NUC-037` e a linha no `README`.
- **`RN-PRV-018` adota o contrato existente em vez de escrever o seu.** A alternativa (contrato próprio do
  escopo `provedor`) foi recusada: duas versões da mesma regra divergem, e a que a implementação lê é a
  mais perto da tela. Custo: três adaptações a manter; ganho: toda correção futura em `RN-NUC-034` a `036`
  alcança o nosso lado sem passada própria.
- **`RN-PRV-021` mora no arquivo dos fatos, e a casa natural estava cheia.** A sugestão é ato nosso, então
  o lugar canônico seria `operacao-do-provedor-alcance.md` §2 — que está em **374/400** e não a comporta.
  Ficou junto de `provider_advice_issued`, que é o fato que ela governa, com o cabeçalho declarando a
  numeração. **Risco declarado abaixo.**
- **O critério de erro está escrito duas vezes, com autoridades diferentes, e é deliberado.** Em
  `RN-PRV-021` (d) ele é **regra vigente** sobre artefato **nosso**; em `CAP-REL-001` (`ACEITE`) ele é
  **candidato** sobre capacidade do **cliente**. Escrever só um dos dois teria feito o outro lado nascer
  sem freio: uma `RN-PRV` não governa relatório do cliente, e uma capacidade candidata não governa o que
  nós entregamos hoje. Declarei no catálogo que a `RN-REL-nnn` futura é **escrita para casar** com
  `RN-PRV-021`, não inventada.
- **`CAP-REL-001` é de `REL`, e não é entrada nova para o item de §8.** O escopo é `modulo:REL` porque a
  espécie é *pergunta de gestão respondida com o fato do cliente*. O item "prever quanto produzir" de §8
  (`COZ`/`EST`) **não** virou entrada: mesma necessidade, dono de módulo diferente, e duas entradas com a
  mesma necessidade sob dois nomes é catálogo duplicado. O que fiz nele foi uma frase: o freio dele
  deixou de ser opinião e passou a ser **medida**.
- **Não escrevi o limite de erro, e atribuí a titularidade dele sem inventar número.** O limite é de
  **quem toma a decisão** (`PN-20`), o que sobrevive às duas respostas; se existe um **default nosso** é
  `PERGUNTAS: para humano`, dentro da entrada, e default é número.
- **A recusa do quarto valor do campo 6 é condicionada, não eterna.** Escrevi a condição que a reabre
  (`LACUNA-PRV-004` = vendável) e o dono da decisão de onde ela moraria. Recusa sem condição de reabertura
  é o tipo de negativa que vira dogma sem ninguém decidir.
RISCOS:
- **`catalogo-de-capacidades.md` fechou em 390/400.** A próxima entrada parte o arquivo, e o eixo natural
  é *cross-vertical × por vertical* — que é o eixo que as seções §3 a §6 já usam. Quem escrever a próxima
  capacidade vai encontrar 10 linhas de espaço, e o teto não é negociável.
- **`RN-PRV-021` está longe da casa natural dela.** Quem for atrás de "o que nós entregamos ao cliente"
  vai a `operacao-do-provedor-alcance.md` §2 e não a encontra. Deixei a numeração no cabeçalho do arquivo
  onde ela está e a citação na linha do fato; o resíduo é de prosa, dono `produto`, e some quando aquele
  arquivo for partido.
- **A cláusula da forma em `RN-PRV-014` cria trabalho para nove itens que ninguém escreveu ainda.** O
  grupo B da §4 do gate (nove itens que passam só agregados) passa a exigir forma admissível declarada —
  o que é o desfecho correto e é caro. Se alguém tratar como bug, a cláusula cai exatamente onde protege.
- **`superficie-do-provedor.md` §5 é a tabela mais fácil de ler como cronograma.** Ela é "o que cada trava
  libera", e onze das doze linhas são frase, célula ou número — nenhuma é prazo. Se ela for lida como
  ordem de construção, o console nasce com a metade que não depende de decisão nenhuma, que é exatamente a
  metade que não existe.
- **A distinção `branco ≠ ?` é a coisa mais fácil de perder nesta entrega.** Se alguém somar as células da
  folha à contagem de `matriz-operacao-papel-modulos.md` §8, o número de 43/380 — que é citado em três
  arquivos — passa a estar errado sem que nada acuse. Escrevi a advertência nos dois lugares.
- **Duas correções de índice no `README` eram defeito preexistente** ("três arquivos" com quatro
  listados; "10 capacidades"), e nenhuma é minha de origem. Corrigidas; registro para o orquestrador saber
  que o `README` estava divergindo em dois pontos, o que sugere conferi-lo ao fim de cada ficha.
- **`RN-PRV-020` (b) é um caminho de quatro etapas para uma coisa que o humano pediu com ênfase.** O risco
  não é ele discordar: é alguém construir o artefato corrente **cumprindo** a decisão dele e **sem** as
  quatro, porque cada uma das quatro está num arquivo diferente. A tabela da §5 existe para que as quatro
  apareçam juntas em um lugar.
PERGUNTAS:
  - para `ui`: **qual espaço o nosso console habita?** Os espaços declarados em `docs/design/**` são de
    operação de cliente (terminal de caixa, tablet, celular do cliente-final, display fixo de leitura à
    distância) e o nosso não é nenhum deles — é trabalho de escritório, teclado, sessão longa, sem pico e
    sem alvo de toque apertado. Espaço novo, ou variante de um existente? Não desenhei nada e não presumi.
  - para `seguranca`: **`LACUNA-PRV-011`** — a propriedade que eu exigi da unidade de leitura corrente (a
    contagem continua significando *quanto acesso a nossa operação exige*, e o cliente continua
    distinguindo uma ocasião de outra) é suficiente para você julgar uma proposta de unidade, ou falta uma
    terceira condição do seu lado?
  - para `seguranca`: a linha **R8** (exportar) e a linha **R7** (ler a nossa trilha) são as duas que eu
    criei sem pedido. R8 é o canal lateral que você declarou como requisito sem achado no passo 2; R7 é
    `PRV-09` com forma. Alguma das duas precisa de cláusula **antes** da valoração, ou a célula basta?
  - para humano: **`LACUNA-PRV-012`** — "plano" é objeto próprio (pacote, faixa de preço, compromisso de
    prazo) ou é o **conjunto de módulos ativos**, que é a base de cobrança já declarada? É comercial.
  - para humano: **`LACUNA-PRV-013`** — a janela do binário "módulo contratado e não usado". E a pergunta
    de dentro dela: a janela é **uma** ou são três, porque a tolerância de "não está usando" difere para
    oferecer treino, para retirar o módulo e para parar de cobrar?
  - para humano: **existe limite default nosso** para o erro de uma antecipação (`CAP-REL-001`), ou a
    capacidade não liga até o cliente declarar o dele? O aceite sobrevive às duas respostas; o default é
    número.
VERIFICAÇÃO: não rodei teste — não há código. **Conferência de endereço em disco, um a um, nesta data,
antes de citar:** `superficie-por-papel.md` **inteiro** (365 linhas) — `RN-NUC-034` `:48-70`, `RN-NUC-035`
`:72-140` (as três origens em `:74-100`, a (i.b) em `:78-84`), `RN-NUC-036` `:142-229` (as três negações em
`:144-149`, as duas formas em `:150-162`), §4 item 5 `:304-308`, §5 `:322-331` (a linha de
`LACUNA-NUC-031` é a **:328**), §6 `LACUNA-NUC-031` em **:356-359**;
`matriz-operacao-papel-modulos.md` (**277** depois da minha linha) — §7 `:151-184` (as quatro linhas de
leitura `:168-171`, as notas ⁷ e ⁸ `:173-178`), §8 `:188-213` (**43 de 380**, e as duas leituras do número
em `:210-213`), `LACUNA-NUC-037` **:266-278** (era `:266-274`; cresceu 4 linhas com o ponteiro que eu
acrescentei, e o heading da §9 e das §7/§8 **não** se deslocou porque a minha edição é a última do
arquivo), `LACUNA-NUC-019` `:229-236`, `RN-NUC-033` `:35-59`;
`modulos/relatorios.md` `:41-59` (propósito e a tabela de fronteira — "projeção do que vai acontecer |
**fora**, hoje" é a **:55**; exportação → núcleo/`PN-10` é a **:49**), `RN-REL-001` `:65-90` (os oito
campos e o campo 2 como **candidato**, `:73-75`), `RN-REL-002` `:92-111`, `RN-REL-003` `:113-131`,
`RN-REL-005` `:155-177`, `RN-REL-006` `:179-205`, `RN-REL-007` `:207-226`, `RN-REL-008` `:227-246`;
`modulos/relatorios-semente-de-perguntas.md` `:21-26` (o campo `QUEM` é candidato), `RN-REL-009` `:28-54`,
§2 `:181-187` (`cashier` e `provider_support` sem relatório), §3 `:190-204` (a linha da projeção **:203**,
que eu editei), §4 `:208-235` (`LACUNA-REL-001` a `007`); `catalogo-de-capacidades.md` — **endereços conferidos depois das
minhas edições, porque elas deslocaram tudo a partir da §1** — §1 `:19-75` (os 14 campos `:23-38`, e o
**campo 6 é a `:30`**; as cinco regras `:40-56`, a regra 3 em `:48-49` e a regra 4 em `:50-53`; **a minha
recusa do quarto valor é `:58-75`**), o formato de entrada conferido em `CAP-PER-001` `:102-115` e
`CAP-EST-001` `:117-130`, **`CAP-REL-001` `:148-179`**, §7 `:314-330`, §8 `:332-361` (a linha de "prever
quanto produzir" que eu editei), §9 `:363-390`; `glossario.md` **:332** (`PRV` registrado
com espécie **provedor**, não "módulo" — é o que sustenta a recusa de `CAP-PRV-`); `operacao-do-provedor.md`
`:144-192` (`RN-PRV-003`, a tabela dos três papéis `:157-161`, o aceite da busca-zero `:183-185`),
`:194-216` (`RN-PRV-004`, cláusulas do objeto), §3 `:370-383`; `-alcance.md` `:104-129` (`RN-PRV-009`, a
lista é a coluna e os canais não são intercambiáveis), `:195-218` (`RN-PRV-010`), §2.1 `:168-193`, §2.2
`:220-229`, `RN-PRV-017` `:231-307` (a cláusula (d) `:243-254`), §3 `:322-339` (as cinco perguntas; a
responsabilidade é a **5**, `:335-336`), §4 `:341-**374**` (cresceu 2 linhas com a minha nota da sequência
de lacunas); `-autorizacao.md` `:30-62` (`RN-PRV-015`, e a exportação de diagnóstico nomeada em `:54-56`),
`:68-112` (`RN-PRV-016`), §3 `:116-**129**` (cresceu 3 linhas com a minha correção do ponteiro);
`fatos-de-operacao-provedor.md` §2 e §3 **antes** de editar (`provider_advice_issued` e
`module_state_change`), `RN-PRV-014` inteiro; gate de fecho §4 `:110-158` (a contagem 4/9/5 e os três sem
saída), `PRV-16` `:296-313`, §5 `:162-183` (as quatro travas), §7 `:317-334`, §8 `:338-358` (o ganho barato
de `provider_advice_issued`), §10 `:379-394`; console de gestão §2 `:71-132` (`F1`–`F6`) e **§2.1
`:134-151`** (os três destinos do pico, e o binário de módulo como saída boa).
**Conferência de numeração, por busca, antes de numerar:** `RN-PRV-0(1[89]|2[0-9])` → **zero** em todo o
repositório; `LACUNA-PRV-01[1-9]` → **zero**; `CAP-REL-` → **zero**.
**Conferência `PN` do `CAP-REL-001`:** li os **20 títulos** (`postura-nova-geracao.md`, um heading `## PN-nn`
por linha, de `:51` a `:340`) e **não** li o corpo de 15 deles. Os cinco que cito — `PN-07` (`:142`),
`PN-08` (`:157`), `PN-13` (`:246`), `PN-16` (`:276`), `PN-20` (`:340`) — são os que aparecem citados com
conteúdo em outros arquivos do território, e é por isso que os cito. Os outros 15 são de offline, terminal,
tela, instalação e periférico, e o descarte deles foi por **título**, não por leitura — declarado aqui
porque a regra 2 daquele arquivo exige a conferência contra os 20.
**Contagem de linhas medida** (ripgrep em modo contagem — não tenho shell nesta sessão), arquivo por
arquivo, depois da última edição: `superficie-do-provedor.md` **294**, `matriz-celulas-a-valorar.md`
**157**, `fatos-de-operacao-provedor.md` **351**, `catalogo-de-capacidades.md` **390**,
`matriz-operacao-papel-modulos.md` **277**, `modulos/relatorios-semente-de-perguntas.md` **235**,
`operacao-do-provedor.md` **384**, `-alcance.md` **374**, `-autorizacao.md` **129**, `README.md` **226**.
Os cinco arquivos que o brief marcou como apertados: `fatos-de-operacao.md` **379** (não toquei),
`glossario.md` **396** (não toquei), `roadmap-de-modulos.md` **398** (não toquei),
`verticais/restaurante.md` **400** e `fiscal-custodia-e-trilha.md` **400** (**não encostei em nenhum dos
dois**).
**Não conferi na fonte:** `RN-NUC-008`, `RN-NUC-018`, `RN-NUC-021`, `RN-NUC-024`, `RN-NUC-026`,
`RN-NUC-027`, `RN-NUC-029`, `RN-NUC-032`, `RN-NUC-038`, `RN-NUC-039`, `RN-NUC-046`, `RN-NUC-049`,
`RN-OFF-008`, `RN-EMI-039`, `RN-EMI-040`, `RN-PRV-005`, `RN-PRV-011`, `RN-PRV-013`, `PN-10`, `PN-15` —
citei-os pelo que os arquivos que **li nesta passada** afirmam deles, e o caso que mais depende disso é
`RN-OFF-008` ("classe 2 por default"), que copiei da forma de `CAP-EST-001` para não inventar
classificação. **Não li** norma alguma, **não afirmo base legal**, e **nenhum número novo foi escrito em
spec nem em capacidade**.
MEMÓRIA SUGERIDA:
  - type=convention escopo=plataforma slug=celula-candidata-e-especie-diferente-de-celula-valorada — linha
    candidata com valor **em branco** não é `?`: `?` é valor, nega por decisão-ausente e **conta** na
    contagem da matriz; branco é a linha que ainda não foi admitida. Por isso candidata mora em folha
    própria, fora da família de arquivo cujas células são autoridade — e por isso somar a folha à contagem
    produz um número falso que nada acusa
  - type=business-rule escopo=plataforma slug=leitura-derivada-declara-a-forma-ou-nao-acontece — pergunta
    nossa respondida sobre o grão do cliente declara a **forma admissível e a recusada**; sem as duas, a
    forma é escolhida por quem implementa, e a forma que qualquer um escreve é a mais fina que o dado
    permite. Precedente: "módulo contratado e nunca usado" é **binário**, nunca contagem — e o binário
    responde as três decisões nossas por inteiro, que é a prova de que o grão fino não era necessário
  - type=gotcha escopo=plataforma slug=artefato-corrente-colide-com-trilha-por-ocorrencia — se toda leitura
    nossa é fato, um artefato que se atualiza sozinho produz uma leitura por atualização: ou a trilha do
    cliente fica ilegível por volume e a contagem passa a medir recarga de tela, ou o artefato é isento e a
    isenção é a revogação silenciosa da promessa de trilha. Não há terceira saída sem decidir a **unidade**
    da leitura — e a decisão não aparece como decisão, aparece como "o painel ficou lento"
  - type=business-rule escopo=plataforma slug=projecao-carrega-a-natureza-no-valor-nao-no-artefato —
    projeção declara natureza e **erro medido** (períodos fechados fora da derivação, na unidade da
    decisão), e a declaração **sobrevive à extração**: exportada, copiada ou dita ao telefone, o número
    continua identificado. Nunca entra em total com fato — total misturado **é** projeção —, e a precisão
    exibida não excede a que o erro sustenta: exibir centavo com erro de ordem de grandeza mente pela
    precisão sem afirmar nada falso
  - type=business-rule escopo=plataforma slug=sugestao-nossa-se-sustenta-em-fato-do-mesmo-cliente — os
    fatos que sustentam uma sugestão são enumeráveis e **todos do cliente a quem ela é entregue**; sem
    enumerar, ela não é emitida. É o que transforma a proibição de comparativo em **propriedade**: a
    sugestão comparativa deixa de ser gravável, logo deixa de acontecer, e o aceite passa a ser conferível
    na trilha em vez da intenção. Correção de fato sustentador marca a sugestão como *sustentação
    alterada* — nunca atualiza em silêncio
  - type=decision escopo=plataforma slug=catalogo-de-capacidades-nao-admite-escopo-provedor — capacidade é
    o que **o cliente** escolhe ligar; capacidade nossa esvazia `opt-in` e `DESLIGADA`, exige código de
    módulo num identificador cujo escopo não é módulo, e põe o nosso negócio no roadmap do produto. O lado
    nosso tem endereço próprio e é **regra vigente**, não candidata. Reabre **só** se "sugerir melhoria"
    for vendável
  - type=convention escopo=plataforma slug=recusa-de-artefato-nomeia-os-destinos-legitimos-na-recusa —
    quando um pedido do humano não tem forma admissível (pico por estabelecimento), a recusa carrega **os
    destinos que existem** — agregado nosso, relatório dele, leitura por ocorrência com trilha. Recusa sem
    destino é lida como negativa da necessidade, e necessidade não se recusa; recusa com destino é
    escolha de veículo
PRÓXIMO PASSO SUGERIDO: ao **orquestrador**, fechar a ficha — os sete passos de conteúdo estão entregues e
nenhum `BLOQUEIO` está aberto. Antes de fechar, três coisas que são dele: a linha de `PRV-15` no registro
de `D-03`; a correção da premissa vencida em `decision-agregado-de-periodo-fechado-nao-e-cache` (reportada
no passo 1, no passo 3 e ainda aberta); e a consolidação da pauta do humano em **uma** lista — ela hoje tem
as três frases de `matriz-operacao-papel*.md`, os números (`LACUNA-PRV-010`, `011` a `013`,
`LACUNA-NUC-040`/`LACUNA-REL-001`), as **52 células de papel** desta folha (mais 16 de comportamento sem
contato, cujo único valor sustentável hoje é `recusa`) e as quatro perguntas comerciais/legais
(`LACUNA-PRV-001`, `003`, `004`, `007` e o advogado). Ao **`seguranca`**, se o orquestrador quiser gate:
as duas linhas que eu criei sem pedido (R7 e R8) e a suficiência da propriedade de `LACUNA-PRV-011` — não
peço reauditoria do resto, porque nada nesta passada move item para dentro ou para fora da fronteira
`F1`–`F6`.

## Fechamento — orquestrador — 2026-08-23

**Resultado em conteúdo.** O pedido tinha três partes e as três estão entregues, na ordem de
**irrecuperabilidade** que o plano escolheu. (1) A gestão dos estabelecimentos pela nossa parte ganhou
**endereço**: o quinto escopo `provedor`, com 21 regras numeradas, três papéis, o eixo que organiza tudo
(ler e mutar são independentes) e a superfície invariante às decisões abertas. (2) A "base de dados boa"
que o humano enfatizou virou **lista de fatos com veredito de grão fato por fato**, com a coluna que
ninguém escreve — *o que fica impossível para sempre se o fato nascer mais grosso*. (3) A tela ficou no
fim, e ficou como derivação de regra vigente, sem desenhar nada.

**O desfecho que parece defeito e é o correto: o escopo `provedor` hoje não opera nada.** São três travas
empilhadas e independentes — `D-03` aberta (o mecanismo que resolve o cliente-alvo fora do pedido não
existe), a célula de leitura da trilha ausente (nenhum papel nosso é atribuível sem ela), e o default
fechado do escopo sem matriz. Duas delas **existem para cair**; a terceira nunca cai. Está escrito e
registrado em memória justamente para que ninguém as derrube juntas achando que conserta um bug
([[gotcha-a-trava-que-nunca-cai-nao-e-a-inercia]]).

### Definição de pronto, item por item (`processo.md` §2)

1. **Regra de negócio em `docs/produto/**`, numerada, com critério de aceite — CUMPRIDO.** `RN-PRV-001` a
   `021` (21 headings conferidos em disco, cada arquivo com ≥ 1 aceite por regra) e `RN-NUC-041` a `049`
   (9 headings), mais `CAP-REL-001` no catálogo e duas listas de domínio fechado (motivo de recusa, motivo
   de cancelamento) enumeradas **na mesma passada** em que o campo nasceu. `LACUNA-GLO-002` fechada.
   "o código cita esse número" — **não se aplica: não existe código de produto** (Fase 0/1).
2. **Teste do caso concreto do critério de aceite — não se aplica: camada de spec, sem código.** O
   substituto mais próximo existe e foi usado: vários aceites são **conferíveis por busca hoje** — o
   melhor exemplo é o de `RN-PRV-003`, cujo aceite é uma busca por `provider_operator` nas três matrizes
   devolvendo **zero**, executada e confirmada. Bug fix com teste nos dois sentidos — **não se aplica**
   pelo mesmo motivo; os dois consertos desta ficha foram verificados por **reauditoria** (passo 6), que é
   o análogo disponível nesta fase.
3. **DDL / checklist de `migrations.md` §10 / gate 2 — não se aplica: nenhum arquivo em `db/**`** (a
   pasta não existe, conferido). O checklist foi respondido de propósito como **restrição das migrations
   futuras**, e produziu dois resultados úteis antes de existir DDL: nenhum fato desta família é
   soft-deletable (responde parte de `D-04` por eliminação em vez de presumi-la) e `D-06` tem de fechar
   **antes** da primeira migration.
4. **Gate 3 (`seguranca`) — APLICA-SE E FOI CUMPRIDO, com reauditoria.** Não por endpoint (nenhuma rota
   existe) e sim sobre o **modelo de autorização e alcance**, que é o que esta ficha produziu. Três
   arquivos em `docs/auditorias/`: `...-e-console-de-gestao.md` (320), `...-mutacao-e-trilha.md` (157) e
   `...-gate-de-fecho.md` (394). **16 achados `PRV-01` a `PRV-16`** — um `CRÍTICO`, corrigido e
   **reauditado com veredito de fecho**. **Correção ao brief deste fechamento:** são **16**, não 17;
   `PRV-17` não existe em disco (busca em `docs/`, `tarefas/` e `memory/` → zero). Prioridade um
   respondida: nenhum caminho novo em que um cliente veja dado de outro; o eixo desta ficha é nós ↔
   cliente, e o `CRÍTICO` era exatamente ele.
5. **Gate 4 (`performance`) — APLICA-SE E FOI CUMPRIDO.** Dois arquivos:
   `...-custo-de-agregacao-do-provedor.md` (289) e `...-caminho-critico.md` (190), **8 achados `CST-01` a
   `CST-08`**, nenhum `CRÍTICO`. **Ressalva de honestidade, e é a mais importante deste gate: nada foi
   medido.** Não há banco, DDL, aplicação, terminal nem dado — zero `EXPLAIN`, zero tempo real. Todo
   número saiu em **forma** (`O(...)`) ou como grandeza com unidade e **sem valor**, e o que precisaria
   rodar está listado nos dois arquivos com o bloqueio de cada item nomeado. `CST-01` é o achado que diz
   isso de si mesmo: o freio "custo medido" é hoje **inalcançável**, e freio inalcançável não protege nada.
6. **Decisão não óbvia virou registro em `memory/`, no escopo certo, com a linha de índice na mesma
   passada — CUMPRIDO.** 14 registros novos, 2 corrigidos, 1 `state` reescrito; `plataforma/INDEX.md`
   conferido por diff contra o diretório: **41 registros, 41 linhas de índice, nenhum órfão**.
7. **Nenhum segredo no repo — CONFERIDO.** Busca por credencial/chave/token nos nove arquivos novos e
   editados de `docs/produto/**` desta ficha: nenhuma ocorrência que não seja a palavra "segredo" dentro
   de enunciado de regra sobre custódia. Nenhum mecanismo de identidade escolhido (`D-03` segue ABERTA),
   nenhum dado de pessoa real em exemplo.
8. **Toda `MEMÓRIA SUGERIDA` avaliada — CUMPRIDO**, abaixo: escrita, fundida ou recusada com motivo. Os
   sete passos e os dois consertos sugeriram **52** registros.

**Nenhum `BLOQUEIO` aberto.** O `arquiteto-dados` fechou o passo 4 com `STATUS: BLOQUEIO`, e ele foi
**resolvido pelo mecanismo do processo, não ignorado**: todo item dele era decisão do humano ou pergunta
cruzada. As perguntas cruzadas foram roteadas e respondidas dentro da ficha (passo 6 confirmou 7.6.1 com
argumento corrigido e 7.6.2; `produto` fechou motivo de cancelamento e `service_mode`); as decisões do
humano estão **escaladas por escrito**, na pauta única, com o efeito de cada uma ficar aberta.

### A questão de `MEMORY.md`: o escopo `provedor` merece área própria?

**Não, e a decisão está registrada.** Pelo critério de `memoria.md` §1 a resposta para no primeiro degrau:
este conhecimento vale para **qualquer** cliente e **qualquer** módulo. O teste que decide é o caminho de
leitura: residência de fato, chave de correlação, retenção, tenant na borda e calendário de fato são
restrições que mordem quem está modelando a **venda do cliente**, sem nenhuma intenção de trabalhar no
provedor. Numa área própria, esse agent não as leria — e são exatamente elas que ele precisa. Área nova em
`MEMORY.md` só nasce quando existir conhecimento que **só** faz sentido dentro dela; hoje não existe.
`MEMORY.md` **não foi tocado**.

### Memória escrita a partir desta ficha (14 novos)

Todos em `memory/plataforma/`, com linha de índice na mesma passada.

- `decision-quinto-escopo-provedor` — o endereço, e as duas recusas que o acompanham: o nome "plataforma"
  não se herda, e id gasto (`provider_support`) se **mapeia**, não se renomeia. É a porta de entrada do
  grafo para tudo o que esta ficha produziu.
- `decision-leitura-e-mutacao-sao-eixos-independentes` — **o registro que mais explica esta ficha**: é o
  eixo que fez o desenho vigente ser **completado, não negado**. Nenhuma negativa de `RN-NUC-024` caiu,
  porque todas são sobre **agir**. Guarda também a ressalva medida (existem quatro negativas de *largura de
  leitura*, e são células) e a data da premissa que caiu.
- `convention-gravar-a-propria-trilha-nao-e-mutacao` — as duas metades num registro só, porque são o mesmo
  fato visto de dois lados: o eixo mede alcance sobre o dado do **negócio**, e a promessa se escreve como
  **resultado**, nunca como lugar. Foi a segunda metade que fez a regra sobreviver às cinco saídas de
  `D-06` sem presumir nenhuma.
- `decision-d-06-sao-tres-residencias-nao-uma` — as três perguntas, as cinco saídas com defeito em cada,
  **nenhuma escolhida**, e a linha proposta (residência segue o **objeto**) com o defeito dela na mesma
  frase. Mais o motivo pelo qual a (ii) não espera a Fase 1.
- `gotcha-fato-do-provedor-nao-tem-residencia-unica` — separado do de `D-06` **de propósito**: é derivação
  que **sobrevive** ao fechamento de `D-06`, e some se ficar dentro de um registro de decisão que um dia
  vira histórico. Guarda a conclusão certa **e** o argumento falso recusado, com o motivo correto no lugar.
- `convention-retencao-tem-tres-relogios` — obrigação · **prova** · discricionário, e a razão de o terceiro
  existir: no discricionário, a única prova de que o nosso acesso foi legítimo é encurtável por custo, sem
  violar regra nenhuma e sem sintoma.
- `convention-fato-nao-carrega-campo-de-calendario` — só instante, e **dois** instantes. É o que faz a
  família sobreviver ao conflito de fuso fechando para **qualquer** lado, e por isso é o registro que
  **rebaixou a urgência** de uma pendência antiga em vez de criar uma nova.
- `gotcha-zero-venda-nao-se-distingue-de-terminal-morto` — o argumento de `LACUNA-NUC-038` que ninguém
  tinha dito, e o único item desta pauta que perde valor **todo dia**.
- `gotcha-agregado-e-seguro-por-concentracao-nao-por-n` — fusão deliberada de duas sugestões (`N` pequeno
  e concentração): são graus do mesmo defeito, e o segundo é o furo que o primeiro não cobre. Guarda a
  distinção que faz o defeito passar despercebido — "não contém número de outro" mede **conteúdo**, "não
  permite reconstruir a curva de outro" mede **forma**.
- `gotcha-artefato-corrente-colide-com-trilha-por-ocorrencia` — painel ao vivo × trilha por ocorrência, e o
  motivo de ninguém ter notado: dashboard e auditoria se pensam em salas diferentes. Carrega o gêmeo de
  custo (recarga × N schemas, degradando sem ninguém pedir nada).
- `convention-celula-candidata-e-especie-diferente-de-celula-valorada` — branco ≠ `?`, e a consequência que
  não tem sintoma: somar a folha às 43/380 produz número falso. É o registro mais fácil de perder desta
  entrega, e é citado por três arquivos.
- `gotcha-nenhuma-superficie-nossa-enumera-clientes-para-escolher` — a derivação do `CRÍTICO` chegando na
  tela, com o detalhe que a torna memorável: do nosso lado, a lista de clientes entrega a **carteira**.
- `gotcha-a-trava-que-nunca-cai-nao-e-a-inercia` — quatro coisas que parecem a mesma, e o sinal de que
  alguém as confundiu (uma delas caindo sem ato datado).
- `gotcha-o-caso-de-falha-do-mecanismo-novo-e-o-primeiro-lugar-a-olhar` — `AUT-15` → `PRV-03` → `PRV-11`,
  e a terceira **nasceu do conserto da segunda**. Corolário operacional: quem cria sujeito novo entrega o
  campo dele na mesma passada — irmão do registro de T-0003 sobre célula.

### Memória corrigida (as três de higiene que eram minhas, pendentes há duas fichas)

1. **`decision-agregado-de-periodo-fechado-nao-e-cache` — premissa vencida, corrigida em vez de apagada.**
   Reportada nos passos 1, 3 e 4 e aberta desde então. A correção 1 foi **reescrita**: "nenhuma pergunta de
   relatório **do cliente** soma clientes" continua verdade; o que caiu é a generalização, porque existe
   agora um leitor cujas perguntas somam clientes. **O que sobrevive, e é a maior parte:** vazamento por
   agregado para agregado **decomponível** alojado no `platform` (reconfirmado por auditoria), paginação
   limita a saída e nunca a janela, transferir o dono não transfere o custo, e o pior caso em forma. Ganhou
   também a extensão de "pico": pico de período **encerrado** é derivação, não cache, e a saída sem cache
   passa **condicionada à concentração**. A linha de índice foi marcada com ⚠️.
2. **`PRV-15` escrito — era achado cujo dono é `memory/**`, portanto meu.**
   `decision-d-03-sao-tres-eixos-nao-uma-decisao` ganhou a restrição: para papel de escopo `provedor`, a
   família de respostas em que o cliente-alvo chega **no pedido** está eliminada por regra vigente. Sem
   esta linha, quem fechasse `D-03` lendo o registro não saberia que contraria regra vigente — a restrição
   existiria só numa `RN-PRV` que ninguém abre ao decidir auth. O registro ganhou também o agravante de
   mutação, e a `description` passou a anunciar que o terceiro eixo já perdeu uma opção.
3. **`state-pendencias-abertas-2026-08-23` reescrito como a pauta única**, nos quatro blocos, ordenado por
   alavanca, com a fila anterior fundida **sem duplicar** e com três itens marcados como **mudados** em vez
   de repetidos: `LACUNA-NUC-037` (não falta mais desenhar a linha, falta valorá-la — 12 valores),
   `LACUNA-REL-001` (deixou de ser item solto: `RN-NUC-049` a amarra a `LACUNA-NUC-040`, e as duas fecham
   na mesma passada) e o **fuso** (deixou de ser irrecuperável e passou a ser caro, porque nenhum fato
   carrega calendário). Nada foi declarado obsoleto: nenhuma pendência antiga morreu nesta ficha.

### Recusado, com motivo

**Enunciado de regra que agora vive numerado em `docs/produto/**` (~30 sugestões).** Recusadas pelo
critério que este fechamento fixou na T-0003 e mantém: `docs/produto/**` é o lar **numerado, com aceite e
citável** da regra, e copiar regra numerada para `memory/` cria a segunda fonte que envelhece calada
(`memoria.md` §8, "não registre o derivável"). A recusa é da **cópia**, não do conteúdo — em vários casos o
conteúdo entrou nos registros acima como **método** ou **armadilha**. Nesta classe: leitura nossa por
cláusula de contrato · módulo ativo é fato de cobrança · recusa é fato com motivo enumerado · leitura
nossa é fato que não copia o lido · cliente-alvo não vem do pedido (o **enunciado**; a armadilha da tela
foi escrita) · identificador pretendido ≠ alvo resolvido · todo `P` declara decisão e canal · nada
entregue a um cliente carrega forma de outro · promessa de não apagar em quatro partes (as quatro entraram
**dentro** do registro da trilha) · leitura derivada declara a forma · projeção carrega a natureza no valor
· sugestão se sustenta em fato do mesmo cliente · fronteira entre observação de operação e dado de negócio
(seis condições e o teste de admissão — vivem na auditoria, que é artefato citável) · grão fino por padrão
· `RN-NUC-044` decide se o fato existe / `041` decide o grão.

**Fundido, em vez de duplicado — sete casos.**
- `premissa-implicita-cai-sem-enunciado-mudar` → **dentro** de
  `decision-leitura-e-mutacao-sao-eixos-independentes`, com a data da queda. Sozinho seria conselho; junto
  da decisão que a queda produziu, é verificável.
- `agregado-com-n-pequeno-identifica-o-cliente` → dentro de
  `gotcha-agregado-e-seguro-por-concentracao-nao-por-n` (graus do mesmo defeito).
- `pico-e-periodo-fechado-so-agora-e-aberto` → dentro do registro de agregado que **já** governa o tópico
  (`memoria.md` §8: atualize o que existe em vez de criar ao lado).
- `promessa-de-trilha-se-escreve-como-resultado-nao-como-lugar`,
  `promessa-de-nao-apagar-precisa-de-relogio-de-prova` e `promessa-de-nao-apagar-e-propriedade-em-quatro-partes`
  → dentro de `convention-gravar-a-propria-trilha-nao-e-mutacao`. Três sugestões, um fato: como se escreve
  regra de trilha.
- `residencia-segue-o-objeto-do-fato-nao-o-leitor` → dentro do registro de `D-06`, onde ela é **proposta com
  defeito declarado**, não convenção vigente. Promovê-la a convenção separada a faria parecer decidida.
- `conclusao-certa-com-argumento-errado-nao-sobrevive` + `...-se-troca-com-data` → dentro de
  `gotcha-fato-do-provedor-nao-tem-residencia-unica`, que é a instância concreta. Isolada, a lição é
  aforismo; ancorada no caso, é conferível.
- `exclusao-de-regra-se-justifica-pelo-objeto-nao-pelo-sujeito` (sugerida duas vezes) → dentro de
  `gotcha-nenhuma-superficie-nossa-enumera-clientes-para-escolher`, como o **mecanismo** do `CRÍTICO`.

**Recusado por ser derivável de regra sempre-lida** (`00-nucleo.md` §1: regra vence memória, e repetir
diminui a chance de ser lida): `medida-que-falta-e-freio-que-nao-existe` — `performance.md` §1 já proíbe
número não medido; o que era novo nela ("freio inalcançável não protege") ficou dito no `CST-01` e na
pauta · `consumidor-nosso-do-banco-do-caixa-cede-como-a-drenagem-cede` — é `RN-OFF-030` estendida, e a
extensão é pergunta ao humano (3.10 da pauta), não conhecimento · `dois-instantes-nascem-juntos-ou-nunca`
→ é cláusula do registro de calendário, mesmo fato (tempo do fato), não fato novo ·
`diagnostico-cede-antes-do-dinheiro-no-recurso-local` e `perda-que-chega-como-ausencia-e-um-eixo-so` →
`RN-NUC-046` e `RN-NUC-049` estão numeradas com aceite e moram **juntas** num arquivo cujo eixo é
exatamente essa lição; a memória seria a terceira cópia · `correlacao-global-em-dois-schemas-e-chave-de-juncao`
→ **estende cláusula existente** de `decision-tenancy-schema-por-cliente` ("chave de cache, fila, log e
exportação carrega cliente") em vez de contradizê-la; fica anotado aqui como o único item **não escrito**
que eu recomendo escrever no dia em que a Fase 1 abrir, porque é o caminho que o isolamento por schema
**não vê** e ele só morde quando existir código que gere identificador.
`particao-por-tempo-e-decisao-de-nascimento` e `custo-de-painel-ao-vivo-...` → o primeiro é decisão de
Fase 1 sem nada a decidir hoje e vive no achado `CST-`; o segundo entrou como cláusula do registro de
artefato corrente · `vocabulario-gasto-nao-se-renomeia-mapeia-se` → dentro de
`decision-quinto-escopo-provedor`, que é onde a dívida de nome nasceu ·
`coluna-de-consumidor-vira-lista-de-autorizacao`, `celula-candidata...` (a parte de organização de
arquivo), `catalogo-de-capacidades-nao-admite-escopo-provedor`, `inercia-declarada-custa-menos-que-negativa-absoluta`,
`recusa-de-artefato-nomeia-os-destinos-legitimos-na-recusa`, `enumeracao-nasce-com-o-campo-ou-nao-nasce`,
`campo-obrigatorio-sem-valor-possivel-...`, `trava-transitoria-e-propriedade-permanente-...`,
`regra-de-escopo-novo-nao-herda-o-default-fechado`, `registrar-nao-e-ler`,
`hora-de-pico-por-estabelecimento-nao-tem-saida`, `papel-que-serve-n-clientes-nao-tem-tenant-na-identidade`,
`fato-de-diagnostico-e-o-unico-volume-nao-limitado-pelo-negocio`, `fan-out-parcial-...`,
`retencao-e-janela-de-leitura-sao-o-mesmo-numero`, `pedido-abandonado-nao-existe-no-servidor`,
`leitura-derivada-declara-a-forma-...` → **absorvidos** pelos 14 registros escritos, cada um dentro do
registro que já governa o assunto, ou pela regra numerada que os tornou vigentes. Três exceções nomeadas
aqui porque são as mais contraintuitivas e ninguém deve redescobri-las: **`RN-NUC-044` decide se o fato
existe e `RN-NUC-041` decide o grão de um fato que existe** (sem a separação, "grão fino por padrão"
reabre toda recusa de fato novo); **papel que serve N clientes não tem tenant na identidade** — é o
primeiro sujeito deste sistema para quem `backend.md` §1 não funciona, e o tenant chega por **seletor**;
e **"módulo contratado e nunca usado" é binário, nunca contagem** — o binário responde as três decisões
nossas por inteiro, que é a prova de que o grão fino não era necessário.

**Recusado por ser contagem ou organização de arquivo:** as partições declaradas (quatro arquivos de
fatos, três do provedor, dois de auditoria por eixo), os totais de linha e o número de arquivos. É o tipo
de registro que nasce mentindo — na T-0003 uma contagem de arquivos **já estava errada ao fechar**. As
contagens desta ficha ficam abaixo, datadas, dentro do artefato que as mediu.

### O que fica aberto, com dono

| O que | Dono | Por que importa |
|---|---|---|
| **A pauta única, quatro blocos, 3 frases + 68 células + ~20 decisões e números + 7 comerciais/legais** | **humano** | está em `memory/plataforma/state-pendencias-abertas-2026-08-23.md`; ordem de alavanca no topo dela |
| **`AUT-17` da T-0003 — segue ABERTO** | **humano** | nenhuma célula de **módulo** carrega `terminal+ident`: às 21h01 o núcleo vende por `terminal+ident` e o módulo **recusa** a mesma operação. Falha fechado, não bloqueia — mas bloqueia a entrega de `MSA` ao primeiro cliente |
| **`PRV-07`, `PRV-08` — abertos declarados** | `produto` (depois de 4.1 da pauta) | pedem `RN-PCF-012`/`013`, e a **inércia** de `RN-PRV-008` fecha o caminho dos dois hoje **sem fechar o defeito**. Reabrem no dia em que a base legal existir |
| **`PRV-09` — aberto declarado** | **humano** | precisa de um **leitor nomeado** da nossa própria trilha que não porte o alcance auditado; os dois candidatos existentes não servem. Sem ele, nenhum papel nosso é atribuível |
| **`PRV-16` — parcial** | `produto` | a forma binária entrou onde o achado pediu e como cláusula geral; o achado segue **citado como aberto** de propósito, para a exclusão das tabelas do provedor não ser lida como licença de forma. Uma frase resolve |
| **`CST-01`, `CST-02`, `CST-03`, `CST-05`, `CST-07`, `CST-08` — encaminhados, não fechados** | `performance` + humano | `CST-02` e `CST-05` ganharam cláusula (`RN-NUC-046`, `RN-NUC-049`); `CST-07` entrou **pela metade** (a grandeza de espaço entrou, o **espaçamento de retentativa** não, e é ele que governa a cardinalidade da tabela mais volumosa da Fase 1); `CST-01`/`CST-08` fecham com o terminal-alvo |
| **`docs/produto/README.md` divergia em dois pontos** (dizia "três arquivos" com quatro listados; "10 capacidades" com 11) | `produto` | corrigido nesta ficha, e o padrão sugere **conferir o `README` ao fim de cada ficha** — é o primeiro artefato que uma partição desatualiza |
| **`docs/design/vocabulario-e-eixos.md:377`** aponta para o `state` que o fechamento da T-0002/T-0003 **removeu** | `ui` | referência pendurada; conferida em disco hoje, continua lá. Fora do meu território |
| **Resíduos de prosa** (`RN-NUC-047`/`048` são regras de núcleo num arquivo de *fatos*; `RN-PRV-021` longe da casa natural; `RN-EMI-040` e `LACUNA-NUC-011` ainda dizem "operação da plataforma") | `produto` | nenhum muda desfecho de regra; todos custam **não ser encontrados** |
| **Citações de `path:linha` das duas auditorias de `performance` envelheceram** — `RN-NUC-046` mudou de arquivo | `performance` (na próxima passada) | o ponteiro ficou no lugar antigo, então quem seguir a citação cai no ponteiro, não no enunciado |
| **`F1`–`F6` não aplicados aos 13 fatos do provedor** | `seguranca` | é **método declarado**, não omissão: eles são a nossa trilha e a nossa infraestrutura, não observação do negócio do cliente. Os dois que tocam a fronteira estão tratados |
| **Grão dos fatos de módulo** (`MSA`, `COZ`, `PCF`, `PER`, `EMI`) | `produto` → `arquiteto-dados` | é **trabalho, não decisão**: um despacho por módulo. O de `COZ` (tempo de produção por ponto) é o que o humano vai sentir falta primeiro |

**Medido em disco em 2026-08-23, ao fechar** (`find`, `wc -l`, `grep -c`, nunca estimativa): **71 arquivos**
em `docs/` somando **20.271 linhas** — 48 em `docs/produto/` (14.184 linhas), 8 em `docs/auditorias/`, 8 em
`docs/design/`, 7 em `docs/arquitetura/`. **Correção ao brief deste fechamento:** ele media 69 arquivos e
19.669 linhas; a diferença é **exatamente** os 2 arquivos e as 602 linhas do passo 7, que entrou depois da
medição. Nenhum arquivo de `docs/produto/**` acima de 400 linhas. `memory/plataforma/`: **41 registros**,
41 linhas de índice, zero órfãos (conferido por `diff` entre o diretório e o índice). `db/**` **não
existe**. Achados desta ficha: `PRV-01`..`PRV-16` (16) e `CST-01`..`CST-08` (8); o prefixo `CST-` nasceu
aqui, e `PRV-` foi escolhido porque `AUT-` já nomeia os achados da T-0003.

**Fase:** a Fase 0 continua fechada e a **Fase 1 não abriu** — `D-04` aberta, e agora com dois vizinhos
que a acompanham (representação de dinheiro, que nem está no `CLAUDE.md` §8, e `D-06` (ii)). Esta ficha
é o insumo da Fase 1, não o começo dela: o veredito de grão da seção `arquiteto-dados` é a parte que
**precisa sobreviver** até lá, e é por isso que ela está na ficha e resumida em memória, não num arquivo
de `db/` que a fase ainda não autoriza.

# Emissão própria — `EMI`: habilitar e manter

Continuação de `modulos/fiscal.md` §3, que fixou a fronteira e `RN-EMI-001` a `RN-EMI-003` — nada aqui
as contradiz. `EMI` está em **três** arquivos, por tamanho e por assunto: **este** é o que precisa estar
em pé e mantido para emitir — layout versionado, ambiente, multiplicação por UF, que documento se aplica,
regra de ouro (`RN-EMI-008` a `RN-EMI-016`); `fiscal-emissao-contingencia.md` é o que acontece com **cada
documento** depois da venda — guarda e entrega, retorno do autorizador, rejeição, numeração queimada,
contingência e fila de pendências (`RN-EMI-017` a `RN-EMI-032`); e `fiscal-custodia-e-trilha.md` é a
custódia, **onde o ato de assinar acontece**, quem pode usar esse poder e a trilha do ato (`RN-EMI-004` a
`RN-EMI-007`, que moraram aqui na §1 até 2026-08-22, mais `RN-EMI-033` a `RN-EMI-041`).
Pressuposto de tudo:
`RN-FIS-004` e `RN-EMI-002` — **`EMI` consome um artefato congelado que não produziu e nunca recalcula**.

**Regra de honestidade.** Toda afirmação sobre exigência de emissão carrega **link inline** e o `F-nn`
da tabela `## Fontes`. Fonte única: o dossiê datado
`docs/arquitetura/fiscal/2026-08-22-dossie-emissao-propria.md` — a coluna "Dossiê" aponta o bloco. O ID
`F-nn` é global e não se renumera; cada arquivo tabula os fatos que **usa** (aqui: F-35 a F-48, F-57 a
F-63 e F-66). Onde não há fonte existe `[[LACUNA-EMI-<n>]]` **no lugar da frase**, nunca "provavelmente" nem
"em geral". **Nenhum fato foi verificado por mim na fonte primária**: o dossiê expira a cada nota
técnica nova. **Convenção das regras** (como em `modulos/fiscal.md` §2): o **título é o enunciado**; o
bloco traz motivo, critério de aceite e caminho infeliz.

**Caso base: Ceará.** Metade da regra de emissão é decisão de **UF** — contingência, entrega a
domicílio, prazo de cancelamento, credenciamento de software emissor, código de responsável técnico.
Onde isso ocorre, o CE é **caso base declarado**, nunca universal. **Segredo:** tratado em
`fiscal-custodia-e-trilha.md` como **ativo nomeado, com responsável, vigência e alcance** — e nada mais;
nenhum caminho, arquivo, formato de armazenamento, repositório ou senha (`CLAUDE.md` §7.8), e "tipo de
credencial" é **categoria normativa**, não formato.

## 1. Custódia, poder de assinar e trilha — mudou de arquivo em 2026-08-22

`RN-EMI-004` a `RN-EMI-007` (credencial como ativo de um cliente só e sua vigência; troca, renovação e
revogação; modo de assinatura declarado; os três segredos de emissão) **moraram aqui** e agora estão em
`fiscal-custodia-e-trilha.md`, junto da alternativa documentada e não adotada (PAA) e de
`LACUNA-EMI-001` a `003`. Os números **não** mudaram (`glossario.md` §4.2). Motivo da mudança: a decisão
do humano de 2026-08-22 sobre achado crítico de auditoria acrescentou nove regras a esse assunto
(`RN-EMI-033` a `RN-EMI-041`: **onde o ato de assinar acontece**, validação contra o estabelecimento do
documento, trilha por ato, papel nomeado, revogação, comprometimento por furto de terminal, escopo de
exportação, consolidado entre clientes, alcance de segredo) — assunto próprio, arquivo próprio.

## 2. Layout versionado — assinatura permanente de manutenção, não migração única

Não é esforço de reforma que termina. A especificação de um mesmo documento foi de **v1.01 a v1.51**
entre 2025 e 2026-08-04 (F-42); as **tabelas de domínio** mudam por informe técnico, em cadência própria
e mais rápida (F-43); e há um terceiro canal, de atos conjuntos, que também precisa ser acompanhado
(F-44). Três cadências independentes, nenhuma nossa. Que campo cada versão exige **não está aqui**: o
dossiê não leu a especificação integralmente (`[[LACUNA-EMI-009]]`) e este arquivo trata de **como a
versão entra**.

### RN-EMI-008 — O documento guarda a versão de especificação com que foi emitido, e versão nova nunca reescreve documento antigo

**Motivo** `PN-08` e `RN-FIS-004` aplicados ao **layout**, não só ao tributo: reimprimir, retransmitir ou
responder consulta sobre documento antigo tem de reproduzir o que foi transmitido. E as versões
convivem: o histórico traz **duas datas por item** (homologação e produção), a homologação **varia por
UF** dentro da janela, e há itens marcados "implementação futura" **sem data**
([NT 2025.002-RTC v1.51, cronograma](https://www.nfe.fazenda.gov.br/portal/exibirArquivo.aspx?conteudo=AKD%2FmuSmiIY%3D),
F-41) — logo dois estabelecimentos do mesmo cliente, em UFs diferentes, podem estar legitimamente em
versões diferentes.
**Aceite** documento emitido na versão anterior, reimpresso depois de a nova entrar em vigor, sai
idêntico ao transmitido; pendente gerado antes da virada é transmitido na versão com que foi montado e
**não é remontado** (`RN-EMI-030`).
**Infeliz** a versão usada não é conhecida → o documento **não** é retransmitido por adivinhação:
pendência "versão de especificação indeterminada", que é falha nossa, não do cliente.

### RN-EMI-009 — Versão de especificação é dado publicável com vigência, por documento e por UF; versão nova não é release de emergência

**Motivo** o mecanismo já existe para regra tributária (`RN-FIS-001`, `RN-FIS-009`) e o problema é o
mesmo: a especificação é aprovada e ratificada por ato que **nomeia nota técnica e versão por modelo de
documento** (F-45), a lista vigente é publicada em canal oficial (F-42), e os prazos não são fixos —
itens com cerca de dois meses, itens de poucos dias (F-41). Depender de release para cada informe
técnico de tabela (F-43) é garantir estar atrasado.
**Aceite** publicar versão com vigência futura, ensaiar em homologação (`RN-EMI-011`) e deixá-la entrar
sozinha na data, por documento e por UF, sem parar caixa e sem migração de dado; o documento de ontem
continua na versão de ontem (`RN-EMI-008`). O que **exige** código novo — campo, grupo ou regra nova,
como os grupos de IBS/CBS (F-46) — é declarado como tal, com prazo, e não se disfarça de publicação de
dado.
**Infeliz** a data chega e a versão nova não está pronta → o estado é **declarado antes** ("este
estabelecimento emite na versão X; a exigida a partir de tal data é Y"), com contagem de dias, nunca
descoberto pela primeira rejeição no caixa.

### RN-EMI-010 — Campo que a validação ainda não recusa, mas a norma já obriga, é pendência declarada — nunca campo opcional

**Motivo** a própria especificação registra que, **mesmo quando a regra de validação não exige** o
preenchimento, ele "permanece obrigatório conforme a legislação vigente", e que a informação dos novos
tributos tem valor jurídico desde 2026-01-01 (F-48). Ler "não rejeita" como "não precisa" é dívida
barata de contrair e caríssima de pagar: só aparece na fiscalização.
**E a ambiguidade fica declarada, não resolvida:** a mesma versão traz, na regra de validação do grupo
dos novos tributos, observações **datadas** de produção convivendo com uma observação de **"implementação
futura para produção"**, sem deixar inequívoco qual prevalece (F-47) —
`[[LACUNA-EMI-004: a rejeição por ausência do grupo de IBS/CBS está ativa em produção para emitente do
regime normal desde 2026-08-03, ou diferida como "implementação futura"? — sem fonte em 2026-08-22]]`.
**Aceite** documento montado sem campo que a norma obriga é emitido **com a pendência registrada**,
nomeando campo e motivo; nenhuma tela apresenta o campo como opcional; a **gravidade** exibida muda com
a resposta da lacuna, o **fluxo** não.
**Infeliz** o autorizador rejeita por esse campo → é rejeição corrigível (`RN-EMI-019`), a venda já
existe (`RN-EMI-001`) e a pendência aponta o cadastro que falta (`RN-FIS-018`), não o operador.

## 3. Homologação, produção e provisionamento

### RN-EMI-011 — Ambiente é atributo declarado do estabelecimento, e homologação é permanente, não etapa de implantação

**Motivo** há dois ambientes, e o de homologação serve à implantação **e sempre que o sistema for
alterado depois de já estar em operação**; o uso de **qualquer** dos dois depende de credenciamento
prévio na SEFAZ da UF; e teste feito em produção por falha da aplicação pode disparar controles de uso
indevido **com bloqueio de serviços**
([MOC 7.0 Visão Geral, 4.3.7 e 4.3.8](https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-visao-geral.pdf),
F-57). Como a especificação muda em três cadências (§2), "alterado depois de estar em operação" é o
estado normal — homologação é rotina permanente, e toda versão nova (`RN-EMI-009`) passa por ela.
**Aceite** nenhum documento de homologação é apresentado como fiscal em nenhuma superfície; nenhum
caminho permite emitir em ambiente diferente do declarado por configuração distraída; o ambiente aparece
em todo documento e em toda pendência. O ambiente de teste exige literal próprio na descrição do
primeiro item sob pena de rejeição (F-58) — logo dado de teste é **visivelmente** de teste.
**Infeliz** o ambiente não está declarado → emissão **não é habilitada** ali; a venda continua
(`RN-EMI-001`) e a habilitação fica pendente. Nunca "assume produção".

### RN-EMI-012 — Provisionar cliente novo inclui habilitar emissão por UF e por ambiente, e essa habilitação pode ficar pendente sem impedir a venda

**Motivo** `PN-19`: provisionar é reprodutível. Mas emissão tem parte que **não é reprodutível por
nós** — credenciamento na SEFAZ da UF nos dois ambientes (F-57), os segredos por UF (`RN-EMI-007`) e,
onde a UF exige, credenciamento de software emissor (F-40) — e isso depende de ato de terceiro e de
tempo do cliente.
**Aceite** provisionar do zero duas vezes produz o mesmo estado; a habilitação é uma lista de itens
**nomeados** por estabelecimento, UF e ambiente, cada um com responsável e estado (pendente, em análise,
habilitado); e o cliente **vende** com a lista incompleta, com comprovante não fiscal e a limitação
declarada por escrito — nunca por descoberta.
**Infeliz** a UF demora ou nega → o estado fica visível com a data em que entrou nele; não há prazo de
silêncio, e o produto **não** emite em produção "para testar" (F-57).

### RN-EMI-013 — O custo de emissão multiplica por cliente, estabelecimento, UF e ambiente; onde existe teto por UF, ele é limite de produto

**Motivo** três multiplicações verificadas, nenhuma nossa escolha: (a) o autorizador tem endereço
distinto **por UF e por ambiente** ([serviços web](https://dfe-portal.svrs.rs.gov.br/NFCE/Servicos),
F-59); (b) credenciamento é por UF e por ambiente (F-57) e o segredo do código bidimensional é por
contribuinte **e por UF** (F-38); (c) em sistema de desenvolvimento próprio o responsável técnico é o
próprio contribuinte, e onde a UF exige código de responsável técnico a **empresa desenvolvedora pode
ter no máximo 5 códigos válidos por UF**
([MOC 7.0 Visão Geral, 2.2.10](https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-visao-geral.pdf),
F-40).
**O que o teto significa depende de resposta que não temos:**
`[[LACUNA-EMI-005: um código de responsável técnico atende quantos emitentes — é por desenvolvedora, por
instalação ou por emitente? e quais UFs exigem código e credenciamento de software emissor? — sem fonte
em 2026-08-22]]`. Se for **por emitente**, o teto limita a 5 os clientes que atendemos naquela UF, e é
limite **comercial** fixado por norma; se for por desenvolvedora, é capacidade de rotação. **Não escolho
a leitura conveniente.**
**Aceite** o produto sabe dizer, por UF, quantas habilitações existem, quantas cabem e o que falta — e
essa resposta é **nossa**, para papel nosso, porque ela só existe somando clientes (`RN-EMI-040`); UF
nova entra como **projeto declarado** (credenciar dois ambientes, obter segredos, homologar).
**Infeliz** o teto (se for por emitente) é alcançado → a resposta é comercial e do humano: recusar
cliente naquela UF, ou o caminho alternativo (PAA, `fiscal-custodia-e-trilha.md` §1). O produto
**declara** o limite antes de vender, não depois de assinar. Se o código for por **desenvolvedora**, ele
é segredo de alcance N clientes e vale `RN-EMI-041`.

## 4. Que documento se aplica — mercadoria e serviço

### RN-EMI-014 — Qual documento se aplica decorre da operação declarada; nenhum documento é presumido

**Motivo** o documento de venda presencial a consumidor final admite **só** operação presencial ou
entrega a domicílio: operação não presencial pela internet é **rejeitada** e exige o outro modelo, e a
entrega a domicílio é **parametrizável por UF**, que pode recusá-la
([MOC 7.0 Anexo I, B25b](https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-anexo-i-leiaute-e-rv.pdf),
F-60). É a contraparte de `RN-RES-009` (o modo é declarado, nunca inferido do canal).
**Aceite** a mesma cesta de itens, vendida presencialmente e por canal remoto, resulta em documentos
diferentes **sem** que o operador escolha o documento: a decisão vem da operação declarada e da UF, e é
registrada com o documento.
**Infeliz** a combinação declarada não tem documento aplicável naquela UF → pendência "documento não
determinado para esta operação", venda concluída (`RN-EMI-001`), caso escalado ao humano — nunca o
documento "mais parecido".

### RN-EMI-015 (PROVISÓRIA — depende de `[[LACUNA-EMI-006]]` e de `LACUNA-FIS-008`) — Emissão de documento de serviço é capacidade separada, habilitada por município, e não se presume por haver emissão de mercadoria

**Motivo** são dois universos, e a fonte é explícita: o documento de serviço de padrão nacional tem
**adesão municipal voluntária e sem prazo**, e município com sistema próprio gera **direto** no ambiente
nacional por interface, recuperando o documento depois
([FAQ oficial](https://www.gov.br/nfse/pt-br/biblioteca/copy_of_perguntas-frequentes/copy_of_faq-nfs-e),
F-61); há ambiente de homologação próprio, com acesso solicitado **pelo município aderente**, e parte da
documentação é **minuta** (F-62); e o cronograma de destaque dos novos tributos ali é **outro**, com a
regra de que a ausência da informação **até 2026-12-31 não acarreta rejeição**, ainda que possa gerar
sanção (F-63) — o oposto do que se discute no documento de mercadoria (`RN-EMI-010`).
**Aceite** *(a parte já testável)* a habilitação é **por tipo de documento**: um cliente pode ter
mercadoria habilitada e serviço não habilitado, nenhuma superfície sugere que ele emite serviço, e "não
habilitado" é estado declarado, não erro.
**Infeliz** o cliente precisa emitir serviço e o município não aderiu ou não nos habilita → estado
declarado e obrigação externa (`modulos/fiscal.md` §3.1, `EMI` desligado **por documento**).
**Provisória porque**
`[[LACUNA-EMI-006: um prestador (ou o software dele) pode submeter o documento de serviço direto à
interface do ambiente nacional, e com qual credencial? — sem fonte em 2026-08-22]]` — o material aberto
responde da ótica do **município**, não do prestador. Com `LACUNA-FIS-008` (qual sistema, e o município
no Ceará), não há regra de conteúdo a escrever: **não agendar para construção**, agendar para resolver
as duas.

## 5. A regra de ouro — o que degrada e o que é inegociável

`PN-01` e `RN-EMI-001` já dizem que a venda não para. A outra metade vem da fonte: **problema técnico
não dispensa a obrigação**
([Decreto CE 36.417/2025, art. 1º, I](https://sefazlegis.sefaz.ce.gov.br/api/openFile?id=8ede79ea-72c0-44bd-aeee-9a7d0d5b9428),
F-66 — caso base CE). Salvar a venda **não** apaga a obrigação: ela vira dívida com prazo.

### RN-EMI-016 — A venda não se perde porque a emissão falhou; e a obrigação não desaparece porque a venda foi salva

**Motivo** as duas metades acima. PDV que trava no fiscal perde receita hoje; PDV que "resolve"
esquecendo a obrigação perde o cliente numa fiscalização — e o segundo erro é mais fácil de cometer,
porque não aparece no dia.
**Aceite** com o autorizador fora do ar por uma tarde, o estabelecimento **vende, cobra, entrega e fecha
o caixa**; ao fim existe lista nomeada de documentos pendentes com o prazo de cada um (`RN-EMI-028`), e
nenhum foi fechado por decurso de prazo nem por sucesso presumido.
**Infeliz** nada mais funciona (sem credencial, sem modalidade de contingência na UF, sem impressora) →
a venda ainda conclui, com comprovante não fiscal e pendência declarada; o produto **não** decide por
conta própria deixar de emitir, e operar assim é decisão do cliente, registrada.

**Degrada nesta ordem** — cada degrau é pior que o anterior, e todos preservam a venda:

1. autorização em tempo real → **contingência**, com documento entregue ao cliente-final
   (`fiscal-emissao-contingencia.md`);
2. contingência → documento **montado e assinado**, não transmitido, com comprovante não fiscal;
3. sem assinatura disponível (credencial vencida, `RN-EMI-004`; capacidade de assinar vencida no ponto
   de emissão, `RN-EMI-033`; modo externo sem resposta, `RN-EMI-027`) → **fato tributado congelado** e
   obrigação pendente, sem documento;
4. sem tributo (`FIS` com pendência) → venda registrada com pendência tributária **e** documental
   (`RN-FIS-018`);
5. sem impressora (`PN-18`) → venda concluída e pendência de impressão obrigatória declarada.

**É inegociável, em qualquer degrau:** a venda conclui e o pagamento é registrado; nada é retido no
caixa esperando fisco; o valor tributário **nunca** é recalculado depois (`RN-EMI-002`); a pendência é
**nomeada, contável e visível** a quem pode resolvê-la; número consumido tem desfecho (`RN-EMI-022`);
nada duplica (`RN-EMI-020`); nenhum documento é dado por autorizado sem retorno do autorizador; e
nenhuma pendência se fecha por decurso de prazo (`RN-FIS-011`).

## 6. Acréscimo ao contrato de `EMI`

Não substitui `modulos/fiscal.md` §3.1 — acrescenta. **Expõe também** estado de habilitação por
estabelecimento, UF, ambiente e tipo de documento · vigência da credencial e aviso de vencimento ·
versão de especificação usada por documento · fila de pendências com prazo por documento (`RN-EMI-028`)
· números sem desfecho por série. **Exige também do cliente** credencial no modo padrão e os demais
segredos por UF (`RN-EMI-007`) · credenciamento por ambiente e por UF · modo de assinatura declarado
(`RN-EMI-006`) · política de contingência e decisão sobre guarda eletrônica (`RN-EMI-026`) · natureza da
operação declarada (`RN-EMI-014`). **Ativação** é por **tipo de documento** e por UF, não só por módulo
(`RN-EMI-015`). **Desligado** permanece como em `modulos/fiscal.md` §3.1, e passa a valer **por
documento**. **Sensível também** os três ativos de `RN-EMI-007`, o identificador do comprador quando a
entrega eletrônica o exige (`RN-EMI-017`) e o próprio documento emitido. O que a custódia acrescenta a
este contrato está em `fiscal-custodia-e-trilha.md` §4.

## Fontes

Fonte única: `docs/arquitetura/fiscal/2026-08-22-dossie-emissao-propria.md` — a coluna **Dossiê** aponta
o bloco, com a URL que o dossiê declara ter aberto. Fato de emissão que não esteja tabulado aqui ou em
`fiscal-emissao-contingencia.md` (F-49 a F-56, F-64, F-65, F-67 a F-75) **não existe** nas três specs de
`EMI` — `fiscal-custodia-e-trilha.md` usa as fontes destas duas tabelas e não tabula nenhuma própria.
F-01 a F-34, do regime IBS/CBS, estão em `fiscal-regimes-e-vigencia.md` e `modulos/fiscal.md`.

| ID | Afirmação | URL | Tipo | Dossiê | Acesso |
|---|---|---|---|---|---|
| F-35 | A validade jurídica do documento de venda a consumidor final vem da assinatura digital do emitente somada à autorização de uso pela SEFAZ; a numeração é sequencial por estabelecimento e por série, série em algarismo arábico crescente e **subsérie vedada**. | https://www.confaz.fazenda.gov.br/legislacao/ajustes/2016/AJ_019_16 | oficial (Ajuste SINIEF 19/16, cláusulas quarta e nona) | §1.1, §6.1 | 2026-08-22 |
| F-36 | A credencial de assinatura é emitida por AC credenciada na ICP-Brasil, em dois tipos, com o identificador do titular em campo próprio; a que **assina** precisa ter uso de chave para assinatura digital, e a que identifica o aplicativo na conexão com o autorizador tem **função distinta**. | https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-visao-geral.pdf | oficial (MOC 7.0 Visão Geral, item 4.2.3) | §2.1 | 2026-08-22 |
| F-37 | O tipo mais comum vale **1 ano**; o outro vale até **5 anos** mas exige mídia criptográfica conectada a cada uso, e a perda da mídia é a perda da credencial; há também tipo em nuvem, que exige autorização por dispositivo a cada uso. | https://www.gov.br/pt-br/servicos/obter-certificacao-digital | oficial, **carta de serviços — não o documento normativo da ICP**, que o dossiê não conseguiu abrir (ver `LACUNA-EMI-008`) | §2.2 | 2026-08-22 |
| F-38 | O código bidimensional do documento impresso inclui identificador do **Código de Segurança do Contribuinte** e um hash; esse código é conhecido **só** pelo contribuinte e pelo fisco da UF, e a URL do código é montada por UF. | https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-anexo-i-leiaute-e-rv.pdf | oficial (MOC 7.0 Anexo I, campo ZX02 e item 3.3) | §4.6 | 2026-08-22 |
| F-39 | Existe modelo nacional em que um Provedor de Assinatura e Autorização homologado pelo ENCAT assina e pede autorização **em nome do emitente**; a responsabilidade legal e tributária **permanece do emitente**; o vínculo nasce e morre em portal, por comando de qualquer das partes, com efeito imediato; público-alvo declarado: MEI, produtor rural e optantes do Simples; implantação escalonada até 2026-10-05. | https://www.nfe.fazenda.gov.br/portal/exibirArquivo.aspx?conteudo=AlgHfV6gpAU%3D | oficial (NT 2026.001 v1.02b, introdução e itens 1 a 4; instituído pelo Ajuste SINIEF 9/22) | §2.3, §2.4 | 2026-08-22 |
| F-40 | Em sistema emissor de desenvolvimento próprio o **responsável técnico é o próprio contribuinte**; onde a UF exige credenciamento de software emissor pode ser exigido Código de Segurança do Responsável Técnico, cujo hash vai no documento, e a **empresa desenvolvedora pode ter no máximo 5 códigos válidos por UF**. | https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-visao-geral.pdf | oficial (MOC 7.0 Visão Geral, item 2.2.10) | §2.5 | 2026-08-22 |
| F-41 | Cada versão de nota técnica traz histórico com **duas datas por item** (homologação e produção); a homologação pode **variar por UF** dentro da janela; e o intervalo entre publicação e obrigatoriedade não é fixo — há itens com cerca de 2 meses, itens de poucos dias, e itens marcados "implementação futura" **sem data**. | https://www.nfe.fazenda.gov.br/portal/exibirArquivo.aspx?conteudo=AKD%2FmuSmiIY%3D | oficial (NT 2025.002-RTC v1.51, histórico/cronograma) | §3.3 | 2026-08-22 |
| F-42 | A nota técnica da reforma para esses documentos foi de **v1.01 a v1.51** entre 2025 e 2026-08-04, e a v1.51 é a vigente em 2026-08-22; a lista oficial de notas técnicas vigentes é publicada em portal nacional. | https://www.nfe.fazenda.gov.br/portal/listaConteudo.aspx?tipoConteudo=04BIflQt1aY= | oficial (listagem consultada em 2026-08-22) | §3.2 | 2026-08-22 |
| F-43 | **Tabela de domínio** (classificação tributária, indicadores, alíquotas, NCM, meios de pagamento) não vem por nota técnica, mas por **informe técnico**, com versionamento e cadência próprios. | https://www.nfe.fazenda.gov.br/portal/listaConteudo.aspx?tipoConteudo=hXzemuyNHW4= | oficial (listagem consultada em 2026-08-22) | §3.4 | 2026-08-22 |
| F-44 | Além dos atos técnicos, RFB e CGIBS publicam **Atos Conjuntos numerados** — canal separado do de notas técnicas, que também precisa ser acompanhado. | https://www.cgibs.gov.br/atos-conjuntos | oficial (listagem consultada em 2026-08-22) | §9.5 | 2026-08-22 |
| F-45 | A documentação técnica aplicável a IBS e CBS é **aprovada e ratificada por ato técnico conjunto** RFB/CGIBS, que nomeia **nota técnica e versão por modelo de documento**, inclusive para o documento de serviço. | https://www.cgibs.gov.br/upload/arquivos/202608/01153321-am-ato-tecnico-conjunto-rfb-e-cgibs-ratificacao-nts-dfes-revisao-assinado.pdf | oficial (Ato Técnico Conjunto RFB/CGIBS nº 1, de 2026-07-31) | §3.1 | 2026-08-22 |
| F-46 | A obrigação de adaptar os sistemas autorizadores a leiaute que permita informar IBS, CBS e IS está na LC 214/2025 (disposições transitórias); a nota técnica a implementa criando **grupos e campos novos** de tributo por item, totais, referenciamento de item de outro documento e código de classificação tributária. | https://www.nfe.fazenda.gov.br/portal/exibirArquivo.aspx?conteudo=AKD%2FmuSmiIY%3D | oficial (NT 2025.002-RTC v1.51, itens 1 a 6) | §9.1 | 2026-08-22 |
| F-47 | O cronograma diz que, em produção, o preenchimento dos campos de IBS/CBS é obrigatório para emitente do regime normal desde **2026-08-03** e para Simples/MEI desde **2027-01-04**; **ressalva declarada:** na regra de validação do grupo, na mesma versão, observações datadas convivem com uma observação de "**implementação futura para produção**", e o documento não deixa inequívoco qual prevalece. | https://www.nfe.fazenda.gov.br/portal/exibirArquivo.aspx?conteudo=AKD%2FmuSmiIY%3D | oficial **com ambiguidade declarada** (NT 2025.002-RTC v1.51, cronograma e RV do grupo) | §9.2 | 2026-08-22 |
| F-48 | A nota técnica registra que, **mesmo quando a regra de validação não exige** o preenchimento, ele "permanece obrigatório conforme a legislação vigente", e que a informação dos novos tributos tem valor jurídico a partir de **2026-01-01**. | https://www.nfe.fazenda.gov.br/portal/exibirArquivo.aspx?conteudo=AKD%2FmuSmiIY%3D | oficial (NT 2025.002-RTC v1.51, nota final do cronograma) | §9.3 | 2026-08-22 |
| F-57 | Há **dois ambientes**: homologação, para teste durante a implementação **e sempre que o sistema sofrer alteração depois de já estar em operação**, e produção, cuja autorização dá efeito fiscal. O uso de **qualquer** dos dois depende de **credenciamento prévio na SEFAZ da UF**, e teste feito em produção por falha da aplicação pode disparar controles de uso indevido **com bloqueio de serviços**. | https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-visao-geral.pdf | oficial (MOC 7.0 Visão Geral, itens 4.3.7 e 4.3.8) | §8.1 | 2026-08-22 |
| F-58 | Em homologação a descrição do primeiro item deve trazer literal declarando ambiente de homologação sem valor fiscal, **sob pena de rejeição**. | https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-anexo-i-leiaute-e-rv.pdf | oficial (MOC 7.0 Anexo I, RV sobre a descrição do item em ambiente de homologação) | §8.2 | 2026-08-22 |
| F-59 | Os serviços do autorizador têm **endereço distinto por UF e por ambiente**, além do ambiente virtual de contingência. | https://dfe-portal.svrs.rs.gov.br/NFCE/Servicos | oficial (relação de serviços web consultada em 2026-08-22) | §4.5 | 2026-08-22 |
| F-60 | O documento de venda a consumidor final admite **só** operação presencial ou entrega a domicílio: operação não presencial pela internet é **rejeitada** e exige o outro modelo; e a entrega a domicílio é **parametrizável por UF**, que pode recusá-la. | https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-anexo-i-leiaute-e-rv.pdf | oficial (MOC 7.0 Anexo I, campo B25b e regras de validação correspondentes) | §1.3 | 2026-08-22 |
| F-61 | O documento de serviço de padrão nacional tem **adesão municipal voluntária e sem prazo**; município com sistema próprio **não** gera no ambiente dele para compartilhar depois — gera **direto** no Ambiente de Dados Nacional por interface e recupera o documento depois; para o MEI a obrigação na prestação a pessoa jurídica existe desde 2023-09-01. | https://www.gov.br/nfse/pt-br/biblioteca/copy_of_perguntas-frequentes/copy_of_faq-nfs-e | oficial (FAQ da NFS-e consultado em 2026-08-22) | §1.6 | 2026-08-22 |
| F-62 | O documento de serviço tem **ambiente de homologação/produção restrita próprio**, com acesso solicitado **pelo município aderente**, documentação técnica separada, e parte dela é **minuta** a ser homologada pelo comitê quando instalado. | https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/producao-restrita | oficial (página de produção restrita + biblioteca de documentação técnica) | §8.3, §8.4 | 2026-08-22 |
| F-63 | No documento de serviço o destaque de IBS/CBS entra **por ondas** (2026-10-01, 2026-12-01 e 2027-01-01 conforme o caso), e a ausência ou omissão dessas informações **até 2026-12-31 não acarreta rejeição** do documento, embora possa gerar sanção. | https://www.gov.br/nfse/pt-br/noticias/cgnfs-e-orienta-sobre-os-prazos-para%20destaque-de-ibs-cbs-nas-notas-fiscais-de-servico | oficial (comunicado da SE/CGNFS-e consultado em 2026-08-22) | §9.4 | 2026-08-22 |
| F-66 | **A ocorrência de problemas técnicos não exime o contribuinte de emitir a documentação fiscal das suas operações** — indisponibilidade não é hipótese de dispensa. | https://sefazlegis.sefaz.ce.gov.br/api/openFile?id=8ede79ea-72c0-44bd-aeee-9a7d0d5b9428 | oficial, **norma estadual do CE** (Decreto CE 36.417/2025, art. 1º, I) — caso base declarado; o dossiê não verificou equivalente em outra UF | §10.3 | 2026-08-22 |

## Lacunas

A lacuna aparece **no lugar** da frase confiante, no corpo, e é repetida aqui com quem responde; nenhuma
foi preenchida por analogia. `LACUNA-EMI-001` a `003` e `014` a `016`: em `fiscal-custodia-e-trilha.md`.
`LACUNA-EMI-011` a `013`: em `fiscal-emissao-contingencia.md`.

- **`LACUNA-EMI-004`** (`RN-EMI-010`) — a rejeição por ausência do grupo de IBS/CBS está **ativa** em
  produção para o regime normal, ou **diferida**? A ambiguidade é do próprio texto da regra de validação
  (F-47), e o relato secundário de suspensão aponta ato cujo texto **não** contém suspensão. **Não é**
  `LACUNA-FIS-001` (duas notícias que se contradizem): mesmo ponto cego por caminhos diferentes, e
  nenhuma resolve a outra. **Responde:** humano / contador.
- **`LACUNA-EMI-005`** (`RN-EMI-013`) — o código de responsável técnico é por desenvolvedora, por
  instalação ou por emitente, e quais UFs o exigem? É a lacuna com consequência **comercial** direta —
  **e, desde 2026-08-22, também de segurança:** se for por desenvolvedora, é o único segredo deste
  produto cujo comprometimento atinge N clientes de uma vez (`RN-EMI-041`), e se a UF exigir o hash dele
  no documento (F-40) isso alcança a capacidade de assinar no ponto de emissão (`RN-EMI-033`,
  `RN-EMI-038`). **Responde:** humano / SEFAZ.
- **`LACUNA-EMI-006`** (`RN-EMI-015`) — o prestador ou o software dele pode submeter documento de serviço
  direto ao ambiente nacional, e com qual credencial? Mantém `RN-EMI-015` **PROVISÓRIA**, com
  `LACUNA-FIS-008`. **Responde:** humano / contador.
- **`LACUNA-EMI-007`** (`RN-EMI-017`, em `fiscal-emissao-contingencia.md`) — prazo de guarda em **anos**
  e marco inicial; toda fonte aberta
  diz "prazo da legislação" sem número. Enquanto aberta: **nenhum expurgo**. **Responde:** humano /
  contador.
- **`LACUNA-EMI-008`** (F-37) — prazo máximo normativo por tipo de credencial, e se há renovação sem
  nova validação presencial. O bloco se sustenta em **carta de serviços**, não no documento normativo da
  ICP, que o dossiê não conseguiu abrir: **afirmação só-secundária, marcada na tabela**. **Responde:**
  humano / AC.
- **`LACUNA-EMI-009`** (§2) — a especificação **não foi lida integralmente** pelo dossiê (só cronograma,
  sumário e uma regra de validação), e três notas técnicas relevantes não foram abertas, nem as do
  documento de serviço. **Consequência:** estas specs dizem **como a versão entra e o que ela não pode
  fazer**, e **nenhuma regra aqui afirma qual campo existe**. **Responde:** nova pesquisa antes da Fase 1.
- **`LACUNA-EMI-010`** (`RN-EMI-018`) — a eliminação da denegação naquele documento foi mantida por nota
  posterior? Não confirmado. `RN-EMI-018` descreve os três estados de qualquer forma. **Responde:** nova
  pesquisa.

## PERGUNTAS: para humano

As duas primeiras deste arquivo (custódia sob que instrumento; janela de aviso de vencimento) foram com
as regras para `fiscal-custodia-e-trilha.md`, `PERGUNTAS` 1 e 2, onde ganharam uma terceira sobre prazo e
revogação da capacidade de assinar.

1. **UFs dos primeiros clientes, e quantos por UF.** (`LACUNA-EMI-005`, `RN-EMI-013`.) Metade da regra
   de emissão é decisão de UF, e há **teto de 5 códigos de responsável técnico por UF para a
   desenvolvedora** (F-40). Se o código for por emitente, o teto é comercial; se for por desenvolvedora,
   é segredo compartilhado entre clientes (`RN-EMI-041`). Preciso da UF de cada cliente-alvo, não só que
   o caso base é o Ceará.
2. **Documento de serviço: constrói ou declara fora?** (`RN-EMI-015`, `LACUNA-EMI-006`,
   `LACUNA-FIS-008`.) Outro autorizador, outra adesão (municipal, voluntária), outro cronograma e outra
   regra de rejeição (F-61 a F-63). É a decisão que mais muda o tamanho de `EMI` — e, na vertical
   restaurante, `LACUNA-RES-008` diz que ainda não se sabe se o caso sequer ocorre.
Mais duas, sobre guarda e sobre o que a Forja assume da obrigação acessória do emitente:
`fiscal-emissao-contingencia.md`, `PERGUNTAS` 5 e 6.

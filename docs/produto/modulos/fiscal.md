# Fiscal — a fronteira, e a spec de cada parte

O modelo atemporal (vigência, coexistência de regimes, congelamento do fato, como uma regra nova
entra) está em `fiscal-regimes-e-vigencia.md` e vale para tudo o que este arquivo descreve. Aqui
estão a **decisão de fronteira** e o contrato de cada módulo.

**Regra de honestidade deste arquivo.** Fato sobre o regime tributário brasileiro existe **só** na
tabela `## Fontes`, no fim: uma linha por fato, `F-nn`, com a **URL inline** e o tipo da fonte. O corpo
cita `F-nn` e **não acrescenta fato novo**; onde não houve fonte existe `[[LACUNA-FIS-<n>]]` no lugar
da frase. Numeração contínua: F-01 a F-13 em `fiscal-regimes-e-vigencia.md`, F-14 em diante aqui.
Apuração: `docs/arquitetura/fiscal/2026-08-22-dossie-iva-ibs-cbs.md` e `…-iva-ibs-cbs-2.md` — datados.

## 1. A decisão de fronteira: três módulos, não um

`FIS` deixa de ser "o fiscal" e passa a ser **um** dos três. Códigos em `glossario.md` §4.3:

| Código | Módulo | O que ele faz |
|---|---|---|
| `FIS` | **Tributação** | decidir o que incide, sobre que base, em que regime, sob que versão de regra — e congelar isso no fato |
| `EMI` | **Emissão de documento fiscal** | montar o documento a partir do fato já tributado, assinar, transmitir, tratar o retorno, guardar, cancelar |
| `APU` | **Apuração e obrigação acessória** | consolidar período, apurar crédito e débito, escriturar, declarar, sustentar conformidade |

**Decisão do humano, entrada e não pendência:** a Forja faz **tributação + emissão + transmissão**;
`APU` **não entra no MVP** (código reservado, **sem data**); a emissão é **própria** — nós montamos,
assinamos e transmitimos — em duas capacidades de assinatura (§3).

### 1.1 Por que três, e não um

Critério único: **o que muda por motivo diferente, em cadência diferente, e pode ser substituído sem
os outros, é outro módulo.**

| | `FIS` tributação | `EMI` emissão | `APU` apuração |
|---|---|---|---|
| **Muda quando** | a norma material muda: base, alíquota, regime específico, lista por anexo (F-14, F-15, F-21 a F-27) | a especificação técnica do documento ou do autorizador muda (`[[LACUNA-FIS-009]]`), ou o cronograma de obrigatoriedade muda (F-16 a F-18) | o período, a declaração ou o programa de conformidade mudam (F-30, F-31) |
| **Cadência** | por ano-calendário e por ato infralegal (F-11) | por nota técnica e por autorizador, por documento e por município | mensal e anual |
| **Quem valida** | contador, sobre a leitura da norma | homologação técnica contra o ambiente do autorizador | contador do cliente |
| **Momento** | no fato, sincronamente, dentro da venda | depois do fato, assíncrono, tolerante a falha | depois do período, longe do caixa |
| **Falhar significa** | não sei quanto se deve | o documento ainda não foi autorizado | a declaração não foi entregue |
| **Substituível por terceiro** | **não** — o total é nosso | **sim** — contador, provedor, ou `[[LACUNA-FIS-010]]` | **sim, e é o padrão do MVP** |

A linha decisiva é a última. `EMI` e `APU` **podem sair das nossas mãos sem que o produto pare de
funcionar**; `FIS` não pode, porque o valor que aparece no caixa e a segregação por regime (F-24) são
compostos no instante em que o item entra na venda — antes de existir documento, e mesmo quando
documento nenhum vai existir. Capacidade substituível e capacidade insubstituível não são o mesmo
módulo (`fronteira-do-nucleo.md` §4).

Três consequências práticas que sustentam a partição:

1. **Tributar sem emitir é caso real.** Consumo em aberto com total à vista, orçamento, pedido por
   canal externo, cliente cujo contador emite por fora: em todos o tributo precisa estar composto e
   congelado sem documento nenhum — um módulo só obrigaria a ligar emissão para ver total.
2. **Emitir sem tributar não existe** (F-16, F-19: o documento é exigido **com** os campos de
   IBS/CBS). Logo `EMI` **exige** `FIS` — dependência declarada, não fusão.
3. **`RN-FIS-004` fica estrutural.** `EMI` consome um artefato congelado que não produziu e não pode
   recompor (`RN-EMI-002`); num módulo só, nada impede recalcular na hora de imprimir (`PN-08`).

### 1.2 O que foi recusado

- **Um módulo fiscal único.** Recusado pelo teste acima. Custo assumido: três fronteiras para errar
  em vez de uma, e três entradas de catálogo para manter coerentes.
- **Tributação + emissão juntas, com apuração dentro.** Recusado: apuração tem outro usuário (o
  contador — F-30 exige contador responsável indicado no sistema), outro ciclo e nenhuma presença no
  caixa. Enfiá-la em `FIS` faz o módulo do caminho crítico da venda carregar o peso de um módulo que
  nunca é aberto durante o serviço.
- **Renomear ou reaproveitar código.** Código é imutável (`glossario.md` §4.1) e nenhuma `RN-FIS-nnn`
  havia sido emitida antes desta tarefa: `FIS` fica como **tributação**, `EMI` e `APU` são novos,
  nada foi aposentado.

### 1.3 O que o passo 9 e a Fase 1 herdam

- `EMI` e `APU` são **camada 2** (exigem `FIS`): o corte de MVP pode levar `FIS` + `EMI` e deixar
  `APU` fora sem quebrar plugabilidade — o **custo** disso está em §4.
- O modelo da Fase 1 precisa do fato tributado congelado (`RN-FIS-004`) como estrutura **anterior** a
  qualquer estrutura de documento: documento referencia fato tributado, nunca o contrário.
- `RN` provisória **não é agendada para construção**: `RN-FIS-016` é agendada para **resolver
  `LACUNA-FIS-003`**.

## 2. `FIS` — Tributação

**Propósito.** Dado um fato comercial, responder **o que incide, sobre que base, em que regime, sob
que versão de regra** — e congelar a resposta junto com o fato.

**Entidades conceituais** (conceito, não tabela; D-04 ABERTA): fato tributado (fato + resultado
congelado + versões de regra usadas) · incidência por tributo (base, redutor, resultado) ·
classificação tributária do item · regime do estabelecimento no tempo · exclusão de base condicionada ·
pendência tributária.
**Casos de uso.** Compor o tributo de um item ao entrar na venda · recompor ao mudar quantidade,
desconto ou acréscimo antes da conclusão · congelar na conclusão · segregar por regime · responder "que
regra vale para este estabelecimento neste instante" · ensaiar regra futura (`RN-FIS-010`) · declarar
pendência quando não sabe.
**Convenção das regras.** Escopo `FIS`, numeração `RN-FIS-013` a `RN-FIS-020` (`001` a `012` estão em
`fiscal-regimes-e-vigencia.md`); número não se renumera. Por causa do teto de 400 linhas, **o título de
cada regra é o enunciado** — o bloco traz motivo, critério de aceite, caminho infeliz, e uma linha de
`**Enunciado**` só quando o título não basta. Vale também para `RN-EMI-nnn` (§3).

### RN-FIS-013 — Tributação ocorre no instante do fato, não no da impressão; emissão e reimpressão apenas leem

**Motivo** `RN-FIS-004`; e o fato pode ser concluído offline com o documento saindo horas depois
(`PN-01`).
**Aceite** venda concluída com a rede caída e documento emitido três horas depois, com uma versão de
regra nova publicada no intervalo: o documento sai com o tributo do **instante da venda**.
**Infeliz** o instante do fato não é conhecido com fuso (`RN-FIS-008`) → fato não tributado, pendência
nomeada. Nunca "agora" como substituto.

### RN-FIS-014 — O tributo é decomposto por tributo, base e regime — nunca um total agregado

**Motivo** F-01 e F-02: dois sistemas convivem e a base de um exclui o montante do outro; F-14 e F-15
definem o que entra e o que não entra na base. Total agregado perde a informação que o documento
(F-16) e a apuração exigem, e não é reconstruível depois.
**Aceite** a mesma venda apresenta cada tributo separadamente, com sua base, seu redutor e sua versão
de regra, e a soma das partes é o total. Incidência nova (o Imposto Seletivo, §5) entra como outra
parte, sem alterar as existentes.
**Infeliz** um dos tributos não pôde ser composto → os demais são compostos e **aquele** fica
pendente, nomeado. Nunca um total aproximado para fechar a conta.

### RN-FIS-015 — Uma venda pode conter mais de um regime, e a segregação é obrigatória

**Motivo** F-21, F-23 e F-24: no mesmo pedido, o item preparado no local é do regime específico e a
bebida alcoólica e a bebida industrializada são do regime geral; **sem segregação o total inteiro cai
no regime geral** (F-24), perdendo a redução de F-22.
**Aceite** uma venda com um item preparado no local, uma bebida alcoólica e uma bebida não alcoólica
industrializada produz valores segregados por regime, e o documento carrega a segregação. Venda
inteiramente de um regime não gera segregação vazia.
**Infeliz** um item não tem classificação suficiente para decidir o regime → `RN-FIS-018`: pendência
nomeada, e o fallback é o da própria norma (regime geral para o valor não segregado, F-24), sempre
**registrado como fallback**, nunca silencioso.

### RN-FIS-016 (PROVISÓRIA — depende de `[[LACUNA-FIS-003]]`) — Exclusão de base condicionada exige condição provada e segregação

**Motivo** F-25: gorjeta e valores de intermediação por plataforma só saem da base sob condição e com
segregação no documento. A condição da gorjeta tem dois requisitos (repasse integral ao empregado e
limite de 15%).
**Aceite** *(a parte já testável)* exclusão aplicada só com condição registrada e valor segregado;
sem um dos dois, o valor compõe a base e o fato guarda o motivo.
**Infeliz** a condição não é verificável (não se sabe se houve repasse integral, ou o limite foi
excedido) → a exclusão **não é aplicada** e o fato registra por quê.
**Provisória porque** o tratamento do que excede o limite, e o enquadramento de encargo compulsório
(`ECG`, taxa de serviço) como "gorjeta repassada integralmente ao empregado" para este efeito, não
têm fonte. **Não agendar para construção** — agendar para resolver `LACUNA-FIS-003`.

### RN-FIS-017 — O regime pode depender do destinatário, não só do item

**Motivo** a natureza da operação é declarada, nunca inferida. F-23: a mesma alimentação, fornecida a **pessoa jurídica sob contrato**, fica fora do
regime específico. Um PDV que só classifica item erra a venda para PJ.
**Aceite** o mesmo item, vendido a consumidor final e sob operação declarada como fornecimento a PJ
contratante, produz resultados diferentes — com a mesma classificação de item e sem ramificação por
cliente no código.
**Infeliz** a natureza da operação não foi declarada → o produto **não adivinha**: aplica a natureza
padrão declarada do estabelecimento, registra qual aplicou, e a divergência fica auditável.

### RN-FIS-018 — Dado tributário do item é cadastro, e falta de dado nunca para o caixa

**Motivo** `PN-01` e `fronteira-do-nucleo.md` §3.4: nenhum módulo pode ser condição para vender.
Classificação depende de listas por NCM/SH alteráveis por lei (F-27) — falta de dado é esperada, não
excepcional.
**Aceite** item sem classificação é apontado ao cliente no cadastro e na ativação. Se ainda assim
chegar ao caixa, a venda conclui, o fato fica com pendência nomeada, nenhum valor tributário é
inventado e nenhum modal bloqueia o operador.
**Infeliz** o cliente opera dias com pendências acumuladas → elas são contáveis e visíveis a quem
pode resolver; nada é fechado por decurso de prazo (`RN-FIS-011`).

### RN-FIS-019 — Simples Nacional e regime regular convivem no mesmo produto, desde o dia 0

**Motivo** decisão do humano, e F-07, F-08 e F-18: o Simples tem alíquota de 2026 inaplicável,
obrigatoriedade de campos só a partir de 2027-01-01, e pode optar pelo regime regular mantendo o
Simples para os demais tributos.
**Aceite** dois estabelecimentos do mesmo cliente, um optante e um do regime regular, na mesma data
de 2026: exigências e resultados diferentes, cada fato citando o regime congelado, sem `if` por
cliente e sem módulo duplicado.
**Infeliz** a data de início da opção não é conhecida → `RN-FIS-011`. Prazo e forma da opção são
`[[LACUNA-FIS-004]]`.

### RN-FIS-020 — A Forja apura o tributo devido pelo emitente; não calcula nem promete crédito de terceiro

**Motivo** F-26 e F-28: o crédito do adquirente é vedado em um caso, inexistente em outro e
equivalente ao montante devido em um terceiro. É apuração de **outra pessoa jurídica**, com dado que
não temos.
**Aceite** nenhuma superfície do produto apresenta "crédito que seu cliente vai aproveitar"; o que
existe é o tributo devido pelo emitente e o que o documento carrega.
**Infeliz** o cliente pede a conta de crédito do adquirente dele → recusa explicada (é `APU` do
adquirente), nunca um número aproximado.

### 2.1 Contrato de `FIS`

**Expõe** fato tributado congelado (por tributo, base, regime, redutor, versão de regra) · segregação
por regime de uma venda · "esta venda tem obrigação documental?" · consulta "que regra vale para este
estabelecimento neste instante" · evento "versão de regra publicada" · evento "pendência tributária
aberta/resolvida".
**Exige do núcleo** venda concluída como fato gerador, com instante e fuso do estabelecimento ·
identidade jurídica do estabelecimento · imutabilidade do fato e correção como fato novo · autoria e
trilha · isolamento por cliente · continuidade offline. **Do cliente** regime por estabelecimento com
vigência · identidade fiscal · dado tributário do catálogo · natureza padrão da operação
(`RN-FIS-017`). **Ativação** isolado, só núcleo.
**Desligado** a venda acontece, conclui, recebe pagamento e é conferida; nenhum tributo é composto e o
comprovante é não fiscal; `EMI` e `APU` **não são ativáveis** (exigem `FIS`). Não quebra tecnicamente —
mas cliente **com** obrigação e `FIS` desligado opera irregular, e isso é decisão dele e do contador
dele, não degradação nossa.
**Sensível** dado tributário do catálogo · regime e identidade fiscal do estabelecimento · nenhum dado
de pessoa é necessário para tributar, exceto quando a natureza da operação depende do destinatário
(`RN-FIS-017`) — e aí é o mínimo que a norma exige.

## 3. `EMI` — Emissão de documento fiscal

**Fronteira, não spec.** O detalhe de `EMI` vive em arquivos próprios, todos numerando de
**`RN-EMI-004` em diante** e nenhum podendo contradizer esta seção: `fiscal-emissao-propria.md`
(habilitar e manter: layout versionado, homologação, provisionamento, que documento se aplica),
`fiscal-emissao-contingencia.md` (o documento depois da venda: estados, guarda, retorno, numeração e
série, contingência) e `fiscal-custodia-e-trilha.md` (custódia, poder de assinar, trilha do ato).
**Propósito.** Montar o documento a partir de um fato **já tributado**, assinar, transmitir, tratar o
retorno do autorizador, guardar e disponibilizar — sem nunca ser condição para a venda.
**Entidades conceituais.** Documento fiscal (referência e estado) · tentativa de transmissão · retorno
do autorizador · documento de correção ou cancelamento · credencial de assinatura, **referenciada** e
nunca descrita (`CLAUDE.md` §7.8).

### RN-EMI-001 — Falha de emissão nunca impede a venda de existir

**Motivo** qualquer falha de montagem, assinatura, transmissão ou autorização produz pendência
nomeada, e a venda conclui — `PN-01` e `fronteira-do-nucleo.md` §6. E é o que torna esta spec correta **nos dois
mundos** de `[[LACUNA-FIS-001]]`: se o autorizador rejeita o documento incompleto (F-19), a venda
existe e a obrigação fica pendente; se a ausência de campo apenas não gera sanção (F-20), a venda
existe e a obrigação fica pendente. **O comportamento do produto é o mesmo** — muda só a gravidade da
pendência, que é informação, não fluxo.
**Aceite** rede cortada no meio da venda: a venda conclui, o documento fica pendente, sobe sozinho
quando a rede volta e aparece **uma única vez** no autorizador. Rejeição por campo tributário ausente
produz pendência nomeada e visível, e nenhuma venda é retida.
**Infeliz** a pendência não pode ser resolvida (regra ausente, `RN-FIS-011`; credencial indisponível)
→ permanece aberta e contável, sem prazo de silêncio, sem impedir a próxima venda.

### RN-EMI-002 — A emissão consome o tributo congelado e nunca recalcula

**Motivo** `EMI` não compõe, não corrige e não completa valor tributário — `RN-FIS-004`, `RN-FIS-005`
e `PN-08` — é a razão estrutural da partição (§1.1, item 3).
**Aceite** retransmitir um documento dois dias depois, com regra nova publicada no intervalo, produz
exatamente os mesmos valores e a mesma classificação da primeira tentativa.
**Infeliz** o fato não está tributado (pendência aberta) → o documento **não é montado**, a pendência
aponta a causa tributária, e `EMI` não supre a falta com valor próprio.

### RN-EMI-003 — Duas capacidades de assinatura, e o documento montado é o mesmo

**Enunciado** credencial sob custódia da Forja (**padrão**) ou credencial fora da Forja (nós montamos,
o cliente ou terceiro autorizado por ele assina); muda o passo de assinatura e o estado intermediário.
**Motivo** decisão do humano; e `fronteira-do-nucleo.md` §6 já trata "quem emite pelo cliente" como
decisão de cliente.
**Aceite** o mesmo fato tributado produz, nos dois modos, o mesmo documento montado. No modo externo
a Forja **nunca** detém a credencial, o estado é "aguardando assinatura externa", e o caixa não
espera por ele.
**Infeliz** a assinatura externa não volta → pendência aberta, sem prazo de silêncio; nenhuma venda é
retida (`RN-EMI-001`).
**Fora daqui** custódia, guarda, rotação e revogação de credencial: `fiscal-custodia-e-trilha.md`.
Nada neste repositório descreve caminho, arquivo, formato ou senha de credencial.
**Alternativa documentada, não adotada** provedor homologado que assina em nome do emitente —
`[[LACUNA-FIS-010]]`; o custo comparado é do passo 9.

### 3.1 Contrato de `EMI`

**Expõe** estado da obrigação por venda (exigida, montada, aguardando assinatura, transmitida,
autorizada, rejeitada, cancelada, pendente) · documento para reimpressão e envio · evento de
autorização, rejeição e cancelamento.
**Exige** de `FIS`: fato tributado congelado e segregado. Do núcleo: venda concluída, identidade
jurídica, correção como fato novo, trilha, continuidade offline. Do cliente: credencial (modo padrão) e
preferências de emissão (`fronteira` §6). **Ativação** exige `FIS` ativo — F-16 e F-19: não existe
documento sem os campos tributários; ativar `EMI` sem `FIS` é **recusado na ativação**.
**Desligado** o fato continua tributado e congelado por `FIS`; a obrigação fica **externa** (contador do
cliente, provedor dele, ou `[[LACUNA-FIS-010]]`). É **configuração suportada**, não degradação: o
comprovante do PDV é não fiscal e o cliente sabe disso.
**Sensível** credencial de assinatura e transmissão do cliente (nunca no repositório) · documento de
pessoa do destinatário quando a obrigação exige · o próprio documento emitido.

## 4. `APU` — Apuração e obrigação acessória (fora do MVP, por decisão do humano)

**Fronteira.** `APU` consolida período, apura crédito e débito, escritura, declara e sustenta
conformidade. **Sem data.** Nenhuma `RN-APU-nnn` é emitida aqui: regra sem critério de aceite não
recebe número, e especificar apuração agora é trabalho jogado fora.
**Por que é outro módulo, e não parte de `FIS`:** outro usuário (o contador — F-30), outro ciclo
(período fechado, não o instante da venda), outra prova de correção (declaração aceita, não valor no
comprovante) e nenhuma presença no caixa.

**O custo declarado de deixar `APU` fora — real, não retórico.** Em 2026 a apuração é informativa e o
recolhimento é **dispensado para quem cumpre as obrigações acessórias** (F-10); o Programa Nacional de
Conformidade condiciona o enquadramento a cumprir a acessória, retificar até 2026-12-31 e manter
contador responsável indicado (F-30); e auto de infração de acessória em 2026 é extinto se a omissão
for suprida em 60 dias (F-31). Quem cumpre a acessória pelo ferramental do contador está coberto;
**quem não cumpre em lugar nenhum perde a dispensa.** Deixar `APU` fora do MVP é aceitável **porque a
acessória continua sendo cumprida pelo contador do cliente** — condição a confirmar por cliente, não
suposição do produto (`PERGUNTAS` 3).

**Ativação** exige `FIS`; lê o que `EMI` expõe quando ativo, pelo contrato, nunca por dentro.
**Desligado** (padrão do MVP) apuração, escrituração e declaração ficam com o contador do cliente, no
ferramental dele; `FIS` continua compondo e congelando por fato e `EMI` continua emitindo; o produto
oferece o fato tributado exportável (`PN-10`) e nada no caixa muda. **Sensível** o movimento do período
e o que ele revela do negócio; a identificação do contador responsável (F-30) é dado de pessoa.

## 5. Fora da fronteira dos três, e vigiado

Split payment (F-32), cashback (F-33), Imposto Seletivo (F-34) e "regime do ramo" **não são módulos
novos** e nenhum código foi reservado para eles. Onde cada um cairia, e por quê:
`fiscal-regimes-e-vigencia.md` §5. Os fatos e as lacunas ficam aqui, nas duas seções abaixo.

## Fontes

Esta tabela é, ao mesmo tempo, a lista de **fatos verificados** e a seção de fontes: fato do regime
brasileiro que não esteja aqui **não existe** neste arquivo. Apuração: dossiê parte 1 §1 a §4, parte 2
§5 a §8.

| ID | Afirmação | URL | Tipo | Acesso |
|---|---|---|---|---|
| F-14 | A base de cálculo do IBS/CBS é o valor da operação: o valor integral cobrado pelo fornecedor a qualquer título, incluindo juros, multas, encargos, frete cobrado pelo fornecedor, seguros, taxas e **descontos concedidos sob condição**. | https://www.cgibs.gov.br/upload/arquivos/202604/30084927-res-cgibs-n-6-30-abr-2026-regulamenta-o-ibs.pdf | oficial (Res. CGIBS 6/2026, art. 13 e § 1º) | 2026-08-22 |
| F-15 | Não integram a base: o próprio IBS e a CBS, o IPI, os **descontos incondicionais** (que constam do documento e não dependem de evento posterior), reembolsos por conta e ordem de terceiros, e a CIP/COSIP. | https://www.cgibs.gov.br/upload/arquivos/202604/30084927-res-cgibs-n-6-30-abr-2026-regulamenta-o-ibs.pdf | oficial (Res. CGIBS 6/2026, art. 13, §§ 2º e 3º) | 2026-08-22 |
| F-16 | Desde **2026-08-03** é obrigatório emitir NF-e (modelo 55) e NFC-e (modelo 65) com os campos de IBS e CBS; a mesma data vale para CT-e, CT-e OS, MDF-e, GTV-e, NF3e, DC-e, NFS-e Via e BP-e não enquadrado nas exceções. | https://www.cgibs.gov.br/upload/arquivos/202607/31091735-20260730-16h30-ato-conjunto-rfb-cgibs-na-c2-ba-4-260731-090909.pdf | oficial (Ato Conjunto RFB/CGIBS 4, de 30/07/2026, art. 1º) | 2026-08-22 |
| F-17 | Datas seguintes do mesmo ato: NFCom, **NFS-e geral** e DIR em 2026-10-01; DeRE eventos periódicos mensais em 2026-11-15; NFGas, NFAg, NF-e ABI, BP-e semiurbano/metropolitano/aéreo e NFS-e de plataformas em 2026-12-01; Duimp, NF-e na importação e NF-e monofásica em 2027-01-01. | https://www.cgibs.gov.br/upload/arquivos/202607/31091735-20260730-16h30-ato-conjunto-rfb-cgibs-na-c2-ba-4-260731-090909.pdf | oficial (Ato Conjunto 4/2026, art. 1º e §§ 2º a 5º) | 2026-08-22 |
| F-18 | Para **optantes pelo Simples Nacional**, a obrigatoriedade de emitir os documentos com IBS/CBS começa só em **2027-01-01**. | https://www.cgibs.gov.br/upload/arquivos/202607/31091735-20260730-16h30-ato-conjunto-rfb-cgibs-na-c2-ba-4-260731-090909.pdf | oficial (Ato Conjunto 4/2026, art. 1º, § 1º) | 2026-08-22 |
| F-19 | O documento fiscal eletrônico **não é autorizado** sem os campos de IBS e CBS preenchidos: o autorizador rejeita automaticamente o documento incompleto. | https://www.cgibs.gov.br/novo-marco-da-reforma-tributaria-inicia-em-03-de-agosto-com-preenchimento-obrigatorio-dos-campos-relativos-ao-ibs-e-a-cbs | **notícia institucional oficial, fonte única** (CGIBS, 2026-06-15) — não é o texto do ato, que fixa a obrigatoriedade e não descreve rejeição | 2026-08-22 |
| F-20 | O Ato Conjunto RFB/CGIBS nº 1, de 23/12/2025, flexibilizou as validações: em 2026 a ausência ou o preenchimento incompleto dos campos de IBS/CBS **não gera sanção**. | https://www.cgibs.gov.br/comite-gestor-e-receita-federal-garantem-prazo-de-adaptacao-e-transicao-segura-para-contribuintes-do-ibs-e-da-cbs-em-2026 | **notícia institucional oficial, fonte única** (CGIBS, 2025-12-23) — não é o texto do ato | 2026-08-22 |
| F-21 | Bares e restaurantes (inclusive lanchonetes), pastelarias, padarias, casas de chá, de sucos, de doces e salgados, cafeterias, sorveterias e similares ficam sujeitos a **regime específico** de IBS/CBS para o fornecimento de alimentação e de bebidas não alcoólicas **preparadas e manipuladas no próprio local**. | https://www.cgibs.gov.br/upload/arquivos/202604/30084927-res-cgibs-n-6-30-abr-2026-regulamenta-o-ibs.pdf | oficial (Res. CGIBS 6/2026, art. 396; Decreto 12.955/2026, art. 396) | 2026-08-22 |
| F-22 | As alíquotas de IBS e de CBS nesse regime específico ficam **reduzidas em 40%**. | https://www.in.gov.br/en/web/dou/-/decreto-n-12.955-de-29-de-abril-de-2026-702415229 | oficial (Decreto 12.955/2026, art. 400; espelhado na Res. CGIBS 6/2026, art. 400) | 2026-08-22 |
| F-23 | **Fora** do regime específico, portanto no regime geral: bebidas alcoólicas, ainda que preparadas no estabelecimento; produtos e bebidas não alcoólicas adquiridos de terceiros e não preparados no local; bebida não alcoólica **industrializada**, mesmo manipulada no local; e alimentação para **pessoa jurídica sob contrato** (NBS 1.0301.31/32/39 ou CNAE 5620-1/01). | https://www.cgibs.gov.br/upload/arquivos/202604/30084927-res-cgibs-n-6-30-abr-2026-regulamenta-o-ibs.pdf | oficial (Res. CGIBS 6/2026, art. 396, parágrafo único, e art. 397) | 2026-08-22 |
| F-24 | O documento fiscal **tem que segregar** os valores do regime específico dos do regime geral; **na falta de segregação, o valor total da operação vai para o regime geral**. | https://www.cgibs.gov.br/upload/arquivos/202604/30084927-res-cgibs-n-6-30-abr-2026-regulamenta-o-ibs.pdf | oficial (Res. CGIBS 6/2026, art. 398 e parágrafo único) | 2026-08-22 |
| F-25 | Excluídos da base: (a) a **gorjeta**, se repassada integralmente ao empregado e se não exceder 15% do valor total do fornecimento de alimentação e bebidas; (b) os valores **não repassados** ao estabelecimento pelo serviço de entrega e intermediação de pedidos por plataforma digital. Os dois **têm que estar segregados no documento fiscal**; sem segregação, a base é o valor total. | https://www.cgibs.gov.br/upload/arquivos/202604/30084927-res-cgibs-n-6-30-abr-2026-regulamenta-o-ibs.pdf | oficial (Res. CGIBS 6/2026, art. 399, §§ 1º a 4º) | 2026-08-22 |
| F-26 | É **vedada a apropriação de crédito** de IBS e CBS pelo adquirente de alimentação e bebidas sujeitas a esse regime específico. | https://www.cgibs.gov.br/upload/arquivos/202604/30084927-res-cgibs-n-6-30-abr-2026-regulamenta-o-ibs.pdf | oficial (Res. CGIBS 6/2026, art. 401) | 2026-08-22 |
| F-27 | A Cesta Básica Nacional de Alimentos tem alíquota **zero** (Anexo I da LC 214/2025, por NCM/SH), e há redução de **60%** para 13 grupos, entre eles alimentos destinados ao consumo humano e produtos de higiene pessoal e limpeza (anexos VII e VIII). | https://www.in.gov.br/en/web/dou/-/decreto-n-12.955-de-29-de-abril-de-2026-702415229 | oficial (Decreto 12.955/2026, arts. 199, 203, 210 e 211; espelhados na Res. CGIBS 6/2026) | 2026-08-22 |
| F-28 | Operações imunes, isentas, com alíquota zero, diferimento ou suspensão **não** geram crédito para o adquirente; o optante do Simples que não optou pelo regime regular **não** apropria crédito de IBS, e o adquirente do regime regular **pode** apropriar o equivalente ao montante devido pelo Simples naquela aquisição. | https://www.cgibs.gov.br/upload/arquivos/202604/30084927-res-cgibs-n-6-30-abr-2026-regulamenta-o-ibs.pdf | oficial (Res. CGIBS 6/2026, arts. 49 e 50) | 2026-08-22 |
| F-29 | O varejo em geral fica no **regime geral**: não há regime específico de varejo nos regulamentos — os regimes específicos são setoriais. | https://www.cgibs.gov.br/upload/arquivos/202604/30084927-res-cgibs-n-6-30-abr-2026-regulamenta-o-ibs.pdf | oficial, **afirmação por ausência** (sumário do livro de regimes específicos; nenhum capítulo de comércio varejista) | 2026-08-22 |
| F-30 | O Ato Conjunto RFB/CGIBS nº 5, de 12/08/2026, regulamenta para 2026 o Programa Nacional de Conformidade Tributária: quem cumpre a obrigação acessória está enquadrado; quem não cumpre permanece enquadrado se demonstrar aumento contínuo e progressivo de emissão correta, atender intimações, retificar até 2026-12-31 e **manter contador responsável indicado**. | https://www.cgibs.gov.br/upload/arquivos/202608/13065932-ato-conjunto-rfb-cgibs-n-c2-ba-5-2026-regulamenta-o-programa-nacional-de-conformidade-tributaria-docx-assinado.pdf | oficial (texto do ato, arts. 1º a 3º) | 2026-08-22 |
| F-31 | Lavrado auto de infração por descumprimento de obrigação acessória de IBS/CBS em 2026, o sujeito passivo é intimado a suprir a omissão em 60 dias, e o atendimento **extingue** a penalidade. | https://www.cgibs.gov.br/upload/arquivos/202604/30084927-res-cgibs-n-6-30-abr-2026-regulamenta-o-ibs.pdf | oficial (Res. CGIBS 6/2026, art. 465, §§ 3º e 4º) | 2026-08-22 |
| F-32 | O **split payment** é uma das formas de recolhimento previstas: o prestador de serviço de pagamento segrega e recolhe IBS/CBS na liquidação financeira. A implantação é gradual, em pelo menos duas etapas, por ato conjunto; a primeira pode ser facultativa e restrita a operações em que o adquirente é contribuinte do regime regular; em etapa posterior, nas operações em que o adquirente **não** é contribuinte do regime regular — o consumidor final de um PDV — ele entra de forma simultânea para todos os arranjos de pagamento. | https://www.cgibs.gov.br/upload/arquivos/202604/30084927-res-cgibs-n-6-30-abr-2026-regulamenta-o-ibs.pdf | oficial (Res. CGIBS 6/2026, arts. 27 a 35, especialmente art. 33) | 2026-08-22 |
| F-33 | A devolução personalizada (**cashback**) é apurada a partir de dados extraídos de documentos fiscais **vinculados ao CPF** dos membros da unidade familiar; os mecanismos antifraude podem ser aplicados **por meio de validações na emissão do documento fiscal**; e o sigilo inclui não divulgar a um membro da família as aquisições de outro. | https://www.cgibs.gov.br/upload/arquivos/202604/30084927-res-cgibs-n-6-30-abr-2026-regulamenta-o-ibs.pdf | oficial (Res. CGIBS 6/2026, arts. 489 a 493) | 2026-08-22 |
| F-34 | O Imposto Seletivo começa em 2027. | https://bd.camara.leg.br/bitstreams/b93ed4e6-776f-43c7-a853-3773f64dd898/download | oficial (nota técnica da Consultoria Legislativa da Câmara, fev/2024; o texto constitucional não foi lido pelo dossiê) | 2026-08-22 |

## Lacunas

- **`[[LACUNA-FIS-001: o documento fiscal sem os campos de IBS/CBS é rejeitado pelo autorizador (não
  vende), ou apenas não gera sanção em 2026? qual ato revogou ou restringiu a flexibilização, e desde
  quando? — sem fonte em 2026-08-22]]`** F-20 diz que não gera sanção; F-19 diz que desde 2026-08-03
  o autorizador rejeita. O dossiê não achou o ato que conciliou os dois, e **as duas afirmações são de
  notícia**, não de texto normativo lido. Para um PDV a diferença é entre "campo opcional" e "não
  vende". **Responde:** humano / contador. **Tratamento aqui:** `RN-EMI-001` é correta nos dois mundos
  e nenhuma regra deste arquivo escolhe uma das leituras.
- **`[[LACUNA-FIS-002: o valor cobrado do consumidor no PDV já contém IBS/CBS, com o tributo extraído
  dele, ou o tributo é acrescido ao preço praticado no fechamento da venda? — sem fonte em
  2026-08-22]]`** F-14 põe a base como "o valor integral cobrado pelo fornecedor" e F-15 exclui dela o
  próprio IBS e a própria CBS; nenhum dossiê traz regra sobre a composição do preço ao consumidor.
  **Responde:** humano / contador. **Consequência:** decide se publicar uma alíquota muda o total que o
  cliente-final paga ou só o destaque no documento.
- **`[[LACUNA-FIS-003: gorjeta acima de 15% — só o excedente entra na base, ou a gorjeta inteira? e
  encargo compulsório (taxa de serviço) conta como "gorjeta repassada integralmente ao empregado"
  para esse efeito? — sem fonte em 2026-08-22]]`** F-25 dá as duas condições e o limite, e não diz o
  que acontece ao ultrapassá-lo. **Responde:** humano / contador. Mantém `RN-FIS-016` **PROVISÓRIA**,
  fora da fila de construção.
- **`[[LACUNA-FIS-004: qual o prazo e a forma da opção do optante do Simples pelo regime regular de
  IBS/CBS? — sem fonte em 2026-08-22]]`** F-08 diz que a opção existe e remete à LC 123/2006. O único
  prazo encontrado é "setembro de 2026" [fonte secundária:
  https://www12.senado.leg.br/noticias/materias/2026/01/02/ano-de-2026-marca-implementacao-da-reforma-tributaria]
  — notícia institucional, sem respaldo normativo verificado. **Responde:** humano / contador.
- **`[[LACUNA-FIS-005: a primeira etapa do split payment já tem data e escopo fixados (Ato Conjunto
  RFB/CGIBS 2/2026, não lido pelo dossiê)? e a etapa que alcança o consumidor final tem data? — sem
  fonte em 2026-08-22]]`** F-32 traz mecanismo e gradualidade; datas, nenhuma fonte aberta.
  **Responde:** humano (é também decisão de escopo: entrar agora ou vigiar).
- **`[[LACUNA-FIS-006: que validações na emissão do documento o antifraude do cashback exige, e o CPF
  do cliente-final passa a ser fluxo obrigatório no caixa? — sem fonte em 2026-08-22]]`** F-33 diz que
  as validações "podem ser aplicadas" na emissão, sem especificá-las. **Responde:** humano / contador.
- **`[[LACUNA-FIS-007: as alíquotas e a lista de produtos do Imposto Seletivo estão publicadas, e ele
  incide sobre item vendido em balcão a partir de 2027? — sem fonte em 2026-08-22]]`** o dossiê
  declara que não localizou norma publicada que as fixe. **Responde:** humano / contador.
- **`[[LACUNA-FIS-008: qual documento de serviço a Forja emite — "NFS-e Via" (F-16), "NFS-e geral"
  (F-17) ou o sistema municipal de ISS do município do estabelecimento — e sob que autoridade? — sem
  fonte em 2026-08-22]]`** os dossiês trazem as datas do cronograma e não descrevem os documentos.
  **Caso base: Ceará**, município a confirmar; nada presume que o CE valha para as outras UFs.
  **Responde:** humano / contador. Bloqueia parte do passo 3b.
- **`[[LACUNA-FIS-009: layout, regra de validação, nota técnica, numeração, prazo e forma de
  cancelamento e inutilização, e comportamento de contingência de cada documento — sem fonte em
  2026-08-22]]`** o dossiê declara que **não pesquisou** layout, regra de validação nem nota técnica
  de documento fiscal. **Responde:** passo 3b; o que ele não achar vira pergunta ao humano.
- **`[[LACUNA-FIS-010: o provedor autorizado que assina em nome do emitente (PAA) existe, sob que
  norma, e com que efeito sobre a responsabilidade do emitente? — sem fonte em 2026-08-22]]`** o brief
  da tarefa cita um ajuste SINIEF; **nenhum dossiê verificou essa norma**, então o número não é
  afirmado aqui. Fica como **alternativa documentada, não adotada** (`RN-EMI-003`); custo comparado é
  do passo 9. **Responde:** humano.

Definidas em `fiscal-regimes-e-vigencia.md` e citadas por este arquivo: `LACUNA-FIS-011` (lei própria
de IBS do Ceará e do município) e `LACUNA-FIS-012` (texto integral da LC 214/2025 não lido).

## PERGUNTAS: para humano

1. **`LACUNA-FIS-001` é a mais urgente das dez.** Existe contador que possa dizer, com o ato na mão, se
   hoje um documento sem campo de IBS/CBS é **rejeitado** ou apenas **não sancionado**? A spec funciona
   nos dois mundos, mas a gravidade mostrada ao operador e a urgência de completar cadastro tributário
   dependem da resposta.
2. **Quem assume o risco de segregação errada em bar e restaurante?** Sem segregação o total cai no
   regime geral (F-24), perdendo a redução de 40% (F-22) e a exclusão da gorjeta (F-25). É decisão de
   produto sobre **quanto o operador de caixa pode influenciar** a classificação: nada (só cadastro),
   ou marcar item a item no ato? `RN-FIS-015` e `RN-FIS-018` assumem "nada" — confirma?
3. **`APU` fora do MVP pressupõe que o contador do cliente cumpre a obrigação acessória** (F-10, F-30).
   Vale para os clientes-alvo, ou existe cliente sem contador, que perderia a dispensa por não ter onde
   cumprir? Não muda a fronteira — muda o risco que o passo 9 declara.
4. **Split payment: entrar agora ou vigiar?** (`LACUNA-FIS-005`.) A etapa que atinge venda a consumidor
   final muda o que o estabelecimento **recebe** por uma venda no cartão, e não tem data. Vigiar é o
   padrão desta spec; desenhar desde já é decisão sua.
5. **Documento de serviço** (`LACUNA-FIS-008`): o cliente-alvo emite documento de serviço hoje, e por
   qual sistema? Sem isso, o passo 3b especifica mercadoria e deixa serviço em aberto.

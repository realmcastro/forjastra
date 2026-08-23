# Fiscal — regimes, vigência e como uma regra nova entra no sistema

Este arquivo é a parte do fiscal que **não expira**. Ele não diz quanto se paga nem quando um prazo
vence: diz que **toda regra fiscal é dado com vigência**, que **regimes coexistem**, e que **o fato
gerador congela a versão de regra que o produziu** (`PN-08`). Escrito assim, ele sobrevive à
transição em curso, à próxima e à seguinte.

A partição do fiscal em três módulos (`FIS` tributação, `EMI` emissão, `APU` apuração e obrigação
acessória) e o contrato de cada um estão em `modulos/fiscal.md` §1. As regras daqui valem para os três.

**Regra de honestidade deste arquivo.** Fato sobre o regime tributário brasileiro existe **só** na
tabela `## Fontes`, no fim: uma linha por fato, `F-nn`, com a **URL inline** e o tipo da fonte. O
corpo do arquivo cita `F-nn` e **não acrescenta fato novo**. Onde não houve fonte, existe
`[[LACUNA-FIS-<n>]]` no lugar da frase — nunca "provavelmente", nunca "em geral", nunca "conforme o
padrão de mercado". Numeração contínua entre os dois arquivos: **F-01 a F-13 aqui**, F-14 em diante
em `modulos/fiscal.md`. Apuração dos fatos:
`docs/arquitetura/fiscal/2026-08-22-dossie-iva-ibs-cbs.md` e `…-iva-ibs-cbs-2.md` — datados, expiram.

## 1. A leitura que os fatos autorizam — e é a única que este arquivo faz

A regra fiscal muda **por ano-calendário** (F-03, F-04, F-12), **por unidade federativa e município**
(F-06), **por regime do contribuinte** (F-07, F-08), **por ato infralegal publicado em qualquer
semana** (F-11) e **por lei que altera a lei** (F-13) — e dois sistemas de tributação sobre consumo
**convivem por anos**, com a base de um excluindo o montante do outro (F-01, F-02).

Consequência direta, e é o requisito deste arquivo: **qualquer produto que trate alíquota, regime ou
prazo como constante de código estará errado dentro de um ano-calendário.**

## 2. Os objetos do modelo de vigência

Conceito, não tabela — a forma no banco é de `arquiteto-dados` (D-04 ABERTA):

| Objeto | O que é | O que nunca é |
|---|---|---|
| **Norma de origem** | o ato que instituiu a regra, identificado e datado | opinião, notícia, "entendimento" |
| **Regra fiscal** | um enunciado com parâmetros, escopo geográfico e janela de vigência | uma constante no código |
| **Versão de regra** (`rule_version`) | a regra tal como valia em um intervalo fechado de tempo | a "última" versão |
| **Regime** (`tax_regime`) | o conjunto de regras sob o qual um estabelecimento apura, com vigência | atributo permanente do cliente |
| **Fato gerador tributado** | o fato (`taxable_event`) + o resultado congelado + as versões de regra usadas | um cálculo refeito sob demanda |

O vocabulário dos quatro últimos é a âncora fiscal do núcleo (`glossario.md` §1.7). O módulo
acrescenta termo; **não redefine** estes.

## 3. As regras

Escopo de todas: módulo `FIS`, e por herança `EMI` e `APU`. Numeração `RN-FIS-001` a `RN-FIS-012`
neste arquivo; `RN-FIS-013` em diante em `modulos/fiscal.md`. Número não se renumera.

### RN-FIS-001 — Toda regra fiscal é dado com vigência e norma de origem

**Enunciado** nenhuma regra fiscal existe no produto sem janela de vigência (início, e fim quando
houver) e sem a norma que a instituiu registrada junto.
**Motivo** F-03, F-04 e F-12 têm vigência que expira por ano-calendário, e F-11 mostra o cronograma
mudando por ato infralegal. Regra sem vigência é regra que alguém vai ter que caçar no código quando
a lei mudar.
**Aceite** publicar duas versões da mesma regra com janelas contíguas; consultar a regra aplicável em
um instante dentro da primeira janela devolve a primeira, e no instante seguinte à virada devolve a
segunda — sem qualquer alteração de código.
**Infeliz** regra chega sem norma de origem ou sem início de vigência → **recusada na publicação**,
com o campo que falta nomeado. Nunca aceita com vigência "a partir de agora" por conveniência.

### RN-FIS-002 — Toda regra fiscal declara escopo geográfico

**Enunciado** além da vigência, toda regra declara a que território se aplica: nacional, uma unidade
federativa, ou um município.
**Motivo** F-06: a alíquota do IBS é fixada por lei de cada Estado e de cada Município. Em 2026–2028
o valor está em norma nacional (F-03, F-04), então o eixo geográfico ainda não morde; de 2029 em
diante (F-05) ele morde para sempre. Modelo sem esse eixo obriga a reescrever a regra depois.
**Aceite** uma regra publicada para uma UF não é aplicada a estabelecimento de outra UF; um cliente
com dois estabelecimentos em UFs diferentes produz resultados diferentes para o mesmo item, sem
ramificação por cliente no código.
**Infeliz** não existe regra para a UF ou o município do estabelecimento → `RN-FIS-011` (estado
explícito de lacuna). **Nunca** cair na regra nacional como substituto silencioso.
**Caso base** o **Ceará** é o caso base do produto no eixo UF; nada aqui presume que o CE seja
universal, e `[[LACUNA-FIS-011]]` cobre a lei estadual e municipal própria.

### RN-FIS-003 — Regimes coexistem: dois ou mais válidos ao mesmo tempo, no mesmo cliente

**Enunciado** o produto trata, na mesma janela de tempo e no mesmo cliente, mais de um regime
tributário válido — inclusive dois estabelecimentos do mesmo cliente em regimes diferentes, e um
mesmo estabelecimento com fatos de regimes diferentes (`RN-FIS-015`).
**Motivo** F-01 e F-02: dois sistemas de tributação sobre consumo convivem por anos, e a base de um
exclui o montante do outro. F-07 e F-08: o Simples é caminho paralelo, e o optante pode apurar
IBS/CBS pelo regime regular mantendo o Simples para o resto — o mesmo contribuinte, dois regimes.
**Aceite** um cliente com dois estabelecimentos, um optante pelo Simples e um do regime regular,
vende o mesmo item no mesmo dia: os dois fatos saem com resultados e exigências diferentes, cada um
citando as versões de regra que usou, e nenhum código pergunta "qual cliente é este".
**Infeliz** o regime do estabelecimento no instante do fato é desconhecido → o fato **não é
tributado** e fica em pendência nomeada; a venda conclui de qualquer forma (`PN-01`, `RN-EMI-001`).

### RN-FIS-004 — O fato gerador congela a versão de regra que o produziu

**Enunciado** no instante em que o fato gerador ocorre, o produto grava com ele o resultado tributário
**e a identificação de cada versão de regra usada**. Esse conjunto é imutável.
**Motivo** `PN-08`. Sem congelar, reimprimir um documento de ontem depois de uma publicação de regra
devolve outro valor — e o documento já foi entregue a um cliente-final e transmitido.
**Aceite** registrar um fato; publicar uma versão nova da regra com vigência posterior; reconsultar e
reimprimir o fato antigo → resultado **idêntico** ao original em valor e classificação. O fato
seguinte, no mesmo cliente, sai pela regra nova.
**Infeliz** a versão de regra usada não pôde ser identificada no momento do fato → o fato é gravado
como **não tributado, com motivo**, e nunca com um resultado sem procedência.

### RN-FIS-005 — Nenhum recálculo retroativo escreve no fato

**Enunciado** não existe, em nenhum caminho do produto, operação que recalcule tributo de fato passado
e substitua o resultado gravado. Nem correção de defeito, nem mudança de cadastro, nem publicação de
regra com vigência retroativa.
**Motivo** `PN-08` e `fronteira-do-nucleo.md` §3.1. É o requisito que impede o "recalcula tudo" depois
de mudança de regra — o modo clássico de um PDV perder a conciliação de um mês fechado.
**Aceite** alterar o dado tributário de um item do catálogo e reconsultar uma venda de ontem que usou
aquele item → o resultado da venda de ontem não muda. Publicar regime com vigência retroativa é
**recusado na publicação**, não aplicado.
**Infeliz** descobre-se que um fato foi tributado errado → `RN-FIS-006` (fato novo), nunca correção no
lugar. O fato errado permanece, visível, com o fato de correção apontando para ele.

### RN-FIS-006 — Retificação e cancelamento são fato novo referenciando o original

**Enunciado** corrigir ou cancelar um fato tributado é **criar outro fato**, que referencia o original,
com autor, instante e motivo. O original nunca é editado nem apagado.
**Motivo** `fronteira-do-nucleo.md` §6 já fixa isso como núcleo; esta é a versão fiscal, e existe
porque o resultado do fato de correção é apurado **pela versão de regra que o original congelou**, não
pela regra de hoje.
**Aceite** cancelar uma venda de um mês anterior, já sob outra versão de regra: o fato de cancelamento
reverte exatamente o que o original congelou; a soma dos dois é zero em cada tributo e em cada base;
os dois continuam consultáveis e nenhum foi alterado.
**Infeliz** a regra de correção do regime exige tratamento que não temos (prazo, forma, documento
próprio) → `[[LACUNA-FIS-009]]`; a operação é recusada com motivo, e nunca aproximada.

### RN-FIS-007 — Cliente migra de regime sem reescrever histórico

**Enunciado** o regime é atributo **do estabelecimento no tempo** e, congelado, **do fato** — nunca
atributo permanente do cadastro. Trocar de regime é abrir uma janela nova, não substituir a antiga.
**Motivo** F-08 e F-09: a entrada e a saída do regime regular do IBS são movimentos previstos em
norma, com trava (F-09). Um cliente que muda de regime em 1º de janeiro continua respondendo por tudo
que vendeu antes, sob o regime antigo.
**Aceite** migrar um estabelecimento de Simples para regime regular com vigência em uma data;
consultar uma venda anterior à data → ela continua apresentando o regime antigo e o resultado
original; a primeira venda após a data usa o novo. Nenhum registro anterior é tocado.
**Infeliz** a migração é solicitada com vigência que se sobrepõe a uma janela existente → recusada,
apontando a janela em conflito. Migração retroativa é `RN-FIS-005`: proibida.

### RN-FIS-008 — Vigência é resolvida no fuso do estabelecimento

**Enunciado** "qual regra vale" é respondido pelo instante do fato **convertido para o fuso do
estabelecimento**, nunca pelo fuso do servidor nem pelo do terminal.
**Motivo** F-03 e F-12 têm efeito na virada do ano-calendário, e F-04 muda na mesma fronteira. Uma
venda às 23h58 de 31 de dezembro e outra às 00h02 de 1º de janeiro caem em regimes diferentes, e o
Brasil tem mais de um fuso. Errar isso corrompe a virada de ano de todos os clientes de uma vez.
**Aceite** com o estabelecimento em fuso diferente do servidor, duas vendas a 10 minutos de distância
cruzando a meia-noite local de 31 de dezembro saem com versões de regra diferentes, e o "vendas de
hoje" do estabelecimento concorda com a data do documento.
**Infeliz** o fuso do estabelecimento não está definido → o fato **não é tributado** e a pendência diz
exatamente isso. Não existe fuso padrão presumido.

### RN-FIS-009 — Regra nova entra por publicação de dado, não por release de emergência

**Enunciado** acomodar mudança de regra é **publicar dado**: enunciado, parâmetros, escopo geográfico,
janela de vigência e norma de origem. Só cabe deploy de código quando a mudança cria uma **forma** de
regra que o produto ainda não sabe representar — exceção declarada, não rotina.
**Motivo** F-05 dá o prazo real de aviso das alíquotas de 2029 em diante (proposta até 31 de julho do
ano anterior, resolução do Senado depois disso) e F-11 mostra o cronograma mudando por ato conjunto no
meio do ano. Produto que precisa de release para cada mudança chega tarde em cada uma.
**Aceite** uma alíquota nova, com vigência futura, entra em produção sem build, sem migration e sem
janela de parada; nenhum terminal precisa ser atualizado; e à meia-noite do início da vigência, no
fuso do estabelecimento, o primeiro fato já sai pela regra nova.
**Infeliz** a mudança **não cabe** na forma existente (tributo novo, dimensão de base nova, tipo de
exclusão novo) → `BLOQUEIO` de produto, com a forma nova especificada antes de qualquer código, e a
regra fica em `RN-FIS-011` até lá — jamais aproximada por uma regra parecida.

### RN-FIS-010 — Ensaio de regra nova é leitura, nunca escrita

**Enunciado** antes de entrar em vigência, uma regra publicada pode ser **ensaiada** contra fatos
passados para conferir efeito ("o que teria dado"). O ensaio **não escreve** no fato e não altera
nenhum resultado congelado.
**Motivo** é a única forma de validar uma mudança de regime sem violar `RN-FIS-005`. Sem ensaio, a
primeira prova de que a regra nova está certa é a primeira venda do ano — e o custo do erro é o
documento entregue ao cliente-final.
**Aceite** ensaiar a regra do ano seguinte sobre o movimento de um dia passado produz um relatório
comparativo; ao final, cada fato daquele dia continua com o resultado original e nenhum registro
mostra alteração.
**Infeliz** o ensaio exige dado que o fato não congelou → o resultado sai **incompleto e rotulado**,
não estimado.

### RN-FIS-011 — Ausência de regra é estado explícito, nunca default silencioso

**Enunciado** quando a regra aplicável não existe, não está publicada, ou existe em duas leituras
contraditórias, o produto grava o fato como **não tributado com motivo nomeado** e mostra a pendência
a quem pode resolvê-la. Nunca escolhe a leitura conveniente, nunca aplica "a mais parecida".
**Motivo** duas fontes oficiais divergem hoje sobre um ponto que decide se um PDV vende ou não
(`[[LACUNA-FIS-001]]`, definida em `modulos/fiscal.md`), e as alíquotas de 2029 em diante ainda não
existem (F-05). Default silencioso transforma isso em valor errado em documento transmitido.
**Aceite** um estabelecimento cuja UF não tem regra publicada conclui vendas normalmente, e cada
venda fica com pendência "regra ausente para a UF, a partir de tal instante" — nominal, contável e
consultável. Nenhuma venda sai com tributo zero **implícito**.
**Infeliz** a pendência não é resolvida até a virada de vigência → permanece e continua contando para
trás; nada é fechado por decurso de prazo.

### RN-FIS-012 — O contrato com o núcleo é explícito, e ninguém lê por dentro do outro

**Enunciado** o núcleo consome do fiscal **apenas** o que os módulos declaram expor, e o fiscal consome
do núcleo **apenas** o que declara exigir. Nenhum lê a estrutura interna do outro, e nenhum módulo
fiscal escreve fato do núcleo.
**Motivo** `CLAUDE.md` §7.2 e `fronteira-do-nucleo.md` §2.7: a regra fiscal muda por lei e o núcleo
não pode mudar com ela. O contrato é o que permite trocar a regra sem tocar a venda.
**Aceite** com os três módulos desligados, o núcleo abre venda, conclui, recebe pagamento, fecha caixa
e emite comprovante não fiscal — sem erro e sem tela faltando. Com eles ligados, nada do núcleo muda
de forma: só passa a existir tributo e obrigação.
**Infeliz** o fiscal precisa de dado que o núcleo não expõe → `PERGUNTAS` ao dono do núcleo, com o
dado nomeado. Nunca uma coluna de fiscal ou de vertical acrescentada ao núcleo por atalho.
A lista concreta de expõe/exige está em `modulos/fiscal.md` §2.1, §3.1 e §4.

## 4. Como uma mudança de regime chega ao produto — o caminho, em ordem

1. **A norma sai.** Pode ser lei, decreto, resolução do CGIBS ou ato conjunto (F-11), e o aviso pode
   ser de meses (F-05) ou de semanas.
2. **Alguém lê a norma e responde por ela.** Trabalho humano, não inferência do produto: quem lê
   assina o registro da norma de origem. `PERGUNTAS` 1 pede a pessoa que ocupa esse papel — sem ela,
   `RN-FIS-011` é o comportamento correto, e é ruim de propósito.
3. **A regra é publicada como dado**, com vigência futura (`RN-FIS-001`, `RN-FIS-002`, `RN-FIS-009`).
   Nada muda no presente no instante da publicação.
4. **A regra é ensaiada** contra movimento real, sem escrever (`RN-FIS-010`). É aqui que se descobre
   erro de leitura da norma — antes do primeiro documento.
5. **A vigência começa** à meia-noite do fuso de cada estabelecimento (`RN-FIS-008`), sem deploy, sem
   parada, sem atualização de terminal.
6. **O passado continua igual** (`RN-FIS-004`, `RN-FIS-005`). O fechamento do mês anterior não se
   move; correção, se houver, é fato novo (`RN-FIS-006`).
7. **Se a forma da regra é nova**, o passo 3 falha de propósito e vira `BLOQUEIO` de produto
   (`RN-FIS-009`, caminho infeliz) — a única situação em que mudança de regime pede código.

**O que isto compra, e é o pedido original do humano:** o produto se adequa à regra nova **e** continua
servindo o cliente pela regra antiga, ao mesmo tempo, sem reescrever o que já aconteceu.

## 5. Fronteiras vigiadas — o que a próxima mudança pode trazer

Nenhuma destas é módulo novo, e **nenhum código foi reservado** para elas: não se reserva código para
módulo hipotético (`catalogo-de-modulos.md` §6). Os fatos `F-32` a `F-34` e as lacunas citadas aqui
estão definidos em `modulos/fiscal.md`.

- **Split payment** (F-32): recolhimento na liquidação financeira — toca `ADQ` e o recolhimento de
  `APU`, **não** a emissão. A etapa que atinge o consumidor final muda o que o estabelecimento
  **recebe** por uma venda no cartão, e não tem data (`[[LACUNA-FIS-005]]`).
- **Cashback** (F-33): o programa não é nosso; alcança-nos como CPF vinculado ao documento, validação
  antifraude **na emissão** (`[[LACUNA-FIS-006]]`) e sigilo intrafamiliar — restrição de tratamento de
  dado, não capacidade nossa. Toca `CLF` e `EMI`.
- **Imposto Seletivo** (F-34), com `[[LACUNA-FIS-007]]` sobre alíquota e lista: se incidir em item de
  balcão, é **incidência nova dentro de `FIS`**, que `RN-FIS-014` acomoda por decomposição — é
  exatamente o caso que `RN-FIS-009` chama de "forma nova de regra" se a decomposição não bastar.
- **Regime do ramo** (F-21, F-22, F-29): "qual regime se aplica" é **dado do estabelecimento e do
  item**, não código de vertical — `RES` e `VAR` ligam os mesmos módulos e diferem no dado. Nenhum `if`
  por ramo entra em `FIS` (`CLAUDE.md` §7.3).

## 6. O que este arquivo não decide

Alíquota, prazo, layout, sigla de documento, código de classificação: nada disso é constante deste
produto — é dado publicado sob as regras acima. Os valores que os dossiês confirmaram para hoje (F-03,
F-04, F-07, F-10) estão na tabela `## Fontes` **como prova de que a regra muda por ano-calendário**,
não como configuração. Tabela, coluna, endpoint, tela e stack estão fora: D-01 a D-04 ABERTAS.

## Fontes

Esta tabela é, ao mesmo tempo, a lista de **fatos verificados** deste arquivo e a seção de fontes:
fato do regime brasileiro que não esteja aqui **não existe** neste arquivo. Apuração:
`docs/arquitetura/fiscal/2026-08-22-dossie-iva-ibs-cbs.md` §1 a §4 e
`docs/arquitetura/fiscal/2026-08-22-dossie-iva-ibs-cbs-2.md` §7.

| ID | Afirmação | URL | Tipo | Acesso |
|---|---|---|---|---|
| F-01 | Os regimes convivem de 2026 a 2032: PIS/COFINS até 2026 (extintos em 2027), ICMS e ISS até 2032, IBS e CBS de 2026 em diante; a transição vai de 2026 a 2033. | https://bd.camara.leg.br/bitstreams/b93ed4e6-776f-43c7-a853-3773f64dd898/download | oficial (nota técnica da Consultoria Legislativa da Câmara, fev/2024). **O texto constitucional não foi lido pelo dossiê** | 2026-08-22 |
| F-01b | Confirmação do calendário de transição em página informativa da Receita Federal (não normativa). | https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/programas-e-atividades/reforma-tributaria-do-consumo/entenda | oficial, informativo (não é norma) | 2026-08-22 |
| F-02 | De 2026-01-01 a 2032-12-31, o montante de ICMS (inclusive o retido por substituição tributária), de ISS, de COFINS e de PIS/Pasep **não integra** a base de cálculo do IBS e da CBS. | https://www.cgibs.gov.br/upload/arquivos/202604/30084927-res-cgibs-n-6-30-abr-2026-regulamenta-o-ibs.pdf | oficial (Res. CGIBS 6/2026, art. 13, § 2º, V) | 2026-08-22 |
| F-03 | Em 2026 o IBS é cobrado à alíquota estadual de 0,1% e a CBS à de 0,9%, para fatos geradores de 2026-01-01 a 2026-12-31. | https://www.cgibs.gov.br/upload/arquivos/202604/30084927-res-cgibs-n-6-30-abr-2026-regulamenta-o-ibs.pdf | oficial (Res. CGIBS 6/2026, art. 596; Decreto 12.955/2026, art. 582) | 2026-08-22 |
| F-04 | Em 2027 e 2028 o IBS é cobrado à alíquota estadual de 0,05% e municipal de 0,05%. | https://www.cgibs.gov.br/upload/arquivos/202604/30084927-res-cgibs-n-6-30-abr-2026-regulamenta-o-ibs.pdf | oficial (Res. CGIBS 6/2026, art. 597) | 2026-08-22 |
| F-05 | As alíquotas de referência do IBS de 2029 a 2033 são fixadas por resolução do Senado Federal, a partir de proposta de cálculo enviada pelo CGIBS ao TCU **até 31 de julho do ano anterior à vigência**. | https://www.cgibs.gov.br/upload/arquivos/202604/30084927-res-cgibs-n-6-30-abr-2026-regulamenta-o-ibs.pdf | oficial (Res. CGIBS 6/2026, art. 598) | 2026-08-22 |
| F-06 | Cada Estado e cada Município fixa sua **própria** alíquota do IBS por lei específica; o DF exerce as duas competências. | https://www.cgibs.gov.br/upload/arquivos/202604/30084927-res-cgibs-n-6-30-abr-2026-regulamenta-o-ibs.pdf | oficial (Res. CGIBS 6/2026, art. 467) | 2026-08-22 |
| F-07 | As alíquotas de 2026 **não se aplicam** a operações de optantes pelo Simples Nacional. | https://www.cgibs.gov.br/upload/arquivos/202604/30084927-res-cgibs-n-6-30-abr-2026-regulamenta-o-ibs.pdf | oficial (Res. CGIBS 6/2026, art. 596, § 2º, IV) | 2026-08-22 |
| F-08 | O optante pelo Simples **pode** optar por apurar e recolher o IBS (e, espelhadamente, a CBS) pelo **regime regular**, mantendo o Simples para os demais tributos, nos termos da LC 123/2006. | https://www.cgibs.gov.br/upload/arquivos/202604/30084927-res-cgibs-n-6-30-abr-2026-regulamenta-o-ibs.pdf | oficial (Res. CGIBS 6/2026, art. 41, §§ 3º e 4º) | 2026-08-22 |
| F-09 | É vedado ao contribuinte do Simples sair do regime regular do IBS caso tenha recebido ressarcimento de créditos desse tributo. | https://www.cgibs.gov.br/upload/arquivos/202604/30084927-res-cgibs-n-6-30-abr-2026-regulamenta-o-ibs.pdf | oficial (Res. CGIBS 6/2026, art. 41, § 5º) | 2026-08-22 |
| F-10 | Em 2026 a apuração é **meramente informativa** e o recolhimento de IBS/CBS é **dispensado** para quem cumpre as obrigações acessórias. | https://www.cgibs.gov.br/upload/arquivos/202604/30084927-res-cgibs-n-6-30-abr-2026-regulamenta-o-ibs.pdf | oficial (Res. CGIBS 6/2026, art. 465; Decreto 12.955/2026, art. 583, § 1º) | 2026-08-22 |
| F-11 | O cronograma de obrigatoriedade dos documentos fiscais é fixado por **ato conjunto** RFB/CGIBS, e mudou ao longo de 2026: Ato Conjunto 1, de 23/12/2025 → Ato Conjunto 4, de 30/07/2026 → Ato Conjunto 5, de 12/08/2026. | https://www.cgibs.gov.br/atos-conjuntos | oficial (listagem dos atos conjuntos RFB/CGIBS) | 2026-08-22 |
| F-11b | Texto do Ato Conjunto RFB/CGIBS nº 4, de 30/07/2026, que fixa o cronograma vigente. | https://www.cgibs.gov.br/upload/arquivos/202607/31091735-20260730-16h30-ato-conjunto-rfb-cgibs-na-c2-ba-4-260731-090909.pdf | oficial (texto do ato) | 2026-08-22 |
| F-12 | Saldo a recuperar de IBS existente em 2026-12-31 é **desconsiderado** a partir de 2027-01-01 e não é ressarcido. | https://www.cgibs.gov.br/upload/arquivos/202604/30084927-res-cgibs-n-6-30-abr-2026-regulamenta-o-ibs.pdf | oficial (Res. CGIBS 6/2026, art. 466) | 2026-08-22 |
| F-13 | A LC 214/2025 já foi alterada pela LC 227, sancionada em 13/01/2026, e há vetos (Mensagem 36/2026) pendentes de deliberação no Congresso. | https://www12.senado.leg.br/noticias/materias/2026/01/14/reforma-tributaria-lei-cria-comite-gestor-do-ibs-e-define-regras-do-imposto | oficial, notícia institucional (Agência Senado) | 2026-08-22 |

## Lacunas

Definidas neste arquivo:

- **`[[LACUNA-FIS-011: existe lei do Estado do Ceará — e do município do estabelecimento — fixando
  alíquota própria de IBS, e a partir de que vigência? — sem fonte em 2026-08-22]]`** F-06 diz que
  cada Estado e cada Município fixa a sua por lei específica; F-03 e F-04 mostram que até 2028 o valor
  está em norma nacional. Nenhum dossiê pesquisou legislação estadual ou municipal. **Responde:**
  humano / contador de referência. **Consequência:** `RN-FIS-002` está correta sem essa resposta; o
  que falta é o **dado**, não a regra.
- **`[[LACUNA-FIS-012: qual é a redação literal dos artigos da LC 214/2025 que os regulamentos citam
  (arts. 273 a 276, 343 a 348, 31 a 35)? — sem fonte em 2026-08-22]]`** o dossiê declara que não
  conseguiu abrir o texto integral da LC 214/2025 e que tudo o que diz dela vem de citação verbatim
  dentro do Decreto 12.955/2026 e da Resolução CGIBS 6/2026. **Responde:** humano / contador.
  **Consequência:** todo `F-nn` deste arquivo é confiável até o nível do regulamento, não do texto
  legal lido diretamente.

Definidas em `modulos/fiscal.md` e citadas aqui: `LACUNA-FIS-001` (sanção × rejeição do documento
incompleto) e `LACUNA-FIS-009` (prazo e forma de cancelamento e retificação).

## PERGUNTAS: para humano

1. **Quem é o contador ou consultoria de referência que assina a leitura da norma?** O passo 2 do §4
   depende de uma pessoa responsável — e o Programa Nacional de Conformidade chega a exigir
   "profissional da contabilidade responsável pela conformidade fiscal" indicado no sistema (F-30, em
   `modulos/fiscal.md`), ou seja, é um **papel que o produto tem que acomodar**, não só um fornecedor
   nosso. Existe essa pessoa hoje?
2. **Qual horizonte de vigência a primeira entrega tem que cobrir?** Só 2026 (apuração informativa,
   F-10), já 2027 (CBS integral, PIS/COFINS extintos), ou já 2029–2032 (dois sistemas convivendo)? A
   arquitetura deste arquivo cobre os três; a resposta muda **quanto dado** precisa estar publicado no
   dia 1 — insumo do passo 9, não decisão minha.
3. **Publicação de regra é operação nossa ou do cliente?** Uma alíquota de UF publicada por nós vale
   para todos os clientes daquela UF; dado tributário de item é do cliente (`fronteira` §6). Onde fica
   a fronteira quando o cliente discorda da nossa leitura da norma — ele pode sobrepor?
4. **Uma regra pode nascer já com fim de vigência conhecido e sem substituta?** F-03 expira em
   2026-12-31 e a substituta (F-04) existe; se em algum caso a substituta não existir a tempo, o
   comportamento correto é `RN-FIS-011` (não tributa, pendência) — o que, num PDV, significa documento
   não emitido. Confirma que é isso, ou existe fallback comercial aceitável?

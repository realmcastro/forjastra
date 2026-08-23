# Adendo fiscal — base de cálculo (por fora/por dentro) e gorjeta em bar/restaurante

> **Documento datado. Estado em 2026-08-22 — expira.** As regras de validação de documento fiscal são
> fixadas por Nota Técnica revisada quase mensalmente (aqui, a versão **1.51**, de 2026-08-04) e as
> datas de obrigatoriedade vêm de ato conjunto que já mudou várias vezes em 2026. **Reconferir antes
> de implementar.** Trata de LACUNA-FIS-002, LACUNA-FIS-003 e LACUNA-FIS-001 dos dossiês
> `2026-08-22-dossie-iva-ibs-cbs.md` e `2026-08-22-dossie-iva-ibs-cbs-2.md`.

## Veredito

1. **LACUNA-FIS-002 — FECHA, com um corte de data.** É **"por fora"** em dois sentidos distintos, e
   os dois são norma: (a) a base é o valor integral cobrado e o próprio IBS/CBS **não integra** essa
   base (Constituição, art. 156-A, § 1º, IX, e art. 195, § 17); (b) no documento fiscal o tributo é
   **destacado** ("sempre que possível, terá seu valor informado, de forma específica" — art. 156-A,
   § 1º, XIII).
2. **O total a pagar: destaque informativo em 2026, somado a partir de 2027.** A regra VB01-10 da NT
   2025.002-RTC v1.51 manda `vItem` **somar** `vIBS + vCBS + vIS`, com **"Exceção 1: Em 2025 e 2026
   não somar vIBS, vCBS, vIS"**. Existe campo novo de total do documento **com** os tributos
   (`vNFTot`, W60). Ambas as regras estão marcadas **"Implementação Futura"** — escritas, não
   exigidas ainda.
3. **Preço anunciado: NÃO FECHA.** Nenhuma norma da reforma trata do preço anunciado ao consumidor
   (a LC 214/2025 não menciona a Lei 12.741/2012 nem preço de venda). O que existe é regra geral de
   consumo: o preço informado deve discriminar **o total à vista**, sem cálculo pelo consumidor.
4. **LACUNA-FIS-003 — FECHA em (a) e (c); NÃO FECHA em (b).** (a) 15% do valor total do fornecimento
   de alimentação e bebidas, fixado na **LC 214/2025, art. 274, parágrafo único, I, "b"**, mais
   condição de repasse integral ao empregado. (c) A norma tributária diz só "gorjeta" e **não
   distingue** espontânea de taxa de serviço compulsória — nem define o termo. (b) O que acontece
   com o **excedente** dos 15% **não está escrito em nenhuma das três normas**.
5. **LACUNA-FIS-001 — FECHA. Não havia contradição.** O Ato Conjunto RFB/CGIBS nº 1, de **22**/12/2025
   (não 23/12), limita a não aplicação de penalidades a "até o primeiro dia do quarto mês subsequente
   ao da publicação da parte comum dos regulamentos" — janela que se encerrou em 2026-08-01, não no
   fim de 2026.

---

## 1. LACUNA-FIS-002 — base de cálculo, destaque e total a pagar

### O IBS não integra a própria base de cálculo, nem a base da CBS, do Imposto Seletivo, da COFINS e do PIS — é regra constitucional, não infralegal.
FONTE: https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm
TIPO: oficial (CF, art. 156-A, § 1º, IX, incluído pela EC 132/2023 — verbatim: "não integrará sua
própria base de cálculo nem a dos tributos previstos nos arts. 153, VIII, e 195, I, 'b', IV e V, e da
contribuição para o Programa de Integração Social de que trata o art. 239")
ACESSO: 2026-08-22
VÁLIDO PARA: 2023-12-20 em diante · MUDA? não (exigiria emenda constitucional)
CONFIANÇA: fonte única oficial (é o texto constitucional)

### A mesma regra vale para a CBS, por dispositivo próprio: a CBS não integra sua própria base nem a do IBS, do Imposto Seletivo, da COFINS e do PIS.
FONTE: https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm
TIPO: oficial (CF, art. 195, § 17, incluído pela EC 132/2023). O art. 195, § 16, ainda manda aplicar
à CBS o art. 156-A, § 1º, **X a XIII** — o que estende à CBS a regra do destaque no documento fiscal.
ACESSO: 2026-08-22
VÁLIDO PARA: 2023-12-20 em diante · MUDA? não
CONFIANÇA: fonte única oficial

### O documento fiscal deve informar o valor do imposto "de forma específica" — mas com a ressalva "sempre que possível", não como obrigação absoluta.
FONTE: https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm
TIPO: oficial (CF, art. 156-A, § 1º, XIII — verbatim: "sempre que possível, terá seu valor informado,
de forma específica, no respectivo documento fiscal"; aplicável à CBS pelo art. 195, § 16)
ACESSO: 2026-08-22
VÁLIDO PARA: 2023-12-20 em diante · MUDA? não
CONFIANÇA: fonte única oficial

### A base de cálculo do IBS e da CBS é o valor da operação = o valor integral cobrado pelo fornecedor a qualquer título; e o montante do IBS e da CBS incidentes sobre a operação NÃO integra essa base.
FONTE: https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp214.htm
TIPO: oficial (LC 214/2025, art. 12, caput, § 1º e § 2º, I — texto integral da lei, finalmente aberto)
ACESSO: 2026-08-22
VÁLIDO PARA: 2025-01-16 em diante, com as alterações da LC 227/2026 · MUDA? provável (LC)
CONFIANÇA: confirmada (LC 214/2025 art. 12; Resolução CGIBS 6/2026 art. 13; Decreto 12.955/2026 art. 13)

### Os dois regulamentos reproduzem o art. 12 da LC 214 palavra por palavra, e a Portaria Conjunta MF/CGIBS nº 7/2026 reconhece formalmente o Livro I dos dois regulamentos como **disposições comuns** ao IBS e à CBS.
FONTE: https://www.cgibs.gov.br/upload/arquivos/202604/30094136-sei-mgi-60959979-portaria-conjunta.pdf
TIPO: oficial (Portaria Conjunta MF/CGIBS nº 7, de 30/04/2026, art. 1º)
ACESSO: 2026-08-22
VÁLIDO PARA: 2026-04-30 em diante · MUDA? provável (o reconhecimento "não se aplica a alterações"
posteriores dos regulamentos — parágrafo único)
CONFIANÇA: fonte única oficial (é o texto da portaria)

### Regulamento do IBS: base = valor da operação; não integram a base o montante do IBS e da CBS, o IPI, os descontos incondicionais, reembolsos por conta e ordem, ICMS/ISS/PIS/COFINS de 2026-01-01 a 2032-12-31, e a CIP/COSIP.
FONTE: https://www.cgibs.gov.br/upload/arquivos/202604/30084927-res-cgibs-n-6-30-abr-2026-regulamenta-o-ibs.pdf
TIPO: oficial (Resolução CGIBS nº 6/2026, art. 13, §§ 1º e 2º — PDF de 252 páginas, baixado e
extraído com `pdftotext`; usar `curl --http1.1`, HTTP/2 fecha a conexão)
ACESSO: 2026-08-22
VÁLIDO PARA: 2026-04-30 em diante · MUDA? provável
CONFIANÇA: confirmada (espelho idêntico no Decreto 12.955/2026, art. 13)

### Regulamento da CBS: texto idêntico, com a CBS no lugar do IBS.
FONTE: https://www.in.gov.br/en/web/dou/-/decreto-n-12.955-de-29-de-abril-de-2026-702415229
TIPO: oficial (Decreto nº 12.955/2026, art. 13, § 2º, I — "o montante da CBS e do Imposto sobre Bens
e Serviços - IBS incidentes sobre a operação")
ACESSO: 2026-08-22
VÁLIDO PARA: 2026-04-30 em diante · MUDA? provável
CONFIANÇA: confirmada

### A regra de validação do documento fiscal manda **somar** IBS, CBS e IS ao total do item — e abre exceção expressa para 2025 e 2026.
FONTE: https://www.nfe.fazenda.gov.br/portal/exibirArquivo.aspx?conteudo=AKD/muSmiIY=
TIPO: oficial (NT 2025.002-RTC v1.51, jul/2026, regra **VB01-10**, p. 70). Verbatim do somatório:
"Valor total do Item (vItem) deve ser igual ao somatório: (+) vProd (-) vDesc ... (+) vIBS (+) vCBS
(+) vIS (+) vTotIBSMonoItem (+) vTotCBSMonoItem" seguido de "**Exceção 1: Em 2025 e 2026 não somar
vIBS, vCBS, vIS, vTotIBSMonoItem, vTotCBSMonoItem.**" e "Observação 1: Implementação Futura."
A regra VB01-20 repete o mesmo para faturamento direto de veículo novo.
ACESSO: 2026-08-22 · o link exige cookie de sessão: baixar primeiro
https://www.nfe.fazenda.gov.br/portal/listaConteudo.aspx?tipoConteudo=04BIflQt1aY= com o mesmo
cookie jar. Sem isso, retorna loop de 302.
VÁLIDO PARA: NF-e/NFC-e modelos 55 e 65 · MUDA? **sim** — 12 versões da NT em 2026
CONFIANÇA: fonte única oficial (é o texto da NT, ratificada por ato conjunto — bloco seguinte)

### Existe um campo novo de total do documento **com** os tributos novos: `vNFTot` (W60), "Valor total da NF-e com IBS / CBS / IS", que deve ser a soma dos `vItem`.
FONTE: https://www.nfe.fazenda.gov.br/portal/exibirArquivo.aspx?conteudo=AKD/muSmiIY=
TIPO: oficial (NT 2025.002-RTC v1.51: leiaute id 355.30 / W60, p. 31; regras W60-05 e W60-10, p. 72).
Ocorrência `0-1` (opcional). Ambas as regras trazem "Observação: Implementação futura."
ACESSO: 2026-08-22
VÁLIDO PARA: NF-e/NFC-e modelos 55 e 65 · MUDA? sim
CONFIANÇA: fonte única oficial

### A NT 2025.002 v1.51 é norma, não sugestão: foi aprovada por ato conjunto RFB/CGIBS de 2026-07-31, com aplicação expressa à CBS e ao IBS.
FONTE: https://www.cgibs.gov.br/upload/arquivos/202608/01153321-am-ato-tecnico-conjunto-rfb-e-cgibs-ratificacao-nts-dfes-revisao-assinado.pdf
TIPO: oficial (Ato Técnico Conjunto RFB/CGIBS nº 1, de 31/07/2026, art. 1º, I, "b"; listado em
https://www.cgibs.gov.br/atos-tecnicos-conjuntos). O art. 2º ratifica também as versões 1.40 e 1.50.
ACESSO: 2026-08-22
VÁLIDO PARA: 2026-07-31 em diante · MUDA? sim (cada nova versão de NT exige novo ato)
CONFIANÇA: fonte única oficial

### Em 2026 a informação de IBS/CBS no documento fiscal é obrigatória mas o cálculo é informativo: a apuração de 2026 é "meramente informativa, sem efeitos tributários".
FONTE: https://www.in.gov.br/web/dou/-/ato-conjunto-rfb/cgibs-n-1-de-22-de-dezembro-de-2025-677624586
TIPO: oficial (Ato Conjunto RFB/CGIBS nº 1, de 22/12/2025, art. 3º, parágrafo único)
ACESSO: 2026-08-22
VÁLIDO PARA: ano de 2026 · MUDA? não (é norma de ano fechado)
CONFIANÇA: fonte única oficial

### Nenhuma norma da reforma trata do preço anunciado ao consumidor: a LC 214/2025 não cita a Lei 12.741/2012, não usa a expressão "preço anunciado" nem regula formação de preço de venda.
FONTE: https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp214.htm
TIPO: oficial (busca no texto integral da LC 214/2025: 0 ocorrências de "12.741"; 0 de "por fora";
"consumidor final" aparece 3 vezes, todas em fórmula de fixação de alíquota de referência ou na
definição de embalagem primária do Imposto Seletivo)
ACESSO: 2026-08-22
VÁLIDO PARA: 2026-08-22 · MUDA? provável (LC pode ser alterada)
CONFIANÇA: fonte única oficial (ausência verificada no próprio texto, não inferida)

### A regra geral de consumo que existe hoje: o preço de produto ou serviço deve ser informado discriminando-se **o total à vista**, e a informação não pode exigir "qualquer interpretação ou cálculo" do consumidor.
FONTE: https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2006/decreto/d5903.htm
TIPO: oficial (Decreto nº 5.903/2006, art. 3º, caput, e art. 2º, § 1º, II — regulamenta a Lei
10.962/2004 e a Lei 8.078/1990)
ACESSO: 2026-08-22
VÁLIDO PARA: 2006-09-20 em diante · MUDA? não
CONFIANÇA: confirmada (Decreto 5.903/2006 art. 3º; CDC art. 31, em
https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm, exige informação "correta, clara,
precisa, ostensiva" sobre preço)

### O regime de transparência tributária hoje vigente é **informativo e não altera o total**: o documento fiscal informa o "valor aproximado" da totalidade dos tributos — e a lista fechada de tributos a computar **não inclui IBS nem CBS**.
FONTE: https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/lei/l12741.htm
TIPO: oficial (Lei nº 12.741/2012, art. 1º, caput e § 5º; regulamenta a CF, art. 150, § 5º). O § 5º
lista ICMS, ISS, IPI, IOF e contribuições — redação de 2012, não atualizada para IBS/CBS.
ACESSO: 2026-08-22
VÁLIDO PARA: 2026-08-22 · MUDA? provável (precisa de alteração para cobrir IBS/CBS)
CONFIANÇA: fonte única oficial

### Nota terminológica: "cobrança por fora", no vocabulário da reforma, significa a proibição de um tributo incidir sobre ele mesmo e sobre outros — **não** significa "acrescido ao preço no fechamento".
FONTE: https://bd.camara.leg.br/bitstreams/b93ed4e6-776f-43c7-a853-3773f64dd898/download
TIPO: secundária (Nota Técnica da Consultoria Legislativa da Câmara, fev/2024, "Síntese do conteúdo
da EC 132/2023", p. 6; o próprio documento declara não representar a posição da Câmara)
ACESSO: 2026-08-22 · VÁLIDO PARA: 2024-02 · MUDA? não
CONFIANÇA: só secundária (o fato normativo por trás está na CF, art. 156-A, § 1º, IX)

### INFERÊNCIA (não é fato) — o efeito prático no caixa, e por que ele é uma inferência
Premissas, todas com link acima: (1) o total do item **soma** vIBS+vCBS+vIS a partir de 2027, e não
soma em 2026 (NT 2025.002 v1.51, VB01-10); (2) existe total do documento **com** os tributos
(`vNFTot`); (3) a base é o valor cobrado **sem** o próprio tributo (LC 214, art. 12, § 2º, I);
(4) o preço informado ao consumidor tem de ser o total à vista, sem cálculo (Decreto 5.903/2006).
O que **não** está escrito em norma alguma que eu tenha aberto: se o comerciante deve anunciar preço
com ou sem o tributo, e como as premissas (1) e (4) se conciliam na etiqueta de prateleira. Portanto:
o efeito aritmético de 2027 em diante é fato normativo; a consequência para o preço anunciado é
inferência, e o item de LACUNAS que corresponde a ela permanece aberto.

---

## 2. LACUNA-FIS-003 — gorjeta e taxa de serviço em bar e restaurante

### (a) O limite é 15% e quem o fixa é a lei, não o regulamento: LC 214/2025, art. 274, parágrafo único, I.
FONTE: https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp214.htm
TIPO: oficial (LC 214/2025, art. 274, parágrafo único, verbatim: "Ficam excluídos da base de cálculo:
I - a gorjeta incidente no fornecimento de alimentação, desde que: a) seja repassada integralmente ao
empregado, sem prejuízo dos valores da gorjeta que forem retidos pelo empregador em virtude de
determinação legal; e b) seu valor não exceda a 15% (quinze por cento) do valor total do fornecimento
de alimento e bebidas; II - os valores não repassados aos bares e restaurantes pelo serviço de
entrega e intermediação de pedidos de alimentação e bebidas por plataforma digital.")
ACESSO: 2026-08-22
VÁLIDO PARA: 2025-01-16 em diante · MUDA? provável (LC)
CONFIANÇA: confirmada (LC 214/2025 art. 274; Res. CGIBS 6/2026 art. 399; Decreto 12.955/2026 art. 399)

### São **duas** condições cumulativas, não uma: repasse integral ao empregado **e** teto de 15%. Falhar em qualquer uma derruba a exclusão.
FONTE: https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp214.htm
TIPO: oficial (LC 214/2025, art. 274, parágrafo único, I, "a" e "b", ligados por "e")
ACESSO: 2026-08-22
VÁLIDO PARA: 2025-01-16 em diante · MUDA? provável
CONFIANÇA: confirmada (as três normas trazem o mesmo "e")

### Os regulamentos **acrescentaram** dois parágrafos que não existem na LC 214: a exigência de segregação no documento fiscal (§ 2º e § 4º) e uma fórmula de percentual (§ 3º).
FONTE: https://www.cgibs.gov.br/upload/arquivos/202604/30084927-res-cgibs-n-6-30-abr-2026-regulamenta-o-ibs.pdf
TIPO: oficial (Resolução CGIBS nº 6/2026, art. 399, §§ 2º a 4º, contra LC 214/2025 art. 274 que só
tem parágrafo único). § 4º verbatim: "Na hipótese de não segregação dos valores de que trata o § 1º
no documento fiscal relativo ao fornecimento, a base de cálculo do IBS corresponderá ao valor total
da operação referente ao fornecimento dos alimentos e bebidas sujeitos ao regime específico".
ACESSO: 2026-08-22
VÁLIDO PARA: 2026-04-30 em diante · MUDA? provável
CONFIANÇA: confirmada (idêntico no Decreto 12.955/2026, art. 399, §§ 2º a 4º)

### O § 3º dos regulamentos define o percentual por uma relação **diferente** da do 15% da lei, e sua redação é ambígua.
FONTE: https://www.in.gov.br/en/web/dou/-/decreto-n-12.955-de-29-de-abril-de-2026-702415229
TIPO: oficial (Decreto nº 12.955/2026, art. 399, § 3º, verbatim: "Para efeitos da exclusão da base de
cálculo de que trata o § 1º, o percentual será calculado com base na relação entre o valor do
fornecimento dos alimentos e das bebidas sujeitos ao regime específico e o valor total da operação.")
Note que a lei compara a gorjeta com "o valor total do fornecimento de alimento e bebidas", enquanto
este § 3º compara o fornecimento do regime específico com o total da operação — não é o mesmo cálculo.
ACESSO: 2026-08-22
VÁLIDO PARA: 2026-04-30 em diante · MUDA? provável
CONFIANÇA: confirmada (idêntico na Res. CGIBS 6/2026, art. 399, § 3º)

### (c) A norma tributária usa só a palavra "gorjeta", **não a define** e **não distingue** espontânea de taxa de serviço compulsória.
FONTE: https://www.cgibs.gov.br/upload/arquivos/202604/30084927-res-cgibs-n-6-30-abr-2026-regulamenta-o-ibs.pdf
TIPO: oficial (busca no PDF de 252 páginas da Resolução CGIBS nº 6/2026: a palavra "gorjeta" aparece
**3 vezes**, todas dentro do art. 399, § 1º, I, e § 2º — nenhuma delas definindo o termo, nenhuma
mencionando "taxa de serviço", "adicional" ou "compulsória". O mesmo no Decreto 12.955/2026 e na
LC 214/2025.)
ACESSO: 2026-08-22
VÁLIDO PARA: 2026-08-22 · MUDA? provável
CONFIANÇA: confirmada (ausência verificada nos três textos)

### A definição legal de "gorjeta" que existe no ordenamento abrange **as duas** formas — e está na legislação trabalhista, não na tributária.
FONTE: https://www2.camara.leg.br/legin/fed/declei/1940-1949/decreto-lei-5452-1-maio-1943-415500-normaatualizada-pe.html
TIPO: oficial (CLT, art. 457, § 3º, redação da Lei 13.419/2017, verbatim: "Considera-se gorjeta não só
a importância espontaneamente dada pelo cliente ao empregado, como também o valor cobrado pela
empresa, como serviço ou adicional, a qualquer título, e destinado à distribuição aos empregados.")
ACESSO: 2026-08-22
VÁLIDO PARA: 2017-05 em diante · MUDA? não
CONFIANÇA: confirmada (CLT consolidada na Câmara; texto original da Lei 13.419/2017, art. 2º, em
https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2017/lei/l13419.htm)

### A "determinação legal" de retenção citada pela LC 214 tem endereço: a CLT autoriza retenção de até 20% (regime de tributação federal diferenciado) ou 33% (demais), sempre mediante convenção ou acordo coletivo, e apenas para "as empresas que cobrarem a gorjeta".
FONTE: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2017/lei/l13419.htm
TIPO: oficial (CLT, art. 457, §§ 4º, 6º e 7º, na redação da Lei 13.419/2017). O § 4º diz que a gorjeta
"não constitui receita própria dos empregadores". O § 6º manda "lançá-la na respectiva nota de
consumo". O § 7º trata da gorjeta entregue diretamente ao empregado.
ACESSO: 2026-08-22
VÁLIDO PARA: 2017-05 em diante · MUDA? não
CONFIANÇA: confirmada (texto da lei e CLT consolidada na Câmara)

### INFERÊNCIA (não é fato) — a ponte entre a CLT e o IBS/CBS
Premissas com link: (1) a norma tributária não define "gorjeta" (bloco acima); (2) a CLT define e
abrange as duas formas (bloco acima); (3) a LC 214, art. 274, condiciona a exclusão a repasse
integral "sem prejuízo dos valores da gorjeta que forem retidos pelo empregador **em virtude de
determinação legal**", e a única determinação legal de retenção de gorjeta que localizei é a da CLT,
art. 457, § 6º, que fala de "empresas que cobrarem a gorjeta" — isto é, a compulsória lançada na
nota. Conclusão inferida: a exclusão da base alcançaria tanto a espontânea quanto a taxa de serviço.
**Não é fato**: nenhuma norma tributária que eu abri remete expressamente à CLT, e não localizei ato
do CGIBS/RFB, solução de consulta ou parecer oficial que faça essa ponte.

---

## 3. LACUNA-FIS-001 — a "contradição" de 2026: não existe

### A não aplicação de penalidades **nunca** valeu para todo o ano de 2026: o prazo é "até o primeiro dia do quarto mês subsequente ao da publicação da parte comum dos regulamentos".
FONTE: https://www.in.gov.br/web/dou/-/ato-conjunto-rfb/cgibs-n-1-de-22-de-dezembro-de-2025-677624586
TIPO: oficial (Ato Conjunto RFB/CGIBS nº 1, de **22 de dezembro de 2025** — publicado no DOU de
2025-12-23, ed. 244, seção 1, p. 222. Art. 3º verbatim: "Até o primeiro dia do quarto mês subsequente
ao da publicação da parte comum dos regulamentos do Imposto sobre Bens e Serviços - IBS e da
Contribuição sobre Bens e Serviços - CBS: I - não haverá aplicação de penalidades pela falta de
registro dos campos do IBS e da CBS nos documentos fiscais (...); e II - será considerado atendido o
requisito para a dispensa do recolhimento do IBS e da CBS, previsto no art. 348, § 1º, da Lei
Complementar nº 214")
ACESSO: 2026-08-22
VÁLIDO PARA: vigência a partir de 2026-01-01 (art. 5º) · MUDA? não
CONFIANÇA: fonte única oficial (é o texto do ato, no DOU)

**Aritmética explícita, não medida — é conta:** a parte comum dos regulamentos foi publicada em
2026-04-30 (Decreto 12.955/2026 no DOU de 30/04/2026 e Resolução CGIBS 6/2026 na mesma data,
reconhecidas como comuns pela Portaria Conjunta MF/CGIBS nº 7/2026). Meses subsequentes a abril:
1º maio, 2º junho, 3º julho, 4º agosto. Primeiro dia do quarto mês subsequente = **2026-08-01**.
A obrigatoriedade de emissão com os campos começa em **2026-08-03** (Ato Conjunto nº 4/2026).

### Há retificação publicada no ato: o inciso I passou a referir o art. 2º, §§ 1º e 2º (não o art. 1º).
FONTE: https://www.in.gov.br/web/dou/-/retificacao-677962652
TIPO: oficial (Retificação publicada no DOU de 2025-12-24)
ACESSO: 2026-08-22
VÁLIDO PARA: 2025-12-24 em diante · MUDA? não
CONFIANÇA: fonte única oficial

### A rejeição do documento sem os campos de IBS/CBS tem regra nomeada, data de produção e escopo por regime tributário — e não é sanção, é validação de autorização.
FONTE: https://www.nfe.fazenda.gov.br/portal/exibirArquivo.aspx?conteudo=AKD/muSmiIY=
TIPO: oficial (NT 2025.002-RTC v1.51, regra **UB12-10**, p. 40 e ss.: "Não informado grupo de imposto
IBS e CBS (grupo: det/imposto/IBSCBS)" → "Rejeição: Grupo IBSCBS não informado", aplicabilidade
"Obrig.", msg 1115. **Observação 2: implementação em produção para NFe com data de emissão maior ou
igual a 03/08/2026 e emitente com CRT 3=Regime Normal.** Observação 3: para CRT 1, 2 ou 4 (Simples
Nacional e MEI), a partir de **04/01/2027**. Observação 1: homologação desde 01/07/2026. Exceção 1:
não se aplica a NF-e de devolução ou complementar que referencie NF-e anterior a 2027; exceção 2:
combustível monofásico.)
ACESSO: 2026-08-22
VÁLIDO PARA: a partir de 2026-08-03 (regime normal) · MUDA? sim (é NT)
CONFIANÇA: fonte única oficial (a notícia CGIBS de 2026-06-15 descreve o mesmo comportamento)

### Nenhum ato posterior revogou ou alterou o Ato Conjunto nº 1/2025 nesse ponto.
FONTE: https://www.cgibs.gov.br/atos-conjuntos
TIPO: oficial (listagem oficial completa em 2026-08-22: Portaria Conjunta MF/CGIBS nº 7 de 30/04/2026;
Ato Conjunto nº 2 de 27/05/2026; nº 3 de 19/06/2026; nº 4 de 30/07/2026; nº 5 de 12/08/2026 — nenhum
nº 6). Baixei e abri o texto de todos: nenhum contém "revoga", "sanção", "penalidade" ou "validação"
sobre esse tema. Também abri https://www.cgibs.gov.br/resolucoes (resoluções nº 1 a nº 17/2026) e o
texto da Resolução CGIBS nº 13/2026, que altera apenas o art. 617 (vigência) do regulamento do IBS.
ACESSO: 2026-08-22
VÁLIDO PARA: 2026-08-22 · MUDA? sim (lista viva)
CONFIANÇA: fonte única oficial

### O que os atos não abertos pela pesquisa anterior realmente tratam (fecha itens de LACUNAS do dossiê 2)
- **Ato Conjunto nº 2, de 27/05/2026** — https://www.cgibs.gov.br/upload/arquivos/202606/03111600-ato-conjunto-rfb-e-cibs-2827-05-29-assinado.pdf
  (PDF de 733 KB aberto; `pdftotext -layout` devolveu só a assinatura. **Não afirmo o conteúdo.**)
- **Ato Conjunto nº 3, de 19/06/2026** — https://www.cgibs.gov.br/upload/arquivos/202606/22083423-ato-conjunto-nro-3-dere.pdf
  — autoriza a publicação, em domínios do CGIBS e da RFB, da documentação técnica. Não é validação.
- **Portaria Conjunta MF/CGIBS nº 7, de 30/04/2026** — reconhece as disposições comuns (Livro I).
- **Resolução CGIBS nº 13, de 22/07/2026** — https://www.cgibs.gov.br/upload/arquivos/202607/22121010-resolucao-cgibs-n-13-de-22-de-julho-de-2026.pdf
  — altera o art. 617 (vigência) do regulamento do IBS.
TIPO: oficial (os quatro PDFs, baixados e extraídos) · ACESSO: 2026-08-22 · CONFIANÇA: fonte única oficial

---

## LACUNAS

- **Preço anunciado ao consumidor — não fecha.** Não localizei norma que obrigue ou proíba embutir
  IBS/CBS no preço anunciado. Pergunta sem resposta: existe ato do CGIBS/RFB, do Ministério da
  Fazenda, da Senacon ou do Confaz, ou projeto de lei já numerado, dispondo sobre etiqueta,
  prateleira e vitrine na vigência plena do IBS/CBS a partir de 2027?
- **Excedente dos 15% de gorjeta — não fecha.** As três normas (LC 214 art. 274; Res. CGIBS 6 art.
  399; Decreto 12.955 art. 399) condicionam a exclusão a "não exceda a 15%", e **nenhuma** diz o que
  ocorre quando excede. Pergunta sem resposta: excedendo o teto, entra na base a gorjeta **inteira**
  ou apenas a **parcela acima** dos 15%? E ela entra na base do regime específico (alíquota reduzida
  em 40%) ou do regime geral? Nada nos textos responde.
- **O § 3º do art. 399 dos regulamentos — não fecha.** A fórmula que ele enuncia ("relação entre o
  valor do fornecimento (...) sujeitos ao regime específico e o valor total da operação") não é a
  comparação do teto de 15% da lei. Pergunta sem resposta: o § 3º define o denominador do teto de
  15%, define o rateio da gorjeta entre regime específico e geral, ou é outra coisa? Não existe, nos
  textos abertos, exemplo numérico oficial.
- **Ponte CLT ↔ IBS/CBS — não fecha por fonte.** Pergunta sem resposta: existe solução de consulta,
  parecer ou perguntas-e-respostas oficial do CGIBS/RFB dizendo que a "gorjeta" do art. 274 abrange a
  taxa de serviço compulsória lançada na conta?
- **Como a gorjeta é segregada no documento fiscal — não pesquisado.** Os regulamentos exigem
  segregação (art. 399, § 2º), mas não localizei qual campo/tag da NT 2025.002 ou da NFC-e recebe a
  gorjeta. Pergunta sem resposta: existe campo próprio, ou ela cai em `vOutro` / item de serviço?
  Não busquei no leiaute — é passo de pesquisa próprio.
- **Como o DANFE/NFC-e imprime IBS e CBS ao consumidor — não pesquisado.** É o que determina se o
  consumidor vê o tributo como linha somada ou como nota de pé. O Anexo II do MOC (especificações do
  DANFE) não foi aberto neste passo.
- **Corpo do Ato Conjunto RFB/CGIBS nº 2, de 27/05/2026 — PDF aberto, texto não extraído.** O
  `pdftotext` devolveu apenas a página de assinatura. Pergunta sem resposta: a primeira etapa do
  split payment já tem data e escopo fixados nesse ato?
- `URL não verificada — https://www.senado.leg.br/atividade/const/con1988/CON1988_05.10.1988/art_156A_.asp — HTTP 301 para normas.leg.br, que é SPA e não devolveu texto`. Substituída por planalto.gov.br/ccivil_03/constituicao/constituicao.htm, que abriu.
- `URL não verificada — https://normas.leg.br/?urn=urn:lex:br:federal:constituicao:1988-10-05;1988 — HTTP 200, SPA sem conteúdo`.
- `URL não verificada — https://normas.leg.br/api/norma?urn=urn:lex:br:federal:lei:2017-03-13;13419 — HTTP 404`.
- `URL não verificada — https://www.lexml.gov.br/urn/urn:lex:br:federal:lei:2017-03-13;13419 — HTTP 200, só metadado`.
- `URL não verificada — https://legislacao.presidencia.gov.br/atos/?tipo=LEI&numero=13419&ano=2017 — HTTP 200 com escudo antibot, nenhum texto`.
- `URL não verificada — https://www.in.gov.br/materia/-/asset_publisher/Kujrw0TZC2Mb/content/id/20268570/... — HTTP 403`.
- `URL não verificada — https://www2.camara.leg.br/legin/fed/lei/2017/lei-13419-13-marco-2017-784463-norma-pl.html (e a variante -publicacaooriginal-) — HTTP 404`.
- `URL não verificada — https://www.cgibs.gov.br/portarias-conjuntas e https://www.cgibs.gov.br/legislacao — HTTP 404`.
- **Correção operacional ao dossiê anterior:** `planalto.gov.br` **funciona** deste ambiente quando se
  usa `curl --http1.1` (a LC 214/2025 tem 5,4 MB e baixou inteira; a Constituição, 1,8 MB). O mesmo
  vale para `cgibs.gov.br`: com HTTP/2 a conexão é fechada pela outra ponta; com `--http1.1` o
  download conclui. `nfe.fazenda.gov.br/portal/exibirArquivo.aspx` exige cookie de sessão obtido na
  página de listagem.

## O QUE ESTÁ SUJEITO A MUDAR

- **A Nota Técnica é o item mais volátil deste adendo.** A NT 2025.002-RTC teve pelo menos 12 versões
  publicadas até 2026-08-04 (1.30, 1.31, 1.32, 1.33, 1.34, 1.35, 1.36, 1.40, 1.50, 1.51 constam da
  listagem oficial). Ela mesma avisa: "esta NT será ajustada ao longo do seu processo de execução".
  Cada versão precisa de novo ato técnico conjunto para valer.
- **"Implementação Futura" não é data.** As regras que somam IBS/CBS ao total do item (VB01-10,
  VB01-20) e as do total do documento (W60-05, W60-10) carregam essa marca. Elas dizem o que **vai**
  valer, não o que o autorizador exige hoje. A exceção de 2025–2026 pode ser prorrogada.
- **A "Exceção 1: Em 2025 e 2026" é o corte de data.** Se ela cair sem prorrogação, o cálculo
  tributário entra no total do item — e no caminho crítico do caixa — em 2027-01-01.
- **Os regulamentos vão além da lei no art. 399.** § 2º, § 3º e § 4º não têm correspondente na LC
  214/2025, art. 274. Regra infralegal que amplia condição de exclusão de base é candidata natural a
  questionamento e a alteração.
- **A Lei 12.741/2012 está desatualizada** em relação ao IBS/CBS: a lista do art. 1º, § 5º, ainda cita
  ICMS, ISS, IPI, IOF, PIS e COFINS. Alguma norma vai ter de reconciliar isso antes de 2033.
- **A gorjeta pode ser afetada por outra via:** o Imposto Seletivo, que começa em 2027, atinge bebidas
  alcoólicas e açucaradas, e a segregação exigida no art. 398 dos regulamentos ganha uma terceira
  dimensão.
- **A LC 214/2025 já foi alterada pela LC 227/2026** e o texto consolidado no planalto traz marcações
  "(Incluído pela Lei Complementar nº 227, de 2026)" em vários dispositivos. O art. 12 e o art. 274,
  nas versões que li em 2026-08-22, **não** trazem essa marcação.

## PERGUNTAS AO HUMANO

1. **O horizonte é 2026 ou 2027?** Em 2026 o tributo é destaque informativo e não toca o total; para
   2027 a regra escrita já manda somar IBS/CBS/IS ao total do item. A norma dá as duas respostas, uma
   por ano — os "dois produtos diferentes" do brief são duas fases, não uma dúvida.
2. **Quem responde as três lacunas de gorjeta?** Excedente dos 15%, sentido do § 3º e taxa de serviço
   compulsória são interpretação tributária, não pesquisa documental: os textos foram lidos e não
   respondem. Exige contador ou tributarista, não outra rodada de pesquisa.
3. **Vale um passo de pesquisa só sobre leiaute?** Em que tag a gorjeta é segregada, e como o
   DANFE/NFC-e imprime IBS/CBS ao consumidor. As duas afetam o que o PDV lança como linha.
4. **Aceita reconferência periódica da Nota Técnica?** É ela, não a lei, que define se o tributo soma
   ao total, e mudou 12 vezes em 2026.

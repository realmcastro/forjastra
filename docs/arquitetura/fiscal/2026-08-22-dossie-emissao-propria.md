# Dossiê — emissão própria de documento fiscal (Brasil)

> **ESTE DOSSIÊ É DATADO E EXPIRA.** Reflete o estado verificado em **2026-08-22**. Layout de
> documento fiscal muda por **nota técnica**, e o regime tributário está em transição (IBS/CBS).
> Cada nota técnica nova, cada versão nova de NT citada aqui e cada mudança de regime **invalidam**
> o bloco correspondente: refaça a pesquisa antes de decidir. Não é spec, não é decisão, não contém
> regra de negócio da Forja. Cada bloco traz a URL efetivamente aberta; o que não teve fonte está
> em `## LACUNAS`. Campos compactados em 4 linhas por bloco para caber no teto de 400 linhas —
> nenhum link foi cortado.

## Resumo

- **Documento** (§1): NFC-e mod. 65 para venda presencial ou entrega a domicílio; venda pela
  internet exige NF-e mod. 55; serviço sob ISS é NFS-e municipal; CF-e-SAT (SP) e CF-e/MFE (CE) já
  vedados.
- **Certificado** (§2): ICP-Brasil A1 ou A3 do emitente, um por cliente, validades independentes.
  Alternativa oficial: PAA — provedor homologado pelo ENCAT assina em nome do emitente.
- **Layout** (§3): versionado por nota técnica com cronograma próprio; tabela de domínio vem por informe técnico. NT vigente da NF-e/NFC-e para a reforma: 2025.002 v1.51 (2026-08-04).
- **Transmissão** (§4): XMLDSig RSA+SHA-1; resposta com `cStat`, protocolo e data UTC; autorizado /
  rejeitado / denegado, e na NFC-e a denegação foi eliminada; NFC-e é síncrona, lote de uma nota.
- **Contingência** (§5), o item mais pesado do PDV: off-line `tpEmis=9`, transmissão até o fim do
  primeiro dia útil seguinte, segunda via impressa ou guarda eletrônica com termo prévio,
  regularização binária inutilizar/cancelar; mais EPEC (bloqueio em 168 h) e SVC.
- **Prazos** (§6, §7, §9): inutilizar até o dia 10 do mês seguinte; cancelar NFC-e em 30 min (por substituição 168 h), NF-e em 24 h; IBS/CBS obrigatório em produção para CRT 3 desde 2026-08-03.
---

## 1. Quais documentos, e em que situação

### 1.1 A NFC-e modelo 65 é o documento de venda presencial ou com entrega a domicílio a consumidor final, e sua validade jurídica vem da assinatura digital do emitente somada à autorização de uso pela SEFAZ.
FONTE: https://www.confaz.fazenda.gov.br/legislacao/ajustes/2016/AJ_019_16
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: confirmada (Ajuste SINIEF 19/16 + MOC 7.0 Visão Geral)
VÁLIDO PARA: Ajuste SINIEF 19/16, vigente em 2026-08-22 · MUDA? não

### 1.2 O fornecimento de alimentação e bebidas em bares, restaurantes e estabelecimentos similares é, por lei complementar, operação de circulação de mercadoria — não prestação de serviço.
FONTE: https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp87.htm
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: fonte única oficial
VÁLIDO PARA: LC 87/1996, art. 2º, I · MUDA? provável (transição IBS/CBS)

### 1.3 A NFC-e só aceita `indPres` = 1 (presencial) ou 4 (entrega a domicílio) — operação não presencial pela internet, teleatendimento ou "outros" é rejeitada (erro 717) e exige NF-e modelo 55; e a entrega a domicílio é parametrizável por UF, que pode recusá-la (erro 785).
FONTE: https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-anexo-i-leiaute-e-rv.pdf
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: fonte única oficial
VÁLIDO PARA: MOC 7.0 Anexo I, campo B25b e RV B25b-10/20/30 · MUDA? provável

### 1.4 Em São Paulo, a emissão de CF-e-SAT está vedada a partir de 2026-01-01, e a ativação de novos equipamentos SAT já havia sido vedada em 2024-11-01.
FONTE: https://legislacao.fazenda.sp.gov.br/Paginas/Portaria-SRE-79-de-2024.aspx
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: fonte única oficial
VÁLIDO PARA: Portaria SRE-79/2024, arts. 34-C e 34-D da Portaria CAT 147/2012 · MUDA? não

### 1.5 No Ceará, a emissão de CF-e por Módulo Fiscal Eletrônico está vedada a partir de 2026-01-01; até então o CF-e era facultativo e o MFE seguia admitido como alternativa de contingência da NFC-e, ao lado da NFC-e off-line.
FONTE: https://sefazlegis.sefaz.ce.gov.br/api/openFile?id=8ede79ea-72c0-44bd-aeee-9a7d0d5b9428
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: fonte única oficial
VÁLIDO PARA: Decreto CE 36.417/2025, arts. 71-A, 76-A, 83 e 84 · MUDA? não

### 1.6 A NFS-e de padrão nacional é obrigatória para o MEI desde 2023-09-01 na prestação a pessoa jurídica; a adesão dos municípios é voluntária e sem prazo; e município com sistema próprio **não** gera a NFS-e no ambiente dele para depois compartilhar — gera direto no Ambiente de Dados Nacional (ADN) por API e depois recupera o documento.
FONTE: https://www.gov.br/nfse/pt-br/biblioteca/copy_of_perguntas-frequentes/copy_of_faq-nfs-e
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: fonte única oficial
VÁLIDO PARA: FAQ oficial da NFS-e consultado em 2026-08-22 · MUDA? provável

---

## 2. Certificado digital e quem responde por ele

### 2.1 O certificado do sistema NF-e/NFC-e é emitido por AC credenciada na ICP-Brasil, tipo A1 ou A3, com o CNPJ do titular no campo OtherName OID 2.16.76.1.3.3 (ou CPF em OID equivalente); o certificado que assina a mensagem precisa ter "uso da chave" para assinatura digital, e o que identifica o aplicativo na conexão com o webservice é função distinta.
FONTE: https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-visao-geral.pdf
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: fonte única oficial
VÁLIDO PARA: MOC 7.0 Visão Geral, item 4.2.3 · MUDA? provável

### 2.2 O A1 tem validade de 1 ano e é guardado em arquivo, replicável por cópia de segurança; o A3 tem validade de até 5 anos em mídia criptográfica que precisa estar conectada a cada uso, e a perda da mídia é perda do certificado; há também certificado em nuvem, que exige autorização por dispositivo a cada uso.
FONTE: https://www.gov.br/pt-br/servicos/obter-certificacao-digital
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: fonte única oficial
VÁLIDO PARA: carta de serviços oficial consultada em 2026-08-22 · MUDA? provável

### 2.3 Existe modelo nacional em que um Provedor de Assinatura e Autorização (PAA) assina e solicita autorização em nome do emitente, instituído pelo Ajuste SINIEF 9/22 e especificado na NT 2026.001 v1.02b, com implantação em produção escalonada até 2026-10-05.
FONTE: https://www.nfe.fazenda.gov.br/portal/exibirArquivo.aspx?conteudo=AlgHfV6gpAU%3D
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: confirmada (NT no Portal Nacional da NF-e + ratificação no Ato Técnico Conjunto RFB/CGIBS nº 1/2026)
VÁLIDO PARA: NT 2026.001 v1.02b, publicada em 2026-07-31 · MUDA? provável

### 2.4 No PAA a responsabilidade legal e tributária permanece do emitente (o PAA é intermediário técnico e não assume autoria fiscal); o PAA precisa ser homologado pela Coordenação do ENCAT, assina o DF-e com certificado ICP-Brasil próprio **e** assina o atributo `Id` com par de chaves RSA gerado pela Plataforma de Emissão Simplificada para cada relação PAA–emitente; o vínculo nasce e morre no portal da SVRS, por comando de qualquer das partes, com efeito imediato; o público-alvo declarado é MEI, produtor rural e optantes do Simples.
FONTE: https://www.nfe.fazenda.gov.br/portal/exibirArquivo.aspx?conteudo=AlgHfV6gpAU%3D
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: fonte única oficial
VÁLIDO PARA: NT 2026.001 v1.02b, Introdução e itens 1 a 4 · MUDA? provável

### 2.5 Em sistema emissor de desenvolvimento próprio o responsável técnico é o próprio contribuinte; onde a UF exige credenciamento de software emissor pode ser exigido o Código de Segurança do Responsável Técnico, cujo hash (SHA-1 sobre o código concatenado à chave de acesso) vai no XML, e a empresa desenvolvedora pode ter no máximo 5 códigos válidos por UF.
FONTE: https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-visao-geral.pdf
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: fonte única oficial
VÁLIDO PARA: MOC 7.0 Visão Geral, item 2.2.10 · MUDA? provável

---

## 3. Layout, versão e como a mudança é anunciada

### 3.1 A documentação técnica dos DF-e aplicável a IBS e CBS é aprovada e ratificada por ato técnico conjunto RFB/CGIBS, que nomeia NT e versão por modelo: para NF-e 55 e NFC-e 65, aprova NT 2026.002 v1.10, NT 2025.002 v1.51 e NT 2026.007 v1.00, e ratifica NT 2025.002-RTC v1.40 e v1.50 e NT 2026.001 v1.02b; para NFS-e, ratifica NT SE/CGNFS-e nº 009 v1.0 e nº 008 v1.02.
FONTE: https://www.cgibs.gov.br/upload/arquivos/202608/01153321-am-ato-tecnico-conjunto-rfb-e-cgibs-ratificacao-nts-dfes-revisao-assinado.pdf
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: confirmada (ato no portal do CGIBS + listagem do Portal Nacional da NF-e)
VÁLIDO PARA: Ato Técnico Conjunto RFB/CGIBS nº 1, de 2026-07-31 · MUDA? provável

### 3.2 A lista oficial de notas técnicas vigentes da NF-e/NFC-e é publicada no Portal Nacional, e em 2026-08-22 traz, entre outras: NT 2025.002 v1.51 (reforma, 2026-08-04), NT 2026.007 v1.00 (validação de cadastro LCC-RFB/CCC, 2026-08-04), NT 2014.001 v1.41 (EPEC, 2026-08-04), NT 2026.001 v1.02b (PAA, 2026-07-31) e NT 2026.004 v1.01 (CNPJ alfanumérico, 2026-06-08).
FONTE: https://www.nfe.fazenda.gov.br/portal/listaConteudo.aspx?tipoConteudo=04BIflQt1aY=
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: confirmada (Portal Nacional da NF-e + portal DF-e da SVRS, que lista a mesma versão da NT 2025.002)
VÁLIDO PARA: listagem consultada em 2026-08-22 · MUDA? sim

### 3.3 Cada versão de NT traz um histórico com duas datas por item, homologação e produção, e a homologação pode variar por UF dentro da janela; o intervalo entre publicação e obrigatoriedade não é fixo — na NT 2025.002 há itens com cerca de 2 meses (2025-07→2025-10), itens de poucos dias, e itens marcados "implementação futura" sem data.
FONTE: https://www.nfe.fazenda.gov.br/portal/exibirArquivo.aspx?conteudo=AKD%2FmuSmiIY%3D
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: fonte única oficial
VÁLIDO PARA: NT 2025.002-RTC v1.51, "Histórico de Alterações / Cronograma" · MUDA? sim

### 3.4 Tabela de domínio (classificação tributária do IBS/CBS, indicadores de CST, alíquotas de CBS, NCM, meios de pagamento) não vem por nota técnica, mas por **informe técnico**, com versionamento próprio — em 2026-08-22 vigem, entre outros, IT 2025.002 v1.60 (2026-06-23) e IT 2026.002 v1.00 (2026-05-12).
FONTE: https://www.nfe.fazenda.gov.br/portal/listaConteudo.aspx?tipoConteudo=hXzemuyNHW4=
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: fonte única oficial
VÁLIDO PARA: listagem consultada em 2026-08-22 · MUDA? sim

### 3.5 O portal DF-e da SVRS publica, para NFC-e, o MOC 7.00 e seus anexos, a NT 2025.002 v1.51 (01/08/2026), esquemas XML por NT, a tabela de classificação tributária da reforma (22/06/2026) e a relação de serviços web.
FONTE: https://dfe-portal.svrs.rs.gov.br/NFCE/Documentos
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: fonte única oficial
VÁLIDO PARA: portal consultado em 2026-08-22 · MUDA? sim

---

## 4. Assinatura, transmissão e o que a autorização devolve

### 4.1 O documento é XML assinado com XML Signature, certificado X509 ICP-Brasil A1 ou A3, RSA para a assinatura e SHA-1 para o digest, com a tag `Signature` declarando o próprio namespace.
FONTE: https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-visao-geral.pdf
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: fonte única oficial
VÁLIDO PARA: MOC 7.0 Visão Geral, item 4.2.4 e Tabela 4-2 · MUDA? provável

### 4.2 Na NFC-e a requisição assíncrona foi eliminada: o lote só pode conter uma NFC-e, e lote com mais de uma é rejeitado (códigos 126 e 961).
FONTE: https://www.nfe.fazenda.gov.br/portal/exibirArquivo.aspx?conteudo=T3QyeMfpios%3D
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: fonte única oficial
VÁLIDO PARA: NT 2023.002 v1.01, itens 2 e 3.1; produção desde 2023-09-04 · MUDA? não

### 4.3 A validação termina em rejeição (descartado, corrigível, não gravado), autorização de uso (gravado, com ou sem avisos) ou denegação de uso (gravado, uso vedado, por irregularidade fiscal); e a denegação foi **excluída da NFC-e** pelo Ajuste SINIEF 10/2023 — irregularidade do emitente passa a ser rejeição (781).
FONTE: https://www.nfe.fazenda.gov.br/portal/exibirArquivo.aspx?conteudo=T3QyeMfpios%3D
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: confirmada (NT 2023.002 v1.01 + MOC 7.0 Visão Geral, item 5.1.6)
VÁLIDO PARA: NT 2023.002 v1.01, item 6 · MUDA? não

### 4.4 A resposta traz ambiente (1 produção / 2 homologação), `cStat`, `xMotivo`, UF, `dhRecbto` em UTC e, quando autorizada ou denegada, o número de protocolo; `cStat` 100 é autorizado, 150 autorizado fora de prazo, 110 denegado, 101 cancelado, 102 inutilização homologada.
FONTE: https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-visao-geral.pdf
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: confirmada (MOC 7.0 Visão Geral + MOC 7.0 Anexo I, tabela de mensagens)
VÁLIDO PARA: MOC 7.0 Visão Geral, itens 4.3.5, 5.1.6, 5.3 e 5.4 · MUDA? provável

### 4.5 Os serviços web da NFC-e, versão 4.00, são NFeAutorizacao, NFeRetAutorizacao, NFeInutilizacao, NFeConsultaProtocolo, NFeStatusServico e RecepcaoEvento, com URL distinta por UF autorizadora e por ambiente, além da SVRS.
FONTE: https://dfe-portal.svrs.rs.gov.br/NFCE/Servicos
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: fonte única oficial
VÁLIDO PARA: relação de serviços web consultada em 2026-08-22 · MUDA? sim

### 4.6 O DANFE NFC-e carrega QR Code cuja URL é montada por UF e inclui chave de acesso, versão, ambiente, identificador do Código de Segurança do Contribuinte e um hash; esse código é conhecido só pelo contribuinte e pelo fisco da UF.
FONTE: https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-anexo-i-leiaute-e-rv.pdf
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: fonte única oficial
VÁLIDO PARA: MOC 7.0 Anexo I, campo ZX02 e item 3.3 · MUDA? provável

---

## 5. Contingência — o item mais importante para PDV

### 5.1 A NFC-e admite contingência off-line: o contribuinte gera, assina e imprime o DANFE **sem autorização prévia** e transmite depois, com prazo até o final do primeiro dia útil subsequente à emissão; o nível de serviço acordado para autorização pelos estados é inferior a 30 segundos em 85% do tempo.
FONTE: https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-anexo-iv-manual-contingencia-nfc-e.pdf
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: confirmada (MOC 7.0 Anexo IV + Decreto CE 36.417/2025, art. 83, II, que remete ao mesmo anexo)
VÁLIDO PARA: MOC 7.0 Anexo IV, itens 2 e 4 · MUDA? provável

### 5.2 Permitir contingência off-line é decisão exclusiva da UF, que pode negá-la a todos ou a certos contribuintes e pode admitir outras formas; ela **não** vale para a NF-e modelo 55 em nenhuma hipótese. Entrar em contingência é decisão do contribuinte, sem autorização prévia do fisco e sem termo no livro modelo 6 — mas o fisco pode pedir esclarecimento e restringir quem contingencia em demasia sem justificativa.
FONTE: https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-anexo-iv-manual-contingencia-nfc-e.pdf
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: fonte única oficial
VÁLIDO PARA: MOC 7.0 Anexo IV, item 2 · MUDA? provável

### 5.3 Em contingência off-line o XML exige `tpEmis=9`, `dhCont` e `xJust`, com `mod=65`, `idDest=1`, `finNFe=1`, `indFinal=1`, `indPres=1`; o DANFE precisa trazer "EMITIDA EM CONTINGÊNCIA"; o QR Code passa a carregar data e hora de emissão para que a consulta do consumidor informe a contingência e o prazo máximo para o documento constar na base do fisco.
FONTE: https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-anexo-iv-manual-contingencia-nfc-e.pdf
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: fonte única oficial
VÁLIDO PARA: MOC 7.0 Anexo IV, itens 3 e 4 · MUDA? provável

### 5.4 Em contingência off-line é obrigatório imprimir o Detalhe da Venda e uma segunda via do DANFE identificada "Via do Estabelecimento", que fica à disposição do fisco até a nota ser autorizada; a alternativa é a guarda eletrônica do XML, que exige termo prévio no livro modelo 6 (ou declaração conforme a UF) assumindo responsabilidade integral pela guarda. A UF pode dispensar a segunda via.
FONTE: https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-anexo-iv-manual-contingencia-nfc-e.pdf
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: fonte única oficial
VÁLIDO PARA: MOC 7.0 Anexo IV, item 4 · MUDA? provável

### 5.5 É **vedado** reutilizar em contingência número de NFC-e já transmitida com `tpEmis` normal, e o manual recomenda avançar um número ao entrar em contingência; a chave de acesso e o `cNF` originais devem ser mantidos na transmissão posterior; a regularização da nota pendente é binária — **inutilizar** se não foi autorizada, **cancelar** se foi; nota em contingência que for rejeitada é gerada de novo com a mesma numeração e série, sanada a irregularidade.
FONTE: https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-anexo-iv-manual-contingencia-nfc-e.pdf
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: confirmada (MOC 7.0 Anexo IV + Ajuste SINIEF 19/16, cláusula décima segunda)
VÁLIDO PARA: MOC 7.0 Anexo IV, itens 3 e 5 · MUDA? provável

### 5.6 As demais modalidades são EPEC (`tpEmis=4`, evento prévio ao Ambiente Nacional com leiaute mínimo), SVC (`tpEmis=6` ou `7`, ambiente virtual que **só opera quando a SEFAZ de origem o ativa**) e FS-DA (`tpEmis=5`, com impressão em formulário de segurança).
FONTE: https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-anexo-iii-manual-contingencia-nf-e.pdf
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: confirmada (MOC 7.0 Anexo III + NT 2014.001 v1.41)
VÁLIDO PARA: MOC 7.0 Anexo III, itens 2.1.2 a 2.1.4 · MUDA? provável

### 5.7 Na SVC o serviço de inutilização de numeração não é oferecido, e o cancelamento só alcança documentos autorizados pela própria SVC — não há cancelamento cruzado entre o ambiente normal e a SVC.
FONTE: https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-anexo-iii-manual-contingencia-nf-e.pdf
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: fonte única oficial
VÁLIDO PARA: MOC 7.0 Anexo III, item 2.1.3.4 · MUDA? provável

### 5.8 EPEC pendente de conciliação por mais de 168 horas (7 dias) bloqueia o ambiente EPEC para aquele emitente, que deixa de conseguir novos EPEC até regularizar; as vias do DANFE impresso em EPEC devem ser mantidas em arquivo pelo emitente e pelo destinatário pelo prazo da legislação tributária.
FONTE: https://www.nfe.fazenda.gov.br/portal/exibirArquivo.aspx?conteudo=9hgG%2B%2BcH8gA%3D
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: fonte única oficial
VÁLIDO PARA: NT 2014.001 v1.41, publicada em 2026-08-04, itens 3.1a e 4.2 · MUDA? provável

---

## 6. Numeração, série e inutilização

### 6.1 A numeração da NFC-e vai de 1 a 999.999.999, sequencial por estabelecimento e por série; série em algarismo arábico crescente, subsérie vedada.
FONTE: https://www.confaz.fazenda.gov.br/legislacao/ajustes/2016/AJ_019_16
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: fonte única oficial
VÁLIDO PARA: Ajuste SINIEF 19/16, cláusula quarta · MUDA? não

### 6.2 A faixa de série depende do processo de emissão — 000–889 para aplicativo do próprio contribuinte assinando com e-CNPJ do emitente, 890–899 nota avulsa da SEFAZ, 900–919 emissão em site da SEFAZ, 920–969 emitente CPF com aplicativo próprio, 970–989 reservadas ao PAA — e a série existe justamente para o mesmo emitente usar software próprio e um ou mais PAA sem colidir número.
FONTE: https://www.nfe.fazenda.gov.br/portal/exibirArquivo.aspx?conteudo=AlgHfV6gpAU%3D
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: confirmada (NT 2026.001 v1.02b + MOC 7.0 Visão Geral, tabela equivalente)
VÁLIDO PARA: NT 2026.001 v1.02b, item 5 · MUDA? provável

### 6.3 Número sequencial não utilizado deve ter a inutilização pedida até o dia 10 do mês seguinte, para não deixar quebra na sequência.
FONTE: https://www.confaz.fazenda.gov.br/legislacao/ajustes/2016/AJ_019_16
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: fonte única oficial
VÁLIDO PARA: Ajuste SINIEF 19/16, cláusula décima sexta · MUDA? não

### 6.4 O pedido de inutilização informa ano e faixa (número inicial e final) e justificativa de 15 a 255 caracteres, é assinado digitalmente, devolve protocolo próprio na homologação (`cStat` 102), e é rejeitado se existir EPEC autorizado para a faixa pedida.
FONTE: https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-visao-geral.pdf
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: confirmada (MOC 7.0 Visão Geral + NT 2014.001 v1.41)
VÁLIDO PARA: MOC 7.0 Visão Geral, itens 3.3.15 e 5.3 · MUDA? provável

---

## 7. Cancelamento e retificação

### 7.1 O cancelamento da NFC-e exige que não tenha havido saída da mercadoria e prazo **não superior a 30 minutos** contado da autorização de uso, redutível a critério da UF; o prazo anterior era de 24 horas e foi alterado pelo Ajuste SINIEF 7/18.
FONTE: https://www.confaz.fazenda.gov.br/legislacao/ajustes/2016/AJ_019_16
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: fonte única oficial
VÁLIDO PARA: Ajuste SINIEF 19/16, cláusula décima quinta · MUDA? provável

### 7.2 Existe cancelamento por substituição para o caso de duplicidade: se uma NFC-e foi autorizada sem que a resposta chegasse e outra foi emitida em contingência para a mesma operação, cancela-se a que não acobertou a operação em prazo **não superior a 168 horas**, referenciando a substituta — e a validação exige que a substituta seja de contingência e tenha valor, ICMS, destinatário e itens idênticos.
FONTE: https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-visao-geral.pdf
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: confirmada (MOC 7.0 Visão Geral + Ajuste SINIEF 19/16)
VÁLIDO PARA: MOC 7.0 Visão Geral, itens 3.5 e 5.9.3, citando a cláusula décima quinta-A do Ajuste SINIEF 19/16 · MUDA? provável

### 7.3 O cancelamento da NF-e modelo 55 tem prazo não superior a **24 horas** da autorização de uso e exige que não tenha circulado a mercadoria; casos excepcionais dependem de critério da UF.
FONTE: https://www.confaz.fazenda.gov.br/legislacao/ajustes/2005/AJ007_05
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: fonte única oficial
VÁLIDO PARA: Ajuste SINIEF 7/05, cláusula décima segunda · MUDA? provável

### 7.4 O cancelamento fora de prazo pode ser homologado na NF-e com status 155; na NFC-e o pedido fora de prazo é **rejeitado** com o erro 501.
FONTE: https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-visao-geral.pdf
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: fonte única oficial
VÁLIDO PARA: MOC 7.0 Visão Geral, item 5.9.4 · MUDA? provável

### 7.5 A carta de correção eletrônica (evento 110110) só existe se houver documento autorizado, é vedada para corrigir as variáveis que determinam o valor do imposto (base de cálculo, alíquota, diferença de preço, quantidade, valor da operação), dados cadastrais que impliquem mudança de remetente ou destinatário e data de emissão ou de saída; e uma nova carta **substitui** a anterior, precisando conter todas as correções.
FONTE: https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-visao-geral.pdf
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: confirmada (MOC 7.0 Visão Geral + Ajuste SINIEF 7/05, cláusula décima quarta-A)
VÁLIDO PARA: MOC 7.0 Visão Geral, item 5.10, citando o § 1º-A do art. 7º do Convênio SINIEF s/n de 1970 · MUDA? provável

---

## 8. Homologação e produção

### 8.1 As SEFAZ mantêm dois ambientes: homologação, para teste e integração durante a implementação **e sempre que o sistema sofrer alteração depois de já estar em operação**, e produção, cuja autorização tem o efeito de permitir que o XML seja usado como documento fiscal; o uso de qualquer dos dois depende de credenciamento prévio na SEFAZ da UF, e teste feito em produção por falha da aplicação pode disparar controles de uso indevido com bloqueio de serviços.
FONTE: https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-visao-geral.pdf
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: fonte única oficial
VÁLIDO PARA: MOC 7.0 Visão Geral, itens 4.3.7 e 4.3.8 · MUDA? provável

### 8.2 Em homologação a descrição do primeiro item deve trazer o literal "NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL", sob pena de rejeição.
FONTE: https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-anexo-i-leiaute-e-rv.pdf
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: fonte única oficial
VÁLIDO PARA: MOC 7.0 Anexo I, RV sobre `xProd` com `tpAmb=2` · MUDA? provável

### 8.3 Há ambiente de homologação/produção restrita também para a NFS-e nacional, com acesso solicitado pelo município aderente e documentação técnica própria (guias, NT SE/CGNFS-e, anexos de DPS, esquemas XSD).
FONTE: https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica/producao-restrita
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: confirmada (página de produção restrita + FAQ oficial da NFS-e)
VÁLIDO PARA: página consultada em 2026-08-22 · MUDA? sim

### 8.4 A biblioteca de documentação técnica da NFS-e separa produção, homologação, APIs, RTC e leiautes antigos (julho/2022 a 2025-09-28), e adverte que parte é minuta a ser homologada pelo CGNFS-e quando instalado.
FONTE: https://www.gov.br/nfse/pt-br/biblioteca/documentacao-tecnica
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: fonte única oficial
VÁLIDO PARA: página consultada em 2026-08-22 · MUDA? sim

---

## 9. O que IBS/CBS já exige dos documentos fiscais

### 9.1 A obrigação de adaptar os sistemas autorizadores de DF-e a leiaute padronizado que permita informar IBS, CBS e IS está na LC 214/2025, art. 62 das disposições transitórias; a NT 2025.002-RTC implementa isso na NF-e e NFC-e, substituindo a NT 2024.002, e os grupos/campos novos incluem o grupo **UB** (IBS, CBS e IS, com subgrupos de diferimento, redução de alíquota e monofásica), **W03** (totais de IBS/CBS/IS), **VB** (total do item), **VC** (referenciamento de item de outro DF-e), **BB** (compras governamentais), **BC** (antecipação de pagamento), mais `cIndOp` e o código de classificação tributária.
FONTE: https://www.nfe.fazenda.gov.br/portal/exibirArquivo.aspx?conteudo=AKD%2FmuSmiIY%3D
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: fonte única oficial
VÁLIDO PARA: NT 2025.002-RTC v1.51, itens 1 a 6 · MUDA? sim

### 9.2 O cronograma da NT 2025.002 v1.51 diz que, em produção, o preenchimento dos campos IBS/CBS é obrigatório para emitente CRT 3 (regime normal) a partir de 2026-08-03 e para CRT 1, 2 e 4 (Simples e MEI) a partir de 2027-01-04; **ressalva de leitura:** no texto da regra de validação UB12-10 dessa mesma versão as observações datadas convivem com uma observação "implementação futura para produção", e o documento não deixa inequívoco qual prevalece.
FONTE: https://www.nfe.fazenda.gov.br/portal/exibirArquivo.aspx?conteudo=AKD%2FmuSmiIY%3D
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: fonte única oficial, com ambiguidade declarada (ver LACUNAS)
VÁLIDO PARA: NT 2025.002-RTC v1.51, "Detalhamento do Cronograma" e RV UB12-10 · MUDA? sim

### 9.3 A NT registra que, mesmo quando a regra de validação não exige o preenchimento, ele "permanece obrigatório conforme a legislação vigente", que as informações dos novos tributos têm valor jurídico a partir de 2026-01-01, e que as orientações para CRT 1, 2 e 4 e para monofásica ficaram para NT futura porque a tributação desses contribuintes só começa em 2027 (art. 348 da LC 214/25).
FONTE: https://www.nfe.fazenda.gov.br/portal/exibirArquivo.aspx?conteudo=AKD%2FmuSmiIY%3D
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: fonte única oficial
VÁLIDO PARA: NT 2025.002-RTC v1.51, "Detalhamento do Cronograma" e nota final · MUDA? sim

### 9.4 Nas notas fiscais de serviço o destaque de IBS/CBS entra por ondas: 2026-10-01 para serviços da lista da LC 116 não abrangidos nas demais faixas; 2026-12-01 para plataformas digitais, intermediação, subitens 1.03/1.05/1.09 e 16.01, bens imateriais fora da lista e locações; 2027-01-01 para optantes do Simples que fizeram a opção em setembro de 2026. E a ausência ou omissão dessas informações na NFS-e **até 2026-12-31 não acarreta rejeição** do documento, embora possa gerar sanção.
FONTE: https://www.gov.br/nfse/pt-br/noticias/cgnfs-e-orienta-sobre-os-prazos-para%20destaque-de-ibs-cbs-nas-notas-fiscais-de-servico
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: fonte única oficial
VÁLIDO PARA: comunicado da SE/CGNFS-e consultado em 2026-08-22 · MUDA? sim

### 9.5 Além dos atos técnicos, RFB e CGIBS publicam Atos Conjuntos numerados (nº 2 de 2026-05-27; nº 3 de 2026-06-19, sobre DeRE; nº 4 de 2026-07-30; nº 5, sobre Programa Nacional de Conformidade Tributária) — canal separado do de notas técnicas e que também precisa ser acompanhado.
FONTE: https://www.cgibs.gov.br/atos-conjuntos
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: fonte única oficial
VÁLIDO PARA: listagem consultada em 2026-08-22 · MUDA? sim

### 9.6 A página de atos técnicos conjuntos do CGIBS listava, em 2026-08-22, um único ato — o nº 1, de 2026-07-31, de ratificação de notas técnicas de DF-e.
FONTE: https://www.cgibs.gov.br/atos-tecnicos-conjuntos
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: fonte única oficial
VÁLIDO PARA: listagem consultada em 2026-08-22 · MUDA? sim

---

## 10. Obrigação acessória que cai sobre o emissor

### 10.1 O emitente deve manter a NFC-e em arquivo digital, sob sua guarda e responsabilidade, pelo prazo estabelecido na legislação tributária, ainda que fora da empresa, e apresentá-la quando solicitado; a entrega do DANFE impresso pode ser substituída por envio eletrônico, envio da chave de acesso ou consulta em plataforma eletrônica quando o comprador se identifica — mas essa substituição **não vale** para documento emitido em contingência.
FONTE: https://www.confaz.fazenda.gov.br/legislacao/ajustes/2016/AJ_019_16
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: confirmada (Ajuste SINIEF 19/16 + Ajuste SINIEF 7/05, cláusula décima, para a NF-e)
VÁLIDO PARA: Ajuste SINIEF 19/16, cláusulas nona e décima · MUDA? não

### 10.2 Na NF-e, emitente **e** destinatário devem manter o arquivo digital pelo prazo da legislação; o DANFE não substitui o arquivo; destinatário não credenciado que escriture pelo DANFE deve guardá-lo pelo prazo decadencial; e o emissor deve enviar o arquivo digital ao destinatário, por meio eletrônico ou outro que dê acesso, em modalidade acordada entre as partes respeitando o sigilo fiscal.
FONTE: https://www.confaz.fazenda.gov.br/legislacao/arquivo-manuais/moc7-visao-geral.pdf
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: confirmada (MOC 7.0 Visão Geral + Ajuste SINIEF 7/05)
VÁLIDO PARA: MOC 7.0 Visão Geral, itens 6 e 6.1, citando a cláusula décima do Ajuste SINIEF 7/05 · MUDA? provável

### 10.3 A ocorrência de problemas técnicos não exime o contribuinte de emitir a documentação fiscal das suas operações — indisponibilidade não é hipótese de dispensa.
FONTE: https://sefazlegis.sefaz.ce.gov.br/api/openFile?id=8ede79ea-72c0-44bd-aeee-9a7d0d5b9428
TIPO: oficial · ACESSO: 2026-08-22 · CONFIANÇA: fonte única oficial (norma estadual do CE; não verifiquei equivalente em outras UF)
VÁLIDO PARA: Decreto CE 36.417/2025, art. 1º, I (art. 56-A do Decreto CE 35.061/2022) · MUDA? não

---

## LACUNAS

- **Prazo de guarda em número de anos.** Toda fonte oficial aberta diz "prazo estabelecido na
  legislação tributária" ou "prazo decadencial", sem número. Pergunta sem resposta: quantos anos, e
  a partir de que marco, o XML autorizado tem que ser conservado?
- **Ambiguidade da RV UB12-10 (bloco 9.2).** Pergunta sem resposta: em 2026-08-22 a rejeição 1115
  por ausência do grupo IBSCBS está **ativa** em produção para CRT 3, ou diferida como
  "implementação futura"? Há relato secundário de suspensão por ato conjunto, mas o ato que abri
  (RFB/CGIBS nº 1/2026) apenas aprova e ratifica NT — não contém texto de suspensão.
- **Ceará, atos posteriores ao decreto.** URL não verificada —
  https://www.sefaz.ce.gov.br/2025/10/23/migracao-do-mfe-cf-e-para-a-nfc-e/ — certificado TLS
  expirado na ferramenta; forçando o acesso, a página informa que as notícias estão suspensas por
  legislação eleitoral. Li o Decreto 36.417/2025 (bloco 1.5), mas não confirmei os atos de 2025-11
  e 2026-01 citados por fontes secundárias.
- **Certificado digital, fonte normativa.** URL não verificada —
  https://www.gov.br/iti/pt-br/assuntos/certificado-digital — "Conteúdo Restrito", exige
  autenticação; mesma falha em .../certificado-digital/como-obter. O bloco 2.2 se sustenta na carta
  de serviços do gov.br, não no DOC-ICP-04. Pergunta sem resposta: qual o prazo máximo normativo
  por tipo, e há renovação sem nova validação presencial?
- **NFS-e emitida por software de terceiro.** O FAQ aberto responde da ótica do **município**, não
  do **prestador**. Pergunta sem resposta: um prestador (ou o software dele) pode submeter DPS
  diretamente à API do ADN, e com qual credencial ou certificado?
- **Leitura completa das NT.** Da NT 2025.002 v1.51 li cronograma, sumário e a RV UB12-10, não as
  ~95 páginas de campos e regras. Não abri NT 2026.002 v1.10 (DANFE Simplificado Tipo 2), NT
  2026.007 v1.00 (LCC-RFB/CCC) nem NT 2026.004 v1.01 (CNPJ alfanumérico).
- **Vigência do fim da denegação na NFC-e.** O bloco 4.3 vem da NT 2023.002 v1.01. Não confirmei se
  NT posterior reintroduziu denegação na NFC-e.
- **Ciclo de vida do Código de Segurança do Contribuinte.** Nenhuma fonte oficial aberta descreve
  emissão, validade, rotação e revogação. Pergunta sem resposta: quem emite, com que validade, e o
  que acontece com os documentos já emitidos quando ele é trocado?
- **Prazo de contingência off-line por UF.** O MOC diz "final do primeiro dia útil subsequente" e
  "atualmente". Pergunta sem resposta: alguma UF pratica prazo menor?
- **NT SE/CGNFS-e nº 009 e nº 008.** Ratificadas pelo ato conjunto (bloco 3.1), mas não abri os
  PDFs — não afirmo nada sobre o conteúdo delas.

## O QUE ESTÁ SUJEITO A MUDAR

1. **Toda versão de nota técnica.** A NT 2025.002 foi de 1.01 a 1.51 entre 2025 e 2026-08-04; cada
   versão altera campo, regra de validação e cronograma. Este dossiê morre a cada versão nova.
2. **Informes técnicos de tabela** (classificação tributária, alíquota de CBS, NCM, meios de
   pagamento) mudam em cadência própria, mais rápida que as NT.
3. **A obrigatoriedade IBS/CBS em produção**, incluindo se a rejeição por ausência do grupo está
   ativa (9.2) e as datas de Simples/MEI, que dependem de NT futura (9.3).
4. **Regra de UF.** Contingência off-line permitida ou não, entrega a domicílio permitida ou não,
   prazo de cancelamento reduzido, exigência de código de responsável técnico e credenciamento de
   software emissor — tudo é decisão da unidade federada e muda sem NT nacional.
5. **Extinção de modelos estaduais.** SP e CE fecharam CF-e/SAT/MFE em 2026-01-01; outras UF podem
   ter movimentos análogos, ou o inverso (manter alternativa de contingência em hardware).
6. **O modelo PAA.** Instituído em 2022, NT publicada só em 2026, produção escalonada até
   2026-10-05; escopo, público-alvo e regras de credenciamento podem se ampliar.
7. **CNPJ alfanumérico** (NT 2026.004 v1.01, 2026-06-08) altera tipo de campo em todos os leiautes.
8. **MOC 7.0 é de 2020-12-16.** Um MOC 8.0 consolidando as NT posteriores reescreveria a base de
   quase todos os blocos das seções 4 a 8.

## PERGUNTAS AO HUMANO

1. **Em quais UF os primeiros clientes operam?** Metade das regras acima (contingência off-line,
   entrega a domicílio, código de responsável técnico, prazo reduzido de cancelamento,
   credenciamento de software emissor) é decisão de UF; sem a lista, o dossiê não fecha.
2. **A emissão própria inclui NFS-e (serviço/ISS), ou só documento estadual de mercadoria?** São
   dois universos: webservice estadual por UF versus API do ADN nacional com adesão municipal. O
   esforço não é comparável.
3. **Quem guarda o certificado do cliente, e sob que instrumento?** A pergunta é de
   responsabilidade, não técnica: A1 é copiável e vence em 1 ano, A3 exige mídia conectada, nuvem
   exige confirmação por dispositivo — e o emitente segue responsável legal em qualquer arranjo.
4. **O modelo PAA (2.3–2.4) interessa como alternativa, ou está fora?** É o único caminho
   oficialmente desenhado para um terceiro assinar em nome do emitente; exige homologação pelo
   ENCAT e, em 2026-08-22, tem público-alvo declarado (MEI, produtor rural, Simples).
5. **Existe contador ou responsável fiscal de referência para fechar o que ficou em `## LACUNAS`?**
   Sobretudo o prazo de guarda em anos e o estado real da rejeição por ausência de IBS/CBS.

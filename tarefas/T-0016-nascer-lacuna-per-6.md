---
id: T-0016
backlog: F-007
titulo: Fazer nascer LACUNA-PER-6 e dar motivo próprio ao código lido e não resolvido
status: aberta
escopo: cliente=- vertical=- modulo=per camada=produto
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

## PLANO: T-C (T-0016), fazer nascer LACUNA-PER-6 e destravar F-007
BACKLOG: F-007 (o `produto` estende o escopo para incluir o nascimento de `PER-6`, com a régua de edição e citando a ordem do humano de 2026-09-23)
ESCOPO: a regra de núcleo para "identificador lido, válido e ausente do catálogo retido, sem contato"; o motivo próprio na lista fechada; o marco de reconciliação do catálogo retido; as duas listas de captura de `PER`; a resposta sobre registrar o código lido.
FORA DE ESCOPO: `F-005` (mesma `RN-NUC-043`; deixar a alteração pronta para receber o caso dele, sem aplicá-lo); cadastrar item a partir do código recusado; grão da série.
ESCOPO DE MEMÓRIA: cliente=- vertical=- modulo=per camada=produto
DECISÕES ABERTAS QUE TOCAM ISSO: nenhuma.
PASSOS:
1. C.1 `produto`
   - **Brief:** escrever a regra que faz `LACUNA-PER-6` existir e aplicar o `F-007` inteiro na mesma passada (`RN-NUC-043`: enumeração depois não estreita).
   - Registrar o código lido fica **fora** por padrão (falha fechado) até C.2 responder.
   - **Arquivos:** `operacao-offline-e-sincronizacao.md`, `fatos-de-operacao.md`, `fatos-de-operacao-dominios-fechados.md`, `modulos/perifericos.md`, `modulos/perifericos-classes.md`, `docs/backlog/F-007-*.md`.
   - **Entrega:** a regra, o motivo, o marco e as listas.
   - Onda 1, paralelo.
2. C.2 `seguranca`
   - **Brief:** o fato de leitura não resolvida pode carregar o código lido? Em que forma (presença, simbologia, tamanho, valor)? O que passa pelo leitor pode ser documento de pessoa (`RN-OFF-027`).
   - **Entrega:** `docs/auditorias/2026-09-23-codigo-lido-no-fato.md`.
   - Paralelo com C.1. A pergunta já está fechada no item.
3. C.3 `produto`
   - **Brief:** aplicar a resposta de C.2 ao aceite 1 e às listas `Registra` / `Não registra`.
   - **Entrega:** edição pontual.
   - Depende de C.1 e C.2.
GATES: gate 1 (`produto` na fronteira, com o motivo no núcleo e a regra em `PER`); `seguranca` em C.2.
RISCO PRINCIPAL: o motivo novo roubar casos de `published_artifact_missing` (aceite 4), que é o mesmo defeito ao contrário.

## Fechamento — 2026-09-23

ENTREGUE: `LACUNA-PER-6` nasceu como `RN-NUC-063` (renumerada de `057` por colisão), com o motivo
próprio `item_identifier_unresolved`, o marco `published_artifact_version_received`, as duas listas de
`PER` e o degrau 2 do código lido, com a tabela de classe pela GS1 R26. `COD-01` fechado. `F-007`
destravado e com escopo estendido pela frase do humano.
ARQUIVOS: `docs/produto/fatos-de-operacao-dominios-fechados.md`, `fatos-de-operacao.md`,
`operacao-offline-e-sincronizacao.md`, `modulos/perifericos.md`, `modulos/perifericos-classes.md`;
`docs/backlog/F-007-*.md`, `F-018-*.md` (linhas de `PER-6`); `docs/auditorias/2026-09-23-codigo-lido-no-fato.md`;
memória `plataforma/decision-codigo-lido-entra-so-como-gtin-global`,
`modulos/per/gotcha-leitura-de-codigo-e-entrada-de-quem-imprimiu` (área `per` nova no índice de módulos),
`processo/gotcha-numero-de-rn-colide-entre-instancias-paralelas`.
VERIFICAÇÃO: busca por número conferida pelo thread em disco (cada `RN-NUC-056`…`066` aparece uma vez);
faixas GS1 conferidas contra a GenSpecs R26 pela pesquisa; dígito verificador de `7891000315507`
conferido por execução, o de `2001234001502` só à mão. Nada executável: o entregável é spec.
PRONTO:
- Regra de negócio numerada com critério de aceite: sim, `RN-NUC-063`, sete aceites e infelizes (a)–(i).
- Teste: não se aplica ainda (não há código de leitura). Os quatro identificadores de teste estão no item.
- DDL, endpoint, consulta: não se aplica.
- Gate: a consulta de `seguranca` (C.2) foi feita e aplicada. Gate 1 cumprido pelo próprio `produto`.
- Decisões registradas: sim, as três memórias acima, com linhas de índice.
- Memória sugerida: as três do C.3 escritas. A de `gotcha-motivo-enumerado-que-engole-dois-diagnosticos`
  e a de `decision-marco-de-versao-de-artefato-e-geral` (C.1) ficam recusadas como registro próprio: o
  caso e o marco estão escritos em `RN-NUC-043` e na tabela §3 de `fatos-de-operacao.md`, e a memória
  só repetiria a spec.
- Segredo: nenhum.
- Ficha com plano, relatórios verbatim e fechamento: sim. O relatório C.1 cita `RN-NUC-057` porque foi
  escrito antes da renumeração; a correção está na nota do thread em `T-0014`.
SOBROU (dono `produto`, sem despacho, por pedido do humano de 2026-09-23):
- remissões com `RN-NUC-063`: `nucleo-publicacao-e-texto.md:136` e `:89`, `nucleo-venda.md:113`,
  `README.md:99`, `captura-varredura-invariante-10-2026-09-11.md` §2.12, `pendencias-fase-1-e-2-2026-09-23.md:302`,
  `F-018:163`;
- glossário: a classe estrutural e as quatro famílias de simbologia;
- partir `fatos-de-operacao-dominios-fechados.md` (400 linhas) antes de `F-005`, levando a tabela de
  classe para um arquivo irmão.

## seguranca — 2026-09-23 (C.2, código lido no fato)

## RELATÓRIO — seguranca — T-0016
STATUS: OK
FEITO:
- Auditei no desenho a pergunta de F-007: se o fato de leitura não resolvida pode carregar o código lido. Não existe código de leitura nem de `operation_refused` no repositório. O único resultado do grep é o comentário em `apps/api/src/errors.ts:13`, então a auditoria é só sobre a spec.
- Analisei as seis formas pedidas. Para cada uma: o que se perde sem ela, o que pode vazar e por qual canal (fato sincronizado ou fila local, relatório e exportação, log e diagnóstico do terminal, observação do provedor).
- Respondi a prioridade um explicitamente (§1 do relatório). Com o desenho atual, com o código fora, **nenhum cliente vê dado de outro**. Se o código entrar como valor cru, abrem-se dois caminhos laterais entre clientes:
  - valor no canal `P` (`RN-PRV-009`) ou em agregado sobre clientes (`D-06`) expõe a lacuna de sortimento do cliente. É fato de negócio dele, e o agregado pode chegar a outro cliente.
  - valor cru que vem de QR ou Code 128 pode carregar texto construído. Exibido no console do provedor, que alcança N clientes, esse texto executa no navegador de quem vê todos.

**Resposta por forma:**
- **Só presença, simbologia e tamanho:** não vazam nada e podem ir a todos os canais, inclusive `P`.
  - Presença sozinha perde o aceite 1 e só responde os aceites 2 e 3 por estatística.
  - Simbologia depende de o leitor transmitir o identificador AIM, então o campo precisa aceitar "desconhecida".
- **Valor inteiro, sem admissão:** vaza QR de documento, cobrança instantânea (chave CPF ou telefone), chave de acesso com CPF de emitente pessoa física, boleto, vale-presente ou cartão de fidelidade (credencial ao portador), trilha de cartão (hipótese de parque) e carga construída. Fere `RN-OFF-023` itens 2 a 4, `fatos-de-operacao.md` §6 e `RN-PRV-009`.
- **Valor truncado:** é o pior dos dois lados. Pouco valor para cadastro, e vaza emissor do cartão e dígitos de CPF. `RN-NUC-056`(a) já recusa "parte".
- **Valor com hash:** CPF e telefone se revertem por força bruta (espaço da ordem de 10⁹, ESTIMATIVA). Com chave, a chave fica no terminal, porque o fato se forma offline. Para GTIN, o hash não acrescenta nada ao valor.

**Recomendação:** admissão estrutural feita no terminal, no instante em que o fato se forma, em dois degraus.
- **Degrau 1, sempre:** comprimento, simbologia e uma classe enumerada `gtin_global | gtin_restricted | not_gtin`.
- **Degrau 2:** valor inteiro, só dígitos, com no máximo 14, e só quando a classe é `gtin_global` e o contexto é lançar item.
- **Condições:**
  - nunca em contexto de identificação;
  - o valor é consumido só pelo cliente (`C`), nunca por `P` e nunca em agregado sobre clientes;
  - o filtro roda antes de qualquer log;
  - falha ao classificar vira `not_gtin`, sem valor;
  - alteração explícita de `fatos-de-operacao-dominios-fechados.md:69` e de `fatos-de-operacao.md` §6 item 2.
- **O que se perde, declarado:** o valor de código interno sem estrutura de GTIN global.
- **Risco residual declarado:** CNPJ de MEI de 14 dígitos lido ou digitado no campo de item (cerca de 1 em 10 passa no dígito verificador, ESTIMATIVA).

**Achado COD-01 [MÉDIO]:** `perifericos.md:264` registra "cada leitura de código" sem dizer o que da leitura entra no fato. `RN-PER-013` (`perifericos-classes.md:103`) inclui contextos de identificar pessoa. Pelo invariante 10, esse silêncio vira captura. Cenário: o operador lê o QR do documento do cliente-final e nome, CPF e nascimento viram fato no schema do cliente. Correção: acrescentar ao `Não registra` de `PER` — dono `produto`.

ARQUIVOS:
- `/home/mcastro/work/freelas/forja/docs/auditorias/2026-09-23-codigo-lido-no-fato.md` (novo)
- Só leitura: F-007, `perifericos.md`, `perifericos-classes.md`, `fatos-de-operacao.md`, `fatos-de-operacao-dominios-fechados.md`, `fila-local-conteudo-e-repouso.md`, `operacao-do-provedor-alcance.md`, `captura-varredura-invariante-10-2026-09-11.md`

NÃO FEITO: —

DECISÕES:
- Recomendei um degrau de valor admitido, em vez de manter o default do item (código sempre fora). O default perde o aceite 1 inteiro. A estrutura de GTIN global é o único critério que se calcula offline e separa item de documento, cobrança e credencial.
- A escolha é de `produto` e do humano. O default fechado do item continua válido até eles decidirem.

RISCOS:
- As faixas de prefixo GS1 (restritas `02`, `04`, `20` a `29`; cupom e recibo `98x` e `99x`) não foram conferidas contra fonte primária. Conferir é condição de aceite da regra.
- "Identificador válido" não tem definição (`LACUNA-PER-6`). Se o núcleo adotar outra definição, esta recomendação precisa ser reconferida.
- A notificação de F-007 fundamenta a ausência em `RN-OFF-027`, que só se aplica por analogia. A base exata é `RN-NUC-056`(a) e `RN-OFF-023` itens 2 a 4.

PERGUNTAS:
- para humano: aceita o degrau 2 (valor inteiro só para GTIN de circulação global, consumido só pelo cliente), ou mantém o código sempre fora e abre mão do aceite 1?
- para produto: `LACUNA-PER-6` adota a classe estrutural `gtin_global | gtin_restricted | not_gtin` como definição de "identificador válido"?

VERIFICAÇÃO:
- Li as specs citadas e rodei um grep em `apps/`, `packages/` e `db/`: não existe implementação de leitura.
- Não rodei nada executável.
- Não verifiquei: tabela de prefixos GS1, transmissão de identificador de simbologia no parque, existência de teclado com leitor de tarja nos postos-alvo.

MEMÓRIA SUGERIDA:
- type=gotcha escopo=modulo:perifericos slug=gotcha-leitura-de-codigo-e-entrada-de-quem-imprimiu — o que passa pelo leitor pode ser documento, cobrança ou credencial. Só a estrutura de GTIN global admite valor em fato, e a classificação acontece no terminal, antes do log.

PRÓXIMO PASSO SUGERIDO: produto — incorporar à RN dona de F-007 os dois degraus e as cinco condições da §3 da auditoria, e fechar COD-01 no `Não registra` de `perifericos.md` §3.

## thread — 2026-09-23 (decisão sobre o código lido)

A pergunta do `seguranca` ao humano foi decidida pelo thread, por delegação de 2026-09-23
([[convention-decisao-delegada-com-aviso-no-modulo]]): **aceito o degrau 2**. O fato de leitura não
resolvida carrega comprimento, simbologia (aceitando "desconhecida") e a classe
`gtin_global | gtin_restricted | not_gtin`, sempre. Carrega o valor inteiro só quando a classe é
`gtin_global` e o contexto é lançar item, com as cinco condições da §3 da auditoria
`docs/auditorias/2026-09-23-codigo-lido-no-fato.md`.

Motivo: o default fechado perde o aceite 1 inteiro, e o valor de GTIN global é dado de catálogo, não
de pessoa. É o invariante 10 com o limite de dado pessoal respeitado por construção, porque a
classificação acontece no terminal, antes de qualquer log. Recusado: manter o código sempre fora,
porque o que se perde é justamente saber **qual** item faltou no catálogo retido.

Condição de aceite que entra na regra: as faixas de prefixo GS1 (restritas e de cupom) conferidas
contra fonte primária antes de a regra fechar. `COD-01` fecha no `Não registra` de `PER` na passada C.3.

## produto — 2026-09-23 (C.1, LACUNA-PER-6 nasce como RN-NUC-057)

## RELATÓRIO — produto — T-0016 (passo C.1)
STATUS: OK

`LACUNA-PER-6` agora existe como `RN-NUC-057`, com o motivo próprio, o marco e as duas listas de `PER`. O código lido fica fora do fato (falha fechado), e o ponto está marcado para a passada C.3.

FEITO:
- **`RN-NUC-057`** escrita em `fatos-de-operacao-dominios-fechados.md` §1, logo depois de `RN-NUC-056` (linhas 132 em diante). Ela trata o identificador de item, lido ou digitado, que não resolve no catálogo aplicado: o lançamento é recusado, o pedido fica intacto, e cada tentativa gera um fato com motivo `item_identifier_unresolved`. Tem cinco cláusulas:
  - (a) o que o fato carrega: versão de catálogo aplicada, origem da entrada (leitura ou digitação), domínio de conexão e ator. O identificador **não** vai no fato, com o ponto C.3 marcado.
  - (b) a ordem de fronteira com `published_artifact_missing`.
  - (c) sem contato, o terminal nunca afirma que o item não existe.
  - (d) nada se presume nem se enfileira. Preço aberto continua sendo `LACUNA-NUC-002`.
  - (e) idade e defasagem são derivadas de marco, nunca campo.
  - A regra tem mais escopo, motivo, 6 aceites e 5 casos infelizes.
- **Motivo novo** na tabela §1.1: `item_identifier_unresolved`. `published_artifact_missing` ganhou a frase de fronteira e não perdeu nenhum caso (aceite 4 de `RN-NUC-057`, com teste negativo por busca). A nota de 2026-09-23 está no cabeçalho do arquivo.
- **Marco `published_artifact_version_received`**, linha nova na tabela §3 de `fatos-de-operacao.md`, com C e P e decisão nomeada para cada. O ator é o terminal, e a nota de ator da §3 foi atualizada.
- **`RN-NUC-043` pronta para `F-005`:** o parágrafo "nono motivo" virou a lista "Motivos acrescentados por alteração desta regra". Cada entrada tem data, motivo, `RN` dona e o vizinho que deixa de inflar. O texto de 2026-09-11 foi preservado, e a entrada de 2026-09-23 foi acrescentada. `F-005` entra como terceira entrada, mais uma linha na tabela §1.1, sem reescrever nada. Nada de `F-005` foi aplicado.
- **`RN-OFF-020`:** nota datada de 2026-09-23 apontando para `RN-NUC-057`. Na tabela §4 entrou a linha "Lançar item por identificador que não corresponde a item no catálogo aplicado", recusa em D1, D2 e D3. Sem ela, o padrão de `RN-OFF-008` responderia "exige conexão", que é a mensagem errada.
- **`PER`:**
  - `RN-PER-014` infeliz agora cita `RN-NUC-057` sem reescrevê-la.
  - `Exige do núcleo` passou a incluir a resolução do identificador contra o catálogo aplicado.
  - `Registra` ganhou a recusa com origem, versão e domínio, mais o marco.
  - `Não registra`: a ausência que antes era acidental virou três ausências decididas (o código, com C.3 marcado; idade e defasagem como campo; duração).
  - Na §4, `LACUNA-PER-6` aparece como **FECHADA → `RN-NUC-057`**, com a frase do humano.
- **`F-007`:** escopo estendido para incluir o nascimento de `PER-6`, citando a frase do humano. `Depende de` foi reescrita. A seção nova `## Alterações — 2026-09-23` registra o que mudou, por quê e contra o quê, com a regra citada em `path:linha`.

ARQUIVOS:
- `/home/mcastro/work/freelas/forja/docs/produto/fatos-de-operacao-dominios-fechados.md` (editado, 311 linhas)
- `/home/mcastro/work/freelas/forja/docs/produto/fatos-de-operacao.md` (editado, **394 linhas**)
- `/home/mcastro/work/freelas/forja/docs/produto/operacao-offline-e-sincronizacao.md` (editado, 360)
- `/home/mcastro/work/freelas/forja/docs/produto/modulos/perifericos.md` (editado, 339)
- `/home/mcastro/work/freelas/forja/docs/produto/modulos/perifericos-classes.md` (editado, 221)
- `/home/mcastro/work/freelas/forja/docs/backlog/F-007-codigo-lido-e-nao-resolvido-tem-motivo-proprio.md` (editado)
- Só leitura: `nucleo-publicacao-e-texto.md`, `captura-varredura-invariante-10-2026-09-11.md`, `F-005`, `F-018`, `docs/auditorias/2026-09-23-codigo-lido-no-fato.md`

NÃO FEITO: —

DECISÕES:
- **A regra cobre também o identificador digitado.** O núcleo lança por identificador sem `PER` ligado, então a regra não pode depender do módulo, e `RN-PER-014` passa a citá-la. Prova: `RN-PER-015` (`perifericos-classes.md:138`). Com isso o fato precisa da origem da entrada (leitura ou digitação); sem ela, o erro de digitação infla a conta do cadastro, que é o mesmo defeito que o item corrige. A origem é um valor de lista fechada, sem conteúdo lido.
- **O fato carrega a versão do catálogo aplicada, não a idade.** A causa se separa em dois caminhos. Primeiro, versão aplicada contra versão vigente publicada: se forem iguais, a causa é cadastro, e isso se verifica sem código. Segundo, a idade derivada do marco, que é a série da janela. O que continua impossível sem o código é saber **qual** código faltou. O aceite 2 do item foi reescrito, porque "o fato carrega a idade" contrariava `RN-NUC-045`.
- **O marco é geral** (qualquer versão de artefato publicado), não só de catálogo. Prova: `RN-NUC-015` (`nucleo-publicacao-e-texto.md:136`) já exige saber quais terminais confirmaram cada versão, e nenhum fato fazia isso. O custo é o grão para os nove artefatos de `RN-NUC-013`, que fica com `arquiteto-dados`.
- **"Válido" foi definido como "entregue completo".** Leitura incompleta é tentativa de `PER` que falhou (`RN-PER-004`), que já tem fato próprio. Código de embalagem coletiva ou de outro sistema cai no motivo novo, o que está certo porque é cadastro ou ruído. Assim não nasce uma etapa de "forma aceita" no núcleo, que seria mecanismo.
- **Do item saiu "não registra quem operava o terminal".** A linha contradizia `RN-NUC-043` (`fatos-de-operacao.md:130`), que exige o ator em toda recusa. Leitura por pessoa continua sendo `RN-REL-008`.
- **Número `RN-NUC-057`:** era o próximo livre em 2026-09-23 (a busca por `RN-NUC-05[7-9]|06x` não encontrou nada).

RISCOS:
- **Colisão de número:** outras instâncias de `produto` estão escrevendo agora. Se alguma pegou `RN-NUC-057`, uma das duas renumera antes de qualquer citação em código. Ninguém cita esse número fora destes arquivos ainda.
- **`fatos-de-operacao.md` está em 394 de 400 linhas.** A entrada de `F-005` na lista de `RN-NUC-043` custa cerca de 4 linhas e ainda cabe. Depois disso, o arquivo parte.
- **A auditoria de C.2 já existe em disco** e toca texto que acabei de escrever:
  - `:203`: a base da ausência não é `RN-OFF-027` (que chega aqui por analogia), e sim `RN-NUC-056`(a) mais `RN-OFF-023` itens 2 a 4. Mantive `RN-OFF-027`, igual a `F-007`, para C.3 corrigir junto com o resto.
  - `:206`: a auditoria pede que se reconfira a definição de "identificador válido" contra a "classe estrutural" da §3 dela. A minha definição ("entregue completo") é outra, então C.3 reconfere.
  - Achado §4 (`:190`–`:199`): pede frase no `Não registra` de `PER` sobre contexto de identificação.
- A contagem histórica "doze linhas do núcleo" na nota de 2026-08-22 (`operacao-offline-e-sincronizacao.md:158`) já estava defasada antes. Não mexi.

PERGUNTAS:
- para thread principal (os arquivos estão fora da minha lista nesta passada, e alguém precisa despachar a edição):
  - `docs/produto/nucleo-publicacao-e-texto.md:136` (`RN-NUC-015`): citar `published_artifact_version_received` como o fato que registra quais terminais confirmaram cada versão.
  - `:89` (`RN-NUC-013` infeliz a): citar `RN-NUC-057` como a fronteira.
  - `docs/produto/nucleo-venda.md:113` (`RN-NUC-002`): o infeliz dela passa a citar `RN-NUC-057`.
  - `docs/produto/README.md:99`: o índice de regras não tem `RN-NUC-057`.
  - `captura-varredura-invariante-10-2026-09-11.md` §2.12: marcar como encaminhado para `RN-NUC-057`.
  - `docs/backlog/F-018-...md:70` e `:79`: `LACUNA-PER-6` aparece como aberta lá.

VERIFICAÇÃO:
- Conferi com grep a contagem de linhas dos cinco arquivos de spec (todos abaixo de 400) e os `path:linha` citados em `F-007` (`:130`, `:206`, `:138`, `:136`).
- Conferi que `RN-NUC-057` e `LACUNA-NUC-044` não existiam antes.
- Conferi que `LACUNA-PER-6` não ficou como "não a invento" em nenhum arquivo meu.
- Não reli os arquivos inteiros depois das edições, só o trecho da `RN-NUC-057`.

MEMÓRIA SUGERIDA:
- type=gotcha escopo=plataforma slug=gotcha-motivo-enumerado-que-engole-dois-diagnosticos — acrescentar o terceiro caso, resolvido em 2026-09-23 (`item_identifier_unresolved` × `published_artifact_missing`), e a variante nova: a origem da entrada separa digitação de cadastro.
- type=decision escopo=plataforma slug=decision-marco-de-versao-de-artefato-e-geral — um fato por versão de artefato publicado recebida no terminal, não por artefato. Serve a `RN-NUC-015` e `RN-NUC-057`, e o grão fica com `arquiteto-dados`.

PRÓXIMO PASSO SUGERIDO: `produto` — C.3: aplicar `docs/auditorias/2026-09-23-codigo-lido-no-fato.md` §3, §4 e as notas `:203` e `:206` em `RN-NUC-057` (a), na definição de "válido" e nas listas de `PER` (`perifericos.md` §3), e ao aceite 1 e ao `Não registra` de `F-007`.

## os-research — 2026-09-23 (faixas de prefixo GS1, fonte primária)

Objective: faixas GS1 restritas e globais, dígito verificador, variação da GS1 Brasil, AIM Symbology ID. Não escrevi nada no projeto; downloads ficaram no scratchpad (gs1r/).

Sources
- GS1 General Specifications Release 26.0, Ratified, Jan 2026 (a edição vigente). É o PDF servido em https://ref.gs1.org/standards/genspecs/ ; baixei e extraí o texto com pdftotext.
- Página de prefixos: https://www.gs1.org/standards/id-keys/company-prefix (curl, HTTP 200).
- Zebra DS2208 PRG MN-002874-14EN: https://www.zebra.com/content/dam/support-dam/en/documentation/unrestricted/guide/product/ds2208-prg-en.pdf
- GS1 Brasil: https://blog.gs1br.org/o-que-significa-cada-elemento-do-codigo-de-barras/

Findings (fatos, GenSpecs R26 salvo indicação)
1. Tabela 1-4, prefixo GS1 aplicado ao GTIN-13 e ao GTIN-12 com zero implícito à esquerda:
   - RCN: `0000000` (interno da empresa); `02` (região, definido pela MO); `04` (interno da empresa); `20`–`29` (região, definido pela MO); `980` (recibo de reembolso); `981`–`983` (cupom para áreas de moeda comum); `99` (cupom).
   - `0000001`–`0000099`: "Unused to avoid collision with GTIN-8". Um valor de 13 ou 14 dígitos que começa com `00000` é um GTIN-8 com zeros à esquerda, então vale a regra do GTIN-8.
   - `952`: só para demonstração e exemplo. `984`–`989`: reservado. Com isso a hipótese "98x" cai: só `980`–`983` têm função atribuída.
   - `977` é do ISSN International Centre e `978`–`979` da International ISBN Agency. A tabela os lista como alocação a agência, fora do grupo RCN. Chamar isso de "global" é inferência minha, não texto literal.
   - Tabela 1-6: prefixo U.P.C. `2` e `4` são RCN, `5` é "Reserved for future use". O §2.1.11.3 acrescenta que os U.P.C. Company Prefixes `000000` e `001000`–`007999` (LAC e RZSC, levados em UPC-E) são numeração interna. A hipótese não tinha essa faixa.
2. Tabela 1-5, GTIN-8: `000`–`099` e `200`–`299` são RCN-8 interno da empresa (§2.1.11.1 fala em "RCN-8 Prefix 0 or 2"). `952` é demonstração, `977`–`999` são reservados, o resto é GTIN-8.
3. GTIN-14: RCN "SHALL NOT be used" (§2.1.2, §2.1.3), e RCN não pode ser codificado com AI (§1.2.2.2.1). Indicador `9` é GTIN de medida variável que "is not used on an item intended to cross the retail point-of-sale" (§2.1.10).
4. Peso ou preço variável no PDV (§2.1.12.2): a MO "SHOULD assign one or several of the GS1 Prefixes 02, 20 through 29", e a estrutura dos campos é nacional.
5. Dígito verificador (§7.9.1, Tabela 7-8): pesos 3 e 1 alternados a partir do dígito imediatamente à esquerda do verificador, que recebe ×3. O verificador é o próximo múltiplo de 10 igual ou maior que a soma, menos a soma. Mesmo algoritmo para GTIN-8/12/13/14.
6. Divergência entre fontes: a página web diz "050 - 059 GS1 US reserved for future use"; a Tabela 1-4 da GenSpecs R26 diz que `05` emite GS1 Company Prefix. A Tabela 1-6 da mesma GenSpecs diz que U.P.C. `5` é reservado.
7. GS1 Brasil: `789`–`790` estão confirmados na página global e no blog da GS1 Brasil, que diz que o prefixo indica onde o código foi registrado, não a origem do produto.
8. AIM (Zebra DS2208, parâmetro 45 "Transmit Code ID Character"): as opções são None, Symbol ou AIM, e o padrão de fábrica é "*None". Então é configuração, desligada de fábrica.
   - O formato é `]cm`. UPC/EAN sai como `]E0` (13 dígitos para UPC-A, UPC-E e EAN-13), `]E4` para EAN-8, `]E1`/`]E2`/`]E3` com suplemento.
   - Bookland EAN e ISSN EAN, quando essas decodificações estão ligadas, saem como `]X0` com 10 dígitos (exemplo `]X0123456789X`), e não como o EAN-13 cru.

Experiments
Rodei o algoritmo do item 5 em Python sobre 9501101530003, 614141234561, 7891000315507 e 96385074. O dígito calculado bateu com o impresso nos quatro.

Unconfirmed
- Uma regra nacional da GS1 Brasil para `02`/`20`–`29` (quais prefixos ela atribui a peso variável e com que estrutura). O guia técnico em gs1br.org devolveu HTML em vez de PDF e o espelho em gs1br.tv.br não respondeu. O blog não trata o tema.
- ISO/IEC 15424: não li a norma, só o manual Zebra. Não verifiquei o padrão de fábrica de outros fabricantes.
- Se UPC-E com sistema numérico 1 é aceito pela GS1: não verificado.

Recommendation (confiança alta nas faixas globais, baixa na nacional)
- `gtin_restricted`:
  - GTIN-13/12, prefixos `02`, `04`, `20`–`29`, `980`–`983` e `99`;
  - GTIN-12 começando com `000000` ou na faixa U.P.C. `001000`–`007999`;
  - GTIN-8 começando com `0` ou `2`;
  - `952` (demonstração);
  - todo GTIN-14 com indicador `9`.
- `not_gtin`: `984`–`989` e GTIN-8 `977`–`999` (reservados), além de qualquer código com dígito verificador inválido.
- Terminal e cadastro não podem depender do AIM, que vem desligado de fábrica. Se usarem, precisam tratar `]X0` de ISBN/ISSN.
- Comparar o prefixo 2x contra a GS1 Brasil antes de fixar a estrutura de peso variável.

Next Agent: produto, para decidir se `977`–`979` conta como `gtin_global` e qual é a regra da faixa `2x` no Brasil (depende do humano ou do documento da GS1 Brasil).

## thread — 2026-09-23 (decisões sobre as faixas)

- `977`–`979` (ISSN e ISBN) contam como `gtin_global`. Identificam item de catálogo, nunca pessoa,
  e a loja que vende livro ou revista precisa saber qual faltou.
- A estrutura nacional da faixa `2x` (peso e preço variável) não foi confirmada na GS1 Brasil. Isso
  não trava esta regra: `2x` é `gtin_restricted` e nunca leva valor. Se alguma spec depender de
  decodificar a estrutura de `2x` (etiqueta de balança), ela recebe aviso de indisponibilidade no
  formato de `F-018`, com "Responde: humano, pelo documento técnico da GS1 Brasil".
- A classificação usa o dígito verificador e as faixas da GenSpecs R26. Ela não depende do
  identificador AIM, que vem desligado de fábrica, e a simbologia vai como "desconhecida" quando ele
  não vier.

## produto — 2026-09-23 (C.3, degrau 2 e COD-01)

## RELATÓRIO — produto — T-0016 (passo C.3)
STATUS: OK

O degrau 2 entrou em `RN-NUC-063` (a), com a classificação escrita na própria regra. "Válido" continua querendo dizer "entregue completo", e o motivo está na cláusula nova (f). `COD-01` foi fechado no `Não registra` de `PER`. **A regra mudou de número:** `RN-NUC-057` já pertencia a outra instância.

FEITO:
- **Renumerei `RN-NUC-057` para `RN-NUC-063`.** Outra instância escreveu `RN-NUC-057` a `RN-NUC-062` no mesmo dia: fuso, moeda e turno, em `nucleo-estabelecimento.md:140` e `nucleo-caixa-e-turno.md:7`. Esses números já são citados em cerca de 20 lugares (glossário, `fronteira-do-nucleo`, `SPR-36`, `SPR-37`, `nucleo-venda`). O nosso só aparecia nos meus arquivos, e nenhum código o citava. A troca está registrada na própria regra e em `F-007` (Alterações, passada C.3).
- **`RN-NUC-063` (a)** (`fatos-de-operacao-dominios-fechados.md:158-206`):
  - Degrau 1 vale sempre: comprimento, simbologia e classe. A simbologia é uma lista fechada: `ean_upc`, `other_linear`, `two_dimensional` e `unknown`.
  - Degrau 2 é o valor, só dígitos, até 14, e só com `gtin_global`.
  - As cinco condições da §3 da auditoria estão numeradas.
  - A tabela de classificação tem 7 linhas, pela GenSpecs R26, com a URL. Nela estão:
    - `gtin_restricted`: `02`, `04`, `20`–`29`, `0001000`–`0007999`, `952`, `980`–`983` e `99`; GTIN-8 `0xx`, `2xx` e `952`; GTIN-14 com indicador 9.
    - `not_gtin`: `984`–`989`, `05`, GTIN-8 `977`–`999`, GTIN-14 com prefixo interno, verificador inválido, e falha ao classificar.
    - `gtin_global`: `977`–`979`, conforme a decisão do thread.
- **(f) "Válido" continua querendo dizer entregue completo, e a classe não é essa definição.** Se "válido" fosse `gtin_global`, todo código interno não resolvido (código próprio da loja de roupa, etiqueta de balança) cairia em `unclassified_operation`, ou voltaria para `published_artifact_missing`, que é o defeito que o item corrige. A classe nunca muda o desfecho do lançamento (`RN-PER-013`). A recomendação da auditoria depende da classe, não da definição de válido, e continua de pé (nota `:206`).
- **Aceites:** o aceite 1 ganhou o caso com valor, `7891000315507`, e a leitura do `P` sem valor. O aceite 6 é novo: as três classes com o mesmo desfecho, usando `2001234001502`, `7891000315508` e um QR de 200 caracteres. O aceite 7 é o negativo por busca, que inclui registro de erro e diagnóstico mesmo no degrau 2.
- **Infelizes novos:**
  - (g) a GS1 realoca faixas numa edição nova;
  - (h) risco residual: documento de pessoa jurídica de 14 dígitos que passa no verificador;
  - (i) UPC-E em 8 dígitos e ISBN em 10 caracteres.
- **Base da ausência trocada** para `RN-NUC-056`(a) com `RN-OFF-023` itens 2 a 4, em `RN-NUC-063`(a), em `perifericos.md` §3 e em `F-007`. `RN-OFF-027` continua citado só pela cláusula (b) dele: o valor nunca vira chave de decisão.
- **Alterações explícitas:**
  - "o que a recusa nunca carrega" (`dominios-fechados.md:76-81`) ganhou uma exceção única, datada;
  - `fatos-de-operacao.md` §6 item 2 (`:326-329`) também.
- **`PER`** (`perifericos.md`):
  - o `Registra` diz o que entra de cada leitura (contexto, posto, instante, desfecho) e o degrau da recusa;
  - o `Não registra` tem dois itens novos: o conteúdo fora do caso único, e nada do conteúdo em contexto de identificar documento ou pessoa (fecha `COD-01`), nem comprimento, simbologia ou classe (`RN-NUC-044`);
  - na §4, `LACUNA-PER-6` aponta para 063, e há um aviso de etiqueta de balança.
- **`RN-PER-014`** infeliz (`perifericos-classes.md:128`): "válido" agora aponta para (f), e o número foi corrigido.
- **`F-007`:** o aceite 1 foi reescrito com os três casos. `Registra` e `Não registra` foram refeitos. `Depende de` perdeu a trava de `seguranca` e ganhou os quatro identificadores de teste, que servem digitados, sem leitor. O gate foi marcado como respondido. Há uma seção de Alterações da C.3 com o que mudou, por quê e contra o quê. As Referências foram atualizadas.
- **`F-018` `:70` e `:79`:** `LACUNA-PER-6` aparece como FECHADA → `RN-NUC-063`, com a nota do que mudou e por quê.
- **Item 7 (faixa `2x`):** nenhuma spec depende de decodificar a estrutura dessa faixa. Busquei balança, etiqueta e peso ou preço variável em `docs/produto`:
  - `RN-PER-018` é balança conectada, não etiqueta;
  - `ETQ` (`catalogo-de-modulos.md:266`) gera "código, preço", mas não diz que o preço vai dentro do código;
  - `receitas-por-vertical.md:74` é quantidade fracionária.

  Mesmo assim pus o aviso no formato de `F-018` em `RN-NUC-063`, infeliz (f), com "Responde: humano, pelo documento técnico da GS1 Brasil", porque é ali que a etiqueta da padaria cai hoje. Há um ponteiro em `perifericos.md` §4. O "Enquanto isso" cita `RN-PER-015` e `RN-PER-019`.

ARQUIVOS:
- `/home/mcastro/work/freelas/forja/docs/produto/fatos-de-operacao-dominios-fechados.md` (editado, **400 linhas**)
- `/home/mcastro/work/freelas/forja/docs/produto/fatos-de-operacao.md` (editado, 396)
- `/home/mcastro/work/freelas/forja/docs/produto/operacao-offline-e-sincronizacao.md` (editado, só o número em `:115` e `:124`)
- `/home/mcastro/work/freelas/forja/docs/produto/modulos/perifericos.md` (editado, cerca de 352)
- `/home/mcastro/work/freelas/forja/docs/produto/modulos/perifericos-classes.md` (editado, 221)
- `/home/mcastro/work/freelas/forja/docs/backlog/F-007-codigo-lido-e-nao-resolvido-tem-motivo-proprio.md` (editado)
- `/home/mcastro/work/freelas/forja/docs/backlog/F-018-decidir-as-lacunas-que-travam-as-fases-1-e-2.md` (editado, só `:70` e `:79`)
- Só leitura: ficha T-0016, a auditoria, `fila-local-conteudo-e-repouso.md` (`RN-OFF-023`), `catalogo-de-modulos.md`

NÃO FEITO: —

DECISÕES:
- **Renumerar a nossa regra, e não a outra.** O custo é assimétrico: a do fuso tem dezenas de citações em arquivos que não são meus; a nossa, só as minhas.
- **`05` como `not_gtin`.** A Tabela 1-4 diz que o prefixo é emitido; a Tabela 1-6 e a página da GS1 dizem que é reservado. Na dúvida, o valor não entra. Custo: se a GS1 US alocar `05x`, esses itens perdem o valor até alguém alterar a regra.
- **Simbologia em quatro famílias**, e não por símbolo. A única decisão nomeada é separar leitura de item de leitura de documento (`RN-PER-014`, motivo). Um grão mais fino não tem decisão que o peça (`RN-NUC-044`).
- **Global é o que está fora das faixas listadas**, e não "alocado a uma Organização Membro". Segui a definição da auditoria §3, que evita embutir a tabela inteira de alocação. O risco residual está declarado em (h).
- **O valor `gtin_global` também não vai a registro de erro nem a diagnóstico.** A condição 2 (só `C`) valeria pouco se o diagnóstico que chega a nós o carregasse.

RISCOS:
- **`dominios-fechados.md` está em 400 linhas, no teto.** Enxuguei o texto para caber. A próxima regra (a de `F-005`) obriga a partir o arquivo. Eixo proposto: levar a tabela de classe estrutural para um arquivo irmão. É o único bloco com fonte externa própria e com ciclo de alteração próprio (as edições da GS1).
- **`fatos-de-operacao.md` está em 396.** A entrada de `F-005` na lista de `RN-NUC-043` (cerca de 4 linhas) fecha em 400 exatas.
- **As remissões pedidas na C.1** (`nucleo-publicacao-e-texto.md:136` e `:89`, `nucleo-venda.md:113`, `README.md:99`) precisam usar **063**. Aplicadas com 057, apontam para a regra de fuso.
- **`ETQ`:** se um dia imprimir código com preço embutido, passa a depender do aviso da faixa `2x`.
- **`F-018:163`** cita `perifericos.md:309` para `PER-6`, e a linha mudou. Não mexi, porque está fora das duas linhas autorizadas.

PERGUNTAS:
- para thread principal (fora da minha lista de escrita):
  - `docs/produto/pendencias-fase-1-e-2-2026-09-23.md:302`: `LACUNA-PER-6` virou `RN-NUC-063`, não 057. O "F-018 ainda a lista como aberta" deixou de ser verdade.
  - `glossario.md`: entradas para a classe estrutural (`gtin_global`, `gtin_restricted`, `not_gtin`) e para a simbologia (`ean_upc`, `other_linear`, `two_dimensional`, `unknown`).
  - `README.md:99`, `captura-varredura-invariante-10-2026-09-11.md` §2.12 e as três remissões da C.1: todas com `RN-NUC-063`.
  - `F-018:163`: atualizar `:309` (`PER-6`).

VERIFICAÇÃO:
- Busquei `RN-NUC-057` em `docs/` depois das edições. Nos meus arquivos o número só sobra nas notas de renumeração. Fora deles, só na regra de fuso e em `pendencias-fase-1-e-2:302`.
- Contei as linhas dos sete arquivos. Todos estão em 400 ou menos.
- Dígitos verificadores: `7891000315507` foi conferido por execução na pesquisa. `2001234001502` calculei à mão (soma 28, verificador 2), sem rodar. `7891000315508` difere em um dígito do válido.
- Não rodei nada executável. Não reli os arquivos inteiros, só os trechos editados.

MEMÓRIA SUGERIDA:
- type=decision escopo=plataforma slug=decision-codigo-lido-entra-so-como-gtin-global — o fato de identificador não resolvido carrega sempre comprimento, simbologia e classe, e o valor só com `gtin_global`. A classe é calculada no terminal pela GS1 R26, e o valor é consumido só pelo `C`.
- type=gotcha escopo=processo slug=gotcha-numero-de-rn-colide-entre-instancias-paralelas — duas instâncias de `produto` tomaram `RN-NUC-057` no mesmo dia. Reservar a faixa de números no plano antes de despachar em paralelo.
- type=gotcha escopo=modulo:perifericos slug=gotcha-leitura-de-codigo-e-entrada-de-quem-imprimiu — sugestão de `seguranca` na C.2, que continua válida.

PRÓXIMO PASSO SUGERIDO: thread principal — despachar as remissões da lista de PERGUNTAS com o número 063, e decidir a partição de `dominios-fechados.md` antes de `F-005` entrar.

## thread — 2026-09-23 (ficha reaberta)

**Reaberta** para o escopo de `F-028`, absorvido em `F-007` pela passada de manutenção (justificativa em
`docs/produto/backlog-recortes.md`, fusão autorizada pelo thread em `T-0017`). Motivo: um item, uma ficha
(`backlog.md` §4); dar ficha própria ao absorvido desfaria a fusão. O fechamento acima continua valendo
para o que entregou; falta o escopo de `F-028` (aceites 6 e 7 de `F-007`), e antes dele partir
`fatos-de-operacao-dominios-fechados.md` (400 linhas).

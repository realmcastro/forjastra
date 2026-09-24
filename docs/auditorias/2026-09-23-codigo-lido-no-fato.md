# Auditoria: o código lido no fato de leitura não resolvida (T-0016, F-007, passo C.2)

**Data:** 2026-09-23 · **Agent:** `seguranca` · **Somente leitura, de desenho.** · **STATUS: OK**
**Escopo:** a pergunta de `docs/backlog/F-007-codigo-lido-e-nao-resolvido-tem-motivo-proprio.md`
(`Não registra`, primeiro item, e `Gate obrigatório`): quando o terminal lê, sem contato, um
identificador válido que o catálogo retido não resolve, o fato de recusa pode carregar o código lido,
e em que forma.

**Numeração:** `COD-01`. Um achado, `MÉDIO`, adjacente à pergunta. Nenhum reincidente.

**Veredito:** o código **pode** entrar, mas só em um degrau estreito: valor inteiro quando, e somente
quando, a leitura tem **estrutura de GTIN de circulação global**, no contexto de lançar item, com
consumo só do cliente. Todo o resto entra como presença, comprimento, simbologia e classe estrutural.
Truncado e hash ficam fora. Detalhe na §3.

---

## 0. Método

Não existe código de leitura nem de `operation_refused` no repositório: `grep` por
`barcode|scanner|gtin|leitor|operation_refused` em `apps/`, `packages/` e `db/` só encontra o comentário
de `apps/api/src/errors.ts:13`, que diz que a lista de erro da borda **não** é esse domínio. A auditoria
é sobre a spec. Lidos: `perifericos-classes.md:103-145` (`RN-PER-013` a `RN-PER-015`),
`modulos/perifericos.md` §3 e §4, `fatos-de-operacao-dominios-fechados.md` §1 (tabela §1.1, cláusula
"o que a recusa nunca carrega" em `:69`, `RN-NUC-056` em `:73`), `fatos-de-operacao.md` `RN-NUC-043`
(`:128`) e §6 (`:315`), `fila-local-conteudo-e-repouso.md` `RN-OFF-021`, `RN-OFF-023` (`:86`) e
`RN-OFF-027` (`:122`), `operacao-do-provedor-alcance.md` `RN-PRV-009` (`:104`), e o §2.12 da varredura
do invariante 10. Nada foi executado.

## 1. Prioridade um: um cliente vê dado de outro?

**Com o desenho atual do item (código fora), não.** Com o código carregado como valor cru, sim, por
dois caminhos laterais, descritos em (5).

1. **Consulta em outro schema.** O fato nasce no terminal, que é de um estabelecimento de um cliente
   (`RN-OFF-026`), e mora no schema dele. O item não acrescenta leitura cruzada.
2. **Origem do tenant.** Herdada da habilitação do terminal (`RN-OFF-032`). Nada novo aqui; `D-03`
   segue aberta e não é tocada.
3. **Tenant opcional.** Não se aplica: o fato não existe fora de um terminal habilitado.
4. **IDOR.** O código lido não é id de recurso do tenant usado para buscar dado; a resolução é contra
   o catálogo retido do próprio terminal. Se um dia o servidor resolver o valor na sincronização, a
   busca é no catálogo **do schema do fato**, nunca em índice comum.
5. **Canais laterais.** É onde a pergunta mora.
   - **Observação do provedor.** Todo motivo de `§1.1` é `C · P`, e o `P` é observação corrente sem
     concessão (`RN-PRV-009`). O valor lido e não cadastrado é a lacuna de sortimento do cliente, o que
     os clientes-finais dele trazem e ele não vende: é fato de negócio dele, e não passa na quarta
     declaração de `RN-PRV-009`. Valor no `P` é o provedor lendo o negócio do cliente sem concessão.
   - **Agregado sobre clientes** (`D-06`, repouso ainda aberto). "Códigos mais recusados na
     plataforma" oferecido de volta a um cliente como sugestão de cadastro revela a B o que chega aos
     caixas de A. Nenhuma superfície dessas existe na spec; vira condição (§3, ii).
   - **Console com valor cru.** Leitura é entrada de quem imprimiu o código (`RN-PER-013`, motivo). QR
     e Code 128 carregam texto arbitrário. Valor cru persistido e depois exibido numa lista de trabalho
     do provedor, cuja sessão alcança N clientes, é carga armazenada que executa no navegador de quem
     vê todos. `RN-OFF-027`(a) proíbe renderizar como marcação, mas a defesa por construção é não
     guardar o que não tem forma fechada.
   - **Log e diagnóstico do terminal.** `RN-OFF-023`, aceite: nenhum dos sete itens aparece em registro
     de erro, cópia de apoio ou exportação de diagnóstico. A leitura crua no log do acompanhante é esse
     canal, e ele existe antes de o fato ser sincronizado.

## 2. Forma por forma

Canais considerados: fato sincronizado ao schema do cliente (e o repouso dele na fila local,
`RN-OFF-021`), relatório e exportação do cliente, log e diagnóstico do terminal, trilha e observação do
provedor.

### 2.1 Só presença (motivo, terminal, instante, idade do retido)

- **Perde-se sem ela:** tudo; é o piso do item.
- **Com ela, e só ela, perde-se:** o aceite 1 inteiro (qual código cadastrar), e a separação entre
  "o operador leu algo que não é item" e "o item não está cadastrado". Os aceites 2 e 3 são respondidos
  por presença mais idade, mas só **estatisticamente**: sem o valor, o servidor não consegue dizer, por
  ocorrência, se aquele código existia no catálogo publicado.
- **Vaza:** nada.
- **Canal:** todos, inclusive `P`.

### 2.2 Simbologia

- **Perde-se sem ela:** a distinção barata entre leitura de QR, PDF417 ou Data Matrix (quase sempre
  documento, cobrança ou pagamento) e EAN/UPC (quase sempre item). É o que mede a "leitura errada de
  rotina" de `RN-PER-014`, motivo.
- **Vaza:** nada de pessoa. Diz a classe do símbolo, não o conteúdo.
- **Canal:** todos, inclusive `P`.
- **Ressalva:** só existe se o leitor transmitir identificador de simbologia, o que é configuração do
  equipamento. Em entrada por emulação de teclado no navegador (`D-02`) frequentemente não vem. O campo
  tem que admitir "desconhecida". Não verificado para o parque de nenhum cliente. Não conflita com o
  `Não registra` de fabricante e modelo (`perifericos.md` §3): é propriedade da leitura, não do
  equipamento.

### 2.3 Tamanho

- **Perde-se sem ele:** a mesma distinção de 2.2, e por uma via que não depende de configuração do
  leitor. 8, 12, 13 e 14 são comprimentos de GTIN; 11 é CPF ou telefone; 44 é chave de acesso de
  documento fiscal ou código de cobrança.
- **Vaza:** a classe provável ("documento de 11 dígitos lido no campo de item"). Isso é fato sobre a
  operação, não identifica ninguém.
- **Canal:** todos, inclusive `P`.

### 2.4 Valor inteiro

- **Perde-se sem ele:** o aceite 1 (a lista pronta para cadastro) e a classificação por ocorrência do
  aceite 2 na sincronização.
- **Vaza, sem admissão estrutural, no contexto de lançar item:** QR de documento de identificação
  (nome, CPF, nascimento); código de cobrança instantânea (chave que pode ser CPF, telefone ou e-mail,
  e nome de quem recebe); chave de acesso de documento fiscal, que carrega CPF quando o emitente é
  pessoa física; código de boleto (valor, vencimento, beneficiário); cartão de fidelidade, vale-presente
  e vale-troca de outro sistema, que são **credencial ao portador** e caem em "credencial, nunca";
  trilha de cartão, se o posto tiver teclado com leitor de tarja em emulação de teclado (hipótese,
  depende do parque, não confirmada); e carga construída (§1, 5).
- **Canal:** todos. Na fila local, fere `RN-OFF-023` itens 2 a 4; no fato sincronizado, fere
  `fatos-de-operacao.md` §6 itens 1 a 3; no `P`, fere `RN-PRV-009`; no log, fere o aceite de
  `RN-OFF-023`.

### 2.5 Valor truncado

- **Perde-se sem ele:** quase nada. O prefixo de empresa GS1 aponta o fornecedor, não o item, e não é
  cadastrável.
- **Vaza:** o começo de um cartão é o emissor; dígitos de CPF carregam região fiscal; o começo de um
  vale é parte de credencial. `RN-NUC-056`(a) já recusa "parte" da identificação apresentada, pelo
  mesmo motivo.
- **Canal:** os mesmos de 2.4, com menos conteúdo e nenhuma utilidade a mais. Pior dos dois lados.

### 2.6 Valor com hash

- **Perde-se sem ele:** a recorrência de um mesmo código não admitido ("o mesmo código, 40 vezes").
- **Vaza:** hash sem chave de CPF ou telefone se reverte por força bruta (o espaço útil é da ordem de
  10⁹, ESTIMATIVA pelo número de dígitos livres). Com chave, o fato se forma **offline**, então a chave
  mora no terminal, que é o dispositivo mais exposto (`RN-OFF-021`, `C-09`): quem leva o terminal leva a
  chave. De vale-presente, é forma derivada de credencial, que `RN-OFF-023` item 2 recusa ("nem valor
  nem forma derivada") pelo mesmo raciocínio. Para GTIN admitido, o hash não acrescenta nada ao valor.
- **Canal:** os mesmos de 2.4.

## 3. Recomendação: a forma mais rica que não carrega dado de pessoa

**Admissão estrutural no terminal, no instante em que o fato se forma, em dois degraus.**

- **Degrau 1, sempre:** motivo, terminal, instante, idade do retido, **comprimento**, **simbologia**
  (ou "desconhecida") e **classe estrutural enumerada**: `gtin_global`, `gtin_restricted`, `not_gtin`.
- **Degrau 2, só quando a classe é `gtin_global` e o contexto é lançar item:** o valor inteiro, só
  dígitos, no máximo 14.

`gtin_global` é: comprimento 8, 12, 13 ou 14; dígito verificador GS1 (módulo 10) conferindo; e
prefixo GS1 **fora** das faixas de circulação restrita (`02`, `04`, `20` a `29`, e os equivalentes em
GTIN-8), de cupom e de recibo de devolução (`98x`, `99x`). As faixas **não foram conferidas contra fonte
primária** nesta rodada (GS1 General Specifications, tabela de prefixos); conferi-las é condição de
aceite da regra, não detalhe de implementação.

Por que é a mais rica: cobre o aceite 1 no caso que importa (produto de fornecedor com GTIN), deixa o
servidor classificar cada ocorrência do aceite 2 na sincronização, mantém o aceite 3 pela idade, e o
degrau 1 ainda mostra "o operador lê documento no campo de item", que é defeito de fluxo, sem
identificar ninguém. Dado de pessoa não passa porque os documentos, as cobranças, os cartões e os vales
não têm estrutura de GTIN global, ou moram em faixa restrita. Admitir só dígitos também fecha a carga
construída (§1, 5) por construção.

**Condições, e nenhuma é opcional:**

1. **Contexto.** Nos contextos de identificar documento ou pessoa (`RN-PER-013`) o valor nunca entra,
   e o motivo de F-007 nem se aplica: lá a leitura é dado de pessoa por definição.
2. **Consumo.** O valor do degrau 2 é `C` e só `C`. O `P` recebe o degrau 1. O valor nunca entra em
   repouso agregado sobre clientes (`D-06`), nem em superfície que devolva a um cliente o que chegou a
   outro.
3. **Lugar do filtro.** A classificação acontece no terminal, antes de qualquer log. Fato é imutável
   (`PN-07`, `PN-08`) e repousa na fila local antes de sincronizar: limpeza no servidor chega tarde. A
   leitura crua de classe não admitida não aparece em log, cópia de apoio nem diagnóstico (`RN-OFF-023`,
   aceite).
4. **Falha fechado.** Falha ao classificar é `not_gtin`, sem valor. A classificação é cálculo local
   sobre tabela embutida: não pede contato, não pega lock e não bloqueia a venda.
5. **Texto da regra.** `fatos-de-operacao-dominios-fechados.md:69` ("o que a recusa nunca carrega") e
   `fatos-de-operacao.md` §6 item 2 precisam de alteração explícita para admitir o degrau 2, dizendo por
   que o GTIN admitido não é texto de terceiro como campo de decisão. E ele continua **nunca chave de
   decisão** (`RN-OFF-027`b): se "cadastrar a partir da lista" deixar de estar fora de escopo e virar
   automático, volta ao gate, porque aí quem imprime a etiqueta decide o catálogo.

**O que se perde, declarado:** o valor de código interno do estabelecimento sem estrutura de GTIN
global (Code 128 próprio, etiqueta de balança em faixa `2x`). Fica a contagem por classe e comprimento.
Recuperá-lo por padrão de código declarado pelo cliente é capacidade (P2 abaixo), não ajuste desta
regra.

**Risco residual, não zerado:** dado de pessoa gravado com prefixo GS1 atribuído e dígito verificador
válido. Exige uso indevido de prefixo atribuído; o caso plausível é um CNPJ de MEI de 14 dígitos lido
ou digitado no campo de item, que passa no verificador em cerca de 1 a cada 10 (ESTIMATIVA, assumindo
verificador uniforme) e ainda precisa cair em faixa global.

## 4. Achado

### COD-01 — O `Registra` de `PER` captura "cada leitura de código" sem dizer o que da leitura entra, e o invariante 10 transforma o silêncio em captura — [MÉDIO]
ONDE: `docs/produto/modulos/perifericos.md:264` (`Registra`), com `:213` (`Expõe`) e
`docs/produto/modulos/perifericos-classes.md:103` (`RN-PER-013`, que lista "identificar documento" e
"identificar pessoa" entre os contextos de leitura)
CENÁRIO: a implementação segue a linha como está escrita e registra o evento de leitura com o
conteúdo, porque o `Não registra` de `PER` (`perifericos.md` §3) não recusa o conteúdo e o invariante 10
manda capturar na dúvida. O operador, no contexto de identificar pessoa, lê o QR do documento do
cliente-final. Nome, CPF e nascimento viram fato no schema do cliente, repousam na fila local e saem
em relatório e exportação da série de leitura.
POR QUE É REAL: a linha existe, a lista de ausências não cobre o conteúdo, e o ônus do invariante 10 é
justificar a ausência, não a captura. É o mesmo padrão de `PRV-12`: a implementação lê a coluna perto
do fato como autorização quando a declaração falta. Não cruza tenant, por isso não é `ALTO`.
CORREÇÃO SUGERIDA: acrescentar ao `Não registra` de `PER` que o conteúdo da leitura não entra em fato
fora do degrau 2 da §3 desta auditoria, e que em contexto de identificação nunca entra, citando
`RN-NUC-056`(a) e `RN-OFF-023` itens 2 a 4 — dono: `produto`.

## 5. Notas (sem cenário, não são achados)

- **Base citada.** F-007 apoia a ausência em `RN-OFF-027`, que rege texto de terceiro preservado
  literal (motivo de rejeição, mensagem do servidor). A leitura só cai nela por analogia. A base exata é
  `RN-NUC-056`(a) e `RN-OFF-023` itens 2 a 4.
- **"Identificador válido" não tem definição** (`RN-PER-014`, infeliz; `LACUNA-PER-6`). A classe
  estrutural da §3 é uma; se `LACUNA-PER-6` adotar outra, esta recomendação precisa ser reconferida.
- **Recusa na tela do operador.** `RN-PER-014` mostra "o que foi lido". É mensagem transitória, e a
  cláusula `:69` já a mantém fora do fato. A superfície do cliente-final não a espelha
  (`RN-PER-016`). Nada a fazer.
- **P2, capacidade.** Admitir código interno por padrão declarado pelo cliente recupera o que a §3 perde,
  mas desloca para a configuração do cliente a responsabilidade de não declarar padrão que colida com
  cartão de fidelidade ou vale. Decisão de `produto` e do humano, com novo gate.

## 6. O que não foi verificado

- Tabela de prefixos GS1 contra a edição vigente das General Specifications.
- Se os leitores do parque-alvo transmitem identificador de simbologia na entrada por teclado.
- Se algum posto-alvo tem teclado com leitor de tarja (o cenário de trilha em 2.4 depende disso).

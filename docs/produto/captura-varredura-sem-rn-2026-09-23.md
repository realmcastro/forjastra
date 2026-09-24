# Varredura do invariante 10, quarta passada: o escopo que nunca terá `RN`

> **Quarto irmão** de `captura-varredura-invariante-10-2026-09-11.md` e de
> `captura-varredura-terceira-passada-2026-09-12.md`. A §1 (ordenação), a §3 (ausências decididas) e a
> §6 (fora de escopo) do original continuam valendo e não são reenunciadas. Executa `F-016`
> (`docs/backlog/F-016-varrer-o-escopo-que-nunca-tera-rn.md`), ficha `T-0017`.
>
> **Numeração contínua:** os achados daqui são **2.15** a **2.23**. 2.1 a 2.14 moram nos irmãos e
> nenhum número se reaproveita. Nenhuma `RN` nova nasce aqui: achado vira item, `F-022` a `F-029`.

---

## 1. O conjunto, congelado em 2026-09-23

Congelado pelo conteúdo em disco no despacho, nas cinco zonas de `F-016`. Quase nada está commitado,
então `git ls-files` não serviu. **31 arquivos**, o mesmo número medido em 2026-09-12.

**`sha256` não foi calculado.** Esta passada não teve shell, só leitura e busca. O substituto
registrado é a contagem de linhas por `rg -c '.*'` no instante do congelamento, que detecta edição
grosseira e não detecta troca de conteúdo com o mesmo número de linhas. O comando da §7 calcula o
`sha256` e roda a conferência por conjunto; quem o rodar compara as contagens abaixo antes de aceitar.

| Zona | Arquivo | Linhas no congelamento |
|---|---|---|
| rules | `.claude/rules/00-nucleo.md` · `backend.md` · `backlog.md` · `coder.md` · `dados.md` · `git.md` · `handoff.md` | 125 · 77 · 176 · 46 · 103 · 128 · 122 |
| rules | `.claude/rules/memoria.md` · `migrations.md` · `performance.md` · `processo.md` · `produto.md` · `seguranca.md` · `ui.md` | 124 · 119 · 52 · 104 · 332 · 66 · 124 |
| design | `docs/design/estados-e-interacao.md` · `foco-teclado-e-leitor.md` · `grade-e-espacos.md` · `tokens.md` | 366 · 94 · 391 · 74 |
| design | `docs/design/tokens-cor.md` · `tokens-forma-e-texto.md` · `tolerancia-de-versao.md` · `vocabulario-e-eixos.md` | 394 · 188 · 98 · 394 |
| arquitetura | `docs/arquitetura/README.md` · `d-01-d-02-stack-opcoes.md` · `d-03-identidade-opcoes.md` | 8 · 407 · 397 |
| arquitetura | `docs/arquitetura/fiscal/2026-08-22-adendo-base-de-calculo-e-gorjeta.md` · `-dossie-emissao-propria.md` · `-dossie-iva-ibs-cbs.md` · `-dossie-iva-ibs-cbs-2.md` | 400 · 396 · 280 · 237 |
| raiz | `CLAUDE.md` | 219 |
| produto | `docs/produto/superficie-por-papel-momentos.md` | 289 |

**Mudou durante a passada, medido no fim:** `CLAUDE.md` passou de 219 para 223 linhas (o §7 desceu
quatro linhas). Por isso este arquivo cita `CLAUDE.md` por seção, nunca por linha; a leitura foi a da
versão congelada. Os outros 30 fecharam com a mesma contagem.

**Fora, e nomeado.** Nenhum arquivo novo com data 2026-09-23 existia em `docs/arquitetura/` no
congelamento. Dois apareceram durante a passada e ficam fora sem leitura:
`docs/arquitetura/d-06-trilha-residencia-2026-09-23.md` e
`docs/arquitetura/dinheiro-e-quantidade-2026-09-23.md`. Os arquivos de `docs/produto/` em edição por outras
instâncias hoje (`nucleo-venda.md`, `nucleo-caixa-e-turno.md`, `nucleo-estabelecimento.md`,
`papeis-e-permissoes.md`, `matriz-operacao-papel.md`, `operacao-offline-e-sincronizacao.md`,
`fatos-de-operacao.md`, `fatos-de-operacao-dominios-fechados.md`, `glossario.md`,
`fronteira-do-nucleo.md`, `modulos/perifericos.md`, `modulos/perifericos-classes.md`, e os dois novos
de 2026-09-23) **não estão no conjunto**, mas várias conferências de "o fato sobrevive em outro
endereço" apontam para eles. Onde isso acontece a conferência está marcada **adiada para a segunda
passada**, e o corpo daquele arquivo não foi lido. Título de `RN` obtido por busca de cabeçalho foi
usado como indício, nunca como citação de corpo.

## 2. Cobertura

`Qtd.` = quantas cláusulas, estados ou pontos a lente selecionou no arquivo, contados à mão. "Busca" é
a contagem medida da lista da §6, e ela infla onde o termo tem outro sentido: `piso` em
`tokens-cor.md` é quase sempre piso de contraste. Nos dossiês fiscais a seleção **é** a busca fiscal,
ocorrência por ocorrência lida.

| Arquivo | Lente | O que a lente selecionou | Qtd. | Desfecho |
|---|---|---|---|---|
| `.claude/rules/00-nucleo.md` | A | busca 5; §8 proibições (`:71-83`) e a fórmula de quatro partes do §12 (`:122-124`) | 8 | 2.17 |
| `.claude/rules/backend.md` | D · B | busca 1; decisões de borda e de composição, §1 a §5 (`:21-61`) | 9 | 2.17 · 2.18 |
| `.claude/rules/backlog.md` | B | busca 1; tabela de estado §5 e anatomia §8 | 6 | nenhum achado |
| `.claude/rules/coder.md` | A · B | busca 0; manual: §3 seis cláusulas (`:24-30`) e §4 (`:34-36`) | 7 | 2.17 |
| `.claude/rules/dados.md` | A | busca 1; exclusão lógica (`:42-44`), consolidado (`:12-13`), desligar módulo (`:84`) | 3 | nenhum achado |
| `.claude/rules/git.md` | B | busca 2; tabela pode/não pode do §2 | 5 | nenhum achado |
| `.claude/rules/handoff.md` | B | busca 1; doze campos do relatório (`:72-86`) e consulta (`:101-102`) | 13 | nenhum achado |
| `.claude/rules/memoria.md` | A | busca 1; disciplina §8, seis cláusulas | 6 | nenhum achado |
| `.claude/rules/migrations.md` | B | busca 2; checklist §10, sete perguntas (`:111-119`), ledger §2 | 8 | nenhum achado |
| `.claude/rules/performance.md` | A | busca 0; manual: quatro "Nunca" (`:46-52`) e cinco orçamentos (`:23-33`) | 9 | 2.23 |
| `.claude/rules/processo.md` | B | busca 3; definição de pronto, nove itens (`:33-46`) | 9 | 2.17 |
| `.claude/rules/produto.md` | A · D | busca 12; "Capturar é o padrão" e a dispensa da seção na forma de prova | 2 | nenhum achado |
| `.claude/rules/seguranca.md` | A · B | busca 0; manual: §2 três cláusulas (`:23-30`), §3 quatro (`:31-37`) | 7 | nenhum achado |
| `.claude/rules/ui.md` | D | busca 10; §1 cinco cláusulas (`:17-24`), zona crítica (`:113-116`), canal local (`:11-13`) | 7 | 2.15 · 2.17 · 2.19 |
| `docs/design/estados-e-interacao.md` | B · D | busca 29; oito estados (`:97-106`), §3.6 sete requisitos, §3.7, §4 casos e resíduo, lei 12 | 21 | 2.16 · 2.20 · 2.21 |
| `docs/design/foco-teclado-e-leitor.md` | D | busca 10; §6.3 cinco regras, §7 sete regras do leitor | 12 | 2.21 |
| `docs/design/grade-e-espacos.md` | D | busca 26; §5.1 três desfechos (`:271-278`), §5.2 transbordo (`:282-285`), quatro garantias do §6.3 | 8 | 2.15 |
| `docs/design/tokens.md` | A | busca 4; onze leis do §10, oito lacunas do §11 | 19 | nenhum achado |
| `docs/design/tokens-cor.md` | B | busca 26; três papéis funcionais contra os três desfechos (`:216-226`) | 3 | nenhum achado |
| `docs/design/tokens-forma-e-texto.md` | B | busca 5; `radius` (3), `layer` (5), `duration` (3) | 11 | nenhum achado |
| `docs/design/tolerancia-de-versao.md` | D | busca 19; §4.1 a §4.5, onze pontos de descarte e degradação | 11 | 2.15 · 2.16 |
| `docs/design/vocabulario-e-eixos.md` | D | busca 21; §2.3 (`:250-251`), §3.4 (`:330`), leis 11 a 15, `V-04` (`:391`) | 8 | 2.15 |
| `docs/arquitetura/README.md` | A | busca 0; manual: a única cláusula normativa (`:7`) | 1 | nenhum achado |
| `docs/arquitetura/d-01-d-02-stack-opcoes.md` | B · D | busca 16; `R-01` a `R-15`, quatro arranjos (`:249-252`) | 19 | 2.19 |
| `docs/arquitetura/d-03-identidade-opcoes.md` | B | busca 10; "torna impossível depois" das três opções, nove itens | 9 | nenhum item novo |
| `docs/arquitetura/fiscal/2026-08-22-adendo-base-de-calculo-e-gorjeta.md` | B | busca fiscal 3 (`:190`, `:287`, `:290`) | 3 | nenhum achado |
| `docs/arquitetura/fiscal/2026-08-22-dossie-emissao-propria.md` | B | busca fiscal 42; §4.3, §5.5, §6, §7 | 42 | nenhum achado |
| `docs/arquitetura/fiscal/2026-08-22-dossie-iva-ibs-cbs.md` | B | busca fiscal 2 (`:178`, `:183`) | 2 | nenhum achado |
| `docs/arquitetura/fiscal/2026-08-22-dossie-iva-ibs-cbs-2.md` | B | busca fiscal 4 (`:156`, `:216`, `:232`, `:236`) | 4 | nenhum achado |
| `CLAUDE.md` | A · D | busca 4; os dez invariantes do §7, com atenção ao 5 e ao 10 | 10 | 2.15 |
| `docs/produto/superficie-por-papel-momentos.md` | C | 85 citações de `RN` por `rg -o`; 48 em arquivo legível, 37 adiadas | 48 | 2.22 |

Nenhuma linha tem seletor zero. `superficie-por-papel-momentos.md` tinha "70 citações" medidas em
2026-09-12 e hoje `rg -o` devolve 85; a diferença não foi investigada, porque a contagem nunca foi o
critério. Das 48 citações legíveis, 26 foram conferidas contra o corpo da `RN` (`RN-NUC-020`, `022`,
`023`, `024`, `027`, `028`, `029`, `035`, `036`, `RN-OFF-022`) e 22 só contra o título.

## 3. Os achados

Ordem por prioridade: o descarte que ninguém vê vem primeiro, porque não gera chamado.

| # | Achado | Quem vê a perda | Espécie | Item |
|---|---|---|---|---|
| 2.15 | Composição degradada além do id desconhecido | ninguém | acidental | `F-022` |
| 2.16 | "Registro interno" é endereço prometido que não existe | ninguém | acidental com aparência de decidida | `F-023` |
| 2.18 | A borda do servidor decide sem deixar fato | ninguém | acidental | `F-025` |
| 2.22 | A superfície por momento diz que o registro nomeia a atribuição, sempre | ninguém, até a trilha ser lida | acidental | `F-029` |
| 2.19 | Recusa no canal local página ↔ acompanhante | ninguém | acidental, contrato inexistente | `F-026` |
| 2.20 | Gesto do operador que não chega a operação | só o operador | acidental | `F-027` |
| 2.21 | Leitura recusada durante camada modal | o operador, na camada | acidental | `F-028` |
| 2.17 | As regras que fecham comportamento não fazem a pergunta de captura | é a causa das outras | acidental | `F-024` |
| 2.23 | Orçamento do caminho crítico só existe em ensaio | ninguém | **não classificada**: pode estar decidida | sem item |

### 2.15 A composição de tela degrada sem fato, e o id desconhecido é só uma das causas

**Onde:** `tolerancia-de-versao.md:24-26` (nó inválido descartado; tela sem nó válido cai no piso),
`:50-61` (slot fixo mostra `block.fallback`; na zona crítica, bloco conhecido fora da faixa cai no
piso do papel; id desconhecido ali é ação que não acontece), `:67-69` (resposta inaproveitável não é
cacheada); `estados-e-interacao.md:58-60` (estado desconhecido é nó descartado); `grade-e-espacos.md:271-277`
(bloco fora da faixa de densidade é descartado); `vocabulario-e-eixos.md:250-251`, `:330`, `:391`
(`V-04`); `.claude/rules/ui.md:17-21`, `:113-116`.
**Não é capturado:** qual degrau da escada o terminal está servindo (rede, cache, piso embutido); que
uma resposta de manifesto chegou e foi inaproveitável; nó descartado por forma inválida, por estado
desconhecido ou por densidade fora da faixa; bloco renderizado no piso do papel; e, quando o id
desconhecido cai num slot, se o slot era de ação crítica.
**`F-012` cobre nominalmente um caso só:** o id desconhecido (`F-012:28`, aceite 1). As outras cinco
causas não aparecem nele, e o fato que ele desenha não diz a criticidade do slot, então "o caixa 3 não
tem o botão de cobrança" fica indistinguível de "o caixa 3 não tem um enfeite".
**Perde-se para sempre:** quanto tempo cada terminal operou em cache ou no piso, e qual composição
servida pelo servidor nunca foi aproveitável. Degradação silenciosa por desenho é indistinguível de
funcionamento; é o argumento de 2.14, com cinco causas a mais.
**Encaminhamento:** `F-022`, dono `produto`. **Recomendação de recorte:** fundir em `F-012` antes de
qualquer um dos dois ganhar ficha, porque a regra dona, o fato e a decisão de grão são os mesmos. Não
fundi porque esta passada só escreve de `F-022` em diante.

### 2.16 "Registro interno" é o destino de três recusas de mecanismo, e não tem endereço

**Onde:** `postura-nova-geracao.md:300-301`, `:305-307` (`PN-17`: o detalhe técnico "muda de lugar,
vai para o registro interno", e o `MELHOR EM` promete "sem perder informação");
`estados-e-interacao.md:161` ("o detalhe técnico vai para o registro interno");
`tolerancia-de-versao.md:34` ("descarte é registrado internamente").
**Não é capturado:** o detalhe técnico de toda recusa exibida ao operador. Busca por `registro
interno`, `registrado internamente` e `detalhe técnico` em `docs/**` devolve só essas quatro linhas e
a citação da terceira passada; nenhuma spec diz o que o registro contém, onde repousa, quem lê ou por
quanto tempo. `RN-NUC-043` (título: recusa é fato com motivo **enumerado**) é o candidato mais próximo,
e motivo enumerado é o contrário de detalhe técnico livre; o corpo dela está em arquivo em movimento,
conferência adiada.
**A prova de que o furo é real está no próprio `PN-17`:** o `Como se prova` (`:308-309`) varre só as
mensagens visíveis. A metade da promessa que diz "o técnico ganha registro melhor que o print da
tela" não tem aceite.
**Corrige a terceira passada:** `captura-varredura-terceira-passada-2026-09-12.md:124-128` tomou
`PN-17` como exemplar do padrão certo. O padrão está certo; a execução moveu o detalhe para um lugar
que não existe. E `tolerancia-de-versao.md:34` afirma registro que `F-012` diz não existir: uma das duas
frases está errada, e o código de `packages/sdui/src/manifest/` decide qual (pergunta ao `ui`, no relatório de `T-0017`).
**Encaminhamento:** `F-023`, dono `produto`.

### 2.17 As regras de agent que fecham comportamento não fazem a pergunta de captura

**Onde:** `.claude/rules/ui.md` e `.claude/rules/backend.md` não citam o invariante 10 nem pedem as
duas listas: busca por `registr`, `7.10`, `invariante 10`, `captura` e `fato` devolve só
`ui.md:39,107,115` e `backend.md:33,65`, e nenhuma dessas linhas trata de captura. São as duas regras
que decidem descarte, fallback, degradação e recusa de borda. `dados.md:58` (§3.1) e `produto.md` têm
a cláusula; as outras duas, não. A fórmula de quatro partes de `00-nucleo.md:122-124` não pergunta o
que o mecanismo recusado registrava. A definição de pronto (`processo.md:33-46`) não confere que o
fato listado em `Registra` existe, e `coder.md:34-36` manda testar o critério de aceite, enquanto
`backlog.md` §8 põe `Registra / Não registra` em seção separada do aceite.
**Não é capturado:** nada diretamente. É a causa: 2.14, 2.15 e 2.18 nasceram em decisões que essas
regras governam, e nenhuma delas obrigou a pergunta.
**Encaminhamento:** `F-024`, dono humano ou thread. Aplicação pode depender de permissão de escrita em
`.claude/**`, negada em 2026-09-23. O item não propõe redação.

### 2.18 A borda do servidor recusa sem deixar fato

**Onde:** `.claude/rules/backend.md:21-24` (tenant ausente é erro), `:31-32` (módulo desligado
responde "capacidade indisponível"), `:37-38` (validação na borda), `:41-42` e `:59-61` (repetição
devolve o mesmo resultado; resposta perdida depois do commit).
**Não é capturado:** requisição sem identidade ou sem tenant resolvido; entrada recusada pela
validação; pedido de capacidade desligada; reenvio de identidade já gravada, que o servidor reconhece
pela leitura de volta (`backend.md:72-75`). A regra diz o que responder e nunca o que registrar.
**Perde-se para sempre:** a sondagem de alcance a outro cliente, que é a primeira coisa procurada
quando se suspeita de vazamento; a versão de terminal que manda requisição malformada, vista em N
clientes; e a taxa de respostas perdidas por terminal. O precedente interno é `F-004` (recusa de borda
do executor vira evento), e o argumento é o mesmo: recusa que só existe no chamador some com ele.
**Por que `RN-NUC-043` não basta para a primeira causa:** requisição sem tenant não tem schema de
cliente onde cair, e `fatos-de-operacao-provedor.md:301-336` não tem linha para ela (tem
`provider_read_refused`, que é tentativa **nossa**). Para as outras três, `RN-NUC-043` pode cobrir;
conferência adiada.
**Encaminhamento:** `F-025`, dono `produto`, gate `seguranca`. O comportamento atual de `apps/api/**`
sai como pergunta ao `backend`, no relatório de `T-0017`, sem item.

### 2.19 O canal local recusa sem fato, e o contrato dele não existe

**Onde:** `d-01-d-02-stack-opcoes.md:252` ("o que ele nunca aceita da página"); `.claude/rules/ui.md:11-13`;
`F-017:59-60` põe o canal fora do próprio escopo. Nenhum arquivo de `docs/produto/**` cita
acompanhante ou canal local.
**Não é capturado:** pedido da página recusado pelo acompanhante, que é quem guarda fila, faixa e
capacidade de assinar.
**Perde-se para sempre:** a tentativa de alcançar a custódia por fora da interface, exatamente o risco
principal do arranjo `D` (`d-01-d-02-stack-opcoes.md:347-349`).
**Encaminhamento:** `F-026`, dono `produto`, **não executável** antes de existir contrato do canal
local, que não tem item nem dono declarado: o acompanhante não aparece como território em
`CLAUDE.md` §4 (pergunta ao humano, no relatório de `T-0017`).

### 2.20 O gesto do operador que não vira operação não deixa rastro

**Onde:** `estados-e-interacao.md:182-205` (a confirmação de ação irreversível tem dois desfechos,
confirmar e cancelar, e o cancelar não deixa nada); `:270-277` (atalho memorizado sem destino produz
uma resposta genérica); `:241-242` (acionar controle indisponível devolve o motivo).
**Não é capturado:** a ação irreversível levantada e desistida (cancelar venda, sangria, desconto,
reimpressão); a tecla que não resolve; o acionamento de recurso indisponível.
**Perde-se para sempre:** quantas vezes a confirmação segurou um toque errado, que é a única medida de
que a barreira funciona (`tokens-cor.md:224` já prevê que o operador **vai errar**); e o atalho velho
pressionado depois de mudança de composição, que é o sinal de memória motora quebrada que `PN-06`
existe para evitar. É a categoria "montado e abandonado" de `.claude/rules/produto.md`, na superfície.
**Conferência adiada:** `nucleo-venda.md` e `nucleo-caixa-e-turno.md` podem ter cláusula sobre
desistência; estão em movimento.
**Encaminhamento:** `F-027`, dono `produto`.

### 2.21 Leitura recusada durante camada modal é contada na tela e não vira fato

**Onde:** `foco-teclado-e-leitor.md:68-71` (recusada, contada e sinalizada dentro da camada, nunca
descartada em silêncio); `estados-e-interacao.md:349` (lei 12).
**Não é capturado:** a contagem existe para o operador saber o que reler; nenhuma spec diz que ela
vira fato. `F-007` trata leitura válida que não resolve item (`F-007:8-15`), não leitura recusada por
estado da interface.
**Encaminhamento:** `F-028`, dono `produto`, depois de `T-0016` fechar, porque os dois alteram a mesma
lista de motivos de `RN-NUC-043` e `F-007` está em execução.

### 2.22 A superfície por momento repete a regra antiga do registro e apaga a terceira fonte

As duas redações lado a lado:

- `superficie-por-papel-momentos.md:96-97`: "o registro nomeia a **atribuição mais estreita**", sem
  condição; `:180-181` repete para `owner`; `:216`, na seção sem contato: "Cada fato registra `owner`
  como autor".
- `matriz-operacao-papel-contrato.md:129-131` (`RN-NUC-028`): "**quando é atribuição que sustenta o
  ato**, o registro nomeia a atribuição mais estreita; nas outras duas fontes de `RN-NUC-029` não há
  atribuição a nomear, e o registro diz a fonte que houve". `:160-168` (`RN-NUC-029`): três fontes, e
  na terceira o registro diz também o teto do papel-piso.

**Qual estreita:** a do arquivo de momentos. Quem implementa a superfície por ela grava atribuição
onde a regra manda gravar identificação retida mais habilitação, e o desconto no teto do papel-piso
fica igual ao desconto de gerente. É a "falha aberto na trilha" que `RN-NUC-029` descreve em
`:188-191`. A mesma redação sem condição aparece em `papeis-atribuicao-e-delegacao.md:77`
(`RN-NUC-020`, "cada ato registra **qual** atribuição o autorizou"), fora do conjunto, achada na
conferência.
**Encaminhamento:** `F-029`, dono `produto`.

### 2.23 O orçamento do caminho crítico só é medido em ensaio

**Onde:** `.claude/rules/performance.md:23-33`; `offline-grandezas-e-orcamento.md:66-72` (`RN-OFF-030`:
o aceite é um **ensaio**, no terminal-alvo, com a fila no teto).
**O que pode faltar:** a latência percebida em campo, no terminal real. Não é derivável de marcos, e
`RN-NUC-045` (título: "o que não é derivável é **medida de operação**, não fato de negócio") parece
ter decidido a classe dela.
**Por que não virou item:** o corpo de `RN-NUC-045` está em `fatos-de-operacao.md`, em movimento
hoje. Se ele já dá casa à medida de operação, a ausência é decidida e um item seria o defeito de tratar
decidida como acidental. **Condição de volta:** a segunda passada lê `RN-NUC-045`; sem casa declarada,
vira item de `produto` com gate de `performance`.

## 4. Ausências decididas e fatos que sobrevivem

A lente achou a recusa, e o fato mora em outro endereço. É o material que não pede trabalho.

- **Exclusão lógica recusada** (`.claude/rules/dados.md:42-44`): o fato de tirar de circulação é
  "vigência declarada mais fato de mudança de estado", `db/convencoes.md:204`.
- **Falha de migration** (`.claude/rules/migrations.md` §2): é linha, `migration_failed` em
  `db/migrations/platform/0004__executor_events.sql:144`, e `fatos-de-operacao-provedor.md:333`
  ("falha é linha, não ausência").
- **Rejeição fiscal descartada pelo autorizador** (`fiscal/2026-08-22-dossie-emissao-propria.md:131`,
  "rejeição: descartado, não gravado" do lado do fisco): do nosso lado é estado, `RN-EMI-018` e
  `RN-EMI-019` (`fiscal-emissao-contingencia.md:76`, `:94`). O mesmo vale para as rejeições por
  ausência de IBS/CBS dos três outros dossiês fiscais. Nenhuma regra fiscal foi afirmada aqui.
- **Falha ao registrar** (`CLAUDE.md` §7.10): no caso concreto que existe, recurso local no limite, o
  descarte é contado e a contagem é fato (`fatos-de-operacao-retencao-e-descarte.md:36-41`). Outra
  causa de falha de registro não foi encontrada em spec, e inventar uma seria o defeito.
- **Minimização de dado pessoal** (`.claude/rules/seguranca.md:34`): recusa o valor, nunca o evento;
  decidida com motivo em `CLAUDE.md` §7.10, limite 1.
- **Autorização negada e depois concedida** (`seguranca.md:23-30`): o ato de autorizar é registrado
  como do autorizador (`papeis-atribuicao-e-delegacao.md:163-165`). A negação em si aponta para
  `RN-NUC-043`; conferência adiada.
- **Identificação reprovada e sinal entre clientes** (`d-03-identidade-opcoes.md:150-151`, `:201-203`):
  `F-017:95-111` nomeia `identity_unrecognized` e deixa em aberto, por escrito, a tentativa que não chega
  a operação. O sinal entre clientes perdido na Opção A é custo escrito da opção. Coberto nominalmente.
- **Relatório de handoff e consulta** (`.claude/rules/handoff.md:72-86`, `:101-102`): o ramo infeliz
  existe (`PARCIAL`, `BLOQUEIO`, `NÃO FEITO`, `RISCOS`) e fica na ficha. Consulta não importada fica sem
  registro por decisão do orquestrador. É processo, fora do alcance do invariante 10, que fala de
  operação.
- **Transbordo** (`grade-e-espacos.md:282-285`): remove slot que o contrato do bloco declarou
  descartável, por prioridade declarada. É composição decidida antes, não descarte decidido pelo
  terminal diante do desconhecido; ficou fora de 2.15 por isso.

## 5. O que esta passada não fez

- Nenhuma `RN` nova, nenhuma edição em arquivo varrido, nenhuma edição em `F-012`, `F-007` ou
  `superficie-por-papel-momentos.md`.
- Nenhuma leitura de corpo dos arquivos de `docs/produto/` em movimento. As conferências que dependiam
  deles estão marcadas "adiada" em 2.16, 2.18, 2.20, 2.23 e na §4.
- Nenhuma redação proposta para `.claude/rules/**` nem para `docs/design/**`.
- `memory/**`, `.claude/agents/**` e `apps/**`/`db/**` como corpus: fora, pelo `F-016`. Nenhum achado
  apontou memória como fonte única de comportamento, então a condição de volta de `memory/**` não
  disparou.
- As 22 citações de `superficie-por-papel-momentos.md` conferidas só contra título, e as 37 adiadas,
  continuam sem conferência de corpo.

## 6. Lista de busca dirigida usada

Terceira passada: `não registra`, `sem registro`, `não grava`, `não captura`, `não produz fato`,
`descartad`, `não é necessário`, `sem trilha`, `sem autor`. Lente D: `fallback`, `piso`, `degrad`,
`ignora`, `recusa`, `descarta`, `não existe o nó`. Os dezesseis em uma expressão, sem distinção de
caixa, sobre o conjunto: 227 ocorrências em 24 arquivos.

Acrescentada para os dossiês fiscais, porque a lista geral devolveu 3 ocorrências em 396 linhas do
dossiê de emissão e zero nos outros três: `rejei`, `deneg`, `contingên`, `inutiliz`, `cancelamento`,
`falha`, `perd[ae]`, `não registr`, `trilha` (51 ocorrências em 4 arquivos).

Para 2.16 e 2.17: `registro interno`, `registrado internamente`, `detalhe técnico`,
`diagnóstico técnico`; e `registr|7\.10|invariante 10|captura|fato` sobre `ui.md`, `backend.md` e
`processo.md`.

## 7. Conferência por conjunto, para quem tem shell

Esta passada conferiu o conjunto contra a tabela da §2 à mão, arquivo a arquivo, e não por comando.
O critério 1 de `F-016` pede a saída do comando; ela ainda não existe. O comando:

```
cd /home/mcastro/work/freelas/forja
ls CLAUDE.md .claude/rules/*.md docs/design/*.md docs/arquitetura/*.md \
   docs/arquitetura/fiscal/*.md docs/produto/superficie-por-papel-momentos.md | sort > "$TMPDIR/conjunto"
sed -n '/^## 2\. Cobertura/,/^## 3\./p' docs/produto/captura-varredura-sem-rn-2026-09-23.md \
  | grep -oE '^\| `[^`]+`' | sed -E 's/^\| `//; s/`$//' | sort > "$TMPDIR/cobertura"
comm -3 "$TMPDIR/conjunto" "$TMPDIR/cobertura"
sha256sum $(cat "$TMPDIR/conjunto")
wc -l $(cat "$TMPDIR/conjunto")
```

Desfecho esperado: `comm -3` devolve só os dois arquivos de `docs/arquitetura/` com data 2026-09-23
nomeados na §1, na primeira coluna. Qualquer outra linha, em qualquer coluna, é defeito desta cobertura.
Arquivo novo que entrar depois fica fora e é nomeado. `wc -l` difere de `rg -c '.*'` só em arquivo sem quebra de linha
final; divergência maior que uma linha contra a §1 é edição depois do congelamento.

## 8. Referências

`docs/backlog/F-016-varrer-o-escopo-que-nunca-tera-rn.md` · `F-004` · `F-007` · `F-012` · `F-017` ·
`captura-varredura-invariante-10-2026-09-11.md` §1, §3, §6 · `captura-varredura-terceira-passada-2026-09-12.md`
§2.14, §3 · `postura-nova-geracao.md:296-309` · `matriz-operacao-papel-contrato.md:120-207` ·
`papeis-atribuicao-e-delegacao.md:77`, `:161-186` · `fatos-de-operacao-provedor.md:301-336` ·
`fatos-de-operacao-retencao-e-descarte.md:32-41` · `offline-grandezas-e-orcamento.md:54-72` ·
`memory/processo/convention-achado-agrupa-por-fluxo-nunca-por-mecanismo.md` ·
`memory/plataforma/convention-ausencia-decidida-versus-acidental.md`

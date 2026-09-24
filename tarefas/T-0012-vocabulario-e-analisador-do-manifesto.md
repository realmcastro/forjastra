---
id: T-0012
backlog: SPR-45
titulo: Registro do vocabulário de ids de bloco e analisador tolerante do manifesto
status: fechada
escopo: cliente=- vertical=- modulo=- camada=ui+sdui
aberta_em: 2026-09-12
---

## Pedido

"dispare outras frentes tambem! Dos modulos se ja tivermos o core bem feito."

O núcleo de venda ainda não está modelado, então módulo não abre. O que abre é o que **não depende
do modelo de venda**: o vocabulário fechado de ids de bloco (`SPR-45`) e o analisador tolerante do
manifesto com despacho tipado (`SPR-44`). Os dois são contrato de cliente SDUI e não serão refeitos
pelo modelo de dados.

## Plano

Sem Plano de Despacho: um agent (`ui`), uma camada, nenhum gate dos cinco aplicável
(`processo.md` §5). Dois itens de backlog na mesma branch porque o segundo consome o primeiro —
`SPR-45` produz o registro que `SPR-44` usa como universo fechado.

**Abertura de território declarada.** `packages/sdui/**` nasce aqui, antes da fase que o criaria
(`processo.md` §4). Mesma justificativa que abriu `apps/api/**` em 2026-09-11: o analisador do
manifesto não depende do modelo de venda nem do contrato de rota, então a fase seguinte não o
refaz. `apps/web/**` **não** abre nesta ficha.


---

## ui — 2026-09-12

## RELATÓRIO — ui — T-0012
STATUS: OK
FEITO:
- Abri `packages/sdui/**` com o mesmo arranjo de `apps/api` (pacote próprio, `tsc` estrito,
  `node --test` sobre o build). Nenhuma dependência nova: `typescript` 7.0.2 e `@types/node`
  22.20.2, as mesmas versões já em uso.
- `SPR-45`: registro executável do vocabulário — 8 papéis com função, emissão, status e zonas
  admitidas; registro de prefixos com espécie, arquivo dono e exposição de rede; livro
  append-only de ids publicados (vazio hoje, e isso é fato); `checkVocabulary` cobrando as leis
  do §1 e do §5 (forma do id, prefixo registrado, uma espécie por prefixo, zona crítica só de
  `block.command`, id publicado que some).
- Renomeei `block.line-collection` → `block.record-collection` em `docs/design/` e no registro.
- `SPR-44`: analisador que não lança em nenhum caminho, guardas nomeadas, descarte por nó com
  irmão sobrevivente, piso em zona de contagem fixa, despacho tipado com piso obrigatório no
  tipo, e a escada rede → cache → piso com recusa de cachear resposta inaproveitável.
- 17 manifestos hostis nomeados um a um em `test/fixtures.ts`, cada um com desfecho afirmado.
ARQUIVOS:
- `packages/sdui/**` (novo — 22 arquivos versionáveis; `src/` 8 módulos, `test/` 6 arquivos)
- `docs/design/vocabulario-e-eixos.md` (editado — rename, coluna de rede do prefixo `block.`,
  ponteiro para o espelho executável, `D-02` fechada, parse sai da lista da Fase 3)
- `docs/design/tolerancia-de-versao.md` (editado — o §4 deixou de esperar `D-02`)
NÃO FEITO: —
DECISÕES:
- **Rename `block.line-collection` → `block.record-collection`.** "Linha" é aparência, e o §1.2
  usa esse par ("o que é cartão em um espaço é linha em outro") como argumento contra aparência
  no nome. Legal agora porque o livro de publicados está vazio: nada atravessou a rede.
- **`block.` continua um prefixo só.** Papel emitido e entrada de piso são a mesma espécie; o
  que muda é quem emite, e cada entrada declara. A quarta coluna do §1.5 virou `by-entry`.
- **`checkVocabulary` não roda na importação e não lança.** Registro malformado é defeito de
  build, e processo que não sobe é pior que um id a menos. Quem cobra é o teste.
- **Criticidade do slot não entra no analisador.** A zona já resolve o que ele precisa; o campo
  (V-02) alimenta densidade, que é resolução de variante (`SPR-47`).
- **Nomes de campo do nó em `src/manifest/wire.ts`, um lugar só**, porque V-02 é de `backend`.
- **Props são escalar ou lista de escalar.** Estrutura aninhada é nó filho, que tem papel, zona
  e ordinal — aceitar objeto solto abriria um segundo canal de composição sem contrato.
- Registro é **dado tipado**, não código gerado: geração exigiria uma etapa de build para um
  arquivo que muda por decisão registrada, não por rotina.
RISCOS:
- `BlockRenderers<T>` impede tabela **incompleta**, não impede alguém alargar de propósito para
  `Record<string, (n: unknown) => T>`: TypeScript não tem tipo de objeto exato. Literal é barrado
  pela checagem de excedente. Está escrito no topo de `dispatch.ts`; o resto é revisão.
- `tarefas/T-0002-*.md` cita `block.line-collection` (linhas 652 e 804). É ficha fechada e
  histórico — não reescrevi.
- `MAX_NODE_DEPTH` (32) e `MAX_NODES` (2000) são escolha minha, não medida. Manifesto real não
  chega perto, mas o teto vira descarte silencioso se algum dia chegar.
PERGUNTAS:
  - para backend: V-02 — quais são os nomes dos campos do nó no manifesto, e como se chama o
    campo de criticidade do slot? Os provisórios estão em `packages/sdui/src/manifest/wire.ts`.
  - para backend: o tipo `BlockKind` de `@forja/sdui` deve ser importado por `apps/api` para o
    emissor não compilar com id fora do vocabulário — o passo é seu território, não o meu.
VERIFICAÇÃO:
- `npm run typecheck` (tsc estrito, `--noEmit`) em `packages/sdui`: código de saída **0**.
- `npm test` (build + `node --test`): **40 testes, 40 passando, 0 falhando, 0 pulados, 0 todo**,
  código de saída **0**. Seis deles são de compilação (`test/types.test.ts`): cada
  `@ts-expect-error` falha o `tsc` se o erro esperado deixar de existir.
- Não rodei nada em `apps/api` — não toquei lá.
MEMÓRIA SUGERIDA:
  - type=decision escopo=plataforma camada=sdui slug=decision-id-de-bloco-nomeia-registro-e-imutavel —
    o vocabulário de bloco virou tipo fechado em `packages/sdui`; enquanto o livro de publicados
    estiver vazio, renomear custa um `sed`; depois da primeira emissão, é impossível.
  - type=gotcha escopo=plataforma camada=sdui slug=gotcha-tabela-de-renderizador-nao-barra-record-generico —
    tabela total sobre `BlockKind` impede papel faltando, não impede alargar para
    `Record<string, fn>`: TypeScript não tem tipo exato, e a lei 12 depende de revisão nesse caso.
  - type=state escopo=plataforma camada=sdui slug=state-packages-sdui-aberto-2026-09-12 —
    `packages/sdui/**` existe desde 2026-09-12 com vocabulário e analisador; `apps/web/**`
    continua fechado.
PRÓXIMO PASSO SUGERIDO: backend — responder V-02 (nomes dos campos do nó e da criticidade) e
consumir `BlockKind` de `@forja/sdui` no emissor de manifesto, para id fora do vocabulário não
compilar também do lado do servidor.

---

## Fechamento — 2026-09-12

ENTREGUE:
- **`SPR-45`** — o vocabulário de ids de bloco deixou de existir só em prosa: `packages/sdui/src/vocabulary/`
  carrega os 8 papéis como união fechada de literais, mais o registro de prefixos, o livro append-only de
  publicados e `checkVocabulary`, que cobra as leis do §1 e do §5 em teste. Os três critérios de aceite do
  item estão provados, um a um: id fora do vocabulário não compila (`test/types.test.ts:14,18`), duas
  espécies no mesmo prefixo são recusadas (`test/vocabulary.test.ts:76`), e id publicado que some do
  registro é erro, não limpeza (`test/vocabulary.test.ts:101`).
- **`SPR-44`** — o analisador não lança em caminho nenhum, o nó inválido é descartado com o irmão de pé, o
  slot de contagem fixa vira piso em vez de colapsar, o despacho é tipado com piso **obrigatório no tipo**,
  e a escada rede → cache → piso recusa cachear resposta inaproveitável. A bateria de manifestos hostis do
  critério de aceite está nomeada uma a uma e cada entrada tem desfecho afirmado.
- `block.line-collection` virou `block.record-collection`, dentro da janela em que isso ainda é um `sed`.
- Três registros de memória, que é onde o não derivável desta ficha ficou.

ARQUIVOS:
- `packages/sdui/**` (novo — 22 arquivos versionados: 12 em `src/`, 6 em `test/`, 4 de configuração)
- `docs/design/vocabulario-e-eixos.md`, `docs/design/tolerancia-de-versao.md` (editados)
- `memory/plataforma/decision-vocabulario-de-bloco-tem-espelho-executavel.md` (novo)
- `memory/plataforma/gotcha-tabela-total-nao-barra-tipo-alargado.md` (novo)
- `memory/plataforma/state-packages-sdui-aberto-2026-09-12.md` (novo)
- `memory/plataforma/INDEX.md` (editado — três linhas, na mesma passada)

VERIFICAÇÃO — rodada por mim, não herdada do relatório:
- `npx tsc --noEmit` em `packages/sdui`: código de saída **0**. Isso vale por seis asserções: com
  `noUnusedLocals` e a checagem de `@ts-expect-error`, diretiva que deixasse de suprimir um erro real
  falharia o type check. As garantias de compilação do `SPR-44` e do `SPR-45` estão, portanto, medidas.
- Build para diretório fora da árvore + `node --test`: **40 testes, 40 passando, 0 falhando, 0 pulados**.
  Não escrevi em `packages/**`.
- **Cobertura do critério de aceite do `SPR-44`, exigência por exigência** (é o que o item pede nominalmente,
  então confiro nominalmente): manifesto vazio → fixture 11, teste 11; truncado no meio do nó → 3, teste 3;
  JSON inválido → 2, teste 2; `kind` desconhecido → 4 e 9; `kind` conhecido com props erradas → 6, teste 6;
  válido entre dois inválidos → 8, teste 8 (os dois descartes nomeados, o do meio renderiza); profundidade
  absurda → 12, teste 12 (400 níveis); referência circular → 13, teste 13; id desconhecido em zona de ação
  crítica → 9, `test/dispatch.test.ts:38`, que afirma as **três** coisas: o slot vira piso, o slot não
  colapsa, e nenhuma ação é oferecida na tela inteira. "Em nenhum caso lança" e "em nenhum caso a tela fica
  vazia" têm teste próprio de varredura (`parse.test.ts:169`, `degradation.test.ts:73`). **Nenhuma exigência
  nomeada ficou sem teste.**
- **Abertura de território, julgada contra o que foi escrito e não contra a intenção:** listei todo `import`
  do pacote — só caminhos relativos internos, mais `node:test` e `node:assert` nos testes. Nenhuma
  referência a `db/**`, a `apps/api` ou a entidade do modelo de venda. `source` é string **opaca**: carregada,
  nunca resolvida, nunca interpretada. A justificativa se sustenta — o modelo de venda não refaz nada disto.
  `apps/web/` **não existe** no repositório.
- **Rename:** `PUBLISHED_KINDS` está **vazio** (`src/vocabulary/published.ts:26`), então a janela do §1.4
  estava mesmo aberta. Varri o repositório inteiro por `line-collection`: sobrou no registro deliberado da
  troca (`vocabulario-e-eixos.md:308`), nas três linhas do relatório acima, e em `tarefas/T-0002-…:652,804`.
  **A ficha `T-0002` está fechada e não foi tocada, de propósito** — ficha fechada é o histórico de por quê
  as coisas eram como eram; reescrevê-la para casar com o presente apagaria a única evidência de que o nome
  mudou.
- Nenhuma dependência nova: `typescript` 7.0.2 e `@types/node` 22.20.2, as duas de desenvolvimento, nas
  mesmas versões de `apps/api`. Zero dependência de runtime.
- Nenhum segredo: varrido o pacote inteiro; as únicas ocorrências de "token" são "token de estilo".
- Contagem do relatório conferida: 22 arquivos está certo; "`src/` 8 módulos" está errado — são **12**
  arquivos em `src/`. Só a contagem.

PRONTO — item por item (`processo.md` §2):
- **Regra de negócio com `RN`** — *não se aplica:* nenhuma regra de negócio nasce aqui. O que este bloco
  implementa é contrato de design já aprovado (as leis 11 a 16 de `vocabulario-e-eixos.md` §5), ancorado em
  `PN-06` e `PN-15`, e o código cita os dois (`src/vocabulary/zones.ts:4`, `src/manifest/screen.ts:63`).
- **Teste do caso concreto** — cumprido, e verificado por mim acima, inclusive na forma que nenhum `assert`
  alcança (as seis asserções de compilação).
- **DDL** — não se aplica: nenhum arquivo em `db/**`.
- **Endpoint, gate de `seguranca`** — não se aplica: o pacote é lógica pura, sem rota, sem E/S, sem banco,
  sem autorização e sem dado de cliente. A auditoria que **vai** valer está no `SOBROU`, com gatilho.
- **Consulta, lista, relatório ou tela, gate de `performance`** — não se aplica: não há consulta, não há
  render e não há tela. O que sobra de custo aqui são dois tetos não medidos, e eles estão no `SOBROU`.
- **Decisão não óbvia virou registro** — cumprido: três registros, com as três linhas de índice na mesma
  passada.
- **Nada de segredo** — cumprido, varrido.
- **Toda `MEMÓRIA SUGERIDA` avaliada** — as três foram **escritas**, duas delas com escopo e slug meus:
  1. `decision` — escrita como `decision-vocabulario-de-bloco-tem-espelho-executavel`. O slug sugerido
     ("id de bloco nomeia registro e é imutável") nomeia a lei, que já existe em `.claude/rules/ui.md` e no
     §1.4 e seria duplicata; o que não é derivável é o **arranjo**: o vocabulário passou a existir duas vezes,
     com autoridades diferentes, e a janela do rename tem prova de estar aberta (`published.ts` vazio).
     Ela **não** foi fundida em [[convention-prefixo-de-token-uma-especie]], que cobre prefixo e espécie —
     escopo vizinho, assunto outro. Ficaram ligadas por `relaciona`.
  2. `gotcha` — escrita, **alargada de propósito**. Respondendo à pergunta do despacho: a forma de hoje
     **não** é suficiente. O comentário em `dispatch.ts:18` alcança quem lê `dispatch.ts`; ele não alcança
     quem, daqui a três meses, escrever a tabela exaustiva do emissor em `apps/api` ou do catálogo em
     `apps/web` — e é lá que o mesmo buraco reaparece. O registro fala de **qualquer** tabela exaustiva e
     termina em duas regras de revisão, porque o que o compilador não pega só sobrevive como critério de
     revisão.
  3. `state` — escrita, com duas divergências que o relatório não tinha: o `CLAUDE.md` §2 ainda declara
     `packages/**` proibido, e não há workspace na raiz, então `apps/api` ainda não **resolve**
     `@forja/sdui`.
- **Ficha com plano, relatório verbatim e fechamento** — cumprido. O relatório do `ui` está inteiro e
  intocado.
- **Par item ↔ ficha** — *desvio declarado:* esta ficha fecha **dois** itens (`SPR-45` e `SPR-44`), contra o
  um-para-um de `backlog.md` §4. Não é recorte ruim e não se conserta quebrando a ficha: `SPR-44` consome o
  universo fechado que `SPR-45` produz, e separar teria posto a metade do analisador contra um vocabulário
  que ainda não compilava. As duas linhas do `docs/backlog/INDEX.md` apontam para esta ficha.

SOBROU — com dono:
- **V-02: nomes dos campos do nó e do campo de criticidade** — dono `backend`. Não trava nada: os provisórios
  estão em `packages/sdui/src/manifest/wire.ts`, num lugar só, com teste que os fixa. Fechar V-02 é editar um
  arquivo e ver um teste falhar, que foi como o autor projetou.
- **Importar `BlockKind` de `@forja/sdui` no emissor** — dono `backend`. É a metade "no servidor" do
  entregável do `SPR-45`, e **hoje ela não tem em que morder**: `apps/api` não tem rota de negócio, não emite
  manifesto e não nomeia nenhum id de bloco (conferido). Antes dela, uma decisão pequena que ninguém tomou:
  sem workspace na raiz, `apps/api` não resolve `@forja/sdui`. Gatilho: a primeira rota que emite manifesto.
- **`MAX_NODE_DEPTH` (32) e `MAX_NODES` (2000) são escolha do autor, não medida** — dono `performance`.
  Nenhum número saiu de medição, e o efeito de errá-los para baixo é descarte silencioso de nó legítimo;
  para cima, trabalho comprado por entrada hostil. Medir só faz sentido com manifesto real e terminal real,
  o que é Fase 3.
- **Auditoria de `seguranca` do analisador** — dono `seguranca`, gatilho: a primeira rota que emite manifesto
  de verdade. Hoje a superfície é hostil por desenho e inerte por falta de emissor; o pacote já se defende de
  chave envenenada e trata string da rede como dado, com teste. O que a auditoria vai ter para olhar só passa
  a existir quando o manifesto atravessar a rede.
- **O registro executável de prefixos cobre 8 dos 19 prefixos do §1.5** — dono `ui`. Faltam os que vivem em
  outros arquivos do sistema de design (`color.`, `type.`, `radius.`, `stroke.`, `focus.`, `elevation.`,
  `layer.`, `duration.`, `grid.`, `target.`, `measure.`). A falta **falha fechado** — um id desses submetido a
  `checkVocabulary` viraria `prefix-not-registered`, que é recusa, não vazamento —, mas o cabeçalho de
  `prefixes.ts` diz "prefixo que não tem linha aqui não existe", e isso hoje é mais forte do que o arquivo
  cumpre.
- **`CLAUDE.md` §2 desatualizado** — dono humano / thread principal. Ele ainda diz que `packages/**` está
  proibido até a fase que o cria. Agent não edita.
- **A lacuna V-01 aponta para um registro de memória que não existe mais** — dono `ui`. O
  `memory/plataforma/state-sessao-2026-08-22-tres-fichas-abertas.md` citado em
  `vocabulario-e-eixos.md` §6 já foi removido; a ressalva da linha pode cair na próxima edição do arquivo.

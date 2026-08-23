---
id: T-0002
titulo: Sistema de design do núcleo (tokens, grade, estado, vocabulário)
status: fechada
fechada_em: 2026-08-23
escopo: cliente=- vertical=- modulo=- camada=ui
aberta_em: 2026-08-22
---

## Pedido

> Verbatim do humano.

aproveitando que já estamos na pegada do produto, vamos definir cores, padrões, e estruturas de
layout. Tomaremos com referência o mobile first. Teremos como referência o minimalismo suíço para
layout, com cores a princípio azuis claro e Minimalismo Suíço (Corporate/Tech)
Grade modular rigorosa (Grid Suíço); tipografia grotesca (Helvetica-like), alinhamento à
esquerda; base branca/cinza com UM acento saturado (azul elétrico, laranja ou verde);
alto contraste funcional; ícones geométricos; sensação de eficiência e precisão.
Uso típico: SaaS, startups de tecnologia, consultorias, plataformas B2B e dashboards.
#FFFFFF #1A1A1A #F2F2F2 #2E6BFF o resto voce define com base nessa base. Nao se aquenhe a
adicionar regras aos agents de UI e Front....

## Plano

### Decisões de enquadramento (são parte do brief)

**Onde mora:** `docs/design/`, dono `ui`. Único lugar que não viola `processo.md` §4 — não cria
`apps/web/**` (Fase 3) nem invade `docs/produto/**`. A linha de território em `CLAUDE.md` §4 é
escrita pelo thread principal, não por `ui`.

**D-02 não bloqueia.** Fronteira exata:

| Entrega (agnóstico) | `BLOQUEIO` |
|---|---|
| nome e valor de token, escala tipográfica, escala de espaçamento, grade, breakpoints, faixas de densidade, alvo de toque, vocabulário de estado, razão de contraste, papel de bloco | qualquer arquivo de código; config de framework; escolha de biblioteca de ícone; **mecanismo** de tema; layout de pacote; escolha de fonte licenciada |

Fonte: especifica-se a **classe** (grotesca neutra) e as **características exigidas** — algarismo
**tabular** obrigatório (coluna de preço/quantidade com largura de dígito variável é defeito de
leitura num caixa), altura-x alta, `0/O` e `1/l/I` distinguíveis. Família licenciada é dependência:
`PERGUNTAS: para humano`.

**A tensão dashboard-vs-caixa, resolvida nos três pontos onde as duas coisas colidem** — em todos
os três o default do agent é o lado errado:

1. **Densidade.** Dashboard otimiza densidade de informação; caixa otimiza alvo e legibilidade de
   relance. Resolução: a grade deriva de **alvo de toque e distância de leitura por espaço**, não de
   contagem fixa de colunas. Densidade é faixa declarada.
2. **Contenção vs sinalização.** Minimalismo remove borda, preenchimento e sombra; caixa exige
   feedback inequívoco e pista óbvia de irreversibilidade. Lei: **minimalismo se aplica a ornamento,
   nunca a sinalização de estado nem a alvo de toque.**
3. **"Um acento saturado" — maior risco da ficha.** Ao pé da letra, entrega um PDV onde venda
   cancelada e pagamento aprovado têm a mesma cor. Frouxo, entrega cinco matizes e queima o brief.
   Resolução: **um acento de marca/ação (`#2E6BFF`)** mais um **conjunto funcional mínimo**
   (perigo, sucesso, atenção) que é **só de estado**, nunca decorativo, nunca segundo acento de
   marca, justificado item por item. Sem justificativa, não existe.

**"Mobile-first" é método, não alvo literal:** parte da restrição mais apertada (menor viewport, um
polegar, pior rede) e sobe. Alvo literal de telefone existe em um espaço só — pedido pelo
cliente-final (`PCF`). O display fixo de produção é o **inverso** de mobile (leitura a 2–3 m, sem
toque). O agent declara, por espaço, se ali mobile-first é método ou alvo.

**Nome de espaço é funcional, nunca de ramo.** "Telão de cozinha" é léxico de vertical: no sistema
de design do núcleo o espaço é *display fixo de leitura à distância*, e `COZ` é quem o usa
(invariante §7.3).

**Tema:** token em **duas camadas** — primitiva (rampa de valor) e semântica (papel, referenciando a
primitiva). Nada fora da camada primitiva contém valor literal. **Nenhum tema escuro entregue**;
pergunta registrada ao humano (driver: display de produção em ambiente escuro vs terminal em loja
com vitrine).

**Contraste: campo obrigatório E verificação.** Cada par semântico declara o mínimo exigido (piso
WCAG AA: 4.5:1 texto normal, 3:1 texto grande e componente) e o valor **medido**. `ui` não escreve
número que não recebeu (núcleo §4).

### Medição já feita pelo thread principal (2026-08-22) — entrada do passo 1

| par | razão | corpo 4.5:1 | UI/grande 3:1 |
|---|---|---|---|
| `#2E6BFF` sobre `#FFFFFF` | **4.50** | passa, margem **zero** | passa |
| `#2E6BFF` sobre `#F2F2F2` | **4.02** | **REPROVA** | passa |
| `#FFFFFF` sobre `#2E6BFF` | 4.50 | passa | passa |
| `#1A1A1A` sobre `#2E6BFF` | 3.86 | **REPROVA** | passa |
| `#1A1A1A` sobre `#FFFFFF` | 17.40 | passa | passa |
| `#1A1A1A` sobre `#F2F2F2` | 15.55 | passa | passa |

Consequência estrutural: o acento serve como **fundo de botão** e como texto sobre branco **por um
fio** — e **não serve** para texto sobre o cinza. A paleta precisa de uma **variante escurecida do
acento para texto**. Medido com a fórmula de luminância relativa WCAG.

### Passos

1. **`ui`** — Tokens. Paleta em duas camadas; um acento de marca/ação; conjunto funcional mínimo
   justificado item por item; escala tipográfica (classe grotesca, características exigidas, sem
   família), escala de espaçamento, raio, elevação, duração de feedback. Cada par semântico declara
   o mínimo exigido; `MEDIDO:` vazio para os pares derivados (os seis acima já vêm medidos).
   Nenhum token semântico nomeado por cor. — entrega: `docs/design/tokens.md` — **sequencial**
2. **`coder`** — Medição de contraste dos pares derivados. Fórmula WCAG, stdlib, sem dependência,
   script e saída **só** no scratchpad. Devolve `par → razão → passa/reprova`. Não altera
   `docs/design/**`, não opina sobre design. — **depende de 1; paralelo com 3**
2b. **`ui`** — Correção de paleta, **condicional**: só se o passo 2 reprovar par. Se reprovar par com
   o acento em corpo de texto, a saída é **variante de acento para texto**, nunca afrouxar o piso.
3. **`ui`** — Grade, espaço e densidade. `docs/design/grade-e-espacos.md` — **depende de 1**
4. **`ui`** — Estado e interação, com as faixas de rede de
   `docs/produto/operacao-offline-e-sincronizacao.md` mapeadas para estado visível.
   `docs/design/estados-e-interacao.md` — **depende de 3**
5. **`ui`** — Lei de nomeação, eixos de variante/slot, semente mínima de papéis de bloco.
   `docs/design/vocabulario-e-eixos.md` — **depende de 4**
6. **thread principal** — regra nova em `.claude/rules/ui.md` + linha de território em
   `CLAUDE.md` §4. — **último**

**ORDEM:** `1` → `[2 ‖ 3]` → `2b (condicional)` → `4` → `5` → `6`.

**GATES:** 1 não se aplica (nada é regra de negócio); 2 não se aplica; 3 não se aplica como gate —
vira requisito de uma linha no passo 4 (**"sem permissão" não revela a existência do recurso
negado**); 4 não se aplica (nada renderiza), agendado para a Fase 3, e o brief **proíbe** número de
render/bundle/tempo; 5 ativo, com a fronteira D-02 como gatilho mais provável.

**RISCO PRINCIPAL:** entregar um design system de SaaS que morre num terminal de caixa, por um dos
três pontos de colisão acima. Secundário: número de contraste escrito por estimativa.

## ui (passo 1) — 2026-08-22

## RELATÓRIO — ui — T-0002
STATUS: OK
FEITO:
- Criei `docs/design/tokens.md` (398 linhas) com paleta em duas camadas: primitiva (única com hex) e
  semântica (papel, referenciando primitiva). Nenhum token semântico nomeado por cor.
- Derivei `color.blue.700` `#1E56E6` — o acento escurecido para **texto**, exigido pela medição
  recebida. Derivação por redução de luminância relativa preservando o matiz da âncora (~223°): não
  é um azul novo, é a mesma cor mais escura. Não afrouxei nenhum piso.
- Mantive `#2E6BFF` como preenchimento da ação primária (4,50 medido com conteúdo branco) e
  transformei a margem zero em requisito tipográfico: rótulo de ação primária é texto grande por
  regra (piso `type.size.300` + peso 600), onde o exigido é 3:1 e a margem é folgada.
- Anel de foco **acromático** (`color.neutral.900`): é a única cor que lê sobre branco, sobre o
  cinza e sobre o próprio acento — e os três pares já vinham medidos (17,40 / 15,55 / 3,86).
- Conjunto funcional mínimo `danger` / `success` / `attention`, justificado item por item por
  consequência de operação, e ancorado em `RN-OFF-002` (o desfecho é um de três, e só três).
- Tipografia por classe e característica (tabular obrigatório, altura-x alta, `0/O` e `1/l/I`
  distinguíveis, nada abaixo de peso 400), escala 1,25 com dois desvios declarados e piso de
  legibilidade explícito. Sem família.
- Escala de espaçamento (base 8, aditiva em quartos), raio com significado de forma, traço,
  elevação sem sombra + o único caso funcional de sombra, ordem de camada, duração de feedback.
- 28 pares de contraste tabelados com mínimo exigido; `MEDIDO` preenchido só nos seis pares
  recebidos, vazio nos derivados.
ARQUIVOS: `docs/design/tokens.md` (novo)
NÃO FEITO: —
DECISÕES:
- **Identificador de token em inglês**, prosa em pt-BR. O brief nomeou os tokens em pt-BR
  (`superficie`, `acao`), mas token é identificador de código e a lei de idioma do projeto manda
  inglês — o glossário de produto já faz exatamente isso (termo pt-BR, nome em inglês). Deixei a
  tabela de mapeamento dos sete nomes do brief no §1 para que nada se perca. Renomear agora custa um
  arquivo; renomear depois do primeiro componente custa o catálogo. Reversível em uma passada.
- `color.action-on` (conteúdo **sobre** o preenchimento) e `color.action-text` (acento **como**
  texto) são dois tokens e o `acao-texto` do brief é o primeiro. Nomes próximos, erro de troca
  provável — o §1 diz isso explicitamente.
- **Não existe token de *hover***. Onde houver ponteiro, ele reusa `action-pressed`. Token sem papel
  próprio é degrau que apodrece, e hover não pode portar informação essencial num terminal.
- **Não existe token para "sem permissão"**. Ausência por autorização é ausência: controle apagado
  revela que o recurso existe. `disabled` cobre só indisponibilidade temporária (módulo desligado,
  dependência offline), sempre com motivo em texto. Isto é insumo do passo 4, não decisão dele.
- **Piso de 4,5:1 para texto desabilitado**, mais estrito que WCAG (que isenta desabilitado). Botão
  ilegível no caixa é chamada de suporte com fila na frente; indisponibilidade se sinaliza pela
  perda do acento, nunca pela perda de legibilidade.
- Âmbar tem dois degraus de uso e é o único `-on` **escuro** do sistema: âmbar escuro o bastante
  para receber branco lê como marrom e deixa de sinalizar "pendente".
RISCOS:
- `danger` e `success` estão em luminâncias próximas: em escala de cinza, e para quem não distingue
  vermelho de verde, são quase o mesmo valor. Escolhi cada um pelo contraste com o **fundo**, não
  entre si — por isso "estado nunca só por cor" é lei no §10.4 e não recomendação. Se o passo 4
  sinalizar recusa e conclusão só por cor, o sistema falha exatamente no par mais caro do caixa.
- A margem zero de `#2E6BFF` com branco só é aceitável enquanto o rótulo de ação primária continuar
  grande. Passo 3 e passo 4 não podem reduzir esse rótulo sem voltar a este arquivo.
- O arquivo está em 398 de 400 linhas. Correção do passo 2b, ou qualquer token novo, **estoura**.
  Proposta de corte quando isso acontecer: dividir em `tokens-cor.md` (§1–5, §11) e
  `tokens-forma-e-texto.md` (§6–10), sem cortar token nem justificativa.
- `#EAF0FF`, `#FDECEA`, `#E8F4EC`, `#FFF4E0` são tintas de fundo: se algum deles reprovar com
  `text-primary` no passo 2, a correção é escurecer a tinta, nunca clarear o texto.
PERGUNTAS:
- para humano: qual família ocupa a classe grotesca neutra? É dependência licenciada e eu não a
  escolho (L-01). As características exigidas já estão travadas no §6 e valem como filtro.
- para humano: tema escuro entra? O driver não é gosto: é o display fixo de leitura a distância em
  ambiente escuro contra o terminal em loja com vitrine. A camada dupla já deixa isso ser troca de
  valor primitivo; não entreguei nada de escuro (L-02).
- para humano: confirma identificador de token em **inglês** (ver DECISÕES)? Se preferir pt-BR, é
  uma renomeação de um arquivo, e é agora que ela é barata.
VERIFICAÇÃO: contei 398 linhas (`wc -l`); confirmei que nenhum hex ocorre fora da camada primitiva
e da tabela de medição recebida (`grep`); confirmei zero termo de vertical (`mesa|comanda|bomba|
cozinha|restaurante|posto`) no arquivo; conferi que a numeração de seções não tem buraco.
**Não medi contraste nenhum** — a medição é do passo 2, e não escrevi número que não recebi. Os
únicos números de contraste no arquivo são os seis do brief.
MEMÓRIA SUGERIDA:
- type=decision escopo=plataforma camada=ui slug=decision-token-em-duas-camadas — token de cor tem
  camada primitiva (única com hex) e camada semântica por papel; troca de tema é troca de valor
  primitivo, e componente nunca referencia primitiva.
- type=decision escopo=plataforma camada=ui slug=decision-acento-nao-e-texto — `#2E6BFF` reprova
  4,5:1 sobre `#F2F2F2` e passa sobre branco com margem zero: o acento é preenchimento de ação, e
  quem faz texto é a variante escurecida `#1E56E6`; piso não se afrouxa para caber cor.
- type=decision escopo=plataforma camada=ui slug=decision-foco-acromatico — anel de foco é
  `#1A1A1A`, não o acento, porque precisa ler sobre branco, sobre o cinza e sobre o próprio botão
  primário focado (3,86 medido).
- type=business-rule escopo=plataforma camada=ui slug=rule-tres-estados-funcionais — o conjunto
  funcional de cor é exatamente três (perigo, sucesso, atenção) porque `RN-OFF-002` fixa três
  desfechos e só três; um quarto matiz codificaria desfecho que o produto recusa.
- type=convention escopo=plataforma camada=ui slug=convention-estado-nunca-so-por-cor — vermelho e
  verde do núcleo são quase o mesmo valor em escala de cinza; todo estado carrega sinal
  não-cromático (forma, ícone, posição fixa ou texto).
PRÓXIMO PASSO SUGERIDO: `coder` — medir os pares de `docs/design/tokens.md` §5 com `MEDIDO` vazio
(fórmula WCAG, stdlib, script e saída só no scratchpad), devolvendo `par → razão → passa/reprova`.
Em paralelo, `ui` (passo 3) pode partir das escalas do §6–§8, que já estão fechadas.

## ui (passo 2b) — 2026-08-22

## RELATÓRIO — ui — T-0002 (passo 2b)
STATUS: PARCIAL
FEITO:
- **Tarefa 1 — `focus-ring`/`danger` = 2,89 resolvido sem afrouxar o piso e sem repintar `danger`.**
  O indicador de foco deixou de ser um anel de uma cor e passou a ser um **par de contornos
  contíguos**: `color.focus-ring` (`neutral.900`, membro escuro, `stroke.300` = 3) mais
  `color.focus-ring-contrast` (`neutral.000`, membro claro, 2). Um token semântico novo, geometria e
  footprint idênticos (5 px por lado fora da borda do alvo): a banda de 2 px que era **vaga
  transparente** agora é **pintada**. Nada de `grade-e-espacos.md` se recalcula.
- Substituí a generalização que caiu por uma propriedade do par: **nenhuma cor pode reprovar 3:1
  contra branco e contra `neutral.900` ao mesmo tempo** — a luminância exigida para reprovar num caso
  é incompatível com a do outro. Deixou de ser conjunto de fundos verificado caso a caso.
- Perna não-cromática (§10.4 aplicado ao foco): `stroke.300` e a geometria de **contorno duplo**
  ficam reservadas ao foco e a nada mais — o indicador é reconhecível por espessura e duplicidade
  mesmo onde um dos membros tem contraste fraco.
- **Tarefa 2 — os 36 valores transcritos**, mais `border`/`surface-raised` 1,28 como informativo.
  Nenhum número escrito fora da lista recebida. Registrei as **cinco margens apertadas** em §3.4
  (`action` 0,07% · `border-strong`/`surface` 2,7% · `focus-ring`/`success` 7,7% ·
  `success-text`/`success-surface` 6,0% · `success-text`/`surface` 6,9%) com o aviso de que mexer em
  `blue.500`, `green.700` ou `neutral.400` **exige** remedir.
- **Tarefa 3.1 — contagem reconciliada.** O "28 pares" estava errado em todas as leituras. §5 agora
  declara o inventário explícito: **33 linhas de tabela de par → 43 pares conteúdo×fundo**; 41 com
  piso declarado, 2 isentos e informativos; 40 com valor, **1 pendente**; 45 células de valor (o par
  de foco tem uma por membro), das quais 37 vêm do passo 2 e 8 são derivadas por **identidade de
  primitiva**, marcadas `†`.
- **Tarefa 3.2 — piso unificado.** Conteúdo sobre preenchimento exige **4,5** nos quatro casos
  (era 3 para `action-on`/`action` e 4,5 nos outros três). Os quatro passam: 4,50 · 6,02 · 5,39 ·
  8,59. Nenhum veredito mudou. O rótulo grande da ação primária continua **obrigatório**, agora por
  legibilidade de relance e pela margem de 0,07% — não como desconto de contraste. `grade-e-espacos.md`
  §4 (piso 20 em todas as faixas) segue sustentado.
- **Divisão do arquivo** (398/400 linhas + 36 números + 1 token): três arquivos, **numeração de seção
  global e não renumerada**, `tokens.md` virando entrada com o mapa de seções. Toda citação existente
  a `tokens.md §N` (o passo 3 cita §5, §6, §7, §8, §9 e "lei 5 do §10") resolve — §10 e §11 ficaram
  **no próprio `tokens.md`**, então a citação de lei do passo 3 continua acertando direto. Nenhum
  token e nenhuma justificativa foram cortados.
ARQUIVOS:
- `docs/design/tokens.md` (reescrito: entrada + mapa de seções + §10 + §11)
- `docs/design/tokens-cor.md` (novo: §1–§5, 371 linhas)
- `docs/design/tokens-forma-e-texto.md` (novo: §6–§9, 179 linhas)
- `docs/design/grade-e-espacos.md` (só leitura — não editado, mtime intacto)
NÃO FEITO:
- **Um par sem valor:** `focus-ring` sobre `disabled-surface` nasce `PENDENTE` em §5.2 e como L-04.
  Ele existe porque o par de foco passou a ser inventariado fundo por fundo, e o fundo indisponível
  entrou na conta. Depende de L-07 (controle indisponível é focável?), que é do passo 4.
- L-08: os degraus de tipografia acima de 48 que `grade-e-espacos.md` §9 G-05 atribui a "`ui` (passo
  1/2b)". **Não fiz de propósito** — é decisão de escala para o espaço de leitura à distância, não
  correção de medição, e não estava neste brief. Registrado como lacuna com dono.
DECISÕES:
- **Par de contornos, não cor nova.** Alternativas descartadas: escurecer `danger` (invalidaria de
  uma vez os cinco pares que já dependem de `red.700` e pediria medição nova de todos); clarear o
  membro escuro (perde o argumento do passo 1, que continua válido: anel azul-ou-claro desaparece no
  botão primário focado); piso de 3 relaxado para foco sobre preenchimento (proibido pelo brief e
  errado — o indicador é o que sustenta `PN-05`).
- **`focus.offset` não foi renomeado**, embora o nome tenha ficado impróprio (a banda não é mais
  vaga). A dimensão é a mesma e é ela que o passo 3 cita em dois lugares; renomear custaria duas
  citações em arquivo que não é meu para ganhar zero. O significado correto está declarado em §8.1.
- **Identidade de primitiva como fonte de valor, marcada `†`.** Oito células têm valor sem medição
  nova porque o par semântico resolve para exatamente as mesmas duas cores de um par já medido
  (ex.: `focus-ring-contrast`/`danger` é o mesmo `neutral.000`/`red.700` de `danger-on`/`danger` =
  6,02). É o mesmo raciocínio que o brief usou para dar `border`/`disabled-surface` = 1,00. Não é
  estimativa e não é medição — e está rotulado como o que é.
- **O 2,89 fica escrito no arquivo**, com o veredito "reprova", em vez de sair junto com o problema.
  É ele que justifica o par existir; sem ele, alguém simplifica o indicador de volta para um anel só.
- Onze leis do §10 mantidas **sem renumerar** (a lei 8 foi reescrita no lugar) porque o passo 3 cita
  "lei 5 de `tokens.md` §10".
RISCOS:
- O par de foco é **dois desenhos que não podem ser separados**. Se o passo 4 ou o primeiro
  componente desenhar só o membro escuro, o sistema volta a reprovar sobre `danger` sem que nada
  acuse. É o ponto do sistema onde uma implementação parcial é pior que nenhuma.
- Sobre `attention` a fronteira preenchimento↔membro claro é fraca (o membro claro não carrega ali):
  o indicador aparece, mas sua borda interna se dissolve no âmbar. Aceitável porque a duplicidade e a
  fronteira externa carregam — se o passo 4 quiser um indicador de foco fino ou de baixa opacidade,
  isso deixa de ser verdade.
- `grade-e-espacos.md` §4 justifica o piso de 20 do rótulo dizendo que `tokens.md` §5 tem "margem
  **zero**" de contraste. Com a unificação em 4,5 a margem passa a ser 0,07% — declarada, não zero.
  A conclusão do passo 3 não muda e eu não toquei o arquivo dele, mas a frase dele ficou imprecisa.
- Três arquivos onde havia um: o risco agora é alguém acrescentar token de cor em
  `tokens-forma-e-texto.md`. O mapa de seções em `tokens.md` é a única defesa e ela é convenção.
PERGUNTAS:
- para orquestrador: despacha a medição de **`focus-ring` (`#1A1A1A`) sobre `disabled-surface`
  (`#E3E3E3`)**? É o único par novo sem valor. Meu script de validação de fórmula reproduziu
  **exatamente** os cinco valores de referência do brief (4,5033 · 2,89 · 6,02 · 3,86 · 4,50), e ele
  também resolve esse par — mas **não escrevi o número no arquivo**, porque medir é território do
  passo 2 e o brief foi explícito. Uma consulta ao `coder` fecha L-04.
- para humano (repetidas do passo 1, ainda abertas): família da classe grotesca (L-01); tema escuro
  (L-02); identificador de token em inglês (confirmação).
- para orquestrador: L-08 (degraus acima de 48 para leitura à distância, pedidos pelo passo 3) vira
  passo próprio ou entra no passo 4?
VERIFICAÇÃO:
- Contei linhas: `tokens.md` 74, `tokens-cor.md` 371, `tokens-forma-e-texto.md` 179 — todos abaixo de
  400 (`wc -l`).
- **Conferi programaticamente que os 37 valores recebidos aparecem no arquivo** e que **nenhum
  número decimal do arquivo está fora** do conjunto {37 valores recebidos, 4,5033, 1,00, pisos 4,5 e
  3, as cinco margens percentuais derivadas}. Script no scratchpad.
- Recontei o inventário de §5 com `grep`: 33 linhas de par (24 com "sobre" + 9 da tabela de foco),
  43 pares, 45 células, 8 marcadores `†`. As três contagens do relatório vêm dessa conferência.
- Reimplementei a fórmula WCAG e validei contra os cinco valores de referência do brief: casaram na
  quarta casa (4,5033) e na segunda (2,89 · 6,02 · 3,86 · 4,50). Usei isso **só** para checar as
  derivações por identidade — nenhum número novo entrou no arquivo.
- Corrigi as margens percentuais: o brief diz que `#2E6BFF`/`#FFFFFF` está "0,7% acima do piso"; pela
  conta é **0,07%** (4,5033 / 4,5). Escrevi 0,07% no arquivo. As outras quatro margens são minhas e
  batem: 2,7% · 7,7% · 6,0% · 6,9%.
- `grep` confirmou: nenhum hex fora da camada primitiva e da tabela de medição do §3.1 (troquei por
  nome de primitiva os hexes que eu mesmo havia introduzido em §3.4 e §5.4); zero termo de vertical
  nos três arquivos; toda referência de seção que cruza arquivo está qualificada com o nome do
  arquivo.
- `stat` confirma `grade-e-espacos.md` intacto (16:07:16, anterior a esta sessão).
- **Não medi contraste nenhum para o arquivo** e não escrevi número fora da lista recebida.
MEMÓRIA SUGERIDA:
- type=decision escopo=plataforma camada=ui slug=decision-indicador-de-foco-em-par — o indicador de
  foco é um par de contornos (claro `neutral.000` de 2 px contíguo ao alvo + escuro `neutral.900` de
  3 px por fora), nunca um anel de uma cor: `#1A1A1A` sobre `#C1201A` é 2,89 e reprova 3:1, e
  nenhuma cor consegue reprovar contra os dois membros ao mesmo tempo. **Supera**
  `decision-foco-acromatico` sugerida no passo 1 (o membro escuro continua acromático, a
  justificativa "funciona nas três superfícies" não).
- type=convention escopo=plataforma camada=ui slug=convention-piso-de-contraste-nao-negocia — piso de
  contraste não se afrouxa para caber cor nem se bifurca por tamanho de texto: conteúdo sobre
  preenchimento exige 4,5 nos quatro preenchimentos, e correção de reprovação é por cor, forma ou
  estrutura do indicador — nunca por piso.
- type=gotcha escopo=plataforma camada=ui slug=gotcha-cinco-margens-sem-folga — cinco pares da paleta
  do núcleo passam com folga fina (`action-on`/`action` 0,07%; `border-strong`/`surface` 2,7%;
  `focus-ring`/`success` 7,7%; `success-text`/`success-surface` 6,0%; `success-text`/`surface` 6,9%):
  mexer em `blue.500`, `green.700` ou `neutral.400` exige remedir, e o sintoma é reprovação que
  aparece longe da cor alterada.
- type=convention escopo=plataforma camada=ui slug=convention-tokens-em-tres-arquivos — os tokens do
  núcleo moram em três arquivos com **numeração de seção global e não renumerável**: `tokens.md`
  (entrada, mapa, §10 leis, §11 lacunas), `tokens-cor.md` (§1–§5), `tokens-forma-e-texto.md`
  (§6–§9); citação `tokens.md §N` resolve pelo mapa e seção nunca é renumerada.
PRÓXIMO PASSO SUGERIDO: consulta ao `coder` — medir `#1A1A1A` sobre `#E3E3E3` (`focus-ring` sobre
`disabled-surface`), único par de §5.2 sem valor, para fechar L-04. Em paralelo, `ui` (passo 4) pode
seguir: ele herda de §5.2 a obrigação de desenhar os **dois** membros do indicador e a pergunta L-07
(controle indisponível é focável), e de §3.3 que o rótulo de ação primária não encolhe.

## ui (passo 4) — 2026-08-22

## RELATÓRIO — ui — T-0002 (passo 4)
STATUS: OK
FEITO:
- **Vocabulário fechado de estado com sete ids** (`state.empty`, `state.stale`, `state.loading`,
  `state.pending`, `state.error`, `state.confirming-irreversible`, `state.unavailable`) mais quatro de
  rede (`net.reachable`, `net.external-unreachable`, `net.terminal-isolated`,
  `net.authority-unavailable`). Cada um com **canais ≥2**, o que o operador vê e **o que ele ainda pode
  fazer** — a coluna que o brief pediu está na tabela do §3.
- **Inventário fechado de canais (§2)** e, mais importante, a lista do que **não** é canal: movimento
  (animação nunca porta informação), `hover`, som (não existe token — S-01) e **`stroke.300` + contorno
  duplo**, que ficam reservados ao indicador de foco. Sem essa última linha, o primeiro estado a querer
  "um contorno mais grosso" derruba a perna não-cromática do foco.
- **O par de foco é lei nesta camada:** nenhum estado altera, encolhe, esconde ou substitui qualquer um
  dos dois membros — inclusive `unavailable` e a camada de confirmação. Está escrito no §2 e é a lei 15.
- **"Sem permissão" resolvido pelo critério de presença** (§4): a presença de um controle se decide por
  *"o operador pode pedir?"*, não por *"pode concluir sozinho?"*. Três casos (ausência composta no
  servidor / negação como resposta a tentativa / indisponibilidade transitória), com o resíduo declarado
  e o custo de `PN-17` nomeado. Detalhe na resposta ao orquestrador, abaixo.
- **`state.unavailable` é focável — L-07 de `tokens.md` §11 fechada.** O argumento decisivo não é
  conforto: **o ordinal é contrato**. Ordem visual = foco = atalho (`grade-e-espacos.md` lei 11); se
  controle indisponível saísse da ordem de foco, o ordinal de tudo depois dele mudaria conforme a
  disponibilidade, variando durante o turno — a regressão de `PN-06` na forma mais difícil de ver num
  diff. Consequência assumida: a medição de `focus-ring` sobre `disabled-surface` deixa de ser pendente
  e passa a **exigida** (S-02).
- **Três domínios de falha com apresentação distinta e nomeada** (§5), nenhum compartilhando glifo ou
  texto, e nenhum usando "offline" como única informação (`RN-OFF-001`). Regra que separa os dois eixos:
  **domínio é identidade; desfecho é cor** — a faixa permanente nunca usa `danger`, porque faixa
  vermelha permanente ensina a ignorar vermelho (o mesmo argumento de `tokens-cor.md` §4).
- **Classe de convergência → apresentação** (§5, segunda tabela): classe 1 é `pending` e **nunca**
  `error`; classe 4 é `error` e **nunca** `pending` (não existe "autorizado, confirma depois").
- **`RN-OFF-018` aplicado inteiro:** nenhum modal de erro de rede; conflito que exige julgamento **não
  tem id** nesta camada, porque não tem superfície no caixa; contagem de pendências é **estado
  mantido**, nunca consulta por apresentação (`RN-OFF-030` c).
- **Foco e leitor** (`foco-teclado-e-leitor.md`): estado não interativo não entra na ordem de foco; ação
  originada de estado vive em slot reservado de `zone.anchor-top`, nunca inserida no fluxo nem na zona de
  ação; foco só se move por ato do operador ou por desaparecimento do elemento; recuperação nunca pousa
  em ação irreversível nem em `zone.anchor-bottom`; leitura tem **destino declarado** e nunca é entregue
  ao elemento focado; **o terminador de leitura nunca aciona confirmação de ação irreversível**; leitura
  durante camada modal é **recusada, contada e sinalizada**, nunca enfileirada nem descartada.
- 16 leis (§9, valem para os dois arquivos) e 7 lacunas (§10, `S-01`…`S-07`).
ARQUIVOS:
- `docs/design/estados-e-interacao.md` (novo, 356 linhas — §1–§5, §9, §10)
- `docs/design/foco-teclado-e-leitor.md` (novo, 94 linhas — §6–§8)
- `docs/design/tokens.md`, `tokens-cor.md`, `tokens-forma-e-texto.md`, `grade-e-espacos.md` (só leitura,
  mtime intacto)
NÃO FEITO: —
DECISÕES:
- **Partido em dois arquivos, eixo = sujeito.** O arquivo único fechou em **413** linhas contra teto de
  400. Cortei por sujeito, não por tamanho: o que a superfície **mostra** (estado, canais, autorização,
  rede) contra como o operador **atravessa** (foco, teclado, leitor, espaço). Numeração **global aos
  dois** e não renumerada, com mapa de seções na entrada — mesma convenção do passo 2b, para que citação
  futura a `§N` resolva sem ambiguidade. As leis (§9) e as lacunas (§10) ficam na entrada e valem para
  os dois.
- **Acrescentei um estado que o brief não listou: `state.stale`.** `ui.md` §1 exige degradação
  rede → cache → piso, e degradação sem face visível é indistinguível de dado vivo. A necessidade é
  `PN-15` aplicada ao **conteúdo**, não só à conexão: operador que promete a partir de cache sem saber
  que é cache promete errado. Ele obriga o canal **instante** — que é o mesmo canal que `RN-OFF-005` já
  exige da recusa.
- **`state.error` cobre erro e recusa num id só.** Para o operador com fila na frente os dois são a
  mesma coisa: não aconteceu, e aqui está o próximo passo (`PN-17`). O detalhe técnico muda de lugar, não
  de existência: vai para o registro interno. Dois ids visíveis seriam distinção que só o desenhista
  percebe — o mesmo raciocínio que fez `danger` cobrir recusa e destruição em `tokens-cor.md` §4.
- **Referência curta de ocorrência é permitida ao lado da mensagem, nunca em lugar dela**, e não codifica
  cliente, estabelecimento nem recurso. `PN-17` recusa o **código sem significado como mensagem**, não a
  existência de um identificador de ocorrência; sem ele o suporte volta a pedir print, que é o mecanismo
  que `PN-15` recusa.
- **Precedência entre estados na mesma região** (§3.5): `error` → `confirming-irreversible` →
  `unavailable` → `stale` → `loading` → `empty`, e `pending` fora da disputa porque descreve fato
  concluído, não a região. Sem ordem declarada, cada bloco inventa a sua e o operador vê estados
  diferentes para a mesma situação.
- **Leitura durante camada modal é recusada e contada, não enfileirada.** As três opções são ruins:
  enfileirar lança item sem o operador saber quando; descartar em silêncio deixa item faltando na venda;
  recusar contando é a única em que ele **sabe** o que precisa reler. Escolhi a terceira e declarei que
  ela depende de um sinal que hoje não existe (S-01).
- **`state.loading` quase não existe.** Reconhecimento de entrada é `duration.000` e convergência é
  `pending`: no caminho crítico não há espera para desenhar. Deixei `loading` só fora do crítico, com
  limiar declarado (S-04) para resolver em `stale`/`error` — nunca indefinido.
RISCOS:
- **S-02 bloqueia produção, não este passo.** Ao decidir que controle indisponível é focável, tornei
  `focus-ring` sobre `disabled-surface` um par **exigido** sem valor medido — e `tokens.md` §10.3 diz que
  par sem valor não vai para produção. O passo 2b já havia levantado a pergunta; agora ela tem dono e
  consequência.
- **S-07, divergência normativa que não é minha para corrigir:** `tokens-cor.md` §4 põe "módulo
  desligado" dentro de `disabled`, mas `.claude/rules/backend.md` §2 e §4 dizem que módulo desligado é
  rota que não existe e manifesto que não traz o nó — isto é **ausência**, não `unavailable`. Se alguém
  desenhar módulo desligado como controle apagado, a tela revela o que o cliente **não** contratou.
  Tratei `unavailable` como impedimento transitório e cognoscível e **não editei** `tokens-cor.md`.
- **`grade-e-espacos.md` §4 diz "margem zero"** onde o valor medido é 0,07% (já conhecido pelo brief).
  Não é meu para corrigir e não muda nenhuma conclusão.
- **L-08 continua aberta e meu §8 depende dela:** o §8 exige que estado em E4 respeite o piso de texto
  daquele espaço (64/80/96), e os degraus acima de 48 não existem em `tokens-forma-e-texto.md` §6. Estado
  em E4 não é implementável antes de L-08.
- **S-03 é a fraqueza estrutural desta camada.** A exigência de dois canais depende de glifos com
  silhuetas distintas — sete estados e quatro domínios. Sem inventário, alguém reusa glifo e a redundância
  vira decoração. Escolha de biblioteca de ícone está fora de escopo (dependência), mas o **inventário
  semântico** precisa existir antes do primeiro componente.
- **§4 é a seção que `seguranca` vai auditar**, e ela tem um ponto de contato com o backend que não é meu:
  a composição do manifesto por papel. Se o backend enviar o nó e esperar que a UI o esconda, toda a §4
  cai — e cai em silêncio, porque a tela fica igual.
PERGUNTAS:
  - para orquestrador: despacha a medição de **`#1A1A1A` sobre `#E3E3E3`** (`focus-ring` sobre
    `disabled-surface`, S-02)? Deixou de ser condicional: decidi que controle indisponível é focável.
  - para orquestrador: **S-07** (o "módulo desligado" de `tokens-cor.md` §4) volta ao passo 2b ou fica
    como divergência declarada até a Fase 3?
  - para `produto`: **S-06** — `state.confirming-irreversible` existe em **E3** (dispositivo pessoal do
    cliente-final)? `PN-16` exige confirmação de **operador com papel autorizado** para o que move valor;
    se o cliente-final confirma algo que move valor no dispositivo dele, ou `PN-16` tem exceção declarada,
    ou aquele fluxo não fecha ali.
  - para humano: **S-01** — sinal **audível** de recusa de leitura entra no sistema? Não é ornamento: é o
    único canal que alcança quem opera sem olhar, e §7.5 depende dele. Não existe token de som e eu não o
    invento.
  - para humano: **S-05** — qual tecla confirma ação irreversível, sendo **distinta** do terminador de
    leitura do equipamento? Enquanto isso não fecha, existe caminho físico em que uma leitura confirma um
    cancelamento de venda.
  - para humano + `performance`: **S-04** — o limiar de espera que resolve `loading` em `stale`/`error` é
    grandeza sem valor (`RN-OFF-028`, `RN-OFF-029`). Quem mede, e onde o valor mora?
VERIFICAÇÃO:
- `wc -l`: 356 e 94 linhas, os dois abaixo de 400. O arquivo único fechou em **413** — contei antes de
  partir, e é por isso que parti.
- `grep` de termo de vertical (`mesa|comanda|bomba|cozinha|restaurante|posto|frota|delivery|garçom|
  combust`): **zero** ocorrência real nos dois arquivos.
- `grep` de framework (`react|vue|svelte|angular|tailwind|css|html|rem|aria|dom|hook|typescript|npm`):
  nenhuma ocorrência real — os matches foram substring de palavra pt-BR (`domínio`, `variando`). Nenhuma
  unidade que só existe em framework, nenhum arquivo de código, nenhuma biblioteca de ícone escolhida.
- **Números:** varri todos os decimais e inteiros dos dois arquivos. Só existem: `2,89` e `4,5`
  (recebidos, citados de `tokens-cor.md`), identificador de token (`000`, `100`, `200`, `300`), número de
  `RN`/`PN`/seção, as datas `2026-08-22`, `2–3 m` (de `grade-e-espacos.md` §4) e `413`/`400` — que são
  contagem de linha deste arquivo, medida com `wc`, não grandeza de produto. **Nenhum número novo de
  tempo, render, animação ou pacote.** Toda grandeza que pediria valor virou lacuna (S-04).
- `grep` confirmou que **toda** citação de seção que cruza a fronteira dos dois arquivos está qualificada
  com o nome do arquivo, e que a numeração §1–§10 não tem buraco entre eles.
- `stat` confirma `tokens.md` (18:39), `tokens-cor.md` (18:42), `tokens-forma-e-texto.md` (18:43) e
  `grade-e-espacos.md` (16:07) **intactos** — nenhum deles foi editado.
- Conferi os ids de estado com `grep`: 7 `state.*` + 4 `net.*`, sem id órfão e sem id usado que não esteja
  declarado no §3 ou no §5.
- **Não rodei nada além disso** — não há código nesta fase, não há teste a rodar, e não medi contraste
  nenhum (S-02 é medição, e medir não é meu passo).
MEMÓRIA SUGERIDA:
- type=decision escopo=plataforma camada=ui slug=decision-presenca-de-controle-e-pedido-nao-conclusao — a
  presença de um controle se decide por "o operador pode **pedir**?", não por "pode **concluir**
  sozinho?": fora do alcance do papel é **ausência composta no servidor** (sem controle, sem slot, sem
  atalho, sem mensagem), e o que ele pode pedir mas não concluir tem controle **normal** com a negação
  vindo como resposta à tentativa, com a autoridade que falta. É o que faz a lei "ausência por
  autorização é ausência" conviver com `PN-17`.
- type=decision escopo=plataforma camada=ui slug=decision-indisponivel-e-focavel — controle indisponível
  **é focável**, porque ordem de foco é ordem de atalho: tirá-lo da ordem faria o ordinal de tudo depois
  dele variar com a disponibilidade, que é a regressão de `PN-06` mais difícil de ver num diff. Fecha
  L-07 e torna **exigida** a medição de `focus-ring` sobre `disabled-surface`.
- type=convention escopo=plataforma camada=ui slug=convention-dominio-e-identidade-desfecho-e-cor — os
  três domínios de falha de rede têm identidade própria (glifo + texto + instante) e a **cor** vem do
  desfecho da operação, nunca do domínio; a faixa permanente de conexão **nunca** usa `danger`, porque
  faixa vermelha permanente ensina o operador a ignorar vermelho.
- type=gotcha escopo=plataforma camada=ui slug=gotcha-terminador-de-leitura-confirma-acao — leitor de
  código emite tecla de terminação, então confirmação de ação irreversível acionável por essa tecla é
  cancelamento de venda por acidente; sintoma: venda cancelada "sozinha" durante rajada de leitura. A
  leitura tem destino declarado, nunca vai ao elemento focado, e a recuperação de foco nunca pousa em
  ação irreversível.
- type=convention escopo=plataforma camada=ui slug=convention-estado-nao-mexe-em-foco-nem-em-ancora —
  estado nunca cria, move ou empurra slot de `zone.anchor-bottom`, nunca entra na ordem de foco quando não
  é interativo, e nunca rouba foco: o foco só se move por ato do operador ou por desaparecimento do
  elemento focado.
- type=decision escopo=plataforma camada=ui slug=decision-estados-em-dois-arquivos — a camada de estado
  mora em dois arquivos com numeração **global e não renumerável**: `estados-e-interacao.md` (§1–§5, §9
  leis, §10 lacunas) e `foco-teclado-e-leitor.md` (§6–§8); o eixo do corte é o sujeito (o que a
  superfície mostra × como o operador a atravessa), não o tamanho.
PRÓXIMO PASSO SUGERIDO: consulta ao `coder` — medir `#1A1A1A` sobre `#E3E3E3` (S-02), único par exigido
sem valor. Em paralelo, `ui` (passo 5) pode seguir: ele herda o vocabulário de estado do §3 como conjunto
de estados que **todo** bloco do catálogo declara, a lei 4 (nenhum estado toca `zone.anchor-bottom`) como
restrição de slot, e o §4 como a razão pela qual "sem permissão" **não** é eixo de variante.

## ui (medições fechadas) — 2026-08-22

## RELATÓRIO — ui — T-0002 (medições fechadas)
STATUS: OK
FEITO:
- **§5.2 de `tokens-cor.md` fechado.** A linha `disabled-surface` deixou de ser `PENDENTE`: **13,56**
  no membro escuro, **1,28** no claro, coluna "Quem carrega" = **escuro**. Transcrevi os números
  recebidos; não recalculei nada e não escrevi valor que não recebi.
- **Célula criada para o 1,28**, que antes não existia (a coluna do membro claro trazia `—`, e `—`
  significa "não carrega, não foi medido"). Ela existe porque este é o único fundo do sistema em que o
  membro que não carrega **reprova sobre superfície clara**: sem o número, alguém supõe que o membro
  claro ajuda ali.
- **Identidade declarada, marcador novo `††`.** O 1,28 é o **mesmo par primitivo**
  (`neutral.000`/`neutral.200`) de `border`/`surface-raised` de §5.1. Não inventei um segundo `†`
  por gosto: `†` significa "derivado sem medição nova" e esta célula **foi** medida — as duas coisas
  ao mesmo tempo precisavam de um rótulo próprio, senão a contagem passa a somar duas evidências onde
  há uma.
- **Nada a corrigir no desenho**, e escrevi isso no arquivo: sobre fundo indisponível quem sustenta é
  o escuro; sobre `danger` é o claro. É a propriedade do par de §3.2 operando, inversão esperada — não
  exceção.
- **Contagem reconciliada** em §5: de "43 pares · 41 com piso · 40 com valor · 1 pendente · 45 células
  (37 do passo 2 + 8 `†`)" para "43 pares · 41 com piso · **os 41 com valor, nenhum pendente** · **47
  células** (37 do passo 2 + **1 da medição de fechamento** + 8 `†` + **1 `††`**)". A frase
  "`PENDENTE` é o único vazio" saiu; a lei 3 de §10 continua citada para par que nasça depois.
- **`tokens.md` §11:** `L-04` e `L-07` viraram **FECHADA** no lugar, sem apagar a linha. L-04 carrega
  os dois valores e a identidade; L-07 aponta para `estados-e-interacao.md` §3.7 e diz que foi ela que
  tornou L-04 exigida em vez de condicional.
- **S-07 corrigido** (era a alternativa "corrija ou reporte"): "módulo desligado" saiu de `disabled` em
  §4. `disabled` passou a listar só impedimento transitório e cognoscível (periférico ausente,
  autoridade externa fora, pré-condição não satisfeita) e o parágrafo diz explicitamente que **módulo
  desligado é ausência** — rota inexistente e nó que não chega no manifesto — porque desenhá-lo apagado
  revela o que o cliente não contratou. É a mesma divulgação que o parágrafo anterior já recusava para
  autorização.
ARQUIVOS:
- `docs/design/tokens-cor.md` (editado: §4, §5 inventário, §5.2 — 394 linhas)
- `docs/design/tokens.md` (editado: §11, L-04 e L-07 — 74 linhas)
- `docs/design/estados-e-interacao.md`, `foco-teclado-e-leitor.md`, `grade-e-espacos.md`,
  `tokens-forma-e-texto.md` (só leitura, mtime intacto)
NÃO FEITO: —
DECISÕES:
- **Marcador `††` em vez de reusar `†` ou nada.** Alternativas: contar como medição independente (dá
  duas evidências onde há uma, exatamente o que o medidor pediu para evitar); contar como `†` (mente,
  porque `†` diz "não medido"); deixar `—` (esconde a única reprovação do membro claro sobre fundo
  claro do sistema). O custo do `††` é um símbolo a mais na legenda; o benefício é a contagem
  continuar auditável por quem remedir a paleta.
- **A célula do membro claro diz "reprova, e não carrega aqui"** — as duas coisas juntas, de propósito.
  Só "reprova" convidaria alguém a tentar "consertar" o membro claro; só "não carrega" esconderia o
  número que o medidor entregou.
- **Corrigi S-07 em vez de reportar.** Cabia em um parágrafo e não move token, valor, piso nem par de
  contraste: `disabled` continua sendo o mesmo token, com a mesma lista de canais e o mesmo piso de
  4,5. O que mudou é **qual situação entra nele** — e a situação que saiu (módulo desligado) já era
  tratada como ausência por `.claude/rules/backend.md` §2/§4 e por `estados-e-interacao.md` §4 caso A.
  Não criei caso novo: apontei o existente.
RISCOS:
- **`estados-e-interacao.md` §10 ficou desatualizado em duas linhas e não é meu para editar agora:**
  `S-02` está fechado (o par foi medido) e `S-07` diz "não editou `tokens-cor.md`", o que deixou de ser
  verdade. Enquanto as duas linhas ficarem como estão, a próxima leitura reabre lacuna resolvida.
- **`L-06` (`tokens.md` §11) continua listada como pendente do passo 4**, que entregou
  `estados-e-interacao.md`. Não a fechei porque declarar aquela entrega completa é validação do
  orquestrador, não minha — e o próprio passo 4 deixou `S-01`…`S-06` abertas dentro dela.
- **`tokens-cor.md` está em 394 de 400 linhas.** Sobra praticamente nada: o próximo par de contraste,
  token de cor ou justificativa **estoura** o teto e exige partir o arquivo outra vez. O corte natural
  seria §5 (camada semântica e pares) saindo para arquivo próprio, mantendo numeração global.
- O `13,56` tem folga larga (4,5× o piso), então ele **não** entra na lista de margens apertadas de
  §3.4 — e é justamente por isso que ninguém vai lembrar dele ao mexer em `neutral.200`. Quem mexer
  nessa primitiva move três células de uma vez: `border`/`surface-raised`, `border`/`disabled-surface`
  e este par.
PERGUNTAS:
  - para orquestrador: quem atualiza `S-02` e `S-07` em `estados-e-interacao.md` §10? Território é
    `ui`, mas o arquivo está fora do meu brief e há outro `ui` escrevendo em `docs/design/` agora.
  - para orquestrador: `L-06` fecha com a entrega do passo 4, ou fica aberta até `S-01`…`S-06`?
VERIFICAÇÃO:
- `wc -l`: `tokens-cor.md` 394, `tokens.md` 74 — os dois abaixo de 400.
- Varri **todos** os decimais de `tokens-cor.md`: os únicos números que entraram nesta passada são
  `13,56` e `1,28` (e o `1,28` já existia em §5.1). Nenhum outro valor foi criado, alterado ou movido.
- `grep` de `PENDENTE`: **zero** ocorrência de célula pendente; a única ocorrência restante é a frase
  de §5 que diz que não há mais nenhuma.
- Contei os marcadores: `††` aparece 3 vezes (1 célula + 2 explicações) e restam **8** `†` de célula
  mais 1 na legenda — casa com "8 `†` + 1 `††`" da contagem de §5.
- `grep` de hex: nenhum hex fora da camada primitiva (§2) e da tabela de medição recebida (§3.1) —
  não acrescentei nenhum. `grep` de termo de vertical nos dois arquivos: zero.
- `stat`: `grade-e-espacos.md` (16:07), `tokens-forma-e-texto.md` (18:43), `estados-e-interacao.md` e
  `foco-teclado-e-leitor.md` (22:08, do passo 4) **intactos** — não toquei nenhum dos quatro.
- **Não medi contraste nenhum.** Transcrevi os três valores do brief; o terceiro (17,40 entre os
  membros) já estava no arquivo e não foi reescrito.
MEMÓRIA SUGERIDA:
- type=gotcha escopo=plataforma camada=ui slug=gotcha-neutral-200-move-tres-pares — `neutral.200` é
  divisor **e** superfície indisponível ao mesmo tempo, então mexer nele move três células de contraste
  de uma vez (`border`/`surface-raised` 1,28, `border`/`disabled-surface` 1,00 e
  `focus-ring-contrast`/`disabled-surface` 1,28 — este último o mesmo par primitivo do primeiro, uma
  evidência só); sintoma: alterar um cinza "de borda" e ver o indicador de foco mudar de comportamento
  em controle indisponível.
- type=business-rule escopo=plataforma camada=ui slug=rule-modulo-desligado-e-ausencia — módulo
  desligado **não** é controle apagado: é rota inexistente e nó que não chega no manifesto, portanto
  ausência. Desenhá-lo como `disabled` revela ao operador o que o cliente **não** contratou. `disabled`
  cobre só impedimento transitório e cognoscível (periférico ausente, autoridade externa fora,
  pré-condição não satisfeita), sempre com motivo em texto.
PRÓXIMO PASSO SUGERIDO: `orquestrador` — atualizar `S-02` (fechado) e `S-07` (corrigido) em
`estados-e-interacao.md` §10 com o `ui` que estiver livre, e decidir `L-06`. Nenhuma pendência de
**número** resta na T-0002.

## ui (passo 5) — 2026-08-22

## RELATÓRIO — ui — T-0002 (passo 5)
STATUS: OK
FEITO:
- **Lei de nomeação (§1):** `block.<papel>`, **exatamente dois segmentos** — o terceiro é proibido
  porque só serviria para codificar degrau, tamanho, densidade ou espaço, e eixo escrito no id é o
  `if` estrutural de `ui.md` §2 escrito no vocabulário. Nove itens fechados do que o id não pode
  conter. O nome nomeia **função de interface**, nunca entidade nem aparência — e é daí que sai o
  tamanho da semente: funções são poucas e estáveis, entidades e telas crescem com cada módulo.
- **Imutabilidade com o argumento que faltava:** o fluxo não é só "servidor novo → cliente antigo".
  O manifesto é **cacheado**, então existe **manifesto antigo → cliente novo**, saído do cache do
  próprio terminal depois de uma atualização. Deixar de entender um id transforma o cache — que
  existe para sustentar `RN-OFF-018` — em tela degradada exatamente quando a rede está fora.
  Reaproveitar id é pior que renomear: o cliente antigo renderiza a coisa errada com convicção.
- **Registro de prefixos (§1.5)** com a regra "um prefixo, uma espécie de coisa", e a **colisão que
  já existe declarada**: `space.` nomeia a escala de espaçamento **e** os quatro espaços de desenho
  (V-01). Não editei nenhum dos dois arquivos.
- **Eixos (§2):** dois ortogonais — espaço (os quatro de `grade-e-espacos.md` §4) e modo de
  interação (`input.keyboard`, `input.scanner`, `input.touch`; conjunto vazio = exibição sem
  interação). **Densidade não é eixo**, é saída derivada e recebida. Periférico **não** é modo de
  interação: o leitor é modo porque produz **teclas**; balança, gaveta e captura de pagamento
  entregam dado ou autoridade e entram como `source` e como `state.unavailable` (`PN-18`).
- **A regra que o `backend` precisa, em uma linha: o manifesto escolhe o bloco; o contexto resolve a
  variante.** Tabela de "quem sabe o quê" com nove entradas. Das três entradas da densidade,
  **exatamente uma vem do servidor — a criticidade** (`PN-06` é fato de produto, não de tela); o
  servidor nunca envia densidade, tamanho nem variante, porque não conhece o hardware do terminal.
- **Variante × slot (§2.2)** ancorado na lei 8 da grade: variante muda **degrau**; mudou o conjunto
  ou a **ordem** dos slots, é outro bloco e quem escolhe é o manifesto.
- **O que NÃO é eixo (§2.4)**, com o que é em vez disso: permissão → composição no servidor; módulo
  ativo → **ausência de nó**; cliente (tenant) → composição, configuração e dado (`PN-09`); ramo →
  módulo; estado → conjunto declarado; tema → valor primitivo; ordinal → composição.
- **Semente de papéis: seis emitidos** (`block.region`, `block.line-collection`,
  `block.record-summary`, `block.entry`, `block.option-set`, `block.command`) **mais duas entradas
  de piso que o servidor nunca emite** (`block.fallback`, `block.connection-status`) — oito ao todo,
  cada um com papel, o que **não** faz e estados aplicáveis. Critério de admissão explícito (§3.1) e
  tabela **zona × papel** (§3.3): só `block.command` ocupa `zone.anchor-bottom`.
- **Reconciliei `ui.md` Nunca ("componente sem estado de erro e de vazio") com
  `estados-e-interacao.md` §1.3 ("estado normal não é estado")** por construção, sem exceção: bloco
  **com `source`** declara `empty` + `stale` + `error`; bloco **sem `source`** declara `error` e
  **não** declara `empty`, porque campo de coleta vazio é o repouso dele. `stale` é obrigatório em
  quem tem fonte porque degradação sem face visível é indistinguível de dado vivo.
- **Tolerância de versão (§4, arquivo irmão):** parse que nunca lança, vocabulário fechado sem
  correspondência por semelhança, despacho **tipado** (o mapa genérico apaga a checagem de props
  exatamente onde o dado vem da rede), descarte com irmãos vivos, degradação rede → cache → piso,
  resposta inaproveitável não cacheada, e as **duas direções** de versão tabeladas. Catálogo
  embarcado ⇒ bloco novo exige deploy do cliente, e o dossiê de arquitetura §3.4 já mediu que a
  tolerância é requisito nos **quatro** arranjos — logo esta seção **não espera D-02**.
- **O caso sem saída boa, dito em voz alta (§4.3, item 4):** id **desconhecido** na zona de ação
  crítica não tem piso possível — o terminal não sabe o que a ação faz. O slot mostra
  `block.fallback` e aquela ação **não acontece neste terminal**. Consequência que é do servidor:
  capacidade de caminho crítico não estreia em id novo (V-04). Distinto do caso de bloco
  **conhecido** fora da faixa de densidade, que cai no piso do papel e nunca é descartado
  (`grade-e-espacos.md` §5.1).
- **17 leis (§5, valem para os dois arquivos)** e **7 lacunas (§6, V-01…V-07)**.
- **Fase 3 declarada item por item (§3.5):** prop, evento, nome e conjunto de slots, variantes
  enumeradas, valor dos cinco campos de declaração, inventário de glifos (`S-03`), chaves do
  catálogo de mensagens, foco inicial e destino de leitura (que são **por tela**, não por bloco), e
  o parse/despacho em código.
ARQUIVOS:
- `docs/design/vocabulario-e-eixos.md` (novo, 360 linhas — §1–§3, §5, §6)
- `docs/design/tolerancia-de-versao.md` (novo, 96 linhas — §4)
- `docs/design/tokens.md`, `tokens-cor.md`, `tokens-forma-e-texto.md`, `grade-e-espacos.md`,
  `estados-e-interacao.md`, `foco-teclado-e-leitor.md` (só leitura — não editados)
NÃO FEITO: —
DECISÕES:
- **Partido em dois, eixo = sujeito.** O arquivo único fechou em **425** linhas contra teto de 400.
  O corte separa o que o manifesto **diz** (contrato compartilhado com `backend`: nome, eixo, papel)
  do que o cliente **faz quando não entende** (resiliência do lado do cliente). Numeração **global
  aos dois**, não renumerada, mapa de seções na entrada, leis e lacunas na entrada — mesma convenção
  dos passos 2b e 4, para que citação futura a `§N` resolva sem ambiguidade.
- **A semente tem oito entradas: seis emitidas e duas de piso.** Segurei em oito por um critério
  mecânico (§3.1): entra só o papel que o `backend` precisa para compor manifesto de fluxo com
  **regra já escrita**, que apodrece se inventado depois (id é imutável) e que é **função**, não
  entidade. Papel por entidade produziria um bloco por tela.
- **`block.connection-status` é piso, não nó do manifesto.** A faixa de conexão e pendência tem de
  existir **inclusive quando não há manifesto nenhum** (`PN-15`: o terminal não fica mudo). Se o
  manifesto pudesse criá-la, poderia também deixar de criá-la — e aí o terminal fica mudo por
  omissão de composição. Manifesto não a cria, não a move, não a suprime, não altera sua ordem.
- **`block.fallback` também não é emitida.** Degradação é decisão **do cliente**, tomada no parse: o
  servidor não sabe quais ids este terminal entende. Se ela fosse emitível, o servidor estaria
  desenhando a degradação do terminal que ele não conhece.
- **`block.region` entrou porque estado tem dono.** A precedência de `estados-e-interacao.md` §3.5 é
  resolvida "por região"; sem um papel declarado de região, "região" seria conceito sem id e o
  primeiro componente inventaria um contêiner ad hoc.
- **`block.entry` e `block.option-set` são dois papéis, não um com variante.** Coletar valor livre e
  escolher em conjunto fechado têm conjuntos de slots diferentes — pela lei 8 da grade, isso é outro
  bloco, e resolvê-lo por variante seria exatamente o `if` estrutural que `ui.md` §2 proíbe.
- **Zero opção recebida em `block.option-set` é `empty`, não `unavailable`.** Mesmo raciocínio de
  `estados-e-interacao.md` §3.1: apresentar "não tem" como "não consegui" (ou o inverso) faz o
  operador afirmar ao cliente-final algo que ele não sabe.
- **Não inventei o nome dos campos do nó do manifesto.** Usei `kind` e `source`, que `ui.md` §1 já
  nomeia, e mandei o resto (inclusive o campo de **criticidade**, sem o qual a densidade não se
  resolve) para `backend` como V-02. O requisito é meu; o nome no fio é do contrato dele.
- **`block.connection-status` em vez de nome com "terminal".** `grade-e-espacos.md` §4 já avisou que
  `terminal` é entidade de produto; e em `space.customer-personal` o dispositivo não é um terminal,
  embora a faixa exista lá sem a contagem de pendências (`foco-teclado-e-leitor.md` §8).
RISCOS:
- **A semente é insumo da Fase 3, não veredito sobre ela** (V-07). Se um trabalho real não couber em
  nenhum dos seis, o acréscimo é **decisão registrada** com o teste de §3.1 aplicado — o risco é
  alguém tratar a semente como fechada e resolver a falta com `if` estrutural dentro de um bloco
  existente, que é a única saída pior que acrescentar papel.
- **`S-07` já não é divergência, e conferi:** `tokens-cor.md` §4 (linha 236) passou a dizer "módulo
  desligado não é `disabled`: é ausência" no passo de medições fechadas, que rodou entre a minha
  leitura e a minha escrita. Minha §2.4 diz o mesmo, com a mesma razão (`backend.md` §2/§4). Nada a
  reconciliar — registro porque o brief deste passo me entregou essa divergência como conhecida.
- **`grade-e-espacos.md` §4 (linha 253) ainda diz "margem zero"** onde o medido é 0,07% — conferi que
  segue lá. Já conhecido pelo brief, não muda conclusão nenhuma, não toquei.
- **V-05 é a lacuna que pode custar mais depois:** se o piso embutido **vende**, ele é uma composição
  fixa de papéis desta semente e essa composição é contrato (`PN-06`) — muda o que o cliente embarca
  e como o piso é testado. Terminal novo, sem cache e sem rede, é o caso concreto.
- **V-04 mora na fronteira com `backend` e some fácil:** enquanto não existir política de estreia de
  id, uma capacidade crítica publicada em id novo aparece num terminal e falta no vizinho, sem nada
  acusar — e o sintoma chega como "o caixa 3 não tem o botão".
- **V-06 (origem do espaço)** é pequena no papel e grande na operação: terminal trocado que herda o
  espaço errado opera com alvo e piso de texto errados, e nenhum teste de contraste acusa isso.
- A lei "um prefixo, uma espécie de coisa" nasce **depois** da colisão que ela evitaria (V-01). Ela
  vale de agora em diante; a colisão existente segue precisando de despacho próprio.
PERGUNTAS:
  - para `backend`: **V-02** — o nó do manifesto carrega um campo de **criticidade** do slot
    (`PN-06`)? É a única das três entradas da densidade que o servidor conhece; sem ele o cliente
    não distingue `density.eyes-free` de `density.standard` no mesmo espaço. Nome do campo é seu.
  - para `backend`: **V-03** — o cliente **anuncia** a versão de vocabulário que entende? O cliente
    funciona sem anunciar (falha fechado), mas sem isso o servidor só pode ser conservador para
    sempre.
  - para `backend` + humano: **V-04** — como se garante que os terminais entendem um id **antes** de
    o servidor emitir capacidade de **caminho crítico** nele? Sem política, a ação simplesmente não
    existe naquele terminal (§4.3, item 4).
  - para `produto` + humano: **V-05** — o piso embutido **vende**, ou só informa? Se vende, a
    composição mínima dele é contrato.
  - para `backend` + humano: **V-06** — o espaço (`space.operator-station`…) vem da configuração do
    próprio cliente ou do registro do terminal no servidor? Certo em qualquer caso: nunca de largura
    de janela.
  - para orquestrador: **V-01** (colisão de prefixo `space.`) vira despacho próprio de `ui`? Corrigir
    exige tocar `tokens-forma-e-texto.md` **ou** `grade-e-espacos.md`, e nenhum é deste passo.
VERIFICAÇÃO:
- `wc -l`: 360 e 96 linhas, os dois abaixo de 400. O arquivo único fechou em **425** — contei antes
  de partir, e é por isso que parti.
- `grep` de termo de vertical (`mesa|comanda|bomba|cozinha|restaurante|posto|frota|delivery|garçom|
  combust|padaria|abastec`): **zero** ocorrência nos dois arquivos.
- `grep` de framework e de biblioteca (`react|vue|svelte|angular|solid|tailwind|css|html|rem|aria|
  dom|hook|typescript|npm|flutter|kotlin|swift|electron|tauri|webview|browser|navegador`): nenhuma
  ocorrência real — os matches foram substring de `domínio`. Nenhum arquivo de código, nenhuma
  unidade de framework, nenhum mecanismo de tema.
- **Números:** varri todos os numerais dos dois arquivos. Só existem referência de seção, número de
  `PN`/`RN`/`T`/lei, `duration.000` citado, a data `2026-08-22` e `425`/`400`, que são contagem de
  linha medida com `wc`, não grandeza de produto. **Nenhum número novo** de tempo, tamanho, pacote,
  contagem de bloco ou contraste.
- `grep` dos ids: 6 `block.*` emitidos + 2 de piso, sem id órfão e sem id usado que não esteja
  declarado no §3. Os dois `block.*` restantes que aparecem no texto são **contraexemplos
  explícitos** (`block.list-2` e `block.sale-item-list`, na §1.1 e §1.2). Todo `state.*` citado
  existe em `estados-e-interacao.md` §3; os três `input.*` são declarados em §2.1.
- `grep` confirmou que **toda** citação de seção que cruza a fronteira dos dois arquivos está
  qualificada com o nome do arquivo, e que a numeração §1–§6 não tem buraco entre eles.
- `stat`: `grade-e-espacos.md`, `tokens-forma-e-texto.md`, `estados-e-interacao.md` e
  `foco-teclado-e-leitor.md` **intactos**. `tokens.md` e `tokens-cor.md` têm mtime **posterior** ao
  início deste passo e **não fui eu**: é o passo "medições fechadas" desta mesma ficha, que rodou em
  paralelo (fecha `L-04`/`L-07`/`S-02` e corrige `S-07`). Reli os dois trechos que me tocam antes de
  entregar; não reverti nada (`git.md`).
- **Não rodei teste** — não há código nesta fase — e **não medi nada**: este passo não produz
  grandeza.
MEMÓRIA SUGERIDA:
- type=convention escopo=plataforma camada=sdui slug=convention-id-de-bloco-nomeia-funcao — id de
  bloco é `block.<papel>` com **dois segmentos**, em inglês, e nomeia a **função na interface**
  (agrupar, listar, resumir, coletar, escolher, invocar) — nunca entidade, aparência, ramo, cliente
  (tenant), framework, estado, permissão, eixo ou número; terceiro segmento é variante escrita no
  id, e eixo no id é `if` estrutural no vocabulário.
- type=decision escopo=plataforma camada=sdui slug=decision-id-de-bloco-e-imutavel-por-causa-do-cache
  — id publicado não se renomeia nem se reaproveita porque o manifesto é **cacheado**: além de "id
  novo → cliente antigo" existe "manifesto antigo → cliente novo" saído do cache do próprio terminal
  depois de atualizar, e deixar de entender um id transforma o cache que sustenta `RN-OFF-018` em
  tela degradada justamente com a rede fora. Retirada declara **quem emite** e **quem entende**, que
  são populações diferentes.
- type=decision escopo=plataforma camada=sdui slug=decision-manifesto-escolhe-bloco-contexto-resolve-variante
  — o manifesto envia `kind`, `source`, zona, ordinal e **criticidade**; densidade, tamanho e
  variante são resolvidos no cliente, porque o servidor não conhece o hardware do terminal.
  Conjunto ou **ordem** de slots diferente ⇒ outro bloco, nunca variante. Das três entradas da
  densidade (espaço × interação × criticidade), só a criticidade vem do servidor.
- type=convention escopo=plataforma camada=sdui slug=convention-o-que-nao-e-eixo-de-variante —
  permissão, módulo ativo, cliente (tenant), ramo, estado, tema e ordinal **não são eixos**: são,
  respectivamente, composição do manifesto por papel, **ausência de nó**, configuração/dado
  (`PN-09`), módulo, conjunto declarado de estados, valor de token primitivo e composição. Variante
  "sem permissão" é autorização no cliente, e autorização no cliente é decoração.
- type=decision escopo=plataforma camada=sdui slug=decision-semente-de-oito-papeis-de-bloco — a
  semente do vocabulário SDUI tem **seis papéis emitidos** (`region`, `line-collection`,
  `record-summary`, `entry`, `option-set`, `command`) e **duas entradas de piso que o servidor nunca
  emite** (`fallback`, `connection-status`): a faixa de conexão precisa existir sem manifesto nenhum
  (`PN-15`) e a degradação é decisão do cliente no parse. Prop, evento, slot e variante são Fase 3.
- type=convention escopo=plataforma camada=sdui slug=convention-estado-vazio-so-para-bloco-com-fonte
  — bloco **com `source`** declara obrigatoriamente `state.empty`, `state.stale` e `state.error`;
  bloco **sem `source`** declara `error` e **não** declara `empty`, porque campo de coleta vazio é
  repouso normal. É o que reconcilia "componente sem estado de vazio é defeito" (`ui.md`) com
  "estado normal não é estado" (`estados-e-interacao.md` §1.3).
- type=gotcha escopo=plataforma camada=sdui slug=gotcha-id-novo-em-acao-critica-nao-tem-piso — id
  **desconhecido** na zona de ação crítica não tem renderização de piso possível (o terminal não
  sabe o que a ação faz): o slot mostra `block.fallback` e a ação **não acontece ali**. Sintoma:
  "o caixa 3 não tem o botão". Por isso capacidade de caminho crítico não estreia em id novo, e o
  caso é distinto de bloco **conhecido** fora da faixa de densidade, que cai no piso do papel.
- type=gotcha escopo=plataforma camada=ui slug=gotcha-prefixo-space-tem-dois-significados — o
  prefixo `space.` nomeia duas espécies de coisa no sistema de design: os degraus da escala de
  espaçamento (`space.200`) e os quatro espaços de desenho (`space.operator-station`). Citação a
  `space.` só se desambigua pelo formato do sufixo; a regra é **um prefixo, uma espécie de coisa**
  (`vocabulario-e-eixos.md` §1.5) e a colisão existente segue aberta em V-01.
PRÓXIMO PASSO SUGERIDO: passo 6 (thread principal) — regra nova em `.claude/rules/ui.md` e linha de
território em `CLAUDE.md` §4. As cláusulas desta camada que mais rendem regra curta: id de bloco
nomeia função e é imutável; manifesto escolhe bloco, contexto resolve variante; permissão, módulo e
cliente (tenant) não são eixos; despacho tipado com fallback garantido. Antes disso, o orquestrador
tem quatro perguntas a rotear para `backend` (V-02, V-03, V-04, V-06) e uma para `produto` (V-05).

## ui (passo 6 residual) — 2026-08-23

## RELATÓRIO — ui — T-0002 (passo 6 residual)
STATUS: OK
FEITO:
- **S-02 fechada.** Recalculei os dois pares antes de escrever qualquer coisa (WCAG, luminância
  relativa sRGB): `#1A1A1A`×`#E3E3E3` = **13,5613** → 13,56; `#FFFFFF`×`#E3E3E3` = **1,2834** → 1,28.
  Escritos como **propriedade do par**, não como número solto, em `estados-e-interacao.md` §3.7 item 1:
  sobre superfície desabilitada carrega o membro **escuro**, o **claro** reprova largo (1,28 contra piso
  3) — inversão exata do 2,89/6,02 sobre `danger`. Some os dois casos e a leitura é uma: legibilidade do
  foco é propriedade do par, cada superfície escolhe qual membro a sustenta, nenhuma reprova contra os
  dois. Daí os membros serem **inseparáveis**: só o claro reprova sobre `disabled-surface`, só o escuro
  reprova sobre `danger`, e nas duas direções **nada acusa** — o controle continua parecendo focado.
  Linha de lacuna baixada de pendência a `FECHADA`.
- **S-07: a linha era a mentirosa, e foi ela que mudou.** Conferidas as duas pontas antes de editar.
  `tokens-cor.md:234-239` já diz, desde 2026-08-22, "**módulo desligado não é `disabled`: é ausência**"
  e restringe `disabled` a impedimento transitório e cognoscível — exatamente o que §3.7 daqui trata.
  A correção **não é parcial**: cobre a classificação (§4), não sobrou nenhuma outra menção de módulo em
  `disabled` no arquivo (busca no arquivo inteiro), e `vocabulario-e-eixos.md` §2.4 classifica módulo
  desligado como **ausência de nó**, concordando com as duas. `S-07` virou `FECHADA`.
- **V-01 resolvida, com regra de formação.** A escala de espaçamento passou a `spacing.` (24 citações
  renomeadas em `tokens-forma-e-texto.md` e `grade-e-espacos.md`), e `space.` ficou com **uma** espécie:
  os quatro espaços de desenho, com os nomes funcionais intactos (`space.operator-station`,
  `space.operator-handheld`, `space.customer-personal`, `space.distant-display`) — nada de nome de ramo
  voltando. `vocabulario-e-eixos.md` §1.5 virou **registro completo de prefixos** com uma coluna nova
  ("atravessa a rede?") mais uma **regra de formação de quatro cláusulas**: o prefixo é a palavra da
  prosa; o **sufixo nunca é o discriminador** (precisar olhar número-vs-`kebab-case` para saber a
  espécie **é** o defeito); prefixo novo entra por linha na tabela na mesma mudança do primeiro id; e
  espécie nova não se acomoda em prefixo existente "porque é parecida".
- **L-06 decidida e fechada** em `tokens.md` §11: o mapeamento pedido existe desde o passo 4 —
  `estados-e-interacao.md` §5 (três domínios de rede, faixa permanente em `zone.anchor-top` /
  `layer.alert`, que nunca usa `danger` e nunca é encoberta) e §3 (`state.pending` com contagem tabular
  + instante + `radius.full` + `attention`, dentro do caminho crítico, sem pedir decisão ao caixa).
  As três leis que o brief citou estão satisfeitas e ficaram escritas na linha: offline não é erro de
  tela, pendência tem nome e via, e nenhum dos dois é sinalizado só por cor. Os resíduos **não** reabrem
  a lacuna: `S-01`, `S-03`, `S-04`, `V-02` já têm nome e dono.
ARQUIVOS:
- `docs/design/estados-e-interacao.md` (editado — §3.7 item 1; §10 linhas S-02 e S-07; 356 → 366 linhas)
- `docs/design/vocabulario-e-eixos.md` (editado — §1.5 reescrita; §6 linha V-01; 360 → 383 linhas)
- `docs/design/tokens-forma-e-texto.md` (editado — §7 nota do rename + escala renomeada; 179 → 188)
- `docs/design/grade-e-espacos.md` (editado — só o rename nas 10 linhas que citavam a escala; 391 linhas,
  contagem inalterada)
- `docs/design/tokens.md` (editado — §11 linha L-06; 74 linhas, contagem inalterada)
- `docs/design/tokens-cor.md` (só leitura — ver DECISÕES 3)
NÃO FEITO: —
DECISÕES:
- **Renomeei a escala, não os espaços.** Três razões, em ordem: (1) "espaço" é a palavra que a prosa
  deste sistema e a lei de UI usam para o espaço de desenho, e a escala a prosa chama de "espaçamento" —
  então `space.`/`spacing.` deixa prefixo e prosa bijetivos; (2) a lista dos quatro espaços é lei com
  nome funcional (`grade-e-espacos.md` §4) e mexer nela é justamente convidar o nome de ramo de volta;
  (3) token de estilo não atravessa a rede, então o custo é um `sed` — enquanto `block.`, `zone.` e o
  fato de `state.`/`net.` são contrato com terminal em versão antiga e caem na proibição de renomear
  (§1.4). Trade-off: `space.` para escala de espaçamento é o hábito da indústria, e quem vier de outro
  sistema vai escrever `space.100` por reflexo — foi por isso que a nota do rename ficou **no** §7, onde
  a pessoa está olhando quando erra.
- **A coluna "atravessa a rede?" entrou no registro de prefixos** porque a regra de formação sem ela é
  moral: é essa coluna que responde "este rename é barato ou é retirada de tela de um terminal?" no
  lugar onde prefixo nasce. Ela não decide nada novo — só torna consultável a assimetria que §1.4 já
  fixou.
- **Não editei `tokens-cor.md`.** §5.2 já traz as duas células (13,56 e 1,28 `††`), o "quem carrega", a
  inversão em relação a `danger` e o "nunca se desenha um sem o outro". Reescrever ali seria duplicar
  evidência num arquivo a 6 linhas do teto (394/400). A propriedade do par ficou onde a decisão que a
  exigiu mora (§3.7) e na linha de lacuna, que é o que o brief pediu para baixar.
- **L-06 fechei em vez de rotear.** Nada nela dependia de `produto` ou de `backend`: eu não precisei de
  grandeza nova nem de nome de campo (o nome do campo continua sendo `V-02`, de `backend`). Se
  dependesse, seria `PERGUNTAS`.
RISCOS:
- **Grafia antiga fora do meu território:** `memory/plataforma/state-sessao-2026-08-22-tres-fichas-abertas.md:307`
  e a seção do passo 5 desta ficha (linha 819) ainda escrevem `space.200`. Não toquei em nenhum dos dois;
  a linha de `V-01` em `vocabulario-e-eixos.md` §6 nomeia o arquivo de memória e o dono (`orquestrador`).
- **A `MEMÓRIA SUGERIDA` do passo 5 `gotcha-prefixo-space-tem-dois-significados` descreve um estado que
  deixou de existir.** Se nascer como está, o grafo passa a mentir no dia em que foi escrito. O que
  sobrevive dela é a **convenção**, abaixo.
- `spacing.` não existe em `.claude/rules/**` nem em memória: até entrar, o único lugar que segura a
  convenção é `vocabulario-e-eixos.md` §1.5.
- **Três arquivos perto do teto:** `tokens-cor.md` 394, `grade-e-espacos.md` 391, `vocabulario-e-eixos.md`
  383. O próximo acréscimo em qualquer um deles provavelmente pede divisão por eixo, não empilhamento.
  Nenhuma divisão foi necessária nesta passada.
PERGUNTAS:
  - para `orquestrador`: corrigir `space.200` → `spacing.200` em
    `memory/plataforma/state-sessao-2026-08-22-tres-fichas-abertas.md:307` entra neste fechamento, ou
    fica como pendência? (é território seu, não meu)
  - para humano: a regra de formação de prefixo (quatro cláusulas) sobe para `.claude/rules/ui.md` como
    cláusula curta, ou fica só no sistema de design? Ela vale para token, estado, zona e bloco — não só
    para cor.
VERIFICAÇÃO:
- **Recalculei** os dois pares de S-02 com a fórmula WCAG (luminância relativa sRGB, canal linearizado):
  13,5613 e 1,2834. Confirmei também o 17,40 de `#1A1A1A`×`#FFFFFF` que o par usa como referência
  interna. Nenhum número novo foi escrito neste passo: os três já estavam no sistema.
- **S-07 nas duas pontas, e uma terceira:** `tokens-cor.md:234-239` (classificação corrigida),
  `estados-e-interacao.md:356` (a linha obsoleta), `vocabulario-e-eixos.md:252` (§2.4, concordante).
  Busquei "módulo/desligado" em todo o `docs/design/` antes de declarar não-parcial.
- **Rename conferido por busca:** `space\.[0-9]` em `docs/design/` devolve **uma** ocorrência, e é a
  menção deliberada à grafia retirada na nota do §7. Contagem por degrau conferida antes e depois
  (`spacing.025` a `spacing.800`), sem degrau perdido e **sem degrau novo**.
- **Integridade de tabela markdown:** script contando colunas em todos os blocos de tabela dos cinco
  arquivos tocados — nenhuma inconsistência.
- **Tetos conferidos** arquivo por arquivo depois de cada edição (`wc -l`): maior é 394, nenhum estourou,
  nenhuma divisão foi necessária.
- **Não conferi:** nada em `docs/produto/**` (o brief proibiu abrir) — os `RN-`/`PN-` que aparecem nas
  minhas linhas são citações que já estavam nos arquivos de design, não afirmações novas minhas. Não
  rodei build nem teste: não há código nesta camada, e D-02 continua ABERTA.
MEMÓRIA SUGERIDA:
  - type=convention escopo=plataforma camada=ui slug=convention-prefixo-de-token-uma-especie — um
    prefixo, uma espécie, um arquivo dono, e o **sufixo nunca é o discriminador**: a escala de
    espaçamento é `spacing.`, `space.` é só o espaço de desenho. Prefixo novo entra por linha no
    registro de `vocabulario-e-eixos.md` §1.5 na mesma mudança do primeiro id. **Substitui** a sugestão
    `gotcha-prefixo-space-tem-dois-significados` do passo 5, cujo sintoma deixou de existir em
    2026-08-23.
  - type=decision escopo=plataforma camada=ui slug=decision-legibilidade-do-foco-e-propriedade-do-par —
    13,56 (escuro) e 1,28 (claro) sobre `disabled-surface`; 2,89 (escuro) e 6,02 (claro) sobre `danger`.
    Cada superfície escolhe o membro que carrega, e nenhuma reprova contra os dois: desenhar um membro
    só reprova em silêncio, em uma das duas direções.
  - type=convention escopo=plataforma camada=sdui slug=convention-custo-de-rename-por-prefixo — id que
    atravessa a rede (`block.`, `zone.`, o fato de `state.`/`net.`) não se renomeia, nunca; id que vive
    no cliente (token de estilo, `spacing.`, `space.`, `input.`, `density.`) é build e renomear é barato
    **enquanto nada foi entregue**. A quarta coluna do registro §1.5 é onde isso se consulta.
PRÓXIMO PASSO SUGERIDO: `orquestrador` — fechamento. Não há lacuna desta camada esperando `ui`: as que
sobraram são `S-01`/`S-03`/`S-05`/`S-06` (humano/`produto`), `S-04` (humano + `performance`),
`V-02`/`V-03`/`V-04`/`V-06` (`backend`), `V-05` (`produto` + humano), `L-01`/`L-02` (humano), `L-03`
(D-02), `L-08` e `V-07` (`ui`, despacho próprio) e `G-01`…`G-05` (grade).


## Fechamento — orquestrador — 2026-08-23

**Resultado:** ficha **fechada**. Entregou o que o pedido pediu — cor, padrão e estrutura de layout a
partir da base do humano — e entregou a parte que o pedido não pediu e que era o risco real: **o piso
de contraste medido, par por par**, em vez de avaliado a olho.

### Definição de pronto, item por item (`processo.md` §2)

1. **Regra de negócio numerada em `docs/produto/**` — não se aplica:** nada nesta ficha é regra de
   negócio. É sistema de design, e o plano já declarou o gate 1 fora. O `ui` respeitou a fronteira:
   nenhum cálculo, permissão ou disponibilidade nasceu aqui.
2. **Teste do critério de aceite — não se aplica:** nada renderiza, e **D-02 segue ABERTA**, então o
   entregável é contrato e comportamento agnósticos de framework. O que substituiu o teste, e é
   verificável hoje, foi a **medida**: 41 pares com piso, todos com valor, nenhum pendente
   (`docs/design/tokens-cor.md` §5.2, conferido em `tokens.md:70`).
3. **DDL / gate 2 — não se aplica:** nenhum arquivo em `db/`.
4. **Endpoint / gate 3 — não se aplica como gate**, e virou **requisito de uma linha** onde importava:
   "sem permissão" não revela a existência do recurso negado. Está hoje em `.claude/rules/ui.md` como
   cláusula permanente ("ausência por autorização é ausência, não estado visual").
5. **Gate 4 (`performance`) — não se aplica, e foi proibido de propósito:** nada renderiza, e o brief
   vedou número de render, bundle e tempo, justamente para não produzir estimativa com cara de medida.
   **Agendado para a Fase 3**, quando houver o que medir.
6. **Decisão não óbvia virou registro em `memory/` — CUMPRIDO**, com as duas linhas de índice na mesma
   passada.
7. **Nenhum segredo — CONFERIDO.** Nenhuma chave de fonte licenciada, nenhum token de serviço. A
   dependência de fonte grotesca está declarada como **pergunta ao humano**, não resolvida por download.
8. **Toda `MEMÓRIA SUGERIDA` avaliada — CUMPRIDO**, abaixo.

### Memória escrita a partir desta ficha

- `plataforma/decision-legibilidade-do-foco-e-propriedade-do-par` — os quatro números medidos
  (13,56/1,28 sobre desabilitado, 2,89/6,02 sobre `danger`) e a consequência que morde: os dois membros
  são **inseparáveis**, e desenhar um só **reprova em silêncio**, sem nada acusar.
- `plataforma/convention-prefixo-de-token-uma-especie` — um prefixo, uma espécie, o sufixo nunca é o
  discriminador. **Fundi nele** `convention-custo-de-rename-por-prefixo` (a coluna "atravessa a rede?" é
  o motivo de consultar o registro de prefixos, não um segundo assunto) **e** o argumento de
  imutabilidade que sustenta `block.`: manifesto **antigo** saído do cache do terminal tem de continuar
  legível pelo cliente **novo**.

**Recusado, com motivo.**

- **`gotcha-prefixo-space-tem-dois-significados` — recusada por sintoma extinto.** `V-01` foi resolvida
  em 2026-08-23: a escala virou `spacing.` e `space.` ficou com uma espécie só. O registro descreveria
  um defeito que não está no repositório, e o grafo mentiria no dia em que fosse escrito. Substituída
  pela convenção acima, como o próprio `ui` propôs.
- **As 19 cláusulas que subiram para `.claude/rules/ui.md` (12 em "Cor, contraste e estado", 7 em
  "Bloco, variante e eixo") não viram memória.** Regra vence memória na hierarquia de autoridade
  (`00-nucleo.md` §1) e o agent `ui` lê a regra **sempre**, enquanto memória se lê por gancho. Duplicar
  seria criar a segunda fonte que envelhece calada. Abrange: `decision-token-em-duas-camadas`,
  `convention-estado-nunca-so-por-cor`, `convention-piso-de-contraste-nao-negocia`,
  `rule-tres-estados-funcionais`, `decision-acento-nao-e-texto`, `rule-modulo-desligado-e-ausencia`,
  `decision-indisponivel-e-focavel`, `decision-presenca-de-controle-e-pedido-nao-conclusao`,
  `convention-id-de-bloco-nomeia-funcao`, `decision-id-de-bloco-e-imutavel-por-causa-do-cache`,
  `decision-manifesto-escolhe-bloco-contexto-resolve-variante`, `convention-o-que-nao-e-eixo-de-variante`,
  `gotcha-id-novo-em-acao-critica-nao-tem-piso`.
- **`decision-foco-acromatico` — recusada por estar superada dentro da própria ficha.** O anel acromático
  único é exatamente o que reprovou (2,89 sobre `danger`); o desenho final é o **par**. Escrever a versão
  antiga seria registrar a hipótese, não a conclusão.
- **Valor medido (`gotcha-cinco-margens-sem-folga`, `gotcha-neutral-200-move-tres-pares`) — recusado por
  ter casa melhor.** Os números vivem em `docs/design/tokens-cor.md` §5.2, par por par, com o método.
  Memória com número copiado é a forma mais rápida de ter dois valores para o mesmo par.
- **Organização de arquivo (`convention-tokens-em-tres-arquivos`, `decision-estados-em-dois-arquivos`) —
  derivável da árvore de `docs/design/`**, que é o exemplo literal de derivável em `memoria.md` §8.
- **`convention-dominio-e-identidade-desfecho-e-cor`, `convention-estado-nao-mexe-em-foco-nem-em-ancora`,
  `gotcha-terminador-de-leitura-confirma-acao`, `decision-semente-de-oito-papeis-de-bloco`,
  `convention-estado-vazio-so-para-bloco-com-fonte`** — derivável de `estados-e-interacao.md`,
  `foco-teclado-e-leitor.md` e `vocabulario-e-eixos.md`, nos lugares onde a pergunta é feita. O do
  **terminador do leitor** é o mais afiado dos cinco: fica **nomeado aqui** como a primeira coisa a
  reler quando o cliente for implementado (Fase 3), porque é o tipo de armadilha que só dói com
  hardware na mão.

### O que fica aberto, com dono

Nenhuma lacuna desta camada espera `ui`. O que sobra, por dono:

| Lacunas | Dono |
|---|---|
| `S-01`, `S-03`, `S-05`, `S-06`, `V-05` | humano / `produto` |
| `S-04` | humano + `performance` |
| `V-02`, `V-03`, `V-04`, `V-06` — inclusive **o nó carrega campo de criticidade?** e **o cliente anuncia versão de vocabulário?** | `backend` |
| `L-01`, `L-02` — **tema escuro entra?** e **a família da fonte grotesca**, que é dependência licenciada | **humano** |
| `L-03` | trava em **D-02** |
| `L-08`, `V-07` | `ui`, em despacho próprio |
| `G-01`…`G-05` (grade) | `ui` / humano |

**Resíduo que este fechamento cria, e o dono não sou eu:** `docs/design/vocabulario-e-eixos.md:377`
(linha `V-01`) aponta para `memory/plataforma/state-sessao-2026-08-22-tres-fichas-abertas.md:307`
pedindo ao `orquestrador` corrigir a grafia antiga de `space.` lá. **Eu removi aquele registro** neste
fechamento (`state` de trabalho concluído sai, `memoria.md` §8) — o problema apontado deixou de existir
**e a referência ficou apontando para arquivo inexistente**. Corrigir a linha é de `ui`, dono de
`docs/design/**`; não a editei. É, ela mesma, um caso da armadilha registrada em
`processo/gotcha-endereco-de-relatorio-envelhece-na-propria-sessao`.

**Uma pergunta desta ficha é de produto e vale mais que as outras:** *o piso embutido vende, ou só
informa?* Se vende, a composição mínima dele é contrato de `PN-06`, e isso é `produto` + humano.

**Medido em disco em 2026-08-23, ao fechar:** 8 arquivos em `docs/design/`, **1.986** linhas somadas,
maior arquivo 394 linhas — nenhum acima de 400. `.claude/rules/ui.md` com as duas seções novas.

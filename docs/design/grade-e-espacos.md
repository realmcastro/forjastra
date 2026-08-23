# Grade, espaços e densidade — núcleo

Dono: agent `ui`. Escopo: **núcleo**, todo cliente, todo módulo. Data: 2026-08-22.
Consome as escalas de `docs/design/tokens.md` §6 (tipografia) e §7 (espaçamento, base 8) e fecha a
lacuna **L-05** daquele arquivo. Não altera nenhum token existente.

Este arquivo define **medida**: alvo, módulo, trilha, margem, ritmo, faixa de densidade, ancoragem.
Ele **não** define mecanismo — como a trilha é expressa (grade de CSS, cálculo em tempo de layout,
unidade de framework) é **D-02** e está fora daqui. Nenhuma unidade usada abaixo pertence a um
framework.

**Não decidido aqui, de propósito:** estado, foco visível e interação em detalhe (passo 4); nome de
papel de bloco e eixo de variante (passo 5). Este arquivo entrega a geometria que os dois consomem.

## 1. A unidade normativa é o ângulo visual, não o pixel

A grade deste sistema deriva de dois fatos **físicos** — a largura do dedo do operador e a distância
entre o olho e a tela — e não de uma contagem de colunas. Contagem de coluna é **saída** da
derivação (§3), nunca entrada.

Consequência de método: **o que é normativo aqui é o ângulo** (§2.4). O pixel é conveniência
derivada, calculada pela convenção do **pixel de referência** do W3C: o ângulo visual de um pixel a
96 dpi visto a ~71 cm, ≈ 0,0213° ≈ 1,28′ de arco. Densidade real e tamanho físico do hardware-alvo
**não estão confirmados** (§9, G-04). Quando forem, a tabela angular do §2.4 continua válida e só a
coluna de px é recalculada. É por isso que a derivação está em ângulo: ela sobrevive à confirmação
do hardware.

### Referências externas citadas

Alvo de toque e tamanho mínimo de texto são os dois únicos números aqui com referência normativa
reconhecida. São citados como referência, não medidos por nós:

| Ref | Fonte | O que fixa |
|---|---|---|
| R-1 | WCAG 2.2, SC 2.5.8 *Target Size (Minimum)*, nível AA | alvo ≥ 24×24 px CSS, com exceção por **espaçamento** (círculo de 24 px centrado no alvo não intersecta outro alvo) |
| R-2 | WCAG 2.1, SC 2.5.5 *Target Size*, nível AAA | alvo ≥ 44×44 px CSS |
| R-3 | Apple Human Interface Guidelines | alvo ≥ 44×44 pt |
| R-4 | Material Design (Google), acessibilidade | alvo ≥ 48×48 dp, declarado como ≈ 9 mm físicos |
| R-5 | ISO 9241-303 (requisitos ergonômicos para displays eletrônicos) | altura de caractere **recomendada 20′–22′** de arco, **mínimo 16′** |
| R-6 | W3C CSS Values and Units | definição do pixel de referência (≈ 1,28′) |
| R-7 | Bringhurst, *The Elements of Typographic Style* | medida de linha 45–75 caracteres, 66 como referência |

R-5 é a referência mais carregada deste arquivo e foi citada de memória: **conferir cláusula e
edição antes de virar teste automatizado.** A conclusão que ela sustenta (§2.4) não muda de sinal se
a banda for 18′–22′; muda só o arredondamento de um degrau.

## 2. A derivação, em cinco passos

### 2.1 Passo 1 — o piso do alvo de toque: 48

Das quatro referências de alvo, tomamos a **mais estrita** (R-4, 48) e não a mais permissiva (R-1,
24). Dois critérios apontam para 48 ao mesmo tempo:

1. **Ergonomia:** 48 é o maior dos pisos citados e o único declarado em medida física (≈ 9 mm, R-4),
   que é a grandeza que importa quando a densidade da tela é desconhecida.
2. **Escala:** 48 é `spacing.600`, exatamente 6× a base 8 de `tokens.md` §7. 44 (R-2, R-3) não é
   múltiplo de 8 e introduziria arredondamento em todo cálculo de linha e de trilha.

`target.min` = **48**. R-1 (24) **não** é adotado como piso: ele é o mínimo legal de conformidade,
alcançado por telas que se olha. Aqui o operador não olha.

### 2.2 Passo 2 — o alvo do caminho crítico: 64

Os quatro pisos citados pressupõem **mira guiada pela visão**. O caminho crítico deste produto é
executado de memória motora, sem reler a tela (`PN-05`, `PN-06`, `ui.md` §3): sem realimentação
visual o raio de erro da mira cresce, e nenhuma das referências cobre esse caso.

`target.critical` = **64** = `spacing.800` = 8× a base. É **especificação**, não medição — no mesmo
sentido em que `tokens.md` §9 declara suas durações. Um degrau acima do piso, e o único degrau da
escala de espaçamento entre 48 e 64 é… nenhum: a escala do §7 não tem 56. Isso é aproveitado, não
contornado: **existem exatamente dois alvos no sistema, 48 e 64.** Um terceiro alvo intermediário
deixaria um bloco escorregar entre densidades sem declarar a mudança.

### 2.3 Passo 3 — a calha sai do anel de foco: piso 12, padrão 16

O anel de foco de `tokens.md` §8 ocupa `stroke.300` (3) mais `focus.offset` (2) **fora** da borda do
alvo: 5 px por lado. Dois alvos focáveis vizinhos precisam de 2·5 = 10 px só para os anéis não se
encostarem, mais folga visível.

`grid.gutter-min` = **12** (`spacing.150`) — piso duro entre dois alvos focáveis, derivado do anel.
`grid.gutter` = **16** (`spacing.200`) — padrão, que é também onde `tokens.md` §7 diz que começa a
separação entre blocos.

Isto satisfaz de carona a exceção de espaçamento de R-1. E é o primeiro ponto em que a grade **cede
à ergonomia**: a calha entre alvos nunca pode ser reduzida aos degraus ópticos (`spacing.025`,
`spacing.050`), mesmo quando o ritmo da grade permitiria.

### 2.4 Passo 4 — distância de leitura → piso de texto

Altura de caractere em minutos de arco, para a escala de `tokens.md` §6. Convenção: pixel de
referência (R-6), razão altura-de-caixa-alta/em = **0,70** (característica da classe grotesca do §6;
trocar a família licenciada — L-01 — recalcula a tabela). Cinza = abaixo do mínimo de 16′ (R-5);
**negrito** = dentro da banda recomendada 20′–22′.

| px \ distância | 250 mm | 300 mm | 400 mm | 600 mm | 700 mm | 2000 mm | 2500 mm | 3000 mm |
|---|---|---|---|---|---|---|---|---|
| 14 `size.100` | 35,7 | 29,7 | 22,3 | *14,9* | *12,7* | *4,5* | *3,6* | *3,0* |
| 16 `size.200` | 40,7 | 34,0 | 25,5 | 17,0 | *14,6* | *5,1* | *4,1* | *3,4* |
| 20 `size.300` | 50,9 | 42,4 | 31,8 | **21,2** | 18,2 | *6,4* | *5,1* | *4,2* |
| 24 `size.400` | 61,1 | 50,9 | 38,2 | 25,5 | **21,8** | *7,6* | *6,1* | *5,1* |
| 30 `size.500` | 76,4 | 63,7 | 47,8 | 31,8 | 27,3 | *9,6* | *7,6* | *6,4* |
| 38 `size.600` | 96,8 | 80,6 | 60,5 | 40,3 | 34,6 | *12,1* | *9,7* | *8,1* |
| 48 `size.700` | 122,2 | 101,9 | 76,4 | 50,9 | 43,7 | *15,3* | *12,2* | *10,2* |
| 64 — | 163,0 | 135,8 | 101,9 | 67,9 | 58,2 | **20,4** | 16,3 | *13,6* |
| 80 — | 203,7 | 169,8 | 127,3 | 84,9 | 72,8 | 25,5 | **20,4** | 17,0 |
| 96 — | 244,5 | 203,7 | 152,8 | 101,9 | 87,3 | 30,6 | 24,4 | **20,4** |

Três resultados que a tabela produz e que ninguém adivinharia:

1. **A legibilidade aperta no espaço grande, não no pequeno.** A 250–300 mm (dispositivo na mão),
   16 px rende 34′–41′ — folga enorme. A 600 mm, os mesmos 16 px caem a 17,0′: acima do mínimo,
   **fora** da banda recomendada. A 700 mm, 14,6′: **abaixo do mínimo**. Logo o piso de dado
   essencial na estação fixa é **20**, não 16 — e sobe a **24** se a distância real passar de
   ~650 mm. "Mobile-first" restringe **largura**; quem restringe **tamanho** é a distância —
   o balcão fixo e a parede.
2. **A escala de `tokens.md` §6 não alcança o display à distância.** Seu topo, `size.700` = 48,
   rende 15,3′ a 2 m — abaixo do mínimo de R-5. Aquele espaço exige **64 / 80 / 96**, um degrau por
   distância. Esses três números não saem da razão 1,25 (que daria 60 / 75 / 94): saem do **ângulo**,
   e por isso rendem os mesmos 20,4′ a 2 m, 2,5 m e 3 m — a razão entre tamanho e distância é a mesma
   constante (0,032 px por mm de distância) nos três. Piso de legibilidade vence razão de escala,
   como `tokens.md` §6 já fez duas vezes ao declarar seus desvios. **Não criei esses tokens** — o arquivo de tokens é do passo 1 e está em 398
   de 400 linhas; a demanda vai em `RISCOS`.
3. **Largura física não compra coluna.** A 2,5 m o piso é 80 — exatamente **5×** o piso de 16 de um
   dispositivo na mão. Uma coluna com o mesmo número de caracteres fica 5× mais larga, então um
   display 5× mais largo mostra **o mesmo número de colunas**. O ângulo come a largura.

### 2.5 Passo 5 — o módulo é anisotrópico

O módulo quadrado da grade suíça é herança de página: papel não rola e não tem dedo. Recuso o
**mecanismo** (módulo quadrado), preservo a **necessidade** (alinhamento, ritmo, contenção,
repetição previsível). O módulo novo é melhor porque cada eixo passa a ser governado pela grandeza
física que o rege — e isso se prova medindo alvo e ângulo, não olhando:

- **Horizontal:** trilha com piso `target.min` = 48, fluida acima disso; largura de conteúdo contida
  pela medida de linha (R-7).
- **Vertical:** ritmo de `grid.unit` = **8**; linha interativa quantizada em 48 ou 64; nada mais.

## 3. A grade

| Token | Valor | Origem |
|---|---|---|
| `grid.unit` | 8 | base de `tokens.md` §7 |
| `grid.track-min` | 48 | §2.1 |
| `grid.gutter` | 16 (piso 12) | §2.3 |
| `grid.pitch` | 64 | `track-min` + `gutter` — o passo com que a contagem de trilha avança |
| `grid.margin` | 16 · 24 · 32 · 48 | por faixa de contagem, §3.2 |
| `measure.max` | 66 caracteres | R-7 |

### 3.1 A contagem de trilhas é saída, não entrada

Dada a largura útil `W` da **área de interação** (§6.1), a contagem `n` é a maior que satisfaz
`n·48 + (n−1)·16 + 2·margem ≤ W`. Procedimento determinístico, em quatro passos:

1. calcule `n` com margem 16;
2. se `n ≥ 8`, recalcule com margem 24; se `n ≥ 12`, com 32; se `n ≥ 16`, com 48;
3. largura da trilha = `(W − 2·margem − (n−1)·16) / n`, sempre ≥ 48;
4. `n = 0` é impossível: abaixo de 80 px não existe grade — existe um alvo e nada mais.

Limiares que essa aritmética produz (consequência, **não** catálogo de dispositivo):

| n | W mínimo | margem |
|---|---|---|
| 1 | 80 | 16 |
| 2 | 144 | 16 |
| 4 | 272 | 16 |
| 6 | 400 | 16 |
| 8 | 544 | 24 |
| 12 | 816 | 32 |
| 16 | 1104 | 48 |

Nenhuma largura de tela é presumida em lugar nenhum deste arquivo. Contagem ímpar é válida: os
degraus da tabela são só onde a **margem** muda. **Não existe breakpoint nomeado por dispositivo**
neste sistema; existe contagem de trilha, e ela é calculada da largura que o cliente realmente tem.

### 3.2 Ritmo vertical e quantização da linha

Toda altura é múltipla de 8. Para que isso sobreviva à entrelinha de `tokens.md` §6, a **caixa de
linha é arredondada para cima ao múltiplo de 4**: 20×1,15 = 23 → **24**; 16×1,35 = 21,6 → **24**;
24×1,15 = 27,6 → **28**; 64×1,15 = 73,6 → **76**. Sem essa quantização o ritmo desvia uma fração por
linha e a coluna deixa de alinhar depois de cinco itens.

Uma linha interativa de 48 com rótulo de 20/1,15 fecha exatamente: 24 de caixa de linha + 12 + 12 de
respiro. O piso de rótulo de ação primária do §6 dos tokens **cabe** no alvo mínimo — verificado por
aritmética, e é a razão de eu não precisar reduzi-lo (§8, L-1 do passo 1).

### 3.3 Alinhamento e contenção

- Texto alinhado à **esquerda** da trilha, borda irregular à direita, nunca justificado.
- **Exceção declarada e única:** coluna de valor e de quantidade alinha à **direita**, com algarismo
  tabular (`type.numeric.tabular`). Comparar magnitude é comparar posição de dígito; alinhar valor à
  esquerda destrói a única leitura de relance que a coluna oferece.
- **Nada é centralizado**, exceto um glifo dentro do próprio alvo.
- Largura sobrando **não** estica a linha de texto além de `measure.max`, e **não** estica coluna de
  valor: sobra vira trilha vazia ou outra região. Contenção suíça aqui é funcional, não estética.
- Trilha vazia por ornamento é defeito.

## 4. Os quatro espaços

Nome de espaço é **funcional**. Nenhum se chama pelo ramo de quem o usa (`CLAUDE.md` §7.3): `COZ`
usa E4, `PCF` vive em E3 — e nem um nem outro nomeia o espaço. Cuidado de vocabulário: `terminal` já
é entidade de produto (`glossario.md`: o dispositivo onde se opera o PDV). Estes são **espaços de
desenho**, não a entidade — daí `station`, não `terminal`.

| | **E1** `space.operator-station` | **E2** `space.operator-handheld` | **E3** `space.customer-personal` | **E4** `space.distant-display` |
|---|---|---|---|---|
| Descrição | estação fixa de operador | dispositivo de operador em movimento | dispositivo pessoal do cliente-final | display fixo de leitura à distância |
| Distância presumida | 500–700 mm | 300–450 mm | 250–400 mm | 2000–3000 mm |
| **Alvo mínimo** | **64** no caminho crítico; 48 fora dele | **64** crítico; 48 secundário | **48** | **sem toque** |
| **Piso de texto** | **20** (dado e rótulo); 24 se distância > 650 mm; 16 **só** metadado não essencial | 16 corpo; **20** dado e rótulo | **16** | **64** a 2 m · **80** a 2,5 m · **96** a 3 m |
| Interação primária | **teclado + leitor**; toque é caminho válido, nunca o único | toque; teclado/leitor quando o terminal os tem | toque, um polegar | **nenhuma** |
| Faixa de densidade | `eyes-free` no crítico · `standard` · `compact` só em consulta/retaguarda | `eyes-free` no crítico · `standard` | `standard` (`compact` **proibido**) | `distance` |
| **Mobile-first é** | **método** | **método** | **alvo literal** | **nem um nem outro** |

**E1** é o alvo funcional do produto e o espaço mais tensionado: é onde a distância é maior, onde o
alvo é maior e onde a demanda por densidade de informação é maior. Mobile-first como método (partir
da restrição e subir) vale; como alvo literal, não: aqui a tela é larga e a restrição é o ângulo.

**E2** é o mesmo operador, o mesmo caminho crítico, com o corpo em movimento e uma mão ocupada — daí
o alvo crítico continuar 64 apesar da distância curta. Instabilidade da mira não é distância.

**E3** é o único espaço em que mobile-first é alvo literal, e — pela tabela do §2.4 — o espaço com
**mais** folga de legibilidade e **menos** folga de largura. O usuário é não treinado, usa uma vez,
não tem treino motor: `density.compact` é proibido aqui, e o hardware é dele (densidade real
incognoscível, §9 G-04).

**E4** é o **inverso** de mobile: leitura a 2–3 m, sem toque, sem foco, sem teclado. Não se deriva de
E1 por escala: deriva-se **independentemente**, do ângulo (§2.4). Nenhum bloco serve E4 e outro
espaço sem redeclarar densidade — e o passo 4 herda que ali não há estado de foco a exibir.

## 5. Densidade — derivada, e declarada

Densidade **não** é um eixo livre. `ui.md` §2 fixa **espaço** e **interação** como eixos ortogonais;
densidade é o **mínimo que satisfaz os dois** mais uma terceira entrada que vem do produto: se o
slot está no **caminho crítico** (`PN-06`). Três entradas, uma saída — e a saída é declarada, não
detectada.

Uma faixa de densidade controla **duas** grandezas, e só essas duas: o **alvo** e a **separação**
entre linhas. Ela **não** controla piso de texto — esse é do espaço (§4), e a faixa nunca o abaixa.

| Faixa | Alvo mín. | Separação entre linhas | Onde |
|---|---|---|---|
| `density.compact` | 48 | `spacing.200` (16) | consulta e retaguarda em E1. Nunca caminho crítico, nunca E3 |
| `density.standard` | 48 | `spacing.300` (24) | E2, E3, e E1 fora do crítico |
| `density.eyes-free` | **64** | `spacing.400` (32) | caminho crítico de E1 e E2 |
| `density.distance` | — (sem alvo) | `spacing.600` (48) ou mais | E4 |

**O piso de texto é do espaço e a densidade só pode elevá-lo, nunca reduzi-lo.** É aqui que o
instinto de painel entra no sistema: "denso" quer dizer texto menor, e não pode querer. `compact` em
E1 comprime **respiro**, e só concede o degrau de 16 ao **metadado não essencial** que o §4 já
autoriza naquela distância — nunca a dado, valor, quantidade, código ou rótulo.

**O piso de rótulo de ação primária é 20 em todas as faixas, inclusive em `compact`.** Isso não é
conforto: `tokens.md` §5 mantém o acento como preenchimento de ação com margem **zero** de
contraste, aceitável só enquanto o rótulo for texto grande (`size.300`, peso 600) — 20 px com peso
600 é texto grande para efeito de contraste; 18 não é. Reduzir esse rótulo aqui reprovaria contraste
medido em outro arquivo.

### 5.1 Como um bloco declara, e o que acontece fora da faixa

Todo bloco do catálogo declara, junto do contrato exigido por `ui.md` §2: a **faixa contígua** de
densidade que serve (ex. `compact..standard`) e o conjunto de modos de interação que suporta. Quem
resolve a densidade é o contexto do espaço, e o bloco a **recebe**. Bloco não detecta espaço, não
mede janela, não pergunta que dispositivo é.

**A fronteira entre variante e bloco novo é a ordem dos slots.** Se apenas os degraus mudam
(espaçamento, tamanho, alvo), é **um** bloco com variante de densidade. Se o conjunto ou a **ordem**
dos slots muda, são **dois** blocos e quem escolhe é o manifesto. Um `if` estrutural interno muda
posição em silêncio — e posição é contrato (`PN-06`). Esta é a regra que impede o componente cheio
de exceção.

Bloco pedido fora da faixa que declarou:

1. **Não renderiza na densidade errada.** O nó é descartado como qualquer nó inválido de manifesto
   (`ui.md` §1): irmãos sobrevivem, a tela não fica vazia, não há erro de tela.
2. **Exceção, e ela é assimétrica:** se o slot está na zona de ação crítica (§6.2), o descarte é
   proibido — cai no bloco de piso, que renderiza a ação com rótulo de texto no alvo mínimo do
   espaço. Omitir uma ação de cobrança é venda perdida; renderizá-la sem enfeite não é.
3. **Nunca** encolher o alvo para caber. Não cabe? Aplica-se o §5.2.

### 5.2 Transbordo: encolhe o conteúdo, nunca o alvo

Nesta ordem, e sem pular etapa: (1) remove slots declarados descartáveis, por prioridade declarada;
(2) pagina ou rola a região de fluxo; (3) para. **Não existe etapa que reduza alvo, reduza rótulo de
ação, reordene slot ou quebre a zona de ação em duas linhas.** É a lei 5 de `tokens.md` §10 aplicada
à geometria: minimalismo é sobre ornamento; alvo e sinalização não são ornamento.

## 6. Ancoragem — como a grade cumpre `PN-06`

### 6.1 A âncora é a área de interação, não a janela

`area.interactive` = a janela **menos** teclado virtual, barra de sistema e qualquer sobreposição
persistente. Toda âncora é relativa a ela. É o que resolve o caso do teclado virtual em E3: a zona
de ação sobe junto, mantendo a **mesma** borda e a **mesma** ordem — ela não "se move", a área é que
mudou de tamanho.

### 6.2 Duas zonas, e uma delas não flui

- `zone.flow` — a região que cresce (o conteúdo). Reflui, pagina, rola.
- `zone.anchor-top` — faixa ancorada à borda superior: contexto e estado. É onde vive o indicador de
  conexão e de pendências, que `layer.alert` de `tokens.md` §8 já proíbe de ser encoberto
  (`RN-OFF-018`). Posição fixa **e** camada acima de tudo: o operador acha sem procurar.
- `zone.anchor-bottom` — faixa ancorada à borda inferior: **ações do caminho crítico**.

A borda inferior é a âncora das ações por três razões, e a terceira é derivada, não preferência:
é o arco do polegar em E2/E3; é onde a mão descansa (teclado, balcão) em E1; e é a **única** borda
que não se move quando o conteúdo cresce — a lista de itens da venda cresce para baixo a partir do
topo, então qualquer ação ancorada no fluxo migra a cada item lançado. Qual borda física fica mais
perto da mão em E1 depende do arranjo real do balcão (§9, G-06).

### 6.3 As quatro garantias que a grade dá a `PN-06`

1. **Contagem de slots fixa por contrato.** A zona de ação declara N slots. **Slot vazio não
   colapsa.** Colapsar move tudo que vem depois — é o modo mais comum de a posição mudar sem
   ninguém decidir nada, e é exatamente o que `PN-06` recusa.
2. **A zona de ação nunca reflui nem quebra linha.** Não cabe? §5.2 remove item descartável. Nunca
   reordena, nunca empilha.
3. **Mudar de densidade muda o tamanho da zona (linhas de 48 ↔ 64), nunca a borda nem a ordem.** O
   alvo cresce a partir da âncora; a origem fica parada.
4. **A grade não reordena visualmente o que não está reordenado na sequência de leitura.** Refluxo
   pode mudar onde a linha quebra; nunca a ordem. Ordem visual, ordem de leitura e ordem de foco são
   a mesma ordem, sempre — e é isso que faz o §7 funcionar.

Mover uma ação de caminho crítico exige decisão registrada e aviso (`PN-06`). Nenhuma das regras
acima proíbe **evoluir** a interface: proíbe que ela se mova como efeito colateral de refluxo.

## 7. `PN-05` — a grade e o caminho sem toque

`PN-05` **não recusa o toque**: exige que o caminho por teclado e leitor exista **inteiro**. O que a
grade deve a isso:

- **Índice de slot é índice de atalho.** A posição ordinal do slot na zona de ação é a mesma ordem de
  foco e a mesma ordem do acelerador de teclado. Assim a memória de posição e a memória de tecla são
  uma memória só — e a garantia 4 do §6.3 é o que sustenta isso.
- **Espaço reservado para o anel de foco.** A calha de §2.3 existe para o anel caber sem recorte. Um
  alvo colado na borda da área de interação teria o anel cortado: todo alvo focável fica a pelo menos
  `focus.offset + stroke.300` = 5 px de qualquer borda de recorte.
- **E4 não tem foco.** Sem interação, não há ordem de foco a manter — a única simplificação que
  aquele espaço ganha.
- Em E2 sem teclado físico, o caminho por toque é o único que existe: por isso o alvo crítico lá é 64
  e não 48. Se `PN-05` vincula ou não um terminal sem teclado é pergunta a `produto` (§9, G-07).

## 8. Leis desta camada

1. Alvo e ângulo definem o módulo. Contagem de coluna é saída, nunca entrada.
2. Existem **dois** alvos: 48 e 64. Não se inventa um terceiro.
3. Alvo é valor absoluto da escala. **Nunca** fração do contêiner — largura fluida produziria 47,6.
4. Só o conteúdo é fluido; alvo, calha, margem e piso de texto não são.
5. Piso de texto é o da distância do espaço; densidade só o **eleva**. Rótulo de ação nunca < 20.
6. Calha entre alvos focáveis nunca desce de 12. Degrau óptico (2, 4) não separa alvos.
7. Densidade é derivada (espaço × interação × criticidade) e **declarada**. Bloco não detecta espaço.
8. Mudou a ordem dos slots? É outro bloco, não outra variante.
9. Transbordo remove conteúdo. Nunca encolhe alvo, nunca reordena, nunca quebra a zona de ação.
10. Slot vazio não colapsa.
11. Ordem visual = ordem de leitura = ordem de foco = ordem de atalho.
12. Toda altura é múltipla de 8; caixa de linha arredonda para cima ao múltiplo de 4.
13. Nenhum breakpoint nomeado por dispositivo. Nenhuma largura de tela presumida.
14. Sem termo de vertical em nome de espaço, de faixa de densidade ou de zona.

## 9. Conflitos reais — onde grade rigorosa e alvo grande brigam de verdade

Três pontos, e nenhum é contornável por escolha melhor de número. Declaro agora para não virarem
exceção dentro de componente depois.

**C-01 — Abaixo de ~272 px úteis, a grade modular deixa de existir.** Com piso de trilha 48 e calha
16, a aritmética do §3.1 rende ≤ 3 trilhas, e uma grade de 1–3 colunas não é grade modular: é pilha.
O método suíço ali se reduz a **ritmo vertical + alinhamento à esquerda + contenção** — as colunas
não fazem trabalho nenhum. Resolução: em espaço estreito não se autora layout de coluna. Quem tentar
compor 12 colunas para E3 está compondo exceção.

**C-02 — A calha faz trabalho ergonômico, não rítmico.** Uma grade rigorosa quer a calha como parte
do ritmo, livre para ser pequena onde o ritmo pede. Entre dois alvos focáveis ela não pode: R-1 e o
anel de foco a travam em 12. Resolução: a grade **cede**, e a lei 6 é dela, não da ergonomia.

**C-03 — Fluidez rigorosa e alvo absoluto são incompatíveis por construção.** Grade fluida distribui
largura em fração; alvo tem piso absoluto em milímetros. Uma trilha de 47,6 px é aritmeticamente
correta e ergonomicamente reprovada. Resolução: fluidez só no conteúdo (lei 3–4). O custo declarado
é que sobra largura não distribuída em algumas larguras de janela — e sobra é aceitável, alvo curto
não.

## 10. Lacunas — o que este arquivo não fecha

| # | O que falta | Dono | Impacto se não fechar |
|---|---|---|---|
| G-01 | O operador opera em dispositivo de tamanho **telefone** (na mão, junto ao cliente-final)? Se sim, é um quinto espaço: operador treinado, caminho crítico, alvo 64, largura de E3 — e C-01 se aplica ao **caminho crítico**, que é o pior lugar para ele se aplicar | humano | E2 hoje presume tablet |
| G-02 | **Terminal de autoatendimento** (canal de `PCF`, `glossario.md`): fixo, cliente-final não treinado, só toque, sem teclado, distância ~400–600 mm em pé. Não é nenhum dos quatro | humano / `produto` | espaço citado no produto e sem grade |
| G-03 | **Display de cliente-final de balcão** (equipamento de `PER`, `catalogo-de-modulos.md`): leitura curta/média, sem toque, por pessoa não treinada. Nem E3 nem E4 | humano / `produto` | idem |
| G-04 | **Densidade real e tamanho físico do hardware-alvo**, por espaço. Todo px deste arquivo é pixel de referência (R-6); em E3 o hardware é do usuário e não é controlável | humano | a coluna de px de §2.4 é recalculável; a de ângulo não muda |
| G-05 | Degraus de tipografia **acima de 48** para E4 (64 / 80 / 96, §2.4) — o token é do arquivo do passo 1 | `ui` (passo 1/2b) | E4 fica abaixo do mínimo de R-5 |
| G-06 | Qual borda de E1 fica mais perto da mão em repouso (arranjo de balcão, lado do teclado, canhoto) | humano | §6.2 fixa a inferior por ora |
| G-07 | `PN-05` vincula terminal **sem** teclado físico (E2 só-toque)? | `produto` | muda se E2 exige teclado ou só o suporta |
| G-08 | Confirmar cláusula e edição de **ISO 9241-303** (R-5) antes de virar teste | humano | banda 18′–22′ mudaria um arredondamento |

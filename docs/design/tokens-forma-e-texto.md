# Tokens de forma e texto — núcleo (§6–§9)

Dono: agent `ui`. Escopo: **núcleo**, todo cliente, todo módulo, todo espaço.
Criado 2026-08-22 (passo 1), corrigido 2026-08-22 (passo 2b, §8: o indicador de foco).

Entrada: `docs/design/tokens.md` (mapa de seções, leis do §10, lacunas do §11).
Cor, camada semântica e pares de contraste: `docs/design/tokens-cor.md` (§1–§5).
A numeração de seção é **global aos três arquivos** e não foi renumerada na divisão.

## 6. Tipografia — classe e característica, nunca família

`type.family-class` = **grotesca neutra** (Helvetica-like), alinhamento à esquerda, nunca
justificado. **A família licenciada não é escolhida aqui**: é dependência, e a pergunta vai ao
humano (§11, em `tokens.md`).

Características **exigidas** de qualquer família que ocupe essa classe:

1. **Algarismo tabular.** Obrigatório em coluna de valor, de quantidade e de código
   (`type.numeric.tabular`). Largura de dígito variável faz a coluna de preço dançar entre linhas —
   é defeito de leitura num caixa, não preferência estética. `type.numeric.proportional` só em texto
   corrido.
2. **Altura-x alta** — legibilidade de relance a distância de terminal.
3. **`0`/`O` e `1`/`l`/`I` distinguíveis.** O operador confere código de item lido pelo leitor
   contra o rótulo na tela; ambiguidade de glifo aqui vira item errado na venda.
4. Pesos 400 e 600 disponíveis. **Nada abaixo de 400**: traço fino desaparece em tela barata, sob
   reflexo e com poeira — condição normal de caixa, não exceção.
5. Diacrítico de pt-BR completo e glifo de moeda.

### Escala

Base `type.size.200` = 16, razão **1,25** (terça maior), arredondada ao inteiro par.

| Token | px | Papel típico |
|---|---|---|
| `type.size.100` | 14 | metadado não essencial |
| `type.size.200` | 16 | **piso** de corpo e de dado |
| `type.size.300` | 20 | **piso** de rótulo de ação primária |
| `type.size.400` | 24 | título de bloco; valor de linha |
| `type.size.500` | 30 | total da venda |
| `type.size.600` | 38 | valor em leitura a distância |
| `type.size.700` | 48 | valor em leitura a distância |

Dois desvios declarados: a razão pura desceria a 12,8 e eu **elevei** o degrau para 14, porque 13
está abaixo do piso de leitura de um terminal; e 25 foi arredondado para 24. `type.size.100` é
**proibido** para preço, quantidade, código de item e rótulo de ação — é o degrau que uma tela de
painel usaria para tudo, e é onde este sistema morreria num caixa.

| Token | Valor | Uso | | Token | Valor | Uso |
|---|---|---|---|---|---|---|
| `type.weight.regular` | 400 | padrão | | `type.leading.normal` | 1,35 | rótulo e UI |
| `type.weight.strong` | 600 | rótulo de ação, valor, cabeçalho | | `type.leading.prose` | 1,50 | texto corrido |
| `type.leading.tight` | 1,15 | valor grande, dado de uma linha | | `type.tracking.normal` | 0 | padrão |
| `type.tracking.tight` | −0,01em | só de `size.500` para cima | | `type.tracking.caps` | +0,04em | caixa alta, ≤ 2 palavras, **nunca** dado |

Caixa alta destrói a silhueta da palavra, que é justamente o que o operador que não lê usa para
reconhecer. Daí o limite de duas palavras e a proibição em dado.

## 7. Espaçamento

**Prefixo corrigido em 2026-08-23 (T-0002, V-01): a escala é `spacing.`, não `space.`.** `space.` ficou
com uma espécie só, os quatro espaços de desenho (`grade-e-espacos.md` §4) — porque é essa a espécie que
a prosa deste sistema chama de "espaço", e a prosa chama esta de "espaçamento". Enquanto as duas
dividiam prefixo, a espécie de um id só se resolvia pelo **formato do sufixo** (número vs `kebab-case`),
o que é o defeito, não a solução. O rename cabe aqui e não em id de bloco: token de estilo não atravessa
a rede, então nenhum terminal em versão antiga pede `space.200` (`vocabulario-e-eixos.md` §1.5, e o
contraste com §1.4). A regra de formação que impede o próximo prefixo duplicado está em §1.5 daquele
arquivo.

Base `spacing.100` = **8**. A escala é aditiva em quartos da base, não geométrica: razão pura não
produz 12, e 12 é o passo necessário entre rótulo e campo. 8 é a base porque é divisível por 2 e 4 e
sobrevive a arredondamento em densidade fracionária.

| Token | px | | Token | px |
|---|---|---|---|---|
| `spacing.025` | 2 | | `spacing.300` | 24 |
| `spacing.050` | 4 | | `spacing.400` | 32 |
| `spacing.100` | 8 | | `spacing.600` | 48 |
| `spacing.150` | 12 | | `spacing.800` | 64 |
| `spacing.200` | 16 | | | |

`spacing.025` e `spacing.050` são só ajuste óptico (hairline, ícone dentro do alvo). **Nunca** separam
blocos: separação de bloco começa em `spacing.200`. Alvo de toque, densidade e grade **não** saem
desta escala aqui — saem no passo 3, que consome estes degraus.

## 8. Forma, traço, elevação e camada

Forma carrega significado, e por isso é um dos sinais não-cromáticos de estado (§10.4, em `tokens.md`):

| Token | Valor | Significado |
|---|---|---|
| `radius.000` | 0 | superfície, painel, linha, campo — o padrão suíço |
| `radius.100` | 4 | **acionável** |
| `radius.full` | pílula | **estado** — nunca acionável |

| Token | Valor | Uso | | Token | Valor | Uso |
|---|---|---|---|---|---|---|
| `stroke.100` | 1 | hairline, divisor | | `stroke.200` | 2 | limite de controle, seleção |
| `stroke.300` | 3 | **membro escuro do foco** | | `focus.offset` | 2 | **membro claro do foco** |

### 8.1 O indicador de foco é um par de contornos

O foco não é um anel de uma cor. São **dois contornos contíguos**, e nunca se desenha um sem o
outro — a razão está em `tokens-cor.md` §3.2 e é medida: `focus-ring` sobre `danger` dá **2,89** e
reprova o piso de 3:1, enquanto o membro claro sobre o mesmo vermelho dá 6,02.

Da borda do alvo para fora:

| Banda | Largura | Cor | Papel |
|---|---|---|---|
| interna, contígua ao alvo | `focus.offset` = 2 | `color.focus-ring-contrast` | carrega o contraste sobre preenchimento escuro |
| externa | `stroke.300` = 3 | `color.focus-ring` | carrega o contraste sobre superfície clara |

**O footprint não mudou com a correção**: continuam `focus.offset + stroke.300` = **5 px por lado,
fora da borda do alvo** — a aritmética que `grade-e-espacos.md` §2.3 (calha de piso 12) e §7 (5 px
de qualquer borda de recorte) consomem. O que mudou é que a banda de 2 px, que era **vaga
transparente**, agora é **pintada**. Nada do passo 3 se recalcula.

**Por que pintar a banda resolve o 2,89.** Com a banda transparente, o preenchimento do alvo
aparecia dentro dela e a vizinhança do traço escuro era o próprio preenchimento — em `danger`, uma
fronteira de 2,89. Pintada, essa fronteira única vira duas, ambas folgadas: preenchimento contra o
membro claro (6,02 em `danger`) e membro claro contra membro escuro (17,40). Nenhuma banda mudou de
lugar nem de largura; o que mudou é que o indicador deixou de tomar o fundo do alvo como vizinho.

A tabela de `tokens-cor.md` §5.2 mede **membro × fundo**, de propósito independente de geometria: no
caso normal (indicador para fora) o membro claro encosta no preenchimento do alvo e o escuro na
superfície atrás; no caso de recorte (indicador para dentro) os dois ficam sobre o preenchimento. Em
qualquer dos dois, ao menos um membro cumpre 3:1 contra o que ele toca, e os dois cumprem entre si.

O nome `focus.offset` ficou de quando a banda era vaga. A **dimensão** é a mesma e é ela que o passo
3 cita; renomear custaria duas citações em outro arquivo para ganhar zero. O significado correto é o
desta tabela.

Duas consequências que quem implementa não pode inverter:

1. **Os dois membros contrastam 17,40 entre si** (mesmo par primitivo de `focus-ring` sobre
   `surface-raised`). É por isso que o indicador é discernível **por si**, sem depender do fundo — e
   é por isso que o conjunto de preenchimentos do sistema pode crescer sem remedir o foco.
2. **Espessura 3 e contorno duplo são reservados ao foco** e a nada mais no sistema. Essa é a perna
   não-cromática exigida por §10.4 de `tokens.md`: o indicador é reconhecível por forma mesmo onde um dos membros
   tem contraste fraco. Nenhum outro traço do sistema pode adotar `stroke.300`.

Alvo colado numa borda de recorte, onde não cabem os 5 px externos: o indicador é desenhado
**para dentro**, na mesma ordem relativa (claro contíguo ao alvo, escuro por fora dele), nunca com
espessura reduzida. Preferir isso a encolher o indicador é a mesma lei de §10.5 (`tokens.md`) — minimalismo é
ornamento, não sinalização. `grade-e-espacos.md` §7 evita esse caso reservando a folga; ele existe
aqui para o caso em que o espaço não permite.

Minimalismo suíço restringe sombra, então **camada se lê por degrau de valor e hairline**: fundo de
tela `surface` (cinza), conteúdo `surface-raised` (branco), separados por `border`. As duas âncoras
claras fazem esse trabalho.

| Token | Valor | Uso |
|---|---|---|
| `elevation.000` | sem sombra | padrão de tudo que é estrutural |
| `elevation.100` | sem sombra, hairline no lado de contato | barra aderente/fixa |
| `elevation.200` | sombra única, `color.alpha.shadow` | **só** camada transitória |

A sombra existe em um caso só, e ele é funcional: camada transitória (sobreposição, modal, lista
suspensa) precisa dizer que é temporária e que o que está atrás está inativo — degrau de valor não
diz isso. Daí a sombra **mais** o véu `color.alpha.scrim`.

| Token | Ordem | Uso |
|---|---|---|
| `layer.base` | 0 | conteúdo |
| `layer.sticky` | 10 | barra aderente |
| `layer.overlay` | 20 | lista suspensa, dica |
| `layer.modal` | 30 | camada modal |
| `layer.alert` | 40 | estado de conexão e de pendência |

São **ordens, não valores absolutos**, e nenhum valor de camada existe fora desta lista.
`layer.alert` fica acima de `layer.modal` porque `RN-OFF-018` exige que o operador veja que está
offline e quantas operações estão pendentes **sem** modal de erro de rede: o indicador não pode ser
encoberto pela camada que ele contradiz.

## 9. Duração de feedback

| Token | Valor | Uso |
|---|---|---|
| `duration.000` | 0ms | reconhecimento de entrada: item lançado, tecla, código lido |
| `duration.100` | 120ms | saída de realce transitório |
| `duration.200` | 200ms | entrada de camada transitória |

O reconhecimento de uma entrada **aparece**, não anima: o operador dispara leituras em sequência e
qualquer animação de entrada vira dúvida sobre se a leitura pegou. Nada no caminho de venda espera
animação, animação nunca porta informação, e desligar movimento não pode remover informação.

Estes são valores de token — **especificação**, não medição. Nenhum orçamento de tempo de render,
de tela ou de pacote é fixado aqui.

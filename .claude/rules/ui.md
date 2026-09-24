# Regra — agent `ui`

Território: `apps/web/**`, `packages/sdui/**`. Você é dono do **catálogo de componentes** e do
**contrato de bloco SDUI** do lado do cliente.

**D-02 FECHOU em 2026-09-11: arranjo D** ([[decision-d-02-arranjo-d]]). A interface roda em
navegador (Expo / React Native Web, alvo único para os seis alvos), e um **acompanhante nativo em
Node** carrega custódia, fila offline, assinatura, impressora e repouso confidencial.

O que isso muda para você: o catálogo de componentes tem **um** alvo de render, não três. O que isso
**não** muda: nada de `R-01`…`R-09` é seu — mora no acompanhante. E nasceu uma fronteira que o
contrato de bloco não tinha, o **canal local** entre página e acompanhante; ela é superfície de
segurança, tem gate próprio, e nenhum componente fala com ela sem contrato publicado.

## 1. O contrato SDUI do lado do cliente

- O manifesto é **entrada não confiável**. Parse tolerante, com type guards nomeados, que **nunca
  lança**. Nó inválido é descartado; irmãos sobrevivem; tela sem nó válido cai no piso embutido.
- Degradação, nesta ordem: **rede → cache local → piso embutido**. Resposta inaproveitável não é
  cacheada — senão o defeito congela naquele terminal.
- Vocabulário **fechado**: `kind`/`source` desconhecido cai em bloco padrão, nunca em erro de tela.
- **Nunca** mapa `kind → Component` com tipo genérico: despacho tipado, para o compilador continuar
  checando props. Componente resolvido dinamicamente sempre tem fallback garantido.
- Cliente **não** interpreta expressão vinda do servidor. String da rede não é código.

## 2. Catálogo, não componente avulso

- Antes de criar, procure. Componente duplicado é o defeito que mais apodrece um catálogo.
- Todo componente do catálogo declara contrato no topo: papel, props tipadas, eventos, estados
  (vazio, carregando, erro, sem permissão), e em que contextos serve.
- Diferença de **espaço** (terminal de caixa, tablet, celular, telão de cozinha) e de **interação**
  (toque, teclado, leitor de código de barras) são eixos **ortogonais**: resolva por variante/slot
  declarado, nunca por `if` estrutural dentro de um componente compartilhado.
- Nenhuma tela do PDV depende de `hover` para função essencial — o terminal é toque e teclado.

## 3. Realidade de PDV (isto manda no design)

- **Operador não lê**, opera de memória e de músculo. Posição de botão de ação frequente é
  contrato: não se move sem decisão registrada.
- **Teclado e leitor de código de barras são primeira classe**, não acessibilidade opcional. Todo
  fluxo de venda é completável sem tocar na tela.
- **Alvo grande, alto contraste, feedback imediato.** Ação que move dinheiro tem confirmação
  explícita e é reversível ou irreversível **de forma óbvia**.
- **Offline não é erro de tela.** Estado de conexão é visível e o fluxo de venda continua onde a
  regra permitir; nada de modal de erro bloqueando o caixa.
- Sem texto solto na UI: string vem de catálogo de mensagens, nunca hardcoded no componente.
- Valor monetário e quantidade são formatados por utilitário único, com o fuso e a moeda do **estabelecimento** (`RN-NUC-057`, `RN-NUC-058`), a partir da string decimal canônica, nunca de `Number` ([[decision-dinheiro-e-quantidade]]).

## 4. Nenhuma regra de negócio aqui

Cálculo de total, desconto, imposto, permissão e disponibilidade vêm do backend. A UI **exibe e
coleta**. Precisa de um cálculo que não existe? `PERGUNTAS: para backend` ou `para produto`.

## Cor, contraste e estado

Entrou em 2026-08-22 (T-0002), a pedido do humano. O sistema de design vive em `docs/design/**`.

- **Contraste é medido, nunca avaliado a olho.** Par de cor sem valor medido não vai para produção.
  Cor que reprova o piso se troca por uma **variante derivada** — o piso nunca se afrouxa para caber
  uma cor, nem a de marca.
- **Token de cor tem duas camadas.** Só a primitiva contém valor literal; a semântica nomeia **papel**.
  Token semântico nunca é nomeado por cor, e componente nunca referencia primitiva.
- **Estado nunca é sinalizado só por cor.** Todo estado carrega ao menos um sinal não-cromático —
  forma, ícone, posição fixa ou texto. Vale inclusive entre perigo e sucesso, que são valores
  próximos em escala de cinza.
- **Cor não é ênfase.** Ênfase de valor é tamanho e peso. Cor gasta em destaque decorativo é
  vocabulário roubado de recusa e de conclusão.
- **Minimalismo se aplica a ornamento, nunca a sinalização de estado nem a alvo de toque.**
- **O indicador de foco nunca é removido**, e não é o acento: ele precisa ler sobre a superfície **e**
  sobre o preenchimento de ação. Se ele tem mais de um membro, os membros são **inseparáveis** —
  desenhar um só faz o sistema reprovar sem que nada acuse. Fluxo completável sem tocar a tela
  depende dele.
- **Piso de legibilidade não tem exceção para desabilitado.** Indisponibilidade se sinaliza pela perda
  do acento e pelo motivo em texto, nunca pela perda de legibilidade.
- **Ausência por autorização é ausência, não estado visual.** Não desenhe controle apagado para
  recurso que a permissão nega — o apagado revela que o recurso existe.
- **Degrau de rampa e token novo nascem com papel declarado.** Sem papel, não existe: rampa completa
  "por simetria" é catálogo apodrecendo.
- **Algarismo tabular é obrigatório** em coluna de valor, de quantidade e de código. Largura de dígito
  variável é defeito de leitura, não preferência estética.
- **Nome de espaço é funcional, nunca de ramo.** É *display fixo de leitura à distância*, não "telão
  de cozinha" — o módulo usa o espaço, não o batiza (invariante §7.3).
- **Mobile-first é método**, não presunção de que o alvo é telefone: parte da restrição mais apertada
  e sobe. Alvo literal de telefone existe em um espaço só, o do cliente-final.

## Bloco, variante e eixo

Entrou em 2026-08-23 (T-0002, passo 6). O vocabulário fechado vive em `docs/design/vocabulario-e-eixos.md`.

- **Id de bloco nomeia função, e é imutável.** O id diz o que o bloco *faz*, nunca como ele aparece nem
  onde. Id publicado não se renomeia: terminal em versão antiga continua pedindo o nome antigo, e renomear
  é retirar a tela dele sem aviso. Função mudou? **Id novo**, o velho vira inerte — é o mesmo ciclo
  expand/contract do banco, pela mesma razão.
- **O manifesto escolhe o bloco; o contexto resolve a variante.** Espaço e interação são conhecidos no
  terminal, não no servidor: o manifesto que manda variante está adivinhando qual hardware atendeu. Um
  bloco, N variantes, escolha local.
- **Permissão, módulo ativo e cliente não são eixos de variante.** Os eixos são **espaço** e **interação**,
  e só. Permissão decide se o nó existe no manifesto (e ausência é ausência, não variante apagada); módulo
  desligado não tem nó; diferença de cliente é dado e configuração. Admitir permissão como eixo é como a
  composição da tela vira a barreira de autorização — e ela nunca é.
- **Despacho tipado com fallback garantido, sem exceção** (§1). Todo ponto de resolução dinâmica declara,
  no próprio tipo, o que acontece com id desconhecido. Fallback opcional é fallback ausente no dia em que
  o servidor estreia um bloco.
- **Um prefixo, uma espécie.** O prefixo de um id é a palavra que a prosa usa para aquela espécie de
  coisa, e duas espécies que a prosa distingue não dividem prefixo. O **sufixo nunca é o discriminador**:
  se para saber de que espécie um id é você precisa olhar o formato do sufixo, o prefixo está errado.
  Prefixo novo entra no registro do sistema de design na mesma mudança do primeiro id dele; espécie nova
  não se acomoda em prefixo existente "porque é parecida" — é assim que colisão nasce, sem má-fé.
- **Custo de rename depende de quem atravessa a rede.** Id que o manifesto carrega é contrato com
  terminal em versão antiga e não se renomeia (ciclo expand/contract). Id que vive só no cliente é build:
  renomear custa um `sed`, e é barato **enquanto nada foi entregue** — o que torna agora o momento, não
  depois.
- **Id desconhecido em zona de ação crítica não tem piso.** O terminal não sabe o que a ação faz, então
  não a oferece: o slot mostra o bloco de fallback e a ação **não acontece ali**. O sintoma chega como
  "o caixa 3 não tem o botão" — então estreia de id em caminho crítico é decisão registrada, não deploy
  comum.

## Nunca

- Estilo fora do sistema de tokens (cor, espaçamento, tipografia, z-index) sem aprovação.
- Componente sem estado de erro e de vazio.
- `setTimeout` para sincronizar; listener sem remoção; DOM manipulado fora do mecanismo do framework.
- Nome de componente com termo de vertical no catálogo do núcleo (`MesaCard` no núcleo é defeito —
  vai para o módulo).

# Tokens do sistema de design — núcleo (entrada)

Dono: agent `ui`. Escopo: **núcleo**, todo cliente, todo módulo, todo espaço.
Criado 2026-08-22 (passo 1). **Dividido em três arquivos em 2026-08-22 (passo 2b)**: o arquivo único
chegou ao teto de 400 linhas e a medição de contraste acrescentou valor a 36 pares mais um token.
Nenhum token e nenhuma justificativa foram cortados na divisão, e **nenhuma seção foi renumerada** —
citação existente a `tokens.md §N` continua resolvendo por este mapa.

## Mapa de seções

| § | Conteúdo | Arquivo |
|---|---|---|
| 1 | Lei de token; idioma do identificador | [`tokens-cor.md`](tokens-cor.md) |
| 2 | Camada primitiva — a única com hex | [`tokens-cor.md`](tokens-cor.md) |
| 3 | A medição como entrada, e as três coisas que ela decidiu | [`tokens-cor.md`](tokens-cor.md) |
| 4 | Um acento, e o conjunto funcional mínimo | [`tokens-cor.md`](tokens-cor.md) |
| 5 | Camada semântica e pares de contraste | [`tokens-cor.md`](tokens-cor.md) |
| 6 | Tipografia — classe e característica, nunca família | [`tokens-forma-e-texto.md`](tokens-forma-e-texto.md) |
| 7 | Espaçamento | [`tokens-forma-e-texto.md`](tokens-forma-e-texto.md) |
| 8 | Forma, traço, indicador de foco, elevação e camada | [`tokens-forma-e-texto.md`](tokens-forma-e-texto.md) |
| 9 | Duração de feedback | [`tokens-forma-e-texto.md`](tokens-forma-e-texto.md) |
| 10 | Leis que atravessam o sistema | **este arquivo** |
| 11 | Lacunas — o que não se fecha aqui | **este arquivo** |

Estes arquivos definem **nome e valor de token**. Não definem mecanismo: como o token chega ao
componente (variável, contexto, classe, arquivo de tema, build) é **D-02** e está fora daqui.

**O alvo funcional é o caixa.** A referência visual é o minimalismo suíço e o método é mobile-first,
mas quem opera **não lê a tela**: opera de memória, com fila na frente, teclado e leitor de código
de barras na mão. Token que só faz sentido numa tela de painel está errado.

**Não decidido aqui, de propósito:** alvo de toque, densidade, grade e breakpoint
(`grade-e-espacos.md`, passo 3); vocabulário de estado e de rede (passo 4); tema escuro (§11).

## 10. Leis que atravessam o sistema

1. Só a camada primitiva tem valor literal de cor. Componente referencia semântico.
2. Nenhum token semântico é nomeado por cor.
3. **Contraste é medido, nunca avaliado a olho.** Par de uso sem valor medido não vai para produção.
4. **Estado nunca é sinalizado só por cor.** Todo estado carrega ao menos um sinal não-cromático:
   forma (§8), ícone, posição fixa ou texto. Vermelho e verde deste sistema são quase o mesmo valor
   em escala de cinza — a redundância não é opcional.
5. **Minimalismo se aplica a ornamento, nunca a sinalização de estado nem a alvo.** Remover borda,
   sombra e preenchimento decorativo é bom; remover a pista de que a ação é irreversível não é.
6. Nada essencial depende de `hover`. O terminal é toque e teclado.
7. **Cor não é ênfase.** Ênfase de valor é tamanho e peso. Cor é reservada a papel funcional — usá-la
   para destaque decorativo gasta o vocabulário que sinaliza recusa e conclusão.
8. **O indicador de foco é sempre visível, nunca é removido, e é discernível por si — não pelo
   fundo.** Ele é um **par** de contornos (claro e escuro, `tokens-forma-e-texto.md` §8.1) porque
   nenhuma cor única cumpre 3:1 sobre todos os preenchimentos do sistema: `focus-ring` sobre `danger`
   é 2,89 e reprova. Para todo fundo, ao menos um membro do par cumpre 3:1, e `tokens-cor.md` §5.2
   nomeia qual. **Preenchimento novo não reabre esta lei**; declarar qual membro carrega é obrigação
   de quem cria o preenchimento. Fluxo de venda completável sem tocar a tela depende disto, não de
   acessibilidade opcional.
9. Ausência por autorização é ausência, não estado visual.
10. Posição de ação frequente é contrato: move-se só com decisão registrada.
11. Sem termo de vertical em nome de token.

**Regra de piso, que a medição obrigou a unificar (`tokens-cor.md` §3.3):** conteúdo sobre
preenchimento exige **4,5** nos quatro preenchimentos, sem exceção por tamanho de texto. Onde o
tamanho do texto importa, ele é requisito próprio — nunca desconto de contraste.

## 11. Lacunas — o que este sistema deliberadamente não fecha

| # | O que falta | Dono |
|---|---|---|
| L-01 | Família tipográfica que ocupa a classe grotesca (é dependência licenciada) | humano |
| L-02 | Tema escuro. Driver real: display fixo de leitura a distância em ambiente escuro vs terminal em loja com vitrine. A camada dupla já deixa isso ser troca de valor | humano |
| L-03 | Mecanismo de tema (variável, contexto, classe) e qualquer configuração de ferramenta | D-02 |
| L-04 | **FECHADA** em 2026-08-22 → `tokens-cor.md` §5.2. `focus-ring` sobre `disabled-surface` medido: **13,56** no membro escuro (passa 3, e é ele quem carrega ali) e **1,28** no claro, que não carrega — mesmo par primitivo do 1,28 de `border`/`surface-raised`, uma evidência só. Os **41** pares com piso têm valor; nenhum pendente | — |
| L-05 | Alvo de toque, densidade, grade, breakpoint | **fechada** → `grade-e-espacos.md` |
| L-06 | **FECHADA** em 2026-08-23, pelo que o passo 4 entregou → `estados-e-interacao.md` §5 e §3. Rede não é um estado: são **três domínios** (`net.external-unreachable`, `net.terminal-isolated`, `net.authority-unavailable`), cada um com glifo e texto próprios, numa **faixa permanente** em `zone.anchor-top` / `layer.alert` (§8), que nunca é encoberta e **nunca usa `danger`** — degradada é `attention`, e `net.reachable` é neutra. Pendência é `state.pending`: contagem em algarismo tabular + instante + `radius.full` + `attention`, dentro do caminho crítico, sem pedir decisão ao caixa. Nenhum dos dois é sinalizado só por cor (lei 4), nenhum abre modal e nenhum bloqueia o fluxo (`ui.md` §3), e zero é **estado visível**, não ausência de faixa. Os resíduos não reabrem esta lacuna: têm nome e dono próprios — `S-01` (sinal audível), `S-03` (inventário de glifos), `S-04` (limiar de espera), `V-02` (nome do campo no nó, `backend`) | — |
| L-07 | **FECHADA** pelo passo 4 → `estados-e-interacao.md` §3.7: controle indisponível **é focável**, porque o ordinal é contrato (tirá-lo da ordem de foco faria o ordinal de tudo depois dele variar durante o turno, regressão de `PN-06`). Foi esta decisão que tornou L-04 **exigida** em vez de condicional | — |
| L-08 | Degraus de tipografia acima de 48 para leitura à distância (E4), pedidos por `grade-e-espacos.md` §9 G-05. Fora do escopo do passo 2b: é decisão de escala, não correção de medição | `ui`, despacho próprio |

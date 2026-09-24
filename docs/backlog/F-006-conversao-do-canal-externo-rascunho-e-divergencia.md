# F-006 — `PCF`: o rascunho abandonado e a divergência entre exibir e submeter passam a deixar fato

**Tipo:** Comportamento fechado · **Estado:** a fazer · **Dono:** `produto` · **Território:**
`docs/produto/**` · **Cobre os achados** `2.4` e `2.5` da varredura do invariante 10

## Objetivo

O canal externo é a única superfície em que o cliente-final opera **sozinho**, e hoje nada do que ele
desiste de fazer sai de lá.

**O rascunho morre sem fato.** `docs/produto/modulos/pedido-cliente-final.md:69` diz que o rascunho
"morre sem consequência". A frase fala do **efeito** — não reserva, não gera trabalho, não cobra — e é
lida como se falasse do **registro**. As duas leituras cabem na mesma frase, e ninguém perguntou qual
valia. Resultado: quantos abrem o canal e quantos submetem não tem resposta, e em que passo o
cliente-final desiste, tampouco.

**A divergência entre exibir e submeter também não.** No infeliz de `RN-PCF-001` (`:106`), a submissão
chega com item fora do catálogo ou preço diferente do exibido; a regra manda apresentar a divergência ao
cliente-final e nada mais. Isso apaga a distinção entre **mudança legítima de catálogo** (o preço mudou
mesmo, e o canal está correto) e **defeito de publicação no canal** (o canal exibe coisa velha) — duas
causas que chegam ao operador como a mesma reclamação, e uma delas é nossa.

Os dois sobem juntos porque a divergência é causa direta do abandono que o primeiro mede: sem os dois,
a taxa de conversão do canal existe sem a explicação dela.

## Escopo

- **Fato de abertura e de morte do rascunho**, e o que ele continha ao morrer, no grão que a decisão
  exige (quantos itens, não quais itens de quem).
- **Fato de divergência na submissão**, com a espécie da divergência: item ausente do catálogo
  publicado, ou valor diferente do exibido.
- **Motivo de recusa**, quando a divergência produzir recusa: `published_artifact_incorrect` já existe
  na lista de correção de venda (`docs/produto/fatos-de-operacao-dominios-fechados.md:114`) e **não tem
  equivalente na lista de recusa**. O par faltando é indício de que a enumeração de recusa nasceu sem o
  caso do canal, e fechá-lo é do card.
- **Cláusula em `pedido-cliente-final.md:69`** distinguindo efeito de registro, para a frase parar de
  admitir as duas leituras.
- **As duas listas de captura** na spec de `PCF` (`modulos/pedido-cliente-final.md` §7), que hoje
  nomeiam as duas ausências **como acidentais** citando `2.4` e `2.5`.

## Fora de escopo

- **Identificar o cliente-final.** A sessão externa é anônima por construção e morre com o destino
  (`RN-PCF-016`), então o fato não carrega identidade nenhuma **e não precisa carregar** — a conversão
  do canal se mede sem saber quem desistiu. Este limite não é atenuação do item: é o que o torna
  barato.
- **`LACUNA-NUC-038` e o ciclo de vida do pedido do núcleo.** Já resolvido em 2026-09-11 (saída `B`,
  `RN-NUC-052` a `055`), e é **outro sujeito**: pedido local ao terminal, com operador identificado. O
  rascunho é outro dispositivo, outra sessão e outra decisão. Aprovar lá não cobriu isto.
- **Corrigir a publicação do canal.** O item entrega o diagnóstico que separa as duas causas; consertar
  a que for nossa é trabalho seguinte, e não tem item ainda.
- **Escalada para humano no canal** — é `ATI`, e é `F-008`. Os dois compõem a mesma leitura de
  conversão do canal externo e são itens separados porque atravessam contratos de módulo diferentes.

## Critério de aceite

1. Cliente-final abre o canal, monta três itens e fecha o dispositivo sem submeter. Existe **um** fato
   de rascunho abandonado, com a contagem de itens e o instante, e ele não carrega identificação
   nenhuma.
2. Contar, sobre uma janela e um estabelecimento, quantos rascunhos abriram e quantos submeteram
   devolve os dois números. Hoje devolve só o segundo, e "conversão do canal" é indeterminável.
3. Submissão chega com item que saiu do catálogo publicado → a divergência é apresentada ao
   cliente-final **como já acontece hoje**, e existe fato dela, com a espécie "item ausente".
4. Submissão chega com preço diferente do exibido → mesma coisa, com a espécie "valor divergente". As
   duas espécies são distinguíveis na leitura; se não forem, o item não resolveu nada.
5. Ler divergências por item e por janela separa catálogo que mudou de canal que exibiu velho. O caso
   concreto: o mesmo item aparecendo em divergência para submissões de vários dispositivos na mesma
   hora é publicação nossa; espalhado ao longo de dias é preço que mudou.
6. Falha ao registrar qualquer um dos fatos acima **não interrompe** a submissão nem a apresentação da
   divergência ao cliente-final (`CLAUDE.md` §7.10, terceiro limite). Ela mesma vira fato.

## Registra / Não registra

**Registra:**

- **Abertura do rascunho**, com estabelecimento, canal e instante.
- **Morte do rascunho sem submissão**, com quantos itens ele continha e há quanto tempo estava aberto —
  é o par que permite ver *onde* no fluxo a desistência acontece, não só *que* aconteceu.
- **Divergência na submissão**, com a espécie (item ausente × valor divergente), o item alcançado e o
  instante.

**Não registra, e por quê:**

- **Qualquer identificação do cliente-final.** A sessão é anônima por `RN-PCF-016` e o valor procurado
  — conversão, passo da desistência, defeito de publicação — não precisa dela. Spec que só entrega esse
  valor identificando a pessoa está medindo a coisa errada (`.claude/rules/produto.md`, limite 1).
- **O conteúdo completo do rascunho abandonado.** Contagem de itens responde "onde ele desistiu";
  guardar a cesta inteira de quem nunca comprou cria acervo de intenção com retenção própria, e nenhuma
  das decisões do card o usa. Reabrir isso é decisão do humano, não efeito de escrever o item.
- **Observação livre digitada e não submetida.** Texto de terceiro não vira campo de decisão
  (`RN-NUC-016`, e o precedente de `fatos-de-operacao-provedor.md` §4), e aqui ele nem chegou a existir
  como lançamento.
- **Duração da sessão externa como campo próprio.** Marco, não duração (`RN-NUC-045`): abertura e morte
  já são dois instantes.

## Depende de

**Nada em aberto — o item é executável hoje.** `RN-PCF-001`, `RN-PCF-016` e `RN-NUC-043` já existem; a
lista de recusa e a de correção de venda estão escritas e o par que falta está nomeado acima
(`fatos-de-operacao-dominios-fechados.md:114`).

**Uma condição de ordem:** se a espécie de divergência entrar como motivo enumerado, ela nasce junto
com a alteração de `RN-NUC-043` — enumeração aplicada depois não estreita nada. Vale a mesma nota de
passada compartilhada de `F-005` e `F-007`.

## Gate obrigatório

**`produto`** — fronteira: rascunho e divergência são de `PCF` (módulo), o motivo de recusa é do núcleo.
O card confirma que o corte segue o mesmo arranjo de `RN-NUC-056`.

**`seguranca`**, com escopo curto e nomeado, e este é o único dos sete itens que o exige na passada de
spec: o fato de rascunho é o mais próximo que este produto chega de observar comportamento de
cliente-final. O que se audita é uma coisa — que nada no desenho permita reidentificar a sessão anônima
por cruzamento (instante, canal, dispositivo, cesta).

## Referências

`docs/produto/captura-varredura-invariante-10-2026-09-11.md` §2.4 e §2.5 ·
`docs/produto/modulos/pedido-cliente-final.md:69` · `:106` · §7 (as duas listas) · `RN-PCF-016` ·
`docs/produto/fatos-de-operacao-dominios-fechados.md:114` · `RN-NUC-043` ·
`docs/produto/fatos-de-operacao-ciclo-de-vida-do-pedido.md` (o precedente do núcleo, e por que **não** é
o mesmo caso) · `CLAUDE.md` §7.10 · `F-008`

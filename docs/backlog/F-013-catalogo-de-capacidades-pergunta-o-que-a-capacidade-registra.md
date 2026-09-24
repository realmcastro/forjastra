# F-013 — O catálogo de capacidades passa a perguntar o que a capacidade registra e o que ela não registra

**Tipo:** Comportamento fechado · **Estado:** a fazer · **Dono:** `produto` · **Território:**
`docs/produto/**` · **Cobre o achado** `2.13` da terceira passada da varredura do invariante 10

## Objetivo

`catalogo-de-capacidades.md` §1 tem **14 campos obrigatórios**, e nenhum deles pergunta o que a
capacidade passa a registrar, nem o que ela deliberadamente não registra. O campo 13 (`pessoa`) cobre o
**limite** do invariante 10 — dado novo de pessoa —, que é a restrição, nunca o padrão.

A decisão de captura não some: quando a capacidade virar `RN`, `.claude/rules/produto.md` obriga as duas
listas. Ela fica **cara e tardia**, tomada por quem escreve a regra meses depois de quem escreveu a
necessidade — e a necessidade é quem sabia o que valia guardar.

**A prova de que o furo é real está dentro do próprio arquivo.** `CAP-REL-001` é a única das 10 entradas
que fala de fato irrecuperável, e fala por acidente, em dois campos cuja finalidade é outra: `EXIGE`
nomeia "o **registro da antecipação antes do período**, que hoje não existe", e `CUSTO QUE CRIA` o chama
de "a única parte irrecuperável". Quem escreveu enxergou; o formulário não pediu, e as outras nove não
enxergaram.

## Escopo

**A decisão do card é entre duas saídas, e ela não é minha:**

- **(a) campo 15 obrigatório.** Toda entrada passa a declarar as duas listas. Custo: retro-preencher as
  10 entradas existentes, num arquivo a 9 linhas do teto de 400 (`00-nucleo.md` §8) — o que obriga a
  decidir o que sai ou a partir o arquivo na mesma passada.
- **(b) cláusula de promoção.** A entrada continua nascendo com 14 campos; ela só é **agendável** depois
  de responder as duas listas. Custo: a pergunta continua sendo feita tarde, mas antes de virar
  trabalho — e nenhuma das 10 entradas precisa mudar hoje.

A saída (b) é mais barata e cobre o caso que importa, que é a capacidade **agendada**. A (a) cobre
também a candidata que nunca é agendada, e a pergunta é se isso vale o custo.

## Fora de escopo

- **Retro-preencher as 10 entradas** se a saída for (b) — por construção, não por preguiça.
- **Promover, agendar ou recusar qualquer `CAP`.** Nenhuma nasce aceita, e este item não muda o estado
  de nenhuma (`catalogo-de-capacidades.md` §1, e `roadmap-de-modulos.md` §2.2, R4).
- **Partir `catalogo-de-capacidades.md`.** Se a saída for (a), o eixo de partição é decisão da mesma
  passada; se for (b), o arquivo não cresce e a questão não se coloca.
- **`.claude/rules/produto.md`.** A regra já obriga as duas listas na spec de comportamento; ela não
  precisa mudar, e o território dela não é de `produto` de todo jeito.

## Critério de aceite

1. Uma entrada de capacidade nova, escrita depois deste item, não passa no filtro sem responder o que
   ela registra e o que ela deliberadamente não registra — com motivo na segunda lista.
2. `CAP-REL-001` é o caso de teste, porque ele já tem a resposta espalhada: o registro da antecipação
   antes do período sai de `EXIGE` e `CUSTO QUE CRIA` e aparece onde alguém procuraria por ele.
3. O método da §2 ("como se procura capacidade nova numa vertical") ganha a pergunta no passo em que a
   necessidade é nomeada — hoje ela não está em nenhum dos nove passos.
4. Nenhuma entrada existente muda de estado, e a contagem de 10 candidatas, 4 não desenvolvidas, 9 de
   horizonte e 7 recusadas continua exata.

## Registra / Não registra

**O que este item faz o sistema registrar:** nada, diretamente. Ele é o formulário, não o fluxo — e é
por isso que a seção existe aqui em forma invertida.

**Registra, como efeito:** toda capacidade escrita a partir daqui carrega a decisão de captura junto da
necessidade, no momento em que ela custa uma frase.

**Não registra, e por quê:** as capacidades já escritas continuam sem a declaração se a saída for (b).
É ausência **decidida** — o custo de retro-preencher 10 entradas num arquivo no teto não se paga para
candidata que talvez nunca seja agendada, e a `RN` de cada uma cobrará as listas quando ela for. O que
não pode acontecer é isso ficar por silêncio: ou o card escolhe (a), ou escreve esta cláusula.

## Depende de

**Nada em aberto — executável hoje.** O invariante 10 é lei desde 2026-09-11 (`CLAUDE.md` §7.10), a
anatomia da seção está em `.claude/rules/produto.md`, e o exemplar de como as duas listas se escrevem
está em `fatos-de-operacao-ciclo-de-vida-do-pedido.md` §3 e nos sete contratos de módulo.

## Gate obrigatório

**`produto`** — e o que se confere é uma coisa: a pergunta nova não pode transformar capacidade
candidata em spec de comportamento. O campo 2 já diz que o aceite "não se expande em `RN` aqui", e as
duas listas têm que caber na mesma disciplina — declaração de intenção, não regra.

## Referências

`docs/produto/captura-varredura-terceira-passada-2026-09-12.md` §2.13 ·
`docs/produto/catalogo-de-capacidades.md` §1 (os 14 campos) · §2 (o método) · `CAP-REL-001` ·
`CLAUDE.md` §7.10 · `.claude/rules/produto.md` ("Capturar é o padrão", e o esqueleto do card) ·
`docs/produto/fatos-de-operacao-ciclo-de-vida-do-pedido.md` §3 (o exemplar) ·
`docs/produto/roadmap-de-modulos.md` §2.2 · `.claude/rules/00-nucleo.md` §8

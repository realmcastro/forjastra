# F-009 — `REL`: desenhar o fato de leitura de relatório, para que a valoração de `LACUNA-NUC-037` decida sabendo o que perde

**Tipo:** Comportamento fechado · **Estado:** a fazer · **Dono:** `produto` · **Território:**
`docs/produto/**` · **Cobre o achado** `2.9` da varredura do invariante 10

## Objetivo

`REL` **não produz fato nenhum** por contrato (`docs/produto/modulos/relatorios.md` §3, "Nenhum evento:
`REL` não produz fato, só lê"), e ler relatório não tem linha em matriz nenhuma — é `LACUNA-NUC-037`.

A célula que vai criar essa linha decide **duas** coisas, não uma: quem lê, e se a leitura produz
registro (`R` × `P`, `RN-NUC-026`, `RN-NUC-029`). A cláusula que obriga a valoração a enxergar as duas
já entrou em 2026-09-12 (`matriz-operacao-papel-modulos.md` §9 e `matriz-celulas-a-valorar.md` §2, item
f). **O que falta é o material que torna a escolha informada:** o que exatamente o fato carregaria, o
que ele nunca carregaria, e o que se perde escolhendo `P`.

A assimetria que torna o buraco visível: **exportar** documento fiscal registra quem pediu, o escopo e o
volume (`RN-EMI-039`), e **ler** o agregado do mesmo período não registra nada. E a promessa de
`RN-REL-001` — "relatório existe pela decisão que informa" — hoje só é verificável **antes** de
construir, nunca depois.

## Escopo

- **O desenho do fato de leitura**: qual relatório, qual papel, qual escopo (estabelecimento × cliente,
  `RN-REL-006`) e sobre que janela. Desenho, não regra: nenhuma `RN` nova sai daqui.
- **A folha de decisão das duas saídas**, com o custo de cada uma escrito ao lado, no formato que a
  proposta de `LACUNA-NUC-038` usou em 2026-09-11 (`captura-ciclo-de-vida-do-pedido-proposta.md`) e que
  o humano já leu uma vez.
- **A cláusula de contrato em `relatorios.md` §3**, condicionada: se a célula for `R`, "nenhum evento"
  deixa de ser verdade e a linha muda na mesma passada. Escrever a condição agora é o que impede a
  contradição de nascer junto com a valoração.
- **As duas listas de captura** na spec de `REL` (`modulos/relatorios.md` §3), que hoje nomeiam esta
  ausência **como acidental**, citando `2.9`.

## Fora de escopo

- **Valorar a célula.** É do humano (`RN-NUC-026`), e nada aqui a antecipa. As 43 células `?` e o total
  de 380 de `matriz-operacao-papel-modulos.md` §8 continuam exatos — este item não acrescenta nenhuma.
- **Recorte por pessoa.** Quem leu, por pessoa, continua fora, por `RN-REL-008` e `LACUNA-REL-002`.
  Papel e escopo bastam para responder "este relatório é usado", e nada aqui os toca.
- **Exportar relatório.** Não é linha de `REL`: exportação do próprio dado pelo cliente é núcleo
  (`PN-10`), e exportação de documento fiscal é outra operação, com lacuna própria.
- **Ler a trilha como indicador de conduta de trabalhador.** É decisão do humano
  (`catalogo-de-capacidades.md` §8, último item), e a proximidade é o motivo de dizer isto em voz alta:
  um fato de "quem lê o quê" é o vizinho mais perigoso daquela pergunta.

## Critério de aceite

O aceite deste item é o **material de decisão**, não comportamento — o comportamento depende da célula.

1. A folha apresenta as duas saídas com o custo de cada uma: `R` (a leitura deixa trilha, com o que ela
   carrega e o que ela custa em volume) e `P` (a leitura não deixa rastro, e "este relatório é usado,
   por quem e com que frequência" fica sem resposta para sempre — pergunta sem backfill,
   `CLAUDE.md` §7.10).
2. A folha nomeia, item a item, o que o fato carregaria: relatório, papel, escopo, janela consultada,
   instante. E o que ele **nunca** carregaria — a lista de baixo desta seção.
3. A folha mostra a assimetria com `RN-EMI-039` em `path:linha`, porque é ela que torna o buraco
   argumentável em vez de opinável.
4. `relatorios.md` §3 passa a dizer que "nenhum evento" vale **enquanto** a célula for `P`, citando
   `LACUNA-NUC-037`. Hoje a frase é incondicional e vira contradição no dia da valoração.
5. Nenhuma célula é valorada e nenhuma contagem de matriz muda. Se alguma mudar, o item ultrapassou.

## Registra / Não registra

**Registraria, se a célula for `R`:**

- **Que um relatório foi lido**, com qual, por qual papel, em que escopo e sobre que janela.
- **O instante da leitura.** É o que transforma seis relatórios especificados numa resposta sobre quais
  são usados — a única conferência possível da promessa de `RN-REL-001`.

**Não registra em nenhuma das duas saídas, e por quê:**

- **Quem leu, por pessoa.** `RN-REL-008` e `LACUNA-REL-002`. Papel e escopo respondem a pergunta do
  card; pessoa responde outra, que é sobre conduta, e essa não é minha nem deste item.
- **O resultado da leitura** — os números que o relatório devolveu. Seria um segundo acervo do agregado,
  com outro leitor e outra retenção, pelo mesmo argumento de `RN-PRV-011`. O fato nomeia o que foi
  alcançado; não copia o que foi lido.
- **Nada quando `REL` está desligado.** Ausência de módulo **nunca** é gravada nem apresentada como
  zero, porque zero é fato e ausência não é (`RN-REL-005`).

## Depende de

**A parte de comportamento não é executável hoje, e a dependência tem nome e dono:** a valoração de
`LACUNA-NUC-037` é do humano, e é ela que decide se o fato existe. A pergunta está aberta desde
2026-09-12 e é esta: **ao valorar `LACUNA-NUC-037`, a leitura de relatório é `R` (deixa trilha) ou `P`
(não deixa rastro nenhum)?**

**O que substitui enquanto ela não vem:** este item **é** o substituto. Ele entrega a folha de decisão —
as duas saídas custeadas, o que o fato carrega, o que ele nunca carrega, a assimetria com `RN-EMI-039` —
para que a valoração aconteça informada em vez de por omissão. É trabalho inteiro e é executável hoje; o
que espera a resposta é só a `RN`, que este item não escreve de todo jeito.

O risco que ele existe para fechar está escrito na varredura: quem fechar a célula **tende a escolher
`P` por ser leitura**, sem perceber que decidiu a captura junto.

## Gate obrigatório

**`produto`** — a folha não pode nomear papel como se concedesse: prosa que nomeia papel é candidato,
nunca concessão (`RN-NUC-039`).

Nenhum gate de `seguranca` ou `performance` nesta passada. Os dois entram se a célula for `R`: volume de
leitura é custo, e "quem lê o quê" é superfície de auditoria.

## Referências

`docs/produto/captura-varredura-invariante-10-2026-09-11.md` §2.9 ·
`docs/produto/modulos/relatorios.md` §3 · `:30` · `RN-REL-001` · `RN-REL-005` · `RN-REL-006` ·
`RN-REL-008` · `docs/produto/matriz-operacao-papel-modulos.md` §8 e §9 (`LACUNA-NUC-037`) ·
`docs/produto/matriz-celulas-a-valorar.md` §2, item (f) · `RN-NUC-026` · `RN-NUC-029` · `RN-NUC-039` ·
`RN-EMI-039` · `RN-PRV-011` · `LACUNA-REL-002` ·
`docs/produto/captura-ciclo-de-vida-do-pedido-proposta.md` (o formato da folha) · `CLAUDE.md` §7.10

# F-008 — `ATI`: a escalada ganha o outro lado do marco — quem assumiu, e o que aconteceu com a que ninguém assumiu

**Tipo:** Comportamento fechado · **Estado:** a fazer · **Dono:** `produto` · **Território:**
`docs/produto/**` · **Cobre o achado** `2.6` da varredura do invariante 10

## Objetivo

`RN-ATI-012` registra que uma conversa foi **escalada** para humano. O outro lado do marco não existe:
o instante em que alguém **assume** a conversa escalada, e o desfecho da escalada que **ninguém
assumiu** (`docs/produto/modulos/atendimento-ia.md:190`, `RN-ATI-007`, infeliz).

Sem os dois, duas perguntas não têm resposta: **quanto tempo o cliente-final espera depois de
escalado**, e **quantas escaladas morrem sem atendimento**. A segunda é a pior, porque ela é invisível
por construção — escalada que ninguém assume não produz reclamação dentro do sistema, produz um
cliente-final que foi embora.

Isso não é métrica solta: é exatamente o dado que responde a **pendência 4 da própria spec de `ATI`**
(`:391` — o modo cliente-final vale a pena antes do modo operador?), hoje decidível só por opinião.

## Escopo

- **Fato de assunção da escalada**: um humano assumiu aquela conversa, com o papel e o instante.
- **Desfecho da escalada não assumida**: a escalada que termina sem ninguém assumir tem fim declarado,
  e a razão do fim (a conversa morreu com o destino, o cliente-final abandonou, a janela fechou).
- **Cláusula no infeliz de `RN-ATI-007`** dizendo que o desfecho produz fato — hoje ele descreve o que
  o produto faz e não diz o que sobra.
- **As duas listas de captura** na spec de `ATI` (`modulos/atendimento-ia.md` §7), que hoje nomeiam
  esta ausência **como acidental**, citando `2.6`.

## Fora de escopo

- **Campo de tempo de espera.** É marco, não duração (`RN-NUC-045`): escalada e assunção são dois
  instantes, e a espera se deriva. Campo próprio seria o mesmo dado guardado duas vezes, e o segundo
  envelhece errado.
- **Rotear, priorizar ou avisar quem deve assumir.** O item registra o que aconteceu; quem assume e em
  que ordem é comportamento, não tem regra hoje, e criá-lo aqui seria inventar operação para poder
  medi-la.
- **Conteúdo da conversa.** Continua fora, e `RN-ATI-014` já decide o que acontece com ela.
- **`LACUNA-ATI-3` e `LACUNA-ATI-4`, e `D-03`.** Nenhuma delas trava este item, e nenhuma é tocada por
  ele: assumir uma conversa é ato de operador do cliente, com papel que o núcleo já tem.

## Critério de aceite

1. Automação escala a conversa e um operador assume 4 minutos depois. Existem **dois** fatos, com os
   dois instantes, e a espera é derivável sem campo de duração.
2. Automação escala e **ninguém assume**; a conversa morre com o destino. Existe fato de escalada e fato
   de desfecho não assumido, com a razão. A ausência do segundo fato nunca é lida como "foi atendida".
3. Contar, sobre uma janela, escaladas × assumidas × mortas devolve os três números por
   estabelecimento. É a resposta que a pendência 4 da spec espera, e hoje ela não existe.
4. Com `ATI` **desligado**, nada disso existe e nada quebra — não há escalada sem automação, e nenhuma
   leitura apresenta ausência de módulo como zero (`RN-REL-005`).
5. Falha ao registrar qualquer um dos dois não interrompe a conversa nem a transferência para o humano.

## Registra / Não registra

**Registra:**

- **Assunção da escalada**, com o papel de quem assumiu e o instante.
- **Desfecho da escalada não assumida**, com a razão enumerada do fim.

**Não registra, e por quê:**

- **Conteúdo da conversa, em qualquer dos dois fatos.** `RN-ATI-014` já declara que a conversa morre com
  o destino e não é recuperada por alvo nem por dispositivo, e a perda foi escolhida como preferível a
  entregar histórico a um desconhecido. Este item não a reabre: marco, papel e instante bastam para as
  três contagens do aceite 3.
- **Identificação do cliente-final que esperou.** A pergunta é sobre a operação do estabelecimento —
  quanto se espera, quantas morrem —, não sobre a pessoa. Vale o mesmo raciocínio de `F-006`.
- **Duração da espera como campo.** `RN-NUC-045`, e o fora de escopo acima.
- **Quem *deveria* ter assumido e não assumiu.** Não existe atribuição de escalada no produto; registrar
  omissão de alguém a quem nada foi atribuído é medir conduta de trabalhador sem regra atrás, e isso é
  decisão do humano (`catalogo-de-capacidades.md` §8, último item).

## Depende de

**Nada em aberto — o item é executável hoje.** `RN-ATI-007` e `RN-ATI-012` existem; `RN-ATI-014` já
decide o limite do conteúdo; a razão do fim é enumeração nova e nasce com a regra, na mesma passada.

**Ordem com `F-006`:** os dois compõem a mesma leitura — onde o cliente-final desiste no canal externo —
e são itens separados porque atravessam contratos de módulo diferentes (`PCF` × `ATI`), com travas
diferentes. Pegar um não obriga a pegar o outro; ler a conversão do canal sem os dois dá resposta
incompleta, e quem ler precisa saber disso.

## Gate obrigatório

**`produto`** — fronteira: escalada e assunção são de `ATI`; o papel de quem assume é do núcleo e não
se duplica aqui.

Nenhum gate de `seguranca` ou `performance` nesta passada: é spec, e os dois fatos não carregam nada que
a auditoria de `ATI` já agendada não cubra.

## Referências

`docs/produto/captura-varredura-invariante-10-2026-09-11.md` §2.6 ·
`docs/produto/modulos/atendimento-ia.md:190` (`RN-ATI-007`, infeliz) · `:391` (pendência 4) ·
`RN-ATI-012` · `RN-ATI-014` · §7 (as duas listas) · `RN-NUC-045` · `RN-REL-005` ·
`docs/produto/catalogo-de-capacidades.md` §8 · `F-006`

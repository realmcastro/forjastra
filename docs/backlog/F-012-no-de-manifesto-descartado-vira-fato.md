# F-012 — Nó de manifesto descartado pelo terminal passa a produzir fato, e toda composição degradada também

**Tipo:** Comportamento fechado · **Estado:** a fazer · **Dono:** `produto` · **Território:**
`docs/produto/**` · **Cobre o achado** `2.14` da terceira passada da varredura do invariante 10 e,
desde 2026-09-23, o `2.15` de `docs/produto/captura-varredura-sem-rn-2026-09-23.md` (absorção de
`F-022`, seção "Alterações — 2026-09-23")

## Objetivo

`PN-12` promete que terminal em versão anterior **degrada em vez de quebrar**, e a prova dele é literal:
*"servir a um terminal desatualizado uma composição de tela com bloco novo — a tela abre, o bloco
desconhecido é ignorado, a venda fecha"* (`docs/produto/postura-nova-geracao.md:228`, e o mesmo desfecho
em `CLAUDE.md` §7.5 e `.claude/rules/ui.md` §1).

O descarte é silencioso por desenho, e é isso que o torna bom. **Degradação silenciosa é
indistinguível de funcionamento** — e hoje não existe nada que diga que ela aconteceu: nem qual id foi
descartado, nem por qual terminal, nem em que versão, nem quantas vezes.

A consequência prática já está escrita em `ui.md`: *"o sintoma chega como 'o caixa 3 não tem o botão'"*.
A mesma regra exige que estreia de id em caminho crítico seja **decisão registrada** — registrada contra
o quê, não existe. Depois de estrear um bloco, "chegou ao parque?" é pergunta sem resposta, e sem
backfill: o terminal descarta, segue vendendo, e o instante passa.

**Este achado não é do núcleo nem de módulo.** Composição de tela por manifesto é **plataforma**
(`fronteira-do-nucleo.md:59`), fora do território de `produto` por decisão (`roadmap-de-modulos.md:154`)
— e é exatamente por isso que ele nunca apareceria numa varredura que só lesse arquivo com `RN`.

## Escopo

- **Fato de nó descartado**, com o id desconhecido, o terminal, a versão do cliente e o instante.
- **A casa dele**, e há precedente: fato de plataforma já mora na família do provedor —
  `fatos-de-operacao-provedor.md` §3 carrega `migration_applied` e `tenant_provisioned`, que são da
  mesma espécie. A decisão que este fato informa é **nossa** (a estreia chegou?), não do comerciante.
- **O grão**, que é a decisão central do card: fato por ocorrência, ou contagem por terminal × versão ×
  id numa janela. Ocorrência responde melhor e custa mais, e o caminho crítico do caixa não paga custo
  de captura (`.claude/rules/dados.md` §3.1).
- **A regra dona**, escrita nesta passada, citando `PN-12` como a promessa que ela torna verificável.
- **(de `F-022`) As outras cinco causas de degradação**, cada uma distinguível das outras e do id
  desconhecido. O terminal degrada por seis caminhos, todos já decididos em regra, e hoje só este item
  cobria um:

  ```
  manifesto chega
  → resposta inaproveitável?          sim → não é cacheada, cai no cache ou no piso   (tolerancia-de-versao.md:67-69)
  → nó com forma inválida?            sim → descartado, irmãos sobrevivem              (:24-26, ui.md:17-18)
  → estado desconhecido no nó?        sim → descartado                                (estados-e-interacao.md:58-60)
  → id desconhecido?                  sim → descartado; slot fixo mostra fallback      (o escopo original deste item)
  → bloco fora da faixa de densidade? sim → descartado; na zona crítica, piso do papel (grade-e-espacos.md:271-277)
  → tela sem nó válido?               sim → piso embutido                             (tolerancia-de-versao.md:26)
  ```
- **(de `F-022`) O degrau da escada** que o terminal está servindo (rede, cache local, piso embutido),
  com entrada e saída de cada degrau.
- **(de `F-022`) A criticidade do slot** no fato de descarte, inclusive no de id desconhecido. Quando o
  id desconhecido cai na zona de ação crítica, **a ação não acontece naquele terminal**
  (`.claude/rules/ui.md:113-116`, `tolerancia-de-versao.md:57-61`), e sem a criticidade "o caixa 3 não
  tem o botão de cobrança" e "o caixa 3 não tem um enfeite" são o mesmo fato. A criticidade já chega do
  servidor (`vocabulario-e-eixos.md` §2.1, tabela "quem sabe o quê").

## Fora de escopo

- **Mudar o desfecho do descarte.** O nó continua sendo descartado, os irmãos continuam sobrevivendo, a
  tela continua abrindo e a venda continua fechando. O item acrescenta rastro, nunca comportamento.
- **Fazer o servidor deixar de mandar o id.** O servidor nunca assume que o cliente é da última versão
  (`CLAUDE.md` §7.4 e §7.5); isso é o desenho, não o defeito.
- **Alertar, avisar ou bloquear estreia.** O item entrega o fato. Quem lê, quando, e o que faz com ele é
  trabalho seguinte e não tem item.
- **Piso e fallback de bloco.** `.claude/rules/ui.md` §1 já os decide, inclusive o caso sem piso em zona
  de ação crítica. Nada aqui os toca.
- **Onde o fato repousa e por quanto tempo** — `D-06`, `LACUNA-NUC-040`, `arquiteto-dados`.
- **(de `F-022`) Transbordo** (`grade-e-espacos.md:282-285`): remove slot que o contrato já declara
  descartável, decidido antes; não é o terminal decidindo diante do que não entende.
- **(de `F-022`) Painel ou política de estreia** (`V-04`, `vocabulario-e-eixos.md:391`).

## Critério de aceite

1. Servidor manda manifesto com um id que o terminal não conhece. A tela abre, o nó é descartado, os
   irmãos aparecem, a venda fecha — **e** existe fato do descarte, com o id, o terminal e a versão.
2. Ler, sobre uma janela, os descartes por id devolve quantos terminais ainda não conhecem cada id
   estreado. É a resposta de "a estreia chegou ao parque?", e hoje ela não existe.
3. Terminal atualizado para a versão que conhece o id para de produzir o fato para aquele id. A série
   que some é a prova de que a estreia completou.
4. Manifesto com **dois** ids desconhecidos produz diagnóstico para os dois, distinguíveis. Contagem
   agregada que não diz qual id não responde nada.
5. Falha ao registrar o descarte não derruba a tela nem a venda, e não faz o nó voltar a ser renderizado
   (`CLAUDE.md` §7.10, terceiro limite).
6. Nada disso acontece no caminho crítico de forma bloqueante: registrar o descarte não pode atrasar o
   render nem competir com o caixa.

Os seis seguintes vieram de `F-022` (aceites 1 a 6 de lá, na mesma ordem):

7. Manifesto com um nó de forma inválida, um com estado desconhecido e um bloco conhecido fora da faixa
   em `zone.flow`: a tela abre com os irmãos, e existem três fatos, cada um com a causa própria.
8. Bloco conhecido fora da faixa na zona de ação crítica: a ação aparece no piso do papel, e existe fato
   dizendo que o piso foi usado e para qual bloco.
9. Id desconhecido na zona de ação crítica: o slot mostra `block.fallback`, e o fato diz que o slot era
   de ação crítica. Ler, numa janela, os descartes em zona crítica devolve quais terminais estão sem qual
   ação.
10. Resposta de manifesto inaproveitável: o terminal segue no cache, e existe fato de que a resposta
    chegou e foi recusada.
11. Terminal que opera duas horas no piso embutido e volta à rede deixa entrada e saída do degrau, com os
    dois instantes. Terminal que nunca saiu da rede não produz fato de degrau.
12. Falha ao registrar qualquer um desses não muda o desfecho da tela nem da venda (`CLAUDE.md` §7.10).

## Registra / Não registra

**Registra:**

- **O id descartado**, que é o único campo sem o qual o fato não responde nada.
- **O terminal e a versão do cliente instalada nele.** É o par que transforma o fato em "quantos
  terminais faltam", e versão é o que separa parque atrasado de defeito de composição.
- **O instante.**
- **(de `F-022`) A causa da degradação**, entre as seis do diagrama; **o papel afetado**, quando não há id
  (piso do papel); **a criticidade do slot**; e **entrada e saída de degrau da escada**, com os dois
  instantes.

**Não registra, e por quê:**

- **O manifesto, ou qualquer parte dele além do id.** O manifesto carrega ids de vocabulário fechado
  (`CLAUDE.md` §7.4) e nada mais é necessário para a decisão; copiar o nó seria guardar composição de
  tela de cliente num acervo nosso, com outro leitor — o defeito que `RN-PRV-011` nomeia.
- **O operador que estava no terminal.** A pergunta é sobre parque instalado, não sobre pessoa. Terminal
  e versão respondem inteiro, e `fatos-de-operacao-provedor.md` §4 já recusa dado pessoal de cliente nos
  fatos nossos.
- **Nada que identifique o cliente (tenant) numa leitura que some clientes.** `RN-PRV-017` (d) limita o
  agregado sobre todos os clientes à unidade nossa, e o card não a afrouxa — se a leitura que interessa
  for "quantos terminais no total", ela nasce dentro daquele limite.
- **Duração entre receber e descartar.** Marco, não duração (`RN-NUC-045`).
- **(de `F-022`) A resposta inaproveitável em si.** Guardar composição de tela recusada seria acervo nosso
  de dado do cliente; a causa da recusa basta para a decisão.

## Depende de

**Executável hoje como spec, e há duas perguntas que o card responde, não herda:**

1. **O grão** — ocorrência ou contagem. Decide se o fato é série ou binário, e o precedente do binário
   está escrito: `RN-PRV-014` e a cláusula da forma (`PRV-16`) obrigam cada leitura derivada a declarar
   a forma admissível **e** a recusada, com "módulo contratado e nunca usado" como binário, nunca
   contagem.
2. **`RN-PRV-017` (d)** — o que pode ser agregado somando clientes. O card declara dentro de qual forma
   a leitura nasce; ele não altera a regra.

**O que não trava:** `D-02` fechou em 2026-09-11 (arranjo `D`), então quem descarta o nó é conhecido —
a interface em navegador, com o catálogo de componentes embarcado. A implementação é de `ui` e de
`backend`, e é outra passada; a regra é desta.

**O que o código faz hoje, conferido pelo thread em 2026-09-23** (a pergunta que `F-022` deixava a `ui`):
`packages/sdui` não registra o descarte como fato. `screen.ts` devolve `discards` no resultado a quem
chama (`packages/sdui/src/manifest/screen.ts:56`, `:87`), e nada persiste nem emite. Então a regra parte
desse retorno, que já separa o que foi descartado, e `docs/design/tolerancia-de-versao.md:34`
("registrado internamente") descreve **devolvido**, não registrado. Corrigir essa frase é de `ui`, fora
deste item. Fonte: `tarefas/T-0017-varrer-escopo-sem-rn.md`, seção "thread — 2026-09-23 (conferência por
conjunto e respostas)".

## Gate obrigatório

**`produto`** — fronteira, e é a que este item mais arrisca: o fato é de **provedor**, nunca de venda,
nunca de módulo. `fronteira-do-nucleo.md` §1 é explícito em que provedor não desce e não sobe, e o nome
errado aqui viaja para nome de coluna na Fase 1 (`RN-PRV-002`).

**`performance`** — e este é o único gate que não pode ser adiado: captura no caminho de render disputa
com o orçamento de abrir tela de venda (≤ 2 s frio) e com o de adicionar item (≤ 150 ms percebido).
Se registrar o descarte custar no render, o desenho está errado, não a captura.

## Alterações — 2026-09-23

- **Absorção de `F-022`.** Entraram no `Escopo` as cinco causas além do id desconhecido, o degrau da
  escada e a criticidade do slot; no `Fora de escopo`, transbordo e política de estreia; no `Critério
  de aceite`, os casos 7 a 12; nas duas listas, a causa, o papel, a criticidade, o degrau e a ausência
  da resposta inaproveitável; em `Depende de`, o que o código faz hoje. O título cresceu para dizer
  isso. **Por quê:** a regra dona, o fato, o grão e o gate eram os mesmos, e `F-022` esperava o grão
  deste item (`F-022-...md:80`). **Contra o quê:** o escopo original, que cobria só o id desconhecido e
  continua inteiro, nos aceites 1 a 6. **Prova:** `docs/produto/backlog-recortes.md`, entrada `F-022`,
  e a autorização em `tarefas/T-0017-varrer-escopo-sem-rn.md`, seção "thread — 2026-09-23 (conferência
  por conjunto e respostas)".
- **A decisão de grão continua sendo a deste item**, e agora vale para a série inteira: ocorrência ou
  contagem, uma vez, para as seis causas.

## Referências

`docs/produto/captura-varredura-terceira-passada-2026-09-12.md` §2.14 ·
`docs/produto/postura-nova-geracao.md:228` (`PN-12`) · `CLAUDE.md` §7.4 · §7.5 · §7.10 ·
`.claude/rules/ui.md` §1 e "Bloco, variante e eixo" · `docs/produto/fronteira-do-nucleo.md:59` · §1 ·
`docs/produto/roadmap-de-modulos.md:154` · `docs/produto/fatos-de-operacao-provedor.md` §3 · §4 ·
`RN-PRV-002` · `RN-PRV-011` · `RN-PRV-014` · `RN-PRV-017` · `RN-NUC-045` ·
`.claude/rules/dados.md` §3.1 · `.claude/rules/performance.md` §3

**Da absorção de `F-022`:** `docs/backlog/F-022-composicao-degradada-alem-do-id-desconhecido-vira-fato.md` ·
`docs/produto/captura-varredura-sem-rn-2026-09-23.md` §2.15 · `docs/produto/backlog-recortes.md` ·
`docs/design/tolerancia-de-versao.md:24-26`, `:34`, `:50-61`, `:67-69` · `docs/design/estados-e-interacao.md:58-60` ·
`docs/design/grade-e-espacos.md:271-277`, `:282-285` · `docs/design/vocabulario-e-eixos.md` §2.1, `:391` ·
`.claude/rules/ui.md:17-21`, `:113-116` · `packages/sdui/src/manifest/screen.ts:56`, `:87`

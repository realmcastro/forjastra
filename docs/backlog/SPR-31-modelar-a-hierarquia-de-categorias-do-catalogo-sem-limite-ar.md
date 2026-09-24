# SPR-31 — Modelar a hierarquia de categorias do catálogo, sem limite artificial de profundidade

**Tipo:** História · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-09-16
**Agrupador:** SPR-34
**Rótulos:** —

---

## Edição de 2026-09-23 — o que mudou, por quê, contra o quê

- **O bloqueio saiu.** `G-03` fechou em `RN-NUC-068` (`docs/produto/nucleo-publicacao-e-texto.md` §3,
  T-0014 passo A.2b, decisão delegada pelo humano em 2026-09-23). O rótulo `bloqueada` foi retirado.
- **"Categoria" virou "grupo de catálogo"** (`catalog_group`). O glossário proíbe "categoria" desde
  2026-09-23 (`glossario.md` §5), porque a palavra juntava o agrupamento do operador e o que o
  cliente-final vê num canal, que é de `PUB`. O título ficou, porque o índice do backlog o repete.
- **O aceite 2 caiu.** Ele prendia o item a uma única categoria folha. `RN-NUC-068` põe o item em nenhum,
  um ou vários grupos, e vários degeneram em um sem custo.
- **O aceite 3 caiu.** Ele definia quando mostrar algo como folha, o que é apresentação, de `ui`.
- **O aceite 4 caiu.** "Exclusão lógica" contradiz `D-04` (nenhuma exclusão lógica no núcleo,
  `.claude/rules/dados.md` §3). Tirar grupo passa a ser publicar versão do catálogo sem ele.
- **Aceites novos 1 a 5**, tirados do aceite de `RN-NUC-068`. Entrou também a seção `Registra / Não
  registra`, que o item não tinha.

## Objetivo

Modelar o grupo de catálogo para que o operador ache item sem código, navegando por grupos, sem que o
grupo decida nada sobre venda ou preço. Padaria com duzentos itens sem código de barras é o caso que
motiva; posto com dez itens usa zero grupos e não percebe nada. A busca por texto é outra pergunta
(`G-08`, aberta), e este item não depende dela.

## Escopo

- Grupo de catálogo, que pode conter outros grupos, sem profundidade fixada pelo produto.
- Pertença de item a grupo: nenhum, um ou vários grupos por item.
- Ordem dos membros de cada grupo, declarada na publicação.
- O agrupamento é conteúdo da versão do catálogo publicado (`RN-NUC-013`): nasce, muda e sai com ela.

## Fora de escopo

- Seção de canal (`channel_section`), o agrupamento que o cliente-final vê: é de `PUB`, fora do MVP 1.
- Preço, desconto ou promoção por grupo: grupo nunca muda valor (`RN-NUC-068`); promoção é `PRM`.
- Consulta de navegação e o desempenho dela: passam pelo gate de `performance` depois do modelo.
- Como a tela desenha grupo vazio, folha ou caminho: é de `ui`, na Fase 3.

## Critério de aceite

1. Catálogo sem nenhum grupo: o modelo aceita, e nada no lançamento de item exige grupo.
2. "Pães" contém "Doces"; o item "Sonho" está em "Doces" e em "Mais pedidos": os dois grupos o alcançam,
   com a mesma identidade de item, e nenhum dado do item é duplicado por pertencer a dois grupos.
3. Publicação em que "Doces" contém "Pães", que contém "Doces", é recusada (`RN-NUC-068`, infeliz a). Se
   o modelo impede o ciclo ou se a publicação o confere é escolha de quem modela, junto com `backend`; o
   que o aceite exige é que nenhuma versão com ciclo chegue a terminal.
4. Mover "Sonho" de grupo numa versão nova não altera venda anterior, e a leitura por grupo de uma venda
   passada resolve o grupo pela versão de catálogo que aquela linha congelou (`RN-NUC-002`), nunca pela de
   hoje.
5. Nenhuma coluna de exclusão lógica: tirar um grupo é publicar a versão seguinte sem ele.

## Registra / Não registra

**Registra:** cada versão do agrupamento, com autor e instante, como toda publicação (`RN-NUC-014`).

**Não registra:**
- O grupo na linha de venda: deriva da versão de catálogo que a linha já congela.
- O caminho que o operador percorreu até o item: é evento de interface, e se ele vira fato é pergunta da
  família de `docs/produto/fatos-de-operacao.md`, não deste item.

## Depende de

- `SPR-39` (em execução em T-0009; `D-04` já fechou) e `SPR-40` (fechada em T-0018).
- **O item de catálogo e a versão do catálogo publicado, de `SPR-32`.** O grupo aponta para item e vive
  dentro da versão; modelar o grupo antes de o item existir é modelar a ponta de uma relação sem a outra.
  Os dois podem ser feitos na mesma passada de `arquiteto-dados`, e a ordem entre eles é essa.

## Gate obrigatório

`seguranca` (isolamento de tenant) e `performance` (navegação de catálogo é caminho quente do caixa).

## Referências

`docs/produto/nucleo-publicacao-e-texto.md` §3 (`RN-NUC-068`) · `docs/produto/glossario.md` §1.2 e §5 ·
`docs/produto/fronteira-do-nucleo.md` §2.2 · `docs/produto/backlog-lacunas-g01-g09.md` §3 ·
`.claude/rules/dados.md` §3 · `.claude/rules/performance.md` §2

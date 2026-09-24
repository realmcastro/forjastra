---
name: gotcha-board-spr-e-nomeado-pela-vertical
description: o board no Jira se chama "Sistema de Pedido de Restaurantes" com chave SPR e o backlog anterior fala mesa/comanda/garçom — é o erro de framing do invariante §7.3 já materializado fora do repo, e ele volta para dentro pelo título da issue
type: gotcha
escopo: plataforma
camada: processo
data: 2026-08-26
relaciona: [[reference-jira-projeto-spr]], [[decision-backlog-e-o-registro-publico-da-tarefa]]
---

**Sintoma:** você abre uma issue nova e o título sai em vocabulário de restaurante — "comanda",
"mesa", "garçom" — porque é o vocabulário de todas as 33 issues vizinhas e do próprio nome do
projeto (`SPR` = "Sistema de Pedido de Restaurantes").

**Por quê:** o invariante do `CLAUDE.md` §7.3 (o núcleo não conhece o ramo) vale para código, tabela,
módulo e componente — mas o Jira é **fora** do repo e não foi coberto. O framing entra pela porta que
ninguém guardou: a issue é escrita em vocabulário de vertical, o agent lê a issue como pedido, e o
termo de ramo chega ao nome de tabela sem que ninguém tenha decidido isso. É exatamente a rota que
`CLAUDE.md` §1 chama de "erro de framing mais caro possível", só que começando de fora.

**Como aplicar:**
- Issue nova da Forja: título e corpo no vocabulário do **núcleo** (venda, item, pedido, pagamento,
  operador, turno, catálogo). Termo de ramo só quando a issue **é** de módulo de vertical, e aí ele
  aparece nomeando o módulo, não a entidade do núcleo.
- `SPR-1`…`SPR-33` são backlog **anterior** a este processo. Não são fichas órfãs e não se reescrevem
  sem o humano — mas também **não** são fonte de regra de negócio: a fonte é `docs/produto/**`.
- Renomear projeto e chave é decisão do humano (a chave aparece em toda ficha via campo `jira:`, e
  trocá-la depois reescreve histórico em dois lugares). Barato agora, caro depois.

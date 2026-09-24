# SPR-1 — Recortar o escopo do ponto de venda presencial: o que é núcleo e o que é módulo

**Tipo:** Spike · **Estado ao migrar:** Em andamento · **Prazo que constava:** 2026-09-30

---

## Objetivo

Registrar, nesta issue, que o recorte núcleo × módulo do ponto de venda presencial já está decidido e onde. Esta issue nasceu como Spike de levantamento amplo, escrito antes de existir spec; ela fecha confirmando o que já está registrado — não redescobrindo.

## Escopo

* `docs/produto/fronteira-do-nucleo.md` (teste dos três negócios: posto, padaria, loja) delimita item, pedido, pagamento e operador como núcleo.
* `docs/produto/catalogo-de-modulos.md` cobre os 31 módulos, entre eles `MSA` (mesa-comanda) e `COZ` (cozinha), cada um com escopo, ativação, o que expõe/exige, e comportamento com o módulo desligado.
* O único resíduo real: turno (abertura e fechamento) segue sem `RN` numerada — `G-02`, vence 2026-10-07 (`docs/produto/nucleo-venda.md:370`).

## Fora de escopo

Pedido online e delivery — módulos próprios, com Spike separado (`SPR-2`, `SPR-3`). Decidir `G-02` é do humano.

## Critério de aceite

Quem abre esta issue encontra a fronteira núcleo × módulo já aprovada, citada por path, e sabe exatamente o que falta decidir (`G-02`, turno) sem precisar reabrir o levantamento original.

## Depende de

`G-02` (turno) — pergunta do humano, vence 2026-10-07. Não decidida aqui.

## Referências

`docs/produto/fronteira-do-nucleo.md` · `docs/produto/catalogo-de-modulos.md` · `docs/produto/nucleo-venda.md:370`

## Resultados esperados

Ao final do Spike, deverão estar criados e organizados no Jira:Épicos, representando os principais domínios ou capacidades identificados.Histórias de Usuário, vinculadas aos respectivos Épicos e descrevendo as funcionalidades necessárias.Critérios de aceite para as Histórias quando já houver informações suficientes para defini-los.Tarefas técnicas, quando necessárias para representar atividades de infraestrutura, configuração, arquitetura ou preparação do ambiente.Dependências e impedimentos, registrados nas issues quando identificados.Itens em aberto, quando alguma definição depender de decisão posterior.

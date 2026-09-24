# SPR-2 — Módulo de Pedido pelo Cliente-Final

**Tipo:** Spike · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-11-30

---

## Objetivo

Registrar que o módulo `PCF` (pedido cliente-final) já está especificado — 18 `RN` mais o anexo de sessão — e nomear a única lacuna real: o módulo `PUB` (publicação de catálogo) que `PCF` exige ainda não tem `RN` nenhuma.

## Escopo

* `docs/produto/modulos/pedido-cliente-final.md` e `docs/produto/modulos/pedido-cliente-final-sessao.md` cobrem `PCF` com 18 `RN`.
* `PCF` roda na superfície sem custódia do cliente-final e não depende da decisão de arranjo do terminal (Epic `SPR-35`).
* `PUB` está descrito em `docs/produto/catalogo-de-modulos.md:98` (exibe, nunca calcula) mas tem **zero** `RN` e está fora do MVP 1 (`docs/produto/roadmap-de-modulos.md:184`) — escrever essa spec é trabalho de produto, futuro, não desta issue.

## Fora de escopo

Implementação do módulo. Operação de entrega — módulos `CMP`/`ENT` (`SPR-3`).

## Critério de aceite

Quem abre esta issue encontra `PCF` já especificado por path, com a contagem de `RN`, e sabe que a lacuna real é a spec de `PUB` — não a de `PCF`. Não redescobre o que já está aprovado.

## Depende de

O núcleo (`SPR-34`) precede qualquer tabela de `PCF`. A spec de `PUB` (zero `RN`, fora do MVP 1) não está escrita — pendência separada, de produto.

## Referências

`docs/produto/modulos/pedido-cliente-final.md` · `docs/produto/modulos/pedido-cliente-final-sessao.md` · `docs/produto/catalogo-de-modulos.md:98` · `docs/produto/roadmap-de-modulos.md:184`

## Resultados esperados

Ao final do Spike, deverão estar criados e organizados no Jira:Épicos, representando os principais domínios ou capacidades identificados.Histórias de Usuário, vinculadas aos respectivos Épicos.Critérios de aceite, quando houver informações suficientes para defini-los.Tarefas técnicas, quando necessárias para representar infraestrutura, arquitetura ou preparação do ambiente.Dependências, impedimentos e pontos em aberto, registrados nas issues quando identificados.

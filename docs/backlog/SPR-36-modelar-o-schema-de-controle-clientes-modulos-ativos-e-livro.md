# SPR-36 — Modelar o schema de controle: clientes, módulos ativos e livro-razão de migration

**Tipo:** História · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-10-07
**Agrupador:** SPR-34
**Rótulos:** bloqueada

> **Editado em 2026-09-23 (T-0014, `F-018`), pela régua de `.claude/rules/backlog.md` §7.** O Escopo
> dizia "Registro de cliente: identificação, slug do schema, **fuso**". O fuso saiu: `RN-NUC-057`
> (`docs/produto/nucleo-estabelecimento.md`) fecha `LACUNA-GLO-001` pondo o fuso no estabelecimento,
> dentro do ambiente do cliente, e declara que o registro do cliente em `platform` não carrega fuso que
> decida dia de fato do núcleo. `db/migrations/platform/0001__tenant_registry.sql:17-18` já tinha deixado a
> coluna de fora, pela lacuna; a ausência passa de "lacuna aberta" a "decidido que não existe".

---

## Objetivo

Estabelecer o schema de **controle** — o único que não é de cliente — com registro de clientes, módulos ativos e livro-razão de migrations.

## Escopo

* **Registro de cliente:** identificação, slug do schema. **Sem fuso e sem moeda**: os dois são do
  estabelecimento, no schema do cliente (`RN-NUC-057`, `RN-NUC-058`; modelados em `F-021`)
* **Módulos ativos por cliente:** leitura deste registro, nunca inferida de existência de tabela
* **Livro-razão de migration:** schema, versão, `checksum`, timestamp, duração, módulo quando aplicável
* **Unidade de aplicação:** `(schema, versão)` — o checksum detecta edição de migration já aplicada

## Critério de aceite

1. Nenhuma tabela de cliente vive neste schema, nem tabela deste schema vive em schema de cliente.
2. Falhar no schema 7 de 20 deixa os 6 primeiros aplicados; processo **retomável** sem duplicação de efeito.
3. Migration declara no topo: alvo = controle, não mistura clientes.
4. Roda em schema vazio, com dado representativo, e duas vezes seguidas sem estrago.

## Depende de

Nenhum (este é o primeiro schema criado; a criação de schema de cliente depende dele).

## Fora de escopo

O executor que lê este livro-razão — é SPR-38.

## Gate obrigatório

Segurança (isolamento de tenant).

## Referências

`.claude/rules/dados.md` §1 e §5 · `.claude/rules/migrations.md` §2, §3, §7, §8 ·
`docs/produto/nucleo-estabelecimento.md` (`RN-NUC-057`, `RN-NUC-058`)

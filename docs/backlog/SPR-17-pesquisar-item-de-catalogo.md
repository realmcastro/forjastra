# SPR-17 — Pesquisar item de catálogo

**Tipo:** História · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-11-27
**Agrupador:** SPR-15

---

## Objetivo

Permitir que o garçom pesquise item de catálogo por texto, encontrando o item sem precisar navegar pela hierarquia de categoria. Achar o item sem saber o código é necessidade distinta de navegar por categoria (`SPR-16`): agiliza o lançamento quando o operador sabe o nome, mas não a posição na hierarquia.

## Escopo

Núcleo — busca sobre o artefato publicado de catálogo (`RN-NUC-013`). Offline, a única fonte possível é o artefato publicado retido pelo terminal (`docs/produto/nucleo-publicacao-e-texto.md:42`); o terminal aplica, nunca cria, altera ou versiona artefato (`RN-NUC-014`, `:105`).

## Critério de aceite

1. Buscar por texto parcial do nome do item, sem saber a categoria → o item aparece nos resultados.
2. Terminal offline, sem link com o servidor → a busca continua funcionando contra o artefato publicado retido, não falha por ausência de rede.

## Depende de

A resposta do humano a `G-08` (`docs/produto/backlog-lacunas-g01-g09.md` §10): classificação de continuidade da busca textual — sem classe declarada, `RN-OFF-008` trata como classe 2 (recusa) por default. Comentário com a lacuna já publicado nesta issue (2026-08-26); `G-08` não tem rótulo `bloqueada` — a lacuna está só em comentário, aqui e em `docs/produto/backlog-lacunas-g01-g09.md`.

## Fora de escopo

Forma da apresentação de resultado de busca — território de `ui`.

## Referências

`docs/produto/backlog-lacunas-g01-g09.md` §10 · `docs/produto/operacao-offline-e-sincronizacao.md:95` · `docs/produto/nucleo-publicacao-e-texto.md:42` · `:105` · `SPR-16`

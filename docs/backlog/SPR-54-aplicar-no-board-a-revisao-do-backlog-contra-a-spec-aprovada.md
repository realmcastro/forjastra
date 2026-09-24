# SPR-54 — Aplicar no board a revisão do backlog contra a spec aprovada

**Tipo:** História · **Estado ao migrar:** Em andamento · **Prazo que constava:** —
**Rótulos:** bloqueada

---

## Objetivo

Levar ao board o resultado de `SPR-53`: conferir as 53 issues contra o veredito da revisão, aplicar as edições que não dependem de decisão do humano, e deixar visível — como bloqueio, não como silêncio — o que depende. No fim, o board reflete a spec aprovada, e as perguntas em aberto estão nomeadas na issue que cada uma trava.

## Escopo

* Conferir o corpo real das 53 issues contra o veredito de `docs/produto/revisao-backlog-spr-2026-08-26.md` e emitir o delta. A revisão foi escrita sem acesso ao Jira, por declaração do próprio autor.
* Aplicar o Bloco A de `docs/produto/backlog-edicoes-a-aplicar.md` **verbatim**, preservando a descrição anterior em comentário **antes** de cada substituição.
* Postar o Bloco B como comentário de bloqueio, com o rótulo `bloqueada`.
* Comentar e vincular `SPR-53`.
* Entregar a pauta consolidada de `G-01`..`G-09` para o humano.

## Fora de escopo

* **Decidir qualquer** `G-01`..`G-09`. As nove são do humano; quatro são fronteira núcleo × módulo, que `docs/produto/fronteira-do-nucleo.md:169` manda vir como pergunta, nunca por eliminação.
* **A parte substantiva do Bloco B** — título, descrição e escopo que dependem de uma `G`. Ela espera a resposta.
* **Excluir card.** Nenhum dos 53 é candidato, e exclusão exige as quatro partes de `.claude/rules/00-nucleo.md` §12 mais autorização do humano.
* Prioridade, prazo, dono e status — são do humano e do registro de processo, não desta issue.
* Criar `RN`, abrir `LACUNA-<COD>-<nnn>` ou reservar código de módulo em `docs/produto/glossario.md` §4.3. A `G` vira `RN` ou `LACUNA` no arquivo dono, depois da decisão.
* Editar o `## Fora de escopo` de `SPR-53`.

## Critério de aceite

* Toda entrada do Bloco A ou está aplicada no board, ou está nomeada como **já aplicada** com a data e o autor do comentário que já a carrega. Nenhuma entrada fica sem um dos dois desfechos.
* Nenhuma substituição de descrição apagou critério de aceite existente e ainda válido: para cada uma das seis, a descrição anterior está em comentário, e o critério preservado aparece na descrição nova ou está declarado como movido, com a issue de destino.
* Todo card do Bloco B está com o rótulo `bloqueada`, com um comentário que nomeia qual `G` o trava e o que desbloqueia.
* Onde a conferência mudou o veredito da revisão, a mudança está registrada em `docs/produto/` **antes** de qualquer edição no board — o board não recebe veredito que o documento ainda não corrigiu.

## Depende de

`SPR-53` — a revisão que produz o veredito. Esta issue aplica; ela decide.

## Referências

`docs/produto/revisao-backlog-spr-2026-08-26.md` · `docs/produto/backlog-edicoes-a-aplicar.md`

# SPR-53 — Revalidar o backlog inteiro contra a spec aprovada

**Tipo:** Spike · **Estado ao migrar:** Concluído · **Prazo que constava:** 2026-08-27

---

## Pergunta a fechar

O backlog do board tem lixo? Card desnecessário, duplicado, ou que contradiz regra já aprovada?

## Contexto

O board tem 52 issues: 33 de backlog anterior a este processo (criadas em 2026-08-19 e 2026-08-23) e 19 criadas em 2026-08-26. Dez das antigas já receberam comentário de arquitetura; **nenhuma foi excluída**, por decisão do humano.

A revisão é do agent `produto`, dono da regra de negócio e da fronteira núcleo/módulo/vertical/cliente. Ele **não** tem acesso ao Jira — o conteúdo do board vai no brief, e o resultado volta como recomendação.

## Escopo

* **Veredito por card**, para todos: manter, ajustar, fundir ou excluir.
* **Regra de negócio que o backlog pressupõe e a spec não tem.** É a parte mais valiosa: card que depende de regra inexistente não é implementável, e hoje ninguém sabe disso.
* **Card que contradiz regra já aprovada**, com o `path:linha` da regra.
* **Lacunas de fronteira** ainda abertas.

## Regra da recusa

Recomendação de exclusão só vale com as quatro partes: a necessidade legítima que o card atende, o mecanismo recusado e por que é ruim, o mecanismo que fica no lugar, e por que o novo é melhor. Sem as quatro, é preferência, não recusa fundamentada — e não entra.

Card mal escrito **não** é card desnecessário. A pergunta é se a necessidade existe, não se o texto está bom.

## Fora de escopo

* Executar mudança no Jira. O agent recomenda; o humano decide; o thread principal executa.
* Prioridade e prazo — já definidos.
* Inventar regra de negócio ausente. Regra que não está em `docs/produto/**` nem na memória **não existe**, e é reportada como lacuna.

## Referências

`docs/produto/**` · `.claude/rules/produto.md` · `.claude/rules/00-nucleo.md` §12 · `memory/plataforma/state-board-spr-2026-08-26.md`

## Resultados esperados

Um veredito por card das 52 issues do board, cada um com uma das quatro marcas: MANTER, AJUSTAR (com o ajuste), FUNDIR (com qual issue e por que) ou EXCLUIR (com a justificativa de quatro partes: a necessidade preservada, o mecanismo recusado e por que e ruim, o mecanismo novo, e por que o novo e melhor).Mais tres listas: regra de negocio que o backlog pressupoe e a spec nao tem escrita; card que contradiz regra aprovada, com path e linha; e lacuna de fronteira nucleo/modulo/vertical/cliente ainda em aberto.Relatorio em docs/produto/. Nenhuma exclusao e executada pelo agent: ele recomenda, o humano decide, e o thread principal executa no Jira.

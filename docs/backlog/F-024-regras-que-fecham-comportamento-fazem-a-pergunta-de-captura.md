# F-024 — As regras de agent que fecham comportamento passam a fazer a pergunta de captura

**Tipo:** Regra · **Estado:** a fazer · **Dono:** humano ou thread principal · **Território:**
`.claude/rules/**` · **Cobre o achado** `2.17` de `docs/produto/captura-varredura-sem-rn-2026-09-23.md`
· **Agrupador:** F-001 · **Rótulo:** captura

> Aplicação pode depender de permissão de escrita em `.claude/**`, negada em 2026-09-23.

## Objetivo

Fazer o invariante 10 chegar às regras que decidem descarte, fallback, degradação e recusa de borda. Hoje
ele chega a duas das cinco:

| Regra | Decide | Pergunta o que se perde? |
|---|---|---|
| `.claude/rules/produto.md` | a spec | sim, "Capturar é o padrão" |
| `.claude/rules/dados.md:58` (§3.1) | a coluna | sim |
| `.claude/rules/ui.md` | descarte de nó, fallback, escada rede → cache → piso, zona crítica | **não** |
| `.claude/rules/backend.md` | recusa de borda, capacidade indisponível, reenvio, composição do manifesto | **não** |
| `.claude/rules/00-nucleo.md:122-124` (§12) | toda recusa de mecanismo, em qualquer território | **não**: as quatro partes não perguntam o que o mecanismo recusado registrava |

Busca por `registr`, `7.10`, `invariante 10`, `captura` e `fato` em `ui.md` e `backend.md` devolve cinco
linhas (`ui.md:39,107,115`, `backend.md:33,65`), nenhuma sobre captura. E o laço não fecha na entrega:
a definição de pronto (`processo.md:33-46`) não confere que o fato listado em `Registra` existe, e
`coder.md:34-36` manda testar o critério de aceite, enquanto `backlog.md` §8 põe `Registra / Não
registra` em seção separada dele.

Os achados 2.14, 2.15 e 2.18 nasceram em decisões governadas por `ui.md` e `backend.md`. Todos foram
achados por varredura, depois; nenhum foi perguntado por quem decidiu.

## Escopo

O desfecho, e só ele; a redação é de quem aplica:

- quem decide descarte, fallback, degradação ou recusa em `ui` e em `backend` declara, no relatório, o
  que aquela decisão registra e o que deliberadamente não registra;
- a recusa de mecanismo de `00-nucleo.md` §12 diz o que o mecanismo velho registrava e onde isso fica
  no novo, como `PN-17` fez sozinho;
- a definição de pronto confere que cada linha de `Registra` do item tem fato e teste, e `coder` testa
  a lista `Registra` além do aceite.

## Fora de escopo

- Reescrever `ui.md` ou `backend.md` além da cláusula.
- Aplicar a pergunta retroativamente às decisões já tomadas: isso é o que as varreduras fazem, e os
  itens `F-012`, `F-022`, `F-025` já carregam o resultado.
- `.claude/agents/**`.

## Critério de aceite

1. Reler `ui.md` e `backend.md` e apontar a frase que obriga a declarar o que uma decisão de descarte ou
   de recusa registra.
2. Uma recusa de mecanismo nova, escrita pela fórmula de `00-nucleo.md` §12, diz o que o mecanismo velho
   registrava. O caso de teste é `PN-17`: pela fórmula nova, a falta de endereço do registro interno
   (`F-023`) teria aparecido na escrita, sem varredura.
3. Um item fechado com linha em `Registra` sem fato correspondente não passa na definição de pronto.

## Registra / Não registra

**Registra:** nada na operação. O item muda regra de agent, e o que ela passa a obrigar são as duas
listas nas decisões dos outros.
**Não registra:** — (não há fluxo de operação neste item).

## Depende de

Nada de produto. Depende de quem pode escrever em `.claude/**` (nota no topo).

## Gate obrigatório

Nenhum dos cinco do `CLAUDE.md` §4. Leitura do `orquestrador`, porque `processo.md` §2 é dele.

## Referências

`docs/produto/captura-varredura-sem-rn-2026-09-23.md` §2.17 · `CLAUDE.md` §7.10 · `.claude/rules/ui.md` ·
`.claude/rules/backend.md` · `.claude/rules/00-nucleo.md:103-125` · `.claude/rules/processo.md:29-49` ·
`.claude/rules/coder.md:32-39` · `.claude/rules/backlog.md` §8 · `.claude/rules/dados.md:58-70`

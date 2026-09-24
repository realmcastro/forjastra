# F-001 — Tornar a captura de fato de operação o padrão do sistema

**Tipo:** Regra de plataforma · **Estado:** **fechada** 2026-09-12 (ficha `tarefas/T-0010-invariante-10-captura.md`)

> **Item criado retroativamente em 2026-09-11**, depois de o trabalho começar. Isso fura
> `.claude/rules/backlog.md` §2 ("nenhum trabalho começa sem item"), e a declaração fica aqui em vez
> de o furo sumir: a regra foi escrita nesta mesma sessão e o trabalho que a aplica correu antes de
> ela existir. Registrado como precedente a não repetir, não como exceção autorizada.

## Objetivo

Fixar como invariante que o que acontece na operação vira fato no instante em que acontece, invertendo
o ônus: **capturar é o padrão, não capturar é a exceção e exige justificativa registrada.** E fazer
isso alcançar as specs já escritas, em vez de valer só para o que vier depois.

## Por quê

O humano fixou como alvo do produto um MVP **rico em informação**, e a lacuna que mais contradizia
esse alvo estava parada havia semanas. A causa não era desacordo: busca em `.claude/rules/` e no
`CLAUDE.md` em 2026-09-11 não devolveu **nenhuma** menção a captura ou rastreabilidade. Sem regra, o
default de não capturar vencia por inércia, e ausência de fato não tem sintoma que acuse.

A assimetria que sustenta o invariante: guardar e nunca usar custa armazenamento; não guardar e
precisar é irrecuperável, porque fato não tem backfill.

## Escopo

- Invariante 10 no `CLAUDE.md` §7, com os três limites que não afrouxam (dado pessoal minimizado,
  segredo nunca, registro jamais bloqueia a venda).
- Aplicação em `.claude/rules/produto.md` (seção própria) e `.claude/rules/dados.md` §3.1.
- Seção `Registra / Não registra` obrigatória em card de comportamento fechado, com **duas** listas —
  em `.claude/rules/produto.md` (esqueleto e spec de módulo) e `.claude/rules/backlog.md` §8.
- Varredura de `docs/produto/**` atrás de violação já existente, separando ausência **decidida** de
  ausência **acidental**.
- Decisão de `LACUNA-NUC-038` e execução da saída escolhida.

## Fora de escopo

> **Três das quatro linhas venceram em 2026-09-12**, quando `T-0010` entregou dentro da própria tarefa
> o que este item tinha recortado para fora. O texto original fica riscado em vez de sumir: ele foi
> recorte de verdade entre 2026-09-11 e 2026-09-12, e apagá-lo esconderia que a tarefa cresceu duas
> vezes — que é a informação mais útil que este item ainda carrega. Prova:
> `tarefas/T-0010-invariante-10-captura.md`, seção `## Fechamento — 2026-09-12`, campos `ENTREGUE`,
> `VERIFICAÇÃO` e `SOBROU`. Mesma disciplina que a seção `## Fica para depois, com dono` daquela ficha
> usou, e pela mesma razão.

- ~~As duas listas nas sete specs de módulo já escritas (`MSA`, `COZ`, `PCF`, `ATI`, `PER`, `REL`,
  `FIS`) — trabalho próprio, item a recortar.~~ **Vencida em 2026-09-12:** as duas listas estão nos
  sete contratos de módulo, cada ausência acidental nomeada **como acidental** e citando o achado.
  Conferido em disco na validação do fechamento.
- ~~Achados `2.3` a `2.7` da varredura.~~ **Vencida em 2026-09-12:** os cinco viraram item, agrupados
  por fluxo — `F-005` (2.3 + 2.7), `F-006` (2.4 + 2.5), `F-008` (2.6).
- ~~Os 20+ arquivos de `docs/produto/**` não lidos na varredura, listados em ordem de risco em
  `docs/produto/captura-varredura-invariante-10-2026-09-11.md` §5.~~ **Vencida em 2026-09-12:** a
  terceira passada leu os 14 arquivos sem `RN` e a lista de não verificados deixou de existir
  (`docs/produto/captura-varredura-terceira-passada-2026-09-12.md`). Sobra um resíduo de **lente**, não
  de lista: `superficie-por-papel-momentos.md` foi coberto por um critério que não seleciona nada nele.
  O resíduo tem item — `F-016`, junto com o escopo que nunca terá `RN`.
- **Continua fora:** modelagem dos fatos em `db/**` — é da Fase 1, e depende de `D-06`.
- **Entrou para fora depois**, e não estava aqui porque ninguém sabia: o escopo normativo que mora
  **fora de `docs/produto/**`** e nunca terá `RN` (`.claude/rules/**`, `docs/design/**`,
  `docs/arquitetura/**`, `CLAUDE.md`). Nenhuma das três passadas o alcançou, por construção da âncora.
  Item próprio: `F-016`.

## Critério de aceite

Uma spec nova de comportamento que não declare o que **não** registra é recusada na revisão, e a
recusa cita `CLAUDE.md` §7.10. `LACUNA-NUC-038` deixa de constar como aberta em
`fatos-de-operacao.md` §7.

## Referências

`CLAUDE.md` §7.10 · `.claude/rules/produto.md` · `.claude/rules/dados.md` §3.1 ·
`.claude/rules/backlog.md` §8 · `docs/produto/captura-ciclo-de-vida-do-pedido-proposta.md` ·
`docs/produto/captura-varredura-invariante-10-2026-09-11.md` ·
`memory/plataforma/decision-capturar-e-o-padrao-nao-capturar-exige-justificativa.md`

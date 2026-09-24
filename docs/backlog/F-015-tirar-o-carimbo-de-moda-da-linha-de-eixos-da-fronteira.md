# F-015 — Tirar o carimbo de ramo da linha de eixos em `fronteira-do-nucleo.md`

**Tipo:** Comportamento (correção de spec) · **Estado:** entregue 2026-09-12 — sem ficha
(`processo.md` §5: uma camada, um agent, nenhum gate, verificável num olhar)

## Objetivo

Trocar a cláusula de motivo da linha de eixos de variação em `docs/produto/fronteira-do-nucleo.md:71`,
que sustentava a classificação em **um ramo só** ("loja de roupa não vive sem"), pela forma
cross-vertical que o resto do corpus já usa — e nomear `GRD` na coluna de escopo, que é onde quem
classifica um cliente novo vai procurar.

**O que mudou, exatamente.** Antes:

```
| Item composto por eixos (cor/tamanho) | módulo | Padaria e posto não precisam; loja de roupa não vive sem. |
```

Depois:

```
| Item composto por eixos (cor, tamanho, sabor) | módulo `GRD` | Padaria e posto não precisam; quem vende o mesmo item em combinação de eixos não vive sem — roupa por tamanho, polpa por sabor. |
```

**Contra o quê.** `memory/modulos/grd/decision-grd-e-cross-vertical-nao-e-de-moda.md` (2026-09-11),
que registra `GRD` como módulo cross-vertical, e o achado `A-06` de
`docs/produto/dois-varejos-auditoria-do-nucleo-2026-09-12.md`, que encontrou este path fora da lista
das três correções aplicadas em 2026-09-11. A forma nova copia a que já está em
`catalogo-de-modulos.md:253-260` e em `glossario.md:372`.

## Por quê

Carimbo de ramo em módulo cross-vertical não é etiqueta feia: é o erro de framing do `CLAUDE.md` §7.3
um nível abaixo. Quem for classificar o catálogo de uma loja de polpa de fruta — que vende o mesmo
item em combinação de **sabor** e peso de embalagem — lê "loja de roupa não vive sem", conclui que
`GRD` não é dela, e a capacidade se duplica num módulo novo com outro nome. O custo aparece quando já
existem dois módulos fazendo a mesma coisa, e aí sair custa expand/contract em N clientes.

A linha **não** foi reclassificada: escopo era módulo, continua módulo. Só o argumento mudou.

## Escopo

- `docs/produto/fronteira-do-nucleo.md:71` — nome do item e cláusula de motivo, mais `GRD` na coluna
  de escopo (a forma de `§2.7`, que já cita `módulo FIS`).

## Fora de escopo

- **Os achados `A-01` a `A-05`** da mesma auditoria. Os quatro primeiros dependem de resposta do
  humano (`Q-A` a `Q-D`, `dois-varejos-auditoria-do-nucleo-2026-09-12.md` §5) e `A-05` depende de
  pergunta já aberta. Nenhum deles é aplicável hoje.
- **A nota datada dentro do arquivo**, no formato que `glossario.md` e `catalogo-de-modulos.md`
  receberam em 2026-09-11. Deliberadamente não escrita: acrescentar linha depois da tabela de §2.2
  deslocaria toda citação que aponta para depois de `:75` — só a auditoria de 2026-09-12 faz
  **vinte e cinco** delas, números de linha distintos, entre a tabela de §3 e a seção `Referências`
  (contados em 2026-09-12). A correção coube em uma linha trocada por uma linha, sem deslocar nada, e
  a declaração datada mora no registro de memória e neste item.
- **`G-04`** (eixo único com preço próprio) continua aberta. Combinação de eixos é `GRD` em qualquer
  saída dela — foi esse critério que separou as três correções de vocabulário de 2026-09-11, e é ele
  que torna esta aplicável sem esperar o humano.
- **`:91` e `:93`**, que têm a mesma **forma** ("padaria e loja de roupa não cobram", "padaria não
  comissiona; loja de roupa depende disso") e **não** têm o mesmo defeito. Nomear qual dos três
  precisa e qual não precisa é o que `§2` exige para a classificação ser auditável. O defeito de `:71`
  era outro: o módulo já estava registrado como cross-vertical (`GRD`, 2026-09-11) e a linha dizia o
  contrário. Nenhum registro equivalente existe para encargo nem para comissão — se alguém abrir um,
  as duas linhas voltam à mesa.
- **Modelo, coluna e tabela** de variante — `arquiteto-dados`, Fase 1.

## Critério de aceite

`grep -n 'GRD' docs/produto/fronteira-do-nucleo.md` devolve a linha 71 — antes ela não continha o
código do módulo, e era por isso que quem classificava um cliente de polpa não chegava nele. A mesma
linha cita um ramo de cada lado do teste (roupa por tamanho, polpa por sabor), e nenhum dos dois
sozinho sustenta a classificação.

## Registra / Não registra

**Não se aplica**, e a ausência é declarada em vez de silenciosa: a mudança é de vocabulário numa
tabela de classificação. Nenhum fluxo passa a existir, nenhum ato de operação acontece por causa
dela, logo não há fato a registrar nem ausência de fato a justificar (`CLAUDE.md` §7.10).

## Depende de

Nada. Os dois insumos — o achado e o registro de decisão — já estavam em disco em 2026-09-12.

## Gate obrigatório

Nenhum. Não toca `db/**`, `apps/**`, autorização, dinheiro nem fronteira de módulo
(`processo.md` §5).

## Referências

`docs/produto/fronteira-do-nucleo.md:71` · `:203` ·
`docs/produto/dois-varejos-auditoria-do-nucleo-2026-09-12.md` §4 (`A-06`) · §6 ·
`docs/produto/dois-varejos-corpo-de-prova-2026-09-11.md` §4 · §10 ·
`docs/produto/catalogo-de-modulos.md:253` · `docs/produto/glossario.md:372` ·
`memory/modulos/grd/decision-grd-e-cross-vertical-nao-e-de-moda.md` · `CLAUDE.md` §7.3

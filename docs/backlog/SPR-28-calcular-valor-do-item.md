# SPR-28 — Calcular valor do item

**Tipo:** História · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-11-27
**Agrupador:** SPR-15

---

## Objetivo

Calcular o valor de um item lançado: preço do item de catálogo/variação somado aos adicionais selecionados, apurado pelo backend — o terminal exibe e coleta, nunca soma. O garçom precisa ver o impacto de variação e adicional no valor do item antes de confirmar o lançamento. Vale igual para `SPR-29` (acumulado do consumo).

## Escopo

Núcleo — preço, valor de item e composição de valor existem em qualquer ramo. O card original excluía "descontos, taxas, promoções, gorjetas, outras regras financeiras" do MVP; isso foi corrigido: **desconto e acréscimo com limite por papel são do núcleo**, têm `RN-NUC-006` e `RN-NUC-007`, e estão dentro do MVP 1 (`docs/produto/fronteira-do-nucleo.md:84`, `docs/produto/roadmap-de-modulos.md:155`) — um card não retira do MVP o que o roadmap já pôs nele. As que saem com razão, e têm casa: taxa é `ECG`, promoção é `PRM`, gorjeta é módulo. Correção já publicada em comentário nesta issue (2026-08-26).

## Critério de aceite

~~Não há critério de aceite testável antes de `SPR-40` decidir o tipo do dinheiro — ver Depende de.~~ Valor do item = preço do item/variação + soma dos adicionais selecionados, vezes a quantidade, calculado pelo backend ou, sem contato, pelo módulo de `F-030` aplicando artefato publicado (`RN-OFF-020`) — nunca pela tela.

1. Item de R$ 23,90 com um adicional de R$ 2,50, quantidade 1 → `"26.40"`, na forma canônica de `memory/plataforma/decision-dinheiro-e-quantidade.md`.
2. Roupa, 2 × R$ 89,90 → `"179.80"`, sem arredondamento nenhum.
3. Item por peso, 0,750 kg × R$ 23,90/kg = 17,925 → o valor sai pelo modo de arredondamento que o `owner` publicou para o estabelecimento: `"17.93"` com metade para cima, `"17.92"` com metade para o par, e a versão do modo fica congelada no fato (`RN-NUC-013`). Sem modo publicado, o item não compõe valor e não é lançado (`RN-NUC-013`, infeliz a), e a venda continua.
4. Preço publicado numa moeda, lançado em estabelecimento de outra → o item não entra, e a mensagem diz que falta preço naquela moeda (`RN-NUC-058`, aceite 2).
5. O terminal, com contato ou sem, nunca soma com `Number` nem arredonda por conta própria: a conta sem contato passa só pelo módulo de `F-030`.

## Depende de

1. ~~**Tipo do dinheiro** — `SPR-40` decide inteiro em menor unidade ou decimal exato, vale para banco, contrato e serialização. Este cálculo não nasce antes dela.~~ **Tipo do dinheiro — fechado em 2026-09-23** (`SPR-40`, `tarefas/T-0018-dinheiro-e-quantidade.md`): `numeric` sob domínio, conta em ponto fixo, string canônica na rede. O cálculo usa o módulo de **`F-030`**, que é pré-requisito deste item.
2. ~~**Arredondamento** — quando adicional/desconto não divide igual, para onde vai o centavo, é `G-09` (`docs/produto/backlog-lacunas-g01-g09.md` §1), decisão do humano com o contador, ainda em aberto.~~ **Arredondamento — decidido o mecanismo em 2026-09-23:** o modo é artefato publicado pelo `owner`, versionado e congelado no fato, e o produto enumera os modos sem escolher (`tarefas/T-0014-decidir-lacunas-das-fases-1-e-2.md`, seção "thread — 2026-09-23 (depois do A.2a)"; `docs/produto/pendencias-fase-1-e-2-2026-09-23.md:223-233`). O que continua com o contador é qual modo a norma exige com `FIS` ou `EMI` ligados, e isso é aviso, não trava. Repartir desconto da venda inteira entre linhas é `RN-NUC-064`, fora deste item.
3. **O texto de `LACUNA-NUC-004`** em `nucleo-venda.md` §6 ainda diz que arredondar a linha está indisponível. A reescrita na forma acima está pedida ao `produto` (mesma seção de `T-0014`). Até ela, o aceite 3 se prova com o modo passado explicitamente ao módulo, sem publicação real.

## Alterações — 2026-09-23

- **`Critério de aceite`** deixou de esperar `SPR-40` e ganhou cinco casos. Contra: "não há critério testável antes de `SPR-40`". Prova: `SPR-40` fechou (`T-0018`, Fechamento), e os números são os de `docs/arquitetura/dinheiro-e-quantidade-2026-09-23.md:214-218`.
- **Moeda** entrou no aceite 4. Prova: `RN-NUC-058` (`docs/produto/nucleo-estabelecimento.md:186`).
- **Arredondamento:** de "decisão aberta" para o mecanismo decidido, com a parte do contador como aviso. Prova: a decisão do thread em `T-0014`.

## Referências

`docs/produto/backlog-lacunas-g01-g09.md` §1 · `docs/produto/fronteira-do-nucleo.md:84` · `docs/produto/roadmap-de-modulos.md:155` · `:333` · `.claude/rules/dados.md` §3 · `.claude/rules/ui.md` §4 · `docs/produto/nucleo-estabelecimento.md:186` (`RN-NUC-058`) · `docs/produto/nucleo-publicacao-e-texto.md:27` (`RN-NUC-013`) · `memory/plataforma/decision-dinheiro-e-quantidade.md` · `tarefas/T-0018-dinheiro-e-quantidade.md` · `SPR-29` · `SPR-40` · `F-030`

# SPR-29 — Compor o acumulado do consumo em aberto — o núcleo compõe, MSA expõe

**Tipo:** História · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-11-27
**Agrupador:** SPR-15

---

## Objetivo

O acumulado de um consumo em aberto é **composto pelo núcleo** e apenas **exposto** por `MSA`. `MSA` não soma, não rateia e não distribui centavo. O acumulado exibido é **informação**, não valor devido: enquanto o consumo está aberto não existe venda, valor devido definitivo, pagamento nem obrigação documental.

## Escopo

* `RN-MSA-007` (`docs/produto/modulos/mesa-comanda.md:166`) — `MSA` entrega ao núcleo **quais lançamentos vão em qual parte** (ou a instrução "dividir igualmente em N"); quem calcula total, encargo, desconto e tributo de cada parte é o núcleo e os módulos responsáveis. O motivo escrito: rateio feito no módulo, ou pior, na tela, é divergência garantida entre o que o cliente-final vê e o que é cobrado.
* `RN-MSA-001` (`docs/produto/modulos/mesa-comanda.md:81`) — o acumulado exibido é informação, e a peça de conferência entregue ao cliente-final é declaradamente **não fiscal** e **não vincula valor**.
* `RN-NUC-013` (`docs/produto/nucleo-publicacao-e-texto.md:27`) — nenhum valor é composto a partir de algo fora da lista **fechada** de artefato publicado, e o fato congela a versão de cada artefato que participou dele.

## Critério de aceite

1. Consumo com 3 itens → o acumulado exibido vem do backend, e **nenhum** valor exibido é composto por `MSA` nem pela tela.
2. Repartir o consumo em 2 partes, uma delas com metade de um item → a repartição reproduz **exatamente** os 3 itens, e os totais de cada parte vêm do backend.
3. Durante os 40 minutos em que o consumo está aberto, ele **não** aparece em nenhuma consulta de vendas nem de faturamento do dia (`RN-MSA-001`).
4. Verificar que **nenhum** valor do acumulado foi composto a partir de artefato fora da tabela de `RN-NUC-013` (`docs/produto/nucleo-publicacao-e-texto.md:97`).
5. Lançar item, retirar item, e alterar quantidade → o acumulado exibido reflete cada um dos três **na volta da operação**, sem recarga manual e sem esperar sincronização.
6. Consumo com 20 lançamentos → o acumulado é **uma** composição, não uma consulta por linha.
7. Repartição que sobra ou falta lançamento → o fechamento é **recusado antes** de concluir qualquer cobrança; nenhuma parte é concluída "para resolver o resto depois". Divisão igualitária que não fecha em centavos → a diferença é resolvida por quem calcula o valor, e `MSA` apenas transporta a instrução.
8. Desconto de R$ 10,00 na venda inteira sobre três linhas de R$ 10,00 → as parcelas são **3,34 · 3,33 · 3,33**, com a sobra na linha lançada primeiro, repartidas uma vez, na conclusão, e congeladas na linha (`RN-NUC-064`, aceite 1). Enquanto o consumo está aberto, nada é repartido: a repartição só existe na conclusão, e antes dela não há venda.
9. Três linhas por peso, cada uma de 17,925 exatos → o acumulado soma o valor de cada linha **já arredondado** pelo modo publicado, e o teste afirma qual das duas sequências foi usada (por linha, `"53.79"`; no total, `"53.78"`, com metade para cima). Qual delas vale é a pergunta de "Depende de", item 2.

## Depende de

~~A **precisão e o arredondamento** da composição, e a ordem em que se aplicam, são linha da tabela de `RN-NUC-013` com `LACUNA-NUC-004` no lugar do valor (`docs/produto/nucleo-publicacao-e-texto.md:46`), e decisão de produto com o humano e o contador **antes** da Fase 1 (`docs/produto/roadmap-de-modulos.md:333`) — é `G-09`. Este card compõe o acumulado; ele **não** decide o arredondamento, e o aceite de centavo fica atrás de `G-09`.~~ **Mudou em 2026-09-23**, em três partes:

1. **O rateio da venda inteira está decidido:** `RN-NUC-064` (`docs/produto/nucleo-venda-congelamento.md:16`), maior resto, empate pela ordem de lançamento, uma vez, na conclusão. É a metade de `G-09` que é regra nossa.
2. **O arredondamento da linha tem mecanismo:** o modo é artefato publicado pelo `owner`, versionado e congelado no fato; o produto enumera os modos e não escolhe (`tarefas/T-0014-decidir-lacunas-das-fases-1-e-2.md`, seção "thread — 2026-09-23 (depois do A.2a)"; `docs/produto/pendencias-fase-1-e-2-2026-09-23.md:223-233`). Continua aberto se o acumulado arredonda por linha ou no total (`T-0018`, Fechamento, SOBROU), e o aceite 9 fica atrás dessa resposta; os outros oito não.
3. **A conta é do módulo de `F-030`**, o mesmo no servidor e no terminal. Ele é pré-requisito dos aceites 8 e 9.

Um critério original fica atrás de `G-05`: "item com adicional de R$ 0,00 não gera acréscimo" — vale preservar como pergunta, já que adicional de valor zero existe e o que ele faz ao acumulado depende de adicional ter escopo, que hoje não tem.

## Alterações — 2026-09-23

- **Aceites 8 e 9** entraram. Contra: o card que punha todo aceite de centavo atrás de `G-09`. Prova: `RN-NUC-064`, aceite 1, e os números de `docs/arquitetura/dinheiro-e-quantidade-2026-09-23.md:263-264`.
- **`Depende de`** reescrito nas três partes acima. Prova: `RN-NUC-064` e a decisão do thread em `T-0014`. O texto anterior está riscado.

## Fora de escopo

Forma de apresentação da conferência ao cliente-final — território de `ui`.

## Gate obrigatório

Desempenho — leitura do acumulado é tela quente (critério de aceite 6), `.claude/rules/performance.md` §2.

## Referências

`docs/produto/modulos/mesa-comanda.md:166` · `:81` · `docs/produto/nucleo-publicacao-e-texto.md:27` · `:46` · `:97` · `docs/produto/roadmap-de-modulos.md:333` · `.claude/rules/performance.md` §2 · `docs/produto/nucleo-venda-congelamento.md:16` (`RN-NUC-064`) · `tarefas/T-0014-decidir-lacunas-das-fases-1-e-2.md` · `F-030`

# F-030 — Módulo de ponto fixo de dinheiro e quantidade, em `packages/contracts/`

**Tipo:** Comportamento fechado (contrato) · **Estado:** a fazer · **Dono:** `backend` · **Território:**
`packages/contracts/**`

> **Origem.** Sobra do fechamento de `T-0018` ("Implementar o módulo de ponto fixo em
> `packages/contracts/` (`backend`), com item de backlog novo"). A decisão que ele implementa é
> `memory/plataforma/decision-dinheiro-e-quantidade.md`, tomada pelo thread em 2026-09-23 sobre a
> proposta M2b de `docs/arquitetura/dinheiro-e-quantidade-2026-09-23.md`.

## Objetivo

Escrever o único código que faz conta com dinheiro, preço unitário e quantidade, e que o servidor e o
terminal usam igual. Sem contato, o terminal compõe o valor devido aplicando artefato publicado, e na
volta o servidor não recalcula (`RN-OFF-020`, `docs/produto/operacao-offline-e-sincronizacao.md:109`;
`RN-NUC-015`, `docs/produto/nucleo-publicacao-e-texto.md:131`). Com duas implementações, a mesma venda
sai com centavo diferente em cada ponta, e ninguém vê até o fechamento do contador.

```
string canônica, da rede ou do driver        ("17.90", "0.750")
→ parse, com a escala que quem chama declara  → inteiro escalado em BigInt (1790n, 750n)
→ soma · produto · repartição                  só aritmética inteira
→ arredondamento                               só com modo nomeado por quem chama
→ format                                       → string canônica, na escala exata
```

## Escopo

- **Valor como inteiro escalado mais escala**, lido de string canônica e escrito de volta nela. A forma
  canônica é a da consulta ao `backend` (`tarefas/T-0018-dinheiro-e-quantidade.md`, E.2, item 1): escala
  exata, ponto como separador, sem expoente, sem `+`, sem zero à esquerda, sem `-0`. **A escala nunca se
  infere da string:** quem chama a declara (2 para valor; a declarada pela unidade, de 0 a 3, para
  quantidade; a do preço publicado, até 3, para preço unitário), e string em outra escala é recusada.
- **O envelope dos três domínios** da decisão: `money_amount` com até 2 casas e |v| < 10¹²;
  `unit_price` com até 3 casas; `quantity_value` com até 3 casas e |v| < 10¹¹. A decisão não fixa o teto
  de tamanho de `unit_price`; a ilustração da proposta usa o de `money_amount`
  (`docs/arquitetura/dinheiro-e-quantidade-2026-09-23.md:380-381`), e o módulo adota esse, declarando.
- **Soma** de valores da mesma grandeza e da mesma escala.
- **Produto** quantidade × preço unitário, exato: escala 3 com escala 3 dá escala 6, sem arredondar.
- **Arredondamento** para a escala de valor, só com modo nomeado. O módulo traz pelo menos os dois modos
  que a proposta conferiu, metade para cima e metade para o par (`dinheiro-e-quantidade-2026-09-23.md`
  §6), cada um com nome estável, porque é o nome que a versão publicada congela no fato (`RN-NUC-013`).
  Nenhum modo é padrão.
- **Repartição** de `RN-NUC-064` (`docs/produto/nucleo-venda-congelamento.md:16`): parte inteira de
  V × Li / S para cada linha, as unidades que faltam para as linhas de maior resto, e empate pela ordem de
  lançamento, que quem chama entrega.
- **O pacote**, na forma de `packages/sdui/package.json:1-18`: TypeScript, teste por `node --test`,
  nenhuma dependência de execução.

## Fora de escopo

- **Escolher o modo de uma venda.** O modo é publicação do `owner`, versionada e congelada no fato; o
  produto enumera os modos e não escolhe (`tarefas/T-0014-decidir-lacunas-das-fases-1-e-2.md`, seção
  "thread — 2026-09-23 (depois do A.2a)"). Qual modo a norma exige com `FIS` ou `EMI` ligados é do
  contador, e é aviso (`docs/produto/pendencias-fase-1-e-2-2026-09-23.md:229-233`).
- **Arredondar tributo.** É de `FIS`, e está indisponível (`LACUNA-NUC-004`).
- **Arredondar por linha ou no total da venda.** É pergunta aberta a `produto` (`T-0018`, Fechamento,
  SOBROU). O módulo oferece as duas sequências e não decide entre elas (aceite 4).
- **A validação de borda em `apps/api`**, o schema por domínio que consome este módulo (`T-0018`, E.2,
  item 1). É do mesmo dono, em outra passada.
- **Os domínios no banco.** Nascem na primeira migration de cliente (`F-021`), com guarda de existência.
- **Exibir valor**: moeda, separador local, algarismo tabular. É `SPR-46`, de `ui`. O `format` daqui
  escreve a forma canônica, que é contrato de rede, e não texto de tela.
- **Moeda.** O módulo não carrega moeda nem converte (`RN-NUC-058`). Moeda com expoente diferente de 2
  pede troca de envelope, que é decisão, não parâmetro.
- **Integrar no terminal.** Qual processo compõe offline no arranjo `D` fica para quem integrar.

## Critério de aceite

1. **Ida e volta byte a byte.** `"17.90"` na escala 2 volta `"17.90"`; `"0.750"` na escala 3 volta
   `"0.750"`. Na escala 2, cada uma destas é recusada com o motivo nomeado e nunca normalizada:
   `"17.9"`, `"17.900"`, `"017.90"`, `"+17.90"`, `"1.79e1"`, `"-0.00"`, `"17,90"`, `" 17.90"`, `""`.
2. **Envelope.** Como valor, `"999999999999.99"` é aceito e `"1000000000000.00"` recusado; `"17.925"`
   é recusado, nunca arredondado (é o caso que `numeric(14,2)` arredonda em silêncio,
   `dinheiro-e-quantidade-2026-09-23.md:52`). Como quantidade, `"0.7505"` é recusado.
3. **Produto e modo** (`dinheiro-e-quantidade-2026-09-23.md:214-218`). Polpa, `0.750` × `23.90` =
   17,925 exato; metade para cima dá `"17.93"`, metade para o par dá `"17.92"`. Combustível, `37.512` ×
   `6.299` = 236,288088, e dá `"236.29"` nos dois. Roupa, `2` × `89.90` = `"179.80"`. Arredondar sem
   modo não compila; chamado de JavaScript sem tipo, devolve erro, nunca um padrão.
4. **A ordem de arredondar fica visível.** Três linhas de polpa: arredondar cada linha com metade para
   cima e somar dá `"53.79"`; somar e arredondar dá `"53.78"`. As duas sequências se escrevem com as
   operações públicas, e nenhuma função escolhe entre elas por quem chama.
5. **Repartição** (`RN-NUC-064`, aceites 1 a 3). `10.00` sobre três linhas de `10.00` dá `3.34 · 3.33 ·
   3.33`, com a sobra na primeira lançada. `0.99` sobre `5.00 · 3.00 · 2.00` dá `0.49 · 0.30 · 0.20`. A
   mesma entrada duas vezes dá o mesmo resultado. Linha `0.00` recebe `0.00`. Sobre entradas geradas, a
   soma das parcelas é sempre o valor repartido (teste de propriedade,
   `dinheiro-e-quantidade-2026-09-23.md:275-277`).
6. **Nada de ponto flutuante sobre valor.** Nenhuma função pública aceita ou devolve `number` como
   valor; escala pode ser `number`, valor nunca. No código fora de teste, `Number(`, `parseFloat` e
   `parseInt` não aparecem aplicados a valor, e o relatório mostra a busca.
7. **O mesmo código nas duas pontas.** O código fora de teste não importa `node:*` nem usa global de
   Node, e isso é conferido por construção, não por leitura. A forma, compilar sem os tipos de Node ou
   outra, quem executa escolhe e declara.

**Caminho infeliz.**
- Produto que excede o envelope de valor: a conta é exata em `BigInt`, e o arredondamento ou o `format`
  recusa o resultado. Nunca trunca.
- Repartição com valor maior que a soma das linhas, inclusive soma zero: erro, porque valor devido
  negativo não existe (`RN-NUC-064`, infeliz b).
- Entrada negativa: fato de valor é positivo (devolução é linha nova com valor positivo,
  `.claude/rules/dados.md` §4). O que o módulo faz com negativo é decisão de quem executa, desde que
  declarada e com teste.

## Registra / Não registra

**Registra:** nada. O módulo é função pura. O que se registra é de quem consome o resultado: a versão do
modo aplicado congela no fato (`RN-NUC-013`), e a parcela de cada linha congela nela (`RN-NUC-064`,
Registra).

**Não registra, e por quê:**
- **Nenhum log, evento ou diagnóstico com valor.** O módulo roda no caminho do caixa e no terminal sem
  contato. Log com valor põe dado de negócio do cliente no canal de diagnóstico, o que a spec já recusa
  para o código lido (`RN-NUC-063`, aceite 7); e um efeito colateral que pode falhar dentro da conta é
  captura que pode derrubar a venda (`CLAUDE.md` §7.10, terceiro limite).
- **Erro vira valor de retorno tipado, nunca exceção engolida nem registro próprio.** Quem chama decide se
  a recusa vira fato de recusa (`RN-NUC-043`).

## Depende de

**Nada bloqueante.** `packages/contracts/**` abriu para este módulo em 2026-09-23 (`CLAUDE.md` §2). Não
precisa de banco, de rota, de `D-03` nem de terminal: os casos do aceite são números fixos, e o teste roda
em Node.

Não trava, e fica registrado:
- **A lista de modos pode crescer.** Se `produto` enumerar mais modos, eles entram como nomes novos, e os
  dois que existem não mudam de comportamento.
- **`BigInt` no motor que compõe offline não foi confirmado** (`T-0018`, E.2, RISCOS). O módulo é o mesmo
  nos dois processos do arranjo `D`; a confirmação é da integração no terminal, não deste item.
- **Dependência de desenvolvimento** segue a de `packages/sdui`. Qualquer outra é `BLOQUEIO`
  (`.claude/rules/coder.md`, Nunca).

## Gate obrigatório

Nenhum dos cinco. A regra que ele executa já existe (`RN-NUC-064`); não há DDL, endpoint nem consulta.
O custo de `BigInt` no caminho de adicionar item (≤ 150 ms percebido, `.claude/rules/performance.md` §3)
se mede na integração com o terminal.

## Referências

`memory/plataforma/decision-dinheiro-e-quantidade.md` · `tarefas/T-0018-dinheiro-e-quantidade.md`
(Decisão do thread; E.2; Fechamento) · `docs/arquitetura/dinheiro-e-quantidade-2026-09-23.md` §2.1 ·
§6 · §7 · §11 · `docs/produto/nucleo-venda-congelamento.md:16` (`RN-NUC-064`) ·
`docs/produto/operacao-offline-e-sincronizacao.md:109` (`RN-OFF-020`) ·
`docs/produto/nucleo-publicacao-e-texto.md:27` (`RN-NUC-013`) · `:131` (`RN-NUC-015`) ·
`docs/produto/nucleo-estabelecimento.md:186` (`RN-NUC-058`) · `CLAUDE.md` §2 ·
`packages/sdui/package.json` · `memory/plataforma/gotcha-numeric-em-json-e-array-vira-float-no-driver.md` ·
`memory/plataforma/gotcha-typmod-numeric-arredonda-em-silencio.md` · `F-021` · `SPR-46`

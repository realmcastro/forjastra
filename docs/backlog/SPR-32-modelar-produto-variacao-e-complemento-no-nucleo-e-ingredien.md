# SPR-32 — Modelar produto, variação e complemento no núcleo — e ingrediente no módulo

**Tipo:** História · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-09-22
**Agrupador:** SPR-34
**Rótulos:** —

---

## Edição de 2026-09-23 — o que mudou, por quê, contra o quê

- **Os dois bloqueios saíram, e as respostas tiram do núcleo as duas coisas que o título põe nele.**
  `G-04` fechou em `RN-NUC-069`: o núcleo vende item atômico, e variação, de um eixo ou de vários, é
  `GRD`. `G-05` fechou em `RN-NUC-070`: adicional é o módulo novo `ADI`, multiconjunto, e o núcleo só
  guarda a parte que um módulo compõe sobre a linha. As duas em `docs/produto/nucleo-publicacao-e-texto.md`
  §3 (T-0014, passo A.2b). O título ficou, porque o índice do backlog o repete; o que vale é o escopo
  abaixo.
- **"Complemento" virou "adicional"** (`add_on`, `glossario.md` §6 e §5, onde "complemento" passou a ser
  forma proibida).
- **Os aceites 1 a 4 anteriores eram do complemento** (reuso entre itens, uma linha de ligação, preço do
  complemento, exclusão lógica). Reuso e preço passam a ser de `ADI` (`catalogo-de-modulos.md`, entrada
  `ADI`), que está fora do MVP 1 até o humano dizer o contrário e não tem item no backlog. Exclusão lógica
  contradiz `D-04`.
- **Entraram no escopo, com a prova de cada um:** a versão com vigência do catálogo (`RN-NUC-013`,
  `RN-NUC-002`: a linha grava a versão aplicada, então o item não se modela sem ela), a marca fora de venda
  (`RN-NUC-071`) e o lugar da camada de componentes na linha (`RN-NUC-070`, cláusula b: ligar `ADI` depois
  não pode alterar fato do núcleo).

## Objetivo

Modelar o item de catálogo do núcleo como ele é vendido: atômico, versionado com vigência dentro do
catálogo publicado, com a marca de fora de venda; e deixar na linha o lugar onde um módulo pendura a parte
de valor que compõe, para que ligar `ADI`, `ECG` ou outro módulo depois não mexa em fato gravado.

## Escopo

- **Item de catálogo atômico** (`RN-NUC-069`): identidade, código, unidade de medida com casas
  declaradas. Toda combinação vendável (suco de 300 ml, suco de 500 ml) é um item com código próprio.
- **Versão e vigência do catálogo** (`RN-NUC-013`): o terminal aplica a versão cuja vigência cobre o
  instante, e a linha grava qual aplicou (`RN-NUC-002`).
- **Fora de venda** (`RN-NUC-071`): marca do item numa versão, com vigência; não é estado vivo.
- **Camada de componentes da linha** (`RN-NUC-070`): o lugar onde cada componente fica com módulo dono,
  valor, versão do artefato e, quando o módulo declarar, quantidade. Onde ele mora, no núcleo ou em
  extensão do módulo, é decisão de `arquiteto-dados`.

## Fora de escopo

- **Variação e grade**: `GRD`, fora do MVP 1 (decisão do thread de 2026-09-23). Com ele desligado, cada
  combinação é item cadastrado à mão.
- **O cadastro de adicionais** (quais valem para quais itens, a que preço): é `ADI`, sem item no backlog e
  fora do roadmap do MVP 1 (aviso na entrada de `ADI`).
- **Lista de preço** (`RN-NUC-072`) e o resto do conjunto publicado: não têm item no backlog
  (`docs/produto/pendencias-fase-1-e-2-2026-09-23.md` §7). Este item precisa só de que o preço aponte para
  o item; quem modela a lista é outro item, que ainda não existe.
- **Ingrediente**: `FTC`/`EST` (`fronteira-do-nucleo.md` §2.2).
- **Agrupamento**: `SPR-31`, que depende deste.

## Critério de aceite

1. "Suco 300 ml" e "Suco 500 ml" são dois itens, com identidade e código próprios, e cada um pode ter
   preço próprio; nenhum item tem valor de eixo como dado próprio (`RN-NUC-069`, aceites 1 e 3).
2. Publicar versão nova do catálogo com vigência a partir de amanhã: uma venda de hoje continua
   resolvendo o item pela versão que congelou, e a de amanhã pela nova (`RN-NUC-013`).
3. O mesmo item fora de venda numa versão e de volta na seguinte mantém a identidade; não nasce item novo
   para voltar à venda (`RN-NUC-071`, aceites 1 e 2).
4. Nenhuma coluna de exclusão lógica: tirar de venda é a marca, e tirar do catálogo é versão sem o item.
5. Linha com zero componentes vale a camada do núcleo. O modelo tem onde receber componente de módulo
   sem migração de fato do núcleo quando `ADI` for ligado; a prova é mostrar, no desenho, onde o
   componente do aceite 1 de `RN-NUC-070` (item de R$ 20,00 com adicional de R$ 4,00 × 2 = 28,00) ficaria.

## Registra / Não registra

**Registra:** a versão de catálogo que cada linha aplicou; a marca fora de venda em cada versão, com a
vigência dela; cada componente congelado na linha, quando existir.

**Não registra:**
- Eixo ou valor de eixo na linha: deriva do item (`RN-NUC-069`).
- Estado de disponibilidade na venda: deriva da versão congelada (`RN-NUC-071`).
- Saldo de estoque: é `EST`.

## Depende de

`SPR-39` (em execução em T-0009; `D-04` já fechou) e `SPR-40` (fechada em T-0018). Nada mais: as regras
estão escritas e o item é executável hoje.

## Gate obrigatório

`seguranca` (isolamento de tenant).

## Referências

`docs/produto/nucleo-publicacao-e-texto.md` §1 (`RN-NUC-013`) e §3 (`RN-NUC-069` a `RN-NUC-071`) ·
`docs/produto/nucleo-venda.md` (`RN-NUC-002`) · `docs/produto/catalogo-de-modulos.md` (entradas `GRD` e
`ADI`) · `docs/produto/glossario.md` §1.2, §1.3, §6 · `.claude/rules/dados.md` §3 e §5

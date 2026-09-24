# SPR-37 — Modelar venda, pagamento, caixa, turno e operador no schema de cliente

**Tipo:** História · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-10-07
**Agrupador:** SPR-34
**Rótulos:** bloqueada

> **Editado em 2026-09-23 (T-0014, `F-018`), pela régua de `.claude/rules/backlog.md` §7.** O que mudou,
> e contra o quê:
> - **Turno**, no Escopo: dizia "período de operação, fuso do cliente (`platform.schema_clientes`)".
>   Passa a ser o agrupamento opcional de `RN-NUC-062` (`docs/produto/nucleo-caixa-e-turno.md` §3), e o
>   fuso sai do cliente: é do estabelecimento (`RN-NUC-057`, `docs/produto/nucleo-estabelecimento.md`).
> - **Aceite 5**: dizia "Turno e fechamento de caixa usam **fuso do cliente**, nunca fuso do servidor".
>   Contradizia `RN-NUC-057`, que fecha `LACUNA-GLO-001` pelo estabelecimento. Reescrito com o caso de
>   prova de `F-018`.
> - **Escopo novo, com prova:** o rateio congelado por linha (`RN-NUC-064`) e as três reservas da Opção B
>   (`RN-NUC-065`), ambas em `docs/produto/nucleo-venda-congelamento.md`. `G-01` tinha como default
>   "não modelar", por omissão (`docs/produto/backlog-lacunas-g01-g09.md` §6); a decisão foi modelar, e a
>   pauta punha as reservas "dentro de `SPR-37`" como primeira saída.
> - **Depende de:** entram `F-021` (este card aponta para o estabelecimento que aquele cria) e
>   `LACUNA-NUC-003`, que continua aberta.

---

## Objetivo

Modelar o núcleo de venda completo que **todo** cliente tem: venda, pagamento, movimento de caixa, sessão
de caixa, turno e operador — independente de ramo —, com cada fato nomeando o estabelecimento a que
pertence (`RN-NUC-050`), inclusive quando o cliente tem um só.

## Escopo

* **Venda:** registro de transação, itens, total; congelada **por linha**, com as versões de artefato e a
  parcela de rateio de cada linha (`RN-NUC-064`, `RN-NUC-065` item 2)
* **Pagamento:** método, valor, confirmação
* **Movimento de caixa:** entrada e saída, saldo derivado
* **Sessão de caixa e turno:** a sessão é a unidade de responsabilidade pelo fundo (`RN-NUC-009`,
  `RN-NUC-010`); o turno é **opcional**, derivado dos instantes de abrir e fechar turno, e nenhum fato
  carrega o turno (`RN-NUC-062`). O dia de cada fato é o dia local do estabelecimento no fuso publicado
  dele (`RN-NUC-057`) — derivação de leitura, nunca coluna do fato
* **Operador:** identidade, permissões, trilha de ação
* **As três reservas da obrigação documental** (`RN-NUC-065`): âncora com estado que nunca é ausência,
  grão da linha, e o lugar do número documental separado da referência humana — vazio enquanto `EMI` não
  existir para o cliente

**Não entra nesta issue (tem issue própria):**

* Hierarquia de categorias (SPR-31)
* Produto, variação e complemento (SPR-32)
* Equivalência de composição (SPR-33)
* Estabelecimento, terminal e habilitação a vender (`F-021`)

## Critério de aceite

1. Um posto, uma padaria e uma loja de roupa precisam **todos** de todas estas tabelas? Sim — são núcleo.
   A exceção declarada é o turno, que os três **podem** usar e nenhum é obrigado a usar (`RN-NUC-062`):
   a padaria que nunca abre turno não tem coluna, linha nem precondição de turno em nada que ela grava.
2. Sobrevive a cliente de **outro ramo** e de **outro fuso**? Sim — não tem `table_number` ou `pump_id`.
3. Toda regra de unicidade do negócio é **restrição no banco**, não só no código.
4. Venda e pagamento são **append-only:** cancelamento e devolução são linhas novas referenciando a original.
5. **O dia é do estabelecimento.** Cliente com A em `America/Sao_Paulo` e B em `America/Manaus`, venda em B
   às 23h30 de 2026-10-13, hora de Manaus (`2026-10-14T03:30Z`): o fechamento de B a põe em 2026-10-13, a
   leitura que soma A e B também, e nenhuma leitura a põe em 2026-10-14. Nenhum fato carrega dia nem
   turno; nenhum dia é derivado de fuso do servidor, do terminal ou do cliente (`RN-NUC-057`).
6. **Rateio.** Três linhas de R$ 10,00 com desconto de venda de R$ 10,00 congelam 3,34 · 3,33 · 3,33, e
   devolver a linha 2 um mês depois devolve 6,67 sem repartir de novo (`RN-NUC-064`, aceite).
7. **Reservas.** Pela forma: o modelo mostra onde moram a âncora, o grão por linha e o lugar do número
   documental, e ligar `EMI` depois não exige preencher coluna obrigatória em fato já gravado
   (`RN-NUC-065`, aceite 2 e 4).

## Depende de

- `SPR-39` (chave primária, timestamps, exclusão lógica) e `SPR-40` (dinheiro e quantidade, e a moeda do
  estabelecimento, `RN-NUC-058`).
- **`F-021`**: todo fato daqui nomeia o estabelecimento, e o estabelecimento nasce lá. A ordem entre os
  dois, inclusive onde mora o sujeito autor do fato de criação da unidade, é de `arquiteto-dados`
  (`F-021`, Depende de).
- **`LACUNA-NUC-003`**, ainda aberta: o grão e o reinício da referência humana da venda
  (`docs/produto/nucleo-venda.md` §6). Sem ela, a referência humana não tem unicidade declarável. Não está
  no conjunto de 2026-09-23 de `F-018`; enquanto não fechar, o card não é executável nessa parte.

## Fora de escopo

Módulos de estoque, fiscal ou entrega — eles são opção, não núcleo. Extensão do núcleo vira tabela de
módulo, não mudança de núcleo. A **regra** fiscal fica fora; as três reservas entram porque são estrutura
do núcleo (`RN-NUC-065`). O arredondamento do valor de linha fracionária e o do tributo estão
**indisponíveis** (`docs/produto/nucleo-venda.md` §6, `LACUNA-NUC-004`) e não são modelados aqui.

## Gate obrigatório

Segurança (isolamento de tenant) e desempenho (consulta de venda em caminho quente).

## Referências

`.claude/rules/dados.md` §3 e §5 · `docs/produto/nucleo-venda.md` · `docs/produto/nucleo-caixa-e-turno.md` ·
`docs/produto/nucleo-venda-congelamento.md` · `docs/produto/nucleo-estabelecimento.md` ·
`docs/produto/fronteira-do-nucleo.md` · `docs/produto/glossario.md` ·
`docs/backlog/F-021-modelar-estabelecimento-e-terminal-habilitado.md` ·
`docs/backlog/F-018-decidir-as-lacunas-que-travam-as-fases-1-e-2.md`

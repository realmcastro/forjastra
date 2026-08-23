---
name: decision-d-06-sao-tres-residencias-nao-uma
description: D-06 (onde mora o dado que a nossa operação lê e produz) são TRÊS residências — agregado que soma clientes · trilha dos nossos atos · observação de operação por cliente —, cinco saídas com defeito em cada, nenhuma escolhida; a trilha é a afiada e não pode ficar aberta para a Fase 1
type: decision
escopo: plataforma
camada: dados
data: 2026-08-23
relaciona: [[decision-tenancy-schema-por-cliente]], [[decision-d-05-catalogo-de-regra-fiscal-sem-casa]], [[gotcha-fato-do-provedor-nao-tem-residencia-unica]], [[decision-agregado-de-periodo-fechado-nao-e-cache]]
tarefa: T-0004
---

**`D-06` está ABERTA e nada se presume dela.** O que fechou é o **formato**, no precedente de
[[decision-d-03-sao-tres-eixos-nao-uma-decisao]]: não é uma escolha, são três perguntas hoje amarradas
numa só.

1. **(i) O agregado que soma clientes** — capacidade, custo, "qual módulo ninguém usa", pico agregado.
2. **(ii) A trilha dos nossos atos e das nossas leituras.**
3. **(iii) A observação de operação por cliente** que a fronteira admite (permanência em degradação, taxa
   de erro nossa, tentativa de sincronização).

**A colisão que a origina, literal:** `.claude/rules/dados.md` §1 diz as duas coisas — relatório
consolidado "é agregação no `platform` alimentada por processo explícito" **e** "nenhuma tabela de cliente
vive no `platform`". A pergunta é o que pode morar lá sem ser tabela de cliente.

**As cinco saídas e o defeito de cada uma** (detalhe na ficha `T-0004`, seção `arquiteto-dados` §7):
`platform` viola a leitura literal para qualquer coisa decomponível por cliente e cria um caminho de
leitura de sessão de cliente para o `platform` que nunca foi auditado · **terceiro schema** altera
[[decision-tenancy-schema-por-cliente]] e a semântica de alvo do ledger, e só muda a decomponibilidade de
endereço · **schema do cliente** torna a nossa pergunta `O(schemas)` e faz a prova da nossa conduta sair
com o cliente quando ele sai · **fora do banco** perde a restrição declarativa, cria segundo acervo com
segundo controle de acesso, e presume infraestrutura com `D-01` aberta · **duas gravações** divergem em
silêncio e a divergência é indetectável por cliente.

**A linha proposta, com o defeito dela na mesma frase:** a residência segue o **objeto** do fato (a coisa
sobre a qual ele afirma algo), nunca o leitor — é por isso que o ledger de migration no `platform` nunca
pareceu violação, e referência a cliente **não é** objeto. O defeito, inseparável dela: ela diz quem é
**dono** do fato e **não** resolve decomponibilidade por cliente. São duas perguntas, e é por isso que
`D-06` é três.

**Por que (ii) não pode ficar aberta para a Fase 1:** ela não pode morar no schema do cliente (sai com
ele), é decomponível por cliente por construção, e `.claude/rules/migrations.md` §7 proíbe uma migration
misturar `platform` e cliente — hoje não se sabe de que lado três objetos moram, logo **a primeira
migration desta família não é escrevível**. Dois caminhos independentes chegam a isso: o custo de fan-out
e a proibição do ledger.

**Restrições que qualquer saída tem de respeitar:** (i) só é admissível em **período fechado** e em forma
que não se decomponha — nem por contagem nem por concentração
([[gotcha-agregado-e-seguro-por-concentracao-nao-por-n]]); (ii) tem de satisfazer as quatro partes de
[[convention-gravar-a-propria-trilha-nao-e-mutacao]]; (iii) são **dois objetos com ciclos de vida
diferentes** (fino e transitório para o incidente, grosso e retido), não um objeto com política de acesso.

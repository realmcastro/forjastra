# Auditoria da postura — o que cada `PN` recusa

Tabela **derivada** de `postura-nova-geracao.md`. Existe para uma coisa só: conferir, de relance, que
nenhum item recusa **capacidade** sem uma saída declarada. Divergiu do item? Vale o **item**, não esta
tabela — e a divergência é defeito a corrigir na mesma passada.

`RECUSADO: capacidade` obriga uma das três saídas da §Regra de formação de `postura-nova-geracao.md`:
**(a)** preservada por `CAP-<...>`, **(b)** abandonada com `MOTIVO COMERCIAL` aprovado pelo humano, ou
**(c)** erro, `PN` reescrito mantendo o número.

| Item | Recusado | Necessidade preservada, e por qual mecanismo | Saída |
|---|---|---|---|
| PN-01 | mecanismo | concluir a venda presente — venda local + fila que sobe sozinha | — |
| PN-02 | mecanismo | repetir tentativa sem duplicar — chave de idempotência | — |
| PN-03 | mecanismo | diferença por posto de trabalho — configuração do cliente, servida | — |
| PN-04 | mecanismo | tela do ramo — composição por módulo ativo, um binário só | — |
| PN-05 | mecanismo | velocidade da mão do operador — teclado e leitor como caminho completo | — |
| PN-06 | mecanismo | memória motora + evoluir a interface — posição sob decisão registrada | — |
| PN-07 | mecanismo | corrigir o que foi registrado errado — cancelamento/devolução/estorno com autor | — |
| PN-08 | mecanismo | atualizar preço e tributo — regra com vigência, fato congela a versão | — |
| PN-09 | mecanismo | atender o que só um cliente pede — módulo, configuração, dado | — |
| PN-10 | mecanismo | levar o próprio histórico embora — exportação pelo próprio cliente | — |
| PN-11 | mecanismo | liberar exceção na hora — papel verificado no backend, com trilha | — |
| PN-12 | mecanismo | evoluir com os clientes vendendo — expand/contract + terminal tolerante | — |
| PN-13 | mecanismo | valor certo e total imediato — servidor decide, interface exibe | — |
| PN-14 | mecanismo | terceiro obtém dado no ritmo dele — contrato versionado e revogável | — |
| PN-15 | mecanismo | saber se a venda chegou — estado e pendências visíveis no terminal | — |
| PN-16 | mecanismo | automatizar trabalho repetitivo — automação propõe, operador confirma | — |
| PN-17 | mecanismo | saber a próxima ação na falha — mensagem de operação + registro interno | — |
| PN-18 | mecanismo | comprovante e uso do equipamento que o negócio já tem — degradação e reemissão | — |
| PN-19 | mecanismo | pôr negócio novo em operação — provisionamento repetível e retomável | — |
| PN-20 | mecanismo | mudar o que é do negócio na hora — autoatendimento com trilha | — |

**Resultado da conferência de 2026-08-22:** 20 itens, **nenhum** recusa capacidade. Todos recusam
mecanismo ou vício de execução e preservam a necessidade por mecanismo próprio, com dimensão de ganho
nomeada. Coluna `Saída` vazia porque nenhuma saída foi necessária.

**Como manter:** item novo ou reescrito atualiza esta tabela na mesma entrega. Linha com
`RECUSADO: capacidade` e `Saída` vazia é defeito — não é pendência, é item que não deveria ter
entrado. Número aposentado permanece na tabela, com a linha marcada `aposentado`, para ninguém reusar.

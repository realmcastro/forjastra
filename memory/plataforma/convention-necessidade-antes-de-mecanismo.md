---
name: convention-necessidade-antes-de-mecanismo
description: recusar mecanismo é evolução, recusar capacidade é defeito de produto — toda recusa nomeia primeiro a necessidade que o mecanismo velho atende, e prova por que o novo é melhor
type: convention
escopo: plataforma
camada: produto
data: 2026-08-22
relaciona: [[decision-forja-e-pdv-modular]]
tarefa: T-0001
---

O que existe no PDV arcaico normalmente existe porque **atende necessidade real, já validada por
quem opera**. O defeito está na execução — mecanismo, desempenho, abordagem, ou boa sugestão que
nunca foi aplicada no dia a dia — quase nunca na ideia. Virou regra em `.claude/rules/00-nucleo.md`
§12 (lida por todo agent) e seção operacional em `.claude/rules/produto.md`.

**Por quê:** "isso é arcaico" é a justificativa mais fácil de escrever e a mais difícil de auditar —
ela esconde perda de funcionalidade atrás de vocabulário de modernidade. Recusar capacidade que o
mercado já validou é entregar menos e chamar isso de nova geração. E o inverso também vale: a
metade *ofensiva* de "nova geração" (capacidade que o arcaico não tem) é a que se esquece de
escrever, e é ela que sustenta a promessa.

**Como aplicar:** toda recusa tem quatro partes — necessidade preservada, mecanismo recusado e por
que é ruim, mecanismo novo, por que o novo é melhor e como se prova. Falta uma, é preferência, não
recusa. Capacidade nasce nomeando a **necessidade**, nunca a tecnologia: o título é "consultar preço
e vender a partir da própria peça", não "QR code em roupa" — a necessidade sobrevive à troca de
mecanismo, o título com mecanismo morre com ele. E nenhum agent afirma o que o concorrente faz:
isso não é fonte, é memória de modelo.

**Auditoria feita em 2026-08-22:** os 20 itens `PN-nn` de `docs/produto/postura-nova-geracao.md`
foram lidos um por um contra este critério. Nenhum recusa capacidade — todos recusam mecanismo e
preservam a necessidade (`PN-14` troca credencial de banco por contrato versionado revogável;
`PN-07` troca edição de venda por cancelamento/devolução com autor e motivo; `PN-18` preserva o
comprovante por reemissão). O que faltava era o cabeçalho do arquivo, que se declarava puramente
defensivo, e a metade ofensiva — que virou `docs/produto/catalogo-de-capacidades.md`, numeração
`CAP-<COD_MODULO>-<nnn>` (**corrigido em 2026-08-23**: este registro dizia
`capacidades-de-nova-geracao.md` / `CN-nn`, nomes que nunca existiram em disco).

**Os `PN-nn` são critério citável por número, não postura genérica.** Recusa de spec cita o `PN` que a
fundamenta, e mudar um `PN` exige decisão registrada — não interpretação de quem está escrevendo a
spec naquele dia. É o que faz a §12 do núcleo ser auditável linha por linha em vez de retórica.

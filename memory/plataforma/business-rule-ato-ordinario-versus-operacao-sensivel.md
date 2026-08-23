---
name: business-rule-ato-ordinario-versus-operacao-sensivel
description: o ato ordinário de venda se apoia em terminal habilitado a vender + operador identificado, nunca em autoridade de pessoa retida; só operação sensível exige autoridade retida válida — e é isso que desamarra os dois prazos que o negócio quer opostos
type: business-rule
escopo: plataforma
camada: produto
data: 2026-08-23
relaciona: [[business-rule-habilitacao-a-vender-do-terminal-tem-prazo]], [[convention-criterio-de-operacao-sensivel]], [[decision-contencao-de-papel-nao-gera-autoridade-retida]]
tarefa: T-0003
---

Sem rede, a venda comum se sustenta em dois fatos retidos no terminal, e em nenhuma autoridade de
pessoa (`RN-OFF-032`, `docs/produto/fila-local-autoridade-e-identidade.md`):

1. o terminal está **habilitado a vender** por aquele estabelecimento (fato obtido com contato);
2. o operador está **identificado**, para o fato ter autor.

O **meio de identificação retido** é uma **terceira categoria** de coisa retida (`RN-OFF-033`): não é
artefato publicado nem autoridade — identifica, não autoriza, reconcilia. Antes dela, o meio de prova
de identidade não existia em nenhuma lista fechada do contrato de offline.

**Operação sensível continua exigindo autoridade retida válida.** O conjunto do ato ordinário é
**fechado pela coluna** `Offline` da matriz, no valor `terminal+ident` (`RN-NUC-027` cláusula 3, quarto
valor, criado em 2026-08-23 por `AUT-14`) — hoje nove linhas pela contagem de `produto`, e o auditor
contou dez; qual é a décima é **valor de célula, decisão do humano**. Quem porta apenas `owner`
pratica ato ordinário sem contato e sem atribuição nenhuma; `provider_support` está fora, e toda
célula offline dele é recusa.

**Por quê — o ganho que justifica o registro:** antes, **um número só** governava a rapidez da
revogação **e** o tempo que o balcão sobrevive offline; o negócio quer os dois em direções opostas, e
por isso nenhum valor servia. Separar identificar de autorizar deixou os prazos independentes:
encurtar a validade da autoridade passou a custar **só** o alcance sensível, não o balcão. O número
a apertar deixou de ser `LACUNA-OFF-011` e passou a ser `LACUNA-OFF-016` (frequência de
reconciliação da identificação).

**Como aplicar:** qualquer regra, contrato ou tela que pergunte "quem pode isto sem rede?" pergunta
primeiro se a operação é ato ordinário ou sensível — e a resposta vem da **coluna**, não da prosa
([[decision-celula-e-autoridade-unica-sobre-autorizacao]]). "Reautenticar sem contato" não existe em
nenhuma superfície.

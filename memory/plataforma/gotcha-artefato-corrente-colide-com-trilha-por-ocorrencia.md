---
name: gotcha-artefato-corrente-colide-com-trilha-por-ocorrencia
description: se toda leitura nossa é fato, um painel que se atualiza sozinho produz UMA leitura por atualização — ou a trilha fica ilegível por volume e passa a medir recarga de tela, ou o artefato é isento e a isenção revoga a trilha em silêncio
type: gotcha
escopo: plataforma
camada: produto
data: 2026-08-23
relaciona: [[convention-gravar-a-propria-trilha-nao-e-mutacao]], [[decision-agregado-de-periodo-fechado-nao-e-cache]]
tarefa: T-0004
---

**Sintoma: "o painel ficou lento."** É assim que esta decisão chega — nunca como decisão.

**O fato:** duas promessas boas, escritas em salas diferentes, colidem. (1) O humano quer painel ao vivo do
que está acontecendo nos clientes. (2) Toda leitura nossa do negócio do cliente é **fato**, legível por ele.
Juntas: artefato **corrente** produz uma leitura por atualização, e só há dois desfechos, os dois ruins —
**ou** a trilha do cliente fica ilegível por volume e a contagem que deveria significar *quanto acesso a
nossa operação exige* passa a medir **recarga de tela**, **ou** o artefato é declarado isento da trilha, e a
isenção é a revogação **silenciosa** da promessa de trilha.

**Por que ninguém tinha notado:** dashboard e auditoria se pensam em salas diferentes. Quem projeta o painel
não está lendo a regra da trilha, e quem escreve a trilha não está imaginando um artefato que se atualiza
sem ninguém pedir. A colisão só aparece na multiplicação.

**Não há terceira saída sem decidir a UNIDADE de uma leitura** — e a unidade tem de satisfazer duas
propriedades: a contagem continua significando quanto acesso a nossa operação exige, e o cliente continua
distinguindo **uma ocasião de outra**. Um fato por sessão apaga a segunda; um fato por requisição apaga a
primeira.

**Gêmeo de custo, do mesmo mecanismo:** o custo de período **aberto** não é por pergunta, é por **recarga ×
N schemas**, permanente e independente de alguém estar olhando. É o único tipo de leitura que degrada sem
ninguém pedir nada, e cresce com a base de clientes.

**Como aplicar:** antes de especificar qualquer artefato que se atualiza sozinho, responda em que unidade
ele deixa rastro. Se a resposta for "por atualização", ele não é especificável ainda.

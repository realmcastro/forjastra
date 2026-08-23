---
name: decision-celula-e-autoridade-unica-sobre-autorizacao
description: sobre autorização a célula da matriz operação × papel é a autoridade única e vence prosa em qualquer RN, inclusive na dona; papel nomeado em prosa é indicação de candidato, nunca concessão
type: decision
escopo: plataforma
camada: produto
data: 2026-08-23
relaciona: [[gotcha-regra-nova-que-nao-corrige-a-celula-nasce-inerte]], [[decision-contencao-de-papel-nao-gera-autoridade-retida]]
tarefa: T-0003
---

`RN-NUC-039` (`docs/produto/matriz-operacao-papel-contrato.md`): quando a célula e o texto de
qualquer `RN` discordam sobre quem pode uma operação, **vence a célula**. A prosa que nomeia papel é
**indicação de candidato**, não concessão. A célula é **teto**: configuração e concessão de
`provider_support` só estreitam. Quem escreve `RN` que nomeia papel **cita linha e valor, ou marca a
lacuna**.

Nasceu de um caso fiscal (`AUT-08`, `RN-EMI-039` concedia a papel de escopo estabelecimento o que a
matriz negava por omissão) e vale para **todo** par célula × prosa.

**Por quê:** com duas fontes de verdade sobre autorização, a implementação escolhe a que encontrar
primeiro, e a escolha é invisível na revisão. Uma fonte única e **tabular** tem a propriedade que a
prosa não tem: é verificável por busca, célula por célula, e a ausência aparece.

**O custo aceito, e ele é real:** prosa que concedia passa a não conceder, e o alcance cai até o
humano criar a linha. A varredura de conformidade (16 arquivos de spec, 13 pares célula × prosa) já
produziu o caso extremo: `REL` **não tem uma única célula em nenhuma das três matrizes**, logo seis
relatórios especificados estão negados a todos (`LACUNA-NUC-037`). Isso é correto — prosa não
concede — e destrava com uma linha de tabela, que é decisão do humano.

**Como aplicar:** valor de célula é **do humano**; agent não altera valor de célula. Divergência
encontrada entre célula e prosa: corrija a prosa, ou marque a lacuna. Nunca conceda pela prosa.

---
name: convention-varredura-de-captura-infeliz-primeiro-e-ancora-rn-nao-basta
description: varrer spec atrás de captura ausente tem rendimento no bloco `**Infeliz**` (11 dos 12 achados saíram de lá) e tem dois buracos de cobertura — âncora em `RN` nunca alcança `plataforma`, que não tem `RN` por construção, e profundidade declarada que é vazia para o arquivo conta como coberto sem ter sido lido
type: convention
escopo: processo
camada: produto
data: 2026-09-12
relaciona: [[decision-capturar-e-o-padrao-nao-capturar-exige-justificativa]], [[convention-ausencia-decidida-versus-acidental]], [[decision-arquitetura-de-agents]]
tarefa: T-0010
---

Método da varredura do invariante 10 sobre `docs/produto/**`, em três passadas (2026-09-11 e
2026-09-12). Absorve as duas sugestões de memória da segunda e da terceira passada, porque separá-las
deixaria o rendimento sem o buraco ao lado — e quem lesse só a primeira repetiria a falha.

**1. Leia o caminho infeliz primeiro.** Onze dos doze achados das duas primeiras passadas saíram de
bloco `**Infeliz**`. A razão não é estilo de escrita: sucesso vira venda e deixa rastro sozinho, então
a perda se concentra no que foi tentado e não deu certo — lançado e retirado, montado e abandonado,
perdido por corrida, impedido por falta de contato. Numa leitura dirigida, `**Infeliz**` + contrato +
seções de captura é o recorte de maior rendimento por linha lida.

**2. Âncora em `RN` não alcança o que nunca terá `RN`.** O recorte "o conjunto normativo é o dos
arquivos que carregam `RN`" é bom e tem um buraco **estrutural**: escopo fora do território de
`produto` — `plataforma`, e a composição de tela por manifesto é o caso — não tem regra numerada e
nunca vai ter. O achado 2.14 (nó de manifesto descartado pelo terminal não produz fato, contra a
promessa de `PN-12`) só apareceu na terceira passada, e por construção do recorte, não por descuido de
quem varreu. Varredura futura declara, junto com a âncora, **o que a âncora não alcança**.

**3. Profundidade declarada tem que ser não-vazia para aquele arquivo.** "Lido de forma dirigida =
todo bloco `**Infeliz**`" aplicado a um arquivo que não tem nenhum bloco `**Infeliz**` é cobertura
**nominal**: o arquivo aparece coberto na contagem e não foi lido com lente nenhuma. Medido em
2026-09-12, na validação de `T-0010`: `superficie-por-papel-momentos.md` (289 linhas, 70 citações de
`RN`, **zero** `### RN-`, **zero** blocos `**Infeliz**`) entrou na lista dos "39 que carregam `RN`" e
foi lido pelo critério do infeliz — que ali não seleciona nada. Ele é exatamente a espécie que a lente
de arquivo sem `RN` existe para pegar: prosa que repete a regra e, ao repetir, estreita.

**Arquivo sem `RN` pede a outra lente**, e ela tem três formas: recusa de capacidade que arrasta junto
o **fato** que o mecanismo produzia · enumeração fechada sem entrada para o caso infeliz · prosa que
repete mal a `RN` e estreita. Nas três, a pergunta é "este arquivo fecha uma captura sem ninguém ter
perguntado?".

**Confira cobertura por conjunto, nunca por contagem.** A diferença entre a lista de arquivos do
diretório e a lista de cobertos é `comm`, custa um comando e não mente. A contagem mentiu: "20 lidos
integralmente" sobre uma lista de 21 nomes, e "39 que carregam `RN`" sobre uma cobertura de 40 nomes,
um deles sem `RN` nenhum. Nenhum arquivo ficou de fora — mas foi o conjunto que provou isso, não o
número.

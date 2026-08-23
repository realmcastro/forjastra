---
name: decision-quinto-escopo-provedor
description: o nosso próprio negócio é um quinto escopo (`provedor`, código `PRV`) — não é núcleo, módulo, vertical nem cliente — e ele NÃO herda o nome "plataforma"; o conhecimento dele mora aqui, em `plataforma/`, porque restringe trabalho que não é sobre ele
type: decision
escopo: plataforma
camada: produto
data: 2026-08-23
relaciona: [[decision-forja-e-pdv-modular]], [[decision-tenancy-schema-por-cliente]], [[decision-leitura-e-mutacao-sao-eixos-independentes]]
tarefa: T-0004
---

A spec já havia deportado este território quatro vezes ("é dado **nosso**, fora do escopo de qualquer
cliente… e não é este módulo") sem nunca lhe dar endereço. T-0004 deu: escopo `provedor`, código `PRV`,
com `RN-PRV-nnn` próprias em `docs/produto/operacao-do-provedor*.md`, `superficie-do-provedor.md` e
`fatos-de-operacao-provedor.md`.

**Por quê:** operação nossa não passa nenhum dos testes dos outros quatro escopos — não é do núcleo de
venda (posto, padaria e loja de roupa não precisam dela para vender), não é módulo (o cliente não a liga
nem a desliga), não é vertical e não é de um cliente. Sem endereço, cada regra sobre nós nascia dentro da
spec de outra coisa, e era isso que fazia a fronteira vazar.

**O nome não se herda, e a razão é útil:** o schema `platform` e o escopo de memória `plataforma` são o
**mesmo** sentido em duas altitudes — a infraestrutura comum a todo cliente. O nosso negócio é outra
espécie. Quem cedeu o nome foi a expressão frouxa "operação da plataforma", não o mecanismo: **nenhum
identificador foi renomeado.** No mesmo espírito, `provider_support` **não** foi estendido para mutação:
estendê-lo revogaria escopo mínimo, prazo, motivo por incidente e "nunca mais de um cliente" de uma vez,
sobrando o nome. O custo aceito é dívida de nome — duas coisas que um humano chama de "suporte" — resolvida
por **mapeamento declarado**, não por rename (id que é coluna de matriz e é citado por regra numerada não
se renomeia para caber na palavra do humano).

**Por que este conhecimento mora em `plataforma/` e não numa área própria de memória:** ele restringe
trabalho que **não** é sobre o provedor — residência de fato, chave de correlação, retenção, tenant na
borda. Numa área própria, quem modela a venda do cliente não o leria, e é justamente ele que precisa.
Área nova em `MEMORY.md` só nasce quando existir conhecimento que **só** faz sentido dentro dela.

**Como aplicar:** regra sobre o que **nós** fazemos no ambiente do cliente é `RN-PRV`, não `RN-NUC`. E
antes de escrever "plataforma", diga se é o schema de controle, o escopo de memória ou o nosso negócio —
se for o terceiro, a palavra é `provedor`.

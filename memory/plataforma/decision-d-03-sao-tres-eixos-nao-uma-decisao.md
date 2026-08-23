---
name: decision-d-03-sao-tres-eixos-nao-uma-decisao
description: D-03 (identidade e auth) é ortogonal em três eixos — residência do sujeito, mecanismo de prova, chegada do tenant — e é por isso que a decisão mais antiga do projeto nunca fechava; ela SEGUE ABERTA, com uma pergunta única para o humano
type: decision
escopo: plataforma
camada: backend
data: 2026-08-23
relaciona: [[reference-dossies-de-decisao-de-arquitetura]], [[decision-tenancy-schema-por-cliente]]
tarefa: T-0003
---

**D-03 continua ABERTA** (`CLAUDE.md` §8). O que fechou é o **formato** dela: não é uma escolha, são
**três eixos ortogonais** —

1. **residência do sujeito** — a pessoa mora no schema do cliente ou numa população global?
2. **mecanismo de prova** — o que o portador apresenta, e o que o servidor confere;
3. **chegada do tenant** — como o cliente é resolvido na borda.

**Por quê isto é o entregável:** cada tentativa anterior de fechar D-03 colidia com uma pergunta de
outro eixo, e a conversa voltava ao início. Separados, os eixos se decidem em ordem. Consequência
concreta: existem **três portadores lícitos de tenant**, e com dois deles **nenhuma requisição carrega
tenant** — logo não existe verificação de tenant a esquecer. O isolamento passa a ser propriedade da
**construção**, não da disciplina de quem escreve consulta.

**A pergunta única que fecha D-03, e ela é do humano:** o humano que opera em mais de um cliente é
caso de **borda** ou caso de **venda**?
- **borda** → opção **C** (recomendada no dossiê, com o critério escrito antes da conclusão);
- **caso de venda** → opção **B**, e aí é preciso assumir **por escrito** que o isolamento entre
  clientes passa a ser garantido por **verificação** em vez de por **construção**.

**Agravante concreto de B, medido em consequência e não em preferência:** filtro de tenant errado na
projeção do conjunto de identificação não vaza "quem existe" — vaza o **meio de identificar** pessoas
de outro cliente para um dispositivo físico de terceiro.

**Como aplicar:** ninguém presume um eixo para destravar trabalho (`00-nucleo.md` §3). `RN-OFF-032` é
satisfeita nas três opções — reter a habilitação de vender o terminal é fato exigido em qualquer
delas e **não** é o mesmo que portar tenant na requisição; nada em D-03 fica bloqueado por ela.

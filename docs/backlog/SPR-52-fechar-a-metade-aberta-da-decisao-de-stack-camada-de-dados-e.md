# SPR-52 — Fechar a metade aberta da decisão de stack: camada de dados e framework HTTP

**Tipo:** Spike · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-10-22
**Agrupador:** SPR-34

---

## Contexto

Linguagem fechada (Node + TypeScript estrito). ORM/query builder e framework HTTP ainda abertos. Eles são reversíveis — trocar mapeador não toca banco nem contrato, desde que SQL versionado seja insumo e executor seja nosso. Fechar decisão irreversa junto com reversa faz a reversa não ser pensada.

**Pergunta que a decisão responde:**

> Qual camada de acesso a dados, e qual framework HTTP?

## O que testar

**1. Camada de dados — executação contra schemas diferentes**

* Cenário: mesma consulta contra schema A e depois schema B, sem nome de schema na entrada do código
* Desfecho: a camada não concatena string de schema, não assume schema fixo em config
* Testar: id de recurso é validado contra tenant que a camada recebe
* Limitação conhecida: SQL não parametriza nome de schema, entra por vínculo ou qualificação estática

**2. Camada de dados — motor de migration não conflita com o executor próprio**

* Cenário: integração do ORM com migration
* Desfecho: o motor de migration do ORM coexiste com o nosso executor, ou entra em conflito?
* Importa: nosso executor é por `(schema, versão)` com checksum; o do ORM é por banco

**3. Camada de dados — não assume schema fixo**

* Cenário: config em arquivo ou tempo de compilação vs. resolvido por requisição
* Desfecho: a camada **respeita** passa schema por request context ou conexão resolvida por requisição?

**4. Framework HTTP — validação na borda**

* Cenário: entrada de rede (JSON, query string, headers) é validada uma vez, na borda
* Desfecho: tipo desconhecido e erro que sai são legíveis (não vazam stack, schema, id de outro cliente)

**5. Framework HTTP — resolução de tenant**

* Cenário: um ponto por requisição onde tenant é resolvido de identidade autenticada
* Desfecho: nunca vem de corpo, query, header editável, path; contexto viaja por injeção; ausência de tenant é erro, não default

## Entrega

* Nome da camada de dados, versão, avaliação contra os três critérios
* Nome do framework HTTP, versão, avaliação contra os dois critérios
* Documento com code pattern: como fazer query contra schema passado em contexto (sem string concatenation)
* Documento com code pattern: como resolver tenant uma vez e injetar em tudo

## Critério de conclusão

* Ambas as escolhas **aprovadas ou rejeitadas com motivo concreto**
* Padrões de código escritos, sem liberdade de improviso depois
* Nenhuma reversão de escolha depois da Fase 2 começar

## Fora de escopo

Hosting, deploy, telemetria, format de log. São reversíveis e não travam nada.

## Referências

`.claude/rules/backend.md` §1 e §3 · `.claude/rules/dados.md` §1 · `.claude/rules/migrations.md` · `docs/arquitetura/d-01-d-02-stack-opcoes.md` §2.1 e §4

## Resultados esperados

Duas decisoes registradas, cada uma com a alternativa recusada e o trade-off: a camada de acesso a dados, e o framework HTTP. Depois delas, a linha da decisao de stack na tabela de decisoes em aberto vira FECHADA por inteiro.A camada de dados precisa provar, com codigo, que executa a mesma consulta contra schemas diferentes sem que o nome do schema apareca em lugar que o chamador controle, e que nao traz motor de migration ligado. O framework HTTP precisa provar validacao na borda e um ponto por requisicao onde o tenant e resolvido uma vez.Enquanto esta issue estiver aberta, implementacao acoplada a framework ou a ORM continua sendo bloqueio declarado, nao licenca.

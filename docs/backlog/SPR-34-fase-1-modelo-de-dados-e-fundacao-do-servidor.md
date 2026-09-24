# SPR-34 — Fase 1 — modelo de dados e fundação do servidor

**Tipo:** Epic · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-10-23
**Rótulos:** bloqueada

---

## Objetivo

Entregar o modelo de dados do núcleo de venda e a fundação do servidor de forma que a Fase 2 **não precise refazê-los**. Fase não é prazo, é dependência: esta fecha quando o modelo passa no gate de segurança e a convenção de chave/timestamp/exclusão está fechada.

## Contexto de decisão — 2026-08-26

* **Linguagem: FECHADA.** Node no servidor, **TypeScript estrito nos dois lados**.
* **Ainda aberto:** ORM/query builder e framework HTTP. É a issue L2 desta Epic e **não bloqueia o banco**.
* **Fechado desde o início:** Postgres, com **um schema por cliente**.
* O entregável de banco é **SQL/DDL puro e versionado**, agnóstico de ORM e de framework. Por isso esta Epic pode começar hoje, com decisões de stack ainda abertas.

## Invariantes que valem em toda issue desta Epic

1. **Isolamento de tenant é absoluto.** Um schema Postgres por cliente. Nenhuma consulta cruza schema. Relatório consolidado não é `JOIN` entre schemas. Vazamento entre clientes é o pior defeito possível neste sistema.
2. **Migration é forward-only**, idempotente, roda N vezes (uma por schema), retomável por `(schema, version)`. Migration aplicada nunca é editada.
3. **O que é fiscal e financeiro é append-only.** Venda, pagamento, movimento de caixa e documento fiscal não se editam nem se apagam: cancelamento e devolução são linhas novas que referenciam a original.
4. **O núcleo não conhece o ramo.** Nenhuma coluna de vertical no núcleo. Diferença de ramo é dado, configuração ou módulo.
5. **Tempo é** `timestamptz` em UTC, sempre. O fuso é do **estabelecimento**, publicado com vigência, e o
   dia é derivação de leitura (`RN-NUC-057`); a moeda também é do estabelecimento (`RN-NUC-058`).
   *Editado em 2026-09-23 (T-0014, `F-018`): dizia "o fuso é dado do cliente, aplicado na borda", o lado
   de `LACUNA-GLO-001` que a decisão recusou.*

## Vocabulário

O núcleo fala **venda, item, pedido, pagamento, operador, turno, cliente-final, catálogo**. Termos de ramo (`mesa`, `comanda`, `bomba`, `frota`) pertencem a módulo ou vertical e não aparecem em tabela do núcleo. Identificadores de código em inglês; conversa e documentação em pt-BR.

## Referências

`.claude/rules/dados.md` · `.claude/rules/migrations.md` · `docs/produto/nucleo-venda.md` · `docs/produto/nucleo-caixa-e-turno.md` · `docs/produto/nucleo-venda-congelamento.md` · `docs/produto/nucleo-estabelecimento.md` · `docs/produto/fronteira-do-nucleo.md` · `docs/produto/glossario.md`

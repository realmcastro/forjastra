---
name: decision-d-05-catalogo-de-regra-fiscal-sem-casa
description: regra fiscal de abrangência maior que o cliente (alíquota de UF, por exemplo) não tem casa no modelo — as três saídas conhecidas têm defeito, e o módulo de tributação não entra na Fase 1 antes disso ser decidido
type: decision
escopo: plataforma
camada: dados
data: 2026-08-23
relaciona: [[decision-tenancy-schema-por-cliente]], [[gotcha-fuso-do-estabelecimento-versus-fuso-do-cliente]]
tarefa: T-0001
---

**Decisão ainda NÃO tomada** — proposta como `D-05` em `docs/produto/roadmap-de-modulos.md` §7.1, e
**ainda não presente na tabela do `CLAUDE.md` §8**. Colocá-la lá é ato do humano.

O problema: uma alíquota de UF, um layout, uma vigência de regra valem para **muitos** clientes. As
três saídas conhecidas, cada uma com o seu defeito:

1. **`platform`** — viola "nenhuma tabela de cliente vive no `platform`, e vice-versa"
   (`.claude/rules/dados.md` §1), e consulta de venda passaria a cruzar o controle.
2. **replicar em N schemas** — os N divergem em silêncio; a divergência aparece num cliente só, meses
   depois, e é indistinguível de erro de cadastro.
3. **artefato versionado que acompanha o release** — resolve a divergência e **perde a restrição
   declarativa** do banco (nada impede o dado de contradizer o artefato).

**Por quê está registrado antes de estar decidido:** enquanto `D-05` não fechar, o módulo de
tributação (`FIS`) **não é modelável**, e ele é camada 1 de tudo que documenta venda. Agendar `FIS`
na Fase 1 sem isto é modelar para migrar depois — exatamente o custo que a Fase 1 existe para evitar.

**Como aplicar:** `arquiteto-dados` que receba brief tocando `FIS` emite `BLOQUEIO` citando este
registro. Não escolha uma das três para destravar.

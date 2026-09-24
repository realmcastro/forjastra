# F-002 — Fundação do servidor: borda, tenant, erro e ponte para o banco

**Tipo:** Comportamento fechado · **Estado:** em execução (ficha `tarefas/T-0011-fundacao-do-servidor.md`)

## Objetivo

Pôr `apps/api` em pé com o que **não depende do modelo de venda**: resolução de tenant na borda a
partir da identidade autenticada, forma única e estável de erro, validação de entrada na borda, e a
ponte para o banco com o contexto de tenant chegando até a consulta.

## Escopo

- Hook de requisição que resolve o tenant **uma vez**, nunca de `body`, `query`, cabeçalho livre ou
  path editável pelo chamador.
- Forma de erro com código, mensagem para humano e campo quando aplicável, que nunca vaza stack, SQL,
  nome de schema nem id interno de outro cliente.
- Validação de entrada com schema, uma vez, na borda.
- Alcance do schema do cliente por **qualificação por consulta**, não por estado de sessão.
- As duas listas do invariante 10 para os fatos de borda.

## Fora de escopo

- **Rota de negócio** (venda, item, pagamento, caixa, turno): as tabelas não existem e estão
  bloqueadas por lacunas do humano. Rota sobre o que não existe é palpite.
- **Prova de identidade** — `D-03` ABERTA. A borda assume identidade já provada, com a fronteira
  declarada; todo ponto onde a prova aconteceria é bloqueio nomeado, nunca preenchimento provisório.
- `packages/**` e `apps/web/**`, proibidos até a fase que os cria (`CLAUDE.md` §2).
- Destino durável do fato de borda — `D-06` ABERTA.

## Critério de aceite

O servidor sobe. Requisição sem identidade responde na forma única de erro, e não enumera superfície.
Duas requisições de clientes diferentes na **mesma conexão física** leem cada uma o seu schema, com
uma isca plantada em `public` que nenhuma das duas alcança.

## Depende de

`D-01` (fechada em 2026-09-11: Fastify e Kysely) · `D-04` (fechada) · o schema de controle de
`T-0009`, para o mapa identidade→schema.

## Gate obrigatório

Segurança — gate 3 do `CLAUDE.md` §4 (autorização e escopo de tenant).

## Referências

`.claude/rules/backend.md` · `memory/plataforma/decision-d-01-fastify-e-kysely.md` ·
`db/migrator/APLICACAO-E-ALVO.md` §10 · `memory/plataforma/gotcha-search-path-serve-o-executor-e-vaza-no-pool.md`

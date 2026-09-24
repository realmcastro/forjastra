---
name: reference-jira-projeto-spr
description: HISTÓRICO — o Jira foi abandonado em 2026-09-11 e o conteúdo está em `docs/backlog/`; este registro guarda de onde vieram os identificadores `SPR-<n>` e a mecânica do projeto SPR em arturjuliao20.atlassian.net enquanto ele valeu
type: reference
escopo: plataforma
camada: processo
data: 2026-08-26
relaciona: [[decision-backlog-e-o-registro-publico-da-tarefa]], [[gotcha-board-spr-e-nomeado-pela-vertical]], [[state-execucao-solo-2026-09-11]]
---

**Registro histórico desde 2026-09-11.** O Jira foi abandonado nessa data
([[decision-backlog-e-o-registro-publico-da-tarefa]]) e os 56 cards foram migrados com corpo integral
para `docs/backlog/`, que é onde o trabalho vive agora. Nada aqui é instrução: é o que explica de
onde vêm os identificadores `SPR-<n>` que as fichas e a memória ainda citam. As menções a
`.claude/rules/jira.md` abaixo apontam para um arquivo removido na mesma data e substituído por
`.claude/rules/backlog.md`.

- **Site:** `arturjuliao20.atlassian.net` · **`cloudId`:** `47c620c6-728b-44f0-9aad-91240111566b`
- **Projeto:** `SPR` — "Sistema de Pedido de Restaurantes", team-managed (`next-gen`), id `10000`.
  É o **único** projeto visível na conta.
- **Status (três, e só):** `A fazer` (`10000`) · `Em andamento` (`10001`) · `Concluído` (`10003`).
  Transições globais: `11` → A fazer, `21` → Em andamento, `41` → Concluído.
  **Não há status de bloqueio** — ver `.claude/rules/jira.md` §8 para o que fazer no lugar.
- **Tipos:** `Epic` (`10001`), `História` (`10004`), `Request` (`10006`), `Bug` (`10007`),
  `Spike` (`10008`, "pesquisa e estudos").
- **Pessoas — `accountId` para atribuir issue por API:**

  | Pessoa | `accountId` | Fuso |
  |---|---|---|
  | Matheus Castro | `637f61aede5cdaba3a67cabe` | `America/Fortaleza` |
  | Artur Bruno | `70121:7723cf5c-26b5-46f0-aac6-7c654c653814` | `America/Fortaleza` |
  | João Marcelo Nobre Viana | `63075ce55e1a6967a3dc4104` | — |

  Artur criou o backlog anterior. A conta autenticada nesta sessão é a do Matheus, então **todo
  comentário e toda issue criada por aqui aparecem no nome dele** — não há como postar "em nome de"
  outra pessoa.

- **Divisão de frente acordada em 2026-08-26:** Matheus no backend e no banco; Artur e João Marcelo
  dividindo o cliente (móvel + Expo), porque o escopo não cabe em uma pessoa. Tarefa mais avançada
  nasce **sem dono**, para quem liberar primeiro pegar.

- **Armadilha da API — o tipo `Spike` tem campo obrigatório.** `customfield_10042` ("Resultados
  Esperados") é exigido e **só aceita ADF**, não texto simples: passe
  `{"type":"doc","version":1,"content":[{"type":"paragraph","content":[{"type":"text","text":"…"}]}]}`
  em `additional_fields`. Texto puro devolve "não é um conteúdo válido do formato de documento da
  Atlassian". `História` e `Epic` não exigem o campo. Sem isso, criar Spike falha com 400.
- **Backlog anterior:** `SPR-1`…`SPR-33`, criadas em 2026-08-19 e 2026-08-23, **sem** ficha em
  `tarefas/`. `SPR-1` está em `Em andamento`; as outras 32 em `A fazer`.

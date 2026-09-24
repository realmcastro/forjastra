---
name: gotcha-o-titulo-nao-e-o-card
description: revisar card de board pelo título produz veredito errado nos dois sentidos — o corpo de SPR-36 decidia uma lacuna do humano com o título limpo (revisado como MANTER), e SPR-18/SPR-30 tinham título já corrigido sobre corpo afirmando o mecanismo recusado
type: gotcha
escopo: processo
camada: processo
data: 2026-08-26
relaciona: [[gotcha-capacidade-sem-dono-entra-pelo-titulo-do-card]], [[decision-backlog-e-o-registro-publico-da-tarefa]], [[state-board-spr-2026-08-26]]
tarefa: T-0006
---

**Sintoma:** uma revisão de backlog feita sobre título (e sobre resumo de título) sai internamente
coerente e erra os cards que mais custam. Erra nos **dois** sentidos, e nenhum deles acusa:

- **O corpo decide, o título não conta.** `SPR-36` punha o fuso na linha do cliente, com justificativa
  escrita — isso *decide* `LACUNA-GLO-001`, que é do humano, e vence em 2026-09-08. A palavra "fuso" não
  está no título. A revisão o marcou `MANTER`; a conferência que leu o corpo o mudou para `BLOQUEAR`. O
  mesmo default estava escrito em `SPR-34`, `SPR-37` e `SPR-46`: quatro cards, uma resposta, nenhuma
  decisão.
- **O título já foi corrigido, o corpo não.** `SPR-18` e `SPR-30` tinham título afirmando a regra nova e
  descrição afirmando o mecanismo recusado. Comentário de recusa não substitui descrição: quem pega o
  card implementa o **corpo**.

Terceira face, já registrada em [[gotcha-capacidade-sem-dono-entra-pelo-titulo-do-card]]: o termo que
não existe na spec **entra** pelo título.

**Por quê:** título é resumo escrito por alguém, e resumo é a primeira coisa a divergir do que está
embaixo. O board não tem mecanismo que ligue os dois — nada compara título com descrição, e cada um
passa a própria leitura. Numa passada anterior, renomear `SPR-31`/`32`/`33` pelo resumo antes de ler o
corpo errou os três de três.

**Como aplicar:**
- Veredito de card se dá sobre o **corpo**, com os comentários, e no `Spike` também sobre "Resultados
  Esperados" (`customfield_10042`). Se você não abriu o corpo, o veredito é hipótese, e se diz isso.
- Antes de trocar título ou descrição, leia o corpo **naquela sessão**. Substituição de descrição é
  destrutiva; título e descrição não são append-only, comentário é.
- Card com título corrigido é candidato a corpo defasado, não a card resolvido: cheque o par sempre que
  o histórico mostrar correção só de um lado.

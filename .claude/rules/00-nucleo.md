# Regra Núcleo — obrigatória para TODO agent

Leia este arquivo antes de agir, sempre. Depois leia **apenas** a regra do seu papel.

## 1. Hierarquia de autoridade

Quando duas fontes discordam, vence a de cima:

1. Invariantes do `CLAUDE.md` (§7) e decisões em aberto (§8).
2. Esta regra núcleo.
3. A regra do seu papel (`.claude/rules/<papel>.md`).
4. Memória (`memory/**`) — registro mais específico vence (cliente > vertical > módulo > plataforma).
5. Código existente.
6. Sua preferência técnica. **Última.**

`CLAUDE.md` já está no seu contexto. Não releia, não cite trecho dele de volta no relatório.

## 2. Território de escrita

Você escreve **só nos paths do seu território** (`CLAUDE.md` §4). Precisa de mudança fora dele?
Não faça: declare em `PERGUNTAS` ou `BLOQUEIO` no relatório e devolva. O orquestrador despacha o
dono. Territórios existem para dois agents rodarem em paralelo sem se atropelar — furar o
território quebra o paralelismo inteiro, não só aquele arquivo.

Exceção única: **sua seção** na ficha de tarefa em `tarefas/`, que você sempre pode acrescentar.
Nunca reescreva nem apague seção de outro agent na ficha.

## 3. Decisão em aberto = BLOQUEIO

Precisa de algo que o `CLAUDE.md` §8 lista como **ABERTA** (stack, framework, auth, convenção de
PK)? **Pare.** Emita `BLOQUEIO` dizendo exatamente qual decisão falta e quais são as opções.
Escolher "só para destravar" cria fato consumado sobre decisão que é do humano — é o modo mais
comum de dívida técnica nascer neste projeto.

O mesmo vale para regra de negócio: se a regra não está em `docs/produto/**` nem na memória, ela
**não existe**. Não a invente a partir do que "todo PDV faz".

## 4. Honestidade de relatório

- Não rodou o teste? Diga "não rodei". Nunca escreva que passou.
- Não terminou? `STATUS: PARCIAL` com a lista do que falta. Entrega parcial declarada é entrega
  válida; entrega parcial silenciosa é defeito.
- Não sabe? Diga. Não preencha com plausível.
- Número (tempo, tamanho, contagem, custo de consulta) só entra no relatório se foi **medido**.
  Estimativa vai rotulada como estimativa.

## 5. Economia de contexto

O gargalo deste projeto é contexto, não velocidade de digitação.

- Leia o mínimo que responde a pergunta. Trecho, não arquivo inteiro, quando dá.
- **Nunca varre `memory/` inteiro.** Siga o caminho de `.claude/rules/memoria.md`.
- Não cole conteúdo de arquivo no relatório. Cite `path:linha`.
- Relatório é o entregável para o orquestrador, não para o humano: denso, sem preâmbulo, sem
  repetir o brief que você recebeu.

## 6. Memória é datada, não é verdade eterna

Memória reflete o que era verdade quando foi escrita. Se um registro cita arquivo, coluna, função
ou flag, **confirme que ainda existe** antes de agir. Divergiu? Reporte em `DECISÕES`/`RISCOS` para
o orquestrador corrigir o registro — você não edita `memory/**` (só o orquestrador edita).

## 7. Escopo — nem menos, nem mais

Faça o que o brief pede. Não refatore de carona, não renomeie o que já existe, não "aproveita e
arruma" arquivo vizinho, não crie abstração para uso futuro que ninguém pediu. Viu algo errado
fora do escopo? `RISCOS` no relatório. Uma linha, e segue.

## 8. Proibições absolutas

- **Segredo no repo** — chave, senha, token, URL com credencial. Nem em exemplo, nem em teste, nem
  em memória. Use placeholder e `.env.example`.
- **Git que muda estado** — `checkout -b`, `commit`, `push`, `merge`, `reset`, `clean`, `stash drop`.
  Branch e commit são decisão do humano (`git.md`). Entregar = deixar na working tree e reportar.
- **Referência a IA** em mensagem de commit, código ou doc de produto.
- **Assumir a vertical** — nada no núcleo pode conter "restaurante", "posto", "mesa" ou "bomba"
  como condição. Vertical é dado, configuração ou módulo (`CLAUDE.md` §7.3).
- **Cruzar schema de cliente** em consulta, ou construir SQL por concatenação de string.
- **Data relativa** — "ontem", "semana passada". Sempre `AAAA-MM-DD`.
- **Arquivo com mais de 400 linhas** sem justificativa explícita no relatório.

## 9. Pergunta cruzada, não adivinhação

Precisa de uma resposta que é do domínio de outro agent (o modelo de dados, a regra de negócio, o
contrato de bloco)? Não deduza do código. Emita a pergunta **dirigida ao agent dono**, no formato
de `handoff.md`. O orquestrador faz uma consulta curta e volta com a resposta. Duas trocas baratas
custam menos que uma implementação errada.

## 10. Definição de pronto

Antes de reportar `OK`, confira a §2 de `.claude/rules/processo.md` no que toca a sua camada. `OK`
com item de pronto pendente é `PARCIAL` mal reportado — e é o que faz o orquestrador propagar um
"pronto" que não existe.

## 11. Formato de entrega

Todo agent termina com o **Relatório de Handoff** de `.claude/rules/handoff.md`. Sem exceção,
inclusive quando a resposta é "nada a fazer".

## 12. Ideia mal executada não é ideia ruim

O que existe no sistema arcaico normalmente existe porque **atende uma necessidade real**, já validada
por quem opera. O defeito quase sempre está na **execução** — mecanismo, desempenho, abordagem, ou uma
boa sugestão que nunca foi aplicada no dia a dia. Raramente está na ideia.

- Antes de recusar qualquer coisa, **nomeie a necessidade** que ela atende. Só então recuse o
  mecanismo. A necessidade não se recusa.
- Recusar **mecanismo** é evolução. Recusar **capacidade** é entregar menos e chamar isso de
  modernidade: é defeito de produto disfarçado de postura.
- Trocar por **diferente** não basta. O mecanismo novo tem que ser **melhor**, e o relatório diz
  **em quê** — em que trabalho ele elimina, que erro ele torna impossível, que decisão ele informa.
- Na dúvida entre mecanismo e capacidade, trate como **capacidade**: preserve e melhore. Falha
  fechado.

**Por quê:** "isso é arcaico" é a justificativa mais fácil de escrever e a mais difícil de auditar —
ela esconde perda de funcionalidade atrás de vocabulário de modernidade. Já "a necessidade é X, o
mecanismo velho a atende assim, o nosso atende melhor porque Y" é verificável linha por linha.

**Como aplicar:** vale para spec, modelo, contrato, componente e refactor. Recusou algo? A frase tem
quatro partes obrigatórias: (1) a necessidade preservada, (2) o mecanismo recusado e por que ele é
ruim, (3) o mecanismo novo, (4) por que o novo é melhor e como se prova. Falta uma? Não é recusa
fundamentada, é preferência.

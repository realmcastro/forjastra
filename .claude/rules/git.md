# Regra — Git e entrega

Duas coisas diferentes moram aqui: **quem pode mexer no git** (§1) e **como o histórico é escrito**
(§3 a §5). A segunda parte é o padrão que o agent `commiter` executa e que o humano cobra dele.

## 1. Quem mexe no git

- **Nenhum agent cria branch, comita, pusha, mescla ou reseta** — exceto o `commiter`, e só dentro
  do que a §2 permite. Nem "só para organizar". Entregar = deixar a mudança na working tree e
  reportar.
  Por quê: orquestrador trocando branch sozinho já apagou trabalho em projeto anterior — o agent
  não enxerga que outras sessões podem estar na mesma árvore.
- **Assuma que você não está só.** Pode haver outra sessão de IA e outro dev humano na mesma
  working tree. Arquivo modificado que você não reconhece **não é erro seu** — não reverta,
  reporte em `RISCOS`.
- **Proibido para todos, inclusive o `commiter`:** `git reset --hard`, `git checkout -- .`,
  `git restore` sem path, `git clean`, `git stash drop`, `push --force`, `rebase` de história
  publicada, e tocar em branch que não é a da tarefa. Restaurar arquivo é sempre com path explícito.
- `git status`, `git log`, `git diff`, `git branch --show-current` são livres e recomendados no
  início de qualquer tarefa que edite arquivo.
- **Worktree** só se o humano pedir: ele nasce do último **commit** e ignora trabalho não
  commitado, então trabalho pendente na árvore fica invisível para o agent lá dentro.

## 2. O `commiter` — só a pedido do humano, nunca por dentro do processo

**Autorização permanente do humano, 2026-09-23:** "não precisa de PR, você pode subir diretamente no
repositório". Desde então o thread principal despacha o `commiter` quando um bloco coeso está na
árvore, e ele comita **direto em `main`** e dá `push`, sem branch de item e sem PR. Continua valendo o
resto desta seção: o `orquestrador` não põe o `commiter` em plano, os paths são nomeados no brief,
`git add -A` segue proibido, e nada de `--force`. Na tabela abaixo, commitar em `main` passou a ser
permitido e abrir PR deixou de ser o caminho.

**Antes dessa autorização,** o `commiter` era despachado exclusivamente quando o humano pedia commit,
branch ou PR, com essas palavras. Ele não é passo de tarefa, não é etapa de fechamento, não é
consequência de nada.

- **O `orquestrador` não o inclui em Plano de Despacho.** Nenhum. Plano que traz um passo de
  `commiter` está errado e o thread principal recusa o passo, não o executa.
- **A definição de pronto (`processo.md` §2) não menciona commit**, e continua sem mencionar:
  tarefa fecha com a working tree suja, e isso é o estado normal.
- **O thread principal não o chama por conta própria** ao ver trabalho pronto — nem "para
  organizar", nem "já que terminou".

Por quê: commit é o único ato desta base que sai da máquina e vira história pública. Automatizá-lo
tira do humano a última janela em que ele olha o conjunto antes de ele virar permanente — e ninguém
revisa com a mesma atenção o que já foi commitado. O custo de esperar o pedido é uma frase; o custo
de commitar cedo é reescrever história ou conviver com ela.

| Pode | Não pode |
|---|---|
| criar branch a partir da atual | commitar direto em `main` |
| `git add` de path nomeado no brief | `git add -A` / `git add .` |
| commitar, pushar a branch dele | forçar push, mexer em branch alheia |
| abrir PR com `gh` | mesclar o PR, aprovar, fechar |
| ler `status`, `log`, `diff` | reverter trabalho que não reconhece |

Mesclar é do humano. O `commiter` entrega o PR aberto e o link, e para.

**Escopo é declarado, nunca inferido.** O brief diz quais paths entram. Arquivo modificado que o
brief não lista fica de fora e é reportado — não entra "porque estava sujo na árvore". É a mesma
razão do território de escrita: numa árvore compartilhada, `git add -A` varre o trabalho de outra
sessão para dentro de um commit que não o descreve.

## 3. Branch

```
f-<nnn>-<slug-curto>
```

`f-001-fundacao-do-banco` · `spr-40-tipo-do-dinheiro` (item migrado mantém o prefixo `spr-`;
`spr-54-aplicar-revisao-do-backlog` é do mesmo tempo e continua válido no histórico)

- **O identificador do item é a âncora**, não o id da ficha: toda tarefa tem item (`backlog.md` §2),
  e nem toda tem ficha (`processo.md` §5). Branch ancorada no que às vezes não existe nomeia mal
  metade das vezes.
- Minúsculo, hífen, sem acento. Slug curto: o nome completo já está no item.
- Uma branch por item. Dois itens na mesma branch é sinal de recorte errado — quebre a branch.
- Nasce da `main` atualizada, salvo instrução contrária no brief.

## 4. Commit

```
<assunto imperativo, pt-BR, ≤ 72 caracteres, sem ponto final>

<por que a mudança existe, não o que ela faz — o diff já diz o quê.
Quebre em ~72 colunas. Bullets quando forem mais de três pontos.>

Ref: F-<nnn> · tarefas/T-<id>-<slug>.md
```

- **Assunto no imperativo:** "Aplicar", "Corrigir", "Estabelecer" — nunca "Aplicado", "Aplicando",
  `feat:`, `chore:`. O repo não usa Conventional Commits e não passa a usar sem decisão registrada.
- **O corpo responde "por quê", não "o quê".** Quem lê um commit em seis meses tem o diff à mão e
  não tem o motivo.
- **Rodapé `Ref:`** com o identificador do item (`docs/backlog/`) e o path da ficha, quando
  existirem. É ele que liga o histórico ao pedido e ao raciocínio. Sem ficha, só o identificador.
- **Nenhuma referência a IA**, em nenhum campo — `00-nucleo.md` §8. Inclui rodapé de co-autoria e
  menção a ferramenta. Vale mesmo quando o padrão da ferramenta pede o contrário.
- **Um commit, um significado.** Regra nova e aplicação da regra são dois commits, mesmo na mesma
  branch: quem revisa precisa ver a regra antes do efeito dela.
- Exemplar no histórico: `1ca6f92`.

## 5. Pull request

O remote é GitHub (`realmcastro/forjastra`) — o artefato chama **PR**. Abra com `gh pr create`.

**Título:** o mesmo do assunto do commit, ou o título do item quando a branch tem vários commits.

**Corpo**, nesta ordem; seção que não se aplica é omitida:

```markdown
## O que muda
<um parágrafo>

## Por quê
<o motivo, e o que estava errado antes>

## Como revisar
<por onde começar e o que olhar primeiro — commit a commit quando forem vários>

## Fica de fora
<o que este PR deliberadamente não resolve, e de quem é>

## Ref
F-<nnn> · tarefas/T-<id>-<slug>.md
```

- **Sem captura de tela, sem checklist decorativo, sem template preenchido pela metade.**
- **`Fica de fora` é obrigatória** em PR não trivial, pela mesma razão do item (`backlog.md` §8): é
  a seção que impede o PR de crescer durante a revisão.
- **Nada de segredo e nada de dado real de cliente.** O PR sai do repositório e é lido por quem não
  clonou (`backlog.md` §9): conteúdo de `memory/**` e de `docs/auditorias/**` vai por `path:linha`,
  nunca colado.
- **Mesclar PR não fecha item.** Quem fecha a ficha e o item é o `orquestrador`, depois da definição
  de pronto (`processo.md` §2), e nenhuma palavra-chave de fechamento (`Closes`, `Fixes`) faz isso
  por ele — não use.

# Regra — Git e entrega

- **Nenhum agent cria branch, comita, pusha, mescla ou reseta.** Nem "só para organizar".
  Entregar = deixar a mudança na working tree e reportar. Branch e commit são do humano.
  Por quê: orquestrador trocando branch sozinho já apagou trabalho em projeto anterior — o agent
  não enxerga que outras sessões podem estar na mesma árvore.
- **Assuma que você não está só.** Pode haver outra sessão de IA e outro dev humano na mesma
  working tree. Arquivo modificado que você não reconhece **não é erro seu** — não reverta,
  reporte em `RISCOS`.
- **Proibido** `git reset --hard`, `git checkout -- .`, `git clean`, `git stash drop`. Sempre.
- `git status`, `git log`, `git diff`, `git branch --show-current` são livres e recomendados no
  início de qualquer tarefa que edite arquivo.
- **Worktree** só se o humano pedir: ele nasce do último **commit** e ignora trabalho não
  commitado, então trabalho pendente na árvore fica invisível para o agent lá dentro.
- Mensagem de commit (quando o humano pedir que você a **redija**, não que a aplique): pt-BR,
  imperativo, sem qualquer referência a IA.

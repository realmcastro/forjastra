---
name: convention-precondicao-de-ato-humano-se-confere-na-borda
description: o que outro ato humano deixou pronto se confere antes da primeira escrita, e a recusa nomeia **o ato que falta**, nunca o objeto que o servidor não achou — três ocorrências na mesma tarefa, e nas três a alternativa era falhar no meio mandando investigar a coisa errada
type: convention
escopo: plataforma
camada: dados
data: 2026-09-11
relaciona: [[convention-ato-de-privilegio-e-passo-do-comando-que-provisiona]], [[convention-o-que-o-banco-impoe-vence-o-que-alguem-lembra]]
tarefa: T-0009
---

Todo processo que depende de algo que **outra pessoa** deixou pronto confere essa precondição **na
borda**, antes da primeira escrita. E a mensagem de recusa nomeia **o ato que falta**, não o objeto
que o servidor não encontrou.

**Três ocorrências, na mesma tarefa, e o padrão só ficou visível na terceira:**

1. **Piso de versão do servidor.** Sem a conferência, o executor aplicava a stream inteira num
   servidor velho e a primeira migration com view falhava com `unrecognized parameter
   "security_invoker"` — que manda investigar a **migration**, quando o problema é o servidor.
   Medido: a frota ficava parcialmente aplicada.
2. **`lock_timeout`.** O executor recusa iniciar sem valor configurado, em vez de inventar um.
3. **Grupo de papéis criado pelo operador.** Sem a conferência, o ato morre no último passo com
   `role "forja_app" does not exist`, deixando cliente registrado e aplicado **sem papel**.

**Por quê a mensagem importa tanto quanto a conferência:** o erro do servidor descreve o **sintoma**
no vocabulário do banco. Quem lê não sabe que existe um ato de operador que ninguém rodou — vai
procurar o objeto, não achar, e concluir que o sistema está quebrado. A recusa que diz "o ato X não
foi executado" transforma meia hora de investigação em uma linha.

**Uma consequência que não é óbvia, e foi medida:** conferir na borda também evita **diagnóstico
falso em massa**. Sem o grupo, a verificação de papéis acusaria divergência em **todos** os clientes,
porque a consulta compara contra um papel que não existe — N alarmes mandando investigar quem
adulterou papéis que ninguém tocou, com a causa verdadeira em lugar nenhum.

**Como aplicar:** liste as precondições de ato humano do seu processo e confira **todas** na mesma
passada. Conferir uma e deixar a irmã reproduz o mesmo defeito com outro nome, pela mesma consulta.
E **não crie a precondição para se destravar**: criar o grupo vazio faria a operação achar que o ato
do operador rodou, com o que ele tinha de revogar ainda por revogar.

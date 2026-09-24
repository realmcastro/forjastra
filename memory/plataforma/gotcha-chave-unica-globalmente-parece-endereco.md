---
name: gotcha-chave-unica-globalmente-parece-endereco
description: chave `uuid` é única em todo lugar, e por isso convida a resolver objeto só pela chave, sem escopo — que é exatamente o que RN-NUC-038 proíbe; a unicidade impede colisão, nunca autoriza acesso
type: gotcha
escopo: plataforma
camada: seguranca
data: 2026-09-11
relaciona: [[decision-d-04-chave-timestamps-exclusao]], [[decision-tenancy-schema-por-cliente]]
tarefa: T-0009
---

**Sintoma:** uma consulta que busca por id e funciona em todos os testes, porque em ambiente de
desenvolvimento existe um cliente só.

Com chave sequencial por tabela, `id = 42` obviamente não identifica nada sozinho, e ninguém escreve
código que finja o contrário. Com `uuid`, `id = <uuid>` **parece** suficiente: a chave é única no
universo, então buscar por ela "não pode" trazer a linha errada. A inferência está certa sobre
colisão e errada sobre autorização.

**Por quê é grave aqui:** o isolamento deste sistema é por schema, e a resolução escopada é o que
garante que a consulta nem alcance o dado de outro cliente. Um caminho que resolve pela chave e
confere o tenant **depois** já leu o que não devia, e `seguranca.md` §1 item 4 trata exatamente isso
(IDOR) como onde o isolamento multi-tenant cai de verdade, depois que o schema já está correto.

`RN-NUC-038` já proíbe: resolução é escopada **antes**, nunca conferida depois. `D-04` escolheu `uuid`
sabendo que ele produz a ilusão contrária, e por isso a proibição entrou como consequência escrita da
decisão, não como lembrete.

**Como aplicar:** toda função de leitura recebe o contexto de tenant e o usa na consulta, não na
conferência do resultado. Assinatura que aceita só o id é o defeito, antes mesmo de ter corpo.

# Memória — Processo (como trabalhamos com IA e ferramenta)

## Convenções

- [CLAUDE.md é só panorama, com teto duro](convention-claude-md-e-so-panorama.md) — regra detalhada mora em `.claude/rules/`, lida sob demanda; arquivo sempre-carregado tem custo por mensagem · camada:processo

- [Corrigir dentro da linha quando o arquivo está no teto](convention-corrigir-dentro-da-linha-quando-o-arquivo-esta-no-teto.md) — arquivo em 400 citado por `path:linha` de território alheio não se parte: partir cria referência pendurada que o dono não pode consertar · camada:processo

- [Bloqueio nomeia o default silencioso](convention-bloqueio-nomeia-o-default-silencioso.md) — "falta decidir" não move ninguém; o bloqueio diz a pergunta, quem responde, a data em que morde e o que passa a valer se ninguém falar · camada:processo

- [Escrita em registro append-only](convention-escrita-em-registro-append-only.md) — a ordem de publicação é conteúdo (não cite fato que ainda não existe), e substituição destrutiva vem depois do comentário de preservação com quatro partes, a quarta sendo o destino de cada critério que sai · camada:processo

- [Prazo é o ideal mais 30%](convention-prazo-e-ideal-mais-trinta-por-cento.md) — data limite no Jira = `ceil(ideal × 1,3)` em dias úteis, encadeado por pessoa; folga mora no prazo · camada:processo

## Armadilhas

- [Endereço de relatório envelhece na própria sessão](gotcha-endereco-de-relatorio-envelhece-na-propria-sessao.md) — endereço errado com substância certa (2026-08-23) e endereço certo com substância **morta**, publicada como afirmação falsa em comentário append-only (2026-08-26); confira a substância, e confira a lista de pendências **contra o alvo** · camada:processo

- [O título não é o card](gotcha-o-titulo-nao-e-o-card.md) — revisar backlog por título erra nos dois sentidos: o corpo de `SPR-36` decidia uma lacuna do humano com o título limpo, e `SPR-18`/`SPR-30` tinham título já corrigido sobre corpo contradizendo-o · camada:processo

## Decisões

_(decisão sobre processo que vale para a plataforma inteira mora em `plataforma/`; aqui só o que é sobre ferramenta/fluxo)_

- [Jira é o registro público da tarefa](decision-jira-e-o-registro-publico-da-tarefa.md) — issue antes do plano, ficha segue `T-000n` com campo `jira:`, espelhamento verbatim e append-only; agent especialista não toca no Jira, e isso é de propósito · camada:processo

- [Produto é o dono do backlog no Jira](decision-produto-e-o-dono-do-backlog-no-jira.md) — dono do conteúdo de backlog; **mecanismo não subiu na sessão em que foi declarado — teste antes de despachar** · camada:processo
- [Commit é ato do humano, não do processo](decision-commit-e-ato-do-humano-nao-do-processo.md) — o agent `commiter` tem o padrão de branch/commit/PR, mas só roda a pedido do humano: nunca em plano, nunca no fechamento · camada:processo

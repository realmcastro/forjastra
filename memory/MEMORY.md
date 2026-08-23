# Memória da Forja — roteador (nível 0)

Este arquivo entra no contexto automaticamente. Ele **só roteia**. Nunca coloque fato aqui.

Protocolo completo: `.claude/rules/memoria.md`. O resumo: leia `plataforma/INDEX.md` sempre, mais o
`INDEX.md` do **escopo da sua tarefa** — e nada além. Registro individual só pelo gancho do índice.

| Área | Índice | O que tem lá |
|---|---|---|
| Plataforma | [plataforma/INDEX.md](plataforma/INDEX.md) | núcleo, tenancy, SDUI, agents, migrations — vale para todo cliente |
| Módulos | [modulos/INDEX.md](modulos/INDEX.md) | regra por módulo, agnóstica de cliente |
| Verticais | [verticais/INDEX.md](verticais/INDEX.md) | conhecimento por ramo (restaurante, posto, varejo) |
| Clientes | [clientes/INDEX.md](clientes/INDEX.md) | específico de um cliente, e do cliente dentro de um módulo |
| Processo | [processo/INDEX.md](processo/INDEX.md) | como trabalhamos com IA e ferramenta |

**Precedência quando dois registros conflitam:** cliente > vertical > módulo > plataforma.

Trabalhando em vendas do cliente A? A regra de vendas do cliente B **não existe** para você. É o
ponto do grafo: não carregar contexto que não é da tarefa.

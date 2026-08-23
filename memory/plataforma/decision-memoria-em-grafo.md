---
name: decision-memoria-em-grafo
description: A memória é um grafo por escopo (plataforma / módulos / verticais / clientes / processo) com precedência do mais específico, e a leitura é seletiva por escopo da tarefa — o mecanismo existe para não carregar contexto irrelevante, não para organizar bonito.
type: decision
escopo: plataforma
camada: processo
data: 2026-08-22
relaciona: [[decision-arquitetura-de-agents]], [[reference-projeto-belasvue]]
---

O esquema de 3 níveis do projeto anterior (`MEMORY.md` → `INDEX-*` → registro) funcionou e foi
mantido, mas passou a ser **por escopo em subpastas**, não por fase do projeto:
`plataforma/`, `modulos/<modulo>/`, `verticais/<ramo>/`, `clientes/<cliente>/modulos/<modulo>/`,
`processo/`. Precedência: cliente > vertical > módulo > plataforma. Regra: `.claude/rules/memoria.md`.

**Por quê:** com N clientes e N módulos, índice por fase vira um arquivo gigante onde tudo é
relevante para todo mundo — ou seja, contexto queimado. Índice por escopo permite a pergunta que
importa: *"regra de vendas **deste** cliente"* sem abrir a regra de vendas dos outros. No projeto
anterior a memória chegou a 281 registros em uma pasta plana; ainda funcionava, mas só porque havia
um produto só.

**Como aplicar:** escolha o lugar pelo teste de generalidade de `memoria.md` §1 (o mais geral que
ainda é verdade). Registro específico que contradiz um geral **declara** `supera: [[slug]]`. Só o
orquestrador escreve em `memory/`; os outros agents sugerem pelo campo `MEMÓRIA SUGERIDA`. `description`
é o campo mais lido do arquivo: escreva a conclusão nela, não o assunto.

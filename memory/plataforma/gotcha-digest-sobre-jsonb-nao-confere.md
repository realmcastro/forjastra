---
name: gotcha-digest-sobre-jsonb-nao-confere
description: jsonb reordena chaves e normaliza espaço, então um digest calculado sobre o texto publicado não confere com o que volta do banco; conteúdo com digest vai em text canônico
type: gotcha
escopo: plataforma
camada: dados
data: 2026-09-23
relaciona: [[decision-d-05-autoridade-no-platform-projecao-no-cliente]]
tarefa: T-0020
---

Pela documentação do PostgreSQL (não medido nesta base): `jsonb` guarda a forma decomposta, sem ordem de
chave nem espaço original. Quem publica com digest e guarda em `jsonb` recebe de volta outro texto.

**Como aplicar:** conteúdo publicado com digest é `text` em forma canônica. A restrição sobre o conteúdo
fica na autoridade, e a projeção restringe identidade (FK) e integridade (digest).

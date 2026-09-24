---
name: gotcha-has-schema-privilege-nao-ve-set-role
description: com NOINHERIT, has_schema_privilege responde f para privilégio alcançável só por SET ROLE; alcance ao platform por papel assumível se pergunta por pg_auth_members / pg_has_role(..., 'SET'), não por has_schema_privilege do sujeito
type: gotcha
escopo: plataforma
camada: seguranca
data: 2026-09-23
relaciona: [[convention-alcance-de-schema-e-privilegio-nao-escolha]]
tarefa: T-0019
---

Medido pelo F.2 de `T-0019`: uma credencial `NOINHERIT` membro de um papel com `USAGE` em `platform`
responde `f` a `has_schema_privilege(credencial, 'platform', 'USAGE')` e alcança o schema com
`SET ROLE`. O ponto cego vale também para `GRANT forja_executor TO app_t_X` (`TRL-04`).

**Como aplicar:** a pergunta de alcance cobre o sujeito **e** cada papel que ele pode assumir
(`pg_has_role(sujeito, papel, 'SET')`), como a matriz da subida de `apps/api` já faz para os papéis
assumidos.

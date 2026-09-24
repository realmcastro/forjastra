# SPR-14 — Modelar as entidades de atendimento como tabelas do módulo, sem tocar o núcleo

**Tipo:** História · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-10-23
**Agrupador:** SPR-5

---

## Objetivo

Estabelecer as tabelas de comanda, mesa e nome de exibição do cliente-final como módulo `MSA` (mesa-comanda), com identidade técnica independente do identificador operacional.

## Escopo

* **Comanda:** registro único por serviço, com identidade técnica estável que não depende de número de mesa nem de nome do cliente-final
* **Mesa:** número operacional ("Mesa 10") ligado à comanda, sem ser ela própria
* **Nome de exibição do cliente-final:** atributo de apresentação conforme `RN-MSA-014` (`docs/produto/modulos/mesa-comanda.md:270`), sem histórico e sem cruzamento por nome
* **Relacionamentos:** vínculo explícito entre as três

## Critério de aceite

1. Comanda pode ser criada e identificada sem número de mesa ou nome de cliente atribuídos.
2. Duas comandas com o mesmo número de mesa (em serviços diferentes ou turnos diferentes) são registros distintos com ids diferentes.
3. Histórico de uma venda liga-se à comanda por id técnico, não por número operacional — se o número se repete, a trilha não confunde os registros.
4. Eliminar uma comanda por engano (exclusão lógica) não afeta as vendas já registradas nela.

## Depende de

SPR-39 (chave primária, timestamps, exclusão lógica) — nenhuma tabela nasce antes dele.

## Fora de escopo

Alterar tabela do núcleo para acomodar este módulo. Se faltar campo no núcleo, ou é do núcleo e vale para todo ramo, ou vira tabela de extensão do módulo.

## Gate obrigatório

Segurança (isolamento de tenant).

## Referências

`.claude/rules/dados.md` · `docs/produto/modulos/mesa-comanda.md`

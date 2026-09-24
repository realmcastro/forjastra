# F-026 — O pedido que o acompanhante recusa à página passa a produzir fato

**Tipo:** Comportamento fechado · **Estado:** a fazer, **não executável** antes de existir contrato do
canal local · **Dono:** `produto` (o fato) · **Território:** `docs/produto/**` · **Cobre o achado**
`2.19` de `docs/produto/captura-varredura-sem-rn-2026-09-23.md` · **Agrupador:** F-001 · **Rótulo:**
captura

## Objetivo

No arranjo `D` (`memory/plataforma/decision-d-02-arranjo-d.md`), o acompanhante nativo guarda fila,
faixa e capacidade de assinar, e a página fala com ele por um canal local. O dossiê que levou à decisão
já diz que ele recusa coisas: "o que ele nunca aceita da página" (`docs/arquitetura/d-01-d-02-stack-opcoes.md:252`),
e chama o canal de o caminho mais curto para alguém fora da aplicação alcançar a fila (`:347-349`).
Nenhum texto diz que a recusa deixa rastro.

```
página → pedido pelo canal local → acompanhante
                                   → aceita  → fato da operação (já previsto)
                                   → recusa  → [nada]   ← este item
```

## Escopo

- Fato de recusa no canal local, com a causa: página não autenticada ao acompanhante, pedido fora do
  contrato, pedido que o contrato proíbe.
- A casa do fato: ele nasce no terminal, antes de qualquer servidor, então segue a mesma disciplina de
  fato local de `RN-NUC-046` (cede antes da venda, descarte contado).

## Fora de escopo

- O contrato do canal (quem fala, como a página se autentica, o que é aceito). Não existe item para ele
  e o acompanhante não aparece como território em `CLAUDE.md` §4; essa é a pergunta que destrava este
  item.
- Qualquer recusa da página ao usuário: `F-022`, `F-023`.

## Critério de aceite

Escrito quando o contrato existir. O caso que ele precisa cobrir, desde já: um processo local que não é a
página pede ao acompanhante o conteúdo da fila; o acompanhante recusa, nada da fila sai, e existe fato
da recusa que sobrevive ao aperto de recurso local e sobe na próxima conexão.

## Registra / Não registra

**Registra:** a causa da recusa, o que foi pedido pelo nome da operação, o instante.
**Não registra:** o conteúdo do pedido, porque pode carregar exatamente o que a custódia protege
(`RN-OFF-021`, `RN-OFF-023`).

## Depende de

Contrato do canal local, sem item e sem dono. Pergunta ao humano, no relatório de `T-0017`: quem é dono
do acompanhante e do contrato do canal?

## Gate obrigatório

`seguranca`: o canal local é superfície com gate próprio (`.claude/rules/ui.md:11-13`).

## Referências

`docs/produto/captura-varredura-sem-rn-2026-09-23.md` §2.19 · `docs/arquitetura/d-01-d-02-stack-opcoes.md:252`,
`:347-349` · `.claude/rules/ui.md:6-13` · `F-017:59-60` ·
`docs/produto/fatos-de-operacao-retencao-e-descarte.md:32-41`

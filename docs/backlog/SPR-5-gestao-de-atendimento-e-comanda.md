# SPR-5 — Gestão de Atendimento e Comanda

**Tipo:** Epic · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-11-13

---

## O quê

Permitir que o garçom inicie, consulte e gerencie comandas durante o atendimento presencial, possibilitando múltiplas comandas por mesa e atuação de diferentes garçons sobre uma mesma comanda.

## Onde

Módulo `MSA` (mesa-comanda) — `docs/produto/modulos/mesa-comanda.md`.

## Por quê

Sem comanda, um grupo à mesa não tem como registrar consumo próprio nem separar a conta de outro grupo na mesma mesa — o atendimento presencial depende disso para não misturar pedido e cobrança de mesas diferentes.

## O que precisa estar pronto antes

`SPR-39` (convenção de chave, timestamps e exclusão lógica) e `SPR-40` (tipo, unidade e escala de dinheiro e quantidade) fecham antes de qualquer tabela desta Epic, inclusive as de módulo. Todo card filho cita `RN-MSA-nnn`; não reenuncia a regra — prosa duplicada é onde a autoridade se perde.

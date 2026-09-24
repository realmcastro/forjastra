---
name: decision-habilitacao-e-sequencia-de-fatos-por-terminal
description: o vínculo terminal→estabelecimento mora na habilitação, não na identidade do terminal; a habilitação é uma sequência de fatos por terminal amarrada por FK composta ao anterior mais CHECK de transição, e o banco torna impossível duas vigentes, reabilitar comprometido e revogar por encerramento de outra unidade; 23505 na sequência é disputa legítima
type: decision
escopo: plataforma
camada: dados
data: 2026-09-23
relaciona: [[decision-d-03-opcao-c-sujeito-local-ao-cliente]], [[gotcha-portador-de-terminal-revinculado-leva-a-fila-para-outro-cliente]], [[gotcha-23505-sem-read-back-acusa-reenvio-legitimo]]
tarefa: T-0022
---

`db/migrations/tenant/0006__terminals_and_sales_enablement.sql`. As espécies são `enablement`, `renewal`,
`decommission`, `closure_revocation` e `compromise`. Cada fato aponta para o anterior por FK composta (espécie,
instante, período), e um CHECK diz o que pode vir depois de quê. O terminal nasce com a primeira habilitação
(FK adiada), por isso não tem timestamps próprios: exceção a `D-04`, declarada.

**Por quê:** é `IDN-01` por construção. O cliente de um fato é o da habilitação sob a qual ele nasceu, e o
banco recusa a revinculação sem gatilho nem lock.

**Como aplicar:** quem grava renovação ou revogação trata `23505` na sequência lendo de volta o fato
gravado. O que o banco não garante (o encerramento revogar todos os terminais, as precondições de habilitar,
aparelho sem fila de outro cliente) é do backend.

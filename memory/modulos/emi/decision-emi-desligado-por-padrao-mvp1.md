---
name: decision-emi-desligado-por-padrao-mvp1
description: MVP 1 liga FIS e deixa EMI desligado por padrão para o perfil-alvo inicial (interior); ativação de EMI é config por cliente/tenant, sem migração destrutiva, condicionada às três reservas de modelo (numeração, congelamento/grão, âncora documental) estarem na Fase 1
type: decision
escopo: modulo:emi
camada: produto
data: 2026-08-24
relaciona: [[decision-emissao-fiscal-propria]], [[decision-d-05-catalogo-de-regra-fiscal-sem-casa]]
tarefa: T-0005
---

Decisão do humano (Opção B, T-0005, 2026-08-24), registrada em
`docs/produto/roadmap-de-modulos.md` §5.3/§5.4. `FIS` entra ativo no MVP 1 independentemente do
estado de `EMI` (compõe o tributo certo por item/venda). `EMI` **não é piso do MVP 1**: é módulo
plugável, desligado por padrão para o perfil-alvo inicial (interior). Ativar `EMI` é **config por
cliente/tenant**, não característica do MVP inteiro — outro cliente com outro perfil pode ligá-lo
depois, sem migração destrutiva, **desde que** as três reservas de modelo do roadmap §5.3 (numeração
como mecanismo de alocação por estabelecimento+série; congelamento por grão
`item × tributo × base × regime × redutor`; âncora da obrigação documental no fato de venda) estejam
na Fase 1 mesmo com `EMI` desligado.

**Por quê:** o eixo resolvido é só "quando/para quem `EMI` liga". A decisão **não** substitui `D-05`
(catálogo de regra fiscal sem casa, [[decision-d-05-catalogo-de-regra-fiscal-sem-casa]]) — `D-05`
segue travando a modelagem de `FIS` independentemente do estado de `EMI`. E ela **não** contradiz
[[decision-emissao-fiscal-propria]] — quando `EMI` estiver ligado (para o perfil-alvo inicial ou para
outro cliente), o mecanismo de emissão continua sendo próprio, nunca PAA. Não é derivável só do
invariante 2 do `CLAUDE.md` (que garante que todo módulo é plugável, mas não que `EMI`
especificamente nasce desligado para este perfil neste MVP): é decisão de escopo do humano.

**Como aplicar:** quem provisiona um cliente novo do perfil-alvo inicial deixa `EMI` fora do conjunto
de módulos ativos. Quem modela a Fase 1 do núcleo fiscal entrega as três reservas de §5.3
independentemente do estado de `EMI` — elas não são trabalho condicional a `EMI` estar ligado.

# F-022 — A composição de tela degradada pelo terminal passa a produzir fato, e não só no id desconhecido

**Tipo:** Comportamento fechado · **Estado:** **absorvido em `F-012` em 2026-09-23**, sem execução
própria · **Dono:** `produto` · **Território:** `docs/produto/**` · **Cobre o achado** `2.15` de
`docs/produto/captura-varredura-sem-rn-2026-09-23.md` · **Agrupador:** F-001 · **Rótulo:** captura

> **Absorvido em [`F-012`](F-012-no-de-manifesto-descartado-vira-fato.md) em 2026-09-23.** Quem pegar
> este trabalho pega `F-012`: escopo, aceites e listas deste item estão lá, marcados "(de `F-022`)", e
> a seção "Alterações — 2026-09-23" de `F-012` diz o que entrou e por quê. A justificativa nas quatro partes está em `docs/produto/backlog-recortes.md` (entrada
> `F-022`), e a autorização em `tarefas/T-0017-varrer-escopo-sem-rn.md`, seção "thread — 2026-09-23
> (conferência por conjunto e respostas)". O texto abaixo é o original, preservado, e não recebe mais
> edição.

> **Recorte recomendado: fundir em `F-012` antes de qualquer um dos dois ganhar ficha.** Regra dona,
> fato, grão e gate são os mesmos; separados, produzem duas decisões de grão sobre a mesma série. Não foi
> fundido porque a passada que o criou (`T-0017`) só escrevia de `F-022` em diante. Quem fundir registra
> a fusão nos dois itens, com esta nota como prova.

## Objetivo

Todo desfecho em que o terminal serve menos do que o manifesto pediu passa a deixar fato. `F-012` cobre
um caso: o id desconhecido (`F-012:28`). O terminal degrada por mais cinco caminhos, todos decididos
em regra e nenhum com rastro:

```
manifesto chega
→ resposta inaproveitável?          sim → não é cacheada, cai no cache ou no piso   (tolerancia-de-versao.md:67-69)
→ nó com forma inválida?            sim → descartado, irmãos sobrevivem              (:24-26, ui.md:17-18)
→ estado desconhecido no nó?        sim → descartado                                (estados-e-interacao.md:58-60)
→ id desconhecido?                  sim → descartado; slot fixo mostra fallback      (F-012 cobre este)
→ bloco fora da faixa de densidade? sim → descartado; na zona crítica, piso do papel (grade-e-espacos.md:271-277)
→ tela sem nó válido?               sim → piso embutido                             (tolerancia-de-versao.md:26)
```

E, quando o id desconhecido cai na zona de ação crítica, **a ação não acontece naquele terminal**
(`.claude/rules/ui.md:113-116`, `tolerancia-de-versao.md:57-61`). O fato de `F-012` registra id,
terminal, versão e instante; não diz se o slot era de ação crítica. "O caixa 3 não tem o botão de
cobrança" e "o caixa 3 não tem um enfeite" ficam iguais.

## Escopo

- Fato de degradação para as cinco causas acima, cada uma distinguível das outras.
- O degrau da escada que o terminal está servindo (rede, cache local, piso embutido), com o instante de
  entrada e de saída de cada degrau.
- A criticidade do slot no fato de descarte, inclusive no de `F-012`: a criticidade já é recebida do
  servidor (`vocabulario-e-eixos.md` §2.1, tabela "quem sabe o quê").
- A regra dona, na mesma passada da de `F-012`, citando `PN-12` e `CLAUDE.md` §7.5.

## Fora de escopo

- Mudar qualquer desfecho de degradação. O nó continua descartado, o piso continua servindo, a tela
  continua abrindo.
- Transbordo (`grade-e-espacos.md:282-285`): remove slot declarado descartável por contrato, decidido
  antes; não é o terminal decidindo diante do que não entende.
- Alerta, painel ou política de estreia (`V-04`, `vocabulario-e-eixos.md:391`).
- Onde o fato repousa e por quanto tempo: `D-06`, `LACUNA-NUC-040`, `arquiteto-dados`.

## Critério de aceite

1. Manifesto com um nó de forma inválida, um com estado desconhecido e um bloco conhecido fora da faixa
   em `zone.flow`: a tela abre com os irmãos, e existem três fatos, cada um com a causa própria.
2. Bloco conhecido fora da faixa na zona de ação crítica: a ação aparece no piso do papel, e existe fato
   dizendo que o piso foi usado e para qual bloco.
3. Id desconhecido na zona de ação crítica: o slot mostra `block.fallback`, e o fato diz que o slot era
   de ação crítica. Ler, numa janela, os descartes em zona crítica devolve quais terminais estão sem qual
   ação.
4. Resposta de manifesto inaproveitável: o terminal segue no cache, e existe fato de que a resposta
   chegou e foi recusada.
5. Terminal que opera duas horas no piso embutido e volta à rede deixa entrada e saída do degrau, com os
   dois instantes. Terminal que nunca saiu da rede não produz fato de degrau.
6. Falha ao registrar qualquer um desses não muda o desfecho da tela nem da venda (`CLAUDE.md` §7.10).

## Registra / Não registra

**Registra:** a causa da degradação; o id ou o papel afetado; a criticidade do slot; terminal, versão do
cliente e instante; entrada e saída de degrau da escada.

**Não registra, e por quê:**

- O conteúdo do manifesto ou do nó: mesmo motivo de `F-012` (`RN-PRV-011`).
- O operador: a pergunta é sobre parque e composição, nunca sobre pessoa.
- A resposta inaproveitável em si: guardar composição de tela recusada seria acervo nosso de dado do
  cliente. A causa da recusa basta para a decisão.

## Depende de

A decisão de grão de `F-012` (ocorrência ou contagem). Por isso a fusão. Sem fusão, este item espera
`F-012` fixar o grão e herda a mesma forma. `D-02` fechou (arranjo `D`): quem degrada é a interface em
navegador, e o mecanismo existe em `packages/sdui/src/manifest/` (`tolerancia-de-versao.md:15-18`). Se o
código já registra algo, `ui` diz onde, e a resposta entra aqui antes de a regra ser escrita.

## Gate obrigatório

`produto` (fronteira: fato de provedor, nunca de venda), e `performance`: registrar no caminho de render
não pode disputar o orçamento de abrir tela nem o de adicionar item (`.claude/rules/performance.md:23-33`).

## Referências

`docs/produto/captura-varredura-sem-rn-2026-09-23.md` §2.15 · `F-012` ·
`docs/design/tolerancia-de-versao.md:24-26`, `:50-61`, `:67-69` · `docs/design/estados-e-interacao.md:58-60` ·
`docs/design/grade-e-espacos.md:271-277` · `docs/design/vocabulario-e-eixos.md` §2.1, `:250-251`, `:330` ·
`.claude/rules/ui.md:17-21`, `:113-116` · `CLAUDE.md` §7.5, §7.10

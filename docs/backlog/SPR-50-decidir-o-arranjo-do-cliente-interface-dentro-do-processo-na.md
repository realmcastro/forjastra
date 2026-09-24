# SPR-50 — Decidir o arranjo do cliente: interface dentro do processo nativo, ou navegador com acompanhante

**Tipo:** Spike · **Estado ao migrar:** Concluído · **Prazo que constava:** 2026-09-14
**Agrupador:** SPR-35

---

## Objetivo

Consumir a evidência medida das duas issues de validação desta Epic (`SPR-42`, `SPR-43`) e fechar `D-02`: o arranjo do cliente é dentro do processo nativo (arranjo B) ou navegador com acompanhante nativo (arranjo D). Sem dono de propósito — pega quem estiver livre quando as duas evidências fecharem.

## Escopo

**A decisão.** A interface do terminal roda dentro do processo nativo, ou dentro de um navegador conversando com um processo nativo acompanhante?

**O que pesa de cada lado, já levantado pelas duas Spikes:**

* A favor do processo nativo: o alvo mais exigente (estação Windows offline com custódia) não tem fronteira de processo entre interface e custódia — uma superfície de ataque e um ponto de falha a menos. Risco: o código-base vira três na prática se a camada de capacidade for condicional espalhada em vez de contrato.
* A favor do navegador com acompanhante: um vocabulário de blocos e uma implementação só para os quatro espaços, com o nativo reduzido a um acompanhante escrito na linguagem já fechada. Risco: a fronteira local entre página e acompanhante é superfície nova, e exige gate de segurança antes de qualquer construção.

**O que a decisão libera, e o que ela não muda.** Libera código de produto de cliente — nenhum sai antes desta decisão fechar. Não muda a tolerância de versão: o servidor nunca supõe que o cliente é da última versão, e o cliente descarta id desconhecido sem derrubar tela, nos dois arranjos.

## Fora de escopo

Refazer a validação técnica — já é `SPR-42` e `SPR-43`. Um terceiro arranjo (clientes separados por alvo) não é opção desta decisão: é o desfecho de não decidir, e custa três implementações das mesmas regras de convergência — citado aqui só para não ser escolhido por omissão.

## Critério de aceite

O arranjo (B ou D) está escolhido, registrado como `decision` em memória (`memory/plataforma/`) com o motivo e o que foi recusado, e a linha `D-02` do `CLAUDE.md` §8 vira `FECHADA → [[slug]]`. Nenhuma issue de código de produto de cliente é despachada antes deste critério estar cumprido.

## Depende de

As duas issues de validação desta Epic (`SPR-42`, superfície sem custódia; `SPR-43`, superfície com custódia). Esta issue não começa antes das duas fecharem, e não substitui nenhuma delas.

## Referências

`docs/arquitetura/d-01-d-02-stack-opcoes.md` §3.3, §3.4, §4, §5 · `memory/plataforma/state-d-02-arranjo-b-ou-d.md` · `CLAUDE.md` §8 (D-02)

## Resultados esperados

Uma decisao escrita, assinada pelo humano, dizendo qual arranjo o cliente adota, e a decisao registrada no repositorio como decision, com a linha de D-02 na tabela de decisoes em aberto virando FECHADA.A decisao cita as duas evidencias que a precederam (superficie sem custodia e superficie com custodia), nomeia o risco principal do arranjo escolhido, e diz o que passa a estar liberado para construcao no dia seguinte.Se a evidencia nao for suficiente para decidir, o desfecho valido e dizer exatamente qual pergunta falta e quem a responde. O que NAO e desfecho valido e comecar a construir sem decidir: nao decidir e escolher o arranjo mais caro por omissao.

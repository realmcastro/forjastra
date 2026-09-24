# SPR-40 — Fechar tipo, unidade e escala de dinheiro e de quantidade

**Tipo:** Spike · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-10-15
**Agrupador:** SPR-34
**Rótulos:** bloqueada

> **Editado em 2026-09-23 (T-0014, `F-018`), com o card em execução (`T-0018`), pela régua de
> `.claude/rules/backlog.md` §7.** Três mudanças, e nenhuma troca a pergunta do Spike:
> - **O caso de rateio deixa de ser resolvido "à mão".** "Resultados esperados" pedia um caso de rateio
>   com resto e onde o centavo sobrante vai parar, sem regra atrás (`G-09`, e a pauta avisava que ele
>   nasceria dentro deste card, sem contador: `docs/produto/backlog-lacunas-g01-g09.md` §1). A regra
>   existe agora, `RN-NUC-064` (`docs/produto/nucleo-venda-congelamento.md`), e o caso é o aceite dela.
> - **Entra o cenário 3, moeda.** `RN-NUC-058` pôs a moeda no estabelecimento, e `F-021` depende deste card
>   por causa disso (`F-021`, Depende de).
> - **O arredondamento de linha e de tributo sai do caso de prova**: está indisponível, com aviso, em
>   `docs/produto/nucleo-venda.md` §6 (`LACUNA-NUC-004`), e não é convenção de tipo.

---

## Contexto

Dinheiro e quantidade são escolhas de implementação irreversíveis. Ponto flutuante para dinheiro é proibido; a proibição só se sustenta com **uma** convenção. Quantidade é o filtro que tranca verticais: combustível precisa de 3 casas, unidade usa 0. Escolher `integer` fecha portas sem aviso.

**Pergunta que a decisão responde:**

> Dinheiro é `numeric(14,2)` ou inteiro em menor unidade (centavos)? E qual é a escala de quantidade?

## O que testar

**1. Dinheiro — tipo, unidade e atravessamento de fronteira**

* Cenário: R$ 0,01 registrado no banco, recebido pelo cliente, exibido na tela
* Desfecho: nenhuma perda de precisão em nenhuma fronteira (banco → API → UI)
* Impacto TypeScript: tipo decimal existe nativo ou precisa adaptá-lo?

**2. Quantidade — escala mínima e máxima**

* Cenário A: gasolina (litro com 3 casas), hambúrguer (unidade inteira), arroz a granel (kg com 2 casas)
* Desfecho: uma escala para tudo ou escala por classe de produto?
* Impacto: `integer` bloqueia varejo; precisa de `numeric`

**3. Moeda — de quem é e o que ela muda na escala**

* Cenário: cliente com A e B, cada estabelecimento com a própria moeda publicada (`RN-NUC-058`); uma venda
  de A lida de novo depois de a moeda de A ser republicada com vigência futura
* Desfecho: todo valor de fato é interpretável na moeda que vigia para a unidade no instante dele, sem
  consultar o presente; a convenção diz como o valor guarda isso (moeda congelada no valor, ou pela versão
  da configuração congelada no fato)
* Desfecho: a convenção diz se a escala do dinheiro acompanha a menor unidade da moeda ou se só suporta
  moeda de centésimo — e, no segundo caso, o limite fica registrado, não implícito

## Entrega

* Documento com a convenção aprovada
* **Tipo registrado em três lugares:** DDL (`dados.md`), contrato de API (`backend`), tratamento de serialização (TypeScript, biblioteca Decimal)
* Exemplos: como calcular preço unitário, desconto, total, sem perder precisão

## Critério de conclusão

* Uma escolha, registrada, que vale para todo o sistema
* Nenhuma "convenção local" de tabela: tudo segue o padrão
* As três verticais (restaurante, posto, varejo) conseguem vender com esta escala (nenhuma fica bloqueada)

## Fora de escopo

Regra de cálculo de imposto, base de cálculo, gorjeta. São de `produto`, não de convenção de tipo. E o
arredondamento de quantidade × preço e o de tributo, indisponíveis até o contador responder
(`docs/produto/nucleo-venda.md` §6, `LACUNA-NUC-004`): o Spike prova a convenção com linhas de valor exato.

## Referências

`.claude/rules/dados.md` §3 · `docs/arquitetura/fiscal/2026-08-22-adendo-base-de-calculo-e-gorjeta.md` · `.claude/rules/ui.md` §3 ·
`docs/produto/nucleo-venda-congelamento.md` (`RN-NUC-064`) · `docs/produto/nucleo-estabelecimento.md` (`RN-NUC-058`)

## Resultados esperados

Uma escolha única para todo o sistema, registrada como decisão: dinheiro como inteiro em menor unidade ou numeric(14,2), e a escala de quantidade — uma só, ou declarada por classe de produto. A escolha precisa atravessar banco, contrato e serialização de forma intacta. Como prova: os dois casos de rateio com resto do aceite de `RN-NUC-064` — três linhas de R$ 10,00 com desconto de R$ 10,00 dão 3,34 · 3,33 · 3,33; linhas de 5,00 · 3,00 · 2,00 com desconto de 0,99 dão 0,49 · 0,30 · 0,20 —, conferidos na convenção escolhida, do banco à tela, sem perder a menor unidade. Mais a regra enunciada de como o valor viaja na rede e o que o cliente nunca faz com ele.

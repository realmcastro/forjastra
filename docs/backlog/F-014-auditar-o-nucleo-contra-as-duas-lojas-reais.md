# F-014 — Auditar as 28 linhas de núcleo contra as duas lojas reais

**Tipo:** Prova · **Aberto em:** 2026-09-12
**Agrupador:** —
**Rótulos:** —

---

## Contexto

O humano trouxe em 2026-09-11 duas lojas vizinhas reais: uma de roupa e acessórios, uma de polpa de
fruta. A hipótese dele era que os dois negócios são um módulo só, desde que o módulo saiba criar a
especificação do produto. **Essa parte já foi respondida** em
`docs/produto/dois-varejos-corpo-de-prova-2026-09-11.md` §1 a §9, e o teste que separa variação de
quantidade virou registro (`memory/plataforma/business-rule-variacao-exige-conjunto-fechado-quantidade-nao.md`).
Esta prova **não a refaz**.

O que ficou de fora daquela passada é o outro lado do corpus. Até 2026-09-11 a única vertical nomeada
era restaurante, e `docs/produto/fronteira-do-nucleo.md` §2 foi escrito nesse período: ele classifica
**28 linhas como núcleo**, e o teste declarado em `fronteira-do-nucleo.md:9` é se a operação dos três
negócios **quebra** sem aquilo. Duas lojas reais, nenhuma delas restaurante, são a primeira
oportunidade de rodar esse teste contra caso em vez de hipótese.

```
duas lojas reais (roupa · polpa de fruta)
→ as 28 linhas classificadas como núcleo em fronteira-do-nucleo.md §2
→ cada linha passada pelas duas: alguma delas quebra sem isto?
→ linha que nenhuma das duas exige = candidata a não ser núcleo
→ achado com path:linha, sem fechar fronteira
```

> Lendo a spec aprovada com estas duas lojas na cabeça, o que está classificado como núcleo hoje e não
> sobrevive ao corpus?

**Nada falta para executar.** A prova é leitura de spec já aprovada mais o depoimento do humano já
registrado; não depende de servidor, modelo, módulo ou decisão em aberto. `LACUNA-NUC-041` (moeda) não
toca nenhum dos critérios abaixo, e quem executar declara isso em vez de presumir.

## O que testar

**1. As 28 linhas, uma a uma.** Cenário: para cada linha da coluna `núcleo` de
`fronteira-do-nucleo.md` §2.1 a §2.7, a loja de roupa quebra sem aquilo? E a de polpa? Desfecho exato,
um dos quatro, nomeado na tabela: **confirmada** (as duas exigem) · **neutra** (uma exige, a outra não
contradiz) · **fora do alcance** (o depoimento do humano não cobre) · **nenhuma das duas exige** — e só
a última abre achado. O terceiro valor é obrigatório: o depoimento diz o que as lojas **vendem**, não
como operam, e forçar tudo nos outros três produziria inferência com cara de observação.

**2. Cláusula de motivo no modo "pode".** Cenário: as cláusulas de motivo das mesmas 28 linhas.
Desfecho: motivo que sustenta a classificação em "os três **podem**" em vez de "os três **quebram**"
é achado de redação, porque sustenta um escopo mais largo do que o teste de `:9` autoriza.

**3. Motivo que é afirmação fiscal.** Cenário: motivo de linha de núcleo apoiado em exigência de
documento fiscal. Desfecho: sem fonte primária citada, **não vira achado fechado** — vira
`PERGUNTAS: para humano`, pela mesma trava de `.claude/rules/produto.md` (Nunca: inventar regra fiscal
por analogia) e de `fronteira-do-nucleo.md:270`.

**4. Linha de núcleo cuja definição é lacuna aberta.** Cenário: cruzar as 28 linhas com as
`LACUNA-NUC-*` de `nucleo-venda.md` §6. Desfecho: linha cuja própria definição está aberta **e** cuja
resposta registrada do humano foi "depende do cliente" é achado — `fronteira-do-nucleo.md:188` define
exatamente essa frase como assinatura de escopo de **cliente**, não de núcleo.

**5. Vocabulário de ramo na cláusula de motivo.** Cenário: motivo que exemplifica com um ramo só uma
capacidade que serve vários. Desfecho: achado da mesma família de
`memory/modulos/grd/decision-grd-e-cross-vertical-nao-e-de-moda.md`, num path diferente daquele já
corrigido em 2026-09-11 — correção barata, não fronteira.

**6. Linha de fronteira × glossário sobre o mesmo termo.** Cenário: termo da coluna `Item` das 28
linhas que tem entrada em `glossario.md` com definição mais larga que a da linha. Desfecho: divergência
é achado, e a leitura que vale na prática é a do glossário, que é autoridade única de vocabulário —
então a linha está classificando como núcleo mais coisa do que o motivo dela justifica.

## Entrega

- Arquivo irmão de `dois-varejos-corpo-de-prova-2026-09-11.md`, em `docs/produto/`.
- Tabela com os **28 veredictos**, inclusive os confirmados. Só a lista completa torna o julgamento
  auditável; publicar só os achados esconde o denominador.
- Cada achado com `path:linha`, o caso concreto de **cada uma** das duas lojas, e de quem passa a ser
  a coisa. Onde o achado recusa um mecanismo, as quatro partes de `00-nucleo.md` §12.
- Perguntas novas ao humano, **sem duplicar** as cinco já abertas em
  `memory/plataforma/state-pendencias-abertas-2026-08-23.md` §0.3.
- Declaração explícita do que **não** foi refeito, com o path de onde já está respondido.

## Critério de conclusão

As 28 linhas julgadas e registradas, inclusive as que passam e as que ficam fora do alcance.

**Achado de linha** exige caso concreto de **cada uma** das duas lojas; sem ele vira nota. **Achado de
motivo** (cenários 2, 3 e 5) é a exceção declarada: ele não se apoia no corpus e sim na cláusula da
própria linha contra o teste de `fronteira-do-nucleo.md:9`, e o texto diz de qual espécie é cada
achado. Confundir as duas espécies é o defeito que esta prova mais facilmente produz — um diz que a
linha está no lugar errado, o outro diz que ela pode estar no lugar certo pelo argumento errado.

Achado que depende de resposta que ninguém deu fica declarado como pergunta, e isso conta como
conclusão, não como pendência. **Nenhuma fronteira é fechada por esta prova** e nenhuma correção de
spec é aplicada nesta passada: a prova produz o inventário, a correção é item separado depois da
resposta do humano.

## Fora de escopo

- **Fechar `G-03`, `G-04` ou `G-05`.** São do humano, e `fronteira-do-nucleo.md:169` proíbe fechar
  fronteira por eliminação.
- **Aplicar as correções encontradas.** Inclusive as baratas.
- **Refazer o corpus de 2026-09-11** — hipótese, variação × quantidade, gênero, acessório, módulo
  desligado e defeitos de vocabulário já estão em `dois-varejos-corpo-de-prova-2026-09-11.md`.
- **Tabela, coluna, endpoint, componente.** De `arquiteto-dados`, `backend` e `ui`.
- **Prioridade e prazo.** Do humano.

## Referências

`docs/produto/fronteira-do-nucleo.md:9` · `:169` · `:188` · `:270` ·
`docs/produto/dois-varejos-corpo-de-prova-2026-09-11.md` · `docs/produto/nucleo-venda.md` §6 ·
`docs/produto/glossario.md` · `memory/plataforma/state-pendencias-abertas-2026-08-23.md` §0.3 ·
`memory/plataforma/business-rule-variacao-exige-conjunto-fechado-quantidade-nao.md` ·
`memory/modulos/grd/decision-grd-e-cross-vertical-nao-e-de-moda.md`

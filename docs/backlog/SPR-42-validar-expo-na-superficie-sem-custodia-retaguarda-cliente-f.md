# SPR-42 — Validar Expo na superfície SEM custódia — retaguarda, cliente-final e display de leitura à distância

**Tipo:** Spike · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-09-09
**Agrupador:** SPR-35

---

## Contexto

Estamos validando Expo + React Native como stack candidata para a superfície sem custódia — D-02 (arranjo do cliente) segue **ABERTA** (`CLAUDE.md` §8, `docs/arquitetura/d-01-d-02-stack-opcoes.md` §3.3). O que falta provar é se ele cobre, com código rodando, a metade **grande** da superfície do produto: toda a retaguarda, o dispositivo do cliente-final e o display de leitura à distância — nenhum dos três lida com custódia (assinar, imprimir com controle de falha, guardar fila em repouso, drenar faixa). A metade com custódia é a issue irmã (`SPR-43`), e o corte entre as duas já está fechado por regra de produto.

O fluxo que o cliente SDUI executa, em todo espaço:

```
manifesto recebido
→ parse tolerante
→ validação de vocabulário fechado
→ resolução da variante (espaço + interação)
→ tela renderizada, ou piso embutido
```

> Expo, com código rodando — não com leitura de documentação — sustenta esse fluxo inteiro nos três espaços sem custódia, sem exceção?

## O que testar

**1. Parse tolerante — manifesto como entrada não confiável**

* Cenário: manifesto vazio → Desfecho: parser não lança, tela cai no piso embutido.
* Cenário: manifesto truncado no meio de um nó → Desfecho: nó truncado é descartado, os nós irmãos válidos renderizam.
* Cenário: JSON malformado → Desfecho: parser retorna erro tipado, nunca lança exceção não tratada.
* Cenário: nó com `kind` fora do vocabulário fechado → Desfecho: cai em bloco padrão, tela não quebra.
* Cenário: nó com `kind` conhecido e prop obrigatória ausente → Desfecho: nó descartado, irmãos sobrevivem.

Nenhum servidor real emite manifesto ainda (Fase 0). O protótipo usa **cinco arquivos de manifesto fixos**, um por cenário acima — não "vários manifestos de teste": os cinco, nomeados, versionados junto com o código do protótipo.

**2. Escada de degradação — rede → cache local → piso embutido**

* Cenário: primeira carga, rede disponível → Desfecho: manifesto de rede renderiza e é cacheado.
* Cenário: rede indisponível, cache local com manifesto válido anterior → Desfecho: cache renderiza, sem tela em branco.
* Cenário: rede indisponível, sem cache → Desfecho: piso embutido renderiza.
* Cenário: rede devolve manifesto inaproveitável (JSON inválido) → Desfecho: **não é cacheado** — o cache anterior (ou o piso) continua sendo servido, o defeito não congela no terminal.

**3. Três espaços — pisos de leitura diferentes, sem derivação por escala**

* Cenário: o mesmo bloco (por exemplo, um bloco de listagem) renderizado na retaguarda, no dispositivo do cliente-final e no display de leitura à distância, com o contexto de espaço declarado localmente em cada alvo.
* Desfecho: cada espaço aplica o piso de leitura e a densidade próprios — medidos, não estimados — e nenhum dos três deriva do outro por reescala de fonte.

**4. Teclado e foco como primeira classe**

* Cenário: fluxo de navegação e seleção completo, sem um único toque na tela, num dos três espaços.
* Desfecho: fluxo fecha só com teclado; o indicador de foco permanece visível sobre a superfície e sobre o preenchimento de ação, nas duas condições.

## Entrega

* Protótipo Expo executável, cobrindo os três espaços, com os cinco manifestos-mock do item 1 e os quatro cenários de rede do item 2.
* Registro por cenário testado, na rubrica:

```
Cenário:
Resultado:
Limitação encontrada:
Como foi reproduzido:
Fonte primária (URL):
Impacto:
```

* Toda limitação afirmada sobre Expo ou React Native carrega fonte primária — sem fonte, a limitação não entra no registro.

## Critério de conclusão

Todo cenário dos quatro blocos acima foi executado e documentado na rubrica, incluindo os que falharam. **Não é necessário que todo cenário passe** — é necessário que nenhum fique sem registro. Sucesso relatado sem o que falhou é propaganda, não prova.

## Fora de escopo

Custódia (assinar, imprimir com desfecho de falha, fila em repouso, faixa pré-alocada, drenagem com janela fechada) — é `SPR-43`. A decisão de arranjo B ou D em si — é `SPR-50`, e não começa antes desta issue e da irmã fecharem.

## Referências

`.claude/rules/ui.md` §1 e §2 · `docs/design/grade-e-espacos.md` · `docs/design/vocabulario-e-eixos.md` · `docs/design/tolerancia-de-versao.md` · `docs/arquitetura/d-01-d-02-stack-opcoes.md` §3.2 e §3.4

## Resultados esperados

Evidencia executavel, nao opiniao: um projeto de prova em Expo, TypeScript estrito, que demonstra os quatro pontos abaixo rodando, com o que foi medido registrado.1) Manifesto malformado, truncado e com no desconhecido nao derruba a tela: o no invalido e descartado, os irmaos sobrevivem, e a tela sem no valido nenhum cai no piso embutido. 2) A escada de degradacao rede, cache local, piso embutido funciona nos tres degraus, e resposta inaproveitavel NAO e cacheada. 3) O mesmo codigo serve os tres espacos sem custodia com pisos de leitura diferentes. 4) Fluxo completavel por teclado, do inicio ao fim, sem tocar a tela.Cada limite encontrado no Expo vira uma linha com fonte primaria (URL) e o que exatamente nao funciona. Limite sem fonte nao entra.

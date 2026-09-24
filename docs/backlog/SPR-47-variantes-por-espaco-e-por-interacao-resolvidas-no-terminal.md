# SPR-47 — Variantes por espaço e por interação, resolvidas no terminal

**Tipo:** História · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-09-25
**Agrupador:** SPR-35

---

## Objetivo

Definir o mecanismo que decide qual variante de um bloco renderizar, e garantir que essa decisão acontece no lugar certo: um bloco, N variantes, escolhidas no terminal.

## Escopo

**O manifesto escolhe o bloco; o contexto resolve a variante.** Espaço e interação são conhecidos no terminal, não no servidor — um manifesto que manda variante está adivinhando qual hardware atendeu a requisição.

**Os eixos são dois, e só dois: espaço e interação.**

* _Espaço_ — terminal de caixa, terminal móvel do operador, dispositivo do cliente-final, display de leitura à distância. Alvo, piso de texto, densidade e interação diferentes entre eles, sem derivação por escala: o display de leitura à distância não sai do terminal de caixa por aumento de fonte.
* _Interação_ — toque, teclado, leitor de código de barras. Ortogonal ao espaço: resolvida por variante e slot declarado, nunca por condicional estrutural dentro de um componente compartilhado.

**Permissão, módulo desligado e cliente não são eixo de variante.** Permissão decide se o nó existe no manifesto — ausência por autorização é ausência, não controle apagado. Módulo desligado não tem nó, não tem variante vazia. Cliente é dado e configuração.

**Nome de espaço é funcional, nunca de ramo.** É _display fixo de leitura à distância_, não "telão de cozinha". O módulo usa o espaço; não o batiza.

Itens a entregar:

* Enumeração fechada dos espaços e das interações, com exaustividade verificada pelo compilador.
* Mecanismo de resolução local: dado o contexto do terminal, qual variante.
* Contrato de slot e de variante por bloco.
* Mobile-first como método — parte da restrição mais apertada e sobe, sem presumir que o alvo é telefone (o alvo literal de telefone existe em um espaço só).

## Fora de escopo

O analisador do manifesto e o despacho por id — é `SPR-44`. O vocabulário de ids em si — é `SPR-45`.

## Critério de aceite

* Acrescentar um espaço novo à enumeração quebra a compilação em todo lugar que precisa tratá-lo.
* O mesmo bloco renderiza em dois espaços com pisos de texto diferentes, verificado.
* Um teste afirma que nenhuma variante é escolhida por permissão, por módulo ou por cliente.

## Depende de

O vocabulário fechado de ids (`SPR-45`) e o despacho tipado por id com fallback garantido (`SPR-44`) — o critério de aceite pede "o mesmo bloco" com contrato de renderização, que não existe sem as duas resolvidas. Nenhuma decisão de arranjo (`SPR-50`) é pré-requisito: a resolução de variante é idêntica nos dois arranjos possíveis do cliente.

## Referências

`docs/design/grade-e-espacos.md` · `docs/design/vocabulario-e-eixos.md` · `.claude/rules/ui.md` §2 e seção "Bloco, variante e eixo"

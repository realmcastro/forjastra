# SPR-44 — Analisador tolerante do manifesto e despacho tipado com fallback garantido

**Tipo:** História · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-09-18
**Agrupador:** SPR-35

---

## Objetivo

Construir o mecanismo que transforma o manifesto vindo da rede em árvore de blocos renderizável, sem nunca derrubar a tela ao fazer isso. Este mecanismo é idêntico nos dois arranjos possíveis do cliente (`SPR-50`) — está no conjunto que não muda com a decisão de arranjo, e adiar não compra informação nenhuma.

## Escopo

**Análise tolerante.** O manifesto é entrada não confiável, como qualquer corpo vindo da rede. Guardas de tipo nomeadas retornam em vez de lançar. Nó inválido é descartado; os irmãos sobrevivem; se não sobra nó válido, a tela cai no piso embutido. A função de entrada do analisador não tem caminho de exceção — garantido pelo tipo de retorno, não por convenção.

**Despacho tipado, com fallback declarado no próprio tipo.** Proibido mapa de id para componente com tipo genérico: o compilador precisa continuar checando as props no ponto de resolução dinâmica. Todo ponto de resolução declara, no tipo, o que acontece com id desconhecido. Fallback opcional é fallback ausente no dia em que o servidor estreia um bloco novo.

**A exceção que não tem piso.** Id desconhecido em zona de ação crítica não recebe bloco padrão: o terminal não sabe o que a ação faz, então não a oferece. O slot mostra o fallback e a ação não acontece ali.

**String da rede nunca é código.** Nem expressão, nem template, nem consulta, nem nome de componente resolvido por reflexão.

## Fora de escopo

Quais blocos existem (é `SPR-45`, o vocabulário) e como cada variante se parece (é `SPR-47`, as variantes).

## Critério de aceite

Bateria de manifestos hostis, cada um com o desfecho esperado afirmado no teste:

* manifesto vazio, truncado no meio de um nó, e com JSON inválido;
* nó com `kind` desconhecido, e nó com `kind` conhecido e props erradas;
* nó válido entre dois nós inválidos — os dois são descartados e o do meio renderiza;
* profundidade absurda e referência circular;
* id desconhecido em zona de ação crítica: o teste afirma que nenhuma ação é oferecida.

Em nenhum caso o analisador lança. Em nenhum caso a tela fica vazia.

## Referências

`.claude/rules/ui.md` §1 e a seção "Bloco, variante e eixo" · `docs/design/vocabulario-e-eixos.md` · `docs/design/tolerancia-de-versao.md`

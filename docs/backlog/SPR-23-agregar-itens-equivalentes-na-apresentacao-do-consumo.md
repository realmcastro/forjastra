# SPR-23 — Agregar itens equivalentes na apresentação do consumo

**Tipo:** História · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-11-27
**Agrupador:** SPR-15

---

## Objetivo

Consolidação é **agregação de apresentação** sobre fatos que permanecem **separados**. A superfície mostra uma linha agregada ("2× X-Burger"); os lançamentos continuam existindo separados, cada um com autor, instante e trilha próprios; e toda retirada age sobre **um lançamento**, nunca sobre uma linha somada. Equivalência para **exibir** pode considerar a composição do item. **Identidade** de fato nunca é composição, e **nunca** inclui a observação do item de pedido (`RN-NUC-016`).

A necessidade é a comanda **legível no pico**: vinte linhas iguais de refrigerante são ilegíveis, e ilegível é o que faz o atendente conferir errado na frente do cliente-final; essa necessidade não está em discussão. O mecanismo recusado — fundir dois lançamentos numa linha de quantidade 2, consolidando **o fato** — é ruim por três razões, cada uma contra regra aprovada: apaga **autor e instante** de cada lançamento, que `RN-MSA-004` (`docs/produto/modulos/mesa-comanda.md:125`) exige e que é a única prova contra o furto por cancelamento de item; torna ambíguo o que fazer com o trabalho **já emitido**, já que o trabalho nasce do lançamento, não da venda (`RN-COZ-001`, `docs/produto/modulos/cozinha.md:88`); e usa **texto livre como chave de decisão**, que `RN-NUC-016` (`docs/produto/nucleo-publicacao-e-texto.md:170`) proíbe literalmente. No canal externo o contrário já foi decidido: `RN-PCF-006` (`docs/produto/modulos/pedido-cliente-final.md:180`) diz que o produto **não deduplica por semelhança**, porque duas pessoas pedirem a mesma coisa é **rotina**. O mecanismo recusado **não consegue** produzir as provas 2 e 3 do critério de aceite abaixo — é por isso que ele parece mais simples: ele descarta exatamente a informação que sustenta as duas.

## Escopo

Agregação de **apresentação**, no consumo em aberto, sobre lançamentos que permanecem fatos separados.

## Critério de aceite

1. Lançar o mesmo item duas vezes, por **dois autores diferentes** → a tela mostra **uma** linha agregada com quantidade 2.
2. A trilha do mesmo consumo mostra **dois** lançamentos, com autores e instantes distintos.
3. Retirar "um" → retira o **lançamento escolhido**, e a trilha mostra **qual**; o outro permanece intocado, com seu autor e instante.
4. Dois lançamentos do mesmo item com observações diferentes → o texto **não** decide agregação nem separação (`RN-NUC-016`), **e** as duas observações continuam legíveis na linha agregada, atribuídas a cada lançamento. Agregar quantidade nunca esconde instrução de atendimento.
5. Nenhum valor exibido na linha agregada é composto por `MSA` (`RN-MSA-007`, `docs/produto/modulos/mesa-comanda.md:166`).
6. A linha agregada mostra a composição: dois lançamentos de "X-Burger + Bacon" leem como **"2× X-Burger + Bacon"**, e não como "2× X-Burger".

## Fora de escopo

A **chave de equivalência** como estrutura de dado é `SPR-33`, que permanece bloqueada por outro motivo — ver o comentário lá.

## Referências

`docs/produto/modulos/mesa-comanda.md:125` · `:166` · `docs/produto/modulos/cozinha.md:88` · `docs/produto/nucleo-publicacao-e-texto.md:170` · `docs/produto/modulos/pedido-cliente-final.md:180` · `SPR-33`

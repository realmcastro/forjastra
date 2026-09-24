# SPR-49 — Tokens do sistema de design em código: primitiva, semântica e tema

**Tipo:** História · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-09-17
**Agrupador:** SPR-35

---

## Objetivo

Levar o sistema de design que já existe escrito para dentro do código, como tokens tipados. Ele já nasceu agnóstico de framework, então esta issue atravessa qualquer arranjo do cliente (`SPR-50`).

## Escopo

**Duas camadas, e só a de baixo tem valor literal.** A camada primitiva contém o valor; a camada semântica nomeia papel. Token semântico nunca é nomeado por cor — `superficie-de-recusa`, não `vermelho-600`. Componente nunca referencia primitiva: se consegue, a troca de tema não é possível sem editar componente.

**Contraste é medido, nunca avaliado a olho.** Par de cor sem valor medido não vai para produção. Cor que reprova o piso se troca por uma variante derivada — o piso nunca se afrouxa para caber uma cor, nem a de marca.

**Estado nunca é sinalizado só por cor.** Todo estado carrega ao menos um sinal não-cromático: forma, ícone, posição fixa ou texto. Vale inclusive entre perigo e sucesso, que são valores próximos em escala de cinza.

**Cor não é ênfase.** Ênfase de valor é tamanho e peso. Cor gasta em destaque decorativo é vocabulário roubado de recusa e de conclusão.

**Piso de legibilidade não tem exceção para desabilitado.** Indisponibilidade se sinaliza pela perda do acento e pelo motivo em texto, nunca pela perda de legibilidade.

**Degrau de rampa e token novo nascem com papel declarado.** Sem papel, não existe: rampa completa "por simetria" é catálogo apodrecendo.

Itens a entregar:

* Tokens de cor (primitiva e semântica), forma, tipografia, espaçamento e elevação.
* Tema claro e escuro, com a semântica trocando e a primitiva não.
* Verificador de contraste executável, rodando sobre os pares que existem.

## Fora de escopo

Componentes em si. Esta issue entrega o vocabulário visual, não o catálogo.

## Critério de aceite

* Componente que referencia token primitivo não compila, ou é apontado por verificação automática.
* O verificador de contraste roda e falha em par que reprova o piso — com o número medido no relatório, não uma avaliação.
* Todo token semântico tem papel declarado; token sem papel é recusado pela verificação.
* Um estado qualquer, renderizado em escala de cinza, continua distinguível.

## Referências

`docs/design/tokens.md` · `docs/design/tokens-cor.md` · `docs/design/tokens-forma-e-texto.md` · `docs/design/estados-e-interacao.md` · `.claude/rules/ui.md` seção "Cor, contraste e estado"

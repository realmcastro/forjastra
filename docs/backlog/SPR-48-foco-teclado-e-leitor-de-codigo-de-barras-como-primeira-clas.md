# SPR-48 — Foco, teclado e leitor de código de barras como primeira classe

**Tipo:** História · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-10-05
**Agrupador:** SPR-35

---

## Objetivo

Fazer o caminho de venda inteiro ser completável sem tocar a tela. Não é acessibilidade opcional: é como o caixa realmente opera.

## Escopo

**O operador não lê.** Ele opera de memória e de músculo. Posição de botão de ação frequente é contrato: não se move sem decisão registrada — trocar a posição de um botão custa uma semana de erro de operação em cada loja.

**Teclado e leitor de código de barras são a interação primária**, não a alternativa. O leitor entrega uma sequência de caracteres seguida de um terminador, rápido, sem foco intencional do operador — e isso cai no campo certo mesmo que o operador não tenha clicado em nada.

**Alvo grande, alto contraste, feedback imediato.** Minimalismo se aplica a ornamento, nunca a alvo de toque nem a sinalização de estado.

**O indicador de foco nunca é removido, e não é o acento de cor.** Ele precisa ler sobre a superfície e sobre o preenchimento de ação — os dois. Se tem mais de um membro, os membros são inseparáveis: desenhar só um faz o sistema reprovar sem que nada acuse. O fluxo completável sem tocar a tela depende do foco ser visível.

Itens a entregar:

* Ordem de foco declarada e estável em cada bloco, e o que acontece ao chegar no fim.
* Captura de entrada do leitor de código, com o terminador, e roteamento para o campo correto sem foco intencional.
* Atalhos das ações frequentes do caminho de venda.
* Indicador de foco como token, com os membros inseparáveis.
* Estado de ação que move dinheiro: confirmação explícita, e reversível ou irreversível de forma óbvia.

## Fora de escopo

Cálculo de total e de pagamento (vem do backend) e a definição de quais ações existem no caminho de venda (é de produto).

## Critério de aceite

* Abrir venda, adicionar item por leitura de código, e fechar pagamento — sem um único toque na tela, verificado ponta a ponta.
* Entrada rápida do leitor não perde caractere e não dispara duas vezes.
* Indicador de foco visível sobre superfície e sobre preenchimento de ação, medido nos dois.
* Nenhuma função essencial depende de `hover` — o terminal é toque e teclado.

## Referências

`docs/design/foco-teclado-e-leitor.md` · `docs/design/estados-e-interacao.md` · `.claude/rules/ui.md` §3 · `.claude/rules/performance.md` §2

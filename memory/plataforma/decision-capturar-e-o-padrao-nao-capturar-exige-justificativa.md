---
name: decision-capturar-e-o-padrao-nao-capturar-exige-justificativa
description: invariante 10, fixado pelo humano em 2026-09-11 — o que acontece na operação vira fato no instante em que acontece, e o ônus se inverte: não capturar é a exceção e exige justificativa registrada, porque fato não tem backfill e a dúvida não é simétrica
type: decision
escopo: plataforma
camada: produto
data: 2026-09-11
relaciona: [[gotcha-zero-venda-nao-se-distingue-de-terminal-morto]], [[state-execucao-solo-2026-09-11]], [[convention-fato-nao-carrega-campo-de-calendario]], [[decision-d-04-chave-timestamps-exclusao]]
tarefa: T-0009
---

Virou **invariante 10** do `CLAUDE.md` §7 em 2026-09-11, por decisão do humano, com aplicação em
`.claude/rules/produto.md` (seção "Capturar é o padrão") e `.claude/rules/dados.md` §3.1.

**A regra:** o que acontece na operação vira fato, no instante em que acontece. **Capturar é o
padrão; não capturar é a exceção e exige justificativa registrada.**

**Por quê, e é uma assimetria, não uma preferência:** guardar e nunca usar custa armazenamento, que é
barato e recuperável. Não guardar e precisar depois é **irrecuperável** — fato nasce no instante ou
não existe, e a decisão não é retroativa. Como os dois erros custam coisas de ordem completamente
diferente, o default não pode ser o mesmo dos dois lados.

**O que a regra corrige, concretamente.** Antes dela, "precisamos guardar isto?" era a pergunta, e
ela exige justificar a captura: na dúvida, não captura, e ninguém nota, porque ausência de fato não
tem sintoma. A pergunta passa a ser **"o que se perde para sempre se isto não for registrado?"**, que
exige justificar a ausência. A mesma spec produz resultados opostos sob as duas.

**O contexto que a motivou:** o humano fixou como alvo do produto um MVP rico em informação, e a
lacuna que mais contradizia isso estava parada havia semanas justamente porque **não havia regra**.
Busca em `.claude/rules/` e no `CLAUDE.md` em 2026-09-11 não devolveu nenhuma menção a captura ou
rastreabilidade — a única ocorrência era "captura de tela", num item sobre PR.
[[gotcha-zero-venda-nao-se-distingue-de-terminal-morto]] é o caso de referência: sem fato de ciclo de
vida do pedido, "a loja não vendeu" e "o terminal morreu" produzem a mesma série, e caem junto a taxa
de conversão (para sempre, em qualquer janela), a cesta abandonada, o passo da desistência e o
defeito da nossa própria interface visto em N clientes.

**Os três limites, e nenhum é atenuação da regra:**

1. **Dado pessoal segue minimizado e justificado** (`seguranca.md` §3). Não conflita, e a razão é
   concreta: o valor que se quer não precisa saber **quem** é a pessoa. Spec que só entrega o valor
   identificando o cliente-final provavelmente está medindo a coisa errada.
2. **Cartão, credencial e segredo nunca.**
3. **Registro jamais bloqueia a venda.** Captura que precisa confirmar antes de o caixa seguir
   derruba o caixa no dia em que a rede cair. Falha ao registrar vira fato próprio.

**Como aplicar:** toda spec de comportamento declara **duas** listas — o que o fluxo registra e o que
ele **deliberadamente não registra**, com motivo. A segunda é a que ninguém escreve e a que impede a
ausência de virar acidente. O caminho que mais se perde é o **infeliz**: o que foi tentado e falhou,
lançado e retirado, montado e abandonado. Sucesso deixa rastro sozinho, porque vira venda.

**O que a regra não faz:** ela **não revoga** cláusula vigente que hoje impede captura. Inverte o
ônus — a cláusula passa a ser a exceção que precisa se defender. Revogar é ato datado do humano.

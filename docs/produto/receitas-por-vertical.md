# Receitas por vertical

Vertical **não tem código de módulo e não é ativável**: ela é a **receita** — quais módulos o ramo
liga, com que configuração padrão, e o vocabulário dele (`fronteira-do-nucleo.md` §1). Não existe
"desligar uma vertical": desliga-se módulo.

**Por que este arquivo existe separado do catálogo — o eixo do corte é o motivo de mudança.** A
**entrada de módulo** (`catalogo-de-modulos.md`) muda quando o módulo muda: fronteira, o que expõe, o
que acontece desligado. A **receita** muda quando ligamos ou revisamos uma vertical — outra cadência,
outra razão, outra pessoa decidindo. Enquanto os dois moravam no mesmo arquivo, acrescentar uma linha
de receita competia por espaço com a fronteira de um módulo, e foi assim que o arquivo chegou ao teto
de linhas com `EMI` faltando nas três receitas por falta de uma linha em cada.

Vale para toda receita:

- **"Liga" é padrão, não obrigação.** O cliente do ramo liga ou desliga conforme o formato dele.
  Módulo que a receita liga e um cliente desliga **tem** que ter comportamento desligado declarado na
  entrada do catálogo; se não tiver, o errado é a entrada, não a receita.
- Comportamento de ramo que não cabe em nenhum módulo é sinal de **fronteira de módulo errada**,
  nunca licença para código de ramo (`PN-09`).
- Receita não cria código (vem de `glossario.md` §4.3) e não decide ordem de construção nem
  prioridade — isso é do humano, no roadmap.
- Detalhe de um ramo — fluxo, jargão mapeado, hardware, regras `RN-<VERT>-nnn`, lacunas — mora em
  `verticais/<ramo>.md`. Aqui é a receita, curta.

**Campos:** **Liga (base)** — sem estes o ramo não opera no modo que ele declara · **Liga conforme o
formato** — depende de como aquele cliente opera · **Do ramo** · **É de cliente, não do ramo** · **É
módulo cross-vertical, não do ramo**.

## 1. Fiscal é sempre duas entradas na receita, nunca uma

Desde a partição do fiscal (`modulos/fiscal.md` §1), `FIS` é **tributação** e `EMI` é **emissão**, e
`EMI` **exige** `FIS` — ativar `EMI` sem `FIS` é recusado na ativação. Receita que liga só `FIS`
descreve um cliente que compõe o tributo e **não emite documento**: é configuração suportada (a
obrigação fica com o contador ou o provedor dele, `modulos/fiscal.md` §3.1, "Desligado"), mas não é o
padrão de nenhum dos três ramos abaixo. Por isso as três receitas ligam `FIS` **e** `EMI`.

`APU` (apuração e obrigação acessória) fica **fora das três receitas**: está fora do MVP, sem data,
por decisão do humano, e nesse arranjo a apuração fica com o contador do cliente — com o custo já
declarado em `modulos/fiscal.md` §4, que não é retórico.

## 2. `RES` — Restaurante / alimentação preparada no local

Recorte do ramo, fluxo por modo de atendimento e regras: `verticais/restaurante.md`.

- **Liga (base):** `MSA`, `COZ`, `FIS`, `EMI`, `PER`.
- **Liga conforme o formato:** `CMP` (só onde há modo que não se encerra no ato — ver §5), `ENT`
  (exige `CMP`), `PCF` + `PUB`, `ATI`, `ECG`, `EST`, `FTC`, `RSV`, `INT`.
- **Do ramo:** consumo em aberto vinculado a lugar ou ficha; o item pedido vira **trabalho a
  produzir** antes de existir venda; segregação de regime linha por linha no documento; o instante do
  fluxo em que a obrigação documental é cumprida (`fronteira-do-nucleo.md` §6).
- **É de cliente, não do ramo:** cobrar taxa de serviço e quanto; couvert; senha de gerente acima de
  qual valor; imprimir sempre ou só a pedido; guarda eletrônica ou segunda via impressa.
- **É módulo cross-vertical, não do ramo:** entrega (`ENT`), retirada (`CMP`), comissão (`COM`),
  fidelidade (`FID`), conta a prazo (`PRZ`) — `glossario.md` §3.4.

## 3. `PST` — Posto de combustível

- **Liga (base):** `BMB`, `PER`, `FIS`, `EMI`, `EST`.
- **Liga conforme o formato:** `PRZ`, `CMP`, `COM`, `CLF`.
- **Do ramo:** equipamento que mede a saída do produto; conferência por totalizador; quantidade
  fracionária no caminho crítico do caixa.
- **É módulo cross-vertical, não do ramo:** frota é conta a prazo (`PRZ`); a loja de conveniência é
  varejo com os mesmos módulos de qualquer varejo, não um módulo novo.

## 4. `VAR` — Varejo de mercadoria

- **Liga (base):** `PER`, `FIS`, `EMI`, `EST`.
- **Liga conforme o segmento:** `GRD`, `ETQ`, `CSG`, `TRC`, `FRN`, `COM`, `CLF`, `FID`, `PUB`, `CMP`
  e `ENT` — `ENT` **exige** `CMP`, então quem liga entrega liga os dois; ligar só `ENT` é recusado na
  ativação, e a receita diria uma coisa impossível se omitisse `CMP`.
- **Do ramo:** identificação afixada à mercadoria; contagem de peça; devolução e substituição como
  parte normal da operação.
- **É núcleo, não do ramo:** quantidade fracionária vinda de balança — unidade com casas declaradas é
  núcleo (`fronteira-do-nucleo.md` §2.2) e o periférico é `PER`. **Não existe módulo de balança.**

## 5. `CMP` na receita `RES` — a divergência resolvida, e por que `CMP` continua existindo

O catálogo listava `CMP` na base de `RES`; `verticais/restaurante.md` §5.2 concluiu que ele só é
necessário nos formatos que **não se encerram no ato**. **Mudou a receita, não a vertical** — e o
motivo não é autoridade, é o teste: num restaurante só de salão, `MSA` responde onde o consumo está e
`COZ` responde em que etapa o trabalho está; não sobra pergunta que `CMP` responderia. `CMP` desligado
não deixa nada faltando, e o restaurante só de salão é cliente legítimo do ramo — é o que
`RN-RES-008` já exige. Base de receita é o que o ramo **não** dispensa; isto o ramo dispensa.

**E `CMP` continua existindo, como módulo, pela mesma passada** — a pergunta que o catálogo deixou
aberta ("é casca do núcleo ou de `COZ`?") agora tem resposta:

- **Não é casca de `COZ`.** `RN-COZ-009` fixa que o trabalho **carrega** o destino como referência
  **recebida**, e que `COZ` não interpreta destino nem enxerga fila de cliente-final. Alguém tem que
  produzir essa referência e manter o **estado de cumprimento** (`glossario.md` §6): no salão é `MSA`,
  na retirada e na entrega é `CMP`. São dois donos de coisas diferentes, não um duplicado.
- **Não é do núcleo.** Se fosse, fila, senha e chamada apareceriam no PDV de quem entrega no ato —
  posto e loja de roupa — que é exatamente o erro mais caro de `fronteira-do-nucleo.md` §5.1.
- **É dependência dura de `ENT` e destino declarado de `PCF`**, e nas duas o que se exige dele é o
  estado de cumprimento, não fila de produção. Dissolvê-lo obrigaria os dois a olhar dentro de `MSA`
  ou de `COZ`, quebrando a invariante de módulo não importar módulo.

Consequência de tudo isso: **uma linha** de receita mudou. Nenhum código aposentado, nenhuma `RN`
renumerada, nenhuma spec de módulo alterada.

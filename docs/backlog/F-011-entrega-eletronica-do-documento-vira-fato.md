# F-011 — `EMI`: a entrega do documento por meio eletrônico passa a produzir fato, como a impressa já produz

**Tipo:** Comportamento fechado · **Estado:** a fazer · **Dono:** `produto` · **Território:**
`docs/produto/**` · **Cobre o achado** `2.11` da varredura do invariante 10

## Objetivo

A mesma obrigação tem dois meios de cumprimento e só um deles deixa rastro. No caminho **impresso**, o
fato existe: é o desfecho da tentativa de periférico, com os três valores e o indeterminado
(`RN-PER-004`, `docs/produto/modulos/perifericos.md` §2, tabela de `RN-PER-005`). No caminho
**eletrônico** (`RN-EMI-017`, `docs/produto/fiscal-emissao-contingencia.md` §2), não existe nada: não se
sabe que o documento foi entregue, por que meio, nem quando.

Duas coisas se perdem, e a segunda é a que morde.

**A primeira é de produto.** Se a substituição que a norma admite é de fato usada, e em que proporção,
decide duas perguntas já abertas: se a classe de impressão é piso prático do cliente
(`modulos/perifericos.md` §4) e se `EMI` com `PER` desligado é configuração real ou teórica (§3,
"Desligado").

**A segunda é sobre o dado pessoal que já coletamos.** A identificação do comprador é coletada
**porque a entrega escolhida a exige** (`RN-EMI-017`), e `fatos-de-operacao.md` §6, item 3, recusa
coletar o que a entrega não exigiu. Sem fato da entrega, essa minimização fica **afirmada e não
conferível** — não existe como mostrar que o dado pessoal coletado serviu ao que o justificou. A captura
aqui é o que torna a **não**-captura de lá auditável.

## Escopo

- **Fato de entrega do documento pelo meio eletrônico**: que documento, por que meio, em que instante.
- **A enumeração fechada dos meios**, nascendo com a regra (`RN-NUC-043`).
- **Simetria declarada com `RN-PER-004`**: os dois caminhos passam a ter desfecho de tentativa, e
  "não tentada" continua sendo um desfecho nos dois — o caso em que nada aconteceu produz fato.
- **As duas listas de captura** na spec de `EMI` (`modulos/fiscal.md` §3.1), que hoje nomeiam esta
  ausência **como acidental**, citando `2.11`.

## Fora de escopo

- **Se a norma exige prova de entrega, e em que forma.** É `LACUNA-EMI-017`
  (`fiscal-emissao-contingencia.md`, §Lacunas), respondida por humano com contador. **Nada aqui é
  afirmado por analogia** — não se presume o que a norma pede.
- **Mudar `RN-EMI-017`.** O desfecho da entrega não muda; o item acrescenta o registro dela.
- **Mudar o que se coleta do comprador.** `fatos-de-operacao.md` §6, item 3, continua valendo inteiro:
  não se coleta o que a entrega não exigiu. O item torna isso conferível, não mais permissivo.
- **Confirmação de recebimento pelo cliente-final.** Saber que o documento **saiu** é uma coisa; saber
  que ele **chegou** é outra, depende de terceiro e encosta em `LACUNA-EMI-017`. Fica fora, nomeado
  para não voltar como descoberta.
- **Contato do destinatário como campo do fato.** Ver a lista de baixo.

## Critério de aceite

1. Documento entregue por meio eletrônico → existe fato com o documento, o meio e o instante. Hoje não
   existe nada, e o mesmo documento entregue impresso deixa rastro.
2. Entrega eletrônica **não tentada** (o cliente-final dispensou, ou o meio não estava disponível) →
   desfecho registrado, não ausência. É a mesma régua de `RN-PER-004`, e ela é o precedente citado.
3. Contar, sobre uma janela e um estabelecimento, entregas por meio (impresso × eletrônico × nenhuma)
   devolve os números. É o que responde se `EMI` com `PER` desligado é configuração real.
4. Para um documento em que a identificação do comprador foi coletada, é possível mostrar **qual
   entrega a exigiu**. Sem esse aceite a minimização de `fatos-de-operacao.md` §6 continua sendo uma
   afirmação nossa sobre nós mesmos.
5. Falha ao registrar a entrega **não impede** a entrega nem a conclusão da venda
   (`CLAUDE.md` §7.10, terceiro limite). Ela mesma vira fato.
6. Nenhum dos fatos carrega a identificação do comprador. Se carregar, o item duplicou o dado pessoal
   que existe para justificar, que é o oposto do que ele faz.

## Registra / Não registra

**Registra:**

- **Que o documento foi entregue**, com a referência ao documento, o meio enumerado e o instante.
- **O desfecho da tentativa**, inclusive "não tentada" — pelo precedente explícito de `RN-PER-004`.

**Não registra, e por quê:**

- **A identificação do comprador, em qualquer dos fatos.** Meio, documento e instante bastam, e é
  justamente isso que torna a coleta auditável **sem duplicá-la**. Repetir o dado pessoal num segundo
  lugar, com outro leitor e outra retenção, destruiria a razão de o item existir.
- **O endereço eletrônico ou o número para onde foi enviado.** É dado de contato de pessoa, a pergunta
  do card é sobre **meio**, não sobre destino, e a minimização de `seguranca.md` §3 vale inteira.
  Registrar o destino é decisão do humano com `seguranca`, e este item não a antecipa.
- **O conteúdo do documento, ou parte dele.** Ele já existe, guardado por `EMI`; um segundo acervo é o
  defeito que `RN-PRV-011` nomeia em outro escopo, pela mesma razão.
- **Confirmação de recebimento.** Fora de escopo acima — e a razão de não capturar é que hoje ela não
  existe como operação; capturar exigiria criar uma operação só para poder registrá-la.

## Depende de

**O item é executável hoje, e a dependência que existe não o trava.** `LACUNA-EMI-017` — se a norma
exige prova registrada da entrega e em que forma — é do humano com o contador, e ela decide a metade
**normativa**: se o fato tem valor probatório.

**As duas são independentes, e é por isso que o item não espera:** o fato serve à decisão de produto
(aceites 3 e 4) mesmo que a norma não exija prova nenhuma. O que muda com a resposta é o que ele precisa
carregar para valer como prova, não se ele deve existir.

**O que substitui enquanto ela não vem:** o fato é desenhado como **fato nosso**, sem pretensão
probatória, e o item diz isso em voz alta. Quem pegar o card não precisa decidir sozinho se está
construindo prova legal — a resposta é não, até o humano dizer o contrário.

## Gate obrigatório

**`produto`** — fronteira: a entrega é de `EMI` (módulo), o desfecho de periférico é de `PER` (módulo), e
o item não pode fundir os dois. São dois caminhos da mesma obrigação, com donos diferentes.

**`seguranca`**, com escopo curto: confirmar que nenhum dos fatos carrega identificação nem contato do
comprador, e que a simetria com `RN-PER-004` não abriu caminho lateral para dado pessoal.

## Referências

`docs/produto/captura-varredura-invariante-10-2026-09-11.md` §2.11 ·
`docs/produto/fiscal-emissao-contingencia.md` §2 (`RN-EMI-017`) · §Lacunas (`LACUNA-EMI-017`) ·
`docs/produto/modulos/perifericos.md` §2 (`RN-PER-004`, `RN-PER-005`) · §3 ("Desligado") · §4 ·
`docs/produto/modulos/fiscal.md` §3.1 (as duas listas) · `docs/produto/fatos-de-operacao.md` §6, item 3 ·
`RN-PRV-011` · `RN-NUC-043` · `.claude/rules/seguranca.md` §3 · `CLAUDE.md` §7.10

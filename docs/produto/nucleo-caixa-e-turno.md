# Núcleo de venda — caixa, turno e dinheiro na gaveta

> **Irmão de `nucleo-venda.md`, com o mesmo peso normativo.** Partido por teto de tamanho, no eixo
> **venda × caixa**: `nucleo-venda.md` tem o cabeçalho normativo, a tabela das operações do
> núcleo e as regras de pedido, venda, pagamento e correção (`RN-NUC-001` a `RN-NUC-008`); este tem
> `RN-NUC-009` a `RN-NUC-012`, mais `RN-NUC-037` (§2, aberta em 2026-08-23 pela correção pós-gate);
> `nucleo-publicacao-e-texto.md` tem `RN-NUC-013` a `RN-NUC-016`.
> Numeração é contínua e imutável entre os três (`glossario.md` §4.2). As lacunas de todos moram em
> `nucleo-venda.md` §6.
>
> Vale aqui tudo o que o cabeçalho de `nucleo-venda.md` declara: escopo núcleo, nenhum número
> inventado, nenhum termo de ramo, nada de tabela/coluna/endpoint/papel nomeado. Inclusive o **nível de
> heading**: toda regra é `### RN-NUC-nnn`, porque a conformidade do repo é conferida por busca
> (`^### RN-NUC-`) e dois níveis fariam a regra sumir da contagem.
>
> **Este arquivo contém a correção mais importante do conjunto.** A linha 8 da tabela §4 de
> `operacao-offline-e-sincronizacao.md` — "sangria, suprimento, abrir gaveta" — classificava **três**
> operações diferentes numa célula única de recusa em D1, D2 e D3, contra `RN-OFF-003`. A consequência
> prática: o dinheiro sai da gaveta com o link caído e o produto **não registra**, ou a gaveta não
> abre e a venda em espécie da linha 3 não se conclui, contra `PN-01`. `RN-NUC-011` e `RN-NUC-012`
> partem a linha e declaram o desfecho de cada parte; a linha 9 é partida do mesmo modo, porque abrir
> sessão é **integral** e fechar é **degradado**. As células foram corrigidas lá em 2026-08-22 (passo
> 1b da T-0003) e passaram a citar estas regras.

## 1. Sessão de caixa, dinheiro na gaveta e turno

### RN-NUC-009 — Abrir sessão de caixa é operação local: um operador, um posto, um fundo

**Enunciado** abrir sessão de caixa registra **quem** assume, em **qual** posto de caixa, com **qual**
fundo de troco contado, e no instante em que aconteceu. **Quem assume é o operador identificado no
terminal** — nunca um nome que o pedido informa; abrir sessão **em nome de outro** é operação distinta
(`RN-NUC-037`). É fato local, aditivo, e não pede confirmação de ninguém para valer.
**Precondição** operador **identificado** no terminal (`RN-OFF-033`) e terminal **habilitado a vender**
por aquele estabelecimento (`RN-OFF-032`i). **Não** exige autoridade retida dentro da validade: abrir a
própria sessão é **ato ordinário** (`RN-OFF-032`), e é isso que faz esta operação ser integral sem
contato. Mais: nenhuma outra sessão aberta naquele posto; fundo declarado.
**Produz** sessão de caixa aberta (`register_session`) — fato aditivo que abre o escopo de conferência
e habilita `RN-NUC-004`.
**Motivo** se abrir sessão exigisse servidor, o primeiro cliente-final do dia com o link caído não
seria atendido em espécie. `PN-01` não admite isso.
**Offline** **integral** em D1, D2 e D3; classe 1 — a célula "degradado" da linha 9 vale para o
**fechamento**, não para a abertura. Enfileira e converge.
**Infeliz** (a) já existe sessão aberta naquele posto e o terminal não sabe (D2, sessão aberta em
outro terminal do mesmo posto) → é estado confirmado por outro: recusa de classe 2, apresentando o que
o terminal conhece e desde quando (`RN-OFF-005`). É a única parte não-aditiva desta operação, e ela é
recusada. (b) a **validade da autoridade retida venceu** → **não afeta esta operação**: abrir a própria
sessão é ato ordinário e acontece (`RN-OFF-032`). O que é recusado até **reconectar** é a operação
sensível (`RN-OFF-024`b) — e abrir sessão em nome de outro é sensível (`RN-NUC-037`). (c) o operador
**não é identificável** naquele terminal (contratado durante a queda, nunca esteve no conjunto retido) →
a sessão não abre para ele, o produto diz que a identificação exige contato, e o caminho é outro operador
identificado (`RN-OFF-033`, infeliz (b)); nunca sessão sem autor, nunca "operador padrão".
**Aceite** com o link cortado desde antes do expediente, abrir sessão com fundo contado e vender em
espécie na sequência; ao restabelecer, a sessão aparece com o instante da abertura, o autor e o fundo,
sem nada ter sido perguntado ao servidor. E a **mesma** abertura acontece no minuto seguinte ao
vencimento da validade da autoridade retida, com o link ainda caído — nada nesta operação depende dela.

### RN-NUC-010 — Fechar sessão de caixa acontece offline, com a conferência que o terminal consegue fazer, e a pendência nomeada

**Enunciado** fechar sessão de caixa registra o **contado** por meio de pagamento, o **esperado**
composto dos fatos que o terminal retém daquela sessão, e a **diferença** entre os dois — como fato
imutável. O que o terminal não consegue afirmar fica **nomeado como pendência**, não omitido e não
estimado.
**Precondição** sessão aberta naquele posto; contagem informada; papel que pode fechar (o próprio
operador da sessão ou papel acima — o **quem** é do passo 3 da T-0003).
**Produz** sessão fechada com contado, esperado, diferença e autor — append-only. Diferença
encontrada depois é **fato novo**, nunca edição do fechamento (`PN-07`).
**Motivo** entre "não fechar o caixa" e "fechar com o que se sabe, dizendo o que falta", a segunda é a
única que não perde informação. Fechamento que espera rede deixa o dinheiro contado sem registro.
**Offline** **degradado** em D1, D2 e D3; classe 1. A pendência nomeada é exatamente esta: **o
fechamento do estabelecimento** — que soma as sessões de todos os postos — não se completa enquanto os
outros terminais não convergirem. Em D2 isso é a regra, não a exceção.
**Infeliz** (a) a sessão teve fatos que **não** estão naquele terminal (venda concluída em outro
terminal do mesmo posto) → o esperado é declarado como **parcial**, com o que falta nomeado; nunca
apresentado como completo. (b) a divergência de relógio cruza a fronteira de turno ou de dia → o fato
não é atribuído em silêncio: vira pendência com as duas interpretações à vista (`RN-OFF-019`). (c)
**qual fuso decide "hoje", turno e fechamento** quando o estabelecimento está em fuso diferente do
cliente (tenant) → `LACUNA-NUC-001`; até fechar, o fechamento **declara** o fuso que usou, e é por
isso que esta regra sobrevive às duas respostas.
**Aceite** em D2, fechar a sessão informando o contado: o fechamento existe como fato, com esperado
marcado como parcial e a pendência do fechamento do estabelecimento nomeada e contável; ao voltar a
rede, nada do fechamento é reescrito e a divergência remanescente, se houver, é fato novo.

### RN-NUC-011 — Sangria e suprimento operam offline: o dinheiro se move de verdade, e o registro segue o dinheiro

**Enunciado** sangria e suprimento são **movimentos de caixa** aditivos e imutáveis, registrados no
terminal no instante em que o dinheiro fisicamente se move, com autor, valor, sessão e motivo
(`RN-NUC-016`). Eles **operam** com o link caído.
**Precondição** sessão de caixa aberta; papel que autoriza o movimento — **retido, dentro da
validade** (`RN-OFF-024`).
**Produz** movimento de caixa (`cash_movement`) append-only, que altera o esperado da sessão.
**Motivo** e esta é a correção da linha 8: o gerente retira dinheiro da gaveta às 20h30 com o link
caído. Recusar o registro não impede a retirada — só faz o produto **perder** o fato, e o esperado da
sessão passa a mentir. Entre "não registrar dinheiro que já se moveu" e "registrar com autoridade
retida e trilha", a primeira é a que não tem volta. `RN-OFF-024` foi escrita justamente para separar
**papel retido** (autoridade, com validade) de **dado publicado**, e é ela que autoriza este desfecho
sem contradizer `RN-OFF-007`.
**Offline** **degradado** em D1, D2 e D3; classe 1 no fato, classe 4 na autoridade — e a autoridade é
satisfeita por papel retido válido, nunca criada no terminal. Pendência nomeada: confirmação pelo
servidor e revalidação do papel na reconexão.
**Infeliz** (a) papel retido ausente ou com validade vencida → **recusa**, dizendo qual autoridade
falta e que ela exige **reconectar** (`RN-OFF-024`b — reautenticar sem contato não existe, `RN-OFF-033`);
o produto **não** oferece registrar "sem autor", e **a venda no mesmo terminal continua** (`RN-OFF-032`),
porque o que expirou foi o alcance sensível, não o balcão.
(b) o dinheiro se moveu mesmo assim, sem autoridade → o produto não tem como saber, e a divergência
aparece na conferência de `RN-NUC-010`: é o desfecho honesto, não um recurso. (c) o papel usado
offline é **revogado** quando a rede volta → o movimento já registrado **não** é apagado (`PN-07`): ele
vira ocorrência escalada ao dono da fila, com autor e instante, para decisão de pessoa.
**Aceite** em D1 e em D2, com papel retido válido, registrar sangria e suprimento: os dois fatos
existem, com autor e instante do fato, o esperado da sessão muda, e os dois aparecem na contagem de
pendências. Com a validade do papel vencida, os dois são recusados e nada é gravado.

### RN-NUC-012 — Abrir gaveta são duas operações, não uma

**Enunciado** (a) abrir a gaveta **como consequência** de pagamento em espécie concluído no próprio
terminal não é operação sensível separada: a autoridade foi exercida ao concluir a venda, e o registro
da venda **é** o registro. (b) abrir a gaveta **fora** de venda é operação sensível, exige papel e
gera entrada própria na trilha com autor, instante, sessão e motivo.
**Precondição** (a) venda com pagamento em espécie concluída naquele terminal. (b) sessão aberta e
papel que autoriza — retido, dentro da validade (`RN-OFF-024`).
**Produz** (a) nada além da venda. (b) uma entrada de trilha de auditoria.
**Motivo** a linha 8 conflava as duas, e o efeito da recusa era absurdo: sem abrir a gaveta não há
troco, e sem troco a venda em espécie da linha 3 não fecha — contra `PN-01` e contra a própria célula
"integral" da linha 3. Separar também evita o oposto: encher a trilha com uma entrada por venda em
espécie, o que faz ninguém ler a trilha, e é nela que se enxerga desvio.
**Offline** (a) **integral** em D1, D2 e D3; classe 1. (b) **degradado** em D1, D2 e D3; classe 1 no
registro, classe 4 na autoridade, satisfeita por papel retido válido.
**Infeliz** (a) o periférico não responde → a venda **conclui de todo modo** (`PN-18`), e a falha da
gaveta é declarada como falha nomeada, nunca como venda bloqueada. (b) a gaveta é aberta fisicamente
por fora do produto (chave) → está fora do alcance do produto; consta como divergência na conferência
de `RN-NUC-010`, e o produto não finge tê-la registrado.
**Aceite** com o link cortado e a impressora desligada, concluir venda em espécie com troco: a gaveta
abre pelo caminho (a) sem pedir autorização adicional e sem entrada extra na trilha; a mesma abertura
solicitada fora de venda exige papel, gera entrada na trilha, e é recusada quando a validade do papel
retido expirou — **e o caminho (a) continua funcionando no mesmo minuto** (`RN-OFF-032`), porque a venda
em espécie não pode depender de autoridade com prazo.

## 2. Assumir o posto por outro

Aberta em 2026-08-23, correção pós-gate (`AUT-07` de
`docs/auditorias/2026-08-23-autorizacao-papeis-e-superficie.md`). A distinção entre abrir a **própria**
sessão e abrir a **de outro** existia só na matriz; a regra dona não a tinha, então não havia **onde**
verificá-la. O par simétrico — fechar sessão alheia — já havia sido promovido a operação própria
(`RN-NUC-030`) exatamente por esse motivo. Isto fecha a abertura pelo mesmo padrão.

### RN-NUC-037 — Abrir sessão de caixa em nome de outro operador é operação distinta da própria, e declara dois sujeitos

**Enunciado** abrir sessão de caixa **em nome de outro operador** é operação **distinta** de
`RN-NUC-009`, e não é alcançável por nenhum caminho dela: ela declara **dois** sujeitos — quem **assume**
o posto e responde pelo fundo, e quem **abriu** — e registra os dois, com o instante. `RN-NUC-009` nunca
aceita "quem assume" como valor informado; ali *quem assume* é sempre o operador identificado no
terminal.
**Precondição** nenhuma sessão aberta naquele posto; fundo declarado; autor **identificado**
(`RN-OFF-033`) portando autoridade que autoriza abrir por outro — **retida, dentro da validade**
(`RN-OFF-024`); e o operador que assume é resolvível no conjunto retido do estabelecimento, com
atribuição válida ali (`RN-NUC-020`).
**Produz** sessão de caixa aberta com **assumida por** e **aberta por** distintos, os dois na trilha,
append-only.
**Motivo** sem esta regra, uma implementação em que *quem assume* é campo de entrada satisfaz
`RN-NUC-009` integralmente e **nunca chega a verificação nenhuma**: alguém abre em nome do operador que
ainda não chegou, vende, registra sangria e sai — o fundo e a diferença ficam atribuídos a quem nunca
assumiu o posto, e a conferência de `RN-NUC-010` e `RN-NUC-030`, que existe justamente para
responsabilizar pelo fundo (`RN-NUC-004`), aponta para a pessoa errada. A necessidade, porém, é real e
não se recusa: às 6h o operador ainda não chegou e o estabelecimento precisa abrir. O que se recusa é
atendê-la **sem rastro de quem abriu** — e o mecanismo novo é melhor porque a conferência passa a ter
dois nomes a apresentar em vez de um nome errado, o que é verificável na própria trilha.
**Offline** **degradado** em D1, D2 e D3; classe 1 no fato, classe 4 na autoridade — satisfeita por papel
retido válido, nunca criada no terminal. Vencida a validade → recusa até **reconectar** (`RN-OFF-024`b),
e o caminho que não exige o papel é o próprio operador abrir a dele ao chegar (`RN-NUC-009`).
**Infeliz** (a) o operador que assume **não** é resolvível no conjunto retido → **recusa**: o produto não
aceita nome em texto no lugar de sujeito, porque é exatamente isso que faz o fundo ficar atribuído a
ninguém. (b) quem assume chega depois e **não reconhece** o fundo → é fato novo e pendência nomeada na
conferência de `RN-NUC-010`, com os dois sujeitos à vista; nunca edição do fato de abertura (`PN-07`).
(c) quem abriu **também** lançou venda naquela sessão → cada fato registra o próprio autor
(`RN-OFF-033`), a sessão contém fatos de mais de um autor, o esperado continua sendo **da sessão**, e a
responsabilidade pelo fundo continua sendo de quem assumiu.
**Aceite** às 6h, com o operador A ainda ausente, um autor identificado e com autoridade retida válida
abre a sessão do posto 1 em nome de A com fundo contado: a sessão existe com "assumida por A" e "aberta
por" o autor, os dois na trilha e nenhum dos dois omitido. A mesma operação com a validade vencida e o
link caído é **recusada até reconectar**, e o desfecho oferecido é A abrir a própria sessão ao chegar
(`RN-NUC-009`, que não é recusada). E nenhum caminho de `RN-NUC-009` produz uma sessão cujo "quem assume"
veio informado.
**Onde ela é verificada** é esta a operação da **linha 11** da matriz, cuja célula estava `?` sem operação
dona. Esta regra entrega o **lugar** de verificar; **qual** papel a alcança continua sendo o valor da
célula, do humano (`LACUNA-NUC-016`, cuja metade de papel é a que fica respondida: quem abre por outro
não é o papel-piso). Citar esta regra na linha 11 é edição de `matriz-operacao-papel.md`, fora deste
despacho.

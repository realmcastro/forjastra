# A fila local — o que ela contém, o que nunca contém, e o que ela retém depois

> **Arquivo irmão de `operacao-offline-e-sincronizacao.md`**, aberto em 2026-08-22 por decisão do humano
> sobre dois achados críticos de auditoria e por cinco requisitos do auditor. Lá está a **lei de
> convergência** (§3) e a **tabela de classificação** (§4); aqui está **um** assunto: o **conteúdo** da
> fila no terminal — confidencialidade em repouso, o que sai depois de confirmado, o que nunca entra, e
> o texto de terceiro que ela preserva.
>
> **Partido em 2026-08-23** (`AUT-14`), quando chegou a 395 linhas: o que o terminal retém para **poder
> operar** — autoridade retida, transferência, identidade e a habilitação a vender (`RN-OFF-024` a
> `RN-OFF-026`, `RN-OFF-032`, `RN-OFF-033`) — mudou para
> **`fila-local-autoridade-e-identidade.md`**, com o mesmo peso normativo e **sem alteração de conteúdo
> pela mudança de arquivo**. A **§3** deste arquivo ficou **vaga de propósito**, e o número não foi
> reaproveitado, para não invalidar citação já feita.
>
> **Piso, não teto**, como o irmão: módulo pode ser mais restritivo, nunca mais permissivo.
> **`OFF` não é módulo ativável** — é contrato transversal, e vale para o núcleo e para todo módulo.
>
> **Nenhum número aqui.** Toda duração, tamanho e margem é `LACUNA-OFF-nnn` com dono nomeado: aqui
> ficaram `012` e `014`. Desde 2026-09-23 o valor de partida de `014` mora em
> `fila-local-valores-de-partida.md` (`RN-OFF-038`), com os outros valores decididos na mesma data.
>
> `RN-OFF-021` a `RN-OFF-023`, `RN-OFF-027` e, desde 2026-09-23, `RN-OFF-039` — `028` a `031` já estavam em
> `offline-grandezas-e-orcamento.md`, e numeração **não se renumera**. Numeração continua a sequência do
> irmão e é imutável (`glossario.md` §4.2). Cenários continuam de `C-08`: aqui está `C-09`; `C-10` mudou
> para o novo irmão.

## 1. Por que este arquivo existe

`RN-OFF-014`, `RN-OFF-015` e `RN-OFF-016` são, todas as três, **anti-perda**: retenha, não descarte, não
apague, não deixe a reinstalação virar caminho de sumiço. Estão certas — perder venda concluída é perder
receita **e** descumprir obrigação fiscal. Mas as três empurram na mesma direção e **não têm contrapeso**:
lidas em conjunto e ao pé da letra, elas especificam um dispositivo de balcão acumulando **todas** as
vendas do estabelecimento, para sempre, com identificação de comprador dentro (`RN-EMI-017`) — e é isso
que sai pela porta quando o terminal é furtado (`RN-EMI-038`).

O terminal de PDV é o lugar de **menor controle** do sistema: está no balcão, no salão, na pista, é
fisicamente acessível a quem passa, e é a peça que mais se perde, se troca e se reinstala. Confiança em
repouso, portanto, não pode ser pressuposta. As quatro regras deste arquivo são o contrapeso, e nenhuma
delas enfraquece as três de cima: `RN-OFF-015` continua valendo **integralmente** para item não
confirmado.

## 2. Repouso e saída

### RN-OFF-021 — O conteúdo da fila em repouso é ilegível fora da aplicação do terminal

**Enunciado** todo fato concluído retido no terminal — venda, pagamento, agregado de módulo, trilha de
ato de assinatura (`RN-EMI-035`), documento montado ou assinado — é **confidencial em repouso**: não é
legível nem alterável por quem alcança o dispositivo **por fora da aplicação** (outro programa, outro
usuário do dispositivo, mídia retirada, cópia de apoio, dispositivo descartado ou revendido).
**Motivo** é o contrapeso que faltava (§1). Sem ele, o produto especifica um alvo que **cresce todo dia**
no lugar mais fácil de furtar, com o dado mais sensível que o negócio produz. E a necessidade que a
retenção atende não se recusa (`.claude/rules/00-nucleo.md` §12): o que se recusa é retenção **legível**.
**Aceite** com o dispositivo em mãos e a aplicação fechada, o conteúdo da fila não é legível nem
alterável; alteração é **detectável** — item que chega ao servidor divergente do que o terminal cunhou
(`RN-OFF-013`) é recusado e escalado, nunca aceito; e registro de erro, cópia de apoio e exportação de
diagnóstico do terminal não contêm conteúdo de fila (`RN-OFF-023`).
**Infeliz** o mecanismo de confidencialidade ainda não existe (é mecanismo: `LACUNA-OFF-012`; **D-01**
e **D-02** fecharam em 2026-09-11, e o mecanismo continua por escolher) → então **nenhum caminho** faz a fila conter dado de pessoa antes de
`LACUNA-OFF-008` (onde a fila reside) e `LACUNA-OFF-012` fecharem: até lá a coleta segue o mínimo de
`RN-EMI-017` (só o que a entrega escolhida exige) e o gate de `seguranca` precede qualquer construção.
Esta é a ordem, e ela é requisito de produto: **onde a fila reside fecha antes de a fila poder conter
dado de pessoa.**

### RN-OFF-022 — Item confirmado pelo servidor sai do terminal; o que fica é registro operacional mínimo, com janela declarada

**Enunciado** confirmada a chegada do fato ao servidor pela identidade cunhada no terminal
(`RN-OFF-013`), o item **sai** da fila do terminal. O que permanece localmente é o **registro
operacional** que a operação precisa — o suficiente para o operador consultar e reimprimir a venda
recente sem rede — minimizado, com janela declarada, e nunca a cópia integral do que a fila continha.
**Motivo** correção de defeito real: `RN-OFF-015` lido ao pé da letra ("nada da fila é apagado,
sobrescrito ou rotacionado") faz o terminal acumular **todas** as vendas para sempre, o oposto do que
`RN-OFF-021` exige. A necessidade por trás da retenção é legítima e não se recusa: o operador consulta e
reimprime a última venda quando a rede não está (`PN-18`, `RN-EMI-017`), e tirar isso seria entregar
menos. O mecanismo ruim é "retém tudo, para sempre, porque nunca decidimos quando sai". O mecanismo novo
é melhor porque o gatilho da saída é **confirmação**, não tempo nem espaço: limita o alvo sem nunca
apagar fato que o servidor não tem.
**Aceite** com a fila zerada, o terminal fica sem conteúdo de fila e com o registro operacional da janela
declarada; `RN-OFF-015` continua valendo integralmente para item **não confirmado** — nada não-confirmado
é apagado, compactado com perda, sobrescrito ou rotacionado, **inclusive** quando o recurso local está no
limite; e a saída do item é consequência de confirmação, nunca de tempo, de espaço ou de reinstalação
(`RN-OFF-016`).
**Infeliz** a confirmação é ambígua (resposta perdida depois do commit, `C-03`) → o item **não sai**:
permanece e é reenviado pela mesma identidade, porque a dúvida se resolve a favor de retenção. Quanto
tempo o registro operacional fica e o que ele contém: `LACUNA-OFF-014`, decidida em 2026-09-23 por
`RN-OFF-038` (até o fechamento do dia da venda, nunca mais de 48 h, sem identificação do comprador).

### RN-OFF-023 — A fila local nunca contém: lista fechada de sete itens

**Enunciado** a fila local **nunca** contém nenhum destes sete. A lista é **fechada**: item novo entra por
alteração desta regra, com motivo escrito, nunca por conveniência de construção.

1. **decisão de autoridade, e nada que a represente** — nem autorização concedida, nem prova de que foi
   concedida, nem marca que a substitua (`RN-OFF-007`, `RN-OFF-024`). Ressalva declarada, pelo mesmo
   motivo da do item 2: o **meio de identificação retido** de `RN-OFF-033` **não** é decisão de
   autoridade e **não é "estar na fila"** — ele identifica e não autoriza, tem regra, piso de repouso e
   reconciliação próprios, e não vira dado enfileirado, transferido (`RN-OFF-026`) nem reenviado.
2. **segredo de emissão — nem valor nem forma derivada** (`RN-EMI-007`). Ressalva declarada: a
   **capacidade de assinar** de `RN-EMI-033` **não é "estar na fila"** — é capacidade do ponto de emissão,
   com escopo, prazo, revogação e trilha próprios, e não vira dado enfileirado, transferido
   (`RN-OFF-026`) nem reenviado.
3. **dado de meio de pagamento além do necessário para comprovar o recebimento** — nunca número
   completo, nunca código de segurança, nunca trilha do cartão.
4. **identificação do comprador que a entrega escolhida não exige** (`RN-EMI-017`).
5. **conteúdo de conversa ou de interação com o cliente-final** (`RN-ATI-008` e `RN-PCF-010` já recusam a
   operação offline; o conteúdo também não fica retido).
6. **texto de terceiro em posição de código ou instrução** — motivo de rejeição, mensagem do autorizador
   e mensagem do servidor entram como **texto opaco** (`RN-OFF-027`): nunca interpretado, nunca
   renderizado como marcação, nunca usado como chave de decisão.
7. **dado ou identificador de outro estabelecimento ou de outro cliente.** A fila é de um terminal, de um
   estabelecimento, de um cliente — e nada mais (`RN-OFF-026`).

**Motivo** cada um dos sete entra pela mesma frase: "só desta vez, para facilitar a reconciliação". E
todos os sete pagam no mesmo lugar: o dispositivo mais exposto do sistema (`RN-OFF-021`), no evento mais
banal (`RN-EMI-038`).
**Aceite** para cada item existe o caminho declarado do que se faz **em vez** dele: autoridade → recusa
(`RN-OFF-007`) ou artefato publicado (`RN-OFF-020`); pagamento → só o que comprova o recebimento;
comprador → o mínimo da entrega escolhida; texto de terceiro → opaco. E nenhum dos sete aparece em
registro de erro, cópia de apoio ou exportação de diagnóstico do terminal.
**Infeliz** uma operação parece exigir um dos sete para convergir → é sinal de **classificação errada**
(`RN-OFF-003`), e a operação cai no default de recusa (`RN-OFF-008`) até o módulo dono reescrevê-la;
nunca exceção acrescentada à lista para destravar construção.

### RN-OFF-027 — Texto de terceiro é opaco: preservado literal, nunca interpretado, nunca renderizado como marcação, nunca chave de decisão

**Enunciado** motivo de rejeição do autorizador (`RN-EMI-018`), mensagem do servidor (`RN-OFF-012`) e
qualquer texto de fora que a spec exija preservar literalmente é **texto opaco**: guardado como recebido,
apresentado como texto, e nunca (a) interpretado como código, marcação ou instrução, (b) usado como chave
de decisão do produto, (c) tratado como isento de dado de pessoa.
**Motivo** preservar o literal está certo — é a única prova do que o terceiro disse (`RN-EMI-018`,
`RN-OFF-012`) — mas **preservar** e **confiar** são coisas diferentes, e as duas specs pediam só a
primeira. Esse texto pode conter identificação do comprador, logo herda a minimização de `RN-EMI-017` no
momento em que aparece na lista de trabalho; e decidir por ele é deixar um terceiro decidir por nós.
**Aceite** o texto chega íntegro à lista de trabalho e é exibido **como texto**; a classificação
"transitório × definitivo" (`RN-OFF-012`, `RN-EMI-019`) decorre do **estado** e do retorno declarado —
nunca de casar palavra no texto; o desfecho de pendente fiscal continua vindo da consulta ao autorizador
(`RN-EMI-029`); e o item respeita a minimização: quem tem o papel vê o texto, e ele não vai para contagem,
relatório nem exportação ampla.
**Infeliz** o texto contém identificação de comprador que aquela entrega não exigia (`RN-EMI-017`) → não é
apagado, porque é prova (`PN-08`): fica no item, com acesso restrito ao dono da fila (`RN-OFF-011`), e a
ocorrência é declarada. Nunca copiado para superfície mais ampla "para facilitar a busca".

### RN-OFF-039 — Operação recusada não entra na fila e ninguém a retenta além de quem opera; tentativa de contato de fundo não é operação

**Enunciado** operação recusada (classe 2 ou 4, default de `RN-OFF-008`, ou qualquer motivo de
`RN-NUC-043`) **não** entra na fila e **não** é retentada pelo terminal nem pelo servidor. Tentar de novo é
**ato novo de quem opera**, e cada tentativa é o seu próprio fato de recusa (`RN-NUC-043`, infeliz).
Nenhuma superfície oferece retentativa automática de operação recusada. As tentativas de contato que o
terminal faz sozinho (reconectar, receber publicação, reconciliar o conjunto de identificação) **não** são
operação recusada e não produzem `operation_refused`: o rastro delas é a transição de conectividade e os
marcos de estado do terminal (`fatos-de-operacao.md` §3). A retentativa da **drenagem** (`RN-OFF-012`,
`LACUNA-OFF-005`) e a transmissão de `EMI` (`RN-OFF-017`) são outra coisa, e não mudam.
**Motivo** responde ao achado `CST-07` (`docs/auditorias/2026-08-23-custo-de-agregacao-do-provedor-caminho-critico.md:140`)
e declara o dono do "espaçamento de retentativa de operação recusada": `produto`, que decide que ele não
existe. A cardinalidade de `operation_refused` era a duração da falha dividida pelo espaçamento, e o
espaçamento não tinha dono; sem retentativa automática, ela passa a ser a dos atos de quem opera, que o
negócio limita como limita as vendas. O eixo deixa de ser terminais × duração da queda. Recusados:
comprimir a rajada num fato com contagem, que reduz o grão sem custo medido (`RN-NUC-041`, freio a) e apaga
onde mora o sintoma "o caixa 3 não consegue"; e publicar o espaçamento como configuração, que deixa um
número que ninguém mede decidindo o tamanho da tabela mais volumosa da fase.
**Aceite** terminal em `D2` por 8 h e operador tentando sangria três vezes → exatamente três fatos de
recusa `no_contact`, nenhum sem ato de pessoa. O mesmo terminal, 8 h sem ninguém operar → zero recusas, e
só as transições de conectividade. Buscar retentativa automática de operação recusada em qualquer spec →
zero.
**Infeliz** a rajada é física (tecla presa, leitor repetindo o mesmo código) → cada leitura é tentativa e é
registrada; o recurso local é defendido pelo teto de `RN-NUC-083` e pela ordem de `RN-NUC-046`, nunca por
suprimir a segunda tentativa.
**Offline** vale igual em D1, D2 e D3.

## 3. Movida para `fila-local-autoridade-e-identidade.md` em 2026-08-23

A autoridade retida (`RN-OFF-024`), a exceção de teto (`RN-OFF-025`), a transferência de fila
(`RN-OFF-026`) e a separação que destrava `PN-01` — ato ordinário e meio de identificação retido
(`RN-OFF-032`, `RN-OFF-033`), com `C-10` — vivem no irmão de autoridade e identidade. **Nada foi alterado
de conteúdo pela mudança de arquivo.** Este número de seção fica **vago**: não é reaproveitado aqui, para
não invalidar citação já feita. Quem precisa saber **o que a fila carrega** lê este arquivo; quem precisa
saber **o que sustenta a operação sem contato** lê o irmão.

## 4. Cenários

Continuam a sequência de `operacao-offline-e-sincronizacao.md` §7 (`C-01` a `C-08`).

### C-09 — Terminal furtado no fim do serviço

**ATOR** responsável do estabelecimento, e o papel dono da fila. **GATILHO** o terminal 2 é furtado às
23h10, depois de uma tarde em **D1**.
**ESTADO INICIAL** 63 pendências retidas no terminal, 19 documentos em contingência, faixa de numeração
parcialmente consumida, capacidade de assinar concedida e ainda dentro do prazo (`RN-EMI-033`), **e o
conjunto de meios de identificação dos operadores daquele estabelecimento, retido** (`RN-OFF-033`).
**PASSOS** o responsável registra o furto · o dono da fila abre a lista de trabalho.
**O QUE O SISTEMA FAZ** trata como **comprometimento, não só perda** (`RN-EMI-038`): revoga a capacidade
de assinar (`RN-EMI-037`), **encerra** a faixa com desfecho por número não usado (`RN-EMI-022`),
notifica o cliente com o que estava retido e com **as duas janelas** de `RN-EMI-038` (c), e abre item na
lista de trabalho · quantifica a fila **até onde o servidor conhecia** e declara o restante como **perda não
quantificável**, com o intervalo desde o último contato (`RN-OFF-016`) · o conteúdo em repouso no
dispositivo é ilegível fora da aplicação (`RN-OFF-021`) e não contém nenhum dos sete de `RN-OFF-023` ·
trata o **conjunto de meios de identificação retido** como **comprometido** (`RN-OFF-033`d): o servidor
**revoga** a habilitação do terminal a vender por aquele estabelecimento (`RN-OFF-032`i) e reconcilia o
conjunto nos terminais que continuam. **A revogação tem janela, e ela é declarada** (corrigido em
2026-08-23, `AUT-16`): terminal offline **não recebe** revogação, então quem o tiver em mãos continua
praticando ato ordinário nele **até a habilitação vencer por tempo de funcionamento sem contato**: 72 h
no padrão, nunca mais de 168 h ligado, e sem limite de calendário contra quem o mantém offline e o liga
pouco (`RN-OFF-035`, que fechou `LACUNA-OFF-017` em 2026-09-23; corrigido em 2026-09-23, `SEG-T14-01`:
dizia "nunca mais de 7 dias"). A exposição é **inerente ao offline e limitada pelo prazo**, nunca
zero: afirmá-la como zero é exatamente a promessa que `RN-EMI-037`, motivo, proíbe escrever. É essa
janela que a notificação de `RN-EMI-038` (c) carrega ao cliente, ao lado da janela da capacidade de
assinar — são duas, e é a segunda que diz até quando há via saindo em nome dele.
**O QUE O OPERADOR VÊ** nada no caixa: os outros terminais seguem vendendo (`RN-OFF-018`).
**DESFECHO** capacidade revogada, faixa encerrada, cliente notificado **com as duas janelas** (até quando
a capacidade de assinar valia e até quando o terminal ainda vende), perda declarada em duas partes
(quantificada e não quantificável), nenhuma contagem em zero por falta de dado, nenhuma exposição
apresentada como zero.
**CAMINHO INFELIZ** o terminal reaparece → capacidade **não** é reativada e faixa **não** é reaberta; o
terminal volta como novo, e o que ele assinou no intervalo é fato a apurar (`RN-EMI-038`, infeliz).
**EXERCITA** `RN-OFF-016`, `RN-OFF-021`, `RN-OFF-023`, `RN-OFF-032`, `RN-OFF-033`, `RN-EMI-033`,
`RN-EMI-037`, `RN-EMI-038`.

`C-10` (papel retido vence com o link caído) mudou para `fila-local-autoridade-e-identidade.md` §4 em
2026-08-23, junto das regras que ele exercita.

## 5. Lacunas

`012` e `014` abertas em 2026-08-22, e são as que ficaram aqui. `LACUNA-OFF-001` a `010` estão em
`operacao-offline-e-sincronizacao.md` §8; `011`, `015`, `016` e `017` em
`fila-local-autoridade-e-identidade.md` §5; `LACUNA-OFF-013` em `offline-grandezas-e-orcamento.md`.

- **`LACUNA-OFF-012`** — **mecanismo** de confidencialidade em repouso (`RN-OFF-021`). Requisito é de
  produto; mecanismo dependia de **D-01** e **D-02**, que fecharam em 2026-09-11 (corrigido em 2026-09-23;
  dizia "ABERTAS"), então a lacuna está desbloqueada e segue aberta. **Dono:** `arquiteto-dados` e `backend`,
  Fase 2, com gate de `seguranca` antes de qualquer construção que retenha dado de pessoa.
- **`LACUNA-OFF-014` — FECHADA em 2026-09-23** → `RN-OFF-038`
  ([[decision-valores-de-partida-da-continuidade-offline]]). Perguntava **por quanto tempo** o terminal
  retém o registro operacional de venda já confirmada, e **o que** ele contém (`RN-OFF-022`). Até o
  fechamento do dia da venda, nunca mais de 48 h, com o que a via não fiscal mostra e sem identificação
  do comprador. A consulta a `seguranca` sobre a exposição continua pendente.

**Pergunta para o humano:** respondida em 2026-09-23 por decisão delegada (`RN-OFF-038`). As outras três
deste conjunto mudaram para o irmão de autoridade e identidade, §5.

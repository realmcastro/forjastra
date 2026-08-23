# Postura de produto — o que "nova geração" significa aqui

Este arquivo é a **lei de recusa de mecanismo**. Cada item pega uma prática arcaica do PDV, nomeia a
**necessidade real** que ela atende — necessidade já validada por quem opera todo dia — e recusa **só
o mecanismo**, entregando outro que atende a mesma necessidade **melhor, numa dimensão nomeada**.

A necessidade nunca é recusada. Ideia mal executada não é ideia ruim: o defeito quase sempre está no
mecanismo, no desempenho ou na abordagem, raramente na ideia. Recusar capacidade já validada é
entregar menos funcionalidade e chamar isso de modernidade — é defeito de produto disfarçado de
postura.

**Este arquivo tem um irmão, e os dois se completam.** `PN` é a metade que **veta**: o que não passa
na revisão, citável por número. `catalogo-de-capacidades.md` (`CAP-<COD_MODULO>-<nnn>`) é a metade
que **se agenda**: cada necessidade preservada aqui vira lá uma capacidade com dono, escopo e
critério. Necessidade que este arquivo preserva e ninguém agenda no catálogo é promessa sem
entregável. Capacidade agendada que contradiz um `PN` é spec recusada.

**A fronteira entre os dois é mecânica, e é ela que evita discussão item por item sobre o que é
"novo" e o que é "melhorado":** se o **roadmap pode agendá-la**, é capacidade e mora no catálogo; se
ela apenas **veta** o que se agenda, é postura e é `PN-nn`. O catálogo também é a casa das recusas de
capacidade candidata — recusa com motivo escrito lá não volta a cada três meses, e isso é o que
mantém este arquivo com 20 itens em vez de 200.

Formato de cada item:

| Campo | O que é |
|---|---|
| `NECESSIDADE LEGÍTIMA` | o que o mecanismo velho atende, sem mencionar mecanismo — atemporal |
| `RECUSADO` | `mecanismo` ou `capacidade`; `capacidade` obriga uma das três saídas da §Regra de formação |
| `Recusamos` | o vício concreto e observável do mecanismo arcaico |
| `Portanto o produto faz` | o mecanismo nosso, verificável |
| `MELHOR EM` | a dimensão nomeada em que o nosso é melhor, com o custo declarado quando existe |
| `Como se prova` | um caso concreto que qualquer pessoa executa |

**Como usar em revisão:** spec, modelo ou tela que contradiz um item destes é recusada citando o
número, sem discussão de gosto. Achou que o item está errado? Então muda **este** arquivo primeiro,
com o motivo registrado — não passa por baixo dele.

**O que não entrou, de propósito:** "moderno", "intuitivo", "robusto", "escalável", "amigável",
"completo". Adjetivo que não gera consequência de produto testável foi cortado, porque adjetivo não
recusa nada — na revisão, todo mundo acha que a própria spec é intuitiva. Também não entra afirmação
sobre o que produto de terceiro faz: o mecanismo arcaico é descrito como **prática observável**,
nunca atribuído a fornecedor nomeado nem a "todo o mercado".

Estes itens não são `RN` (não pertencem a um módulo). São critério transversal e são citados pelo
número: `PN-nn`. **Número nunca é renumerado nem reusado** — item errado é reescrito com o mesmo
número, item morto tem o número aposentado.

---

## PN-01 — A venda não para quando a internet cai

**NECESSIDADE LEGÍTIMA:** concluir a venda no instante em que o cliente-final está na frente do
operador, sem depender de nenhum recurso que esteja fora do alcance do terminal.
**RECUSADO:** mecanismo — a rede como pré-condição da conclusão da venda.
**Recusamos** o PDV que exibe erro de rede e trava o caixa com fila de gente esperando.
**Portanto o produto faz:** a venda continua com o que está local, o estado de conexão é visível ao
operador, e o que ficou pendente sobe sozinho quando a rede volta. Perda de conexão não é modal.
**MELHOR EM:** menos parada (zero venda perdida por rede) e menos erro — nada é anotado em papel para
ser redigitado depois, que é onde a venda some de verdade.
**Como se prova:** iniciar uma venda, cortar a rede no meio, concluir a venda e o pagamento em
dinheiro, restabelecer a rede — a venda aparece no servidor uma única vez e o fechamento do dia
fecha. Nenhum passo do teste exige intervenção de suporte.

## PN-02 — Reenviar não duplica

**NECESSIDADE LEGÍTIMA:** poder repetir uma tentativa cuja resposta se perdeu, sem que a repetição
crie um segundo fato.
**RECUSADO:** mecanismo — depender da disciplina do operador (não clicar de novo) e da conferência
manual depois.
**Recusamos** a venda dobrada porque o operador clicou de novo, a resposta se perdeu ou o terminal
reiniciou depois do commit.
**Portanto o produto faz:** toda operação que move dinheiro ou estoque carrega chave de idempotência,
e repetir devolve o **mesmo** resultado.
**MELHOR EM:** menos erro (duplicidade fica impossível, não improvável) e menos tempo — desaparece a
caça a lançamento duplicado no fechamento.
**Como se prova:** enviar a mesma requisição de venda três vezes, incluindo uma depois de derrubar a
resposta — resultado: uma venda, um pagamento, um documento.

## PN-03 — Configuração não mora no terminal

**NECESSIDADE LEGÍTIMA:** cada posto de trabalho operar conforme o que aquele negócio precisa ali —
e essa diferença ser ajustável por quem opera o negócio.
**RECUSADO:** mecanismo — a configuração como arquivo de máquina, e a visita técnica como forma de
mudá-la.
**Recusamos** o arquivo de configuração por máquina, o "esse caixa está diferente" e a visita técnica
para ligar funcionalidade.
**Portanto o produto faz:** configuração e módulos ativos são do cliente, servidos e versionados; o
terminal é substituível.
**MELHOR EM:** menos tempo (terminal queimado é trocado sem chamado) e menos erro — não existe mais
"esse caixa está diferente" como causa desconhecida.
**Como se prova:** trocar o terminal por outro do zero — ele volta a operar autenticando, sem
ninguém ajustar nada nele. E: ligar um módulo para um cliente sem deploy e sem tocar em nenhum
terminal.

## PN-04 — Tela do ramo, não tela genérica com campo inútil

**NECESSIDADE LEGÍTIMA:** o negócio ter na tela os campos e as etapas do ramo dele, e o operador não
atravessar nenhum campo que aquela operação não usa.
**RECUSADO:** mecanismo — nos dois extremos: o formulário único genérico **e** a versão de produto
por ramo.
**Recusamos** o formulário único para todos os negócios, cheio de campo que aquele cliente nunca
preenche e etapa que ele nunca usa.
**Portanto o produto faz:** a composição de tela vem de módulos ativos e configuração do cliente,
sobre um binário só; o que não está ligado não aparece.
**MELHOR EM:** menos toque por venda e menos treino (o operador só vê o que ele usa), sem o custo de
manter um produto por ramo — a especialização deixa de ser fork.
**Como se prova:** dois clientes de ramos diferentes, mesma versão instalada, telas diferentes — e
uma busca por nome de ramo (`mesa`, `bomba`, `comanda`) no núcleo retorna zero ocorrência.

## PN-05 — O fluxo de venda inteiro sem tocar na tela

**NECESSIDADE LEGÍTIMA:** concluir a venda na velocidade da mão do operador, com o dispositivo que a
operação já usa.
**RECUSADO:** mecanismo — a dependência de ponteiro, `hover` e alvo pequeno, e o leitor de código
tratado como acessório. **O toque não é recusado**: ele continua caminho válido; o que se exige é que
teclado e leitor sejam caminho **completo**, não atalho parcial.
**Recusamos** a operação que exige mouse, alvo pequeno ou `hover`, e o leitor de código tratado como
acessório.
**Portanto o produto faz:** teclado e leitor são primeira classe; todo o caminho abrir → lançar item
→ cobrar → concluir é completável sem toque.
**MELHOR EM:** menos toque e menos tempo por venda no caminho crítico — o operador não troca de
dispositivo no meio do atendimento.
**Como se prova:** fechar uma venda com três itens usando só teclado e leitor, sem encostar na tela
nem no mouse.

## PN-06 — Botão de ação frequente não muda de lugar

**NECESSIDADE LEGÍTIMA:** o operador executar o caminho crítico de memória motora, sem reler a tela —
e o produto continuar podendo evoluir de interface.
**RECUSADO:** mecanismo — o redesenho que reposiciona ação crítica como efeito colateral, sem decisão
e sem aviso. **Evoluir a interface não é recusado**: é permitido por decisão registrada com aviso.
**Recusamos** a atualização que reposiciona a tecla que o operador aprendeu de músculo, e o
treinamento que precisa recomeçar a cada versão.
**Portanto o produto faz:** posição das ações do caminho crítico é contrato; muda só com decisão
registrada e aviso, nunca como efeito colateral de redesenho.
**MELHOR EM:** menos treino (a cada versão) e menos tempo por venda. **Custo declarado:** redesenho
do caminho crítico fica mais lento de aprovar — é o preço de não retreinar o caixa de graça.
**Como se prova:** diff de duas versões: se a posição das ações do caminho crítico mudou sem decisão
registrada citando este item, a entrega é recusada.

## PN-07 — Fato concluído não se edita

**NECESSIDADE LEGÍTIMA:** corrigir o que foi registrado errado — valor, item, forma de pagamento ou a
venda inteira — no mesmo dia ou depois, e deixar o resultado financeiro certo.
**RECUSADO:** mecanismo — a edição destrutiva do fato (banco na mão, campo de observação como
conserto). **A correção em si é preservada**, por fato novo.
**Recusamos** "abre o banco e ajusta", "corrige a venda de ontem" e o campo de observação usado para
consertar valor.
**Portanto o produto faz:** venda, pagamento e movimento de caixa são append-only; correção é fato
novo (cancelamento, devolução, estorno) referenciando o original, com autor e motivo.
**MELHOR EM:** mais rastreabilidade (quem corrigiu, quando e por quê passa a existir) e menos erro —
o saldo é reconstruível a partir dos fatos, sem "ajuste manual" que ninguém sabe explicar.
**Como se prova:** tentar alterar uma venda concluída por qualquer caminho do produto — negado, e a
tentativa registrada. O saldo do dia é reconstruível a partir dos fatos, sem "ajuste manual".

## PN-08 — Regra nova não reescreve o passado

**NECESSIDADE LEGÍTIMA:** atualizar preço, tributo e regra de negócio quando a realidade muda, sem
invalidar nem alterar o que já foi emitido.
**RECUSADO:** mecanismo — a regra sem vigência, sobrescrita em cima da anterior, e o recálculo
retroativo como forma de aplicar mudança.
**Recusamos** a atualização que muda o resultado de fatos já ocorridos, e o "recalcula tudo" depois
de mudança de regra fiscal ou de preço.
**Portanto o produto faz:** regra tem vigência; o fato congela a versão de regra que o produziu.
Regimes coexistem, e migrar de regime não reescreve histórico.
**MELHOR EM:** mais informação ("por que esta venda saiu com este valor" passa a ter resposta) e
menos erro em fechamento e conferência de período já encerrado.
**Como se prova:** registrar um fato, publicar uma versão nova da regra, reconsultar/reimprimir o
fato antigo — resultado idêntico ao original. E o fato novo, no mesmo cliente, sai pela regra nova.

## PN-09 — Um produto, não um fork por cliente

**NECESSIDADE LEGÍTIMA:** cada cliente ter o sistema fazendo o que o negócio dele faz, inclusive o
que nenhum outro cliente pede.
**RECUSADO:** mecanismo — atender essa diferença com código: branch, versão especial ou condição por
cliente. **A diferença em si é preservada**, por módulo, configuração e dado.
**Recusamos** a branch por cliente, o `if cliente === 'x'` e a versão especial que só um cliente roda.
**Portanto o produto faz:** diferença entre clientes é módulo, configuração ou dado. Nunca código
condicional a cliente ou a ramo.
**MELHOR EM:** menos erro (a correção chega a todos os clientes de uma vez, em vez de N vezes) e
menos tempo de implantação e de atualização.
**Como se prova:** provisionar um cliente novo do zero reproduz um ambiente correto rodando o mesmo
conjunto de migrations mais os módulos contratados — sem nenhuma etapa manual "só para esse".

## PN-10 — O dado é do cliente, e ele consegue tirar

**NECESSIDADE LEGÍTIMA:** o comerciante levar o próprio histórico para onde precisar — contador,
banco, análise, outro sistema — quando ele decidir.
**RECUSADO:** mecanismo — o pedido ao fornecedor como via de acesso ao próprio dado.
**Recusamos** o sistema que sequestra o histórico e o relatório que só sai por pedido ao fornecedor.
**Portanto o produto faz:** o cliente exporta o próprio dado de venda, pagamento e caixa por
período, sem depender de nós.
**MELHOR EM:** menos tempo (não há chamado no caminho) e mais informação — o arquivo é utilizável por
quem não tem o nosso sistema, o que o print e o relatório fechado não são.
**Como se prova:** um operador com papel autorizado exporta as vendas de um período e o arquivo é
legível por quem não tem o nosso sistema. Nenhuma exportação inclui dado de outro cliente.

## PN-11 — Permissão não é botão escondido

**NECESSIDADE LEGÍTIMA:** alguém com autoridade liberar uma exceção na operação — desconto,
cancelamento, sangria — na hora, sem parar o caixa.
**RECUSADO:** mecanismo — a autorização existindo só na interface, o usuário único de balcão e a
senha de gerente compartilhada. **A exceção continua existindo**; o que muda é que ela tem autor.
**Recusamos** a autorização que existe só na interface, o "usuário único do balcão" e a senha de
gerente que todo mundo sabe porque não há registro de quem usou.
**Portanto o produto faz:** papel é verificado no backend em toda operação sensível, e cada uso fica
na trilha com quem, quando e o quê.
**MELHOR EM:** mais rastreabilidade (a exceção passa a ter autor identificado) e menos erro/fraude —
interface burlada deixa de ser caminho.
**Como se prova:** chamar a operação sensível (cancelar, desconto acima do limite, sangria, abrir
gaveta) com papel de caixa — negado no backend, mesmo que a interface tenha sido burlada, e a
tentativa aparece na trilha.

## PN-12 — Atualizar não para o caixa

**NECESSIDADE LEGÍTIMA:** evoluir o produto — banco, tela, regra — enquanto os negócios que dependem
dele estão vendendo.
**RECUSADO:** mecanismo — a janela de manutenção com a loja fechada, a mudança destrutiva de
estrutura e a exigência de atualizar servidor e terminais em sincronia.
**Recusamos** a janela de manutenção com a loja fechada, a migration que trava a operação em lock e
o terminal que quebra porque o servidor atualizou primeiro.
**Portanto o produto faz:** mudança de banco é forward-only com expand/contract e limite de espera
por lock; e terminal em versão anterior descarta o que não conhece em vez de travar.
**MELHOR EM:** menos parada (a atualização não pede loja fechada) e menos erro — terminal atrasado
degrada em vez de quebrar. **Custo declarado:** mudança estrutural leva mais releases.
**Como se prova:** servir a um terminal desatualizado uma composição de tela com bloco novo — a tela
abre, o bloco desconhecido é ignorado, a venda fecha. E: nenhuma migration da entrega remove,
renomeia ou trunca algo em uso.

## PN-13 — Quem calcula dinheiro é o backend

**NECESSIDADE LEGÍTIMA:** o valor cobrado ser o valor correto pela regra vigente, e o operador ver o
total no instante em que lança o item.
**RECUSADO:** mecanismo — o terminal como **fonte da verdade** do valor. Exibir total localmente na
hora continua valendo; o que ele não faz é **decidir** o valor.
**Recusamos** o total, o desconto e o imposto calculados na tela — e o terminal adulterado virando
prejuízo.
**Portanto o produto faz:** valor devido, desconto aplicável e tributo são decididos no servidor; a
interface exibe e coleta.
**MELHOR EM:** menos erro (terminal adulterado ou desatualizado não altera o que se cobra) e mais
rastreabilidade — existe um lugar único que responde por como o valor foi formado.
**Como se prova:** adulterar o valor enviado pelo terminal — o servidor recusa ou recalcula, e o
recibo sai com o valor correto.

## PN-14 — Terceiro não recebe acesso ao banco

**NECESSIDADE LEGÍTIMA:** contador, integrador e parceiro obterem o dado de que precisam, no ritmo
deles, sem que alguém exporte à mão a cada pedido.
**RECUSADO:** mecanismo — a credencial de banco compartilhada e o arquivo em pasta comum. **O acesso
do terceiro é preservado**, por contrato versionado, escopado e revogável.
**Recusamos** entregar credencial de banco para contador, integrador ou parceiro "porque é mais
rápido", e a integração feita por arquivo em pasta compartilhada.
**Portanto o produto faz:** dado sai por contrato explícito e versionado, com escopo de cliente e de
papel.
**MELHOR EM:** mais rastreabilidade (quem acessou o quê, quando) e menos tempo — o acesso se revoga
sem tocar no banco, e ninguém exporta à mão.
**Como se prova:** nenhuma credencial de banco existe fora do ambiente do servidor; o parceiro
consome o contrato publicado, e o acesso dele é revogável sem mexer no banco.

## PN-15 — Terminal não fica mudo

**NECESSIDADE LEGÍTIMA:** operador e suporte saberem, sem ferramenta técnica, se o que foi vendido já
está registrado no servidor.
**RECUSADO:** mecanismo — o silêncio do terminal, e o print pedido ao cliente como forma de
diagnóstico.
**Recusamos** o caixa que não sabe se está sincronizado, e o suporte que só descobre o problema
quando o cliente liga bravo.
**Portanto o produto faz:** estado de conexão e quantidade de pendências são visíveis no próprio
terminal, sem interpretação técnica; o mesmo estado é observável pelo suporte sem pedir print.
**MELHOR EM:** mais informação (o operador responde "há 4 pendentes" sozinho) e menos tempo de
diagnóstico — o suporte começa sabendo, em vez de perguntando.
**Como se prova:** com a rede cortada, o operador consegue dizer, olhando a tela, que há pendências e
quantas. Nenhum dado sensível (cartão, documento de pessoa, credencial) aparece nesse canal.

## PN-16 — Automação não decide dinheiro sozinha

**NECESSIDADE LEGÍTIMA:** tirar do humano o trabalho repetitivo de atendimento e de operação —
entender o pedido, montar o lançamento, sugerir o desconto cabível, preparar o fechamento.
**RECUSADO:** mecanismo — a automação com poder de **fato consumado**, e a que responde qualquer
coisa em vez de admitir que não sabe. **O trabalho automatizado é preservado**: ela faz tudo, menos o
último passo do que move valor.
**Recusamos** a automação — inclusive assistente de IA — que aplica desconto, cancela venda, altera
preço ou fecha caixa por conta própria; e a que responde qualquer coisa em vez de admitir que não
sabe.
**Portanto o produto faz:** automação **propõe**; o que move valor ou altera fato concluído exige
confirmação de operador com papel autorizado, e fica na trilha como proposta + confirmação.
**MELHOR EM:** contra o trabalho manual, menos toque e menos tempo (a proposta chega pronta); contra
a automação autônoma, menos erro irreversível e mais rastreabilidade (proposta e confirmação têm
autor). **Custo declarado:** um toque de confirmação por operação que move valor — é o preço de erro
de automação nunca virar fato financeiro.
**Como se prova:** pedir à automação algo que altera valor — ela devolve uma proposta pendente, não
um fato. Sem confirmação humana, nada mudou no dinheiro. E, sem resposta confiável, ela entrega a
conversa a um humano em vez de improvisar.

## PN-17 — Erro fala com o operador, não com o suporte

**NECESSIDADE LEGÍTIMA:** quem está na frente do cliente-final saber o que fazer a seguir quando algo
falha — e quem investiga depois ter o detalhe técnico.
**RECUSADO:** mecanismo — o código sem significado e a mensagem técnica na tela do caixa. **O detalhe
técnico não é recusado**: muda de lugar, vai para o registro interno.
**Recusamos** o código de erro sem significado, a mensagem que revela detalhe interno e o "chama o
suporte" como única saída.
**Portanto o produto faz:** todo erro exibido diz o que aconteceu e qual é a próxima ação possível,
em linguagem de operação; detalhe técnico fica no registro interno.
**MELHOR EM:** menos tempo (o operador resolve sem terceiro) e menos treino, sem perder informação —
o técnico ganha registro melhor que o print da tela.
**Como se prova:** varrer as mensagens de erro visíveis: cada uma tem ação recomendada, e nenhuma
expõe consulta, caminho de arquivo, nome de schema ou identificador de outro cliente.

## PN-18 — Periférico não é refém da venda

**NECESSIDADE LEGÍTIMA:** entregar comprovante ao cliente-final e usar os equipamentos que o negócio
já tem — impressora, gaveta, balança, leitor.
**RECUSADO:** mecanismo — o periférico como pré-condição da conclusão da venda, e o driver amarrado a
um modelo ou a uma máquina. **O comprovante é preservado**, por reemissão registrada ou outro meio.
**Recusamos** a venda que não fecha porque a impressora está sem papel, o modelo de equipamento que
amarra o cliente e o driver que só funciona em uma máquina.
**Portanto o produto faz:** periférico é capacidade opcional; falha de periférico degrada (fila,
reemissão, comprovante por outro meio) e não bloqueia a conclusão da venda.
**MELHOR EM:** menos parada (falta de papel não fecha o caixa), menos hardware obrigatório e menos
papel, quando o cliente-final aceita comprovante por outro meio.
**Como se prova:** desconectar a impressora e concluir uma venda — ela fecha, o comprovante fica
disponível para reemissão, e a reemissão é registrada.

## PN-19 — Instalar cliente novo é processo reprodutível

**NECESSIDADE LEGÍTIMA:** colocar um negócio novo em operação rápido, com o ambiente certo, sem
depender de quem faz a instalação.
**RECUSADO:** mecanismo — a implantação artesanal e o conhecimento de implantação vivendo numa pessoa.
**Recusamos** a implantação artesanal, o "só o Fulano sabe subir" e o ambiente que ninguém consegue
recriar igual.
**Portanto o produto faz:** provisionar cliente novo é rodar o conjunto de migrations do zero mais os
módulos contratados, de forma retomável e repetível.
**MELHOR EM:** menos tempo por implantação, menos erro (ambiente idêntico ao dos outros clientes) e
menos treino — implantar deixa de ser especialidade de uma pessoa.
**Como se prova:** provisionar um cliente do vazio duas vezes seguidas produz a mesma estrutura, e
rodar o processo de novo em cima do existente não estraga nada.

## PN-20 — O cliente mexe no que é dele

**NECESSIDADE LEGÍTIMA:** o negócio ajustar preço, item, operador e limite no momento em que toma a
decisão — que é decisão dele.
**RECUSADO:** mecanismo — o chamado ao fornecedor como via obrigatória de mudar dado do próprio
negócio. **Nossa ajuda continua possível**; ela deixa de ser o único caminho.
**Recusamos** cobrar chamado para mudar preço, cadastrar item, ativar operador ou ajustar um limite.
**Portanto o produto faz:** catálogo, preço, operador, papel e limites são editáveis pelo próprio
cliente, com trilha de quem mudou o quê.
**MELHOR EM:** menos tempo (a mudança vale no momento da decisão, não no dia do atendimento) e mais
rastreabilidade — a alteração passa a ter autor, o que o chamado por telefone não tinha.
**Como se prova:** o dono do negócio muda um preço e cadastra um item sem qualquer intervenção nossa,
a venda seguinte já usa o preço novo, e o preço anterior continua recuperável para a venda passada
(PN-08).

---

## Regra de formação — como nasce um `PN` novo

Vale a partir do `PN-21`. Item que não cumpre isto não entra, e o número não é gasto.

1. **Nomeie a necessidade antes de recusar qualquer coisa.** `NECESSIDADE LEGÍTIMA` é escrita sem
   citar mecanismo, tecnologia ou tela. Se a frase deixa de ser verdade quando o mecanismo muda, ela
   é mecanismo disfarçado de necessidade — reescreva.
2. **Classifique o que está sendo recusado:** `mecanismo` ou `capacidade`. Na dúvida, `capacidade` —
   falha fechado, preserva e melhora.
3. **`RECUSADO: capacidade` obriga uma das três saídas**, escrita no próprio item:
   - **(a) preservada por `CAP-<...>`** — a capacidade continua, por outro mecanismo, e existe entrada
     no catálogo de capacidades com dono declarado. É a saída normal.
   - **(b) abandonada, `MOTIVO COMERCIAL:`** — dizendo o que o comerciante perde e por que aceitamos
     perder. **Decisão do humano.** Nenhum agent escolhe esta saída sozinho.
   - **(c) erro, `PN` reescrito** — a recusa estava errada; o item é reescrito mantendo o número.

   Sem uma das três, o item é rejeitado. "É arcaico" não é saída, e "ninguém usa" sem fonte é
   suposição, não motivo.
4. **`MELHOR EM` exige dimensão nomeada**, de uma destas: menos toque, menos erro, menos tempo, menos
   treino, menos papel, menos hardware, menos parada, mais informação, mais rastreabilidade. Ganho em
   uma dimensão que custa outra declara o custo no próprio campo — trade-off escondido reprova o item.
   **"É mais moderno", "é mais limpo", "é o certo" não são dimensões e reprovam o item.**
5. **Contra o quê você é melhor:** compare com o **mecanismo recusado**, nomeado. Comparação contra
   um ideal que ninguém constrói não é ganho.
6. **`Como se prova` é caso executável** por quem não escreveu o item, sem ferramenta interna. Sem
   ele, não é critério de recusa: é desejo.
7. **Não afirme o que terceiro faz.** Nomeie a necessidade (atemporal) e o mecanismo arcaico
   (observável, sem fornecedor). Item que depende de saber o que o mercado oferece hoje é pergunta
   para o humano, não suposição.
8. **Número é imutável.** Não renumere, não reuse número aposentado, não crie `PN-07b`. Item morto
   fica com uma linha dizendo que morreu e por quê.

## Auditoria

A tabela `PN-nn → recusado → necessidade preservada` está em `postura-auditoria-pn.md` (saiu daqui
por teto de tamanho). Ela é **derivada**: divergiu do item, vale o **item**.

# Catálogo de capacidades

A **metade ofensiva** de "nova geração": o que o dono do negócio — o cliente (tenant) — **escolhe
ligar** porque é bom para a operação dele. `postura-nova-geracao.md` é a metade que **veta** mecanismo
arcaico; aqui mora o que se **agenda**.

**Critério de separação, mecânico:** se o **roadmap pode agendá-la**, é capacidade e mora aqui; se ela
apenas **veta** o que se agenda, é postura e é `PN-nn`. Ninguém precisa julgar se algo é "novo" ou
"melhorado" — a pergunta é só se existe algo para construir.

O nome espelha `catalogo-de-modulos.md` de propósito: **módulo é a unidade de ativação, capacidade é o
que ele entrega de escolha.** Toda capacidade tem **exatamente um módulo dono**, com código de
`glossario.md` §4.3; numeração `CAP-<COD_MODULO>-<nnn>`, sequencial por código a partir de `001`,
**nunca renumerada nem reaproveitada**. **Nenhuma entrada nasce aceita:** `candidata` é o máximo que
este arquivo produz — prioridade, corte e ordem de construção são do humano. `recusada` mora na §9, e
existe para dar casa barata a ideia esporádica: recusa com motivo escrito não volta a cada três meses.
`D-01` a `D-04` continuam ABERTAS e nenhuma entrada aqui as presume.

## 1. Campos obrigatórios

Falta **qualquer um** → a entrada vai para §7 (`Candidatas não desenvolvidas`), não para o catálogo.

| # | Campo | O que é |
|---|---|---|
| 1 | `NECESSIDADE` | o trabalho que o negócio precisa fazer — atemporal, **sem mencionar mecanismo** |
| 2 | `ACEITE` | uma frase testável. **Não se expande em `RN` aqui**: capacidade é candidata, não regra |
| 3 | `ELIMINA / INFORMA` | que trabalho manual desaparece, ou que decisão hoje-palpite passa a ter dado |
| 4 | `CUSTO QUE CRIA` | o par obrigatório do 3. Eliminar trabalho criando trabalho maior não é capacidade, é tarefa |
| 5 | `OBSTÁCULO` | o campo "por que ninguém já faz isso", escrito como **obstáculo concreto** (norma, custo, hardware, comportamento de operador). Renomeado porque a redação original obriga a afirmar o que terceiro faz, e isso é proibido |
| 6 | `escopo` | `nucleo \| modulo:<cod> \| vertical:<cod>`, pelo teste dos três negócios (`fronteira-do-nucleo.md` §5) |
| 7 | `arcaico` | `sim → PN-nn` (substitui mecanismo arcaico) ou `não` (necessidade que nada atende) |
| 8 | `CONEXÃO` | classe e domínio de `operacao-offline-e-sincronizacao.md`, citando a `RN-OFF-nnn` sem restatá-la |
| 9 | `EXIGE` | dado que hoje não existe, hardware, integração externa |
| 10 | `DESLIGADA` | o módulo dono funciona sem ela — se não funciona, ela não é opt-in e a entrada declara isso |
| 11 | `opt-in` | `sim` de verdade, ou `obrigatória por dependência` — e obrigatória é **piso**, não diferencial |
| 12 | `OPERA/TREINO` | quem opera e quanto treino exige (`ui.md` §3: o operador não lê) |
| 13 | `pessoa` | dado novo de pessoa: sim/não e qual |
| 14 | `CENÁRIO` | ator · gatilho · estado inicial concreto · o que o sistema faz · o que o operador vê · desfecho · caminho infeliz |

**As cinco regras que reprovam entrada:**

1. **Mecanismo não entra no nome.** O título nomeia a necessidade: "identificar e precificar o item pelo
   próprio item, sem preço afixado" é título; o meio de fazer isso não é. Mecanismo no nome viaja para
   nome de componente e de coluna — é a "vertical" desta camada, e este projeto já quase pagou esse
   defeito uma vez com a palavra "restaurante".
2. **Conferência contra todos os `PN`.** Capacidade que viola um `PN` é **recusada**, nunca exceção. Cada
   entrada cita só os `PN` que a morderam; a conferência foi feita contra os 20.
3. **Um módulo dono.** Sem dono, a entrada declara por que exigiria módulo novo — e isso é achado para
   `catalogo-de-modulos.md`, dono daquela decisão, não entrada solta aqui.
4. **Escopo `nucleo` não produz capacidade, e isso é mecânico.** Núcleo está sempre ligado
   (`fronteira-do-nucleo.md` §1), logo nada nele é opt-in: ou é piso e vira `RN-NUC-nnn`, ou é valor de
   configuração — e configuração não é capacidade (`catalogo-de-modulos.md` §1). Por isso **não existe
   seção de núcleo aqui**, por construção, não por esquecimento.
5. **Nada sobre o que terceiro faz.** Sem "todo PDV tem", sem padrão de mercado, sem número de adoção.
   Item que dependa disso é pergunta para o humano. Também não se especifica tela, tabela, coluna,
   endpoint ou bloco aqui — nem se decide prioridade, ordem de construção ou corte de MVP.

**O campo 6 não admite `provedor`, e a recusa é de 2026-08-23 (T-0004, passo 7).** A pergunta surgiu de um
caso real: *predição para nós* — derivar algo do ambiente dos clientes para **sugerir melhoria** a um deles
— não tem módulo dono, e o campo 6 admite `nucleo | modulo:<cod> | vertical:<cod>`. **Não** se acrescenta um
quarto valor, e a razão não é formal. **Necessidade preservada:** suportar, faturar, diagnosticar e sugerir
melhoria é legítimo, foi decidido em 2026-08-23 e não se recusa. **Mecanismo recusado:** hospedá-la aqui,
por três defeitos que ele cria de uma vez — este arquivo é, pelo cabeçalho, **o que o dono do negócio
escolhe ligar**, e capacidade nossa não é escolhida por ele, o que esvazia o campo 11 (`opt-in`) e o campo
10 (`DESLIGADA`); a numeração é `CAP-<COD_MODULO>-<nnn>`, e `PRV` está registrado em `glossario.md` §4.3
como **escopo**, não como módulo — `CAP-PRV-nnn` seria colisão de espécie no identificador; e o roadmap que
agenda daqui é o do **produto**, não o do nosso negócio, que é a mistura que `RN-PRV-002` existe para
fechar. **Mecanismo nosso:** o que nós entregamos ao cliente tem endereço próprio e é **regra vigente**, não
candidata — `RN-PRV-021` (sugestão), `RN-PRV-017` (nada carrega forma de outro cliente), `RN-PRV-019`
(a superfície) —, e o que ainda é comercial é `LACUNA-PRV-004` (interno × vendável), do humano. **Por que é
melhor, e como se prova:** o lado nosso fica sujeito a trilha, cláusula de contrato e default fechado de
autorização, que este catálogo não tem e não deveria ter; prova-se buscando `CAP-PRV-` no repositório →
**zero**, e encontrando cada exigência correspondente como `RN-PRV-`. **Se o humano responder que "sugerir
melhoria" é vendável** (`LACUNA-PRV-004`), a pergunta reabre — passa a existir algo que o cliente escolhe
contratar —, e aí o lugar dela é decisão de `catalogo-de-modulos.md`, não desta seção.

## 2. Método — como se procura capacidade nova numa vertical

É o entregável mais durável daqui: a próxima ficha estende a lista sem consultar ninguém. Os seis
primeiros passos são **observação da operação**, e nenhum pergunta "que tecnologia usar".

1. **O trabalho manual do operador** — o que ele conta, reconta, anda para verificar ou confere duas
   vezes. Cada ida e volta física é informação que o sistema já tinha e não entregou.
2. **O palpite que ele repete** — "acho que", "deve dar", "normalmente sai em" é decisão sem dado: é o
   campo `INFORMA` esperando ser escrito.
3. **O papel que sobrevive** — papel em uso é necessidade não atendida, e é a spec: diz qual campo faltava.
4. **A digitação dupla** — qualquer coisa escrita duas vezes, em dois lugares, pela mesma pessoa.
5. **A recusa ao cliente-final** — "sem comprovante não troco", "não tem", "não sei quanto demora": cada
   recusa é falta de informação disfarçada de política.
6. **O que muda no pico** — operação que funciona às 10h e não às 12h30 é capacidade faltando, não falha
   de operador.
7. **Só então nomeie a necessidade, atemporalmente**, e escreva os 14 campos. Se a frase deixa de ser
   verdade quando o mecanismo muda, ela é mecanismo disfarçado — reescreva.
8. **Filtros do mais barato ao mais caro:** conferência `PN` (é consulta) → teste dos três negócios (é
   uma frase) → campo 4, custo que cria → campo 5, obstáculo → classe de conexão. Ordem invertida gasta
   cenário escrito em coisa que o primeiro filtro já matava.
9. **Sem fonte, escreva `[[LACUNA]]`.** Afirmação sobre a operação de um ramo sem spec de vertical é
   invenção com cara de requisito.

## 3. Cross-vertical — capacidade de módulo que serve mais de um ramo

### CAP-PER-001 — Saber que o consumível vai acabar antes de ele acabar
`candidata` · `escopo: modulo:PER` · `arcaico: sim → PN-18` · `opt-in: sim` · `pessoa: não`
**NECESSIDADE** o negócio não descobrir que falta insumo de operação no instante em que precisa dele, com cliente-final na frente.
**ACEITE** com o consumível abaixo do limite configurado, o negócio é avisado **antes** da primeira tentativa falhar, e o aviso diz qual equipamento e onde ele fica.
**ELIMINA / INFORMA** elimina a conferência visual de rolo por equipamento; informa a reposição, hoje palpite de quem passa perto.
**CUSTO QUE CRIA** um limite a configurar por equipamento e um aviso a mais disputando atenção no pico — aviso que erra vira aviso ignorado.
**OBSTÁCULO** depende de o equipamento informar nível, ou de estimativa por consumo medido — que só existe se toda impressão passar pelo módulo.
**CONEXÃO** classe 1, aditivo (`RN-OFF-004`); integral em D1 e D2 — é local por natureza, e por isso não perde nada sem servidor.
**EXIGE** equipamento capaz de informar nível — **hardware não confirmado** (`PERGUNTAS: para humano`); a alternativa por consumo exige contagem de impressões.
**DESLIGADA** `PER` imprime igual, e a falta é descoberta na tentativa, que `PN-18` já obriga a não bloquear a venda.
**OPERA/TREINO** quem repõe (operador ou gerente); treino ~zero — um aviso, uma ação.
**CENÁRIO** gerente de estabelecimento com duas impressoras · 11h40, antes do pico · rolo do posto de caixa 2 abaixo do limite ·
o sistema avisa nomeando equipamento e local · o gerente vê aviso não bloqueante com uma única ação · rolo trocado antes do pico ·
**infeliz** equipamento não informa nível e não há contagem confiável → não liga para aquele equipamento, e a operação segue por `PN-18`.

### CAP-EST-001 — Saber que um item vai faltar enquanto ainda dá para reagir
`candidata` · `escopo: modulo:EST` · `arcaico: não` · `opt-in: sim` · `pessoa: não`
**NECESSIDADE** o negócio saber, durante o movimento, que um item vai acabar antes do fim do dia — a tempo de repor, produzir mais ou parar de oferecer.
**ACEITE** dado o consumo do próprio estabelecimento no dia, o item cuja disponibilidade não alcança o fim do turno é apresentado como falta **prevista**, com o instante da última medição visível.
**ELIMINA / INFORMA** informa decisão hoje inteiramente palpite ("acho que dá"); elimina a descoberta pela boca do cliente-final.
**CUSTO QUE CRIA** exige disponibilidade confiável, que exige contagem disciplinada — sem isso o aviso mente, e aviso que mente treina o operador a ignorar a superfície inteira.
**OBSTÁCULO** a previsão é limitada pela precisão do estoque, que é trabalho humano; e o erro é assimétrico — falso alarme custa atenção, alarme perdido custa venda.
**CONEXÃO** classe 2 por default (`RN-OFF-008`), é leitura de estado compartilhado; em D1 e D2 apresenta o retido **com instante rotulado**, nunca como estado atual (`RN-OFF-018`).
**EXIGE** disponibilidade por item de `EST` e consumo do dia; nenhum hardware.
**DESLIGADA** `EST` registra e informa disponibilidade como sempre; nenhuma previsão é composta.
**OPERA/TREINO** gerente ou dono; treino baixo, desde que a superfície diga "previsto", não "acabou".
**CENÁRIO** dona de padaria · 14h · 6 unidades de um item que sai ~8 por hora · o sistema apresenta falta prevista antes das 15h, com a medição das 13h30 ·
ela vê as faltas previstas do turno ordenadas por quando faltam · manda produzir mais · **infeliz** contagem errada e o item já tinha acabado →
o aviso sai com medição velha e rotulada, e a correção é contagem, não desligar o aviso.

### CAP-PRZ-001 — O pagador a prazo definir o que se pode consumir na conta dele
`candidata` · `escopo: modulo:PRZ` · `arcaico: sim → PN-20` · `opt-in: sim` · `pessoa: sim — vínculo entre portador autorizado e conta do pagador`
**NECESSIDADE** quem paga depois limitar previamente o que se consome na conta dele — por item, período e portador — sem depender de o operador do balcão saber a regra de cor.
**ACEITE** tentativa de lançar na conta algo fora da regra publicada pelo pagador é recusada no ato, com motivo em linguagem de operação, e a recusa fica na trilha.
**ELIMINA / INFORMA** elimina o combinado verbal que hoje vive na memória de quem atende, e a contestação no fechamento do período.
**CUSTO QUE CRIA** o pagador ganha uma regra para manter, e regra desatualizada recusa indevidamente no balcão — que é parada de atendimento; exige caminho de exceção com papel autorizado.
**OBSTÁCULO** a regra é do pagador, não do cliente (tenant): exige um terceiro mantendo configuração dentro do sistema de outro negócio, o que é identidade e acesso — **D-03 ABERTA**.
**CONEXÃO** aplicar a regra retida é classe 1 (`RN-OFF-020` — o terminal **aplica** artefato publicado); lançar **acima** do limite é autoridade, classe 4,
negado em D1, D2 e D3 (`RN-OFF-007`). É essa divisão que deixa a capacidade existir sem contradizer `PN-01`.
**EXIGE** regra do pagador como artefato publicado e versionado; identidade do portador na operação.
**DESLIGADA** `PRZ` opera com limite e saldo de conta como sempre, sem regra por item nem por portador.
**OPERA/TREINO** operador de caixa não configura nada, só lê a recusa (treino ~zero); o treino real é do pagador, fora do estabelecimento.
**CENÁRIO** operador de caixa de posto · portador de conta de terceiro apresenta itens de conveniência junto com o abastecimento · conta com regra "só combustível" publicada ·
o sistema aceita o combustível e recusa o resto na mesma tentativa, dizendo por quê · o operador vê o que passa e o que não passa e oferece pagamento imediato da diferença ·
venda fecha com dois meios · **infeliz** regra publicada errada → papel autorizado libera como exceção registrada, e corrigir a regra é do pagador, não do balcão.

### CAP-REL-001 — Decidir compra, produção e escala antes de o período começar, sabendo o quanto a antecipação erra
`candidata` · `escopo: modulo:REL` · `arcaico: não` · `opt-in: sim` · `pessoa: não`
**NECESSIDADE** quem decide quanto comprar, quanto produzir e quanta gente escalar decidir **antes** do período, com o tamanho do próprio erro à vista — em vez de decidir de memória e descobrir o erro pela sobra ou pela falta.
**ACEITE** nenhuma antecipação é apresentada sem, ao lado dela, o **erro medido** sobre períodos **fechados que não participaram da derivação**, na **unidade da decisão** (quantidade do item, não percentual solto); e ela **deixa de ser apresentada** quando esse erro ultrapassa o limite declarado por quem toma a decisão — sem limite declarado, ela não é apresentada.
**ELIMINA / INFORMA** informa a decisão que hoje é inteiramente palpite ("acho que sai", "normalmente vende"); não elimina trabalho manual nenhum, e a entrada declara isso em vez de inflar o campo.
**CUSTO QUE CRIA** três, e o terceiro é o que morde: a antecipação tem de ser **registrada antes** do período que ela antecipa (fato novo, e é a única parte irrecuperável); o erro tem de ser medido e exibido, e erro exibido reduz a confiança que o número aparentava ter; e a capacidade **se retira sozinha** quando o erro reprova — recurso que some sem explicação treina desconfiança, então a retirada é declarada com o motivo.
**OBSTÁCULO** o erro é dominado por contexto que o produto não tem (clima, evento, feriado, o que o vizinho fez) e por assimetria: faltar e sobrar não custam igual, e em perecível um erro médio bom esconde os dois. Nada disso é escolha de mecanismo — é o que a medida mostra, e é por isso que o aceite exige a medida antes da apresentação.
**CONEXÃO** classe 2 por default (`RN-OFF-008`): é leitura de agregado no servidor, logo **não existe** sem contato — e não precisa existir, porque a frescura é de **dias** (`RN-REL-002`); nunca é superfície de operação.
**EXIGE** o fato de venda no grão do **item** (já existe, `fatos-de-operacao.md` §3) · o **registro da antecipação antes do período**, que hoje não existe · a medida de erro sobre período fechado. Nenhum hardware. Depende de `LACUNA-REL-001` (teto de janela) como todo relatório da semente.
**DESLIGADA** `REL` responde sobre o que **já aconteceu**, exatamente como hoje; nenhuma antecipação é composta e nenhuma decisão existente muda.
**OPERA/TREINO** quem decide compra ou produção — `owner`, e `manager` no recorte dele por delegação nomeada (`RN-NUC-021`); a autorização depende da célula que `LACUNA-NUC-037` ainda não criou. O treino real é **ler o erro**, e é o único que a capacidade exige.
**CENÁRIO** dona de padaria · véspera do dia de maior saída · dois ciclos fechados de venda no grão do item · o sistema apresenta a quantidade antecipada por item **com o erro medido dos ciclos anteriores, na unidade de cada item** · ela vê antecipação e erro no mesmo lugar, e vê quais itens têm erro grande demais para decidir por ali · decide compra item a item, usando a antecipação onde o erro é aceitável · **infeliz** o erro medido de um item ultrapassa o limite que ela declarou → aquele item **não** recebe antecipação, diz por quê, e a decisão dele volta a ser dela, sem número nenhum fingindo apoiá-la.

**Duas coisas que esta entrada declara e não decide.** (1) **Ela muda a fronteira de `REL`**: hoje
`modulos/relatorios.md` §1 põe "projeção do que vai acontecer" **fora** do módulo, com a palavra "hoje" —
agendar esta capacidade altera aquela linha e o propósito do módulo, **na mesma passada**, e isso é custo
declarado, não descoberta futura. (2) **Quem fixa o limite de erro** é `PERGUNTAS: para humano`: existe um
limite default nosso, ou a capacidade não liga até o cliente declarar o dele? O aceite acima já o atribui a
**quem toma a decisão** (`PN-20`: o cliente mexe no que é dele), o que sobrevive às duas respostas — o que
falta é saber se há default, e default é número.

**Conferência `PN`, e os que morderam.** `PN-16` — a antecipação **propõe**, nunca executa compra nem
produção. `PN-13` — o cálculo é do backend, nunca do manifesto nem do terminal. `PN-07`/`PN-08` — a
antecipação não edita fato nem reescreve período fechado, e o erro é medido contra o período **sob a regra
que vigia nele**. `PN-20` — o limite de erro é de quem decide. Os demais não a alcançam: nenhuma parte dela
está no caminho crítico do caixa, ela não é tela, não é fork por cliente e não coleta dado de pessoa.

**O lado nosso da mesma coisa já é regra vigente, e não é candidato.** Quando a antecipação chega ao
cliente numa **sugestão nossa**, valem `RN-PRV-021` (a) a (d) desde 2026-08-23: sustentação enumerável e
do mesmo cliente, registro, marca de sustentação alterada quando um fato sustentador é corrigido, e a
natureza de projeção acompanhando o **valor** — não o artefato — com o erro medido ao lado. Se esta
capacidade for agendada, a `RN-REL-nnn` que a expandir é **escrita para casar com aquela**, não inventada.

## 4. Vertical `RES` — restaurante / alimentação servida

Fonte: `verticais/restaurante.md`. Onde o fato não está lá, vai `[[LACUNA]]`.

### CAP-COZ-001 — Prometer o tempo de espera com dado do próprio estabelecimento
`candidata` · `escopo: modulo:COZ` · `arcaico: não` · `opt-in: sim` · `pessoa: não`
**NECESSIDADE** quem atende poder dizer quanto tempo falta, e a resposta ser verdade com frequência suficiente para que ela seja usada.
**ACEITE** para um trabalho em produção o sistema apresenta previsão derivada do histórico medido **daquele** estabelecimento e ponto de produção, como faixa, e mede previsto contra realizado.
**ELIMINA / INFORMA** informa o palpite dito ao cliente-final várias vezes por serviço (§2, passo 2); elimina a ida do atendente à produção só para perguntar.
**CUSTO QUE CRIA** previsão errada é pior que ausência de previsão, porque vira promessa quebrada pelo estabelecimento; exige medir e **mostrar** o próprio erro.
**OBSTÁCULO** não há histórico no dia 0, e o tempo depende do que mais está na fila — previsão honesta declara faixa e carga, e previsão pontual soa melhor sendo indefensável.
**CONEXÃO** o terminal **aplica** parâmetro publicado e não decide nada (`RN-OFF-020`); D1 integral, como o resto de `COZ` (`RN-COZ-008`);
D2 apresenta a última previsão com instante rotulado (`RN-OFF-018`).
**EXIGE** instante de cada etapa medido por ponto — `COZ` tem isso como estado, não necessariamente como histórico retido.
**DESLIGADA** `COZ` roteia, mostra etapa e avisa "pronto" como sempre; ninguém promete tempo.
**OPERA/TREINO** o atendente de salão só lê; o operador de produção não ganha trabalho novo — se ganhar, a capacidade está errada, porque a produção é o pior ambiente físico do
estabelecimento (`verticais/restaurante.md` §4).
**CENÁRIO** atendente de salão · o cliente-final pergunta "quanto falta?" · 14 trabalhos na fila do ponto, o dele lançado há 6 minutos ·
o sistema apresenta faixa para aquele trabalho considerando a fila · o atendente vê a faixa no dispositivo com que lança, sem ir à produção · responde em segundos ·
**infeliz** histórico insuficiente para o item ou o ponto → não apresenta faixa e diz que não sabe; nunca chuta.

### CAP-MSA-001 — O cliente-final conferir o próprio consumo em aberto quando quiser
`candidata` · `escopo: modulo:MSA` · `arcaico: sim → PN-15` · `opt-in: sim` · `pessoa: não — sessão anônima basta; identificar é CLF, e a estratégia é D-03`
**NECESSIDADE** quem está consumindo saber o que já foi lançado e quanto é, no instante em que quiser saber, sem depender de alguém trazer a informação.
**ACEITE** com consumo em aberto vinculado a um lugar, o cliente-final obtém a lista lançada e o total parcial sem intervenção do atendente, e a apresentação é sempre leitura — nenhuma ação sobre a venda.
**ELIMINA / INFORMA** elimina idas e voltas do atendente para "trazer a conta"; informa o cliente-final antes da hora de pagar, que é quando a contestação hoje aparece.
**CUSTO QUE CRIA** todo erro de lançamento fica visível **na hora**, então o estabelecimento passa a corrigir em tempo real o que corrigia no fechamento — é trabalho novo, e bom, mas tem que ser declarado.
**OBSTÁCULO** exige canal para o cliente-final, e canal traz identidade do interlocutor (**D-03 ABERTA**); e total parcial é valor, que só o backend decide (`PN-13`).
**CONEXÃO** D1 opera na LAN; em D2 o estado compartilhado morre e a consulta é recusada dizendo por quê, com o último instante conhecido (`RN-OFF-005`, precedente `RN-MSA-011`).
**Não está no caminho de venda do operador**, logo não morde `PN-01`.
**EXIGE** `PCF` + `PUB` como canal — a ativação de `PCF` exige destino declarado, e aqui é `MSA`.
**DESLIGADA** `MSA` acumula e fecha como sempre; a conferência é feita pelo atendente.
**OPERA/TREINO** o cliente-final "opera" e não tem treino nenhum — logo a capacidade não pode ter estado de erro que exija explicação.
**CENÁRIO** cliente-final em mesa de 6 · quer conferir antes da última rodada · 14 itens lançados por dois atendentes · o sistema apresenta itens e total parcial em leitura ·
o atendente não vê nada novo e não é interrompido · a divergência de um item aparece ainda no meio do serviço · **infeliz** LAN fora →
apresenta o último estado conhecido com o instante e diz que pode haver lançamento mais novo; nunca apresenta estado velho como atual.

## 5. Vertical `VAR` — varejo de mercadoria

**`VAR` não tem spec de vertical.** As únicas afirmações de operação usadas aqui vêm de
`receitas-por-vertical.md` §4 — identificação afixada à mercadoria, contagem de peça, devolução e
substituição como parte normal da operação. Tudo além disso é `[[LACUNA]]`, e há bastante.

### CAP-ETQ-001 — Identificar e precificar o item pelo próprio item, sem preço afixado
`candidata` · `escopo: modulo:ETQ` · `arcaico: sim → PN-20, PN-08` · `opt-in: sim` · `pessoa: não`
Nasceu do exemplo do humano (2026-08-22): *QR impresso na própria peça de roupa substituindo a etiqueta de preço, e a venda acontecendo pela leitura dele*. O exemplo é
preservado **como exemplo**; o meio fica em aberto e é decisão técnica — código ótico impresso na peça, elemento sem contato, ou reconhecimento sem marca física são
candidatos, e escolher entre eles não é deste arquivo.
**NECESSIDADE** identificar a mercadoria e obter o preço vigente dela a partir da própria mercadoria, sem que o preço esteja fisicamente afixado nela.
**ACEITE** com a identificação lida da mercadoria, o item entra na venda com o preço **vigente no instante da venda**, e mudar o preço no catálogo não exige tocar em nenhuma unidade em loja.
**ELIMINA / INFORMA** elimina a remarcação — refazer e trocar a identificação afixada de cada unidade a cada mudança de preço — e a consulta de preço no balcão para quem pegou a peça na mão.
**CUSTO QUE CRIA** **continua sendo necessário imprimir e afixar por unidade** (é o ponto do humano): o trabalho por unidade não desaparece, ele deixa de **repetir** a cada
mudança de preço. E o preço deixa de estar legível na mercadoria, o que cria a necessidade de ele ser consultável em loja.
**OBSTÁCULO** exibição de preço ao consumidor tem regra própria no comércio e **não confirmamos qual**: remover o preço da mercadoria pode ser **ilegal** onde a exibição é
obrigatória. `PERGUNTAS: para humano` — enquanto isso não fechar, esta entrada não é agendável.
**CONEXÃO** o preço é artefato publicado que o terminal retém e **aplica** (`RN-OFF-020`): a venda opera integralmente em D1 e D2, classe 1 (`RN-OFF-004`). É isso que a
impede de contradizer `PN-01` — se precisasse consultar preço em rede, seria recusada.
**EXIGE** identificação por unidade ou por combinação vendável (com `GRD`, é a combinação); `PER` para imprimir; leitor no posto de caixa, que `PN-05` já trata como primeira classe.
**DESLIGADA** `ETQ` gera identificação com preço impresso, como hoje, e a venda sai pelo código do item.
**OPERA/TREINO** quem prepara mercadoria (afixar) e o operador de caixa (ler) — treino do caixa ~zero, ler é o gesto que ele já faz; o treino real está na retaguarda.
**CENÁRIO** operador de caixa · o cliente-final traz peça sem preço afixado · preço alterado pelo dono às 9h, peça afixada na semana anterior · o sistema resolve a
identificação e lança com o preço vigente · o operador vê item e valor sem digitar nem consultar tabela · venda fecha com o preço novo sem ninguém ter tocado na peça ·
**infeliz** identificação ilegível ou danificada → o operador cai no caminho por código do item, que nunca deixa de existir; a venda não para por causa da marca física.

### CAP-GRD-001 — Saber qual combinação está faltando antes de dizer "não tem"
`candidata` · `escopo: modulo:GRD` · `arcaico: não` · `opt-in: sim` · `pessoa: não`
**NECESSIDADE** responder a quem pergunta por uma combinação específica (cor, tamanho, sabor) sem procurar fisicamente, e saber se ela existe em outro estabelecimento do mesmo cliente (tenant).
**ACEITE** dada uma combinação vendável, o sistema informa a disponibilidade por estabelecimento do mesmo cliente (tenant), com o instante da última medição, e nenhuma consulta cruza cliente (tenant).
**ELIMINA / INFORMA** elimina a busca física na arara e o telefone para a outra unidade; informa resposta hoje dada de memória.
**CUSTO QUE CRIA** só é verdade se a contagem **por combinação** existir, e contar por combinação é sensivelmente mais trabalho que contar por item; prometer com dado ruim custa mais que não prometer.
**OBSTÁCULO** o dado por combinação é o mais caro de manter correto `[[LACUNA]]`, e a capacidade transforma erro de contagem invisível em promessa quebrada na frente do cliente-final.
**CONEXÃO** classe 2 por default (`RN-OFF-008`); em D1/D2 responde só pelo retido, com instante rotulado (`RN-OFF-018`), e a consulta entre estabelecimentos morre em D1.
**EXIGE** `EST` ligado com movimento por combinação; nada de hardware.
**DESLIGADA** `GRD` trata a combinação vendável como sempre; disponibilidade é olhada na arara.
**OPERA/TREINO** vendedor de loja; treino baixo — é consulta, e o resultado é uma frase.
**CENÁRIO** vendedor · o cliente-final pede a mesma peça em outro tamanho · combinação sem unidade aqui, 2 em outra unidade · o sistema informa as duas coisas com o instante
da medição · o vendedor vê "não aqui, 2 na unidade Y, medido há 3h" · o cliente-final decide em vez de ir embora · **infeliz** medição velha ou errada →
o sistema mostra o instante e nunca afirma "tem"; a promessa é do vendedor, com o dado à vista.

### CAP-TRC-001 — Aceitar a devolução sem exigir que o cliente-final tenha guardado o comprovante
`candidata` · `escopo: modulo:TRC` · `arcaico: sim → PN-10, PN-11` · `opt-in: sim` · `pessoa: não — identificar quem devolve é política do cliente (tenant), e é CLF`
**NECESSIDADE** o estabelecimento reconhecer que aquela mercadoria saiu dele, e em que venda, para aceitar devolução e troca sem transferir ao cliente-final o ônus de guardar papel.
**ACEITE** dada uma mercadoria apresentada para devolução, o sistema localiza a venda de origem a partir da própria mercadoria e apresenta as condições aplicáveis; sem localizar, diz que não localizou — nunca supõe.
**ELIMINA / INFORMA** elimina a busca manual por venda em período e a recusa "sem comprovante não troco"; informa quem autoriza a exceção, hoje decidida de cabeça no balcão.
**CUSTO QUE CRIA** exige identificação por **unidade**, não por item — ordem de grandeza mais trabalho na retaguarda — e faz a operação depender de a marca física sobreviver ao uso da mercadoria.
**OBSTÁCULO** identidade por unidade é caro em mercadoria de baixo valor; e devolução tem regra de prazo e condição que **não confirmamos** (`PERGUNTAS: para humano`) —
o sistema pode localizar a venda e ainda assim não poder decidir se a devolução cabe.
**CONEXÃO** localizar a venda depende do servidor: em D1/D2 é recusado dizendo por quê (classe 2, `RN-OFF-005`), e a devolução continua possível pelo caminho do núcleo com
papel autorizado. **Não é caminho de venda**, logo não morde `PN-01`.
**EXIGE** identificação por unidade persistida na venda (encosta em `CAP-ETQ-001`); autorização por papel, que o núcleo já exige.
**DESLIGADA** `TRC` resolve troca como hoje: com comprovante apresentado, ou por decisão de papel autorizado.
**OPERA/TREINO** operador de caixa e gerente; treino baixo, mas a política de exceção é do cliente (tenant), nunca do operador.
**CENÁRIO** operador de caixa · devolução sem comprovante, 9 dias depois · unidade com identificação legível · o sistema localiza venda, data e valor pago · o operador vê a
origem e a condição e não decide de cabeça · devolução registrada como fato novo referenciando a venda (`PN-07`) · **infeliz** identificação ilegível ou unidade nunca
identificada → recusa localizar e a decisão volta a ser de papel autorizado, registrada; o sistema não adivinha a venda "mais parecida".

## 6. Vertical `PST` — posto de combustível

Fonte: `receitas-por-vertical.md` §3 — equipamento que mede a saída, conferência por totalizador,
quantidade fracionária no caminho crítico. Sem spec de vertical: o resto é `[[LACUNA]]`.

### CAP-BMB-001 — Saber da divergência de medição no instante em que ela aparece, e a quem atribuir
`candidata` · `escopo: modulo:BMB` · `arcaico: sim → PN-07` · `opt-in: sim` · `pessoa: não`
**NECESSIDADE** o negócio saber que o que saiu pelo equipamento não bate com o que foi vendido enquanto ainda é possível descobrir por quê — não no fechamento, quando só resta o número.
**ACEITE** dada divergência entre leitura de totalizador e vendas do período, o sistema a apresenta com o menor recorte que o dado permite (equipamento, turno, operador), sem apagar nem ajustar nada.
**ELIMINA / INFORMA** elimina reconstituir um turno inteiro para achar de onde veio a diferença; informa a atribuição, hoje impossível depois do fechamento.
**CUSTO QUE CRIA** divergência apontada exige alguém para olhar, e divergência que ninguém olha é pior que nenhuma: cria registro de problema conhecido e não tratado.
**OBSTÁCULO** parte da divergência é física e legítima (medição tem tolerância), e separar isso de divergência real exige a norma de medição, que **não confirmamos**
(`PERGUNTAS: para humano`); sem isso o aviso alarma no que é normal.
**CONEXÃO** classe 1, aditivo (`RN-OFF-004`) — leituras e divergências são fatos que enfileiram e convergem; D1 opera na LAN com o equipamento, e nada disso altera fato concluído (`PN-07`).
**EXIGE** leitura de totalizador em cadência menor que o turno; tolerância declarada por norma — pendente.
**DESLIGADA** `BMB` confere totalizador contra vendas como sempre, no fechamento.
**OPERA/TREINO** gerente ou dono; treino baixo, e nenhum trabalho novo para o operador de caixa.
**CENÁRIO** gerente de posto · 15h, meio do turno · leitura acusa saída maior que o vendido num equipamento · o sistema apresenta a divergência com recorte de equipamento e
turno, dentro ou fora da tolerância declarada · o gerente vê onde e quando, não só quanto · investiga com o turno em andamento · **infeliz** tolerância não configurada →
a capacidade não liga; ela não adivinha tolerância, porque alarme falso em medição destrói a confiança na superfície inteira.

### CAP-BMB-002 — Cobrar exatamente o que saiu quando o cliente-final pede por valor
`candidata` · `escopo: modulo:BMB` · `arcaico: sim → PN-13` · `opt-in: sim` · `pessoa: não`
**NECESSIDADE** atender quem pede por valor em vez de por quantidade, e o que sai bater exatamente com o que se cobra, sem conversão feita de cabeça.
**ACEITE** dado um valor pedido, o sistema comunica ao equipamento o limite correspondente pelo preço vigente, e o pedido é composto pela quantidade **efetivamente medida**, nunca pela pretendida.
**ELIMINA / INFORMA** elimina a conversão mental valor→quantidade, o acerto de centavos quando o equipamento para fora do valor redondo, e a digitação de quantidade no caminho crítico.
**CUSTO QUE CRIA** depende de o equipamento aceitar limite; onde não aceita, a capacidade não existe para aquele equipamento — e operação diferente entre bicos do mesmo negócio é custo de treino.
**OBSTÁCULO** é conversa com equipamento de terceiro, cujo protocolo e capacidade **não confirmamos** (`PERGUNTAS: para humano`, hardware); presumir aqui é exatamente o que a regra proíbe.
**CONEXÃO** o valor vem de preço publicado retido e aplicado no terminal (`RN-OFF-020`) e o pedido nasce da medição local: D1 integral, classe 1 (`RN-OFF-004`). Quem decide o
valor devido continua sendo o backend (`PN-13`) — o terminal só aplica artefato publicado.
**EXIGE** equipamento capaz de receber limite; quantidade fracionária com casas declaradas, que já é núcleo.
**DESLIGADA** o operador libera o equipamento e lança a quantidade medida, como sempre.
**OPERA/TREINO** operador de caixa ou de pista; treino ~zero — é menos passo, não mais.
**CENÁRIO** operador de pista · o cliente-final pede um valor redondo · preço vigente publicado e retido no terminal · o sistema comunica o limite ao equipamento e, ao fim,
compõe o pedido pela quantidade medida · o operador vê valor e quantidade coincidirem sem digitar · venda fecha sem acerto de centavos · **infeliz** o equipamento para antes
por falta de produto → o pedido é composto pelo medido, e o valor cobrado é o do medido; nunca o pedido.

## 7. Candidatas não desenvolvidas — falta campo obrigatório

Não são recusadas: o campo faltante é uma pergunta, não uma opinião.

- **Apurar quanto do encargo nomeado é repassável e a quem** (`ECG`) — falta **ACEITE**: repasse de
  encargo e de gorjeta a quem trabalha é norma trabalhista e fiscal que **não confirmamos**, e
  `verticais/restaurante.md` §1.2 separa "taxa de serviço" de "gorjeta" porque o tratamento difere.
  `PERGUNTAS: para humano`. Encosta em folha, que `fronteira-do-nucleo.md` §2.6 põe fora do produto.
- **Separar perda real de erro de medição em tanque** (`EST` com `BMB`) — falta **ACEITE**: depende de
  tolerância e norma de medição não confirmadas. `PERGUNTAS: para humano`.
- **Explicar por que o dia foi diferente do normal** (`REL`) — falta **ACEITE** e **CUSTO QUE CRIA**: não
  sei escrever critério testável para "explicação" sem linha de base definida, e correlação apresentada
  como causa é pior que nenhuma explicação.
- **Quem é remunerado por resultado ver o próprio parcial durante o período** (`COM`) — falta **ACEITE**:
  "o resultado dele" não é definível sem a regra de apuração, que é acordo trabalhista **não confirmado**
  (`PERGUNTAS: para humano`). O resto do raciocínio sobrevive: o parcial **pode cair** (devolução é fato
  novo, `PN-07`), então a apresentação teria que declarar isso, e mostrar valor que diminui é o custo.

## 8. Horizonte — necessidade nomeada, uma linha, nada mais

Filtro pendente ou dependência não construída. Não são recusadas e não são agendáveis como estão.

- **Entregar junto o que foi pedido junto** (`COZ`) — coordenar o início nos pontos para os itens de um
  pedido saírem juntos depende do tempo de preparo medido, que é o dado que `CAP-COZ-001` ainda vai
  construir; antes disso a sequência é palpite com aparência de cálculo. **Escrita completa e reprovada
  no passo 8 do método** (filtro de dependência), não por falta de mérito.
- **Saber a que horas o lugar realmente libera** (`RSV`, exige `MSA`) — a duração depende do comportamento
  de quem está sentado: a previsão é distribuição, não relógio, e apresentá-la como relógio engana quem
  espera na porta. Volta quando `CAP-COZ-001` provar que faixa medida é aceita em operação.
- **Prever quanto produzir antes do movimento começar** (`COZ`/`EST`) — o palpite atual carrega contexto
  (tempo, evento, feriado) que o sistema não tem, e erro em perecível é irreversível. **Acrescentado em
  2026-08-23:** o freio deixou de ser opinião e passou a ser **medida** — o aceite de `CAP-REL-001` exige
  erro medido sobre período fechado fora da derivação, na unidade da decisão, antes de qualquer
  apresentação. Continua aqui, e não vira entrada, por outro campo: o **dono do módulo** difere (produção ×
  relatório de gestão) e duas entradas com a mesma necessidade sob dois nomes é catálogo duplicado.
- **Propor o complemento cabível ao pedido** (`PRM`) — propor é permitido (`PN-16`), mas sem dado de
  combinação medido a proposta é chute com aparência de recomendação.
- **O cliente-final pagar o próprio consumo em aberto sem intermediário** (`PGO` com `MSA`) — depende de
  `CAP-MSA-001` e de **D-03**; move dinheiro, então exige gate de `seguranca` antes de virar entrada.
- **O contador receber o período fechado sem pedir** (`INT`) — `PN-14` já garante o canal; falta saber o
  que ele precisa, e isso é pergunta para o humano.
- **Recompor automaticamente o que saiu da grade** (`FRN` com `GRD`) — é decisão de compra, e compra é
  dinheiro: `PN-16` obriga proposta, não execução.
- **Reconhecer o cliente-final recorrente sem ele se identificar** (`CLF`/`FID`) — dado de pessoa novo
  por definição; a decisão de coletar não é de agent nenhum.
- **Saber se a operação sensível seguiu o procedimento** (`REL` sobre a trilha do núcleo) — a trilha já
  existe (`PN-11`); lê-la como indicador de conduta é decisão sobre vigilância de trabalhador, e é do
  humano.

## 9. Recusadas

Onde o recusado é **mecanismo**, a necessidade fica nomeada e aponta para onde ela é atendida — é a regra
das quatro partes (`.claude/rules/00-nucleo.md` §12).

- **R-01 — Inferência probabilística decidindo qual item é, no caminho crítico da venda.** Necessidade
  preservada: identificar o item sem digitar código → `CAP-ETQ-001`. Mecanismo recusado: decisão provável
  assumida como certa no lançamento — item errado é preço errado, isto é, prejuízo ou fraude; a decisão
  de valor sairia do backend (`PN-13`) e passaria a exigir recurso remoto no caminho de venda (`PN-01`).
  Como caminho **assistivo com confirmação**, volta a ser discutível; como decisão, não.
- **R-02 — Preço mudando sozinho conforme demanda.** Automação não decide dinheiro (`PN-16`), e preço tem
  vigência e congela no fato (`PN-08`). A necessidade — mudar preço rápido quando a realidade muda — já é
  do dono do negócio por `PN-20`. Proposta de preço com confirmação está em §8.
- **R-03 — Exibir preço por dispositivo dedicado em cada unidade ou prateleira.** Recusada pelo campo 4
  contra o campo 3: elimina a remarcação, mas cria hardware por unidade cujo custo cresce com o número de
  itens e cuja falha é **preço exibido errado** — exposição pior que o trabalho manual removido. A mesma
  necessidade é atendida por `CAP-ETQ-001` sem hardware por unidade.
- **R-04 — Montar histórico de cliente-final a partir da identificação informada na venda, sem `CLF`.** A
  identificação opcional na venda é núcleo **para a obrigação documental**; guardar histórico é `CLF`.
  Fazer isso sem o módulo é retenção de dado de pessoa por efeito colateral — o oposto de decisão de
  produto.
- **R-05 — Reconhecer pessoa por característica física.** Dado de pessoa da categoria mais sensível,
  **D-03 ABERTA**, e a decisão de coletar não é de agent. Não é "difícil": é fora da minha alçada.
- **R-06 — Preço por janela de horário "automático".** Não é capacidade nova: é o que `PRM` faz por
  definição. Registrada porque a ideia volta com nomes diferentes, e o critério mecânico é **o que já é
  piso do módulo não ganha entrada**.
- **R-07 — Fechamento de caixa executado por automação.** `PN-16`: preparar o fechamento é permitido e
  desejável; **executar** não.

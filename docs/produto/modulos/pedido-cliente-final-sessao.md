# Módulo `PCF` — A sessão externa (fronteira de confiança do canal)

Anexo de `pedido-cliente-final.md`, **mesmo módulo e mesma numeração**: `RN-PCF-003` e
`RN-PCF-014`–`018` moram aqui, e **nada foi renumerado** (`glossario.md` §4.2). O arquivo foi partido
por um eixo só: **quem fala pelo canal, sob que escopo, com que vida, com que limite, e por que
caminho lateral esse escopo viaja.** O arquivo principal segue com propósito, fronteira, entidades,
casos de uso e as regras `001`–`002` e `004`–`013`.

**O que este arquivo não faz:** não escolhe estratégia de identidade, de sessão, de credencial nem de
referência — **D-03 está ABERTA** (`CLAUDE.md` §8), e aqui só há **requisito de negócio**, que é
entrada para aquela decisão. Não define tabela, coluna, rota, contrato técnico, tela, componente nem
stack. Não fixa número (prazo, limite, tamanho, validade): cada um é lacuna com dono na §4.

## 1. O interlocutor e como ele é identificado — requisito, não estratégia

1. **Anônimo por padrão.** Existe operação inteira de `PCF` sem nome, contato ou documento: montar,
   enviar, consumir, pagar no balcão. Identificação só onde a operação exige, e identificar **não**
   concede autoridade (`RN-PCF-004`).
2. **O contexto do lançamento é uma sessão externa escopada** a um cliente (tenant), um
   estabelecimento, um canal e um destino. Não é papel, não é operador, e não há caminho que a
   promova. O escopo é **derivado da sessão**, nunca do que o dispositivo envia (`RN-PCF-014`).
3. **A sessão é vinculada ao destino, não ao alvo, e morre com ele.** Consequência direta de
   `RN-MSA-003`: o alvo é endereço. Quem senta no lugar 12 depois não é quem sentou antes, e a ficha
   30 volta ao maço — credencial durável no alvo identificaria o **endereço** e daria a quem passar
   por ali acesso ao consumo de quem está lá agora (`RN-PCF-003`).
4. **Em superfície compartilhada, a sessão é da pessoa da vez.** O terminal tem identidade de
   terminal; a sessão sobre ele é efêmera e não sobrevive à troca de pessoa, ao abandono nem ao
   reinício.
5. **O cliente (tenant) revoga.** Invalidar as sessões de um canal, de um estabelecimento ou do módulo
   inteiro é ação dele, imediata, sem chamado e sem deploy (`RN-PCF-010`, `RN-PCF-016`).

**O que D-03 precisa responder para `PCF` funcionar** — listado, não escolhido:

- Existe um tipo de sujeito **sem pessoa** (sessão anônima, escopada, sem papel), ou toda identidade
  do sistema é operador? Se só há operador, `PCF` não tem como dar autor ao lançamento externo — e
  `RN-MSA-004` exige autor.
- Como a sessão **nasce** (por fato: abertura de consumo, criação de pedido, início de atendimento em
  superfície compartilhada) e como **morre** (encerramento do destino, conclusão, abandono,
  revogação)? Renovar além da vida do destino é vedado; o mecanismo é de D-03.
- Fica garantido que não existe escalonamento de sessão externa para papel de operador?
- Se houver **identidade persistente de cliente-final** (ele autentica e volta como a mesma pessoa —
  termo que o glossário ainda não tem), ela é separada da de operador, com espaço de autoridade
  próprio? O requisito é a separação; a forma é D-03.
- A sessão é limitada a um estabelecimento — como isso é garantido em cliente (tenant) com vários? E
  onde vive a identificação opcional (atributo do pedido, nunca credencial) com `CLF` desligado?
- Como a **revogação de efeito imediato** de `RN-PCF-016` é obtida sem depender de o dispositivo
  cooperar? O requisito é o efeito; o mecanismo é de D-03.

## 2. Regras

Campos: **Enunciado** (testável) · **Motivo** · **Aceite** (caso concreto) · **Infeliz**. Numeração
imutável e contínua com o arquivo principal.

### RN-PCF-003 — A referência que abre sessão é do destino, não do alvo

**Enunciado:** a referência apresentada para vincular sessão a um consumo em aberto é emitida **por
consumo** e morre com ele; referência durável afixada ao alvo pode iniciar atendimento naquele alvo,
mas **não** vincula sessão a consumo já aberto por outra pessoa.
**Motivo:** consequência direta de `RN-MSA-003`. O lugar 12 tem oito consumos por dia: se a credencial
fosse o alvo, quem lesse a referência de fora entraria no consumo de quem está lá agora — vendo o que
estranhos consumiram e lançando no que eles vão pagar.
**Aceite:** encerrar o consumo do lugar 12 e abrir outro no mesmo lugar → a sessão anterior não
alcança o novo consumo, nem para ver nem para lançar, mesmo com o dispositivo ainda aberto; e sessão
de superfície compartilhada não sobrevive à troca de pessoa (§1, item 4).
**Infeliz:** o cliente (tenant) quer a referência durável no alvo, aceitando que qualquer um lance no
consumo aberto de lá → é configuração dele com a consequência declarada nela (`PN-20`): lançamento
indevido passa a ser possível e corrige-se por retirada autorizada (`RN-MSA-004`). Mesmo nesse modo,
**ver** continua limitado por `RN-PCF-005`: o risco aceito é lançamento, nunca exposição.

### RN-PCF-014 — O escopo vem da sessão; identificador recebido é validado contra o vínculo

**Enunciado:** cliente (tenant), estabelecimento, canal e destino de qualquer operação do canal são
derivados **da sessão** — nunca de parâmetro, corpo, cabeçalho, endereço ou qualquer valor que o
chamador controle. E **todo** identificador de recurso que chega do canal (consumo, pedido, item
lançado, proposta, conversa, artefato) é validado contra o vínculo daquela sessão antes de qualquer
uso: leitura, escrita **e** mensagem de recusa. Identificador fora do vínculo responde **igual a
inexistente**.
**Motivo:** invariante 1 mais `RN-MSA-003`. Se o escopo viesse do dispositivo, trocar um número no
envio bastaria para lançar no consumo de outro alvo, de outro estabelecimento ou de outro cliente
(tenant). E responder "não é seu" de um jeito e "não existe" de outro transforma a recusa em oráculo:
enumerar identificadores mapeia quem está em qual alvo, e **presença é dado sensível** (§7 do arquivo
principal). É a mesma exigência que `RN-ATI-010` já faz na conversa.
**Aceite:** submeter, consultar ou propor citando identificador de consumo de outro alvo, de outro
estabelecimento ou de outro cliente (tenant), com a interface burlada → resposta **idêntica** à de
identificador inexistente, nenhum efeito, tentativa na trilha; trocar o estabelecimento no envio não
muda o estabelecimento resolvido.
**Infeliz:** o vínculo existiu e morreu (consumo encerrado, sessão revogada, superfície trocada de
pessoa) → responde também como inexistente, **sem revelar que existiu**; o caminho é abrir sessão
nova pelo fato (`RN-PCF-003`), nunca reaproveitar o identificador antigo.

### RN-PCF-015 — O escopo da sessão viaja em todo canal lateral, nomeado um por um

**Enunciado:** chave de idempotência, resultado reaproveitado, fila de trabalho, registro de operação,
via impressa, arquivo exportado, aviso e relatório derivados da submissão carregam o escopo (cliente
/tenant, estabelecimento, canal, sessão) na **própria identidade**; nenhum deles é endereçado por
valor que o chamador escolhe e que possa colidir entre sessões ou entre clientes (tenant).
**Motivo:** o schema separado protege a **consulta**; não protege o caminho lateral. Chave colidente
devolve o resultado alheio (é o defeito de `RN-PCF-006` visto por fora), e via impressa e exportação
são a saída **física** do dado — em ambiente aberto, como `cozinha.md` §6 já reconhece.
**Aceite:** duas sessões de clientes (tenant) diferentes apresentando o mesmo valor de chave ou de
identificador de artefato → nenhuma das duas lê, reaproveita ou sequer detecta o artefato da outra; a
via impressa e o arquivo exportado de um estabelecimento nunca trazem linha de outro.
**Infeliz:** aparece um canal lateral novo (integração, aviso, relatório, painel) sem escopo declarado
→ ele nasce **negado** ao canal externo (`RN-PCF-007`); declarar o escopo é condição para existir, não
melhoria posterior.

### RN-PCF-016 — Sessão tem vida declarada e revogação de efeito imediato

**Enunciado:** toda sessão externa tem fato de nascimento e fato de morte **declarados** (encerramento
do destino, conclusão, abandono, troca de pessoa em superfície compartilhada, revogação), não é
renovável além da vida do destino, e a revogação — de uma sessão, das sessões de um canal, de um
estabelecimento ou do módulo — tem efeito **imediato**: nenhuma operação iniciada antes dela produz
efeito depois dela.
**Motivo:** `RN-PCF-003` e `RN-PCF-010`. Sessão que sobrevive ao destino é a credencial durável no
alvo entrando pela porta de trás. E revogação que só vale "na próxima" deixa a janela aberta
justamente no minuto em que alguém revogou **porque** algo está errado.
**Aceite:** revogar as sessões do canal com uma submissão em trânsito → a submissão não produz
lançamento e a resposta é de sessão inexistente (`RN-PCF-014`); encerrar o consumo → nenhuma
renovação estende a sessão vinculada a ele, e nenhuma referência antiga abre outra.
**Infeliz:** a submissão saiu antes e chegou depois da revogação → vale a ordem do fato no servidor:
recusada, apresentada a quem opera (`PN-15`), resolvida por decisão humana — nunca reaplicada em
silêncio, nunca reabertura automática (`RN-PCF-009`).

### RN-PCF-017 — Toda gravação do canal tem limite por sessão declarado

**Enunciado:** cada operação do canal que **grava** algo — abrir sessão, submeter, propor (chamar
atendente, pedir retirada, pedir fechamento), escrever texto, informar identificação — tem limite por
**sessão** declarado na configuração do módulo, além de qualquer limite por canal; operação gravável
sem limite declarado **impede a ativação** do canal; e limite estourado recusa **aquela sessão**, sem
degradar o canal, as outras sessões nem a operação interna.
**Motivo:** `RN-PCF-010` protege a operação interna do canal inteiro, mas o abuso barato é de **uma**
sessão anônima: mil propostas de "chamar atendente" viram ruído em cima de quem opera, e desligar o
canal para conter uma sessão pune todos os clientes-finais que estão em serviço. É a técnica de
`RN-PCF-012` aplicada a limite: sem declaração, a proteção nasce por omissão.
**Aceite:** ativar canal com uma operação gravável sem limite declarado → **ativação recusada**,
nomeando a operação; uma sessão estourando o limite → só ela é recusada, com mensagem de operação
(`PN-17`), e as demais sessões, o cumprimento do que já foi aceito e o fluxo interno seguem intactos.
**Infeliz:** o volume legítimo de um grupo grande no mesmo alvo é confundido com abuso → o limite é
configuração do cliente (tenant) e a recusa é **da sessão**, contornável abrindo sessão nova pelo
fato; os números concretos não estão nesta spec: `[[LACUNA-PCF-4]]`.

### RN-PCF-018 — A referência que abre sessão não é adivinhável nem de uso ilimitado

**Enunciado:** a referência emitida por destino (`RN-PCF-003`) é **não enumerável** — não deriva de
número de alvo, de sequência de consumo, de data, de instante nem de qualquer dado observável de
fora — tem **uso limitado** (validade que morre com o destino, e limite declarado de sessões que ela
pode abrir), e é **revogável isoladamente**, sem encerrar nem cobrar o consumo.
**Motivo:** a via de conferência fica na mesa e é recolhida por terceiros — a referência circula
fisicamente muito além de quem consome. Se ela for derivável do alvo ou da sequência, ninguém precisa
da via: basta contar. E sem limite de uso, uma via fotografada abre sessão pelo resto do consumo, o
que reintroduz por dentro exatamente o risco que `RN-PCF-003` recusa.
**Aceite:** emitir as referências de dois consumos no mesmo alvo → nenhuma das duas é obtenível a
partir do alvo, da anterior nem do instante; apresentar referência de consumo encerrado → responde
como inexistente (`RN-PCF-014`); estourar o limite de sessões da referência → recusa, sem afetar as
sessões já abertas nem o consumo.
**Infeliz:** a via é perdida ou fotografada e o cliente (tenant) percebe → revoga **a referência**,
encerra as sessões abertas por ela e emite outra, com o consumo intacto e nada cobrado. O grau de
"não enumerável" e o limite de sessões por referência não estão nesta spec: `[[LACUNA-PCF-5]]`.

## 3. Relação com o contrato do módulo

Este anexo não cria contrato novo: o que `PCF` expõe e exige está na §7 do arquivo principal. Ele
detalha uma linha de lá — "a identidade de sessão externa — **requisito para D-03**" — e acrescenta
duas exigências ao núcleo, ambas requisito e não mecanismo: **escopo resolvido na borda a partir da
identidade** (`RN-PCF-014`) e **revogação de efeito imediato** (`RN-PCF-016`). `ATI` consome estas
regras sem ampliá-las (`RN-ATI-003`, `RN-ATI-014`).

## 4. Lacunas deste anexo

Continuam a sequência de lacunas de `PCF` (§8 do arquivo principal, `LACUNA-PCF-1`–`3`).

- `[[LACUNA-PCF-4: os limites concretos por sessão de RN-PCF-017 — quantas submissões, quantas propostas, quantas mensagens, em que janela, e o que acontece com o excedente (recusa, espera, ou nada) — dono: humano]]`
- `[[LACUNA-PCF-5: o grau de "não enumerável" exigido da referência de RN-PCF-018, o limite de sessões que uma referência pode abrir e a validade dela dentro da vida do destino — dono: humano, com seguranca; o mecanismo é técnico e depende de D-03]]`

# Continuidade offline — grandezas, configuração e o orçamento do caixa

> **Arquivo irmão de `operacao-offline-e-sincronizacao.md`**, aberto em 2026-08-22 a partir de três
> correções do auditor de performance. Lá está a **lei de convergência** e a **tabela de classificação**;
> em `fila-local-conteudo-e-repouso.md` está o **conteúdo** da fila; aqui está **um** assunto: **de quem
> é cada número**, que grandezas existem, com que unidade, e sob que condição o orçamento do caixa vale.
>
> **Nenhum valor.** Este arquivo nomeia grandeza e unidade e **não escreve número** — nem "padrão
> razoável", nem exemplo. Número não medido em spec vira orçamento por acidente.
>
> `RN-OFF-028` a `RN-OFF-031`. Numeração continua a sequência dos irmãos e é imutável (`glossario.md`
> §4.2).

## 1. De quem é o número

### RN-OFF-028 — Valor operacional é configuração por cliente, com vigência; nunca constante do produto

**Enunciado** todo valor operacional da continuidade offline é **configuração por cliente**, publicada
como dado com vigência (o precedente é `RN-FIS-009`), com padrão declarado — e **nunca** constante
embutida no produto. Entram nesta regra, ao menos: teto de operação offline (`RN-OFF-014`), limiar de
aviso de aproximação, tamanho do lote de drenagem, espaçamento entre tentativas, quantidade de tentativas
antes de "definitivo" (`RN-OFF-012`), paralelismo de drenagem, margem de recurso local (`RN-OFF-015`),
janela do registro operacional retido (`RN-OFF-022`), validade do papel retido (`RN-OFF-024`), tamanho da
exceção de teto (`RN-OFF-025`) e prazo da capacidade de assinar (`RN-EMI-033`).
**Motivo** é requisito de **produto**, e é agora, não na Fase 2: se o valor nasce constante, calibrar
depois de medir exige **deploy em N clientes** — e o cliente que mais precisa de calibragem (link ruim,
terminal fraco, pico concentrado) é justamente o que menos aguenta esperar release. É também o que impede
número inventado hoje de virar orçamento amanhã: valor publicável nasce **vazio** e é preenchido quando
alguém mede.
**Aceite** mudar qualquer um desses valores para um cliente não exige release nem migration; o valor em
vigor é consultável por cliente, com quem o definiu e desde quando; o fato concluído registra os valores
em vigor que o afetaram, como `RN-OFF-020` exige de artefato publicado; e **nenhuma** spec deste produto
contém o número (eles moram em `LACUNA-OFF-004`, `005`, `011`, `013`, `014` e `LACUNA-EMI-014`).
**Infeliz** o valor não está configurado para o cliente → vale o **padrão declarado**, e o padrão é
sempre o mais **conservador**: recusa mais cedo, retém mais, expira mais rápido — nunca o mais
permissivo; e a ausência de configuração é visível, não silenciosa.
**Exceção declarada:** grandeza de plataforma **não** é configuração de cliente (`RN-OFF-031`) — cliente
que aumentasse a dele pioraria a do vizinho.

### RN-OFF-029 — As grandezas da continuidade offline são nomeadas, com unidade e sem valor

**Enunciado** existe lista nomeada de grandezas (§2), cada uma com **unidade declarada**, **sem valor** e
com **dono**. `produto` nomeia a grandeza e diz que decisão ela informa; `performance` mede; o humano
escolhe o valor (`RN-OFF-028`).
**Motivo** grandeza sem nome não é medida, e o que não se mede é preenchido com palpite que depois vira
compromisso. Nomear separa "o que precisamos saber" de "o que achamos": é o que permite ao auditor medir
a coisa certa e ao humano decidir sabendo o que está decidindo.
**Aceite** toda decisão de construção que precise de um valor **cita a `LACUNA`** que o contém, e não
estima; nenhuma grandeza da §2 aparece com número em spec de produto; e cada uma tem dono nomeado.
**Infeliz** a construção precisa de um valor antes de a medida existir → usa o padrão conservador de
`RN-OFF-028`, **declara** que o usou e por quê, e o item entra na pauta de medição; nunca fixa constante
no código como se tivesse sido decidida.

### RN-OFF-030 — Drenar não compete com o caixa: o orçamento do caminho crítico vale com a fila no teto e drenando

**Enunciado** três condições, todas verificáveis: **(a)** o orçamento do caminho crítico do caixa (abrir
venda, adicionar item, concluir pagamento, imprimir) vale **com a fila no teto e drenando**, não em
repouso; **(b)** a drenagem é **interrompível na fronteira de agregado** (`RN-OFF-010`), sem reinício e
sem perda de progresso, e cede recurso ao caminho crítico; **(c)** a contagem de pendências que o operador
vê (`RN-OFF-018`) é **estado mantido**, não consulta refeita a cada apresentação.
**Motivo** é o momento em que as duas piores condições coincidem, e não por coincidência: a rede voltou, a
fila está cheia, e o caixa está no pico — porque foi o pico que encheu a fila. Medir "adicionar item" com
fila vazia mede o caso que não interessa. A condição (c) existe porque a contagem aparece **dentro** do
caminho crítico: consulta por apresentação transforma a informação mais útil do operador no que mais
atrasa a tela dele.
**Aceite** o ensaio de orçamento do caminho crítico é executado **em drenagem, com a fila no teto**, no
terminal-alvo modesto, e o número medido nessa condição é o que vale; interromper a drenagem no meio e
retomar não reenvia agregado já confirmado (`RN-OFF-013`, `RN-OFF-022`) e não perde progresso; a contagem
de pendências não gera consulta por apresentação.
**Infeliz** o orçamento só fecha com a fila em repouso → é **achado** de `performance` contra o produto,
não licença: ou a drenagem cede mais recurso, ou o teto é menor (`RN-OFF-014`, `LACUNA-OFF-004`). Nunca
"mede-se em repouso porque em repouso fecha".

### RN-OFF-031 — O teto de `RN-OFF-014` é por terminal; a soma é grandeza própria, de plataforma, e tem dono declarado

**Enunciado** existe uma grandeza que **nenhuma** regra deste produto limita: a **soma** das pendências em
drenagem simultânea — terminais de um cliente, e clientes de uma instância. Ela é grandeza de
**plataforma**: tem nome, unidade e dono declarado, e **não** é configuração de cliente (`RN-OFF-028`,
exceção). O produto declara o que faz ao alcançá-la: prioriza o caminho crítico (`RN-OFF-030`), espaça a
drenagem, e **nada** é descartado nem recusado por causa dela — `RN-OFF-014` e `RN-OFF-015` são por
terminal e não se aplicam à soma.
**Motivo** `RN-OFF-014` limita **um** terminal. Queda de operadora regional derruba N clientes × M
terminais ao mesmo tempo, e todos reconectam e drenam juntos, porque ninguém coordena a volta da rede: a
grandeza existe por evento externo, não por escolha nossa. Sem teto declarado, o desfecho é a drenagem de
todos degradando o caixa de todos, exatamente quando cada caixa tenta recuperar o pico que perdeu. E não
pode ser do cliente: quem aumentasse o próprio paralelismo pioraria o do vizinho — em plataforma
multi-cliente, esse número é nosso por construção.
**Aceite** a grandeza aparece na §2 com unidade e dono; existe declaração do que o produto faz ao
alcançá-la, e nenhuma das ações é descarte de fato ou recusa de venda; e o comportamento é ensaiável com
N clientes reconectando ao mesmo tempo, não só um.
**Infeliz** a soma é alcançada e a drenagem atrasa além do prazo fiscal de algum documento
(`RN-EMI-028`) → é o pior caso, e ele é **declarado**: o dono da fila de cada cliente afetado vê o item
com prazo em risco **pelo nosso lado**, não pelo dele (`RN-OFF-011`), e o produto não apresenta como falha
do cliente o atraso que é nosso. Valor e dono operacional: `LACUNA-OFF-013`.

## 2. As grandezas — unidade sim, valor nunca

Cada linha é uma grandeza que alguma decisão depende de conhecer. **Nenhuma tem valor nesta spec.**
"Mede" é quem produz o número; "decide" é quem escolhe o que fazer com ele.

| Grupo | Grandeza | Unidade | Mede | Decide |
|---|---|---|---|---|
| fila | vendas concluídas pendentes de sincronização, por terminal | contagem | `performance` | humano (`LACUNA-OFF-004`) |
| fila | agregados pendentes, por terminal | contagem | `performance` | humano |
| fila | itens por agregado | contagem | `performance` | humano |
| fila | espaço por venda pendente | bytes | `performance` | `arquiteto-dados` |
| fila | espaço livre de reserva no terminal | bytes | `performance` | humano (`RN-OFF-015`) |
| drenagem | itens por lote | contagem | `performance` | humano (`LACUNA-OFF-005`) |
| drenagem | agregados drenados em paralelo | contagem | `performance` | humano |
| drenagem | consultas por item drenado | contagem | `performance` | `backend` |
| drenagem | vazão de drenagem | itens por segundo | `performance` | humano |
| drenagem | tempo até fila zero **no pior terminal do maior cliente** | ms | `performance` | humano |
| drenagem | tentativas antes de "definitivo" e espaçamento entre elas | contagem · ms | `performance` | humano (`RN-OFF-012`) |
| faixa | identificadores por faixa pré-alocada | contagem | `performance` | humano (com o contador, `LACUNA-OFF-002`) |
| faixa | consumo de identificadores no pico | por hora | `performance` | humano |
| faixa | tempo até esgotar a faixa no pico | minutos | `performance` | humano |
| faixa | restantes no limiar de aviso | contagem | `performance` | humano |
| plataforma | terminais por cliente | contagem | `performance` | humano |
| plataforma | clientes por instância | contagem | `performance` | humano |
| plataforma | terminais reconectando no pico de volta | por segundo | `performance` | humano (`RN-OFF-031`, `LACUNA-OFF-013`) |
| caminho crítico | adicionar item, **medido sob drenagem no teto** | ms | `performance` | humano (`RN-OFF-030`) |
| caminho crítico | apresentar a contagem de pendências | ms | `performance` | `ui` |
| caminho crítico | detectar perda de contato | ms | `performance` | humano |
| retaguarda | itens na lista de trabalho (`RN-OFF-012`) | contagem | `performance` | humano |
| retaguarda | consulta da fila ordenada por prazo (`RN-EMI-028`) | ms | `performance` | `backend` |

Leitura obrigatória: as três linhas de **caminho crítico** e a de **tempo até fila zero** são as que o
auditor não pode medir em repouso (`RN-OFF-030`); a linha de **terminais reconectando** é a única cujo
dono **não** pode ser o cliente (`RN-OFF-031`).

## 3. Lacunas

- **`LACUNA-OFF-013`** — o valor da grandeza de plataforma (`RN-OFF-031`): quantos terminais reconectando
  por segundo, e quantos agregados em drenagem simultânea por instância, antes de o produto espaçar a
  drenagem; e **quem** opera esse limite do nosso lado. Não é configuração de cliente. **Dono:** humano,
  com `performance` (medida) e `backend` (o que espaçar significa no contrato). Unidade declarada; valor
  não.
- Herdadas: `LACUNA-OFF-004` (teto por terminal), `LACUNA-OFF-005` (todo número operacional da fila),
  `LACUNA-OFF-011` (validade do papel retido), `LACUNA-OFF-014` (janela do registro operacional retido),
  `LACUNA-EMI-014` (prazo da capacidade de assinar). Todas com dono nomeado nos arquivos onde nascem.

**Pergunta para o humano, uma linha:** o limite de drenagem simultânea da plataforma é decisão de
operação nossa (e de quem, do nosso lado?), ou entra como compromisso com o cliente?

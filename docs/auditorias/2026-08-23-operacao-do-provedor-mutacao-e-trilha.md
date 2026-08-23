# Auditoria — operação do provedor: o ato nosso, o rastro dele e a superfície de terceiro

**Data:** 2026-08-23 · **Escopo:** T-0004, passo 2 (gate 3, sobre o **modelo**) · **Agent:** `seguranca` ·
**Read-only.**

**Irmão de `2026-08-23-operacao-do-provedor-e-console-de-gestao.md`, com o mesmo peso.** A divisão é por
**eixo**, porque o texto único fechou em **438** linhas, acima do teto de 400. Eixo declarado: *o que se
alcança e sob que autorização* × **o ato nosso e o rastro dele**. Lá: a resposta de prioridade um, a
fronteira de `LACUNA-PRV-002`, o veredito sobre `provider_support`, o que não consegui verificar e a
reincidência, mais `PRV-01`, `PRV-02`, `PRV-06` e `PRV-10`. Aqui: `PRV-03`, `PRV-04`, `PRV-05`, `PRV-07`,
`PRV-08`, `PRV-09` e o estado do gate `PCF`/`ATI`. **Numeração contínua e única entre os dois**; o cabeçalho
de método, o objeto auditado e a contagem de severidade estão no irmão e não se repetem aqui.
**Terceiro irmão, do passo 6 (2026-08-23):** `2026-08-23-operacao-do-provedor-gate-de-fecho.md` — o gate de fecho do bloco, que reaudita o conserto destes achados, aplica `F1`–`F6` aos itens de `fatos-de-operacao*.md` e traz `PRV-11` a `PRV-16`. **Numeração contínua entre os três.**


**Por que este eixo existe separado:** toda a auditoria da T-0003 foi sobre **leitura**. Os seis achados
abaixo são o que a **mutação** trouxe de novo — e o padrão deles é um só: o ato nosso existe, e o rastro
dele não tem onde caber.

---

## 3. Achados (continuação)

### PRV-03 — Ato de papel do provedor não tem valor possível no campo "em que o ato se sustentou" de `RN-NUC-029`, e um dos dois desfechos faz o nosso ato passar por ato do cliente — [ALTO]
**ONDE:** `docs/produto/matriz-operacao-papel-contrato.md:160-165` (as fontes são "exatamente **uma de
três** e nunca 'nenhuma'": atribuição · concessão · identificação retida + habilitação do terminal) e
`:196-197` ("ato cuja concessão não é identificável é ato **sem registro** — logo não acontece");
`docs/produto/operacao-do-provedor.md:125-129` (a tabela: os dois papéis novos não portam atribuição nem concessão) e
`:158` (cita `RN-NUC-029` como se ela os acomodasse).
**CENÁRIO:** `provider_operator` edita o usuário do cliente A. O registro é **precondição do ato** e exige
uma das três fontes. Ele não tem atribuição (não é papel de cliente), não tem concessão (`RN-PRV-003`
mantém a concessão como veículo de `provider_support`) e não tem identificação retida com habilitação de
terminal (não está num terminal de A). **(a) Falha fechado:** sem valor para o campo, o ato não acontece — e
com ele não acontecem `RN-PRV-007` (o fato append-only) nem `RN-PRV-006` (a trilha). **(b) Falha aberto na
trilha:** o implementador preenche o campo com o que existe — a atribuição do usuário de A que está sendo
editado, ou um sujeito sintético — e a **nossa** mutação aparece na trilha de A sustentada por uma
atribuição **de A**. O cliente deixa de distinguir o nosso ato do dele, que é exatamente a promessa de
`RN-PRV-006`.
**POR QUE É REAL:** é a mesma forma de `AUT-15`, uma rodada depois: fonte de autoridade nova criada sem
valor no registro. `AUT-15` foi fechado acrescentando a fonte (3); ninguém acrescentou a quarta. **Não é
reincidente em sentido estrito** — `AUT-15` está corrigido; é o **padrão** que reaparece, e é sinal de
processo.
**CORREÇÃO SUGERIDA:** `RN-NUC-029` admite a **quarta** fonte — papel de escopo `provedor`, nomeado, com o
cliente-alvo no próprio registro — dono: `produto`.

### PRV-04 — `RN-PRV-006` nasce inerte, e sem a trava de concedibilidade de `RN-NUC-024` (d): os papéis novos são instanciáveis enquanto a trilha deles não tem leitor — [ALTO]
**ONDE:** `docs/produto/operacao-do-provedor.md:213-233` (`RN-PRV-006`, cujo próprio infeliz reconhece o
buraco); `docs/produto/papeis-atribuicao-e-delegacao.md:293-295` (`RN-NUC-024` d: "**enquanto ela não tiver
célula declarada na matriz a concessão não existe**: papel cujo preço não é pagável não é concedível");
`docs/produto/superficie-por-papel.md:328` e `:356` (`LACUNA-NUC-031`, estado **ausente**, negada a todos).
**CENÁRIO:** o passo 7 valora a matriz do `provedor` e `provider_operator` entra em operação em N clientes.
A operação "conferir o que o provedor fez no meu ambiente" continua **ausente** das matrizes de cliente,
logo negada a todos (`RN-NUC-026`). O `owner` não lista **um único** ato nosso. Nada impediu os papéis de
existirem, porque `RN-PRV-006` promete a legibilidade e **não** amarra a atribuibilidade do papel à
existência do leitor — que é precisamente o que `RN-NUC-024` (d) faz, e é por isso que `provider_support`
está corretamente não instanciável hoje. O desenho novo fica **pior** que o vigente no ponto em que o
vigente estava certo.
**POR QUE É REAL:** confirmo o alerta que o passo 1 registrou nos próprios riscos: é `AUT-14` se repetindo,
e é literalmente o caso descrito em
`memory/plataforma/gotcha-regra-nova-que-nao-corrige-a-celula-nasce-inerte.md`.
**CORREÇÃO SUGERIDA:** `RN-PRV-006` ganha a cláusula de `RN-NUC-024` (d) — papel de escopo `provedor` não é
atribuível enquanto a leitura da trilha não tiver célula — e a célula sai no **mesmo despacho** (passo 7) —
dono: `produto`.

### PRV-05 — O ato que altera a cobrança do cliente é justamente o que cai fora do perímetro declarado da trilha, porque o objeto vive em `platform` e não "no ambiente do cliente" — [ALTO]
**ONDE:** `docs/produto/operacao-do-provedor.md:216` ("cada ato e cada leitura nossos **no ambiente de um
cliente** … na superfície dele"); `docs/produto/operacao-do-provedor-alcance.md:20-27` (`RN-PRV-007`);
`docs/produto/fronteira-do-nucleo.md:58` ("Registro de módulos ativos por cliente | **plataforma**");
`docs/produto/papeis-e-permissoes.md:297-299` ("o registro de módulo ativo é de plataforma e nenhum artefato
diz quem o move").
**CENÁRIO:** `provider_operator` ativa um módulo pago para A. O fato é append-only, e mora no registro de
módulos ativos — que é de `platform`, não do schema de A. O implementador correto pela letra de
`RN-PRV-006` não o publica na superfície de A, porque o objeto não está no ambiente de A. A recebe a fatura
com uma cobrança que não pediu e **não tem lista** que diga quem ligou, quando e com que motivo — que é
exatamente a conferência que `RN-PRV-007` existe para tornar possível. Somado a `PRV-03`, o campo de autor
também não tem valor válido.
**POR QUE É REAL:** os dois textos são da mesma data e do mesmo conjunto; o perímetro de um ("no ambiente
do cliente") e o objeto do outro (registro em `platform`) não se encontram, e a fronteira que os separa está
escrita em terceiro arquivo, aprovado antes.
**CORREÇÃO SUGERIDA:** `RN-PRV-006` declara o perímetro como **todo ato nosso sobre o cliente, inclusive o
de objeto em `platform`** — dono: `produto`; entrada obrigatória de `D-06`.

### PRV-07 — Nossa mensagem ao cliente-final entra num canal cuja regra de distinguibilidade enumera **três** autores e não tem o quarto: renderizada como instrução de operador, o nosso ato é, para ele, ato do estabelecimento — [MÉDIO]
**ONDE:** `docs/produto/modulos/pedido-cliente-final.md:295-309` (`RN-PCF-013`: o texto aparece
"distinguível de **mensagem do produto** e de **instrução de operador**, em toda superfície que o exiba");
`docs/produto/operacao-do-provedor-alcance.md:51-53` (`RN-PRV-008` a — a atribuição é **ao cliente
(tenant)**, não ao cliente-final).
**CENÁRIO:** `provider_operator` responde ao cliente-final de A pelo canal. A enumeração de `RN-PCF-013`
tem três classes de autor e a nossa não é nenhuma; o implementador a renderiza como a única cabível,
"instrução de operador". O cliente-final lê a nossa palavra como palavra do estabelecimento — e se a
resposta estiver errada, o estabelecimento responde por uma conversa que não teve, que é o defeito que o
motivo de `RN-PRV-008` nomeia um nível acima e não fecha um nível abaixo.
**CORREÇÃO SUGERIDA:** a enumeração de `RN-PCF-013` ganha a quarta classe de autor, **ou** `RN-PRV-008`
declara que a interação nunca se renderiza no canal de `PCF` — dono: `produto`. Aumenta o que o gate de
`PCF`/`ATI` precisa cobrir (§5).

### PRV-08 — A nossa cópia de dado pessoal de cliente-final escapa do único portão de retenção que existe, porque ele é por **categoria do módulo** — [MÉDIO]
**ONDE:** `docs/produto/modulos/pedido-cliente-final.md:279-293` (`RN-PCF-012`: categoria sem prazo
declarado **impede a ativação** do canal); `docs/produto/operacao-do-provedor-alcance.md:51-56`
(`RN-PRV-008` b) e `:225-226` (`LACUNA-PRV-006`).
**CENÁRIO:** o registro da interação — com quem falamos, o que lemos, o que escrevemos — é categoria nova
de dado pessoal, criada **fora** da configuração de `PCF`, logo nunca submetida ao portão de `RN-PCF-012`.
Prazo indeclarado. O estabelecimento apaga o contato do cliente-final no prazo declarado dele, e a **nossa**
cópia continua nomeando a pessoa; `PN-10` dá ao cliente o dado dele quando sai, e nada diz que a nossa
cópia morre. É o canal lateral do item 5 de §1 (irmão) na forma mais barata: dado pessoal de terceiro sobrevivendo em
artefato nosso, sem prazo, sem dono.
**CORREÇÃO SUGERIDA:** `RN-PRV-008` declara o registro da interação como categoria sujeita ao rito de
`RN-PCF-012` (prazo declarado, ou a interação não existe) — dono: `produto`; o número é do humano
(`LACUNA-PRV-006`).

### PRV-09 — `RN-PRV-005` (b) não tem sujeito: o leitor primário não existe e o leitor do nosso lado não é nomeado — e a trilha de leitura não tem terminador declarado — [MÉDIO]
**ONDE:** `docs/produto/operacao-do-provedor.md:191-207` (`RN-PRV-005`; o aceite afirma que "a auditoria de
fato tem **outro leitor nomeado**"); `docs/produto/superficie-por-papel.md:356` (`LACUNA-NUC-031`).
**CENÁRIO, duas metades.** (i) `provider_administrator` pede a trilha do próprio uso: o aceite a concede
como leitura e remete a auditoria a "outro leitor nomeado" — que nenhuma regra nomeia. Os dois candidatos
são `provider_operator` (que lê estreito) e `provider_support` (não instanciável). Logo o único leitor que
existe de fato é o próprio portador, que é o que a cláusula (b) recusa. (ii) Se a trilha vive no schema do
cliente — e ela precisa, para o `owner` lê-la na superfície dele —, a **nossa** leitura dela é "leitura
nossa no ambiente do cliente" e, por `RN-PRV-006`, tem de ser registrada; o registro é objeto novo no
ambiente dele, cuja leitura... A regressão precisa de terminador declarado. Sem ele, ou a regra é
inimplementável (ninguém do nosso lado lê a trilha) ou o implementador para num ponto que ninguém declarou
— e o ponto onde ele para é a **primeira leitura não registrada**.
**CORREÇÃO SUGERIDA:** nomear o leitor do nosso lado, e declarar o terminador — a leitura da trilha é
registrada uma vez, e o registro do registro não é ato — dono: `produto`.

---

## 8. Gate `PCF`/`ATI` — agendado e **não cumprido**

Declarado, como o passo 1 pediu: `docs/produto/roadmap-de-modulos.md:373` lista, entre os gates agendados e
não cumpridos, `seguranca` sobre `PCF`/`ATI` e sobre o modelo da Fase 1. **Ele não foi cumprido aqui, e
esta auditoria não o substitui** — auditei `RN-PRV-008` contra `PCF`, não `PCF`.

**`RN-PRV-008` aumenta o que aquele gate precisa cobrir, em três itens nomeados:** (1) um autor que não é
papel de cliente, não tem célula e não tem coluna passa a escrever no canal do cliente-final (`PRV-07`); (2)
uma categoria de dado pessoal nasce fora do portão de retenção do módulo (`PRV-08`); (3) a leitura de dado
de pessoa fora da venda, que hoje é `N`/`?` em todas as colunas, ganha um leitor por prosa (`PRV-06`). Os
três são de autorização e de retenção, não de conversa — então o gate deixou de ser sobre um módulo e passou
a ser sobre a fronteira entre um módulo e o escopo `provedor`.

---

## 9. Nota deste eixo — o que **não** é achado, e convém não desfazer

**A trilha de leitura enumera certo.** `operacao-do-provedor.md:226-228` pede "autor, instante, **objeto** e
autoridade" — não o **valor** lido. Está certo, e é o oposto do defeito fácil: trilha que carrega o valor é
uma segunda cópia do dado que ela audita, com retenção mais longa e leitor diferente. Não abro achado porque
a enumeração já exclui; registro a guarda porque "objeto" é a palavra que um implementador transforma em
payload.

**`RN-PRV-005` (a) é desfecho certo e é inerte hoje, e o arquivo diz isso.** Quem opera não concede; sendo
uma pessoa só, a cláusula é registro. É a única maneira de a separação existir no dia da segunda pessoa sem
redesenhar nada. Nada a acrescentar.

**Volume da trilha é de `performance`, não meu.** Encaminho: leitura ampla registrada item a item cresce em
`O(leituras × clientes)`, e trilha que ninguém lê é custo sem defesa — a frase é de
`matriz-operacao-papel-modulos.md:180-183` e vale igual no escopo `provedor`.

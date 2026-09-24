# Células a valorar — a matriz do escopo `provedor` e as linhas de `REL`

> **O que este arquivo é.** Uma **folha de valoração**: linhas **candidatas** de autorização, com o
> **valor de célula em branco**. Duas frentes, entregues na mesma passada de propósito (§1 e §2). Ele
> existe porque a célula é a **autoridade única** sobre autorização (`RN-NUC-039`, `RN-PRV-015`) e o
> **valor é do humano** (`RN-NUC-026`) — nenhum agent o escreve, nem "só para destravar".
>
> **O que este arquivo não é — e a distinção decide se ele mente.** Ele **não é** uma quarta matriz. Uma
> linha daqui **não existe** para efeito de autorização: operação sem linha nas matrizes é negada a todos
> (`RN-NUC-026`), e operação de papel nosso sem célula é negada aos três (`RN-PRV-015`). Ou seja: **antes
> e depois desta folha, o desfecho de toda linha abaixo é o mesmo — negado.** O que ela muda é que a
> pergunta passa a ter forma, dono e um lugar só.
>
> **Célula em branco não é `?`.** `?` é um **valor**, com significado próprio ("ninguém decidiu", nega por
> default) e conta na contagem consolidada de `matriz-operacao-papel-modulos.md` §8. Branco é a ausência
> da própria linha: a linha ainda não foi admitida em matriz nenhuma. Consequência prática, e é o motivo
> de a distinção estar escrita: **as 43 células `?` e o total de 395 continuam exatos** (380 até
> 2026-09-23, quando o núcleo ganhou as linhas 40 a 42) — nada desta folha entra naquela contagem, e quem
> a somar produzirá um número falso.
>
> **Contrato de célula, herdado sem reescrita.** Valem os valores e sinais de `RN-NUC-026`
> (`P`, `N`, `N·cfg`, `A:<papel>`, `R`, `?`), a precedência da célula sobre a prosa (`RN-NUC-039`), o
> registro do ato (`RN-NUC-029`) e, para a §1, o default fechado do escopo (`RN-PRV-015`) e a proibição de
> sustentar ato nosso em autoridade do cliente (`RN-PRV-016`). Nada aqui altera nenhuma dessas regras.
>
> **Para onde cada bloco vai quando for valorado.** §1 **fica**: valorada, ela passa a ser *a matriz do
> escopo `provedor`*, que `RN-PRV-015` já cita e que hoje não existe — e este arquivo passa a ser ela, com
> o cabeçalho corrigido. §2 **migra**: `LACUNA-NUC-037` já declarou o destino dela — bloco próprio de
> `matriz-operacao-papel-modulos.md`, "uma linha por escopo e não por relatório". A migração é da mesma
> passada da valoração, e o que **não** se faz é deixar as duas cópias vivas.

---

## 1. Escopo `provedor` — 15 linhas candidatas, 3 papéis

**As colunas são os três papéis de `RN-PRV-003`**, e só eles: os cinco papéis das matrizes de cliente
**não** são coluna aqui, e `provider_operator`/`provider_administrator` **não** são coluna lá — é o mesmo
eixo, visto dos dois lados. `provider_support` aparece nas duas por uma razão declarada: ele é papel
nosso **dentro** do cliente, e é a coluna dele nas matrizes de cliente que faz a não-instanciabilidade
ser conferível.

**As linhas são por espécie de objeto, nunca por superfície.** É a disciplina que `LACUNA-NUC-037` já
escreveu para `REL` ("relatório novo não deve exigir célula nova"), aplicada aqui: item novo na
superfície do provedor (`superficie-do-provedor.md` §2) **não** deve exigir célula nova. Se exigir, ou a
linha estava fina demais, ou o item é de outra espécie — e aí a linha nova é o desfecho certo.

**A coluna `Sem contato`** existe pelo mesmo contrato de `RN-NUC-027`: ela é a **decisão de autorização**
sem contato, não uma observação de conectividade. Contrato dela nesta matriz, dito sem valorar: nenhum
papel nosso porta **autoridade retida** — explícito para `provider_support` (`RN-NUC-024`), e por
**default fechado** para os dois novos, que nenhuma regra a concede —, nenhum opera terminal que retém
artefato publicado, e por `RN-PRV-018` (b) a origem (ii) não se aplica ao nosso lado — logo **não há hoje
fundamento para nenhum valor diferente de `recusa` em nenhuma destas linhas**. O valor continua sendo do
humano; o que está escrito é qual regra o produz.

### 1.1 Leitura

| # | Operação de leitura | Regida por | `provider_operator` | `provider_administrator` | `provider_support` | Sem contato |
|---|---|---|---|---|---|---|
| R1 | Ler o **inventário de infraestrutura** de um cliente — versão de migration por schema, terminais habilitados e estado, estado corrente de sincronização | `RN-PRV-013`, `RN-PRV-019` (itens 3–5), `PN-15` | | | | |
| R2 | Ler o **registro de módulos ativos** de um cliente e o histórico dele | `RN-PRV-007`, `RN-PRV-013`, `RN-PRV-019` (item 1) | | | | |
| R3 | Ler **usuários, papéis e atribuições** de um cliente | `RN-PRV-012`, `RN-PRV-019` (item 2) | | | | |
| R4 | Ler a **existência binária de uso de módulo** na janela declarada | `RN-PRV-014`, `RN-PRV-019` (item 6) + `LACUNA-PRV-013` | | | | |
| R5 | Ler **dado de negócio** de um cliente, **por ocorrência**, com motivo enumerado | `RN-PRV-010`, `RN-PRV-011`, `RN-PRV-020` (a) | | | | |
| R6 | Ler o **agregado sobre todos os clientes**, em unidade nossa | `RN-PRV-009`, `RN-PRV-017` (d) + `LACUNA-PRV-010` | | | | |
| R7 | Ler a **trilha dos atos e das leituras nossas** — o nosso lado dela | `RN-PRV-005` (b), `RN-PRV-006`, `RN-PRV-011` + achado `PRV-09` | | | | |
| R8 | **Exportar** para fora do console qualquer resultado de R1 a R7 | `RN-PRV-015` (motivo), `RN-EMI-039` (precedente) | | | | |

**R7 tem um obstáculo que não é célula, e ele precede a valoração:** `RN-PRV-005` (b) exige que quem
audita **não** porte o alcance auditado, e nenhum dos três papéis serve — `provider_operator` lê
estreito, `provider_administrator` porta o alcance amplo que seria auditado, `provider_support` não é
instanciável. Valorar R7 em qualquer dos três é dar a alguém a auditoria do próprio alcance. O leitor é
pergunta ao humano (`PRV-09`), e até existir, a linha é candidata cujo único valor coerente é `N` nos
três — o que **não** resolve o achado, só o mantém visível.

**R8 é linha própria porque exportar é outra operação, e o precedente está escrito:** `RN-NUC-032` separa
reapresentar **uma** via de consultar em lote e exportar, e `RN-PRV-015` (motivo) nomeia a exportação de
diagnóstico como o caso em que se sai do escopo levando o dado inteiro num arquivo. Sem linha, ela é
negada por default — o que é o desfecho correto e é justamente por isso que a linha existe: para que a
negativa seja **decidida**, e não apenas herdada da omissão.

### 1.2 Ato

| # | Operação de ato | Regida por | `provider_operator` | `provider_administrator` | `provider_support` | Sem contato |
|---|---|---|---|---|---|---|
| A1 | **Provisionar** cliente novo · **encerrar** cliente | `RN-PRV-013` + `LACUNA-PRV-006` | | | | |
| A2 | **Ativar ou desativar módulo** de um cliente (altera cobrança) | `RN-PRV-007`, `RN-PRV-012` + `LACUNA-PRV-003` | | | | |
| A3 | **Editar** usuário, papel ou atribuição de um cliente | `RN-PRV-012`, `RN-PRV-004` (mutação) | | | | |
| A4 | **Conceder e revogar** concessão de `provider_support` | `RN-NUC-024`, `RN-PRV-005` | | | | |
| A5 | **Interagir com o cliente-final** de um cliente | `RN-PRV-008` — **inerte** até a resposta do advogado | | | | |
| A6 | **Emitir sugestão** ao cliente | `RN-PRV-021` — **provisória** (`LACUNA-PRV-004`, `LACUNA-PRV-007`) | | | | |
| A7 | **Atribuir o primeiro `owner`**, dentro do ato que provisiona o cliente (A1) | `RN-NUC-090`, `RN-PRV-013` | | | | |

**A7 entrou em 2026-09-23** (`T-0015`, B.1 §2, `docs/produto/identidade-necessidade-e-fronteira-2026-09-23.md:134-188`),
e é linha própria porque o objeto é outro: A1 cria o cliente, A7 cria a primeira **atribuição** nele. As
duas não se separam no tempo, porque `RN-NUC-090` põe a atribuição no mesmo ato do provisionamento, e é
isso que dispensa resolver o alvo fora do pedido. Para a valoração: A7 valorada `P` num papel em que A1
não é `P` é linha que não se consuma; e depois do primeiro `owner`, atribuir papel no cliente é só dele
(linha 20 do núcleo), então A7 não é "editar atribuição" e não se confunde com A3.

**Três observações que a valoração precisa ter à vista, e nenhuma é valor.** (1) **A2 não se consuma sem
a regra de confirmação** (`LACUNA-PRV-003`): mesmo valorada `P`, a operação continua negada até alguém
dizer quem confirma o que altera cobrança. (2) **A4 tem uma proibição que nenhuma célula pode contrariar:**
ninguém concede a si mesmo (`RN-NUC-024`, infeliz; `RN-PRV-005`) — valorar A4 e R5/R7 no mesmo papel é
concentração que a regra já recusa, e a divergência seria achado, não configuração. (3) **A5 e A6 estão
declaradas inerte e provisória**: valorá-las não as ativa, porque o que as trava não é célula.

### 1.3 Duas travas que a valoração não remove

Valorar as 15 linhas **não** faz o escopo operar. Continuam de pé, e é o desfecho correto:
`RN-PRV-004` (d) — com `D-03` ABERTA, o ato nosso que nomeia cliente **não acontece**; e `RN-PRV-016` —
enquanto `RN-NUC-029` não admitir a **quarta fonte** (papel de escopo `provedor`, com o cliente-alvo
resolvido no próprio registro), o registro é impossível e **registro impossível impede o ato**. As duas
são frase, e as duas são do humano.

---

## 2. `REL` — 2 linhas candidatas, e é `LACUNA-NUC-037`

**O estado que esta folha existe para mudar:** `REL` tem **seis relatórios especificados** (`RN-REL-009` a
`014`) e **nenhuma célula em nenhuma das três matrizes**. Logo ler relatório de gestão é **negado a
todos** (`RN-NUC-026`), e o campo `QUEM` de cada relatório — mais o papel citado no aceite de
`RN-REL-006` — é **candidato, nunca concessão** (`RN-NUC-039`). Não é dívida de análise: a especificação
está completa e o que falta é a valoração.

**Duas linhas, não seis, e o desenho é de `LACUNA-NUC-037`:** uma linha **por escopo**, não por
relatório — "relatório novo não deve exigir célula nova". O escopo de cada relatório já está decidido por
`RN-REL-006` (estabelecimento × cliente), então a linha que resta é a de **quem lê em cada escopo**.

**Colunas: os cinco papéis das matrizes de cliente**, porque `REL` é módulo de cliente e a leitura é
avaliada no escopo do **objeto** (`RN-NUC-018`).

| # | Operação de leitura | Regida por | `cashier` | `manager` | `owner` | `fiscal_officer` | `provider_support` | Offline |
|---|---|---|---|---|---|---|---|---|
| L1 | Ler relatório de gestão de `REL` no escopo **estabelecimento** | `RN-REL-001` (campo 2), `RN-REL-006` + `LACUNA-NUC-037` | | | | | | |
| L2 | Ler relatório de gestão de `REL` no escopo **cliente** (soma dos estabelecimentos dele) | `RN-REL-006` + `LACUNA-NUC-037` | | | | | | |

**O que a valoração já tem decidido em volta, e não precisa redecidir.** (a) Os **candidatos** que a spec
nomeia: `owner` no escopo cliente; `manager` no recorte do estabelecimento dele, e no escopo cliente
**nunca por default** — só por delegação nomeada (`RN-NUC-021`, `RN-REL-009`). (b) `cashier` **não é
candidato em nenhum dos dois**, e é resposta, não omissão: ele não toma nenhuma das seis decisões, e dar
agregado do estabelecimento ao papel-piso é dar-lhe número sem decisão
(`relatorios-semente-de-perguntas.md` §2). (c) `provider_support` **não é candidato**: a concessão nomeia
diagnóstico, não leitura de agregado de gestão, e nunca alcança contagem que soma clientes
(`RN-NUC-024`, `RN-EMI-040`). (d) `manager` valorado em L2 é o caso silencioso que `RN-REL-006` (motivo)
descreve: gerente de uma loja lendo o resultado da outra por dentro de um total "do cliente" — não cruza
schema, então nenhuma defesa de isolamento por cliente o pega, e são pessoas jurídicas diferentes.
(e) A coluna `Offline`: relatório tem frescura de **dias** (`RN-REL-002`) e não é fila (`RN-REL-003`) —
nenhuma decisão de `REL` é do caminho crítico, e desligar `REL` não atrasa fila nenhuma.

(f) **A célula decide também se a leitura produz registro**, e não só quem lê — `R` × `P`
(`RN-NUC-026`, `RN-NUC-029`). Isso importa mais aqui do que em qualquer outra linha destas folhas
porque `REL` **não produz fato nenhum** por contrato (`modulos/relatorios.md` §3, "Nenhum evento"):
valorada `P`, a leitura de relatório não deixa rastro em lugar nenhum, e nenhuma leitura posterior
responde "este relatório é usado, por quem e com que frequência" — pergunta sem backfill
(`CLAUDE.md` §7.10). Acrescentado em 2026-09-12 pela segunda passada do invariante 10; o valor
continua sendo do humano, e nada aqui o antecipa.

**O que não é linha aqui, e por quê.** **Exportar** relatório não é linha de `REL`: exportação do próprio
dado pelo cliente é **núcleo** (`PN-10`, e `modulos/relatorios.md` §1 já a põe fora da fronteira do
módulo), e exportação de **documento fiscal** é outra operação, com lacuna própria
(`RN-EMI-039`, `LACUNA-NUC-019`). Recorte **por pessoa** também não é linha: é `RN-REL-008` e
`LACUNA-REL-002`, e nenhuma célula desta folha o concede — valorar L1 ou L2 **não** abre grão por pessoa.

---

## 3. O que esta folha pede, em um lugar

- **§1:** 15 linhas × 3 papéis = **45** células, mais 15 na coluna `Sem contato` (14 e 42 até
  2026-09-23, antes de A7).
- **§2:** 2 linhas × 5 papéis = **10** células, mais 2 na coluna `Offline`.
- **Nenhum número, nenhum prazo e nenhuma prioridade** são pedidos aqui — e nenhum é escrito aqui.

Valorada uma célula, ela vale por si: a prosa que nomeia papel em qualquer `RN` continua sendo candidato
(`RN-NUC-039`, `RN-PRV-015` b). Célula negada **porque ninguém decidiu** leva `?`, com lacuna nomeada e
dono — não fica em branco: branco é a linha inexistente, `?` é a decisão ausente.

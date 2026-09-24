# Matriz operação × papel — módulos, vertical e o eixo de leitura

> **Irmão de `matriz-operacao-papel.md` e de `matriz-operacao-papel-contrato.md`, com o mesmo peso
> normativo.** Partido no eixo **núcleo × módulo e vertical**, que é o eixo dos invariantes 2 e 3: em
> `matriz-operacao-papel.md` está a matriz do núcleo e as regras que ela obrigou a escrever
> (`RN-NUC-030` a `RN-NUC-032`); em **`matriz-operacao-papel-contrato.md`** (partição de 2026-08-23) o
> vocabulário da célula (`RN-NUC-026`), a coluna de offline (`RN-NUC-027`), a contenção (`RN-NUC-028`), o
> registro (`RN-NUC-029`), a **precedência da célula sobre prosa** (`RN-NUC-039`) e **o que se delega**
> (`RN-NUC-040`); aqui, `RN-NUC-033` e as operações de `MSA`, `COZ`, `PCF`, `ATI`, `FIS`, `EMI` e da
> vertical, mais o **eixo de leitura** (§7) e a **contagem consolidada** (§8). Numeração contínua e
> imutável (`glossario.md` §4.2); toda regra é heading `### RN-NUC-nnn`.
>
> **Vale aqui tudo o que o cabeçalho do irmão declara**, e quatro coisas em particular: os valores de
> célula e seus sinais (`P`, `N`, `N·cfg`, `A:`, `R`, `?`); que `Offline` é a **decisão de
> autorização**, em um de **quatro** valores, e é **sempre recusa** para `provider_support`
> (`RN-NUC-027`, cláusulas 2 e 3); que **nenhuma linha de módulo carrega `terminal+ident` hoje** — o
> quarto valor existe desde 2026-08-23 e o valor de cada célula é do humano, então operação de módulo
> classificada como ato ordinário por `RN-OFF-032` continua com o valor que a coluna já diz, e a
> divergência, se houver, é achado; e que
> **nada aqui cria operação** — cada linha cita a `RN` do módulo que a possui, e operação sem `RN` não
> entra.
>
> **Os cinco papéis são os do núcleo.** Papel de módulo (`attendant`, `production_operator`) **não é
> coluna**: o núcleo não o conhece (`RN-NUC-019`), e o que esta matriz responde é *o que um papel de
> núcleo alcança numa operação de módulo* — que é a pergunta que a configuração do cliente resolve.
>
> **Módulo desligado:** a operação não existe, logo a linha não se aplica — não é negação, é ausência de
> capacidade (`RN-NUC-019`, `catalogo-de-modulos.md`). Nenhuma célula desta matriz é caminho para ligar
> módulo.

---

## 1. Papel de núcleo em operação de módulo

### RN-NUC-033 — Qual papel de núcleo alcança uma operação de módulo é declarado pela spec do módulo ou pela configuração do cliente; ausência é negação
**Enunciado** nenhuma operação de módulo é alcançada por papel de núcleo por herança (`RN-NUC-028` (b)).
O alcance é declarado em um de dois lugares, e só dois: a **spec do módulo**, quando é invariante do
módulo; ou a **configuração do cliente**, quando o módulo a declara como configuração — é o caso de
`RN-MSA-013` (papéis autorizados a transferir, juntar, retirar item e encerrar consumo) e de `RN-COZ-012`
(papéis autorizados às operações sensíveis do ponto). Enquanto não declarado, é **negado** (`N·cfg`).
Três limites que a configuração do cliente **não** rompe: ela não concede meta-autoridade nem amplia
papel a si mesmo (`RN-NUC-023`); não faz papel de núcleo alcançar operação de outro estabelecimento
(`RN-NUC-018`); e não transforma o papel-piso em papel gerencial — o `cashier` que recebe uma operação
sensível de módulo a recebe **com registro** (`RN-NUC-029`), nunca sem.
**Motivo** é a fronteira de módulo aplicada à autorização. Se o papel de núcleo herdasse operação de
módulo, ligar um módulo mudaria silenciosamente o que o `manager` de todo cliente pode fazer — o
contrário de plugável. E o inverso, exigir papel novo a cada operação de módulo, é a proliferação que
`RN-NUC-017` recusa. A configuração é o meio-termo que `PN-20` já pedia: o cliente decide quem faz o que
na operação dele, sem tocar no conjunto de papéis.
**Aceite** cliente liga `MSA` sem configurar nada → `attendant` faz o que a spec dele dá, e nenhum papel
de núcleo alcança transferir, juntar, retirar item ou encerrar consumo; o cliente concede "retirar item"
ao `cashier` → passa a ser permitido, **com registro**, e a trilha nomeia a atribuição; desligar `MSA`
não altera nenhuma autorização de núcleo (`RN-NUC-019`, aceite).
**Infeliz** a mesma concessão de configuração é dada a todos os papéis em todo cliente → é **evidência**
de que a operação é do núcleo, ou de que falta papel (`RN-NUC-017`, infeliz), reportada como tal. O
produto não promove configuração repetida a regra por conta própria.
**Offline** configuração é **artefato publicado** (`RN-NUC-013`): vale sem contato na versão que o
terminal retém, e o fato congela a versão aplicada. Conceder é publicação, e publicação é online
(`RN-NUC-014`).

---

## 2. `MSA` — consumo em aberto

| Operação | Regida por | `cashier` | `manager` | `owner` | `fiscal_officer` | `provider_support` | Offline |
|---|---|---|---|---|---|---|---|
| Abrir consumo com alvo e responsável | `RN-MSA-002`, `RN-MSA-003` | P | P | P | N | N | retida |
| Lançar item em consumo em aberto | `RN-MSA-004`, `RN-MSA-011` | P | P | P | N | N | retida |
| Retirar item lançado | `RN-MSA-004`, `RN-MSA-013` | N·cfg | R | R | N | N | **recusa** |
| Transferir, juntar e separar consumo | `RN-MSA-005`, `RN-MSA-006`, `RN-MSA-013` | N·cfg | R | R | N | N | **recusa** |
| Trocar o responsável do consumo | `RN-MSA-002`, `RN-MSA-013` | N·cfg | R | R | N | N | **recusa** |
| Fechar consumo (uma cobrança, uma vez) | `RN-MSA-008` | P | P | P | N | N | **recusa** |
| Encerrar consumo **sem** cobrança | `RN-MSA-010`, `RN-MSA-013` | N·cfg | R | R | N | N | **recusa** |
| Entregar a repartição da divisão ao núcleo | `RN-MSA-007` | P | P | P | N | N | **recusa** |
| Configurar alvos, praças, limites e papéis autorizados | `RN-MSA-013` | N | N | R | N | N | **recusa** |

As quatro linhas `N·cfg` são exatamente as que `RN-MSA-013` declara como configuração do cliente, e o
aceite de `RN-MSA-004` já as prova pelo lado negativo: "operador com papel apenas de lançamento tenta
retirar item → negado **no backend**". As recusas offline são as da §4 do contrato de offline (classe 2),
não decisão nova daqui.

## 3. `COZ` — ponto de produção

| Operação | Regida por | `cashier` | `manager` | `owner` | `fiscal_officer` | `provider_support` | Offline |
|---|---|---|---|---|---|---|---|
| Registrar avanço de etapa | `RN-COZ-004`, `RN-COZ-012` | N·cfg | N·cfg | N·cfg | N | N | retida ¹ |
| Encerrar trabalho sem produzir | `RN-COZ-012` | N·cfg | N·cfg | N·cfg | N | N | retida ¹ |
| Reordenar a fila do ponto | `RN-COZ-012` | N·cfg | N·cfg | N·cfg | N | N | retida ¹ |
| Configurar roteamento, pontos e alternativo | `RN-COZ-002` | N | N | R | N | N | **recusa** |

¹ em **D2** a operação não existe para as duas últimas (§4 do contrato de offline: recusa), e o valor
`retida` vale onde ela existe. O portador natural das três é `production_operator`, que **não é coluna**
(`RN-NUC-033`); `RN-COZ-004`, infeliz, é quem admite outro papel autorizado, e `RN-COZ-012` exige
registro nas três.

## 4. `PCF` e `ATI` — canal externo e automação

| Operação | Regida por | `cashier` | `manager` | `owner` | `fiscal_officer` | `provider_support` | Offline |
|---|---|---|---|---|---|---|---|
| Cliente-final lança pelo próprio dispositivo | `RN-PCF-006`, `RN-NUC-025` | N | N | N | N | N | **recusa** ² |
| Aceitar ou recusar **por juízo** pedido externo | `RN-PCF-008` + `LACUNA-NUC-026` | **?** | **?** | **?** | N | N | recusa |
| Configurar canal, o que o cliente-final vê e a aceitação automática | `RN-PCF-005`, `RN-PCF-008` | N | N | R | N | N | **recusa** |
| Atendimento por IA: propor | `RN-ATI-001`, `RN-ATI-002`, `RN-ATI-008` | N | N | N | N | N | **recusa** ² |
| Configurar escopo, prazo e fronteira da conversa | `RN-ATI-013`, `RN-ATI-015` | N | N | R | N | N | **recusa** |

² linha de **cinco negações por decisão**, e é o ponto: sessão externa e automação **não portam papel**
(`RN-PCF-007`, `RN-ATI-002`, `RN-NUC-025`). A confirmação do efeito é autorizada pela linha do efeito
(`matriz-operacao-papel.md` §6) — nunca por uma coluna nova.

## 5. `FIS` e `EMI` — tributo, emissão e contingência

| Operação | Regida por | `cashier` | `manager` | `owner` | `fiscal_officer` | `provider_support` | Offline |
|---|---|---|---|---|---|---|---|
| Conceder, renovar, ampliar e revogar a capacidade de assinar | `RN-EMI-036`, `RN-EMI-037` | N | N | N ³ | R | N | **recusa** |
| Assinar **fora** do fluxo de venda | `RN-EMI-036` | N | N | N ³ | R | N | retida |
| Declarar comprometimento de ponto de emissão | `RN-EMI-038` | N | N | N ³ | R | N | retida |
| Declarar entrada e saída de contingência do ponto de emissão | `RN-EMI-024` + `LACUNA-NUC-020` | **?** | **?** | **?** | **?** | N | recusa |
| Inutilizar número; cancelar documento autorizado | `RN-EMI-029`, `RN-EMI-022` + `LACUNA-NUC-021` | N ⁴ | **?** | **?** | **?** | N | **recusa** |
| Corrigir documento autorizado (fato novo) | `RN-EMI-021` + `LACUNA-NUC-021` | N ⁴ | **?** | **?** | **?** | N | **recusa** |
| Retransmitir pendente e drenar a fila | `RN-EMI-019`, `RN-EMI-030` | N | N | N | N | N | **recusa** ⁵ |
| Trocar, renovar e revogar credencial de emissão | `RN-EMI-005`, `RN-EMI-007` + `LACUNA-NUC-025` | N | N | **?** | **?** | N | **recusa** |
| Habilitar emissão por UF e por ambiente | `RN-EMI-012`, `RN-EMI-011` + `LACUNA-NUC-023` | N | N | **?** | **?** | N | **recusa** |
| Cadastrar dado tributário e classificação de regime do item | `RN-FIS-018`, `RN-RES-001` | N | N | R | **?** | N | **recusa** |
| Publicar regra fiscal e versão de especificação | `RN-FIS-009`, `RN-EMI-009` + `LACUNA-NUC-022` | N | N | **?** | **?** | N | **recusa** |
| Ensaiar regra nova sobre fatos passados | `RN-FIS-010` + `LACUNA-NUC-027` | N | **?** | **?** | **?** | N | **recusa** |
| Alterar a segregação de regime no caixa | `RN-RES-002` | N | N | N | N | N | **recusa** ⁶ |

³ a contenção **não** alcança `fiscal_officer` (`RN-NUC-028`): `owner` não herda ato sobre a capacidade
de assinar, e é o achado de `papeis-e-permissoes.md` §4.1 posto em célula.
⁴ negado **por decisão**: "nada disso passa pelo caixa" (`RN-EMI-019`), e as duas ações são opostas e
irreversíveis (`RN-EMI-029`).
⁵ linha de cinco negações **por decisão**: drenar e retransmitir são atos **do produto**, não de papel —
`RN-EMI-019` e `RN-EMI-030` os descrevem como automáticos, e o que exige pessoa **sai** da fila para a
lista de trabalho (`RN-OFF-012`), que já tem linha no arquivo irmão.
⁶ a única linha do conjunto cujas cinco negações vêm de uma regra escrita para negar: "a segregação é
decidida no backend, e **o caixa não a altera**".

## 6. Vertical — o que o ramo acrescenta

| Operação | Regida por | `cashier` | `manager` | `owner` | `fiscal_officer` | `provider_support` | Offline |
|---|---|---|---|---|---|---|---|
| Declarar o modo de atendimento **no fato** | `RN-RES-009` + `LACUNA-NUC-024` | **?** | **?** | **?** | N | N | retida |
| Habilitar quais modos existem no estabelecimento | `RN-RES-008`, `RN-RES-009` | N | N | R | N | N | **recusa** |

A primeira linha é a consequência de um achado do passo 2 que continua aberto: `service_mode` é o único
termo do núcleo sem regra numerada. `RN-RES-009` exige que o modo seja **declarado, nunca inferido**, e
não diz por quem — então declarar quem declara seria inventar a metade que falta.

---

## 7. O eixo de leitura — onde a ausência de decisão se concentra

Toda esta matriz exige registro de auditoria, dado de pessoa mínimo e documento guardado. **Nenhum
artefato do repositório diz quem pode ler qualquer um deles.** As quatro linhas abaixo são leitura, não
escrita, e as doze células `?` delas são o maior bloco de indecisão do conjunto.

**A porta de trás destas quatro linhas foi fechada em 2026-08-23** (`AUT-05`). A auditoria mostrou que o
mesmo dado era alcançável **renomeado** como "objeto da própria operação" — a origem (i) de
`RN-NUC-035`, que não exige linha de leitura — por operações cujas células são `P`/`R`: fechar a sessão
de outro operador e transferir fila. `RN-NUC-035` passou a distinguir **leitura derivada** (campo
nomeado do objeto de **uma** operação autorizada, enumerado na `RN` dona, registrado, nunca lista, nunca
filtro, nunca exportação) de **leitura como operação**, que é o que estas quatro linhas governam.
Consequência para quem constrói: nenhuma superfície chega ao conteúdo destas quatro linhas por dentro de
outra operação, e as doze células `?` **passaram a ser** falha-fechado de verdade — antes não eram.

| Operação de leitura | Regida por | `cashier` | `manager` | `owner` | `fiscal_officer` | `provider_support` | Offline |
|---|---|---|---|---|---|---|---|
| Ler a trilha de auditoria de operação sensível, e a trilha do ato de assinatura | `RN-NUC-029`, `RN-EMI-035` + `LACUNA-NUC-017` | N | **?** | **?** | **?** | N ⁷ | retida |
| Consultar dado de pessoa **fora** da venda em curso | `RN-MSA-014`, `RN-PCF-004`, `RN-PCF-012`, `RN-EMI-017` + `LACUNA-NUC-018` | N | **?** | **?** | **?** | N ⁷ | retida |
| Consultar e exportar documento fiscal do estabelecimento | `RN-EMI-039` + `LACUNA-NUC-019` | N ⁸ | **?** | **?** | **?** | N ⁷ | **recusa** |
| Ler medição de tempo e de desempenho **por pessoa** | `RN-COZ-011`, `RN-MSA-014` + `LACUNA-NUC-018` | N | **?** | **?** | **?** | N ⁷ | retida |

⁷ negado pelo default fechado de `RN-NUC-024` (a) — o não nomeado na concessão é negado. Nenhuma
concessão de `provider_support` nomeia leitura ampla hoje, e nenhuma pode alcançar dado de pagamento
(`RN-NUC-024` (e)) nem a contagem cross-cliente (`RN-EMI-040`).
⁸ negado **por decisão**, e a distinção é de `RN-NUC-032`: apresentar de novo a via de **uma** venda é do
papel-piso, com registro; consultar em lote e exportar é outra operação, e nenhuma superfície é caminho
de enumeração (`RN-EMI-039`).

**Por que isto não é detalhe.** Ler a trilha é o que faz a trilha valer: registro que ninguém pode ler é
custo sem defesa. E a assimetria atual é a pior possível — o produto obriga a **escrever** o registro em
seis operações sensíveis e não diz quem o **lê**, o que na prática significa que a primeira
implementação decide, provavelmente liberando a quem já tem a tela na frente. É o item que o passo 4
(`seguranca`) tem cenário concreto para responder.

---

## 8. Contagem consolidada — negado por decisão × negado por ausência de decisão

| Bloco | Linhas | Células | `?` |
|---|---|---|---|
| Núcleo (`matriz-operacao-papel.md` §4) | 42 | 210 | 5 |
| `MSA` (§2) | 9 | 45 | 0 |
| `COZ` (§3) | 4 | 20 | 0 |
| `PCF` e `ATI` (§4) | 5 | 25 | 3 |
| `FIS` e `EMI` (§5) | 13 | 65 | 20 |
| Vertical (§6) | 2 | 10 | 3 |
| Eixo de leitura (§7) | 4 | 20 | 12 |
| **Total** | **79** | **395** | **43** |

**Atualizado em 2026-08-23:** o núcleo foi de 35 para 39 linhas pela partição da linha 18 em cinco
(`AUT-02`), e as quatro linhas novas herdaram as células da original — logo **o total de `?` não mudou**,
e as duas leituras do parágrafo seguinte continuam válidas com o denominador novo (43 de 380, 11%).
**Atualizado em 2026-09-23:** o núcleo foi de 39 para 42 linhas (40, habilitar terminal; 41, encerrar e
reabrir estabelecimento; 42, turno), e as três nasceram valoradas, sem `?`
(`matriz-operacao-papel.md` §8). O total passou a 395 células, e os `?` continuam 43, agora 10,9%.

Onde a indecisão está, e é o que esta contagem existe para mostrar: **35 das 43 células `?` estão em ato
fiscal irreversível (20) ou em leitura (12)**. O caminho crítico do caixa tem **duas**, as duas na mesma
operação — abrir sessão em nome de outro operador (`LACUNA-NUC-016`). Nenhuma célula `?` está em venda,
item, pagamento, desconto, gaveta, sangria ou fechamento de sessão.

Duas leituras opostas do mesmo número, e as duas são verdadeiras: **cerca de 11% das células ainda não foram
decididas por ninguém**, o que é dívida declarada e não comportamento aprovado (`RN-OFF-008`); e
**nenhuma delas está no que o caixa faz cem vezes por dia**, o que é a prova de que a fronteira do
passo 1 e do passo 2 estava no lugar certo.

---

## 9. Lacunas nascidas aqui

Abertas em 2026-08-22. Nenhuma bloqueia regra: todas negam por default até serem decididas
(`RN-NUC-026`). `LACUNA-NUC-015` e `016` estão em `matriz-operacao-papel.md` §9.

- **`LACUNA-NUC-017`** — **quem lê a trilha de auditoria** de operação sensível, e quem lê a trilha do
  ato de assinatura (`RN-EMI-035`). Nenhum artefato declara. **Dono:** humano, com cenário concreto de
  `seguranca` (passo 4). Relacionada a `LACUNA-NUC-013` (o piso que configuração não alcança).
- **`LACUNA-NUC-018`** — **quem consulta dado de pessoa fora da venda em curso**: ficha nominal
  (`RN-MSA-014`), identificação do comprador (`RN-EMI-017`, `RN-PCF-004`), texto de terceiro na lista de
  trabalho (`RN-OFF-027`) e medição por pessoa (`RN-COZ-011`). As specs dizem "lido por papel
  autorizado" e nenhuma nomeia o papel. **Dono:** humano, com `seguranca`.
- **`LACUNA-NUC-019`** — **quem consulta e exporta documento fiscal** do estabelecimento (`RN-EMI-039`).
  Não é `fiscal_officer` por construção: o papel dele é responder pelo poder de assinar, não pela
  contabilidade. **Dono:** humano, com o contador. **Conflito de 2026-08-23 (`AUT-08`), fechado nos dois
  lados na mesma data:** `RN-EMI-039` **concedia em prosa** a consolidação entre estabelecimentos do
  mesmo cliente apontando para `RN-EMI-036` — a regra de `fiscal_officer`, papel de escopo
  **estabelecimento** —, enquanto esta célula nega por omissão. `RN-NUC-039` decide a precedência
  (**vence a célula**) e o texto de `RN-EMI-039` passou a apontar para esta lacuna, com aceite de recusa
  citando a célula. Enquanto ela estiver aberta, a operação é negada a todos.
- **`LACUNA-NUC-020`** — **quem declara entrada e saída de contingência** do ponto de emissão, ou se é
  ato do produto sem papel. `RN-EMI-024` diz que entrar é "decisão do contribuinte" e que é evento datado
  com motivo — logo tem autor, e o autor não está declarado. É a lacuna mais consequente das doze:
  entrar **queima número** (`RN-EMI-022`). **Dono:** humano, com o contador.
- **`LACUNA-NUC-021`** — **quem decide inutilizar × cancelar** (`RN-EMI-029`) e **quem corrige documento
  autorizado** (`RN-EMI-021`). São atos opostos, irreversíveis, com prazo em horas. Inclui o desfecho
  fiscal dos números de faixa encerrada (`RN-EMI-022`). **Dono:** humano, com o contador.
- **`LACUNA-NUC-022`** — **quem publica regra fiscal e versão de especificação** (`RN-FIS-009`,
  `RN-EMI-009`): nós, para todos os clientes, ou o cliente para si? Se é nosso, é operação de plataforma
  sem papel declarado (`LACUNA-NUC-011`), e `provider_support` **não** a alcança. **Dono:** humano.
- **`LACUNA-NUC-023`** — **quem habilita e desabilita módulo** para o cliente (linha 24 do irmão) e
  **quem habilita emissão** por UF e ambiente (`RN-EMI-012`). É a pergunta de fronteira que o passo 2
  levantou, agora com célula: `owner`, nós, ou os dois? **Dono:** humano.
- **`LACUNA-NUC-024`** — **quem declara o modo de atendimento no fato** (`RN-RES-009`). `service_mode`
  continua sem regra numerada, e `RN-RES-009` é provisória. **Dono:** `produto`, em passada própria com o
  humano.
- **`LACUNA-NUC-025`** — **quem troca, renova e revoga a credencial de emissão** (`RN-EMI-005`,
  `RN-EMI-007`) do lado do cliente, e quem do nosso, no modo de custódia na Forja. `RN-EMI-007` exige
  "responsável" por segredo e não diz qual papel. **Dono:** humano; ligada a `LACUNA-NUC-011`.
- **`LACUNA-NUC-026`** — **quem aceita ou recusa por juízo** pedido externo (`RN-PCF-008`). A regra diz
  que a recusa por juízo é humana e não diz de quem. **Dono:** humano.
- **`LACUNA-NUC-027`** — **quem ensaia regra fiscal nova** sobre fatos passados (`RN-FIS-010`). É leitura
  ampla do histórico, logo herda a pergunta de `LACUNA-NUC-019`. **Dono:** humano.
- **`LACUNA-NUC-028`** — **`fiscal_officer` alcança a superfície da fila de pendências fiscais**
  (`RN-OFF-011`, `RN-EMI-028`), ou ela é exclusivamente do papel gerencial? O prazo do pendente é de
  horas, e hoje quem responde pelo poder de assinar não vê a fila. **Dono:** humano.

Aberta em 2026-08-23, pela varredura de conformidade de `RN-NUC-039`:

- **`LACUNA-NUC-037`** — **quem lê relatório de gestão (`REL`)**. O módulo declara, para cada relatório,
  **de quem é a decisão** (`RN-REL-001`, campo 2, e o campo `QUEM` das seis perguntas da semente), e
  `REL` **não tem nenhuma linha** nas três matrizes: logo ler relatório é negado a todos (`RN-NUC-026`) e
  o papel citado em prosa é candidato, nunca concessão (`RN-NUC-039`). Não é a mesma pergunta do eixo de
  leitura da §7: lá o objeto é trilha, dado de pessoa e documento; aqui é **agregado de gestão**, e o
  escopo (estabelecimento × cliente) já está decidido por `RN-REL-006`. Quando fechar, entra como bloco
  próprio desta matriz, com uma linha por escopo e não por relatório — relatório novo não deve exigir
  célula nova. **Dono:** humano; `seguranca` antes, porque agregado é o caminho de vazamento que schema
  correto não pega (`RN-REL-006`, motivo). **Acrescentado em 2026-08-23:** as **duas** linhas candidatas
  (uma por escopo), com valor em branco e com o que já está decidido em volta, estão em
  `matriz-celulas-a-valorar.md` §2 — que **não é matriz** e cujas células não entram na contagem da §8
  deste arquivo. Valoradas, elas migram para cá como bloco próprio, na mesma passada, e a cópia de lá sai.
  **Acrescentado em 2026-09-12, pela segunda passada do invariante 10:** esta célula decide **duas**
  coisas, e a segunda passa despercebida porque a lacuna está escrita como pergunta de autorização.
  `R` e `P` diferem em **autorização** e em **registro** (`RN-NUC-029`), e `REL` é o único módulo que
  **não produz fato nenhum** (`modulos/relatorios.md` §3, "Nenhum evento") — então, valorada `P`, a
  leitura de relatório não deixa rastro em lugar nenhum, e "este relatório é usado, e por quem" deixa
  de ser respondível para sempre, sem backfill (`CLAUDE.md` §7.10). Quem valorar decide o registro
  junto, com o custo dos dois lados à vista: `R` cria trilha por leitura de gestão, e a leitura dessa
  trilha por pessoa continua fora por `RN-REL-008`; `P` deixa `RN-REL-001` — "relatório existe pela
  decisão que informa" — sem nenhuma forma de conferir o desfecho. Achado 2.9 de
  `captura-varredura-invariante-10-2026-09-11.md`.

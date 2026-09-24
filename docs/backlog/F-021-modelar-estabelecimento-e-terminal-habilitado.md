# F-021 — Modelar estabelecimento, terminal e terminal habilitado a vender no schema de cliente

**Tipo:** Comportamento fechado (modelo) · **Estado:** a fazer · **Dono:** `arquiteto-dados` ·
**Território:** `db/**`

> **Origem.** Pedido do humano em 2026-09-23: "A gente vai fazer a base e bem feita. O que não tiver ao
> seu alcance, você vai continuando o restante e coloca um aviso claro". Regra de trabalho em
> `memory/processo/convention-decisao-delegada-com-aviso-no-modulo.md`. Este item é a primeira peça da
> base que vive no schema de cliente.

## Objetivo

Escrever a **primeira migration de cliente**: estabelecimento (`establishment`), terminal (`terminal`) e
a habilitação do terminal a vender por um estabelecimento (`sales_enabled_terminal`,
`docs/produto/glossario.md:30-32`).

Hoje `db/migrations/` só tem `platform/`, de `0000` a `0013` (medido em 2026-09-23), e nenhuma migration
de cliente existe. `SPR-37` modela venda, pagamento, caixa e turno, e todo fato dele precisa nomear o
estabelecimento, inclusive quando o cliente tem um só (`RN-NUC-050`). Sem este item, `SPR-37` não tem
para onde apontar.

A regra que decide o modelo está em `memory/plataforma/business-rule-estabelecimento-e-entidade-datada-nunca-campo.md`
e, inteira, em `docs/produto/nucleo-estabelecimento.md`:

- o vínculo estabelecimento → cliente (tenant) é imutável;
- todo fato do núcleo nomeia a unidade, inclusive com uma só;
- o ciclo de vida é fato datado, e o estado corrente é derivado, nunca campo sobrescrito (`RN-NUC-051`).

## Escopo

- **Estabelecimento**, com o que nasce com ele e nada além (`nucleo-estabelecimento.md:57-58`): o
  vínculo com o cliente, o fato datado de criação com autor e instante, e o nome pelo qual o operador
  reconhece a unidade. O nome muda sem mudar o que um fato passado exibe (`RN-NUC-051` b, `PN-08`).
- **Terminal**, vinculado a um estabelecimento (`glossario.md:31`), substituível: trocar todos os
  terminais de uma unidade não altera nada do que ela é (`RN-NUC-050`, aceite 3).
- **Habilitação a vender** (`RN-OFF-032` i): estabelecida com contato, vence por tempo sem contato,
  renovada por contato. Habilitar, renovar e declarar comprometido são fatos datados e append-only
  (`RN-PRV-013`, `docs/produto/fatos-de-operacao-provedor.md:166-186`). Desde 2026-09-23 a regra dona é
  `RN-NUC-061` (`docs/produto/nucleo-estabelecimento.md:285`): habilita `manager` ou `owner`; o
  terminal tem **no máximo uma** habilitação vigente; renovar é efeito do contato autenticado, sem autor
  humano.
- **Encerrar e reabrir o estabelecimento** (`RN-NUC-059`, `nucleo-estabelecimento.md:215`), como fatos
  datados do `owner`. Encerrar revoga no mesmo ato a habilitação de todo terminal da unidade, com a causa
  registrada, e reabrir não devolve nenhuma. Entrou em 2026-09-23 (ver "Alterações").
- **Os três domínios de valor** de `memory/plataforma/decision-dinheiro-e-quantidade.md`
  (`money_amount`, `unit_price`, `quantity_value`), criados por esta migration com guarda de existência,
  porque `CREATE DOMAIN` não tem `IF NOT EXISTS`, e a convenção registrada em `db/convencoes.md`. Nenhuma
  coluna deste item os usa; eles nascem aqui porque esta é a primeira migration de cliente (a decisão,
  "Como aplicar").
- **O diretório e a forma das migrations de cliente**, que nascem aqui e passam a valer para todo item
  seguinte. A migration é de cliente e só de cliente (`.claude/rules/migrations.md` §7).

## Fora de escopo

- **Venda, pagamento, caixa, turno e operador.** São `SPR-37`, que depois deste item passa a apontar
  para o estabelecimento. Acrescentar `F-021` ao `Depende de` de `SPR-37` é trabalho da próxima onda.
- ~~**Mover terminal de um estabelecimento para outro.** Nenhuma regra diz se isso existe. O modelo não o
  oferece e não o torna impossível; a pergunta vai para `produto`.~~ **Respondido em 2026-09-23 por
  `RN-NUC-061`:** mover não é operação. Vender por outra unidade é descomissionar na atual (linha 30 da
  matriz, `RN-OFF-016`) e habilitar na nova. O modelo não oferece operação de mover, e a habilitação
  vigente nunca nomeia duas unidades (aceite 2). Se o vínculo terminal → estabelecimento do glossário
  (`glossario.md:31`) é da identidade do terminal ou só da habilitação vigente, é `arquiteto-dados` quem
  decide, desde que descomissionar e habilitar de novo baste para vender pela outra unidade.
- **O que nasce depois do estabelecimento, como ato próprio** (`nucleo-estabelecimento.md:60-65`):
  atribuição de papel de escopo estabelecimento, configuração publicada, faixa pré-alocada, ponto de
  emissão e regime. **Fuso e moeda estão aqui desde 2026-09-23:** são membros da configuração publicada
  do estabelecimento, com versão e vigência (`RN-NUC-057`, `nucleo-estabelecimento.md:140-149`;
  `RN-NUC-058`, `:186-194`; linha 38 da matriz), e não coluna dele. O que este item deixa pronto para
  eles é o estabelecimento a que a configuração pertence.
- **Material de prova do terminal**: o que o servidor confere quando o terminal se apresenta. A forma
  depende de `F-017`; este item modela a identidade do terminal, não a credencial.
- **Rota, contrato, tela.** Nenhuma consulta de caminho quente nasce aqui.
- **Conferir as precondições de habilitar** (`RN-NUC-061`): unidade não encerrada, `queue_owner`
  declarado, fuso e moeda publicados e vigentes. A conferência é do `backend`, na Fase 2, e a recusa é o
  fato de recusa de `RN-NUC-043`. Deste item só se exige que "a unidade está encerrada neste instante"
  seja derivável dos fatos (aceite 8); `queue_owner` mora na atribuição, e fuso e moeda na configuração
  publicada, as duas fora daqui.

## Critério de aceite

1. **Cliente com uma unidade.** O estabelecimento existe como linha própria, e não há caminho para criar
   terminal ou habilitação sem estabelecimento nomeado. Teste negativo: não existe no modelo nada que se
   chame ou funcione como unidade "padrão", "implícita" ou "única" (`RN-NUC-050`, aceite 1).
2. **Cliente com duas unidades, A e B, no mesmo schema.** As duas existem lado a lado; um terminal
   habilitado a vender por A não está habilitado por B, e em nenhum instante a habilitação vigente de um
   terminal nomeia duas unidades.
3. **Vínculo com o cliente imutável.** Não existe caminho pelo qual um estabelecimento passe a pertencer
   a outro cliente (`RN-NUC-060`, que fechou `LACUNA-NUC-043` como "não"). O relatório diz se isso é garantido pela
   construção do schema por cliente ou por restrição, e por quê.
4. **Ciclo de vida derivado.** Criar A e criar B: "quais unidades o cliente operava em `2026-09-11`"
   responde A e B a partir dos fatos, e reconstruir o estado corrente dá o mesmo que o estado exibido
   (`RN-NUC-051`, aceite). "Quantos terminais estão habilitados a vender e desde quando" responde sem
   inspecionar o ambiente (`RN-PRV-013`, aceite).
5. **Nome datado.** Não há fato de venda ainda, então a prova é pela forma: renomear A em T2 e perguntar
   o nome de A no instante T1 < T2 devolve o nome antigo. A conferência sobre fato real de venda passa a
   `SPR-37`.
6. **Isolamento.** O papel do cliente Y lendo o estabelecimento do cliente X recebe `42501`, no mesmo
   padrão de dois clientes da suíte de `T-0011`.
7. **Os três testes de `.claude/rules/migrations.md` §3**: schema vazio, schema com dado, rodada duas
   vezes. E o checklist do §10 e as cinco respostas de `.claude/rules/dados.md` §6 no relatório.

8. **Encerrar e reabrir** (`RN-NUC-059`, aceites 1 e 4). A com três terminais habilitados é encerrada:
   os três perdem a habilitação no mesmo ato, cada revogação com a causa; "quais unidades operavam em
   2026-09-11" continua respondendo A. A é reaberta: nenhum dos três está habilitado até ser habilitado
   de novo, e o intervalo encerrado fica na história.
9. **Mover terminal** (`RN-NUC-061`). O terminal T, habilitado por A, é descomissionado em A e habilitado
   por B: em nenhum instante T tem habilitação vigente pelas duas, e "por qual unidade T vendia em T1"
   responde uma só.

**Caminho infeliz.** ~~Terminal declarado comprometido pede renovação de habilitação: a spec não diz se
um terminal comprometido pode ser reabilitado. O modelo não oferece caminho que apague ou sobrescreva o
fato de comprometimento, e a regra de reabilitação vai como pergunta para `produto`.~~ **Respondido em
2026-09-23 por `RN-NUC-061`:** terminal declarado comprometido nunca é renovado nem reabilitado; se for
recuperado, entra como terminal novo. O modelo não oferece caminho que apague ou sobrescreva o fato de
comprometimento, e o contato de um terminal comprometido não produz renovação: a tentativa é fato
(`RN-NUC-061`, aceite 6).

## Registra / Não registra

**Registra:** a criação de cada estabelecimento, com autor, papel e instante (`RN-NUC-051`); cada
mudança de nome, datada; cada habilitação, renovação e declaração de comprometimento de terminal
(`RN-PRV-013`); encerrar e reabrir, com autor, papel e instante, e cada habilitação revogada pelo
encerramento, com a causa (`RN-NUC-059`, Registra). Fato leva os dois instantes, `occurred_at` e `received_at`, e nenhum
`updated_at` (`D-04`).

**Não registra, e por quê** (cada ausência declarada no topo da migration, `.claude/rules/dados.md` §3.1):

- **Identidade fiscal do estabelecimento**, enquanto `D-05` não fechar em `F-020`
  (`nucleo-estabelecimento.md` §3).
- **Estado "ativo" ou "encerrado" como campo.** É derivado dos fatos (`RN-NUC-051`, `RN-NUC-059`, Não
  registra).
- **O valor do prazo da habilitação** (`LACUNA-OFF-017`). A grandeza existe no modelo; o número não é
  inventado nem vira default de coluna.
- **O meio de identificação do operador** (`RN-OFF-033`), que é do conjunto de identificação e tem forma
  decidida por `F-017`.

## Depende de

- **`T-0009` fechada.** A ficha está aberta: o nono gate, em 2026-09-23, não fechou por `PAP-28`,
  `PAP-29` e `PAP-30` (`tarefas/INDEX.md`). A primeira migration de cliente roda pelo executor e pelo
  provisionamento que `T-0009` entrega.
- ~~**`F-018`, só em quatro lacunas**~~ **As quatro lacunas de `F-018` fecharam em 2026-09-23**: fuso
  (`LACUNA-GLO-001` → `RN-NUC-057`), moeda (`LACUNA-NUC-041` → `RN-NUC-058`), encerramento
  (`LACUNA-NUC-042` → `RN-NUC-059`) e mudança de cliente (`LACUNA-NUC-043` → `RN-NUC-060`, que é "não").
  Nenhuma trava mais este item.
- ~~**`SPR-40`**, e o motivo é a moeda~~ **`SPR-40` fechou em 2026-09-23** (`T-0018`). Este item não
  carrega valor, e a moeda mora na configuração publicada; o que sobra de `SPR-40` aqui é criar os três
  domínios (Escopo).
- **`F-017`**, porque o eixo E3 decide se o terminal (no arranjo D, o acompanhante) porta o tenant, e
  isso muda o que a identidade do terminal é; e o eixo E1 decide onde mora o autor do fato de criação.
  Quem cria o primeiro `owner`, que é quem cria a primeira unidade, deixou de ser pergunta:
  `RN-NUC-090` (`docs/produto/papeis-e-permissoes.md` §5.1) o atribui no próprio ato de provisionar.
- **A ordem com `SPR-37`, que é de `arquiteto-dados` resolver.** O autor do fato de criação é um sujeito,
  e o sujeito (operador) está no escopo de `SPR-37`, que por sua vez aponta para o estabelecimento. As
  duas saídas servem: a tabela do sujeito vem para cá, ou `SPR-37` é partido. A que não serve: o fato
  de criação nascer sem autor para ganhar autor depois, que é o atalho da unidade implícita aplicado a
  outra coluna, e fato passado não tem backfill.
- ~~**`F-019`, condicional.** Hoje nenhum ato nosso escreve nestas tabelas. Se a célula de habilitar
  terminal, que ainda não existe (achado em `F-018`), for dada a papel nosso, o fato de habilitação ganha
  autor nosso e a residência da trilha passa a importar aqui. `F-019` responde isso.~~ **Caiu em
  2026-09-23.** A célula existe e é de papel do cliente (linha 40, `RN-NUC-061`), e pela linha do objeto
  o fato de habilitação mora no schema do cliente qualquer que seja o autor
  (`docs/arquitetura/d-06-trilha-residencia-2026-09-23.md` §8, "Derrubo a condição"; decisão do thread em
  `tarefas/T-0019-d-06-ii-residencia-da-trilha.md`, seção "thread — 2026-09-23 (decisão depois do F.2)").
  **Sobra uma condição de forma, e ela é deste item:** o autor não pode nascer só como chave estrangeira
  obrigatória para o sujeito do cliente. Admitir depois autor nosso exigiria tirar `NOT NULL` de um
  invariante (`.claude/rules/migrations.md` §4). Autor na forma da sustentação (fonte de lookup mais
  referência) admite a quarta fonte de `RN-NUC-029` por linha de lookup e coluna anulável
  (`d-06-trilha-residencia-2026-09-23.md` §8, "A condição que sobra"). O arquivo está em revisão pelo
  `arquiteto-dados` (`T-0019`), e por isso a citação é por seção, não por linha.

## Gate obrigatório

**`seguranca`**, gate 2 do `CLAUDE.md` §4: é DDL em schema de cliente, e a primeira. **`arquiteto-dados`**
responde o checklist de `.claude/rules/migrations.md` §10. **`performance`** não se aplica: nenhuma
consulta de tela nasce aqui, e a checagem de habilitação no caminho do caixa leva o gate 4 na Fase 2.

## Alterações — 2026-09-23

- **Fuso e moeda saíram do `Não registra`** e foram para o `Fora de escopo`, como membros da
  configuração publicada. Contra: a promessa do próprio item de que, fechadas as lacunas, "eles entram
  aqui". Prova: `RN-NUC-057` e `RN-NUC-058` (`nucleo-estabelecimento.md:144-147`, `:188-189`) os põem na
  configuração publicada, com versão e vigência, e não no estabelecimento.
- **Encerrar e reabrir entraram no `Escopo`**, com o aceite 8 e a linha no `Registra`. Contra: a
  ausência condicional "se `LACUNA-NUC-042` não tiver virado operação". Prova: virou, `RN-NUC-059`
  (`nucleo-estabelecimento.md:215`), e a condição escrita aqui mandava isso.
- **Mover terminal e reabilitar comprometido** deixaram de ser pergunta para `produto`: `RN-NUC-061`
  (`nucleo-estabelecimento.md:288-297`) responde as duas. Entrou o aceite 9.
- **`F-019` condicional caiu**, e ficou a condição de forma do autor. Prova:
  `d-06-trilha-residencia-2026-09-23.md` §8 e a decisão do thread em `T-0019`.
- **Os três domínios de valor entraram no `Escopo`.** Prova: `memory/plataforma/decision-dinheiro-e-quantidade.md`
  ("Como aplicar") e a decisão do thread em `tarefas/T-0018-dinheiro-e-quantidade.md`.
- **Conferir as precondições de habilitar** ficou declarado fora, com dono.

## Referências

`memory/plataforma/business-rule-estabelecimento-e-entidade-datada-nunca-campo.md` ·
`memory/plataforma/decision-dinheiro-e-quantidade.md` ·
`docs/produto/nucleo-estabelecimento.md:140` (`RN-NUC-057`) · `:186` (`RN-NUC-058`) · `:215` (`RN-NUC-059`) ·
`:257` (`RN-NUC-060`) · `:285` (`RN-NUC-061`) · `docs/produto/matriz-operacao-papel.md`, linhas 30, 38, 40,
41 · `docs/arquitetura/d-06-trilha-residencia-2026-09-23.md` §8 · `tarefas/T-0019-d-06-ii-residencia-da-trilha.md` ·
`memory/plataforma/gotcha-fuso-do-estabelecimento-versus-fuso-do-cliente.md` ·
`memory/plataforma/gotcha-moeda-viajou-na-parentese-do-fuso.md` ·
`memory/plataforma/decision-d-04-chave-timestamps-exclusao.md` ·
`memory/processo/convention-decisao-delegada-com-aviso-no-modulo.md` ·
`docs/produto/nucleo-estabelecimento.md:33` (`RN-NUC-050`) · `:105` (`RN-NUC-051`) · §3 · §4 ·
`docs/produto/glossario.md:30-32` · `docs/produto/fila-local-autoridade-e-identidade.md:123` (`RN-OFF-032`) ·
`:154-162` · `docs/produto/fatos-de-operacao-provedor.md:166` (`RN-PRV-013`) ·
`.claude/rules/dados.md` §1 · §3 · §3.1 · §6 · `.claude/rules/migrations.md` §3 · §7 · §10 ·
`docs/backlog/SPR-37-modelar-venda-pagamento-caixa-turno-e-operador-no-schema-de.md` ·
`docs/backlog/SPR-40-fechar-tipo-unidade-e-escala-de-dinheiro-e-de-quantidade.md` ·
`docs/backlog/F-017-fechar-d-03-identidade-e-prova.md` · `docs/backlog/F-018-decidir-as-lacunas-que-travam-as-fases-1-e-2.md` ·
`docs/backlog/F-019-fechar-d-06-ii-residencia-da-trilha-dos-nossos-atos.md` · `tarefas/T-0009-fundacao-do-banco.md`

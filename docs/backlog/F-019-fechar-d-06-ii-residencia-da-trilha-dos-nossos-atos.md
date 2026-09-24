# F-019 — Fechar `D-06`(ii): onde mora a trilha dos nossos atos e das nossas leituras

**Tipo:** Comportamento fechado (decisão) · **Estado:** a fazer · **Dono:** `arquiteto-dados` (desenho
das saídas contra as restrições); thread principal (decide e registra); `seguranca` audita ·
**Território do desenho:** `db/**`

> **Origem.** Pedido do humano em 2026-09-23: "sobre as decisões, você faz o que for melhor para a
> escalabilidade [...] A gente vai fazer a base e bem feita." Regra de trabalho em
> `memory/processo/convention-decisao-delegada-com-aviso-no-modulo.md`. `D-06` é decisão de arquitetura
> em aberto com cinco saídas já desenhadas, que é o caso que a regra manda decidir.

## Objetivo

Decidir a residência da **trilha dos nossos atos e das nossas leituras** sobre cliente (tenant), que é a
parte (ii) de `D-06`, e registrar a decisão com o recusado e o motivo. As partes (i) e (iii) ficam
abertas.

A razão de (ii) vir antes: ela não pode morar no schema do cliente, porque sairia com ele e levaria a
prova da nossa conduta; e `.claude/rules/migrations.md` §7 proíbe migration que misture `platform` e
cliente. Enquanto não se sabe de que lado ela mora, a primeira migration dessa família não é escrevível
(`memory/plataforma/decision-d-06-sao-tres-residencias-nao-uma.md`, "Por que (ii) não pode ficar aberta").

## A primeira migration de cliente depende disto?

**Leitura atual deste item: não, e a condição que muda a resposta tem nome.** A primeira migration de
cliente é `F-021` (estabelecimento, terminal e terminal habilitado a vender). Nenhum ato nosso escreve
nela hoje:

- criar estabelecimento é só do `owner` (`docs/produto/matriz-operacao-papel.md:78`, linha 23:
  `N N R N N`);
- nenhum papel de escopo `provedor` pratica ato nenhum até `RN-NUC-029` admitir a quarta fonte
  (`memory/plataforma/state-pendencias-abertas-2026-08-23.md` §1.3).

**A condição:** habilitar e renovar terminal a vender não tem linha em matriz nenhuma (achado registrado
em `F-018`), e `RN-PRV-013` põe esse ato entre os fatos de ciclo de vida que nós lemos somando clientes
(`docs/produto/fatos-de-operacao-provedor.md:166-186`). Se a célula dele for dada a papel nosso, o fato
de habilitação ganha autor nosso, e aí `F-021` passa a depender deste item. Quem executa confirma a
leitura ou a derruba, com `path:linha`, e a resposta entra no registro.

## Escopo

- **As cinco saídas** (`platform`, terceiro schema, schema do cliente, fora do banco, duas gravações),
  aplicadas só a (ii), com o defeito de cada uma já escrito no registro de `D-06` e detalhado na ficha
  `T-0004`, seção `arquiteto-dados` §7.
- **Os dois objetos de (ii)**, que têm ciclo de vida diferente: o fino e transitório, que serve o
  incidente, e o grosso e retido, que serve a prova. A decisão pode dar residência diferente a cada um, e
  diz se deu.
- **A linha proposta** (a residência segue o objeto do fato, nunca o leitor) é adotada ou recusada, com
  o defeito que ela carrega: ela diz quem é dono do fato e não resolve decomposição por cliente.
- **As duas perguntas legais que decidem se a partição fecha**: `state-pendencias` §4.3 (o cliente tem
  direito ao nome da pessoa nossa?) e §4.4 (quem do nosso lado lê a trilha do nosso uso, `PRV-09`). Cada
  uma sai decidida ou com o aviso de indisponibilidade no formato de `F-018`. A §4.3 tem cara de
  pergunta para advogado, e se for, ela recebe aviso.

## Fora de escopo

- **`D-06`(i)**, o agregado que soma clientes, e **`D-06`(iii)**, a observação de operação por cliente.
  Seguem abertas; o registro diz que seguem.
- **A migration da trilha.** Este item decide onde ela mora; escrevê-la é item próprio de
  `arquiteto-dados`, com o gate 2.
- **Retenção da trilha em número.** O prazo depois de o cliente sair é `PN-10` × `LACUNA-PRV-006`, e o
  relógio da prova já está fixado (`memory/plataforma/convention-retencao-tem-tres-relogios.md`).
- **Tornar algum papel nosso operante.** As três travas do escopo `provedor` continuam onde estão.

## Critério de aceite

1. **As quatro partes de `memory/plataforma/convention-gravar-a-propria-trilha-nao-e-mutacao.md`
   cumpridas pela residência escolhida:** a classe está no relógio da prova; nenhuma operação nossa
   apaga, edita, suspende ou encurta; reduzir a janela é ato datado e visível ao cliente antes de valer;
   a janela vigente é declarada, e truncamento aparece como truncamento. Residência que não sustenta uma
   das quatro é residência recusada.
2. **Três casos, com o desfecho escrito no registro:**
   - um papel nosso lê o inventário de infraestrutura do cliente X (linha `R1` de
     `matriz-celulas-a-valorar.md:58`): a leitura deixa fato na residência escolhida, e o cliente X
     consegue listá-lo;
   - o cliente X encerra o contrato: a trilha do que fizemos no ambiente dele **sobrevive** à saída dele,
     e o registro diz onde e por quanto tempo;
   - a pessoa nossa que praticou o ato tenta ler a própria trilha: recusa, e o registro diz por quê
     (`PRV-09`).
3. **O alvo da migration dessa família fica declarado**, `platform` ou outro, e só um dos dois
   (`.claude/rules/migrations.md` §7).
4. **A resposta à pergunta da seção acima** entra no registro, confirmada ou derrubada.
5. **Registro `decision` em `memory/plataforma/`** que supera a parte (ii) de
   `decision-d-06-sao-tres-residencias-nao-uma`, e a linha de `D-06` entra na tabela do `CLAUDE.md` §8
   (hoje ela não está lá) com (ii) FECHADA e (i) e (iii) ABERTAS.

**Caminho infeliz.** A escrita do fato da trilha falha: o ato ou a leitura nossa **não acontece**, porque
fato não gravável impede a leitura (convenção citada no critério 1, cláusula 1). É o oposto do que vale
para a venda, e o registro diz isso com as palavras para ninguém transportar o "registro nunca bloqueia"
do caixa para cá.

## Registra / Não registra

**Registra**, e é o objeto deste item: todo ato e toda leitura nossa sobre cliente, com o papel nosso, o
cliente-alvo resolvido no próprio registro, o instante, e em que o ato se sustentou
(`memory/plataforma/business-rule-registro-de-ato-nomeia-em-que-o-ato-se-sustentou.md`). Tentativa
nossa **recusada** também é fato: ela não tem ambiente de cliente escolhível
(`memory/plataforma/gotcha-fato-do-provedor-nao-tem-residencia-unica.md`), e é por isso que a
residência não pode ser o schema do cliente.

**Não registra, e por quê:**

- **O conteúdo que a leitura nossa viu.** A trilha diz que lemos, o quê em classe e quando; copiar o dado
  lido para a trilha seria criar um segundo acervo do dado do cliente fora do ambiente dele.
- **O nome da pessoa nossa no próprio fato**, até §4.3 ter resposta. Fica o papel e um identificador
  estável da pessoa. A ausência só é segura se o identificador continuar resolvendo para a pessoa depois
  que ela sair da nossa equipe; o registro diz onde essa correspondência mora e que ela não se apaga. Sem
  isso, a resposta "o cliente tem direito ao nome" chegaria tarde para todo fato já gravado.

## Depende de

**Nada em aberto para decidir.** As cinco saídas, o defeito de cada uma e as restrições estão escritos
desde 2026-08-23 (`T-0004`). `D-01` fechou, o que tira da saída "fora do banco" o defeito de presumir
infraestrutura com stack aberta e obriga a reavaliá-la. `F-017` não é pré-requisito: a trilha registra o
papel nosso, e o papel já existe na spec seja qual for a residência do sujeito.

## Gate obrigatório

**`seguranca`** sobre o desenho: a residência escolhida não pode abrir caminho de leitura de sessão de
cliente para fora do schema dele sem auditoria, que é o defeito nomeado da saída `platform`. **Checklist
de `.claude/rules/dados.md` §6** respondido por `arquiteto-dados` para a residência escolhida.

## Referências

`memory/plataforma/decision-d-06-sao-tres-residencias-nao-uma.md` ·
`memory/plataforma/convention-gravar-a-propria-trilha-nao-e-mutacao.md` ·
`memory/plataforma/gotcha-fato-do-provedor-nao-tem-residencia-unica.md` ·
`memory/plataforma/convention-retencao-tem-tres-relogios.md` ·
`memory/plataforma/state-pendencias-abertas-2026-08-23.md` §1.3 · §3.4 · §4.3 · §4.4 ·
`memory/processo/convention-decisao-delegada-com-aviso-no-modulo.md` ·
`tarefas/T-0004-gestao-de-estabelecimentos-e-operacao-do-provedor.md` (`arquiteto-dados` §7) ·
`docs/produto/fatos-de-operacao-provedor.md:166` (`RN-PRV-013`) ·
`docs/produto/matriz-operacao-papel.md:78` · `docs/produto/matriz-celulas-a-valorar.md:58` ·
`.claude/rules/dados.md` §1 · `.claude/rules/migrations.md` §7 ·
`docs/backlog/F-018-decidir-as-lacunas-que-travam-as-fases-1-e-2.md` ·
`docs/backlog/F-021-modelar-estabelecimento-e-terminal-habilitado.md`

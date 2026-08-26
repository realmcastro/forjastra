---
id: T-0005
titulo: Opção B confirmada (EMI fora do MVP por perfil, FIS dentro) — roadmap e reservas de modelo
status: fechada
escopo: cliente=- vertical=- modulo=fiscal camada=produto
aberta_em: 2026-08-24
---

## Pedido

O humano quer uma base sólida para o MVP, mas sem construir emissão fiscal própria agora — o perfil
de cliente inicial (interior) não liga muito para nota fiscal. Esclarecido em duas perguntas:

1. O PDV ainda calcula o tributo certo por item (preço correto), só não emite o documento fiscal por
   conta própria — confirmado: **calcula, não emite**. E "todos os dados para futura implementação
   existir": o modelo precisa reservar espaço para ligar emissão própria depois sem migração dolorosa.
2. Isso é config por perfil de cliente (tenant), não característica do MVP inteiro — confirmado:
   **é config por tenant**. `EMI` fica módulo plugável, desligado por padrão para o perfil inicial,
   ligável por outros clientes depois.

## Plano

## PLANO — T-0005 Opção B confirmada (EMI fora do MVP por perfil, FIS dentro) — roadmap e reservas de modelo

ESCOPO: Registrar a decisão do humano (Opção B da §5.3/5.4 do roadmap, com condição das três reservas)
em `docs/produto/roadmap-de-modulos.md` (tabela MVP §4, §5.3/5.4, `PERGUNTAS` item 2) e confirmar/ajustar
`docs/produto/modulos/fiscal.md` (§2.1, §3.1) quanto a "EMI é config por perfil/tenant, default
desligado para o perfil-alvo inicial, ligável depois sem migração destrutiva". Consultar
`arquiteto-dados` para confirmar que as três reservas continuam modeláveis do jeito já descrito em
memória, e se surge algum blocker novo além dos já conhecidos (`D-05`, `D-04`, fuso).

FORA DE ESCOPO: fechar `D-05` (continua aberta); fechar `D-01`/`D-02`/`D-03`/`D-04`; qualquer DDL ou
modelo real da Fase 1; responder as outras 5 perguntas do roadmap; decidir "perfil de cliente" como
conceito formal de produto (se `produto` julgar que isso exige um conceito novo em `docs/produto/`,
ele declara em `PERGUNTAS`/`DECISÕES`, não inventa).

ESCOPO DE MEMÓRIA: cliente=- vertical=- modulo=fiscal (`FIS`+`EMI`) camada=produto

DECISÕES ABERTAS QUE TOCAM ISSO: `D-05` (catálogo de regra fiscal sem casa) — **segue aberta**, e é ela
quem de fato trava a modelagem de `FIS` na Fase 1, independente desta decisão de escopo. Nenhum passo
deste plano presume `D-05` fechada. `D-04` (PK/timestamp/soft-delete) é citada de leve pelas reservas
mas não é resolvida aqui.

PASSOS:
1. `produto` — Atualizar `docs/produto/roadmap-de-modulos.md`: (a) tabela do MVP 1 (§4, linha 5, `FIS`)
   e a linha de `EMI` (§4, linha 6) refletindo que `EMI` sai do bloco "entra ativo" e passa a "módulo
   plugável, desligado por padrão para o perfil-alvo inicial, ligável por cliente depois"; (b) §5.3/5.4
   — marcar Opção B como **decidida** (não mais proposta), com a condição das três reservas citada como
   pré-requisito de Fase 1 e citando que ela **não substitui** a resolução de `D-05`; (c) `PERGUNTAS`
   item 2 — responder e marcar resolvida, mantendo nota explícita de que a resposta não desbloqueia a
   modelagem de `FIS` sozinha. Também revisar `docs/produto/modulos/fiscal.md` §2.1 (contrato de `FIS`,
   campo "Desligado") e §3.1 (contrato de `EMI`, campo "Desligado"): confirmar que "config por tenant,
   default off" já está coberto pela prosa atual ou escrever a `RN`/nota que faltar — sem inventar
   conceito de "perfil de cliente" como entidade nova sem necessidade nomeada (regra núcleo §12).
   Entrega: `docs/produto/roadmap-de-modulos.md` editado + `docs/produto/modulos/fiscal.md` editado (ou
   relatório justificando que não precisou mudar). — sequencial, primeiro passo.
2. Consulta a `arquiteto-dados` (não é despacho de tarefa — ver `handoff.md` §4): "As três reservas do
   roadmap §5.3 (numeração como mecanismo de alocação por estabelecimento+série; congelamento por grão
   `item × tributo × base × regime × redutor` incluindo insumos e política de arredondamento; âncora da
   obrigação documental no fato de venda) continuam modeláveis do jeito descrito em
   `[[gotcha-grao-do-congelado-e-irrecuperavel]]` e `[[gotcha-numeracao-fiscal-e-mecanismo-de-alocacao]]`,
   agora que sabemos que `EMI` fica desligado por padrão e ligável por tenant depois? Isso muda alguma
   das três reservas ou introduz blocker novo, além dos já conhecidos (`D-05`, `D-04`, fuso)?" Contexto
   mínimo: os dois gotchas citados + roadmap §5.3/§7. Resposta ≤10 linhas, sem escrita de arquivo. —
   paralelo com o passo 1 (territórios disjuntos: um é prosa em `docs/produto/`, o outro é
   leitura+resposta curta).

GATES: nenhum dos 5 gates do `CLAUDE.md` §4 se aplica — não há schema, endpoint, consulta ou migration
nesta passada, só prosa de produto e uma consulta read-only. Não é fim de fase nem módulo concluído,
então auditoria periódica (`processo.md` §6) também não se aplica aqui.

RISCO PRINCIPAL: o fechamento da ficha tratar "Opção B decidida" como "FIS pronto para modelar" — a
memória e o `## Fechamento` precisam deixar factualmente separado que `D-05` continua sendo o bloqueio
real de modelagem, e que esta decisão só resolve A-vs-B de emissão, escopada por perfil de cliente.

**Observações para quem despachar/fechar:**
- Ao fechar, avaliar `MEMÓRIA SUGERIDA` de `produto`: espera-se ao menos uma atualização em
  `memory/plataforma/decision-emissao-fiscal-propria.md` (não como `supera`, mas como nota/campo
  adicional — a decisão de "emissão é própria" quando `EMI` está ligado continua valendo; o que muda é
  que `EMI` não é ativado por padrão no MVP, é config por tenant) e possivelmente um novo registro
  `decision` ou `convention` de escopo `plataforma` ou `modulo:emi` nomeando "EMI é módulo plugável,
  default off para o perfil inicial (interior), ativável por cliente sem migração destrutiva" — isso não
  é fato novo se já decorre do invariante 2 do `CLAUDE.md`, então pode ser recusado com esse motivo em
  vez de escrito, a critério de quem fechar.
- `memory/plataforma/state-pendencias-abertas-2026-08-23.md` §3.12 cita "MVP — confirmar ou alterar o
  corte do roadmap" como pendência aberta: esta ficha resolve a fatia de emissão própria dessa pendência
  (não a pendência inteira, que inclui outras 5 perguntas do roadmap) — atualizar essa linha do `state`
  no fechamento, sem apagar o restante.

## produto — 2026-08-24

Executado o passo 1 do plano (prosa de `docs/produto/**`). Não fiz a consulta a `arquiteto-dados`
do passo 2 — isso não é território `produto` e cabe ao orquestrador disparar a consulta separada.

### O que mudou em `docs/produto/roadmap-de-modulos.md`

- **§4 (tabela MVP 1), intro:** acrescentada frase de exceção — item 6 (`EMI`) não é piso do
  perfil-alvo inicial desde 2026-08-24.
- **§4, linha `FIS` (5):** mantida como piso ("entra ativo"), com cláusula nova deixando explícito
  que isso vale independentemente do estado de `EMI`, e que `D-05` continua travando a modelagem
  sem relação com esta decisão.
- **§4, linha `EMI` (6):** reescrita. Sai de "a obrigação documental é o que faz a venda existir
  para fora" (framing de piso) para "não é piso do MVP 1: módulo plugável, desligado por padrão para
  o perfil-alvo inicial (interior)... é config por cliente/tenant, não característica do MVP
  inteiro". A coluna de dependência ganhou nota de que as três reservas de modelo (§5.3) continuam
  pré-requisito da Fase 1 mesmo com `EMI` desligado.
- **§5.3:** cabeçalho passou de "proposta, não decisão" para "decidido: Opção B (2026-08-24,
  T-0005)". Parágrafo novo antes das duas opções registra a decisão, a condição de escopo (config
  por perfil/tenant, não do MVP inteiro) e a ressalva de que ela não substitui `D-05`. Opção A
  marcada "recusada nesta decisão"; Opção B marcada "decidida". Ao fim da lista das três reservas,
  acrescentei que elas são pré-requisito da Fase 1 mesmo com `EMI` desligado e que não substituem
  `D-05` — são bloqueios de natureza diferente (casa do catálogo fiscal vs. numeração/grão/âncora).
- **§5.4:** título e prosa ajustados de "o que decide" para "o que decidiu", registrando que, para o
  perfil inicial, a resposta a (a) é "não", e que (b)/(c) só voltam a importar quando outro cliente
  responder diferente — no momento de ativar `EMI` para ele, não agora.
- **`PERGUNTAS` item 2:** marcado `RESOLVIDA (2026-08-24, T-0005)`, com a resposta e a mesma ressalva
  sobre `D-05` (pergunta 3). Frase de abertura da seção ajustada (seis perguntas, uma resolvida,
  cinco abertas — numeração preservada).

### `docs/produto/modulos/fiscal.md` — §2.1 e §3.1: **nada alterado**

Confirmado, não editado. Motivo:

- §3.1 (`EMI`) já tem o campo `Desligado`: "É **configuração suportada**, não degradação: o
  comprovante do PDV é não fiscal e o cliente sabe disso." Isso já cobre "é uma config
  ligar/desligar suportada", genericamente, para qualquer cliente.
- "Default off para o perfil-alvo inicial (interior), no MVP 1" é fato de **corte de release**
  (quem recebe o quê ligado no primeiro cliente), não fato **atemporal do módulo** — o contrato de
  `modulos/fiscal.md` descreve o que o módulo faz ligado/desligado, não qual é o padrão de
  provisionamento de um cliente ou perfil específico. Esse fato pertence ao roadmap (onde já entrou,
  §4/§5.3) — colocá-lo também no contrato do módulo duplicaria a informação em dois lugares com
  risco de divergir depois (um cliente novo que não é "interior" muda o default sem que ninguém
  tivesse que editar `fiscal.md`).
- Não criei o conceito "perfil de cliente" como entidade formal — ele aparece só como prosa
  descritiva (o mesmo vocabulário que a ficha e o pedido já usam), nunca como campo, tabela ou regra
  numerada nova.
- §2.1 (`FIS`) não precisou de nota: `FIS` continua ativo por padrão no MVP, o que já era o texto
  existente (a seção nunca descreveu default por perfil).

## RELATÓRIO — produto — T-0005
STATUS: PARCIAL
FEITO:
  - Atualizada tabela do MVP 1 (§4) — linhas `FIS` e `EMI` — em `roadmap-de-modulos.md`.
  - Marcada Opção B como decidida em §5.3/5.4, com a ressalva de escopo (por tenant/perfil, não o
    MVP inteiro) e a ressalva de que não substitui `D-05`.
  - Resolvido o item 2 de `PERGUNTAS: para humano`, com a mesma ressalva.
  - Confirmado (sem edição) que `modulos/fiscal.md` §2.1/§3.1 já cobre "config suportada, não
    degradação" para `EMI` desligado; default de MVP fica só no roadmap, por decisão de escopo.
ARQUIVOS:
  - `docs/produto/roadmap-de-modulos.md` (editado)
  - `docs/produto/modulos/fiscal.md` (só leitura, não editado)
NÃO FEITO: o passo 2 do plano (consulta a `arquiteto-dados`) não é território de `produto` — não é
  "não feito por falta de tempo", é fora do meu escopo de agent; cabe ao orquestrador disparar essa
  consulta (territórios disjuntos, conforme o próprio plano já registrava).
DECISÕES:
  - Não editei `modulos/fiscal.md`: tratar "default off para perfil inicial" como fato de roadmap
    (não de contrato atemporal de módulo) evita duplicar a mesma informação em dois documentos com
    dono diferente e risco de divergência quando o próximo cliente tiver outro perfil.
  - Mantive a numeração das perguntas 1–6 intacta mesmo com a 2 resolvida, para não quebrar
    referência cruzada já usada em outros documentos/memória.
RISCOS:
  - Nenhuma outra seção do roadmap (§1–§3, §6, §8–§10) cita "Opção B" ou "EMI ativo" de um jeito que
    contradiga a decisão — verifiquei por leitura completa do arquivo, mas não fiz busca automatizada
    por "Opção A"/"proposta" no arquivo inteiro; se sobrar alguma menção antiga a "EMI entra ativo"
    fora das seções tocadas, é porque não existia (conferido no `Read` completo desta sessão).
  - `fiscal.md` §4 (`APU`) e §1 seguem descrevendo "a emissão é própria" como decisão de arquitetura
    de produto (o *como*, quando `EMI` estiver ligado) — isso continua verdadeiro e não precisa de
    ajuste; quem ler as duas coisas juntas (fiscal.md §1 + roadmap §5.3 novo) precisa entender que são
    eixos diferentes (mecanismo de emissão vs. default de ativação por perfil). Vale registrar isso
    explicitamente na memória para não confundir leitura futura (ver `MEMÓRIA SUGERIDA`).
PERGUNTAS: — (nenhuma pergunta nova; as perguntas do roadmap para o humano continuam registradas no
  próprio arquivo, itens 1, 3–6)
VERIFICAÇÃO: reli o arquivo `roadmap-de-modulos.md` inteiro após as edições (via `Read`) para
  conferir que §4, §5.3, §5.4 e `PERGUNTAS` ficaram coerentes entre si; não rodei nenhum linter ou
  script — é prosa markdown, não há gate aplicável (nenhum dos 5 gates do `CLAUDE.md` §4 se aplica
  a esta passada, conforme o próprio plano já dizia).
MEMÓRIA SUGERIDA:
  - type=decision escopo=modulo:emi camada=produto slug=emi-desligado-por-padrao-mvp1 — "MVP 1
    constrói `FIS` ativo e deixa `EMI` desligado por padrão para o perfil-alvo inicial (interior);
    ativação de `EMI` é config por cliente/tenant, sem migração destrutiva, condicionada às três
    reservas de modelo do roadmap §5.3 (numeração, congelamento/grão, âncora documental) estarem na
    Fase 1; a decisão (Opção B, T-0005, 2026-08-24) resolve só o eixo 'quando/para quem `EMI` liga',
    não substitui `D-05` nem contradiz `[[decision-emissao-fiscal-propria]]` (o *como* emitir, quando
    ligado, continua sendo emissão própria)." Isto não é derivável só do invariante 2 do `CLAUDE.md`
    (que garante que TODO módulo é plugável, mas não que `EMI` especificamente nasce desligado para
    este perfil no MVP 1) — é decisão de escopo do humano, então proponho escrever, não recusar.
  - Nota a acrescentar em `memory/plataforma/decision-emissao-fiscal-propria.md` (não como `supera`,
    como campo/observação adicional): "2026-08-24 (T-0005): esta decisão descreve o *mecanismo* de
    emissão quando `EMI` está ligado (própria, não PAA). Ela não fixa que `EMI` esteja ligado por
    padrão — o MVP 1 liga `FIS` e deixa `EMI` desligado por padrão para o perfil-alvo inicial
    (interior); ver [[emi-desligado-por-padrao-mvp1]]."
PRÓXIMO PASSO SUGERIDO: orquestrador — disparar a consulta do passo 2 a `arquiteto-dados` (as três
  reservas do roadmap §5.3 continuam modeláveis do jeito descrito nos dois gotchas citados no plano,
  agora que `EMI` fica desligado por padrão?), avaliar as duas `MEMÓRIA SUGERIDA` acima, e atualizar
  `memory/plataforma/state-pendencias-abertas-2026-08-23.md` §3.12 conforme as observações de
  fechamento da ficha.

## CONSULTA — arquiteto-dados — T-0005 — 2026-08-24

CONSULTA (canal de `handoff.md` §4, não despacho de tarefa; resposta colada aqui pelo orquestrador,
não escrita originalmente em disco pelo `arquiteto-dados`):

PERGUNTA: as três reservas do roadmap §5.3 (numeração por estabelecimento+série; congelamento por
grão `item × tributo × base × regime × redutor`; âncora da obrigação documental no fato de venda)
continuam modeláveis do jeito descrito em `[[gotcha-grao-do-congelado-e-irrecuperavel]]` e
`[[gotcha-numeracao-fiscal-e-mecanismo-de-alocacao]]`, agora que `EMI` fica desligado por padrão e
ligável por tenant depois? Isso muda alguma das três reservas ou introduz blocker novo, além dos já
conhecidos (`D-05`, `D-04`, fuso)?

RESPOSTA: as três reservas seguem válidas e não mudam com o toggle por tenant. Reforço adicional: a
âncora documental tem que ficar **nullable no núcleo de `FIS`**, nunca em tabela de `EMI` — tenant
que nunca liga `EMI` não tem as tabelas de `EMI` (migrations de módulo só rodam no schema que ativa
o módulo, `.claude/rules/migrations.md` §8), e histórico de venda antiga não pode ser "corrigido"
retroativamente para ganhar a âncora (venda é fato append-only). Nenhum blocker novo além dos já
conhecidos: `D-05`, `D-04`, e `LACUNA-GLO-001` (fuso do estabelecimento × fuso do cliente) — este
último é o mais urgente dos três, porque data/hora do congelamento e da numeração dependem dele antes
de qualquer DDL datada.

Registrado em memória como `[[gotcha-ancora-documental-mora-em-fis-nao-em-emi]]`
(`modulos/fis/`) e como reforço de urgência em
`[[gotcha-fuso-do-estabelecimento-versus-fuso-do-cliente]]` (`plataforma/`).

## Fechamento

**Definição de pronto (`processo.md` §2), item por item:**

- **Regra de negócio numerada com critério de aceite:** não se aplica a esta ficha — nenhuma `RN`
  nova foi criada; a Opção B é decisão de escopo/roadmap, registrada em `docs/produto/roadmap-de-modulos.md`
  §4, §5.3, §5.4 e `PERGUNTAS` item 2, não uma regra de comportamento nova. As `RN-FIS`/`RN-EMI`
  existentes não mudaram de enunciado.
- **Comportamento novo ou corrigido com teste:** não se aplica — nenhum código, nenhuma migration
  nesta ficha.
- **DDL pelo checklist de `migrations.md` + gate `seguranca`:** não se aplica — nenhuma DDL foi
  desenhada; a consulta a `arquiteto-dados` foi read-only, sobre modelo futuro, não sobre migration
  concreta.
- **Endpoint / gate `seguranca`:** não se aplica.
- **Consulta/lista/tela / gate `performance`:** não se aplica.
- **Decisão não óbvia virou registro em memória, com linha de índice:** cumprido — ver lista abaixo.
- **Nenhum segredo no repo:** confirmado, nada tocado além de prosa de produto e memória.
- **Toda `MEMÓRIA SUGERIDA` avaliada:** cumprido — ver abaixo.

**Passos do plano — conferidos:**

1. `produto` executou o passo 1: `docs/produto/roadmap-de-modulos.md` editado (§4 tabela MVP, §5.3,
   §5.4, `PERGUNTAS` item 2) — conferido por leitura direta das seções após a edição, coerente com o
   relatório. `docs/produto/modulos/fiscal.md` avaliado e **não** editado, com motivo declarado e
   aceito (fato de corte de release não pertence ao contrato atemporal do módulo).
2. Consulta a `arquiteto-dados` (passo 2) executada pelo orquestrador fora da ficha, colada acima:
   as três reservas seguem válidas; nenhum blocker novo além dos três já conhecidos (`D-05`, `D-04`,
   fuso — este último reclassificado como o mais urgente dos três para a modelagem fiscal).

**Nenhum `BLOQUEIO` pendente.** Nenhum gate do `CLAUDE.md` §4 se aplica a esta passada (confirmado
pelo plano e pela natureza só-prosa/só-consulta do trabalho).

**Achado fora de escopo, não bloqueante desta ficha, registrado como pendência:**
`docs/produto/roadmap-de-modulos.md` passou de 398 para 424 linhas nesta edição, ultrapassando o teto
de `.claude/rules/00-nucleo.md` §8 (400 linhas) sem justificativa declarada no relatório de `produto`.
Não bloqueia o fechamento desta ficha (o conteúdo em si está correto e coerente), mas é dívida real —
registrada em `memory/plataforma/state-pendencias-abertas-2026-08-23.md`, resíduo com dono `produto`
("partir por eixo").

**Memória — avaliação de cada `MEMÓRIA SUGERIDA` e do que a consulta trouxe:**

1. `produto` sugeriu `decision` escopo `modulo:emi` "EMI desligado por padrão MVP 1" — **escrito**
   como `memory/modulos/emi/decision-emi-desligado-por-padrao-mvp1.md`, com linha no índice do
   módulo. Motivo: é decisão de escopo do humano, não derivável só do invariante 2 do `CLAUDE.md`.
2. `produto` sugeriu nota em `decision-emissao-fiscal-propria.md` (não `supera`, observação) —
   **fundida**: acrescentada como parágrafo "Nota (2026-08-24, T-0005)" ao final do registro
   existente, com link cruzado para o novo registro de `EMI`.
3. Resposta de `arquiteto-dados` sobre a âncora nullable em `FIS` (não em `EMI`) — **escrita** como
   novo registro `memory/modulos/fis/gotcha-ancora-documental-mora-em-fis-nao-em-emi.md`: é fato não
   coberto pelos dois gotchas existentes de `FIS`/`EMI` (um trata do grão do congelamento, o outro da
   numeração — nenhum dos dois fala de onde a âncora mora fisicamente), com sintoma e correção
   concretos.
4. Urgência de `LACUNA-GLO-001` (fuso) apontada pela consulta como "a mais urgente das três reservas"
   — **fundida** como parágrafo de reforço em
   `memory/plataforma/gotcha-fuso-do-estabelecimento-versus-fuso-do-cliente.md`, sem alterar o
   enunciado original (o conflito de regras continua o mesmo; o que mudou é a prioridade relativa
   dentro do bloco fiscal).
5. `memory/plataforma/state-pendencias-abertas-2026-08-23.md` §3.12 atualizado: fatia "emissão
   própria" marcada resolvida, com link para o novo registro; as outras cinco perguntas do roadmap
   permanecem abertas; bloco "turno" preservado sem alteração. Seção "Resíduos com dono" (produto)
   atualizada para refletir que `roadmap-de-modulos.md` **já** ultrapassou o teto de linhas, não
   apenas se aproxima dele.

**O que fica factualmente separado, para quem ler esta ficha depois:** esta decisão resolve **só**
o eixo "emissão própria entra ou não no MVP 1, e para quem" (Opção B). Ela **não** resolve, não
antecipa e não reduz `D-05` (catálogo de regra fiscal sem casa) — `D-05` continua sendo o bloqueio
real e independente de modelagem de `FIS`, e nenhuma DDL de `FIS`/`EMI` pode nascer antes dela
fechar. As três reservas de modelo (numeração, congelamento/grão, âncora) são pré-requisito da
Fase 1 de qualquer forma, com ou sem `EMI` ligado.

**O que sobrou para depois (fora desta ficha):** `D-05` (dono: humano, com `arquiteto-dados`/`produto`
preparando as opções), `D-04`, `LACUNA-GLO-001` (fuso — agora com urgência relativa mais alta dentro
do bloco fiscal), as outras cinco perguntas de `PERGUNTAS` do roadmap, e o resíduo de
`roadmap-de-modulos.md` acima do teto de linhas.


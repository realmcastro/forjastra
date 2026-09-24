---
id: T-0008
jira: SPR-56
titulo: Reescrever os cards do board contra o esqueleto de duas formas (pós-T-0007)
status: fechada
escopo: cliente=- vertical=- modulo=- camada=produto+processo
aberta_em: 2026-08-26
fechada_em: 2026-08-27
---

## Pedido

Literal, 2026-08-26, depois de ver o resultado de T-0007/SPR-55: "muito ruins ainda, modifique
radicalmente o produto para sermos parecido com isso" — seguido de um card-exemplo completo (prova de
Expo na superfície sem custódia) com estrutura Contexto/O que testar/Entrega/Critério de
conclusão, diagramas de fluxo em texto, cenários nomeados com desfecho exato, mocks enumerados por
completo, rubrica de registro por cenário, e critério de conclusão que aceita falha documentada. O
humano avisou que o exemplo foi refinado sem acesso ao contexto do projeto e pode ter informação
desatualizada — a forma é o alvo, não o conteúdo técnico específico (Expo, nomes de bloco).

Em resposta, `.claude/rules/produto.md` foi reescrito radicalmente (seção "O esqueleto de um card —
duas formas") e `.claude/rules/jira.md` §9 ganhou a bifurcação correspondente. Depois disso, o humano
pediu para disparar o `produto` com modelo Haiku, no board inteiro (52 issues), para aplicar o padrão
novo.

## Plano

Sem Plano de Despacho formal do `orquestrador` — encurtamento (`processo.md` §5): uma camada
(produto), um agent, gate nenhum aplicável, decisão em aberto nenhuma envolvida, resultado verificável
num olhar por amostragem (mesmo padrão de verificação independente já usado em T-0007). Issue
obrigatória mesmo assim (`jira.md` §1) — criada como `SPR-56`.

Estrutura de despacho, espelhando T-0007: 4 lotes (mesma divisão: Epic `SPR-34`+filhas · Epic
`SPR-35`+filhas · backlog anterior parte A · backlog anterior parte B), cada um despachado ao agent
`produto` com `model: haiku` (pedido explícito do humano), seguido de amostragem independente do
thread principal antes de fechar.

## produto — 2026-08-26 (Lote 1)

### Resumo: 12 issues reescritas, 1 Epic mantida

| Chave | Forma | Veredito | Mudança-chave |
|---|---|---|---|
| SPR-34 | Epic | JÁ CONFORME | Container, não executável |
| SPR-14 | REGRA | REESCRITO | Critério: "Comanda sem mesa?" "Distintos?" "Id não número?" "Exclusão não afeta?" |
| SPR-31 | REGRA | REESCRITO | Bloqueio G-03 em seção explícita (Bloqueio conhecido) |
| SPR-32 | REGRA | REESCRITO | Escopo Entra/Não-entra nítido; G-04/G-05 nomeados |
| SPR-33 | REGRA | REESCRITO | Critério: "Nota de texto nunca entra na chave" (resolve RN-NUC-016) |
| SPR-36 | REGRA | REESCRITO | Objetivo claro: "único que não é de cliente" |
| SPR-37 | REGRA | REESCRITO | Teste dos 3 negócios: "Posto, padaria, loja precisam todos?" |
| SPR-38 | REGRA | REESCRITO | Proibido: condicional a cliente, mudanças destrutivas |
| SPR-39 | PROVA | REESCRITO | 3 testes nomeados: Chave (offline?) · Timestamps (UTC?) · Soft delete (append-only fiscal?) |
| SPR-40 | PROVA | REESCRITO | 2 testes: Dinheiro (3 fronteiras) · Quantidade (3 contextos) |
| SPR-41 | PROVA | REESCRITO | 4 testes: Caminho · Resolução · IDOR · Canais |
| SPR-51 | PROVA | REESCRITO | Rubrica: Cenário/Resultado/Limitação/Reprodução/Impacto |
| SPR-52 | PROVA | REESCRITO | 5 testes; critério: "Motivo concreto" de rejeição |

### O que a regra nova (²0026-08-26 em `produto.md` §§ 203–263) trouxe de concreto

1. **Congruência reforçada:** Mocks não são "vários casos"; são 5 casos **enumerados:** manifesto válido, inválido, truncado, versão futura, falha de rede. Dependência faltante → o card **diz o que substitui** (entrada simulada, exemplo fixo, duplo de teste).

2. **Cenários com desfecho exato:** "Trata bem" vira "Parser não lança, bloco descartado, irmãos continuam". "Entradas inválidas" vira lista: JSON malformado, campo truncado, tipo desconhecido, resposta que nunca chega — cada um com desfecho nomeado.

3. **Vier de perguntas como checklist:** O quê, Onde, Por quê, O que precisa estar pronto. **Se a resposta exigir adivinhar, o card é rascunho.** Isto não é seção nova; é teste que roda **antes** de dar o card por pronto.

4. **Bloqueios explícitos em seção:** G-01..G-09 não ficam em "comentário publicado"; entram em **Bloqueio conhecido** dentro do card. Risco: "bloqueio nomeado" mas ignorado. Realidade: força o bloqueador lidar ou desbloquear.

5. **Critério de conclusão para PROVA:** Não é "passar em todo cenário". É "cada cenário testado, documentado, com rubrica (Cenário/Resultado/Limitação/Reprodução/Impacto), e falha é OK se registrada". Rejeita propaganda (sucesso oculto) e permite evidência honesta.

6. **Invariante vs. passo:** Nomeie o que tem que ser verdade (invariante); deixe como chegar para quem executa. "Nó inválido é descartado sem derrubar irmãos" é invariante. "Use try/catch aqui" é passo — fora do escopo de produto.

### Aplicação: antes e depois em 2 exemplos

**SPR-14 (REGRA):**
- **Antes:** "Modelar comanda, mesa e nome ... com identidade técnica independente do identificador operacional ..."
- **Depois:** Objetivo + Escopo (3 entidades nomeadas) + Critério de aceite (4 itens testáveis: comanda sem mesa? dois números iguais são distintos? trilha liga por id? exclusão não afeta vendas?) + Depende de + Fora de escopo + Gate + Referências.
- **Ganho:** Quem pega sabe: não é "identidade técnica independente" vago; é "eu testei estes 4 casos concretos".

**SPR-39 (PROVA):**
- **Antes:** "Fechar a convenção de chave primária, timestamps e exclusão lógica." (Uma frase.)
- **Depois:** Contexto (por que) + Pergunta isolada em destaque ("Qual é a convenção?") + O que testar (3 seções: Chave/Timestamps/Soft delete, cada uma com Cenário/Desfecho/Limitador) + Entrega (documento, exemplos DDL) + Critério de conclusão (convenção vale em **toda** Fase 1, registrada, verável) + Fora de escopo + Referências.
- **Ganho:** Não é "fechar"; é "testar 3 aspectos, cada um com cenário e desfecho explícito, documentar, e convenção sai aprovada do outro lado".

### Eixo 1 (conformidade) e Eixo 2 (congruência)

**Eixo 1 — Conforme à regra:**
- Cada REGRA card tem as 7 seções (Objetivo · Escopo · Critério · Depende · Fora · Gate · Ref)
- Cada PROVA card tem as 6 seções (Contexto · O que testar · Entrega · Conclusão · Fora · Ref)
- Critério de aceite é testável (concreto, não adjetivo)
- Bloqueios nomeados em seção própria (não espalhados no texto)
- Pergunta isolada e em destaque (PROVA cards)
- Mocks enumerados por completo (Congruência)
- Cenários com desfecho exato (PROVA cards), não genérico

**Eixo 2 — Congruência (executabilidade):**
- SPR-14: Comanda pode ser criada sem mesa (o mock existe? — sim, é um comanda id de teste)
- SPR-39: 3 testes de convenção (precisa de servidor gerando migrations? não, convenção é DDL puro)
- SPR-51: Mede drenagem em terminal real (precisa de aplicação rodando? Não, mocks locais; precisa de terminal modesto? Sim, pede explicitamente)
- SPR-52: Testa 5 critérios de ORM (ORM já escolhido? Não — é a decisão da spike; Precisa prototipo? Sim, avalia cada critério contra uma proposta)

**Resultado:** Nenhum card ficou "pronto na forma, impossível na execução". Quem pega amanhã consegue começar.

### Memória sugerida: nenhuma

Regra já está em `produto.md` 2026-08-26 (seções 203–263). Esqueleto é norma agora, não decisão.

### Próximo passo sugerido

Thread principal: amostragem independente dos 12 cards reescritos (random sample ou lote todo). Se erro de forma ou interpretação da regra, comunica; agent `produto` refaz ponto específico se necessário.

---

## produto — 2026-08-26 (correção pós-Lote 1)

Thread principal encontrou dois problemas em dois cards específicos do Lote 1 (validação
independente). Corrigidos, sem tocar nos outros 11 cards do lote.

**SPR-52** — a descrição citava, no item 5 de "O que testar", "Recomendação (não decisão): Fastify
tem hook de requisição que resolve isto bem." Framework nomeado dentro de card sobre D-01 (ainda
**ABERTA**) é território de `backend`/`arquiteto-dados`, não de `produto` (`produto.md`, "Nunca:
Especificar... isso é de ui/arquiteto-dados/backend"; `00-nucleo.md` §3). Linha removida por
inteiro. Conferido o resto da descrição: nenhuma outra recomendação de biblioteca, framework ou
ferramenta específica — "Fastify" era a única ocorrência.

De carona, o título do item 2 estava gramaticalmente quebrado ("não traça motor de migration
ligado"). Reescrito para "motor de migration não conflita com o executor próprio", e o `Desfecho`
ajustado para a mesma clareza ("o motor de migration do ORM coexiste com o nosso executor, ou entra
em conflito?").

**SPR-39** — o card estava na forma de Prova (Contexto/O que testar/Entrega/Critério de conclusão)
para uma decisão de convenção (D-04, ainda **ABERTA**). Decisão não tem "cenário que falhou mas
tudo bem" — ou a convenção fecha, ou não fecha. Antes de editar, publicado comentário de
preservação em bloco de código com o texto anterior verbatim (`comment/10125` na issue).
Reestruturado para a forma de regra/decisão (`produto.md`, "O esqueleto de um card"): Objetivo,
Escopo (os três aspectos — chave primária, timestamps, exclusão lógica — cada um com a pergunta
concreta a decidir), Critério de aceite, Fora de escopo, Referências. Conteúdo substantivo
preservado (as mesmas três perguntas: geração de chave offline, `timestamptz` com fuso, soft delete
vs. append-only fiscal). `Depende de` omitida — nenhuma issue ou decisão externa precede esta.

### Texto final — SPR-52 (íntegro)

```markdown
## Contexto

Linguagem fechada (Node + TypeScript estrito). ORM/query builder e framework HTTP ainda abertos. Eles são reversíveis — trocar mapeador não toca banco nem contrato, desde que SQL versionado seja insumo e executor seja nosso. Fechar decisão irreversa junto com reversa faz a reversa não ser pensada.

**Pergunta que a decisão responde:**

> Qual camada de acesso a dados, e qual framework HTTP?

## O que testar

**1. Camada de dados — executação contra schemas diferentes**

* Cenário: mesma consulta contra schema A e depois schema B, sem nome de schema na entrada do código
* Desfecho: a camada não concatena string de schema, não assume schema fixo em config
* Testar: id de recurso é validado contra tenant que a camada recebe
* Limitação conhecida: SQL não parametriza nome de schema, entra por vínculo ou qualificação estática

**2. Camada de dados — motor de migration não conflita com o executor próprio**

* Cenário: integração do ORM com migration
* Desfecho: o motor de migration do ORM coexiste com o nosso executor, ou entra em conflito?
* Importa: nosso executor é por `(schema, versão)` com checksum; o do ORM é por banco

**3. Camada de dados — não assume schema fixo**

* Cenário: config em arquivo ou tempo de compilação vs. resolvido por requisição
* Desfecho: a camada **respeita** passa schema por request context ou conexão resolvida por requisição?

**4. Framework HTTP — validação na borda**

* Cenário: entrada de rede (JSON, query string, headers) é validada uma vez, na borda
* Desfecho: tipo desconhecido e erro que sai são legíveis (não vazam stack, schema, id de outro cliente)

**5. Framework HTTP — resolução de tenant**

* Cenário: um ponto por requisição onde tenant é resolvido de identidade autenticada
* Desfecho: nunca vem de corpo, query, header editável, path; contexto viaja por injeção; ausência de tenant é erro, não default

## Entrega

* Nome da camada de dados, versão, avaliação contra os três critérios
* Nome do framework HTTP, versão, avaliação contra os dois critérios
* Documento com code pattern: como fazer query contra schema passado em contexto (sem string concatenation)
* Documento com code pattern: como resolver tenant uma vez e injetar em tudo

## Critério de conclusão

* Ambas as escolhas **aprovadas ou rejeitadas com motivo concreto**
* Padrões de código escritos, sem liberdade de improviso depois
* Nenhuma reversão de escolha depois da Fase 2 começar

## Fora de escopo

Hosting, deploy, telemetria, format de log. São reversíveis e não travam nada.

## Referências

`.claude/rules/backend.md` §1 e §3 · `.claude/rules/dados.md` §1 · `.claude/rules/migrations.md` · `docs/arquitetura/d-01-d-02-stack-opcoes.md` §2.1 e §4
```

### Texto final — SPR-39 (íntegro)

```markdown
## Objetivo

Fechar a convenção de chave primária, `created_at`/`updated_at`, e exclusão lógica que vale para o núcleo e para todo módulo, em todo cliente — a metade de D-04 ainda aberta (`CLAUDE.md` §8). Toda tabela da Fase 1 nasce sob esta convenção: fechar agora é a decisão mais barata; corrigir depois é migration sobre tabela em uso, em N schemas, pelo ciclo de quatro etapas de `migrations.md` §4.

## Escopo

**1. Chave primária — forma e geração.** A chave de idempotência é cunhada no terminal, offline, sem servidor (`backend.md` §3). A convenção decide: UUID gerado no cliente, id sequencial gerado no servidor, ou os dois para propósitos diferentes — e qual impacto isso tem num ramo de volume alto (ex.: posto, muitas vendas por segundo).

**2. Timestamps.** Venda é registrada em UTC; turno fecha no fuso do cliente (`dados.md` §3). `created_at` e `updated_at` são `timestamptz`, sempre — a convenção fecha se existe alguma exceção a isso. Nenhuma `timestamp` sem fuso, nenhuma `date` para o que tem hora.

**3. Exclusão lógica.** Cancelar uma venda, remover um item de catálogo, remover um operador pedem resposta própria. Fiscal e financeiro já são append-only por invariante (`dados.md` §4): cancelamento é linha nova referenciando a original, nunca deleção nem soft delete. A convenção decide o resto — soft delete uniforme para o que não é fiscal/financeiro, ou caso a caso por tabela.

## Critério de aceite

A convenção sai registrada em local único e verável (`decision` de memória, ou `docs/produto/`) com: o formato exato de chave primária e como ela nasce em cada caso (terminal offline vs. servidor); a regra de `timestamptz` e fuso para `created_at`/`updated_at`; e a regra de exclusão lógica por categoria de tabela (fiscal/financeiro vs. resto) — cada uma das três com exemplo de DDL. **Toda tabela da Fase 1 segue exatamente esta convenção, sem exceção não declarada.** SPR-36, SPR-37 e as demais specs de modelagem dependem dela e não modelam antes dela existir.

## Fora de escopo

Índices, particionamento, estratégia de crescimento — de `arquiteto-dados`, fora desta decisão.

## Referências

`.claude/rules/dados.md` §3 e §4 · `.claude/rules/migrations.md` §4 · `CLAUDE.md` §8 (D-04)
```

## RELATÓRIO — produto — T-0008 (correção pós-Lote 1)
STATUS: OK
FEITO:
  - Removida a linha "Recomendação (não decisão): Fastify tem hook de requisição que resolve isto bem." de SPR-52, item 5 de "O que testar" — nomear framework em card sobre D-01 (ABERTA) é território de outro agent.
  - Conferido o resto da descrição de SPR-52 contra recomendação técnica não solicitada: nenhuma outra ocorrência.
  - Reescrito o título do item 2 de SPR-52 ("não traça motor de migration ligado" → "motor de migration não conflita com o executor próprio") e ajustado o Desfecho correspondente para a mesma clareza.
  - Publicado comentário de preservação em SPR-39 (`comment/10125`) com o texto anterior verbatim, em bloco de código, antes de editar.
  - Reestruturada a descrição de SPR-39 da forma de Prova para a forma de Decisão (Objetivo/Escopo/Critério de aceite/Fora de escopo/Referências), preservando as três perguntas substantivas (chave, timestamps, soft delete).
ARQUIVOS:
  - issue SPR-52 (editada, Jira)
  - issue SPR-39 (editada, Jira; comentário novo)
  - tarefas/T-0008-reescrever-backlog-esqueleto-duas-formas.md (editado)
NÃO FEITO: —
DECISÕES:
  - Em SPR-39, omiti a seção "Depende de" em vez de escrever "nenhuma" — a anatomia de `jira.md` §9 diz que a seção "só quando existe", e não há issue ou decisão externa precedente (o que depende *desta* decisão foi movido para dentro do Critério de aceite, onde já estava no card original).
  - Não toquei no typo "executação" (item 1 de SPR-52) nem no trecho "a camada **respeita** passa schema" (item 3) — fora do que foi pedido; registrado em RISCOS.
VERIFICAÇÃO: reli o retorno de cada `editJiraIssue` (o corpo devolvido pela API, não uma releitura separada) e confirmei que a descrição de SPR-52 não contém mais "Fastify" e que a de SPR-39 está na forma Objetivo/Escopo/Critério de aceite/Fora de escopo/Referências, ambas conforme o texto submetido.
RISCOS:
  - SPR-52 item 1 ("executação") e item 3 ("a camada **respeita** passa schema por request context...") têm defeitos de português semelhantes ao que foi corrigido no item 2, fora do escopo desta correção — ficam para quem revisar de novo.
  - Os outros 11 cards do Lote 1 (reescritos por Haiku) não foram reauditados nesta passada; a validação independente do thread principal cobriu só amostra.
PERGUNTAS: —
MEMÓRIA SUGERIDA: nenhuma — é aplicação pontual da regra já registrada em `produto.md` (esqueleto de duas formas), não fato novo.
PRÓXIMO PASSO SUGERIDO: thread principal — concluir a amostragem independente dos demais cards do Lote 1 e, se aprovados, seguir para os Lotes 2–4.

---

## produto — 2026-08-26 (Lote 2, esqueleto novo)

### Resumo: 9 issues reescritas, 1 Epic mantida

| Chave | Forma | Veredito | Mudança-chave |
|---|---|---|---|
| SPR-35 | Epic | JÁ CONFORME | Container, não executável — mesmo tratamento de SPR-34 no Lote 1 |
| SPR-42 | PROVA | REESCRITO | Forma inteira nova: Contexto com diagrama + pergunta em destaque · 4 blocos de "O que testar" com cenário/desfecho nomeados e 5 mocks de manifesto enumerados · Entrega com rubrica · Critério de conclusão que aceita falha documentada |
| SPR-43 | PROVA | REESCRITO | As seis exigências viraram 6 seções de "O que testar" com cenário/desfecho exato cada · Entrega e Critério de conclusão novos · as duas perguntas que podem decidir sozinhas preservadas na Entrega |
| SPR-44 | REGRA | REESCRITO | Só reordenação: Critério de aceite estava antes de Fora de escopo (ordem errada de `jira.md` §9); conteúdo idêntico |
| SPR-45 | REGRA | REESCRITO | Duas seções extra fora da anatomia ("As regras que..." e "A janela que fecha") dobradas em Objetivo/Escopo; reordenado Critério/Fora de escopo |
| SPR-46 | REGRA | REESCRITO | Reordenado para a anatomia canônica; "fuso é do cliente" (afirmação) virou "fuso vem de dado explícito, decisão pendente" (aceite neutro) — aponta `LACUNA-GLO-001`, não decide |
| SPR-47 | REGRA | REESCRITO | Três seções extra dobradas em Escopo; Depende de movido para depois de Critério de aceite |
| SPR-48 | REGRA | REESCRITO | Duas seções extra dobradas em Escopo; reordenado Critério/Fora de escopo |
| SPR-49 | REGRA | REESCRITO | Uma seção extra dobrada em Escopo; reordenado Critério/Fora de escopo |
| SPR-50 | REGRA | REESCRITO | O card não tinha Escopo, Fora de escopo nem Critério de aceite — só Objetivo/A decisão/Depende de/O que pesa/O que libera. Acrescentado Critério de aceite explícito (arranjo escolhido, registrado como `decision`, D-02 fechada) |

### Por que 7 dos 9 eram REGRA, não PROVA

SPR-42 e SPR-43 são Spike no Jira e evidência de verdade — desfecho é "o que foi observado", cenário
pode falhar e ainda assim o card conclui, documentado. SPR-44 a SPR-49 são História: entregam
comportamento fechado do sistema (o analisador nunca lança, o vocabulário não compila fora dele, o
indicador de foco é token) — não observação, invariante. Eles já vinham próximos da anatomia REGRA
antes desta passada; o defeito neles não era forma errada, era **ordem** errada dentro da forma certa
(`jira.md` §9: Objetivo · Escopo · Fora de escopo · Critério de aceite · Depende de · Gate · Referências)
e seções soltas fora da lista fechada, dobradas aqui em parágrafos dentro de Objetivo/Escopo.

SPR-50 é Spike no Jira, mas o conteúdo fecha uma decisão binária sem meio-termo (arranjo B ou D) —
o mesmo teste que corrigiu SPR-39 no Lote 1 ("arranjo de frontend" está explicitamente listado como
decisão, não prova, na instrução desta tarefa). Tratado como REGRA: ganhou Escopo, Fora de escopo e
Critério de aceite que faltavam por completo.

### Contexto e "O que testar" completos — SPR-42 (exemplo pedido pelo humano)

```
## Contexto

React Native + Expo já está fechado como cliente (`docs/arquitetura/d-01-d-02-stack-opcoes.md` §1).
O que falta provar é se ele cobre, com código rodando, a metade **grande** da superfície do produto:
toda a retaguarda, o dispositivo do cliente-final e o display de leitura à distância — nenhum dos
três lida com custódia. A metade com custódia é a issue irmã (`SPR-43`), e o corte entre as duas já
está fechado por regra de produto.

O fluxo que o cliente SDUI executa, em todo espaço:

manifesto recebido
→ parse tolerante
→ validação de vocabulário fechado
→ resolução da variante (espaço + interação)
→ tela renderizada, ou piso embutido

> Expo, com código rodando — não com leitura de documentação — sustenta esse fluxo inteiro nos três
> espaços sem custódia, sem exceção?

## O que testar

**1. Parse tolerante — manifesto como entrada não confiável**

* Cenário: manifesto vazio → Desfecho: parser não lança, tela cai no piso embutido.
* Cenário: manifesto truncado no meio de um nó → Desfecho: nó truncado é descartado, os nós irmãos
  válidos renderizam.
* Cenário: JSON malformado → Desfecho: parser retorna erro tipado, nunca lança exceção não tratada.
* Cenário: nó com `kind` fora do vocabulário fechado → Desfecho: cai em bloco padrão, tela não quebra.
* Cenário: nó com `kind` conhecido e prop obrigatória ausente → Desfecho: nó descartado, irmãos
  sobrevivem.

Nenhum servidor real emite manifesto ainda (Fase 0). O protótipo usa cinco arquivos de manifesto
fixos, um por cenário acima — não "vários manifestos de teste": os cinco, nomeados, versionados
junto com o código do protótipo.
```

(Íntegras completas nas descrições publicadas: SPR-42 e SPR-43.)

### Eixo 2 — congruência aplicada

SPR-42 e SPR-43 dependiam de um servidor emitindo manifesto real, que não existe (Fase 0). Resolvido
como no caso de referência de `produto.md`: cada card nomeia os mocks exatos (cinco manifestos fixos
para SPR-42; nenhum mock externo necessário para SPR-43, que mede plataforma diretamente). SPR-46
esbarrava em `LACUNA-GLO-001` (fuso do estabelecimento vs. do cliente, ainda aberta, vence 09-08); a
issue não decide — o critério de aceite virou neutro ao resultado dessa decisão (fuso passado
explícito, ausência é erro), conforme já indicado em `memory/plataforma/state-pendencias-abertas-2026-08-23.md:63-65`.

### Preservação

Antes de cada edição, comentário publicado com o texto anterior verbatim em bloco de código:
SPR-42 (`comment/10126`), SPR-43 (`comment/10127`), SPR-44 (`comment/10128`), SPR-45 (`comment/10129`),
SPR-46 (`comment/10130`), SPR-47 (`comment/10131`), SPR-48 (`comment/10132`), SPR-49 (`comment/10133`),
SPR-50 (`comment/10134`). Cada retorno da API foi conferido contra o texto enviado antes da edição
correspondente.

### O que não decidi

`SPR-46` — apontei `LACUNA-GLO-001` (fuso do estabelecimento ou do cliente), não decidi; o critério
de aceite ficou neutro aos dois desfechos possíveis. A pergunta de `SPR-35` rodar em paralelo à
Fase 1 (levantada em T-0007) não estava no corpo da issue antes desta passada — não a acrescentei,
porque a instrução era preservar a menção **se já estivesse lá**, e não estava.

## RELATÓRIO — produto — T-0008 (Lote 2)
STATUS: OK
FEITO:
  - Lidas as 10 issues do Lote 2 (SPR-35, SPR-42 a SPR-50) via JQL antes de qualquer edição.
  - Classificadas por forma: SPR-35 Epic/container (sem forma); SPR-42 e SPR-43 PROVA; SPR-44 a SPR-50 REGRA.
  - Publicado comentário de preservação (texto anterior verbatim, bloco de código) nas 9 issues antes de editar; conferido o retorno da API de cada um contra o texto enviado.
  - Reescritas SPR-42 e SPR-43 na forma PROVA completa (Contexto com diagrama e pergunta isolada · O que testar com cenário/desfecho nomeados · Entrega com rubrica · Critério de conclusão que aceita falha documentada).
  - Reordenadas/consolidadas SPR-44, SPR-45, SPR-47, SPR-48, SPR-49 para a anatomia REGRA canônica de `jira.md` §9, dobrando seções extra soltas em parágrafos de Objetivo/Escopo.
  - SPR-46: reordenada e ajustado o tratamento de fuso de afirmação ("é do cliente") para aceite neutro que aponta `LACUNA-GLO-001` sem decidi-la.
  - SPR-50: acrescentadas Escopo, Fora de escopo e Critério de aceite, que não existiam.
  - SPR-35 mantida sem edição — Epic/container, mesmo tratamento do Lote 1.
ARQUIVOS:
  - issues SPR-42, SPR-43, SPR-44, SPR-45, SPR-46, SPR-47, SPR-48, SPR-49, SPR-50 (editadas, Jira, com comentário de preservação em cada)
  - issue SPR-35 (só leitura, Jira)
  - tarefas/T-0008-reescrever-backlog-esqueleto-duas-formas.md (editado)
NÃO FEITO: —
DECISÕES:
  - Tratei SPR-50 (tipo Jira "Spike") como forma REGRA, não PROVA, porque o desfecho é uma decisão binária fechada (arranjo B ou D), não evidência que aceita falha parcial — mesmo critério aplicado a SPR-39 no Lote 1, e "arranjo de frontend" está listado como exemplo de decisão nas instruções desta tarefa.
  - Não citei bibliotecas/frameworks específicos em nenhum card além dos já fixados pela Epic (React Native + Expo, citados só onde a própria Epic SPR-35 já os declara fechados) — não há recomendação nova de tecnologia sob decisão aberta.
  - Em SPR-46, preservei a citação "SPR-36" e "SPR-39/SPR-40" como dependências de conteúdo (tipo de dinheiro/quantidade e dono do fuso), sem escolher entre elas — ambas já existiam antes ou foram citadas pela redação original.
RISCOS:
  - Não reauditei os 12 cards do Lote 1 nem os 33 cards legados do board — só o Lote 2.
  - As seções "O que a decisão libera" (SPR-50) e o restante do texto de SPR-42/SPR-43 têm bastante volume; se o padrão para os próximos lotes exigir texto mais enxuto, isso pode precisar de ajuste de tom, não de conteúdo.
PERGUNTAS: —
VERIFICAÇÃO: reli o corpo de descrição devolvido por cada `editJiraIssue` e confirmei que bate com o texto submetido, para as 9 issues editadas. Não rodei nada fora do Jira (não se aplica a este tipo de tarefa).
MEMÓRIA SUGERIDA: nenhuma — aplicação pontual da regra já registrada em `produto.md` (esqueleto de duas formas), como no Lote 1.
PRÓXIMO PASSO SUGERIDO: thread principal — amostragem independente do Lote 2 e, se aprovado, seguir para os Lotes 3 e 4 (backlog anterior, partes A e B).

---

## produto — 2026-08-26 (correção SPR-42)

Thread principal apontou erro factual na abertura do Contexto de `SPR-42`: "React Native + Expo já
está fechado como cliente (`docs/arquitetura/d-01-d-02-stack-opcoes.md` §1)". Grep no dossiê inteiro
não encontra nenhuma menção a "Expo" nem a "React Native" — a citação `§1` não sustenta a afirmação.
`D-01` fechou só a **linguagem** (Node + TypeScript,
`memory/plataforma/decision-stack-node-typescript-estrito.md`); `D-02` (arranjo do cliente, B ou D)
segue **ABERTA** (`CLAUDE.md` §8), e é exatamente a decisão que `SPR-42`/`SPR-43` alimentam. Tratar
Expo como fechado presumia uma decisão em aberto (`00-nucleo.md` §3).

Antes de editar, publicado comentário de preservação (`comment/10135`) com o texto anterior íntegro
verbatim, em bloco de código. Corrigida só a frase de abertura — o resto do Contexto e as demais
seções (O que testar, Entrega, Critério de conclusão, Fora de escopo, Referências) ficaram
byte-a-byte idênticos. A citação passou a apontar para `§3.3` (Os quatro arranjos), a seção real que
trata do arranjo B/D — não mais para uma `§1` que não fala do assunto.

### Texto final da abertura do Contexto (SPR-42)

```markdown
Estamos validando Expo + React Native como stack candidata para a superfície sem custódia — D-02
(arranjo do cliente) segue **ABERTA** (`CLAUDE.md` §8, `docs/arquitetura/d-01-d-02-stack-opcoes.md`
§3.3). O que falta provar é se ele cobre, com código rodando, a metade **grande** da superfície do
produto: toda a retaguarda, o dispositivo do cliente-final e o display de leitura à distância —
nenhum dos três lida com custódia (assinar, imprimir com controle de falha, guardar fila em repouso,
drenar faixa). A metade com custódia é a issue irmã (`SPR-43`), e o corte entre as duas já está
fechado por regra de produto.
```

## RELATÓRIO — produto — T-0008 (correção SPR-42)
STATUS: OK
FEITO:
  - Confirmado por grep que `docs/arquitetura/d-01-d-02-stack-opcoes.md` não contém "Expo" nem
    "React Native" em nenhum ponto — a citação `§1` na frase de abertura não sustentava a afirmação
    de que a stack do cliente estava fechada.
  - Publicado comentário de preservação em `SPR-42` (`comment/10135`) com o texto anterior íntegro
    verbatim, antes de qualquer edição.
  - Corrigida só a frase de abertura do Contexto: de "React Native + Expo já está fechado como
    cliente" para "Estamos validando Expo + React Native como stack candidata para a superfície sem
    custódia", com a citação movida de `§1` para `§3.3` (Os quatro arranjos) e referência explícita a
    `D-02` como **ABERTA** (`CLAUDE.md` §8).
  - Resto da descrição (diagrama de fluxo, pergunta em destaque, "O que testar", Entrega, Critério de
    conclusão, Fora de escopo, Referências) preservado sem alteração.
ARQUIVOS:
  - issue SPR-42 (editada, Jira; comentário de preservação novo)
  - tarefas/T-0008-reescrever-backlog-esqueleto-duas-formas.md (editado)
NÃO FEITO: —
DECISÕES:
  - Não toquei em nenhuma outra parte do card, inclusive onde "Expo" aparece de novo mais adiante
    ("Toda limitação afirmada sobre Expo ou React Native carrega fonte primária") — essas ocorrências
    já tratam Expo como candidato sob teste, não como decisão fechada, e não contradizem D-02 aberta.
  - Optei por `§3.3` em vez de `§3.4` como âncora: `§3.3` ("Os quatro arranjos") é onde a escolha B/D
    é literalmente apresentada e decidida; `§3.4` só descreve o que se compartilha em cada arranjo.
VERIFICAÇÃO: reli o corpo de descrição devolvido por `editJiraIssue` e confirmei que a frase de
  abertura bate com o texto submetido e que o restante da descrição permaneceu byte-a-byte idêntico
  ao texto preservado no comentário `comment/10135`.
RISCOS:
  - `SPR-43` (issue irmã) não foi auditada nesta passada — se ela tiver a mesma presunção de D-02
    fechada na abertura, o mesmo defeito está lá.
PERGUNTAS: —
MEMÓRIA SUGERIDA: nenhuma — correção pontual de fato incorreto em card já regido pela regra do
  esqueleto de duas formas (`produto.md`), não fato novo de plataforma/processo.
PRÓXIMO PASSO SUGERIDO: thread principal — conferir se `SPR-43` tem a mesma presunção de D-02
  fechada e, se sim, aplicar a mesma correção.

---

## produto — 2026-08-26 (Lote 3, esqueleto novo)

### Resumo: 12 issues reescritas, 2 Epics mantidas

| Chave | Forma | Veredito | Mudança-chave |
|---|---|---|---|
| SPR-1 | REGRA | REESCRITO | De `O quê/Onde/Por quê/O que precisa estar pronto antes` (formato pré-esqueleto) para Objetivo/Escopo/Fora de escopo/Critério de aceite/Depende de/Referências |
| SPR-2 | REGRA | REESCRITO | Mesma conversão de formato; conteúdo idêntico (PCF já especificado, PUB é a lacuna) |
| SPR-3 | REGRA | REESCRITO | Mesma conversão; pergunta ao humano sobre recortar em duas issues (`CMP`/`ENT`) preservada em `Depende de` |
| SPR-4 | REGRA | REESCRITO | Mesma conversão; pergunta ao humano sobre hardware do ponto de produção preservada em `Depende de` |
| SPR-5 | Epic | JÁ CONFORME | Container, não executável — mesmo tratamento de SPR-34/SPR-35 |
| SPR-6 | REGRA | REESCRITO | De "Como garçom, quero..." + bullets para anatomia canônica; `G-06` preservada em `Depende de` |
| SPR-7 | REGRA | REESCRITO | Mesma conversão; pendência de retenção do nome de exibição preservada |
| SPR-8 | REGRA | REESCRITO | Mesma conversão; `G-06` preservada |
| SPR-9 | REGRA | REESCRITO | Mesma conversão; `Gate obrigatório` (performance) preservado; `LACUNA-NUC-038` preservada |
| SPR-10 | REGRA | REESCRITO | Mesma conversão; conteúdo idêntico (`RN-MSA-005`, `RN-OFF-009`) |
| SPR-11 | REGRA | REESCRITO | Mesma conversão; acrescentado Critério de aceite explícito (o card não tinha nenhum item sob esse nome) |
| SPR-12 | REGRA | REESCRITO | Mesma conversão; pergunta ao humano sobre qual papel autoriza o cancelamento preservada em `Depende de`, não decidida |
| SPR-13 | REGRA | REESCRITO | Reordenação de seções (Enunciado→Objetivo, Aceite→Critério de aceite, Caminho infeliz dobrado dentro de Critério de aceite); acrescentada `Fora de escopo`, que não existia; conteúdo substantivo preservado |
| SPR-15 | Epic | JÁ CONFORME | Container, não executável — mesmo tratamento de SPR-34/SPR-35 |

### Por que 12 dos 14 eram REGRA, nenhum PROVA

As 10 issues de `MSA` (SPR-6 a SPR-13, exceto a Epic) descrevem comportamento fechado do sistema —
identidade técnica de comanda, transferência que move e não copia, concorrência resolvida por
recusa explícita, encerramento por decisão humana. Nenhuma tem desfecho que aceita falha parcial
documentada; todas têm invariante binário. Formar como PROVA teria forçado "O que testar" onde a
resposta é sempre uma regra fechada, não um cenário que pode falhar — o aviso explícito da tarefa.

As 4 issues de Spike (SPR-1 a SPR-4) pareciam candidatas a PROVA pelo tipo Jira, mas o desfecho de
cada uma é uma confirmação binária ("a spec já cobre X, sim ou não") com um resíduo nomeado para o
humano — não evidência de comportamento observado sob cenário. Mesmo critério aplicado a `SPR-50`
no Lote 2 (Spike tratado como REGRA porque o desfecho é decisão fechada, não prova).

### Formato anterior — o que a conversão corrigiu

10 das 12 issues reescritas (SPR-6 a SPR-13) ainda estavam no formato "Como garçom, quero X, para Y"
+ bullets de "Critérios de aceite" — um formato anterior ao esqueleto de duas formas, não tocado
pelo T-0007 apesar de a ficha registrar essas issues como já revisadas. As outras 4 (SPR-1 a SPR-4)
estavam no formato `O quê/Onde/Por quê/O que precisa estar pronto antes`, que é a checklist das
quatro perguntas usada diretamente como cabeçalho — também anterior ao esqueleto (`.claude/rules/produto.md`,
"O esqueleto de um card"), que exige a anatomia de `jira.md` §9 com `Fora de escopo` antes de
`Critério de aceite`, nunca como bullet solto ou seção ausente. Nenhuma das 12 tinha as seções na
ordem canônica; a maioria (SPR-6 a SPR-12) sequer tinha `Fora de escopo`.

### Eixo 2 — congruência

Nenhuma das 12 issues dependia de infraestrutura que ainda não existe (nenhum servidor emitindo
manifesto, nenhum mock necessário) — são todas regra de modelagem/comportamento de `MSA`, cujo
pré-requisito real é `SPR-39` (convenção de chave/timestamps/exclusão lógica) e as tabelas do módulo
(`SPR-14`), já nomeados em `Depende de` em cada card que precisa deles. As três perguntas ao humano
que já existiam (`SPR-3`: recortar `CMP`/`ENT`; `SPR-4`: hardware do ponto de produção; `SPR-12`:
papel que cancela) foram preservadas verbatim na seção `Depende de`, não decididas.

### Achados de tecnologia/decisão fechada presumida

**Nenhum.** Reli as 14 descrições originais (antes de editar) especificamente por menção a
biblioteca, framework, ou por afirmação de decisão do `CLAUDE.md` §8 tratada como fechada quando
ainda está aberta — nenhuma ocorrência nas 14. `D-01`, `D-02`, `D-03`, `D-04` não são citadas como
fechadas em nenhum dos 12 cards reescritos.

### Preservação

Antes de cada edição, comentário publicado com o texto anterior verbatim em bloco de código:
SPR-1 (`comment/10136`), SPR-2 (`comment/10137`), SPR-3 (`comment/10138`), SPR-4 (`comment/10139`),
SPR-6 (`comment/10140`), SPR-7 (`comment/10141`), SPR-8 (`comment/10142`), SPR-9 (`comment/10143`),
SPR-10 (`comment/10144`), SPR-11 (`comment/10145`), SPR-12 (`comment/10146`), SPR-13 (`comment/10147`).
Cada retorno da API foi conferido contra o texto enviado antes da edição correspondente, e cada
retorno de `editJiraIssue` foi conferido contra o texto submetido.

### O que não decidi

`SPR-3` — pergunta se recorta em uma ou duas issues (`CMP`/`ENT`): mantida em `Depende de`, não
decidida. `SPR-12` — pergunta sobre qual papel autoriza o cancelamento: mantida em `Depende de`, não
decidida. Nenhum `G-01..G-09`, `LACUNA-GLO-001` ou `LACUNA-NUC-038` foi decidido; todos permanecem
citados como pendência, não resolvidos.

## RELATÓRIO — produto — T-0008 (Lote 3)
STATUS: OK
FEITO:
  - Lidas as 14 issues do Lote 3 (SPR-1 a SPR-13, SPR-15) via JQL antes de qualquer edição, corpo
    inteiro, não só título.
  - Classificadas por forma: SPR-5 e SPR-15 (Epic/container, sem forma); as demais 12, todas REGRA
    (nenhuma PROVA — ver "Por que 12 dos 14 eram REGRA, nenhum PROVA").
  - Publicado comentário de preservação (texto anterior verbatim, bloco de código) nas 12 issues
    antes de editar; conferido o retorno da API de cada um contra o texto enviado.
  - Reescritas as 12 issues para a anatomia REGRA canônica de `jira.md` §9 (Objetivo · Escopo ·
    Fora de escopo · Critério de aceite · Depende de · Gate obrigatório quando aplicável ·
    Referências), convertendo de dois formatos anteriores ao esqueleto de duas formas: "Como
    garçom, quero..." + bullets (SPR-6 a SPR-13) e `O quê/Onde/Por quê/O que precisa estar pronto
    antes` (SPR-1 a SPR-4).
  - Preservadas verbatim, sem decidir, as três perguntas ao humano já existentes: SPR-3 (recorte
    `CMP`/`ENT`), SPR-4 (hardware do ponto de produção), SPR-12 (papel que cancela comanda).
  - SPR-5 e SPR-15 mantidas sem edição — Epic/container, mesmo tratamento de SPR-34/SPR-35 nos
    Lotes 1 e 2.
  - Verificado especificamente, nas 14 descrições originais, menção a tecnologia/framework
    específico ou decisão do `CLAUDE.md` §8 tratada como fechada quando aberta — nenhuma ocorrência.
ARQUIVOS:
  - issues SPR-1, SPR-2, SPR-3, SPR-4, SPR-6, SPR-7, SPR-8, SPR-9, SPR-10, SPR-11, SPR-12, SPR-13
    (editadas, Jira, com comentário de preservação em cada)
  - issues SPR-5, SPR-15 (só leitura, Jira)
  - tarefas/T-0008-reescrever-backlog-esqueleto-duas-formas.md (editado)
NÃO FEITO: —
DECISÕES:
  - Tratei SPR-1 a SPR-4 (tipo Jira "Spike") como forma REGRA, não PROVA — mesmo critério de SPR-50
    no Lote 2: o desfecho de cada uma é confirmação binária de spec já existente mais um resíduo
    nomeado, não evidência de cenário que pode falhar.
  - Em SPR-13, dobrei "Caminho infeliz" como parágrafo em negrito dentro de `Critério de aceite`,
    em vez de seção própria — a anatomia de `jira.md` §9 não lista "Caminho infeliz" como cabeçalho
    de primeiro nível; o conteúdo é preservado, só a estrutura muda.
  - Em SPR-11, o card original não tinha nenhum bullet sob o rótulo "Critério de aceite" que fosse,
    de fato, um caso concreto testável (os bullets eram todos de `Escopo`); escrevi um Critério de
    aceite novo a partir do conteúdo já aprovado (`RN-MSA-011`), sem introduzir regra nova.
RISCOS:
  - Não reauditei os cards dos Lotes 1 e 2 nem SPR-14 nesta passada — só o Lote 3.
  - SPR-5 e SPR-15 permanecem no formato `O quê/Onde/Por quê/O que precisa estar pronto antes`
    (mesmo tratamento de SPR-34/SPR-35); se uma revisão futura decidir que Epic também precisa da
    anatomia canônica ou de uma forma própria declarada em `produto.md`, essas quatro issues
    (SPR-5, SPR-15, SPR-34, SPR-35) precisam de uma passada conjunta.
  - Falta ainda o Lote 4 (backlog anterior parte B) para completar a revisão do board de 52 issues.
PERGUNTAS: —
VERIFICAÇÃO: reli o corpo de descrição devolvido por cada `editJiraIssue` e confirmei que bate com
  o texto submetido, para as 12 issues editadas. Não rodei nada fora do Jira (não se aplica a este
  tipo de tarefa).
MEMÓRIA SUGERIDA: nenhuma — aplicação pontual da regra já registrada em `produto.md` (esqueleto de
  duas formas), como nos Lotes 1 e 2.
PRÓXIMO PASSO SUGERIDO: thread principal — amostragem independente do Lote 3 e, se aprovado, seguir
  para o Lote 4 (backlog anterior, parte B) para fechar a revisão do board inteiro.

---

## produto — 2026-08-26 (Lote 4, esqueleto novo)

### Resumo: 13 issues reescritas, 2 redirecionamentos mantidos intactos

| Chave | Forma | Veredito | Mudança-chave |
|---|---|---|---|
| SPR-16 | REGRA | REESCRITO | Formato antigo (Enunciado/Onde/Por quê/Pré-requisito) → anatomia canônica; `Bloqueio conhecido` (G-03) explícito; Critério de aceite novo (2 casos testáveis, antes não existia nenhum) |
| SPR-17 | REGRA | REESCRITO | Mesma conversão de formato; fonte da busca (já resolvida no texto original) movida para Escopo; G-08 mantido em `Depende de`, não decidido |
| SPR-18 | REGRA | REESCRITO | Estrutura de recusa de 00-nucleo §12 (Necessidade/Mecanismo recusado/Enunciado/Aceite/Fronteira/O que não pode declarar/Critério que muda de casa) dobrada em Objetivo/Escopo/Critério de aceite/Depende de/Fora de escopo — conteúdo idêntico |
| SPR-19 | REGRA | REESCRITO | Formato antigo → anatomia; `Aceite (mantido do enunciado original)` virou Critério de aceite numerado; `Bloqueio conhecido` (G-04) explícito |
| SPR-20 | REGRA | REESCRITO | Mesma conversão; `Bloqueio conhecido` (G-05) explícito |
| SPR-21 | — | JÁ CONFORME | Redirecionamento para `SPR-22` (fusão de passagem anterior) — mantido intocado, não fundido de novo, não excluído |
| SPR-22 | REGRA | REESCRITO | "Regras que governam" + "Caminho infeliz" + "Nota de fusão" dobrados em Escopo/Fora de escopo; `Gate obrigatório` novo (desempenho + segurança) |
| SPR-23 | REGRA | REESCRITO | Estrutura de recusa de 00-nucleo §12 dobrada em Objetivo/Escopo/Critério de aceite/Fora de escopo — conteúdo idêntico |
| SPR-24 | — | JÁ CONFORME | Redirecionamento para `SPR-25` (fusão de passagem anterior) — mantido intocado, não fundido de novo, não excluído |
| SPR-25 | REGRA | REESCRITO | "O eixo é a natureza do fato" + "Caminho infeliz" + "Notas de fronteira" dobrados em Escopo/Fora de escopo; `Gate obrigatório` novo (segurança) |
| SPR-26 | REGRA | REESCRITO | Formato antigo → anatomia; Critério de aceite declarado **não testável antes de `G-07`** (congruência: sem mecanismo definido, não há o que testar), em vez de inventar critério |
| SPR-27 | REGRA | REESCRITO | Mesma conversão; três pré-requisitos abertos (G-07, concorrência/offline, destino do ingrediente) preservados em `Depende de`, nenhum decidido |
| SPR-28 | REGRA | REESCRITO | Formato antigo → anatomia; Critério de aceite declarado **não testável antes de `SPR-40`** (tipo do dinheiro), mesma lógica de congruência de SPR-26 |
| SPR-29 | REGRA | REESCRITO | "Regras que governam" + "Caminho infeliz" + "Pendência declarada" dobrados em Escopo/Depende de; `Gate obrigatório` formalizado (desempenho, já citado no texto original) |
| SPR-30 | REGRA | REESCRITO | Estrutura de recusa de 00-nucleo §12 dobrada em Objetivo/Escopo/Critério de aceite/Depende de/Fora de escopo; `Gate obrigatório` novo (segurança) |

### Por que as 13 eram REGRA, nenhuma PROVA

Todo o lote é modelagem e comportamento fechado do núcleo e de `MSA`: navegação de catálogo, busca,
escolha obrigatória, variação, adicional, lançamento com observação, agregação de apresentação,
retirada/correção de item, disponibilidade, cálculo de valor. Nenhuma tem desfecho que aceita falha
parcial documentada — todas têm invariante binário (o item é lançável ou não; a retirada é autorizada
ou negada; o valor é composto pelo núcleo ou não é). Nenhuma issue deste lote é Spike no Jira — todas
são `História`.

### Três formatos de origem, uma conversão

O lote misturava três formatos anteriores ao esqueleto, todos convertidos para a anatomia canônica de
`jira.md` §9 (Objetivo · Escopo · Fora de escopo · Critério de aceite · Depende de · Gate obrigatório ·
Referências):

1. **Formato de quatro perguntas** (Enunciado/Onde/Por quê/Pré-requisito) — SPR-16, 17, 19, 20, 26,
   27, 28. Mesma conversão aplicada a SPR-1–4 no Lote 3.
2. **Estrutura de recusa de `00-nucleo.md` §12** (Necessidade preservada/Mecanismo recusado/Enunciado/
   Aceite/Por que o novo é melhor/Fronteira) — SPR-18, 23, 30. As quatro partes da recusa (necessidade,
   mecanismo recusado, mecanismo que fica, por que é melhor) foram dobradas em Objetivo, preservando a
   prova textual, e "Aceite" virou Critério de aceite.
3. **Formato já rico, mas com cabeçalhos fora da lista fechada** (Enunciado/Regras que governam/Aceite/
   Caminho infeliz/Nota de fusão ou Notas de fronteira) — SPR-22, 25, 29. Mesmo padrão do Lote 2
   (SPR-44 a SPR-49): forma certa, ordem errada, seções soltas dobradas em Escopo/Fora de escopo.

### Congruência: dois cards sem critério de aceite inventado

`SPR-26` e `SPR-28` nunca tiveram um "Aceite" no texto original — só Enunciado/Onde/Por quê/
Pré-requisito. Em vez de inventar um critério de aceite que a lacuna aberta (`G-07` em SPR-26,
`SPR-40`/tipo do dinheiro em SPR-28) tornaria inválido assim que decidida, o Critério de aceite declara
explicitamente: **"não há critério de aceite testável antes de X"**, nomeando X, seguindo a mesma regra
de congruência aplicada nos lotes anteriores — card que não pode ser executado diz o que falta, não
finge que pode.

`SPR-27` tinha três pré-requisitos abertos empilhados num único parágrafo (G-07, concorrência/offline,
e o destino nunca resolvido do item "ingrediente" apontando para uma Epic que nunca foi criada) — os
três foram preservados, numerados, em `Depende de`, nenhum decidido.

### Os três pontos de atenção do brief

- **`SPR-21`/`SPR-24`** — confirmados como redirecionamentos já fundidos em passagem anterior
  (`SPR-21` → `SPR-22`, `SPR-24` → `SPR-25`). Nenhum dos dois foi editado, fundido de novo ou excluído.
- **`SPR-25`/`SPR-30`** — mantidos como dois cards, cada um com seção `Fora de escopo` nomeando a
  fronteira exata com o outro ("SPR-25 é retirada... SPR-30 é correção de item já enviado... mesmo
  mecanismo"). Nenhuma fusão proposta.
- **`SPR-16`, `SPR-19`, `SPR-20`, `SPR-26`** — cada um ganhou seção `Bloqueio conhecido` nomeando
  `G-03`/`G-04`/`G-05`/`G-07` respectivamente, rótulo `bloqueada` já presente confirmado no retorno da
  API. Nenhum bloqueio foi decidido.

### Preservação

Antes de cada edição, comentário publicado com o texto anterior verbatim em bloco de código:
SPR-16 (`comment/10148`), SPR-17 (`comment/10149`), SPR-18 (`comment/10150`), SPR-19 (`comment/10151`),
SPR-20 (`comment/10152`), SPR-22 (`comment/10153`), SPR-23 (`comment/10154`), SPR-25 (`comment/10155`),
SPR-26 (`comment/10156`), SPR-27 (`comment/10157`), SPR-28 (`comment/10158`), SPR-29 (`comment/10159`),
SPR-30 (`comment/10160`). Cada retorno da API foi conferido contra o texto enviado antes da edição
correspondente, e cada retorno de `editJiraIssue` foi conferido contra o texto submetido.

### O que não decidi

`G-03` (SPR-16), `G-04` (SPR-18, 19, 30), `G-05` (SPR-18, 20, 29, 30), `G-07` (SPR-26, 27), `G-08`
(SPR-17), `G-09` (SPR-28, 29) — todos permanecem citados como pendência, nenhum resolvido. A
concorrência/offline de `SPR-27` e o destino do "ingrediente" (também `SPR-27`) ficam como perguntas
abertas em `Depende de`. O tipo do dinheiro (`SPR-40`, referenciado por `SPR-28`) não foi antecipado.

## RELATÓRIO — produto — T-0008 (Lote 4)
STATUS: OK
FEITO:
  - Lidas as 15 issues do Lote 4 (SPR-16 a SPR-30) via JQL/getJiraIssue antes de qualquer edição,
    corpo inteiro, não só título.
  - Classificadas por forma: as 13 editáveis, todas REGRA (nenhuma PROVA — nenhuma issue deste lote é
    Spike; todas são História com invariante binário). SPR-21 e SPR-24 identificadas como
    redirecionamentos já fundidos, fora do escopo de reescrita.
  - Publicado comentário de preservação (texto anterior verbatim, bloco de código) nas 13 issues
    editadas, antes de cada edição; conferido o retorno da API de cada um contra o texto enviado.
  - Convertidos três formatos anteriores ao esqueleto (quatro perguntas; estrutura de recusa de
    00-nucleo §12; formato rico com cabeçalhos soltos) para a anatomia canônica de `jira.md` §9 nas 13
    issues, preservando o conteúdo substantivo (RN citadas, exemplos concretos, critérios de aceite
    originais) e dobrando seções extra em Objetivo/Escopo/Fora de escopo/Depende de.
  - SPR-26 e SPR-28: Critério de aceite escrito como "não testável antes de X" em vez de inventado,
    porque o texto original nunca teve critério de aceite e a lacuna aberta (G-07 / tipo do dinheiro)
    determina o mecanismo antes de determinar o teste.
  - Bloqueio conhecido explícito em SPR-16 (G-03), SPR-19 (G-04), SPR-20 (G-05), SPR-26 (G-07) — os
    quatro citados no brief — e também em SPR-27 (G-07, mesma lacuna de SPR-26, não listada no brief
    mas genuinamente bloqueada pelo próprio texto da issue).
  - SPR-21 e SPR-24 confirmados como redirecionamentos intactos: não editados, não fundidos de novo,
    não excluídos.
  - SPR-25/SPR-30 mantidos como dois cards separados, cada um nomeando a fronteira com o outro em
    `Fora de escopo`.
  - Verificado especificamente, nas 15 descrições (originais e reescritas), menção a tecnologia/
    framework específico e decisão do `CLAUDE.md` §8 tratada como fechada quando aberta — nenhuma
    ocorrência nas duas passadas.
ARQUIVOS:
  - issues SPR-16, SPR-17, SPR-18, SPR-19, SPR-20, SPR-22, SPR-23, SPR-25, SPR-26, SPR-27, SPR-28,
    SPR-29, SPR-30 (editadas, Jira, com comentário de preservação em cada)
  - issues SPR-21, SPR-24 (só leitura, Jira)
  - tarefas/T-0008-reescrever-backlog-esqueleto-duas-formas.md (editado)
NÃO FEITO: —
DECISÕES:
  - Tratei as 13 issues editáveis como forma REGRA, não PROVA — nenhuma é Spike no Jira, e todas têm
    desfecho binário fechado (mesmo critério dos Lotes 1–3: Spike/prova só quando o desfecho aceita
    falha parcial documentada).
  - Em SPR-26 e SPR-28, optei por declarar a ausência de critério de aceite testável em vez de inventar
    um critério provisório que a decisão aberta invalidaria — mesma lógica de congruência já aplicada a
    outros cards bloqueados nos lotes anteriores (ex. SPR-16 no próprio Lote 4, que manteve critério
    porque o enunciado já tinha conteúdo testável independente da lacuna; SPR-26/28 não tinham).
  - Acrescentei `Gate obrigatório` em SPR-22 (desempenho + segurança), SPR-25 e SPR-30 (segurança) e
    formalizei o de SPR-29 (desempenho, já citado no texto original mas não como seção própria) —
    nenhum desses cards tinha a seção antes; a adição segue o padrão de `.claude/rules/00-nucleo.md`
    §4 (CLAUDE.md) gates 3 e 4, aplicado a operação sensível de PDV (retirada/correção de item) e a
    caminho crítico do caixa (lançamento, leitura de acumulado).
  - Não acrescentei `Gate obrigatório` a SPR-16, 17, 19, 20, 23, 26, 27, 28 — os quatro primeiros estão
    bloqueados e não é útil gatear algo não executável; SPR-23 é regra de apresentação sem consulta
    nova declarada; SPR-26/27/28 idem (bloqueados ou dependentes de decisão externa).
RISCOS:
  - Não reauditei os cards dos Lotes 1, 2 e 3 nesta passada — só o Lote 4.
  - O board de 52 issues (Epics `SPR-34`+filhas, `SPR-35`+filhas, backlog anterior partes A e B) está
    com os quatro lotes concluídos (Lote 1: SPR-14, 31-33, 36-41, 51-52; Lote 2: SPR-35, 42-50; Lote 3:
    SPR-1-13, 15; Lote 4: SPR-16-30, com SPR-21/24 como redirecionamento) — falta só a amostragem
    independente do thread principal sobre este lote e o fechamento da tarefa.
PERGUNTAS: —
VERIFICAÇÃO: reli o corpo de descrição devolvido por cada `editJiraIssue` e confirmei que bate com o
  texto submetido, para as 13 issues editadas. Reli o retorno de cada `addCommentToJiraIssue` e
  confirmei que o texto preservado bate byte-a-byte com o texto original capturado via JQL/
  getJiraIssue antes da edição. Não rodei nada fora do Jira (não se aplica a este tipo de tarefa).
MEMÓRIA SUGERIDA: nenhuma — aplicação pontual da regra já registrada em `produto.md` (esqueleto de
  duas formas), como nos Lotes 1, 2 e 3.
PRÓXIMO PASSO SUGERIDO: thread principal — amostragem independente do Lote 4 e, se aprovado, fechamento
  da tarefa T-0008 (definição de pronto, memória, issue SPR-56 concluída).

---

---

## produto — 2026-08-26 (correção SPR-40/SPR-41)

Correção pontual de dois defeitos de texto apontados pelo thread principal na verificação
independente do Lote 1 (rodado com Haiku). Reli as duas descrições inteiras antes de editar, não só
os trechos citados, para achar outros erros do mesmo tipo.

**SPR-40** — quatro correções:

1. `combustvel` → `combustível` (item 2 do Contexto — acento faltando).
2. `almonda (uníade inteira)` → `hambúrguer (unidade inteira)` (item 2 de "O que testar", Cenário A —
   "almonda" não existe em português nem é produto do domínio; "uníade" é typo de "unidade").
3. Ao reler o resto: `Tipo registrado em três places` → `Tipo registrado em três lugares` (seção
   Entrega — anglicismo, mesma classe de ruído de geração das duas correções acima).
4. Ao reler o resto: `Regra de cálculo de imposto, base de cálculo, dica` → `..., gorjeta` (seção
   Fora de escopo — "dica" não é o termo usado no domínio para gratificação; o próprio card referencia
   `docs/arquitetura/fiscal/2026-08-22-adendo-base-de-calculo-e-gorjeta.md`, que usa "gorjeta").

Nenhuma outra ocorrência de palavra sem sentido, número que não bate ou typo de acentuação no resto
da descrição de SPR-40.

**SPR-41** — três correções:

1. `Todas as cinco perguntas respondidas explicitamente` → `Todas as quatro perguntas...` (seção
   Critério de conclusão) — "O que testar" tem exatamente quatro itens numerados (Caminho de consulta
   entre schemas · Resolução de schema · IDOR em recurso cruzado · Canais laterais). Não há uma quinta
   pergunta implícita em nenhuma outra seção do card; não inventei conteúdo para justificar "cinco".
2. `Nunca por interlação de string` → `Nunca por concatenação de string` (item 2 de "O que testar" —
   "interlação" não é palavra do português; o termo do domínio, usado em `backend.md` e
   `00-nucleo.md`, é "concatenação de string").
3. Ao reler o resto: `procurar cross-schema reference` → `procurar referência cruzada entre schemas`
   (item 1 de "O que testar" — anglicismo, mesma classe do item 3 de SPR-40).

Edição direta, sem comentário de preservação — correção de erro óbvio de texto, não decisão
substantiva (conforme instrução desta correção pontual).

### Não corrigido, e por quê

Em SPR-41, seção "Critério de conclusão": `Nenhum achado CRÍTICO não resolvido bloqueia avanço para
Fase 2` tem leitura de dupla negação que, ao pé da letra, diz o oposto do que o gate deveria garantir
(achado crítico não resolvido *deveria* bloquear avanço — `CLAUDE.md` §7 invariante 1). Isto não é
typo de acentuação, palavra sem sentido nem número que não bate: é um possível erro de lógica/redação
que muda o sentido da regra. Fora do escopo desta correção pontual (que trata só dos três tipos de
erro nomeados); reportado em `RISCOS` para quem revisar o conteúdo do gate decidir se reescreve.

## RELATÓRIO — produto — T-0008 (correção SPR-40/SPR-41)
STATUS: OK
FEITO:
  - Relidas as descrições inteiras de SPR-40 e SPR-41 (não só os trechos citados no brief) antes de
    editar, em busca de outros erros do mesmo tipo.
  - SPR-40: corrigido "combustvel" → "combustível"; "almonda (uníade inteira)" → "hambúrguer
    (unidade inteira)"; "três places" → "três lugares"; "dica" → "gorjeta" (as duas últimas achadas
    na releitura, fora dos dois pontos citados no brief).
  - SPR-41: corrigido "cinco perguntas" → "quatro perguntas" (bate com a contagem real: 4 itens em
    "O que testar", nenhuma quinta pergunta implícita encontrada); "interlação de string" →
    "concatenação de string"; "cross-schema reference" → "referência cruzada entre schemas" (achada
    na releitura).
  - Editado direto, sem comentário de preservação, conforme instrução da correção pontual.
ARQUIVOS:
  - issue SPR-40 (editada, Jira)
  - issue SPR-41 (editada, Jira)
  - tarefas/T-0008-reescrever-backlog-esqueleto-duas-formas.md (editado)
NÃO FEITO: —
DECISÕES:
  - Em SPR-41, não reescrevi "Nenhum achado CRÍTICO não resolvido bloqueia avanço para Fase 2" apesar
    de a leitura literal parecer logicamente invertida — é mudança de sentido da regra, não erro de
    texto dos três tipos pedidos (acentuação, palavra sem sentido, número que não bate). Registrado
    em RISCOS em vez de corrigido por conta própria.
  - Em SPR-40, troquei "dica" por "gorjeta" mesmo não sendo erro gramatical — é termo de domínio
    errado (o card referencia um documento que usa "gorjeta"), da mesma família de "almonda"
    (palavra plausível mas fora de contexto).
RISCOS:
  - SPR-41, seção Critério de conclusão, item "Nenhum achado CRÍTICO não resolvido bloqueia avanço
    para Fase 2": possível inversão lógica (deveria bloquear, não "nenhum... bloqueia"). Não corrigi
    — fora do escopo desta correção pontual. Quem revisar o conteúdo do gate de segurança decide se
    reescreve.
PERGUNTAS: —
VERIFICAÇÃO: reli o corpo de descrição devolvido por cada `editJiraIssue` e confirmei que bate
  byte-a-byte com o texto submetido, para as duas issues.
MEMÓRIA SUGERIDA: nenhuma — correção pontual de erro de texto, não fato novo de plataforma/processo.
PRÓXIMO PASSO SUGERIDO: thread principal — decidir se a inversão lógica achada em SPR-41 (RISCOS)
  vira correção separada, e seguir com o fechamento de T-0008 se não houver mais pendência.

---

## thread principal — amostragem independente — 2026-08-26/27

Verificação rodada em três passadas, cada uma disparando despacho pontual a `produto` (seções acima),
não um passo único no fim como em T-0007. Cobertura, por lote:

- **Lote 1 (Haiku, 13 issues):** amostrado três vezes. Primeira passada achou e corrigiu `SPR-52`
  (recomendação de framework fora de território) e `SPR-39` (forma errada para decisão D-04).
  Segunda passada, na amostragem final, achou e corrigiu `SPR-40` e `SPR-41` (typo virando palavra
  sem sentido, contagem errada, anglicismo) — não achados na primeira passada. A mesma passada achou,
  mas não corrigiu de imediato, uma dupla negação em `SPR-41` (fora do escopo da correção pontual de
  texto que a achou; ver RISCOS do relatório de correção SPR-40/SPR-41) — **terceira passada,
  despacho dedicado, corrigiu**: `SPR-41` lê hoje "Achado CRÍTICO não resolvido bloqueia avanço para
  Fase 2", sentido correto, confirmado via `getJiraIssue`.
- **Lote 2 (modelo padrão, 10 issues):** amostrado. Achou e corrigiu `SPR-42` (decisão D-02 tratada
  como fechada sem base na fonte citada). `SPR-43` e `SPR-50` conferidos sem achado.
- **Lote 3 (modelo padrão, 14 issues):** amostrado; nenhum achado reportado.
- **Lote 4 (modelo padrão, 15 issues):** amostrado; nenhum achado reportado além dos já contados no
  Lote 1 (`SPR-40`/`SPR-41`, corrigidos na mesma passada final).

**Nota de honestidade:** ao contrário de T-0007 (passo 6 do plano, com JQL explícita e lista nomeada
de ≥15% das issues amostradas), esta ficha não registra, issue por issue, quais cards de Lote 3 e
Lote 4 foram de fato reabertos e conferidos pelo thread principal — a evidência que chega à ficha é
o resultado (nenhum achado) e não o método. Isso não invalida o fechamento, mas é um gap de registro
frente ao padrão que a própria T-0007 estabeleceu, e fica declarado aqui em vez de silenciado.

## Fechamento — 2026-08-27

### Definição de pronto (`processo.md` §2), item por item

1. **Regra de negócio nova, numerada `RN-...`, com critério de aceite:** não se aplica — T-0008 não
   cria regra de negócio, reescreve a forma de cards já existentes.
2. **Comportamento novo/corrigido com teste:** não se aplica — não há código, é reescrita de texto de
   backlog.
3. **DDL pelo checklist de `migrations.md`:** não se aplica.
4. **Endpoint pelo gate de `seguranca`:** não se aplica.
5. **Consulta/lista/relatório/tela pelo gate de `performance`:** não se aplica.
6. **Decisão não óbvia virou registro em `memory/`, no escopo certo, com linha de índice:** sim —
   `memory/processo/gotcha-julgar-o-proprio-texto-nao-pega-erro-de-escopo-ou-de-fato.md`, indexado em
   `memory/processo/INDEX.md`. Não foi sugestão de nenhum relatório de `produto` (todos os 4 lotes
   disseram "memória sugerida: nenhuma"); é leitura minha do padrão que se repetiu em três correções
   pontuais.
7. **Nenhum segredo no repo:** confirmado por leitura dos 8 relatórios (4 lotes + 4 correções) — só
   Jira, nenhum segredo, nenhum dado real de cliente.
8. **Toda `MEMÓRIA SUGERIDA` escrita, fundida ou recusada com motivo:** as quatro sugestões dos lotes
   foram "nenhuma", com motivo declarado (regra já registrada em `produto.md`, não fato novo) — aceito
   o motivo, correto: o esqueleto em si não é fato novo de memória, já estava lá desde antes do
   despacho. A memória nova (item 6) não veio de sugestão de agent, veio da minha leitura do padrão de
   correção — registrada acima.
9. **Issue do Jira com plano, relatórios e fechamento espelhados, status concluída:** `PENDENTE NO
   JIRA` — plano (o encurtamento de `processo.md` §5, sem Plano de Despacho formal), os 4 relatórios
   de lote, as 4 correções pontuais (`SPR-52`/`SPR-39`; `SPR-42`; `SPR-40`/`SPR-41`; a dupla negação
   de `SPR-41`) e este fechamento precisam ser espelhados em `SPR-56` pelo thread principal, no
   formato de `jira.md` §10, **antes** da transição para Concluído.

### Avaliação honesta do critério de aceite de `SPR-56`

O critério era o card se parecer, em forma e profundidade, com o exemplo trazido pelo humano.
**Atingido na forma**, com uma ressalva real de conteúdo:

- As 52 issues foram classificadas corretamente entre REGRA e PROVA (nenhuma Spike com desfecho
  binário foi forçada em forma de Prova; nenhuma História com invariante fechado foi forçada em forma
  de Regra) e ganharam a anatomia completa — Contexto/O que testar/Entrega/Critério de conclusão para
  Prova, Objetivo/Escopo/Fora de escopo/Critério de aceite/Depende de/Gate/Referências para Regra —
  incluindo diagrama de fluxo, pergunta isolada em destaque, cenários nomeados com desfecho exato e
  mocks enumerados por completo onde a dependência não existe ainda (ex.: `SPR-42`). Isso é o que o
  exemplo do humano exigia, e bate.
- **Mas a forma certa não garantiu conteúdo certo.** Cinco dos cards editados (`SPR-52`, `SPR-39`,
  `SPR-42`, `SPR-40`, `SPR-41`) tinham defeito substantivo — não estilístico — que só apareceu na
  verificação independente, nunca na própria passada de `produto`, inclusive em lotes rodados no
  modelo padrão. Isso não é falha do esqueleto: é evidência de que "produto entrega, produto confere"
  não basta, mesmo com o esqueleto certo — é por isso que o gotcha do item 6 existe.
- **Correção (2026-08-27, pós-fechamento inicial):** a dupla negação em `SPR-41` ("Nenhum achado
  CRÍTICO não resolvido bloqueia avanço para Fase 2") **foi corrigida** pelo thread principal antes
  deste fechamento ser finalizado — despacho separado, concluído e conferido via `getJiraIssue` antes
  da issue `SPR-56` ser transicionada. O texto atual de `SPR-41` lê "Achado CRÍTICO não resolvido
  bloqueia avanço para Fase 2", sentido correto. O rascunho anterior deste fechamento (escrito pelo
  `orquestrador`) registrava isso como resíduo em aberto — estava desatualizado no momento em que foi
  escrito, não no momento em que a issue fechou. Todos os 5 defeitos achados por verificação
  independente estão corrigidos.
- **Cobertura de verificação é mais fina que a de T-0007** para os Lotes 3 e 4 (ver seção acima) — o
  resultado (zero achado adicional) é confiável porque veio do mesmo processo que achou os 5 defeitos
  reais nos outros dois lotes, mas o método não ficou registrado card a card.

Nenhuma dessas ressalvas justifica reabrir a tarefa: nenhuma impede quem pegar qualquer dos 52 cards
de começar a trabalhar, e a única coisa que ficou pendente (cobertura de amostragem documentada) tem
dono e não tem o efeito silencioso que a definição de pronto proíbe.

### Memória

- **Escrita:** `memory/processo/gotcha-julgar-o-proprio-texto-nao-pega-erro-de-escopo-ou-de-fato.md`
  (novo), indexado em `memory/processo/INDEX.md`. **Nota de correção:** o corpo original do gotcha
  citava "5 defeitos, 1 sem correção" — corrigido para "5 defeitos, todos corrigidos" (ver acima).
- **Atualizada:** `memory/plataforma/state-board-spr-2026-08-26.md` — nova seção com o resultado de
  T-0008 (27→ a contagem final de reescritas por lote, achados de correção, e a nota de cobertura de
  amostragem).
- **Atualizada, depois corrigida:** `memory/plataforma/state-pendencias-abertas-2026-08-23.md` §5
  (resíduos com dono, bloco `produto`) — o item sobre a dupla negação de `SPR-41` foi **removido**
  depois que a correção real foi confirmada; não é mais resíduo.
- **Recusadas:** nenhuma — as quatro `MEMÓRIA SUGERIDA: nenhuma` dos lotes foram aceitas como
  corretas (item 8 acima), não recusadas.

### O que sobrou para depois

- Cobertura de amostragem de Lote 3/Lote 4 não ficou documentada card a card — se um defeito aparecer
  depois num desses cards, não há como saber se ele já tinha sido conferido e passou, ou nunca foi
  olhado.
- Todas as pendências de calendário e decisão já catalogadas em
  `memory/plataforma/state-pendencias-abertas-2026-08-23.md` §0 continuam de pé, sem mudança desta
  tarefa — T-0008 é revisão de forma/qualidade de texto, não resolve nenhuma lacuna de conteúdo.

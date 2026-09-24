# D-03: as três opções medidas contra o código e o banco que existem, e a recomendação (2026-09-23)

> **O que este arquivo é.** O passo B.2 de `T-0015` (item `F-017`), autor `backend`. Mede as opções A, B
> e C do dossiê `docs/arquitetura/d-03-identidade-opcoes.md` (2026-08-23) contra `apps/api/src/**` e
> `db/**` como estão em disco hoje, contra as sete necessidades e os vinte invariantes do B.1
> (`docs/produto/identidade-necessidade-e-fronteira-2026-09-23.md` §1.4 e §6), e recomenda. O dossiê não
> foi editado; as citações dele que mudaram de arquivo seguem o mapa do B.1 §8.
>
> **O que ele não é.** Não é decisão: o thread decide depois do gate de `seguranca` (B.3). Não escolhe
> mecanismo de prova, biblioteca de hash nem formato de token. Não escreve migration, tabela nem código:
> onde uma opção pede estrutura nova, o texto diz o que ela precisa garantir e quem a desenha.
>
> **Nada foi medido aqui.** Não rodei banco nem teste. Toda afirmação sobre comportamento do Postgres é
> citação de medida anterior, com o arquivo. Ordem de grandeza vem rotulada `ESTIMATIVA`, com a conta.
> As linhas citadas de `apps/api/**` e `db/**` valem para 2026-09-23; os dois territórios estão sendo
> editados em paralelo (`T-0013`, `T-0009`).

## A resposta direta

1. **Recomendo C**, verdade no cliente e encaminhamento sem dado pessoal no `platform`, pelo mesmo
   critério do dossiê e agora com uma prova que ele não tinha: em C o verificador da pessoa do cliente
   mora em `t_<slug>` e é lido **sob o papel `app_t_<slug>`** (`apps/api/src/db/tenant-role.ts:62-73`).
   O isolamento da identidade passa a ser o mesmo privilégio de banco que já isola a venda. Em B ele é
   uma cláusula `WHERE` sobre a população inteira (§3, §4).
2. **Ordenadas por reversão, C é a mais barata para os dois lados.** Acrescentar depois a pessoa de
   cliente global, o operador de franqueadora sobre N clientes ou o provedor de identidade do cliente é
   **só expansão** em C. Sair de B é mover verificador e dado pessoal de N clientes para N schemas, com
   fatos imutáveis apontando para um identificador global para sempre (§4).
3. **A opção A sozinha não serve**: ela não tem portador lícito para a retaguarda sem terminal nem para
   pessoa nossa. O caso 2 do aceite de `F-017` não executa nela. C é A mais a peça que falta (§3.1).
4. **As três pedem a mesma coisa que não existe hoje**: um caminho de leitura da borda até o
   `platform`, que `db/papeis-e-credencial.md:39-42` proíbe à credencial da aplicação e que
   `apps/api/src/tenant/context.ts:57-61` deixou em aberto. O que muda entre as opções é **o que** esse
   caminho lê: em C, encaminhamento e a população nossa; em B, o verificador de toda pessoa de todo
   cliente, com escrita (§2).
5. **Os três papéis nossos** são cobertos em C por uma população nossa no `platform` e por uma **alça de
   escopo** por (pessoa nossa, cliente), criada por ato de resolução registrado. Em B, a escolha de
   cliente numa lista é a família que `RN-PRV-004` (b) eliminou, então B precisa da mesma peça de C para
   os nossos e não economiza nada (§7).
6. **O fato de recusa antes de o tenant existir mora do nosso lado**, em todas as opções. Em C, e só
   em C, a recusa de prova **depois** de o encaminhamento resolver o cliente pode morar no cliente, e é
   ela que dá ao `owner` a evidência de tentativa de tomada de conta que o B.1 §7 pede (§8.4).

---

## 1. Onde `D-03` encosta no que existe

A fundação foi desenhada para não decidir `D-03` por acidente, e as costuras estão em quatro lugares:

| Lugar | O que é hoje | O que `D-03` precisa preencher |
|---|---|---|
| `apps/api/src/identity/principal.ts:16-18` | `Principal` opaco, marca de tipo, a fundação nunca lê dentro | que espécies de sujeito existem atrás da marca |
| `principal.ts:26-47` | `IdentityProvider.authenticate(attempt)`; o padrão recusa tudo | o que o portador apresenta e quem confere |
| `apps/api/src/tenant/context.ts:49-52` | `TenantDirectory.resolve(principal)`: entra só o `Principal`, `null` é recusa | de onde sai o cliente, e que leitura do `platform` isso exige |
| `apps/api/src/http/server.ts:145-166` | o gancho: autentica, resolve, monta o executor de transação | nada muda na ordem; muda quem implementa as duas portas |

E duas propriedades do banco que a escolha herda:

- **O papel por transação** (`tenant-role.ts:62-73`, [[decision-papel-de-aplicacao-assumido-por-transacao]]):
  dentro da transação do cliente X, a conexão só alcança `t_x`. Medido em 2026-09-11 (comentário em
  `apps/api/src/db/pool.ts:19-24`): sem papel assumido, leitura de schema de cliente leva `42501`.
- **A credencial da aplicação não lê `platform`** (`db/papeis-e-credencial.md:39-42`), e a convenção
  [[convention-alcance-de-schema-e-privilegio-nao-escolha]] registra a consequência: o mapa
  identidade→schema não cabe neste pool.

## 2. O que as três pedem igual

Separado aqui para que a comparação da §3 mostre só diferença.

1. **Caminho de leitura da borda ao `platform`.** Proposta, para `arquiteto-dados` e `seguranca`
   decidirem: **credencial própria**, com pool próprio, fora de `forja_app`, sem `USAGE` em nenhum
   `t_*`, com `SELECT` só nas tabelas de encaminhamento. Assumir um papel de `platform` pela mesma
   credencial, por `set_config`, quebraria a afirmação 2 de `papeis-e-credencial.md` e poria o
   `platform` ao alcance do resíduo do arranjo (trocar de papel dentro da transação, `PAP-04`). O custo
   é o que o desempate de 2026-09-11 evitou: um segundo segredo. O envelope de protocolo estendido
   (`pool.ts:103-119`) vale para o pool novo sem mudança.
2. **Registro do terminal no `platform`**, terminal → (cliente, estabelecimento), porque o que resolve o
   cliente não pode morar dentro do cliente que ele resolve (`db/migrations/platform/0001__tenant_registry.sql:37-42`).
   É o portador 1 do dossiê §2.1 e é o que `F-021` modela.
3. **Uma população nossa no `platform`**, para as pessoas de escopo `provedor`. Em A e C ela é separada
   da população do cliente; em B ela se funde com ela (B.1 §1.4, N4).
4. **O ator no contexto.** `TenantIdentification` e `TenantContext` (`context.ts:18-37`) ganham o autor
   e em que o ato se sustentou (`RN-NUC-029`, atribuição, concessão, ou identificação retida mais
   habilitação). O que muda por opção é a espécie do identificador do autor (§3).
5. **Segredo de identificação no terminal distinto da prova com contato.** O material que o terminal
   retém para reconhecer operador offline (`RN-OFF-033`) não pode servir para provar com contato. É
   requisito de E2, vale nas três e fixa o preço do terminal furtado (§8.1).

## 3. Arquivo por arquivo

### 3.1 Código

| Arquivo | A, diretório por cliente | B, diretório central | C, verdade no cliente e índice |
|---|---|---|---|
| `principal.ts` | uma espécie só: `terminal`. Sem espécie para retaguarda nem para pessoa nossa | `global_person` com sessão cunhada para um cliente | união fechada de quatro espécies atrás da marca: `terminal`, `tenant_session`, `provider_person`, `provider_scope` |
| `IdentityProvider` | confere a credencial do dispositivo | confere a sessão contra a população global no `platform` | confere o portador (dispositivo, sessão, alça de escopo); **nunca** confere prova de pessoa de cliente no gancho |
| `IdentityAttempt` (`:21-24`) | sem mudança | sem mudança | sem mudança: o portador vem em cabeçalho |
| `TenantDirectory.resolve` | registro do terminal | lê o cliente da sessão e **confere** que a pessoa tem atribuição nele | lê o vínculo guardado no servidor para aquele portador; `provider_person` sem escopo devolve `null` sempre |
| `TenantContext` | ator local ao cliente | ator global, o mesmo identificador em N clientes | ator local ao cliente, ou pessoa nossa com a alça de escopo |
| `tenant-role.ts` | sem mudança | sem mudança, e **não protege** o dado de identidade, que está fora de `t_*` | sem mudança, e passa a proteger também o verificador |
| `pool.ts` | o pool da §2.1, lendo só o registro do terminal e a população nossa | o pool da §2.1 com **leitura e escrita** na população inteira: verificador, sessão, contagem de falha, segundo fator | o pool da §2.1, só leitura, nas tabelas de encaminhamento e na população nossa |
| `server.ts:145-166` | ordem igual; retaguarda sem caminho | ordem igual; mais uma rota que lista os clientes da pessoa | ordem igual; uma rota anônima de entrada (`anonymous`, `augmentations.ts:18-24`) |

**A entrada da retaguarda em C, em diagrama.** É o único fluxo novo, e ele acontece fora do gancho:

```
rota anônima de entrada recebe (alça, prova)
→ alça consultada no índice, pela credencial da borda → cliente X, ou nada
   ├ nada → caminho de custo igual ao do verificador, recusa constante
   └ X → transação de X sob app_t_x
          → verificador lido em t_x (só t_x é alcançável)
          ├ confere → sessão cunhada para (X, sujeito local); a partir daqui é o gancho
          └ não confere → recusa constante; fato de recusa em X (§8.4)
```

A rota de entrada **não recebe** o executor de transação: ela recebe uma porta estreita ("confira esta
prova para esta alça"), implementada no módulo de identidade. Rota nenhuma ganha a raiz do Kysely,
como hoje (`context.ts:7-9`). O vínculo da sessão com (X, sujeito) é guardado ou assinado pelo
servidor; qual dos dois é E2 e fica fora deste arquivo.

### 3.2 Banco

| Objeto | A | B | C |
|---|---|---|---|
| `platform.role_declarations` (`0011`) | a credencial da borda é uma terceira espécie, e `role_kind` aceita duas (`0011__role_declarations.sql:104-105`); o próprio arquivo já diz que a terceira é migration (`:60-66`) | o mesmo, e a credencial da borda **escreve** no `platform`, que hoje só o executor escreve (`:25-33`): a verificação da §7.5 ganha um escritor legítimo em `platform` | o mesmo de A: terceira espécie, só leitura |
| [[decision-papel-de-aplicacao-assumido-por-transacao]] | vale inteira | vale para a venda e não alcança a identidade: o vazamento de verificador **conclui com sucesso**, que é o defeito que a decisão existe para trocar por falha barulhenta | vale inteira e ganha um segundo uso: a prova da pessoa do cliente corre sob `app_t_x` |
| [[convention-alcance-de-schema-e-privilegio-nao-escolha]] | a pergunta aberta fecha com a §2.1 | fecha com a §2.1, e o que a borda alcança é a maior leitura do sistema | fecha com a §2.1, e o que a borda alcança não tem dado pessoal de cliente |
| tabelas de identidade | em `t_*`, a migration roda N vezes | população no `platform`, atribuição em `t_*` (dossiê §3.2) | em `t_*`; no `platform`, o índice de encaminhamento e as alças de escopo |

Como o índice de C convive com `role_declarations` e com `dados.md` §1 é consulta dirigida a
`arquiteto-dados` (PERGUNTAS do relatório).

## 4. Construção ou verificação, e o custo de reversão

Ordem pedida: isolamento primeiro, reversão depois, desempenho por último.

| | A | B | C |
|---|---|---|---|
| Tenant da requisição | construção (registro do dispositivo) | **verificação**: o cliente foi escolhido numa lista na cunhagem, e cada requisição confia que a sessão não foi reaproveitada | construção: vínculo guardado no servidor, o chamador nunca nomeia cliente |
| Verificador de pessoa do cliente | construção, pelo papel por transação | **verificação**: `WHERE` sobre a população | construção, pelo papel por transação |
| Projeção do conjunto retido (`RN-OFF-033` b) | consulta dentro de `t_x` | a atribuição está em `t_x` e o verificador no `platform`: ou junção entre schemas, proibida pelo invariante 1, ou junção na aplicação por lista de ids, e a lista errada entrega meio de identificação de outro cliente a um dispositivo de terceiro | consulta dentro de `t_x` |
| Pessoa nossa fora do conjunto retido | construção: ela não está na tabela | verificação: filtro por espécie na mesma tabela | construção |

**Custo de reversão**, pela régua de [[convention-o-caro-e-o-tipo-da-chave-nao-a-geracao]]: o caro é a
residência do sujeito, não o formato.

| Escolha hoje → precisa depois | O que custa |
|---|---|
| C → pessoa de cliente global (N3) | expansão: tabela de ligação no `platform`, (pessoa global) → (cliente, sujeito local), preenchida por ato. Os sujeitos locais continuam válidos e os fatos já gravados não mudam |
| C → provedor de identidade do cliente | expansão: coluna anulável de sujeito externo na tabela de sujeitos de `t_*` (metadado, `migrations.md` §5) e configuração do cliente em `t_x` (§8.2) |
| C → operador de franqueadora | expansão: concessão entre clientes, usando a espécie `provider_scope` que já existe para os nossos (§8.3) |
| A → C | uma tabela no `platform` e a rota de entrada. Barato, e necessário no primeiro dia (§3.1) |
| B → isolamento por construção | mover pessoa e verificador de N clientes do `platform` para N schemas, com preenchimento em lotes; contrair a tabela global (etapa 4 de `migrations.md` §4, com aval do humano); invalidar toda sessão; e os fatos imutáveis de N clientes seguem citando o identificador global, então duas espécies de identificador de autor convivem para sempre |
| B → provedor de identidade do cliente | conflito semântico: pessoa global em dois clientes com dois provedores diferentes. A saída é prova por (pessoa, cliente), que é C |

**Desempenho não separa as três** (§9): toda leitura de borda é busca por chave única em tabela pequena.

## 5. As sete necessidades do B.1 §1.4

O B.1 montou a tabela sem escolher; aqui ela ganha o que a leitura do código acrescenta.

| Necessidade | A | B | C |
|---|---|---|---|
| N1 nenhuma consulta vê outro cliente | construção, reforçada pelo papel por transação | verificação | construção, reforçada pelo papel por transação |
| N2 primeira chegada sem terminal | **não atende** sem a peça de C | sessão cunhada após escolha em lista | alça por (pessoa, cliente), rota anônima da §3.1 |
| N3 pessoa de cliente em N clientes, revogada num ato | não | sim | não hoje; por expansão depois (§4) |
| N4 pessoa nossa: uma prova, uma resolução registrada por cliente | precisa de C | a lista de escolha é a família eliminada; precisa de C | população nossa mais alça de escopo (§7) |
| N5 ato ordinário sem rede | sim | sim | sim |
| N6 conjunto retido sem vazar cliente | nasce em `t_x` | junção entre schemas ou na aplicação (§4) | nasce em `t_x` |
| N7 encerrar cliente sem acesso sobrevivente | schema inerte; registro do terminal sai de vigência | exclusão de linhas em tabela viva | schema inerte; registro do terminal e alças saem de vigência, e alça sem vigência não resolve nada |

"Sai de vigência" e não "é apagado": `D-04` proíbe exclusão lógica no núcleo e o `platform` segue a
mesma família (`0001__tenant_registry.sql:63`). Como a vigência do encaminhamento é declarada é da
consulta ao `arquiteto-dados`.

## 6. Os vinte invariantes do B.1 §6

`=` quer dizer que a opção não mexe no invariante: ele é cumprido pelo backend ou pelo terminal do
mesmo jeito nas três.

| # | A | B | C |
|---|---|---|---|
| 1 tenant na borda, pela identidade | construção, sem portador para retaguarda | verificação | construção |
| 2 alvo nosso fora do pedido | sem portador | lista de escolha é a família eliminada (`PRV-15`) | alça criada por ato de resolução |
| 3 um ato nosso, um cliente | sem portador | sessão por cliente | a alça resolve em exatamente um |
| 4 nenhuma superfície enumera clientes | cumpre, não há lista | a lista **é** a enumeração; para os nossos, da carteira | cumpre: o índice só responde busca por chave |
| 5 escopo do objeto | = | = | = |
| 6 ato ordinário offline | = | = | = |
| 7 conjunto retido por estabelecimento, sem `provider_support` | construção | filtro | construção |
| 8 sem renovação offline | = | = | = |
| 9 habilitação com prazo, terminal de um estabelecimento | = (registro do §2.2) | = | = |
| 10 atribuição não publicada | = (em `t_x`) | = (em `t_x`) | = (em `t_x`) |
| 11 meta-autoridade do `owner`, com contato | = | segundo fator global, único para os N clientes da pessoa | = |
| 12 `provider_support`: um cliente, prazo, nunca retido | construção | política | construção |
| 13 papel nosso não atribuível sem célula de trilha | = | = | = |
| 14 ato nosso legível pelo cliente | = | = | = |
| 15 registro nomeia em que se sustentou | = (§2.4) | = | = |
| 16 `identity_unrecognized` no terminal | = | = | = |
| 17 material de prova fora de fato, log, erro | = | a borda lê o verificador de todos: maior superfície | = |
| 18 filtrar manifesto não é autorizar | = | = | = |
| 19 cliente-final nunca escala a operador | espécie distinta | depende de filtro, se a identidade de cliente-final entrar na população global | espécie distinta na união fechada do `Principal` |
| 20 contagem que soma clientes fora de alcance | = | o diretório global **é** um conjunto que soma clientes, lido pela borda | o índice soma clientes sem dado pessoal, e só a borda o lê |

Achado que a tabela revela e que nenhum dos dois documentos anteriores tinha: em B, o identificador
global do autor aparece em fatos de N clientes e vira **chave de correlação entre schemas**. A proposta
de `D-06`(ii) (`docs/arquitetura/d-06-trilha-residencia-2026-09-23.md` §1, item 4) evita exatamente
isso para a pessoa nossa, com pseudônimo por cliente. Em C o sujeito do cliente é local e a questão
não existe.

## 7. Os três papéis nossos

Os três moram, em C, na população nossa do `platform`, provam uma vez e alcançam cliente só por alça
de escopo. A alça é criada por **ato de resolução** registrado (`RN-PRV-004` c), guardada pelo
servidor com (pessoa, papel, cliente, motivo, prazo), e resolve em exatamente um cliente.

| Papel | O que a alça porta | Onde o limite é conferido | A | B |
|---|---|---|---|---|
| `provider_operator`, muta amplo, lê estreito | o alcance declarado pela matriz do escopo `provedor` | backend, por ato; a leitura estreita (nunca faturamento) também é backend nas três | sem portador | a carteira inteira seria a lista de escolha: eliminado por `RN-PRV-004` (b) |
| `provider_administrator`, lê amplo, não muta | leitura, nenhuma mutação no ambiente do cliente | backend; ver P2 abaixo | sem portador | o mesmo |
| `provider_support`, concessão | a concessão nomeada, com escopo, prazo e motivo | backend; a concessão aponta um cliente por construção | sem portador | concessão numa população comum: contenção por política (dossiê §6) |

- **O que a alça não resolve, e continua falhando fechado.** Qual é a entrada do ato de resolução, já
  que nenhuma superfície nossa lista clientes ([[gotcha-nenhuma-superficie-nossa-enumera-clientes-para-escolher]]).
  É pergunta de `produto` com `seguranca`. Até ela ter resposta, o ato nosso que nomeia cliente não
  acontece (`RN-PRV-004` d), e C não muda isso.
- **Por que B não economiza nada aqui.** Os nossos alcançam N clientes por papel declarado, não por
  atribuição em cada um. Cunhar sessão "para o cliente escolhido" é o alvo vindo do pedido, então B
  precisa da mesma alça de escopo, e a fusão das populações passa a ser custo sem ganho.
- **P2, registrado e não proposto aqui.** O eixo leitura × mutação é conferido no backend nas três
  opções. Um papel de banco só de leitura por cliente, assumido para `provider_administrator`, faria
  "não muta" valer por privilégio. Dobra o número de papéis por cliente e mexe no ato de `provision`;
  é decisão de `arquiteto-dados` com `seguranca`, fora de `D-03`.

## 8. As perguntas do B.1 e do thread

### 8.1 O que um terminal furtado custa às provas do estabelecimento

Com a §2.5 cumprida, o furto compromete o **segredo de identificação no terminal** de quem está no
conjunto retido daquele estabelecimento, e não a prova com contato de ninguém. Todo operador do
conjunto troca o segredo de identificação, na reconciliação.

| | A e C | B |
|---|---|---|
| Quem troca | as pessoas do conjunto de E, dentro de um cliente | as mesmas, e a pessoa que está em K clientes expõe o material nos K, se a prova for única |
| Alcance do dano | um estabelecimento; o `owner`, que está no conjunto de todo estabelecimento (`RN-OFF-033` b) | o mesmo, mais o cruzamento pela pessoa global |
| Sem a §2.5 | o furto entrega a prova com contato: todo operador de E troca a prova, e o `owner` perde a meta-autoridade (B.1 §6, restrição final) | o mesmo, em todos os clientes da pessoa |

O preço é decidido por E2, e a opção só muda o alcance. Por isso a §2.5 entra como requisito das três.

### 8.2 Quanto custa acrescentar depois o provedor de identidade do cliente

Em C, baixo: a alça já resolve o cliente **antes** da prova, então a rota de entrada sabe, pela
configuração de X, que a prova de X é delegada. A asserção do provedor de X só prova a pessoa dentro
de X; se ela nomear outro cliente, não há onde isso entre, porque o cliente já foi resolvido. O terminal
offline não muda: o conjunto retido continua vindo de `t_x`. Estrutura: coluna anulável de sujeito
externo em `t_*` e configuração em `t_x`, as duas por expansão. Em A, o mesmo, depois da peça de C. Em B,
o conflito da §4.

### 8.3 Quanto custa acrescentar depois o operador de franqueadora sobre N clientes

Decisão do thread na ficha: não é alvo do MVP, e `D-03` não pode fechar a porta.

- **Em C, sem estrutura nova**, a franqueadora já opera com uma alça por cliente: N acessos, N provas.
  É atrito de uso, não impedimento.
- **Em C, com entrada única**, a peça é uma concessão de cliente para cliente, dada pelo `owner` de cada
  franqueado, com escopo e prazo, resolvida por alça de escopo. É a espécie `provider_scope` aplicada a
  sujeito de outro cliente, e a regra de produto que a governaria não existe. Custo: expansão no
  `platform` e uma regra. O isolamento dos franqueados continua por construção, porque cada alça
  resolve em um.
- **Em A**, a peça de C primeiro. **Em B**, nativo, e pago com tudo da §4.

### 8.4 Onde mora o fato de recusa acontecido antes de o tenant ser resolvido

A resposta sai da classe em que a resolução falhou ([[gotcha-fato-do-provedor-nao-tem-residencia-unica]]),
não de preferência:

| Classe | Exemplo | Tem cliente resolvido pelo servidor? | Residência |
|---|---|---|---|
| r1, portador ausente ou inválido | sem credencial de dispositivo, alça inexistente, sessão vencida, credencial de terminal revogada | não | **do nosso lado**, nas três. Hoje é `request_rejected_no_identity` no destino de borda, que não é trilha (`apps/api/src/observability/border-facts.ts:36-40`); a residência retida é a de `D-06` |
| r2, portador válido e prova recusada | alça de P em X, prova errada | sim, pelo índice, não pelo chamador | **em X**, só em C. Em B a prova falha antes de haver cliente, e mandar o fato aos K clientes da pessoa revelaria em quais ela está |
| r3, pessoa nossa, resolução de alvo recusada | alça de escopo divergente do identificador do pedido | depende da classe | a trilha nossa, `D-06`(ii), proposta com autoridade no `platform` |

r2 em X é o que dá ao `owner` a evidência de tentativa contra a conta dele (B.1 §7). Duas condições,
para `seguranca` em B.3: a resposta ao chamador é a mesma em r1 e r2, **inclusive no tempo** (a rota da
§3.1 paga o custo do verificador também quando a alça não existe); e o fato não carrega a prova nem o
que ela deixa derivar (`RN-NUC-056` a). Registrar em X não bloqueia a entrada: falha ao gravar vira
contador, como em `border-facts.ts:95-112`.

### 8.5 Rede, repetição e resposta perdida

Entrada e resolução de escopo não movem dinheiro, mas criam o portador de tudo que move.

| Fluxo | Offline | Repetição | Resposta perdida depois do commit |
|---|---|---|---|
| entrada da retaguarda (C) | não existe; a retaguarda é superfície com contato. O terminal segue pelo conjunto retido | nova sessão a cada entrada; duas sessões válidas da mesma pessoa não duplicam efeito nenhum | a sessão cunhada fica órfã e vence pelo prazo; o chamador entra de novo |
| ato de resolução de escopo (nosso) | não existe (`RN-NUC-024`: nunca sem contato) | a chave do ato é a identidade de idempotência (`D-04`): reenvio devolve a mesma alça e não registra segunda resolução | reenvio com a mesma chave lê de volta o desfecho gravado ([[gotcha-23505-sem-read-back-acusa-reenvio-legitimo]]) |
| habilitação e revogação do terminal | revogação não alcança o terminal offline; o limite é o prazo (`RN-OFF-032` i) | o mesmo da resolução | o mesmo da resolução |

## 9. Escala, com a conta

Tudo `ESTIMATIVA`. Premissas: N = 10³ clientes em dois anos, com 10⁴ como teto de raciocínio; média de
1,5 estabelecimento por cliente, a maior rede com 10²; 15 pessoas por estabelecimento; 3 pessoas de
retaguarda por cliente mais 1 por estabelecimento; 2 terminais por estabelecimento; pessoa de cliente
em mais de um cliente ≈ 0 (B.1 §1.4); pessoas nossas entre 1 e 10¹.

| Grandeza | Conta | 10³ clientes | 10⁴ clientes |
|---|---|---|---|
| pessoas de cliente | N × 1,5 × 15 | 22.500 | 225.000 |
| sujeitos no maior schema (A, C) | 10² × 15 | 1.500 | 1.500 |
| linhas do índice de C | N × (3 + 1,5) | 4.500 | 45.000 |
| registro de terminais (as três) | N × 1,5 × 2 | 3.000 | 30.000 |
| verificadores que a borda lê (B) | todas as pessoas | 22.500 | 225.000 |
| verificadores de cliente que a borda lê (C) | nenhum | 0 | 0 |
| terminais com material do `owner` da maior rede | 10² × 2 | 200 | 200 |

- **Nenhuma das tabelas é grande.** Busca por chave única nessas faixas não separa as opções; não medi,
  e a medida é do gate de `performance` quando a tabela existir.
- **O que cresce e importa é o alcance do comprometimento**: a credencial da borda em B entrega 225.000
  verificadores a 10⁴ clientes; em C, zero de cliente. E a linha do `owner` da rede grande, presente em
  200 terminais nas três opções, é o motivo concreto da §2.5 e do segundo fator do B.1 §3.
- **Revogação de pessoa em K clientes**: K atos em A e C, 1 em B. Com K ≈ 1 do lado do cliente, a
  diferença é nula hoje. Do nosso lado é 1 ato nas três, porque a população nossa é única nas três.
- **Migration**: tabelas de identidade em `t_*` rodam N vezes por mudança, que é o custo que todo o
  núcleo já paga. O índice de C é uma migration de `platform`.
- **Pool compartilhado**: em C a entrada abre transação de cliente para quem ainda não provou nada.
  Enxurrada contra a alça de X consome conexão do pool de todos os clientes. Limite de taxa por alça e
  por origem antes da transação é requisito; o número é de `performance` com `seguranca`.

## 10. Recomendação

**C**: sujeito, verificador, atribuição e delegação em `t_<slug>`; no `platform`, só encaminhamento
(registro do terminal, índice de alça por pessoa e cliente, alças de escopo) e a população nossa; a
prova da pessoa do cliente conferida sob `app_t_<slug>`; alça única resolvendo em vários clientes
recusada, como no dossiê §8.

A recomendação não depende da decisão sobre franquia: se ela mudar, C acrescenta por expansão (§8.3).

### Recusa de B, nas quatro partes

1. **Necessidade preservada.** Gerir num ato a pessoa que opera em N clientes e dar a ela entrada única:
   franqueadora, contador, revenda.
2. **Mecanismo recusado, e por que é ruim.** População global de pessoas de cliente no `platform`, com
   sessão cunhada para o cliente escolhido. O isolamento da identidade sai do privilégio de banco e vai
   para uma cláusula `WHERE`; a projeção do conjunto retido vira junção entre schemas ou lista de ids
   montada na aplicação, com um ponto de falha que entrega meio de identificação de outro cliente a um
   dispositivo; a credencial da borda passa a ler e escrever o verificador de todos; a escolha de
   cliente numa lista é, para os nossos, a família que `RN-PRV-004` (b) eliminou; e sair dela depois é a
   reversão mais cara da §4.
3. **Mecanismo nosso.** C, com a necessidade reposta por expansão quando tiver dono: tabela de ligação
   para a pessoa global (§4), concessão entre clientes pela alça de escopo (§8.3), e a população nossa,
   que é onde a rotina de N clientes existe hoje, já única nas três.
4. **Por que é melhor, e como se prova.** Isola por construção e mantém a porta aberta pelo lado barato.
   Três provas, para quando existir código: alça de Y com prova válida em X, recusada, e nada gravado em
   X nem em Y; a porta de prova, sob `app_t_x`, tentando ler a tabela de sujeitos de `t_y`, leva
   `42501` (a mesma forma da medida de `pool.ts:22-24`); e a projeção do conjunto retido de E, feita em
   `t_x`, não tem privilégio para nomear `t_y`.

### Recusa de A isolada, nas quatro partes

1. **Necessidade preservada.** Nenhuma tabela nova no `platform` sobre pessoa de cliente: a menor
   superfície possível.
2. **Mecanismo recusado, e por que é ruim.** O terminal como único portador. A retaguarda do `owner`,
   onde mora a meta-autoridade, e toda superfície nossa ficam sem portador lícito, e a pressão para
   destravar empurra o cliente para o pedido, que é ilícito (`backend.md` §1).
3. **Mecanismo nosso.** C, que é A mais um índice sem nome, sem contato, sem verificador e sem papel.
4. **Por que é melhor, e como se prova.** O índice não carrega dado pessoal e o caso 2 do aceite de
   `F-017` (dono na retaguarda, sem terminal) executa em C e não tem caminho em A.

## 11. O que C deixa com dono

| O quê | Dono |
|---|---|
| credencial e pool da borda, e a terceira espécie em `role_declarations` (§2.1, §3.2) | `arquiteto-dados` + `seguranca` |
| índice de alça, registro do terminal e alças de escopo: forma, vigência, convivência com `dados.md` §1 | `arquiteto-dados` (consulta B.2'); registro do terminal com `F-021` |
| resposta constante, inclusive no tempo, e campos da recusa r2 (§8.4) | `seguranca`, B.3 |
| limite de taxa da entrada antes da transação (§9) | `performance` + `seguranca` |
| entrada do ato de resolução de escopo sem enumerar clientes (§7) | `produto` + `seguranca` |
| segredo de identificação no terminal distinto da prova com contato (§2.5) | E2, `backend` + `seguranca`, sem biblioteca escolhida aqui |
| `IdentityProvider`, `TenantDirectory` e a porta de prova | tarefa própria da Fase 2, depois de `T-0013` e `T-0009` |

## Referências

`docs/produto/identidade-necessidade-e-fronteira-2026-09-23.md` (B.1) · `docs/arquitetura/d-03-identidade-opcoes.md`
(dossiê) · `docs/arquitetura/d-06-trilha-residencia-2026-09-23.md` · `apps/api/src/identity/principal.ts` ·
`apps/api/src/tenant/context.ts` · `apps/api/src/db/tenant-role.ts` · `apps/api/src/db/pool.ts` ·
`apps/api/src/http/server.ts` · `apps/api/src/observability/border-facts.ts` ·
`db/migrations/platform/0001__tenant_registry.sql` · `db/migrations/platform/0011__role_declarations.sql` ·
`db/papeis-e-credencial.md` · `db/universo-e-declaracao.md` §7.5.4 · `docs/produto/operacao-do-provedor.md`
(`RN-PRV-003` a `RN-PRV-006`) · `docs/produto/fila-local-autoridade-e-identidade.md` (`RN-OFF-032`, `RN-OFF-033`) ·
`docs/produto/papeis-atribuicao-e-delegacao.md` (`RN-NUC-024`).

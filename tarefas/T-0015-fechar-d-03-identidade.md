---
id: T-0015
backlog: F-017
titulo: Fechar D-03: identidade e prova
status: fechada
escopo: cliente=- vertical=- modulo=- camada=backend+seguranca+produto
aberta_em: 2026-09-23
---

## Pedido

"Cara, sobre as decisões, você faz o que for melhor para a escalabilidade. A lacuna de periféricos
precisa nascer, pois então que ela nasça. A gente vai fazer a base e bem feita. O que não tiver ao seu
alcance, você vai continuando o restante e coloca um aviso claro lá na hora da, do módulo tal coisa não
funciona porque precisa de tal coisa." (humano, 2026-09-23)

Regra de trabalho que saiu disso: [[convention-decisao-delegada-com-aviso-no-modulo]]. Plano da base
inteiro, com as ondas, no relatório do `orquestrador` de 2026-09-23; aqui entra só a parte desta ficha.

## Plano

## PLANO: T-B (T-0015), fechar D-03
BACKLOG: F-017
ESCOPO: necessidade e fronteira da identidade; as opções A, B e C medidas contra o código e o banco existentes; gate de `seguranca` sobre o documento; a decisão do thread.
FORA DE ESCOPO: implementar `IdentityProvider`/`TenantDirectory`, a tabela de encaminhamento e as tabelas de operador. Isso é tarefa própria da Fase 2, depois que `T-0013` e `T-0009` fecharem. Também fora: escolher biblioteca de hash ou de prova.
ESCOPO DE MEMÓRIA: cliente=- vertical=- modulo=- camada=backend+seguranca+produto
DECISÕES ABERTAS QUE TOCAM ISSO: `D-03` é o objeto da tarefa, e agora o thread decide. `RN-PRV-004`(b) já elimina, para papel nosso, o tenant chegando no pedido.
PASSOS:
1. B.1 `produto`, necessidade e fronteira
   - **Brief:** responder, com prova, "o humano que opera em mais de um cliente é caso de borda ou caso de venda?".
   - Hipótese a testar, e não a presumir: a rede com N estabelecimentos é **um** cliente (`decision-tenancy-schema-por-cliente`: "o schema isola cliente, não estabelecimento"). Se for, ela não cruza tenant, e sobram contador e suporte, que são borda.
   - Também: `LACUNA-IDE-002` (quem cria o primeiro `owner`), `IDE-005` (segundo fator, por papel), a exigência de provedor de identidade do cliente, e o que o operador no terminal precisa provar (`RN-OFF-032`/`033`).
   - Não edita `papeis-e-permissoes.md`: mudança lá vai em `PERGUNTAS`.
   - **Entrega:** `docs/produto/identidade-necessidade-e-fronteira-2026-09-23.md`.
   - Onda 1, paralelo.
2. B.2 `backend`, opções medidas
   - **Brief:** atualizar o dossiê de 2026-08-23, escrito antes de `D-01` e antes do papel por transação.
   - Para cada opção (A, B, C): o que muda em `apps/api/src/identity/principal.ts`, `tenant/context.ts`, `db/tenant-role.ts` e `db/pool.ts`, e em `db/` (`platform.role_declarations` da `0011`, [[decision-papel-de-aplicacao-assumido-por-transacao]], [[convention-alcance-de-schema-e-privilegio-nao-escolha]]).
   - Também: se o isolamento sai por construção ou por verificação, o custo de reversão (ordenar por ele antes do desempenho), e a escala em N clientes × M estabelecimentos × pessoas em mais de um cliente.
   - Recomendação com o recusado nas quatro partes.
   - Arquivo **novo**, sem editar `d-03-identidade-opcoes.md` (está no corpus congelado de `F-016`). Só lê `apps/api/**` e `db/**`.
   - **Entrega:** `docs/arquitetura/d-03-identidade-decisao-2026-09-23.md`.
   - Depende de B.1.
3. B.2' `arquiteto-dados` (consulta)
   - **Brief:** o índice de encaminhamento da opção C, sem nome, sem verificador e sem papel, cabe no `platform` sem violar `dados.md` §1? Como ele convive com `role_declarations`?
   - **Entrega:** resposta com no máximo 10 linhas.
   - Paralelo com B.2 ou disparada pela `PERGUNTAS` dele.
4. B.3 `seguranca`, gate sobre o documento
   - **Brief:** as cinco perguntas de `seguranca.md` §1 e a §2 sobre a opção recomendada e a principal recusada. Incluir escrever no cliente errado (agravante de mutação) e o provedor que resolve o alvo fora do pedido.
   - **Entrega:** `docs/auditorias/2026-09-2X-d-03-decisao.md`.
   - Depende de B.2.
5. **Thread: decisão**, na ficha, com o recusado e o motivo.
   - O orquestrador fecha e escreve o `decision` que supera [[decision-d-03-sao-tres-eixos-nao-uma-decisao]].
   - O thread muda a linha do `CLAUDE.md` §8 para `FECHADA → [[slug]]`.
   - Depende de B.3, sem achado `ALTO` ou `CRÍTICO` aberto.
GATES: gate 3 antecipado sobre o desenho (o endpoint vem depois e terá gate próprio). Gate 1 em B.1.
RISCO PRINCIPAL: B.2 recomendar pelo que é mais fácil de implementar sobre a fundação atual, em vez de pelo isolamento por construção. O `Principal` opaco existe justamente para a fundação não decidir `D-03` por acidente.

## Fechamento — 2026-09-23

ENTREGUE: `D-03` fechada pela opção C, com as três cláusulas do gate (`IDN-01`, `IDN-04`, `IDN-08`) como parte
da decisão. O fato de recusa r2 não carrega nada sobre a origem (default do gate, adotado pelo thread).
ARQUIVOS: `docs/produto/identidade-necessidade-e-fronteira-2026-09-23.md`;
`docs/arquitetura/d-03-identidade-decisao-2026-09-23.md`; `docs/auditorias/2026-09-23-d-03-decisao.md`;
memória `plataforma/decision-d-03-opcao-c-sujeito-local-ao-cliente` (supera a de três eixos), dois gotchas;
`CLAUDE.md` §8.
VERIFICAÇÃO: medidas do B.3 em PostgreSQL 16.15 descartável (M1–M3). O custo do hash não foi medido. O thread
não rodou nada.
PRONTO:
- Gate 3 antecipado sobre o desenho: feito. `IDN-01` (ALTO) fecha por cláusula na decisão, e a regra que a
  aplica (`RN-NUC-060`/`061`) foi despachada ao `produto`. Os outros sete achados viram requisito escrito da
  implementação (listados no `decision`).
- Decisão registrada, com linha no índice e no `CLAUDE.md` §8: sim.
- Memória sugerida: as duas do B.3 escritas; `decision-rede-e-um-cliente-humano-multi-cliente-e-borda` (B.1)
  fundida no `decision` de C; `gotcha-autor-global-vira-chave-de-correlacao-entre-schemas` (B.2) recusada
  como registro próprio, porque é o motivo da recusa de B, já escrito no `decision`;
  `gotcha-habilitar-terminal-nao-e-linha-de-matriz` recusada, porque a linha 40 existe desde o A.2a.
- Segredo: nenhum.
SOBROU:
- `produto`: precondição de `IDN-01` em `RN-NUC-060`/`061`; segundo fator nas linhas 40 e 21 (`IDN-07`); a
  regra da entrada do ato de resolução para a pessoa nossa (`RN-PRV-004` (d)); prazo da alça de escopo.
- `backend`: implementação da borda com os requisitos `IDN-02`…`07`, depois de `T-0009` e `T-0013` fecharem.
- `arquiteto-dados`: índice, encerramento e declaração da borda, junto com o grupo do `PAP-28`.

## produto — 2026-09-23 (B.1, necessidade e fronteira)

## RELATÓRIO — produto — T-0015 (passo B.1)
STATUS: OK

FEITO:
- Li o dossiê de D-03 de novo, agora com D-01 e D-02 fechadas, e escrevi a necessidade e a fronteira da identidade com `path:linha` em cada afirmação. As seis perguntas estão respondidas, uma seção cada.
- Testei a hipótese da rede como um cliente só, sem assumir que era verdade. **Ela se confirma.** Cliente é "a empresa que contrata" (`glossario.md:28`); `RN-NUC-050` diz que o estabelecimento pertence a um cliente só e que o que separa duas unidades do mesmo cliente é autorização, não isolamento (`nucleo-estabelecimento.md:32-44`); e `RN-NUC-020` usa como exemplo "o gerente regional alcança quatro lojas", com a atribuição valendo para um conjunto de estabelecimentos (`papeis-atribuicao-e-delegacao.md:74-75`, `:86-87`). O dossiê §8 (`:351-352`) classificou "rede com administração central" e "grupo de N estabelecimentos" como caso de venda. Pela spec, os dois cabem dentro de um cliente.
- Veredito: do lado do cliente, o humano em vários clientes é **borda**. São três casos, cada um com o que a spec presume hoje:
  - contador: o acesso dele é integração (`INT`) ou `fiscal_officer`, que depende da `LACUNA-NUC-012`;
  - franquia em que cada franqueado contrata separado: nenhuma regra cobre;
  - revenda: é a `LACUNA-PRV-001`, e a spec presume o caso estreito (`fronteira-do-nucleo.md:264-268`).
- Do nosso lado é **rotina** (`operacao-do-provedor-alcance.md:309-318`), mas é outra população, a do escopo `provedor`. O que ela exige é:
  - uma prova para a pessoa nossa;
  - um cliente por ato, resolvido fora do pedido e registrado (`RN-PRV-004` b e c).
  Nada disso pede diretório global de operadores de cliente.
- Montei uma tabela de sete necessidades contra as opções A, B e C, sem escolher nenhuma. A única necessidade que só B atende é revogar num ato uma pessoa de cliente presente em N clientes (N3), e ninguém do lado do cliente tem essa necessidade.
- `LACUNA-IDE-002`, quem cria o primeiro `owner`. Proposta:
  - `provider_operator` atribui o primeiro `owner` dentro do próprio ato que provisiona o cliente. Como o alvo é o cliente que esse ato cria, ele não vem de identificador no pedido;
  - só vale enquanto o cliente tem zero `owner`;
  - nós nunca conhecemos a prova do `owner`: ele recebe convite e define a dele.
  - Recuperar um cliente que perdeu o único `owner` fica **indisponível**, com aviso no formato de F-018 (responde: humano, com advogado).
- `LACUNA-IDE-005`, segundo fator. Proposta por classe de ato, sempre conferido com contato:
  - todo papel nosso;
  - meta-autoridade e publicação do `owner`;
  - ato sobre a capacidade de assinar do `fiscal_officer`;
  - `manager` fora de terminal habilitado;
  - `cashier` nunca, pelo núcleo.
  - O cliente pode exigir mais, nunca menos. Sem rede ele não é pedido e nada se renova.
- Provedor de identidade do próprio cliente: nenhuma necessidade registrada. Se um dia existir, é escopo cliente e opt-in; nunca prova identidade sem rede, nunca diz qual é o tenant e nunca autoriza. Recebeu aviso de indisponível (responde: humano).
- O que o operador prova no terminal: um diagrama do fluxo e o desfecho que o negócio exige nos cinco casos do aceite de F-017.
- Vinte invariantes que nenhuma opção de D-03 pode quebrar, em tabela, cada um com a regra dona.
- Registra / Não registra, incluindo um ponto hoje não capturado: a recusa de prova em superfície sem terminal (retaguarda ou superfície nossa). Isso fecha a parte "digitação abortada" que F-017 tinha deixado aberta: não se registra, porque nada chegou ao sistema e o que foi digitado seria credencial parcial.

ARQUIVOS:
- `/home/mcastro/work/freelas/forja/docs/produto/identidade-necessidade-e-fronteira-2026-09-23.md` (novo, 392 linhas)
- Só leitura: a ficha T-0015, o item F-017, o dossiê, os dois registros de memória pedidos, `papeis-e-permissoes.md` e o irmão de atribuição, os três `operacao-do-provedor*`, `superficie-do-provedor.md`, `fila-local-*`, `nucleo-estabelecimento.md`, `fatos-de-operacao-*`, `matriz-operacao-papel.md`, `glossario.md`, `catalogo-de-modulos.md`, `fiscal-custodia-e-trilha.md`, `fronteira-do-nucleo.md` e `F-018`.

NÃO FEITO: —

DECISÕES:
- Separei a pergunta "borda ou venda" por população. Do jeito que o dossiê a fez, ela mistura o nosso pessoal, que é rotina, com o pessoal do cliente, que é borda, e a mistura empurraria para B por um motivo que B não resolve.
- Respondi o segundo fator **por classe de ato**, não só por papel. O `owner` da padaria opera o balcão sem rede, onde segundo fator não existe, e precisa dele para publicar e atribuir papel.
- Não numerei RN e não abri lacuna nova. As propostas vão como pergunta ao thread, porque os arquivos donos estão sendo editados por outra instância.
- Troquei o travessão da prosa por vírgula e dois-pontos.

RISCOS:
- **Hoje nenhum cliente real pode ser posto em operação**: nenhum papel nosso é atribuível enquanto a `LACUNA-NUC-031` não tiver célula (`RN-PRV-006` b), e a matriz do escopo `provedor` não tem linha para provisionar.
- Achado da mesma leitura: **habilitar terminal a vender não é linha de nenhuma matriz**. Busquei `habilit` em `matriz-*.md` e só aparecem módulo, emissão e meio de pagamento. Pelo default (`RN-NUC-026`), o ato está negado a todos, e é ele que cria o portador de tenant do terminal. Isso afeta F-021.
- O dossiê tem referências velhas: `RN-OFF-024`, `026`, `032` e `033` mudaram de arquivo. Pus o mapeamento na §8 para B.2 não citar linha errada. O resíduo de C-09 que o dossiê apontava já está corrigido em disco.
- O dossiê §6 não trata `provider_operator` nem `provider_administrator`. Se B.2 medir só `provider_support`, a comparação sai incompleta justamente no papel que muda N clientes todo dia.
- A franquia que entra como um cliente só deixa o franqueado sem publicar o próprio preço: publicar é `owner`, de escopo cliente (`matriz-operacao-papel.md:73`, `:93`).

PERGUNTAS:
- para humano: franquia em que cada franqueado contrata separado, com a franqueadora operando sobre todos, é mercado-alvo? Se não for, a rede entra como um cliente e a pessoa em vários clientes segue sendo borda. Se for, a pergunta de D-03 reabre com este arquivo como insumo.
- para produto (a instância que edita `papeis-e-permissoes.md`), via thread: escrever como RN a proposta da §2 (primeiro `owner` no provisionamento) e a da §3 (segundo fator por classe de ato).
- para o dono da matriz do escopo `provedor`, via thread: criar a linha "provisionar e atribuir o primeiro `owner`".
- para o dono da matriz do núcleo, via thread: criar a linha "habilitar terminal a vender".
- para seguranca (B.3): terminal habilitado basta para dispensar o segundo fator do `manager` no terminal? E que campos a recusa de prova fora do terminal carrega sem revelar que a conta existe?
- para backend (B.2), por opção:
  - o que um terminal furtado custa às provas do estabelecimento (todo operador de lá troca a dele?);
  - quanto custa acrescentar depois o provedor de identidade do cliente;
  - a cobertura dos três papéis nossos;
  - onde mora o fato de recusa acontecida antes de o tenant ser resolvido.

VERIFICAÇÃO:
- Conferi cada `path:linha` citado contra o arquivo em disco.
- Busquei, para confirmar ausência:
  - `SSO`, "conta corporativa" e "provedor de identidade": aparecem só no dossiê e nas frases que dizem não decidir SSO;
  - `franquia` e `franq`: zero ocorrências em `docs/produto`;
  - `habilit` em `matriz-*.md`: nenhuma linha de habilitar terminal.
- Contei 392 linhas no arquivo, abaixo do teto de 400.
- Teste de código não se aplica: não há código.

MEMÓRIA SUGERIDA:
- type=decision escopo=plataforma slug=decision-rede-e-um-cliente-humano-multi-cliente-e-borda — rede e grupo com N estabelecimentos são um cliente (`RN-NUC-050`, `RN-NUC-020`); a pessoa de cliente em vários clientes é borda; a nossa é rotina, mas é outra população; isso corrige o dossiê §8.
- type=gotcha escopo=plataforma slug=gotcha-habilitar-terminal-nao-e-linha-de-matriz — o ato que cria o portador de tenant do terminal está negado a todos pelo default, e não dá sintoma nenhum até F-021.

PRÓXIMO PASSO SUGERIDO: backend, B.2. Medir A, B e C contra a tabela de necessidades da §1.4 e os vinte invariantes da §6, cobrindo os três papéis nossos e respondendo P-4, no arquivo novo `docs/arquitetura/d-03-identidade-decisao-2026-09-23.md`.

## thread — 2026-09-23 (resposta à pergunta do B.1 ao humano)

Decidido pelo thread, por delegação ([[convention-decisao-delegada-com-aviso-no-modulo]]): a franquia
em que cada franqueado contrata separado **não é alvo do MVP**, e a rede entra como um cliente só. A
decisão de `D-03` não pode fechar essa porta: o B.2 mede, por opção, quanto custa acrescentar depois o
operador que atua sobre N clientes de uma franqueadora, e esse custo de reversão entra no critério.
Motivo: nenhuma necessidade registrada pede isso hoje (zero ocorrência de `franq` em `docs/produto`),
e desenhar para ela agora empurraria para a opção B sem cliente que a peça.

## backend — 2026-09-23 (B.2, opções medidas)

## RELATÓRIO — backend — T-0015 (passo B.2)
STATUS: OK

FEITO:
- Medi A, B e C contra o código e o banco que existem hoje: `principal.ts`, `tenant/context.ts`, `db/tenant-role.ts`, `db/pool.ts`, o gancho em `http/server.ts:145-166`, `border-facts.ts`, a `0001`, a `0011`, `db/papeis-e-credencial.md`, `db/universo-e-declaracao.md` §7.5.4 e os dois registros de memória pedidos. A tabela arquivo por arquivo está na §3.1 (código) e na §3.2 (banco).
- Separei o que as três opções pedem igual (§2), para que a comparação mostre só diferença. As cinco peças comuns:
  - caminho de leitura da borda até o `platform`, que hoje a credencial da aplicação não tem (`db/papeis-e-credencial.md:39-42`, `context.ts:57-61`);
  - registro do terminal no `platform`;
  - população nossa no `platform`;
  - o ator no `TenantContext`;
  - segredo de identificação no terminal distinto da prova feita com contato.
- Classifiquei cada opção entre isolamento por construção e isolamento por verificação, e ordenei pelo custo de reversão antes de olhar desempenho (§4).
- Passei as sete necessidades do B.1 (§5) e os vinte invariantes (§6) opção por opção.
- Cobri os três papéis nossos, e não só o suporte (§7).
- Respondi as quatro perguntas do B.1 e a do thread sobre franqueadora (§8.1 a §8.4). Acrescentei rede, repetição e resposta perdida para a entrada, a resolução de escopo e a habilitação do terminal (§8.5).
- Fiz a conta de escala com premissas à vista, toda rotulada ESTIMATIVA (§9).
- Recomendação: **C**. As recusas de B e de A isolada estão nas quatro partes (§10). O que C deixa com dono está na §11.

ARQUIVOS:
- `/home/mcastro/work/freelas/forja/docs/arquitetura/d-03-identidade-decisao-2026-09-23.md` (novo, 390 linhas)
- Só leitura: a ficha T-0015; o B.1; o dossiê; `docs/arquitetura/d-06-trilha-residencia-2026-09-23.md`; `apps/api/src/{identity/principal.ts, tenant/context.ts, db/tenant-role.ts, db/pool.ts, http/server.ts, http/augmentations.ts, observability/border-facts.ts}`; `db/migrations/platform/0001__tenant_registry.sql` e `0011__role_declarations.sql`; `db/papeis-e-credencial.md`, `db/papel-do-cliente.md` e `db/universo-e-declaracao.md`; `docs/produto/operacao-do-provedor.md` (`RN-PRV-003` a `006`), `fila-local-autoridade-e-identidade.md` (`RN-OFF-032` e `033`) e `papeis-atribuicao-e-delegacao.md` (`RN-NUC-024`); e os registros de memória `decision-papel-de-aplicacao-assumido-por-transacao`, `convention-alcance-de-schema-e-privilegio-nao-escolha`, `decision-d-03-sao-tres-eixos-nao-uma-decisao` e `gotcha-fato-do-provedor-nao-tem-residencia-unica`.

NÃO FEITO: —

DECISÕES:
- O argumento que decide a favor de C vem do código, e o dossiê não o tinha. Em C, o verificador da pessoa do cliente fica em `t_x` e é lido sob `app_t_x` (`tenant-role.ts:62-73`). Com isso, a identidade fica isolada pelo mesmo privilégio de banco que já isola a venda. Em B, a identidade fica fora do alcance do papel por transação, e o vazamento conclui com sucesso, que é o defeito que [[decision-papel-de-aplicacao-assumido-por-transacao]] existe para trocar por falha barulhenta.
- A ordem do gancho (autentica, resolve, monta a transação) não muda em nenhuma opção. Em C, a entrada da retaguarda é uma rota anônima que recebe uma **porta estreita** de prova, e não o executor de transação. Assim nenhuma rota ganha acesso à raiz do banco (diagrama na §3.1).
- A pessoa nossa alcança cliente por uma **alça de escopo** criada por ato de resolução registrado, que resolve exatamente um cliente. Isso atende `RN-PRV-004` (b) e (c). Não decidi qual é a entrada desse ato: é a pergunta para `produto` abaixo, e até lá o item (d) continua falhando fechado.
- Onde mora a recusa, decidido pela classe em que a resolução falhou (§8.4):
  - r1, portador ausente ou inválido: fica do nosso lado nas três opções;
  - r2, portador válido e prova recusada: fica no cliente, e só em C. É ela que dá ao `owner` a evidência de tentativa de tomada de conta que o B.1 §7 pede.
- Proponho uma credencial própria para a borda, e não um papel de `platform` assumido pela mesma credencial da aplicação. A troca de papel dentro da transação (resíduo `PAP-04`) alcançaria o `platform`. O custo é um segundo segredo, que é justamente o que o desempate de 2026-09-11 tinha evitado. Quem decide é `arquiteto-dados` com `seguranca`.
- O brief do sistema dizia "D-01 ABERTA", mas o `CLAUDE.md` §8 diz FECHADA (Fastify e Kysely), e a tabela do `CLAUDE.md` vence. O entregável é contrato e fluxo de qualquer forma, e não escolhi biblioteca de hash, de prova nem formato de token.

RISCOS:
- Achado novo: em B, o identificador global do autor aparece em fatos de N clientes e vira chave de correlação entre schemas. É o contrário do que a proposta de `D-06`(ii) §1, item 4, faz para a pessoa nossa.
- Em C, a entrada abre transação de cliente para quem ainda não provou nada. Uma enxurrada contra a alça de um cliente consome o pool de todos os clientes. Limite de taxa antes da transação é requisito, sem número definido.
- O índice de C é um oráculo de "esta alça existe?". A resposta tem de ser constante, **inclusive no tempo**: a rota paga o custo do verificador mesmo quando a alça não existe.
- A terceira espécie de credencial em `role_declarations` exige alargar o `CHECK` de `0011:104-105`. Alargar é remover e recriar a restrição, e `migrations.md` §4 lista remover `CHECK` que guarda invariante entre as proibições. Precisa da forma de `arquiteto-dados`.
- As linhas citadas de `apps/api/**` e `db/**` valem para 2026-09-23. Os dois territórios estão em edição (`T-0013`, `T-0009`), então podem deslocar.
- O `owner` de uma rede com 10² unidades tem material de identificação em cerca de 200 terminais nas três opções (ESTIMATIVA). Sem segredo de terminal distinto da prova feita com contato, um furto entrega a meta-autoridade dele.

PERGUNTAS:
- para arquiteto-dados (consulta B.2'):
  - o índice de encaminhamento de C (alça → cliente, sem nome, sem contato, sem verificador e sem papel), junto com o registro do terminal e as alças de escopo nossas, cabe no `platform` sem violar `dados.md` §1?
  - o índice guarda o sujeito local ou só o cliente?
  - como se declara a vigência sem exclusão lógica?
  - como a terceira espécie entra em `role_declarations` sem remover `CHECK` que guarda invariante?
- para seguranca (B.3):
  - resposta constante no tempo entre r1 e r2;
  - que campos a recusa r2 carrega no cliente sem derivar a prova;
  - se a credencial própria da borda (§2.1) é aceitável contra a alternativa de papel assumido.
- para produto: qual é a entrada do ato que resolve o cliente-alvo para a pessoa nossa, dado que nenhuma superfície nossa lista clientes? Sem ela, `RN-PRV-004` (d) mantém todo ato nosso recusado, em C como em qualquer opção.

VERIFICAÇÃO:
- Conferi contra o arquivo em disco cada `path:linha` de código e de banco citado.
- Contei 390 linhas no documento.
- Busquei travessão e meia-risca na prosa: zero ocorrências.
- Não rodei banco nem teste: o documento não tem código. A única afirmação sobre comportamento do Postgres é a medida de 2026-09-11, citada de `pool.ts:22-24`.

MEMÓRIA SUGERIDA:
- type=gotcha escopo=plataforma slug=gotcha-autor-global-vira-chave-de-correlacao-entre-schemas — com a pessoa de cliente numa população global, o identificador do autor gravado em fatos de N clientes correlaciona schemas; com sujeito local a questão não existe.
- type=gotcha escopo=plataforma slug=gotcha-a-borda-le-platform-em-qualquer-opcao-de-d-03 — as três opções exigem ler o `platform` na borda; a escolha decide **o que** se lê (encaminhamento, ou o verificador de todos), e esse é o alcance do comprometimento da credencial da borda.

PRÓXIMO PASSO SUGERIDO: disparar em paralelo a consulta B.2' ao `arquiteto-dados` e o gate B.3 de `seguranca` sobre `docs/arquitetura/d-03-identidade-decisao-2026-09-23.md`, focando a opção C e a recusa de B.

## thread — 2026-09-23 (estado depois do B.2)

A recomendação é **C**: o sujeito é local ao cliente, o verificador fica em `t_x` e é lido sob `app_t_x`,
e o `platform` guarda só o índice de encaminhamento. O argumento que decide vem do código: em C a
identidade fica isolada pelo mesmo privilégio que já isola a venda, e em B o vazamento concluiria com
sucesso.

**`D-03` não fecha aqui.** O plano exige o gate B.3 de `seguranca` sem achado `ALTO` ou `CRÍTICO` aberto,
e o humano pediu em 2026-09-23 que nenhum agente novo seja despachado. Ficam registrados como próximo
passo, **sem despacho**:
1. a consulta B.2' ao `arquiteto-dados` (as quatro perguntas do relatório acima);
2. o gate B.3 de `seguranca`, com as três perguntas do relatório acima mais a do B.1 (terminal
   habilitado dispensa o segundo fator do `manager`?);
3. a pergunta ao `produto`: qual é a entrada do ato que resolve o cliente-alvo para a pessoa nossa.
   Não a decido sem o `produto`, porque ela mexe em `RN-PRV-004` e a leitura errada abre alcance entre
   clientes. Até lá, `RN-PRV-004` (d) mantém todo ato nosso recusado, e esse é o desfecho seguro.

## arquiteto-dados — 2026-09-23 (B.2', consulta)

## RELATÓRIO — arquiteto-dados — T-0015 (consulta de backend)
STATUS: OK

RESPOSTA:
1. **Cabe no `platform`.** O índice, o registro do terminal e as alças de escopo são encaminhamento de controle, da mesma espécie de `0001__tenant_registry.sql:37-42`: nada ali é a verdade do cliente. Cabe com três condições. (a) Nenhuma coluna de nome, contato, verificador, papel ou atribuição do cliente. (b) A alça é identificador opaco, e **nunca** e-mail ou telefone: alça que é contato põe dado pessoal de cliente no `platform` e fura §1. (c) Nenhuma FK nem join para `t_*`, e a credencial da borda só tem `SELECT` nessas tabelas.
2. **Só o cliente.** O sujeito local é resolvido dentro da transação de X, sob `app_t_x`, pela alça (diagrama da §3.1). Guardar o sujeito no `platform` montaria um mapa de pessoas entre clientes e deixaria os fatos presos a um identificador de fora do cliente. É o custo de reversão de B, entrando por outra porta. A exceção é a alça de escopo, que aponta para a população nossa (que já mora no `platform`) mais o cliente.
3. **Vigência pelo padrão da `0014`.** A linha de vínculo (alça, cliente, instante próprio) nunca é alterada, com gatilho `reject_mutation`. O fim do vínculo é uma **linha nova** numa tabela de encerramento, com motivo e autor, terminal e com `UNIQUE` pela alça. O vínculo vigente é o que não tem encerramento. `UNIQUE (alça)` no vínculo impede que a mesma alça volte apontando para **outro** cliente, o que seria um vetor de vazamento. Reemitir exige alça nova. Se o ato de escopo tiver prazo, `valid_until NOT NULL` nasce na linha. Não sei se tem: é pergunta para `produto`.
4. **Não alargar o `CHECK` de `0011:104-105`.** Alargar é `DROP CONSTRAINT` mais `ADD`, e isso é proibido por `migrations.md` §4. Também não é necessário. A §7.5.1 só pergunta quem alcança `t_*`, e a credencial da borda não tem `USAGE` em nenhum `t_*`, então se ela aparecer ali a acusação está certa. O que ela precisa é de declaração para uma pergunta que ainda não existe: quem lê o `platform`. Proposta: tabela própria de declaração da borda, com a forma da `0011` (append-only, `declared_by`, `CHECK` próprio) e retratação própria. A `0014` não serve porque tem FK para `role_declarations(role_name)` (`0014:81-82`). A unicidade de nome entre as duas tabelas o `UNIQUE` não garante: o `verify` passa a acusar nome declarado nas duas. **Ordem:** esperar o recorte 2 de `T-0009` (`PAP-28`). O grupo intermediário que ele cogita (`T-0009:2351-2355`) pode pedir uma espécie nova também, e as duas espécies se desenham juntas, não uma de cada vez. Se o humano preferir tabela única, o caminho é expand/contract com lookup, e a etapa 4 é a remoção do `CHECK`, com aprovação dele.

FEITO: li a §2, a §3.2 e a §11 do documento de `D-03`, as migrations `0011` e `0014`, e as tabelas de uso da declaração em `db/universo-e-declaracao.md` §7.5.4, que diz como o `verify` consome o registro.
ARQUIVOS: nenhum escrito. Só leitura dos arquivos acima e de `tarefas/T-0009-fundacao-do-banco.md:2345-2360`.
DECISÕES: recomendo tabela separada para a declaração da borda em vez de alargar o `CHECK`. Custa uma verificação de nome entre as duas tabelas no `verify`, e em troca não remove nenhuma invariante.
RISCOS: alça derivada de contato é o jeito mais provável de o índice virar dado pessoal no `platform`, sem que ninguém perceba. Desenhar a espécie da borda antes do `PAP-28` provavelmente pede uma segunda migration de espécie.
PERGUNTAS:
  - para produto: a alça de escopo (pessoa nossa × cliente) tem prazo por regra, ou dura até ser encerrada?
VERIFICAÇÃO: não rodei nada, a resposta é leitura de DDL e de documentos.
MEMÓRIA SUGERIDA:
  - type=decision escopo=plataforma slug=decision-credencial-da-borda-fora-de-role-declarations — a espécie da borda não alarga o CHECK da 0011; ganha tabela própria de declaração e retratação
PRÓXIMO PASSO SUGERIDO: arquiteto-dados — desenhar o índice, o encerramento e a declaração da borda depois do recorte 2 de `T-0009`, com o gate de `seguranca`.

## seguranca — 2026-09-23 (B.3, gate do desenho)

## RELATÓRIO — seguranca — T-0015 (passo B.3)
STATUS: OK

Resposta curta: o desenho **não passa limpo**. Há um `ALTO` aberto (`IDN-01`). Ele é comum às opções A, B e C e não muda a escolha: C passa, e a recusa de B procede.

FEITO:
- Auditei o B.2 com foco em C e na recusa de B. Li contra o B.1, a ficha inteira, o A.2a de `T-0014`, a decisão de `T-0019:85` e o código de borda real (`principal.ts`, `context.ts`, `tenant-role.ts`, `pool.ts`, `server.ts`, `border-facts.ts`, `0011`).
- Respondi as cinco perguntas da §1 e a §2 da regra para C e para B, além de todas as perguntas do B.1, do B.2 e do A.2a.
- Medi em banco descartável três coisas: o custo do caminho r2 contra o r1, a enxurrada com o hash dentro da transação e a mesma enxurrada com o hash fora.
- Registrei oito achados, `IDN-01` a `IDN-08`: 1 `ALTO`, 5 `MÉDIO` e 2 `BAIXO`.

**Um cliente vê dado de outro?** Sim, por um caminho, o `IDN-01`. Dentro de C, fora desse caminho, não achei nenhum no desenho.

Achados:
- **IDN-01 [ALTO]: o dispositivo atravessa clientes.**
  - A loja é vendida junto com o terminal. O encerramento só **revoga** a habilitação (`nucleo-estabelecimento.md:224`), e o terminal estava offline, com a fila de X ainda por subir.
  - O `manager` de Y habilita o mesmo aparelho (linha 40). O aceite (5) de `RN-NUC-061` não recusa, porque não há mais habilitação vigente.
  - Na drenagem, o registro do terminal (B.2 `:77-79`) resolve o cliente como Y. Ou as vendas de X são gravadas em `t_y`, e isso é vazamento; ou se perdem, contra `RN-OFF-016`.
  - Correção: uma cláusula no `decision`. O portador do terminal é emitido por habilitação em um cliente e nunca é revinculado. O cliente de um fato é o do portador que o produziu. E precondição nova em `RN-NUC-060`/`061`.
- **IDN-02 [MÉDIO]: a entrada anônima confere a prova dentro da transação, no pool do caixa.**
  - Medido: 40 entradas contra uma única alça levaram a leitura de outro cliente de p50 1,24 ms para 1.280 ms.
  - Com o hash fora da transação, a mesma leitura ficou em p50 1,8 ms.
  - Pedido: pool e concorrência próprios para a entrada. O limite de taxa vai pelo texto apresentado e pela origem, com atraso progressivo e sem trancar por alça.
- **IDN-03 [MÉDIO]: pagar o custo do verificador não deixa r1 e r2 iguais no tempo.**
  - Medido: com o fato de recusa gravado antes da resposta, r2 custa p50 4,1 ms a mais só em banco. O p10 dele fica acima do p90 do caminho sem fato.
  - Pedido: piso fixo de tempo na resposta, o fato gravado fora do caminho da resposta, e o mesmo limitador e o mesmo pool para as duas classes.
- **IDN-04 [MÉDIO]: a borda de `apps/api` lê a população nossa** (B.2 `:101`, `:95`). Isso contraria `T-0019:85`, que fez do console outra aplicação. Quem comprometer o processo do caixa leva o verificador de `provider_operator`.
- **IDN-05 [MÉDIO]: alça de escopo sem limite.** Pode haver várias vigentes por pessoa, sem vínculo à sessão dela. A aba antiga escreve no cliente errado, que é o aceite de `RN-PRV-004` falhando. Hoje não é explorável, porque o (d) recusa todo ato nosso.
- **IDN-06 [BAIXO]: primeiro `owner` por convite.** Um contato digitado errado por nós faz um desconhecido virar dono, sem recuperação.
- **IDN-07 [MÉDIO]: terminal furtado habilita outro terminal.** Com a prova do `manager` e sem segundo fator (linha 40), o novo terminal sobrevive à revogação do furtado.
- **IDN-08 [BAIXO]: duas credenciais por pessoa (B.2 §2.5) convidam a dois sujeitos.** O `A:` passa a mostrar duas pessoas onde houve uma (`RN-NUC-066`).

Respostas às perguntas do brief:
- **Constante no tempo:** não basta como está; ver `IDN-03`.
- **Campos da recusa r2:**
  - carrega: instante, sujeito local alvo, qual fator falhou, classe da superfície, id da requisição;
  - não carrega: a prova nem nada derivado dela, a alça digitada, o endereço de rede cru, contagem embutida;
  - a falha do segundo fator avisa a própria pessoa, porque é o sinal de que o primeiro fator vazou.
- **Credencial própria da borda:** aceitável e melhor que papel assumido. `SET ROLE` confere a filiação do usuário de sessão (`papeis-e-credencial.md:266`), então papel assumido poria o `platform` na classe do `PAP-04`. Quatro condições estão na §3.3 do relatório. Contra o comprometimento do processo ela não protege nada, porque os dois segredos moram no mesmo processo.
- **Enxurrada:** confirmada e medida; ver `IDN-02`.
- **`manager` no terminal habilitado:** o terminal habilitado basta, com duas condições (credencial que não sai do acompanhante; canal local autenticado) e uma exceção: linhas 40 e 21 exigem segundo fator (`IDN-07`).
- **Recusa fora do terminal:** mesma forma da r2 e mesma resposta ao chamador.
- **`RN-NUC-066`:** contornada na trilha, não na capacidade. C permite, como A e B dentro de um cliente (`IDN-08`).
- **`RN-NUC-060`:** abre travessia lateral pelo aparelho físico (`IDN-01`).

ARQUIVOS:
- `/home/mcastro/work/freelas/forja/docs/auditorias/2026-09-23-d-03-decisao.md` (novo, 399 linhas).
- Todo o resto foi só leitura. Não escrevi na ficha, conforme o brief.

NÃO FEITO: —

DECISÕES:
- Classifiquei `IDN-01` como `ALTO`, e não `CRÍTICO`. Implementado como o texto sugere, vazaria entre clientes, mas é lacuna de desenho sem código, e fecha com uma cláusula.
- `IDN-02` ficou em `MÉDIO`: quando a borda satura, o terminal cai para offline e a venda em espécie continua. Para em todos os clientes o que é recusa sem contato: cartão, cancelamento, publicação.

RISCOS:
- `IDN-05` volta a valer no dia em que a entrada do ato de resolução for decidida (pergunta já aberta a `produto`).
- Os números das medidas são de máquina local. Em produção, com rede entre aplicação e banco, a diferença entre r1 e r2 aumenta.

PERGUNTAS:
- para produto: aceitar a precondição de `IDN-01` em `RN-NUC-060`/`061`: aparelho que já foi de outro cliente só é habilitado depois de drenar ou de ter a fila declarada na origem, e o que ele retém é tratado como comprometido?
- para humano: o fato r2 carrega um pseudônimo da origem por cliente, ou nada sobre a origem? O padrão é nada.

VERIFICAÇÃO:
- Medi em PostgreSQL 16.15 descartável (`forja-s15-pg`, porta 55560), com `pg` 8.23.0 e protocolo estendido:
  - M1, 3.000 amostras por caminho;
  - M2 e M3, com pool `max: 4` e 40 concorrentes.
- O custo do hash **não foi medido**: entrou como atraso simulado de 100 ms. Por isso "a diferença de 4 ms se separa do ruído do hash" está marcada como inferência no relatório.
- Removi o container e conferi que não sobrou nenhum `forja-s15-*`. Não toquei na 5432.
- Conferi contra o disco cada `path:linha` citado.

MEMÓRIA SUGERIDA:
- type=gotcha escopo=plataforma slug=gotcha-portador-de-terminal-revinculado-leva-a-fila-para-outro-cliente — encerrar revoga e não descomissiona; o aparelho vendido é habilitado em Y, e a fila de X sobe resolvida pelo registro atual.
- type=gotcha escopo=plataforma slug=gotcha-resposta-constante-nao-e-hash-igual — o fato de recusa no caminho da resposta custa ~4 ms medidos, e o pool sob carga só espera no caminho que existe; o que iguala é piso fixo de tempo.

PRÓXIMO PASSO SUGERIDO: thread — escrever o `decision` de C com três cláusulas: portador do terminal por habilitação e imutável (`IDN-01`), credenciais do mesmo sujeito (`IDN-08`), população nossa lida só pelo console (`IDN-04`). Em seguida, despachar `produto` para `RN-NUC-060`/`061`. Os outros achados viram requisito escrito da implementação da Fase 2 e de `F-021`.

## thread — 2026-09-23 (entrada do ato de resolução, pós-fechamento)

A proposta do `produto` (relatório da passada de manutenção, em `T-0014`) está **aceita como direção**. A
entrada do ato que resolve o cliente-alvo para a pessoa nossa é sempre um objeto de origem já vinculado a
um cliente por autoridade que não é a nossa: pedido aberto pelo cliente, fato nosso que nomeia o cliente
pelo registro do `platform`, ou o ato que cria o cliente. Nunca lista, busca, identificador digitado nem
"último cliente". A regra entra em `RN-PRV-004` (d) com consulta de `seguranca` sobre o risco declarado (a
fila é enumeração parcial da carteira) e sobre `IDN-05`.

## produto — 2026-09-23 (aplicação das cláusulas do gate)

## RELATÓRIO — produto — T-0015 (aplicação do gate de D-03)
STATUS: OK

FEITO:
- **IDN-01, em `RN-NUC-061`.** A habilitação é emitida para um estabelecimento, logo para um cliente, e nunca é revinculada. O estabelecimento e o cliente de um fato são os da habilitação sob a qual ele nasceu, nunca os do registro do terminal no momento em que o fato sobe (enunciado, `nucleo-estabelecimento.md:288-302`).
- Parágrafo novo, **aparelho com passado em outro cliente** (`:304-309`):
  - só é habilitado depois de a fila de origem estar drenada ou declarada (`RN-OFF-016`);
  - a drenagem não exige que a habilitação antiga esteja vigente (`RN-NUC-059` infeliz (a));
  - o que o aparelho retém é tratado como comprometido na origem, com os efeitos de `RN-OFF-016` infeliz, e o conjunto de identificação dos operadores também (`RN-OFF-033` d);
  - a recusa no destino não nomeia a origem, e o fato na origem não nomeia o destino.
- Aceites novos em `RN-NUC-061`: (7) é o caso da loja vendida com o terminal, (8) é o negativo (nenhum fato vai para cliente ou unidade diferente dos da habilitação), (9) é o segundo fator (`:331-337`).
- Infelizes novos em `RN-NUC-061`: (b) aparelho apagado antes de drenar, (c) drenagem que falha, (d) segundo fator perdido (`:339-344`).
- Registra / Não registra atualizados em `RN-NUC-061` (`:345-348`). A régua de edição está em `:321-324`.
- **`RN-NUC-060`**: uma frase nova no enunciado (o aparelho não leva nada, `:263-264`), remissão no aceite, e o parágrafo do gate trocado de "confirmação pendente" para "respondido: abria pelo aparelho" (`:282-285`). `LACUNA-NUC-043` §4 foi atualizada (`:385-386`). Referências ganharam a auditoria e `RN-OFF-033`.
- **IDN-07, na matriz.** Nota ²⁰ nova nas linhas 21 e 40 (`matriz-operacao-papel.md:156-160`): as duas exigem segundo fator de quem pratica, inclusive em terminal habilitado. Esse fator nunca é algo que o terminal retém, e a recusa sem ele é fato.
  - **Efeito na célula:** nenhum valor mudou. A coluna offline já era `recusa`, e segundo fator só se confere com contato.
  - O aviso "Fronteira de D-03, ABERTA" no topo virou "fechada em 2026-09-23" (`:30-32`).
- **IDN-08: não escrevi.** O lugar certo é `RN-NUC-066`, em `papeis-e-permissoes.md:173-180`, que já define "mesmo sujeito" e remete a `D-03`. `nucleo-estabelecimento.md` trata da unidade, não do sujeito, e a matriz só lê `A:` por `RN-NUC-066` (nota ¹⁷). O texto pronto está em PERGUNTAS.

ARQUIVOS:
- `/home/mcastro/work/freelas/forja/docs/produto/nucleo-estabelecimento.md` (editado)
- `/home/mcastro/work/freelas/forja/docs/produto/matriz-operacao-papel.md` (editado)
- só leitura: `/home/mcastro/work/freelas/forja/docs/auditorias/2026-09-23-d-03-decisao.md`, o `decision` e o `gotcha` de D-03, a ficha T-0015, `RN-OFF-016`, `RN-OFF-033`, `RN-NUC-066` e a §3 de `identidade-necessidade-e-fronteira-2026-09-23.md`.

NÃO FEITO: —

DECISÕES:
- **Nenhum `RN-NUC-095`…`099` foi consumido.** As três cláusulas couberam nas regras donas, e criar RN nova para a não revinculação separaria a precondição da operação que ela condiciona.
- **Adotei só metade da correção de IDN-07: o registro de origem.** A habilitação agora registra de que terminal foi pedida, porque é captura e custa pouco. A cascata ("comprometer o terminal de origem revoga o que ele habilitou") não entrou, porque tem custo operacional e o brief pedia só o segundo fator. Vai para o humano.
- **"Portador" não entrou no texto de produto.** Não é termo do glossário, então a regra fala de **habilitação**. O portador é o mecanismo que a carrega, do eixo E2.
- **Infeliz (b) de `RN-NUC-061`: aparelho apagado antes de drenar é perda de X** (declarada pela linha 34) e aparelho novo para Y. Não prometi que o produto detecta o passado de um aparelho apagado.

RISCOS:
- **Os dois arquivos estão no teto de 400 linhas:** `nucleo-estabelecimento.md` termina na 399, a matriz na 400. A próxima edição em qualquer um deles pede partição antes.
- **Detectar "aparelho com passado".** Com o aparelho intacto, quem sabe é o próprio aparelho, porque retém a habilitação e a fila de X. Apagado, só um registro de aparelho entre clientes no `platform` saberia, e isso é chave de correlação entre schemas, o mesmo motivo da recusa de B. O invariante (8) continua de pé nos dois casos.
- **O fato de saída do aparelho na origem é causado por um ato no destino.** O caminho tem de levar nada de Y: pela drenagem sob a habilitação de X, ou por processo do `platform`. É de `backend` com `seguranca`.
- **Texto defasado.** 15 arquivos em `docs/produto/` ainda dizem "D-03 ABERTA", entre eles `matriz-operacao-papel-contrato.md:28`, `papeis-e-permissoes.md:30`, `fila-local-autoridade-e-identidade.md:25`, `superficie-por-papel.md:40` e `catalogo-de-capacidades.md:138`. Parte deles cita o eixo E2, que segue sem mecanismo escolhido e portanto ainda é verdade. Sugiro um item de varredura (P2).

PERGUNTAS:
- **para humano:** declarar comprometido o terminal de onde partiu uma habilitação revoga as habilitações que ele originou (segunda metade de IDN-07, `auditoria:356-357`)?
  - Recomendo **sim**. Custo: o terminal legítimo habilitado a partir do furtado precisa ser habilitado de novo, com contato e segundo fator. Ganho: fecha o caso em que o segundo fator também vazou.
  - Enquanto você não decide: não revoga. A origem já é registrada, então dá para aplicar a regra depois sem reconstruir dados.
- **para o thread (quem edita `papeis-e-permissoes.md`):** acrescentar a `RN-NUC-066`, fechando a remissão a D-03, o texto abaixo.
  - **Enunciado:** "uma pessoa, um sujeito por cliente. Identificação retida, prova com contato e segundo fator são credenciais do mesmo sujeito, nunca de dois. Quem dá acesso declara que é pessoa nova, e o contato de convite, onde existe, é único no cliente. Não há verificação entre clientes."
  - **Aceite:** a mesma pessoa pede o cancelamento no terminal e tenta autorizá-lo pela prova de retaguarda → resolve o mesmo sujeito, `A:` não se satisfaz, e ela pratica pela célula do próprio papel. Segundo convite com o mesmo contato no mesmo cliente → recusado.
  - **Infeliz:** segundo sujeito criado com contato diferente → o produto não detecta; a declaração fica no fato de criação.
- **para o thread (quem edita `papeis-atribuicao-e-delegacao.md`):** `RN-NUC-021` ganha a cláusula da nota ²⁰ e o aceite: "`manager` com a prova certa, em terminal habilitado e sem segundo fator, concede delegação → recusado, e a recusa é fato".
- **para backend, com seguranca:** como o destino recusa um aparelho que tem fila de outro cliente, e como a origem registra a saída dele, sem chave de correlação entre schemas?

VERIFICAÇÃO: conferi por leitura a contagem de linhas dos dois arquivos, as citações `path:linha` da auditoria (`:192`, `:341`), `RN-OFF-033` (d) e `LACUNA-OFF-015`. Não há teste a rodar: é spec.

MEMÓRIA SUGERIDA:
- type=gotcha escopo=plataforma slug=gotcha-portador-de-terminal-revinculado-leva-a-fila-para-outro-cliente: atualizar o "Como aplicar" para apontar `RN-NUC-061` (aparelho com passado, aceite (7)) como a regra que aplica a cláusula.

PRÓXIMO PASSO SUGERIDO: thread: despachar as duas cláusulas pedidas (em `RN-NUC-066` e `RN-NUC-021`) a quem edita esses arquivos, e levar ao humano a pergunta da cascata.

## thread — 2026-09-23 (respostas ao produto)

- **Cascata de `IDN-07`: sim.** Declarar comprometido o terminal de onde partiu uma habilitação revoga as
  habilitações que ele originou. Custo aceito: o terminal legítimo habilitado a partir do furtado é
  habilitado de novo, com contato e segundo fator. A origem já é registrada.
- As cláusulas de `IDN-08` em `RN-NUC-066` e de `RN-NUC-021` (texto pronto no relatório acima) vão na
  próxima passada de `produto` sobre `papeis-*.md`.

## produto — 2026-09-23 (RN-PRV-004 (d), contagens, lacunas de F-017)

## RELATÓRIO — produto — T-0015 (pós-fechamento: entrada do ato de resolução, contagens, lacunas de F-017)
STATUS: OK

FEITO:
- **`RN-PRV-004` (d) reescrita** em `operacao-do-provedor.md:212-222`. A entrada do ato de resolução é um objeto já vinculado a um cliente por autoridade que não é a nossa, em lista fechada de três: (d1) pedido aberto no ambiente do cliente por sujeito dele autenticado, incluída a concessão de `RN-NUC-024` quando `LACUNA-NUC-009` lhe der célula; (d2) fato nosso que nomeia o cliente pelo registro do `platform` (`RN-PRV-013`); (d3) o ato que cria o cliente (`RN-NUC-090`).
  - Mecânica: a referência opaca só resolve com o objeto aberto e na fila atribuída à pessoa, e ela vê a fila, nunca a carteira.
  - Recusados: lista ou busca, identificador digitado, "último cliente".
  - Limite de `IDN-05`: um escopo vigente por pessoa nossa, em qualquer número de sessões; resolver o segundo encerra o primeiro; o escopo só vale junto da pessoa autenticada que o resolveu.
  - Correção datada (o quê, por quê, contra o quê) com o texto anterior resumido e o risco declarado, em `:226-229`.
- **Aceite de (d)** em `:253-257`: a referência de A na fila resolve A. Objeto encerrado, fora da fila, inventado ou de B dá recusa sem revelar existência. Resolver B encerra A, e a aba de A é recusada. Hoje tudo termina em recusa (`RN-PRV-015` e falta de implementação). **Infeliz de (d)** em `:273-275`: o cliente só telefona. Isso substitui a frase "é `D-03`, do humano".
- **`operacao-do-provedor-autorizacao.md`:**
  - `:124` passou a 15 linhas, 7 de ato, citando `A7`.
  - `:60-62`: a terceira trava agora diz "regra existe, implementação não".
  - §3 `:130-138`: `D-03` fechada, com os dois pontos para `seguranca` (fila como enumeração parcial; `IDN-05` como requisito da Fase 2).
- **`F-010:43`**: 15 linhas, com a nota de que só a contagem mudou.
- **`F-017`**: `LACUNA-IDE-005` fechada → `RN-NUC-091` (`:39-41`), e `LACUNA-IDE-002` fechada → `RN-NUC-090` (`:50-53`), as duas datadas.
- Fora da lista do brief, mas dentro de `operacao-do-provedor*.md`: nota "Respondida em 2026-09-23" sob o título de `operacao-do-provedor-alcance.md` §2.3, que ainda dizia "pergunta que continua sendo do humano".

ARQUIVOS:
- `/home/mcastro/work/freelas/forja/docs/produto/operacao-do-provedor.md` (editado, 400 linhas)
- `/home/mcastro/work/freelas/forja/docs/produto/operacao-do-provedor-autorizacao.md` (editado, 138)
- `/home/mcastro/work/freelas/forja/docs/produto/operacao-do-provedor-alcance.md` (editado, 379)
- `/home/mcastro/work/freelas/forja/docs/backlog/F-010-provisionamento-que-falha-no-meio-vira-fato.md` (editado)
- `/home/mcastro/work/freelas/forja/docs/backlog/F-017-fechar-d-03-identidade-e-prova.md` (editado)

NÃO FEITO: —

DECISÕES:
- **"Reusar a referência dá recusa"**, da proposta, virou "referência de objeto **encerrado** dá recusa". A leitura "referência de uso único" impediria ir de A para B e voltar a A com o pedido de A ainda aberto. Voltar é resolução nova, e fica registrada por (c).
- **Um escopo vigente por pessoa, e não por sessão.** Segui o texto de `IDN-05` (`docs/auditorias/2026-09-23-d-03-decisao.md:316`), que fecha também o caso de duas sessões. O `decision` de C fala em "por sessão".
- **(d3) não tem referência a entregar**: o alvo é o cliente que o próprio ato cria. É o que torna `RN-NUC-090` coerente com (d) sem exceção.
- Não usei `RN-PRV-022`…`025`: coube como cláusula.
- A regra fixa o invariante (uma vigente, conferida contra a pessoa). A forma da alça e onde ela é conferida ficam com `backend`.

RISCOS:
- **`operacao-do-provedor.md` está em 400 linhas, no teto.** A próxima cláusula exige partir o arquivo.
- **Remissões que ainda dizem "(d), com `D-03` aberta"**, todas fora do meu território nesta passada:
  - `superficie-do-provedor.md:16` e `:245`;
  - `matriz-celulas-a-valorar.md:110`;
  - `fatos-de-operacao-provedor.md:84` e `:134`.
- **Memória:** `decision-d-03-opcao-c-sujeito-local-ao-cliente.md:41-42` diz "até a regra da entrada existir". Ela existe agora. Cabe ao orquestrador atualizar.
- **`F-017`** tem "Estado: a fazer" no cabeçalho, com `T-0015` fechada. O estado mora na ficha, então não mexi.
- **`F-010`** talvez precise enumerar o passo "atribuir o primeiro `owner`" (`RN-NUC-090`, infeliz a: convite não aceito é provisionamento incompleto) entre os passos de provisionamento. É mudança de escopo, não feita. P2.
- **`operacao-do-provedor.md:132`** ainda diz "`D-03` aberta", dentro da correção datada de 2026-08-23. É texto histórico, e deixei como está.

PERGUNTAS:
- para humano (ou `seguranca`, na consulta já pedida): **quem atribui um objeto de origem à fila de uma pessoa nossa?** Atribuição automática a todos faz a fila crescer até a carteira inteira, e isso anula a mitigação. Sem atribuição, a fila fica vazia e nada resolve, o que falha fechado. A regra funciona com qualquer das duas respostas, mas o tamanho do risco declarado depende dela.
- para `seguranca`: o risco declarado ("a fila é enumeração parcial da carteira") e o limite de `IDN-05` (por pessoa, em qualquer número de sessões) atendem a correção sugerida de `IDN-05`, inclusive o requisito de que a entrada não caia num cliente existente por erro de digitação? A conferência contra a fila atribuída é o "segundo dado independente".

VERIFICAÇÃO:
- Contei as linhas por busca depois das edições: 400, 138, 379, 110 e 138.
- Conferi em disco `A1`…`A7` e `R1`…`R8` em `matriz-celulas-a-valorar.md`, o que dá 15 = 8 + 7.
- Conferi a localização de `RN-NUC-090` (`papeis-atribuicao-e-delegacao.md:246`, §5) e de `RN-NUC-091` (`papeis-e-permissoes.md:327`, §5.1), e o texto de `IDN-05` (`:296-321`).
- Reli o trecho editado de `RN-PRV-004`.
- Não há código a rodar: o entregável é spec.

MEMÓRIA SUGERIDA:
- type=decision escopo=plataforma slug=decision-d-03-opcao-c-sujeito-local-ao-cliente (atualizar) — a entrada do ato de resolução existe em `RN-PRV-004` (d): três origens, fila atribuída, um escopo vigente por pessoa. A frase "continua recusando até a regra existir" sai.

PRÓXIMO PASSO SUGERIDO: `seguranca` — consulta sobre o risco da fila e sobre `IDN-05` contra `operacao-do-provedor.md:212-229`. Depois, `produto` — acertar as remissões listadas em RISCOS e partir `operacao-do-provedor.md` antes da próxima cláusula.

## thread — 2026-09-23 (quem atribui à fila)

Decidido pelo thread: o objeto de origem entra na fila de **uma** pessoa nossa por ato explícito de atribuição, feito por `provider_administrator` (ou pela regra de rodízio que ele publicar), registrado como fato. Nunca atribuição automática a todos, que faria a fila crescer até a carteira. Sem atribuição, nada resolve: falha fechado. Consulta de `seguranca` sobre a fila e `IDN-05` fica na fila de despacho, junto com as remissões listadas.

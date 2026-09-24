# Reauditoria: papel e ordem da trilha dos nossos atos, D-06(ii) (T-0019, F-019)

**Data:** 2026-09-23 · **Agent:** `seguranca` · **Somente leitura, de desenho, com medida em banco
descartável.** · **STATUS: OK**
**Escopo:** a revisão de `docs/arquitetura/d-06-trilha-residencia-2026-09-23.md` §5.3, §5.4, §5.6 e
§16, feita depois de `docs/auditorias/2026-09-23-d-06-trilha.md` (F.2). Premissa aceita pelo thread na
ficha `tarefas/T-0019-d-06-ii-residencia-da-trilha.md:217-219`: a leitura exige a projeção confirmada
em transação **anterior**.

**Numeração:** continua a do F.2. `TRL-07`, `TRL-08` e `TRL-09`, os três `MÉDIO`. `TRL-08` e `TRL-09`
nascem inertes: nenhuma célula de escrita e nenhum ator de `platform` existem hoje.

**Veredito do gate 2:** papel e ordem **passam**. `TRL-01` e `TRL-02` fecham nos cenários em que foram
registrados. Os três achados novos não pedem outro desenho: pedem uma pergunta de `verify` reescrita,
uma expressão de política e uma chave estrangeira. Entram na §16 como requisito escrito, junto de
`TRL-03` a `TRL-06`, e as migrations desta família não nascem sem eles. Duas frases da §5.3 mudam
(§4).

---

## 0. Método

Lidos: a revisão inteira (`:17-43`), §5.1 a §5.6 e §16; a ficha a partir do F.2; a gramática de
`db/migrator/RECUSAS.md:138-139` (view obriga `security_invoker`, função sem `SET`) e `:290`
(`SECURITY DEFINER` recusado); a pergunta invertida de `db/verificacao-do-papel.md:188-230`.

**Medido** em PostgreSQL 16.15, contêiner `forja-r19-pg`, porta 55551, removido ao fim. Réplica mínima:
executor não-superusuário dono de `platform`, `t_a` e `t_b`; `forja_app`, `app_t_a`, `app_t_b` e a
credencial do caixa como em `db/papel-do-cliente.md` §7.2-7.3; `forja_prv`, `prv_t_a`, `prv_t_b` e a
credencial do console como na tabela de `:229-237`; as políticas de `:242-259` com W = 30 s; gatilho de
rejeição por comando na projeção; no `platform`, autoridade, gravador com `INSERT` por coluna, ator com
`INSERT` só no registro de módulos. As medidas levam o rótulo `R1` a `R9`. **Não rodei o `verify` real
do executor**: as perguntas da §16.4 ainda não existem em código, e conferi cada uma pelo predicado que
o texto descreve.

## 1. Prioridade um: um cliente vê dado de outro?

**Não.** Nenhum caminho novo, nem pela sessão de cliente nem pela superfície nossa.

- **Sessão de cliente:** a credencial do caixa não assume `prv_t_X` (`M11`) e não grava na projeção
  (`M9`). O único jeito de ela ganhar `prv_t_X` é concessão fora do arranjo, e aí o que ela ganha é
  forjar entrada de acesso do provedor no **mesmo** cliente (`R7`, `TRL-07`), não ler outro.
- **Superfície nossa:** `prv_t_a` não tem `USAGE` em `t_b` (`M5`). A política grava a projeção
  **por OID**: com o nome sem qualificador e o `search_path` da criação, `pg_policies` mostra
  `t_a.provider_access` na política de `t_a.orders` e `t_b.provider_access` na de `t_b.orders`. Isso
  responde o "a medir" de `:635-636`. Se o `search_path` estivesse errado na criação, a política
  apontaria para a projeção de outro schema, sem `USAGE`, e falharia fechado.
- **Canais laterais:** a violação de chave estrangeira no `platform` não traz o valor da chave para o
  ator sem `SELECT` (`R8a`), igual à `23505` de `M10`. Cache, fila, log e exportação não mudam nesta
  revisão.

As cinco perguntas de `.claude/rules/seguranca.md` §1, só no que mudou desde o F.2:

1. **Consulta que alcança outro cliente:** não. Ver acima.
2. **Tenant da identidade ou do chamador:** na superfície nossa, o alvo continua vindo do pedido, por
   natureza. O que mudou é que o banco agora exige projeção no cliente lido (`M5`, `§5.3:213-216`).
3. **Tenant ausente com default:** não. Sem `forja.provider_fact`, `prv_t_X` lê 0 linha (`R1`).
4. **Id validado contra o tenant:** o id do fato citado vale só se a projeção dele estiver no schema
   lido (`M5`). No `platform`, o ato **não** é validado contra a intenção (`TRL-09`).
5. **Canais laterais:** nada novo.

## 2. As quatro perguntas do thread

### 2.1 A projeção confirmada antes, com `prv_t_X`, `forja_prv` e RLS restritiva, fecha `TRL-01`?

**Fecha**, nos três efeitos que o F.2 juntou.

| Efeito de `TRL-01` | Estado | Prova |
|---|---|---|
| leitura sem fato (D5) | o banco recusa | `R1`: 0 linha sem citar fato; `R2`: 2 linhas com a projeção confirmada antes |
| leitura em B sob fato de A (D6) | o banco recusa, e o erro deixa rastro | `M5` |
| console com o privilégio do caixa | fechado: o console não é membro de `app_t_X` | `:234`, `M12` |
| caixa gravando na projeção | fechado enquanto a projeção tiver só as três políticas | `M9`; a condição está em `TRL-07` (d) |

**A divergência do autor está certa, e a correção sugerida no F.2 estava errada.** Medi a forma do F.2
(`R3`): gravar a projeção e ler na mesma transação devolve as duas linhas ao cliente, e depois do
`ROLLBACK` sobra **0** projeção. A leitura aconteceu e nada ficou em `t_X`. A dedução de `:36-39` passa
a ser fato medido.

O que sobra depois do fechamento, fora os resíduos que o texto já declara em `:356-366`:

- a política não distingue **leitura de ato**: um fato de leitura destrava escrita (`TRL-08`);
- a pergunta de `verify` que deveria manter o mecanismo de pé não vê três formas de o abrir
  (`TRL-07`).

### 2.2 A ordem única, com o desfecho "aplicado" na transação do ato, fecha `TRL-02`?

**Fecha o cenário registrado.** Em `TRL-02` a queda entre passos, sem defeito nenhum, deixava A cobrado
sem nada na lista. Na ordem nova a projeção da intenção confirma **antes** do ato (`:180-186`), então
queda depois do ato deixa a intenção listada, e o desfecho "aplicado" some junto do ato ou existe junto
dele. Medi a troca de papel ator ↔ gravador dentro de uma transação no `platform`, que `:577` diz não
medida: funciona, os dois confirmam juntos (`R8c`), e o ator continua sem `SELECT` na autoridade.

**Não fecha por construção o caminho que pula a trilha**, e o texto diz que a conferência o pega
(`:198`). Não pega: sem a intenção e sem o desfecho, a conferência compara chaves de dois lados vazios
(`TRL-09`). É o mesmo defeito de `TRL-01`, agora no `platform`, e o thread já decidiu a classe dele: por
construção vence por verificação (`tarefas/T-0019-...md:141-143`). A correção é barata e foi medida.

### 2.3 O fail-open de `M14` é coberto pela pergunta de `verify` da §16 item 4?

**Só o caso medido.** O primeiro item de `:615-617` (todo membro de `forja_prv` com
`inherit_option = t`) recusa o `prv_t_c` de `M14`. O resto da família passa por todas as perguntas.

A causa do fail-open é a **herança**, e não a ACL que nomeia o papel. A política `TO forja_prv` vale
para quem tem os privilégios de `forja_prv`. Medido (`R4a`): `SELECT` concedido direto a `prv_t_a`, que
herda o grupo, lê **0** linha sem projeção. A frase de `:270-272` ("privilégio concedido direto [...]
escapa do grupo") atribui o efeito à causa errada. A segunda pergunta de `:618-619` só pega a concessão
direta de tabela a um `prv_t_X` que saiu do grupo, e deixa de ser necessária quando a primeira virar a
bijeção de `TRL-07`. As formas que abrem, todas medidas, estão em `TRL-07`.

### 2.4 A janela W de 30 s abre algum caminho?

**Nenhum entre clientes.** A projeção de `t_a` não destrava `t_b` (`M5`), e `received_at` não é
gravável (`M7`), então ninguém estica a janela com instante no futuro.

Dentro de um cliente, W é a janela em que os três resíduos atuam, e só um deles não estava escrito:

- **Reuso por outra sessão:** outra sessão do console cita o mesmo fato dentro de W e lê (`R9a`). Está
  declarado em `:362-364`, com fechamento só em `D-03` E1.
- **Leitura depois de W:** um cursor `WITH HOLD` aberto dentro de W entrega as linhas 31 s depois
  (`R9b`), e o comando novo depois de W lê 0. W limita o **início** de cada comando, e não o fim da
  leitura como diz `:220-221`. Não abre caminho: o fato, a classe e o cliente são os mesmos, e o cliente
  já vê o acesso. Só a frase muda.
- **Qualquer comando sob qualquer fato da classe:** dentro de W, um fato de leitura destrava `UPDATE`
  (`TRL-08`). Esse é o único caminho que W abre, e ele é da expressão da política, não do tamanho de W.

## 3. Achados

### TRL-07 — A pergunta de `verify` da §16.4 lê a ACL que nomeia o papel, e não o alcance efetivo de `prv_t_X`: quatro derivas de um comando abrem a leitura sem projeção ou a escrita do caixa na projeção, e passam por todas as perguntas — [MÉDIO]
ONDE: `docs/arquitetura/d-06-trilha-residencia-2026-09-23.md:615-621` (as três primeiras perguntas da
§16.4), `:242` (o comentário "em toda tabela de t_X em que forja_prv tem privilégio", que alcança a
própria projeção), `:268-272`; `db/verificacao-do-papel.md:219-225` (o ramo "membro" só olha
`app_t_X`).
CENÁRIO: medido. Um comando fora de migration, do dono ou de um ajuste manual, basta (concessão em (a) a (c), política a mais em (d)).
(a) e (b) abrem a leitura nossa sem projeção; (c) e (d) dão ao caixa escrita na projeção:
- (a) `REVOKE forja_prv FROM prv_t_a` seguido de `GRANT SELECT (id, total) ON t_a.orders TO prv_t_a`:
  lê **2** linhas sem fato (`R4b`). Não há membro sem herança, a `relacl` não nomeia `prv_t_a`, e
  `orders` tem RLS e política. As três perguntas passam.
- (b) Com `prv_t_a` herdando o grupo, `SELECT` por coluna a `prv_t_a` numa tabela **sem** célula e sem
  RLS: lê **2** linhas (`R4c`). A `relacl` não nomeia, a `attacl` nomeia, e a terceira pergunta não vê
  a tabela porque `forja_prv` não tem privilégio nela. Com `GRANT SELECT ... TO PUBLIC` na mesma tabela,
  mesmo resultado.
- (c) `GRANT prv_t_a TO <credencial do caixa>`: o caixa assume `prv_t_a` e grava na projeção uma
  "leitura do provedor" que não houve, visível ao `owner` (`R7`). É a terceira consequência de `TRL-01`
  de volta. A primeira pergunta olha membros de `forja_prv`, e `db/verificacao-do-papel.md:219-225` olha
  membros de `app_t_X`. Ninguém olha membros de `prv_t_X`.
- (d) A projeção recebendo também o par genérico de `:244-245`, como o comentário de `:242` manda ao pé
  da letra: o caixa passa a gravar nela (`R6`: recusado sem o par, aceito com ele). A pergunta de `:621`
  diz que a projeção "tem as três políticas", e não "só as três".
POR QUE É REAL: medido. O `verify` existe para acusar deriva, e esta é a mesma deriva que `TRL-04`
registrou para o `platform`: um comando, nada acusa. A lição de
[[gotcha-has-schema-privilege-nao-ve-set-role]] vale aqui de novo, na outra direção: quem pergunta pela
ACL que nomeia não vê o privilégio que chega por outro caminho.
CORREÇÃO SUGERIDA: a §16.4 pergunta pelo **alcance efetivo**, e não pela ACL. Três perguntas: (1) para
todo schema de cliente, existe `prv_t_X`, e ele é membro de `forja_prv` com `inherit_option = t` (a
bijeção, e não só "quem é membro é do formato certo"); (2) toda relação de `t_X` em que
`has_table_privilege(prv_t_X, …)` ou `has_any_column_privilege(prv_t_X, …)` dá verdadeiro tem RLS e a
política restritiva, e a projeção tem **exatamente** as três políticas; (3) os ramos "acl", "membro" e
"predefinido" de `db/verificacao-do-papel.md` §7.5.1 passam a cobrir `prv_t_X`, com a credencial do
console como único membro esperado. A segunda pergunta de `:618-619` pode sair. A frase de `:270-272`
passa a dizer que a causa é a herança. — dono: `arquiteto-dados`.

### TRL-08 — A política não distingue leitura de ato: dentro de W, um fato de leitura destrava escrita, e o cliente vê "leitura" onde houve mutação — [MÉDIO] · nasce inerte
ONDE: `docs/arquitetura/d-06-trilha-residencia-2026-09-23.md:246-250` (`FOR ALL`, com a mesma expressão
em `USING` e `WITH CHECK`, sem o tipo do fato), `:195` ("prv_t_X só lê **ou escreve** tabela do cliente
com projeção já confirmada, da classe daquela tabela").
CENÁRIO: medido. Com `UPDATE` em `t_a.orders` concedido a `forja_prv`, o console grava a projeção
`fact_type = 'read'`, `object_class = 'orders'`, confirma, e na transação seguinte roda
`UPDATE t_a.orders SET total = 999 WHERE id = 1`: `total` vira 999 (`R5`). A lista de A mostra uma
leitura. A mutação, com os campos alterados que `RN-PRV-012` exige, não aparece em lugar nenhum.
POR QUE É REAL: a expressão da política não tem o tipo do fato, e a projeção tem (`:163`). Hoje não
existe célula de escrita, então nasce inerte. Na primeira célula de escrita, toda leitura nossa naquela
classe vira, por 30 s, autorização de mutação, e leitura e mutação deixam de ser eixos independentes no
banco ([[decision-leitura-e-mutacao-sao-eixos-independentes]]).
CORREÇÃO SUGERIDA: uma política restritiva por comando no lugar de `FOR ALL`. `FOR SELECT` aceita fato
de leitura ou de ato. `INSERT`, `UPDATE` e `DELETE` aceitam só fato de ato. O `WITH CHECK` da projeção
restringe o tipo ao domínio fechado de lookup. A linha de `:195` passa a dizer que a escrita não foi
medida **e** que depende disso. — dono: `arquiteto-dados`.

### TRL-09 — O ato sobre objeto do `platform` não se prende à intenção: pular os passos 1, 2 e o desfecho deixa o cliente cobrado sem rastro, e a conferência não vê — [MÉDIO] · nasce inerte
ONDE: `docs/arquitetura/d-06-trilha-residencia-2026-09-23.md:198` ("2 antes de 3b: contrato [...] a
conferência acusa desfecho aplicado sem projeção da intenção"), `:237` (ator só com `INSERT` no registro
de módulos), `:308`, `:651-653` (a conferência lê só a chave da autoridade e da projeção), `:656-657`.
CENÁRIO: medido. Um caminho do console, com defeito ou nas mãos de quem tem a credencial, assume o ator
e grava direto no registro de módulos o módulo pago para A: `INSERT 0 1`, sem intenção na autoridade,
sem projeção em `t_a` e sem desfecho (`R8d`). A é cobrado. A conferência lê as chaves da autoridade e das
projeções, as duas sem o fato, e não acusa nada. O desfecho "aplicado" só confirma junto do ato se o
console o gravar: a atomicidade de `:185` vale para o que está na transação, e nada obriga o desfecho a
estar lá.
POR QUE É REAL: é o D5 de `TRL-01`, agora no `platform`. Para leitura o thread recusou o controle fora do
banco. Para ato no `platform` o texto voltou a apoiar a garantia na conferência, e a conferência não
lê o registro do objeto.
CORREÇÃO SUGERIDA: a linha do ato no objeto do `platform` carrega o id do fato de intenção e o cliente,
com chave estrangeira composta `NOT NULL` para a autoridade. Medido: sem a intenção, `23503` (`R8a`);
com a intenção de B num ato em A, `23503` (`R8b`); com a intenção certa, grava sem `SELECT` do ator na
autoridade (`R8c`), porque a checagem de chave estrangeira roda como dono. Com isso a ordem 1 → 3b
passa a ser do banco. A conferência passa a ler a chave `(id do fato, cliente)` da linha do ato como
prova de "aplicado", e a regra "intenção sem projeção é não-ocorrido" deixa de valer para intenção citada
por ato. A ordem 2 → 3b continua contrato, mas agora a conferência a vê. Entra no item 10 da §16, antes
de o ator nascer. — dono: `arquiteto-dados`, com `produto` para a forma do desfecho.

## 4. Notas sem achado

- **A condição 3 da conferência, que o F.2 escreveu, precisa de mais duas colunas.** Ler "só chave"
  deixa passar a autoridade dizendo uma classe e a projeção outra no mesmo id de fato: o cliente vê o
  que houve e a autoridade, que é o lado que sobrevive à saída, mente sem ninguém acusar. Classe e tipo
  do fato são código de lookup, não conteúdo nem pessoa. O item 8 da §16 (`:651-652`) passa a comparar
  `(fact_id, tenant_id, object_class, fact_type)`.
- **Duas frases da §5.3.** `:198` passa a dizer o que `TRL-09` pede. `:220-221` passa a dizer que W mede
  do registro da projeção ao **início** de cada comando (`R9b`).
- **View e função.** A gramática obriga `security_invoker` e recusa `SECURITY DEFINER`
  (`db/migrator/RECUSAS.md:138`, `:290`), então nenhuma view nem função de `t_X` contorna a política
  rodando como dono. Continua verdadeiro enquanto essas duas recusas valerem.
- **`received_at` da projeção.** O texto não diz o `DEFAULT`. Se for `now()`, o instante é o do começo da
  transação que grava, e uma transação longa só encurta W. Falha fechado de qualquer forma.

## 5. O que falta para as migrations desta família nascerem

1. `TRL-07`: as três perguntas por alcance efetivo, na §16.4.
2. `TRL-08`: política por comando e tipo de fato no domínio, na §16 junto da forma da política.
3. `TRL-09`: chave estrangeira composta da linha do ato para a intenção, e a conferência lendo essa
   chave, no item 10 e no item 8 da §16.
4. As duas frases da §5.3 e a de `:270-272`.

Nenhum dos quatro muda residência, papel ou ordem. O desenho de `:229-259` fica como está.

# F-003 — `apps/api` confere a própria credencial na subida, antes de aceitar requisição

**Tipo:** Comportamento fechado · **Estado:** em execução desde 2026-09-12 (ficha
`tarefas/T-0013-conferencia-da-credencial-na-subida.md`) · **Dono:** `backend` · **Território:** `apps/api/**`

> **Cresceu de novo, de seis para oito, entre 2026-09-12 e 2026-09-23**, e o item passou a dizer isso em
> 2026-09-23. Mudaram o `Objetivo`, a linha da recusa em `Escopo`, o `Critério de aceite` (sete casos
> viraram nove), as duas listas de `Registra / Não registra` e o `Gate obrigatório`.
>
> **Por quê:** a reauditoria mediu que um papel de cliente que este processo assume, com privilégio de
> objeto ou atributo sobre o schema de outro cliente, vazava pelo caminho normal de requisição com as
> seis respondendo `ok` (`SUB-05`,
> `docs/auditorias/2026-09-12-conferencia-da-credencial-na-subida-reauditoria.md:101`), e que as
> perguntas de alcance eram cegas para `platform` (`SUB-06`, `:160`). A terceira auditoria mediu o
> quinto mecanismo: objeto do dono dos schemas (regra, view, view materializada, chave estrangeira,
> rotina `SECURITY DEFINER`) que põe um cliente dentro de outro com as sete respondendo `ok` (`SUB-09`,
> `docs/auditorias/2026-09-23-conferencia-da-credencial-na-subida-terceira.md:95`). A sétima pergunta,
> `assumedReach`, fecha o primeiro; o universo passou a ser `t_*` mais `platform`; a oitava,
> `delegation`, fecha o terceiro (`apps/api/README.md:55-94`).
>
> **Contra o quê:** o texto de 2026-09-12, que dizia seis perguntas e sete casos. A cláusula continua a
> mesma, crescer a pergunta em vez de declarar o limite; o thread aceitou o crescimento em 2026-09-23
> (`tarefas/T-0013-conferencia-da-credencial-na-subida.md`, seção "thread — 2026-09-23 (validação da
> quarta rodada)"). A frase sobre o nome na recusa foi fixada na mesma seção: "o fato não carrega o
> nome do que a recusa encontrou; a recusa carrega, na saída de erro, com teto de cinco nomes".
>
> **A pergunta cresceu de quatro para seis em 2026-09-12**, depois do gate 3. Mudaram o `Objetivo`, a
> linha da recusa em `Escopo`, o `Critério de aceite` (cinco casos viraram sete) e as duas listas de
> `Registra / Não registra`.
>
> **Por quê:** a auditoria mediu dois vazamentos entre clientes que as quatro perguntas não veem.
> `SUB-01` — alcance por privilégio de objeto, que a pergunta sobre membros de papel não enxerga
> porque ela lê `pg_auth_members` e o privilégio mora em `nspacl`
> (`docs/auditorias/2026-09-12-conferencia-da-credencial-na-subida.md:78-112`). `SUB-02` — herança
> entre papéis de cliente, que uma linha concede e que entrega o cliente A ao cliente B **dentro do
> handle que a borda entrega à rota**, pelo caminho normal de requisição (`:114-148`).
>
> **Contra o quê:** o humano decidiu fechar **pela cláusula**, não pela frase — crescer a pergunta em
> vez de declarar o limite num parágrafo, porque declarar deixaria de pé um vazamento medido
> (`tarefas/T-0013-conferencia-da-credencial-na-subida.md:159-195`, seção
> `## backend (segunda rodada) — 2026-09-12`).
>
> O texto vencido fica riscado em vez de sumir: ele foi o recorte de verdade entre 2026-09-11 e
> 2026-09-12, e apagá-lo esconderia que a pergunta nasceu cega justamente para o mecanismo mais comum
> de conceder alcance — o `GRANT USAGE ON SCHEMA` que alguém digita ao ler `permission denied for
> schema` (`:83-99`).

## Objetivo

~~O servidor pergunta ao catálogo do Postgres, na subida e **antes de abrir a porta**, quatro coisas
sobre o papel que a própria conexão de fato é: ele existe, tem `LOGIN`, é membro de `forja_app`
**sem** `admin_option`, e nenhuma concessão dele é herdável.~~ ~~**Vencido em 2026-09-12:** são
**seis** perguntas, em dois grupos [...]. **O que a credencial alcança** — ela não alcança schema de
cliente nenhum sem assumir o papel dele, e nenhum papel de cliente que este processo consegue assumir
herda outro papel de cliente.~~ **Vencido em 2026-09-23:** são **oito** perguntas, em três grupos, no
catálogo do Postgres, na subida e **antes de abrir a porta**. **Quem a credencial é** (quatro) — o papel
existe, tem `LOGIN`, é membro de `forja_app` **sem** `admin_option`, e nenhuma concessão a ele é
herdável. **O que a credencial alcança** (três) — ela não alcança schema de cliente nem `platform` sem
assumir papel; nenhum papel de cliente que este processo assume herda outro papel de cliente; e nenhum
desses papéis alcança, por privilégio de objeto, por atributo ou por ser dono, schema que não seja o
dele. **O que um objeto do banco empresta** (uma) — nenhum objeto de schema protegido depende de objeto
de outro schema, e nenhuma rotina `SECURITY DEFINER` existe em schema protegido. Qualquer resposta
divergente impede o servidor de atender.

Hoje `apps/api` sobe confiando no que `FORJA_DATABASE_URL` aponta — `apps/api/src/config.ts:65` é a
única leitura desse parâmetro, e nada no servidor pergunta o que o papel resultante alcança. Do lado
do banco existe um estado medido e ainda aberto, o `PAP-13`
(`docs/auditorias/2026-09-11-gate-final-camada-de-papel.md:93-116`), em que a credencial da aplicação
alcança o schema de um cliente **sem assumir o papel dele**. Esse estado é invisível do lado do
servidor, e é do lado do servidor que a consulta sai.

O executor já faz a pergunta equivalente sobre o parâmetro dele, contra o catálogo, antes da primeira
escrita (`db/migrator/src/preconditions.ts:40-51`, `db/papel-do-cliente.md` §7.7). A postura que o
repositório estabeleceu ali é conferir o parâmetro antes de confiar nele; o servidor é o único dos
quatro parâmetros que nomeiam sujeito do mundo que ainda não a segue
(`docs/auditorias/2026-09-11-gate-final-camada-de-papel.md:243-257`).

## Escopo

- A pergunta de subida, uma consulta ao catálogo, sobre o papel da própria conexão — e, desde
  2026-09-12, sobre **o que esse papel alcança** e sobre **os papéis que ele consegue assumir**. O
  sujeito deixou de ser só a credencial; era esse o buraco dos dois achados.
- A recusa: o processo não passa a aceitar requisição, e a mensagem diz **qual** das ~~quatro~~
  ~~seis~~ **oito** perguntas falhou e qual ato humano fecha aquela falta.
- Desde 2026-09-23, o universo das perguntas de alcance é **`t_*` mais `platform`**: `platform` não é
  schema de cliente e guarda a carteira de clientes (`SUB-06`).
- Falha ao **perguntar** (catálogo inacessível, resposta vazia) é recusa, nunca passe livre.
- As duas listas do invariante 10 para o fato de subida.

## Fora de escopo

- **Conferência contínua ou periódica depois da subida.** O estado do banco pode mudar às três da
  manhã e a pergunta de subida não vê. Quem responde o estado vivo é o `verify` do executor
  (`db/verificacao-do-papel.md` §7.5.1), do outro lado da parede. Reabrir isso é item próprio, e a
  conta a pagar seria uma consulta de catálogo recorrente no processo que atende o caixa.
  **Conferido em 2026-09-12: continua fora, e a janela ficou maior, não menor.** Com seis perguntas, o
  conjunto de estados que a subida recusa cresceu — e cada estado a mais é um estado a mais que pode
  ser criado **depois** dela sem ninguém ver até o próximo reinício. O `GRANT USAGE ON SCHEMA t_acme`
  esquecido de madrugada agora impede a **próxima** subida e não incomoda o processo que já está de
  pé. O dono nomeado continua certo (`arquiteto-dados`, pelo `verify`), e uma coisa mudou de peso: a
  correção primária do `SUB-02` mora lá, e ninguém rodou o `verify` contra esse estado — a doc da
  §7.5.1 enumera a via `membro`, que cobriria a linha, e isso é leitura, não medição
  (`tarefas/T-0013-conferencia-da-credencial-na-subida.md:279-281`). Continua sem item.
- **Concessão entre papéis de cliente que dá só `SET`, sem herança.** Medido: a transação que assume
  um papel de cliente leva `42501` no schema do outro, e só alcança quem assumir o **segundo** papel na
  mesma transação — coisa que a borda não faz, porque ela forma um papel por transação. Quem cobre a
  linha é a pergunta invertida do `verify` (`db/verificacao-do-papel.md` §7.5.1). Prova:
  `tarefas/T-0013-conferencia-da-credencial-na-subida.md:187-195`.
- **Corrigir `PAP-13`, `PAP-14`, `PAP-15` e `PAP-16`.** São do executor, dono `arquiteto-dados`, e
  seguram o fechamento de `T-0009` (`docs/auditorias/2026-09-11-gate-final-camada-de-papel.md:342-361`).
  Este item não conserta nenhum deles: ele faz o servidor **enxergar** o desfecho deles.
- **Prova de identidade do operador humano** — `D-03` ABERTA, e não toca este item: a pergunta aqui é
  sobre o papel de banco da conexão, não sobre quem é o usuário.
- **Destino durável do fato de subida** — `D-06` ABERTA. O fato sai pela mesma porta que os fatos de
  borda já saem (`apps/api/src/observability/border-facts.ts:36-40`), que não é trilha e não prova nada.

## Critério de aceite

Os ~~cinco~~ ~~sete~~ **nove** casos, com o arranjo de `db/papel-do-cliente.md` §7.2 montado. Os cinco
primeiros são os de 2026-09-11 e valem inteiros; **6 e 7 entraram em 2026-09-12**, um por achado do
gate 3, e os dois são estados que o servidor **subia servindo** antes:

1. **Credencial correta** (`LOGIN`, membro de `forja_app`, concessões não-herdáveis): o servidor sobe,
   `/health` responde, e o teste de dois clientes na **mesma conexão física** continua passando
   (`docs/auditorias/2026-09-11-gate-final-camada-de-papel.md:63`). Nenhuma consulta nova aparece no
   caminho de requisição.
2. **`FORJA_DATABASE_URL` apontando para o executor.** Hoje o servidor sobe e a falha só aparece na
   primeira transação de tenant, como `42501 permission denied to set role` (medido, `:58`). Depois: o
   processo **não sobe**, e a mensagem nomeia a pergunta que falhou — o executor é membro do grupo
   **com** `admin_option`.
3. **`FORJA_DATABASE_URL` apontando para superusuário.** Hoje sobe e funciona, contido dentro da
   transação (medido, `:59`). Depois: **não sobe**. É a mudança de comportamento que o item compra, e
   ela quebra de propósito quem aponta para `postgres` na máquina de desenvolvimento.
4. **Credencial correta, com uma concessão herdável de papel de cliente a ela** — o estado do `PAP-13`.
   O processo não sobe e nomeia a concessão herdável. Hoje ele sobe, serve, e nada do lado do servidor
   acusa.
5. **Banco de pé sem o ato do operador** (o grupo não existe): não sobe, e a mensagem manda rodar
   `db/papel-do-cliente.md` §7.2 inteira, não a linha que falta.
6. **Privilégio de objeto concedido direto à credencial, ou a `PUBLIC`, em qualquer schema de
   cliente** — o estado do `SUB-01`, e o mecanismo é o `GRANT USAGE ON SCHEMA` que alguém digita ao
   ler `permission denied for schema`. O processo **não sobe**. Vale para as duas variantes, inclusive
   a que concede a `PUBLIC` e não nomeia beneficiário nenhum. Antes: o servidor subia, emitia o fato
   **verificado**, e a credencial **nua, sem assumir papel nenhum**, lia a venda do cliente (medido,
   `docs/auditorias/2026-09-12-conferencia-da-credencial-na-subida.md:83-107`).
7. **Um papel de cliente herdando outro papel de cliente**, concedido por quem administra papéis — o
   estado do `SUB-02`. O processo **não sobe**, e a recusa nomeia o papel que herda e quem concedeu.
   Antes: o servidor subia verificado e o cliente `acme` lia a venda do cliente `globex` pelo
   **caminho normal da borda**, dentro da transação que assume o papel de `acme` — sem erro nosso e
   sem tocar no código (medido, `:120-143`).

**8 e 9 entraram em 2026-09-23**, pela mesma régua: estados em que o servidor subia `verified`.

8. **Um papel de cliente que este processo assume alcança o schema de outro cliente sem herdar papel
   nenhum**: `GRANT USAGE ON SCHEMA t_<b> TO app_t_<a>`, o erro de digitação da §7.3 com o mesmo slug em
   duas linhas; ou `ALTER ROLE app_t_<a> SUPERUSER`; ou `ALTER SCHEMA t_<b> OWNER TO app_t_<a>`; ou
   `USAGE` em `platform` para esse papel. O processo **não sobe**, e a recusa de atributo vem antes da de
   privilégio, porque o `REVOKE` não muda nada enquanto o papel for superusuário. Antes: as seis
   respondiam `ok` e `acme` lia `globex` dentro da transação da borda (`SUB-05`, `SUB-06`).
9. **Objeto do dono dos schemas que atravessa cliente**: uma view, regra de reescrita, view
   materializada ou chave estrangeira em `t_acme` sobre objeto de `t_globex` ou de qualquer schema de
   fora, e qualquer rotina `SECURITY DEFINER` em schema protegido. O processo **não sobe**, e a recusa
   nomeia o objeto e os dois schemas. Antes: as sete respondiam `ok`, e a venda de `acme` gravava em
   `t_globex` (`SUB-09`, medido pelo autor em 2026-09-23 na ficha, quarta rodada).

Um invariante que atravessa os ~~cinco~~ ~~sete~~ **nove**: **não existe chave de ambiente que desliga a
conferência.** Ambiente sem o arranjo não sobe servidor. Chave de escape é o mecanismo pelo qual esta pergunta deixa
de ser feita exatamente onde ela importa.

## Registra / Não registra

**Registra:**

- **Uma linha por subida**, com o papel a que a conexão pertence de fato e o veredito das ~~quatro~~
  ~~seis~~ **oito** perguntas, cada uma `ok`, `refused` ou `unanswered`. Uma por processo, nunca por requisição. Responde "sob que papel este servidor
  esteve rodando naquele dia", que não tem backfill: processo encerrado não deixa rastro nenhum hoje.
  Desde 2026-09-12 responde também **o que aquele papel alcançava**, que é a metade que faltava: o
  fato antigo dizia `verificado` em dois estados que vazavam cliente.
- **A recusa de subida**, com qual das ~~quatro~~ ~~seis~~ **oito** perguntas falhou. Servidor que não sobe não
  gera fato de borda nenhum, então sem este registro a janela em que ele não existiu é silêncio
  completo — e é a primeira coisa que alguém procura quando o terminal diz que o sistema não abre.

**Não registra, e por quê:**

- **Qualquer parte de `FORJA_DATABASE_URL`** além do nome do papel que o catálogo devolveu: senha,
  host, porta, banco. Segredo nunca (`00-nucleo.md` §8), e o nome do papel é o que responde à pergunta.
- **Inventário de papéis do cluster** — quem mais é membro de `forja_app`, quem mais alcança schema de
  cliente. Essa pergunta é do `verify`. Um servidor que a responde carrega um mapa do arranjo de
  isolamento que ele não usa, e que, vazado numa mensagem de erro, descreve o próprio isolamento.
  **Continua valendo com oito perguntas, e a fronteira é o sujeito:** as novas perguntam sobre
  **este** processo — o que esta credencial alcança, o que herdam e alcançam os papéis que ela consegue
  assumir, e o que os objetos que eles usam emprestam. Nunca quem mais no cluster alcança o mesmo.
- **O nome do que a recusa encontrou** — o schema alcançado, o papel que herda, quem concedeu, o objeto
  que atravessa. **O fato não carrega o nome do que a recusa encontrou; a recusa carrega, na saída de
  erro, com teto de cinco nomes.** O fato de subida leva o veredito das oito perguntas e para aí.
  O fato não carrega porque ele é a linha que sobrevive ao processo e vai parar onde `D-06` decidir —
  um destino com leitores que não são os do banco. Papel de cliente se chama `app_t_<slug>` e o slug é
  o nome do cliente: fato com essa lista vira censo de clientes do cluster em qualquer lugar que ele
  seja agregado. A recusa carrega porque ela sai por `stderr` na subida, para quem já controla o
  processo e, por consequência, a própria `FORJA_DATABASE_URL` — quem lê aquela saída já pode
  perguntar ao catálogo o que quiser. E o ganho de nomear foi **medido**, não suposto: sem o
  concedente, o `REVOKE` óbvio apaga a linha legítima e deixa a herdável de pé, o que **piora** o
  estado (`Q5` do gate anterior, citado em
  `docs/auditorias/2026-09-12-conferencia-da-credencial-na-subida.md:200-210`). O teto de cinco nomes
  é o que impede a recusa de virar o censo que o fato não pode ser.
- **Nada por requisição.** A conferência é de subida. Repeti-la a cada requisição põe consulta de
  catálogo no caminho do caixa, e o terceiro limite do invariante 10 não admite captura que compete com
  a venda.

## Depende de

- **Nenhuma decisão em aberto.** `D-03` não toca o item (ver Fora de escopo).
- **O nome do grupo não existe hoje na configuração de `apps/api`** — conferido: `apps/api/src/config.ts:65`
  é a única leitura de ambiente ligada ao banco. De onde ele vem (chave de ambiente nova, ou constante
  compartilhada com a que o executor já usa) é decisão de `backend`, declarada no relatório.
- **O arranjo de `db/papel-do-cliente.md` §7.2 aplicado no banco de teste**, para a suíte conseguir
  subir o servidor. A suíte de `apps/api` já roda contra banco com poder de criar papel
  (`docs/auditorias/2026-09-11-gate-final-camada-de-papel.md:36`), então montar o arranjo está ao
  alcance dela. Como ela monta é de `backend`; o que não existe é chave que desligue a pergunta.

## Gate obrigatório

**`seguranca`.** Não é rota nova, e o gate 3 do `CLAUDE.md` §4 se aplica pelo que ele protege — escopo
de tenant e a credencial que o sustenta.

~~**`performance` não se aplica:** uma consulta por processo, fora do caminho de requisição.~~ **Desde
2026-09-23, `performance` entra, e pelo custo de subida, não de requisição.** A oitava pergunta lê o
catálogo de dependências do banco inteiro, e o autor mediu 330 ms dela com 602 schemas de onze tabelas;
pela ESTIMATIVA dele, com 1 000 clientes desse porte a subida passa de 1 s
(`tarefas/T-0013-conferencia-da-credencial-na-subida.md`, backend quarta rodada, RISCOS). A medida está
pedida pelo thread na mesma ficha. No dia em que a consulta entrar no caminho de requisição, o item
virou outro.

## Referências

`docs/auditorias/2026-09-11-gate-final-camada-de-papel.md:243-257` (a recomendação, e a tabela dos
quatro parâmetros com o desfecho medido de cada um) · `:93-116` (`PAP-13`) · `:58-59` (`Q10` e `Q11`) ·
`:63` (`Q15`) · `db/migrator/src/preconditions.ts:40-51` (a pergunta equivalente, do lado do executor) ·
`db/papel-do-cliente.md` §7.2 e §7.7 · `.claude/rules/backend.md` §1 ·
`apps/api/src/db/tenant-role.ts:56` · `apps/api/src/config.ts:65`

**Da revisão de 2026-09-12** (o crescimento de quatro para seis):
`docs/auditorias/2026-09-12-conferencia-da-credencial-na-subida.md:78-112` (`SUB-01`) · `:114-148`
(`SUB-02`) · `:200-210` (a medida que sustenta a recusa nomear, e o teto de cinco nomes) ·
`tarefas/T-0013-conferencia-da-credencial-na-subida.md:159-195` (a decisão pela cláusula, e o que
ficou declarado fora com medida) · `:279-281` (o `verify` não rodado contra o estado do `SUB-02`)

**Da revisão de 2026-09-23** (o crescimento de seis para oito):
`docs/auditorias/2026-09-12-conferencia-da-credencial-na-subida-reauditoria.md:101` (`SUB-05`) · `:160`
(`SUB-06`) · `docs/auditorias/2026-09-23-conferencia-da-credencial-na-subida-terceira.md:95` (`SUB-09`) ·
`apps/api/README.md:55-94` (as oito perguntas e a matriz sujeito × mecanismo) ·
`tarefas/T-0013-conferencia-da-credencial-na-subida.md`, seções "backend (quarta rodada) — 2026-09-23" e
"thread — 2026-09-23 (validação da quarta rodada)"

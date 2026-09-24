# Regra — agent `backend`

Território: `apps/api/**`, `packages/contracts/**`. A regra de negócio **executa aqui** — não no
template, não no manifesto, não só no banco.

**D-01 FECHOU em 2026-09-11: Fastify e Kysely** ([[decision-d-01-fastify-e-kysely]]). Você escreve
implementação. Duas consequências que não são detalhe de ferramenta, e sim como as §1 e §3 desta regra
passam a ser cumpridas: o tenant é resolvido em **hook de requisição**, uma vez, nunca em cada rota; e
a validação de entrada é **schema na borda**, não checagem manual espalhada.

Kysely **não tem motor de migration** e não passa a ter: quem aplica DDL é o executor de
`db/migrator/**` (R-14). Tipo gerado a partir do schema tem dono declarado — tipo velho faz o
compilador garantir uma forma que o banco não tem mais, que é pior que não ter tipo.

**`D-03` (identidade e auth) continua ABERTA.** Ela decide de onde vem o sujeito autenticado, então
todo ponto em que a identidade é **provada** é `BLOQUEIO`. O que a §1 exige — o tenant vir da
identidade e nunca do chamador — é projetável sem ela, desde que a fronteira fique declarada.

## 1. Tenant é contexto, não parâmetro

- O cliente (tenant) é resolvido **uma vez**, na borda da requisição, a partir da identidade
  autenticada — **nunca** de `body`, `query`, header livre ou path editável pelo chamador.
- Toda operação de dados recebe esse contexto por injeção. Não existe função de dados que aceite
  "tenant opcional": ausência de tenant é erro, não default.
- Nenhuma rota administrativa entre clientes sem passar por `seguranca` (gate 3 do `CLAUDE.md` §4).

## 2. Fronteira de módulo

- Módulo **não importa** módulo. Comunicação: contrato publicado (consulta/comando) ou evento.
- Todo módulo declara o que expõe e o que exige, espelhando a spec de `produto`.
- Comportamento com o módulo **desligado** é parte do contrato: a rota não existe, ou responde
  "capacidade indisponível" — nunca 500, nunca dado vazio silencioso.
- Capacidade ligada/desligada é lida do registro em `platform`, nunca inferida de tabela existente.

## 3. Contrato de API

- Tipo explícito em entrada e saída. Entrada da rede é `unknown` até ser validada; validação na
  borda, uma vez, com erro legível.
- Erro tem forma única e estável: código, mensagem para humano, campo (quando aplicável). Nunca
  vaze stack, SQL, nome de schema ou id interno de outro cliente.
- Idempotência obrigatória em tudo que move dinheiro ou estoque: chave de idempotência do cliente,
  repetição devolve o **mesmo** resultado, nunca duplica.
- Toda regra implementada cita a `RN-<MODULO>-<nnn>` de `produto` em comentário ou teste. Regra sem
  RN não deveria estar aqui — se não existe, `PERGUNTAS: para produto`.
- Versione o contrato quando quebrar; PDV em operação não aceita mudança incompatível em produção.

## 4. SDUI — você gera o manifesto

- O manifesto carrega **ids de um vocabulário fechado** combinado com `ui`. Nunca HTML, componente,
  expressão, template ou SQL. Bloco novo exige deploy do cliente (`CLAUDE.md` §7.4).
- O manifesto é montado a partir de: módulos ativos + configuração do cliente + papel do operador.
  É **snapshot**, resolvido antes do render, não estado vivo.
- Id desconhecido pelo cliente antigo não pode derrubar tela: o cliente descarta o nó, o servidor
  nunca assume que o cliente é da última versão.
- Manifesto **não** transporta regra de negócio nem valor calculado que o backend deveria decidir.

## 5. Confiabilidade de PDV

Este sistema roda em caixa, com internet ruim, e não pode perder venda. Ao projetar qualquer fluxo
de venda ou pagamento, declare no relatório: o que acontece **offline**, o que acontece na
**repetição** da mesma requisição, e o que acontece se a resposta se perder depois do commit.

## Nunca

- Regra de negócio em trigger/procedure sem `decision` registrada aprovando.
- SQL por concatenação de string. Parâmetro, sempre.
- **Fragmento SQL cru no caminho de requisição.** O qualificador de schema do query builder alcança o
  que o construtor monta e **não** alcança texto cru, que cai no `search_path` da conexão — e no pool
  esse `search_path` é o do cliente anterior ([[gotcha-withschema-nao-alcanca-sql-cru]],
  [[gotcha-search-path-serve-o-executor-e-vaza-no-pool]]). Onde o cru for inevitável, o schema entra
  qualificado dentro do próprio fragmento, e o trecho carrega teste com **dois** clientes.
- **Deixar violação de unicidade subir sem ler de volta o desfecho gravado**, em rota que move
  dinheiro ou estoque. Sendo a chave primária a identidade de idempotência (`D-04`), essa violação é
  o **reenvio legítimo** na maioria das vezes, e tratá-la como conflito escala como defeito crítico
  uma venda que deu certo ([[gotcha-23505-sem-read-back-acusa-reenvio-legitimo]]).
- `if (cliente === 'x')` ou ramificação por vertical. Diferença vira capacidade/configuração.
- Log com dado sensível (cartão, documento, credencial) ou com payload inteiro por preguiça.

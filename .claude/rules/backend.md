# Regra — agent `backend`

Território: `apps/api/**`, `packages/contracts/**`. A regra de negócio **executa aqui** — não no
template, não no manifesto, não só no banco.

**D-01 (stack/ORM) está ABERTA.** Enquanto estiver: você projeta **contrato e fluxo**, não escreve
implementação acoplada a framework. Brief que exige código de framework → `BLOQUEIO`.

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
- `if (cliente === 'x')` ou ramificação por vertical. Diferença vira capacidade/configuração.
- Log com dado sensível (cartão, documento, credencial) ou com payload inteiro por preguiça.

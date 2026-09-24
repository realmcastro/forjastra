# F-025 — O que o servidor recusa ou reconhece na borda passa a produzir fato

**Tipo:** Comportamento fechado · **Estado:** a fazer · **Dono:** `produto` (regra); desenho de
`backend` · **Território:** `docs/produto/**` · **Cobre o achado** `2.18` de
`docs/produto/captura-varredura-sem-rn-2026-09-23.md` · **Agrupador:** F-001 · **Rótulo:** captura

## Objetivo

Quatro decisões da borda do servidor passam a deixar fato. Hoje a regra diz o que responder e nunca o
que registrar (`.claude/rules/backend.md`):

| Decisão na borda | Onde | O que se perde |
|---|---|---|
| requisição sem identidade, ou sem tenant resolvível | `:21-24` | a sondagem de alcance a outro cliente, primeira coisa procurada quando se suspeita de vazamento |
| entrada recusada pela validação | `:37-38` | a versão de terminal que manda requisição malformada, vista em N clientes |
| pedido de capacidade desligada | `:31-32` | o terminal que continua pedindo o que o cliente desligou, e a demanda por módulo não contratado |
| reenvio de identidade já gravada | `:41-42`, `:59-61`, `:72-75` | a taxa de resposta perdida depois do commit, por terminal |

O precedente é `F-004`: a recusa de borda do executor vira evento porque recusa que só existe no chamador
some com ele. A borda da API é a mesma espécie, com mais tráfego.

A primeira linha não cabe em `RN-NUC-043`: requisição sem tenant não tem schema de cliente onde cair, e
a família de provedor (`fatos-de-operacao-provedor.md:301-336`) não tem linha para ela;
`provider_read_refused` é tentativa **nossa**. As outras três podem já estar em `RN-NUC-043`; a primeira
tarefa do item é conferir.

## Escopo

- Fato por causa, distinguível: sem identidade, tenant não resolvido, entrada inválida, capacidade
  indisponível, reenvio reconhecido.
- A casa de cada um: o que tem tenant resolvido é do cliente; o que não tem é nosso.
- A regra dona, citando `backend.md` e `F-004` como precedente.

## Fora de escopo

- Mudar qualquer resposta da borda: forma única de erro, "capacidade indisponível" e leitura de volta
  do reenvio continuam como estão.
- Limite de taxa, bloqueio, alerta.
- O comportamento atual de `apps/api/**`: é código, sai como pergunta ao `backend` (relatório de
  `T-0017`).

## Critério de aceite

1. Requisição sem identidade: resposta na forma única de erro, sem enumerar superfície, e existe fato
   nosso com o instante, a rota e a origem de rede reduzida ao que a investigação precisa, sem nenhum
   cliente atribuído.
2. Requisição autenticada com corpo inválido: resposta com o campo, e fato no cliente com a rota, a
   versão do terminal e o campo recusado, nunca o valor.
3. Terminal com manifesto velho pede capacidade desligada: resposta "capacidade indisponível", idêntica
   à de negado ao papel (`RN-NUC-036` a), e fato com a capacidade pedida.
4. Mesma venda enviada duas vezes com a mesma identidade: o segundo envio devolve o resultado gravado, e
   existe fato de reenvio reconhecido. Mil reenvios de um terminal numa hora aparecem como série.
5. Falha ao registrar não muda a resposta nem atrasa a venda.

## Registra / Não registra

**Registra:** a causa, a rota, o instante, a versão do terminal quando conhecida, e o cliente quando
resolvido.

**Não registra, e por quê:**

- O corpo da requisição e o valor do campo inválido: pode carregar dado de pessoa e dado de pagamento
  (`.claude/rules/backend.md:77`, `.claude/rules/seguranca.md` §3).
- Credencial apresentada, inteira ou em parte: nunca.
- Cliente adivinhado para a requisição sem tenant: atribuir cliente ao que não resolveu seria o
  vazamento que o fato existe para detectar.

## Depende de

**Parcialmente executável.** As linhas 2 a 4 são especificáveis hoje. A linha 1 depende de `F-017`
(`D-03`, eixo E3): de onde o tenant chega decide o que é "não resolvido". Conferência de `RN-NUC-043` e
de `fatos-de-operacao-dominios-fechados.md`, em edição em 2026-09-23, antes de escrever as linhas 2 e 3.

## Gate obrigatório

`seguranca` (a linha 1 é superfície de ataque, e o fato não pode virar oráculo de existência de
cliente) e `performance` (a borda é o caminho de toda venda).

## Referências

`docs/produto/captura-varredura-sem-rn-2026-09-23.md` §2.18 · `.claude/rules/backend.md:21-42`, `:59-61`,
`:72-77` · `F-004` · `F-017` · `docs/produto/fatos-de-operacao-provedor.md:301-336` ·
`docs/produto/superficie-por-papel.md:166-171` (`RN-NUC-036` a) ·
`docs/produto/fila-local-conteudo-e-repouso.md:82-84` · `RN-NUC-043`

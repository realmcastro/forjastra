# SPR-46 — Catálogo de mensagens e formatação única de dinheiro, quantidade e fuso

**Tipo:** História · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-09-24
**Agrupador:** SPR-35

---

## Objetivo

Fechar dois pontos que parecem pequenos e são os que mais apodrecem quando ficam para depois: de onde vem cada texto da interface, e quem formata valor monetário, quantidade e data/hora.

## Escopo

**Catálogo de mensagens.** Nenhuma string solta em componente. Todo texto da interface vem do catálogo, com chave — é o que permite trocar o texto de um erro sem tocar no componente, e o que torna auditoria de texto possível.

**Formatação por utilitário único.** Dinheiro, quantidade e data/hora são formatados em um lugar só. Duas formatações no produto significam dois arredondamentos, e um deles está errado.

**Algarismo tabular é obrigatório** em coluna de valor, de quantidade e de código. Largura de dígito variável faz o olho perder a linha em coluna numérica.

**O fuso vem de dado explícito, nunca do dispositivo.** ~~Qual entidade é dona do fuso — o estabelecimento ou o cliente — é `LACUNA-GLO-001`, ainda aberta (`memory/plataforma/state-pendencias-abertas-2026-08-23.md:41,63-65`, vence 2026-09-08). Esta issue não decide isso:~~ Desde 2026-09-23 o fuso é o **do estabelecimento a que o fato pertence**, no que vigia para ele no instante do fato, identificado pela região e nunca por deslocamento fixo (`RN-NUC-057`, `docs/produto/nucleo-estabelecimento.md:140`). O utilitário de formatação recebe o fuso como parâmetro explícito, ausência de fuso é erro, e nenhum caminho de código escolhe um fuso por default nem o lê do dispositivo, do servidor ou do cliente (tenant).

**A moeda também vem de dado explícito.** É a do estabelecimento no instante do fato (`RN-NUC-058`, `:186`), e o utilitário a recebe como parâmetro; ausência de moeda é erro, e nenhum caminho escolhe moeda padrão. Uma tela que mostra duas unidades em moedas diferentes mostra dois subtotais com a moeda nomeada, nunca um total único.

**O valor chega como string canônica e é só exibido.** A representação é a de `memory/plataforma/decision-dinheiro-e-quantidade.md`: string decimal na escala exata (`"17.90"`). O utilitário formata essa string para a tela, e formatar é caminho de ida: ele não arredonda, não faz conta, não aceita número JSON, e a string formatada nunca volta à rede (`tarefas/T-0018-dinheiro-e-quantidade.md`, E.2, item 4). Quando o terminal precisa compor valor sem contato, usa o módulo de ponto fixo de `F-030`, nunca este utilitário.

## Fora de escopo

O cálculo em si (total, desconto, imposto, repartição) — vem do backend ou, sem contato, do módulo de `F-030`. A interface exibe e coleta, não calcula. ~~A decisão de quem é dono do fuso (`LACUNA-GLO-001`) — de `SPR-36` e do humano.~~ A decisão de quem é dono do fuso e da moeda está tomada (`RN-NUC-057`, `RN-NUC-058`), e onde o terminal os lê é a configuração publicada retida (linha 38 da matriz do núcleo).

## Critério de aceite

* Um teste que varre os componentes e falha se encontrar string literal de interface fora do catálogo.
* ~~Formatação com resto: valor que não divide igualmente, conferido contra o resultado esperado.~~ O valor `"17.93"` chega e é exibido como R$ 17,93, sem reprocessar; `17.93` como número JSON é recusado; e nenhum teste do utilitário depende de dividir ou arredondar, porque ele não faz nenhuma das duas coisas.
* Mesmo instante formatado com dois fusos diferentes passados explicitamente ao utilitário, com o resultado de cada um afirmado no teste — inclusive na virada do dia — e um teste que afirma que chamar o utilitário sem fuso é erro. Caso de `RN-NUC-057`: o instante `2026-10-14T03:30Z` sai 2026-10-13 23h30 com `America/Manaus` e 2026-10-14 00h30 com `America/Sao_Paulo`.
* Mesmo valor formatado com duas moedas passadas explicitamente, com o resultado de cada uma afirmado, e chamar sem moeda é erro.
* Coluna numérica renderizada com algarismo tabular, verificado.

## Depende de

~~A decisão de tipo e unidade de dinheiro e quantidade (`SPR-39`, `SPR-40`). O utilitário de formatação consome aquela decisão; se nascer antes, nasce com a conversão errada embutida.~~ A decisão de tipo e unidade de dinheiro e quantidade **fechou em 2026-09-23** (`SPR-40`, `tarefas/T-0018-dinheiro-e-quantidade.md`): string canônica na rede. A parte de `SPR-39` que toca este item, instante sempre `timestamptz` em UTC, também está fechada (`D-04`, 2026-09-11). Nada mais trava o item; `F-030` não é pré-requisito, porque este utilitário não faz conta.

## Alterações — 2026-09-23

- **Fuso:** `LACUNA-GLO-001` fechou em `RN-NUC-057`; o parágrafo de "dois desfechos possíveis" virou a regra, e o aceite do fuso ganhou o caso de prova dela. Contra: o texto que esperava a lacuna.
- **Moeda:** entrou como parâmetro explícito, com aceite próprio. Prova: `RN-NUC-058` (`nucleo-estabelecimento.md:186-194`), que diz que nenhuma leitura soma moedas diferentes.
- **"Formatação com resto"** saiu do aceite. Contra: o aceite de 2026-08-26. Prova: a decisão de representação (`decision-dinheiro-e-quantidade`, e `T-0018`, E.2, item 4) tira do terminal qualquer arredondamento, e a repartição com resto é `RN-NUC-064`, executada por `F-030`. Um aceite de resto aqui convidaria o utilitário a dividir.
- **`Depende de`:** `SPR-40` fechou, e a parte de instante de `SPR-39` está fechada por `D-04` (`CLAUDE.md` §8).

## Referências

`.claude/rules/ui.md` §3 e §4 · `docs/design/tokens-forma-e-texto.md` · `.claude/rules/dados.md` §3 · `docs/produto/nucleo-estabelecimento.md:140` (`RN-NUC-057`) · `:186` (`RN-NUC-058`) · `memory/plataforma/decision-dinheiro-e-quantidade.md` · `tarefas/T-0018-dinheiro-e-quantidade.md` · `F-030` · `memory/plataforma/state-pendencias-abertas-2026-08-23.md:41,63-65`

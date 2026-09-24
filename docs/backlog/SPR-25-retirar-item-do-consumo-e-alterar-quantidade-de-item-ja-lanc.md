# SPR-25 — Retirar item do consumo, e alterar quantidade de item já lançado

**Tipo:** História · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-11-27
**Agrupador:** SPR-15

---

## Objetivo

Retirar um item já lançado num consumo em aberto — inteiro, ou em parte da quantidade — é **fato novo autorizado**: exige papel autorizado, motivo e trilha, e **não apaga** o lançamento original. **Aumentar** a quantidade não é edição: é **lançamento aditivo novo**. Nada nisto consulta estado de preparo.

Este card absorve `SPR-24` (alterar quantidade de item) — ver comentário de fusão em `SPR-24`.

## Escopo

O eixo é a natureza do fato, nunca o estado de preparo:

* Pedido **em construção** do núcleo é local ao terminal, mutável, e pode morrer sem virar venda — `RN-NUC-001` (`docs/produto/nucleo-venda.md:92`). É dele que sai a remoção imediata, sem papel e sem motivo.
* Lançamento em **consumo aberto** é fato com autor e instante, e sai por **retirada autorizada** — `RN-MSA-004` (`docs/produto/modulos/mesa-comanda.md:125`).
* **"Enviado × não enviado" não é eixo desta regra.** É estado de `COZ`, e `RN-MSA-012` (`docs/produto/modulos/mesa-comanda.md:241`) diz que `MSA` **não consulta** estado de preparo para aceitar, alterar ou encerrar consumo. O que acontece com o trabalho já feito é `RN-COZ-007` (`docs/produto/modulos/cozinha.md:169`), **sem consulta de volta**.
* **Quem pode** é a célula da matriz, nunca esta prosa (`RN-NUC-039`, `docs/produto/matriz-operacao-papel-contrato.md:213`): a linha "Retirar item lançado" (`docs/produto/matriz-operacao-papel-modulos.md:69`) é `R` para `manager` e `owner`, `N·cfg` para `cashier` — concedível pela configuração de `RN-MSA-013`, sempre **com registro** — e **recusa** offline.

## Critério de aceite

1. Operador com papel apenas de lançamento tenta retirar item → **negado no backend**, mesmo que a interface tenha sido burlada, e a tentativa entra na trilha.
2. Quem a célula da matriz autoriza retira → o consumo passa a não cobrar o item, e a trilha mostra **lançamento e retirada**, cada um com autor, instante e motivo.
3. Reduzir a quantidade de 3 para 1 → registra **retirada de 2**, com autor e motivo; o lançamento de 3 continua existindo na trilha.
4. Aumentar de 1 para 3 → **dois lançamentos aditivos novos**, cada um com autor e instante próprios; nenhuma linha existente é editada (`RN-PCF-006`, `docs/produto/modulos/pedido-cliente-final.md:183`).
5. Retirar item **já produzido** → a retirada do consumo **não desfaz** a produção; o trabalho é encerrado pelo caminho de `COZ` como produzido-e-descartado, com autor e motivo, e o descarte fica declarado (`RN-COZ-007`). A retirada **não espera** nem consulta esse desfecho.
6. Com `COZ` **desligado**, os itens 1 a 5 se comportam igual, e nenhuma etapa cita produção (`RN-MSA-012`).
7. Quantidade inválida é **recusada na borda**, nos dois sentidos: retirada maior que a quantidade lançada, e quantidade fora da escala declarada da unidade de medida do item (`RN-NUC-013`). A recusa nomeia o limite.
8. Retirada tentada enquanto o dispositivo **não tem o consumo em estado confirmado** → **recusada**, apresentando o último estado conhecido e o instante dele, e quem opera decide. Nunca "última escrita ganha", nunca resolução por relógio (`RN-MSA-011`, `docs/produto/modulos/mesa-comanda.md:224`; `RN-OFF-009`, `docs/produto/operacao-offline-e-sincronizacao.md:102`).

## Fora de escopo

Regras de correção de item **já enviado** à produção são `SPR-30`, correção por lançamento novo. Atualizar o acumulado do consumo depois da retirada é `SPR-29`, que compõe o acumulado.

## Gate obrigatório

Segurança — operação sensível de PDV (retirada de item lançado exige autorização de papel e registro de auditoria, `.claude/rules/seguranca.md` §2).

## Referências

`docs/produto/modulos/mesa-comanda.md:125` · `:224` · `:241` · `:255` · `docs/produto/nucleo-venda.md:92` · `docs/produto/modulos/cozinha.md:169` · `docs/produto/modulos/pedido-cliente-final.md:183` · `docs/produto/matriz-operacao-papel-contrato.md:213` · `docs/produto/matriz-operacao-papel-modulos.md:69` · `docs/produto/operacao-offline-e-sincronizacao.md:102` · `SPR-24` · `SPR-29` · `SPR-30`

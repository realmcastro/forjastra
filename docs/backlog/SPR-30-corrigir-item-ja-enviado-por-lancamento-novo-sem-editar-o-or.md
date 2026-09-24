# SPR-30 — Corrigir item já enviado por lançamento novo, sem editar o original

**Tipo:** História · **Estado ao migrar:** A fazer · **Prazo que constava:** 2026-11-27
**Agrupador:** SPR-15

---

## Objetivo

Corrigir um item já enviado à produção é **retirada autorizada mais lançamento novo**, nunca edição da linha original. `RN-PCF-006` (`docs/produto/modulos/pedido-cliente-final.md:183`) diz isso literalmente: "alterar quantidade de item já lançado não existe aqui: é retirada autorizada (`RN-MSA-004`) mais lançamento novo". A linha antiga permanece na trilha, marcada como corrigida, com autor, instante e motivo. A correção não consulta estado de preparo para acontecer (`RN-MSA-012`, `docs/produto/modulos/mesa-comanda.md:241`) — o que acontece com o trabalho já feito é `RN-COZ-007` (`docs/produto/modulos/cozinha.md:169`), e a correção **não espera** esse desfecho.

A necessidade é o cliente-final mudar de ideia depois de o item ter sido enviado à produção, e quem atende precisa registrar isso na hora, sem chamar gerente para cada caso — não está em discussão. O mecanismo recusado ("o item poderá ser editado após o envio", "não é necessário apresentar histórico detalhado no MVP") apaga o que aconteceu antes: se a produção viu "com cebola" e o cliente-final diz que pediu "sem cebola", depois da edição não existe registro de qual das duas era verdade, e é o mesmo caminho pelo qual o item lançado por engano some sem autor — o modo de furto que `RN-MSA-004` foi escrita para fechar. No mecanismo que fica, o histórico **não é trabalho a mais**: grava-se a retirada e o lançamento novo, e o histórico existe sem nenhuma linha adicional — é a prova de que o mecanismo recusado custava mais, não menos (critério de aceite 7, abaixo).

## Escopo

**Quem pode** é a célula da matriz, nunca esta prosa (`RN-NUC-039`, `docs/produto/matriz-operacao-papel-contrato.md:213`). A linha "Retirar item lançado" (`docs/produto/matriz-operacao-papel-modulos.md:69`) é `R` para `manager` e `owner`, `N·cfg` para `cashier` — concedível pela configuração de `RN-MSA-013`, sempre **com registro** — e **recusa** offline. O lançamento novo segue a linha de lançamento, que é `P` para os três.

## Critério de aceite

1. Corrigir item já enviado → a trilha do consumo mostra **duas** linhas, a retirada e o lançamento novo, cada uma com autor, instante e motivo. A linha original **continua existindo**, e nenhuma é editada.
2. Operador sem a autorização da célula tenta corrigir → **negado no backend**, mesmo com a interface burlada, e a tentativa entra na trilha.
3. Quem opera distingue, na apresentação do consumo, que aquele item sofreu correção — sem consultar identificador interno e sem abrir a trilha. A **forma** do sinal é território de `ui`; o que este card exige é que o sinal exista e não dependa só de cor.
4. O ponto de produção recebe a correção como **fato novo**, não como item que mudou por baixo — trabalho nasce do lançamento (`RN-COZ-001`, `docs/produto/modulos/cozinha.md:88`).
5. Item **já produzido** quando a correção chega → a produção **não é desfeita**; o trabalho é encerrado pelo caminho de `COZ` como produzido-e-descartado, com autor e motivo, e o descarte fica declarado (`RN-COZ-007`).
6. Com `COZ` **desligado**, os itens 1 a 3 se comportam igual, e nenhuma etapa cita produção (`RN-MSA-012`).
7. O histórico da correção está disponível **sem nenhum registro extra ter sido gravado para isso** — ele é a própria trilha dos aceites 1 e 2.
8. Correção tentada enquanto o dispositivo **não tem o consumo em estado confirmado** → **recusada**, apresentando o último estado conhecido e o instante dele, e quem opera decide. Nunca "última escrita ganha" (`RN-MSA-011`, `docs/produto/modulos/mesa-comanda.md:224`; `RN-OFF-009`, `docs/produto/operacao-offline-e-sincronizacao.md:102`).

## Depende de

"A edição poderá alterar suas informações permitidas" — **quais** atributos de um item de catálogo são corrigíveis depende de classificar variação por eixos (`G-04`) e adicional/complemento (`G-05`), perguntas abertas ao humano. O mecanismo do Objetivo **não** depende delas: retirada mais lançamento novo vale para qualquer atributo, e foi escrito para não mudar quando o conjunto for decidido. A observação do item de pedido já tem regra e não espera nenhuma `G` (`RN-NUC-016`, `docs/produto/nucleo-publicacao-e-texto.md:160`).

## Fora de escopo

`SPR-25` é retirada e alteração de quantidade em **consumo em aberto**. Este card é a correção de item **já enviado à produção**: mesmo mecanismo, e o que ele acrescenta é o sinal a quem opera (critério 3) e o desfecho na produção (critérios 4 e 5). Nenhum dos dois consulta estado de preparo para decidir se aceita.

## Gate obrigatório

Segurança — operação sensível de PDV (correção de item exige autorização de papel e registro de auditoria, `.claude/rules/seguranca.md` §2).

## Referências

`docs/produto/modulos/mesa-comanda.md:125` · `:224` · `:241` · `docs/produto/modulos/pedido-cliente-final.md:183` · `docs/produto/modulos/cozinha.md:88` · `:169` · `docs/produto/matriz-operacao-papel-contrato.md:213` · `docs/produto/matriz-operacao-papel-modulos.md:69` · `docs/produto/nucleo-publicacao-e-texto.md:160` · `docs/produto/operacao-offline-e-sincronizacao.md:102` · `SPR-25`

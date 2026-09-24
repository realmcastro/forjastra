# F-023 — O "registro interno" para onde vai o detalhe técnico da recusa passa a existir

**Tipo:** Comportamento fechado · **Estado:** a fazer · **Dono:** `produto` · **Território:**
`docs/produto/**` · **Cobre o achado** `2.16` de `docs/produto/captura-varredura-sem-rn-2026-09-23.md`
· **Agrupador:** F-001 · **Rótulo:** captura

## Objetivo

Dar endereço ao registro que `PN-17` promete. Três textos mandam o detalhe técnico para lá, e nenhuma
spec diz o que ele é:

- `postura-nova-geracao.md:300-301`: "o detalhe técnico não é recusado: muda de lugar, vai para o
  registro interno"; `:306-307`: "sem perder informação — o técnico ganha registro melhor que o print da
  tela".
- `docs/design/estados-e-interacao.md:161`: "o detalhe técnico vai para o registro interno e não
  aparece aqui".
- `docs/design/tolerancia-de-versao.md:34`: "descarte é registrado internamente".

O `Como se prova` de `PN-17` (`:308-309`) varre as mensagens visíveis e nada mais. A metade da promessa
que fala de quem investiga depois não tem aceite, e o operador que vê "não foi possível concluir,
chame o gerente" deixa, hoje, a mesma informação técnica que deixaria sem `PN-17`: nenhuma.

## Escopo

- O que o registro interno contém, por recusa exibida: a ligação com o fato de recusa (`RN-NUC-043`),
  o detalhe técnico que a mensagem omitiu, e a referência curta de ocorrência que
  `estados-e-interacao.md:170-172` já permite mostrar ao lado da mensagem.
- Quem lê, e em que escopo: é diagnóstico **nosso** de defeito visto em N clientes, então a família de
  provedor (`fatos-de-operacao-provedor.md`) é a candidata a casa, com as travas dela.
- A regra dona, e a correção do `Como se prova` de `PN-17` para cobrir as duas metades.
- A frase de `tolerancia-de-versao.md:34` reconciliada com `F-012`: ou o descarte já é registrado (e
  `ui` diz onde), ou a frase está errada. O item não aceita as duas verdades.

## Fora de escopo

- A mensagem ao operador: `PN-17` e `estados-e-interacao.md` §3.4 já a decidem, e nada muda nela.
- Formato de log, ferramenta de observabilidade, retenção: mecanismo e `D-06`.
- O fato de descarte de nó: `F-012` e `F-022`.

## Critério de aceite

1. Recusa exibida ao operador com texto de operação e referência curta de ocorrência: a partir da
   referência, quem investiga chega ao detalhe técnico daquela ocorrência, e o detalhe nunca aparece na
   tela do caixa.
2. A mesma recusa técnica em três clientes: a leitura nossa conta as três e diz qual defeito é, sem
   revelar a um cliente que os outros dois existem.
3. O detalhe técnico nunca contém segredo, SQL com valor, nome de schema de outro cliente nem dado de
   cartão (`.claude/rules/seguranca.md` §3).
4. Registrar o detalhe falha: a recusa continua exibida com a próxima ação, e a falha vira fato próprio.

## Registra / Não registra

**Registra:** o detalhe técnico da recusa, ligado ao fato de recusa e à referência curta; terminal,
versão do cliente, instante.

**Não registra, e por quê:**

- Payload inteiro da requisição: `.claude/rules/backend.md:77` proíbe por preguiça, e ele carrega dado de
  cliente que o diagnóstico não pede.
- Identificação do operador no registro nosso: a pergunta é "onde o produto falha", e `RN-NUC-043` já
  guarda o autor do lado do cliente.
- Valor de credencial, cartão ou documento de pessoa: nunca.

## Depende de

Leitura do corpo de `RN-NUC-043` e da lista de motivos em `fatos-de-operacao-dominios-fechados.md`, que
estavam em edição em 2026-09-23. Se o motivo enumerado já carrega um campo de detalhe livre, o item
encolhe para a correção do `Como se prova` e da frase de `tolerancia-de-versao.md:34`. Pergunta ao `ui`,
antes de escrever: o código de `packages/sdui/src/manifest/` registra o descarte em algum lugar hoje?

## Gate obrigatório

`produto` (fronteira de provedor) e `seguranca`: registro com detalhe técnico é o lugar mais provável de
vazar schema, consulta ou id de outro cliente.

## Referências

`docs/produto/captura-varredura-sem-rn-2026-09-23.md` §2.16 · `docs/produto/postura-nova-geracao.md:296-309` ·
`docs/design/estados-e-interacao.md:158-172` · `docs/design/tolerancia-de-versao.md:34` ·
`docs/produto/captura-varredura-terceira-passada-2026-09-12.md:124-128` · `F-012` · `RN-NUC-043`

# F-018 — Decidir as lacunas de regra que travam as Fases 1 e 2, e pôr aviso de indisponibilidade no que depende de terceiro

**Tipo:** Comportamento fechado (regra) · **Estado:** a fazer · **Dono:** `produto` (spec, `RN`, aviso);
thread principal (decide e registra `decision`/`business-rule` em `memory/`) · **Território:**
`docs/produto/**`

> **Origem.** Pedido do humano em 2026-09-23: "sobre as decisões, você faz o que for melhor para a
> escalabilidade. A lacuna de periféricos precisa nascer, pois então que ela nasça. [...] O que não
> tiver ao seu alcance, você vai continuando o restante e coloca um aviso claro lá na hora da, do módulo
> tal coisa não funciona porque precisa de tal coisa." Regra de trabalho em
> `memory/processo/convention-decisao-delegada-com-aviso-no-modulo.md`.

## Objetivo

Toda lacuna de regra que impede modelar o núcleo (Fase 1) ou fechar o fluxo de venda e pagamento com
idempotência e offline (Fase 2, `.claude/rules/processo.md` §4) termina de um de dois jeitos:

```
lacuna do conjunto
→ a resposta depende de terceiro (contador, advogado, adquirente, loja real, norma de instrumento)?
   ├─ não → decidida pelo thread, critério de escalabilidade, recusado e motivo registrados
   │        → lacuna marcada FECHADA na spec, com data e ponteiro para o registro
   │        → RN escrita ou alterada na mesma passada, quando a decisão cria regra
   └─ sim → não se decide por analogia
            → aviso de indisponibilidade na spec e no módulo afetados
            → o resto do módulo segue sendo construído
```

O aviso tem forma fixa, e é esta:

```
> **Indisponível — <capacidade>.** Não funciona: <o quê>. Falta: <dependência>. Responde: <quem>.
> Enquanto isso: <o que o módulo faz: recusa, fica desligado ou opera sem X>. Desde: 2026-09-23.
```

Exemplo montado só com texto que já está escrito (`docs/produto/nucleo-venda.md:366-368`), para mostrar
a forma, e ele não classifica a lacuna por quem executar este item:

```
> **Indisponível — correção aditiva de venda concluída sem contato, antes da autorização do documento.**
> Não funciona: corrigir no mesmo dia, sem rede, uma venda já concluída. Falta: confirmação de que a
> correção aditiva antes da autorização é admitida. Responde: humano, com o contador.
> Enquanto isso: recusa até haver conexão (`RN-NUC-008`, infeliz). Desde: 2026-09-23.
```

## Escopo

**O conjunto de partida.** É a lista que já está em disco, e quem executa a fecha antes de decidir a
primeira (critério 1). As lacunas estão nas seções de lacuna de `nucleo-venda.md` §6,
`nucleo-estabelecimento.md` §4, `operacao-offline-e-sincronizacao.md` §8,
`fila-local-autoridade-e-identidade.md` §5, `fila-local-conteudo-e-repouso.md` §5,
`papeis-e-permissoes.md` §6 e `backlog-lacunas-g01-g09.md`; nas citações de lacuna do corpo de
`nucleo-caixa-e-turno.md` e `nucleo-publicacao-e-texto.md`, que não têm seção própria; e nas perguntas de
`dois-varejos-auditoria-do-nucleo-2026-09-12.md` §5.

| Lacuna | O que decide | Quem responde, segundo a fonte | Trava |
|---|---|---|---|
| `LACUNA-GLO-001` = `NUC-001` = `OFF-006` | fuso do estabelecimento ou do cliente (tenant) | humano | `F-021`, `SPR-37`, `SPR-46` |
| `LACUNA-NUC-041` | moeda do cliente ou do estabelecimento | humano | `F-021`, `SPR-40` |
| `LACUNA-NUC-042` | encerrar estabelecimento existe como operação | humano, depois `produto` | `F-021` |
| `LACUNA-NUC-043` | estabelecimento muda de cliente | humano, com `seguranca` antes de virar regra | `F-021` |
| `G-09` = `LACUNA-NUC-004` | arredondamento e ordem de precisão | humano **com o contador** | `SPR-40`, `SPR-28`, `SPR-29` |
| `G-01` | as três reservas de modelo da Opção B | humano | `SPR-37` |
| `G-02` = metade de `LACUNA-NUC-007`, e `Q-C` | o que é turno | humano; `Q-C` pergunta à loja real | `SPR-37` |
| `LACUNA-NUC-003` | grão e reinício da referência humana da venda | humano, com `arquiteto-dados` | `SPR-37` |
| `G-03`, `G-04`, `G-05` | fronteira núcleo × módulo em catálogo | humano + `produto` | `SPR-31`, `SPR-32`, `SPR-33` |
| `LACUNA-NUC-002`, `LACUNA-NUC-006` | preço aberto; domínio de meios de pagamento | humano; a `006` **com o adquirente** | Fase 2, pagamento |
| `LACUNA-NUC-005` | correção aditiva antes da autorização | humano **com o contador** | Fase 2, venda offline |
| `LACUNA-OFF-004`, `OFF-011`, `OFF-016`, `OFF-017` | teto offline, validade do papel retido, reconciliação do conjunto, prazo da habilitação | humano | Fase 2, offline |
| `LACUNA-PER-6` — **FECHADA em 2026-09-23 → `RN-NUC-063`** | leitura válida de código ausente do catálogo retido, sem contato | `produto`, na spec do núcleo (`fatos-de-operacao-dominios-fechados.md` §1) | nenhuma; `F-007` destravado |
| habilitar e renovar terminal a vender **não tem linha** em `matriz-operacao-papel.md` | quem faz o ato de `RN-OFF-032`(i), que hoje é negado a todos pelo default | humano (valor de célula) | `F-021`, Fase 2 |
| `Q-A`, `Q-B`, `Q-D` de `dois-varejos` §5 | classificação de três linhas da fronteira (`A-04`, `A-01`, `A-03`) | **loja real**; `Q-D` **com o contador** | só se a linha decidir coluna do núcleo; senão sai do conjunto com o motivo |
| `LACUNA-PER-2` | casas e tolerância de quantidade medida, e exigência sobre o instrumento | humano; **norma não confirmada** | `SPR-40` na escala de quantidade |

A linha da matriz foi medida em 2026-09-23: `grep habilita` nos três arquivos de matriz não encontra
operação de habilitar terminal; as linhas 30 e 34 cobrem transferir fila e registrar furto. É achado,
não decisão, e o executor o confirma antes de tratá-lo.

**`LACUNA-PER-6` é a lacuna de periféricos do pedido, e fechou em 2026-09-23** como `RN-NUC-063`
(`fatos-de-operacao-dominios-fechados.md` §1), com o motivo `item_identifier_unresolved` na mesma
passada, porque enumeração aplicada depois não estreita nada (`RN-NUC-043`). Ficha: `T-0016`. Esta
linha e a da tabela diziam "nasce" e "destrava"; mudaram para o estado real, e o número é `063` porque
`057` colidiu com `nucleo-estabelecimento.md:140`. O caso vizinho que depende de terceiro, a etiqueta de
balança em faixa `2x`, recebeu aviso em `RN-NUC-063`, infeliz (f).

**Ordem dentro do item.** As quatro de que `F-021` depende (fuso, moeda, `042`, `043`) vão primeiro,
depois `G-09` e `LACUNA-PER-2` (as duas que `SPR-40` espera), depois as de `SPR-37`, depois as da Fase
2. Quem pega o item não precisa terminá-lo para destravar `F-021`.

## Fora de escopo

- **As lacunas que outro item fecha.** `LACUNA-IDE-*` e `LACUNA-NUC-011` são de `F-017`; a residência
  da trilha é de `F-019`; a casa do catálogo fiscal é de `F-020`. Cada item diz as suas.
- **Lacuna que só trava módulo (Fase 4 em diante)**: `G-06`, `G-07`, `G-08`, `LACUNA-PER-1`, `PER-3`,
  `PER-4`, `PER-5`, as de `ATI`, `PCF`, `REL`, `COZ` e `MSA`. Entram aqui só se o executor mostrar, com
  `path:linha`, que uma delas decide coluna do núcleo ou desfecho do fluxo de venda.
- **O escopo `provedor`** (`state-pendencias-abertas-2026-08-23.md` §1 e §4). Não trava modelo do
  núcleo, e o que dele trava a Fase 1 está em `F-019`.
- **O conteúdo que o terceiro responde.** Alíquota, norma de instrumento, domínio do adquirente, base
  legal. O item põe o aviso; a resposta chega quando chegar.
- **Aviso em código ou em tela.** O aviso deste item mora na spec. Levá-lo ao catálogo de mensagens e ao
  manifesto é de `ui` e de `backend`, quando o módulo existir.
- **Terminal-alvo de referência** (`state-pendencias` §3.5). É pergunta de medida, de `performance`.

## Critério de aceite

1. **O conjunto está fechado antes da primeira decisão.** Uma tabela com toda lacuna que trava Fase 1 ou
   2, cada uma com `path:linha`, conferida contra as seções de lacuna listadas no Escopo. Lacuna
   encontrada depois entra com data; lacuna recusada do conjunto sai com o motivo.
2. **Toda linha da tabela termina em FECHADA ou em aviso.** Nenhuma fica "em análise".
3. **FECHADA** quer dizer: a linha da lacuna na spec diz `FECHADA em <data>` e aponta o registro em
   `memory/`; o registro tem o que foi escolhido, o que foi recusado e o motivo; e a `RN` que a decisão
   cria ou altera está escrita na mesma passada, com a célula da matriz junto quando a decisão muda quem
   pode (`memory/plataforma/gotcha-regra-nova-que-nao-corrige-a-celula-nasce-inerte.md`).
4. **Escalabilidade nomeia o que cresce.** Cada decisão diz em que eixo ela escala (N clientes, N
   estabelecimentos por cliente, N verticais, N terminais) e o que a opção recusada custaria nesse eixo.
   "Escala melhor" sem o eixo não é motivo.
5. **Aviso**: nenhuma lacuna cuja fonte nomeia contador, advogado, adquirente, loja real ou norma é
   decidida. Ela recebe o aviso na forma fixa, na spec onde a `RN` afetada mora e na spec do módulo quando
   a capacidade é de módulo, e o `Enquanto isso` cita a `RN` ou o default que já produz aquele desfecho.
   Aviso cujo `Enquanto isso` inventa comportamento novo não passa.
6. **Caso de prova do fuso**, que é o de maior alcance: cliente (tenant) com estabelecimento A em
   `America/Sao_Paulo` e B em `America/Manaus`, venda em B às 23h30 hora de Manaus. A decisão diz, sem
   ambiguidade, a que dia essa venda pertence no fechamento de B e na leitura que soma A e B.

**Caminho infeliz.** A decisão contradiz uma `RN` aprovada: a `RN` é alterada na mesma passada, com a
redação anterior citada e o motivo. Decisão que deixa duas regras vigentes dizendo coisas diferentes é o
mesmo defeito que o fuso já é hoje (`memory/plataforma/gotcha-fuso-do-estabelecimento-versus-fuso-do-cliente.md`).

## Registra / Não registra

**Registra:**

- Cada decisão, datada, com o recusado e o motivo, no escopo de memória certo (`.claude/rules/memoria.md`
  §1). Decisão não registrada é presunção, e é a única coisa que a regra de 2026-09-23 não afrouxou.
- Cada aviso, com a data em que passou a valer. É ela que diz depois há quanto tempo a capacidade está
  indisponível e quem ainda não respondeu.

**Não registra, e por quê:**

- **Resposta de terceiro inferida.** Nenhuma alíquota, norma, prazo legal ou regra de adquirente entra
  como fato do produto sem fonte (`.claude/rules/produto.md`, Nunca). Fica o aviso, que diz exatamente
  isso.
- **Dado real das duas lojas.** As perguntas de `dois-varejos` §5 descrevem o caso; resposta que chegar
  com dado de cliente entra descrita, nunca colada (`.claude/rules/backlog.md` §9).

## Depende de

**Nada, e o item é executável hoje.** As fontes estão todas em disco, e a regra de trabalho que permite
decidir está registrada desde 2026-09-23. O que depende de terceiro não trava o item: vira aviso.

## Gate obrigatório

Nenhum dos cinco para o item como um todo. Uma lacuna do conjunto traz gate próprio, escrito na fonte:
`LACUNA-NUC-043` passa por `seguranca` **antes** de virar regra, porque o caminho que ela abriria é
travessia entre ambientes isolados (`nucleo-estabelecimento.md:178-181`). A mesma trava vale para
`LACUNA-NUC-036` (travessia entre pessoas jurídicas, `nucleo-venda.md:385-391`) se o executor a puser no
conjunto. Decidir qualquer uma delas sem o gate é defeito do item.

## Referências

`memory/processo/convention-decisao-delegada-com-aviso-no-modulo.md` ·
`docs/produto/dois-varejos-auditoria-do-nucleo-2026-09-12.md` §5 · `docs/produto/nucleo-venda.md:342-395` ·
`docs/produto/nucleo-estabelecimento.md:166-181` · `docs/produto/operacao-offline-e-sincronizacao.md:338-358` ·
`docs/produto/fila-local-autoridade-e-identidade.md:300-340` · `docs/produto/backlog-lacunas-g01-g09.md` ·
`docs/produto/modulos/perifericos.md:314` (`PER-2`) · `:336` (`PER-6`, fechada → `RN-NUC-063`,
`docs/produto/fatos-de-operacao-dominios-fechados.md:137`) ·
`docs/produto/matriz-operacao-papel.md:85` · `:89` · `memory/plataforma/state-pendencias-abertas-2026-08-23.md` §0 · §3 ·
`docs/backlog/F-007-codigo-lido-e-nao-resolvido-tem-motivo-proprio.md` · `docs/backlog/F-021-modelar-estabelecimento-e-terminal-habilitado.md` ·
`docs/backlog/SPR-40-fechar-tipo-unidade-e-escala-de-dinheiro-e-de-quantidade.md`

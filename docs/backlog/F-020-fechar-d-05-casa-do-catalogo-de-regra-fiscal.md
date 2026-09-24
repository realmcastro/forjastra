# F-020 — Fechar `D-05`: onde mora a regra fiscal que vale para mais de um cliente

**Tipo:** Comportamento fechado (decisão) · **Estado:** a fazer · **Dono:** `arquiteto-dados` (desenho
das três saídas contra as restrições); thread principal (decide e registra); `seguranca` audita ·
**Território do desenho:** `db/**`

> **Origem.** Pedido do humano em 2026-09-23: "sobre as decisões, você faz o que for melhor para a
> escalabilidade [...] O que não tiver ao seu alcance, você vai continuando o restante e coloca um aviso
> claro". Regra de trabalho em `memory/processo/convention-decisao-delegada-com-aviso-no-modulo.md`. A
> casa do catálogo é decisão de arquitetura e se decide aqui; o conteúdo das alíquotas é do contador e
> não se decide em lugar nenhum deste item.

## Objetivo

Decidir onde mora a regra fiscal de abrangência maior que um cliente (tenant), como a alíquota de uma
UF, a versão de um layout, a vigência de uma regra, e registrar a decisão com o recusado e o motivo.
Enquanto `D-05` não fechar, `FIS` não é modelável (`docs/produto/roadmap-de-modulos.md:317-319`), e `FIS`
entra ativo no MVP 1 com ou sem `EMI` (`:158`).

As três saídas conhecidas, com o defeito de cada uma (`roadmap-de-modulos.md:306-315`,
`memory/plataforma/decision-d-05-catalogo-de-regra-fiscal-sem-casa.md`):

| Saída | O que resolve | O defeito |
|---|---|---|
| `platform` | uma cópia só, restrição declarativa no banco | "nenhuma tabela de cliente vive no `platform`" (`.claude/rules/dados.md` §1), e o fato de venda passaria a referenciar fora do schema dele |
| replicada em cada schema de cliente | a venda lê só o próprio schema | publicar regra vira escrita em N schemas, que divergem em silêncio, e a divergência parece erro de cadastro de um cliente só |
| artefato versionado que acompanha o release | divergência entre clientes deixa de existir | perde restrição declarativa: nada no banco impede o dado de contradizer o artefato |

## Escopo

- **Escolher uma das três, ou uma quarta com o defeito dela escrito na mesma frase.** A linha proposta
  em `D-06` (a residência segue o objeto do fato, nunca o leitor) é candidata a critério, e o registro
  diz se a usou: o objeto de uma alíquota de UF não é nenhum cliente.
- **Escalabilidade nomeada pelo eixo.** O catálogo cresce em N clientes que leem a mesma regra e em N
  mudanças de regra por ano que chegam por lei, sem data escolhida por nós. O registro diz o que cada
  saída custa nos dois eixos, inclusive o custo da terceira quando uma alíquota muda e o release não
  está pronto.
- **A regra que é do cliente** (regime, inscrição, exceção que só ele tem) fica no schema dele em
  qualquer saída; o registro diz onde passa a fronteira entre as duas espécies.
- **A linha `D-05` na tabela do `CLAUDE.md` §8**, onde ela hoje não está
  (`decision-d-05-catalogo-de-regra-fiscal-sem-casa.md`: "colocá-la lá é ato do humano"; com a regra de
  2026-09-23 o ato passa ao thread, e entra como `FECHADA → [[slug]]`).

## Fora de escopo

- **O conteúdo das alíquotas, bases e exceções.** É do contador. Onde uma `RN-FIS` depende de conteúdo
  que ninguém confirmou, ela recebe o aviso de indisponibilidade de `F-018`; este item não a toca.
- **Modelar `FIS`.** Este item decide a casa; as tabelas de `FIS` são item próprio de `arquiteto-dados`,
  depois dele, com o gate 2.
- **O grão do congelado** (`roadmap-de-modulos.md` §7.2, `RN-FIS-004`, `RN-FIS-005`). É a outra metade do
  que torna `FIS` não modelável, e ela está nas reservas de `G-01`, que `F-018` fecha.
- **`D-06`(i) e (iii).** O agregado que soma clientes e a observação por cliente seguem abertos.
- **`EMI`.** Desligado por padrão no perfil-alvo inicial (`T-0005`), e fora daqui.

## Critério de aceite

1. **Caso da mudança de alíquota.** Uma UF muda uma alíquota com vigência a partir de um dia D. Os
   clientes X e Y têm estabelecimento nessa UF. Venda em X às 23h59 da véspera e venda em Y à 0h01 de D,
   hora local do estabelecimento (`RN-FIS-008`, `fiscal-regimes-e-vigencia.md:142`): cada uma congela a
   versão que vigia no instante dela (`RN-NUC-015`), e o registro diz, na saída escolhida, **como é
   impossível** X e Y congelarem versões diferentes para o mesmo instante, ou, se não for impossível, como
   a divergência é detectada e por quem.
2. **Caso do terminal sem contato.** Resolver qual versão de regra vale é `integral` nos três domínios de
   falha (`docs/produto/operacao-offline-e-sincronizacao.md:145`). O registro diz como a versão chega ao
   terminal, e o que ele aplica quando a nova vigência começa com ele offline.
3. **Caso de isolamento.** Na saída escolhida, uma sessão do cliente X não alcança nenhum dado do cliente
   Y, e o registro diz se a leitura do catálogo sai do schema de X; se sair, o gate de `seguranca` a
   auditou.
4. **Registro `decision` em `memory/plataforma/`**, com `supera:
   [[decision-d-05-catalogo-de-regra-fiscal-sem-casa]]`, e a linha de `D-05` no `CLAUDE.md` §8.

**Caminho infeliz.** Uma lei muda a alíquota com vigência de um dia para o outro, sem tempo de preparar
nada. A saída escolhida diz o que acontece com a venda do dia D enquanto a versão nova não chegou: vende
com a versão velha e o fato registra qual versão aplicou, ou recusa. Qual dos dois é regra de `FIS` e
talvez do contador; o que este item garante é que a casa escolhida não torna uma das duas impossível.

## Registra / Não registra

**Registra:** cada publicação de versão do catálogo, com vigência declarada, instante de publicação e
quem publicou (`RN-NUC-013`, `RN-NUC-014`: não existe membro publicado sem vigência). E a versão que cada
fato de venda congelou, que já é exigência de `RN-NUC-015`; a casa escolhida não pode tirar dela a
capacidade de apontar para uma versão que continua existindo.

Versão publicada e depois substituída continua existindo, inclusive a que nunca chegou a vigir: ela
responde "o que estava publicado naquele dia".

**Não registra, e por quê:** um fato de leitura do catálogo por cliente. Qual cliente aplicou qual
versão já é derivável do congelado de cada venda; um fato de leitura à parte repetiria o congelado e
poderia divergir dele.

## Depende de

**Nada em aberto, e o item é executável hoje.** As três saídas e os defeitos estão escritos desde
2026-08-23; `D-01` fechou, o que dá à terceira saída um formato concreto para avaliar. O critério 1
depende de qual fuso decide a vigência, e isso não trava a decisão: `RN-FIS-008` já diz que é o do
estabelecimento, e se `F-018` mudar isso o caso muda de hora, não de desfecho.

## Gate obrigatório

**`seguranca`**, se a saída escolhida fizer a sessão de cliente ler fora do próprio schema (saída
`platform` ou qualquer variação dela). **Checklist de `.claude/rules/dados.md` §6** para a saída
escolhida. **`performance`** não mede nada aqui, porque não há consulta ainda; o registro declara como
`ESTIMATIVA` o custo da leitura da regra no fechamento da venda, que tem orçamento de 1 s
(`.claude/rules/performance.md` §3), e o gate 4 vale quando a consulta existir.

## Referências

`memory/plataforma/decision-d-05-catalogo-de-regra-fiscal-sem-casa.md` ·
`memory/plataforma/decision-d-06-sao-tres-residencias-nao-uma.md` (a linha "residência segue o objeto") ·
`memory/processo/convention-decisao-delegada-com-aviso-no-modulo.md` ·
`docs/produto/roadmap-de-modulos.md:158` · §7.1 · §7.2 · `docs/produto/fiscal-regimes-e-vigencia.md:142` ·
`docs/produto/nucleo-publicacao-e-texto.md:131` (`RN-NUC-015`) ·
`docs/produto/operacao-offline-e-sincronizacao.md:145` · `.claude/rules/dados.md` §1 · §6 ·
`.claude/rules/migrations.md` §9 · `tarefas/T-0005-opcao-b-emissao-fiscal-por-perfil.md`

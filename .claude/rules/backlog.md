# Regra — Backlog e registro de trabalho

Substituiu `jira.md` em 2026-09-11, quando a ferramenta externa foi abandonada. O que ela guardava
está em `docs/backlog/`, migrado com corpo integral.

Tudo mora no repositório agora. **Dois artefatos, e a diferença entre eles é o tempo verbal:**

| Onde | O quê | Tempo |
|---|---|---|
| `docs/backlog/` | um arquivo por item, o que **ainda não** começou | futuro |
| `tarefas/` | a ficha, o raciocínio do que **está** ou **esteve** em execução | presente e passado |

Item que começa ganha ficha. A ficha aponta para o item; o item não se apaga quando a ficha nasce.

Leitura obrigatória para o `orquestrador`, para o thread principal e para o `produto` (o dono do
backlog). Os outros sete agents não precisam: entregam relatório e pronto.

## 1. Por que saímos da ferramenta externa

Ela existia para coordenar três pessoas. Desde 2026-09-11 há uma
([[state-execucao-solo-2026-09-11]]), e um board que só um leitor abre não é registro público: é um
segundo lugar onde a verdade mora, com o custo de mantê-la sincronizada e o risco de as duas cópias
divergirem em silêncio.

O que se perdeu, e vale saber: notificação, quadro visual e acesso de quem não tem o repositório.
Nenhum dos três tinha usuário. O que se ganhou é que **o registro está a um `grep` de distância** e
entra no mesmo commit que a mudança que ele descreve.

Isto não é um convite a abandonar registro. É o oposto: sem ferramenta que cobre, a disciplina passa
a ser inteiramente do processo. Trabalho sem item e sem ficha é trabalho invisível para a próxima
sessão, que não tem a memória desta.

## 2. Nenhum trabalho começa sem item

O item existe **antes** do Plano de Despacho. Pedido que só existe no chat não vira despacho: o
thread principal cria o arquivo em `docs/backlog/` e só então chama o `orquestrador`.

Vale inclusive para o encurtamento de `processo.md` §5. Tarefa pequena segue dispensando plano e
ficha; **não** dispensa item. Criar o arquivo custa uma escrita.

Exceção única: **conversa não é tarefa.** Pergunta respondida e encerrada na triagem não gera nada.

## 3. Identificador

- Os 56 itens migrados mantêm `SPR-<n>`, **congelado**. Não renomeie: a memória e as fichas os citam
  por esse nome, e renomear quebraria referência em troca de estética.
- **Item novo nasce `F-<nnn>`**, sequencial a partir de `F-001`, nunca reaproveitado.
- O prefixo mudou de propósito. `SPR` quer dizer "Sistema de Pedido de Restaurantes", o erro de
  framing que o `CLAUDE.md` §7.3 proíbe e que [[gotcha-board-spr-e-nomeado-pela-vertical]] registra.
  A Forja não é um sistema de restaurante, e o identificador do trabalho parou de dizer que é.
- Nome do arquivo: `F-<nnn>-<slug>.md`. Uma linha no `docs/backlog/INDEX.md` na mesma passada.

## 4. O par item ↔ ficha

Um para um. A ficha carrega o identificador no frontmatter:

```yaml
---
id: T-0009
backlog: F-001            # ou SPR-34, para item migrado
titulo: <curto>
status: aberta | bloqueada | fechada
---
```

Item que precisaria de duas fichas estava mal recortado: quebre o item, não a ficha.
`tarefas/INDEX.md` traz o identificador na linha.

## 5. Estado

O estado de um item **é** o estado da ficha dele, e mora na ficha. Não existe segundo lugar para
estar errado.

| Ficha | Item |
|---|---|
| não existe ainda | está em `docs/backlog/`, e só |
| `aberta` | a linha do `INDEX.md` do backlog aponta para a ficha |
| `bloqueada` | a linha diz **bloqueada** e nomeia a pergunta que trava, com a data |
| `fechada` | a linha aponta para a ficha fechada |

**Bloqueio é visível ou não existe.** `BLOQUEIO` que fica só no corpo da ficha some: quem abrir o
índice vê a tarefa andando enquanto ela espera decisão.

Ficha e item fecham no mesmo passo, e é o `orquestrador` que autoriza. Item de pronto pendente não
fecha nenhum dos dois (`processo.md` §2).

## 6. Espelhamento morreu, e essa é a melhoria real

Não existe mais copiar artefato de um lugar para outro. Plano, relatório e fechamento moram na
ficha, **uma vez**. A regra de comentário append-only some junto (era `jira.md` §4): a ficha já é append-only por
construção, porque cada agent acrescenta a sua seção e nunca toca na de outro, e o histórico de
verdade está no git.

O que **não** morreu: a ficha continua recebendo o relatório **verbatim**. Resumir relatório na ficha
é a mesma perda de sempre, agora sem ferramenta para culpar.

## 7. Quem escreve onde

| Papel | Escreve |
|---|---|
| `produto` | **dono do backlog**: cria, edita, recorta e funde item em `docs/backlog/**` |
| thread principal | cria a ficha, atualiza estado e índice |
| `orquestrador` | decide **o que** entra no fechamento e quando fecha |
| os outros seis agents | **nada** em `docs/backlog/`. Só a própria seção na ficha |

As três travas de `produto` continuam valendo inteiras, e a segunda mais do que antes:

1. **Escopo não muda sem contexto e sem prova** (`path:linha` da spec, a regra, ou resposta
   registrada do humano, citada no próprio item). "Faz mais sentido assim" é preferência.
2. **Item não se exclui porque alguém quer**, inclusive quando quem quer é o humano. Exclusão exige
   as quatro partes de `00-nucleo.md` §12, e a justificativa vai antes para
   `docs/produto/backlog-recortes.md` citando o identificador. `produto` recomenda; **o humano
   autoriza**. Isso ficou mais importante, não menos: apagar arquivo é mais fácil que apagar card, e
   não deixa rastro fora do git.
3. **Edição segue a régua da exclusão.** Diga no item o que mudou, por quê, e contra o quê. O texto
   anterior se preserva, e agora o git faz isso sozinho, desde que a mudança entre em commit próprio.

**Item mal escrito não é item desnecessário.** A pergunta é se a necessidade existe.

## 8. Anatomia do item

Idêntica à que já valia, e continua sendo julgada pelas quatro perguntas de `produto.md`. Duas
formas, conforme o que o item entrega:

**Comportamento fechado** (regra, contrato, modelo): `Objetivo` · `Escopo` · `Fora de escopo` ·
`Critério de aceite` · **`Registra / Não registra`** · `Depende de` · `Gate obrigatório` ·
`Referências`. A seção de captura tem **duas** listas, e a segunda — o que o fluxo deliberadamente
**não** registra, com motivo — é obrigatória: `CLAUDE.md` §7.10, detalhe em `.claude/rules/produto.md`.

**Prova ou validação técnica**, cujo desfecho é evidência: `Contexto` (o mecanismo, com diagrama
quando houver etapas, terminando na pergunta que a prova responde) · `O que testar` (cenário por
cenário, numerado, cada um com o desfecho exato) · `Entrega` (artefato, duplos de teste, registro por
cenário) · `Critério de conclusão` (aceite é observação documentada, não todo cenário passando).

`Fora de escopo` e `Referências` são obrigatórias nas duas. O padrão completo, com a rubrica de
registro por cenário, está em `.claude/rules/produto.md`.

Regras do texto, e nenhuma é estilística:

- **Critério de aceite é caso concreto, não adjetivo.** Item sem ele é desejo.
- **Vocabulário do núcleo**: venda, item, pedido, pagamento, operador, turno, cliente-final,
  catálogo. Termo de ramo só quando o item **é** de módulo de vertical.
- **Data sempre absoluta** (`AAAA-MM-DD`).
- **Nenhuma referência a IA**, em nenhum campo.

## 9. O que continua fora, mesmo estando tudo no repo

`docs/backlog/` é conteúdo versionado como qualquer outro, e as proibições de sempre valem:

- **Segredo, nunca** (`00-nucleo.md` §8).
- **Dado real de cliente**: descreva o caso, não cole o dado.
- **`docs/auditorias/`** entra por `path:linha`, nunca colado. Auditoria descreve como atacar o
  sistema, e o item é lido por quem procura o que fazer, não por quem precisa daquele detalhe.

Uma proteção que a ferramenta externa dava e o repositório não dá: lá o acesso era separado. Aqui,
quem clona tem tudo. Na dúvida, referencie.

## 10. Como um item é dado por entregue

1. **Confira a definição de pronto item por item** (`processo.md` §2). Item que não se aplica é
   declarado como "não se aplica: <por quê>". Silêncio não conta como cumprido.
2. **Escreva o fechamento na ficha**, no formato abaixo.
3. **Atualize a linha do `INDEX.md`** do backlog e a de `tarefas/INDEX.md`, na mesma passada.

```
## Fechamento — AAAA-MM-DD

ENTREGUE: <o que passou a existir, verbo no passado>
ARQUIVOS: <paths>
VERIFICAÇÃO: <o que foi rodado de fato — ou "não rodei: <motivo>">
PRONTO: <item por item, cada um cumprido ou "não se aplica: …">
SOBROU: <o que ficou para depois, com dono, ou "—">
```

**Entrega parcial não fecha.** Falta item? A ficha continua `aberta` e o que falta é declarado.
`STATUS: PARCIAL` é entrega válida; ficha fechada por cansaço não é.

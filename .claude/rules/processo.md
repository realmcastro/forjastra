# Regra — O processo, de ponta a ponta

`handoff.md` define os **artefatos** (plano, ficha, relatório, consulta). Este arquivo define o
**ciclo**: como uma tarefa nasce, avança, é validada e fecha — e quando o ciclo pode ser encurtado.

## 1. Ciclo de vida de uma tarefa

| Etapa | Quem | Saída |
|---|---|---|
| 1. Triagem | thread principal | é conversa ou é trabalho? conversa termina aqui |
| 2. Plano | agent `orquestrador` | Plano de Despacho |
| 3. Ficha | thread principal | `tarefas/T-<id>-<slug>.md` a partir de `tarefas/_TEMPLATE.md` |
| 4. Execução | agents especialistas | seção na ficha + Relatório de Handoff |
| 5. Validação | thread principal | relatório confere com o brief? gate cumprido? |
| 6. Roteamento | `orquestrador` | `PERGUNTAS` viram consulta; `BLOQUEIO` resolve ou escala |
| 7. Gates | auditores | `seguranca` / `performance` conforme `CLAUDE.md` §4 |
| 8. Fechamento | `orquestrador` | memória escrita, ficha fechada, `tarefas/INDEX.md` atualizado |

Nunca pule a etapa 5. Relatório aceito sem leitura é como defeito entra: o agent diz "OK", o
orquestrador propaga o "OK", e ninguém olhou o arquivo.

Defeito encontrado na validação → **novo despacho ao dono do território**, nunca correção inline
pelo thread principal. Corrigir por fora quebra o território e o próximo agent trabalha sobre uma
base que a ficha não descreve.

## 2. Definição de pronto

Nenhuma tarefa fecha sem, no que se aplicar à camada tocada:

- **Regra de negócio** existe em `docs/produto/**`, numerada `RN-<MODULO>-<nnn>`, com critério de
  aceite — e o código cita esse número.
- **Comportamento novo ou corrigido** tem teste do caso concreto do critério de aceite. Bug fix tem
  teste de regressão que **falha sem o fix** (os dois sentidos rodados, ditos em `VERIFICAÇÃO`).
- **DDL** passou pelo checklist de `migrations.md` §10 e pelo gate de `seguranca`.
- **Endpoint** passou pelo gate de `seguranca` (autorização + escopo de tenant).
- **Consulta, lista, relatório ou tela** passou pelo gate de `performance`.
- **Decisão não óbvia** tomada no caminho virou registro em `memory/`, no escopo certo, com a linha
  de índice na mesma passada.
- **Nada de segredo** entrou no repo, em nenhum arquivo, nem em exemplo.
- Toda `MEMÓRIA SUGERIDA` foi escrita, fundida ou recusada **com motivo**.

Item que não se aplica é declarado como "não se aplica: <por quê>" no fechamento. Silêncio não conta
como cumprido.

## 3. Cadência de validação — em checkpoint, não a cada passo

Escrever teste é obrigatório sempre (§2). **Rodar** a validação pesada é decisão do orquestrador:

- Durante o trabalho: só o subset dirigido do que foi tocado.
- Gate completo (suíte inteira, type check do projeto, build): antes de entregar um **bloco coeso**,
  quando o humano pede, ou antes de commit.
- Exceção sempre barata: o teste de regressão de um bug fix, rodado nos dois sentidos.

Por quê: build em cima de build trava desenvolvimento assistido por IA e queima tempo e contexto sem
achar nada novo. O brief do agent diz explicitamente "roda validação agora" ou "adia pro checkpoint".

## 4. Ciclo de fases do projeto

Uma fase termina quando o que ela entrega **não precisa mais ser refeito** pela fase seguinte. Fase
não é prazo, é dependência.

| Fase | Entrega | Fecha quando |
|---|---|---|
| 0 | arquitetura de trabalho com IA | agents, regras, memória e fichas em pé |
| 1 | modelo de dados do núcleo de venda | modelo aprovado no gate de `seguranca`, D-04 fechada |
| 2 | contratos e API do núcleo | fluxo de venda/pagamento com idempotência e offline definidos |
| 3 | catálogo de componentes + SDUI | manifesto resolvendo tela real com degradação provada |
| 4+ | módulos, um por vez | cada módulo plugável sem tocar o núcleo |

**Regra de fase:** não crie estrutura de uma fase futura (`apps/`, `packages/`, `db/`) antes da fase
que a cria. Estrutura criada cedo é palpite que depois ninguém tem coragem de mexer.

Ao virar de fase: `state` de memória atualizado, `CLAUDE.md` §2 e §8 revisados, decisão fechada
migrada da tabela de abertas para registro `decision`.

## 5. Quando encurtar o processo

O processo serve o trabalho, não o contrário. Pode ir direto ao agent dono, sem plano nem ficha,
quando **tudo** isto vale: uma camada só, um agent só, nenhum gate aplicável, nenhuma decisão em
aberto envolvida, e o resultado é verificável em um olhar.

Não pode encurtar, nunca: DDL, autorização, dinheiro, fronteira de módulo, ou qualquer coisa que
toque mais de um território. Aí a ficha existe justamente porque o custo de errar é maior que o custo
do ritual.

Cerimônia demais em tarefa pequena treina o humano a ignorar o processo — e aí ele é ignorado
também na tarefa grande, que é onde ele importa.

## 6. Auditoria periódica

`seguranca` e `performance` não rodam só sob demanda. A cada bloco coeso entregue (fim de fase, ou
módulo concluído), roda auditoria de escopo declarado, com relatório em `docs/auditorias/`. Achado
aberto que reaparece é marcado **reincidente** — reincidência é sinal de falha do processo, não do
código, e vira pauta com o humano.

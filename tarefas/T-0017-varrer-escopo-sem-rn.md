---
id: T-0017
backlog: F-016
titulo: Varrer, atrás de captura ausente, o escopo que nunca terá RN
status: aberta
escopo: cliente=- vertical=- modulo=- camada=produto
aberta_em: 2026-09-23
---

## Pedido

"Cara, sobre as decisões, você faz o que for melhor para a escalabilidade. A lacuna de periféricos
precisa nascer, pois então que ela nasça. A gente vai fazer a base e bem feita. O que não tiver ao seu
alcance, você vai continuando o restante e coloca um aviso claro lá na hora da, do módulo tal coisa não
funciona porque precisa de tal coisa." (humano, 2026-09-23)

Regra de trabalho que saiu disso: [[convention-decisao-delegada-com-aviso-no-modulo]]. Plano da base
inteiro, com as ondas, no relatório do `orquestrador` de 2026-09-23; aqui entra só a parte desta ficha.

## Plano

## PLANO: T-D (T-0017), F-016
BACKLOG: F-016
ESCOPO: o item como está escrito. O corpus é congelado por `git ls-files` **no despacho**.
FORA DE ESCOPO: o que o item já exclui; arquivo criado depois do congelamento (os novos de `docs/arquitetura/` desta onda ficam fora e nomeados); aplicar correção.
ESCOPO DE MEMÓRIA: cliente=- vertical=- modulo=- camada=produto
DECISÕES ABERTAS QUE TOCAM ISSO: nenhuma.
PASSOS:
1. D.1 `produto`
   - **Brief:** executar o `F-016`. Os itens nascem de `F-022` em diante.
   - Achado em `.claude/**` ou `CLAUDE.md` vira item com dono humano ou thread e a nota "aplicação pode depender de permissão de escrita em `.claude/**`, negada em 2026-09-23".
   - Escreve só o relatório e os itens novos. Não edita `superficie-por-papel-momentos.md` (só lê).
   - **Entrega:** `docs/produto/captura-varredura-sem-rn-2026-09-23.md` e `F-022`+.
   - Onda 1, paralelo. É o primeiro a adiar se você quiser menos instâncias simultâneas.
GATES: nenhum (é prova).
RISCO PRINCIPAL: colidir na numeração de item com outra instância. A reserva feita em P0 resolve.

## Fechamento

—

## produto — 2026-09-23 (D.1, execução do F-016)

## RELATÓRIO — produto — T-0017
STATUS: PARCIAL
FEITO:
- Congelei o corpus do `F-016` pelo que estava em disco no despacho: 31 arquivos (14 em `.claude/rules/`, 8 em `docs/design/`, 7 em `docs/arquitetura/`, `CLAUDE.md` e `docs/produto/superficie-por-papel-momentos.md`). Nenhum arquivo em movimento estava dentro do escopo, então não precisei marcar nenhum arquivo do corpus como "adiado para a segunda passada".
- Passei cada arquivo por lente com seletor diferente de zero. A tabela de cobertura está no relatório §2, uma linha por arquivo.
- Registrei nove achados, 2.15 a 2.23, e criei oito itens, `F-022` a `F-029`, cada um agrupado por fluxo e com dono. O 2.23 não virou item, e o motivo está escrito: a ausência pode já estar decidida em `RN-NUC-045`, que fica em arquivo em movimento.
- Acrescentei as oito linhas ao `docs/backlog/INDEX.md`, depois do `F-021`. Não mexi em nenhuma outra linha.
- Encontrei uma divergência pela lente C em `superficie-por-papel-momentos.md` (:96-97, :180-181, :216) contra `RN-NUC-028`/`029`. A mesma redação sem condição aparece em `papeis-atribuicao-e-delegacao.md:77`.
ARQUIVOS:
- /home/mcastro/work/freelas/forja/docs/produto/captura-varredura-sem-rn-2026-09-23.md (novo)
- /home/mcastro/work/freelas/forja/docs/backlog/F-022-composicao-degradada-alem-do-id-desconhecido-vira-fato.md (novo)
- /home/mcastro/work/freelas/forja/docs/backlog/F-023-registro-interno-da-recusa-ganha-endereco.md (novo)
- /home/mcastro/work/freelas/forja/docs/backlog/F-024-regras-que-fecham-comportamento-fazem-a-pergunta-de-captura.md (novo; dono humano ou thread; leva a nota de permissão de `.claude/**`)
- /home/mcastro/work/freelas/forja/docs/backlog/F-025-recusa-na-borda-do-servidor-vira-fato.md (novo)
- /home/mcastro/work/freelas/forja/docs/backlog/F-026-recusa-no-canal-local-vira-fato.md (novo, não executável)
- /home/mcastro/work/freelas/forja/docs/backlog/F-027-gesto-do-operador-que-nao-vira-operacao-deixa-fato.md (novo)
- /home/mcastro/work/freelas/forja/docs/backlog/F-028-leitura-recusada-em-camada-modal-vira-fato.md (novo, não executável antes de `T-0016` fechar)
- /home/mcastro/work/freelas/forja/docs/backlog/F-029-superficie-por-momento-nomeia-a-fonte-do-registro.md (novo)
- /home/mcastro/work/freelas/forja/docs/backlog/INDEX.md (editado: só as linhas 53-60)
- os 31 arquivos do corpus, mais os arquivos de `docs/produto/` citados para conferir endereço (só leitura)
NÃO FEITO:
- **`sha256` e `comm`.** Eu não tenho shell, só leitura e busca. O congelamento guarda a contagem de linhas de cada arquivo (`rg -c`), que é um substituto mais fraco e está declarado como tal. O critério 1 do `F-016` pede a saída de um comando, e essa saída não existe ainda. O comando pronto está no relatório §7. Se o thread rodar, o esperado é que `comm -3` devolva só os dois arquivos novos de `docs/arquitetura/` com data de 2026-09-23.
- **Conferências adiadas.** Algumas verificações do tipo "o fato sobrevive em outro endereço" dependem de arquivos que outras instâncias estão editando hoje. Não li o corpo deles:
  - `RN-NUC-043` e a lista de motivos (para 2.16, 2.18, 2.21 e a negação em `seguranca.md` §2);
  - `RN-NUC-045` (para 2.23);
  - `nucleo-venda.md` e `nucleo-caixa-e-turno.md` (para 2.20);
  - 37 das 85 citações de `RN` em `superficie-por-papel-momentos.md`.
  Das 48 citações em arquivo legível, 26 conferi contra o corpo da `RN` e 22 só contra o título.
DECISÕES:
- **2.23 ficou sem item.** Criar item para uma ausência que pode estar decidida é tratar decidida como acidental. A condição de volta está escrita no relatório.
- **Recomendo fundir `F-022` em `F-012` e absorver `F-028` em `F-007`**, mas não fiz, porque o despacho só me deixa escrever de `F-022` em diante. Fusão tira um arquivo do backlog, então conta como exclusão: a justificativa precisa ir antes para `docs/produto/backlog-recortes.md`, e quem autoriza é o humano.
- **Criei `F-028` como item próprio**, com estado "não executável antes de `T-0016` fechar". O motivo: `F-007` está em execução e altera a mesma lista de motivos de `RN-NUC-043`. Um item paralelo causaria edição concorrente, e sem item o achado se perderia.
- **Na §4 do relatório, "transbordo" ficou fora dos achados**, com o motivo escrito: é um descarte que o contrato do bloco já declara, não um descarte decidido pelo terminal na hora.
- **`CLAUDE.md` passou de 219 para 223 linhas durante a passada.** Por isso o relatório cita `CLAUDE.md` por seção, nunca por linha. Os outros 30 arquivos terminaram com a mesma contagem do início.
RISCOS:
- A terceira passada (`captura-varredura-terceira-passada-2026-09-12.md:124-128`) toma `PN-17` como exemplar. O 2.16 mostra que o destino que `PN-17` promete não tem endereço em nenhuma spec. Não editei esse arquivo.
- `tolerancia-de-versao.md:34` diz que o descarte "é registrado internamente", e `F-012` diz que não existe fato de descarte. Uma das duas está errada, e o código de `packages/sdui/src/manifest/` decide qual.
- O acompanhante do arranjo D não aparece como território em `CLAUDE.md` §4, e o contrato do canal local não tem item.
- Enquanto `F-024` não for aplicado, toda decisão nova de `ui` e de `backend` continua podendo fechar captura sem que ninguém pergunte o que se perde.
- O `docs/backlog/INDEX.md` foi alterado em disco por outra instância enquanto eu trabalhava. Minha edição entrou limpa, só nas linhas 53-60.
- A contagem de citações em `superficie-por-papel-momentos.md` era 70 (medida em 2026-09-12) e hoje dá 85. Não investiguei a diferença.
PERGUNTAS:
  - para ui: o código de `packages/sdui/src/manifest/` (`parse.ts`, `screen.ts`) registra hoje o descarte de nó ou a mudança de degrau em algum lugar? Onde?
  - para backend: `apps/api/**` registra hoje, em algum lugar, requisição sem identidade, entrada recusada pela validação, capacidade indisponível ou reenvio reconhecido pela leitura de volta?
  - para humano: quem é dono do acompanhante nativo e do contrato do canal local? Nenhum agent tem esse território.
  - para humano: autoriza fundir `F-022` em `F-012` e absorver `F-028` em `F-007`, com a justificativa registrada antes em `backlog-recortes.md`?
VERIFICAÇÃO:
- Rodei, com as ferramentas de leitura:
  - Glob das cinco zonas, no início e no fim;
  - `rg -c '.*'` em todos os arquivos, no congelamento e no fim;
  - a busca dirigida da §6 (227 ocorrências em 24 arquivos) e a busca fiscal (51 ocorrências em 4 arquivos);
  - `rg -o` das citações de `RN` (85);
  - leitura inteira de 27 arquivos do corpus;
  - leitura dirigida dos três dossiês fiscais que sobram (só as linhas encontradas pela busca);
  - leitura de todos os trechos citados de `docs/produto/`, `db/convencoes.md:204` e `db/migrations/platform/0004__executor_events.sql:144`.
- Não rodei `sha256sum` nem `comm`: sem shell.
MEMÓRIA SUGERIDA:
  - type=gotcha escopo=processo slug=gotcha-agent-produto-sem-shell-nao-prova-conjunto — o agent `produto` não tem shell; brief que exige `sha256` ou `comm` precisa dizer que o thread roda o comando, senão o critério de conclusão da prova fica inatingível por construção.
  - type=gotcha escopo=plataforma slug=gotcha-ui-e-backend-nao-carregam-invariante-10 — até `F-024` ser aplicado, `ui.md` e `backend.md` decidem descarte, fallback e recusa de borda sem pergunta de captura; toda spec desses territórios precisa passar pela varredura depois.
PRÓXIMO PASSO SUGERIDO: thread principal — rodar o comando do relatório §7 e colar a saída na ficha; depois agendar a segunda passada das conferências adiadas, quando os arquivos de `docs/produto/` em edição hoje estabilizarem.

## thread — 2026-09-23 (conferência por conjunto e respostas)

**Comando da §7 do relatório, rodado pelo thread em 2026-09-23.** `comm -3 conjunto cobertura` devolveu
exatamente o desfecho esperado, e nada além disso:

```
docs/arquitetura/d-06-trilha-residencia-2026-09-23.md
docs/arquitetura/dinheiro-e-quantidade-2026-09-23.md
```

Os dois são arquivos novos de 2026-09-23, fora do congelamento, e estão nomeados. `wc -l` do conjunto
somou `7118` linhas. `sha256` de cada arquivo (prefixo de 12):

```
b77a219a4458 CLAUDE.md
74e2424b3f3d .claude/rules/00-nucleo.md
10d31fd227d6 .claude/rules/backend.md
604f57bfdb52 .claude/rules/backlog.md
7ad76b425cf9 .claude/rules/coder.md
19c9a73885e7 .claude/rules/dados.md
d07b20de8188 .claude/rules/git.md
639802b09a69 .claude/rules/handoff.md
19565f6f0b1e .claude/rules/memoria.md
2a94d01e2d73 .claude/rules/migrations.md
a5b669529f8d .claude/rules/performance.md
0b488386a233 .claude/rules/processo.md
1ce1eabe4e3b .claude/rules/produto.md
64ad9dbffb13 .claude/rules/seguranca.md
102eb9c4ea1f .claude/rules/ui.md
cf12e065ce97 docs/arquitetura/d-01-d-02-stack-opcoes.md
0f9b51b32bf1 docs/arquitetura/d-03-identidade-opcoes.md
0d39c7f3d223 docs/arquitetura/d-06-trilha-residencia-2026-09-23.md
6094fa892b5d docs/arquitetura/dinheiro-e-quantidade-2026-09-23.md
b354552214ec docs/arquitetura/fiscal/2026-08-22-adendo-base-de-calculo-e-gorjeta.md
5ce27aeab945 docs/arquitetura/fiscal/2026-08-22-dossie-emissao-propria.md
774101166c72 docs/arquitetura/fiscal/2026-08-22-dossie-iva-ibs-cbs-2.md
eedae1f7c9cc docs/arquitetura/fiscal/2026-08-22-dossie-iva-ibs-cbs.md
0a419f38f96d docs/arquitetura/README.md
acfa9bf8af6d docs/design/estados-e-interacao.md
1051318bafa5 docs/design/foco-teclado-e-leitor.md
f04712a651ce docs/design/grade-e-espacos.md
9c3afdd53c99 docs/design/tokens-cor.md
2945330f2fd0 docs/design/tokens-forma-e-texto.md
dc81a07f4114 docs/design/tokens.md
025a8af98500 docs/design/tolerancia-de-versao.md
ccaf9792369a docs/design/vocabulario-e-eixos.md
c351002517f3 docs/produto/superficie-por-papel-momentos.md
```

**Respostas às perguntas do D.1**, conferidas pelo thread por `grep` e leitura direta:
- **`ui`: `packages/sdui` registra o descarte?** Não como fato. `screen.ts` devolve `discards` no
  resultado para quem chama (`screen.ts:56`, `:87`), e nada persiste nem emite. `F-012` está certo, e
  `docs/design/tolerancia-de-versao.md:34` ("registrado internamente") é meia verdade: o descarte é
  **devolvido**, não registrado.
- **`backend`: `apps/api` registra recusa?** Registra `request_rejected_no_identity`,
  `request_rejected_scope_unresolved`, `request_rejected_invalid_input` e `request_failed_internal`, com
  as duas listas declaradas (`apps/api/src/observability/border-facts.ts:4-40`). Não registra
  capacidade indisponível nem reenvio reconhecido pela leitura de volta, porque nenhuma rota de negócio
  existe ainda. O destino é a saída padrão do processo e não é trilha até `D-06`(ii) fechar (`T-0019`).
  `F-025` deve partir disso, não do zero.
- **Dono do acompanhante nativo e do canal local:** decidido pelo thread, por delegação: é o `backend`
  (é processo Node, e o canal local é contrato de fronteira). O território nasce com a fase que o cria.
  Registrado no `CLAUDE.md` §4.
- **Fundir `F-022` em `F-012` e absorver `F-028` em `F-007`:** autorizado pelo thread, por delegação. A
  justificativa vai antes para `docs/produto/backlog-recortes.md`, pelo `produto` (`backlog.md` §7).
  Fica como próximo passo, **sem despacho**: o humano pediu em 2026-09-23 que nenhum agente novo seja
  disparado.

**A ficha continua aberta.** O critério 1 do `F-016` agora está cumprido, mas as conferências adiadas
(`RN-NUC-043`, `045`, `nucleo-venda.md`, `nucleo-caixa-e-turno.md` e 37 citações de
`superficie-por-papel-momentos.md`) pedem uma segunda passada quando os arquivos estabilizarem.
